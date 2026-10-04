# L6-bridges 03 Step16：测试切口与最小验证清单

## 1. 开工确认

2026-10-04；已读SOP16全文/书写§5.15、原Step4十一planned test target与support归属、Step9§7.5、Step10二十一矩阵及expiry repair、Step11~15事务/错误/幂等/配置/安全观测。只当前Step设计，不创建测试/脚本/运行编译或项目测试；所有case和fixture均planned，不产生run/artifact/report/evidence或readiness。

## 2. 模块计划

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| T1 modules / protocols | done | done | pass_design | pass | 进入T2 |
| T2 states / consistency / adapters | done | done | pass_design | pass | 进入X |
| X cross-audit | done | done | pass_design_static | pass | enter_step17 |

当前03/Step16/complete，gate_status=pass，gate_reason=test_cuts_design_review_pass，next_allowed_action=enter_step17；当步语义写入关闭，BR-UP/原WS/Observability资格仍原状态，commit_required=false。

## 3. T1 可审查设计记录

问题1/2/5：七role与十九C6/Q4/E4/J5入口及条件O01至少各正向/异常，正向指未来显式synthetic合格fixture下验证本地契约，不证明真实owner/平台接受。沿Step4十一planned test target及四support文件，不增delivery/callback/观测测试target，不写完整05 TC/suite/执行计划。

诊断：只给happy path或把fake receipt当真实NoEffect会漏关键断口；所有层全mock也不能验证同driver跨实例CAS/rollback/unknown。取舍：pure guard/codec单元、Application显式脚本port契约、qualified产品的后续driver集成与平台compatibility分别标注；真实测试未经04/05/07准入保持waiting/blocked。fixture仅synthetic且只内存private，不能真实账号/token/正文/敏感审批/secret或把原upstream资格填闭。

复杂度：十一target归属表、七module表、二十协议正反例表，再T2状态与一致性/平台泄漏反例；不创建实施文件/测试脚本/artifact或伪造pass。任何assertion必须观察原typed结果/actual调用次数及whole staged/committed集，而不是日志推成功。

## 4. T1 模块与协议切口

### 原planned target索引

本页简称仅表记法，全部沿Step4已有归属；没有新Rust/test/fixture文件。每target当前`planned / not_run`。

| 简称 | planned路径 | 验证边界 |
|---|---|---|
| S | `crates/contracts/tests/protocol_surface_tests.rs` | 完整wire/metadata/codec/字段与private排除 |
| D | `crates/domain/tests/local_guards_tests.rs` | 19Domain model/17durable机/2immutable无机，pure guard失败零修改；BridgeLocalView归Contracts S与Application R |
| A | `crates/application/tests/authorization_flow_tests.rs` | 显式binding/current/Policy/Gate/主体/one-use/外显 |
| C | `crates/application/tests/continuity_flow_tests.rs` | 原key/meaning/effect/op/unknown、cursor/lane与重入 |
| R | `crates/application/tests/safe_read_tests.rs` | resolver-first/完整snapshot/current/visibility、zero-write |
| B | `crates/infra/tests/platform_boundary_tests.rs` | 四adapter来源/双向mapping/ACK/edit/delete/thread/rate/原结果 |
| L | `crates/infra/tests/local_commit_boundary_tests.rs` | 同driver全集CAS/unique/seal/actual commit/原mutation |
| P | `crates/infra/tests/private_material_boundary_tests.rs` | owning/短借/secret/forbidden材料/log/error/trace排除 |
| I | `crates/api/tests/inbound_dispatch_tests.rs` | 即时trusted admission/private ACK与business分离 |
| W | `crates/worker/tests/consumer_dispatch_tests.rs` | source/mode排他、owning/eligible/cancel/shutdown |
| J | `crates/jobs/tests/job_invocation_tests.rs` | 五bounded原subject/input/selector/expected/current |

test-only support仅原application/tests/support/{mod,qualified_ports}.rs与infra/tests/support/{mod,qualified_providers}.rs；不导出production lib，不作运行provider fallback或外部准入。future synthetic fixture必须明确标记、完整原schema/Slot/expected/authority来源脚本可反查；不声明它是actual真实commit/NoEffect/evidence。

