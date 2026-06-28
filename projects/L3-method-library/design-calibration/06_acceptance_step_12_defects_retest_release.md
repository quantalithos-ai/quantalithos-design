# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填章节: `06-验收标准.md` §12 缺陷分级、复验与放行规则
> 创建日期: 2026-06-28
> 当前模式: full-restart / step12-defects-retest-release
> 当前状态: completed_wait_user_confirm_to_R13.1
> 当前模块: `R12.2 defects retest release:再写入`
> 当前门禁: `R12.2` completed_wait_user_confirm_to_R13.1;等待确认进入 Step 13 `R13.1 risk acceptance:先思考`

---

## R12.1 defects retest release:先思考

### 1. 当前模块目标

`R12.1` 只思考新版 `06-验收标准.md` 中缺陷分级、复验和放行规则如何从正式 `05-测试方案.md` §11、Step 4 进入 / 退出条件、Step 10 证据门禁和 Step 11 一票否决项收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终缺陷分级表,不填写真实缺陷状态,不裁决通过 / 有条件通过 / 不通过,不签署风险接受,不生成真实 `reports/acceptance/risk-acceptance.md`,不进入 Step 13。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R12.2 |
| 用户确认 | 已确认从 Step 11 completed 推进到 Step 12 `R12.1 defects retest release:先思考`。 |
| 当前允许 | 思考 S/A/B/R 分级、VETO 与缺陷关系、每级对验收结论的影响、复验范围、关闭证据、放行边界、风险接受候选和 R12.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写真实 defect status / run_id / verdict;定义缺陷系统字段、artifact/report JSON schema、CI required check、implementation boundary 或 `07-实施计划.md`。 |

### 2. 本模块输入承接

| 输入 | R12.1 关注点 | 禁止外推 |
|---|---|---|
| SOP Step 12 | S/A/B 缺陷定义、对结论影响、修复后复验、风险接受、阻断下一阶段。 | 把 Step 13 风险接受或 Step 14 签署提前写成最终结论。 |
| 书写规范 §5.12 | 必须输出缺陷级别、定义、对结论的影响和复验要求。 | 只写“修复后回归”但没有 suite / report / artifact 方向。 |
| `05_test_plan_step_11_defects_retest.md` | 测试层 S/A/B/R、S 级阻断、复验矩阵、关闭证据和防回归触发。 | 复制测试层进入/退出准则为验收结论。 |
| Step 4 entry / exit | 正式验收进入、退出、暂停 / 不可裁决条件。 | 用 A/B/R 风险覆盖 S 级、VETO 或证据缺失。 |
| Step 10 evidence | run-scoped evidence、artifact/report pairing、no latest、no static evidence、redaction/dependency/report audit。 | 在 Step 12 自行发明机器字段和值域。 |
| Step 11 VETO | `VETO-ML-001~014` 全部不可风险接受。 | 将 VETO 降级为 A/B/R 或条件通过项。 |
| `05-测试方案.md` §11 / §12 / §14 | 缺陷管理、复验、进入 / 退出、回归、残余风险和不可接受项。 | 把 P1/P2 residual 计入 P0 passed。 |
| L1-governance Step 12 | framework_reference:参考缺陷分级、S 级阻断、复验矩阵、放行规则和 stop-review 深度。 | 复制 governance 的 ID、证据编号、领域对象或结论。 |

### 3. SOP Step 12 问题思考

| SOP 问题 | R12.1 初判 | R12.2 写入提醒 |
|---|---|---|
| S/A/B 缺陷如何定义? | L3 采用 S/A/B/R: S 为 VETO 或 P0 truth / boundary / security / evidence integrity 破坏;A 为未命中 VETO 但影响 P0 主线证明的阻断风险;B 为 P1/P2 或非阻断质量问题;R 为 future / 范围外 / 设计未闭口 residual。 | R12.2 固定缺陷分级表,并说明 R 是验收残余项,不等同于已验证。 |
| 每级缺陷对验收结论有什么影响? | S 未关闭时只能不通过或暂停;A 未关闭且未被正式接受时不得通过;B/R 可进入条件通过或风险接受,但不得污染 P0 pass。 | 写清“通过 / 有条件通过 / 不通过”的约束,但不填写真实结论。 |
| 修复后如何复验? | 至少复跑原 TC、同 family、owning suite、受影响的 redaction/dependency/report audit;release-main-smoke 只能作为代表性闭环,不能替代底层 suite。 | 写复验规则矩阵和关闭证据方向。 |
| 哪些缺陷可以风险接受? | B/R 可风险接受;A 只有在不触发 VETO、不破坏 P0 truth、证据完整且有正式接受入口时才可候选接受;S/VETO 不可接受。 | Step 13 再写正式 risk acceptance 表和接受人字段。 |
| 哪些缺陷必须阻断下一阶段? | 任一 S、任一 VETO、redaction/dependency/report audit failed、P0 evidence integrity 失败、P0 profile silent fallback、source-missing 被私补、query/job/observability 反写真相必须阻断。 | R12.2 写阻断表,并回指 Step 4/10/11。 |

