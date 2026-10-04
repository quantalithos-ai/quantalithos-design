# L6-bridges 06 Step13：风险接受

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step13 / 书写§5.13；回填正式06§13。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| risk_acceptance | pass | design_static_only_external_gates_open | enter_step_14 | Step12缺陷与no-waiver；00§15；03§17当前BR-UP/localexpiry/Observability；04§14；05§14.2~14.5原BR-UP/WS12/affected12；七上游必要ledger。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

接受资格/安全人工记录合同；非可豁免实际缺口、10BR-UP、12WS、12affected、16NFR未测及工具/retention/review待建立；acceptor/owner/date一律waiting。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§13已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

Step12缺陷与no-waiver；00§15；03§17当前BR-UP/localexpiry/Observability；04§14；05§14.2~14.5原BR-UP/WS12/affected12；七上游必要ledger。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 只有实际非P0 B/C残余，已证明不影响P0/安全/VETO/资格/current/证据，才支持有条件通过候选。
2. S/A/P0/VETO、缺平台/owner/store/secret/producer/批准budget/retention/actual材料及mandatory项不可接受；未执行NFR按规范登记但不豁免。
3. 当前无真实acceptor，只定义正式项目验收授权责任人和该风险owner权限，assignment需私有渠道真实核验。
4. 实例必须真实修复/后续action/deadline/范围/理由/authority/signedrecord；本轮只有waiting，不造日期/姓名。
5. 后续授权07承接问题、releasebasis和依赖资格，不本轮创建implementationledger或关闭上游。

## 4. 当前材料问题诊断

上游designclosed/coveredconditional不能推Bridges actual资格释放；当前05继承十二affected每个原status需逐字保留。未选Workspace支路不用强制消费，但selected/mandatory不能null绕准入；Chat reference_only不是前置blocker。

## 5. 改动前后对比

| 风险 | 原易误判 | 本步裁决 |
|---|---|---|
| 原upstream | 设计已成文所以closed | 原状态不变，只写受影响scope/释放要求 |
| actualgap | 接受人签字可放行 | 非豁免资格/证据缺口 |
| B/C | 任意普通issue都可接受 | 实际noP0污染证明+授权acceptor/action/date |
| 计划 | waiting占位变签署实例 | 只未来材料合同，零实例 |

## 6. 验收裁决取舍与复杂度

中等复杂度；完整风险/继承状态表，actual字段及签名留waiting；不更改上游与任何formal05语义。原closed_design_contract仅本地设计断口，不签actualretention/driver或四平台能力。

## 7. 结构化中间产物

### 13.1 可接受范围与非豁免条件

| 类别 | 可否风险接受 | 前置/处理 |
|---|---|---|
| 实际B/C且真正不触及P0/VETO/安全/协议/证据真实性 | 仅候选，不自动 | 有实际影响/回归证明、范围、owner/acceptor授权、有限期限/后续action与签署；§14总体有条件通过才生效 |
| S/A/P0/原六VETO | 否 | 修复及真实完整复验；确证否决不通过；缺材料暂停 |
| actualqualification/安装/SDK/pin/owner/probe/driver/executor/secret/route/producer | 否 | 正式owner合同/compatibility/current及受权actual材料，不以publicURL、fake或designpass代替 |
| 当前未测16NFR或requiredTC/EV/check/report缺口 | 否 | 登记风险但不豁免；所有封闭参数与真实scope/check完整后再裁 |
| 未选条件Workspace/Bus分支、Chat草稿、P1未承诺功能 | 非范围，不是“接受后通过” | 保原非消费/参考姿态；selected/mandatory资格仍强制，四平台P0不降级 |
| artifactretention/审查assignment/签署授权尚未批准 | 否 | 缺policy阻其正式留存/自动purge承诺；缺review/authority暂停签署，不制造接受人 |

无接受人的条目绝不支撑有条件通过，当前所有实际接受/截止时间/签署均waiting。未执行NFR在本章显式登记，以满足风险透明要求；不将通用书写规范中的“风险接受”解释为P0豁免。

### 13.2 未来安全risk-acceptance人工表

计划材料固定 `reports/acceptance/<run_id>/risk-acceptance.md`，工具只未裁决初稿；实际acceptor/human补充。每真实实例必须完整以下字段，字段名是人工表合同，不是新的machineDTO/运行文件。本轮不生成实例。