### 七module最小切口

| module / target | 对应契约 | 最小验证内容 | 建议类型 |
|---|---|---|---|
| contracts / S | Step6全部safe carrier + Step8完整schema | exact字段/required/optional/enum payload、core单一metadata；unknown/重复字段、错误wire/variant、body-free值闭包与预算拒绝 | codec/property/静态public传递图；非平台资格 |
| domain / D | 原19对象factory/rehydrate/member、17机及immutable | full input构造/初态、hydrate完整basis、合法guard/revision变化；非法边/缺Slot/过期/错误namespace失败原对象不变、zero IO | 单元/表驱动guard |
| application / A/C/R | 23port/19callable、Step9/11~15 | 显式port脚本、顺序/参数/同key known复用、whole阶段U；unknown不二次effect，Query zero mutable/probe/ID/审计 | orchestration契约；fake只synthetic |
| infra / B/L/P | 四平台/六owner/local/provider/配置required | 类型转换拒绝与raw error清洗；store CAS/unique/commit proof和所有bound；secret exact用途/撤销/复制/日志禁止 | adapter契约；产品真实集成待选择准入 |
| api / I/S/P | typed trusted dispatch/private source/实际ACK | route/version/context/预算先于execute、safe HTTP finite映射、ACK计划与actual执行独立 | entry契约/合成transport |
| jobs / J/A/C/L | 原五input/selector/invocation | actual summary才return；exact原subject/op/key/expected、candidate非authority、cancel保unknown | 有界invocation契约 |
| worker / W/B/C/P/J | 三runner/owning batch/session/source | mode/family排他、单in_flight、原plan归还/停止unresolved并集；不得detached/private捕获 | scheduling/source宿主契约；executor真实兼容另验 |

### 二十协议最小正向 / 异常

“正向”均是未来synthetic具备完整合法原来源/current时的本地assertion；当前没有已执行case。每行还须通用version/metadata/相同key变义/跨namespace/expired/current/raw清洗矩阵，不以一个例子代替完整schema。

