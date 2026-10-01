# L5-chat 03 · Step 7 Port / Adapter 契约

> 状态：done；gate_status：pass_with_upstream_blockers；2026-10-01逐模块补齐并停审。
> 前置：Step6 pass_with_upstream_blockers；来源：Step5模块、Step6对象、正式01 SDK唯一业务接入边界；参考Governance Step7逐模块capability/port/读取面/版本/停审结构。
> 本文件定义Chat内部typed ports，不发明SDK wire DTO、HTTP路由、bus topic；外部exact binding未闭合的实现必须dependency_unbound。
> 当前连续授权完成Step7，承接Step6六批次闭口；§3.4为前轮历史停点，以下§4～13为本轮新增，顺序停审。

## 1. Step内计划与SOP回答

| 批次 | 输出 | 状态 | gate |
|---|---|---|---|
| local基础/分页/state/projection | §2～§3 | done | ID、version、读写配对与page helper |
| navigation/collaboration/materials | §4～§6 | done | access-first、safe read |
| intents/continuity | §7～§8 | done | prepare/dispatch/result与formal资格 |
| platform/config/diagnostic/SDK | §9～§12 | done | least authority与exact blocked binding |
| cross-port审计 | §13 | done | 无重复port/缺读面/反向实现依赖 |

问题回答：port定义在消费者责任文件，SDK/platform/memory实现由app注入。业务coordinator只访问port，不import实现。local version来自get/read，只有local CAS，无owner UoW/outbox。SDK query返回qualified安全投影，分页cursor与scope/visibility关系不得本地猜。外部typed schema仍待SDK owner正式定义；本地port signature足以实现blocked/fake区分路径，不能据此实现私有transport。

## 2. local基础与page helper

### 2.1 LocalIdentityPort

定义于navigation/route_context.ts；调用方coordinators/app/AT；实现为composition注入的本地安全随机ID provider，不承担owner id生成。

```ts
/** 本地标识生成，无owner或幂等key权威。 */
interface LocalIdentityPort {
  newId<K extends string>(kind: K): LocalId<K>;
}
```

非空种类brand，不能用ref/title/时间戳直接拼接；失败启动fail-fast，测试fixture provider必须fake标记，不充当业务结果。

### 2.2 LocalPageRequest、LocalPageInfo、LocalPage

唯一定义在Step6 §15，定义路径collaboration/conversation_surface_view_model.ts。本Step不重复schema；LocalPageRequest完整字段为limit/cursor/lineageRef，LocalPageInfo为nextCursor/lineageRef/hasMore/coverage，LocalPage<T>为items/pageInfo/surface，ReadSurface为status/access/freshness。逐字段factory约束及not_visible清理规则直接承接Step6。
| 类型/branch | 来源/映射/约束 |
|---|---|
| limit | validated config允许范围，positive safe integer；不是业务owner默认值 |
| cursor/nextCursor/lineageRef | SDK正式分页；cursor存在须有formal lineage及当前actor/scope/project/target/source/query/filter代次；缺合同dependency_unbound，禁止本地拼接/排序 |
| hasMore | 只映射formal page语义；与nextCursor不一致拒绝，不假定SDK所有分页都同公式 |
| complete/partial/unknown | formal coverage完整/局部/未知；不凭items长度判断 |
| visible/empty | 正式可见且有/无items；empty有资格与freshness，无subject不存在推断 |
| not_visible | 正式拒绝，items=[]、cursor=null、无title/ref；hidden access |
| missing | SDK正式允许暴露的缺失结论，不能从404/空数组自行产生 |
| unavailable/blocked | 缺依赖/缺安全合同，items=[]；no private fallback |

LocalPage<T>→Step8 response逐字段映射，所有二级类型是Chat-local display schema，非wire契约。safe project/people分页复用同helper，但不能继承Conversation scope或cursor。外层QualifiedMaterial必须保留当前消费context；items安全值逐项保留自己的owner/provenance/freshness，空页不能推断不存在或全公司coverage。

## 3. local_state模块ports

| capability/对象 | 接缝 | 调用方→实现方 | 读取/写入承接 |
|---|---|---|---|
| ClientSnapshot/immutable CAS | ClientStatePort | 所有coordinator→ClientStateStore | read+compareAndSet配对 |
| DraftState | DraftPort | DraftCoordinator→DraftStore | get/list/save/remove |
| LocalProjectionEntry | LocalProjectionRepository | Recovery/Eviction→MemoryProjectionRepository | load/list/save/evict |

### 3.1 ClientStatePort

