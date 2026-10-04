# L6-bridges 03 Step17：实施承接与跨文档一致性复核

## 1. 开工确认

2026-10-04；已读SOP17全文/书写§5.16、中间产物§5.10全文、实施书写§4.9完整提交规则及项目git/实施台账前置、Rust源码语言/Rustdoc、真相源phase/scope闭包及既有卡/协议/flow/机/持久化/Step16和正式00§14全部38AC。当前只03承接设计；不写07/实施台账/boundary/实现文件或提交，未运行测试。BR-UP、原WS/Observability状态不变。

## 2. 模块计划

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| H1 truth / fields / DTO / Query / transitive closure | done | done | pass_design | pass | 进入H2 |
| H2 state / naming / phase / downstream handoff | done | done | pass_design | pass | 进入X |
| X cross-document audit | done | done | pass_design_static | pass | enter_step18 |

当前03/Step17/complete，gate_status=pass，gate_reason=implementation_handoff_design_input_review_pass，next_allowed_action=enter_step18；当步语义写入关闭，不代表implementation readiness，commit_required=false。

## 3. H1 可审查设计记录

问题1/4~6/11~12：全部19Domain model的191字段均有原typed源/完整factory参数或固定state/local初值；重建全字段只实际store basis，不能API自报。wire body只提供请求意图，Config/Policy/actor/material/secret/known/coverage/current由正式port或原repository补齐；缺资格是有限拒绝/blocked而非placeholder。Query六字段/18subject/ref解scope/Stage/visibility/marker全来自原完整committed snapshot与current，没有public page或持久projection ID。

诊断：把Step6完整factory缩为DTO类型名、把191字段只数总数、把Plan/Action单root缺失用dummy Intent补，会让实现者猜。以中间产物§5.10十类输出进行复核：逐字段附录机械保原字段/类型/来源，输入到factory与查表/current/生成规则独立表，状态/naming/phase另H2。共用private/support与public传递类型仍原完整卡，不能把Bridges需求名当上游导出。

取舍：只交设计输入，不给implementation verdict。00~02已认可，正式03待Step19装配；05/06旧正文historical_material、04/07未建，各自完整闭环必须以后逐文档停审，03当前复核不代替它们。真实core共享类型可检索与兼容/build资格分开；产品/owner正式不足保持BR-UP open。复杂度：main十类闭环表+191字段附录，不创造TC/EV/run/commit编号。

## 4. H1 真相源、字段与协议闭环

### 真相源表

| 设计事实 | 当前真相源 / 已定义位置 | 后续消费者 / 冲突规则 |
|---|---|---|
| 能力/红线/FR/AC/owner与平台非拥有权 | 已认可正式00§7~16；01§6~17；02§4~14 | 03/04/05/06/07；不重开owner边界或以raw协议补权限 |
| 对象/支撑字段/完整factory/成员 | Step6五附录及Step7具名补全；S9/S10/S13修订已同步当前卡 | 正式03§5、05/06/07；当前完整source覆盖旧计数/停审checkpoint；不以历史摘要替schema |
| callable/port/adapter需求 | Step7全签名及修订；Step11九trait/115签名逐字来源 | 正式03§5/6/8/10；Bridges需求不等owner已有同名API，不新增编译边 |
| wire/二级schema/metadata/current safe core | Step8六附录+真实core-contracts export；ManagementBody消费沿当前Step8/13 | 正式03§7与05~07；Contracts不依Domain/Application，私有上下文不出wire |
| flow/actual U/状态/幂等/字段来源 | Step9五附录+shared；Step10五矩阵；Step11~13及两repair | 正式03§8~12；known优先、expiry两key限定、任何新增边需回原source |
| 配置/secret/运行required/观测/测试 | Step14~16当前表；四平台PS登记只公开来源 | 正式03§13~15、04~07；资格未建立不能当selected/installed/tested |
| owner/platform事实和正式authority | 七专项当前正式合同及必要台账；BR-UP、WS/十二affected索引 | 只通过qualified adapter消费；本仓不改它们或复制truth；Chat仍reference_only |
| 测试/证据/验收/phase/commit事实 | 未来正式05/06/07与真实实施台账，不是旧05/06/README | 当前waiting/blocked，不生成TC/EV/run/evidence/verdict/signoff或ready |

### 字段闭环

[逐字段附录](03_ddd_step_17_field_closure.md)覆盖19model全部191字段，逐行保原field/type/来源、factory参数或固定初态/actual local版本、原C/E/J构造来源面、缺失处理、planned target及正式00 AC映射；不是总数替代字段。完整参数/variant/guard仍原卡和Step8/9具名构造表，Step19将同时装配。

所有state初值由factory固定、hydrate只actual存储；local_revision首次1、后续actual UoW CAS，config/generation/cursor/lane各独立轴。所有技术ID由qualified UoW/ID source给入，不从外部ID/trace/body派生；所有业务safe ref/current/claim/known/source来自正式port或完整既有row。Required缺失拒绝；原允许Missing/Stale Slot必须带finite原因并限制所属状态/IO，不默认Established。没有raw private/log/error/evidence字段。

### DTO / Event / Job到Domain构造闭环

