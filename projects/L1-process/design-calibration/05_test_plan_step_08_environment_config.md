# Step 8. 设计测试环境与配置矩阵

> 本文件是 `projects/L1-process/05-测试方案.md` 的 Step 8 中间产物。
> SOP: `standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节: `05-测试方案.md` §8 测试环境与配置矩阵
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。测试环境矩阵承接 `04-配置设计.md` 的 `local-dev`、`ci-test`、`integration-like`、`operations-replay` P0 profile,并把 `staging-like`、`production-like` 留作 P1/P2。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 7 测试数据 | 确定环境隔离和清理 | local / CI 使用 in-memory 和 temp artifacts |
| `04_config_step_06_profiles_matrix.md` | profile 矩阵 | P0 profile 固定为 local-dev、ci-test、integration-like、operations-replay |
| `04_config_step_08_sensitive_secrets.md` | sensitive config | 所有 profile 禁 raw secret,只允许 ref |
| `04_config_step_11_failure_modes.md` | failure mode | invalid config fail-fast,configured adapter 不 fallback fake |
| `03` §15 脚本契约 | artifact / report path | 固定 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` |

---

## 3. SOP 问题回答

1. 测试在哪些环境执行?

   回答:P0 在 local-dev、ci-test、integration-like、operations-replay 四类 profile 下设计测试。staging-like 和 production-like 是 P1/P2,仅保留 smoke / dry-run 风险。

2. 跨仓依赖类型和协作方式是什么?

   回答:唯一允许的编译期 sibling 依赖是 core contracts。method-library、work、identity、governance、artifact、runtime、conversation、observability、archive 等为运行期或事件协作依赖,通过 fake、configured adapter、event replay 或 projection fixture 协作,不得加入 Cargo path dependency。

3. 环境差异如何影响测试?

   回答:local / CI 使用 fake / in-memory / fixed clock 验证语义;integration-like 使用 controlled configured adapter 验证接缝和 failure;operations-replay 使用脱敏历史状态和 report ref 验证重跑、幂等和 partial failure。

4. 敏感配置如何处理?

   回答:普通 JSON / env 只能保存 endpoint / credential / destination ref,不得保存 raw secret、token、password、private key、DSN 或 provider response body;报告和 artifacts 必须 redaction scan。

5. 测试失败时如何保留证据?

   回答:gate 和 report 脚本必须在失败时保留 `artifacts/test/<run_id>` 与 failure report;redaction failure 必须非 0 并输出 `reports/runs/<run_id>/redaction-check.md`。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| 旧 `05` | dev / test / staging 三类环境过粗 | 使用 `04` 的 profile 矩阵重建 |
| `04` | 配置 profile 已定义,但未转为测试环境表 | 本 Step 转成环境 / 依赖 / 协作 / 数据策略 |
| 跨仓依赖 | 容易误写 path dependency | 本 Step 明确 runtime / event collaboration 不允许 path dependency |

---

## 5. 改动前后对比

| 维度 | 旧版 | 新版 |
|---|---|---|
| 环境 | dev / test / staging | local-dev / ci-test / integration-like / operations-replay / staging-like / production-like |
| 依赖 | local DB / fake event bus | 编译期 / 运行期 / 事件协作依赖分类 |
| 配置 | debug / deterministic | defaults、JSON、env、entry args、secret ref、config digest |
| 安全 | 未明确 raw secret | ref-only sensitive + redaction scan |

---

## 6. 测试设计取舍

| 议题 | 取舍 |
|---|---|
| 是否要求 P0 真实外部服务 | 不要求。P0 用 fake / controlled adapter 验证语义和失败 |
| 是否允许 `latest` report | 不允许正式证据引用 `latest`;必须固定 run_id |
| 是否记录 production values | 不记录。production-like 值和 runbook 属于运维 |

---

## 7. 结构化中间产物