```ts
/** 本地唯一root，写入不触及owner。 */
interface ClientStatePort {
  read(): ClientSnapshot;
  compareAndSet(expected: LocalVersion, fence: ContextFence | null, patch: ClientPatch): Outcome<ClientSnapshot>;
  replaceSession(session: QualifiedSession | null, route: RouteContext): Outcome<ClientSnapshot>;
  subscribe(listener: (snapshot: ClientSnapshot) => void): () => void;
}
```

定义client_state_store.ts；expected只来自同read snapshot.version；fence=null只允许初始/已清理安全root transition，不能绕过actor/scope检查。CAS失败local_conflict，pure reducer可重算；已dispatch command绝不因此重新调用SDK。replaceSession只能trusted composition/session boundary调用，先generation fence失效+遮蔽。无跨owner事务、outbox/history/audit副作用。

承接修复后Step6 ClientSnapshot：continuityBySource/resumesBySource/consumedChanges按正式source分区，consumptionContexts是各query/change/section当前槽位；projectDetail/projectNavigation/processNodeDetail/companyDirectory为local页面slice。patch涉及的incoming消费context必须与当前槽位匹配，不能仅凭root version或fence覆盖新节点/搜索。projectNavigation与surface.selection只是唯一root local状态的只读派生；根session切换清全部槽位与page refs。

ClientPatch采用Step6唯一定义的`{ changes, consumptionChecks }`，ConsumptionCheck为`{ slotId, incoming }`；CAS一次核对全部slot与root当前context再应用changes，失败无部分写入。异步材料/结果/水位不得用空checks；同步local草稿/选择/视口及可验证的清理/降权才可空。正式scope revoke先使受影响slot失效，不能因为旧slot已invalidated而拒绝安全遮蔽。

### 3.2 DraftPort

```ts
/** 对唯一root草稿map的typed访问，非第二份store。 */
interface DraftPort {
  get(context: ExternalHandle<"context">): Outcome<{ readonly draft: DraftState | null; readonly version: LocalVersion }>;
  list(fence: ContextFence): Outcome<readonly DraftState[]>;
  save(draft: DraftState, expected: LocalVersion, fence: ContextFence): Outcome<void>;
  remove(context: ExternalHandle<"context">, expected: LocalVersion, fence: ContextFence): Outcome<void>;
}
```

定义draft_store.ts；仅conversation/thread草稿，项目/目录不得伪造context创建草稿；每次get返回root version，save/remove必须该version；draftRevision用于编辑关联，不能作CAS。missing返回null，无法验证context返回access_denied。无durable写入。

### 3.3 LocalProjectionRepository

```ts
/** 受限投影repository，默认memory；durable无资格不可替换。 */
interface LocalProjectionRepository {
  load(key: LocalId<"cache_key">, partition: LocalPartition): Promise<Outcome<LocalProjectionEntry | null>>;
  list(partition: LocalPartition, after: LocalId<"cache_key"> | null, limit: number): Promise<Outcome<LocalProjectionPage>>;
  save(entry: LocalProjectionEntry, expected: LocalVersion | null, fence: ContextFence): Promise<Outcome<LocalProjectionEntry>>;
  evict(key: LocalId<"cache_key">, partition: LocalPartition, expected: LocalVersion | null): Promise<Outcome<DeleteResult>>;
}
/** 本地key分页，与owner cursor分离。 */
interface LocalProjectionPage {
  readonly entries: readonly LocalProjectionEntry[];
  readonly nextKey: LocalId<"cache_key"> | null;
}
```

定义local_projection_repository.ts；load带entry.localVersion，save更新使用读取version，新记录expected=null要求不存在；不能blind upsert覆盖另一session。evict expected=null仅确认不存在场景/partition sweep先list取得versions，不能强制覆盖新记录。
list按local opaque key稳定字典序仅供本地存储分页，**不排序owner cursor/revision**；after来自前页nextKey；每页正limit，partition隔离；清理覆盖迭代必须处理并发新generation，snapshot fence阻止新写。
DeleteResult错误只storage_unavailable/local_conflict，不伪造cleared；memory map清理为memory事实，durable adapter未建立。

模块停审：仅§2～3已写前缀的读取、版本、分页和delete语义一致性通过；不是Step7整体pass。Step11仍需定义本地一致性，不提前证明durable。

### 3.4 2026-10-01已写前缀重审停点

