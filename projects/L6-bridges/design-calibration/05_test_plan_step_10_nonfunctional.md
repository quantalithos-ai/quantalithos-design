# L6-bridges 05 Step10：专项验证

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| nonfunctional | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step11_skeleton | 本Step§2/7；实际静态审计 |

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

已读00§13的16NFR与§14六VETO、Step5/6/8/9，03§10~15/04五resourcehardrange与CF/F；复核SOP Step10五问题/书写§5.10。平台公开核验原8选段/3unavailable不足建立actual时限/限流资格。

## 3. SOP问题回答

1. 性能只核平台已准入deadline/rate/budget与04hardcaps，不设无来源吞吐/延迟可用率。
2. 六VETO所有negative全自动保护性机制，actual前置另REAL；材料0泄漏/无授权0effect是要求不是结果。
3. deterministicbarrier/clock与phasefailpoint/actualdriverjointread核wholeCAS、ACKlost/unknown/lateknown/恢复。
4. 只有限安全harnessassertions/计数/phase/source版本安全标记；actualaudit原正式source，不以日志补audit。
5. 阈值只00NFR/03guard/04schema及平台currentqualifiedcapability/approvedbudget，未核则blocked。

## 4. 当前材料问题诊断

性能专项常把配置例值当SLA/实际平台合同；本轮以范围/当前批准tuple为唯一界限。synthetic延迟clock验证机制，不证明真实平台时限、网络/负载或恢复时长。

## 5. 改动前后对比

| 旧风险 | 本轮规则 |
|---|---|
| 任意p95/throughput目标 | 不设无来源SLA，actual窗口未核blocked |
| 0泄露被当已测 | 禁止底线及TC计划，实际证据待runner |
| fault只单timeout | 全phase/wholeU/barrier、四authorityunknown独立 |
| 审计看日志 | actualmutation材料/正式consumer与safeharness记录分开 |

## 6. 测试设计取舍与复杂度

16NFR逐项方法/阈值/TC/EV矩阵+6VETOnegative映射，小批补全不造新TC；专项目标正交层/testmode，不宣fullycovered运行。约90行，可直接进入缺陷复验输入。

## 7. 结构化中间产物

### 7.1 非功能专项矩阵

所有专项planned/not_run；具体EV按TC所属cut的22planned EV，真实实例必须独立run/模式/资格关联。不新增无来源SLA。

