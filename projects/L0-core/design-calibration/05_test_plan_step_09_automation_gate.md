# Step 9. 设计自动化与 CI/CD 门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-core/05-测试方案.md` §9

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 4 测试分层 | Unit、Service、Integration、Contract / Worker、E2E / Release gate | 定义自动化套件层级 |
| Step 6 用例矩阵 | P0 / P1 用例和自动化候选 | 映射套件覆盖范围 |
| Step 8 环境矩阵 | local-dev、ci-test、integration、release-like | 定义执行位置和阻断级别 |

依赖的前序 Step：Step 1~8 已确认。

## 3. SOP 问题回答

1. 哪些 suite 必须进 PR?

   回答：PR 必须运行 format / lint、unit、service、DTO / schema contract、config smoke 和轻量 integration smoke。它们覆盖 P0 domain invariant、application service、DTO roundtrip、配置优先级基础验证和关键失败路径。

2. 哪些 suite 进 main CI?

   回答：main CI 在 PR 套件基础上增加完整 integration、contract / worker、outbox relay boundary、job rerun idempotency、audit evidence 和最小 E2E 闭环。

3. 哪些 suite 进 nightly?

   回答：nightly 运行更重的并发、故障注入、projection rebuild、outbox replay、较大 fixture dataset 和 P1 非功能 baseline,用于发现慢问题和恢复路径退化。

4. 哪些 suite 是 staging smoke 或 release gate?

   回答：L0-core P0 不定义真实 staging smoke。release gate 使用 release-like 环境执行最小闭环、配置失效模式、snapshot / fact / outbox evidence 和报告归档。

5. flaky、超时和依赖故障如何处理?

   回答：P0 suite 不允许以 flaky 名义放行。infra failure 可重跑一次并保留原因；重复失败视为阻断。超时要归类为性能 / 环境 / 死锁风险,不得静默延长。release gate 失败不得发布。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `05-测试方案.md` §8 | CI 门禁仍围绕 shared primitive admission | 无法覆盖当前 contract definition / job / outbox / config 主链 |
| `05-测试方案.md` §8 | 未区分 PR、main、nightly、release gate | 执行成本和阻断级别不清楚 |
| `05-测试方案.md` §8 | flaky / infra failure 规则不足 | 失败可能被错误放行 |
| `05-测试方案.md` §8 | P0 主线依赖手工风险未排除 | 不满足自动化证据要求 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 套件划分 | admission / registry / consume smoke | format、unit、service、contract、integration、worker、E2E、nightly | 对齐新版测试对象和分层 |
| 执行位置 | 粗略 CI | PR、main CI、nightly、release gate | 支撑不同成本和风险层级 |
| 阻断级别 | 不清晰 | P0 PR / main / release gate 阻断,nightly 生成风险 | 支撑质量门禁 |
| 失败处理 | 未明确 | infra failure、flaky、timeout 分别处理 | 避免误放行 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 所有测试都进 PR | 风险发现早 | PR 太慢,反馈差 | 不采用 |
| B. P0 全部手工执行 | 初期省自动化 | 不可重复,无法形成稳定证据 | 不采用 |
| C. PR 快速阻断 + main 完整 P0 + nightly 重专项 + release gate 闭环 | 平衡速度、覆盖和证据 | 需要维护套件分层 | 采用 |
| D. flaky 可标记通过 | 减少阻断 | 掩盖真实回归 | 不采用 |

## 7. 结构化中间产物

### 7.1 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 报告 |
|---|---|---|---|---|---|
| `fmt_lint_suite` | 格式、静态检查、文档链接基本检查 | PR / main | 每次提交 | 阻断 | `EV-CI-FMT-001` |
| `unit_domain_suite` | value object、aggregate、policy、state transition | PR / main | 每次提交 | 阻断 | `EV-UNIT-001` |
| `service_command_query_suite` | application service、command/query、幂等、错误映射 | PR / main | 每次提交 | 阻断 | `EV-SVC-001` |
| `dto_schema_contract_suite` | Command / Query / Event / Job DTO roundtrip 与 schema 兼容 | PR / main | 每次提交 | 阻断 | `EV-CONTRACT-001` |
| `config_smoke_suite` | defaults + file + env + CLI 优先级、基础 fail fast | PR / main | 每次提交 | 阻断 | `EV-CONFIG-001` |
| `integration_persistence_suite` | repository、audit、outbox、transaction、projection | main CI | 合入 main | 阻断 | `EV-INT-001` |
| `worker_job_suite` | validate、derive snapshot、rebuild、fingerprint、publish fact job | main CI | 合入 main | 阻断 | `EV-WORKER-001` |
| `outbox_relay_boundary_suite` | CloudEvent 结构、publisher fail、pending / failed | main CI | 合入 main | 阻断 | `EV-CONTRACT-002` |
| `e2e_minimal_loop_suite` | draft -> review -> publish -> snapshot -> query -> fact -> relay | release gate | 发布候选 | 阻断 | `EV-E2E-001` |
| `nightly_fault_recovery_suite` | 并发、故障注入、projection rebuild、outbox replay、大 fixture dataset | nightly | 定时 | 非发布阻断;生成风险 | `EV-NIGHTLY-001` |
| `nfr_baseline_suite` | 查询、job、relay 边界性能 baseline | nightly / release gate | 定时或发布候选 | release gate 阻断 P0 阈值 | `EV-NFR-001` |

