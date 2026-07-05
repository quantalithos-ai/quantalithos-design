# Step 14. 定义最终结论与签署口径

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 14
> 回填章节: `06-验收标准.md` §14 最终结论与签署
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_14_final_decision_signoff.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 定义最终结论与签署口径 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~13 中间产物;`standards/document/验收标准书写规范.md` 三值结论规则 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_14_final_decision_signoff.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 15 |

## 2. 本步目标

定义最终验收结论只能如何表达、何时允许进入下一阶段、哪些角色需要签署、签署与风险接受的边界。

本 Step 只回答:

- 最终结论只能是“通过”“有条件通过”“不通过”。
- 三值结论与 P0 验收门禁、`VETO-ART-*`、S/A/B/R 缺陷、risk acceptance、evidence integrity 的关系。
- 哪些签署角色必须确认哪些内容。
- 签署是否代表风险接受,以及签署如何引用 `reports/acceptance/*`。
- 缺 `run_id`、缺 baseline、缺 raw artifact / report pair、静态造证据时如何裁决。

本 Step 不填写真实最终结论,不生成真实签署人,不宣告当前 L1-artifact 已通过或未通过。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | 已完成 | 固定真实结论必须绑定 design / implementation / core-contracts / config / run / artifact / report baseline |
| `06_acceptance_step_04_entry_exit.md` | 已完成 | 提供进入 / 退出 / 不可裁决条件 |
| `06_acceptance_step_05_function_gate.md` | 已完成 | 提供五个核心能力与 `FR-ART-*` 功能门禁 |
| `06_acceptance_step_06_data_arch_redlines.md` | 已完成 | 提供 truth / snapshot / forbidden body / dependency 红线 |
| `06_acceptance_step_07_interfaces_events_sync.md` | 已完成 | 提供 Command / Query / Consumer / Event / Job / relay facade 和跨仓 seam 裁决 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已完成 | 提供状态、UoW、幂等、query no-write、job no-truth-repair 裁决 |
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供非功能、config、redaction、dependency、evidence hard gate |
| `06_acceptance_step_10_observability_evidence.md` | 已完成 | 提供 `EV-CAND-ART-*`、artifact/report pairing、acceptance reports 和 no static evidence |
| `06_acceptance_step_11_veto.md` | 已完成 | 提供 `VETO-ART-001~009` 不可风险接受规则 |
| `06_acceptance_step_12_defects_retest_release.md` | 已完成 | 提供 S/A/B/R、复验和放行规则 |
| `06_acceptance_step_13_risk_acceptance.md` | 已完成 | 提供 residual、不可接受项和 risk acceptance 字段 |
| `standards/document/验收标准书写规范.md` | 已完成 | 提供最终结论三值规则和禁止模糊结论 |
| `projects/L1-governance/design-calibration/06_acceptance_step_14_final_decision_signoff.md` | 已读取 | 仅作为结构和粒度参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 结论只能有哪些取值? | 只允许“通过”“有条件通过”“不通过”。禁止“基本通过”“原则通过”“大体没问题”“待观察通过”等模糊结论。 |
| 何时允许通过? | 全部 P0 验收门禁通过,`VETO-ART-001~009` 未命中,S=0,无未接受且影响 P0 的 A 级缺陷,`EV-CAND-ART-*`、raw artifact、suite report、gate summary、redaction/dependency/report audit 和 acceptance reports 完整。 |
| 何时允许有条件通过? | P0 主链成立、VETO 未命中、S=0、证据完整,且仅存在已逐项接受的 A/B/R residual;每项 residual 必须有 owner、acceptor、deadline_or_trigger、follow_up_ref 和 p0_contamination_check。 |
| 何时必须不通过? | 任一 P0 门禁失败、任一 VETO 命中、S 未关闭、证据不可裁决、redaction/dependency/report audit failed、P0 profile unavailable but marked passed、query/job/relay truth repair、static evidence pass 或缺 raw artifact/report pair。 |
| 何时应暂停而不是填结论? | 缺 design / implementation / config / run baseline、缺 `run_id`、缺 evidence index、发现设计闭口缺失或验收项无法绑定正式契约时,应暂停并回流修复;不得填写通过或有条件通过。 |
| 哪些角色必须签署? | 至少业务 / Owner、架构负责人、测试负责人、实施负责人、运维 / 安全 / 合规负责人、验收负责人按职责签署。 |
| 签署是否自动代表风险接受? | 不代表。风险必须在 `reports/acceptance/risk-acceptance.md` 逐项由接受人确认;最终签署只确认最终结论与已接受风险清单一致。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 最终结论为待评审占位,缺三值规则和签署责任 | 重建最终结论表、判定矩阵、签署表和签署含义 |
| Step 10 | evidence / report 已定义,但最终结论尚未明确缺证据时的裁决 | 本 Step 固定 evidence 不可裁决时不得通过 |
| Step 11 / Step 12 | VETO/S 不可接受已定义,但最终结论尚未统一落点 | 本 Step 明确 VETO/S 命中时只能不通过或暂停修复后复验 |
| Step 13 | residual 风险接受结构已定义,但未连接最终结论 | 本 Step 明确有条件通过必须引用完整 risk acceptance |
| 正式 `06` | 尚未装配新版正文 | 本 Step 只提供回填草稿;Step 15 再装配正式文档 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 结论 | 待评审或模糊结论 | 通过 / 有条件通过 / 不通过 | 可裁决、可签署 |
| 有条件通过 | 未定义 | P0 成立、VETO/S=0、证据完整、risk accepted | 防止 residual 覆盖硬门禁 |
| 不通过 | 分散在各门禁失败 | 汇总为 P0 failed、VETO/S、evidence failed、redaction/dependency/config hard gate failed | 便于最终裁决 |
| 签署 | 角色占位 | 每个角色签署含义明确 | 支撑责任闭环 |
| 当前结果 | 易误填真实结论 | 保留 `<final_decision>` / `<signoff>` 占位 | 不伪造实际验收 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否允许“基本通过” | A. 允许;B. 禁止 | 采用 B。规范只允许三值结论。 |
| 有条件通过是否允许 VETO/S | A. 允许;B. 禁止 | 采用 B。VETO/S 不得风险接受。 |
| 缺证据时是否可人工通过 | A. 可以;B. 不可以 | 采用 B。raw artifact / report / evidence index 缺失时不可裁决。 |
| 签署是否自动接受所有 residual | A. 是;B. 否 | 采用 B。risk acceptance 必须逐项记录。 |
| P1/P2 unavailable 是否影响通过 | A. 必然影响;B. 视是否为本轮进入条件 | 采用 B。未升级为 P0 时只能 residual,不得计入 P0 passed。 |

