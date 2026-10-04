# L6-bridges 02 Step 8：关键处理流

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§8。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step5/6/7；SOP8/规范4.8已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done / 六部分串行 |
| 结构化/复杂度 | done / 19独立图及覆盖 |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step5/6/7；SOP8/规范4.8；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

1~4：关键写/读/consumer/job入口按下列六U独立流程闭合；局部UoW不包owner/platform/private网络。5~6：点名函数沿Step6typed参数，完整调用链/返回/SQL到03。7~8：6个P0 command、4个mutation consumer、5个可靠性job、4个有裁剪/降级query全部独立图；O01无独立入口，由真实mutation/条件交接产生。9~11：每图列归属/对象/事务/测试切口，每U停审后下一U，最后覆盖跨审。

### U1 思考

U1应覆盖C01 ConfigureBridgeInstallation、C02 ManageExternalBinding、C03 MaintainExternalMapping、J05 RefreshBridgeQualificationJob；均独立成图，不以共享handler省略P0/consumer/job或裁剪query。使用已定义BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping及U5/U6支撑，接缝沿Step5/7。配置资格、关系授权、三mapping定位必须分离；message mapping的建立依据只能是受权管理或已知owner/平台结果，不允许任意external ID认领内部事实。 网络资格/局部UoW/不可知出口按当前主语拆开，完整函数链不写。思考done，允许当前U流写入。

### U2 思考

U2应覆盖E01 PlatformInputReceivedConsumer；均独立成图，不以共享handler省略P0/consumer/job或裁剪query。使用已定义InboundHandoffRecord及U5/U6支撑，接缝沿Step5/7。必须先分平台来源、当前内部资格和owner交接三段。安全material无资格时拒绝/blocked，不能为可恢复性写正文。缺原mapping变化隔离，不冒充create。 网络资格/局部UoW/不可知出口按当前主语拆开，完整函数链不写。思考done，允许当前U流写入。

### U3 思考

U3应覆盖C04 PrepareExternalDelivery、E02 CommittedSourceAvailableConsumer、J01 DispatchQueuedDeliveryJob；均独立成图，不以共享handler省略P0/consumer/job或裁剪query。使用已定义SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt及U5/U6支撑，接缝沿Step5/7。plan、effect、attempt和receipt是不同主语；Gate降级是获准的存在性/安全提示/入口能力选择，不是把审批正文截短。投递payload只私有瞬时重建，原plan失效不能在同effect换材料。 网络资格/局部UoW/不可知出口按当前主语拆开，完整函数链不写。思考done，允许当前U流写入。

### U4 思考

U4应覆盖C05 BindExternalAction、E03 PlatformCallbackReceivedConsumer；均独立成图，不以共享handler省略P0/consumer/job或裁剪query。使用已定义ExternalActionBinding、CallbackHandoffRecord及U5/U6支撑，接缝沿Step5/7。签名只能验证来源；action binding必须把actor责任和target/owner revision绑牢。one-use在局部原子claim后不可复活；owner未知只按原operation查结果，不重新approve。 网络资格/局部UoW/不可知出口按当前主语拆开，完整函数链不写。思考done，允许当前U流写入。

### U5 思考

U5应覆盖C06 RequestBridgeRecovery、J02 ReconcileBridgeOperationJob、J03 ReconcileStreamGapJob；均独立成图，不以共享handler省略P0/consumer/job或裁剪query。使用已定义DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord及U5/U6支撑，接缝沿Step5/7。dedup、stream位置、gap、lane和recovery不能合一个offset表：authority与状态触发不同。恢复job只编排原记录的qualified probe/finalize，缺ref/window/coverage则保持人工出口。 网络资格/局部UoW/不可知出口按当前主语拆开，完整函数链不写。思考done，允许当前U流写入。

### U6 思考

U6应覆盖E04 SafeHandoffDispositionConsumer、J04 RetrySafeHandoffJob、Q01 GetBindingMappingView、Q02 GetBridgeOperationView、Q03 GetContinuityView、Q04 GetSafeHandoffView；均独立成图，不以共享handler省略P0/consumer/job或裁剪query。使用已定义SafeAuditRecord、SafeHandoffRecord、BridgeLocalView及U5/U6支撑，接缝沿Step5/7。局部mutation审计、实际handoff与safe read是不同对象；view没有生命周期，不重写producer事实。只在真实canonical事件存在时交接，平台错误raw string也必须转有限reason。 网络资格/局部UoW/不可知出口按当前主语拆开，完整函数链不写。思考done，允许当前U流写入。

## 4. 当前文档问题诊断

只画“收到->处理->成功”无法说明持久化前后崩溃、in-flight unknown、one-use和当前授权检查。C04管理触发与E02producer触发还需effect语义唯一，不能仅各自idempotency_key唯一而造成双发。cursor closure必须含相应阶段coverage，不从page/count完成推业务连续。

## 5. 改动前后对比