| 字段组 | 必须有的safe字段/规则 |
|---|---|
| 定位/基线 | risk_id（安全测试/问题标识）、run_id、同ReportIndex测试relativepath及真实sha256、00~05与本06设计hash、source/build安全基线；不能跨run或latest |
| 影响/证明 | severity仅实际B/C、受影响cut/TC/AC/06gate、安全environment/mode/platformlabels、P1/非P0scope；no_P0_or_VETO_impact的实际相关EV/回归来源和safe reason code，不能默认true |
| 理由/控制 | acceptance_reason_code有限受核分类、控制措施/未覆盖scope、安全状态、action_code及实际后续计划ref；无自由业务payload/审批正文 |
| 责任/期限 | owner_role与actual assignment_slot、acceptor_role与actual授权slot、UTC真实截止时间、复验触发/期限到期取消接受；未建立为waiting不是完整接受 |
| 权限/签署 | 真实风险owner与项目验收acceptor各自scope、授权材料受限引用slot、人审签署安全记录path/hash/actual日期；身份仅私有正式渠道核验 |
| 状态/关联 | planned/awaiting_acceptor/accepted_for_review/rejected/expired/closed_verified仅人工风险处置标签，非Domain或finalverdict；accepted_for_review不表示总体通过，后者只§14决定 |

私有业务basis/op/外部IDs、实际secret/grant/route/原config/ref不入表；报告只批准safe测试标识、paths/hashes/有限类别。风险理由、签名不能授权本来未授权的操作。任何风险scope/基线/current/期限改变，原接受失效需重审和受影响复验，不“续期”凭证/业务window。

### 13.3 当前Bridges非可豁免缺口

| 风险/遗留 | 影响 | 当前理由/姿态 | 后续动作 | 责任类别 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| 16NFR全部未执行 | §9全部P0 actualpositive | planned/not_evaluated；非可豁免 | 全具体TC/参数、安全测量/current依据、checks/EV | 各actualscope及测试责任类别 | waiting，无接受 | waiting，无假日期 |
| actual工具/harness/七script/11target/13suite | LOCAL/REAL/EVIDENCE/HANDOFF准入 | 未实现/未运行，无context/EV/report | 正式07后独立实施/测试授权，真实工具自测与各层材料 | 工具/测试/安全审查类别 | waiting；非可豁免 | waiting |
| store/executor/clock/ID/codec/source/pin | wholeU/phase/参数/状态实际能力 | 产品与actual binding未立 | currentdriverfullCAS/unique/journal/readonly、runtime/schema/pin核验 | 技术seam/兼容审查类别 | waiting；非可豁免 | waiting |
| currentretention/budget/probe | key/cursor/retry/unknown/留存 | 无实际批准window/预算，无NoEffect推断 | 正式policy/source/comparator/probe+实际资格；缺则受限/manual | policy/source/driver/平台审查类别 | waiting；非可豁免 | waiting |
| review/验收assignment/signoff | 最终结论/送验 | 无实际授权角色或签署实例 | §14人工assignment及固定safe材料 | 验收/责任owner/安全审查类别 | waiting；非可豁免 | waiting |
| 实际B/C残余候选 | 仅未来确证非P0问题 | 本轮没有缺陷实例或接受理由 | 真实影响证明、owner/acceptor/action/deadline/signature | 未来具名实际owner | waiting；未接受 | waiting |

### 13.4 BR-UP原状态与释放边界

| 原ID/状态 | 受影响/不得推论 | 释放要求/后续责任 |
|---|---|---|
| BR-UP-001 / open | Conversation输入/材料owner、actor/mode/source变化/accepted-unknown；INBOUND/CHANGE/PRESENT/DELIVERY/RECOVERY | 当前正式owner兼容/准入/ref/重解析与same-op权威结果 |
| BR-UP-002 / open | externalhuman/AI/Integration责任、binding/mapping/callback；不能external_id生GlobalMember | 显式两端actor责任/授权来源/currentbasis |
| BR-UP-003 / open | Policy/Gate披露/存在性/入口/action/current；低敏感不授审批 | owning当前规则/状态/visibility及action二次核验 |
| BR-UP-004 / open | Artifact入/出附件准入/read/传播/window；不默认省略必要附件 | 实际authorizedref/grant/expiry及平台method能力 |
| BR-UP-005 / open | 选用Workspace safequery/export/provenance；不是频道/权限owner | 仅selected分支正式source/当前visibility及下表WS原owner材料 |
| BR-UP-006 / open | producer/schema/admission/mandatory/nonrecursive/consumer；当前无Bridgesmap | 原owner正式注册/兼容/currentrule和真实consumer disposition；下表12affected |
| BR-UP-007 / open | SDK/platform SDK/OAuth/APIKey/KMS/router/secret/store/executor未选/未立 | 固定pin/features/传递closure/用途/scope/grant/rotation/撤销/route/hiddenretry与wholeU实际兼容 |
| BR-UP-008 / open | 四平台安装/source/edit/delete/thread/ACK/callback/附件/限流 | actualservicepin/method/install/grant/currentcapability；04的11URL/8选段/3unavailable非4/4 |
| BR-UP-009 / open | key/comparator/stagecoverage/rate/retention/权威recovery | currentapprovedwindow/budget/readonlyprobe/actualNoEffect/fullCAS；不TTL/NotFound推无效果 |
| BR-UP-010 / reference_only | L5-chat未停审，非formal输入与非阻塞前置 | 未来formalsource+用户明确消费授权才重裁剪，不借草稿route |

