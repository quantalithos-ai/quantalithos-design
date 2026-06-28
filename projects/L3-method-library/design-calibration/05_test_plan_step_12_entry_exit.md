# Step 12. 定义进入准则与退出准则

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填章节: `05-测试方案.md` §12 进入准则与退出准则
> 创建日期: 2026-06-28
> 当前模式: full-restart / step12-entry-exit
> 当前状态: completed
> 当前模块: `R12.2 entry / exit criteria:再写入`
> 当前门禁: `R12.2` completed_wait_user_confirm_to_R13.1;等待确认进入 Step 13 `R13.1 evidence / reports:先思考`

---

## 0. Step 11 handoff

Step 11 已确认当前 `05-测试方案.md` 的缺陷管理与复验规则输入:

- S 级缺陷包括一票否决、P0 truth / boundary / security / evidence integrity 破坏、P0 阻断证据失真、source missing stop 被绕过。
- A 级缺陷包括 P0 主线或 blocking suite 风险,未命中 S,但影响核心闭环可信证明。
- B/R 仅承接 P1/P2、selected-run、非阻断报告体验、future、范围外或设计未闭口 residual 风险。
- S 级缺陷不得风险接受;P0 redaction / dependency / evidence integrity 不得风险接受;P0 blocking suite failure 原则上不得接受。
- 修复后至少回归原失败 TC、同 family TC、所属 suite 和相关 release check。
- 缺陷关闭需要缺陷记录、影响范围、失败前后 run / artifact / report 方向、复验状态和相关 audit 结果,但正式字段和值域留 Step 13。
- Step 11 不定义进入/退出准则正文、正式 evidence schema、验收标准、实施计划或 implementation code。

Step 12 的任务是把 Step 7 数据、Step 8 环境、Step 9 自动化、Step 10 专项、Step 11 缺陷规则收敛成“什么时候可以开始测试”和“什么时候可以结束测试”的可判定门禁。它不得提前定义 Step 13 evidence schema、`06-验收标准.md` 验收裁决或 `07-实施计划.md` 实施门禁。

---

## R12.1 entry / exit criteria:先思考

### 1. 当前模块目标

`R12.1` 只思考 Step 12 的开工边界、必读文档、SOP 五问、L1-governance Step 12 框架参考、L3-method-library 的进入准则轴、退出准则轴、暂停 / 阻断准则、P0/P1 边界、evidence 后移和 `R12.2` 写入边界。

当前模块不写最终进入准则 checklist、不写最终退出准则 checklist、不定义正式 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R12.2 |
| 用户确认 | 已确认从 Step 11 completed 推进到 Step 12 `R12.1`。 |
| 当前允许 | 思考进入准则、退出准则、P0 blocking suite、缺陷状态、风险接受、证据方向、redaction/dependency/report audit 和 R12.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 checklist;定义 evidence / artifact / report schema、验收标准、实施计划、CI YAML、required check 或 implementation code。 |

