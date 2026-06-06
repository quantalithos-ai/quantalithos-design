# Step 13. 定义测试报告与证据归档

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 13 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节: `05-测试方案.md` §13 测试报告与证据归档
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。证据归档采用 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 固定路径;正式验收交接报告由后续 `06` / release gate 审查消费。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 5 覆盖矩阵 | EV 编号 | 证据 ID 分层稳定 |
| Step 9 自动化门禁 | artifact / report 输出 | 套件报告路径固定 |
| `03` §15 | 脚本契约 | gate、report、redaction checker 输出必须可复核 |
| `04` §12 | 配置证据 | config digest、redaction scan、dependency scan 进入 evidence |

---

## 3. SOP 问题回答

1. 需要留存哪些证据?

   回答:需要留存 suite report、stdout / stderr、fixture manifest、config digest、operation result sample、state transition report、redaction-check、evidence index、minimum E2E summary 和 residual risk report。

2. 证据如何被验收引用?

   回答:每个 EV 指向一个或多个 `artifacts/test/<run_id>/...` 原始证据和 `reports/runs/<run_id>/...` 人类可读报告;新版 `06` 后续引用 EV ID 和 fixed run_id。

3. 失败的 suite 是否保留证据?

   回答:必须保留。失败 suite 至少保留 report.json、stdout / stderr、failure reason 和 redacted context。

4. 报告不得包含什么?

   回答:不得包含 raw secret、token、private key、credential value、method body、work truth body、governance decision body、artifact body、runtime execution log、conversation body、observability ledger body 或 archive package body。

5. 人 / Agent 审查做什么?

   回答:审查 reports 是否可读、EV / TC / AC 是否可追溯、失败解释是否准确、redaction 是否通过、残余风险是否有接受人;不在报告中补设计字段。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | 报告路径待定 | 固定 artifacts / reports 路径 |
| `03` §15 | 脚本契约已定义,证据索引未展开 | 本 Step 定义 evidence table 和 report layout |
| `06` 已同步 | AC 引用已由新版 `06-验收标准.md` §5~§10 消费 | 正式 `05` §13 已回填验收引用 |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 证据路径 | 待定 | `artifacts/test/<run_id>` / `reports/runs/<run_id>` |
| 证据索引 | profile freeze / state history 粗略 | EV 分层表 + evidence index |
| 报告审查 | 未定义 | 人 / Agent 审查要求明确 |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否填实际测试结果 | 不填。`05` 只定义证据结构 |
| 是否允许 latest | 不允许正式引用 latest |
| 是否生成 acceptance handoff | 可以生成初稿,但必须人 / Agent 审查并由 `06` 消费 |

---

## 7. 结构化中间产物

