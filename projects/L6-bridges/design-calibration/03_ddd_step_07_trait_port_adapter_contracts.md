# L6-bridges 03 Step7：逐模块 Trait / Port / Adapter 契约

2026-10-03受权修订说明：原23业务port/19callable数量不变，新增方法、内部支撑卡、三read root及C04/E02/J02/J05显式注入在原application/infra拥有附录同步；新增方法均有adapter-local需求，不声称上游已有同名API。原559/172等统计与停审门禁为修订前checkpoint；当前状态和实际重审见[repair记录](03_ddd_step_09_contract_repair.md)，恢复点只按项目台账/03 flow，不按旧当步等待点。

## 1. Step状态、开工确认与内计划

2026-10-03；full-restart / single-agent-serial。最新指令“现在完成03 step7”替代此前“全部07”的范围；只完成当前详细设计Step7，完成即停。不进入Step8、正式03装配、正式07、实施或项目测试，不提交。

| 开工项 | 实际记录 |
|---|---|
| 恢复 | 项目台账 -> 03 flow -> Step6停审主文件及模块卡 -> Step4/5归属 -> 当前SOP/规范；磁盘Step6已done/self_review pass/waiting |
| 通用纪律 | 通则§1.1~1.5；中间产物§3.4.3~3.4.7/3.5.1~3.5.2；真相源§2.1.1/2.2/2.2.1A/2.6~2.7/3.5.2~3.5.4；全局依赖全文 |
| 当前规范 | 详细SOP Step7全文；书写§4.3/5.5/5.6；设计中文Rustdoc，实际源码英文沿Step3 |
| 直接输入 | 当前00/01/02沿前序首次阅读；本轮复核01§8.1~8.2/9.1~9.4、02§7.6~7.8、Step5 Application/Infra及Step6§7.9~7.13/模块具体卡；不冒称全文重读 |
| 组织参考 | Governance Step7§1~7、§9.2~9.3、§10.2.2、§12~17；借逐模块capability、typed signature、version/page、read-write配对及跨审框架，不复制truth、产品或依赖 |
| 专项合同 | SDK03§7.3~7.4；Conversation03§7.1~7.4；Identity01§4；Governance03§7.1~7.4；Artifact03§6~7；Workspace03§2~3/7/17.2及项目台账恢复/开放项；Observability03§1~2及实施台账当前状态/十二affected |
| 真实shared/client | core actor.rs全文及metadata.rs PageRequest/PageToken；SDK client/lib.rs context/facade相关段落；core唯一已核计划编译来源，SDK仍conditional |
| 只读基线 | 229既有文件SHA-256，覆盖Bridges全目录、standards、七owner正式/必要台账、Governance Step5~10及现有其他dirty文件；flow/本台账为允许变化 |
| 过程事实 | 全仓Git路径输出截断、超长命令参数及截断路径解析的基线尝试失败，无写入；改为精确目录/来源范围后实际取得229文件基线 |
| 权限 | 当前agent独立串行；不创建/调用代理，不并行工具；手工写入apply_patch；仅当前Step7、03 flow、本台账 |

### 1.1 写入批次与模块门禁

| 批次 | 模块 / 范围 | 思考 | 写入 | 草稿 | 自检 | next_allowed_action |
|---|---|---|---|---|---|---|
| B0 | 当前Step骨架/恢复/顺序 | done | done | not_applicable | pass_structure_only | G0 |
| G0 | 共用signature/carrier/version/private规则 | done | done | done | pass_design_rules_only | C |
| C | contracts唯一传递与wire隔离 | done | done | done | pass | D |
| D | domain纯成员/完整重建的接缝需求 | done | done | done | pass | A0 |
| A0 | application stable helper/error/page/UoW context | done | done | done | pass | A1 |
| A1 | application U1 binding/config/mapping | done | done | done | pass | A2 |
| A2 | application U2 inbound/owner handoff | done | done | done | pass | A3 |
| A3 | application U3 presentation/delivery | done | done | done | pass | A4 |
| A4 | application U4 callback/actor/action | done | done | done | pass | A5 |
| A5 | application U5 continuity/recovery/lane | done | done | done | pass | A6 |
| A6 | application U6 observation/read/audit/result | done | done | done | pass | A7 |
| A7 | application private/secret/config/UoW及19callable | done | done | done | pass | I |
| I | infra逐adapter双向mapping/driver/private/runtime | done | done | done | pass | P |
| P | api typed admission/dispatch/actual ACK | done | done | done | pass | J |
| J | jobs五bounded callable/入口 | done | done | done | pass | W |
| W | worker source/session/consumer/eligible调度 | done | done | done | pass | X |
| X | 来源/传递/23port/19callable/方向/范围跨审 | done | done | done | pass_design_static_only | stop_at_step07_waiting_user |

### 1.2 产物与顺序

主文件保存执行计划、各模块问题/诊断/取舍、归属、草稿与跨审。当前Step按需创建以下附录，不把未来Step文件作为中间产物：

| 当前Step附录 | 内容 / 正式计划文件责任 |
|---|---|
| 03_ddd_step_07_application_support.md | application/ports/local_snapshots.rs、local_uow.rs、metadata_validation.rs的稳定page/事务/有限错误及调用上下文 |
| 03_ddd_step_07_application_ports.md | Step5十个port文件内23既有trait逐名read/write/外部结果/lifetime |
| 03_ddd_step_07_application_callables.md | 19既有用例文件的exact仓内input/方法/结果与port注入，不增加通用service |
| 03_ddd_step_07_infra_adapter_contracts.md | 四platform/六owner/local store/probe/private/secret/config/runtime既有文件的反腐和宿主边界 |
| 03_ddd_step_07_entry_contracts.md | api/jobs/worker既有入口文件typed callable与受限host消费；worker -> jobs单向 |

先整体骨架，再逐模块小循环；每组先问题回答/诊断/取舍，记录done才写结构化卡、复杂度、草稿和自检。跨模块shared规则只先定形态与来源，不先生成全仓port总表。Application内部按六U及共享四seam串行，所有组停审后再进入Infra。

## 2. 本步输入与真相上限