| 已写内容 | 修正/结论 |
|---|---|
| LocalIdentityPort | lowerCamelCase newId，与Step6 local brand匹配；随机ID不替代owner或幂等关联 |
| page helper | 补正式lineage与当前source/query代次，不从hasMore猜SDK formula；project/people只复用安全local helper |
| ClientStatePort | 承接source分区/新page slice/current消费slot；CAS失败不重发命令，撤销先遮蔽 |
| DraftPort | 保持唯一root草稿，只用于正式Conversation语境，revision与root version分离 |
| repository | get/save/delete带local version和partition；六类safe locator缺serializer仍blocked，默认memory |
| 未写批次 | navigation/collaboration/materials、intents/continuity、platform/config/SDK与cross-port均waiting；新增Load*能力未闭合 |

本轮已写前缀一致性审查完成后停下，整体状态仍in_progress/reviewing；CHAT-UP-001～009、WS-UP-*、CHAT-BASE-001及host/storage缺口未关闭。后续若授权完成Step7，先读修复后Step6、Step7 SOP/书写规范和SDK/Process/关系/目录正式合同，再按模块展开，未通过前不能创建Step8。未实现、未测试、未提交或产生readiness。

## 4. navigation模块：入口资格接缝

| capability/Step6对象 | port | 调用方 → 实现方 | 后续 |
|---|---|---|---|
| Route.enter/applyEntryResult、VisibilityGuard、ScopeEntryGuard | EntryAccessPort | RouteContextCoordinator → SdkQueryAdapter | ResolveEntryAccess；所有跳转独立解析 |
| 预解析关联 | EntryResolutionFence/QualifiedEntryResolution | trusted session/request → registry | 不要求未知目标scope先存在 |

定义navigation/entry_guards.ts，错误统一Outcome的ChatError；入口候选可空，不允许把candidate ref当授权。

```ts
/** 由正式SDK资格解析候选入口。 */
interface EntryAccessPort {
  /** 请求fence隔离晚到；结果scope由SDK证明。 */
  resolve(input: EnterRouteInput, session: QualifiedSession): Promise<Outcome<QualifiedEntryResolution>>;
}
```

输入actor/session只能trusted SDK binding提供；requestedScopeRef仅候选。result hidden清正式目标引用，requestFence仍用于本地关联。source资格核对成功才构造ContextFence；back/群聊→项目/目录→成员不能沿用前页权限。取消只读是aborted_read。缺能力dependency_unbound，不能从空结果构造missing。

模块停审：前入口不循环依赖ContextFence；resolve字段可完整构造Step6 entry factory；无owner mutation；CHAT-UP001/005/009保持blocked。planned切口为deep-link伪候选、late response、thread父关系、隐藏目标、返回重验。

## 5. collaboration模块：逐能力读取面

| capability/对象 | 调用方 | provider实现 | port归属 |
|---|---|---|---|
| entry/surface/Turn page | CollaborationSurfaceCoordinator | SdkQueryAdapter，Conversation formal safe read | collaboration_surface_coordinator.ts |
| 项目list/detail/links | ProjectContextCoordinator | SdkQueryAdapter，Work及正式relationship provider | 同一consumer port，独立source slot |
| 整体/阶段/节点 | ProcessDrilldownCoordinator | SdkQueryAdapter，Process formal topology/association + owner sections | 不能从Runtime/WorkItem补图 |
| directory/member contexts | DirectoryCoordinator | SdkQueryAdapter，正式directory及独立成员owner | provider未确认blocked |

```ts
/** 所有方法返回safe local投影，非SDK公开DTO。 */
interface CollaborationReadPort {
  /** 授权入口列表，分页不推存在性。 */
  readEntry(input: EntryReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<EntryReadProjection>>>;
  /** group/channel/dm/thread共用surface。 */
  readSurface(input: SurfaceReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<SurfaceReadProjection>>>;
  /** 同query lineage的历史页。 */
  readTurnPage(input: TurnPageInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<TurnPageProjection>>>;
  /** Work正式授权项目页。 */
  readProjectList(input: ProjectListReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<LocalPage<SafeMaterialSnapshot>>>>;
  /** 独立section资格，非跨owner原子快照。 */
  readProjectDetail(input: ProjectDetailReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<ProjectDetailReadProjection>>>;
  /** Process项目整体拓扑及独立状态来源。 */
  readProjectProcessFlow(input: ProcessFlowReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<ProcessFlowReadProjection>>>;
  /** 正式父子关系及父revision核对。 */
  readStageProcessFlow(input: StageFlowReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<ProcessFlowReadProjection>>>;
  /** 当前节点正式关联与独立owner sections。 */
  readProcessNodeDetail(input: ProcessNodeReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<ProcessNodeReadProjection>>>;
  /** 关系与目标访问分别证明，不修改绑定。 */
  readProjectConversationLinks(input: LinkReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<SafeProjectConversationAssociationView>>>;
  /** 正式provider搜索/coverage/page。 */
  readCompanyDirectory(input: DirectoryReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<SafeDirectoryPageView>>>;
  /** identity/projectMember/participant/presence分源。 */
  readMemberContext(input: MemberContextReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<MemberContextReadProjection>>>;
}
```

