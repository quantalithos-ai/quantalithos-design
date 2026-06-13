# Step 4. 定义进入条件与退出条件

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填章节: `06-验收标准.md` §4 进入条件与退出条件

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 定义进入条件与退出条件 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 验收基线;`05-测试方案.md` §11 / §12 / §13 / §14 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_04_entry_exit.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 5 |

## 2. 本步目标

定义正式验收什么时候可以开始、什么时候可以结束、什么时候必须暂停或判定不可裁决。

本 Step 只回答:

- 开始验收前哪些基线必须确认。
- 哪些测试证据和 acceptance handoff 必须先生成。
- 哪些缺陷、红线、证据缺口会阻断进入或退出。
- 退出验收需要哪些裁决和签署前置。
- 哪些风险必须先接受。

本 Step 不执行测试、不填写真实缺陷状态、不裁决最终通过 / 有条件通过 / 不通过。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | 已完成 | 提供必须固定的文档、交付、环境、证据和 acceptance 基线 |
| `05-测试方案.md` §11 | 已完成 | 提供 S/A/B/R 缺陷分级、复验和风险接受规则 |
| `05-测试方案.md` §12 | 已完成 | 提供测试进入 / 退出 / 暂停阻断准则 |
| `05-测试方案.md` §13 | 已完成 | 提供 `EV-GOV-*`、artifact/report/acceptance/review 证据结构 |
| `05-测试方案.md` §14 | 已完成 | 提供回归策略、residual 和不可风险接受项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认? | 必须固定 `00`~`05` design source refs、implementation commit / build / image、core-contracts ref、P0 profile、config digest、fixture / replay root、`run_id`、artifact root、report root 和 acceptance handoff 入口。 |
| 哪些测试证据必须先生成? | 至少必须存在 P0 blocking suite reports、`reports/runs/<run_id>/evidence-index.md`、redaction-check、dependency-boundary、report-audit、gate-summary、`reports/acceptance/handoff.md` 和 `veto-checklist.md`。有 residual / 条件通过时还必须有 `risk-acceptance.md`。 |
| 哪些缺陷会阻断进入验收? | 未关闭 S 级缺陷、未复验 VF-GOV 相关缺陷、redaction / dependency / evidence integrity 缺陷、P0 profile 无法装配、缺少 raw artifact/report pairing、实现或设计基线未固定均阻断进入。 |
| 退出验收需要哪些结论? | 所有 P0 验收门禁必须有通过 / 失败 / 不适用-with-reason 裁决;所有 VETO 必须有真实证据支撑未触发;S=0;A 级缺陷修复或正式接受;residual 有接受人、后续动作和截止条件;最终结论和签署口径可执行。 |
| 哪些风险必须先接受? | P1 selected-run unavailable、真实 DB/bus/external GRC 未验证、performance hard threshold 未硬化、production-like capacity 未覆盖、evidence retention 天数未固定等 residual 若影响有条件通过,必须进入 `reports/acceptance/risk-acceptance.md`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §3 | 进入条件只要求旧 `02/03/05` 和基础数据 | 新版进入条件要求固定完整 `00`~`05`、交付、config、run_id 和 acceptance evidence |
| 旧 `06-验收标准.md` §3 | 退出条件只列 P0 验收项、少数高风险链路和 S 级缺陷 | 新版退出条件增加 VETO、EV-GOV、artifact/report pairing、redaction/dependency/report audit、risk acceptance |
| `05-测试方案.md` §12 | 测试退出准则不等于验收退出准则 | 本 Step 将测试退出结果升级为验收进入 / 退出裁决前置 |
| Step 3 | 当前未提供真实 run / commit | 本 Step 将其列为正式进入验收前的阻断前置,不伪造 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入条件 | 文档冻结 + 基础数据 | 固定 source refs、交付、run_id、config digest、P0 reports、acceptance handoff | 验收必须可裁决可复验 |
| 退出条件 | P0 通过 + S=0 + 风险接受 | P0 门禁裁决、VETO 未触发、证据完整、缺陷闭环、risk acceptance 和签署前置 | 支撑三值结论 |
| 暂停条件 | 测试层阻断 | 增加基线漂移、证据伪造、acceptance 缺失、P0 profile 不可用 | 防止不可裁决仍进入验收 |
| 风险接受 | 遗留项列表 | residual 必须有 `risk-acceptance.md`、接受人、动作和截止条件 | 有条件通过必须有证据 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否允许缺 `run_id` 进入验收 | A. 允许后补;B. 不允许 | 采用 B。无 `run_id` 无法追溯证据 |
| 是否允许先验收后补 `reports/acceptance/*` | A. 允许;B. 不允许 | 采用 B。acceptance handoff / VETO / risk 是验收入口 |
| P1 unavailable 是否阻断退出 | A. 阻断;B. 不阻断但需 residual | 采用 B。P1 不作 P0 前置 |
| S 级缺陷是否可条件通过 | A. 可由负责人接受;B. 不可 | 采用 B。S 级与 VETO 不可风险接受 |

