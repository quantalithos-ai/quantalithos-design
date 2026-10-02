# commit-04-a planned implementation ledger

## Boundary Header

| field | value |
|---|---|
| project | L6-marketplace |
| boundary_id | commit-04-a |
| phase | PH-04 |
| design_baseline | current full-restart formal 03/04/05/06/07 working tree; immutable baseline not_fixed_until_handoff |
| implementation_repo | /home/aris/Projects/quantalithos-marketplace (planned path; not_created) |
| status | planned |
| next_allowed_action | wait_until_current |
| gate_status | blocked |
| gate_reason | no implementation authority, fixed baseline or target worktree; prerequisite and real gates not executed |
| previous_boundary | commit-03-b |
| next_boundary | commit-04-b |
| current_recovery_point | read project ledger, this boundary, Required Reads, then verify activation; do not code now |
| goal | 受控分发、原意图 probe 与晚结果 |

本文件是设计阶段计划骨架，不是实现记录。项目ledger尚无激活boundary；未来只能由它将当前项激活，其他项保持planned/wait_until_current。本表pending reads/gates属于未来实现者二次检查，与本轮设计经验审查相区别。

## Required Reads

| document / source | required sections and purpose | implementation reread status |
|---|---|---|
| [正式03](../../03-详细设计.md)、[04](../../04-配置设计.md)、[05](../../05-测试方案.md)、[06](../../06-验收标准.md)、[07](../../07-实施计划.md) | 03 §6.3/7～12/17；05 §6/9；06 §5/7/8/11；schema/ports/flow/state/PG/config/test/evidence only from formal definitions | pending |
| [03_ddd_step_08_part_u4.md](../03_ddd_step_08_part_u4.md) | 当前distribution切片的完整typed source与missing/variant/current/Tx/测试来源，不从ref/error猜字段 | pending |
| [03_ddd_step_09_part_u4.md](../03_ddd_step_09_part_u4.md) | 当前distribution切片的完整typed source与missing/variant/current/Tx/测试来源，不从ref/error猜字段 | pending |
| [03_ddd_step_10_part_u4.md](../03_ddd_step_10_part_u4.md) | 当前distribution切片的完整typed source与missing/variant/current/Tx/测试来源，不从ref/error猜字段 | pending |
| [03_ddd_step_09_job_execution.md](../03_ddd_step_09_job_execution.md) | 当前distribution切片的完整typed source与missing/variant/current/Tx/测试来源，不从ref/error猜字段 | pending |
| [03_ddd_step_12_errors_recovery.md](../03_ddd_step_12_errors_recovery.md) | 当前distribution切片的完整typed source与missing/variant/current/Tx/测试来源，不从ref/error猜字段 | pending |
| [05_test_plan_step_06_cases.md](../05_test_plan_step_06_cases.md) | 当前distribution切片的完整typed source与missing/variant/current/Tx/测试来源，不从ref/error猜字段 | pending |
| [Step3](../07_implementation_plan_step_03_prerequisites_reads.md)、[Step6](../07_implementation_plan_step_06_tasks_boundaries.md)、[Step7](../07_implementation_plan_step_07_test_acceptance_gates.md)、[Step11](../07_implementation_plan_step_11_commit_review_delivery.md)、[Step12](../07_implementation_plan_step_12_completion.md) | 规范入口/完整任务/55经验/成熟度/commit/移交审计，正式优先 | pending |
| [代码实施台账规范](../../../../standards/document/代码实施台账与门禁规范.md)、[闭环标准§9](../../../../standards/document/设计真相源闭环与可落码性标准.md)、[实施书写§4.9](../../../../standards/document/实施计划书写规范.md) | current-only、全部gate与用户dirty保护、Englishmessage | pending |
| [project ledger](../implementation_execution_ledger.md)、[库存与来源](../07_implementation_boundary_closure_audit.md) | 当前baseline/前置/remaining blockers/49flow/98TC/215path唯一归属 | pending |

相关owner/SDK的正式03/07及必要台账必须重读；exact kind/operation/version/scope/current资格真实成立之前，selected positive保持blocked。本地MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005不是owner已受理工单。

## Allowed Scope

crates/application/src/distribution/; application/tests/distribution_flow_tests.rs; infra/tests/withdrawal_race_tests.rs 的分发半侧；fake/owner_ports.rs 的同 port 场景

