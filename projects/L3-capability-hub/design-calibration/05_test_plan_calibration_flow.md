# L3-capability-hub 05 测试方案校准工作台

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md`
> 书写规范: `standards/document/测试方案书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-capability-hub/05-测试方案.md`
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 当前状态: `05_completed_design_task_wait_implementation_handoff`

---

## 1. 本轮目标

按测试方案 SOP 把 full-restart 后的正式 `00/01/02/03/04` 中已闭合的 requirement、responsibility、object、protocol、flow、state、transaction、error、configuration、binding 和 observability 契约，转译为可执行、可追溯、可留证且可供正式 `06-验收标准.md` 裁决的新测试方案。

本轮必须保证：

- 正式 05 只能在 Step 15 由 Steps 1~14 中间产物装配；
- 每个 P0 cut 都有 exact design source、positive/negative/boundary scenario、precondition、action、typed oracle、zero-effect oracle、data、layer、automation intent 和 evidence placeholder contract；
- 43 HLD objects + 7 application helpers、250 public protocol types、36 Ports、22 repository traits / 110 methods、83 flows、24 state families / 111 active variants / 638 pairs、22 transaction/concurrency cuts、12 binding cuts、12 observability cuts全部有可追溯承接；
- 配置 18 modules、27 canonical rows、21 bounded content env leaves、9 external slots、6 Worker sources、10 routes、3 profiles、24 failure modes、18 `CFG-F-*` cuts有 exact testing owner；
- 只定义 future test/evidence contract，不伪造已存在的 test file、command、CI、run_id、artifact、report、evidence alias、pass/fail、coverage、signoff 或 release fact。

## 2. 权威输入

| 输入 | 权威级别 | 本 flow 承接 | 不得越界 |
|---|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | active formal upstream | FR/BR/NFR、responsibility、security/data/dependency/acceptance intent | 不重新定义需求或验收结论 |
| `projects/L3-capability-hub/01-架构设计.md` | active formal upstream | bounded ownership、dependency direction、container、consistency/security/observation redlines | 不重选 architecture/product |
| `projects/L3-capability-hub/02-概要设计.md` | active formal upstream | component/object/interface/flow/state/error/config outline | 不自行细化为新代码契约 |
| `projects/L3-capability-hub/03-详细设计.md` | direct active input | 7 modules、objects、Ports、protocols、83 flows、24/111/638 state、transaction/error/idempotency/config/observation/test cuts | 不发明 field/variant/method/error/state/phase/oracle |
| `design-calibration/03_ddd_step_16_test_cuts.md` | normative exact test-cut source | minimum module/object/protocol/flow/state/transaction/binding/observation cuts and oracle precedence | 不将 planned cut 声称为 executed case |
| `projects/L3-capability-hub/04-配置设计.md` | direct active input | source/profile/item/secret/assembly/failure/change/unsupported-control test obligations | 不改 key/default/profile/failure/fallback |
| `design-calibration/04_config_step_11_failure_degradation.md` | exact configuration-failure source | `CFG-F-01..18` 和 24 failure modes | 不将 test cut 写成已通过 |
| `design-calibration/04_config_step_12_downstream_handoff.md` | exact 05 handoff source | test object/minimum oracle/evidence lifecycle obligations | 不生成真实 `TC/EV/run` 记录 |
| `projects/L3-capability-hub/05-测试方案.md` | historical material until Step 15 replacement | 只用于识别旧编号、旧对象和污染 | 不是当前 test scope/case/oracle/evidence authority |
| `projects/L3-capability-hub/06-验收标准.md` | historical direction input | 只提醒验收关注方向 | 不定义当前 pass/veto/evidence/signoff |
| L1-governance / L3-method-library `05_test_plan_*` | framework/granularity reference | 参考 Step 结构、长用例分批和门禁粒度 | 不复制领域对象、用例、阈值、环境或证据 |

## 3. Historical-material disposition

| Historical material | Conflict with active baseline | Disposition |
|---|---|---|
| old `05-测试方案.md` metadata/12-section shape | 不符合当前 15-chapter standard，且含旧 author/status template | preserve only as historical diagnostic until Step 15 replaces the file |
| `MCPServer` / `A2ANode` / `ProviderContract` / `CapabilityDecision` / `CostRecord` truth model | 与当前 capability identity/registry/descriptor/relation/exposure/reference model 冲突 | do not map or rename; rebuild from formal 03 exact objects |
| KMS/Vault/local PG/bus/runtime-tools/marketplace concrete topology | product and responsibility facts are unselected/out of scope | no environment inheritance; future product prerequisites remain unselected |
| old `TC-001..TC-012` | 没有 current flow/source/oracle/evidence contract，且测试旧业务对象 | retire as historical IDs; no alias to new `TC-*` |
| old pass language, thresholds and evidence list | 不存在 run/report/evidence provenance | never claim executed/passed; rebuild evidence placeholders in Steps 6/9/13 |
| old formal 06 | acceptance truth source not yet rebuilt | direction-only input; cannot define current expected decision |
| README execution/provider/cost/approval shorthand | formal 00~04 responsibility redlines outrank it | negative leakage audit only; final README disposition is T070 |

旧 formal 05 未被原位 patch、不沿用 TC 编号，也未通过同义词转换把旧对象重新引入；Step 15 已用Steps 1~14的active结论整体替换，旧内容继续仅作historical material。

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | [x] completed; active 00~04/cut-source authority, 12 must-answer, 7 forbidden decisions, historical contamination=0 and writeback/blocker gate closed |
| Step 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | [x] completed; 12 goals, P0/P1/P2 semantics, core/seam/out-of-scope matrix, 7 veto candidates and no-writeback gate closed |
| Step 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | [x] completed; 171 exact DDD cuts + 18 CFG-F obligations, 83/24/22/12/12 inventories, family stop-review and cross-source audit closed |
| Step 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | [x] completed; seven risk-discovery layers, primary/secondary placement, earliest-discovery, selected-entry smoke and no-duplicate authority closed |
| Step 5 | 建立需求/设计/配置追溯与覆盖 | `05_test_plan_step_05_traceability_coverage.md` | [x] completed; 16 FR + 37 BR + 20 NFR, 37 AC + 13 VF direction, 171 exact DDD cuts + 18 CFG-F cuts, bidirectional orphan/duplicate/automation/evidence audit closed |
| Step 6 | 设计测试场景与可执行用例矩阵 | `05_test_plan_step_06_cases.md` | [x] completed; 189 canonical TC/DR/EVC records, 83 exact flows, 24 state families, 638-pair registry contract, 22 TX, 12 binding, 12 observation and 18 CFG-F cases closed |
| Step 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | [x] completed; 189 unique DR-to-DS logical bundles, 12 deterministic primitive classes, 638 exact state-pair source, 5 immutable report formations, isolation/cleanup/substitute and cross-data audits closed |
| Step 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | [x] completed; 7 environment contracts, 3 formal profiles, 3 entries, compile/runtime/event topology, exact config placement, 189-DS allocation and unavailable handling closed |
| Step 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | [x] completed; 10-suite exact 189-TC/DS/EVC-candidate partition, 638 main state pairs, 5 gates, 9 checks, 4 reports, raw/report contracts, P0 manual gap 0 and cross-suite audit closed |
| Step 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | [x] completed; 20/20 NFR mapped to six specialties, structural performance gates separated from numeric not-evaluated samples, 22 TX/18 CONFIG/exact observation inventories and security/responsibility redlines closed |
| Step 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | [x] completed; seven observation classes, S/A/B severity, all 13 vetoes non-waivable S, 10-suite/9-check triage, change-aware retest, distinct old/new run evidence and automation-reopen policy closed |
| Step 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | [x] completed; design/P0/selected/release gates separated, 77 future execution criteria left unchecked, exact 189/638/10-suite/9-check denominator and pause/invalidation rules closed |
| Step 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | [x] completed; 189 EVC-to-EV contracts, exact ten-suite partition, raw/report/index schemas, AC 37/37 + VF 13/13 consumers, redaction/pairing/no-static/review and event-based retention closed without evidence fabrication |
| Step 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | [x] completed; R0~R4 levels, 13 change surfaces, 12 full-main triggers, exact 189/638/10-suite/9-check denominator, 16 classified prerequisite/risk rows and never-acceptable rules closed with zero accepted-risk fabrication |
| Step 15 | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | [x] completed；15 chapters、189 TC/DS/EV、638 pairs、automation/evidence/regression/truthfulness audits closed |

## 5. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|
| Step 15 `整理正式测试方案文档` | formal 05 rebuilt and final static audit closed | `design_task_completed` | Formal 05 has 15 chapters and the `189/638/10/5/9/4` design contracts; no execution/evidence/acceptance fact is claimed. Subsequent `06~07` and T070/T071/T072 are complete. | `wait_for_authorized_implementation_handoff` | `project_execution_ledger.md`;正式 `05~07`;`T071_full_restart_final_audit.md` |

## 6. 执行纪律

- 每个 Step 独立创建中间产物；当前用户已授权按 `/tmp/L3-capability-hub_full_restart_remaining_tasks.md` 连续执行并逐项勾选。
- Step 开工/继续时先读 project ledger、本 flow、当前 Step artifact，再读 SOP 和上游 source；不允许跳步写 formal 05。
- 每个 Step 必须包含目标/输入/输出、SOP 问题回答、问题诊断、改动前后、取舍、结构化产物、上游影响、formal 回填草稿、待确认事项和 next gate。
- Step 3 先定义 cut inventory；Step 6 才分配稳定 `TC-*`、完整 precondition/action/oracle/evidence-placeholder contract；Step 13 才定义 report/archive lifecycle。
- 每个 P0 cut 以 exact formal design term 命名；不使用旧 `TC-001..012`、口语状态、旧 object 或旧 product topology。
- 测试方案不得修改 object/schema/Port/DTO/flow/state/transaction/error/config/observer contract；发现不可验证缺口时记 `待回写` 或 `阻塞待确认`并重开 owning 03/04 Step。
- Rust source/static documentation cut 必须覆盖每个 public declaration、struct 及每个 field、enum variant 及 payload field、trait/method/callable 的英文 `///`；enum struct variant fields 不写 `pub`。
- 不创建实现仓代码、CI YAML、gate/report script、artifact/report 目录或真实 evidence；正式 07 只能引用本设计的 future gate contract。
- `scripts/gates/*`、`artifacts/test/<run_id>/`、`reports/runs/<run_id>/` 和 `reports/acceptance/` 只作 future path contract；目标仓不存在时不声称路径已创建。
- runtime/tools execution、marketplace listing、governance approval、method body/source lifecycle、provider route/cost/failover、SDK delivery/client/cache 仅能是责任泄漏负向断言，不是 Hub 正向 E2E 测试对象。