| 输入契约 / flow | 目标对象与完整factory | 原wire字段 / 补齐来源 | 不得混同 / 缺失处理 |
|---|---|---|---|
| C01 | BridgeInstallation::configure / apply_revision | draft七字段；installation ID=UoW，qualification=Missing，local初1；原config/local读与expected，current config port | shape!=Qualified，config!=local轴；MissingContract/Conflict，zerosecret/platform IO |
| C02 | ExternalBinding::propose / activate及原成员 | 原proposal两端/actions/actor/authorization Slots；ID/current安装=UoW/read；generation初1/expected checked next；正式activation port | Pending!=已Active；human/AI/Integration责任不互代；无正式两端basis不激活 |
| C03 LinkIdentity/Location | ExternalIdentityMapping::link、ExternalLocationMapping::link | change完整external/actor-kind/internal/parent/basis；binding/generation=current完整row；ID/now=UoW | locator非身份/权限truth；parent Slot非默认root；current不足拒绝 |
| C03 LinkMessage / E01 known / J01 known | ExternalMessageMapping::link_known | 完整locator/source-version/change/owner/effect Slots/generation-direction/origin/basis/result；known owner/platform实际，ID/current/now=UoW/ports | owner accepted!=platform accepted，unknown不造Linked；缺formal mapping/结果不补 |
| E01 Private | InboundHandoffRecord::from_verified与原claim/result成员 | verification/source/origin=PlatformIngressPort；context actor/target/mapping/material/digest=正式owner/private资格；record/op ID/now=UoW；ACK/结果初Slot | 原raw只lease，safe source与actor责任独立；无法typed meaning/source/mapping不durable接管 |
| C04 / E02 | SafePresentationPlan::prepare | source/target/kind来自original body/event；mapping/allowed projection/disclosure/附件/qualified kind/capability/current=PresentationQualificationPort；ID/now=UoW | committed/source!=外显权限；Blocked/Degraded语义精确，不能伪ready/send |
| C04 / E02 | DeliveryIntent::from_plan、必要DispatchLane::for_scope | plan全current->stable source projection/effect；target/kind原意图；lane scope/dependency/rate/budget正式组合；ID/fence/local1=UoW；Absent唯一同U | C/E同effect；LaneRevision!=LocalRevision；缺scope/rate/config proof不Planned |
| J01 | DeliveryAttempt::claim_for | 原intent/effect/current/eligibility/window；claim=Lane/UoW实际fence，ID=UoW；result初Missing，nowactual | reservation/plan!=实际commit，actual B前zero dispatch；缺current/完整bounds停止 |
| J01 / J02 Platform | PlatformReceipt::from_known | 原attempt/effect+actualKnownPlatformBusinessResult完整kind/locator/authority/no-effect/reason；receipt ID=UoW | HTTP2xx/ACK!=Known；NoEffect非普通Rejected推导；unknown无receipt |
| C05 | ExternalActionBinding::bind | body binding/source/target/responsibility，原已known message/intent读取；owner revision/expiry/authorization/current=formal owner；ID/now=UoW、claim初Missing | 签名不授owner action；初绑无callback/action ID前提；缺责任/known/owner proof拒绝 |
| E03 | CallbackHandoffRecord::from_verified及one-use原成员 | 完整platform source+stored action/actor/owner/expiry verification=CallbackVerificationPort；原action/target/claim/current，ID/op=UoW | verified!=审批，actual claim后才owner；claim不可复活或换op |
| 所有actual C/E/J mutation / J05 target expiry | DedupRecord::reserve / 原结果/expire | qualified namespace/key/full meaning/original+正式retention；ID=UoW，result初Missing；expiry proof由ConfigQualificationPort具名取得 | targetbusiness key/op!=Job key/op；保旧window/unknown；TTL不authority、Expired不能重execute |
| E01 Continuity / J03 C / J05 | StreamCursor::initialize / 原成员 | registered namespace-stream/stage/epoch，opaque position/comparator/coverage为原qualified notice/ports/原row，ID/初cursor1/local1=UoW | transport位置!=Owner/Delivery位置；After须full新stage proof，不能字符串比较 |
| E01 Continuity / C06 / J03 | GapRecord::detect / 原attach/coverage成员 | actual notice/cursor/原operation/range/reason；coverage/recovery/window Slots由正式当前或Missing；ID=UoW | full source gap proof!=stage advance；partial/unknown保gap、zero raw replay |
| C06 / J02 / J03 | RecoveryRecord::request / 原成员 | body原subject/original/basis + authoritative qualify_request，资格/probe初Missing、Unresolved及有限reason；ID=UoW | LocalCommit/Owner/Platform/Consumer四authority独立；缺formal只读契约blocked/manual |
| actual C/E/J各阶段 | SafeAuditRecord::from_mutation | BodyFreeMutationMaterial四字段+UoW audit/mutation/op+原trusted trace；schema正式；immutable local1 | raw/hash/敏感审批禁；无实际mutation不补audit，不变evidence |
| 条件O01 / J04 / E04 / J02 Consumer / J05 Handoff | SafeHandoffRecord::from_canonical及原成员 | 原audit、actual canonical/admission/schema/retention/current，claim/consumer初Missing，consumer op/ID=技术reservation/UoW | current static map无Bridges仍blocked；正式非递归结果only不新建producer |

五Job完整public input、Application `BridgeMaintenanceSelection`、Jobs `JobInvocationPlan`及current original/summary来源沿Step8 Job及Step7/9；`JobContinuityMetadata`唯一位于wrapper metadata，trusted job context/basis不进body。不会借future report object或scope字符串补字段。C6/Q4/E4/J5的inputs/全参数都在当前合同，逐主语factory入参扫描除固定state/local_revision无缺。

