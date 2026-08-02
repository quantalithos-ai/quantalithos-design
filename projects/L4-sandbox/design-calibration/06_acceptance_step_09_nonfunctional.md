# Step 9. 定义非功能验收门禁

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 书写规范: `standards/document/验收标准书写规范.md` §5.9
> 回填章节: `06-验收标准.md` §9 非功能验收门禁
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_10
> 所属流程: `06_acceptance_calibration_flow.md`
> 逐维门禁分件: `06_acceptance_step_09_nfr_gate_register.md`
> 阈值 /成熟度分件: `06_acceptance_step_09_threshold_review_register.md`
> 事实成熟度: 门禁设计为`PassDesign`;0 target repo,0 fixed run,0 runtime EV,真实验收仍为`NotEntered`

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否放行Step 9 | 是。Step 8三件已经用户确认并转为`passed_to_step_9`。 |
| 是否读取Step 9标准 | 是。已读取验收SOP Step 9、书写规范§5.9和真相源闭环标准中的NFR / threshold / evidence成熟度规则。 |
| 是否读取正式输入 | 是。已读取正式`00`§13~§14、正式`03`§10~§15、正式`04`安全 /失败 /风险 / VETO、正式`05`§9~§14及其NFR / evidence中间产物。 |
| 是否读取粒度参考 | 是。只参考L1-governance / L1-artifact Step 9的NFR聚合、阈值来源、residual和停审结构,不继承其AC、EV、产品或SLO。 |
| 旧正式`06`定位 | historical material。本Step未修改正式`06`,不继承旧session / command主线、`100%`样本链、无来源“阈值内”或空checkbox。 |
| Canonical编号选择 | 复用`AC-SBX-036~041`;不创建平行NFR AC。`NFCHK / NTH / NFA`只是设计检查索引。 |
| 当前Step状态 | 主件、逐维门禁分件和阈值分件已完成;6个canonical AC、36个逐维检查、20个阈值裁决和18项跨门禁审计闭合;待用户审查。 |

### 1.1 Step内计划

| 模块 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| M1输入与阈值回查 | 对齐六类NFR、专项、slot、source run和历史候选数字 | done | 无来源数字不进入硬门禁 |
| M2逐维裁决 | 展开性能、可用性、安全、追溯、一致性、可观测性 | done | `NFCHK-SBX-001~036`逐项可判定 |
| M3成熟度分层 | 分离P0-C、P0-Q、conditional和真实运行事实 | done | `Blocked / NotRunConditional`不可互相补偿 |
| M4阈值审计 | 固定零容忍、结构、资格与量化激活来源 | done | `NTH-SBX-001~020`来源完整 |
| M5跨门禁审计 | 检查重复owner、证据phase、VETO候选和residual边界 | done | `NFA-SBX-001~018`无冲突 |
| M6正式回填 /停审 | 形成§9草稿、blocker和下一步门禁 | done_wait_review | 用户确认前不进Step 10 |

---

## 2. 本步目标、边界与成熟度

本Step完成:

1. 把`AC-SBX-036~041`分别收束为性能、可用性、安全、审计 /可追溯、幂等 /一致性和可观测性六类裁决小循环。
2. 为每类NFR绑定正式需求 /设计契约、exact TC族、planned slot、fixed source report、通过条件、失败条件和裁决影响。
3. 固定正式零容忍值、结构有界条件、P0-Q资格门槛和conditional量化激活前置,排除历史产品数字和无来源SLO。
4. 明确P0-C只证明确定性语义 /结构,P0-Q只证明固定candidate真实四维与生命周期,PROFILE-06只承载被显式激活的conditional项。
5. 将Step 8的`AC-SBX-039 TX-AUDIT-SLICE`和`AC-SBX-040 CONSISTENCY-SLICE`纳入总体NFR裁决,但不重复定义状态 /事务规则。

本Step不完成:

- 不定义Step 10的evidence真实性、review完成度、redaction报告完整性和验收packet总门禁。
- 不定义Step 11的一票否决正式汇总,只标记`VF-SBX-* / VETO-CFG-*`候选传播。
- 不接受或拒绝`RR-SBX-001~008`,不填写风险接受主体、期限或签署。
- 不选择backend、provider、store、bus、observability产品、告警产品、workload、topology或物理retention策略。
- 不创建run、runtime EV、报告实例、测试结果、缺陷、验收结论、commit或实现文件。

