# L6-bridges 03 Step14：配置引用与外部依赖绑定

## 1. 开工确认

2026-10-04；已读SOP14全文/书写§5.13、Step3 path/Future资格、Step6 safe settings/budget/required、Step7 builder/四adapter/owner/secret/Config、Step11~13 driver/codec/窗口。当前只本Step校准写入，单agent串行，无SDK/OAuth/API Key/KMS/router/DB/executor预选或真实安装声明，不写04/正式03/实现/提交。

## 2. 模块计划

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| C1 config refs / strict injection | done | done | pass_design | pass | 进入C2 |
| C2 platform / owner / local binding | done | done | pass_design | pass | 进入X |
| X cross-audit | done | done | pass_design_static | pass | enter_step15 |

当前03/Step14/complete，gate_status=pass，gate_reason=config_binding_design_review_pass，next_allowed_action=enter_step15；当步语义写入关闭，BR-UP及原WS/Observability资格原状态，commit_required=false。

## 3. C1 可审查设计记录

问题1/2/5：配置由Infra structured loader消费；contracts只是safe引用schema，Application接受current资格而非raw配置，Domain不读env/网络/文件，API/Worker/Jobs只消费actual composition和budget。所有权限、installation、secret用途、capability、route、维护/保留依据没有宽松默认值；预算非零但具体值未定，缺合法profile不启动对应branch。

诊断：路径存在、shape合法与Qualified是三件事；safe settings不能直接授Active installation或Gate权限。把shutdown_deadline当持久配置、把当前secret版本自动换成latest、把通用JSON/env透传到Domain都会破坏已有契约。没有CodecBudgetRef或通用retry配置对象，不能在本Step补造。required表按Step6底线与Step7补全取并集，Query零写例外不得被local common误吞。

取舍：仅使用原SafeRuntimeSettings四字段、RuntimeExecutionBudget五字段、InstallationConfigDraft七字段及原qualification refs。structured loader -> validate -> required registry -> composition纯评估 -> actual provider绑定 -> entry admission -> 每次IO重核，七role单向消费。max_private_bytes约束入口、material、payload和secret的本call读取；Step8/13 codec的u32上限只可在合法有界profile内检查转换，不溢出/截断，不增加wire字段或自行选默认大小。具体配置格式/优先级/值/profile/轮换和部署示例由04闭口；这里保留明确绑定点与拒绝姿态。

复杂度：先配置消费表，再装配不变量；不按每个getter重复生成配置项。C1思考完成才写消费表，C2未写。

## 4. C1 配置消费点

所有行默认均为`none / explicit required`；未选能力只能明确不注册，不能把mandatory seam改成optional。本表字段均在既有卡定义，不是新增配置schema或文件/env键名。

