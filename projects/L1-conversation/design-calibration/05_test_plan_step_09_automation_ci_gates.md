# L1-conversation 05 测试方案 Step 9: 设计自动化与 CI/CD 门禁

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §9 自动化与 CI/CD 门禁
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 设计自动化与 CI/CD 门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_09_automation_ci_gates.md` |

本步定义自动化套件、CI/CD 执行位置、阻断级别、脚本契约和 artifacts / reports 输出映射。专项测试、缺陷复验、进入 / 退出准则、证据编号和报告索引分别留给 Step 10~Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_04_strategy_layers.md` | Unit、Service、Integration、API / Contract、E2E / Release gate 分层 | 作为 suite 分组依据 |
| `05_test_plan_step_05_traceability_matrix.md` | P0-blocking、P0-supporting、一票否决项覆盖 | 作为阻断级别来源 |
| `05_test_plan_step_06_cases.md` | TC 矩阵和自动化候选 | 作为 suite 覆盖对象 |
| `05_test_plan_step_07_test_data.md` | seed、builder、fake adapter、run-scoped 数据 | 作为自动化可重复执行前提 |
| `05_test_plan_step_08_environment_config.md` | local-dev、ci-test、integration-like、operations-replay 环境矩阵 | 作为执行位置和 profile 来源 |
| `03-详细设计.md` §15.4 | gate / report / check 脚本契约 | 作为脚本路径和输出真相源 |
| `03_ddd_step_16_test_slices.md` §7.6 | 脚本参数、artifact root、report root 和失败语义 | 作为脚本输入输出约束 |
| `04-配置设计.md` §7 / §9 / §11 | `reports.*`、`security.redaction_policy`、路径和配置失败模式 | 作为 gate fail-fast 和 redaction 下限来源 |

## 3. SOP 问题回答

### 3.1 哪些 suite 必须进 PR?

PR 必须执行快速、确定性、无真实外部依赖的 P0-blocking 套件: unit invariants、contract roundtrip、service smoke、query authorization smoke、redaction guard smoke 和 config path smoke。PR 不执行 integration-like、operations-replay、staging-like 或 production-like。

### 3.2 哪些 suite 进 main CI?

main CI 执行全部 P0-blocking 自动化: domain / state、service orchestration、query、worker consumer、outbox / handoff jobs、configuration、path shape、forbidden body 和 redaction guard。P0-supporting 中的 projection / search / cursor 用例进入 main CI 的 job / query 子套件。

### 3.3 哪些 suite 进 nightly?

nightly 执行 integration-like controlled adapter、operations-replay、longer projection / cursor / consistency rerun、dependency degraded 和 fake failure 矩阵。nightly 失败不自动改写 P0 设计通过结论,但会阻断 release readiness。

### 3.4 哪些 suite 是 staging smoke 或 release gate?

staging smoke 是 P1 / P0-P1 boundary,用于验证 real-like adapter 接缝是否可演练,不作为当前 P0 通过条件。release gate 是 P0-blocking,必须执行 P0 smoke、红线组合、redaction check、artifact path shape 和 report generation。

### 3.5 flaky、超时和依赖故障如何处理?

flaky 不允许静默通过。P0-blocking suite 如果出现偶发失败,必须保留同一 `run_id` 下的失败 artifact,最多允许受控复跑一次并记录 attempt；release gate 中任一次红线失败都阻断。超时按 suite 失败处理,输出 timeout summary。fake / controlled 依赖不可用时 fail-fast 或标记环境失败,不得回退为 fake success。

### 3.6 每个阻断 suite 由哪个 `scripts/gates/*.sh` 执行?

所有 P0-blocking gate suite 由 `scripts/gates/run_ci_gate.sh` 执行。suite 分组由 CI stage 和脚本内部执行清单承接,本步不新增正式必填脚本参数。若实施阶段增加可选 suite selector,不得破坏 `--run-id`、`--artifact-root`、`--config-profile` 三个必需输入。

### 3.7 每个 gate 的默认 `artifact-root` 是否为 `artifacts/test/<run_id>`?

是。配置项 `reports.artifacts_root` 的默认根为 `artifacts/test`,gate 必须携带 `run_id` 并形成 `artifacts/test/<run_id>`。不得写 `artifacts/test/<project>/<run_id>`、`artifacts/test/latest` 或全局共享输出。

### 3.8 每个 gate 是否支持 `--run-id`、`--artifact-root`、`--config-profile`?

