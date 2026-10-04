# L6-bridges 03 Step8：API / Command / Query / Event / Job 协议契约

2026-10-03受权修订说明：E01 notice recipe/qualified来源与fresh缺mapping/source的零durable合同已在原Inbound附录明确；Q02 wire不变、由受权新增独立snapshot读取root承接，C06 Gap关联在同UoW显式attach，五Job仍原allowlist。原606等统计/各族停审权限为历史checkpoint，不声称当前仍禁止用户已授权的repair。当前门禁/跨层重审见[repair记录](03_ddd_step_09_contract_repair.md)和项目台账/03 flow；不扩大外部准入。

## 1. Step状态、开工确认与内计划

2026-10-03；full-restart / single-agent-serial。用户最新“现在完成 step8”只授权03当前Step8，承接Step7停审结论；不等同正式03或正式07授权。完成本Step即停审，不进入Step9，不实施、运行项目测试、stage或commit。

当前已完成B0 -> G0 -> C1 -> C2 -> Q -> E0 -> E1 -> E2 -> O -> J -> X，设计静态自检pass，用户停审waiting；唯一恢复点为`03 / Step8 / step08_complete_waiting_user`。以下各族开工/checkpoint均历史记录，不重新开放其写入。

| 开工项 | 实际记录 |
|---|---|
| 恢复来源 | 项目台账、03 flow、Step7主文件/附录、Step6§7.12及shared卡、Step4路径、正式02§7；前序停审正文保留 |
| 通用规范 | 通则§1.4~1.5；中间产物§3.4.3~3.4.7/3.5~3.6/4；真相源§2.1.1/2.2/2.6~2.7/3.3~3.3.1/3.5/3.7~3.7.1；全局依赖全文 |
| 当步规范 | 详细SOP Step8全文；书写§4.3~4.4/4.6/5.7；设计Rustdoc中文，源码语言仍沿Step3 |
| 本地正式输入 | 02§7.1~7.7及01§10；当前00~02沿前序首次阅读，不冒称本轮全部重读 |
| 专项来源 | SDK03§7.3~7.4；Conversation03§7.1~7.4；Identity01§4；Governance03§7.1~7.4；Artifact03§6~7；Workspace03§7及项目台账；Observability03§7.1~7.3及实施台账当前状态。协议族内按需补读其正式校准来源，不发明foreign API |
| 组织参考 | Governance Step8§1~7、Command结果示例、§10.1~10.3、§12.1~12.3；仅参考逐族、独立schema、停审及跨审粒度，不复制truth/outbox/job run/产品选择 |
| 真实共享类型 | core actor.rs全文；metadata.rs的Request/Command/QueryMetadata、PageRequest/PageToken/QueryConsistency实际字段；core未提供Bridges协议/Job DTO |
| 只读基线 | 233既有文件SHA-256：Bridges全部既有文件、standards、七owner正式/必要台账、Governance Step5~10、其他已有dirty及两个实际core文件；仅flow/本台账可变 |
| 写入纪律 | 当前agent独立串行；只apply_patch手工写入；只当前Step8主文件/到达的当步附录、03 flow、本台账；未来Step不建文件 |

### 1.1 Step内计划与协议族门禁

| 批次 | 协议族 / 模块 | 思考 | 写入 | 草稿 | 自检 | next_allowed_action |
|---|---|---|---|---|---|---|
| B0 | 整体骨架、恢复与当步权限 | done | done | not_applicable | pass_structure_only | G0 |
| G0 | 唯一名称、版本、metadata、codec及安全错误 | done | done | done | pass | C1 |
| C1 | U1 C01~C03与两个deferred proposal | done | done | done | pass | C2 |
| C2 | U3/U4/U5 C04~C06 | done | done | done | pass | Q |
| Q | Q01~Q04及唯一view / page非适用映射 | done | done | done | pass | E0 |
| E0 | Inbound共享envelope / receipt / actor边界 | done | done | done | pass | E1 |
| E1 | E01/E03 private平台来源及Continuity | done | done | done | pass | E2 |
| E2 | E02/E04正式safe来源 | done | done | done | pass | O |
| O | 条件O01、canonical材料 / 同源交接 | done | done | done | pass | J |
| J | J01~J05输入输出及原subject/op连续性 | done | done | done | pass | X |
| X | 跨协议命名/传递/对象/port/flow/范围审计 | done | done | done | pass_design_static_only | stop_at_step08_waiting_user |

每族先问题回答 -> 当前材料诊断 -> 采用/未采用取舍 -> 批次表/独立协议schema及构造闭环 -> 复杂度 -> 草稿 -> 组内自检。已完成族自检后才开放下一族；跨协议索引最后生成，不以总表替代20个独立协议小节。

### 1.2 当步输出文件计划

| 文件 | 责任 / 何时创建 |
|---|---|
| 本文件 | 固定十段、SOP逐问回答、批次/三层门禁、跨协议审计与未来§7装配入口 |
| `03_ddd_step_08_shared_protocol.md` | G0到达后创建；safe codec、Command/Query envelope、版本/错误及跨族metadata规则 |
| `03_ddd_step_08_command_protocols.md` | C1到达后创建；六C独立协议、两个proposal和字段/factory/CAS闭环 |
| `03_ddd_step_08_query_protocols.md` | Q到达后创建；四Q独立schema、既有view字段/marker、visibility及no-write |
| `03_ddd_step_08_inbound_protocols.md` | E0到达后创建；四E、共享safe envelope/receipt、private差异及正式source binding缺口 |
| `03_ddd_step_08_outbound_protocol.md` | O到达后创建；唯一条件O01、安全payload与canonical/admission证明上限 |
| `03_ddd_step_08_job_protocols.md` | J到达后创建；五bounded J、输入/结果/错误/幂等和既有Jobs plan完整映射 |
| `03_ddd_step_08_scope_baseline.json` | G0续接checkpoint的只读范围哈希；仅设计静态快照，不是运行artifact/evidence；不替代flow/项目台账 |

以上是当前Step内附录计划，不是已存在文件或未来Step预写。完整wire schema只在其所属族建立；无实现路径创建。

## 2. 本步输入与真相上限

正式02§7的6C/4Q/4E/1O/5J共20协议主语、19调用入口不扩展。Step6已闭口稳定结果/view/ref/state/private载体；十个完整body准确交本Step：BindingActionProposal、AuthorizedMappingProposal、四Envelope、四Query。Step7的23业务port/172方法、19仓内input及5 selector是当前映射目标，不复制为Contracts trait，也不让Contracts依赖Application/Domain/Infra/API/Jobs/Worker。

BR-UP-001~009=open、010=reference_only；Workspace原WS-UP/WS-LOCAL与Observability十二affected原状态不变。SDK/OAuth/API Key/KMS/router/executor/HTTP/DB/Bus/cache及实际四平台安装均not_selected/not_established。协议和本地mapper不证明foreign API兼容、source producer已准入或实际投递；缺口只阻相应正向执行，不阻安全结构设计。

旧README和旧正式03只在独立结论完成后做historical_material冲突扫描；L5-chat未停审内容不作输入。本Step不消费历史固定产品或任意raw payload / dead-letter方案。

