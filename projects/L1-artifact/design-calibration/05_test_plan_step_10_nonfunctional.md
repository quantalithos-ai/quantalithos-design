# Step 10. 设计专项测试与非功能验证

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节: `05-测试方案.md` §10 专项测试与非功能验证

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 设计专项测试与非功能验证 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `00` 非功能需求与一票否决;Step 5 追溯矩阵;Step 6 用例;Step 8 环境;Step 9 自动化门禁;`03` 事务 / 错误 / 并发 / 观测;`04` 失效与 handoff 约束 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_10_nonfunctional.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 11 |

## 2. 本步目标

定义 Artifact 的专项测试与非功能验证主轴,重点收束 truth ownership、跨仓消费边界、正文与 redaction、安全与依赖边界、一致性与恢复、可观测性与审计,并说明哪些非功能只能做结构性验证或采样,哪些必须成为 P0 阻断门禁。

本 Step 只回答:

- 哪些 `NFR-ART-CAP-*`、`NFR-ART-GLOB-*` 和 `VF-ART-*` 必须进入专项验证。
- 哪些专项属于 truth ownership / cross-repo consumption / body-free / no-write / no-truth-repair 红线。
- 哪些性能、可用性、安全、恢复、审计和观测项必须自动化,哪些只能做 sample / trend。
- 哪些故障注入、replay、partial failure、duplicate replay 和 boundary negative cases 必须保留为 P0。
- 哪些 artifact / report / scan 可作为专项候选证据输入。

