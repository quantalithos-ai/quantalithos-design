# L0-bus 05 测试方案 Step 12: 进入准则与退出准则

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 12 中间产物。
> 本步定义测试执行什么时候可以开始、什么时候可以结束,以及哪些缺陷、证据和风险会阻断退出。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义进入准则与退出准则 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §12 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_07_test_data.md` | 已确认 | 提取 `run_id`、fixture、builder、隔离和清理要求 |
| `05_test_plan_step_08_environment_config.md` | 已确认 | 提取 local-dev、ci-test、integration-test、operations-recovery、staging-like 环境矩阵 |
| `05_test_plan_step_09_automation_ci_gates.md` | 已确认 | 提取 PR / main CI / nightly / release gate、script 和 report 输出规则 |
| `05_test_plan_step_10_special_nonfunctional.md` | 已确认 | 提取安全、一致性、恢复、审计、redaction 和 report integrity 红线 |
| `05_test_plan_step_11_defects_retest.md` | 已确认 | 提取 S0 / S1 / S2 / S3 / P1-risk 分级、复验和风险接受规则 |
| `00-需求文档.md` ~ `04-配置设计.md` | 已完成 | 提取 L0-bus P0 范围、配置 profile、runtime graph 和禁止越界事项 |

---

## 3. SOP 问题回答

### 3.1 开始测试前哪些文档必须冻结?

这里的“开始测试”指正式执行 L0-bus P0 测试与 release gate,不是本轮 Step 12 中间产物编写。

| 文档 / 中间产物 | 进入测试前状态 | 原因 |
|---|---|---|
| `00-需求文档.md` | 已校准并冻结当前 P0 范围 | 测试范围必须来自稳定需求 |
| `01-架构设计.md` | 已校准并冻结跨仓边界 | 防止测试把 core / bus / sdk / observability / governance 边界测混 |
| `02-概要设计.md` | 已校准并冻结主要组成部分和关键对象轮廓 | 用例对象和切口必须有稳定结构来源 |
| `03-详细设计.md` | 已校准并冻结接口、对象、状态机、事务、错误和脚本契约 | 自动化测试必须知道函数、状态、错误和证据契约 |
| `04-配置设计.md` | 已校准并冻结配置来源、profile、loader / validator / runtime graph | 环境与配置矩阵必须可执行 |
| `05-测试方案.md` | Step 15 后正式重建,至少 §1~§12 已确认 | 进入准则自身必须已经被纳入正式测试方案 |
| `05_test_plan_step_01`~`12` | 均已确认 | 正式 `05` 的内容来源必须可追溯 |
| `06-验收标准.md` | release 前必须可用 | 测试退出结果需要被验收标准裁决 |

结论: 测试执行不得依赖旧版 `05-测试方案.md`。当前 Step 1~14 只是校准阶段,正式执行测试前必须先在 Step 15 删除并重建正式 `05`。

### 3.2 哪些环境和数据必须可用?

| 环境 / 数据 | 必须可用的内容 | 不可用时处理 |
|---|---|---|
| `ci-test` profile | unit、service、contract、config、redaction smoke、fast integration 所需 fake runtime | 阻断 PR gate |
| `integration-test` profile | fake source、fake backend、in-memory store、in-memory sink、worker / job runtime graph | 阻断 main CI |
| `operations-recovery` profile | retry、DLQ、replay preparation、projection rebuild、backend capability job fixture | 阻断 release gate |
| `run_id` 生成 | 每次运行唯一,进入 artifact、report、fixture namespace | 无法生成则不得启动 gate |
| `TestRunBuilder` 基础数据 | actor、metadata、fixed clock、deterministic id namespace | 无法构造则不得执行用例 |
| `DS-BUS-*` fixture | publication、delivery、feedback、recovery、projection、config、redaction 数据集 | 缺失对应数据集则阻断对应 suite |
| `L0-core` shared contracts | 本地 path dependency 可编译 | 编译失败阻断所有 P0 测试 |
| artifact / report root | `artifacts/test/<run_id>`、`reports/runs/<run_id>` 可写 | release gate 失败 |

`staging-like` 和 `production-like` 不是当前 P0 进入测试的必要条件。它们不可用时记录为 P1/P2 风险,不得阻断当前 P0 测试启动。

### 3.3 哪些自动化必须可运行?

| 自动化 | 进入测试前要求 | 失败影响 |
|---|---|---|
| `scripts/gates/run_pr_gate.sh` | 可运行,支持 `--run-id`、`--artifact-root`、`--config-profile` | 阻断 PR gate |
| `scripts/gates/run_ci_gate.sh` | 可运行,覆盖 full integration、worker、job、report smoke | 阻断 main CI |
| `scripts/gates/run_release_gate.sh` | 可运行,覆盖 closed loop、recovery、config runtime、redaction、report | 阻断 release |
| `scripts/checks/check_redaction.sh` | 可扫描 log、audit、event、projection、evidence、report | 失败即 S0 |
| `scripts/checks/check_artifact_layout.sh` | 可验证 artifact root 不含 `<project>` 层、不引用 `latest` | 阻断 release |
| `scripts/checks/check_report_links.sh` | 可验证 reports 中 evidence 链接存在 | 阻断 release |
| `scripts/checks/check_config_summary.sh` | 可验证报告中记录 profile、redaction policy、runtime summary | 阻断 release |
| `scripts/reports/generate_reports.sh` | 可生成 `reports/runs/<run_id>` | 阻断 release |
| `scripts/reports/generate_acceptance_index.sh` | 可生成 `reports/acceptance/<run_id>-index.md` | 阻断 release |

自动化脚本可以在实现阶段继续细化参数和内部命令,但进入正式测试前必须满足上述脚本契约和输出路径契约。

### 3.4 退出时哪些用例必须通过?

退出分为三层: PR 退出、main CI 退出和 release / acceptance 退出。越靠后覆盖越完整。

| 退出层级 | 必须通过的用例 / suite | 退出要求 |
|---|---|---|
| PR gate | `bus-unit`、`bus-service`、`bus-contract`、`bus-config`、`bus-redaction-smoke`、`bus-integration-fast` | 全部通过,无 S0 / S1 |
| main CI | PR gate + `bus-integration-full`、`bus-worker-consumer`、`bus-job-runner`、`bus-report-smoke` | 全部通过,生成 run summary |
| release gate | `TC-BUS-PUB-*`、`TC-BUS-SEM-*`、`TC-BUS-DLV-*`、`TC-BUS-FDB-*`、`TC-BUS-REC-*`、`TC-BUS-OUT-*`、`TC-BUS-OBX-*`、`TC-BUS-BND-*`、`TC-BUS-CFG-*`、`TC-BUS-RED-*` | P0 / P0-min 全部通过,报告和证据可追溯 |
| acceptance exit | release gate + reports / acceptance index | `reports/acceptance/<run_id>-index.md` 可被 `06-验收标准.md` 使用 |

`nightly` 的 stress / failure injection / P1 adapter smoke 不作为当前 P0 release 的全部退出前置,但若发现 S0 / S1 等级问题,必须升级阻断 release。

### 3.5 哪些缺陷和风险会阻断退出?

| 缺陷 / 风险 | 是否阻断退出 | 说明 |
|---|---|---|
| S0 | 是 | 一票否决,不得风险接受 |
| S1 | 是 | P0 主链或 P0-min 支撑边界不可用 |
| 未复验的 S0 / S1 修复 | 是 | 必须有自动化复验和证据 |
| redaction check 失败 | 是 | forbidden body / raw secret / private body 命中即失败 |
| report / artifact 缺失 | 是 | 验收证据不可用 |
| `latest` 或跨 run evidence 引用 | 是 | 证据不可审计 |
| Query 写 truth | 是 | 只读边界破坏 |
| replay 缺 audit chain 仍 ready | 是 | 恢复链可信度破坏 |
| S2 | 有条件 | 需 owner、影响、期限、复验计划和风险接受记录 |
| S3 | 通常否 | 但重复出现或影响 evidence 时升级 |
| P1-risk | 当前 P0 不阻断 | 必须进入残余风险,后续 P1 专项处理 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 没有进入 / 退出门禁 | 只描述要测什么,没有说明何时可测、何时可结束 | 测试执行可能依赖口头判断 | 本步定义可判定准则 |
| “测试完成”容易被写成模糊状态 | 可能出现“基本通过”“大体完成” | 验收无法裁决 | 本步禁止模糊词,要求用例、gate、证据和缺陷状态 |
| 文档冻结边界不清 | 旧测试方案与新版 `00~04` 不一致 | 执行时引用过时设计 | 本步要求正式 `05` Step 15 重建后再进入测试执行 |
| P0 和 P1/P2 退出条件混杂 | staging-like / production-like 容易阻断当前 P0 | 当前范围失控 | 本步把 P1/P2 风险记录和 P0 阻断分开 |
| 证据退出条件不清 | gate 通过但 report / artifact 不可审计 | `06` 无法验收 | 本步把 reports / acceptance index 纳入退出准则 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 进入测试 | 未定义 | 文档、环境、数据、自动化准入清单 | 可执行 |
| 退出测试 | 未定义 | PR / main CI / release / acceptance 分层退出 | 可裁决 |
| 缺陷阻断 | 分散 | S0 / S1 / S2 / S3 / P1-risk 与退出绑定 | 防止红线降级 |
| 证据要求 | 隐含 | artifact、report、acceptance index 是退出条件 | 可追溯 |
| P1/P2 | 容易混入 P0 | 不阻断当前 P0,但进入残余风险 | 范围稳定 |

---

## 6. 测试设计取舍

### 6.1 是否要求 `06-验收标准.md` 在测试启动前完全冻结

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 必须完全冻结后才能跑任何测试 | 验收口径最稳定 | 会阻塞 PR / CI 测试前移 |
| B. PR / CI 可基于 `05` 启动,release / acceptance 前 `06` 必须可用 | 兼顾前移和裁决 | 需要区分测试层级 | 采用 |
| C. `06` 不参与测试退出 | 简单 | 测试结果无法被验收裁决 | 不采用 |

### 6.2 是否把 nightly stress 作为 release 必须全部通过项

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部 nightly 必须通过才能 release | 覆盖强 | 压力和 P1 smoke 可能把 P0 release 变慢且不稳定 |
| B. release gate 覆盖 P0 红线,nightly 发现 S0 / S1 才阻断 | 平衡范围和风险 | 需要分级判断 | 采用 |
| C. nightly 完全不影响 release | 快 | 真实红线可能被忽略 | 不采用 |

### 6.3 是否允许 S2 缺陷带风险退出

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许有条件风险接受 | 保持交付弹性 | 需要严格记录 owner 和期限 | 采用 |
| B. 所有 S2 阻断退出 | 保守 | 可能把非红线问题放大 |
| C. S2 直接忽略 | 快 | 质量风险不可追踪 |

---

## 7. 结构化中间产物

### 7.1 进入 / 执行 / 退出门禁图

```text
+--------------------------+
| Entry criteria           |
| docs / env / data / gates|
+------------+-------------+
             |
             v