| 接口骨架 | 本Step流程收束 | 后续详细设计 |
|---|---|---|
| typed入出/主语 | guard顺序、局部UoW-A/外呼/UoW-B、unknown出口 | 全函数/返回/事务driver/crash matrix |
| 不同幂等namespace | 同origin semantic effect唯一与one-use/coverage | canonical effect key schema与唯一约束 |
| Query four results | 每Query独立裁剪/降级图、no-write边界 | 完整视图/授权carrier及测试矩阵 |

## 6. 设计取舍

19独立图按U分批；不为O01另造业务command，canonical/admission缺口保持audit-only/blocked。每流关键点覆盖边界/禁止/03承接与测试切口，非测试执行。policy检查是当前正式dispatch资格，不保证撤回已离开private seam的请求；未知仍原effect对账。支持对象来自Step6，新增carrier仅typed支持，03逐项定义；不发明全局事务。

## 7. 结构化中间产物

### 通用骨架与稳定effect规则

audit-only仅适用于正式owning规则明确不要求producer准入/强制材料交接的局部记录。若当前Policy/Gate/owning contract要求mandatory producer admission、canonical材料或受限handoff budget，缺任一依据必须在相应mutation/正向IO前blocked，不以“已写本地audit、以后补交”放行；要求来自正式规则，不可由config开关关闭。准入资格不等consumer accepted，更不等evidence。

局部UoW返回LocalCommitDisposition须有driver权威证明：definite conflict/rollback才报告回滚；commit acknowledgement丢失或结果不可判保indeterminate，阻新effect/换key/重新应用。通过现有原operation和repository的受权只读提交结果核验，03须闭口强一致探测/未提交proof/窗口；普通Query不触发对账。LocalCasDisposition是既有CAS成功/冲突/不可判结果的typed名，不新增领域对象/入口/状态。

| 路径 | 共同边界 |
|---|---|
| Command/consumer mutation | 可信输入/authority -> subject/scope resolver -> current basis -> scoped same-meaning dedup -> 局部subject/result/audit UoW；canonical schema/admission存在才形成O01关联handoff，不是所有mutation自动outbox。 |
| 外部effect/handoff | UoW-A记录原operation/effect/claim -> private材料/secret及最后资格核验 -> 网络外呼 -> UoW-B权威结果finalize；任一effect可能离开后的crash/timeout保持indeterminate。 |
| recovery | 原subject/op/effect + 当前scope/window + 正式只读probe/coverage -> known finalize/明确同effect资格/manual；不发送新的业务mutation作probe。 |
| query | 当前read资格 + 既有safe snapshot -> visibility/counters/ref过滤 -> qualified/degraded/denied/unavailable；无写UoW、日志body、审计写或repair。 |

StableEffectIdentity的语义维度：installation namespace、binding ref/generation、不可变target/location/thread、committed source ref/version、allowed projection ref/version、operation kind与原source change identity；从validated refs规范化，不来自rawbody/hash、不由caller随意指定。确切编码/可选性/唯一约束到03。C04/E02两类idempotency_key各有namespace，但同语义effect必须在一个局部原子唯一边界复用同intent。新版本只有新受权意图；不得作为未知旧effect的替代重试，相关lane/dependency须保住未解决原效果。

允许审计/证据材料仅安全refs、版本、stage、有限reason、同流位置摘要及handoff状态；测试切口是后续05的设计输入，本轮无fixture/run/测试结果。


### U1 关键处理流

#### U1处理流停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 接口覆盖/对象已定义 | pass | C01/C02/C03/J05独立图；§6 BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping与U5/U6支撑 |
| 接缝/UoW/层级 | pass | 外呼不包事务，current basis与unknown不省；typed函数不写完整链/SQL |
| 缺口 | preserved | 正向owner/platform/consumer资格blocked时不外呼，BR-UP未关闭 |


#### RefreshBridgeQualificationJob 处理流

图类型：处理流图；归属U1 / J05 / U1-C1~C3；Application沿§7；使用§6 BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping，跨部分U5/U6对象与§5接缝不变。

```text
Job -> existing config/binding + explicit qualification maintenance authority
  |
  v
BindingApplication: current owner basis / capability / route / secret reference
  | private resolver/owner read outside UoW; no new permissions or platform install
  | revoked/expired/missing -> finite blocked/stale qualification
  v
UoW: expected config/qualification revision + current generation guard
  | -> BridgeInstallation.record_qualification(InstallationQualificationRef qualification)
  | -> qualified related mapping/plan/action/lane/cursor invalidation by owning applications
  | -> unissued intent eligibility only with existing no-IO/no-effect proof + original valid plan
  | -> SafeAuditRecord; no current or historical owner/platform result rewriting
  v
QualificationJobResult; historical effect/source/result not rewritten
```

关键设计点：

- 事务切口：TX12；资格snapshot/CAS与安全失效标记本地原子；query绝不触发该job。
- 边界与禁止：新的内部授权仍需C02正式显式basis，资格维护不能激活revoked关系；secret rotation不改变intent含义。
- 测试切口与03承接：rotation/revoke、old qualification并发、pin/capability change、blocked无自动权限补齐；03闭失效传播/当前资格与04配置版本。



