# commit-04-a implementation ledger

> PH-04 · 草稿、发送、结果与unknown探测；2026-10-02。仅正式07的planned boundary skeleton，无代码、实际gate结果、run/EV、验收/签署、commit或readiness。
> 未来status=planned / next_allowed_action=wait_until_current；必须等待项目级台账推进到本项。 全部实际gate blocked，evidence/actual字段waiting；当前不授开工或提交权。

## Boundary Header

| field | value |
|---|---|
| project | L5-chat |
| boundary_id | commit-04-a |
| phase | PH-04 |
| design_baseline | waiting |
| design_source_bytes | 项目实施台账Design Source Fingerprints；不是批准commit |
| implementation_repo | /home/aris/Projects/quantalithos-chat（planned，当前不存在） |
| status | planned |
| is_current | false |
| gate_status | blocked |
| next_allowed_action | wait_until_current |
| predecessor | commit-03-b |
| planned_next_boundary | commit-04-b |
| last_updated_at | 2026-10-02 |
| actual_implementation | waiting / not_started |

## Required Reads

| document | required_section | status | notes |
|---|---|---|---|
| [项目实施台账](../implementation_execution_ledger.md) | Current Implementation State / Boundary Ledger / Open Blockers | waiting | 唯一current与approvedbaseline；未来未激活不能开工 |
| [正式07](../../07-实施计划.md) | §3.1/3.2、§6.6本项、§7/9～12 | waiting | source=03 §5.4/7.3/7.4.6～7/8.3/9.6/12；05 §6；06 §7/8/11；07 §6.6；本phase=发送与治理意图结果闭环 |
| [正式00](../../00-需求文档.md)、[01](../../01-架构设计.md)、[02](../../02-概要设计.md) | 当前范围/owner/入口与平台边界 | waiting | 36actualAC，BASE001未关；不用历史README推truth |
| [正式03](../../03-详细设计.md)、[04](../../04-配置设计.md)、[05](../../05-测试方案.md)、[06](../../06-验收标准.md) | 03 §5.4/7.3/7.4.6～7/8.3/9.6/12；05 §6；06 §7/8/11 | waiting | 对应字段/DTO/构造/ports/协议/状态/config/TC/gate；缺口wait_design |
| [07 Step6](../07_implementation_plan_step_06_tasks_commit_boundaries.md) | §6.6本项exact scope与批次；本项55经验表 | waiting | 55项逐项分类，不把closed_design_only当实际gate pass |
| [07 Step7](../07_implementation_plan_step_07_test_acceptance_gates.md) | §7.1～7.5与本项TC/suite/EV/gate | waiting | primary只首次切口；完整TC参数/real层不缩分母 |
| [07 Step12](../07_implementation_plan_step_12_completion_criteria.md) | §12.3本项03/05/06/07移交审计 | waiting | reviewed_design_with_blockers不是实际Design Gate pass |
| [07 Step13](../07_implementation_plan_step_13_formal_document_assembly.md) | 十类跨文档审计、冲突修正与静态停审记录 | waiting | 读取来源/更新触发/当前blocker，实际未开始 |
| [03_ddd_step_08_protocol_contracts.md](../03_ddd_step_08_protocol_contracts.md) | 正式07 §3.2本phase限定范围 | waiting | 不复制schema全文；校准解释不得覆盖正式契约 |
| [03_ddd_step_09_function_flows.md](../03_ddd_step_09_function_flows.md) | 正式07 §3.2本phase限定范围 | waiting | 不复制schema全文；校准解释不得覆盖正式契约 |
| [03_ddd_step_10_state_matrix.md](../03_ddd_step_10_state_matrix.md) | 正式07 §3.2本phase限定范围 | waiting | 不复制schema全文；校准解释不得覆盖正式契约 |
| [实施台账规范](../../../../standards/document/代码实施台账与门禁规范.md)、[真相源标准](../../../../standards/document/设计真相源闭环与可落码性标准.md) | §3～9/恢复；§7/9.1/9.2 | waiting | 全部planned骨架/七gate+Worktree/55经验与复核 |
| [TS规范](../../../../standards/coding/typescript.md)、[JS规范](../../../../standards/coding/javascript.md)、[HTML规范](../../../../standards/coding/html.md) | 当前语言/实际文件 | waiting | strict/命名/结构/typed fixture与English代码注释；按语言适用 |
| [目录规范](../../../../standards/document/子项目目录与代码文件组织规范.md)、[项目提交规范](../../../README.md) | 对应目录；§8.2 | waiting | actualcommit前exactscope/message/body/footer核对，当前未授权 |

