# L6-bridges 03 Step15：观测、审计与安全交接埋点

## 1. 开工确认

2026-10-04；已读SOP15全文/书写§5.14、Step8 O01完整协议、Step9共享副作用与Step11事务/Step12错误，重读Observability正式03§7.4九operation静态producer map及SourceAudit四family。只本Step校准，单agent串行；正式/04/实现/项目测试/提交关闭，BR-UP及原WS/十二affected保持。

## 2. 模块计划

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| O1 fields / per-flow inventory | done | done | pass_design | pass | 进入O2 |
| O2 logs / metrics / trace / audit | done | done | pass_design | pass | 进入X |
| X cross-audit | done | done | pass_design_static | pass | enter_step16 |

当前03/Step15/complete，gate_status=pass，gate_reason=observability_inventory_design_review_pass，next_allowed_action=enter_step16；当步语义写入关闭，commit_required=false。

## 3. O1 可审查设计记录

问题1/4：十九flow分别有local/owner/platform/consumer阶段，只有actual local mutation产生同UoW唯一immutable SafeAuditRecord；纯拒绝、duplicate/no-op与四Q不补audit。O01不是每flow必发，只有正式observation rule与canonical/schema/admission/current和same commit联动齐全才条件生成；原handoff结果阶段需正式NonRecursiveResultOnly，不能再生成producer。

诊断：日志“全安全字段”或“hash正文”会泄漏secret/审批、外部原ID、hidden存在性；埋点捕获raw SDK错误/Debug对象同样违规。Trace/metrics不是durable审计或证据替代。采用exact finite技术标签与必要受信trace关联，safe refs只在原受权audit/交接/Query seam；不新建audit/log/history实体、event producer、outbox或report。

取舍：逐flow列actual mutation/业务IO/条件O01/诊断标签；随后将日志/指标/trace独立allowlist。材料层原BodyFreeMutationMaterial四字段与SafeAuditRecord九字段全部保原schema，current disclosure先裁剪，技术采样/丢日志不改变业务或审计合同。告警阈值/采样值/保留策略/collector产品留04及运维；不会靠日志补missing authority。复杂度：十九row和字段边界表，不替代原flow/对象完整卡。

## 4. O1 逐flow副作用与字段边界

### 逐flow inventory

`local audit`仅actual同UoW变更，commit前候选不宣真实发生。所有行的duplicate/no-op/pure reject均zero新增audit/canonical/handoff；Query无逐subject诊断写入。下面名称是原flow定位，不是新telemetry entity或API。

