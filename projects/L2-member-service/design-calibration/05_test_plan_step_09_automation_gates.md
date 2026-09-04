# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节：`05-测试方案.md` §9

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 自动化与 CI/CD 门禁 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 阻断套件可定位、可重复、可留证；脚本只定义 planned contract |
| 停审结论 | P0 门禁覆盖完整；无真实脚本、运行结果或 artifact 被伪造 |

## 2. 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | planned 脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `contract-domain-fast` | contracts、domain、state、redaction helper | PR / CI | 每次变更 | 阻断 P0 | `scripts/gates/run_contract_domain.sh` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| `service-flow-fast` | 10 Command、6 Query、5 Consumer service 编排、UoW/idempotency | PR / CI | application / protocol 变更 | 阻断 P0 | `scripts/gates/run_service_flow.sh` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` |
| `infra-runtime-fake` | logical stores、revision、rollback、builder、adapter fault | CI | infra / config / port 变更 | 阻断 P0 | `scripts/gates/run_infra_fake.sh` | `artifacts/test/<run_id>/suites/infra-runtime-fake/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| `entry-worker-job` | API / worker / job entry、receipt、report | CI / nightly | entry / worker / jobs 变更 | 阻断 P0 | `scripts/gates/run_entry_worker_job.sh` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` |
| `operations-replay-core` | outbox、projection、cleanup、handoff、duplicate replay | nightly / operations-replay | maintenance / recovery 变更 | 阻断 P0 | `scripts/gates/run_operations_replay.sh` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` |
| `config-redline` | profile、strict JSON、source priority、static boundary、builder | PR / CI | config 变更 | 阻断 P0 | `scripts/gates/run_config_redline.sh` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` |
| `redaction-boundary` | artifact/report/log/metric/audit forbidden-field scan | CI / release | output / evidence 变更 | 阻断 P0 | `scripts/gates/run_redaction_boundary.sh` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` |
| `dependency-boundary` | compile graph / seam classification | PR / release | Cargo / package / adapter change | 阻断 P0 | `scripts/gates/run_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` |
| `release-main-smoke` | minimal host-control flow + evidence completeness | release gate | release candidate | 阻断送验 | `scripts/gates/run_release_smoke.sh` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` |
| `real-like-selected-run` | P1 controlled / real-like sibling seam | selected staging future | explicit approved run | 告警 / residual | `scripts/gates/run_selected_integration.sh` | fixed run root | fixed run report |

## 3. 自动化门禁图

#### 自动化门禁图：L2-member-service 测试流水线

```text
PR
  -> contract-domain-fast
  -> service-flow-fast
  -> config-redline
  -> dependency-boundary
CI main
  -> infra-runtime-fake
  -> entry-worker-job
Nightly / operations-replay
  -> operations-replay-core
  -> recovery / concurrency sample
Release gate
  -> release-main-smoke
  -> redaction-boundary
  -> dependency-boundary
  -> evidence/report audit
```

关键说明：

- 图表达 suite 触发和阻断关系，不表达具体 CI 产品或部署命令。
- P0 gate 的 artifact root 固定为 `artifacts/test/<run_id>`；正式引用不得使用 `latest`。
- P1 selected run 失败或不可用进入 residual，不得被改写成 P0 passed。

## 4. Gate / report / check 脚本表