+------------+-------------+
| Test execution           |
| PR / CI / release gates  |
+------------+-------------+
             |
             v
+------------+-------------+
| Exit criteria            |
| cases / defects / risk   |
+------------+-------------+
             |
             v
+------------+-------------+
| Evidence handoff         |
| reports / acceptance idx |
+--------------------------+
```

图后说明：

- Entry criteria 判定测试是否允许开始。
- Test execution 按 PR、main CI、nightly、release gate 分层执行。
- Exit criteria 判定是否允许结束当前测试层级。
- Evidence handoff 把 `reports/runs/<run_id>` 和 `reports/acceptance/<run_id>-index.md` 交给 `06-验收标准.md` 裁决。

### 7.2 进入准则

正式测试执行前按以下清单判定:

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已校准,且本轮测试不再改变 P0 范围。
- [ ] `05-测试方案.md` 已在 Step 15 删除旧文件并按新文件标准重建,且 §1~§12 已承接 Step 1~12 中间产物。
- [ ] `ci-test`、`integration-test`、`operations-recovery` profile 可加载并通过 config validation。
- [ ] `L0-core` shared contracts 可通过本地 path dependency 编译。
- [ ] `TestRunBuilder` 能生成唯一 `run_id`、actor、metadata、fixed clock 和 deterministic id namespace。
- [ ] `DS-BUS-*` fixture 数据集可构造,并能按 `run_id` 隔离。
- [ ] `scripts/gates/run_pr_gate.sh`、`run_ci_gate.sh`、`run_release_gate.sh` 可运行并支持标准参数。
- [ ] `scripts/checks/check_redaction.sh`、`check_artifact_layout.sh`、`check_report_links.sh`、`check_config_summary.sh` 可运行。
- [ ] `scripts/reports/generate_reports.sh` 和 `generate_acceptance_index.sh` 可生成约定目录。
- [ ] `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 可写,且测试门禁不使用 `latest`。
- [ ] 已明确 S0 / S1 / S2 / S3 / P1-risk 分级和复验规则。

