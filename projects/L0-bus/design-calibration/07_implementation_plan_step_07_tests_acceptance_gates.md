# L0-bus 07 实施计划 Step 7: 测试与验收门禁嵌入

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 7 中间产物。
> 本步把 `05-测试方案.md` 和 `06-验收标准.md` 嵌入 PH-01~PH-08,定义每个阶段必须执行的测试门禁、验收门禁、artifact 输出、report 输出和失败处理。
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
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 提取 PH-01~PH-08 阶段顺序和阶段门禁 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 提取阶段任务、代码批次和 commit boundary |
| `projects/L0-bus/05-测试方案.md` | 已完成 | 提取 TS / TC / EV / RP、gate scripts、artifact / report 结构 |
| `projects/L0-bus/06-验收标准.md` | 已完成 | 提取 AC-FUNC、AC-RED、AC-IF、AC-STATE、AC-TX、AC-IDEM、AC-CONC、AC-NFR、AC-EVID、VETO |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段应执行哪些测试用例或测试切口 | PH-01 执行 workspace/config/script smoke;PH-02~PH-07 分别执行 PUB、SEM/DLV/BND、OBX、FDB、REC、OUT 用例族;PH-08 执行 RED、release gate 和 acceptance checks。 |
| 2. 哪些阶段必须对齐验收标准 AC 项 | PH-02~PH-08 均绑定 AC;PH-01 绑定 AC-IF-006、AC-FUNC-009、AC-FUNC-010 的前置检查。 |
| 3. 每个门禁需要产出什么证据 | 每阶段产出固定 `artifacts/test/<run_id>/suites/<suite>` 原始证据;需要人读的摘要进入 `reports/runs/<run_id>`;最终验收入口进入 `reports/acceptance`。 |
| 4. 门禁失败是否允许继续进入下一阶段 | P0 / P0-min 阶段门禁失败不允许进入下一阶段;非阻断脚本输出问题可登记 S2/S3,但必须在 PH-08 前关闭或风险接受。 |
| 5. 哪些门禁可以自动化,哪些需要人工审查 | TC / suite / redaction / path / link check 应自动化;acceptance handoff、VETO checklist、risk acceptance、open issues 需要人或 Agent 审查补充。 |
| 6. 哪些验收一票否决项需要在实施阶段提前规避 | VETO-BUS-001~012 都需要前置规避;其中 shared contract、forbidden body、delivery trace、replay guard、Query no-write、evidence chain、config redline 和 committed outbox fact 是阶段必检项。 |
| 7. 每个阶段应调用哪些 `scripts/gates/*.sh` | PH-01~PH-07 主要调用 `run_pr_gate.sh` 或 `run_ci_gate.sh` 的阶段 subset;PH-08 调用 `run_release_gate.sh`。 |
| 8. 每个阶段会输出哪些 `artifacts/test/<run_id>/...` | 每阶段输出到对应 suite 目录,例如 `suites/publication`、`suites/delivery`、`suites/outbox`、`suites/feedback`、`suites/recovery`、`suites/output`、`suites/redaction`。 |
| 9. 哪些阶段需要调用 `scripts/reports/*.sh` 生成 `reports/runs/<run_id>` | PH-01 只校验脚本骨架;PH-03 起可生成阶段摘要;PH-07 生成 output / redaction 摘要;PH-08 必须生成完整 `reports/runs/<run_id>`。 |
| 10. 哪些阶段需要生成或更新 `reports/acceptance/*` | PH-08 必须生成 `reports/acceptance/<run_id>-index.md`、`handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`。 |
| 11. 哪些报告必须由人或 Agent 审查补充后才能进入验收 | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 必须审查补充;`reports/runs/<run_id>` 的 generated report 也需检查证据链接和失败解释。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 6 提交边界已有门禁但未统一映射到 AC / EV | 每个 boundary 有局部门禁 | 实施者可能只跑单测,不形成验收证据 | 本步统一阶段门禁矩阵 |
| artifact / report 路径容易混淆 | `artifacts/test/<run_id>` 与 `reports/` 分工不同 | 机器证据和人读报告断链 | 明确每阶段 artifact / report 输出 |
| release gate 容易被当成唯一验收 | PH-08 最终收口 | 早期红线问题太晚发现 | PH-02 起前置 AC / VETO 检查 |
| acceptance handoff 容易脚本生成后无人审查 | `reports/acceptance/*` 需要人为补充 | 风险接受、VETO 和 open issues 不可追责 | 增加审查规则表 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试门禁 | 分散在 Step 6 和 `05` | 按 PH 阶段形成门禁矩阵 | 实施者知道每阶段必须跑什么 |
| 验收门禁 | 只在 `06` 定义 | 映射到 PH-01~PH-08 | 验收红线前置 |
| 证据归档 | 只有全局目录规则 | 每阶段给出 artifact 和 report 输出 | 证据链可追溯 |
| 失败处理 | 缺少阶段动作 | 明确阻断、修复、复跑和缺陷分级 | 不让失败阶段继续推进 |
| 报告审查 | 只说明报告可生成 | 明确 acceptance report 需人或 Agent 审查补充 | 保证送验材料可签署 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只在 PH-08 做完整验收 | 阶段执行简单 | 早期红线和证据缺失太晚暴露 | 不采用 |
| 每阶段绑定测试与相关 AC | 失败早发现,证据连续 | 每阶段需要维护 artifact / report | 采用 |
| 所有阶段都生成完整 report | 统一 | 早期 report 内容不足,浪费成本 | 不采用 |
| 阶段输出 artifact,关键阶段生成 report,PH-08 完整收口 | 成本适中,证据不断链 | 需要 PH-08 统一聚合 | 采用 |
| acceptance handoff 全自动生成 | 快 | 风险接受和 VETO 裁决不可只靠脚本 | 不采用 |
| 脚本生成初稿 + 人 / Agent 审查补充 | 可审计、可追责 | 多一个审查动作 | 采用 |