### 2. Step 12 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点和单模块推进规则。 | 跳过 R12.1 直接写完整 Step 12 或正式 `05`。 |
| `05_test_plan_calibration_flow.md` | Step 1~11 completed,Step 12 in_progress,Step 13+ blocked。 | 在 Step 12 写 evidence schema、验收标准或实施计划。 |
| `05_test_plan_step_07_test_data.md` | 81 个 `DS-ML-*` 数据集、83 条 TC 映射、run namespace、隔离、清理和 source gap。 | 新增 DS、fixture path、builder 函数或 seed code。 |
| `05_test_plan_step_08_environment_config.md` | P0 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;P1/P2 `staging-like`、`production-like`;不可用处理。 | 新增环境、profile、config key、secret provider 或真实产品前置。 |
| `05_test_plan_step_09_automation_gates.md` | P0 blocking suite family、release checks、run-scoped artifact/report direction、no latest、no static evidence。 | 定义 CI YAML、script implementation、required check 或 artifact schema。 |
| `05_test_plan_step_10_nonfunctional.md` | NFR 覆盖、P0/P1 边界、阈值来源、redaction/dependency/report/source gap 收口。 | 把无来源性能数字硬化为退出阈值。 |
| `05_test_plan_step_11_defects_retest.md` | S/A/B/R 分级、风险接受、复验矩阵、关闭证据和防回归规则。 | 改写缺陷等级或写验收裁决。 |
| SOP Step 12 | 固定进入准则、退出准则和五个问题。 | 写“基本完成”这类不可判定条件。 |
| 书写规范 §5.12 | 固定进入 / 退出准则必须 checklist 化且可判定。 | 用口号替代可检查条件。 |
| L1-governance Step 12 | 参考基线、数据、环境、suite、缺陷、evidence candidate、P1/P2 residual 的准则组织框架。 | 复制 governance 的 VF、TC、DS、suite 或业务事实。 |

### 3. SOP Step 12 五问思考

| SOP 问题 | R12.1 初判 | R12.2 写入提醒 |
|---|---|---|
| 开始测试前哪些文档必须冻结? | 当前应要求正式 `00/01/02/03/04` 可作为输入基线,Step 1~12 中间产物按顺序完成;若 `03/04` 发生影响 P0 contract/state/flow/config/redaction/gate 的变更,必须复审受影响 Step。 | 写进入准则,但不要求 Step 15 正式 `05` 已装配。 |
| 哪些环境和数据必须可用? | P0 应要求 81 个 DS family 可构造、隔离、清理;`ci-test`、`integration-like`、`operations-replay` 可装配;P0 fake / controlled / disabled / replay seam 可用。 | 写环境和数据进入准则,不得新增 DS 或环境。 |
| 哪些自动化必须可运行? | P0 blocking suite family 和 release check family 必须可运行或至少具备可运行入口方向;run-scoped artifact/report root 方向必须可用。 | 写 suite / check 准则,不写命令、CI YAML 或 required check。 |
| 退出时哪些用例必须通过? | P0 `TC-ML-*` 用例族、P0 blocking suite、redaction/dependency/report audit、release-main-smoke representative 和一票否决相关负向检查必须通过。 | 写退出准则,但正式 evidence schema 留 Step 13。 |
| 哪些缺陷和风险会阻断退出? | S 级缺陷、未接受且影响 P0 的 A 级缺陷、P0 blocking suite failure、redaction/dependency/evidence integrity failure、static evidence、缺 raw artifact/report pairing 均应阻断退出。P1/P2 residual 不阻断 P0,但必须记录接受人。 | 写暂停 / 阻断准则和 residual 处理。 |

### 4. L1-governance Step 12 框架参考思考

L1-governance Step 12 的可借鉴点是“把数据、环境、自动化、专项和缺陷规则汇总成可判定 checklist,同时避免把正式 EV / acceptance report 提前固定”。L3 采用框架,不复制 governance 领域事实。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 进入前需要设计基线、数据、环境、自动化和缺陷规则可用 | L3 用正式 `00`~`04`、Step 1~12 中间产物、DS、P0 profile、suite family 和 Step 11 缺陷规则表达。 | 要求正式 `05` Step 15 已装配才允许继续 Step 12。 |
| 退出需 P0 用例、红线、suite、缺陷和 report 可判定 | L3 用 TC-ML、NFR/一票否决、P0 suite family、S/A 缺陷状态和 artifact/report direction 表达。 | 复制 VF-GOV、TC-GOV、DS-GOV 或治理领域红线。 |
| P1/P2 residual 不阻断 P0 | L3 保留 `staging-like` / `production-like` selected-run unavailable 只记录 residual。 | 把 P1 selected-run 计入 P0 pass。 |
| 性能 sample 与硬阈值区分 | L3 只要求结构性 sample/trend 存在,不要求无来源 P95/SLO。 | 用旧性能数字阻断退出。 |
| 正式 EV 留 Step 13 | L3 只写 evidence candidate / artifact-report direction。 | 在 Step 12 固定 JSON key、EV ID、retention 或 review status。 |