## 3. SOP问题回答

### 3.1 G0 SOP逐项回答

| # | 问题 / 当前裁定 |
|---:|---|
| 1 | 只正式02的20主语：6C/4Q/4E/1O/5J；调用仍19，不增加发送/审批/通用replay入口。 |
| 2 | 先shared，再C1/C2、Q、E0/E1/E2、O、J，最后X；按族建批次表，每族自检停审后续接。 |
| 3 | C/Q由已认证正式入口调用API dispatcher；E01/E03由已注册平台host；E02/E04由qualified safe transport；O由实际local mutation条件生成；J由既有Jobs provider/worker调用。 |
| 4 | HTTP只给planned fixed route，不选server/router框架；event给logical name/source binding，不选Bus/topic产品；J是typed library及既有bin，不新开HTTP admin入口。 |
| 5 | 新body在各族独立闭口；稳定结果直接复用Step6，不复制mirror enum。shared只先定义version、wrapper和safe validation failure。 |
| 6 | C/E/J回指19既有Domain模型及Step7完整input；Q只投影唯一BridgeLocalView，不建第二read model。O不是新mutation。 |
| 7 | 调用方字段经typed mapper；current资格/完整row通过既有port；ID/now/key来自LocalUnitOfWorkPort；同族须逐factory核齐，缺来源拒绝/阻对应分支。 |
| 8 | event id/envelope ref/source ref/key、原op/effect/attempt/result、local/config/generation/cursor/lane revision各有独立角色；trace/time/平台offset不替代任何一轴。 |
| 9 | 缺必填或未知字段decode reject；缺owner/codec/source合同blocked；known未找到不证明NoEffect；无raw dead-letter/inbox，unknown保原op/manual。 |
| 10 | 每族独立建立DTO -> Step7 exact input -> Step6 factory/transition/完整read -> 同名Step9 flow的映射；本Step不执行Step9。 |
| 11 | 四Q沿Step6 views.rs六字段及shared二级词汇，不新增page/marker壳；字段级codec和来源在Q组展开。 |
| 12 | 只既有View/NotVisible/NotFound/Unavailable；stale/unknown/degraded来自既有字段，缺disabled/rebuilding事实不伪造标签；no-write不以missing触发维护。 |
| 13 | view identity是既有typed subject，repository key来自原namespace/ID/qualified scope；不生成新view ID或解析ref字符串推scope。 |
| 14 | views/result仅依赖Contracts shared；Domain模型读完经Application过滤，内部helper不得进入public DTO。 |
| 15 | Step7 page只供bounded repository读取；四Q不是list/page返回，不输出store cursor；QueryMetadata.page不得双承载或暗示新增分页能力。 |
| 16 | HLD四Query名称保canonical原名并以具名Get*Request承载；映射表在Q组，不让实现者猜同义名称。 |
| 17 | C/E/Q/J稳定result及所有引用已在Step6闭口，本步只声明exact复用位置；新helper逐一给schema/owner/constructor，禁止名称级defer。 |
| 18 | E族定义公共safe envelope与具体payload，消费结果直接复用四已有result；duplicate/delayed/quarantine/no-op沿ConsumeDisposition，不造quarantine文件或fake result ref。 |
| 19 | C/Q authority取trusted ActorContext；E区分registered technical source actor与外部mapped actor；J取TrustedJobContext；body actor只是mapping提案候选，不授权。 |
| 20 | Conversation AppendFact的Integration例外只该正式来源分支；不放宽visibility/digest/active/source isolation/Policy/Gate；external_id不成为GlobalMember。 |
| 21 | decode issue是finite无raw ProtocolError；业务资格/冲突/unknown保持Step6结果或Step7有限错误，由各族给mapping，不把HTTP status当truth。 |
| 22 | C core required key；E qualified source recipe；J原subject/scope key；C04/E02另共享stable effect；Q零dedup/audit；O只canonical准入后same event identity。 |
| 23 | X最后审名称/传递闭包、十deferred body、20主语/19调用、actor/metadata、page/read、ACK/results、方向、source与范围；不能以文档检查宣称外部运行或readiness。 |

上述是共享范围/约束回答，不替代未来各族schema与局部诊断/取舍。

### 3.2 C1问题回答

C01~03只接fixed内部认证入口；metadata/key沿G0，actor/context不在body。C01完整安全draft来自正式配置来源，C02完整proposal来自显式relation提案，C03五个typed分支分别带两端/known result/失效依据；body中的basis只是候选，须由既有qualification port重验。初建ID/local初态由原UoW/Domain factory生成，actual current/now由ports提供。缺字段decode拒绝，缺资格不执行；不以输入ref生成actor/channel/owner对象，不刷新、send或probe。输出复用BridgeCommandResult；去重保原result并current过滤；审计只actual local mutation的safe材料。后续映射严格回指三份Step7 input与同名Step9 flow（未来未授权）。

### 3.3 C2问题回答

C04三字段source/immutable target/kind只准备；C05四字段binding/known source/target action/responsibility只初绑；C06三字段subject/original/authorization只申请。actual actor与metadata仍唯一来自host/wrapper，factory其余必填通过完整current rows、正式ports、UoW技术来源及显式Missing初态取得。C04与E02以stable effect共用查重，不按入口key造第二effect；C05 current资格不以尚未发生的callback验签为前提；C06先qualify_request，request资格不代表probe source就绪。结果/错误沿C1，实际safe audit与same-op保留；三body不能包含正文、approval内容或probe/send开关。

### 3.4 Q问题回答

四Q是single-subject：四deferred *Query有独立schema，Get*Request是原schema别名，唯一metadata.page/key均None，consistency只本地只读偏好。actor/context来自host；resolver-first按具名subject族qualify，完整committed snapshot及原版本读后由LocalViewProjector过滤，返回前revalidate。response只BridgeReadResult；View六字段及stage/ref/freshness/availability全部沿Step6 shared，subject不新mint ID，hidden存在性/ref/count不输出。not found只受权exact不存在；stale/indeterminate/degraded为原事实，missing不作empty；无rebuilding/disabled事实便不造标签。四Q零mutation、audit、dedup、refresh/probe/repair，repository page只内部预算读取，超预算Unavailable不输出partial假完整。

### 3.5 E0问题回答

四E共享typed envelope只封version、原SafeEventMetadata、具名envelope ref、source recipe event key及payload；actor只实际host TrustedConsumerContext，不在wire自报。event_id/envelope ref/event key/原op/result分轴，metadata source/schema不是提交证明；关键缺失接管前拒绝，无raw quarantine/dead-letter。receipt只包装四原result，ACK/owner/local/consumer分列；Duplicate原result，Quarantined有限无raw，Delayed/NoOp没有新增事实标签，等待是原stage/Blocked，不作为成功。E01/E03 normalized材料不替private verify入口；E02/E04正式transport/source/schema须单独准入，不造Bus/source账号。

### 3.6 E1问题回答

