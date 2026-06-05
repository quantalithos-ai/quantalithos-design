# Step 11. 定义缺陷管理与复验规则

> 本步定义 `05-测试方案.md` §11 的缺陷分级、升级、修复、复验和关闭规则。本步只定义测试方案层的缺陷处理契约,不做验收裁决、不批准风险接受、不改变 Step 9 / Step 10 已定义的阻断门禁。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 11 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §11 缺陷管理与复验规则 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 取得 `FR-WORK-*`、`BR-WORK-*`、`AC-WORK-*`、`TC-WORK-*`、`EV-WORK-*` 覆盖关系 |
| `05_test_plan_step_06_cases_matrix.md` | 取得 P0 用例矩阵、状态非法迁移、事务 / 幂等 / 恢复用例 |
| `05_test_plan_step_07_test_data.md` | 取得 fixture、fake seed、run-scoped isolation 和 cleanup 规则 |
| `05_test_plan_step_08_environment_config.md` | 取得 local-dev / ci-test / integration-like / operations-replay 环境不可用处理 |
| `05_test_plan_step_09_automation_gates.md` | 取得 PR / main / nightly / release gate、flaky / timeout / dependency failure 处理 |
| `05_test_plan_step_10_special_non_functional.md` | 取得安全红线、故障注入、可观测性和非功能证据要求 |
| `00-需求文档.md` §14 | 取得一票否决项和 `AC-WORK-001`~`029` |
| `04-配置设计.md` §8 / §11 / §12 | 取得 redaction、fail-fast / fail-closed、fake marker 和证据边界 |
| `测试方案讨论流程_SOP.md` Step 11 | 本步问题、期望表格和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些缺陷属于 S 级阻断? | 一票否决项、P0 核心闭环断裂、Work truth 被污染、相邻仓正文 / secret 泄露、query / projection / job 反写真相、幂等重复 truth、关键变化不可追溯、release redline gate failure、证据路径或 `latest` 命中均为 S 级。 |
| 哪些缺陷可以风险接受? | P0 S 级不得风险接受。A 级只能在不影响 P0 release gate、无一票否决、已有修复计划和残余风险证据时,进入 Step 14 残余风险评审;B / C 级可按排期处理。测试方案本步不批准风险接受。 |
| 修复后必须回归哪些用例? | 必须回归直接失败用例、同族 `TC-WORK-*`、受影响 suite、相关 NFR / CFG / OPS 用例、redaction / path / evidence checks,并按 defect impact matrix 增补 regression set。 |
| 缺陷关闭需要哪些证据? | 需要 root cause、修复 diff / design baseline、失败前 artifact、复验 run id、通过的 suite report、相关 `EV-WORK-*`、redaction / path / evidence index 结果和残余风险说明。 |
| 是否需要新增自动化防回归? | S 级和 A 级缺陷必须新增或更新自动化断言、fixture、gate check 或 evidence check。B 级按重复性和影响决定;C 级可只补文档或人工 checklist。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 9 | 已定义 gate 失败阻断,但没有缺陷分级和关闭证据 | 本步定义 S / A / B / C 分级、升级和复验证据 |
| Step 10 | 已定义非功能红线,但没有缺陷是否可风险接受的边界 | 本步明确 S 级和 redline 不可风险接受 |
| Step 6 | 用例矩阵有失败断言,但没有修复后回归范围 | 本步定义 direct / family / impacted suite / redline 的回归矩阵 |
| 旧 `05-测试方案.md` | 缺陷流程和新版 `EV-WORK-*` 证据编号不一致 | 本步重建 §11 回填草稿 |
| `06-验收标准.md` | 本 Step 撰写时仍是旧版草案;当前已生成正式 `06` | 历史风险已关闭;缺陷关闭事实源以正式 `06` 为准 |

## 5. 改动前后对比

| 维度 | Step 10 后 | Step 11 收敛后 |
|---|---|---|
| 缺陷级别 | 只有 gate / redline 失败口径 | S / A / B / C 分级和阻断关系明确 |
| 风险接受 | 未集中说明 | S 级不可接受;A 级只可进入 Step 14 残余风险评审 |
| 修复回归 | 只有 suite 失败处理 | 按缺陷类型映射 direct / family / impacted suite / redline / evidence |
| 关闭证据 | 有 `EV-WORK-*` 和 report 路径 | 缺陷关闭 checklist 明确 run id、artifact、report、root cause 和 evidence |
| 自动化补强 | 未定义何时新增 | S / A 必须新增或更新自动化防回归 |
| 上游影响 | 无 | 无;不新增测试用例编号、配置项、验收裁决或实现脚本 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只按测试失败严重度分 S / A / B | 简单 | 无法表达一票否决、证据污染、redaction 和 path redline | 不采用 |
| 方案 B: 按需求红线、P0 gate、数据归属、安全、幂等、可观测和证据路径综合分级 | 和 Step 5~10 追溯一致 | 分级表较长,需要严格关闭证据 | 采用 |
| 方案 C: 允许所有非功能缺陷走风险接受 | 方便 release | 安全 / redaction / idempotency 等 redline 会被稀释 | 不采用 |
| 方案 D: 每个缺陷都要求全量 P0 回归 | 保守 | 成本过高,反馈慢 | 不采用;S / A 按影响矩阵扩大回归,B / C 精准回归 |