### 4. L1-governance Step 12 框架参考思考

L1-governance Step 12 可借鉴的是“缺陷级别 -> 验收结论 -> 复验范围 -> 放行条件”的完整裁决链。L3 使用该框架,但全部主语、ID、suite 和证据方向必须采用 method-library 当前 `TC-ML-*` / `EV-ML-*` / `VETO-ML-*` 语义。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 分级表 | 使用 S/A/B/R,把测试层缺陷分级转成验收裁决分级。 | 使用外部项目缺陷 ID 或治理领域对象。 |
| S 级阻断表 | S 覆盖 VETO、P0 truth、redaction、dependency、evidence integrity、config fail-fast 和 no truth repair。 | 把 P1 selected-run unavailable 或无来源 P95 写成 S。 |
| 复验矩阵 | 按触发面绑定原 TC、same family、suite、audit report 和 release smoke 代表性闭环。 | 单跑 release smoke 替代底层 suite。 |
| 放行规则 | S/VETO 不放行,A 严格条件候选,B/R 可进入风险接受。 | 用“负责人同意”覆盖证据缺失。 |
| stop-review | 审计缺陷分级是否可判定、是否与 VETO 一致、是否存在风险接受越权。 | 默认当前缺陷为 0 或默认可通过。 |

### 5. L3 缺陷分级候选

| 候选级别 | 初步定义 | 对验收结论的初步影响 | 复验方向 |
|---|---|---|---|
| S | VETO 命中、P0 truth / boundary / security / evidence integrity 破坏、P0 config silent fallback、source-missing stop 被私补、query/job/observability 反写真相。 | 未关闭时不得通过或有条件通过;只能不通过或暂停修复后重验。 | 原 TC + same family + owning blocking suite + 相关 redaction/dependency/report audit;必要时 P0 regression。 |
| A | P0 主线或 blocking suite 风险,未命中 S/VETO,但影响核心闭环可信证明。 | 未关闭且未正式接受时不得通过;可导致有条件通过或暂停。 | 原 TC + 相关 suite + artifact/report pair + 受影响 audit。 |
| B | P1/P2、selected-run、报告可读性、非阻断维护性或体验问题。 | 不阻断 P0;可进入有条件通过风险清单。 | 视影响复跑 selected suite、补 report review 或记录 open issue。 |
| R | 范围外、future、设计未闭口、capacity/SLA/dashboard/retention 等 residual。 | 不阻断当前 P0,但不得伪装成已验证。 | 后续升级为 P0/P1 时重新基线、回 owning Step 并重测。 |

### 6. S 级阻断候选

| 阻断候选 | 来源 | R12.1 判断 |
|---|---|---|
| `VETO-ML-001~014` 任一命中 | Step 11 | 直接 S,不可风险接受。 |
| raw body、secret、provider response 或 full sensitive ref 泄露 | Step 9/10/11;`05` §11 | S,必须修复并复验 redaction。 |
| non-core sibling compile dependency 或反向依赖进入本仓 | Step 6/9/11 | S,必须修复并复验 dependency boundary。 |
| artifact/report pairing 缺失、`latest`、static evidence 或 orphan EV | Step 10/11 | S,验收裁决不可成立。 |
| invalid P0 config silent fallback、partial facade 或 unavailable marked passed | Step 4/9/11 | S,必须复验 config-redline。 |
| duplicate rerun、query write、job truth repair、observability truth 替代 | Step 8/9/10/11 | S,破坏一致性和 truth boundary。 |
| source-missing stop 被实现、测试、fixture 或报告私补 | `05` §11;Step 11 | S 或 design blocker,不得由验收标准补口。 |
| P0 blocking suite 无可信失败 / 通过 artifact | Step 4/10 | S,不是“测试未跑完”的普通缺陷。 |

