# Step 4. 定义进入条件与退出条件

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填章节: `06-验收标准.md` §4 进入条件与退出条件
> 创建日期: 2026-06-28
> 当前模式: full-restart / step4-entry-exit
> 当前状态: completed
> 当前模块: `R4.2 entry exit:再写入`
> 当前门禁: `R4.2` completed_wait_user_confirm_to_R5.1;等待确认进入 Step 5 `R5.1 function gate:先思考`

---

## R4.1 entry exit:先思考

### 1. 当前模块目标

`R4.1` 只思考新版 `06-验收标准.md` 的正式验收什么时候可以开始、什么时候可以退出、什么时候必须暂停或判定不可裁决。

当前模块不修改正式 `06-验收标准.md`,不执行测试,不填写真实缺陷状态,不裁决最终通过 / 有条件通过 / 不通过,不进入 Step 5。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R4.2 |
| 用户确认 | 已确认从 Step 3 completed 推进到 Step 4 `R4.1 entry exit:先思考`。 |
| 当前允许 | 思考进入条件、退出条件、暂停 / 不可裁决条件、风险接受前置和 R4.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写真实 run/pass/fail;固定缺陷结论;进入 Step 5。 |

### 2. 本模块输入承接

| 输入 | R4.1 关注点 | 禁止外推 |
|---|---|---|
| Step 3 基线 | source refs、implementation commit、profile、config digest、run_id、artifact/report/acceptance path。 | 缺基线时仍允许进入正式验收。 |
| `05-测试方案.md` §11 | S/A/B/R 缺陷分级、复验和风险接受规则。 | S 级或 P0 evidence integrity 缺口风险接受。 |
| `05-测试方案.md` §12 | 测试进入 / 退出准则和不得退出情况。 | 直接把测试退出等同于验收通过。 |
| `05-测试方案.md` §13 | `EV-ML-*`、artifact/report/acceptance/review 证据结构。 | 用 summary 替代 suite report 或 raw artifact。 |
| `05-测试方案.md` §14 | 回归策略、residual、不可风险接受。 | P1/P2 unavailable 计入 P0 passed。 |
| L1-governance Step 4 | framework_reference | 参考进入条件、退出条件、暂停条件、来源追溯结构。 | 复制 governance 领域事实、AC-GOV/VF-GOV/EV-GOV 编号。 |

### 3. SOP Step 4 问题思考

| SOP 问题 | R4.1 初判 | R4.2 写入提醒 |
|---|---|---|
| 开始验收前哪些基线必须确认? | 必须确认 Step 3 的 design source refs、standards refs、implementation commit / build / image、core upstream、P0 profile、config digest、fixture/replay root、run_id、artifact root、report root、acceptance handoff。 | 写成进入条件 checklist,条件必须可判定。 |
| 哪些测试证据必须先生成? | P0 blocking suite reports、`EV-ML-*` evidence index、raw artifact/report pair、redaction/dependency/config/report audit、release-main-smoke、acceptance handoff、veto checklist。 | 区分“必须存在”与“可能因失败存在 safe failure evidence”。 |
| 哪些缺陷会阻断进入验收? | 未关闭 S 级缺陷、P0 truth/boundary/security/evidence integrity 破坏、P0 profile 不可装配、artifact/report pairing 缺失、source-missing stop 被绕过、baseline 未固定。 | A 级是否允许进入需看是否已修复或正式接受,但不能触发 VETO。 |
| 退出验收需要哪些结论? | 所有 P0 验收项有裁决,所有 VETO 有真实证据支撑未触发,S=0,A 级修复或可接受,residual 有风险接受,最终三值结论可签署。 | 不把 release smoke 或 summary 当作底层 suite 替代。 |
| 哪些风险必须先接受? | P1 selected-run unavailable、durable/real-like 未覆盖、capacity/threshold 未硬化、evidence retention 未固定、高级 dashboard/marketplace future 等 residual。 | P0 红线、VETO、S 级、raw body/secret、dependency/evidence integrity 不可接受。 |

### 4. 进入条件候选思考