| 成熟度 | 本Step含义 | 对裁决的限制 |
|---|---|---|
| `designed_p0c` | P0-C exact TC、结构 /语义断言和planned producer已设计 | 未真实运行前只能`NotEvaluated`,不能写Passed。 |
| `designed_execution_blocked` | P0-Q断言已设计,但candidate / provider / lab未形成 | 真实验收保持`Blocked`;P0-C / OPS / P1不能替代。 |
| `conditional_non_p0` | 需要正式claim、产品composition、workload、baseline和阈值后才激活 | 未激活为`NotRunConditional`;不补偿P0,也不表示通过。 |
| `planned_requirement_only` | ESLOT、future EV pattern和report path是producer契约 | 不是runtime evidence或实际结论。 |

---

## 3. 输入承接与权威映射

| 输入 | 本Step承接内容 | 不得越界 |
|---|---|---|
| 正式`00`§13 /§14 | 六类NFR、零容忍、关键追溯缺口`=0`、AC-SBX-036~041和VF-SBX-001~010 | 不把候选Docker / gVisor / API数字升级为正式阈值 |
| 正式`03`§10~§12 | UoW、stored replay、version / cursor、commit unknown、38错误、恢复和19 race | 不重新定义状态、事务、错误或并发算法 |
| 正式`03`§13~§14 | dependency边界、adapter绑定、log / metric / formal audit / redaction carrier | 不把telemetry当formal audit或外部truth |
| 正式`04`§8~§14 | sensitive lifecycle、atomic generation、fail-fast / degraded、VETO-CFG和profile资格 | 不由配置放宽hard guard或伪造真实产品 |
| 正式`05`§9~§10 | 16 suite、7 gate、17 planned脚本、六类NFR专项和阈值来源 | 测试设计不等于已运行证据 |
| 正式`05`§12~§13 | 250 P0、4 conditional、21 ESLOT、固定四源run、runtime evidence规则 | slot / path不得伪装EV实例 |
| 正式`05`§14 | RR-SBX-001~008、不可接受项和证据失效触发 | 风险是否接受留Step 13 |
| Step 8三件 | 31 canonical状态entry /30 owner-level machine、14事务 /重放、19 race、64项检查、TX-AUDIT / CONSISTENCY slice | Step 9只做NFR总体聚合,不创建第二套状态门禁 |

---

## 4. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 哪些非功能指标是P0 | `AC-SBX-036`结构有界性是P0-C;`AC-SBX-037~041`的fail-closed、零容忍、追溯、单一真相和safe observability均是P0。P0-Q是release正交必要轴,当前Blocked。 |
| 阈值来自哪里 | 零值与追溯缺口来自正式`00`;结构门槛来自正式`03/04`和显式page / selection / state / call预算;资格完整性来自正式`05`固定manifest;量化数字必须来自后续正式claim + workload + baseline +阈值规则。 |
| 哪些专项未覆盖 | 真实P0-Q、P06 durable / real-like、量化性能、long soak / fleet、physical rollout、真实alert响应、长期retention均没有运行事实;前者阻塞release,后者按scope保持conditional / residual。 |
| 哪些失败阻断 | 任一P0-C mandatory check失败、P0-Q Blocked / Failed、零容忍命中、追溯缺口、第二正式语义、关键观测盲区、缺raw / report导致不可裁决均阻断通过。 |
| 证据来自哪里 | 未来由fixed MAIN-CONTRACT、MAIN-SEAM、OPS、P0Q source run的exact case / suite report生成runtime evidence item,再由fixed RELEASE evidence index聚合;当前只有planned入口。 |

---

## 5. 当前材料问题诊断