#### MaintainExternalMapping 处理流

图类型：处理流图；归属U1 / C03 / U1-C3；Application沿§7；使用§6 BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping，跨部分U5/U6对象与§5接缝不变。

```text
Command -> trusted mapping management entry
  |
  v
MappingApplication: resolve mapping kind and both-end authority
  | identity -> account kind + formal ActorRef
  | location -> channel/DM/topic/thread + formal scope
  | message  -> original locator + known owner/platform result basis
  | missing/ambiguous -> blocked/quarantine; never guess target
  v
UoW: current binding generation + semantic dedup + mapping CAS
  | -> corresponding independent mapping + result + SafeAuditRecord
  v
BridgeCommandResult: typed mapping ref or finite failure
```

关键设计点：

- 事务切口：TX1；唯一typed mapping与dedup/result/audit同UoW；结果回链不得另存实体正文。
- 边界与禁止：三branch由AuthorizedMappingProposal明确区分，目标不由名称/mention/ref文本猜；消息来源proof缺失不能链接任意事实。
- 测试切口与03承接：跨installation同ID、human/AI混淆、原message错链、mapping CAS冲突；03闭三variant及逐namespace唯一约束。



#### ManageExternalBinding 处理流

图类型：处理流图；归属U1 / C02 / U1-C2；Application沿§7；使用§6 BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping，跨部分U5/U6对象与§5接缝不变。

```text
Command -> trusted management entry
  |
  v
BindingApplication: resolve external scope + internal typed target + actor
  | -> independent current owner binding/action basis
  | denied/missing/stale -> pending/blocked; not an active relation
  v
UoW: management namespace dedup + expected generation
  | -> propose / activate / suspend / revoke authorized branch
  | -> relation generation + safe result + SafeAuditRecord
  v
BridgeCommandResult: current relation/ref/generation (no owner writes)
```

关键设计点：

- 事务切口：TX1；relation/action/CAS/dedup/result/audit同UoW；历史effect及owner事实不重写。
- 边界与禁止：绑定不由external ID或OAuth建立，revoked终态；暂停/撤销阻后续新派发，已可能发出的请求仍须独立对账。
- 测试切口与03承接：跨kind/tenant、权限失效、同key变义、撤销与dispatch竞态；03闭authoritative basis、generation与运行guard。



#### ConfigureBridgeInstallation 处理流

图类型：处理流图；归属U1 / C01 / U1-C1；Application沿§7；使用§6 BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping，跨部分U5/U6对象与§5接缝不变。

```text
Command -> trusted management entry
  |
  v
BindingApplication: resolve config subject/scope -> current config basis
  | missing/denied -> safe reject; no secret/body output
  v
Private config/secret/capability qualification (no local UoW held)
  |
  v
UoW: same-key meaning + expected config revision
  | -> BridgeInstallation.configure(InstallationNamespace namespace,
  |      ConfigurationBasisRef basis, OpaqueSecretBindingRef secret_binding)
  | -> config + dedup/result + SafeAuditRecord; conditional O01 only
  v
BridgeCommandResult: local_recorded / configured / blocked / conflict
```

关键设计点：

- 事务切口：TX1；仅本地配置/去重/安全审计原子，private资格外读不包UoW。
- 边界与禁止：配置接纳不证明安装、secret可用或binding授权；产品未选即配置waiting/blocked。raw凭证不得进管理DTO或日志。
- 测试切口与03承接：同键变义、secret失效/轮换、能力版本不匹配、配置写崩溃；03闭config/source/unique/CAS与private resolver。



### U2 关键处理流

#### U2处理流停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 接口覆盖/对象已定义 | pass | E01独立图；§6 InboundHandoffRecord与U5/U6支撑 |
| 接缝/UoW/层级 | pass | 外呼不包事务，current basis与unknown不省；typed函数不写完整链/SQL |
| 缺口 | preserved | 正向owner/platform/consumer资格blocked时不外呼，BR-UP未关闭 |


#### PlatformInputReceivedConsumer 处理流

图类型：处理流图；归属U2 / E01 / U2-C1~C3；Application沿§7；使用§6 InboundHandoffRecord，跨部分U5/U6对象与§5接缝不变。

```text
Consumer <- qualified private ingress / safe envelope
  | -> platform proof + event/source/key + installation/source marker
  | invalid -> protocol reject; no durable raw inbox
  v
InboundApplication: resolve current binding / actor / target mode / original mapping
  | loop/tamper/conflict/missing original change -> quarantine/gap
  | -> qualified material/ref + required digest source; absent -> blocked
  v
UoW-A: reserve original operation + dedup + InboundHandoffRecord + audit
  | safe recoverable takeover? -> independent protocol ACK plan
  v
ConversationHandoffPort (outside UoW)
  | AppendFact: Integration + BridgeMapped + required digest guards
  | ManifestExternalFact: external ref; no platform body into truth
  v
UoW-B: apply real owner result / pending / indeterminate
  | -> known message mapping / matching owner-position coverage / safe audit
  v
InboundConsumeResult; ACK != accepted fact != Turn
```

