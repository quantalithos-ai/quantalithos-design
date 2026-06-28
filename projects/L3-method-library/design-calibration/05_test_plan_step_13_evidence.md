# Step 13. 定义测试报告与证据归档

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节: `05-测试方案.md` §13 测试报告与证据归档
> 创建日期: 2026-06-28
> 当前模式: full-restart / step13-evidence-reports
> 当前状态: in_progress
> 当前模块: `R13.1 evidence / reports:先思考`
> 当前门禁: `R13.1` completed_wait_user_confirm_to_R13.2;等待确认进入 Step 13 `R13.2 evidence / reports:再写入`

---

## 0. Step 12 handoff

Step 12 已确认当前 `05-测试方案.md` 的进入准则与退出准则输入:

- 正式 `00/01/02/03/04` 与 Step 1~12 中间产物是测试方案输入基线。
- P0 suite family、release check family、run-scoped artifact/report direction 必须可运行或具备明确执行入口方向。
- 所有 blocking suite 均需要 raw artifact direction 和 human report direction,且 report 必须从 raw artifact 推导。
- `latest`、静态 JSON、手写 report 直接宣告 pass、artifact/report 缺配对均阻断退出。
- S 级缺陷、P0 redaction / dependency / evidence integrity 失败、source missing stop 被绕过均不得风险接受。
- 性能只保留结构性 sample / trend,不得把无来源 P95 / SLO / capacity 数字写成证据通过条件。
- Step 12 不定义正式 evidence ID、artifact/report JSON 字段、case schema、assertion item key、retention、review status 或 reports 目录结构。

Step 13 的任务是把 Step 5 的 evidence candidate、Step 6 的 `TC-ML-*` 用例、Step 9 的 suite/gate/output direction、Step 10 的专项证据方向、Step 11 的缺陷关闭证据方向和 Step 12 的进出准则,收敛成“测试执行后如何留证、如何生成报告、如何给后续验收消费”的中间产物。

---

## R13.1 evidence / reports:先思考

### 1. 当前模块目标

`R13.1` 只思考 Step 13 的开工边界、必读文档、SOP 十六问、L1-governance Step 13 框架参考、L3-method-library 的证据轴、artifact/report 方向、EV/TC/suite/acceptance 映射方向、失败 suite 留证、redaction / boundary scan、orphan/static audit 和 `R13.2` 写入边界。

当前模块不写最终证据归档表、不固定正式 evidence ID 表、不定义 artifact JSON schema、case JSON schema、assertion item key、report 模板、retention、review status、验收 AC/VETO 裁决、报告生成脚本实现、CI YAML、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.2 |
| 用户确认 | 已确认从 Step 12 completed 推进到 Step 13 `R13.1`。 |
| 当前允许 | 思考证据类型、保存位置、run-scoped 规则、artifact/report 配对、用例 / suite / 验收映射、报告生成、审查补充、redaction / boundary scan 和真实性审计。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终证据表、正式 schema、验收标准、实施计划、CI YAML、required check 或 implementation code。 |

