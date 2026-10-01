# L5-chat 03 · Step 8 协议实现契约

> 状态：done；gate_status：pass_with_upstream_blockers；日期：2026-10-01。
> 前置：Step7 done/pass_with_upstream_blockers。回填：未来正式03 §7及接口索引；本轮不装配。
> 输入：正式02 §7全部43项；Step6唯一本地schema，Step7 typed ports；详细设计SOP Step8/书写规范5.7；L1-governance Step8分族、字段来源、二级类型、response、停审模板。
> 所有声明为planned TS客户端契约，不定义SDK公开方法、HTTP路径、topic、owner DTO或后端worker。

## 1. Step内计划

| 顺序 | 范围 | 状态 | gate |
|---|---|---|---|
| 8-A | 基础envelope/完整清单/字段来源 | done | 不重复metadata/authority |
| 8-B | 两业务Command+预览/恢复入口4项 | done | SDK幂等/正式result |
| 8-C | 20 Query分navigation、materials、local、project/process/directory | done | 字段级view/page/negative |
| 8-D | 7 Consumer | done | 正式change/resume/host与local receipt |
| 8-E | 2诊断意图+8Job+2local actions | done | 不重放/不产证据 |
| 8-F | 43项cross audit | done | schema→factory→port→flow |

## 2. SOP回答、问题诊断和取舍

本项目是TS客户端，按Step3语言裁剪规范的Rust协议模板转为TS typed local usecase。所有入口传输为app内部函数调用，业务经SDK正式ports；无Chat backend HTTP/RPC/topic或公开可序列化的owner envelope。43项全部独立定义：4个Command栏入口（其中2业务Command、1正式只读preview候选、1local recovery）、20 Query、7 Consumer、2诊断意图、8Job、2local actions。

旧正式03只historical_material，不据此派生wire/schema；本步用Step6已定义Input/Projection/VM精确构造，不建立重复truth。external exact export未确认保持CHAT-UP001～009/WS-UP/host/storage blocked。Query读owner不写owner，应用qualified结果仅写local display；read-only preview如需副作用则blocked。诊断默认disabled，不宣称report/evidence。

业务actor统一trusted QualifiedSession，request.context保留scope/target/source/visibility；不让UI自行填actor/token。入口resolve用EntryResolutionFence，当前scope由结果证明；Consumer来自可信SDK/host，来源可信不绕过当前actor/scope/access。没有后台system actor权限例外。

## 3. Shared local schema与版本纪律

定义在app/application_composition.ts的usecase facade类型；仅本地边界，不serialize内存句柄。

```ts
/** 同一协议的完整local请求，session只来自trusted composition。 */
interface ClientRequest<T> {
  /** 本地schema仅1，不等于SDK event schema版本。 */ readonly schemaVersion: 1;
  /** typed payload，不重复actor/cursor等字段。 */ readonly input: T;
  /** 业务读取/提交必填；host/local有当前session时仍核对。 */ readonly session: QualifiedSession | null;
}
/** 返回当前local已应用版本，非owner提交或bus receipt。 */
interface ClientReply<T> {
  /** 投影/本地结果，无raw SDK response。 */ readonly value: T;
  /** 此结果应用/读取时的root.version；不是完成时间。 */ readonly localVersion: LocalVersion;
}
/** Consumer本地处置，不是SDK ACK/业务result。 */
interface LocalConsumerReceipt {
  readonly disposition: "applied" | "duplicate" | "ignored" | "blocked" | "restricted" | "needs_requery";
  readonly sourceRef: ExternalHandle<"source"> | null;
  readonly changeRef: ExternalHandle<"change"> | null;
  readonly localVersion: LocalVersion;
  readonly reason: SafeReasonCode | null;
}
/** Local已读投影/草稿请求，key不能从ownerref拼接。 */
interface LocalReadInput {
  readonly fence: ContextFence;
  readonly partition: LocalPartition;
  readonly key: LocalId<"cache_key">;
  readonly contextRef: ExternalHandle<"context"> | null;
}
/** 当前内存草稿读取，不依赖repository locator/partition。 */
interface DraftReadInput {
  readonly fence: ContextFence;
  readonly contextRef: ExternalHandle<"context">;
}
/** AT只派生当前安全page，不读业务接口。 */
interface AccessibilityReadInput {
  readonly page: ClientPageViewModel;
  readonly platform: PlatformCapabilityState;
  readonly preferences: AccessibilityPreferences;
}
/** 本地持有safe投影请求；default memory，不提供durable开关。 */
interface PersistProjectionInput {
  readonly entry: LocalProjectionEntry;
  readonly expectedVersion: LocalVersion | null;
  readonly fence: ContextFence;
}
/** 选择由当前safe项目model派生；expected来自本次root.read。 */
interface NavigateProjectInput {
  readonly navigation: ProjectNavigationState;
  readonly expectedVersion: LocalVersion;
  readonly fence: ContextFence;
}
/** 用户输入/搜索仅local代次，不修改正式provider权限。 */
interface DirectorySearchInput {
  readonly search: LocalDirectorySearchState;
  readonly request: ConsumptionRequest;
}
```

| helper字段 | 来源/完整性/约束 |
|---|---|
| schemaVersion/input/session | strict local schema检查；unknown版本unsafe/unsupported拒绝；session非null时与input fence/request完全匹配；业务协议null返回authority_missing |
| value/localVersion | successful pure factory/qualified result及同CAS成功root.version，纯read使用同snapshot版本；若version已变化不得标注新version掩盖旧结果，回context_changed/重读 |
| disposition | applied=同CAS更新；duplicate=已消费同source change且不更新；ignored=晚到/无关；blocked=缺contract/资格；restricted=收紧已应用；needs_requery=正式gap/乱序，无fresh升级 |
| sourceRef/changeRef | SDK资格registry来源，host/local事件均null；不生成SDK ACK、quarantine ref或event offset |
| fence/partition/key/contextRef | trusted当前fence、SDK safe partition与local repo key；LoadDraft仅contextRef，null不创建草稿；partition无法验证access_denied |
| page/platform/preferences | 当前safe page、批准host能力、本地显示偏好；无标题泄露 |
| entry/expectedVersion | PersistenceSafetyGuard批准entry及repository load返回version，新记录null要求不存在 |
| navigation/expectedVersion/fence | 同root model的local选择，不接受raw node/隐藏target；expected不是owner revision |
| search/request | 用户输入限长校验、root消费slot的query代次；source/visibility不由用户修改 |

新增helper为immutable carrier无独立状态机。每HelperFactory.create(input: Helper): Outcome<Helper>（Helper为上述各独立类型名）纯结构/条件校验；ClientRequestFactory.create<T>(input: ClientRequest<T>): Outcome<ClientRequest<T>>及ClientReplyFactory.create<T>(input: ClientReply<T>): Outcome<ClientReply<T>>不赋予SDK资格。missing/extra字段invalid_input，缺正式资格authority_missing，context错context_changed。LocalConsumerReceiptFactory.create(input: LocalConsumerReceipt): Outcome<LocalConsumerReceipt>不生成change identity。

错误唯一Outcome/ChatError(见Step6§2.3)：结构invalid_input；contract dependency_unbound；authority_missing/access_denied；context_changed/local_conflict；unsafe_material/unsupported_material；continuity_gap；effect_unknown；storage_unavailable/platform_unavailable/aborted_read。错误无正文/stack，不返回未应用部分结果。state姿态通过view表达，empty≠missing，partial/stale≠fresh，disabled≠failed提交。

LocalPage/Info/ReadSurface唯一定义Step6§15，public local response直接复用typed immutable值，无再序列化owner cursor；Snapshot/Provenance/Freshness/OwnerRef/Preview schema和五访问/披露分支见Step6§3，各协议字段映射保留source/visibility。缺formal safe read无需假造qualified negative，可返回Outcome.error dependency_unbound；已正式qualified的not_visible使用安全view清ref。owner revision/localVersion/draftRevision/requestGeneration四者不可互换。

## 4. 协议总表与批次索引

以下各族先列本族映射再逐接口定义。所有接口必须对应Step9同名flow，状态在Step10回指。各卡的field表列全部input字段与output字段来源，二级字段直接回Step6独立卡；不省略必要字段、不制造第二schema。

## 5. Command及local recovery族

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| SubmitConversationIntent | UserIntentCoordinator.submitConversation | IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability | 同名独立flow |
| SubmitGovernanceIntent | UserIntentCoordinator.submitGovernance | IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability | 同名独立flow |
| RequestSafePreview | PreviewBoundary.isOpenable + SafeReferencePort.preview | SafeReferencePort.preview | 同名独立flow |
| AcknowledgeLocalRecoveryAction | RecoveryCoordinator.choose | ResumePort/IntentProbePort或local clear | 同名独立flow |

### 5.1 SubmitConversationIntent

#### 用途与调用

显式用户提交；同draft/revision预留一次；普通receipt不能confirmed，unknown只probe。 调用方：显式UI callback；处理方：UserIntentCoordinator.submitConversation。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** SubmitConversationIntent的local usecase契约；不是SDK export。 */
type SubmitConversationIntentRequest = ClientRequest<ConversationIntentInput>;
type SubmitConversationIntentReply = ClientReply<IntentFeedbackViewModel>;
submitConversationIntent(request: SubmitConversationIntentRequest): Promise<Outcome<SubmitConversationIntentReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ConversationIntentInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 冻结draftRef/draftRevision及当前safeText/ref/reply；capability由正式读取，SDK association由prepare；local identity生成intentRef，gate派生feedback | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: IntentFeedbackViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability；输入从typed schema，不复制SDK DTO | CHAT-UP001/002未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前Conversation消费槽位 |
| input.draftRef | LocalId<"draft"> | 唯一root草稿 |
| input.draftRevision | number | 用户提交时冻结的当前revision |
| input.capability | IntentCapabilityView | 正式Conversation capability，不由组件自行授予 |
| value.intentRef | LocalId<"intent"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.status | CommandResultPosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.optimistic | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.nextAction | AttemptNextAction | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.receiptRef | ExternalHandle<"receipt"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.resultRef | ExternalHandle<"result"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

SDK正式idempotency association，local intentRef不作key；prepare无副作用，dispatch预留一次。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：双击、IME、ACK、旧确认不清新稿。

本接口停审：schema→UserIntentCoordinator.submitConversation→IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability→Step9同名flow可回指；外部CHAT-UP001/002继续blocked，未实现或测试。

### 5.2 SubmitGovernanceIntent

#### 用途与调用

显式用户操作与正式Gate/action capability；点击不审批成功；不能借Process Gateway资格。 调用方：显式UI callback；处理方：UserIntentCoordinator.submitGovernance。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** SubmitGovernanceIntent的local usecase契约；不是SDK export。 */
type SubmitGovernanceIntentRequest = ClientRequest<GovernanceIntentInput>;
type SubmitGovernanceIntentReply = ClientReply<IntentFeedbackViewModel>;
submitGovernanceIntent(request: SubmitGovernanceIntentRequest): Promise<Outcome<SubmitGovernanceIntentReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：GovernanceIntentInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/gate/action/capability来自当前正式Gate安全入口；SDK证明actor授权和association，local attempt无Decision字段 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: IntentFeedbackViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability；输入从typed schema，不复制SDK DTO | CHAT-UP001/003未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前正式Gate目标槽位 |
| input.gate | OwnerReference | Governance正式获准Gateref |
| input.action | ExternalHandle<"governance_action"> | SDK正式可用action |
| input.capability | IntentCapabilityView | 匹配Gate/action/actor的正式capability |
| value.intentRef | LocalId<"intent"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.status | CommandResultPosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.optimistic | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.nextAction | AttemptNextAction | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.receiptRef | ExternalHandle<"receipt"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.resultRef | ExternalHandle<"result"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

SDK正式idempotency association，local intentRef不作key；prepare无副作用，dispatch预留一次。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：Gate过期、action错配、普通receipt、unknown。

本接口停审：schema→UserIntentCoordinator.submitGovernance→IntentCommandPort.prepare/dispatch; IntentProbePort.readCapability→Step9同名flow可回指；外部CHAT-UP001/003继续blocked，未实现或测试。

### 5.3 RequestSafePreview

#### 用途与调用

