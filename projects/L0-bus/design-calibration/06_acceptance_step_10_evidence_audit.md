# L0-bus 06 验收标准 Step 10: 可观测性、审计与证据门禁

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 10 中间产物。
> 本步定义 audit、trace / log / metric、reports、artifacts、acceptance handoff 和 redaction 证明如何支撑验收裁决。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 10 |
| 主题 | 定义可观测性、审计与证据门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §10 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `03-详细设计.md` §14 | 已完成 | 提取必须观测的处理流、log / metric / audit / evidence / projection redaction 规则 |
| `03-详细设计.md` §15 | 已完成 | 提取 observability、redaction、config、consistency、idempotency 最小测试切口 |
| `05-测试方案.md` §12 / §13 | 已完成 | 提取进入 / 退出准则、reports / artifacts / acceptance handoff 路径和 EV / RP 映射 |
| `06_acceptance_step_03_baseline.md` | 已确认 | 继承固定 `<run_id>`、非法 `latest` 引用和证据基线 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承进入验收前必须具备的 reports / artifacts / acceptance handoff |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承 redaction、report integrity、observability / audit 非功能门禁 |

---

## 3. SOP 问题回答

### 3.1 哪些行为必须有 audit record?

Audit 用于证明 bus truth、recovery chain 和 privileged operation 的可追溯性,不能被 log 或 metric 替代。

| 行为 | 是否必须有 audit | 验收口径 |
|---|---|---|
| Publication accepted / rejected | 是 | 接入判定、拒绝原因、actor、trace ref 可追溯 |
| Delivery `Scheduled / Dispatching / Delivered / Failed`，以及 feedback 推动的 `Completed` | 是 | delivery state 与 delivery history 一致 |
| Feedback ack / fail / timeout / duplicate / late feedback | 是 | feedback result、idempotency anchor、history 可追溯 |
| Retry requested / retry exhausted | 是 | retry plan、policy、actor 或 job ref 可追溯 |
| Dead-letter created / archived | 是 | failure material、DLQ entry、history 可追溯 |
| Replay preparation ready / rejected | 是 | approval ref、audit chain、rejection reason 可追溯 |
| Privileged read: tap / DLQ read / failure material | 是,至少 access audit | actor、scope、reason、stable rejection 可追溯 |
| Query 普通只读 | 按敏感度 | 普通 Query 可无业务 audit,但敏感 Query 和失败分支需要 access audit |
| Projection rebuild / failure | 是,作为 operations evidence | rebuild source、version、failure reason 可追溯 |
| Outbound publish retryable failure / schema rejection | 是或 evidence record | truth 不回滚,发布失败原因可追溯 |

### 3.2 哪些行为必须有 trace / log / metric?

Log、metric、trace context ref 和 audit 分工不同。验收不得用一个材料替代另一个材料。

| 材料 | 必须覆盖 | 通过条件 |
|---|---|---|
| trace context ref | Command、Event、Job、重要 Query | 可把跨仓请求、bus truth 和 report evidence 关联起来 |
| structured log | validation failure、boundary violation、dependency error、job item failure | 能定位问题,但不含 forbidden body |
| metrics | publication、delivery、feedback、recovery、projection、publish、UoW | 低基数标签,不得带 record id、payload digest 全量或 secret ref 明文 |
| audit record | bus truth / recovery / privileged read / operations change | 关键状态变化和操作可审计 |
| evidence record | gate result、publish retry、source ack failure、manual action | 支撑验收裁决和复验 |

### 3.3 哪些测试报告必须归档?

正式验收必须优先读取 `reports/runs/<run_id>` 和 `reports/acceptance`,再通过索引回指 `artifacts/test/<run_id>`。