### 7.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| local-dev | 本地开发、手动 smoke、最小闭环调试 | core contracts、in-memory store、fake resolver / publisher / handoff | core 为编译期;其它为不适用 / fake | path dependency only for core;fake adapters | defaults + optional JSON / env、fixed clock、sequence id、fake marker | per-run in-memory、local artifacts | 不代表生产验收 |
| ci-test | PR / CI 自动化 | core contracts、temporary in-memory store、deterministic fake adapters | core 编译期;external 为 fake | path dependency only for core;fake / fixture | test JSON + CI env、strict redaction、deterministic fixture | isolated temp dir + run_id | 真实 broker / DB 差异不覆盖 |
| integration-like | 跨入口 / 跨仓接缝验证 | controlled resolver、publisher、handoff、optional durable-like store | runtime / event collaboration | configured local adapter / event replay / controlled endpoint | JSON + env + credential ref、no fake fallback | run-scoped namespace | configured endpoint 不稳定时只能明确 unavailable |
| operations-replay | outbox、projection、reference refresh、handoff、recovery、reconciliation 重跑 | 脱敏 historical store、report root、fake / controlled adapters | runtime / event collaboration | replay fixture / fake / controlled adapter | replay JSON、job scope、config digest | retained artifacts and reports | 只能证明重跑语义,不证明生产容量 |
| staging-like | 发布前 real-like smoke | real-like DB、event bus、resolver、handoff、secret provider | runtime / event collaboration | real-like dry-run / event replay | deployment config refs | run-scoped cleanup | P1,不阻塞 P0 |
| production-like | 生产运行语境 | real DB / bus / source adapters / handoff / secret provider | runtime / event collaboration | 运维 runbook | production config refs | 运维定义 | P1/P2,不在 05 写真实值 |

### 7.2 环境拓扑图

#### 环境拓扑图: L1-process P0 测试依赖

```text
                 [core-contracts]
                       |
                    [compile]
                       |
                       v
[process test runtime] ----[runtime/fake]----> [source resolvers]
        |                  [event/fake]------> [publisher]
        |                  [runtime/fake]----> [handoff adapter]
        |
        +----[runtime]----> [in-memory / controlled store]
        |
        +----[runtime]----> artifacts/test/<run_id>
                              |
                              v
                         reports/runs/<run_id>
```

关键说明:

- 只有 `core-contracts` 是编译期 sibling 依赖。
- method-library、work、identity、governance、artifact、runtime、conversation 等只通过 fake / configured adapter / event replay 协作。
- artifacts 和 reports 必须按固定 run_id 输出,不得引用 `latest` 作为正式证据。

### 7.3 配置测试矩阵

| 配置场景 | profile | 预期行为 | 关联用例 |
|---|---|---|---|
| defaults only | local-dev / ci-test | runtime builder 可构造, fake marker 明确 | TC-PROC-CONFIG-001 |
| valid JSON | ci-test / integration-like | JSON 覆盖 defaults,validation 通过 | TC-PROC-CONFIG-002 |
| env override | ci-test / integration-like | env 覆盖 JSON / defaults,非法 env fail-fast | TC-PROC-CONFIG-002 / 003 |
| duplicate key / alias key | ci-test | fail-fast | TC-PROC-CONFIG-003 |
| bad duration / page limit 0 | ci-test | fail-fast | TC-PROC-CONFIG-004 |
| missing endpoint / credential ref | integration-like | fail-fast / fail-closed | TC-PROC-CONFIG-005 |
| retention conflict | ci-test | fail-fast | TC-PROC-CONFIG-004 |
| topic map missing | ci-test / integration-like | fail-fast | TC-PROC-CONFIG-006 |
| raw secret present | all | reject config / redaction gate fail | TC-PROC-CONFIG-007 |
| fake resolver marker | local-dev / ci-test | fake marker appears in diagnostics | TC-PROC-CONFIG-008 |
| configured resolver unavailable | integration-like | explicit unavailable,not fake success | TC-PROC-CONFIG-008 |
| publisher failure | integration-like / operations-replay | retry / failed marker | TC-PROC-PUB-001 |
| handoff failure | integration-like / operations-replay | retry / failed / partial receipt | TC-PROC-RECOVERY-004 |
| forbidden body allow-list | all | reject config | TC-PROC-CONFIG-007 |
| non-core Cargo dependency scan | ci-test | fail if non-core sibling path dependency appears | TC-PROC-SCRIPT-001 |
| job config digest recorded | operations-replay | report records digest | TC-PROC-CONFIG-009 |
| config drift warning | operations-replay | report warns drift | TC-PROC-CONFIG-009 |

---

## 8. 回填草稿

`05-测试方案.md` §8 应输出环境矩阵、P0 环境拓扑图和配置测试矩阵。正文必须说明唯一编译期 sibling 依赖是 core contracts,其它跨仓依赖只能通过 fake、configured adapter、event replay 或 projection fixture 协作。

---

## 9. 待确认事项

| 编号 | 待确认项 | 当前处理 |
|---|---|---|
| TP08-OPEN-001 | integration-like 是否在 release gate 必跑 | 当前作为 P1 / release candidate 风险 |
| TP08-OPEN-002 | staging-like / production-like 具体产品依赖 | 留给部署与运维手册 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 环境、依赖和配置矩阵明确 | 通过 |
| 跨仓依赖类型和协作方式明确 | 通过 |
| raw secret / latest report 等禁止项明确 | 通过 |