### 7.2 CI/CD 门禁图

#### 流水线图: L0-core 自动化门禁

```text
Pull Request
  |
  +--> fmt_lint_suite
  +--> unit_domain_suite
  +--> service_command_query_suite
  +--> dto_schema_contract_suite
  +--> config_smoke_suite
  |
  v
Merge to main
  |
  +--> integration_persistence_suite
  +--> worker_job_suite
  +--> outbox_relay_boundary_suite
  |
  v
Nightly
  |
  +--> nightly_fault_recovery_suite
  +--> nfr_baseline_suite
  |
  v
Release gate
  |
  +--> e2e_minimal_loop_suite
  +--> config failure gate
  +--> evidence archive check
```

关键说明:

- PR 阶段只放入快速且 P0 阻断的套件。
- main CI 覆盖更完整的 integration、worker 和 relay boundary。
- release gate 只验证发布候选必须通过的最小闭环与证据归档。

### 7.3 失败处理规则

| 失败类型 | 处理 | 是否允许放行 |
|---|---|---|
| P0 用例失败 | 修复后重跑相关 suite 和回归 suite | 否 |
| infra failure | 标记原因并重跑一次;重复失败转阻断 | 否 |
| flaky | 建 issue,隔离根因;P0 flaky 不允许忽略 | 否 |
| timeout | 分析为性能、死锁或环境问题;不得直接增大阈值 | 否 |
| nightly P1 failure | 记录风险,进入回归或专项修复 | 不阻断当日非发布合并 |
| release gate failure | 发布候选失败 | 否 |

## 8. 回填草稿

```md
## 9. 自动化与 CI/CD 门禁

> 校准来源：
> - `design-calibration/05_test_plan_step_09_automation_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“自动化套件表”“CI/CD 门禁图”和“失败处理规则”小节,了解各测试套件的执行位置、触发条件和阻断级别。

P0 主线不得只依赖手工测试。L0-core 自动化门禁分为 PR、main CI、nightly 和 release gate 四层。

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 报告 |
|---|---|---|---|---|---|
| `unit_domain_suite` | value object、aggregate、policy、state transition | PR / main | 每次提交 | 阻断 | `EV-UNIT-001` |
| `service_command_query_suite` | application service、command/query、幂等、错误映射 | PR / main | 每次提交 | 阻断 | `EV-SVC-001` |
| `dto_schema_contract_suite` | DTO roundtrip 与 schema 兼容 | PR / main | 每次提交 | 阻断 | `EV-CONTRACT-001` |
| `integration_persistence_suite` | repository、audit、outbox、transaction、projection | main CI | 合入 main | 阻断 | `EV-INT-001` |
| `e2e_minimal_loop_suite` | draft -> review -> publish -> snapshot -> query -> fact -> relay | release gate | 发布候选 | 阻断 | `EV-E2E-001` |

P0 suite 失败不得放行；infra failure 必须重跑并保留原因；release gate 失败不得发布。
```

## 9. 待确认事项

- 是否接受 nightly P1 failure 不阻断普通 main 合并,但阻断进入 release candidate。
- 是否接受 PR 阶段不运行完整 E2E,而由 main CI / release gate 承接。

## 10. 进入下一步条件

- [x] P0 自动化门禁清晰。
- [x] PR、main、nightly、release gate 的执行位置和阻断级别已定义。
- [x] flaky、timeout、infra failure 有处理规则。
- [x] 可以进入 Step 10 设计专项测试与非功能验证。
