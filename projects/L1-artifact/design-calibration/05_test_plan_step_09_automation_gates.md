# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节: `05-测试方案.md` §9 自动化与 CI/CD 门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 设计自动化与 CI/CD 门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 4 分层策略;Step 5 追溯矩阵;Step 6 用例矩阵;Step 7 测试数据;Step 8 环境矩阵;`03` Step 16 脚本契约 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_09_automation_gates.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步目标

定义 Artifact 的 P0 测试套件如何进入 PR、main CI、nightly、release gate 和 future selected-run,并固定 gate / report / check 脚本契约、artifact/report 输出根目录、失败处理和候选证据映射。

本 Step 只回答:

- 哪些 suite 进入 PR、main CI、nightly、release gate 或 P1 selected-run。
- 哪些 suite 对应 contract / service / fake integration / entry / replay / release 层。
- 哪些脚本负责 gate、report、redaction、dependency boundary、artifact/report pairing 和 no-static-evidence 审计。
- Step 6 的 `TC-ART-*` 与 `EV-CAND-ART-*` 如何映射到 suites、gates 和输出目录。
- flaky、timeout、依赖 unavailable、report 缺失和静态造证据如何按 Artifact 规则处理。

本 Step 不实现脚本,不固定实现仓测试函数名,不生成正式 evidence ID,不写验收 verdict,不修改正式 `05-测试方案.md`。正式 evidence index、acceptance handoff 和归档结构留给 Step 13 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 提供 Contract / Unit、Application service、Integration、API / Worker / Job entry、Release gate 分层 |
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供 `FR-ART` / `BR-ART` / `NFR-ART` / `VF-ART` 到测试切口和候选证据族的追溯 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 `TC-ART-CONTRACT-*`、`TC-ART-CMD-*`、`TC-ART-QUERY-*`、`TC-ART-CONSUMER-*`、`TC-ART-OUTBOX-*`、`TC-ART-RELAY-*`、`TC-ART-JOB-*`、`TC-ART-IDEMP-*`、`TC-ART-CONFIG-*`、`TC-ART-REDACTION-*`、`TC-ART-ARCH-*` |
| `05_test_plan_step_07_test_data.md` | 已完成 | 提供 `DS-ART-*` 数据集、run 隔离、fault profile、replay dataset 和 leak corpus |
| `05_test_plan_step_08_environment_config.md` | 已完成 | 提供四个 P0 profile、compile/runtime/event/handoff/replay 协作边界和 unavailable 处理 |
| `03_ddd_step_16_test_cuts.md` | 正式输入 | 提供 `scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/checks/check_redaction.sh` 的最小脚本契约 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 config gate、replay 证据、redaction scan 和 release handoff 约束 |
| `projects/L1-governance/design-calibration/05_test_plan_step_09_automation_gates.md` | 已读取 | 只作为 Step 9 粒度与框架参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 suite 必须进 PR? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary` 必须进 PR。它们覆盖 DTO / ref / state / no-body invariant、16 Command / 13 Query / 6 Consumer 的服务编排主线、strict JSON / no silent fallback / profile validation,以及唯一 compile-time upstream 边界。 |
| 哪些 suite 进入 main CI? | main CI 必须执行 PR suites,再加 `infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`。这是 Artifact 的 P0 自动化主门禁。 |
| 哪些 suite 进入 nightly? | nightly 必须执行 main CI suites,再加 `operations-replay-extended` 与 `report-generation-audit`。nightly 负责更宽 fault injection、partial failure、report pairing 和 no-static-evidence 审计。 |
| 哪些 suite 进入 release gate? | 当前 P0 release gate 由 `release-main-smoke`、`config-redline`、`dependency-boundary`、`redaction-boundary`、`operations-replay-core`、`report-generation-audit` 组成。它证明五个核心能力的最小闭环、四个 P0 profile 证据、operations replay 报告、redaction scan 和 dependency boundary。 |
| `PublishPendingArtifactRelays` 在自动化里如何定位? | 它始终是 worker-only internal relay publication facade,不并入 6 个 public jobs 计数。它在 `entry-worker-job` 中验证入口 / duplicate / report surface,在 `operations-replay-core` 中验证 pending relay publish、retryable / terminal failure 和 truth unchanged。 |
| 四个 P0 profile 如何进入 gate? | `ci-test` 是 PR / main 的主 profile;`integration-like` 承接 controlled seam 和 failure mapping;`operations-replay` 承接 replay / recovery / no-truth-repair;`local-dev` 只用于本地 smoke 和人工 sanity,不作为 release pass 主证据。 |
| flaky、timeout 和 unavailable 如何处理? | P0 suite 必须 deterministic。flaky、timeout、artifact 缺失、report 生成失败都算 failed run,不得自动重写为 pass。controlled unavailable 只有在用例明确断言 delayed / degraded / failed marker 时才可记通过;P1 selected-run unavailable 只记 residual / unavailable。 |
| 哪些 checks 必须阻断 release? | `check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 必须阻断 release。 |
| artifact 和 report 的固定根目录是什么? | 所有机器证据进入 `artifacts/test/<run_id>/...`;所有人类可读报告进入 `reports/runs/<run_id>/...`;不得引用 `latest` 或项目名二级目录。 |
| Step 9 是否固定正式 evidence ID? | 否。当前仍使用 `EV-CAND-ART-*` 候选证据族;正式 evidence index 和 acceptance handoff 留给 Step 13。 |
| 当前是否存在 P0 不可自动化项? | 没有。P0 的功能、配置、redaction、dependency、replay 和 no-write / no-truth-repair 都必须自动化。人工审查只阅读报告和残余风险,不替代 suite pass。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 4 | 已有分层策略,但未绑定 suites / gates | 本 Step 固定 suites 与 gate 层级 |
| Step 5 | 已有 `FR/BR/NFR/VF` 追溯,但没有自动化着陆点 | 本 Step 把 `TC-ART-*` / `EV-CAND-ART-*` 映射到 suites / reports |
| Step 6 | 用例已完整,但缺 PR / main / nightly / release 分配 | 本 Step 固定 suite taxonomy 和阻断级别 |
| Step 7 | 数据集已定义,但缺 artifact / report 输出约束 | 本 Step 固定 raw artifact、suite report、gate summary 与 evidence candidate 输出位 |
| Step 8 | 四个 P0 profile 已闭合,但还没有进入流水线职责 | 本 Step 固定 profile 到 gate 的使用边界 |
| `03` Step 16 | 只有 3 个基础脚本契约 | 本 Step 扩展 release gate、report audit、dependency boundary 和 no-static-evidence 脚本口径 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 自动化口径 | 只有“自动化候选” | 固定 suite、gate、profile、阻断级别 | 可直接交给实现仓落测试入口 |
| release 语义 | 只有“release gate 应证明最小闭环” | 固定 Artifact 五能力最小 smoke 链与必过 checks | 防止退化成通用测试计数 |
| relay / public job | 容易混成一类 | 明确 `PublishPendingArtifactRelays` 单列,public jobs 保持 6 个 | 防止统计和断言错位 |
| report / evidence | 只知道 Step 13 会归档 | 固定 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 的中间门禁口径 | 防止路径漂移和静态造证据 |
| config / redaction / dependency | 仍只是用例族 | 上升为 PR / release blocking gate | `VF-ART` 风险必须脚本化 |

