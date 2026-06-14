# Step 12. 定义进入准则与退出准则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节: `05-测试方案.md` §12 进入准则与退出准则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义进入准则与退出准则 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 7 测试数据;Step 8 环境配置;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_12_entry_exit.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

定义 L1-identity 测试什么时候可以开始、什么时候可以结束、什么时候必须暂停或阻断退出。

本 Step 只回答:

- 开始测试前哪些文档、Step 中间产物和设计基线必须可用。
- 哪些 P0 profile、数据集、fake / controlled / disabled adapter 和配置必须可装配。
- 哪些自动化 suite、check 和 report script 必须可运行。
- 退出时哪些 `TC-ID-*`、`VETO-ID-*`、suite、check、缺陷和 report 必须满足。
- 哪些 P1/P2、future 或 residual 风险不阻断 P0,但必须记录接受人。

本 Step 不生成正式 `EV-*` 编号,不定义 raw artifact JSON schema,不生成 `reports/acceptance`,不裁决验收 pass。Step 13 负责证据归档结构,新版 `06-验收标准.md` 负责验收裁决。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已审核通过 | 提供 P0 / P1 / P2、非范围和 residual 风险边界 |
| `05_test_plan_step_05_traceability_coverage.md` | 已审核通过 | 提供 C-ID / FR-ID / BR-ID / NFR-ID / AC-ID / VETO-ID 到测试切口的追溯 |
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 `TC-ID-*` 用例、断言和 `EV-CAND-ID-*` 候选证据 |
| `05_test_plan_step_07_test_data.md` | 已审核通过 | 提供 `DS-ID-*` 数据集、隔离和清理规则 |
| `05_test_plan_step_08_environment_config.md` | 已审核通过 | 提供 P0 profile、依赖类型、环境不可用和 no fake success 规则 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 提供 blocking suite、gate/check/report scripts、artifact/report 根目录 |
| `05_test_plan_step_10_nonfunctional.md` | 已审核通过 | 提供 redaction、dependency、query no-write、job no-repair、performance sample 和 fake parity 红线 |
| `05_test_plan_step_11_defects_retest.md` | 已审核通过 | 提供 S/A/B/R 缺陷分级、复验矩阵、风险接受和自动化防回归规则 |
| `测试方案书写规范.md` §5.12 | 标准输入 | 提供进入 / 退出准则必须可判定的格式约束 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始测试前哪些文档必须冻结? | 新版 `00/01/02/03/04` 已作为测试真相源;`05` Step 1~12 中间产物均已完成并审核。若 `03/04` 自审核后发生影响 P0 DTO、state、flow、port、config、redaction、gate 或 evidence candidate 的变更,必须重新审查受影响 Step。 |
| 哪些环境和数据必须可用? | `ci-test`、`integration-like`、`operations-replay` profile 必须可装配;`local-dev` 可用于本地调试但不作为 release evidence。`DS-ID-*` P0 数据集必须可构造、隔离和清理;fake / controlled / disabled adapters、write-audit repository、fixed clock/id、redaction corpus 和 dependency metadata 必须可用。 |
| 哪些自动化必须可运行? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`release-main-smoke`、`report-generation-audit` 以及 release checks 必须可运行并产出 artifact/report。 |
| 退出时哪些用例必须通过? | 所有 P0 `TC-ID-*` 用例族必须通过,或明确被降级为 P1/P2 / future / residual 且不影响 P0 truth。`VETO-ID-001~006` 对应正负向测试和 release checks 必须通过。性能候选数字不作为退出阈值,但 duration/count sample 必须存在。 |
| 哪些缺陷和风险会阻断退出? | 任一 S 级缺陷、未接受且影响 P0 release 的 A 级缺陷、P0 blocking suite 失败、redaction / dependency / report audit failure、raw artifact/report pairing 缺失、静态 evidence pass、P0 profile 不可用伪 pass、query write 或 job truth repair 均阻断退出。P1 selected-run unavailable 和 P2 future risk 不阻断 P0,但必须记录 residual 和接受人。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7~11 | 已定义数据、环境、自动化、专项和缺陷,但缺总体开始 / 结束门禁 | 本 Step 汇总成可判定 checklist |
| Step 9 | 已固定 run artifact/report 根目录,但正式 evidence index 尚未定义 | 本 Step 只要求 run report 和 `EV-CAND-ID-*`,正式 EV 留 Step 13 |
| Step 10 | 性能 sample 与旧候选数字容易被误写为硬阈值 | 本 Step 明确 sample 缺失才阻断,旧候选数字未达不阻断 |
| Step 11 | 风险接受和复验规则已定义,但未进入退出准则 | 本 Step 固定 S/A/B/R 与退出关系 |
| P1/P2 | selected-run、production-like、capacity 容易被误作 P0 必过 | 本 Step 明确只记录 residual,不得伪装 P0 pass |
| 旧 `05/06` | 旧进入 / 退出口径不能裁决新版 P0 | 不继承旧准则 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入准则 | 分散在数据、环境、自动化和缺陷 Step | 汇总成 checklist | 开始条件可判定 |
| 退出准则 | 只有用例、suite、缺陷和 report 方向 | 汇总 P0 用例、VETO、suite、check、defect、artifact/report、residual | 结束条件可判定 |
| P1/P2 | 容易被误当 P0 阻断 | 不阻断 P0,但必须记录 residual | 保持范围边界 |
| 性能 | 候选数字可能被当作 pass/fail | 只要求 duration/count sample | 无正式硬阈值来源 |
| Evidence | 可能提前固定正式 EV | 只要求 `EV-CAND-ID-*` 和 run reports | 遵守 Step 13 分工 |