| 03 layout主引入path（不是已存在文件） | 后续编辑保护 |
|---|---|
| crates/application/src/distribution/mod.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/request_distribution.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/cancel_distribution.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/record_receiver_outcome.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/get_acquisition_eligibility.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/get_distribution_progress.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/dispatch_distribution.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/reconcile_distribution.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/tests/distribution_flow_tests.rs | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/tests/withdrawal_race_tests.rs | 04-b撤回半侧 |

共享lib/mod/manifest/store/test只当前boundary明示的方法或半侧，不等整文件可自由改。首引入与后续合法增量详库存附录；缺typed定义/路径/方法scope先回设计，不临时补。01-a/02-a/02-b前置供给以正式03定义为准。

## Forbidden Scope

installed/paid、receiver 内部执行/DB、未 qualified effect、盲重发。共同禁止：owner Method/Role/ProcessTemplate正文、Capability Registry/Adapter truth、Member Image内容、Artifact正文/血缘、Identitytruth/Governanceapproval、Billing/支付/订阅/分成/跨境财务truth、Archivewriter/restore、new activeevent/outbox、静态运行/evidence/verdict/signoff/readiness。

测试fixture/fake只受控seam；production无fakefallback、配置ref不能宣布Bound，partial不能记完整suitepass。

## Tasks and Batch Plan

| task | planned increment | formal input | output | checks / batch relationship |
|---|---|---|---|---|
| IMPL-04-a1 | U4三Command/两Query | 03 U4全部七flow/状态；PH03 Listed | permission/eligibility/原intent/attempt/relation/outcome | DISTRIBUTION定向业务层；BATCH族见Step6，每子片100～300，>300拆，>500禁止一次实现，最后同boundary一笔 |
| IMPL-04-a2 | U4两Job | 03 U4 dispatch/reconcile；job execution | 原intent dispatch/probe、完整report/Unknown/late | W/R定向；完整W至06-b；BATCH族见Step6，每子片100～300，>300拆，>500禁止一次实现，最后同boundary一笔 |
| IMPL-04-a3 | 分发与撤回共享锁 | 03 §10～12 | Acommit→effect→Bframe、no-new检查、late outcome持久责任 | P race/Unknown不盲重发；BATCH族见Step6，每子片100～300，>300拆，>500禁止一次实现，最后同boundary一笔 |

状态/事务/并发/幂等/scope/安全/审计/恢复独立子批review。全部子批及requiredgates真实通过且有commit授权之后，才形成一笔；不按文件或route拆commit。

## Flow Scope

| flow | kind | unit |
|---|---|---|
| RequestDistribution | Command | U4 |
| CancelDistribution | Command | U4 |
| RecordReceiverOutcome | Command | U4 |
| GetAcquisitionEligibility | Query | U4 |
| GetDistributionProgress | Query | U4 |
| DispatchDistribution | Job | U4 |
| ReconcileDistribution | Job | U4 |

## Required Checks and TC Ownership

最小目标：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome；按当前栈fmt/check/clippy/rustdoc、Webtypecheck/lint/browser、scripts shellcheck/CLI及对应直接测试。真实PG用PG，fake不等durableproof。

| primary TC | primary EV | suite别名 | 正式完整执行层最早boundary | AC/VETO |
|---|---|---|---|---|
| TC-DISTRIBUTION-001 | EV-WORKER-001 | W | commit-06-b | AC-MP-401, VETO-MP-3 |
| TC-DISTRIBUTION-002 | EV-WORKER-002 | W | commit-06-b | AC-MP-401, AC-MP-403 |
| TC-DISTRIBUTION-003 | EV-WORKER-003 | W | commit-06-b | AC-MP-403, AC-MP-G02 |
| TC-DISTRIBUTION-004 | EV-WORKER-004 | W | commit-06-b | AC-MP-403, AC-MP-G02 |
| TC-DISTRIBUTION-005 | EV-WORKER-005 | W | commit-06-b | AC-MP-402, AC-MP-403, VETO-MP-4 |
| TC-DISTRIBUTION-006 | EV-WORKER-006 | W | commit-06-b | AC-MP-203, AC-MP-402, AC-MP-403, AC-MP-504 |
| TC-DISTRIBUTION-007 | EV-WORKER-007 | W | commit-06-b | AC-MP-203, AC-MP-401, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-504 |
| TC-DISTRIBUTION-008 | EV-WORKER-008 | W | commit-06-b | AC-MP-402, AC-MP-403, VETO-MP-4 |
| TC-DISTRIBUTION-009 | EV-WORKER-009 | W | commit-06-b | AC-MP-401, VETO-MP-3 |
| TC-DISTRIBUTION-010 | EV-WORKER-010 | W | commit-06-b | AC-MP-402, AC-MP-403, AC-MP-504 |