本 Step 不定义正式验收裁决,不把旧 P95 / P99 / SLA / 审计覆盖率数字固化为 P0 硬门槛,不要求真实 DB、真实 bus、真实 archive/observability/sync 产品,也不生成正式 evidence ID。正式 evidence index 和 acceptance handoff 留给 Step 13 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §13 / §14 | 正式输入 | 提供 `NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、第 14 章五类验收方向和 `VF-ART-001~004` |
| `05_test_plan_step_05_traceability_coverage.md` | 已完成 | 提供 `FR-ART` / `BR-ART` / `NFR-ART` / `VF-ART` 到测试切口的正式追溯 |
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 `TC-ART-*` 用例矩阵,尤其是 no-write、no-truth-repair、redaction、dependency、handoff 和 replay 用例 |
| `05_test_plan_step_08_environment_config.md` | 已完成 | 提供四个 P0 profile、compile/runtime/event/handoff/replay 协作边界与 unavailable 处理 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 suites、blocking gates、artifact/report 根目录和 `PublishPendingArtifactRelays` 独立门禁 |
| `03_ddd_step_12_error_recovery.md` | 正式输入 | 提供 commit unknown、rollback failure、dependency unavailable、unsupported version 和 marker/report 语义 |
| `03_ddd_step_13_concurrency_idempotency.md` | 正式输入 | 提供 duplicate replay、same-key conflict、race、stored result missing 和 recovery 约束 |
| `03_ddd_step_14_config_external_binding.md` | 正式输入 | 提供唯一 compile-time upstream、fake/controlled seam、禁止配置化边界和 cross-repo dependency 纪律 |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 logs、metrics、audit、trace、handoff、redaction 和 forbidden-field 边界 |
| `03_ddd_step_16_test_cuts.md` | 正式输入 | 提供专项测试的最小验证入口和脚本契约 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 config gate、replay、redaction 和 release handoff 承接口径 |
| `projects/L1-governance/design-calibration/05_test_plan_step_10_nonfunctional.md` | 已读取 | 只作为 Step 10 粒度框架参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前 Step 必须承接哪些非功能主轴? | 必须承接 truth ownership、单一 Artifact truth、cross-repo consumption boundary、外部正文不归属、依赖降级不伪造 truth、变化协作不承载 truth、跨能力变化可追溯、边界异常可识别、config fail-fast、redaction、安全输出、replay / recovery 和 dependency boundary。 |
| 哪些专项必须成为 P0 blocking? | truth ownership / consumption boundary、security / redaction、idempotency / consistency、recovery / no-truth-repair、config fail-fast、dependency boundary 和 observability red lines 都必须 blocking。 |
| 性能当前如何验证? | 只做结构性性能验证和 duration/count sample:fact establish、version publish、read surface query、relay publication 和 maintenance jobs 必须在 fake/controlled/replay profiles 下可运行且不依赖 P1/P2 能力。旧 P95 / P99 / SLA / 可用率数字没有当前正式来源,不能成为 P0 pass 阈值。 |
| truth ownership 如何专项化测试? | 必须验证 formal truth 只来自 Artifact fact/version/lineage/baseline/consumable/backref 主链;query、preview、report、outbox payload、archive/observability/sync handoff、consumer snapshot 和 downstream private copy 都不能变成第二份 truth。 |
| cross-repo consumption 边界如何验证? | 必须验证 consumable ref / backref、read surface、trace、handoff 和 outbound event 只输出 formal refs / safe summaries / markers,且 work、process、governance、method-library、runtime、archive、observability、sync 等仓都不能反写 Artifact truth。 |
| 哪些恢复场景必须 fault injection? | version conflict、unique conflict、UoW begin/commit/rollback failure、commit unknown、stored result missing、outbox append failure、relay publish retryable / terminal failure、reference unresolved / failed、projection rebuild race、handoff target disabled 和 replay root invalid 都必须保留 fault injection。 |
| 哪些观测 / 审计证据必须存在? | accepted truth change 必须有 trace/audit/history/outbox/result;rejected / unsupported / delayed / failed path 必须有 safe log/metric/receipt/report/marker;redaction report、dependency report、gate summary、report audit 和 replay report 都必须可回指真实 raw artifact。 |
| 哪些内容不是当前 P0? | staging-like / production-like、真实产品依赖、容量基线、硬性能阈值、真实 observability backend 行为、真实 archive/sync provider SLA 和完整跨仓 E2E 不属于当前 P0。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `00` §13 | 明确禁止固化无来源 P95 / SLA,但尚未转成测试口径 | 本 Step 固定“结构性性能 sample,不设硬阈值” |
| Step 5 | 已有 `NFR-ART` / `VF-ART` 追溯,但还没有专项矩阵 | 本 Step 形成专项风险-方法-环境-证据矩阵 |
| Step 6 | 已有 redaction / config / idempotency / no-write / no-truth-repair 用例,但尚未按专项聚合 | 本 Step 聚合成专项验证主轴 |
| Step 8 | 已有四个 P0 profile,但各专项使用边界未完全显式化 | 本 Step 固定 profile 到专项的归属 |
| Step 9 | suites 已闭口,但还缺“每个 suite 证明哪类 NFR / veto”的专项视图 | 本 Step 增加专项到 suite 的反向映射 |
| `03` Step 15 | 可观测性字段边界已清楚,但测试方案还缺“必须留证什么” | 本 Step 固定专项观测 / 审计证据矩阵 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 非功能主轴 | 散落在需求、用例和 gate 中 | 汇总为 truth ownership / boundary / redaction / recovery / observability 专项矩阵 | 便于后续证据与验收承接 |
| 性能 | 只有“旧数字不能硬化”的口径 | 明确只做结构性 sample / trend | 避免写入无来源硬阈值 |
| cross-repo consumption | 只在 `FR-ART-017~020`、`BR-ART-021~025` 中出现 | 升级为专项测试主轴 | 这是 Artifact 的核心差异点 |
| 恢复 / maintenance | 只在 replay / job / idempotency 用例中出现 | 形成 fault injection 矩阵 | 实施侧更容易落自动化 |
| 观测 / 审计 | 只知道要 scan / report | 明确哪些 raw artifact / reports 必须存在 | 支撑 Step 13 归档 |

## 7. 专项测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把旧性能数字当作 P0 阈值 | A. 继承旧 P95 / SLA;B. 只做结构性 sample / trend | 采用 B。`NFR-ART-GLOB-012` 已明确无来源硬指标不固化。 |
| truth ownership 是否只靠 release smoke 证明 | A. 只靠 release smoke;B. 在 command/query/consumer/outbox/handoff/replay 多层共同证明 | 采用 B。单一 smoke 很难证明“不发生第二份 truth”。 |
| redaction 是否只扫 reports | A. 只扫 report;B. 同时扫 raw artifacts、stdout/stderr 和 report | 采用 B。泄漏可能先发生在 raw artifact。 |
| 恢复是否依赖真实产品演练 | A. 真实产品;B. fake / controlled / replay-backed fault injection | 采用 B。P0 证明语义和恢复口径,不是产品 SLA。 |
| observability 是否把 query 审计也写成业务记录 | A. query 也追加 audit;B. query 只保留 log/metric,no-write 不破 | 采用 B。与 Step 9 query no-write 保持一致。 |

## 8. 结构化中间产物

### 8.1 专项测试总矩阵

| 专项 | 风险 / 目标 | 方法 | 环境 | 通过条件 | 候选证据族 |
|---|---|---|---|---|---|
| truth ownership | formal truth 被 preview/report/event/handoff/private copy 替代 | command/query/consumer/outbox/handoff negative + write-audit | `ci-test`;`integration-like`;release smoke | 只有 formal fact/version/lineage/baseline/consumable/backref 主链能成立 truth | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-HANDOFF-*` |
| cross-repo consumption boundary | 下游复制或反写 Artifact truth | consumable ref / backref / read surface / sync-handoff / archive-handoff / observability-handoff tests | `ci-test`;`integration-like`;`operations-replay` | 下游只能消费 formal refs / safe summaries / markers,不能迁移 ownership | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-HANDOFF-*` |
| 性能结构性验证 | 核心 truth 主链被外围增强阻断 | duration/count sample + release smoke chain | `ci-test`;release gate;`operations-replay` | 产出 sample 且不依赖 P1/P2 能力;无 numeric fail threshold | `EV-CAND-ART-CMD-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` |
| 可用性 / 降级 | dependency unavailable 时伪造 truth 或伪造 pass | controlled unavailable / degraded / delayed injection | `integration-like`;`operations-replay` | 只产生 formal delayed/degraded/failed marker;core truth unchanged | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*` |
| 安全 / body-free / redaction | raw body、secret、external response、private copy 入仓或输出 | forbidden body negatives + redaction scan | `ci-test`;main;release | redaction clean;negative leak fixture 必须 fail | `EV-CAND-ART-REDACTION-*` |
| 审计 / traceability | accepted truth change 不可追溯或 rejected path 伪装 accepted | trace/audit/history/outbox/result assertions + trace query | `ci-test`;release smoke | accepted path has trace/audit/outbox/result;rejected path no success trace | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-HANDOFF-*` |
| 幂等 / 一致性 / 并发 | duplicate replay 分叉、missing result 重算、race 覆盖新状态 | fake idempotency/UoW/repository fault injection | `ci-test`;`operations-replay`;nightly | duplicate replays stored result;missing result is defect;no second truth write | `EV-CAND-ART-IDEMP-*` |
| 恢复 / maintenance | publish/rebuild/refresh/reconcile/handoff partial failure 不可见或修 truth | replay + partial failure + report assertions | `operations-replay`;nightly | failures visible by marker/report;maintenance no-truth-repair | `EV-CAND-ART-JOB-*`;`EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-HANDOFF-*` |
| 可观测性 | 关键变更 / 错误 / 降级不可诊断或标签越界 | logs/metrics/audit/report scan | main;release | safe log/metric/audit fields present;labels low-cardinality | `EV-CAND-ART-REDACTION-*`;`EV-CAND-ART-QUERY-*`;`EV-CAND-ART-JOB-*` |
| 配置与依赖边界 | invalid config silent fallback / non-core sibling compile dependency | config-redline + dependency-boundary + startup builder checks | PR;main;release | invalid config fail-fast;compile-time upstream only `core-contracts` | `EV-CAND-ART-CONFIG-*`;`EV-CAND-ART-ARCH-*` |

### 8.2 真相归属与跨仓消费边界专项表

| 红线 | 负向输入 | 断言 | Suite / Gate | 候选证据族 |
|---|---|---|---|---|
| `NFR-ART-GLOB-001/002` 单一 Artifact truth | preview / report / trace / event 结果被当成 truth source | query/read surface只读 formal truth,不反推 truth | `service-flow-fast`;`release-main-smoke` | `EV-CAND-ART-QUERY-*` |
| `VF-ART-004` 下游反写 truth | read surface query、rebuild job、reconcile job、handoff job 触发 truth write | write-audit clean;core truth store unchanged | `operations-replay-core` | `EV-CAND-ART-IDEMP-007`;`EV-CAND-ART-JOB-*` |
| `BR-ART-021~025` 消费边界 | wrong consumer / wrong consumable / private copy 回写 | `RecordArtifactConsumptionBackref` 只追加 traceability,不改 truth anchor | `service-flow-fast` | `EV-CAND-ART-CMD-016` |
| `FR-ART-017~020` 稳定引用表达 | read surface / consumable selector 混乱 | only formal consumable or truth-anchor selector accepted;both/none rejected | `service-flow-fast` | `EV-CAND-ART-CMD-015`;`EV-CAND-ART-QUERY-007` |
| archive handoff 不迁移 ownership | archive package / material 试图成为 Artifact truth | no package body stored;trace refs mandatory | `operations-replay-core`;release | `EV-CAND-ART-JOB-004`;`EV-CAND-ART-HANDOFF-*` |
| observability handoff 不迁移 ownership | observability private body / trace body 回写 | only safe refs / markers emitted;no observability body dump | `operations-replay-core`;release | `EV-CAND-ART-JOB-005`;`EV-CAND-ART-HANDOFF-*` |
| sync handoff 不迁移 ownership | sync private copy 回写 | sync material only references formal read surface;truth unchanged | `operations-replay-core`;release | `EV-CAND-ART-JOB-006`;`EV-CAND-ART-HANDOFF-*` |
| non-core sibling compile dependency | work/process/governance/runtime/archive/observability/sync 等进入 Cargo dependency | dependency check fails | `dependency-boundary` | `EV-CAND-ART-ARCH-001` |

### 8.3 性能 / 可用性专项口径表

| 项 | 当前口径 | 测试方式 | 是否 P0 硬阈值 |
|---|---|---|---|
| fact establish / version publish / lineage / baseline 主链 | 不应被外围增强阻断 | `service-flow-fast` 与 `release-main-smoke` 记录 duration/count sample | 否 |
| read surface / trace / report query | 不应依赖 preview/report/archive/observability 私有状态 | query duration sample + degraded/no-write assertions | 否 |
| replay / maintenance job | 必须可完成并产出 report / marker | `operations-replay-core` 记录 item count、duration、partial failure | 否 |
| controlled unavailable | 不伪造 pass / truth | `integration-like` 验 delayed/degraded/failed marker | 是,以语义断言阻断 |
| 旧 P95 / P99 / SLA / 可用率候选 | 仅历史候选目标 | 只作为 sample/trend 留痕,不判 fail | 否 |

### 8.4 安全 / 正文边界 / redaction 专项表

| 红线 | 负向输入 | 断言 | Suite / Gate | 候选证据族 |
|---|---|---|---|---|
| `VF-ART-002` 外部正文进入 truth | external content body / runtime output body / method definition body | body rejected or body-free snapshot only | `redaction-boundary`;`service-flow-fast` | `EV-CAND-ART-REDACTION-*`;`EV-CAND-ART-CONSUMER-*` |
| logs / audit / reports 泄漏 | raw body / adapter response / secret / credential / full sensitive ref | scan fails without echoing secret | `redaction-boundary`;release | `EV-CAND-ART-REDACTION-001` |
| metrics 标签越界 | trace id / actor ref / free text / secret 入 label | low-cardinality scan passes | `redaction-boundary` | `EV-CAND-ART-REDACTION-002` |
| outbox / handoff 泄漏正文 | event payload / archive material / observability material 包含 body | payload/material only carry refs / state / markers | `operations-replay-core`;release | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-HANDOFF-*` |
| config 试图关闭 safety boundary | override no-write / no-truth-repair / redaction / metadata invariants | startup or entry reject | `config-redline` | `EV-CAND-ART-CONFIG-004` |