| 协议 / target | 最小正向切口 | 最小异常切口 / zero forbidden副作用 |
|---|---|---|
| C01 ConfigureBridgeInstallation / S/A/L | 完整draft+management canonical meaning，双CAS原子接纳Configured | 缺配置basis/secret ref/wrong平台/expected stale/同key改变optional或config body -> 零部分写，不激活/解析secret |
| C02 ManageExternalBinding / S/A/C/L | typed提案及显式activation/maintenance/revoke各原basis、generation/local同时变 | Pending不能借Active current循环授权；平台admin/PAT/外部ID不授binding，不create GlobalMember |
| C03 MaintainExternalMapping / S/A/C/L | 三mapping/LinkMessage完整known owner+platform结果；合法current tombstone保历史 | 多命中/缺generation/source/action/unknown结果/变义 -> 不猜first、不平台delete、不覆盖tombstone |
| C04 PrepareExternalDelivery / S/A/C/L/P | complete source/projection/Gate/ref/附件及effect唯一、Absent lane首建同U | 缺disclosure/owner source/capability/qualified scope -> zero send；同E02竞争仅原winner |
| C05 BindExternalAction / S/A/C/L | ManagementBody完整source/target/actor/owner current，bind唯一action | 未known message/expired/跨source/签名替owner授权 -> 零one-use claim/审批；初绑不依尚无action ID |
| C06 RequestBridgeRecovery / S/A/C/L | 显式原subject/op Recovery Requested，适用Gap关联同U | basis/原subject冲突/缺range/错op -> 零probe/新effect；不能换key逃原unknown |
| Q01 GetBindingMappingView / S/R | resolver-first三root/full read basis/current滤safe slice | hidden/Denied/Unavailable返回finite，zero UoW/ID/audit/refresh；Strong不足不假空成功 |
| Q02 GetBridgeOperationView / S/R | 原Operation complete results、standalone Plan/Action、其他原root合法读取 | missing payload/original/basis或不全snapshot -> Unavailable；不造dummy intent/callback，不平台probe |
| Q03 GetContinuityView / S/R | 五root原state/unknown/epoch的current只读slice | private cursor/hidden count/expired原key不泄漏；zeroeligible/recovery/写 |
| Q04 GetSafeHandoffView / S/R | 原immutable audit及handoff consumer stage分开过滤 | 无准入/hidden不能补canonical/O01/evidence；Query zero审计 |
| E01 PlatformInputReceived / S/A/C/B/L/P/I/W | verified Private原key+full meaning/claim实际提交后owner；Continuity合法Protocol gap独立 | bad signature/source/meaning/mapping/self-send/replay/body预算；零未授权owner提交；ACK不清gap或造accepted |
| E02 CommittedSourceAvailable / S/A/C/L/W | formal source/version准入，C04相同StableEffectIdentity prepare | 收到event非owner提交、假producer/变义/current不足 -> zero send/第二intent，transport ACK非提交 |
| E03 PlatformCallbackReceived / S/A/C/B/L/P/I/W | source+actor+原action+owner semantics/current+one-use，actual claim后同op action | tamper/cross-target/expired/replay/owner revision变更 -> zero审批；claimed/cancel不复活 |
| E04 SafeHandoffDisposition / S/C/L/W | 正式原consumer/op结果与NonRecursiveResultOnly wholeCAS finalize | mismatched source/op/schema/无非递归rule -> 不造Accepted/新O01；保actual原known责任 |
| O01 BridgeLocalDispositionRecordedEvent / S/A/C/L/P | exact九字段+actual same commit/current/claim/正式producer recipe，原consumer op | commit前/mandatory不足/冒名Bus或SourceOwner/正文hash -> zero交接；ACK!=Accepted!=evidence |
| J01 DispatchQueuedDeliveryJob / J/A/C/B/L/P/W | A reserve/B InFlight actual提交后一次same effect dispatch，C known receipt/mapping/lane原子 | final current撤销/共享bounds/lease/commit lost/SDK hidden retry -> zero第二effect；unknown保head；NoIo与NoEffect不互证 |
| J02 ReconcileBridgeOperationJob / J/A/C/L/B/P | 原LocalCommit/Owner/Platform/Consumer分支readonly实际权威known合法finalize | NotFound/timeout/absence -> unknown/manual；zero send/reapprove；已known结果不回滚或覆写 |
| J03 ReconcileStreamGapJob / J/A/C/L/B | 同epoch/range full coverage B闭gap，C新读独立stage proof/cursor双CAS | partial/unknown/错epoch/comparator不可比/opaque字符串排序 -> 零advance；B成功不替C |
| J04 RetrySafeHandoffJob / J/A/C/L/W | 原op只读known优先，正式NoEffect/current/claim后same-op交接，非递归finalize | consumer未知/NotFound/schema-admission撤销/无nonrecursive rule -> 不新canonical/producer/盲重交 |
| J05 RefreshBridgeQualificationJob / J/A/C/D/L/P/S | 十一snapshot/九body族逐合法maintenance；expiry取得正式proof、target与Job两key/op同U | 缺expected/retention批准/current -> 零部分变化；TTL非authority；未知/Expired/head/one-use不清除或复活 |

T1草稿：正式§15保十一target/七module/二十协议表，正反例可反查原完整factory/port/flow；自检pass_design，所有planned/not_run。具体TC编号、case全量、suite、环境、运行命令/报告/verdict与signoff交05~07，不在本Step制造。

## 5. T2 可审查设计记录

问题3/4：17durable机123distinct允许对、四technical机27对，必须逐member输入guard与原wholeCAS集验证；相同state的合法有变化边不等no-op。所有未列状态对、缺required Slot、错误同subject/current/expected/窗口/terminal guard失败零修改，factory与rehydrate各独立验。M12三expiry已在受权repair补正式取得/J05消费，不能继承旧Step10停审缺口为当前事实。