采用方案 B,并用影响矩阵控制回归范围。

原因:

- `L1-work` 的风险不是单一功能失败,而是 Work truth、边界、证据和恢复链条被破坏。
- 缺陷分级必须直接引用 `FR / BR / AC / TC / EV` 追溯,不能只看单个测试函数是否失败。
- 风险接受属于 Step 14 / 06 验收层讨论,测试方案 Step 11 只定义可执行规则和证据条件。

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S | 一票否决、P0 核心闭环断裂、truth / security / evidence redline、release gate redline 或无法复核证据 | Work 保存相邻仓正文;raw secret 泄露;duplicate 产生第二 WorkItem;query 写 truth;`latest` 进入正式证据;`release-config-redline` 失败 | 立即阻断 PR / main / release;必须修复;必须新增自动化防回归;必须保留失败 artifact 和复验 evidence | 是 |
| A | P0 主线能力、P0 service / API / job 编排、状态机、事务、恢复或配置失败,但未触发一票否决 | `CreateWorkItem` happy path 失败;projection rebuild failed 后不能恢复;configured adapter unavailable surface 错误;main CI P0 suite 失败 | 阻断受影响 gate;优先修复;可进入 Step 14 残余风险评审但本步不批准接受;通常需要自动化补强 | 是,对相关 gate |
| B | P1/P2、非阻断专项、报告表达、文案、低风险 fixture 或局部测试稳定性问题 | staging-like smoke 失败;性能观察报告缺非必填字段;B 级 flaky 仅影响非阻断 nightly dry-run | 建缺陷并排期;修复后精准复验;重复出现或影响 P0 时升级为 A | 否,除升级场景 |
| C | 文档错字、非事实源说明、测试描述清晰度或不影响执行的整理项 | 中间产物措辞不统一;非正式注释 typo;表格排序不影响编号和证据 | 可随文档批次修复;复验为 diff review | 否 |

### 7.2 S 级一票否决映射表

| S 级触发 | 来源 | 典型检测 | 关闭前必须回归 |
|---|---|---|---|
| Work truth 被相邻仓或 query / projection / report 反写 | `BR-WORK-007`~`011`;`VF-WORK-006` | `FORMAL-002`;`QUERY-*`;`OPS-004`;repository no-write assertion | 直接用例 + 同族 `FORMAL` / `QUERY` / `OPS` + `service-all` |
| 保存相邻仓正文、runtime body、ImplementationPlan body、artifact / evidence body | `BR-WORK-017`~`024`;`VF-WORK-004/005` | forbidden body scan、DTO / event / report dump scan | `FORMAL-004`;`PROMOTE-004`;`config-redaction`;`release-config-redline` |
| raw secret / token / credential / payload 泄露 | `04` §8;Step 10 redline | `check_no_forbidden_output.sh`;redaction report | `CFG-010`~`012`;`NFR-003`;release redline |
| 重复输入产生重复正式事实 | `AC-WORK-028`;Step 13 幂等契约 | `CORE-004`;`NFR-004`;idempotency report | direct duplicate / conflict tests + `service-core` + stress selected |
| 关键变化不可追溯 | `BR-WORK-026/027`;`VF-WORK-007` | trace / audit / outbox / job report missing | 直接 command / job 用例 + `NFR-005`;evidence index |
| release evidence 不可复核 | Step 9 path / evidence rules | `latest`、错误 artifact root、缺 `EV-WORK-*` | `check_report_paths.sh`;`check_evidence_index.sh`;`release-evidence-pack` |
| fake success 被写成 configured / production success | `04` §11;Step 8 / Step 9 | fake marker check | `CFG-013` / `014`;`integration-like-seam`;fake marker check |

### 7.3 风险接受边界表