### 8.5 一致性 / 恢复故障注入矩阵

| 故障 | 注入位置 | 预期行为 | Suite | 候选证据族 |
|---|---|---|---|---|
| version conflict | truth / support / relay marker save | reload or fail;no overwrite | `service-flow-fast`;`operations-replay-core` | `EV-CAND-ART-IDEMP-*` |
| UoW begin failed | UoW manager | no mutation;dependency unavailable | `infra-runtime-fake` | `EV-CAND-ART-IDEMP-*` |
| commit unknown | UoW manager | retry same key must inspect idempotency/result/truth first | `infra-runtime-fake`;nightly | `EV-CAND-ART-IDEMP-004` |
| rollback failed | UoW manager | safe diagnostic / manual intervention;no hidden compensating write | `operations-replay-extended` | `EV-CAND-ART-IDEMP-*` |
| stored result missing / wrong kind | idempotency replay path | consistency defect;no recompute from current truth | `infra-runtime-fake` | `EV-CAND-ART-IDEMP-002` |
| outbox append failure | accepted command transaction | rollback entire accepted mutation | `service-flow-fast` | `EV-CAND-ART-IDEMP-005` |
| relay publish retryable / terminal failure | fake publisher | only relay marker/report changes;truth unchanged | `operations-replay-core` | `EV-CAND-ART-OUTBOX-*`;`EV-CAND-ART-RELAY-001` |
| projection rebuild race | projection repo | newer freshness preserved;older cursor not overwrite | `operations-replay-extended` | `EV-CAND-ART-JOB-001`;`EV-CAND-ART-IDEMP-*` |
| reference refresh unresolved / failed | resolver / reference repo | last good snapshot preserved;derived state stale only | `operations-replay-core` | `EV-CAND-ART-JOB-002` |
| handoff target disabled / retryable / failed | archive / observability / sync handoff adapter | failed marker/report only;no package body | `operations-replay-core` | `EV-CAND-ART-JOB-004~006`;`EV-CAND-ART-HANDOFF-*` |
| replay root invalid / not de-identified | operations replay profile | current run reject / fail-fast | `config-redline`;release | `EV-CAND-ART-CONFIG-*` |