## 7. 自动化设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否一个总 gate 跑完所有 P0 | A. 单套件;B. 分 suite 汇总 | 采用 B。方便把 contract、service、entry、replay、config、redaction、dependency 风险拆开定位。 |
| release smoke 是否只跑 happy path | A. 只跑一个 publish/query smoke;B. 跑五能力最小闭环并输出场景级断言 | 采用 B。Artifact 的 fact、version、lineage、baseline、consumable/reference 边界必须都进 release smoke。 |
| `operations-replay` 是否只是 nightly | A. nightly 才跑;B. main/release 也保留核心 replay suite | 采用 B。public jobs、relay facade、stored report replay 和 no-truth-repair 是 P0 红线。 |
| config 验证是否只放 release | A. 只在 release 检查;B. PR 起阻断 | 采用 B。strict JSON、高优先级非法不 fallback、topic completeness 都应尽早暴露。 |
| 证据是否现在固定正式 EV | A. 当前固定;B. 保持 `EV-CAND-ART-*` | 采用 B。Step 13 统一 evidence index 与 acceptance handoff。 |

## 8. 结构化中间产物

### 8.1 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `contract-domain-fast` | DTO / typed ref / metadata / digest / state matrix / body-free invariant | PR / main | `contracts`、`domain`、state carrier、protocol DTO 变更 | P0 blocking | `scripts/gates/run_ci_gate.sh --gate pr --suite contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| `service-flow-fast` | 16 Command、13 Query、6 Consumer 的 service 编排、duplicate、conflict、no-write | PR / main | `application`、command/query/consumer flow、UoW/idempotency 变更 | P0 blocking | `scripts/gates/run_ci_gate.sh --gate pr --suite service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| `config-redline` | strict JSON、source priority、profile isolation、topic completeness、replay root、forbidden boundary override | PR / main / release | `04` 对应 config/runtime builder 变更;release candidate | P0 blocking | `scripts/gates/run_ci_gate.sh --suite config-redline` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` |
| `dependency-boundary` | 仅 `L0-core/core-contracts` compile-time upstream;非 core sibling 仅 seam 协作 | PR / main / release | manifest / dependency graph 变更;release candidate | P0 blocking | `scripts/checks/check_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` |
| `infra-runtime-fake` | repository/UoW 语义、runtime builder、fake resolver/publisher/handoff、四个 P0 profile 装配、idempotency / write-audit helper | main | merge to main;infra/runtime/config test change | P0 blocking | `scripts/gates/run_ci_gate.sh --gate main --suite infra-runtime-fake` | `artifacts/test/<run_id>/suites/infra-runtime-fake/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| `entry-worker-job` | API handler、worker consumer disposition、worker-only relay loop、6 public job runner input / duplicate / report surface | main | merge to main;`api`/`worker`/`jobs` 入口层变更 | P0 blocking | `scripts/gates/run_ci_gate.sh --gate main --suite entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` |
| `operations-replay-core` | 8 outbound payload snapshots、`PublishPendingArtifactRelays`、6 public jobs、stored report replay、no-truth-repair、replay root 主链 | main / release | merge to main;release candidate;replay/job/outbox/handoff path 变更 | P0 blocking | `scripts/gates/run_ci_gate.sh --suite operations-replay-core` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| `redaction-boundary` | logs / metrics / audit / trace / report / outbox / handoff forbidden body scan | main / release | merge to main;release candidate;output shape change | P0 blocking | `scripts/checks/check_redaction.sh` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` |
| `operations-replay-extended` | wider fault injection、commit unknown、rollback failure、publisher race、reference unresolved、partial report 保留 | nightly | scheduled nightly;pre-release replay deep run | P0 blocking for nightly | `scripts/gates/run_ci_gate.sh --gate nightly --suite operations-replay-extended` | `artifacts/test/<run_id>/suites/operations-replay-extended/` | `reports/runs/<run_id>/suites/operations-replay-extended.md` |
| `report-generation-audit` | raw artifact/report pairing、candidate evidence deriv出、no-static-evidence、防止空报告伪 pass | nightly / release | nightly and release after reports generation | P0 blocking | `scripts/checks/check_artifact_report_pairing.sh`;`scripts/checks/check_no_static_evidence.sh` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` |
| `release-main-smoke` | Artifact 五能力最小业务闭环: intake -> fact -> version -> lineage / baseline -> consumable ref / backref -> query / trace -> relay / replay report | release | release candidate only | P0 blocking | `scripts/gates/run_release_gate.sh --suite release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` |
| `p1-real-like-selected-run` | future durable-like or real-like seam selected-run | selected P1 | explicit operator / agent selected-run only | non-P0 | `scripts/gates/run_selected_p1_gate.sh` | `artifacts/test/<run_id>/suites/p1-real-like-selected-run/` | `reports/runs/<run_id>/suites/p1-real-like-selected-run.md` |

### 8.2 CI/CD 门禁图: L1-artifact 自动化门禁

```text
Developer / PR
  -> run_ci_gate.sh --gate pr --config-profile ci-test
     -> contract-domain-fast
     -> service-flow-fast
     -> config-redline
     -> dependency-boundary

