# L6-bridges 05 Step13：报告证据

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| evidence | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step14_skeleton | 本Step§2/7；实际静态审计 |

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

已读Step6两design-only registry、Step9七scripts及03四处plannedcontract、Step12进入/退出；复核SOP Step13十六问题/书写§5.13、目录规范fixed-run产物规则。当前无自动化报告实例，本步只schema/路径/算法/EVplan，不创建真实run。

## 3. SOP问题回答

1~4. case/suite/context/index及安全token-only stdout/stderr、checks/report/EV关联是机器证据；不保存DBrows/业务log/trace/body/private/ref。snapshot断言只test内存保actualbefore/after，输出finiteassertion。
5. 保留期限须批准artifactpolicy与case/incident责任材料；无来源不给天数/GC，自动purge阻塞，业务unknown不能删。
6~10. artifacts固定run；reports/runs、acceptance及review具run隔离；两reports生成初稿，人审补风险/责任/基线，不自动signoff。
11. context已合法建立且runner启动后，失败suite仍写真实safe report.json/stdout.log/stderr.log/failure分类；未启动case不捏case，缺context只有finiteerror。
12. typedallowlist先writer，再boundedcanary/派生检测与readerpath/schema/digest；redaction不是raw先落盘后删。
13~14. 每22EV有具体116TC数组，runtimeEV只从真实case/suite/artifactsource实例推导；AC/VETO计划映射固定，fake不actual资格。
15~16. 按DTO/cutEV/报告族逐类停审，跨审selfdigest/缺case/instance路由/安全材料/失败输出/handoff真实性。

## 4. 当前材料问题诊断

只有字段清单不够落码，需完整JSONSchema、跨document状态和计算算法。普通stdout/stderr带compiler/SDK自由文本可能泄露；改token-only验证后持久。suite文件名统一report.json，stdout/stderr.log仅安全tokens，与规范配对；先前suite.json/.txt具名计划引用同步03/05，不实现。

## 5. 改动前后对比

| 缺口 | 闭口 |
|---|---|
| artifact无owner/version/type/required | draft2020-12 localDTO封闭schema，unknownfield拒 |
| index对自身sha造成循环 | 所有文档无selfsha，父引用hash固定bytes；reportindex不被自身引用 |
| 静态TC表生成passed | 真实runnercase + suitemanifest/hash + expectedclosedinstances，不存在case保missing |
| rawoutput落盘后redaction | boundedprivate capture→typedallowlist→safetokens；异常只finitefailure，不dump |
| EVtc_refs=全部P0 | 每cut明确TC数组与实际instance/suite引用，严格追溯 |

## 6. 测试设计取舍与复杂度

schema逐DTO小patch，先总骨架再defs；不构造运行JSON实例。完整机器DTO文件属于calibration schema，不artifact证据。正文保全字段/跨约束/digest/writer-reader/redaction/report成熟度及22EVplan具体TC数组，约250~450行拆算法/DTO/EV表批次。

## 7. 结构化中间产物

### 7.1 Local test-harness schema与运行材料

所有DTO归`L6-bridges/test-harness`，`schema_version=1`，`kind`为各行固定值；与production contracts/Domain/Observabilityschema无关。完整规范性schema为[05_test_plan_harness_schema.json](05_test_plan_harness_schema.json)（JSONSchema Draft2020-12，34defs、9rootoneOf），由本Step逐DTO登记。它不是run实例/测试artifact；正文和读者必须同时承接本文跨字段约束，不能只做JSONSchema验证。

所有object均`additionalProperties=false`；其`properties`每个key都required（**可null不是optional**），没有省略/default。所有整数JSON非负十进制integer，≤9007199254740991并遵各fieldhardcap，不float/exponent/string。数组bounded且元素唯一，额外还要按identity唯一；字符串只有固定enum/const/受限ASCIIgrammar，无自由description/error/message/path/业务ref/payload/secret字段。

共通所有rootrequired：owner/schema_version/kind/run_id。run_id只`br-YYYYMMDDTHHMMSSZ-<6..12 loweralnum>`有效日期及唯一实际run；context_id=ctx-NNN，parameter_id=pNNNN至pNNNNNN，instance_id=`TC-<CUT>-NNN--<parameter_id>--<context_id>`并由expectedmanifest分配，不能临时自选。TC/DS/EV/suite必须等于本05登记成员，不仅匹配正则。