关键设计点：

- 事务切口：TX5；A安全接管+去重/原op/audit，网络外，B真实结果+回链/covered位置/audit；平台ACK仅protocol位置。
- 边界与禁止：没有安全可恢复source或owner已接纳时，不承诺可靠ACK或无损replay，按平台受控拒绝/丢弃合同；raw inbox禁止。edit/delete只原mapping能力/owner变化合同，不能伪装新发言。
- 测试切口与03承接：伪签名/回环/重复变义、材料/digest缺失、edit-before-create、线程不可比、owner timeout与A/B crash；03闭accepted结果/安全接管与补偿。



### U3 关键处理流

#### U3处理流停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 接口覆盖/对象已定义 | pass | C04/E02/J01独立图；§6 SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt与U5/U6支撑 |
| 接缝/UoW/层级 | pass | 外呼不包事务，current basis与unknown不省；typed函数不写完整链/SQL |
| 缺口 | preserved | 正向owner/platform/consumer资格blocked时不外呼，BR-UP未关闭 |


#### DispatchQueuedDeliveryJob 处理流

图类型：处理流图；归属U3 / J01 / U3-C2~C3 / U5-C3；Application沿§7；使用§6 SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt，跨部分U5/U6对象与§5接缝不变。

```text
Job -> trusted dispatch context + existing intent
  |
  v
DeliveryApplication: same effect / current generation / basis / source version
  | -> capability + original projection/attachments + secret + lane/budget/window
  | denied/stale/dependency missing -> blocked/unsupported/no IO
  v
UoW-A: claim lane/fence + intent dispatching + appended DeliveryAttempt + audit
  |
  v
Private material/secret resolution and final current qualification check
  | proven no request left -> not_dispatched; otherwise possible IO
  v
PlatformDeliveryPort: exactly this attempt; no library hidden retries (outside UoW)
  | accepted -> known PlatformReceipt
  | no-effect retryable + all bounds -> retry_wait
  | timeout/ambiguous -> indeterminate; never blind resend
  v
UoW-B: attempt/intent/known mapping/lane bounds/result/audit
  v
DispatchJobResult; receipt != delivered/read
```

关键设计点：

- 事务切口：TX8；A durable before IO，B结果分类finalize；网络/private handle不入UoW；stale fence不能发新IO，已发请求仍可按原attempt记录权威结果。
- 边界与禁止：未知不产生新effect；当前撤销阻新请求，但已在途不承诺撤回。lane含edit/delete/reply已知create依赖；所有有效bucket/global下界共同作用。
- 测试切口与03承接：资格检查/IO/结果落库崩溃点、撤销竞态、迟到结果、429、多lane共享bucket、SDK隐式retry、附件失效；03闭claim/fence与窗口/result guard。



#### CommittedSourceAvailableConsumer 处理流

图类型：处理流图；归属U3 / E02 / U3-C1~C2；Application沿§7；使用§6 SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt，跨部分U5/U6对象与§5接缝不变。

```text
Consumer <- qualified committed-source envelope
  | -> trusted producer / event_id/source_ref/key / committed source/version
  | unqualified binding/schema -> blocked; not a fabricated source event
  v
PresentationApplication: current target / visibility / Policy-Gate / attachment grants
  | -> qualified/degraded plan or blocked
  v
UoW: event dedup + same canonical semantic effect key as C04
  | -> existing intent when same effect; conflict if changed meaning
  | -> new plan/intent only for new authorized effect + SafeAuditRecord
  v
SourceConsumeResult: local intent disposition, not platform delivery
```

关键设计点：

- 事务切口：TX2；event命名空间去重与effect语义唯一都需原子，C04/E02两触发不能造双effect。
- 边界与禁止：producer正式事件binding/canonical payload未绑定时blocked，不从owner缓存/Chat草稿造committed source；不直接dispatch。
- 测试切口与03承接：伪producer/schema、同source两入口并发、out-of-order source、Gate失效、无action降级；03闭具体producer binding与共同effect key。



#### PrepareExternalDelivery 处理流

图类型：处理流图；归属U3 / C04 / U3-C1~C3；Application沿§7；使用§6 SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt，跨部分U5/U6对象与§5接缝不变。

```text
Command -> trusted preparation entry
  |
  v
PresentationApplication: resolve committed source/version + immutable target
  | -> current binding / visibility / Policy-Gate / attachments / capability
  | missing -> blocked; permitted safe notice -> degraded (no sensitive body)
  v
SafePresentationPlan.prepare(CommittedSourceVersionRef source,
  DisclosureQualificationRef basis, AuthorizedMappingContextRef target)
  |
  v
UoW: management key + validated semantic effect identity uniqueness
  | -> DeliveryIntent.from_plan(PresentationPlanRef plan,
  |      StableEffectIdentity effect, ImmutableDeliveryTargetRef target)
  | -> plan/intent/result/dedup/audit; conditional O01 only
  v
BridgeCommandResult: intent planned; no platform request here
```

关键设计点：