### 7. 复验范围候选

| 缺陷触发面 | 修复后应复验 | 说明 |
|---|---|---|
| contract / domain / object invariant | 原 TC、same family、`contract-domain-fast`、相关 safe output redaction。 | 输出 surface 变化时必须查 redaction。 |
| command / application / UoW | 原 TC、command family、`service-flow-fast`、rollback / duplicate / commit unknown。 | 不能只跑单个 happy path。 |
| query / visibility / no-write | 原 TC、query family、write-audit、redaction。 | query 修复不得反写真相。 |
| inbound / outbound / handoff | 原 TC、entry/worker/job family、safe response、failed/delayed marker。 | transport raw body 不得入 report。 |
| replay / recovery / operations job | 原 TC、replay/job family、checkpoint/report audit、no truth repair。 | 失败报告也必须 run-scoped。 |
| config / dependency / redaction | 原 TC、`config-redline`、`dependency-boundary`、`redaction-boundary`。 | 相关 audit 失败不允许跳过。 |
| evidence/report integrity | report-generation audit、evidence index、artifact/report pairing、no latest/no static evidence。 | 缺证据先修报告链,不是人工补表。 |
| release smoke | `release-main-smoke` + 受影响底层 suite。 | release smoke 只做代表性闭环,不能替代底层 suite。 |

### 8. 关闭证据与放行候选

| 项 | R12.1 判断 | R12.2 写入提醒 |
|---|---|---|
| 缺陷记录 | 必须能回指 defect ref、影响范围、级别、关联 AC/TC/EV/report。 | 不固定缺陷系统字段名。 |
| 失败前后证据 | S/A 必须保留失败 run 与修复后 run 方向;B/R 视是否有执行记录。 | 不定义 JSON schema。 |
| suite/report pair | 修复关闭必须有 suite report 和 case artifact / safe failure artifact 方向。 | 继续使用 `reports/runs/<run_id>` / `artifacts/test/<run_id>`。 |
| redaction/dependency/report audit | 相关缺陷必须附 audit 复验结果。 | audit report 不能被 acceptance summary 替代。 |
| 自动化防回归 | 手工发现 P0、release smoke 发现底层 suite 漏检、audit 漏检时必须新增或扩展候选。 | 具体 TC/suite/script 回 owning Step,不在 Step 12 新增。 |
| 放行 | S/VETO 不放行;A 严格条件候选;B/R 进入 risk acceptance 或 open issues。 | Step 13 再固定风险接受表。 |

### 9. 非阻断 / 后移边界思考

| 边界项 | R12.1 判断 | 后续承接 |
|---|---|---|
| P1 selected-run unavailable | B/R 候选,不得计入 P0 passed。 | Step 13 residual / risk acceptance。 |
| production-like capacity、真实外部 SLA、dashboard / alert | R 候选,当前非 P0 阻断。 | Step 13 residual。 |
| 无来源 P95/SLO 或旧性能目标 | 不作为 S/A 硬阈值。 | Step 9 trend risk / Step 13 residual。 |
| retention days、archive policy 未固定 | 不阻断当前 P0,但需 residual。 | Step 13 或后续运维标准。 |
| 缺陷系统字段、审批角色、排期 workflow | 不在 Step 12 固定字段级实现。 | Step 13 / Step 14 / 项目流程。 |
| artifact/report JSON 字段和值域 | 不在 Step 12 发明。 | 如需正式 schema,回 `05` / schema owner。 |

### 10. R12.2 写入策略思考

`R12.2 defects retest release:再写入` 可以写入:

1. Step 12 模块状态、输入表和 SOP 问题回答。
2. 缺陷分级表,使用 S/A/B/R,并固定每级对验收结论的影响。
3. S 级阻断判定表,回指 Step 11 `VETO-ML-*`、Step 10 evidence、Step 4 entry/exit。
4. 修复后复验矩阵,覆盖原 TC、same family、owning suite、audit 和 release smoke 边界。
5. 放行规则,明确 S/VETO 不可放行,A 严格条件,B/R 风险接受。
6. 关闭证据清单、自动化防回归触发和非阻断 / 后移边界表。
7. 回填草稿、待确认事项、进入 Step 13 条件和 R12.2 stop-review。

