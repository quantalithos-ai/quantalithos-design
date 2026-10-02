# 05 测试方案最终静态审查记录

日期：2026-10-02。范围：本项目05 full-restart；当前agent单独执行。此记录只说明文档/设计静态核对，**不是实际测试报告、EV、验收verdict、owner signoff或readiness**。

## 1. 恢复与正式装配

恢复入口为[项目台账](project_execution_ledger.md)→[05 flow](05_test_plan_calibration_flow.md)→[Step15](05_test_plan_step_15_formal_document_assembly.md)。Step1～14完成设计回核、13CUT独立停审、差异与[跨文档审查](05_test_plan_cross_document_review.md)后才开放装配门禁。旧217行05已删除；重建规范15章骨架，依次装配A（§1～5）、B（§6～10）、C（§11～15），不沿旧12章或commerce/install对象改名保留。

[正式05](../05-测试方案.md)每章有具体校准来源及延伸阅读；完整104矩阵、98TC、49入口字段、主suite集合、artifact schema明确为规范性组成，不以摘要替代全量。元信息区分design completed与not-run，下游立即停审。

## 2. 静态检查与证明上限

方法：终端内只读Node检查文本/表格/编号/链接，JSON.parse解析设计schema并核对局部ref/required；人工回核业务边界、状态/失败窗口、摘要DAG与证明范围。检查程序未保存成脚本；未创建实现仓或测试artifacts/reports。

| 检查 | 实际静态结果 | 不证明 |
|---|---|---|
| 正式结构 | 15章名称/顺序完整，各章有具体来源/延伸阅读与正文 | 用户已确认或测试已运行 |
| Step纪律 | 15主Step固定十段，每步8计划项及gate_status/gate_reason/next_allowed_action/source_files | owner签核或actual suite exit |
| 需求集合 | 104行与00恰相等：FR16/BR21/NFR17/AC20/IF14/DEP11/VETO5；208正反TC引用均有效 | 运行覆盖率或真实positive资格 |
| TC/EV | 98唯一TC及98唯一EV双射，无编号复用；每case DS有效 | 已生成实际EV或收集证据 |
| suites | 11主集合互斥且并集恰98：D6/S22/I5/P21/W14/B2/C14/X1/R11/E1/M1 | smoke可代表全部P0 |
| DS/CUT | 13DS与schema/98行一致，13CUT独立设计审查齐备 | fixture文件/资源已创建 |
| 入口/字段 | 21C/16Q/12J=49；49Request字段名集合逐项与03七U同名schema相等 | Rust/TS编译或实际transport正常 |
| 状态 | 14enum全集与03一致；222pair=73A/51S/98R | 222pair及guard实际执行通过 |
| ports/对象/canonical/page | 17ports/146methods、43对象、33write DTO和七PageReadContext方法来源闭合 | adapter/PG/SDK已实现或资格通过 |
| 错误与配置 | 18ErrorCode与03映射一致；六域/七字段/八slot/四profile无新增业务flag | 真实provider/配置加载/认证已核验 |
| 脚本库存 | 22 planned路径：12gates/6checks/4report generators | 脚本能力或CI已存在 |
| JSON Schema | 设计JSON可解析；11kinds/48defs/135局部ref无断裂；object required/property声明一致 | 已实现validator或负例运行通过 |
| 文档格式 | 所选05正文、全部05 calibration及项目台账的本地links/anchors、表列、围栏、尾随空白已核验 | 外部服务可用或正式consumer qualified |
| 范围内diff | git diff --check通过；新增calibration尾随空白亦单独检查 | 全仓其他dirty属于本轮或应被提交 |

本记录落盘及三层状态同步后再次执行同范围检查；完整记录纳入检查集合。没有运行cargo/npm/PG/API/Worker/browser、CI、gate、report generator或schema validator。

## 3. 语义和证据边界回核

