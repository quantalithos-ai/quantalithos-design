# Step 9. 设计自动化与 CI/CD 门禁

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 9 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 9
> 回填章节: `05-测试方案.md` §9 自动化与 CI/CD 门禁
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。自动化门禁承接 `03` §15 的三个脚本契约和 Step 6 用例矩阵,不安排实施 phase 或 CI 平台产品。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 6 用例矩阵 | 定义自动化套件 | P0 用例默认自动化 |
| Step 8 环境矩阵 | 定义执行环境 | PR / CI 使用 ci-test;release candidate 可用 integration-like |
| `03` §15 脚本契约 | 定义 gate / report / redaction script | 参数和路径固定 |
| `04` §12 | 定义配置和 redaction gate | config lint、dependency scan、report config digest 进入门禁 |

---

## 3. SOP 问题回答

1. 哪些测试进入 PR 门禁?

   回答:contract unit、domain unit、service smoke、config lint、forbidden dependency scan 和 redaction fixture smoke 进入 PR 门禁。

2. 哪些测试进入 CI 主线?

   回答:全部 P0 contract / domain / service / integration / API / worker / job / script tests 进入 CI 主线,失败阻断合并。

3. 哪些测试进入 nightly / operations replay?

   回答:commit unknown、rollback failure、projection rebuild race、job partial failure、handoff duplicate、operations-replay、report config digest 和 redaction full scan 进入 nightly / replay。

4. 哪些测试进入 staging / release gate?

   回答:minimum process closure、integration-like configured adapter smoke、reports / evidence index / redaction-check 和 acceptance handoff draft 进入 release gate。

5. 失败是否阻断?

   回答:P0 gate 失败阻断。P1 real-like adapter smoke 可按 `07` / release plan 决定阻断或风险接受,但不得伪造为 P0 通过。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 自动化套件粗略,无 artifact / report 固定路径 | 使用 `03` §15 脚本契约 |
| `03` §15 | 只定义脚本输入输出,未定义套件分层 | 本 Step 分 PR / CI / nightly / release gate |
| `04` §12 | 配置门禁已列出,未绑定 suite | 本 Step 合入 config / dependency / redaction suite |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 门禁路径 | 未固定 | `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` |
| 套件 | domain / integration / event chain | contract、domain、service、integration、entry、script、E2E |
| 失败处理 | 阻断 / 告警泛化 | P0 阻断,P1 可风险接受但不能伪成功 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否引用具体 CI 产品 | 不引用。只定义 suite、触发、脚本和证据路径 |
| 是否允许失败无报告 | 不允许。失败 suite 也必须保留 failure report |
| 是否使用 `latest` | 正式证据禁止使用 `latest`;必须固定 run_id |

---

## 7. 结构化中间产物

### 7.1 自动化门禁图

#### 自动化门禁图: L1-process 测试流水线

```text
PR
  -> contract + domain + service smoke + config lint
      |
      v
CI main
  -> integration + API / worker / job + script contracts
      |
      v
Nightly / operations replay
  -> recovery + concurrency + partial failure + report digest
      |
      v
Release gate
  -> minimum process closure + integration-like smoke + evidence handoff
```

关键说明:

- P0 套件失败必须阻断对应 gate。
- Nightly / replay 用于覆盖慢速恢复和并发故障,失败至少阻断 release candidate。
- Release gate 验证证据交接,不替代低层详细断言。

### 7.2 自动化套件表

| 套件 | 覆盖范围 | 执行位置 | 触发条件 | 阻断级别 | 执行脚本 | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `contract` | DTO、metadata、digest、enum、required field | PR / CI | contracts 变更或全量 CI | 阻断 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/contract/` | `reports/runs/<run_id>/suites/contract.md` |
| `domain` | object invariant、policy、16 状态机 | PR / CI | domain 变更或全量 CI | 阻断 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/domain/` | `reports/runs/<run_id>/suites/domain.md` |
| `service` | command / query / consumer / job orchestration | PR / CI | application 变更或全量 CI | 阻断 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/service/` | `reports/runs/<run_id>/suites/service.md` |
| `integration` | repository、UoW、idempotency、projection、adapter fake、runtime builder | CI | infra / config / store 变更 | 阻断 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/integration/` | `reports/runs/<run_id>/suites/integration.md` |
| `entry-contract` | API handler、worker consumer、outbox publisher、job runner | CI | api / worker / jobs 变更 | 阻断 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/entry-contract/` | `reports/runs/<run_id>/suites/entry-contract.md` |
| `config-security` | config lint、secret ref、topic map、no fake fallback、non-core dependency scan | PR / CI | config / dependency 变更或全量 CI | 阻断 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/config-security/` | `reports/runs/<run_id>/suites/config-security.md` |
| `recovery-replay` | commit unknown、rollback failure、partial failure、operations-replay | nightly / release candidate | scheduled 或 recovery / jobs 变更 | 阻断 release | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/recovery-replay/` | `reports/runs/<run_id>/suites/recovery-replay.md` |
| `evidence-scripts` | gate / report / redaction checker contracts | CI / release candidate | script / report 变更或 release | 阻断 | `scripts/reports/generate_reports.sh` + `scripts/checks/check_redaction.sh` | `artifacts/test/<run_id>/suites/evidence-scripts/` | `reports/runs/<run_id>/suites/evidence-scripts.md` |
| `minimum-e2e` | 最小 process closure 和 evidence handoff | release gate | release candidate | 阻断发布 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/minimum-e2e/` | `reports/runs/<run_id>/suites/minimum-e2e.md` |
| `p1-real-like-smoke` | integration-like configured adapter dry-run | release candidate / manual | P1 环境可用时 | 待风险接受 | `scripts/gates/run_ci_gate.sh` | `artifacts/test/<run_id>/suites/p1-real-like-smoke/` | `reports/runs/<run_id>/suites/p1-real-like-smoke.md` |

### 7.3 脚本约束

| 脚本 | 必填参数 | 成功输出 | 失败输出 |
|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | `--run-id`、`--artifact-root`、`--config-profile` | `artifacts/test/<run_id>` | 非 0 exit code,保留 failure report |
| `scripts/reports/generate_reports.sh` | `--run-id`、`--artifact-root`、`--report-root` | `reports/runs/<run_id>` | 非 0 exit code,说明缺失 artifact 或生成失败 |
| `scripts/checks/check_redaction.sh` | `--artifact-root`、`--report-root` | `reports/runs/<run_id>/redaction-check.md` | 发现 raw secret / raw body / forbidden package body 时失败 |

---

## 8. 回填草稿

`05-测试方案.md` §9 应输出自动化门禁图、套件表和脚本约束。所有正式证据必须绑定固定 `<run_id>`,不得使用 `latest`。P0 gate 失败必须阻断;P1 real-like smoke 可单独标风险。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP09-OPEN-001 | 具体 CI 产品和 job 名称 | 留给实现仓和 `07` |
| TP09-OPEN-002 | p1-real-like-smoke 是否阻断 release | 当前列为待风险接受 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 自动化套件、触发和阻断级别明确 | 通过 |
| artifact / report 输出路径明确 | 通过 |
| P0 失败处理明确 | 通过 |

