# L6-bridges 03 Step13：并发、幂等、游标与重入

## 1. 开工确认

2026-10-03；已读SOP13全文/书写§5.12、Step8 metadata/codec、Step6 typed meaning/key/effect、Step7 key/unique/fence/comparator、Step9原重入及Step11~12事务/错误。用户授权剩余03，当前单agent串行，只当前Step校准写入，正式/实施/测试/提交关闭。

## 2. 模块计划

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| K1 canonical / key recipe | done | done | pass_design | pass | 进入K2 |
| K2 concurrency / rate / reentry | done | done | pass_design | pass | 进入X |
| X cross-audit | done | done | pass_design_static | pass | enter_step14 |

当前03/Step13/complete，gate_status=pass，gate_reason=canonical_concurrency_design_review_pass，next_allowed_action=enter_step14；当步语义写入关闭，BR-UP及原Workspace/Observability姿态不变，commit_required=false。

## 3. K1 可审查设计记录

问题2~4：C/E/J可重复，Q没有key或write。六namespace与各surface recipe不可互代；Command key唯一来自core metadata，source key来自verified注册源，Job key由typed subject/expected/正式basis推导，不含trace/requested_at/run。原typed meaning与stable effect必须保完整读回，结果缺失不能Fresh。

诊断：正文hash泄密且不能证明版本/授权；只按subject去重会永远阻后续合法维护，只换时间/trace逃key会重复效果。采用body-free typed语义canonical bytes精确比较及有界确定性source-key recipe，完整meaning另存；未采用raw payload digest、随机新key、hash collision当同义。无需新增digest DTO或加密产品，算法只技术codec；产品/长度/来源资格缺失仍NotEstablished。复杂度：全局canonical规则+逐操作族表，再逐并发场景。

## 4. K1 Canonical与幂等键

### 4.1 可计算的canonical语义

技术recipe=`bridge.identity.v1`，不是wire协议新version/type或authority。输入只能是已准入Step6完整typed meaning/key/effect；canonical材料禁正文/token/secret/敏感审批及其摘要。保存原typed meaning及recipe版本，等价以以下canonical bytes逐字节比较；不以结构Debug/Display或hash equality判断。

1. 构造有限JSON value tree：每named type编码为`[exact_type_name, fields]`，struct fields按Step6原声明顺序数组；enum编码为`[exact_type_name, exact_variant, payload]`，unit payload=null；Option显式null/inner，tuple/alias按原结构且保typed位置。LocalRefToken含完整namespace/kind/id，id沿32位lowercase hex；revision/SafeInstant沿Step8十进制字符串；bool/u32原JSON值；不允许float。
2. String保正式source原值与UTF-8 bytes，不trim/lowercase/Unicode normalize。JSON字符只用固定最短合法转义（quote/backslash及控制字符），其他Unicode直接UTF-8；safe字符串控制字符仍由原factory拒绝。无空白/BOM/对象键重排差异；fixed-order数组不依赖map迭代。
3. 语义集合按各元素完整canonical bytes无符号字节词典序排序并去重，重复若原validator不允许仍拒绝；普通Vec保原语义顺序，不排序位置/页/依赖历史。所有type/variant仅当前有限目录，unknown拒绝；长度/数量超当前qualified codec预算则不生成key/meaning。
4. `SafeAuthorityRef`的语义投影只取`id,kind,scope,source(owner,source_id,revision),revision`；其current validity由每次资格重核，不参与重复含义。Slot的kind及finite缺口/失效原因保留；业务显式action/window/expected/source版本字段不得省略。若同authority id/version语义改变，来源合同不一致，拒绝，不借有效期刷新改业务meaning。semantic ref更换或revision变化是新含义，不从clock擅自给新key。
5. opaque source位置只用已准入安全typed identity编码；raw resume token/nonce/私有URL不进入tree。trace、request_id、now、requested_at、lease检查时间、new operation/首次技术subject ID不是原meaning字段时不得添加。原DTO明确语义deadline、config/expected或引用version仍保留，不误删业务字段。

此处request digest定义为上述完整body-free语义canonical bytes，而非消息体hash；没有新public Digest type/算法产品。索引可直接使用有界bytes，若未来用hash缩索引仍必须存/比较完整bytes且另审collision策略，不在本设计默许只hash查重。