是。`scripts/gates/run_ci_gate.sh` 必须支持 `--run-id`、`--artifact-root`、`--config-profile`。缺少 run id、artifact root 不可写、profile unsupported 或 extra project layer 均 fail-fast。

### 3.9 哪些 `scripts/checks/*.sh` 必须进入 release gate?

`scripts/checks/check_redaction.sh` 必须进入 release gate,并读取 artifacts 与 reports。它发现 forbidden body、runtime reasoning body、bridge platform body、raw secret、raw payload 或 fake-as-production marker 时必须失败。

### 3.10 哪些 `scripts/reports/*.sh` 在 gate 后生成 `reports/runs/<run_id>`?

`scripts/reports/generate_reports.sh` 在 main CI、nightly 和 release gate 后生成 `reports/runs/<run_id>`。release gate 还必须写入 `reports/acceptance` 的可摘录入口,但正式证据编号和索引留给 Step 13。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧版只有 integration / nightly 等泛化表达,未约束脚本、路径和阻断级别 | 不继承旧门禁 |
| Step 4 | 已说明分层,但未落到 PR / main / nightly / release 执行位置 | 本步转成 suite 表 |
| Step 6 | 用例已有自动化候选,但缺少 gate stage 和失败处理 | 本步绑定 suite 和阻断级别 |
| Step 8 | 环境矩阵已定义,但未说明哪个环境进入哪条流水线 | 本步分配 ci-test、integration-like、operations-replay 和 staging-like |
| `03` §15.4 | 脚本契约已定义,但没有 suite 对应关系 | 本步只复用现有脚本路径 |
| `04` §11 | 配置失效模式已定义,但 gate 还需明确 fail-fast 场景 | 本步纳入 config / path / redaction gate |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| PR 门禁 | 未定义 | 快速 P0-blocking unit、contract、service smoke、query auth、redaction、config |
| main CI | 未定义 | 全量 P0-blocking + P0-supporting job / query 核心 |
| nightly | 泛化为长链路 | integration-like、operations-replay、degraded dependency 和 rerun |
| release gate | 容易被当成测试全集 | 只验证 P0 smoke、红线组合、redaction、path 和 report package |
| 脚本路径 | 可能散落到 reports 目录 | gate / report / check 固定在 `scripts/` 下 |
| 输出路径 | 可能出现 latest 或项目层级 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否每个 suite 新增一个脚本 | 为 unit、service、query、job 分别建脚本 | 复用 `run_ci_gate.sh`,用 CI stage 和内部清单组织 suite | B | 详细设计只定义了一个 gate script,避免脚本真相源漂移 |
| PR 是否执行全部 P0 | PR 跑完所有 P0 和 replay | PR 跑快速阻断,main CI 承接全量 P0 | B | 保持反馈速度,不降低 main CI 覆盖 |
| release gate 是否替代底层测试 | release gate 重跑所有细粒度测试 | release gate 跑 smoke、红线组合和证据包 | B | 高风险应前移到 unit / service / CI |
| flaky 是否允许自动通过 | 复跑通过即通过 | 记录失败 artifact,release gate 任一红线失败阻断 | B | 避免不稳定测试污染验收证据 |
| staging smoke 是否 P0 | 作为 P0 必过 | 标为 P1 / boundary readiness | B | 当前 P0 不依赖真实生产 endpoint |

## 7. 结构化中间产物