Step6现有409定义/403卡、243既有类型索引、19Domain+唯一view、17业务state、19请求处理入口与23port是本Step承接基线，不是409业务对象或实际接口已经存在。Step4既有文件路径与Step5归属不重写；新support carrier只在原责任文件闭口。

BR-UP-001~009=open、010=reference_only；Workspace原WS-UP/WS-LOCAL与Observability十二affected保持原状态。SDK/OAuth/API Key/KMS/router/executor/HTTP/DB/Bus/cache未选/未建立。新本地trait只能声明Bridges需求，不能伪造owner同名API、权限、account/token、兼容、no-effect、actual commit、投递或readiness。

旧README/正式03只作独立结论后的historical_material差异扫描。L5-chat未停审内容不能作输入。

## 3. 逐模块问题回答

### G0 共用问题回答

1. trait统一采用显式boxed Future，外层可经dyn注入；不使用不可对象安全的dyn async fn。跨模块统一函数形态，避免23port在executor/关联类型和生命周期上各自选型。
2. 所有IO future是本次call受限且不要求Send；外层在所属scoped执行线程内poll，不跨detached task、全局缓存或checkpoint。此选择不指定executor/transport，也不禁止宿主对不同安全call独立分片。
3. mutable row读返回完整model+实际LocalRevision+LocalHydrationBasisRef；snapshot读保Step6完整对象与read_basis，不能只返回ID。CAS的Absent/Present与各config/generation/cursor/lane轴分开。
4. 写参数须明确local transaction、expected local revision和有限staged结果；begin/commit/rollback各有typed输出。准备、CAS匹配、仓内暂存与actual提交独立，外部网络不在本地事务内。
5. private port返回本次call拥有的lease，再从活着的lease短借Step6 private handle；不得从async局部buffer返回悬空引用，也不得靠adapter长期缓存延长生命周期。lease helper不是新增业务port或truth。
6. technical ID/clock/安全meaning编码需求归既有LocalUnitOfWorkPort和当前metadata/local_mutation helper，Infra组合真实provider；不新建第24业务port。provider/codec未核时finite blocked，不让Domain/API/repository save拼ID或body hash。
7. application仓内input本Step必须exact闭口，不能拿Step8尚未定义的十个wire body作参数。19具体用例为独立typed调用，无通用route/selector/typed_refs数组猜测；完整wire装配再交Step8。
8. read/error/page/call-control同形基础载体在Application唯一定义；public结果仍用Step6稳定类型，Query无generic BridgeReadResult包装、不输出repository page/token。

### C Contracts问题回答

1. Contracts不定义/实现repository、provider、authority、delivery或host trait，也不依赖Application/Domain。只被port参数结果单向消费。
2. Step6所有locator、ref、meaning、Slot、finite outcome/state、稳定consumer/job/result/view完整复用；public BridgeReadResult为非泛型enum，旧HLD泛型记法不成为新声明。
3. core actor/metadata只实际重导出；Application helper/Page/lease/transaction不导出进wire；十完整协议body到Step8独立定义并逐字段反查。
4. public page不是repository page的别名。四Q当前结果只有BridgeLocalView；core QueryMetadata.page是输入偏好，不自动新增分页DTO或可输出数据库token。

### D Domain问题回答

1. Domain不定义任何IO port/driver，不接受Infra或入口类型；pure factory/getter/transition只承接Step6现有类型。
2. 19model的完整读面、local_revision、qualification/state-required、immutable receipt/audit与各种原op/claim/coverage依赖由Application port提供，不让Domain自行解引用。
3. Model getter用于仓内typed消费，不能直序列化对外。rehydrate必须真实stored basis；pure候选变化只能经原revision CAS/UoW成为local truth。
4. 配置/绑定generation、游标cursor revision、lane revision与LocalRevision各轴保持独立，读取者不能用时间、平台offset或新config版本覆盖local expected。

### A0 Application支持载体问题回答

1. 所有23port的Future/error、受权read session、完整row/Page与staged write/UoW handle唯一定义在原ports/mod.rs、local_snapshots.rs、local_uow.rs；不进Contracts或新utils/errors文件。
2. repository missing只用受限Option；page是bounded实际local committed rows，token绑定exact筛选、namespace、scope、排序和资格窗口。empty不是外部无效果/无消息。
3. BridgePortError为完整有限调用失败，不接受raw SQL/HTTP/SDK/stack/source；正常qualified/block/unsupported/unavailable、known result、unknown effect各用typed outcome，不能靠error文案推Domain state。
4. transaction读取为同driver一致基线；read不返回未提交staged候选。候选在Application内持有，只有actual commit proof能发布新revision；rollback/unknown均无auto-commit。
5. 本次call-control只持deadline、cancel借用和受核max调用/行数，零权限；不引用Infra RuntimeExecutionBudget造成反向依赖。clock技术来源在既有LocalUnitOfWorkPort闭口，不默认宿主产品。

### A1 U1问题回答与组内写入许可

1. BindingQualificationPort分别提供Pending/Suspended的activation、Active的current和两端mapping资格；explicit授权读取还承接安全local read context，不能让repository授内部权限。
2. MappingRepository保存relation及三mapping，lookup既按typed ref也按外部account/location/message和内部target/source；每次带namespace、relation/generation及受权context，不能跨安装或挑任意第一行。
3. InstallationRepository从namespace解析唯一安装、完整snapshot和current config CAS；配置接受不证明provider建立。配置/代际与LocalRevision条件全部保留。
4. 失效关联和四Q所需读面采用受限list/snapshot，结果完整model+version/read_basis；不得遗漏plan/action/lane关联，其他U负责各自关联list。

诊断/取舍：只save/get(ref)无法闭合外部定位、双向mapping及generation失效；采用具名lookup/list、完整typed rows与同UoW stage，不增加通用db查询port或identity owner。A0静态小审计后只开放A1，不先写后续U。

## 4. 当前材料问题诊断
### X 跨模块问题回答、诊断与取舍

跨审不从type存在、factory成功或SDK ACK推出资格/commit/送达。逐名核Application定义 -> runtime注册 -> Infra实际实现责任 -> 19callable注入 -> typed entry，并反查完整传递、版本轴、原operation、private buffer lifetime及取消出口。

