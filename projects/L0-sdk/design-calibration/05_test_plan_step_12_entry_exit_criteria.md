# L0-sdk 05 测试方案 Step 12:定义进入准则与退出准则

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §12 进入准则与退出准则
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义进入准则与退出准则 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_12_entry_exit_criteria.md` |

本步定义 P0 测试何时可以开始、何时可以结束。报告结构和证据归档位置留给 Step 13,回归策略和残余风险留给 Step 14。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_07_test_data.md` | 继承 `DS-SDK-*`、`run_id`、数据隔离和清理规则 |
| `05_test_plan_step_08_environment_config.md` | 继承 P0 profile、依赖类型、环境不可用处理和配置矩阵 |
| `05_test_plan_step_09_automation_ci_gates.md` | 继承 PR / main / nightly / candidate gate、脚本目录、参数和输出路径 |
| `05_test_plan_step_10_special_nonfunctional.md` | 继承 P0 非功能、专项红线和证据要求 |
| `05_test_plan_step_11_defects_retest.md` | 继承 S0~S3 缺陷分级、复验范围和关闭证据 |
| `00-需求文档.md` ~ `04-配置设计.md` | 作为开始测试前必须冻结的上游设计输入 |

## 3. SOP 问题回答

### 3.1 开始测试前哪些文档必须冻结?

| 文档 | 冻结要求 |
|---|---|
| `00-需求文档.md` | F-001~F-010、BR-001~BR-014、P0 / P1 / P2 和一票否决项不再变更 |
| `01-架构设计.md` | official client access layer、依赖方向和跨仓协作口径不再变更 |
| `02-概要设计.md` | 主要组成部分、关键对象、接口骨架、流程和状态主语不再变更 |
| `03-详细设计.md` | DTO、trait / port / adapter、函数流、状态 enum、事务、错误、幂等和观测契约不再变更 |
| `04-配置设计.md` | profile、配置项、加载优先级、敏感边界和 fail-fast 规则不再变更 |
| `05` Step 1~11 中间产物 | 测试范围、用例、数据、环境、自动化、专项和缺陷规则已确认 |

如果上述文档发生影响 P0 测试断言的变更,必须回到对应 Step 重新校准,不能直接开始测试。

### 3.2 哪些环境和数据必须可用?

