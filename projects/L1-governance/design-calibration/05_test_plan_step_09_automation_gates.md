# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节: `05-测试方案.md` §9 自动化与 CI/CD 门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 设计自动化与 CI/CD 门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 4 分层策略;Step 6 用例矩阵;Step 7 测试数据;Step 8 环境矩阵;`03` Step 16 脚本契约 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_09_automation_gates.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步目标

定义哪些 P0 测试套件必须自动执行,它们在哪条流水线执行,失败是否阻断,以及每个 gate 必须如何产出 artifact 和 report。

本 Step 只回答:

- 哪些 suite 进入 PR、main CI、nightly、operations replay、release gate 或 P1 selected-run。
- 每个 gate / report / check 脚本的名称、输入、输出和失败处理。
- 每个 suite 的 artifact root、report root、阻断级别和候选证据来源。
- 每个 suite 如何覆盖 Step 6 的 TC-GOV-* 用例和 EV-CAND-* 候选证据。
- flaky、超时、依赖不可用、redaction failure、report 缺失和静态造证据如何处理。

本 Step 不实现脚本,不固定实现仓测试函数名,不生成正式 evidence ID,不写验收 verdict,不修改正式 `05-测试方案.md`。正式 EV 编号、evidence index、acceptance report 和归档格式由 Step 13 固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 提供 unit/service/integration/entry/release gate 分层 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 TC-GOV-* 用例和 EV-CAND-* 候选证据 |
| `05_test_plan_step_07_test_data.md` | 已完成 | 提供 DS-GOV-* 数据集和 fake / controlled / disabled 数据 |
| `05_test_plan_step_08_environment_config.md` | 已完成 | 提供 P0 profile、环境矩阵、依赖类型和不可用处理 |
| `03_ddd_step_16_test_cuts.md` | 正式输入 | 提供 `scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/checks/check_redaction.sh` 初始脚本契约 |
| `04-配置设计.md` §12 | 正式输入 | 提供 config schema、no silent fallback、redaction、topic completeness 和 runtime builder gate |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 suite 必须进 PR? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary` 必须进 PR。它们覆盖 schema/state/UoW/no-write/config/dependency 的快速阻断风险。 |
| 哪些 suite 进 main CI? | main CI 必须执行 PR suites 加 `infra-runtime-fake`、`entry-worker-job`、`redaction-boundary` 和 `operations-replay-core`。main CI 是 P0 自动化主门禁。 |
| 哪些 suite 进 nightly? | nightly 必须执行 main CI suites 加 `operations-replay-extended`、`fault-injection-matrix`、`report-generation-audit`。nightly 用于更完整的恢复、partial failure 和 report pairing 审计。 |
| 哪些 suite 是 staging smoke 或 release gate? | 当前 P0 release gate 是 `release-main-smoke`、`release-config-redline`、`release-redaction-boundary`、`release-dependency-boundary`、`release-report-audit`。`p1-real-like-selected-run` 只在 P1 环境和正式 selected-run 口径存在时执行,不作为 P0 pass 前置。 |
| flaky、超时和依赖故障如何处理? | P0 suite 必须 deterministic。flaky 或 timeout 视为 failed artifact,不得自动改写为 pass。P0 fake/controlled 依赖不可用 fail-fast 或产生预期 degraded marker;P1 selected-run 不可用只记录 unavailable/residual。 |
| 每个阻断 suite 由哪个脚本执行? | CI 总入口使用 `scripts/gates/run_ci_gate.sh`;release 使用 `scripts/gates/run_release_gate.sh`;P1 selected-run 使用 `scripts/gates/run_selected_p1_gate.sh`。suite 级执行由 gate script 的 `--suite` 或 gate 内部 suite manifest 调用。 |
| 每个 gate 的默认 artifact-root 是否为 `artifacts/test/<run_id>`? | 是。所有 suite 的机器证据进入 `artifacts/test/<run_id>/suites/<suite>/`。不得使用 `latest` 或 `artifacts/test/<project>/<run_id>`。 |
| 每个 gate 是否支持 `--run-id`、`--artifact-root`、`--config-profile`? | 是。`--run-id` 必填或由 CI 显式传入;`--artifact-root` 默认 `artifacts/test/<run_id>`;`--config-profile` 必须是 Step 8 定义的 profile。release gate 还必须传 `--report-root reports/runs/<run_id>`。 |
| 哪些 `scripts/checks/*.sh` 必须进入 release gate? | `check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 必须进入 release gate。 |
| 哪些 `scripts/reports/*.sh` 在 gate 后生成 `reports/runs/<run_id>`? | `generate_reports.sh` 从 suite artifacts 生成 suite reports;`build_gate_summary.sh` 生成 gate summary;`build_evidence_candidates.sh` 生成候选证据映射。所有报告必须从 artifact 推导,不得由静态 JSON 直接宣告通过。 |
| 每个自动化 suite 覆盖哪些测试切口、用例和证据 ID? | 见 §8.5。所有 P0 TC-GOV-* 都映射到至少一个阻断 suite 或 release gate。EV 仍使用 `EV-CAND-*`。 |
| 哪些 P0 用例不能自动化? | 当前无 P0 用例被标记为不可自动化。人工审查只用于阅读 report、确认 P1 selected-run unavailable 和后续验收裁决,不替代 P0 suite。 |
| 所有 suite 完成后是否存在缺口? | 当前未发现 unresolved P0 自动化缺口。正式 EV 编号和验收引用留 Step 13。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 用例均标记自动化候选,但没有 suite / gate | 本 Step 固定 suite 和 gate |
| Step 7 | 数据集已定义,但未绑定 artifact 输出 | 本 Step 固定 suite artifact 目录 |
| Step 8 | 环境和 profile 已定义,但未绑定 CI 触发点 | 本 Step 固定 PR/main/nightly/release/P1 selected-run |
| `03` Step 16 | 只有初始脚本契约 | 本 Step 扩展 gate / report / check 脚本表 |
| Evidence | 仍可能被静态映射伪造 | 本 Step 明确 evidence candidate 必须从真实 suite artifact / report 推导 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 自动化口径 | 只有自动化候选 | 固定 suite、gate、触发点和阻断级别 | 可交给实施仓落脚本 |
| artifact/report | 只知道 Step 13 会归档 | 固定 raw artifact 和 run report 根目录 | 防止证据路径漂移 |
| release smoke | 容易退化成通用 `cargo test` | 必须执行固定业务闭环并输出场景级断言 | 支撑 release evidence |
| redaction/dependency | 只作为用例存在 | 进入 release check scripts | 一票否决风险必须脚本化 |
| evidence index | 可能从静态 JSON 生成 | 只能从 suite artifact / selected report 推导候选证据 | 防止造证据 |

## 7. 自动化设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否一个 gate 跑全部 P0 | A. 单一总 suite;B. 分 suite 并汇总 | 采用 B。失败定位更清楚,release 可以审计 suite/report 配对 |
| release smoke 是否可用通用测试计数 | A. 可以;B. 必须业务场景级断言 | 采用 B。release smoke 必须证明 governance 主闭环 |
| P1 real-like 是否阻断 P0 | A. 阻断;B. selected-run 非 P0 | 采用 B。真实产品和环境未锁定 |
| redaction 是否只人工检查 | A. 人工;B. 自动扫描 artifact/report | 采用 B。raw body/secret 是一票否决风险 |
| evidence 是否 Step 9 固定正式 ID | A. 固定;B. 保持候选 | 采用 B。Step 13 统一编号和归档 |

## 8. 结构化中间产物

### 8.1 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `contract-domain-fast` | DTO roundtrip、metadata、digest、domain invariant、state matrix | PR / main | code change in contracts/domain/shared config | P0 blocking | `scripts/gates/run_ci_gate.sh --gate pr --suite contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| `service-flow-fast` | command/query/consumer service flow、UoW、duplicate、no-write | PR / main | code change in application/contracts/domain | P0 blocking | `scripts/gates/run_ci_gate.sh --gate pr --suite service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| `config-redline` | strict JSON、source priority、profile isolation、topic completeness、external GRC boundary | PR / main / release | config or runtime builder change;release | P0 blocking | `scripts/gates/run_ci_gate.sh --suite config-redline` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` |
| `dependency-boundary` | only `L0-core` compile dependency;runtime/event seam only | PR / main / release | manifest or dependency metadata change;release | P0 blocking | `scripts/checks/check_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` |
| `infra-runtime-fake` | repositories, fake UoW, fake adapters, runtime builder, profile matrix | main | merge to main | P0 blocking | `scripts/gates/run_ci_gate.sh --gate main --suite infra-runtime-fake` | `artifacts/test/<run_id>/suites/infra-runtime-fake/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| `entry-worker-job` | API handler, worker consumer/outbox, job runner/report/replay | main | merge to main | P0 blocking | `scripts/gates/run_ci_gate.sh --gate main --suite entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` |
| `operations-replay-core` | publish/rebuild/refresh/reconcile/handoff/export/idempotency replay core | main / release | main CI and release candidate | P0 blocking | `scripts/gates/run_ci_gate.sh --suite operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| `redaction-boundary` | logs/metrics/audit/trace/report/artifact forbidden body scan | main / release | main CI and release candidate | P0 blocking | `scripts/checks/check_redaction.sh` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` |
| `operations-replay-extended` | wider fault injection, partial report, race and retry cases | nightly | scheduled nightly | P0 blocking for nightly;release consumes only an explicitly selected run | `scripts/gates/run_ci_gate.sh --gate nightly --suite operations-replay-extended` | `artifacts/test/<run_id>/suites/operations-replay-extended/` | `reports/runs/<run_id>/suites/operations-replay-extended.md` |
| `report-generation-audit` | artifact/report pairing, no static evidence, report generation from artifacts | nightly / release | nightly and release candidate | P0 blocking | `scripts/checks/check_artifact_report_pairing.sh`;`scripts/checks/check_no_static_evidence.sh` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` |
| `release-main-smoke` | fixed governance business closure: context -> input -> gate/decision -> policy/control -> compliance/NC -> query/trace/outbox/job report | release | release candidate only | P0 blocking | `scripts/gates/run_release_gate.sh --suite release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` |
| `p1-real-like-selected-run` | future real-like adapter smoke / dry-run | selected P1 | explicit selected-run only | non-P0;records residual if unavailable | `scripts/gates/run_selected_p1_gate.sh` | `artifacts/test/<run_id>/suites/p1-real-like-selected-run/` | `reports/runs/<run_id>/suites/p1-real-like-selected-run.md` |

### 8.2 CI/CD 门禁图: L1-governance 自动化门禁

```text
Developer / PR
  -> run_ci_gate.sh --gate pr
     -> contract-domain-fast
     -> service-flow-fast
     -> config-redline
     -> dependency-boundary

Main branch
  -> run_ci_gate.sh --gate main
     -> PR suites
     -> infra-runtime-fake
     -> entry-worker-job
     -> operations-replay-core
     -> redaction-boundary
     -> generate_reports.sh

Nightly
  -> run_ci_gate.sh --gate nightly
     -> main suites
     -> operations-replay-extended
     -> fault-injection-matrix
     -> report-generation-audit

Release candidate
  -> run_release_gate.sh --run-id <run_id>
     -> release-main-smoke
     -> release-config-redline
     -> release-redaction-boundary
     -> release-dependency-boundary
     -> release-report-audit
     -> generate_reports.sh

P1 selected-run
  -> run_selected_p1_gate.sh
     -> p1-real-like-selected-run
     -> unavailable is residual,not P0 pass
```

关键说明:

- PR gate 只跑快速阻断 suite,但所有 P0 风险必须至少进入 main 或 release gate。
- Release gate 必须运行固定业务闭环 smoke,不得用通用测试计数替代场景级断言。
- `latest` 不得作为 gate 输入或 evidence 来源;所有路径必须绑定 `<run_id>`。
- P1 selected-run 不可用时记录 residual/unavailable,不得改写 P0 pass。

### 8.3 Gate / report / check 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--gate pr|main|nightly`;`--suite`;`--run-id`;`--artifact-root`;`--config-profile` | suite artifacts, stdout/stderr, `report.json` per suite | 非 0 阻断;保留 failure reason;不得删除 failed artifact |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id`;`--artifact-root`;`--report-root`;`--config-profile`;`--suite` optional | release suite artifacts and release gate summary input | 任一 P0 release suite failed 即阻断送验 |
| `scripts/gates/run_selected_p1_gate.sh` | gate | `--run-id`;`--artifact-root`;`--config-profile`;selected adapter refs | P1 selected-run artifact / unavailable marker | 不阻断 P0;缺环境只写 residual/unavailable |
| `scripts/reports/generate_reports.sh` | report | `--run-id`;`--artifact-root`;`--report-root` | `reports/runs/<run_id>/summary.md` and suite reports | artifact 缺失或 report 生成失败则非 0 |
| `scripts/reports/build_gate_summary.sh` | report | `--run-id`;`--report-root` | `reports/runs/<run_id>/gate-summary.md` | 不得覆盖 failed suite 为 passed |
| `scripts/reports/build_evidence_candidates.sh` | report | `--run-id`;`--artifact-root`;`--report-root` | `reports/runs/<run_id>/evidence-candidates.md` | 只能从 suite artifacts / reports 推导 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root`;`--report-root`;optional deny-list ref | `reports/runs/<run_id>/redaction-check.md` | 发现 raw body/secret/token/full ref 即阻断 |
| `scripts/checks/check_dependency_boundary.sh` | check | implementation dependency metadata or generated graph;`--artifact-root` | `reports/runs/<run_id>/dependency-boundary.md` | 非 `L0-core` sibling compile dependency 即阻断 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | `--artifact-root`;`--report-root` | `reports/runs/<run_id>/report-audit.md` | 任一 blocking suite 缺 raw artifact 或 report 即阻断 |
| `scripts/checks/check_no_static_evidence.sh` | check | reports and evidence candidate files | static evidence guard report | 发现静态 JSON 直接宣告 EV/VETO pass 即阻断 |

### 8.4 Artifact 与 report 输出映射表

| 输出项 | 路径 | 来源 | 要求 |
|---|---|---|---|
| suite raw report | `artifacts/test/<run_id>/suites/<suite>/report.json` | gate / suite execution | 必须符合 Step 13 raw artifact JSON schema,包含 suite、case refs、status、failure reason、duration、config profile、artifact digest |
| stdout / stderr | `artifacts/test/<run_id>/suites/<suite>/stdout.log`;`stderr.log` | gate execution | 可脱敏;不得含 raw secret/body |
| case result files | `artifacts/test/<run_id>/suites/<suite>/cases/*.json` | automated case runner | 必须符合 Step 13 raw artifact JSON schema,并回指 TC-GOV-* 和 EV-CAND-* |
| redaction scan raw | `artifacts/test/<run_id>/suites/redaction-boundary/report.json` | `check_redaction.sh` | failed 时不得回显 secret/body |
| dependency graph raw | `artifacts/test/<run_id>/suites/dependency-boundary/report.json` | `check_dependency_boundary.sh` | 必须能证明 only `L0-core` compile dependency |
| suite human report | `reports/runs/<run_id>/suites/<suite>.md` | `generate_reports.sh` | 从 raw artifact 生成 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | `build_gate_summary.sh` | 汇总 blocking/non-blocking suite,不得伪 pass |
| evidence candidates | `reports/runs/<run_id>/evidence-candidates.md` | `build_evidence_candidates.sh` | 仍为 EV-CAND,正式 EV 留 Step 13 |
| redaction check report | `reports/runs/<run_id>/redaction-check.md` | `check_redaction.sh` | release gate 必读 |
| dependency boundary report | `reports/runs/<run_id>/dependency-boundary.md` | `check_dependency_boundary.sh` | release gate 必读 |

### 8.5 Suite 到用例 / 候选证据映射表

| Suite | 测试切口 | 用例 ID | 证据候选 ID | artifact | report | 阻断级别 |
|---|---|---|---|---|---|---|
| `contract-domain-fast` | contracts/domain/state | TC-GOV-CONTRACT-001~004;TC-GOV-DOMAIN-001~005;TC-GOV-STATE-001~006 | EV-CAND-GOV-CONTRACT-*;EV-CAND-GOV-STATE-* | suite report + cases | suite md | P0 blocking |
| `service-flow-fast` | command/query/consumer service | TC-GOV-CMD-001~030;TC-GOV-QUERY-001~016;TC-GOV-CONSUMER-001~012 | EV-CAND-GOV-CMD-*;EV-CAND-GOV-QUERY-*;EV-CAND-GOV-CONSUMER-* | suite report + cases | suite md | P0 blocking |
| `infra-runtime-fake` | repository/fake/runtime/config profile | TC-GOV-IDEMP-001~010;TC-GOV-CONFIG-001~008 | EV-CAND-GOV-IDEMP-*;EV-CAND-GOV-CONFIG-* | suite report + cases | suite md | P0 blocking |
| `entry-worker-job` | API/worker/job entry | TC-GOV-CONTRACT-002~003;TC-GOV-CONSUMER-010~012;TC-GOV-JOB-001~010 | EV-CAND-GOV-CONTRACT-*;EV-CAND-GOV-CONSUMER-*;EV-CAND-GOV-JOB-* | suite report + cases | suite md | P0 blocking |
| `operations-replay-core` | outbox/projection/reference/reconcile/handoff/export | TC-GOV-OUTBOX-001~015;TC-GOV-JOB-001~010;TC-GOV-IDEMP-007~013 | EV-CAND-GOV-OUTBOX-*;EV-CAND-GOV-JOB-*;EV-CAND-GOV-IDEMP-* | replay artifacts | suite md | P0 blocking |
| `redaction-boundary` | no raw body/secret/full ref | TC-GOV-REDACTION-001~004;TC-GOV-CMD-030;TC-GOV-CONSUMER-004 | EV-CAND-GOV-REDACTION-* | redaction raw report | redaction-check.md | P0 blocking |
| `dependency-boundary` | no non-core sibling compile dependency | TC-GOV-ARCH-001 | EV-CAND-GOV-ARCH-001 | dependency graph report | dependency-boundary.md | P0 blocking |
| `release-main-smoke` | fixed governance business closure | Representative TC-GOV-CMD/QUERY/OUTBOX/JOB/CONFIG/REDACTION | EV-CAND-GOV-CORE-*;EV-CAND-GOV-TRACE-* | scenario artifact | suite md | P0 blocking |
| `report-generation-audit` | artifact/report/evidence candidate audit | all blocking suite pairing | EV-CAND-GOV-REPORT-* | pairing raw report | report-audit.md | P0 blocking |
| `p1-real-like-selected-run` | future real-like seam | future selected TC only | future EV-CAND-P1-* | selected-run artifact | selected-run md | non-P0 |

### 8.6 P0 手工测试与不可自动化清单

| 项 | 结论 | 处理 |
|---|---|---|
| P0 功能 / 配置 / redaction / dependency 用例 | 无不可自动化项 | 均进入 blocking suite 或 release check |
| 报告阅读与送验裁决 | 需要人工 / Agent 审查 | 不替代 suite pass;只用于 Step 13/06 |
| P1 real-like selected-run | 可人工触发 | unavailable 记录 residual;不计 P0 pass |
| P2 production-like / capacity | 当前不可执行 | Step 10/14 记录候选与残余风险 |

### 8.7 自动化门禁停审记录

| Suite / Gate | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PR gate | 是否覆盖快速阻断风险 | 通过 | main CI 继续覆盖 entry/replay/redaction |
| main CI gate | 是否覆盖全部 P0 自动化主体 | 通过 | release 再跑业务 smoke 和 report audit |
| nightly gate | 是否覆盖扩展 fault / partial / race | 通过 | 不得替代 release selected run |
| release gate | 是否有业务场景级 smoke、redaction、dependency、report audit | 通过 | 正式 EV 编号留 Step 13 |
| P1 selected-run | 是否未写成 P0 pass 前置 | 通过 | unavailable 记录 residual |
| script path | gate/report/check 是否放在规定目录 | 通过 | 不在 `reports/` 目录放生成脚本 |
| artifact/report | 是否使用固定根目录 | 通过 | `artifacts/test/<run_id>` and `reports/runs/<run_id>` |
| evidence candidate | 是否避免静态造证据 | 通过 | `check_no_static_evidence.sh` 阻断 |

### 8.8 跨 suite 门禁 / 证据审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 自动化缺口 | 通过 | 所有 TC-GOV-* P0 用例族已映射 suite |
| suite 重叠是否可接受 | 通过 | release smoke 是闭环证明,不替代底层 suite |
| 证据 ID 冲突 | 通过 | 当前仍为 EV-CAND,无正式 EV 冲突 |
| raw artifact/report 配对 | 通过 | `check_artifact_report_pairing.sh` 负责阻断 |
| release gate 覆盖 | 通过 | smoke/config/redaction/dependency/report audit 均覆盖 |
| redaction check | 通过 | artifact and report 都纳入 scan |
| static evidence risk | 通过 | 禁止静态 JSON 直接生成 EV/VETO passed |
| P1/P2 伪 pass 风险 | 通过 | selected-run unavailable 不计 P0 pass |

## 9. 对上游设计的影响判定

| 门禁结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 suite 均可从 Step 6~8 推导 | 否 | 测试方案自动化细化 | 无需回写 |
| release smoke 必须是业务场景级断言 | 否 | 防伪证据约束 | Step 13 继续承接 |
| evidence candidates 不得静态造证据 | 否 | 证据真实性约束 | Step 13 继续承接 |
| P1 selected-run 不阻断 P0 | 否 | 范围边界 | Step 14 记录 residual |
| 若后续要求真实 staging / performance pass | 是 | 验收基线变更 | 需回写 `05/06/07/09` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_09_automation_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“自动化套件表”“CI/CD 门禁图”“Gate / report / check 脚本表”“Artifact 与 report 输出映射表”“Suite 到用例 / 候选证据映射表”和“跨 suite 门禁 / 证据审计表”小节,了解 P0 用例如何进入自动化门禁。

正式 `05-测试方案.md` §9 应回填:

- P0 自动化由 PR、main CI、nightly、release gate 和 P1 selected-run 分层执行。
- PR gate 覆盖 contract/domain/service/config/dependency 快速阻断;main CI 覆盖 infra/runtime/entry/worker/job/operations/redaction;release gate 覆盖固定业务 smoke、config、redaction、dependency 和 report audit。
- 所有 gate 脚本必须位于 `scripts/gates/`,report 脚本位于 `scripts/reports/`,check 脚本位于 `scripts/checks/`。
- 所有 raw artifact 使用 `artifacts/test/<run_id>`;所有 run report 使用 `reports/runs/<run_id>`;不得引用 `latest`。
- Release smoke 必须输出场景级断言,不得用通用测试计数替代。
- Evidence candidate 必须从真实 suite artifact / report 推导,不得由静态 JSON 直接宣告通过。
- P1 real-like selected-run 和 P2 production-like / capacity 不作为当前 P0 pass 前置。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 具体测试 runner / framework 名称 | 影响实现仓脚本 | 当前只定义脚本契约,不指定实现框架 |
| `fault-injection-matrix` 是否拆成独立 release suite | 影响 release 时间 | 当前放 nightly;release 由 operations-replay-core 覆盖核心故障 |
| `reports/acceptance` 何时生成 | 影响送验材料 | Step 13 固定,本 Step 只生成 `reports/runs/<run_id>` |
| 正式 EV ID 与 AC/VETO 映射 | 影响验收标准 | Step 13 和后续 `06` 固定 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 自动化门禁清晰 | 通过 | 见 §8.1~§8.3 |
| 每个阻断 suite 已停审 | 通过 | 见 §8.7 |
| 跨 suite 门禁 / 证据审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 未提前固定正式 EV / acceptance verdict | 通过 | 仍使用 EV-CAND |
| 可进入 Step 10 | 通过 | 下一步设计专项测试与非功能验证;进入前等待用户审查 |