诊断：race测试只靠sleep、单process锁或把rollBack成功当网络效果消失，不能验证幂等；gapClosed也不等cursor推进。采用确定性barrier/受控poll/call脚本与原driver实际事务集比对，覆盖两个winner/commit lost/lease/cancel/late known。测试依赖未选保持planned，不能以合成authority证明real driver或平台兼容。

取舍：状态逐机表+十六并发scenario+四adapter与private/consumer反例。原canonical recipe与core metadata用exact bytes/变义/optional/CAS/body载荷核，不hash正文。脚本门禁若05/07确认交付，先回Step4/16登记独立路径/完整I/O契约；当前没有已选脚本/collector/report格式，不生成空shell或预造证据目录。复杂度足以交05展开，不写实施任务排期。

## 6. T2 状态、一致性与外部边界

### 逐机最小切口

每行均参数化枚举原Step10矩阵的**全部**allowed pairs/具名member/guard、再测试枚举有限state集合的未列pair拒绝；不会造generic state setter。fixture从合法factory或明确synthetic hydration全字段进入源state。每次guard失败精确比较原对象未变，成功只候选内存变，actual persistence另核L；IO前current在A/C/B/I/W/J验证。全部planned。

| 机 / enum / target | 合法转换验证 / distinct对数 | 非法/边界最小反例 |
|---|---|---|
| M01 BridgeInstallationState / D/A/L | 12对，config/local独立轴 | 缺配置/维护来源、wrong安装、Blocked/Inactive非法复活；shape不授Qualified |
| M02 ExternalBindingState / D/A/C/L | 9对，Pending activation原formal basis | 缺两端/actor/action/generation，外部admin不授Active；撤销旧generation不得执行 |
| M03 IdentityMappingState / D/A/C/L | 3对，原mapping来源/current | 外部human -> 自动GlobalMember/跨安装anchor拒绝；终态不Linked |
| M04 LocationMappingState / D/A/B/C/L | 3对，channel/thread/topic typed范围 | parent/target/binding generation不匹配；Workspace不能反推channel权限 |
| M05 MessageMappingState / D/A/B/C/L | 3对，known owner/platform/source回链及tombstone | unknown无Linked、edit/delete缺原mapping、墓碑换target或覆写拒绝 |
| M06 InboundHandoffState / D/A/C/L/B/I/W | 10对，claim提交/owner结果阶段 | ACK -> OwnerAccepted非法，cancel不NoEffect，known不变unknown，无第二owner handoff |
| M07 PresentationState / D/A/P/C/L | 4对，资格/失效/明确安全Degraded | 敏感Gate无proof不得Degraded带action；Blocked终态不因重试复活 |
| M08 DeliveryIntentState / D/C/L/B/A/P/J | 14对，原effect/current结果 | PlatformAccepted非delivered；timeout不Ready/新effect，Blocked恢复须正式NoEffect |
| M09 DeliveryAttemptState / D/L/C/B/P/J | 9对，Claimed/InFlight/known/unknown/NotDispatched合法guard | InFlight actual提交前不dispatch；NoIo不NoEffect，lease到期不能重发 |
| M10 ExternalActionState / D/A/C/L/B/I/W | 3对，原action current/one-use | Claimed/Expired/Revoked无复活；验签不替owner revision/责任 |
| M11 CallbackHandoffState / D/A/C/L/B/I/W | 8对，source/claim/owner结果 | ACK不能Decision，Blocked终态非法resume；超时不release one-use |
| M12 DedupState / D/C/L/R/P/J/S | 6对，Reserved/known/unknown三expiry合法维护 | TTL/clock无proof拒绝；target与Job两key/op full compare；Expired保key/result/window/unknown不重执行 |
| M13 StreamCursorState / D/C/L/B/J | 6对，Ready->Ready After为真实revision变 | Equal no-op、Before/Unknown/不可比拒绝；Protocol位置/GapClosed不直接stage进度 |
| M14 GapState / D/C/L/B/J | 6对，原range/epoch complete proof | 空页/count/partial/换epoch不Closed；B闭gap不替C新stage读取 |
| M15 DispatchLaneState / D/C/L/B/J/W | 9对，claim/fence/full scopes/max bounds | unresolved_head阻后继；过期lease不释放，单process锁不跨实例，未知bucketBlocked |
| M16 RecoveryState / D/C/L/A/P/J | 8对，原subject/op/window，Unresolved保原结果 | LocalCommit proof不Owner/Platform/Consumer结果；缺scope不Probing或Resolved |
| M17 SafeHandoffState / D/A/C/L/P/S/W/J | 10对，原canonical/op/正式nonrecursive | Blocked迟到known不造ConsumerAccepted边；ACK/缺rule/NotFound不NoEffect，不产生第二O01 |
| M18 RuntimeExecutionPhase / I/W/J/P | 4对，required begin/Draining/实际停止 | Constructed缺seam不Active；停止unknown不清原op，不detached poll |
| M19 JobInvocationPhase / J/I/W | 5对，actual原summary/return/cancel | 无summary不CompletedLocal；cancel保unresolved，selection不authority |
| M20 SourceSessionPhase / B/I/P/W | 10对，实际connect/dispatch/disconnect/stop | 跨source/epoch/模式不Active；resume无完整coverage保gap |
| M21 WorkerBatchPhase / W/J/C | 8对，owned take/return/收齐同态 | 重复take/错plan return非法；CompletedLocal只batch收齐，原unknown并集不清 |
| immutable PlatformReceipt / SafeAuditRecord及BridgeLocalView / D/R/L/S | receipt/audit固定local1；view纯投影无业务机 | 无setter/原位覆写，guard/Query不造receipt/audit；没有全局SuccessState或durable view |