## 7. 进入 / 退出设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 进入前是否需要正式 `05` 已装配 | A. 需要;B. 不需要,Step 中间产物可作为测试方案草案 | 采用 B。正式 `05` 在 Step 15 装配 |
| 退出是否要求 Step 13 正式 EV | A. 要求;B. 当前只要求 evidence candidate 和 run report 可用 | 采用 B。Step 13 才定义正式归档 |
| `local-dev` 是否能作为 release evidence | A. 可以;B. 不可以,只作本地调试 | 采用 B。release evidence 必须来自固定 run 和 P0 profile |
| P1 selected-run unavailable 是否阻断 P0 | A. 阻断;B. 不阻断,记录 residual | 采用 B。P1 非 P0 前置 |
| A 级缺陷是否全部阻断 | A. 全部阻断;B. 影响 P0 release 的阻断,否则需接受人 | 采用 B。保持可执行性和风险透明 |
| 性能候选数字未达是否阻断 | A. 阻断;B. 不阻断,但缺 sample 阻断 | 采用 B。证据必须有,硬阈值未定义 |

## 8. 结构化中间产物

### 8.1 进入准则

- [ ] 新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已确认作为测试输入基线。
- [ ] `05_test_plan_step_01_input_boundary.md` 到 `05_test_plan_step_12_entry_exit.md` 中间产物均已完成并通过用户审查。
- [ ] 若 `03/04` 自上次审查后发生影响 P0 contract/state/flow/port/config/redaction/gate 的变更,受影响 Step 已重新审查。
- [ ] P0 `TC-ID-*` 用例族均有数据前置、断言点、自动化候选和 `EV-CAND-ID-*` 候选证据。
- [ ] `DS-ID-*` P0 数据集可通过 fixture / builder / seed 构造,并具备 run namespace 隔离、fake reset 或 isolated fixture delete 规则。
- [ ] `ci-test`、`integration-like`、`operations-replay` profile 可装配;`local-dev` 仅作为本地调试,不作为 release evidence。
- [ ] P0 不依赖真实 sibling repo、真实 DB / bus / archive / object storage / secret provider / observability backend / HR / IdP 产品。
- [ ] fake / controlled / disabled adapters、write-audit repository、fixed clock/id、redaction corpus、dependency metadata 和 fault injection fixture 可用。
- [ ] `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary` 可运行。
- [ ] release 入口可运行 `release-main-smoke`、`config-redline`、`redaction-boundary`、`dependency-boundary` 和 `report-generation-audit`。
- [ ] `scripts/gates/run_ci_gate.sh`、`scripts/gates/run_release_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/reports/build_gate_summary.sh`、`scripts/reports/build_evidence_candidates.sh` 有明确输入输出口径。
- [ ] `scripts/checks/check_redaction.sh`、`scripts/checks/check_dependency_boundary.sh`、`scripts/checks/check_artifact_report_pairing.sh`、`scripts/checks/check_no_static_evidence.sh` 可运行。
- [ ] artifact root 使用 `artifacts/test/<run_id>`;report root 使用 `reports/runs/<run_id>`;不得使用 `latest`。
- [ ] 缺陷分级、S 级阻断、风险接受、复验矩阵和自动化防回归规则已确认。

