# L6-bridges 03 Step6：逐模块对象实现契约

2026-10-03受权修订说明：用户已同意Step9定位的十三项合同最小修订。shared/domain/application原拥有卡新增notice meaning、三独立snapshot、完整platform probe载荷、Gap.attach_recovery及正式非递归观测资格；不增19Domain对象/17业务机。原409等统计与停审门禁均为当时checkpoint，当前修订状态/来源/实际重审见[repair记录](03_ddd_step_09_contract_repair.md)，唯一恢复点为项目台账/03 flow。未改正式03、外部owner或产品资格。

## 1. Step状态、开工确认与内计划

2026-10-03；full-restart / single-agent-serial。用户授权“现在开始，完成全部step6”。只当前对象契约/附录、03 flow和项目台账；不执行Step7、不装配正式03。

| 开工项 | 实际记录 |
|---|---|
| 恢复 | 项目台账 -> 03 flow -> Step5及Step4类型路径索引；新增授权覆盖旧停点，Step5历史记录不改 |
| 通用纪律 | 通则§1；中间产物§3.4.3~3.4.7/3.5.1~3.5.2/5.5.1；真相源§2.2/2.2.1/3.1~3.2复核；全局依赖沿Step3/5已读裁剪，无新增依赖 |
| SOP/书写 | 详细SOP Step6全文；书写§4.3/5.5；设计Rustdoc中文，未来源码Rustdoc英文 |
| 前序 | Step5已读范围及恢复补读；02六对象附录、243索引、02 Step9各对象允许/禁止边；Step4唯一文件归属 |
| 框架参考 | Governance Step6§1~10.2、GovernanceContext卡、visibility卡、§17~20及状态审计；不宣8096行全文已读，不复制truth/产品/依赖决定 |
| owner复核 | SDK03§7.3；Conversation03§7.4；Identity01§4；Governance03§7.1/7.2；Artifact03§6~8；Workspace03§1~3/开放项；Observability03§1/2及实施门禁/affected原状态 |
| 真实shared | core actor.rs全文、metadata基础值及Request/Command/Query/Page实际字段；四既有重导出不复制schema |
| 范围基线 | 307既有文件SHA-256只读快照，含Bridges/规范/参考/owner/其他dirty；最终除本flow/项目台账外核不变 |
| 权限 | 当前agent独立串行，无代理/并行调用；手工编辑apply_patch；无实现、项目测试、证据或commit |

### 写入批次状态表

| 批次 | 覆盖范围 | 思考 | 写入 | 内容完整 | 停审 | 后续 |
|---|---|---|---|---|---|---|
| B0 | 骨架/顺序/非core决定计划 | done | done | 是，仅骨架 | pass_structure_only | G0 |
| G0 | shared vocabulary/ref/state来源 | done | done | 是，基础形态/来源规则 | pass | C |
| C | contracts载体/Slot/state/view/稳定结果 | done | done | 是，302定义及10完整协议body明确defer | pass | D1 |
| D1 | domain U1五配置/绑定/mapping | done | done | 是，含Pending激活/完整hydrate | pass | D2 |
| D2 | domain U2 inbound | done | done | 是，完整required/原op恢复/ACK分离 | pass | D3 |
| D3 | domain U3 plan/intent/attempt/receipt | done | done | 是，同effect/typed结果与NoIo证明 | pass | D4 |
| D4 | domain U4 action/callback | done | done | 是，one-use原op与失败入口分离 | pass | D5 |
| D5 | domain U5 dedup/cursor/gap/lane/recovery | done | done | 是，gap窗口欠缺/unknown head/Unresolved闭口 | pass | D6 |
| D6 | domain U6 audit/handoff | done | done | 是，immutable安全历史/actual canonical交接 | pass | A |
| A | application private/snapshot/helper | done | done | 是，17既有内部载体/稳定helper闭口 | pass | I |
| I | infra adapter/runtime/store边界 | done | done | 是，4平台/6owner/required-seam/runtime/store | pass | P |
| P | api entry/ACK/result | done | done | 是，入口/private ACK/current runtime | pass | J |
| J | jobs bounded invocation/result | done | done | 是，五动作/原主语/op/取消边界 | pass | W |
| W | worker source/session/schedule | done | done | 是，mode/epoch/qualified候选/原unknown | pass | X |
| X | 字段/状态/传递类型/范围跨审与停审 | done | done | 是，来源/读取面/状态/23port/范围闭环 | pass_design_static_only | wait_user |

### 模块执行顺序表

| 顺序 | 模块 | 职责 / 来源 | 完成后停审点 |
|---|---|---|---|
| 0 | shared基础 | Step4/5、core真实export、02索引 | 唯一kind/shape/来源规则 |
| 1 | contracts | Step5 M1及02索引/U6 | 每传递类型定义或明确defer |
| 2~7 | domain U1~U6 | Step5 M2、六对象附录/02状态表 | factory/字段/transition/required guard |
| 8 | application | Step5 M3、23port责任 | stable/private/visibility/result唯一 |
| 9 | infra | Step5 M4、四平台六owner | 无虚构API/产品资格 |
| 10 | api | Step5 M5 | entry不直调repo/domain，Query零写 |
| 11 | jobs | Step5 M6 | 原subject/op复用、取消非无效果 |
| 12 | worker | Step5 M7 | worker -> jobs单向，无第二writer |
| 13 | 跨审 | 所有当前对象卡 | 三层Step6停审，用户授权才Step7 |

### 非core对象闭口决策计划

| 模块 | 当前Step6必须闭口 | defer内容 / 理由 | 承接Step |
|---|---|---|---|
| application | 五private/九snapshot/三internal、operation/stored-result/visibility/job assembly | 19用例callable与23port须先有载体 | 7/8/9 |
| infra | config/required seam/availability/builder、adapter/store/private状态 | 具体SDK/HTTP/DB/Bus/KMS client和foreign方法须真实核验 | 7/11/14及04 |
| api | trusted entry、ACK与safe disposition | route/HTTP、完整C/E/Q DTO、deadline | 7/8/9/14 |
| jobs | 五动作、trusted invocation、bounded/cancel/result | CLI映射、J协议、eligible读取与事务链 | 7/8/9 |
| worker | source模式/epoch/session、candidate/item/shutdown | subscription/poll/runner trait与transport产品 | 7/8/9/14 |

## 2. 本步输入与唯一来源

直接输入为当前00/01/02和Step3~5；旧README/正式03仅historical_material。243索引是使用集合，不是schema上限。BridgeLocalView唯一在contracts/views.rs，SafePresentationPlan唯一在domain既有文件。七专项首次00~07阅读沿台账，本轮只复核§1实际范围，不冒称全文重读。

BR-UP-001~009=open，010=reference_only；WS-UP/WS-LOCAL及Observability十二affected不关闭。PS-01~14沿登记，没有新网络/installation/pin/账号核验。

## 3. SOP问题回答

### G0 Shared基础问题回答

1. shared必须先收敛：locators跨四平台、refs跨七module、qualification/current snapshot跨domain与ports、阶段结果跨entry与query。唯一主定义沿Step4路径，不在每个U重复造型。
2. 本地对象ref用独立named wrapper；foreign safe ref用exact-kind、owner、版本、scope、期限与来源的结构。两种identity不混用，qualified字样不表示本地constructor授权限。
3. actor/metadata只重导出core；真实ActorRef包含可选display_name，持久化/输出前清除，只保actor_id/kind。role_refs只hint；CommandMetadata.reason/external_ref不能直接进证据；Query key必须None。
4. 采用共享Slot三分支表达未建立/已建立/失效；执行状态必须Established且当前port再次证明有效，Missing/Stale都拒绝。none/not-applicable/unknown另用具体enum，不以空String替代。
5. enum精确PascalCase与02 snake_case标签1:1；只关闭对象成员迁移边，完整触发/事务/非法矩阵留Step10。时间、revision、generation、position、key/effect不同类型。

### C Contracts问题回答

1. capability为safe locator、explicit basis、原op/effect、current qualification、有限结果/state/Slot、只读view、bounded job结果；核心metadata仍唯一reexport。
2. named local ref承接Application generated/store identity；named authority ref承接正式来源指针；具体qualified carrier同时给target/generation/action/window与所需refs，不能只有String或bool。
3. 同义Slot用QualificationSlot alias闭口，明确alias展开及state-required消费；附件none、父级root、NotFound、结果unknown另定义，不误用Missing。
4. Command/E/Q/J完整request/envelope尚未执行Step8；明确逐名称defer，当前对象factory不依赖未定义协议。稳定BridgeCommandResult/ReadResult/consume/job结果现在闭口，不defer。
5. BridgeLocalView不能接Application snapshot产生反向依赖；contracts factory只收已过滤字段，Application负责snapshot解读和visibility；否定结果隐藏subject/ref/count，不以空view冒充不可用。

