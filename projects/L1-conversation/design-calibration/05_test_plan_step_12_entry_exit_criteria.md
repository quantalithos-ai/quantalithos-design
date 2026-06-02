# L1-conversation 05 测试方案 Step 12: 定义进入准则与退出准则

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §12 进入准则与退出准则
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义进入准则与退出准则 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_12_entry_exit_criteria.md` |

本步只定义 P0 测试执行开始前必须满足的进入门禁,以及测试结束时可以支撑验收判断的退出门禁。测试报告、证据编号、归档索引和残余风险分别留给 Step 13 和 Step 14。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_07_test_data.md` | deterministic seed、builder、fake adapter、`TestRunId` 和 run-scoped path | 作为数据进入准则来源 |
| `05_test_plan_step_08_environment_config.md` | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 和依赖类型 | 作为环境进入准则来源 |
| `05_test_plan_step_09_automation_ci_gates.md` | PR、main CI、nightly、release gate、脚本和路径 | 作为自动化进入 / 退出准则来源 |
| `05_test_plan_step_10_special_nonfunctional.md` | 红线、专项、观测和路径检查 | 作为退出红线来源 |
| `05_test_plan_step_11_defects_retest.md` | S0~S3、复验、风险接受和缺陷关闭证据 | 作为阻断退出规则来源 |
| `05_test_plan_calibration_flow.md` | Step 1~11 状态 | 作为测试方案生成阶段的进入前置 |

## 3. SOP 问题回答

### 3.1 开始测试前哪些文档必须冻结?