| DTO / kind / 固定计划文件 | 其他required字段 | 类型/enum/来源/约束 |
|---|---|---|
| RunContext / run_context / context.json | source_revision/source_tree_sha256（真实代码基线）；design_baseline六doc+hash；harness_profile/build/tooldigest/allowlist1；started_at_ms/timeout；contexts/expected_instances | ExecutionContext含mode/config_safe+hash/Qualification槽；ExpectedInstance具instance/tc/parameter/context/suite/target（原十一target）/ds/ev/assertion IDs；全部required，无rawconfig/secret/业务ref |
| CaseResult / case_result / cases/<instance_id>.json | context_sha256/context_id/suite_id/target_id/instance_id/tc_id/parameter_id/ds_id/ev_id/status/executed/time/elapsed/assertions/call_counters/failure_code/blockers | assertion_id/status/failure；六调用counter只工具计数；passed仅真实executed且全部expectedassertions通过；无caseoutput不造文件 |
| SuiteResult / suite_result / suites/<suite_id>/<context_id>/report.json | contexthash/context/suite/status/runner_exit/runner_results/time/elapsed/case_refs/missing_instance_ids/stdout/stderr/failure_code/blockers | ArtifactRef={path,sha256,byte_length,media_type}；stdout/stderr安全ASCIItokens、每stream≤64KiB，不是rawlog |
| ArtifactIndex / artifact_index / index.json | generation/stage/status/context_ref/suite_refs/case_refs/coverage/failure_code | CoverageSlot instance_id/state(recorded/missing)/case_ref(null仅missing)；shell不是EV；final全真实引用，missing阻passed；无selfhash/checkrefs避免循环 |
| CheckResult / check_result / checks/{run-context,test-evidence}.json | check_id/status/context_ref/input_index_ref/checked_at_ms/failure_code/blockers | run-context检查inputindex可null；test-evidence必须finalindexref；真实checker才能输出，不伪checker记录 |
| EvidencePage / evidence_page / reports/.../evidence/<EV-ID>.json | ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers | tc_refs为本章具体计划数组且实例闭包；qualifiedscope local_mechanism/real_seam/mixed；不能localpassed推actualAC；真实validatedcase才EV |
| ReportIndex / report_index / reports/runs/<run_id>/index.json | stage/status/context_ref/source_index_ref/check_refs/evidence_refs/missing_ev_ids/generated_at_ms/failure_code | ReportEvidence={ev_id,page_ref,status}；partial只安全摘要，final须expectedEV全集；无自身引用，不能用静态表填missingEVpassed |
| Handoff / acceptance_handoff / reports/acceptance/<run_id>/handoff.json | status=draft_for_review/source_report_index/ac_coverage/blockers/review_state=waiting/generated_at_ms | AcCoverage每38AC只not_evaluated/blocked/available_for_review；第三种非acceptancepassed，riskacceptance/verdict不得自动生成 |
| HumanReview / human_review / reports/review/<run_id>/review.json | reviewer_role/reviewer_assignment_slot/source_report_index/reviewed_at_ms/disposition/blockers/comment_codes | 只有实际授权责任人写；disposition只changes_requested/handoff_reviewed_no_acceptance_verdict，非signoff；身份真实assignment不写私有actorref |

#### 34defs的完整类型归属

| 定义族 | 全部defs与精确约束 |
|---|---|
| 安全标识10defs | RunId/Digest（lowerhex64）/ContextId/TcId/DsId/EvId/InstanceId/ParameterId/AssertionId（aNNN）/SuiteId（本05十三suiteenum） |
| 结果/引用6defs | Status=passed/failed/blocked/unavailable；FailureCode=null或schema列的有限17类；BlockerId=本项目既有BR-UP/WS/affected与三内部工具资格token；ArtifactRef/ReportRef固定relativepath+sha256+byte_length+mediatype；DesignDigest只doc00~05+hash |
| 上下文5defs | SafeConfig只04environment/十branch/四platform及五resource整数；Qualification只qNNN/seam有限enum/state/blockerIDs（无凭证/账号/URL/ref）；ExecutionContext mode/configsafe/hash/slots；ExpectedInstance全关联及非空assertionids；RunContext见上表 |
| 执行/归档7defs | Assertion finiteid/status/failure、Counters固定六nonnegative工具调用计数；CaseResult/SuiteResult/CoverageSlot/ArtifactIndex/CheckResult见上表 |
| 报告/人审6defs | EvidencePage/ReportEvidence/ReportIndex/AcCoverage/Handoff/HumanReview见上表 |