| 报告 / 证据 | 固定路径 | 必须性 |
|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | 必须 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 必须 |
| gate results | `reports/runs/<run_id>/gate-results.md` | 必须 |
| coverage matrix | `reports/runs/<run_id>/coverage-matrix.md` | 必须 |
| config summary | `reports/runs/<run_id>/config-summary.md` | 必须 |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | 必须 |
| artifact index | `reports/runs/<run_id>/artifact-index.md` | 必须 |
| suite reports | `reports/runs/<run_id>/suites/<suite>.md` | 必须覆盖 P0 / P0-min suite |
| evidence detail | `reports/runs/<run_id>/evidence/EV-BUS-<AREA>.md` | 必须覆盖 P0 EV |
| acceptance index | `reports/acceptance/<run_id>-index.md` | 必须 |
| handoff | `reports/acceptance/handoff.md` | 必须 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 必须 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 条件通过时必须 |
| open issues | `reports/acceptance/open-issues.md` | 有缺陷或遗留项时必须 |

### 3.4 证据缺失是否导致不通过?

证据缺失不能用口头确认替代。缺失影响按证据类型分级。

| 缺失类型 | 影响 |
|---|---|
| 固定 `<run_id>` 缺失 | 阻断进入验收 |
| `reports/runs/<run_id>/summary.md` 缺失 | 阻断进入验收 |
| P0 EV 或 evidence-index 缺失 | 不通过或送验不成立 |
| release gate result 缺失 | 不通过 |
| redaction-check 缺失 | 不通过;无法证明安全红线 |
| redaction-check 命中 raw secret / raw body | S0,Step 11 一票否决 |
| acceptance handoff 缺失 | 交接不完整,不得最终签署 |
| risk-acceptance 缺失且存在 S2 / P1-risk | 不得有条件通过 |
| 非关键 suite 文案缺失 | 可按 S2 处理,但不得影响 P0 证据链 |

### 3.5 证据如何被复查?

复查必须沿固定路径从验收入口回到报告,再回到机器原始证据。

```text
reports/acceptance/<run_id>-index.md
  -> reports/runs/<run_id>/summary.md
  -> reports/runs/<run_id>/evidence-index.md
  -> reports/runs/<run_id>/evidence/EV-BUS-<AREA>.md
  -> artifacts/test/<run_id>/suites/<suite>/report.json
  -> artifacts/test/<run_id>/suites/<suite>/stdout.log / stderr.log
```

复查规则:

- 不得引用 `latest`。
- 不得使用 `artifacts/test/<project>/<run_id>` 或 `reports/<project>`。
- 不得跨 run 拼接 P0 证据,除非 handoff 明确说明多个 run 的关系和适用范围。
- raw artifact 是复查入口,不是正式验收阅读的唯一入口。
- `reports/acceptance/*` 可由脚本生成初稿,但验收前必须有人或 Agent 审查补充。

### 3.6 `evidence-index.md` 是否覆盖全部 P0 EV?

`reports/runs/<run_id>/evidence-index.md` 必须覆盖全部 P0 / P0-min EV 和 RP。

| EV / RP 族 | 覆盖要求 |
|---|---|
| `EV-BUS-PUB-*` | 覆盖 publication acceptance |
| `EV-BUS-SEM-*` | 覆盖 transport semantic |
| `EV-BUS-DLV-*` | 覆盖 delivery lifecycle |
| `EV-BUS-FDB-*` | 覆盖 feedback / idempotency |
| `EV-BUS-REC-*` | 覆盖 recovery / DLQ / replay preparation |
| `EV-BUS-OUT-*` | 覆盖 read-only output / audit |
| `EV-BUS-OBX-*` | 覆盖 outbox relay |
| `EV-BUS-BND-*` | 覆盖 backend boundary |
| `EV-BUS-CFG-*` | 覆盖 config control plane |
| `RP-BUS-RED-*` | 覆盖 redaction |
| `RP-BUS-SUM-*` | 覆盖 run summary / acceptance index |

### 3.7 `gate-results.md` 是否覆盖全部 release gate?

`reports/runs/<run_id>/gate-results.md` 必须至少覆盖 PR gate、main CI gate 和 release gate 的结论。nightly / P1 smoke 如参与本次验收,必须标明是否为 P1-risk 证据。

| Gate | 必须记录 |
|---|---|
| PR gate | `bus-unit`、`bus-service`、`bus-contract`、`bus-config`、`bus-redaction-smoke`、`bus-integration-fast` |
| main CI gate | `bus-integration-full`、`bus-worker-consumer`、`bus-job-runner`、`bus-report-smoke` |
| release gate | `bus-release-closed-loop`、`bus-release-recovery`、`bus-release-config-runtime`、`bus-release-redaction`、`bus-release-report` |
| nightly | 如果用于风险说明,必须标注非 P0 或 P1-risk |

