# L0-bus 05 测试方案 Step 9: 自动化与 CI/CD 门禁

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 9 中间产物。
> 本步定义哪些测试套件自动执行、在哪条流水线执行、失败是否阻断,以及 gate / check / report 脚本和证据输出规则。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 设计自动化与 CI/CD 门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §9 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_04_strategy_layers.md` | 已确认 | 提取 Unit / Service / Integration / API / Release gate 分层和阻断策略 |
| `05_test_plan_step_06_cases.md` | 已确认 | 提取 `TC-BUS-*` 用例矩阵、自动化候选和证据编号 |
| `05_test_plan_step_08_environment_config.md` | 已确认 | 提取 local-dev、ci-test、integration-test、operations-recovery 环境和 profile |
| `03-详细设计.md` §15.3 | 已完成 | 提取 `scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/checks/check_redaction.sh` 的脚本契约 |
| `04-配置设计.md` §12 | 已完成 | 提取 config summary、redaction check、reports / artifacts 承接要求 |

---

## 3. SOP 问题回答

### 3.1 哪些 suite 必须进 PR?

| Suite | 进入 PR 的原因 | 阻断 |
|---|---|---|
| `bus-unit` | domain object、state machine、policy、config value 的规则错误必须最早发现 | 是 |
| `bus-service` | application service 的 UoW、幂等、audit、副作用顺序必须阻断 | 是 |
| `bus-contract` | Command / Query / Event / Job schema 和 error DTO 是外部契约 | 是 |
| `bus-config` | JSON profile、validator、secret ref、reload rejection 是运行前置 | 是 |
| `bus-redaction-smoke` | payload body / raw secret 红线必须在 PR 前移 | 是 |
| `bus-integration-fast` | in-memory repository、fake adapter、runtime graph 的最小集成路径 | 是 |

### 3.2 哪些 suite 进 main CI?

| Suite | 进入 main CI 的原因 | 阻断 |
|---|---|---|
| `bus-integration-full` | 覆盖 repository、adapter、worker、job、runtime graph 全集 | 是 |
| `bus-worker-consumer` | outbox、backend signal、timeout consumer 的 at-least-once 语义 | 是 |
| `bus-job-runner` | delivery progression、retry cycle、projection、backend capability job | 是 |
| `bus-report-smoke` | 确认证据目录和报告摘要可生成 | 是 |

### 3.3 哪些 suite 进 nightly?

| Suite | 进入 nightly 的原因 | 阻断 |
|---|---|---|
| `bus-concurrency-stress` | 并发、expected version、duplicate、projection conflict 风险较高但耗时 | 不阻断 PR,失败进入调查 |
| `bus-failure-injection` | publisher、source ack、backend unavailable、commit uncertain 组合故障 | 不阻断 PR,阻断 release 前关闭 |
| `bus-p1-adapter-smoke` | staging-like / real-like adapter 后续专项入口 | 当前不阻断 P0 |

### 3.4 哪些 suite 是 staging smoke 或 release gate?

| Suite | 类型 | 进入原因 | 阻断 |
|---|---|---|---|
| `bus-release-closed-loop` | release gate | publication -> delivery -> feedback -> read-only output 主闭环 | 是 |
| `bus-release-recovery` | release gate | retry -> DLQ -> replay preparation 的恢复链 | 是 |
| `bus-release-config-runtime` | release gate | 配置 profile 到 runtime graph 的装配 | 是 |
| `bus-release-redaction` | release gate | forbidden body / raw secret / private body 全量扫描 | 是 |
| `bus-release-report` | release gate | `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 可交付验收 | 是 |
| `bus-staging-like-smoke` | staging smoke | P1 real-like adapter 演练 | 当前不阻断 P0 |

### 3.5 flaky、超时和依赖故障如何处理?

| 问题 | 处理规则 |
|---|---|
| P0 deterministic suite flaky | 视为失败,不得自动忽略 |
| fake dependency 初始化失败 | 视为环境失败,阻断对应 gate |
| P1 staging-like dependency 不可用 | 标记 skipped / unavailable,进入残余风险 |
| 单用例超时 | 记录 timeout evidence,阻断对应 P0 gate |
| report / artifact 目录不可写 | release gate 失败 |
| redaction check 无法执行 | release gate 失败 |
| rerun | 允许重新执行同一 gate,但必须使用新的 `run_id`;正式门禁不得引用 `latest` |