每签名输入唯一在Step6 §15/16；返回qualified outer source仅对应本次读取，nested summary/topology/sections保持独立ConsumptionRequest和authority。SDK adapter应按正式section请求注册独立槽位，返回嵌套consumptionContext用于CAS checks，不用父request冒充section来源。无正式target/source资格则nullable缺口，不以空数组伪全覆盖。

| 方法 | 构造映射/边界 | 安全缺口 |
|---|---|---|
| readEntry | EntryReadInput.request/page → EntryReadProjection.LocalPage/SafeEntryView | access/lineage缺失blocked |
| readSurface | SurfaceReadInput.contextRef/parentContext/page → SurfaceReadProjection | hidden contextRef=null，不留thread parent |
| readTurnPage | TurnPageInput → TurnPageProjection | lineage错context_changed，不能按cursor排序 |
| readProjectList | ProjectListReadInput → LocalPage<SafeMaterialSnapshot> | provider为Work，空页不missing |
| readProjectDetail | project→summary/workItems/evidenceRefs独立qualified | 未获证据access不返回ref |
| readProjectProcessFlow | project正式Process关联→topology/states/governanceRefs | CHAT-UP008 |
| readStageProcessFlow | project/process/stage/parentRevision→formal child | 父revision错丢弃，不显示旧子图 |
| readProcessNodeDetail | node/parentRevision→associations+sections | association不按label关联 |
| readProjectConversationLinks | anchor→正式关系、逐目标access | CHAT-UP009；不作binding mutation |
| readCompanyDirectory | provider/search/page→people/coverage | CHAT-UP009；搜索代次及lineage |
| readMemberContext | person/project/conversation → 四section | participant可见不推projectMember |

代码类型统一SafeMaterialSnapshot，无Snapshot别名。source/change_source/page cursor等由registry正式映射，不cast。返回unavailable/blocked必须不携带未许可内容，已qualified的empty保留正式access。source独立freshness，禁止同一HTTP响应制造跨owner版本。

模块停审：11个读取方法承接全部协作功能；六VM当前字段有读取来源，节点页读源不借父access，导航/search代次和分页分离。planned切口：父版本更新、目录搜索晚到、解绑撤销、部分owner失效、图/list/AT同安全集合。CHAT-UP008/009不因port定义关闭。

## 6. materials模块：安全摘要、预览与locator

| capability/对象 | port定义位置 | 调用方 → 实现方 |
|---|---|---|
| Snapshot/Provenance/Freshness | materials/safe_material_composer.ts | coordinator → SdkQueryAdapter |
| PreviewBoundary/PreviewReference | materials/preview_boundary.ts | preview入口 → SdkReferenceAdapter |
| 恢复safe locator | 同preview_boundary.ts type-only schema | Recovery/persistence → SdkReferenceAdapter |

```ts
/** 单owner摘要，仍保留独立消费语境。 */
interface SafeMaterialReadPort {
  readSummary(input: OwnerSummaryReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<SafeMaterialSnapshot>>>;
}
/** 本轮只允许正式无副作用预览和安全候选映射。 */
interface SafeReferencePort {
  preview(input: PreviewReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<PreviewResultView>>>;
  toRestorationHint(target: OwnerReference, session: QualifiedSession): Promise<Outcome<RestorationHint>>;
}
```

toRestorationHint须正式SDK safe locator/partition合同；locator仅候选，不授access；不适用于私造attempt locator，正式attempt序列化能力缺失继续blocked。LoadLocalProjection可读取既有memory候选，但不能因没有serializer自行拼ownerref。preview结果必须重验当前slot和Artifact access；需要业务副作用的preview能力本轮不绑定，不使用HTTP method自行判定只读。缺host open时安全摘要可读，受控打开按钮不可用。

模块停审：全部字段safe来源可回指Step6；无raw URL、任意HTML、下载正文缓存、文件/网络权限或Artifacts owner mutation。CHAT-UP004/host/storage保持blocked；planned切口为过期preview、隐藏ref、恶意token、preview late和locator未知版本。

## 7. intents模块：prepare/dispatch/probe接缝