| 材料 | 问题 | 本Step处理 |
|---|---|---|
| 旧正式`06`§5 | 只有5条泛化NFR,使用`100%样本链`、`阈值内`和空checkbox,没有正式AC、TC、slot、source role或成熟度 | 全量后置为historical material,不做增量修补 |
| 旧正式`06`性能项 | 未说明workload、environment、baseline、误差和阈值来源 | 不进入当前硬门禁;采用正式结构有界口径 |
| 正式`00`历史候选数字 | Docker / gVisor /销毁 /白名单 / API数字仍作为候选材料存在 | 仅登记为`historical_candidate_excluded`,不得判pass / fail |
| 正式`05`NFR专项 | 已定义方法和planned producer,但没有验收裁决聚合 | 本Step按AC-SBX-036~041聚合,不改变TC / suite / slot |
| Step 8的AC-SBX-039/040 | 只完成transaction / consistency slice | 本Step补齐六类NFR总体证明面,保留Step 8为精确来源 |

---

## 6. 改动前后对比

| 主题 | 旧 /分散表达 | 当前裁决表达 | 原因 |
|---|---|---|---|
| 性能 | “额外开销在阈值内” | P0只验结构有界、完整sample和无optional前置;量化需激活 | 当前无正式workload / baseline /硬阈值 |
| 可用性 | replay / retry样本成功率 | 缺依赖显式等待 /拒绝 /失败,source truth不回滚,不得伪成功 | 对齐fail-closed和owner truth |
| 安全 | 网络 /路径两条负向 | host、四维、policy、正文、truth升格、cleanup / orphan / redline全红线 | 对齐execution isolation完整边界 |
| 审计 | 留痕率100% | 关键变化逐owner可回链且缺口`=0`,formal audit不可被log替代 | 百分比不能定位孤儿链路 |
| 一致性 | 泛化replay | UoW、stored replay、version、19 race、no-repair、跨caller单一语义 | 复用Step 8 exact slice |
| 可观测性 | 没有独立门禁 | 状态、异常、依赖、超限、guard、redline均有safe surface且盲区`=0` | 对齐正式AC-SBX-041 |

---

## 7. 验收裁决取舍

| 议题 | 选项 | 裁决 |
|---|---|---|
| 是否把历史性能数字恢复为P0 | A恢复;B保持候选 | 采用B。无完整阈值来源链时不得硬化。 |
| P0-C是否能替代P0-Q | A可以;B不可以 | 采用B。语义fake / simulation不证明candidate真实四维施加。 |
| P1 selected-run是否补偿P0 | A可以;B不可以 | 采用B。`NotRunConditional`既不加分也不覆盖P0失败。 |
| optional telemetry失效是否可降级 | A任意降级;B仅qualified Degraded | 采用B。formal audit、redaction和hard guard必须继续成立。 |
| P0-Q环境缺失是否可有条件通过 | A可以;B保持Blocked | 采用B。资格前置缺失不是可接受产品遗留。 |
| 追溯 /观测是否完全交给Step 10 | A全部后置;B本Step定NFR,Step 10定证据真实性 | 采用B,避免责任缺口和重复门禁。 |

---

## 8. Canonical AC聚合门禁

逐维条件见`06_acceptance_step_09_nfr_gate_register.md`。表内`NFCHK`只用于本Step机械追踪,正式裁决仍只写canonical AC。

