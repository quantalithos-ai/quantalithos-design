# Step 12. 定义实施完成判定

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填章节: `07-实施计划.md` §12 实施完成判定
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_12_completion_criteria.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义实施完成判定 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 范围;Step 4 交付物;Step 6 commit boundary;Step 7 门禁;Step 9 风险;Step 11 交付纪律;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 2 实施范围 | 已完成;用户已确认 | 判定 P0 Artifact truth center 是否覆盖五个核心能力和 `FR/BR/NFR/AC/VETO` |
| Step 4 交付物清单 | 已完成;用户已确认 | 判定代码、测试、配置、脚本、证据、report 和 implementation ledgers 是否完成 |
| Step 6 `commit-01-a`~`commit-08-b` | 已完成;用户已确认 | 判定每个 boundary 是否完成、提交、可 review、可回退 |
| Step 7 门禁矩阵 | 已完成;用户已确认 | 判定 required checks、P0 suites、artifact/report 和 AC/VETO evidence 是否通过 |
| Step 9 Spike / risk / OQ | 已完成;用户已确认 | 判定 `SP-ART-*`、`R-ART-*`、`OQ-ART-*` 是否关闭或进入合规 residual |
| Step 11 提交 / 评审 / 交付纪律 | 已完成;用户已确认 | 判定 commit、review、handoff、user-owned changes 和 evidence discipline 是否满足 |
| `06-验收标准.md` §13~§14 | 已存在 | 使用通过 / 有条件通过 / 不通过的正式裁决口径,但本 Step 只判定“实现可送验” |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮需求覆盖如何判定? | 以 Step 2 P0 范围为准,覆盖五个核心能力、`FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、`AC-ART-001~058` 和 `VETO-ART-001~009`。 |
| 交付物是否全部完成? | 以 Step 4 交付物和 Step 6 boundary 为准。七 crate、config、scripts、tests、artifact/report roots、acceptance reports 和 implementation ledgers 均完成后才可判定实现完成。 |
| 测试门禁和验收门禁是否全部通过或有明确风险接受? | P0 blocking gates 必须通过;VETO、S 级缺陷、redaction / dependency / report audit failure 不可风险接受。只有不污染 P0 的 B/R residual 或受限 A 级风险可进入有条件可送验。 |
| 风险、Spike 和待确认事项是否关闭? | `SP-ART-*` 必须有输出或正式取消;`R-ART-*` blocker 必须关闭;`OQ-ART-*` 必须在截止 boundary 前关闭或转为 future residual。 |
| 是否存在一票否决项? | `VETO-ART-001~009` 任一命中时,实现不得声明完成或有条件完成,只能暂停或判定不可送验。 |
| 未完成项如何进入延期、风险接受或 blocker? | P0 truth、VETO、S 级、安全、依赖、证据、no-write/no-truth-repair、设计闭环 blocker 均不能延期为完成。P1/P2/future 能力可延期,但必须有 owner、acceptor、deadline_or_trigger。 |
| `reports/runs/<run_id>` 是否必须从 `artifacts/test/<run_id>` 生成? | 必须。raw artifact 不能替代 human-readable report;`report-generation-audit` 必须证明 artifact/report pairing、no-static-evidence 和 no orphan EV。 |
| `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要 `risk-acceptance.md` 是否必须审查? | 必须。脚本初稿不能替代人或 Agent 审查结论。 |
| artifact / report 是否通过 redaction 和 link 检查? | 必须通过 `redaction-boundary`、`dependency-boundary`、`report-generation-audit` 和 path/link review。 |
| 是否允许仍有字段、DTO、状态、命名或 phase boundary 冲突? | 不允许。任何未关闭设计闭环冲突都阻塞实现完成。 |
| 是否已按 phase / commit boundary 对正式 `03/05/06/07` 执行交付实现前可落码闭环审计? | 必须执行。未通过项必须回写设计真相源并固定新 baseline 后重复核。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 7 | 门禁已定义但未收成完成判定 | 实施结束时可能只说 tests pass | 增加实施完成判定表 |
| Step 9 | 风险 / OQ 有截止点 | 需要最终审计是否关闭 | 增加未完成项处理表 |
| Step 11 | 提交和交付纪律已定义 | 需要绑定最终交付清单 | 增加交付证据项和 handoff 判定 |
| `06-验收标准.md` | 明确禁止模糊结论 | 实施计划也必须禁止“基本完成” | 固定完成 / 有条件可送验 / 不完成 |
| 设计闭环 | 每个 boundary 开工前复核 | 完成时还需总审计 | 加入交付实现前可落码闭环审计 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 完成口径 | 分散在 scope、gates、risk、handoff | 汇总为完成判定表 | 让结束状态可审查 |
| raw artifact | 可能被误当完成证据 | 必须生成人读 report | 保持 evidence integrity |
| acceptance reports | 可能脚本生成即使用 | 必须审查 | 防止自动宣告 pass |
| design closure | boundary 前复核 | 完成时再次审计 `03/05/06/07` | 防止残留冲突 |
| P1/P2 | 多处声明 residual | 完成判定中明确不计 P0 pass | 防止污染验收 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只看 `cargo test` / suites pass | 简单 | 覆盖不了 VETO、证据、台账和设计闭环 | 不采用 |
| 把实施完成和最终验收签署合并 | 少一层流程 | 越过 `06` 的正式验收职责 | 不采用 |
| 实施完成只声明可送验 | 边界清楚 | 仍需验收负责人裁决 | 采用 |
| 未完成项口头延期 | 灵活 | 不可审计 | 不采用 |
| B/R residual 有条件可送验 | 可保留非 P0 尾项 | 必须严控不污染 P0 | 采用 |