E01 private Message/host Continuity与E03 callback仍走原两consumer；四平台raw由owning lease保活，验源后才形成safe payload。event/body字段逐source recipe和capability映射，不能直接接client-normalized已验证结构；source loss只原Protocol stream，不创建消息、ACK、owner交接或推进coverage。Message current两端/actor/material/target模式/digest经原port齐备、durable原op接管后才owner handoff；callback完整验证/原action/source/责任/owner条件、一use CAS与callback/dedup同tx实际commit之后才owner执行。ACK独立执行，有错误/断线保original；schema/body/签名失败零safe record。PS-01~14沿原资料登记，本轮不新增网络核验，PS-07仍unavailable。

### 3.7 E2问题回答

E02只正式owner committed source经safe transport转换，payload完整source/target/kind；actual consumer/context/source recipe来自host、owner资格单独重验，prepare同C04 stable effect而零send。E04只正式consumer disposition，payload原handoff/op/result，原SafeTraceRepository完整行+SafeObservationPort current source/schema/original重验后local finalize，不新造producer/canonical/evidence。transport ACK一次执行且独立于local/业务结果；metadata/key/body不双承载，missing/unsupported/forbidden先有限拒绝，unknown保original。

### 3.8 O问题回答

O01不是第20请求入口，是actual local mutation的唯一SafeAuditRecord及已核canonical/admission成立时的传播结构。完整typed event九字段保原source/material/schema/admission/handoff/op/retention及原metadata/version；publisher只原mutation/J04，foreign消费者与event schema exact binding当前缺口仍blocked。actor为实际producer技术source，业务材料subject/依据各自safe获准，不包含body/token/审批或正文hash。未committed不发布；没有mandatory/optional/audit-only正式规则不默认可选。event identity按唯一producer原材料保留，重试只same-op，ACK不等consumer accepted，不能新建outbox/run/evidence。

### 3.9 J问题回答

五J只原Jobs invocation library/五bin与Worker选择，不开HTTP、任意queue或force/bulk/replay入口。Contracts五独立Request与唯一JobContinuityMetadata wrapper、有限五原result联合/response；trusted context/runtime availability/budget仍来自实际operations host/原plan，不进client schema。selection保原subject/qualified key/continuity/read basis，invoke按typed subject和TrustedJobContext重推同key、读取原result/current；J02保recovery+subject，J05保expected。J01最多一次actual method、实际claim commit后IO，所有rate scopes及业务retry预算/NoIo-NoEffect独立；J02/J03原op/gap权威只读probe，known/full coverage才finalize；J04same canonical/op；J05维护既有资格，不授新权。safe summary/原phase/unresolved各自闭口，无Job run/report/evidence新truth。

### 3.10 X问题回答

逐20协议反查正式02与Step7的19input/19callable；十deferred名称必须唯一定义，所有新DTO字段/tuple/variant和factory传递类型要能到原Contracts或六core reexport，不能仅统计名称。逐族查actor与metadata单authority、Query六字段与page非适用、envelope/payload不双承载、ACK/local/owner/platform/consumer分轴及Job phase/unresolved；原factory必填由明确body/current/store/UoW补齐，缺资格fail-closed。逐C04/E02/J01 stable effect、E03一use、same-op恢复、cursor/coverage、all-rate下界和exact secret短借核安全边界。最终只读范围/未来文件/cached检查，旧README/03只在独立结论后后置扫描；不读Step9或写其产物。

## 4. 当前材料问题诊断

### G0诊断

Step6§7.12明确十body未定义，Step7仓内input不能直接serde成wire：它们含trusted context或本call private借用，并非调用方可自报的authority。Step7 entry§2要求planned route/static dispatcher，但尚未有version/unknown-field/core metadata guard及outer error映射。core RequestMetadata仍有自由string值，ActorRef有display_name，CommandMetadata有reason/external_ref；通用derive不能证明body-free。

Governance Step8的outbox/run/report与envelope actor是其自身合同，不是Bridges必须拥有的truth。特别是SDK job_run_id前提尚未和本地bounded library plan兼容，本地Job不得为借SDK的包装而伪造run；新增SDK facade只能后续兼容核验后消费现有语义。Observability无Bridges producer static row，不能用自定义topic注册成功。

### C1诊断

Step7的BridgeMappingChange归Application，不能直接在Contracts DTO引用；两deferred proposal尚缺完整字段/optional guard。Configuration draft的revision不是local revision；BindingMeaning.generation是expected条件，不是caller指定新generation；LinkMessage七字段含actual known-result，不可丢失后用平台ACK补造。Suspend/Retire的draft仍完整传入，但只有受权basis与actual原配置匹配才可执行，不暗中成为ApplyRevision。

### C2诊断

HLD的generic CommandResult不是当前稳定结果，body层不能重复source/basis/key。prepare所需projection/Gate/attachment/current mapping不在三个提案字段中，必须沿原port取得；C05不能把责任ref或按钮presence当owner执行授权；C06若丢original会误把恢复请求变为新effect。现有factory足以闭口，无需新增sender、approval或repair DTO。

### Q诊断

HLD Q02文字含recovery而Step7 exact allowlist把Recovery归Q03；采用更精确typed族，不允许一个subject借错入口取同事实。BridgeLocalView的qualified_refs并无独立total_count字段，长度只代表可见集合；任何全库数量或store page cursor输出都将新增surface。read model是原既有local事实的临时projection，不是新增持久化view/entity或跨域强一致性。

### E0诊断

SafeEventMetadata已闭口四字段但未承载envelope ref/key；四结果已完整，缺的是安全运输包装及finite解析/未验证时返回规则。不得把可信consumer actor藏在generic metadata供客户端覆盖，也不能复用ProtocolAckDisposition表达owner提交/consumer accepted。E01 source-loss材料在Application，Contracts必须另定义typed纯数据再显式映射，不能反向引用。

### E1诊断

四平台不存在统一raw schema、signature、channel/thread/global cursor或callback授权；Mattermost incoming webhook不能证明inbound event，Telegram update_id不是owner watermark，Discord Gateway sequence只session transport，Slack ts不是通用顺序。Contracts normalized载体只验证后的安全影射，不能变成第三“已验证”API。Callback来源验真还缺owner semantic/action资格时，不准创建Verified record或claim。

### E2诊断

上游正式event/envelope与本地normalized字段并非同名兼容；Conversation/Governance/Artifact/选用Workspace需exact source映射，不能把收到event当committed。Observability正式03§7.4 static map已实际复核：没有Bridges来源，不能选择SourceOwner/Bus/Governance冒名激活O01/E04闭环。safe transport本地typed DTO不证明producer、schema或consumer binding已准入。

### O诊断

HLD O01是条件canonical传播，不是每mutation outbox或generic log publisher。实际安全材料与SafeAuditRecord同UoW，source/schema/admission只能正式签发；本地opaque ref或Contracts event factory不产生consumer可接受的canonical协议。当前Observability static map不含Bridges，positive不存在，不能借设计完成关闭BR-UP-006。

### J诊断

Step6简化JobInvocationSubject已由Step7最终精确形态替换，J02只有subject、J05没有expected的DTO会断裂；Contracts不能直接复用Jobs plan（反向依赖）。五结果不等report/run、CompletedLocal不等所有外部送达，SDK Job wrapper要求run_id尚未绑定，不为适配伪造run或创建facade。runtime budget不是业务retry许可，current refreshed不是new grant。