### X 跨模块问题回答

1. 按字段来源、factory覆盖、传递类型、状态required、读取面和依赖方向分别检查；对象名覆盖不能替代这些闭环。19Domain模型加唯一Contracts view仍为20业务模型，support卡不新增truth或入口。
2. 837个具名字段与tuple/alias/enum载荷、1582个公开函数声明统一反查类型；六core名称只真实reexport。10个完整protocol-body保留逐名defer，但当前factory/member不依赖未定义的DTO。
3. 字段private时必须有当前可用的typed读取面，不能让兄弟模块/其他crate直接读字段或在Step7临时发明getter。稳定safe字段只借用；五private和回复context保call lifetime，raw只由具名受限seam借用。
4. 17业务状态机逐对象对照02允许边与shared exact标签；Slot/owner pending/protocol ACK/commit/consumer/entry phase是不同语义，不能合为成功。immutable receipt/audit及唯一view不加状态机。
5. 八repository、十四资格/交接/材料/secret port和一个LocalUnitOfWork共23个逐名交接；本地读写与actual proof必须成对，port名称不证明foreign API。required branch和owner允许省略有明确来源，未选择Workspace不成为全局强前置。
6. 本Step只关闭对象shape、纯成员及安全材料边界。真实权限、source能力、current解引用、driver/transport/SDK兼容继续blocked；设计静态审计不是编译、平台测试、验收或readiness。

## 4. 当前材料问题诊断

Step5是capability/文件/归属，不是schema。02 factory省略id/version/state-required输入属于概要深度；本Step必须显式闭口。safe ref不授权；类型形态和真实执行资格分开。稳定载体不能一律defer。

G0诊断：4个core名称能复用，但只用名称会漏display_name/role hint与自由reason的材料风险；ref-only若只有String会隐藏owner/kind/expiry；所有Option都合缺失会丢stale与明确无附件/无父级含义。必须用共同结构和exact wrapper修正，不能将各owner truth本地化。

C诊断：243索引还有protocol-body名称和5private/9snapshot，不能全放public。current资格要固定原target/source/action/revision而非持有ref就许可；View若收ExistingLocalSnapshot会违反compile图。更正为contracts过滤后的fields factory，内部snapshot仍Application。

X诊断：初次静态检查确有相邻表格渲染错误；字段表/函数表以空行拆开。四处来源误写不存在的HandoffRepository，现回归SafeTraceRepository的既有本地audit/handoff/result责任，不增加第24port。Application defer删去通用BridgeApplication服务暗示，仍为原19用例及仓内导出。155个safe字段组缺具名读取面，已补590个只读getter；raw验证/回复仍只有三个新增受限借用方法，不使用通用raw getter。两处enum成员补中文Rustdoc表；runtime/job/session/batch四类phase限定factory初态、具名成员和合法阶段来源/去向，取消/停止集合不以空输入清unknown。新写主表的E04名称和测试路径在反查时归回Step4/5既有责任，没有新增文件。以上均为原能力的对象契约闭口，不改前序正式结论。

## 5. 改动前后及历史差异

先独立推导，X来源/状态/交接结论形成后才定点扫描README和旧正式03。它们仍historical_material，不恢复输入或写入资格。

| 历史位置 | 冲突或缺口 | 当前独立裁定 / 处理 |
|---|---|---|
| README§仓属性/关键依赖，行10/50~52 | Python主+TS Slack SDK、external_id与GlobalMember直接同映射 | Rust2024七role；真实core reexport/SDK conditional；三typed mapping与正式责任链分开，不自动创建GlobalMember；历史不改 |
| README核心映射，行37~42 | Conversation/Turn/GateCard/GlobalMember与平台对象按单行等价 | typed safe refs、显式relation/原source与两端mapping，不拥有两边truth；Gate披露与action授权分开；历史不改 |
| README安全，行110~111 | API Key走KMS、OAuth优先/API Key fallback作为既定选择 | 只opaque provider/key/version/用途/scope/route引用；KMS/OAuth/API Key/provider仍not_selected，按adapter/config/secret seam重核；历史不改 |
| 旧03§1/§2.2/末结论 | BridgeRequest等多泛化truth及intake/mapping/delivery/recovery/diagnostics五链；含bus/capability-hub/sync/archive等泛依赖 | 当前00~02六U/20模型/19入口/17业务机；七owner专项runtime/event资格；不继承旧truth/编译边或通用replay/repair服务 |
| 旧03§5.4，行552~615 | free String result/ACK/timeout/duplicate摘要，投送与ACK笼统写一次save | exact有限carrier与局部stage；actual业务receipt/owner/consumer结果分开，staged/committed与unknown原op恢复分开；不接旧实现片段 |
| 旧03§9.3，行1335~1342 | 外置大payload/receipt及诊断cache持久化笼统建议 | raw消息/secret/敏感审批不持久化/日志/证据；只safe refs及授权local记录；snapshot/view不新建镜像truth，private限call借用 |

仅记录上述本Step有关冲突；不声称本轮历史全文已校准或所有风险关闭，也不回写旧README/正式03。

## 6. 设计取舍与写入许可

B0采用主文件管计划/收敛/跨审，当前Step附录按模块/对象组展开。未采用巨表代独立卡，未照搬Governance truth/产品/worker-jobs互禁/英文设计Rustdoc。批次不限制最终内容长度。

G0选择：使用少量可复用基础carrier、named ref与typed Slot；未采用每ref复制六字段（会产生版本/期限漂移），也未用泛型Any/String或marker自认证。只有基础载体允许通用结构，domain具体对象和资格输入仍逐一闭口。三层当前G0思考done，允许基础卡；不写trait/protocol/flow。

C选择：公共基础/newtype、有限enum、explicit qualified struct、少量typed container各按独立卡闭口；同形Slot用exact alias，不复制状态机。未采用万能Envelope/通用OpaqueRef授所有权；未机械把结果/view/job推Step8。C思考done，仅允许本组卡，19请求族签名留Step7/8。

X选择：本主文件收跨模块来源/状态/23port/runtime/正反例与后续精确defer，五附录保唯一独立卡；不改为全局对象大表。字段继续private，通过typed getter消费；不靠pub字段、Debug/serde或“到实现时补”消除读取缺口。稳定pure shape当前close，调用/协议/事务/产品核验分交Step7~16及04；BR-UP未释放时正向执行始终fail-closed。

## 7. 结构化中间产物与复杂度

### 7.1 Shared vocabulary收敛
| 类型组 | 正式计划归属 | 全局先收敛理由 | 后续使用 / 真相上限 |
|---|---|---|---|
| core ActorContext/ActorRef/CommandMetadata/QueryMetadata，追加真实TraceId/IdempotencyKey | contracts/shared/metadata.rs重导出 | 无第二metadata定义 | actor hint和请求metadata不是authority |
| LocalObjectId/LocalRefToken与named local refs | contracts/shared/locators.rs | 安装namespace与local kind隔离 | Application技术id source/已提交store重建，不让Domain/API mint |
| SafeOpaqueId/SafeRevision/SafeScopeRef/SafeAuthorityRef | contracts/shared/authority.rs | 外部ref必须带owner/kind/version/scope/期限/来源 | owner/qualified adapter输入；结构校验不授业务权 |
| SafeInstant/SafeValidityWindow | contracts/shared/authority.rs | current expiry必须可比较且clock来源明确 | Application注入受信clock，过期即时拒绝，不等job |
| QualificationSlot<T>及各Slot aliases | contracts/shared/outcomes.rs及既有责任文件 | Missing/Established/Stale不可默认互换 | snapshot/current核验后才消费，公开read仍过滤 |
| ConfigRevision/BindingGeneration/LocalRevision/CursorRevision/LaneRevision | 原索引对应文件 | CAS轴不混position/key/version | 从store/授权变化来源，不从clock/external_id派生 |
| BodyFreeOperationMeaningRef/StableEffectIdentity | contracts/shared/operation.rs | C04/E02共义唯一及原op恢复 | canonical安全结构，不hash body/trace/time |
| State/Stage/Outcome各有限enum | 对应shared责任文件 | domain与entry/read使用同exact标签 | 17业务stateful主语，ACK/commit/owner/platform/consumer绝不合并 |