### Query response / view闭环

四Query共六字段，不生成page/cursor/view identity；request page/key=None，Strong不足Unavailable，subject仅定位先resolver-current，actual snapshot完整后纯projector，返回前visibility重核。没有durableprojection/rebuild Job；原mapping/cursor恢复不从View反推truth。

| Query / response字段 | 类型 | 实际来源 | empty / hidden / degraded / public ref规则 | 测试 |
|---|---|---|---|---|
| Q01~04 BridgeLocalView.view_subject | BridgeViewSubjectRef | actual allowed ref定位+resolver；Q allowlist三/八/五/二族 | 已允许exact查absent才NotFound；hidden finite Denied不泄存在；原18typed variant完整namespace/key | R/S |
| scope_ref | AuthorizedReadScopeRef | SafeReadQualificationPort actual同subject/source/revision/window | 不从ref字符串/snapshot/platform权限猜scope；缺scope无View | R/A/S |
| stage_slice | SafeStageSlice | 原complete committed snapshot的各stage getter+ReadDisclosureRules | Protocol/LocalCommit/Owner/Platform/Consumer/Business独立、获准slice；empty不全链success | R/C/S |
| qualified_refs | VisibleSafeRefSet | 原snapshot refs与current可见集合交集 | scope/validity/bounded unique；hidden集合不输出/不count=0；无全文rawref | R/P/S |
| freshness | ViewFreshnessKind | actual LocalRevision/原Stale/明确Degraded/Indeterminate有限事实 | 不从query时间造fresh，不以driver absence抹unknown；marker二级载荷完整 | R/C/S |
| availability | SafeViewDisposition | actual read资格/投影guard | View仅Qualified/Degraded；Denied/Unavailable外层finite，无placeholder六字段 | R/A/S |

### Public protocol传递闭环

下表是复核入口，不替代Step6/8所有二级完整定义。每个reachable字段须本地safe Contracts原卡或actual core唯一reexport；不得Domain/Application/private/产品type反向进入wire。BridgeProtocolError只有issue/area/reason三字段，Unsupported/Stale按原finite合法配对；二级enum/Slot载荷不因类型名像ref而省schema。

| surface / 外层DTO | 字段与传递类型入口 | schema归属 / 缺失重复口径 | 依赖 / planned测试 |
|---|---|---|---|
| C01~06 BridgeCommandRequest<T>/Response | version/metadata/body；CommandMetadata -> actual core RequestMetadata/Actor/Origin/Trace/Key；body各原Request；result BridgeCommandResult->View/finite outcome | Step8 shared/command + Step6 Contracts；keyrequired、same-key完整ManagementBody/Outbound/Recovery meaning，不自动retry | Contracts->core仅；S/A/C/L/P |
| Q01~04 BridgeQueryRequest<T>/Response | version/metadata/body.subject；QueryMetadata实际page/consistency；result BridgeReadResult->上六字段 | Step8 shared/query、Step6 views/safe stage/ref markers；key/pageNone，无no-op audit | Contracts->core仅；S/R/P |
| E01~04 BridgeInboundEventEnvelope<T>/BridgeConsumerReceipt | version/envelope_ref/metadata/event_key/payload；SafeEventMetadata/原typed envelope ref；private payload非序列化 | Step8 inbound完整Private/Continuity/committed/disposition各载荷；source-keyverified，duplicate原结果，ACK单列；received_at只private call字段，不是envelope字段 | Private lease不出wire，formal source登记；S/B/I/W/P/C |
| O01 BridgeLocalDispositionRecordedEvent | version/metadata/source/material/admission/handoff/original/schema/retention九字段 | Step8 outbound/Step6 safe refs；正式map不兼容不发、原metadata/material/op重交 | 非新public publish/producer，零evidence；S/A/C/L/P |
| J01~05 BridgeJobRequest<T>/BridgeJobResponse | version/metadata/body；metadata唯一JobContinuityMetadata；J01 delivery、J02 recovery/subject、J03 gap、J04 handoff、J05 subject/expected；BridgeJobOutcome->actual原五summary | Step8 Job、Step7 Application BridgeMaintenanceSelection与Jobs JobInvocationPlan、Step6原summary/slots；trusted context/basis及runtime预算不进wire，原typed key/Job标签、unknown保原op | no report/run writer，structured本次可信invocation；J/S/A/C/L |
| finite错误 | BridgeProtocolError.issue/area/reason；CV/PE onlyfinite mapper | Step8 finite配对、Step12；有原可能效果保original责任，不公开raw PE载荷 | no rawcause/ref/count/privatevalue；S/I/P |

H1草稿：正式§16保本节全部表和字段附录；正式§5/7/8提供全部schema/factory/callable，不用表概述替代。H1设计审查以191字段与原完整source/input/Query/public传递闭环为准；外部兼容/05~07整体验收仍waiting，不能自行选schema默认值。

## 5. H2 可审查设计记录

问题2/3/7~10：原21enum/101label/150允许对必须与test/后续验收用同一套名称；factory固定初态不是状态矩阵迁移。发现本轮Step16把attempt的技术reserve动作写成Reserved状态、Step15把runtime停止标签写成StoppedKnown，已各归回原Claimed/NotDispatched及StoppedLocal，未改schema/edge。日志/测试catalog也不能另发明状态别名。

