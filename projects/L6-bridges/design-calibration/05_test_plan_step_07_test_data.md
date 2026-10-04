# L6-bridges 05 Step7：测试数据

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| test_data | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step08_skeleton | 本Step§2/7；实际静态审计 |

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

已读Step6的116TC与两design-only registry、03§8/9/10.1/16.3；复核SOP Step7九问题/书写§5.7。每case前置已有完整typed来源/状态，本步只定义test-only稳定构造、变异、隔离与清理，不新业务schema。

## 3. SOP问题回答

1. 22DS基础族完整构造original/namespace/Slots/current/expected及脚本；不以显示名/rawbody当ref。
2. 单一invalid维度实例、phase failpoints、barrier/clock和proof分支各独立freshdataset；重放故意共享同原identity。
3. harness隔离键run/caseinstance只隔离进程/sandbox/输出，不参与businesskey/effect/预算。
4. synthetic内存drop；actualsandbox partition只能按明确批准cleanup/责任登记处置，不purgeunknown、生产键或既有证据。
5. fake/stub只已标synthetic机制；real-like不是第三种资格。actualfixture必须真实授权未建立则blocked。
6. 每116TC回具名22DS族及casevariant构造脚本；状态源manifest逐pair完整typedfixture。
7. negative/边界/concurrency/recovery独立case_variant，防污染而不是新业务namespace逃重复。
8. 每DS审builder/隔离/清理/替身/source及其TC，写后停审。
9. 全DS审查无人工临时造数、copyproductionsecret、跨run复用scope或readonly变成清理。

## 4. 当前材料问题诊断

同DS族并不等于同mutablefixture：每caseinstance重新构造，仅用例内部original duplicate/recovery共享identity。当前没有真实Fixture/provider注册；不能把04fixture example标ready，也不能清理original unknown以重跑。

## 5. 改动前后对比

| 易漏项 | 本步规则 |
|---|---|
| DS只有名字 | 每族原factory/完整来源/负向变异/current脚本/TC数组 |
| runid写入businesskey | 隔离元数据与业务key分离，原effect重试不变 |
| happy fixture污染负向 | 每tuplefresh，clock/barrier固定，intent内重放共享original |
| cleanup一律删库/文件 | syntheticdrop；actual批准scope/unknown责任/证据保留，不广域删除 |

## 6. 测试设计取舍与复杂度

22族逐条构造/隔离/清理停审；复杂typedschema继续唯一03，不抄成新field definitions。表约40行但完整TC数组/变异、公共fixture合同可落码，当前不实现builder/seed或测试文件。

## 7. 结构化中间产物

### 7.1 Fixture公共合同

支持路径仅03原application/tests/support/{mod,qualified_ports}.rs、infra/tests/support/{mod,qualified_providers}.rs与原十一testtarget内test-only代码；局部harness DTO在S/P testtarget内，不进production contracts/lib。config完整strictJSON沿04§7.5，所有fixture selector当前未注册/不可运行，不是providerfallback。

builder先完整合法schema，再按(case_id,parameter_id)固定typed变异；参数封闭族见Step6/状态registry。fixture记录source_selector/schema_version、variant token、固定seed、合法original/key/meaning/effect、expected全集、fake port顺序/result/authority/current、deterministicclock/barrier/failpoint。任何缺required/Slot不补空/0/default；fakeproof明确synthetic且仅local测试。

隔离键=harness run_id/case_instance_id，放test进程和批准sandbox分区/安全artifact上下文，不进入原业务key/meaning/effect/target/usedwindow。每instancefresh factory数据；一个replay/recovery场景刻意复用同original+key+window+used。并发barrier控制两个caller的同absence/expected而非概率sleep；logicalclock避免walltime漂移，actual时限/clock资格另REAL验证。

synthetic所有privatecanary仅内存，不序列化fixture/dump/快照。检测其raw、base64/hex及其他可还原派生时只产生有限assertion token，检查器不把匹配内容/摘要保存。teststdout只允许已清洗harness输出。

### 7.2 数据前置到具体用例

全DS=planned，未生成或运行；safe ref/token字符串是test-only locator，不声明真实account/provider/grant。下表每DS的variant应按具体TC步骤选择，不能用一个happyvariant覆盖全族。