基础卡见[shared contracts](03_ddd_step_06_shared_contracts.md)。具体对象各回模块，不引入owner compile边。G0完成前只写本基础，C会继续该附录。

### 7.2 Contracts
[Contracts对象卡](03_ddd_step_06_shared_contracts.md)§1~18已闭口本组基础、local/authority refs、qualified carriers、17state enum、revision/metadata、逐族meaning、key/epoch/comparator/coverage、claim/rate/recovery、secret、exact Slots、独立阶段、stable结果与唯一view。C批次结束时302定义（含6core reexport），后续模块补充shared后的当前总数312；无重复，字段传递类型只读闭包核对无缺；10完整protocol-body逐名称defer；17Application载体和唯一Domain Plan已由当前对应模块承接。公开函数Rustdoc标记已在X静态复核。

C自检完成后进入D1；原op/effect只存身份不嵌完整meaning，避免结果环；管理action/parent/原message/source/known-result与callback opaque owner语义ref不得省略。C04/E02用同一DeliveryOperationMeaning，不以入口差异造新effect。缺safe callback语义ref合同仍BR-UP-003，不向owner发明API。

### 7.3 Domain
[Domain对象卡](03_ddd_step_06_domain_contracts.md)D1~D6已逐组自检：19独立模型、17业务state主语、完整factory/rehydrate/typed pure members；receipt/audit immutable。补充local_revision、配置basis/原claim、Gap窗口Slot/tracking operation、Lane unresolved_head、恢复Unresolved和读取披露规则，均属原能力支撑，不新增业务truth或foreign compile边。每状态边按02来源逐条消费，完整触发/事务矩阵仍交Step10/11。

### 7.4 Application
[Application对象卡](03_ddd_step_06_application_contracts.md)已闭口五private/九snapshot/三既有internal、private回复上下文、读取basis、prepared mutation/result/observation规则、失效/visibility/原result复用helper。local insert用Absent条件而非伪造revision0；只有actual提交才构造commit proof。既有19用例及仓内facade导出/23port callable精确defer到Step7/8/9，不新增通用service对象，stable carriers不推后。

### 7.5 Infra
[Infra对象卡](03_ddd_step_06_infra_contracts.md)已闭口四平台/六owner独立adapter-local对象、source排他family、RuntimeRequiredSeams/availability/composition/预算/宿主phase和store/probe同源binding。实际产品client、trait impl、foreign callables/driver细节按名称交Step7/11/14/04，缺required不启动，当前不声明operational。

### 7.6 API
[入口对象卡](03_ddd_step_06_entry_contracts.md)§1闭口C/Q trusted context、AdmittedForDispatch有限处置、private PlatformEntryCall及实际ProtocolAckExecution；Query零副作用，handler/wire/HTTP defer Step7/8/14。

### 7.7 Jobs
[入口对象卡](03_ddd_step_06_entry_contracts.md)§2闭口JobInvocationPlan/Subject/State，continuity新增JobSubjectRef承接J05 installation/binding等维护；取消不消除原unknown，完整J/CLI/callable明确defer。

### 7.8 Worker
[入口对象卡](03_ddd_step_06_entry_contracts.md)§3闭口source session/epoch欠缺、safe event entry、qualified candidate与有界batch/退出；只worker -> jobs library，断开/停止不伪造coverage/no-effect或新operation，协议/runtime callable明确defer。

### 7.9 字段来源跨审

本表是对象组闭环结论，不替代逐卡字段表。所有constructor只结构接纳；authority/current proof来自正式port，local proof来自actual store/UoW，safe字段的typed getter不扩大任何执行或披露资格。

| 高复用字段 / 对象组 | 当前已闭口来源与进入面 | 必填 / 派生和读写裁定 | 后续承接 / 实现暂停条件 |
|---|---|---|---|
| LocalObjectId、LocalRefToken、named local refs | Application技术ID源或该kind实际store，namespace完整；专门factory接纳，不由external_id/body/time/trace生成 | 每对象identity必填；各token读取面只关联；不许Domain/API/repository save mint | Step7逐kind身份工厂调用/技术provider；Step11同UoW唯一；ID来源未核不得创建 |
| SafeAuthorityRef及named authority wrappers | exact owner/kind/id/scope/source/revision/window六字段；正式结果转换或safe store重建；各authority读取面 | 任意String/合法shape都不授权；来源、期限、撤销必须当前可解引用；无safe语义ref的callback保持blocked | Step7 owner读面/current核验；Step8拒绝wire自授权限；BR-UP-001~006不关 |
| revision/generation/fence | Config/Binding/Cursor/Lane/local各自store轴；构造初始1、checked successor；owner revision仅判等 | Absent表示新对象，Present表示既有CAS；ExpectedLocalRevisionSet完整覆盖write set；外部position不是revision | Step7八repo读写；Step11原子CAS/driver parity；Step13fence/唯一；缺轴不能默认0 |
| ActorContext/core metadata、trusted contexts | core真实actor/metadata reexport；入口认证来源、原trace、producer/consumer/job context分别输入；actor与metadata分开 | display_name全部None含delegated_by；role_refs只是hint；required写key只一份；Query key=None；reason/external_ref不进材料 | Step7 metadata_validation/source入口；Step8四入口族；不能从payload/external account伪造actor |
| U1 config/relation/三mapping | 安全配置basis、原两端typed locator、正式target/actor、明确方向动作及generation；Mapping/Installation实际一致读 | 配置资格不激活relation；Pending激活用BindingActivationQualification，新代际与原两端一致；mapping不是平台/Identity真相 | Step7 Binding/Actor/Config及两repo；Step9 C01~03/J05；BR-UP-002/003/007/008 |
| U2 inbound/source/origin/material | PlatformIngress实际验证；verified source/marker与safe source version；current mapping/target mode/actor、owner material/digest/附件资格 | source/body只private借用；required digest不能由raw-body hash补；edit/delete/reply必有适用原mapping；self-send由verified关系证明，不相信自报marker | Step7 Ingress/Conversation/PrivateMaterial/Mapping/Inbound；Step8 E01；BR-UP-001/004/008/009 |
| U3 plan/immutable target/effect/receipt | 正式committed source/projection、current披露/Gate/附件/method资格，C04/E02共同DeliveryOperationMeaning；actual业务结果才receipt | source/target/plan/effect不可在retry换义；Blocked plan不建可派发intent；unknown无新locator/receipt；known rejection不自动no-effect | Step7 Presentation/Delivery/repo；Step9 C04/E02/J01；BR-UP-003/004/007~009 |
| U4 action/one-use/owner result | 原intent/known message/source、正式actor/target/action/owner revision/expiry/action授权；verified callback仅来源起点 | action语义仅owner safe ref，不存敏感approve/reject正文；one-use同原op；claim/record/dedup同UoW先durable再owner IO | Step7 Callback/Actor/OwnerAction/repo；Step9 C05/E03；BR-UP-002/003/008/009 |
| meaning/key/stored result | finite族configuration/binding/mapping/source/delivery/action/recovery/handoff/qualification；六dedup namespace与获准scope隔离；actual原result读取 | 稳定安全结构判等，不hash private正文/token；result必须原meaning/op/effect；duplicate仍current read过滤但不再外部IO | Step7 Continuity/result_mapping/UoW；Step11/13 canonical编码/唯一；缺原结果保持unknown，不能换key |
| cursor/epoch/comparator/coverage/gap | stage+stream+namespace+原epoch；实际decoder与authoritative comparator/coverage；GapRange及original tracking op完整 | protocol source位置/安全接管/owner提交/外部送达阶段分开；缺position用Uninitialized，缺恢复窗口用RecoveryWindowRefSlot；保原范围而不吞gap | Step7 Continuity/AuthoritativeRecovery；Step10~13；BR-UP-008/009未释放不推进 |
| claim/lane/rate/retry | 原attempt/effect/fence、受限scope/dependency、actual reservation/commit来源；逐bucket/method/resource/global所有下界及预算/window | constructor不造durable claim；网络前另核actual commit/fence；释放claim不清unresolved_head，未知head阻后项；NoIoProof不同于NoEffectBasis | Step7 Lane/Delivery/Config/Platform；Step11/13跨lane原子下界；SDK隐式retry不得绕过 |
| config/secret/private材料 | OpaqueSecretBindingRef完整provider/key/version/用途/scope/route；PrivateMaterial/SecretResolution实际provider借用；五private+reply context | 不以配置值/URL/token替ref；raw只有本次call受限borrow，无Debug/Clone/serde/Display/Error-source/durable/cache/detached task；drop不宣zeroize | Step7 lifetime/取消/buffer owner；Step14/04产品核验；BR-UP-007，轮换/撤销每IO再核 |
| staged write/result/audit/conditional handoff | Domain纯候选、ExpectedLocalRevisionSet、PreparedStoredResultSeed及MutationObservationRequirement；actual canonical/schema/admission才可准备handoff | Prepared不是Committed；subject/dedup/result/audit/条件canonical同UoW；mandatory缺失先阻相关mutation/IO，不造empty canonical；audit不自称evidence | Step7 LocalUoW/SafeObservation/SafeTrace；Step11/15；Observability十二affected保持原状态 |
| 九snapshot/local hydration | 八named repo actual一致读取、LocalSnapshotReadBasis及LocalHydrationBasisRef；原revision/原result/full read条件 | repository重建不授执行权；snapshot不是public wire或owner mirror，Missing/NotFound不证rollback/no-effect；已有safe lookup不触发private解析 | Step7读写成对/Step11driver证明；查不到actual依据继续unknown或finite unavailable |
| view/visibility/count/原result复用 | CurrentReadQualification含subject/ref/stage/count允许集合；Application result_mapping.rs的LocalViewProjector/StoredResultReusePolicy | 唯一BridgeLocalView在contracts/views.rs，factory只收已过滤字段；subject可见不推所有ref/stage/count可见；否定结果隐藏不可见指针 | Step7 SafeReadQualification及repo read；Step8 Q/结果；Step9 Q零write/audit/dedup/refresh/probe/repair |
| 四platform/六owner adapter与runtime | 逐平台context、逐owner binding、同store/probe binding；RuntimeRequiredSeams消费真实selected source/version/current qualification | 无owner Cargo边/实体镜像；branch缺required不得启动，NotSelected/NotEstablished不宣operational；Workspace条件消费与Observability mandatory分开 | Step7 adapter mapping；Step11driver；Step14/04 SDK/OAuth/API Key/KMS/router等not_selected/not_established |
| API/Jobs/Worker入口 | trusted actor/core metadata、qualified mode/source/session/epoch、原JobSubjectRef/op、candidate与bounded budget/current scope | ACK计划与实际回复结果分开；J05可维护installation/binding，不伪造intent；worker只调用jobs library，不成第二writer；取消不清原unknown | Step7入口/eligible读取/宿主；Step8 C/E/Q/J；Step9/14；缺信任来源或候选资格不执行 |