诊断：runtime A/B/C/R/D阶段不等07 commit boundary；未来脚本能力/最小索引壳/最终EV页/验收移交是四成熟度，不可依future报告对象才能实现当前业务。Bridges无durable read projection或artifact materialization writer；说“不适用”只限业务surface，未来05~07测试artifact/report writer须完整schema/路径/摘要算法/红线闭口，现在waiting。

取舍：状态值逐enum从唯一原卡复用、输入构造/结果保存读成对/原stage依赖按运行边界审查；07未来阶段只受这些不变量约束，不提前拆任务/排期/新boundary ID。实施前必须正式00~07逐文档停审、三层恢复和实现前闭环审计；完成正式07同时建项目implementation ledger及其全部planned boundary skeleton，状态planned/blocked/waiting，不提前在03创建。用户当前授权只03设计，不authorize代码/测试/commit。

复杂度：状态/naming/运行边界/承接/阅读表，保本地设计审查与外部资格/下游整体验证三种状态分离。

## 6. H2 状态、命名、phase与承接

### 状态闭环表

以下正式状态值逐字沿唯一原enum，产生函数逐名沿原对象factory/member，不是新set_state。原21矩阵完整guard/mandatory/source/事务与非法边仍须装配正式§9；本表只跨文档反查。迁移150对，factory不计，未列pair禁止；TC/EV及真实证据waiting/not_evaluated。