safeconfig不是原config副本：只environment/selected finitebranch/platform labels、五资源tuple；不含installationnamespace/provider/key/selector/secretref/DSN/route/原value或其摘要。harness_profile是批准的test-only安全标记及版本，不能输出productionexecution_profile_ref。qualification槽只有限seam/state，不宣manufacturedgrant/producer；其实际私有basis通过正式授权渠道审核，原ref不进artifact。

expectedmanifest从正式05 plan + **实际已实现/批准的**TC参数注册清单生成（safeids/路由/assertionIDs），不从静态表制造casepassed。SURFACE按wire/model→S/D、STATE按M01~17D/M18I/M19J/M20~21W、host按API I/Jobs J/Worker W；每expectedinstance唯一suite。20协议required/enum字段、150allowedpair+375未列候选/逐guard、82key/22CF/27F/12CFG/fourplatform/allselectedactualscope闭包必须完整，漏注册或删parameter阻run覆盖。

#### 跨DTO计算与status不变量

- Contextimmutable；同run六designhash、实际source/build/tool、安全profile及全expectedmanifest不漂移。source_tree_sha256只批准源码/manifest/pin安全内容，不hash原secret/config/正文；actualrepo不存在就没有有效context。
- Case的TC/parameter/context/suite/target/DS/EV必须与唯一ExpectedInstance同tuple；context_sha256为原context存储bytes摘要。started≤finished、elapsed=checkedfinished-started；不用wallclock替业务current来源。
- executed=true的case只能passed/failed；passed要求exactexpectedassertionset、全部passed、failure_code=null、blockers空；failed须≥1failed或真实harnessfailure，not_reached不能passed。executed=false只真实preflight拒绝的blocked/unavailable，assertions可空，counters=0、failure非null；缺case不能代写not_run文件。
- suite的required runner_results是逐原target真实exit/instance_ids/elapsed数组，target_id唯一、instance集合互斥且并等该suite expected；suite runner_exit为实际子runneraggregate，不可单取一个exit0。TOOLS的TC-EVIDENCE-001/002/003/005在S、004在P；REAL的TC-REAL-001/002/007在B、003A、004L、005P、006C；LOCAL-006实际driver在L。STATE/host/wire参数target随既有路由；其他TC用primarysuite原target。suitecase_refs只本suite/contextexpectedinstances；missing_instance_ids必须exact差集；runner_exit及status/actualelapsed与output一致。passed要求runner_exit=0、missing空、所有expectedcasespassed、failure=null/无blocker；nonzero或缺runner不得passed。timeout/中断未产case只记录missing/有限failure，不能补伪case。
- Indexcoverage逐expectedinstance恰一slot；recorded必须非null真实case_ref且与case_refs同集合，missing只null；suite_refs真实无重复。shell只能in_progress/failed/blocked/unavailable，不可finalEV；finalpassed要求整个expectedclosure完整且suite均passed。
- Check检查结构/安全/关联真实性，不把casefailed本身当schema无效；合法完整的failedrun可通过structurecheck并生成failedEV。wrongbaseline/hash/unknownfield/漏instance/禁材则check非0；未有合法context不能造checkerartifact。
- EV每cut的tc_refs等本章具体数组；instance_ids=这些TC的expectedinstance全集，case/suite/contextrefs由真实artifact推导并精确关联。只case不存在或checks未完成，不造finalEV；ReportIndex列missing_EV/partial。EVpassed须全部实例passed且两个checkspassed；实际资格scope不足时不能靠syntheticclaimreal。允许validatedfailed/blocked/unavailableEV如实反映真实实例，但不能从静态plan补缺case。
- ReportRef的path始终锚定同run的reports/runs/<run_id>，即使被acceptance/review引用也不相对它们目录；ArtifactRef始终锚定artifacts/test/<run_id>。ReportIndexfinal要求22expectedEV与引用完整，不表示所有passed；partial列exactmissingEV及有限failure。Handoff38AC只能“材料可供复核”或blocked/not_evaluated，humanrisk/verdict归06授权责任人，自动工具不宣布acceptancepassed。