| 风险面 | 收口要求 |
|---|---|
| owner/publisher/source | immutable ref/version/digest/visibility及formal资格；无owner正文/Identity truth复制，Identity仅AI |
| Draft/Submit | Draft只draft_spec且basis/review=None；Submit才freeze PublicationBasis与review work同Tx |
| shell/version/review | CreateListing无decision前置、Register→Staged；MatchedDecision可含rejected；List必须current approved/fullgate |
| Record outcomes | receiver/notice Command只接受exact formal Confirmed；negative/unknown由Job承接，ACK不等approval/installed/delivered |
| unknown/cancel/withdraw | A未KnownCommitted零effect；原intent probe-first；B新load/CAS/frame；保late真实binding/责任，不复活版本或抹远端结果 |
| readonly/replay | 全16Q/33original replay零可变资源；完整原payload全部当前可披露或整体安全拒绝，不裁字段冒原结果 |
| PG/projection/page | actual PG验证frame/CAS/as-of/race，不以总rollback遮commit；full manifest/body与Fresh同Tx；七paged同currentfilter/count/token |
| audit/Observation | 六字段refs-only；21C+8J O，RecoveryJob只P，Obs2/Rebuild无O/P；原auditset固定，receipt非evidence |
| artifact/digest | JSON仅排顶层record_digest，保child/ref hash；JSONL逐line schema且文件raw hash；MD/exact bytes，不当资产摘要或签名 |
| 引用DAG | artifact-stage→run→EV→index→seal-stage→draft；stage文件分离、无self-ref/EV回指index/index回指seal |
| 真实性 | same-run完整required raw/report/checks；失败仍报告，缺执行not_run；不信passed/redaction标签或静态表 |
| 成熟度 | script capability/index shell/final EV/draft分层；全部planned/blocked/waiting，draft非verdict/signoff |
| 禁止扩展 | 0active Event/outbox/财务/Archive writer；Billing/订阅/分成/跨境与无owner entitlement/transaction不偷渡当前truth |

首轮格式核对发现§5缺显式“延伸阅读”文字，已补齐。状态计数排除A/S/R网格重复行，只数详细From/To/分类；canonical合并行逐入口展开，正确结果为222pair/33DTO。错误名取03正式HTTP映射，分页方法取真实trait声明而非文档镜像。以上是只读核对口径修正，不是变更业务库存。

MP-SRC-003沿03“draft TS/React与正式Rust/Vue差异”语义，human/org/auth为MP-UP-003；04历史标签差异保留受控后续核对，未擅自修改正式04。

## 4. 修改范围与未执行事项

本轮05修改组：[正式05](../05-测试方案.md)、`05_test_plan_calibration_flow.md`、15主Step、Step6 contract_index/cut_reviews、Step13 artifact_schema、cross_document_review、本记录、`project_execution_ledger.md`。本次恢复段主要补正式§6～15、§5来源说明、Step15及三层状态，不重复前序已完成设计。

未修改本项目正式00～04、旧06、draft/原型/server，未修改其他项目正式文档或owner台账；其他项目、根目录package文件和既有dirty均保持。未创建manifest/lock/实现脚本/实施台账/skeleton；只读确认目标`/home/aris/Projects/quantalithos-marketplace`不存在，07尚未创建。

没有实际implementation commit、run、资产包/真实digest、扫描/签名/支付结果、evidence、verdict、signoff、risk acceptance或readiness；未提交commit。文档内所有TC/EV/script/路径/结果条件均为未来设计，不是运行实例。

## 5. 保留blocker和停审

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响owner/SDK/provider/PG/TLS/auth资格继续pending/blocked/affected/future。五类export、human/org/auth、Governance fullbinding、材料、receiver/probe、notice、safe producer缺口不由本地负例或静态审查关闭；生产容量/保留authority未确认，Billing/Archive扩展仍future/blocker。十项R-MP-DDD本地验证残余未实测、未接受。

05 Step1～15及正式15章design completed / selfcheck_done / stop_review / waiting_user_confirmation。项目和文档跨步gate=blocked，原因是等待用户明确确认05；下一动作只等待或按用户意见修订05。06/07 not_started，implementation ledger与全部planned/blocked/waiting boundary skeleton继续waiting_07。获得明确确认后才读取06 SOP/书写规范及05 scope/AC/VETO/证据/风险；无需提交commit。
