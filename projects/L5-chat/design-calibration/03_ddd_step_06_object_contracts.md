# L5-chat 03 · Step 6 对象实现契约

> 状态：done；gate_status：pass_with_upstream_blockers；2026-10-01补齐6-A～F并停审；只通过本地设计门禁。
> 前置：Step5 pass_with_upstream_blockers。来源：正式02 §6/§9、Step3～5；参考Governance Step6逐模块capability→对象→字段/函数/状态→停审结构。
> 本文件TS/Rust声明是planned设计契约；TS中文JSDoc解释语义，Rust源码片段英文rustdoc、中文正文说明；不在设计仓实现代码。

## 1. Step内计划、批次与对象闭口决策

| 批次/顺序 | 范围 | 状态 | 完整性/停审 |
|---|---|---|---|
| 6.0 | shared vocabulary与错误 | done | local类型与opaque SDK边界完整，pass |
| 6.1 | materials | done | 来源/披露/freshness/preview完整，pass |
| 6.2 | navigation | done | route/access/guards/coordinator/ClientConsumptionContext，pass_with_upstream_blockers |
| 6.3 | collaboration | done | 原Conversation与项目/Process/节点/关系/目录对象、coordinator、props，pass_with_upstream_blockers |
| 6.4 | intents | done | draft/attempt/gate/feedback/coordinators完整，pass |
| 6.5 | continuity | done | source/resume/acceptance/recovery/reducer完整，pass |
| 6.6 | local_state | done | source分区store/slot检查patch/repository/清理，pass_with_upstream_blockers |
| 6.7 | sdk | done | binding与adapter对象完整，正向blocked |
| 6.8 | platform/native_host | done | host/AT/lifecycle完整，正向blocked |
| 6.9 | config/app | done | profile/loader/composition/entry完整，pass |
| 6.10 | 跨模块审计 | done | 字段/状态/命名/Step7承接完整，pass |

| 模块类别 | 闭口决定 | 理由/后续 |
|---|---|---|
| 所有Chat-local模型、guard与view model | 当前闭口 | 唯一状态/字段来源，不留给flow临时补 |
| coordinators/store/adapter/React props/app entry | 当前闭口 | 所需dependencies、context fence、dispose、返回面稳定 |
| 正式SDK wire/export schema | 不在Chat定义 | Step7登记exact blocked binding；需L0-sdk owner正式合同 |
| durable driver/crypto、具体Tauri插件 | 外部资格defer | 不创建实现对象；Step11/14与04按正式能力闭合 |
| 配置精确数值/版本、测试runner | 后续闭合 | 本步定义字段类别/不变量；Step14、04、05/07收敛 |

SOP问题回答：先建立此骨架，再shared类型，再按上述顺序各模块功能映射与对象卡。对象字段来自local factory、store读取或qualified SDK投影；不从旧03猜字段。adapter/entry对象本步闭口，wire能力保持blocked。状态采用正式02名称，附加route/selection的已有概要状态。public二级local类型归唯一定义文件；owner类型只opaque引用。所有对象返回不可变值，不在对象方法内部业务IO。

## 2. Shared vocabulary与authority边界

### 2.1 `LocalId`、`LocalVersion`、`ContextFence`

定义位置：navigation/route_context.ts；LocalVersion在local_state/client_state_store.ts作为type-only唯一导出。

```ts
/** Chat生成的非空不透明本地标识，不与owner id互换。 */
type LocalId<K extends string> = string & { readonly localKindBrand: K };
/** store/repository读出的本地CAS版本，非owner revision。 */
type LocalVersion = number & { readonly localVersionBrand: true };
/** session切换即更新的内存标识，不包含token或身份正文。 */
type SessionEpoch = LocalId<"session_epoch">;
/** 绑定一次可见语境；所有异步回包必须与当前fence完全匹配。 */
interface ContextFence {
  /** 可信SDK session binding提供的本地epoch。 */ readonly sessionEpoch: SessionEpoch;
  /** Chat路由generation；导航/撤销递增。 */ readonly generation: number;
  /** 正式scope句柄，不能解析其字符串。 */ readonly scopeRef: ExternalHandle<"scope">;
  /** 正式actor安全关联；切换actor不能沿用旧fence。 */ readonly actorRef: ExternalHandle<"actor">;
  /** 对话语境可缺失：项目/目录入口不得伪造Conversation context。 */ readonly contextRef: ExternalHandle<"context"> | null;
}
/** 独立local错误，不包含正文、堆栈或secret。 */
interface ChatError {
  readonly code: ChatErrorCode;
  readonly retry: "never" | "read_only" | "explicit_after_probe";
}
/** typed成功/失败；失败无部分未审查owner正文。 */
type Outcome<T> = { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: ChatError };
```

| 字段/类型 | 来源/校验 | 缺失处理 |
|---|---|---|
| LocalId | LocalIdentityPort生成；非空，种类不可cast互换 | invalid_input |
| LocalVersion | store/repository get返回，非负safe integer | local_conflict |
| sessionEpoch | composition可信session binding；切换即换新 | authority_missing |
| generation | navigation/store递增safe integer；异步只等值比较 | context_changed |
| actorRef/scopeRef/contextRef | SDK正式入口映射；actor/scope必填；对话入口context必填，项目/目录不伪造context | authority_missing |

工厂：`createLocalId<K extends string>(kind: K, value: string): Outcome<LocalId<K>>`只校验，ID生成由port；`sameFence(a: ContextFence, b: ContextFence): boolean`对所有字段等值，不解析owner句柄。generation不是跨端revision。

### 2.2 `ExternalHandle`、`QualifiedMaterial`、`QualifiedSession`

定义位置：sdk/sdk_capability_binding.ts；其他模块type-only引用。它们是Chat adapter内部能力句柄，**不是拟定SDK DTO或wire格式**。符号brand与registry由adapter持有，外部不能从JSON/fake字符串构造；正式export缺失时构造路径blocked。句柄只驻内存，禁止直接serialize。

```ts
/** 指向SDK正式值的内存句柄，Chat不读取或发明owner schema。 */
interface ExternalHandle<K extends string> {
  readonly kind: K;
  readonly token: symbol;
}
/** adapter证明session语境可用；不携带credential。 */
interface QualifiedSession {
  readonly sessionEpoch: SessionEpoch;
  readonly actorRef: ExternalHandle<"actor">;
  readonly authorityRef: ExternalHandle<"session_authority">;
}
/** SDK资格检查已通过的Chat投影，非wire response。 */
interface QualifiedMaterial<T> {
  readonly fence: ContextFence;
  /** 已建立入口后的项目/节点/目录/变化读取必填；纯local映射可null，入口另用QualifiedEntryResolution。 */
  readonly consumptionContext: ClientConsumptionContext | null;
  readonly authorityRef: ExternalHandle<"source_authority">;
  readonly projection: T;
  readonly fake: boolean;
}
```

| 对象能力 | 字段 | 构造来源/函数 | 限制 |
|---|---|---|---|
| 正式类型隔离 | kind/token | SdkCapabilityBinding.qualifyHandle<K>(binding: BoundCapability, formalValue: SdkOpaqueValue<K>) | SdkOpaqueValue只是编译绑定参数位，未确认正式类型不能实现此签名 |
| session校验 | actor/authority/epoch | binding.qualifySession(bound SDK session) | 不解析认证，不生成actor |
| qualified projection | fence/authority/projection/fake | adapter完成exact mapping后factory | fake=true不能进入真实confirmed或production资格 |

以上factory的外部参数位属于blocked binding，**无可执行默认成功实现**。Chat-local fake fixture可构造独立标记句柄，必须fake且业务结果gate拒绝确认真实attempt。session的权威由SDK正式能力提供，不由host制造。

`ExternalHandle` 的结构类型和 `fake=false` 都不是安全证明。正式adapter必须在私有registry核对token登记、operation、sessionEpoch、actor、scope、source、visibility和失效状态；组件传入的结构相同对象、未知token、已撤销token一律拒绝。`sameFence` 使用registry的正式等值关系，不依赖包装对象的JS引用相等。registry对同一正式值/session/source提供canonical内存句柄，供Map/Set键使用；同字段的不同包裹对象不能跳过去重或目标检查。registry失效先于投影/持久化清理；上述机制是planned资格要求，当前SDK未绑定，不能声明已经提供证明。

### 2.3 `ChatErrorCode`

定义于navigation/route_context.ts。每个variant均为设计错误code，Step12会承接完整恢复映射；本轮flow/matrix可引用下列稳定集合。

| variant | JSDoc语义 | 允许来源 | 处理方向 |
|---|---|---|---|
| invalid_input | 本地结构/上限不满足 | parser/factory | reject，无IO |
| dependency_unbound | exact SDK/host/storage能力未绑定 | binding/port | blocked，无fallback |
| dependency_unavailable | 已正式绑定的SDK只读依赖暂不可用 | query/probe/resume adapter | 当前请求unavailable/partial；只读重取，不推owner missing |
| authority_missing | 缺正式actor/source/visibility/result资格 | guards | fail-closed |
| access_denied | 正式读取或当前intent能力拒绝 | entry/capability | restricted/hidden，无提交 |
| context_changed | session/scope/generation晚到 | coordinator/store | discard；command副作用另保unknown |
| local_conflict | 本地CAS version过期 | store/repository | read路径重取，command不重新dispatch |
| invalid_transition | from/to或条件字段不合法 | pure state methods | 保持原值，无副作用 |
| unsafe_material | 材料超出safe allowlist | composer/guard | 不展示/不持有 |
| unsupported_material | 未知category/schema版本 | adapter/renderer | 安全fallback，不猜字段 |
| continuity_gap | SDK明确gap或缺恢复资格 | reducer | gap/requery |
| effect_unknown | 已dispatch但不能确定owner副作用 | command adapter | unknown，只probe |
| storage_unavailable | repository读写/删除未完成 | repository | memory/blocked；删除不能cleared |
| platform_unavailable | 宿主能力不满足 | platform | 等价安全路径/needs_action |
| aborted_read | 只读请求取消 | query | 无写；不是owner取消 |

```ts
/** 以上有限variant的唯一代码集合；无自由文本error消息。 */
type ChatErrorCode = "invalid_input" | "dependency_unbound" | "dependency_unavailable" | "authority_missing"
  | "access_denied" | "context_changed" | "local_conflict" | "invalid_transition"
  | "unsafe_material" | "unsupported_material" | "continuity_gap" | "effect_unknown"
  | "storage_unavailable" | "platform_unavailable" | "aborted_read";
```

### 2.4 共用local分类与原因

定义位置：navigation/route_context.ts；finite variants均无owner truth。下表每项语义列同时为声明时每branch必备JSDoc，不能实现时删掉注释。

| 类型/schema | variant及语义 | 来源/去向 |
|---|---|---|
| PlatformKind | desktop：V1宿主；web_preview：开发预览；mobile_reserved：未来不启用 | config；mobile_reserved拒装配 |
| RouteKind | entry：对话入口；conversation：group/channel/dm；thread：有parent关系；project_list：项目列表；project_detail：项目详情；company_directory：公司目录；recovery：恢复面 | page registry；进度仅project_detail的标签 |
| ClearReason | logout：session结束；revoked：正式撤销；expired：到期；scope_changed：局部语境切换；user_discard：用户丢弃；confirmed_revision：对应草稿版本确认 | local清理；confirmed_revision不泛清新稿 |
| RecoveryReason | reconnect、restart、gap、expired、revoked | 生命周期或qualified change；不能从arrival time推断 |
| RecoveryNextAction | resume、requery、wait、clear、needs_action、probe | SDK能力+local姿态决定；无automatic_resend |
| SafeReasonCode | unavailable、restricted、source_unknown、stale、expired、unsupported、waiting、conflict | safe UI/AT；无raw error/body |

`ReturnContext = { routeKind: RouteKind; entryRef: ExternalHandle<"entry"> | null; projectRef: OwnerReference | null; activeTab: ProjectDetailTab | null; scrollAnchor: ExternalHandle<"turn"> | null }`只内存候选，目标必须符合route kind；返回需独立重新验证，不恢复绑定或权限。
`DeepLinkProvenance = { source: "internal" | "external" | "restore"; validated: boolean }`validated只表示路由结构检查，不能授权。
`FocusTarget = { region: "navigation" | "timeline" | "composer" | "details" | "recovery" | "project" | "process" | "directory"; localKey: LocalId<"focus"> }`由page registry分配，不含隐藏标题正文。图、等价列表和节点详情共享安全节点及焦点映射。
`ExpandedRegionSet = ReadonlySet<"thread" | "gate" | "artifact" | "member" | "project" | "runtime" | "workspace">`只local布局。

上述finite分类不独立进入状态机；无持续生命周期。可跨模块type-only引用，不新增shared目录。

## 3. materials模块：功能抽象与对象契约

| capability | 输入→输出 | 对象类别/对象 | 字段/函数/状态映射 | 后续 |
|---|---|---|---|---|
| 安全引用 | qualified owner引用→local ref | value：OwnerReference | owner/handle；fromQualified/redact；无owner状态 | reference port |
| 来源追溯 | qualified source→provenance | value：ProvenanceMetadata | source/scope/revision/visibility；fromSource；不推断scope | read adapter |
| 水位解释 | formal marker→freshness | marker：FreshnessMarker | state/revision；fromRevision/markStale；fresh等五态 | reducer/resume |
| 材料持有/显示 | qualified projection→snapshot | projection：SafeMaterialSnapshot | content/disclosure/freshness；fromQualified/restrict/clear | store/preview |
| preview入口 | authorized descriptor→reference | value：PreviewReference | target/capability/expiry；isOpenable | SDK reference |
| 纯显示组合 | snapshot→safe tokens | policies：composer/mapper/interpreter/boundary | 不持状态；compose/map/interpret/evaluate | page assembly |

### 3.1 `OwnerReference`

```ts
/** 非拥有式owner引用；句柄不代表可见性或业务状态。 */
interface OwnerReference {
  /** 正式来源owner，非Chat猜测。 */ readonly owner: OwnerKind;
  /** qualified SDK引用句柄。 */ readonly handle: ExternalHandle<"owner_ref">;
  /** 该引用的正式可见性资格，缺失不能展示。 */ readonly visibilityRef: ExternalHandle<"visibility">;
}
/** owner分域，避免成员身份/项目成员/runtime混同。 */
type OwnerKind = "conversation" | "identity" | "work" | "governance"
  | "artifact" | "workspace" | "member" | "runtime" | "process";
```

| 字段 | 类型 | 约束/来源 |
|---|---|---|
| owner | OwnerKind | SDK绑定记录的正式owner；每variant对应同名truth owner，非状态、来源/去向不适用 |
| handle | ExternalHandle<"owner_ref"> | adapter registry；不得字符串拼接route或解析scope |
| visibilityRef | ExternalHandle<"visibility"> | 与owner/scope匹配的正式读取资格 |

工厂：`OwnerReferenceFactory.fromQualified(input: QualifiedMaterial<OwnerReference>): Outcome<OwnerReference>`验证brand/fake/owner一致；`redact(ref: OwnerReference, disclosure: DisclosurePosture): OwnerReference | null`在cleared/unavailable时返回null，不能保留隐藏引用。无IO、不生成owner id。

Process variant只指L1-process正式truth；关联和目录的正式provider/owner仍未确认，不能临时增加一个Chat owner或将其强制映射Identity。提供方无法映射当前正式OwnerKind时禁止构造OwnerReference并返回dependency_unbound；CHAT-UP-009继续blocked，后续正式owner确认后再收敛类型。

### 3.2 `ProvenanceMetadata`

```ts
/** 每份显示材料的来源证明；不含source body或secret。 */
interface ProvenanceMetadata {
  readonly ownerRef: OwnerReference;
  readonly sourceRef: ExternalHandle<"source">;
  readonly scopeRef: ExternalHandle<"scope">;
  readonly revisionRef: ExternalHandle<"revision"> | null;
  readonly visibilityRef: ExternalHandle<"visibility">;
  readonly fake: boolean;
}
```

| 字段组 | 来源/约束 | factory/函数 |
|---|---|---|
| ownerRef/sourceRef | qualified SDK projection；同owner，不从Turn分类猜 | `ProvenanceMapper.fromSource(input: QualifiedMaterial<ProvenanceMetadata>): Outcome<ProvenanceMetadata>` |
| scopeRef/visibilityRef | qualified fence/visibility；必须SDK证明关系 | `matches(provenance: ProvenanceMetadata, fence: ContextFence): boolean`只查registry等值 |
| revisionRef | formal revision，缺失只允许unknown/partial | 不从timestamp/draft revision派生 |
| fake | adapter真实来源标记，不可关闭 | fake不能参与真实result authority |

无独立生命周期；不clone owner schema。丢失来源返回authority_missing。

### 3.3 `FreshnessMarker`

```ts
/** 已知来源水位的客户端解释；不能证明业务提交。 */
interface FreshnessMarker {
  /** formal解释结果，不是本地TTL即fresh。 */ readonly state: FreshnessState;
  /** 来源revision可缺失，此时不能fresh。 */ readonly revisionRef: ExternalHandle<"revision"> | null;
  /** 正式coverage/缺口资格；不暴露bus offset。 */ readonly coverageRef: ExternalHandle<"coverage"> | null;
  /** 本地安全解释code。 */ readonly reason: SafeReasonCode | null;
}
/** 新鲜度轴，与access/command/continuity分离。 */
type FreshnessState =
  /** 来源水位与coverage均获正式证明。 */ "fresh"
  /** 已知可能落后，仍按披露规则有限展示。 */ | "stale"
  /** 正式材料只覆盖部分范围。 */ | "partial"
  /** 来源水位未知。 */ | "unknown"
  /** 安全使用期限已失效。 */ | "expired";
```

| variant | 来源→允许去向 | 注释语义 |
|---|---|---|
| fresh | qualified query/resume→stale/partial/unknown/expired | known coverage，不是confirmed |
| stale | gap/revision/restart→fresh/partial/unknown/expired | 必须formal refresh才fresh |
| partial | SDK partial coverage→fresh/stale/unknown/expired | 不当完整timeline |
| unknown | 初始/资格缺失→fresh/partial/stale/expired | 不能以cache命中升级 |
| expired | 正式expiry或local更严安全期限→经新query替换为fresh/partial/unknown | 原材料不能复活 |

`FreshnessInterpreter.fromRevision(input: QualifiedMaterial<FreshnessMarker>): Outcome<FreshnessMarker>`校验fresh条件；`markStale(marker: FreshnessMarker, reason: SafeReasonCode): FreshnessMarker`纯收紧；`expire(marker: FreshnessMarker): FreshnessMarker`清掉coverage；`isDisplayable(marker: FreshnessMarker, access: AccessPosture): boolean`要求access可读且非expired，unknown不显示未经资格文本。字段由qualified读取或收紧函数提供。

### 3.4 `SafeMaterialSnapshot`与`SafeDisplayContent`

```ts
/** 内存中的最小owner-safe显示投影，不保存raw正文。 */
interface SafeMaterialSnapshot {
  readonly materialId: LocalId<"material">;
  readonly ownerRef: OwnerReference | null;
  readonly provenance: ProvenanceMetadata | null;
  readonly freshness: FreshnessMarker;
  readonly disclosure: DisclosurePosture;
  readonly content: SafeDisplayContent | null;
}
/** 披露只能由正式材料授予，本地可进一步收紧。 */
type DisclosurePosture =
  /** 获准的safe projection可展示。 */ "visible"
  /** 只展示adapter已经脱敏的投影。 */ | "redacted"
  /** 仅保留不泄露subject的受限状态。 */ | "restricted"
  /** 当前无安全材料。 */ | "unavailable"
  /** 已移除所有正文与引用。 */ | "cleared";
/** 安全显示token；不会提供任意HTML/脚本/路径/URL。 */
interface SafeDisplayContent {
  /** 限长纯文本token，不是raw owner body。 */ readonly textTokens: readonly string[];
  /** 正式受控引用，按钮交回callback。 */ readonly references: readonly OwnerReference[];
  /** safe summary标签，保留owner分域。 */ readonly labels: readonly { readonly code: SafeReasonCode; readonly text: string }[];
}
```

| 字段 | 来源/校验 | 缺失处理 |
|---|---|---|
| materialId | LocalIdentityPort | invalid_input |
| ownerRef/provenance | qualified SDK-safe投影；visible/redacted必填且同fence | authority_missing |
| freshness | formal marker；本地恢复强制stale/unknown | 不允许默认为fresh |
| disclosure | formal visibility mapping；local只收紧 | 缺失restricted |
| content | SDK允许的最小显示投影，长度/token/ref allowlist；不含HTML/raw payload | unsafe_material；restricted/unavailable/cleared必须null |

| 完整签名 | 返回/副作用 | 不变量 |
|---|---|---|
| `SafeMaterialFactory.fromQualified(id: LocalId<"material">, input: QualifiedMaterial<SafeMaterialSnapshot>): Outcome<SafeMaterialSnapshot>` | 新immutable snapshot，无IO | ID由local提供，来源/fake保留，不copy input raw body |
| `restrict(snapshot: SafeMaterialSnapshot, posture: DisclosurePosture): Outcome<SafeMaterialSnapshot>` | 收紧；restricted/unavailable清content和敏感ref | 不允许local visible升级；redacted需要已经redacted的safe内容 |
| `clear(snapshot: SafeMaterialSnapshot, reason: ClearReason): SafeMaterialSnapshot` | cleared；owner/provenance/content=null | 保留local id与非敏感reason，不能继续渲染 |
| `markFreshness(snapshot: SafeMaterialSnapshot, marker: FreshnessMarker): Outcome<SafeMaterialSnapshot>` | 新snapshot | fresh只能qualified marker；expired同时清content |

| Disclosure variant | 来源/去向 | JSDoc含义 |
|---|---|---|
| visible | qualified允许→redacted/restricted/unavailable/cleared | safe projection可见 |
| redacted | qualified脱敏→restricted/unavailable/cleared；新formal query可替换 | 不能本地去脱敏 |
| restricted | access收紧→cleared/unavailable；新formal query可替换 | 无subject/body泄露 |
| unavailable | 无材料→新qualified替换/cleared | 不等于owner不存在 |
| cleared | 清理→仅新generation新材料 | 原snapshot终止 |

### 3.5 `PreviewReference`

```ts
/** 正式preview能力引用；客户端不保存Artifact正文或拼URL。 */
interface PreviewReference {
  readonly artifactRef: OwnerReference;
  readonly previewHandle: ExternalHandle<"preview">;
  readonly capabilityRef: ExternalHandle<"preview_capability">;
  readonly provenance: ProvenanceMetadata;
  readonly freshness: FreshnessMarker;
  readonly openMode: "safe_inline" | "controlled_external";
}
```

字段均来自Artifact/SDK正式preview结果；artifactRef.owner必须artifact；openMode是Chat安全显示方式：safe_inline只允许structured safe tokens，controlled_external只交受控host capability且不暴露raw URL；两variant非状态，来源为正式descriptor，去向不适用。

工厂`PreviewBoundary.fromQualified(input: QualifiedMaterial<PreviewReference>): Outcome<PreviewReference>`；`isOpenable(preview: PreviewReference, access: AccessPosture, platform: PlatformCapabilityState): boolean`要求same fence、正式capability、新鲜/可解释、不expired、host受控能力；无IO。preview token不可持久化或诊断。

### 3.6 材料策略对象

下列四个policy各自独立契约，无额外可写状态。

#### 3.6.1 `SafeMaterialComposer`

| 对象/定义文件 | 字段/工厂 | 完整方法 | 输入来源/输出/副作用 |
|---|---|---|---|
| SafeMaterialComposer/safe_material_composer.ts | 无字段；`create(): SafeMaterialComposer` | `compose(input: QualifiedMaterial<SafeMaterialSnapshot>, access: AccessPosture): Outcome<SafeMaterialSnapshot>` | validate provenance+disclosure+content；纯裁剪 |

#### 3.6.2 `ProvenanceMapper`

| 对象/定义文件 | 字段/工厂 | 完整方法 | 输入来源/输出/副作用 |
|---|---|---|---|
| ProvenanceMapper/provenance_mapper.ts | 无字段；`create(): ProvenanceMapper` | `fromSource(input: QualifiedMaterial<ProvenanceMetadata>): Outcome<ProvenanceMetadata>`；`matches(provenance: ProvenanceMetadata, fence: ContextFence): boolean` | 只formal mapping与registry等值 |

#### 3.6.3 `FreshnessInterpreter`

| 对象/定义文件 | 字段/工厂 | 完整方法 | 输入来源/输出/副作用 |
|---|---|---|---|
| FreshnessInterpreter/freshness_interpreter.ts | 无字段；`create(): FreshnessInterpreter` | §3.3全部签名 | 不按时间排序，不cache=fresh |

#### 3.6.4 `PreviewBoundary`

| 对象/定义文件 | 字段/工厂 | 完整方法 | 输入来源/输出/副作用 |
|---|---|---|---|
| PreviewBoundary/preview_boundary.ts | 无字段；`create(): PreviewBoundary` | §3.5全部签名 | 无业务IO，无URL拼接 |

模块停审：capability均有对象；所有字段有qualified/local来源；各对象不持owner生命周期；safe文本仅内存显示且默认不durable，用户draft文本是另一主语；pass_with_upstream_blockers（CHAT-UP-004～006）。

## 4. navigation模块：功能抽象与对象契约

| capability | 对象/类别 | 能力→字段/函数/状态 | 来源/后续 |
|---|---|---|---|
| 入口/返回/scope切换 | RouteContext/context | routeKind/entry/scope/generation；factories/apply/change/clear；RoutePhase | SDK入口、local registry；EntryAccessPort |
| 读/操作姿态 | AccessPosture/projection | availability/visibility/capability/fence；fromQualified/restrict | formal result；guard |
| fail-closed | VisibilityGuard、ScopeEntryGuard/policy | evaluateEntry/evaluateMaterial/evaluateIntent；无内部truth | SDK资格输入；intent flow |
| 导航IO编排 | RouteContextCoordinator/service | store/access port/identity；enter/back/changeScope | port注入，不importSDK实现 |

### 4.1 `RouteContext`

```ts
/** 客户端导航语境；resolved不表示业务授权或材料fresh。 */
interface RouteContext {
  readonly routeId: LocalId<"route">;
  readonly platformKind: PlatformKind;
  readonly routeKind: RouteKind;
  readonly scopeRef: ExternalHandle<"scope"> | null;
  readonly entryRef: ExternalHandle<"entry"> | null;
  /** 正式项目/目录目标候选，不伪造Conversation入口。 */
  readonly targetReference: OwnerReference | null;
  readonly contextRef: ExternalHandle<"context"> | null;
  readonly returnContext: ReturnContext | null;
  readonly deepLinkProvenance: DeepLinkProvenance;
  readonly phase: RoutePhase;
  readonly generation: number;
}
/** 局部路由验证生命周期。 */
type RoutePhase =
  /** 新入口尚未经SDK语境验证。 */ "unresolved"
  /** 已有正式入口语境，仍单独检查材料/intent。 */ | "resolved"
  /** 正式入口只允许受限显示。 */ | "restricted"
  /** 上次语境失效，必须重新查询。 */ | "expired"
  /** logout/revoke已移除旧引用。 */ | "cleared";
```

| 字段组 | 来源/约束 |
|---|---|
| routeId/platform/routeKind | identity/config/page registry；mobile_reserved拒绝 |
| entryRef | qualified internal entry或外部deep-link由SDK resolver返回；raw link不进入对象 |
| targetReference | SDK正式项目/目录目标候选；独立access，撤销清null |
| scopeRef/contextRef | EntryAccessResult qualified；resolved必有scope，仅conversation/thread必有context；无scope反推 |
| returnContext | 当前安全route导出的local候选；返回重新resolve |
| deepLinkProvenance | local parser source与结构验证结果，不是owner authority |
| phase/generation | factory unresolved；store route替换递增generation，safe integer |

| 完整签名 | 参数/返回/副作用 |
|---|---|
| `RouteContextFactory.fromEntry(id: LocalId<"route">, entry: ExternalHandle<"entry">, platform: PlatformKind, kind: RouteKind, generation: number, provenance: DeepLinkProvenance): Outcome<RouteContext>` | scope/context=null，unresolved；无IO |
| `fromTarget(id: LocalId<"route">, target: OwnerReference \| null, platform: PlatformKind, kind: RouteKind, generation: number, provenance: DeepLinkProvenance): Outcome<RouteContext>` | project_list/project_detail/company_directory；entry/context=null，unresolved；project_detail必填Work项目，列表由正式scope/provider入口验证 |
| `fromRestore(id: LocalId<"route">, hint: RestorationHint, platform: PlatformKind, generation: number): Outcome<RouteContext>` | expired，hint仅恢复候选，所有owner ref需重新resolve |
| `applyEntryResult(route: RouteContext, result: QualifiedEntryResolution): Outcome<RouteContext>` | matched actor/session/generation后写正式scope/context；仅conversation/thread要求context；hidden清引用 |
| `changeScope(route: RouteContext, scope: ExternalHandle<"scope">, generation: number): Outcome<RouteContext>` | unresolved，清context/return候选；传入新generation |
| `markExpired(route: RouteContext, reason: SafeReasonCode): RouteContext` | expired，禁止旧结果提交 |
| `clearForLogout(route: RouteContext, reason: ClearReason, generation: number): RouteContext` | cleared，entry/target/scope/context/return=null；先fence失效 |

variant表：unresolved来自entry/target factory→resolved/restricted/expired/cleared；resolved来自qualified entry→unresolved/restricted/expired/cleared；restricted来自formal收紧→新entry unresolved或cleared；expired来自expiry/restore→unresolved/cleared；cleared旧generation终止，新route另建。每variant语义见声明注释，Step10矩阵不允许cleared复活。

### 4.2 `AccessPosture`

```ts
/** 当前语境的客户端读/操作姿态；授予只能来自正式SDK结果。 */
interface AccessPosture {
  readonly availability: AccessAvailability;
  readonly fence: ContextFence | null;
  readonly visibilityRef: ExternalHandle<"visibility"> | null;
  readonly capabilityRefs: readonly ExternalHandle<"intent_capability">[];
  readonly reason: SafeReasonCode | null;
}
/** 正式02的访问轴。 */
type AccessAvailability =
  /** 正式可读且可展示当前能力，command仍再次校验。 */ "available"
  /** 只读，所有command按钮禁用。 */ | "read_only"
  /** 仅安全受限状态，不填缓存正文。 */ | "restricted"
  /** 当前依赖/能力不可用。 */ | "unavailable"
  /** 缺安全合同，阻止继续。 */ | "blocked"
  /** 正式要求隐藏subject及其材料。 */ | "hidden";
```

fence/visibility来自qualified entry，available/read_only必填；capabilityRefs只来自SDK，不从member角色推断；hidden清所有refs/fence；reason为safe有限code。
`AccessPostureFactory.fromQualified(input: QualifiedMaterial<AccessPosture>): Outcome<AccessPosture>`；`blocked(reason: SafeReasonCode): AccessPosture`无refs；`markUnavailable(access: AccessPosture, reason: SafeReasonCode): AccessPosture`仅当前技术依赖收紧，capabilityRefs清，refs无当前资格则移除，不生成visibility；hidden不得转unavailable；`applyVisibility(access: AccessPosture, change: VisibilityChangeView): Outcome<AccessPosture>`仅正式同session/scope/source的收紧，read_only清capabilityRefs，restricted/blocked/hidden清subject refs，不能升级；`restrict(access: AccessPosture, next: "restricted" | "blocked" | "hidden", reason: SafeReasonCode): AccessPosture`只收紧。variant来源/去向：available/read_only由正式结果产生，可收紧至其余；restricted/unavailable/blocked仅新qualified读取可恢复；hidden仅新generation重验可进入，其旧材料终止。

### 4.3 `VisibilityGuard`与`ScopeEntryGuard`

`GuardDecision = { allowed: boolean; safePosture: AccessAvailability; reason: SafeReasonCode | null }`是只读policy result，无独立状态，allowed=true只表示本次local入口资格，不替代owner验证。

#### 4.3.1 `VisibilityGuard`

| 对象 | 字段/工厂 | 完整成员签名 | 不变量/失败 |
|---|---|---|---|
| VisibilityGuard | 无字段；`create(): VisibilityGuard` | `evaluateEntry(result: QualifiedEntryResolution): Outcome<GuardDecision>`；`evaluateMaterial(material: SafeMaterialSnapshot, access: AccessPosture): GuardDecision`；`evaluateIntent(capability: IntentCapabilityView, access: AccessPosture): GuardDecision` | matched fence+formal visibility；fake与missing拒绝真实command |