### 8.6 观测 / 审计证据矩阵

| 观测对象 | 必须存在 | 禁止内容 | 检查方式 | 候选证据族 |
|---|---|---|---|---|
| accepted truth trace/audit | trace/audit/history/outbox/result refs | external body、private copy、secret | service assertions + trace query | `EV-CAND-ART-QUERY-*`;`EV-CAND-ART-OUTBOX-*` |
| rejected / unsupported / delayed path | safe log/metric/receipt/report/marker | success trace / truth mutation | entry + replay assertions | `EV-CAND-ART-CONSUMER-*`;`EV-CAND-ART-JOB-*` |
| structured logs | operation kind、status、error kind、diagnostic ref、duration/count | raw body、stack trace、secret | redaction scan + fixture assertions | `EV-CAND-ART-REDACTION-*` |
| metrics | low-cardinality labels、result/status counters | actor ref、trace id、free text | metric label scan | `EV-CAND-ART-REDACTION-*` |
| replay / maintenance reports | item counts、failed refs、result state、safe failure reason | package body、observability body、sync private body | operations replay report audit | `EV-CAND-ART-JOB-*`;`EV-CAND-ART-HANDOFF-*` |
| dependency / report audit | dependency graph、artifact/report pairing、no-static-evidence | missing raw artifact、manual fake pass | release/nightly checks | `EV-CAND-ART-ARCH-*`;all suite candidate refs |

