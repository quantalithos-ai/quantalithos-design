# L6-bridges 05 Step6：场景用例

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| cases | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step07_skeleton | 本Step§2/7；实际静态审计 |

### Step内计划

| 小阶段 | 状态 |
|---|---|
| 输入/前序阅读 | done |
| SOP问题回答 | done |
| 当前材料诊断 | done |
| 测试设计取舍 | done |
| 结构化/逐切口停审 | done |
| 复杂度与批次判断 | done |
| 回填草稿 | done |
| 实际自检/下一条件 | done |

## 2. 本步输入

已回读Step5候选/源向覆盖与03§15、§16.3/16.6、§10.1/§12.2；复核03 ContractViolation八variant/BridgePortError有限variant、04 CF01~22，以及SOP Step6十一问题和书写§5.6。逐cut现建case，未预先造总用例表。

## 3. SOP问题回答

1. 合法主链从完整DS/原schema、逐方法script/current开始，显式执行callable与所属member，actual mock结果清晰标synthetic。
2. 每required/typed ref/Slot/namespace/资格/时限逐维负向，边界含lower/exact/upper与checked overflow；不能只混合一个坏fixture。
3. 全21机150pair具名member/guard、未列补集及guard-fail原对象exact equality；technical不hydration/durable。
4. 全CAS与unique采用barrier/逐stage failpoint；比对19collections/result/audit/claim全集、调用计数与原结果。
5. A/B/C crash/ACKlost/known finalize失败、四subjectprobe、B gap与C stage独立、expiry/current分别复现。
6. exact state/fields/errors沿03；CV与PE不混用，具体错误由变异维度/原guard确定并固定参数表。
7. 只在对应actual phase成立后assert OwnerAccepted/PlatformAccepted/ConsumerAccepted等，不靠ACK或Plan。
8. 各cut至少合法+关键负向+边界/重复/并发/恢复；横切参数族无孤儿。
9. 每TC有DS、步骤、预期/断言、primarysuite及EV；参与target回Step3，全部P0/自动化/planned。
10. 每cut写后局部检查TC唯一、行列/来源/DS/suite/EV，再停审。
11. 最后反查20协议/21机/CFG12/四平台/六VETO、TC及EV唯一、不得phase越界。

## 4. 当前材料问题诊断

候选TC只能帮助追溯，不能作为执行用例；需要可计算negative dimensions、typed原身份、stagecount和不变/零调用断言。笼统“失败”不可作为expected，缺actual qualification也不是该正向case passed。

## 5. 改动前后对比

| 候选阶段 | 本步执行合同 |
|---|---|
| TC001/002主链/拒绝定位 | 逐cut多类TC+每字段/状态/平台/CF/F参数实例 |
| before/after只看一行 | whole snapshot含result/audit/claim/关联行，guard fail exact equality |
| 延迟/重启口头恢复 | deterministic clock/barrier/failpoint及原四proof脚本 |
| 静态EV像证据 | caseinstance必须真实runner写，计划表不派生passed |

## 6. 测试设计取舍与复杂度

22切口各约4~12TC，逐cut小循环而非一次生成无归属巨表；精确schema/M pair/CF/F用参数化实例，仍要求全集而非抽样。状态矩阵另建design-only JSON机械反查原§9，无新pair。草稿超过300行分cut追加，Step7承接具名DS细化；当前每TC前置已写足来源/状态。

## 7. 结构化中间产物

### 7.1 执行共同合同

每SC与同序TC一一对应（SC-<cut>-<三位序号>）。下面全P0/自动化/planned/not_run；每cut绑定一个planned EV，不是实例。前置DS均planned，Step7细化factory/authority/隔离；synthetic port脚本完整typed结果/顺序/计数，未声明actual资格。

每具体case instance只有一处primarysuite归属；SURFACE参数按wire→SUITE-S、model→SUITE-D路由；STATE参数按M01~21的声明路由（下述），TC-ENTRY-001/TC-CONFIG-003的host参数按api→SUITE-I、jobs→SUITE-J、worker→SUITE-W，其余TC按表内primarysuite。所有参数路由必须在expected manifest固定，不能runner临时选target。每TC的primarysuite默认只有一处归属；Step3其余target为交叉回归入口，不据此生成虚假通过实例。STATE的M01~17在SUITE-D，M18在SUITE-I、M19在SUITE-J、M20在SUITE-W、M21在SUITE-W；其pure guard实例分别运行，actual persistence另由LOCAL/L验证。

参数实例必须覆盖完整封闭集合：20协议及对应03§8 schema所有required/optional/Slot/enum；21机全部allowed pairs/未列有向补集/每guard负向；04 82key/22CF/27F/12CFG、four platforms实际capability。固定case params使用safe manifest index（不带业务locator/body），每tuple具名expected variant；runner缺任一实例=blocked，不用单个passed代表全族。

CV=ContractViolation八原variant；PE=BridgePortError原finite enum。Malformed DTO在codec/factory拒绝；无授权/合同由port返回PE::Denied/NotEstablished，不能借CV授资格。preflight zero IO；post-effect失去结果保原Indeterminate，不降为普通Unavailable。全部错误不携raw cause。

### 7.2 逐切口场景与用例矩阵

各小节具名来源、DS与planned EV，表内明确primarysuite。所有原result/proof只synthetic script或将来qualified real-seam提供；log与机器产物仅记录有限assertion id，不保存对象/请求/材料/真实ref。

#### CUT-BR-SURFACE：公开协议与构造

设计来源=03§8/15.1/16.3~16.5；对象=C01~C06/Q01~Q04/E01~E04/O01/J01~J05；19Domain+View；DS=DS-SURFACE-001；planned EV=EV-CONTRACT-001。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-SURFACE-001 全20wire/构造正向 | P0 | DS-SURFACE-001：20协议合法schema及完整Slot；19Domain合法factory来源 | 逐encode/decode canonical roundtrip；DTO→对应factory→safe response | exact kind/fields/metadata及合法初态；O01无entry | deep equality每字段，core metadata唯一；factory≠迁移、View六字段不durable | 是；SUITE-S |
| TC-SURFACE-002 逐required/引用错配 | P0 | DS-SURFACE-001：每schema每required及两端字段独立变异 | 一次删除一required、错型/owner/kind/scope、Missing Slot；decode/factory | codec拒；factory CV::MissingRequired/WrongKind/OutOfScope对应原guard | 所有dimension必须有instance；零UoW/owner/platform/ID；raw error不可输出 | 是；SUITE-S |
| TC-SURFACE-003 enum/optional/collection边界 | P0 | DS-SURFACE-001：所有schema variant/nullable/集合与预算合法基线 | unknown/duplicate字段、未知variant、optional单改、UTF-8/checked长度lower/exact/upper | 合法variant roundtrip；非法有限InvalidValue/codec拒；changed meaning不等原meaning | 字段名字与03§8逐字；不trim/重排typed数组/漏optional；参数实例全集 | 是；SUITE-S |
| TC-SURFACE-004 ManagementBody canonical变义 | P0 | DS-SURFACE-001：C01~03/C05原完整body、同key原result | 逐改变optional/expected/config/action字段；比较meaning并duplicate执行 | 同body复用；changed meaning PE::Conflict::SemanticKey | 原result完整不覆写；新ID/trace/run不参与business等价；初C05不需尚无action ID | 是；SUITE-C |

#### CUT-BR-BIND：配置与显式授权关系

设计来源=03§8 C01/C02/§9 M01/M02/§15.1；对象=BridgeInstallation/ExternalBinding；config/local/generation独立；DS=DS-BIND-001；planned EV=EV-CONTRACT-002。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-BIND-001 C01/C02合法接纳及授权 | P0 | DS-BIND-001：Absent安装或完整配置双轴；Pending绑定正式两端/actor/action/current | C01 configure/apply；C02 propose→activate；每actualU阶段script显式Committed | Configured不自动Qualified；正式activation后Active | config/local/generation各轴checked；zero secret解析/平台IO；全result/audit同U | 是；SUITE-A |
| TC-BIND-002 平台权限不能内部授权 | P0 | DS-BIND-001：只有external admin/PAT或Pending自身当basis | 执行C02 activation或受绑定operation | PE::Denied/NotEstablished；Pending不Active | 0GlobalMember mint/owner命令/平台dispatch；拒绝无新audit | 是；SUITE-A |
| TC-BIND-003 撤销与旧queued并发 | P0 | DS-BIND-001：Active完整original、queued intent；barrier分资格读取与IO前current | C02 suspend/revoke提交，随后释放旧IO前barrier | Suspended/Revoked及新generation；旧path PE::Stale/Denied | 0新增外部effect；历史known/receipt不删；mapping旧generation不能执行 | 是；SUITE-A |
| TC-BIND-004 C01修订/管理重复竞争 | P0 | DS-BIND-001：相同namespace/expected与相同或异meaning两请求 | barrier同时read→wholeCAS；重复读原result；local-only或config-only mismatch | 一个完整winner；loser PE::Conflict::Version/SemanticKey | 零partial row/audit/result；双expected全核；退役不抹unknown | 是；SUITE-A |