## 8. 结构化中间产物

### 8.1 进入条件

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 的 design source refs 已固定。
- [ ] implementation commit / build id / image digest 已固定。
- [ ] core-contracts / `L0-core` source ref 或 package version 已固定。
- [ ] P0 profile、config digest、runtime config source、fixture set / replay root 已固定。
- [ ] `run_id` 已固定且不是 `latest`。
- [ ] raw artifact root 为 `artifacts/test/<run_id>`,且存在符合 `05-测试方案.md` §13.3.1 schema 的 suite `report.json`、stdout/stderr、case JSON 和 artifact digest。
- [ ] run report root 为 `reports/runs/<run_id>`,且存在 summary、gate-summary、evidence-index、suite reports、redaction-check、dependency-boundary、report-audit。
- [ ] `reports/acceptance/handoff.md` 已生成,并记录 source refs、P0/P1/P2 边界、未覆盖说明。
- [ ] `reports/acceptance/veto-checklist.md` 已生成,且每个 VETO 项引用真实 evidence / report / artifact。
- [ ] 若存在 residual 或有条件通过可能,`reports/acceptance/risk-acceptance.md` 已生成。
- [ ] `reports/acceptance/open-issues.md` 已生成,并列明 failed / pending suite、S/A 缺陷和缺失证据。
- [ ] `reports/review/reviewer-notes.md` 或 `reports/review/agent-review.md` 已准备作为审查补充入口。
- [ ] 所有 P0 blocking suite 已执行或有正式 failed / unavailable artifact,不得缺 artifact 后人工补表。
- [ ] 当前无未关闭 S 级缺陷。
- [ ] 当前无未复验的 VF-GOV-001~010 相关修复。
- [ ] 当前无 redaction / dependency / report audit 阻断项。
- [ ] P0 profile 未出现 unavailable but marked passed。

### 8.2 退出条件

- [ ] 每个 P0 验收项都有明确结论:通过 / 失败 / 不适用且有正式理由。
- [ ] AC-GOV-001~031 均已映射到至少一个验收项、`TC-GOV-*`、`EV-GOV-*` 和 report path。
- [ ] VF-GOV-001~010 均有真实 evidence 支撑未触发,且 `veto-checklist.md` 未静态默认 passed。
- [ ] 所有 P0 blocking suite 均有 raw artifact / run report pairing。
- [ ] `EV-GOV-*` evidence index 无 orphan EV、无静态造证据、无缺 artifact digest。
- [ ] redaction-check、dependency-boundary、report-audit 均通过或明确导致不通过。
- [ ] `release-main-smoke` 证明业务场景级闭环,不是只输出通用测试计数。
- [ ] Query / projection / reconciliation / handoff / export job no truth repair 红线有证据覆盖。
- [ ] 当前无未关闭 S 级缺陷。
- [ ] A 级缺陷已修复并复验,或有正式风险接受且不触发 VETO。
- [ ] B/R 缺陷或 P1/P2 residual 已进入 `risk-acceptance.md` 或 `open-issues.md`,并有责任人 / 接受人 / 后续动作。
- [ ] P1 selected-run unavailable 未计入 P0 passed evidence。
- [ ] performance sample / trend 已记录;若无正式阈值,不得据此裁决 pass/fail。
- [ ] 最终结论三值口径可执行:通过 / 有条件通过 / 不通过。
- [ ] 最终签署角色和审查材料齐备。