### 一致性、幂等、重入与恢复

| 场景 / target | 输入控制与assertion | 禁止通过的反例 |
|---|---|---|
| exact codec / ManagementBody / S/A/C | canonical type/variant/field order、Option/集合/UTF-8/authority stable投影；C01~03/C05完整body改变每条件即meaning变 | trim/大小写/正文hash等价；C05依不存在action ID；丢optional/CAS/action载荷 |
| 六namespace隔离 / C/S/L | complete scope+key recipe可计算；相同key同meaning复用原完整result/op，异义Conflict | request/trace/now/run/attempt/secret轮换当新业务key；inbound/callback key互借 |
| concurrent fresh management / A/C/L | barrier同时读expected，只有whole CAS/unique winner commit；loser实际rollback/读合法原结果 | 主行CAS过但关联行/audit/result未同步；partial claim泄漏 |
| C04 vs E02同effect / A/C/L | 不同transport key而同StableEffectIdentity只一个intent/lane/head | 相同内部source各入口double dispatch、变化meaning仍复用旧effect |
| E01重复/相同source变义 / C/B/L/I/W | source-key/core前置验证，原claim/op/owner known返回；duplicate zero新owner call | ACK lost重新造op，正文摘要补meaning，外部self-send形成回环 |
| E03 one-use双回调 / A/C/B/L/I/W | deterministic barrier/full action+callback/dedup CAS；只有一个actual claim后owner调用 | loser重批/lease到期/Expired恢复或换actor/action target |
| local commit ACK lost / L/C | actual journal脚本分别Committed/RolledBack/Indeterminate；only same mutation readonly恢复 | timeout/NotFound -> RolledBack；新begin/apply/operation重放 |
| J01 A/B crash / C/B/L/J/W | A/B actual proof次序，B后可能IO即unknown；单次dispatch计数及原fence | stage/B plan当commit、重启换attempt/effect、SDK隐式retry |
| full rate/shared scope / B/C/L/J | 两installation/resource适用shared scope有界同步；全部下界取max、unknown bucket阻 | 只单channel/最后429缩长bound；单process mutex允许超scope |
| lease/reentry/cancel / C/L/P/J/W | 原fence/claim/current窗口保持；取消known优先或original unknown | cancel/drop/lease expired当NoIo/NoEffect，保旧head却对后继send |
| known external而C finalize失败 / B/C/L/J | host保typed原known+mutation，合法same-op finalize后原immutable receipt/mapping | foreign结果回滚、重send、覆写旧known/自造新receipt |
| J02原四subject / A/C/L/B/J | owner/platform/consumer/local proof分支独立；缺compatibility NotEstablished | 一个proof通用Resolved、新effect probe变成execute/approve |
| J03 B与C / C/L/B/J | full source gap coverage与independent stage advance proof各typed；C新expected失败保B | coverage拼epoch/字符串位置、空页/count当完整、B写cursor |
| J04并发claim与E04反馈 / A/C/L/W/J | original op known优先/full CAS，正式非递归；exact原metadata/material/event recipe | duplicate producer/canonical/O01；ACK失去当未接收盲重交 |
| J05 expiry/maintenance竞争 / D/A/C/L/J/S | target oldexpected同Job input意味不变，expiry proof/current重核，原target/Job dedup分离同U | target key误作Job reservation、跨op泛化Plan、Expired result/unknown/head清除 |
| safe Query / R/S/P | resolver-first、actual full committed snapshot/current recheck；所有mutable/probe/ID方法调用计数0，hidden fields None | hidden count=0、查询audit/log subject、stale repair/补canonical或raw platform读取 |