#### 4.3.2 `ScopeEntryGuard`

| 对象 | 字段/工厂 | 完整成员签名 | 不变量/失败 |
|---|---|---|---|
| ScopeEntryGuard | 无字段；`create(): ScopeEntryGuard` | `evaluateSession(session: QualifiedSession, access: AccessPosture): GuardDecision`；`evaluateThread(parent: ExternalHandle<"context">, thread: QualifiedEntryResolution): Outcome<GuardDecision>` | thread-parent关系由SDK证明，不从ref解析；wrong session拒绝 |

### 4.4 `RouteContextCoordinator`

```ts
/** 导航编排；异步读取使用fence，所有写入由store CAS完成。 */
interface RouteContextCoordinator {
  readonly store: ClientStatePort;
  readonly entries: EntryAccessPort;
  readonly identity: LocalIdentityPort;
  readonly visibilityGuard: VisibilityGuard;
  readonly scopeGuard: ScopeEntryGuard;
  enter(input: EnterRouteInput, session: QualifiedSession): Promise<Outcome<RouteContext>>;
  back(session: QualifiedSession): Promise<Outcome<RouteContext>>;
  changeScope(scope: ExternalHandle<"scope">, session: QualifiedSession): Promise<Outcome<RouteContext>>;
  clear(reason: ClearReason): Outcome<void>;
}
```

依赖由composition注入，构造`create(deps: RouteCoordinatorDeps): RouteContextCoordinator`，Deps字段与上述五项一一对应。EnterRouteInput唯一定义在本Step §15，Step8引用，承接route kind、qualified entry或target候选、return context和deep-link provenance；项目/目录不能强制构造Conversation entry。enter先invalidate旧generation/遮蔽，再resolve，matched CAS写入；back重新resolve，不恢复缓存授权；clear只本地，side effect为store/repository清理协调，不执行owner命令。取消query=aborted_read，晚到=context_changed。

模块停审：四组能力均有对象；route/access状态分别独立；fence与session字段来源闭合，正式EntryAccessResult的Chat投影在Step8，exact SDK绑定Step7保持blocked；pass_with_upstream_blockers。

### 4.5 `ClientConsumptionContext`

定义：`src/navigation/client_consumption_context.ts`。承接02 §6.34；ContextFence隔离session/入口，本对象进一步隔离项目、目标、来源及请求代次。不是权限载体或业务版本。

```ts
/** 单个来源的局部消费语境，失效后不得应用任何旧结果。 */
interface ClientConsumptionContext {
  /** 当前SDK session及入口关联，cleared时null。 */ readonly fence: ContextFence | null;
  /** 当前正式actor关联，不能由UI填写。 */ readonly actorReference: ExternalHandle<"actor"> | null;
  /** 当前正式scope关联，不能从目标ref解析。 */ readonly scopeReference: ExternalHandle<"scope"> | null;
  /** 可选Work项目引用，不由群聊选择推定。 */ readonly projectReference: OwnerReference | null;
  /** 本次项目/阶段/节点/群聊/目录目标，cleared时null。 */ readonly targetReference: OwnerReference | null;
  /** 单一正式来源，不使用跨owner统一版本。 */ readonly sourceReference: ExternalHandle<"source"> | null;
  /** 对同一请求槽位单调递增的本地代次。 */ readonly requestGeneration: number;
  /** 本次正式访问结果关联，不随标签切换赋权。 */ readonly visibilityReference: ExternalHandle<"visibility"> | null;
  /** 局部消费生命周期。 */ readonly contextPosture: ConsumptionContextPosture;
}
/** 本地消费状态；active仍须通过正式access。 */
type ConsumptionContextPosture =
  /** 当前请求槽位可核对资格。 */ "active"
  /** 切换/撤销已阻止旧query/change应用。 */ | "invalidated"
  /** 引用已移除，旧实例终止。 */ | "cleared";
/** 仅局部取消原因，不能声明owner取消。 */
type ContextInvalidationReason =
  /** actor/session切换。 */ "session_changed"
  /** scope或项目切换。 */ | "scope_changed"
  /** 标签、节点、搜索条件或页请求改变。 */ | "target_changed"
  /** source或父拓扑版本变更。 */ | "source_changed"
  /** 正式撤销或访问收紧。 */ | "revoked";
```

| 字段 | 类型/约束与来源 |
|---|---|
| fence/actorReference/scopeReference | 声明中的类型；来自QualifiedSession及当前正式入口，必须与ContextFence相等 |
| projectReference/targetReference | OwnerReference可null；来自当前获准目标/正式关联；active目标必填，project仅项目语境必填 |
| sourceReference/visibilityReference | 声明中的opaque类型；正式SDK source/access；缺失不能active |
| requestGeneration | number；store请求槽位分配的非负safe integer，溢出阻止请求，不能复用旧代次 |
| contextPosture | ConsumptionContextPosture；工厂/纯迁移，cleared全部外部引用null |

| 工厂/成员完整签名 | 参数来源、结果和副作用 |
|---|---|
| `ConsumptionContextFactory.forRequest(route: RouteContext, session: QualifiedSession, project: OwnerReference \| null, target: OwnerReference, source: ExternalHandle<"source">, visibility: ExternalHandle<"visibility">, generation: number): Outcome<ClientConsumptionContext>` | 只接受当前resolved/可读入口和已qualify来源；无IO，缺合同dependency_unbound，错actor/scope/目标access_denied |
| `matches(current: ClientConsumptionContext, incoming: ClientConsumptionContext): boolean` | 两者active且全部fence/actor/scope/project/target/source/visibility/代次等值；不比较跨owner版本 |
| `isApplicable(context: ClientConsumptionContext, provenance: ProvenanceMetadata): boolean` | 核对当前source/scope/visibility及正式target资格；registry不匹配false |
| `invalidate(context: ClientConsumptionContext, reason: ContextInvalidationReason): ClientConsumptionContext` | active→invalidated；先在store失效，再取消query/feed；无owner取消声明 |
| `clear(context: ClientConsumptionContext): ClientConsumptionContext` | cleared并移除所有引用，保留本地代次；无业务IO |

| variant | 来源 | 允许去向/注释含义 |
|---|---|---|
| active | 正式访问与source通过后factory | invalidated/cleared；仅当前消费槽位 |
| invalidated | 切换/撤销/父拓扑改变 | cleared；旧实例不得恢复active |
| cleared | 引用清理 | 终止；新请求另建新代次 |
| session_changed/scope_changed/target_changed/source_changed/revoked | 对应本地切换或正式收紧原因 | 非状态，去向不适用；只触发失效 |

并发来源使用不同消费槽位；节点section、目录搜索及分页不能复用整个页面的单一代次。纯apply*成员中current参数由coordinator从root当前槽位读取，incoming consumptionContext必须与current相等；不同owner section还须SDK正式证明同项目/节点关联，不能直接与主页面source强行相等。query与change都核对当前槽位；revoke先失效并遮蔽，取消失败也不得应用迟到响应。消费context仅内存，不持久化credential/cursor/token；正向provider未确认时无法构造active。

navigation模块重审：项目/目录不再被要求私造Conversation context；RouteContext与消费context各有唯一责任；source/target/actor晚到隔离已明确，pass_with_upstream_blockers。测试切口：节点A→B晚到、source并发、目录搜索代次、撤销后回包，均planned。

## 5. collaboration模块：功能抽象与对象契约

| capability | 对象/类别 | 能力→字段/函数/状态 | 后续 |
|---|---|---|---|
| 选择/焦点/展开 | SelectionState/local state | context/turn/gate/artifact/focus；select/move/clear；SelectionPhase | local selector/AT |
| Turn分类显示 | TurnPresentationModel/projection | safe material/category/thread；fromSafeTurn/redact | SDK映射/renderer |
| timeline与page组合 | ConversationSurfaceViewModel、ConversationPageViewModel/views | access/freshness/page/selection；assembler | read port/React |
| 异步安全加载 | CollaborationSurfaceCoordinator/service | read/store/materials/assembler；loadEntry/loadSurface/loadTurnPage | queries |
| UI表达 | 页面/组件props/entries | models+typed callbacks；无client实例 | Step9/16 |

### 5.1 `SelectionState`

```ts
/** 本地选择，不产生已读、attention或owner状态。 */
interface SelectionState {
  readonly selectedContext: ExternalHandle<"context"> | null;
  readonly selectedTurn: ExternalHandle<"turn"> | null;
  readonly selectedGate: OwnerReference | null;
  readonly selectedArtifact: OwnerReference | null;
  readonly focusTarget: FocusTarget | null;
  readonly expandedRegions: ExpandedRegionSet;
  readonly phase: SelectionPhase;
}
/** 安全引用的局部选择生命周期。 */
type SelectionPhase =
  /** 未选择。 */ "empty"
  /** 当前fence内已选择。 */ | "selected"
  /** 来源变化后需验证。 */ | "stale"
  /** 旧语境选择已移除。 */ | "cleared";
```

context/turn/Gate/Artifact只来自当前qualified surface；focus由registry生成；expanded只local键。selectedContext=null时其他owner引用必须null。

| 完整签名 | 返回/条件/副作用 |
|---|---|
| `SelectionFactory.empty(): SelectionState` | 所有refs=null，regions empty，phase=empty |
| `fromRoute(route: RouteContext): SelectionState` | resolved候选仍stale，不能直接selected |
| `selectContext(state: SelectionState, context: ExternalHandle<"context">, access: AccessPosture): Outcome<SelectionState>` | matched可读fence→selected，清不兼容targets |
| `selectTurn(state: SelectionState, turn: ExternalHandle<"turn">, surface: ConversationSurfaceViewModel): Outcome<SelectionState>` | ref在当前safe surface且可见；不写read receipt |
| `moveFocus(state: SelectionState, target: FocusTarget): SelectionState` | 只focus字段，无owner IO |
| `setExpanded(state: SelectionState, regions: ExpandedRegionSet): SelectionState` | 去重有限region，无布局越界 |
| `markStale(state: SelectionState): SelectionState` | 保留可安全候选，phase stale |
| `clearForVisibilityChange(state: SelectionState, change: VisibilityChangeView): SelectionState` | cleared，所有refs/focus/regions清空 |

variant表：empty来自factory→selected/cleared；selected来自qualified选择→selected/stale/cleared；stale来自route候选/revision→qualified selected/cleared；cleared旧context终止，新context使用empty。注释语义见声明，无owner选择同步。

### 5.2 `TurnPresentationModel`

```ts
/** safe Turn显示投影；未知category不能读取猜测字段。 */
interface TurnPresentationModel {
  readonly turnRef: ExternalHandle<"turn">;
  readonly presentationKind: TurnPresentationKind;
  readonly safeMaterial: SafeMaterialSnapshot;
  readonly threadContext: ExternalHandle<"thread_context"> | null;
  readonly provenance: ProvenanceMetadata;
  readonly freshness: FreshnessMarker;
  readonly visibility: DisclosurePosture;
}
/** 本地renderer分类，不定义owner TurnKind。 */
type TurnPresentationKind =
  /** 获准的安全消息token。 */ "message"
  /** Governance safe GateCard与受控入口。 */ | "gate"
  /** Artifact安全引用/preview入口。 */ | "artifact"
  /** identity/member分域摘要。 */ | "member"
  /** Work owner项目进度摘要。 */ | "project"
  /** Runtime safe状态摘要。 */ | "runtime"
  /** SDK明确的系统安全提示。 */ | "system"
  /** 未映射正式类型，仅安全占位。 */ | "unsupported";
```

| 字段组 | 来源/约束 |
|---|---|
| turnRef/threadContext | qualified TurnSafeProjection；thread关系SDK证明，无ref解析 |
| presentationKind | adapter formal render capability→local有限分类；未知unsupported，不按text猜 |
| safeMaterial/provenance | composer；同owner/source/fence；无raw Turn正文 |
| freshness/visibility | safeMaterial同字段的只读投影，不能独立修改为更宽松 |

`TurnPresentationFactory.fromSafeTurn(input: QualifiedMaterial<TurnSafeProjection>, composer: SafeMaterialComposer, id: LocalId<"material">): Outcome<TurnPresentationModel>`；`restricted(input: QualifiedMaterial<TurnSafeProjection>, id: LocalId<"material">, reason: SafeReasonCode): Outcome<TurnPresentationModel>`只保留正式获准ref及真实provenance，无content；缺ref披露资格不生成row，不能从裸turn造provenance；`applySafeMaterial(model: TurnPresentationModel, material: SafeMaterialSnapshot): Outcome<TurnPresentationModel>`same source；`markFreshness(model: TurnPresentationModel, marker: FreshnessMarker): Outcome<TurnPresentationModel>`同步snapshot；`redact(model: TurnPresentationModel, posture: DisclosurePosture): Outcome<TurnPresentationModel>`不升级；`toAccessibleView(model: TurnPresentationModel, state: AccessibilityState): SafeDisplayContent | null`无新body。

classification variant表：message/gate/artifact/member/project/runtime/system只来自SDK正式映射，目标为对应renderer；unsupported来自未知/缺render合同→安全fallback。分类无生命周期，不进入Step10。展示available/partial/stale等由freshness+disclosure派生，不新增重复state enum。

### 5.3 `ConversationSurfaceViewModel`

```ts
/** 单一timeline surface；不持Conversation truth或draft副本。 */
interface ConversationSurfaceViewModel {
  readonly contextRef: ExternalHandle<"context"> | null;
  readonly entryKind: "group" | "channel" | "dm" | "thread";
  readonly accessPosture: AccessPosture;
  readonly turns: readonly TurnPresentationModel[];
  readonly pageInfo: LocalPageInfo;
  readonly provenance: ProvenanceMetadata | null;
  readonly freshness: FreshnessMarker;
  readonly changeStatus: ContinuityState;
  readonly selection: SelectionState;
}
```

entryKind由SDK entry formal分类映射，group/channel/dm共享页，thread需要formal parent context；各variant非状态，去向为page registry。context/access/provenance来自matched qualified read；turns保持SDK正式排序，ref唯一；LocalPageInfo唯一定义来自本Step §15；change/selection从store同generation读取，不从response中猜。hidden/blocked→turns empty、provenance=null、no next cursor。empty visible只表示合法空页，不推断Conversation不存在。

`SurfaceFactory.fromRead(input: QualifiedMaterial<SurfaceReadProjection>, continuity: ContinuityState, selection: SelectionState): Outcome<ConversationSurfaceViewModel>`；`applyTurnPage(surface: ConversationSurfaceViewModel, page: QualifiedMaterial<TurnPageProjection>): Outcome<ConversationSurfaceViewModel>`same fence+page lineage，去重不自排cursor；`setSelection(surface: ConversationSurfaceViewModel, selection: SelectionState): Outcome<ConversationSurfaceViewModel>`；`restrict(surface: ConversationSurfaceViewModel, access: AccessPosture): ConversationSurfaceViewModel`清相关rows/refs；`markStale(surface: ConversationSurfaceViewModel): ConversationSurfaceViewModel`不修改owner状态。

### 5.4 页面组合与入口对象

#### 5.4.1 `ConversationPageViewModel`

```ts
/** 完整页面组合；surface是唯一Turn集合。 */
interface ConversationPageViewModel {
  readonly route: RouteContext;
  readonly surface: ConversationSurfaceViewModel | null;
  readonly draft: DraftState | null;
  readonly feedback: readonly IntentFeedbackViewModel[];
  readonly recovery: RecoveryViewModel;
  readonly accessibility: AccessibilityState;
  readonly panels: readonly SafeMaterialSnapshot[];
}
```

字段route/surface/draft/feedback/recovery/accessibility/panels类型见声明：来自同store版本；draft/feedback仅当前context，Surface是唯一Turn集合；recovery按当前source派生，不构造第二份状态。无owner truth或单独生命周期。

#### 5.4.2 `EntryViewModel`

```ts
/** 安全入口列表；不实现Workspace inbox/unread/pin truth。 */
interface EntryViewModel {
  readonly access: AccessPosture;
  readonly entries: readonly { readonly entryRef: ExternalHandle<"entry">;
    readonly kind: "group" | "channel" | "dm" | "thread";
    readonly safeLabel: string; readonly provenance: ProvenanceMetadata }[];
  readonly freshness: FreshnessMarker;
  readonly pageInfo: LocalPageInfo;
}
```

所有字段来自同store snapshot或SDK safe entry/page；draft/feedback只该context；panels按owner分别显示，Work/member/runtime/Workspace不汇总出统一进度。safeLabel限长纯文本，hidden entries不含label/ref。
#### 5.4.3 `PageViewModelAssembler`

`PageViewModelAssembler.create(): PageViewModelAssembler`无字段；`assemble(snapshot: ClientSnapshot): Outcome<ConversationPageViewModel>`；`assembleEntry(read: QualifiedMaterial<EntryReadProjection>): Outcome<EntryViewModel>`；纯函数、无SDK/storage IO、不保存第二份canonical draft。

### 5.5 `CollaborationSurfaceCoordinator`

字段：`reads: CollaborationReadPort`、`store: ClientStatePort`、`materials: SafeMaterialComposer`、`assembler: PageViewModelAssembler`，全部composition注入；factory `create(deps: CollaborationCoordinatorDeps)`四字段一一对应。

| 完整方法签名 | 条件/返回/副作用 |
|---|---|
| `loadEntry(input: EntryReadInput, session: QualifiedSession): Promise<Outcome<EntryViewModel>>` | access-first SDK read，无owner写入；local CAS显示 |
| `loadSurface(input: SurfaceReadInput, session: QualifiedSession): Promise<Outcome<ConversationPageViewModel>>` | 当前route matched；freshness/disclosure显化 |
| `loadTurnPage(input: TurnPageInput, session: QualifiedSession): Promise<Outcome<ConversationSurfaceViewModel>>` | nextCursor来自当前surface，不拼接；late回包丢弃 |
| `refreshVisible(fence: ContextFence, session: QualifiedSession): Promise<Outcome<ConversationPageViewModel>>` | 正式requery，不从cache恢复fresh |
| `select(selection: SelectionState, fence: ContextFence): Outcome<void>` | local CAS，no read receipt |

### 5.6 页面与组件props闭口

所有React entry都是`(props: Readonly<Props>): ReactElement | null`，无业务effect；mount订阅由app binding负责；callback返回Promise<Outcome<void>>或Outcome<void>，失败由feedback表示。以下props是每个Step4组件完整业务输入；DOM aria/id/class等视觉参数只由semantic adapter/样式提供，不能追加owner DTO。

| 页面/组件 | Props字段（类型） | callback/责任 |
|---|---|---|
| CollaborationEntryPage | model: EntryViewModel；onEnter: (entry: ExternalHandle<"entry">)→Promise<Outcome<void>> | group/channel/dm/thread入口 |
| ConversationPage | model: ConversationPageViewModel；actions: PageActions | 组合surface/composer/panels；不copy rows |
| ThreadPage | model: ConversationPageViewModel；parent: ExternalHandle<"context">；actions: PageActions | formal parent，onBack重验 |
| ConversationNavigation | model: EntryViewModel；onEnter同上 | 不本地制造unread/pin |
| TurnList | surface: ConversationSurfaceViewModel；onNext: ()→Promise<Outcome<void>>；onSelect: (turn: ExternalHandle<"turn">)→Outcome<void> | stable row key，仅safe refs |
| TurnRenderer | model: TurnPresentationModel；actions: TurnActions | exhaustive有限分类；unsupported fallback |
| GateCard | material: SafeMaterialSnapshot；capability: IntentCapabilityView；feedback: IntentFeedbackViewModel\|null；onIntent: (action: ExternalHandle<"governance_action">)→Promise<Outcome<void>> | capability非authority替代，点击pending而非approved |
| ArtifactReference | material: SafeMaterialSnapshot；onPreview: (artifact: OwnerReference)→Promise<Outcome<void>> | 不拼URL |
| ArtifactPreview | result: PreviewResultView；onClose: ()→Outcome<void>；onOpen: (preview: PreviewReference)→Promise<Outcome<void>> | only safe projection/controlled host |
| MemberStatusPanel | identity: SafeMaterialSnapshot\|null；member: SafeMaterialSnapshot\|null | 两owner分别表示 |
| ProjectProgressPanel | work: SafeMaterialSnapshot | 仅owner summary |
| RuntimeStatusPanel | runtime: SafeMaterialSnapshot | 不显示provider/tool raw payload |
| WorkspaceSummaryPanel | workspace: SafeMaterialSnapshot | 只formal view |
| MaterialStatus | provenance: ProvenanceMetadata\|null；freshness: FreshnessMarker；disclosure: DisclosurePosture | stale/partial/restricted明确 |

`PageActions = { onBack(): Promise<Outcome<void>>; onSubmit(): Promise<Outcome<void>>; onRecovery(action: RecoveryNextAction): Promise<Outcome<void>>; onSelect(turn: ExternalHandle<"turn">): Outcome<void>; onPreview(ref: OwnerReference): Promise<Outcome<void>>; onGovernance(action: ExternalHandle<"governance_action">): Promise<Outcome<void>> }`。
`TurnActions = Pick<PageActions, "onSelect" | "onPreview" | "onGovernance">`，不带raw SDK request。typed签名的ASCII `→`在表中表示TS箭头函数，实际声明采用`=>`。

模块停审：每个page/component有唯一安全输入与callback；Surface/Page两个模型职责不重叠；分类未知安全fallback；references/freshness与metadata一致；pass_with_upstream_blockers。

### 5.7 项目/流程/目录能力与局部辅助类型

| capability | 对象 | 字段/成员来源 | 允许边界 |
|---|---|---|---|
| 项目五标签及分来源section | ProjectDetailViewModel | Work项目/WorkItem安全材料、正式证据ref；applySection | 不计算项目完成度/验收 |
| 标签/阶段/节点/视口/返回 | ProjectNavigationState | 当前获准拓扑+local选择；selectTab/selectStage/selectNode | 无owner写入，不产生绑定 |
| 整体→阶段流程图/等价列表 | ProcessFlowViewModel | Process安全拓扑/分支/Gateway状态；applyTopology/applyState | 不执行BPMN，不从Runtime补图 |
| 节点详情/独立owner section | ProcessNodeDetailViewModel | 正式节点关联→各owner独立safe query | Gate、Work、Artifact、Runtime/诊断来源分开 |
| 项目↔群聊导航 | ProjectConversationLinkViewModel | 正式关系provider+目标独立access | 不继承群聊权限，不在Chat绑定 |
| 公司人员搜索/分页 | CompanyDirectoryViewModel | 正式provider覆盖/名单/页边界 | 不并集ProjectMember/Participant/Member |
| 三类异步读取编排 | ProjectContextCoordinator/ProcessDrilldownCoordinator/DirectoryCoordinator | ClientConsumptionContext槽位+store CAS+SDK adapter | exact ports在Step7未完成批次，当前不声明可调用 |

以下均为Chat-local安全显示类型，不是SDK DTO。代码中的每个字段注释也是成员变量的来源要求。概要02的snake_case字段在TS落地时按这里的lowerCamelCase映射，wire名称不随之更改。

```ts
/** 项目详情局部标签，进度不是顶层路由。 */
type ProjectDetailTab =
  /** Work安全概览。 */ "overview"
  /** Process只读整体/阶段流程。 */ | "progress"
  /** 正式关联群聊及独立入口。 */ | "conversations"
  /** Work工作项列表/安全详情。 */ | "work-items"
  /** 正式证据引用，不生成验收。 */ | "evidence";
/** 局部页面加载姿态，与业务结果无关。 */
type PageLoadPosture =
  /** 等待正式query。 */ "loading"
  /** 已有当前获准材料，不表示业务完成。 */ | "ready"
  /** section/coverage不完整。 */ | "partial"
  /** 来源或父版本待重验。 */ | "stale"
  /** 无正式合同/安全资格。 */ | "blocked"
  /** 正式依赖暂不可用。 */ | "unavailable";
/** 客户端图视口，不能持有业务坐标/流程关系。 */
interface LocalViewportState {
  /** local有限平移值，由renderer限制。 */ readonly offsetX: number;
  /** local有限平移值，由renderer限制。 */ readonly offsetY: number;
  /** local正有限缩放值，确值上限交04。 */ readonly zoom: number;
}
/** 目录局部查询，输入不是权限。 */
interface LocalDirectorySearchState {
  /** 用户搜索文本，限长，不写diagnostic/持久化。 */ readonly queryText: string;
  /** provider明确支持的过滤能力，缺能力只能all。 */ readonly kindFilter: "all" | "human" | "ai";
  /** 当前获准人员的局部选择，不证明DM能力。 */ readonly selectedPerson: OwnerReference | null;
}
/** 正式provider覆盖解释，不由人数/身份并集推断。 */
interface DirectoryCoverage {
  /** provider正式scope覆盖资格，可缺失。 */ readonly coverageRef: ExternalHandle<"coverage"> | null;
  /** 正式覆盖解释，unknown不能宣称全公司。 */ readonly scopeCoverage: "complete" | "partial" | "unknown";
  /** provider正式人类/AI覆盖声明。 */ readonly population: "human" | "ai" | "human_and_ai" | "unknown";
}
```

| 分类/状态族 | 每variant来源及去向 |
|---|---|
| ProjectDetailTab五variant | 用户本地选择；非生命周期，无owner状态迁移；缺能力仍进入blocked面 |
| PageLoadPosture六variant | 初始合同已绑定loading，未绑定blocked；qualified完整→ready、缺section→partial、版本变化→stale、依赖失效→unavailable、资格缺失→blocked；ready/partial可收紧stale/blocked/unavailable；新access/query后才loading/ready；撤销时清引用并blocked，无缓存升级 |
| kindFilter all/human/ai | 本地输入且provider支持；非状态，不扩张query scope |
| scopeCoverage complete/partial/unknown | SDK正式coverage/缺声明；非状态，禁止local升级 |
| population human/ai/human_and_ai/unknown | provider声明对应覆盖范围；非状态，Identity不是human_and_ai默认值 |

### 5.8 `ProjectNavigationState`

定义：`src/collaboration/project_navigation_state.ts`，纯local state。

```ts
/** 项目局部选择；所有候选都须在当前访问/拓扑中重新验证。 */
interface ProjectNavigationState {
  /** 当前正式Work项目候选；清理后null。 */ readonly projectReference: OwnerReference | null;
  /** 用户局部标签，初始overview。 */ readonly activeTab: ProjectDetailTab;
  /** 当前获准阶段，来自Process拓扑。 */ readonly stageReference: OwnerReference | null;
  /** 当前获准节点，来自当前父拓扑。 */ readonly nodeReference: OwnerReference | null;
  /** Process正式拓扑版本，非store version。 */ readonly topologyRevision: ExternalHandle<"revision"> | null;
  /** local显示值，不代表BPMN布局truth。 */ readonly viewport: LocalViewportState;
  /** 已裁剪返回候选，返回时再resolve。 */ readonly returnContext: ReturnContext | null;
  /** 复用SelectionPhase，不建立另一选择状态机。 */ readonly selectionPosture: SelectionPhase;
}
```

| 字段 | 类型/约束与来源 |
|---|---|
| projectReference/activeTab | 声明中的类型；route正式项目候选+local enum；null项目不得持stage/node |
| stageReference/nodeReference/topologyRevision | 声明中的类型；只来自当前获准Process拓扑，不按名称/ref推导归属 |
| viewport/returnContext | LocalViewportState/ReturnContext可null；local renderer和安全route候选；只有限值、无隐藏subject |
| selectionPosture | SelectionPhase；工厂stale或empty；qualified选择selected，版本变化stale，撤销cleared |

| 工厂/成员完整签名 | 条件、结果、副作用 |
|---|---|
| `ProjectNavigationFactory.fromRoute(route: RouteContext, project: OwnerReference \| null): Outcome<ProjectNavigationState>` | route kind兼容；项目须Work，候选stale，无项目empty；viewport初始(0,0,1)，overview，无IO |
| `selectTab(state: ProjectNavigationState, tab: ProjectDetailTab): ProjectNavigationState` | local标签，保留当前安全返回候选，不提交业务 |
| `selectStage(state: ProjectNavigationState, stage: OwnerReference, flow: ProcessFlowViewModel): Outcome<ProjectNavigationState>` | 同项目、stage存在于获准当前版本；selected，清node，错源context_changed/拒绝access_denied |
| `selectNode(state: ProjectNavigationState, node: OwnerReference, flow: ProcessFlowViewModel): Outcome<ProjectNavigationState>` | 获准当前节点+正式父级关系，记录同拓扑revision；不触发Tools/Runtime |
| `setViewport(state: ProjectNavigationState, viewport: LocalViewportState): Outcome<ProjectNavigationState>` | 验证finite/zoom正且配置范围，不扩权限 |
| `invalidate(state: ProjectNavigationState, change: VisibilityChangeView): ProjectNavigationState` | 撤销cleared并清全部refs/return；版本变化stale且清stage/node/旧viewport，再query |

状态采用§5.1 SelectionPhase同一语义：empty→selected需formal材料；stale→selected需新版本验证；cleared旧实例终止。选择不证明绑定、阶段运行或父关系。

### 5.9 `ProjectDetailViewModel`

定义：`src/collaboration/project_detail_view_model.ts`，02 §6.28的page projection。

```ts
/** 单项目五标签组合，section分别保留owner/source资格。 */
interface ProjectDetailViewModel {
  /** Work正式项目引用；blocked/撤销可null。 */ readonly projectReference: OwnerReference | null;
  /** Work主section消费语境，不替代其他source语境。 */ readonly consumptionContext: ClientConsumptionContext;
  /** local标签/下钻状态。 */ readonly navigation: ProjectNavigationState;
  /** Work正式安全摘要；未加载不填缓存正文。 */ readonly projectSummary: SafeMaterialSnapshot | null;
  /** Process正式流程，未加载null不等于不存在。 */ readonly flowView: ProcessFlowViewModel | null;
  /** 正式关联投影，未绑定provider时null/blocked。 */ readonly conversationLinks: ProjectConversationLinkViewModel | null;
  /** Work正式安全工作项，保持正式排序。 */ readonly workItems: readonly SafeMaterialSnapshot[];
  /** Artifact/正式Evidence关联ref，不生成验收。 */ readonly evidenceRefs: readonly OwnerReference[];
  /** 项目入口正式access，其他section独立检查。 */ readonly accessPosture: AccessPosture;
  /** 本地加载派生姿态，不是Project lifecycle。 */ readonly loadPosture: PageLoadPosture;
}
```

| 字段 | 类型/约束与来源 |
|---|---|
| projectReference/consumptionContext/accessPosture | 声明中的类型；qualified Work入口+对应消费槽位，project必须owner work；未验证不能展示 |
| navigation | ProjectNavigationState；同项目store读取，不由owner结果替换用户新标签 |
| projectSummary/workItems | 声明中的类型；Work安全read，分别source/visibility/coverage，不推完工百分比 |
| flowView/conversationLinks | 声明中的可null类型；各自正式query+独立消费context，不能借Work的fresh证明Process/关系fresh |
| evidenceRefs | readonly OwnerReference[]；正式关联+Artifact可见性，测试摘要不是验收 |
| loadPosture | PageLoadPosture；由当前获准section和缺口派生，ready不要求跨owner原子snapshot |

| 工厂/成员完整签名 | 条件、结果、副作用 |
|---|---|
| `ProjectDetailFactory.forProject(project: OwnerReference, context: ClientConsumptionContext, access: AccessPosture): Outcome<ProjectDetailViewModel>` | 资格通过且消费target同Work项目；无材料，loading；合同缺失返回dependency_unbound，由shell显示blocked |
| `applySection(view: ProjectDetailViewModel, section: QualifiedMaterial<SafeMaterialSnapshot>): Outcome<ProjectDetailViewModel>` | 单一Work主section；消费context/target/source匹配才应用，错context_changed，材料unsafe_material；无IO |
| `applyWorkItems(view: ProjectDetailViewModel, page: QualifiedMaterial<LocalPage<SafeMaterialSnapshot>>, current: ClientConsumptionContext): Outcome<ProjectDetailViewModel>` | 正式项目关系与当前Work页槽位匹配，完整/局部派生ready/partial；不local排序 |
| `applyFlow(view: ProjectDetailViewModel, flow: ProcessFlowViewModel): Outcome<ProjectDetailViewModel>` | 同项目、flow自身active context/独立access，不要求其source等于Work |
| `applyLinks(view: ProjectDetailViewModel, links: ProjectConversationLinkViewModel): Outcome<ProjectDetailViewModel>` | 正式anchor同项目且当前关系槽位匹配；链接不会赋予target访问 |
| `applyEvidence(view: ProjectDetailViewModel, refs: QualifiedMaterial<readonly OwnerReference[]>, current: ClientConsumptionContext): Outcome<ProjectDetailViewModel>` | 正式项目关系及每ref可见性，独立source槽位匹配，未知不生成ref |
| `setNavigation(view: ProjectDetailViewModel, navigation: ProjectNavigationState): Outcome<ProjectDetailViewModel>` | same project；只local标签/视口，无业务IO |
| `restrict(view: ProjectDetailViewModel, change: VisibilityChangeView): ProjectDetailViewModel` | 立即按正式影响范围清summary/flow/links/items/refs，project撤销清全部及返回context；blocked |