| flow | actual local mutation / audit位置 | foreign IO上限 | O01 / 安全技术诊断 |
|---|---|---|---|
| C01 ConfigureBridgeInstallation | installation+dedup/result/audit同U；config/local双CAS | zero平台/secret解析 | 只正式规则条件首建；finite配置接纳/冲突，非安装成功 |
| C02 ManageExternalBinding | 原relation/generation/local及audit同U | zero创建owner target/member | 条件首建；finite binding stage，不log两端外部ID或授权材料 |
| C03 MaintainExternalMapping | 选定三mapping合法变化/tombstone及audit同U | zero平台edit/delete | 条件首建；finite mapping kind/state，hidden ref/当前meaning不log |
| C04 PrepareExternalDelivery | plan+intent/必要lane/effect及audit同U | zero send | 条件首建；finite preparation disposition，不logsafe projection正文/标题 |
| C05 BindExternalAction | 原source-action唯一action及audit同U | zero callback claim/owner审批 | 条件首建；finite binding stage，禁action choice/审批详情 |
| C06 RequestBridgeRecovery | 原Recovery/适用Gap attach及audit同U | zero probe/replay | 条件首建；finite request disposition，不造已恢复事实 |
| Q01 GetBindingMappingView | zero tx/audit/dedup写 | zero probe/refresh | zero O01；只有全局技术latency/error enum，不log主体/ref/count |
| Q02 GetBridgeOperationView | zero持久view/audit | zero读取平台以补缺root | zero O01；stage只返回当前授权view，不自动trace typed结果 |
| Q03 GetContinuityView | zeroeligible/repair/audit | zero gap恢复/平台probe | zero O01；gap/unknown/hidden counts不作metrics标签 |
| Q04 GetSafeHandoffView | zerocanonical/audit补写 | zero交接/evidence生成 | zero O01；不能用查询触发新的producer |
| E01 PlatformInputReceivedConsumer | Private接管/claim/actual owner结果各U实际audit；Continuity仅Protocol gap合法U | actual durable claim后正式Conversation handoff；消息raw仅本call，notice无owner IO | 条件首建；protocol ACK另有限标签；无正式meaning的notice zero durable |
| E02 CommittedSourceAvailableConsumer | 同C04 effect唯一prepare U/audit | zero send | 条件首建；正式source类型有限，不把收到event当owner提交 |
| E03 PlatformCallbackReceivedConsumer | verified/one-use/action+callback claim/结果各U/audit | claim actual提交+最后current后原owner action | 条件首建；验签/责任/one-use有限分类，callback data/token不log |
| E04 SafeHandoffDispositionConsumer | 原handoff/consumer结果result-only U/audit | zero consumer调用 | 正式NonRecursiveResultOnly，handoff=None、zero O01；consumer结果非evidence |
| J01 DispatchQueuedDeliveryJob | A claim/B InFlight/C actual结果/合法D NoIo各U/audit | B actual提交及current后单次原effect dispatch | 各阶段仅正式规则条件首建；rate/attempt/phase有限，不logpayload/外部locator |
| J02 ReconcileBridgeOperationJob | 原Recovery Probing/known finalize同U/audit；LocalCommit只原driver读 | only原subject/op权威readonly probe，zero send/approve | Consumer result-only需NonRecursiveResultOnly；其他阶段正式条件；unknown不算失败已恢复 |
| J03 ReconcileStreamGapJob | A/B gap+recovery、独立C cursor双CAS各U/audit | only same epoch/range/source readonly coverage | 正式条件首建；coverage分类不logopaque token/range内容或假完整count |
| J04 RetrySafeHandoffJob | 原record resume/claim/actual结果同U/audit | 正式原consumer op先read，许可后有界same-op交接 | 全生命周期正式非递归rule，zero新O01/canonical；ACK独立于ConsumerAccepted |
| J05 RefreshBridgeQualificationJob | 十一snapshot/九body族合法维护或Dedup expiry及audit同U | zero业务IO/新grant/新probe | Handoff维护正式NonRecursiveResultOnly，其余正式条件；TTL不authorise，unknown/head不清 |

### exact字段材料分层

| 材料层 | 允许 / 原来源 | 输出边界 / 禁止 |
|---|---|---|
| BodyFreeMutationMaterial | exact subjects:AuthorizedSafeSubjectRefSet、basis:SafeBasisRefSet、stage_reason:SafeStageReason、schema:SafeProducerSchemaRevision | safe policy当前批准、同mutation材料；不是日志payload；禁正文/hash/token/附件URL/敏感审批/可还原派生 |
| SafeAuditRecord | exact audit_ref/mutation_ref/operation_ref/subject_refs/stage_reason/basis_refs/trace_ref/producer_revision/local_revision | immutable同UoW actual commit；current Query过滤后才外显；不逐字段复制到日志/trace |
| SafeHandoffRecord / O01 | 原canonical/admission/schema/window/claim/原consumer op；O01完整九字段沿Step8 | actual same commit + 正式producer/event recipe + current才交接；consumer receipt不升级report/evidence/verdict |
| 技术日志 / trace | 原finite flow、phase、area、issue/reason、disposition；必要受信trace关联仅原approved sink | 无typed对象Debug/Display/Error-source；不打印外部ID、bindings/namespace strings、cursor、ref集合、secret locator或policy内容 |
| 技术metrics | bounded finite label维度+单次本地耗时/计数 | 不含subject/trace/request/key/ref/URL/tenant/bucket原值或hidden count；不宣平台global delivered |
| Evidence/report | 本03不生成、不拥有；未来05~07只接受真实按准入安全材料 | 日志/metrics/audit/ACK/本地commit均不能替代canonical/consumer/evidence资格 |

