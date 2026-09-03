# L2-member-images 06 验收标准 Step 4：定义进入条件与退出条件

> 创建日期：2026-09-03  
> 当前状态：`completed_stop_review`  
> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4  
> 回填位置：正式 `06-验收标准.md` 第 4 章“进入条件与退出条件”  
> 执行模式：`full-restart`；本文件定义未来实际验收的裁决门，不生成 delivery、run、证据、缺陷、结论或签署事实。

## 1. Step 开工确认、范围与门禁

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 4：定义进入条件与退出条件。 |
| 当前模块 | `actual_acceptance_entry_and_exit_gates`。 |
| 本步目标 | 将 Step 3 的 future 基线槽位、05 的测试交接条件、P0/VETO/缺陷纪律转成可判定的验收进入、退出、暂停和不可裁决条件。 |
| 本步输入 | `project_execution_ledger.md`；`06_acceptance_calibration_flow.md`；Step 1~3；正式 `00~05`；`05` §11~§14；`03` §7~§15；`04` §5~§12；验收 SOP/书写规范；中间产物规范。 |
| 本步输出 | 进入条件、退出条件、暂停/不可裁决表、P0 blocker 的分类口径、来源追溯和正式 §4 回填草稿。 |
| 写入前检查 | 项目级台账允许 06 Step 4；文档级 flow 显示 Step 3 已完成；本 Step 先完成模块问题回答、诊断、取舍和结构化清单；正式 06 仍禁止写入。 |
| 当前真实验收状态 | 未进入。没有 implementation/build/image ref、profile/config identity、fixture identity、`run_id`、artifact、report、EV instance、缺陷、风险接受、verdict 或 signoff。该事实不是“不通过”结论。 |
| gate_status | `pass_with_explicit_blockers`：门禁规则已可判定，但未来实际验收的全部进入前置尚不存在。 |
| next_allowed_action | 严格进入 Step 5 `function_gate`，逐 P0 功能完成设计契约、TC、EV、路径和裁决影响的小循环；不得修改正式 06、进入 07 或执行测试。 |

## 2. Step 内计划与模块级台账

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| `entry_gate` | done | done | done | done | done | done | pass | 进入 `exit_gate`。 |
| `exit_gate` | done | done | done | done | done | done | pass | 进入 `suspension_and_non_circumvention`。 |
| `suspension_and_non_circumvention` | done | done | done | done | done | done | pass | 执行跨模块审计。 |
| `cross_gate_audit` | done | done | done | done | done | done | pass | 可进入 Step 5；正式回填仍仅 Step 15 允许。 |

本 Step 没有按 capability 分拆验收项：它只定义所有后续验收项共同使用的入口和出口。功能、数据红线、协议、状态、非功能、证据和 VETO 的具体内容分别留给 Step 5~11，避免把实际裁决表提前混入本 Step。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 | 当前边界 |
|---|---|---|
| 开始验收前哪些基线必须确认？ | 必须固定正式 `00~05` 的 source identity、实施来源和 immutable build/image identity（按未来交付形态）、`local-dev`/`ci-test`/`integration-like`/`operations-replay` 中的实际 profile、严格校验后的 config identity、fixture/replay identity、dependency disposition 和唯一 `run_id`。 | 当前只存在槽位；任何缺值都不能以“当前文档”或 `latest` 补齐。 |
| 哪些测试证据必须先生成？ | 每一项被送验的 P0 门禁必须有同一 `run_id` 下的 raw artifact/report pair、EV→TC→契约映射；验收包必须含 `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md`、相关 suite report，以及 `handoff.md`、`veto-checklist.md`。 | `EV-*` 目前是规划 family，不是实例；`risk-acceptance.md` 只有存在候选残余风险时才可作为条件通过的前置。 |
| 哪些缺陷会阻断进入验收？ | 未固定基线、没有可写/可读证据根、P0 evidence 缺失或不可回指、S 级/VETO 相关 observed defect 未关闭、redaction/依赖/报告完整性失败、把 `blocked`/`pending`/fake 标为 passed，以及 P0 profile 无法按正式规则装配，均阻断。 | `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` 是设计/owner blocker，不是已观察缺陷；不得虚构 defect 状态。 |
| 退出验收需要哪些结论？ | 全部 selected P0 验收项必须有真实且可复查的结果；每个 VETO 必须有检查证据；S=0；A 级缺陷已复验修复或满足未来 Step 13 的逐项风险接受；证据路径完整且脱敏；最终三值结论和签署材料可据此形成。 | 退出“可裁决”不等于自动通过；三值结论和签署语义由 Step 14 收口。 |
| 哪些风险必须先接受？ | 只有不触发 VETO、不破坏 P0 truth/安全/证据完整性、且有真实 evidence/defect 支撑的残余 B/C、符合条件的 A，或已明确不进入 P0 分母的 P1/P2 future，才可能逐项进入风险接受。 | 无 delivery/run、无 P0 证据、VETO/S、redaction/依赖边界失败、把 pending 伪装为 readiness，都不能用风险接受绕过。 |