开始 P0 测试执行前,必须冻结当前 design baseline 中的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`,以及正式生成后的 `05-测试方案.md`。在本轮校准阶段,必须先确认 `05_test_plan_calibration_flow.md` 中 Step 1~11 均为 `[x]`,且不存在会改变 P0 用例、状态、接口、配置或证据路径的未解决设计冲突。

### 3.2 哪些环境和数据必须可用?

`ci-test` 必须可用,并能使用 in-memory store、fixed clock、deterministic id generator、fake resolver、fake publisher 和 fake handoff。`integration-like` 和 `operations-replay` 必须在 release readiness 前可运行,用于 controlled adapter 接缝和 replay / recovery。测试数据必须能由 seed、builder 和 fake script 生成,且所有 ID、artifact 和 report 均由 `TestRunId` 或 `run_id` 隔离。

### 3.3 哪些自动化必须可运行?

`scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh` 和 `scripts/checks/check_redaction.sh` 必须可运行,并支持 Step 9 定义的 `--run-id`、`--artifact-root`、`--config-profile`、`--report-root` 等输入口径。PR、main CI 和 release gate 的 P0-blocking suite 必须能稳定执行,不得依赖真实外部服务或手工造数。

### 3.4 退出时哪些用例必须通过?

退出 P0 测试时,Step 6 中所有 P0-blocking 用例及其所属 PR、main CI、release redline、release report suite 必须通过。P0-supporting 用例如果失败,必须按 Step 11 判定为 S2,并证明不影响 P0 红线和验收裁决。nightly / integration-like / operations-replay 中标记为 release readiness blocking 的 suite 必须在发布候选前通过或形成不影响 P0 的风险接受记录。

### 3.5 哪些缺陷和风险会阻断退出?

任何 S0 或 S1 未关闭缺陷均阻断退出。redaction violation、授权视野失效、source truth 被补造、forbidden body / raw secret 进入 truth / log / event / report、artifact / report path shape 错误、fake-as-production、P0 flaky 未判定、P0 timeout 未复验、release redline 失败均阻断退出。S2 / S3 只有在具备影响范围、owner、修复时间、临时规避和 P0 不受影响证据时才可风险接受。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧稿没有明确测试开始和结束门禁,也没有把缺陷分级与退出绑定 | 不继承旧门禁 |
| Step 7 | 数据已定义,但还不是进入准则 | 本步要求 seed / builder / fake / run path 可用 |
| Step 8 | 环境矩阵已定义,但还未说明哪些环境阻断进入或退出 | 本步明确 `ci-test` 进入、release readiness 环境退出 |
| Step 9 | 自动化和脚本已定义,但还未形成测试执行前提 | 本步把脚本可运行和 P0 suite 可执行列入进入准则 |
| Step 10 | 红线和专项已定义,但还未绑定退出 | 本步把红线失败列为退出阻断 |
| Step 11 | 缺陷和复验规则已定义 | 本步把 S0 / S1 关闭状态作为退出硬门禁 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 开始测试条件 | 只知道要有环境和数据 | 明确 design baseline、Step 1~11、`ci-test`、fixture、脚本和 path 均需可检查 |
| 结束测试条件 | 容易写成“测试通过” | 明确 P0 suite、release redline、redaction、report、缺陷关闭和风险接受 |
| 缺陷对退出影响 | 分级存在但未绑定退出 | S0 / S1 未关闭即阻断,S2 / S3 需风险接受记录 |
| 环境不可用 | 未关联进入 / 退出 | `ci-test` 不可用阻断进入;release readiness 环境失败阻断发布候选退出 |
| 证据路径 | 只在前面 Step 出现 | 退出要求可生成 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 进入准则是否要求全部环境 | 要求 local / ci / integration / staging / production 全部可用 | P0 进入只要求 `ci-test`;release readiness 再要求 integration / replay | B | P0 不依赖 staging / production |
| 退出准则是否允许 S1 风险接受 | 可签字放行 | S0 / S1 一律阻断 | B | S1 已定义为 P0-blocking |
| P0-supporting 失败是否阻断 | 一律阻断 | 先分级,若为 S2 且不影响 P0 可风险接受 | B | 保留 readiness 风险但不污染 P0 结论 |
| 证据编号是否本步锁定 | 本步生成 EV 编号 | Step 13 统一编号,本步只要求路径和报告可生成 | B | 证据索引属于 Step 13 |
| 是否用“基本完成”类准则 | 使用自然语言 | 全部写成 checklist / gate 条件 | B | SOP 要求客观可判定 |

## 7. 结构化中间产物

### 7.1 进入准则

- [ ] `05_test_plan_calibration_flow.md` 中 Step 1~11 均为 `[x]`,且 Step 12 开始前没有未解决的 S0 / S1 设计冲突。
- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已冻结到同一 design baseline,并可被测试方案引用。
- [ ] `ci-test` profile 可启动,且使用 in-memory store、fixed clock、deterministic id generator、fake resolver、fake publisher、fake handoff。
- [ ] `DS-CONV-*` 数据集可由 seed / builder / fake script 自动生成,无需人工手工造数。
- [ ] `TestRunId` / `run_id` 生成规则可用,并能创建 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`。
- [ ] `scripts/gates/run_ci_gate.sh` 可运行,并接受 `--run-id`、`--artifact-root`、`--config-profile`。
- [ ] `scripts/reports/generate_reports.sh` 可运行,并接受 `--run-id`、`--artifact-root`、`--report-root`。
- [ ] `scripts/checks/check_redaction.sh` 可运行,并能读取 gate artifacts 与 generated reports。
- [ ] PR / main CI / release gate 的 P0-blocking suite 清单与 Step 6 用例矩阵一致,没有 P0 用例缺少执行位置。
- [ ] redaction policy、artifact path shape、report path shape 和 fake-as-production negative fixture 已准备。

### 7.2 退出准则

- [ ] Step 6 中所有 P0-blocking 用例在同一测试基线下通过,并能关联到对应 suite result。
- [ ] `SUITE-CONV-PR-UNIT`、`SUITE-CONV-PR-CONTRACT`、`SUITE-CONV-PR-SERVICE-SMOKE` 已通过或被 main CI 中同等覆盖替代并留痕。
- [ ] `SUITE-CONV-MAIN-SERVICE`、`SUITE-CONV-MAIN-QUERY`、`SUITE-CONV-MAIN-WORKER-JOB`、`SUITE-CONV-MAIN-CONFIG` 全部通过。
- [ ] `SUITE-CONV-RELEASE-REDLINE`、`scripts/checks/check_redaction.sh` 和 `SUITE-CONV-RELEASE-REPORT` 全部通过。
- [ ] release readiness 所需的 `SUITE-CONV-NIGHTLY-INTEGRATION-LIKE` 和 `SUITE-CONV-NIGHTLY-OPS-REPLAY` 已通过,或失败项被正式分级为 S2 并完成风险接受记录。
- [ ] 没有未关闭的 S0 / S1 缺陷;所有 S0 / S1 修复均完成直接 TC、同组 TC、相关 suite、redline 和必要 redaction 复验。
- [ ] 所有未关闭 S2 / S3 均有影响范围、owner、目标修复时间、临时规避和 P0 不受影响说明。
- [ ] `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance` 已生成,且不存在 `<project>` 层级或 `latest` 目录。
- [ ] generated reports、logs、audit materials、diagnostics 中未出现 forbidden body、runtime reasoning body、bridge platform body、raw secret、raw payload。
- [ ] 没有 P0 flaky、P0 timeout、dependency failure 或 environment failure 被静默忽略;每个失败均有 failure summary、复验结果或阻断记录。

