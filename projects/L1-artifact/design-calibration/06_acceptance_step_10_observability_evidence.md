# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_10_observability_evidence.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义可观测性、审计与证据门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 9 `定义非功能验收门禁`;`03-详细设计.md` §14;`03_ddd_step_15_observability_audit.md`;`04-配置设计.md` §8 / §10 / §12;`05-测试方案.md` §9 / §13 / §14 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_10_observability_evidence.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 的可观测性、审计与证据门禁,把 trace、audit、log、metric、artifact、report、evidence index、acceptance handoff 和 review notes 收口为可裁决的正式验收项。

本 Step 只回答:

- 哪些 accepted truth change、boundary audit、config validation、redaction scan、dependency scan、report generation 和 evidence index generation 必须留痕。
- 哪些 raw artifact、suite report、gate summary、redaction-check、dependency-boundary、report-audit、handoff、open issues、veto checklist 和 risk acceptance 必须归档。
- `EV-CAND-ART-*` 如何从真实 suite artifact / report pair 推导,不得静态造证据。
- `reports/acceptance/*` 和 `reports/review/*` 各自能做什么、不能做什么。
- 哪些证据缺失、伪造或被手写 passed 会直接影响验收结论。

本 Step 不填写真实执行结果,不生成真实 `run_id`,不发明 `EV-ART-*` / `AC-ART-*` alias,也不把 acceptance draft 写成最终通过。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供性能 / 安全 / 配置 / 依赖 / 恢复 / 观测 / 证据非功能门禁前提 |
| `03-详细设计.md` §14 | 已完成 | 提供日志、指标、审计、trace、marker、report 和 redaction 的埋点边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 runtime log / metric / audit / trace 的详细设计切口 |
| `04-配置设计.md` §8 / §10 / §12 | 已完成 | 提供敏感信息、变更审计、下游承接和 fail-fast / degraded 边界 |
| `05-测试方案.md` §9 / §13 / §14 | 已完成 | 提供 suite / gate / artifact root / report root / evidence / regression / residual 输入 |
| `05_test_plan_step_13_evidence.md` | 已完成 | 提供 candidate evidence 归档结构、report 结构和真实性审计规则 |
| `05_test_plan_step_14_regression_risks.md` | 已完成 | 提供回归 run 与 residual risk 的归档口径 |
| `projects/L1-governance/design-calibration/06_acceptance_step_10_observability_evidence.md` | 已读取 | 仅作为结构和粒度参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些行为必须有 audit / trace / report? | 所有 accepted truth change、boundary audit、config validation reject、redaction scan、dependency scan、report generation、evidence index generation、handoff preparation、open issues draft、veto checklist draft 和 risk acceptance draft 都必须有可追溯记录。 |
| 哪些测试报告必须归档? | blocking suite reports、`gate-summary.md`、`evidence-index.md`、`redaction-check.md`、`dependency-boundary.md`、`report-audit.md`、`reports/acceptance/handoff.md`、`reports/acceptance/open-issues.md`、`reports/acceptance/veto-checklist.md` 和 `reports/acceptance/risk-acceptance.md` 都必须归档。 |
| `EV-CAND-ART-*` 如何被证明真实? | 只能由 `artifacts/test/<run_id>` 下的 raw artifact、`reports/runs/<run_id>` 下的 suite / gate / audit report 以及 `generated_from` 字段推导,不得由静态 JSON、手写表或默认 passed 生成。 |
| evidence 缺失或被伪造时如何裁决? | P0 evidence 缺失、orphan EV、缺 raw artifact、report / artifact pairing 失败、redaction / dependency / report audit 失败,都不得通过;若影响 `VF-ART-*`,不得风险接受。 |
| `reports/acceptance/*` 能否替代 raw artifact? | 不能。它们只允许作为送验交接和审查材料,不得替代 raw artifact、suite report 或 evidence index。 |
| `PublishPendingArtifactRelays` 如何归档? | 必须作为独立 candidate evidence family 归档,并同时能从 `entry-worker-job` 与 `operations-replay-core` 两层回指,不得并入 6 个 public jobs 证据统计。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 使用 API / DB / audit entry 泛证据,没有 run-scoped artifact / report / evidence index | 重建为 `reports/runs/<run_id>` + `artifacts/test/<run_id>` |
| Step 9 `非功能验收门禁` | 已有 redaction / dependency / observability / evidence integrity,但没有验收裁决落点 | 本 Step 固定 evidence gate 和 report gate |
| `05_test_plan_step_13_evidence.md` | 已定义归档结构,但未把 acceptance handoff / veto / risk / open issues 升格为验收门禁 | 本 Step 把 acceptance supporting docs 纳入门禁 |
| `05_test_plan_step_14_regression_risks.md` | 已定义 residual,但未说明回归 run 的证据门禁 | 本 Step 把回归 run 也纳入证据审计 |
| `03_ddd_step_15_observability_audit.md` | 已有 runtime 埋点,但未收口到验收标准 | 本 Step 区分运行观测和验收证据 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| EV 来源 | 静态 JSON 或手写映射 | raw artifact + suite report + digest + generated_from 推导 | 防止伪证据 |
| acceptance 报告 | 可被误当最终结论 | 只作为交接 / 审查入口 | 保持原始证据链 |
| VETO 清单 | 可默认 passed | 每项都必须回指真实 EV / defect / report status | 防止无证据通过 |
| report audit | 只看报告存在 | 固定 artifact/report pairing 和 no-static-evidence | 防止静态造证据 |
| relay evidence | 容易并入 public jobs | 单列独立 candidate evidence family | 防止统计与裁决错位 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| evidence index 是否可由静态 JSON 直接落盘 | A. 可以;B. 不可以 | 采用 B。必须从 raw artifact / report pair 推导 |
| VETO checklist 是否可默认全部 passed | A. 可以;B. 不可以 | 采用 B。每项 VETO 必须有真实证据 |
| failed suite 是否可删除 raw artifact 后只留报告 | A. 可以;B. 不可以 | 采用 B。失败证据必须可审计 |
| acceptance handoff 是否可替代 raw artifact | A. 可以;B. 不可以 | 采用 B。handoff 只是审查入口 |
| `PublishPendingArtifactRelays` 是否合并进 6 个 public jobs | A. 可以;B. 不可以 | 采用 B。它是独立 internal facade 证据链 |