| Canonical AC | NFR主题 | 必须同时成立 | Planned主证 | 失败 /缺失传播 |
|---|---|---|---|---|
| `AC-SBX-036` | 性能与结构有界性 | NFCHK-SBX-001~006;无optional前置、无界scan / batch / retry,完整duration / count sample且未归因phase gap为0 | ESLOT-SBX-003~007 /011 /014按exact case;MAIN-CONTRACT SUITE-SBX-004 /006~010 /014,OPS补强 | 结构 /归因失败则AC失败;量化未激活保持NotRunConditional |
| `AC-SBX-037` | 可用性与fail-closed | NFCHK-SBX-007~012;依赖 /下游 /维护失败诚实,0伪成功 /弱fallback | ESLOT-SBX-002~007 /010 /012 /013及P0Q适用slot;MAIN / SEAM / OPS / P0Q | mandatory失败则AC失败;P0Q缺失阻塞release |
| `AC-SBX-038` | 安全与隔离红线 | NFCHK-SBX-013~018;host /四维 /越权 /泄漏 /升格 /提前释放成功数均为0 | ESLOT-SBX-001~006 /013 /015~019;MAIN / OPS / P0Q | 任一红线失败则AC失败并传Step 11 VETO候选 |
| `AC-SBX-039` | 审计与可追溯 | NFCHK-SBX-019~024;关键owner变化、UoW、protocol、source run均可回链,缺口=0 | ESLOT-SBX-002~006 /009 /011 /012 /015 /018~019;四源report | 任一关键缺口则AC失败;证据完整性另由Step 10裁决 |
| `AC-SBX-040` | 幂等与一致性 | NFCHK-SBX-025~030;单一truth、原子UoW、stored replay、version、single-winner、no-repair | ESLOT-SBX-001~014 /019适用;MAIN-CONTRACT SUITE-SBX-001~010 /014,OPS补强 | 第二语义 /半状态 /重算 /双赢家使AC失败 |
| `AC-SBX-041` | 可观测性 | NFCHK-SBX-031~036;关键状态、异常、依赖、超限、guard、redline有safe surface,盲区=0 | ESLOT-SBX-005~007 /009 /012 /015 /018~019;MAIN / SEAM / OPS / P0Q | 关键盲区或unsafe carrier使AC失败;真实性另由Step 10裁决 |

### 8.1 聚合裁决算法

```text
for each canonical AC-SBX-036~041:
  require every applicable NFCHK has exact TC result and valid evidence item
  preserve source status: Passed / Failed / Blocked / InfraFailed / NotRunConditional
  if any mandatory check Failed -> AC Failed
  if any mandatory source Blocked / InfraFailed / missing -> AC NotAdjudicable and acceptance remains Blocked
  if only non-activated conditional check is NotRunConditional -> do not change P0 result and do not claim that dimension verified
  never average, sample away, waive, or compensate a failed check
```

`NotAdjudicable`是本文对“缺少必需证明,不能作通过裁决”的说明性术语,不是测试schema新枚举。机器状态仍使用正式`Passed / Failed / Blocked / NotRunConditional / InfraFailed`。

---

## 9. Fixed source、slot与future evidence消费

| 证据层 | 必须消费 | 本Step禁止 |
|---|---|---|
| MAIN-CONTRACT | SBX-ENV-02 / PROFILE-02固定run;SUITE-SBX-001~011 /014及MAIN checks | 用PR、OPS或另一次诊断run替代主结果 |
| MAIN-SEAM | SBX-ENV-03 / PROFILE-03固定run;005 /008 /010 /011补强 | 与MAIN-CONTRACT合并run或伪造同一config identity |
| OPS | SBX-ENV-04 / PROFILE-04固定run;012及007~010 /014补强 | 用simulation证明candidate真实隔离 |
| P0Q | SBX-ENV-05 / PROFILE-05固定packet;013及identity / redaction / cleanup checks | 用ENV-02~04、ENV-06、host或fake替代 |
| RELEASE | 按MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q顺序聚合identity与digest | 使用`latest`、删源、换序、选择性忽略Failed / Blocked |
| Conditional | SBX-ENV-06 / PROFILE-06显式激活run;015 | 未激活时制造数值结论或补偿P0 |

每个NFCHK最终必须从`reports/runs/<release_run_id>/evidence-index.md`回指`(source_run_id,evidence_id,artifact_digest)`、exact TC / parameter / assertion、suite raw和suite report。当前所有`ESLOT-SBX-*`都只是planned slot,本Step不分配`EV-SBX-*`实例。

---

## 10. 跨NFR裁决审计