| 候选条件 | 来源 | R4.1 判断 |
|---|---|---|
| `00`~`05` source refs 固定 | Step 3 | 必须进入条件。无 source refs 不可裁决。 |
| implementation commit / build / image 固定 | Step 3 | 必须进入条件。设计阶段不得假填。 |
| profile / config digest / fixture root 固定 | Step 3;`04`;`05` | 必须进入条件。P0 profile unavailable 不得进入。 |
| `run_id` 非 `latest` 且唯一 | Step 3;`05` §13 | 必须进入条件。缺 `run_id` 不可裁决。 |
| raw artifact 与 suite report 成对 | Step 3;`05` §13 | 必须进入条件。report 不得替代 artifact。 |
| `EV-ML-*` evidence index 存在 | Step 3;`05` §13 | 必须进入条件。需要能回指 TC、suite、artifact、report。 |
| `reports/acceptance/handoff.md` 存在 | Step 3 | 必须进入条件。用于送验范围和边界说明。 |
| `reports/acceptance/veto-checklist.md` 存在 | Step 3;Step 11 输入 | 必须进入条件。不得静态默认 passed。 |
| `risk-acceptance.md` | Step 13 输入 | 有 residual / 条件通过可能时必须存在。 |
| S 级缺陷为 0 | `05` §11 | 必须进入条件。S 级不得风险接受。 |

### 5. 退出条件候选思考

| 候选条件 | 来源 | R4.1 判断 |
|---|---|---|
| 每个 P0 验收项有裁决 | SOP;Step 2 | 必须退出条件。结论包括通过 / 失败 / 不适用-with-reason。 |
| P0 AC 能回指设计、TC、EV、report path | SOP;Step 5~10 | 必须退出条件。防孤儿验收项。 |
| VETO 未触发且有真实证据 | Step 11 | 必须退出条件。不能静态默认。 |
| P0 blocking suite artifact/report pair 完整 | `05` §12/§13 | 必须退出条件。 |
| redaction、dependency、config、report integrity 无阻断失败 | `05` §12 | 必须退出条件。失败则不通过或暂停修复。 |
| release-main-smoke 只是代表性闭环 | `05` §9/§13 | 必须明确不得替代底层 suite。 |
| S=0,A 级修复或正式接受 | `05` §11 | 必须退出条件。A 级接受不得触发 VETO。 |
| residual / P1/P2 进入 risk acceptance 或 open issues | Step 2;Step 13 | 必须退出条件。不得污染 P0 passed。 |

### 6. 暂停 / 不可裁决候选思考

| 触发 | R4.1 判断 | R4.2 写入提醒 |
|---|---|---|
| source refs、implementation commit、config digest 或 run_id 缺失 | 不可进入正式验收。 | 写入暂停 / 不可裁决表。 |
| `latest` 或路径不符合 Step 3 | 不可进入正式验收。 | 明确阻断。 |
| artifact/report pairing 缺失 | 不可进入或退出。 | 明确阻断。 |
| static evidence / VETO passed | 不可进入或退出。 | 明确阻断。 |
| S 级缺陷、VETO、redaction / dependency / report audit failed | 不通过或暂停修复后重验。 | 不得风险接受。 |
| baseline 固定后 P0 变化未回归 | 暂停,触发 Step 3 / `05` §14 规则。 | 明确需要新 evidence。 |
| 发现设计闭口缺失 | 暂停,回写设计后重做受影响 Step。 | 不由验收标准私补。 |

### 7. 旧正式 06 污染思考

| 旧口径 | R4.1 判断 | R4.2 处理 |
|---|---|---|
| 旧进入条件只要求文档和基础数据 | 过弱,缺 source refs、run_id、artifact/report、acceptance handoff。 | 新版进入条件必须可复验。 |
| 旧退出条件只列 P0 和 S 级 | 过窄,缺 VETO、EV、redaction/dependency/report audit、risk acceptance。 | 新版退出条件覆盖证据和红线。 |
| 旧 release / staging 语境 | 会污染 P0/P1/P2。 | P1/P2 不阻断 P0,但必须 residual。 |

### 8. R4.2 写入策略思考

R4.2 应写入 Step 4 的完整中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 进入条件 checklist | 固定正式验收准入门槛。 |
| 退出条件 checklist | 固定正式验收准出门槛。 |
| 暂停 / 不可裁决条件表 | 防止缺基线、缺证据或红线失败时继续伪裁决。 |
| 风险接受前置 | 明确哪些 residual 可接受,哪些不可接受。 |
| 来源追溯表 | 说明进入 / 退出条件来自 Step 3、`05`、Step 11/13/14。 |
| 回填草稿 | 提供未来 `06` §4 草稿,不写正式文档。 |

### 9. R4.2 写入边界思考

`R4.2 entry exit:再写入` 可以写入:

1. `06_acceptance_step_04_entry_exit.md` 的 SOP 问题回答、进入条件、退出条件、暂停 / 不可裁决条件、风险接受前置、来源追溯、回填草稿和进入 Step 5 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 4 completed_wait_user_confirm_to_R5.1。
3. `project_execution_ledger.md` 推进到 `06` Step 4 completed_wait_user_confirm_to_R5.1。

`R4.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 5 功能验收门禁正文。
3. 真实测试执行结论、真实缺陷状态、risk acceptance 签署、最终 verdict。
4. 新测试用例、evidence schema、artifact schema、report schema、CI YAML 或 implementation boundary。

### 10. R4.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 4 R4.1 | pass |
| 是否承接 Step 3 基线和 `05` §11~§14 | pass |
| 是否识别进入 / 退出 / 暂停条件候选 | pass |
| 是否明确 S / VETO / evidence integrity 不可风险接受 | pass |
| 是否未填写真实缺陷 / 测试 / verdict 结论 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R4.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 4 `R4.2 entry exit:再写入`;只允许写入 Step 4 的 SOP 问题回答、进入条件、退出条件、暂停 / 不可裁决条件、风险接受前置、来源追溯、回填草稿、待确认事项和进入 Step 5 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R4.2 entry exit:再写入

### 1. 当前模块目标

`R4.2` 根据用户确认,完成 Step 4 的正式中间产物:把正式验收的进入条件、退出条件、暂停 / 不可裁决条件、风险接受前置和来源追溯写成可回填到新版 `06-验收标准.md` §4 的草稿。

当前模块不修改正式 `06-验收标准.md`,不执行测试,不填写真实缺陷状态,不裁决最终通过 / 有条件通过 / 不通过,不进入 Step 5。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R5.1 |
| 用户确认 | 已确认从 R4.1 推进到 R4.2。 |
| 当前允许 | 写入 Step 4 的 SOP 问题回答、进入条件、退出条件、暂停条件、风险接受前置、回填草稿和进入 Step 5 条件。 |
| 当前禁止 | 修改正式 `06`;写真实执行结论;写 Step 5 功能验收项;写最终 verdict。 |

### 2. 本步目标

本 Step 定义正式验收什么时候可以开始、什么时候可以结束、什么时候必须暂停或判定不可裁决。

本 Step 只回答:

- 开始验收前哪些基线必须确认。
- 哪些测试证据和 acceptance handoff 必须先生成。
- 哪些缺陷、红线、证据缺口会阻断进入或退出。
- 退出验收需要哪些裁决和签署前置。
- 哪些风险必须先接受。

本 Step 不执行测试、不填写真实缺陷状态、不裁决最终通过 / 有条件通过 / 不通过。

### 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | completed | 提供必须固定的文档、交付、环境、证据和 acceptance 基线。 |
| `05-测试方案.md` §11 | formal completed | 提供 S/A/B/R 缺陷分级、复验和风险接受规则。 |
| `05-测试方案.md` §12 | formal completed | 提供测试进入 / 退出 / 暂停阻断准则。 |
| `05-测试方案.md` §13 | formal completed | 提供 `EV-ML-*`、artifact/report/acceptance/review 证据结构。 |
| `05-测试方案.md` §14 | formal completed | 提供回归策略、residual 和不可风险接受项。 |
| Step 2 范围表 | completed | 提供 P0/P1/P2 和只验接缝边界。 |
| L1-governance Step 4 | framework_reference | 只参考进入条件、退出条件、暂停条件和来源追溯粒度。 |

### 4. SOP 问题回答

| SOP 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认? | 必须固定 `00`~`05` design source refs、standards source refs、implementation commit / build / image、core upstream ref、P0 profile、config digest、fixture / seed / replay root、`run_id`、artifact root、report root 和 acceptance handoff 入口。 |
| 哪些测试证据必须先生成? | 至少必须存在 P0 blocking suite artifact/report pair、`reports/runs/<run_id>/evidence-index.md`、run summary、redaction-check、dependency-boundary、config-redline、report-audit、release-main-smoke、`reports/acceptance/handoff.md` 和 `veto-checklist.md`。有 residual / 条件通过可能时还必须有 `risk-acceptance.md`。 |
| 哪些缺陷会阻断进入验收? | 未关闭 S 级缺陷、P0 truth / boundary / security / evidence integrity 破坏、P0 profile 无法装配、artifact/report pairing 缺失、source-missing stop 被绕过、baseline 未固定、redaction / dependency / report audit 阻断失败均阻断进入。 |
| 退出验收需要哪些结论? | 所有 P0 验收项必须有通过 / 失败 / 不适用-with-reason 裁决;所有 VETO 必须有真实证据支撑未触发;S=0;A 级缺陷修复或正式接受且不触发 VETO;residual 有接受人、后续动作和截止条件;最终三值结论和签署口径可执行。 |
| 哪些风险必须先接受? | P1 selected-run unavailable、durable / real-like adapter 未覆盖、真实外部服务未覆盖、performance hard threshold 未硬化、production-like capacity 未覆盖、evidence retention period 未固定、高级 dashboard / marketplace future 等 residual 若影响有条件通过,必须进入 `reports/acceptance/risk-acceptance.md`。 |

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 进入条件只要求旧文档和基础数据,缺 source refs、run_id、artifact/report 和 acceptance handoff。 | 新版进入条件要求可定位、可复查、可重放。 |
| 旧 `06-验收标准.md` | 退出条件只列 P0 项和 S 级缺陷,缺 VETO、EV、redaction/dependency/report audit、risk acceptance。 | 新版退出条件覆盖证据完整性、红线和风险接受。 |
| `05-测试方案.md` §12 | 测试退出准则不等于验收退出准则。 | 本 Step 将测试退出结果升级为验收进入 / 退出裁决前置。 |
| Step 3 | 当前未提供真实 run / commit。 | 本 Step 将其列为正式进入验收前阻断前置,不伪造。 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入条件 | 文档冻结 + 基础数据。 | 固定 source refs、交付、run_id、config digest、P0 reports、acceptance handoff。 | 验收必须可裁决、可复验。 |
| 退出条件 | P0 通过 + S=0 + 风险接受。 | P0 门禁裁决、VETO 未触发、证据完整、缺陷闭环、risk acceptance 和签署前置。 | 支撑三值结论。 |
| 暂停条件 | 测试层阻断。 | 增加基线漂移、证据伪造、acceptance 缺失、P0 profile 不可用。 | 防止不可裁决仍进入验收。 |
| 风险接受 | 遗留项列表。 | residual 必须有 `risk-acceptance.md`、接受人、动作和截止条件。 | 有条件通过必须有证据。 |

### 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否允许缺 `run_id` 进入验收 | A. 允许后补;B. 不允许。 | 采用 B。无 `run_id` 无法追溯证据。 |
| 是否允许先验收后补 `reports/acceptance/*` | A. 允许;B. 不允许。 | 采用 B。acceptance handoff、VETO 和 risk 是验收入口。 |
| P1 unavailable 是否阻断退出 | A. 阻断;B. 不阻断但需 residual。 | 采用 B。P1 不作 P0 前置。 |
| S 级缺陷是否可条件通过 | A. 可由负责人接受;B. 不可。 | 采用 B。S 级与 VETO 不可风险接受。 |

### 8. 结构化中间产物

#### 8.1 进入条件

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 的 design source refs 已固定。
- [ ] 验收 SOP、验收书写规范、中间产物规范和可落码性标准的 standards source refs 已固定。
- [ ] implementation commit / build id / image digest / package digest 已固定。
- [ ] core upstream / `L0-core` source ref 或 package version 已固定。
- [ ] P0 profile、config digest、runtime config source、adapter mode、fixture set / seed / replay root 已固定。
- [ ] `run_id` 已固定且不是 `latest`。
- [ ] raw artifact root 为 `artifacts/test/<run_id>`,且存在 suite result、case artifact、stdout/stderr 或等价 safe failure evidence。
- [ ] run report root 为 `reports/runs/<run_id>`,且存在 summary、evidence-index、suite reports、redaction-check、dependency-boundary、config-redline、report-audit。
- [ ] `reports/acceptance/handoff.md` 已生成,并记录 source refs、P0/P1/P2 边界、未覆盖说明和 residual 方向。
- [ ] `reports/acceptance/veto-checklist.md` 已生成,且每个 VETO 候选引用真实 evidence / report / artifact。
- [ ] 若存在 residual 或有条件通过可能,`reports/acceptance/risk-acceptance.md` 已生成。
- [ ] `reports/acceptance/open-issues.md` 已生成,并列明 failed / pending suite、S/A 缺陷和缺失证据。
- [ ] `reports/review/reviewer-notes.md` 或 `reports/review/agent-review.md` 已准备作为审查补充入口。
- [ ] 所有 P0 blocking suite 已执行,或存在正式 failed / timeout / unavailable artifact,不得缺 artifact 后人工补表。
- [ ] 当前无未关闭 S 级缺陷。
- [ ] 当前无未复验的一票否决相关修复。
- [ ] 当前无 redaction、dependency、config redline、report audit 阻断项。
- [ ] P0 profile 未出现 unavailable but marked passed。
- [ ] 缺 marker/source/schema/port 等设计真相源时已 stop-review,未由测试、报告或验收标准私补。

#### 8.2 退出条件

- [ ] 每个 P0 验收项都有明确结论:通过 / 失败 / 不适用且有正式理由。
- [ ] 每个 P0 验收项均能回指正式需求 / 设计契约、`TC-ML-*`、`EV-ML-*` 和 report path。
- [ ] 所有 Step 5~Step 11 的 P0 门禁、证据门禁和 VETO 均已完成停审。
- [ ] 所有 VETO 候选均有真实 evidence 支撑未触发,且 `veto-checklist.md` 未静态默认 passed。
- [ ] 所有 P0 blocking suite 均有 raw artifact / run report pairing。
- [ ] `EV-ML-*` evidence index 无 orphan EV、无静态造证据、无缺 artifact digest。
- [ ] redaction-check、dependency-boundary、config-redline、report-audit 均通过或明确导致不通过。
- [ ] `release-main-smoke` 只证明代表性闭环,未替代底层 suite。
- [ ] query / job / observability no truth repair 红线有证据覆盖。
- [ ] 当前无未关闭 S 级缺陷。
- [ ] A 级缺陷已修复并复验,或有正式风险接受且不触发 VETO。
- [ ] B/R 缺陷或 P1/P2 residual 已进入 `risk-acceptance.md` 或 `open-issues.md`,并有责任人、接受人、后续动作和截止条件。
- [ ] P1 selected-run unavailable 未计入 P0 passed evidence。
- [ ] performance sample / trend 已记录;若无正式阈值,不得据此裁决 pass/fail。
- [ ] 最终结论三值口径可执行:通过 / 有条件通过 / 不通过。
- [ ] 最终签署角色、审查材料和交接文件齐备。

#### 8.3 暂停 / 不可裁决条件

| 触发 | 处理 |
|---|---|
| design source refs、standards refs、implementation commit、core upstream ref 或 config digest 未固定 | 不进入正式验收。 |
| `run_id` 缺失或使用 `latest` | 不进入正式验收。 |
| raw artifact 缺失、缺 digest 或路径不符合 `artifacts/test/<run_id>` | 不进入正式验收。 |
| run report 缺失、缺 evidence-index 或路径不符合 `reports/runs/<run_id>` | 不进入正式验收。 |
| `reports/acceptance/handoff.md` 或 `veto-checklist.md` 缺失 | 不进入正式验收。 |
| `veto-checklist.md` 静态默认全部 passed | 不进入正式验收。 |
| redaction / dependency / config redline / report audit failed | 不通过或暂停修复后重验。 |
| S 级缺陷存在 | 不通过或暂停修复后重验。 |
| P0 profile 无法装配 | 不通过或暂停修复后重验。 |
| baseline 固定后发生影响 P0 的变更但未回归 | 暂停,按 Step 3 / `05` §14 重新生成 evidence。 |
| 发现设计闭口缺失导致验收项无法绑定正式契约 | 暂停,回写设计后重做受影响 Step。 |
| P1/P2 unavailable 被写成 P0 passed | 暂停并改为 residual;若已污染 evidence,重建 report。 |
| source-missing stop 被绕过 | 不通过或暂停修复后重验。 |

#### 8.4 风险接受前置

| 风险类型 | 是否可接受 | 前置条件 |
|---|---|---|
| P1 real-like selected-run unavailable | 可接受 | 必须不影响 P0,并进入 `risk-acceptance.md`。 |
| durable storage / bus / external resolver 产品行为未覆盖 | 可接受 | P0 port / repository / seam 已由 controlled evidence 覆盖。 |
| production-like capacity / long-run 未覆盖 | 可接受 | 当前无容量模型;进入 future / operations readiness。 |
| performance hard threshold 未定义 | 可接受 | sample / trend 已记录,不得据此 pass/fail。 |
| evidence retention period 未固定 | 可接受但需后续 owner | 不影响当前 run artifact/report pairing。 |
| S 级缺陷、VETO、raw body/secret 泄露、non-core sibling compile dependency、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass、P0 profile unavailable marked passed | 不可接受 | 必须修复或判定不通过。 |

#### 8.5 进入 / 退出来源追溯

| 条件组 | 来源 | 说明 |
|---|---|---|
| 文档 / 交付 / 证据基线 | Step 3 | 验收必须可定位、可复验。 |
| P0 环境 / 配置 / 数据 | `04`;`05` §12 | P0 使用 fake / controlled / disabled profiles。 |
| P0 suite / report / evidence | `05` §13 | blocking suite、`EV-ML-*`、artifact/report pairing。 |
| 缺陷 / 复验 / 风险接受 | `05` §11 | S/A/B/R 和复验要求。 |
| residual / P1/P2 | Step 2;`05` §14 | P1/P2 不阻断 P0,但必须记录。 |
| VETO / 红线 | `00` §14;Step 2;后续 Step 11 | 不可风险接受。 |
| 最终签署 | 后续 Step 14 | 三值结论和签署口径。 |

### 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“进入条件”“退出条件”“暂停 / 不可裁决条件”“风险接受前置”和“进入 / 退出来源追溯”小节,了解验收准入和准出如何收敛。

正式 `06-验收标准.md` §4 应回填:

进入验收前必须固定 `00`~`05` source refs、standards refs、implementation commit / build / image / package、core upstream、P0 profile、config digest、fixture / seed / replay root、`run_id`、artifact root、report root 和 acceptance handoff。缺少 raw artifact、run report、evidence index、veto checklist、redaction / dependency / config / report audit 或 P0 profile 装配证据时,不得进入正式验收。

退出验收必须满足所有 P0 验收项有裁决,所有 P0 验收项均能回指正式需求 / 设计契约、`TC-ML-*`、`EV-ML-*` 和 report path;所有 VETO 有真实 evidence 支撑未触发;所有 P0 blocking suite 有 raw artifact / run report pairing;redaction、dependency、config redline 和 report integrity 无阻断失败;S=0;A 级缺陷修复或正式接受且不触发 VETO;B/R 缺陷和 P1/P2 residual 已进入风险接受或开放问题;最终三值结论和签署口径可执行。

若出现 source refs、implementation commit、config digest、run_id、artifact/report、acceptance handoff、veto checklist 缺失,或 `latest`、静态 evidence、P0 profile unavailable but passed、source-missing stop 被绕过、baseline 变化未回归、设计闭口缺失等情况,必须暂停或判定不可裁决。

P1 selected-run unavailable、真实产品行为未覆盖、capacity / long-run 未覆盖、performance hard threshold 未定义、evidence retention 未固定等 residual 可在不影响 P0 且有接受人 / 后续动作 / 截止条件时进入风险接受。S 级、VETO、raw body/secret 泄露、non-core sibling compile dependency、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass 和 P0 profile unavailable marked passed 不可风险接受。

### 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式验收是否要求 `reports/review/agent-review.md` 必填 | 影响进入条件严格度。 | 当前作为审查补充入口;是否必填可在 Step 10 / Step 14 收口。 |
| P1 selected-run 在某 release 是否强制 | 影响退出条件。 | 当前不阻断 P0;若强制需 Step 13 / Step 14 收口。 |
| `risk-acceptance.md` 是否允许无 residual 时为空文件 | 影响进入条件。 | 当前要求有 residual / 条件通过可能时必填。 |

### 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入条件可判定 | pass | 见 §8.1。 |
| 退出条件可判定 | pass | 见 §8.2。 |
| 暂停 / 不可裁决条件明确 | pass | 见 §8.3。 |
| 风险接受前置明确 | pass | 见 §8.4。 |
| P1/P2 不污染 P0 | pass | P1/P2 只进 residual。 |
| 可进入 Step 5 | pass | 下一步定义功能验收门禁;进入前等待用户确认。 |

### 12. R4.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R4.1 写入边界执行 | pass |
| 是否参考 L1-governance Step 4 框架但未复制领域事实 | pass |
| 是否完成 SOP Step 4 问题回答 | pass |
| 是否形成进入条件和退出条件 checklist | pass |
| 是否形成暂停 / 不可裁决条件 | pass |
| 是否明确 S / VETO / evidence integrity 不可风险接受 | pass |
| 是否未填写真实缺陷 / 测试 / verdict 结论 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.1 function gate:先思考`;只允许思考 P0 功能验收门禁、验收项 ID、通过 / 失败条件、设计契约、`TC-ML-*`、`EV-ML-*`、report path 和裁决影响;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