### 7.2 Digest与writer/reader合同

#### Canonical JSON与SHA256

CJSON(T)=递归objectkey按ASCII字节升序排序、数组保持规范manifest/instance顺序、JSONUTF-8无BOM/空白、标准JSONescaping、非负安全整数十进制、末尾唯一LF。禁止duplicatekeys/unknownkeys/非法UTF-8/控制字节/非canonicalraw输入；reader strictparse后再encode CJSON，必须原bytes exact equality。JSONsha256=SHA256(CJSON(T) **包括LF**)，byte_length对应相同bytes。artifact refs摘要指实际已安全验证的文件bytes；config_safe_sha256=SHA256(CJSON(SafeConfig))，不是原config/secret/provider材料hash。

非JSONblob仅ASCII LF行，sha256直接hash其完整已安全tokenized存储bytes（含实际LF；emptyblob为0bytes标准emptySHA）。每stdout/stderr≤65536bytes，不appendraw/CRLF/BOM；只允许`BEGIN|END <SUITE-ID> <ctx-ID>`、`ASSERT <instance-ID> <aNNN> <passed|failed|not_reached>`、`FAILURE <finite failure token>`三种linegrammar。runnerwrapper把Cargo/SDK自由输出捕获在boundedprivate内存，转换为有限classification；不passthrough或留compilerpanic/stack/业务对象文本。

所有root没有自身sha字段。依赖DAG=context/configsafe→case/blobs→suite→artifactindex→checks→EVpages→reportindex→handoff/review。ArtifactIndex不包含check/reporthash，checks可引用finalindexhash；EV/ReportIndex只指下游已冻结来源，不回写sourceindex。ReportIndex无自身ref，handoff和review从外部hashreportindex；报告中引用固定runrelativepath，禁止自引用/跨run/symlink/.. /absolute/latest。文件摘要完整校验且media/byte_length同一致，不能校验自己重算后的任意digest字段。

#### Writer、reader与失败留存

writer只真实testharness/gate产生；先完整typedallowlist+identity/source/schema+bytebudget预验，在boundedprivate内存序列化，再同fixedrunexclusive锁下写bounded临时safe候选并atomicrename。候选也已安全，不把raw落盘后redaction。context/case/suite不可覆写，重复相同bytes可幂等读，异bytes=write_conflict。Indexshell→final仅generationcheckedCAS及atomicrename；禁止删missing/旧失败规避覆盖。无法safe建context只有有限stderr/exit2/3/4，不制造run。

reader不网络/probe/业务IO；固定repository/run根下canonicalrelative文件且拒symlink/escaping，先sizecap/UTF-8/strictJSON，再schema/rolepath/CJSON/digest、run/context/baseline、expectedinstanceclosure、typedstage/status、safeallowlist/forbiddenclassification。JSON文档≤4MiB、depth≤32、所有array累计≤65536；所有suite_refs上限256覆盖十三suite×十六context；context/plan量超限阻，不默截实例。stdout/stderr每64KiB cap，参数资源是harnesslimits不是platformSLA。ArtifactRef按实际role检查：context_ref只能context.json；case_ref只能cases；suite_ref仅report.json；stdout/stderr分别.log；两个check_ids路径唯一；不能schema广pattern被当可任意互换路径。

安全检查包含结构化白名单（无freevalues）、已登记safeenum/ids、synthetic内存canary族及其可还原编码派生。实际材料禁进入harness writer；内存测试注入rawbody/secret/privatecallback/Gate/rawerror仅验证不会输出，不持久canary或hash。发现泄漏只finite forbidden_material/边界类别，**不写原buffer/匹配substring/digest/sensitivepath**，不制造替代passed/EV。无法确认安全的候选拒写；先前安全output留存，受影响不安全候选不得归档。允许安全stdout/stderr为空，不声称未捕获raw为已扫描实际通过。