| capability/对象 | 接缝 | 调用方 → 实现方 | 门禁 |
|---|---|---|---|
| Attempt/Draft冻结与association | IntentCommandPort.prepare | UserIntentCoordinator → SdkCommandAdapter | SDK正式no-effect prepare |
| 一次受控调用 | IntentCommandPort.dispatch | reservation胜出者 → SdkCommandAdapter | dispatch前local CAS，非ACK确认 |
| Capability/unknown probe | IntentProbePort | UserIntentCoordinator → SdkQueryAdapter | 正式owner/actor/Gate/action匹配 |

定义于intents/user_intent_coordinator.ts；DraftPort依旧在local_state，gate纯对象无IO。

```ts
/** SDK是唯一业务命令入口；不生成SDK幂等key。 */
interface IntentCommandPort {
  /** 必须正式无副作用；冻结payload只暂存于此次调用。 */
  prepare(input: CommandPrepareInput, session: QualifiedSession): Promise<Outcome<PreparedCommand>>;
  /** prepared来自正式registry；local已reserveDispatch，仅调用一次。 */
  dispatch(prepared: PreparedCommand, session: QualifiedSession): Promise<Outcome<CommandSubmission>>;
}
/** capability和结果都是读取，不重发。 */
interface IntentProbePort {
  readCapability(input: CapabilityReadInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<IntentCapabilityView>>>;
  probe(input: ProbeAttemptInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<FormalProbeResult>>>;
}
```

参数schema唯一Step6 §17。prepare返回intent/actor/request/association/preparedRef；正式SDK必须冻结并封装待发送值，不允许Chat在dispatch再次读取编辑后的正文；缺no-effect/冻结合同返回dependency_unbound。SDK决定actor metadata/idempotency关联，Chat的intentId仅本地correlation。dispatch错误effect_unknown除非正式证明not_dispatched/no effect；调用开始后的任意transport error不得failed。

所有返回材料必须与attempt的intent/fence/actor/association、formal command kind和current consumptionContext匹配。普通receipt最多submitted/pending；business_confirming须ResultAuthority正式合同。终态同intent重复no-op，冲突正式结果invalid_transition并保留安全unknown/conflict提示；unknown无自动重试。失败/拒绝后的用户retry建立新logical intent，重新读capability、冻结当前草稿，不复用未知attempt调用权。

模块停审：SDK.prepare与本地CAS各司其职；local duplicate map来自root.attempts，不新增结果backend。planned切口：双击/StrictMode、prepare拒绝、dispatch前进程中断、调用后断线、普通ACK、probe not_found、确认不清新revision。CHAT-UP001/003仍阻塞正向业务调用。

## 8. continuity模块：正式feed/资格/resume接缝

| capability/对象 | port定义位置 | 调用方 → 实现方 |
|---|---|---|
| 正式变化订阅/停止 | continuity/change_reducer.ts | composition/lifecycle/eviction → SdkChangeAdapter |
| ChangeAcceptanceRecord的source/顺序/coverage | 同上 | ChangeReducer → SdkChangeAdapter |
| ResumeContext/ContinuityState | continuity/resume_coordinator.ts | ResumeCoordinator → SdkChangeAdapter |

以下三个local helper只承载subscription管理，归change_reducer.ts，不是wire envelope；factory纯校验slot/registry/session，有限分类无生命周期。

```ts
/** 单source订阅请求，不含topic/broker URL。 */
interface FeedInput {
  readonly request: ConsumptionRequest;
  readonly sourceRef: ExternalHandle<"change_source">;
}
/** local注册的一次订阅；不能充当owner receipt。 */
interface FeedSubscription {
  readonly subscriptionId: LocalId<"subscription">;
  readonly sourceRef: ExternalHandle<"change_source">;
  readonly sessionEpoch: SessionEpoch;
}
/** request关联给当前source消费，不解析opaque revision。 */
interface ChangeQualificationInput {
  readonly request: ConsumptionRequest;
  readonly change: QualifiedMaterial<FormalChangeView>;
  readonly continuity: ContinuityState;
}
/** 唯一SDK正式feed，listener调用不证明业务提交。 */
interface ChangeFeedPort {
  subscribe(input: FeedInput, session: QualifiedSession, listener: (change: QualifiedMaterial<FormalChangeView>) => Promise<Outcome<void>>): Promise<Outcome<FeedSubscription>>;
  stop(subscription: FeedSubscription): Promise<Outcome<void>>;
  stopContext(fence: ContextFence): Promise<Outcome<void>>;
  stopAll(): Promise<Outcome<void>>;
}
/** 正式source顺序与关联由SDK证明；不是local cursor比较器。 */
interface ChangeQualificationPort {
  qualify(input: ChangeQualificationInput, session: QualifiedSession): Promise<Outcome<ChangeQualification>>;
}
/** resume/requery独立single-source恢复，不包含业务命令。 */
interface ResumePort {
  resume(input: ResumeInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<ResumeResultView>>>;
  requery(input: ResumeInput, session: QualifiedSession): Promise<Outcome<QualifiedMaterial<ResumeResultView>>>;
}
```