### 3.8 `redaction-check.md` 是否证明 artifact 和 report 不含 raw secret / raw body?

必须证明以下材料均不含 forbidden body:

| 材料 | 禁止内容 |
|---|---|
| log / stdout / stderr | payload body、raw secret、backend private response、governance decision body |
| metric label | record id、payload digest 全量、secret ref 明文 |
| audit | payload body、raw secret、长期日志正文、治理决策正文 |
| event | payload body、raw secret、backend private body |
| projection | payload body、raw secret、可反推出 secret 的 backend private detail |
| evidence / report | raw body、raw secret、backend private body、governance decision body |

`redaction-check.md` 缺失或命中红线,不得通过证据门禁。

### 3.9 `reports/acceptance/handoff.md` 是否已由人 / Agent 审查补充?

`handoff.md` 必须说明送验版本、commit、dependency snapshot、profile、run_id、证据入口、非范围和已知风险。脚本可以生成初稿,但必须经过人或 Agent 审查补充。

### 3.10 `reports/acceptance/veto-checklist.md` 是否覆盖所有一票否决项?

`veto-checklist.md` 必须覆盖 Step 11 定义的全部否决项。当前 Step 10 只定义文件必须存在和可追溯,不提前替 Step 11 决定最终 VETO 清单。

### 3.11 `reports/acceptance/risk-acceptance.md` 是否支撑有条件通过?

如果最终结论为有条件通过,`risk-acceptance.md` 必须覆盖所有未关闭 S2 和 P1-risk,并包含 owner、影响范围、截止时间、后续动作、复验计划和接受记录。缺失时不得有条件通过。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 容易把测试结果和验收证据混在一起 | 没有明确报告、artifact、handoff 三层入口 | 验收人员无法复查证据链 | 本步固定三层证据路径和复查链路 |
| 可观测材料和审计材料边界不清 | log / metric / audit / trace 可能互相替代 | 审计链不可裁决 | 本步明确四类材料不能互替 |
| redaction 证明容易只扫 raw artifact | report / evidence / projection 也可能泄漏 | 安全红线遗漏 | 本步要求 artifact 和 report 都通过 redaction |
| acceptance handoff 可能只是脚本初稿 | 缺人或 Agent 审查 | 交接材料无法签署 | 本步要求审查补充 |
| risk acceptance 缺失时仍可能有条件通过 | 风险没有 owner 和期限 | 放行不可追责 | 本步把 risk acceptance 作为条件通过硬入口 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 证据入口 | 泛称测试报告 | `reports/acceptance` -> `reports/runs/<run_id>` -> `artifacts/test/<run_id>` | 可复查 |
| audit / log / metric / trace | 分散描述 | 明确分工,不可互替 | 可裁决 |
| EV 覆盖 | 依赖测试方案隐含 | evidence-index 必须覆盖全部 P0 EV / RP | 可追溯 |
| gate 结果 | 未固定最小 gate 集合 | PR / CI / release gate 必须记录 | 可审计 |
| redaction | 只作为测试项 | artifact 与 report 都必须 clean | 防泄漏 |
| handoff | 未强制审查 | 脚本初稿必须经人 / Agent 审查补充 | 可签署 |

---

## 6. 验收设计取舍

### 6.1 是否允许口头确认替代缺失证据

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 放行更快 | 不可审计,无法复验 |
| B. 不允许,必须补报告或 artifact | 可审计 | 需要补证据成本 | 采用 |
| C. 只允许内部确认 | 灵活 | 边界不稳定 | 不采用 |

### 6.2 是否把 raw artifact 作为唯一验收入口

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 是 | 最接近机器事实 | 人类审查成本高,难签署 |
| B. 否,以 report / acceptance 为入口,回链 raw artifact | 审查友好且可复查 | 需要索引完整 | 采用 |
| C. 只看 summary | 快 | 无法追溯失败证据 | 不采用 |