#### CUT-BR-MAP：三映射与双端回链

设计来源=03§8 C03/§9 M03~M05/§15.1；对象=ExternalIdentityMapping/ExternalLocationMapping/ExternalMessageMapping；DS=DS-MAP-001；planned EV=EV-CONTRACT-003。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-MAP-001 C03三typed link/回链 | P0 | DS-MAP-001：完整binding/current generation；Identity/Location合法actor/target；Message实际known | 分别LinkIdentity/LinkLocation/LinkMessage，读原回链 | identity/location Valid；message Linked | exact namespace/kind/parent/generation/direction/source-version/result；0owner实体创建 | 是；SUITE-A |
| TC-MAP-002 0/多命中及跨安装 | P0 | DS-MAP-001：未命中/二候选/同external_id异installation/kind/generation | resolve mapping并执行原请求 | authorized absent或PE::InvariantViolation/Denied；不first/latest remap | 0外呼/新mapping；显示名不参与；错target/parent CV::OutOfScope/InconsistentFields | 是；SUITE-A |
| TC-MAP-003 unknown不能message link | P0 | DS-MAP-001：owner或platform result Indeterminate；随后原authoritative known | C03 link_known前试unknown，再用原known形成合法候选 | unknown拒；只有实际known允许Linked | ACK/metadata不owner/platform proof；known ref immutable原subject | 是；SUITE-A |
| TC-MAP-004 失效/墓碑及终态 | P0 | DS-MAP-001：Valid/Linked/Stale合法原row，正式invalidation/tombstone依据 | C03 invalidate/revoke/tombstone；再尝试旧target/relink | Stale/Revoked/Tombstoned沿原M03~05；非法复活拒 | 原locator/source/action历史保留；external delete本身不授tombstone、无内部delete | 是；SUITE-A |
| TC-MAP-005 mapping unique竞争 | P0 | DS-MAP-001：两request同locator/generation但不同内部target | barrier整U compare/unique提交 | 仅一winner；SemanticKey/Version conflict | message/type索引不自由字符串；关联行/原result无partial | 是；SUITE-A |

#### CUT-BR-INBOUND：可信入站及正式对话交接

设计来源=03§8 E01/§9 M06/§15.1；对象=verified Private、InboundHandoffRecord、Conversation port；DS=DS-INBOUND-001；planned EV=EV-CONTRACT-004。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-INBOUND-001 E01正式交接与独立ACK | P0 | DS-INBOUND-001：四平台verified Private、safe材料ref、actor/current/binding/mapping；完整原owner mode | 验证→claim actual commit→按AppendFact/ManifestExternalFact原mode调用owner→known finalize | 本地OwnerAccepted/OwnerRejected只按原owner结果；ACK单独记录 | owner调用顺序/参数/原op计数1；no local Turn；ACK不可进owner stage | 是；SUITE-I |
| TC-INBOUND-002 来源伪造/过期/回环 | P0 | DS-INBOUND-001：每平台签名/secret/时效/source marker、自发送mapping原例 | 逐破坏验证、伪origin、重试self-send/跨installation | 验证finite拒或原Quarantined/Blocked；不可靠接管 | zeroowner/durable raw；自报marker不被信；0真实日志材料 | 是；SUITE-I |
| TC-INBOUND-003 duplicate/变义/ACK lost | P0 | DS-INBOUND-001：相同stable source与相同/不同meaning；原claim/result或unknown | 重复E01、丢ACK再重投；barrier两个入口 | 同meaning复用原完整result；异义Conflict；unknown保持Indeterminate | owner effect计数不增；原key/op不换；ACKlost不新owner call | 是；SUITE-I |
| TC-INBOUND-004 safe ref/current缺失 | P0 | DS-INBOUND-001：verified source但无safe可恢复ref/责任来源或资格撤销 | 在claim前、owner前不同barrier撤销；执行E01 | PE::Denied/NotEstablished/Stale或Blocked，未证明不承诺接管 | preflight0claim/owner；postpossibleeffect保原unknown；日志不可含raw/正文hash | 是；SUITE-I |
| TC-INBOUND-005 Protocol continuity分支 | P0 | DS-INBOUND-001：原gap notice/namespace_stream/epoch，不是消息body | E01 Continuity record gap，再检查Protocol与Owner水位 | Open gap，owner stage不advance | zeroowner提交；协议ACK/offset不能关gap；不从空raw构造事件 | 是；SUITE-I |

#### CUT-BR-CHANGE：编辑删除线程差异

设计来源=03§8 E01/C03/§9 M04/M05/M13/M14/§15.2；对象=原mapping/source version、location/message/gap；DS=DS-CHANGE-001；planned EV=EV-CONTRACT-005。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-CHANGE-001 四平台create/edit/delete/thread | P0 | DS-CHANGE-001：原message/location mapping与可比source版本/正式owner处分 | 按capability逐转换原change，再交接原owner mode | 支持的变化沿原kind；known处分才合法tombstone | ref/action/version原样；0重造普通发言/内部delete/频道换绑 | 是；SUITE-B |
| TC-CHANGE-002 缺parent/映射/不可比 | P0 | DS-CHANGE-001：edit/delete缺message、thread/topic/root缺parent，stale/跨epoch版本 | 转换并resolve原mapping | finite NotEstablished/Unsupported或gap/incomparable按原guard | 0平台edit/delete/owner命令；Thread不得默认为Channel/root | 是；SUITE-B |
| TC-CHANGE-003 unsupported差异 | P0 | DS-CHANGE-001：Telegram无完整delete/history、MM插件能力未知、Discord/Slack method未核 | 请求不可用change/thread能力 | Unsupported或显式获准Degraded；无许可Blocked | 不伪装新消息/自动改target；实际准入未知不pass | 是；SUITE-B |
| TC-CHANGE-004 重复与变化次序 | P0 | DS-CHANGE-001：同source version duplicate、旧version晚到、原tombstone | 依comparator分别处理Equal/Before/After及重复change | Equal no-op/同key复用；Before拒；After须原权威current | 无字符串ID排序/墓碑覆盖；全部原mutation唯一 | 是；SUITE-B |

#### CUT-BR-PRESENT：安全外显与敏感Gate

设计来源=03§8 C04/E02/§9 M07/§15.2；对象=SafePresentationPlan；source/visibility/Policy/Gate refs；DS=DS-PRESENT-001；planned EV=EV-CONTRACT-006。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-PRESENT-001 C04/E02 committed安全投影 | P0 | DS-PRESENT-001：complete source/version、binding/visibility/Gate/disclosure及projection/ref | C04 prepare与E02同StableEffectIdentity竞争 | Qualified plan及同effect唯一intent；非送达 | 缺一basis不Planned；source/projection/target exact；lane Absent首建同U | 是；SUITE-A |
| TC-PRESENT-002 敏感Gate外显四授权维度 | P0 | DS-PRESENT-001：敏感审批及 existence/hint/entry/action各proof独立synthetic | 逐撤销一维，再准备和render；入口未建立 | 无许可Blocked；仅正式proof允许RefOnly/Degraded无action | payload不含敏感内容/私有URL；低敏感无默认按钮；0Gate approve | 是；SUITE-A |
| TC-PRESENT-003 uncommitted/stale/hidden source | P0 | DS-PRESENT-001：E02已接transport但owner source未committed或version/current变更 | qualify source→prepare；dispatch前重核visibility | PE::Stale/Denied/NotEstablished；无可见数据外呼 | event收到/ACK非commit；preflight0intent/send；known历史不回滚 | 是；SUITE-A |
| TC-PRESENT-004 重复/变义与原effect | P0 | DS-PRESENT-001：C04与E02同source-projection/kind/target版本及一次optional变化 | barrier同effect prepare，再以changed meaning重投原key | 唯一winner；changed meaning Conflict；不同正式语义不强行同effect | 0第二intent/lane/head；immutable target/effect不改 | 是；SUITE-A |