本轮只绑定正式no-effect preview query；若SDK定义副作用request则blocked，不模拟Command。 调用方：显式UI callback；处理方：PreviewBoundary.isOpenable + SafeReferencePort.preview。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** RequestSafePreview的local usecase契约；不是SDK export。 */
type RequestSafePreviewRequest = ClientRequest<PreviewReadInput>;
type RequestSafePreviewReply = ClientReply<PreviewResultView>;
requestSafePreview(request: RequestSafePreviewRequest): Promise<Outcome<RequestSafePreviewReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：PreviewReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request来自Artifact独立slot；reference正式preview；surface/reference/summary/openRef/provenance逐字段正式安全映射 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: PreviewResultView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | SafeReferencePort.preview；输入从typed schema，不复制SDK DTO | CHAT-UP004/host未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前Artifact独立消费语境 |
| input.reference | PreviewReference | SDK获准入口，无raw URL |
| value.surface | ReadSurface | 独立访问与新鲜度 |
| value.reference | PreviewReference \| null | 仅当前获准时非null |
| value.summary | SafeDisplayContent \| null | 正式redacted预览，非raw正文 |
| value.openRef | ExternalHandle<"controlled_open"> \| null | 正式受控host入口；无URL |
| value.provenance | ProvenanceMetadata \| null | 正式独立Artifact来源 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：preview过期、host不可用、迟到/隐藏。

本接口停审：schema→PreviewBoundary.isOpenable + SafeReferencePort.preview→SafeReferencePort.preview→Step9同名flow可回指；外部CHAT-UP004/host继续blocked，未实现或测试。

### 5.4 AcknowledgeLocalRecoveryAction

#### 用途与调用