复杂度裁定：基础ref/Slot/同型adapter context只共享shape，不共享授权或业务状态。辅助getter保持字段私有；named local ref继续专门token/authority/value/summary读取面，raw不适用通用getter。409定义包含支持类型，不代表409业务对象；19Domain+唯一view、19入口、23port、17业务机未增加。

### 7.10 状态闭环跨审

state标签唯一在Contracts；迁移只由Domain typed成员执行，guard失败零修改，内存候选须同UoW CAS提交才成为local truth。本表逐主语覆盖，完整trigger/并发/非法矩阵仍留Step10，不预执行该Step。

| 状态主语 / enum | factory初态 | 已闭口成员与允许边摘要 | required-by-state / 终态与特殊状态 | 后续 |
|---|---|---|---|---|
| BridgeInstallation / BridgeInstallationState | configure -> Configured | record_qualification、block、suspend、restart_configured、retire承接02全部边；apply_revision不暗中激活 | Configured资格Missing；Qualified须current完整config/capability/route/secret Established；Suspended/Retired阻新IO，Retired无回边 | C01/J05；Config/Installation；Step10/11/14 |
| ExternalBinding / ExternalBindingState | propose -> Pending | activate: Pending/Suspended -> Active；suspend、revoke、expire | Active actor/basis两Slot Established且新generation/current动作成立；Pending不要求已有Active资格；Revoked/Expired终态 | C02/J05；Binding/Mapping；Step10/13 |
| ExternalIdentityMapping / IdentityMappingState | link -> Valid | invalidate -> Stale；Valid/Stale revoke -> Revoked | 完整账号kind/正式ActorRef/代际/basis；Stale不得消费，Revoked无回边；external_id不创建GlobalMember | C03/J05；Mapping/Actor；Step10 |
| ExternalLocationMapping / LocationMappingState | link -> Valid | invalidate -> Stale；Valid/Stale revoke -> Revoked | required parent必须Established；NotApplicable只source明确root；Stale/Revoked不解析新target | C03/J05；Mapping；Step10 |
| ExternalMessageMapping / MessageMappingState | link_known -> Linked | invalidate -> Stale；Linked/Stale record_tombstone -> Tombstoned | inbound actual OwnerAccepted，outbound actual known effect/result；origin/basis完整；unknown不建Linked，Tombstoned无回边 | C03/E01/J01/J05；Mapping；Step10 |
| InboundHandoffRecord / InboundHandoffState | from_verified -> Verified | block/quarantine；begin_handoff到HandoffPending；apply_owner_result到OwnerAccepted/OwnerRejected；mark_unknown到Indeterminate；原op no-effect才续交 | HandoffPending前mapping/mode/actor/material/source全部Established、digest Established或正式NotRequired；owner结果Pending仅同态，不混protocol ACK；Quarantined及known终态无通用restore | E01/J02；Inbound/Conversation；Step10~13 |
| SafePresentationPlan / PresentationState | prepare -> Qualified/Degraded/Blocked，由current资格推导 | invalidate到Stale；block到Blocked；没有恢复原plan为Qualified的边 | Qualified/Degraded projection/disclosure及附件授权必齐；None附件只正式空集；Degraded须明确无action安全外显授权；Stale/Blocked不派发 | C04/E02/J01/J05；Presentation；Step10 |
| DeliveryIntent / DeliveryIntentState | from_plan -> Planned | claim到Dispatching；apply_receipt已知accepted/rejected；mark_unknown；schedule_retry到RetryWait；block/unsupported；restore_planned仅原效果无IO/no-effect | 原target/effect/plan不变；RetryWait必须真实no-effect及RetryEligibility Established；Indeterminate只权威finalize或有据same-effect retry；accepted/rejected/unsupported终态 | C04/E02/J01/J02/J05；Delivery/Lane；Step10~13 |
| DeliveryAttempt / DeliveryAttemptState | claim_for -> Claimed | begin_io到InFlight；record_result到KnownAccepted/KnownRejected；mark_unknown；record_not_dispatched | Claimed须原claim/attempt/window；已出IO未知不以lease失效判NotDispatched；已知结果result_slot Established；NoIoProof精确原attempt；known终态不复活 | J01/J02；Delivery/AuthoritativeRecovery；Step10~13 |
| ExternalActionBinding / ExternalActionState | bind -> Active | claim_once到Claimed；expire/revoke只Active出口 | source/actor/target/action/owner revision/expiry/action授权必齐；Active claim Missing，Claimed one-use Established且原op不变，无Claimed -> Active | C05/E03/J05；Callback/OwnerAction；Step10/13 |
| CallbackHandoffRecord / CallbackHandoffState | from_verified -> Verified | begin_handoff到OwnerPending；block/reject；apply_owner_result到OwnerAccepted/OwnerRejected；mark_unknown到Indeterminate | Verified action/verification/owner_action三Slot Established；Pending one-use Established且actual提交先于IO；owner_result初始Missing，known终态Established；未知只能原owner op对账，不重claim | E03/J02；Callback/OwnerAction；Step10~13 |
| DedupRecord / DedupState | reserve -> Reserved | attach_result到ResultRecorded；mark_unknown；Indeterminate权威attach_result；expire到Expired | 原namespace/key/meaning/op/effect固定；ResultRecorded原safe result Established；Expired保未知effect/gap安全tombstone，不删除key后重执行 | 所属C/E/J；Continuity/UoW；Step10~13 |
| StreamCursor / StreamCursorState | initialize -> Ready或Incomparable | advance同Ready；mark_incomparable/lose_comparator；block；requalify_same_epoch | Ready有当前comparator，初始position可Uninitialized且不能造coverage；advance需同stage/stream/epoch/full coverage/CAS；换epoch不跨比较，旧gap保留 | E01/J01/J03/J05；Continuity；Step10~13 |
| GapRecord / GapState | detect -> Open | begin_probe: Open/Manual -> Probing；close -> Closed；retain_uncovered -> Open；require_manual | Open保原range/tracking op，窗口可Missing；Probing窗口/comparator/recovery完整；Closed actual full coverage Established，部分覆盖不关闭；Closed无回边 | C06/J03；Continuity/AuthoritativeRecovery；Step10~13 |
| DispatchLane / DispatchLaneState | for_scope -> Ready | claim -> Held；release -> Ready；apply_bounds -> Cooldown；block；finish_cooldown/restore_ready | Held claim Established；claim释放不清unresolved_head，Ready不是越unknown许可；Cooldown全bucket/method/resource/global等待满足；无声明平台全局顺序 | J01/J02/J05；Lane；Step10~13 |
| RecoveryRecord / RecoveryState | request -> Requested，resolution_kind=Unresolved | begin_probe: Requested/Manual/Blocked -> Probing；resolve -> Resolved；block/require_manual | Probing current资格Established且原subject/op/effect一致；Resolved只known finalize、完整coverage或合格same-effect retry；Unknown/Unavailable/Manual不能Resolved；Resolved不等外部送达 | C06/J02/J03；AuthoritativeRecovery/Continuity；Step10~13 |
| SafeHandoffRecord / SafeHandoffState | from_canonical -> Pending | begin_handoff到Dispatching；apply_consumer_result known；mark_unknown/block；resume_pending受权原no-effect | actual canonical/admission/schema/window必齐；Dispatching claim Established；consumer_result初始Missing，known终态Established；Blocked/Indeterminate重交不得换material/op或凭timeout；consumer accepted非evidence | J04/E04/J02；SafeObservation/SafeTrace；Step10~13/15 |