责任均为相关formalowner/adapter/config/secret/技术审查类别，非本轮新assignment；接受人和期限全waiting。本任务不回写任何upstream状态。

### 13.5 Workspace十二open（沿05§14.3）

| 原索引 | 原状态 | selected消费影响/释放 |
|---|---|---|
| WS-UP-001 | open | formalquery/sourceversion/freshness，不能localView补ownertruth |
| WS-UP-002 | open | sourceevent/stream/comparator/replay，Buspreparation不是executor |
| WS-UP-003 | open | owningvisibility/current/撤销，存在性/内容/入口分别核 |
| WS-UP-004 | open | 仅selectedattention/source，不能猜生命周期 |
| WS-UP-005 | open | Personal/Project/AI/membertypedref，不external_id生主体 |
| WS-UP-006 | open | SDK/read-export兼容，不新增跨域snapshottruth |
| WS-UP-007 | open | realcoreexports，禁止复制schema/alias冒qualified |
| WS-UP-008 | open | 非项目personalexecution未定义，本轮未消费非前置 |
| WS-UP-006-S | open | staticseed/template非liveWorkspace，本轮不增加消费边 |
| WS-LOCAL-001 | open | actualdurabledriver终局/隔离资格 |
| WS-LOCAL-002 | open | selectedconfig/binding/currentqualification |
| WS-LOCAL-003 | open | crypto/UUID/CSPRNG/pin actual资格 |

全部接受/期限waiting且不可放行对应selected P0；未选分支不强制验下游全仓。Workspace07设计停审/实施planned不是实际read/export通过。

### 13.6 Observability十二affected原姿态（沿05§14.4）

源实施台账 `pre_implementation_blocked / gate_status=blocked / next_allowed_action=wait_design` 保持；条件covered或designclosed不释放Bridgesproducer实际准入。

| affected_id | 上游原状态 | Bridges消费限制 |
|---|---|---|
| S08-E-I05-PAYLOAD-SCHEMA-01 | open_upstream_internal | 本地safeDTO非I05positive |
| S08-E-I05-PRODUCER-EVENT-BINDING-01 | open_upstream_internal | 不自选event/producer |
| R06.6-F2-H13-UPSTREAM | open_controlled | 不宣H13/J06Completed/result |
| R06-F-AFFECT-UOW-01 | open_controlled_downstream | 不用clone/reload/partialsuccess伪原子 |
| S08-RECOVERY-CLASS-OWNER-01 | open_internal_affected | 不默认retryclass |
| R07-EXTERNAL-PHASE-LINK-01 | covered_conditional | 非实际delivery/不能换token/target |
| R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01 | covered_conditional | onlyoriginalprobe/manual/knownfinalize |
| S08-CONSUMER-OUTBOX-SURFACE-01 | open_internal_affected | ACK非outbox/consumeraccept |
| S08-CONSUMER-INDETERMINATE-COMPLETION-01 | open_internal_affected | unknown不改ACK/retry/deadletter |
| S08-JOB-REPORT-REF-OWNER-01 | open_internal_affected | 禁String/alias伪reportref |
| S08-M1-SECONDARY-TYPE-OWNER-01 | open_internal_affected | 不复制sharedtype伪闭口 |
| 03-RPR-S09-PER-FLOW | design_record_closed_implementation_open | designrecord非implementation/run/EV |

释放必须原owner正式设计/实际实现/证据/currentsource，不是本06风险签署；接受/期限全waiting。

### 13.7 本地设计与下阶段承接

S10-LOCAL-001仍`closed_design_contract`，targeted_repair_allowed=false：只03授权expiry断口已修；actualretention/policy/driver/平台资格未建立。TEST-03-001为`synchronized_design`而非工具能力实现；BR-DOWN-003的06设计虽本轮装配，用户确认/实际裁决与07仍waiting，不能把旧历史waiting伪改为actualready。

本章实际风险接受实例=0，未有acceptor/action/date/signature或关闭上游事实。授权07后才将每个缺口/角色/允许scope/实际释放材料要求纳入implementationledger与全部plannedboundary；所有planned/blocked/waiting保持，不在当前建骨架。


## 8. 回填草稿

正式06§13按书写规范直接摘录§7规范段；章节名为“风险接受与遗留项”。只补具名校准来源及延伸阅读链接，不搬§3~6诊断/取舍或§10自检状态，不新增结论。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。风险接受未来safe合同与非豁免缺口/原10BRUP/12WS/12affected完整承接；原状态actual静态比对一致，没有实际风险接受或关闭。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_14。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