| 审计索引 | 审计问题 | 结论 |
|---|---|---|
| NFA-SBX-001 | 六类NFR是否全部有canonical AC | pass;AC-SBX-036~041一一对应 |
| NFA-SBX-002 | 是否新建平行NFR AC | pass;没有,NFCHK / NTH仅为检查索引 |
| NFA-SBX-003 | 每个AC是否有需求 /设计来源 | pass;正式`00/03/04`可定位 |
| NFA-SBX-004 | 每个AC是否有exact TC / suite入口 | pass;逐维分件36 /36闭合 |
| NFA-SBX-005 | 每个AC是否有planned slot / source report | pass;slot与四源角色已绑定 |
| NFA-SBX-006 | P0-C与P0-Q是否正交 | pass;低profile不得替代candidate资格 |
| NFA-SBX-007 | conditional是否补偿P0 | pass;明确禁止 |
| NFA-SBX-008 | 历史产品数字是否进入硬阈值 | pass;全部排除 |
| NFA-SBX-009 | 零容忍值是否有需求来源 | pass;正式`00`§13.1~§13.3 |
| NFA-SBX-010 | 结构有界是否误写成时延SLO | pass;只裁决selection / scan / call / side effect边界 |
| NFA-SBX-011 | Step 8 TX / consistency slice是否被吞并 | pass;作为AC-SBX-039 /040 mandatory子集保留 |
| NFA-SBX-012 | Step 10 evidence owner是否被提前占用 | pass;本Step定NFR要求,不裁决review / packet真实性 |
| NFA-SBX-013 | Step 11 VETO owner是否被提前占用 | pass;只记录候选传播,不组装正式VETO清单 |
| NFA-SBX-014 | RR-SBX-001~008是否被伪接受 | pass;仍留Step 13 |
| NFA-SBX-015 | Blocked / InfraFailed是否被当产品Passed | pass;均阻断可裁决性 |
| NFA-SBX-016 | NotRunConditional是否被写成N/A / Passed | pass;保留未验证语义 |
| NFA-SBX-017 | tools semantics / agent loop / member lifecycle是否混入 | pass;只验sandbox launch boundary与handoff seam |
| NFA-SBX-018 | 是否产生真实run / EV /结果 /签署 | pass;全部为0 |

---

## 11. 正式章节回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
> - `design-calibration/06_acceptance_step_09_nfr_gate_register.md`
> - `design-calibration/06_acceptance_step_09_threshold_review_register.md`
>
> 延伸阅读:
> - 建议继续阅读上述分件的“六类逐维门禁登记”“阈值来源与成熟度裁决”“跨NFR审计”和“独立停审”,了解六个canonical AC如何从正式NFR、测试专项和fixed source evidence收敛。

```md
## 9. 非功能验收门禁

本章只复用`AC-SBX-036~041`,不创建平行NFR编号。每个验收项必须消费fixed RELEASE聚合所引用的MAIN-CONTRACT、MAIN-SEAM、OPS与P0Q exact source evidence;单个suite总状态、planned ESLOT、低profile结果或conditional run都不能替代逐项证明。

| 验收项 | 维度 | 指标 /要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-SBX-036 | 性能 /结构有界 | 核心不依赖外围增强;query / batch / retry / race / change只处理显式scope,每段等待有typed phase / dependency / timeout归因 | 无界scan、第二次owner副作用、optional前置、未归因phase gap均为0;当前无时延数字门槛 | ESLOT-SBX-003~007 /011 /014适用;SUITE-SBX-004 /006~010 /014;OPS补强 | 结构 /归因失败则不通过;量化未激活保持NotRunConditional |
| AC-SBX-037 | 可用性 | 缺上下文、capability、policy、backend、target或维护依赖时显式等待 /拒绝 /失败,不伪成功 | weak fallback / silent success = 0 | ESLOT-SBX-002~013适用及P0Q lifecycle;MAIN / SEAM / OPS / P0Q | mandatory失败则不通过;P0Q缺失保持Blocked |
| AC-SBX-038 | 安全 | host /旁路、四维silent degrade、越权、正文泄漏、truth升格、提前cleanup、orphan脱管和advisory redline均禁止 | 对应成功数 /泄漏数 = 0 | ESLOT-SBX-001~006 /013 /015~019适用;SUITE-SBX-003 /004 /010 /012 /013 | 任一命中不通过并传递VETO候选 |
| AC-SBX-039 | 审计 /可追溯 | accept / reject / establish / policy / capture / handoff / failure / control / cleanup / redline可回链 | 关键追溯缺口 = 0 | ESLOT-SBX-002~006 /009 /011 /012 /015 /018~019适用;四源evidence | 任一关键缺口不通过;证据真实性由§10再裁决 |
| AC-SBX-040 | 幂等 /一致性 | 同一execution / policy / control只有一种语义;UoW原子、stored replay、single winner、no repair | duplicate第二次owner副作用、双winner、半状态、第二语义 = 0 | ESLOT-SBX-001~014 /019适用;SUITE-SBX-001~010 /014;OPS补强 | 任一mandatory slice失败则不通过 |
| AC-SBX-041 | 可观测性 | 关键状态、异常、依赖缺失、资源超限、guard和redline有safe surface | 关键观测盲区 / unsafe carrier = 0 | ESLOT-SBX-005~007 /009 /012 /015 /018~019适用;MAIN / SEAM / OPS / P0Q | 盲区或泄漏不通过;完整性由§10再裁决 |

P0-C、P0-Q和conditional相互不可替代。P0-Q任何必需identity、probe、cleanup disposition或source evidence缺失时,整体release保持Blocked。历史Docker / gVisor /销毁 /白名单 / API数字不参与当前裁决;未来若送验claim包含量化SLO,必须先固定产品composition、workload、baseline、硬阈值、误差、回归规则和变更审批,再激活PROFILE-06 conditional gate。
```