context合法且suite实际启动后，failed/blocked/unavailable保持已有安全cases/suite/report.json/stdout.log/stderr.log/failure_code；未启动case只missing，在index中not_run意义不造case。report脚本在checks确认safe/structuralclosure时生成真实EV和finalreport；若coverage缺失/安全check失败，只能基于已验证安全部分生成partial summary/index与failure分类，缺EV仍missing，不伪完整report。若checker工具不可用/不能安全验证原文件，则只有限failure，不读dump它们。重跑新run保旧材料，实际unknown原身份/probe/manual责任不改变。

#### 四成熟度与证据责任

| 成熟度 | 可产生材料 | 不能推断 |
|---|---|---|
| script capability | 七scripts及harness真实现，自测TC-EVIDENCE实际case | 当前只有planned设计，不代表能力已通过 |
| minimal index shell | actual合法context与真实开始/缺instance登记 | shell/in_progress不是finalEV或验收 |
| final EV pages | 真case/suite/checks、expected闭包、digest、实际scope→每EVpage | localpass非actualqualification，artifact存在非consumer/evidence裁决 |
| acceptance handoff | validatedreport初稿+actualhumanreview补责任/风险 | 不自动verdict/signoff/readiness，06另行授权 |

保留期限/归档/清理须真实批准artifactpolicy、安全scope与对账/incident要求；本05不给默认天数/无限或purge许可证。缺policy阻自动purge/正式保留承诺，existing安全run不得删来掩盖失败；businessunknown/key/receipt不随测试材料clean。

### 7.3 Planned EV到TC/AC/VETO映射

全部22EV为planned **登记ID**，不是真实EV实例或已执行case。完整具体数组见[05_test_plan_evidence_plan_registry.json](05_test_plan_evidence_plan_registry.json)；正式运行page必须从真实case/suite/index推导对应refs，计划JSON不能生成passed。允许映射local断言为某AC的材料方向，不等实际满足全部AC；06按scope/actual资格裁决。