Main branch
  -> run_ci_gate.sh --gate main --config-profile ci-test
     -> PR suites
     -> infra-runtime-fake
     -> entry-worker-job
     -> operations-replay-core
     -> redaction-boundary
     -> generate_reports.sh

Nightly
  -> run_ci_gate.sh --gate nightly --config-profile operations-replay
     -> main suites
     -> operations-replay-extended
     -> report-generation-audit
     -> generate_reports.sh

Release candidate
  -> run_release_gate.sh --run-id <run_id>
     -> release-main-smoke
     -> config-redline
     -> dependency-boundary
     -> redaction-boundary
     -> operations-replay-core
     -> report-generation-audit
     -> generate_reports.sh

P1 selected-run
  -> run_selected_p1_gate.sh
     -> p1-real-like-selected-run
     -> unavailable only records residual / unavailable
```

关键说明:

- `local-dev` 只服务本地 smoke 和人工 sanity,不进入 P0 blocking gate。
- `ci-test` 承担 PR / main 的 deterministic 主证据;`integration-like` 可作为 `infra-runtime-fake` 和 `entry-worker-job` 的受控 seam 运行模式;`operations-replay` 承担 replay suites。
- release gate 必须输出场景级闭环断言,不得用总测试数或单一 `cargo test` 替代。
- `latest` 不能作为 gate 输入、artifact root 或 report root。

### 8.3 Gate / report / check 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--gate pr|main|nightly`;`--suite`;`--run-id`;`--artifact-root`;`--config-profile` | suite raw artifacts、stdout/stderr、per-suite `report.json` | 非 0 即阻断;timeout / flaky / artifact 缺失都视为 failed suite,并保留 partial artifacts |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id`;`--artifact-root`;`--report-root`;`--config-profile`;`--suite` optional | release suite artifacts + release gate summary input | 任一 P0 suite/check failed 即阻断送验 |
| `scripts/gates/run_selected_p1_gate.sh` | gate | `--run-id`;`--artifact-root`;`--config-profile`;selected adapter refs / provider refs | selected-run raw artifacts、unavailable marker | 不阻断 P0;只记录 residual / unavailable |
| `scripts/reports/generate_reports.sh` | report | `--run-id`;`--artifact-root`;`--report-root` | suite reports、run summary | raw artifact 缺失或报告生成失败即非 0 |
| `scripts/reports/build_gate_summary.sh` | report | `--run-id`;`--report-root` | `reports/runs/<run_id>/gate-summary.md` | 不得把 failed suite 改写为 passed |
| `scripts/reports/build_evidence_candidates.sh` | report | `--run-id`;`--artifact-root`;`--report-root` | `reports/runs/<run_id>/evidence-candidates.md` | 只能从真实 suite artifact / suite reports 推导 `EV-CAND-ART-*` |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root`;`--report-root`;optional deny-list ref | `reports/runs/<run_id>/redaction-check.md` | 发现 raw body、external body、secret、credential、full sensitive ref、archive package body 即阻断 |
| `scripts/checks/check_dependency_boundary.sh` | check | dependency metadata / generated graph;`--artifact-root` | `reports/runs/<run_id>/dependency-boundary.md` | 发现非 `core-contracts` sibling compile dependency 即阻断 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | `--artifact-root`;`--report-root` | `reports/runs/<run_id>/report-audit.md` | 任一 blocking suite 缺 raw artifact、缺 suite report 或 case refs 丢失即阻断 |
| `scripts/checks/check_no_static_evidence.sh` | check | reports、candidate evidence files、gate summary | static evidence guard report | 发现静态 JSON / 手写 markdown 直接宣告通过而没有 raw artifact 回指即阻断 |

