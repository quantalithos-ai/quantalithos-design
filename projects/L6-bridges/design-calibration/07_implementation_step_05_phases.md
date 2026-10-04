# L6-bridges 07 Step5：实施阶段与依赖顺序

## 1. Step状态与Step内计划

2026-10-04；done_design_static；SOP Step5 / 书写§5.5；仅设计校准，正式回填由Step13单独门禁控制。

| 小阶段 | 状态 | 产物/门禁 |
|---|---|---|
| 输入和前序结论 | read | §2/当前正式来源 |
| SOP问题回答 | done_design_static | §3 |
| 材料诊断/前后对比 | done_design_static | §4/5 |
| 取舍与复杂度 | done_design_static | §6 |
| 结构化产物 | done_design_static | §7 |
| 回填草稿 | done_design_static | §8 |
| 待确认 | done_design_static | §9 |
| 实际静态自检 | done_design_static | §10；无项目测试 |

| 模块 | gate_status | next_allowed_action | source_files |
|---|---|---|---|
| step_05 | pass | enter_step_06 | Step4交付面；03§16.8七闭包；05/06计划与门禁；SOP Step5逐phase约束 |

当前Step仅建立整体模块骨架；逐phase/boundary/gate微循环记录在§10，不先填全族再补思考。

## 2. 输入

Step4交付面；03§16.8七闭包；05/06计划与门禁；SOP Step5逐phase约束。前序问题、诊断、取舍和未决全部承接；actual blocker不关闭。

## 3. SOP问题回答

阶段按可验证纵切：安全验证→授权mapping→入站gap→外显delivery→callback→原恢复/审计→actualseams→全证据；同项目始终串行。所有阶段首含required前置DTO/read-save/audit，actualspike不后置到首次外呼。

## 4. 材料诊断

按层先业务后安全会缺UoW/current/result；把API/Jobs schema后移但service当前已消费则破phase；运行A/B/C/R/D不是实施phase。

## 5. 前后对比

| 当前风险 | 本步校准 |
|---|---|
| 按层先业务后安全会缺UoW/current/result；把API/Jobs schema后移但service当前已消费则破phase；运行A/B/C/R/D不是实施phase。 | 定义八phase独立微循环，每phase只给增量/来源/排除/门禁，下一Step再赋boundary。local受控资格仅testfixture不外呼；actual闭包不释放前不做IO。 |

## 6. 取舍与复杂度

定义八phase独立微循环，每phase只给增量/来源/排除/门禁，下一Step再赋boundary。local受控资格仅testfixture不外呼；actual闭包不释放前不做IO。

## 7. 结构化中间产物

### 5.1 PH-01 可复现安全验证与资格预检

| 项 | 规范合同 |
|---|---|
| 可验证增量 | 授权后建立可编译七role布局、真实依赖核验与05安全harness，使后续测试结果能被拒假/拒泄漏，不运行业务IO |
| 依赖/输入 | 用户实施授权/真实design commit/目标仓/工具/Core exact exports |
| 交付/可审查输出 | workspace/tool规则、11target发现规则、7script安全I/O与schema检查；缺actual资格明确blocked |
| 明确排除 | 业务effect/任意平台产品pin/假账号/把harness正例fixture当run |
| 正式来源 | 03§3/4/16.5；04§7~9；05§9.5/13；06§10/11 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-SURFACE、CUT-BR-EVIDENCE、CUT-BR-CONFIG、CUT-BR-PRIVATE对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.2 PH-02 授权绑定与三映射本地闭环

| 项 | 规范合同 |
|---|---|
| 可验证增量 | 把C01~03与四Q完整no-write读取落成可验证local纵切，包含shared DTO、wholeCAS/dedup/result、current及audit而不外呼 |
| 依赖/输入 | PH-01；fake同durable原语语义/授权basis受控fixture |
| 交付/可审查输出 | local UoW/commitproof/fault测试、installation/binding/三mapping/read；安全失败与stored replay |
| 明确排除 | external_id创建内部身份/实际绑定授权/临时private lookup/future平台调用 |
| 正式来源 | 03§8 C01~03/Q01~04、§9 M01~05/12、§10/12/16；06§5~8 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-BIND、CUT-BR-MAP、CUT-BR-KEY、CUT-BR-LOCAL、CUT-BR-READ、CUT-BR-AUDIT、CUT-BR-STATE对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.3 PH-03 入站变化与游标缺口闭环

