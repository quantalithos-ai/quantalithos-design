# Step 12. 定义实施完成判定

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填章节: `07-实施计划.md` §12 实施完成判定

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义实施完成判定 |
| 当前状态 | 进行中;按判定类型分批写入 |
| 输入基线 | Step 2 范围;Step 4 交付物;Step 7 门禁;Step 9 风险;Step 11 交付纪律;`06-验收标准.md` |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 13 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 2 实施范围 | 已完成 | 判定 P0 范围是否全部覆盖 |
| Step 4 交付物清单 | 已完成 | 判定代码、测试、配置、脚本、证据和文档交付物是否完成 |
| Step 6 commit boundary | 已完成 | 判定每个 boundary 是否完成、提交、可 review、可回退 |
| Step 7 门禁矩阵 | 已完成 | 判定 tests / gates / artifacts / reports 是否通过 |
| Step 9 风险与待确认事项 | 已完成 | 判定 blocker、Spike、open question 是否关闭或风险接受 |
| Step 11 交付纪律 | 已完成 | 判定 commit、review、handoff 和 evidence discipline 是否满足 |
| `06-验收标准.md` §14 | 已存在 | 使用通过 / 有条件通过 / 不通过的正式裁决口径 |

## 3. SOP 问题回答

1. 本轮需求覆盖如何判定。

   回答: 以 Step 2 P0 范围为准,覆盖 C-GOV-1~5、FR-GOV-001~010、AC-GOV-001~031、VF-GOV-001~010。P1/P2 selected-run、真实产品和容量能力只进入 residual,不得计 P0 pass。

2. 交付物是否全部完成。

   回答: 以 Step 4 交付物和 Step 6 commit boundary 为准。七 crate、config、scripts、tests、artifacts/reports、acceptance handoff 均完成且通过门禁后才可判定完成。

3. 测试门禁和验收门禁是否全部通过或有明确风险接受。

   回答: P0 blocking gates 必须通过;VETO/S 级缺陷不得风险接受。只有 B/R residual 或已严格接受的 A 级风险可进入有条件通过。

4. 风险、Spike 和待确认事项是否关闭。

   回答: SP-GOV-* 必须产出结果或明确取消;R-GOV blocker 必须关闭;OQ-GOV open question 必须在截止 boundary 前关闭。未关闭 blocker 不允许完成。

5. 是否存在一票否决项。

   回答: VETO-GOV-001~013 任一命中时,最终结论不得为通过或有条件通过。

6. 未完成项如何进入延期、风险接受或 blocker。

   回答: P0 未完成项若影响 truth、redaction、dependency、evidence、query/job no truth repair 或 release gates,归 blocker。P1/P2/future 能力可延期或风险接受,但必须有 owner、acceptor、deadline_or_trigger。

7. `reports/runs/<run_id>` 是否已经从 `artifacts/test/<run_id>` 生成。

   回答: 完成判定要求 run reports 从 raw artifacts 生成,并通过 report-generation-audit;raw artifact 不能替代 report。

8. `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md` 是否已经审查。

   回答: PH-08 完成判定要求这些报告已由人或 Agent 审查;脚本初稿不能替代审查结论。

9. artifact / report 是否通过 redaction 和 link 检查。

   回答: 必须通过 redaction-boundary、dependency-boundary、report-generation-audit 和 link/path review。

10. 是否仍存在未关闭的字段、DTO、状态、命名或 phase boundary 冲突。

    回答: 不允许。任何未关闭设计闭环冲突都阻塞完成。

11. 是否已按 phase / commit boundary 对正式 `03/05/06/07` 执行交付实现前可落码闭环审计,且未通过项已回写设计真相源。

    回答: 是,完成判定表将该审计列为必要项。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 7 | 门禁已定义但未形成完成判定 | 无法裁决实施完成 | 本 Step 汇总判定表 |
