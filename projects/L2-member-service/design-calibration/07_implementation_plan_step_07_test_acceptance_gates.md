# Step 7. 嵌入测试与验收门禁

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 7
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §7

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | test_acceptance_gates |
| next_allowed_action | Step 8 config_environment_dependencies |
| test_execution_allowed | false；本步只定义门禁 |

## 本步输入

正式 05 §4、§6、§9、§13、§14；正式 06 §4~§12；Step 5 phase 表和 Step 6 boundary / Gate Matrix。

## SOP 问题回答

每个 phase 至少绑定一套 P0 suite；每个 boundary 至少绑定一个 targeted check、AC/VF 风险和证据归属。门禁失败时保持 failed/blocked，不得转写成风险接受或进入 successor。所有 future run 必须提供固定 run_id、raw artifact 与 human-readable report；`reports/acceptance/*` 只能是待审初稿，不能代替验收签署。真实 sibling 正向联调未闭合时，使用 unavailable / waiting / blocked evidence 状态，不生成 ready 或 accepted。

## 当前文档问题诊断

05/06 已有测试与验收分母，但如果 07 只写“运行测试”，会丢失 phase/boundary 证据路径、VETO 绑定和失败恢复。必须将 suite、脚本、artifact、report、AC、VF 和人工审查责任放在同一矩阵中。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| gate | 只列 suite | phase + boundary 双层矩阵 |
| 证据 | 可能静态声明通过 | raw/report pairing + no-static-evidence |
| 验收 | 最后才看 AC/VF | 每 boundary 预绑定 AC/VF 风险 |
| 失败 | 不明确停在哪 | 明确阻断、回写或 residual |

## 设计取舍

- 复用 05 的 9 个 P0 阻断 suite 与 1 个 future selected suite，不新增伪造 suite。
- 14 个固定 EV 实例只作为未来证据 identity；当前不生成实例。
- PH-08 负责 release/report/handoff 审计，前置 phase 只能生成 candidate artifacts。

## 结构化中间产物

### Suite 与路径基线

| Suite | 主要范围 | planned 脚本 | artifact | report | 阻断 |
|---|---|---|---|---|---|
| contract-domain-fast | contracts、domain、state、redaction | scripts/gates/run_contract_domain.sh | artifacts/test/<run_id>/suites/contract-domain-fast | reports/runs/<run_id>/suites/contract-domain-fast.md | P0 |
| service-flow-fast | 10 Command、6 Query、5 Consumer flow、UoW/idempotency | scripts/gates/run_service_flow.sh | artifacts/test/<run_id>/suites/service-flow-fast | reports/runs/<run_id>/suites/service-flow-fast.md | P0 |
| infra-runtime-fake | store、revision、builder、adapter fault | scripts/gates/run_infra_fake.sh | artifacts/test/<run_id>/suites/infra-runtime-fake | reports/runs/<run_id>/suites/infra-runtime-fake.md | P0 |
| entry-worker-job | API、worker、job entry、receipt/report | scripts/gates/run_entry_worker_job.sh | artifacts/test/<run_id>/suites/entry-worker-job | reports/runs/<run_id>/suites/entry-worker-job.md | P0 |
| operations-replay-core | outbox、projection、cleanup、handoff、replay | scripts/gates/run_operations_replay.sh | artifacts/test/<run_id>/suites/operations-replay-core | reports/runs/<run_id>/suites/operations-replay-core.md | P0 |
| config-redline | profile、strict JSON、source priority、builder | scripts/gates/run_config_redline.sh | artifacts/test/<run_id>/suites/config-redline | reports/runs/<run_id>/suites/config-redline.md | P0 |
| redaction-boundary | artifact/report/log/metric/audit leak scan | scripts/gates/run_redaction_boundary.sh | artifacts/test/<run_id>/suites/redaction-boundary | reports/runs/<run_id>/redaction-check.md | P0 |
| dependency-boundary | compile graph与 seam 分类 | scripts/gates/run_dependency_boundary.sh | artifacts/test/<run_id>/suites/dependency-boundary | reports/runs/<run_id>/dependency-boundary.md | P0 |
| release-main-smoke | C-MS-1~5 representative chain | scripts/gates/run_release_smoke.sh | artifacts/test/<run_id>/suites/release-main-smoke | reports/runs/<run_id>/suites/release-main-smoke.md | 送验阻断 |
| real-like-selected-run | P1 controlled/real-like seam | scripts/gates/run_selected_integration.sh | fixed run root | fixed run report | future residual |