### 8.2 退出准则

- [ ] 所有 P0 `TC-ID-*` 用例族通过,或明确属于 P1/P2 / future / residual 且不影响 P0 truth。
- [ ] `VETO-ID-001~006` 对应正负向测试、redaction check、dependency check、query no-write、job no-repair 和 release smoke 均通过。
- [ ] 所有 P0 blocking suite 通过:`contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`release-main-smoke`、`report-generation-audit`。
- [ ] `check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 均通过。
- [ ] `release-main-smoke` 输出 identity 主闭环的业务场景级断言,不是仅输出通用测试计数。
- [ ] 所有 blocking suite 均有 raw artifact 和 run report 配对。
- [ ] `reports/runs/<run_id>/gate-summary.md`、suite reports、redaction-check、dependency-boundary、report-audit 和 evidence-candidates 可生成。
- [ ] 当前无未关闭 S 级缺陷。
- [ ] 当前无未接受且影响 P0 release 的 A 级缺陷。
- [ ] B/R 或 P1/P2 residual 风险均记录接受人、影响范围和后续触发条件。
- [ ] 性能结构性 sample 存在;旧 P95/SLA 候选未达不作为 P0 退出失败。
- [ ] 未发现静态 JSON 直接宣告 EV/VETO pass、缺 raw artifact 的 report、或使用 `latest` 作为证据来源。

### 8.3 暂停 / 阻断准则

| 触发 | 处理 |
|---|---|
| 发现 `03/04` 设计闭口缺失导致 P0 用例无法构造 | 暂停测试设计或执行,回写设计后复审受影响 Step |
| P0 profile 无法装配 | 阻断进入或退出;不得 fallback 为 pass |
| fake / controlled adapter 缺失 required failure injection | 阻断相关 suite;补测试工具或回写实施计划 |
| S 级缺陷出现 | 阻断退出;修复并按 Step 11 复验 |
| redaction / dependency / report audit failed | 阻断退出;不得风险接受 |
| evidence candidate 无 raw artifact 来源 | 阻断退出;补 artifact/report pairing |
| query 出现 truth/idempotency/trace/audit/outbox/projection/reference/report 写副作用 | 阻断退出;按 S 级处理 |
| job 修复 `GlobalMember`、lifecycle、role、career、memory truth | 阻断退出;按 S 级处理 |
| P1 selected-run unavailable | 不阻断 P0;记录 residual/unavailable |
| 旧性能候选数字未达但 sample 存在 | 不阻断 P0;记录 Step 14 残余风险 |

### 8.4 进入准则来源追溯表

| 准则组 | 来源 | 说明 |
|---|---|---|
| 文档基线 | Step 1~5;`00/01/02/03/04` | 测试输入真相源明确 |
| 用例和数据 | Step 6~7 | `TC-ID-*` and `DS-ID-*` 可执行 |
| 环境和配置 | Step 8 | P0 profile and fake / controlled / disabled adapters |
| 自动化 | Step 9 | blocking suite、check scripts and artifact/report roots |
| 专项 | Step 10 | redaction、dependency、no truth repair、performance sample |
| 缺陷复验 | Step 11 | S/A/B/R and risk acceptance |

### 8.5 退出准则来源追溯表

| 准则组 | 来源 | 说明 |
|---|---|---|
| P0 用例通过 | Step 6 / Step 9 | 所有 P0 `TC-ID-*` 有 suite 或 check |
| VETO 红线通过 | Step 5 / Step 10 / Step 11 | `VETO-ID-001~006` 不可降级 |
| suite / check 通过 | Step 9 | blocking suite and release checks |
| 缺陷为零或已接受 | Step 11 | S=0,A accepted or fixed |
| report / evidence candidate | Step 9 / Step 13 pending | 退出前需要 run report and `EV-CAND-ID-*`;正式 EV Step 13 |
| residual 风险 | Step 2 / Step 10 / Step 14 pending | P1/P2 不阻断,但必须记录接受人 |