| 数据集/切口 | 构造方式与正式来源 | negative/边界/并发/恢复变体 | 隔离/清理 | 具体TC |
|---|---|---|---|---|
| DS-SURFACE-001 / CUT-BR-SURFACE | 20exact wire builders/19Domainfactory，03§8/16.3 field checklist | full.required/nullable/Slot/enum与单字段delete/type/kind/scope/UTF-8/budget变异 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003、TC-SURFACE-004 |
| DS-BIND-001 / CUT-BR-BIND | BridgeInstallation configure/apply、ExternalBinding propose/activate正式shape，script config/authorization ports | Pending/Active/撤销/双expected；managementduplicate/barrier/旧generation | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-BIND-001、TC-BIND-002、TC-BIND-003、TC-BIND-004 |
| DS-MAP-001 / CUT-BR-MAP | 三link_known/link factories，原two-end/binding generation/parent/message/source/result Slots | absent/多候选/namespace-kind交叉、Stale/Revoked/Tombstoned及unique竞争 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-MAP-001、TC-MAP-002、TC-MAP-003、TC-MAP-004、TC-MAP-005 |
| DS-INBOUND-001 / CUT-BR-INBOUND | PlatformIngressPort synthetic verified Private+Conversation formalmode scripts，originalUoWclaim | 四platform/source，验签/时限/marker/selfsend、safe-ref不足、ownerknown/unknown/ACKlost | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-INBOUND-001、TC-INBOUND-002、TC-INBOUND-003、TC-INBOUND-004、TC-INBOUND-005 |
| DS-CHANGE-001 / CUT-BR-CHANGE | 原message/location parents及source version typed builders，capability脚本 | create/edit/delete/thread/topic/root；old/Equal/After/Unknown/unsupported，禁止同happy变异混跑 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-CHANGE-001、TC-CHANGE-002、TC-CHANGE-003、TC-CHANGE-004 |
| DS-PRESENT-001 / CUT-BR-PRESENT | SafePresentationPlan prepare qualifiedsource/disclosure/current/attachment脚本 | committed/uncommitted、hint/existence/entry/action分维、C04/E02effectbarrier | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-PRESENT-001、TC-PRESENT-002、TC-PRESENT-003、TC-PRESENT-004 |
| DS-ATTACH-001 / CUT-BR-ATTACH | authorizedArtifact/ref/Grant+短借renderer，synthetic附件字节仅内存 | required/optional+omissionbasis、expired/revoked/oversize/redirect/wrongroute | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-ATTACH-001、TC-ATTACH-002、TC-ATTACH-003、TC-ATTACH-004 |
| DS-DELIVERY-001 / CUT-BR-DELIVERY | intent/attempt/lane原factory，B实际proof脚本和known business result原typedlocator | A/B/C每phase failpoint、HTTP/业务error、unknown/lateknown、sameeffect重复 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005 |
| DS-CALLBACK-001 / CUT-BR-CALLBACK | ExternalActionBinding bind与CallbackHandoffRecord from_verified，formal responsibility/owner revisions | tamper/expired/crossactor-target-source、双claim barrier、unknown/lateknown/hiddenread | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-CALLBACK-005 |
| DS-KEY-001 / CUT-BR-KEY | 六namespace完整canonical recipe+DedupRecord full original/window/result；J05独立Jobinput | same/changed meaning/跨域、Reserved/ResultRecorded/Indeterminate/Expired、双key/fullCAS | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-KEY-001、TC-KEY-002、TC-KEY-003、TC-KEY-004、TC-KEY-005 |
| DS-CURSOR-001 / CUT-BR-CURSOR | StreamCursor/GapRecord factory或合法full storedrow，typed comparator与fullcoverage | Equal/Before/After/Unknown/不同stage-epoch、partial/emptycount、B成功Cfail | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004 |
| DS-RATE-001 / CUT-BR-RATE | DispatchLane factory/full scope-set/fence、原used/window/NoEffect/RetryEligibility | 共享global/method/resource/bucket、多bound max、unknownbucket/leasecancel/预算±1 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-RATE-001、TC-RATE-002、TC-RATE-003、TC-RATE-004、TC-RATE-005 |
| DS-RECOVERY-001 / CUT-BR-RECOVERY | RecoveryRecord request及LocalCommit/Owner/Platform/Consumer各独立readonly脚本 | known/notfound/absence/timeout/currentrevoked、原subjectop错误、nonrecursive consumer续交 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-RECOVERY-001、TC-RECOVERY-002、TC-RECOVERY-003、TC-RECOVERY-004、TC-RECOVERY-005 |
| DS-LOCAL-001 / CUT-BR-LOCAL | 19完整安全collection rows+originalmutation/resultjournal/whole expected/unique，qualified_providers test-only | 逐phase/逐expected/phantom/seal/driver/source/schemafail；real driver fixture另外受准入 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-LOCAL-001、TC-LOCAL-002、TC-LOCAL-003、TC-LOCAL-004、TC-LOCAL-005、TC-LOCAL-006 |
| DS-READ-001 / CUT-BR-READ | 四Query allowlist root完整safe readqualification/snapshot，无dummy对象 | visible/hidden/authorizedabsent/incomplete、standaloneplan/action、concurrentwriter/currentrevoked | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004 |
| DS-AUDIT-001 / CUT-BR-AUDIT | BodyFreeMutationMaterial四字段+actualmutation脚本、O01九字段、原consumerop/canonical/schema/admission | missingmandatory/冒producerfamily、E04错op/source、ACKlost/known/NoEffect/预算 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-AUDIT-001、TC-AUDIT-002、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005 |
| DS-CONFIG-001 / CUT-BR-CONFIG | 04§7.5 fullJSON复制为strictschema builder，82key/20domain及entry三参数 | 82required，5hardtuple界限，22CF/27F、12CFGcases、5env/selectedrequired/null/cold | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-CONFIG-001、TC-CONFIG-002、TC-CONFIG-003、TC-CONFIG-004、TC-CONFIG-005、TC-CONFIG-006、TC-CONFIG-007、TC-CONFIG-008、TC-CONFIG-009、TC-CONFIG-010、TC-CONFIG-011、TC-CONFIG-012 |
| DS-PRIVATE-001 / CUT-BR-PRIVATE | 每禁材族内存syntheticcanary+safeallowlist输出；exact五purpose/secretrefs短借 | rawerror/SDKDebug/headers/body/callback/Gate/URL及base64/hex/hash派生，各出口分别 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-PRIVATE-001、TC-PRIVATE-002、TC-PRIVATE-003、TC-PRIVATE-004、TC-PRIVATE-005 |
| DS-ENTRY-001 / CUT-BR-ENTRY | RuntimeExecutionState/JobInvocationState/PlatformSourceSession/WorkerSchedulingBatch from_parts | 7bin/19callable/5Job、mode排他/ownedplan/take-return、stopclock/window/same4tuple/overflow | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-ENTRY-001、TC-ENTRY-002、TC-ENTRY-003、TC-ENTRY-004、TC-ENTRY-005、TC-ENTRY-006、TC-ENTRY-007 |
| DS-STATE-001 / CUT-BR-STATE | state_pair_registry的每From用合法Domainfactory/fullhydrate或technicalfrom_parts，不genericsetter | 150pair及375未列candidate、每guard反例、终态/unknown/immutable/no-viewstate | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 |
| DS-EVIDENCE-001 / CUT-BR-EVIDENCE | local harness safe DTO builders及安全blob；116TC/22cut/源trace registry计划 | missing/unknownfield、fakepassed、digest/run/path/caseparam少一、redaction、writer中断 | 每instance独立；synthetic内存drop；真实driver须另批准partition，不删unknown/evidence | TC-EVIDENCE-001、TC-EVIDENCE-002、TC-EVIDENCE-003、TC-EVIDENCE-004、TC-EVIDENCE-005 |
| DS-REAL-001 / CUT-BR-REAL | 只引用实际已批准sandbox/provider/manifest/pin/namespace/secret/owner/producer资格，不造真实fixture | 四platform/六owner/Bus/actualstore/executor/probe/rate/secret各前置缺一→blocked | 实际批准sandbox；缺资格blocked；cleanup另有批准，保未知责任 | TC-REAL-001、TC-REAL-002、TC-REAL-003、TC-REAL-004、TC-REAL-005、TC-REAL-006、TC-REAL-007 |