| 非独立业务机的状态族 | 主语 / 稳定carrier | 当前语义及禁止合并 | 后续 |
|---|---|---|---|
| immutable receipt | PlatformReceipt / KnownPlatformBusinessResultKind | from_known只actual业务结果；含可选no-effect依据但不凭Rejected推导；无state/setter | Step7/11actual result来源 |
| immutable audit | SafeAuditRecord / SafeStageReason | from_mutation候选同UoW后才actual；只安全历史，不造evidence/report/verdict | Step7/11/15 |
| qualified read | BridgeLocalView / SafeStageSlice / ViewFreshnessKind / BridgeReadResult | 不自带机；有限Denied/Unavailable/Qualified，stage字段显式分local commit/owner/platform/consumer，不作GlobalSuccess | Step7/8/9/16 |
| qualification maintenance | QualificationSlot、特殊Digest/Locator/Position/RecoveryWindow Slots | Missing/Established/Stale、NotRequired/NotApplicable/Uninitialized不互换；失效不通用复活；维护归既有19编排 | Step7/9/10/14 |
| prepared/committed local mutation | PreparedLocalChange/PreparedResultPayload vs LocalCommitDisposition/CommittedLocalMutationRef | 前者候选不是提交；Unknown无Committed/rollback proof，权威同mutation读取才finalize | Step7/11/12 |
| protocol ACK | ProtocolAckPlan / ProtocolAckExecution / ProtocolAckDisposition | 计划、actual reply发送、local安全接管和owner业务commit完全独立；token deadline只protocol | Step7/8/9 |
| runtime/entry/job/source phase | RuntimeAvailability/RuntimeExecutionPhase、ApiEntryDisposition、JobInvocationPhase、SourceSessionPhase、WorkerBatchPhase | 只宿主当前有限phase，不是18~22业务机；取消/断连/StoppedWithUnknown保原op/effect/gap；AdmittedForDispatch不等业务成功 | Step7/9/14 |

各状态持久化读写须同一exact标签，current失效可先即时阻IO再由J05记所属局部状态；不得用后台迟到放行。需要真实store反查的历史state可重建但不能恢复authority。跨阶段unknown分别保存local/owner/platform/consumer身份，不能由Entry ACK或safe view统一推断。

### 7.11 Step7逐名称承接

严格沿Step5§7.4.5的23个既有名称和十个责任文件。下表只锁定Step7必须消费的当前对象/读写/authority/错误责任，不写trait签名或伪造owner同名API。八repository由同一个qualified local store适配，safe audit/handoff/result读写均属SafeTraceRepository，没有HandoffRepository或额外rate-limit port。