`R12.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. 真实缺陷状态、真实 run_id、真实 pass/fail、最终 verdict 或 sign-off。
3. `reports/acceptance/risk-acceptance.md` 的真实接受人、真实风险状态或审批结果。
4. artifact/report JSON schema、defect system field schema、CI YAML、script implementation、required checks 或 implementation boundary。
5. 把 S/VETO 风险接受、把 release smoke 当底层 suite 替代、把 P1/P2 residual 计入 P0 passed。

### 11. R12.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 12 R12.1 | pass |
| 是否读取 SOP Step 12、书写规范 §5.12、`05` Step 11、Step 4、Step 10、Step 11 和 L1-governance Step 12 框架 | pass |
| 是否形成 L3-local S/A/B/R 缺陷分级候选 | pass |
| 是否明确 VETO = S 且不可风险接受 | pass |
| 是否形成复验范围、关闭证据、放行和后移边界思考 | pass |
| 是否未写真实 defect status、真实 verdict、风险接受签署、CI 或 implementation 内容 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.2 defects retest release:再写入`;只允许写入缺陷分级表、S 级阻断判定表、修复后复验矩阵、放行规则、关闭证据清单、自动化防回归触发、非阻断 / 后移边界、回填草稿、待确认事项和进入 Step 13 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R12.2 defects retest release:再写入

### 12. R12.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R13.1 |
| 用户确认 | 已确认从 Step 12 `R12.1 defects retest release:先思考` 推进到 `R12.2 defects retest release:再写入`。 |
| 当前写入 | SOP 问题回答、缺陷分级表、S 级阻断判定表、修复后复验矩阵、放行规则、关闭证据清单、自动化防回归触发、非阻断 / 后移边界、回填草稿、待确认事项和进入 Step 13 条件。 |
| 当前禁止 | 修改正式 `06`;写真实 defect status、真实 run_id、真实 pass/fail、最终 verdict、risk acceptance 签署、CI、script、implementation boundary 或 `07-实施计划.md`。 |

### 13. R12.2 输入承接表

| 输入 | 当前承接 | 裁决 |
|---|---|---|
| SOP Step 12 | 输出缺陷分级表、复验规则和放行规则。 | 已承接。 |
| 书写规范 §5.12 | S/A/B 对结论影响必须可判定;L3 增加 R 作为 residual 级别。 | 已承接。 |
| `05-测试方案.md` §11 | S/A/B/R、复验矩阵、关闭证据和防回归触发。 | 已转为验收裁决规则。 |
| Step 4 entry / exit | S=0、VETO 未触发、证据完整、A 级修复或接受是退出前置。 | 已承接。 |
| Step 10 evidence | run-scoped evidence、artifact/report pair、no latest、no static evidence 和 hard audit。 | 已承接为 S/A 判定和关闭证据。 |
| Step 11 VETO | `VETO-ML-001~014` 不可风险接受。 | 全部映射为 S 级阻断。 |
| L1-governance Step 12 | 只参考结构密度和裁决链。 | 未复制外部项目 ID 或领域事实。 |

### 14. SOP 问题回答

| SOP 问题 | R12.2 回答 |
|---|---|
| S/A/B 缺陷如何定义? | L3 使用 S/A/B/R。S 为 VETO 命中、P0 truth / boundary / security / evidence integrity 破坏、P0 config silent fallback、source-missing stop 被私补、query/job/observability 反写真相。A 为未命中 S/VETO 但影响 P0 主线可信证明的阻断风险。B 为 P1/P2、selected-run、报告可读性、非阻断维护性或体验问题。R 为范围外、future、设计未闭口、capacity/SLA/dashboard/retention 等 residual。 |
| 每级缺陷对验收结论有什么影响? | S 未关闭时不得通过或有条件通过;A 未关闭且未正式接受时不得通过;B/R 不阻断 P0,但必须进入 risk acceptance 或 open issues,且不得计入 P0 passed。 |
| 修复后如何复验? | 至少复验原 TC、同 family、owning suite、受影响 audit 和报告链。release-main-smoke 只能补充代表性闭环,不能替代底层 suite。 |
| 哪些缺陷可以风险接受? | B/R 可风险接受;A 仅在不触发 VETO、不破坏 P0 truth、证据完整、关闭期限和接受入口明确时可作为候选;S/VETO 不可风险接受。 |
| 哪些缺陷必须阻断下一阶段? | 任一 S、任一 VETO、redaction/dependency/report audit failed、P0 evidence integrity 失败、P0 profile silent fallback、source-missing 被私补、query/job/observability 反写真相、P0 blocking suite 无可信 artifact/report 均必须阻断。 |

