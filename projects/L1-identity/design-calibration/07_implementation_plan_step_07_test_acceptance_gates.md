# Step 7. 嵌入测试与验收门禁

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填章节: `07-实施计划.md` §7 测试与验收门禁嵌入

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 嵌入测试与验收门禁 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 6 commit boundary、正式 `05` P0 suite / TC / EV / artifact / report、正式 `06` AC / VETO / evidence audit |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 每个模块写完后局部停审;全部模块完成后做跨门禁覆盖和证据归属审计 |

## 2. 本步目标

本 Step 把 `05-测试方案.md` 和 `06-验收标准.md` 已正式定义的 suite、TC、EV、artifact/report、AC 和 VETO 嵌入 Step 6 的 phase / commit boundary。

本 Step 只回答:

- 每个 phase 和 commit boundary 提交前要跑哪些测试门禁。
- 每个门禁对应哪些正式 suite / check / TC / EV / AC / VETO。
- 每个门禁要产出哪些 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。
- 哪些 `reports/acceptance/*` 只是送验初稿,必须后续审查补充。
- 门禁失败是否允许继续进入下一 phase / boundary。
- 是否存在 boundary 有测试但无证据归属、或有验收风险但无测试门禁的问题。

本 Step 不新增 `TC-ID-*`、`EV-ID-*`、`AC-*`、`VETO-ID-*`,不定义 raw artifact JSON 新字段,不实现 gate 脚本,不裁决真实验收结果。`GATE-xx` 只作为实施计划中的门禁编号,必须绑定已有 suite / check / TC / EV / AC / VETO。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | 提供 PH-01~PH-08 和 22 个 commit boundary |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供正式 P0 suite、TC、EV、artifact/report root、失败证据和 defect/retest 规则 |
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 `TC-ID-*` 用例族和测试切口 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 提供 suite、gate/check/report 脚本、artifact/report 输出方向 |
| `05_test_plan_step_12_entry_exit.md` | 已审核通过 | 提供 P0 进入 / 退出、blocking suite 和失败处理 |
| `05_test_plan_step_13_evidence.md` | 已审核通过 | 提供正式 `EV-ID-*`、artifact/report 结构、digest、evidence index 和 no-static evidence 规则 |
| `06-验收标准.md` | 已审核通过 | 提供功能、边界、同步、状态事务、证据和 VETO 裁决入口 |
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | 提供 `AC-FUNC-001~005` |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供 `AC-BOUNDARY-001~008` |
| `06_acceptance_step_07_interface_sync_gate.md` | 已审核通过 | 提供 `AC-SYNC-001~008` |
| `06_acceptance_step_08_state_tx_consistency.md` | 已审核通过 | 提供 `AC-STATE-*`、`AC-TX-*`、`AC-IDEM-*`、`AC-CONC-*` |
| `06_acceptance_step_10_evidence_audit.md` | 已审核通过 | 提供 `AC-EV-001~012` 和 evidence completeness 审计 |
| `06_acceptance_step_11_blockers.md` | 已审核通过 | 提供 `VETO-ID-001~006` 触发、证据和裁决 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 7 规则与 GATE 编号 | 固定实施门禁编号、证据路径、失败处理和不新增测试规则 | SOP Step 7、书写规范、`05` §9/§13、`06` evidence/VETO | GATE 编号表、路径规则、失败处理规则 | 每个 GATE 必须绑定已有 suite/check/TC/EV/AC/VETO |
| M2 Phase 门禁矩阵 | 把 PH-01~PH-08 绑定到阶段级门禁 | Step 6 phase、`05` suite、`06` AC/VETO | phase gate matrix | 每个 phase 至少一个测试/验收/证据门禁 |
| M3 Foundation boundary 门禁 | 写 commit-01-a 到 commit-03-c 的门禁 | Step 6 PH-01~PH-03 | commit gate matrix foundation | 不把业务 command/query 测试提前到 foundation |
| M4 Command boundary 门禁 | 写 commit-04-a~c 的 command 门禁 | Step 6 PH-04、`TC-ID-CMD-*` | command gate matrix | accepted UoW、duplicate replay、redaction 和 VETO 风险闭合 |
| M5 Query boundary 门禁 | 写 commit-05-a~c 的 query/no-write 门禁 | Step 6 PH-05、`TC-ID-QUERY-*` | query gate matrix | query no-write / visibility / degraded 不缺证据 |
| M6 Consumer/outbound boundary 门禁 | 写 commit-06-a~c 的 consumer/outbox 门禁 | Step 6 PH-06、`TC-ID-CONSUMER-*`、`TC-ID-OUTBOX-*` | consumer/outbox gate matrix | no implicit create、receipt replay、body-free outbox 闭合 |
| M7 Job/propagation boundary 门禁 | 写 commit-07-a~c 的 job 门禁 | Step 6 PH-07、`TC-ID-JOB-*`、`TC-ID-IDEMP-*` | job gate matrix | job report replay、no truth repair、terminal retry guard 闭合 |
| M8 Entry/config/evidence boundary 门禁 | 写 commit-08-a~c 的 entry/config/report/release 门禁 | Step 6 PH-08、`05` evidence、`06` acceptance | entry/evidence gate matrix | report/evidence 必须 run-scoped,不得静态 pass |
| M9 跨门禁覆盖与停审 | 审计 TC/EV/AC/VETO/report 覆盖和进入 Step 8 条件 | M1~M8 | 跨门禁审计、回填草稿、待确认事项 | 无 unresolved gate/evidence/report 归属冲突 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | 门禁编号只能是实施计划内部索引,不能冒充测试方案新增 suite 或 TC | §8.1~§8.4 | 通过 |
| M2 | phase gate 必须覆盖阶段能力,但 commit gate 才是提交前硬门禁 | §8.5 | 通过 |
| M3 | foundation 主要验证 dependency、contracts/domain、port/fake/replay,不提前验业务 flow | §8.6 | 通过 |
| M4 | command gate 需要覆盖 accepted/rejected/duplicate/conflict、同 UoW 和 forbidden body | §8.7 | 通过 |
| M5 | query gate 重点是 visibility-first、no-write、missing/degraded/stale/read-only | §8.8 | 通过 |
| M6 | consumer/outbound gate 重点是 receipt replay、missing target no-create、accepted-only outbox | §8.9 | 通过 |
| M7 | job gate 重点是 stored report replay、report-only maintenance、propagation state guard | §8.10 | 通过 |
| M8 | entry/config/evidence gate 重点是 entry facade、strict config、artifact/report pairing 和 final handoff | §8.11 | 通过 |
| M9 | 覆盖审计必须证明无 orphan EV、无 boundary 缺门禁、无 VETO 缺证据 | §8.12~§8.15 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个阶段应执行哪些测试用例或测试切口? | 见 §8.5 phase 门禁矩阵。PH-01 绑定 dependency boundary,PH-02 绑定 contract/domain/state,PH-03 绑定 fake/replay,PH-04 绑定 command,PH-05 绑定 query,PH-06 绑定 consumer/outbox,PH-07 绑定 job/operations replay,PH-08 绑定 entry/config/report/release。 |
| 哪些阶段必须对齐验收标准 AC 项? | 所有 PH 都必须对齐至少一个 `AC-*`。涉及外部可见行为、状态、跨仓协作或证据的 PH 额外绑定 `AC-SYNC-*`、`AC-STATE-*`、`AC-TX-*`、`AC-EV-*` 和 `VETO-ID-*`。 |
| 每个门禁需要产出什么证据? | 每个 GATE 产出 `artifacts/test/<run_id>/suites/<suite>/` raw artifact 和 `reports/runs/<run_id>/...` human report。最终 acceptance 初稿进入 `reports/acceptance/*`,但必须审查补充。 |
| 门禁失败是否允许继续进入下一阶段? | P0 blocking GATE 失败不得进入下一 phase 或提交当前 commit boundary。失败 suite 必须保留 failed/partial artifact 和 safe failure reason,不得删除或改写为 pass。 |
| 哪些门禁可以自动化,哪些需要人工审查? | P0 suite/check 均应自动化。`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 和 review notes 需要人 / Agent 审查补充,不能替代 raw artifact。 |
| 哪些验收一票否决项需要提前规避? | `VETO-ID-001~006` 均在 boundary 阶段提前挂接:ref reuse、implicit create、forbidden material、high-risk basis missing、job repair adjacent truth、dependency loop。 |
| 每个阶段应调用哪些 `scripts/gates/*.sh`? | `run_ci_gate.sh` 用于 PR/main/nightly suite;`run_release_gate.sh` 用于 release;`run_selected_p1_gate.sh` 不属于 P0 完成判定。具体脚本方向见 §8.2。 |
| 每个阶段会输出哪些 `artifacts/test/<run_id>/...`? | 统一输出到 `artifacts/test/<run_id>/suites/<suite>/`,并包含 raw report、case JSON、stdout/stderr 和安全 artifact。 |
| 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>`? | 需要产生 suite/report/evidence 的所有阶段都依赖 report generation。PH-08-b/c 正式验证 report writer、evidence index 和 acceptance handoff。 |
| 哪些阶段需要生成或更新 `reports/acceptance/*`? | 只有 PH-08-c。前序 phase 只产生 run-scoped reports,不得提前写最终验收结论。 |
| 哪些报告必须由人或 Agent 审查补充后才能进入验收? | `reports/acceptance/*` 和 `reports/review/*` 必须审查补充。run-scoped suite report 和 evidence index 必须从 raw artifact 推导。 |
| 每个 commit boundary 提交前应执行哪些测试、生成哪些 artifact / report、覆盖哪些 AC / VETO 风险? | 见 §8.6~§8.11 的 22 个 commit boundary 门禁矩阵。 |
| 是否存在阶段有门禁但 boundary 无提交前门禁,或 boundary 有测试但没有证据归属? | 未发现。每个 boundary 都绑定至少一个 GATE、TC/EV、artifact/report 和 AC/VETO 风险。 |
| 每个 phase / commit boundary 的门禁完成后是否通过停审? | 见 §8.13。当前为设计阶段停审通过;实现时需用真实 run artifact 二次校验。 |
| 所有门禁完成后,测试重复、证据缺失、验收覆盖缺口和 report 审查责任是否通过审计? | 见 §8.12。重复属于刻意防线,无缺失门禁;report 审查责任集中在 PH-08-c。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | commit boundary 只有门禁方向,没有正式 GATE 编号和 TC/EV/AC/VETO 映射 | 本 Step 固定 `GATE-01~12`,并逐 boundary 绑定 |
| `05` §9 | suite/check/report 脚本已定义,但不按实施 boundary 展开 | 本 Step 把 suite/check 嵌入 PH 和 commit boundary |
| `05` §13 | EV 与 artifact/report 归档已定义,但实施提交前证据归属未列 | 本 Step 为每个 boundary 写 artifact/report path 和 EV |
| `06` | AC/VETO 按验收章节组织,未嵌入提交节奏 | 本 Step 为每个 boundary 挂接相关 AC/VETO 风险 |
| report audit | `EV-ID-REPORT-001` 容易被误写成 report-only TC | 本 Step 明确只绑定已有 blocking suite case refs,不新增 TC |
| acceptance handoff | 容易在脚本阶段静态声明通过 | 本 Step 明确 `reports/acceptance/*` 只是初稿 + 审查补充 |

## 7. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| GATE 编号是否写入 `05` | A. 写成测试方案新 gate;B. 作为实施计划门禁索引 | 采用 B。`05` 已定义 suite/check,本 Step 只做实施嵌入。 |
| 是否每个 boundary 都跑 release gate | A. 每次跑 release;B. boundary 跑相关 suite,PH-08-c 跑 release | 采用 B。release smoke 必须基于完整闭环,前序 boundary 用 targeted suite 验证。 |
| report audit 是否新增 TC | A. 新增 report TC;B. 绑定已有 blocking suite case refs | 采用 B。`EV-ID-REPORT-001` 已正式规定不得新增 report-only TC。 |
| acceptance report 是否可自动判 pass | A. 可以;B. 只能生成初稿并审查补充 | 采用 B。验收裁决属于 `06`,实施阶段不能静态造证据。 |
| query / job no-write 是否只靠 code review | A. 只 review;B. 必须有 write-audit / operations replay evidence | 采用 B。`VETO-ID-002/005` 和 `AC-BOUNDARY-004/006` 需要可复查证据。 |
| dependency / redaction 是否只在 release 跑 | A. 只 release;B. 相关 boundary 提交前也跑对应 gate | 采用 B。dependency 和 forbidden material 是一票否决风险,必须提前阻断。 |

## 8. 结构化中间产物

### 8.1 Step 7 门禁规则

| 规则 | 说明 | 失败处理 |
|---|---|---|
| `GATE-xx` 是实施门禁编号 | `GATE-xx` 只在 `07` 中用于绑定 boundary 与已有 suite/check/TC/EV/AC/VETO | 不得把 `GATE-xx` 回写成新测试用例或新证据族 |
| 每个 boundary 至少一个 blocking gate | 无法绑定时必须说明该 boundary 只允许文档 / 非代码变更;本 Step 当前无此例外 | 暂停并回 Step 6/7 重审 boundary |
| artifact 必须 run-scoped | 所有 raw artifact 使用 `artifacts/test/<run_id>/...` | 使用 `latest` 或静态路径则门禁失败 |
| report 必须 run-scoped | 所有 run report 使用 `reports/runs/<run_id>/...` | report 缺失或未从 artifact 推导则门禁失败 |
| acceptance 只能是初稿 + 审查补充 | `reports/acceptance/*` 不得替代 suite artifact / run report | 未审查补充不得宣称送验完整 |
| failed / partial artifact 必须保留 | failure reason 只能是 safe ref 或安全摘要 | 删除失败证据或改写 pass 视为 evidence integrity failure |
| redaction / dependency 是提前阻断门禁 | 触及 body/log/report/dependency 的 boundary 必须挂接相关 GATE | 失败进入 `VETO-ID-003/006` 或 S 级缺陷处理 |
| no-write / no-repair 必须有证据 | query、consumer missing、job/report-only 必须有 write-audit 或 replay evidence | 失败进入 `VETO-ID-002/005` 或状态事务不通过 |

### 8.2 GATE 编号目录

| GATE | 名称 | 正式 suite / check | 主要 TC | 主要 EV | 主要 report | 主要 AC / VETO |
|---|---|---|---|---|---|---|
| `GATE-01` | Dependency boundary gate | `dependency-boundary`;`check_dependency_boundary.sh` | `TC-ID-ARCH-001` | `EV-ID-ARCH-001` | `reports/runs/<run_id>/dependency-boundary.md` | `AC-BOUNDARY-003`;`AC-SYNC-007`;`VETO-ID-006` |
| `GATE-02` | Contract/domain/state gate | `contract-domain-fast` | `TC-ID-CONTRACT-001~004`;`TC-ID-DOMAIN-001~006`;`TC-ID-STATE-001~002` | `EV-ID-CONTRACT-001`;`EV-ID-STATE-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-BOUNDARY-001/002`;`AC-STATE-001/002/003`;`AC-SYNC-008`;`VETO-ID-001/003/004` |
| `GATE-03` | Infra runtime fake and replay gate | `infra-runtime-fake` | `TC-ID-IDEMP-001~011`;`TC-ID-CONFIG-001~004` | `EV-ID-IDEMP-001`;`EV-ID-CONFIG-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` | `AC-IDEM-001~003`;`AC-CONC-001~003`;`AC-SYNC-007` |
| `GATE-04` | Command service flow gate | `service-flow-fast` command subset | `TC-ID-CMD-001~015`;related `TC-ID-IDEMP-*` | `EV-ID-CMD-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `AC-FUNC-001~004`;`AC-SYNC-001`;`AC-TX-001`;`VETO-ID-001/003/004` |
| `GATE-05` | Query no-write gate | `service-flow-fast` query subset | `TC-ID-QUERY-001~015`;`TC-ID-STATE-001` | `EV-ID-QUERY-001`;`EV-ID-STATE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `AC-SYNC-002`;`AC-BOUNDARY-004`;`AC-TX-004`;`VETO-ID-002` |
| `GATE-06` | Consumer / callback gate | `entry-worker-job` consumer subset | `TC-ID-CONSUMER-001~006`;related `TC-ID-IDEMP-*` | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-SYNC-003`;`AC-BOUNDARY-005`;`AC-TX-002`;`VETO-ID-002/003` |
| `GATE-07` | Outbox / propagation gate | `operations-replay-core` outbox / propagation subset | `TC-ID-OUTBOX-001~010`;`TC-ID-JOB-004~005`;related `TC-ID-IDEMP-*` | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `AC-SYNC-004/006`;`AC-BOUNDARY-007`;`AC-STATE-003`;`VETO-ID-003/005` |
| `GATE-08` | Operations job gate | `operations-replay-core`;`entry-worker-job` job subset | `TC-ID-JOB-001~008`;related `TC-ID-IDEMP-*` | `EV-ID-JOB-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-SYNC-005`;`AC-BOUNDARY-006`;`AC-TX-003`;`VETO-ID-002/005` |
| `GATE-09` | Config redline gate | `config-redline` | `TC-ID-CONFIG-001~004` | `EV-ID-CONFIG-001` | `reports/runs/<run_id>/suites/config-redline.md` | `AC-SYNC-007`;`AC-BOUNDARY-003/008`;`VETO-ID-006` |
| `GATE-10` | Redaction boundary gate | `redaction-boundary`;`check_redaction.sh` | `TC-ID-CONTRACT-004`;`TC-ID-CMD-010`;`TC-ID-REDACTION-001~003` | `EV-ID-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | `AC-BOUNDARY-002`;`AC-EV-007`;`VETO-ID-003` |
| `GATE-11` | Report generation audit gate | `report-generation-audit`;pairing/static checks | existing blocking suite case refs only | `EV-ID-REPORT-001` | `reports/runs/<run_id>/report-audit.md`;`reports/runs/<run_id>/evidence-index.md` | `AC-EV-005/006/009/010/011`;all `VETO-ID-*` evidence integrity |
| `GATE-12` | Release main smoke and handoff gate | `release-main-smoke`;release checks | representative blocking TC refs | `EV-ID-CORE-001`;`EV-ID-NFR-001`;all P0 EV by evidence index | `reports/runs/<run_id>/gate-summary.md`;`reports/acceptance/handoff.md`;`reports/acceptance/veto-checklist.md` | `AC-FUNC-001~005`;`AC-BOUNDARY-008`;`AC-EV-*`;`VETO-ID-001~006` |

### 8.3 Artifact / report 输出规则

| 输出 | 路径 | 生成来源 | 适用 GATE |
|---|---|---|---|
| suite raw artifact | `artifacts/test/<run_id>/suites/<suite>/` | gate / suite execution | `GATE-01~12` |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | `scripts/reports/generate_reports.sh` | suite 型 GATE |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | `scripts/checks/check_redaction.sh` | `GATE-10` |
| dependency report | `reports/runs/<run_id>/dependency-boundary.md` | `scripts/checks/check_dependency_boundary.sh` | `GATE-01` |
| report audit | `reports/runs/<run_id>/report-audit.md` | pairing / no-static checks | `GATE-11` |
| evidence index | `reports/runs/<run_id>/evidence-index.md`;`artifacts/test/<run_id>/evidence-index.json` | raw artifact + generated report | `GATE-11`;`GATE-12` |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | release / CI gate summary | `GATE-12` |
| acceptance handoff | `reports/acceptance/handoff.md` | script draft + review supplement | `GATE-12` |
| veto checklist | `reports/acceptance/veto-checklist.md` | evidence index + review supplement | `GATE-12` |

### 8.4 GATE 失败处理规则

| 失败类型 | 处理 |
|---|---|
| suite failed / partial / timeout | 当前 boundary 不得提交;保留 raw artifact、stdout/stderr、safe failure reason 和已执行 case JSON |
| report 缺失或无法从 raw artifact 推导 | 当前 boundary 不得提交;触发 `GATE-11` 失败口径 |
| redaction failure | 当前 boundary 不得提交;若属于 forbidden material 泄漏,进入 `VETO-ID-003` 风险 |
| dependency boundary failure | 当前 boundary 不得提交;进入 `VETO-ID-006` 风险 |
| no-write / no-repair 证据失败 | 当前 boundary 不得提交;按 `VETO-ID-002/005` 或 `AC-TX-*` 失败处理 |
| duplicate replay 重跑 mutation | 当前 boundary 不得提交;按 `AC-IDEM-*` 失败处理,若导致 ref reuse / implicit create / repair truth 则进入对应 VETO |
| acceptance 初稿未审查补充 | 不得宣称送验完整;PH-08-c 不得完成 |

### 8.5 Phase 门禁矩阵

| Phase | 阶段能力 | 阶段 blocking GATE | 主要 TC / EV | 主要 AC / VETO | 进入下一 phase 条件 |
|---|---|---|---|---|---|
| PH-01 | Workspace / dependency / skeleton | `GATE-01` | `TC-ID-ARCH-001`;`EV-ID-ARCH-001` | `AC-BOUNDARY-003`;`AC-SYNC-007`;`VETO-ID-006` | workspace 可编译且 dependency report clean |
| PH-02 | Contracts / domain / state foundation | `GATE-02`;必要时 `GATE-10` | `TC-ID-CONTRACT-*`;`TC-ID-DOMAIN-*`;`TC-ID-STATE-*`;`EV-ID-CONTRACT-001`;`EV-ID-STATE-001`;`EV-ID-REDACTION-001` | `AC-FUNC-001~004`;`AC-BOUNDARY-001/002`;`AC-STATE-*`;`VETO-ID-001/003/004` | contracts/domain/state suite 通过,body-free scan clean |
| PH-03 | Application ports / fake runtime / replay foundation | `GATE-03`;必要时 `GATE-01/09` | `TC-ID-IDEMP-*`;`TC-ID-CONFIG-*`;`EV-ID-IDEMP-001`;`EV-ID-CONFIG-001` | `AC-IDEM-*`;`AC-CONC-*`;`AC-SYNC-007` | fake parity、stored replay、config/fake foundation 通过 |
| PH-04 | Command write path | `GATE-04`;`GATE-10`;必要时 `GATE-03` | `TC-ID-CMD-*`;related `TC-ID-IDEMP-*`;`EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`EV-ID-REDACTION-001` | `AC-FUNC-001~004`;`AC-SYNC-001`;`AC-TX-001`;`VETO-ID-001/003/004` | command accepted/rejected/duplicate/conflict 和 redaction 通过 |
| PH-05 | Query / read model / visibility | `GATE-05`;必要时 `GATE-10` | `TC-ID-QUERY-*`;`EV-ID-QUERY-001` | `AC-SYNC-002`;`AC-BOUNDARY-004`;`AC-TX-004`;`VETO-ID-002` | query no-write、visibility、missing/degraded/stale 通过 |
| PH-06 | Inbound / callback / outbound material | `GATE-06`;`GATE-07`;`GATE-10` | `TC-ID-CONSUMER-*`;`TC-ID-OUTBOX-*`;`EV-ID-CONSUMER-001`;`EV-ID-OUTBOX-001`;`EV-ID-REDACTION-001` | `AC-SYNC-003/004`;`AC-BOUNDARY-005/007`;`VETO-ID-002/003` | consumer no-create、receipt replay、accepted-only material 通过 |
| PH-07 | Operations job / propagation / maintenance | `GATE-08`;`GATE-07`;必要时 `GATE-11` | `TC-ID-JOB-*`;`TC-ID-OUTBOX-009~010`;`TC-ID-IDEMP-*`;`EV-ID-JOB-001`;`EV-ID-OUTBOX-001`;`EV-ID-IDEMP-001` | `AC-SYNC-004~006`;`AC-BOUNDARY-006/007`;`AC-TX-003`;`VETO-ID-002/005` | job report replay、maintenance no-repair、propagation terminal guard 通过 |
| PH-08 | Entry / config / scripts / evidence / release | `GATE-09`;`GATE-01`;`GATE-10`;`GATE-11`;`GATE-12` | all P0 TC refs by evidence index;all P0 EV | `AC-FUNC-*`;`AC-BOUNDARY-*`;`AC-EV-*`;`VETO-ID-001~006` | final evidence index、report audit、release smoke、acceptance handoff 审查通过 |

### 8.6 Foundation commit boundary 门禁矩阵

| Commit boundary | 提交前 GATE | Suite / check | TC refs | EV refs | Report path | AC / VETO | 失败处理 |
|---|---|---|---|---|---|---|---|
| commit-01-a | `GATE-01` | `dependency-boundary`;workspace compile direction | `TC-ID-ARCH-001` | `EV-ID-ARCH-001` | `reports/runs/<run_id>/dependency-boundary.md` | `AC-BOUNDARY-003`;`AC-SYNC-007`;`VETO-ID-006` | dependency report 不 clean 或 workspace 不编译则不得提交 |
| commit-02-a | `GATE-02`;`GATE-10` | `contract-domain-fast`;`redaction-boundary` | `TC-ID-CONTRACT-001~004`;`TC-ID-REDACTION-001~003` | `EV-ID-CONTRACT-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-BOUNDARY-001/002`;`AC-SYNC-008`;`VETO-ID-003` | DTO/schema/body-free 失败则不得提交 |
| commit-02-b | `GATE-02` | `contract-domain-fast` domain/state subset | `TC-ID-DOMAIN-001~006`;`TC-ID-STATE-001~002` | `EV-ID-STATE-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-FUNC-001/002/003/004`;`AC-STATE-001`;`VETO-ID-001/004` | invariant 或状态非法 accepted 则不得提交 |
| commit-02-c | `GATE-02`;必要时 `GATE-10` | `contract-domain-fast` support state subset | `TC-ID-STATE-001~002`;related `TC-ID-OUTBOX-*`;related `TC-ID-JOB-*` | `EV-ID-STATE-001`;`EV-ID-OUTBOX-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-STATE-002/003`;`AC-BOUNDARY-007`;`AC-SYNC-008` | support state 名称或 terminal guard 漂移则不得提交 |
| commit-03-a | `GATE-03`;必要时 `GATE-02` | `infra-runtime-fake`;`contract-domain-fast` metadata subset | `TC-ID-IDEMP-001`;`TC-ID-CONTRACT-002`;related `TC-ID-CONFIG-*` | `EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001`;`EV-ID-CONFIG-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | `AC-IDEM-002`;`AC-CONC-001`;`AC-SYNC-001/003/005` | context/key/cursor source 漂移则不得提交 |
| commit-03-b | `GATE-03`;`GATE-09` if config binding touched | `infra-runtime-fake`;`config-redline` | `TC-ID-IDEMP-008~011`;`TC-ID-CONFIG-001~004` | `EV-ID-IDEMP-001`;`EV-ID-CONFIG-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/config-redline.md` | `AC-CONC-003`;`AC-SYNC-007`;`AC-BOUNDARY-003` | fake private shortcut、disabled fake success 或 config fallback 则不得提交 |
| commit-03-c | `GATE-03` | `infra-runtime-fake` replay subset | `TC-ID-IDEMP-001~011`;related duplicate command/consumer/job cases | `EV-ID-IDEMP-001`;`EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` | `AC-IDEM-001~003`;`AC-CONC-003`;`VETO-ID-001/002/005` risk | duplicate 重跑 mutation 或 stored missing 后重算则不得提交 |

### 8.7 Command commit boundary 门禁矩阵

| Commit boundary | 提交前 GATE | Suite / check | TC refs | EV refs | Report path | AC / VETO | 失败处理 |
|---|---|---|---|---|---|---|---|
| commit-04-a | `GATE-04`;`GATE-03` subset | `service-flow-fast`;`infra-runtime-fake` idempotency subset | `TC-ID-CMD-001~004`;`TC-ID-CMD-013~015`;related `TC-ID-IDEMP-*` | `EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`EV-ID-STATE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | `AC-FUNC-001/002`;`AC-SYNC-001`;`AC-TX-001`;`VETO-ID-001/004` | accepted 同 UoW、ref reuse、高风险 basis 或 duplicate replay 失败则不得提交 |
| commit-04-b | `GATE-04`;`GATE-10` | `service-flow-fast`;`redaction-boundary` | `TC-ID-CMD-005~010`;`TC-ID-REDACTION-001~003`;related `TC-ID-IDEMP-*` | `EV-ID-CMD-001`;`EV-ID-REDACTION-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-FUNC-003/004`;`AC-BOUNDARY-002`;`AC-TX-001`;`VETO-ID-003` | external body 泄漏、append-only 失败或 source unavailable 污染摘要则不得提交 |
| commit-04-c | `GATE-04`;`GATE-10`;`GATE-03` subset | `service-flow-fast`;`redaction-boundary`;idempotency subset | `TC-ID-CMD-011~015`;related `TC-ID-IDEMP-*` | `EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-FUNC-004`;`AC-SYNC-006`;`AC-TX-001`;`VETO-ID-003` risk | empty trace accepted、command 直接 delivery、stored result 缺失或 handoff body 泄漏则不得提交 |

### 8.8 Query commit boundary 门禁矩阵

| Commit boundary | 提交前 GATE | Suite / check | TC refs | EV refs | Report path | AC / VETO | 失败处理 |
|---|---|---|---|---|---|---|---|
| commit-05-a | `GATE-05`;`GATE-03` subset | `service-flow-fast` query foundation;write-audit | `TC-ID-QUERY-015`;related `TC-ID-STATE-001`;related fake lookup cases | `EV-ID-QUERY-001`;`EV-ID-STATE-001`;`EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;write-audit artifact | `AC-SYNC-002`;`AC-BOUNDARY-004`;`AC-TX-004`;`VETO-ID-002` | query 写 UoW、拼 view ref、refresh/rebuild on read 或 visibility leak 则不得提交 |
| commit-05-b | `GATE-05`;必要时 `GATE-10` | `service-flow-fast` core read subset | `TC-ID-QUERY-001~011`;`TC-ID-QUERY-015` | `EV-ID-QUERY-001`;`EV-ID-REDACTION-001` if output/log touched | `reports/runs/<run_id>/suites/service-flow-fast.md`;optional `reports/runs/<run_id>/redaction-check.md` | `AC-FUNC-001/005`;`AC-SYNC-002`;`AC-EV-002`;`VETO-ID-002` | missing/not-visible 泄漏 existence、trace/audit raw body 泄漏或 query write 则不得提交 |
| commit-05-c | `GATE-05`;`GATE-07/08` read-state subset if operations views touched | `service-flow-fast` operations read subset;write-audit | `TC-ID-QUERY-009~015`;related `TC-ID-JOB-*`;related `TC-ID-OUTBOX-*` | `EV-ID-QUERY-001`;`EV-ID-JOB-001`;`EV-ID-OUTBOX-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;related operations report | `AC-FUNC-005`;`AC-STATE-002`;`AC-BOUNDARY-004`;`VETO-ID-002` | operations read 触发 publish/deliver/retry/rebuild/refresh 或隐藏 degraded priority 则不得提交 |

### 8.9 Consumer / outbound commit boundary 门禁矩阵

| Commit boundary | 提交前 GATE | Suite / check | TC refs | EV refs | Report path | AC / VETO | 失败处理 |
|---|---|---|---|---|---|---|---|
| commit-06-a | `GATE-06`;`GATE-03` subset | `entry-worker-job` scaffold;`infra-runtime-fake` receipt replay | `TC-ID-CONSUMER-006`;`TC-ID-IDEMP-003`;related `TC-ID-CONTRACT-003` | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | `AC-SYNC-003`;`AC-TX-002`;`AC-IDEM-001`;`VETO-ID-002` risk | unsupported schema parse payload、receipt 未 typed replay 或 context/channel 漂移则不得提交 |
| commit-06-b | `GATE-06`;`GATE-10`;`GATE-03` subset | `entry-worker-job`;`redaction-boundary`;receipt replay | `TC-ID-CONSUMER-001~006`;related `TC-ID-IDEMP-*`;related `TC-ID-REDACTION-*` | `EV-ID-CONSUMER-001`;`EV-ID-IDEMP-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-FUNC-003/004`;`AC-SYNC-003/006`;`AC-BOUNDARY-005`;`AC-TX-002`;`VETO-ID-002/003` | missing target 隐式创建、duplicate 重 parse/write、external body 泄漏或 receipt 缺失则不得提交 |
| commit-06-c | `GATE-07`;`GATE-10` | `operations-replay-core` material subset;`redaction-boundary` | `TC-ID-OUTBOX-001~008`;related `TC-ID-REDACTION-*` | `EV-ID-OUTBOX-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-SYNC-004`;`AC-BOUNDARY-007`;`AC-EV-004`;`VETO-ID-003` | rejected/query/retry-only 产生 accepted material、payload body 泄漏或 marker/topic 不闭合则不得提交 |

### 8.10 Job / propagation commit boundary 门禁矩阵

| Commit boundary | 提交前 GATE | Suite / check | TC refs | EV refs | Report path | AC / VETO | 失败处理 |
|---|---|---|---|---|---|---|---|
| commit-07-a | `GATE-08`;`GATE-03` subset | `operations-replay-core` job scaffold;`entry-worker-job` job entry subset | `TC-ID-JOB-006~008`;`TC-ID-IDEMP-004`;related `TC-ID-CONTRACT-*` | `EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`EV-ID-CONTRACT-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-SYNC-005`;`AC-TX-003`;`AC-IDEM-001`;`VETO-ID-002/005` risk | duplicate job 重扫、report 不可 replay、runner 绕过 facade 或 report 缺 item refs 则不得提交 |
| commit-07-b | `GATE-08`;`GATE-05` no-repair audit | `operations-replay-core` maintenance subset;write-audit | `TC-ID-JOB-001~003`;`TC-ID-JOB-008`;related `TC-ID-IDEMP-*`;related `TC-ID-QUERY-*` | `EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`EV-ID-QUERY-001`;`EV-ID-NFR-001` if degraded sample touched | `reports/runs/<run_id>/suites/operations-replay-core.md` | `AC-FUNC-005`;`AC-BOUNDARY-006`;`AC-STATE-002`;`AC-TX-003`;`VETO-ID-002/005` | rebuild/refresh/reconcile 修 business truth、duplicate rerun、last good snapshot 丢失或 report-only 失败则不得提交 |
| commit-07-c | `GATE-07`;`GATE-08`;`GATE-10` if payload/report touched | `operations-replay-core` propagation subset;redaction if needed | `TC-ID-OUTBOX-009~010`;`TC-ID-JOB-004~005`;related `TC-ID-IDEMP-*`;related `TC-ID-REDACTION-*` | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`EV-ID-IDEMP-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;optional `reports/runs/<run_id>/redaction-check.md` | `AC-SYNC-004/005/006`;`AC-BOUNDARY-007`;`AC-STATE-003`;`VETO-ID-003/005` | Published/Delivered 语义错误、terminal retry、failure 回滚 accepted truth 或 adapter body 泄漏则不得提交 |

### 8.11 Entry / config / evidence commit boundary 门禁矩阵

| Commit boundary | 提交前 GATE | Suite / check | TC refs | EV refs | Report path | AC / VETO | 失败处理 |
|---|---|---|---|---|---|---|---|
| commit-08-a | `GATE-09`;`GATE-01`;`GATE-06/08` entry subset | `config-redline`;`dependency-boundary`;`entry-worker-job` | `TC-ID-CONFIG-001~004`;`TC-ID-ARCH-001`;related `TC-ID-CONSUMER-*`;related `TC-ID-JOB-*` | `EV-ID-CONFIG-001`;`EV-ID-ARCH-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/config-redline.md`;`reports/runs/<run_id>/dependency-boundary.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | `AC-SYNC-005/007`;`AC-BOUNDARY-003/008`;`VETO-ID-006` | entry 直连 repo、disabled adapter fake success、config fallback 或 dependency loop 则不得提交 |
| commit-08-b | `GATE-11`;`GATE-10` | `report-generation-audit`;pairing/static checks;redaction report scan | existing blocking suite case refs only;`TC-ID-REDACTION-*` if report output touched | `EV-ID-REPORT-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/report-audit.md`;`reports/runs/<run_id>/evidence-index.md`;`reports/runs/<run_id>/redaction-check.md` | `AC-EV-005/006/007/009`;`AC-BOUNDARY-008`;all `VETO-ID-*` evidence integrity | raw artifact/report pairing 缺失、static evidence pass、orphan EV/TC/AC/VETO 或 report 泄漏则不得提交 |
| commit-08-c | `GATE-12`;`GATE-11`;`GATE-10`;`GATE-01`;`GATE-09` | `release-main-smoke`;all P0 release checks | all P0 blocking TC refs by evidence index;representative release smoke refs | `EV-ID-CORE-001`;`EV-ID-NFR-001`;all P0 `EV-ID-*` | `reports/runs/<run_id>/gate-summary.md`;`reports/runs/<run_id>/evidence-index.md`;`reports/acceptance/handoff.md`;`reports/acceptance/veto-checklist.md` | `AC-FUNC-001~005`;`AC-BOUNDARY-001~008`;`AC-EV-001~012`;`VETO-ID-001~006` | 任一 P0 gate fail、VETO coverage 缺失、handoff 未审查、P1/P2 污染 P0 或 static pass 则不得完成 |

### 8.12 跨门禁覆盖 / 证据归属审计表

| 审计项 | 结论 | 证据 / 说明 |
|---|---|---|
| 是否每个 phase 至少一个 gate | 通过 | PH-01~PH-08 均在 §8.5 绑定 |
| 是否每个 commit boundary 有提交前 gate | 通过 | 22 个 boundary 均在 §8.6~§8.11 绑定 |
| 是否所有 P0 suite 都被使用 | 通过 | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`report-generation-audit`、`release-main-smoke` 均已绑定 |
| 是否覆盖 `TC-ID-CONTRACT-*` | 通过 | `GATE-02`;commit-02-a |
| 是否覆盖 `TC-ID-DOMAIN-*` / `TC-ID-STATE-*` | 通过 | `GATE-02`;commit-02-b/c |
| 是否覆盖 `TC-ID-CMD-*` | 通过 | `GATE-04`;commit-04-a/b/c |
| 是否覆盖 `TC-ID-QUERY-*` | 通过 | `GATE-05`;commit-05-a/b/c |
| 是否覆盖 `TC-ID-CONSUMER-*` | 通过 | `GATE-06`;commit-06-a/b |
| 是否覆盖 `TC-ID-OUTBOX-*` | 通过 | `GATE-07`;commit-06-c / commit-07-c |
| 是否覆盖 `TC-ID-JOB-*` | 通过 | `GATE-08`;commit-07-a/b/c |
| 是否覆盖 `TC-ID-IDEMP-*` | 通过 | `GATE-03`;`GATE-04/06/07/08` related subsets |
| 是否覆盖 `TC-ID-CONFIG-*` | 通过 | `GATE-09`;commit-08-a |
| 是否覆盖 `TC-ID-REDACTION-*` | 通过 | `GATE-10`;commit-02-a / 04-b / 06-b / 08-b |
| 是否覆盖 `TC-ID-ARCH-001` | 通过 | `GATE-01`;commit-01-a / 08-a |
| 是否覆盖全部正式 EV | 通过 | `EV-ID-CORE/CONTRACT/STATE/CMD/QUERY/CONSUMER/OUTBOX/JOB/IDEMP/CONFIG/REDACTION/ARCH/NFR/REPORT-001` 均在 GATE 目录或 release evidence index 中出现 |
| 是否覆盖 `AC-FUNC-001~005` | 通过 | PH-04/05/06/07/08 和 `GATE-12` 覆盖 |
| 是否覆盖 `AC-BOUNDARY-001~008` | 通过 | `GATE-01/02/05/06/07/08/11/12` 覆盖 |
| 是否覆盖 `AC-SYNC-001~008` | 通过 | command/query/consumer/outbox/job/handoff/dependency/protocol GATE 覆盖 |
| 是否覆盖 `AC-STATE/TX/IDEM/CONC` | 通过 | `GATE-02/03/04/05/06/08` 覆盖 |
| 是否覆盖 `AC-EV-001~012` | 通过 | `GATE-11/12` 统收,相关业务 GATE 提供 raw evidence |
| 是否覆盖 `VETO-ID-001~006` | 通过 | 各相关 GATE 提前挂接,PH-08-c 由 veto checklist 终审 |
| 是否存在 report-only TC | 否 | `EV-ID-REPORT-001` 只绑定 existing blocking suite case refs |
| 是否存在 static evidence pass 风险 | 已前置阻断 | `GATE-11` 和 `GATE-12` 明确失败处理 |
| 是否存在 P1/P2 污染 P0 风险 | 已前置阻断 | `AC-BOUNDARY-008`;`GATE-11/12` |

### 8.13 门禁停审记录

| Phase / Commit boundary | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | dependency boundary 与 skeleton 是否有正式证据 | 通过 | 无 |
| PH-02 | contracts/domain/state 与 redaction 是否有正式 TC/EV | 通过 | 无 |
| PH-03 | fake/replay/config foundation 是否有 idempotency / parity gate | 通过 | 无 |
| PH-04 | command accepted/rejected/duplicate/conflict 是否有 suite/report | 通过 | 无 |
| PH-05 | query no-write / visibility 是否有 write-audit gate | 通过 | 无 |
| PH-06 | consumer no-create 和 outbox accepted-only 是否有证据 | 通过 | 无 |
| PH-07 | job no-repair、stored report replay、terminal retry guard 是否有证据 | 通过 | 无 |
| PH-08 | entry/config/report/evidence/release 是否有 run-scoped report | 通过 | 无 |
| commit-01-a | 是否有 TC/EV/AC/VETO 和 report path | 通过 | 无 |
| commit-02-a | 是否不把 domain/service 提前放入 contracts gate | 通过 | 无 |
| commit-02-b | 是否覆盖 state/domain invariant | 通过 | 无 |
| commit-02-c | 是否覆盖 support state terminal guard | 通过 | 无 |
| commit-03-a | 是否覆盖 context/key/cursor/idempotency 来源 | 通过 | 无 |
| commit-03-b | 是否覆盖 fake parity 和 config fallback 风险 | 通过 | 无 |
| commit-03-c | 是否覆盖 stored replay no-rerun | 通过 | 无 |
| commit-04-a | 是否覆盖 anchor/lifecycle/ref reuse/high-risk basis | 通过 | 无 |
| commit-04-b | 是否覆盖 role/career/memory body-free | 通过 | 无 |
| commit-04-c | 是否覆盖 handoff prepare-only 和 stored replay | 通过 | 无 |
| commit-05-a | 是否覆盖 query foundation no-write | 通过 | 无 |
| commit-05-b | 是否覆盖 core read visibility/redaction | 通过 | 无 |
| commit-05-c | 是否覆盖 operations read no mutation | 通过 | 无 |
| commit-06-a | 是否覆盖 receipt scaffold typed replay | 通过 | 无 |
| commit-06-b | 是否覆盖 consumer/callback missing no-create | 通过 | 无 |
| commit-06-c | 是否覆盖 outbound material accepted-only/body-free | 通过 | 无 |
| commit-07-a | 是否覆盖 job report/stored replay foundation | 通过 | 无 |
| commit-07-b | 是否覆盖 maintenance no-repair/report-only | 通过 | 无 |
| commit-07-c | 是否覆盖 propagation terminal/retry/body-free | 通过 | 无 |
| commit-08-a | 是否覆盖 entry facade/config/dependency | 通过 | 无 |
| commit-08-b | 是否覆盖 artifact/report pairing/no-static/redaction | 通过 | 无 |
| commit-08-c | 是否覆盖 release smoke/evidence index/veto checklist/handoff review | 通过 | 无 |

### 8.14 模块写入停审记录

| 模块 | 停审项 | 结论 |
|---|---|---|
| M1 | GATE 编号是否只绑定已有正式 suite/check/TC/EV/AC/VETO | 通过 |
| M2 | 每个 phase 是否至少有一个 blocking gate | 通过 |
| M3 | Foundation boundary 是否未提前引入业务 flow gate | 通过 |
| M4 | Command boundary 是否覆盖 UoW、duplicate、redaction 和 VETO 风险 | 通过 |
| M5 | Query boundary 是否覆盖 no-write、visibility、degraded/stale | 通过 |
| M6 | Consumer/outbox boundary 是否覆盖 no-create、receipt replay、accepted-only material | 通过 |
| M7 | Job boundary 是否覆盖 report replay、no-repair、terminal retry | 通过 |
| M8 | Entry/config/evidence boundary 是否覆盖 run-scoped artifact/report 和 final review | 通过 |
| M9 | 跨门禁覆盖是否无 orphan TC/EV/AC/VETO | 通过 |

### 8.15 Step 7 总停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否新增了非正式 TC / EV / AC / VETO | 否 | 仅使用正式编号 |
| 是否新增 report-only TC | 否 | `EV-ID-REPORT-001` 只绑定 existing blocking suite case refs |
| 每个 boundary 是否都有 TC/EV/suite/report/AC/VETO | 通过 | 见 §8.6~§8.11 |
| artifact/report 是否全部 run-scoped | 通过 | 使用 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` |
| acceptance handoff 是否只作为初稿 + 审查补充 | 通过 | 见 `GATE-12` |
| 是否可以进入 Step 8 | 通过 | Step 8 继续定义配置、环境与外部依赖准备 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| `GATE-01~12` 只是实施计划门禁索引 | 否 | 不改变 `05` suite / TC / EV | 无需回写 |
| 每个 boundary 都已绑定正式 TC/EV/AC/VETO | 否 | 承接 `05/06` | 无需回写 |
| `EV-ID-REPORT-001` 不新增 report-only TC | 否 | 承接 `05` §13 | 无需回写 |
| `reports/acceptance/*` 必须审查补充 | 否 | 承接 `05/06` evidence audit | 无需回写 |
| 若实现时 gate script 缺失或无法产出 report | 是 | 实施仓工具缺口 | Step 8/9/10/11 继续定义准备、风险、暂停和交付纪律 |
| 若实现时某 boundary 无法按正式 port/schema 产出测试 | 是 | 设计可落码 blocker | 按 Step 10 暂停并回写设计真相源 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“GATE 编号目录”“Phase 门禁矩阵”“Foundation / Command / Query / Consumer / Job / Entry commit boundary 门禁矩阵”和“跨门禁覆盖 / 证据归属审计表”小节,了解测试与验收门禁如何嵌入实施提交边界。

正式 `07-实施计划.md` §7 应回填:

- 实施门禁编号为 `GATE-01~12`,只用于把 commit boundary 绑定到已有 suite/check/TC/EV/AC/VETO。
- 所有 artifact 必须进入 `artifacts/test/<run_id>`;所有 run report 必须进入 `reports/runs/<run_id>`;不得使用 `latest`。
- 每个 commit boundary 必须在提交前通过对应 blocking GATE;失败 suite 必须保留 failed/partial artifact。
- `reports/acceptance/*` 只能作为脚本初稿和审查补充材料,不得替代 suite artifact、evidence index 或验收裁决。
- `EV-ID-REPORT-001` 只审计 artifact/report pairing、no static evidence 和 gate summary integrity,不得新增 report-only TC。
- 任一 `VETO-ID-001~006` 风险对应 gate 失败时不得继续提交或进入下一 phase。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓 gate 脚本实际参数是否与 `05` §9 完全一致 | 影响 Step 8/PH-08 脚本落码 | Step 8 继续定义配置、环境与脚本准备 |
| 每个 suite 的实际 case 文件命名 | 影响 artifact writer | 本 Step 只绑定 TC family,具体 case 文件由实现仓测试工具生成 |
| release `run_id` 命名策略 | 影响 report path | Step 8/11 继续定义,但不得使用 `latest` |
| final acceptance review 责任人 | 影响 PH-08-c 完成判定 | Step 11/12 继续定义交付纪律和完成判定 |
| 若实现发现某 GATE 过大 | 影响 commit 粒度 | Step 10 允许 boundary 重审,但不得删掉 TC/EV/AC/VETO 覆盖 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段门禁矩阵完整 | 通过 | 见 §8.5 |
| Commit boundary 门禁矩阵完整 | 通过 | 见 §8.6~§8.11 |
| 每个 boundary 均绑定 TC / EV / suite / report / AC / VETO | 通过 | 见 §8.12 |
| 证据归档和失败处理明确 | 通过 | 见 §8.3~§8.4 |
| 每个 phase / boundary 门禁已停审 | 通过 | 见 §8.13 |
| 跨门禁审计无 unresolved 冲突 | 通过 | 见 §8.12 / §8.15 |
| 未修改正式 `07-实施计划.md` | 通过 | 仅创建 Step 7 中间产物 |
| 可进入 Step 8 | 通过 | 下一步定义配置、环境与外部依赖准备 |