### 3.6 每个阻断 suite 由哪个 `scripts/gates/*.sh` 执行?

| 阻断范围 | Gate script | 说明 |
|---|---|---|
| PR gate | `scripts/gates/run_pr_gate.sh` | 运行 unit、service、contract、config、redaction smoke、fast integration |
| main CI gate | `scripts/gates/run_ci_gate.sh` | 运行 full integration、worker、job、report smoke |
| release gate | `scripts/gates/run_release_gate.sh` | 运行 closed loop、recovery、config runtime、redaction、report |
| staging-like smoke | `scripts/gates/run_staging_smoke.sh` | P1 专项,当前不阻断 P0 |

### 3.7 每个 gate 的默认 `artifact-root` 是否为 `artifacts/test/<run_id>`?

是。所有 gate 默认 artifact root 必须为:

```text
artifacts/test/<run_id>
```

不得使用:

```text
artifacts/test/<project>/<run_id>
artifacts/test/latest
```

### 3.8 每个 gate 是否支持 `--run-id`、`--artifact-root`、`--config-profile`?

所有 gate script 必须支持以下参数:

| 参数 | 作用 | 默认 |
|---|---|---|
| `--run-id` | 标识一次测试运行 | 调用方必须显式传入或由脚本生成并打印 |
| `--artifact-root` | artifact 输出根目录 | `artifacts/test/<run_id>` |
| `--config-profile` | 选择测试配置 profile | PR 默认 `ci-test`,集成默认 `integration-test`,release 默认 `operations-recovery` 或 release profile 组合 |
| `--report-root` | 报告输出根目录,report script 使用 | `reports/runs/<run_id>` |

### 3.9 哪些 `scripts/checks/*.sh` 必须进入 release gate?

| Check script | 进入 release gate 的原因 |
|---|---|
| `scripts/checks/check_redaction.sh` | 扫描 log、audit、event、projection、evidence 是否含 forbidden body |
| `scripts/checks/check_artifact_layout.sh` | 验证 artifact root 使用 `artifacts/test/<run_id>` |
| `scripts/checks/check_report_links.sh` | 验证 reports 引用的 evidence 存在且不引用 `latest` |
| `scripts/checks/check_config_summary.sh` | 验证报告中记录了 config profile 和 redaction policy |

### 3.10 哪些 `scripts/reports/*.sh` 在 gate 后生成 `reports/runs/<run_id>`?

| Report script | 输出 |
|---|---|
| `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/summary.md`、coverage、redaction、artifact index |
| `scripts/reports/generate_acceptance_index.sh` | `reports/acceptance/<run_id>-index.md` |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 未定义自动化门禁 | 只有测试内容,没有 PR / CI / release 执行规则 | P0 测试可能只停留在文档 | 本步定义 suite 与 gate |
| 脚本目录容易混乱 | 可能把生成脚本放到 `reports/` | 输出目录和工具目录混杂 | 本步固定 `scripts/gates`、`scripts/checks`、`scripts/reports` |
| artifact / report 路径不稳定 | 可能出现 `<project>` 层级或 `latest` | 验收引用不稳定 | 本步固定 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` |
| P0 / P1 阻断边界不清 | staging-like 可能阻断当前 P0 | 当前交付范围失控 | 本步把 staging-like 归 P1 smoke |
| flaky 处理缺失 | deterministic suite 失败可能被忽略 | 红线失真 | 本步定义 flaky / timeout / dependency failure 规则 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 自动化范围 | 未明确 | PR / main CI / nightly / release gate 分层 | 可执行 |
| 脚本布局 | 未明确 | gate / check / report 三类脚本分目录 | 可维护 |
| 输出路径 | 未稳定 | artifact 和 report 均按 `run_id` | 可追溯 |
| 阻断规则 | 不清晰 | P0 阻断,P1 smoke 不阻断 | 可裁决 |
| 报告承接 | 模糊 | gate 后生成 reports 并进入 acceptance index | 支撑 `06` |

---

## 6. 测试设计取舍

### 6.1 是否把所有 suite 都放进 PR

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 所有 suite 都进 PR | 覆盖最早 | PR 过慢,影响开发反馈 | 不采用 |
| B. PR 运行 P0 快速阻断套件,main / nightly / release 承接重套件 | 平衡速度和覆盖 | 需要 gate 分层 | 采用 |
| C. PR 只跑 unit | 很快 | 集成和协议风险后移 | 不采用 |

### 6.2 是否允许 `latest` 作为正式门禁引用

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 `latest` | 使用方便 | 证据不可审计 | 不采用 |
| B. 正式门禁只用 `run_id`,本地可临时 alias | 可审计 | 本地需要额外便利脚本 | 采用 |
| C. 不生成任何固定索引 | 简单 | 查找困难 | 不采用 |

### 6.3 是否把 report 生成脚本放在 `reports/`

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 放在 `reports/` | 看起来接近输出 | 工具和输出混杂 | 不采用 |
| B. 放在 `scripts/reports/`,输出到 `reports/runs/<run_id>` | 边界清晰 | 需要说明脚本位置 | 采用 |
| C. 不提供 report 脚本 | 简单 | 验收证据不可稳定生成 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 CI/CD 门禁图

```text
+------------------+
| Pull request      |
+--------+---------+
         |
         v