## 7. 初始测试契约库存

| Inventory | Active count / identity | Formal 05 obligation |
|---|---:|---|
| workspace/module cuts | `7` + dependency/doc cuts | exact static/unit/service/integration owner |
| HLD objects + application helpers | `43 + 7` | constructor/invariant/canonical-body-free positive and negative cuts |
| public protocol types | `250` | stable codec/schema/required/forbidden-field cuts |
| Ports | `36 = 27 local/base + 9 external`; external callables `14` | contract/fake/Disabled/Missing/failure parity |
| repositories | `22 traits / 110 methods` | parameterized authority/CAS/index/page/order/fake-durable parity |
| flows | `83 = 26 C + 33 Q + 6 I + 10 O + 8 J` | each exact flow at least positive + abnormal; shared effect oracles |
| state-like families | `24 / 111 active variants / 638 pairs` | current/reserved/illegal/same-state/terminal matrix tests |
| transaction/concurrency cuts | `22` | UoW three-state commit, rollback, duplicate, race, crash/reentry, winner preservation |
| config/binding cuts | `12` plus `CFG-F-01..18` | parser/source/profile/item/secret/assembly/barrier/failure/frozen controls |
| observability cuts | `12`; 60 log/48 metric/27 span/3 event/20 durable profiles | Off/Redacted, exact owner/cardinality/no-cancellation/no-body |
| configuration inventory | `18 modules / 27 rows / 21 env leaves / 9 slots / 6 sources / 10 routes / 3 profiles / 24 modes` | positive/negative/boundary and no-fallback coverage |