| 配置项 / 原类型 | 读取位置 / 消费模块 | 默认 / 不合格处置 | 04承接位置 |
|---|---|---|---|
| SafeRuntimeSettings.installations: Vec<InstallationConfigDraft> | Infra configuration/load.rs -> settings.rs/validate.rs；按完整namespace查每个installation | 无默认安装；重复namespace、platform不匹配或来源缺失拒绝；空集不启用平台支路 | installation profile/source优先级 |
| InstallationConfigDraft.namespace/platform_kind/revision | ConfigQualificationAdapter；C01 InstallationRepository CAS；各BoundPlatformAdapter | 原namespace不跨平台；首次config1、后续原expected CAS下一值；不以值合格宣运行Qualified | 安装定位与配置版本发布 |
| capability: CapabilitySnapshotRef | qualification.rs、PlatformAdapterContext、逐source/method driver；Application资格port | 未核version/installation/direction/method保持NotEstablished/Unsupported；无4/4默认 | 四平台能力快照/version/method |
| secret_binding: OpaqueSecretBindingRef | configuration/settings.rs/qualification.rs及infra/secrets.rs；BoundSecretAdapter/SecretResolutionPort | exact provider/key/revision/scope/window；仅ref，禁raw token/env值/私有URL；缺资格拒绝 | provider选择、ref格式、轮换/撤销 |
| route_policy: RoutePolicyRef | qualified router/transport/provider注册；QualifiedSecretUseContext.route | exact受权target/family/version/content type；不以请求URL/外部channel/redirect推route | 路由profile与网络边界 |
| basis/configuration_basis: ConfigurationBasisRef | InstallationConfigDraft/SafeRuntimeSettings；ConfigQualificationPort | 正式source/revision/scope与current窗口都齐，不以配置owner替Policy/Gate | 配置接纳与变更授权 |
| SafeRuntimeSettings.branches: Vec<RuntimeBranchKind> | runtime/composition.rs；API/Worker/Jobs admission | 明确选用；不得从bin名暗启；与required.branches集合一致 | 运行角色与启用能力profile |
| RuntimeRequiredSeams.bindings: Vec<RuntimeSeamBinding> | runtime/composition.rs + Step7 QualifiedInfraPorts/technical hosts | actual kind/source/qualification覆盖全部选中安装与scope；无重复/借用别安装资格；mandatory缺失阻对应branch | 逐provider绑定资格 |
| RuntimeRequiredSeams.sources: Vec<QualifiedPlatformSourceRegistration> | API入口/Worker PlatformSourceHost及composition | installation+actual source+family排他；Telegram同updates来源原子切换；断连保epoch/gap | source mode与切换profile |
| RuntimeExecutionBudget.max_inflight: u32 | runtime/execution.rs；API/Worker/Jobs scoped admission | 非零受核上限；超预算拒绝/有界等待，不隐藏spawn | 并发profile |
| max_batch: u32 | WorkerBatchBudget、eligible selector/page、JobInvocationDispatcher | 非零有界，page不突破单batch剩余；候选不授execute | 批次/分页profile |
| max_private_bytes: u64 | private lease入口、BoundPrivateMaterialAdapter/BoundSecretAdapter及Step8/13 codec | 非零；先核长度/checked conversion；超限finite拒绝，禁临时文件/cache/dead-letter；数值未选 | ingress/material/secret/codec资源profile |
| max_wait_millis: u64 | BridgeCallControl/平台/owner/store/provider/transport scoped宿主 | 有限非零；取本地budget、deadline、current窗口交集，不缩rate下界；到期保unknown | 单call等待/timeout profile |
| shutdown_deadline: SafeInstant | actual停止事件ScopedRuntimeClock同域now + 批准窗口 -> 原资源元组的新RuntimeExecutionBudget -> RuntimeExecutionState::begin_shutdown(shutdown_budget, unresolved) | 启动seed只构造不当TTL；每次停止重建，不读持久旧deadline、不由外部timestamp决定；clock/profile缺失不造deadline或NoEffect；到期保原unknown集合 | shutdown窗口和时钟provider |
| QualifiedRateLimitBoundSet / QualifiedRateLimitBounds | PlatformDriverRequirements.qualify_rate_bounds -> LaneRepository/J01 | 所有global/method/resource/bucket适用bounds取最大；缺scope/未知bucketBlocked；不能配置取消平台下界 | 平台/方法限流qualification来源 |
| RetryBudgetRef / AuthorizedAttemptWindowRef / RetryEligibilityRef | PresentationQualificationPort、DeliveryIntent/Attempt及J01/J02 | 原effect窗口/attempt数/时间预算+current；无自动retry默认；SDK隐藏retry不合格即阻IO | retry/attempt预算profile及来源 |
| QualifiedRetentionWindowRef / RetentionExpiryBasisRef | ConfigQualificationPort.qualify_dedup_expiry、J05与ContinuityRepository | 批准retention/current维护/治理适用性全部齐；clock/TTL非authority；tombstone及unknown不清除 | 去重保留与维护授权profile |
| SafeAuthoritySourceRef / OwnerContractBinding / LocalStorageBinding | 六BoundOwnerAdapter、LocalStoreAdapter/LocalCommitProbeAdapter | exact source/schema/version/scope/current；同store原mutation权威probe；缺完整合同Blocked | owner/store契约与产品绑定登记 |