### Phase 门禁矩阵

| Phase | Test gate | AC/VF 关联 | 证据输出 | 失败处理 |
|---|---|---|---|---|
| PH-01 | dependency-boundary、config-redline、脚本 dry-run | AC-MS-027、AC-MS-036、VF-MS-008 | candidate suite artifacts | workspace/配置修复；不进入 PH-02 |
| PH-02 | contract-domain-fast、service-flow-fast | AC-MS-001~010、VF-MS-002/004/006 | command/domain artifacts | 回写字段/状态/UoW；阻断 |
| PH-03 | service-flow-fast、infra-runtime-fake | AC-MS-003、AC-MS-011/012、VF-MS-003/006 | host/session artifacts | mapper/generation 缺口阻断 |
| PH-04 | contract-domain-fast、service-flow-fast、infra-runtime-fake | AC-MS-004、AC-MS-013/014、VF-MS-006 | health/recovery artifacts | unknown/hold 保留；不得盲重试 |
| PH-05 | service-flow-fast、operations-replay-core | AC-MS-005、AC-MS-015/016、VF-MS-007 | cleanup/reconcile artifacts | residual/gap 进入 blocker 或 case |
| PH-06 | contract-domain-fast、service-flow-fast、operations-replay-core | AC-MS-017/032、VF-MS-007 | material/query artifacts | no-write/cursor/immutable 失败阻断 |
| PH-07 | entry-worker-job、operations-replay-core、redaction-boundary | AC-MS-011~017/039、VF-MS-005/007 | consumer/job/publisher artifacts | receipt/layer/no-repair 失败阻断 |
| PH-08 | release-main-smoke、redaction、dependency、report audit | AC-MS-034~039、VF-MS-001/008/009 | fixed run raw/report/handoff | 不可送验；不写 verdict |

### 24 个 Boundary Gate 绑定

| Boundary | Gate | 提交前最小门禁 | AC/VF 风险 | 证据状态 |
|---|---|---|---|---|
| commit-01-a | GATE-MS-01 | workspace/dependency/naming check | AC-MS-027、VF-MS-008 | planned / not_run |
| commit-01-b | GATE-MS-02 | config/builder/fake compile smoke | AC-MS-029、036 | planned / not_run |
| commit-01-c | GATE-MS-03 | script/ledger path dry-run | AC-MS-037、VF-MS-009 | planned / not_run |
| commit-02-a | GATE-MS-04 | contract-domain intent/decision | AC-MS-001、006/007 | planned / not_run |
| commit-02-b | GATE-MS-05 | qualification/assembly flow | AC-MS-002、008~010、VF-MS-004 | planned / not_run |
| commit-02-c | GATE-MS-06 | UoW/idempotency replay | AC-MS-007、038、VF-MS-006 | planned / not_run |
| commit-03-a | GATE-MS-07 | generation/action tests | AC-MS-002/014、VF-MS-003 | planned / not_run |
| commit-03-b | GATE-MS-08 | registration/session tests | AC-MS-003/011/012 | planned / not_run |
| commit-03-c | GATE-MS-09 | entry/fake smoke | AC-MS-003、VF-MS-003 | planned / not_run |
| commit-04-a | GATE-MS-10 | health signal/assessment tests | AC-MS-004/013 | planned / not_run |
| commit-04-b | GATE-MS-11 | recovery decision/fence tests | AC-MS-014、VF-MS-006 | planned / not_run |
| commit-04-c | GATE-MS-12 | recovery adapter/unknown tests | AC-MS-004、034 | planned / not_run |
| commit-05-a | GATE-MS-13 | closure/cleanup tests | AC-MS-005/015 | planned / not_run |
| commit-05-b | GATE-MS-14 | residual/reconcile tests | AC-MS-016、VF-MS-007 | planned / not_run |
| commit-05-c | GATE-MS-15 | bounded maintenance replay | AC-MS-015/016、VF-MS-007 | planned / not_run |
| commit-06-a | GATE-MS-16 | immutable material/outbox tests | AC-MS-017/032、VF-MS-005 | planned / not_run |
| commit-06-b | GATE-MS-17 | projection/query no-write tests | AC-MS-012/017/032、VF-MS-007 | planned / not_run |
| commit-06-c | GATE-MS-18 | API mapping/redaction tests | AC-MS-028/031/036 | planned / not_run |
| commit-07-a | GATE-MS-19 | consumer version/dedup/late tests | AC-MS-011~017 | planned / not_run |
| commit-07-b | GATE-MS-20 | publisher feedback-layer tests | AC-MS-017、VF-MS-005/007 | planned / not_run |
| commit-07-c | GATE-MS-21 | seven job entry/replay tests | AC-MS-015/016/039、VF-MS-007 | planned / not_run |
| commit-08-a | GATE-MS-22 | fixture/gate argument checks | AC-MS-037、VF-MS-009 | planned / not_run |
| commit-08-b | GATE-MS-23 | artifact/report/redaction/dependency audit | AC-MS-032/037、VF-MS-005/008/009 | planned / not_run |
| commit-08-c | GATE-MS-24 | release smoke/handoff static audit | AC-MS-001~005/034~039、VF-MS-001 | planned / not_run |