### 8.4 Artifact 与 report 输出映射表

| 输出项 | 路径 | 来源 | 要求 |
|---|---|---|---|
| suite raw report | `artifacts/test/<run_id>/suites/<suite>/report.json` | gate / suite runner | 必须包含 suite、profile、case refs、status、failure reason、duration、artifact digests |
| suite stdout / stderr | `artifacts/test/<run_id>/suites/<suite>/stdout.log`;`stderr.log` | gate execution | 允许 redacted diagnostics;禁止 raw body/secret/full sensitive ref |
| case raw results | `artifacts/test/<run_id>/suites/<suite>/cases/*.json` | automated case runner | 必须回指 `TC-ART-*` 和 `EV-CAND-ART-*` |
| replay / handoff raw | `artifacts/test/<run_id>/suites/operations-replay-core/*.json` | replay/job runner | 必须能回指 replay dataset、job report ref、handoff marker ref |
| redaction scan raw | `artifacts/test/<run_id>/suites/redaction-boundary/report.json` | `check_redaction.sh` | failed 时只输出 redacted finding |
| dependency graph raw | `artifacts/test/<run_id>/suites/dependency-boundary/report.json` | `check_dependency_boundary.sh` | 必须证明 compile-time upstream 只有 `core-contracts` |
| suite human report | `reports/runs/<run_id>/suites/<suite>.md` | `generate_reports.sh` | 从 raw artifacts 生成,不得人工伪造 |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | `build_gate_summary.sh` | 汇总 blocking/non-blocking suites、profile、residual 和 failed reasons |
| evidence candidates | `reports/runs/<run_id>/evidence-candidates.md` | `build_evidence_candidates.sh` | 当前只保留 `EV-CAND-ART-*`,正式 evidence 留 Step 13 |
| redaction check report | `reports/runs/<run_id>/redaction-check.md` | `check_redaction.sh` | release gate 必读 |
| dependency boundary report | `reports/runs/<run_id>/dependency-boundary.md` | `check_dependency_boundary.sh` | release gate 必读 |
| report audit report | `reports/runs/<run_id>/report-audit.md` | pairing/static-evidence checks | 证明 raw artifact/report/evidence candidate 三者可追溯 |