| 状态enum / 主语 | exact正式值 | 产生函数 / 原归属 | 合法迁移 | 禁止迁移 | planned测试 | 验收证据 |
|---|---|---|---|---|---|---|
| `BridgeInstallationState` / BridgeInstallation | `Configured` / `Qualified` / `Blocked` / `Suspended` / `Retired` | `BridgeInstallation::configure`、`BridgeInstallation::apply_revision`、`BridgeInstallation::record_qualification`、`BridgeInstallation::block`、`BridgeInstallation::suspend`、`BridgeInstallation::restart_configured`、`BridgeInstallation::retire` | M01原矩阵12对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/L/P/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `ExternalBindingState` / ExternalBinding | `Pending` / `Active` / `Suspended` / `Revoked` / `Expired` | `ExternalBinding::propose`、`ExternalBinding::activate`、`ExternalBinding::suspend`、`ExternalBinding::revoke`、`ExternalBinding::expire`、`ExternalBinding::assert_current` | M02原矩阵9对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `IdentityMappingState` / ExternalIdentityMapping | `Valid` / `Stale` / `Revoked` | `ExternalIdentityMapping::link`、`ExternalIdentityMapping::assert_applicable`、`ExternalIdentityMapping::invalidate`、`ExternalIdentityMapping::revoke` | M03原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `LocationMappingState` / ExternalLocationMapping | `Valid` / `Stale` / `Revoked` | `ExternalLocationMapping::link`、`ExternalLocationMapping::resolve_target`、`ExternalLocationMapping::invalidate`、`ExternalLocationMapping::revoke` | M04原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/B/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `MessageMappingState` / ExternalMessageMapping | `Linked` / `Stale` / `Tombstoned` | `ExternalMessageMapping::link_known`、`ExternalMessageMapping::match_change`、`ExternalMessageMapping::invalidate`、`ExternalMessageMapping::record_tombstone` | M05原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/B/L/P/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `InboundHandoffState` / InboundHandoffRecord | `Verified` / `Blocked` / `Quarantined` / `HandoffPending` / `OwnerAccepted` / `OwnerRejected` / `Indeterminate` | `InboundHandoffRecord::from_verified`、`InboundHandoffRecord::qualify`、`InboundHandoffRecord::block`、`InboundHandoffRecord::quarantine`、`InboundHandoffRecord::begin_handoff`、`InboundHandoffRecord::apply_owner_result`、`InboundHandoffRecord::mark_unknown`、`InboundHandoffRecord::record_protocol_disposition` | M06原矩阵10对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/B/I/W/P | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `PresentationState` / SafePresentationPlan | `Qualified` / `Degraded` / `Blocked` / `Stale` | `SafePresentationPlan::prepare`、`SafePresentationPlan::assert_current`、`SafePresentationPlan::invalidate`、`SafePresentationPlan::block` | M07原矩阵4对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/P/C/L/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `DeliveryIntentState` / DeliveryIntent | `Planned` / `Dispatching` / `RetryWait` / `PlatformAccepted` / `KnownRejected` / `Indeterminate` / `Blocked` / `Unsupported` | `DeliveryIntent::from_plan`、`DeliveryIntent::claim`、`DeliveryIntent::apply_receipt`、`DeliveryIntent::mark_unknown`、`DeliveryIntent::schedule_retry`、`DeliveryIntent::block`、`DeliveryIntent::mark_unsupported`、`DeliveryIntent::restore_planned` | M08原矩阵14对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/A/P/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `DeliveryAttemptState` / DeliveryAttempt | `Claimed` / `InFlight` / `KnownAccepted` / `KnownRejected` / `Indeterminate` / `NotDispatched` | `DeliveryAttempt::claim_for`、`DeliveryAttempt::begin_io`、`DeliveryAttempt::record_result`、`DeliveryAttempt::mark_unknown`、`DeliveryAttempt::record_not_dispatched` | M09原矩阵9对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/L/C/B/P/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `ExternalActionState` / ExternalActionBinding | `Active` / `Claimed` / `Expired` / `Revoked` | `ExternalActionBinding::bind`、`ExternalActionBinding::claim_once`、`ExternalActionBinding::expire`、`ExternalActionBinding::revoke`、`ExternalActionBinding::assert_current` | M10原矩阵3对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/B/P/I/W | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `CallbackHandoffState` / CallbackHandoffRecord | `Verified` / `Blocked` / `Rejected` / `OwnerPending` / `OwnerAccepted` / `OwnerRejected` / `Indeterminate` | `CallbackHandoffRecord::from_verified`、`CallbackHandoffRecord::begin_handoff`、`CallbackHandoffRecord::block`、`CallbackHandoffRecord::reject`、`CallbackHandoffRecord::apply_owner_result`、`CallbackHandoffRecord::mark_unknown`、`CallbackHandoffRecord::record_protocol_disposition` | M11原矩阵8对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/L/B/I/W/P/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `DedupState` / DedupRecord | `Reserved` / `ResultRecorded` / `Indeterminate` / `Expired` | `DedupRecord::reserve`、`DedupRecord::match_meaning`、`DedupRecord::attach_result`、`DedupRecord::mark_unknown`、`DedupRecord::expire` | M12原矩阵6对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/R/P/J/S | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `StreamCursorState` / StreamCursor | `Ready` / `Incomparable` / `Blocked` | `StreamCursor::initialize`、`StreamCursor::advance`、`StreamCursor::mark_incomparable`、`StreamCursor::lose_comparator`、`StreamCursor::block`、`StreamCursor::requalify_same_epoch` | M13原矩阵6对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `GapState` / GapRecord | `Open` / `Probing` / `Closed` / `Manual` | `GapRecord::detect`、`GapRecord::begin_probe`、`GapRecord::attach_recovery`、`GapRecord::close`、`GapRecord::retain_uncovered`、`GapRecord::require_manual` | M14原矩阵6对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `DispatchLaneState` / DispatchLane | `Ready` / `Held` / `Cooldown` / `Blocked` | `DispatchLane::for_scope`、`DispatchLane::claim`、`DispatchLane::apply_bounds`、`DispatchLane::release`、`DispatchLane::block`、`DispatchLane::finish_cooldown`、`DispatchLane::restore_ready` | M15原矩阵9对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/B/J/W/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `RecoveryState` / RecoveryRecord | `Requested` / `Probing` / `Resolved` / `Blocked` / `Manual` | `RecoveryRecord::request`、`RecoveryRecord::begin_probe`、`RecoveryRecord::resolve`、`RecoveryRecord::block`、`RecoveryRecord::require_manual` | M16原矩阵8对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/C/L/A/P/J/R | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `SafeHandoffState` / SafeHandoffRecord | `Pending` / `Dispatching` / `ConsumerAccepted` / `ConsumerRejected` / `Indeterminate` / `Blocked` | `SafeHandoffRecord::from_canonical`、`SafeHandoffRecord::begin_handoff`、`SafeHandoffRecord::apply_consumer_result`、`SafeHandoffRecord::mark_unknown`、`SafeHandoffRecord::block`、`SafeHandoffRecord::resume_pending` | M17原矩阵10对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | D/A/C/R/B/L/P/S/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `RuntimeExecutionPhase` / RuntimeExecutionState | `Constructed` / `Active` / `Draining` / `StoppedLocal` / `StoppedWithUnknown` | `RuntimeExecutionState::from_parts`、`RuntimeExecutionState::begin`、`RuntimeExecutionState::begin_shutdown`、`RuntimeExecutionState::record_local_stop` | M18原矩阵4对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | A/C/L/P/I/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `JobInvocationPhase` / JobInvocationState | `Pending` / `Dispatched` / `CompletedLocal` / `CancelledLocal` / `Indeterminate` | `JobInvocationState::from_parts`、`JobInvocationState::mark_dispatched`、`JobInvocationState::record_returned`、`JobInvocationState::cancel_local_wait` | M19原矩阵5对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | A/C/L/I/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `SourceSessionPhase` / PlatformSourceSession | `Configured` / `Active` / `Disconnected` / `NotEstablished` / `Stopped` | `PlatformSourceSession::from_parts`、`PlatformSourceSession::record_connected`、`PlatformSourceSession::record_disconnect`、`PlatformSourceSession::record_unavailable`、`PlatformSourceSession::stop_local` | M20原矩阵10对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | B/C/I/P/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting |
| `WorkerBatchPhase` / WorkerSchedulingBatch | `Collected` / `Dispatching` / `CompletedLocal` / `StoppedLocal` / `StoppedWithUnknown` | `WorkerSchedulingBatch::from_parts`、`WorkerSchedulingBatch::take_next_plan`、`WorkerSchedulingBatch::record_returned`、`WorkerSchedulingBatch::stop_local` | M21原矩阵8对 / guard先验 | 所有未列pair及required/current/expected/terminal失败拒绝、零修改 | A/C/L/I/W/J | 正式00所属能力AC与全局037/038；TC/EV waiting |

### 命名一致性