helper字段来源：request为root当前slot，sourceRef registry正式change source与context.sourceReference关联，change来自正式feed，continuity来自同root source map；subscriptionId localidentity，sessionEpoch trusted session；类型所有字段readonly且不可恢复序列化。FeedInputFactory.create(input: FeedInput): Outcome<FeedInput>；FeedSubscriptionFactory.create(input: FeedSubscription): Outcome<FeedSubscription>；ChangeQualificationInputFactory.create(input: ChangeQualificationInput): Outcome<ChangeQualificationInput>。缺关系dependency_unbound；错误不会产生成功subscription。

stop幂等，不宣称command cancelled；listener迟到仍需current context。SDK应承接背压/正式subscription合同，缺能力blocked，不能直用skeleton openSubscription(unknown)。local maxConsumedChanges达到上限不能静默清set后接受旧event；先invalidate该消费代次并要求正式resume/requery新coverage，不能local变fresh。

visibility tightening是特殊安全路径：验证current session/actor/scope/source及正式作用范围，不以已invalidated node slot拦截scope revoke；先registry revoke、invalidate/hide再stop。feed accepted资格不能替代material/result gate。resume complete必须当前recovery、正式coverage/revision、水位边界一致，才能fresh；ACK无资格。

模块停审：source-local slots、consumed set和cursor同CAS更新；没有bus/UoW/outbox；planned切口为duplicate/out-of-order/gap、node关闭后scope revoke、stop迟到、resume partial、set容量与断线。CHAT-UP002/008/009持续blocked。

## 9. platform/native_host：probe/lifecycle/AT

| capability/对象 | port位置 | 调用方 → 实现方 |
|---|---|---|
| PlatformCapabilityState.applyProbe | platform/platform_capability_state.ts | PlatformCapabilityAdapter → DesktopPlatformAdapter/WebPreviewPlatformAdapter |
| ShellLifecycleCoordinator.consume | platform/shell_lifecycle_coordinator.ts | composition listener → bounded native host |
| AccessibilityState/FocusTarget | platform/accessibility_semantic_adapter.ts | AccessibilitySemanticAdapter → approved host/DOM adapter |

```ts
/** 能力探测不授业务权限。 */
interface PlatformPort {
  probe(kind: PlatformCapabilityKind): Promise<Outcome<PlatformProbeResult>>;
  /** 仅正式受控入口；本轮native handler未闭合时blocked。 */
  open(reference: ExternalHandle<"controlled_open">): Promise<Outcome<void>>;
}
/** 最小可信生命周期通知；release只清订阅。 */
interface LifecyclePort {
  subscribe(listener: (event: ShellLifecycleEvent) => Promise<Outcome<void>>): Outcome<() => void>;
}
/** 只消费已裁剪的安全regions/announcement，无owner IO。 */
interface AccessibilityPort {
  preferences(): Outcome<AccessibilityPreferences>;
  focus(target: FocusTarget, regions: readonly SemanticRegion[]): Promise<Outcome<void>>;
  announce(announcement: StatusAnnouncement): Promise<Outcome<void>>;
}
```

open不接受URL/path/shell命令；仅SDK preview和host双方正式资格成立才允许。native最小request只Lifecycle/Accessibility probe；本轮controlled open、安全storage native未授权，open必须blocked，不添加伪执行variant。Rust HostBoundaryGuard请求/响应/错误唯一定义Step6 §10.9；origin来自trusted invocation，不能从request/window文本假定可信。

preferences字段reducedMotion/highContrast是本地display偏好；focus要求target在当前安全regions，页面隐藏后不能聚焦旧node。announce有限code，无标题正文、secret或审批成功猜测；AT交付成功不代表owner业务成功。图/list/键盘消费同safe topology、相同selection与父revision，不隐藏泄露数量/关系。

模块停审：TS与Rust边界、Web preview缺能力及等价路径明确；planned切口为origin/window伪造、Web preview native拒绝、host late probe、键盘回退、无正文aria-live与降低运动。host集成未验证，保持blocked。