状态使用§5.7 PageLoadPosture迁移。只组织获准材料，不按Work/Runtime/日志推导Process进度；每个section保留自己的provenance/freshness/access。

### 5.10 `ProcessFlowViewModel`

定义：`src/collaboration/process_flow_view_model.ts`。辅助拓扑是SDK正式安全投影的Chat-local adapter目标，缺input合同时不能凭此类型实现正向mapper。

```ts
/** 图和等价列表共用的安全拓扑，不是客户端生成的BPMN XML。 */
interface SafeProcessTopologyView {
  /** SDK正式source/版本/访问资格。 */ readonly provenance: ProvenanceMetadata;
  /** provider明确披露的拓扑覆盖；不披露隐藏总数。 */ readonly coverage: "complete" | "partial" | "unknown";
  /** 仅包含正式获准节点和结构角色。 */ readonly nodes: readonly SafeProcessNode[];
  /** 仅包含两端均获准且关系获准的边。 */ readonly edges: readonly SafeProcessEdge[];
}
/** 一个获准节点；角色不是Chat推断的运行结果。 */
interface SafeProcessNode {
  /** 正式Process ref。 */ readonly reference: OwnerReference;
  /** SDK脱敏安全标题，限长纯文本。 */ readonly label: string;
  /** 正式类型映射，未知不猜gateway。 */ readonly role: "stage" | "activity" | "event" | "fork" | "join" | "gateway" | "unsupported";
  /** 正式允许的阶段下钻目标，可null。 */ readonly drilldownReference: OwnerReference | null;
}
/** SDK正式获准的连接，不含内部bus/token信息。 */
interface SafeProcessEdge {
  /** 正式边引用。 */ readonly reference: OwnerReference;
  /** 正式安全起点。 */ readonly from: OwnerReference;
  /** 正式安全终点。 */ readonly to: OwnerReference;
}
/** 整体/阶段只读流程，拓扑和状态分别保存source版本。 */
interface ProcessFlowViewModel {
  /** 当前Work项目；清理后null。 */ readonly projectReference: OwnerReference | null;
  /** 正式Process语境，不能从WorkItem推定。 */ readonly processReference: OwnerReference | null;
  /** 当前阶段可null，整体视图不伪造阶段。 */ readonly stageReference: OwnerReference | null;
  /** 本次Process消费槽位。 */ readonly consumptionContext: ClientConsumptionContext;
  /** 正式safe拓扑，未获得null。 */ readonly topologyMaterial: SafeProcessTopologyView | null;
  /** Process正式节点/分支/Gateway状态。 */ readonly stateMaterial: readonly SafeMaterialSnapshot[];
  /** 拓扑source版本，独立于state。 */ readonly topologyProvenance: ProvenanceMetadata | null;
  /** 状态source版本，不和Work/Runtime做全局比较。 */ readonly stateProvenance: ProvenanceMetadata | null;
  /** 正式关联Governance Gate，读取另验。 */ readonly governanceRefs: readonly OwnerReference[];
  /** 当前Process来源的新鲜度，不升级其他owner。 */ readonly freshness: FreshnessMarker;
  /** 当前流程正式可见边界。 */ readonly accessPosture: AccessPosture;
  /** 本地加载/版本缺口姿态。 */ readonly loadPosture: PageLoadPosture;
}
```

| 字段 | 类型/约束与来源 |
|---|---|
| projectReference/processReference/stageReference | 声明中的可nullOwnerReference；Work正式项目+Process正式归属；无正式关联不能同屏拼接 |
| consumptionContext/accessPosture | 对应类型；当前目标/source/visibility SDK qualification；stage下钻是新槽位 |
| topologyMaterial/topologyProvenance | 声明中的类型；Process正式safe拓扑+provenance，owner必须process；节点/边唯一，边两端均可见，非法或缺版本不进入ready |
| stateMaterial/stateProvenance | 对应类型；Process正式运行状态及适用拓扑关系；不兼容父版本清旧状态并partial/stale重查 |
| governanceRefs | readonly OwnerReference[]；正式节点关联、Governance access独立；不能将Gateway画成审批Gate |
| freshness/loadPosture | FreshnessMarker/PageLoadPosture；Process资格和当前coverage；topology/state各自marker仍保留在material中 |

| 工厂/成员完整签名 | 条件、结果、副作用 |
|---|---|
| `ProcessFlowFactory.forContext(project: OwnerReference, process: OwnerReference, stage: OwnerReference \| null, context: ClientConsumptionContext, access: AccessPosture): Outcome<ProcessFlowViewModel>` | Work/Process正式关系及当前context；初始loading/unknown，缺合同dependency_unbound，无IO |
| `applyTopology(view: ProcessFlowViewModel, topology: QualifiedMaterial<SafeProcessTopologyView>): Outcome<ProcessFlowViewModel>` | active槽位、正式source/visibility、revision；版本变化失效节点详情/selection旧代次；不得自动沿用旧state |
| `applyState(view: ProcessFlowViewModel, state: QualifiedMaterial<readonly SafeMaterialSnapshot[]>, current: ClientConsumptionContext): Outcome<ProcessFlowViewModel>` | SDK证明适用当前拓扑且各节点可见；不能证明则stale/partial、重查，无join推断 |
| `applyGovernanceRefs(view: ProcessFlowViewModel, refs: QualifiedMaterial<readonly OwnerReference[]>, current: ClientConsumptionContext): Outcome<ProcessFlowViewModel>` | 正式关联且独立access，未知合同拒绝，不从图形gateway生成Gate |
| `toEquivalentList(view: ProcessFlowViewModel, accessibility: AccessibilityState): Outcome<readonly SafeProcessNode[]>` | 只使用同safe topology和有限状态；隐藏边/标签/计数均不得出现，无IO |
| `restrict(view: ProcessFlowViewModel, change: VisibilityChangeView): ProcessFlowViewModel` | 立即清失效节点/边/状态/关联ref并重算安全列表，不能仅用CSS遮蔽；范围不可验证则清整个flow |

| helper variant | 正式来源/显示含义/去向 |
|---|---|
| role stage/activity/event | 正式阶段/活动/事件类型映射；非状态，对应viewer/list显示 |
| role fork/join/gateway | Process明确类型/语义映射；未知是否并行不猜；fork、branch、join分别显化，Governance独立 |
| role unsupported | 缺正式映射；安全占位、不生成执行能力 |
| coverage complete/partial/unknown | 正式safe scope覆盖解释；非状态，不用可见节点数推隐藏总数 |

PageLoadPosture沿§5.7迁移；图不执行/编辑/部署BPMN。优先成熟只读viewer；bpmn-js只有SDK明确提供授权正式BPMN输入且完成安全资格时才可绑定，当前具体viewer/library未选定。禁止从prototype坐标、WorkItem、Runtime日志拼XML；缺拓扑保留blocked/等价安全缺口面。

### 5.11 `ProcessNodeDetailViewModel`

定义：`src/collaboration/process_node_detail_view_model.ts`。

```ts
/** 当前拓扑节点的分owner详情，不构造执行/验收事实。 */
interface ProcessNodeDetailViewModel {
  /** 正式获准节点，撤销后null。 */ readonly nodeReference: OwnerReference | null;
  /** 节点选择消费槽位。 */ readonly consumptionContext: ClientConsumptionContext;
  /** 当前父拓扑正式版本，未加载/清理可null。 */ readonly topologyRevision: ExternalHandle<"revision"> | null;
  /** 正式节点关系，不按名称/commit文本匹配。 */ readonly associationRefs: readonly OwnerReference[];
  /** 分owner授权材料，保留各source/freshness。 */ readonly sections: readonly SafeMaterialSnapshot[];
  /** 节点access，不替代section访问。 */ readonly accessPosture: AccessPosture;
  /** section缺口导致partial，不解释为不存在。 */ readonly loadPosture: PageLoadPosture;
}
/** 已qualify的节点关联输入，不是SDK wire DTO。 */
interface SafeNodeAssociationView {
  /** 正式节点关系版本来源。 */ readonly provenance: ProvenanceMetadata;
  /** SDK证明的适用父拓扑版本。 */ readonly topologyRevision: ExternalHandle<"revision">;
  /** 正式允许披露的目标引用，目标access另验。 */ readonly references: readonly OwnerReference[];
}
```

| 字段 | 类型/约束与来源 |
|---|---|
| nodeReference/topologyRevision/consumptionContext | 声明中的类型；当前flow获准node+父revision+新消费槽位；无父版本不能ready |
| associationRefs | readonly OwnerReference[]；SafeNodeAssociationView正式关系，变更先失效旧section请求 |
| sections | readonly SafeMaterialSnapshot[]；各owner独立query/access/source；只允许已获准关联，不借Process权限 |
| accessPosture/loadPosture | 对应类型；节点access+section加载派生，未获访问不渲染旧内容 |

| 工厂/成员完整签名 | 条件、结果、副作用 |
|---|---|
| `NodeDetailFactory.forNode(node: OwnerReference, revision: ExternalHandle<"revision">, context: ClientConsumptionContext, access: AccessPosture): Outcome<ProcessNodeDetailViewModel>` | node在当前safe父拓扑，matched选择代次；初始loading/空关联/空section，无IO |
| `applyAssociations(view: ProcessNodeDetailViewModel, associations: QualifiedMaterial<SafeNodeAssociationView>): Outcome<ProcessNodeDetailViewModel>` | 同节点/父revision/当前source槽位；错context_changed，缺source authority_missing |
| `applySection(view: ProcessNodeDetailViewModel, section: QualifiedMaterial<SafeMaterialSnapshot>, current: ClientConsumptionContext): Outcome<ProcessNodeDetailViewModel>` | 当前节点仍有效、incoming与该section source槽位相等、关联及独立access获准；失败不覆盖其他section |
| `invalidateParent(view: ProcessNodeDetailViewModel, revision: ExternalHandle<"revision">): ProcessNodeDetailViewModel` | 父版本变化先context失效、清node/关联/section/旧revision，stale；新factory才恢复 |
| `restrict(view: ProcessNodeDetailViewModel, change: VisibilityChangeView): ProcessNodeDetailViewModel` | 立即裁剪正式影响范围；节点撤销清全部并blocked，无旧焦点/返回入口 |

状态复用PageLoadPosture；Agent执行统计、工具调用、commit/test只有formal safe summary/ref，不能产生acceptance/evidence/verdict，也不启动Tools或Runtime。

### 5.12 `ProjectConversationLinkViewModel`

定义：`src/collaboration/project_conversation_link_view_model.ts`。目标与访问合为row，修正02骨架并行数组可能错位的问题。

```ts
/** 正式关联输入，不定义谁拥有绑定truth。 */
interface SafeProjectConversationAssociationView {
  /** 正式关系provider/owner，未确认不能构造。 */ readonly provenance: ProvenanceMetadata;
  /** 正式获准关系目标，不泄露hidden目标数量。 */ readonly targets: readonly OwnerReference[];
}
/** 双向导航只读投影，权限逐目标验证。 */
interface ProjectConversationLinkViewModel {
  /** 当前项目或群聊，撤销后null。 */ readonly anchorReference: OwnerReference | null;
  /** provider正式关系，缺合同null。 */ readonly relationshipMaterial: SafeProjectConversationAssociationView | null;
  /** 逐ref绑定访问结果，不能按数组索引错配。 */ readonly targets: readonly {
    readonly reference: OwnerReference;
    readonly access: AccessPosture;
  }[];
  /** 当前正式关系来源/版本，缺失null。 */ readonly provenance: ProvenanceMetadata | null;
  /** 当前锚点/关系source消费槽位。 */ readonly consumptionContext: ClientConsumptionContext;
  /** 本地加载姿态。 */ readonly loadPosture: PageLoadPosture;
}
```

| 字段 | 类型/约束与来源 |
|---|---|
| anchorReference/consumptionContext | 声明中的类型；正式Work项目或Conversation群聊锚点+对应当前source槽位 |
| relationshipMaterial/provenance | 声明中的类型；正式provider关系/version/visibility；未确认owner不能构造，由shell blocked |
| targets | 声明中的readonly row[]；ref来自正式关系，access独立SDK查询并按ref关联；无target授权不显示subject入口 |
| loadPosture | PageLoadPosture；关系与目标access加载派生；relation可见不等于target可见 |

| 工厂/成员完整签名 | 条件、结果、副作用 |
|---|---|
| `ProjectConversationLinkFactory.forAnchor(anchor: OwnerReference, context: ClientConsumptionContext): Outcome<ProjectConversationLinkViewModel>` | 正式关系provider已绑定及当前锚点可读；初始loading/空targets，缺合同dependency_unbound |
| `applyRelationship(view: ProjectConversationLinkViewModel, relationship: QualifiedMaterial<SafeProjectConversationAssociationView>): Outcome<ProjectConversationLinkViewModel>` | 当前锚点/source/version匹配；先失效已解除目标及返回ref，新目标access默认blocked |
| `applyTargetAccess(view: ProjectConversationLinkViewModel, target: OwnerReference, access: QualifiedMaterial<AccessPosture>, current: ClientConsumptionContext): Outcome<ProjectConversationLinkViewModel>` | target仍属当前获准关系，target独立消费槽位匹配；hidden不保留label/ref入口 |
| `restrict(view: ProjectConversationLinkViewModel, change: VisibilityChangeView): ProjectConversationLinkViewModel` | 正式解除/撤销立即清关联和目标入口；不能依靠缓存关系复活 |

状态复用PageLoadPosture。一群至多一项目/项目多群仅产品目标；Chat无createBinding/unlink功能，不强行写owner。各群Participant可不同；群聊成员不是ProjectMember，跨群不并集权限。

### 5.13 `CompanyDirectoryViewModel`

定义：`src/collaboration/company_directory_view_model.ts`。

```ts
/** provider授权目录页，不将身份/项目成员/群聊参与者合成全公司名单。 */
interface CompanyDirectoryViewModel {
  /** 正式provider引用，缺owner合同或撤销时null。 */ readonly providerReference: OwnerReference | null;
  /** 当前provider/search/page消费槽位。 */ readonly consumptionContext: ClientConsumptionContext;
  /** local查询及人员选择，不赋DM权限。 */ readonly searchState: LocalDirectorySearchState;
  /** 正式获准安全人员摘要。 */ readonly people: readonly SafeMaterialSnapshot[];
  /** 正式分页游标，必须保留搜索/来源lineage。 */ readonly nextPageRef: ExternalHandle<"page_cursor"> | null;
  /** 正式页lineage/coverage完整存储；nextPageRef只从此字段只读派生。 */ readonly pageInfo: LocalPageInfo;
  /** provider正式scope及人类/AI覆盖，不猜全公司。 */ readonly coverage: DirectoryCoverage;
  /** 目录当前access；详情/DM另验。 */ readonly accessPosture: AccessPosture;
  /** 该目录来源的水位。 */ readonly freshness: FreshnessMarker;
  /** 本地加载姿态。 */ readonly loadPosture: PageLoadPosture;
}
/** adapter明确映射的目录结果，非SDK wire DTO。 */
interface SafeDirectoryPageView {
  /** 与当前query/page代次匹配的safe页。 */ readonly page: LocalPage<SafeMaterialSnapshot>;
  /** 正式provider覆盖。 */ readonly coverage: DirectoryCoverage;
  /** 正式provider/source/access/provenance。 */ readonly provenance: ProvenanceMetadata;
}
```

| 字段 | 类型/约束与来源 |
|---|---|
| providerReference/consumptionContext/accessPosture | 声明中的类型；正式provider identity+actor/scope/source/access；不能将AI Identity默认当公司provider |
| searchState | LocalDirectorySearchState；用户输入限长，filter须provider支持；改变搜索清游标/旧名单/选择并推进代次 |
| people/nextPageRef | 声明中的类型；formal safe page；相同query/filter/provider/scope/source lineage，正式排序和safe身份去重 |
| pageInfo | LocalPageInfo，来自当前qualified page.pageInfo；nextPageRef只读等于pageInfo.nextCursor，不单独更新；search/revoke清cursor/lineage，分页只能取当前pageInfo |
| coverage/freshness | DirectoryCoverage/FreshnessMarker；provider正式声明，unknown不显示“全公司”，人数仅获准页局部值 |
| loadPosture | PageLoadPosture；当前安全页资格/覆盖派生；空结果不代表scope没有人员 |

| 工厂/成员完整签名 | 条件、结果、副作用 |
|---|---|
| `CompanyDirectoryFactory.forProvider(provider: OwnerReference, context: ClientConsumptionContext, access: AccessPosture): Outcome<CompanyDirectoryViewModel>` | 正式provider合同与访问具备才loading；无合同dependency_unbound，初始空query/all/空列表，coverage unknown |
| `updateSearch(view: CompanyDirectoryViewModel, search: LocalDirectorySearchState, next: ClientConsumptionContext): Outcome<CompanyDirectoryViewModel>` | 同provider且新代次，清名单/分页/选人，loading；unsupported filter invalid_input；不隐式建DM |
| `applyPage(view: CompanyDirectoryViewModel, page: QualifiedMaterial<SafeDirectoryPageView>): Outcome<CompanyDirectoryViewModel>` | 当前search/page槽位匹配；错context_changed、缺资格authority_missing；不得用旧页反向改新query |
| `selectPerson(view: CompanyDirectoryViewModel, person: OwnerReference): Outcome<CompanyDirectoryViewModel>` | person在当前获准页；只local选择，详情/DM capability独立验证 |
| `restrict(view: CompanyDirectoryViewModel, change: VisibilityChangeView): CompanyDirectoryViewModel` | 先清名单/选择/游标/返回ref；provider撤销清provider及context，blocked |

状态复用PageLoadPosture。目录search/page上游能力未确认仍CHAT-UP-009 blocked；本地搜索不能遍历隐藏人员或把ProjectMember/Participant/Member-presence合成名单。

### 5.14 `ProjectContextCoordinator`

定义：`src/collaboration/project_context_coordinator.ts`。私有依赖字段：`store: ClientStatePort`、`reads: CollaborationReadPort`、`identity: LocalIdentityPort`、`materials: SafeMaterialComposer`，均由composition注入；`ProjectContextCoordinator.create(deps: ProjectContextCoordinatorDeps): ProjectContextCoordinator`，Deps与四字段一一对应，无额外业务state。

| 成员完整签名 | 参数来源/结果/副作用 |
|---|---|
| `loadList(input: ProjectListReadInput, session: QualifiedSession): Promise<Outcome<LocalPage<SafeMaterialSnapshot>>>` | Work获准项目列表query；SDK业务IO，matched槽位后local CAS，无owner写入 |
| `loadDetail(input: ProjectDetailReadInput, session: QualifiedSession): Promise<Outcome<ProjectDetailViewModel>>` | 先验证项目access，再分source加载，不承诺跨ownersnapshot；late context_changed |
| `loadLinks(input: LinkReadInput, session: QualifiedSession): Promise<Outcome<ProjectConversationLinkViewModel>>` | 正式关系查询+逐目标入口资格，缺provider dependency_unbound |
| `navigate(navigation: ProjectNavigationState, expected: LocalVersion): Outcome<void>` | local CAS；切目标先失效旧槽位，进入进度标签不修改Process |
| `clear(reason: ClearReason): Outcome<void>` | store立即遮蔽项目/选择/返回；durable清理由Eviction协调，无owner删除 |

### 5.15 `ProcessDrilldownCoordinator`

定义：`src/collaboration/process_drilldown_coordinator.ts`。字段 `store: ClientStatePort`、`reads: CollaborationReadPort`、`identity: LocalIdentityPort`、`materials: SafeMaterialComposer`；factory `create(deps: ProcessDrilldownCoordinatorDeps): ProcessDrilldownCoordinator`，Deps一一对应，均显式注入，无独立业务state。

| 成员完整签名 | 参数来源/结果/副作用 |
|---|---|
| `loadProjectFlow(input: ProcessFlowReadInput, session: QualifiedSession): Promise<Outcome<ProcessFlowViewModel>>` | Process正式项目关联+整体拓扑query；无正式input不能拼图 |
| `loadStageFlow(input: StageFlowReadInput, parent: ProcessFlowViewModel, session: QualifiedSession): Promise<Outcome<ProcessFlowViewModel>>` | 正式stage下钻关联与父revision匹配；新source槽位，不从node label定位 |
| `loadNodeDetail(input: ProcessNodeReadInput, parent: ProcessFlowViewModel, session: QualifiedSession): Promise<Outcome<ProcessNodeDetailViewModel>>` | 当前获准node→正式关联→各owner分section访问；某源缺口partial，不阻塞安全其他section |
| `invalidateParent(project: OwnerReference, revision: ExternalHandle<"revision">): Outcome<void>` | local CAS失效旧stage/node及各section槽位，清旧图/列表/选择，要求formal重查 |

### 5.16 `DirectoryCoordinator`

定义：`src/collaboration/directory_coordinator.ts`。字段 `store: ClientStatePort`、`reads: CollaborationReadPort`、`identity: LocalIdentityPort`、`materials: SafeMaterialComposer`；factory `create(deps: DirectoryCoordinatorDeps): DirectoryCoordinator`，Deps一一对应，显式注入。

| 成员完整签名 | 参数来源/结果/副作用 |
|---|---|
| `load(input: DirectoryReadInput, session: QualifiedSession): Promise<Outcome<CompanyDirectoryViewModel>>` | provider独立access/query，缺人类/AI覆盖保持unknown，不虚构全公司 |
| `search(search: LocalDirectorySearchState, request: ConsumptionRequest, session: QualifiedSession): Promise<Outcome<CompanyDirectoryViewModel>>` | 清旧结果+代次推进；provider formal搜索，当前能力缺失dependency_unbound，不抓全公司名单本地过滤 |
| `loadNext(page: LocalPageRequest, request: ConsumptionRequest, session: QualifiedSession): Promise<Outcome<CompanyDirectoryViewModel>>` | cursor必须当前query lineage；并发页/搜索晚到不得CAS覆盖 |
| `loadMemberContext(input: MemberContextReadInput, session: QualifiedSession): Promise<Outcome<readonly SafeMaterialSnapshot[]>>` | Identity/ProjectMember/Participant/Member分别query和access，返回分source摘要，不创建DM |
| `clear(reason: ClearReason): Outcome<void>` | 先失效slot/遮蔽名单/清query/选人/游标，取消只读请求；不取消owner任务 |

三coordinator共用失败集合：invalid_input/access_denied/authority_missing/dependency_unbound/context_changed/local_conflict/unsafe_material/aborted_read。store冲突仅安全读重算，不重新dispatch任何命令。完整port协议尚未完成，由Step7后续批次逐项承接上述具名能力，当前对象契约不使SDK generic skeleton可用。

### 5.17 新页面/组件props及模块停审

| planned页面/组件 | 完整业务props/callback类型 | 唯一职责 |
|---|---|---|
| ProjectListPage | `model: LocalPage<SafeMaterialSnapshot>; onOpen: (project: OwnerReference) => Promise<Outcome<void>>; onNext: () => Promise<Outcome<void>>` | Work项目安全列表→详情 |
| ProjectDetailPage | `model: ProjectDetailViewModel; onNavigate: (navigation: ProjectNavigationState) => Outcome<void>; onOpenConversation: (target: OwnerReference) => Promise<Outcome<void>>; onOpenEvidence: (target: OwnerReference) => Promise<Outcome<void>>` | 五标签组合，目标再次验证 |
| CompanyDirectoryPage | `model: CompanyDirectoryViewModel; onSearch: (search: LocalDirectorySearchState) => Promise<Outcome<void>>; onNext: () => Promise<Outcome<void>>; onSelect: (person: OwnerReference) => Promise<Outcome<void>>` | provider名单/详情入口，不自动创建DM |
| ProjectConversationLinks | `model: ProjectConversationLinkViewModel; onOpen: (target: OwnerReference) => Promise<Outcome<void>>` | 正式关系的受控入口 |
| ReadOnlyProcessRenderer | `model: ProcessFlowViewModel; navigation: ProjectNavigationState; onStage: (stage: OwnerReference) => Promise<Outcome<void>>; onNode: (node: OwnerReference) => Promise<Outcome<void>>; onViewport: (viewport: LocalViewportState) => Outcome<void>` | 同safe图/等价列表/键盘，只读，稳定容器/焦点；无raw XML/任意HTML |
| ProcessNodeDetailPanel | `model: ProcessNodeDetailViewModel; onOpenReference: (ref: OwnerReference) => Promise<Outcome<void>>; onGovernanceIntent: (action: ExternalHandle<"governance_action">) => Promise<Outcome<void>>; onBack: () => Outcome<void>` | 分ownersection与受控Gate入口，复用CommandResultGate |

函数入口统一 `(props: Readonly<Props>): ReactElement | null`；safe纯文本、受控引用，无SDK client/owner DTO。ProjectProgressPanel原先单Work summary props仅为对话中的Work摘要，完整Process在项目进度tab由ReadOnlyProcessRenderer承担；不得把摘要当整体BPMN图。

| 对象组停审 | 结论/测试切口（全部planned） |
|---|---|
| 项目/导航 | 五标签→当前context；选任务进入progress并定位获准node；late不覆盖新标签；无进度顶层路由 |
| Process/节点 | fork/branch/join正式结构；父版本变化失效详情；无拓扑时blocked；图/列表/键盘同安全材料，不泄露隐藏节点/边/总数 |
| 关系 | provider未确认blocked；多群成员不同；anchor/target分别access；解除立即去入口/返回ref |
| 目录 | 人类/AI覆盖来自provider；search/page代次；三类成员来源分离；无目录能力不拼全公司名单 |
| coordinator/UI | 所有dependencies注入，无组件业务IO；异步matched CAS，点击/Gateway/工具统计/测试摘要都不是审批或验收成功 |

collaboration模块重审结论：Chat-local字段/工厂/纯成员/props闭合；Process、绑定和目录正向资格CHAT-UP-008/009继续blocked；未完成的Step7接口不宣称已经实现。非原子多source组合显示各自新鲜度和缺口。

## 6. intents模块：功能抽象与对象契约

| capability | 对象 | 字段/函数/状态来源 | 后续 |
|---|---|---|---|
| 编辑/验证/恢复 | DraftState、DraftCoordinator | context/text/ref/revision；edit/validate/restore；DraftPhase | DraftPort/safe persist |
| 提交/幂等/反馈 | CommandAttemptState、UserIntentCoordinator | intent/context/idempotency/receipt/result；reserve/submit | SDK command/probe |
| 正式结果资格 | CommandResultGate/policy | required authority/fence/association；evaluate/resolveUnknown | result mapping |
| optimistic/confirmed/failed显示 | IntentFeedbackViewModel/view | posture/nextAction/optimistic；fromAttempt | UI，不独立truth |

### 6.1 `DraftState`

```ts
/** 未提交输入；文本仅内存，durable资格缺失时不存盘。 */
interface DraftState {
  readonly draftRef: LocalId<"draft">;
  readonly contextRef: ExternalHandle<"context">;
  readonly safeText: string;
  readonly attachmentRefs: readonly OwnerReference[];
  readonly replyTarget: ExternalHandle<"turn"> | null;
  readonly validation: LocalValidationState;
  readonly revisionHint: number;
  readonly phase: DraftPhase;
  readonly submittingIntent: LocalId<"intent"> | null;
}
/** 本地草稿阶段；不是owner接受状态。 */
type DraftPhase =
  /** 未有输入。 */ "empty"
  /** 用户编辑，前次校验失效。 */ | "editing"
  /** 本地结构/长度条件通过。 */ | "locally_valid"
  /** 本地条件不通过。 */ | "invalid"
  /** 该revision已关联attempt。 */ | "submitting"
  /** 恢复后等待重新校验语境。 */ | "restored"
  /** 对应本地内容已清除。 */ | "cleared";
/** 本地校验不等于业务授权。 */
interface LocalValidationState {
  readonly checkedRevision: number | null;
  readonly issues: readonly ("empty" | "too_long" | "unsafe_ref" | "context_unverified")[];
}
```

| 字段 | 来源/约束 |
|---|---|
| draftRef/contextRef | LocalIdentityPort+current fence；context切换不复用草稿 |
| safeText | 用户输入，config限长，禁止诊断/日志；不是owner body |
| attachmentRefs/replyTarget | 当前qualified安全引用；无upload/file body假能力 |
| validation | 本地长度/ref/fence策略；checkedRevision必须当前revision |
| revisionHint | edit/attach/reply修改单调+1 safe integer；非owner version |
| phase/submittingIntent | factory/transition，submitting必有intent；clear不可清更新revision |

| 完整签名 | 返回/副作用/条件 |
|---|---|
| `DraftFactory.empty(id: LocalId<"draft">, context: ExternalHandle<"context">): DraftState` | empty/text=""/refs=[]/revision0 |
| `restore(snapshot: DraftSnapshot, access: AccessPosture): Outcome<DraftState>` | restored，校验失效；无资格不恢复text |
| `edit(draft: DraftState, text: string, policy: DraftPolicy): Outcome<DraftState>` | editing/revision+1，清submitting关联但不取消旧attempt |
| `attach(draft: DraftState, ref: OwnerReference, access: AccessPosture): Outcome<DraftState>` | source/fence匹配，revision+1去重 |
| `setReplyTarget(draft: DraftState, turn: ExternalHandle<"turn">, surface: ConversationSurfaceViewModel): Outcome<DraftState>` | 当前safe turn，revision+1 |
| `validate(draft: DraftState, policy: DraftPolicy, access: AccessPosture): DraftState` | locally_valid/invalid；issues/check revision |
| `markSubmitting(draft: DraftState, intent: LocalId<"intent">, expectedRevision: number): Outcome<DraftState>` | revision匹配且locally_valid→submitting |
| `releaseSubmission(draft: DraftState, attempt: CommandAttemptState): Outcome<DraftState>` | 同draftRef/revision/submittingIntent且attempt已failed/rejected，submitting→editing，保留内容与revision、清submitting关联和validation；unknown/pending/confirmed不得调用，新稿不受旧attempt影响 |
| `clear(draft: DraftState, reason: ClearReason, expectedRevision: number): Outcome<DraftState>` | 只匹配revision清text/refs，cleared；更新revision拒清 |

`DraftPolicy = { maxTextUnits: number; maxAttachmentRefs: number }`由validated config，正safe integer；不定义owner允许的发送大小。`DraftSnapshot = { draftRef: LocalId<"draft">; contextCandidate: RestorationHint; revisionHint: number; safeText: string; attachmentCandidates: readonly RestorationHint[] }`仅在正式durable资格允许时存在；默认不序列化任何text/ref句柄。恢复候选不授权。
variant表：empty→editing/cleared；editing/restored→locally_valid/invalid/cleared；invalid→editing/locally_valid/cleared；locally_valid→editing/submitting/invalid/cleared；submitting→editing/cleared（失败保留内容并重验，不取消attempt）；cleared→editing为新revision。issues各variant注释为同名本地拒绝原因，无生命周期。

### 6.2 `CommandAttemptState`

```ts
/** 一次逻辑意图的本地记录；不存命令正文，不替代owner receipt。 */
interface CommandAttemptState {
  readonly intentRef: LocalId<"intent">;
  readonly intentKind: IntentKind;
  /** Governance去重与关联，非Decision truth；conversation为null。 */ readonly gateReference: OwnerReference | null;
  /** 正式Gate受控action；非审批结果。 */ readonly governanceAction: ExternalHandle<"governance_action"> | null;
  readonly fence: ContextFence;
  readonly actorRef: ExternalHandle<"actor">;
  readonly draftRef: LocalId<"draft"> | null;
  readonly draftRevision: number | null;
  readonly idempotencyAssociation: ExternalHandle<"idempotency"> | null;
  readonly receiptRef: ExternalHandle<"receipt"> | null;
  readonly resultRef: ExternalHandle<"result"> | null;
  readonly resultPosture: CommandResultPosture;
  readonly nextAction: AttemptNextAction;
  readonly dispatched: boolean;
  readonly safeReason: SafeReasonCode | null;
}
/** 意图分类只驱动正式SDK受控能力。 */
type IntentKind =
  /** 发送/回复安全用户意图。 */ "conversation"
  /** 正式Gate受控action。 */ | "governance";
/** 正式02命令结果轴。 */
type CommandResultPosture =
  /** 本地预留，尚未dispatch。 */ "draft"
  /** SDK已发起，非业务确认。 */ | "submitted"
  /** 正式结果明确处理中。 */ | "pending"
  /** matched正式committed结果经gate确认。 */ | "confirmed"
  /** 正式业务拒绝。 */ | "rejected"
  /** 失败且明确副作用未成立。 */ | "failed"
  /** 已dispatch但副作用不确定。 */ | "unknown";
/** 安全后续动作；没有自动重发。 */
type AttemptNextAction = "wait" | "probe" | "explicit_retry" | "user_decision" | "none";
```