## 8. 结构化中间产物

### 8.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-ART-050 | P0 evidence index | `reports/runs/<run_id>/evidence-index.md` | 覆盖全部 P0 `EV-CAND-ART-*`,每项含 TC、suite、artifact path、report path、digest、status、review status | 缺任一 P0 EV、orphan EV、使用 `latest`、无 artifact digest |
| AC-ART-051 | blocking suite artifacts | `artifacts/test/<run_id>/suites/<suite>/report.json` 与 case JSON | 每个 blocking suite 有符合 `05` raw artifact schema 的 report、case refs、status、failure reason、config profile、digest | suite report 缺 raw artifact、failed artifact 被删除、case refs 缺失或 schema / digest 不合法 |
| AC-ART-052 | human-readable run reports | `reports/runs/<run_id>/summary.md`;`gate-summary.md`;suite reports | report 从 raw artifact 生成,blocking / non-blocking 分类清楚,失败可审计 | report 手写补洞、把 failed 改 passed、缺 gate summary |
| AC-ART-053 | redaction check | `reports/runs/<run_id>/redaction-check.md` | artifact 和 report 均 clean;negative leak fixture safe failure | raw body / secret / full ref 泄露或 scan 范围不含 report |
| AC-ART-054 | dependency boundary check | `reports/runs/<run_id>/dependency-boundary.md` | 证明 only `L0-core` / `core-contracts` compile upstream | non-core sibling dependency 或 dependency graph 缺失 |
| AC-ART-055 | report audit / no static evidence | `reports/runs/<run_id>/report-audit.md` | artifact / report pairing、no static evidence、no orphan EV 全部通过 | evidence index 直接消费静态 JSON 或 acceptance default passed |
| AC-ART-056 | acceptance handoff / open issues | `reports/acceptance/handoff.md`;`reports/acceptance/open-issues.md` | 说明送验范围、基线、run_id、P0/P1/P2、失败 / 未覆盖项,并经人 / Agent 审查 | handoff 缺 run refs、未经审查或宣告 pass 替代正式结论 |
| AC-ART-057 | VETO checklist | `reports/acceptance/veto-checklist.md` | 每个 `VF-ART-*` 有来源、EV / report / defect 支撑和结论;无默认全 passed | VETO 缺证据、默认 passed、失败项被风险接受覆盖 |
| AC-ART-058 | risk acceptance | `reports/acceptance/risk-acceptance.md` | residual 有影响、接受理由、责任人、接受人、截止时间和触发条件 | 无接受人、接受 VETO / S 级缺陷、P1 unavailable 伪装 P0 pass |