| 项 | 规范合同 |
|---|---|
| 可验证增量 | E01来源验证/bridge-origin/防回环/原ownerhandoff与变化；J03两coverage/原cursor/unknown，ACK独立 |
| 依赖/输入 | PH-02；source/owner/current/comparator fake合同，actual仍未建立 |
| 交付/可审查输出 | inbound record与source差异、StreamCursor/GapRecord、既有subject J03/entrysafe结果 |
| 明确排除 | 以ACK或poll offset证明Turn提交/GapClosed即推进/newTurn或raw replay |
| 正式来源 | 03§8 E01/J03、§9 M06/13/14、§11~12；06§5/7/8 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-INBOUND、CUT-BR-CHANGE、CUT-BR-CURSOR、CUT-BR-ENTRY、CUT-BR-RECOVERY对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.4 PH-04 安全外显与有界投递闭环

| 项 | 规范合同 |
|---|---|
| 可验证增量 | C04/E02/Q02安全材料规划、附件ref与J01原effect/attempt/receipt/lane，Gate敏感降级 |
| 依赖/输入 | PH-03；localreceipt/probe/current fake规范齐，不要求actual假positive |
| 交付/可审查输出 | presentation/delivery与known/unknown/rate/NoIo合法分支、安全读取和job最小入口 |
| 明确排除 | 未授权外呼/2xx即送达/正文或附件缓存/hidden SDKretry/new未知effect |
| 正式来源 | 03§8 C04/E02/J01/Q02、§9 M07~09/15、§10~13；06§5~9 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-PRESENT、CUT-BR-ATTACH、CUT-BR-DELIVERY、CUT-BR-RATE、CUT-BR-PRIVATE对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.5 PH-05 回调责任与one-use闭环

| 项 | 规范合同 |
|---|---|
| 可验证增量 | C05定义获准action，E03验证platform与internalactor/current后调用正式owner动作 |
| 依赖/输入 | PH-04；Governance/Identity/CallbackVerifier typed合同及受控fixture |
| 交付/可审查输出 | ExternalActionBinding/CallbackHandoffRecord、action/membership/current/expiry/duplicate、敏感降级 |
| 明确排除 | 签名绕Gate/外部按钮即批准/直执行Runtime/回调token入证据 |
| 正式来源 | 03§8 C05/E03；Q02、§9 M10/11；04§8；06§5~8/11 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-CALLBACK、CUT-BR-PRIVATE、CUT-BR-KEY对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.6 PH-06 原操作恢复与非递归审计交接

| 项 | 规范合同 |
|---|---|
| 可验证增量 | 闭合C06/J02/J03/J05同原subject/current/expiry及O01/E04/J04 conditional admission/consumer known-unknown |
| 依赖/输入 | PH-05；全部已有subject/schema/typed result读面，producer rule与probe受控合同 |
| 交付/可审查输出 | RecoveryRecord/SafeHandoffRecord、五J完整invocation、NonRecursiveResultOnly/无新O01 |
| 明确排除 | NotFound=NoEffect/一般新replay/生产者私造/过期claim删原未知/consumeraccepted即EV |
| 正式来源 | 03§8 C06/E04/O01/J02~05、§9 M12~17、§10~14；06§7~11 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-RECOVERY、CUT-BR-AUDIT、CUT-BR-CURSOR、CUT-BR-KEY、CUT-BR-LOCAL、CUT-BR-ENTRY对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.7 PH-07 逐平台与上游actual资格接入