- 事务切口：TX2；plan/intent+effect唯一/dedup/result/audit同UoW；source资格在外部读取后于固化/派发重新核验。
- 边界与禁止：敏感Gate存在性/提示/入口/action分别授权；附件必需而失效则blocked；新source/projection要新受权plan但不能掩盖旧unknown。
- 测试切口与03承接：Gate裁剪、附件过期、C04/E02同effect竞争、旧generation、source未提交；03闭effect canonicalization/material/version与授权闭口。



### U4 关键处理流

#### U4处理流停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 接口覆盖/对象已定义 | pass | C05/E03独立图；§6 ExternalActionBinding、CallbackHandoffRecord与U5/U6支撑 |
| 接缝/UoW/层级 | pass | 外呼不包事务，current basis与unknown不省；typed函数不写完整链/SQL |
| 缺口 | preserved | 正向owner/platform/consumer资格blocked时不外呼，BR-UP未关闭 |


#### PlatformCallbackReceivedConsumer 处理流

图类型：处理流图；归属U4 / E03 / U4-C2~C3；Application沿§7；使用§6 ExternalActionBinding、CallbackHandoffRecord，跨部分U5/U6对象与§5接缝不变。

```text
Consumer <- qualified private callback / safe envelope
  | -> source authentication + installation + exact source/action binding
  v
CallbackApplication: current actor responsibility + target/action + owner revision
  | expired/tampered/replayed/cross-target/revoked -> rejected
  | missing qualified owner action/material -> blocked
  v
UoW-A: event dedup + one-use CAS + original owner op + CallbackHandoffRecord/audit
  | -> protocol ACK/defer independent of owner result
  v
OwnerActionPort: owner second check + same original op (outside UoW)
  | no direct Gate approval or tool execution in Bridges
  v
UoW-B: real owner accepted/rejected/pending/indeterminate + safe audit
  v
CallbackConsumeResult; repeated input may show visible original result only
```

关键设计点：

- 事务切口：TX6；one-use/action claim+record/原op/dedup同A；B只真实结果。A后crash不复活action。
- 边界与禁止：签名不授action，unknown只查原owner operation；callback显示变化不制造Decision；禁止私有token/context/response URL持久化。
- 测试切口与03承接：cross-actor/target、expiry、并发one-use、owner二次拒绝、A/B crash、原result不可见；03闭owner兼容命令与callback私有验证。



#### BindExternalAction 处理流

图类型：处理流图；归属U4 / C05 / U4-C1；Application沿§7；使用§6 ExternalActionBinding、CallbackHandoffRecord，跨部分U5/U6对象与§5接缝不变。

```text
Command -> trusted action-binding entry
  |
  v
CallbackApplication: known presentation/source message -> current actor/target/action
  | -> owner state/revision + disclosure/action basis + expiry/one-use
  | no qualified action surface -> blocked (no fabricated button/URL)
  v
UoW: original management key + source/action uniqueness
  | -> ExternalActionBinding.bind(SourceIntentMessageRef source,
  |      OwnerTargetActionRef action, ActionAuthorizationBasisRef basis)
  | -> dedup/result/SafeAuditRecord
  v
BridgeCommandResult: local action binding active; not Decision
```

关键设计点：

- 事务切口：TX3；受权action binding与dedup/result/audit原子；owner状态仍owner truth。
- 边界与禁止：只能已获准source/受众形成action；平台管理员、低敏感或签名不替正式责任链；private token不存对象。
- 测试切口与03承接：来源未accepted、跨actor/target/action、owner revision变更、expiry资格缺失；03闭绑定唯一性/one-use与正式action surface。



### U5 关键处理流

#### U5处理流停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 接口覆盖/对象已定义 | pass | C06/J02/J03独立图；§6 DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord与U5/U6支撑 |
| 接缝/UoW/层级 | pass | 外呼不包事务，current basis与unknown不省；typed函数不写完整链/SQL |
| 缺口 | preserved | 正向owner/platform/consumer资格blocked时不外呼，BR-UP未关闭 |


#### ReconcileStreamGapJob 处理流

图类型：处理流图；归属U5 / J03 / U5-C2 / C4；Application沿§7；使用§6 DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord，跨部分U5/U6对象与§5接缝不变。

```text
Job -> existing GapRecord + StreamCursor in exact namespace/stream/epoch
  |
  v
RecoveryJob: current scope/comparator/window/coverage qualification
  | non-comparable/missing source -> incomparable/manual, no watermark advance
  v
AuthoritativeRecoveryPort: qualified range/coverage and safe replay refs
  | permitted safe replay -> original consumer/operation through normal guards
  | no raw body inbox or regenerated owner operation
  v
UoW: accepted coverage for this cursor kind + original gap range
  | -> GapRecord.close(AuthoritativeCoverageRef coverage)
  | -> StreamCursor.advance(ComparablePositionRef candidate,
  |      ContinuityCoverageRef coverage, ExpectedCursorRevision expected)
  | -> safe audit; unresolved positions remain gap
  v
GapRecoveryJobResult; list/page completion != authoritative coverage
```

关键设计点：