### 7.3 退出准则

正式测试退出前按以下清单判定:

- [ ] PR gate 阻断套件全部通过,没有未关闭 S0 / S1。
- [ ] main CI 阻断套件全部通过,并生成当前 `run_id` 的 summary。
- [ ] release gate 的 P0 / P0-min 用例族 `TC-BUS-PUB-*`、`TC-BUS-SEM-*`、`TC-BUS-DLV-*`、`TC-BUS-FDB-*`、`TC-BUS-REC-*`、`TC-BUS-OUT-*`、`TC-BUS-OBX-*`、`TC-BUS-BND-*`、`TC-BUS-CFG-*`、`TC-BUS-RED-*` 全部通过。
- [ ] redaction、artifact layout、report links、config summary 四类 check 全部通过。
- [ ] `artifacts/test/<run_id>` 存在且不含 `<project>` 层级、不依赖 `latest`。
- [ ] `reports/runs/<run_id>/summary.md`、coverage、redaction、artifact index 可用。
- [ ] `reports/acceptance/<run_id>-index.md` 已生成,并能被 `06-验收标准.md` 引用。
- [ ] S0 / S1 缺陷全部关闭并完成自动化复验。
- [ ] S2 缺陷如未关闭,必须有 owner、影响范围、到期时间、风险接受记录和复验计划。
- [ ] S3 缺陷不影响证据、报告和验收裁决。
- [ ] P1-risk 已进入残余风险清单,且不被误声明为当前 P0 已交付能力。