| 既有port / 定义责任文件 | 必须承接的当前对象与输入 | Step7必须关闭的读取 / 写入 / 结果责任 | authority、失效、known/unknown和暂停条件 |
|---|---|---|---|
| BindingQualificationPort / binding.rs | ExternalBinding、BindingActivationQualification、CurrentBindingQualification、两端target/actor/actions/expected generation | Pending/Suspended激活依据与Active执行依据分入口；current scope/action/revoke/expiry读取；不grant权限 | actor/target/basis正式合同；exact同binding/generation；缺口finite blocked，不能要求Pending已有Active；BR-UP-002/003 |
| MappingRepository / binding.rs | 三mapping、ExternalBinding、AuthorizedMappingSnapshot/Context、LocalHydrationBasisRef/expected CAS | 受权namespace/account/location/message双向lookup；relation/mapping完整重建及CAS；失效/tombstone；原known结果读取 | local relation不拥有actor/channel/Turn；edit/delete/reply缺原mapping拒绝/quarantine；Missing不可猜目标；C02/C03 mutation和原结果原子性Step11 |
| InstallationRepository / binding.rs | BridgeInstallation、InstallationSnapshot、ConfigRevision/LocalRevision、InstallationConfigDraft | config/current revision/资格Slot一致读，configure/apply/suspend/retire CAS；专门identity factory输入来源 | 配置接受不证明provider可用；Config Missing/Stale不运行；raw config/secret值禁止入store；BR-UP-007 |
| PlatformIngressPort / inbound.rs | PrivateIngressContext、QualifiedIngressContext、VerifiedPlatformSourceRef/OriginMarker、IngressVerificationResult/ProtocolAckPlan | 四平台实际source/mode验证，safe locator/change/source-version转换、anti-loop来源；private ACK计划与actual reply分开 | verifier原raw借用只本次call；签名/HTTP ACK不授内部权、不证owner commit；缺source/epoch/window保gap或blocked；BR-UP-008/009 |
| ConversationHandoffPort / inbound.rs | InboundHandoffRecord、CurrentMaterialQualification、BridgeTargetMode/ActorRef、原operation、owner required digest及TransientQualifiedMaterialHandle | qualified same-op owner handoff；实际accepted/rejected/pending/unknown返回；权威原result读取面与safe source版本 | owner正式决定internal Conversation/Turn；不能发明submitTurn/participant；missing digest不hash body补；owner unknown不以平台ACK收束；BR-UP-001 |
| InboundRepository / inbound.rs | InboundHandoffRecord/InboundSnapshot、OriginalOperationRef、ProtocolAckDisposition、OwnerHandoffResultRef | safe durable接管与原result阶段读写，record/dedup/claim/result关联CAS及hydrate；ACK独立字段 | 已接管不等owner提交；local ACK lost交actual commit probe；unknown不建消息回链、不重解析private；BR-UP-001/009 |
| PresentationQualificationPort / delivery.rs | SafePresentationPlan、CurrentPresentationQualification、committed source/projection、DisclosureQualification/AttachmentGrantSet/capability | current外显/Gate/附件/method与原plan版本核验；明确获准Degraded或finite Blocked/Unsupported；safe source读取 | source owner/Governance/Artifact决定，Workspace仅选用时追加safe provenance；低敏感label不批准；降级无交互敏感正文；BR-UP-003/004/005 |
| PlatformDeliveryPort / delivery.rs | 原AttemptEffectRef、DispatchEligibilityRef、PrivateQualifiedPayload/SecretHandle、immutable target/change/dependency | 四platform按method发送/编辑/删除/线程/附件引用；actual业务结果/locator/no-effect/limit/unknown转换；禁隐藏retry | 最后current核验/fence/预算；HTTP 2xx不等业务receipt；known rejection不默认no-effect；每bucket/resource/global下界完整；BR-UP-007~009 |
| DeliveryRepository / delivery.rs | plan/intent/attempt/receipt、DeliverySnapshot、StableEffectIdentity、ExpectedLocalRevisionSet | 原source-target-effect唯一及C04/E02共同结果lookup；intent/attempt CAS、immutable receipt append/读取；attempt/claim/result原子关联 | store proof不造platform accepted；unknown只原op/effect权威finalize；既有J01不创建新intent；BR-UP-009；Step11/13 |
| CallbackVerificationPort / callback.rs | PrivateCallbackContext、QualifiedCallbackContext、CallbackVerificationRef、原source binding | 四platform签名/安装/nonce/deadline/actor/source/message/target安全验证；finite失败与verified record分开 | signature非内部授权；callback敏感语义只owner safe ref，缺合同blocked而不保存选择正文；expired/tampered/replayed/cross-target不得造Verified；BR-UP-003/008 |
| ActorResponsibilityPort / callback.rs | core ActorRef、ExternalIdentityMapping、ActorResponsibilityRef、OwnerActionQualificationRef/current target | resolver-first human/Integration/AI责任及delegation读取；current actor/action/scope依据；不创建GlobalMember | Identity仅正式AI锚点，外部human account需正式安全来源；external_id/display_name/roles/PAT不授actor权；revoke/expiry即时拒绝；BR-UP-002 |
| OwnerActionPort / callback.rs | OwnerTargetActionRef、CurrentActionQualification、原owner revision/op/one-use、OwnerActionResultRef | owner二次验证实际动作交接与原result读取；owner accepted/rejected/pending/unknown；不直接改Decision | Governance owning Policy/Gate/target/action/revision/expiry授权；claimed原op不重claim；结果未知只same-op probe；safe action ref未建立不调用；BR-UP-003/009 |
| CallbackRepository / callback.rs | ExternalActionBinding、CallbackHandoffRecord、CallbackSnapshot、OneUseClaimRef/dedup/result | source/action binding lookup与原owner result；claim_once/record/dedup同UoW；完整CAS/hydration及expiry维护 | Claimed终态不复活；actual durable claim先于owner IO；初始验证失败不造one-use/owner op效果；local unknown只原mutation probe |
| ContinuityRepository / continuity.rs | DedupRecord/StreamCursor/GapRecord/RecoveryRecord、ContinuitySnapshot、typed namespace/key/meaning/epoch/range | 六namespace唯一与原result读取；cursor stage/CAS、gap保留/full coverage、原subject recovery局部写读；保未知tombstone | key到期不默认重执行，position不可比不推进；epoch改变不跨比较；Missing/NotFound不证no-effect；BR-UP-009；Step11/13 |
| AuthoritativeRecoveryPort / continuity.rs | OriginalOperationEffectRef、RecoveryQualificationRef、AuthoritativeProbeResultRef/ProbeOutcome、NoEffectBasis/NoIoProof/full coverage | 精确original local mutation/owner/platform/consumer的只读权威probe，known finalize/no-effect/coverage/unknown分支 | 不发送新effect；local probe同driver/schema；租约、日志、HTTP status或NotFound不是证明；缺authority/window/comparator -> manual/blocked；BR-UP-001/003/008/009 |
| LaneRepository / continuity.rs | DispatchLane/LaneSnapshot、FencedClaimRef/unresolved_head、QualifiedRateLimitBoundSet/RetryBudget | 同scope顺序/dependency/head一致读；原子claim/fence/CAS及known release；跨lane共享bucket下界合并读写 | Ready不能越unknown head；释放lease不证明无IO；所有有效下界取最大且不能缩短；fake不能证明全局协调；BR-UP-008/009 |
| SafeObservationPort / traceability.rs | MutationObservationRequirement/MandatoryObservationQualification、BodyFreeMutationMaterial、canonical/schema/admission、原handoff op/result | 正式producer准入/安全canonical生成资格，受限交接及actual consumer disposition/原result读取 | mandatory缺资格先阻相关mutation/IO；Workspace不是准入替代；consumer ACK非accepted，更非evidence/verdict；Observability十二affected不关；BR-UP-006 |
| SafeReadQualificationPort / traceability.rs | CurrentReadQualification/ReadDisclosureRules、safe query subject/scope/actor、view/count/stage refs | resolver-first current subject/ref/stage/count披露资格，finite denied/degraded/unavailable；只读contract | ref合法不推可见；deny隐藏指针与count；零write/audit/dedup/refresh/probe/repair；选Workspace才核其safe export/provenance；BR-UP-005/006 |
| SafeTraceRepository / traceability.rs | SafeAuditRecord、SafeHandoffRecord/SafeHandoffSnapshot、原safe result/canonical/op | local audit immutable append/read；handoff阶段/claim/result CAS及受权只读slice；与subject/dedup/result同UoW | 不新建平台/owner/Observability truth；无raw正文/hash；unknown读面不触发重交；actual canonical/admission缺失不造空handoff |
| PrivateMaterialPort / private_material.rs | CurrentMaterial/PresentationQualification、exact source/version/digest/attachment、五private中材料handle/payload | actual owning provider qualified材料读取及本次渲染；safe identity与private payload分离；call lifetime/取消/上限/销毁责任 | 无durable cache/通用String/日志/Error-source或detached task；expired/revoked立即拒绝；owner required digest只正式来源；BR-UP-001/003/004 |
| SecretResolutionPort / secret.rs | OpaqueSecretBindingRef、QualifiedSecretUseContext、PrivateSecretHandle | exact provider/key/version/installation/purpose/scope/route解析，current rotation/revoke/expiry；provider borrowing/cancel责任 | SDK/OAuth/API Key/KMS尚未选，no plaintext/env-token fallback；不能保存token/URL或把OAuth scope当内部授权；BR-UP-007 |
| ConfigQualificationPort / config_qualification.rs | InstallationConfigDraft/Qualification、capability/route/secret/source-mode及rate资格引用 | 实际config/source/version/namespace与逐method/scope/seam current资格；qualification/invalidation inputs；安全配置schema | 不由bool available或rawsecret证明；产品/driver/来源未建立finite not_established；J05不授新权；rate下界来自Config/Platform/Lane既有合同；BR-UP-007/008 |
| LocalUnitOfWorkPort / local_uow.rs | QualifiedLocalMutationPlan、PreparedLocalChange/StoredResultSeed、完整CAS、claim/one-use/audit/条件handoff | 本地原子write set/唯一/CAS/rollback/commit/unknown；实际CommittedLocalMutationRef/LocalRollbackProof与原result读取；八repo同driver一致性 | Prepared不自认证Committed；network永不包本地事务；mandatory缺口先阻；ACK lost不能当rollback；driver proof未核仍blocked；Step11/13 |

### 7.12 传递类型与callable的精确defer

| 责任组 | 当前闭口 / 后续边界 | 后续确切范围 |
|---|---|---|
| 243既有类型索引 | 233名称当前有唯一声明；以下10名称仅完整协议body defer。当前factory/member全部类型已有定义，不使用deferred body作空壳 | Step8按commands/consumers/queries文件正式schema/constructor/custom decode；保留原Step4归属 |
| commands两个body | BindingActionProposal、AuthorizedMappingProposal | C02/C03完整提案，显式授权与两端来源；不能由opaque任意map传入 |
| consumers四body | InboundSafeEnvelope、CommittedSourceRefEnvelope、CallbackSafeEnvelope、SafeConsumerResultEnvelope | E01~04完整safe事件metadata/source/版本/result；private context只能本地参数，不能wire |
| queries四body | BridgeBindingViewQuery、BridgeOperationViewQuery、BridgeContinuityViewQuery、SafeHandoffViewQuery | Q01~04 current read/scope/page/consistency；不能带probe/repair/refresh/write开关 |
| C01~06既有use case | ConfigureBridgeInstallation、ManageExternalBinding、MaintainExternalMapping、PrepareExternalDelivery、BindExternalAction、RequestBridgeRecovery | Step7 callable/port bundle；Step8输入结果；Step9逐流。C04只prepare，C06只请求，不同步send/replay |
| E01~04既有use case | PlatformInputReceivedConsumer、CommittedSourceAvailableConsumer、PlatformCallbackReceivedConsumer、SafeHandoffDispositionConsumer | Step7来源/结果/借用；Step8 E；Step9。E02与C04共同effect；E04只正式原consumer结果，不造producer |
| Q01~04既有use case | GetBindingMappingView、GetBridgeOperationView、GetContinuityView、GetSafeHandoffView | Step7 repo读+resolver；Step8 Q；Step9 no-write；不得为API新增read model或泄不可见count |
| J01~05既有use case | DispatchQueuedDeliveryJob、ReconcileBridgeOperationJob、ReconcileStreamGapJob、RetrySafeHandoffJob、RefreshBridgeQualificationJob | Step7 eligible/runner/port；Step8 J/continuity；Step9 bounded原subject/op/effect及unknown/取消；无通用replay |
| Application helper | LocalViewProjector/StoredResultReusePolicy已在result_mapping.rs闭口；mutation/invalidation/private/snapshot也有唯一当前卡 | Step7 metadata_validation、local_mutation及原用例消费签名；Step11原子性；不增加idempotency.rs/projector.rs/service文件 |
| Infra/entry真实调用 | 四platform/六owner/store/probe/runtime与API/Jobs/Worker稳定shape已闭口 | Step7 foreign callable/adapter mapping/host/eligible读/lifetime；Step11driver；Step14/04产品/pin/SDK/API/KMS/route/transport。缺正式输入继续blocked |