| planned EV / cut | 具体tc_refs数组 | suite/gate / requiredscope | AC/VETO方向 | 计划归档/来源 |
|---|---|---|---|---|
| EV-CONTRACT-001 / CUT-BR-SURFACE | ["TC-SURFACE-001", "TC-SURFACE-002", "TC-SURFACE-003", "TC-SURFACE-004"] | SUITE-S/SUITE-C/SUITE-D；local_mechanism；local/real对应七scriptgate | AC-BR-006、AC-BR-013、AC-BR-020、AC-BR-026、AC-BR-035、AC-BR-037、AC-BR-038；无独立VETO，依原AC | `reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-002 / CUT-BR-BIND | ["TC-BIND-001", "TC-BIND-002", "TC-BIND-003", "TC-BIND-004"] | SUITE-A；local_mechanism；local/real对应七scriptgate | AC-BR-001、AC-BR-003、AC-BR-005、AC-BR-006、AC-BR-007、AC-BR-022；VETO-BR-002 | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-003 / CUT-BR-MAP | ["TC-MAP-001", "TC-MAP-002", "TC-MAP-003", "TC-MAP-004", "TC-MAP-005"] | SUITE-A；local_mechanism；local/real对应七scriptgate | AC-BR-001、AC-BR-004、AC-BR-005、AC-BR-006、AC-BR-011、AC-BR-023；VETO-BR-001 | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-004 / CUT-BR-INBOUND | ["TC-INBOUND-001", "TC-INBOUND-002", "TC-INBOUND-003", "TC-INBOUND-004", "TC-INBOUND-005"] | SUITE-I；local_mechanism；local/real对应七scriptgate | AC-BR-008、AC-BR-009、AC-BR-010、AC-BR-012、AC-BR-013、AC-BR-014；VETO-BR-004 | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-005 / CUT-BR-CHANGE | ["TC-CHANGE-001", "TC-CHANGE-002", "TC-CHANGE-003", "TC-CHANGE-004"] | SUITE-B；local_mechanism；local/real对应七scriptgate | AC-BR-004、AC-BR-011、AC-BR-012、AC-BR-019；VETO-BR-001 | `reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-006 / CUT-BR-PRESENT | ["TC-PRESENT-001", "TC-PRESENT-002", "TC-PRESENT-003", "TC-PRESENT-004"] | SUITE-A；local_mechanism；local/real对应七scriptgate | AC-BR-015、AC-BR-016、AC-BR-019、AC-BR-021；VETO-BR-002、VETO-BR-003 | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-007 / CUT-BR-ATTACH | ["TC-ATTACH-001", "TC-ATTACH-002", "TC-ATTACH-003", "TC-ATTACH-004"] | SUITE-A/SUITE-B；local_mechanism；local/real对应七scriptgate | AC-BR-015、AC-BR-017、AC-BR-020；VETO-BR-003 | `reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-008 / CUT-BR-DELIVERY | ["TC-DELIVERY-001", "TC-DELIVERY-002", "TC-DELIVERY-003", "TC-DELIVERY-004", "TC-DELIVERY-005"] | SUITE-C；local_mechanism；local/real对应七scriptgate | AC-BR-015、AC-BR-018、AC-BR-019、AC-BR-020、AC-BR-021、AC-BR-030；VETO-BR-004 | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-009 / CUT-BR-CALLBACK | ["TC-CALLBACK-001", "TC-CALLBACK-002", "TC-CALLBACK-003", "TC-CALLBACK-004", "TC-CALLBACK-005"] | SUITE-A/SUITE-P；local_mechanism；local/real对应七scriptgate | AC-BR-014、AC-BR-022、AC-BR-023、AC-BR-024、AC-BR-025、AC-BR-026、AC-BR-027；VETO-BR-002、VETO-BR-004、VETO-BR-006 | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-010 / CUT-BR-KEY | ["TC-KEY-001", "TC-KEY-002", "TC-KEY-003", "TC-KEY-004", "TC-KEY-005"] | SUITE-C；local_mechanism；local/real对应七scriptgate | AC-BR-003、AC-BR-007、AC-BR-009、AC-BR-012、AC-BR-018、AC-BR-023、AC-BR-026、AC-BR-027、AC-BR-029、AC-BR-031、AC-BR-034、AC-BR-035；VETO-BR-005 | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-011 / CUT-BR-CURSOR | ["TC-CURSOR-001", "TC-CURSOR-002", "TC-CURSOR-003", "TC-CURSOR-004"] | SUITE-C；local_mechanism；local/real对应七scriptgate | AC-BR-012、AC-BR-028、AC-BR-029、AC-BR-031、AC-BR-034、AC-BR-035；VETO-BR-005 | `reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-012 / CUT-BR-RATE | ["TC-RATE-001", "TC-RATE-002", "TC-RATE-003", "TC-RATE-004", "TC-RATE-005"] | SUITE-C/SUITE-B；local_mechanism；local/real对应七scriptgate | AC-BR-030、AC-BR-034、AC-BR-036；VETO-BR-005 | `reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-013 / CUT-BR-RECOVERY | ["TC-RECOVERY-001", "TC-RECOVERY-002", "TC-RECOVERY-003", "TC-RECOVERY-004", "TC-RECOVERY-005"] | SUITE-C；local_mechanism；local/real对应七scriptgate | AC-BR-021、AC-BR-028、AC-BR-031、AC-BR-034、AC-BR-036；VETO-BR-005 | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-014 / CUT-BR-LOCAL | ["TC-LOCAL-001", "TC-LOCAL-002", "TC-LOCAL-003", "TC-LOCAL-004", "TC-LOCAL-005", "TC-LOCAL-006"] | SUITE-L/SUITE-REAL；mixed；local/real对应七scriptgate | AC-BR-007、AC-BR-018；无独立VETO，依原AC | `reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-015 / CUT-BR-READ | ["TC-READ-001", "TC-READ-002", "TC-READ-003", "TC-READ-004"] | SUITE-R；local_mechanism；local/real对应七scriptgate | AC-BR-026、AC-BR-033、AC-BR-034、AC-BR-036；VETO-BR-005 | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-016 / CUT-BR-AUDIT | ["TC-AUDIT-001", "TC-AUDIT-002", "TC-AUDIT-003", "TC-AUDIT-004", "TC-AUDIT-005"] | SUITE-C/SUITE-A；local_mechanism；local/real对应七scriptgate | AC-BR-028、AC-BR-032、AC-BR-034、AC-BR-035、AC-BR-036；VETO-BR-004 | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-017 / CUT-BR-CONFIG | ["TC-CONFIG-001", "TC-CONFIG-002", "TC-CONFIG-003", "TC-CONFIG-004", "TC-CONFIG-005", "TC-CONFIG-006", "TC-CONFIG-007", "TC-CONFIG-008", "TC-CONFIG-009", "TC-CONFIG-010", "TC-CONFIG-011", "TC-CONFIG-012"] | SUITE-B/SUITE-I/SUITE-A/SUITE-P/SUITE-C/SUITE-W/SUITE-J；local_mechanism；local/real对应七scriptgate | AC-BR-001、AC-BR-002、AC-BR-006；无独立VETO，依原AC | `reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-018 / CUT-BR-PRIVATE | ["TC-PRIVATE-001", "TC-PRIVATE-002", "TC-PRIVATE-003", "TC-PRIVATE-004", "TC-PRIVATE-005"] | SUITE-P；local_mechanism；local/real对应七scriptgate | AC-BR-002、AC-BR-005、AC-BR-013、AC-BR-016、AC-BR-017、AC-BR-020、AC-BR-025、AC-BR-037、AC-BR-038；VETO-BR-003 | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-019 / CUT-BR-ENTRY | ["TC-ENTRY-001", "TC-ENTRY-002", "TC-ENTRY-003", "TC-ENTRY-004", "TC-ENTRY-005", "TC-ENTRY-006", "TC-ENTRY-007"] | SUITE-I/SUITE-W/SUITE-J；local_mechanism；local/real对应七scriptgate | AC-BR-008、AC-BR-014、AC-BR-027；无独立VETO，依原AC | `reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-020 / CUT-BR-STATE | ["TC-STATE-001", "TC-STATE-002", "TC-STATE-003", "TC-STATE-004", "TC-STATE-005", "TC-STATE-006"] | SUITE-D/SUITE-I/SUITE-J/SUITE-W；local_mechanism；local/real对应七scriptgate | AC-BR-034、AC-BR-038；无独立VETO，依原AC | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及.md；真实cases/suites+finalindex/checks |
| EV-CONTRACT-021 / CUT-BR-EVIDENCE | ["TC-EVIDENCE-001", "TC-EVIDENCE-002", "TC-EVIDENCE-003", "TC-EVIDENCE-004", "TC-EVIDENCE-005"] | SUITE-TOOLS；local_mechanism；local/real对应七scriptgate | AC-BR-032、AC-BR-037、AC-BR-038；VETO-BR-003、VETO-BR-004 | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及.md；真实cases/suites+finalindex/checks |
| EV-REAL-001 / CUT-BR-REAL | ["TC-REAL-001", "TC-REAL-002", "TC-REAL-003", "TC-REAL-004", "TC-REAL-005", "TC-REAL-006", "TC-REAL-007"] | SUITE-REAL；real_seam；local/real对应七scriptgate | AC-BR-002、AC-BR-008、AC-BR-010、AC-BR-014、AC-BR-024、AC-BR-038；VETO-BR-001、VETO-BR-006 | `reports/runs/<run_id>/evidence/EV-REAL-001.json`及.md；真实cases/suites+finalindex/checks |