### X诊断

J组初稿暴露了名称级复用风险：Command的OriginalReused不能成为Job enum标签，BridgeViewSubjectRef的Gap/Recovery不能成为J05维护主语。两处已在J停审前对照原schema纠正，前序不改。三层恢复表虽已到J，顶部/文档级文字仍滞留C1，必须同步唯一恢复点；完整public传递图、factory和协议总表仍需X实际审计，不能把606定义计数或局部pass等同全闭环、编译、上游兼容或平台可用。

## 5. 改动前后与历史差异

各族独立结构化结论与public图/原input检查完成后，X才读取旧README全文及旧03§6/§7.4~7.11/§8/§9.1~9.3定点冲突位置；其余旧03只查标题定位，不冒称全文重读。它们始终historical_material，不提供本Step协议、SDK或权限结论，原文件不修改。

| 历史位置 / 差异 | 当前独立结论 / 不继承理由 |
|---|---|
| README仓定位、关键依赖、目录：Python/TypeScript和固定四SDK | 沿已认可Step3/4 Rust计划与qualified adapter seam；不因旧名称选择SDK、runtime、router或真实安装。目录L6不改变全局Layer 5设计窗口。 |
| README核心映射、external_id持久化 | 三类经显式授权的typed mapping，真实Identity/Conversation/Workspace仍owner；不将Channel=Conversation、Message=Turn、external_id=GlobalMember变成自动创建或同一truth。 |
| README Gate简化卡和“打开Chat审批” | explicit disclosure/current Policy/Gate；敏感内容及动作未获准则fail-closed/无动作降级；不从未停审L5-chat取得路由或绑定资格。 |
| README BR5“所有操作发observability” | 只actual local safe audit及正式mandatory/optional/audit-only规则，条件O01；无Bridges producer准入不发布、不冒名Bus/Governance/SourceOwner。 |
| README安全：KMS、OAuth优先/API Key fallback | OpaqueSecretBindingRef + exact provider/key/version/purpose/current lease；产品/scopes/轮换/OAuth权限独立重核，无默认fallback、secret值或KMS已选声明。 |
| 旧03§6/§9：PayloadEnvelope、DeadLetterLikeBridgeRecord及多套truth/view/evidence | 只19原local Domain模型、唯一临时安全view及body-free audit/handoff；无raw payload/inbox/DLQ、第二读模型或运行evidence。历史引用不成为验收材料。 |
| 旧03§7.4 CreateBridgeRequest/TriggerReplay与§8.4通用入口 | 正式02限定6C/4Q/4E/1O/5J，19callable；C06只申请，J02/J03只原op/gap权威只读恢复，禁止通用replay/resync/repair和新发送入口。 |
| 旧03§7.6“投送/转换不需要权限/审批” | current source、mapping、actor、disclosure、owner语义和Policy/Gate均不可绕过；ACK/签名/bot token不授执行权。 |
| 旧03§7.7/§8.2 Delivered->Acked统一链 | 原local commit/Protocol ACK/owner/platform business/consumer各自有限阶段；平台ACK不是Turn提交，内部提交不等送达/已读。 |
| 旧03§7.9五个MQ事件与§7.10 timeout即retry/replay | 唯一条件O01、四normalized inbound及source binding；timeout/NotFound/cancel保original，只有正式NoIo/NoEffect/全部current预算/窗口允许same-effect继续。没有默认topic/outbox或投递成功。 |

扫描只登记上述冲突，不扩展当前Step，不恢复旧协议或改正式03。

## 6. 设计取舍与写入许可

### G0取舍

| 方案 | 结论 / 理由 |
|---|---|
| typed protocol wrapper + actual core metadata + explicit outer trusted context | 采用；只有原metadata承载request/key/trace，body不自报authority，Contracts只提供结构。 |
| Application input自动serde / arbitrary JSON /统一Any dispatch | 不采用；会导出private/context、产生反向依赖及未定义字段。 |
| finite V1 + strict field/tag decode +每个typed carrier原factory | 采用；planned version不是external API pin，未知version先拒绝，不fallback/trim/default。 |
| 跨族新建GlobalSuccess、PublicPage、job run/report或默认outbox | 不采用；扩大既有20主语与本地truth，掩盖平台ACK/owner/local/consumer阶段差异。 |
| 原稳定safe结果 + finite无raw协议失败；post-effect保original | 采用；不把Indeterminate映射成可盲重试错误或丢原op，current visibility依旧先于披露。 |

B0已实际检查三文件10表/6围栏，errors=[]；Git diff-check通过。G0共享结构写入及组内停审pass；只开放C1，不写C2~J或正式03。

### C1取舍

采用Contracts独立typed proposal/change与API穷尽零IO mapper；不把Application input自动serde，也不复制其资格/状态truth。C02以完整proposal包装全部非context字段；C03 Contracts change只描述提案，逐variant映射原Application change。初建用Absent、后续用Present；未知结果不建立message mapping；同key比较完整safe含义及CAS条件，不以JSON序列化hash、trace或资格续期时刻代替。

### C2取舍

采用三个具名最小完整Request逐字段对应Step7 input；资格/current读取不塞进client body。C04准备与J01实际发送分离，C05初绑与E03一次claim分离，C06请求与J02/J03实际只读恢复分离。未采用返回send成功、approval success或Resolved的快捷字段。

### Q取舍

采用四具名Query + 四透明Request别名，避免相同subject再包第二query字段。复用唯一view并在当步字段级表显式映射二级schema/marker，不新建四view、分页DTO、rebuild/disabled marker或cache。Strong未满足实际本地一致读则Unavailable，不能降为Eventual并假称Strong。

### E0取舍

采用一个generic envelope、具名opaque envelope-ref及有限四result联合receipt；只固定四实例可用，不提供Any/Other/raw。未通过来源验证时不回显候选identity，receipt的ref/event_id两者None；验证完成且current准许才一起Some。拒绝独立receipt ID、success bool、自由dead-letter payload、统一Delayed/NoOp新truth；source-mode/actor/result资格由原port核验。

### E1取舍

采用Message/Continuity有限payload、完整原QualifiedIngress/CallbackContext及四平台独立source mapping表；Continuity Contracts纯数据逐字段显式映射原Application notice。typed schema不新增消费入口或选择SDK；外部HTTP只qualified fixed source route，resident mode只原host。缺验源/原mapping/parent/current/Gate/材料/coverage则有限拒绝或blocked，不降为create/root、NoEffect或无敏感默认审批。

### E2取舍

采用两个三字段typed payload/两个deferred envelope别名与原SafeTransportEventLease一次dispatch/ACK，不复制上游事件schema或新topic。E02 event receipt和delivery effect分别幂等；E04 source result只原handoff effect finalize。缺producer/schema/admission保持相应positive blocked，不默认可选或建立fake兼容。

### O取舍

采用九字段ref-only typed event及原SafeAuditRecord/SafeHandoffRecord/BodyFreeMutationMaterial闭环，不复制consumer schema或新public sender。O01释放依据是正式canonical/admission/current与实际commit，不是配置enable开关或自定义topic；无positive兼容只允许安全blocked/audit-only正式规则分支。

### J取舍