## 8. 结构化中间产物

### 8.1 最终结论表

| 结论 | 允许条件 | 禁止条件 | 后续动作 |
|---|---|---|---|
| 通过 | 全部 P0 门禁通过;`VETO-ART-*` 未命中;S=0;无未接受 A 级;证据完整;redaction/dependency/report audit clean | 任一 P0 门禁失败、VETO/S、证据不可裁决、P0 profile 伪 pass | 可进入下一阶段或发布准备 |
| 有条件通过 | P0 主线成立;`VETO-ART-*` 未命中;S=0;证据完整;仅存在已接受 A/B/R residual;每项 residual 有 owner/acceptor/deadline/follow-up | VETO/S、redaction leak、dependency failed、report integrity failed、query/job/relay truth repair、risk acceptance 缺字段 | 可进入下一阶段,但必须跟踪条件和截止 |
| 不通过 | 任一 P0 门禁失败、VETO 命中、S 未关闭、证据不可裁决、hard gate failed、未接受 A 级影响 P0 | 无 | 修复后按 Step 12 复验并重新裁决 |
| 暂停验收 | 缺 baseline、缺 `run_id`、缺 raw artifact/report pair、设计闭口缺失、scope 未定 | 不得写成通过 / 有条件通过 | 回流补基线 / 设计 / 证据后重启受影响 Step |

