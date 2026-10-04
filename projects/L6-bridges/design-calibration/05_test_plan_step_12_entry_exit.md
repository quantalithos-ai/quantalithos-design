# L6-bridges 05 Step12：进入退出

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| entry_exit | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step13_skeleton | 本Step§2/7；实际静态审计 |

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

已读Step7~11与SOP Step12五问题/书写§5.12、00 AC/VETO方向及04/上游门禁。设计成文、自检、codeimplementation、actualtest、验收分别层级，当前只能设计自检。

## 3. SOP问题回答

1. 00~04与当前05正式设计用户认可才实施测试输入；06标准正式资格未来另确认，07实施授权/ledger/boundary未建立不得运行。
2. 22DS/expectedmanifest/fixture隔离、approvedconfig五env/profile、selectedactualseam前置可判定；未实现不能说ready。
3. 七planned脚本+harness/十一targets须真实实现/工具可用及S/P证据自测，才能真实运行。
4. local全部P0实例+安全checks；real全部selectedscopeactualassertions/current资格；report完整digest/TC-EV-AC链；handoff人审另06裁决。
5. 任S/A、P0fail/漏instance、wrongbaseline、禁材、upstream缺准入、unknown责任未闭或无safe归档阻对应exit；总体passed比例不替。

## 4. 当前材料问题诊断

单一“全部通过退出”会把localmockpass释放real、把formal05成文升级readiness。每门禁定义可观察条件和缺失结果，当前status保持planned/blocked/not_evaluated。

## 5. 改动前后对比

| 模糊条件 | 可判定条件 |
|---|---|
| 文档基本完整 | 固定正式输入+用户认可+07实施/测试授权，缺一不得执行 |
| 环境准备好 | 每selectedscope实际资格/source/pin/current、DS/expectedinstance/toolcapability齐 |
| 用例多数通过 | closedexpectedmanifest每P0实例有真实status/断言、无fail/blocked/unavailable/notrun |
| 已经生成报告 | checks验证schema/digest/baseline/sourcecase后，EV实例才可交接，人审非自动verdict |

## 6. 测试设计取舍与复杂度

分进入/退出与本轮状态表，约70行；引用后续Step13即将闭口的schema合同为dependent设计项，不伪称已运行。06验收标准不给falsefreeze；以00 AC方向保持可写设计。

## 7. 结构化中间产物

### 7.1 进入准则

以下均条件计划，无勾选或真实满足声明。

| 门禁 | 必须可判定的输入 | 缺失结果 |
|---|---|---|
| DESIGN-ENTRY | 当前00~05设计输入被用户明确认可；没有未处理03/04合同影响；06只按正式资格或00验收方向 | 阻implementation/测试准入；不以05成文获授权 |
| EXECUTION-AUTH | 正式07完成、实施ledger/全部plannedboundary建立、用户明确实施/测试授权；真实repo/source_revision存在 | 当前implementation/test权限=false，blocked |
| LOCAL-ENTRY | 11targets/7scripts/harness实际实现、工具/manifest/pin齐；22DS test-only可稳定构造；expected-instance manifest完整路由 | 未实现/缺工具=unavailable/blocked，不能生成fakecase |
| REAL-ENTRY | 每selected actualplatform/owner/secret/route/driver/executor/producer/Bus current/source/schema/pin/scope/basis、安全sandbox与readonlyprobe批准；原unknown责任明确 | BR-UP/WS/affected缺口阻受影响分支，不能fallbackfake |
| MATERIAL-ENTRY | safe writer/readerschema、allowlist、boundedprivatecapture/digest/path检查真实可用；fixedrun上下文及批准safeprofile | 无context仅finitestderr；禁止rawdurable/report |
| DATA-ENTRY | 每P0case完整DS/参数脚本、negativefresh、clock/barrier/failpoint与cleanupscope批准；不copy生产敏感材料 | 数据不足blocked，不人工临时造数 |

未选Workspace/Bus/平台支路不强制依赖，但selected/mandatory不能借null/“只测试”豁免。actualprofile/source注册缺失与protective拒绝不同：负向case可以验证拒绝，正向qualification仍未满足。

### 7.2 退出准则

| 门禁 | 必须全部满足 | 未满足处置 |
|---|---|---|
| LOCAL-EXIT | 全expectedlocal P0caseinstances真实通过；20协议/19model、150pair/375未列候选/guard反例、12CFG/22CF/27F/4平台synthetic差异与VETOnegative全集完整；所有11targets/TOOLS已运行 | 任missing/failed/blocked/unavailable/not_run阻local；未列pair不可表达须真实publicsurface断言不能silent skip |
| REAL-EXIT | 每selectedreal资格及对应TC真实assertion/原stage结果成立；actualstore/core/条件SDK/owner/producer/current材料可复核；未知责任按scope解释，no-effect不猜测 | 缺资格/证据或originalunknown未获正式处置不得宣actual正向/恢复完成 |
| SAFETY-EXIT | 禁材/可还原派生0泄露要求、所有safe出口/checks通过；S/A缺陷0开放，原failure材料完整安全保留 | 禁材/越权/伪阶段即S阻；不能降低 severity或改记录passed |
| EVIDENCE-EXIT | 固定run的case/suite/context/index schema+hash+baseline+expectedcoverage验证，22EV具体TC数组/实际instances、suiteartifact与00AC方向可反查；非JSONsafe blob摘要关联 | 任何wrongdigest/漂移/假实例/自由raw/不完整report阻归档/交接 |
| HANDOFF-EXIT | validatedrunreport与EV生成，risk/blocker/qualification及缺陷残余如实标注；reports/acceptance初稿由责任人复核，最终准则按正式06 | draft非verdict/signoff；没有真实材料not_evaluated，不能自动readiness |

保护性negative通过不是同scopepositive通过；localexit不释放realexit，实际receipt也不内部Turn/已读/consumer接受。所有case result限定测试断言，不把Domainstate塞统一Success。

### 7.3 当前实际状态

当前DESIGN讨论可继续，其他门禁仅planned；全部TC/DS/suite/script/EV未实现未运行，actualseam资格blocked/not_established，正式06/07待授权。没有真实run、artifact、report、EV实例、缺陷关闭、verdict/signoff/readiness。本轮门禁仅设计静态审查，后续报告合同只设计不物化。

## 8. 回填草稿

正文§12取可判定准则/实际未执行状态；不复制checkbox勾选或后续授权猜测。

## 9. 待确认事项

所有implementation/test/handoffexit均未真实满足；03唯一反校准已登记但Step13schemas要完成。下一Step给local test-harness全schema、hash/digest/material真实性闭环与EV tc_refs。

## 10. 自检与进入下一步条件

实际自检：六entry与五exit逐项可判定，local/real/evidence/handoff不可互证；无已勾选/假run/signoff，selected资格与实施/测试权限持续blocked。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step13_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