Job/source计算键recipe=`bridge.key.v1.` + lowercase hex(UTF8 canonical `[recipe_label, complete DedupNamespaceScope, stable_parts]`)；`stable_parts`按下表固定顺序，全部来自实际已核getter。生成后经SafeOpaqueId/QualifiedKeyValue::Source及`qualify_job_key`/`qualify_event_key`完整来源校验；不是任意客户端提交此格式即可trusted。Command保core `IdempotencyKey`原值不重写，数据库索引仍含scope/source/recipe。键及canonical bytes不进入日志/证据或public响应。

### 4.2 全族key / meaning / result回放

| surface / namespace | stable_parts / 唯一来源 | typed meaning / 窗口 / 重复结果 |
|---|---|---|
| C01 / Management | metadata唯一Some key；scope/config authority | Input.canonical_meaning -> ManagementBody::ConfigureInstallation，完整原五body字段/全部draft/config与local CAS；same key变义Conflict |
| C02 / Management | 同上显式binding scope | ManagementBody::ManageBinding，完整原六proposal字段及BindingMeaning七字段，含binding optional/maintenance/revocation/local CAS；无隐式身份创建 |
| C03 / Management | 同上mapping relation/generation/action | ManagementBody::MaintainMapping，完整原proposal四字段和五change variant全部载荷，保parent/origin/result/direction/local CAS；tombstone不当Fresh |
| C04 / Outbound | metadata key经Outbound scope；effect另unique | DeliveryOperationMeaning(kind,projection,target)与E02一致；同effect原intent/current结果优先，不重复prepare/send |
| C05 / Management | metadata key、source-action唯一 | Input.canonical_meaning -> ManagementBody::BindAction，原binding/source/target/responsibility四字段，初绑不含尚不存在action ID；重复原action/current结果复用 |
| C06 / Recovery | metadata key与受权原subject/op | RecoveryOperationMeaning(subject,original,authorization)；只请求，重复原recovery关联，不probe |
| E01 Message / Inbound | verified注册source stable event/source identity+version/change/方向；candidate key是正式source key，不由raw生成 | SourceOperationMeaning(action,context,source)；同namespace/current source recipe，ACK与owner结果分stage；full source ID/版本缺失不执行 |
| E01 Notice / Inbound | 注册`continuity_notice.v1`，stable notice identity、stream、previous/next epoch/range/reason | ContinuityNoticeMeaning七字段，namespace子recipe与Message排他；Unknown range显式编码，不hash私有position |
| E02 / Outbound | registered producer stable source/version/target/kind，event ID只在其正式recipe允许时 | 与C04同Delivery meaning/effect，event重投不改effect或目标 |
| E03 / Callback | verified源stable callback identity+原action/source/target/owner revision；raw token/nonce不入key | ActionOperationMeaning(action,target,state_revision,semantic_ref)；one-use另unique，duplicate不二次owner命令 |
| E04 / Handoff | registered consumer original operation/material/schema/权威disposition identity | 原SafeHandoffMeaning及正式处置recipe；仅原result-only，不新producer |
| J01 / Outbound | `job.dispatch.v1`：原DeliveryIntentEffectRef + trusted stable job scope/basis | 同原effect/meaning；终态结果复用，NoIo仅原attempt本地处置；同op重试另必authoritative NoEffect及完整RetryEligibility/current/all bounds/原业务预算 |
| J02 / Recovery | `job.operation.v1`：recovery_ref + original_subject + 原operation（实际row同源）+ stable job scope/basis | 原Recovery meaning；window/budget内同op只读probe或known finalize；无known不fresh |
| J03 / Recovery | `job.gap.v1`：原gap/range/epoch + stable job scope/basis | 原range/coverage请求含义；同key可合法只读续probe，不新增gap/op/跨stage水位 |
| J04 / Handoff | `job.handoff.v1`：原handoff/canonical/material/schema/consumer op + stable job scope/basis | 原SafeHandoffMeaning；duplicate原consumer disposition，继续须正式同op合同 |
| J05 / Recovery维护子recipe | `job.qualification.v1`：typed subject + **input expected** + maintenance basis stable id/source/revision + trusted scope | QualificationOperationMeaning(subject,expected,basis)；原expected结果先读，新expected只能实际行/新正式维护含义；Dedup目标与Job key分离 |
| Q01~04 | 无key/meaning/reservation | core metadata key/page必须None/null，zero UoW write及mutation/probe |