| 字段组 | 来源/约束 |
|---|---|
| intentRef/kind/fence/actor | local identity+current verified access/session；不能UI填写actor |
| draftRef/revision | 同次冻结draft，governance可null；pair必须同时有/无 |
| gateReference/governanceAction | GovernanceIntentInput正式safe gate/action，governance必填且与capability匹配；conversation均null；用于当前actor/fence内nonterminal去重，不能按button文字去重 |
| idempotencyAssociation | SDK正式prepare结果，dispatch前必填；不从local id拼key |
| receiptRef/resultRef | gate接受的正式材料；terminal需正式业务结果ref或明确业务确认receiptRef；failed pre-dispatch例外；普通receiptRef不能confirmed |
| posture/nextAction/dispatched | local factory→transition；unknown必dispatched=true且probe/user_decision |
| safeReason | finite code；不存request/response body或digest正文 |

| 完整签名 | 参数来源/返回/副作用 |
|---|---|
| `AttemptFactory.fromDraft(id: LocalId<"intent">, kind: IntentKind, fence: ContextFence, session: QualifiedSession, draft: DraftState \| null): Outcome<CommandAttemptState>` | draft预留，dispatched=false，association=null |
| `AttemptFactory.fromGovernance(id: LocalId<"intent">, fence: ContextFence, session: QualifiedSession, input: GovernanceIntentInput): Outcome<CommandAttemptState>` | 仅governance正式Gate/action/actor/capability匹配，draftRef/revision=null，gateReference/governanceAction填齐，draft/dispatched=false；fromDraft本轮只用于conversation，禁止governance缺gate/action构造 |
| `restore(snapshot: AttemptSnapshot, probe: FormalProbeResult): Outcome<CommandAttemptState>` | 仅重新绑定正式locator并probe；未获结论unknown；不能以persisted confirmed恢复当前truth |
| `bindIdempotency(attempt: CommandAttemptState, association: ExternalHandle<"idempotency">): Outcome<CommandAttemptState>` | 只draft，SDK正式准备，不dispatch |
| `markSubmitted(attempt: CommandAttemptState, submission: CommandSubmission): Outcome<CommandAttemptState>` | dispatch边界；association匹配，submitted/dispatched=true |
| `applyReceipt(attempt: CommandAttemptState, receipt: CommandReceiptView, gate: CommandResultGate): Outcome<CommandAttemptState>` | 普通receipt至多submitted/pending；仅SDK明确业务确认receipt并证明owner/intent/actor/scope/association才可经gate terminal；transport ACK不进入receipt authority |
| `applyResult(attempt: CommandAttemptState, result: FormalResultMaterial, gate: CommandResultGate): Outcome<CommandAttemptState>` | gate允许后修改posture/refs/nextAction；无IO |
| `markUnknown(attempt: CommandAttemptState, reason: SafeReasonCode): Outcome<CommandAttemptState>` | 只dispatched非terminal→unknown；nextAction=probe |
| `chooseNextAction(attempt: CommandAttemptState, action: AttemptNextAction, capability: IntentCapabilityView): Outcome<CommandAttemptState>` | unknown不explicit_retry；failed/rejected新意图重验，terminal不覆写 |

variant表：draft→submitted/failed（明确未dispatch）；submitted→pending/confirmed/rejected/failed/unknown；pending→confirmed/rejected/failed/unknown；unknown→pending/confirmed/rejected/failed/unknown只formal probe/result；confirmed/rejected/failed在同intent终止，重复同结果no-op、冲突authority拒绝。IntentKind两variant非状态；AttemptNextAction分别等待/正式探测/用户明确重试/用户决定/无动作，来源为gate/capability，不独立生命周期。

### 6.3 `CommandResultGate`

```ts
/** 唯一结果升级guard；ACK/点击/通知/cache不是authority。 */
interface CommandResultGate {
  readonly intentKind: IntentKind;
  readonly requiredAuthority: "conversation_owner" | "governance_owner";
  readonly unknownPolicy: "probe_only";
  readonly replayPolicy: "never_automatic";
  evaluate(attempt: CommandAttemptState, material: FormalResultMaterial): Outcome<ResultGateDecision>;
  acceptsAuthority(authority: ResultAuthority): boolean;
  resolveUnknown(attempt: CommandAttemptState, probe: FormalProbeResult): Outcome<ResultGateDecision>;
  allowsRetry(attempt: CommandAttemptState, capability: IntentCapabilityView): boolean;
}
```

factory `forIntent(kind: IntentKind): CommandResultGate`决定requiredAuthority，两个authority variant只能adapter正式证明同owner，policy literals不可config override。`ResultGateDecision = { next: CommandResultPosture; receiptRef: ExternalHandle<"receipt"> | null; resultRef: ExternalHandle<"result"> | null; nextAction: AttemptNextAction; safeReason: SafeReasonCode | null }`；所有ref来自formal material，不生成结果。
`ResultAuthority`唯一定义见§17独立卡，是adapter local投影；三个evidenceKind分别为正式业务结果、SDK明确业务确认receipt、正式业务变化，非状态分类，均须owner正式合同与registry qualification。普通receipt、HTTP 2xx、websocket/AG-UI ACK不能构造此authority。gate校验kind、intent correlation、fence/actor/association、authority、formal side-effect分类；confirmed必须正式committed并有可核对resultRef，或明确业务确认的receiptRef，不能为满足字段而造result ref。probe not_found且owner未保证no effect仍unknown；fake不确认真实attempt。

### 6.4 `IntentFeedbackViewModel`

```ts
/** 从attempt派生的UI反馈，不含请求正文。 */
interface IntentFeedbackViewModel {
  readonly intentRef: LocalId<"intent">;
  readonly status: CommandResultPosture;
  readonly optimistic: boolean;
  readonly nextAction: AttemptNextAction;
  readonly reason: SafeReasonCode | null;
  readonly receiptRef: ExternalHandle<"receipt"> | null;
  readonly resultRef: ExternalHandle<"result"> | null;
}
```

factory `IntentFeedbackFactory.fromAttempt(attempt: CommandAttemptState): IntentFeedbackViewModel`与`IntentFeedbackFactory.applyAttempt(view: IntentFeedbackViewModel, attempt: CommandAttemptState): Outcome<IntentFeedbackViewModel>`同intent；optimistic仅submitted/pending且明确local占位，不构造Turn。unknown显式待探测，confirmed引用正式结果；不独立state machine，不从toast反推状态。

### 6.5 意图编排、草稿编排与UI

#### 6.5.1 `UserIntentCoordinator`

| 对象 | 字段/工厂 | 完整方法签名/副作用 |
|---|---|---|
| UserIntentCoordinator | store: ClientStatePort；commands: IntentCommandPort；probes: IntentProbePort；identity: LocalIdentityPort；guard: VisibilityGuard；factory create(deps: IntentCoordinatorDeps): UserIntentCoordinator一一对应 | `submitConversation(input: ConversationIntentInput, session: QualifiedSession): Promise<Outcome<IntentFeedbackViewModel>>`；`submitGovernance(input: GovernanceIntentInput, session: QualifiedSession): Promise<Outcome<IntentFeedbackViewModel>>`；`applyFormalResult(input: FormalResultMaterial): Outcome<IntentFeedbackViewModel>`；`applyReceipt(input: CommandReceiptView): Outcome<IntentFeedbackViewModel>`；`resolveUnknown(intent: LocalId<"intent">, session: QualifiedSession): Promise<Outcome<IntentFeedbackViewModel>>`；`retry(input: ExplicitRetryInput, session: QualifiedSession): Promise<Outcome<IntentFeedbackViewModel>>`。reserve/CAS前置，dispatch一次；retry建新用户意图，不自动重放unknown。 |

#### 6.5.2 `DraftCoordinator`

| 对象 | 字段/工厂 | 完整方法签名/副作用 |
|---|---|---|
| DraftCoordinator | drafts: DraftPort；store: ClientStatePort；policy: DraftPolicy；identity: LocalIdentityPort；create(deps: DraftCoordinatorDeps): DraftCoordinator | `edit(context: ExternalHandle<"context">, text: string, fence: ContextFence): Outcome<DraftState>`；`validate(context: ExternalHandle<"context">, fence: ContextFence): Outcome<DraftState>`；`load(context: ExternalHandle<"context">): Outcome<DraftState \| null>`；`clearConfirmed(intent: CommandAttemptState): Outcome<void>`。只匹配draftRef/revision清稿；无owner IO。 |

#### 6.5.3 `MessageComposer`

| 对象 | 字段/工厂 | 完整方法签名/副作用 |
|---|---|---|
| MessageComposer | Props={draft: DraftState; capability: IntentCapabilityView; onEdit(text: string): Outcome<void>; onSubmit(): Promise<Outcome<void>>} | ReactElement；Enter/点击同callback，IME composition不误发，禁用不是授权；text不写diagnostics |

#### 6.5.4 `IntentFeedback`

| 对象 | 字段/工厂 | 完整方法签名/副作用 |
|---|---|---|
| IntentFeedback | Props={model: IntentFeedbackViewModel; onProbe(): Promise<Outcome<void>>; onRetry(): Promise<Outcome<void>>} | optimistic/pending/failed/unknown明确；unknown只有probe/用户决定，无隐藏重发 |

模块停审：草稿revision/attempt关联/SDK幂等三者分离；pre-dispatch失败和effect_unknown有明确语义；UI props与coordinator唯一入口；pass_with_upstream_blockers。FormalResult/receipt/probe投影Step8闭合，正向authority绑定CHAT-UP-001/003仍blocked。

## 7. continuity模块：功能抽象与对象契约

| capability | 对象/类别 | 能力→字段/函数/状态 | 后续 |
|---|---|---|---|
| 来源连续性 | ContinuityState/local state | source/cursor/revision/gap；accept/resume/restrict；ContinuityPhase | SDK资格/恢复 |
| canonical恢复语境 | ResumeContext/context | fence/source/cursor/pending/actions；forGap/forRestart | 不在projection复制 |
| 接受/去重/缺口判定 | ChangeAcceptanceRecord/record | change/source/revision/acceptance；evaluate | SDK qualification，不解析cursor |
| reducer与恢复 | ChangeReducer、ResumeCoordinator、RecoveryCoordinator | ports/store/fence；consume/resume/requery/restart | local CAS |
| 恢复显示 | RecoveryViewModel/view | continuity/unknown/actions；fromState | UI/AT |

### 7.1 ContinuityState

```ts
/** 客户端正式来源连续性；技术连接成功不表示fresh。 */
interface ContinuityState {
  readonly phase: ContinuityPhase;
  readonly sourceRef: ExternalHandle<"change_source"> | null;
  /** 当前正式source消费槽位，不跨source覆盖水位。 */
  readonly consumptionContext: ClientConsumptionContext | null;
  readonly cursorRef: ExternalHandle<"change_cursor"> | null;
  readonly gapRef: ExternalHandle<"gap"> | null;
  readonly lastAcceptedRevision: ExternalHandle<"revision"> | null;
  readonly nextAction: RecoveryNextAction;
  readonly activeRecovery: LocalId<"recovery"> | null;
}
/** 正式02连续性轴。 */
type ContinuityPhase =
  /** 正式coverage证明连续。 */ "fresh"
  /** 最新水位尚未确认。 */ | "stale"
  /** SDK正式报告缺口。 */ | "gap"
  /** 技术连接恢复中。 */ | "reconnecting"
  /** 已启动formal resume/requery。 */ | "resuming"
  /** scope/visibility要求收紧。 */ | "restricted"
  /** 缺正式能力或安全条件。 */ | "blocked"
  /** 需用户/支持决定。 */ | "needs_action";
```

| 字段 | 来源/条件 |
|---|---|
| phase/nextAction | factory stale/requery；qualification/resume结果或安全收紧 |
| source/cursor/revision | qualified SDK change/resume；opaque，只registry equality，不算数排序 |
| consumptionContext | 当前正式source的ClientConsumptionContext；source/scope/target/代次相等才可accept/resume，未绑定null/blocked |
| gapRef | SDK formal gap descriptor；gap必填，无法提供时blocked而非造gap id |
| activeRecovery | LocalIdentityPort；resuming必填，single-flight，不等于owner job/run |

| 完整签名 | 返回/条件/副作用 |
|---|---|
| `ContinuityFactory.initial(source: ExternalHandle<"change_source"> \| null, context: ClientConsumptionContext \| null): ContinuityState` | 正式source及matched active context才stale/requery；未绑定blocked，无cursor |
| fromCache(entry: LocalProjectionEntry): ContinuityState | stale，cursor仍候选需rebind；不能fresh |
| accept(state: ContinuityState, record: ChangeAcceptanceRecord): Outcome<ContinuityState> | 只qualified accepted且当前连续；更新opaque revision/cursor；gap不得靠单event变fresh |
| markGap(state: ContinuityState, gap: ExternalHandle<"gap">): ContinuityState | gap/requery，保留最后已接受cursor |
| beginResume(state: ContinuityState, context: ResumeContext, recovery: LocalId<"recovery">): Outcome<ContinuityState> | allowed action+fence，resuming/single-flight |
| applyResumeResult(state: ContinuityState, result: ResumeResultView): Outcome<ContinuityState> | recovery id/source/fence匹配；complete coverage才fresh，partial→stale，denied→restricted，unbound→blocked |
| restrict(state: ContinuityState, change: VisibilityChangeView): ContinuityState | restricted/clear，清cursor/gap/recovery句柄 |
| markReconnecting(state: ContinuityState): ContinuityState | 非restricted/blocked→reconnecting；无fresh承诺 |
| requireAction(state: ContinuityState, reason: SafeReasonCode): ContinuityState | needs_action，无重放 |

variant表：fresh→stale/gap/reconnecting/restricted/blocked/needs_action；stale/gap/reconnecting→resuming/restricted/blocked/needs_action；resuming→fresh/stale/gap/restricted/blocked/needs_action；restricted只新qualified context后stale；blocked/needs_action只能力/用户选择并重验后resuming/stale。禁止reconnecting→fresh、gap→accept单event fresh。注释语义见声明。

### 7.2 ResumeContext

```ts
/** 唯一canonical恢复context；不保存raw event或待发送正文。 */
interface ResumeContext {
  readonly recoveryRef: LocalId<"recovery">;
  readonly fence: ContextFence;
  /** 当前source恢复槽位，旧目标代次不得应用。 */
  readonly consumptionContext: ClientConsumptionContext;
  readonly sourceRef: ExternalHandle<"change_source"> | null;
  readonly cursorRef: ExternalHandle<"change_cursor"> | null;
  readonly visibilityRef: ExternalHandle<"visibility"> | null;
  readonly gapRef: ExternalHandle<"gap"> | null;
  readonly pendingAttempts: readonly LocalId<"intent">[];
  readonly recoveryReason: RecoveryReason;
  readonly allowedActions: readonly RecoveryNextAction[];
}
```

local recovery id来自identity，fence来自当前验证route，consumptionContext取该source当前active槽位（forGap由state提供，forRestart重新resolve后提供），source/cursor/visibility/gap来自formal SDK；pendingAttempts从store unknown/dispatched非terminal记录读取，不能解释成owner提交；actions由capability与guard交集，不含resend。

| factory/成员完整签名 | 来源/返回/副作用 |
|---|---|
| ResumeContextFactory.forGap(id: LocalId<"recovery">, fence: ContextFence, state: ContinuityState, access: AccessPosture): Outcome<ResumeContext> | gap必formal，refs由state/access提供 |
| forRestart(id: LocalId<"recovery">, hint: RestorationHint, fence: ContextFence, context: ClientConsumptionContext, access: AccessPosture): Outcome<ResumeContext> | hint候选需resolve，no raw event |
| addUnknownAttempt(context: ResumeContext, intent: LocalId<"intent">): ResumeContext | 去重，仅本地 |
| replaceCursor(context: ResumeContext, result: ResumeResultView): Outcome<ResumeContext> | matched formal结果 |
| requireRequery(context: ResumeContext, reason: SafeReasonCode): ResumeContext | 只改安全actions |
| restrictForVisibility(context: ResumeContext, change: VisibilityChangeView): ResumeContext | 清句柄，仅clear/wait |

无独立state enum，phase在ContinuityState唯一。

### 7.3 ChangeAcceptanceRecord

```ts
/** 一次客户端接受判定，非owner event log/audit证据。 */
interface ChangeAcceptanceRecord {
  readonly changeRef: ExternalHandle<"change">;
  readonly sourceRef: ExternalHandle<"change_source">;
  readonly revisionMarker: ExternalHandle<"revision"> | null;
  readonly nextCursor: ExternalHandle<"change_cursor"> | null;
  readonly acceptance: ChangeAcceptanceKind;
  readonly affectedContexts: readonly ExternalHandle<"context">[];
  readonly safeReason: SafeReasonCode | null;
}
/** SDK资格与本地已消费集合共同决定的disposition。 */
type ChangeAcceptanceKind =
  /** 正式资格允许局部应用。 */ "accepted"
  /** 已处理的同一formal change。 */ | "duplicate"
  /** SDK明确无法按当前水位合并。 */ | "out_of_order"
  /** SDK明确有缺口。 */ | "gap"
  /** 正式撤销/收紧，只执行遮蔽清理。 */ | "restricted"
  /** 对当前scope无影响。 */ | "ignored";
```

全部ref/affectedContexts来自qualified ChangeQualification；不得从source ref字符串枚举scope。
factory evaluate(change: QualifiedMaterial<FormalChangeView>, qualification: ChangeQualification, consumed: ReadonlySet<ExternalHandle<"change">>, state: ContinuityState): Outcome<ChangeAcceptanceRecord>。
canApply(record: ChangeAcceptanceRecord): boolean仅accepted；requiresResume(record: ChangeAcceptanceRecord): boolean为gap/out_of_order；requiresCleanup(record: ChangeAcceptanceRecord): boolean为restricted。
每variant语义见注释，record不可变无生命周期，Step10只decision coverage表。duplicate使用formal identity+source/session partition等值；消费集合容量受限，淘汰后要求SDK resume资格，不能无条件当新。

### 7.4 RecoveryViewModel

```ts
/** 恢复反馈，只从local正式姿态派生，不显示原始payload。 */
interface RecoveryViewModel {
  readonly continuity: ContinuityState;
  readonly unknownAttempts: readonly LocalId<"intent">[];
  readonly allowedActions: readonly RecoveryNextAction[];
  readonly safeReason: SafeReasonCode | null;
}
```

factory fromState(continuity: ContinuityState, resume: ResumeContext 或 null, attempts: readonly CommandAttemptState[]): RecoveryViewModel；
applyContinuity(view: RecoveryViewModel, state: ContinuityState): RecoveryViewModel；
setUnknownAttempts(view: RecoveryViewModel, attempts: readonly CommandAttemptState[]): RecoveryViewModel仅same fence unknown。
无独立状态。RecoveryStatus props={model: RecoveryViewModel; onAction(action: RecoveryNextAction): Promise<Outcome<void>>}，React只显示/回调。

### 7.5 ChangeReducer

字段：store: ClientStatePort、qualification: ChangeQualificationPort、materials: SafeMaterialComposer。create(deps: ChangeReducerDeps): ChangeReducer，Deps与三字段一一对应。
consume(change: QualifiedMaterial<FormalChangeView>): Promise<Outcome<ChangeAcceptanceRecord>>；
applyQualified(snapshot: ClientSnapshot, change: FormalChangeView, record: ChangeAcceptanceRecord): Outcome<ClientPatch>。
SDK资格后单local CAS更新view/consumed/watermark；duplicate no-op；revoke先fence。不能在纯reducer里调用bus/owner API。

consume首先定位当前source槽位；actor/scope/project/target/source/visibility/requestGeneration不匹配均context_changed且不推进cursor。消费集合按session/scope/source分区；duplicate/out_of_order资格由SDK提供，不能按arrival time或opaque字符串排序。正式revoke命中当前scope时先失效所有受影响source消费者并清安全显示，再取消订阅和durable清理；不能因节点页已关闭而漏掉scope撤销，也不能由旧session消息撤销新session。

### 7.6 ResumeCoordinator

字段：store: ClientStatePort、resumes: ResumePort、reads: CollaborationReadPort、identity: LocalIdentityPort。create(deps: ResumeCoordinatorDeps): ResumeCoordinator，Deps逐项对应。
resume(input: ResumeInput, session: QualifiedSession): Promise<Outcome<ResumeResultView>>；
requery(input: ResumeInput, session: QualifiedSession): Promise<Outcome<ResumeResultView>>；
applyResult(result: ResumeResultView): Outcome<void>。
single-flight/fence；完整query与formal feed覆盖关系由SDK证明，无法证明则stale/blocked；不把HTTP返回当连续性恢复。

### 7.7 RecoveryCoordinator

字段：store: ClientStatePort、projections: LocalProjectionRepository、entries: EntryAccessPort、resumes: ResumeCoordinator、intents: UserIntentCoordinator、eviction: CacheEvictionCoordinator。create(deps: RecoveryCoordinatorDeps): RecoveryCoordinator，Deps逐项对应。
restore(input: RestoreInput, session: QualifiedSession): Promise<Outcome<RecoveryViewModel>>；
choose(input: RecoveryActionInput, session: QualifiedSession): Promise<Outcome<RecoveryViewModel>>；
resolveUnknown(intent: LocalId<"intent">, session: QualifiedSession): Promise<Outcome<IntentFeedbackViewModel>>；
clearRevoked(input: ClearContextInput): Promise<Outcome<CacheLifecycleRecord>>。
缓存候选先guard、后query；无offline重发，无后台业务job；inputs唯一定义在本Step §18，Step8引用。

模块停审：正式qualification来源、consumed集合、canonical context、CAS和恢复id闭合；跨端只消费owner formal changes；pass_with_upstream_blockers（CHAT-UP-002）。

## 8. local_state模块：功能抽象与对象契约

| capability | 对象/类别 | 能力→字段/方法/状态 | 后续 |
|---|---|---|---|
| atomic local state与subscribe | ClientStateStore/store | snapshot/version/fence；read/CAS/subscribe | React binding/reducer |
| 草稿读取/修改 | DraftStore/store | context→draft/version；get/CAS | DraftCoordinator |
| 受限投影读写 | LocalProjectionEntry、Repository | partition/payload/state；load/save/evict | Step11 |
| 持有/恢复资格 | PersistenceSafetyGuard/policy | disclosure/retention/capability；hold/persist/restore | no raw body |
| 清理生命周期 | CacheLifecycleRecord、CacheEvictionCoordinator | reason/state/result；hide/evict/finish | revoke/logout |
| 无durable默认 | MemoryProjectionRepository/adapter | entries map/version；port实现 | no fake durable |

### 8.1 ClientSnapshot、ClientPatch与ClientStateStore

```ts
/** 同一次local版本的只读状态，不序列化整个root。 */
interface ClientSnapshot {
  readonly version: LocalVersion;
  readonly session: QualifiedSession | null;
  readonly route: RouteContext;
  readonly access: AccessPosture;
  readonly selection: SelectionState;
  readonly surface: ConversationSurfaceViewModel | null;
  /** 当前安全入口列表，与正式owner列表分离。 */ readonly entry: EntryViewModel | null;
  /** 当前Work项目列表safe page及lineage。 */ readonly projectList: LocalPage<SafeMaterialSnapshot> | null;
  /** 当前Artifact独立slot的safe预览，无raw URL。 */ readonly preview: PreviewResultView | null;
  /** capability按当前消费槽位保存，不能跨Gate/action复用。 */
  readonly intentCapabilities: ReadonlyMap<LocalId<"consumer_slot">, IntentCapabilityView>;
  /** 当前对话的正式项目关联，目标权限独立；无binding mutation。 */ readonly conversationLinks: ProjectConversationLinkViewModel | null;
  readonly drafts: ReadonlyMap<ExternalHandle<"context">, DraftState>;
  readonly attempts: ReadonlyMap<LocalId<"intent">, CommandAttemptState>;
  /** source分别持连续性，无跨owner原子fresh。 */
  readonly continuityBySource: ReadonlyMap<ExternalHandle<"source">, ContinuityState>;
  /** 各source唯一恢复语境，UI只引用当前source。 */
  readonly resumesBySource: ReadonlyMap<ExternalHandle<"source">, ResumeContext>;
  /** 每个query/change/section槽位的当前唯一context。 */
  readonly consumptionContexts: ReadonlyMap<LocalId<"consumer_slot">, ClientConsumptionContext>;
  /** 当前项目页和局部选择，不持ownertruth。 */
  readonly projectDetail: ProjectDetailViewModel | null;
  readonly projectNavigation: ProjectNavigationState | null;
  /** 当前安全节点详情，父版本变化先移除。 */
  readonly processNodeDetail: ProcessNodeDetailViewModel | null;
  /** 当前目录页，query变化清旧名单和游标。 */
  readonly companyDirectory: CompanyDirectoryViewModel | null;
  readonly materials: ReadonlyMap<LocalId<"material">, SafeMaterialSnapshot>;
  /** 去重source分区，不单集合跨owner比较。 */
  readonly consumedChanges: ReadonlyMap<ExternalHandle<"source">, ReadonlySet<ExternalHandle<"change">>>;
  readonly platform: PlatformCapabilityState;
  readonly accessibility: AccessibilityState;
}
/** 显式替换local字段，并携带所有异步消费槽位检查。 */
interface ClientPatch {
  /** version/session只能由root受控入口维护，不接受owner raw payload。 */
  readonly changes: Readonly<Partial<Omit<ClientSnapshot, "version" | "session">>>;
  /** qualified query/change/result涉及的全部当前槽位；同步local操作可空。 */
  readonly consumptionChecks: readonly ConsumptionCheck[];
}
/** 纯CAS检查载体，无独立状态或资格授予。 */
interface ConsumptionCheck {
  /** root内已登记的local消费者槽位。 */ readonly slotId: LocalId<"consumer_slot">;
  /** adapter保留的incoming context，不能临时改成current以绕过检查。 */ readonly incoming: ClientConsumptionContext;
}
/** 内存store；session root只由受控装配入口替换。 */
interface ClientStateStore {
  read(): ClientSnapshot;
  compareAndSet(expected: LocalVersion, fence: ContextFence | null, patch: ClientPatch): Outcome<ClientSnapshot>;
  replaceSession(session: QualifiedSession | null, route: RouteContext): Outcome<ClientSnapshot>;
  subscribe(listener: (snapshot: ClientSnapshot) => void): () => void;
  dispose(): void;
}
```

factory ClientStateStoreFactory.create(initial: ClientSnapshot): Outcome<ClientStateStore>。
初始值为blocked access、stale/blocked continuity、空refs/maps、无owner success；字段来自对应factory。私有root/listeners/disposed:boolean。
read返回immutable引用；CAS版本来自read，fence严格match，写后+1/一次通知；replaceSession先遮蔽并清maps/fence，不延续旧attempt能力；dispose停止listener且清敏感内存。
ClientPatch不能手写session/version；owner projection须qualified mapper后进入，store不授予资格；version溢出fail-fast。

新增slice初始null/空map；来源分别为§4.5/§5.8～5.16工厂及qualified reducer。projectNavigation是唯一local选择，ProjectDetailViewModel.navigation只是同store版本只读派生；Surface.selection同样从snapshot.selection派生，不能维护独立可写副本。continuityBySource/resumesBySource只存单source值，页面/RecoveryViewModel引用选中source，无第二份canonical continuity/resume。source/change_source句柄关系须registry正式证明，禁止cast等同。

Step9构造复核新增entry/projectList/preview初始null、intentCapabilities空Map；分别由assembleEntry、readProjectList安全页、PreviewResultViewFactory、IntentCapabilityViewFactory完成当前slot CAS，都是唯一root display slice。导航/撤销/搜索相关失效清对应slice，不能用组件私有state留旧data/lineage；owner truth不落此root。

compareAndSet除根fence外，还须核对patch涉及的当前槽位及incoming消费context，不能仅靠同root version授权旧节点响应。null fence只允许初始化/已遮蔽清理，不能导入材料或启用intent。项目/目录使用actor/scope及目标access guard，不要求Conversation contextRef非null。多source页面ready不是全部source同版本。

ClientPatch/ConsumptionCheck同归`client_state_store.ts`；changes来源为纯reducer/协调器已qualify模型，checks来源为原incoming QualifiedMaterial.consumptionContext和请求开始时的slotId。store对每个check读取root.consumptionContexts当前值并执行matches；缺slot/失效/晚到均context_changed，无部分写入。所有引入/升级正式材料、水位、权限或结果的patch必须覆盖相应slot；checks为空只允许当前fence内纯local草稿/选择/视口操作，或可验证的清引用/降权，不允许导入正式读结果。revoke patch无需旧active检查才能收紧，但必须验证正式撤销作用的session/scope/source，先invalidate槽位再清材料。replaceSession独立trusted入口，不能由patch写session/version。

### 8.2 DraftStore

私有字段store: ClientStatePort注入，factory create(store: ClientStatePort): DraftStore。
get(context: ExternalHandle<"context">): Outcome<{ draft: DraftState | null; version: LocalVersion }>；
save(draft: DraftState, expected: LocalVersion, fence: ContextFence): Outcome<void>；
remove(context: ExternalHandle<"context">, expected: LocalVersion, fence: ContextFence): Outcome<void>；
list(fence: ContextFence): Outcome<readonly DraftState[]>。
唯一root store中的draft map，DraftStore为adapter，不建立第二份canonical草稿。所有读带store version，save不得用draftRevision代version；只内存。

### 8.3 LocalProjectionEntry与恢复候选

```ts
/** 受限本地恢复投影，不保存canonical ResumeContext或owner body。 */
interface LocalProjectionEntry {
  readonly cacheKey: LocalId<"cache_key">;
  readonly partition: LocalPartition;
  readonly restorationHint: RestorationHint;
  readonly state: LocalProjectionState;
  readonly payload: ProjectionPayload;
  readonly localVersion: LocalVersion;
}
/** SDK提供的safe partition alias，不能凭ref解析account/scope。 */
interface LocalPartition { readonly sessionAlias: string; readonly scopeAlias: string; }
/** SDK正式safe locator能力提供的候选，不能自行拼接。 */
interface RestorationHint {
  readonly locator: string;
  readonly locatorKind: "entry" | "context" | "attempt" | "project" | "process_node" | "directory";
  readonly schemaVersion: 1;
}
/** 默认仅安全候选；内存句柄不得序列化。 */
interface ProjectionPayload {
  readonly selectionHint: RestorationHint | null;
  readonly attemptHints: readonly AttemptSnapshot[];
  readonly draftSnapshot: DraftSnapshot | null;
  readonly safeMaterials: readonly SafeMaterialSnapshot[];
}
/** 正式02本地投影生命周期。 */
type LocalProjectionState =
  /** repository无记录的synthetic读结果。 */ "absent"
  /** 合格局部投影已保存。 */ | "cached"
  /** 已载入受限候选，未fresh。 */ | "restored"
  /** 来源可能落后或待重新验证。 */ | "stale"
  /** 只能受限持有，不显示旧文本。 */ | "restricted"
  /** 已遮蔽且正在删除。 */ | "evicting"
  /** repository确认删除。 */ | "cleared";
/** 最小attempt恢复关联，不携带命令正文或成功断言。 */
interface AttemptSnapshot {
  readonly intentRef: LocalId<"intent">;
  readonly locator: RestorationHint;
  readonly wasDispatched: boolean;
}
```

| 字段 | 来源/约束 |
|---|---|
| cacheKey/partition | identity+SDK safe partition alias；合同缺失只memory，不durable |
| hint/attempt locator | SDK正式safe serialization；禁止serialize handle.token或拼ref字符串 |
| state/localVersion | repository读写；absent无实体；load带版本；cleared仅delete确认 |
| payload | guard批准；durable默认draftSnapshot=null、safeMaterials=[]；不序列化内存handles |