## 4. 当前材料问题诊断

| 材料 / 位置 | 诊断 | 对本 Step 的影响 | 处置 |
|---|---|---|---|
| historical `06-验收标准.md` §2~§3 | 使用旧 persona/toolset/instantiate 主线、泛化 `test/staging`、基础样本链和未绑定的 API/DB/trace 证据。 | 无法定位本轮 delivery、profile、run 或 evidence，且会暗示容器/consumer 正向结果。 | 仅作污染样本；Step 15 删除后按本清单重建。 |
| `05` §12 | 测试执行的进入/退出条件已经定义，但测试交接不等于实际验收准入和最终裁决。 | 若直接复用，会遗漏 source/delivery/run 基线、VETO 清单和验收包审查。 | 在本 Step 上升为验收入口：保留 05 的执行纪律，补齐基线和 acceptance handoff。 |
| `05` §13 | TC/EV、suite、脚本和固定路径均为规划。 | 静态映射不能成为 P0 evidence，也不能让当前设计文档“进入验收”。 | 要求同一 `run_id` 的 artifact/report pair 和人工/Agent 审查后才可作为验收输入。 |
| `03` 的 staged status | `Resolved`、`Complete`、`Buildable`、`Succeeded`、`Passed`、`Eligible`、`Available`、`Fresh`、`Assembled` 均是独立 local/staged 状态。 | 若作为入口或退出的总开关，会形成伪 readiness。 | 只按对应 subject 的正式含义断言；不得替代 delivery/evidence/consumer/runtime 结论。 |
| 当前 blocker 与并行 sibling | B01/B02、B03、OPEN-01/02、PF、MI-UP、Q-MI 仍未关闭。 | 受影响正向 lane 不能被 fake、adapter、缓存、空报告或用户期望转为 pass。 | 验收只能验证当前合法的 zero-effect/no-write/marker/gap；需要外部正向 oracle 时保持 blocked 并重开。 |

## 5. 改动前后对比

| 项目 | 历史 / 未校准口径 | 本 Step 后口径 | 原因 |
|---|---|---|---|
| 验收进入 | 设计文档“冻结”、有基础样本即可开始。 | 文档 source、交付、profile/config、fixture、dependency disposition、run、artifact/report 与 handoff 都必须可定位。 | 验收必须可复查，不能把规划替代交付。 |
| 测试交接 | 测试报告存在即可验收。 | P0 AC 必须从同一 `run_id` 的 TC/EV/artifact/report 关系取得真实输入。 | 防止手写 EV 或跨 run 拼接。 |
| blocker | 未闭合 owner、环境和设计缺口可能被省略。 | 设计 blocker、owner gap、observed defect、evidence failure 四类分开；只有正式定义的 negative seam 可被测试。 | 防止 blocker 伪装为缺陷关闭或正向成功。 |
| 验收退出 | P0“看起来通过”、无 S 即可。 | P0/VETO/缺陷/证据/风险接受/三值结论材料全部可判定，且 P1/P2 不污染 P0。 | 支撑通过、有条件通过、不通过的真实裁决。 |
| 暂停 | 缺少统一处理。 | 缺基线、证据、P0 oracle、红线或发生基线漂移时明确 `not_entered`、`suspended` 或 `not_passable`。 | 不让不可裁决状态被写成通过。 |