所有窗口用原`QualifiedRetentionWindowRef`/RecoveryWindow/authority current交集，不给通用24h/无限默认。同key同canonicalmeaning查 `find_dedup` 和 `find_result_for_key/get_result`：current允许才Visible，否则NotDisclosed；记录有而payload缺失OriginalPending/Unavailable，不fresh。Expired保持key/tombstone/unknown；same key不同meaning或kind/original关联冲突不返回winner敏感材料。

StableEffectIdentity包含完整meaning与原effect typed identity；fresh C04/E02在find_by_effect使用前必须按相同kind/source-projection/immutable target语义核unique，首次本地effect ID不参与新业务等价。已存在effect复用原ID/op；不同版本、edit/delete/thread kind不得被合并成同create。K1草稿/人工自检pass，下一K2。

## 5. K2 可审查设计记录

问题1/5：绑定代际、effect首建、one-use、lane/bucket、cursor和result-finalize都可能并发；driver必须同CAS/唯一/phantom范围保护。诊断：fence只防本地writer，平台没有对应fence就不能exactly-once；lease过期不能证明请求未到平台。采用原同op状态/CAS/current及完整coverage、shared max/budget策略；不采用旧session跳cursor、單lane锁忽略global限流或SDK隐藏retry。复杂度：并发/重入逐场景，测试引用原十一target，不创造恢复接口。

## 6. K2 并发、游标、限流与重入

### 6.1 并发场景与最小切口

测试简称仅沿Step9§7.5十一已有planned路径；本步不创建/执行文件或生成TC/EV。

| 场景 | 冲突资源 / 控制 | 失败 / 测试 |
|---|---|---|
| C01初建/修订并发 | namespace unique + actual local/config双条件，完整body含local_expected | PE Conflict::Version/SemanticKey；A/C/L，零第二安装/配置回边 |
| C02激活/撤销/旧代际IO | 同binding generation/local CAS，current actor/授权最终重核；新generation不是lease续期 | Version/Denied/Stale；A/C/L，旧mapping即时阻IO，不等J05 |
| C03同external两端竞争 | exact installation/relation/generation/typed locator unique，parent/action/source结果完整 | SemanticKey/Version/InvariantViolation；A/C/L/B，无first-row remap |
| C04与E02同effect首建 | 相同kind/source projection/version/immutable target完整canonical unique，plan/intent/新lane同U | Effect/Version；C/L/S，原winner优先，新技术ID不逃唯一 |
| E01重复/双source mode | 同source family唯一active mode，注册stable key/source identity unique+claim/dedup/result同U | SemanticKey/NotEstablished；B/C/L/I/W，ACK不owner结果 |
| C05同source-action初绑 | 完整四字段ManagementBody+source-action unique、原known source/current | Effect/OneUse/Version；A/C/L/S，fresh action ID不参与meaning |
| E03重复/跨actor/callback重放 | verified callback unique+原action one-use/fence+完整scope/current；actual claim才owner | OneUse/Denied/Stale；A/C/L/I/B，Claimed永久不再Active |
| J01 lane竞争/新rate bucket | lane/local双CAS+全适用bucket phantom保护+driver单调fence+attempt claim | RateReservation/Version；C/L/B/J/W，不能mutex替全局协调 |
| 原attempt迟到known对未知处置 | same attempt/op/claim/current expected，known-only合法member+immutable receipt unique | Version/InvariantViolation；C/L/B，保actual known责任不第二send |
| J02重复recovery/probe结果 | same subject/op unique，Requested/Probing/known guard；完整original result读先行 | Version/SemanticKey；C/L/J，NotFound不NoEffect，probe readonly |
| J03 B/C和source新epoch | gap/recovery各自CAS；B actual后C新stage coverage及cursor/local双CAS；旧epoch保tracker | Version/Unavailable；C/L/B/J，gap closed不stage complete，不字符串排序 |
| J04/E04 consumer处置竞争 | same canonical/op/claim，原stage/current及非递归scope，全CAS result-only | Version/Stale/Indeterminate；C/L/B/J/W，ACK lost不新producer/交接 |
| J05维护与IO/旧expected重投 | input expected/key先原result，actual关联页完整CAS；各IO独立current不依赖job | Version/SemanticKey；A/C/L/J，原window失效不续授权 |
| J05目标Dedup expiry与late result | 目标Present(local)及独立Job key/op；Expired保原key/result/unknown，late known只所属原业务合法收口 | Version/UnknownEffect；C/D/L/J，不复活Expired或删键后重跑 |
| Q与任一writer并发 | qualified committed完整snapshot+返回前visibility/current，strong不足Unavailable | finite只读结果；R/L/P，zero stale/audit/dedup/probe/repair写 |
| stop/crash/restart/SDK auto retry | phase/unresolved并集合并，durable原claim/op先查询；无driver proof零新apply | Indeterminate/manual；B/L/I/W/J，lease/取消不NoEffect |