#### CUT-BR-ATTACH：受控附件引用

设计来源=03§8 C04/E01/§13/§15.2；对象=Artifact authorized ref/Grant、private renderer；DS=DS-ATTACH-001；planned EV=EV-CONTRACT-007。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-ATTACH-001 双向authorized ref | P0 | DS-ATTACH-001：Artifact正式准入/read/propagation/current Grant，private尺寸在预算内 | inbound附件准入→safe ref；outbound短借render/upload→drop lease | 仅获准ref进入本地protocol；private buffer不durable | 读/upload参数与原scope/ref版本一致；0bytes/hash/下载token URL出safe | 是；SUITE-A |
| TC-ATTACH-002 必要附件过期/撤销 | P0 | DS-ATTACH-001：mandatory附件expired/revoked/不可读，不存在省略许可 | prepare/dispatch前revalidate，再试省略 | Blocked/PE::Stale/Denied；0带缺附件send | 不替永久public link；owner truth和外部fileID不同；URL不日志 | 是；SUITE-A |
| TC-ATTACH-003 owner明确允许省略 | P0 | DS-ATTACH-001：optional附件与正式omission依据，其余披露current | prepare并render获准省略版本 | 仅许可材料外显；无省略依据Blocked | 原projection/effect语义跟随formal version，不静默用旧effect改材料 | 是；SUITE-A |
| TC-ATTACH-004 资源/路由/来源恶意 | P0 | DS-ATTACH-001：oversize private、redirect token URL、跨scope file ref、SDK raw error | 逐核长度/checked/route并触发download/upload失败 | finite拒/Unsupported/Unavailable；possibleeffect保原Indeterminate | 累计bytes bounded；不写temp/cache/dlq，安全错误无secret/header/path | 是；SUITE-B |

#### CUT-BR-DELIVERY：原逻辑效果与receipt

设计来源=03§8 C04/J01/§9 M08/M09/§10.3/§15.2；对象=DeliveryIntent/DeliveryAttempt/PlatformReceipt；DS=DS-DELIVERY-001；planned EV=EV-CONTRACT-008。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-DELIVERY-001 J01 A/B/C known结果 | P0 | DS-DELIVERY-001：Planned intent/full lane/RetryEligibility/current及complete original；script A/B commit Known | A reserve→B InFlight actual commit→一次dispatch→解析业务结果→C finalize | attempt KnownAccepted/KnownRejected与intent PlatformAccepted/KnownRejected按真实script结果；immutable receipt | dispatch计数1且只在B actual后；receipt/mapping/lane/result/audit全C U；platformAccepted非Delivered | 是；SUITE-C |
| TC-DELIVERY-002 J01 A/B crash/commit ACK lost | P0 | DS-DELIVERY-001：failpoint A之前/A后B前/B commit未知/B后IO未知 | 每stage单独停止/重启，再调用原operation只读恢复 | B前无dispatch；B可能committed未知保Indeterminate；无proof不继续 | same mutation/claim/fence/op；zero fresh begin/apply/send；原head阻后继 | 是；SUITE-C |
| TC-DELIVERY-003 HTTP≠平台业务接受 | P0 | DS-DELIVERY-001：四平台HTTP2xx业务error/429/timeout/known accepted独立脚本 | dispatch原attempt并解析typed result | 按KnownPlatformBusinessResult/Indeterminate；非单看HTTP | unknown无伪receipt/Linked；raw body/error不落safe；ACK不delivery | 是；SUITE-C |
| TC-DELIVERY-004 known但C finalize失败 | P0 | DS-DELIVERY-001：actual known platform结果，C wholeCAS失败/ACKlost | 保typed original known→原same-op finalize或driverprobe | known责任保留；合法known收口不再send | dispatch总计1，receipt不可覆盖；C写失败rollback全集，original未变 | 是；SUITE-C |
| TC-DELIVERY-005 不可执行/unsupported/撤销 | P0 | DS-DELIVERY-001：Planned但final current、capability/secret/allbounds任一缺失 | 在B前或IO前barrier撤销，再J01 | Blocked/Unsupported/NotDispatched仅原NoIo证明合法；可能IO为Indeterminate | 0未授权send；NoIo不NoEffect；不换target/effect/secret身份 | 是；SUITE-C |

#### CUT-BR-CALLBACK：来源认证/动作授权/one-use

设计来源=03§8 C05/E03/§9 M10/M11/§15.2；对象=ExternalActionBinding/CallbackHandoffRecord；owner action port；DS=DS-CALLBACK-001；planned EV=EV-CONTRACT-009。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-CALLBACK-001 C05初绑/E03授权交接 | P0 | DS-CALLBACK-001：known message/intent，完整ManagementBody actor/owner/action/revision/window；verified callback | C05 bind→E03 verify→actual whole claim commit→owner action→known finalize | action Claimed；Callback OwnerAccepted/OwnerRejected取原结果；ACK独立 | 只owner命令一次，不Gate approve/Decision或Runtime/Tools；C05 fresh不需未存在actionID | 是；SUITE-A |
| TC-CALLBACK-002 签名/context不授权 | P0 | DS-CALLBACK-001：合法签名但跨actor/source/target/action/revision/expired任一维度 | 每维单变异callback并execute E03 | PE::Denied/Stale/NotEstablished或原Rejected/Blocked | 0oneuse claim/owner审批；不从PAT/admin/reaction/low敏感自动许可 | 是；SUITE-A |
| TC-CALLBACK-003 两回调one-use竞争 | P0 | DS-CALLBACK-001：同action两个callback、完整current及expected；deterministic barrier | 同时verify→whole action/callback/dedup CAS；loser重投 | 仅一actualclaim/ownercall；loser OneUse/Version conflict或原重复结果 | action永不Claimed→Active；每key/claim/op不换 | 是；SUITE-A |
| TC-CALLBACK-004 owner未知/late known/回显撤销 | P0 | DS-CALLBACK-001：owner effect可能发生而timeout、后原authoritative known；current read撤销 | 保original unknown→readonly probe→合法finalize；Q读旧结果 | Indeterminate到原合法known；hidden有限Denied不出ref/count | 0reapprove；deferred/ACK不Decision/窗口续长；late known不可复活action | 是；SUITE-A |
| TC-CALLBACK-005 callback private出口 | P0 | DS-CALLBACK-001：response_url/context/token/signature内存canary，SDK异常 | verify/ACK/execute/cancel完整错误路径→所有safe出口检查 | 原finite响应，不持久private或可还原派生 | whole durable/log/trace/metric/report/wire无canary；失败仅assertion分类 | 是；SUITE-P |

#### CUT-BR-KEY：稳定key与重放/expiry

设计来源=03§11/§9 M12/§8 J05/§15.2；对象=六operation namespace/ManagementBody/DedupRecord；DS=DS-KEY-001；planned EV=EV-CONTRACT-010。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-KEY-001 六namespace计算与同义复用 | P0 | DS-KEY-001：六原namespace；C/E/J完整canonical recipe+同meaning原完整result | 计算key→fresh reserved→record result→samekey replay | same full original result/op/key；query无key | 字段顺序/type/variant/optional不丢；stable run/now/attempt不参与新business identity | 是；SUITE-C |
| TC-KEY-002 同key变义/跨域拒绝 | P0 | DS-KEY-001：同key changed ManagementBody/actor/action/version或外namespace | 逐变一meaning维度并replay | PE::Conflict语义冲突或OutOfScope；无winner敏感payload | 0fresh ID/owner/send；result/journal原值不改；不挪namespace复用 | 是；SUITE-C |
| TC-KEY-003 原记录不完整/窗口耗尽 | P0 | DS-KEY-001：Reserved/Indeterminate/Expired、payload Missing/retention过期 | replay并读current result，重新trace/轮换secret后再试 | OriginalPending/Unavailable/NotDisclosed按原basis；不fresh执行 | Expired保key/tombstone/result/unknown；无new window/预算清零 | 是；SUITE-C |
| TC-KEY-004 J05 expiry完整双key U | P0 | DS-KEY-001：目标Dedup原expected/key/op及独立Job namespace/inputexpected；expiry正式proof | qualify_expiry→whole compare target+Job→合法expire→Job result | 目标Expired仅许可guard；Job自己的result/dedup同步 | targetbusiness与Job身份不混；fullproof/current/retention来源；保key/result/unknown/head | 是；SUITE-C |
| TC-KEY-005 expiry/late result/Job旧expected竞争 | P0 | DS-KEY-001：目标unknown/late known与J05 inputexpected，barrier每个expected | 竞争维护→re投旧input expected→读取原Job结果 | 仅合法winner/Version conflict；旧Job result先复用 | 不为target取得Jobkey；不clear/复活Expired；known责任原业务收口 | 是；SUITE-C |