### 8.7 专项到自动化 suite 映射表

| 专项 | Primary suite | Secondary gate | P0 blocking |
|---|---|---|---|
| truth ownership | `service-flow-fast` | `release-main-smoke`;`operations-replay-core` | 是 |
| cross-repo consumption boundary | `service-flow-fast` | `operations-replay-core`;release | 是 |
| 性能结构性 sample | `release-main-smoke` | `service-flow-fast`;`operations-replay-core` | 仅缺 sample 或依赖越界时阻断 |
| 可用性 / 降级 | `operations-replay-core` | `infra-runtime-fake`;`integration-like` runs | 是 |
| 安全 / redaction | `redaction-boundary` | release redaction check | 是 |
| 审计 / traceability | `service-flow-fast` | `report-generation-audit`;release | 是 |
| 幂等 / 一致性 / 并发 | `infra-runtime-fake` | `operations-replay-extended` | 是 |
| 恢复 / maintenance | `operations-replay-core` | nightly extended replay | 是 |
| 可观测性 | `redaction-boundary` | `report-generation-audit` | 是 |
| 配置与依赖边界 | `config-redline`;`dependency-boundary` | release checks | 是 |

### 8.8 专项停审记录

| 专项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| truth ownership | 是否证明没有第二份 Artifact truth | 通过 | query / handoff / event / private copy 全部纳入 |
| cross-repo consumption | 是否证明下游只能消费 formal refs | 通过 | archive/observability/sync 都单列 |
| 性能 | 是否避免写入无来源硬阈值 | 通过 | 仅保留 sample/trend |
| 安全 / redaction | 是否覆盖 raw body / secret / full ref | 通过 | raw artifact 和 report 都纳入 scan |
| 恢复 / consistency | 是否覆盖 duplicate、missing result、commit unknown、partial failure | 通过 | 由 replay 与 fake fault injection 承接 |
| observability / audit | 是否 accepted/rejected 两侧都可留证 | 通过 | success trace 和 failure marker 区分清楚 |
| config / dependency | 是否维持唯一 compile-time upstream 与 fail-fast | 通过 | `core-contracts` 唯一编译期依赖保持清晰 |