### 7.1 证据归档表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| EV-CONTRACT-001 | contract report / DTO roundtrip manifest | `contract` suite | `artifacts/test/<run_id>/suites/contract/` | TC-PROC-CONTRACT-001~002 | `06` §7;`AC-PROC-006` |
| EV-DOMAIN-001 | state transition report | `domain` suite | `artifacts/test/<run_id>/suites/domain/` | TC-PROC-STATE-001~016 | `06` §8;`AC-PROC-003`;`AC-PROC-008` |
| EV-SERVICE-001 | command service report | `service` suite | `artifacts/test/<run_id>/suites/service/` | TC-PROC-CMD-001~013 | `06` §5;`AC-PROC-001`~`007` |
| EV-SERVICE-002 | query no-write report | `service` suite | `artifacts/test/<run_id>/suites/service/` | TC-PROC-QUERY-001~011 | `06` §5;`AC-PROC-005`;`AC-PROC-012`;`06` §8 |
| EV-SERVICE-003 | transaction / rollback report | `service` + `integration` suites | `artifacts/test/<run_id>/suites/service/` | TC-PROC-TX-001 | `06` §8;`ST-PROC-TX-001`~`002` |
| EV-SERVICE-004 | idempotency replay report | `service` suite | `artifacts/test/<run_id>/suites/service/` | TC-PROC-IDEMP-001~003 | `06` §8;`ST-PROC-IDEM-001`~`002` |
| EV-INTEGRATION-001 | recovery / concurrency report | `integration` + `recovery-replay` suites | `artifacts/test/<run_id>/suites/integration/` | TC-PROC-RECOVERY-001~004 | `06` §5;`AC-PROC-004`;`AC-PROC-011`;`06` §8 |
| EV-INTEGRATION-002 | config / adapter failure report | `config-security` + `integration` suites | `artifacts/test/<run_id>/suites/config-security/` | TC-PROC-CONFIG-001~009 | `06` §6;`RL-PROC-CONFIG-001`;`06` §9 |
| EV-INTEGRATION-003 | performance sample report | performance sample | `artifacts/test/<run_id>/suites/performance/` | TC-PROC-NFR-001 | `06` §9 performance sample |
| EV-WORKER-001 | inbound consumer report | `entry-contract` suite | `artifacts/test/<run_id>/suites/entry-contract/` | TC-PROC-EVENT-001~007 | `06` §7;`06` §8 `ST-PROC-EVENT-001` |
| EV-WORKER-002 | outbox publish report | `entry-contract` suite | `artifacts/test/<run_id>/suites/entry-contract/` | TC-PROC-PUB-001 | `06` §7;`06` §8 recovery / outbox |
| EV-JOB-001 | operations job report | `entry-contract` + `recovery-replay` suites | `artifacts/test/<run_id>/suites/recovery-replay/` | TC-PROC-JOB-001~007 | `06` §5 `AC-PROC-013`;`06` §8 `ST-PROC-JOB-001` |
| EV-SCRIPT-001 | redaction scan report | `evidence-scripts` suite | `reports/runs/<run_id>/redaction-check.md` | TC-PROC-CONFIG-007 / TC-PROC-SEC-001 / TC-PROC-SCRIPT-003 | `06` §6;`06` §10;`VF-PROC-002`;`VF-PROC-005` |
| EV-SCRIPT-002 | dependency / observability scan report | `config-security` + `evidence-scripts` | `reports/runs/<run_id>/suites/config-security.md` | TC-PROC-OBS-001~002 | `06` §6 `VF-PROC-008`;`06` §9 |
| EV-SCRIPT-003 | report generation / evidence index | `evidence-scripts` suite | `reports/runs/<run_id>/evidence-index.md` | TC-PROC-SCRIPT-001~003 | `06` §10 evidence gates;`AC-PROC-005`;`AC-PROC-012` |
| EV-E2E-001 | minimum closure summary | `minimum-e2e` suite | `reports/runs/<run_id>/suites/minimum-e2e.md` | TC-PROC-E2E-001 | `06` §5 `AC-PROC-001`~`005`;`06` §11 `VF-PROC-001` |
| EV-E2E-002 | P1 real-like smoke summary | `p1-real-like-smoke` suite | `reports/runs/<run_id>/suites/p1-real-like-smoke.md` | TC-PROC-P1-001 | `06` §13 `RA-PROC-001` |

### 7.2 报告生成表

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| suite summary | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释、TC / EV 引用和 redaction 状态 |
| gate results | `artifacts/test/<run_id>/gate-results.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/gate-results.md` | 检查阻断级别是否正确 |
| evidence index | `artifacts/test/<run_id>/evidence-index.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV / TC / 待 AC 是否可追溯 |
| redaction check | artifacts + reports | `scripts/checks/check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` | 检查 raw secret / raw body / archive body 均未出现 |
| acceptance handoff draft | `reports/runs/<run_id>/*` | `scripts/reports/generate_reports.sh` | `reports/acceptance/handoff.md` | 补充交付说明、风险和人工审查结论 |

### 7.3 reports 目录结构

```text
reports/
  README.md
  runs/
    <run_id>/
      summary.md
      evidence-index.md
      gate-results.md
      redaction-check.md
      suites/
        <suite>.md
      evidence/
        EV-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

---

## 8. 回填草稿

`05-测试方案.md` §13 应输出证据归档表、报告生成表和 `reports/` 目录结构。测试方案不填写实际执行结论;失败 suite 仍需可审计证据。报告和 artifacts 必须通过 redaction 约束。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP13-OPEN-001 | 新版 `06` 的 AC 引用 | 后续由 `06` 回填 |
| TP13-OPEN-002 | evidence index 内部 JSON schema | `05` 固定路径和语义,具体 schema 留给实现 / `07` |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 证据 ID、来源和路径明确 | 通过 |
| 报告生成和审查要求明确 | 通过 |
| forbidden output 规则明确 | 通过 |