以上完整层最早点不是通过记录。任何定向子层缺正式expected subcase只记partial/incomplete，不动required集合。最终98主EV与all库存由07-a同runactualraw→suite/run→六artifactchecks→EV/index→六seal→draft；07-b人/Agent审查。本轮不生成或执行。

## Design Experience Review: 55 Items

本轮由当前设计者逐项复核，source代号在[规范性审核附录](../07_implementation_boundary_closure_audit.md) §1。P=设计定义/前置/排程闭口（通过设计复核，非实施gate），N=当前行为不适用且有具体原因，B=local来源存在但selectedpositive缺正式资格。每项正式证据是设计来源，不是runtime evidence。实现者只二次校验baseline/conditions，发现不同须blocked回报。

| experience | source / formal evidence location | design conclusion | boundary-specific reason / treatment |
|---|---|---|---|
| EXP-01 字段闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-02 DTO 构造闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-03 Support carrier/schema 当前边界闭口 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-04 Typed-ref kind owner scope 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-05 Query response 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-06 Generic ref 与 repository typed ref 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-07 Query status marker 来源闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-08 Query material degraded mapper 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-09 Paged query Empty visibility seed 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-10 Maintenance job typed output 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-11 Projection rebuild view body-field 输入闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。本切片不实现该query/maintenance/entry面；只沿前置typed定义或共享存储，不新增该执行分支。 当前面负责处：02-b/03-b typedplan、projection与lookup；05-a审计读取。 未触发不代表删除其他boundary的required行为。 |
| EXP-12 API query handler disposition 映射闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。本切片不实现该query/maintenance/entry面；只沿前置typed定义或共享存储，不新增该执行分支。 当前面负责处：02-a runner/result前置，06-a/06-b entry mapper。 未触发不代表删除其他boundary的required行为。 |
| EXP-13 Entry loop 结果明细 surface 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-14 Query visibility resolution 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-15 Accepted truth cursor 来源闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-16 Reference-only stale cursor 来源闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。本切片不执行该truth/marker/projection写集；无新副作用或读面，相关行为由表列业务boundary实现。 当前面负责处：03～05各业务flow与02-a/02-b共享前置。 未触发不代表删除其他boundary的required行为。 |
| EXP-17 Reference marker trace subject 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。本切片不执行该truth/marker/projection写集；无新副作用或读面，相关行为由表列业务boundary实现。 当前面负责处：03～05各业务flow与02-a/02-b共享前置。 未触发不代表删除其他boundary的required行为。 |
| EXP-18 Handoff / export marker trace subject 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。无handoff/export marker trace独立写面；本仓MarketAuditRecord按逐flow库存，Archive/export为future。 当前面负责处：03～05各业务flow与02-a/02-b共享前置。 未触发不代表删除其他boundary的required行为。 |
| EXP-19 Accepted side-effect inventory 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-20 Idempotency reserve context/channel 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-21 Accepted subject identity 同源闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-22 Projection stale 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-23 Projection-backed query lookup 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。本切片不执行该truth/marker/projection写集；无新副作用或读面，相关行为由表列业务boundary实现。 当前面负责处：02-b/03-b typedplan、projection与lookup；05-a审计读取。 未触发不代表删除其他boundary的required行为。 |
| EXP-24 Ref-scope 解析闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | blocker（selected positive） | 04-a local typed schema/负例有上述来源；selected positive缺MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005。必须取exact consumer资格，不能以配置ref/fake/通用SDK返回生成allow。 处理：formalowner提供exactsource，回对应03/04/05/06/07并固定新baseline重核，不fake填合格。 |
| EXP-25 Public scope branch 展开闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-26 Sidecar truth 读取面闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-27 Body-free snapshot typed read 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-28 Reference typed sidecar version 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。本切片不执行该truth/marker/projection写集；无新副作用或读面，相关行为由表列业务boundary实现。 当前面负责处：02-b/03-b typedplan、projection与lookup；05-a审计读取。 未触发不代表删除其他boundary的required行为。 |
| EXP-29 factory 签名闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-30 状态闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-31 public target 穷尽闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-32 public command intent 结构化闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-33 shared shell selector 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。当前切片不引入该command/job/config/adapter/history生命周期；对应type/port引用仅继承已闭合前置。 当前面负责处：03～05各业务flow与02-a/02-b共享前置。 未触发不代表删除其他boundary的required行为。 |
| EXP-34 selected service input source map 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-35 snapshot helper 判定字段闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-36 public job surface 阶段闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。12Job均worker-internal；无public Job/receipt协议，本切片仍按内部report/metadata审核。 当前面负责处：03～05各业务flow与02-a/02-b共享前置。 未触发不代表删除其他boundary的required行为。 |
| EXP-37 前置 surface repair 边界闭环 | H：正式07 §3/5～7/10/12、前序chain/batch/15scope/新baseline及项目记忆MEM-MP-007/010 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-38 job policy executable summary 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。没有retry/expiry/retention policy ref驱动的通用Job；lease/batch只来自正式配置，未获删除authority不GC。 当前面负责处：03～05各业务flow与02-a/02-b共享前置。 未触发不代表删除其他boundary的required行为。 |
| EXP-39 config binding 闭环 | C：正式03 §13、04 §7/9/11的RuntimeConfig、validator及configuration_ref/provider绑定 | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。当前切片不引入该command/job/config/adapter/history生命周期；对应type/port引用仅继承已闭合前置。 当前面负责处：01-b typed loader，06-c slot装配。 未触发不代表删除其他boundary的required行为。 |
| EXP-40 history 构造闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-41 record id / 返回面闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-42 ref identity 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-43 validation truth 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | blocker（selected positive） | 04-a local typed schema/负例有上述来源；selected positive缺MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005。必须取exact consumer资格，不能以配置ref/fake/通用SDK返回生成allow。 处理：formalowner提供exactsource，回对应03/04/05/06/07并固定新baseline重核，不fake填合格。 |
| EXP-44 metadata 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-45 idempotency 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-46 stored receipt typed save/get 闭环 | T：正式03 §10～12及typedports/逐flow同Tx inventory：UoW/PK/version/cursor/history/完整result/恢复 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-47 entry context factory 闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。当前切片不引入该command/job/config/adapter/history生命周期；对应type/port引用仅继承已闭合前置。 当前面负责处：02-a runner/result前置，06-a/06-b entry mapper。 未触发不代表删除其他boundary的required行为。 |
| EXP-48 adapter failure outcome 分类闭环 | A：正式03 §6.1～6.3/§7～9/§15及本boundary Required Reads：closedcarrier、factory/selector/source map/metadata/ref/state | blocker（selected positive） | 04-a local typed schema/负例有上述来源；selected positive缺MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005。必须取exact consumer资格，不能以配置ref/fake/通用SDK返回生成allow。 处理：formalowner提供exactsource，回对应03/04/05/06/07并固定新baseline重核，不fake填合格。 |
| EXP-49 projection rebuild 闭环 | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。当前切片不引入该command/job/config/adapter/history生命周期；对应type/port引用仅继承已闭合前置。 当前面负责处：02-b/03-b typedplan、projection与lookup；05-a审计读取。 未触发不代表删除其他boundary的required行为。 |
| EXP-50 public read-model identity | R：正式03 §8/10/12与U3/U4/U5/U6/U7 ReadFacade/typed read/lookup/PageReadContext/plan：Empty/Degraded/current | 不适用 | 04-a增量为“受控分发、原意图 probe 与晚结果”。当前切片不引入该command/job/config/adapter/history生命周期；对应type/port引用仅继承已闭合前置。 当前面负责处：02-b/03-b typedplan、projection与lookup；05-a审计读取。 未触发不代表删除其他boundary的required行为。 |
| EXP-51 artifact materialization | E：正式05 §9/13及06 §10的raw/case/suite/check/run/EV/index/draft schema、path、writer/reader、digest/redaction | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-52 machine artifact JSON schema | E：正式05 §9/13及06 §10的raw/case/suite/check/run/EV/index/draft schema、path、writer/reader、digest/redaction | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-53 phase boundary | H：正式07 §3/5～7/10/12、前序chain/batch/15scope/新baseline及项目记忆MEM-MP-007/010 | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-54 path baseline | E：正式05 §9/13及06 §10的raw/case/suite/check/run/EV/index/draft schema、path、writer/reader、digest/redaction | 通过（设计） | 当前设计有正式来源，当前切片按Required Reads和tasks实施；前置增量由串行chain供应。 04-a实际验证切口：原 intent/permission、A/B 帧、CommitUnknown/reconcile/late outcome。无run或资格通过声明。 实现检查不符先回设计，不私补schema。 |
| EXP-55 blocker 经验回写 | H：正式07 §3/5～7/10/12、前序chain/batch/15scope/新baseline及项目记忆MEM-MP-007/010 | 通过（设计） | 本轮排程/边界数量、suite别名、typed配置冲突均由既有标准§9.2 phase/config/schema/path覆盖；回写本项目Step及正式04/07，并横扫15边界/更新记忆。无新增通用规则，禁止越权修改标准；见Step10具体正反例。 实现检查不符先回设计，不私补schema。 |

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

