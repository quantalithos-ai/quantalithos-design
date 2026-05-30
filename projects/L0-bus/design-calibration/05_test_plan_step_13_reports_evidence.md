# L0-bus 05 测试方案 Step 13: 测试报告与证据归档

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 13 中间产物。
> 本步定义 L0-bus 测试执行后如何保存机器原始证据、如何生成可读报告、如何交给验收标准裁决,以及哪些内容必须由人或 Agent 审查补充。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 定义测试报告与证据归档 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §13 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_05_traceability_matrix.md` | 已确认 | 提取需求、测试场景、用例和证据编号追溯关系 |
| `05_test_plan_step_06_cases.md` | 已确认 | 提取 `TC-BUS-*` 用例矩阵和 `EV-BUS` / `RP-BUS` 证据编号族 |
| `05_test_plan_step_09_automation_ci_gates.md` | 已确认 | 提取 gate / check / report 脚本、artifact / report 输出路径 |
| `05_test_plan_step_10_special_nonfunctional.md` | 已确认 | 提取 redaction、consistency、audit、report integrity 专项证据 |
| `05_test_plan_step_11_defects_retest.md` | 已确认 | 提取缺陷关闭证据和复验证据要求 |
| `05_test_plan_step_12_entry_exit_criteria.md` | 已确认 | 提取退出准则和验收交接所需报告 |
| `standards/document/子项目目录与代码文件组织规范.md` §9~§10 | 已完成 | 承接 `artifacts/test/<run_id>`、`reports/` 和 `scripts/` 目录规则 |

---

## 3. SOP 问题回答

### 3.1 每类测试输出什么证据?

| 测试类别 | 原始机器证据 | 可读报告 | 验收用途 |
|---|---|---|---|
| unit / domain | suite `report.json`、stdout/stderr、failed assertion | `suites/unit.md` | 状态机、value object、policy 基础正确性 |
| service / application | service case report、UoW call order、idempotency result | `suites/service.md` | command / query / job 业务处理流正确性 |
| contract / API | request / response schema result、error DTO snapshot | `suites/contract.md` | 外部契约和错误映射稳定性 |
| integration | fake runtime graph、repository / adapter / worker / job result | `suites/integration.md` | 跨模块协作和 fake / in-memory P0 闭环 |
| recovery | retry、DLQ、replay preparation、audit chain evidence | `suites/recovery.md` | 失败恢复链可审计 |
| config | config validation output、runtime graph summary | `config-summary.md` | profile、secret ref、fail-fast / fail-closed |
| redaction | scan input index、scan result、forbidden sample hit result | `redaction-check.md` | forbidden body / raw secret 一票否决 |
| report integrity | artifact index、link check、acceptance index generation result | `artifact-index.md`、`gate-results.md` | 验收证据完整性 |
| nightly / P1 smoke | stress / failure injection / adapter smoke summary | `suites/nightly.md` 或 risk record | 残余风险和后续 P1 专项 |

### 3.2 证据保存在哪里?

证据分两层保存:

| 层级 | 固定路径 | 内容 | 说明 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | 机器生成的原始报告、stdout/stderr、JSON index、fixture summary | 默认由 gate / CI / 测试框架生成 |
| run reports | `reports/runs/<run_id>` | 从 raw artifacts 生成的人类可读报告 | 由 `scripts/reports/*` 生成初稿 |
| acceptance reports | `reports/acceptance` | 送验交接、veto、风险接受、open issues、run index | 可由脚本生成初稿,必须人 / Agent 审查 |
| review notes | `reports/review` | reviewer notes、agent review、补充判断 | 不替代 raw artifacts |

禁止路径:

```text
artifacts/test/<project>/<run_id>
artifacts/test/latest
reports/<project>
reports/runs/latest
```

### 3.3 证据如何关联用例和验收项?

关联链必须固定为:

```text
Requirement / AC
  -> TS-BUS scenario
  -> TC-BUS case
  -> EV-BUS / RP-BUS evidence id
  -> artifacts/test/<run_id>/...
  -> reports/runs/<run_id>/...
  -> reports/acceptance/...
```

`artifacts/test/<run_id>/evidence-index.json` 保存机器可读索引,`reports/runs/<run_id>/evidence-index.md` 保存人类可读索引。验收标准只能引用固定 `run_id` 的报告,不得引用 `latest`。

### 3.4 哪些日志、trace、DB snapshot 或报告必须保留?

当前 P0 默认路径不要求真实 DB snapshot,但要求保留 fake / in-memory runtime 的结构化摘要。

| 证据 | 是否必须保留 | 保留方式 |
|---|---|---|
| gate context | 是 | `artifacts/test/<run_id>/meta/context.json` |
| suite result | 是 | `artifacts/test/<run_id>/suites/<suite>/report.json` |
| stdout/stderr | 是 | `artifacts/test/<run_id>/suites/<suite>/stdout.log`、`stderr.log` |
| failure reason | 失败时必须 | `report.json` 字段 + suite markdown 摘要 |
| trace ref / request id | 是 | context、report、evidence index 中保存 ref |
| fixture summary | 是 | `artifacts/test/<run_id>/fixtures/*.json` |
| fake store snapshot | 失败 / recovery 必须 | `artifacts/test/<run_id>/snapshots/*.json` |
| delivery history / audit chain | recovery / delivery 必须 | evidence artifact + report 摘要 |
| config summary | 是 | `reports/runs/<run_id>/config-summary.md` |
| redaction scan report | release 必须 | `reports/runs/<run_id>/redaction-check.md` |
| acceptance handoff | release / acceptance 必须 | `reports/acceptance/handoff.md` 和 `<run_id>-index.md` |

### 3.5 证据保留多久?

| 证据类别 | 保留策略 |
|---|---|
| local smoke raw artifacts | 本地可清理,不得作为正式验收引用 |
| PR / main CI raw artifacts | 至少保留到对应 PR / main CI 结论关闭;失败运行保留到缺陷复验完成 |
| release gate raw artifacts | 至少保留到 release / acceptance 完成并归档 |
| `reports/runs/<run_id>` | 与对应 release / acceptance 记录一起保留,不得被后续 run 覆盖 |
| `reports/acceptance` | 作为送验交接材料保留;如有风险接受,必须与风险关闭记录一起保留 |
| S0 / S1 failure evidence | 保留到缺陷关闭、自动化防回归落地并至少一次复验通过 |
| P1-risk evidence | 保留到后续 P1 专项评审或明确移出范围 |

### 3.6 原始机器证据是否统一进入 `artifacts/test/<run_id>`?

是。所有 gate、suite、check 的原始机器证据必须进入 `artifacts/test/<run_id>`。即使测试失败,也必须尽量生成:

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
```

### 3.7 人类可读报告是否统一进入 `reports/runs/<run_id>`?

是。`scripts/reports/generate_reports.sh` 从固定 `artifacts/test/<run_id>` 生成 `reports/runs/<run_id>`。报告可以摘录必要摘要,但不得复制完整 raw log。

### 3.8 验收交接报告是否统一进入 `reports/acceptance`?

是。L0-bus 当前保留两类验收交接文件:

| 文件 | 用途 |
|---|---|
| `reports/acceptance/<run_id>-index.md` | run-specific 验收证据索引,由 Step 9 / Step 12 已确认 |
| `reports/acceptance/handoff.md` | 当前送验摘要,引用固定 `run_id` |
| `reports/acceptance/veto-checklist.md` | 一票否决项裁决 |
| `reports/acceptance/risk-acceptance.md` | S2 / P1-risk 有条件接受说明 |
| `reports/acceptance/open-issues.md` | 非阻断问题和后续追踪 |

`<run_id>-index.md` 不是 `latest` 指针,而是固定 run 的索引文件。

### 3.9 哪些报告由 `scripts/reports/*` 自动生成?

| 脚本 | 输入 | 输出 | 说明 |
|---|---|---|---|
| `scripts/reports/generate_reports.sh` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 生成 summary、suite reports、evidence index、artifact index |
| `scripts/reports/generate_acceptance_index.sh` | `reports/runs/<run_id>` | `reports/acceptance/<run_id>-index.md` | 生成验收索引 |
| `scripts/reports/generate_acceptance_handoff.sh` | `reports/runs/<run_id>` | `reports/acceptance/handoff.md` | 可选,生成送验摘要初稿 |
| `scripts/reports/generate_veto_checklist.sh` | `reports/runs/<run_id>` | `reports/acceptance/veto-checklist.md` | 可选,生成 veto 初稿 |

### 3.10 哪些报告必须由人或 Agent 审查补充?

| 报告 | 审查要求 |
|---|---|
| `reports/acceptance/handoff.md` | 确认交付范围、run_id、P0/P1 边界和送验说明 |
| `reports/acceptance/veto-checklist.md` | 确认所有 S0 / 一票否决项有明确结论 |
| `reports/acceptance/risk-acceptance.md` | 由人或 Agent 补充 owner、期限、影响和复验计划 |
| `reports/acceptance/open-issues.md` | 确认非阻断问题不影响当前 P0 |
| `reports/review/reviewer-notes.md` | 记录人工审查发现 |
| `reports/review/agent-review.md` | 记录 Agent 对报告、链接和风险的一致性检查 |

脚本生成的初稿不能替代人 / Agent 审查结论。

### 3.11 失败 suite 是否仍产出 `report.json`、stdout/stderr log 和 failure reason?

是。失败 suite 至少应输出:

| 文件 / 字段 | 要求 |
|---|---|
| `report.json` | `result=failed`、`failure_reason`、`failed_case_id`、`exit_code`、`started_at`、`finished_at` |
| `stdout.log` | 保存测试标准输出,需通过 redaction scan |
| `stderr.log` | 保存错误输出,需通过 redaction scan |
| `evidence-index.json` | 标记该 suite 的 EV / TC 状态和失败 artifact 路径 |
| suite markdown report | 摘要失败原因、影响范围和建议复验集 |

### 3.12 redaction / boundary scan 如何证明 artifact 和 report 不含 raw secret 或完整业务正文?

| 检查 | 证明方式 |
|---|---|
| raw artifact scan | `check_redaction.sh --artifact-root artifacts/test/<run_id>` 扫描 stdout、stderr、JSON、snapshot、fixture summary |
| report scan | `check_redaction.sh --report-root reports/runs/<run_id>` 扫描 markdown 和索引 |
| acceptance scan | 扫描 `reports/acceptance` 中 handoff、veto、risk、open issues |
| forbidden sample hit | redaction negative fixture 必须证明检查器能命中 forbidden body |
| clean sample pass | clean artifact 必须证明检查器不会误伤合法 ref / digest / metadata |
| 结果留证 | `reports/runs/<run_id>/redaction-check.md` 必须记录扫描范围、命中数、豁免数和结论 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 没有区分 raw artifact 和 readable report | 可能把日志、报告、验收摘要混在一起 | 验收证据不可维护 | 本步分为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 报告脚本位置不清 | 可能把生成脚本放入 `reports/` | 工具和输出混杂 | 本步固定 `scripts/reports/*` |
| 失败证据未定义 | 失败 suite 可能只返回非零退出码 | 无法复现和复验 | 本步要求失败也产出 report、log 和 failure reason |
| 证据与用例追溯不清 | EV / TC / AC 没有固定索引 | `06` 难以裁决 | 本步定义 evidence index 和 acceptance index |
| redaction 证明不足 | 只说不泄漏,没有证明方式 | 安全红线无法验收 | 本步定义 raw + report + acceptance 全链扫描 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 证据层级 | 模糊 | raw artifacts / run reports / acceptance reports / review notes | 边界清晰 |
| 目录结构 | 未稳定 | 固定 `artifacts/test/<run_id>` 和 `reports/` | 可复用 |
| 生成方式 | 不明确 | `scripts/reports/*` 生成初稿,人 / Agent 审查补充 | 可执行 |
| 失败证据 | 未定义 | 失败也产出 report、log、failure reason | 可复验 |
| 验收交接 | 隐含 | acceptance index、handoff、veto、risk、open issues | 可裁决 |
| 安全证明 | 只靠约定 | redaction / boundary scan 全链留证 | 可阻断 |

---

## 6. 测试设计取舍

### 6.1 是否把所有 raw artifacts 直接交给验收方阅读

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接阅读 raw artifacts | 信息完整 | 难读,容易泄漏或引用不稳定 | 不采用 |
| B. raw artifacts 保留,由 reports 摘要并建立链接 | 可审计且可读 | 需要 report 脚本和链接检查 | 采用 |
| C. 只保留 reports,删除 raw artifacts | 干净 | 失败复现和审计不足 | 不采用 |

### 6.2 是否在 `reports/acceptance` 中使用 `<run_id>-index.md`

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只保留 handoff / veto / risk | 标准目录更简单 | 不利于固定 run 的验收索引 |
| B. 同时保留 `<run_id>-index.md` 和 handoff / veto / risk | 兼顾 run-specific 索引和人类送验摘要 | 文件更多 | 采用 |
| C. 使用 `latest-index.md` | 方便 | 破坏正式引用可审计性 | 不采用 |

### 6.3 是否允许 report 包含完整 stdout/stderr

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. report 全量复制 stdout/stderr | 查阅方便 | 报告膨胀且泄漏风险高 | 不采用 |
| B. report 摘要 stdout/stderr 并链接 raw artifact | 可读且可追溯 | 需要 link check | 采用 |
| C. 不保留 stdout/stderr | 简洁 | 失败定位不足 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| `EV-BUS-PUB-001`~`004` | publication evidence | service / API / contract suite | `artifacts/test/<run_id>/suites/publication` | `TC-BUS-PUB-001`~`004` | `reports/runs/<run_id>/evidence/EV-BUS-PUB.md` |
| `EV-BUS-SEM-001`~`002` | transport semantic evidence | domain / service suite | `artifacts/test/<run_id>/suites/semantic` | `TC-BUS-SEM-001`~`002` | `reports/runs/<run_id>/evidence/EV-BUS-SEM.md` |
| `EV-BUS-DLV-001`~`004` | delivery lifecycle evidence | integration / job suite | `artifacts/test/<run_id>/suites/delivery` | `TC-BUS-DLV-001`~`004` | `reports/runs/<run_id>/evidence/EV-BUS-DLV.md` |
| `EV-BUS-FDB-001`~`004` | feedback / idempotency evidence | service / API suite | `artifacts/test/<run_id>/suites/feedback` | `TC-BUS-FDB-001`~`004` | `reports/runs/<run_id>/evidence/EV-BUS-FDB.md` |
| `EV-BUS-REC-001`~`004` | recovery evidence | recovery / release suite | `artifacts/test/<run_id>/suites/recovery` | `TC-BUS-REC-001`~`004` | `reports/runs/<run_id>/evidence/EV-BUS-REC.md` |
| `EV-BUS-OUT-001`~`006` | read-only output / audit evidence | API / service / integration suite | `artifacts/test/<run_id>/suites/output` | `TC-BUS-OUT-001`~`006` | `reports/runs/<run_id>/evidence/EV-BUS-OUT.md` |
| `EV-BUS-OBX-001`~`002` | outbox relay evidence | consumer / integration suite | `artifacts/test/<run_id>/suites/outbox` | `TC-BUS-OBX-001`~`002` | `reports/runs/<run_id>/evidence/EV-BUS-OBX.md` |
| `EV-BUS-BND-001`~`003` | backend boundary evidence | integration / job suite | `artifacts/test/<run_id>/suites/backend` | `TC-BUS-BND-001`~`003` | `reports/runs/<run_id>/evidence/EV-BUS-BND.md` |
| `EV-BUS-CFG-001`~`003` | config evidence | config suite | `artifacts/test/<run_id>/suites/config` | `TC-BUS-CFG-001`~`003` | `reports/runs/<run_id>/config-summary.md` |
| `RP-BUS-RED-001` | redaction report | redaction check | `artifacts/test/<run_id>/suites/redaction` | `TC-BUS-RED-001` | `reports/runs/<run_id>/redaction-check.md` |
| `RP-BUS-SUM-001` | run summary / acceptance index | report scripts | `reports/runs/<run_id>`、`reports/acceptance` | `TC-BUS-RED-002` | `reports/acceptance/<run_id>-index.md` |

### 7.2 测试报告结构

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| run summary | all suite reports | `generate_reports.sh` | `reports/runs/<run_id>/summary.md` | 确认 run_id、commit、profile、suite 结果 |
| evidence index | `evidence-index.json` | `generate_reports.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV / TC / AC 链路完整 |
| gate results | gate report JSON | `generate_reports.sh` | `reports/runs/<run_id>/gate-results.md` | 检查 PR / CI / release gate 阻断结果 |
| coverage matrix | case result index | `generate_reports.sh` | `reports/runs/<run_id>/coverage-matrix.md` | 检查 P0 / P0-min 无缺口 |
| redaction check | redaction scan output | `check_redaction.sh` + `generate_reports.sh` | `reports/runs/<run_id>/redaction-check.md` | S0 红线人工确认 |
| suite report | suite report JSON | `generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 失败 suite 补充复验建议 |
| acceptance index | run reports | `generate_acceptance_index.sh` | `reports/acceptance/<run_id>-index.md` | 确认可交给 `06` |
| handoff | run reports | `generate_acceptance_handoff.sh` 或人工初稿 | `reports/acceptance/handoff.md` | 人 / Agent 必须审查 |
| veto checklist | run reports + S0/S1 rules | `generate_veto_checklist.sh` 或人工初稿 | `reports/acceptance/veto-checklist.md` | 人 / Agent 必须审查 |
| risk acceptance | defect / risk records | 人 / Agent 主写 | `reports/acceptance/risk-acceptance.md` | owner、期限、影响、复验计划必须齐全 |

### 7.3 artifacts 目录结构

```text
artifacts/test/<run_id>/
  meta/
    context.json
  evidence-index.json
  fixtures/
    fixture-summary.json
  snapshots/
    failed-runtime-snapshot.json
  suites/
    unit/
      report.json
      stdout.log
      stderr.log
    service/
      report.json
      stdout.log
      stderr.log
    integration/
      report.json
      stdout.log
      stderr.log
    recovery/
      report.json
      stdout.log
      stderr.log
    redaction/
      report.json
      stdout.log
      stderr.log
```

### 7.4 reports 目录结构

```text
reports/
  README.md
  runs/
    <run_id>/
      summary.md
      evidence-index.md
      gate-results.md
      coverage-matrix.md
      config-summary.md
      redaction-check.md
      artifact-index.md
      suites/
        unit.md
        service.md
        integration.md
        recovery.md
      evidence/
        EV-BUS-PUB.md
        EV-BUS-SEM.md
        EV-BUS-DLV.md
        EV-BUS-FDB.md
        EV-BUS-REC.md
        EV-BUS-OUT.md
        EV-BUS-OBX.md
        EV-BUS-BND.md
  acceptance/
    <run_id>-index.md
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

### 7.5 report / artifact 生成链路

```text
+---------------------------+
| scripts/gates/*.sh        |
| run suites / checks       |
+-------------+-------------+
              |
              v
+-------------+-------------+
| artifacts/test/<run_id>   |
| raw machine evidence      |
+-------------+-------------+
              |
              v
+-------------+-------------+
| scripts/reports/*.sh      |
| generate readable reports |
+-------------+-------------+
              |
              v
+-------------+-------------+
| reports/runs/<run_id>     |
| summary / evidence index  |
+-------------+-------------+
              |
              v
+-------------+-------------+
| reports/acceptance        |
| handoff / veto / risk     |
+---------------------------+
```

图后说明：

- gate / check 产出 raw artifacts。
- report scripts 只能读取固定 `run_id` 的 artifacts。
- acceptance 文件可以脚本生成初稿,但必须人 / Agent 审查。
- `06-验收标准.md` 只引用 reports,必要时再回链 raw artifacts。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_13_reports_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“证据归档表”“测试报告结构”“artifacts 目录结构”和“reports 目录结构”小节，了解 L0-bus 测试证据如何支撑后续验收裁决。

本章定义 L0-bus 测试报告与证据归档规则。机器原始证据统一写入 `artifacts/test/<run_id>`,人类可读报告统一写入 `reports/runs/<run_id>`,验收交接材料统一写入 `reports/acceptance`。正式证据引用必须绑定固定 `run_id`,不得引用 `latest`,不得额外增加 `<project>` 层级。

Gate、check 和测试框架产出 raw artifacts;`scripts/reports/*` 从固定 artifacts 生成报告初稿;`reports/acceptance/*` 可以由脚本生成初稿,但必须由人或 Agent 审查补充。失败 suite 仍应产出 `report.json`、stdout/stderr log 和 failure reason。所有 artifact 和 report 必须通过 redaction / boundary scan,不得包含 raw secret、token、private key、credential value 或完整业务正文。

---

## 9. 待确认事项

当前没有阻塞进入 Step 14 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否保留 `<run_id>-index.md` | A. 保留;B. 只用 handoff;C. 用 latest | 采用 A | 兼容 Step 9 / Step 12 的 run-specific 验收索引,且不破坏标准目录 |
| raw artifacts 是否作为验收主要阅读材料 | A. 是;B. 否,reports 为主,artifacts 回链 | 采用 B | 验收需要可读报告,raw artifacts 用于审计和复现 |
| 失败 suite 是否必须生成报告 | A. 必须;B. 可跳过;C. 只记录退出码 | 采用 A | 失败原因和复验范围必须可追溯 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每类测试输出证据已定义 | 已满足 |
| 证据保存位置已定义 | 已满足 |
| 证据到用例和验收项的关联方式已定义 | 已满足 |
| 必须保留的日志、trace、snapshot 和报告已定义 | 已满足 |
| 证据保留策略已定义 | 已满足 |
| `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 目录结构已定义 | 已满足 |
| 报告生成脚本和人 / Agent 审查补充要求已定义 | 已满足 |
| redaction / boundary scan 证明方式已定义 | 已满足 |

结论: 可以进入 Step 14,定义回归策略与残余风险。