### 15. 缺陷分级表

| 级别 | 定义 | 对验收结论的影响 | 复验要求 | 风险接受 |
|---|---|---|---|---|
| S | 一票否决项、P0 truth / boundary / security / evidence integrity 破坏,或 P0 阻断证据失真。 | 未关闭时只能不通过或暂停修复后重验;不得通过或有条件通过。 | 修复后跑原 TC、same family、owning blocking suite、相关 redaction/dependency/report audit;必要时 P0 regression。 | 不允许。 |
| A | P0 主线或 blocking suite 风险,未命中 S/VETO,但影响核心闭环可信证明。 | 未关闭且未正式接受时不得通过;可导致有条件通过或暂停。 | 修复后跑原 TC、相关 suite、artifact/report pair 和受影响 audit。 | 严格条件候选,不得覆盖 S/VETO。 |
| B | P1/P2、selected-run、报告可读性、非阻断维护性或体验问题。 | 不阻断 P0;可进入有条件通过风险清单或 open issues。 | 视影响复跑 selected suite、补 report review 或抽样复验。 | 允许,但不得计入 P0 passed。 |
| R | 范围外、future、设计未闭口、capacity/SLA/dashboard/retention 等 residual。 | 不阻断当前 P0,但不得伪装成已验证。 | 后续升级为 P0/P1 时重新基线、回 owning Step 并重测。 | 允许,必须记录 owner、触发条件和后续动作。 |

### 16. S 级阻断判定表

| 触发条件 | 级别 | 必须动作 | 复验方向 |
|---|---|---|---|
| `VETO-ML-001~014` 任一命中 | S | 修复并重新执行相关验收门禁;不得风险接受。 | 对应 VETO 的 `EV-ML-*`、suite report、veto checklist。 |
| raw body、secret、provider response 或 full sensitive ref 泄露 | S | 修复泄露面和 report 二次泄露面。 | `redaction-boundary`;`reports/runs/<run_id>/redaction-check.md`。 |
| non-core sibling compile dependency 或反向依赖进入本仓 | S | 移除越界依赖,恢复 Definition vs Use 边界。 | `dependency-boundary`;`reports/runs/<run_id>/dependency-boundary.md`。 |
| artifact/report pairing 缺失、`latest`、static evidence 或 orphan EV | S | 修复 evidence/report generation,重新生成 run-scoped evidence。 | `report-generation-audit`;evidence index;report audit。 |
| invalid P0 config silent fallback、partial facade 或 unavailable marked passed | S | 修复 config validation / runtime builder 语义。 | `config-redline`;config report。 |
| duplicate rerun、query write、job truth repair、observability truth 替代 | S | 修复 flow / state / recovery 语义,禁止反写真相。 | `service-flow-fast`;`operations-replay-core`;observability audit。 |
| source-missing stop 被实现、测试、fixture 或报告私补 | S 或 design blocker | 暂停并回 owning design source 闭口;不得由验收标准补字段。 | 闭口后重跑受影响 TC / suite / report audit。 |
| P0 blocking suite 无可信失败 / 通过 artifact | S | 补齐 raw artifact 与 generated report,保留 failed / timeout / unavailable safe evidence。 | owning blocking suite + report-generation-audit。 |

### 17. 修复后复验矩阵

