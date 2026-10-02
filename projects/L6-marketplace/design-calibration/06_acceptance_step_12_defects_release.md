# Step 12：缺陷分级、复验与放行

## 1. Step 状态

SOP Step12/规范5.12；正式§12；completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=分级/复验/证据失效/放行规则自检完成；next_allowed_action=读取Step13风险与authority。

### 1.1 Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读取前序/输入 | done | §2 |
| 问题回答 | done | §3 |
| 诊断 | done | §4 |
| 取舍 | done | §6 |
| 分级/复验结构化 | done | §7 |
| 复杂度 | done | 主控内矩阵，无实际defect对象 |
| 草稿 | done | §8 |
| 自检/下一步 | done | §10 |

## 2. 本步输入

source_files：[Step11](06_acceptance_step_11_veto.md)五VETO/过程P0/待确认，[Step3](06_acceptance_step_03_baseline.md)/[Step10](06_acceptance_step_10_evidence_audit.md)路径与不可变review，[05缺陷与复验](05_test_plan_step_11_defects_retest.md)、[05回归/风险](05_test_plan_step_14_regression_risks.md)、05§12及03§17。未来缺陷实例/修复/实际retest没有提供。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B定义？ | 与05完全同源：S红线/伪结果/历史与权限，A主线/状态/字段/PG/配置/报告风险，B不影响gate/权限/语义/追溯的纯展示细节。 |
| 对结论影响？ | S及任何本scope P0 A/B阻授通过；真实隔离非P0 A/B只能经authority接受支持有条件通过，未接受不能。 |
| 修复如何复验？ | 最小重现+受影响CUT/正反/库存/故障/竞争，再完整local基线全98/11suite/required送验；同新baseline fresh run，不拼旧EV。 |
| 可接受哪些缺陷？ | 已证实非P0、无五VETO/证据/资格影响的真实残余；不得因flaky/环境或owner缺口降级。 |
| 哪些阻下一阶段？ | S/VETO、未满足P0、缺positive资格/必要raw/report/check/签署、未接受残余；设计06确认与runtime放行分开。 |

## 4. 当前文档问题诊断

重跑成功不能覆盖first failure；report工具修复也须实际fresh验证，不能手改旧MD/JSON。“current拒绝正确”与“formal positive缺资格”应各记录，不把后者关闭为已修bug；无实际失败不造defect_id/commit/retest值。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 修完重跑某happy case | 最小反例/完整影响/最终98及required | 防新回归 |
| flaky选最好结果 | first failure保留、定位后新run | 保真实性 |
| deferred视为closed | 状态/证据/正式接受分开 | 不越P0/VETO |

## 6. 设计取舍

采用05测试管理状态与字段，不进入领域schema；采用fresh完整基线复验与append-only审查。未采用severity降级、同run覆写、跨run拼接、文档改动替测试或外部合同缺口当本地修复。非P0 B抽样只作修复验证补充，不代最终送验全量。

## 7. 结构化中间产物

### 7.1 S/A/B与结论

| 级别 | 定义 | 对结论影响 | 复验要求 |
|---|---|---|---|
| S | 五VETO/secret或scope泄漏、伪approval/install/payment/notice/evidence、Unknown盲发、篡历史/外部truth | actual finding总体不通过，停止相关送验/安全隔离；不得接受或降级 | 根因/fix/新反例，所有受影响正反/库存/故障竞争，fresh全98/11suite/required及红线/工具检查 |
| A | 主线缺失、state/field/page/result/config/PG/工具report或locale语义失败 | 本scope P0阻通过；只有实证隔离非P0残余可经正式接受支持条件通过，deferred非closed | 原反例+受影响CUT/邻接门禁，最终fresh全量送验；资格缺失不能靠代码关闭 |
| B | 不影响gate/data/state/authority/ref/追溯的纯展示细节 | 未接受残余不能授通过；实际已接受非P0可条件通过，不掩译义/按钮授权 | 明确影响/排期，可抽样修复验证，但最终送验仍全量；关闭需可核查复验 |

unexpected blocked/unavailable/not_run、positive资格缺失、缺manifest是过程/外部gap，均不计P0pass；expected安全拒绝/Unknown为正确typed断言时可TCpass。未送验当前没有actual缺陷分级或结论。

### 7.2 记录与关闭字段

沿05测试管理生命周期：open→triaged→fix_pending→retest_pending→closed；复验失败reopened，正式延期deferred不closed。未来每项实际记录必有defect_id/severity/state、affected TC/CUT/FR/BR/AC/VETO/design/baseline、failed run/raw/report、minimal repro/DS/seed/subcase/expected-actual安全差异、rootcause/fix refs、新run/retest范围/有效raw-report-EV、reviewer/authority及residual risk。缺真实commit或引用不得造值。