- 事务切口：TX10；coverage必须绑定stream/epoch/kind/range和相应已知disposition；CAS gap/cursor/audit同UoW。
- 边界与禁止：protocol覆盖不替owner/effect处理位置；源读返回page并不证明业务接纳；安全ref缺失不能自动replay。
- 测试切口与03承接：跨epoch、无comparator、部分coverage、范围失效、cursor CAS冲突、raw replay禁入；03闭比较器、coverage完整性与逐cursor kind规则。



#### ReconcileBridgeOperationJob 处理流

图类型：处理流图；归属U5 / J02 / U5-C4；Application沿§7；使用§6 DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord，跨部分U5/U6对象与§5接缝不变。

```text
Job -> existing authorized RecoveryRecord + original subject/op/effect
  |
  v
RecoveryJob: current scope/window -> matching authoritative read-only probe
  | unavailable/expired/no contract -> blocked/manual, retain unknown
  v
AuthoritativeRecoveryPort (outside UoW, never create/send/approve)
  | known accepted -> finalize_only
  | known no-effect + current eligibility -> same_effect_retry_eligible
  | unknown -> manual; no blind effect recreation
  v
UoW: original record disposition + RecoveryRecord.resolve(
  |      AuthoritativeProbeResultRef result, SafeRecoveryResolutionKind kind)
  | -> safe audit; retry eligible goes back to same intent/lane only
  v
RecoveryJobResult; reconciliation is not new business success
```

关键设计点：

- 事务切口：TX9；probe无owner/platform写，局部结果对账UoW；不把lease/超时当probe结果。
- 边界与禁止：known成功只能finalize；unknown缺源/窗口留manual；owner action和handoff只原operation对账，不能改target/material。
- 测试切口与03承接：无probe、原scope撤销、late结果竞争、known成功不再外呼、no-effect不足、预算过期；03闭逐subject recovery union与来源资格。



#### RequestBridgeRecovery 处理流

图类型：处理流图；归属U5 / C06 / U5-C4；Application沿§7；使用§6 DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord，跨部分U5/U6对象与§5接缝不变。

```text
Command -> explicit authorized recovery entry
  |
  v
ContinuityApplication: resolve existing subject/scope + original op/effect
  | -> current recovery authority / probe/coverage / window/budget
  | missing source/window -> blocked/manual, no new effect
  v
UoW: recovery namespace key + original subject association
  | -> RecoveryRecord.request(OriginalRecoverableSubjectRef subject,
  |      RecoveryAuthorizationRef basis, OriginalOperationEffectRef operation)
  | -> requested/result/dedup/SafeAuditRecord
  v
BridgeCommandResult: recovery ref; only later qualified job probes
```

关键设计点：

- 事务切口：TX4；恢复请求不直接重发/approve；requested与去重/audit原子。
- 边界与禁止：显式维护而非query副作用；原operation/effect与subject不变，scope resolver先行。
- 测试切口与03承接：subject无权限/不存在、原operation错链、过期预算、同key变义；03闭recovery carrier、授权与人工处置。



### U6 关键处理流

#### U6处理流停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 接口覆盖/对象已定义 | pass | E04/J04/Q01/Q02/Q03/Q04独立图；§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView与U5/U6支撑 |
| 接缝/UoW/层级 | pass | 外呼不包事务，current basis与unknown不省；typed函数不写完整链/SQL |
| 缺口 | preserved | 正向owner/platform/consumer资格blocked时不外呼，BR-UP未关闭 |


#### GetSafeHandoffView 处理流

图类型：处理流图；归属U6 / Q04 / U6-C3；Application沿§7；使用§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView，跨部分U5/U6对象与§5接缝不变。

```text
Query -> ActorContext + QueryMetadata -> SafeReadApplication
  | -> resolve existing audit/handoff subject + current read qualification
  | denied/unavailable -> explicit safe disposition
  v
Read-only existing SafeAuditRecord / SafeHandoffRecord slice
  | local record / actual consumer disposition remain distinct
  v
BridgeLocalView.from_existing(BridgeViewSubjectRef subject,
  ExistingLocalSnapshot snapshot, CurrentReadQualification read_basis)
  v
BridgeReadResult: qualified / degraded / denied / unavailable (no evidence)
```

关键设计点：

- 事务切口：TX-Q；不写读取审计、handoff intent或consumer结果。
- 边界与禁止：body-free audit只是本地历史，不发report/evidence/verdict；producer准入缺口不能显示为已accepted。
- 测试切口与03承接：未准入vsaccepted、敏感basis/ref/count隐藏、query无logbody/secret、no-write spy；03闭safe query结果与资格来源。



#### GetContinuityView 处理流

图类型：处理流图；归属U6 / Q03 / U6-C3 / U5；Application沿§7；使用§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView，跨部分U5/U6对象与§5接缝不变。