### 6.3 `reports/acceptance/*` 是否必须人工或 Agent 审查

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 不需要,脚本生成即可 | 自动化程度高 | 风险、否决和签署口径可能不完整 |
| B. 必须审查补充 | 适合验收签署 | 多一步审查 | 采用 |
| C. 只审查 handoff | 较轻 | veto / risk 可能漏项 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-EVID-001 | Audit record | acceptance、delivery、feedback、retry、DLQ、replay、privileged read 的 audit / history | 关键状态变化可关联 actor、trace ref、history 或 audit | 关键状态只存在内存或 log,无 audit / history |
| AC-EVID-002 | Trace / log / metric | trace context ref、structured log、low-cardinality metrics | 能定位处理流,且不含 forbidden body | trace 缺失导致跨仓无法定位;metric label 泄漏正文或 secret |
| AC-EVID-003 | P0 EV index | `reports/runs/<run_id>/evidence-index.md` | 全部 P0 / P0-min EV / RP 可回指 report 和 artifact | P0 EV 缺失、链接断裂、跨 run 拼接未说明 |
| AC-EVID-004 | Gate results | `reports/runs/<run_id>/gate-results.md` | PR / main CI / release gate 结果完整 | release gate 缺失或关键 suite 无结论 |
| AC-EVID-005 | Redaction proof | `reports/runs/<run_id>/redaction-check.md` | artifact 和 report 均无 raw secret / raw body / forbidden body | redaction 缺失或命中红线 |
| AC-EVID-006 | Config and runtime evidence | `reports/runs/<run_id>/config-summary.md` | profile、runtime graph、secret ref、reload rejection 可复查 | profile 不明、raw secret 接受、runtime graph 不可复查 |
| AC-EVID-007 | Artifact layout | `reports/runs/<run_id>/artifact-index.md` + `artifacts/test/<run_id>` | 无 `<project>` 层级、无 `latest`、suite artifact 可达 | 使用非法路径、artifact 缺失或不可读 |
| AC-EVID-008 | Acceptance handoff | `reports/acceptance/<run_id>-index.md` + `handoff.md` | 已说明送验范围、commit、dependency snapshot、run_id、证据入口和非范围 | 缺 handoff 或未审查补充 |
| AC-EVID-009 | Veto checklist | `reports/acceptance/veto-checklist.md` | Step 11 的全部 VETO 均有结论和证据链接 | VETO 漏项或无证据 |
| AC-EVID-010 | Risk acceptance | `reports/acceptance/risk-acceptance.md` | 条件通过时所有 S2 / P1-risk 有 owner、期限、复验和接受记录 | 存在未关闭风险但无接受记录 |

### 7.2 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | 说明 run_id、commit、profile、范围和结果摘要 | 阻断进入验收 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 artifact | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | PR / CI / release gate 结果完整 | 不通过 |
| 覆盖矩阵 | `reports/runs/<run_id>/coverage-matrix.md` | P0 / P0-min AC / TC / EV 覆盖完整 | 覆盖缺失时不通过 |
| 配置摘要 | `reports/runs/<run_id>/config-summary.md` | profile 与 runtime graph 可复查 | 配置不明时不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | 无 raw secret / raw body / forbidden body | 一票否决候选 |
| artifact 索引 | `reports/runs/<run_id>/artifact-index.md` | 指向 `artifacts/test/<run_id>` 且链接可达 | 证据不可复查 |
| suite report | `reports/runs/<run_id>/suites/<suite>.md` | P0 suite 均有结论 | 对应门禁不可通过 |
| EV detail | `reports/runs/<run_id>/evidence/EV-BUS-<AREA>.md` | P0 EV 均有详情 | 对应门禁不可通过 |