O1草稿：正式§14保完整十九flow inventory及字段层表，原完整对象卡仍在§5/协议§7，技术观测不改变zero-write Query。人工逐flow实际mutation/IO/nonrecursive/字段禁止对照Step9/11/12/repair pass_design，BR-UP-006仍open。

## 5. O2 可审查设计记录

问题2/3/5：preflight/guard/driver/owner/platform/consumer与ACK分别设有限诊断点；原known/unknown/rollback不能合计为一个success/failure。elapsed只能本地同clock单次持续时长，metrics是技术测量不是平台truth；source/namespace/ref自由值不作标签。日志级别是实现切口，collector/采样/告警/保留值不在本Step选定。

诊断：常规request logging、自动instrument参数/return、异常stack与HTTP/SQL/SDK tracing会穿透private seam；只关闭应用层body log仍不足。采用默认不捕获输入/输出/对象的finite白名单logger，trace只static span及批准关联；缺许可则只finite聚合诊断，不能把raw脱敏后落盘。观测丢失不替代mandatory audit/canonical，不因logger异常执行业务fallback。

取舍：所有诊断通过infra/audit.rs既有安全输出责任，Application只在已定义stage把有限事实交给它，不新增business port或观测UoW。audit仍原SafeTraceRepository同UoW，原非递归rule不足受影响效果Blocked；没有新失败事件。复杂度：日志、指标、trace及audit四表独立；测试泄漏负例交Step16，产品和运行资格不关闭。

## 6. O2 埋点契约

### 日志埋点

下面是**字段名allowlist**，只使用已存在finite类型/受信safe trace来源；不新造public log DTO。finite标签由static enum映射，不能从错误文本/raw平台状态/body/自由reason猜。日志中的stage只actual边界，不读完整hidden对象来补标签。

| 位置 | 级别 | 允许字段 / 实际来源 | 目的 / 禁止 |
|---|---|---|---|
| API/Worker/Jobs decode/admission/route | WARN拒绝；不逐正常Query INFO | flow或unknown静态分类、ProtocolIssue/Area/reason、actual entry phase；只有已批准受信trace关联 | 定位schema/source/budget问题；禁request URL/query/header/body/原外部ID、callback data |
| Contracts/Domain guard failure | WARN；重复负向可按未来profile有界采样 | flow、CV finite variant、SafeReasonCode；既有static对象kind，不实例ref | 非法转换/材料拒绝诊断；失败候选/DTO/authority全对象不得Debug |
| Application current qualification | WARN缺资格 | flow、BridgePortArea、finite reason/qualification disposition；不含current ref内容 | binding/Gate/附件/secret失效阻新IO，不输出审批主体/敏感规则 |
| local UoW begin/CAS/commit/rollback/probe | WARN conflict/unknown，ERROR invariant | flow、BridgeCallPhase、BridgeLocalConflict finite族、LocalCommitDisposition分类/PE有限分类 | 记录actual本地边界；不记录SQL/DSN/主键/expected集合/mutation完整proof或把stage作commit |
| E01/E03 owner call、J01 platform call、J04 consumer call | INFO actual finite outcome；WARN unknown；ERROR invariant | flow、PlatformKind仅适用时、phase、原result kind、finite reason；批准sink可关联原TrustedTraceRef | 区分known reject/accepted/unknown；禁payload/raw response/token/receipt locator/审批选择 |
| source/ACK/reentry/coverage | WARN actual disconnect/ACK未知/gap未闭；重复不逐条INFO | flow、mode/family finite标签、ACK执行分类、coverage/probe finite分类 | disconnect不NoEffect，ACK不business成功；禁socket session ID、opaque position/range原值 |
| private/material/secret provider | WARN finite拒绝；ERROR invariant | flow、area、finite forbidden/over-budget/unavailable分类 | 禁secret provider/key locator、raw exception/source/stack、buffer值/长度精确泄漏或headers |
| runtime availability/drain/stop | INFO actual phase；WARN unknown stop | branch/phase/availability finite标签、finite reason；不列unresolved ref集合/数量 | phase不证明任务完成；missing provider不fake启动 |