每EV读者必须反查caseinstance全部expectedparams与contextscope，包括LOCAL-006actualdriver归EV-CONTRACT-014的mixedscope、STATE M与SURFACE model/host路由；不能因为一段synthetic通过就宣actualstore/所有平台/owner已准入。缺case/参数/check/实际资格→missing或blocked，不能从表自动补evidencepage。

22EV具体tc_refs对116TC全覆盖且无重复cut归属；单EV可以有多个AC，一个AC可以消费多个EV，但不得把这个设计映射当runtimeaccepted或verdict。每原38AC至少有planned EV方向，真实运行的AC状态仅not_evaluated/blocked/available_for_review。

### 7.4 报告与审查交接

#### 文件布局树: planned固定run安全产物

```text
artifacts/test/<run_id>/
|  +-- context.json
|  +-- index.json
|  +-- cases/<instance_id>.json
|  +-- suites/<suite_id>/<context_id>/
|  |   +-- report.json
|  |   +-- stdout.log
|  |   +-- stderr.log
|  +-- checks/
|      +-- run-context.json
|      +-- test-evidence.json

reports/
|  +-- runs/<run_id>/
|  |   +-- index.json
|  |   +-- summary.md
|  |   +-- evidence-index.md
|  |   +-- gate-results.md
|  |   +-- redaction-check.md
|  |   +-- suites/<suite_id>/<context_id>.md
|  |   +-- evidence/<EV-ID>.json
|  |   +-- evidence/<EV-ID>.md
|  +-- acceptance/<run_id>/
|  |   +-- handoff.json
|  |   +-- handoff.md
|  |   +-- veto-checklist.md
|  |   +-- open-issues.md
|  |   +-- risk-acceptance.md
|  +-- review/<run_id>/
|      +-- review.json
|      +-- reviewer-notes.md
```