本步发现并只在当前Step纠正：ProtocolAckExecution从API迁到Contracts唯一计划定义，避免Application/Infra反向依赖；C05初绑资格用Contracts的ActionBindingQualification而非尚不存在的callback资格；入口actual now由既有TrustedClock的ScopedRuntimeClock分面供给。补C04/E02/J01的完整installation/binding/mapping读取、C05安装、C06qualify_request和J02/J03 exact secret及Mapping/Lane finalize需求。六owner需求逐方法补材料重验、activation、mapping、dispatch、初绑/expiry、原结果、read与readonly恢复，均不是宣称owner已有同名API。

J01 selection必须保完整intent/effect，J02保原recovery/subject，J05保actual expected；同key原operation/result优先，nonterminal原生命周期不被一次safe结果永久锁死。Worker source discontinuity经原E01 safe Continuity分支记录Protocol gap，断线结果保实际local接管/unknown；batch消费plan前先pure guard、保唯一in_flight identity、actual返回按原plan核对。原Step6简化ownership/variant草案以当前附录精确覆盖，前序文件和正式03保持不动。

取舍：这些是当前接缝的可落码性修正，不新建业务owner/port/request/state，不把断连伪成消息或回放新效果。不扩充Step4文件树；测试切口归回已有target。算法/canonical/事务实现/产品pin及真实SDK兼容按后续Step核，缺实际依据保持finite Blocked/NotEstablished/manual，不能靠fake释放。

### W Worker问题回答、诊断与取舍

Worker分三条且只有三条runner链：E02/E04从Infra safe event transport lease穷尽分派并以一次性callback记录独立ACK；E01/E03只对resident qualified mode建立source connection，owning private lease活过Application与协议ACK；五类eligible页只由Application selector产生selection，经ScheduledJobCandidate和Jobs dispatcher有界调用。Worker不取repo/业务port/raw client，empty/disconnect/cancel/ACK不推coverage、no-effect或accepted。

W集成复核发现Step6两个ownership草案不可落码：WorkerConsumerItem返回时无法补E02 actual operation，WorkerSchedulingBatch借用plan无法交给消费plan的dispatcher；本Step以三参数`record_returned`和owned `take_next_plan`精确替换，字段/业务流不变。同时补`PlatformSourceHost`与`SafeEventTransportHost`两个Infra technical TransportHost分面，不计第24业务port。3 runner/2 host/owned page-plan链检查errors=[]、diff-check通过；W自检pass，下一仅X。

### J Jobs问题回答、诊断与取舍

Jobs唯一dispatcher穷尽五个BoundedJobKind/JobInvocationSubject组合，将TrustedJobContext和JobContinuityMetadata转为五个Application input；key由Application基于typed subject/trusted job scope生成，selection以同key查既有dedup/result/operation或分配fresh未执行operation。Jobs只把selection原值装成plan，不把key/runtime budget塞入Application input；invoke时Application重推同key并重读current，业务retry budget只取actual row/qualification。worker和五bin均调用同一dispatcher，candidate消费后取plan，不能形成jobs->worker依赖。JobInvocationState只记录本地调用phase、安全summary和unresolved，不伪run/report/evidence。J组5 input/5 selector/5映射及key-continuity传递静态审计errors=[]；J自检pass，下一只开放Worker。

### P API问题回答、诊断与取舍

API只把已认证principal/core metadata/trace及Step8未来decoder结果组装为Step7 typed input，按六C/四Q静态enum路由；不接收use-case名称字符串/任意refs。平台HTTP入口只由actual qualified source host创建owning lease/candidate key，短借E01/E03；Application决定ACK计划并经注入technical callback执行，API不把HTTP 2xx提升为业务结果。command/query/private三面分开，runtime unavailable不dispatch。server/router/body schema尚属Step8/14，当前只定义host callable和排他模式。I附录529唯一类型、undefined/duplicate=0、diff-check通过；P思考done，仅开放API entry。

### I Infra问题回答、诊断与取舍

Infra只实现23 Application port及入口所需host driver，不定义业务成功、authority或第二repository。四平台保各自source/method/thread/edit/delete/附件/callback/ACK/rate差异，不能一个free-form payload adapter抹平；六owner只绑定正式合同，缺兼容的call保持NotEstablished。local store八repo/UoW同driver/source/schema，commit probe只原mutation；private/secret/config均owning lease和safe ref，runtime按required seam排他装配。SDK/API/HTTP/DB/Bus/KMS/router/executor未选，采用adapter-local requirement trait，未来产品wrapper必须逐method证明兼容，当前不得宣称实现。A7静态闭包499唯一类型、23port/170方法、19callable、undefined/duplicate=0、diff-check通过；未编译测试。I思考done，只开放Infra附录。

### A7共用seam与callable问题回答、诊断与取舍

PrivateMaterial/SecretResolution返回当前call拥有的lease并短借Step6 handle；所有bytes/provider版本/current期限有明确owner，取消/drop不虚称zeroize。ConfigQualification核受信草案/动作与current required seam，不选OAuth/SDK/KMS/router；技术ID/clock/qualified key/safe meaning编码由唯一LocalUnitOfWorkPort闭口，不加第24业务port。begin先登记原mutation/expected/资格，事务内reserve后Application构造完整plan再seal，避免“必须有claim才能begin、必须begin才能claim”的循环；网络/preflight先于begin。19callable保持各自input/port bundle/有限结果，不引用Step8未定义body或通用selector。所有新carrier本组完整schema，stable原result不重定义。A6已停审，A7思考done，仅本组许可。

### A6 U6问题回答、诊断与取舍

SafeObservationPort只正式producer/schema/canonical准入及same-op consumer交接；Observability当前static producer map不含Bridges，不强行注册或复用Governance/Artifact等family。mandatory缺口阻对应mutation/IO；非mandatory仅actual owner permits audit-only，非默认降级。SafeReadQualificationPort resolver-first核current subject/stage/ref/count，Query零write/refresh/probe；SafeTraceRepository同UoW immutable audit/stored result及handoff CAS/原结果。只有ref的材料链无法闭合actual canonical与消费者阶段，补完整body-free材料资格和原result lookup。A5已停审，A6思考done，仅开放本组；BR-UP-006不关闭。