### 2. Step 13 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进和正式 05 不得跳写。 | 跳过 R13.1 直接写完整 Step 13 或正式 `05`。 |
| `05_test_plan_calibration_flow.md` | Step 1~12 completed,Step 13 in_progress,Step 14+ blocked。 | 在 R13.1 写最终归档表或正式 schema。 |
| `05_test_plan_step_05_traceability_coverage.md` | evidence candidate / family 只作候选,正式证据归档留 Step 13。 | 直接沿用候选族为最终 EV 表。 |
| `05_test_plan_step_06_cases.md` | `TC-ML-*` 用例族、断言方向、自动化候选和 evidence candidate。 | 新增 TC、改写断言或补设计字段。 |
| `05_test_plan_step_09_automation_gates.md` | P0 suite family、gate/report/check family、run-scoped artifact/report direction、no latest、no static evidence。 | 定义 CI YAML、脚本实现或 artifact schema。 |
| `05_test_plan_step_10_nonfunctional.md` | redaction、dependency、observability、report pairing、source gap 和 sample/trend 证据方向。 | 把无来源性能数字写成 evidence pass。 |
| `05_test_plan_step_11_defects_retest.md` | 缺陷关闭需要失败前后 run / artifact / report 方向和复验结果。 | 固定缺陷系统字段或 report 模板。 |
| `05_test_plan_step_12_entry_exit.md` | 进入 / 退出准则要求 raw artifact/report pairing、不得 `latest`、不得 static pass。 | 写 `06-验收标准.md` 的最终裁决。 |
| SOP Step 13 | 固定 16 个问题、证据归档表、报告生成表、目录结构和停审要求。 | 只写“测试报告归档”。 |
| 书写规范 §4.6 / §5.13 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`、`scripts/reports/*` 口径。 | 使用 `artifacts/test/<project>/<run_id>`、`reports/<project>` 或正式引用 `latest`。 |
| L1-governance Step 13 | 参考证据归档、report generation、failed suite、redaction/dependency/no-static audit 的组织框架。 | 复制 `EV-GOV-*`、`TC-GOV-*`、`AC-GOV-*` 或 governance 领域事实。 |

### 3. SOP Step 13 十六问思考边界

| SOP 问题 | R13.1 初判 | R13.2 写入提醒 |
|---|---|---|
| 每类测试输出什么证据? | L3 至少需要 suite raw artifact、case result、suite human report、evidence index、redaction/dependency/report audit、release smoke summary、缺陷复验证据方向。 | R13.2 写归档结构,但不得填写真实执行结论。 |
| 证据保存在哪里? | raw artifact 统一走 `artifacts/test/<run_id>`;human report 统一走 `reports/runs/<run_id>`;acceptance handoff 初稿走 `reports/acceptance`。 | 不使用 `<project>` 子目录或 `latest`。 |
| 证据如何关联用例和验收项? | 每个证据方向需能回指 `TC-ML-*`、suite family、artifact root、report path 和后续 acceptance 引用方向。 | 后续 `06` 才固定最终 AC/VETO 裁决。 |
| 哪些日志、trace、DB snapshot 或报告必须保留? | P0 不要求真实 DB snapshot;必须保留 safe log、suite report、case result、gate summary、redaction/dependency/report audit 和 release smoke summary 方向。 | 日志必须 body-free / secret-free。 |
| 证据保留多久? | 需要定义 release candidate 与缺陷复验期间的保留原则,但具体天数若无正式归档策略不得发明。 | R13.2 可写保留原则,不写无来源天数。 |
| raw artifact 是否统一进入 `artifacts/test/<run_id>`? | 是。 | 路径方向可固定,JSON 字段和值域需谨慎,不得超出正式设计。 |
| human report 是否统一进入 `reports/runs/<run_id>`? | 是。 | report 必须从 raw artifact 推导。 |
| acceptance handoff 是否统一进入 `reports/acceptance`? | 是,但只能作为初稿和审查补充入口。 | 不自动宣告验收 passed。 |
| 哪些报告由 `scripts/reports/*` 自动生成? | suite summary、gate summary、evidence index、redaction/dependency/report audit、acceptance handoff 初稿可作为候选。 | 不实现脚本,不写命令。 |
| 哪些报告必须由人或 Agent 审查补充? | acceptance handoff、veto checklist、risk acceptance、open issues、review notes、agent review 均需审查补充方向。 | 审查结论不在测试方案中填写。 |
| 失败 suite 是否仍产出 artifact? | 是;failed / timeout / unavailable 也必须留下 safe failure reason、stdout/stderr direction 和已执行 case result。 | 不允许失败 suite 无证据。 |
| redaction / boundary scan 如何证明安全? | redaction-boundary 与 dependency-boundary 需要扫描 raw artifact 和 report;report audit 需要证明 no static evidence。 | scanner 实现和 pattern 不在 Step 13 实现。 |
| P0 evidence 是否回指真实 artifact? | 必须从 suite raw artifact / generated report pair 推导,不能只来自静态 mapping。 | R13.2 要写 no-static 审计。 |
| 每个 EV 是否回指 TC/suite/artifact/report/AC/VETO? | 需要形成映射方向;L3 正式证据族候选应使用 `EV-ML-*` 而非 `EV-GOV-*`。 | 具体 EV 表在 R13.2 写,不复制 governance。 |
| 每类报告完成后是否停审? | 需要停审 artifact 来源、report path、TC/acceptance 追溯、redaction/boundary scan、failed suite 证据。 | R13.2 写停审表。 |
| 是否存在 orphan/static/report-missing/raw-leak/reference-break? | 必须做跨证据真实性 / 追溯审计。 | R13.2 写审计表和 unresolved 处理。 |

### 4. L1-governance Step 13 框架参考思考

L1-governance Step 13 的可借鉴点是“把候选证据族收敛为可归档、可生成报告、可被后续验收引用且能防静态造证据的证据闭环”。L3 采用框架和审计深度,不复制 governance 领域编号、业务事实或 schema 字段。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| Step 状态、目标、输入基线、非范围先声明 | L3 R13.1 先记录 Step 12 handoff、必读文档和禁止范围。 | 直接写正式 `05` §13。 |
| evidence candidate 收敛成正式证据族 | L3 可在 R13.2 设计 `EV-ML-*` 证据族方向。 | 复制 `EV-GOV-*` 或 governance 的 AC/VETO。 |
| raw artifact 与 human report 配对 | L3 固定从 `artifacts/test/<run_id>` 到 `reports/runs/<run_id>` 的推导关系。 | 手写 report 或静态 JSON 直接宣告 pass。 |
| failed suite 也归档 | L3 failed / timeout / unavailable 都要留 safe failure reason。 | 只归档 passed suite。 |
| acceptance report 是初稿 + review | L3 后续 `reports/acceptance/*` 只作验收交接输入。 | 在测试方案中自动裁决验收通过。 |
| redaction/dependency/no-static audit | L3 作为证据真实性阻断方向。 | 定义 scanner 实现、manifest schema 或 CI required check。 |

### 5. L3 证据轴思考

| 证据轴 | 主要承接来源 | R13.1 初判 |
|---|---|---|
| contract / domain / state | Step 6 truth / formalization / state 用例;`contract-domain-fast`。 | 需要 suite artifact、case result、suite report 和后续 EV-ML 族。 |
| service / command / query / consumer | Step 6 command/query/inbound flow;`service-flow-fast`、`entry-worker-job`。 | 需要 accepted/rejected/duplicate/no-write safe result 证据方向。 |
| operations / replay / job | Step 6 recovery/job;Step 9 `operations-replay-core`;Step 10 no truth repair。 | 需要 checkpoint/report、partial failure、no truth repair 证据方向。 |
| config / dependency | Step 8/9/10 profile、config redline、dependency boundary。 | 需要 config redline report、dependency boundary report 和 release audit 方向。 |
| redaction / observability | Step 10 raw body/secret 禁入、metric/audit refs-only、observability not truth。 | 需要 redaction scan、safe observability sample 和 report body-free 审计方向。 |
| report integrity | Step 9 report-generation-audit;Step 12 evidence integrity 退出准则。 | 需要 artifact/report pairing、no latest、no static evidence 审计方向。 |
| release smoke | Step 9 release-main-smoke;Step 12 representative only。 | 只作为代表性汇总,不能替代底层 suite artifact。 |
| defect retest | Step 11 failed/fixed run direction、复验 suite status。 | 需要失败前后 run、artifact/report pair 和复验说明方向。 |
| residual / risk | Step 10 P1/P2 sample / selected-run;Step 12 residual 风险。 | 需要 risk acceptance / open issues report 方向,不得计入 P0 pass。 |

### 6. artifact / report 方向思考

| 主题 | R13.1 判断 | R13.2 注意 |
|---|---|---|
| raw artifact root | 固定方向为 `artifacts/test/<run_id>/...`。 | 可写目录结构方向,谨慎处理 JSON schema 字段。 |
| human report root | 固定方向为 `reports/runs/<run_id>/...`。 | report 必须由 `scripts/reports/*` 从 artifact 推导。 |
| acceptance handoff | 固定方向为 `reports/acceptance/...`。 | 只作初稿与审查补充,不写验收 verdict。 |
| review supplement | 需要 `reports/review/...` 或等价 review 补充方向。 | 人 / Agent 审查要求可写,实际审查结论不写。 |
| no latest | 正式引用必须绑定固定 `<run_id>`。 | `latest` 只能本地调试,不得进入正式证据引用。 |
| failed suite | failed / timeout / unavailable 必须有 artifact/report 方向。 | failure reason 必须 safe,不得泄露正文或 secret。 |
| static evidence | evidence index 不得只从静态表生成。 | 必须从 suite artifact / report pair 推导。 |

### 7. EV / TC / suite / acceptance 映射思考

Step 13 需要把 Step 5 的 evidence candidate 和 Step 6 的 `TC-ML-*` 用例族转成可归档证据方向。当前只思考证据族边界,不写最终 EV 表。

| 映射层 | R13.1 初判 | 禁止误用 |
|---|---|---|
| EV family | 候选采用 `EV-ML-*` 族,按 L3 风险轴组织。 | 不复制 `EV-GOV-*`。 |
| TC refs | 每个 P0 EV 族必须能回指一个或多个 `TC-ML-*` 用例族。 | 用 EV 替代 TC 断言。 |
| suite refs | 每个 P0 EV 族必须绑定产生证据的 suite/check family。 | 用 release smoke 替代底层 suite。 |
| artifact refs | 每个 EV 实例必须能回到 run-scoped raw artifact。 | 手写 EV 实例。 |
| report refs | 每个 EV 实例必须能回到 generated human report。 | report 与 artifact 脱钩。 |
| acceptance refs | 当前只写后续验收引用方向。 | 在 Step 13 裁决 AC/VETO pass/fail。 |

### 8. R13.2 写入边界思考

`R13.2 evidence / reports:再写入` 可以写入:

1. Step 13 必读文档表和读取状态。
2. Step 12 handoff 承接表。
3. SOP Step 13 十六问回答。
4. L1-governance Step 13 框架参考边界。
5. L3 证据族候选、证据归档方向表和测试切口到证据 / 验收映射方向。
6. artifact / report / acceptance / review 目录结构方向。
7. 报告生成表,只到 `scripts/reports/*` 职责和来源 / 输出路径。
8. failed suite 留证规则、redaction / dependency / report audit 规则。
9. evidence stop-review、orphan/static/report-missing/raw-leak/reference-break 审计表。
10. Step 13 completed stop-review 和 Step 14 进入门禁。

`R13.2` 禁止写入:

1. 正式 `05-测试方案.md`。
2. 实际执行结论、真实 `<run_id>`、真实 pass/fail、验收 verdict 或 release sign-off。
3. 超出正式设计的 artifact JSON schema、case JSON schema、assertion item key、mapper、port、state、marker source、config key 或 phase boundary。
4. CI YAML、脚本实现、package command、required check、实现仓测试函数名或 implementation code。
5. 旧 `05/06/07` 的旧 evidence、旧 MethodContent、旧 report path 或旧实施边界。

### 9. R13.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 13 测试报告与证据归档边界 | pass |
| 是否承接 Step 5 / Step 6 / Step 9 / Step 10 / Step 11 / Step 12 已确认输入 | pass |
| 是否读取并对照 SOP Step 13 和书写规范 §4.6 / §5.13 | pass |
| 是否参考 L1-governance 框架但未复制 governance 领域事实 | pass |
| 是否形成 L3 证据轴、artifact/report 方向、EV/TC/suite/acceptance 映射和审计思考 | pass |
| 是否形成 R13.2 写入边界 | pass |
| 是否未写最终证据归档表、正式 schema、验收标准、实施计划或 implementation code | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.2 evidence / reports:再写入`;只允许写入 Step 13 必读文档表、Step 12 handoff 承接、SOP 十六问回答、L1-governance 框架参考边界、L3 证据族候选、证据归档方向、测试切口到证据 / 验收映射方向、artifact/report/acceptance/review 目录结构方向、报告生成表、failed suite 留证规则、redaction/dependency/report audit、证据停审、orphan/static/report-missing/raw-leak/reference-break 审计和 Step 14 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写实际执行结论、验收标准、实施计划或 implementation code。

---

## R13.2 evidence / reports:再写入

### 1. 当前模块写入目标

`R13.2` 将 R13.1 的思考固化为 Step 13 的测试报告与证据归档中间产物。当前模块只写 Step 13 必读文档、Step 12 handoff、SOP 十六问、L1-governance 框架参考边界、L3 证据族候选、证据归档方向、测试切口到证据 / 验收映射方向、artifact/report/acceptance/review 目录结构方向、报告生成表、failed suite 留证规则、redaction/dependency/report audit、证据停审、跨证据真实性 / 追溯审计和 Step 14 进入门禁。

当前模块不修改正式 `05-测试方案.md`,不填写实际执行结论、不生成真实 `<run_id>`、不裁决验收 passed/failed、不定义 implementation CI、脚本实现、required check、实现仓测试函数名或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R14.1 |
| 用户确认 | 已确认从 `R13.1` 推进到 `R13.2`。 |
| 当前允许 | 写入证据归档方向、报告结构、证据族、suite/report 映射、审查补充、failed suite 留证和真实性审计。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写真实执行结果、验收 verdict、CI YAML、脚本实现、implementation code 或超出设计的机器 artifact JSON 字段 schema。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 13 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进和正式 05 不得跳写。 | 本轮只推进 `R13.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~12 completed、Step 13 R13.1 completed、Step 14+ blocked。 | `R13.2` 完成后等待 `R14.1`。 |
| `05_test_plan_step_13_evidence.md` | 已读取并承接 | 承接 R13.1 思考和 R13.2 写入边界。 | 不重写 R13.1。 |
| `05_test_plan_step_05_traceability_coverage.md` | 已承接 | 提供 evidence candidate / family、需求 / 规则 / 设计 / 切口追溯。 | 正式证据族采用 L3 自有 `EV-ML-*`。 |
| `05_test_plan_step_06_cases.md` | 已承接 | 提供 83 条唯一 `TC-ML-*` 候选用例和各批 evidence candidate。 | 不新增 TC,不改断言。 |
| `05_test_plan_step_09_automation_gates.md` | 已承接 | 提供 P0 suite family、gate/report/check family、run-scoped artifact/report direction。 | 不定义 CI YAML 或脚本实现。 |
| `05_test_plan_step_10_nonfunctional.md` | 已承接 | 提供 redaction、dependency、observability、no static evidence、sample/trend 等专项证据方向。 | 不硬化无来源性能数字。 |
| `05_test_plan_step_11_defects_retest.md` | 已承接 | 提供 failed/fixed run、artifact/report、复验和风险接受证据方向。 | 不定义缺陷系统字段。 |
| `05_test_plan_step_12_entry_exit.md` | 已承接 | 提供 raw artifact/report pairing、no latest、no static pass、S/A 缺陷退出阻断。 | 不写 `06` 验收裁决。 |
| SOP Step 13 | 已读取 | 固定 16 个问题、证据归档表、报告生成表、目录结构、停审和真实性审计。 | 当前按要求输出中间产物。 |
| 书写规范 §4.6 / §5.13 | 已读取 | 固定 artifacts / reports / scripts 统一口径和 §13 表格要求。 | 路径必须 run-scoped。 |
| L1-governance Step 13 | 已对照 | 参考证据闭环、failed suite、report generation、no-static audit 框架。 | framework reference only。 |

### 3. Step 12 handoff 承接表

| Step 12 输出 | Step 13 承接方式 | 当前裁决 |
|---|---|---|
| raw artifact direction 必须存在 | 固定 `artifacts/test/<run_id>` 作为 raw artifact root。 | pass |
| human report direction 必须存在 | 固定 `reports/runs/<run_id>` 作为 generated report root。 | pass |
| report 必须从 raw artifact 推导 | 报告生成表要求 `scripts/reports/*` 读取 artifact 后生成 report。 | pass |
| 不得引用 `latest` | 所有正式证据引用必须使用固定 `<run_id>`。 | pass |
| 不得 static evidence pass | report-generation-audit 和 no-static 审计作为 P0 证据完整性要求。 | pass |
| failed suite 也必须可审计 | failed / timeout / unavailable 均保留 safe failure reason 和 report direction。 | pass |
| S 级和 evidence integrity 不得风险接受 | redaction/dependency/report audit failure 均阻断证据关闭。 | pass |
| 性能只作 sample/trend | `EV-ML-NFR-001` 只承接 sample/trend,不写硬阈值。 | pass |

### 4. SOP 十六问回答

| SOP 问题 | Step 13 回答 |
|---|---|
| 每类测试输出什么证据? | 每个 P0 suite / check 输出 suite raw artifact、case result direction、safe stdout/stderr direction、suite human report和 evidence index 条目方向;横切项输出 redaction、dependency、report integrity 和 release smoke summary direction。 |
| 证据保存在哪里? | raw artifact 保存到 `artifacts/test/<run_id>/...`;human report 保存到 `reports/runs/<run_id>/...`;acceptance handoff 初稿保存到 `reports/acceptance/...`;review 补充保存到 `reports/review/...`。 |
| 证据如何关联用例和验收项? | `EV-ML-*` 证据族必须回指 `TC-ML-*` 用例族、suite/check family、artifact root、report path 和后续 `06-验收标准.md` 的验收引用方向。 |
| 哪些日志、trace、DB snapshot 或报告必须保留? | P0 不要求真实 DB snapshot;必须保留 safe stdout/stderr、suite report、case result direction、gate summary、redaction/dependency/report audit、release smoke summary 和 defect retest direction。 |
| 证据保留多久? | P0 release candidate 证据至少保留到候选版本验收完成、相关 S/A 缺陷复验关闭、后续 residual 风险被接收为止;具体天数后续由归档策略定义。 |
| raw artifact 是否统一进入 `artifacts/test/<run_id>`? | 是,不得使用 `artifacts/test/<project>/<run_id>` 或无 run scope 路径。 |
| human report 是否统一进入 `reports/runs/<run_id>`? | 是,不得使用 `reports/<project>` 或手写 report 替代 artifact 推导。 |
| acceptance handoff 是否统一进入 `reports/acceptance`? | 是,但只作为脚本生成初稿和人 / Agent 审查补充入口,不自动宣告验收通过。 |
| 哪些报告由 `scripts/reports/*` 自动生成? | suite reports、run summary、gate summary、evidence index、redaction/dependency/report audit summary、acceptance handoff 初稿、risk/open issue 初稿。 |
| 哪些报告必须由人或 Agent 审查补充? | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、`reports/review/reviewer-notes.md`、`reports/review/agent-review.md`。 |
| 失败 suite 是否仍产出 artifact? | 是。failed / timeout / unavailable 均必须保留 safe failure reason、safe stdout/stderr direction、已执行 case result direction 和 suite report direction。 |
| redaction / boundary scan 如何证明安全? | redaction-boundary 扫描 artifact/report/log/diagnostic direction;dependency-boundary 扫描 compile dependency boundary;report audit 扫描 artifact/report pairing 和 no static evidence。 |
| P0 evidence 是否回指真实 artifact? | 是。P0 evidence 不能只来自静态映射,必须能从 `reports/runs/<run_id>/evidence-index.md` 回到 `artifacts/test/<run_id>/...`。 |
| 每个 EV 是否回指 TC/suite/artifact/report/AC/VETO? | 是。当前写后续验收引用方向,最终 AC/VETO 编号由新版 `06-验收标准.md` 固定。 |
| 每类报告完成后是否停审? | 是。每类报告必须检查 artifact 来源、report path、TC / 验收引用、redaction scan、boundary scan 和 failed suite 留证。 |
| 是否存在 orphan/static/report-missing/raw-leak/reference-break? | 必须执行跨证据真实性 / 追溯审计;发现 unresolved 冲突时不得进入 Step 14 closure。 |

### 5. L1-governance Step 13 框架参考边界

| 框架点 | L3 采用 | L3 差异 |
|---|---|---|
| evidence candidate 收敛成正式证据族 | 采用;L3 使用 `EV-ML-*` 组织证据族。 | 不复制 `EV-GOV-*`、`TC-GOV-*`、`AC-GOV-*`。 |
| raw artifact 与 human report 配对 | 采用;所有 P0 证据必须有 artifact/report pair。 | L3 不写 governance 领域 artifact 字段。 |
| failed suite 也归档 | 采用;failed / timeout / unavailable 仍留 safe failure reason。 | L3 failure reason 必须 body-free / secret-free。 |
| acceptance handoff 是初稿 + review | 采用;`reports/acceptance/*` 只作为后续验收输入。 | 当前不裁决 release verdict。 |
| redaction/dependency/no-static audit | 采用;作为 P0 evidence integrity 阻断。 | 不实现 scanner、manifest parser 或 CI required check。 |

### 6. L3 证据族候选

`EV-ML-*` 是 L3-method-library 当前测试方案的证据族候选。每次执行的具体证据实例必须由固定 `<run_id>`、suite/check family、artifact/report pair 和后续 evidence index 共同定位。

| 证据族 | 证据类型 | 主要来源 | 关联用例族 | 后续验收引用方向 |
|---|---|---|---|---|
| `EV-ML-CONTRACT-001` | contract / domain / state suite evidence | `contract-domain-fast` | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-STATE-*` | 方法资产定义 truth、正式化、版本稳定、body-free shell 验收方向。 |
| `EV-ML-SERVICE-001` | service flow suite evidence | `service-flow-fast` | `TC-ML-QUERY-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*`;fast `TC-ML-RECOVERY-*` | command/query/consumer/outbound/job fast flow 验收方向。 |
| `EV-ML-INFRA-001` | fake runtime / UoW / adapter evidence | `infra-runtime-fake` | `TC-ML-UOW-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-MARKER-*` | fake integration、controlled seam、runtime assembly 验收方向。 |
| `EV-ML-ENTRY-001` | API / worker / job entry evidence | `entry-worker-job` | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-JOB-*`;`TC-ML-REPORT-*` | entry shell、runner envelope、safe report/disposition 验收方向。 |
| `EV-ML-REPLAY-001` | operations replay / recovery evidence | `operations-replay-core`;`operations-replay-extended` | `TC-ML-REPLAY-*`;`TC-ML-RECOVERY-003~004`;`TC-ML-JOB-*`;`TC-ML-UOW-*` | stored replay、checkpoint/report、no truth repair 验收方向。 |
| `EV-ML-CONFIG-001` | config redline evidence | `config-redline` | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*` | strict validation、profile isolation、forbidden configurable boundary 验收方向。 |
| `EV-ML-DEPENDENCY-001` | dependency boundary evidence | `dependency-boundary` | dependency boundary cut;`TC-ML-DEPENDENCY-*` | only `core-contracts` compile dependency 验收方向。 |
| `EV-ML-REDACTION-001` | redaction / body-free evidence | `redaction-boundary` | `TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*`;`TC-ML-SHELL-*`;`TC-ML-BODY-*` | raw body / secret / endpoint / provider response 禁入验收方向。 |
| `EV-ML-OBSERVABILITY-001` | observability / audit-safe evidence | `observability-boundary` | `TC-ML-OBSERVABILITY-*`;`TC-ML-METRIC-*`;`TC-ML-AUDIT-*`;`TC-ML-DIAGNOSTIC-*` | metric low-cardinality、trace/span body-free、audit refs-only 验收方向。 |
| `EV-ML-REPORT-001` | report integrity evidence | `report-generation-audit` | `TC-ML-EVIDENCE-*`;`TC-ML-REPORT-*`;redaction/report pairing cases | artifact/report pairing、no static evidence、no latest 验收方向。 |
| `EV-ML-RELEASE-001` | release smoke evidence | `release-main-smoke` | representative `TC-ML-*` across truth/formalization/query/job/report/redaction | 送验前 representative smoke 和 gate summary 方向。 |
| `EV-ML-NFR-001` | nonfunctional sample / trend evidence | release / operations / observability reports | `TC-ML-METRIC-*`;`TC-ML-OBSERVABILITY-*`;NFR sample cases | sample/trend 和结构性性能方向,不含硬 P95/SLO。 |
| `EV-ML-DEFECT-001` | defect retest evidence | failed/fixed run report pair | 原失败 TC、同 family TC、所属 suite、相关 release check | 缺陷修复和复验关闭方向。 |
| `EV-ML-RISK-001` | residual / risk acceptance evidence | `reports/acceptance/risk-acceptance.md`;selected-run reports | P1/P2 selected-run / residual cases | residual 风险接受方向,不得计入 P0 pass。 |

### 7. 证据归档方向表

| 证据 ID | 证据类型 | 来源 | 保存位置 | 关联用例 | 验收引用 |
|---|---|---|---|---|---|
| `EV-ML-CONTRACT-001` | suite raw artifact + suite report | `contract-domain-fast` | `artifacts/test/<run_id>/suites/contract-domain-fast/`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | `TC-ML-TRUTH-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-STATE-*` | 后续 `06` truth / formal version / state AC。 |
| `EV-ML-SERVICE-001` | suite raw artifact + suite report | `service-flow-fast` | `artifacts/test/<run_id>/suites/service-flow-fast/`;`reports/runs/<run_id>/suites/service-flow-fast.md` | `TC-ML-QUERY-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*`;fast recovery cases | 后续 `06` command/query/flow AC。 |
| `EV-ML-INFRA-001` | fake integration artifact + report | `infra-runtime-fake` | `artifacts/test/<run_id>/suites/infra-runtime-fake/`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | `TC-ML-UOW-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-MARKER-*` | 后续 `06` runtime / adapter / controlled seam AC。 |
| `EV-ML-ENTRY-001` | entry / worker / job report | `entry-worker-job` | `artifacts/test/<run_id>/suites/entry-worker-job/`;`reports/runs/<run_id>/suites/entry-worker-job.md` | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-JOB-*`;`TC-ML-REPORT-*` | 后续 `06` entry and operations surface AC。 |
| `EV-ML-REPLAY-001` | replay / checkpoint / job report | `operations-replay-core`;nightly `operations-replay-extended` | `artifacts/test/<run_id>/suites/operations-replay-core/`;`reports/runs/<run_id>/suites/operations-replay-core.md` | `TC-ML-REPLAY-*`;`TC-ML-RECOVERY-003~004`;`TC-ML-JOB-*` | 后续 `06` consistency / recovery / no truth repair AC。 |
| `EV-ML-CONFIG-001` | config redline report | `config-redline` | `artifacts/test/<run_id>/suites/config-redline/`;`reports/runs/<run_id>/suites/config-redline.md` | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*` | 后续 `06` config redline AC。 |
| `EV-ML-DEPENDENCY-001` | dependency boundary report | `dependency-boundary` | `artifacts/test/<run_id>/suites/dependency-boundary/`;`reports/runs/<run_id>/dependency-boundary.md` | dependency boundary cut;`TC-ML-DEPENDENCY-*` | 后续 `06` dependency veto / AC。 |
| `EV-ML-REDACTION-001` | redaction scan report | `redaction-boundary` | `artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` | `TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*`;body-free shell cases | 后续 `06` redaction veto / AC。 |
| `EV-ML-OBSERVABILITY-001` | observability safe-output report | `observability-boundary` | `artifacts/test/<run_id>/suites/observability-boundary/`;`reports/runs/<run_id>/suites/observability-boundary.md` | `TC-ML-OBSERVABILITY-*`;`TC-ML-METRIC-*`;`TC-ML-AUDIT-*` | 后续 `06` observability not truth AC。 |
| `EV-ML-REPORT-001` | report integrity audit | `report-generation-audit` | `artifacts/test/<run_id>/suites/report-generation-audit/`;`reports/runs/<run_id>/report-audit.md` | `TC-ML-EVIDENCE-*`;report pairing / no-static cases | 后续 `06` evidence integrity veto / AC。 |
| `EV-ML-RELEASE-001` | release smoke summary | `release-main-smoke` | `artifacts/test/<run_id>/suites/release-main-smoke/`;`reports/runs/<run_id>/suites/release-main-smoke.md` | representative `TC-ML-*` | 后续 `06` release readiness direction;不替代底层 suite。 |
| `EV-ML-NFR-001` | sample / trend and safe observability report | selected P0 reports | `artifacts/test/<run_id>/suites/<suite>/`;`reports/runs/<run_id>/evidence/EV-ML-NFR-001.md` | `TC-ML-METRIC-*`;`TC-ML-OBSERVABILITY-*` | 后续 `06` NFR sample/trend direction,不含硬阈值。 |
| `EV-ML-DEFECT-001` | failed/fixed run retest report | defect retest run pair | `reports/runs/<failed_run_id>/...`;`reports/runs/<fixed_run_id>/...`;`reports/acceptance/open-issues.md` | 原失败 TC、同 family TC、所属 suite | 后续缺陷关闭和验收复核方向。 |
| `EV-ML-RISK-001` | residual / risk acceptance report | P1 selected-run / accepted residual | `reports/acceptance/risk-acceptance.md`;`reports/runs/<run_id>/suites/p1-real-like-selected-run.md` | P1/P2 selected-run cases | 后续 residual risk direction;不得计入 P0 pass。 |

### 8. 测试切口到证据 / 验收映射方向表

| 测试切口 | 用例 ID | Suite / Gate | 证据 ID | artifact root | report path | 后续验收 AC / VETO |
|---|---|---|---|---|---|---|
| definition truth / formal version / state | `TC-ML-TRUTH-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-STATE-*` | `contract-domain-fast` | `EV-ML-CONTRACT-001` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | truth ownership / version stability / state AC direction。 |
| command / query / controlled consumption flow | `TC-ML-QUERY-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*` | `service-flow-fast` | `EV-ML-SERVICE-001` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | flow / no-write / idempotency AC direction。 |
| fake runtime / UoW / controlled adapter seam | `TC-ML-UOW-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-MARKER-*` | `infra-runtime-fake` | `EV-ML-INFRA-001` | `artifacts/test/<run_id>/suites/infra-runtime-fake/` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` | runtime / seam / source marker AC direction。 |
| entry / worker / job shell | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-JOB-*`;`TC-ML-REPORT-*` | `entry-worker-job` | `EV-ML-ENTRY-001` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | entry surface / operations fact AC direction。 |
| replay / checkpoint / recovery / no repair | `TC-ML-REPLAY-*`;`TC-ML-RECOVERY-*`;`TC-ML-JOB-*` | `operations-replay-core`;nightly extended | `EV-ML-REPLAY-001` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | consistency / recovery / no truth repair AC direction。 |
| config validation / forbidden configurable boundary | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*` | `config-redline`;release config redline | `EV-ML-CONFIG-001` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | config redline AC / veto direction。 |
| dependency boundary | dependency boundary cut;`TC-ML-DEPENDENCY-*` | `dependency-boundary`;release dependency boundary | `EV-ML-DEPENDENCY-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | dependency veto direction。 |
| raw body / secret / diagnostic safety | `TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*`;body-free shell cases | `redaction-boundary`;release redaction boundary | `EV-ML-REDACTION-001` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | redaction veto direction。 |
| metric / trace / audit body-free | `TC-ML-METRIC-*`;`TC-ML-OBSERVABILITY-*`;`TC-ML-AUDIT-*` | `observability-boundary` | `EV-ML-OBSERVABILITY-001` | `artifacts/test/<run_id>/suites/observability-boundary/` | `reports/runs/<run_id>/suites/observability-boundary.md` | observability not truth AC direction。 |
| report pairing / no static evidence / no latest | `TC-ML-EVIDENCE-*`;report-generation audit cases | `report-generation-audit`;release report audit | `EV-ML-REPORT-001` | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | evidence integrity veto direction。 |
| release representative smoke | representative `TC-ML-*` | `release-main-smoke` | `EV-ML-RELEASE-001` | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | release readiness direction,不替代底层 AC。 |
| defect retest | failed TC + same family + suite | defect retest run pair | `EV-ML-DEFECT-001` | failed/fixed run artifact roots | failed/fixed run reports + open issues | defect closure direction。 |
| residual / P1 selected-run | P1 selected cases | `p1-real-like-selected-run` | `EV-ML-RISK-001` | `artifacts/test/<run_id>/suites/p1-real-like-selected-run/` | `reports/runs/<run_id>/suites/p1-real-like-selected-run.md`;`reports/acceptance/risk-acceptance.md` | residual only,not P0 pass。 |

### 9. Artifact 目录结构方向

```text
artifacts/test/<run_id>/
  meta/
    context.json
    source-commits.json
    config-digest.json
  evidence-index.json
  suites/
    <suite>/
      report.json
      stdout.log
      stderr.log
      cases/
        <case_id>.json
      artifacts/
        <safe_artifact_name>.json
```

约束:

- `artifacts/test/<run_id>` 是正式 raw artifact root,不得写成 `artifacts/test/<project>/<run_id>`。
- `<run_id>` 必须是固定 run 标识,不得用 `latest` 作为正式引用。
- `meta/*`、`evidence-index.json`、`suites/<suite>/report.json` 和 `cases/<case_id>.json` 是方向性结构;具体字段名、digest 规则和 assertion item schema 不在本 Step 发明,若实现需要必须回设计 / 测试证据 schema 闭口。
- `stdout.log`、`stderr.log`、safe artifact 必须进入 redaction scan;失败日志也不得包含 raw body、secret、endpoint、provider response 或完整敏感 ref。
- 失败、超时、unavailable 和 stop-review suite 也必须留下 safe failure reason direction,不得无证据跳过。

### 10. Reports 目录结构方向

```text
reports/
  README.md
  runs/
    <run_id>/
      summary.md
      evidence-index.md
      gate-results.md
      redaction-check.md
      dependency-boundary.md
      report-audit.md
      suites/
        <suite>.md
      evidence/
        EV-ML-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

约束:

- `reports/runs/<run_id>` 是 human report root,必须由 `scripts/reports/*` 从 `artifacts/test/<run_id>` 推导。
- `reports/acceptance/*` 只能作为验收交接初稿和审查补充输入,不得在测试方案中宣告验收 passed。
- `reports/review/*` 用于人 / Agent 审查补充,不得覆盖 raw artifact 或 suite failed 状态。
- report 不得包含 raw secret、token、private key、credential value、endpoint body、provider response 或完整业务正文。

### 11. 报告生成表

| 报告 | 来源 artifact | 生成脚本 | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| run summary | `artifacts/test/<run_id>/...` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/summary.md` | 检查 suite 列表、失败说明、run scope 和 source refs 是否一致。 |
| suite summary | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 检查失败解释是否 safe、准确且未覆盖 failed 状态。 |
| evidence index | `artifacts/test/<run_id>/evidence-index.json` + suite reports | `scripts/reports/generate_evidence_index.sh` | `reports/runs/<run_id>/evidence-index.md` | 检查 EV / TC / suite / artifact / report / acceptance direction 是否可追溯。 |
| gate results | suite raw artifacts and check outputs | `scripts/reports/build_gate_summary.sh` | `reports/runs/<run_id>/gate-results.md` | 检查 P0 blocking、P1 residual、failed / unavailable 分类是否正确。 |
| redaction check | redaction-boundary artifacts and report outputs | `scripts/reports/generate_redaction_report.sh` | `reports/runs/<run_id>/redaction-check.md` | 检查报告自身是否 body-free / secret-free。 |
| dependency boundary | dependency-boundary artifact direction | `scripts/reports/generate_dependency_report.sh` | `reports/runs/<run_id>/dependency-boundary.md` | 检查 non-core sibling compile dependency 是否阻断。 |
| report audit | report-generation-audit artifacts | `scripts/reports/generate_report_audit.sh` | `reports/runs/<run_id>/report-audit.md` | 检查 artifact/report pairing、no static evidence、no latest。 |
| evidence detail | evidence index + suite report pair | `scripts/reports/generate_evidence_detail.sh` | `reports/runs/<run_id>/evidence/EV-ML-<TYPE>-<NNN>.md` | 检查每个 EV 是否回指真实 artifact/report pair。 |
| acceptance handoff | `reports/runs/<run_id>/*` | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/handoff.md` | 人 / Agent 补充交付说明、残余风险和审查结论;不自动宣告 passed。 |
| veto checklist draft | evidence index + redaction/dependency/report audit | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/veto-checklist.md` | 人 / Agent 复核 veto 输入是否完整;正式 veto 裁决归 `06`。 |
| risk acceptance draft | residual / P1 selected-run reports | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/risk-acceptance.md` | 人 / Agent 补充接受人、影响范围、后续触发条件。 |
| open issues draft | failed suite reports + defect retest directions | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/open-issues.md` | 人 / Agent 标注 S/A/B/R、复验状态和未闭口项。 |

### 12. Failed suite 留证规则

| 失败类型 | 必须保留的证据方向 | 报告处理 | 禁止 |
|---|---|---|---|
| assertion failed | suite `report.json`、case result direction、safe stdout/stderr、safe failure reason。 | suite report 标记 failed,gate summary 标记 blocking failed。 | 手工改写为 passed。 |
| timeout | suite artifact direction、timeout safe failure reason、已执行 case result direction。 | report 说明 timeout,不得推断业务 unavailable。 | 用 timeout 替代正式 degraded / unavailable marker。 |
| flaky / unstable | failed or unstable direction、重复运行记录方向。 | P0 blocking suite 仍不得计 pass。 | 以 flaky 为由跳过 P0 断言。 |
| required fixture / profile missing | test fail-fast artifact direction、safe config issue direction。 | gate summary 标记 failed 或 stop-review。 | silent skip 后计 pass。 |
| marker/source/schema missing | stop-review artifact direction、owning source gap direction。 | report 标记 design/source gap,不补 marker。 | 从 fake/private map/raw error/route param 合成正式 marker。 |
| redaction failure | redaction scan artifact/report direction。 | P0 evidence integrity failed。 | 降级 warning 或隐藏 raw leak。 |
| dependency boundary failure | dependency report direction。 | P0 dependency boundary failed。 | 风险接受 non-core sibling compile dependency。 |
| report generation failed | report audit failed direction。 | release/report audit blocking failed。 | 用静态 report 补齐。 |

### 13. redaction / dependency / report audit 规则

| 审计 | 输入 | 输出 | 阻断条件 |
|---|---|---|---|
| redaction audit | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、safe logs / diagnostics | `reports/runs/<run_id>/redaction-check.md` | raw body、secret、token、private key、credential、endpoint body、provider response、完整敏感 ref 泄露。 |
| dependency boundary audit | dependency-boundary artifact direction、workspace dependency metadata direction | `reports/runs/<run_id>/dependency-boundary.md` | 非 `core-contracts` sibling compile dependency、runtime/event/replay boundary 写成 compile dependency。 |
| artifact/report pairing audit | suite artifact roots、suite reports、run summary | `reports/runs/<run_id>/report-audit.md` | P0 suite 缺 raw artifact、缺 human report、report 不是由 artifact 推导。 |
| no static evidence audit | evidence index、suite reports、acceptance handoff draft | `reports/runs/<run_id>/report-audit.md` | 静态 JSON / 手写 report 直接宣告 pass,或 EV 无真实 artifact/report pair。 |
| no latest audit | artifact refs、report refs、acceptance handoff refs | `reports/runs/<run_id>/report-audit.md` | 正式 evidence 或 acceptance handoff 引用 `latest`。 |
| reference integrity audit | EV / TC / suite / artifact / report / acceptance direction refs | `reports/runs/<run_id>/evidence-index.md` | orphan EV、orphan TC、orphan report、broken artifact ref、acceptance ref 断裂。 |

### 14. 证据 / 报告停审记录

| 证据 / 报告 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `EV-ML-CONTRACT-001` | 是否有 `contract-domain-fast` artifact/report pair 且回指 TC family | pass | 无。 |
| `EV-ML-SERVICE-001` | 是否有 `service-flow-fast` artifact/report pair 且不由 release smoke 替代 | pass | 无。 |
| `EV-ML-INFRA-001` | 是否只使用 fake/controlled seam,不要求真实 DB/broker/product | pass | 无。 |
| `EV-ML-ENTRY-001` | 是否只证明 entry/runner envelope,不替代 service flow 断言 | pass | 无。 |
| `EV-ML-REPLAY-001` | 是否覆盖 no truth repair、checkpoint/report 和 failed replay 留证方向 | pass | 无。 |
| `EV-ML-CONFIG-001` | 是否覆盖 strict validation、profile isolation、forbidden configurable boundary | pass | 无。 |
| `EV-ML-DEPENDENCY-001` | 是否作为 P0 dependency boundary 阻断证据方向 | pass | 无。 |
| `EV-ML-REDACTION-001` | 是否覆盖 artifact/report/log/diagnostic scan | pass | scanner 实现后移,不在本 Step 定义。 |
| `EV-ML-OBSERVABILITY-001` | 是否证明 safe observability direction 而非 observability truth | pass | backend / metric schema 后移。 |
| `EV-ML-REPORT-001` | 是否覆盖 pairing、no latest、no static evidence | pass | 机器 artifact 字段 schema 若实现需要需另行闭口。 |
| `EV-ML-RELEASE-001` | 是否仅作为 representative smoke | pass | 不替代底层 suite。 |
| `EV-ML-DEFECT-001` | 是否要求 failed/fixed run pair 和复验方向 | pass | 具体缺陷系统字段不在本 Step 定义。 |
| `EV-ML-RISK-001` | 是否标记 residual only,不计 P0 pass | pass | 无。 |
| `reports/acceptance/*` | 是否只作为 handoff draft + review | pass | 正式验收裁决后移 `06`。 |

### 15. 跨证据真实性 / 追溯审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 suite 是否都有 EV family direction | pass | contract/service/infra/entry/replay/config/dependency/redaction/observability/report/release 均有证据族。 |
| P0 EV 是否都有 artifact root | pass | 全部使用 `artifacts/test/<run_id>/...` direction。 |
| P0 EV 是否都有 report path | pass | 全部使用 `reports/runs/<run_id>/...` direction。 |
| 是否存在 `EV-GOV-*` 或 governance 领域事实污染 | pass | 当前使用 `EV-ML-*`,未复制 governance 编号。 |
| 是否存在 `latest` 正式引用 | pass | 当前只写固定 `<run_id>`。 |
| 是否存在 static evidence pass | pass | 已要求 no-static audit 和 artifact/report pair。 |
| 是否存在 failed suite 无证据 | pass | §12 已规定 failed / timeout / unavailable 均留证。 |
| 是否存在 raw leak 风险未审计 | pass | redaction audit 已覆盖 artifact/report/log/diagnostic direction。 |
| 是否存在 non-core dependency 风险未审计 | pass | dependency boundary audit 已覆盖。 |
| 是否提前写真实执行结论 | pass | 未写真实 pass/fail、真实 run id 或 release verdict。 |
| 是否提前写验收标准 | pass | 只写后续验收引用方向,正式 `06` 后续重启。 |
| 是否提前写实施计划 / CI | pass | 只写脚本职责方向,未写实现或 required checks。 |
| 是否存在机器 artifact schema 缺口 | accepted_deferral | 本 Step 只定义方向;若实现侧需要正式 JSON 字段,必须回测试证据 schema 闭口,不得私补。 |

### 16. source gap / 后移项

| 后移项 | 后续 owner | 处理口径 |
|---|---|---|
| 机器 artifact JSON 字段、case JSON schema、assertion item key | 后续测试证据 schema / implementation handoff 前闭口 | 当前只写目录方向和证据要求,不得实现侧私补。 |
| 具体 `scripts/reports/*` 实现 | `07-实施计划.md` / implementation boundary | 当前只写职责和输入输出方向。 |
| CI YAML、required checks、package commands | `07-实施计划.md` | 当前不定义。 |
| final AC / VETO 编号和验收裁决 | 新版 `06-验收标准.md` | 当前只写验收引用方向。 |
| 归档保留天数 | 项目归档策略 / 验收标准 | 当前只写保留到验收和缺陷复验关闭。 |
| scanner pattern、dependency graph schema、metric/span backend | implementation / observability detail,需设计闭口 | 当前不得在测试方案中发明。 |

### 17. Step 13 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 13 R13.1~R13.2 | pass |
| 是否输出证据族候选 | pass |
| 是否输出证据归档方向表 | pass |
| 是否输出测试切口到证据 / 验收映射方向表 | pass |
| 是否输出 artifact / report / acceptance / review 目录结构方向 | pass |
| 是否输出报告生成表 | pass |
| 是否输出 failed suite 留证规则 | pass |
| 是否输出 redaction / dependency / report audit 规则 | pass |
| 是否输出证据停审和跨证据真实性 / 追溯审计 | pass |
| 是否未复制 governance 编号或领域事实 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写实际执行结论、验收标准、实施计划或 implementation code | pass |

### 18. Step 14 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 13 是否可作为 `05-测试方案.md` §13 装配输入 | pass |
| Step 14 当前是否允许开始 | wait_user_confirm |
| Step 14 首个模块 | `R14.1 regression / residual risks:先思考` |
| Step 14 允许主题 | 回归策略、触发条件、回归范围、残余风险分类、风险接受边界、P1/P2 selected-run residual、证据与验收交接后续关系。 |
| Step 14 禁止主题 | 正式 `05-测试方案.md`、验收标准、实施计划、CI YAML、implementation code。 |

next_allowed_action: Step 13 completed;等待用户确认后进入 Step 14 `R14.1 regression / residual risks:先思考`;只允许思考回归策略与残余风险的输入边界、触发条件、回归范围、风险分类、风险接受边界、P1/P2 selected-run residual、证据交接和 R14.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写验收标准、实施计划或 implementation code。
