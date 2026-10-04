# commit-08-a implementation ledger（planned skeleton）

> 2026-10-04；设计者依据正式07预建非空台账。本文件不是实现或运行记录，未来boundary尚未current；无commit/run/test/EV/verdict/signoff/readiness。禁止因台账预存在自动开工。

## Boundary Header

| field | value |
|---|---|
| project | L6-bridges |
| boundary_id | commit-08-a |
| phase | PH-08 |
| design_baseline | not_established；formal07 worktree不是Git commit，真实baseline待单独授权固定 |
| implementation_repo | /home/aris/Projects/quantalithos-bridges（planned路径，实际不存在） |
| status | planned |
| gate_status | pending |
| next_allowed_action | wait_until_current |
| activation | 等项目实施ledger推进到本boundary且用户另行授权/真实基线/资格/门禁齐，不存在current许可 |
| increment | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母 |
| previous_boundary | commit-07-g |
| next_boundary | commit-08-b |

## Required Reads

| document | required_section | status | purpose |
|---|---|---|---|
| [implementation ledger](../implementation_execution_ledger.md) | Current Implementation State / Boundary Ledger / Open Blockers | waiting | 唯一current/实际baseline/允许动作 |
| [正式07](../../07-实施计划.md) | §3/5、§6 commit-08-a、§7/11/12 | waiting | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母；scope/批次/gate/commit/handoff |
| [正式03](../../03-详细设计.md) | §4/6~12/16本卡schema/fields/ports/flow/state/typed read-save | waiting | 完整当前source/guard/wholeCAS/result，没有实现补口 |
| [正式04](../../04-配置设计.md) | §7~12/14 current/secret/required/批准bounds与affected分支 | waiting | config不能授authority，actual缺失阻IO |
| [正式05](../../05-测试方案.md) | §6 EVIDENCE、REAL、PRIVATE、STATE、§9.5/13/14 | waiting | 原TC/EV/DS/suite/参数schema/path/材料成熟度 |
| [正式06](../../06-验收标准.md) | §5~11相关gate/§13~14 actual与签署 | waiting | 原139gate/P0/VETO/no-waiver，不机器裁决 |
| [05_test_plan_step_09_script_contract_calibration.md](../05_test_plan_step_09_script_contract_calibration.md) | 只本卡对象/协议/flow/状态/qualified port/TC与EV对应节 | waiting | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母，不全目录替代精确阅读 |
| [05_test_plan_harness_schema.json](../05_test_plan_harness_schema.json) | 只本卡对象/协议/flow/状态/qualified port/TC与EV对应节 | waiting | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母，不全目录替代精确阅读 |
| [05_test_plan_step_13_evidence.md](../05_test_plan_step_13_evidence.md) | 只本卡对象/协议/flow/状态/qualified port/TC与EV对应节 | waiting | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母，不全目录替代精确阅读 |
| [06_acceptance_step_10_evidence_audit.md](../06_acceptance_step_10_evidence_audit.md) | 只本卡对象/协议/flow/状态/qualified port/TC与EV对应节 | waiting | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母，不全目录替代精确阅读 |
| [06_acceptance_step_14_conclusion_signoff.md](../06_acceptance_step_14_conclusion_signoff.md) | 只本卡对象/协议/flow/状态/qualified port/TC与EV对应节 | waiting | 真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母，不全目录替代精确阅读 |
| [逐boundary经验](../07_implementation_step_06_boundaries.md) | §10 commit-08-a 55项 / §7机制证书 | waiting | 设计者已逐项设计静态复核，actualkind等资格blocker未释放，实现者二次核验 |
| [十表](../07_implementation_step_13_cross_document_review.md) | §1~10 commit-08-a及相关fields/construct/state | waiting | 正式03/05/06/07主动闭环，标准存在不等已符合 |

## Allowed Scope

这里只列planned scope；activation/design通过之前实际允许写入集合为空。

| type | path_or_rule | status |
|---|---|---|
| allowed_file | `scripts/gates/run-bridge-local.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `scripts/gates/run-bridge-real-seams.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `scripts/gates/run-bridge-release.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `scripts/checks/check-bridge-run-context.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `scripts/checks/check-bridge-test-evidence.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `scripts/reports/build-bridge-test-report.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `scripts/reports/build-bridge-acceptance-handoff.sh`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/contracts/tests/protocol_surface_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/domain/tests/local_guards_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/application/tests/authorization_flow_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/application/tests/continuity_flow_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/application/tests/safe_read_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/application/tests/support/mod.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/application/tests/support/qualified_ports.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/infra/tests/platform_boundary_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/infra/tests/local_commit_boundary_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/infra/tests/private_material_boundary_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/infra/tests/support/mod.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/infra/tests/support/qualified_providers.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/api/tests/inbound_dispatch_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/worker/tests/consumer_dispatch_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |
| allowed_file | `crates/jobs/tests/job_invocation_tests.rs`：仅当前增量及requiredsecondary schema/module export最小改动 | planned |

## Forbidden Scope