### 6.2 顺序、cursor、限流与重入

| 边界 | 实现规则 / 继续条件 | 禁止替代 |
|---|---|---|
| local顺序 | QualifiedLaneOrderScope规定的target/dependency/动作范围，原head known合法处置后才后继；Unknown阻序 | 不宣平台全局total order，不按received_at/外部ID数字排序 |
| source游标 | (namespace_stream含Protocol/Owner/Delivery stage/source/schema,epoch)隔离；formal comparator Equal=no-op/Before拒绝/After+actual full stage coverage才advance | source history coverage不能直接stage proof；opaque token不做字符串比较 |
| gap窗口 | QualifiedGapRangeRef Known/Unknown显式，full source completeness proof才Closed；J03 B提交后新读C | count/空页/取消/超budget不完整；不跨epoch拼接 |
| rate下界 | 所有适用global/method/resource/bucket current bounds最大值；已有longer bound不缩，未知bucket/scope先Blocked | 单429 sleep/单channel计数不全局协调；retry-after值须正式method分类且不body日志 |
| retry预算 | 原effect/attempt窗口、RetryBudgetRef与current资格、最大attempt/时间预算全部满足 | 新lease/trace/run/restart不重置次数、截止或头依赖 |
| NoIo续行 | actual同attempt未越IO证明+原合法Domain边/current预算 | timeout/drop/driver unknown不得判NoIo；NoIo不推platform NoEffect |
| NoEffect续行 | authoritative原op/effect no-effect结果+current/Gate/附件/secret/all bounds/原预算，先合法恢复原state | 已有可能effect但NotFound/5xx/429/ACK丢失不能重send或重approve |
| known重入 | 原get/find_result与完整mutable snapshot，current过滤；payload immutable，后续阶段只是原record合法边 | 不把A local proof当业务terminal，不覆盖原payload伪新成功 |
| local unknown | only original mutation readonly driver disposition；无资格保持manual/blocked | 新begin/operation/key/apply/外呼均禁；absence不是rollback |

K2草稿及人工设计审查pass；十七durable机及四technical phase与Step11事务逐项配对，没有新增global success/stream state或retry coordinator对象。

## 7. X 草稿与跨审

canonical固定typed name/variant/完整stable字段、集合排序/Option/bytes与proof current分离；六namespace/二十协议/十九flow及原key/result/retention/claim闭环。所有key均来自已有typed getter/factory与原技术port，源ID/窗口/比较资格缺仍BR-UP-009，不用body hash。

S13-LOCAL-001最小修补：审查发现C01~03的leaf meaning无法装全部原DTO CAS/optional/variant载荷，C05 Callback需要尚不存在action ID。采用一个ManagementCommandMeaning四payload及一个ManagementBody variant，复用原Request完整schema；四Input.canonical_meaning具名纯成员保全部原body，canonical_bytes的impl放commands.rs读取DTO private字段。Step4归属、Step6声明/成员、Step7 consumption、Step8协议/codec、Step9调用顺序同步；没有新wire字段/命令/port/业务对象，不把读回当新授权。原四body与全部Slot/字段人工逐一核对，actual signature/schema扫描后关闭本地断口。

正式§12草稿采用§4算法/recipe/结果与§6竞争/重入规则；来源表和预算不新增产品。SOP顺序不变：本地补口重审后才进入Step14，正式权限仍关闭。

## 8. 实际检查

2026-10-04续接，日期变化不扩大授权。Node只读03表格/围栏/文件链接errors=[]；四Management payload均存在完整原Request schema、四Input成员及Step9消费实际存在，source_missing=[]；人工核原字段/CAS/variant完整与非递归值结构。S13-LOCAL-001=closed_design_contract；只关闭本地同义载荷/取得断口，产品/codec预算/driver/平台来源及BR-UP不释放。diff-check通过，无编译/项目测试/账号或运行。一次Step4 header补丁上下文错误未落盘，重读正确header后只加受权归属注记，原243索引/统计保留。下一读SOP14/书写§5.13、原safe settings/required/builder/四平台adapter及真实core/SDK path，正式装配仍关闭，不提交。