+--------+---------+
| run_pr_gate.sh    |
| fast P0 suites    |
+--------+---------+
         |
         v
+--------+---------+
| Main CI           |
| run_ci_gate.sh    |
+--------+---------+
         |
         v
+--------+---------+
| Nightly           |
| stress / failure  |
+--------+---------+
         |
         v
+--------+---------+
| Release gate      |
| run_release_gate  |
+--------+---------+
         |
         v
+--------+---------+
| reports/runs/id   |
| acceptance index  |
+------------------+
```

图后说明：

- PR gate 必须快,但不能跳过 P0 红线。
- main CI 覆盖完整 in-memory / fake 集成路径。
- nightly 承接压力、故障注入和 P1 smoke,不直接替代 release gate。
- release gate 必须生成 `reports/runs/<run_id>` 和 `reports/acceptance` 索引。

### 7.2 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `bus-unit` | domain、state、policy、config values | PR | 每次 PR | 阻断 PR | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/unit` | PR summary |
| `bus-service` | application service、UoW、idempotency、副作用 | PR | 每次 PR | 阻断 PR | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/service` | PR summary |
| `bus-contract` | HTTP JSON、event、job、error DTO | PR | 每次 PR | 阻断 PR | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/contract` | PR summary |
| `bus-config` | loader、validator、profile、secret ref | PR | 每次 PR | 阻断 PR | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/config` | PR summary |
| `bus-redaction-smoke` | forbidden body quick scan | PR | 每次 PR | 阻断 PR | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/redaction-smoke` | PR summary |
| `bus-integration-fast` | in-memory store、fake backend 最小路径 | PR | 每次 PR | 阻断 PR | `scripts/gates/run_pr_gate.sh` | `artifacts/test/<run_id>/integration-fast` | PR summary |
| `bus-integration-full` | repository、adapter、worker、job、runtime graph | main CI | merge / main push | 阻断 main CI | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/integration-full` | `reports/runs/<run_id>` |
| `bus-worker-consumer` | outbox / backend / timeout consumer | main CI | merge / main push | 阻断 main CI | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/worker` | `reports/runs/<run_id>` |
| `bus-job-runner` | delivery / retry / projection / capability job | main CI | merge / main push | 阻断 main CI | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/jobs` | `reports/runs/<run_id>` |
| `bus-concurrency-stress` | expected version、duplicate、projection conflict | nightly | scheduled | 不阻断 PR | `scripts/gates/run_nightly_gate.sh` | `artifacts/test/<run_id>/stress` | `reports/runs/<run_id>` |
| `bus-failure-injection` | publisher/source/backend/commit failure | nightly | scheduled | 不阻断 PR | `scripts/gates/run_nightly_gate.sh` | `artifacts/test/<run_id>/failure-injection` | `reports/runs/<run_id>` |
| `bus-release-closed-loop` | P0 主闭环 | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh` | `artifacts/test/<run_id>/closed-loop` | `reports/runs/<run_id>` |
| `bus-release-recovery` | retry / DLQ / replay preparation | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh` | `artifacts/test/<run_id>/recovery` | `reports/runs/<run_id>` |
| `bus-release-redaction` | redaction 全量扫描 | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh` | `artifacts/test/<run_id>/redaction` | `reports/runs/<run_id>` |
| `bus-release-report` | summary / acceptance index | release gate | release candidate | 阻断 release | `scripts/gates/run_release_gate.sh` | `artifacts/test/<run_id>/reports-input` | `reports/runs/<run_id>`、`reports/acceptance` |