### 8.6 进入 / 退出停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 进入准则是否可判定 | 通过 | 均为 checklist |
| 退出准则是否可判定 | 通过 | 均为 checklist |
| 是否避免“基本完成”措辞 | 通过 | 无模糊项 |
| 是否提前要求正式 EV | 通过 | 只要求 `EV-CAND-ID-*` and run report |
| 是否把 P1/P2 写成 P0 阻断 | 通过 | 只记录 residual |
| 是否覆盖缺陷阻断 | 通过 | S/A/B/R 承接 Step 11 |
| 是否禁止静态 evidence pass | 通过 | release checks 阻断 |

### 8.7 跨准则审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档、数据、环境、自动化、缺陷规则是否均进入进入准则 | 通过 | §8.1 |
| P0 用例、VETO、suite、check、缺陷、report 是否均进入退出准则 | 通过 | §8.2 |
| 环境不可用是否禁止伪 pass | 通过 | P0 profile fail blocks |
| evidence 是否要求真实 artifact | 通过 | raw artifact/report pairing required |
| 性能候选是否未误阻断 | 通过 | sample required,threshold not |
| 进入 / 退出准则是否无 unresolved 冲突 | 通过 | 当前未发现 |

## 9. 对上游设计的影响判定

| 准则结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| Step 中间产物可作为测试启动输入 | 否 | SOP 执行细化 | 正式 `05` 留 Step 15 |
| 正式 EV 不作为 Step 12 退出前置 | 否 | SOP 分工 | Step 13 继续固定 |
| P0 profile 不可用阻断测试 | 否 | 环境准则 | 符合 Step 8 |
| 如果设计闭口缺失导致 P0 用例无法构造 | 是 | 设计可验证性缺口 | 回写对应 `03/04` |
| 如果验收要求正式 EV 后才能退出测试 | 是 | 证据流程变更 | Step 13 / 新版 `06` 再收口 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_12_entry_exit.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“进入准则”“退出准则”“暂停 / 阻断准则”“进入准则来源追溯表”和“退出准则来源追溯表”小节,了解测试启动和结束门禁如何从数据、环境、自动化、专项和缺陷规则收敛。

正式 `05-测试方案.md` §12 应回填:

- 进入准则必须确认设计基线、Step 中间产物、P0 用例数据、P0 profile、fake / controlled / disabled adapters、自动化 suite、artifact/report 根目录和缺陷规则均可用。
- 退出准则必须确认 P0 用例、VETO 红线、P0 blocking suite、release checks、raw artifact/report pairing、S/A 缺陷状态和 residual 风险均可判定。
- P0 环境不可用、redaction / dependency / report audit failed、S 级缺陷、静态 evidence 或缺 raw artifact 都阻断退出。
- P1 selected-run unavailable、旧性能候选数字未达、production-like/capacity 风险不阻断 P0,但必须记录 residual 和接受人。
- 正式 EV 编号和 `reports/acceptance` 不在本章固定,由 Step 13 和新版 `06` 承接。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 进入测试是否必须等待 Step 15 正式文档 | 影响实际执行排期 | 当前不要求;Step 中间产物已足够启动测试设计 / 实施准备 |
| 正式 EV 是否成为最终退出条件 | 影响 Step 13 / 06 | 当前只要求 `EV-CAND-ID-*`;Step 13 再定 |
| P1 selected-run 是否在某 release 变为强制 | 影响退出准则 | 当前非 P0;若升级需回写 |
| 验收方是否要求 S 级关闭签字 | 影响退出裁决 | 新版 `06` 可继续补充 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入 / 退出准则无模糊项 | 通过 | 均为可判定 checklist |
| P0 阻断条件明确 | 通过 | 见 §8.3 |
| P1/P2 residual 不误阻断 P0 | 通过 | 见 §8.2 / §8.3 |
| 未提前固定正式 EV | 通过 | Step 13 承接 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 13 | 待用户确认 | 用户审核通过后进入 Step 13: 定义测试报告与证据归档 |