### 装配消费顺序与不变量

1. `configuration/load.rs`只把受权结构化来源解码成上述原schema。未知字段、类型/版本不匹配与非法ref由validate拒绝；不得把未核remote配置、平台headers、任意JSON map作为trusted settings。配置文件/env/remote选择均未建立。
2. 按Step6 RuntimeRequiredSeams底线与Step7§6.2及十九callable实依赖取并集；只裁掉明确未启用入口的能力，不移除已声明branch下限。每installation/source/family独立资格；SafeRead保持zero UoW/ID/write/probe，technical clock另绑定同域provider。
3. RuntimeCompositionPlan::evaluate只纯评估。actual Bound adapters、QualifiedInfraPorts与各technical host必须与registry、source/revision/scope及预算同源；尚无合格产品就NotSelected/NotEstablished，不借test fake。入站/回调先完成私人来源核验，管理配置接纳不等于安装Active。
4. Entry admission核actual availability/current budget/clock。Application在每次local mutation/owner或平台IO前重核current Config/Policy/Gate/binding/材料/secret/limit；启动时窗口不足或运行中撤销阻后续IO，不把原known覆盖成unknown，也不把原unknown当NoEffect。
5. reload/轮换须受权CAS版本变更与source mode切换合同；已有operation/effect/key/secret exact版本不静默重定向。新版本能否恢复旧op必须原readonly权威合同证明，不能直接重发。短借drop不宣zeroize；provider/SDK复制、销毁和调试输出资格留C2/04核验。

C1草稿：正式§13保留全消费表和顺序；原完整settings/secret/required对象卡仍装配§5，不能只留本摘要。C1人工设计自检：原字段/类型/consumer/非默认/04边界逐项回指pass_design；未取得任何产品、运行或测试资格。

## 5. C2 可审查设计记录

问题3/4/6~8：四平台独立driver，六owner独立Requirements，store/commit probe同driver，private/secret/config/transport/executor各在既有planned文件注入。不把runtime owner关系改Cargo；core真实path是唯一确定计划compile来源，SDK仍条件。每个产品必须exact version/feature及传递闭包核验，具体供应链值未知不填写；接口需求不证明上游已有同名API。

诊断：historical README Python/TS SDK、OAuth优先/API Key fallback、KMS和路由不能继承资格。用通用SDK raw request、默认latest、HTTP 2xx或平台NotFound补上owner/probe契约会越权。产品库隐式retry/log/debug/raw error、跨线程scoped Future、private复制/redirect、body保存若不能禁用或证明满足原边界，该binding不合格，不是安全降级模式。

取舍：记录现有需求面、读已登记平台语义、核真实core/SDK manifest；不臆选registry包、版本、安装或token。timeout均服从原control/current/budget，未知副作用不重试，只有具名原op恢复资格可probe/重交；Unsupported只依原typed错误映射，不新造全局success状态。test-only explicit fixture可验证结构，但不能成为运行provider/外部资格依据。pin/实账户/供应链、配置数值和provider产品须04/07据实关闭后才释放对应IO支路。

复杂度：四平台与六owner逐行分开，随后local/secret/runtime seam及跨仓表；不写完整04或另建工程/implementation ledger。C2思考完成才写绑定表。

## 6. C2 绑定与失败姿态

### 四平台adapter/config/secret seam

共同需求为Step7 `PlatformDriverRequirements`全十二method及适用`PlatformSourceHost`/private lease/ACK；不是所选SDK的现成API。全部`product/pin/install qualification=not_selected/not_established`。以下按00 PS-01~14已登记公开语义复核；本Step未新增网络核验，Telegram官网PS-07仍unavailable，master/current来源不升级固定生产版本。

