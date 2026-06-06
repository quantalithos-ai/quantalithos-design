# Step 9. 设计自动化与 CI/CD 门禁

> 本步定义 `05-测试方案.md` §9 的自动化 suite、CI/CD 门禁、脚本分类、artifact / report 输出和失败处理。本步只定义测试方案层的门禁契约,不创建脚本、不写 CI 平台语法、不修改正式 `05-测试方案.md`。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 9 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §9 自动化与 CI/CD 门禁 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 取得 unit / service / integration / API-worker contract / E2E-release gate 的分层策略和阻断口径 |
| `05_test_plan_step_06_cases_matrix.md` | 取得 `TC-WORK-*` 用例族、P0 优先级和 `EV-WORK-*` 证据编号 |
| `05_test_plan_step_07_test_data.md` | 取得 `DS-WORK-*` 数据集、run-scoped isolation、fake adapter seed 和 cleanup 规则 |
| `05_test_plan_step_08_environment_config.md` | 取得 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 环境矩阵和配置 profile |
| `03-详细设计.md` §15 | 确认最小验证入口和 P0 fake / in-memory 边界 |
| `04-配置设计.md` §12 | 确认配置测试、redaction gate、artifact / report 和 no `latest` 证据边界 |
| `测试方案讨论流程_SOP.md` Step 9 | 本步问题、期望表格和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些 suite 必须进 PR? | `unit-contract-domain`、`service-core`、`api-contract-fast`、`config-fast` 必须进 PR,覆盖 schema、domain state、核心 command / query 编排、协议 roundtrip 和快速配置失败。 |
| 哪些 suite 进 main CI? | PR suite 全量重跑,并增加 `service-all`、`integration-p0`、`worker-job-contract`、`consumer-outbox`、`config-redaction`。 |
| 哪些 suite 进 nightly? | 增加 `operations-replay`、`reconciliation-rebuild`、`concurrency-idempotency-stress`、`extended-redaction-scan` 和 P1/P2 non-blocking dry-run。 |
| 哪些 suite 是 staging smoke 或 release gate? | P0 release gate 包括 `release-main-smoke`、`release-config-redline`、`release-evidence-pack`;`staging-like-smoke` 是 P1/P2 承接,默认不阻塞 P0。 |
| flaky、超时和依赖故障如何处理? | P0 blocking suite 不接受 flaky 豁免;超时视为失败;P0 fake / in-memory 依赖不可用直接 fail-fast;integration-like controlled adapter 不可用必须 explicit unavailable / fail-fast,不得自动 fake success。 |
| 每个阻断 suite 由哪个 `scripts/gates/*.sh` 执行? | PR / main / release 阻断 suite 统一由 `scripts/gates/run_*_gate.sh` 触发;脚本名称见 §7.1 / §7.4。 |
| 每个 gate 的默认 `artifact-root` 是否为 `artifacts/test/<run_id>`? | 是。所有 gate 默认 artifact root 为 `artifacts/test/<run_id>`,不得使用 `artifacts/test/<project>/<run_id>` 或 `latest`。 |
| 每个 gate 是否支持 `--run-id`、`--artifact-root`、`--config-profile`? | 是。所有 `scripts/gates/*.sh` 必须支持这三个参数;需要 replay 的 gate 额外支持 `--replay-bundle-ref`。 |
| 哪些 `scripts/checks/*.sh` 必须进入 release gate? | `check_no_forbidden_output.sh`、`check_report_paths.sh`、`check_config_source_summary.sh`、`check_fake_marker.sh`、`check_evidence_index.sh` 必须进入 release gate。 |
| 哪些 `scripts/reports/*.sh` 在 gate 后生成 `reports/runs/<run_id>`? | `collect_gate_reports.sh`、`build_evidence_index.sh`、`build_redaction_report.sh`、`build_release_summary.sh` 写入 `reports/runs/<run_id>`;release 接受摘要另写 `reports/acceptance`。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 4 测试分层 | 已明确分层和阻断原则,但没有落到自动化 suite 和 CI 位置 | 本步定义 suite 表、PR / main / nightly / release gate 映射 |
| Step 6 用例矩阵 | 已有 P0 用例和证据编号,但没有说明哪些 suite 自动执行 | 本步把 `TC-WORK-*` 用例族映射到 suite |
| Step 8 环境矩阵 | 已定义 `ci-test` / `integration-like` / `operations-replay`,但没有自动化触发和路径 | 本步定义 gate 参数、profile 和 artifact / report 输出 |
| `04-配置设计.md` §12 | 已要求配置测试和 redaction gate,但没有脚本分类 | 本步拆成 `scripts/gates`、`scripts/checks`、`scripts/reports` |
| 旧 `05-测试方案.md` | 没有新版 run-scoped artifact / report 规则 | 本步统一路径,禁止 `<project>` 层级和 `latest` |