### 7.1 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `SUITE-CONV-PR-UNIT` | domain object、policy、14 组状态机、forbidden field guard | PR | 任意代码 / 契约变更 | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/pr-unit` | `reports/runs/<run_id>/pr-unit.md` |
| `SUITE-CONV-PR-CONTRACT` | DTO roundtrip、metadata、envelope、payload ref-only | PR | contracts / API / worker 变更 | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/pr-contract` | `reports/runs/<run_id>/pr-contract.md` |
| `SUITE-CONV-PR-SERVICE-SMOKE` | create space、append fact、authorized query、outbox rollback smoke | PR | application / domain / infra 变更 | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/pr-service-smoke` | `reports/runs/<run_id>/pr-service-smoke.md` |
| `SUITE-CONV-MAIN-SERVICE` | 全量 command service、transaction、idempotency、manifestation、handoff | main CI | merge / main push | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/main-service` | `reports/runs/<run_id>/main-service.md` |
| `SUITE-CONV-MAIN-QUERY` | 11 个 Query、visibility、stale / failed marker、cursor、search refs-only | main CI | merge / main push | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/main-query` | `reports/runs/<run_id>/main-query.md` |
| `SUITE-CONV-MAIN-WORKER-JOB` | inbound consumer、outbox publish、projection、cursor、handoff、consistency jobs | main CI | merge / main push | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/main-worker-job` | `reports/runs/<run_id>/main-worker-job.md` |
| `SUITE-CONV-MAIN-CONFIG` | unsupported profile、strict redaction、path shape、fake marker、unwritable path | main CI | config / scripts / report 变更 | P0-blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/main-config` | `reports/runs/<run_id>/main-config.md` |
| `SUITE-CONV-NIGHTLY-INTEGRATION-LIKE` | controlled resolver / publisher / handoff、source unresolved、digest mismatch | nightly | scheduled / release candidate | Release readiness blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/nightly-integration-like` | `reports/runs/<run_id>/nightly-integration-like.md` |
| `SUITE-CONV-NIGHTLY-OPS-REPLAY` | projection、search、cursor、consistency、handoff、outbox rerun | nightly | scheduled / replay input change | Release readiness blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/nightly-ops-replay` | `reports/runs/<run_id>/nightly-ops-replay.md` |
| `SUITE-CONV-STAGING-SMOKE` | real-like adapter smoke、credential ref、endpoint readiness | staging smoke | staging candidate | P1 readiness blocking | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/staging-smoke` | `reports/runs/<run_id>/staging-smoke.md` |
| `SUITE-CONV-RELEASE-REDLINE` | P0 smoke、authorization、append-only、source isolation、redaction、path shape | release gate | release candidate / handoff 前 | P0-blocking | `scripts/gates/run_ci_gate.sh` + `scripts/checks/check_redaction.sh` | `artifacts/test/<run_id>/release-redline` | `reports/runs/<run_id>/release-redline.md` |
| `SUITE-CONV-RELEASE-REPORT` | report generation、run summary、acceptance extract input | release gate | release candidate / handoff 前 | P0-blocking | `scripts/reports/generate_reports.sh` | reads `artifacts/test/<run_id>` | `reports/runs/<run_id>` and `reports/acceptance` |

### 7.2 CI/CD 门禁图

#### CI/CD 门禁图: L1-conversation automated gates

```text
[PR gate: ci-test]
  |-- SUITE-CONV-PR-UNIT
  |-- SUITE-CONV-PR-CONTRACT
  |-- SUITE-CONV-PR-SERVICE-SMOKE
  v
[main CI: ci-test]
  |-- SUITE-CONV-MAIN-SERVICE
  |-- SUITE-CONV-MAIN-QUERY
  |-- SUITE-CONV-MAIN-WORKER-JOB
  |-- SUITE-CONV-MAIN-CONFIG
  v
[nightly: integration-like + operations-replay]
  |-- SUITE-CONV-NIGHTLY-INTEGRATION-LIKE
  |-- SUITE-CONV-NIGHTLY-OPS-REPLAY
  v
[release gate: ci-test + report generation]
  |-- SUITE-CONV-RELEASE-REDLINE
  |-- scripts/checks/check_redaction.sh
  |-- scripts/reports/generate_reports.sh
  v