### 5. L3 进入准则轴思考

| 进入准则轴 | 初步条件 | R12.2 注意 |
|---|---|---|
| 文档基线 | 正式 `00/01/02/03/04` 可作为测试输入;Step 1~11 completed;Step 12 当前中间产物完成后可作为 §12 输入。 | 不要求正式 `05` 已装配;正式装配留 Step 15。 |
| 变更复审 | 若 `03/04` 影响 P0 DTO、state、flow、port、config、redaction、marker/source、gate,受影响 Step 必须复审。 | 不在 Step 12 自行补 schema/port。 |
| 用例 / 数据 | 83 条 TC 均有 DS 映射或明确无额外数据前置;81 个 DS 可构造、隔离、清理。 | 不新增 TC/DS。 |
| 环境 / profile | `ci-test`、`integration-like`、`operations-replay` 可装配;`local-dev` 仅 support;P1/P2 profile 不作为 P0 前置。 | P0 profile 不可用不得跳过伪 pass。 |
| 依赖 / fake / controlled seam | only `core-contracts` compile dependency;其他依赖走 fake / controlled / disabled / event replay / replay refs。 | 不把 runtime/event/replay 写成 path dependency。 |
| 自动化 / gate | P0 suite family 和 check family 有可运行入口方向;run id / artifact root / report root 是显式方向。 | 不写脚本命令或 schema。 |
| 缺陷规则 | Step 11 S/A/B/R、复验、风险接受、防回归规则已完成。 | 不写验收裁决。 |

### 6. L3 退出准则轴思考