#### CUT-BR-CURSOR：cursor/gap分阶段进度

设计来源=03§8 J03/§9 M13/M14/§15.2；对象=StreamCursor/GapRecord/Comparator/full coverage proof；DS=DS-CURSOR-001；planned EV=EV-CONTRACT-011。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-CURSOR-001 J03 B闭gap/C新stage推进 | P0 | DS-CURSOR-001：same namespace_stream/epoch/range、formal comparator/full source coverage与stage proof | B wholecommit gap Closed→C重新读stage/currentexpected→advance After | B Closed独立；C Ready与cursor/local checked | B proof非Cproof；两commit分别report；0额外source owner effect | 是；SUITE-C |
| TC-CURSOR-002 Equal/Before/Unknown/跨epoch | P0 | DS-CURSOR-001：原opaque position、known comparator四结果与不同stage/epoch | 逐compare+advance，不字符串排序 | Equal no-op；Before/Unknown/incomparable拒；原cursor保留 | cursor_revision/local_revision不非法+1；zero owner stage complete | 是；SUITE-C |
| TC-CURSOR-003 partial/空页/计数不覆盖 | P0 | DS-CURSOR-001：Open/Probing gap，partial/empty/count/超budget/混epoch返回 | J03 probe并尝试close | Open/Probing/Manual沿原合法边；无full不Closed | range/epoch/original不变；0Cadvance；不自动raw replay | 是；SUITE-C |
| TC-CURSOR-004 B成功C失败并发 | P0 | DS-CURSOR-001：B actual Closed，C expected/stage current与并发writer冲突 | B后barrier改变cursor expected；C wholeCAS | C Conflict/Unavailable；B原Closed保存 | 不回滚B/重开假gap；C仅新qualified proof原scope，未知stage不complete | 是；SUITE-C |

#### CUT-BR-RATE：lane/限流/原retry预算

设计来源=03§8 J01/J02/§9 M15/§11~12/§15.2；对象=DispatchLane、全部shared scope/bounds、original budget；DS=DS-RATE-001；planned EV=EV-CONTRACT-012。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-RATE-001 全部shared scope协调 | P0 | DS-RATE-001：两installation共享method/global/resource/bucket、knownboundset及原fence | barrier reserve→派发；逐取max各scope与已有longer bound | 不早于最大lower bound，合法Ready/Held/Cooldown | actual shared reservation全scope保护；不能单process mutex/单频道代替 | 是；SUITE-C |
| TC-RATE-002 429/unknown bucket/值边界 | P0 | DS-RATE-001：正式Retry-After/retry_after与负/溢出/缺scope、unknownbucket | parse typed bounds→apply_bounds→eligible | 非法有限拒；unknown Blocked；更短newbound不能缩旧bound | max而非最后header；checked转换；raw header/error不证据 | 是；SUITE-B |
| TC-RATE-003 unresolved head与lease/cancel | P0 | DS-RATE-001：原lane unresolved_head、fence及超时/lease expired/cancel | 后继J01与同attempt重入，重新process/trace | 原Indeterminate保head，zero后继send | lease/cancel不NoEffect；不生成新effect/target/预算窗口 | 是；SUITE-C |
| TC-RATE-004 有权威NoEffect才retry | P0 | DS-RATE-001：同original op/effect权威NoEffect+current/附件/secret/allbounds/remaining原预算 | 先合法restore/schedule→再次派发原effect；对NotFound/NoIo反例 | 许可sameeffect retry；无证明Blocked/Indeterminate | used+1不归零，窗口不伸长；SDK隐藏retry必须关闭或准入拒 | 是；SUITE-C |
| TC-RATE-005 attempt/等待/backlog耗尽 | P0 | DS-RATE-001：approved max attempts/max wait/batch等exact/lower/upper及unknownbudget | 边界运行eligible/queued work，超预算继续请求 | budget耗尽停止自动IO/有限wait，不无限积压 | 0目标切换/跨lane总序声明；inflight/private/wait均bounded | 是；SUITE-C |

#### CUT-BR-RECOVERY：原operation权威恢复

设计来源=03§8 C06/J02/J03/J04/§9 M16/§15.2；对象=RecoveryRecord；LocalCommit/Owner/Platform/Consumer原subject；DS=DS-RECOVERY-001；planned EV=EV-CONTRACT-013。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-RECOVERY-001 C06/J02原四subject恢复 | P0 | DS-RECOVERY-001：LocalCommit/Owner/Platform/Consumer各original/authority readonly method/current | C06 request→J02读取known优先→仅原subjectprobe→合法finalize | 相应原known/Resolved只本分支权威proof | 0send/approve/newop；localcommit proof不能冒owner/platform/consumer结果 | 是；SUITE-C |
| TC-RECOVERY-002 NotFound/timeout/TTL缺证明 | P0 | DS-RECOVERY-001：每subject原Indeterminate；probe NotFound/timeout/absence/lease/过期 | 执行只读恢复并尝试continue | Indeterminate/Manual/Blocked，不能NoEffect/RolledBack | original key/effect/target/window/used不变；0fresh begin/apply或外部effect | 是；SUITE-C |
| TC-RECOVERY-003 权限/source/secret失效 | P0 | DS-RECOVERY-001：原Recovery Requested/Probing，current ref过期/撤销或readonly缺注册 | qualify/probe前barrier撤销→J02 | PE::Denied/Stale/NotEstablished及原Blocked/Manual | 0替换platform/凭证/目标；missing_source不重造正文 | 是；SUITE-C |
| TC-RECOVERY-004 known优先/late结果冲突 | P0 | DS-RECOVERY-001：已有原result及完整readbasis；收到late incompatible authority/subject | J02重复并输入错source/op/claim/revision | 原完整result复用；不匹配Conflict/InvariantViolation | immutable原result不覆写；lateknown责任保原subject；无新Recovery/effect | 是；SUITE-C |
| TC-RECOVERY-005 J04原consumer续交 | P0 | DS-RECOVERY-001：原canonical/schema/admission/op、current非递归scope与NoEffect资格 | 原known先读；只原op readonly或获准sameop交接 | 原ConsumerAccepted/Rejected按actual脚本；未知保Indeterminate | 没有第二O01/canonical/producer；ACKloss不盲重交 | 是；SUITE-C |

#### CUT-BR-LOCAL：wholeCAS及实际commit

