# Step 7. 嵌入测试与验收门禁

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填章节: `07-实施计划.md` §7 测试与验收门禁嵌入

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 嵌入测试与验收门禁 |
| 当前状态 | 进行中;按门禁类型分批写入 |
| 输入基线 | Step 5 阶段表;Step 6 commit boundary;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 8 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 PH-01~PH-08 | 已完成 | 将阶段与测试 / 验收门禁绑定 |
| Step 6 commit-01-a~commit-08-b | 已完成 | 将提交边界与提交前测试、artifact、report、AC / VETO 风险绑定 |
| `05-测试方案.md` §9 自动化与 CI/CD 门禁 | 已存在 | 提供 suite、script、artifact/report path、candidate evidence 规则 |
| `05-测试方案.md` §10 专项测试 | 已存在 | 提供性能 sample、redaction、一致性、恢复、观测、依赖边界专项 |
| `06-验收标准.md` §5~§14 | 已存在 | 提供 AC-GOV、SYNC、STATE、NFR、EV、VETO、缺陷、风险接受、最终裁决 |

## 3. SOP 问题回答

1. 每个阶段应执行哪些测试用例或测试切口。

   回答: PH-01 运行 workspace/config/script/dependency 检查;PH-02~PH-04 运行 contract-domain-fast 与 service-flow-fast 的 command/state slice;PH-05 运行 query no-write、visibility、projection tests;PH-06 运行 consumer/outbox/publisher tests;PH-07 运行 entry-worker-job 和 operations-replay-core;PH-08 运行 release-main-smoke、report-generation-audit、redaction、dependency、VETO audit。

2. 哪些阶段必须对齐验收标准 AC 项。

   回答: PH-02 对齐 AC-GOV-001;PH-03 对齐 AC-GOV-002;PH-04 对齐 AC-GOV-003/004;PH-05 对齐 AC-GOV-005、AC-GOV-SYNC-002、AC-GOV-TX-003;PH-06 对齐 AC-GOV-SYNC-003/004;PH-07 对齐 AC-GOV-SYNC-005、AC-GOV-IDEMP、AC-GOV-NFR;PH-08 对齐 AC-GOV-EV、VETO 和最终裁决。

3. 每个门禁需要产出什么证据。

   回答: 执行门禁必须写入 `artifacts/test/<run_id>/suites/<suite>/` 的 raw artifact,并生成 `reports/runs/<run_id>/...` 的人读 report。正式 EV / VETO 只在 PH-08 从这些 artifact/report 推导。

4. 门禁失败是否允许继续进入下一阶段。

   回答: P0 blocking gate 失败不得进入下一 phase 或提交当前 boundary。非 P0 selected-run unavailable 只能记录 residual,不得算 P0 pass。

5. 哪些门禁可以自动化,哪些需要人工审查。

   回答: P0 suite、redaction、dependency、report pairing、static evidence guard 必须自动化。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 可由脚本生成初稿,但必须由人或 Agent 审查。

6. 哪些验收一票否决项需要在实施阶段提前规避。

   回答: VETO-GOV-001~013 全部提前规避。尤其是相邻仓 truth 替代、raw body/secret 泄露、Policy truth 反定义、finalized Decision 原地改写、query/job 反写真相、non-core sibling compile dependency、静态 evidence / VETO passed、P0 config silent fallback。

7. 每个阶段应调用哪些 `scripts/gates/*.sh`。

   回答: PH-01 使用 dry-run / dependency checks;PH-02~PH-04 使用 `run_ci_gate.sh --gate pr` 的 contract-domain-fast/service-flow-fast 切片;PH-05~PH-07 逐步加入 main suites;PH-08 使用 `run_release_gate.sh --run-id <run_id>`。

8. 每个阶段会输出哪些 `artifacts/test/<run_id>/...`。

   回答: 每个 phase 的 suite artifact 按 `artifacts/test/<run_id>/suites/<suite>/` 输出。commit boundary 提交前可使用 boundary-scoped run_id,release 使用固定 candidate run_id。

