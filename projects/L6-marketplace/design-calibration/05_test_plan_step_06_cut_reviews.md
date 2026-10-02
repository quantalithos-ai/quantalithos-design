# Step 6 切口独立停审记录

本附录属于[Step6主控](05_test_plan_step_06_cases.md)。下列pass仅表示设计自审，不是执行passed、用户确认或owner signoff。每个CUT先回读来源、分析风险、选择发现层，再绑定数据/TC/EV及停审；TC主表保留唯一断言，本文解释切口是否闭合。共享spy和参数化库存不按切口重新分配编号。

## CUT-MP-01 contract codec

输入：03 Step8七U/shared surface、Step6 shared/runtime类型，49Request的完整字段已回核。问题：二级类型和Option条件可能在只测Request表层时遗漏。诊断：typed JSON accepted不是authority；缺字段和unsafe额外字段不能被忽略。

取舍：采用CROSS-011全部可达schema递归闭包，CROSS-007/018补entry；不采用仅前后serialize字节相等的单测试。数据DS-BASE/SECURITY按每required删除、unknown tag、错ref kind、None/Some条件展开；输出完整字段逐值比对。

正/反：每入口合法decode/encode与一个独立字段变异，拒绝InvalidInput/UnsafeMaterial等正式映射；37HTTP不得公开12Job。主suite D/W；EV-UNIT-003、EV-API-002/003。

停审：pass（设计）；字段来源唯一、无新DTO/metadata影子、参数化覆盖49与嵌套类型。运行未执行。下一切口读43对象factory/Row及14状态矩阵。

## CUT-MP-02 domain guards

输入：03 Step6/10七U、U2 Draft/Submit、U3 Staged/List、U5 NoticeIntent。问题：合法state没有conditionrefs仍可能被错误rehydrate。诊断：旧Draft提前basis和错误NoticeAttempt均须删除；MatchedDecision可含rejected。

取舍：CROSS-012/013按完整对象与pair库存，而非九族happy主线。数据DS-BASE/SOURCE/REVIEW/CATALOG/WITHDRAWAL；合法factory初态、每condition field缺失、guard false和terminal尝试复活。

正/反：43对象pure valid/invalid factory/member/rehydrate；222pair中的73A逐guard、S分类、R零改动；具体Draft None、Submit freeze、withdraw terminal、record matched rejected等业务TC共同反查。主suite D；EV-DOMAIN-027/028，业务EV沿Step5。

停审：pass（设计）；不新增第15carrier，不把Unknown当所有enum。fake、PG不可代替纯guard判断。下一切口读公开ports与49独立flow。

## CUT-MP-03 flow ports

输入：03 Step7 typed_ports/application callables、Step9全部49flow。问题：fake能否经私有map/getter绕过真实port？诊断：只计少数常用method不足以证明146methods完整返回与错误映射。

取舍：CROSS-014编译/adapter conformance+各业务TC流水顺序；不采用动态万能JSON/任意target补口。数据DS-BASE及七U DS，按每公开method success/failure/required字段缺失注入，外部call与SQL Tx持有spy交叉检查。

正/反：调用顺序、唯一associated Tx、complete result/report、no SQL during ownercall、所有签名/finite error/result验证；公开body candidate不变formal authority。主suite I/S；EV-UNIT-004与七U主EV。

停审：pass（设计）；17/146 conformance库存显式，49入口逐行主TC已绑定。真实SDK exact consumer仍blocked。下一切口读sameTx写集与真实PG帧/CAS。

## CUT-MP-04 atomic write set

输入：03 Step11§7.2～7.7、Step15 producer inventory。问题：审计/O职责/完整result是否可能不同事务提交？诊断：fake rollback不能证明真实PG history、frame、FK与CAS。

取舍：CROSS-015逐21C/12J写点fault+真实PG，CROSS-003 frame/revision测试；不采用每test一个包围rollback Tx掩盖commit。数据DS-PG真实独立连接，观察者在commit/rollback边界检查可见性。

正/反：C全write set；J A/B分开，B新load/revision/cursor；work+plan/audit/fullresult/Completed同帧；21C+8J O/no recursion；每save/append/complete故障整段rollback、旧A不丢。主suite P；EV-PG-019/017。

停审：pass（设计）；PG不可用必须unavailable/block gate；不声称外部原子性。下一切口读A未知、external后crash与原report恢复。

## CUT-MP-05 A/B/Unknown

输入：03 Step9 job_execution、Step12恢复矩阵、U2/U4/U5/U6 Job。问题：disconnect/timeout/expired lease是否被当notcommit？诊断：一次RO missing不能证rollback；恢复不应按current view重造原report。

取舍：原checkpoint/permission probe-first；不使用automatic5xx retry或换key/intent。数据DS-REVIEW/DISTRIBUTION/WITHDRAWAL/RECOVERY，barrier fault于A前/A commit unknown/A后/external后/B前/B unknown，probe分别formal confirmed/notcommit/unknown/no-probe。