| 名称类型 | 当前正式名 / 位置 | 禁用旧名或口语混同 | 处置 |
|---|---|---|---|
| role/对象 | 七role；六U；19Domain+唯一BridgeLocalView | 五部分BridgeRequest主轴、BridgedTurn、内部/平台truth mirror | Step4/5/6为归属，旧03/README只historical_material |
| attempt state | DeliveryAttemptState::Claimed/InFlight/KnownAccepted/KnownRejected/Indeterminate/NotDispatched | Reserved（只技术reservation动作）、NoIo（结果证明非state） | Step16已归原enum；formal09/测试/日志不造别名 |
| runtime phase | RuntimeExecutionPhase::StoppedLocal/StoppedWithUnknown | StoppedKnown、全平台完成、Stopped=NoEffect | Step15已修原label；保原unresolved |
| call phase | BridgeCallPhase::PlatformEffect；其余五variant沿原Step7 | PlatformDispatch、外部2xx=Known/Delivered | Step12/current source保exact；不新variant |
| Query | 四Get*ViewRequest/原透明alias；BridgeLocalView六字段 | public list/search/page/cursor/ref from display name、GlobalSuccess/TurnCommitted/Delivered/Read | Step8/9 Query唯一schema与zero-write |
| 资格/结果 | Config/Local/Generation/Lane/Cursor各轴；ACK/LocalCommit/Owner/Platform/Consumer分stage | 一次success合并全链、timeout/NotFound=rollback/no-effect | Step6/9~13原typed模型，无统一success对象 |
| canonical/handoff | SafeAuditRecord、SafeHandoffRecord、条件O01及NonRecursiveResultOnly | HandoffRepository、第24业务port、自动outbox、借Bus/SourceOwner producer | 原八repo/23port；缺formal admission/rule仍blocked |
| J05维护 | BridgeQualificationSnapshot十一variant/九body族含Dedup；具名qualify_dedup_expiry | 十snapshot/eight body旧checkpoint、TTL=authority、targetbusiness op=Job op | 受权repair当前来源优先，目标保原key/meaning/result/window/unknown |
| meaning | ManagementCommandMeaning四body/ManagementBody与原Outbound/Recovery等 | 旧409/606全集计数、正文hash、C05初绑action ID | 当前定义集合最终静态重数；不把旧checkpoint当当前全集 |
| TC/EV/run/evidence/commit | 只未来正式05/06/07定义/真实台账事实；现planned/not_evaluated | 自造TC/EV编号、占位真实run/receipt、假account/token/hash/signoff | 本03无这些事实，不填写值或将设计pass当readiness |

### Phase / commit boundary闭环约束

本表是07划phase/boundary时必须满足的**依赖闭包审查面**，不是新phase ID、开发任务或排期。A/B/C/R/D仅原运行事务阶段；未来07不得把public五Job/所需carrier/原read-save面后置却让当前surface调用它。reserved方法/variant只能由未来正式07显式定义并同步05/06，不以产品未立把schema隐去。

| 审查边界 | 当前可包含 / 正式来源 | 明确排除 / 不依未来 | 前置 / planned测试 / 验收范围 |
|---|---|---|---|
| typed contract / pure对象面 | Step4/6/7/8全部当前完整carrier、factory、member、port需求、public C/E/J schema | raw product type/owner源码/private进入Contracts；不依未来report/evidence才能构造对象 | real core exports/pin closure；S/D；原AC与037/038，真实build未核 |
| local mutation / result保存读面 | Step9/11原全expected/unique/reservation/staged set/immutable seed/audit/conditional handoff/seal | foreign IO在tx、只主行CAS、写无读面、stage当Committed、异op泛化 | 同driver actual UoW proof/正式observation；L/A/C；AC005/012/019/025/034/037/038 |
| owner/platform/consumer效果面 | 原record/op/effect/claim提交后最终current、private短借和一次qualified call | 用future receipt/report来授权当前IO；new op、hidden retry、签名绕Policy | 逐installation/owner/method/config/secret/全bounds资格；A/B/P/I/W/J；各能力AC |
| original恢复 / gap维护面 | J02/J03/J04已定义原subject/key/current/window与readonly权威结果及合法finalize | 通用replay raw/new effect、NotFound=NoEffect、GapClosed=cursor已advance | 原probe/comparator/两coverage/实际known/current；C/L/B/J；AC028~036 |
| Query / read面 | 四Q完整root/snapshot/六view字段、resolver/current可见性与纯projector | new view ID/持久projection/rebuild from view、查询audit/probe/ID/repair；无page新surface | current read/same committed source；R/S/P；AC033~038，不依writer/report |
| conditional producer / result-only面 | 正式rule+canonical/admission/schema/原claim/op；NonRecursiveResultOnly | 缺map而默认audit-only、other producer冒名、result finalize递归新O01 | BR-UP-006与原十二affected/current proof；A/C/L/P/S/W/J；AC032/034~038 |
| 测试机器产物 / 报告面 | 未来05/06/07如交付writer，须完整schema/version/optional/enum/digest/canonicalization/path/红线/writer-reader及四成熟度 | 03业务Job summary不是run报告；不能预置TC/EV/run/artifact/acceptance；最小index非最终证据 | BR-DOWN-002/003/004 waiting；artifact root规范仅约束，真实测试/验收均not_evaluated |

### 实施承接与前置阅读