### 8.5 Suite 到用例 / 候选证据映射表

| Suite | 测试切口 | 用例 ID | 证据候选 ID | artifact | report | 阻断级别 |
|---|---|---|---|---|---|---|
| `contract-domain-fast` | contracts / state / body-free invariant | `TC-ART-CONTRACT-001~004`;`TC-ART-STATE-001~003` | `EV-CAND-ART-CONTRACT-*`;`EV-CAND-ART-STATE-*` | suite report + case results | suite md | P0 blocking |
| `service-flow-fast` | command / query / consumer service orchestration | `TC-ART-CMD-001~016`;`TC-ART-QUERY-001~013`;`TC-ART-CONSUMER-001~006` | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*` | suite report + case results | suite md | P0 blocking |
| `config-redline` | config validation / boundary / profile assembly entry | `TC-ART-CONFIG-001~004` | `EV-CAND-ART-CONFIG-*` | suite report + config negatives | suite md | P0 blocking |
| `dependency-boundary` | static architecture boundary | `TC-ART-ARCH-001` | `EV-CAND-ART-ARCH-001` | dependency graph report | dependency-boundary.md | P0 blocking |
| `infra-runtime-fake` | repository / UoW / fake adapter / runtime builder / idempotency | `TC-ART-IDEMP-001~007`;selected `TC-ART-CONFIG-001~004` | `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-CONFIG-*` | suite report + fault artifacts | suite md | P0 blocking |
| `entry-worker-job` | API / worker / job entry surfaces | `TC-ART-CONSUMER-001~006`;`TC-ART-JOB-001~006`;`TC-ART-RELAY-001`;selected `TC-ART-CONTRACT-002~003` | `EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` | suite report + entry artifacts | suite md | P0 blocking |
| `operations-replay-core` | outbox / relay / jobs / replay / no-truth-repair | `TC-ART-OUTBOX-001~008`;`TC-ART-RELAY-001`;`TC-ART-JOB-001~006`;`TC-ART-IDEMP-002~007` | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*`;`EV-CAND-ART-IDEMP-*` | replay artifacts + job reports | suite md | P0 blocking |
| `redaction-boundary` | forbidden body / secret / high-cardinality output | `TC-ART-REDACTION-001~002`;selected leak assertions from `TC-ART-CMD-*`;`TC-ART-CONSUMER-*`;`TC-ART-OUTBOX-*`;`TC-ART-JOB-*` | `EV-CAND-ART-REDACTION-*` | redaction raw report | redaction-check.md | P0 blocking |
| `operations-replay-extended` | wider recovery / race / fault matrix | selected deep-run `TC-ART-IDEMP-*`;`TC-ART-JOB-*`;`TC-ART-OUTBOX-*` | selected `EV-CAND-ART-IDEMP-*`;`EV-CAND-ART-JOB-*`;`EV-CAND-ART-OUTBOX-*` | extended replay artifacts | suite md | nightly blocking |
| `report-generation-audit` | cross-suite raw/report/evidence deriv出 | all blocking suites aggregate | all `EV-CAND-ART-*` aggregate | report-audit raw artifacts | report-audit.md | P0 blocking |
| `release-main-smoke` | fact / version / lineage / baseline / consumption 最小闭环 | representative `TC-ART-CMD-*`;`TC-ART-QUERY-*`;`TC-ART-OUTBOX-*`;`TC-ART-JOB-*`;`TC-ART-CONFIG-*` | `EV-CAND-ART-CORE-*`;`EV-CAND-ART-TRACE-*`;selected `EV-CAND-ART-*` | scenario artifacts | suite md | P0 blocking |
| `p1-real-like-selected-run` | future selected-run seam | future selected TC only | future `EV-CAND-ART-P1-*` | selected-run artifacts | selected-run md | non-P0 |