### 四平台、secret与证据边界

| 适配面 / target | 最小正向（synthetic） | 必须拒绝 / 另需真实资格 |
|---|---|---|
| Slack / B/I/W/S/P | actual source种类、team/install/channel/ts/thread_ts、change subtype和method/ACK分离 | bad signature/timestamp/授权scope/cross-install、重试回环；method/workspace/channel bounds与exact probe须固定版本真实核验 |
| Mattermost / B/I/W/S/P | server/team/channel/post/root_id及trusted integration/plugin action转换 | PAT不internal auth、incoming webhook假event、unauth context、Blocks/legacy错部署；server/plugin/pin真实compatibility waiting |
| Telegram / B/I/W/S/P | bot/chat/message/topic/from/sender种类、webhook/poll updates原子排他、callback ACK | 缺secret用途/source、自造完整delete/history、offset=owner进度、file token URL泄漏；官网service/pin/安装资格waiting |
| Discord / B/I/W/S/P | guild/DM/thread/message类型、HTTP签名与Gateway family/session、interaction ACK | intents/permissions缺失、interaction token durable、跨session序列、Snowflake排序、只单bucket；fixed API/installation/probe waiting |
| secret / P/A/B/I/W | exact purpose/provider/key/revision/scope/current/route，final IO前revalidate撤销 | latest替换旧call版本、API Key/env/KMS fallback、raw token/header/error.source/SDK Debug/copy入日志/trace/disk |
| attachment / A/B/P/S | authorized ref/current grant，短借private render/upload，过期阻payload | 公共下载URL替授权、正文/附件bytes/hash持久化，平台file ID冒Artifact truth |
| sensitive Gate / A/S/P/I | 正式proof允许的无action安全RefOnly/Degraded才展示，owner callback双授权 | 脱敏自授权/低敏感默认审批、敏感内容/log/evidence、平台签名管理员替Policy |
| audit/canonical / A/C/L/P/S | original actual local材料同U、formal规则/准入/非递归、same consumer op | 当前map无Bridges却借Bus/SourceOwner/其他family、logger补audit、consumer accepted伪evidence/verdict/readiness |
| forbidden capture / P/S/I/W/J | 内存合成sentinel注入所有private/raw error/SDK headers；检查safe wire/log/trace/metric/snapshot/driver stage缓冲均无sentinel/可还原派生 | snapshot/redacted hash/base64/raw dead-letter/temp file/auto-instrument return、完整typed错误/metadata Debug泄漏 |

泄漏测试只用明确synthetic内存canary，不用真实消息/账号/token/敏感审批；失败报告仅有限case/边界分类，不能输出canary缓冲或“证据”正文。fixture与test日志不能用于补上游产品或平台安装准入；外部compatibility/实际调用另在05/06/07保持blocked/waiting直到真实安全资格和授权成立。

### 脚本与产物边界