## 7. 结构化中间产物

### 7.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| P0 范围覆盖 | 五个核心能力、`FR-ART-001~020`、`BR-ART-001~025`、NFR、`AC-ART-001~058` 均有实现和门禁证据 | Step 6 boundary;Step 7 gate;`reports/runs/<run_id>` | 执行期判定 |
| 交付物完成 | Step 4 code/test/config/script/evidence/ledger 交付物全部完成,非范围未混入 | commit history;delivery checklist | 执行期判定 |
| commit boundary 完成 | `commit-01-a`~`commit-08-b` 均按 Step 6 完成、提交、review、handoff | git log;boundary ledgers | 执行期判定 |
| 测试门禁通过 | 所有 P0 blocking suites/checks 通过 | suite reports;gate summary | 执行期判定 |
| VETO 未命中 | `VETO-ART-001~009` 均有真实证据支持未触发 | `reports/acceptance/veto-checklist.md` | 执行期判定 |
| S 级缺陷为零 | 无未关闭 S 级缺陷 | open issues / defect report | 执行期判定 |
| 风险接受完整 | 有条件可送验时 A/B/R residual 有 owner、acceptor、deadline_or_trigger 和 P0 contamination check | `reports/acceptance/risk-acceptance.md` | 执行期判定 / 不适用 |
| evidence integrity | `EV-CAND-ART-*`、raw artifact、report、digest、run_id 可逆追溯 | evidence-index;report-audit | 执行期判定 |
| redaction / dependency | raw artifact 与 report clean;only core compile dependency | redaction-check;dependency-boundary | 执行期判定 |
| acceptance handoff | handoff、VETO、risk、open issues 已审查 | `reports/acceptance/*` | 执行期判定 |
| 设计闭环无 blocker | phase / boundary 的字段、DTO、状态、port、version、outbox、job、evidence 均闭合 | design closure audit | 执行期判定 |

### 7.2 闭环项完成标准