禁止Application/handler/logger格式化完整PE::Indeterminate/Conflict载荷；logger只上述finite分类，不用Error::source链。SDK/HTTP/DB/Bus/executor tracing与access log也须按同白名单关闭raw捕获/参数return/debug/堆转储；不能仅应用级redaction。采样丢弃只影响技术诊断，不丢actual audit/原operation责任；logger失效不得导致fallback执行、重复IO或假审计。

### 指标埋点

名称为planned技术instrument名，不是已注册collector/成功run。所有标签的允许值为静态有限集合；无installation/namespace/channel/user/token/ref/request/trace/key/bucket原值标签。不得按敏感查询结果产生subject计数；计数只实际本地调用/边界出现次数。

| 指标 | 类型 | 打点位置 / 时机 | exact允许标签 |
|---|---|---|---|
| bridges_entry_disposition_total | counter | admission/codec映射完成，每本地调用最多一次 | surface族、flow静态名或unknown、finite disposition |
| bridges_call_duration_seconds | histogram | 原scoped call结束或有界停止，同clock差值；非外部end-to-end承诺 | flow、phase、finite outcome；超界不回显raw timestamp |
| bridges_guard_failure_total | counter | pure guard或safe material validator拒绝 | flow、CV finite variant；不计candidate字段 |
| bridges_local_commit_disposition_total | counter | actual driver commit/rollback/readonly probe返回 | flow、driver动作有限名、Committed/RolledBack/Indeterminate或finite error |
| bridges_protocol_ack_total | counter | actual ProtocolAckExecution，非ack plan | PlatformKind、source mode/family、finite ack disposition |
| bridges_platform_effect_outcome_total | counter | J01 actual dispatch结果或J02原effect probe分类 | PlatformKind、finite method/action kind、known result kind/unknown/no-io；不统一delivered |
| bridges_rate_limit_block_total | counter | qualified全bounds阻call，非SDK单429推断 | PlatformKind、RateLimitScopeKind、finite reason；无bucket/resource ID |
| bridges_original_probe_total | counter | J02/J03/J04 original readonly实际返回 | recovery subject finite kind、ProbeOutcome有限分类、phase |
| bridges_gap_resolution_total | counter | J03 B actual本地gap处置；C cursor advance独立分类 | source family有限、full/partial/unknown、local disposition；无gap大小/hidden count |
| bridges_handoff_disposition_total | counter | owner/consumer原调用或result-only finalize分开 | flow、owner/platform/consumer/local phase、原finite result kind |
| bridges_material_rejection_total | counter | private material/secret/codec超budget或禁材料边界 | area、finite rejection kind；不含secret用途之外raw来源信息 |
| bridges_runtime_availability | gauge | actual composition/admission资格变化，仅受核注册列表 | branch、availability有限标签；不以其他安装Qualified填当前 |
| bridges_runtime_stop_total | counter | actual stop phase完成一次 | 原RuntimeExecutionPhase的StoppedLocal/StoppedWithUnknown分类；不输出unknown subject数 |

bounded instrumentation本地buffer/collector失败不得落raw fallback文件；metric聚合样本不是Artifact/report/evidence。duration单位固定秒、计数单调技术counter，不把不同phase的accepted相加作成功率。bucket、alert阈值/导出协议/pin/采样值未选，到04/运维承接。

### Trace切口

| static span / 边界 | 允许attribute与关联 | 禁止 |
|---|---|---|
| bridge.entry / bridge.use_case | flow、surface、actual finite entry phase；仅原经批准TrustedTraceRef关联 | 客户端trace/header直接可信、完整metadata/请求/actor显示名 |
| bridge.local_stage / bridge.local_commit | phase、finite conflict/commit分类 | SQL、change list/subject refs/seed、受权basis内容、事务proof |
| bridge.owner_handoff / bridge.platform_effect / bridge.consumer_handoff | PlatformKind适用时、actual finite outcome/phase；原trace同源 | raw payload/return/error source/interaction token；span status不能标全链delivered |
| bridge.original_probe / bridge.protocol_ack / bridge.stop | original阶段分类/ACK分类/actual停止phase | 原operation/key/外部ID/cursor值/unresolved列表；没有新trace truth实体 |