| 项 | 规范合同 |
|---|---|
| 可验证增量 | 各scope实际核durable/secret/owner/source/平台与runtime closed set，四平台单独适配，不把mock升级 |
| 依赖/输入 | PH-06；已批准provider/pin/installation/账号/权限/沙箱/操作范围/预算/retention；缺一阻affected |
| 交付/可审查输出 | same-driverproof、六owner方法资格、四adapter差异与body-free错误、API/Worker/Jobs实际模式及shutdown |
| 明确排除 | 默认SDK/OAuth/KMS/router/DB/executor、Chat消费、未选optional强制、platformtruth或越权测试 |
| 正式来源 | 03§6 Infra/API/Jobs/Worker及§13/14；04§7~14；05§8/9/14；06§7/9/13 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-REAL、CUT-BR-LOCAL、CUT-BR-CONFIG、CUT-BR-PRIVATE、CUT-BR-ENTRY、CUT-BR-STATE对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.8 PH-08 全量证据审查与人工交接

| 项 | 规范合同 |
|---|---|
| 可验证增量 | 同固定run闭合全116TC/22EV/139gate与四平台/mandatory参数分母，经两check产报告和draft交接 |
| 依赖/输入 | PH-07全部required资格及完整TC参数/数据/工具/runtime批准；实际结果与immutable baseline |
| 交付/可审查输出 | 安全fixed-run context/case/suite/index/check/EV/report/Handoff draft，剩余blocker如实交接 |
| 明确排除 | staticplan生成pass/selectedsubset删P0/机器verdict/signoff/readiness/未授权生产部署 |
| 正式来源 | 05§9/12/13；06§4/10~14；真相源§九 |
| 门禁 | 当前required前置fields/DTO/typed ref/state/read-save/current闭包；CUT-BR-EVIDENCE、CUT-BR-REAL、CUT-BR-PRIVATE对应TC及06gate；精确TC/EV/check沿本计划§7。actual缺口必须blocked，不以localnegative替代positive |
| 停审 | 每phase收稳后才能进入下一phase设计；实施时该phase每boundary真实gate+Handoff后才推进，用户仍须单独授权实施 |

### 5.9 阶段总图与跨phase约束

#### 阶段依赖图: L6-bridges 实施阶段顺序

```text
[PH-01 safety harness / preflight]
  | enables
  v
[PH-02 local transaction + all Q + authorized maps]
  | depends_on
  v
[PH-03 inbound + source change + cursor gap]
  | depends_on
  v
[PH-04 presentation + bounded delivery]
  | depends_on
  v
[PH-05 verified callback / one-use]
  | depends_on
  v
[PH-06 original recovery + nonrecursive handoff]
  | depends_on
  v
[PH-07 actual qualification + four platform adapters]
  | depends_on
  v
[PH-08 fixed-run complete evidence / human handoff]
```

图示说明：

- 箭头是开发依赖，不是消息调用链或03 A/B/C/R/D运行事务。
- 同项目严格串行；四平台在PH-07也逐boundary推进，不并行agent或并行调用。
- actual资格在每个首次actual读取/调用前闭合；PH-01先定义资格Spike，PH-02~06仅test-only受控fixture，不借PH-07未来结果授权当前IO。

| 依赖链/审查面 | 闭包裁定 | 禁止 |
|---|---|---|
| schema/主语 | 当前功能一开始携完整字段/secondary carrier/typed kind/读取与保存 | 按struct文件裸拆提交或从fake私表推断 |
| wholeUoW/current/审计 | PH-02起与所有mutation同交付，包括conditional canonical/admission与本地blocked语义 | PH-06才补安全；默认audit-only跳过requiredproducer |
| 四Q | PH-02完整resolver/current/typed committedsnapshot/六字段/无写；可从受控完整snapshot测试，不依futurewriter | newID/projection/queryaudit、未来报告来授权读取 |
| Job/worker | 第一次业务flow消费某J即带完整public schema、selection、invocation和result；未激活live transport不是newreserved业务状态 | 把当前Job DTO/result后置到PH-07 |
| 状态范围 | 03全部enum/matrix不改；每boundary新增可执行分支对应TC参数集与guard完整；未完成参数保持planned | 把未实现状态当reserved或缩05/06分母、partial gate宣fullpass |
| actual producer/平台 | 必须当前资格，在private批准渠道核真相；localfixture合同只验证拒绝/受控结果 | 声称已selectedpin/scope/账号/送达/consumer接受 |
| harness与业务材料 | PH-01建立完整05schema/tools；后续每slice真实跑时产partial范围证据；PH-08才全分母审查 | 早期空index/静态plan产EV/verdict；raw编译/SDK日志落盘 |