| 专项/原NFR | 指标/风险 | 具体TC | 方法/环境 | 阈值/通过条件来源 |
|---|---|---|---|---|
| 授权/secret双资格 / NFR-BR-001 | BIND/PRIVATE/CONFIG原cut契约 | TC-BIND-002/003、TC-PRIVATE-003、TC-CONFIG-007 | 逐basis/purpose/current撤销/跨ns；local/testsynthetic，actual仅批准test/staging REAL | 任何无资格外呼=0；durable明文=0（要求），来源00§13.1/04§8 |
| 版本/管理一致 / NFR-BR-002 | BIND/KEY/LOCAL原cut契约 | TC-BIND-004、TC-KEY-001/002、TC-LOCAL-002/003 | barrier同expected/变义/撤销竞争；local/testsynthetic，actual仅批准test/staging REAL | 一个whole winner，旧generation0IO、原known历史不删 |
| 入口时限/ACK / NFR-BR-003 | INBOUND/CALLBACK/ENTRY/REAL原cut契约 | TC-INBOUND-001/004、TC-CALLBACK-004、TC-ENTRY-007、TC-REAL-002 | 平台actualsource/methoddeadline及deferred合同clock边界；local/testsynthetic，actual仅批准test/staging REAL | 每平台已核pin/能力窗口遵守；未核时限blocked，无通用SLA；ACK非commit |
| 来源/变化幂等 / NFR-BR-004 | INBOUND/CHANGE/KEY/CURSOR原cut契约 | TC-INBOUND-003、TC-CHANGE-004、TC-CURSOR-002 | duplicate/变义/旧version/ACKlost；local/testsynthetic，actual仅批准test/staging REAL | owner effect单一、Protocol不Owner位置、edit/delete不新普通发言 |
| 失效隔离 / NFR-BR-005 | DELIVERY/RECOVERY/PRESENT原cut契约 | TC-DELIVERY-002/004/005、TC-RECOVERY-002/003 | 平台失败/current失效/knownfinalizefail；local/testsynthetic，actual仅批准test/staging REAL | 不回滚owner、不换channel/材料/身份；原unknown非KnownRejected |
| 安全外显/附件 / NFR-BR-006 | PRESENT/ATTACH/PRIVATE原cut契约 | TC-PRESENT-002/003、TC-ATTACH-002/003 | 存在性/入口/actionproof独立撤销、expiry；local/testsynthetic，actual仅批准test/staging REAL | 禁止敏感payload，必要附件缺失0send；省略仅ownerbasis |
| 原effect一致 / NFR-BR-007 | DELIVERY/KEY/LOCAL原cut契约 | TC-DELIVERY-001/002/004、TC-KEY-003 | A/B/Ccrash、C04/E02unique、sameop恢复；local/testsynthetic，actual仅批准test/staging REAL | 只原effect/target/版本；平台accepted非已读；unknown保head |
| 交互责任 / NFR-BR-008 | CALLBACK/BIND原cut契约 | TC-CALLBACK-002/003 | tamper/crossactor-target-ownerrevision/过期；local/testsynthetic，actual仅批准test/staging REAL | 无授权claim/owneraction=0；签名不替owner责任 |
| one-use/交互未知 / NFR-BR-009 | CALLBACK/KEY/RECOVERY原cut契约 | TC-CALLBACK-003/004 | 双callbackbarrier、lateknown/取消；local/testsynthetic，actual仅批准test/staging REAL | ownereffect单一、Claimed不复活、deferred不续token或自动approve |
| 真实限流/资源 / NFR-BR-010 | RATE/ENTRY原cut契约 | TC-RATE-001~005、TC-ENTRY-003/004/005、TC-CONFIG-002 | sharedscope最大bounds、hardtuple界限、time/batch/private/inflight；local/testsynthetic，actual仅批准test/staging REAL | 不得早于max下界；approvedbudget且04hardcap，unknown预算0自动IO；无无界backlog |
| 失败重启恢复 / NFR-BR-011 | RECOVERY/KEY/CONFIG原cut契约 | TC-RECOVERY-001~004、TC-DELIVERY-002/004 | 原subjectreadonlyprobe及NotFound反例；local/testsynthetic，actual仅批准test/staging REAL | 缺NoEffect不重发/批，sameoriginal/window/used、missingref保blocked |
| 安全审计追溯 / NFR-BR-012 | AUDIT/EVIDENCE原cut契约 | TC-AUDIT-001~005、TC-EVIDENCE-001/002 | actualwholeU/audit/producer/consumer/results分阶段；local/testsynthetic，actual仅批准test/staging REAL | mandatory缺失先阻；consumerAccepted只真实disposition，EV另runner事实 |
| namespace/cursor/窗口 / NFR-BR-013 | KEY/CURSOR原cut契约 | TC-KEY-001~005、TC-CURSOR-001~004 | 六key recipe、全coverage、expiry双key竞争；local/testsynthetic，actual仅批准test/staging REAL | samekey同意完整复用；跨epoch0advance、TTL不purge/reexecute |
| 解释性零写观察 / NFR-BR-014 | READ/AUDIT原cut契约 | TC-READ-001~004 | readbasis/hidden/currentwriter冲突及0方法计数；local/testsynthetic，actual仅批准test/staging REAL | view只Qualified/Degraded，Denied/Unavailable不fakeempty；所有mutable/probe/ID/audit=0 |
| 全出口禁止材料 / NFR-BR-015 | PRIVATE/EVIDENCE原cut契约 | TC-PRIVATE-002/005、TC-CALLBACK-005、TC-EVIDENCE-004 | 内存syntheticcanary覆盖每safeoutput/error/debug/派生；local/testsynthetic，actual仅批准test/staging REAL | 0任何禁材/可还原派生（要求非结果）；失败不dumpcanary |
| 阶段真实性/低基数 / NFR-BR-016 | EVIDENCE/AUDIT/REAL原cut契约 | TC-EVIDENCE-001~005、TC-AUDIT-001/003、TC-REAL-007 | 伪pass/ACK互证/跨run/digest/status/hiddenref负向；local/testsynthetic，actual仅批准test/staging REAL | finite安全labels/实际phase；无rawID/URL/digest/自由text；blocked不得宣readiness |