### 7.4 准则到证据映射表

| 准则类型 | 判定材料 | 证据位置 |
|---|---|---|
| 文档冻结 | `00~05` 文档版本和 Step 中间产物 | 正式文档头部、`design-calibration/` |
| 环境可用 | config validation、runtime graph summary | `artifacts/test/<run_id>/config` |
| 数据可用 | fixture generation summary | `artifacts/test/<run_id>/fixtures` |
| 自动化可运行 | gate result、check result | `artifacts/test/<run_id>/gates` |
| 用例通过 | suite result、case evidence | `artifacts/test/<run_id>/<suite>` |
| 红线通过 | redaction report、boundary negative result | `reports/runs/<run_id>/redaction-check.md` |
| 报告可用 | summary、coverage、artifact index | `reports/runs/<run_id>` |
| 验收交接 | acceptance index | `reports/acceptance/<run_id>-index.md` |
| 风险接受 | risk record、owner、expiry、retest plan | `reports/runs/<run_id>/risk-register.md` |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_12_entry_exit_criteria.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“进入准则”“退出准则”和“准则到证据映射表”小节，了解测试开始、结束和证据交接如何被裁决。

本章定义 L0-bus 测试执行的进入准则与退出准则。进入测试前,需求、架构、概要、详细、配置和正式测试方案必须收稳;`ci-test`、`integration-test`、`operations-recovery` profile 必须可用;`run_id`、fixture、gate、check、report 脚本和 artifact / report 目录必须满足约定。

退出测试时,PR gate、main CI 和 release gate 的 P0 / P0-min 用例族必须通过;S0 / S1 缺陷必须关闭并完成自动化复验;redaction、artifact layout、report links 和 config summary 必须通过;`reports/runs/<run_id>` 和 `reports/acceptance/<run_id>-index.md` 必须可用于后续验收裁决。P1-risk 不阻断当前 P0,但必须进入残余风险记录。

---

## 9. 待确认事项

当前没有阻塞进入 Step 13 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| `06-验收标准.md` 是否必须在所有测试启动前完成 | A. 是;B. PR / CI 可先跑,release 前必须完成;C. 不需要 | 采用 B | 测试可前移,但 release / acceptance 退出必须有验收裁决 |
| nightly stress 是否阻断 release | A. 全部阻断;B. 发现 S0 / S1 才阻断;C. 永不阻断 | 采用 B | 当前 P0 不以压力和 P1 adapter 为全部交付前置,但红线必须升级 |
| S2 是否可带风险退出 | A. 条件接受;B. 全部阻断;C. 直接忽略 | 采用 A | 需要保留交付弹性,但必须有 owner、期限、影响和复验计划 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 开始测试前必须冻结的文档已列出 | 已满足 |
| 必须可用的环境和数据已列出 | 已满足 |
| 必须可运行的自动化已列出 | 已满足 |
| 退出时必须通过的用例和 suite 已列出 | 已满足 |
| 阻断退出的缺陷和风险已列出 | 已满足 |
| 进入 / 退出准则均可判定,没有“基本完成”等模糊项 | 已满足 |

结论: 可以进入 Step 13,定义测试报告与证据归档。