### 7.3 Acceptance handoff 检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| 验收索引 | `reports/acceptance/<run_id>-index.md` | 汇总 run、报告、VETO、风险和签署入口 | 验收入口不完整 |
| 送验交接 | `reports/acceptance/handoff.md` | 已审查并说明送验范围、commit、依赖快照、profile、run_id、非范围 | 交接不完整,不得最终签署 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | VETO 全部有结论和证据链接 | 不通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人和后续动作 | 不得有条件通过 |
| 未关闭问题 | `reports/acceptance/open-issues.md` | S0/S1 为 0;S2 / P1-risk 有处理规则 | 不满足则不得通过或条件通过 |
| 审查记录 | `reports/review/agent-review.md` 或 `reviewer-notes.md` | 人或 Agent 审查补充关键交接材料 | 审查缺失时交接不完整 |

### 7.4 证据复查流

图类型: 证据复查流

图标题: L0-bus 验收证据从签署入口到 raw artifact 的复查链路

```text
reports/acceptance/<run_id>-index.md
  -> reports/acceptance/handoff.md
  -> reports/runs/<run_id>/summary.md
  -> reports/runs/<run_id>/gate-results.md
  -> reports/runs/<run_id>/evidence-index.md
       -> reports/runs/<run_id>/evidence/EV-BUS-<AREA>.md
       -> artifacts/test/<run_id>/suites/<suite>/report.json
       -> artifacts/test/<run_id>/suites/<suite>/stdout.log
       -> artifacts/test/<run_id>/suites/<suite>/stderr.log
```

关键说明:

- 验收入口必须从 `reports/acceptance` 开始,不能直接口头引用测试结果。
- 人类可读报告在 `reports/runs/<run_id>`,机器原始证据在 `artifacts/test/<run_id>`。
- `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>` 都不能作为正式验收引用。
- redaction 失败时,即使功能测试通过,也不得通过证据门禁。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_10_evidence_audit.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“证据门禁表”“Report 完整性检查表”“Acceptance handoff 检查表”和“证据复查流”小节,了解本章如何定义审计、观测和证据门禁。

本轮可观测性、审计与证据验收以 `AC-EVID-001`~`AC-EVID-010` 为裁决入口。关键状态变化、恢复动作、privileged read、publisher failure、projection failure 和 operations job 必须具备 audit、history 或 evidence record。log、metric、trace context ref 和 audit 不能互相替代。

正式验收必须从 `reports/acceptance/<run_id>-index.md` 进入,再读取 `reports/runs/<run_id>` 下的人类可读报告,最后通过 `evidence-index.md`、`artifact-index.md` 回指 `artifacts/test/<run_id>` 下的机器原始证据。正式验收不得引用 `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>`、“当前最新提交”或“本机当前状态”。

`reports/runs/<run_id>` 至少必须包含 summary、evidence-index、gate-results、coverage-matrix、config-summary、redaction-check、artifact-index、suite reports 和 P0 EV details。`reports/acceptance` 至少必须包含 `<run_id>-index.md`、`handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md`。其中 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 可以由脚本生成初稿,但必须经过人或 Agent 审查补充。

redaction-check 必须证明 artifacts 和 reports 均不含 payload body、raw secret、backend private body、governance decision body 或其他 forbidden body。redaction 缺失或命中红线时,不得通过证据门禁。

---

## 9. 待确认事项

当前没有阻塞进入 Step 11 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 缺失证据是否可用口头确认替代 | A. 可以;B. 不可以,必须补报告或 artifact;C. 内部确认可替代 | 采用 B | 验收必须可审计和可复验 |
| raw artifact 是否作为唯一验收入口 | A. 是;B. 否,report / acceptance 为入口并回链 artifact;C. 只看 summary | 采用 B | 兼顾人工审查和机器证据复查 |
| `reports/acceptance/*` 是否必须人或 Agent 审查 | A. 不需要;B. 必须;C. 只审查 handoff | 采用 B | 风险、否决和签署材料不能只依赖脚本初稿 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 必须具备 audit record 的行为已定义 | 已满足 |
| trace / log / metric / audit / evidence 的分工已定义 | 已满足 |
| 必须归档的测试报告和验收交接文件已定义 | 已满足 |
| 证据缺失对通过 / 条件通过 / 不通过的影响已定义 | 已满足 |
| 证据复查链路已定义 | 已满足 |
| evidence-index、gate-results、redaction-check、handoff、veto-checklist、risk-acceptance 的通过条件已定义 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 11,定义一票否决项。
