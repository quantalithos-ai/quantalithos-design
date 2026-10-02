# Step 11：缺陷管理与复验规则

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（规则设计）。输入Step6/9/10、00VETO与外部风险；输出S/A/B分级、复验与关闭证据要求。没有创建实际缺陷、修复commit或关闭结果。

Step内计划：红线分级→生命周期/责任→复验影响→证据失效审计；完成。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_10_nonfunctional.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 主控内分单元/表，无需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[Step6](05_test_plan_step_06_cases.md)、[Step9](05_test_plan_step_09_automation_gates.md)、[Step10](05_test_plan_step_10_nonfunctional.md)、[00§14](../00-需求文档.md)、03§17开放项；SOP Step11及规范§5.11。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S阻断？ | 全VETO、scope/secret泄漏、伪approval/evidence、Unknown盲重发、删历史/外部truth写。 |
| 可风险接受？ | S与当前scope未通过P0不能接受；A仅已证实隔离且非P0影响经正式authority后可defer；B可排期。 |
| 回归哪些？ | 最小重现TC+全部受影响CUT/库存+红线/证据工具；跨共享契约最终release全98及所有subcase。 |
| 关闭证据？ | fresh run同一implementation baseline，raw/report/EV配对、原失败留存、scope/qualification与完整复验范围。 |
| 新防回归？ | 漏断言/新边界必须补自动化，保持TC编号历史，schema变更先回03。 |

## 4. 当前文档问题诊断

旧方案泛称“修复后验证”，容易仅重跑happy case或用同run修改报告；外部缺合同属于blocker，不等代码缺陷修好。缺陷关闭不证明Marketplace全项目ready。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 缺陷/外部缺口混同 | 缺陷、环境unavailable、qualification blocker分离 | 不把拒绝正确当缺陷或合同缺口当pass |
| 无复验范围 | TC/CUT/共享库存矩阵 | 防局部修复破坏相邻语义 |

## 6. 测试设计取舍

采用first failure保留+fresh run复验；不采用重跑择优覆盖失败或手工改原report。即使flaky也不得直接降为B；定位是测试工具/环境问题后同scope新run，旧失败与新复验关联而不删去。外部owner签核不由本agent代填。

## 7. 结构化中间产物

### 7.1 分级与处理

| 级别 | 定义/示例 | 处理要求 | 阻断 |
|---|---|---|---|
| S | VETO-MP-1～5；正文/secret泄漏、伪批准/安装/支付/通知/evidence、绕scope/撤回、Unknown双发、篡历史 | 立即停止相关送验，安全隔离受污染材料；根因/自动化反例/全影响复验；不得风险接受 | 必须 |
| A | 主线缺失、state/字段/分页/原result/配置/PG故障、工具无法生成report、错误locale语义 | 修复并按CUT回归；只允许非P0且正式证明隔离的残余延期，仍open/deferred不closed | 当前scope P0必须；其他待正式确认 |
| B | 不影响gate/数据/状态/权限/追溯的纯展示细节 | 明确owner/排期/影响与复验；不能以B掩盖译义或按钮错误授权 | 非P0不单独阻断；接受人待确认 |

测试case预期的`ContractBlocked/CommitUnknown`等负向结果可以通过断言；unexpected environment unavailable、缺positive资格或参数化遗漏仍分别blocker/gap，不凭负例pass转ready。

### 7.2 生命周期与记录字段（测试管理，不是业务对象）

未来缺陷状态为`open → triaged → fix_pending → retest_pending → closed`；复验失败`reopened`，获准延期为`deferred`而非closed。字段：defect_id、severity、state、affected TC/CUT/FR/BR/AC、design refs、baseline refs、failed run/raw/report、minimal repro/DS/seed/subcase、expected/actual safe差异、root cause、fix refs、retest refs、reviewer/authority ref、residual risk。没有实际值；commit/ref缺就留null和blocked，禁止虚造。

外部blocker记录沿MP-UP/SRC/Q ID，确认authority、exact consumer/scope、重开条件，不转换成“修复已完成”的缺陷。未来更改formal schema/state先回03/04，再改TC/DS/脚本；新增TC不得重用既有98编号。

### 7.3 修复→复验矩阵

| 变更/缺陷面 | 最小重现/回归 | 追加范围 |
|---|---|---|
| source/publisher/material | SOURCE-001～006、REFERENCE-001/002，REVIEW-003、CATALOG-005/006 | CUT02/03/08/10，正式source五类mapping全参数 |
| basis/decision/list gate | REVIEW-001～010、CATALOG-004～006 | CUT02/05/08及全部approved/rejected/失效basis反例 |
| DTO/field/ports | CROSS-011/012/014/018 | 全49 codec/43factory/146method及受影响业务TC；禁止只测改字段 |
| state/canonical/replay | CROSS-001/002/005/013、RECOVERY-001/002 | 全222pair/33canonical/16Q/33replay，旧version decoder与original payload |
| PG/frame/CAS/withdraw/late | CROSS-003/015/016/017、DISTRIBUTION-007、WITHDRAWAL-005 | actual PG全部21主TC、两种commit顺序/所有fault点 |
| Worker/Unknown/recovery | CROSS-019、RECOVERY-003～011、REVIEW-006、DISTRIBUTION-006/010、WITHDRAWAL-008 | CUT05/11，原report/checkpoint/oldfence/probe/no-probe矩阵 |
| index/search/page | CATALOG-007～010、REFERENCE-003～006、CROSS-004/017 | 七paged currentfilter/token family、as-of/四kind highwater |
| config/secret/Web | CONFIG-001～012、CROSS-006/008/009/021/022 | 七字段/八slot/四profile，所有sink/locale/state DTO |
| tooling/evidence | CROSS-010、全部6 checks、四report generator | 受影响所有EV重生成于fresh run，原受污染EV标invalid，不能只改index |

范围表示设计检索，不得在实例`tc_refs`写区间；未来manifest须逐TC/subcase列出。任何shared契约/S级/多U变更最终送验要完整11suite/98TC/全部required subcase，不以局部retest替代release。

### 7.4 关闭与证据失效

关闭必须有可重现失败与fix因果、至少原反例+受影响正/负边界、新自动化、fresh同baseline run有效raw/report/EV、复验人员或正式authority确认。权限/secret污染先安全限制访问，归档只有redacted内容；不能删除原失败解释或假称旧证据可用。

implementation/contract/schema/config/profile/fixture/generator版本变更使受影响EV不再适用；保留旧run并标superseded/invalid scope，由新run补证。跨run只能并列历史追踪，不能合成一个qualified EV。A/B风险接受必须有正式acceptance authority及限制范围/期限/回归计划；当前全部未签署。

## 8. 回填草稿

正式§11采用分级、生命周期/字段、复验矩阵和关闭条件。无实际defect列表、修复状态、commit或人工批准。

## 9. 待确认事项

06确认的验收责任人/风险接受authority尚未启动；owner正式资格缺口不允许本项目签核关闭。详细设计影响判定：仅测试管理规则，不增领域状态或设计approval；实际缺陷发现必须按ownership回源。

## 10. 进入下一步条件

S不可降级、A/B限制、复验集合和关闭证据可判定，设计门禁pass。下一读SOP Step12/规范§5.12、Step7/8/9环境数据脚本及本步阻断条件；不提交commit。