所有span是scoped宿主技术测量；不跨private borrow spawn、不保存private context，不auto-instrument参数/return。无法证明trace关联可落approved sink时不写关联值，只finite标签；这不改变原audit的trusted trace字段责任。

### 审计与consumer交接切口

| 审计材料 / 触发位置 | exact记录字段 / 来源 | 消费方与资格 |
|---|---|---|
| actual本地配置/relation/mapping/plan/action/recovery mutation | 原SafeAuditRecord九字段+完整BodyFreeMutationMaterial四字段，与C/E/J各阶段result/dedup/全CAS同U | 原SafeTraceRepository，Q04 current过滤；不是业务事件新schema |
| actual原claim/InFlight/known或unknown finalize/cursor-gap/维护 | 同上，stage_reason只能actual该阶段、原op/subjects/basis不可换；commit unknown不物化Committed | 原local audit；mandatory正式规则不足先阻正向效果，日志不补authority |
| 条件canonical传播O01 | 原Step8 exact九字段source/material/admission/handoff/original/schema/retention/metadata/version | 正式准入consumer，actual same commit+claim/current后；Bridges不在当前static map，positive仍blocked |
| 原handoff结果/维护非递归 | 正式NonRecursiveResultOnly、原audit/seed/record+全关联CAS，handoff=None | local audit only，zero新canonical/O01；rule未建立同样blocked，不借other family |
| rejected/duplicate/no-op/四Query | 无actual local mutation，无新增audit/material/handoff | zero producer；只本章有限技术诊断，不写fake拒绝审计/evidence |

O2草稿：正式§14完整保四表与捕获禁令，原actual mutation与consumer schema不重定义。人工逐标签与原finite类型/phase/字段边界核对pass_design；logger/trace/metric产品仍未选，不宣埋点实现或运行计数。

## 7. X 草稿与跨审

问题/诊断：审计触发不能由logger错误或网络2xx构造，consumer ACK与accepted/evidence不可混；Query零写必须同时排除按主体日志/指标泄漏。取舍：按Step9/11每actual U对照本页十九inventory；技术日志/指标/trace仅finite静态白名单，完整safe对象留原受权seam。source/actor/trace为原可信来源，不从平台payload/headers自授权；禁止自动捕获参数/return/raw errors与可还原正文派生。

草稿索引：正式§14逐段装配§4与§6，不压成“需审计和脱敏”；正式§5继续完整schema/port，§7继续O01九字段，§9/10/11保原阶段与guard。X设计审查pass：十九flow的actual mutation/claim/ACK/业务IO/conditional/nonrecursive责任齐全；十三finite metrics/四trace边界与Query/private/hidden规则一致。上游BR-UP-006/十二affected与产品未选不关闭。

## 8. 实际检查

2026-10-04只读Node检查46个03 Markdown/1445表/624围栏块/151相对文件链接、十一snapshot/expiry flow，errors=[]；十九inventory唯一覆盖C6/Q4/E4/J5、missing=[]，planned metrics=13；git diff --check通过。人工材料字段、static map无Bridges、actual/known/unknown/非递归/Query零写/finite label及无raw边界完成设计审查，不是运行测量或测试结果。

过程事实：第一个内存门禁生成器含未转义围栏导致工具层SyntaxError未执行，改为hex转义后重跑成功；猜测handoff_protocol附录不存在，rg定位outbound_protocol后完整读取；宽rg输出截断只用作定位，不作全文资格。未写其他项目/正式03，未创建观测实现/provider/report/evidence/代理/并行调用，未stage/commit。下一Step16读SOP16/书写§5.15及原十一planned target、17+4机和十九flow协议/事务/幂等负例；不运行项目测试。