## 5. 改动前后对比

| 维度 | Step 8 后 | Step 9 收敛后 |
|---|---|---|
| 自动化范围 | 环境和数据可定位 | PR / main / nightly / release suite 可定位 |
| 阻断级别 | P0 环境阻断原则已定义 | 每个 suite 有阻断级别和失败处理 |
| 脚本分类 | 尚未定义 | gate / check / report 脚本目录和输入输出明确 |
| artifact 路径 | 只知道 run-scoped | 固定 `artifacts/test/<run_id>` |
| report 路径 | 只知道报告需 redacted | 固定 `reports/runs/<run_id>` 和 `reports/acceptance` |
| 上游影响 | 无 | 无;不新增配置项、测试用例编号或实现脚本内容 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: PR 只跑 unit,main CI 跑全部 P0 | PR 快 | 核心 service / contract 错误进入 main 后才发现 | 不采用 |
| 方案 B: PR 跑 unit + 核心 service + 快速 contract + config-fast,main CI 跑 P0 全量,nightly 跑 replay / stress,release gate 跑 smoke + redline + evidence | 反馈速度和风险覆盖平衡,与 Step 4 分层一致 | suite 较多,需要脚本分类清晰 | 采用 |
| 方案 C: release gate 依赖 staging-like / production-like 真实依赖 | 更接近生产 | 当前 03 / 04 未定义生产产品绑定,会虚构 P0 环境 | 不采用 |
| 方案 D: 手工 smoke 替代 P0 自动化 | 编写成本低 | 不满足 P0 主线不得只依赖手工测试 | 不采用 |

采用方案 B。

原因:

- `L1-work` 的 P0 风险集中在 schema、state、UoW、idempotency、config 和 forbidden output,必须在自动化中阻断。
- `integration-like` 和 `operations-replay` 需要受控环境,适合 main CI / nightly / release gate 分层。
- 当前测试方案不能预支 CI 平台语法和真实生产依赖,但必须固定脚本目录、参数和输出路径。

## 7. 结构化中间产物