未来实施者必须记录当时实际读取的版本/章节；本设计agent的来源阅读不代替未来执行者Required Reads。规范/正式/校准冲突立即wait_design，不自行增schema或改owner。专项owner正向能力只消费当前正式SDK，按当前操作补读其正式00～07与必要台账；兄弟Bridges未停审不作输入。

## Allowed Scope

一句话增量：草稿、发送、结果与unknown探测。子功能分组：同revision草稿 + reserveDispatch CAS + 正式result gate + unknown-only probe + feedback。

内容授权：conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked。

以下都是planned实现仓根相对exact文件；列入文件不等于整文件/后序内容可改，不能新增common/utils或目录通配授权。

| type | path_or_rule | status | content_limit |
|---|---|---|---|
| allowed_file | `src/intents/user_intent_coordinator.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/intents/draft_coordinator.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/intents/command_result_gate.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/intents/command_attempt_state.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/intents/intent_feedback_view_model.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/intents/message_composer.tsx` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/intents/intent_feedback.tsx` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/local_state/draft_store.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/local_state/client_state_store.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/app/application_composition.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `src/sdk/sdk_command_adapter.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `tests/intent_result_tests.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `tests/fixtures/context_builder.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `tests/fixtures/state_matrix_rows.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |
| allowed_file | `tests/fixtures/deferred_port_scheduler.ts` | planned | conversation/draft/intent capability/probe/result消费/ResolveUnknown；command adapter blocked consumer port，无真实SDKpreparekey；futureGovernance branch明示blocked |

ApplicationComposition的canonical create/dispose仅commit-06-c激活；此前通过explicit injected typed ports与独立页面harness验证当前行为。SDK正向实际绑定仅PH07；native实际装配PH08；fixture不能授业务或平台权限。运行输出仅按正式07 §4/7批准位置与maturity生成，不能stage或伪造artifact/report/EV。

## Forbidden Scope

| rule | status |
|---|---|
| 离线业务queue、自动retry、Gov positive binding、SDK digest/幂等truth实现 | planned |
| 任何未列exact path或超出本项内容/TC variant的后序实现，其他项目/SDK/owner正式文档与源码 | planned |
| Conversation/Turn/Participant/Project/Member/Gate/Decision/Artifact/Workspace/Runtime/Process/目录truth，owner UoW/outbox/内部bus与Bridges外部映射 | planned |
| 点击/ACK/本地id/颜色/WorkItem完成推业务提交、审批成功、sourcecoverage或并行join；rawbody/ref反解/credential归档 | planned |
| 未批准版本/库/平台/权限/retention/ACL、原型或typedfixture冒formal SDK/native/manualAT、虚构commit/run/EV/acceptance/signoff/readiness | planned |

## Planned Batches

| batch | ordered_goal | estimated_size | planned_check | status |
|---|---|---|---|---|
| BATCH-04-a-1 | 实现Draft edit/validate/revision与精确清稿，保留unknown稿 | 100～250行；含测试超300拆100～200行子批，超500必拆 | fmt/lint/typecheck与当前targeted测试；native另分域Rustcheck | planned |
| BATCH-04-a-2 | 独立实现prepareassociation/reserveDispatch CAS与single effect竞态 | 100～250行；含测试超300拆100～200行子批，超500必拆 | 高风险guard/迁移/竞态/schema/digest独立断言；native另分域Rustcheck | planned |
| BATCH-04-a-3 | 独立实现formal authority/result、普通ACK拒绝、unknownprobe/显式retry资格 | 100～250行；含测试超300拆100～200行子批，超500必拆 | fmt/lint/typecheck与当前targeted测试；native另分域Rustcheck | planned |

载体/资格→高风险状态/并发/幂等/清理/错误→编排/呈现/当前测试依次实现；每组仍按高风险子功能拆批，禁止一次patch混合全部。以上行数是未来实现规模；本轮无实现批次结果。全部组及各子批实检后才能跑当前boundary实际门禁，targeted不授完整PR/EV通过。

## Required Checks

| check | planned_requirement | status | actual_result |
|---|---|---|---|
| source / scope / config / schema / build | npm run lint / typecheck / build（package commands由01-a建立）；scope测试实际Vitest/Playwright；脚本支持TS检查；没有host变更不声称nativebuild；当前exact TC/variant按05执行或记录blocked；source/config/schema/digest/redaction和scope diff；未执行一律pending | waiting | waiting |
| TC首次责任 | `TC-CONC-001`, `TC-CONC-002`, `TC-CONC-003`, `TC-CONC-004`, `TC-CONC-005`, `TC-PROTO-001`, `TC-PROTO-002`, `TC-PROTO-005`, `TC-PROTO-006`, `TC-PROTO-019`, `TC-PROTO-020`, `TC-PROTO-021`, `TC-PROTO-022`, `TC-PROTO-027`, `TC-PROTO-028`, `TC-PROTO-051`, `TC-PROTO-052`, `TC-PROTO-071`, `TC-PROTO-072`, `TC-SAFE-003`, `TC-STATE-031`, `TC-STATE-032`, `TC-STATE-033`, `TC-STATE-034`, `TC-STATE-035`, `TC-STATE-036` | waiting | waiting |
| 协议 / 状态首次责任 | SubmitConversationIntent, RequestSafePreview, LoadIntentCapability, ProbeCommandAttempt, LoadDraft, ConsumeCommandReceiptOrResult, ResolveUnknownAttempt；DraftState, CommandAttemptState | waiting | waiting |
| suite / EV计划身份 | intent, presentation, persistence；EV-UNIT-001, EV-UI-001, EV-UNIT-004；当前cut不补未实现variant | waiting | waiting |
| 06关联gate / VETO | GATE-CHAT-F-001, GATE-CHAT-F-003, GATE-CHAT-F-005, GATE-CHAT-F-006, GATE-CHAT-CORE-001, GATE-CHAT-CORE-003, GATE-CHAT-CORE-004, GATE-CHAT-R-001, GATE-CHAT-R-003, GATE-CHAT-R-006, GATE-CHAT-R-008, GATE-CHAT-P-001, GATE-CHAT-P-003, GATE-CHAT-P-010, GATE-CHAT-P-011, GATE-CHAT-P-014, GATE-CHAT-P-026, GATE-CHAT-P-036, GATE-CHAT-S-011, GATE-CHAT-S-012, GATE-CHAT-TX-001, GATE-CHAT-CONC-001, GATE-CHAT-CONC-002, GATE-CHAT-CONC-003, GATE-CHAT-CONC-004, GATE-CHAT-CONC-005, GATE-CHAT-NFR-001, GATE-CHAT-NFR-004, GATE-CHAT-NFR-005, GATE-CHAT-E-001, GATE-CHAT-E-002, GATE-CHAT-E-005, VETO-CHAT-002, VETO-CHAT-003, VETO-CHAT-009；parent=AC-FR-CHAT-001, AC-FR-CHAT-003, AC-FR-CHAT-005, AC-FR-CHAT-006, AC-CHAT-001, AC-CHAT-003, AC-CHAT-004, AC-BR-CHAT-001, AC-BR-CHAT-003, AC-DR-CHAT-001, AC-DR-CHAT-003, AC-CHAT-002, AC-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-001, AC-NFR-CHAT-004；只在对应真实证据充分时实际裁决 | waiting | waiting |
| 55经验及phase审计 | Step6本boundary全部55项和Step12/13重审；无新通用经验时只沿用，发现新的先登记proposal/申请scope并暂停 | waiting | waiting |
| 完整分母 / real层 | 216TC/16suiteEV；09-a最终全参数；09-b完整EV；10-a验收新manifest/newrun/EV-REPORT；缺SDK/native/manualAT仍blocked | waiting | waiting |

### 固定CLI与证据边界

以下是未来获授权时的05唯一定义CLI；不是本轮执行记录。不支持或后序case缺失必须blocked，禁止为早期targeted建立冒称完整PR的旁路CLI。支持当前incremental本地检查，但不等完整05 suite/PR/release通过。

`scripts/gates/run_ci_gate.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile desktop-ci`

`scripts/checks/check_redaction.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>`

`scripts/reports/generate_reports.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>`

再执行同一check_redaction CLI检查候选/最终可读报告。顺序machine→初次redaction→candidate reports→final redaction；safe materialization、JCS self_digest/actual bytes digest、same-run/FileRef/DAG、proof_scope/quality/预算与未跑项按05/06原schema。

maturity上限：index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail。本项无actualrun/EV，index_shell不补EVdetail，full_ev要全部实际层，acceptance_handoff writer不能代actualreview/E018/签署或填readiness。

## Gate Matrix

| gate | status | planned_requirement | evidence | next_if_failed |
|---|---|---|---|---|
| activation_gate | blocked | 等待项目实施台账推进到本boundary；前项actualHandoff与新current记录 | waiting | wait_design |
| design_gate | blocked | 批准含00～07不可变baseline、Required Reads、55经验/字段/DTO/状态/证据/phase复核；CHAT-UP-001/002，正式association/result/probe窗口未确认 | waiting | wait_design |
| scope_gate | blocked | Allowed Scope exact文件及本项内容，未列路径/后序行为不许；shared test仅当前TC/variant及已实现受影响回归 | waiting | fix_gate_failure |
| worktree_gate | blocked | 真实status/diff确认用户既有改动；只stage本boundary，保留用户diff，禁止全仓add/reset/amend他人 | waiting | fix_gate_failure |
| build_gate | blocked | npm run lint / typecheck / build（package commands由01-a建立）；scope测试实际Vitest/Playwright；脚本支持TS检查；没有host变更不声称nativebuild | waiting | fix_gate_failure |
| test_gate | blocked | 既有TC/variant=TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-PROTO-001, TC-PROTO-002, TC-PROTO-005, TC-PROTO-006, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-027, TC-PROTO-028, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-SAFE-003, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036；intent, presentation, persistence；缺未来variant/real层完整gate blocked | waiting | fix_gate_failure |
| evidence_gate | blocked | maturity上限=index_shell；targeted当前scope；selftest为isolated_fixture；完整05CLI缺后序case时blocked且非PRpass；index不補EVdetail；实际targeted≠fullPR/EV；05/06schema/digest/redaction/层级与同run | waiting | fix_gate_failure |
| commit_gate | blocked | 已有commit授权、当前前序实际gates满足、staged exact diff/check/English subject+body+footer；无真实结果不能提交 | waiting | fix_gate_failure |
| handoff_gate | blocked | 实际commit后真实hash/checks/未跑项/残余blocker；只按项目台账激活commit-04-b；发布另需授权 | waiting | handoff |

## Worktree Gate

| field | value |
|---|---|
| status | blocked |
| implementation_worktree_observed | waiting |
| existing_user_changes | waiting |
| staged_scope_checked | waiting |
| staged_whitespace_checked | waiting |
| evidence | waiting |

未来actualstatus/diff与stageddiff都只检查当前scope；保护用户既有改动，缺设计/授权不通过此表。此处没有实现仓status或stagedscan结果。

## Commit Record

| field | value |
|---|---|
| planned_commit_message | feat(chat-intents): enforce single dispatch and formal result authority |
| planned_body_group | Single dispatch and formal outcomes；exactbasename/actual增删行/目的/真实检查及成熟度按正式07 §11 |
| staged_files_checked | waiting |
| commit_message_checked | waiting |
| committed_hash | waiting |
| committed_message | waiting |
| post_commit_status | waiting |

提交标题/body是planned模板；不得把waiting填随机hash、把观察设计HEAD当实施commit。提交前已有用户授权与实际门禁、正确英文body/footer、stagedscope/diff --check必须成立；本轮未提交。

## Blockers

| blocker_id | gate | status | reason | next_allowed_action |
|---|---|---|---|---|
| BLK-CHAT-BASELINE | activation_gate / design_gate | blocked | 正式07设计停审不替代批准基线；approved含00～07 designcommit与实施授权waiting，目标仓不存在 | wait_design |
| BLK-commit-04-a-SOURCE | design_gate | blocked | CHAT-UP-001/002，正式association/result/probe窗口未确认；按正式07 §9.2原owner/ID解除，Chat不私补 | wait_design |
| BLK-commit-04-a-PREDECESSOR | activation_gate | blocked | commit-03-bactualHandoff与项目current推进尚未发生；future仅wait_until_current | wait_design |

## Handoff Plan

| planned_item | planned_requirement | status | actual_record |
|---|---|---|---|
| 回退/暂停 | 停当前adapter/affordance至明确blocked/unavailable；保留unknown与失败材料；保护用户diff，不逆写owner结果或自动revert | planned | waiting |
| 本项移交 | 实际commit后回填真实hash/checks/not_run/blocker及批准baseline；无真实结果保持blocked | planned | waiting |
| 下一动作 | 仅项目台账推进后激活[commit-04-b](commit-04-b.md)；不能凭预建骨架跨项推进 | planned | waiting |
| 当前停点 | 等待正式07整体停审与用户后续明确实施范围；此skeleton创建不意味着handoff ready | planned | waiting |