设计来源=03§10.1~10.4/§15.2；对象=19logical collections、八repo/UoW、same driver seal/journal；DS=DS-LOCAL-001；planned EV=EV-CONTRACT-014。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-LOCAL-001 19collections完整hydrate/read | P0 | DS-LOCAL-001：19合法安全rows、stored basis/local revision/schema/完整Slots，immutable两对象local1 | 逐repo save/read/hydrate及safe result journal读取 | exact所有字段/variant/版本；receipt/audit/resultimmutable | no foreign FK/cascade/body/technical phase/view；missing字段/unknownschema不能default | 是；SUITE-L |
| TC-LOCAL-002 wholeCAS任一expected失败 | P0 | DS-LOCAL-001：19flow所有U phase writeset/关联expected，snapshot含全部rows/result/audit/claim | 逐一个readset/expected冲突，apply then commit failpoint | actualRolledBack或Conflict，zero partial | 全snapshot equality；ID/claim/fence不得逃wholedriver；owner IO不藏tx | 是；SUITE-L |
| TC-LOCAL-003 phantom/unique与首建竞争 | P0 | DS-LOCAL-001：installation/mapping/effect/source/action/key/rate唯一资源；Absent lane | barrier两个tx读相同absence→reserve/apply/commit | 一个完整winner；loser conflict，0第二effect | 全部unique/phantom保护；单行CAS过不够；whole audit/result关联 | 是；SUITE-L |
| TC-LOCAL-004 原commit ACKlost三分支 | P0 | DS-LOCAL-001：same driver/source/schema originalmutation script Committed/RolledBack/Indeterminate | commit后断回应→read_original_commit只读，逐typedproof | Committed恢复原revisions/result；RolledBack仅authorityproof；未知保unknown | 0fresh begin/apply/owner/send；NotFound不RolledBack | 是；SUITE-L |
| TC-LOCAL-005 seal/proof/current错域 | P0 | DS-LOCAL-001：wrong driver/source/schema/mutation/op/expected或fake commit plan | 尝试stage/commit/readoriginal及consume proof | PE::Denied/NotEstablished/InvariantViolation按原资格 | plan/seal非actualCommit；immutable LocalMutation种子只actual后物化；0foreign写 | 是；SUITE-L |
| TC-LOCAL-006 actual driver准入 | P0 | DS-LOCAL-001：selected actualstore具备fullCAS/unique/phantom/journal与批准隔离schema | 复用LOCAL001~005在real-seam driver跑，非fake | 真实机制断言才可actualstore证据；缺driverblocked | 不能用syntheticCommitted释放driver资格；留real proof引用不留raw rows | 是；SUITE-REAL |

#### CUT-BR-READ：纯安全Query

设计来源=03§8 Q01~Q04/§16.4/§15.2；对象=BridgeLocalView；resolver/full committed snapshot；DS=DS-READ-001；planned EV=EV-CONTRACT-015。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-READ-001 Q01~Q04完整可见投影 | P0 | DS-READ-001：四query各allowlist root/ref、qualified complete committedsnapshot/current disclosure | resolver-first→read snapshot→current revalidate→project | BridgeLocalView六字段仅Qualified/Degraded；各stage原fact | mutable/probe/ID/audit/refresh/eligible调用计数0；body/hidden ref不出 | 是；SUITE-R |
| TC-READ-002 Denied/Unavailable/absent区分 | P0 | DS-READ-001：hidden/denied、strong snapshot不足、合法可见确实absent三独立script | 逐query与原rootexecute | hidden Denied；incomplete Unavailable；authorized absent才NotFound | 不0count/emptyfake成功；拒绝无existence/scope/ref/log/audit | 是；SUITE-R |
| TC-READ-003 查询writer并发/current撤销 | P0 | DS-READ-001：合法snapshot与concurrent writer/visibility撤销barrier | read后改变current或中途版本，再project | 只有qualified完整一致snapshot可见，其他finiteUnavailable/Denied | 不跨revision拼view、不repair/stale sidecar；0owner/platformprobe | 是；SUITE-R |
| TC-READ-004 typed root/standalone plan/action | P0 | DS-READ-001：Q02完整原operation、standalone Plan/Action及其他allowlistroot；伪root/缺original | 分别合法读与wrongkind/namespace/mandatoryfield缺失 | 合法只原slice；CV/PE有限拒，不dummyintent/callback | 无metadata key/page；Q04不补canonical/O01/EV；映射cursor不写 | 是；SUITE-R |

#### CUT-BR-AUDIT：安全材料/正式consumer交接

设计来源=03§8 E04/O01/J04/§9 M17/§15.2；对象=SafeAuditRecord/SafeHandoffRecord；正式producer/schema；DS=DS-AUDIT-001；planned EV=EV-CONTRACT-016。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-AUDIT-001 actual安全材料同U | P0 | DS-AUDIT-001：BodyFreeMutationMaterial四字段、原trusted trace、actualmutationproof、mandatory注册齐 | 业务U同commit形成SafeAuditRecord；合法条件O01九字段→同consumerop交接 | auditimmutable local1；ConsumerAccepted仅actualscriptdisposition | mutation前0audit/producer；exact原schema/subject/op，无body/hash；ACK不Accepted/EV | 是；SUITE-C |
| TC-AUDIT-002 mandatory/producer/schema缺失 | P0 | DS-AUDIT-001：OwnerMandatory或SafeHandoff；正式rule/canonical/admission/producer/port逐项缺失 | preflight对应C/E/J，再试借Bus/SourceOwner/其他family | PE::NotEstablished/Denied，mutation/IO前阻 | 0durablemutation/外部effect/伪producer；staticmap无Bridges不填名字补准入 | 是；SUITE-A |
| TC-AUDIT-003 E04非递归反馈 | P0 | DS-AUDIT-001：originalcanonical/op/schema/source及NonRecursiveResultOnly wholeCAS | 消费匹配原actualresult；重复与crossop/source/schema反例 | 匹配合法原handoff/resultonly；不匹配Conflict/Denied | 0新auditcanonical/producer/O01；同原consumerop/payload，不自报Accepted | 是；SUITE-C |
| TC-AUDIT-004 J04 unknown/known/NoEffect | P0 | DS-AUDIT-001：原handoff actual可能已交，脚本known/NotFound/NoEffect current分别 | known优先readonly，只有正式sameop资格才续交 | known原ConsumerAccepted/Rejected；unknown保Indeterminate/Blocked | 0新canonical/key/op；ACK丢不盲retry；blocked lateknown不造非法边 | 是；SUITE-C |
| TC-AUDIT-005 预算/expiry/安全backlog | P0 | DS-AUDIT-001：approved retention/backlog/wait，currentadmission撤销或满预算 | 尝试queued handoff/read/retry；safe failure分类 | 有限Blocked/wait/Indeterminate保责任 | 不无限积压/body dlq/log substitute；Q04 no-write，真实consumer未成立不reportaccepted | 是；SUITE-C |

#### CUT-BR-CONFIG：完整配置consumer及错误