### 8.6 P0 手工测试与不可自动化清单

| 项 | 结论 | 处理 |
|---|---|---|
| P0 功能 / 配置 / replay / redaction / dependency 用例 | 无不可自动化项 | 均进入 blocking suites 或 blocking checks |
| 报告阅读与送验裁决 | 需要人工 / Agent 审查 | 只消费 `reports/runs/<run_id>` 与后续 Step 13 handoff,不替代 suite pass |
| `local-dev` 本地 smoke | 可人工执行 | 不计入 release pass 证据主链 |
| `p1-real-like-selected-run` | 可人工或半自动触发 | unavailable 仅记 residual,不改变 P0 gate 结论 |
| P2 production-like / capacity / SLO | 当前不可执行 | Step 10 / Step 14 记录候选与残余风险 |

### 8.7 自动化门禁停审记录

| Suite / Gate | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PR gate | 是否前置 DTO / state / service / config / dependency 快速阻断风险 | 通过 | main CI 继续承接 entry、replay 和 redaction |
| main CI gate | 是否覆盖全部 P0 自动化主体 | 通过 | release 再做最小业务闭环和 cross-suite audit |
| nightly gate | 是否补足 recovery / race / report audit 深跑 | 通过 | 不替代 release gate |
| release gate | 是否证明五能力最小闭环、config、dependency、redaction、operations replay | 通过 | 正式 evidence 编号留 Step 13 |
| `PublishPendingArtifactRelays` | 是否独立于 6 public jobs | 通过 | 在 entry 和 replay 两层都单列 |
| artifact/report 根目录 | 是否固定且不引用 `latest` | 通过 | 统一 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` |
| timeout / flaky 处理 | 是否禁止伪 pass | 通过 | timeout / flaky 都保留 failed artifact |
| static evidence risk | 是否有脚本阻断 | 通过 | `check_no_static_evidence.sh` 负责阻断 |

### 8.8 跨 suite 门禁 / 证据审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 自动化缺口 | 通过 | 所有 `TC-ART-*` P0 家族都有 suite 或 blocking check 对应 |
| suite 重叠是否可接受 | 通过 | `entry-worker-job` 与 `operations-replay-core` 的 overlap 用于分离入口 surface 与 replay semantics |
| `PublishPendingArtifactRelays` 是否被误算为 public job | 否 | 已单列 `TC-ART-RELAY-001` 和专属 suite 映射 |
| raw artifact/report 配对 | 通过 | `check_artifact_report_pairing.sh` 阻断缺失 |
| no static evidence | 通过 | `check_no_static_evidence.sh` 阻断静态宣告 |
| release gate 覆盖 | 通过 | smoke/config/dependency/redaction/operations replay/report audit 均覆盖 |
| redaction check | 通过 | artifacts 与 reports 都纳入 scan |
| P1/P2 伪 pass 风险 | 通过 | selected-run unavailable 不计 P0 pass |

## 9. 对上游设计的影响判定

| 门禁结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 suites 可直接从 Step 4~8 推导 | 否 | 测试方案自动化细化 | 无需回写 |
| release smoke 必须覆盖 fact / version / lineage / baseline / consumption 最小闭环 | 否 | release 证据约束 | Step 13 继续承接 |
| raw artifact/report/evidence candidate 只能从真实 run 推导 | 否 | 证据真实性约束 | Step 13 继续承接 |
| `PublishPendingArtifactRelays` 必须保持独立口径 | 否 | 协议统计与测试门禁澄清 | 保持当前闭口 |
| 若未来把真实 durable-like / real-like seam 升级为 P0 | 是 | 测试与验收基线变更 | 需回写 `05/06/07/09` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_09_automation_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“自动化套件表”“CI/CD 门禁图”“Gate / report / check 脚本表”“Artifact 与 report 输出映射表”“Suite 到用例 / 候选证据映射表”和“跨 suite 门禁 / 证据审计表”小节。

正式 `05-测试方案.md` §9 应回填:

- P0 自动化由 PR、main CI、nightly、release gate 和 P1 selected-run 分层执行。
- PR gate 覆盖 contract/domain/service/config/dependency;main CI 覆盖 infra/runtime/entry/worker/job/replay/redaction;release gate 覆盖五能力最小闭环、config、dependency、redaction、operations replay 和 report audit。
- `PublishPendingArtifactRelays` 是 worker-only internal facade,必须单列自动化和证据口径,不得并入 6 个 public jobs。
- 所有 gate 脚本位于 `scripts/gates/`;报告脚本位于 `scripts/reports/`;检查脚本位于 `scripts/checks/`。
- 所有 raw artifact 固定使用 `artifacts/test/<run_id>`;所有 run report 固定使用 `reports/runs/<run_id>`;不得引用 `latest`。
- timeout、flaky、artifact 缺失、report 缺失和静态造证据都必须按 failed run 处理。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 13 是否把 `build_evidence_candidates.sh` 升格为正式 `evidence-index` 生成口径 | 影响正式 evidence 命名 | 当前保持候选证据口径 |
| selected-run 未来是否拆成 durable-like 与 real-like 两条 | 影响 P1 报告粒度 | 当前合并为 `p1-real-like-selected-run` |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| PR / main / nightly / release / selected-run 门禁已闭合 | 通过 | 见 §8.1 / §8.2 |
| 所有 P0 用例族都有 suite 或 blocking check | 通过 | 见 §8.5 / §8.8 |
| artifact / report / candidate evidence 路径已固定 | 通过 | 见 §8.3 / §8.4 |
| timeout / unavailable / no-static-evidence 处理已明确 | 通过 | 见 §4 / §8.7 |
| 可进入 Step 10 | 通过 | 下一步设计专项测试与非功能验证;进入前等待用户审查 |