| 缺陷类型 | 是否可风险接受 | 条件 | 记录位置 |
|---|---|---|---|
| S 级 | 否 | 不适用 | 缺陷记录保留阻断状态 |
| A 级 P0 主线失败 | 原则上否 | 只有用户 / 验收负责人在 Step 14 / 06 明确降级 P0 范围后才可改变;本步不批准 | Step 14 残余风险 + 06 验收裁决 |
| A 级非主线但影响 release gate | 仅可评审,不得自动接受 | 必须有 root cause、绕行说明、影响范围、补测计划、无 S 级触发证明 | Step 14 |
| B 级 | 可排期 | 不影响 P0 gate、证据完整、无一票否决 | 缺陷清单 / Step 14 |
| C 级 | 可随批处理 | 不影响事实源、编号、执行和证据 | 文档修复记录 |

### 7.4 修复后回归矩阵

| 缺陷影响面 | 必回归 | 可选扩展 | 新增自动化要求 |
|---|---|---|---|
| Contract / DTO / refs | direct contract test、`api-contract-fast`、同对象 command / query / event roundtrip | `unit-contract-domain` | S / A 必须新增 roundtrip 或 negative test |
| Domain state / policy | direct domain transition test、同状态机非法迁移表、`unit-contract-domain` | 同族 service 用例 | S / A 必须新增状态或 policy 断言 |
| Application service / UoW | 直接 `TC-WORK-*`、同族 family、`service-core` / `service-all` | concurrency selected | S / A 必须新增 rollback / no side effect 断言 |
| Repository / projection | direct repository / integration test、`integration-p0`、相关 `QUERY` / `OPS` | operations replay | S / A 必须新增 source truth / no-write 断言 |
| Idempotency / concurrency | `CORE-004`、`NFR-004`、same key conflict、version conflict | nightly stress | S / A 必须新增 duplicate / conflict 防回归 |
| Config / redaction | `CFG-*`、`NFR-003`、`config-fast`、`config-redaction` | extended redaction scan | S / A 必须新增 config 或 scan case |
| Handoff / outbox / job recovery | `OPS-*`、`worker-job-contract`、`consumer-outbox` | `operations-replay` | S / A 必须新增 failure injection / rerun 断言 |
| Report / evidence path | `check_report_paths.sh`、`check_evidence_index.sh`、`release-evidence-pack` | release summary dry-run | S 必须新增 path / evidence check fixture |
| Flaky / timeout | first failure direct rerun、same `run_id` comparison、suite stability sample | nightly repeated run | 重复出现两次升级为 A 并补稳定性断言 |

### 7.5 缺陷生命周期

```text
New
  -> Triage
  -> Classified(S/A/B/C)
  -> Assigned
  -> Fixed
  -> Retest
  -> Regression Complete
  -> Evidence Reviewed
  -> Closed

Blocked
  <- missing design baseline / missing fixture / environment unavailable

Reopened
  <- retest failed / evidence incomplete / regression missing / same issue recurs
```

关键规则:

- S / A 缺陷进入 `Fixed` 前必须明确 root cause 和受影响 `FR / BR / AC / TC / EV`。
- 缺少 design baseline 导致无法判断期望结果时,缺陷状态为 `Blocked`,不得让测试方案自行补设计。
- 复验失败必须 `Reopened`,不得用后续成功 run 覆盖首次失败 artifact。

### 7.6 缺陷记录最小字段表

| 字段 | 必填 | 说明 |
|---|---|---|
| `defect_id` | 是 | 稳定缺陷编号 |
| `severity` | 是 | S / A / B / C |
| `source_gate` | 是 | PR / main / nightly / release / manual review |
| `suite` | 是 | 失败 suite 或 review source |
| `test_case_ids` | 是 | 一个或多个 `TC-WORK-*` |
| `evidence_ids` | 是 | 一个或多个 `EV-WORK-*` 或 redline report |
| `affected_requirements` | 是 | `FR-WORK-*` / `BR-WORK-*` / `AC-WORK-*` |
| `run_id` | 是 | 失败 run id,不得写 `latest` |
| `artifact_refs` | 是 | `artifacts/test/<run_id>/...` |
| `report_refs` | 是 | `reports/runs/<run_id>/...` |
| `root_cause` | S / A 必填 | 设计缺口、实现缺陷、fixture、环境、脚本、文档等 |
| `fix_ref` | 修复后必填 | commit / patch / design baseline |
| `retest_run_id` | 关闭前必填 | 复验 run id |
| `regression_scope` | 关闭前必填 | 直接用例、同族、suite、redline、evidence check |
| `residual_risk` | A / B 必填 | 若未全量修复,需进入 Step 14 |

### 7.7 复验关闭清单