关键说明：都是未来计划，不物化目录/文件或例run。artifacts不带<project>层，不latest；acceptance/review具fixedrun。stdout/stderr.log只有safe有限tokens不是消息/secretrawlog；人审材料同样禁自由业务正文/私有ref。

| 报告族 | 来源 | planned生成脚本 | 具体内容/审查责任 |
|---|---|---|---|
| summary/suite/gate/redaction与ReportIndex | 实际context/index/case/suite/checks；allowlist预验 | scripts/reports/build-bridge-test-report.sh | schema/design/source/configscope、coverage/failure/blocked/qualification、各suiteactual状态与引用；人审失败解释/actualscope非fake |
| evidence-index.md与EVjson/md | actualfinalindex、case/suite/digests/checks、22具体EV/TC/AC计划 | 同上 | 每EVactual实例与sourcepaths/hash/context/TC/AC反查；不从静态registry填写passed |
| acceptancehandoff/veto/openissues/riskacceptance初稿 | validatedReportIndex/EV，以及38AC/VETO方向 | scripts/reports/build-bridge-acceptance-handoff.sh | 自动只draft/材料available_for_review，缺项blocked/not_evaluated；风险接受页只未裁决清单，不编风险接受/批准/signoff |
| review.json/reviewer-notes.md | 同fixedrunReportIndex及实际授权人审 | actualhuman/authorizedreviewer（非报告脚本自动填） | assignment真实、scope/current/基线/unknown责任/残余risk/变更要求；无自动验收verdict |

人可读.md必须由已校验typed字段/有限中文模板渲染，不echo stdout/rawerror/业务ID/ref/config；文件只source_ref相对test路径/安全摘要、有限status/reason/TC/DS/EV/AC/VETO标记、批准baseline安全字段。reportsha对其实际UTF-8存储bytes计算，markdown安全也必须检查不自动template注入。review只有限comment_codes与安全模板，不准粘业务payload；actual身份assignment在私有正式渠道核验，报告只是slot。

reviewer/风险接受/验收owner签署不由schema或工具制造；本轮status不填写true/通过/ready。06标准未校准，无readiness规则或verdict实例。源码中的scriptcapability、真实run材料、consumer接受与Observabilityevidence分别责任，Bridges不宣canonical审计材料就是测试EV或ownertruth。

TEST-03-001schema闭口只在原S/P testtargets及七plannedscript内test-only实现，当前不新Rusttype/文件；03完整contract对05§13的固定引用已满足，无公共协议回写。

## 8. 回填草稿

正式§13完整取§7 schema/算法/EVplan/报告链，schema链接具名可点击且正文保字段/跨约束不只列表；不搬问题诊断/自检。

## 9. 待确认事项

artifact保留期限/actualproducer资格未批准，不能造天数、自动purge或真实EV实例。formal06/07待用户授权，报告工具不替代验收。

## 10. 自检与进入下一步条件

实际审计修正：EV登记初检查发现SURFACE仅FR/DR映射无AC方向，STATE源向表未同步横切行；在停止EV推进后只补00原AC006/013/020/026/035/037/038的codec数据边界与AC034/038 stateguard关联，以及原BR004/017/019源向STATE，未新增需求/断言。EV registry骨架保留直到各source方向齐后再逐EV写入；22EV/116TC/38AC机器反查通过。工具suite跨S/P的childrunner归属、context16×suite13的refcap256及safe数组cap已校准，未造runner实例。

实际自检：9rootDTO/34defs/106ref required闭合与7标识grammar实际检查，22plannedEV逐TC/suite/AC方向反查116TC/38AC；表中pipe初审捕获修后pass，rawlog名同步但仅安全tokens，全部设计无实例。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step14_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