---

## 12. 对上游设计的影响、待确认与blocker

| 项 | 状态 | 本Step处理 |
|---|---|---|
| 正式`00/03/04/05`是否冲突 | none_found | 六类NFR都有正式对象、方法和producer,无需上游回写 |
| 目标实现仓 / suite /脚本 / CI | open_for_07_precheck | 不阻塞Step 9设计;阻塞全部真实运行和EV生成 |
| ENV-05 candidate / provider / lab | open_for_p0q_execution | P0-Q保持Blocked;不得risk accept或低profile替代 |
| 量化性能 /容量 /成本 | `RR-SBX-002`,conditional | 当前无正式claim / workload / baseline /阈值;不形成SLO结论 |
| P06 durable / real-like | `RR-SBX-001`,conditional | 不证明physical outage / rollout;不补偿P0 |
| long soak / physical rollout / alert / retention | `RR-SBX-005~008` | 保持residual输入;Step 13决定接受边界,`07/09`形成物理方案 |
| 当前未解上游blocker | 无 | 开放项均为执行 /资格 /证据 /后续风险裁决blocker |

---

## 13. 自检与停审

| 检查项 | 结论 |
|---|---|
| 是否创建Step 9主件和两个对应分件 | 通过;1主件 +2分件。 |
| canonical AC是否完整 | 通过;AC-SBX-036~041共6 /6。 |
| 逐维门禁是否闭合 | 通过;NFCHK-SBX-001~036共36 /36。 |
| 阈值来源是否闭合 | 通过;NTH-SBX-001~020共20 /20。 |
| 跨NFR审计是否闭合 | 通过;NFA-SBX-001~018共18 /18。 |
| 每项是否有契约、TC、slot、source report、通过 /失败和影响 | 通过。 |
| 是否区分P0-C / P0-Q / conditional | 通过;三者不可替代。 |
| 是否发明性能 /容量 /可用率数字 | 否;历史数字明确排除。 |
| 是否保留Step 10~14责任 | 通过;evidence、VETO、缺陷、风险和签署均未越界。 |
| 是否修改正式`06` | 否;正式`06`仍为historical material,待Step 15装配。 |
| 是否创建Step 10 / `07` / implementation产物 | 否。 |
| 是否伪造commit / run_id / EV /测试结果 /风险接受 /签署 | 否。 |

### 13.1 进入下一步条件

```text
current_document = `06-验收标准.md`
current_step = Step 9 `非功能验收门禁`
gate_status = completed_reviewed_passed_to_step_10
formal_06_modified = no
runtime_acceptance = NotEntered
runtime_evidence_created = no
next_allowed_action = 用户已确认Step 9;Step 10可依flow开始
commit_required = no
```

用户已明确确认Step 9。Step 10必须读取项目台账、本flow、Step 9三件、验收SOP Step 10、书写规范§5.10、正式`03`§14、正式`05`§9 /§13及L1 Step 10粒度参考后独立形成中间产物。