关闭需原失败与fix因果、原反例及正向/边界自动化、完整影响/红线复验、有效same-run证据和正式复验确认；关闭单缺陷不证明全项目ready或owner资格。实际管理记录只能在未来notes/人工review材料，不引入Marketplace域对象/机器kind。

### 7.3 复验影响与最终送验

| 修复/变更面 | 最小反例与影响集（TC前缀省略） | 完整要求/证据失效 |
|---|---|---|
| source/publisher/material | SOURCE全6、REFERENCE-001/002、REVIEW-003、CATALOG-005/006 | 五type/材料/current资格；正式owner输入变化先03/04，再05/06 |
| application/decision/list | REVIEW全10、CATALOG-004/005/006、CROSS-016 | freeze/fullbinding/approved-rejected/revoked/两commit序；actual PG |
| wire/object/port | CROSS-011/012/014/018及该U | 全49codec/43factory/17ports/146methods，原ErrorCode/HTTP/metadata一致 |
| state/canonical/replay | CROSS-001/002/005/013、RECOVERY-001/002 | 全14carrier/222pair/guard/S限制/R零写、33DTO/16Q/33replay、旧decoder/originalpayload |
| PG/frame/CAS/as-of/late | CROSS-003/015/016/017、DISTRIBUTION-007、WITHDRAWAL-005 | actual PG全21主TC，每写点fault/两commit序/全disposition/七page |
| Worker/Unknown/recovery | CROSS-019、RECOVERY全部、REVIEW-006、DISTRIBUTION-006/010、WITHDRAWAL-008 | 原permission/checkpoint/fullreport/probe/no-probe/oldfence/shutdown全部 |
| index/search/taxonomy | CATALOG-003/007/008/009/010、REFERENCE全部、CROSS-004/017 | complete plan/fourkind highwater/currentfilter/as-of/token全部 |
| config/security/Web | CONFIG全部、CROSS-006/008/009/021/022 | 七字段/八slot/四profile、全sink/bundle/locale/UI DTO，不能借prototype |
| runner/check/schema/report/DS | CROSS-010、六checks/四report器及受影响主TC全部 | registry/selection/hash/maturity改变使对应全部EV失效；fresh重生成，不只改MD/index |
| Billing/Archive/event/new类型 | 当前禁止依赖/配置负例CROSS-020/CONFIG-012 | 先受控00/01范围和正式owner；不能用修复或risk接受扩大truth |

上表区间/“全部”仅用于设计检索，未来manifest必须逐完整TC/subcase/inventory identity枚举。最终local或formal-selected送验均需fresh同baseline全98/11suite/全部required；最小局部复验、smoke或补层成功不能替release材料。formal selected另补实际exact positive资格，不能移除失败接缝以缩scope。

### 7.4 首次失败、失效与放行规则

原failed/blocked/unavailable run保留；flaky定位测试/环境根因后newrun，不择最好execution覆盖。实现/设计/SDK/owner/schema/config/profile/DS/seed/harness/generator或scope变更，使受影响旧EV不适用新baseline；旧记录仅作历史追踪/安全隔离，不能跨run拼qualified index。修复审查用newreview并supersedes，不能在旧detail补签或改verdict。

允许授通过必须本scope所有P0成立、五VETO无触发且已实际核查、没有S/P0阻断A/缺证/资格/签署。真实非P0残余关闭→通过；仅合法已接受残余→有条件通过；其余actual送验裁决不通过。可结束不通过审查不等放行。生产发布准备另须formal scope与安全/运维/产品authority及actual部署材料，不由local verdict或设计06完成自动允许。

## 8. 回填草稿

正式§12采用S/A/B、未来管理字段/关闭证据、复验影响与最终全量、首次失败/证据失效、scope放行优先级。无实际defect/run/fix commit/retest/关闭或接受记录。

## 9. 待确认事项

实际测试维护者/复验人/接受authority未指派；MP-UP/SRC/Q不是已受理工单或修复bug。未来修改formal契约先回owning Step，不能从本章补对象/状态或owner签署。

## 10. 进入下一步条件

分级与五VETO一致；fresh复验/全98/首次失败/失效/closed-deferred分开，P0不接受且无真实值；设计自检pass。下一读SOP Step13/规范5.13、03Step18/05Step14全十二项和十技术残余、正式接受七字段与重开；不提交。