### 7.1 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `unit-contract-domain` | contracts DTO / refs、domain objects、policy、12 状态机、digest pure function | PR、main CI、release gate | 每次代码变更 | 阻断 PR / CI / release | `scripts/gates/run_pr_gate.sh --suite unit-contract-domain` | `artifacts/test/<run_id>/unit-contract-domain` | `reports/runs/<run_id>/unit-contract-domain.md` |
| `service-core` | 核心 command / query service、UoW、idempotency、query no-write、error mapping | PR、main CI、release gate | 每次代码变更 | 阻断 PR / CI / release | `scripts/gates/run_pr_gate.sh --suite service-core` | `artifacts/test/<run_id>/service-core` | `reports/runs/<run_id>/service-core.md` |
| `api-contract-fast` | command / query handler DTO roundtrip、metadata、protocol error surface | PR、main CI | 每次 public contract 变更 | 阻断 PR / CI | `scripts/gates/run_pr_gate.sh --suite api-contract-fast` | `artifacts/test/<run_id>/api-contract-fast` | `reports/runs/<run_id>/api-contract-fast.md` |
| `config-fast` | defaults、strict JSON、env override、invalid high-priority value、unsupported hot update reject | PR、main CI、release gate | 配置相关变更或全量 CI | 阻断 PR / CI / release | `scripts/gates/run_pr_gate.sh --suite config-fast --config-profile ci-test` | `artifacts/test/<run_id>/config-fast` | `reports/runs/<run_id>/config-fast.md` |
| `service-all` | 18 Command、8 Query、7 Consumer、6 Job service 编排全量 P0 | main CI、release gate | merge / scheduled / release candidate | 阻断 CI / release | `scripts/gates/run_main_gate.sh --suite service-all --config-profile ci-test` | `artifacts/test/<run_id>/service-all` | `reports/runs/<run_id>/service-all.md` |
| `integration-p0` | repository、UoW、runtime builder、config loader、fake / in-memory adapter | main CI、release gate | merge / release candidate | 阻断 CI / release | `scripts/gates/run_main_gate.sh --suite integration-p0 --config-profile ci-test` | `artifacts/test/<run_id>/integration-p0` | `reports/runs/<run_id>/integration-p0.md` |
| `worker-job-contract` | inbound consumer envelope、outbox publisher、job input / receipt / partial failure report | main CI、release gate | merge / release candidate | 阻断 CI / release | `scripts/gates/run_main_gate.sh --suite worker-job-contract --config-profile ci-test` | `artifacts/test/<run_id>/worker-job-contract` | `reports/runs/<run_id>/worker-job-contract.md` |
| `consumer-outbox` | 7 Consumer、10 Outbound Event、outbox publication failed / retry / duplicate | main CI、release gate | merge / release candidate | 阻断 CI / release | `scripts/gates/run_main_gate.sh --suite consumer-outbox --config-profile ci-test` | `artifacts/test/<run_id>/consumer-outbox` | `reports/runs/<run_id>/consumer-outbox.md` |
| `config-redaction` | raw secret / token / payload / source body scan、fake marker、config source summary | main CI、release gate | merge / release candidate | 阻断 CI / release | `scripts/gates/run_main_gate.sh --suite config-redaction --config-profile ci-test` | `artifacts/test/<run_id>/config-redaction` | `reports/runs/<run_id>/config-redaction.md` |
| `integration-like-seam` | controlled configured adapter refs、external unavailable、no fake fallback | main CI optional、release gate selected | adapter / config seam 变更 | 阻断 release;main CI 按变更阻断 | `scripts/gates/run_integration_like_gate.sh --suite integration-like-seam --config-profile integration-like` | `artifacts/test/<run_id>/integration-like-seam` | `reports/runs/<run_id>/integration-like-seam.md` |
| `operations-replay` | replay bundle、outbox / projection / reference / handoff / reconciliation rerun | nightly、release gate selected | nightly 或 release candidate | nightly 失败建阻断缺陷;release 阻断 | `scripts/gates/run_replay_gate.sh --suite operations-replay --config-profile operations-replay` | `artifacts/test/<run_id>/operations-replay` | `reports/runs/<run_id>/operations-replay.md` |
| `concurrency-idempotency-stress` | version conflict、single-winner、duplicate / conflict / commit unknown 重复运行 | nightly | scheduled | 非 release 默认不阻断 PR;失败阻断 release readiness | `scripts/gates/run_nightly_gate.sh --suite concurrency-idempotency-stress --config-profile ci-test` | `artifacts/test/<run_id>/concurrency-idempotency-stress` | `reports/runs/<run_id>/concurrency-idempotency-stress.md` |
| `release-main-smoke` | create project -> member -> work -> iteration -> query / trace,plus promote / outbox smoke | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh --suite release-main-smoke --config-profile ci-test` | `artifacts/test/<run_id>/release-main-smoke` | `reports/runs/<run_id>/release-main-smoke.md` |
| `release-config-redline` | invalid config、redaction、fake-as-production、report path、no `latest` | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh --suite release-config-redline --config-profile ci-test` | `artifacts/test/<run_id>/release-config-redline` | `reports/runs/<run_id>/release-config-redline.md` |
| `release-evidence-pack` | evidence index、suite summary、redaction report、acceptance handoff package | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh --suite release-evidence-pack --config-profile ci-test` | `artifacts/test/<run_id>/release-evidence-pack` | `reports/runs/<run_id>/release-evidence-pack.md`;`reports/acceptance/handoff.md` |
| `staging-like-smoke` | P1/P2 real-like dry-run,secret ref and deployment config validation | staging-like | P1/P2 专项 | 不阻断当前 P0 | `scripts/gates/run_staging_like_gate.sh --suite staging-like-smoke --config-profile staging-like` | `artifacts/test/<run_id>/staging-like-smoke` | `reports/runs/<run_id>/staging-like-smoke.md` |

### 7.2 CI/CD 门禁图

图类型: CI/CD 门禁图

图标题: L1-work 自动化门禁流

```text
[Pull Request]
  | run_pr_gate.sh
  | unit-contract-domain + service-core + api-contract-fast + config-fast
  v