factory fromDraft(key: LocalId<"cache_key">, partition: LocalPartition, hint: RestorationHint, draft: DraftState, version: LocalVersion, guard: PersistenceSafetyGuard): Outcome<LocalProjectionEntry>只允许memory或明确durable资格；
fromRoute(key: LocalId<"cache_key">, partition: LocalPartition, hint: RestorationHint, selection: RestorationHint 或 null, version: LocalVersion): Outcome<LocalProjectionEntry>无正文；
restore(entry: LocalProjectionEntry, access: AccessPosture): Outcome<LocalProjectionEntry>为restored/stale；
restrict(entry: LocalProjectionEntry, reason: ClearReason): LocalProjectionEntry清敏感payload；
beginEvict(entry: LocalProjectionEntry, reason: ClearReason): LocalProjectionEntry为evicting；
finishEvict(entry: LocalProjectionEntry, result: DeleteResult): Outcome<LocalProjectionEntry>只deleted/already_absent才cleared。
locatorKind六variant为entry/context/attempt/project/process_node/directory候选，只能来自SDK正式safe locator，不授权；新增三类缺serializer则dependency_unbound，不能以local ref代替。schemaVersion仅1，不支持版本拒绝。locator限长非空，不含secret/URL/raw ref，需正式allowlist资格。

### 8.4 CacheLifecycleRecord

```ts
/** 本地清理记录，无owner audit/evidence含义。 */
interface CacheLifecycleRecord {
  readonly cacheKey: LocalId<"cache_key">;
  readonly reason: ClearReason;
  readonly state: "evicting" | "restricted" | "cleared";
  readonly deleteConfirmed: boolean;
  readonly safeError: ChatErrorCode | null;
}
/** repository删除完成面，不猜测成功。 */
interface DeleteResult {
  readonly outcome: "deleted" | "already_absent" | "failed";
  readonly error: ChatError | null;
}
```

factory fromEviction(key: LocalId<"cache_key">, reason: ClearReason): CacheLifecycleRecord为evicting/false；
finish(record: CacheLifecycleRecord, result: DeleteResult): CacheLifecycleRecord：deleted/already_absent→cleared/true；failed→restricted/false且error必填。
三branch语义为确认删除/确认原本不存在/未确认，来源为repository。record只是LocalProjectionState清理返回面，不新增重复状态机。

### 8.5 PersistenceSafetyGuard

字段：durableQualified:boolean、maxEntries:number、draftDurable:false、materialDurable:false，来自validated config与host正式资格；后两项本轮固定false。
create(config: ClientConfig, platform: PlatformCapabilityState): PersistenceSafetyGuard，配置不得开启未qualified能力。
canHold(material: SafeMaterialSnapshot, access: AccessPosture): boolean；
canPersist(entry: LocalProjectionEntry): Outcome<PersistenceDecision>；
canRestore(entry: LocalProjectionEntry, access: AccessPosture): Outcome<PersistenceDecision>。
PersistenceDecision={allowed:boolean; mode:"memory_only" | "qualified_durable" | "denied"; reason:SafeReasonCode|null}。
mode各variant语义：memoryOnly无durable承诺；qualified_durable仅正式safe locator+storage/cleanup资格；denied不写/恢复。无独立生命周期。默认safe locator合同未闭合则durable denied。禁止raw owner body/credential/preview token/command正文。

### 8.6 CacheEvictionCoordinator

字段：store:ClientStatePort、projections:LocalProjectionRepository、feeds:ChangeFeedPort；create(deps:EvictionCoordinatorDeps)逐项注入。
evict(input:EvictionInput):Promise<Outcome<CacheLifecycleRecord>>；
clearContext(input:ClearContextInput):Promise<Outcome<CacheLifecycleRecord>>。
先fence失效/遮蔽，再停止feed，最后repository删除；失败保持安全遮蔽，不写owner deletion。

### 8.7 MemoryProjectionRepository

私有字段entries:Map<LocalId<"cache_key">,LocalProjectionEntry>、disposed:boolean、guard:PersistenceSafetyGuard、store:ClientStatePort（仅复核当前fence及partition写入资格）。
create(guard:PersistenceSafetyGuard,store:ClientStatePort):MemoryProjectionRepository；
实现Step7 load/save/list/evict全部签名，read/CAS生成local version；
dispose():void清内存，无durable删除承诺。
repository接口在local_projection_repository.ts唯一，memory实现在既定文件。

模块停审：store/draft/repository版本读写配对，payload逐项资格、default memory，未知safe locator/durable能力blocked；pass_with_upstream_blockers。

## 9. sdk模块：功能抽象与对象契约

| capability | 对象 | 字段/方法来源 | 禁止/后续 |
|---|---|---|---|
| export与operation资格 | SdkCapabilityBinding | formal binding registry、status、session；require/qualify | generic unknown不满足，Step7 exact matrix |
| safe reads | SdkQueryAdapter | binding+client；实现Entry/Collaboration/Probe ports | 无private owner API |
| command/result | SdkCommandAdapter | binding+client；prepare/dispatch/result qualification | ACK不confirm |
| change/resume | SdkChangeAdapter | binding+client+subscription registry | 无bus topic/offset |
| ref/preview | SdkReferenceAdapter | binding+client | 不拼URL |
| low敏handoff | DiagnosticHandoffAdapter | binding+client | 无backend audit/raw log |

### 9.1 SdkCapabilityBinding

```ts
/** operation资格记录；availability不能由配置或UI自行授予。 */
interface CapabilityBindingRecord {
  readonly operation: SdkOperation;
  readonly status: "bound" | "blocked" | "disabled";
  readonly formalContractRef: string | null;
  readonly missing: readonly BindingRequirement[];
}
/** 全部Chat消费operation，非虚构SDK method名。 */
type SdkOperation = "entry_read" | "surface_read" | "turn_page" | "owner_summary"
  | "project_list" | "project_detail" | "project_process_flow" | "stage_process_flow"
  | "process_node_detail" | "project_conversation_links" | "company_directory" | "member_context"
  | "conversation_command" | "governance_command" | "command_probe"
  | "change_feed" | "change_qualification" | "resume" | "preview" | "diagnostic" | "intent_capability" | "safe_locator";
/** 正向绑定必须全部满足的契约维度。 */
type BindingRequirement = "export_type" | "actor_scope" | "visibility" | "result_authority"
  | "idempotency" | "change_identity" | "cursor_resume" | "redaction" | "compatibility";
```

operation各variant对应同名消费能力，无生命周期；requirement各variant对应必须核对的正式合同维度，不能用bool说明代替合同引用。

八个新增operation对应02具名Load*能力，是Chat-local registry名称，不能写成SDK已经导出的方法。Process topology/state/association/version/change/resume须CHAT-UP-008关闭；关系/目录provider/access/搜索分页须CHAT-UP-009关闭，否则records明确blocked。SDK package skeleton不满足正式能力资格。
private字段records:ReadonlyMap<SdkOperation,CapabilityBindingRecord>、handles:registry、session:QualifiedSession|null；
create(records:readonly CapabilityBindingRecord[], client:SdkPublicClient):Outcome<SdkCapabilityBinding>。
SdkPublicClient是外部编译绑定位，必须取真实SDK export，缺type/能力则只创建blocked binding，不声明client call可用。
require(operation:SdkOperation):Outcome<BoundCapability>，BoundCapability={operation:SdkOperation; formalContractRef:string; qualificationRef:ExternalHandle<"binding">}；
status(operation:SdkOperation):CapabilityBindingRecord；
dispose():void清registry。
bound只能exact contract全部通过；blocked为缺合同；disabled为明确未启用；三者为装配资格快照，不在Step10制造持续业务状态机。qualifyHandle/qualifySession的blocked外部输入见§2.2。

### 9.2 SdkQueryAdapter

字段binding:SdkCapabilityBinding、client:SdkPublicClient，create(deps:SdkQueryAdapterDeps): SdkQueryAdapter注入。
完整方法为Step7 EntryAccessPort、CollaborationReadPort、IntentProbePort、SafeMaterialReadPort全部签名；本步固定对象职责与返回qualified local projection，参数/结果不得unknown。
每次先require(operation)，再调用已正式绑定export，mapper保留fence/source/visibility/fake；缺能力dependency_unbound。实现不重建owner投影，不持credential。

### 9.3 SdkCommandAdapter

同上两字段与factory。实现IntentCommandPort的prepare/dispatch，不在host runtime wiring中私造transport。
prepare返回formal idempotency association；dispatch开始后错误必须映射effect_unknown，只有正式保证无副作用才failed。
result qualification不把SDK transport ACK升为committed；Governance exact actor/Gate/action/receipt资格仍blocked。

### 9.4 SdkChangeAdapter

字段binding/client、subscriptions:Map<LocalId<"subscription">,ExternalHandle<"sdk_subscription">>；create(deps:SdkChangeAdapterDeps): SdkChangeAdapter。
实现ChangeFeedPort、ChangeQualificationPort、ResumePort的全部方法；dispose():Promise<Outcome<void>>停止正式订阅。
formal feed未绑定不得使用SDK skeleton openSubscription(unknown)或bus topic fallback。SDK为顺序/coverage authority；Chat consumed set只能补local duplicate控制。

### 9.5 SdkReferenceAdapter

字段binding/client；create(deps:SdkReferenceAdapterDeps): SdkReferenceAdapter。
实现SafeReferencePort的preview与safe locator映射；PreviewReference不保存raw URL；safe locator缺合同blocked durable。

### 9.6 DiagnosticHandoffAdapter

字段binding/client；create(deps:DiagnosticAdapterDeps): DiagnosticHandoffAdapter。
实现DiagnosticPort.send(input:DiagnosticContext,session:QualifiedSession):Promise<Outcome<DiagnosticHandoffView>>。
只有用户明确支持操作/本地允许的低敏诊断类别，allowlist无正文/secret/stack；缺sink返回disabled/blocked，不写文件日志伪handoff。

模块停审：adapter不是空泛“后续实现”；依赖/资格/返回面/失败语义当前闭口，完整port成员统一在Step7，避免重复签名漂移；exact export/wire仍CHAT-UP-001～007 blocked，不宣称bound。

## 10. platform/native_host模块：功能抽象与对象契约

| capability | 对象 | 字段/函数/状态 | 来源/后续 |
|---|---|---|---|
| 最小宿主资格 | PlatformCapabilityState、PlatformCapabilityAdapter | kind/availability/reason；probe/apply；CapabilityAvailability | host port |
| lifecycle | ShellLifecycleCoordinator | store/feed/recovery；consume | 连接不等于业务恢复 |
| AT/键盘/焦点 | AccessibilityState、AccessibilitySemanticAdapter | focus/motion/contrast/announcement；derive/move/announce | semantic port |
| status表达 | StatusAnnouncement、StatusAnnouncement组件 | local source/code/priority；factories | 不复制业务正文 |
| Desktop/preview | DesktopPlatformAdapter、WebPreviewPlatformAdapter | host binding/dispose；port实现 | 原生资格仍blocked |
| bounded IPC | HostBoundaryGuard、Host请求/响应 | origin/window/kind；validate/dispatch | 无owner IO |

### 10.1 PlatformCapabilityState

```ts
/** 宿主能力姿态，不授予业务权限。 */
interface PlatformCapabilityState {
  readonly platformKind: PlatformKind;
  readonly capabilities: ReadonlyMap<PlatformCapabilityKind, CapabilityAvailability>;
  readonly lifecyclePosture: ShellLifecyclePosture;
  readonly safeReason: SafeReasonCode | null;
}
/** 每能力独立资格，不是一个总available bool。 */
type CapabilityAvailability =
  /** 正式probe证明可用。 */ "available"
  /** 宿主策略/权限受限。 */ | "restricted"
  /** 宿主不提供。 */ | "unavailable"
  /** 需用户完成宿主动作。 */ | "needs_action"
  /** 尚未证明，fail-closed。 */ | "unknown";
/** 最小Desktop宿主能力集合。 */
type PlatformCapabilityKind =
  /** 窗口/背景/关闭生命周期。 */ "lifecycle"
  /** 经过批准的安全preview外部打开。 */ | "controlled_preview"
  /** 安全locator持久化及可靠清理。 */ | "safe_storage"
  /** 焦点与辅助技术语义。 */ | "accessibility";
/** 技术生命周期，不能决定owner结果。 */
type ShellLifecyclePosture = "foreground" | "background" | "closing" | "restarting" | "offline";
```

platformKind来自config，capabilities逐项正式host probe，没有probe为unknown；lifecycle来自bounded host event；safeReason有限code。
factory initial(platform:PlatformKind):PlatformCapabilityState全部unknown；
applyProbe(state:PlatformCapabilityState,result:PlatformProbeResult):Outcome<PlatformCapabilityState>；
applyLifecycle(state:PlatformCapabilityState,event:ShellLifecycleEvent):Outcome<PlatformCapabilityState>。
CapabilityAvailability variant表：unknown初始→probe五态；available→restricted/unavailable/needs_action/unknown；其余仅新probe→available等。PlatformCapabilityKind非状态；ShellLifecyclePosture来自对应前台/后台/关闭/重启/离线信号，不独立业务生命周期，matrix仅消费覆盖，不把closing当owner取消。

### 10.2 AccessibilityState

```ts
/** 等价键盘与AT语义；不更改业务姿态。 */
interface AccessibilityState {
  readonly focusTarget: FocusTarget | null;
  readonly reducedMotion: boolean;
  readonly highContrast: boolean;
  readonly announcement: StatusAnnouncement | null;
  readonly semanticRegions: readonly SemanticRegion[];
}
/** local可识别region与role，不包含隐藏subject标题。 */
interface SemanticRegion {
  readonly id: LocalId<"focus">;
  readonly region: FocusTarget["region"];
  readonly role: "navigation" | "main" | "complementary" | "status" | "dialog";
  readonly labelCode: SafeReasonCode | null;
}
```

focus/regions由PageRegistry+semantic assembler，motion/contrast来自合法宿主/用户local偏好，announcement从local姿态factory。role五variant是对应HTML/ARIA熟悉角色，非业务状态。
factory fromPage(page:ClientPageViewModel,platform:PlatformCapabilityState,preferences:AccessibilityPreferences):AccessibilityState；
moveFocus(state:AccessibilityState,target:FocusTarget):Outcome<AccessibilityState>要求target在regions且可见；
restoreFocus(state:AccessibilityState,previous:FocusTarget|null):AccessibilityState找不到回到安全主区域；
announce(state:AccessibilityState,announcement:StatusAnnouncement):AccessibilityState按local key去重。
AccessibilityPreferences={reducedMotion:boolean;highContrast:boolean}只local显示，不持owner preference truth。无全局A11y状态机。

### 10.3 StatusAnnouncement

```ts
/** 无正文状态公告，来源为local姿态，可重复消费去重。 */
interface StatusAnnouncement {
  readonly announcementId: LocalId<"announcement">;
  readonly sourceRef: LocalStateReference;
  readonly code: SafeReasonCode;
  readonly priority: "polite" | "assertive";
}
/** local来源引用，不能当owner result/evidence ref。 */
type LocalStateReference =
  /** attempt姿态变更。 */ { readonly kind: "attempt"; readonly id: LocalId<"intent"> }
  /** route/access姿态变更。 */ | { readonly kind: "route"; readonly id: LocalId<"route"> }
  /** continuity恢复变更。 */ | { readonly kind: "recovery"; readonly id: LocalId<"recovery"> };
```

factory fromAttempt(id:LocalId<"announcement">,attempt:CommandAttemptState):StatusAnnouncement；
fromContinuity(id:LocalId<"announcement">,state:ContinuityState,recovery:LocalId<"recovery">):StatusAnnouncement；
fromAccess(id:LocalId<"announcement">,access:AccessPosture,route:LocalId<"route">):StatusAnnouncement。
code由finite姿态映射，priority仅安全阻断需要即时关注时assertive，其他polite；两variant分别aria-live礼貌/即时，无生命周期。
StatusAnnouncement组件props={model:StatusAnnouncement|null}，只渲染i18n安全code文本，不引入业务确认。

### 10.4 PlatformCapabilityAdapter

字段platform:PlatformPort，create(platform:PlatformPort):PlatformCapabilityAdapter；
probe(kind:PlatformCapabilityKind):Promise<Outcome<PlatformProbeResult>>；
interpret(result:PlatformProbeResult):Outcome<CapabilityAvailability>；
方法先验证host契约资格，missing unknown/unavailable，不自动申请权限或授予command能力。

### 10.5 ShellLifecycleCoordinator

字段store:ClientStatePort、feeds:ChangeFeedPort、recovery:RecoveryCoordinator；create(deps:ShellCoordinatorDeps): ShellLifecycleCoordinator。
consume(event:ShellLifecycleEvent):Promise<Outcome<void>>：background/offline将来源stale、已dispatch非terminal保持unknown风险；foreground重probe/resolve/resume；closing停止feed与清理敏感内存；不会owner cancel/retry。

### 10.6 AccessibilitySemanticAdapter

字段port:AccessibilityPort，identity:LocalIdentityPort；create(deps:AccessibilityAdapterDeps): AccessibilitySemanticAdapter。
derive(page:ClientPageViewModel,platform:PlatformCapabilityState,prefs:AccessibilityPreferences):AccessibilityState；
focus(state:AccessibilityState,target:FocusTarget):Promise<Outcome<AccessibilityState>>；
announce(state:AccessibilityState,announcement:StatusAnnouncement):Promise<Outcome<AccessibilityState>>。
平台失败回到安全local focus，不把公告交付当业务成功。每message/Gate/preview/error有键盘可达与同一姿态说明。

### 10.7 DesktopPlatformAdapter

字段host:QualifiedHostBinding、windowRef:LocalId<"window">、subscriptions:集合；create(host:QualifiedHostBinding,window:LocalId<"window">):Outcome<DesktopPlatformAdapter>。
实现Step7 PlatformPort/LifecyclePort/AccessibilityPort的完整签名；dispose():Promise<Outcome<void>>。
QualifiedHostBinding={contractRef:string;capabilityRef:ExternalHandle<"host_capability">}仅native approved IPC registry提供。不可把Tauri invoke任意string作为公开port。

### 10.8 WebPreviewPlatformAdapter

字段documentBinding:LocalId<"document">、disposed:boolean；create(binding:LocalId<"document">):WebPreviewPlatformAdapter。
同platform/AT/lifecycle ports；safe_storage/controlled_preview明确unavailable，禁止浏览器localStorage/raw URL fallback。Web是预览面，fake与真实数据分离，不宣称Desktop qualification。

### 10.9 HostBoundaryGuard、HostCapabilityRequest与HostCapabilityResponse

位置src-tauri/src/platform.rs；Rust设计契约：

```rust
/// Minimal host request without business intents, owner content or secrets.
pub struct HostCapabilityRequest {
    /// Registered window; arbitrary callers are rejected.
    pub window_id: String,
    /// Allowlisted host capability; unknown variants are rejected.
    pub capability: HostCapabilityKind,
}
/// Minimal technical capabilities planned for this iteration.
pub enum HostCapabilityKind {
    /// Lifecycle probe without business submission.
    Lifecycle,
    /// Accessibility capability probe.
    Accessibility,
}
/// Safe host qualification result.
pub struct HostCapabilityResponse {
    /// Whether native window, origin and capability checks passed.
    pub allowed: bool,
    /// Finite safe code without exception stacks.
    pub reason_code: Option<HostBoundaryError>,
}
/// Checks window, origin and capabilities without arbitrary shell, file or network access.
pub struct HostBoundaryGuard {
    /// Window identifiers supplied by the approved composition.
    approved_windows: Vec<String>,
    /// Approved WebView origins from native configuration, never from request input.
    approved_origins: Vec<String>,
}
impl HostBoundaryGuard {
    /// Constructs from native configuration; empty or invalid windows block startup.
    pub fn new(approved_windows: Vec<String>, approved_origins: Vec<String>) -> Result<Self, HostBoundaryError>;
    /// Uses the origin from the trusted Tauri invocation context, never from request fields.
    pub fn validate(&self, request: &HostCapabilityRequest, trusted_origin: &str) -> Result<HostCapabilityResponse, HostBoundaryError>;
}
/// Technical denial without owner business error semantics.
pub enum HostBoundaryError {
    /// Window is not approved.
    WindowDenied,
    /// WebView origin is not approved.
    OriginDenied,
    /// Host capability is not enabled.
    CapabilityDenied,
}
```

HostCapabilityKind两variant都为probe，来源native main capability注册，无生命周期；controlled_preview/safe_storage正向IPC尚未闭合，当前不得添加对应执行variant。
HostBoundaryError三variant来源为validate相应检查→safe拒绝response，不透传raw exception。new校验两个非空allowlist，approved_origins来自native批准配置；validate逐项匹配可信invocation origin/window/capability，不解析request提供的origin。allowed=true时reason_code=None，拒绝allowed=false时reason_code为对应有限HostBoundaryError；无法取得可信origin则OriginDenied。origin确值由04正式hostProfile与native capability配置闭合，未有配置不能默认放行。 validate通过返回Ok(allowed=true)；拒绝返回Err，由宿主响应映射器转换为allowed=false及同一有限reason_code，禁止在Err后执行能力。
main/lib只建Tauri app、注入guard、注册已批准handler，不含SDK或业务backend；main.json exact权限Step14/04闭合。native qualified origin规则未验证，不宣称宿主可用。

模块停审：能力逐项资格、AT来源、props、adapter/native边界闭合；safe_storage/preview执行资格blocked；无Mobile实现计划扩张。

## 11. config/app模块：功能抽象与对象契约

| 模块/capability | 对象 | 字段与函数/状态来源 | 闭口决定 |
|---|---|---|---|
| config typed启动 | ClientConfig、ConfigLoader | profile/limits/binding refs；load/validate | 稳定schema当前闭口，数值/版本Step14 |
| app装配 | ApplicationComposition | config/store/coordinators/dispose | 当前闭口，无global service locator |
| 路由注册 | ClientRoutes、PageRegistry | route kind→entry/component/semantic id | 当前闭口，不携带raw link body |
| React订阅 | ClientStateBinding、ClientApplicationShell | immutable selector/callback props | 当前闭口，effects只订阅释放 |

### 11.1 ClientConfig

```ts
/** 只装配客户端能力与限制，不能改变truth/guard。 */
interface ClientConfig {
  readonly schemaVersion: 1;
  readonly platform: "desktop" | "web_preview";
  readonly sdkProfileRef: string;
  readonly hostProfileRef: string | null;
  readonly maxTextUnits: number;
  readonly maxAttachmentRefs: number;
  readonly maxCachedEntries: number;
  readonly maxConsumedChanges: number;
  /** local搜索、消费槽位和图大小上限，确值交04。 */
  readonly maxDirectoryQueryUnits: number;
  readonly maxConsumptionContexts: number;
  readonly maxVisibleProcessNodes: number;
  readonly maxVisibleProcessEdges: number;
  readonly memoryOnly: true;
  readonly diagnosticMode: "disabled" | "formal_low_sensitivity";
}
```

profile_ref为非空受限配置引用，无raw endpoint/secret；正safe integer limits由04闭合确值，不能无界；memoryOnly本轮true。platform两variant为Desktop/预览，无mobile；diagnostic disabled不发、formal_low_sensitivity需SDK正式sink资格。字段来源ConfigLoader批准输入，不从SDK结果配置权限。
factory validate(input:unknown):Outcome<ClientConfig>由strict parser处理未知键/类型/上限，unknown只用于本地配置parse，不允许SDK业务DTO unknown。secret/关闭guard/raw persistence键拒绝。

### 04反向校准：外部JSON与既有ClientConfig映射（2026-10-01）

当前运行对象仍为上述14字段；函数签名不变。LocalConfigSource.read返回LocalConfigInput，value为批准source解析所得八域普通对象（app/sdk/platform/intents/local_state/continuity/collaboration/diagnostic），不是flat ClientConfig或网络业务DTO。source适配器从JSON文本形成value前必须拒绝重复键、注释、非JSON数值和危险prototype键，不能先丢重复信息再校验；测试注入对象同样只允许plain data属性，不得含getter/函数/prototype污染。

ConfigLoader.load先校验外壳schemaVersion/profileId与04批准catalog，再validate(value)。validate只接八域模块形状：根与各域unknown键、null/数组/类型coercion均拒绝；所有八域必填，仅app.schemaVersion/local_state.memoryOnly/diagnostic.mode缺叶子可分别补1/true/disabled。显式非法值不以默认覆盖；其它11叶子必填。pure normalize只把下表映射为flat字段，不创建authority；全部类型、范围、交叉字段通过后一次生成immutable ClientConfig，不保留半有效配置。

| 外部JSON路径 | ClientConfig字段 |
|---|---|
| app.schemaVersion | schemaVersion |
| app.platform | platform |
| sdk.profileRef | sdkProfileRef |
| platform.hostProfileRef | hostProfileRef |
| intents.maxTextUnits | maxTextUnits |
| intents.maxAttachmentRefs | maxAttachmentRefs |
| local_state.maxCachedEntries | maxCachedEntries |
| local_state.memoryOnly | memoryOnly |
| continuity.maxConsumedChanges | maxConsumedChanges |
| continuity.maxConsumptionContexts | maxConsumptionContexts |
| collaboration.maxDirectoryQueryUnits | maxDirectoryQueryUnits |
| collaboration.maxVisibleProcessNodes | maxVisibleProcessNodes |
| collaboration.maxVisibleProcessEdges | maxVisibleProcessEdges |
| diagnostic.mode | diagnosticMode |

profileId由批准composition/source选择，无CLI/env/UI路径输入；与platform、SDK/host正式profile匹配，未知catalog拒绝。desktop hostProfileRef为非空非敏感alias，web_preview必须显式null；schemaVersion外壳与app均1。ref格式/八数字精确范围以当前04 §6/§7/§9为唯一配置语义来源；正式SDK/host registry匹配与资格校验独立，不把合法alias当bound。

maxTextUnits/maxDirectoryQueryUnits在原safe输入以JS string.length（UTF-16 code units）计量，不trim/normalize/coerce或截断；maxAttachmentRefs为引用数组元素数。其余资源单位按04与本节绑定点；过Process节点/边预算返回unsupported_material，不把残缺拓扑设为ready；图/列表同safe材料。数值guard不改变owner发送上限、业务状态或sourcecoverage，达consumed容量仍先失效source再正式重取。

配置结构/范围/profile分支非法返回invalid_input并阻止装配；source不可读使用已有storage_unavailable安全blocked启动；合格config下正式SDK/native资格缺失使用dependency_unbound，只封锁相关能力，禁止fake fallback。无hot/reload/remote/admin覆盖；profile变更必须dispose旧composition（hide/invalidate→stop/unsubscribe→clear）后建立新epoch，不复用旧refs/slots/unknown命令或本地稿；诊断仍默认disabled六字段，不增加日志/审计输出。


### 11.2 ConfigLoader

字段source:LocalConfigSource；create(source:LocalConfigSource):ConfigLoader。
load():Promise<Outcome<ClientConfig>>；validate(input:unknown):Outcome<ClientConfig>。
LocalConfigSource port在Step7定义，返回§19 LocalConfigInput，禁止网络endpoint/secret读取。失败进入blocked启动面，不带半有效config。配置source优先级/default数值Step14/04，不能实现侧臆定生产默认。

### 11.3 ApplicationComposition

字段config:ClientConfig、store:ClientStateStore、navigation:RouteContextCoordinator、collaboration:CollaborationSurfaceCoordinator、projects:ProjectContextCoordinator、process:ProcessDrilldownCoordinator、directory:DirectoryCoordinator、intents:UserIntentCoordinator、continuity:ChangeReducer、resumes:ResumeCoordinator、recovery:RecoveryCoordinator、platform:PlatformCapabilityAdapter、accessibility:AccessibilitySemanticAdapter、sdkBinding:SdkCapabilityBinding。新增三coordinator由同composition注入，禁止页面自行构造SDK client。
factory create(config:ClientConfig,binding:SdkCapabilityBinding,platform:PlatformPort,identity:LocalIdentityPort):Outcome<ApplicationComposition>。
dispose():Promise<Outcome<void>>依次invalidate fence、stop feed、cancel read、unsubscribe UI/host、clear memory；command取消不声明owner无副作用。
所有dependency来自factory显式注入，未bound能力保留typed blocked adapters。无隐藏raw client access给组件。

### 11.4 ClientRoutes

字段definitions:ReadonlyMap<RouteKind,RouteDefinition>；
RouteDefinition={kind:RouteKind;page:"entry"|"conversation"|"thread"|"project_list"|"project_detail"|"company_directory"|"recovery";requiresFormalParent:boolean}。七page variant为同名planned entry，非状态。
factory create():ClientRoutes；resolve(kind:RouteKind):Outcome<RouteDefinition>。
七route分别注册安全页（recovery使用RecoveryStatus在shell中）；thread requiresFormalParent=true。顶层对话/项目/成员；project_list→project_detail五标签，progress不是独立顶层RouteKind。company_directory是成员入口，Member状态单独section，不充当公司目录。
group/channel/dm是formal entryKind而非三套独立业务route；route外部编码/SDK深链解析合同未定时不发明URL path。

### 11.5 PageRegistry

定义于`src/app/page_registry.tsx`的唯一页面组合输入：

```ts
/** app只读页面组合，source状态仍由各model维护。 */
type ClientPageViewModel =
  /** group/channel/dm/thread共用的Conversation页面。 */ { readonly kind: "conversation"; readonly model: ConversationPageViewModel }
  /** 获准Work项目列表。 */ | { readonly kind: "project_list"; readonly model: LocalPage<SafeMaterialSnapshot> }
  /** 项目五标签，包含只读Process图/列表。 */ | { readonly kind: "project_detail"; readonly model: ProjectDetailViewModel }
  /** 正式provider目录页。 */ | { readonly kind: "company_directory"; readonly model: CompanyDirectoryViewModel };
```

四variant均来自当前route同store版本的safe projection，非状态分类；去向为对应page entry及semantic adapter，无跨ownertruth。恢复/blocked面由各model姿态或shell fallback派生，不恢复缓存授权。

platform仅type-only引用此union，不能import PageRegistry或app composition运行期实现；semantic adapter纯派生安全region，无反向装配。collaboration纯model同样不import React/app实例。

字段routes:ClientRoutes、semanticIds:ReadonlyMap<FocusTarget["region"],LocalId<"focus">>；factory create(routes:ClientRoutes,identity:LocalIdentityPort):PageRegistry。
render(model:ConversationPageViewModel,actions:PageActions):ReactElement；
renderEntry(model:EntryViewModel,onEnter:(entry:ExternalHandle<"entry">)=>Promise<Outcome<void>>):ReactElement；
renderProjectList(props:Readonly<ProjectListPageProps>):ReactElement；
renderProjectDetail(props:Readonly<ProjectDetailPageProps>):ReactElement；
renderCompanyDirectory(props:Readonly<CompanyDirectoryPageProps>):ReactElement；
semanticRegions(route:RouteKind):readonly SemanticRegion[]。
未知/blocked/hidden route只render安全state；no owner IO。

### 11.6 ClientStateBinding

字段store:ClientStatePort；create(store:ClientStatePort):ClientStateBinding。
useSnapshot<T>(selector:(snapshot:ClientSnapshot)=>T):T采用React useSyncExternalStore语义，read/getSnapshot稳定，同version selector不触发布局漂移；unbind:subscribe返回函数，dispose清理。
不选择状态库作为隐含必要依赖；显式immutable store已满足contract，后续可在不改语义条件下选库，精确版本Step14。

### 11.7 ClientApplicationShell

Props={composition:ApplicationComposition;registry:PageRegistry;binding:ClientStateBinding}；
组件函数(props:Readonly<ClientApplicationShellProps>):ReactElement。
调用selector→assembler→page，生命周期effect只订阅/释放；submit必须显式用户callback，React strict mount/effect不触发command。
加载/错误/hidden/empty/partial/stale/offline/unknown各状态通过已定义models表示，不加GlobalState。

模块停审：non-core对象当前闭口，配置limits与版本后续精化，所有entry/deps有来源；pass_with_upstream_blockers。

## 12. 跨模块字段、状态、命名与构造审计