| 退出准则轴 | 初步条件 | R12.2 注意 |
|---|---|---|
| P0 用例 | 所有 P0 `TC-ML-*` 用例族通过,或明确属于 P1/P2 / future / residual 且不影响 P0 truth。 | 不得用 release smoke 替代底层 suite。 |
| P0 suite | `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`observability-boundary`、`report-generation-audit` 等 P0 suite family 通过。 | R12.2 可写 suite family,不写命令。 |
| release checks | release-main-smoke representative、release config/redaction/dependency/report audit 通过。 | representative only,不替代 main suite。 |
| 缺陷状态 | S 级缺陷为 0;影响 P0 且未接受的 A 级缺陷为 0;B/R residual 有接受人和后续触发条件。 | 不写验收签字流程。 |
| redaction / dependency / report integrity | raw leak、non-core compile dependency、artifact/report missing、static evidence、`latest` evidence 均不得存在。 | 字段和路径 schema 留 Step 13。 |
| performance | 结构性 sample/trend 存在;旧 P95/SLO/capacity 数字不作为失败条件。 | 不硬化无来源数字。 |
| evidence direction | blocking suite 有 raw artifact direction 和 human report direction,且 report 从 artifact 推导。 | 正式 schema 留 Step 13。 |

### 7. 暂停 / 阻断准则思考

| 触发 | R12.1 裁决 |
|---|---|
| P0 design source 缺失导致 TC / DS / suite 无法可判定 | 暂停,回 owning `03/04/05` 中间产物,不得自行补口。 |
| P0 profile、fixture、fake、controlled seam、replay root 不可用 | 阻断进入或退出,不得 silent skip。 |
| marker/source 缺失但用例需要 degraded/unavailable/failed/redaction marker | 停审,不得 synthetic marker。 |
| S 级缺陷出现 | 阻断退出,必须修复并按 Step 11 复验。 |
| redaction / dependency / report audit failed | 阻断退出,不得风险接受。 |
| artifact/report 缺配对、使用 `latest` 或 static evidence pass | 阻断退出。 |
| P1 selected-run unavailable | 不阻断当前 P0,必须记录 residual。 |
| performance sample 存在但旧候选数字未达 | 不阻断 P0,记录风险。 |

### 8. evidence / acceptance 后移边界思考

| 主题 | Step 12 可写 | Step 12 不得写 |
|---|---|---|
| evidence | 要求 evidence candidate、raw artifact direction、report direction 和 pairing 必须存在。 | 正式 EV ID、JSON 字段、case schema、assertion item key。 |
| report | 要求 report 从 raw artifact 推导、不得 static pass、不得 latest。 | report 模板、retention、review status、archive path。 |
| acceptance | 要求退出准则可判定,缺陷和风险状态清楚。 | `06-验收标准.md` 的最终 pass/fail、签字、release verdict。 |
| implementation | 要求 suite/check family 可运行方向。 | CI YAML、script implementation、required check、cargo/npm 命令。 |

### 9. R12.2 写入边界思考

`R12.2 entry / exit criteria:再写入` 可以写入:

1. Step 12 必读文档表和读取状态。
2. Step 11 handoff 承接表。
3. SOP Step 12 五问回答。
4. L1-governance Step 12 框架参考边界。
5. 进入准则候选 checklist。
6. 退出准则候选 checklist。
7. 暂停 / 阻断准则表。
8. 进入 / 退出准则来源追溯表。
9. 跨准则审计表。
10. Step 12 completed stop-review 和 Step 13 进入门禁。

`R12.2` 禁止写入:

1. 正式 `05-测试方案.md`。
2. 正式 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status、archive path。
3. `06-验收标准.md` 的验收裁决、release veto、签字流程。
4. 新增 TC、DS、环境、suite、config key、marker source、port、mapper、state、schema、CI YAML、script implementation、required check 或 phase boundary。
5. `07-实施计划.md` 或 implementation code。

### 10. R12.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 12 进入准则与退出准则 | pass |
| 是否承接 Step 7 / Step 8 / Step 9 / Step 10 / Step 11 已确认输入 | pass |
| 是否读取并对照 SOP Step 12 和书写规范 §5.12 | pass |
| 是否参考 L1-governance 框架但未复制领域事实 | pass |
| 是否形成 L3 进入准则轴、退出准则轴、暂停 / 阻断准则和后移边界思考 | pass |
| 是否形成 R12.2 写入边界 | pass |
| 是否未写最终进入/退出 checklist、evidence schema、验收标准或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.2 entry / exit criteria:再写入`;只允许写入 Step 12 必读文档表、Step 11 handoff 承接、SOP 五问回答、进入准则候选、退出准则候选、暂停 / 阻断准则、准则来源追溯、跨准则审计、Step 12 completed stop-review 和 Step 13 进入门禁;不得直接修改正式 `05-测试方案.md`;不得定义正式 evidence schema、artifact/report JSON 字段、验收标准、实施计划或 implementation code。

---

## R12.2 entry / exit criteria:再写入

### 1. 当前模块写入目标

`R12.2` 将 R12.1 的思考固化为 Step 12 的进入准则与退出准则中间产物。当前模块只写 Step 12 必读文档表、Step 11 handoff 承接、SOP 五问回答、进入准则候选、退出准则候选、暂停 / 阻断准则、准则来源追溯、跨准则审计、Step 12 completed stop-review 和 Step 13 进入门禁。