### 8.2 结论判定矩阵

| 条件 | 通过 | 有条件通过 | 不通过 / 暂停 |
|---|---|---|---|
| P0 AC-ART 门禁 | 全部通过 | 全部通过 | 任一失败则不通过 |
| `VETO-ART-001~009` | 全部未命中 | 全部未命中 | 任一命中则不通过 |
| S 级缺陷 | 0 | 0 | >0 则不通过 |
| A 级缺陷 | 0 | 已接受且不影响 P0 truth / evidence | 未接受或影响 P0 truth 则不通过 |
| B/R residual | 0 或不影响 | 已记录并接受 | 未记录且影响结论则不得通过 |
| evidence integrity | 完整且 audit clean | 完整且 audit clean | 缺失、伪造、orphan EV、static pass 则不通过 |
| redaction / dependency | clean | clean | failed 则不通过 |
| config / profile | P0 profile 可用且无 silent fallback | P0 profile 可用且无 silent fallback | unavailable but passed / forbidden override 则不通过 |
| P1/P2 unavailable | 不适用或无影响 | 已记录 residual | 被错误写成 P0 pass/fail 则不通过 |
| `reports/acceptance/*` | handoff / veto / risk / open issues 完整 | risk acceptance 完整 | 缺 handoff / veto checklist / required risk acceptance 则暂停或不通过 |

### 8.3 签署表

| 角色 | 姓名 / 责任 | 必须确认 | 结论 | 日期 |
|---|---|---|---|---|
| Owner / 业务负责人 | `<name>` | 验收目标、P0/P1/P2 范围、业务 residual 和进入下一阶段影响 | `<signoff>` | `<date>` |
| 架构负责人 | `<name>` | truth ownership、依赖裁剪、数据边界、跨仓 seam、VETO 和不可接受风险 | `<signoff>` | `<date>` |
| 测试负责人 | `<name>` | P0 suite、`EV-CAND-ART-*`、raw artifact/report pair、缺陷、复验和 report audit | `<signoff>` | `<date>` |
| 实施负责人 | `<name>` | 送验 commit / build / config、实现范围、known technical risk 和修复承诺 | `<signoff>` | `<date>` |
| 运维 / 安全 / 合规负责人 | `<name>` | redaction、dependency、profile、handoff、evidence retention 和 compliance residual | `<signoff>` | `<date>` |
| 验收负责人 | `<name>` | 最终结论、VETO checklist、risk acceptance、open issues 和签署材料一致 | `<signoff>` | `<date>` |

### 8.4 签署含义表

| 签署对象 | 表示 | 不表示 |
|---|---|---|
| 通过签署 | 本轮 P0 门禁、证据和 VETO/S 检查满足进入下一阶段条件 | 不代表 P1/P2/future 能力已完成 |
| 有条件通过签署 | P0 主线成立,已接受 residual 有 owner/acceptor/deadline/follow-up | 不代表 VETO/S、redaction、dependency、evidence failure 可被接受 |
| 不通过签署 | 阻断项存在或证据不可裁决,需要修复后复验 | 不代表项目终止,只代表本轮不能通过 |
| 风险接受签署 | 接受指定 residual 的影响和后续动作 | 不接受未列出风险、VETO/S 或 P0 hard gate failure |
| 验收负责人签署 | 最终结论与证据、缺陷、风险接受和 open issues 一致 | 不替代各专业负责人对本领域材料的签署 |

### 8.5 最终验收包要求