| 对象组 | 已闭合来源 | 后续必须闭合 | 实现暂停条件 |
|---|---|---|---|
| refs/session/fence/consumption | SDK registry/local epoch/actor及source消费代次 | Step7 exact exports/authority/current slot | raw cast/fake=false冒充资格 |
| materials/Turn/surface/page | safe read+composer+same-version store | Step8投影输入/分页；Step9 assembly | raw body/missing provenance/visibility |
| project/navigation/flow/node | Work入口、Process拓扑/状态/关联、独立ownersection、local选择 | Step7具名读取、Step8输入映射、Step9下钻 | CHAT-UP-008；原型/日志自造图/父版本错配 |
| relationship/directory | provider正式关系/覆盖、逐目标access、搜索/page lineage | Step7 provider/export、Step8 safe页 | CHAT-UP-009；成员并集/群聊权限当项目授权 |
| draft/attempt/result gate | 用户input/local revision/SDK association/formal authority | Step7 command/probe；Step8 result/receipt；Step10条件矩阵 | ACK success/unknown重放 |
| continuity/resume/acceptance | formal资格/opaque cursor/local consumed set | Step7 qualifier/resume；Step8 envelope | 自比较cursor或arrival time排序 |
| store/projection/eviction | read local version/guard/repository delete result | Step11一致性；Step14 storage资格 | durable未qualified/删除未确认 |
| sdk/platform/native | explicit deps/qualification registry/host trusted context | exact binding仍blocked；Step14配置 | skeleton unknown当可用 |
| config/app/UI/AT | validated source/local registry/pure models/callback | Step14数值版本；Step16测试 | UI业务IO/隐藏正文公告 |

| 状态族 | 唯一类型/主语 | 初始/关键迁移 | 后续 |
|---|---|---|---|
| route/access | RoutePhase/AccessAvailability | unresolved/blocked→formal验证；撤销收紧 | Step10 §route/access |
| selection | SelectionPhase | empty→qualified selected→stale/cleared | Step10 |
| consumption | ConsumptionContextPosture | qualified active→invalidated→cleared；新请求另建代次 | Step10 |
| project/flow/node/links/directory load | PageLoadPosture | loading→ready/partial；版本stale；缺资格blocked；撤销清引用 | Step10 |
| draft/attempt | DraftPhase/CommandResultPosture | empty/draft→submit→formal terminal或unknown | Step10 |
| source/disclosure | FreshnessState/DisclosurePosture | unknown/unavailable→formal材料；local收紧 | Step10 |
| continuity | ContinuityPhase | stale/blocked→formal resume→fresh | Step10 |
| projection | LocalProjectionState | absent/cached→restore/evict→confirmed clear | Step10 |
| platform | CapabilityAvailability | unknown→formal probe | Step10 |
| 非状态类型 | categories/ref/DTO/records/policy decisions | 分类或不可变一次判定，无循环 | Step10筛选排除 |

字段条件审计：confirmed必须matched committed authority及业务resultRef或明确业务确认receiptRef；submitting必须intent+draft revision；fresh必须该source正式revision/coverage；resuming必须activeRecovery且same source/context；resolved必须scope，对话/thread另须context，项目/目录不伪造context；visible/redacted必须qualified content/provenance；cleared须对应引用/内存清理或repository删除确认，不混用。active消费context须actor/scope/target/source/visibility/当前代次齐备。
所有高复用字段有唯一类型归属；ConversationSurfaceViewModel与Page不同；DraftStore复用root，不复制；ResumeContext canonical只在continuity。

## 13. Step7承接、回填与门禁

| Step7契约组 | 必须承接 | 要求/blocker |
|---|---|---|
| state/draft/projection | CAS version、读取、partition、list、delete result | 读写配对，不以owner cursor作version |
| entry/collaboration/material | fence、access-first、safe projection、分页 | exact SDK缺失则dependency_unbound |
| project/process/directory/links | LoadProjectList/LoadProjectDetail/LoadProjectProcessFlow/LoadStageProcessFlow/LoadProcessNodeDetail/LoadProjectConversationLinks/LoadCompanyDirectory/LoadMemberContext | Step7未写批次waiting；CHAT-UP-008/009，逐source/target/page lineage；非SDK已导出方法 |
| command/probe | prepare association、dispatch边界、formal result authority | CHAT-UP-001/003 |
| change/resume | qualification、identity/source/cursor/coverage、single-flight | CHAT-UP-002；不能bus fallback |
| ref/preview/locator | authorized preview、safe serializer | CHAT-UP-004/storage资格 |
| platform/AT/config/identity | bounded host接口、local ID、strict config | host与配置确值Step14 |
| diagnostic | low敏allowlist+formal sink | CHAT-UP-007，不实现backend |

回填草稿：未来03 §5每模块对象契约使用本文件§3～11；§6索引引用本文件所有独立对象与唯一定义路径。§9状态来源为§12，不把分类强行状态化。当前不写formal03。

取舍/复杂度：保留显式immutable store避免额外状态框架依赖；opaque内存registry避免伪造wire schema，但只能在exact SDK export绑定后实现正向；durable默认关闭，恢复仍可通过formal owner query完成。测试切口均planned，不是run/result。

待确认：外部契约保持CHAT-UP-*、WS-UP-*、CHAT-DDD-003-DEP-001、CHAT-DDD-004-PLAT-001；Step11～18与04～07未执行。本步通过范围是Chat-local对象与受限失败分支；不宣称positive integration readiness。

### 13.1 2026-10-01逐模块重审记录

| 串行模块 | 修复/核对 | 本轮局部门禁 |
|---|---|---|
| shared/materials | TS lowerCamelCase；registry资格与结构类型分离；Process owner；scope/source披露裁剪 | pass_with_upstream_blockers；正式export未绑定 |
| navigation | actor/session fence、项目/目录route、ClientConsumptionContext独立字段/函数/状态 | pass_with_upstream_blockers；active不是授权 |
| collaboration | 六独立对象、三coordinator、六页面/组件props、图与等价列表；Surface唯一Turn集合 | pass_with_upstream_blockers；CHAT-UP-008/009 |
| intents | 普通receipt/ACK无terminal资格；业务确认receipt才经gate；unknown不自动重发；按确认revision清稿 | pass_with_upstream_blockers；CHAT-UP-001/003 |
| continuity | 各source消费槽位/连续性，late不推进cursor，revoke先失效清理；无跨owner全局版本 | pass_with_upstream_blockers；CHAT-UP-002/008 |
| local_state | source分区map、consumer槽位、新page slice；导航/selection唯一local根可写；memory默认 | pass_with_upstream_blockers；locator/durable未验证 |
| sdk | 八operation仅local名称；按正式provider qualification；skeleton不能bound | pass_with_upstream_blockers；CHAT-UP-001～009 |
| platform/native_host | probe-only IPC/受控preview/storage资格；Process/目录键盘AT等价；TS/Rust命名分域 | pass_with_upstream_blockers；host资格未验证 |
| config/app | 搜索/图/槽位limits、三coordinator注入、项目/目录page registry | pass_with_upstream_blockers；默认值/版本待04 |
| 跨模块 | 02 §6.28～34七对象唯一归属；target/source/代次及状态表一致；Step7承接列名 | pass_with_upstream_blockers；Step7未完成 |

证据只有设计静态核对和真实SDK skeleton读取；测试切口全部planned，未运行/未产生测试报告、验收或readiness。CHAT-BASE-001继承：只使用实际AC-NFR001～007、NFR001～024及AC-FR011～014，不引用未定义AC-NFR008～024。正式03仍historical_material；只校正Step7已写前缀后停审。

### 13.2 Step5～10新授权的启动核对与补齐计划

本节是新一轮启动核对；§13.1及文件头done记录上一轮重审结论，不代表以下新增粒度检查已经通过。当前Step6参考粒度复核未收口，不以历史pass直接进入Step7。

参考Governance Step6 §7独立对象模板、§15.7应用carrier、§17字段/状态闭环、§20进入Step7条件。已有Chat独立VM/状态/工厂/字段来源原位承接；支撑carrier只命名后交给Step8的情况，必须先建立明确归属和schema，不能让实现端临时定义。

| 串行补齐批次 | 当前已具备 | 必须进一步闭口 | 后续接缝 |
|---|---|---|---|
| 6-A navigation/read | Route/Access/ContextFence/ClientConsumptionContext | EnterRouteInput、EntryAccessResult、EntryReadInput、SurfaceReadInput、TurnPageInput及safe read projection的字段/可选性/来源/失败；入口resolve在fence尚未建立时的资格载体 | Step7 EntryAccessPort/CollaborationReadPort |
| 6-B project/process/directory | 六VM、safe topology/association/directory helper、三coordinator | 各查询的actor/scope/target/source/current slot/query lineage、父拓扑版本与独立section结果载体；每factory必填字段由正式输入满足 | Step7具名Load*读取面，正向SDK仍blocked |
| 6-C intent/result | Draft/Attempt/Gate/Feedback及有限状态 | ConversationIntentInput、GovernanceIntentInput、ExplicitRetryInput、IntentCapabilityView、CommandSubmission、CommandReceiptView、FormalResultMaterial、FormalProbeResult完整local schema；业务确认资格与dispatch disposition | Step7 command/prepare/probe/result qualification |
| 6-D continuity/recovery | source分区store、Continuity/Resume/Acceptance/Recovery | FormalChangeView、ChangeQualification、VisibilityChangeView、ResumeInput/ResultView、RestoreInput/RecoveryActionInput及typed影响范围；scope撤销不依赖已关闭node slot | Step7 feed/qualifier/resume/eviction |
| 6-E platform/config/diagnostic | Platform/AT/native probe-only/config limits | PlatformProbeResult、ShellLifecycleEvent、PreviewResultView、DiagnosticContext/HandoffView、config source carrier；真实host/provider未确认不定义假成功输入 | Step7 Platform/Lifecycle/Accessibility/Reference/Diagnostic/Config ports |
| 6-F 跨模块审计 | 唯一root/CAS消费checks及字段状态表 | carrier归属索引、字段→factory/method映射、各factory状态必填条件、fake/real隔离、Step7逐能力承接 | local缺口关闭后才通过Step6并续写Step7 |

历史诊断（6-A开工时）：CHAT-DDD-006-CARRIER-001曾为open_design，现已由§15～20补齐并closed_design；属于Chat-local支撑类型/构造路径闭口，不等同于上游SDK合同缺口。外部wire/type/export只能引用SDK正式输入，无法绑定时保持CHAT-UP-* blocked；不能因SDK未闭合省略本地失败载体，也不能为填字段私造SDK truth。

本次准备已确定原位补齐顺序与Governance参考结构；六批次目前均planned/not_executed。执行时每组写字段/工厂/成员/variant并独立停审，再同步§12/13和flow/ledger。Step7～10依次执行，不预建未来Step文件；未实现、未测试、不提交。

## 14. 本轮carrier闭口执行台账

| 批次 | 当前状态 | 局部门禁 |
|---|---|---|
| 6-A navigation/read | done | 入口resolve前资格与safe query/page carrier；pass_with_upstream_blockers |
| 6-B project/process/directory | done | 独立source/父版本/section读取面；pass_with_upstream_blockers |
| 6-C intent/result | done | dispatch/correlation/正式业务authority；pass_with_upstream_blockers |
| 6-D continuity/recovery | done | qualifier/revoke/source coverage；pass_with_upstream_blockers |
| 6-E platform/config/diagnostic | done | host/受控preview/低敏allowlist闭口；正向blocked |
| 6-F cross audit | done | §20 schema/字段/调用/状态闭包；local缺口closed_design |

载体闭口纪律：factory声明是planned TS契约，SDK qualification由私有registry检查，不以typed结构/fake=false授予权限。下列每对象独立卡片给类型/字段来源/工厂/不变量；immutable input/output不另造生命周期。可执行factory只校验本地结构，正向外部mapper未绑定时必须dependency_unbound。TS中的union分类逐variant来源见各卡片说明，不作为owner状态机。

## 15. 6-A navigation/read载体

### EntryResolutionFence