| 类型 | 可用条件 |
|---|---|
| `local-dev` | 可加载 local JSON / defaults / env override,可运行最小 smoke |
| `ci-test` | 可运行 PR gate,可创建 isolated temp dirs,可执行 fake adapters 和 redaction scanner |
| `integration-test` | local contracts、fixture-backed boundary、event replay、filesystem store 可用 |
| `candidate-validation` | generator、builder、docs runner、smoke runner、compatibility runner 和 artifact / report store 可用 |
| `DS-SDK-*` 数据集 | Step 7 定义的数据集可由 fixture / builder / seed 重复生成 |
| `run_id` | 每次执行都能生成或传入唯一 `run_id` |
| 输出根目录 | `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 可写 |

### 3.3 哪些自动化必须可运行?

| 自动化 | 可运行条件 |
|---|---|
| `scripts/gates/run_pr_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile ci-test` |
| `scripts/gates/run_main_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile integration-test` |
| `scripts/gates/run_candidate_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile candidate-validation` |
| `scripts/checks/check_redaction.sh` | 可扫描 artifacts 和 reports,发现 forbidden body / secret 时失败 |
| `scripts/checks/check_artifact_paths.sh` | 可拒绝 `artifacts/test/<project>/<run_id>`、`artifacts/sdk/<run_id>` 和 `latest` |
| `scripts/checks/check_report_completeness.sh` | 可检查必须 case result、evidence ref 和 failure reason |
| `scripts/reports/generate_reports.sh` | 可从 `artifacts/test/<run_id>` 生成 `reports/runs/<run_id>` |

nightly 和 staging smoke 不作为开始 P0 测试的前置,但如果本轮要推进 candidate promotion,nightly 相关 suite 必须可运行或有明确风险接受记录。

### 3.4 退出时哪些用例必须通过?

| 用例 / 套件 | 退出要求 |
|---|---|
| `TC-SDK-CONTRACT-*` | 全部 P0 通过 |
| `TC-SDK-SEMANTIC-*` | 全部 P0 通过 |
| `TC-SDK-BOUNDARY-*` | 全部 P0 通过 |
| `TC-SDK-EVENT-*` | 全部 P0 通过 |
| `TC-SDK-TRACE-*` | 全部 P0 通过 |
| `TC-SDK-SECURITY-*` | 全部 P0 通过 |
| `TC-SDK-CANDIDATE-*` | 全部 P0 通过 |
| `TC-SDK-DOCS-*` | 全部 P0 通过 |
| `TC-SDK-SMOKE-*` | 全部 P0 通过 |
| `TC-SDK-COMPAT-*` | 全部 P0 通过 |
| `SPECIAL-SDK-*` | 全部 P0 专项通过或按 Step 11 形成合规风险接受 |
| PR / main / candidate gate | 与本轮目标相关的阻断 gate 全部通过 |

### 3.5 哪些缺陷和风险会阻断退出?

| 缺陷 / 风险 | 是否阻断退出 |
|---|---|
| 任意 S0 缺陷未关闭 | 阻断 |
| 任意 S1 缺陷未关闭 | 阻断 |
| P0 gate 业务断言失败 | 阻断 |
| redaction / forbidden field scan 失败 | 阻断 |
| artifact / report root 使用错误层级或 `latest` | 阻断 |
| 缺少 `run_id`、case result、evidence ref 或 failure reason | 阻断 |
| S2 / S3 未记录 owner、原因和后续入口 | 阻断 |
| P1 / P2 风险已记录且不影响 P0 | 不阻断 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 准入 / 退出条件不可判定,容易写成“环境准备好”“测试基本通过” |
| Step 7~9 | 已定义数据、环境和自动化,本步需要把它们转成测试开始条件 |
| Step 10~11 | 已定义专项红线和缺陷分级,本步需要把它们转成退出条件 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 进入准则 | 泛化环境可用 | 文档冻结、profile 可用、数据可生成、脚本可运行、输出路径可写 |
| 退出准则 | 泛化测试通过 | P0 用例、专项、gate、缺陷和证据均有可判定条件 |
| 风险处理 | 容易口头接受 | S2 / S3 和 P1 / P2 风险必须记录 owner、原因和后续入口 |
| 证据要求 | 可后补 | 缺少 `run_id`、case result、evidence ref 或 failure reason 会阻断退出 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否要求 Step 15 正式 `05` 完成后才能执行正式 P0 测试 | 是 | 中间产物不是正式测试方案 |
| 是否把 nightly gate 作为所有 P0 测试开始前置 | 不作为开始前置 | nightly 用于 candidate promotion 和组合回归,不应阻塞 PR / main P0 执行 |
| 是否允许 S0 / S1 未关闭但退出 | 不允许 | S0 / S1 直接破坏 P0 可信度 |
| 是否允许缺失 report 但用命令输出证明 | 不允许 | 后续验收需要稳定 report 和 evidence ref |

## 7. 结构化中间产物

### 7.1 进入准则

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 的 P0 契约已冻结。
- [ ] `05` Step 1~11 中间产物已确认,且不存在影响 P0 测试断言的未处理冲突。
- [ ] `local-dev`、`ci-test`、`integration-test`、`candidate-validation` profile 的 P0 配置可加载并通过配置校验。
- [ ] `DS-SDK-*` 数据集可由 fixture / builder / seed 重复生成。
- [ ] 每次测试执行都能提供唯一 `run_id`。
- [ ] `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 可写,且未使用项目名重复层级。
- [ ] `scripts/gates/run_pr_gate.sh`、`scripts/gates/run_main_gate.sh`、`scripts/gates/run_candidate_gate.sh` 可执行并支持必需参数。
- [ ] `scripts/checks/check_redaction.sh`、`scripts/checks/check_artifact_paths.sh`、`scripts/checks/check_report_completeness.sh` 可执行。
- [ ] `scripts/reports/generate_reports.sh` 可从 artifact 生成 run report。
- [ ] L0-core / L0-bus compile contracts 可通过 path dependency 或正式 contract package 定位,不得复制类型。