AC-MS-021 属于 P1/P2 聚合宿主安全视图；本轮只复用其“只读、非写源、可失效/重建”的结构红线，不把该项计入 PH-06 P0 Gate 或当前实现完成条件。后续 selected-run 需另行固定 projection product、retention 和 evidence authority。

### 证据与报告生成规则

1. 每次 future gate 接受显式 `--run-id --artifact-root --config-profile`；`run_id` 不能为 latest。
2. raw artifact 先于 report；report 必须回指 suite artifact、TC、AC/VF、digest 和 source ref。
3. `evidence-index`、`redaction-check`、`dependency-boundary`、`report-audit` 均由实际输入派生，不能手写 passed。
4. `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md` 可由脚本生成初稿，但必须人工/Agent 审查；当前均未生成。
5. sibling unavailable 只产生 blocked/unavailable/not_run 的可解释记录，不产生 ready、accepted 或 signoff。

### 报告生成与人工审查矩阵

| 阶段 / boundary | 生成入口 | 输入 | 输出 | 审查要求 |
|---|---|---|---|---|
| PH-01~PH-07 | 对应 suite runner 与 `scripts/reports/` generator | `artifacts/test/<run_id>/suites/<suite>/` | `reports/runs/<run_id>/suites/<suite>.md` | 核对原始结果、失败解释和 source ref，不生成正式 EV |
| PH-08 / commit-08-a | release smoke 与 fixture/gate runner | 固定 run 的 P0 suite artifact | gate summary / smoke report | 核对 run 参数、pairing 和 fail-closed 姿态 |
| PH-08 / commit-08-b | evidence-index、audit、redaction report generator（planned） | raw artifact、suite report、TC/AC/VF 映射 | evidence-index、redaction/dependency/report-audit | 逐项回指 digest、TC、AC/VF、source ref，拒绝 orphan/static evidence |
| PH-08 / commit-08-c | acceptance handoff generator（planned） | PH-08 report、VETO 输入、open issues | handoff、veto-checklist、open-issues draft | 人工/Agent 审查 blocker、residual、范围与签署 authority，不代写 verdict |

### 门禁停审与覆盖审计

| 审计项 | 结论 |
|---|---|
| 每 phase 至少一个 suite | pass-designed |
| 每 boundary 有 Gate 与 AC/VF 关联 | pass-designed |
| artifact/report 固定路径 | pass-designed |
| Query no-write / Job no-truth-repair | pass-designed；需未来真实测试 |
| P1/P2 AC-MS-018~021 未进入 P0 Gate | pass-designed |
| 14 EV 与 39 AC / 9 VF 可追溯 | pass-designed；当前无实例 |
| 失败不会被风险接受覆盖 | pass-designed；VETO 保持阻断 |

## 回填草稿

正式 §7 应回填 suite、phase/boundary Gate Matrix、AC/VF 绑定、artifact/report 规则、人工审查和失败姿态；明确当前没有执行结果。

## 待确认事项

- 目标仓实际可运行的命令及 toolchain 版本。
- 真实 run_id 生成器、report generator 和 acceptance reviewer。
- Core/Bus exact envelope 与 receipt 对 PH-07/PH-08 的影响。

## 进入下一步条件

测试与验收门禁、证据路径、失败处理和覆盖审计已固定，允许进入 Step 8 配置/环境/依赖准备。