### 7.13 跨模块边界、正反例与计划测试切口

| 审查项 | 对象契约结论 | 当前修正 / 后续 |
|---|---|---|
| shared唯一/无重复truth | contracts基础+qualified vocabulary唯一；19Domain与唯一view各有原capability来源；无owner/platform实体副本 | 409定义含6reexport，state/ref/helper无双定义；逐卡路径反查，正式索引到Step19才装配 |
| metadata/private传递 | core actor单独传；private field只有safe typed getter或具名受限borrow；公开结果不接内部snapshot | 补只读面与三raw seam borrow，保五private及reply上下文原存活纪律 |
| state/Slot/result | 17状态和02边一致；prepared/committed、ACK/owner/platform/consumer与runtime phase不合并 | 当前表及各卡纯成员；完整transaction/trigger/matrix留Step9~13 |
| compile方向 | contracts -> core；domain -> contracts；application -> contracts/domain；infra -> contracts/domain/application；入口 -> contracts/application/infra；worker -> jobs | 不把owner runtime/event当Cargo边；jobs不回依worker；private/Domain/infra不得回依入口；SDK仍conditional |
| evidence/审计边界 | safe有限reason、获准subject/basis/stage/schema和原op关联只设计材料；actualproducer/consumer准入另核 | 不输出raw body/token/secret/privateURL/敏感审批内容或其可还原/hash派生；ref可读取不代表可审计；不造report/evidence/verdict/signoff/readiness |

以下均为未来测试切口，**planned / 未运行**；沿Step4测试文件责任交Step16/05，不建立TC/run/artifact/report/evidence或实施boundary。

| 计划位置 / 切口 | 正例必须成立 | 反例必须拒绝 / 保持 |
|---|---|---|
| crates/contracts/tests/protocol_surface_tests.rs；factory/词汇 | 完整typed字段、finite enum、core重导出及同源窗口；getter只借用safe值 | 未定义载荷、missing required、wrong owner/kind/namespace、generic deserialize绕factory；结构合法不自动授权 |
| crates/domain/tests/local_guards_tests.rs；U1 | Pending显式激活与新generation；三mapping两端完整且原kind | external_id自动GlobalMember、OAuth/PAT自动内部权限、Stale消费、不同generation/CAS错配 |
| 同一local_guards_tests.rs；U2/U3/U4边界 | actual owner/平台结果才known终态；NoIo与NoEffect区分；one-use原op唯一 | ACK当Turn、内部commit当送达、rejected当no-effect、claimed复活、敏感Gate默认降级交互 |
| 同一local_guards_tests.rs；U5 | 同stream/stage/epoch full coverage及CAS推进；多bucket最大下界；unknown head保留 | 跨epoch比较、partial coverage关gap、release lease清unknown、过期key重执行、换target/effect规避冲突 |
| application/tests/authorization_flow_tests.rs；current/mandatory/private | 最后IO前核current actor/target/action/material/Gate/secret；mandatory齐才候选提交/外部交接 | 有ref就执行、missing admission仍mutation、private逃逸call/durable/log/Debug/serde/Error-source；无owner safe callback语义不执行 |
| application/tests/continuity_flow_tests.rs；UoW/原result | C04/E02同effect，全部write/CAS/result/audit/条件canonical原子；known原result只finalize | Prepared当Committed、ACK lost当rollback、NotFound/timeout当no-effect、duplicate再次解析private/外部IO |
| application/tests/safe_read_tests.rs；Q01~04 | resolver-first逐subject/ref/stage/count过滤，current safe result复用 | Query写audit/dedup/refresh/probe/repair；Denied泄ref/count、subject可见推出all stages；Domain getter直接public wire |
| crates/infra/tests/platform_boundary_tests.rs；adapter/runtime | 四平台逐mode/method/namespace、六owner正式绑定、required完整及source互斥 | incoming webhook当inbound、Slack headers套Mattermost、Snowflake默认跨流cursor、required缺失fallback、Workspace未选仍阻全分支、SDK隐式retry |
| crates/infra/tests/local_commit_boundary_tests.rs及private_material_boundary_tests.rs | same store/probe、actual提交证明及qualified buffer来源/生命周期 | fake生产fallback、wrong driver/schema当权威probe、rawerror/SDK logging/secret泄漏或borrow逃逸 |
| crates/api/tests/inbound_dispatch_tests.rs、crates/jobs/tests/job_invocation_tests.rs、crates/worker/tests/consumer_dispatch_tests.rs | trusted入口、actual ACK、bounded J与worker原subject/op/candidate；取消保unknown | self-reported actor/source、Query透传raw、取消声明无effect、J05假造intent、双source模式、worker第二writer/反向jobs依赖 |

设计自检材料只包含文件、计数、命名/类型/边与静态检查结果；未来fake/durable parity须测试双方，但fake通过不证明真实外部授权、no-effect、coverage、投递或准入。每个上游缺口只能由对应owner真实合同与合法核验材料释放。

## 8. 回填草稿

以下只作为未来正式§5/6的收口草稿，**不是正式03装配许可**；过程批次、模块停审与审计数字留calibration，不回填正文。

| 正式模块位置 | 已收稳的对象契约草稿 | 后续闭口 / 不能宣称 |
|---|---|---|
| §5 contracts对象实现契约 | 312定义含6真实core reexport；local/authority/typed locator/current ref、finite meaning/key/epoch/coverage/claim/rate/secret/Slot/state/results/job/view；private不入wire | 10完整body逐名交Step8；serde/custom decode与wire限制到Step8；canonical唯一/编码到Step13；不宣qualified来源已存在 |
| §5 domain对象实现契约 | 19模型独立factory/rehydrate/getter/pure transition；17业务state唯一，receipt/audit immutable；零IO失败零修改 | Step7 port消费；Step9处理流/Step10矩阵/Step11实际持久化；不由Domain创建owner/platform truth或commit proof |
| §5 application对象实现契约 | 五private及reply call借用、九snapshot及actual读取basis；staged mutation/result与actual提交分开；current visibility/原result复用唯一result_mapping归属 | 19用例/23port callable到Step7，协议到Step8、编排到Step9；mandatory/atomic到Step11/15；无通用execute/replay/service |
| §5 infra对象实现契约 | 四平台/六owner独立adapter、safe config/current binding、required-seam/mode/availability及same-store/probe/预算/phase | 实际client/driver/host/产品/pin到Step7/11/14/04；not_selected/not_established不装配fallback或宣operational |
| §5 api对象实现契约 | trusted actor/core C/Q context、finite入站处置、private E01/E03调用及actual ACK；业务IO只Application | Step7 handler/Step8协议/Step9流/Step14route；Query不写，ACK非Turn/action accepted |
| §5 jobs对象实现契约 | 五bounded动作及JobSubjectRef、原continuity/trusted invocation/current资格、取消不消原unknown | Step7 runner/eligible来源/Step8 J/Step9；不造run/新subject/effect或重放新operation |
| §5 worker对象实现契约 | 排他family/mode/qualified session/epoch、safe event/candidate/有界batch/停止；单向jobs library复用 | Step7 source/host/dispatch/Step8 E/Step9调度/Step14transport；不成为第二writer、不伪造coverage |
| §5对象闭口收口摘要 | shared唯一、高复用字段正式来源、factory完整、required-by-state/独立stage、runtime required及23port逐名责任；精确defer见§7.11~7.13 | 上游/产品/driver未释放仍运行blocked；对象shape闭口不等全03可落码或实施ready |
| §6全局索引 | 每个当前type及用例/port回指所属模块/唯一计划文件；新增support卡仍在Step4既有路径 | Step7补trait索引、Step8补protocol、Step19按所有当前Step完整装配；不在现在新建正式索引或未来Step文件 |

