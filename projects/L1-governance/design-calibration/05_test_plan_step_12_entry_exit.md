# Step 12. 定义进入准则与退出准则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节: `05-测试方案.md` §12 进入准则与退出准则

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义进入准则与退出准则 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 测试数据;Step 8 环境配置;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_12_entry_exit.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

定义本轮测试什么时候可以开始、什么时候可以结束、什么时候必须暂停或阻断退出。

本 Step 只回答:

- 开始测试前哪些文档和设计基线必须可用。
- 哪些环境、数据、fake / controlled adapter 和配置 profile 必须可用。
- 哪些自动化 suite 和 check 必须可运行。
- 退出时哪些 P0 用例、VF 红线、suite、缺陷和报告必须满足。
- 哪些 P1/P2 或残余风险可以不阻断 P0 退出,但必须记录接受人。

本 Step 不生成正式 EV 编号,不生成 `reports/acceptance`,不裁决验收 pass。Step 13 负责证据归档结构,新版 `06-验收标准.md` 负责验收裁决。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_07_test_data.md` | 已完成 | 提供 DS-GOV-* 数据集、隔离和清理规则 |
| `05_test_plan_step_08_environment_config.md` | 已完成 | 提供 P0 profile、环境矩阵、依赖类型和不可用处理 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 P0 blocking suite、artifact/report 输出和 gate checks |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 P0 非功能专项、redaction/dependency/no-truth-repair 阻断规则 |
| `05_test_plan_step_11_defects_retest.md` | 已完成 | 提供 S/A/B/R 缺陷分级、复验和风险接受规则 |
| `测试方案书写规范.md` §5.12 | 标准输入 | 提供进入 / 退出准则可判定格式 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始测试前哪些文档必须冻结? | 新版 `00/01/02/03/04` 已作为测试真相源;`05` Step 1~12 中间产物均已完成;旧 `05/06` 仅作历史输入。若 `03/04` 有影响 P0 DTO、state、flow、port、config、redaction 或 gate 的变更,必须重新审查受影响 Step。 |
| 哪些环境和数据必须可用? | P0 必须可用 `ci-test`、`integration-like`、`operations-replay` profile;DS-GOV-* P0 数据集必须可构造、隔离和清理;fake / controlled / disabled adapters 必须可装配;redaction leak corpus 和 dependency metadata 必须可用。 |
| 哪些自动化必须可运行? | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`release-main-smoke`、`report-generation-audit` 及 release checks 必须可运行。 |
| 退出时哪些用例必须通过? | 所有 P0 TC-GOV-* 用例族必须通过或有明确非 P0 降级依据。VF-GOV-001~010 对应负向测试和 release checks 必须通过。性能候选数字不作为退出阈值,但 duration/count sample 必须存在。 |
| 哪些缺陷和风险会阻断退出? | 任一 S 级缺陷、未关闭的 P0 redaction/dependency/evidence integrity 问题、P0 blocking suite 失败、缺 raw artifact/report pairing、静态伪 evidence、P0 环境不可用伪 pass、A 级未接受且影响 P0 release 的缺陷都会阻断退出。P1/P2 selected-run unavailable 可不阻断 P0,但必须记录残余风险和接受人。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7~11 | 已定义数据、环境、自动化、专项和缺陷,但缺总体开始 / 结束门禁 | 本 Step 汇总成可判定准则 |
| Step 9 | reports/acceptance 未定义 | 本 Step 不要求正式 acceptance report,只要求 run reports / evidence candidates 可用 |
| Step 10 | 性能候选容易被误写成退出阈值 | 本 Step 明确只要求 sample 存在 |
| Step 11 | 风险接受已有规则,但未进入退出准则 | 本 Step 要求残余风险有接受人 |
| 旧 `05/06` | 旧进入 / 退出口径不可继承 | 不继承旧准则 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入准则 | 分散在数据、环境、门禁 Step | 汇总为 checklist | 测试开始条件可判定 |
| 退出准则 | 只有用例 / 缺陷 / report 方向 | 汇总 P0 用例、VF、suite、defect、candidate evidence | 测试结束条件可判定 |
| P1/P2 | 容易被误当退出阻断 | 仅作为 residual / selected-run | 保持 P0 边界 |
| 性能 | 候选数字可能阻断退出 | 只要求 sample/trend 存在 | 无正式阈值 |
| Evidence | 可能提前要求正式 EV | 只要求 EV-CAND/run report,正式 EV 留 Step 13 | 遵守 SOP |

## 7. 进入 / 退出设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 进入前是否需要正式 `05` 已装配 | A. 需要;B. 不需要,Step 中间产物可作为测试方案草案 | 采用 B。正式 `05` 在 Step 15 装配 |
| 退出是否要求 Step 13 正式 EV | A. 要求;B. 当前只要求 evidence candidate/run report 可用 | 采用 B。Step 13 才定义正式归档 |
| P1 selected-run unavailable 是否阻断退出 | A. 阻断;B. 不阻断,记录 residual | 采用 B。P1 非 P0 前置 |
| A 级缺陷是否都阻断 | A. 全部阻断;B. 影响 P0 release 的阻断,否则需接受人 | 采用 B。保持可执行性和风险透明 |
| 性能 sample 缺失是否阻断 | A. 阻断;B. 阻断 sample 缺失,不阻断候选数字未达 | 采用 B。证据必须有,硬阈值未定义 |

## 8. 结构化中间产物

### 8.1 进入准则

- [ ] 新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已确认作为测试输入基线。
- [ ] `05_test_plan_step_01_input_boundary.md` 到 `05_test_plan_step_12_entry_exit.md` 中间产物均已完成并通过用户审查。
- [ ] 若 `03/04` 自上次审查后发生影响 P0 contract/state/flow/config/redaction/gate 的变更,受影响 Step 已重新审查。
- [ ] P0 用例矩阵中的 TC-GOV-* 用例族均有数据前置、断言点、自动化候选和 EV-CAND 候选证据。
- [ ] DS-GOV-* P0 数据集可通过 fixture / builder / seed 构造,并具备 run namespace 隔离和清理规则。
- [ ] `ci-test`、`integration-like`、`operations-replay` profile 可装配,并使用 fake / controlled / disabled adapters。
- [ ] P0 不依赖真实 sibling repo、真实 DB / bus / search / object storage / secret provider / external GRC 产品。
- [ ] redaction leak corpus、safe output corpus、dependency metadata 和 write-audit / fault injection fixture 可用。
- [ ] `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary` 可运行。
- [ ] gate scripts 支持 `--run-id`、`--artifact-root`、`--config-profile`;report scripts 支持 `--report-root`。
- [ ] artifact root 使用 `artifacts/test/<run_id>`;report root 使用 `reports/runs/<run_id>`;不得使用 `latest`。
- [ ] 缺陷分级、S 级阻断、风险接受、复验矩阵和自动化防回归规则已确认。

### 8.2 退出准则

- [ ] 所有 P0 TC-GOV-* 用例族通过,或明确属于 P1/P2 / future / residual 且不影响 P0 truth。
- [ ] VF-GOV-001~010 对应正负向测试、redaction check、dependency check、query/job no truth repair、release smoke 均通过。
- [ ] 所有 P0 blocking suite 通过:`contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`release-main-smoke`、`report-generation-audit`。
- [ ] `check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 均通过。
- [ ] `release-main-smoke` 输出业务场景级断言,不是仅输出通用测试计数。
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
| fake / controlled adapter 缺失 required failure injection | 阻断相关 suite;补测试工具或回写实现计划 |
| S 级缺陷出现 | 阻断退出;修复并按 Step 11 复验 |
| redaction / dependency / report audit failed | 阻断退出;不得风险接受 |
| evidence candidate 无 raw artifact 来源 | 阻断退出;补 artifact/report pairing |
| P1 selected-run unavailable | 不阻断 P0;记录 residual/unavailable |
| 旧性能候选数字未达但 sample 存在 | 不阻断 P0;记录 Step 14 残余风险 |

### 8.4 进入准则来源追溯表

| 准则组 | 来源 | 说明 |
|---|---|---|
| 文档基线 | Step 1~5;`00/01/02/03/04` | 测试输入真相源明确 |
| 用例和数据 | Step 6~7 | TC-GOV-* and DS-GOV-* 可执行 |
| 环境和配置 | Step 8 | P0 profile and fake/controlled/disabled seams |
| 自动化 | Step 9 | blocking suite and artifact/report roots |
| 专项 | Step 10 | redaction、dependency、no truth repair、performance sample |
| 缺陷复验 | Step 11 | S/A/B/R and risk acceptance |

### 8.5 退出准则来源追溯表

| 准则组 | 来源 | 说明 |
|---|---|---|
| P0 用例通过 | Step 6 / Step 9 | 所有 P0 TC-GOV-* 有 suite |
| VF 红线通过 | Step 5 / Step 10 / Step 11 | VF-GOV-001~010 不可降级 |
| suite / check 通过 | Step 9 | blocking suite and release checks |
| 缺陷为零或已接受 | Step 11 | S=0,A accepted or fixed |
| report / evidence candidate | Step 9 / Step 13 pending | 退出前需要 run report and EV-CAND,正式 EV Step 13 |
| residual 风险 | Step 2 / Step 10 / Step 14 pending | P1/P2 不阻断,但必须记录接受人 |

### 8.6 进入 / 退出停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 进入准则是否可判定 | 通过 | 均为 checklist |
| 退出准则是否可判定 | 通过 | 均为 checklist |
| 是否避免“基本完成”措辞 | 通过 | 无模糊项 |
| 是否提前要求正式 EV | 通过 | 只要求 EV-CAND/run report |
| 是否把 P1/P2 写成 P0 阻断 | 通过 | 只记录 residual |
| 是否覆盖缺陷阻断 | 通过 | S/A/B/R 承接 Step 11 |

### 8.7 跨准则审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档、数据、环境、自动化、缺陷规则是否均进入进入准则 | 通过 | §8.1 |
| P0 用例、VF、suite、check、缺陷、report 是否均进入退出准则 | 通过 | §8.2 |
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

- 进入准则必须确认设计基线、Step 中间产物、P0 用例数据、P0 profile、fake / controlled adapters、自动化 suite、artifact/report 根目录和缺陷规则均可用。
- 退出准则必须确认 P0 用例、VF 红线、P0 blocking suite、release checks、raw artifact/report pairing、S/A 缺陷状态和 residual 风险均可判定。
- P0 环境不可用、redaction / dependency / report audit failed、S 级缺陷、静态 evidence 或缺 raw artifact 都阻断退出。
- P1 selected-run unavailable、旧性能候选数字未达、production-like/capacity 风险不阻断 P0,但必须记录 residual 和接受人。
- 正式 EV 编号和 `reports/acceptance` 不在本章固定,由 Step 13 和新版 `06` 承接。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 进入测试是否必须等待 Step 15 正式文档 | 影响实际执行排期 | 当前不要求;Step 中间产物已足够启动测试设计 / 实施准备 |
| 正式 EV 是否成为最终退出条件 | 影响 Step 13 / 06 | 当前只要求 EV-CAND;Step 13 再定 |
| P1 selected-run 是否在某 release 变为强制 | 影响退出准则 | 当前非 P0;若升级需回写 |
| 验收方是否要求 S 级关闭签字 | 影响退出裁决 | 新版 `06` 可继续补充 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入 / 退出准则无模糊项 | 通过 | 均为可判定 checklist |
| P0 阻断条件明确 | 通过 | 见 §8.3 |
| P1/P2 residual 不误阻断 P0 | 通过 | 见 §8.2 / §8.3 |
| 未提前固定正式 EV | 通过 | Step 13 承接 |
| 可进入 Step 13 | 通过 | 下一步定义测试报告与证据归档;进入前等待用户审查 |