### 7.2 六VETO负向切口

| 原VETO | 必测negative TC | 阻断要求 |
|---|---|---|
| VETO-BR-001 truth/身份越界 | TC-MAP-002/004、TC-CHANGE-003、TC-REAL-003 | external_id非GlobalMember、外部delete不内部truth、owner不私表 |
| VETO-BR-002 未授权 | TC-BIND-002/003、TC-PRESENT-002、TC-CALLBACK-002/003 | current/双资格/oneuse每维验证，无许可0effect |
| VETO-BR-003 禁材泄漏 | TC-PRIVATE-002/003/005、TC-PRESENT-002、TC-ATTACH-002/004、TC-EVIDENCE-004 | durable/所有safe输出不禁材/可还原派生，fail阻归档 |
| VETO-BR-004 阶段/证据伪造 | TC-INBOUND-001/003、TC-DELIVERY-003、TC-CALLBACK-004、TC-AUDIT-002/003、TC-EVIDENCE-002/003 | ACK/ownercommit/receipt/consumer/EV分开；缺实例不pass |
| VETO-BR-005 效果/位置/读取破坏 | TC-KEY-003/004/005、TC-CURSOR-002/003/004、TC-RATE-003/004、TC-RECOVERY-002、TC-READ-002/003 | unknown/TTL/lease不NoEffect，gap无全proof不close，Query全0写 |
| VETO-BR-006 私有审批/直接执行 | TC-CALLBACK-001/002/004、TC-REAL-003 | 只交owner正式动作，0Gate/Decision本地写、0Runtime/Tools直接执行 |

### 7.3 资源阈值与方法

04五hardranges：max_inflight=1..64、max_batch=1..256、max_private_bytes=1..8388608、max_wait_millis=1..60000、shutdown_window_millis=1..120000；测试分别lower-1/lower/exactapproved/upper/upper+1及checkedconversion/乘加overflow，批准tuple不由hardrange推准入。

strictJSON cap1MiB/depth32/累计array1024及安装/adapter32、secretprovider16与selector grammar分别核；测试内部approved资源只是harnesslimits，不新增runtimeconfig。actual平台deadline、allratelimitlowerbounds、retention/retrymaximum/used/window只消费正式qualified来源，没来源blocked/manual，不采用例值5000ms等作为对外承诺。

所有faultscript保原key/meaning/effect/target/currentwindow/used，注入只控制工具/driver/网络响应，不授权重新发送或改变owner状态。故障安全记录只有有限assertion_id/status/elapsed/计数不业务refs；rawSDKerror/正文/approval/callback不能留stdout/stderr/report。

## 8. 回填草稿

正式§10取16NFR/六VETO及阈值方法，原AC方向/EV计划由§5/13关联，不产生实测阈值/verdict。

## 9. 待确认事项

actual协议时限/平台bucket/probe、approvedretention/driver产品仍BR-UP；任何没来源阈值不能添加。下一Step定义缺陷等级、safe描述、复验新run与originalunknown责任。

## 10. 自检与进入下一步条件

实际自检：16NFR与六VETO逐项TC/阈值来源审查；04resource/parse所有边界有实例要求，无新SLA或日志补audit，synthetic不actual性能证明。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step11_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