### 7.2 退出准则

- [ ] `TC-SDK-CONTRACT-*`、`TC-SDK-SEMANTIC-*`、`TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*` 全部 P0 用例通过。
- [ ] `TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*`、`TC-SDK-CANDIDATE-*`、`TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*`、`TC-SDK-COMPAT-*` 全部 P0 用例通过。
- [ ] `SPECIAL-SDK-*` P0 专项通过,或非 P0 专项风险按 Step 11 合规接受。
- [ ] PR / main / candidate 阻断 gate 与本轮目标相关部分全部通过。
- [ ] redaction / forbidden field scan 通过,raw secret、credential value、request / response / payload body 泄露次数为 0。
- [ ] `artifacts/test/<run_id>` 中保留 case result、stdout / stderr、failure reason、evidence ref 和必要原始机器证据。
- [ ] `reports/runs/<run_id>` 已生成,且没有引用 `latest`。
- [ ] 不存在未关闭 S0 / S1 缺陷。
- [ ] 所有 S2 / S3 或 P1 / P2 风险均记录 owner、原因、到期条件和后续入口。
- [ ] 缺陷修复后的复验 evidence 已关联到对应 defect id、case id 和 `run_id`。

### 7.3 准入 / 退出门禁图

```text
[upstream docs frozen]
        |
        v
[profiles + data + scripts ready]
        |
        v
[run P0 gates with run_id]
        |
        v
[artifacts/test/<run_id>]
        |
        v
[reports/runs/<run_id>]
        |
        v
[no S0/S1 + accepted S2/S3]
        |
        v
[test exit allowed]
```

说明:

- `run_id` 是所有测试、缺陷复验和验收证据的关联键。
- 没有 report 或 evidence ref 时,即使用例口头通过也不能退出。
- S0 / S1 不允许通过风险接受绕过退出准则。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §12 时摘录。

```markdown
## 12. 进入准则与退出准则

> 校准来源：
> - `design-calibration/05_test_plan_step_12_entry_exit_criteria.md`

进入 P0 测试前,`00~04` 的 P0 契约必须冻结,`05` Step 1~11 中间产物必须确认,`local-dev`、`ci-test`、`integration-test`、`candidate-validation` profile 必须可加载并通过配置校验,`DS-SDK-*` 数据集必须可重复生成,所有 gate / check / report 脚本必须支持 `--run-id`、`--artifact-root` 和 `--config-profile` 等必需参数。

退出 P0 测试时,全部 `TC-SDK-*` P0 用例、`SPECIAL-SDK-*` P0 专项和本轮阻断 gate 必须通过;redaction / forbidden field scan 必须证明敏感泄露次数为 0;`artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 必须存在可追溯证据;不得存在未关闭 S0 / S1 缺陷。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否把正式 `05-测试方案.md` 完成作为正式测试前置 | 是 | 中间产物不能替代正式测试方案 |
| 是否把 nightly 作为所有测试退出前置 | 不作为所有 P0 退出前置;作为 candidate promotion 前置 | 保持 PR / main / candidate 分层 |
| 是否允许 S2 / S3 未记录风险就退出 | 不允许 | 非阻断不等于无需追踪 |
| 是否允许没有 report 只靠命令输出退出 | 不允许 | 验收标准需要稳定证据入口 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 开始测试前必须冻结的文档已定义 | 已满足 |
| 必须可用的环境和数据已定义 | 已满足 |
| 必须可运行的自动化已定义 | 已满足 |
| 退出时必须通过的用例已定义 | 已满足 |
| 阻断退出的缺陷和风险已定义 | 已满足 |
| 进入 / 退出准则无模糊项 | 已满足 |

Step 13 可以在本文件被确认后开始,主题是定义测试报告与证据归档。