[PR merge allowed?]
  | yes
  v
[Main CI]
  | run_main_gate.sh
  | service-all + integration-p0 + worker-job-contract + consumer-outbox + config-redaction
  v
[Main baseline green?]
  | yes
  +-----------------------------+
  |                             |
  v                             v
[Nightly]                    [Release candidate]
  | run_nightly_gate.sh          | run_release_gate.sh
  | operations-replay            | release-main-smoke
  | concurrency / stress         | release-config-redline
  | extended redaction           | release-evidence-pack
  v                             v
[Nightly risk queue]         [Release allowed?]
```

关键说明:

- PR 必须自动化覆盖核心 schema、domain、service、API contract 和快速配置失败。
- Main CI 是 P0 全量自动化主门禁。
- Nightly 负责 replay、stress 和长耗时专项,失败进入风险 / 缺陷队列;若同一问题进入 release candidate 则阻断 release。
- Release gate 不引用 `latest`,只引用显式 `run_id`、artifact 和 report。

### 7.3 gate / check / report 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`、`--suite` | suite artifacts、suite report | 任一 P0 suite 失败阻断 PR |
| `scripts/gates/run_main_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`、`--suite` | main suite artifacts、main report | 任一 P0 suite 失败阻断 main baseline |
| `scripts/gates/run_integration_like_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile integration-like`、`--suite` | integration-like artifacts、configured seam report | controlled adapter 不可用按 fail-fast / explicit marker;不得 fake fallback |
| `scripts/gates/run_replay_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile operations-replay`、`--suite`、`--replay-bundle-ref` | replay artifacts、replay report | bundle 缺失或 baseline digest mismatch fail-fast |
| `scripts/gates/run_nightly_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`、`--suite` | nightly artifacts、nightly report | 失败建阻断缺陷;进入 release 前必须修复或降级说明 |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`、`--suite` | release artifacts、release reports | 任一 release suite 失败阻断 release |
| `scripts/gates/run_staging_like_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile staging-like`、`--suite` | staging-like dry-run artifacts | P1/P2 专项,不阻断当前 P0 |
| `scripts/checks/check_no_forbidden_output.sh` | check | `--run-id`、`--artifact-root`、`--report-root` | forbidden output scan result | 命中 raw secret / token / payload / source body 阻断 |
| `scripts/checks/check_report_paths.sh` | check | `--run-id`、`--artifact-root`、`--report-root` | path validation result | 出现 `<project>` 层级或 `latest` 阻断 |
| `scripts/checks/check_config_source_summary.sh` | check | `--run-id`、`--report-root` | config source summary validation | 缺 source kind / digest / profile 或泄露 value 阻断 |
| `scripts/checks/check_fake_marker.sh` | check | `--run-id`、`--artifact-root`、`--report-root` | fake marker validation | fake success 被写成 configured / production success 阻断 |
| `scripts/checks/check_evidence_index.sh` | check | `--run-id`、`--report-root` | evidence index validation | P0 `EV-WORK-*` 缺失或引用 `latest` 阻断 |
| `scripts/reports/collect_gate_reports.sh` | report | `--run-id`、`--artifact-root`、`--report-root reports/runs/<run_id>` | suite report collection | 缺阻断 suite report 则失败 |
| `scripts/reports/build_evidence_index.sh` | report | `--run-id`、`--report-root reports/runs/<run_id>` | `reports/runs/<run_id>/evidence-index.md` | 缺 P0 evidence entry 则失败 |
| `scripts/reports/build_redaction_report.sh` | report | `--run-id`、`--artifact-root`、`--report-root reports/runs/<run_id>` | `reports/runs/<run_id>/redaction-report.md` | redaction scan failed 则失败 |
| `scripts/reports/build_release_summary.sh` | report | `--run-id`、`--report-root reports/runs/<run_id>`、`--acceptance-root reports/acceptance` | `reports/runs/<run_id>/release-summary.md`;`reports/acceptance/handoff.md` | 缺 gate result 或 evidence index 则失败 |

### 7.4 artifact 与 report 输出映射表

| gate / suite | artifact 输出 | report 输出 | 证据关联 |
|---|---|---|---|
| PR suites | `artifacts/test/<run_id>/<suite>` | `reports/runs/<run_id>/<suite>.md` | 快速 `TC-WORK-*` 和失败日志 |
| Main CI suites | `artifacts/test/<run_id>/<suite>` | `reports/runs/<run_id>/<suite>.md` | P0 `EV-WORK-*` 草稿证据 |
| Integration-like suite | `artifacts/test/<run_id>/integration-like-seam` | `reports/runs/<run_id>/integration-like-seam.md` | configured seam / fake marker evidence |
| Operations replay suite | `artifacts/test/<run_id>/operations-replay` | `reports/runs/<run_id>/operations-replay.md` | `EV-WORK-OPS-*`、replay digest evidence |
| Redaction checks | `artifacts/test/<run_id>/redaction-scan` | `reports/runs/<run_id>/redaction-report.md` | `EV-WORK-CFG-*`、`EV-WORK-NFR-*` |
| Release gate | `artifacts/test/<run_id>/release-*` | `reports/runs/<run_id>/release-summary.md` | release candidate evidence |
| Acceptance handoff | 不新增 artifact | `reports/acceptance/handoff.md` | 给 `06-验收标准.md` 消费 |

统一约束:

```text
- `artifact-root` 默认且正式值为 `artifacts/test/<run_id>`。
- `report-root` 默认且正式值为 `reports/runs/<run_id>`。
- acceptance 摘要只写 `reports/acceptance/handoff.md`。
- 禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>`、`latest`。
```