| 承接项 | 已定义位置 / 未来正式03 | 实施者如何使用 / 禁止 |
|---|---|---|
| 工程/布局/依赖 | Step3/4 -> §3/4；core实际path，SDK条件 | 按七role/tree/职责/单向图；未建目标仓、不添owner compile或擅选产品 |
| 对象/字段/完整方法/23port | Step5/6/7 -> §5/6；本Step191字段闭环 | 逐schema/variant/guard实现；需完整public/shared closure，不从类型名猜field |
| 协议/metadata/构造/Query | Step8/本StepH1 -> §7/16 | 复用core单一metadata，写keyrequired/read none，19输入与二级完整schema；Query无写 |
| 函数流/状态/事务/恢复/幂等 | Step9~13 -> §8~12 | 原stage/actual commit与known/unknown独立；S9/S10/S13当前修订优先，不能复制旧停审缺口 |
| config/secret/观测 | Step14/15 -> §13/14 | 受核seam/required/default拒绝/日志白名单；产品/运行准入需04/07真实释放 |
| tests/AC/验收输入 | Step16/本Step -> §15/16；00原38AC | 十一planned入口/二十协议/21机/150对；05制定正式TC/suite、06 EV/门禁；无真实结果 |
| 07整体可落码闭环审计 | 本Step全部十类输出 -> §16，正式03/05/06/07按phase/commit boundary | 本03提供对象/协议/flow/状态/持久化/测试切口/原AC映射输入；07必须全量审计，不沿用局部pass宣移交 |
| 实施台账及全部planned skeleton | 未来正式07 + 代码实施台账规范§3.2.1 | 完成正式07同步创建项目implementation_execution_ledger.md和全部implementation-boundaries骨架；planned/blocked/waiting、future wait_until_current、无gate pass/虚构commit。当前03禁止创建 |

| 必读文档 / 精确目的 | 开工前检查 |
|---|---|
| 本项目正式00~07及其每章校准来源 | 正式停审基线齐全；旧05/06/README不能当执行输入；不清楚暂停回design gap |
| project_execution_ledger.md、03 flow；未来implementation ledger/current boundary | 每次continue/恢复/换boundary/提交前/repair后从磁盘三层恢复，不仅聊天或/tmp |
| 设计真相源闭环与可落码性标准 / 中间产物规范§5.10 | fields/DTO/transitive/query/state/metadata/result/phase/property/read-save/材料闭包；下游当前required不能后置 |
| 全局依赖规则§4.1及编译/runtime/event裁剪 | Bridges为Layer5并行窗口；L5-chat未停审不formal input；coreonly计划compile/SDK条件 |
| 子项目目录与代码文件组织规范 | workspace/member/package/lib/bin/source/tests/scripts/report目录与slug，不创建common/utils或多语言隐式边界 |
| Rust编码规范（含源码语言/Rustdoc/命名/所有权/format）及详细书写注释规则 | 实际标识符/普通注释/rustdoc/测试名英文；本设计中文注释翻译保全部字段/variant/副作用/错误，不以rustfmt替语义审计 |
| 实施计划书写§4.9完整Commit规则及目标仓更严格规范 | 未来已授权实现每正式boundary完整验证后才提交；英文type(scope): subject，英文body按子功能/文件名/变更量，真实换行，footer前空行，固定Codex注脚，必要-F；design仓中文例外不传实现仓 |
| 实施书写项目git配置条款 | 未来目标仓项目级user.name=quantalithos-labs、user.email=quantalithos.ai@gmail.com；不--global；本轮未配置/提交 |
| 代码实施台账与门禁规范 | design/scope/build/commit/handoff门禁、只当前boundary allowed、futureplanned/wait_until_current，缺schema/资格先回设计不码补 |
| 七专项当前正式合同/必要台账与四平台fixed版本资格 | 逐受影响port/method/source/current/secret/producer核资格，BR-UP/WS/十二affected未释放不启用positive |

### 跨文档复核结论与未进入实施项

| 复核项 | 设计位置 | 下游位置 | 当前结论 | 未关闭问题 |
|---|---|---|---|---|
| field/factory/DTO/传递闭环 | Step6/7/8/9/H1附录 -> §5/7/8/16 | 05/06/07 | pass_local_design；19model191字段/原二级schema齐 | owner/runtime产品兼容与真实build仍open；05/06/07新基线waiting |
| query/ref-scope/marker/页 | Step7/8/9 Q + H1 -> §5/7/8/16 | 05/06/07 | pass_local_design；resolver-first完整root/view、无public页 | current owning read资格BR-UP-003/005；不造hidden总数或持久projection |
| state/guard/flow/read-save | 原21矩阵/115repo签名/十九flow -> §5/8~12/16 | 05/06/07 | pass_local_design；101label/150对/known优先/expiry触发完整 | 真实store/probe/rollback/no-effect/comparator资格仍open |
| metadata/key/meaning/result replay | core真实export+Step8/9/13 -> §7/8/12 | 05/06/07 | pass_local_design；六namespace、完整ManagementBody/原journal读回 | real source/key/window/codec/lock/product closure等待04/07，不以正文hash补 |
| projection rebuild | Q四pure View及J03 mapping/cursor维护 -> §8/10/12/16 | 05/06/07 | no_business_projection_writer；read-save/本地恢复规则明确 | 以后新增durableprojection/rebuild要先回设计补writer/source/plan完整body，不能from view |
| artifact materialization / machine schema | Step16脚本边界、H2 -> §15/16 | 05/06/07 | waiting_downstream，业务无artifact writer | BR-DOWN-002/003；future真实writer/path/报告schema/digest/成熟度未定义，不可实现或判通过 |
| runtime / 07 phase boundary | H2运行闭包、Step14 required -> §13/16 | 07 | pass_design_constraint / waiting_actual_phase_audit | BR-DOWN-004；无正式phase/commit IDs/ledger/skeleton，不能开码 |
| 验收映射/交付实现前审计输入 | 00§14原38AC、Step16/H1/H2 -> §15/16 | 05/06/07 | pass_design_input，非验收/移交通过 | BR-DOWN-002/003/004；正式03完成停审后逐04~07再审；readiness not_established |