### A5 U5问题回答、诊断与取舍

ContinuityRepository管六namespace的key/meaning/original、stage cursor/epoch/CAS、gap/range及Recovery完整行；AuthoritativeRecoveryPort只读same-op权威probe，不造新效果；LaneRepository保持全scope下界、head/dependency/fence与actual reservation。缺committed result/no-effect/full coverage不能清未知head/gap或到期换op。local commit probe不套缺Local分支的ProbeOutcome，而由原LocalCommitDisposition独立返回；段位不合并。采用具名lookup/page/CAS+原claim reservation，driver同源，不加rate/clock业务port。A4停审pass，初绑资格冲突纠正只当前Step补充；A5思考done，只开放本组。

### A4 U4问题回答、诊断与取舍

平台签名不生成CurrentActionQualification。CallbackVerificationPort先产safe source-only carrier，ActorResponsibilityPort核真实账号/actor责任，OwnerActionPort核owner target/revision/one-use/授权后才组装既有QualifiedCallbackContext；新增中间carrier本组完整闭口。C05初绑与E03验证分开，不能为初绑伪造callback来源。CallbackRepository保source/action/原op双向定位及claim CAS，actual one-use durable commit先于owner IO。仅verified bool或库header验证不足，选择明确两阶段与原result读面，不新造审批truth。A3已停审，A4思考done，当前只开放本组。

### A3 U3问题回答、诊断与取舍

采用PresentationQualificationPort按committed source/原target/action当前核Policy/Gate/附件/降级，PlatformDeliveryPort只一次原attempt/effect调用，DeliveryRepository完整plan/intent/attempt/immutable receipt与effect/result关联。C04/E02同semantic effect唯一，J01只派既有intent；unknown只原权威probe，HTTP 2xx或平台ACK不造receipt。仅save无法支撑原effect查重/claim/receipt和绑定失效关联；补具名读及same-tx stage/append，完整限流下界交既有Lane/Config/Platform合同，无新rate port。A2已停审；A3思考done，只开放本组。

### A2 U2问题回答、诊断与取舍

三port分别平台本call验源/来源语义、已核same-op owner材料交接、完整inbound接管与结果记录。ACK计划由verifier，actual ACK由入口私有host；仓内record不默认平台ACK或owner accepted。Conversation port须当前target/mode/actor/material/digest/claim和原operation，结果用既有OwnerHandoffResultRef，恢复只读原result。入站不落raw body，材料仍由owner准入；缺来源/parent/edit/delete合同安全拒绝或保gap。只save无source/op反查会漏duplicate和恢复；选择完整version/snapshot、原source/op具名lookup及stage，不造内部Turn。A1已逐trait停审，A2思考done，当前仅开放inbound组。


Step6已关闭shape、字段来源、pure factory/member及精确defer，但未给19用例callable、23port签名、分页/事务读取语义和buffer owning执行合同。不能把safe ref、typed形状或“repository责任”当成实际可调用来源；也不能把local staged候选当commit proof。

G0诊断：直接把async fn放dyn、所有future强制Send、private handle从临时buffer返回、各repo各造Page/Versioned，都会使Step6安全边界或编译方向失效。clock/ID来源已在01技术承载与Step6字段审计出现，但不在23port之外偷增业务seam。current与hydration不同，safe结构factory只能校shape；不得把构造型token当实际权限或事务已注册。

C诊断：若把port/helper放contracts会造成Domain/IO反向依赖；若直接public序列化snapshot/transaction/raw lease将扩大材料边界。stable consumer/job结果现在已有shape，不能再次defer。当前没有公开Page声明，不能为SOP页检查造一个未要求的Query协议。

D诊断：只给repository ref会漏transition依赖，只给safe snapshot状态标签会漏原claim/unresolved head/material basis；Domain再查foreign资格会破坏纯核心。immutable receipt/audit需要完整append/get配对，不为它们虚构状态机。

A0诊断：泛型Page/Versioned若无字段会形成新的传递缺口；把仓内pagination token当public page或用NotFound推rollback会破坏边界。事务候选重建不能伪装成committed hydration。完整错误必须明确conflict载荷与effect未知，不加fake-only variant或自由error source。

## 5. 独立结论与历史差异

先完成上述模块/跨审独立结论，再实际读取旧README全文、旧正式03开头及对象/函数/持久化/恢复相关定点扫描。它们只作historical_material，不逆转当前正式00~02或提供可执行输入；没有修改旧README/正式03。

| 历史材料位置 / 冲突 | 当前Step独立裁定 |
|---|---|
| README仓定位/依赖/目录固定Python、TS、平台SDK、OAuth优先/API Key fallback、KMS | 只当前Rust七member/Step4路径；SDK/OAuth/API Key/KMS/router/provider尚未选择核验，无生产fallback。 |
| README核心映射把GlobalMember和external user/bot并列；Channel/Turn直接等同平台消息 | 只explicit binding和typed两端mapping；external_id不创建GlobalMember，Conversation/Turn/Identity及平台truth不归Bridges。 |
| README BR3固定“打开Chat审批”、BR5默认所有bot动作观测事件 | 敏感Gate只正式允许的无动作降级/安全跳转ref，不消费未停审L5-chat；Observability producer/must-observe资格不足先阻效果，不自行注册family。 |
| 旧03§1/§2/§5扩大BridgeRequest/PayloadEnvelope/IntegrationStatus/ReplayRequest/DeadLetter写模型 | 保正式02的19本地model/唯一view/17业务机；正文、callback选择、payload、secret不入本地truth或证据，无通用raw inbox/dead-letter。 |
| 旧03§5/§7函数只save/mapping，再把ACK/result/timeout合并；缺typed port/CAS/UoW签名 | 八repo完整读写配对、独立expected轴、同driver actual commit；平台ACK、内部owner提交、外部business result和consumer Accepted逐阶段保留。 |
| 旧03§8/§13按timeout/failure形成replay/resync并可重复触发 | 只原subject/op/effect有界权威probe及已知依据后的合法same-effect动作；NotFound/超时/lease expiry不是NoEffect，unknown保head/gap/manual。 |