历史03本轮未选脚本；05最新授权已登记TEST-03-001，当前七planned路径/完整参数/I-O/有限失败合同见本Step下段与03§4.4/Step4，未实现或运行。05负责具体TC/suite/harness schema/redaction/report；06负责验收，07正式完成时才分plannedboundary。完整当前合同如下：

### Planned脚本与local test-harness承接合同（05必要反校准）

2026-10-04；05已获用户授权，登记TEST-03-001。只增加以下七个planned脚本责任位置和S/P原testtarget内test-only harness DTO职责；不新增Rustsource文件/业务DTO/port/state/DDL，不创建脚本、输出目录、实现台账或boundary。旧161文件统计仍为Step4当时审计，当前具名planned职责新增7；其实现/boundary由正式07完成时登记。

#### 文件布局树: planned测试门禁与报告工具

```text
quantalithos-bridges/scripts/
|  +-- gates/
|  |   +-- run-bridge-local.sh
|  |   +-- run-bridge-real-seams.sh
|  |   +-- run-bridge-release.sh
|  +-- checks/
|  |   +-- check-bridge-run-context.sh
|  |   +-- check-bridge-test-evidence.sh
|  +-- reports/
|      +-- build-bridge-test-report.sh
|      +-- build-bridge-acceptance-handoff.sh
```

关键说明：全部planned；脚本不得放reports。gate产生安全机器材料，check只验证，report只读取机器产物再形成可审查初稿；三个角色都不授qualification或裁决。脚本能力/S-P自测、minimal index shell、finalEV pages、human acceptance handoff四成熟度不互证。

| 完整planned路径 | 类型/输入 | 输出/职责 |
|---|---|---|
| `scripts/gates/run-bridge-local.sh` | gate；原十一target的synthetic套件及TOOLS | cargo按11membermanifest/testtarget运行；profile声明expected实例、输出safe context/case/suite/index；不外呼 |
| `scripts/gates/run-bridge-real-seams.sh` | gate；SUITE-REAL与actual B/L/A/C/P/I/W/J | 先actualselected资格/安全sandbox/current注册；任一缺失blocked，绝不fallbackfixture；逐actualcase输出typed安全结果 |
| `scripts/gates/run-bridge-release.sh` | gate；fixed-run complete coverage汇总（非部署/验收裁决） | 只读同run已有synthetic+real-seam实例/contexts；两个check→两个report；少actual实例blocked，无新effect/伪pass |
| `scripts/checks/check-bridge-run-context.sh` | check；immutable context与approved safe profile/manifest/qualification | 校验run/build/config/selection/mode/qualification slot；不读secret值/业务ref，context缺失/漂移拒；零网络或业务mutation |
| `scripts/checks/check-bridge-test-evidence.sh` | check；case/suite/index/safe blobs与本05完整schema | 验证schema/digest/baseline/封闭实例/TC→DS→suite→EV→AC/allowlist与redaction；不造case/result/consumer接受 |
| `scripts/reports/build-bridge-test-report.sh` | report；经两check验证的原case/suite/index | 生成reports/runs/<run_id>/summary.md、evidence/<EV-ID>.json及index.json；不从静态plan造passed |
| `scripts/reports/build-bridge-acceptance-handoff.sh` | report；validated runreport/EV及原00 AC计划映射 | 生成reports/acceptance/<run_id>/handoff.md/json初稿；human/Agent review另reports/review/<run_id>/，不自动verdict/signoff/readiness |

参数合同：全部脚本支持`--run-id`（required，`^br-[0-9]{8}T[0-9]{6}Z-[a-z0-9]{6,12}$`）、`--artifact-root`（省略时仅`artifacts/test/<run_id>`）、`--config-profile`（required，04selector ASCII grammar的批准harnessprofile标记，不是raw config/ref）、`--help`（无运行IO）。重复/未知/缺参数拒，不能eval任意命令。artifact-root即implementationrepo内固定该run根；不同位置/absolute/.. /symlink/错误run拒，不能扩大写入范围。CLI是test-only，不新增production三入口参数。