## 10. config/app：本地typed装配输入

ConfigLoader消费者定义config/config_loader.ts；输入唯一定义Step6 §19 LocalConfigInput，只有local strict parse允许unknown。

```ts
/** 批准local profile来源，无网络/secret或owner权限配置。 */
interface LocalConfigSource {
  read(): Promise<Outcome<LocalConfigInput>>;
}
```

ConfigLoader.load→source.read→validate(value)；schema/profile不匹配立即blocked startup，不注入半有效config。ClientConfig全部字段见Step6 §11.1，memoryOnly=true/diagnostic默认disabled；确切限值/SDK版本/host权限留Step14/04，不能已实施。ApplicationComposition显式注入上述ports，blocked适配器返回typed error；UI/app不得访问SdkPublicClient或SDK业务入口。所有dispose先hide/invalidate，再stop subscriptions/unbind/clear memory；不把dispose当owner取消。

模块停审：没有全局service locator；React hooks只订阅/释放；所有点击由callback触发，StrictMode effect不提交。planned切口为unknown key、secret/endpoint注入、缺profile、dispose顺序和重入；确值/production profile仍waiting。

## 11. diagnostic/sdk_adapters：受限交付

DiagnosticPort定义sdk/diagnostic_handoff_adapter.ts，调用方显式用户支持操作/Recovery；实现DiagnosticHandoffAdapter。这两个名称对应局部用例，不是公共bus事件。

```ts
/** 仅低敏allowlist正式sink；disabled不发送。 */
interface DiagnosticPort {
  send(input: DiagnosticContext, session: QualifiedSession): Promise<Outcome<DiagnosticHandoffView>>;
}
```

DiagnosticContext唯一定义Step6 §19，strict reject多余字段；accepted只能正式sink receipt，unknown不自动重发。缺sink/用户操作blocked/disabled；没有append backend日志/证据。SDK adapters只实现consumer定义port，各factory deps见Step6 §20，不从UI查globalclient。native host不持SDK credential。

模块停审：诊断failure不影响业务权限/成功，不作报告验收。planned切口：secret字段、disabled发送、未知交付重送、fake receipt；CHAT-UP007仍blocked。

## 12. SDK实际出口绑定矩阵

真实源码只作为implementation evidence：typescript eventClient.publish(command: unknown, meta: unknown) / openSubscription(query: unknown, meta: unknown)仍throw host runtime wiring；不证明以下能力已export或可运行。下表每行required capability为Chat本地方法名；SDK正式method/type均未确认，因此**全部blocked**。

| local operation → port方法 | 必须由SDK正式提供的合同 | blocker |
|---|---|---|
| entry_read → resolve/readEntry | actor/session/scope、候选解析、entry safe页/lineage、visibility | CHAT-UP001/002/005 |
| surface_read/turn_page → readSurface/readTurnPage | Conversation entry/thread关系、Turn safe类型、history排序/page | CHAT-UP001/002 |
| owner_summary → readSummary | owner/source/visibility/redaction、version/coverage | CHAT-UP004/005/006、WS-UP |
| project_list/project_detail → readProjectList/readProjectDetail | Work授权项目/工单、分source sections与证据资格 | CHAT-UP001/006 |
| project_process_flow → readProjectProcessFlow | Process整体safe topology/links/state版本 | CHAT-UP008 |
| stage_process_flow → readStageProcessFlow | formal层级/父revision/Gateway边界 | CHAT-UP008 |
| process_node_detail → readProcessNodeDetail | 正式node association/每目标owner独立access | CHAT-UP008 |
| project_conversation_links → readProjectConversationLinks | 正式provider owner/解除/撤销/目标access | CHAT-UP009 |
| company_directory → readCompanyDirectory | provider owner、人类/AIcoverage、search/page/visibility | CHAT-UP009 |
| member_context → readMemberContext | identity/projectMember/participant/presence独立safe read | CHAT-UP006/009 |
| conversation_command/governance_command → prepare/dispatch | no-effect prepare、payload冻结、正式actor metadata/idempotency、business result/receipt | CHAT-UP001/003 |
| command_probe → probe | intent/association正式查询、not_found及no-effect语义 | CHAT-UP001/003 |
| change_feed/change_qualification → subscribe/qualify | source映射、change identity、顺序/覆盖/visibility范围 | CHAT-UP002/008/009 |
| resume → resume/requery | cursor/coverage/gap、snapshot↔feed边界、业务无重放 | CHAT-UP002/005/008/009 |
| preview → preview | Artifact只读safe preview/受控open/expiry | CHAT-UP004/host |
| diagnostic → send | 正式低敏sink/receipt/redaction | CHAT-UP007 |
| intent_capability（补足local registry）→ readCapability | actor/scope/intent/Gate/action当前正式能力 | CHAT-UP001/003 |
| safe_locator（补足local registry）→ toRestorationHint | safe locator/partition/serializer版本及撤销 | CHAT-UP001/storage |