| Step 9 | 风险和 open question 有截止点 | 需要完成时统一审计 | 本 Step 加入未完成项处理 |
| Step 11 | 交付纪律已定义 | 需要与最终交付清单绑定 | 本 Step 加入交付证据项 |
| `06` 验收标准 | 裁决严格禁止模糊结论 | 实施计划也必须禁止“基本完成” | 本 Step 固定通过 / 有条件通过 / 不通过 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 完成口径 | 分散在 gate / risk / acceptance | 汇总为完成判定表 | 让实施结束可审查 |
| raw artifact | 可能被误当完成证据 | 必须生成人读 report | 符合 SOP |
| acceptance report | 脚本初稿可能被直接使用 | 必须审查 | 防止自动宣告 pass |
| 设计闭环审计 | 在 boundary 前复核 | 完成时再次总审计 | 防止残留冲突 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只看 tests pass | 简单 | 无法覆盖 VETO、evidence、design closure | 不采用 |
| 把验收裁决和实施完成合并 | 少一层 | 可能越过 `06` 的正式验收职责 | 不采用 |
| 实施完成只声明可送验 | 边界清楚 | 仍需验收人最终裁决 | 采用 |
| 未完成项允许口头延期 | 灵活 | 不可审计 | 不采用 |

## 7. 结构化中间产物

### 7.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| P0 范围覆盖 | C-GOV-1~5、FR-GOV-001~010、AC-GOV-001~031、VF-GOV-001~010 均有实现和门禁证据 | Step 6 boundary;Step 7 gate;reports/runs | 执行期判定 |
| 交付物完成 | Step 4 交付物清单全部完成,非范围未混入 | commit history;delivery checklist | 执行期判定 |
| commit boundary 完成 | commit-01-a~commit-08-b 均按 Step 6 完成,无跨 boundary 混入 | git log;review notes | 执行期判定 |
| 测试门禁通过 | 所有 P0 blocking suite/check 通过 | `reports/runs/<run_id>` | 执行期判定 |
| 验收红线未命中 | VETO-GOV-001~013 均未命中 | `reports/acceptance/veto-checklist.md` | 执行期判定 |
| S 级缺陷为零 | 无未关闭 S 级缺陷 | open issues / defect report | 执行期判定 |
| 风险接受完整 | 有条件通过时 A/B/R residual 有 owner、acceptor、deadline_or_trigger | `reports/acceptance/risk-acceptance.md` | 执行期判定 / 不适用 |
| evidence integrity | EV index、redaction、dependency、report audit 均通过 | evidence-index;redaction;dependency;report-audit | 执行期判定 |
| acceptance handoff | handoff、VETO、risk、open issues 已审查 | `reports/acceptance/*` | 执行期判定 |
| 设计闭环无残留 blocker | phase / boundary 的字段、DTO、状态、port、version、outbox、job、evidence 均闭合 | design closure audit | 执行期判定 |

### 7.2 闭环项完成标准

| 闭环项 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 字段 / DTO 闭环 | 所有 phase 已按详细设计实现,无临时补设字段 | boundary design review;contract tests | 执行期判定 |
| 状态闭环 | 代码、测试、验收使用同一套正式状态名 | domain tests;state matrix review | 执行期判定 |
| port / repository 闭环 | 所有 flow 所需读取面、写入面、version source 均正式定义 | application port review;service tests | 执行期判定 |
| query / projection 闭环 | query no-write、visibility、degraded、stale/rebuild source 均闭合 | query reports;projection tests | 执行期判定 |
| event / outbox 闭环 | inbound snapshot/stale/receipt and outbound payload snapshot/source identity 均闭合 | consumer/outbox reports | 执行期判定 |
| job / handoff / export 闭环 | job report duplicate replay、partial failure、artifact materialization 均闭合 | operations reports | 执行期判定 |
| evidence 闭环 | raw artifact -> report -> EV / VETO / handoff 可追溯 | report-generation-audit | 执行期判定 |
| phase boundary | 无当前 phase 依赖后续 phase 的实现或证据 | commit review | 执行期判定 |

### 7.3 交付实现前可落码闭环审计