采用五typed body与一个metadata wrapper，固定五result联合只包原stable result，Jobs phase/plan/unresolved保持entry-local。单个bounded动作以原qualified host/selector输入，不接受client key/context/authority/runtime预算、job_run_id或secret。产品method retry关闭或正式同op可证明，未知仅原op恢复；未采用通用CLI JSON dispatch、无界loop/重发或伪job report。

### X取舍

采用分层闭包审计：先确切名称/字段/签名，再逐构造与资格来源，最后方向/副作用/历史/范围；静态parser只证明其覆盖面，人工语义反查另列。发现当前Step错误只修本Step，不回写已停审前序或owner；positive缺口保BR-UP，不以有限结构合格关闭兼容或准入。正式§7/§6只作装配索引草稿，Step9处理顺序、Step10矩阵、Step11事务、Step14产品与正式03仍未执行。

## 7. 结构化中间产物与复杂度

### 7.1 G0共享协议

[共享协议](03_ddd_step_08_shared_protocol.md)已闭口八声明及factory/消费面。实际静态检查：四文件18表/12围栏行/3 Rust block/1相对链接，errors=[]；完整声明口径含traits和六core reexport为567唯一定义、重复0；G0八声明/36 Rustdoc行、引用缺失0。人工方向与metadata单authority、no public page/run、post-effect original责任检查pass；未编译或项目测试。G0停审后才开放C1。

### 7.2 C1/C2 Command

[Command附录](03_ddd_step_08_command_protocols.md)C1三协议/两个deferred proposal与typed change已完成，完整构造、optional/五variant/current/CAS/结果闭口。实际五文档29表/18围栏行、573唯一定义、当步14声明/49字段，类型缺失/重复/Rustdoc字段缺失/结构错误0；diff-check通过，人工方向与三factory/五branch反查pass。C1停审，C2当前只开放后三C。

C2后三Request及完整plan/intent/action/recovery factory来源闭口；零send/claim审批/probe，原effect/original保持。实际五文档36表/24围栏行、576唯一定义/当步17声明，重复/结构错误0，diff-check通过；人工三factory/current/跨C04-E02/结果审查pass，C2停审只开放Q。

### 7.3 Q Query

[Query附录](03_ddd_step_08_query_protocols.md)四独立协议、四deferred Query与四Request透明别名、唯一六字段view/二级stage-ref-marker、same-subject read/current/page非适用闭口。实际六文档48表/32围栏行、584唯一定义，重复/字段类型缺失/结构/Rustdoc字段错误0；diff-check通过；人工no-write/hidden/missing/Strong来源反查pass，Q停审只开放E0。

### 7.4 E0/E1/E2 Inbound

[Inbound附录](03_ddd_step_08_inbound_protocols.md)E0四共享声明/五字段envelope/四原result联合receipt/有限disposition、actor双链及无raw边界闭口。实际七文档52表/34围栏行，结构错误0、diff-check通过，人工identity/metadata/source/方向/原result检查pass；E0停审，只开放E1。

E1两个consumer、五声明/两个deferred envelope、Message/Continuity完整字段与callback claim/原private入口、四平台路线/差异/ACK闭口。初查发现callback表两行列位错误，已修正并实际重跑：七文档60表/38围栏行、593唯一定义，缺类型/重复/结构错误0、diff-check通过；人工factory/private/19入口/owner truth边界pass，E1停审只开放E2。

E2两个三字段payload/两个deferred envelope及source/current/full original/transport ACK/跨C04 effect闭口；实际七文档65表/42围栏行、结构错误0、diff-check通过；人工原input/factory/结果/准入反查pass。E2停审后只开放O，四E完成。

### 7.5 O Outbound

[Outbound附录](03_ddd_step_08_outbound_protocol.md)唯一O01九字段schema/factory/原audit-canonical-handoff及mandatory/幂等/同源提交/current/ACK闭口。实际八文档71表/44围栏行、结构错误0、diff-check通过；人工producer/static map/无新outbox或caller检查pass，O停审只开放J。

### 7.6 J Operations Job

[Job附录](03_ddd_step_08_job_protocols.md)五独立Request、原metadata/五result联合、完整原plan/input/phase/unresolved与same-op/current/rate/secret闭口。实际九文档90表/56围栏行/12本地链接、606唯一定义/当步47，重复/当步字段类型缺失/结构错误0；五exact input/execute、六Job标签/十snapshot及测试路径对照errors=[]，diff-check通过。J初稿两处词汇/allowlist漂移已归原合同；首个限定backtick声明扫描不当作完整统计，补tilde后重跑。J设计停审pass，只开放X。

### 7.7 X跨协议审计

逐族原结果/新结构和Step7 exact输入反查已完成。静态图覆盖Step6五附录、Step7六文件及当步七文件：606唯一定义=前序559+当步47；新声明32struct/7enum/8alias、106具名字段/31enum variant/184 Rustdoc行；十deferred body均已唯一定义。新字段/variant/alias传递图可达243个设计类型，六core叶节点的实际二级schema另由shared§4.1闭口，不把core复制成Bridges声明。