```text
Query -> ActorContext + QueryMetadata -> SafeReadApplication
  | -> resolve continuity subject/scope + current read qualification
  v
Read-only existing dedup / cursor / gap / lane snapshot
  | non-comparable/gap/cooldown stays explicit; denied refs/counts hidden
  v
BridgeLocalView.project(CurrentReadQualification read_basis,
  ExistingLocalSnapshot snapshot)
  | no cursor advance / lease release / retry / repair / qualification refresh
  v
BridgeReadResult: qualified / degraded / denied / unavailable
```

关键设计点：

- 事务切口：TX-Q；只读连续性slice，位置摘要受scope/epoch可见性过滤。
- 边界与禁止：view freshness不证明gap覆盖或effect完成；no comparator不能在view中计算全球水位。
- 测试切口与03承接：跨epoch过滤、隐藏gap/count、cooldown read不派发、分页scope一致性；03闭只读safe projection。



#### GetBridgeOperationView 处理流

图类型：处理流图；归属U6 / Q02 / U6-C3；Application沿§7；使用§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView，跨部分U5/U6对象与§5接缝不变。

```text
Query -> ActorContext + QueryMetadata -> SafeReadApplication
  | -> resolve operation subject/scope + current read qualification
  | denied/unavailable -> explicit disposition; do not probe owner/platform
  v
Read-only existing inbound / intent / attempt / receipt / callback / recovery slice
  | independent stages and original operation refs, only visible material
  v
BridgeLocalView.project(CurrentReadQualification read_basis,
  ExistingLocalSnapshot snapshot)
  v
BridgeReadResult: qualified / degraded / denied / unavailable
```

关键设计点：

- 事务切口：TX-Q；纯读现存阶段；未知按未知返回，不对账或写trace。
- 边界与禁止：不使用统一success，不把ACK/accepted/Turn/receipt合并；隐藏不可见result refs，no rawbody。
- 测试切口与03承接：indeterminate保留、ACK/Turn区别、敏感refs隐藏、no-write spy；03闭每stage slice字段来源。



#### GetBindingMappingView 处理流

图类型：处理流图；归属U6 / Q01 / U6-C3 / U1；Application沿§7；使用§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView，跨部分U5/U6对象与§5接缝不变。

```text
Query -> ActorContext + QueryMetadata -> SafeReadApplication
  | -> resolve existing binding/mapping subject and authoritative read scope
  | denied -> denied (hide refs/counts); qualification unavailable -> unavailable
  v
Read-only existing installation/relation/mapping snapshot
  | stale/not-ready -> permitted degraded result, never refresh qualification
  v
BridgeLocalView.from_existing(BridgeViewSubjectRef subject,
  ExistingLocalSnapshot snapshot, CurrentReadQualification read_basis)
  | visibility filter includes counts/parent refs/source metadata
  v
BridgeReadResult: qualified / degraded / denied / unavailable
```

关键设计点：

- 事务切口：TX-Q；无本地写UoW，允许只读一致性snapshot；不写audit/dedup/cursor。
- 边界与禁止：即使读audit需求存在，也不能经本Query维护；scope由resolver不是mapping显示名或projection倒推。
- 测试切口与03承接：hidden count/ref、不同actor同subject、snapshot not-ready、denied非empty、并发generation；03闭query DTO/视图与无写证明。



#### RetrySafeHandoffJob 处理流

图类型：处理流图；归属U6 / J04 / U6-C2；Application沿§7；使用§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView，跨部分U5/U6对象与§5接缝不变。

```text
Job -> existing canonical SafeHandoffRecord + current admission/window
  |
  v
SafeHandoffApplication: resolve original material/op + current qualified schema
  | no canonical material/admission -> blocked, no fabricated outbox
  | known consumer accepted -> local finalize only
  | unknown -> authoritative same-op read; no blind re-handoff
  v
UoW-A: qualified pending/same-op retry eligibility -> dispatching + safe audit
  |
  v
SafeObservationPort (outside UoW): identical canonical safe material/op
  | known result -> real disposition; ambiguous -> indeterminate
  v
UoW-B: SafeHandoffRecord/result/safe audit
  v
SafeHandoffJobResult; no report/EV/verdict construction
```

关键设计点：

- 事务切口：TX11；仅schema/admission已绑定才有handoff；网络外；原consumer op不更换。
- 边界与禁止：只已知未接纳且具重交资格的安全材料才续交；unknown无权威结果留indeterminate/manual；本地audit不证明consumer accepted。
- 测试切口与03承接：admission缺口、consumer timeout、canonical material过期、A/B crash、重复同op、body/secret泄漏；03闭consumer查询/结果/幂等窗口。



#### SafeHandoffDispositionConsumer 处理流

图类型：处理流图；归属U6 / E04 / U6-C2；Application沿§7；使用§6 SafeAuditRecord、SafeHandoffRecord、BridgeLocalView，跨部分U5/U6对象与§5接缝不变。

```text
Consumer <- formally qualified consumer-result envelope
  | -> event/source/key + admission/schema + exact original handoff/op
  | absent/tampered/cross-scope -> rejected/blocked
  v
SafeHandoffApplication: resolve existing safe handoff and current scope
  | known duplicate -> visible original disposition; no new handoff
  v
UoW: result event dedup + SafeHandoffRecord.apply_consumer_result(
  |      ConsumerDispositionRef result) + SafeAuditRecord
  v
HandoffConsumeResult: actual consumer disposition, not evidence/verdict
```