| Phase / commit boundary | 复核范围 `03/05/06/07` | 适用标准项 | 结论 | blocker | 修复 baseline |
|---|---|---|---|---|---|
| PH-01 / commit-01-a~b | workspace、config、path、dependency、script/report roots | path baseline;config binding;artifact materialization | 执行期判定 | target repo/core dependency/config path | design commit or 不适用 |
| PH-02 / commit-02-a~b | context/input objects, commands, accepted flows, idempotency | 字段闭环;DTO构造;状态;optimistic version;idempotency;trace/outbox | 执行期判定 | DTO/state/version/outbox source | design commit or 不适用 |
| PH-03 / commit-03-a~c | gate/decision/approval objects, commands, flows | 字段闭环;状态闭环;public target;validation truth;history/outbox | 执行期判定 | responsibility/decision state/source | design commit or 不适用 |
| PH-04 / commit-04-a~d | policy/control/compliance/NC objects, commands, redaction | 字段闭环;DTO构造;状态;validation truth;redaction;history/outbox | 执行期判定 | evidence summary/body-free boundary | design commit or 不适用 |
| PH-05 / commit-05-a~c | query/view/projection/trace/API read surface | Query response;status marker;read-model identity;projection stale;no-write | 执行期判定 | visibility/degraded/stale source | design commit or 不适用 |
| PH-06 / commit-06-a~d | inbound/outbound events, snapshots, outbox, publisher | DTO构造;Ref-scope;Projection stale;Sidecar truth;outbox source;version | 执行期判定 | affected views/payload snapshot/publication version | design commit or 不适用 |
| PH-07 / commit-07-a~d | jobs, report store, replay, handoff/export | public job surface;job policy summary;scope expansion;artifact materialization | 执行期判定 | stored report/scope/failed item | design commit or 不适用 |
| PH-08 / commit-08-a~b | release gates, evidence index, VETO, handoff | artifact materialization;evidence source;VETO evidence;release smoke | 执行期判定 | static evidence/generic smoke/default VETO pass | design commit or 不适用 |

### 7.4 交付证据项

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整,failed artifact 保留 | 执行期判定 |
| run reports | `reports/runs/<run_id>` | summary、suite reports、evidence-index、gate-summary、redaction、dependency、report-audit 完整 | 执行期判定 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已经人 / Agent 审查,包含 baseline、run_id、scope、open issues | 执行期判定 |
| veto checklist | `reports/acceptance/veto-checklist.md` | VETO-GOV-001~013 均有真实证据结论 | 执行期判定 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时 A/B/R residual 完整;无风险时可不适用 | 执行期判定 / 不适用 |
| open issues | `reports/acceptance/open-issues.md` | S/A/B/R 分级、复验、关闭或接受状态明确 | 执行期判定 |
| design closure audit | `reports/acceptance/design-closure-audit.md` or handoff section | phase/boundary 可落码审计无 blocker | 执行期判定 |

### 7.5 未完成项处理表

| 未完成项类型 | 处理 | 是否允许完成 |
|---|---|---|
| P0 command/query/event/job implementation missing | blocker;补实现和门禁 | 否 |
| P0 blocking suite failed | blocker;修复并复验 | 否 |
| VETO-GOV-001~013 命中 | blocker;不可风险接受 | 否 |
| S 级缺陷未关闭 | blocker;不可风险接受 | 否 |
| A 级缺陷未修复但不命中 VETO | 需要正式风险接受;通常最多有条件通过 | 仅有条件 |
| B/R residual | 风险接受或延期,有 owner/acceptor/deadline | 可完成或有条件 |
| P1 selected-run unavailable | residual/unavailable,不计 P0 pass | 可完成,不得宣称 P1 pass |
| 真实 DB/bus/search/object storage/external GRC 未锁定 | P1/P2 future risk | 可完成 |
| old P95/SLA candidate 未硬化 | performance residual;保留 sample | 可完成 |
| report 可读性问题但 raw artifact 完整 | B 级;补 report 或风险接受 | 视影响 |
| design closure blocker 未修 | 回写设计并重复核 | 否 |

### 7.6 最终交付清单