| 审计项 | 独立结论 / 必要纠正 | 当前结论 |
|---|---|---|
| 范围/独立协议/未来flow | 20协议、19exact callable及19input一一回指正式02/Step7；O01只mutation/J04传播，非第20请求；§7.8索引不替独立小节 | pass_design_static_only |
| public传递类型/声明归属 | 47当步声明及243可达类型无缺/重复/反向依赖；原稳定ref/state/result/slot沿Step6，不出Application helper或Domain模型；所有body/factory消费面可定位 | pass_design_static_only |
| 十deferred/HLD命名 | 两proposal、四Query、四E envelope各唯一schema；四Get*Request透明alias，未新增两个同名query/query body | pass_design_static_only |
| 六C字段/五mapping variant | 六body/proposal对应五到六等exact非context字段；AuthorizedMappingChange五variant与原Application逐字段同形；LinkMessage为七字段、AuthorizedRelation显式InvalidInput | pass_design_static_only |
| actual core/codec | 回读原actor/metadata；ActorKind与QueryConsistency保持scalar，其他本地enum tagged；实际自由String/Debug/serde不变日志或准入许可；Option必现，未知/重复/tag拒绝 | pass_design_static_only |
| metadata/actor单authority | C key仅core request；Q key/page None；reason/external_ref None；trusted context只actual host。E source technical actor与external mapped actor分链；Integration例外只正式AppendFact且Gate/digest/source隔离不放宽 | pass_design_static_only |
| 四Q/view/page | 六字段view、二级stage/ref/freshness/availability及四结果沿原schema；四typed allowlist与Step7一致；resolver-first、hidden不输出、Strong不满足Unavailable，全链零write/audit/refresh/probe | pass_design_static_only |
| E envelope/payload/receipt | 五外层字段、四原result及成对可见关联；payload不双承载key/metadata，未verified关联None。receipt factory只校shape，四fixed host mapper另核route/source/outcome | pass_design_static_only |
| private inbound/callback/Continuity | E01/E03仍原lease/verify/current入口，无client-normalized“已验证”捷径；E03 durable一use胜出后owner IO；Continuity only Protocol/零owner/ACK，Missing next不造epoch change | pass_design_static_only |
| O source/mandatory/准入 | 九字段ref-only event，只actual audit/canonical/admission/current和同源commit后交；Observability static map无Bridges，BR-UP-006不关闭；无第二producer/outbox/caller | pass_design_static_only |
| J五输入/结果/phase | 五exact签名/input、六原Job标签；J02 record+四subject、Gap归J03；J05expected+十snapshot/八view-kind；wrapper不携runtime/authority；mapper与factory分责，entry phase/unresolved不作report | pass_design_static_only |
| 原对象构造/技术来源 | 19Domain完整factory/rehydrate由各族body、具名current/read及UoW来源承接；首行Absent/local1、existing Present和hydration；§7.9补四共享构造，不从ref字符串/ACK推owner truth | pass_design_static_only |
| effect/op/去重/回放 | C04/E02同stable effect、J01原intent/effect、E03原one-use、J02/J04原op；trace/event/request/now不替identity，expired/unknown不新effect，NoIo/NoEffect与NoResult分离 | pass_design_static_only |
| cursor/gap/rate/retry | 原source/comparator/stream/epoch及两revision轴；GapState无Partial，使用原close/retain_uncovered/require_manual；close用AuthoritativeCoverageRef，advance另要完整ContinuityCoverageRef；所有rate scope下界取max，SDK无隐藏retry | pass_design_static_only |
| 平台mapping/附件/secret | 四平台独立locator/parent/edit/delete/callback/ACK/source-mode差异；create/edit/reply only known回链，delete需原owner disposition。附件仅Artifact grant/ref/private lease；secret exact provider/version/purpose/current，缺兼容阻affected branch | pass_design_static_only |
| 日志/审计/证据上限 | 有限reason/stage与获准pointer；无body/token/secret/choice/敏感审批/private URL/raw error或可还原派生；local audit/receipt/consumer Accepted不变artifact/report/evidence/verdict/signoff/readiness | pass_design_static_only |
| 路径/产品/历史范围 | 九个显式planned源码/测试路径沿Step4；另一个metadata.rs是actual外部core来源，不当新增Bridges路径。旧README/03仅后置定点冲突，产品/pin/实际安装和upstream blocker不因结构pass关闭 | pass_design_static_only |

跨审纠正均仅当前Step8：J初稿标签/allowlist、七字段计数及proposal内CAS说明、actual core scalar例外、receipt/Job结果固定入口核对责任、KnownMappingResultRef三分支及J02 Gap拒绝、J03原方法/状态/恢复依据/两coverage类型、E01 Continuity具体构造与Missing next保守分支。没有改变前序port/业务主语或上游truth。最终范围/格式检查实际通过，§10登记后冻结Step8；这些结论不代表编译或foreign兼容通过。

### 7.8 协议总表与精确承接

所有C/Q响应分别固定BridgeCommandResponse/BridgeQueryResponse；四E只内部qualified receipt、平台外层只有actual ACK；五J稳定result可规范化BridgeJobResponse，但原Jobs返回JobInvocationState，phase/unresolved仍entry-local。wrapper、版本/错误、factory、固定路由及字段级schema以所属附录为唯一草稿，不在此复制第二份。

| ID / canonical协议 | 族 / 模块 | 调用方或发布方 -> 处理方或订阅方 | 唯一safe body / event | 原稳定结果 | future Step9 flow |
|---|---|---|---|---|---|
| C01 ConfigureBridgeInstallation | Command / U1 | actual配置授权内部principal -> ManagementDispatcher / ConfigureBridgeInstallation | ConfigureBridgeInstallationRequest | BridgeCommandResult | ConfigureBridgeInstallation |
| C02 ManageExternalBinding | Command / U1 | actual显式relation授权principal -> ManagementDispatcher / ManageExternalBinding | ManageExternalBindingRequest(BindingActionProposal) | BridgeCommandResult | ManageExternalBinding |
| C03 MaintainExternalMapping | Command / U1 | actual两端mapping管理principal -> ManagementDispatcher / MaintainExternalMapping | MaintainExternalMappingRequest(AuthorizedMappingProposal) | BridgeCommandResult | MaintainExternalMapping |
| C04 PrepareExternalDelivery | Command / U3 | actual原source/target授权principal -> ManagementDispatcher / PrepareExternalDelivery | PrepareExternalDeliveryRequest | BridgeCommandResult | PrepareExternalDelivery |
| C05 BindExternalAction | Command / U4 | actual原action管理principal -> ManagementDispatcher / BindExternalAction | BindExternalActionRequest | BridgeCommandResult | BindExternalAction |
| C06 RequestBridgeRecovery | Command / U5 | actual原subject维护principal -> ManagementDispatcher / RequestBridgeRecovery | RequestBridgeRecoveryRequest | BridgeCommandResult | RequestBridgeRecovery |
| Q01 GetBindingMappingView | Query / U6 | actualsubject读取principal -> QueryDispatcher / GetBindingMappingView | GetBindingMappingViewRequest = BridgeBindingViewQuery | BridgeReadResult | GetBindingMappingView |
| Q02 GetBridgeOperationView | Query / U6 | actual原operation读取principal -> QueryDispatcher / GetBridgeOperationView | GetBridgeOperationViewRequest = BridgeOperationViewQuery | BridgeReadResult | GetBridgeOperationView |
| Q03 GetContinuityView | Query / U6 | actual原连续性读取principal -> QueryDispatcher / GetContinuityView | GetContinuityViewRequest = BridgeContinuityViewQuery | BridgeReadResult | GetContinuityView |
| Q04 GetSafeHandoffView | Query / U6 | actualaudit/handoff读取principal -> QueryDispatcher / GetSafeHandoffView | GetSafeHandoffViewRequest = SafeHandoffViewQuery | BridgeReadResult | GetSafeHandoffView |
| E01 PlatformInputReceivedConsumer | Inbound / U2、U5 | actual平台private source/Protocol notice host -> 原E01 | InboundSafeEnvelope；payload为InboundSafePayload的Message/Continuity，实际private/notice input不变 | InboundConsumeResult | PlatformInputReceivedConsumer |
| E02 CommittedSourceAvailableConsumer | Inbound / U3 | actual正式committed owner source -> safe lease / 原E02 | CommittedSourceRefEnvelope(CommittedSourcePayload) | SourceConsumeResult | CommittedSourceAvailableConsumer |
| E03 PlatformCallbackReceivedConsumer | Inbound / U4 | actual平台private callback host -> 原E03 | CallbackSafeEnvelope(CallbackSafePayload)；实际private input不变 | CallbackConsumeResult | PlatformCallbackReceivedConsumer |
| E04 SafeHandoffDispositionConsumer | Inbound / U6 | actual正式consumer result source -> safe lease / 原E04 | SafeConsumerResultEnvelope(SafeConsumerResultPayload) | HandoffConsumeResult | SafeHandoffDispositionConsumer |
| O01 BridgeLocalDispositionRecordedEvent | Outbound / U6 | actual唯一audit producer -> 正式准入consumer；当前positive blocked | BridgeLocalDispositionRecordedEvent | 无独立public response；原handoff port返ConsumerDispositionRef | 无独立请求；原mutation及J04承接 |
| J01 DispatchQueuedDeliveryJob | Job / U3、U5 | actual operations provider/eligible candidate -> Jobs dispatcher / 原J01 | DispatchQueuedDeliveryJobRequest | DispatchJobResult | DispatchQueuedDeliveryJob |
| J02 ReconcileBridgeOperationJob | Job / U5 | actual原recovery provider/candidate -> Jobs dispatcher / 原J02 | ReconcileBridgeOperationJobRequest | RecoveryJobResult | ReconcileBridgeOperationJob |
| J03 ReconcileStreamGapJob | Job / U5 | actual原gap provider/candidate -> Jobs dispatcher / 原J03 | ReconcileStreamGapJobRequest | GapRecoveryJobResult | ReconcileStreamGapJob |
| J04 RetrySafeHandoffJob | Job / U6 | actual原handoff provider/candidate -> Jobs dispatcher / 原J04 | RetrySafeHandoffJobRequest | SafeHandoffJobResult | RetrySafeHandoffJob |
| J05 RefreshBridgeQualificationJob | Job / U1、U3、U4、U5、U6 | actual资格维护provider/candidate -> Jobs dispatcher / 原J05 | RefreshBridgeQualificationJobRequest | QualificationJobResult | RefreshBridgeQualificationJob |