## 6. 验收裁决取舍

| 议题 | 备选 | 结论 | 理由 |
|---|---|---|---|
| 缺 `run_id` 时是否可先写验收结论再补证据 | A. 可后补；B. 不可进入实际验收 | 采用 B。 | 无稳定 `run_id` 无法证明同一交付、配置和证据。 |
| 是否把 planned TC/EV 当作进入条件已满足 | A. 是；B. 仅作为 future contract | 采用 B。 | 规划没有 artifact/report origin。 |
| owner pending 能否自动成为 P0 skip/pass | A. 可；B. 不可 | 采用 B。 | owner gap 只能验证本仓的 safe gap/blocked 语义，不能证明对方正向结果。 |
| P1/P2 unavailable 是否阻断 P0 退出 | A. 一律阻断；B. 不进 P0 分母但必须登记 | 采用 B。 | Step 2 已限定 P1/P2；但 selected release 若把其升级为 P0，必须重开范围和本 Step。 |
| VETO/S/evidence integrity 是否可由风险接受放行 | A. 可；B. 不可 | 采用 B。 | 它们破坏裁决可信度或核心红线。 |
| 基线变化后能否复用报告 | A. 可；B. 必须重新基线并新 run | 采用 B。 | source、交付、配置、TC/EV 或报告语义变化可能改变结论。 |

## 7. 结构化中间产物

### 7.1 未来实际验收进入条件

以下每项均须在未来实际送验时有真实、可读且相互一致的记录；目前没有任何复选项被填为完成。

| ID | 进入条件 | 未来判定方式 | 缺失或失败处理 |
|---|---|---|---|
| `ENTRY-MI-001` | 正式 `00~05` source refs 与适用 standards ref set 已固定。 | `reports/acceptance/handoff.md` 逐项记录不可变 identity。 | `not_entered`；不得用“当前版本”代替。 |
| `ENTRY-MI-002` | implementation source、build identity 和适用 immutable image/build ref 已固定。 | 与同一 `<run_id>` 的 context 和 summary 交叉核对。 | `not_entered`；不得填示例 digest、tag 或 `latest`。 |
| `ENTRY-MI-003` | profile、严格校验后的 config identity、fixture/replay set 和 dependency disposition 已固定。 | raw context 与 report 记录同一 identity；依赖保持 compile/runtime/event/ref/adapter/fake 分类。 | `not_entered`；泛化 test/staging 或未确认外部成功无效。 |
| `ENTRY-MI-004` | selected P0 AC、对应正式契约和 planned TC/EV 已按 future Step 5~11 的闭环表固定。 | evidence index 可从 AC 回到 TC、EV、suite 和契约。 | `not_entered`；不能以一条 smoke 或静态表覆盖全部 P0。 |
| `ENTRY-MI-005` | 唯一、不可复用且非 `latest` 的 `<run_id>` 已绑定本轮输入。 | `artifacts/test/<run_id>/meta/context.json` 与 `reports/runs/<run_id>/summary.md` 一致。 | `not_entered`；不得拼接不同 run。 |
| `ENTRY-MI-006` | 每个 selected P0 suite 都有 raw artifact，路径仅为 `artifacts/test/<run_id>/...`。 | 保存 suite `report.json`、脱敏 stdout/stderr、case result 和 failure/blocked reason。 | `not_entered`；缺 raw artifact 不得人工补表。 |
| `ENTRY-MI-007` | 每个 selected P0 suite 都有对应 `reports/runs/<run_id>/...` report。 | suite report、summary、`evidence-index.md`、`gate-results.md`、`redaction-check.md` 均可读。 | `not_entered`；report 缺失或路径不固定即证据无效。 |
| `ENTRY-MI-008` | `reports/acceptance/handoff.md` 与 `veto-checklist.md` 已由真实报告生成初稿并可供审查。 | handoff 说明范围/基线/缺口；VETO 清单逐项回指 EV/report/artifact。 | `not_entered`；静态默认 passed 视为 evidence integrity failure。 |
| `ENTRY-MI-009` | observed S 级、VETO、P0 evidence/redaction/dependency 失败已被区分并显式列入 `open-issues.md`。 | 只以真实 run 产生的 defect/issue record 为准。 | `not_entered` 或 `suspended`；设计 blocker 不得伪造为已关闭 defect。 |
| `ENTRY-MI-010` | B01/B02、B03、OPEN-01/02、PF、MI-UP、Q-MI 的受影响 lane 已标注其正确测试上限。 | Command/Job zero-effect、Query no-write、inbound marker-only、outbound zero、owner gap 不被改标为正向通过。 | `not_entered`；发现 false-pass 时按 VETO/证据问题处理。 |