### 7.3 脚本表

| 脚本 | 类型 | 输入 | 输出 | 失败处理 |
|---|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile=ci-test` | `artifacts/test/<run_id>` | P0 suite 失败则非零退出 |
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile=integration-test` | `artifacts/test/<run_id>` | main CI 阻断 |
| `scripts/gates/run_nightly_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile=integration-test` | `artifacts/test/<run_id>` | 失败生成报告并进入调查 |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile=operations-recovery`、`--report-root` | artifacts + reports | release 阻断 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root`、`--report-root` | `reports/runs/<run_id>/redaction-check.md` | forbidden content 命中则失败 |
| `scripts/checks/check_artifact_layout.sh` | check | `--artifact-root` | layout check output | 路径含 `<project>` 或 `latest` 则失败 |
| `scripts/checks/check_report_links.sh` | check | `--report-root`、`--artifact-root` | link check output | 缺失 evidence 或引用 `latest` 则失败 |
| `scripts/reports/generate_reports.sh` | report | `--run-id`、`--artifact-root`、`--report-root` | `reports/runs/<run_id>` | 生成失败则 release 阻断 |
| `scripts/reports/generate_acceptance_index.sh` | report | `--run-id`、`--report-root` | `reports/acceptance/<run_id>-index.md` | 生成失败则 release 阻断 |

### 7.4 artifact 与 report 输出映射表

| 输出 | 路径 | 生成方 | 说明 |
|---|---|---|---|
| raw test artifacts | `artifacts/test/<run_id>/<suite>` | gate scripts | 测试原始输出、fixtures summary、evidence refs |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | `check_redaction.sh` | release gate 必须存在 |
| run summary | `reports/runs/<run_id>/summary.md` | `generate_reports.sh` | 记录 suite、config profile、run id、结果 |
| coverage matrix report | `reports/runs/<run_id>/coverage-matrix.md` | `generate_reports.sh` | 对应 Step 5 / Step 6 |
| artifact index | `reports/runs/<run_id>/artifact-index.md` | `generate_reports.sh` | 只引用当前 run artifacts |
| acceptance index | `reports/acceptance/<run_id>-index.md` | `generate_acceptance_index.sh` | 供 `06-验收标准.md` 引用 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_09_automation_ci_gates.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“自动化套件表”“脚本表”“artifact 与 report 输出映射表”和“CI/CD 门禁图”小节，了解本章自动化门禁如何从测试分层、用例矩阵和环境矩阵收敛。

L0-bus 自动化门禁分为 PR gate、main CI、nightly 和 release gate。PR gate 运行 P0 快速阻断套件;main CI 运行完整 in-memory / fake 集成套件;nightly 运行并发压力、故障注入和 P1 smoke;release gate 运行 P0 closed loop、recovery、config runtime、redaction 和 reports / artifacts 生成。

Gate script 必须放在 `scripts/gates/`,check script 必须放在 `scripts/checks/`,report script 必须放在 `scripts/reports/`。artifact 输出固定为 `artifacts/test/<run_id>`,report 输出固定为 `reports/runs/<run_id>` 和 `reports/acceptance`;正式门禁不得使用 `latest` 或 `artifacts/test/<project>/<run_id>`。

---

## 9. 待确认事项

当前没有阻塞进入 Step 10 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否把 nightly 设为 PR 阻断 | A. 阻断 PR;B. 不阻断 PR,失败进入调查;C. 不设置 nightly | 采用 B | 并发和故障注入耗时,不应拖慢 PR,但必须保留趋势信号 |
| 是否允许正式报告引用 `latest` | A. 允许;B. 禁止,只引用 run_id;C. 仅本地允许 | 采用 B | 正式验收必须可审计 |
| 是否把 report 脚本放在 `reports/` | A. 放在 reports;B. 放在 scripts/reports;C. 不提供脚本 | 采用 B | 工具目录和输出目录必须分离 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| PR / main CI / nightly / release gate suite 已定义 | 已满足 |
| P0 自动化门禁已明确 | 已满足 |
| 阻断级别已明确 | 已满足 |
| gate / check / report 脚本目录和输入参数已明确 | 已满足 |
| artifact 和 report 输出路径已明确 | 已满足 |
| flaky、超时和依赖故障处理已明确 | 已满足 |

结论: 可以进入 Step 10,设计专项测试与非功能验证。