## 8. 测试 truthfulness 与影响门禁

| Statement type | Allowed in Steps 1~15 | Forbidden before real execution |
|---|---|---|
| planned case/cut | stable ID、precondition、action、oracle、data、layer、future command/path contract | case exists in code / passed |
| evidence contract | placeholder ID/class、producer/consumer、schema/path/retention/redaction requirements | real alias、digest、run_id、artifact/report existence |
| gate | trigger、required planned suites、blocking semantics、missing-evidence behavior | CI configured/enforced/green |
| environment | product-neutral topology/profile/config/fixture prerequisites | endpoint/credential/product deployed or reachable |
| result | `not_executed` / `not_evaluated` only where status is needed | pass/fail/coverage/performance/release decision |

每个 Step 使用下表判定上游影响：

| Test conclusion | Changes 00~04? | Impact type | Required treatment |
|---|---|---|---|
| exact test translation of existing contract | no | test-only | `无回写` |
| missing/unobservable formal oracle or contradictory source | yes | design/config gap | stop affected cut; `待回写` / `阻塞待确认`; reopen exact owner |
| future product/repository/environment fact absent | no current design impact | implementation/operations prerequisite | retain blocker scope; no fabricated resolution |

## 9. 当前 next_allowed_action

```text
document = 05-测试方案.md
flow = completed
current_step = 15_completed
next_allowed_action = initialize_06_acceptance_full_restart_flow
formal_05_authority = active_design_baseline
unresolved_upstream_blocker = none
commit_required = no
```
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `05-测试方案.md` |
| document_status | `test-plan design completed` |
| current_step | `Step 15 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