当前模块不修改正式 `05-测试方案.md`,不定义正式 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status、reports 目录结构、验收标准、实施计划、CI YAML、required check、实现仓测试函数名或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.1 |
| 用户确认 | 已确认从 `R12.1` 推进到 `R12.2`。 |
| 当前允许 | 写入 Step 12 必读、handoff、SOP 回答、进入 / 退出准则候选、暂停 / 阻断准则、追溯、审计、Step 13 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;定义 evidence / artifact / report schema、验收标准、实施计划或 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 12 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进和正式 05 不得跳写。 | 本轮只推进 `R12.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~11 completed、Step 12 R12.1 completed、Step 13+ blocked。 | `R12.2` 完成后等待 `R13.1`。 |
| `05_test_plan_step_07_test_data.md` | 已承接 | 提供 81 个 DS、83 条 TC 映射、run namespace、隔离、清理和 source gap。 | 不新增 DS、fixture path、builder 或 seed。 |
| `05_test_plan_step_08_environment_config.md` | 已承接 | 提供 P0 profile、P1/P2 profile、依赖类型、协作方式和不可用处理。 | 不新增环境、profile、config key 或真实产品。 |
| `05_test_plan_step_09_automation_gates.md` | 已承接 | 提供 P0 suite family、release checks、run-scoped artifact/report direction、no latest 和 no static evidence。 | 不定义 CI YAML、script 或 schema。 |
| `05_test_plan_step_10_nonfunctional.md` | 已承接 | 提供 NFR 覆盖、阈值来源、P0/P1 边界和 source gap 收口。 | 不硬化无来源性能数字。 |
| `05_test_plan_step_11_defects_retest.md` | 已承接 | 提供 S/A/B/R 分级、风险接受、复验矩阵、关闭证据和防回归规则。 | 不改写缺陷等级。 |
| SOP Step 12 | 已读取 | 固定进入准则、退出准则和五个问题。 | 准则必须可判定。 |
| 书写规范 §5.12 | 已读取 | 固定进入 / 退出准则必须 checklist 化。 | 避免“基本完成”。 |
| L1-governance Step 12 | 已对照 | 参考准则组织和 P0/P1 边界表达。 | framework reference only。 |

### 3. Step 11 handoff 承接表

| Step 11 输出 | Step 12 承接方式 | 当前状态 |
|---|---|---|
| S 级缺陷不得风险接受 | 写入退出阻断准则。 | pass |
| A 级影响 P0 且未接受时阻断 | 写入退出缺陷状态准则。 | pass |
| B/R residual 需接受人和后续触发条件 | 写入退出 residual 风险准则。 | pass |
| 修复后回归原 TC、同 family、suite 和 release check | 写入退出复验完成准则。 | pass |
| 关闭证据只到 run / artifact / report 方向 | 写入 evidence direction,正式 schema 留 Step 13。 | pass |
| 防回归新增规则 | 写入暂停 / 阻断和回写 owning Step 的准则。 | pass |

### 4. SOP 五问回答

| SOP 问题 | Step 12 回答 |
|---|---|
| 开始测试前哪些文档必须冻结? | 正式 `00/01/02/03/04` 必须可作为输入基线;Step 1~12 中间产物必须按顺序完成;若 `03/04` 发生影响 P0 contract/state/flow/config/redaction/marker/source/gate 的变更,必须复审受影响 Step。 |
| 哪些环境和数据必须可用? | 81 个 DS family 必须可构造、隔离和清理;`ci-test`、`integration-like`、`operations-replay` 必须可装配;P0 fake / controlled / disabled / replay seam 必须可用;`local-dev` 仅为 support,`staging-like` / `production-like` 仅为 P1/P2。 |
| 哪些自动化必须可运行? | P0 suite family、release check family、run-scoped artifact/report direction 必须可运行或具备明确执行入口方向;不得依赖 `latest` 或静态 evidence。 |
| 退出时哪些用例必须通过? | P0 `TC-ML-*` 用例族、P0 blocking suite family、release-main-smoke representative、redaction/dependency/report audit、一票否决相关负向检查必须通过。 |
| 哪些缺陷和风险会阻断退出? | S 级缺陷、未接受且影响 P0 的 A 级缺陷、P0 suite failure、redaction/dependency/evidence integrity failure、static evidence、缺 raw artifact/report pairing、P0 profile 不可用伪 pass 均阻断退出。P1/P2 residual 不阻断 P0,但必须记录接受人。 |

### 5. 进入准则候选

- [ ] 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 已确认作为测试输入基线。
- [ ] `05_test_plan_step_01_input_boundary.md` 到 `05_test_plan_step_12_entry_exit.md` 中间产物均已完成并通过用户确认。
- [ ] 若 `03/04` 自上次审查后发生影响 P0 DTO、state、flow、port、config、redaction、marker/source 或 gate 的变更,受影响 Step 已重新审查。
- [ ] 83 条 `TC-ML-*` 候选用例均有数据前置、断言点、自动化候选和 evidence candidate 方向。
- [ ] 81 个 `DS-ML-*` 数据集可重复构造,并具备 run namespace 隔离和清理规则。
- [ ] `ci-test`、`integration-like`、`operations-replay` profile 可装配;`local-dev` 仅作为 support。
- [ ] P0 fake / in-memory / controlled / disabled / replay seam 可用,且不依赖真实 DB、broker、secret provider、external product 或非 `core-contracts` sibling compile dependency。
- [ ] redaction dummy corpus、dependency metadata、write-audit、fault injection、safe metric / trace capture 和 source-missing guard 可用。
- [ ] P0 suite family 和 release check family 具备可运行入口方向。
- [ ] artifact root / report root 采用显式 run-scoped 方向,不得引用 `latest`。
- [ ] Step 11 缺陷分级、S 级阻断、风险接受、复验矩阵和防回归规则已确认。

### 6. 退出准则候选

- [ ] 所有 P0 `TC-ML-*` 用例族通过,或明确属于 P1/P2 / future / residual 且不影响 P0 truth。
- [ ] 一票否决项对应正向 / 负向测试、redaction check、dependency check、query/job no truth repair、observability not truth 检查均通过。
- [ ] P0 blocking suite family 通过:`contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`observability-boundary`、`report-generation-audit`。
- [ ] release-main-smoke 仅作为 representative smoke 通过,且未替代底层 suite。
- [ ] release config redline、release redaction boundary、release dependency boundary、release report audit 均通过。
- [ ] 所有 blocking suite 均有 raw artifact direction 和 human report direction,且 report 从 raw artifact 推导。
- [ ] 未发现使用 `latest`、静态 JSON 或手写 report 直接宣告 pass。
- [ ] 当前无未关闭 S 级缺陷。
- [ ] 当前无未接受且影响 P0 的 A 级缺陷。
- [ ] B/R 或 P1/P2 residual 风险均记录接受人、影响范围和后续触发条件。
- [ ] 性能结构性 sample / trend 存在;旧 P95/SLO/capacity 候选数字未达不作为 P0 退出失败。
- [ ] 若修复触发 Step 11 防回归规则,对应自动化候选或 owning Step 回写已完成。