### 7.2 未来实际验收退出条件

退出验收的含义是“已有足够真实输入可以形成 Step 14 的最终裁决”，不是预先填写任何结论。

| ID | 退出条件 | 未来判定方式 | 不满足时 |
|---|---|---|---|
| `EXIT-MI-001` | 所有 selected P0 AC 均有 `pass`、`fail` 或经范围批准的 `not_applicable_with_reason` 真实记录。 | 每项回指正式契约、TC、EV、artifact、report；`not_applicable` 不可用于未闭合 P0 owner lane。 | 不可裁决，不能通过或有条件通过。 |
| `EXIT-MI-002` | 全部 P0 evidence 能从 `reports/runs/<run_id>/evidence-index.md` 回指同 run raw artifact。 | 不存在 orphan AC、orphan EV、跨 run 证据或手写 passed。 | 不可裁决。 |
| `EXIT-MI-003` | `VETO-MI-001~007` 均有真实检查结果，任一命中均已反映为不通过。 | `reports/acceptance/veto-checklist.md` 逐项回指检查证据。 | 不通过；不得风险接受。 |
| `EXIT-MI-004` | Query strict no-write、inbound `accepted_input=false`、`ImageOutboundEventInventory::NoneAuthorized`、current Command/Job zero-effect 与 redaction/dependency边界均有相关断言。 | 以 Step 7~10 后的 TC/EV 映射和 gate report 复查。 | P0/红线失败；不得写为 readiness。 |
| `EXIT-MI-005` | baseline 未在 run 后发生影响 P0 的变更；若发生，已重开受影响设计/测试并生成新 run。 | handoff、review notes 和 source identities 一致。 | `suspended_rebaseline`。 |
| `EXIT-MI-006` | observed S=0；A 级已修复并复验，或未来 Step 13 确认其可接受且不触发 P0/VETO边界。 | `open-issues.md`、相关 report 和 risk record 一致。 | S 或不可接受 A 为不通过；其余不得默认为已接受。 |
| `EXIT-MI-007` | `redaction-check.md`、`gate-results.md`、suite report 与 acceptance draft 没有 raw secret/body/live state、依赖漂移或 failed/blocked 误标。 | 人/Agent review 对 raw/report/handoff 的一致性检查。 | VETO 或 evidence failure；不通过。 |
| `EXIT-MI-008` | 任何条件通过候选均有 `reports/acceptance/risk-acceptance.md` 的逐项风险、evidence、owner、acceptor、动作和截止触发。 | 只接收 Step 13 明确允许的 residual。 | 不得有条件通过。 |
| `EXIT-MI-009` | owner/sibling 未闭合的 positive lane 仍保持 gap/blocked/unknown，并未被计入 P0 passed、Artifact/consumer/runtime readiness 或发布成功。 | review handoff 与 seam evidence 一致。 | 不通过或回到受影响 Step；不能用 fake/adapter 代替 owner truth。 |
| `EXIT-MI-010` | 最终结论所需签署角色、审查材料和三值裁决输入完整。 | Step 14 的结论/签署矩阵可据真实材料填写。 | 只可停留在 `exit_ready_for_conclusion=false`，不填写 verdict/signoff。 |