历史中的“source truth不可被bridge替代”作为冲突扫描中一致的边界记录，不作为新authority、外部兼容或产品选择依据。正式03未来仅获Step19装配许可才重写。

## 6. 设计取舍与写入许可

B0已建整体计划与恢复入口。G0问题/诊断/取舍done：选executor-neutral boxed scoped Future与dyn注入、借活lease的private材料、完整row/version与single current transaction；不选GAT混合/dyn async、强Send/长期cache、新增clock/id业务port或提前wire body。当前只允许G0规则结构化/草稿/自检，Application具体carrier到A0独立闭口；不提前写A1~W合同。formal_document_write_allowed=false。

C思考done，采用现有typed Contracts参数和stable结果，不新定义IO trait、镜像truth或public page。只允许本模块capability边界/草稿/自检；全仓helper和Application trait不在本模块写入。

D思考done，采用Domain零IO、完整model/typed basis输入与Application负责来源、driver重建/CAS的边界；不引入domain::repository或公开model wire。当前只写Domain接缝需求与草稿，不在此写Application trait。

A0完成支持卡与类型/围栏小审计；cursor追加actor/access显式绑定，generic factory只校可见结构，typed adapter负责T与actual row的一致性。两个不精确补丁失败无落盘，缩小hunk后成功；只读Node quoting失败后准确重跑。下一仅A1；A1问题/诊断/取舍done，允许binding/config/mapping附录。

## 7. 结构化中间产物与复杂度

### 7.1 G0 共用规则

| 规则 | 本Step具体契约 | 所有模块必须维持 / 后续 |
|---|---|---|
| Future形态 | BridgePortFuture<'a,T>统一为Pin<Box<dyn Future<Output=Result<T,BridgePortError>> + 'a>>；alias唯一在application/ports/mod.rs，A0定义错误schema | 不加隐式Send、关联Future混用或dyn async fn；executor-neutral，产品Step14/04 |
| 参数与dyn | port方法仅lifetime泛型，输入typed value/borrow，trait无关联泛型方法；仓内bundle借dyn既有23port | 边界结果不返回任意Any/String/serde_json::Value；private生命周期不得擦成static |
| row版本 | BridgeVersioned<T>完整value/LocalRevision/LocalHydrationBasisRef；各Snapshot仍完整，read_basis.expected覆盖返回行 | model.local_revision与wrapper一致；config/generation/cursor/lane轴不替local CAS |
| local transaction | 所有save/append/stored result只同BridgeLocalTransaction；提交和rollback消费唯一handle，actual proof仅来自driver | 不把CAS Matched、StagedWrite或begin当Committed；网络先后分事务，未知保持原mutation |
| 原结果 | immutable same key/meaning/op/effect结果读取；actual committed原结果完整typed payload，当前visibility仍再核 | duplicate不得重新IO/扫描/解析private；NotFound不是rollback/no-effect |
| page | 内部请求绑定namespace/scope/purpose/order/上限、opaque cursor；返回bounded items+next cursor+完整read basis | token不可跨namespace/筛选/actor资格使用；不携raw主键/SQL/URL，public page不直接透传 |
| private lease | provider在当前call拥有buffer，port返回受限lease；用活lease短借Step6 handle，借用在drop前结束 | 无Debug/Clone/serde/Display/Error-source/durable/cache/detached task；取消后不宣zeroize |
| technical来源 | ID/clock/meaning-ref编码由既有LocalUnitOfWorkPort的具名technical方法或明确metadata helper承接 | 算法/driver/product未选仍blocked，不把随机/时间/trace/body hash当semantic identity |
| current authority | actual qualified owner/platform/provider结果与结构factory分开；最后IO前再核generation/revoke/expiry/action/secret | owner-specific缺口finite Blocked/Unavailable，不靠bool/ref/SDK/grant默认许可 |
| 范围 | stable仓内carrier/callable当前close；十wire body/完整DTO映射到Step8，flow/矩阵/driver按序 | 本步设计pass不代表03完成、真实资格、编译/测试或实施ready |

```text
call owner: transport / provider owns bounded private buffer
                |
                v
       scoped lease (no persistence / no detached task)
                |
                +--> short borrowed Step6 private handle
                |             |
                |             v
                |    one named qualified port call
                |             |
                +-------------+--> safe finite result only
                         |
                         v
                 end borrow -> drop lease
```

图说明：箭头只表达存活期和数据边界，不证明实际运行；raw buffer不进入safe结果。Future可以本call内await，但不持有越过lease存活期的引用。取消结束本地等待，不替owner/platform/local commit权威结果。

复杂度：共用alias/typed row/page/控制只共享调用shape，不共享权限或业务状态。具体support schema在A0到达时定义，lease内部来源与产品binding在I闭口；不因为规则通过提前声明它们已实现。

G0草稿：未来§5统一executor-neutral scoped Future、dyn typed port、完整row/version、同一local transaction和活lease借用；不新增业务port或公开helper。G0设计规则自检pass：与Step3 Future模型、Step6 private纪律/23port/typed版本轴一致；尚未运行传递闭包或编译，下一只C。

### 7.2 Contracts

| capability / Step6对象能力 | 接缝裁定 | 调用 / 实现方 | 后续 |
|---|---|---|---|
| typed locator/ref/state/meaning/Slot | 作为Application port I/O词汇；本模块不定义port | Application与Infra单向消费；factory只校结构 | Step8 wire/custom decode，Step13 canonical |
| stable C/E/Q/J结果及唯一BridgeLocalView | Application current筛选后构造；不可返回内部snapshot/Page/transaction | result_mapping与entry有限映射 | Step8 exact协议映射，Step9顺序 |
| core actor/metadata | 真实core reexport；actor与Command/QueryMetadata分开 | trusted host注入，Application验证 | owner authority不是core carrier提供 |
| 17状态及独立阶段 | 同一enum用于domain/adapter/read，不靠字符串猜结果 | Domain typed pure transition；Infra有限映射 | Step10完整触发矩阵 |
| 十完整协议body | 本Step不作为签名入参；只具名交Step8 | contracts原commands/consumers/queries责任文件 | 不造Any/空壳DTO临时落码 |