---

## 7. 结构化中间产物

### 7.1 阶段门禁矩阵

| 阶段编号 | 测试门禁 | 验收门禁 | 执行脚本 | artifact 输出 | report 输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | workspace check、config smoke、script args smoke、path check | AC-IF-006、AC-FUNC-009 前置、AC-FUNC-010 前置、AC-EVID-007 | `scripts/gates/run_pr_gate.sh` subset 或脚本自测 | `artifacts/test/<run_id>/suites/bootstrap`、`suites/config` | 可选 `reports/runs/<run_id>/bootstrap.md` | 阻断 PH-02;修复仓结构、dependency、脚本参数或路径后重跑 |
| PH-02 | `TC-BUS-PUB-001`~`004`、publication unit / service / API、redaction smoke | AC-FUNC-001、AC-RED-001 / 002、AC-STATE-001、AC-TX-001、VETO-BUS-002 / 003 | `scripts/gates/run_pr_gate.sh` subset | `artifacts/test/<run_id>/suites/publication` | `reports/runs/<run_id>/evidence/EV-BUS-PUB.md` 草稿 | P0 阻断;不得进入 PH-03;修复并重跑 PUB + redaction |
| PH-03 | `TC-BUS-SEM-001`~`002`、`TC-BUS-DLV-001`~`004`、`TC-BUS-BND-001`~`003` | AC-FUNC-002 / 003 / 008、AC-RED-004、AC-STATE-002、AC-TX-003、VETO-BUS-007 | `scripts/gates/run_ci_gate.sh` subset | `artifacts/test/<run_id>/suites/semantic`、`suites/delivery`、`suites/backend` | `reports/runs/<run_id>/evidence/EV-BUS-SEM.md`、`EV-BUS-DLV.md`、`EV-BUS-BND.md` 草稿 | P0 / P0-min 阻断;backend fake 不稳定或 semantic 泄漏必须修复 |
| PH-04 | `TC-BUS-OBX-001`~`002`、source duplicate、ack failure replay | AC-FUNC-007、AC-RED-008、AC-IF-003 / 008、AC-TX-002、AC-IDEM-002、VETO-BUS-012 | `scripts/gates/run_ci_gate.sh` subset | `artifacts/test/<run_id>/suites/outbox` | `reports/runs/<run_id>/evidence/EV-BUS-OBX.md` 草稿 | P0-min 阻断;source ack 或 duplicate 失败不得进入 PH-05 |
| PH-05 | `TC-BUS-FDB-001`~`004`、idempotency、concurrency subset | AC-FUNC-004、AC-STATE-003、AC-IDEM-001、AC-CONC-002、VETO-BUS-004 | `scripts/gates/run_ci_gate.sh` subset | `artifacts/test/<run_id>/suites/feedback` | `reports/runs/<run_id>/evidence/EV-BUS-FDB.md` 草稿 | P0 阻断;unknown / late feedback 产生孤儿事实时必须修复 |
| PH-06 | `TC-BUS-REC-001`~`004`、recovery guard、manual action evidence | AC-FUNC-005、AC-RED-007、AC-STATE-004、AC-CONC-002、VETO-BUS-005 | `scripts/gates/run_ci_gate.sh` subset | `artifacts/test/<run_id>/suites/recovery` | `reports/runs/<run_id>/evidence/EV-BUS-REC.md` 草稿 | P0 阻断;replay guard 失败或缺 audit chain 只能修复或回退 |
| PH-07 | `TC-BUS-OUT-001`~`006`、Query no-write、redaction、publisher failure | AC-FUNC-006、AC-RED-005 / 006、AC-IF-002 / 004 / 009、AC-STATE-005、AC-TX-004、AC-NFR-002 / 005 / 008、VETO-BUS-008 / 009 | `scripts/gates/run_ci_gate.sh` subset + `scripts/checks/check_redaction.sh` | `artifacts/test/<run_id>/suites/output`、`suites/redaction` | `reports/runs/<run_id>/evidence/EV-BUS-OUT.md`、`redaction-check.md` | P0 阻断;Query 写 truth、failure material 生成 decision 或 redaction 命中必须修复 |
| PH-08 | `TC-BUS-RED-001`~`002`、release closed loop、release recovery、release config、release report | AC-FUNC-010、AC-EVID-001~010、AC-NFR-001~010、VETO-BUS-001~012 | `scripts/gates/run_release_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/reports/generate_acceptance_handoff.sh`、`scripts/checks/*` | `artifacts/test/<run_id>/meta`、`suites/*`、`evidence-index.json` | `reports/runs/<run_id>`、`reports/acceptance` | 阻断验收;S0/VETO 不可风险接受;S1 必须关闭复验;S2/P1-risk 需风险接受 |