仅本卡增量与required transitive schema/ref kind owner、相应module exports的最小变更；同文件其他boundary方法不可顺手实现/重构。未列路径/后续boundary用例/其他项目与ownertruth禁止；不能自创field/refkind/schema/port/state/mapper/DDL或假sharedalias。禁止Query写/新identity/Gate批准/directRuntimeTools；禁止raw body/token/secret/private审批/附件bytes/可还原hashURL落日志/证据。禁止未受核SDK/OAuth/APIKey/KMS/router/provider/pin或hidden retry；synthetic无actual权限。用户dirty不覆盖、不stage/commit；当前无任何实现或测试权限。

## Tasks and Batches

[07§6](../../07-实施计划.md)的IMPL-08-a-01~04及BATCH-08-a-01~06为本卡逐步输入/输出/判定；每批100~250行目标，>300预先拆同步台账，>500必须拆；高风险单批单测。子功能同提交：全量cases/state150允许+375未列/current异常；source/config/designbaselines/两个check；安全report与缺项blocked，共享真实完整expectedmanifest→116TC closedparameters/四平台/mandatory→两check→22EV，不缩分母的完整当前闭包，不能裸对象提交或先业务后安全。

## Required Checks

| check | planned command / rule | status |
|---|---|---|
| formatting | cargo fmt --all -- --check | waiting |
| build/lint/doc | cargo check/clippy -p touched bridges-<role> --all-targets；clippy -D warnings；public API doc-test | waiting |
| targeted | cargo test -p bridges-contracts --test protocol_surface_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-domain --test local_guards_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-application --test authorization_flow_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-application --test continuity_flow_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-application --test safe_read_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-application --test mod；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-application --test qualified_ports；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-infra --test platform_boundary_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-infra --test local_commit_boundary_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-infra --test private_material_boundary_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-infra --test mod；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-infra --test qualified_providers；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-api --test inbound_dispatch_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-worker --test consumer_dispatch_tests；本cut所有当前参数及affectedcrate tests | waiting |
| targeted | cargo test -p bridges-jobs --test job_invocation_tests；本cut所有当前参数及affectedcrate tests | waiting |
| evidence | 05原run-bridge-local/real-seams（actual仅资格齐+另获操作授权）与安全材料；全量完整expected/两个check/22EV/ReportIndex，Handoff只draft | waiting |
| scope/whitespace | git status --short、git diff --name-only、未来授权提交前git diff --cached --name-only / --check；不执行stage于设计阶段 | waiting |

## Gate Matrix

| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | pending | waiting；项目ledger无current，futureplanned不激活 | wait_design |
| design_gate | blocked | waiting；BR-UP-001~009中受影响actual与WS/affected原项、provider/pin/account/权限/current/budget/retention | wait_design |
| scope_gate | pending | waiting；精确allowed/forbidden与用户dirty | fix_gate_failure |
| worktree_gate | pending | waiting；初始状态/用户改动归属 | fix_gate_failure |
| build_gate | pending | waiting；命令尚未执行 | fix_gate_failure |
| test_gate | pending | waiting；23TC方向，非实际结果 | fix_gate_failure |
| evidence_gate | pending | waiting；EV-CONTRACT-018、EV-CONTRACT-020、EV-CONTRACT-021、EV-REAL-001为最终计划非实例 | fix_gate_failure |
| commit_gate | pending | waiting；无提交授权/实际stagedfiles/checks | fix_gate_failure |
| handoff_gate | pending | waiting；无真实hash/nextaction | handoff |

## Commit Gate / Handoff Gate

提交前只stage本boundary，保护userdirty；完整current baseline/reads/55经验、scope/worktree/build/test/当前成熟度evidence齐，实际检查message为英文type(scope): subject、英文子功能groups/文件名真实改动量、真实换行和固定Codexfooter，cached --check。后写真实完整commit hash/message和postcommit worktree；交接需commands/results/unrun理由/remainingblockers/next=commit-08-b/用户保护files。缺必要证据不pass、不推进；规范不授本轮commit。

## Commit Record

| field | value |
|---|---|
| planned_commit_message | test(bridges-finaltests): validate complete fixed-run test coverage |
| planned_body_groups | 全量cases/state150允许+375未列/current异常；source/config/designbaselines/两个check；安全report与缺项blocked；未来逐组译英文并填真实文件名/改动量与summary，不填假diff |
| planned_footer | Co-Authored-By: Codex <noreply@openai.com> |
| staged_files_checked | waiting |
| commit_message_checked | waiting |
| committed_hash | waiting；不存在实际提交 |
| committed_message | waiting |
| post_commit_status | waiting |

## Blockers and Recovery

| source | status | blocking_reason | next_action |
|---|---|---|---|
| authorization/baseline/repo | open | 没有实施授权/immutable design commit/目标仓；07仍待用户停审 | wait_design |
| qualification/current | open | BR-UP-001~009中受影响actual与WS/affected原项、provider/pin/account/权限/current/budget/retention；synthetic只能test-only，不关闭actual | wait_design |
| schema/phase conflict（若发现） | waiting | 本卡新设计冲突须记录exact source/affected/forbiddenworkaround/requestedclosure，不实现补口 | wait_design |

门禁恢复：futureplanned特例只wait_until_current；激活后blocked只wait_design/fix_gate_failure/handoff；设计修复后再读项目ledger→本卡→正式07→required来源→可选scratch，固定真实修复baseline后重复核。没有actual read/test/commit/签署fact，不造运行材料。