Trait / Port / Adapter表：本模块无IO trait/实现，定义位置not_applicable；所有传递类型唯一在Step6既有shared卡。复杂度不新增层或对象。草稿为上述public/private隔离与原稳定结果，不包括过程表。C自检pass：零新Contracts IO、零Domain/Application反向依赖，公开page判断明确，下一D。

### 7.3 Domain

| capability / Step6对象 | 来源需求 / Application接缝 | 调用方 / 实现方 | 读写与副作用下限 |
|---|---|---|---|
| U1配置/受权relation/三mapping | Installation/Mapping完整model与current Binding/Actor/Config资格 | C01~03/J05；Infra local store与正式owner | 完整rehydrate及独立revision轴，CAS/代际关联失效；不创建GlobalMember |
| U2 InboundHandoffRecord | Inbound safe记录/原result、verified source/current material、Conversation原op结果 | E01/J02；platform/Conversation/material/local store | protocol ACK与owner阶段分开，unknown不建已知message mapping |
| U3 plan/intent/attempt/receipt | Delivery完整source-target-effect/claim，current presentation/平台结果和lane下界 | C04/E02/J01/J02；local store/owner/platform | C04/E02同effect，immutable receipt append/get，已知reject不推no-effect |
| U4 action/callback | Callback完整one-use/原op记录与Actor/current owner action | C05/E03/J02/J05；local store/platform/owner | claim同UoW durable后才IO；Claimed不复活；敏感语义仅safe owner ref |
| U5 dedup/cursor/gap/recovery/lane | Continuity与Lane完整rows/原result；权威same-op probe/comparator/coverage | 所属C/E/J；local store/probe/对应authority | 同stage/stream/epoch/CAS，全bucket下界，unknown head/gap不清除 |
| U6 immutable audit/handoff | SafeTrace完整audit/handoff与原result；current safe observation/read | mutation/J04/E04/Q；local store/Observability/条件Workspace | append/get与CAS同UoW；mandatory不足先阻，Query零write |

本模块Trait表为not_applicable：19模型的现有factory/rehydrate/getter/纯迁移是唯一调用面；ContractViolation沿Step6，不新包IO错误。复杂度维持六U，不添加public mirror/replay policy。D草稿为完整model/source/CAS需求与Domain零IO；D设计自检pass：17业务机及immutable两record未新增状态，19完整rehydrate来源均有明确下游port责任，下一只A0。

### 7.4 Application

按A0 -> A1~A7逐组完成capability/问题/诊断/取舍/卡/草稿/自检，最终具体schema和签名见[共用支持](03_ddd_step_07_application_support.md)、[逐U端口](03_ddd_step_07_application_ports.md)及[19 callable](03_ddd_step_07_application_callables.md)。八repo完整读取19模型与九既有snapshot，所有mutable写带actual expected和同driver transaction，receipt/audit/result为immutable读取+唯一append配对。public Query只返回当前可见BridgeLocalView，不直接输出Page/cursor/model。

23port共172具名方法；19callable为六C/四E/四Q/五J，仓内input、factory/getter、exact构造注入及独立stable结果闭口，另五selector只Application qualified eligible读。clock/ID/key/meaning沿唯一LocalUnitOfWorkPort，private/secret均owning lease后短借，outer失败有限且post-effect unknown携原operation。C05初绑资格在Contracts，E01 Continuity只有原Protocol gap，C04/E02同effect且零send，Query无write/probe/refresh。

复杂度：helper共享signature/page/UoW/private lifetime，不共享权限/状态或变成第24port。A组模块自检pass；X更正覆盖A7早期注入/传递草案，完整wire body/DTO到Step8、函数流到Step9，不重开已停审的Step6文件。

### 7.5 Infra

四typed platform wrapper/router、六正式owner需求/组合facade、同源LocalStore/commit probe、Recovery facade及private/secret/config/event/audit/runtime责任见[Infra契约](03_ddd_step_07_infra_adapter_contracts.md)。实现责任按3 platform ports + 7 owner/read ports + 8repo/UoW + Recovery + private/secret/config唯一覆盖23port；technical requirement/clock/source/ACK host不计业务port。

四平台分别保source排他、account/channel/message/thread、edit/delete/reply、callback/ACK、授权附件、全部rate下界与原probe差异；owner需求不镜像Conversation/Identity/Gate/Artifact/Workspace真相。当前source/coverage/comparator/producer兼容不足有限blocked/manual，不从method返回2xx或factory生成proof。actual raw error、message/token/secret/敏感审批不出call栈帧。

复杂度：新增Bound/helper只承接实际产品binding和异构runtime装配；23+既有technical seam按Step6 required闭包与当前依赖并集核验，不删除CommonRead/TransportHost等前序required。I模块自检pass；SDK/HTTP/DB/Bus/KMS/router/executor及安装/account均未建立，测试只既有target内的计划切口。

### 7.6 API

见[入口契约](03_ddd_step_07_entry_contracts.md)§2：六C/四Q静态dispatcher，actual认证principal/core metadata/trace与Application input同源；admit和dispatch经ScopedRuntimeClock取actual now核runtime/window，不能由URL字符串、body actor或scope hint授owner权限。E01/E03只actual HTTP registered source owning lease，API拒客户端自报Continuity；private借用活过Application和actual ACK。

ACK safe结果唯一定义Contracts，API仅记录/映射actual执行，不把HTTP状态提升为owner提交/平台送达。Query dispatcher没有mutation fallback；server/router/wire/serde/status到Step8/14。P自检pass；没有handler直达repo/SDK/domain写或新业务入口。

### 7.7 Jobs

五个J input保持`TrustedJobContext + typed subject + JobContinuityMetadata`，不接收key、runtime budget、token或body hash。Application五个具名selector先经ConfigQualificationPort取得maintenance read，再读取eligible完整row、生成typed subject/key/meaning，复用既有原operation或仅在确无记录时分配fresh未执行operation；selection消费后由Jobs穷尽装配Step6 JobInvocationPlan。dispatcher按五个kind/subject唯一调用同名J use case，runtime budget只限本次调用，业务retry仍由Application current row取得。

