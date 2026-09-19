# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节：`05-测试方案.md` §9
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_09_automation_gates.md`
> 上游回写：`projects/L5-console/design-calibration/03_ddd_step_04_units_file_layout.md` §7.8、`projects/L5-console/03-详细设计.md` §15
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 将 Step 4～8 的七层客户端风险发现栈、96 个 TC、数据集和环境角色绑定为未来 planned suite、gate、check、artifact/report 路径与失败语义。所有脚本、runner、CI、artifact、report、evidence 和 run_id 都是 planned contract；本轮不创建、不执行、不填写结果。

Console 不是 Governance service。套件只覆盖客户端纯契约、模块 flow、窄 Port/adapter、受控组合、语义可访问性、架构静态红线和 release evidence assembly；不引入 repository、DB、UoW、outbox、worker、job、服务端 replay 或治理领域 truth。

## 2. 输入与固定口径

| 输入 | 用途 |
|---|---|
| Step 4 | 七层策略、19 cuts 与高风险前置 |
| Step 5 | C/FR/BR/DR/IF/DEP/NFR/AC/VETO 双向追溯和 future EV 槽 |
| Step 6 | 96 个 TC、required/conditional/blocked posture |
| Step 7 | deterministic builders、formal-shaped fakes、case/run 隔离与 teardown |
| Step 8 | local/CI/controlled/release 角色、三 profile、四项配置、不可用姿态 |
| 03 Step 4/16 与正式 §4/§15 | planned tests layout 与最小测试切口；本 Step 将脚本边界回写为 planned-only |

固定输出根：机器证据 `artifacts/test/<run_id>/`；人类报告 `reports/runs/<run_id>/`；验收交接 `reports/acceptance/`。正式引用必须绑定显式 `<run_id>`，禁止 `latest`。脚本只允许位于 `scripts/gates/*`、`scripts/checks/*`、`scripts/reports/*`；本轮这些路径均不创建。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些 suite 进 PR？ | `console-pure-contract`、`console-module-flow`、`console-config-redline`、`console-architecture-static`。它们只使用 `local-fake`、纯 builder/fake 和 generated graph，发现类型/状态/no-write/配置/依赖红线即阻断。 |
| 哪些 suite 进 main CI？ | PR suites 加 `console-port-adapter`、`console-controlled-composition`、`console-semantic-a11y`、`console-redaction-boundary`；这是 P0 deterministic 主门禁。 |
| 哪些 suite 进 nightly？ | main suites 加 `console-concurrency-race`、`console-recovery-matrix`、`console-report-pairing-audit`；nightly 只扩展受控排列，不新增 owner truth。 |
| 哪些是 release gate？ | `console-release-safety-smoke`、`console-release-config-redline`、`console-release-redaction`、`console-release-dependency`、`console-release-report-audit`。`production-pending` 只证明 fail-closed/minimal posture，不代表 production ready。 |
| P1/selected 如何处理？ | `console-selected-browser-at`、`console-selected-owner-contract` 和 `console-quantitative-sample` 只有 authority 到达后运行；不可用标 `not_run_environment_unavailable`，不阻断 P0、不贡献 positive EV。 |
| flaky、timeout、依赖故障如何处理？ | P0 deterministic suite 的 flaky/timeout/runner/config failure 都是 failed/blocked gate，不能重试改 pass、skip-pass 或用 fake success 掩盖。selected/P1 不可用只形成 residual。 |
| 每个 gate 的参数与根目录？ | planned gate 接受 `--run-id`、`--artifact-root`（默认 `artifacts/test/<run_id>`）、`--config-profile`；release 另接受 `--report-root`（默认 `reports/runs/<run_id>`）。缺失显式 run binding 或 root 越界即 fail-fast。 |
| evidence 如何产生？ | Step 9 只产出 future evidence candidate；候选必须由真实 suite artifact/report 关系推导，Step 13 才绑定正式 EV。静态表、手写 JSON 或 suite 名称不能宣告 evidence/pass。 |

## 4. Console 自动化分层与门禁图

```text
PR
  -> console-pure-contract
  -> console-module-flow
  -> console-config-redline
  -> console-architecture-static

main CI
  -> PR suites
  -> console-port-adapter
  -> console-controlled-composition
  -> console-semantic-a11y
  -> console-redaction-boundary

nightly (planned)
  -> main suites
  -> console-concurrency-race
  -> console-recovery-matrix
  -> console-report-pairing-audit

release candidate (planned)
  -> console-release-safety-smoke
  -> console-release-config-redline
  -> console-release-redaction
  -> console-release-dependency
  -> console-release-report-audit

selected / future only
  -> console-selected-browser-at
  -> console-selected-owner-contract
  -> console-quantitative-sample
```

release smoke 是 Console 场景级闭环：`context → visibility/qualification → query-safe view → optional draft/controlled command posture → result/recovery presentation → semantic a11y / redaction / architecture checks`。它不能用通用测试计数替代，也不能把 local state、toast、receipt、diagnostic 或 report 解释为 owner truth、approval、readiness 或 evidence。

## 5. 自动化套件表

| Suite | 覆盖范围 | 执行位置/触发 | 阻断级别 | planned gate | artifact | report |
|---|---|---|---|---|---|---|
| `console-pure-contract` | typed refs、safe material、状态/错误 union、whole-record、四项配置 schema | PR/main；模块、类型或配置变更 | P0 blocking | `scripts/gates/run_console_gate.sh --gate pr|main --suite console-pure-contract` | `artifacts/test/<run_id>/suites/console-pure-contract/` | `reports/runs/<run_id>/suites/console-pure-contract.md` |
| `console-module-flow` | entry/access/navigation/views/intent/features/recovery 纯 flow、Query no-write、合法/非法边 | PR/main；模块或 flow 变更 | P0 blocking | `scripts/gates/run_console_gate.sh --suite console-module-flow` | `artifacts/test/<run_id>/suites/console-module-flow/` | `reports/runs/<run_id>/suites/console-module-flow.md` |
| `console-config-redline` | strict document、profile isolation、startup-only、zero-secret、binding failure/rollback | PR/main/release；04 或 builder 变更 | P0 blocking | `scripts/gates/run_console_gate.sh --suite console-config-redline` | `artifacts/test/<run_id>/suites/console-config-redline/` | `reports/runs/<run_id>/suites/console-config-redline.md` |
| `console-architecture-static` | SDK-only、禁止目录/依赖、5 Command/16 Query/1 consumer、0 Event/Job、唯一 owner write | PR/main/release；manifest/export/layout 变更 | P0 blocking | `scripts/checks/check_console_architecture.sh` | `artifacts/test/<run_id>/suites/console-architecture-static/` | `reports/runs/<run_id>/console-architecture-static.md` |
| `console-port-adapter` | narrow Port/adapter parity、typed error/cancel/unknown、mandatory/optional slot posture | main；adapter/SDK seam 变更 | P0 blocking | `scripts/gates/run_console_gate.sh --gate main --suite console-port-adapter` | `artifacts/test/<run_id>/suites/console-port-adapter/` | `reports/runs/<run_id>/suites/console-port-adapter.md` |
| `console-controlled-composition` | owner-partition fake、partial failure、canonical order、formal/local non-atomic、recovery ceiling | main/controlled integration；composition 变更 | P0 blocking | `scripts/gates/run_console_gate.sh --suite console-controlled-composition --config-profile integration-pending` | `artifacts/test/<run_id>/suites/console-controlled-composition/` | `reports/runs/<run_id>/suites/console-controlled-composition.md` |
| `console-semantic-a11y` | visual/keyboard/AT 同 action/guard/outcome、focus/announce fallback、semantic status | main；semantic binding 变更 | P0 blocking | `scripts/gates/run_console_gate.sh --suite console-semantic-a11y` | `artifacts/test/<run_id>/suites/console-semantic-a11y/` | `reports/runs/<run_id>/suites/console-semantic-a11y.md` |
| `console-redaction-boundary` | forbidden body/secret/full ref、diagnostic isolation、minimum disclosure、report scan | main/release；mapper/diagnostic/report 变更 | P0 blocking | `scripts/checks/check_console_redaction.sh` | `artifacts/test/<run_id>/suites/console-redaction-boundary/` | `reports/runs/<run_id>/console-redaction.md` |
| `console-concurrency-race` | single writer/flight、late result、cancel dispatch boundary、invalidation race conservative | nightly；state/concurrency/invalidation 变更 | P0 nightly blocking | `scripts/gates/run_console_gate.sh --gate nightly --suite console-concurrency-race` | `artifacts/test/<run_id>/suites/console-concurrency-race/` | `reports/runs/<run_id>/suites/console-concurrency-race.md` |
| `console-recovery-matrix` | typed error、partial owner failure、stale/mismatch plan、one-action recovery | nightly；recovery/error 变更 | P0 nightly blocking | `scripts/gates/run_console_gate.sh --gate nightly --suite console-recovery-matrix` | `artifacts/test/<run_id>/suites/console-recovery-matrix/` | `reports/runs/<run_id>/suites/console-recovery-matrix.md` |
| `console-report-pairing-audit` | artifact/report pairing、no static evidence、fixed run binding、redaction metadata | nightly/release | P0 blocking | `scripts/checks/check_console_report_pairing.sh` + `scripts/checks/check_no_static_evidence.sh` | `artifacts/test/<run_id>/suites/console-report-pairing-audit/` | `reports/runs/<run_id>/console-report-audit.md` |
| `console-release-safety-smoke` | fixed Console core closure and all VETO safety probes | release candidate；显式 run | P0 blocking | `scripts/gates/run_console_release_gate.sh --suite console-release-safety-smoke` | `artifacts/test/<run_id>/suites/console-release-safety-smoke/` | `reports/runs/<run_id>/suites/console-release-safety-smoke.md` |
| `console-release-config-redline` | `production-pending` strict/fail-closed/minimal posture | release candidate | P0 blocking | `scripts/gates/run_console_release_gate.sh --suite console-release-config-redline` | `artifacts/test/<run_id>/suites/console-release-config-redline/` | `reports/runs/<run_id>/suites/console-release-config-redline.md` |
| `console-release-redaction` | final raw artifact/report boundary scan | release candidate | P0 blocking | `scripts/checks/check_console_redaction.sh --release` | `artifacts/test/<run_id>/suites/console-release-redaction/` | `reports/runs/<run_id>/console-release-redaction.md` |
| `console-release-dependency` | compile/runtime boundary and forbidden structure scan | release candidate | P0 blocking | `scripts/checks/check_console_architecture.sh --release` | `artifacts/test/<run_id>/suites/console-release-dependency/` | `reports/runs/<run_id>/console-release-dependency.md` |
| `console-release-report-audit` | report generation from raw artifacts and candidate traceability | release candidate | P0 blocking | `scripts/checks/check_console_report_pairing.sh --release` | `artifacts/test/<run_id>/suites/console-release-report-audit/` | `reports/runs/<run_id>/console-release-report-audit.md` |
| `console-selected-browser-at` | future concrete browser/AT matrix | selected only after `CON-Q-046` closure | non-P0 | `scripts/gates/run_console_selected_gate.sh` | run-scoped planned path | run-scoped planned path |
| `console-selected-owner-contract` | future exact owner/SDK positive adapter and observed invalidation | selected only after `CON-Q-034～044` closure | non-P0 | `scripts/gates/run_console_selected_gate.sh` | run-scoped planned path | run-scoped planned path |
| `console-quantitative-sample` | future bounded fan-out/latency/load sample | selected only after `CON-Q-045` authority | non-P0 | `scripts/gates/run_console_selected_gate.sh` | run-scoped planned path | run-scoped planned path |

## 6. Gate / check / report 脚本边界表

| Planned path | 类型 | 必要输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_console_gate.sh` | gate | `--gate`、`--suite`、`--run-id`、`--artifact-root`、`--config-profile` | suite raw artifact、`report.json`、stdout/stderr | 非零阻断；保留失败原因；不可 skip-pass |
| `scripts/gates/run_console_release_gate.sh` | release gate | `--run-id`、`--artifact-root`、`--report-root`、`--config-profile` | release suite artifact 与汇总输入 | 任一 P0 release suite/check 失败即阻断送验 |
| `scripts/gates/run_console_selected_gate.sh` | selected gate | run/root/profile + authority-derived selection | selected artifact 或 unavailable marker | 不阻断 P0；缺环境标 residual |
| `scripts/checks/check_console_architecture.sh` | static check | planned source/export/dependency graph、roots | architecture report/raw scan | forbidden import/unit/protocol count/extra owner write 即阻断 |
| `scripts/checks/check_console_redaction.sh` | redaction check | artifact/report roots、approved deny rules | redaction raw/report | raw secret/body/full ref/stack/free text 即阻断且不回显 |
| `scripts/checks/check_console_report_pairing.sh` | pairing check | artifact/report roots、suite manifest | pairing report | 缺 report、孤 orphan artifact、run mismatch 即阻断 |
| `scripts/checks/check_no_static_evidence.sh` | evidence check | generated reports/candidate index | static-evidence report | 手写 EV/VETO pass 或无 artifact source 即阻断 |
| `scripts/reports/generate_console_reports.sh` | report generator | `--run-id`、artifact root、report root | run summary、suite markdown、gate results | artifact/schema 缺失或生成失败非零 |
| `scripts/reports/build_console_evidence_candidates.sh` | candidate generator | raw suite artifacts/reports | `evidence-candidates.md` | 只能从真实关系推导；无 source 不生成 candidate |
| `scripts/reports/build_console_acceptance_draft.sh` | handoff draft | run reports、candidate index、risk list | `reports/acceptance/*` draft | 只生成待审草稿；不得写 signoff/readiness |

所有命令、参数和脚本均为 planned boundary；不表示目标仓存在，也不授权实施者在未确认 framework/runner/package manager 前创建具体实现。

## 7. Suite → TC / EV candidate 映射

| Suite | 主要 TC | future EV candidate bundle | 阻断 |
|---|---|---|---|
| `console-pure-contract` | `TC-CTX-*`、`TC-VIEW-002/004/005`、`TC-STATE-001～003/005～008`、`TC-CONFIG-001～004/009～011` | `EV-CAND-UNIT-001`、`EV-CAND-CONTRACT-001` | P0 |
| `console-module-flow` | `TC-CTX-*`、`TC-NAV-*`、`TC-VIEW-*`、`TC-INTENT-001～005/007～011`、`TC-RECOVERY-*` | `EV-CAND-FLOW-001`、`EV-CAND-SECURITY-001` | P0 |
| `console-config-redline` | `TC-CONFIG-001～011` | `EV-CAND-CONTRACT-001`、`EV-CAND-SECURITY-001`、`EV-CAND-RELEASE-001` | P0；release 时由 `console-release-config-redline` 复核 |
| `console-architecture-static` | `TC-ARCH-001～004` | `EV-CAND-ARCH-001` | P0；release 时由 `console-release-dependency` 复核 |
| `console-port-adapter` | `TC-ADAPTER-001～004`、`TC-VIEW-009`、`TC-INTENT-005/007` | `EV-CAND-CONTRACT-001`、`EV-CAND-INTEGRATION-001` | P0 |
| `console-controlled-composition` | `TC-TOPIC-*`、`TC-INTENT-009/010`、`TC-CONSISTENCY-001～007`、`TC-SEC-005` | `EV-CAND-INTEGRATION-001`、`EV-CAND-FLOW-001` | P0；owner positive conditional |
| `console-semantic-a11y` | `TC-NAV-002`、`TC-A11Y-001～003`、`TC-RECOVERY-005` | `EV-CAND-ACCESSIBILITY-001` | P0 semantic；browser matrix conditional |
| `console-redaction-boundary` | `TC-VIEW-003`、`TC-RECOVERY-001`、`TC-DIAG-*`、`TC-SEC-001～004`、`TC-CONFIG-003` | `EV-CAND-SECURITY-001` | P0 |
| `console-concurrency-race` | `TC-CONSISTENCY-001～008`、`TC-STATE-004`、`TC-ADAPTER-005` | `EV-CAND-INTEGRATION-001`、`EV-CAND-FLOW-001` | P0 nightly |
| `console-recovery-matrix` | `TC-RECOVERY-001～005`、`TC-INTENT-008/011`、`TC-TOPIC-002/003` | `EV-CAND-FLOW-001`、`EV-CAND-INTEGRATION-001` | P0 nightly |
| `console-report-pairing-audit` | `TC-ARCH-001～004` plus every blocking suite manifest | `EV-CAND-ARCH-001`、`EV-CAND-RELEASE-001` | P0 |
| `console-release-safety-smoke` | representative `TC-CTX/NAV/VIEW/INTENT/TOPIC/RECOVERY/A11Y/SEC/CONFIG/ARCH` | `EV-CAND-RELEASE-001` | P0 |
| `console-release-config-redline` | `TC-CONFIG-001～011` 的 production-pending/fail-closed 子集 | `EV-CAND-RELEASE-001`、`EV-CAND-CONTRACT-001` | P0 release check |
| `console-release-redaction` | `TC-VIEW-003`、`TC-RECOVERY-001`、`TC-DIAG-002/004`、`TC-SEC-001～004`、`TC-CONFIG-003` | `EV-CAND-SECURITY-001`、`EV-CAND-RELEASE-001` | P0 release check |
| `console-release-dependency` | `TC-ARCH-001～004` | `EV-CAND-ARCH-001`、`EV-CAND-RELEASE-001` | P0 release check |
| `console-release-report-audit` | every blocking suite manifest 与固定 run pairing | `EV-CAND-RELEASE-001` | P0 release check |
| conditional suites | `TC-INTENT-006`、`TC-TOPIC-004～011` positive facets、`TC-ADAPTER-006`、`TC-A11Y-004`、quantitative samples | future contract-derived candidates only | blocked/non-P0 |

`EV-CAND-*` 是 future candidate label；正式 `EV-<TYPE>-<NNN>` 只能由 Step 13 从固定 run 的真实 artifact/report 关系生成。Step 9 不把候选映射写成 evidence 或 verdict。

## 8. P0 自动化缺口、不可自动化项与失败姿态

| 项 | 当前结论 | 处理 |
|---|---|---|
| P0 safety/unit/flow/contract/static/redaction/semantic-a11y | 可规划自动化；无人工-only P0 | 进入 blocking suite；人工只审报告，不替代 gate |
| exact owner positive、observed invalidation | 当前不可构造 | safety/no-call/disabled suite 可执行；positive 条件标 `CON-Q-034～044` blocked |
| browser/AT concrete compatibility | 未有 authority | semantic suite 保留；selected suite unavailable/residual |
| quantitative thresholds | 未有 authority | 只做结构性边界 candidate；不设 pass threshold |
| target repo/framework/runner 不存在 | 所有 suite planned/not_created | 不执行、不写 pass，不生成 artifact |
| flaky/timeout/runner/config failure | P0 failed/blocked | 不自动改写 pass；重跑必须产生新显式 run_id |
| diagnostic sink disabled/failed | 业务 suite 结果不得改变 | 记录 isolation posture；不转成 audit/evidence 缺失结论 |

## 9. 跨 suite 门禁与证据审计

| 审计项 | 结论 |
|---|---|
| P0 每个 TC family 是否至少有 blocking suite | pass（planned mapping；conditional positive 明确 blocked） |
| 每个 blocking suite 是否有固定 artifact/report 根 | pass；均使用 `<run_id>`，无 project 子目录、无 `latest` |
| gate/check/report 是否分离 | pass；分别位于 `scripts/gates|checks|reports` |
| 是否把 Governance service suite 迁入 Console | pass；无 repository/worker/job/outbox/replay suite |
| evidence 是否可由静态表直接宣告 | pass；`EV-CAND-*` 只能由真实 artifact/report 推导 |
| redaction/dependency/report pairing 是否 release blocking | pass |
| P1/P2 unavailable 是否会污染 P0 pass | pass；只写 residual/unavailable |
| 失败 artifact/report 是否保留失败原因 | pass；未来 gate 合同要求保留，当前无实例 |
| 是否出现已运行、coverage、baseline、verdict 或 readiness 事实 | pass；无 |

## 10. 对 03 的受控回写与上游影响

| 回写项 | 结果 |
|---|---|
| `03_ddd_step_04_units_file_layout.md` | §7.8 增补 planned scripts/gates/checks/reports 与固定 artifact/report roots；未创建路径。 |
| `03_ddd_step_16_test_slices.md` | 将“当前不定义脚本契约”改为“当前不创建；Step 9 定义 planned boundary”；保留未执行事实。 |
| `03-详细设计.md` §15 | 补充 planned test boundary 与固定路径；未改变模块、协议、状态或 owner truth。 |
| 业务/配置语义 | 无变化；四项配置、三 profile、Query no-write、唯一 submit write 不变。 |

## 11. 回填草稿与门禁

正式 §9 应回填：Console 七层 suite/gate 图、PR/main/nightly/release/selected 触发、套件表、脚本边界、artifact/report 路径、TC/EV candidate 映射、失败/不可用姿态及跨 suite 审计。

> 校准来源：`design-calibration/05_test_plan_step_09_automation_gates.md`
>
> 延伸阅读：建议继续阅读本文件的“自动化套件表”“Gate / check / report 脚本边界表”“Suite → TC / EV candidate 映射”“P0 自动化缺口、不可自动化项与失败姿态”和“跨 suite 门禁与证据审计”。

| 进入 Step 10 条件 | 结论 |
|---|---|
| P0 suite/gate/触发/阻断级别清楚 | pass |
| 每个阻断 suite 有 TC、future EV candidate、artifact/report 绑定 | pass |
| planned path 与实现事实边界清楚 | pass |
| 03 planned layout 已受控回写 | pass |
| cross-suite 审计无 unresolved 冲突 | pass |

Step 9 `done / pass / self_reviewed`；未创建脚本、目标实现仓、artifact、report、evidence、run_id 或测试结果。
