# L6-bridges 03 Step8：共享协议、metadata与codec

## 1. G0范围、来源与写入许可

主文件§3.1/4/6的G0问题/诊断/取舍已done。这里只闭口跨族结构；不定义Command业务body、Event payload、Job业务或新port。未来源码归属沿Step4已有`crates/contracts/src/shared/metadata.rs`、`shared/outcomes.rs`、`commands.rs`、`queries.rs`；API codec/mapper沿`management.rs`、`query.rs`、`platform.rs`。路径是计划，不是已存在源码。

依赖方向：Contracts -> 已核core；API/Jobs/Infra -> Contracts及各自既有Application输入；Contracts不接收Application helper/Domain模型/private lease。本文全部Rust为设计声明，未实现或编译。

## 2. Version与finite结构失败

### BridgeProtocolVersion

唯一计划归属`shared/metadata.rs`，本地规范化协议版本，不等Slack/Bot API/Mattermost server/Discord API版本，不等producer schema revision。

```rust
/// Bridges本地公开协议的封闭版本，不选择foreign API或产品pin。
pub enum BridgeProtocolVersion {
    /// 当前唯一设计的bridge.v1字段集合，未知版本不得fallback。
    V1,
}
```

exact wire token为`bridge.v1`。所有族先核version与fixed surface，再解析对应body；不accept `v1`、整数1、空值、大小写/trim别名或future标签。decoder产品尚未选择，必须实现本契约才可绑定。

### BridgeProtocolIssueKind / BridgeProtocolArea / BridgeProtocolError

唯一计划归属`shared/outcomes.rs`；不是业务lifecycle、provider原错误或自动retry class。

```rust
/// 公共协议失败分类，只含有限标签，不接raw错误、字段值或审批内容。
pub enum BridgeProtocolIssueKind {
    /// 缺当前surface必填字段，在接管前拒绝。
    MissingRequiredField,
    /// 未定义或重复JSON字段，不静默忽略。
    UnknownOrDuplicateField,
    /// typed字段、enum载荷或条件optional组合不合法。
    InvalidShape,
    /// 本地协议或正式来源schema不支持，禁止payload fallback。
    UnsupportedVersion,
    /// 固定surface与具体body/来源模式不匹配。
    WrongSurface,
    /// metadata重复承载或违反本族key/page/trace限制。
    InvalidMetadata,
    /// forbidden body/token/secret/private URL或其可还原派生材料。
    ForbiddenMaterial,
    /// actor/source/current披露资格未成立，不泄漏存在性。
    NotAuthorized,
    /// 已核同义键、版本轴或原subject条件冲突，无winner材料。
    Conflict,
    /// 必要正式来源、codec、adapter或runtime未建立。
    DependencyUnavailable,
    /// 原local/foreign结果未知；不能推出无效果或盲重试。
    OutcomeUnknown,
}

/// 只标调用方自己提供的结构层，不输出自由字段路径或hidden subject。
pub enum BridgeProtocolArea {
    /// 外层协议/版本/固定surface。
    Envelope,
    /// 本族唯一metadata。
    Metadata,
    /// 当前具体typed body。
    Body,
}

/// 无raw cause、ref/count、retry bool或stack的安全协议失败。
pub struct BridgeProtocolError {
    /// 有限结构或接缝失败标签，不能承诺业务终态。
    issue: BridgeProtocolIssueKind,
    /// 固定结构区域，不反射输入内容。
    area: BridgeProtocolArea,
    /// 既有安全原因，隐含敏感细因必须降为Unauthorized/MissingContract。
    reason: SafeReasonCode,
}
```