### 7.3 进入 / 退出阻断矩阵

| 阻断项 | 阻断进入 | 阻断退出 | 处理 |
|---|---|---|---|
| Step 1~11 未确认 | 是 | 不适用 | 回到对应 Step 补中间产物 |
| 设计真相源冲突影响 P0 字段 / 状态 / 接口 / 配置 | 是 | 是 | 暂停测试方案落地或测试执行,先修设计 |
| `ci-test` 不可用 | 是 | 是 | 修复 profile、fixture 或脚本启动条件 |
| artifact / report root 不可写 | 是 | 是 | 修复路径或权限,不得伪造报告 |
| P0-blocking suite 失败 | 不一定 | 是 | 按 S1 缺陷复验并关闭 |
| release redline / redaction 失败 | 不一定 | 是 | 按 S0 或 S1 处理 |
| S0 / S1 未关闭 | 是 | 是 | 不允许风险接受 |
| S2 / S3 未关闭且无风险接受 | 否 | 是 | 补影响评估和 owner,或修复 |
| staging-like 未准备 | 否 | 否 | 记录为 P1 readiness,不影响 P0 |
| production-like 未准备 | 否 | 否 | 记录为 P1/P2 后续专项 |

### 7.4 未满足准则时的处理

| 场景 | 处理规则 |
|---|---|
| 进入准则失败 | 不启动 P0 测试执行;修复环境、数据、脚本或设计冲突后重新检查进入准则 |
| 退出准则失败 | 不生成 P0 通过结论;按 Step 11 建缺陷、复验和关闭 |
| release readiness 环境失败 | 不宣称 release readiness;可继续保留 P0 design/test 结论,但必须记录为 S2 或后续 readiness 风险 |
| 证据路径错误 | 当前 run 不可用于验收;修复 path shape 后重新执行相关 gate |
| 报告生成失败 | 当前 run 不可退出;先修 report generation,再进入 Step 13 证据归档 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §12 时摘录。

```markdown
## 12. 进入准则与退出准则

> 校准来源：
> - `design-calibration/05_test_plan_step_12_entry_exit_criteria.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“进入准则”“退出准则”“进入 / 退出阻断矩阵”和“未满足准则时的处理”小节，了解 P0 测试执行何时可以开始、何时可以形成通过结论。

开始 P0 测试执行前,必须冻结同一 design baseline 下的需求、架构、概要、详细和配置设计,并确认测试方案 Step 1~11 中间产物均已完成。`ci-test` profile、deterministic fixture、fake adapter、run-scoped artifact / report path 和 gate / report / redaction 脚本必须可运行。

退出 P0 测试时,所有 P0-blocking 用例、main CI suite、release redline、redaction check 和 report generation 必须通过。不得存在未关闭的 S0 / S1 缺陷。S2 / S3 只有在具备影响范围、owner、目标修复时间、临时规避和 P0 不受影响证据时才可风险接受。artifact 和 report 路径固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`,不得使用 `<project>` 层级或 `latest`。
```

## 9. 待确认事项

无阻塞进入 Step 13 的待确认事项。

后续 Step 必须继续收口:

- Step 13 将本步退出准则中的 artifact、report、redaction check 和 acceptance extract 转成正式证据归档结构。
- Step 14 处理本步允许存在的 S2 / S3 残余风险,不得把 S0 / S1 写入残余风险。
- Step 15 汇总正式 `05-测试方案.md` 时,必须保留 checklist 形式,不得改写成不可判定的自然语言。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入准则可判定 | 通过 | 文档、环境、数据、自动化和路径均为 checklist 条件 |
| 退出准则可判定 | 通过 | P0 suite、redline、report、缺陷和风险接受均可检查 |
| 缺陷阻断关系清晰 | 通过 | S0 / S1 阻断,S2 / S3 有条件接受 |
| 证据归档前置清楚 | 通过 | Step 13 可承接 artifacts / reports / acceptance extract |
| 可以进入 Step 13 | 通过 | 下一步定义测试报告与证据归档 |