关键设计点：

- 事务切口：TX7；消费真实canonical结果与handoff状态/去重/audit同本地UoW，不反写consumer真相。
- 边界与禁止：producer/consumer资格未绑定保持blocked；拒绝输入不造accepted event。已知accepted不等Observability evidence或本项目验收。
- 测试切口与03承接：伪consumer/跨operation、重复结果变义、准入撤销、unknown不冒充accepted、body禁入；03闭admission/source-result协议。



### 处理流覆盖与跨审

| 接口 | 是否画独立处理流 | 原因 |
|---|---|---|
| C01 ConfigureBridgeInstallation / U1 | 是 | P0局部truth mutation |
| C02 ManageExternalBinding / U1 | 是 | P0局部truth mutation |
| C03 MaintainExternalMapping / U1 | 是 | P0局部truth mutation |
| C04 PrepareExternalDelivery / U3 | 是 | P0局部truth mutation |
| C05 BindExternalAction / U4 | 是 | P0局部truth mutation |
| C06 RequestBridgeRecovery / U5 | 是 | P0局部truth mutation |
| E01 PlatformInputReceivedConsumer / U2 | 是 | 改写局部disposition/索引/one-use/intent |
| E02 CommittedSourceAvailableConsumer / U3 | 是 | 改写局部disposition/索引/one-use/intent |
| E03 PlatformCallbackReceivedConsumer / U4 | 是 | 改写局部disposition/索引/one-use/intent |
| E04 SafeHandoffDispositionConsumer / U6 | 是 | 改写局部disposition/索引/one-use/intent |
| O01 BridgeLocalDispositionRecordedEvent / U6 | 否 | O01是已提交阶段传播，不是请求入口；仅canonical/admission成立的mutation与J04交接流程承接 |
| J01 DispatchQueuedDeliveryJob / U3 | 是 | 影响一致性或传播可靠性，必须独立图 |
| J02 ReconcileBridgeOperationJob / U5 | 是 | 影响一致性或传播可靠性，必须独立图 |
| J03 ReconcileStreamGapJob / U5 | 是 | 影响一致性或传播可靠性，必须独立图 |
| J04 RetrySafeHandoffJob / U6 | 是 | 影响一致性或传播可靠性，必须独立图 |
| J05 RefreshBridgeQualificationJob / U1 | 是 | 影响一致性或传播可靠性，必须独立图 |
| Q01 GetBindingMappingView / U6 | 是 | 含visibility裁剪、denied/unavailable、stale/degraded，必须独立图 |
| Q02 GetBridgeOperationView / U6 | 是 | 含visibility裁剪、denied/unavailable、stale/degraded，必须独立图 |
| Q03 GetContinuityView / U6 | 是 | 含visibility裁剪、denied/unavailable、stale/degraded，必须独立图 |
| Q04 GetSafeHandoffView / U6 | 是 | 含visibility裁剪、denied/unavailable、stale/degraded，必须独立图 |

| 跨审项 | 结论 | 依据 |
|---|---|---|
| 覆盖 | pass | 19请求入口独立图，O01非入口有明确条件承接；无隐式新增业务helper |
| 对象/参数 | pass | 所有局部状态对象来自Step6；点名函数与卡同名typed参数，support carriers留03 |
| effect竞争 | pass | C04/E02共享validated semantic effect唯一，key namespaces不能替effect唯一 |
| 网络/UoW/unknown | pass | private material/secret/owner/platform网络均在事务外；先durable原op后IO，结果分层并保unknown |
| cursor与回放 | pass | 同stream/epoch/comparator/coverage及对应阶段disposition；safe refs重走原consumer，无raw inbox |
| query | pass | 四独立图只读资格+现存snapshot，无audit/dedup/refresh/probe/repair |
| 材料/产品/上游 | preserved | rawbody/digest/secret/敏感Gate均禁；平台支持/产品未选；BR-UP保持原状态 |

设计测试切口按01§11.5 / 00 AC-BR-001~038反查：U1跨kind/tenant/撤销/config/secret，U2来源/回环/owner required input/变化/unknown，U3投影/附件/effect/IO crash/429，U4scope/action/one-use/expiry/owner二核，U5key/epoch/coverage/lane/probe/manual，U6producer/admission/query-no-write/所有出口no-body。这里只是05待设计的切口，不创建fixture/测试结果/证据。


## 8. 回填草稿

正式§8使用通用规则/覆盖清单、按六U与入口ID顺序回填19独立图及关键设计点；保留typed参数/UoW/crash/测试切口与03责任，不纳停审过程。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

六U流程停审及跨审pass；19入口独立图、typed参数、事务/外呼边界、unknown/coverage/no-write出口与测试切口齐全。gate_status=pass；gate_reason=flow_coverage_closed；next_allowed_action=step09_state_subjects；formal_backfill_allowed=after_step14；commit_required=false。