### 8.2 P0 Evidence 追溯表

| Evidence ID | 测试用例 | suite artifact | report path | 验收项 / VETO | 缺失影响 |
|---|---|---|---|---|---|
| `EV-CAND-ART-CORE-001` | representative `TC-ART-CMD-*` / `TC-ART-QUERY-*` / `TC-ART-OUTBOX-*` / `TC-ART-JOB-*` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | `14.1`;`VF-ART-001` | 缺失则核心闭环不可裁决 |
| `EV-CAND-ART-CONTRACT-001` | `TC-ART-CONTRACT-001~004` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `14.2`;`14.3` | 缺失则协议 / DTO 不可裁决 |
| `EV-CAND-ART-STATE-001` | `TC-ART-STATE-001~003` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | `14.2`;`14.3`;`VF-ART-003` | 缺失则状态机不可裁决 |
| `EV-CAND-ART-CMD-001` | `TC-ART-CMD-001~016` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `14.1`;`14.2`;`14.3` | 缺失则 command 主链不可裁决 |
| `EV-CAND-ART-QUERY-001` | `TC-ART-QUERY-001~013`;`TC-ART-IDEMP-006` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | `14.2`;`14.4`;`VF-ART-004` | 缺失则 query no-write 不可裁决 |
| `EV-CAND-ART-CONSUMER-001` | `TC-ART-CONSUMER-001~006` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | `14.2`;`14.4`;`14.5` | 缺失则 inbound seam 不可裁决 |
| `EV-CAND-ART-OUTBOX-001` | `TC-ART-OUTBOX-001~008` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `14.3`;`14.4`;`14.5` | 缺失则 outbox publish 不可裁决 |
| `EV-CAND-ART-RELAY-001` | `TC-ART-RELAY-001` | `artifacts/test/<run_id>/suites/entry-worker-job/`;`artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | `14.3`;`14.5`;`VF-ART-004` | 缺失则 relay facade 不可裁决 |
| `EV-CAND-ART-JOB-001` | `TC-ART-JOB-001~006`;`TC-ART-IDEMP-007` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | `14.3`;`14.5`;`VF-ART-004` | 缺失则 maintenance / replay job 不可裁决 |
| `EV-CAND-ART-IDEMP-001` | `TC-ART-IDEMP-001~007` | `artifacts/test/<run_id>/suites/infra-runtime-fake/`;`artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | `14.3`;`14.5`;`VF-ART-003`;`VF-ART-004` | 缺失则 duplicate / commit unknown 不可裁决 |
| `EV-CAND-ART-CONFIG-001` | `TC-ART-CONFIG-001~004` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | `14.3`;`14.5` | 缺失则 config gate 不可裁决 |
| `EV-CAND-ART-REDACTION-001` | `TC-ART-REDACTION-001~002` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | `14.4`;`14.5`;`VF-ART-002` | 缺失或 failed 则阻断 |
| `EV-CAND-ART-ARCH-001` | `TC-ART-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | `14.5` | 缺失或 failed 则阻断 |
| `EV-CAND-ART-HANDOFF-001` | `TC-ART-JOB-*`;`TC-ART-RELAY-001`;`TC-ART-REPORT-001~004` | `artifacts/test/<run_id>/suites/operations-replay-core/`;`artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/acceptance/handoff.md`;`reports/acceptance/open-issues.md` | `14.5` | 缺失 run refs、未审查或手写 pass 则不通过 |
| `EV-CAND-ART-REPORT-001` | cross-suite aggregate | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | supports all `14.1~14.5` 和 `VF-ART-*` 真实性 | 缺失或 failed 则阻断 |

### 8.3 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 artifact | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-summary.md` | release gate 结果完整 | 不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | 无 raw secret / raw body | 一票否决 |
| 依赖边界 | `reports/runs/<run_id>/dependency-boundary.md` | only core compile upstream | 一票否决 |
| 报告审计 | `reports/runs/<run_id>/report-audit.md` | no orphan EV / no static evidence / artifact pairing | 不通过 |
| 验收交接 | `reports/acceptance/handoff.md` | 已审查并说明送验范围 | 交接不完整 |
| 未解决问题 | `reports/acceptance/open-issues.md` | 失败 / 未覆盖项已列明 | 交接缺口 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | `VF-ART-*` 全部有证据结论 | 不通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人和后续动作 | 不得有条件通过 |