职责：入口resolve前的本地请求隔离。唯一定义路径：src/navigation/entry_guards.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 入口resolve前的本地请求隔离。 */
interface EntryResolutionFence {
  /** 来自可信QualifiedSession；切session失效 */ readonly sessionEpoch: SessionEpoch;
  /** 来自正式session actor，不解析token */ readonly actorRef: ExternalHandle<"actor">;
  /** 本地route factory标识 */ readonly routeId: LocalId<"route">;
  /** root当前route代次，非负safe integer */ readonly generation: number;
  /** 用户切scope时的正式候选，无候选则null */ readonly requestedScopeRef: ExternalHandle<"scope"> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| sessionEpoch | SessionEpoch | 来自可信QualifiedSession；切session失效 |
| actorRef | ExternalHandle<"actor"> | 来自正式session actor，不解析token |
| routeId | LocalId<"route"> | 本地route factory标识 |
| generation | number | root当前route代次，非负safe integer |
| requestedScopeRef | ExternalHandle<"scope"> \| null | 用户切scope时的正式候选，无候选则null |

工厂完整签名：EntryResolutionFenceFactory.create(input: EntryResolutionFence): Outcome<EntryResolutionFence>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：只允许等值核对，不要求尚未取得的ContextFence；结果scope不匹配显式requestedScopeRef拒绝。


### EnterRouteInput

职责：解析对话/项目/目录入口的typed输入。唯一定义路径：src/navigation/entry_guards.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 解析对话/项目/目录入口的typed输入。 */
interface EnterRouteInput {
  /** 当前可信session及route生成的预解析fence */ readonly requestFence: EntryResolutionFence;
  /** page registry七种安全route */ readonly kind: RouteKind;
  /** 已qualify对话入口候选；非对话null */ readonly entryCandidate: ExternalHandle<"entry"> | null;
  /** 项目/目录正式目标候选，不反推scope */ readonly targetCandidate: OwnerReference | null;
  /** 仅SDK正式safe locator，缺serializer禁止恢复 */ readonly restorationCandidate: RestorationHint | null;
  /** 当前安全local返回候选，返回需再验 */ readonly returnContext: ReturnContext | null;
  /** local路由来源/结构检查，不是authority */ readonly provenance: DeepLinkProvenance;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| requestFence | EntryResolutionFence | 当前可信session及route生成的预解析fence |
| kind | RouteKind | page registry七种安全route |
| entryCandidate | ExternalHandle<"entry"> \| null | 已qualify对话入口候选；非对话null |
| targetCandidate | OwnerReference \| null | 项目/目录正式目标候选，不反推scope |
| restorationCandidate | RestorationHint \| null | 仅SDK正式safe locator，缺serializer禁止恢复 |
| returnContext | ReturnContext \| null | 当前安全local返回候选，返回需再验 |
| provenance | DeepLinkProvenance | local路由来源/结构检查，不是authority |

工厂完整签名：EnterRouteInputFactory.create(input: EnterRouteInput): Outcome<EnterRouteInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：conversation/thread必须entryCandidate或正式restorationCandidate；project_detail必须Work目标候选或正式locator；list/directory可先用正式scope入口resolve。互斥候选禁止私造链接/owner ref。


### EntryAccessResult

职责：SDK正式入口资格的本地safe结果。唯一定义路径：src/navigation/entry_guards.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** SDK正式入口资格的本地safe结果。 */
interface EntryAccessResult {
  /** 正式入口resolver映射的route类别 */ readonly kind: RouteKind;
  /** adapter核对预解析请求后由正式actor/scope结果建立；拒绝时null */ readonly fence: ContextFence | null;
  /** 正式可披露入口ref，hidden时null */ readonly entryRef: ExternalHandle<"entry"> | null;
  /** 正式可披露项目/provider目标；hidden时null */ readonly targetReference: OwnerReference | null;
  /** 仅thread正式parent关系 */ readonly parentContext: ExternalHandle<"context"> | null;
  /** 正式读取来源，未绑定时null */ readonly sourceRef: ExternalHandle<"source"> | null;
  /** formal access/visibility/capabilities映射，不由角色猜 */ readonly access: AccessPosture;
  /** 有限安全缺口code，无hidden标题 */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| kind | RouteKind | 正式入口resolver映射的route类别 |
| fence | ContextFence \| null | adapter核对预解析请求后由正式actor/scope结果建立；拒绝时null |
| entryRef | ExternalHandle<"entry"> \| null | 正式可披露入口ref，hidden时null |
| targetReference | OwnerReference \| null | 正式可披露项目/provider目标；hidden时null |
| parentContext | ExternalHandle<"context"> \| null | 仅thread正式parent关系 |
| sourceRef | ExternalHandle<"source"> \| null | 正式读取来源，未绑定时null |
| access | AccessPosture | formal access/visibility/capabilities映射，不由角色猜 |
| reason | SafeReasonCode \| null | 有限安全缺口code，无hidden标题 |

工厂完整签名：EntryAccessResultFactory.create(input: EntryAccessResult): Outcome<EntryAccessResult>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：available/read_only必须fence/source/access.visibilityRef齐备，对话另需fence.contextRef；scope和actor来自正式SDK。hidden清ref/fence/source/parent，结果不携带正文。


### QualifiedEntryResolution

职责：入口验证专用资格包。唯一定义路径：src/navigation/entry_guards.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 入口验证专用资格包。 */
interface QualifiedEntryResolution {
  /** 原请求关联保持不改写 */ readonly requestFence: EntryResolutionFence;
  /** 正式resolver资格registry */ readonly authorityRef: ExternalHandle<"source_authority">;
  /** 完整safe结果，由正式adapter映射 */ readonly projection: EntryAccessResult;
  /** fixture与正式registry来源，生产不接受fake */ readonly fake: boolean;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| requestFence | EntryResolutionFence | 原请求关联保持不改写 |
| authorityRef | ExternalHandle<"source_authority"> | 正式resolver资格registry |
| projection | EntryAccessResult | 完整safe结果，由正式adapter映射 |
| fake | boolean | fixture与正式registry来源，生产不接受fake |

工厂完整签名：QualifiedEntryResolutionFactory.create(input: QualifiedEntryResolution): Outcome<QualifiedEntryResolution>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不复用需要已建立ContextFence的QualifiedMaterial；验证请求session/actor/route/generation后才构造目标fence。late/context mismatch不进入root。


### ConsumptionRequest

职责：已获入口后的单source请求载体。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 已获入口后的单source请求载体。 */
interface ConsumptionRequest {
  /** root登记的消费槽位，不能生成后替换incoming代次 */ readonly slotId: LocalId<"consumer_slot">;
  /** current active actor/scope/project/target/source/visibility/requestGeneration */ readonly context: ClientConsumptionContext;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| slotId | LocalId<"consumer_slot"> | root登记的消费槽位，不能生成后替换incoming代次 |
| context | ClientConsumptionContext | current active actor/scope/project/target/source/visibility/requestGeneration |

工厂完整签名：ConsumptionRequestFactory.create(input: ConsumptionRequest): Outcome<ConsumptionRequest>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：slotId绑定root当前context；输入无credential/query任意路径；所有已获资格读/intent/consumer引用这一carrier。


### LocalPageRequest

职责：safe query分页输入。唯一定义路径：src/collaboration/conversation_surface_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** safe query分页输入。 */
interface LocalPageRequest {
  /** validated config允许的positive safe integer */ readonly limit: number;
  /** 前页qualified正式游标，第一页null */ readonly cursor: ExternalHandle<"page_cursor"> | null;
  /** cursor非null必须有SDK正式query lineage */ readonly lineageRef: ExternalHandle<"page_lineage"> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| limit | number | validated config允许的positive safe integer |
| cursor | ExternalHandle<"page_cursor"> \| null | 前页qualified正式游标，第一页null |
| lineageRef | ExternalHandle<"page_lineage"> \| null | cursor非null必须有SDK正式query lineage |

工厂完整签名：LocalPageRequestFactory.create(input: LocalPageRequest): Outcome<LocalPageRequest>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：每页绑定同actor/scope/target/source/query/filter与当前消费代次；SDK未提供lineage不能造本地ref。


### LocalPageInfo

职责：SDK safe页边界与覆盖解释。唯一定义路径：src/collaboration/conversation_surface_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** SDK safe页边界与覆盖解释。 */
interface LocalPageInfo {
  /** SDK正式下一页边界 */ readonly nextCursor: ExternalHandle<"page_cursor"> | null;
  /** 来自同正式query分页，不解析cursor */ readonly lineageRef: ExternalHandle<"page_lineage"> | null;
  /** 只映射正式provider语义 */ readonly hasMore: boolean;
  /** 正式safe scope覆盖解释；三variant非状态 */ readonly coverage: "complete" | "partial" | "unknown";
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| nextCursor | ExternalHandle<"page_cursor"> \| null | SDK正式下一页边界 |
| lineageRef | ExternalHandle<"page_lineage"> \| null | 来自同正式query分页，不解析cursor |
| hasMore | boolean | 只映射正式provider语义 |
| coverage | "complete" \| "partial" \| "unknown" | 正式safe scope覆盖解释；三variant非状态 |

工厂完整签名：LocalPageInfoFactory.create(input: LocalPageInfo): Outcome<LocalPageInfo>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：hasMore/nextCursor合法组合取SDK正式合同；不能凭items长度/游标字符串/总人数推覆盖；hidden/blocked下一页ref清null。


### ReadSurface

职责：safe read缺失/访问/水位姿态。唯一定义路径：src/collaboration/conversation_surface_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** safe read缺失/访问/水位姿态。 */
interface ReadSurface {
  /** visible/empty仅正式可读，not_visible正式hidden，missing仅可披露正式缺失，unavailable依赖失效，blocked缺合同 */ readonly status: "visible" | "empty" | "not_visible" | "missing" | "unavailable" | "blocked";
  /** 独立正式入口/页面access seed，空页仍需 */ readonly access: AccessPosture;
  /** 当前source正式水位，未确认unknown */ readonly freshness: FreshnessMarker;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| status | "visible" \| "empty" \| "not_visible" \| "missing" \| "unavailable" \| "blocked" | visible/empty仅正式可读，not_visible正式hidden，missing仅可披露正式缺失，unavailable依赖失效，blocked缺合同 |
| access | AccessPosture | 独立正式入口/页面access seed，空页仍需 |
| freshness | FreshnessMarker | 当前source正式水位，未确认unknown |

工厂完整签名：ReadSurfaceFactory.create(input: ReadSurface): Outcome<ReadSurface>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：status六variant是不可变读判定而非生命周期；empty不等于missing，404不能自动missing。not_visible/blocked不得带items/ref/cursor，missing只按正式允许披露。


### EntryReadInput

职责：Conversation入口安全列表查询。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** Conversation入口安全列表查询。 */
interface EntryReadInput {
  /** 已验证对话列表scope/source槽位 */ readonly request: ConsumptionRequest;
  /** 当前query分页资格 */ readonly page: LocalPageRequest;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 已验证对话列表scope/source槽位 |
| page | LocalPageRequest | 当前query分页资格 |

工厂完整签名：EntryReadInputFactory.create(input: EntryReadInput): Outcome<EntryReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不能本地制造workspace unread/pin truth；SDK未绑定dependency_unbound。


### SurfaceReadInput

职责：Conversation/group/channel/dm/thread页面安全查询。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** Conversation/group/channel/dm/thread页面安全查询。 */
interface SurfaceReadInput {
  /** 当前context/source消费槽位 */ readonly request: ConsumptionRequest;
  /** 正式Conversation语境 */ readonly contextRef: ExternalHandle<"context">;
  /** thread必须正式parent，对话其他类型null */ readonly parentContext: ExternalHandle<"context"> | null;
  /** 正式历史分页输入 */ readonly page: LocalPageRequest;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前context/source消费槽位 |
| contextRef | ExternalHandle<"context"> | 正式Conversation语境 |
| parentContext | ExternalHandle<"context"> \| null | thread必须正式parent，对话其他类型null |
| page | LocalPageRequest | 正式历史分页输入 |

工厂完整签名：SurfaceReadInputFactory.create(input: SurfaceReadInput): Outcome<SurfaceReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：context必须与request.context.fence.contextRef等值；thread-parent由SDK证明，不读ref字符串。


### TurnPageInput

职责：当前Conversation后续safe Turn页查询。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 当前Conversation后续safe Turn页查询。 */
interface TurnPageInput {
  /** 同当前safe surface的消费槽位 */ readonly request: ConsumptionRequest;
  /** 当前正式Conversation context */ readonly contextRef: ExternalHandle<"context">;
  /** 前页cursor/lineage，非首请求 */ readonly page: LocalPageRequest;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 同当前safe surface的消费槽位 |
| contextRef | ExternalHandle<"context"> | 当前正式Conversation context |
| page | LocalPageRequest | 前页cursor/lineage，非首请求 |

工厂完整签名：TurnPageInputFactory.create(input: TurnPageInput): Outcome<TurnPageInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：分页不是重发业务命令，late不覆盖新context，正式顺序不得本地timestamp排序。


### TurnSafeProjection

职责：正式Turn的Chat安全渲染输入。唯一定义路径：src/collaboration/conversation_surface_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式Turn的Chat安全渲染输入。 */
interface TurnSafeProjection {
  /** 获准正式Turn ref */ readonly turnRef: ExternalHandle<"turn">;
  /** SDK正式render capability映射，未知unsupported */ readonly kind: TurnPresentationKind;
  /** qualified safe display，不含raw Turn body */ readonly material: SafeMaterialSnapshot;
  /** SDK正式允许的线程关系 */ readonly threadContext: ExternalHandle<"thread_context"> | null;
  /** 当前owner/source/scope/visibility/revision */ readonly provenance: ProvenanceMetadata;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| turnRef | ExternalHandle<"turn"> | 获准正式Turn ref |
| kind | TurnPresentationKind | SDK正式render capability映射，未知unsupported |
| material | SafeMaterialSnapshot | qualified safe display，不含raw Turn body |
| threadContext | ExternalHandle<"thread_context"> \| null | SDK正式允许的线程关系 |
| provenance | ProvenanceMetadata | 当前owner/source/scope/visibility/revision |

工厂完整签名：TurnSafeProjectionFactory.create(input: TurnSafeProjection): Outcome<TurnSafeProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：仅safe renderer分类；kind不定义owner TurnKind；material/provenance必须同源且符合披露。


### SurfaceReadProjection

职责：Conversation安全页factory全部输入。唯一定义路径：src/collaboration/conversation_surface_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** Conversation安全页factory全部输入。 */
interface SurfaceReadProjection {
  /** 正式context语境；not_visible/blocked等安全缺口为null */ readonly contextRef: ExternalHandle<"context"> | null;
  /** 正式入口类别映射，非状态 */ readonly entryKind: "group" | "channel" | "dm" | "thread";
  /** thread正式父关系 */ readonly parentContext: ExternalHandle<"context"> | null;
  /** 该surface正式访问seed */ readonly access: AccessPosture;
  /** safe当前页，正式排序与page边界 */ readonly turns: LocalPage<TurnSafeProjection>;
  /** 可读必须有formal source，hidden清null */ readonly provenance: ProvenanceMetadata | null;
  /** 同source正式query水位 */ readonly freshness: FreshnessMarker;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| contextRef | ExternalHandle<"context"> | 正式context语境 |
| entryKind | "group" \| "channel" \| "dm" \| "thread" | 正式入口类别映射，非状态 |
| parentContext | ExternalHandle<"context"> \| null | thread正式父关系 |
| access | AccessPosture | 该surface正式访问seed |
| turns | LocalPage<TurnSafeProjection> | safe当前页，正式排序与page边界 |
| provenance | ProvenanceMetadata \| null | 可读必须有formal source，hidden清null |
| freshness | FreshnessMarker | 同source正式query水位 |

工厂完整签名：SurfaceReadProjectionFactory.create(input: SurfaceReadProjection): Outcome<SurfaceReadProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：Selection/continuity来自root当前local snapshot，不从SDKresponse伪造；hidden/blocked安全空surface不带context/ref正文。


### TurnPageProjection

职责：safe Turn分页追加输入。唯一定义路径：src/collaboration/conversation_surface_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** safe Turn分页追加输入。 */
interface TurnPageProjection {
  /** 当前formalcontext；不可见/缺能力时清除 */ readonly contextRef: ExternalHandle<"context"> | null;
  /** SDK正式安全页 */ readonly page: LocalPage<TurnSafeProjection>;
  /** safe页来源；不可读null */ readonly provenance: ProvenanceMetadata | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| contextRef | ExternalHandle<"context"> | 当前formalcontext |
| page | LocalPage<TurnSafeProjection> | SDK正式安全页 |
| provenance | ProvenanceMetadata \| null | safe页来源；不可读null |

工厂完整签名：TurnPageProjectionFactory.create(input: TurnPageProjection): Outcome<TurnPageProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：只有匹配current slot/context/cursor lineage才追加，formal identity去重，不按arrival time改顺序。


### LocalPage<T>

定义路径：src/collaboration/conversation_surface_view_model.ts；不可变safe页，无独立生命周期。

```ts
/** SDK正式safe页的Chat-local容器。 */
interface LocalPage<T> {
  /** 当前获准items，hidden/blocked必须空。 */ readonly items: readonly T[];
  /** 正式页边界，不生成cursor。 */ readonly pageInfo: LocalPageInfo;
  /** 空页同样保留正式access seed。 */ readonly surface: ReadSurface;
}
/** 正式入口列表安全row，仅供renderer显示。 */
interface SafeEntryView {
  readonly entryRef: ExternalHandle<"entry">;
  readonly kind: "group" | "channel" | "dm" | "thread";
  readonly safeLabel: string;
  readonly provenance: ProvenanceMetadata;
}
/** safe入口列表结果的唯一local类型，不是第二份page schema。 */
type EntryReadProjection = LocalPage<SafeEntryView>;
```

字段来源：items为逐项qualify投影、pageInfo来自formal页、surface来自页面access/freshness，不能从items反向合成。LocalPageFactory.create<T>(input: LocalPage<T>): Outcome<LocalPage<T>>验证不可读空items/空cursor、visible非空/empty为空及正式page契约。SafeEntryViewFactory.create(input: SafeEntryView): Outcome<SafeEntryView>验证ref披露、有限kind、限长safeLabel和provenance；未知kind拒绝，不展示隐藏列表总数。kind四variant仅正式入口分类，非状态。

### 6-A模块内停审

入口前请求使用EntryResolutionFence/QualifiedEntryResolution，不再伪造尚未获得的scope/context。入口后ConsumptionRequest与LocalPageRequest保留slot及正式lineage；每factory必填字段有来源，hidden/ref/空页access明确。CHAT-UP001/002/005仍阻塞正向mapper。当前6-A local carrier停审通过，后续Step7只声明这些类型的port，不复制schema。planned测试：入口late、scope mismatch、空页access seed、hidden游标清理、thread-parent、跨query分页拒绝；未运行。

## 16. 6-B project/process/directory载体

### ProjectListReadInput

职责：Work项目列表请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** Work项目列表请求。 */
interface ProjectListReadInput {
  /** 当前Work列表入口actor/scope/source资格 */ readonly request: ConsumptionRequest;
  /** 正式列表分页 */ readonly page: LocalPageRequest;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前Work列表入口actor/scope/source资格 |
| page | LocalPageRequest | 正式列表分页 |

工厂完整签名：ProjectListReadInputFactory.create(input: ProjectListReadInput): Outcome<ProjectListReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不能由会话列表推定项目范围；limit仅local请求约束。


### ProjectDetailReadInput

职责：单项目五标签safe读取请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 单项目五标签safe读取请求。 */
interface ProjectDetailReadInput {
  /** 当前正式Work项目目标槽位 */ readonly request: ConsumptionRequest;
  /** 正式Work项目ref */ readonly project: OwnerReference;
  /** Work正式项目工作项分页；不猜全项目total */ readonly workItemPage: LocalPageRequest;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前正式Work项目目标槽位 |
| project | OwnerReference | 正式Work项目ref |
| workItemPage | LocalPageRequest | Work正式项目工作项分页；不猜全项目total |

工厂完整签名：ProjectDetailReadInputFactory.create(input: ProjectDetailReadInput): Outcome<ProjectDetailReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：project必须与currentcontext.projectReference/target正式相符；其他source各自独立qualified请求。


### ProjectDetailReadProjection

职责：项目page factory分source全部输入。唯一定义路径：src/collaboration/project_detail_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 项目page factory分source全部输入。 */
interface ProjectDetailReadProjection {
  /** 正式获准Work project */ readonly project: OwnerReference;
  /** Work主section安全摘要 */ readonly summary: QualifiedMaterial<SafeMaterialSnapshot>;
  /** 独立Work页slot/资格；null未加载 */ readonly workItems: QualifiedMaterial<LocalPage<SafeMaterialSnapshot>> | null;
  /** 正式Evidence关联与Artifact访问；null缺口 */ readonly evidenceRefs: QualifiedMaterial<readonly OwnerReference[]> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| project | OwnerReference | 正式获准Work project |
| summary | QualifiedMaterial<SafeMaterialSnapshot> | Work主section安全摘要 |
| workItems | QualifiedMaterial<LocalPage<SafeMaterialSnapshot>> \| null | 独立Work页slot/资格；null未加载 |
| evidenceRefs | QualifiedMaterial<readonly OwnerReference[]> \| null | 正式Evidence关联与Artifact访问；null缺口 |

工厂完整签名：ProjectDetailReadProjectionFactory.create(input: ProjectDetailReadProjection): Outcome<ProjectDetailReadProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不是跨owner原子snapshot；nestedqualified结果保留自己的source/context；缺sectionpartial，不生成完成度或验收。


### ProcessFlowReadInput

职责：项目整体正式Process读取请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 项目整体正式Process读取请求。 */
interface ProcessFlowReadInput {
  /** Process来源及当前项目消费槽位 */ readonly request: ConsumptionRequest;
  /** 正式Work项目ref */ readonly project: OwnerReference;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | Process来源及当前项目消费槽位 |
| project | OwnerReference | 正式Work项目ref |

工厂完整签名：ProcessFlowReadInputFactory.create(input: ProcessFlowReadInput): Outcome<ProcessFlowReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：SDK正式project→process关联必需，不从WorkItem/Runtime/原型推定Processref。


### StageFlowReadInput

职责：正式阶段子流程读取请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式阶段子流程读取请求。 */
interface StageFlowReadInput {
  /** 当前stage新消费槽位 */ readonly request: ConsumptionRequest;
  /** 正式Work项目ref */ readonly project: OwnerReference;
  /** 父图正式Process */ readonly process: OwnerReference;
  /** 父图正式可见stage */ readonly stage: OwnerReference;
  /** 父图正式拓扑版本 */ readonly parentRevision: ExternalHandle<"revision">;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前stage新消费槽位 |
| project | OwnerReference | 正式Work项目ref |
| process | OwnerReference | 父图正式Process |
| stage | OwnerReference | 父图正式可见stage |
| parentRevision | ExternalHandle<"revision"> | 父图正式拓扑版本 |

工厂完整签名：StageFlowReadInputFactory.create(input: StageFlowReadInput): Outcome<StageFlowReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：所有归属/parentRevision由SDK证明；旧父版本迟到拒绝，stage label/位置不是lookupkey。


### ProcessNodeReadInput

职责：正式节点关联及详情请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式节点关联及详情请求。 */
interface ProcessNodeReadInput {
  /** 当前node及父图槽位 */ readonly request: ConsumptionRequest;
  /** 同项目正式ref */ readonly project: OwnerReference;
  /** 当前formalProcess */ readonly process: OwnerReference;
  /** 当前safe拓扑获准node */ readonly node: OwnerReference;
  /** 父拓扑正式版本 */ readonly parentRevision: ExternalHandle<"revision">;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前node及父图槽位 |
| project | OwnerReference | 同项目正式ref |
| process | OwnerReference | 当前formalProcess |
| node | OwnerReference | 当前safe拓扑获准node |
| parentRevision | ExternalHandle<"revision"> | 父拓扑正式版本 |

工厂完整签名：ProcessNodeReadInputFactory.create(input: ProcessNodeReadInput): Outcome<ProcessNodeReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：node所属当前获准topology才读取；owner sections逐target再验，不能借Process访问。


### ProcessFlowReadProjection

职责：整体或阶段图全部safe输入。唯一定义路径：src/collaboration/process_flow_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 整体或阶段图全部safe输入。 */
interface ProcessFlowReadProjection {
  /** SDK正式Work关联 */ readonly project: OwnerReference;
  /** SDK正式Process */ readonly process: OwnerReference;
  /** 正式stage，整体null */ readonly stage: OwnerReference | null;
  /** 正式授权拓扑/source/version */ readonly topology: QualifiedMaterial<SafeProcessTopologyView>;
  /** 独立状态source及适用拓扑qualification */ readonly states: QualifiedMaterial<readonly SafeMaterialSnapshot[]> | null;
  /** 正式Gate关联，独立Governance访问 */ readonly governanceRefs: QualifiedMaterial<readonly OwnerReference[]> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| project | OwnerReference | SDK正式Work关联 |
| process | OwnerReference | SDK正式Process |
| stage | OwnerReference \| null | 正式stage，整体null |
| topology | QualifiedMaterial<SafeProcessTopologyView> | 正式授权拓扑/source/version |
| states | QualifiedMaterial<readonly SafeMaterialSnapshot[]> \| null | 独立状态source及适用拓扑qualification |
| governanceRefs | QualifiedMaterial<readonly OwnerReference[]> \| null | 正式Gate关联，独立Governance访问 |

工厂完整签名：ProcessFlowReadProjectionFactory.create(input: ProcessFlowReadProjection): Outcome<ProcessFlowReadProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：outercontext不得给nestedsource授权；states缺失/不适用当前topology→partial/stale，不按枝色推join，Gateway与Gate分立。


### ProcessNodeReadProjection

职责：节点详情safe输入。唯一定义路径：src/collaboration/process_node_detail_view_model.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 节点详情safe输入。 */
interface ProcessNodeReadProjection {
  /** 正式可见node */ readonly node: OwnerReference;
  /** 正式适用父拓扑版本 */ readonly parentRevision: ExternalHandle<"revision">;
  /** 正式节点关系及独立source资格 */ readonly associations: QualifiedMaterial<SafeNodeAssociationView>;
  /** 各Work/Governance/Artifact/Runtime/诊断source安全材料 */ readonly sections: readonly QualifiedMaterial<SafeMaterialSnapshot>[];
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| node | OwnerReference | 正式可见node |
| parentRevision | ExternalHandle<"revision"> | 正式适用父拓扑版本 |
| associations | QualifiedMaterial<SafeNodeAssociationView> | 正式节点关系及独立source资格 |
| sections | readonly QualifiedMaterial<SafeMaterialSnapshot>[] | 各Work/Governance/Artifact/Runtime/诊断source安全材料 |

工厂完整签名：ProcessNodeReadProjectionFactory.create(input: ProcessNodeReadProjection): Outcome<ProcessNodeReadProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：section须匹配正式关联、当前node与自己的slot；source失败不由其他section补齐。统计/tool/commit/test是摘要，不是acceptance。


### LinkReadInput

职责：项目与群聊正式关系请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 项目与群聊正式关系请求。 */
interface LinkReadInput {
  /** 当前anchor/关系provider/source槽位 */ readonly request: ConsumptionRequest;
  /** 正式Work项目或Conversation群聊ref */ readonly anchor: OwnerReference;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前anchor/关系provider/source槽位 |
| anchor | OwnerReference | 正式Work项目或Conversation群聊ref |

工厂完整签名：LinkReadInputFactory.create(input: LinkReadInput): Outcome<LinkReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：provider owner未确认依赖blocked；一群一项目/项目多群是产品目标，不新增绑定command。


### DirectoryReadInput

职责：正式目录搜索分页请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式目录搜索分页请求。 */
interface DirectoryReadInput {
  /** 当前provider/search/page代次 */ readonly request: ConsumptionRequest;
  /** 正式directoryprovider，未确认不可造ref */ readonly provider: OwnerReference;
  /** local限长query及正式支持filter；选人不是query授权 */ readonly search: LocalDirectorySearchState;
  /** 正式provider/query/filter页lineage */ readonly page: LocalPageRequest;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前provider/search/page代次 |
| provider | OwnerReference | 正式directoryprovider，未确认不可造ref |
| search | LocalDirectorySearchState | local限长query及正式支持filter；选人不是query授权 |
| page | LocalPageRequest | 正式provider/query/filter页lineage |

工厂完整签名：DirectoryReadInputFactory.create(input: DirectoryReadInput): Outcome<DirectoryReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：搜索条件变化推进slot代次、清旧列表/游标/selectedPerson；不能抓全公司名单本地过滤。


### MemberContextReadInput

职责：目录/项目成员/参与者/在场分源请求。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 目录/项目成员/参与者/在场分源请求。 */
interface MemberContextReadInput {
  /** 主目标消费槽位；sections另保持独立source */ readonly request: ConsumptionRequest;
  /** 当前获准人员ref */ readonly person: OwnerReference;
  /** 当前正式项目候选，无则null */ readonly project: OwnerReference | null;
  /** 当前正式群聊候选，无则null */ readonly conversation: OwnerReference | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 主目标消费槽位；sections另保持独立source |
| person | OwnerReference | 当前获准人员ref |
| project | OwnerReference \| null | 当前正式项目候选，无则null |
| conversation | OwnerReference \| null | 当前正式群聊候选，无则null |

工厂完整签名：MemberContextReadInputFactory.create(input: MemberContextReadInput): Outcome<MemberContextReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：Person不直接等于Member容器，项目成员/Participant分别access；DM能力由Conversation另验。


### MemberContextReadProjection

职责：分owner人员上下文safe结果。唯一定义路径：src/collaboration/collaboration_surface_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 分owner人员上下文safe结果。 */
interface MemberContextReadProjection {
  /** 正式identity安全身份 */ readonly identity: QualifiedMaterial<SafeMaterialSnapshot> | null;
  /** Work正式项目成员 */ readonly projectMember: QualifiedMaterial<SafeMaterialSnapshot> | null;
  /** Conversation正式参与者 */ readonly participant: QualifiedMaterial<SafeMaterialSnapshot> | null;
  /** Member正式容器内在场 */ readonly presence: QualifiedMaterial<SafeMaterialSnapshot> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| identity | QualifiedMaterial<SafeMaterialSnapshot> \| null | 正式identity安全身份 |
| projectMember | QualifiedMaterial<SafeMaterialSnapshot> \| null | Work正式项目成员 |
| participant | QualifiedMaterial<SafeMaterialSnapshot> \| null | Conversation正式参与者 |
| presence | QualifiedMaterial<SafeMaterialSnapshot> \| null | Member正式容器内在场 |

工厂完整签名：MemberContextReadProjectionFactory.create(input: MemberContextReadProjection): Outcome<MemberContextReadProjection>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：null只表示未取得对应授权材料；不并集/不推AI+human全覆盖/DM资格；各section独立access/freshness。


### OwnerSummaryReadInput

职责：单owner安全摘要请求。唯一定义路径：src/materials/safe_material_composer.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 单owner安全摘要请求。 */
interface OwnerSummaryReadInput {
  /** 当前正式source/target槽位 */ readonly request: ConsumptionRequest;
  /** 正式关联获准目标 */ readonly target: OwnerReference;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前正式source/target槽位 |
| target | OwnerReference | 正式关联获准目标 |

工厂完整签名：OwnerSummaryReadInputFactory.create(input: OwnerSummaryReadInput): Outcome<OwnerSummaryReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：单请求单owner；safe summary不包含rawtool/provider/bridge/Artifactbody，不成为evidence。


### 6-B模块内停审

每查询为具名carrier，ReadProjection全部必填字段有正式SDK来源；nestedsections由自己的ConsumptionRequest/QualifiedMaterial及access证明。Coordinator请求槽位必须在查询前登记，返回仍匹配当前node/search/父版本才CAS；未证明relation/coverage禁止拼接。CHAT-UP008/009继续blocked，类型定义不授予provider/流程能力。planned切口：父图更新迟到、节点多源部分失败、群聊解绑/目标不可读、人类/AIcoverage unknown、搜索页lineage。当前6-B local闭口通过，进入6-C；无run/result。

## 17. 6-C intents/result载体

### IntentCapabilityView

职责：正式SDK受控意图能力的safe投影。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式SDK受控意图能力的safe投影。 */
interface IntentCapabilityView {
  /** 当前入口/target/source/visibility资格 */ readonly request: ConsumptionRequest;
  /** 正式Conversation/Governance能力映射 */ readonly kind: IntentKind;
  /** 正式授予，未绑定/拒绝null */ readonly capabilityRef: ExternalHandle<"intent_capability"> | null;
  /** Governance正式获准action；Conversation null */ readonly actionRef: ExternalHandle<"governance_action"> | null;
  /** SDK formal access，不按member角色猜 */ readonly availability: AccessAvailability;
  /** 正式明确retry能力，不由按钮状态推定 */ readonly retryAllowed: boolean;
  /** 允许操作必须正式source/visibility来源 */ readonly provenance: ProvenanceMetadata | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前入口/target/source/visibility资格 |
| kind | IntentKind | 正式Conversation/Governance能力映射 |
| capabilityRef | ExternalHandle<"intent_capability"> \| null | 正式授予，未绑定/拒绝null |
| actionRef | ExternalHandle<"governance_action"> \| null | Governance正式获准action；Conversation null |
| availability | AccessAvailability | SDK formal access，不按member角色猜 |
| retryAllowed | boolean | 正式明确retry能力，不由按钮状态推定 |
| provenance | ProvenanceMetadata \| null | 允许操作必须正式source/visibility来源 |

工厂完整签名：IntentCapabilityViewFactory.create(input: IntentCapabilityView): Outcome<IntentCapabilityView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：available/capabilityRef/current actor/scope/target必须齐备；只读/hidden无操作ref；retryAllowed不允许unknown重发。


### CapabilityReadInput

职责：正式意图能力查询输入。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式意图能力查询输入。 */
interface CapabilityReadInput {
  /** 当前target资格 */ readonly request: ConsumptionRequest;
  /** 明确由用户入口选择conversation/governance */ readonly kind: IntentKind;
  /** 治理须正式Gateref，其余null */ readonly gate: OwnerReference | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前target资格 |
| kind | IntentKind | 明确由用户入口选择conversation/governance |
| gate | OwnerReference \| null | 治理须正式Gateref，其余null |

工厂完整签名：CapabilityReadInputFactory.create(input: CapabilityReadInput): Outcome<CapabilityReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不是业务command；owner SDK在提交时仍再次验权。


### ConversationIntentInput

职责：用户明确提交当前草稿revision。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 用户明确提交当前草稿revision。 */
interface ConversationIntentInput {
  /** 当前Conversation消费槽位 */ readonly request: ConsumptionRequest;
  /** 唯一root草稿 */ readonly draftRef: LocalId<"draft">;
  /** 用户提交时冻结的当前revision */ readonly draftRevision: number;
  /** 正式Conversation capability，不由组件自行授予 */ readonly capability: IntentCapabilityView;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前Conversation消费槽位 |
| draftRef | LocalId<"draft"> | 唯一root草稿 |
| draftRevision | number | 用户提交时冻结的当前revision |
| capability | IntentCapabilityView | 正式Conversation capability，不由组件自行授予 |

工厂完整签名：ConversationIntentInputFactory.create(input: ConversationIntentInput): Outcome<ConversationIntentInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不接受UI填写actor/幂等key；coordinator读取并冻结同draftRef/revision，重复点击同revision复用in-flight。


### GovernanceIntentInput

职责：GateCard受控治理意图。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** GateCard受控治理意图。 */
interface GovernanceIntentInput {
  /** 当前正式Gate目标槽位 */ readonly request: ConsumptionRequest;
  /** Governance正式获准Gateref */ readonly gate: OwnerReference;
  /** SDK正式可用action */ readonly action: ExternalHandle<"governance_action">;
  /** 匹配Gate/action/actor的正式capability */ readonly capability: IntentCapabilityView;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前正式Gate目标槽位 |
| gate | OwnerReference | Governance正式获准Gateref |
| action | ExternalHandle<"governance_action"> | SDK正式可用action |
| capability | IntentCapabilityView | 匹配Gate/action/actor的正式capability |

工厂完整签名：GovernanceIntentInputFactory.create(input: GovernanceIntentInput): Outcome<GovernanceIntentInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不接受UI填写Decision/outcome/approved；点击只发起submitted/pending，owner才确定决策结果。


### ExplicitRetryInput

职责：用户明确选择的新尝试输入。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 用户明确选择的新尝试输入。 */
interface ExplicitRetryInput {
  /** root中failed/rejected旧attempt */ readonly previousIntent: LocalId<"intent">;
  /** 重新验证的当前target/actor/scope */ readonly request: ConsumptionRequest;
  /** 正式retry允许且current qualified */ readonly capability: IntentCapabilityView;
  /** Conversation当前草稿；治理null */ readonly draftRef: LocalId<"draft"> | null;
  /** 当前用户新revision，必须与draftRef成对 */ readonly draftRevision: number | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| previousIntent | LocalId<"intent"> | root中failed/rejected旧attempt |
| request | ConsumptionRequest | 重新验证的当前target/actor/scope |
| capability | IntentCapabilityView | 正式retry允许且current qualified |
| draftRef | LocalId<"draft"> \| null | Conversation当前草稿；治理null |
| draftRevision | number \| null | 当前用户新revision，必须与draftRef成对 |

工厂完整签名：ExplicitRetryInputFactory.create(input: ExplicitRetryInput): Outcome<ExplicitRetryInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：unknown/submitted/pending禁止retry；历史terminal不能覆写，新intent/new prepare是否复用SDKkey由SDK正式retry合同决定，Chat不能自定。


### FrozenConversationPayload

职责：提交边界前的临时草稿快照。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 提交边界前的临时草稿快照。 */
interface FrozenConversationPayload {
  /** 当前root草稿 */ readonly draftRef: LocalId<"draft">;
  /** 冻结revision，非rootCAS版本 */ readonly draftRevision: number;
  /** 用户当前文本，限长，仅短暂内存 */ readonly text: string;
  /** 当前qualified正式引用，不含文件正文 */ readonly attachments: readonly OwnerReference[];
  /** 当前获准回复目标 */ readonly replyTarget: ExternalHandle<"turn"> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| draftRef | LocalId<"draft"> | 当前root草稿 |
| draftRevision | number | 冻结revision，非rootCAS版本 |
| text | string | 用户当前文本，限长，仅短暂内存 |
| attachments | readonly OwnerReference[] | 当前qualified正式引用，不含文件正文 |
| replyTarget | ExternalHandle<"turn"> \| null | 当前获准回复目标 |

工厂完整签名：FrozenConversationPayloadFactory.create(input: FrozenConversationPayload): Outcome<FrozenConversationPayload>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不写attempt记录/持久化/diagnostic；dispatch结束后释放临时输入，新编辑不受旧确认清理影响。


### CommandPrepareInput

职责：一次逻辑意图的SDK正式prepare输入。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 一次逻辑意图的SDK正式prepare输入。 */
interface CommandPrepareInput {
  /** 提交目标与source槽位 */ readonly request: ConsumptionRequest;
  /** local预留的draft状态，尚未dispatch */ readonly attempt: CommandAttemptState;
  /** current正式能力 */ readonly capability: IntentCapabilityView;
  /** kind conversation必须，governance null */ readonly conversation: FrozenConversationPayload | null;
  /** kind governance必须，conversation null */ readonly governance: GovernanceIntentInput | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 提交目标与source槽位 |
| attempt | CommandAttemptState | local预留的draft状态，尚未dispatch |
| capability | IntentCapabilityView | current正式能力 |
| conversation | FrozenConversationPayload \| null | kind conversation必须，governance null |
| governance | GovernanceIntentInput \| null | kind governance必须，conversation null |

工厂完整签名：CommandPrepareInputFactory.create(input: CommandPrepareInput): Outcome<CommandPrepareInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：显式kind分派，两个payload互斥；input各字段由root/正式capability/用户动作提供，不从route猜业务类型。


### PreparedCommand

职责：正式SDK prepare关联结果。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式SDK prepare关联结果。 */
interface PreparedCommand {
  /** 原请求代次保留 */ readonly request: ConsumptionRequest;
  /** 原local attempt，不由服务生成clientid */ readonly intentRef: LocalId<"intent">;
  /** SDK正式稳定association */ readonly idempotencyAssociation: ExternalHandle<"idempotency">;
  /** SDK正式命令准备能力，仅adapterregistry可解析 */ readonly preparedRef: ExternalHandle<"prepared_command">;
  /** 正式prepare绑定actor */ readonly actorRef: ExternalHandle<"actor">;
  /** 原意图有限kind */ readonly kind: IntentKind;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 原请求代次保留 |
| intentRef | LocalId<"intent"> | 原local attempt，不由服务生成clientid |
| idempotencyAssociation | ExternalHandle<"idempotency"> | SDK正式稳定association |
| preparedRef | ExternalHandle<"prepared_command"> | SDK正式命令准备能力，仅adapterregistry可解析 |
| actorRef | ExternalHandle<"actor"> | 正式prepare绑定actor |
| kind | IntentKind | 原意图有限kind |

工厂完整签名：PreparedCommandFactory.create(input: PreparedCommand): Outcome<PreparedCommand>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：无正文/credential，句柄不可serialize；prepare未知若SDK不保证无业务副作用则该能力不可绑定，不能伪装safe prepare。


### CommandSubmission

职责：SDKdispatch边界的本地投影。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** SDKdispatch边界的本地投影。 */
interface CommandSubmission {
  /** 原attempt */ readonly intentRef: LocalId<"intent">;
  /** 原formalprepare稳定关联 */ readonly association: ExternalHandle<"idempotency">;
  /** 原提交actor/scope/context */ readonly fence: ContextFence;
  /** 正式SDK执行边界语义，两variant非业务状态 */ readonly disposition: "not_dispatched" | "dispatched";
  /** 正式receipt可缺失，不把ACK包当业务receipt */ readonly receipt: CommandReceiptView | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| intentRef | LocalId<"intent"> | 原attempt |
| association | ExternalHandle<"idempotency"> | 原formalprepare稳定关联 |
| fence | ContextFence | 原提交actor/scope/context |
| disposition | "not_dispatched" \| "dispatched" | 正式SDK执行边界语义，两variant非业务状态 |
| receipt | CommandReceiptView \| null | 正式receipt可缺失，不把ACK包当业务receipt |

工厂完整签名：CommandSubmissionFactory.create(input: CommandSubmission): Outcome<CommandSubmission>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：dispatched不等于committed；开始dispatch后异常默认effect_unknown，只有正式无副作用保证才failed；不存在UI自行造dispatched成功路径。


### CommandReceiptView

职责：正式receipt及业务确认资格。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式receipt及业务确认资格。 */
interface CommandReceiptView {
  /** 由registry association反链原attempt */ readonly intentRef: LocalId<"intent">;
  /** 原intent actor/scope/context */ readonly fence: ContextFence;
  /** 正式owner命令actor */ readonly actorRef: ExternalHandle<"actor">;
  /** 正式稳定关联 */ readonly association: ExternalHandle<"idempotency">;
  /** formalreceipt */ readonly receiptRef: ExternalHandle<"receipt">;
  /** received/pending仅接收/处理中；business_confirming须明确SDK合同 */ readonly meaning: "received" | "pending" | "business_confirming";
  /** ordinary receipt必须null；业务确认必须正式committed authority */ readonly authority: ResultAuthority | null;
  /** owner正式业务结果可null，不能从receipt造resultref */ readonly resultRef: ExternalHandle<"result"> | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| intentRef | LocalId<"intent"> | 由registry association反链原attempt |
| fence | ContextFence | 原intent actor/scope/context |
| actorRef | ExternalHandle<"actor"> | 正式owner命令actor |
| association | ExternalHandle<"idempotency"> | 正式稳定关联 |
| receiptRef | ExternalHandle<"receipt"> | formalreceipt |
| meaning | "received" \| "pending" \| "business_confirming" | received/pending仅接收/处理中；business_confirming须明确SDK合同 |
| authority | ResultAuthority \| null | ordinary receipt必须null；业务确认必须正式committed authority |
| resultRef | ExternalHandle<"result"> \| null | owner正式业务结果可null，不能从receipt造resultref |

工厂完整签名：CommandReceiptViewFactory.create(input: CommandReceiptView): Outcome<CommandReceiptView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：meaning三variant是formal语义分类，不是状态机；业务确认只能gate检查后confirmed；websocket/AG-UI ACK不得构造本carrier。


### FormalResultMaterial

职责：业务结果或变化的safe关联材料。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 业务结果或变化的safe关联材料。 */
interface FormalResultMaterial {
  /** registry反链原逻辑意图 */ readonly intentRef: LocalId<"intent">;
  /** 正式原intent关联 */ readonly fence: ContextFence;
  /** 正式owner actor */ readonly actorRef: ExternalHandle<"actor">;
  /** 原prepare关联 */ readonly association: ExternalHandle<"idempotency">;
  /** 正式Conversation/Governance result authority */ readonly authority: ResultAuthority;
  /** owner正式业务解释，非HTTP状态 */ readonly posture: "pending" | "confirmed" | "rejected" | "failed" | "unknown";
  /** 正式副作用解释；unknown必须unresolved */ readonly effect: "committed" | "rejected" | "no_effect" | "unresolved";
  /** 正式result可缺失仅pending/unknown，confirmedreceipt例外由receipt路径承接 */ readonly resultRef: ExternalHandle<"result"> | null;
  /** 正式可选receipt */ readonly receiptRef: ExternalHandle<"receipt"> | null;
  /** finite safe code，不含raw result */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| intentRef | LocalId<"intent"> | registry反链原逻辑意图 |
| fence | ContextFence | 正式原intent关联 |
| actorRef | ExternalHandle<"actor"> | 正式owner actor |
| association | ExternalHandle<"idempotency"> | 原prepare关联 |
| authority | ResultAuthority | 正式Conversation/Governance result authority |
| posture | "pending" \| "confirmed" \| "rejected" \| "failed" \| "unknown" | owner正式业务解释，非HTTP状态 |
| effect | "committed" \| "rejected" \| "no_effect" \| "unresolved" | 正式副作用解释；unknown必须unresolved |
| resultRef | ExternalHandle<"result"> \| null | 正式result可缺失仅pending/unknown，confirmedreceipt例外由receipt路径承接 |
| receiptRef | ExternalHandle<"receipt"> \| null | 正式可选receipt |
| reason | SafeReasonCode \| null | finite safe code，不含raw result |

工厂完整签名：FormalResultMaterialFactory.create(input: FormalResultMaterial): Outcome<FormalResultMaterial>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：confirmed→authority.committed且effect committed；rejected正式拒绝，failed须no_effect；posture与effect矛盾拒绝invalid_transition，不能以pending授权approved。


### ProbeAttemptInput

职责：只读探测旧attempt。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 只读探测旧attempt。 */
interface ProbeAttemptInput {
  /** 重新验证probe scope/source槽位 */ readonly request: ConsumptionRequest;
  /** 原unknown或非terminal意图 */ readonly intentRef: LocalId<"intent">;
  /** 正式association；重启由formal locator rebind，不能自造 */ readonly association: ExternalHandle<"idempotency">;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 重新验证probe scope/source槽位 |
| intentRef | LocalId<"intent"> | 原unknown或非terminal意图 |
| association | ExternalHandle<"idempotency"> | 正式association；重启由formal locator rebind，不能自造 |

工厂完整签名：ProbeAttemptInputFactory.create(input: ProbeAttemptInput): Outcome<ProbeAttemptInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：probe不dispatch/不重放；缺locator/association不能定位则blocked/user_decision，不猜not_found等于无副作用。


### FormalProbeResult

职责：正式probe副作用解释。唯一定义路径：src/intents/user_intent_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式probe副作用解释。 */
interface FormalProbeResult {
  /** 原attempt formalcorrelation */ readonly intentRef: LocalId<"intent">;
  /** 正式稳定关联 */ readonly association: ExternalHandle<"idempotency">;
  /** formalprobe分类，非业务terminal */ readonly status: "resolved" | "pending" | "not_found" | "unavailable";
  /** resolved必须正式结果，pending可正式pending */ readonly material: FormalResultMaterial | null;
  /** 仅owner明确证明没有副作用，not_found默认false */ readonly noEffectProven: boolean;
  /** 低敏解释 */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| intentRef | LocalId<"intent"> | 原attempt formalcorrelation |
| association | ExternalHandle<"idempotency"> | 正式稳定关联 |
| status | "resolved" \| "pending" \| "not_found" \| "unavailable" | formalprobe分类，非业务terminal |
| material | FormalResultMaterial \| null | resolved必须正式结果，pending可正式pending |
| noEffectProven | boolean | 仅owner明确证明没有副作用，not_found默认false |
| reason | SafeReasonCode \| null | 低敏解释 |

工厂完整签名：FormalProbeResultFactory.create(input: FormalProbeResult): Outcome<FormalProbeResult>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：resolved走同CommandResultGate；not_found且无正式no-effect保证保持unknown；即便证明no effect，也不自动重发。


### ResultAuthority

唯一schema（分类注释承接下文；无独立状态机）：

```ts
/** SDK正式业务结果权威，registry验证才有资格。 */
interface ResultAuthority {
  /** 对应命令truth owner。 */ readonly owner: "conversation" | "governance";
  /** 正式业务合同资格。 */ readonly authorityRef: ExternalHandle<"result_authority">;
  /** 正式结果、明确业务确认receipt、正式业务变化三类。 */
  readonly evidenceKind: "business_result" | "business_confirming_receipt" | "business_change";
  /** 正式合同证明业务已提交，不是技术接收。 */ readonly committed: boolean;
  /** 来源fixture隔离，false本身不证明资格。 */ readonly fake: boolean;
}
```

唯一定义归src/intents/command_result_gate.ts，承接§6.3同一类型；不新增同义authority。完整字段为owner: conversation/governance、authorityRef: ExternalHandle<"result_authority">、evidenceKind: business_result/business_confirming_receipt/business_change、committed: boolean、fake: boolean。owner/evidenceKind均来自SDK正式业务合同映射，各variant是分类；committed由正式业务结果保证，不是HTTP/ACK或UI点击。ResultAuthorityFactory.fromQualified(input: QualifiedMaterial<ResultAuthority>): Outcome<ResultAuthority>核对registry/correlation/current会话；fake不能确认真实attempt。无独立生命周期或IO。

### 6-C模块内停审

draftRef/revision、local attempt、formal association与dispatch边界均有来源。CommandResultGate允许terminal的资格路径只有正式result/change或明确业务确认receipt；普通receipt不terminal，unknown只probe，UI双击同draft/action复用in-flight reservation。PreparedCommand不缓存正文且prepare须正式无业务副作用语义；SDK缺能力blocked而非Chat自造key。planned切口：重复点击、prepare失败、dispatch中断、ACK拒绝、not_found不重发、旧确认不清新稿。local载体闭口通过，CHAT-UP001/003仍open，进入6-D。

## 18. 6-D continuity/recovery载体

### VisibilityChangeView

职责：SDK正式访问收紧的安全作用范围。唯一定义路径：src/continuity/change_reducer.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** SDK正式访问收紧的安全作用范围。 */
interface VisibilityChangeView {
  /** 当前正式session，旧session不能撤销新session */ readonly sessionEpoch: SessionEpoch;
  /** 正式消费actor */ readonly actorRef: ExternalHandle<"actor">;
  /** SDK正式scope，不从ref猜 */ readonly scopeRef: ExternalHandle<"scope">;
  /** 正式收紧来源 */ readonly sourceRef: ExternalHandle<"source">;
  /** scope影响全部已登记消费者，target只正式指定目标 */ readonly reach: "scope" | "target";
  /** 仅已知获准safe ref；scope可空 */ readonly targets: readonly OwnerReference[];
  /** 只允许read_only/restricted/blocked/hidden等收紧，不升级available */ readonly next: AccessAvailability;
  /** 正式收紧资格 */ readonly visibilityRef: ExternalHandle<"visibility">;
  /** revoked/expired等清理原因 */ readonly reason: ClearReason;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| sessionEpoch | SessionEpoch | 当前正式session，旧session不能撤销新session |
| actorRef | ExternalHandle<"actor"> | 正式消费actor |
| scopeRef | ExternalHandle<"scope"> | SDK正式scope，不从ref猜 |
| sourceRef | ExternalHandle<"source"> | 正式收紧来源 |
| reach | "scope" \| "target" | scope影响全部已登记消费者，target只正式指定目标 |
| targets | readonly OwnerReference[] | 仅已知获准safe ref；scope可空 |
| next | AccessAvailability | 只允许read_only/restricted/blocked/hidden等收紧，不升级available |
| visibilityRef | ExternalHandle<"visibility"> | 正式收紧资格 |
| reason | ClearReason | revoked/expired等清理原因 |

工厂完整签名：VisibilityChangeViewFactory.create(input: VisibilityChangeView): Outcome<VisibilityChangeView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：reach两variant非状态；不能以subject消失推revoke。先失效current consumers并遮蔽，再stop feed/durable清理；scope消息不因node slot关闭漏处理。


### FormalChangeView

职责：SDK正式变化的safe消费输入。唯一定义路径：src/continuity/change_reducer.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** SDK正式变化的safe消费输入。 */
interface FormalChangeView {
  /** formal stable event identity */ readonly changeRef: ExternalHandle<"change">;
  /** formal feed来源 */ readonly sourceRef: ExternalHandle<"change_source">;
  /** registry证明对应public source */ readonly source: ExternalHandle<"source">;
  /** source-local正式水位 */ readonly revision: ExternalHandle<"revision"> | null;
  /** 正式消费cursor，不排序 */ readonly nextCursor: ExternalHandle<"change_cursor"> | null;
  /** 有限typed payload族，未知unsupported */ readonly payload: SafeChangePayload;
  /** 正式source/scope/visibility */ readonly provenance: ProvenanceMetadata;
  /** 原SDK或fixture来源 */ readonly fake: boolean;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| changeRef | ExternalHandle<"change"> | formal stable event identity |
| sourceRef | ExternalHandle<"change_source"> | formal feed来源 |
| source | ExternalHandle<"source"> | registry证明对应public source |
| revision | ExternalHandle<"revision"> \| null | source-local正式水位 |
| nextCursor | ExternalHandle<"change_cursor"> \| null | 正式消费cursor，不排序 |
| payload | SafeChangePayload | 有限typed payload族，未知unsupported |
| provenance | ProvenanceMetadata | 正式source/scope/visibility |
| fake | boolean | 原SDK或fixture来源 |

工厂完整签名：FormalChangeViewFactory.create(input: FormalChangeView): Outcome<FormalChangeView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：无bus topic/offset/raw JSON；不能推跨owner全局revision。


### ChangeQualification

职责：SDK正式顺序及安全影响判定。唯一定义路径：src/continuity/change_reducer.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** SDK正式顺序及安全影响判定。 */
interface ChangeQualification {
  /** 原formal event identity */ readonly changeRef: ExternalHandle<"change">;
  /** current槽位；scope revoke另按session/scope核对 */ readonly request: ConsumptionRequest;
  /** 正式accepted/duplicate/out_of_order/gap/restricted/ignored */ readonly disposition: ChangeAcceptanceKind;
  /** 正式受影响Conversation，项目/目录不伪造context */ readonly affectedContexts: readonly ExternalHandle<"context">[];
  /** 获准项目/节点/人员ref */ readonly affectedTargets: readonly OwnerReference[];
  /** 正式当前连续coverage */ readonly coverageRef: ExternalHandle<"coverage"> | null;
  /** gap必须formal ref */ readonly gapRef: ExternalHandle<"gap"> | null;
  /** 正式可接受续点 */ readonly nextCursor: ExternalHandle<"change_cursor"> | null;
  /** finite安全解释 */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| changeRef | ExternalHandle<"change"> | 原formal event identity |
| request | ConsumptionRequest | current槽位；scope revoke另按session/scope核对 |
| disposition | ChangeAcceptanceKind | 正式accepted/duplicate/out_of_order/gap/restricted/ignored |
| affectedContexts | readonly ExternalHandle<"context">[] | 正式受影响Conversation，项目/目录不伪造context |
| affectedTargets | readonly OwnerReference[] | 获准项目/节点/人员ref |
| coverageRef | ExternalHandle<"coverage"> \| null | 正式当前连续coverage |
| gapRef | ExternalHandle<"gap"> \| null | gap必须formal ref |
| nextCursor | ExternalHandle<"change_cursor"> \| null | 正式可接受续点 |
| reason | SafeReasonCode \| null | finite安全解释 |

工厂完整签名：ChangeQualificationFactory.create(input: ChangeQualification): Outcome<ChangeQualification>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：Chat集合只同分区等值去重，不猜顺序。gap/out_of_order不merge，不单event修fresh；缺qualification blocked。


### ResumeInput

职责：single-source恢复请求。唯一定义路径：src/continuity/resume_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** single-source恢复请求。 */
interface ResumeInput {
  /** 当前source槽位 */ readonly request: ConsumptionRequest;
  /** single canonical恢复context */ readonly context: ResumeContext;
  /** 正式恢复动作，不重发业务 */ readonly action: "resume" | "requery";
  /** local single-flight关联 */ readonly recoveryRef: LocalId<"recovery">;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前source槽位 |
| context | ResumeContext | single canonical恢复context |
| action | "resume" \| "requery" | 正式恢复动作，不重发业务 |
| recoveryRef | LocalId<"recovery"> | local single-flight关联 |

工厂完整签名：ResumeInputFactory.create(input: ResumeInput): Outcome<ResumeInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：同actor/scope/source，context cursor来自SDK；无resume能力可formalrequery但不能假fresh。


### ResumeResultView

职责：正式恢复结果safe投影。唯一定义路径：src/continuity/resume_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式恢复结果safe投影。 */
interface ResumeResultView {
  /** 原恢复slot/currentcontext */ readonly request: ConsumptionRequest;
  /** 原恢复id */ readonly recoveryRef: LocalId<"recovery">;
  /** 正式source */ readonly sourceRef: ExternalHandle<"change_source">;
  /** 正式coverage/访问结论，非连接ACK */ readonly status: "complete" | "partial" | "gap" | "denied" | "blocked";
  /** 正式续点 */ readonly nextCursor: ExternalHandle<"change_cursor"> | null;
  /** 单source水位 */ readonly revision: ExternalHandle<"revision"> | null;
  /** formal覆盖资格 */ readonly coverageRef: ExternalHandle<"coverage"> | null;
  /** 正式缺口 */ readonly gapRef: ExternalHandle<"gap"> | null;
  /** 正式收紧只做安全处理 */ readonly visibility: VisibilityChangeView | null;
  /** 正式resume允许的safechanges */ readonly changes: readonly QualifiedMaterial<FormalChangeView>[];
  /** 正式requery snapshot，不造event */ readonly snapshot: QualifiedMaterial<SafeChangePayload> | null;
  /** 有限解释 */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 原恢复slot/currentcontext |
| recoveryRef | LocalId<"recovery"> | 原恢复id |
| sourceRef | ExternalHandle<"change_source"> | 正式source |
| status | "complete" \| "partial" \| "gap" \| "denied" \| "blocked" | 正式coverage/访问结论，非连接ACK |
| nextCursor | ExternalHandle<"change_cursor"> \| null | 正式续点 |
| revision | ExternalHandle<"revision"> \| null | 单source水位 |
| coverageRef | ExternalHandle<"coverage"> \| null | formal覆盖资格 |
| gapRef | ExternalHandle<"gap"> \| null | 正式缺口 |
| visibility | VisibilityChangeView \| null | 正式收紧只做安全处理 |
| changes | readonly QualifiedMaterial<FormalChangeView>[] | 正式resume允许的safechanges |
| snapshot | QualifiedMaterial<SafeChangePayload> \| null | 正式requery snapshot，不造event |
| reason | SafeReasonCode \| null | 有限解释 |

工厂完整签名：ResumeResultViewFactory.create(input: ResumeResultView): Outcome<ResumeResultView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：complete须same source/fence/recovery、revision/coverage；partial保持stale，denied隐藏，blocked不fallbackbus。


### RestoreInput

职责：shell重启的local恢复候选。唯一定义路径：src/continuity/recovery_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** shell重启的local恢复候选。 */
interface RestoreInput {
  /** SDK正式safe account/scope alias */ readonly partition: LocalPartition;
  /** repository local key */ readonly key: LocalId<"cache_key">;
  /** 新route safeinteger代次 */ readonly routeGeneration: number;
  /** restart/expired等恢复原因 */ readonly reason: RecoveryReason;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| partition | LocalPartition | SDK正式safe account/scope alias |
| key | LocalId<"cache_key"> | repository local key |
| routeGeneration | number | 新route safeinteger代次 |
| reason | RecoveryReason | restart/expired等恢复原因 |

工厂完整签名：RestoreInputFactory.create(input: RestoreInput): Outcome<RestoreInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：默认memory重启可无记录；locator须正式rebind/query，缓存confirmed不恢复truth。


### RecoveryActionInput

职责：用户允许的恢复动作。唯一定义路径：src/continuity/recovery_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 用户允许的恢复动作。 */
interface RecoveryActionInput {
  /** 当前formalsource */ readonly request: ConsumptionRequest;
  /** 当前allowedActions */ readonly action: RecoveryNextAction;
  /** probe时必填旧unknown */ readonly intentRef: LocalId<"intent"> | null;
  /** resume/requery时必填 */ readonly resume: ResumeInput | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前formalsource |
| action | RecoveryNextAction | 当前allowedActions |
| intentRef | LocalId<"intent"> \| null | probe时必填旧unknown |
| resume | ResumeInput \| null | resume/requery时必填 |

工厂完整签名：RecoveryActionInputFactory.create(input: RecoveryActionInput): Outcome<RecoveryActionInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：每action校验当前capability；probe不dispatch。


### ClearContextInput

职责：遮蔽及local分区清理。唯一定义路径：src/local_state/cache_eviction_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 遮蔽及local分区清理。 */
interface ClearContextInput {
  /** 正式safe partition alias */ readonly partition: LocalPartition;
  /** 已知repository localkey */ readonly key: LocalId<"cache_key">;
  /** 可信当前session，已清理可null */ readonly fence: ContextFence | null;
  /** logout/revoke/expiry等 */ readonly reason: ClearReason;
  /** 正式revoke须资格，用户丢弃可null */ readonly visibility: VisibilityChangeView | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| partition | LocalPartition | 正式safe partition alias |
| key | LocalId<"cache_key"> | 已知repository localkey |
| fence | ContextFence \| null | 可信当前session，已清理可null |
| reason | ClearReason | logout/revoke/expiry等 |
| visibility | VisibilityChangeView \| null | 正式revoke须资格，用户丢弃可null |

工厂完整签名：ClearContextInputFactory.create(input: ClearContextInput): Outcome<ClearContextInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：先invalidate/遮蔽，再stop feed，再versioned delete；失败restricted，不反写ownerdelete。


### EvictionInput

职责：local缓存淘汰请求。唯一定义路径：src/local_state/cache_eviction_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** local缓存淘汰请求。 */
interface EvictionInput {
  /** safe分区/key与原因 */ readonly context: ClearContextInput;
  /** load返回版本，null只确认不存在 */ readonly expectedVersion: LocalVersion | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| context | ClearContextInput | safe分区/key与原因 |
| expectedVersion | LocalVersion \| null | load返回版本，null只确认不存在 |

工厂完整签名：EvictionInputFactory.create(input: EvictionInput): Outcome<EvictionInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：容量/TTL仅收紧；evict不取消已dispatchcommand。


### SafeChangePayload

唯一定义路径：src/continuity/change_reducer.ts；SDK正式safe变化分类，无独立生命周期。

```ts
/** 正式safe payload，不接内部bus/原始事件。 */
type SafeChangePayload =
  /** 正式Conversation surface。 */ { readonly kind: "surface"; readonly value: SurfaceReadProjection }
  /** 单owner正式safe材料。 */ | { readonly kind: "material"; readonly value: SafeMaterialSnapshot }
  /** Work项目安全section。 */ | { readonly kind: "project"; readonly value: ProjectDetailReadProjection }
  /** Process正式拓扑/状态。 */ | { readonly kind: "process"; readonly value: ProcessFlowReadProjection }
  /** 正式关系provider输出。 */ | { readonly kind: "links"; readonly value: SafeProjectConversationAssociationView }
  /** 正式目录provider页。 */ | { readonly kind: "directory"; readonly value: SafeDirectoryPageView }
  /** 正式收紧，先隐藏。 */ | { readonly kind: "visibility"; readonly value: VisibilityChangeView }
  /** 正式业务结果，仍走ResultGate。 */ | { readonly kind: "result"; readonly value: FormalResultMaterial }
  /** 未知正式类型，仅安全占位/requery。 */ | { readonly kind: "unsupported"; readonly reason: SafeReasonCode };
```

kind来源均为SDK正式safe capability映射，载荷见各独立carrier；非状态分类，去向为对应pure reducer/factory，unsupported不猜字段。SafeChangePayloadFactory.fromQualified(input: QualifiedMaterial<SafeChangePayload>): Outcome<SafeChangePayload>核对kind/payload/source/access，不生成event identity/cursor；fake不进入真实确认。MaterialRevisionChange使用material，不从Turn文本猜来源。

### 6-D模块内停审

source/coverage/gap与可见性影响范围全部typed；scope撤销和局部slot失效分开，requery不造event，single-source水位/消费记录同CAS。ResumeResult每status可填齐nullable字段，complete缺coverage/revision不能fresh。planned切口：duplicate/乱序/gap、旧sessionrevoke、node关闭后的scope收紧、single-flight/恢复late、delete失败。local闭口通过，CHAT-UP002/008/009/host/storage仍open，进入6-E。

## 19. 6-E platform/config/diagnostic载体

本组输入为host/composition的本地正式资格或SDK safe preview，不是业务transport DTO。每卡factory纯校验，不执行预览或发送。

### PlatformProbeResult

职责：单能力宿主资格快照。唯一定义路径：src/platform/platform_capability_state.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 单能力宿主资格快照。 */
interface PlatformProbeResult {
  /** 批准config平台 */ readonly platform: PlatformKind;
  /** 此次probe唯一能力 */ readonly capability: PlatformCapabilityKind;
  /** 可信host正式结果 */ readonly availability: CapabilityAvailability;
  /** 批准composition资格；缺失不能available */ readonly hostBindingRef: LocalId<"host_binding"> | null;
  /** 本地probe代次，防旧结果覆盖 */ readonly generation: number;
  /** 有限安全原因 */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| platform | PlatformKind | 批准config平台 |
| capability | PlatformCapabilityKind | 此次probe唯一能力 |
| availability | CapabilityAvailability | 可信host正式结果 |
| hostBindingRef | LocalId<"host_binding"> \| null | 批准composition资格；缺失不能available |
| generation | number | 本地probe代次，防旧结果覆盖 |
| reason | SafeReasonCode \| null | 有限安全原因 |

工厂完整签名：PlatformProbeResultFactory.create(input: PlatformProbeResult): Outcome<PlatformProbeResult>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：available需批准host binding及当前代次；Web preview不能宣称native preview/storage可用；probe不申请业务权限。


### ShellLifecycleEvent

职责：可信宿主生命周期通知。唯一定义路径：src/platform/shell_lifecycle_coordinator.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 可信宿主生命周期通知。 */
interface ShellLifecycleEvent {
  /** 当前批准宿主 */ readonly hostBindingRef: LocalId<"host_binding">;
  /** local composition当前会话 */ readonly sessionEpoch: SessionEpoch;
  /** 生命周期本地代次 */ readonly generation: number;
  /** foreground/background/closing/restarting/offline正式宿主信号 */ readonly posture: ShellLifecyclePosture;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| hostBindingRef | LocalId<"host_binding"> | 当前批准宿主 |
| sessionEpoch | SessionEpoch | local composition当前会话 |
| generation | number | 生命周期本地代次 |
| posture | ShellLifecyclePosture | foreground/background/closing/restarting/offline正式宿主信号 |

工厂完整签名：ShellLifecycleEventFactory.create(input: ShellLifecycleEvent): Outcome<ShellLifecycleEvent>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：去重/旧session拒绝；foreground只启动资格重验和resume；closing/offline不证明命令无副作用。


### PreviewReadInput

职责：正式只读安全预览请求。唯一定义路径：src/materials/preview_boundary.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 正式只读安全预览请求。 */
interface PreviewReadInput {
  /** 当前Artifact独立消费语境 */ readonly request: ConsumptionRequest;
  /** SDK获准入口，无raw URL */ readonly reference: PreviewReference;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| request | ConsumptionRequest | 当前Artifact独立消费语境 |
| reference | PreviewReference | SDK获准入口，无raw URL |

工厂完整签名：PreviewReadInputFactory.create(input: PreviewReadInput): Outcome<PreviewReadInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：SDK须明确只读/no-effect；有副作用的能力本轮blocked，不能按query绕过结果门控。


### PreviewResultView

职责：只读预览安全结果。唯一定义路径：src/materials/preview_boundary.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 只读预览安全结果。 */
interface PreviewResultView {
  /** 独立访问与新鲜度 */ readonly surface: ReadSurface;
  /** 仅当前获准时非null */ readonly reference: PreviewReference | null;
  /** 正式redacted预览，非raw正文 */ readonly summary: SafeDisplayContent | null;
  /** 正式受控host入口；无URL */ readonly openRef: ExternalHandle<"controlled_open"> | null;
  /** 正式独立Artifact来源 */ readonly provenance: ProvenanceMetadata | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| surface | ReadSurface | 独立访问与新鲜度 |
| reference | PreviewReference \| null | 仅当前获准时非null |
| summary | SafeDisplayContent \| null | 正式redacted预览，非raw正文 |
| openRef | ExternalHandle<"controlled_open"> \| null | 正式受控host入口；无URL |
| provenance | ProvenanceMetadata \| null | 正式独立Artifact来源 |

工厂完整签名：PreviewResultViewFactory.create(input: PreviewResultView): Outcome<PreviewResultView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：not_visible/blocked/unavailable清reference/summary/openRef/provenance；openRef非null须正式SDK及host双方能力，不能从ref生成地址。


### DiagnosticContext

职责：用户支持操作的低敏诊断输入。唯一定义路径：src/sdk/diagnostic_handoff_adapter.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 用户支持操作的低敏诊断输入。 */
interface DiagnosticContext {
  /** local去重ID非业务key */ readonly requestId: LocalId<"diagnostic">;
  /** 当前local session */ readonly sessionEpoch: SessionEpoch;
  /** 有限允许诊断分类 */ readonly category: "capability" | "continuity" | "local_failure";
  /** 允许的安全code */ readonly reason: SafeReasonCode;
  /** 明确支持操作，不自动发送 */ readonly userRequested: true;
  /** 批准config，无设备标识 */ readonly platform: PlatformKind;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| requestId | LocalId<"diagnostic"> | local去重ID非业务key |
| sessionEpoch | SessionEpoch | 当前local session |
| category | "capability" \| "continuity" \| "local_failure" | 有限允许诊断分类 |
| reason | SafeReasonCode | 允许的安全code |
| userRequested | true | 明确支持操作，不自动发送 |
| platform | PlatformKind | 批准config，无设备标识 |

工厂完整签名：DiagnosticContextFactory.create(input: DiagnosticContext): Outcome<DiagnosticContext>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：不得携带text/ownerref/actorref/token/URL/stack/日志；schema严格拒绝额外字段；本轮不自动重发。


### DiagnosticHandoffView

职责：诊断交付姿态。唯一定义路径：src/sdk/diagnostic_handoff_adapter.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 诊断交付姿态。 */
interface DiagnosticHandoffView {
  /** 关联一次local请求 */ readonly requestId: LocalId<"diagnostic">;
  /** 正式sink receipt/副作用未知/关闭/缺合同 */ readonly status: "accepted" | "unknown" | "disabled" | "blocked";
  /** accepted仅正式SDK receipt */ readonly receiptRef: ExternalHandle<"diagnostic_receipt"> | null;
  /** 有限安全原因 */ readonly reason: SafeReasonCode | null;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| requestId | LocalId<"diagnostic"> | 关联一次local请求 |
| status | "accepted" \| "unknown" \| "disabled" \| "blocked" | 正式sink receipt/副作用未知/关闭/缺合同 |
| receiptRef | ExternalHandle<"diagnostic_receipt"> \| null | accepted仅正式SDK receipt |
| reason | SafeReasonCode \| null | 有限安全原因 |

工厂完整签名：DiagnosticHandoffViewFactory.create(input: DiagnosticHandoffView): Outcome<DiagnosticHandoffView>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：accepted不证明观测报告/evidence/验收；unknown不得自动重送；disabled/blocked无receipt。


### LocalConfigInput

职责：本地配置解析输入。唯一定义路径：src/config/config_loader.ts；Chat-local carrier，不是SDK wire DTO。

```ts
/** 本地配置解析输入。 */
interface LocalConfigInput {
  /** 批准local profile别名，不是endpoint */ readonly profileId: string;
  /** 输入schema版本 */ readonly schemaVersion: 1;
  /** 仅此local严格parser边界允许unknown */ readonly value: unknown;
}
```

| 字段 | 类型 | 作用/约束/来源 |
|---|---|---|
| profileId | string | 批准local profile别名，不是endpoint |
| schemaVersion | 1 | 输入schema版本 |
| value | unknown | 仅此local严格parser边界允许unknown |

工厂完整签名：LocalConfigInputFactory.create(input: LocalConfigInput): Outcome<LocalConfigInput>；由具名caller构造typed input或SDK/host已qualify mapper构造safe输出，纯结构/条件校验，无IO、不赋予资格；immutable value无独立transition成员或状态机。缺字段invalid_input，缺正式资格authority_missing，未绑定dependency_unbound，错当前语境context_changed。

不变量：ConfigLoader.validate严格校验ClientConfig所有字段、未知键与有界数值；未定生产确值不可绕过04；不读取secret/网络。


### 6-E模块内停审

宿主generation/session和批准binding独立验证，preview只有正式无副作用能力；diagnostic仅严格低敏allowlist，结果不产生证据。配置unknown限定local parser。planned切口：旧probe、伪origin、hidden preview、诊断额外字段、配置secret键；未运行。local载体通过，HOST/CHAT-UP004/007/配置确值仍blocked，进入6-F。

## 20. 6-F 支撑类型与跨模块闭口

### 20.1 Dependency records唯一归属

以下每个Deps在所属对象责任文件定义readonly interface，字段名/类型为下表完整schema；无额外可写状态、默认client或service locator。对应Object.create(deps: NamedDeps)逐字段注入，缺依赖启动dependency_unbound；这不是owner DTO。SDK的真实export未定，SdkPublicClient/SdkOpaqueValue仍是blocked编译绑定参数位，不能用unknown替代正向实现。

| 独立Deps | 完整字段schema | 定义位置 |
|---|---|---|
| RouteCoordinatorDeps | store: ClientStatePort; entries: EntryAccessPort; identity: LocalIdentityPort; visibilityGuard: VisibilityGuard; scopeGuard: ScopeEntryGuard | navigation/route_context_coordinator.ts |
| CollaborationCoordinatorDeps | reads: CollaborationReadPort; store: ClientStatePort; materials: SafeMaterialComposer; assembler: PageViewModelAssembler | collaboration/collaboration_surface_coordinator.ts |
| ProjectContextCoordinatorDeps | store: ClientStatePort; reads: CollaborationReadPort; identity: LocalIdentityPort; materials: SafeMaterialComposer | collaboration/project_context_coordinator.ts |
| ProcessDrilldownCoordinatorDeps | store: ClientStatePort; reads: CollaborationReadPort; identity: LocalIdentityPort; materials: SafeMaterialComposer | collaboration/process_drilldown_coordinator.ts |
| DirectoryCoordinatorDeps | store: ClientStatePort; reads: CollaborationReadPort; identity: LocalIdentityPort; materials: SafeMaterialComposer | collaboration/directory_coordinator.ts |
| IntentCoordinatorDeps | store: ClientStatePort; commands: IntentCommandPort; probes: IntentProbePort; identity: LocalIdentityPort; guard: VisibilityGuard | intents/user_intent_coordinator.ts |
| DraftCoordinatorDeps | drafts: DraftPort; store: ClientStatePort; policy: DraftPolicy; identity: LocalIdentityPort | intents/draft_coordinator.ts |
| ChangeReducerDeps | store: ClientStatePort; qualification: ChangeQualificationPort; materials: SafeMaterialComposer | continuity/change_reducer.ts |
| ResumeCoordinatorDeps | store: ClientStatePort; resumes: ResumePort; reads: CollaborationReadPort; identity: LocalIdentityPort | continuity/resume_coordinator.ts |
| RecoveryCoordinatorDeps | store: ClientStatePort; projections: LocalProjectionRepository; entries: EntryAccessPort; resumes: ResumeCoordinator; intents: UserIntentCoordinator; eviction: CacheEvictionCoordinator | continuity/recovery_coordinator.ts |
| EvictionCoordinatorDeps | store: ClientStatePort; projections: LocalProjectionRepository; feeds: ChangeFeedPort | local_state/cache_eviction_coordinator.ts |
| ShellCoordinatorDeps | store: ClientStatePort; feeds: ChangeFeedPort; recovery: RecoveryCoordinator | platform/shell_lifecycle_coordinator.ts |
| AccessibilityAdapterDeps | port: AccessibilityPort; identity: LocalIdentityPort | platform/accessibility_semantic_adapter.ts |
| SdkQueryAdapterDeps | binding: SdkCapabilityBinding; client: SdkPublicClient | sdk/sdk_query_adapter.ts |
| SdkCommandAdapterDeps | binding: SdkCapabilityBinding; client: SdkPublicClient | sdk/sdk_command_adapter.ts |
| SdkChangeAdapterDeps | binding: SdkCapabilityBinding; client: SdkPublicClient | sdk/sdk_change_adapter.ts |
| SdkReferenceAdapterDeps | binding: SdkCapabilityBinding; client: SdkPublicClient | sdk/sdk_reference_adapter.ts |
| DiagnosticAdapterDeps | binding: SdkCapabilityBinding; client: SdkPublicClient | sdk/diagnostic_handoff_adapter.ts |

字段注释规则：store/drafts/projections为唯一local读取写入入口；reads/entries/probes为SDK安全读取；commands为唯一受控发送；qualification/resumes/feeds为正式变化资格；identity仅local ID；guard/policy/materials/assembler为纯策略；platform/port为host能力；client仅正式SDK export；binding为私有资格registry。每字段必须带此语义JSDoc，readonly不是权限证明。

### 20.2 载体构造与安全分支审计

| 对象组/本Step唯一定义 | 完整构造来源 | 必填/nullable分支 | 下步承接 |
|---|---|---|---|
| §15入口前五载体 | trusted session+local route request → SDK resolver资格 | hidden清fence/source/entry/target；requestFence仅local关联 | EntryAccessPort.resolve |
| §15分页/读surface | 当前root槽位+SDK lineage/ReadSurface | SurfaceReadProjection/TurnPageProjection/ConversationSurfaceViewModel.contextRef可null；hidden/blocked/unavailable清ref/parent/turns/cursor/provenance；visible/empty须formal context且empty保留正式资格 | CollaborationReadPort |
| §16八查询/section | 正式Work/Process/provider与各owner qualified section | 无provider不构造owner；无父revision不下钻；nested sections不能借父source资格 | 具名read方法 |
| §17提交/结果 | user frozen revision+SDK no-effect prepare+formal authority | dispatch前association；未知结果不得填terminal；明确确认receipt可无resultRef | Command/Probe ports |
| §18变化/恢复/清理 | SDK change identity、source与coverage；local分区version | unsupported仅reason；scope revoke不依赖已关闭slot；resume complete须revision/coverage | Qualification/Resume/feed |
| §19host/preview/diagnostic/config | 可信host/composition、SDK预览/诊断、local parser | preview缺contract无open；diagnostic禁正文；unknown仅local config parser | host/reference/config |
| 20.1 Dependencies | composition显式注入 | SDK正向type缺失blocked adapter可返回error，不能构造假client | 全部consumer-defined ports |

pre-entry所有applyEntryResult/evaluateEntry/evaluateThread改用QualifiedEntryResolution，不能在还未得到scope时先造ContextFence。ResultAuthority代码声明唯一在§17；LocalPage/ReadSurface唯一在§15，Step7仅引用。src/sdk/为唯一adapter路径，本轮新增卡中路径同步至Step4。Recovery inputs同样唯一在§18，Step8不再定义第二schema。

### 20.3 dispatch前不可逆调用保护

每logical intent先以CAS写入draft attempt/占位；SDK.prepare正式保证无业务副作用后绑定association；**在调用dispatch之前**，再次CAS预留dispatched=true/submitted（保守表示可能已发起）及association。reservation胜出者才允许调用dispatch一次，CAS失败没有调用权。未调用且明确no-effect可failed；调用开始后除正式no-effect证明外只能unknown。CAS后的进程中断允许保守unknown，不能恢复后再发同一attempt。普通receipt不能terminal；回包CAS失败只重读本地并门控，不重发。

AttemptFactory.reserveDispatch(attempt: CommandAttemptState, prepared: PreparedCommand): Outcome<CommandAttemptState>在intents/command_attempt_state.ts定义；仅draft且association/actor/fence/intent全部registry匹配，产生submitted/dispatched=true/nextAction=wait，无IO。AttemptFactory.failBeforeDispatch(attempt: CommandAttemptState, reason: SafeReasonCode): Outcome<CommandAttemptState>仅draft且dispatched=false → failed/none；post-dispatch禁止调用。markSubmitted只应用已预留attempt的submission，不赋予第二次dispatch权。

### 20.4 gate记录与回填草稿

诊断：旧Step6虽有主对象，部分参数载体/前入口资格和空值分支不足以逐函数实现。修正：按6-A～E独立卡补齐，不另建替代文档；6-F补Deps、唯一定义和dispatch reservation。取舍：本地schema完整，外部真实类型及正向binding继续blocked；不把SDK缺口当local字段缺口。

CHAT-DDD-006-CARRIER-001：closed_design（仅本地载体/构造闭口）；CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、host/storage/config/quality继续open。设计审计通过不表示代码/测试通过。回填草稿为§2～20对象及本闭口表，正式03保持historical_material。下一动作：阅读Step7规范、Governance Step7、现有prefix与真实SDK出口，再按模块完成Step7；未运行测试、未提交。

### 20.5 Step9/10函数与状态闭口补充

ProjectNavigationState只有SelectionPhase，**五个**page VM（ProjectDetail/ProcessFlow/NodeDetail/ProjectConversationLink/CompanyDirectory）使用PageLoadPosture；六新增对象包括navigation，不能把navigation伪写PageLoad主体。

各对象完整pure失败成员由对应Factory定义（无IO、不扩大access、current slot不匹配时context_changed，unsafe error清引用）：
- ProjectDetailFactory.failLoad(view: ProjectDetailViewModel, error: ChatError, current: ClientConsumptionContext): Outcome<ProjectDetailViewModel>
- ProcessFlowFactory.failLoad(view: ProcessFlowViewModel, error: ChatError, current: ClientConsumptionContext): Outcome<ProcessFlowViewModel>
- NodeDetailFactory.failLoad(view: ProcessNodeDetailViewModel, error: ChatError, current: ClientConsumptionContext): Outcome<ProcessNodeDetailViewModel>
- ProjectConversationLinkFactory.failLoad(view: ProjectConversationLinkViewModel, error: ChatError, current: ClientConsumptionContext): Outcome<ProjectConversationLinkViewModel>
- CompanyDirectoryFactory.failLoad(view: CompanyDirectoryViewModel, error: ChatError, current: ClientConsumptionContext): Outcome<CompanyDirectoryViewModel>

failLoad统一映射dependency_unbound/authority_missing/access_denied/unsafe_material→blocked并清受影响引用；aborted_read/context_changed不应用旧结果（Outcome.error而非修改新view）；local_conflict只重读，无失败覆写；仅确认为当前只读依赖暂不可用dependency_unavailable/platform_unavailable/storage_unavailable→unavailable；continuity_gap→stale，保留获准安全section；部分独立section失败且主访问可读→partial（不得将未获授权内容保留）。Unavailable不代表missing。加载开始只当前新请求factory/updateSearch，不缓存升级。每VM.clear/restrict/parent invalidation分别按已有函数。

Sdk preview没有PreviewBoundary.evaluate，唯一开入口判断isOpenable；Feedback唯一定义IntentFeedbackFactory.fromAttempt/applyAttempt。本轮fromGovernance补safe Gate/action关联、root.conversationLinks用于群聊关系、目录pageInfo和repository.save(fence)的反向修正均为设计contract闭口，SDK/provider未确认仍blocked。

### 20.6 状态矩阵同步与local limit来源

Step10正式使用SafeMaterialFactory.fromQualified/restrict/clear/markFreshness；Feedback为IntentFeedbackFactory；AccessPostureFactory.markUnavailable只技术安全收紧；DraftFactory.releaseSubmission只已正式failed/rejected且同稿，submitting→editing，再validate，不允许直接submitting→locally_valid。fromDraft仅Conversation、fromGovernance完整Gate/action关联；所有nullable/negative表面与Step8字段表一致。

LocalPageRequest.limit校验明确为positive safe integer且不超过ClientConfig.maxCachedEntries这一已存在local资源上界；owner正式分页限值仍SDK合同校验。无需实现猜一个未定义maxPageSize配置，也不把local limit当owner接受保证；确值仍04等待。

本Step完成并被Step7～10承接，local carrier缺口closed_design；后续状态审计闭口没有关闭任何SDK/provider/host/storage上游blocker。本轮Step10停审，原§20.4“下一动作Step7”仅为当时串行门禁记录，恢复点以项目台账/03flow当前状态为准。