### 8.3 暂停 / 不可裁决条件

| 触发 | 处理 |
|---|---|
| design source refs、implementation commit、core-contracts ref 或 config digest 未固定 | 不进入正式验收 |
| `run_id` 缺失或使用 `latest` | 不进入正式验收 |
| raw artifact 缺失、缺 digest 或路径不符合 `artifacts/test/<run_id>` | 不进入正式验收 |
| run report 缺失、缺 evidence-index 或路径不符合 `reports/runs/<run_id>` | 不进入正式验收 |
| `reports/acceptance/handoff.md` 或 `veto-checklist.md` 缺失 | 不进入正式验收 |
| `veto-checklist.md` 静态默认全部 passed | 不进入正式验收 |
| redaction / dependency / report audit failed | 不通过或暂停修复后重验 |
| S 级缺陷存在 | 不通过或暂停修复后重验 |
| P0 profile 无法装配 | 不通过或暂停修复后重验 |
| baseline 固定后发生影响 P0 的变更但未回归 | 暂停,按 Step 3 / `05` §14 重新生成 evidence |
| 发现设计闭口缺失导致验收项无法绑定正式契约 | 暂停,回写设计后重做受影响 Step |

### 8.4 进入 / 退出来源追溯

| 条件组 | 来源 | 说明 |
|---|---|---|
| 文档 / 交付 / 证据基线 | Step 3 | 验收必须可定位、可复验 |
| P0 环境 / 配置 / 数据 | `05` §8;`04` §6~§7 | P0 使用 fake / controlled / disabled profiles |
| P0 suite / report / evidence | `05` §9 / §13 | blocking suite、EV-GOV、artifact/report pairing |
| 缺陷 / 复验 / 风险接受 | `05` §11 | S/A/B/R 和复验要求 |
| residual / P1/P2 | Step 2;`05` §14 | P1/P2 不阻断 P0,但必须记录 |
| VETO / 红线 | `00` §14;Step 2;后续 Step 11 | VF-GOV-001~010 不可风险接受 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“进入条件”“退出条件”“暂停 / 不可裁决条件”和“进入 / 退出来源追溯”小节,了解验收准入和准出如何收敛。

正式 `06-验收标准.md` §4 应回填:

- 进入验收前必须固定 source refs、交付物、core-contracts、P0 profile、config digest、fixture / replay root、`run_id`、artifact root、report root 和 acceptance handoff。
- 缺少 raw artifact、run report、evidence index、veto checklist、redaction / dependency / report audit 或 P0 profile 装配证据时,不得进入正式验收。
- 退出验收必须满足所有 P0 验收项有裁决、AC-GOV / VF-GOV / TC-GOV / EV-GOV 可追溯、VETO 未触发、S=0、A 级缺陷修复或接受、residual 有接受人。
- P1/P2 unavailable 不阻断 P0,但不得计入 P0 passed evidence,必须进入 residual / risk acceptance。
- 任何 S 级、VETO、redaction、dependency、report audit、evidence integrity 或 P0 profile unavailable but passed 都不可风险接受。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式验收是否要求 `reports/review/agent-review.md` 必填 | 影响进入条件严格度 | 当前作为审查补充入口;是否必填可在 Step 10 / Step 14 收口 |
| P1 selected-run 在某 release 是否强制 | 影响退出条件 | 当前不阻断 P0;若强制需 Step 13 / Step 14 收口 |
| `risk-acceptance.md` 是否允许无 residual 时为空文件 | 影响进入条件 | 当前要求有 residual / 条件通过可能时必填 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入条件可判定 | 通过 | 见 §8.1 |
| 退出条件可判定 | 通过 | 见 §8.2 |
| 暂停 / 不可裁决条件明确 | 通过 | 见 §8.3 |
| P1/P2 不污染 P0 | 通过 | P1/P2 只进 residual |
| 可进入 Step 5 | 通过 | 下一步定义功能验收门禁;进入前等待用户审查 |