| 依赖 / 既有绑定位置 | 使用面与需核能力 | timeout / retry / 恢复 | seam释放条件 / 当前降级 |
|---|---|---|---|
| Slack；infra/platform/slack.rs -> BoundSlackPlatformAdapter | Events HTTP或Socket按Inbound family排他；team/enterprise/app/install与user/bot/account/channel/ts/thread_ts映射；签名/raw仅private；每method edit/delete/reply/file引用；C05/E03原action关联 | ACK deadline按实际协议，内部wait另控；method/workspace/channel全部下界；原effect权威probe未证实不盲重发 | exact SDK或API wrapper/pin/features、安装scope/OAuth/撤销/secret用途、隐式retry/日志关闭及method/probe/comparator逐项核；当前受影响IO blocked |
| Mattermost；infra/platform/mattermost.rs -> BoundMattermostPlatformAdapter | server/installation版本；trusted HTTP或WebSocket；typed user/bot/team/channel/post/root_id；Blocks/legacy及可信integration/plugin回调不能从context自授权限 | server/method/resource限制按部署；readonly原post结果不是本地commit；未知保manual；incoming webhook不能充任事件输入 | 核实际server/plugin/API与SDK/pin、PAT/API Key用途/账户权限、回调认证、edit/delete/file grant及probe范围；当前blocked，不套Slack签名或SDK |
| Telegram；infra/platform/telegram.rs -> BoundTelegramPlatformAdapter | bot install；webhook/polling同updates来源原子排他；from/sender_chat/chat/message/topic类型分支；callback_query关联；file引用不持长期token URL | offset/update_id仅Protocol位置；retry_after正式scope下界；无删除通知完整性/无限历史/通用probe假设 | 官网/固定Bot API版本与实际部署能力、token/secret header/source时限、chat权限/topic、readonly窗口与SDK隐藏retry重核；PS-07不足处不开放positive |
| Discord；infra/platform/discord.rs -> BoundDiscordPlatformAdapter | application安装/guild/DM/channel/message/thread；E01 Gateway intents/session/sequence；E03 HTTP/Gateway同interaction family排他；Ed25519/token/deadline private；followup与edit/delete差异显式 | interaction ACK窗口不等业务提交；bucket+major resource+global全下界；session/resume无full coverage仍gap；Snowflake非comparator | fixed API/SDK/pin/features、bot/OAuth安装context/intents/permissions、callback验证与短期token、source/probe/attachment method重核；当前blocked |

### 六owner正式兼容绑定

共同绑定为原`OwnerContractBinding` + 六`Bound*OwnerAdapter` + `OwnerPortFacade`，实际方法全签名装配Step7§3，不只依本表。所有owner timeout服从原control和current窗口；完成与失败都只映射原finite结果。timeout/disconnect/5xx/NotFound不证NoEffect，不在adapter重新创建operation；SDK raw调用不能补缺正式合同。

| runtime / event依赖 | 既有绑定位置 / 使用接口 | 尚未释放的精确面 | 不可用姿态 |
|---|---|---|---|
| L1-conversation | infra/owners/conversation.rs；ConversationOwnerRequirements，E01/E02/J02/J03 | bridge-origin mode/材料/owner accepted/原op查询、formal committed source、same-epoch coverage/comparator；BR-UP-001 | 对应handoff/source/probe NotEstablished；不建Turn truth或把ACK当提交 |
| L1-identity | infra/owners/identity.rs；IdentityOwnerRequirements，ActorResponsibilityPort | 既有AI GlobalMember锚点与正式actor/external human责任链兼容；BR-UP-002 | external_id不能create GlobalMember；human无责任链拒绝，不变AI |
| L1-governance | infra/owners/governance.rs；GovernanceOwnerRequirements，Binding/Actor/Presentation/Read/OwnerAction | 显式两端/action绑定、Policy/Gate/current安全投影与敏感降级、callback owner revision/one-use、维护/retention适用性；BR-UP-003 | 不以签名/平台管理员/OAuth/PAT授权；无外显proof保持Blocked或原已获准安全RefOnly，不自行降敏审批 |
| L1-artifact | infra/owners/artifact.rs；ArtifactOwnerRequirements，private material与presentation组合 | 附件准入、authorized ref/grant/current有效期与短借传递；BR-UP-004 | 不缓存附件bytes/下载URL，不制造Artifact；引用过期阻该payload |
| L1-workspace | infra/owners/workspace.rs；WorkspaceOwnerRequirements，选用safe read/source | safe export/read/provenance；原WS-UP-001~008/006-S与WS-LOCAL-001~003沿上游状态；BR-UP-005 | 未选不引入；选用却缺资格阻该分支，不反推channel/权限或当optional降级 |
| L4-observability | infra/owners/observability.rs；ObservabilityOwnerRequirements、SafeObservationPort，条件O01/J04/E04 | formal03§7.4静态producer map九operation及SourceAudit四family无Bridges；准入/schema/mandatory或nonrecursive规则、consumer原结果；十二affected及BR-UP-006 | missing formal rule不默认audit-only；mandatory材料/准入不足先阻mutation/IO；local audit不升级canonical/evidence |