worker通过`ScheduledJobCandidate::from_selection`调用Jobs assembler，保持`worker -> jobs -> application`单向；五bin复用同dispatcher且只能接正式invocation provider的单个计划。取消/unknown保原operation，CompletedLocal不提升平台/owner/consumer结果。复杂度不新增job truth、repo port或通用replay service。J草稿见entry附录§3；5 input、5 selector、5映射、三处新增Config注入及旧方法名静态核对通过，errors=[]，未编译/执行测试。J设计自检pass，下一仅W。

### 7.8 Worker

E02/E04由`SafeEventConsumerRunner`消费`SafeTransportEventLease`，只匹配两个safe Application input；private delivery handle封装在一次性ACK callback中。E01/E03由`PlatformSessionRunner`绑定一个QualifiedPlatformSourceRegistration和resident host，HTTP/webhook/interaction模式在connect前拒绝；connection/session/epoch仅entry-local，断开/空poll/重连不推进cursor或关闭gap，owning Ingress/Callback lease保持至Application Future和协议ACK结束。

`WorkerSchedulingRunner`按kind调用唯一Application selector，消费page/selection装`ScheduledJobCandidate`，再用owned plan调用同一Jobs dispatcher。Step6的WorkerConsumerItem和WorkerSchedulingBatch ownership签名已在entry附录§4.1精确纠正；shutdown按Draining、停止新项、bounded等待、收集actual unresolved、停止session、record_local_stop顺序，unknown非空必StoppedWithUnknown。两个Infra technical host不增加业务port，三个runner不直接依赖repo/domain/platform SDK。W局部静态检查2 host/3 runner/7关键方法、direct business repository依赖0、errors=[]；未运行编译/项目测试。W设计自检pass，下一仅X。

### 7.9 跨模块审计

以下总表只在所有模块逐组停审后生成；具体逐模块签名/字段来源仍以附录为准，不用总表代替capability。

| 唯一Application trait | 定义文件（ports/下） | 唯一实现责任 | 主要调用方 | 方法数 |
|---|---|---|---|---|
| BindingQualificationPort | binding.rs | OwnerPortFacade | C02/C03/C04/C05/E01/E02/E03/J01/J02/J05 | 11 |
| MappingRepository | binding.rs | LocalStoreAdapter | binding/mapping/inbound/preparation/callback/dispatch/recovery/Q01/J05 | 21 |
| InstallationRepository | binding.rs | LocalStoreAdapter | C01/C02/C04/C05/E01/E02/E03/J01/J02/J03/Q01/J05 | 5 |
| PlatformIngressPort | inbound.rs | PlatformPortRouter | E01 Private/Continuity | 2 |
| ConversationHandoffPort | inbound.rs | OwnerPortFacade | E01；J02经recovery facade只读 | 5 |
| InboundRepository | inbound.rs | LocalStoreAdapter | E01/J02/Q02/J05 | 5 |
| PresentationQualificationPort | delivery.rs | OwnerPortFacade | C04/E02/J01/J05 | 5 |
| PlatformDeliveryPort | delivery.rs | PlatformPortRouter | J01；J02原readonly分支 | 3 |
| DeliveryRepository | delivery.rs | LocalStoreAdapter | C04/C05/E02/E03/J01/J02/Q02/J05 | 15 |
| CallbackVerificationPort | callback.rs | PlatformPortRouter | C05/E03 | 3 |
| ActorResponsibilityPort | callback.rs | OwnerPortFacade | C03/C04/C05/E01/E02/E03/J05 | 3 |
| OwnerActionPort | callback.rs | OwnerPortFacade | C05/E03/J05；J02原readonly分支 | 6 |
| CallbackRepository | callback.rs | LocalStoreAdapter | C05/E03/J02/Q02/J05 | 10 |
| ContinuityRepository | continuity.rs | LocalStoreAdapter | 全mutation/原result及J02/J03/Q02/Q03/J05 | 16 |
| AuthoritativeRecoveryPort | continuity.rs | RecoveryPortFacade | C06只qualify_request；J02/J03 readonly | 6 |
| LaneRepository | continuity.rs | LocalStoreAdapter | J01/J02/Q03/J05 | 9 |
| SafeObservationPort | traceability.rs | OwnerPortFacade | mutation mandatory preflight/E04/J04/J05 | 5 |
| SafeReadQualificationPort | traceability.rs | OwnerPortFacade | mutation safe出口；Q01~04 | 3 |
| SafeTraceRepository | traceability.rs | LocalStoreAdapter | audit/result/E04/J02/J04/Q02/Q04/J05 | 14 |
| PrivateMaterialPort | private_material.rs | BoundPrivateMaterialAdapter | E01/J01 | 2 |
| SecretResolutionPort | secret.rs | BoundSecretAdapter | E01/E03/J01/J02/J03 | 2 |
| ConfigQualificationPort | config_qualification.rs | BoundConfigQualificationAdapter | C01/C04/E01/E02/E03/J01~05/五selector | 5 |
| LocalUnitOfWorkPort | local_uow.rs | LocalStoreAdapter | 所有mutation/五selector；Query不注入 | 16 |