### 7. 暂停 / 阻断准则

| 触发 | 处理 |
|---|---|
| P0 design source 缺失导致 TC / DS / suite 无法可判定 | 暂停,回 owning `03/04/05` 中间产物,不得自行补口。 |
| P0 profile、fixture、fake、controlled seam、replay root 不可用 | 阻断进入或退出;不得 silent skip 或伪 pass。 |
| marker/source 缺失但用例需要 degraded/unavailable/failed/redaction marker | 停审,不得 synthetic marker。 |
| S 级缺陷出现 | 阻断退出;必须修复并按 Step 11 复验。 |
| 未接受且影响 P0 的 A 级缺陷存在 | 阻断退出;必须修复或形成明确接受记录。 |
| redaction / dependency / report audit failed | 阻断退出;不得风险接受。 |
| artifact/report 缺配对、使用 `latest` 或 static evidence pass | 阻断退出。 |
| P1 selected-run unavailable | 不阻断当前 P0;必须记录 residual。 |
| performance sample 存在但旧候选数字未达 | 不阻断 P0;记录风险。 |

### 8. 进入准则来源追溯表

| 准则组 | 来源 | 说明 |
|---|---|---|
| 文档基线 | Step 1~5;正式 `00/01/02/03/04` | 测试输入真相源明确。 |
| 用例和数据 | Step 6~7 | `TC-ML-*` 和 `DS-ML-*` 可执行、可隔离、可清理。 |
| 环境和配置 | Step 8 | P0 profile、fake/controlled/replay seam 和不可用处理。 |
| 自动化 | Step 9 | P0 suite family、release check family、run-scoped output direction。 |
| 专项 | Step 10 | redaction、dependency、no truth repair、performance sample 和 source gap。 |
| 缺陷复验 | Step 11 | S/A/B/R、风险接受、复验和防回归规则。 |

