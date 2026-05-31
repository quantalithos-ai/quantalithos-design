# L0-sdk 07 实施计划 Step 7: 测试与验收门禁嵌入

> 本文件是 `projects/L0-sdk/07-实施计划.md` 的 Step 7 中间产物。
> 本步把 `05-测试方案.md` 和 `06-验收标准.md` 嵌入 PH-01~PH-07,定义每个阶段必须执行的测试门禁、验收门禁、artifact 输出、report 输出和失败处理。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 嵌入测试与验收门禁 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §7 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 提取 PH-01~PH-07 阶段顺序和阶段门禁 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 提取阶段任务、代码批次和 commit boundary |
| `projects/L0-sdk/05-测试方案.md` | 已完成 | 提取 suite、TC、EV、gate scripts、artifact / report 结构 |
| `projects/L0-sdk/06-验收标准.md` | 已完成 | 提取 AC-FUNC、AC-BOUND、AC-RED、AC-IF、AC-STATE、AC-NFR、AC-EV、VETO |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段应执行哪些测试用例或测试切口 | PH-01 执行 workspace / config / script / path smoke;PH-02 执行 contract / semantic / freshness;PH-03 执行 boundary / event / trace / security;PH-04 执行 candidate / package layout;PH-05 执行 docs / smoke / evidence / redaction;PH-06 执行 compatibility / deprecated;PH-07 执行 report / evidence / VETO / acceptance checks。 |
| 2. 哪些阶段必须对齐验收标准 AC 项 | 所有阶段都必须对齐 AC。PH-01 绑定 baseline、dependency、evidence path 前置;PH-02~PH-06 分别绑定 AC-FUNC-001~010 的功能门禁;PH-07 绑定 AC-EV、VETO 和最终裁决。 |
| 3. 每个门禁需要产出什么证据 | 每阶段产出固定 `artifacts/test/<run_id>/...` 原始证据;需要人读的摘要进入 `reports/runs/<run_id>`;最终验收入口进入 `reports/acceptance`。 |
| 4. 门禁失败是否允许继续进入下一阶段 | P0 阶段门禁失败不允许进入下一阶段。只有明确非 P0 的 staging-like 或 P1/P2 风险可登记风险接受,且不得支撑 P0 通过。 |
| 5. 哪些门禁可以自动化,哪些需要人工审查 | fmt / lint / unit / contract / service / integration / package / docs / smoke / redaction / report link check 应自动化;handoff、VETO checklist、risk acceptance、open issues 必须由人或 Agent 审查补充。 |
| 6. 哪些验收一票否决项需要在实施阶段提前规避 | VETO-SDK-001~011 都需要前置规避;core / bus truth、三语言闭环、raw secret、fake-only stable、skipped evidence、query write truth、compatibility、latest / cross-run artifact 是重点。 |
| 7. 每个阶段应调用哪些 `scripts/gates/*.sh` | PH-01~PH-03 主要调用 `run_pr_gate.sh` / `run_main_gate.sh` 子集;PH-04~PH-06 主要调用 `run_candidate_gate.sh` 和 `run_nightly_gate.sh` 子集;PH-07 聚合 main / candidate / nightly 结果并执行 report / check scripts。 |
| 8. 每个阶段会输出哪些 `artifacts/test/<run_id>/...` | 每阶段输出到对应 suite 目录,例如 `pr/contract`、`pr/service`、`main/event`、`candidate/build`、`candidate/docs`、`candidate/smoke`、`candidate/compat`、`main/checks`。 |
| 9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>` | PH-01 可只做脚本 smoke;PH-02 起可生成阶段报告草稿;PH-04~PH-06 必须可生成 candidate / smoke / compat 摘要;PH-07 必须生成完整 `reports/runs/<run_id>`。 |
| 10. 哪些阶段需要生成或更新 `reports/acceptance/*` | PH-07 必须生成 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和必要的 `open-issues.md`。 |
| 11. 哪些报告必须由人或 Agent 审查补充后才能进入验收 | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 必须审查补充;`reports/runs/<run_id>` 也需检查证据链接、失败解释和 redaction 结论。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 6 提交边界已有门禁但未统一映射到 AC / EV | 每个 boundary 有局部门禁 | 实施者可能只跑局部测试,不形成验收证据 | 本步统一阶段门禁矩阵 |
| 三语言 package / smoke 证据容易后置 | PH-04 / PH-05 是 P0,但容易被当成 release 后任务 | 触发 VETO-SDK-003 / 004 / 007 | 明确 candidate / docs / smoke / evidence 门禁 |
| artifact / report 路径容易混淆 | `artifacts/test/<run_id>` 与 `reports/` 分工不同 | 机器证据和人读报告断链 | 明确每阶段 artifact / report 输出 |
| acceptance handoff 容易脚本生成后无人审查 | `reports/acceptance/*` 需要人为补充 | 风险接受、VETO 和 open issues 不可追责 | 增加审查规则表 |
| P1/P2 能力可能污染 P0 门禁 | public registry、production endpoint、real credential 与 P0 接近 | P0 失败原因不清或范围膨胀 | 明确不作为 P0 门禁,只作为风险或后续专项 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试门禁 | 分散在 Step 6 和 `05` | 按 PH 阶段形成门禁矩阵 | 实施者知道每阶段必须跑什么 |
| 验收门禁 | 只在 `06` 定义 | 映射到 PH-01~PH-07 | 验收红线前置 |
| 证据归档 | 只有全局目录规则 | 每阶段给出 artifact 和 report 输出 | 证据链可追溯 |
| 失败处理 | 缺少阶段动作 | 明确阻断、修复、复跑和缺陷分级 | 不让失败阶段继续推进 |
| 报告审查 | 只说明报告可生成 | 明确 acceptance report 需人或 Agent 审查补充 | 保证送验材料可签署 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只在 PH-07 做完整验收 | 阶段执行简单 | 早期红线和证据缺失太晚暴露 | 不采用 |
| 每阶段绑定测试与相关 AC | 失败早发现,证据连续 | 每阶段需要维护 artifact / report | 采用 |
| 所有阶段都生成完整 report | 统一 | 早期 report 内容不足,成本高 | 不采用 |
| 阶段输出 artifact,关键阶段生成 report 草稿,PH-07 完整收口 | 成本适中,证据不断链 | 需要 PH-07 统一聚合 | 采用 |
| acceptance handoff 全自动生成 | 快 | 风险接受和 VETO 裁决不可只靠脚本 | 不采用 |
| 脚本生成初稿 + 人 / Agent 审查补充 | 可审计、可追责 | 多一个审查动作 | 采用 |

---

## 7. 结构化中间产物

### 7.1 阶段门禁矩阵

| 阶段编号 | 测试门禁 | 验收门禁 | 执行脚本 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | workspace check、path dependency check、config smoke、script args smoke、path check | AC-ENTRY-002 / 003、AC-IF-007 / 008 前置、AC-EV-006 前置 | `scripts/gates/run_pr_gate.sh` subset 或脚本自测 | `artifacts/test/<run_id>/pr/config`、`pr/contract`、`main/checks` | 可选 `reports/runs/<run_id>/bootstrap.md` | 阻断 PH-02;修复仓结构、dependency、脚本参数或路径后重跑 |
| PH-02 | `TC-SDK-CONTRACT-*`、`TC-SDK-SEMANTIC-*`、freshness query tests | AC-FUNC-001 / 002、AC-RED-001、AC-IF-007 / 008、AC-BOUND-001 / 002 | `scripts/gates/run_pr_gate.sh` subset | `artifacts/test/<run_id>/pr/contract`、`pr/unit`、`pr/service` | `reports/runs/<run_id>/evidence/EV-SDK-CONTRACT.md`、`EV-SDK-SEMANTIC.md` 草稿 | 阻断 PH-03;core / bus truth 被复制或 concept drift 必须修复 |
| PH-03 | `TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*`、`TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*` | AC-FUNC-003~006、AC-BOUND-003 / 005、AC-RED-002~006、AC-IF-003 / 008 / 009 | `scripts/gates/run_pr_gate.sh` + `scripts/gates/run_main_gate.sh` subset | `artifacts/test/<run_id>/pr/service`、`main/event`、`main/checks` | `EV-SDK-BOUNDARY.md`、`EV-SDK-EVENT.md`、`EV-SDK-TRACE.md`、`redaction-check.md` 草稿 | 阻断 PH-04;raw body、fake success 污染 production 或 boundary 写 truth 均为 blocker |
| PH-04 | `TC-SDK-CANDIDATE-*`、package layout check、candidate build subset | AC-FUNC-007、AC-IF-010、AC-RED-006 / 007、VETO-SDK-003 / 004 / 006 / 007 前置 | `scripts/gates/run_candidate_gate.sh` subset + `scripts/checks/check_package_layout.sh` | `artifacts/test/<run_id>/candidate/build` | `reports/runs/<run_id>/evidence/EV-SDK-CANDIDATE.md` 草稿 | 阻断 PH-05;candidate 未验证、缺三语言产物或 public registry 误作 P0 必须修正 |
| PH-05 | `TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*`、`TC-SDK-SECURITY-003~004`、boundary verification | AC-FUNC-008 / 009、AC-NFR-010、AC-EV-003 / 004、VETO-SDK-003 / 005 / 007 | `scripts/gates/run_candidate_gate.sh` subset + `scripts/checks/check_redaction.sh` | `artifacts/test/<run_id>/candidate/docs`、`candidate/smoke`、`main/checks` | `EV-SDK-DOCS.md`、`EV-SDK-SMOKE.md`、`redaction-check.md` 草稿 | 阻断 PH-06;skipped 当 passed、unredacted evidence 或 smoke drift 不得继续 |
| PH-06 | `TC-SDK-COMPAT-*`、compatibility regression subset、deprecated lifecycle tests | AC-FUNC-010、AC-RED-010、AC-NFR-007、VETO-SDK-010 | `scripts/gates/run_candidate_gate.sh` subset + `scripts/gates/run_nightly_gate.sh` subset | `artifacts/test/<run_id>/candidate/compat`、`nightly/compat` | `reports/runs/<run_id>/evidence/EV-SDK-COMPAT.md` 草稿 | 阻断 PH-07;breaking 被标 compatible 或 missing migration ref 必须修复 |
| PH-07 | main report check、candidate gate aggregation、nightly evidence review、redaction / path / link check | AC-EV-001~009、AC-ENTRY-*、VETO-SDK-001~011、最终验收结论 | `scripts/gates/run_main_gate.sh`、`run_candidate_gate.sh`、`run_nightly_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/reports/generate_acceptance_handoff.sh`、`scripts/checks/*` | `artifacts/test/<run_id>/meta`、`pr/*`、`main/*`、`candidate/*`、`nightly/*` | `reports/runs/<run_id>`、`reports/acceptance` | 阻断送验;S0/VETO 不可风险接受;S1 必须关闭复验;S2/P1-risk 需风险接受 |

### 7.2 Commit Boundary 门禁矩阵

| 提交边界 | 必跑测试 / 检查 | 最小证据 | 是否允许失败后提交 |
|---|---|---|---|
| commit-01-a | cargo check、path dependency、命名检查 | bootstrap check log | 否 |
| commit-01-b | config smoke、script args、artifact/report path check | config smoke log、path check log | 否 |
| commit-02-a | contract DTO、semantic baseline、concept map unit tests | `EV-SDK-CONTRACT`、`EV-SDK-SEMANTIC` subset | 否 |
| commit-02-b | derived view、freshness query、inbound changed consumer tests | freshness query evidence、consumer evidence | 否 |
| commit-03-a | boundary / event client tests、fake adapter tests | `EV-SDK-BOUNDARY`、`EV-SDK-EVENT` subset | 否 |
| commit-03-b | trace、error mapping、redaction、credential guard tests | `EV-SDK-TRACE`、`EV-SDK-SECURITY` subset | 否 |
| commit-04-a | candidate state and stable gate tests | candidate state evidence | 否 |
| commit-04-b | local package build、artifact metadata、package layout checks | `EV-SDK-CANDIDATE`、layout check | 否 |
| commit-05-a | docs examples、docs runner tests | `EV-SDK-DOCS` subset | 否 |
| commit-05-b | cross-language smoke、verification evidence、redaction evidence | `EV-SDK-SMOKE`、security evidence | 否 |
| commit-06-a | compatibility、deprecated、migration ref tests | `EV-SDK-COMPAT` | 否 |
| commit-07-a | projection rebuild、report generator、evidence index、report links | `reports/runs/<run_id>` draft | 否 |
| commit-07-b | handoff、VETO checklist、risk acceptance、final redaction / no-latest checks | `reports/acceptance/*` | 否 |

### 7.3 证据归档规则

| 规则 | 要求 |
|---|---|
| artifact root | 机器原始证据固定写入 `artifacts/test/<run_id>` |
| report root | 人类可读报告固定写入 `reports/runs/<run_id>` |
| acceptance root | 送验交接固定写入 `reports/acceptance` |
| 禁止路径 | 禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式 `latest` |
| 失败 suite | 失败也必须产出 `report.json`、stdout/stderr log 和 failure reason |
| redaction | artifact、report 和 acceptance handoff 均必须通过 redaction / boundary scan |
| 回链 | `reports/acceptance/handoff.md` 必须能回链到固定 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>` |
| 证据字段 | P0 EV 必须包含 `run_id`、`commit`、`suite`、`case_id`、`evidence_id`、`config_profile`、`result`;关键路径包含 trace / diagnostic ref |

### 7.4 报告生成与审查表

| 阶段编号 | 生成脚本 | 输入 artifact | 输出 report | 人 / Agent 审查要求 |
|---|---|---|---|---|
| PH-01 | `scripts/reports/generate_reports.sh` smoke | `artifacts/test/<run_id>/pr/config`、`main/checks` | 可选 `reports/runs/<run_id>/bootstrap.md` | 检查脚本参数、路径规则和 no-latest 口径 |
| PH-03 | `scripts/reports/generate_reports.sh` subset | `pr/service`、`main/event`、`main/checks` | `EV-SDK-BOUNDARY.md`、`EV-SDK-EVENT.md`、`redaction-check.md` 草稿 | 检查 fake marker、ref-only result、forbidden body 命中数 |
| PH-04 | `scripts/reports/generate_reports.sh` subset | `candidate/build` | `EV-SDK-CANDIDATE.md` 草稿 | 检查 local candidate 不等于 public registry、三语言 artifact metadata 完整 |
| PH-05 | `scripts/reports/generate_reports.sh` subset | `candidate/docs`、`candidate/smoke` | `EV-SDK-DOCS.md`、`EV-SDK-SMOKE.md` 草稿 | 检查 skipped / failed / unredacted 不支撑 passed |
| PH-06 | `scripts/reports/generate_reports.sh` subset | `candidate/compat`、`nightly/compat` | `EV-SDK-COMPAT.md` 草稿 | 检查 breaking / migration / deprecated 证据可追溯 |
| PH-07 | `scripts/reports/generate_reports.sh` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` 全量报告 | 检查 EV / TC / AC 追溯、失败解释和证据链接 |
| PH-07 | `scripts/reports/generate_acceptance_handoff.sh` | `reports/runs/<run_id>` | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` | 必须由人或 Agent 审查补充范围、commit、dependency snapshot、VETO、风险接受和未关闭问题 |

### 7.5 一票否决前置规避表

| VETO | 最早规避阶段 | 阶段动作 |
|---|---|---|
| VETO-SDK-001 重定义 core / bus truth | PH-01 / PH-02 | path dependency、contract compile、semantic baseline 不复制 truth |
| VETO-SDK-002 拥有服务端、runtime、UI、auth / governance truth | PH-03 | boundary scan、DTO / config / docs scan、ref-only result |
| VETO-SDK-003 三语言闭环缺失或语义漂移 | PH-02 / PH-04 / PH-05 | concept map、package layout、cross-language smoke |
| VETO-SDK-004 缺 local candidate 或 stable boundary / fake / fixture | PH-03 / PH-04 | boundary evidence、candidate evidence、fake marker |
| VETO-SDK-005 raw secret / forbidden body 泄漏 | PH-03 | security negative tests,PH-05 / PH-07 全量 redaction |
| VETO-SDK-006 fake-only success 污染 production supported / Stable | PH-03 / PH-04 | fake marker、support state、candidate stable gate |
| VETO-SDK-007 skipped / failed / unredacted / missing evidence 支撑 Stable | PH-04 / PH-05 | evidence result + redaction status + compatibility gate |
| VETO-SDK-008 配置关闭关键红线 | PH-01 / PH-03 | config validation、forbidden toggle negative tests |
| VETO-SDK-009 Query / projection / runtime boundary 写 truth | PH-02 / PH-03 / PH-07 | query no-write、projection rebuild、boundary call no-write tests |
| VETO-SDK-010 breaking / deprecated 缺 governance record | PH-06 | compatibility decision、migration ref、deprecated lifecycle evidence |
| VETO-SDK-011 证据伪造、跨 run 拼接或使用 latest | PH-01 / PH-07 | run_id 固定、report links、acceptance handoff 审查 |

### 7.6 门禁失败处理口径

| 失败类型 | 处理口径 |
|---|---|
| P0 用例失败 | 阻断进入下一阶段;修复后重跑对应 suite、最小回归和相关 redaction / evidence check |
| VETO 命中 | 不得风险接受;必须修复或回退;PH-07 只能给出不通过或重新送验 |
| artifact / report 路径非法 | 阻断当前阶段;修正路径,删除非法引用,重跑 report link check |
| redaction 命中 | S0 / VETO 候选;修复泄漏源并重跑 redaction + 受影响 suite |
| report 生成失败 | 阻断进入验收;若是非验收阶段摘要失败,记录缺陷并在 PH-07 前关闭 |
| package candidate 缺语言 | 阻断 PH-05;Rust / Python / TypeScript 任一缺失不得进入 smoke |
| smoke skipped 被当 passed | VETO-SDK-007 候选;必须修复 runner / fixture 或标记失败 |
| S1 缺陷 | 未关闭前不得通过 candidate gate 或最终验收 |
| S2 / P1-risk | 可进入有条件通过输入,但必须有 owner、deadline、risk acceptance 和 retest plan |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §7。

```markdown
## 7. 测试与验收门禁嵌入

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段门禁矩阵”“Commit Boundary 门禁矩阵”“证据归档规则”“报告生成与审查表”“一票否决前置规避表”和“门禁失败处理口径”小节,了解测试方案和验收标准如何嵌入实施过程。

每个阶段至少绑定一个测试门禁。涉及外部可见行为、状态转换、跨仓交互、事务一致性、幂等、安全红线、审计或报告证据的阶段,必须绑定验收门禁。P0 门禁失败不得进入下一阶段。

正式内容从 `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` §7.1~§7.6 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 是否每个阶段都生成完整 `reports/runs/<run_id>` | 不需要 | 早期 report 不完整,成本高 | 阶段产 artifact,关键阶段生成 report 草稿,PH-07 全量生成 |
| 是否需要独立 release gate script | 当前 `05` 固定 PR / main / nightly / candidate gate | 若另设 release gate 会偏离现有测试方案 | 不新增,PH-07 聚合既有 gate 和 report scripts |
| 是否允许阶段失败后继续 | P0 不允许 | 继续会污染后续证据 | 不允许,必须修复并重跑 |
| acceptance handoff 是否纯脚本输出 | 不能纯脚本 | 风险接受和 VETO 需要责任判断 | 脚本生成初稿,人或 Agent 审查补充 |

建议方案: 接受当前门禁矩阵。原因是它把测试和验收前置到每个阶段,同时保留 PH-07 的完整 reports、VETO 和 acceptance handoff 收口。

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阶段门禁矩阵已覆盖 PH-01~PH-07 | 已满足 |
| 每个阶段都有测试门禁、验收门禁、执行脚本、artifact 输出、report 输出和失败处理 | 已满足 |
| Commit boundary 到测试 / 证据的映射明确 | 已满足 |
| 证据归档规则明确使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance` | 已满足 |
| VETO-SDK-001~011 已明确最早规避阶段 | 已满足 |

结论: 可以进入 Step 8,继续定义配置、环境与外部依赖准备。