| 跨审项 | 结论 | 修正 / 残余边界 |
|---|---|---|
| 唯一定义/注册/注入 | 23trait/172方法/23registry，19callable/5selector，逐名闭口 | 无第24业务port；constructor字段与exact参数表一致。 |
| 模型完整read-write | 八repo，19模型get -> stage/append配对；snapshot/lookup/list/eligible/原result均typed | stage_result固定Absent唯一append，不接任意overwrite；模型wrapper revision与actual hydration一致。 |
| optimistic/transaction | local/config/generation/cursor/lane版本轴各自保留；save/reserve同UoW | Staged/CAS matched不是actual commit；事务内零外部IO，unknown原mutation。 |
| helper/public page | 支持carrier完整factory/getter/source/limit/filter/actor/access/window | repository page不是public page；现有Q四结果非page，不输出store token。 |
| 类型/方向/尺寸 | Step6五附录+Step7六文件共559唯一声明；undefined/duplicate/direction error/value cycle均0 | ProtocolAckExecution归属override、ActionBindingQualification Contracts归属及Domain纯bind方向已核。 |
| private/ACK/取消 | owning lease活过borrow/Future/ACK；有限error，无raw错误链 | post-effect返回known原结果或Indeterminate(original)，cancel/drop不造NoEffect或删unknown。 |
| job传递/幂等 | J01完整effect、J02原record/subject、J05actual expected全链保留 | 同key重读actual记录/current，原operation优先；非终态只同生命周期合法恢复，不换op重放。 |
| worker消费/停止 | safe lease一次性ACK；owned page/selection/plan；唯一batch in_flight | 返回原plan再核subject/op；断线E01实际结果携回，EOF/empty/重连不推coverage，shutdown并集。 |
| 四平台/六owner | 平台逐表双向反腐；owner需求逐method，不声明foreign API已存在 | BR-UP不释放；formal no-probe/no-comparator分支保持manual/Unavailable。 |
| 后续protocol/flow/matrix | 19仓内input及read-write已提供Step8~11所需接缝 | 十完整wire body/序列化、函数流、17矩阵、driver事务仍按Step顺序，当前不提前装配。 |
| 计划路径/测试 | 当前45个explicit source/test路径均在Step4已有148个.rs路径内 | 纠正Domain路径漏src与Infra新test名字，切口归回既有target，无新增实施文件。 |
| 范围/输入事实 | 229既有文件baseline除许可flow/台账外changed=[]/missing=[] | 正式00~03/README/前序/standards/七owner/其他dirty均未改；L5-chat未停审不作输入。 |

跨审pass仅表示本Step设计静态闭口，无未裁定的本步接口冲突；运行资格和上游开放项不因此pass。禁止将该结论转换成compile/test/compatibility/verdict/signoff/readiness。

## 8. 回填草稿

未来正式03§5按Contracts -> Domain -> Application六U/共享seam -> Infra逐adapter -> API/Jobs/Worker展开上述模块合同：完整trait参数/结果/error、读取与版本/UoW配对、private lifetime、typed输入/19独立callable和actual来源上限。Contracts唯一承接safe ACK与初绑资格；Domain零IO；23port唯一在Application，Infra负责反腐与同driver实际来源，entry不能越级。

§6索引只引用本Step已闭口type/trait/adapter/callable及Step4路径，不新增对象或协议；Step8/9装配采用J01/J02/J05完整selection、JobInvocationSubject两个variant覆盖、Worker三ownership修正与in_flight字段增量，不沿旧简化草案丢字段。§7.9总表和五附录为该草稿的精确承接依据，过程门禁/批次/审计记录留在calibration；当前没有正式03写入/装配许可。

## 9. 待确认事项

owner-specific authority/material/action/result/current/probe、平台method/source/comparator/coverage及产品/driver资格继续BR-UP索引；这些运行blocker不能靠本地trait或fake释放。完整wire协议属于Step8、函数链Step9、矩阵Step10、driver事务Step11、错误/并发Step12~13、产品绑定Step14/04，当前稳定callable/helper不能机械defer。

## 10. 自检与当前门禁

初封存复查发现两个HRTB ACK callback的Future未显式关联borrowed driver宿主。只重开当前Step7 X纠正：BridgeProtocolAckExecutor采用self短借的technical方法，SafeTransportAckCall采用消费Box<Self>且Self:call的一次性方法；actual host/reply/control均活过Future，不增加业务port/请求或假定static client。完成后重新跑同一静态审计并三层停审；Step8/正式03/实施权限始终false。下列559/1108是本次纠正后的最终计数，初封存558/1105只属过程checkpoint。

2026-10-03：B0/G0/C/D/A0~A7/I/P/J/W/X全部done，设计静态自检pass，Step7完成并等待用户停审确认。实际只读检查：559唯一定义、undefined/duplicate=0；23port/172方法/23registry、19callable/5selector、8repo/19模型配对、constructor一致；role方向和值尺寸递归均0错误；Rustdoc声明扫描1108项缺失0；45显式计划路径outside=[]。Markdown表/围栏/相对链接/新文件尾空白检查与git diff --check通过。229文件范围baseline changed=[]/missing=[]，当前cached diff为空。

上述499/529等批次计数是当时局部checkpoint，不是最终类型总数；最终以本节559为准。自检只审查文档声明、数据来源/边界及静态传递，不是Rust compiler/borrow checker、项目测试、真实platform/owner兼容或验收。未启动服务、账号/token、实现仓、实施台账/boundary、artifact/report/evidence或signoff/readiness。

过程偏差如实保留：重读时一次错误Step4文件名读取失败无写入；多次末尾不精确hunk导致apply_patch整批校验失败，缩小/精确hunk后成功；Rustdoc首版将fn参数当字段且未正确处理嵌套variant，改按结构span后复查；Output associated name不计未定义type；port审计曾将Get*Input前缀误作use case、immutable result固定Absent误报expected，修parser/显式规则后重跑；大JSON补丁输出截断无写入，改逐hunk/LCS并用apply_patch。没有用这些失败输出填pass。

最终修改范围仅本Step主文件+五附录、03 flow、本台账八文件。BR-UP-001~009=open、010=reference_only，Workspace原开放项与Observability十二affected、所有产品/平台实际安装not_selected/not_established不变。下一只等03 Step8明确授权；获准后读取详细SOP Step8全文、书写§5.7、当前Step6/7、正式02及受影响owner正式协议/必要台账，再建本步产物。commit_required=false，不需提交。

```text
current_document = 03
current_step = 7
current_module = step07_complete_waiting_user
document_status = in_progress
step_status = complete_waiting_user
step06_design_self_review = pass
step06_user_confirmation = explicit_continue_to_step07
step07_design_self_review = pass
step07_user_confirmation = waiting
gate_status = blocked
gate_reason = authorized_stop_at_step07
next_allowed_action = wait_for_user_authorization_of_03_step08
calibration_write_allowed = false
formal_document_write_allowed = false
formal_03_assembly_allowed = false
step06_allowed = false
step07_allowed = false
step08_allowed = false
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