| 脚本 | 类型 | 计划参数 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|---|
| `scripts/gates/run_contract_domain.sh` | gate | `--run-id --artifact-root --config-profile` | source + fixtures | suite report/cases/artifacts | 非 0；保留 failed artifact |
| `scripts/gates/run_service_flow.sh` | gate | 同上 | app fake UoW + cases | suite artifacts | 阻断 merge |
| `scripts/gates/run_infra_fake.sh` | gate | 同上 | fake stores/adapters | suite artifacts | 不 fallback 空实现 |
| `scripts/gates/run_entry_worker_job.sh` | gate | 同上 | entry envelopes/jobs | suite artifacts | receipt/report 失败阻断 |
| `scripts/gates/run_operations_replay.sh` | gate | `--run-id --artifact-root --config-profile --replay-ref` | replay fixtures | replay artifacts | unknown/partial 可解释；不修 source |
| `scripts/gates/run_config_redline.sh` | gate | `--run-id --artifact-root --config-profile` | config corpus | validation artifacts | invalid config 非 0 |
| `scripts/gates/run_redaction_boundary.sh` | gate | `--run-id --artifact-root --report-root` | outputs/corpus | redaction artifact | 泄漏即 fail-closed |
| `scripts/gates/run_dependency_boundary.sh` | gate | `--run-id --artifact-root` | dependency graph | dependency artifact | forbidden edge 阻断 |
| `scripts/reports/generate_reports.sh` | report | `--run-id --artifact-root --report-root` | suite artifacts | `reports/runs/<run_id>/` | 缺 artifact 非 0 |
| `scripts/reports/generate_acceptance_handoff.sh` | report | `--run-id --report-root` | reports + residual | `reports/acceptance/` | 只生成待审初稿 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root --report-root` | artifact/report | redaction-check | 禁止字段非 0 |
| `scripts/checks/check_artifact_report_pairing.sh` | check | `--run-id --artifact-root --report-root` | raw + report | report-audit | orphan/missing pair 非 0 |
| `scripts/checks/check_no_static_evidence.sh` | check | `--run-id --artifact-root --report-root` | evidence index + source artifact | report-audit | 静态证据映射非 0 |

所有脚本当前仅为 planned contract，不创建、不运行、不声称实现存在。

## 5. Suite 到用例 / 证据候选映射

| Suite | 测试切口 / 用例 | 候选证据族 | 阻断 |
|---|---|---|---|
| contract-domain-fast | `TC-CONTRACT-*`、`TC-DOMAIN-*`、`TC-STATE-*` | `EV-CAND-CONTRACT/DOMAIN/STATE-*` | 是 |
| service-flow-fast | `TC-INTENT-*`…`TC-CLOSE-*`、`TC-QUERY-*`、`TC-IDEMP-*` | `EV-CAND-CMD/QUERY/IDEMP-*` | 是 |
| infra-runtime-fake | `TC-MATERIAL-*`、config builder、fault cases | `EV-CAND-MATERIAL/CONFIG/RECOVERY-*` | 是 |
| entry-worker-job | `TC-CONSUMER-*`、`TC-JOB-*`、entry negatives | `EV-CAND-CONSUMER/JOB-*` | 是 |
| operations-replay-core | `TC-JOB-*`、`TC-IDEMP-*`、handoff/projection | `EV-CAND-JOB/HANDOFF/RECOVERY-*` | 是 |
| config-redline | `TC-CONFIG-*` | `EV-CAND-CONFIG-*` | 是 |
| redaction-boundary | `TC-REDACTION-*` | `EV-CAND-REDACTION-*` | 是 |
| dependency-boundary | `TC-ARCH-001` | `EV-CAND-ARCH-*` | 是 |
| release-main-smoke | representative P0 core / config / redaction | `EV-CAND-CORE-*` | 是 |

## 6. P0 手工与不可自动化边界

| 场景 | 自动化状态 | 人工补充 | 证据要求 |
|---|---|---|---|
| 未闭合 sibling 正向联调 | 当前不可自动化 / blocked | 审查合同、记录 unavailable | safe blocker report；不得用人工“看起来成功”替代 |
| P1 staging selected run | future / waiting | 由授权 owner 复核环境和范围 | 固定 run_id、raw artifact + report；不可计 P0 |
| 设计边界 review | 可自动化部分 + 人工 | 审查 owner / scope / phase | reviewer note 不能替代 raw artifact |
| 证据交接说明 | report script 初稿 | 人 / Agent 审查 residual | acceptance handoff 仅待审 |

## 7. 自动化门禁停审与回填草稿

| 审计项 | 结论 |
|---|---|
| P0 主线不只依赖手工 | pass |
| 每个阻断 suite 有脚本位置、artifact、report | pass（planned） |
| artifact/report 使用固定 run root | pass |
| 失败 suite 保留失败材料 | pass |
| P1/P2 不伪装 P0 | pass |
| evidence 不由静态表直接生成 | pass；要求从真实 artifact/report 推导 |

正式 §9 应写 suite、触发位置、阻断级别、脚本路径、artifact/report 输出和自动化门禁图；只写 planned contract，不写实际脚本或结果。

- [x] P0 suite 覆盖切口。
- [x] 门禁失败处理明确。
- [x] 可进入 Step 10。