SdkOperation原§9.1须补intent_capability/safe_locator两本地operation，否则require没有对应索引；BindingRequirement保留原集合，page/section/coverage细合同由formalContractRef追踪。正式引用未获确认时formalContractRef=null、missing如实列缺项；不得填写invented SDK export或把本表变成SDK wire定义。

## 13. 跨模块停审、诊断、取舍与回填

| 审计项 | 结论/修正 | 下步承接 |
|---|---|---|
| port归属/调用方/实现方 | 每consumer责任文件唯一定义；SDK/platform只实现，composition注入 | Step8逐协议 |
| 输入/输出二级schema | Step6独立卡为唯一，Step7只新增FeedInput/Subscription/QualificationInput及LocalProjectionPage | Step8字段闭环 |
| local读取/写入version | root read→CAS；Draft get→save/remove；projection load/list→save/evict | Step9局部一致性 |
| async资格/槽位 | 根version/fence与全部nested current slots核对；scope revoke先隐藏 | Step9 late/revoke |
| command幂等 | SDK association；dispatch前reservation；no-effect prepare | Step9逐Command |
| 变化/恢复 | SDK formal identity/order/coverage；source-local水位，不比较opaque值 | Step9逐Consumer/Job |
| negative/empty/blocked | hidden清ref/page；empty不missing；正向contract缺失typed blocked | Step8 response view |
| external binding | 全部正式业务方法尚未确认，blocked；不能skeleton fallback | 实施仍blocked |
| 边界污染 | 无backend UoW/outbox/bus、无SDK重新实现、无owner写接口 | pass |

问题诊断：前轮prefix有page重复schema，完整读取面/正式result/host和bindings尚未展开。原位修复：page引用Step6，按consumer模块完成ports、逐方法source/version与失败。取舍：本地签名完整，SDK exact binding依然blocked；定义签名不是闭合上游合同。

各模块已独立停审，跨port设计审计通过，gate_status=pass_with_upstream_blockers。回填草稿为§2～13进入未来正式03模块及trait索引，当前不装配。进入Step8前读取SOP Step8/书写规范5.7、Governance Step8分族schema及正式02§7完整43项；未实现、未运行测试、未提交。

### 13.1 Step9字段/构造回查修正

Step9审计将全部protocol input字段传递到coordinator：Step6 loadDetail/loadProjectFlow/loadStageFlow/loadNodeDetail/Directory.load/loadMemberContext改为接收既有typed input（stage/node另带当前parent model）；不丢workItemPage/project/conversation等字段。port签名不变。CompanyDirectoryViewModel补pageInfo承接cursor/lineage/coverage，nextPageRef只读派生。

ClientSnapshot补entry/projectList/preview/intentCapabilities四个canonical local display slices，各read必须具名current slot并CAS；初始null/空map，当前读结果不得只保留在组件里越过撤销。ClientStatePort仍read/CAS，不新增owner持久化或网络API。此处是设计反向闭口修正，不是SDK已实现证据。

### 13.2 Step9幂等与写入撤销闭口

Governance attempt增加gateReference/governanceAction两个safe关联字段，AttemptFactory.fromGovernance完整构造，防同Gate/action重复点击需要实现端猜key。conversation两字段null；无Decision truth。ProjectContextCoordinator.loadList/loadLinks用完整typed input保留slotId；Directory.search/loadNext用ConsumptionRequest保留slot。

LocalProjectionRepository.save(entry,expected,fence)新增当前fence参数，MemoryProjectionRepository注入ClientStatePort；正式partition与current epoch/scope及未失效write eligibility核对后，在同JS turn无await地完成内存CAS/set。撤销先失效当前fence/partition写入资格，再异步清理，不允许旧pending save复活。durable driver本轮不实现；未来必须证明等价原子资格检查。现有evict版本合同不变，generation切换不得强制删除新session材料。

ClientSnapshot.conversationLinks承接群聊→项目安全关系；projectDetail.conversationLinks承接项目→群聊，均只当前context展示不持binding truth；各自当前slot和撤销清理。初始null，完整字段Step6同名VM。此修正通过local设计门禁，不关闭SDK/provider/storage blocker。