### 8.4 证据门禁停审记录

| Evidence / Report | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `EV-CAND-ART-*` | 是否可回指 TC / suite / artifact / report | 通过 | 正式执行时必须由 evidence index 证明 |
| `reports/runs/<run_id>/evidence-index.md` | 是否禁止静态 JSON 造 EV | 通过 | `generated_from` 必须可审计 |
| `reports/acceptance/handoff.md` / `open-issues.md` | 是否只作为审查入口 | 通过 | 不得替代 raw artifact |
| `reports/acceptance/veto-checklist.md` | 是否禁止默认全 passed | 通过 | 每项 VETO 必须有 evidence / defect / report status |
| `reports/acceptance/risk-acceptance.md` | 是否禁止接受 VETO / S 级缺陷 | 通过 | residual 只能接受 P1 / P2 或未来项 |
| redaction / dependency / report audit | 是否作为硬门禁 | 通过 | failed 不得风险接受 |

### 8.5 跨证据裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| orphan EV | 已禁止 | 由 report-audit 检查 |
| 静态造证据映射 | 已禁止 | evidence index 必须由 artifact / report pair 推导 |
| 缺 report / 缺 raw artifact | 已禁止 | blocking suite 必须 pair |
| acceptance 初稿未经审查 | 已禁止作为最终证据 | handoff / open issues / veto / risk 必须审查 |
| failed suite 被改写 passed | 已禁止 | failed artifact / report 必须保留 |
| redaction 缺口 | 已硬化 | redaction failed 进入 VETO |
| relay 证据混入 public jobs | 已禁止 | `PublishPendingArtifactRelays` 保持独立 evidence family |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“证据门禁表”“P0 Evidence 追溯表”“Report 完整性检查表”“证据门禁停审记录”和“跨证据裁决审计表”小节,了解可观测性、审计与证据门禁如何从测试证据、report 结构和验收裁决口径收敛。

正式 `06-验收标准.md` §10 应回填:

- P0 证据必须固定到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>`;不得引用 `latest`。
- `EV-CAND-ART-*` 必须从 suite raw artifact、suite report、case refs、digest 和 `generated_from` 推导,不得由静态 JSON 或手写表宣告覆盖。
- `reports/acceptance/handoff.md`、`open-issues.md`、`veto-checklist.md` 和 `risk-acceptance.md` 只能作为验收交接和审查入口,不得替代 raw artifact。
- redaction、dependency boundary、report audit 和 evidence index 失败时不得通过。
- VETO checklist 不得默认全 passed;每项必须有真实 EV、defect 或 report status 支撑。
- `PublishPendingArtifactRelays` 必须继续作为独立 internal relay evidence family,不得并入 6 个 public jobs。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓实际 report script 名称是否与测试方案一致 | 影响验收执行路径 | 本 Step 固定语义和路径,具体脚本实现由实施仓对齐 |
| evidence retention 天数 | 影响长期审计 | 当前只要求验收期间可追溯,Step 13 记录 residual |
| acceptance review 由谁签署 | 影响最终结论 | Step 14 固定签署口径 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 证据门禁完整 | 通过 | 见 §8.1 / §8.2 |
| 证据门禁已停审 | 通过 | 见 §8.4 |
| 跨证据裁决审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 11 | 通过 | 下一步定义一票否决项 |