### 7.5 用例族到自动化 suite 映射

| 用例族 | PR | Main CI | Nightly | Release gate |
|---|---|---|---|---|
| `CORE` | `service-core` | `service-all` / `integration-p0` | concurrency selected | `release-main-smoke` |
| `MEMBER` | `service-core` selected | `service-all` / `integration-p0` | external unavailable replay | `release-main-smoke` |
| `FORMAL` | `service-core` selected | `service-all` / `integration-p0` | forbidden body extended | `release-main-smoke` |
| `PROMOTE` | unit / service selected | `service-all` / `worker-job-contract` | runtime source replay | selected release smoke |
| `DEP` | unit policy selected | `service-all` | graph stress selected | main CI evidence |
| `ITER` | service selected | `service-all` / `integration-p0` | concurrency selected | `release-main-smoke` |
| `QUERY` | `api-contract-fast` selected | `service-all` / `integration-p0` | projection replay | `release-main-smoke` |
| `OPS` | unit / config selected | `worker-job-contract` / `consumer-outbox` | `operations-replay` | selected release smoke |
| `CFG` | `config-fast` | `config-redaction` | extended redaction scan | `release-config-redline` |
| `NFR` | forbidden field unit selected | `config-redaction` | stress / redaction / replay | `release-config-redline` / `release-evidence-pack` |

### 7.6 flaky、超时和依赖故障处理表