正/反：REVIEW-006、DISTRIBUTION-006/010、WITHDRAWAL-008、RECOVERY-005/006/010、CROSS-019；原fullreport与late责任保留，缺report原Reserved waiting。主suite I/W/R；EV-DOMAIN-012、EV-WORKER-006/010/021、EV-DOMAIN-024、EV-RECOVERY-005/006/010。

停审：pass（设计）；无probe不pass成功，正式notcommit才允许currentgate下合法retry；真实外部proof blocked不关闭。下一切口读canonical33与key来源。

## CUT-MP-06 canonical/idempotency

输入：03 Step13§7.1～7.3、Core actor字段和原完整result规则。问题：hash任意Serde或key normalization会使原意图错误相等。诊断：body全字段、actor/delegate/scope必须参与，meta/display/locale不参与；资产digest与intent fingerprint不同。

取舍：CROSS-001/002完整33DTO sealed投影，RECOVERY-001/002及各C/J original replay；不手拼JSON或做Unicode/trim normalization。DS-BASE枚举每叶business字段及u64/null/tag/Set/order；DS-RECOVERY包含不可变原result与当前披露收缩。

正/反：same canonical完整原result零副作用；same key异canonical IdempotencyConflict；Reserved OperationInProgress；wrongkind/missingfullresult IntegrityFailure；targets保序。主suite D/R/W；EV-UNIT-001/002、EV-RECOVERY-001/002、EV-WORKER-003/004。

停审：pass（设计）；无编造digest值/TTL，原结果允许全披露才完整返回。下一切口读七paged caller与current visibility。

## CUT-MP-07 page/current visibility

输入：03 Step7 PageReadContext、Step13§7.6、七Query caller。问题：count/token与item过滤不一致及opaque ref推scope。诊断：GetSourceQualification等九nonpaged详情不能被附会分页；WithdrawalImpact仅notice页，saved relation sets仍受披露。

取舍：CROSS-017逐七method actor/delegate/scope/selector/filter/upper/after参数化；不把token checksum当授权。DS-PG/CATALOG含多scope、同frame多PK、hidden anchor、parent变化和visibility收缩。

正/反：稳定current filtered items/count/token；method-selector错/position family错/upper越界/不可见anchor→InvalidInput安全不echo；source highwater变动→Degraded Stale/重启，不假空。主suite P；EV-PG-021、EV-PG-007/008/010。

停审：pass（设计）；七caller显式传actor原值，不从HTTP/privatefake补身份，纯Query零写另由CUT12验证。下一切口读publisher/version许可及cancel/late竞争。

## CUT-MP-08 version/withdraw race

输入：03 Step11/13局部锁序、U4 late outcome、U5 fixedupper responsibility。问题：撤回能否删除旧许可/late结果，或承诺外部同步撤销？诊断：本地序列化不是跨owner事务。

取舍：CROSS-016真实PG两个commit顺序，DISTRIBUTION-007及WITHDRAWAL-005补业务state；不使用remote cancel假成功。DS-PG多connection/barrier，同version多disposition，B outcome cursor晚于upper。

正/反：publisher→version锁序；withdraw先commit禁止新admission/permission；反序真实原intent晚结果仍attach并每适用disposition增加Partial/work；Cancelled与Confirmed共存不复活版本。主suite P/W/S；EV-PG-020、EV-WORKER-007、EV-DOMAIN-021。

停审：pass（设计）；禁止历史delete与ownertruth写入；late scope仍正式核验。下一切口读as-of/sourcekind/fullmanifest/搜索谓词。

## CUT-MP-09 projection/search

输入：03 Step11 fact history、四projection kind依赖谓词、Step13cursor、U7 Rebuild。问题：跨页更新遗漏与manifest缺项错误Fresh；维护audit可能无限使自身Stale。

取舍：CROSS-004/017真实PG搜索/历史，REFERENCE-001～006 body-free成对读写；不从旧index重建truth，不承诺中文分词/SLO。DS-REFERENCE/PG含Rendered/Omitted、missing/duplicate/空required、sameframe不同PK、upper后更新、unrelated kind。

正/反：latest<=upper历史扫描、完整manifest/payload/state同Tx、currentfilter-beforecount；literal-substring OR simpleFTS；unrelated scope/kind及lease/Oreceipt/selfaudit不循环。主suite P；EV-PG-011～016/018/021（实例tc_refs逐值，不使用范围）。

停审：pass（设计）；缺body/历史 IntegrityFailure，不视不存在；perf candidate未硬化。下一切口读04全部域/七字段/八slot/profile。

## CUT-MP-10 config boundary

输入：04§5～11，03 RuntimeConfig/adapter builder，六域/七字段/八slot/四profile。问题：配置完整是否会被当作Bound/批准？诊断：rawsecret/业务绕过键以及prototype9090不能成为正式默认。