| 闭环项 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 字段 / DTO 闭环 | 所有 phase 按 `03` 实现,无临时补设字段或默认值 | boundary design review;contract tests | 执行期判定 |
| 状态闭环 | 代码、测试、验收使用同一套正式状态名和迁移规则 | domain tests;state matrix review | 执行期判定 |
| port / repository / UoW 闭环 | flow 所需读取面、写入面、version source 和 UoW 顺序均正式定义 | application port review;service tests | 执行期判定 |
| query / projection 闭环 | query no-write、visibility、degraded、stale、rebuild source 均闭合 | query reports;projection tests | 执行期判定 |
| consumer / event / outbox 闭环 | inbound snapshot/stale/receipt 和 outbound stored payload source 均闭合 | consumer/outbox reports | 执行期判定 |
| job / handoff / export 闭环 | duplicate report replay、partial failure、no-truth-repair、artifact materialization 均闭合 | operations reports;handoff/export reports | 执行期判定 |
| config / dependency 闭环 | P0 profile、source priority、topic completeness、adapter mode 和 only-core dependency 均闭合 | config-redline;dependency-boundary | 执行期判定 |
| evidence 闭环 | raw artifact -> report -> `EV-CAND-ART-*` / VETO / handoff 可追溯 | report-generation-audit | 执行期判定 |
| phase boundary | 无当前 phase 依赖后续 phase 的实现、report 或 evidence | commit review;boundary ledger | 执行期判定 |

### 7.3 交付实现前可落码闭环审计

| Phase / commit boundary | 复核范围 `03/05/06/07` | 适用标准项 | 结论 | blocker | 修复 baseline |
|---|---|---|---|---|---|
| PH-01 / `commit-01-a`~`commit-01-b` | workspace、config、path、dependency、script/report roots | path baseline;config binding;artifact materialization | 执行期判定 | target repo / core dependency / config path | design commit or 不适用 |
| PH-02 / `commit-02-a`~`commit-02-b` | fact/intake/review/responsibility contracts、accepted flows、idempotency | 字段闭环;DTO构造;状态;optimistic version;idempotency;trace/outbox | 执行期判定 | DTO/state/version/outbox source | design commit or 不适用 |
| PH-03 / `commit-03-a`~`commit-03-c` | version、lineage、history、impact、services | 字段闭环;状态闭环;public target;validation truth;history/outbox | 执行期判定 | version/lineage state/source | design commit or 不适用 |
| PH-04 / `commit-04-a`~`commit-04-b` | baseline candidate、freeze、supersede、history audit | 字段闭环;DTO构造;状态;formal-member validation;history | 执行期判定 | baseline membership/history source | design commit or 不适用 |
| PH-05 / `commit-05-a`~`commit-05-c` | query/view/projection/trace/API read surface | Query response;read-model identity;visibility;projection stale;no-write | 执行期判定 | visibility/degraded/stale source | design commit or 不适用 |
| PH-06 / `commit-06-a`~`commit-06-c` | inbound/outbound events、snapshots、outbox、relay | DTO构造;ref-scope;projection stale;outbox source;topic map | 执行期判定 | affected views/payload snapshot/publication marker | design commit or 不适用 |
| PH-07 / `commit-07-a`~`commit-07-c` | jobs、report store、replay、handoff/export | public job surface;job policy summary;scope expansion;artifact materialization | 执行期判定 | stored report/scope/failed item | design commit or 不适用 |
| PH-08 / `commit-08-a`~`commit-08-b` | release gates、evidence index、VETO、handoff | artifact materialization;evidence source;VETO evidence;release smoke | 执行期判定 | static evidence/generic smoke/default VETO pass | design commit or 不适用 |