运输索引：六C/四Q为附录中十个planned fixed JSON POST，四平台private source为六个planned fixed route或registered resident host，E02/E04为qualified safe transport lease，O01为原SafeObservationPort，五J为原invocation library/五bin/Worker。同一family只有已核exact source-mode，路由列表不证明listener/source/client已建立。十九future flow名称只预留承接，不创建Step9文件或提前执行SOP9。

### 7.9 共享构造与复杂度收敛

十五主要factory逐入参来源已在C/E/O/J附录及Step6原卡核对，另外四个共享Domain模型如下；所有existing读取只完整原row+local revision+hydration，不能在mapper凭state/ref重造。完整函数签名仍唯一Step6/7，不复制新API。

| 原模型 / 完整factory | 七到九入参的唯一来源 / mandatory guard |
|---|---|
| DedupRecord::reserve七参 | dedup_ref=UoW技术ID；namespace_scope=该族installation/source/stage/qualified scope；idempotency_key=原C/E/J recipe当前资格；semantic_identity=完整typed stable meaning；operation_effect=actual原reservation/原row，确无记录才原允许的未执行local关联；result_ref=Missing；retention_window=正式同namespace窗口。唯一性/同义比较由原UoW实际接管，Q不创建。 |
| StreamCursor::initialize八参 | E01附录完整notice/current来源、Uninitialized position/Missing coverage、actual comparator Slot、cursor revision1及actual now；existing源阶段/epoch不从时间/ACK推。只该族正式来源允许创建，首行Absent，双revision轴不互换。 |
| GapRecord::detect八参 | E01附录同cursor/qualified原range/reason、实际local tracking op、coverage Missing、recovery和window显式Slot；Missing proof不建gap，Missing window不能probe。J03只读取原gap及受权recovery，不从job创建缺口或授权。 |
| DispatchLane::for_scope九参 | lane_ref=UoW ID；order_scope=原qualified target/order；head_dependency=actual create/thread已知关联或正式NotRequired；claim_fence=Missing；unresolved_head=None；rate_bounds=原全部适用shared bounds；retry_budget=正式scope/window policy+actual usage；lane revision1；rate_basis=正式current来源。源/依赖/下界不齐不造Ready，lease/clock不归零budget。 |

复杂度仅47个safe声明，仍19Domain/17业务机/23业务port/19调用入口；shared wrapper不建业务服务、owner实体、DTO权限或第二plan/run/view。八alias中四Query Request、四E envelope透明复用唯一schema。三kind primitive enum用exact variant，其余具名factory/validate及消费面齐备；泛型wrapper只固定允许的body实例，没有blanket raw serde、Any dispatch或新业务入口。

## 8. 回填草稿

以下是未来正式03§7/§6的装配索引草稿，不是当前正式文档修改。正式装配必须待Step19明确授权和前十八Step全部闭环，过程记录/门禁/审计统计不装入业务正文。

### 8.1 未来正式§7

7.1共享规范取shared§2~6及inbound§2~3：唯一bridge.v1、actual core scalar例外/metadata、严格codec、finite外层错误、actor/source分链、result/ACK/current限制。7.2~7.7依序取Command附录六独立小节；7.8~7.11依序取Query四独立小节及唯一view/page非适用表；7.12~7.15按E01/E02/E03/E04取Inbound对应小节/四平台表；7.16取唯一O01；7.17~7.21取五J及原plan/result/phase承接。每个协议按规范的用途、签名/路由、请求、响应/event、错误、幂等/审计六子节装配，内容从各族现有结构和来源表取得，不发明额外字段/方法或上游API。

### 8.2 未来正式§6索引

| 唯一planned contracts文件 | 当步新声明 / 原schema消费入口 | 完整草稿来源 |
|---|---|---|
| `crates/contracts/src/shared/metadata.rs` | BridgeProtocolVersion；原core重导出/JobContinuityMetadata/SafeEventMetadata不复制 | shared§2/4~5 |
| `crates/contracts/src/shared/outcomes.rs` | BridgeProtocolIssueKind、BridgeProtocolArea、BridgeProtocolError；原finite result/marker不复制 | shared§2/6 |
| `crates/contracts/src/commands.rs` | BridgeCommandRequest/Response；六Request、两proposal、AuthorizedMappingChange，共11声明 | shared§3；Command六协议/完整factory |
| `crates/contracts/src/queries.rs` | BridgeQueryRequest/Response；四Query/四透明Request别名，共10声明 | shared§3；Query独立schema及六字段view/二级映射 |
| `crates/contracts/src/consumers.rs` | 四shared声明、InboundContinuityPayload/InboundSafePayload、CallbackSafePayload、CommittedSourcePayload、SafeConsumerResultPayload、四envelope alias，共13声明 | Inbound§2~11 |
| `crates/contracts/src/events.rs` | 唯一九字段BridgeLocalDispositionRecordedEvent | Outbound§2~4 |
| `crates/contracts/src/jobs.rs` | 五Request、BridgeJobRequest、BridgeJobOutcome、BridgeJobResponse，共8声明；五原result/SafeJobResultSummary不复制 | Job§1~9及Step6 jobs原卡 |

总数1+3+11+10+13+1+8=47；完整public图只Contracts/core，不把Step7 inputs/23traits、Jobs/Worker runtime carrier或private material导出。API固定mapper、Jobs dispatcher和Infra source codec沿Step4/7既有文件承接，本文只补协议输入/输出规范，无新实现文件。

### 8.3 后续尚未执行的承接

获授权的Step9将逐19接口展开函数级图/伪代码/事务位置与测试切口；Step10逐17业务机和原runtime phase检查触发；Step11~15处理实际事务、错误、并发、配置与材料准入；Step16/05形成测试计划，不能将本Step静态检查变项目测试。Step8已足以提供typed shape/current来源和有限拒绝语义，但产品pin、owner bridge-specific映射、canonical/source准入仍必须按正式释放材料核定，不能让实现者用默认值补缺。