### 9. 退出准则来源追溯表

| 准则组 | 来源 | 说明 |
|---|---|---|
| P0 用例通过 | Step 6 / Step 9 | 所有 P0 TC family 有 suite family 承接。 |
| 一票否决和红线 | `00` §14.2;Step 10 / Step 11 | S 级不可降级。 |
| suite / check 通过 | Step 9 | P0 suite family、release checks 和 report audit。 |
| 缺陷状态 | Step 11 | S=0;P0 A fixed or accepted;B/R residual accepted。 |
| report / evidence direction | Step 9 / Step 13 pending | 退出前要求 raw artifact/report direction,正式 schema 留 Step 13。 |
| residual 风险 | Step 2 / Step 10 / Step 11 / Step 14 pending | P1/P2 不阻断 P0,但必须记录接受人。 |

### 10. 跨准则审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 进入准则是否覆盖文档、数据、环境、自动化、缺陷规则 | pass | §5 覆盖。 |
| 退出准则是否覆盖 P0 用例、红线、suite、check、缺陷、report direction | pass | §6 覆盖。 |
| 准则是否可判定 | pass | 使用 checklist 和明确阻断条件。 |
| 是否避免“基本完成”等模糊项 | pass | 未使用模糊准则。 |
| 是否把 P1/P2 误写为 P0 阻断 | pass | P1/P2 只作 residual。 |
| 是否把无来源性能数字写成退出阈值 | pass | 只要求 sample/trend。 |
| 是否提前固定正式 evidence schema | pass | schema 留 Step 13。 |
| 是否修改正式 `05-测试方案.md` | pass | 仍只写中间产物。 |

### 11. Step 12 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 12 R12.1~R12.2 | pass |
| 是否输出进入准则候选 | pass |
| 是否输出退出准则候选 | pass |
| 是否输出暂停 / 阻断准则 | pass |
| 是否输出进入 / 退出准则来源追溯 | pass |
| 是否输出跨准则审计 | pass |
| 是否明确 evidence / artifact / report schema、验收裁决、实施内容后移 | pass |
| 是否未新增 TC、DS、环境、suite、config key、marker source、port、mapper、state、schema 或 phase boundary | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

### 12. Step 13 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 12 是否可作为 `05-测试方案.md` §12 装配输入 | pass |
| Step 13 当前是否允许开始 | wait_user_confirm |
| Step 13 首个模块 | `R13.1 evidence / reports:先思考` |
| Step 13 允许主题 | 证据类型、证据保存位置、artifact/report 目录方向、用例 / suite / 验收映射、报告生成、人工 / Agent 审查、redaction / boundary scan、orphan/static evidence 审计的思考。 |
| Step 13 禁止主题 | 正式 `05-测试方案.md`、验收标准、实施计划、implementation code。 |

next_allowed_action: Step 12 completed;等待用户确认后进入 Step 13 `R13.1 evidence / reports:先思考`;只允许思考测试报告与证据归档的输入边界、证据类型、artifact/report 方向、run-scoped 规则、用例 / suite / 验收映射、report generation、review 补充、redaction / boundary scan 和 R13.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写验收标准、实施计划或 implementation code。