| 交付物 | 完成判定 |
|---|---|
| 七 crate workspace | package/crate/binary naming and dependency boundary check passed |
| contracts/domain/application/infra/api/worker/jobs implementation | Step 6 boundary completed and tested |
| config profiles and runtime builder | config redline passed |
| in-memory/fake/controlled/disabled adapters | fake semantics tests passed |
| command/query/consumer/outbox/job services | service-flow, query no-write, consumer/outbox, operations replay passed |
| scripts/gates, scripts/reports, scripts/checks | release gate dry-run and report audit passed |
| artifacts/test/<run_id> | raw artifacts complete |
| reports/runs/<run_id> | generated from raw artifacts |
| reports/acceptance/* | reviewed handoff, VETO, risk/open issues |
| design closure audit | no unresolved blocker |

### 7.7 完成判定停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 完成判定是否有证据 | 通过 | 所有判定项绑定 artifact/report/review |
| 是否禁止“基本完成” | 通过 | 只允许完成 / 有条件完成 / 不完成的实施口径 |
| raw artifact 是否不能替代 report | 通过 | run reports 必须存在 |
| acceptance reports 是否需审查 | 通过 | handoff/VETO/risk 必须审查 |
| 设计闭环冲突是否阻塞完成 | 通过 | design closure audit 必须无 blocker |
| P1/P2 是否不会污染 P0 | 通过 | residual/future risk |

### 7.8 跨完成判定审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 范围、交付物、门禁、风险是否全部进入判定 | 通过 | Step 2/4/7/9 均已承接 |
| VETO / S 级是否不可风险接受 | 通过 | 未完成项表明确 |
| evidence integrity 是否纳入完成条件 | 通过 | report-audit/evidence-index/VETO checklist |
| design closure audit 是否纳入完成条件 | 通过 | §7.3 and §7.4 |
| final acceptance 是否仍由 `06` 裁决 | 通过 | 本 Step 只声明实施可送验 |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §12。正式装配时可压缩表格,但必须保留完成判定表、闭环审计、交付证据项和未完成项处理。

### 12.1 Completion Criteria

本轮实施只能在以下条件全部满足时宣称完成并可送验:

1. Step 2 P0 范围全部覆盖。
2. Step 4 交付物全部完成,非范围未混入。
3. commit-01-a 到 commit-08-b 均按 Step 6 完成并通过 review。
4. Step 7 所有 P0 blocking gates 通过。
5. VETO-GOV-001~013 未命中,S 级缺陷为零。
6. raw artifacts、run reports、evidence index、redaction/dependency/report audit 完整。
7. `reports/acceptance/handoff.md`、`veto-checklist.md`、必要的 `risk-acceptance.md` 已审查。
8. phase / commit boundary 交付实现前可落码闭环审计无 blocker。

### 12.2 Completion Outcomes

| 结论 | 条件 |
|---|---|
| 完成 / 可送验 | P0 全部通过,VETO 未命中,S=0,证据完整,无未接受 A 级 |
| 有条件完成 / 可送验但带 residual | P0 主线成立,VETO 未命中,S=0,证据完整,存在已接受 A/B/R residual |
| 不完成 / 不可送验 | 任一 P0 blocking gate failed,VETO 命中,S 未关闭,证据不可裁决,设计闭环 blocker 未修 |

### 12.3 Incomplete Item Handling

P0 缺失、VETO、S 级、redaction/dependency/report audit failed、query/job truth repair、static evidence、设计闭环 blocker 均不得延期为已完成。P1/P2/future 能力可进入 residual,但必须有 owner、acceptor 和 deadline_or_trigger。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 实际 run_id | PH-08 执行时固定 | release handoff |
| design closure audit report 是否单独成文 | 可单独 `design-closure-audit.md` 或放入 handoff | PH-08 |
| 有条件完成是否允许进入下一轮 | 由 `06-验收标准.md` 和验收负责人裁决 | acceptance |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施完成判定表已完成 | 通过 | §7.1 |
| 闭环项完成标准已完成 | 通过 | §7.2 |
| 交付实现前审计已完成 | 通过 | §7.3 |
| 交付证据项已完成 | 通过 | §7.4 |
| 未完成项处理已完成 | 通过 | §7.5 |
| 最终交付清单已完成 | 通过 | §7.6 |
| 可进入 Step 13 | 通过 | 下一步装配正式 `07-实施计划.md` |