### 7.4 交付证据项

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整,failed artifact 保留 | 执行期判定 |
| run reports | `reports/runs/<run_id>` | summary、suite reports、evidence-index、gate-summary、redaction、dependency、report-audit 完整 | 执行期判定 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 覆盖全部 P0 `EV-CAND-ART-*`,每项含 artifact path、report path、digest、status、review status | 执行期判定 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已经人 / Agent 审查,包含 baseline、run_id、scope、open issues | 执行期判定 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VETO-ART-001~009` 均有真实证据结论,无默认全 passed | 执行期判定 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件可送验时 A/B/R residual 完整;无风险时可不适用 | 执行期判定 / 不适用 |
| open issues | `reports/acceptance/open-issues.md` | S/A/B/R 分级、复验、关闭或接受状态明确 | 执行期判定 |
| design closure audit | `reports/acceptance/design-closure-audit.md` or handoff section | phase/boundary 可落码审计无 blocker | 执行期判定 |

### 7.5 未完成项处理表

| 未完成项类型 | 处理 | 是否允许实现完成 |
|---|---|---|
| P0 command/query/consumer/event/job implementation missing | blocker;补实现和门禁 | 否 |
| P0 blocking suite failed | blocker;修复并复验 | 否 |
| `VETO-ART-001~009` 命中 | blocker;不可风险接受 | 否 |
| S 级缺陷未关闭 | blocker;不可风险接受 | 否 |
| redaction / dependency / report audit failed | blocker;修复并重跑 release audit | 否 |
| query / consumer / relay / job / handoff 反写 Artifact truth | blocker;修复或回写设计 | 否 |
| 设计闭环 blocker 未修 | 回写设计并重复核 | 否 |
| A 级缺陷未修复但不命中 VETO/S | 必须正式风险接受;通常最多有条件可送验 | 仅有条件 |
| B/R residual | 风险接受或延期,有 owner/acceptor/deadline_or_trigger | 可完成或有条件 |
| P1 selected-run unavailable | residual/unavailable,不计 P0 pass | 可完成,不得宣称 P1 pass |
| 真实 DB/bus/search/object storage/external product 未锁定 | P1/P2 future risk | 可完成 |
| production-like / capacity / hard SLO 未硬化 | performance residual;保留 sample | 可完成 |
| report 可读性问题但 raw artifact 完整 | B 级;补 report 或风险接受 | 视影响 |

### 7.6 最终交付清单

| 交付物 | 完成判定 |
|---|---|
| 七 crate workspace | package/crate/binary naming and dependency boundary check passed |
| contracts/domain/application/infra/api/worker/jobs implementation | Step 6 boundary completed and tested |
| config profiles and runtime builder | config-redline passed |
| in-memory/fake/controlled/disabled adapters | fake semantics tests passed |
| command/query/consumer/outbox/job services | service-flow, query no-write, consumer/outbox, operations replay passed |
| `PublishPendingArtifactRelays` worker-only facade | relay not counted as public job,stored payload snapshot publish covered |
| scripts/gates, scripts/reports, scripts/checks | release gate dry-run and report audit passed |
| `artifacts/test/<run_id>` | raw artifacts complete |
| `reports/runs/<run_id>` | generated from raw artifacts |
| `reports/acceptance/*` | reviewed handoff, VETO, risk/open issues |
| implementation ledgers | all boundary hash/gates/handoff states complete;future boundary not left active |
| design closure audit | no unresolved blocker |

### 7.7 完成结论矩阵

| 结论 | 条件 | 允许动作 |
|---|---|---|
| 实现完成 / 可送验 | P0 全部通过,VETO 未命中,S=0,证据完整,无未接受 A 级,设计闭环无 blocker | 进入验收交接,由 `06` 口径做最终裁决 |
| 有条件实现完成 / 可送验但带 residual | P0 主线成立,VETO 未命中,S=0,证据完整,存在已接受 A/B/R residual | 进入带条件验收交接,必须附 risk acceptance |
| 不完成 / 不可送验 | 任一 P0 blocking gate failed,VETO 命中,S 未关闭,证据不可裁决,设计闭环 blocker 未修 | 暂停、修复、回写设计或重新执行 boundary |

禁止使用“基本完成”“大体完成”“原则上完成”“待观察完成”等模糊结论。

### 7.8 完成判定停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 完成判定是否有证据 | 通过 | 所有判定项绑定 artifact/report/review |
| 是否禁止模糊完成 | 通过 | 只允许完成 / 有条件完成 / 不完成 |
| raw artifact 是否不能替代 report | 通过 | run reports 必须存在 |
| acceptance reports 是否需审查 | 通过 | handoff/VETO/risk/open issues 必须审查 |
| 设计闭环冲突是否阻塞完成 | 通过 | design closure audit 必须无 blocker |
| VETO / S 级是否不可风险接受 | 通过 | §7.5 and §7.7 |
| P1/P2 是否不会污染 P0 | 通过 | residual/future risk |

### 7.9 跨完成判定审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 范围、交付物、门禁、风险是否全部进入判定 | 通过 | Step 2/4/7/9 均已承接 |
| 20 个 commit boundary 是否进入完成判定 | 通过 | §7.1 / §7.3 / §7.6 |
| `AC-ART-001~058` 和 `VETO-ART-001~009` 是否进入判定 | 通过 | §7.1 / §7.4 / §7.7 |
| `EV-CAND-ART-*` 可逆追溯是否纳入完成条件 | 通过 | evidence-index and report-audit |
| design closure audit 是否纳入完成条件 | 通过 | §7.3 and §7.4 |
| final acceptance 是否仍由 `06` 裁决 | 通过 | 本 Step 只声明实现可送验 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_12_completion_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施完成判定表”“闭环项完成标准”“交付实现前可落码闭环审计”“交付证据项”“未完成项处理表”和“完成结论矩阵”小节。

正式 `07-实施计划.md` §12 应回填:

L1-artifact 的实施完成只表示实现可送验,不替代 `06-验收标准.md` 的最终验收裁决。实施可送验必须同时满足:P0 范围全部覆盖;Step 4 交付物全部完成;`commit-01-a` 到 `commit-08-b` 均完成、提交、review、handoff;所有 P0 blocking gates 通过;`VETO-ART-001~009` 未命中;S 级缺陷为零;evidence index、redaction、dependency、report audit 和 acceptance reports 完整;phase / commit boundary 交付实现前可落码闭环审计无 blocker。

完成判定只允许三种结论:实现完成 / 可送验;有条件实现完成 / 可送验但带 residual;不完成 / 不可送验。禁止使用“基本完成”“原则上完成”“大体完成”等模糊结论。VETO、S 级、P0 blocking gate、redaction/dependency/report audit failure、static evidence、query/job truth repair、设计闭环 blocker 均不得风险接受。

raw artifacts 必须生成 `reports/runs/<run_id>` 下的人读报告,`EV-CAND-ART-*` 必须能回指 artifact path、report path、digest 和 run_id。`reports/acceptance/handoff.md`、`veto-checklist.md`、必要的 `risk-acceptance.md` 和 `open-issues.md` 必须经人或 Agent 审查。P1/P2/real-like unavailable 只能作为 residual 或 future risk,不得计入 P0 pass。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 实际 `run_id` | PH-08 执行时固定 | release handoff |
| design closure audit report 是否单独成文 | 可单独 `design-closure-audit.md` 或放入 handoff | PH-08 |
| 有条件完成是否允许进入下一轮 | 由 `06-验收标准.md` 和验收负责人裁决 | acceptance |
| failed artifact 保留周期 | 至少保留到 fixed run report 可追溯 | PH-08 / acceptance |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施完成判定表已完成 | 通过 | §7.1 |
| 闭环项完成标准已完成 | 通过 | §7.2 |
| 交付实现前审计已完成 | 通过 | §7.3 |
| 交付证据项已完成 | 通过 | §7.4 |
| 未完成项处理已完成 | 通过 | §7.5 |
| 完成结论矩阵已完成 | 通过 | §7.7 |
| 正式 `07` 是否已创建 | 未创建 | 仍按 SOP 留到 Step 13 装配 |
| 可进入 Step 13 | 待用户确认 | 下一步装配正式 `07-实施计划.md` |