## 9. 待确认事项

| 原blocker / 当前状态 | affected positive / 缺口 | 正式释放依据 / 当前安全出口 |
|---|---|---|
| BR-UP-001 / open | E01 inbound/变化/owner原result、E02/C04 source、J02 owner恢复 | Conversation正式bridge-origin/target mode/required digest/exact版本及read-only原op结果兼容；缺则不append/manifest/外显，原unknown manual/blocked，不自造Turn。 |
| BR-UP-002 / open | identity/actor mapping、E01/E03责任及显式绑定 | Identity/授权owner正式既有actor与两端受权责任映射；不从external_id/bot/pointer建立GlobalMember、participant或grant。 |
| BR-UP-003 / open | Gate材料/交互source/action/current语义与一use | Governance/正式Policy owner exact外显/动作/current/原op/owner条件合同；不展示敏感详情，不通过safe payload或回调签名越权。 |
| BR-UP-004 / open | 附件/Artifact引用、private材料和链接/窗口 | Artifact正式准入/material/ref/grant/source/window与privately取用兼容；未立不下载、公开或持久化正文/URL。 |
| BR-UP-005 / open | 选用Workspace时required read/export/provenance | 原WS-UP-001~008/006-S、WS-LOCAL-001~003依上游释放，原状态不回写；未选不默认依赖，选用欠缺只阻该分支。 |
| BR-UP-006 / open | 原safe audit/mandatory/canonical/O01/J04/E04 | Observability正式新增或核准的exact producer/static map/source/schema/canonical/admission/consumer兼容，且十二affected由其owner按原门禁关闭；无此材料不激活positive、不冒名/伪evidence。 |
| BR-UP-007 / open | SDK/OAuth/API Key/KMS/router/executor/HTTP/DB/Bus/cache/provider | 正式adapter/config/secret seam选择、pin/scopes/rotation/revoke/required runtime与driver证明；source codec/有界配置未建则对应slot NotEstablished，缺SDK job binding不伪run。 |
| BR-UP-008 / open | 四平台source/method/parent/edit/delete/callback/ACK/rate/readonly probe | 按实际安装/source mode/API pin/权限范围及官方合同逐平台核；PS-07仍unavailable，本轮无新增网络/账号/token/实例测试，不宣称4/4可用。 |
| BR-UP-009 / open | key/meaning/cursor/comparator/coverage/NoIo-NoEffect/retention/原op恢复 | exact source recipe/codec、driver unique/CAS与正式same-op只读结果/所有rate下界/window/业务retry预算兼容；unknown保原head/op/gap，缺依据manual/blocked。 |
| BR-UP-010 / reference_only | L5-chat并行产品入口/跳转 | 未停审内容不作Bridges正式输入；任何跳转产品/路由仍独立qualified配置，不假定Chat已实现或ready。 |

这些是集成/运行资格缺口，不是当步schema悬空；当前所有affected安全拒绝/保原unknown路径已明示。原00 Step15§7.3/7.4释放规则继续有效，本Step不得自行关闭上游或要求伪造signoff。

## 10. 自检与三层门禁

B0历史checkpoint结构检查实际通过，当时下一只写G0 shared；不是当前恢复点。全程不进入Step9、正式03、实施台账/boundary、代码或项目测试，不提交。首个结构审计表达式在工具脚本层因围栏转义失败，未执行命令或写入；改用hex fence识别后实际重跑通过。

G0续接恢复：用户“继续”未扩大Step8范围。临时工具store不再可用，首个组合审计在结构脚本load处停止；已完成的声明扫描只代表其限定parser范围，未把未执行的结构检查记pass。已回读磁盘三层门禁；初始233文件快照的临时副本不可恢复，改在G0 checkpoint重新获取同233个保护文件并写本Step scope_baseline.json。最终范围比较以该checkpoint为准，不声称复现初始哈希逐值对照；此前实际写入仅当前Step8/flow/本台账。

2026-10-03 / X实际只读审计：双围栏18个Step6/7/8来源文件606唯一定义、47新增/32struct/7enum/8alias、106具名字段/31enum variant/184 Rustdoc行；当步字段/variant/alias及factory传递图无缺/重复，243可达设计类型无逆向引用。六C exact非context字段、五mapping variant与原input同形；五J exact字段/execute、原六Job标签/十snapshot、四generic wrapper factory消费面通过；四Q allowlist/六字段view/二级schema、四E原input/结果与private/ACK、安全source、O01条件传播和十九原Domain构造人工反查pass。原十五factory及另四共享构造参数/来源逐项核齐，未来十九flow只索引、不预执行。

格式/范围审计：九Markdown文档98表/56围栏行（28块，其中25 Rust块）/13本地相对文件链接，十段主骨架、二十协议总表和所有族独立小节通过，errors=[]；233文件G0 checkpoint保护范围除flow/台账外changed=[]、missing=[]；九个explicit planned路径全在Step4，另一个metadata路径为actual外部core。future Step9~19/implementation文件0，cached为空，git diff --check -- projects/L6-bridges/通过。只当前七Step8 Markdown、scope_baseline.json、03 flow与本台账，共十文件；正式03/README/00~02/前序/上游/standards/其他dirty不改。

过程事实：J首个backtick-only扫描511只限定覆盖，补tilde实际重跑606；X全图首次把std Cell与Future::Output当未定义，明确排除std/关联名后重跑0。四generic factory初查未识别`<T>`、一个路径初查未区分actual core、ExternalBinding初查预期arity误填9，分别对原签名/source修脚本后重跑通过，真实propose八参未改变。X一次组合patch因主文件上下文不匹配失败，无文件落盘，定点核验后准确重做。上述失败/限定结果不作完整pass，不隐瞒；没有实施、compiler/borrow check、项目测试、网络新核验、平台账号/token、实际送达、artifact/report/evidence/verdict/signoff/readiness、代理/并行调用、stage或commit。

最终只冻结当前Step8校准；`step08_design_self_review=pass`仅设计静态自检，`step08_user_confirmation=waiting`不当用户或owner签署。BR-UP-001~009=open、010=reference_only，Workspace原开放项和Observability十二affected不变；SDK/OAuth/API Key/KMS/router/executor/HTTP/DB/Bus/cache及实际安装未选/未建立。下一只等待用户确认Step8并明确授权Step9；获准后读详细SOP Step9全文、书写§5.8、当前Step6~8/正式02§8及受影响owner/台账，先建当步骨架再逐接口，不提前阅读/创建。commit_required=false。

```text
current_document = 03
current_step = 8
current_module = step08_complete_waiting_user
document_status = in_progress
step_status = complete_waiting_user
step07_design_self_review = pass
step07_user_confirmation = explicit_continue_to_step08
step08_design_self_review = pass
step08_user_confirmation = waiting
gate_status = blocked
gate_reason = authorized_stop_at_step08
next_allowed_action = wait_for_user_authorization_of_03_step09
calibration_write_allowed = false
formal_document_write_allowed = false
formal_03_assembly_allowed = false
step07_allowed = false
step08_allowed = false
step09_allowed = false
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