## Gate Matrix

| gate | status | required real record / current reason | next_allowed_action |
|---|---|---|---|
| Activation Gate | blocked | implementation authority, project current=commit-04-a, immutablebaseline, predecessor handoff; none exists | wait_until_current |
| Design Gate | pending | recheck formal03/05/06/07+04 and 55items, no localschema/phase/evidence gap; selectedqualification as scope requires | wait_until_current |
| Scope Gate | pending | exactpaths/methodgroups/forbidden, nofuture/ownertruth | wait_until_current |
| Worktree Gate | pending | targetgitroot/branch/status, user/unrelated diff ownership recorded and protected | wait_until_current |
| Build Gate | pending | actualtargettoolchain/lock/fmt/check/lint/doc orWeb/scriptschecks | wait_until_current |
| Test Gate | pending | allcurrentrequiredcases/subcases/directlayers, actualnotrun | wait_until_current |
| Evidence Gate | pending | precommit真实非合格诊断/安全与当前成熟度；postcommit pinned-source same-run raw/report，不旧HEAD冒源码；无fabricatedsource | wait_until_current |
| Commit Gate | pending | single-boundary staged, whitespace, gitidentity, authorizedEnglishmessage/body/footer and checks | wait_until_current |
| Handoff Gate | pending | actualhash/baseline、提交后pinned-source/newrun当前partial或07-a fullEV/seal/draft、reviewer/remainingblockers/unruntests/next；未达不激活 | wait_until_current |