### 7.3 暂停、不可裁决与不通过的处理矩阵

| 触发 | 状态 | 必须处理 | 明确不得做的事 |
|---|---|---|---|
| 缺 source/delivery/profile/config/fixture/dependency/run 任一基线 | `not_entered` | 固定缺失身份后重新准备送验包。 | 用文档日期、`latest`、泛化环境或样例值替代。 |
| artifact/report/EV index/handoff/VETO checklist 缺失或相互不一致 | `not_entered` 或 `suspended` | 修复生成链并产生新/一致的 run 资料。 | 手写 EV、复制旧 report、让 agent 口头确认替代。 |
| P0 基线在 run 后变更 | `suspended_rebaseline` | 按 Step 3/05 §14 重开受影响 Step、回归并新建 `run_id`。 | 复用旧 report 或只改摘要。 |
| observed S、VETO、redaction leak、unauthorized outbound、Query write、fake positive success | `not_passable` | 修复、全量/受影响 P0 回归、重新审查 VETO。 | 风险接受、降级为 B/C、删除原始失败。 |
| observed A 影响 P0 契约/一致性 | `suspended` 或 `not_passable` | 修复并按复验矩阵重跑；只有不影响 P0/VETO 的例外才可由 Step 13 逐项处理。 | 先签结论后补复验。 |
| B01/B02/B03/OPEN/PF 或 owner gap 未闭合 | `blocked_positive_lane` | 只审查当前合法 negative/no-write/gap 行为；owner/设计关闭后重开受影响契约和测试。 | 把 blocked 当 pass，或创建外部成功/恢复/consumer 结果。 |
| P1/P2 或无权量化阈值被 selected release 升为硬门禁 | `scope_or_authority_blocked` | 重开 Step 2、3、4、9、13/14 的相关内容。 | 将无来源数值写成 pass/fail，或静默改变 P0 分母。 |

### 7.4 进入/退出来源追溯

| 条件组 | 权威来源 | 本 Step 的转译 |
|---|---|---|
| source、delivery、profile、run、路径与变更 | Step 3；`05` §13~§14。 | 固定为实际验收的可追溯前置。 |
| 测试执行、blocked 与交接 | `05` §12；`05_test_plan_step_12_entry_exit.md`。 | 测试退出是验收输入，不等验收结论。 |
| defect/retest | `05` §11；`05_test_plan_step_11_defects_retest.md`。 | 区分 future observed defect 与 design/owner blocker。 |
| P0 scope、VETO 与 owner boundary | `00` §14~§15；Step 2。 | 不得使 P1/P2、fake 或 pending 污染 P0/VETO。 |
| protocol/state/no-write/staged isolation | `03` §7~§15。 | 退出条件只能断言局部正式语义，不能推导 global readiness。 |
| config/redaction/fail-closed | `04` §5~§12。 | config identity 和无泄露是实际送验/退出门。 |

## 8. 跨模块审计