### local/provider/runtime seam

| 依赖 | 既有绑定位置 / 使用面 | timeout / retry / 降级 | 必须核验后才释放 |
|---|---|---|---|
| DB/store/transaction manager | infra/persistence/local_store.rs与commit_probe.rs；原八repo+UoW+LocalCommitProbeAdapter | begin/CAS/unique/全写集seal/commit原子；原mutation unknown只同driver readonly probe；不换新begin重放；Query snapshot完整 | 19 logical collections、Step11所有独立revision/unique/index/actual journal/rollback/wholeCAS与跨实例协调；exact产品/pin未选 |
| clock/ID/fence/page token provider | runtime/execution.rs、LocalUnitOfWorkPort及store | 同qualified clock域/有界读取，取消不等rollback；ID/cursor/fence不从正文/外部ID/time自造；缺provider拒绝 | actual entropy/唯一性、单调fence、opaque cursor/read scope与source/version；不引新业务port |
| private material provider | infra/private_material.rs；PrivateMaterialProviderRequirements -> BoundPrivateMaterialAdapter | actual current/read/render/checked bytes；只本call owning lease，cancel/drop不宣zeroize；禁durable/temp/dead-letter | source/grant/schema/窗口、buffer复制/销毁/SDK debug/error行为；超限/缺资格有限拒绝 |
| secret resolver/KMS/OAuth/API Key | infra/secrets.rs；SecretProviderRequirements -> BoundSecretAdapter | exact provider/key/revision/purpose/scope/current -> owning短借；IO前revalidate撤销；无latest/env明文/API Key fallback | 产品/SDK/pin、scope/用途/轮换/撤销/复制销毁、route/private error清洗；所有凭据值禁止日志/证据；KMS未选 |
| config provider/固定router | configuration/load.rs/validate.rs/qualification.rs；runtime/composition.rs | strict原schema/无默认route；HTTP redirect/proxy若改变获准target即拒绝；配置变更受权CAS | 正式配置source/优先级、route目标/网络/TLS资格、registration版本与host映射；产品未选 |
| HTTP/socket/poll/Gateway host | API/Worker原entry + PlatformSourceHost/private lease/ProtocolAckExecution | actual private verification及source deadline；ACK结果单列；resident断开/停止保epoch/gap，不后台继续call | 逐安装/family/mode排他、raw buffer预算/清洗、认证与ACK语义；缺资格不造listener/session |
| Bus / safe event transport | infra/events/transport.rs；SafeEventTransportHost/SafeTransportAckCall | qualified E02/E04 envelope与same原result；transport ACK不equal owner/consumer accepted；断线保原op/coverage | 正式producer/source/schema、consumer过滤、opaque ACK identity、body-free decoder；Bus非无条件Cargo依赖 |
| executor/server/runtime | runtime/composition.rs/execution.rs；API/Worker/Jobs原dispatcher/runner | scoped poll非Send Future、不detached；budget/deadline/cancel/shutdown保原known或unknown集合 | exact产品/pin/features及Future/lifetime/private销毁契约、host同源装配；产品未选，不能默认Tokio/Axum等 |

### 本地多仓编译资格