设计来源=04§7/9/11/12.2；03§13；对象=82项/20域/22CF/27F/CFG-CUT-001~012；DS=DS-CONFIG-001；planned EV=EV-CONTRACT-017。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-CONFIG-001 CFG-CUT-001严格lexical/schema | P0 | DS-CONFIG-001：全部20域82key及strictJSON，1MiB/depth32/数组累计1024边界 | 每key删除/unknown/duplicate/错型/null变异；资源exact和±1 | 合格完整parse；非法exit2且不吐raw | 全部82key实例；0default/merge/ENV补字段；JSON UTF-8/limitchecked | 是；SUITE-B |
| TC-CONFIG-002 CFG-CUT-002 enum/numeric/selector | P0 | DS-CONFIG-001：十branch/四platform/八mode/五环境，五数值hardrange与selector原grammar | 穷举合法enum，非法variant；lower/exact/upper/overflow、@0/错kind/len超 | 静态合法或exit2；未经actualprofile批准exit3 | 五tuple范围沿04；selector ASCII exact不latest；不建立authority | 是；SUITE-B |
| TC-CONFIG-003 CFG-CUT-003来源/三entry参数 | P0 | DS-CONFIG-001：七bin，04仅三CLI/ENV允许项；同值/异值/重复/无路径 | 解析entry；validate-only；Jobsref尝试生成context | finite退出0/2/3原合同；validate-only零业务 | zero listener/secret resolve/Command/Job；CLI/ENV冲突不优先override | 是；SUITE-I |
| TC-CONFIG-004 CFG-CUT-004 required/profile/环境 | P0 | DS-CONFIG-001：每branch/19callable/hostactual required并集及5env | 逐缺一required/null/多余或跨env/fixture在prod | exit3资格拒；静态错exit2；无实际success | 未消费seam才nullable；actualscopeexact；不从bin名启动 | 是；SUITE-B |
| TC-CONFIG-005 CFG-CUT-005 installation/C01 | P0 | DS-CONFIG-001：每安装七draft字段、namespace集合/修订与DB/config双轴 | missing/duplicate/mismatchedplatform/revision后load与C01 | load零DBwrite；C01只批准的新revision整体接纳 | 不能file读即CAS/activation；unknownsame driver；空安装不暗启 | 是；SUITE-A |
| TC-CONFIG-006 CFG-CUT-006 four source/mapping/ACK | P0 | DS-CONFIG-001：四adapter actualcontext、family/mode/sourcegroup registration | 双source及Telegram整体updates/Discordcallback排他变异 | CF08~11 wrongstatic/qualification有限拒；不双开 | ACK不Turn/owner/delivery；statecursor/capability不造平台truth | 是；SUITE-B |
| TC-CONFIG-007 CFG-CUT-007 secret/private | P0 | DS-CONFIG-001：exact5purpose/provider/key/revision/scope/window/route与buffer预算 | 逐错purpose/撤销/轮换/latest/env/raw/私有URL | exit3/currentDenied/Stale/NotEstablished；禁rawparse | finalIO前重核；0fallback/debug/copy/durable；validated-only不解析 | 是；SUITE-P |
| TC-CONFIG-008 CFG-CUT-008 owner/附件/Gate/Workspace | P0 | DS-CONFIG-001：sixowner接口需求及actualprojectionconsumer | 逐缺owner资格/必要附件expired/Gateproof/selectedWorkspace null | CF13/14有限拒；未选Workspace不强制 | externalID不GlobalMember；无permissionfallback；不绕WS十二open | 是；SUITE-A |
| TC-CONFIG-009 CFG-CUT-009 rate/retry/cursor/retention | P0 | DS-CONFIG-001：原used/window、完整allbounds/sameepoch/fullcoverage及expiryproof | 逐CF18~20 negative/不同realm值及current漂移 | failclosed等待/manual/blocked；没有授权默认预算 | 不缩maxbounds、renewwindow/used、不gapfakeclose/TTLpurge | 是；SUITE-C |
| TC-CONFIG-010 CFG-CUT-010 mandatory/material/EV | P0 | DS-CONFIG-001：actualproducer/schema/rule/nonrecursive/registered consumer | 逐CF15/16缺失、冒family、材料敏感字段 | mutation/IO前拒；原resultonly才成立 | 不新producer/假evidence；fixedsafeexports，所有禁材出口扫描 | 是；SUITE-C |
| TC-CONFIG-011 CFG-CUT-011 cold/rollback/shutdown | P0 | DS-CONFIG-001：candidate与currentrev、oldunknown、approvedclock/window/resource tuple | 候选验证→冷停止→C01新revision语义回退；stop时重建budget | candidate不publish，original不改；checked同tuple/unknown并集 | CFG-03-001 begin_shutdown exact两个参数；seed不Active TTL/无hotfallback | 是；SUITE-W |
| TC-CONFIG-012 CFG-CUT-012 Query/drift/leak/CF-F全集 | P0 | DS-CONFIG-001：Q01~04/safe diagnostics及原22CF/27F每行脚本 | 每CF/F分别变异→load/currentIO/read→safe检查 | 逐原04§9.3/11.1 expected finite；无资格Blocked | 至少CF22/F27各全部实例；0Querywrite/probe/ID/audit、hidden存在性不出、诊断不含值 | 是；SUITE-B |

#### CUT-BR-PRIVATE：private/secret/所有禁材出口

设计来源=03§13~15；04§8；对象=owning/短借、exact五用途provider/key/revision/scope/window；DS=DS-PRIVATE-001；planned EV=EV-CONTRACT-018。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-PRIVATE-001 合法owning/短借/5purpose | P0 | DS-PRIVATE-001：approved refs/route/current及有界syntheticmaterial lease | 按原purpose resolve→shortborrow IO→drop，取消分支 | 只privateboundary使用，合法safe转换不带材料 | 禁止Debug/serde/clone进durable/trace；drop不宣zeroize | 是；SUITE-P |
| TC-PRIVATE-002 所有禁止材料出口 | P0 | DS-PRIVATE-001：body/attachment/rawerror/token/OAuth/privatecallback/Gate/rawmetadata内存canary | 分别注入每producer/error/SDK Debug/返回值/driverstage→检查wire/durable/log/trace/metric/handoff/report | 每出口仅safeallowlist；发现仅有限ForbiddenMaterial分类 | 任何raw/canary/base64/hex/正文hash或可还原派生出现即阻归档；不echo内容 | 是；SUITE-P |
| TC-PRIVATE-003 secret版本/撤销/无fallback | P0 | DS-PRIVATE-001：旧refexactprovider/key/revision/purpose/scope/window，旋转后旧current失效 | finalIO前revalidate；尝试latest/env/APIKey/KMS/providerfallback | Denied/Stale/NotEstablished；不变旧attempt身份 | 0IO/替账号/secretmaterial持久；原ref不日志/证据 | 是；SUITE-P |
| TC-PRIVATE-004 buffer/wait/路由checked | P0 | DS-PRIVATE-001：多个privateborrow总bytes、oversize/overflow/redirect不同来源 | 累计预算边界、wait超时、route/profile错域 | finite拒/停止等待；possibleeffect保unknown | 无tempfile/cache/dlq/detached；捕获producer自动instrument不得留raw | 是；SUITE-P |
| TC-PRIVATE-005 失败安全留存自检 | P0 | DS-PRIVATE-001：synthetic错误会携privatebuffer，writer/checker/failure reporter各路径 | 诱发失败并输出安全assertion token；检验已有safeartifact是否保留 | fail且仅finite分类；不泄漏或制造替passed | unvalidatedcandidate无durable写；已安全文件不删/不dump；无真实材料使用 | 是；SUITE-P |

#### CUT-BR-ENTRY：api/jobs/worker运行资源

设计来源=03§7外层/§8 J/§9 M18~M21/§15；04§12 CFG-CUT-011；对象=七bin/19callable、RuntimeExecutionState/JobInvocationState/SourceSession/WorkerBatch；DS=DS-ENTRY-001；planned EV=EV-CONTRACT-019。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-ENTRY-001 七bin trusted入口/19callable | P0 | DS-ENTRY-001：approved profile/完整required，七bin各合法命令/原Jobcontext | entry解析/admission→execute原C/Q/E/J；worker/jobs同library | 只有actualdispatcher事实才推进phase；有限响应 | bin不授branch；exactargs/context/source校验先行；0phantom scheduler/newop | 是；SUITE-I |
| TC-ENTRY-002 source排他与session连接 | P0 | DS-ENTRY-001：fourplatform/family/source/mode/epoch完整；Telegramupdates共享group | connect→dispatch→disconnect/rotate；双mode竞争 | 仅一Active；实际disconnect/NotEstablished，旧epoch保gap | 无双开/字符串sessionsequence当businesscursor；owningreplylease不逃宿主 | 是；SUITE-W |
| TC-ENTRY-003 singleinflight/batch/cancel | P0 | DS-ENTRY-001：ownedplan集合与batch/inflight预算，原unresolved | take/dispatch/return正确plan；错return/双take及shutdowncancel | M19/M21原合法phase；取消StoppedWithUnknown/CancelledLocal保原集 | 没有detached/privatecapture；CompletedLocal需实际result+无unresolved/收齐 | 是；SUITE-W |
| TC-ENTRY-004 stop-time newbudget成功 | P0 | DS-ENTRY-001：Active启动seed早于stop，实际同域clock+批准window/四resource tuple | stop时checked now+window→新RuntimeExecutionBudget→begin_shutdown→recordlocalstop | Draining到实际StoppedLocal或StoppedWithUnknown | 窗口基于actualstop非startupTTL；四tupleexact/unknown并集；原budget只guard全部过才替换 | 是；SUITE-I |
| TC-ENTRY-005 shutdown/clock/profile失败 | P0 | DS-ENTRY-001：missing clock/profile、wrongdomain、overflow、tuple任一不等或非法phase | 构造新budget失败或begin_shutdown guard失败 | CV::InvalidValue/InconsistentFields/OutOfScope等原guard；阻新IO保unknown | 原objectexact不变；0伪deadline/StoppedLocal/NoEffect，隔离或cancel仍保原责任 | 是；SUITE-I |
| TC-ENTRY-006 Job selection与实际summary | P0 | DS-ENTRY-001：J01~J05 fulltypedinput/selector/expected/current；actualsummary合法或missing | eligible candidate→原invoke→into_parts→workerrecordreturned | actualsafe summary才CompletedLocal；无结果/原unknown不得completed | selection非authority；保持original op/key/subject，Q不eligible；所有5Job实例 | 是；SUITE-J |
| TC-ENTRY-007 entry ACK/error/posteffect | P0 | DS-ENTRY-001：verified source与owner/IO各phase；badversion/transport/SDKerror脚本 | API private ACK/deferred与business各自执行，超wait/cancel | 运输finite响应不表示Owner/Platform/Consumer success | finite原03§11外层映射；rawerror/canary不出，possibleeffect携original unknown | 是；SUITE-I |