I/O合同：context.json、case/suite安全JSON、index.json及非JSONtoken-only stdout/stderr在`artifacts/test/<run_id>/`；report到`reports/runs/<run_id>/`和`reports/acceptance/<run_id>/`，review只人审。完整harness schema/digest与文件清单由05§13固定；无latest或<project>层。case writer来自真实runner逐实例，stdout/stderr不inherit：未验证output仅bounded私有内存，每stream64KiB上限；安全allowlist后才写token-only blob，不保存raw SDK/平台错误或compiler自由文案。禁止消息/附件body、token/secret/私有callback/敏感审批及可还原派生，连摘要也不保留。

runner合同：仅调用原11target的membermanifest和Cargo test binary；例如S固定`cargo test --manifest-path crates/contracts/Cargo.toml --test protocol_surface_tests -- --test-threads=1`，其他按原target路径derive，不任意filter/跳过params。S/P testtarget内test-only DTO/writer先验safe字段后输出case artifact；不可导出到production wire/lib。只可用test-only env `BR_TEST_RUN_ID`/`BR_TEST_ARTIFACT_ROOT`/`BR_TEST_CONFIG_PROFILE`/`BR_TEST_MODE`/`BR_TEST_CONTEXT_PATH`传非敏感harness上下文，不能传token或原config值。每suite timeout从批准harnessbudget显式取得，缺失blocked；timeout/scopedcancel保existing safety材料和实际原unknown/对账责任，不retry整个real suite造新effects。

有限退出：0=该工具本次合同通过（非readiness）；1=assertion/check失败；2=参数/schema/path错误；3=blocked资格/coverage/baseline；4=unavailable工具/环境/IO。失败/blocked/unavailable保留已有安全artifact/report与有限failure分类，不能制造替case、伪通过或echo canary/raw error；无法安全建立context时仅有限stderr，不编造context或run实例。每run独占writer，immutablecontext/case输出禁止覆盖，minimalindex到finalindex只受控CAS/atomicrename；报告重复生成须同内容或拒冲突，不覆盖旧run。

状态仍planned/not_run/blocked实际seam；正式07才指定全部planned implementationboundary，implementation/test/stage/commit权限=false。


T2草稿：正式§15保二十一机+三无机、十六竞争、四平台/secret/证据表与脚本边界。矩阵允许对合计150不含factory，不新增edge/member；原target归属一致，人工设计自检pass，未执行任一case。

## 7. X 草稿与跨审

独立问题/诊断：二十协议不能漏O01或E01 notice；原二十一机的123+27允许对与immutable对象不是同计数。旧Step9/10停审checkpoint的十snapshot/expiry缺口已由repair替换，正式只能用当前十一/九body及具名expiry。取舍：按当前完整合同逐表反查，正向切口明确synthetic与real compatibility分离；零测试运行事实，未选脚本进入下游waiting而非实现时猜。

草稿索引：正式§15装配§4/6全表，不以“详见测试方案”省略；§5各module最小测试面保归属；具体05 cases/suites/fixture/redaction报告/verdict/07 boundary仍后续。X人工设计审查pass：协议/field/factory/原guard/阶段/unknown/expiry/nonrecursive/private/query与当前Step6~15一致，不能由test fixture补正式资格。

## 8. 实际检查

2026-10-04只读文本审计：47个03 Markdown、1452表、624围栏块、151相对链接、十一snapshot/expiry，errors=[]；十一target全在Step4原归属，outside=[]；二十协议独立正反例、二十一机及原150允许对均可定位。git diff --check通过。首个协议计数扫全文误纳一致性表五行得到25；限制到二十协议章节真实重跑20/distinct20/errors=[]，不删真实测试切口修计数。

本Step只设计静态/来源/边界核对，tests/script files created=0、compiler/project tests/platform calls/run/artifacts/reports/evidence=0；case与real compatibility均planned/not_run或资格waiting/blocked。下一Step17读SOP17全文/书写§5.16、中间产物§5.10、真相源闭环与实施前阅读/提交/git规则；不创建07/实施台账/boundary，不提交。