### 8.9 跨专项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `NFR-ART-CAP-*` 与 `NFR-ART-GLOB-*` 是否都有专项承接 | 通过 | 见 §8.1 |
| `VF-ART-001~004` 是否都落到 blocking 专项或 gate | 通过 | truth ownership / redaction / recovery / dependency 都已承接 |
| 是否存在无来源性能阈值 | 否 | 只记录 sample/trend |
| 是否把 P1/P2 环境冒充为 P0 | 否 | selected-run / production-like 不阻断 P0 |
| 是否有 raw artifact / report / scan 证据输入 | 通过 | 见 §8.6 |
| 是否提前固定正式 evidence ID | 否 | 仍保持 `EV-CAND-ART-*` |

## 9. 对上游设计的影响判定

| 专项结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 非功能当前不固化旧 P95 / SLA 数字 | 否 | 需求已明确为候选目标 | Step 14 再记录残余风险 |
| truth ownership / cross-repo consumption 进入 P0 blocking | 否 | 测试方案细化 | 与 `FR/BR/NFR/VF` 一致 |
| replay / maintenance / no-truth-repair 进入专项 blocking | 否 | 门禁细化 | 已与 Step 9 对齐 |
| 若后续要求 numeric performance pass | 是 | 验收基线变更 | 需回写 `05/06/07/09` 或容量基线 |
| 若 future real-like seam 升级为 P0 | 是 | 范围变更 | 需回写环境、数据和 gates |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_10_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“专项测试总矩阵”“真相归属与跨仓消费边界专项表”“安全 / 正文边界 / redaction 专项表”“一致性 / 恢复故障注入矩阵”“观测 / 审计证据矩阵”和“跨专项审计表”小节。

正式 `05-测试方案.md` §10 应回填:

- 专项测试至少覆盖 truth ownership、cross-repo consumption boundary、性能结构性验证、可用性 / 降级、安全 / redaction、审计追溯、幂等一致性、恢复维护、可观测性、配置与依赖边界。
- `FR-ART-017~020`、`BR-ART-021~025`、`NFR-ART-GLOB-001~008` 和 `VF-ART-004` 必须通过 consumable ref / backref、read surface、consumer、outbox、handoff 和 replay 验证“下游只能消费,不能迁移 truth ownership”。
- 性能当前只记录 sample / trend 和“核心主链不依赖外围增强”的结构性验证,不把旧 P95 / SLA 数字写成 P0 pass 阈值。
- 安全与 redaction 必须同时覆盖 raw artifacts、stdout/stderr、reports 和 handoff materials。
- 恢复与一致性必须通过 fake / controlled / replay-backed fault injection 验证 duplicate replay、missing stored result、commit unknown、outbox publish failure、reference refresh failure 和 handoff failure。
- 所有专项 evidence 当前仍使用 `EV-CAND-ART-*`;正式 evidence 编号与 acceptance handoff 由 Step 13 和后续 `06-验收标准.md` 收口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future 是否把 numeric performance threshold 升格为正式门禁 | 影响 release / acceptance | 当前不升格,留 Step 14 残余风险 |
| future selected-run 是否拆成 durable-like 与 real-like 两类专项 | 影响 P1 报告粒度 | 当前保持合并口径 |
| observability backend 真实产品是否需要单独专项 | 影响 P1/P2 范围 | 当前只验证 safe output 与 handoff semantics |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能主轴都有专项验证方式 | 通过 | 见 §8.1 |
| truth ownership / cross-repo consumption 已形成 blocking 专项 | 通过 | 见 §8.2 / §8.7 |
| 无来源性能阈值未被误固化 | 通过 | 见 §8.3 |
| 恢复 / 一致性 / observability 均有证据输入 | 通过 | 见 §8.5 / §8.6 |
| 可进入 Step 11 | 通过 | 下一步定义缺陷管理与复验规则;进入前等待用户审查 |