H2草稿：正式§16装配本节及H1完整表/附录、正反例/未决项；不写开发任务或排期。设计审查pass，当前仅向Step18风险提供未决项，不进入implementation gate。

## 7. X 冲突、正反例与跨文档审查

独立问题/诊断：本地closure不能替05/06/07正式停审或真实运行evidence；本附录多个flow索引也不能让维护Job重建已有对象。取舍：逐字段与原卡精确反查、逐21enum原值/原member与Step16名称查对，合格schema与positive运行资格分层；如发现未同步先暂停装配并最小修当前来源，不借历史内容补白。

### 冲突与修正

| 冲突 / 位置 | 类型 / 影响 | 处置与当前状态 |
|---|---|---|
| S9十三local断口 / Step9修订登记 | fresh lane、tombstone current、readonly恢复、roots/consumer非递归等本地需求面 | 原受权repair已同步Step6~9，closed_design_contract；仅结构需求，实际owner/provider兼容open |
| S10-LOCAL-001 / M12 expiry | 原member无正式取得/J05触发、两key/op/Plan限定 | Step10 expiry repair已同步Step6~10重审，closed_design_contract；retention/current治理实际资格未建立 |
| S13-LOCAL-001 / C01~03/C05 meaning | 原leaf遗漏完整DTO条件、初绑依未存在action ID | ManagementCommandMeaning四payload/ManagementBody与四Input纯成员已同步，closed_design_contract；无new wire/业务port |
| S17-LOCAL-001 / 本轮Step16 M09/Step15停止指标 | Reserved/StoppedKnown标签漂移，不改变原enum | 已归原Claimed/NotDispatched及StoppedLocal；closed_design_wording，21原值反查；不把动作名当state |
| 旧README/正式旧03 / Python/TS/KMS/fallback/无需Gate/自动replay | 与已认可00~02及原current契约冲突 | historical_material only；Step19删旧重建，不恢复产品/权限或历史schema |
| 当前Observability static map无Bridges、WS/owner产品缺资格 | owning外部合同/真实安装释放不足 | 原BR-UP/WS/十二affected保持；不借producer、不填fake qualified，正向受影响blocked |
| 04/05/06/07正式链未完成 | 配置/test/artifact/evidence/phase实现移交资格 | BR-DOWN-001~004 waiting；旧05/06不正式输入，不能提前创建implementation ledger/boundary或报告 |

### 正反例

| 正向设计口径 / assertion | 必须拒绝的反例 |
|---|---|
| C05原Request source/target/责任经current正式owner补expiry/revision，ManagementBody含完整旧body；bind初态Active、claimMissing，仍zero审批 | 没有action ID所以随机mint Callback meaning；签名/PAT直接审批；current缺失填fake授权 |
| J05原target Dedup由store hydrate，批准expiry proof重核，目标只state/local变、business key/op/result/window/unknown保原；Job独立两key/op同U | Job调用reserve重新构造目标，TTL自动清key/result/unknown，Plan允许任意异op写 |
| Q02受权Operation complete safe results/Plan/Action standalone roots同driver读取，pure current projection | 查询无Intent/Callback就造dummy关联、refresh/probe/audit、missing result payload仍回空成功 |
| J01 actual B commit+最终current/all bounds后原effect单次dispatch，known receipt证明仅该平台业务阶段 | stage/ACK当Committed；timeout/lease/new run第二effect；PlatformAccepted伪用户送达 |
| O01 actual安全audit及正式canonical/admission/current同源提交，原op/claim交接；当前缺Bridges准入就Blocked | 以Bus/SourceOwner/其他family注册规避准入、默认audit-only、consumer Accepted=证据或ready |
| 07未来按正式03/05/06/07全量phase/boundary闭环后建全部planned skeleton，真实门禁材料到位后仍须另行实施授权 | 03局部静态pass即开始写代码/commit/真实run、创建fake boundary evidence或把最小索引壳当验收通过 |

X设计审查pass：中间产物§5.10十类输出完整，fields/DTO/transitive/Query/state/naming/read-save/phase限制及projection/artifact角色可反查。191字段/十九factory参数除固定state/local1无缺，21原enum101值逐项回指，原150允许对未改；真实05~07/上游资格未立仍waiting/open。所有示例是设计断言，不是执行/平台/验收事实。

## 8. 实际检查

2026-10-04实际只读静态检查：49个03 Markdown/1484表/624围栏块/152相对链接/十一snapshot/expiry，errors=[]；191字段逐name/type与原Domain卡比对191/191、十九对象与十九factory参数全集闭口、21state rows无缺，errors=[]；state表生成时21枚举101值/150对与原数量逐项核。git diff --check通过。

人工跨审纠正只本轮Step15/16标签，未改对象/variant/edge/port/source资格；字段附录明确后续Job仅hydrate/member、不重复factory。临时重复pending行已在H2追加时清除；不存在未来文件或运行报告。当前只向Step18交开放风险，不将03设计审查当05/06/07验收/移交readiness；下一读SOP18/书写§5.17及BR-UP/WS/十二affected原释放表。无代理/并行调用、代码/测试/run/evidence/stage/commit，commit_required=false。