| 检查项 | S | A | B | C |
|---|---|---|---|---|
| 失败 artifact 保留 | 必须 | 必须 | 必须 | 可选 |
| root cause 完成 | 必须 | 必须 | 建议 | 可选 |
| 修复 diff / baseline 可引用 | 必须 | 必须 | 必须 | 必须 |
| 直接失败用例通过 | 必须 | 必须 | 必须 | 按需 |
| 同族回归通过 | 必须 | 必须 | 视影响 | 否 |
| 相关 gate / suite 通过 | 必须 | 必须 | 视影响 | 否 |
| redaction / path / evidence check 通过 | 涉及时必须;redline 必须 | 涉及时必须 | 视影响 | 否 |
| 新增 / 更新自动化 | 必须 | 必须 | 视重复性 | 否 |
| `EV-WORK-*` 证据完整 | 必须 | 必须 | 涉及时必须 | 否 |
| 残余风险记录 | 不允许残余 S | 若有必须 Step 14 | 可 Step 14 | 可不记录 |

### 7.8 复验流程图

图类型: 缺陷复验流程图

图标题: L1-work 缺陷修复到关闭流程

```text
[Defect fixed]
  |
  v
[Run direct failed test]
  |
  +-- failed --> [Reopen defect]
  |
  v
[Run impacted family / suite]
  |
  +-- failed --> [Reopen defect]
  |
  v
[Run redline / evidence checks if applicable]
  |
  +-- failed --> [Reopen defect]
  |
  v
[Collect EV-WORK evidence and reports]
  |
  +-- incomplete --> [Reopen or keep Retest]
  |
  v
[Close or send residual risk to Step 14]
```

### 7.9 自动化防回归规则

| 场景 | 自动化要求 |
|---|---|
| S 级缺陷 | 必须新增或更新阻断 gate 中的自动化断言、fixture、scanner 或 evidence check |
| A 级缺陷 | 必须新增或更新 direct / family 级自动化;若无法自动化,必须记录原因并进入 Step 14 |
| B 级重复两次 | 升级为 A,补自动化或稳定性检查 |
| flaky suspected | 保留 first failure artifact;补稳定性诊断;不得只靠重跑成功关闭 |
| manual-only 发现 P0 缺陷 | 必须转成自动化用例或 gate check |
| report / evidence 缺陷 | 必须补 path / evidence index / report validation check |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 缺陷分级按 S / A / B / C 定义,S 级覆盖一票否决和 release redline | 否 | 测试管理规则,无设计契约变化 | 无 | 无回写 |
| 风险接受不在 Step 11 批准,S 级不得风险接受,A 级只可进入 Step 14 / 06 评审 | 否 | 测试流程边界,不改变验收标准 | 无 | 无回写 |
| 修复后回归矩阵使用既有 `TC-WORK-*`、`EV-WORK-*` 和 suite,不新增用例编号族 | 否 | 复验规则,无新增协议或配置 | 无 | 无回写 |
| S / A 缺陷必须新增或更新自动化防回归 | 否 | 测试自动化承接,不创建具体脚本 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续缺陷暴露出正式字段、状态、错误、配置或证据 schema 缺失,应按上游回写流程处理,不得在缺陷记录中自行补设计。
```

## 9. 回填草稿

正式 `05-测试方案.md` §11 建议采用以下结构:

```text
11. 缺陷管理与复验规则
  11.1 缺陷分级表
  11.2 S 级一票否决映射表
  11.3 风险接受边界
  11.4 修复后回归矩阵
  11.5 缺陷生命周期
  11.6 缺陷记录最小字段
  11.7 复验关闭清单
  11.8 复验流程图
  11.9 自动化防回归规则
  11.10 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §11.1 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.1 |
| §11.2 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.2 |
| §11.3 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.3 |
| §11.4 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.4 |
| §11.5 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.5 |
| §11.6 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.6 |
| §11.7 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.7 |
| §11.8 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.8 |
| §11.9 | `design-calibration/05_test_plan_step_11_defects_retest.md` §7.9 |
| §11.10 | `design-calibration/05_test_plan_step_11_defects_retest.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 12 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| S 级范围 | 是否接受 truth 污染、正文 / secret 泄露、幂等重复 truth、关键变化不可追溯、证据不可复核均为 S 级 |
| 风险接受 | 是否确认 S 级不得风险接受,A 级只进入 Step 14 / 06 评审 |
| 回归范围 | 是否接受按影响矩阵回归,而不是每个缺陷都全量 P0 回归 |
| 自动化防回归 | 是否确认 S / A 必须新增或更新自动化 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷分级可执行 | 通过 | §7.1 / §7.2 |
| 风险接受边界明确 | 通过 | §7.3 |
| 修复后回归规则可执行 | 通过 | §7.4 / §7.7 |
| 缺陷关闭证据明确 | 通过 | §7.6 / §7.7 |
| 自动化防回归规则明确 | 通过 | §7.9 |
| 对上游设计影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 12 | 通过 | 下一步定义进入准则与退出准则 |