### 7.3 清理与actual数据边界

clean仅作用于明确的test-only内存/临时sandbox资源，无productionGC/删除业务key/改retention接口。actual未知effects须保原op/claim/receipt/source与对账责任，不能为了让下一case干净而清除；sandbox关闭/归档需批准policy和对应owner处置，未建立则blocked。fixed-run安全artifacts/reports按未来正式保留规则，不覆盖历史run或假清理成通过。

只允许合成消息/附件/callback/审批canary；不接入真实敏感审批或生产消息。actual平台fixtures使用批准的安全testobjects及secretrefs，凭证始终privateprovider解析，不入fixture/env/durable/log/report。平台外部删除不能作为ownertruth删除/测试清理捷径。

## 8. 回填草稿

正式§7取§7.1~7.3；保test-only与DS具体TC列表/隔离/清理，静态review记§10。当前无新运行fixture或真实数据。

## 9. 待确认事项

所有22DS仍planned，真实DS-REAL及actualstore/平台/账号/cleanup policy未建立；本地数据定义不解除BR-UP/WS/affected资格。下一Step读04五env/entry/profile严格矩阵。

## 10. 自检与进入下一步条件

实际自检：22DS逐族builder/单变异/脚本/隔离/cleanup审查并与116TC实际反查，无人工造数/productionsecret；run与原businesskey分离，actualcleanup保责任。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step08_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