## 8. 回填草稿

回填正式07§5仅采用§7规范内容；问题、诊断、取舍、过程记录不复制。最终在Step13按目标目录转换链接并逐章装配，不提前写正式07。

## 9. 待确认

BR-UP-001~009 open/010 reference_only、Workspace十二open、Observability十二affected原状态、actual资格及实现授权仍waiting；不由本Step自检释放。

## 10. 自检与过程

PH-01思考：需要授权后建立可编译七role布局、真实依赖核验与05安全harness，使后续测试结果能被拒假/拒泄漏，不运行业务IO；输入=用户实施授权/真实design commit/目标仓/工具/Core exact exports；无业务effect/任意平台产品pin/假账号/把harness正例fixture当run；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-01静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-02思考：需要把C01~03与四Q完整no-write读取落成可验证local纵切，包含shared DTO、wholeCAS/dedup/result、current及audit而不外呼；输入=PH-01；fake同durable原语语义/授权basis受控fixture；无external_id创建内部身份/实际绑定授权/临时private lookup/future平台调用；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-02静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-03思考：需要E01来源验证/bridge-origin/防回环/原ownerhandoff与变化；J03两coverage/原cursor/unknown，ACK独立；输入=PH-02；source/owner/current/comparator fake合同，actual仍未建立；无以ACK或poll offset证明Turn提交/GapClosed即推进/newTurn或raw replay；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-03静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-04思考：需要C04/E02/Q02安全材料规划、附件ref与J01原effect/attempt/receipt/lane，Gate敏感降级；输入=PH-03；localreceipt/probe/current fake规范齐，不要求actual假positive；无未授权外呼/2xx即送达/正文或附件缓存/hidden SDKretry/new未知effect；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-04静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-05思考：需要C05定义获准action，E03验证platform与internalactor/current后调用正式owner动作；输入=PH-04；Governance/Identity/CallbackVerifier typed合同及受控fixture；无签名绕Gate/外部按钮即批准/直执行Runtime/回调token入证据；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-05静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-06思考：需要闭合C06/J02/J03/J05同原subject/current/expiry及O01/E04/J04 conditional admission/consumer known-unknown；输入=PH-05；全部已有subject/schema/typed result读面，producer rule与probe受控合同；无NotFound=NoEffect/一般新replay/生产者私造/过期claim删原未知/consumeraccepted即EV；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-06静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-07思考：需要各scope实际核durable/secret/owner/source/平台与runtime closed set，四平台单独适配，不把mock升级；输入=PH-06；已批准provider/pin/installation/账号/权限/沙箱/操作范围/预算/retention；缺一阻affected；无默认SDK/OAuth/KMS/router/DB/executor、Chat消费、未选optional强制、platformtruth或越权测试；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-07静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

PH-08思考：需要同固定run闭合全116TC/22EV/139gate与四平台/mandatory参数分母，经两check产报告和draft交接；输入=PH-07全部required资格及完整TC参数/数据/工具/runtime批准；实际结果与immutable baseline；无staticplan生成pass/selectedsubset删P0/机器verdict/signoff/readiness/未授权生产部署；区别运行事务stage与开发phase，当前firstrequired carrier/read-save/current不后置。

PH-08静态停审：增量/依赖/排除/原cut存在核对通过，仅设计；实际资格未运行，仍waiting。

八phase逐思考→规范卡→原cut存在检查→停审均已串行完成；cross-phase current闭包、全四Q提前no-write、Job同boundary、安全审计从首次mutation带入；纠正早期Q简称并按03§7精确Q01 BindingMapping/Q02 Operation/Q03 Continuity/Q04 SafeHandoff重审。

Step设计静态自检与规范回指已完成；未运行项目测试/编译/外部IO，不产生实际EV。下一仅顺序Step6。
