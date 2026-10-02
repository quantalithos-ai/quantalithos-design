# Step 11：一票否决项

## 1. Step 状态

SOP Step11/规范5.11；正式§11；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=五项独立停审与覆盖/证据/风险权限审计完成；next_allowed_action=读取Step12缺陷复验规则。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取输入/前序结论 | done | §2 |
| 逐问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 五VETO门禁 | done | §7 |
| 复杂度/逐项停审 | done | 五项主控内独立小循环 |
| 草稿 | done | §8 |
| 跨VETO覆盖审计 | done | §10 |

## 2. 本步输入

source_files：[Step10](06_acceptance_step_10_evidence_audit.md)及完整98归档索引、[00§14五VETO](../00-需求文档.md#一票否决项)、01ownership/依赖、03U1～7/§10～15、[05逐需求反向映射](05_test_plan_step_05_traceability_coverage.md)、[98TC](05_test_plan_step_06_cases.md)、[S/A/B与复验](05_test_plan_step_11_defects_retest.md)。继承前序证据边界/诊断/取舍/十二待确认，不新需求编号。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些直接不通过？ | actual finding命中五VETO任一，所有scope总体不通过；local expected负例被正确拒绝不是finding。 |
| 正式来源？ | 00§14五项canonical，01truth/依赖，03完整owner/currentgate/state/frame/恢复/安全不变量。 |
| 如何检查？ | 五项逐正向+负向TC/EV及必要shared全量子例，actual raw/report/capture/PG/Worker/UI交叉核查。 |
| 能风险接受？ | 不能；排期/角色签署/owner资料/scan/signature/ACK/免费均不豁免。 |
| 覆盖全部P0？ | 五项覆盖正式不可接受红线；一般required证据/参数化/进入条件缺口仍是P0阻断，不私增第六VETO。 |
| 每项回source/TC/EV/path？ | §7逐项全ID和固定同runMD，人工VETO详情沿Step10，实际digest未提供。 |
| 每项独立停审？ | 先风险/采用未采用，再trigger/证据/裁决/重开，逐项design-stop。 |
| 覆盖/重复/越权？ | §10总审计；同finding可关联多VETO但缺陷不多造，风险接受不能覆盖，未查不填未触发。 |

## 4. 当前文档问题诊断

旧06交易/安装/运营对象不能成为新否决基线。缺raw/report只是证据不足，不等产品已泄漏或伪造；但假造actual结果是正式红线。无实际run的当前不能登记“五VETO已通过”或actual总体不通过。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 红线口号 | 五项正式来源/trigger/正反证据/路径/裁决 | 可执行检查 |
| 所有缺口改叫VETO | canonical五项与过程P0区分 | 不改05 enum或淡化五红线 |
| 用角色批准越红线 | 禁风险接受/降级，actual修复复验后新review | 不越owner authority |

## 6. 设计取舍

只使用VETO-MP-1～5，不新增机器编号。触发要求actual finding有安全可核查来源，正反TC全部required；不以预期ContractBlocked/CommitUnknown表示项目失败。未采用“本地测试通过=外部批准”或“risk接受=VETO清除”。formal positive缺口按Step2/3/13处理，不能由negative pass关闭。

## 7. 结构化中间产物

### 7.1 VETO-MP-1：外部truth/正文/凭据/来源资质

思考/取舍：资产和publisher truth属于owner，采用immutable typed refs/安全摘要/current visibility；不采用本地包复制、AI identity冒human、config/testfake自证资格。正式来源00§14 VETO1、BR101/102/504、01ownership、03U1/U7/§14/15。

触发：实际保存/索引/日志/报告泄漏owner正文或credential，反写/复制第二truth，伪造source/publisher/material资格/asset digest。通过检查条件：五类exact refs/material/scope按formal合同消费；全部禁止sink安全，生产无fake；local controlled材料明确fake来源不冒formal。

证据：TC-SOURCE-003→EV-DOMAIN-003、TC-CROSS-006→EV-REDACTION-001；补TC-SOURCE-004/005→EV-DOMAIN-004/005、TC-CONFIG-007→EV-CONFIG-007、TC-CROSS-009→EV-CONFIG-013。report分别在 `reports/runs/<run_id>/evidence/EV-DOMAIN-003.md`、`EV-REDACTION-001.md` 及其余完整EV同目录；逐capture/all required raw和六checks重查，不只看redaction标签。

裁决：actual触发S/总体不通过，安全隔离污染材料，不能保存secret原值作证；不得risk接受。修复回03owner/ref/安全/04，再05全影响fresh复验/newreview。独立停审：正式来源/trigger/全sink/证据路径/禁止接受已核，design-stop/pass；MP-UP-001/003/004不关闭。

### 7.2 VETO-MP-2：本地approval与错配/失效决定

思考/取舍：MatchedDecision可以rejected，采用Governance正式current决定与完整application/basis/source/material/version/scope绑定；不采用ACK/waived/签名/扫描/fresh或人类本地按钮批准。来源00 VETO2、BR103/201/204、03U2/U3/VersionAdmissionPolicy。

触发：本地生成/推断approval，缺positive资格或使用错配/过期/撤销/替代/拒绝决定仍List。通过检查：CreateListing只目录壳、Register仅Staged；正式current approved且fullgate有效才显式Listed。local fake只提供受控typed决策供合同测试，不能宣称真正审核通过。

证据：TC-CATALOG-005→EV-PG-005、TC-REVIEW-008→EV-DOMAIN-014；补TC-REVIEW-003/007→EV-DOMAIN-009/013、TC-CATALOG-006→EV-PG-006。固定 `reports/runs/<run_id>/evidence/EV-PG-005.md`、`EV-DOMAIN-014.md` 和同目录补EV；actual PG gate/flow与formal-selected qualification分别复核。

裁决：actual触发S/总体不通过，不能凭signature/scan/ACK/风险签署消除；受影响contract与决定binding先回Gov/SDK authority和03U2/3，fresh全影响复验。停审：exact正式来源/正反/状态时机/不可接受已核，design-stop/pass；MP-UP-002/MP-SRC-010不关闭。

### 7.3 VETO-MP-3：UI/public/cache/index绕scope或撤回

思考/取舍：read token/cache没有authority，采用同current谓词/whole disclosure/as-of范围与current gate；不采用public免权限、旧UI eligible或索引Fresh准入。来源00 VETO3、BR301/302/401、03U3/U4/U7及七PageReadContext。

触发：越scope泄漏items/ref/count/token/提示存在性，或UI/public/cache/index绕撤回/visibility/current source/receiver gate。通过检查：全读取面同authority，隐藏整体NotVisible；免费获取也current fullgate，stale拒绝或typedgap不fallback。

证据：TC-CATALOG-007→EV-PG-007、TC-CROSS-017→EV-PG-021；补TC-CATALOG-008→EV-PG-008、TC-DISTRIBUTION-001/009→EV-WORKER-001/009、TC-CROSS-007→EV-API-002。report=`reports/runs/<run_id>/evidence/EV-PG-007.md`、`EV-PG-021.md`及同目录补EV；七paged caller所有身份/selector/filter/anchor变异和actual PG读面均需。

裁决：actual触发S/总体不通过，不能仅移除前端按钮规避API问题；回03Scope/page/read/currentgate及04，完整受影响读写+Web复验。停审：scope与撤回双轴/读取存在性/全入口证据已核，design-stop/pass；MP-UP-003/005不关闭。

### 7.4 VETO-MP-4：安装激活与无owner财务结果

思考/取舍：采用DistributionIntent/Attempt/Relation与ReceiverOutcomeBinding局部责任，不造Installation/Entitlement/transaction/payment第二truth。来源00 VETO4、BR402/404、01/03U4、04禁止配置。Billing/支付/订阅/分成/跨境仍future/blocker。

触发：把Accepted/获取/ACK/HTTP成功/formal receiver Confirmed显示或存成已安装/激活，或无财务authority造付款/订阅/分成/交易结果。通过检查：formal Confirmed仅exact receiver消费结果，UI分层；无Billing writer/依赖/配置绕gate，免费仍授权。

证据：TC-DISTRIBUTION-005→EV-WORKER-005、TC-CONFIG-012→EV-CONFIG-012；补TC-DISTRIBUTION-008→EV-WORKER-008、TC-CROSS-020→EV-UNIT-005、TC-CROSS-021→EV-WEB-002。report=`reports/runs/<run_id>/evidence/EV-WORKER-005.md`、`EV-CONFIG-012.md`及同目录补EV；actual entry/Worker/browser/依赖检查，不虚构支付负例结果。

裁决：actual触发S/总体不通过，business/finance槽位不是acceptance authority；新财务范围先正式owner与00/01裁定再下游，不用06补交易truth。停审：Confirmed≠Installed/Paid、禁止writer/config、TC/path已核，design-stop/pass；MP-UP-005/006不关闭。

### 7.5 VETO-MP-5：撤回后新分发、伪通知/审计/恢复、历史反写

思考/取舍：采用publisher→version实际commit序、withdraw终态、原intent/probe/fullreport、新B与late责任；不采用通知完成才停发、timeout当notcommit或Recovery任意修SQL。来源00 VETO5、BR203/501～505、03U4～7/Step11/12/13/15。

触发：撤回后新admission/permission，Withdrawn复活，盲重发/伪通知送达或审计/恢复成功，篡改/删除原history/result/checkpoint/责任，projection/cache/恢复反写外部truth；伪静态运行/evidence结果同样不得作为实际审计/恢复证明。合法晚到结果不等撤回后新准入，应完整续责而非删除。

证据：TC-WITHDRAWAL-002→EV-DOMAIN-018、TC-CROSS-016→EV-PG-020；补TC-CROSS-015→EV-PG-019、TC-WITHDRAWAL-005/008→EV-DOMAIN-021/024、TC-RECOVERY-005/006/009/010→EV-RECOVERY-005/006/009/010、TC-CROSS-010→EV-RELEASE-001。report=`reports/runs/<run_id>/evidence/EV-DOMAIN-018.md`、`EV-PG-020.md`及同目录补EV；actual PG两commit顺序/全写点/全适用disposition，原probe/fullreport/fence/shutdown逐子例。

裁决：actual触发S/总体不通过，不可risk接受、降级、挑成功重跑或手改报告；先回03facts/history/A-B/recovery/query/04，再fresh完整影响与release全98复验/newreview。停审：晚结果与新准入分开、完整TC/path/不变量/强制裁决已核，design-stop/pass；MP-UP-007/008/Q-MP-01不关闭。

### 7.6 固定否决清单与触发优先级

人工三入口绑定沿Step10，VETO入口固定 `reports/acceptance/veto-checklist.md`，explicit run/review详情 `reports/acceptance/<run_id>-<review_id>-veto-checklist.md`。五行各有formal来源、主/补TC/EV/report/raw、actual finding/未核查、审查角色/日期、是否trigger和overall影响；不能从05 pending checklist复制“未触发”。当前未创建文件/actual结果。

触发优先于所有维度pass/签署/风险接受。多VETO同finding只关联同缺陷，不重复造实际缺陷。P0缺证/缺参数/资格/mandatorycheck失败本身阻授通过，但不强行断言某VETO已发生；实际调查若发现伪造/绕gate/泄漏则按上述trigger。正确拒绝污染输入为负例TCpass，不能反向认定产品VETO。

## 8. 回填草稿

正式§11采用五项不可接受红线、正式来源、正反与补证、固定report/人工清单、强制不通过和重开规则。无需新增第六VETO或改05canonical enum；运行VETO核查全部未发生。

## 9. 待确认事项

actual capture/PG/Worker/browser/owner positive与正式审查authority未提供；十二上游缺口不关闭。未测/未核查状态不等VETO无触发，也不等已触发。

## 10. 进入下一步条件

跨VETO覆盖审计：五canonical ID与00相等；各正式来源/trigger/正反TC-EV/report/角色规则/不可接受/重开齐备，覆盖五业务能力和全入口owner/scope/unknown/历史/证据；过程P0保持独立。没有重复编号、幽灵支付对象或风险覆盖VETO；五项独立design-stop/pass。下一读SOP Step12/规范5.12、05S/A/B/生命周期/复验失效和Step10路径；不提交。