| 完整签名 | Rustdoc / 约束 |
|---|---|
| `pub fn from_parts(issue: BridgeProtocolIssueKind, area: BridgeProtocolArea, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验下表finite配对并完整复制；零IO、无authority/ID/result生成。 |
| `pub fn issue(&self) -> &BridgeProtocolIssueKind` | /// 借用有限标签，不公开raw source。 |
| `pub fn area(&self) -> &BridgeProtocolArea` | /// 借用固定结构区域。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用已清洗原因，不由错误字符串重分类。 |

| issue | 唯一允许reason / 处理上限 |
|---|---|
| MissingRequiredField / UnknownOrDuplicateField / InvalidShape / WrongSurface / InvalidMetadata / ForbiddenMaterial | InvalidInput；不得回显值、raw key、unknown tag或body片段。 |
| UnsupportedVersion | UnsupportedVersion；不解析不支持的payload，不存raw隔离材料。 |
| NotAuthorized | Unauthorized；不含hidden ref/count、found状态或细化敏感reason。 |
| Conflict | Conflict；仅current已允许披露冲突时给该标签，否则NotAuthorized。 |
| DependencyUnavailable | MissingContract或DependencyUnavailable；scope不公开时改NotAuthorized。 |
| OutcomeUnknown | OutcomeUnknown；API可只给有限失败，但必须先把完整original留在本地actual调用/恢复责任中。 |

没有`Other(String)`、默认variant或Error::source。协议拒绝本身不创建quarantine artifact、audit、evidence或dedup；只有所属Application已经实际安全接管才能保存允许的local record。

## 3. Command与Query wrapper

Command wrapper唯一归属`commands.rs`，Query wrapper唯一归属`queries.rs`。不把ActorContext/Trusted*Context放入client wire；caller principal由已认证host单独移交Step7上下文。core actor只是carrier，owner授权仍须current qualification。

```rust
/// 固定六Command的typed外层；不接任意operation字符串或自报actor。
pub struct BridgeCommandRequest<T> {
    /// 当前本地协议版本，先于具体body验证。
    version: BridgeProtocolVersion,
    /// 唯一core命令metadata，required key只在request.idempotency_key。
    metadata: CommandMetadata,
    /// 当前fixed route对应的具体Contracts DTO，不是Application input。
    body: T,
}

/// 六Command共用的已过滤稳定输出，无global success或新result id。
pub struct BridgeCommandResponse {
    /// 与本次协议一致的本地版本，不由外部ACK生成。
    version: BridgeProtocolVersion,
    /// 唯一Step6非泛型结果，local/duplicate/unknown/拒绝各自保留。
    result: BridgeCommandResult,
}

/// 固定四Query的typed外层，metadata仅含只读偏好。
pub struct BridgeQueryRequest<T> {
    /// 当前本地协议版本，未知标签拒绝。
    version: BridgeProtocolVersion,
    /// 唯一core查询metadata；body不能再携page/consistency/key。
    metadata: QueryMetadata,
    /// 唯一typed subject选择，不带probe/refresh/repair开关。
    body: T,
}