9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>`。

   回答: PH-01 只 dry-run report shell;PH-02~PH-07 可为 targeted suites 生成 run reports;PH-08 必须生成 gate summary、suite reports、evidence index、redaction/dependency/report audit。

10. 哪些阶段需要生成或更新 `reports/acceptance/*`。

    回答: 只有 PH-08 生成或更新 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`。早期 phase 不写 acceptance verdict。

11. 哪些报告必须由人或 Agent 审查补充后才能进入验收。

    回答: handoff、veto checklist、risk acceptance、open issues、release summary 必须审查。suite report 和 raw artifact 可由脚本生成,但 report audit 必须证明来源真实。

12. 每个 commit boundary 提交前应执行哪些测试、生成哪些 artifact / report、覆盖哪些 AC / VETO 风险。

    回答: 本 Step 的 commit boundary 门禁矩阵逐项列出。

13. 是否存在阶段有门禁但 boundary 无提交前门禁,或 boundary 有测试但没有证据归属。

    回答: 当前矩阵要求每个 boundary 均有提交前门禁;若只是文档 / skeleton boundary,仍需 diff check、dry-run 或 path/dependency check。

14. 每个 phase / commit boundary 的门禁完成后是否通过停审。

    回答: 本 Step 提供门禁停审表。执行期必须在提交前重复停审。

15. 所有门禁完成后,测试重复、证据缺失、验收覆盖缺口和 report 审查责任是否通过审计。

    回答: 当前设计层审计通过。PH-08 仍是 evidence integrity 的最终收口点。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | boundary 有门禁名称但未完整映射 AC / VETO / artifact | 实施者可能只跑测试不归档证据 | 增加 commit boundary 门禁矩阵 |
| `05` §9 | suite 是全局定义 | 需要落到 phase / boundary | 增加阶段门禁矩阵 |
| `06` §10~§11 | evidence / VETO 要求严格 | 如果 PH-08 才发现会返工 | 把 evidence source / static pass guard 前置 |
| Release evidence | 容易被通用测试计数或静态 JSON 伪造 | 会触发 VETO-GOV-011 | 明确 release-main-smoke and report audit 规则 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段门禁 | phase 只写 suite 名 | phase 绑定测试、验收、artifact、report、失败处理 | 防止最后补测 |
| 提交门禁 | boundary 只写最小测试 | boundary 绑定 AC / VETO 风险和证据输出 | 防止无证据提交 |
| EV / VETO | 最终验收才汇总 | PH-08 从真实 artifact/report 推导 | 防止静态 evidence |
| report 审查 | 未分责任 | scripts 生成初稿,人/Agent 审查 acceptance reports | 保证裁决可审计 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 commit 都生成正式 EV | 追溯细 | 正式 EV 过早固定,容易与最终 run 冲突 | 不采用 |
| 早期只生成 suite artifact/report,PH-08 汇总正式 EV | 保持证据真实且避免过早裁决 | PH-08 工作量更集中 | 采用 |
| release smoke 用全量 `cargo test` 代替 | 简单 | 不能证明业务闭环 | 不采用 |
| release smoke 固定业务闭环 | 可验收 | 需要专门场景 | 采用 |

## 7. 结构化中间产物

### 7.1 门禁输出规则

| 输出类型 | 路径 | 生成阶段 | 要求 |
|---|---|---|---|
| raw suite artifact | `artifacts/test/<run_id>/suites/<suite>/` | 所有执行 suite 的 phase | 必须包含 status、case refs、failure reason、config profile、duration/count、digest |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | PH-02~PH-08 | 必须从 raw artifact 生成 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | PH-08 必须;早期可选 | 不得把 failed 改为 passed |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | PH-04 起 targeted;PH-08 必须 | artifact and report 都纳入 scan |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | PH-01 起 targeted;PH-08 必须 | 证明 only `L0-core` compile dependency |
| report audit | `reports/runs/<run_id>/report-audit.md` | PH-08 必须 | 证明 artifact/report pairing and no static evidence |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | PH-08 | 从真实 artifact/report 推导 |
| acceptance handoff | `reports/acceptance/handoff.md` | PH-08 | 必须经人或 Agent 审查 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | PH-08 | 每项 VETO 必须引用真实 EV/report/defect |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | PH-08 | 不得接受 VETO/S 级缺陷 |

### 7.2 门禁失败处理

| 失败类型 | 是否可继续 | 处理 |
|---|---|---|
| compile / format / targeted test failure | 否 | 修复后重跑当前 boundary 门禁 |
| contract-domain-fast / service-flow-fast blocking failure | 否 | 不得提交;若设计冲突则回写设计 |
| redaction leak | 否 | 视为 S 级 / VETO 风险;修复后重跑 redaction and affected suites |
| dependency boundary violation | 否 | 移除非 core compile dependency 或回写架构;不得风险接受 |
| report missing raw artifact | 否 | 修复 report generator or suite output;不得手写补洞 |
| static evidence / default VETO passed | 否 | 删除静态来源,改为从 artifact/report 推导 |
| P1 selected-run unavailable | 是,但不计 P0 pass | 记录 residual/unavailable,不得影响 P0 结论 |
| flaky / timeout | 否,除非正式重跑策略定义 | 保留 failed artifact,按缺陷处理 |

### 7.3 阶段门禁矩阵

| 阶段编号 | 测试门禁 | 验收门禁 | 执行脚本 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | `cargo check`;config parse smoke;script dry-run;dependency path check | AC-GOV-NFR-004;AC-GOV-NFR-005;VETO-GOV-010/013 前置 | `scripts/checks/check_dependency_boundary.sh` dry-run;config smoke | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` targeted | 不得进入 PH-02;修正 workspace/config/path |
| PH-02 | contract-domain-fast context/input slice;service-flow-fast context/input slice | AC-GOV-001;AC-GOV-TX-001;AC-GOV-IDEMP-001 | `scripts/gates/run_ci_gate.sh --gate pr --suite contract-domain-fast`;`--suite service-flow-fast` | contract/domain/service slice artifacts | suite reports for targeted run | 不得提交 PH-02 boundary;若 DTO/state/version 缺口则回写设计 |
| PH-03 | contract-domain-fast gate/decision/approval slice;service-flow-fast decision slice | AC-GOV-002;AC-GOV-STATE-001/002;VETO-GOV-002/006 | `run_ci_gate.sh --gate pr` targeted suites | gate/decision/approval artifacts | targeted suite reports | 不得进入 PH-04;状态或 responsibility 缺口回写设计 |
| PH-04 | contract-domain-fast policy/control/compliance/NC slice;service-flow-fast PH-04 slice;redaction targeted | AC-GOV-003/004;AC-GOV-016~025;VETO-GOV-003/004/005/007/008 | `run_ci_gate.sh --gate pr`;`scripts/checks/check_redaction.sh` targeted | PH-04 suite artifacts;redaction raw | PH-04 suite reports;targeted redaction report | redaction 或 truth boundary 失败不得风险接受 |
| PH-05 | query no-write;visibility/freshness/degraded;projection/read model tests;API query tests | AC-GOV-005;AC-GOV-SYNC-002;AC-GOV-TX-003;VETO-GOV-009 | `run_ci_gate.sh --gate main --suite service-flow-fast` targeted | query/projection artifacts | query suite reports | query 写入或 visibility 泄露即阻断 |
| PH-06 | consumer tests;outbound contract tests;outbox publisher tests;topic map check;redaction targeted | AC-GOV-SYNC-003/004/006;AC-GOV-IDEMP-004;VETO-GOV-003/009 | `run_ci_gate.sh --gate main --suite entry-worker-job`;`--suite operations-replay-core` targeted | consumer/outbox/publisher artifacts | worker/outbox reports | unsupported event parse/write、payload current truth 重算或 publisher rollback truth 均阻断 |
| PH-07 | job contract tests;operations-replay-core;entry-worker-job;handoff/export/redaction targeted | AC-GOV-SYNC-005/007;AC-GOV-NFR-002/006/007;VETO-GOV-009 | `run_ci_gate.sh --gate main --suite operations-replay-core`;`--suite entry-worker-job` | job/replay/handoff/export artifacts | job and operations reports | duplicate job 重跑、job truth repair、partial failure 无 report 均阻断 |
| PH-08 | release-main-smoke;config-redline;redaction-boundary;dependency-boundary;report-generation-audit;VETO audit | AC-GOV-EV-001~009;VETO-GOV-001~013;final decision prerequisites | `scripts/gates/run_release_gate.sh --run-id <run_id>`;report/check scripts | full release artifacts | `reports/runs/<run_id>`;`reports/acceptance/*` | 任一 blocking gate/VETO/report audit 失败不得 pass/conditional pass |

### 7.4 Commit boundary 门禁矩阵

| Commit boundary | 提交前测试门禁 | 验收 / VETO 关联 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|
| commit-01-a | `cargo fmt --check`;`cargo check`;dependency path check;`git diff --check` | AC-GOV-NFR-005;VETO-GOV-010 | dependency-boundary targeted artifact optional | dependency targeted report optional | 不提交;修正 workspace/dependency |
| commit-01-b | config parse smoke;script dry-run;`cargo check`;`git diff --check` | AC-GOV-NFR-004;VETO-GOV-013 | config/shell dry-run artifact optional | config targeted report optional | 不提交;修正 config or scripts |
| commit-02-a | contract-domain-fast context/input slice | AC-GOV-001;AC-GOV-STATE-001 | contract/domain artifacts | suite report | 不提交;回写 DTO/state 缺口 |
| commit-02-b | service-flow-fast context/input;infra-runtime-fake slice | AC-GOV-001;AC-GOV-TX-001;AC-GOV-IDEMP-001 | service/fake artifacts | suite report | 不提交;修 transaction/idempotency/version |
| commit-03-a | contract-domain-fast gate/decision slice | AC-GOV-002;AC-GOV-STATE-001/002;VETO-GOV-006 | gate/decision artifacts | suite report | 不提交;修状态或 supersede 口径 |
| commit-03-b | contract-domain-fast approval slice | AC-GOV-002;AC-GOV-STATE-001 | approval artifacts | suite report | 不提交;修 responsibility / delegation 口径 |
| commit-03-c | service-flow-fast decision/approval;infra-runtime-fake slice | AC-GOV-002;AC-GOV-TX-001;AC-GOV-IDEMP-001 | decision/approval service artifacts | suite report | 不提交;修 accepted path |
| commit-04-a | contract-domain-fast policy slice | AC-GOV-003;VETO-GOV-004/005 | policy artifacts | suite report | 不提交;修 policy/shared rules |
| commit-04-b | contract-domain-fast control/compliance slice;redaction targeted | AC-GOV-003/004;VETO-GOV-003/007 | control/compliance artifacts;redaction raw | suite/redaction report | redaction fail 不得风险接受 |
| commit-04-c | contract-domain-fast NC slice | AC-GOV-004;VETO-GOV-008 | NC lifecycle artifacts | suite report | 不提交;修 NC close/verify 口径 |
| commit-04-d | service-flow-fast PH-04;redaction-boundary targeted | AC-GOV-003/004;AC-GOV-TX-001;VETO-GOV-003~008 | PH-04 service artifacts;redaction raw | suite/redaction report | 不提交;修 service/redaction |
| commit-05-a | contract-domain-fast query/view/projection identity | AC-GOV-SYNC-002;AC-GOV-TX-003 | query/view artifacts | suite report | 不提交;修 query response/status marker |
| commit-05-b | query no-write;visibility/freshness/degraded;projection tests | AC-GOV-005;VETO-GOV-009 | query service artifacts | query suite report | query 写入或 visibility 泄露阻断 |
| commit-05-c | API query handler tests;query no-write regression | AC-GOV-SYNC-002 | API query artifacts | suite report | 不提交;修 entry mapping |
| commit-06-a | inbound event contract tests | AC-GOV-SYNC-003 | inbound artifacts | suite report | 不提交;修 schema/variant |
| commit-06-b | consumer tests;projection stale targeted;redaction targeted | AC-GOV-SYNC-003;VETO-GOV-003/009 | consumer/stale artifacts | consumer suite report | unsupported parse/write or stale gap 阻断 |
| commit-06-c | outbound contract tests;service regression | AC-GOV-SYNC-004;AC-GOV-TX-001;VETO-GOV-009 | outbound/outbox artifacts | suite report | payload source or outbox snapshot 缺口阻断 |
| commit-06-d | outbox publisher tests;topic map check | AC-GOV-SYNC-004/006;AC-GOV-IDEMP-004 | publisher artifacts | outbox suite report | publication marker/version/topic 缺口阻断 |
| commit-07-a | job contract tests;duplicate replay contract | AC-GOV-SYNC-005;AC-GOV-IDEMP-001 | job contract artifacts | suite report | stored report surface 缺口阻断 |
| commit-07-b | operations-replay-core publish/rebuild/refresh/reconcile subset | AC-GOV-SYNC-005;AC-GOV-NFR-006;VETO-GOV-009 | operations artifacts | operations report | scope/truth source/report 缺口阻断 |
| commit-07-c | handoff/export tests;redaction targeted | AC-GOV-SYNC-005/007;VETO-GOV-003/009 | handoff/export artifacts | handoff/export reports | failed item/redaction/target 缺口阻断 |
| commit-07-d | entry-worker-job;operations-replay-core | AC-GOV-SYNC-005;AC-GOV-EV-002 | job entry artifacts | job entry report | entry bypass service 或 artifact missing 阻断 |
| commit-08-a | release gate dry-run;report audit skeleton;no static evidence guard | AC-GOV-EV-006;VETO-GOV-011 | release dry-run artifacts | report audit skeleton | static evidence or missing pairing 阻断 |
| commit-08-b | release-main-smoke;redaction;dependency;report-generation-audit;VETO checklist audit | AC-GOV-EV-001~009;VETO-GOV-001~013 | full release artifacts | reports/runs and reports/acceptance | 任一 blocking/VETO failure 不得 pass |

### 7.5 报告生成规则

| 阶段编号 | 生成脚本 | 输入 artifact | 输出 report | 人 / Agent 审查要求 |
|---|---|---|---|---|
| PH-01 | targeted dependency/config report script or dry-run | workspace/config/check artifacts | targeted dependency/config report | 设计者确认不含静态 pass |
| PH-02~PH-04 | `scripts/reports/generate_reports.sh` targeted run | contract-domain-fast/service-flow-fast artifacts | suite reports | 实施者检查失败原因;设计者处理设计 blocker |
| PH-05 | `generate_reports.sh` targeted query run | query/projection/API artifacts | query suite reports | 审查 no-write and visibility coverage |
| PH-06 | `generate_reports.sh` targeted event/outbox run | consumer/outbox/publisher artifacts | worker/outbox suite reports | 审查 payload snapshot and redaction |
| PH-07 | `generate_reports.sh` targeted operations run | operations/job/handoff/export artifacts | operations reports | 审查 duplicate replay and partial failure |
| PH-08 | `generate_reports.sh`;`build_gate_summary.sh`;`build_evidence_index.sh`;VETO/risk/handoff generators | full release artifacts | `reports/runs/<run_id>` and `reports/acceptance/*` | handoff/VETO/risk/release summary 必须人或 Agent 审查 |

### 7.6 验收交接报告审查规则

| 报告 | 生成方式 | 必须审查 | 不允许 |
|---|---|---|---|
| `reports/acceptance/handoff.md` | script 初稿 + 人/Agent 审查 | baseline、run_id、scope、passed/failed/unavailable、open issues | 缺 run refs 或替代正式 verdict |
| `reports/acceptance/veto-checklist.md` | 从 evidence/report/defect 计算 + 审查 | VETO-GOV-001~013 每项来源和状态 | 默认全 passed;缺证据 passed |
| `reports/acceptance/risk-acceptance.md` | script 初稿 + 审查 | residual 影响、接受理由、责任人、接受人、截止条件 | 接受 VETO/S 级缺陷 |
| `reports/acceptance/open-issues.md` | defect/retest/risk 汇总 | S/A/B/R 分级和复验状态 | 把 failed suite 隐藏成 note |
| `reports/runs/<run_id>/evidence-index.md` | 从 raw artifacts and reports 推导 | EV、TC、AC、suite、artifact、report、digest、status | 静态 JSON 直接宣告 coverage |

### 7.7 门禁停审记录

| Phase / Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | skeleton/config/script boundary 是否有可执行检查 | 设计层通过 | 目标仓不存在仍是开工前 blocker |
| PH-02 | context/input accepted flow 是否绑定 AC-GOV-001 和 idempotency/tx 门禁 | 设计层通过 | 开工前复核 expected_version/result surface |
| PH-03 | Gate/Decision/Approval 是否覆盖状态和终态保护 | 设计层通过 | 开工前复核 finalized / supersede tests |
| PH-04 | policy/control/compliance/NC 是否绑定 redaction and boundary VETO | 设计层通过 | 开工前复核 body-free evidence summary |
| PH-05 | query no-write / visibility / degraded 是否作为 blocking gate | 设计层通过 | 开工前复核 visibility decision source |
| PH-06 | consumer/outbox/publisher 是否绑定 snapshot/stale/payload/retry tests | 设计层通过 | 开工前复核 affected views and payload source |
| PH-07 | operations jobs 是否绑定 duplicate replay、partial failure、no truth repair | 设计层通过 | 开工前复核 job report result surface |
| PH-08 | release evidence 是否从真实 artifact/report 推导 | 设计层通过 | 严禁静态 evidence / VETO passed |
| commit-01-a~commit-08-b | 每个 boundary 是否有提交前门禁 | 设计层通过 | 见 §7.4 |
| acceptance reports | 是否有人/Agent 审查责任 | 设计层通过 | PH-08 执行时必须记录审查结果 |

### 7.8 跨门禁覆盖 / 证据归属审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 phase 至少绑定一个测试门禁 | 通过 | PH-01~PH-08 均已绑定 |
| 每个 commit boundary 有提交前门禁 | 通过 | commit-01-a 到 commit-08-b 均已绑定 |
| 外部可见行为是否绑定 AC / VETO 风险 | 通过 | Command/Query/Event/Job/Report boundary 均有 AC/VETO |
| artifact 输出是否统一到 `artifacts/test/<run_id>` | 通过 | 所有 suite artifact 统一路径 |
| report 输出是否统一到 `reports/runs/<run_id>` and `reports/acceptance` | 通过 | PH-08 正式生成 acceptance reports |
| 是否存在 raw artifact 缺 report | 已阻断 | report-generation-audit 检查 |
| 是否存在 report / evidence 静态伪造 | 已阻断 | no static evidence guard and VETO-GOV-011 |
| redaction 是否覆盖 artifact and report | 通过 | PH-04 targeted, PH-08 full |
| dependency boundary 是否前置 | 通过 | PH-01 targeted, PH-08 full |
| P1 selected-run 是否会污染 P0 pass | 已阻断 | unavailable 只记录 residual |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §7。正式装配时可以压缩说明文字,但不得删除阶段门禁矩阵、commit boundary 门禁矩阵、证据归档规则和失败处理口径。

### 7.1 阶段门禁原则

实施过程必须把 `05-测试方案.md` 和 `06-验收标准.md` 嵌入 phase and commit boundary。任何 P0 blocking gate 失败时,不得提交当前 boundary,不得进入下一 phase,也不得把失败改写为风险接受。

门禁输出统一使用:

```text
artifacts/test/<run_id>/suites/<suite>/
reports/runs/<run_id>/
reports/acceptance/
```

`latest` 不得作为 evidence source。PH-08 之前的运行可生成 candidate artifact/report,但正式 EV、VETO checklist and acceptance handoff 只在 PH-08 从 release run artifact/report 推导。

### 7.2 Phase 门禁摘要

| Phase | 必跑门禁 | 验收关联 | 失败处理 |
|---|---|---|---|
| PH-01 | workspace/config/script/dependency checks | AC-GOV-NFR-004/005;VETO-GOV-010/013 | 修正基础设施,不得进入 PH-02 |
| PH-02 | context/input contract-domain and service-flow slice | AC-GOV-001;AC-GOV-TX/IDEMP | 修正 flow 或回写设计 |
| PH-03 | gate/decision/approval contract-domain and service-flow slice | AC-GOV-002;VETO-GOV-002/006 | 修正 state/responsibility |
| PH-04 | policy/control/compliance/NC contract-domain/service-flow and redaction targeted | AC-GOV-003/004;VETO-GOV-003~008 | redaction/truth boundary failed 不得风险接受 |
| PH-05 | query no-write, visibility, projection and API query tests | AC-GOV-005;AC-GOV-SYNC-002;VETO-GOV-009 | query 写入或泄露即阻断 |
| PH-06 | consumer, outbound, outbox publisher and topic map tests | AC-GOV-SYNC-003/004/006 | payload/source/version/stale 缺口阻断 |
| PH-07 | job contract, operations replay, entry-worker-job, handoff/export tests | AC-GOV-SYNC-005/007;AC-GOV-NFR-006 | duplicate replay or truth repair 阻断 |
| PH-08 | release-main-smoke, redaction, dependency, report audit, VETO audit | AC-GOV-EV;VETO-GOV-001~013 | 任一 blocking gate/VETO failed 不得 pass |

### 7.3 Evidence and Report Discipline

Release evidence must be generated, not declared. `evidence-index.md` must reference raw suite artifacts, suite reports, TC, AC, digest and status. `veto-checklist.md` must compute each VETO state from evidence/report/defect state. A static JSON map, hand-written pass table, or generic test count is not accepted as release evidence.

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| release run_id 命名 | 本 Step 使用 `<run_id>` 占位 | Step 12 / PH-08 执行时固定 |
| scripts 具体参数 | 已给出逻辑入口,详细 CLI 在 PH-01/PH-08 实现前由配置设计和测试方案复核 | Step 8 / Step 11 |
| formal EV 编号生成 | 只在 PH-08 从 artifact/report 推导 | Step 12 / 正式 §12 |
| P1 selected-run | 不进入 P0 pass;只记录 residual | Step 9 风险 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段门禁矩阵完整 | 通过 | PH-01~PH-08 已覆盖 |
| commit boundary 门禁矩阵完整 | 通过 | commit-01-a~commit-08-b 已覆盖 |
| 证据归档规则明确 | 通过 | artifact/report/acceptance paths 已固定 |
| 报告生成和审查责任明确 | 通过 | PH-08 必须审查 acceptance reports |
| 门禁失败处理明确 | 通过 | blocking failures 不得继续 |
| 跨门禁审计无 unresolved 冲突 | 通过 | P1 selected-run 作为 residual |
| 可进入 Step 8 | 通过 | 下一步定义配置、环境与外部依赖准备 |