| 审计项 | 结论 | 修正 / 上限 |
|---|---|---|
| 进入条件是否把规划证据误写成真实证据 | 通过 | 每项都要求同一 `<run_id>` 的实际 artifact/report；当前未进入验收。 |
| 退出条件是否先于 Step 5~11 私造功能/状态/VETO细节 | 通过 | 仅引用已有正式名称和未来映射，不提前填结果。 |
| blocker、defect、residual 是否分离 | 通过 | `DDD/PF/MI-UP/Q-MI` 保持 pending/blocked；observed defect 只能由 future run 产生。 |
| P1/P2 是否污染 P0 | 通过 | 仅可登记 residual；若升为硬门，必须重开范围和基线。 |
| VETO/S/证据完整性是否可被风险接受覆盖 | 通过 | 明确不可。 |
| local staged status 是否被当作 readiness | 通过 | 明确禁止；仅能按 subject 断言。 |
| 当前是否伪造 delivery/run/report/defect/verdict/signoff | 通过 | 全文仅描述 future 条件和当前缺口。 |

## 9. 回填草稿（正式 §4）

> 校准来源：
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“未来实际验收进入条件”“未来实际验收退出条件”“暂停、不可裁决与不通过的处理矩阵”和“跨模块审计”小节，了解基线、证据、blocker、缺陷和风险接受如何共同约束验收裁决。

正式 §4 应规定：未来实际验收只能在固定 `00~05` source refs、implementation/build/image identity、profile/config、fixture/replay、dependency disposition 和唯一 `<run_id>` 后进入；所有 selected P0 必须有同 run 的 artifact/report/EV/TC/contract 闭环，且必须具备 `reports/runs/<run_id>/...`、`reports/acceptance/handoff.md` 与 `veto-checklist.md`。缺基线或证据时为未进入/不可裁决，不能填写通过。退出前，P0 与 VETO 必须有真实结果，S=0，证据完整且脱敏，A/B/C 与 residual 按严格规则处理；VETO、S、redaction/依赖边界和证据完整性失败不能被风险接受覆盖。P1/P2 和未闭合 owner positive lane 不得计入 P0 passed 或 readiness。

## 10. 待确认事项与持续 blocker

| 事项 | 影响 | 当前处置 / 重开点 |
|---|---|---|
| 真实 implementation/build/image identity、profile/config、fixture/replay、dependency disposition、`run_id` | 所有实际验收进入条件 | 未生成；由未来获授权实施/执行阶段固定。 |
| final AC→TC→EV mapping | Step 5~11 和 evidence index | 本 Step 只要求闭环；后续按验收主题逐项收稳。 |
| B01/B02、B03、OPEN-01/02、PF | write/replay/availability/recovery 的正向验收 | 只验当前 negative/no-write 语义；设计关闭后重开 03/05/06 受影响 Step。 |
| MI-UP-001~009、Q-MI-001~004 | external/consumer/Artifact/event/product positive lane | 保持 ref/gap/blocked/unknown/marker；唯一 owner 合同关闭后重开受影响 Step。 |
| P1 selected-run 或量化性能是否成为某 release 硬门 | P0 分母、Step 9/13/14 | 当前不是默认 P0；若升格须重开范围、基线与进入/退出门。 |

## 11. 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| 进入条件可判定且基线完整 | 通过 | §7.1；每项有未来判定和缺失处理。 |
| 退出条件可判定且不预填结论 | 通过 | §7.2；只定义真实材料达到后的裁决输入。 |
| 暂停、不可裁决、不通过区分清楚 | 通过 | §7.3；未把当前无执行事实写作失败。 |
| P0/VETO/defect/risk接受边界一致 | 通过 | §3、§7.2、§7.3。 |
| 证据真实性、固定路径与无 `latest` 已保护 | 通过 | §3、§7.1~§7.3。 |
| 无 sibling/upstream 正向合同或执行事实被伪造 | 通过 | §4、§7.3、§10。 |
| 可进入 Step 5 | 通过 | Step 5 可在本入口/出口纪律下收敛功能验收项。 |

```text
step_04 = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_05
next_allowed_action = create_and_complete_step_05_function_gate
formal_06_write_allowed = false_until_step_15
actual_acceptance_entered = false
actual_run_or_evidence_generated = false
```