| 失败类型 | P0 处理 | 是否允许重试 | 证据要求 |
|---|---|---|---|
| deterministic unit / service failure | 阻断 PR / CI | 不允许用重试掩盖 | suite report、失败用例、design contract reference |
| integration fake dependency missing | fail-fast | 不允许 | missing fake seed / marker report |
| configured adapter unavailable | fail-fast 或 explicit unavailable marker,按用例预期 | 不允许 silent fallback | adapter outcome、config source summary |
| replay bundle missing / digest mismatch | fail-fast | 不允许 | replay bundle ref、expected / actual digest marker |
| timeout | 阻断当前 gate | 可按同一 `run_id` 重跑一次确认,但不能标绿原失败 | timeout artifact、rerun comparison |
| flaky suspected | 标记为 blocker,不得通过 release gate | 可重跑定位,不得以重跑成功覆盖失败 | first failure artifact、rerun artifact、root cause |
| redaction / forbidden output hit | 一票阻断 | 不允许 | sentinel hit location;不得在最终报告泄露正文 |
| report path / `latest` 命中 | 阻断 release gate | 修正后重跑 | path diff、corrected report |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 自动化可由 PR / main CI / nightly / release gate 分层覆盖 | 否 | 测试门禁设计,无设计契约变化 | 无 | 无回写 |
| gate / check / report 脚本只定义目录、参数和输出契约,不创建实现脚本 | 否 | 测试方案承接,不改变 07 实施计划 | 无 | 无回写 |
| artifact / report 路径统一为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 否 | 承接 04 证据路径边界 | 无 | 无回写 |
| `integration-like` / `operations-replay` 只使用 controlled adapter / replay bundle,不要求真实生产 endpoint | 否 | 承接 Step 8 环境边界 | 无 | 无回写 |
| flaky / timeout / dependency failure 处理不引入风险接受裁决 | 否 | 缺陷与复验细节留给 Step 11 / Step 14 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续实施计划需要实际创建脚本,必须按本步目录、参数和输出契约承接,不得改写测试方案的证据路径。
```

## 9. 回填草稿

正式 `05-测试方案.md` §9 建议采用以下结构:

```text
9. 自动化与 CI/CD 门禁
  9.1 自动化套件表
  9.2 CI/CD 门禁图
  9.3 gate / check / report 脚本表
  9.4 artifact 与 report 输出映射表
  9.5 用例族到自动化 suite 映射
  9.6 flaky、超时和依赖故障处理
  9.7 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §9.1 | `design-calibration/05_test_plan_step_09_automation_gates.md` §7.1 |
| §9.2 | `design-calibration/05_test_plan_step_09_automation_gates.md` §7.2 |
| §9.3 | `design-calibration/05_test_plan_step_09_automation_gates.md` §7.3 |
| §9.4 | `design-calibration/05_test_plan_step_09_automation_gates.md` §7.4 |
| §9.5 | `design-calibration/05_test_plan_step_09_automation_gates.md` §7.5 |
| §9.6 | `design-calibration/05_test_plan_step_09_automation_gates.md` §7.6 |
| §9.7 | `design-calibration/05_test_plan_step_09_automation_gates.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 10 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| PR gate 范围 | 是否接受 PR 必跑 unit、核心 service、快速 API contract 和 config-fast |
| main CI 范围 | 是否接受 main CI 承担 P0 全量自动化主门禁 |
| release gate | 是否接受 release gate 只跑 smoke、config redline 和 evidence pack,不穷举全部 P0 |
| nightly | 是否接受 replay / stress 长耗时 suite 放 nightly,但 release 前必须处理相关 blocker |
| 路径约束 | 是否确认禁止 `latest`、`artifacts/test/<project>/<run_id>` 和 `reports/<project>` |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 自动化门禁清晰 | 通过 | §7.1 / §7.2 |
| 阻断级别明确 | 通过 | 每个 suite 有阻断级别 |
| gate / check / report 脚本分类清晰 | 通过 | §7.3 |
| artifact / report 输出可定位 | 通过 | §7.4 |
| flaky / timeout / dependency failure 有处理口径 | 通过 | §7.6 |
| 对上游设计影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 10 | 通过 | 下一步定义专项测试与非功能验证 |