| 材料 | 必须存在 | 用途 |
|---|---|---|
| `reports/acceptance/handoff.md` | 是 | 固定送验范围、source refs、run_id、P0/P1/P2 边界 |
| `reports/acceptance/veto-checklist.md` | 是 | 证明 `VETO-ART-*` 逐项有 evidence / defect / report status |
| `reports/acceptance/risk-acceptance.md` | 条件必需 | 有条件通过、B/R residual 或 A 级接受时必需 |
| `reports/acceptance/open-issues.md` | 是 | 列明 failed / pending / unavailable / residual |
| `reports/runs/<run_id>/evidence-index.md` | 是 | 证明 `EV-CAND-ART-*` 可回指 artifact/report |
| `reports/runs/<run_id>/gate-summary.md` | 是 | 汇总 blocking / non-blocking suite 结果 |
| `reports/runs/<run_id>/redaction-check.md` | 是 | 证明 redaction clean 或阻断 |
| `reports/runs/<run_id>/dependency-boundary.md` | 是 | 证明 compile-time upstream 边界 |
| `reports/runs/<run_id>/report-audit.md` | 是 | 证明 no static evidence、no orphan EV、artifact/report pairing |

### 8.6 最终结论停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否只使用三值结论 | 通过 | 禁止模糊结论 |
| 是否禁止 VETO/S 有条件通过 | 通过 | VETO/S 只能不通过或修复后复验 |
| 证据缺失是否禁止通过 | 通过 | evidence integrity 是 hard gate |
| 风险接受是否有接受人 | 通过 | Step 13 已要求 |
| 签署角色是否覆盖业务 / 架构 / 测试 / 实施 / 运维安全 / 验收 | 通过 | 见 §8.3 |
| 是否避免填写真实结论 | 通过 | 正式文档保留占位,真实执行时填充 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_14_final_decision_signoff.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“最终结论表”“结论判定矩阵”“签署表”“签署含义表”“最终验收包要求”和“最终结论停审记录”小节,了解最终结论和签署口径如何从门禁、VETO、缺陷、证据和风险接受收敛。

正式 `06-验收标准.md` §14 应回填:

- 最终结论只允许“通过”“有条件通过”“不通过”。
- 通过要求全部 P0 门禁通过、`VETO-ART-001~009` 未命中、S=0、证据完整、redaction/dependency/report audit clean、无未接受且影响 P0 的 A 级缺陷。
- 有条件通过只允许 P0 主线成立且 residual 已被逐项接受;VETO/S、redaction leak、dependency failed、evidence integrity failure、P0 config silent fallback、query / job / relay truth repair 不得有条件通过。
- 不通过适用于任一 P0 门禁失败、VETO 命中、S 未关闭、证据不可裁决或 hard gate failed。
- 缺 baseline、缺 `run_id`、缺 raw artifact/report pair 或发现设计闭口缺失时,应暂停验收并修复,不得填“通过”或“有条件通过”。
- 签署不自动接受风险;风险必须在 `reports/acceptance/risk-acceptance.md` 逐项记录,最终签署只确认结论与证据 / 风险清单一致。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实签署人姓名 | 影响正式验收 | 正式执行时填写;当前只固定角色 |
| 是否需要外部合规签署 | 影响监管 / 外部审计 | 当前保留运维 / 安全 / 合规负责人角色 |
| 某次 release 是否允许有条件通过 | 影响裁决 | 必须按 Step 13 risk acceptance 和本 Step 判定矩阵决定 |
| formal `EV-ART-*` / `AC-ART-*` alias 是否引入 | 影响最终正文 | Step 15 装配时决定,但不得破坏 `EV-CAND-ART-*` 可逆追溯 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 结论和签署口径完整 | 通过 | 见 §8.1~§8.5 |
| 禁止模糊结论 | 通过 | 三值规则固定 |
| 风险接受与签署边界明确 | 通过 | 见 §8.4 |
| 最终验收包要求明确 | 通过 | 见 §8.5 |
| 可进入 Step 15 | 通过 | 下一步整理正式验收标准文档;进入前等待用户审查 |