| 缺陷触发面 | 必跑用例 / suite | 必跑 audit / check | 关闭证据方向 |
|---|---|---|---|
| contract / domain / object invariant | 原 TC + same family + `contract-domain-fast` | safe output 变化时跑 redaction。 | suite report + case artifact。 |
| command / application / UoW | 原 TC + command family + `service-flow-fast` | rollback、duplicate replay、commit unknown、report pairing。 | service suite report + UoW assertion artifact。 |
| query / visibility / no-write | 原 TC + query family + `service-flow-fast` | write-audit、redaction、no repair。 | query report + write audit direction。 |
| inbound / outbound / handoff | 原 TC + entry/worker/job family + `entry-worker-job` | safe response、failed/delayed marker、redaction。 | entry/worker/job report。 |
| replay / recovery / operations job | 原 TC + replay/job family + `operations-replay-core` | checkpoint/report source、partial failure、no truth repair。 | replay artifact + job report。 |
| config / profile | 原 TC + `config-redline` | fail-fast、profile isolation、no silent fallback。 | config validation report。 |
| dependency boundary | 原 TC + `dependency-boundary` | compile dependency graph、runtime/event boundary。 | dependency-boundary report。 |
| redaction / observability / audit | 原 TC + `redaction-boundary` / `observability-boundary` | no raw body/secret、low-cardinality signal、refs-only audit。 | redaction / observability report。 |
| evidence/report integrity | failing report audit + `report-generation-audit` | no latest、no static evidence、artifact/report pairing、orphan EV。 | report-audit + evidence-index。 |
| release smoke closure | original scenario + `release-main-smoke` + affected lower suite | release checks、redaction/dependency/report audit。 | release suite + lower suite report + gate summary。 |

### 18. 放行规则

| 条件 | 是否可放行 | 裁决口径 |
|---|---|---|
| 存在未关闭 S 级缺陷 | 否 | 只能不通过或暂停修复后重验。 |
| 存在任一 VETO 命中 | 否 | 不允许有条件通过或风险接受。 |
| redaction/dependency/report audit failed | 否 | 属 hard gate failure,不得风险接受。 |
| P0 evidence index / artifact/report pair 不完整 | 否 | 验收不可裁决,不得用 handoff 或人工说明替代。 |
| 存在未关闭 A 级缺陷 | 通常否 | 仅当不触发 S/VETO、P0 truth 成立、证据完整且 Step 13 风险接受闭口时,才可作为有条件通过候选。 |
| 仅存在 B 级缺陷 | 可有条件通过 | 必须进入 risk acceptance 或 open issues,不得计入 P0 passed evidence。 |
| 仅存在 R 级 residual | 可有条件通过或通过 | 必须记录 owner、触发条件、后续动作和升级规则。 |
| P1 selected-run unavailable | 可记录 residual | 不得标记为 P0 已验证。 |
| 无来源 P95/SLO/capacity 未覆盖 | 可记录 residual | 当前不作为硬性能 fail。 |

### 19. 关闭证据清单

| 证据类型 | S 级 | A 级 | B/R 级 |
|---|---|---|---|
| defect ref 与影响范围 | 必需 | 必需 | 必需 |
| 关联 AC / VETO / TC / EV / suite | 必需 | 必需 | 相关即必需 |
| 失败前 run / artifact / report 方向 | 必需 | 必需 | 视执行情况 |
| 修复后 run / artifact / report 方向 | 必需 | 必需 | 视执行情况 |
| 修复说明和变更范围 | 必需 | 必需 | 可选 |
| 复验 TC / suite status | 必需 | 必需 | 视影响 |
| redaction / dependency / report audit | 相关即必需;安全/证据类必需 | 相关即必需 | 可选 |
| 自动化防回归说明 | 必需 | 必需 | 可选 |
| 风险接受人 / 接受理由 | 不允许 | 若接受则必需 | 必需 |

### 20. 自动化防回归触发

| 触发 | 要求 | 后续 owner |
|---|---|---|
| 手工发现 P0 缺陷 | 必须新增或扩展自动化候选。 | owning test step / implementation plan。 |
| release smoke 发现但底层 suite 未发现 | 必须把断言下沉到对应底层 suite family。 | test plan / suite owner。 |
| redaction leak 未被 redaction check 捕获 | 必须扩展 redaction check 候选。 | redaction-boundary owner。 |
| dependency 越界未被 dependency check 捕获 | 必须扩展 dependency boundary check 候选。 | dependency-boundary owner。 |
| artifact/report static pass 或 pairing 漏检 | 必须扩展 report-generation-audit 候选。 | report audit owner。 |
| duplicate / idempotency / UoW / job no truth repair 缺陷复发 | 必须补 recovery / replay / fault injection 用例候选。 | service / operations suite owner。 |
| source-missing stop 被绕过 | 必须回 owning design source 补 source guard / design gate。 | design owner。 |
| P1/P2 residual 升级为 P0 | 必须先回写范围、用例、数据、环境、suite 和 gate,再新增自动化。 | upstream design / test plan。 |