### 7.2 证据归档规则

| 规则 | 要求 |
|---|---|
| artifact root | 机器原始证据固定写入 `artifacts/test/<run_id>` |
| report root | 人类可读报告固定写入 `reports/runs/<run_id>` |
| acceptance root | 送验交接固定写入 `reports/acceptance` |
| 禁止路径 | 禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>` 和正式 `latest` |
| 失败 suite | 失败也必须产出 `report.json`、stdout/stderr log 和 failure reason |
| redaction | artifact 和 report 均必须通过 redaction / boundary scan |
| 回链 | `reports/acceptance/<run_id>-index.md` 必须能回链到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>` |

### 7.3 报告生成与审查表

| 阶段编号 | 生成脚本 | 输入 artifact | 输出 report | 人 / Agent 审查要求 |
|---|---|---|---|---|
| PH-01 | `scripts/reports/generate_reports.sh` smoke | `artifacts/test/<run_id>/suites/bootstrap` | 可选 `reports/runs/<run_id>/bootstrap.md` | 检查脚本参数、路径规则和 no-latest 口径 |
| PH-03 | `scripts/reports/generate_reports.sh` subset | `suites/semantic`、`suites/delivery`、`suites/backend` | `EV-BUS-SEM.md`、`EV-BUS-DLV.md`、`EV-BUS-BND.md` 草稿 | 检查 backend 差异未泄漏、delivery history 证据完整 |
| PH-05 | `scripts/reports/generate_reports.sh` subset | `suites/feedback` | `EV-BUS-FDB.md` 草稿 | 检查幂等、并发和 late feedback 失败解释 |
| PH-07 | `scripts/reports/generate_reports.sh` subset | `suites/output`、`suites/redaction` | `EV-BUS-OUT.md`、`redaction-check.md` | 检查 Query no-write、failure material、redaction 结论 |
| PH-08 | `scripts/reports/generate_reports.sh` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` 全量报告 | 检查 EV / TC / AC 追溯、失败解释和证据链接 |
| PH-08 | `scripts/reports/generate_acceptance_handoff.sh` | `reports/runs/<run_id>` | `reports/acceptance/<run_id>-index.md`、`handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` | 必须由人或 Agent 审查补充范围、commit、dependency snapshot、VETO、风险接受和未关闭问题 |

### 7.4 一票否决前置规避表

| VETO | 最早规避阶段 | 阶段动作 |
|---|---|---|
| VETO-BUS-001 P0 主闭环无法成立 | PH-02 | 每阶段绑定 P0 / P0-min 用例,PH-08 release gate 汇总 |
| VETO-BUS-002 重新定义或绕过 L0-core 共享契约 | PH-01 | dependency snapshot、contract compile 和 AC-RED-001 检查 |
| VETO-BUS-003 forbidden body 或 raw secret 泄漏 | PH-02 | publication redaction smoke,PH-07 / PH-08 全量 redaction |
| VETO-BUS-004 delivery / feedback / recovery 缺追溯链 | PH-03 | delivery history、feedback audit、recovery evidence 分阶段检查 |
| VETO-BUS-005 replay 绕过材料链 | PH-06 | replay guard、approval ref、audit chain negative tests |
| VETO-BUS-006 privileged output / operation 无授权边界 | PH-06 | replay / tap / failure material privileged ref 和 access audit |
| VETO-BUS-007 backend 差异泄漏 | PH-03 | semantic normalization 和 backend private field negative tests |
| VETO-BUS-008 failure material 被当成 governance decision | PH-07 | failure material contract 和 governance decision body redaction |
| VETO-BUS-009 Query / projection 反写 truth | PH-07 | Query no-write UoW tests |
| VETO-BUS-010 P0 证据链不可审计 | PH-01 | artifact / report 路径骨架,PH-08 全量 evidence index |
| VETO-BUS-011 配置绕过关键红线 | PH-01 | config smoke,PH-08 config summary |
| VETO-BUS-012 未提交业务状态进入 bus truth | PH-04 | committed outbox fact fixture 和 source ack evidence |

### 7.5 门禁失败处理口径

| 失败类型 | 处理口径 |
|---|---|
| P0 / P0-min 用例失败 | 阻断进入下一阶段;修复后重跑对应 suite、最小回归和相关 redaction / evidence check |
| VETO 命中 | 不得风险接受;必须修复或回退;PH-08 只能给出不通过或重新送验 |
| artifact / report 路径非法 | 阻断当前阶段;修正路径,删除非法引用,重跑 report link check |
| redaction 命中 | S0 / VETO 候选;修复泄漏源并重跑 redaction + 受影响 suite |
| report 生成失败 | 阻断进入验收;若是非验收阶段摘要失败,记录缺陷并在 PH-08 前关闭 |
| S1 缺陷 | 未关闭前不得通过 release gate 或验收 |
| S2 / P1-risk | 可进入有条件通过输入,但必须有 owner、deadline、risk acceptance 和 retest plan |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §7。

```markdown
## 7. 测试与验收门禁嵌入

