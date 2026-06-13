# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义可观测性、审计与证据门禁 |
| 当前状态 | 已完成;自动连续推进 |
| 输入基线 | `03-详细设计.md` §14;`04-配置设计.md` §8 / §10 / §12;`05-测试方案.md` §9 / §10 / §13;Step 5~9 中间产物 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_10_observability_evidence.md` |
| 停审方式 | 本轮按用户要求不停审连续推进;本文件保留独立停审记录 |

## 2. 本步目标

定义哪些 trace、audit、log、metric、artifact、report、evidence index 和 acceptance report 必须存在,以及证据缺失或伪造如何影响验收结论。

本 Step 只回答:

- 哪些行为必须有 audit / trace / report / marker。
- 哪些 run report 和 raw artifact 是 P0 验收前置。
- `EV-GOV-*` 如何从真实 suite artifact / report pair 推导,不得静态造证据。
- `reports/acceptance/*` 能做什么、不能做什么。
- evidence / report 门禁失败如何影响通过、有条件通过或不通过。

本 Step 不填写真实 EV 状态,不生成实际 `run_id`,不把 acceptance draft 写成已通过。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03-详细设计.md` §14 | 已完成 | 提供 safe log、metric、audit、trace 和 redaction 约束 |
| `04-配置设计.md` §8 / §10 / §12 | 已完成 | 提供 sensitive/no-output、config audit、downstream evidence 承接 |
| `05-测试方案.md` §9 | 已完成 | 提供 suite、gate、script、artifact/report 输出映射 |
| `05-测试方案.md` §13 | 已完成 | 提供正式 EV、evidence index 字段、acceptance report 和真实性审计 |
| Step 5~9 | 已完成 | 提供 AC / VETO 候选 / NFR 对证据的引用关系 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些行为必须有 audit record? | accepted command、accepted consumer marker、job marker/report、config validation failure、handoff/export preparation、outbox publication marker 必须有 audit/trace/report 或 safe marker。 |
| 哪些行为必须有 trace / log / metric? | public command/query/consumer/outbox/job、runtime builder、config validation、redaction scan、dependency scan、report generation 均需 safe log/metric/trace or report refs。 |
| 哪些测试报告必须归档? | blocking suite reports、redaction-check、dependency-boundary、report-audit、gate-summary、evidence-index、acceptance handoff/veto/risk/open issues 均需固定路径。 |
| 证据缺失是否导致不通过? | P0 EV、blocking suite raw artifact、report pair、redaction/dependency/report audit 缺失时不得通过;无法裁决时暂停验收。 |
| 证据如何被复查? | 从 `reports/runs/<run_id>/evidence-index.md` 回指 suite report,再回指 `artifacts/test/<run_id>/...` raw artifact 和 digest。 |
| evidence-index 是否覆盖全部 P0 EV? | 必须覆盖 `EV-GOV-CORE/CONTRACT/STATE/CMD/QUERY/CONSUMER/OUTBOX/JOB/IDEMP/CONFIG/REDACTION/ARCH/NFR/REPORT-001`。 |
| gate-results / gate-summary 是否覆盖全部 release gate? | 必须覆盖 release-main-smoke、release-config-redline、release-redaction-boundary、release-dependency-boundary、release-report-audit 和 selected P1 状态。 |
| redaction-check 是否证明 artifact 和 report 无 raw secret / raw body? | 必须覆盖 artifact root 和 report root,失败时不得忽略或改写 passed。 |
| handoff / veto / risk acceptance 是否已审查? | acceptance 报告可由脚本生成初稿,但正式裁决前必须人 / Agent 审查补充。 |
| 每个 P0 EV 是否能回指测试用例、suite artifact、report path 和验收项? | 必须能回指;否则为 orphan EV,触发 evidence gate failure。 |
| 是否存在静态造证据映射、orphan EV、report 缺失或 acceptance 初稿未经审查? | 本 Step 明确这些均为阻断项;正式执行时由 `EV-GOV-REPORT-001` 和 report-audit 证明。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 使用 API/DB/audit entry 泛证据,没有 run-scoped artifact/report/evidence index | 重建为固定 `reports/runs/<run_id>` + `artifacts/test/<run_id>` |
| 历史验收风险 | 静态 JSON 绑定 EV 或 VETO 默认 passed | 明确禁止;必须从 suite artifact/report 推导 |
| Step 5~9 | 多处引用 EV,但还未定义证据门禁 | 本 Step 固定 EV 索引、report 完整性和 acceptance handoff 规则 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| EV 来源 | 文档手写或静态表 | 从 raw artifact + suite report + digest 推导 | 防止伪证据 |
| VETO 清单 | 可默认 passed | 必须引用真实 EV / defect / report status | 防止无证据通过 |
| acceptance 报告 | 可当最终结论 | 只能作交接和审查材料,不能替代 raw artifact | 保持证据链 |
| redaction evidence | 单点报告 | artifact root + report root 全扫描 | 防止报告二次泄露 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| evidence index 是否可从静态 JSON 生成 | A. 可以;B. 不可以 | 采用 B。只能从真实 artifact/report pair 推导 |
| VETO checklist 是否可默认全部 passed | A. 可以;B. 不可以 | 采用 B。每项必须有 EV / defect / report 支撑 |
| failed suite 是否可删除 artifact 后重跑覆盖 | A. 可以;B. 不可以 | 采用 B。failed / partial / unavailable artifact 必须可审计 |
| acceptance handoff 是否可替代 raw artifact | A. 可以;B. 不可以 | 采用 B。handoff 只是审查入口 |

## 8. 结构化中间产物

### 8.1 证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-GOV-EV-001 | P0 evidence index | `reports/runs/<run_id>/evidence-index.md` | 覆盖全部 P0 `EV-GOV-*`,每项含 TC、AC、suite、artifact path、report path、digest、status、review status | 缺任一 P0 EV、orphan EV、使用 `latest`、无 artifact digest |
| AC-GOV-EV-002 | blocking suite artifacts | `artifacts/test/<run_id>/suites/<suite>/report.json` and cases | 每个 blocking suite 有符合 `05` raw artifact schema 的 raw report、case refs、status、failure reason、config profile、digest | suite report 缺 raw artifact、failed artifact 被删除、case refs 缺失或 schema/digest 不合法 |
| AC-GOV-EV-003 | human-readable run reports | `reports/runs/<run_id>/summary.md`;suite reports;`gate-summary.md` | report 从 raw artifact 生成,blocking/non-blocking 分类清楚,失败可审计 | report 手写补洞、把 failed 改 passed、缺 gate summary |
| AC-GOV-EV-004 | redaction check | `reports/runs/<run_id>/redaction-check.md` | artifact 和 report 均 clean;negative leak fixture safe failure | raw body/secret/full ref 泄露或 scan 范围不含 report |
| AC-GOV-EV-005 | dependency boundary check | `reports/runs/<run_id>/dependency-boundary.md` | 证明 only `L0-core` / core-contracts compile upstream | non-core sibling dependency 或 dependency graph 缺失 |
| AC-GOV-EV-006 | report audit / no static evidence | `reports/runs/<run_id>/report-audit.md` | artifact/report pairing、no static evidence、no orphan EV 全部通过 | evidence index 直接消费静态 JSON 或 acceptance default passed |
| AC-GOV-EV-007 | acceptance handoff | `reports/acceptance/handoff.md`;`open-issues.md` | 说明送验范围、基线、run_id、P0/P1/P2、失败/未覆盖项,并经人 / Agent 审查 | handoff 缺 run refs、未经审查或宣告 pass 替代正式结论 |
| AC-GOV-EV-008 | VETO checklist | `reports/acceptance/veto-checklist.md` | 每个 VETO 有来源、EV/report/defect 支撑和结论;无默认全 passed | VETO 缺证据、默认 passed、失败项被风险接受覆盖 |
| AC-GOV-EV-009 | risk acceptance | `reports/acceptance/risk-acceptance.md` | residual 有影响、接受理由、责任人、接受人、截止时间和触发条件 | 无接受人、接受 VETO/S 级缺陷、P1 unavailable 伪装 P0 pass |

### 8.2 P0 Evidence 追溯表

| Evidence ID | 测试用例 | suite artifact | report path | 验收项 / VETO | 缺失影响 |
|---|---|---|---|---|---|
| `EV-GOV-CORE-001` | representative TC-GOV-CMD/QUERY/OUTBOX/JOB/CONFIG/REDACTION | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | AC-GOV-001~005;VF-GOV-001 | 缺失则核心闭环不可裁决 |
| `EV-GOV-CONTRACT-001` | `TC-GOV-CONTRACT-001~004` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | AC-GOV-006~015 | 缺失则协议 / DTO 不可裁决 |
| `EV-GOV-STATE-001` | `TC-GOV-DOMAIN-*`;`TC-GOV-STATE-*` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | AC-GOV-016~021;AC-GOV-STATE-*;VF-GOV-005/006 | 缺失则状态机不可裁决 |
| `EV-GOV-CMD-001` | `TC-GOV-CMD-001~030` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | AC-GOV-001~021 | 缺失则 command 主链不可裁决 |
| `EV-GOV-QUERY-001` | `TC-GOV-QUERY-001~016` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | AC-GOV-014;AC-GOV-TX-003;VF-GOV-009 | 缺失则 query no-write 不可裁决 |
| `EV-GOV-CONSUMER-001` | `TC-GOV-CONSUMER-001~012` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | AC-GOV-SYNC-003;AC-GOV-TX-002 | 缺失则 inbound seam 不可裁决 |
| `EV-GOV-OUTBOX-001` | `TC-GOV-OUTBOX-001~015` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | AC-GOV-SYNC-004;AC-GOV-IDEMP-004 | 缺失则 outbox publish 不可裁决 |
| `EV-GOV-JOB-001` | `TC-GOV-JOB-001~010` | `artifacts/test/<run_id>/suites/operations-replay-core/`;`entry-worker-job/` | suite reports | AC-GOV-015;AC-GOV-TX-002;VF-GOV-009 | 缺失则 operations job 不可裁决 |
| `EV-GOV-IDEMP-001` | `TC-GOV-IDEMP-001~013` | `artifacts/test/<run_id>/suites/infra-runtime-fake/`;`operations-replay-core/` | suite reports | AC-GOV-IDEMP-* | 缺失则 duplicate/replay 不可裁决 |
| `EV-GOV-CONFIG-001` | `TC-GOV-CONFIG-001~008` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | AC-GOV-NFR-004 | 缺失则 config gate 不可裁决 |
| `EV-GOV-REDACTION-001` | `TC-GOV-REDACTION-001~004` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | AC-GOV-025;AC-GOV-NFR-003;VF-GOV-003/007 | 缺失或 failed 则阻断 |
| `EV-GOV-ARCH-001` | `TC-GOV-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | AC-GOV-019;AC-GOV-NFR-005;VF-GOV-010 | 缺失或 failed 则阻断 |
| `EV-GOV-NFR-001` | `TC-GOV-NFR-*`;config/replay representative cases | `artifacts/test/<run_id>/suites/<suite>/` | release / operations / redaction suite reports | AC-GOV-NFR-001~007 | 缺失则非功能不可裁决 |
| `EV-GOV-REPORT-001` | `TC-GOV-REPORT-001~004` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | AC-GOV-EV-*;evidence integrity VETO | 缺失或 failed 则阻断 |

### 8.3 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 artifact | 不通过或送验不成立 |
| 门禁结果 | `reports/runs/<run_id>/gate-summary.md` | release gate 结果完整 | 不通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | 无 raw secret / raw body | 一票否决 |
| 依赖边界 | `reports/runs/<run_id>/dependency-boundary.md` | only core compile upstream | 一票否决 |
| 报告审计 | `reports/runs/<run_id>/report-audit.md` | no orphan EV / no static evidence / artifact pairing | 不通过 |
| 验收交接 | `reports/acceptance/handoff.md` | 已审查并说明送验范围 | 交接不完整 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | VETO 全部有证据结论 | 不通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每项风险有接受人和后续动作 | 不得有条件通过 |

### 8.4 证据门禁停审记录

| Evidence / Report | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `EV-GOV-*` | 是否可回指 TC / AC / suite / artifact / report | 通过 | 正式执行时必须由 evidence index 证明 |
| `reports/runs/<run_id>/evidence-index.md` | 是否禁止静态 JSON 造 EV | 通过 | `EV-GOV-REPORT-001` 必须检查 generated_from |
| `reports/acceptance/veto-checklist.md` | 是否禁止默认全 passed | 通过 | 每项 VETO 必须有 evidence / defect / report status |
| `reports/acceptance/risk-acceptance.md` | 是否禁止接受 VETO/S 级缺陷 | 通过 | Step 13 继续加严 |
| redaction/dependency/report audit | 是否作为硬门禁 | 通过 | failed 不得风险接受 |

### 8.5 跨证据裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| orphan EV | 已禁止 | 由 report-audit 检查 |
| 静态造证据映射 | 已禁止 | evidence index 必须由 artifact/report pair 推导 |
| 缺 report / 缺 raw artifact | 已禁止 | blocking suite 必须 pair |
| acceptance 初稿未经审查 | 已禁止作为最终证据 | handoff/veto/risk 必须审查 |
| failed suite 被改写 passed | 已禁止 | failed artifact/report 必须保留 |
| redaction 缺口 | 已硬化 | redaction failed 进入 VETO |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“证据门禁表”“P0 Evidence 追溯表”“Report 完整性检查表”“证据门禁停审记录”和“跨证据裁决审计表”小节,了解可观测性、审计与证据门禁如何从测试证据、report 结构和验收裁决口径收敛。

正式 `06-验收标准.md` §10 应回填:

- P0 证据必须固定到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>`;不得引用 `latest`。
- `EV-GOV-*` 必须从 suite raw artifact、suite report、case refs、digest 和 generated_from 推导,不得由静态 JSON 或手写表宣告覆盖。
- `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 只能作为验收交接和审查入口,不得替代 raw artifact。
- redaction、dependency boundary、report audit 和 evidence index 失败时不得通过。
- VETO checklist 不得默认全 passed;每项必须有真实 EV、defect 或 report status 支撑。

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