| 依赖仓 / 关系 | 真实路径 / 默认引用 | 使用位置 | 不可用处理 |
|---|---|---|---|
| quantalithos-core；已裁剪compile计划 | `/home/aris/Projects/quantalithos-core/crates/contracts`，package=`core-contracts` / lib=`core_contracts`；目标workspace根`path = "../quantalithos-core/crates/contracts"`、member `workspace = true` | contracts唯一重导出actor/metadata；直接使用者显式申明；不依core domain/infra | 缺真实仓/exports或compatible closure暂停该实现，不造同名fake crate；完整version/实际commit/lock与build资格未核 |
| quantalithos-sdk；条件compile候选/runtime client | 实际`/home/aris/Projects/quantalithos-sdk/crates/client` package=`sdk-client`及`crates/contracts`；尚未启用Cargo | 若后续正式owner/client兼容与传递closure通过，只外层Infra binding；metadata不为helper引整包 | manifest实际依sdk-application/contracts/domain/infra，contracts又有Bus；不当轻客户端，不关闭BR-UP-007；qualified前保持条件，不填写新path依赖 |
| 六owner / Bus / L5-chat | runtime/event关系，不写Cargo path | 原owner/event adapter；Chat reference_only | 缺正式source/兼容不借其他producer，不新增compile边或依Chat未停审内容 |
| target实现仓 | 计划`/home/aris/Projects/quantalithos-bridges`，本轮未创建 | 七member/七bin的原Step4布局 | 没有实际Cargo/package/remote/commit/build；设计任务不创建、不检查项目测试 |

exact pin接纳检查清单：产品名/版本/feature/传递closure、许可与安全来源、锁定供应链、逐method/source/installation资格、timeout/cancel/hidden retry/redirect/private复制/log/error、原结果与readonly probe、全部limit/cursor/rollback语义。任一缺项保持对应branch blocked；版本或产品改变若影响原schema/边界，回01/02/本Step复审，不能由实现者自行填latest。未来07只记真实事实，本表不提供虚构commit/hash或供应链合格结论。

C2草稿：正式§13保留本表、路径和所有未选/释放条件；逐driver全签名仍装配§5，owner/runtime与compile关系不混写。C2人工设计自检pass_design：四平台、六owner、八local/provider/runtime行和两真实manifest可反查，未知仍原未知；没有新产品/业务port/配置schema。

## 7. X 草稿与跨审

独立问题/诊断：consumer表不能代替原完整schema/签名，required两表的共同底线不能靠当前单call删除，Query例外又必须保零写；core真实manifest与pin/build资格必须分开。取舍：正式§13装配C1/C2完整表与顺序，§5仍装配原对象/Requirements/builder；04值/profile不提前写，07真实资格不提前记。本Step没有新增type/member/port/状态/编译边；原十branch、23port、19flow全量消费与缺资格姿态可回指。

X设计审查pass：原fields与Step4planned归属、required并集/Query例外、当前secret/route/limit/maintenance、owner/runtime/event与compile、原op unknown/private/audit边界逐项一致；表格不是产品可用断言。下一Step15读SOP15全文/书写§5.14及Observability静态producer map/SourceAudit与Step9 O01/Step11事务材料；当前不装配正式03。

## 8. 实际检查

2026-10-04只读Node Markdown/原expiry检查：45个03 Markdown、1438表、624围栏块、151相对文件链接、十一snapshot variants，errors=[]；`git diff --check -- projects/L6-bridges/`通过。人工逐项核C1原四/五/七字段及C2四平台/六owner/八local seam、core/sdk两manifest，未改schema/签名/状态/新path。范围hash待Step19最终复核，不以本检查断言其他文件当前hash已确认。

过程事实：恢复时宽rg触及无关workdoc权限拒绝，改精确ancestor/file读取，未改那些目录；两个猜测附录名不存在，随后rg定位正确infra_contracts文件；宽标题检索/大段读取截断未作全文资格。C1首稿不存在secret_refs.rs已在当前表归回原settings/qualification及infra/secrets.rs；无新增实现文件。所有检查只是设计文本静态审查，未编译、运行项目测试/平台IO或生成证据；无代理/并行调用/stage/commit。