#### CUT-BR-STATE：全部状态pair与guard

设计来源=03§9/§16.6/§15.2；对象=M01~M21；PlatformReceipt/SafeAuditRecord immutable、View无机；DS=DS-STATE-001；planned EV=EV-CONTRACT-020。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-STATE-001 全部150allowedpairs/101labels | P0 | DS-STATE-001：M01~M21合法factory/Domainfullhydrate；来源guard齐 | 按state pair designregistry逐调用具名member、记录before/after；technical只from_parts | exact原To及对应revision/field candidate变化 | 150pair全部instances=123durable+27technical；factory不计；same-U persistence另LOCAL | 是；SUITE-D |
| TC-STATE-002 未列pair/无genericsetter | P0 | DS-STATE-001：21机全有限state/可调用member组合，合法完整basis | 从每From调用原member验证非法目的边，结合publicsurface检查无任意set_state | 未列pair不能达；CV原guard拒或publicAPI不可表达 | 每未列From/To具参数记录；不得用testbackdoor genericsetter；失败exact不变 | 是；SUITE-D |
| TC-STATE-003 逐guard负向/版本overflow | P0 | DS-STATE-001：各pair每required/current/ns/expected/window/source/mandatory条件单变 | 一次破一guard并call；local/config/generation/lane/cursor checkedoverflow | 原CV/PE finite，zero候选变更/IO | deep原全objectequality；无dirtymutation后返回Err；sourceprotocol/state名字逐字 | 是；SUITE-D |
| TC-STATE-004 immutable/无机/技术不durable | P0 | DS-STATE-001：receipt/auditlocal1、View投影、四technicalfrom_parts初态 | 尝试重复不一致append/hydrate缺basis或wire泄露technical；publicsurface静态检查 | immutable conflict；View无mutablepersist/状态setter；technical不能rehydrate | 19Domain/17durable+2immutable，不第20durable；0technicalrepo/audit副作用 | 是；SUITE-D |
| TC-STATE-005 unknown/终态非法复活 | P0 | DS-STATE-001：action Claimed/Expired/Revoked、mapping终态、Expireddedup、Blockedhandoff等原终态 | 重试/lease/TTL/cancel→原member，不新key/target | 原非法边拒/unknown保存，exact原stage | 不通用SuccessState、StoppedKnown/Reservedattempt/Validmessage等别名 | 是；SUITE-D |
| TC-STATE-006 非法构造/completeSlot | P0 | DS-STATE-001：19model factory/hydrate的state-requiredSlots及technicalfrom_parts | 逐缺statebasis/requiredpayload/wrongkind/schema/revision | 原CV::MissingRequired/WrongKind/InconsistentFields等 | 合法sourcefixture不能dummy、0/空占位；hydration≠current资格 | 是；SUITE-D |

#### CUT-BR-EVIDENCE：测试工具/证据真实性

设计来源=03§15脚本边界；00 AC037/038；测试规范§4.6/5.13；对象=local test-harness DTO/runner/report writer；不增加production协议；DS=DS-EVIDENCE-001；planned EV=EV-CONTRACT-021。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-EVIDENCE-001 真实runner索引闭环 | P0 | DS-EVIDENCE-001：synthetic安全case/suite/context DTO及安全stdout/stderr非JSONblob | 模拟runner实际caseoutput→minimalindex→validatedEVpage→handoffdraft | 真实实例由真实output推导；planned不能实例化passed | schema/run/revision/config/mode/caseinstance/digest关联exact；不自动verdict | 是；SUITE-TOOLS |
| TC-EVIDENCE-002 schema/漏case/伪pass | P0 | DS-EVIDENCE-001：missing/unknown/duplicatefields，not_run/plannedcase被改passed、参数缺实例 | 逐变一DTO字段或status；check-test-evidence再report | 有限schema_invalid/coverage_incomplete/result_inconsistent拒归档 | 0伪case/EV成功页；suiteexit非0与casepassed矛盾必须拒，blocked不能skip后pass | 是；SUITE-TOOLS |
| TC-EVIDENCE-003 digest/run/path混用 | P0 | DS-EVIDENCE-001：wronghash、跨run/config/revision、absolute/.. /symlink/duplicateartifactid/自引用摘要 | 篡改safeartifact/index或报告路径再read | digest_mismatch/baseline_mismatch/path_invalid拒 | reader计算sha256对象字节/typedcanonical；无latest；不能引用别run旧passed | 是；SUITE-TOOLS |
| TC-EVIDENCE-004 redaction/失败/unavailable留存 | P0 | DS-EVIDENCE-001：synthetic敏感canary及中断/工具缺失/IO失败 | writer前allowlistcheck；checker后failure分类，resume原run | fail/blocked/unavailable只安全分类，已有safeartifact/report不丢 | 拒候选不durableraw；不dumpcanary/原error，不生成passed/errorfreepayload | 是；SUITE-TOOLS |
| TC-EVIDENCE-005 最小shell到最终EV防漂移 | P0 | DS-EVIDENCE-001：同run shell index和后续case/suite/canonicaldigtuples | 更新完成状态后最终构建；重复生成相同run再读 | finalEV引用真实caseinstance+suiteartifact，无shell被当最终EV | 四成熟度区分；TC refs具体数组，不能'全部P0'；humanhandoff非signoff | 是；SUITE-TOOLS |

#### CUT-BR-REAL：actual seam准入与四平台兼容

设计来源=03§14~17；04§14/平台核验附录；对象=core/SDK compile、六owner/Bus、四platform、DB/executor/secret/producer；DS=DS-REAL-001；planned EV=EV-REAL-001。

| 用例ID/场景 | 优先级 | 数据前置 | 输入/操作 | 预期结果 | 明确断言点 | 自动化/primarysuite |
|---|---|---|---|---|---|---|
| TC-REAL-001 manifest/编译资格 | P0 | DS-REAL-001：actual implementation repo/manifest/package/features/pin/qualifiedSDK存在并批准 | 只核core唯一path/export及SDKtransitiveApplication/Domain/Infra/Bus，实际编译证据待授权 | 缺任一blocked；实际结果才compile-seam证明 | owner/Bus非Cargo path；core根../quantalithos-core/crates/contracts/core-contracts/core_contracts；不默认轻client | 是；SUITE-REAL |
| TC-REAL-002 fourplatform scoped正向 | P0 | DS-REAL-001：每平台真实sandbox安装/账号/scope/current版本/capability/安全testtargets、secretrefs已获准 | 逐平台approvedinbound/outbound/change/thread/attachment/callback/knownreceipt与恢复seam | 平台独立原typed结果及资格材料；任何未核平台blocked | 非4/4默认；不真实正文/token留存；平台ACK/ownercommit/receipt仍独立 | 是；SUITE-REAL |
| TC-REAL-003 六owner/Bus正式consumer | P0 | DS-REAL-001：被选branch正式schema/source/责任/producer/current/非递归准入及安全case | 各实际port消费原typed材料，producer/consumer原op回链 | actual接受只原disposition；缺WS/affected资格blocked | 不写owner私表或占位owner；未选Workspace/Bus不强制；12affected原状态不关闭 | 是；SUITE-REAL |
| TC-REAL-004 actualstore/executor/clock | P0 | DS-REAL-001：selected DBdriver/actualsame-driver journal/phantom/fence；scoped非Sendexecutor/clockdomain | 实际运行LOCAL与ENTRY相应参数、boundedcancel/shutdown | 机制成立才准入；fake或未知providerblocked | 无detached/leaseNoEffect/手写Committed；脚本run需真实source/版本 | 是；SUITE-REAL |
| TC-REAL-005 OAuth/APIKey/KMS/route产品复核 | P0 | DS-REAL-001：真实grant/method/scope/provider/currentref/revision/route/pin审核材料 | 验证revoke/rotation/wrongpurpose/expiry/source/route前置，不输出凭证 | 资格不足blocked；只有获准exactseam IO | 不编假account/token；配置引用不真实secret，publicdoc读取非installationproof | 是；SUITE-REAL |
| TC-REAL-006 权威readonlyprobe/ratelimit | P0 | DS-REAL-001：每method的actualsame-op probe/comparator/全bucketbounds/approvedwindowbudget | sandbox制造可安全对账失败，probe/read实证；缺method资格不触发effect | known合法收口或原Indeterminate/Manual，缺资格blocked | NotFound/429/5xx/超时不NoEffect；不自动re-send真实消息 | 是；SUITE-REAL |
| TC-REAL-007 准入不足保护性拒绝 | P0 | DS-REAL-001：每provider/selectedowner/platform/producer缺资格一维；有完整syntheticnegative但非actualpositive | real gate preflight，记录finiteblocker并保existing安全output | blocked/unavailable非pass，受影响AC not_evaluated | 不静态表制造report/receipt/EV/signoff/readiness；当前全部actual运行权限false | 是；SUITE-REAL |