### 21. 非阻断 / 后移边界表

| 项 | 当前分类 | 后续承接 |
|---|---|---|
| P1 selected-run unavailable | B/R | Step 13 risk acceptance;不得计入 P0 passed。 |
| production-like capacity、真实外部 SLA、dashboard / alert | R | Step 13 residual。 |
| 无来源 P95/SLO 或旧性能目标 | R | Step 9 trend risk / Step 13 residual。 |
| retention days、archive policy 未固定 | R | Step 13 或后续运维标准。 |
| 缺陷系统字段、审批角色、排期 workflow | 后移 | Step 13 / Step 14 / 项目流程,本 Step 不固定字段。 |
| artifact/report JSON 字段和值域 | 后移 | 若需要正式 schema,回 `05` / schema owner 闭口。 |
| 真实 risk acceptance 签署 | 后移 | Step 13 / Step 14,本 Step 不填写真实接受状态。 |

### 22. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_12_defects_retest_release.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“缺陷分级表”“S 级阻断判定表”“修复后复验矩阵”“放行规则”“关闭证据清单”和“非阻断 / 后移边界表”小节,了解缺陷如何影响验收结论、复验和放行。

正式 `06-验收标准.md` §12 应回填:

- 缺陷分级固定为 S/A/B/R。
- S 级和 `VETO-ML-*` 不允许风险接受;未关闭时最终结论不得为通过或有条件通过。
- A 级原则上阻断通过;只有在不触发 VETO、不破坏 P0 truth、证据完整且 Step 13 风险接受闭口时,才可作为有条件通过候选。
- B/R 可进入风险接受或 open issues,但不得伪装成 P0 已验证。
- 修复后必须复跑原 TC、same family、owning suite、相关 audit 和 report-generation audit;`release-main-smoke` 不得替代底层 suite。
- 缺陷关闭证据必须能回指 defect ref、AC/TC/EV、失败 run、修复后 run、suite report、artifact/report pair、修复说明和复验结果方向。

### 23. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| A 级临时接受的审批角色 | 影响有条件通过 | Step 13 / Step 14 固定接受和签署口径。 |
| 缺陷系统字段名 | 影响执行记录 | 本 Step 只要求 defect ref 与回指关系,不固定字段 schema。 |
| P1 selected-run 是否在某 release 升级为进入条件 | 影响 B/R 分类 | 当前不升级;若升级需回 Step 3/4/9/13 重定基线。 |
| artifact/report JSON 字段和值域 | 影响自动生成证据 | 如需机器 schema,回 `05` / schema owner 闭口。 |

### 24. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| SOP Step 12 问题已回答 | 通过 | 见 §14。 |
| 缺陷对结论的影响可判定 | 通过 | 见 §15 / §18。 |
| 缺陷规则与一票否决项一致 | 通过 | VETO 全部映射为 S,不可风险接受。 |
| 修复后复验范围已固定 | 通过 | 见 §17。 |
| 放行规则不越权 | 通过 | S/VETO 不放行,A 严格条件候选,B/R 进入 residual。 |
| 可进入 Step 13 | 通过 | 下一步定义风险接受与遗留项;进入前等待用户确认。 |

### 25. R12.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 12 R12.2 | pass |
| 是否完成 SOP Step 12 期望产出 | pass |
| 是否输出缺陷分级表、复验规则和放行规则 | pass |
| 是否明确 VETO = S 且不可风险接受 | pass |
| 是否明确 release smoke 不替代底层 suite | pass |
| 是否避免 P1/P2、无来源 P95/SLO/capacity、retention 或 peripheral 未覆盖被误设为 S | pass |
| 是否未写真实 defect status、真实 run_id、真实 verdict、risk acceptance 签署、CI 或 implementation boundary | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.1 risk acceptance:先思考`;只允许思考风险接受与遗留项的输入、范围、可接受/不可接受边界、`reports/acceptance/risk-acceptance.md` 方向、残余风险表、open issues 和 R13.2 写入边界;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