## Commit Gate and Body Groups

Allowed types由正式07 §11，scope=distribution。body先一句Englishboundarysummary，再按协作子功能，不fullpath、不字面量反斜杠n，filebasename+真实diff量；相邻bullet无空行，固定Codexfooter前真实空行。

| bodygroup | same-boundary reason |
|---|---|
| Preserve original distribution intent and permission | U4 全部七 flow的协作能力与共同直接验证，不拆为多个无独立闭环的commit |
| Reconcile uncertain receiver effects and late outcomes | U4 全部七 flow的协作能力与共同直接验证，不拆为多个无独立闭环的commit |

Current commit authority: absent。本轮不提交、不写gitconfig、不暂存用户dirty文件。提前requiredgate失败不能WIPcommit，纯设计自检不作为Build/Test/Evidence。

## Commit Record

| field | value |
|---|---|
| implementation_commit_hash | not_created |
| commit_message | not_created |
| staged_diff_record | not_created |
| actual_check_run_ids | not_created |
| raw_artifact_refs | not_created |
| report_refs | not_created |
| reviewer / review_record | not_created |
| handoff_record | not_created |
| verdict / signoff / readiness | not_evaluated |

not_created是明确缺事实，不是占位的伪hash。未来由实际实现者记录，不能复制其他项目、设计commit、原型或本表当来源。

## Open Blockers

| fact / local investigation | current posture | next action |
|---|---|---|
| user implementation/commit authority, immutablebaseline, targetrepo/worktree/toolchain | waiting / blocked activation | only explicit authority and truepreflight can activate |
| MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005 | selectedpositiveblocked；localnegative不解除 | exactsource/currentcontract与最早截止见Step9；不得自造issue接受/qualification |
| Q-MP-01及future Billing/Archive/event | candidate / future | 无budget/authority不SLO/TTL/GC/writer |

## Handoff and Recovery

先读项目台账→本文件→Required Reads；未激活不修改代码。后续真实handoff须hash、固定baseline、gate/raw/report/审查、remaining blockers、未跑checks与next=commit-04-b。当前无handoff。

发生design/DTO/state/source/port/phase/evidence冲突即pause，回所属truth，设计者重核后固定新baseline；用户/其他boundary改动先登记保护，回退仅授权当前自己的增量，不reset/checkout/删除历史。CommitUnknown保留original intent/permission/operation/full result，formalprobe/reconcile不足继续waiting，不能盲重发。重跑newrun/newexecution，不同run拼接或旧run覆盖禁止。

## Authenticity Limit

planned only。无实现仓、代码commit/run、资产包/digest/扫描/签名/支付结果、实际artifact/report/evidence、验收verdict/signoff/readiness。未来current与资格不由本文自动生成。