> 校准来源：
> - `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阶段门禁矩阵”“证据归档规则”“报告生成与审查表”“一票否决前置规避表”和“门禁失败处理口径”小节，了解测试方案和验收标准如何嵌入实施过程。

每个阶段至少绑定一个测试门禁。涉及外部可见行为、状态转换、跨仓交互、事务一致性、幂等、安全红线、审计或报告证据的阶段,必须绑定验收门禁。P0 / P0-min 门禁失败不得进入下一阶段。

正式内容从 `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` §7.1~§7.5 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 是否每个阶段都生成完整 `reports/runs/<run_id>` | 不需要 | 早期 report 不完整,成本高 | 阶段产 artifact,关键阶段生成 report 草稿,PH-08 全量生成 |
| 是否需要 `run_pr_gate.sh` | `05-测试方案.md` 已列出 PR gate | Step 3 最小脚本清单未强制列出 | 建议 PH-01 同步创建或至少预留 `run_pr_gate.sh` |
| 是否允许阶段失败后继续 | P0 / P0-min 不允许 | 继续会污染后续证据 | 不允许,必须修复并重跑 |
| acceptance handoff 是否纯脚本输出 | 不能纯脚本 | 风险接受和 VETO 需要责任判断 | 脚本生成初稿,人或 Agent 审查补充 |

建议方案: 接受当前门禁矩阵。原因是它把测试和验收前置到每个阶段,同时保留 PH-08 的完整 release gate 和 acceptance handoff 收口。

---

## 10. 进入下一步条件

- 阶段门禁矩阵已覆盖 PH-01~PH-08。
- 每个阶段都有测试门禁、验收门禁、执行脚本、artifact 输出、report 输出和失败处理。
- 证据归档规则明确使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。
- VETO-BUS-001~012 已明确最早规避阶段。
- 可以进入 Step 8,继续定义配置、环境与外部依赖准备。