取舍：CONFIG-001～012及CROSS-009/022逐层loader/validator/builder故障；不新增TLS/auth/CORS/Billing字段。DS-CONFIG覆盖重复/unknown/type/null/source conflict、ref不可达、resource cleanup、fake profile与En/Zh唯一安全默认。

正/反：valid typed mapping仅metadata剥离；缺slot Blocked，production fake拒绝；startup/Build-time边界；每失败0listener/claim/effect。主suite C；EV-CONFIG-001～014逐TC双射，不是证据实例范围。

停审：pass（设计）；CI复用test，不创建第五profile；profile预算来源缺时不编生产上限。下一切口读safe audit/finite metrics/Observation生产和防递归。

## CUT-MP-11 security/observation

输入：03 Step15所有入口inventory、safe六字段audit、Step12 safe errors、04§8。问题：完整report/诊断是否复制正文或把Obs receipt当evidence？诊断：Observation原auditset必须与business commit绑定，当前Job audit不能替换。

取舍：CROSS-006全sink sentinel扫描、RECOVERY-007/008/009完整原binding、CROSS-015 atomic producer；不采用一句“已脱敏”或signature/ACK证明审核。DS-SECURITY/RECOVERY/PG包含错误回显、rawsecret/body、缺资格/错auditset、Obs自身audit。

正/反：有限entry/adapter/code/phase/state labels、refs-only audit；21C+8J O，RunRecovery只P，Obs2/Rebuild无O/P；无producer qualification Blocked/noeffect。主suite X/R/P；EV-REDACTION-001、EV-RECOVERY-007/008/009、EV-PG-019。

停审：pass（设计）；0Archive writer，local audit/receipt/evidence三层分离。下一切口读全Query与original replay的资源禁止清单。

## CUT-MP-12 query/replay no-write

输入：03 Step9全16Q、Step13 original result规则、Step15埋点。问题：详情查询、audits查询或重放是否悄悄refresh/新context？诊断：只看DB row diff无法发现ID/Clock或owner调用副作用。

取舍：CROSS-005全16Q+33original replay spy，再由各业务TC验证其结果；不只对GetOperationResult抽样。DS-BASE各Q valid/hidden/missing/degraded，各C/J合法immutable完整result/current disclosure收缩，记录每可变资源count前后。

正/反：零writeTx/ID/Clock/context/audit/work/O/P/effect；仅current formal read+RO、整体全披露才原payload；hidden无refs/count/replay header。主suite W/S；EV-API-001及七Uquery相关主EV。

停审：pass（设计）；任何writer spy调用即失败，无“日志所以补audit”豁免。下一切口读Web protocol shape/locale/workflow。

## CUT-MP-13 Web semantics

输入：03 Web模块/Step8读写surface、04 public API base和default_locale、00 NFR-G04。问题：UI能否把局部进展映成approval/installed或locale触发重复提交？诊断：原型只展示，不是正式Vue验证证据。

取舍：CROSS-008/021完整UI状态/DTO及workflow，CONFIG-009/011 build/display边界；不以截图代替domain/PG或真实owner资格。DS-WEB包含五内容显示类型、多listing/multiversion、loading/empty/denied/degraded/unknown、wrongDTO与取消竞争。

正/反：初次En/切Zh/回En，所有文案与状态完整，ref/enum/key/fingerprint不变、不二次submit；invalidDTO拒渲染假成功，按钮由API/current gate决定而非自行认证/批准。主suite B；EV-WEB-001/002，配置EV按Step5。

停审：pass（设计）；不修改原型，不运行浏览器，不创建截图/evidence。下一执行跨切口断言和库存审计。

## 跨切口断言/phase审计

| 审计项 | 结论（设计） | 修正/证明上限 |
|---|---|---|
| CUT与TC | 13CUT均有至少正/反、数据、suite/EV、独立停审 | 98TC不等98subcase；库存展开数量必须另检查 |
| 共享断言重复 | 通用规则在Step6§7.1定义一次 | 各CUT引用同一TC不会分配重复EV |
| 字段/schema | 49入口索引业务字段逐Request回核 | 输出与nested来源仍03唯一，不造第二套schema |
| state/error | 正式14enum与18ErrorCode | 已修Draft/basis、listing gate、CommitUnknown/ContractBlocked、NoticeIntent、IdempotencyConflict |
| no-write | 全16Q及33original replay | 不是“no SQL mutation”就忽略Clock/ID/context/effect |
| PG/fake | conformance与真实frame/as-of/CAS分层 | 没真实PG必须unavailable，controlled不能替代 |
| 数据/EV | DS定义由Step7承接，Step5唯一双射 | 实例tc_refs逐值，禁止glob、跨run/latest或静态pass |
| phase/owner | 本地进展与owner truth分离 | MatchedDecision非批准，Confirmed非安装/送达；真实positive blocked |
| 后续文档 | 05只测试设计，06裁决/07实施 | 无真实run/digest/evidence/signoff/readiness |

门禁：本附录13个CUT设计审查完成，跨项无未记录本地冲突；数据和证据执行细节继续Step7～13，本轮运行仍not-run。