[reports/runs/<run_id>] + [reports/acceptance]
```

关键说明:

- PR 和 main CI 使用 `ci-test` profile,不得依赖真实外部服务。
- nightly 使用 `integration-like` 和 `operations-replay`,用于接缝和重跑,不代表 production-like 通过。
- release gate 只验证 P0 smoke、红线组合和证据包可生成,不替代底层测试。
- 所有 stage 的原始机器证据必须写入 `artifacts/test/<run_id>`。

### 7.3 gate / report / check 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id`; `--artifact-root`; `--config-profile`; source tree; deterministic fake / in-memory test runtime | `artifacts/test/<run_id>` 下的 suite artifacts、failure summary、exit code | 非 0 exit code;缺 run id、unsupported profile、path unwritable、extra project layer 均 fail-fast |
| `scripts/reports/generate_reports.sh` | report | `--run-id`; `--artifact-root`; `--report-root`; `artifacts/test/<run_id>` | `reports/runs/<run_id>`; release 时补 `reports/acceptance` 可摘录入口 | 缺失 artifact、报告生成失败或 report root 不可写时非 0 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root`; `--report-root`; gate artifacts; generated reports | `reports/runs/<run_id>/redaction-check.md` | forbidden body、raw secret、raw payload、fake-as-production marker 命中时非 0 |

### 7.4 artifact 与 report 输出映射表

| 输出对象 | 路径 | 生成者 | 消费者 | 约束 |
|---|---|---|---|---|
| gate raw artifacts | `artifacts/test/<run_id>/<suite>` | `scripts/gates/run_ci_gate.sh` | report script、redaction check、Step 13 证据归档 | 不得包含 `<project>` 层级或 `latest` |
| gate failure summary | `artifacts/test/<run_id>/<suite>/failure-summary.*` | gate suite | CI UI、report script、缺陷复验 | P0-blocking 失败必须保留 |
| run report | `reports/runs/<run_id>` | `scripts/reports/generate_reports.sh` | release gate、验收标准、人工审查 | 不得写 `reports/<project>` |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | `scripts/checks/check_redaction.sh` | release gate、一票否决项 | 命中红线时阻断 |
| acceptance extract | `reports/acceptance` | report script + 人 / Agent 审查补充 | Step 13、`06-验收标准.md` | 只放可摘录入口,证据 ID 后续生成 |

### 7.5 flaky / timeout / dependency failure 处理表

| 失败类型 | 处理 | 是否阻断 | artifact 要求 |
|---|---|---|---|
| P0-blocking deterministic failure | 立即失败 | 是 | 保存 suite failure summary |
| flaky suspect | 同一 `run_id` 下最多受控复跑一次,两次结果都保留 | PR / main 阻断到人工判定;release 红线直接阻断 | 保存 first failure 和 rerun attempt |
| timeout | 非 0 退出,输出 timeout summary | 是 | 保存 timeout case、profile、seed、duration |
| fake / controlled dependency unavailable | fail-fast 或 environment failure,不得回退 fake success | P0 fake 阻断;staging-like 不阻断 P0 | 保存 dependency failure category |
| report root / artifact root 不可写 | fail-fast | 是 | 保存启动失败摘要到可写的临时 CI log;不得伪造 report |
| redaction violation | 非 0 退出 | 是,一票否决 | 保存 redaction-check 和命中类别,不保存原始 secret / body |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §9 时摘录。

```markdown
## 9. 自动化与 CI/CD 门禁

> 校准来源：
> - `design-calibration/05_test_plan_step_09_automation_ci_gates.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“自动化套件表”“CI/CD 门禁图”“gate / report / check 脚本表”和“flaky / timeout / dependency failure 处理表”小节，了解每个 P0-blocking 用例如何进入自动化门禁。

本轮自动化分为 PR gate、main CI、nightly、staging smoke 和 release gate。PR gate 只执行快速 deterministic 的 P0-blocking unit、contract、service smoke、query authorization、redaction guard 和 config path smoke。main CI 执行全量 P0-blocking service、query、worker、job、configuration、path shape 和 redaction guard。nightly 执行 integration-like 和 operations-replay。staging smoke 属于 P1 readiness,不作为 P0 通过条件。release gate 必须执行 P0 smoke、红线组合、redaction check、artifact path shape 和 report generation。

所有阻断 gate suite 由 `scripts/gates/run_ci_gate.sh` 执行,并必须支持 `--run-id`、`--artifact-root`、`--config-profile`。原始机器证据固定写入 `artifacts/test/<run_id>`,人类可读报告固定写入 `reports/runs/<run_id>` 和 `reports/acceptance`。正式门禁不得引用 `latest`,不得额外加入 `<project>` 层级。
```

## 9. 待确认事项

无阻塞进入 Step 10 的待确认事项。

后续 Step 必须继续收口:

- Step 10 定义专项测试与非功能验证,不得把本步 nightly / release gate 当成性能、安全和恢复专项全集。
- Step 11 定义 flaky、timeout、dependency failure 的缺陷分级、复验和关闭规则。
- Step 13 定义 report、artifact、redaction check 和 acceptance extract 的正式证据编号与归档索引。
- Step 15 汇总正式 `05-测试方案.md` 时,应从本文件摘录,不要重复扩写成新的脚本真相源。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 自动化门禁清晰 | 通过 | PR、main CI、release gate 的 P0-blocking suite 已定义 |
| nightly 和 staging 边界清晰 | 通过 | nightly 阻断 release readiness;staging smoke 不阻断 P0 |
| 脚本路径和参数清晰 | 通过 | gate / report / check 脚本均承接 `03` §15.4 和 Step 16 |
| artifact / report 路径清晰 | 通过 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 可以进入 Step 10 | 通过 | 下一步设计专项测试与非功能验证 |