用户选择只更新local恢复；unknown不自动重发；wait无业务IO。 调用方：当前page/coordinator；处理方：RecoveryCoordinator.choose。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** AcknowledgeLocalRecoveryAction的local usecase契约；不是SDK export。 */
type AcknowledgeLocalRecoveryActionRequest = ClientRequest<RecoveryActionInput>;
type AcknowledgeLocalRecoveryActionReply = ClientReply<RecoveryViewModel>;
acknowledgeLocalRecoveryAction(request: AcknowledgeLocalRecoveryActionRequest): Promise<Outcome<AcknowledgeLocalRecoveryActionReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：RecoveryActionInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | action在当前allowedActions中；intentRef仅probe，resume仅resume/requery；输出由当前source continuity/attempt和允许动作派生 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: RecoveryViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ResumePort/IntentProbePort或local clear；输入从typed schema，不复制SDK DTO | CHAT-UP002/storage未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前formalsource |
| input.action | RecoveryNextAction | 当前allowedActions |
| input.intentRef | LocalId<"intent"> \| null | probe时必填旧unknown |
| input.resume | ResumeInput \| null | resume/requery时必填 |
| value.continuity | ContinuityState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.unknownAttempts | readonly LocalId<"intent">[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.allowedActions | readonly RecoveryNextAction[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.safeReason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：非法action、unknown retry、清理失败。

本接口停审：schema→RecoveryCoordinator.choose→ResumePort/IntentProbePort或local clear→Step9同名flow可回指；外部CHAT-UP002/storage继续blocked，未实现或测试。

### 5.5 本族停审

两个业务command的actor/metadata/idempotency由SDK正式输入承担；预览受正式no-effect限定，local recovery不产生业务副作用。所有结果字段可完整映射Step6 Attempt/Feedback/Preview/Recovery。无法正式确认receipt或prepare冻结语义时blocked，不能以按钮/ACK替代。批次8-B通过本地设计门禁；未创建业务实现。

## 6. Query族 A：导航、surface、安全材料

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| ResolveEntryAccess | RouteContextCoordinator.enter | EntryAccessPort.resolve | 同名独立flow |
| LoadConversationSurface | CollaborationSurfaceCoordinator.loadSurface | CollaborationReadPort.readSurface | 同名独立flow |
| LoadTurnPage | CollaborationSurfaceCoordinator.loadTurnPage | CollaborationReadPort.readTurnPage | 同名独立flow |
| LoadOwnerSummary | SafeMaterialReadPort.readSummary + SafeMaterialComposer | SafeMaterialReadPort.readSummary | 同名独立flow |
| LoadArtifactPreview | PreviewBoundary.isOpenable + SafeReferencePort.preview | SafeReferencePort.preview | 同名独立flow |
| LoadIntentCapability | IntentProbePort.readCapability | IntentProbePort.readCapability | 同名独立flow |
| ProbeCommandAttempt | UserIntentCoordinator.resolveUnknown | IntentProbePort.probe | 同名独立flow |
| LoadResumeContext | ResumeCoordinator.resume + root.resumesBySource | ResumePort.resume | 同名独立flow |

### 6.1 ResolveEntryAccess

#### 用途与调用

未获target scope前不用ContextFence；所有返回/深链重新验证。 调用方：当前page/coordinator；处理方：RouteContextCoordinator.enter。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ResolveEntryAccess的local usecase契约；不是SDK export。 */
type ResolveEntryAccessRequest = ClientRequest<EnterRouteInput>;
type ResolveEntryAccessReply = ClientReply<RouteContext>;
resolveEntryAccess(request: ResolveEntryAccessRequest): Promise<Outcome<ResolveEntryAccessReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：EnterRouteInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | requestFence/kind/candidates/returnContext/provenance完整来自trusted session及local候选；EntryResolution资格建立正式fence/access，RouteFactory.applyEntryResult | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: RouteContext的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | EntryAccessPort.resolve；输入从typed schema，不复制SDK DTO | CHAT-UP001/005/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.requestFence | EntryResolutionFence | 当前可信session及route生成的预解析fence |
| input.kind | RouteKind | page registry七种安全route |
| input.entryCandidate | ExternalHandle<"entry"> \| null | 已qualify对话入口候选；非对话null |
| input.targetCandidate | OwnerReference \| null | 项目/目录正式目标候选，不反推scope |
| input.restorationCandidate | RestorationHint \| null | 仅SDK正式safe locator，缺serializer禁止恢复 |
| input.returnContext | ReturnContext \| null | 当前安全local返回候选，返回需再验 |
| input.provenance | DeepLinkProvenance | local路由来源/结构检查，不是authority |
| value.routeId | LocalId<"route"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.platformKind | PlatformKind | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.routeKind | RouteKind | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.scopeRef | ExternalHandle<"scope"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.entryRef | ExternalHandle<"entry"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.targetReference | OwnerReference \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.contextRef | ExternalHandle<"context"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.returnContext | ReturnContext \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.deepLinkProvenance | DeepLinkProvenance | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.phase | RoutePhase | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.generation | number | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：late/deep-link/thread-parent。

本接口停审：schema→RouteContextCoordinator.enter→EntryAccessPort.resolve→Step9同名flow可回指；外部CHAT-UP001/005/009继续blocked，未实现或测试。

### 6.2 LoadConversationSurface

#### 用途与调用

group/channel/dm/thread共用；每Turn正式分类safe renderer，unknown类型fallback。 调用方：当前page/coordinator；处理方：CollaborationSurfaceCoordinator.loadSurface。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadConversationSurface的local usecase契约；不是SDK export。 */
type LoadConversationSurfaceRequest = ClientRequest<SurfaceReadInput>;
type LoadConversationSurfaceReply = ClientReply<ConversationPageViewModel>;
loadConversationSurface(request: LoadConversationSurfaceRequest): Promise<Outcome<LoadConversationSurfaceReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：SurfaceReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/contextRef/parentContext/page为当前root和SDK页候选；SurfaceFactory/assembler组合route、surface、draft、feedback、recovery、accessibility、panels，同root版本 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ConversationPageViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readSurface；输入从typed schema，不复制SDK DTO | CHAT-UP001/002未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前context/source消费槽位 |
| input.contextRef | ExternalHandle<"context"> | 正式Conversation语境 |
| input.parentContext | ExternalHandle<"context"> \| null | thread必须正式parent，对话其他类型null |
| input.page | LocalPageRequest | 正式历史分页输入 |
| value.route | RouteContext | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.surface | ConversationSurfaceViewModel \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.draft | DraftState \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.feedback | readonly IntentFeedbackViewModel[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.recovery | RecoveryViewModel | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.accessibility | AccessibilityState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.panels | readonly SafeMaterialSnapshot[] | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：empty、not_visible、thread关系、stale。

本接口停审：schema→CollaborationSurfaceCoordinator.loadSurface→CollaborationReadPort.readSurface→Step9同名flow可回指；外部CHAT-UP001/002继续blocked，未实现或测试。

### 6.3 LoadTurnPage

#### 用途与调用

分页不自排cursor/跨query合并；request代次匹配。 调用方：当前page/coordinator；处理方：CollaborationSurfaceCoordinator.loadTurnPage。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadTurnPage的local usecase契约；不是SDK export。 */
type LoadTurnPageRequest = ClientRequest<TurnPageInput>;
type LoadTurnPageReply = ClientReply<ConversationSurfaceViewModel>;
loadTurnPage(request: LoadTurnPageRequest): Promise<Outcome<LoadTurnPageReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：TurnPageInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/contextRef/page含formal lineage；page qualified current后SurfaceFactory.applyTurnPage，pageInfo/turns/provenance映射 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ConversationSurfaceViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readTurnPage；输入从typed schema，不复制SDK DTO | CHAT-UP002未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 同当前safe surface的消费槽位 |
| input.contextRef | ExternalHandle<"context"> | 当前正式Conversation context |
| input.page | LocalPageRequest | 前页cursor/lineage，非首请求 |
| value.contextRef | ExternalHandle<"context"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.entryKind | "group" \| "channel" \| "dm" \| "thread" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.accessPosture | AccessPosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.turns | readonly TurnPresentationModel[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.pageInfo | LocalPageInfo | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.provenance | ProvenanceMetadata \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.freshness | FreshnessMarker | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeStatus | ContinuityState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.selection | SelectionState | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：并发页、旧lineage、重复Turn。

本接口停审：schema→CollaborationSurfaceCoordinator.loadTurnPage→CollaborationReadPort.readTurnPage→Step9同名flow可回指；外部CHAT-UP002继续blocked，未实现或测试。

### 6.4 LoadOwnerSummary

#### 用途与调用

单owner摘要；tool/Agent/commit/test仅safe ref/summary，不验收。 调用方：当前page/coordinator；处理方：SafeMaterialReadPort.readSummary + SafeMaterialComposer。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadOwnerSummary的local usecase契约；不是SDK export。 */
type LoadOwnerSummaryRequest = ClientRequest<OwnerSummaryReadInput>;
type LoadOwnerSummaryReply = ClientReply<SafeMaterialSnapshot>;
loadOwnerSummary(request: LoadOwnerSummaryRequest): Promise<Outcome<LoadOwnerSummaryReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：OwnerSummaryReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/target只qualified owner；materialId localID，其余ownerRef/provenance/freshness/disclosure/content正式safe材料 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: SafeMaterialSnapshot的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | SafeMaterialReadPort.readSummary；输入从typed schema，不复制SDK DTO | CHAT-UP004/005/006、WS-UP未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前正式source/target槽位 |
| input.target | OwnerReference | 正式关联获准目标 |
| value.materialId | LocalId<"material"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.ownerRef | OwnerReference \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.provenance | ProvenanceMetadata \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.freshness | FreshnessMarker | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disclosure | DisclosurePosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.content | SafeDisplayContent \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：wrong owner、部分来源、unsafe body。

本接口停审：schema→SafeMaterialReadPort.readSummary + SafeMaterialComposer→SafeMaterialReadPort.readSummary→Step9同名flow可回指；外部CHAT-UP004/005/006、WS-UP继续blocked，未实现或测试。

### 6.5 LoadArtifactPreview

#### 用途与调用

不返回正文/URL；无正式no-effect能力blocked。 调用方：当前page/coordinator；处理方：PreviewBoundary.isOpenable + SafeReferencePort.preview。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadArtifactPreview的local usecase契约；不是SDK export。 */
type LoadArtifactPreviewRequest = ClientRequest<PreviewReadInput>;
type LoadArtifactPreviewReply = ClientReply<PreviewResultView>;
loadArtifactPreview(request: LoadArtifactPreviewRequest): Promise<Outcome<LoadArtifactPreviewReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：PreviewReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 同RequestSafePreview，read结果safe surface/provenance，openRef双重host资格 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: PreviewResultView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | SafeReferencePort.preview；输入从typed schema，不复制SDK DTO | CHAT-UP004/host未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前Artifact独立消费语境 |
| input.reference | PreviewReference | SDK获准入口，无raw URL |
| value.surface | ReadSurface | 独立访问与新鲜度 |
| value.reference | PreviewReference \| null | 仅当前获准时非null |
| value.summary | SafeDisplayContent \| null | 正式redacted预览，非raw正文 |
| value.openRef | ExternalHandle<"controlled_open"> \| null | 正式受控host入口；无URL |
| value.provenance | ProvenanceMetadata \| null | 正式独立Artifact来源 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：malicious ref、expired/hidden。

本接口停审：schema→PreviewBoundary.isOpenable + SafeReferencePort.preview→SafeReferencePort.preview→Step9同名flow可回指；外部CHAT-UP004/host继续blocked，未实现或测试。

### 6.6 LoadIntentCapability

#### 用途与调用

read_only不可发；Retry允许不是unknown自动重放资格。 调用方：当前page/coordinator；处理方：IntentProbePort.readCapability。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadIntentCapability的local usecase契约；不是SDK export。 */
type LoadIntentCapabilityRequest = ClientRequest<CapabilityReadInput>;
type LoadIntentCapabilityReply = ClientReply<IntentCapabilityView>;
loadIntentCapability(request: LoadIntentCapabilityRequest): Promise<Outcome<LoadIntentCapabilityReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：CapabilityReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/kind/gate来自当前safe context；capabilityRef/actionRef/availability/retryAllowed/provenance由owner正式能力 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: IntentCapabilityView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | IntentProbePort.readCapability；输入从typed schema，不复制SDK DTO | CHAT-UP001/003未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前target资格 |
| input.kind | IntentKind | 明确由用户入口选择conversation/governance |
| input.gate | OwnerReference \| null | 治理须正式Gateref，其余null |
| value.request | ConsumptionRequest | 当前入口/target/source/visibility资格 |
| value.kind | IntentKind | 正式Conversation/Governance能力映射 |
| value.capabilityRef | ExternalHandle<"intent_capability"> \| null | 正式授予，未绑定/拒绝null |
| value.actionRef | ExternalHandle<"governance_action"> \| null | Governance正式获准action；Conversation null |
| value.availability | AccessAvailability | SDK formal access，不按member角色猜 |
| value.retryAllowed | boolean | 正式明确retry能力，不由按钮状态推定 |
| value.provenance | ProvenanceMetadata \| null | 允许操作必须正式source/visibility来源 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：capability迟到、Gate与action不匹配。

本接口停审：schema→IntentProbePort.readCapability→IntentProbePort.readCapability→Step9同名flow可回指；外部CHAT-UP001/003继续blocked，未实现或测试。

### 6.7 ProbeCommandAttempt

#### 用途与调用

只query/probe；not_found未证明no effect仍unknown。 调用方：当前page/coordinator；处理方：UserIntentCoordinator.resolveUnknown。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ProbeCommandAttempt的local usecase契约；不是SDK export。 */
type ProbeCommandAttemptRequest = ClientRequest<ProbeAttemptInput>;
type ProbeCommandAttemptReply = ClientReply<IntentFeedbackViewModel>;
probeCommandAttempt(request: ProbeCommandAttemptRequest): Promise<Outcome<ProbeCommandAttemptReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ProbeAttemptInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/intentRef/association来自当前attempt；FormalProbeResult经gate生成feedback，not_found/noEffectProven独立 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: IntentFeedbackViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | IntentProbePort.probe；输入从typed schema，不复制SDK DTO | CHAT-UP001/003未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 重新验证probe scope/source槽位 |
| input.intentRef | LocalId<"intent"> | 原unknown或非terminal意图 |
| input.association | ExternalHandle<"idempotency"> | 正式association；重启由formal locator rebind，不能自造 |
| value.intentRef | LocalId<"intent"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.status | CommandResultPosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.optimistic | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.nextAction | AttemptNextAction | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.receiptRef | ExternalHandle<"receipt"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.resultRef | ExternalHandle<"result"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：not_found、普通receipt、conflicting terminal。

本接口停审：schema→UserIntentCoordinator.resolveUnknown→IntentProbePort.probe→Step9同名flow可回指；外部CHAT-UP001/003继续blocked，未实现或测试。

### 6.8 LoadResumeContext

#### 用途与调用

名字沿用02；调用SDK只读恢复，不暗设loadResume SDK方法。 调用方：当前page/coordinator；处理方：ResumeCoordinator.resume + root.resumesBySource。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadResumeContext的local usecase契约；不是SDK export。 */
type LoadResumeContextRequest = ClientRequest<ResumeInput>;
type LoadResumeContextReply = ClientReply<ResumeContext>;
loadResumeContext(request: LoadResumeContextRequest): Promise<Outcome<LoadResumeContextReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ResumeInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/context/action/recoveryRef当前source；返回正式ResumeResult映射同source context/cursor/允许动作，不以缓存刷新 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ResumeContext的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ResumePort.resume；输入从typed schema，不复制SDK DTO | CHAT-UP002/005/008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前source槽位 |
| input.context | ResumeContext | single canonical恢复context |
| input.action | "resume" \| "requery" | 正式恢复动作，不重发业务 |
| input.recoveryRef | LocalId<"recovery"> | local single-flight关联 |
| value.recoveryRef | LocalId<"recovery"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.consumptionContext | ClientConsumptionContext | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"change_source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.cursorRef | ExternalHandle<"change_cursor"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.visibilityRef | ExternalHandle<"visibility"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.gapRef | ExternalHandle<"gap"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.pendingAttempts | readonly LocalId<"intent">[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.recoveryReason | RecoveryReason | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.allowedActions | readonly RecoveryNextAction[] | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：partial、ACK、旧recovery。

本接口停审：schema→ResumeCoordinator.resume + root.resumesBySource→ResumePort.resume→Step9同名flow可回指；外部CHAT-UP002/005/008/009继续blocked，未实现或测试。

### 6.9 本组停审

八入口均有完整request与response type，response二级字段唯一在Step6；entry前请求/入口后consumption分离，page cursor/lineage与正式safe材料来源闭合。Probe返回Feedback来自正式门控，并非直接把probestatus当CommandResultPosture。Query不写owner；all contracts missing保持blocked。进入Query B。

## 7. Query族 B：恢复、本地状态、平台与AT

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| LoadLocalProjection | LocalProjectionRepository.load + PersistenceSafetyGuard.canRestore | LocalProjectionRepository.load | 同名独立flow |
| LoadDraft | DraftCoordinator.load | DraftPort.get | 同名独立flow |
| ProbePlatformCapability | PlatformCapabilityAdapter.probe + PlatformCapabilityState.applyProbe | PlatformPort.probe | 同名独立flow |
| LoadAccessibilityContext | AccessibilitySemanticAdapter.derive | AccessibilityPort.preferences | 同名独立flow |

### 7.1 LoadLocalProjection

#### 用途与调用

cache hit不authorized/fresh；null为local absent，不owner missing。 调用方：当前page/coordinator；处理方：LocalProjectionRepository.load + PersistenceSafetyGuard.canRestore。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadLocalProjection的local usecase契约；不是SDK export。 */
type LoadLocalProjectionRequest = ClientRequest<LocalReadInput>;
type LoadLocalProjectionReply = ClientReply<LocalProjectionEntry | null>;
loadLocalProjection(request: LoadLocalProjectionRequest): Promise<Outcome<LoadLocalProjectionReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：LocalReadInput完整字段见本Step §3 | strict reject；业务session必填 |
| input→对象 | fence/partition/key当前隔离；entry/null来自repo versioned load；payload只safe，未access前不能披露 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalProjectionEntry \| null的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | LocalProjectionRepository.load；输入从typed schema，不复制SDK DTO | storage/safe locator未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.partition | LocalPartition | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.key | LocalId<"cache_key"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.contextRef | ExternalHandle<"context"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.cacheKey | LocalId<"cache_key"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.partition | LocalPartition | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.restorationHint | RestorationHint | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.state | LocalProjectionState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.payload | ProjectionPayload | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：分区错、删除失败、stale缓存。

本接口停审：schema→LocalProjectionRepository.load + PersistenceSafetyGuard.canRestore→LocalProjectionRepository.load→Step9同名flow可回指；外部storage/safe locator继续blocked，未实现或测试。

### 7.2 LoadDraft

#### 用途与调用

contextRef=null invalid_input；默认memory，不durable正文。 调用方：当前page/coordinator；处理方：DraftCoordinator.load。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadDraft的local usecase契约；不是SDK export。 */
type LoadDraftRequest = ClientRequest<DraftReadInput>;
type LoadDraftReply = ClientReply<DraftState | null>;
loadDraft(request: LoadDraftRequest): Promise<Outcome<LoadDraftReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：DraftReadInput完整字段见本Step §3，仅当前fence/context | strict reject；当前session/fence必须匹配 |
| input→对象 | contextRef正式对话且与fence匹配；DraftStore唯一root，text用户input而非owner材料；null无草稿 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: DraftState \| null的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | DraftPort.get；输入从typed schema，不复制SDK DTO | local session资格未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.contextRef | ExternalHandle<"context"> | 当前正式Conversation context，与fence一致；不依赖cache partition/key |
| value.draftRef | LocalId<"draft"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.contextRef | ExternalHandle<"context"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.safeText | string | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.attachmentRefs | readonly OwnerReference[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.replyTarget | ExternalHandle<"turn"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.validation | LocalValidationState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.revisionHint | number | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.phase | DraftPhase | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.submittingIntent | LocalId<"intent"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：跨会话text泄漏、null/empty草稿。

本接口停审：schema→DraftCoordinator.load→DraftPort.get→Step9同名flow可回指；外部local session资格继续blocked，未实现或测试。

### 7.3 ProbePlatformCapability

#### 用途与调用

host available不授command；过期probe拒绝。 调用方：当前page/coordinator；处理方：PlatformCapabilityAdapter.probe + PlatformCapabilityState.applyProbe。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ProbePlatformCapability的local usecase契约；不是SDK export。 */
type ProbePlatformCapabilityRequest = ClientRequest<PlatformCapabilityKind>;
type ProbePlatformCapabilityReply = ClientReply<PlatformCapabilityState>;
probePlatformCapability(request: ProbePlatformCapabilityRequest): Promise<Outcome<ProbePlatformCapabilityReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：PlatformCapabilityKind完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | kind为批准有限分类；PlatformProbeResult平台/hostBinding/generation映射capabilities，safeReason有限 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: PlatformCapabilityState的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | PlatformPort.probe；输入从typed schema，不复制SDK DTO | host未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.kind | PlatformCapabilityKind | 批准能力分类，非状态 |
| value.platformKind | PlatformKind | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.capabilities | ReadonlyMap<PlatformCapabilityKind, CapabilityAvailability> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.lifecyclePosture | ShellLifecyclePosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.safeReason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：Web preview safe_storage/controlled_preview拒绝。

本接口停审：schema→PlatformCapabilityAdapter.probe + PlatformCapabilityState.applyProbe→PlatformPort.probe→Step9同名flow可回指；外部host继续blocked，未实现或测试。

### 7.4 LoadAccessibilityContext

#### 用途与调用

纯派生图/list/keyboard等价语义；不读取隐藏标题/关系。 调用方：当前page/coordinator；处理方：AccessibilitySemanticAdapter.derive。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadAccessibilityContext的local usecase契约；不是SDK export。 */
type LoadAccessibilityContextRequest = ClientRequest<AccessibilityReadInput>;
type LoadAccessibilityContextReply = ClientReply<AccessibilityState>;
loadAccessibilityContext(request: LoadAccessibilityContextRequest): Promise<Outcome<LoadAccessibilityContextReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：AccessibilityReadInput完整字段见本Step §3 | strict reject；业务session必填 |
| input→对象 | page/platform/preferences是当前安全展示；focus/regions由registry，announcement由local姿态 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: AccessibilityState的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | AccessibilityPort.preferences；输入从typed schema，不复制SDK DTO | host/AT qualification未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.page | ClientPageViewModel | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.platform | PlatformCapabilityState | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.preferences | AccessibilityPreferences | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.focusTarget | FocusTarget \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reducedMotion | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.highContrast | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.announcement | StatusAnnouncement \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.semanticRegions | readonly SemanticRegion[] | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：hidden焦点、减少运动、live公告。

本接口停审：schema→AccessibilitySemanticAdapter.derive→AccessibilityPort.preferences→Step9同名flow可回指；外部host/AT qualification继续blocked，未实现或测试。

### 7.5 本组停审

四个本地/host入口不授业务权限，local null与owner missing分离；正文草稿默认memory，AT安全page与图共享数据。LoadResumeContext在前组定义，其reply为root.resumesBySource当前值，不虚构SDK loadResumeContext。不能将repo版本替代root版本；读取后root已变化须重新校验。进入Query C。

## 8. Query族 C：项目、流程、关系和人员目录

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| LoadProjectList | ProjectContextCoordinator.loadList | CollaborationReadPort.readProjectList | 同名独立flow |
| LoadProjectDetail | ProjectContextCoordinator.loadDetail | CollaborationReadPort.readProjectDetail | 同名独立flow |
| LoadProjectProcessFlow | ProcessDrilldownCoordinator.loadProjectFlow | CollaborationReadPort.readProjectProcessFlow | 同名独立flow |
| LoadStageProcessFlow | ProcessDrilldownCoordinator.loadStageFlow | CollaborationReadPort.readStageProcessFlow | 同名独立flow |
| LoadProcessNodeDetail | ProcessDrilldownCoordinator.loadNodeDetail | CollaborationReadPort.readProcessNodeDetail | 同名独立flow |
| LoadProjectConversationLinks | ProjectContextCoordinator.loadLinks | CollaborationReadPort.readProjectConversationLinks + EntryAccessPort.resolve | 同名独立flow |
| LoadCompanyDirectory | DirectoryCoordinator.load/search/loadNext | CollaborationReadPort.readCompanyDirectory | 同名独立flow |
| LoadMemberContext | DirectoryCoordinator.loadMemberContext | CollaborationReadPort.readMemberContext | 同名独立flow |

### 8.1 LoadProjectList

#### 用途与调用

仅获准项目；empty不公司无项目，分页coverage不可由长度推。 调用方：当前page/coordinator；处理方：ProjectContextCoordinator.loadList。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadProjectList的local usecase契约；不是SDK export。 */
type LoadProjectListRequest = ClientRequest<ProjectListReadInput>;
type LoadProjectListReply = ClientReply<LocalPage<SafeMaterialSnapshot>>;
loadProjectList(request: LoadProjectListRequest): Promise<Outcome<LoadProjectListReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ProjectListReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/page当前Work source；items/pageInfo/surface正式safe页，materialId local，owner/provenance分别保留 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalPage<SafeMaterialSnapshot>的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readProjectList；输入从typed schema，不复制SDK DTO | CHAT-UP001/006未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前Work列表入口actor/scope/source资格 |
| input.page | LocalPageRequest | 正式列表分页 |
| value.items | readonly T[] | 当前获准items，hidden/blocked必须空。 |
| value.pageInfo | LocalPageInfo | 正式页边界，不生成cursor。 |
| value.surface | ReadSurface | 空页同样保留正式access seed。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：page lineage、not_visible、partial coverage。

本接口停审：schema→ProjectContextCoordinator.loadList→CollaborationReadPort.readProjectList→Step9同名flow可回指；外部CHAT-UP001/006继续blocked，未实现或测试。

### 8.2 LoadProjectDetail

#### 用途与调用

五标签overview/progress/conversations/work_items/evidence；不顶层进度；多source非原子。 调用方：当前page/coordinator；处理方：ProjectContextCoordinator.loadDetail。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadProjectDetail的local usecase契约；不是SDK export。 */
type LoadProjectDetailRequest = ClientRequest<ProjectDetailReadInput>;
type LoadProjectDetailReply = ClientReply<ProjectDetailViewModel>;
loadProjectDetail(request: LoadProjectDetailRequest): Promise<Outcome<LoadProjectDetailReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ProjectDetailReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/project/workItemPage；summary、workItems、evidenceRefs各独立qualified；navigation唯一root派生，flow/links单独读取 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ProjectDetailViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readProjectDetail；输入从typed schema，不复制SDK DTO | CHAT-UP006/008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前正式Work项目目标槽位 |
| input.project | OwnerReference | 正式Work项目ref |
| input.workItemPage | LocalPageRequest | Work正式项目工作项分页；不猜全项目total |
| value.projectReference | OwnerReference \| null | Work正式项目引用；blocked/撤销可null。 |
| value.consumptionContext | ClientConsumptionContext | Work主section消费语境，不替代其他source语境。 |
| value.navigation | ProjectNavigationState | local标签/下钻状态。 |
| value.projectSummary | SafeMaterialSnapshot \| null | Work正式安全摘要；未加载不填缓存正文。 |
| value.flowView | ProcessFlowViewModel \| null | Process正式流程，未加载null不等于不存在。 |
| value.conversationLinks | ProjectConversationLinkViewModel \| null | 正式关联投影，未绑定provider时null/blocked。 |
| value.workItems | readonly SafeMaterialSnapshot[] | Work正式安全工作项，保持正式排序。 |
| value.evidenceRefs | readonly OwnerReference[] | Artifact/正式Evidence关联ref，不生成验收。 |
| value.accessPosture | AccessPosture | 项目入口正式access，其他section独立检查。 |
| value.loadPosture | PageLoadPosture | 本地加载派生姿态，不是Project lifecycle。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：证据不可读、工单↔项目错配、partial。

本接口停审：schema→ProjectContextCoordinator.loadDetail→CollaborationReadPort.readProjectDetail→Step9同名flow可回指；外部CHAT-UP006/008/009继续blocked，未实现或测试。

### 8.3 LoadProjectProcessFlow

#### 用途与调用

整体BPMN正式fork/branches/join；布局可local算，连线/状态不得local造。 调用方：当前page/coordinator；处理方：ProcessDrilldownCoordinator.loadProjectFlow。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadProjectProcessFlow的local usecase契约；不是SDK export。 */
type LoadProjectProcessFlowRequest = ClientRequest<ProcessFlowReadInput>;
type LoadProjectProcessFlowReply = ClientReply<ProcessFlowViewModel>;
loadProjectProcessFlow(request: LoadProjectProcessFlowRequest): Promise<Outcome<LoadProjectProcessFlowReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ProcessFlowReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/project→正式process关联；topology/states/governanceRefs各正式source；图拓扑coverage/provenance独立 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ProcessFlowViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readProjectProcessFlow；输入从typed schema，不复制SDK DTO | CHAT-UP008未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | Process来源及当前项目消费槽位 |
| input.project | OwnerReference | 正式Work项目ref |
| value.projectReference | OwnerReference \| null | 当前Work项目；清理后null。 |
| value.processReference | OwnerReference \| null | 正式Process语境，不能从WorkItem推定。 |
| value.stageReference | OwnerReference \| null | 当前阶段可null，整体视图不伪造阶段。 |
| value.consumptionContext | ClientConsumptionContext | 本次Process消费槽位。 |
| value.topologyMaterial | SafeProcessTopologyView \| null | 正式safe拓扑，未获得null。 |
| value.stateMaterial | readonly SafeMaterialSnapshot[] | Process正式节点/分支/Gateway状态。 |
| value.topologyProvenance | ProvenanceMetadata \| null | 拓扑source版本，独立于state。 |
| value.stateProvenance | ProvenanceMetadata \| null | 状态source版本，不和Work/Runtime做全局比较。 |
| value.governanceRefs | readonly OwnerReference[] | 正式关联Governance Gate，读取另验。 |
| value.freshness | FreshnessMarker | 当前Process来源的新鲜度，不升级其他owner。 |
| value.accessPosture | AccessPosture | 当前流程正式可见边界。 |
| value.loadPosture | PageLoadPosture | 本地加载/版本缺口姿态。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：hidden边、Gateway≠Gate、状态版本不兼容。

本接口停审：schema→ProcessDrilldownCoordinator.loadProjectFlow→CollaborationReadPort.readProjectProcessFlow→Step9同名flow可回指；外部CHAT-UP008继续blocked，未实现或测试。

### 8.4 LoadStageProcessFlow

#### 用途与调用

当前parent revision变更先失效子/节点；无formal child不拼子流程。 调用方：当前page/coordinator；处理方：ProcessDrilldownCoordinator.loadStageFlow。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadStageProcessFlow的local usecase契约；不是SDK export。 */
type LoadStageProcessFlowRequest = ClientRequest<StageFlowReadInput>;
type LoadStageProcessFlowReply = ClientReply<ProcessFlowViewModel>;
loadStageProcessFlow(request: LoadStageProcessFlowRequest): Promise<Outcome<LoadStageProcessFlowReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：StageFlowReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/project/process/stage/parentRevision；正式父子关系及子topology，图/列表同model | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ProcessFlowViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readStageProcessFlow；输入从typed schema，不复制SDK DTO | CHAT-UP008未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前stage新消费槽位 |
| input.project | OwnerReference | 正式Work项目ref |
| input.process | OwnerReference | 父图正式Process |
| input.stage | OwnerReference | 父图正式可见stage |
| input.parentRevision | ExternalHandle<"revision"> | 父图正式拓扑版本 |
| value.projectReference | OwnerReference \| null | 当前Work项目；清理后null。 |
| value.processReference | OwnerReference \| null | 正式Process语境，不能从WorkItem推定。 |
| value.stageReference | OwnerReference \| null | 当前阶段可null，整体视图不伪造阶段。 |
| value.consumptionContext | ClientConsumptionContext | 本次Process消费槽位。 |
| value.topologyMaterial | SafeProcessTopologyView \| null | 正式safe拓扑，未获得null。 |
| value.stateMaterial | readonly SafeMaterialSnapshot[] | Process正式节点/分支/Gateway状态。 |
| value.topologyProvenance | ProvenanceMetadata \| null | 拓扑source版本，独立于state。 |
| value.stateProvenance | ProvenanceMetadata \| null | 状态source版本，不和Work/Runtime做全局比较。 |
| value.governanceRefs | readonly OwnerReference[] | 正式关联Governance Gate，读取另验。 |
| value.freshness | FreshnessMarker | 当前Process来源的新鲜度，不升级其他owner。 |
| value.accessPosture | AccessPosture | 当前流程正式可见边界。 |
| value.loadPosture | PageLoadPosture | 本地加载/版本缺口姿态。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：parent换版、stage迟到。

本接口停审：schema→ProcessDrilldownCoordinator.loadStageFlow→CollaborationReadPort.readStageProcessFlow→Step9同名flow可回指；外部CHAT-UP008继续blocked，未实现或测试。

### 8.5 LoadProcessNodeDetail

#### 用途与调用

节点可点击不是执行；BPMN/工单/Agent/工具/commit/test仅正式safe展示。 调用方：当前page/coordinator；处理方：ProcessDrilldownCoordinator.loadNodeDetail。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadProcessNodeDetail的local usecase契约；不是SDK export。 */
type LoadProcessNodeDetailRequest = ClientRequest<ProcessNodeReadInput>;
type LoadProcessNodeDetailReply = ClientReply<ProcessNodeDetailViewModel>;
loadProcessNodeDetail(request: LoadProcessNodeDetailRequest): Promise<Outcome<LoadProcessNodeDetailReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ProcessNodeReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/project/process/node/parentRevision→SafeNodeAssociationView及各owner sections；每section access/source独立 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ProcessNodeDetailViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readProcessNodeDetail；输入从typed schema，不复制SDK DTO | CHAT-UP008/006/007未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前node及父图槽位 |
| input.project | OwnerReference | 同项目正式ref |
| input.process | OwnerReference | 当前formalProcess |
| input.node | OwnerReference | 当前safe拓扑获准node |
| input.parentRevision | ExternalHandle<"revision"> | 父拓扑正式版本 |
| value.nodeReference | OwnerReference \| null | 正式获准节点，撤销后null。 |
| value.consumptionContext | ClientConsumptionContext | 节点选择消费槽位。 |
| value.topologyRevision | ExternalHandle<"revision"> \| null | 当前父拓扑正式版本，未加载/清理可null。 |
| value.associationRefs | readonly OwnerReference[] | 正式节点关系，不按名称/commit文本匹配。 |
| value.sections | readonly SafeMaterialSnapshot[] | 分owner授权材料，保留各source/freshness。 |
| value.accessPosture | AccessPosture | 节点access，不替代section访问。 |
| value.loadPosture | PageLoadPosture | section缺口导致partial，不解释为不存在。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：node快速切换、partial owner、关联造假。

本接口停审：schema→ProcessDrilldownCoordinator.loadNodeDetail→CollaborationReadPort.readProcessNodeDetail→Step9同名flow可回指；外部CHAT-UP008/006/007继续blocked，未实现或测试。

### 8.6 LoadProjectConversationLinks

#### 用途与调用

一群至多一项目、项目多群是owner关系合同；每群Participant独立，Chat无绑定写入。 调用方：当前page/coordinator；处理方：ProjectContextCoordinator.loadLinks。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadProjectConversationLinks的local usecase契约；不是SDK export。 */
type LoadProjectConversationLinksRequest = ClientRequest<LinkReadInput>;
type LoadProjectConversationLinksReply = ClientReply<ProjectConversationLinkViewModel>;
loadProjectConversationLinks(request: LoadProjectConversationLinksRequest): Promise<Outcome<LoadProjectConversationLinksReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：LinkReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/anchor→正式relationship/version，再逐target entry access；provider未知blocked | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ProjectConversationLinkViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readProjectConversationLinks + EntryAccessPort.resolve；输入从typed schema，不复制SDK DTO | CHAT-UP009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前anchor/关系provider/source槽位 |
| input.anchor | OwnerReference | 正式Work项目或Conversation群聊ref |
| value.anchorReference | OwnerReference \| null | 当前项目或群聊，撤销后null。 |
| value.relationshipMaterial | SafeProjectConversationAssociationView \| null | provider正式关系，缺合同null。 |
| value.targets | readonly { reference: OwnerReference; access: AccessPosture }[] | 正式关系目标按ref绑定独立access，hidden目标不保留subject引用/标签/数量；不是两个错位数组 |
| value.targets[].reference | OwnerReference | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.targets[].access | AccessPosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.provenance | ProvenanceMetadata \| null | 当前正式关系来源/版本，缺失null。 |
| value.consumptionContext | ClientConsumptionContext | 当前锚点/关系source消费槽位。 |
| value.loadPosture | PageLoadPosture | 本地加载姿态。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：解绑、目标hidden、群聊权限串项目。

本接口停审：schema→ProjectContextCoordinator.loadLinks→CollaborationReadPort.readProjectConversationLinks + EntryAccessPort.resolve→Step9同名flow可回指；外部CHAT-UP009继续blocked，未实现或测试。

### 8.7 LoadCompanyDirectory

#### 用途与调用

人类/AI全公司coverage仅formal provider；不并集各成员集合。 调用方：当前page/coordinator；处理方：DirectoryCoordinator.load/search/loadNext。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadCompanyDirectory的local usecase契约；不是SDK export。 */
type LoadCompanyDirectoryRequest = ClientRequest<DirectoryReadInput>;
type LoadCompanyDirectoryReply = ClientReply<CompanyDirectoryViewModel>;
loadCompanyDirectory(request: LoadCompanyDirectoryRequest): Promise<Outcome<LoadCompanyDirectoryReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：DirectoryReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/provider/search/page→SafeDirectoryPageView；people/coverage/provenance/page/selection当前generation | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: CompanyDirectoryViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readCompanyDirectory；输入从typed schema，不复制SDK DTO | CHAT-UP009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前provider/search/page代次 |
| input.provider | OwnerReference | 正式directoryprovider，未确认不可造ref |
| input.search | LocalDirectorySearchState | local限长query及正式支持filter；选人不是query授权 |
| input.page | LocalPageRequest | 正式provider/query/filter页lineage |
| value.providerReference | OwnerReference \| null | 正式provider引用，缺owner合同或撤销时null。 |
| value.consumptionContext | ClientConsumptionContext | 当前provider/search/page消费槽位。 |
| value.searchState | LocalDirectorySearchState | local查询及人员选择，不赋DM权限。 |
| value.people | readonly SafeMaterialSnapshot[] | 正式获准安全人员摘要。 |
| value.nextPageRef | ExternalHandle<"page_cursor"> \| null | 正式分页游标，必须保留搜索/来源lineage。 |
| value.pageInfo | LocalPageInfo | 唯一完整page cursor/lineage/coverage；nextPageRef只读派生；与Step6新增分页闭口同步 |
| value.coverage | DirectoryCoverage | provider正式scope及人类/AI覆盖，不猜全公司。 |
| value.accessPosture | AccessPosture | 目录当前access；详情/DM另验。 |
| value.freshness | FreshnessMarker | 该目录来源的水位。 |
| value.loadPosture | PageLoadPosture | 本地加载姿态。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：搜索晚到、query lineage、部分coverage。

本接口停审：schema→DirectoryCoordinator.load/search/loadNext→CollaborationReadPort.readCompanyDirectory→Step9同名flow可回指；外部CHAT-UP009继续blocked，未实现或测试。

### 8.8 LoadMemberContext

#### 用途与调用

DM另走Conversation正式入口，无Chat create DM副作用。 调用方：当前page/coordinator；处理方：DirectoryCoordinator.loadMemberContext。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** LoadMemberContext的local usecase契约；不是SDK export。 */
type LoadMemberContextRequest = ClientRequest<MemberContextReadInput>;
type LoadMemberContextReply = ClientReply<readonly SafeMaterialSnapshot[]>;
loadMemberContext(request: LoadMemberContextRequest): Promise<Outcome<LoadMemberContextReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：MemberContextReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/person/project/conversation→identity/projectMember/participant/presence独立qualified sections；输出逐section保留来源 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: readonly SafeMaterialSnapshot[]的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | CollaborationReadPort.readMemberContext；输入从typed schema，不复制SDK DTO | CHAT-UP006/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 主目标消费槽位；sections另保持独立source |
| input.person | OwnerReference | 当前获准人员ref |
| input.project | OwnerReference \| null | 当前正式项目候选，无则null |
| input.conversation | OwnerReference \| null | 当前正式群聊候选，无则null |
| value.materialId | LocalId<"material"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.ownerRef | OwnerReference \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.provenance | ProvenanceMetadata \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.freshness | FreshnessMarker | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disclosure | DisclosurePosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.content | SafeDisplayContent \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：项目成员不等参与者、presence不等身份。

本接口停审：schema→DirectoryCoordinator.loadMemberContext→CollaborationReadPort.readMemberContext→Step9同名flow可回指；外部CHAT-UP006/009继续blocked，未实现或测试。

### 8.9 本组及20 Query整体停审

八新增Query全部对齐正式02，项目五标签与流程整体→阶段→节点的独立读取和父版本闭合；关系provider与目录coverage仍CHAT-UP009 blocked。所有surface的access与freshness独立，不将项目权限传到关联群或目录人员。readonly图/列表/键盘共享qualified topology。20 Query完整schema映射通过，后续Step9逐接口展开，无真实测试/运行事实。

## 9. Inbound Consumer族

### 9.0 typed结果输入与本地receipt

```ts
/** 正式result seam两类安全材料，非event wire schema。 */
type CommandResultInput =
  /** 普通或正式business-confirming receipt仍经过gate。 */
  { readonly kind: "receipt"; readonly material: QualifiedMaterial<CommandReceiptView> }
  /** 正式业务结果必须owner/intent关联匹配。 */
  | { readonly kind: "result"; readonly material: QualifiedMaterial<FormalResultMaterial> };
```

kind为SDK正式mapper分类，字段身份只在QualifiedMaterial/projection各自职责承载；body不重复event metadata。FormalChangeView本身唯一包含change identity/source/revision，SafeChangePayload不重复。SDK event schema版本仅依赖正式adapter compatibility contract，未知版本unsupported_material拒绝，不臆定SDK v1。host事件没有SDK changeRef；eviction local输入也没有虚构event identity。没有backend quarantine/dead-letter库；blocked/restricted安全receipt足以反映本地处置，不创建证据。

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| ConsumeFormalChange | ChangeReducer.consume | ChangeQualificationPort.qualify; ClientStatePort.compareAndSet | 同名独立flow |
| ConsumeCommandReceiptOrResult | UserIntentCoordinator.applyFormalResult/applyReceipt | ClientStatePort.read/compareAndSet | 同名独立flow |
| ConsumeResumeResult | ResumeCoordinator.applyResult | ClientStatePort.read/compareAndSet | 同名独立flow |
| ConsumeVisibilityChange | RecoveryCoordinator.clearRevoked | ChangeFeedPort.stopContext; LocalProjectionRepository.list/evict | 同名独立flow |
| ConsumeMaterialRevisionChange | ChangeReducer.consume | ChangeQualificationPort.qualify; SafeMaterialReadPort.readSummary | 同名独立flow |
| ConsumeShellLifecycle | ShellLifecycleCoordinator.consume | LifecyclePort; ChangeFeedPort.stopAll; PlatformPort.probe | 同名独立flow |
| ConsumeEvictionTrigger | CacheEvictionCoordinator.evict | LocalProjectionRepository.load/evict; ChangeFeedPort.stopContext | 同名独立flow |

### 9.1 ConsumeFormalChange

#### 用途与调用

SDK正式feed触发；source局部去重、资格/coverage先判定，material/result仍单独gate。 调用方：当前page/coordinator；处理方：ChangeReducer.consume。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeFormalChange的local usecase契约；不是SDK export。 */
type ConsumeFormalChangeRequest = ClientRequest<QualifiedMaterial<FormalChangeView>>;
type ConsumeFormalChangeReply = ClientReply<LocalConsumerReceipt>;
consumeFormalChange(request: ConsumeFormalChangeRequest): Promise<Outcome<ConsumeFormalChangeReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：QualifiedMaterial<FormalChangeView>完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | change.projection含唯一changeRef/sourceRef/source/revision/nextCursor/payload/provenance/fake；fence/consumption/authority在QualifiedMaterial；来源身份不重复到payload | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ChangeQualificationPort.qualify; ClientStatePort.compareAndSet；输入从typed schema，不复制SDK DTO | CHAT-UP002/008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.consumptionContext | ClientConsumptionContext \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.authorityRef | ExternalHandle<"source_authority"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.projection | T | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.fake | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：duplicate/乱序/gap/迟到。

本接口停审：schema→ChangeReducer.consume→ChangeQualificationPort.qualify; ClientStatePort.compareAndSet→Step9同名flow可回指；外部CHAT-UP002/008/009继续blocked，未实现或测试。

### 9.2 ConsumeCommandReceiptOrResult

#### 用途与调用

正式result seam触发；ordinary receipt非terminal；冲突terminal拒绝，无自动重发。 调用方：当前page/coordinator；处理方：UserIntentCoordinator.applyFormalResult/applyReceipt。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeCommandReceiptOrResult的local usecase契约；不是SDK export。 */
type ConsumeCommandReceiptOrResultRequest = ClientRequest<CommandResultInput>;
type ConsumeCommandReceiptOrResultReply = ClientReply<LocalConsumerReceipt>;
consumeCommandReceiptOrResult(request: ConsumeCommandReceiptOrResultRequest): Promise<Outcome<ConsumeCommandReceiptOrResultReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：CommandResultInput完整字段见本Step §3 | strict reject；业务session必填 |
| input→对象 | material discriminated receipt/result，QualifiedMaterial保留formal authority/current slot；关联intent/fence/actor/association；gate派生posture | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ClientStatePort.read/compareAndSet；输入从typed schema，不复制SDK DTO | CHAT-UP001/003未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.kind | "receipt" \| "result" | 正式SDK mapper分类 |
| input.material | QualifiedMaterial<CommandReceiptView> \| QualifiedMaterial<FormalResultMaterial> | 正式receipt/result各schema Step6§17 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：ACK、重复确认、关联错、旧draft。

本接口停审：schema→UserIntentCoordinator.applyFormalResult/applyReceipt→ClientStatePort.read/compareAndSet→Step9同名flow可回指；外部CHAT-UP001/003继续blocked，未实现或测试。

### 9.3 ConsumeResumeResult

#### 用途与调用

SDK resume/requery返回触发；complete须当前recovery及正式coverage，partial不fresh。 调用方：当前page/coordinator；处理方：ResumeCoordinator.applyResult。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeResumeResult的local usecase契约；不是SDK export。 */
type ConsumeResumeResultRequest = ClientRequest<QualifiedMaterial<ResumeResultView>>;
type ConsumeResumeResultReply = ClientReply<LocalConsumerReceipt>;
consumeResumeResult(request: ConsumeResumeResultRequest): Promise<Outcome<ConsumeResumeResultReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：QualifiedMaterial<ResumeResultView>完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | ResumeResultView request/recoveryRef/source/status/cursor/revision/coverage/gap/visibility/changes/snapshot/reason全部正式safe来源 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ClientStatePort.read/compareAndSet；输入从typed schema，不复制SDK DTO | CHAT-UP002/005/008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.consumptionContext | ClientConsumptionContext \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.authorityRef | ExternalHandle<"source_authority"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.projection | T | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.fake | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：ACK、partial、旧恢复、visibility收紧。

本接口停审：schema→ResumeCoordinator.applyResult→ClientStatePort.read/compareAndSet→Step9同名flow可回指；外部CHAT-UP002/005/008/009继续blocked，未实现或测试。

### 9.4 ConsumeVisibilityChange

#### 用途与调用

scope撤销覆盖全部消费者，即使node槽位关闭；只收紧，不凭空升级available。 调用方：当前page/coordinator；处理方：RecoveryCoordinator.clearRevoked。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeVisibilityChange的local usecase契约；不是SDK export。 */
type ConsumeVisibilityChangeRequest = ClientRequest<QualifiedMaterial<VisibilityChangeView>>;
type ConsumeVisibilityChangeReply = ClientReply<LocalConsumerReceipt>;
consumeVisibilityChange(request: ConsumeVisibilityChangeRequest): Promise<Outcome<ConsumeVisibilityChangeReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：QualifiedMaterial<VisibilityChangeView>完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 正式session/actor/scope/source、reach/targets/next/visibilityRef/reason决定影响范围；本地遍历root注册槽位和分区，先hide | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ChangeFeedPort.stopContext; LocalProjectionRepository.list/evict；输入从typed schema，不复制SDK DTO | CHAT-UP002/009/storage未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.consumptionContext | ClientConsumptionContext \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.authorityRef | ExternalHandle<"source_authority"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.projection | T | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.fake | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：node关闭后scope revoke、旧session、delete失败。

本接口停审：schema→RecoveryCoordinator.clearRevoked→ChangeFeedPort.stopContext; LocalProjectionRepository.list/evict→Step9同名flow可回指；外部CHAT-UP002/009/storage继续blocked，未实现或测试。

### 9.5 ConsumeMaterialRevisionChange

#### 用途与调用

正式SDK材料变化触发；按source标stale/重查，不重建owner projection。 调用方：当前page/coordinator；处理方：ChangeReducer.consume。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeMaterialRevisionChange的local usecase契约；不是SDK export。 */
type ConsumeMaterialRevisionChangeRequest = ClientRequest<QualifiedMaterial<FormalChangeView>>;
type ConsumeMaterialRevisionChangeReply = ClientReply<LocalConsumerReceipt>;
consumeMaterialRevisionChange(request: ConsumeMaterialRevisionChangeRequest): Promise<Outcome<ConsumeMaterialRevisionChangeReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：QualifiedMaterial<FormalChangeView>完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | kind=material且SafeMaterialSnapshot包含正式source/revision；其它kind invalid_input；不从Turn文本识别材料版本 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ChangeQualificationPort.qualify; SafeMaterialReadPort.readSummary；输入从typed schema，不复制SDK DTO | CHAT-UP004/005/006、WS-UP未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.consumptionContext | ClientConsumptionContext \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.authorityRef | ExternalHandle<"source_authority"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.projection | T | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.fake | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：source错、旧revision、unsafe material。

本接口停审：schema→ChangeReducer.consume→ChangeQualificationPort.qualify; SafeMaterialReadPort.readSummary→Step9同名flow可回指；外部CHAT-UP004/005/006、WS-UP继续blocked，未实现或测试。

### 9.6 ConsumeShellLifecycle

#### 用途与调用

host触发；foreground资格重验/resume，offline非terminal attempt unknown；不owner cancel。 调用方：当前page/coordinator；处理方：ShellLifecycleCoordinator.consume。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeShellLifecycle的local usecase契约；不是SDK export。 */
type ConsumeShellLifecycleRequest = ClientRequest<ShellLifecycleEvent>;
type ConsumeShellLifecycleReply = ClientReply<LocalConsumerReceipt>;
consumeShellLifecycle(request: ConsumeShellLifecycleRequest): Promise<Outcome<ConsumeShellLifecycleReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ShellLifecycleEvent完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | hostBindingRef/sessionEpoch/generation/posture来自可信bounded host，receipt source/change均null | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | LifecyclePort; ChangeFeedPort.stopAll; PlatformPort.probe；输入从typed schema，不复制SDK DTO | host/CHAT-UP002未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.hostBindingRef | LocalId<"host_binding"> | 当前批准宿主 |
| input.sessionEpoch | SessionEpoch | local composition当前会话 |
| input.generation | number | 生命周期本地代次 |
| input.posture | ShellLifecyclePosture | foreground/background/closing/restarting/offline正式宿主信号 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：重复offline、旧host/epoch、closing。

本接口停审：schema→ShellLifecycleCoordinator.consume→LifecyclePort; ChangeFeedPort.stopAll; PlatformPort.probe→Step9同名flow可回指；外部host/CHAT-UP002继续blocked，未实现或测试。

### 9.7 ConsumeEvictionTrigger

#### 用途与调用

session/正式revoke或local更严格TTL/容量触发；先遮蔽后删除，失败restricted。 调用方：当前page/coordinator；处理方：CacheEvictionCoordinator.evict。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ConsumeEvictionTrigger的local usecase契约；不是SDK export。 */
type ConsumeEvictionTriggerRequest = ClientRequest<EvictionInput>;
type ConsumeEvictionTriggerReply = ClientReply<LocalConsumerReceipt>;
consumeEvictionTrigger(request: ConsumeEvictionTriggerRequest): Promise<Outcome<ConsumeEvictionTriggerReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：EvictionInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | context包含partition/key/fence/reason/visibility；expectedVersion来自repo load；deleteConfirmed只实际deleted/already_absent | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalConsumerReceipt的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | LocalProjectionRepository.load/evict; ChangeFeedPort.stopContext；输入从typed schema，不复制SDK DTO | storage未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.context | ClearContextInput | safe分区/key与原因 |
| input.expectedVersion | LocalVersion \| null | load返回版本，null只确认不存在 |
| value.disposition | "applied" \| "duplicate" \| "ignored" \| "blocked" \| "restricted" \| "needs_requery" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.sourceRef | ExternalHandle<"source"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.changeRef | ExternalHandle<"change"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：CAS删除冲突、旧分区、清理未确认。

本接口停审：schema→CacheEvictionCoordinator.evict→LocalProjectionRepository.load/evict; ChangeFeedPort.stopContext→Step9同名flow可回指；外部storage继续blocked，未实现或测试。

### 9.8 本族停审

七Consumer全部独立输入/输出；formal change去重回正式source身份，command/resume材料仍核验current slot，visibility收紧具有覆盖失效槽位的安全例外。LocalConsumerReceipt不是SDK ACK/result、owner audit或验收。unsupported/blocked不解析raw payload，无后端dead-letter伪记录。sourceRef/null与host/local来源分离，进入8-E。

## 10. 低敏诊断与支持意图族

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| ClientDiagnosticHandoffRequested | DiagnosticHandoffAdapter.send | DiagnosticPort.send | 同名独立flow |
| ClientSupportContextRequested | DiagnosticHandoffAdapter.send | DiagnosticPort.send | 同名独立flow |

### 10.1 ClientDiagnosticHandoffRequested

#### 用途与调用

用户主动支持操作且formal_low_sensitivity时发送；名称不是公共event/topic。 调用方：当前page/coordinator；处理方：DiagnosticHandoffAdapter.send。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ClientDiagnosticHandoffRequested的local usecase契约；不是SDK export。 */
type ClientDiagnosticHandoffRequestedRequest = ClientRequest<DiagnosticContext>;
type ClientDiagnosticHandoffRequestedReply = ClientReply<DiagnosticHandoffView>;
clientDiagnosticHandoffRequested(request: ClientDiagnosticHandoffRequestedRequest): Promise<Outcome<ClientDiagnosticHandoffRequestedReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：DiagnosticContext完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | requestId/sessionEpoch/category/reason/userRequested/platform严格low sensitivity，receiptRef仅formal sink | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: DiagnosticHandoffView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | DiagnosticPort.send；输入从typed schema，不复制SDK DTO | CHAT-UP007未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.requestId | LocalId<"diagnostic"> | local去重ID非业务key |
| input.sessionEpoch | SessionEpoch | 当前local session |
| input.category | "capability" \| "continuity" \| "local_failure" | 有限允许诊断分类 |
| input.reason | SafeReasonCode | 允许的安全code |
| input.userRequested | true | 明确支持操作，不自动发送 |
| input.platform | PlatformKind | 批准config，无设备标识 |
| value.requestId | LocalId<"diagnostic"> | 关联一次local请求 |
| value.status | "accepted" \| "unknown" \| "disabled" \| "blocked" | 正式sink receipt/副作用未知/关闭/缺合同 |
| value.receiptRef | ExternalHandle<"diagnostic_receipt"> \| null | accepted仅正式SDK receipt |
| value.reason | SafeReasonCode \| null | 有限安全原因 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：disabled、正文/secret注入、未知交付。

本接口停审：schema→DiagnosticHandoffAdapter.send→DiagnosticPort.send→Step9同名flow可回指；外部CHAT-UP007继续blocked，未实现或测试。

### 10.2 ClientSupportContextRequested

#### 用途与调用

显式用户支持动作；不代表报告/审计/evidence已创建。 调用方：当前page/coordinator；处理方：DiagnosticHandoffAdapter.send。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ClientSupportContextRequested的local usecase契约；不是SDK export。 */
type ClientSupportContextRequestedRequest = ClientRequest<DiagnosticContext>;
type ClientSupportContextRequestedReply = ClientReply<DiagnosticHandoffView>;
clientSupportContextRequested(request: ClientSupportContextRequestedRequest): Promise<Outcome<ClientSupportContextRequestedReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：DiagnosticContext完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 同low-sensitivity strict schema，用户支持入口context只有有限safe code，不携owner正文或人员信息 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: DiagnosticHandoffView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | DiagnosticPort.send；输入从typed schema，不复制SDK DTO | CHAT-UP007未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.requestId | LocalId<"diagnostic"> | local去重ID非业务key |
| input.sessionEpoch | SessionEpoch | 当前local session |
| input.category | "capability" \| "continuity" \| "local_failure" | 有限允许诊断分类 |
| input.reason | SafeReasonCode | 允许的安全code |
| input.userRequested | true | 明确支持操作，不自动发送 |
| input.platform | PlatformKind | 批准config，无设备标识 |
| value.requestId | LocalId<"diagnostic"> | 关联一次local请求 |
| value.status | "accepted" \| "unknown" \| "disabled" \| "blocked" | 正式sink receipt/副作用未知/关闭/缺合同 |
| value.receiptRef | ExternalHandle<"diagnostic_receipt"> \| null | accepted仅正式SDK receipt |
| value.reason | SafeReasonCode \| null | 有限安全原因 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：用户未请求、sink缺失、重复请求。

本接口停审：schema→DiagnosticHandoffAdapter.send→DiagnosticPort.send→Step9同名flow可回指；外部CHAT-UP007继续blocked，未实现或测试。

### 10.3 本族停审

两个名字沿用02，但没有公共事件topic/SDK payload snapshot/outbox；只经DiagnosticPort显式用户请求。受限输入与accepted/unknown/disabled/blocked结果都有字段schema。严格诊断禁止业务正文，sink资格CHAT-UP007继续blocked，不创建观测报告/evidence。

## 11. 客户端恢复与本地维护Job族

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| ResumeChangeContext | ResumeCoordinator.resume | ResumePort.resume | 同名独立flow |
| RequeryAfterGap | ResumeCoordinator.requery | ResumePort.requery | 同名独立flow |
| ResolveUnknownAttempt | UserIntentCoordinator.resolveUnknown | IntentProbePort.probe | 同名独立flow |
| RefreshStaleMaterial | SafeMaterialReadPort.readSummary + SafeMaterialComposer | SafeMaterialReadPort.readSummary | 同名独立flow |
| RestoreAfterShellRestart | RecoveryCoordinator.restore | LocalProjectionRepository.load; EntryAccessPort.resolve; IntentProbePort.probe | 同名独立flow |
| PersistLocalProjection | PersistenceSafetyGuard.canPersist + LocalProjectionRepository.save | LocalProjectionRepository.load/save | 同名独立flow |
| EvictLocalMaterial | CacheEvictionCoordinator.evict | LocalProjectionRepository.load/list/evict; ChangeFeedPort.stopContext | 同名独立flow |
| EmitDiagnosticHandoff | DiagnosticHandoffAdapter.send | DiagnosticPort.send | 同名独立flow |

### 11.1 ResumeChangeContext

#### 用途与调用

reconnect或用户resume触发，single-flight per source/recovery；无业务重放。 调用方：当前page/coordinator；处理方：ResumeCoordinator.resume。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ResumeChangeContext的local usecase契约；不是SDK export。 */
type ResumeChangeContextRequest = ClientRequest<ResumeInput>;
type ResumeChangeContextReply = ClientReply<ResumeResultView>;
resumeChangeContext(request: ResumeChangeContextRequest): Promise<Outcome<ResumeChangeContextReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ResumeInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | request/context/action/recoveryRef来自当前source gap/reconnect；完整ResumeResult字段正式qualification | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ResumeResultView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ResumePort.resume；输入从typed schema，不复制SDK DTO | CHAT-UP002/008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前source槽位 |
| input.context | ResumeContext | single canonical恢复context |
| input.action | "resume" \| "requery" | 正式恢复动作，不重发业务 |
| input.recoveryRef | LocalId<"recovery"> | local single-flight关联 |
| value.request | ConsumptionRequest | 原恢复slot/currentcontext |
| value.recoveryRef | LocalId<"recovery"> | 原恢复id |
| value.sourceRef | ExternalHandle<"change_source"> | 正式source |
| value.status | "complete" \| "partial" \| "gap" \| "denied" \| "blocked" | 正式coverage/访问结论，非连接ACK |
| value.nextCursor | ExternalHandle<"change_cursor"> \| null | 正式续点 |
| value.revision | ExternalHandle<"revision"> \| null | 单source水位 |
| value.coverageRef | ExternalHandle<"coverage"> \| null | formal覆盖资格 |
| value.gapRef | ExternalHandle<"gap"> \| null | 正式缺口 |
| value.visibility | VisibilityChangeView \| null | 正式收紧只做安全处理 |
| value.changes | readonly QualifiedMaterial<FormalChangeView>[] | 正式resume允许的safechanges |
| value.snapshot | QualifiedMaterial<SafeChangePayload> \| null | 正式requery snapshot，不造event |
| value.reason | SafeReasonCode \| null | 有限解释 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：并发resume、旧cursor、partial。

本接口停审：schema→ResumeCoordinator.resume→ResumePort.resume→Step9同名flow可回指；外部CHAT-UP002/008/009继续blocked，未实现或测试。

### 11.2 RequeryAfterGap

#### 用途与调用

SDK明确gap触发；read-only快照，完整coverage资格缺失仍stale。 调用方：当前page/coordinator；处理方：ResumeCoordinator.requery。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** RequeryAfterGap的local usecase契约；不是SDK export。 */
type RequeryAfterGapRequest = ClientRequest<ResumeInput>;
type RequeryAfterGapReply = ClientReply<ResumeResultView>;
requeryAfterGap(request: RequeryAfterGapRequest): Promise<Outcome<RequeryAfterGapReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ResumeInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | action=requery且正式gap/context；SDK提供snapshot↔feed正式coverage，不本地拼连续性 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ResumeResultView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ResumePort.requery；输入从typed schema，不复制SDK DTO | CHAT-UP002/005/008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前source槽位 |
| input.context | ResumeContext | single canonical恢复context |
| input.action | "resume" \| "requery" | 正式恢复动作，不重发业务 |
| input.recoveryRef | LocalId<"recovery"> | local single-flight关联 |
| value.request | ConsumptionRequest | 原恢复slot/currentcontext |
| value.recoveryRef | LocalId<"recovery"> | 原恢复id |
| value.sourceRef | ExternalHandle<"change_source"> | 正式source |
| value.status | "complete" \| "partial" \| "gap" \| "denied" \| "blocked" | 正式coverage/访问结论，非连接ACK |
| value.nextCursor | ExternalHandle<"change_cursor"> \| null | 正式续点 |
| value.revision | ExternalHandle<"revision"> \| null | 单source水位 |
| value.coverageRef | ExternalHandle<"coverage"> \| null | formal覆盖资格 |
| value.gapRef | ExternalHandle<"gap"> \| null | 正式缺口 |
| value.visibility | VisibilityChangeView \| null | 正式收紧只做安全处理 |
| value.changes | readonly QualifiedMaterial<FormalChangeView>[] | 正式resume允许的safechanges |
| value.snapshot | QualifiedMaterial<SafeChangePayload> \| null | 正式requery snapshot，不造event |
| value.reason | SafeReasonCode \| null | 有限解释 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：gap→HTTP200非fresh、late snapshot。

本接口停审：schema→ResumeCoordinator.requery→ResumePort.requery→Step9同名flow可回指；外部CHAT-UP002/005/008/009继续blocked，未实现或测试。

### 11.3 ResolveUnknownAttempt

#### 用途与调用

用户probe/重连后的安全读取触发；无effect重放；not_found不自动failed。 调用方：当前page/coordinator；处理方：UserIntentCoordinator.resolveUnknown。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** ResolveUnknownAttempt的local usecase契约；不是SDK export。 */
type ResolveUnknownAttemptRequest = ClientRequest<ProbeAttemptInput>;
type ResolveUnknownAttemptReply = ClientReply<IntentFeedbackViewModel>;
resolveUnknownAttempt(request: ResolveUnknownAttemptRequest): Promise<Outcome<ResolveUnknownAttemptReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：ProbeAttemptInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 当前unknown attempt intentRef/association与request，正式probe结果gate派生反馈 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: IntentFeedbackViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | IntentProbePort.probe；输入从typed schema，不复制SDK DTO | CHAT-UP001/003未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 重新验证probe scope/source槽位 |
| input.intentRef | LocalId<"intent"> | 原unknown或非terminal意图 |
| input.association | ExternalHandle<"idempotency"> | 正式association；重启由formal locator rebind，不能自造 |
| value.intentRef | LocalId<"intent"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.status | CommandResultPosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.optimistic | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.nextAction | AttemptNextAction | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.receiptRef | ExternalHandle<"receipt"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.resultRef | ExternalHandle<"result"> \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：not_found、unknown永久等待、正式no effect。

本接口停审：schema→UserIntentCoordinator.resolveUnknown→IntentProbePort.probe→Step9同名flow可回指；外部CHAT-UP001/003继续blocked，未实现或测试。

### 11.4 RefreshStaleMaterial

#### 用途与调用

当前可见材料stale且capability允许触发；read-only，不repair owner。 调用方：当前page/coordinator；处理方：SafeMaterialReadPort.readSummary + SafeMaterialComposer。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** RefreshStaleMaterial的local usecase契约；不是SDK export。 */
type RefreshStaleMaterialRequest = ClientRequest<OwnerSummaryReadInput>;
type RefreshStaleMaterialReply = ClientReply<SafeMaterialSnapshot>;
refreshStaleMaterial(request: RefreshStaleMaterialRequest): Promise<Outcome<RefreshStaleMaterialReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：OwnerSummaryReadInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 正式source stale当前target；新query返回freshness/provenance/visibility，materialId local稳定来源映射 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: SafeMaterialSnapshot的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | SafeMaterialReadPort.readSummary；输入从typed schema，不复制SDK DTO | CHAT-UP004/005/006、WS-UP未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.request | ConsumptionRequest | 当前正式source/target槽位 |
| input.target | OwnerReference | 正式关联获准目标 |
| value.materialId | LocalId<"material"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.ownerRef | OwnerReference \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.provenance | ProvenanceMetadata \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.freshness | FreshnessMarker | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.disclosure | DisclosurePosture | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.content | SafeDisplayContent \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：隐藏后refresh迟到、partial/expired。

本接口停审：schema→SafeMaterialReadPort.readSummary + SafeMaterialComposer→SafeMaterialReadPort.readSummary→Step9同名flow可回指；外部CHAT-UP004/005/006、WS-UP继续blocked，未实现或测试。

### 11.5 RestoreAfterShellRestart

#### 用途与调用

trusted shell restart触发；默认memory可能无候选；不恢复旧授权/confirmed断言或重发。 调用方：当前page/coordinator；处理方：RecoveryCoordinator.restore。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** RestoreAfterShellRestart的local usecase契约；不是SDK export。 */
type RestoreAfterShellRestartRequest = ClientRequest<RestoreInput>;
type RestoreAfterShellRestartReply = ClientReply<RecoveryViewModel>;
restoreAfterShellRestart(request: RestoreAfterShellRestartRequest): Promise<Outcome<RestoreAfterShellRestartReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：RestoreInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | partition/key/routeGeneration/reason读取缓存候选；正式入口重验，attempt locator重新绑定后probe，所有展示stale待验证 | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: RecoveryViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | LocalProjectionRepository.load; EntryAccessPort.resolve; IntentProbePort.probe；输入从typed schema，不复制SDK DTO | safe locator/storage/CHAT-UP001/002未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.partition | LocalPartition | SDK正式safe account/scope alias |
| input.key | LocalId<"cache_key"> | repository local key |
| input.routeGeneration | number | 新route safeinteger代次 |
| input.reason | RecoveryReason | restart/expired等恢复原因 |
| value.continuity | ContinuityState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.unknownAttempts | readonly LocalId<"intent">[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.allowedActions | readonly RecoveryNextAction[] | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.safeReason | SafeReasonCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：absent、错actor、expired候选。

本接口停审：schema→RecoveryCoordinator.restore→LocalProjectionRepository.load; EntryAccessPort.resolve; IntentProbePort.probe→Step9同名flow可回指；外部safe locator/storage/CHAT-UP001/002继续blocked，未实现或测试。

### 11.6 PersistLocalProjection

#### 用途与调用

local展示变动且guard允许触发；qualified serializer缺失不启durable。 调用方：当前page/coordinator；处理方：PersistenceSafetyGuard.canPersist + LocalProjectionRepository.save。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** PersistLocalProjection的local usecase契约；不是SDK export。 */
type PersistLocalProjectionRequest = ClientRequest<PersistProjectionInput>;
type PersistLocalProjectionReply = ClientReply<LocalProjectionEntry>;
persistLocalProjection(request: PersistLocalProjectionRequest): Promise<Outcome<PersistLocalProjectionReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：PersistProjectionInput完整字段见本Step §3 | strict reject；业务session必填 |
| input→对象 | entry完整key/partition/hint/state/payload/version；expectedVersion来自同load；default memoryOnly，不serialize tokens/text | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: LocalProjectionEntry的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | LocalProjectionRepository.load/save；输入从typed schema，不复制SDK DTO | storage/safe locator未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.entry | LocalProjectionEntry | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.expectedVersion | LocalVersion \| null | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.cacheKey | LocalId<"cache_key"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.partition | LocalPartition | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.restorationHint | RestorationHint | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.state | LocalProjectionState | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.payload | ProjectionPayload | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.localVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：blind upsert拒绝、token/text拒绝、分区。

本接口停审：schema→PersistenceSafetyGuard.canPersist + LocalProjectionRepository.save→LocalProjectionRepository.load/save→Step9同名flow可回指；外部storage/safe locator继续blocked，未实现或测试。

### 11.7 EvictLocalMaterial

#### 用途与调用

logout/revoke/expiry/capacity触发；hide先于IO，失败restricted，不owner deletion。 调用方：当前page/coordinator；处理方：CacheEvictionCoordinator.evict。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** EvictLocalMaterial的local usecase契约；不是SDK export。 */
type EvictLocalMaterialRequest = ClientRequest<EvictionInput>;
type EvictLocalMaterialReply = ClientReply<CacheLifecycleRecord>;
evictLocalMaterial(request: EvictLocalMaterialRequest): Promise<Outcome<EvictLocalMaterialReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：EvictionInput完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 同ConsumeEvictionTrigger，返回cacheKey/reason/state/deleteConfirmed/safeError来自实际delete result | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: CacheLifecycleRecord的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | LocalProjectionRepository.load/list/evict; ChangeFeedPort.stopContext；输入从typed schema，不复制SDK DTO | storage未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.context | ClearContextInput | safe分区/key与原因 |
| input.expectedVersion | LocalVersion \| null | load返回版本，null只确认不存在 |
| value.cacheKey | LocalId<"cache_key"> | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.reason | ClearReason | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.state | "evicting" \| "restricted" \| "cleared" | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.deleteConfirmed | boolean | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.safeError | ChatErrorCode \| null | 承接唯一定义对象字段，来源见本卡input→对象 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：删除失败、concurrent write、version错。

本接口停审：schema→CacheEvictionCoordinator.evict→LocalProjectionRepository.load/list/evict; ChangeFeedPort.stopContext→Step9同名flow可回指；外部storage继续blocked，未实现或测试。

### 11.8 EmitDiagnosticHandoff

#### 用途与调用

用户支持操作触发，本轮不自动定时发送/重发unknown；sink失败不影响业务。 调用方：当前page/coordinator；处理方：DiagnosticHandoffAdapter.send。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** EmitDiagnosticHandoff的local usecase契约；不是SDK export。 */
type EmitDiagnosticHandoffRequest = ClientRequest<DiagnosticContext>;
type EmitDiagnosticHandoffReply = ClientReply<DiagnosticHandoffView>;
emitDiagnosticHandoff(request: EmitDiagnosticHandoffRequest): Promise<Outcome<EmitDiagnosticHandoffReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：DiagnosticContext完整字段见Step6独立同名卡 | strict reject；业务session必填 |
| input→对象 | 批准category/finite reason/userRequested当前low sensitivity输入，accepted仅sink receipt | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: DiagnosticHandoffView的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | DiagnosticPort.send；输入从typed schema，不复制SDK DTO | CHAT-UP007未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.requestId | LocalId<"diagnostic"> | local去重ID非业务key |
| input.sessionEpoch | SessionEpoch | 当前local session |
| input.category | "capability" \| "continuity" \| "local_failure" | 有限允许诊断分类 |
| input.reason | SafeReasonCode | 允许的安全code |
| input.userRequested | true | 明确支持操作，不自动发送 |
| input.platform | PlatformKind | 批准config，无设备标识 |
| value.requestId | LocalId<"diagnostic"> | 关联一次local请求 |
| value.status | "accepted" \| "unknown" \| "disabled" \| "blocked" | 正式sink receipt/副作用未知/关闭/缺合同 |
| value.receiptRef | ExternalHandle<"diagnostic_receipt"> \| null | accepted仅正式SDK receipt |
| value.reason | SafeReasonCode \| null | 有限安全原因 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：disabled无IO、sink timeout unknown。

本接口停审：schema→DiagnosticHandoffAdapter.send→DiagnosticPort.send→Step9同名flow可回指；外部CHAT-UP007继续blocked，未实现或测试。

### 11.9 本族停审

八Job明确触发、schema/结果/幂等作用范围；不是server worker/scheduler。source recovery single-flight，unknown只探测，persist/evict版本来自local repo，diagnostic不自动重发。Job回值是客户端结果，不写执行report/真实run/evidence。保存/清理失败不会伪造成功，进入local actions。

## 12. Local navigation/search族

| 协议 | 所属模块/对象 | port | Step9 |
|---|---|---|---|
| NavigateProjectContext | ProjectContextCoordinator.navigate | ClientStatePort.read/compareAndSet | 同名独立flow |
| UpdateDirectorySearch | DirectoryCoordinator.search | ClientStatePort.compareAndSet; CollaborationReadPort.readCompanyDirectory | 同名独立flow |

### 12.1 NavigateProjectContext

#### 用途与调用

项目任务→详情progress标签；群聊→项目重验；route不增加顶层progress。 调用方：当前page/coordinator；处理方：ProjectContextCoordinator.navigate。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** NavigateProjectContext的local usecase契约；不是SDK export。 */
type NavigateProjectContextRequest = ClientRequest<NavigateProjectInput>;
type NavigateProjectContextReply = ClientReply<ProjectNavigationState>;
navigateProjectContext(request: NavigateProjectContextRequest): Promise<Outcome<NavigateProjectContextReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：NavigateProjectInput完整字段见本Step §3 | strict reject；业务session必填 |
| input→对象 | navigation/expectedVersion/fence当前safe model；tab/层级/节点选择与viewport只local；新target另read | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: ProjectNavigationState的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ClientStatePort.read/compareAndSet；输入从typed schema，不复制SDK DTO | target access/CHAT-UP008/009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.navigation | ProjectNavigationState | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.expectedVersion | LocalVersion | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.fence | ContextFence | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.projectReference | OwnerReference \| null | 当前正式Work项目候选；清理后null。 |
| value.activeTab | ProjectDetailTab | 用户局部标签，初始overview。 |
| value.stageReference | OwnerReference \| null | 当前获准阶段，来自Process拓扑。 |
| value.nodeReference | OwnerReference \| null | 当前获准节点，来自当前父拓扑。 |
| value.topologyRevision | ExternalHandle<"revision"> \| null | Process正式拓扑版本，非store version。 |
| value.viewport | LocalViewportState | local显示值，不代表BPMN布局truth。 |
| value.returnContext | ReturnContext \| null | 已裁剪返回候选，返回时再resolve。 |
| value.selectionPosture | SelectionPhase | 复用SelectionPhase，不建立另一选择状态机。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：hidden target、返回语境、父图更新。

本接口停审：schema→ProjectContextCoordinator.navigate→ClientStatePort.read/compareAndSet→Step9同名flow可回指；外部target access/CHAT-UP008/009继续blocked，未实现或测试。

### 12.2 UpdateDirectorySearch

#### 用途与调用

用户搜索触发；不扩coverage、不能全公司抓取local过滤，无正式provider则blocked。 调用方：当前page/coordinator；处理方：DirectoryCoordinator.search。传输：typed app内部函数→正式SDK/host port（local-only除外），无Chat HTTP/RPC/topic。

```ts
/** UpdateDirectorySearch的local usecase契约；不是SDK export。 */
type UpdateDirectorySearchRequest = ClientRequest<DirectorySearchInput>;
type UpdateDirectorySearchReply = ClientReply<CompanyDirectoryViewModel>;
updateDirectorySearch(request: UpdateDirectorySearchRequest): Promise<Outcome<UpdateDirectorySearchReply>>;
```

#### 字段来源与构造

| schema面 | 全字段schema/来源/目标 | 缺失处理 |
|---|---|---|
| request | schemaVersion/input/session见§3；input：DirectorySearchInput完整字段见本Step §3 | strict reject；业务session必填 |
| input→对象 | search用户限长输入及request当前source；generation推进，旧页/选择/cursor清除，新请求注册slot | 缺ref/关系/版本/正式资格fail-closed，不补造 |
| reply | value: CompanyDirectoryViewModel的全部字段承接Step6同名对象卡（local union/null见§3）；localVersion为本次读取或成功CAS版本 | context晚到不得返回已应用成功 |
| port读取/写入 | ClientStatePort.compareAndSet; CollaborationReadPort.readCompanyDirectory；输入从typed schema，不复制SDK DTO | CHAT-UP009未关闭时dependency_unbound |

#### 本接口全字段映射

| 面/字段 | 类型 | 来源与用途 |
|---|---|---|
| input.search | LocalDirectorySearchState | 承接唯一定义对象字段，来源见本卡input→对象 |
| input.request | ConsumptionRequest | 承接唯一定义对象字段，来源见本卡input→对象 |
| value.providerReference | OwnerReference \| null | 正式provider引用，缺owner合同或撤销时null。 |
| value.consumptionContext | ClientConsumptionContext | 当前provider/search/page消费槽位。 |
| value.searchState | LocalDirectorySearchState | local查询及人员选择，不赋DM权限。 |
| value.people | readonly SafeMaterialSnapshot[] | 正式获准安全人员摘要。 |
| value.nextPageRef | ExternalHandle<"page_cursor"> \| null | 正式分页游标，必须保留搜索/来源lineage。 |
| value.pageInfo | LocalPageInfo | 搜索更改清旧cursor/lineage，当前qualified page重新填入 |
| value.coverage | DirectoryCoverage | provider正式scope及人类/AI覆盖，不猜全公司。 |
| value.accessPosture | AccessPosture | 目录当前access；详情/DM另验。 |
| value.freshness | FreshnessMarker | 该目录来源的水位。 |
| value.loadPosture | PageLoadPosture | 本地加载姿态。 |

嵌套资格按各source/current slot独立检查；全部字段schema引用唯一定义，不serialize内存句柄；null/array严格沿本卡安全surface。

#### 错误、幂等与审计

只读/local调用不创建owner幂等key；按current slot/expected localVersion隔离。 invalid_input/authority_missing/access_denied/context_changed/local_conflict按§3；业务调用后不确定effect_unknown，只probe。无backend audit/outbox/evidence。

安全surface：empty只合法空值；not_visible清正文/ref/cursor/关联；stale/partial按source保留；合同缺失blocked/unavailable，不猜missing。planned验证：rapid search、旧页、provider unavailable。

本接口停审：schema→DirectoryCoordinator.search→ClientStatePort.compareAndSet; CollaborationReadPort.readCompanyDirectory→Step9同名flow可回指；外部CHAT-UP009继续blocked，未实现或测试。

### 12.3 本族停审

两个local动作与业务Command分开，expectedVersion来自root read，requestGeneration只隔离本地异步；owner幂等、Process业务版本和目录provider coverage均不改写。项目tab/下钻只选择已许可目标，目标展示仍独立SDK query，进入cross audit。

## 13. 构造闭环、跨协议审计与回填草稿

| 协议族 | 数量/独立节 | Input→对象/读取→完整response | 门禁 |
|---|---|---|---|
| Command栏 | 4，§5 | 两Attempt/Feedback；preview只读safe view；local recovery | passed_design_with_blockers |
| Query A/B/C | 20，§6～8 | 每卡全input/value字段；嵌套类型Step6独立schema；local helper§3 | passed_design_with_blockers |
| Consumer | 7，§9 | typed qualified input → pure gate/reducer → LocalConsumerReceipt | passed_design_with_blockers |
| diagnostic intents | 2，§10 | DiagnosticContext → formal sink → HandoffView | passed_design_with_blockers |
| local Job | 8，§11 | source恢复/probe/ref读取或versioned local repo → safe返回值 | passed_design_with_blockers |
| local navigation/search | 2，§12 | local version/request代次 → 唯一root选择/搜索VM | passed_design_with_blockers |
| 合计 | 43 | 与正式02 §7逐项一对一 | 无缺失入口 |

### 13.1 引用类型、公共surface和字段身份

| 审计项 | 结论 |
|---|---|
| actor/metadata | trusted SDK QualifiedSession与input request/fence唯一关联，不复制auth/token字段；业务metadata/idempotency wire由SDK正式定义 |
| 入口前/后 | QualifiedEntryResolution不伪造未知scope；入口后QualifiedMaterial.consumptionContext必填async业务读取 |
| ref类型/资格 | ExternalHandle结构不证明资格；registry核对owner/session/source/visibility；OwnerReference.provider未知保持blocked |
| projection identity | materialId/routeId/intentRef等localID不伪ownerid；page/cursor/lineage/revision全formal opaque，不比较大小 |
| page/schema | LocalPage items/pageInfo/surface完整，ReadSurface empty/not_visible/blocked等明确；LocalPageRequest cursor+lineage不重复metadata |
| nested fields | QualifiedMaterial/CommandReceipt/FormalResult/ResumeResult/SafeChangePayload等唯一定义Step6；输入无正式字段不构造positive response |
| expectedVersion | root来自read、repo来自load/list；不混draftRevision/ownerRevision/恢复代次 |
| result/receipt | ordinaryreceipt仅submitted/pending；business_confirming要求formal committed权威；LocalConsumerReceipt无业务结果资格 |
| event identity/schema | FormalChangeView含唯一change identity/source/revision，payload不重复；SDK兼容版本未确认blocked，不臆定外部v1 |
| unknown/diagnostic | command unknown只probe；diagnostic unknown不自动送；accepted sink receipt无审计/evidence含义 |
| boundary | TS客户端typed facade，无HTTP server/RPC/topic、bus/outbox/UoW/owner worker或source body；native最小probe不吸收业务执行 |

### 13.2 本步结束门禁

原诊断：02接口骨架和Step7 port无法替代逐协议schema。修正：43独立卡、输入/返回全字段映射、shared nullable/error/receipt语义、逐族停审；字段不足已回Step6补applyReceipt，不在flow临时发明方法。取舍：本地schema可以1:1实现typed blocked/fake路径，正式SDK wire/能力仍不具备实施资格。

回填草稿为§3～13协议/schema索引。进入Step9条件：43项各有全字段输入/响应与port归属，local helper纯校验、全部二级类型回指，族内及cross设计审计通过；外部blocked维持。Step9必须每接口独立函数级调用图/伪代码/CAS/错误/状态/切口，不压成泛化流程。未执行代码、编译、run/test、验收、commit或readiness。

### 13.3 Step9输入传递与根slice回查

全部Load* input字段由Step6更新后的typed coordinator方法传递，不丢workItemPage/正式parentRevision/member context范围。目录response补pageInfo，nextPageRef只读派生。entry/projectList/preview/capability响应应用至Step6唯一root slice，导航/撤销同步清理；reply.localVersion是成功CAS版本，不把临时组件state当canonical cache。protocol schema保持43项，未扩大业务功能。

### 13.4 helper完整签名及memory draft裁剪

app/application_composition.ts中各helper纯factory完整签名：
- LocalReadInputFactory.create(input: LocalReadInput): Outcome<LocalReadInput>
- DraftReadInputFactory.create(input: DraftReadInput): Outcome<DraftReadInput>
- AccessibilityReadInputFactory.create(input: AccessibilityReadInput): Outcome<AccessibilityReadInput>
- PersistProjectionInputFactory.create(input: PersistProjectionInput): Outcome<PersistProjectionInput>
- NavigateProjectInputFactory.create(input: NavigateProjectInput): Outcome<NavigateProjectInput>
- DirectorySearchInputFactory.create(input: DirectorySearchInput): Outcome<DirectorySearchInput>
- CommandResultInputFactory.create(input: CommandResultInput): Outcome<CommandResultInput>

各函数只结构/分支检查，不能为material产生正式资格。LoadDraft输入独立DraftReadInput(fence/contextRef)，只当前memory root，不依赖projection key/locator/partition；LoadLocalProjection仍LocalReadInput(fence/partition/key/context候选)。nullable响应表面与source provenance字段保持原规则。request身份和版本只helper外层唯一定义，不复制进业务payload。targets[]各reference/access逐ref绑定已同步全字段表。
