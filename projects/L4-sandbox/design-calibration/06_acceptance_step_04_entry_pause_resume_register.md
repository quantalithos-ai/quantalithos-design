# Step 4 分件 A. 进入阻断、暂停与恢复登记

> 父Step: `06_acceptance_step_04_entry_exit.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_5
> 边界: 本分件细化FormalEntryReady失败传播、APAUSE-SBX-001~012和resume /重新入场规则;不创建实际entry / pause / resume记录,不填写缺陷、EV、风险、结论或签署。

---

## 1. 分件状态与引用边界

| 项 | 结论 |
|---|---|
| 条件owner | 父Step 4 |
| Entry条件 | `AENT-SBX-001~016`定义见父Step §9.1 |
| Pause条件 | `APAUSE-SBX-001~012`唯一正式定义见本分件§3 |
| Exit条件 | `AEXT-SBX-001~016`定义见父Step §9.6 |
| 当前实例 | 无实际acceptance batch / entry / pause / resume记录 |
| 当前过程状态 | `NotEntered` |
| Step审查状态 | 用户已确认父Step 4;本分件随父Step放行至Step 5 |

本分件不得被单独解释为正式`06`章节。Step 15装配§4时必须同时引用父Step与本分件。

---

## 2. 进入阻断与状态传播

| 触发类别 | 典型来源 | 验收过程状态 | 修复 /后续动作 |
|---|---|---|---|
| design / claim未冻结 | AENT-001 /002;ABSL-001~009 | `EntryBlocked` | 形成immutable ref / declaration;重新执行全部AENT |
| delivery / harness不可定位 | AENT-003;ABSL-010~016 | `EntryBlocked` | 固定subject / build / core / harness / graph;不得用diagnostic替代 |
| ENV / config / data / dependency缺失 | AENT-004;ABSL-017~023 | `EntryBlocked` | 完整装配相应role;required缺失不fallback |
| source / RELEASE未通过 | AENT-005 /006;EXT-SBX-* | `EntryBlocked` | 按正式`05`修复 /复验并生成新fixed packet |
| raw / report / EV / P0Q packet不完整 | AENT-007 /008 | `EntryBlocked` | 修复producer / pairing / schema;禁止手写补EV |
| acceptance draft缺失 /静态填结论 | AENT-009 | `EntryBlocked` | 由fixed RELEASE重新生成identity-bound draft |
| open S / A或P0非Passed | AENT-010 | `EntryBlocked` | 按S / A修复、完整复验、关闭;不能risk accept |
| VETO / evidence完整性预筛命中 | AENT-011 | `EntryBlocked`;安全命中保持containment | 修复并按L-R5重验,或保留terminal不通过材料用于新批次 |
| evidence失效 / identity漂移 | AENT-012 | `EntryBlocked` | invalidated / superseded并重建packet |
| resource disposition / retention hold缺失 | AENT-013 | `EntryBlocked` | 先完成安全处置和证据保留guard |
| claim / conditional与证据不一致 | AENT-014 | claim-specific `EntryBlocked`或DesignReopen | 不能review后删claim;先重建scope |
| review责任 /访问未就绪 | AENT-015 | `EntryBlocked` | 固定角色与只读访问;不得自审自签 |
| entry record不完整 | AENT-016 | `NotEntered / EntryBlocked` | 逐项记录后才可写InReview |

entry检查必须产生一份绑定fixed RELEASE的记录,但本Step不新增机器schema或路径。实际承载可由`reports/acceptance/handoff.md`固定章节或正式review系统记录完成;后续Step 10 /14只允许细化字段和签署,不得改变16项谓词。

---

## 3. Paused触发条件

进入`InReview`后,任一`APAUSE-SBX-*`触发必须立即停止新增通过结论和签署。已有review记录保留,受影响结论标记pending invalidation / disputed,不得覆盖。

| Pause ID | 触发 | 立即动作 | Resume /转向要求 |
|---|---|---|---|
| APAUSE-SBX-001 | design / standards ref、送验claim或ASCP范围变化 | 冻结review;标记受影响项 | 新design / claim通常形成新acceptance batch并全量AENT |
| APAUSE-SBX-002 | subject、build / image、core-contracts或harness revision变化 | 旧packet停止消费 | 按`05` RT选择新四源 / RELEASE;全量AENT |
| APAUSE-SBX-003 | 任一source role的ENV / PROFILE / config / data / suite identity漂移 | 该source和RELEASE失效 | 新run、四源兼容校验和全量AENT |
| APAUSE-SBX-004 | raw / report / evidence index digest mismatch、pair缺失、静态EV或review编辑raw | 保留现场;阻断全部依赖项 | evidence integrity调查;必要时L-R5;新packet入场 |
| APAUSE-SBX-005 | 新发现S / A、VF / VETO命中、P0失败或Blocked被吞并 | 停止通过路径;安全项先contain | 修复 /完整复验后新packet;或进入terminal不通过路径 |
| APAUSE-SBX-006 | accepted / Passed结论关联缺陷重开或ABSL-040新增invalidation | 标记关联项失效,通知reviewer | superseding evidence +受影响Step重新review |
| APAUSE-SBX-007 | 新public / config / domain surface、无法绑定正式契约 / TC / evidence | 触发DesignReopen | 回写owner文档并重开受影响`05/06` Step;不得在`06`补语义 |
| APAUSE-SBX-008 | P1 / P2 claim、合同 /审计阈值或目标阶段在review中升级 | 禁止缩减旧P0或临时补表 | 先重建scope / baseline;适用时新batch |
| APAUSE-SBX-009 | review发现orphan / duplicate / trace断链、四源 / review version不一致 | 相关结论置Disputed | 修复index / draft并重新独立review |
| APAUSE-SBX-010 | test-created active / orphan resource、cleanup / containment / lab teardown状态恶化 | 停止签署并保持guard /调查材料 | 完成safe disposition;若产品truth受影响则新P0Q / RELEASE |
| APAUSE-SBX-011 | reviewer / final authority冲突、职责失效或关键材料无只读访问 | 暂停独立审查 | 重新分配角色 /访问并记录continuity;不得代签 |
| APAUSE-SBX-012 | security / legal / compliance hold、retention guard或调查要求禁止继续 | 保留全部材料,停止清理 /签署 | hold owner明确解除或转terminal不通过;不得风险接受绕过 |

---

## 4. Resume与重新入场规则

| 情形 | 允许从Paused恢复InReview? | 必需材料 | 必须全量AENT? |
|---|---:|---|---:|
| 仅derived Markdown模板修复,raw / identity /语义不变 | 是 | 新report digest、pairing / no-static复核、review version continuity | 否;重验AENT-008 /009 /012 |
| reviewer访问 /角色短暂中断且fixed packet未变 | 是 | responsibility / access恢复记录、无冲突声明 | 否;重验AENT-015 /016 |
| orphan trace / draft cross-ref修复且raw item未变 | 是 | agent + human复核、修复前后digest与影响面 | 否;重验AENT-009 /011 /012 |
| subject / design / core / harness / source identity变化 | 否 | 新四源、RELEASE、draft和entry record | 是,新acceptance batch |
| P0断言 / suite / candidate packet重跑 | 否 | 新fixed source / RELEASE和supersede链 | 是 |
| scope或claim升级 /缩减 | 否 | 新declaration、上游回写、完整适用evidence | 是 |
| S / VETO已确认且不计划当前批次修复 | 不恢复 | terminal finding、open issues和安全disposition | 转DecisionReady不通过路径 |

任何允许局部resume的情形也必须重新检查fixed RELEASE和四源digest未改变。resume record必须引用pause ID、根因、修复、受影响条件、recheck结果和review continuity;本分件不创建该记录。

---

## 5. 分件自检

| 自检项 | 结论 |
|---|---|
| APAUSE-SBX-001~012是否唯一连续 | 通过;12定义 /12唯一 |
| EntryBlocked是否与test Blocked分离 | 是 |
| identity变化是否禁止局部resume | 是 |
| terminal不通过是否保留未评估披露 | 是 |
| 是否创建实际pause / resume事实 | 否 |