### 7.3 总审查

22cut的116TC已逐cut写入并核行列/编号/DS/suite/EV及原phase后停审；source→scenario→assertion→DS→suite→plannedEV闭合。20协议含O01条件输出无entry、19flow、21机/immutable/view、12CFG/22CF/27F、四平台/六VETO全部有参数族；具体实例全集缺任一即blocked。

[状态pair设计登记](05_test_plan_state_pair_registry.json)是本Step从正式03§9机械精确抽取的21机/101labels/150pair及原member/guard/commit/非法错误，status=planned；不是run/evidence。源excerpt SHA256独立于03其他章反校准。未列pair候选=375，测试原member和publicsurface禁止genericsetter，而非新增set_state API。每guard反例仍按原typed来源构造；actual persistence与qualification另验证。

Step5回填实际TC数组；plannedEV每cut唯一，实例必须真实TC/suiteartifact支持。表行数不是运行覆盖；本步没有执行编译、测试、平台调用或生成artifact。

### 7.4 逐切口用例批次索引

所有批次已完成设计审查（不等执行结果）；当前TC/DS/EV均planned。

| 切口 | 具体TC数组 | 数据前置 | primarysuite集合 | plannedEV |
|---|---|---|---|---|
| CUT-BR-SURFACE | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004 | DS-SURFACE-001 | SUITE-S、SUITE-D、SUITE-C | EV-CONTRACT-001 |
| CUT-BR-BIND | TC-BIND-001、TC-BIND-002、TC-BIND-003、TC-BIND-004 | DS-BIND-001 | SUITE-A | EV-CONTRACT-002 |
| CUT-BR-MAP | TC-MAP-001、TC-MAP-002、TC-MAP-003、TC-MAP-004、TC-MAP-005 | DS-MAP-001 | SUITE-A | EV-CONTRACT-003 |
| CUT-BR-INBOUND | TC-INBOUND-001、TC-INBOUND-002、TC-INBOUND-003、TC-INBOUND-004、TC-INBOUND-005 | DS-INBOUND-001 | SUITE-I | EV-CONTRACT-004 |
| CUT-BR-CHANGE | TC-CHANGE-001、TC-CHANGE-002、TC-CHANGE-003、TC-CHANGE-004 | DS-CHANGE-001 | SUITE-B | EV-CONTRACT-005 |
| CUT-BR-PRESENT | TC-PRESENT-001、TC-PRESENT-002、TC-PRESENT-003、TC-PRESENT-004 | DS-PRESENT-001 | SUITE-A | EV-CONTRACT-006 |
| CUT-BR-ATTACH | TC-ATTACH-001、TC-ATTACH-002、TC-ATTACH-003、TC-ATTACH-004 | DS-ATTACH-001 | SUITE-A、SUITE-B | EV-CONTRACT-007 |
| CUT-BR-DELIVERY | TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005 | DS-DELIVERY-001 | SUITE-C | EV-CONTRACT-008 |
| CUT-BR-CALLBACK | TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-CALLBACK-005 | DS-CALLBACK-001 | SUITE-A、SUITE-P | EV-CONTRACT-009 |
| CUT-BR-KEY | TC-KEY-001、TC-KEY-002、TC-KEY-003、TC-KEY-004、TC-KEY-005 | DS-KEY-001 | SUITE-C | EV-CONTRACT-010 |
| CUT-BR-CURSOR | TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004 | DS-CURSOR-001 | SUITE-C | EV-CONTRACT-011 |
| CUT-BR-RATE | TC-RATE-001、TC-RATE-002、TC-RATE-003、TC-RATE-004、TC-RATE-005 | DS-RATE-001 | SUITE-C、SUITE-B | EV-CONTRACT-012 |
| CUT-BR-RECOVERY | TC-RECOVERY-001、TC-RECOVERY-002、TC-RECOVERY-003、TC-RECOVERY-004、TC-RECOVERY-005 | DS-RECOVERY-001 | SUITE-C | EV-CONTRACT-013 |
| CUT-BR-LOCAL | TC-LOCAL-001、TC-LOCAL-002、TC-LOCAL-003、TC-LOCAL-004、TC-LOCAL-005、TC-LOCAL-006 | DS-LOCAL-001 | SUITE-L、SUITE-REAL | EV-CONTRACT-014 |
| CUT-BR-READ | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004 | DS-READ-001 | SUITE-R | EV-CONTRACT-015 |
| CUT-BR-AUDIT | TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005 | DS-AUDIT-001 | SUITE-C、SUITE-A | EV-CONTRACT-016 |
| CUT-BR-CONFIG | TC-CONFIG-001、TC-CONFIG-002、TC-CONFIG-003、TC-CONFIG-004、TC-CONFIG-005、TC-CONFIG-006、TC-CONFIG-007、TC-CONFIG-008、TC-CONFIG-009、TC-CONFIG-010、TC-CONFIG-011、TC-CONFIG-012 | DS-CONFIG-001 | SUITE-B、SUITE-I、SUITE-A、SUITE-P、SUITE-C、SUITE-W、SUITE-J | EV-CONTRACT-017 |
| CUT-BR-PRIVATE | TC-PRIVATE-001、TC-PRIVATE-002、TC-PRIVATE-003、TC-PRIVATE-004、TC-PRIVATE-005 | DS-PRIVATE-001 | SUITE-P | EV-CONTRACT-018 |
| CUT-BR-ENTRY | TC-ENTRY-001、TC-ENTRY-002、TC-ENTRY-003、TC-ENTRY-004、TC-ENTRY-005、TC-ENTRY-006、TC-ENTRY-007 | DS-ENTRY-001 | SUITE-I、SUITE-W、SUITE-J | EV-CONTRACT-019 |
| CUT-BR-STATE | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | DS-STATE-001 | SUITE-D、SUITE-I、SUITE-J、SUITE-W | EV-CONTRACT-020 |
| CUT-BR-EVIDENCE | TC-EVIDENCE-001、TC-EVIDENCE-002、TC-EVIDENCE-003、TC-EVIDENCE-004、TC-EVIDENCE-005 | DS-EVIDENCE-001 | SUITE-TOOLS | EV-CONTRACT-021 |
| CUT-BR-REAL | TC-REAL-001、TC-REAL-002、TC-REAL-003、TC-REAL-004、TC-REAL-005、TC-REAL-006、TC-REAL-007 | DS-REAL-001 | SUITE-REAL | EV-REAL-001 |

## 8. 回填草稿

正式§6装配执行共同合同和逐cut完整矩阵；局部停审只留§10。正式§5随后回填实际TC；不把planned数据或EV写成已运行。

## 9. 待确认事项

20协议/schema/state/CF/F参数全集不能以表行数当执行覆盖。actualseam计划在REAL中保blocked；驱动/clock无核资格，不伪造NoEffect/停止完成。

## 10. 自检与进入下一步条件

Step9套件审查发现原先以cut首target作default会把KEY/DELIVERY流程放S/A、部分Worker/Jobguard放API；现只修TC的primarysuite及host/M参数路由，沿原11target，不新增跨module测试依赖或改变断言。STATE M20/M21的纯载体成员在Worker W，不在B，B只验驱动差异。修后再实际复核。

实际恢复记录：状态未列pair数量在机器检查中为375，已纠正草拟389；Step5“用例候选”广匹配真实exit1未写，改具名表头后成功。均未推进或伪装运行结果。Case registry是design-only planned，不是实际artifact。

实际自检：116唯一TC/22cut/22唯一planned EV与Step5全120源ID具体TC数组互查；21机101labels/150pair+375未列候选精确sourcehash校验，跨phase/状态/禁材断言逐cut复核。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step07_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
