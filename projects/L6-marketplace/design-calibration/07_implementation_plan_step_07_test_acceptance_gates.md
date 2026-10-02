# 07 Step 7：测试与验收门禁嵌入

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step5/6；正式05 §6/9/13与06 §5～14；05 automation/schema及06 98行索引 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 输入/15问题/诊断/取舍 | done | 以下逐问 |
| suite/boundary/成熟度 | done | 11suite真名、15gate及22工具分工 |
| 复杂度 | done | 98逐行归附录，schema不复制 |
| 回填 | done | 正式§7/§6 gate |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

保证每个当前boundary有可生成的原始失败输出与report，最终完整suite/EV/验收不会被早期定向检查代替。

## 本步输入

[Step6](07_implementation_plan_step_06_tasks_boundaries.md)及55经验附录；[05 automation](05_test_plan_step_09_automation_gates.md)§7全部正式入口、[machine schema](05_test_plan_step_13_artifact_schema.md)；[06证据索引](06_acceptance_step_10_evidence_index.md)98 TC/EV及AC/VETO支持。以正式05/06为truth，不按suite字母猜业务名。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 每个阶段应执行哪些测试用例或测试切口。 | 七phase test层来自Step5/6，TC/EV主归属与close见附录；早期只定向layer，不改变主expected。 |
| 2. 哪些阶段必须对齐验收标准 AC 项。 | 全部外部可见、状态/ownership/current scope、分发/撤回/Unknown、audit/evidence均对正式AC-MP及VETO-MP，不能用历史旧编号。 |
| 3. 每个门禁需要产出什么证据。 | 同run rawcase/log、suite/check/run JSON/MD；初期incomplete/minimal-index-shell，最终98EV/detail/index+artifact/seal。 |
| 4. 门禁失败是否允许继续进入下一阶段。 | 不允许当前required门禁失败后跨boundary；unavailable/blocked保持原失败，不skip也不换fake冒positive。 |
| 5. 哪些门禁可以自动化，哪些需要人工审查。 | 格式/check/test/schema/path自动；formalqualification、20AC/5VETO与handoff/risk人或Agent审查（本轮只设计者，不调用代理）。 |
| 6. 哪些验收一票否决项需要在实施阶段提前规避。 | 正式06的VETO-MP-1..5在所有触发路径前置，风险接受不能覆盖；各TC支持边见98行附录。 |
| 7. 每个阶段应调用哪些 `scripts/gates/*.sh`？ | 11suite gate与release脚本逐行真名如下；未完整实现层的阶段用直接tests+bootstrap，不偷造suite别名。 |
| 8. 每个阶段会输出哪些 `artifacts/test/<run_id>/...`？ | artifacts/test/<run_id>/suites/<suite>/cases/<tc_id>/<subcase_id>.json、logs/<execution_id>.jsonl及checks阶段输出。 |
| 9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>`？ | 从01-a即有build_suite_report/build_run_report最小能力，当前raw有失败也finalizer；07-a完善fullEV。 |
| 10. 哪些阶段需要生成或更新 `reports/acceptance/*`？ | 01-a禁止finalEV/draft；07-a才从valid final index+6seal生成<run_id>-draft，07-b审查固定handoff/veto/risk入口。 |
| 11. 哪些报告必须由人或 Agent 审查补充后才能进入验收？ | reports/acceptance/handoff.md、veto-checklist.md、必要risk-acceptance.md及run/index/EV必须审查；草稿非verdict。 |
| 12. 每个 commit boundary 提交前应执行哪些测试、生成哪些 artifact / report、覆盖哪些 AC / VETO 风险。 | 15boundary plannedchecks/TC补层/AC/VETO/artifacts见表和skeleton；targeted层不是primarysuitepass。 |
| 13. 是否存在阶段有门禁但 boundary 无提交前门禁,或 boundary 有测试但没有证据归属。 | 无primaryTC的02-a/05-a有补层；07-b文档-only加真实同run审查；不遗漏raw/reportpair。 |
| 14. 每个 phase / commit boundary 的门禁完成后是否通过停审。 | 每gate定义完成后设计停审；实际执行Gate均pending，需真实run才判。 |
| 15. 所有门禁完成后,测试重复、证据缺失、验收覆盖缺口和 report 审查责任是否通过审计。 | Step13只读核验98双射/11suite/全部support与完整scope；实际生成审查责任留07-a/07-b，不虚造。 |

## 当前文档问题诊断

旧稿D误当distribution、B误当transaction、C误当API，实际分别contract-domain-fast/web-protocol-workflow/config-redline；使用旧AC/VETO编号、泛称UNIT/API等作正式suite，以及early raw依赖future report。修正正式别名及工具前置，不修改98 TC/EV。

## 改动前后对比

| 项 | 前 | 后 / 理由 |
|---|---|---|
| suites | 字母猜业务/旧ID | 05唯一正式11suite/06 AC-MP/VETO-MP |
| primary vs补层 | phase一有tests就声称EV | 明确owner/完整层close/07-a final |
| raw/report | 07-a后才有 | 01-a bootstrap，01-b起每batch失败也报告 |
| 输出 | 泛summary/gate-results无schema来源 | 严格05定义suite/check/run/EV/index及immutable draft |

## 设计取舍

保留唯一98主TC/EV及11suite，不新增phase专用suite、不缩required inventory，不给fake/blocked positive发资格；工具早期最小壳与最终合格实例分开。完整主suite是全部expected subcase+requiredchecks，不是主TC数凑齐。

## 结构化中间产物

### 11 suite 的唯一名称、脚本与完整层最早归属

| 别名 | 正式suite | TC数 | planned gate | 完整执行层最早boundary | 覆盖 / 不能替代 |
|---|---|---|---|---|---|
| D | contract-domain-fast | 6 | scripts/gates/run_contract_domain_fast.sh | commit-01-a | typed contract/codec/domain；实际满足全部required才可suite通过 |
| S | service-flow-fast | 22 | scripts/gates/run_service_flow_fast.sh | commit-04-b | 来源/发布审核与撤回业务flow；实际满足全部required才可suite通过 |
| I | infra-runtime-fake | 5 | scripts/gates/run_infra_runtime_fake.sh | commit-06-c | 同typedport/runtime/owner负例；实际满足全部required才可suite通过 |
| P | postgres-atomicity | 21 | scripts/gates/run_postgres_atomicity.sh | commit-03-b | 真实PG/CAS/as-of/目录与引用projection；实际满足全部required才可suite通过 |
| W | entry-worker-job | 14 | scripts/gates/run_entry_worker_job.sh | commit-06-b | API/12Job/distribution/fence；实际满足全部required才可suite通过 |
| B | web-protocol-workflow | 2 | scripts/gates/run_web_protocol_workflow.sh | commit-06-b | Web/browser/locale/workflow；实际满足全部required才可suite通过 |
| C | config-redline | 14 | scripts/gates/run_config_redline.sh | commit-06-c | loader/profile/七字段/八slot；实际满足全部required才可suite通过 |
| X | redaction-boundary | 1 | scripts/gates/run_redaction_boundary.sh | commit-07-a | 全部sink/raw/report/SDK脱敏；实际满足全部required才可suite通过 |
| R | recovery-replay | 11 | scripts/gates/run_recovery_replay.sh | commit-06-b | 恢复/原报告/replay/worker故障；实际满足全部required才可suite通过 |
| E | report-generation-audit | 1 | scripts/gates/run_report_generation_audit.sh | commit-07-a | schema/path/digest/生成工具；实际满足全部required才可suite通过 |
| M | release-main-smoke | 1 | scripts/gates/run_release_main_smoke.sh | commit-07-a | 受控全链smoke不替其他suite；实际满足全部required才可suite通过 |

计数D6/S22/I5/P21/W14/B2/C14/X1/R11/E1/M1=98，全部P0。最早是排程分析，不是任何通过事实；若该层仍含future/export/provider缺口则继续blocked。P21在03-b用受控已提交typed fixtures覆盖其他族plan，不把fixtures当实际04/05业务。Formal selected需单独exact资格，local主suite通过不证明ownerpositive。

### Phase test/AC/VETO计划

| Phase | G-P | 测试切片 | AC/VETO引用 | 脚本/材料与成熟度 | 失败处理 |
|---|---|---|---|---|---|
| PH-01 | G-P1 | D纯定义、C loader、工具CLI负例 | AC-MP-G01/G02/G04；VETO-MP-1/5 | D/C定向+bootstrap raw/report/index壳；C完整层至06-c | 修当前；主suite未完整不pass |
| PH-02 | G-P2 | P/I/R公共runner/PG补层 | AC-MP-G02/G03；VETO-MP-4/5 | 真实PG与key/result raw/report；未实现族not_run | PG不可用阻断，不fake替 |
| PH-03 | G-P3 | S来源/审核消费、P目录/U7 | AC-MP-101/102/103/201/202/203/301/302/303；VETO-MP-1/2/3 | 主TC与全部PGplan层；derived不能authority；early incomplete | 缺positive保留blocked |
| PH-04 | G-P4 | W分发补层、S撤回、P竞态 | AC-MP-401/402/403/501/502；VETO-MP-3/4/5 | W完整entry层等06-b，业务补层raw/report | Unknown不盲重试/不记installed |
| PH-05 | G-P5 | R恢复补层、审计Query/33replay、X防递归 | AC-MP-302/503/504/G02/G03；VETO-MP-1/4/5 | 原typed完整报告、checkpoint raw；R全层等06-b | 无原report/Obs资格等待 |
| PH-06 | G-P6 | W14/B2/R11/C14/I5及X全sink补层 | 98行各AC支持；VETO-MP-1/2/3/4/5 | 37route/12Job/browser/slot raw/report；无资格nonpositive | entry/dto失败阻断 |
| PH-07 | G-P7 | 全11suite/98TC及allrequired库存，E/M | 全20AC/5VETO按正式06三值 | run_release_gate.sh；六artifact checks→EV→六seal→draft→review | 任一缺失非pass/不handoff |

### 15 boundary 提交前直接检查与提交后证据归属

| Boundary | required直接检查 / 主TC与补层 | AC/VETO来源 | Artifact/report / 本次门禁上限 | 失败姿态 |
|---|---|---|---|---|
| commit-01-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；fixture codec/domain；工具参数/路径/失败 finalizer；TC-CROSS-001, TC-CROSS-002, TC-CROSS-011, TC-CROSS-012, TC-CROSS-013, TC-CROSS-020 | AC-MP-103, AC-MP-403, AC-MP-G02, AC-MP-G01, AC-MP-G04, AC-MP-101, AC-MP-102, AC-MP-502, VETO-MP-5, AC-MP-G03, VETO-MP-4 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；真实仓/环境未满足waiting |
| commit-01-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；strict parser/profile/redaction；七字段映射；TC-CONFIG-001, TC-CONFIG-002, TC-CONFIG-003, TC-CONFIG-004, TC-CONFIG-005, TC-CONFIG-006, TC-CONFIG-007, TC-CONFIG-008, TC-CONFIG-009, TC-CONFIG-010, TC-CONFIG-011, TC-CONFIG-012, TC-CROSS-009, TC-CROSS-022 | AC-MP-G01, AC-MP-G03, AC-MP-503, AC-MP-G04, VETO-MP-1, AC-MP-101, AC-MP-202, AC-MP-402, VETO-MP-4, AC-MP-G02 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；真实仓/环境未满足waiting |
| commit-02-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；reserve/replay/完整 result、rollback、channel/digest 与 fake parity；TC-CROSS-003, TC-CROSS-015, TC-CROSS-016, TC-RECOVERY-001, TC-RECOVERY-011 | 补层TC按附录支持；VETO-MP-1/2/3/4/5全局保护 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；真实仓/环境未满足waiting |
| commit-02-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；实际 PG 帧锁/CAS/rollback/固定 upper/compound cursor；TC-CROSS-003, TC-CROSS-015, TC-CROSS-016 | AC-MP-G02, AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G03, VETO-MP-5, AC-MP-201, AC-MP-203, AC-MP-403, AC-MP-501 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；真实仓/环境未满足waiting |
| commit-03-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；publisher/source/material/full basis；MatchedDecision 可为 rejected；current Listed gate；TC-SOURCE-001, TC-SOURCE-002, TC-SOURCE-003, TC-SOURCE-006, TC-REVIEW-001, TC-REVIEW-002, TC-REVIEW-003, TC-REVIEW-004, TC-REVIEW-005, TC-REVIEW-007, TC-REVIEW-009, TC-REVIEW-010, TC-CATALOG-001, TC-CATALOG-002, TC-CATALOG-003, TC-CATALOG-004, TC-CATALOG-005, TC-CATALOG-006 | AC-MP-101, AC-MP-103, AC-MP-G02, AC-MP-203, AC-MP-102, AC-MP-G01, VETO-MP-1, AC-MP-303, AC-MP-201, VETO-MP-2, AC-MP-202, AC-MP-501, AC-MP-503, AC-MP-301, AC-MP-502 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-SRC-010,MP-SRC-013 保留blocked |
| commit-03-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；search/current disclosure/PageReadContext；完整 shadow manifest/body/state 原子替换；TC-CATALOG-007, TC-CATALOG-008, TC-CATALOG-009, TC-CATALOG-010, TC-REFERENCE-001, TC-REFERENCE-002, TC-REFERENCE-003, TC-REFERENCE-004, TC-REFERENCE-005, TC-REFERENCE-006, TC-CROSS-004, TC-CROSS-017 | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-G03, VETO-MP-3, AC-MP-G01, AC-MP-102, AC-MP-103, AC-MP-504, AC-MP-G02, AC-MP-402, AC-MP-403, AC-MP-502, AC-MP-503 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-001,MP-UP-003 保留blocked |
| commit-04-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome；TC-DISTRIBUTION-001, TC-DISTRIBUTION-002, TC-DISTRIBUTION-003, TC-DISTRIBUTION-004, TC-DISTRIBUTION-005, TC-DISTRIBUTION-006, TC-DISTRIBUTION-007, TC-DISTRIBUTION-008, TC-DISTRIBUTION-009, TC-DISTRIBUTION-010 | AC-MP-401, VETO-MP-3, AC-MP-403, AC-MP-G02, AC-MP-402, VETO-MP-4, AC-MP-203, AC-MP-504, AC-MP-501, AC-MP-502 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005 保留blocked |
| commit-04-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；no-new shared lock、known upper/late cursor 回 Partial、NoticeIntent 结果绑定；TC-WITHDRAWAL-001, TC-WITHDRAWAL-002, TC-WITHDRAWAL-003, TC-WITHDRAWAL-004, TC-WITHDRAWAL-005, TC-WITHDRAWAL-006, TC-WITHDRAWAL-007, TC-WITHDRAWAL-008, TC-WITHDRAWAL-009, TC-WITHDRAWAL-010 | AC-MP-501, AC-MP-502, AC-MP-201, AC-MP-203, VETO-MP-5, AC-MP-G01, AC-MP-G03, AC-MP-403, AC-MP-G02, AC-MP-504, AC-MP-302, AC-MP-503 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-003,MP-UP-005,MP-UP-007 保留blocked |
| commit-05-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；16 Query/33 replay 总审查；原完整 payload、分页及脱敏；TC-RECOVERY-007, TC-RECOVERY-008, TC-RECOVERY-009, TC-CROSS-005 | 补层TC按附录支持；VETO-MP-1/2/3/4/5全局保护 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-003 保留blocked |
| commit-05-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；typed recovery plan、checkpoint/lease/fence、原报告、producer 防递归；TC-RECOVERY-001, TC-RECOVERY-002, TC-RECOVERY-003, TC-RECOVERY-004, TC-RECOVERY-005, TC-RECOVERY-006, TC-RECOVERY-007, TC-RECOVERY-008, TC-RECOVERY-009, TC-RECOVERY-010, TC-RECOVERY-011 | AC-MP-103, AC-MP-302, AC-MP-403, AC-MP-504, AC-MP-G02, AC-MP-101, AC-MP-G01, AC-MP-203, VETO-MP-5, AC-MP-501, AC-MP-502, AC-MP-503, AC-MP-G03 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-003,MP-UP-005,MP-UP-007,MP-UP-008 保留blocked |
| commit-06-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；trusted context/channel/page、HTTP status/Query degraded、37route/0Jobroute；TC-CROSS-005, TC-CROSS-007, TC-CROSS-018 | AC-MP-302, AC-MP-504, AC-MP-G02, AC-MP-101, AC-MP-202, AC-MP-401, AC-MP-G01, VETO-MP-3 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-003 保留blocked |
| commit-06-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；12 jobs/完整 report、A/B/shutdown；Web 全状态/EN-ZH、不重发意图；TC-CROSS-008, TC-CROSS-019, TC-CROSS-021 | AC-MP-G04, AC-MP-403, AC-MP-502, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5, VETO-MP-4 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-003 保留blocked |
| commit-06-c | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；exact owner/type/operation/version/scope；safe unavailable、Unknown/probe 与 redaction；TC-SOURCE-004, TC-SOURCE-005, TC-REVIEW-006, TC-REVIEW-008, TC-CROSS-006, TC-CROSS-014 | AC-MP-102, AC-MP-103, VETO-MP-1, AC-MP-101, AC-MP-202, AC-MP-401, AC-MP-G01, AC-MP-201, AC-MP-203, AC-MP-403, AC-MP-503, AC-MP-504, VETO-MP-2, AC-MP-G02, AC-MP-G03, AC-MP-G04 | 提交前非合格诊断；提交后同run定向raw/suite/run，partial不形成valid final EV | 当前required失败阻断；selected MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005,MP-UP-007,MP-UP-008,MP-SRC-010 保留blocked |
| commit-07-a | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；22 CLI/exit/failed finalizer、98+库存与55项经验审计；提交前验证工具能力，提交后固定源码生成final EV/draft；TC-CROSS-010, TC-CROSS-023 | AC-MP-503, AC-MP-504, AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-1, VETO-MP-5, AC-MP-101, AC-MP-102, AC-MP-103, AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-401, AC-MP-402, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-G04 | 提交前fulltool直接测试/非合格诊断；提交后newrun fullraw/report/98EV/index/6seal/draft，未执行 | 当前required失败阻断；selected MP-UP-008 保留blocked |
| commit-07-b | fmt/check/clippy或Web typecheck/lint/scripts shellcheck按栈；design/Scope/Worktree/Commit/Handoff复核；真实 reviewer/新 review，不造结果；全98TC及required subcase（复核07-a同run输出，变更后新run） | 补层TC按附录支持；VETO-MP-1/2/3/4/5全局保护 | 复核07-a同run最终报告+reports/review及固定handoff；文档-only静态 | 当前required失败阻断；selected MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005,MP-UP-007,MP-UP-008,Q-MP-01 保留blocked |

scope/batch成功只证明当前增量。02-a补层沿既有TC来源，05-a校16Q/33replay零写且完整原payload/current，不另造EV；07-b如果改实现/config/scripts要回对应边界并new run。附录完整98行明确owner与close，避免给同TC发两主EV。

### 22工具的前置与最终成熟度

| 能力 / Planned路径 | 最早boundary | 最终boundary | 当前允许输出 / 禁止 |
|---|---|---|---|
| scripts/gates/run_contract_domain_fast.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_service_flow_fast.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_infra_runtime_fake.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_postgres_atomicity.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_entry_worker_job.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_web_protocol_workflow.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_config_redline.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_redaction_boundary.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_recovery_replay.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_report_generation_audit.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_release_main_smoke.sh | 01-a锁参数/path/非0与bootstrap调用契约；被测case随其boundary | 07-a | 未实现expected=not_run，未完整不得返回主suite0；不改正式expected集合 |
| scripts/gates/run_release_gate.sh | 01-a参数/所有失败finalizer契约 | 07-a | full11串行汇总，不auto部署/签核；early禁止release通过 |
| scripts/checks/check_dependency_boundary.sh | 01-a | 07-a | 实际targetrepo/export检查，不检查虚造仓 |
| scripts/checks/check_config_redline.sh | 01-a接口、01-bloader负例 | 07-a | ref/profile及slot，不自证资格 |
| scripts/checks/check_redaction.sh | 01-a | 07-a | raw/report安全扫描，不归档secret |
| scripts/checks/check_no_static_evidence.sh | 01-a | 07-a | latest/static/cross-run/no-raw拒绝 |
| scripts/checks/check_schema_integrity.sh | 01-a | 07-a | strict schema/DAG/path/digest；缺实际源码不得合格EV |
| scripts/checks/check_coverage.sh | 01-a | 07-a | early披露incomplete；release全闭包，不能缩expected |
| scripts/reports/build_suite_report.sh | 01-a | 07-a | 无论失败都从actual raw作JSON/MD，缺执行not_run |
| scripts/reports/build_run_report.sh | 01-a | 07-a | 聚合同run；raw失败不能report成功覆盖 |
| scripts/reports/build_evidence_index.sh | 01-a minimal-index-shell能力 | 07-a final-ev-details | early只空/不完整shell与gap，不用不存在detail_ref填合格entry |
| scripts/reports/build_acceptance_draft.sh | 01-a只锁输入/拒绝未成熟 | 07-a actual valid输入才生成 | early禁止输出验收draft/结论；07-b再审查 |

各gate必须支持`--run-id --artifact-root --config-profile --registry-ref --subcase-manifest-ref`；release另`--report-root`。check/reports exact参数采用05 Step9 §7.3，六check全支持`--stage artifact|seal`。此表不新增参数，也不创建工具文件。

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

### Artifact / report / evidence成熟度

| 层 | 固定路径与生成者 | 必要检查 / 证明上限 |
|---|---|---|
| rawcase/log | artifacts/test/<run_id>/suites/<suite>/cases/<tc_id>/<subcase_id>.json；logs/<execution_id>.jsonl | actual assertions/context/seed/设计来源；失败/unavailable/blocked/not_run照实，不归档raw秘密 |
| suite report | artifacts下suite report；reports/runs/<run_id>/suites/<suite>.json与.md | JSON机器truth，MD投影；build_suite_report，无两套手写状态 |
| run report | artifacts下run report；reports/runs/<run_id>/summary.json与.md | build_run_report汇聚全部expected；失败保留，按05schema |
| 六artifact checks | artifacts/test/<run_id>/checks/artifact-<check_id>.json；reports/runs/<run_id>/checks/artifact-<check_id>.md | 完整性/coverage/路径/脱敏，不引用自身 |
| minimal-index-shell | artifacts/test/<run_id>/evidence-index.json；reports/runs/<run_id>/evidence-index.md | maturity=minimal-index-shell/completeness=incomplete；只路径可解析，无合格EV/验收退出 |
| final EV/detail/index | artifacts/test/<run_id>/evidence/EV-*.json与evidence-index.json；reports/runs/<run_id>/evidence/EV-*.md及index | same-run/allrequired case+suite+六artifact checks，98双射/full库存；非静态填pass |
| 六seal checks | checks/seal-<check_id>.json及同名.md | 核finalEV/index/run/MD，不self-ref，不让index回指seal构成摘要环 |
| draft / review | reports/acceptance/<run_id>-draft.json及.md→reports/review/→handoff.md/veto-checklist.md/必要risk-acceptance.md | build_acceptance_draft只valid finalindex+6seal；reviewer_tag未有为null；固定入口回指同run，人工裁决不伪填 |

`run_id`由未来harness明确传入且不空；execution/subcase唯一，既有completed run不能覆盖，重跑使用新run、新execution。不使用latest、项目重复根、路径逃逸或越权输出根。自定义隔离root按05 realpath映射正式逻辑路径；本轮无任何run实例。

### 失败、停止与跨门禁审计

gate exit沿05：0=本scope全部expected及checks通过；1=被测失败；2=infraunavailable；3=qualification/preconditionblocked；4=输入/schema/integrity/redaction/report工具失败。空suite、缺subcase、not_run不0。工具finalizer要保留原exit，report成功不改变test。VETO不可风险接受，Unknown/ACK/scan/signature/receipt不success，fail/blocked/unavailable不能skip。

所有phase及boundary已有direct checks、材料writer/reader、AC/VETO来源与单run链。设计停审已逐行规划，运行门禁无结果；Step13再实核集合/路径/成熟度一致。每个boundary先Build/Test再Evidence/Commit，07-b只审查实际结果而不制造。

## 回填草稿

正式§7按11真名、phase/15boundary与成熟度收口；98逐行表作为引用，不复制测试case或machine schema。

## 待确认事项

所有实际脚本/目标repo/环境/qualification/reviewer仍待实施授权与真实执行；在最早被测layer前确认，不能到07-a才发现没有原始输出工具。

## 进入下一步条件

Step13已实际核对库存/links/源码固定/成熟度，本Step设计条件满足；实际suite/EV/acceptance未执行。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
