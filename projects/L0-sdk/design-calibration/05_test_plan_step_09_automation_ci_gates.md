# L0-sdk 05 测试方案 Step 9:设计自动化与 CI/CD 门禁

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §9 自动化与 CI/CD 门禁
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 设计自动化与 CI/CD 门禁 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_09_automation_ci_gates.md` |

本步定义 P0 测试套件如何自动执行、在哪些 CI 阶段阻断、由哪些脚本承载,以及 artifact / report 输出如何命名。专项测试细节留给 Step 10,报告归档格式留给 Step 13,实施排期和 commit boundary 留给 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 继承 unit / service / integration / contract / smoke / candidate gate 分层和阻断策略 |
| `05_test_plan_step_06_cases.md` | 继承 `TC-SDK-*` 用例族和自动化候选 |
| `05_test_plan_step_07_test_data.md` | 继承 `run_id`、`artifacts/test/<run_id>`、`reports/runs/<run_id>` 和数据隔离规则 |
| `05_test_plan_step_08_environment_config.md` | 继承 `local-dev`、`ci-test`、`integration-test`、`candidate-validation` profile 和依赖协作方式 |
| `03-详细设计.md` §15 | 继承脚本与产物最小契约 |
| `04-配置设计.md` §9 / §11 / §12 | 继承配置加载、失效模式和下游测试承接 |

## 3. SOP 问题回答

### 3.1 哪些 suite 必须进 PR?

| Suite | 进入 PR 的原因 | 阻断级别 |
|---|---|---|
| `SUITE-SDK-PR-UNIT` | domain object、enum、policy guard 和 candidate / compatibility 规则必须最早发现 | PR-blocking |
| `SUITE-SDK-PR-CONTRACT` | Command / Query / Event / Job DTO、error envelope 和 schema roundtrip 不能漂移 | PR-blocking |
| `SUITE-SDK-PR-SERVICE` | application service、UoW、idempotency、outbox、projection 编排必须稳定 | PR-blocking |
| `SUITE-SDK-PR-CONFIG` | strict JSON、unknown key、raw secret、disabled redaction 等配置红线必须阻断 | PR-blocking |
| `SUITE-SDK-PR-REDACTION` | raw body、secret、credential value 不得进入临时 artifact / report | PR-blocking |

### 3.2 哪些 suite 进 main CI?

| Suite | main CI 覆盖 | 阻断级别 |
|---|---|---|
| `SUITE-SDK-MAIN-INTEGRATION` | repository、adapter、runner、artifact store、projection、outbox、filesystem path | main-blocking |
| `SUITE-SDK-MAIN-EVENT` | bus event semantic mapping、fake boundary、event replay、duplicate event | main-blocking |
| `SUITE-SDK-MAIN-PACKAGE-SURFACE` | Rust facade、Python package surface、TypeScript package surface shape | main-blocking |
| `SUITE-SDK-MAIN-REPORT-CHECK` | artifacts / reports path、redaction scan、report completeness | main-blocking |

### 3.3 哪些 suite 进 nightly?

| Suite | nightly 覆盖 | 失败处理 |
|---|---|---|
| `SUITE-SDK-NIGHTLY-COMPAT-REGRESSION` | compatibility matrix、deprecated lifecycle、migration ref 组合 | 失败阻断 candidate promotion,不自动回滚 main |
| `SUITE-SDK-NIGHTLY-CONCURRENCY` | expected version、idempotency、job race、outbox retry、projection rebuild | 失败阻断 candidate promotion,创建缺陷 |
| `SUITE-SDK-NIGHTLY-LANGUAGE-SMOKE` | 三语言更宽组合 smoke 和 docs examples | 失败阻断 candidate promotion,保留 evidence |

### 3.4 哪些 suite 是 staging smoke 或 release gate?

| Suite | 类型 | 当前 P0 结论 |
|---|---|---|
| `SUITE-SDK-CANDIDATE-BUILD` | candidate gate | P0 阻断 `Verified` |
| `SUITE-SDK-CANDIDATE-DOCS` | candidate gate | P0 阻断 `Verified` |
| `SUITE-SDK-CANDIDATE-SMOKE` | candidate gate | P0 阻断 `Verified` / `Stable` |
| `SUITE-SDK-CANDIDATE-COMPAT` | candidate gate | P0 阻断 `Stable` |
| `SUITE-SDK-CANDIDATE-REDACTION` | candidate gate | P0 阻断 `Verified` / `Stable` |
| `SUITE-SDK-STAGING-SMOKE` | staging smoke | P1,仅在 staging-like profile 明确启用时运行 |

当前 release gate 是 local candidate gate,不触发 crates.io、PyPI、npm 或其他 public registry 发布。

### 3.5 flaky、超时和依赖故障如何处理?

| 类型 | 处理规则 |
|---|---|
| 业务断言失败 | 不重试为通过;直接阻断对应 gate |
| deterministic test flaky | 视为测试设计或并发隔离缺陷;阻断 P0,必须修复或隔离 |
| 明确基础设施故障 | 可使用同一 `run_id` 或新 `run_id` 重跑一次,但首次失败 artifact 必须保留 |
| timeout | 记录 timeout category、suite、case id 和 partial artifact;阻断 gate |
| fake / runner unavailable | 按 Step 8 处理为 fail-fast 或 evidence failed / skipped,不得视为 passed |
| nightly failure | 不自动回滚 main,但阻断 candidate promotion 并生成缺陷 |

### 3.6 每个阻断 suite 由哪个 `scripts/gates/*.sh` 执行?

| Suite | Gate 脚本 |
|---|---|
| PR suite | `scripts/gates/run_pr_gate.sh` |
| main integration suite | `scripts/gates/run_main_gate.sh` |
| nightly regression suite | `scripts/gates/run_nightly_gate.sh` |
| candidate validation suite | `scripts/gates/run_candidate_gate.sh` |
| staging smoke suite | `scripts/gates/run_staging_smoke.sh` |

### 3.7 每个 gate 的默认 `artifact-root` 是否为 `artifacts/test/<run_id>`?

是。所有 gate 默认 artifact root 必须是 `artifacts/test/<run_id>`。允许在命令参数中传入 `--artifact-root artifacts/test/<run_id>`,但不得使用 `artifacts/test/<project>/<run_id>` 或 `artifacts/sdk/<run_id>` 作为正式测试输出根。

### 3.8 每个 gate 是否支持 `--run-id`、`--artifact-root`、`--config-profile`?

是。所有 `scripts/gates/*.sh` 必须支持:

```text
--run-id <run_id>
--artifact-root artifacts/test/<run_id>
--config-profile <local-dev|ci-test|integration-test|candidate-validation|staging-like>
```

candidate gate 还可以支持 `--report-root reports/runs/<run_id>` 和 `--config-path <path>`,但 `--config-path` 只是 selector,不能变成全局配置覆盖层。

### 3.9 哪些 `scripts/checks/*.sh` 必须进入 release gate?

| Check 脚本 | release gate 作用 |
|---|---|
| `scripts/checks/check_redaction.sh` | 扫描 artifacts / reports / logs / evidence 是否含 raw body、secret、credential value |
| `scripts/checks/check_artifact_paths.sh` | 验证 artifact root 只使用 `artifacts/test/<run_id>` |
| `scripts/checks/check_report_completeness.sh` | 验证必须证据和 report item 不缺失 |
| `scripts/checks/check_no_public_registry_side_effect.sh` | 验证 P0 candidate gate 未触发 public registry 发布 |

### 3.10 哪些 `scripts/reports/*.sh` 在 gate 后生成 `reports/runs/<run_id>`?

| Report 脚本 | 生成内容 |
|---|---|
| `scripts/reports/generate_reports.sh` | 汇总 gate artifact、case result、evidence ref、redaction result 到 `reports/runs/<run_id>` |
| `scripts/reports/generate_acceptance_summary.sh` | 从 run report 生成可供验收引用的摘要到 `reports/acceptance` |

报告生成脚本只能放在 `scripts/reports/`,不得放在 `reports/` 输出目录下。正式 gate 不得引用 `latest`。

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 自动化与门禁边界不清,没有固定脚本目录、参数、artifact root 和 report root |
| `03-详细设计.md` §15 | 已定义最小脚本契约,但没有完整 PR / main / nightly / candidate 分阶段矩阵 |
| `05_test_plan_step_08_environment_config.md` | 已定义 profile 和依赖类型,本步需要把 profile 转成 gate 执行位置 |
| 当前测试方案链路 | 若不补 Step 9,后续 Step 13 证据归档和 Step 15 正式文档无法形成稳定脚本引用 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 自动化范围 | 只知道 P0 需自动化 | 明确 PR、main、nightly、candidate、staging 各自 suite |
| 阻断级别 | 未固定 | PR-blocking、main-blocking、candidate-blocking、promotion-blocking、non-P0 分开 |
| 脚本位置 | 容易把脚本放到输出目录 | gate / check / report 脚本分别固定在 `scripts/gates/`、`scripts/checks/`、`scripts/reports/` |
| 输出路径 | 旧式项目层级风险 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| release 语义 | 容易误解为 public registry 发布 | 当前只定义 local candidate gate,不发布公共 registry |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否把全部 P0 套件都放 PR | 不全部放 PR | PR 跑快速阻断项;integration、candidate、nightly 分阶段承接成本更高的验证 |
| 是否允许人工测试替代 P0 gate | 不允许 | P0 主线必须自动化,人工只审查报告和风险 |
| 是否允许 flaky 测试通过后放行 | 不允许 | flaky 本身是 P0 稳定性风险 |
| 是否把 nightly failure 直接回滚 main | 不直接回滚 | nightly 用于发现组合风险,但阻断 candidate promotion |
| 是否用 `latest` 简化报告引用 | 不允许 | 验收证据必须由稳定 `run_id` 追溯 |

## 7. 结构化中间产物

### 7.1 CI/CD 门禁图

```text
[pull request]
      |
      v
[scripts/gates/run_pr_gate.sh]
      |-- unit / policy / state
      |-- contract / DTO / event / job schema
      |-- service / config / redaction
      v
[PR merge allowed]
      |
      v
[main branch]
      |
      v
[scripts/gates/run_main_gate.sh]
      |-- integration / adapter / event replay
      |-- package surface / report check
      v
[main candidate artifacts]
      |
      +--------------+
      |              |
      v              v
[nightly gate]  [candidate gate]
      |              |
      |              v
      |    [scripts/gates/run_candidate_gate.sh]
      |              |
      v              v
[promotion blocked if failed] -> [local Stable allowed if evidence passed]
```

说明:

- 每个 gate 必须携带 `--run-id`、`--artifact-root` 和 `--config-profile`。
- gate 输出原始产物到 `artifacts/test/<run_id>`。
- report 脚本在 gate 后读取 artifact,输出到 `reports/runs/<run_id>` 或 `reports/acceptance`。
- 图中的 candidate gate 不表示 public registry 发布。

### 7.2 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `SUITE-SDK-PR-UNIT` | domain、state、policy、compat rules | PR | code / test / design contract changed | PR-blocking | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/pr/unit` | `reports/runs/<run_id>` |
| `SUITE-SDK-PR-CONTRACT` | DTO、event、job、error envelope | PR | protocol / contract changed | PR-blocking | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/pr/contract` | `reports/runs/<run_id>` |
| `SUITE-SDK-PR-SERVICE` | command / query / event consumer orchestration | PR | application / domain changed | PR-blocking | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/pr/service` | `reports/runs/<run_id>` |
| `SUITE-SDK-PR-CONFIG` | config parse / validate / builder | PR | config / runtime changed | PR-blocking | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/pr/config` | `reports/runs/<run_id>` |
| `SUITE-SDK-MAIN-INTEGRATION` | repository、adapter、runner、artifact、projection、outbox | main CI | merge to main | main-blocking | `scripts/gates/run_main_gate.sh` | `artifacts/test/<run_id>/main/integration` | `reports/runs/<run_id>` |
| `SUITE-SDK-MAIN-EVENT` | bus semantic mapping、fake boundary、event replay | main CI | merge to main | main-blocking | `scripts/gates/run_main_gate.sh` | `artifacts/test/<run_id>/main/event` | `reports/runs/<run_id>` |
| `SUITE-SDK-MAIN-REPORT-CHECK` | artifact path、report completeness、redaction | main CI | gate artifact generated | main-blocking | `scripts/gates/run_main_gate.sh` + `scripts/checks/*.sh` | `artifacts/test/<run_id>/main/checks` | `reports/runs/<run_id>` |
| `SUITE-SDK-NIGHTLY-COMPAT-REGRESSION` | compatibility / deprecated / migration matrix | nightly | scheduled | promotion-blocking | `scripts/gates/run_nightly_gate.sh` | `artifacts/test/<run_id>/nightly/compat` | `reports/runs/<run_id>` |
| `SUITE-SDK-NIGHTLY-CONCURRENCY` | idempotency、expected version、job race、outbox retry | nightly | scheduled | promotion-blocking | `scripts/gates/run_nightly_gate.sh` | `artifacts/test/<run_id>/nightly/concurrency` | `reports/runs/<run_id>` |
| `SUITE-SDK-CANDIDATE-BUILD` | package candidate generation and build | candidate validation | candidate requested | candidate-blocking | `scripts/gates/run_candidate_gate.sh` | `artifacts/test/<run_id>/candidate/build` | `reports/runs/<run_id>` |
| `SUITE-SDK-CANDIDATE-DOCS` | quickstart、docstring、examples | candidate validation | candidate built | candidate-blocking | `scripts/gates/run_candidate_gate.sh` | `artifacts/test/<run_id>/candidate/docs` | `reports/runs/<run_id>` |
| `SUITE-SDK-CANDIDATE-SMOKE` | Rust / Python / TypeScript smoke | candidate validation | candidate built | candidate-blocking | `scripts/gates/run_candidate_gate.sh` | `artifacts/test/<run_id>/candidate/smoke` | `reports/runs/<run_id>` |
| `SUITE-SDK-CANDIDATE-COMPAT` | compatibility decision and migration ref | candidate validation | evidence available | candidate-blocking | `scripts/gates/run_candidate_gate.sh` | `artifacts/test/<run_id>/candidate/compat` | `reports/runs/<run_id>` |
| `SUITE-SDK-STAGING-SMOKE` | staging-like endpoint smoke | staging | explicit P1 profile | non-P0 | `scripts/gates/run_staging_smoke.sh` | `artifacts/test/<run_id>/staging/smoke` | `reports/runs/<run_id>` |

### 7.3 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | gate | source、`--run-id`、`--artifact-root`、`--config-profile ci-test` | PR suite artifacts | 非 0 阻断 PR,保留 failure artifacts |
| `scripts/gates/run_main_gate.sh` | gate | source、fixtures、`--config-profile integration-test` | main suite artifacts | 非 0 阻断 main status |
| `scripts/gates/run_nightly_gate.sh` | gate | source、fixtures、wider matrix | nightly artifacts | 非 0 阻断 candidate promotion |
| `scripts/gates/run_candidate_gate.sh` | gate | candidate input、package artifacts、`--config-profile candidate-validation` | candidate artifacts | 非 0 阻断 `Verified` / `Stable` |
| `scripts/gates/run_staging_smoke.sh` | gate | staging-like refs、`--config-profile staging-like` | staging smoke artifacts | 非 0 记录 P1 failure,不阻断 P0 |
| `scripts/checks/check_redaction.sh` | check | artifacts + reports | redaction check report | 发现 raw body / secret 时失败 |
| `scripts/checks/check_artifact_paths.sh` | check | artifact root | path check report | 发现项目名重复层级或 `latest` 时失败 |
| `scripts/checks/check_report_completeness.sh` | check | run report | completeness check report | 缺证据或缺 case result 时失败 |
| `scripts/checks/check_no_public_registry_side_effect.sh` | check | artifacts + logs | registry side-effect report | 发现 public publish side effect 时失败 |
| `scripts/reports/generate_reports.sh` | report | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 缺 artifact 或不可写 report root 时失败 |
| `scripts/reports/generate_acceptance_summary.sh` | report | `reports/runs/<run_id>` | `reports/acceptance` | 缺必要证据时失败 |

### 7.4 Artifact 与 report 输出映射

| 来源 | artifact 输出 | report 输出 |
|---|---|---|
| PR gate | `artifacts/test/<run_id>/pr/*` | `reports/runs/<run_id>/pr-summary.json` |
| main gate | `artifacts/test/<run_id>/main/*` | `reports/runs/<run_id>/main-summary.json` |
| nightly gate | `artifacts/test/<run_id>/nightly/*` | `reports/runs/<run_id>/nightly-summary.json` |
| candidate gate | `artifacts/test/<run_id>/candidate/*` | `reports/runs/<run_id>/candidate-summary.json` |
| staging smoke | `artifacts/test/<run_id>/staging/*` | `reports/runs/<run_id>/staging-summary.json` |
| acceptance summary | 读取 run reports | `reports/acceptance/<run_id>-summary.md` |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §9 时摘录。

```markdown
## 9. 自动化与 CI/CD 门禁

> 校准来源：
> - `design-calibration/05_test_plan_step_09_automation_ci_gates.md`

本轮 P0 测试必须自动化。PR gate 覆盖 unit、contract、service、config 和 redaction;main gate 覆盖 integration、event replay、package surface 和 report checks;nightly gate 覆盖 compatibility regression、concurrency 和更宽三语言 smoke;candidate gate 覆盖 package build、docs、cross-language smoke、compatibility 和 redaction。

所有 gate script 必须放在 `scripts/gates/`,check script 必须放在 `scripts/checks/`,report script 必须放在 `scripts/reports/`。所有 gate 必须支持 `--run-id`、`--artifact-root` 和 `--config-profile`;默认 artifact root 是 `artifacts/test/<run_id>`,report 输出是 `reports/runs/<run_id>` 或 `reports/acceptance`。正式门禁不得引用 `latest`,不得使用 `artifacts/test/<project>/<run_id>` 或 `reports/<project>`。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| PR gate 是否包含 integration 全量测试 | 不包含全量,只包含快速 service / config / contract | 避免 PR 成本过高,main gate 承接完整 integration |
| nightly 失败是否阻断 PR | 不阻断已合并 PR,但阻断 candidate promotion | nightly 用于组合风险发现 |
| candidate gate 是否触发 public registry 发布 | 不触发 | public registry 是 P1/P2 非范围 |
| 是否允许报告脚本放到 `reports/` | 不允许 | `reports/` 是输出目录,脚本必须在 `scripts/reports/` |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 自动化门禁已清晰 | 已满足 |
| PR / main / nightly / candidate / staging suite 已区分 | 已满足 |
| 阻断级别已定义 | 已满足 |
| gate / check / report 脚本目录已定义 | 已满足 |
| artifact / report 输出路径已定义 | 已满足 |
| 不使用 `latest` 和项目名重复层级的规则已定义 | 已满足 |

Step 10 可以在本文件被确认后开始,主题是设计专项测试与非功能验证。