正文草稿结论：Bridges只维护局部配置、受权relation/mapping、去重/游标/gap/lane、尝试/known receipt和adapter-local状态。每个safe carrier具名来源/current期限，内部commit、owner accepted、platform业务送达和consumer交接独立。原op/effect未知时只受权同源查证与局部finalize，缺资格保持blocked/manual；raw/private材料只在合格seam本次call内消费。此结论不赋予Bridges内部owner或第三方平台真相权。

## 9. 待确认事项

| 待确认组 / 状态 | 阻塞面 | 合法释放依据 / 下一Step承接 |
|---|---|---|
| BR-UP-001~004=open | Conversation原op accepted/material-digest/change，Identity外部human责任，Governance外显/action safe ref，Artifact附件准入 | 各owning当前正式合同的bridge-specific输入/result/current/probe/材料限制兼容；Step7逐port核验，不自补上游方法 |
| BR-UP-005=open | 选用Workspace safe read/export/provenance的对应branch | 原WS-UP-001~008/006-S及WS-LOCAL-001~003状态与正式合法read依据；未选Workspace不强阻其他branch；本任务不回写 |
| BR-UP-006=open | mandatory producer准入、canonical/schema/consumer disposition及原result | Observability owning合同及真实受准材料；十二affected保原状态，actual实现/证据缺失不关；Step7/15消费 |
| BR-UP-007=open；所有产品not_selected/not_established | 平台SDK/transport/router、OAuth/API Key/KMS/provider、executor/DB/Bus/cache及scope/pin/version/轮换 | adapter/config/secret/driver/host真实选择和compatible核验；Step7/11/14及04；不能用README/目录/链接/fake作实际支持证据 |
| BR-UP-008/009=open | 四平台source/method/线程/编辑删除/附件/ACK/deadline、rate/comparator/window/full coverage/no-effect/原op probe | PS-01~14登记只是来源；实际platform version/installation/method/current权限及权威结果能力材料；Step7/8/11~14；未知不重发 |
| BR-UP-010=reference_only | L5-chat并行入口 | 用户停审认可与实际接口合同才可消费；当前未停审内容不成为输入，没有新增编译/runtime必需边 |
| 本地callable/protocol/driver/flow/matrix尚未到达 | 23port/19入口、10body、真实builder/读写面、canonical/事务/错误/并发/配置/观测 | 本Step对象shape已收稳不释放这些未来内容；用户确认后按Step7~18顺序逐项闭口，缺读写/来源时实现必须暂停 |
| 用户确认Step6=waiting | 进入Step7与正式03/实施 | 本次只授权全部Step6；完成即停，不以设计自检代替用户授权或owner signoff |

上游缺口不是“所有上游设计未完成”的断言，而是Bridges具体对接资格索引。设计静态自检可pass，正向运行/实施资格依然blocked；不改变00 Step15的owner/释放依据。

## 10. 自检、审计及停审门禁

### 10.1 实际完成范围与审计

C、D1~D6、A、I、P、J、W均先思考/诊断/取舍、再逐卡写入/草稿/组内自检；X完成字段来源、factory/读取面、17业务state、独立阶段、23port/runtime、传递闭包、planned测试/证据边界与后置历史冲突扫描。所有结论只在当前Step6六文件、03 flow和本台账；没有正式03装配或未来Step实施。

| 实际只读审计 | 范围与结果 | 资格上限 |
|---|---|---|
| type/field/function闭包 | 409定义=403独立声明卡+6真实core reexport；312shared/19Domain/28Application/29Infra/21Entry；837具名字段、1582函数签名及tuple/alias载荷无未定义类型；duplicate/值尺寸递归/role反向引用均0 | 声明/传递静态检查，不是Rust编译；标准库及generic T不当缺失类型 |
| enum/Rustdoc/factory | 266struct=181具名字段struct+83tuple struct+2零字段helper；105enum/32alias，544代码variant均有Rustdoc与变体表；837具名字段的来源表/类型/getter/Rustdoc及成员重名检查通过；19Domain完整rehydrate参数与stored basis均通过；factory全覆盖或state/local_revision明确派生；private raw只经受限borrow | 结构factory不产生权限、实际提交、clock、ID或运行证据 |
| state来源 | 17对象exact enum与02标签一致；02允许表slash展开123条边，Domain typed成员逐条承接、无新增或遗漏边；四运行phase另给初态/具名迁移，不计为业务机 | 完整trigger/事务/非法矩阵留Step9~13，未宣这些未来Step已完成 |
| type/path/port承接 | 243既有名称=233已有定义+10逐名协议body defer；403声明卡计划路径均落Step4的148个Rust文件责任中，既有名称唯一归属无偏移；RuntimeSeamKind注册23port与§7.11的23行逐名一致 | rejected历史HandoffRepository词汇只在诊断/禁止说明，不是第24port；未来Step文件0 |
| Markdown/链接/空白 | 八文件表格分隔/列数、围栏配对、相对文件链接、尾空白审计通过；初次917表，加入本节审计表后已实际复跑918表/824围栏行=412块/10本地相对链接，errors=[] | 不安装lint/test工具，不运行项目测试；路径计划不是已创建实现文件 |
| 范围与Git | 开工307基线中flow/本台账为两允许元信息变更，其余305文件SHA-256全部匹配、缺失0；保留其他dirty；git diff --check -- projects/L6-bridges/通过，cached为空 | 只读Git检查，无stage/commit；未创建实现仓/实施台账/planned boundary |

core实际复核为actor.rs全文、metadata.rs的Request/Command/Page/Query字段、lib.rs模块导出及Cargo package/lib名称；Command/Query无actor字段。平台PS-01~14与七owner资格沿§1实际阅读登记，本Step没有新网络、账号/token、真实installation、driver/run或投递结果核验；不会因链接/类型存在关闭BR-UP。

### 10.2 纠正与执行事实

初次静态审计不是全通过：相邻表格确有渲染错误，已插292处空行；不存在repository来源、通用facade暗示、读取面、运行phase初态/unknown集合及两处Rustdoc均在当前文件内纠正。X新写测试路径及E04名称曾不沿Step4/5，反查后归回既有责任。没有用范围扩大或前序回写处理这些问题。

过程工具失败如实保留：早期ledger匹配/后续上下文patch失败、getter补丁重复同路径操作及生成器转义失败都未落盘；精确分组patch重做成功。两次全量卡JSON输出截断导致parse失败，改为本地只读统计/分批后完成；多次内联审计反引号SyntaxError在执行前失败，无写入。初版检查把enum variant/alias注释中的None与自身当缺失类型/递归，修解析后真正重跑关闭；port词法计数24含明确否定的历史名，实际注册与逐行handoff均23。错误文件名的只读查找返回不存在，按rg --files定位后重读；不冒称失败检查通过或项目测试执行。

### 10.3 当前结论与用户停审

Step6对象契约与设计自检pass仅覆盖本步；上游BR-UP-001~009=open、010=reference_only，Workspace原开放项和Observability十二affected原状态保留；SDK/OAuth/API Key/KMS/router/executor/HTTP/DB/Bus/cache仍not_selected/not_established。后续实际接口/协议/事务/产品必须按顺序闭口，不能让实施端猜。

主文件/03 flow/项目台账停点已同步为step06_complete_waiting_user，用户确认waiting；下一只允许等待Step7明确授权。本轮共六个Step6文件加flow/台账八文件，正式03/README/00~02/前序/其他项目未改。获准后先读详细SOP Step7全文、书写§5.5对应trait/adapter规范、本Step/前序23port责任以及各受影响owner当前正式合同/必要台账，再建立当步产物；当前不提前建/写/执行Step7。停点同步后只做只读复查，无新语义写入；commit_required=false。

```text
current_document = 03
current_step = 6
current_module = step06_complete_waiting_user
document_status = in_progress
step_status = done
step06_design_self_review = pass
step06_user_confirmation = waiting
gate_status = blocked
gate_reason = authorized_stop_at_step06
next_allowed_action = wait_for_user_authorization_of_03_step07
calibration_write_allowed = false
formal_document_write_allowed = false
formal_03_assembly_allowed = false
step06_allowed = false
step07_allowed = false
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