/// 四Query共用的唯一稳定read结果，不导出repository page。
pub struct BridgeQueryResponse {
    /// 与本次请求一致的本地版本。
    version: BridgeProtocolVersion,
    /// 已经current过滤的既有view或finite missing/不可见/不可用。
    result: BridgeReadResult,
}
```

| 类型 / 完整签名 | 中文Rustdoc / factory与消费面 |
|---|---|
| `BridgeCommandRequest<T>::from_parts(version: BridgeProtocolVersion, metadata: CommandMetadata, body: T) -> Result<Self, BridgeProtocolError>` | /// 完整接纳并校wrapper metadata；T必须先经所属DTO factory，不在generic wrapper内猜业务/取得权限。 |
| `BridgeCommandRequest<T>::into_parts(self) -> (BridgeProtocolVersion, CommandMetadata, T)` | /// 一次性移交同一三字段，不Clone private/context或替换metadata。 |
| `BridgeQueryRequest<T>::from_parts(version: BridgeProtocolVersion, metadata: QueryMetadata, body: T) -> Result<Self, BridgeProtocolError>` | /// 完整接纳只读metadata和已校typed body；不解析scope或启动维护。 |
| `BridgeQueryRequest<T>::into_parts(self) -> (BridgeProtocolVersion, QueryMetadata, T)` | /// 一次性移交原三字段，保持query origin。 |
| `BridgeCommandResponse::from_result(version: BridgeProtocolVersion, result: BridgeCommandResult) -> Result<Self, ContractViolation>` | /// 核原结果结构并复制；只有Application当前过滤结果可进入，不用port error造view。 |
| `BridgeQueryResponse::from_result(version: BridgeProtocolVersion, result: BridgeReadResult) -> Result<Self, ContractViolation>` | /// 核原read结构；不直接接受Domain/private snapshot或Page。 |
| 两response的`pub fn version(&self) -> &BridgeProtocolVersion` | /// 借用原协议版本。 |
| `BridgeCommandResponse::result(&self) -> &BridgeCommandResult` | /// 借用原已过滤结果，不增加authority。 |
| `BridgeQueryResponse::result(&self) -> &BridgeReadResult` | /// 借用原只读结果，不触发查表或probe。 |

wrapper固定字段`version/metadata/body`，响应固定`version/result`；无可选result_ref、actor、authority、digest、job_run_id、http_success或顶层key/trace。

## 4. 实际core metadata逐字段guard

真实定义来自`quantalithos-core/crates/contracts/src/metadata.rs`，不在Bridges复制第二个RequestMetadata。以下是该carrier在当前Bridges surface上的**准入限制**，不是修改core schema。

| core字段 | C01~06 | Q01~04 | 来源 / 不得替代 |
|---|---|---|---|
| request.request_id | 必填，合法有界pointer | 同左 | actual caller/可信入口，非local operation/dedup/effect。 |
| request.trace_id | 必填，入口同源重验 | 同左 | 原trusted trace关联；不入semantic key/meaning。 |
| request.idempotency_key | 必须Some且有界body-free | 必须None | C仅此authority；不得复制到body/header另一字段，Q不得reserve。 |
| request.requested_at | 必填合法core Timestamp | 同左 | caller请求时刻，不作为actual clock/owner版本/顺序。 |
| CommandMetadata.reason | 当前六surface必须None | 类型本来不存在 | 不接自由文本审批/说明；拒绝Some，不能静默丢字段。 |
| CommandMetadata.external_ref | 当前六surface必须None | 类型本来不存在 | 业务basis已有具名字段，不把自由外链当source/authority；拒绝Some。 |
| QueryMetadata.page | 类型不存在 | 必须None，core类型为Option | 不提供public分页协议，Some在dispatch前InvalidMetadata；body里出现page同样拒绝。 |
| QueryMetadata.consistency | 类型不存在 | Eventual或Strong原值 | 只限制local读取；Strong只有实际同driver一致读取满足本地要求才可View，否则Unavailable；不请求owner/platform刷新或承诺跨域线性一致。 |

原SDK要求job_run_id只适用于已绑定SDK job surface。本地J使用既有JobContinuityMetadata/Jobs plan，没有SDK job facade或run authority；不为满足SDK包装伪造run。若未来增加SDK facade，先核兼容和边界，不隐式改变当前协议。

ActorContext与role_refs只从host；外部OAuth/bot token/PAT不等内部授权，metadata shape也不授scope。ActorRef用于C03 identity提案时`display_name=None`，actor_kind只候选，GlobalMember只能已有正式身份。

### 4.1 actual core传递schema与本地准入

X实际回读core `actor.rs`全文及`metadata.rs` string_newtype、QueryConsistency、Request/Command/QueryMetadata、PageRequest/PageToken相关定义。六core reexport只是设计图的foreign叶节点，不能当其传递字段已由Bridges定义；以下按actual原schema补明确消费，不增加本地声明或修改core。core默认serde/Debug/Display是原类型能力，不是Bridges日志、外显或自由反序列化许可。

| actual core type / exact schema | Bridges唯一codec / authority规则 |
|---|---|
| ActorRef `{actor_id: ActorId, actor_kind: ActorKind, display_name: Option<String>}` | actor_id为正式既有受权pointer；C03候选经ActorResponsibilityPort核；display_name必须null，Some拒绝，不静默去名或将任意外部ID升格actor。 |
| ActorKind `Human / AiMember / System / Integration` | 沿actual serde的四个字符串`human / ai_member / system / integration`，不是本地tagged enum；kind是候选，System/Integration不默认豁免Gate。 |
| RequestMetadata `{request_id: RequestId, trace_id: TraceId, idempotency_key: Option<IdempotencyKey>, requested_at: Timestamp}` | 严格原四字段；前三种string_newtype透明body-free pointer，key按C/Q表；Timestamp透明有效RFC3339 UTC字符串，原值保留，不从now替换caller时刻。core new不能证明值合法或来源。 |
| CommandMetadata `{request: RequestMetadata, reason: Option<ChangeReason>, external_ref: Option<ExternalReferenceRef>}` | exact三字段；reason/external_ref必须null。ChangeReason actual `{value:String}`及ExternalReferenceRef透明String是原schema，但本surface不解析或接纳非null载荷，不消费自由说明/URL或敏感材料。 |
| QueryMetadata `{request: RequestMetadata, page: Option<PageRequest>, consistency: QueryConsistency}` | exact三字段；page必须null；consistency仅actual scalar `strong / eventual`，不接受tagged object、别名或自报owner强一致。 |
| PageRequest `{limit:u32, page_token:Option<PageToken>}`；PageToken透明String | actual schema不变，但四Q的page只允许null，任何非null页面在dispatch前拒绝；不映射repository cursor、平台offset或新public page。 |
| ActorId / RequestId / TraceId / IdempotencyKey / Timestamp / RoleRef | actual string_newtype含`new/as_str/into_inner`，不在Bridges复制；仅按原构造方法和已校准入消费，禁止直接使用Display/Debug作日志。RoleRef只host的提示，不是grant。 |
| ActorContext `{actor:ActorRef, delegated_by:Option<ActorRef>, role_refs:Vec<RoleRef>, request_origin:RequestOrigin}` | outer actual认证host独立移交，绝不client wire；RequestOrigin沿原Command/Query/Job/Operations，必须固定入口匹配。委托与roles仍由正式resolver/current核，不以hint授scope。 |

foreign两种enum的scalar codec是下节本地tagged enum规则的明确例外，不改变core serde，不新增CoreActorKind或第二Metadata。core结构及任意String合法不证明body-free/authority；binding规定的字节长度、pointer来源/解析及trace关联必须current核准，未建立则对应surface不可运行。

## 5. 唯一JSON codec与decode/encode限制

API若选择JSON transport必须满足此表；serde/HTTP/router产品仍未选。typed library面保持同schema；foreign平台raw协议不能套本codec伪装成已验证safe envelope。

| 类型形态 | exact wire规则 | 拒绝 / 缺失 |
|---|---|---|
| struct | 原字段名snake_case；exact字段集合；所有非Option字段存在 | duplicate key、unknown key、null必填、大小写/trim alias全拒绝，不反射raw key。 |
| Option<T> | 必须有该字段，值为null或完整T；省略字段仅由所属surface显式允许 | 不把空字符串/0/空object当None，不在DTO到Domain间改变optional。 |
| tuple newtype / alias | 单字段newtype透明编码为inner；typed ref等结构原样完整递归 | wrong-kind不能把同inner值强转；alias只复用唯一schema。 |
| LocalObjectId | exact 16字节的32位lowercase hex字符串；全零拒绝 | 不接u128 JSON number、UUID别名或从external_id/trace/body hash生成。 |
| u64版本、SafeInstant毫秒 | base-10无前导零字符串，0仅类型允许；无指数/正负号 | 防精度丢失；config/generation/local/cursor/lane轴不能强转，毫秒不推业务顺序。 |
| u32计数、bool | 有界整数或JSON boolean原类型 | 不接受float/string bool；count只获准local可见集合，hidden不是假0。 |
| 本地enum | `{"kind":"exact_snake_case_variant","data":...}`；unit分支data=null；tuple分支为完整inner；struct分支为其exact字段object | 未知tag、混variant字段、丢required载荷、Other/default全拒绝。BridgeProtocolVersion单独用`bridge.v1`；actual core ActorKind/QueryConsistency仅§4.1规定的原scalar codec。 |
| Vec/set | 数组；原type要求的bounded、unique/order规则 | 不越过qualified byte/item预算；不猜排序或把空set当hidden。 |
| SafeOpaqueId/SafeRevision/core string wrapper | 保留正式来源原pointer，非空/无控制字符/source规定长度界限；core Timestamp按实际UTC合法格式校验 | 字符串格式不是body-free/authority证明；正式source/resolver须重验，拒绝raw正文/token/secret/privateURL及其hash/base64影射。 |

codec只取每个Step6 safe carrier的原字段/getter并调用原factory；不直接derive任意资格为Established，不解析ref文本推scope。source-specific typed ref最大长度、HTTP byte/time预算、codec产品pin必须由strict binding提供；未建立则runtime不可用，不用宽松默认。Unknown-field日志只写finite issue/area，绝不带输入值、token、secret、message body或敏感审批内容。

本地协议版本与upstream source schema分开。新增不兼容字段/enum不是V1“兼容接受”，须新version并重核mapping/retained result/canonical compatibility；当前无V2声明或自动迁移。

## 6. finite错误、取消与HTTP边界

| 边界 / actual输入 | API可见输出 | 不得丢失 / 不得推论 |
|---|---|---|
| pre-dispatch decode/metadata/shape失败 | ProtocolError，HTTP400；UnsupportedVersion/WrongSurface也400 | 零业务接管/record/result，不存raw证据；source签名failure由平台专属映射。 |
| principal/runtime失败 | NotAuthorized/DependencyUnavailable，HTTP403/503 | 不披露subject存在；没有原effect证明时不自动retry。 |
| Application stable C/Q结果 | 原BridgeCommandResponse/BridgeQueryResponse，逐族有限status表 | HTTP200不等owner accepted/外部送达；不能用状态码覆盖result。 |
| BridgePortError::Conflict | 仅current可披露时ProtocolError Conflict，HTTP409；否则403 | 不导出BridgeLocalConflict或winner refs。 |
| BridgePortError::Indeterminate(original,phase) | 能由Application输出已过滤Indeterminate则使用；outer只能有限OutcomeUnknown，HTTP202 | outer mapper零IO不能造view；完整original/phase由actual调用宿主保留到同op恢复/停止责任，不能因响应删未知。 |
| post-effect Cancelled/timeout/disconnect | 原known结果或Indeterminate(original)，仍按未知映射 | 不允许把无original的Cancelled/Unavailable当权威无效果；不变更key/op/target继续。 |
| Query外层来源/读取失败 | Unavailable或finite错误；无新view | no audit/dedup/UoW write/refresh/probe/repair，503不授权写fallback。 |

实际未建立HTTP listener/server。进入平台的ACK不使用本表通用status；只有platform host按原ProtocolAckPlan执行actual ACK，具体版本/source及deadline在E1展开。safe结果只供已授权内部消费者，不能向平台直接序列化owner/approval/internal refs。

## 7. G0复杂度、草稿与自检

复杂度：共享八个新声明只封版本/失败/Command-Query外层，业务body留所属族；无新业务port、authority、public page或run truth。所有其他ref/state/result/slot唯一复用Step6，函数Future/错误只仓内消费Step7。

草稿承接未来正式03§7共享协议：finite bridge.v1、原core metadata与actual principal分离、strict typed codec、安全失败及post-effect original保持；业务schema不由wrapper自动授权。Rust声明/表就是草稿来源，过程记录不进正式正文。

人工设计自检：wrapper完整factory/一次性消费/只读response面、metadata单authority、Contracts依赖方向和no raw error成立；静态审计须在主文件记录实际结果后才开放C1。计划测试仍`crates/contracts/tests/protocol_surface_tests.rs`及API既有tests：未知version/tag/field、duplicate字段、缺key、Q带page/key、source/schema混用、forbidden材料、post-effect original保留。全部planned / 未执行。
