# L4-sandbox Step 12 交付、证据与未完成项处置审计

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 12
> 主件: `07_implementation_plan_step_12_completion_criteria.md`
> 交付来源: Step 4 /6 /7 /9 /10 /11与正式`05-测试方案.md`、`06-验收标准.md`
> 创建日期: 2026-07-17
> 状态: completed_pending_user_review
> 当前成熟度: design_only;本文只定义未来完成证据与未完成路由,不表示交付、run、review、risk disposition或验收已经发生

---

## 1. 审计范围与共同规则

本分件覆盖:

1. Step 4定义的39项交付物逐项反查。
2. 32个boundary的Build / Test / Evidence / Commit / Handoff记录要求。
3. P0-C 237项、P0-Q 13项、4项conditional、16 suite、7 gate、17 script、21 ESLOT和17 VETO的完成输入。
4. raw / report / acceptance / review固定交付包。
5. 15个Spike、20个Risk、18个Open Question的完成前关闭或转换。
6. 所有未完成项的延期、risk acceptance、blocker、DesignReopen或DisclosureOnly路由。

共同约束:

- `planned`、`draft`、`NotEntered`、`Blocked`、`missing`和`not_executed`都不是完成。
- mandatory P0缺失不能写延期完成;4项conditional不能补偿250项P0。
- raw artifact不能替代human-readable report;generator draft不能替代independent review或验收裁决。
- 风险“已知”不等于关闭,口头决定不等于OQ关闭,Spike计划不等于Spike结果。
- 当前所有future结果字段统一为`future_runtime_adjudication`或`not_executed`。

---

## 2. 39项交付物完成证据反查

### 2.1 Code / Config / Adapter / Data: 23项

| 交付物ID | Boundary owner | 最小完成证据 | 未完成路由 | 当前事实 |
|---|---|---|---|---|
| `DEL-SBX-CODE-001` | `01A` | Cargo metadata / workspace build、dependency report、review、真实commit / ledger | blocker;`wait_design`或`handoff` | `not_executed` |
| `DEL-SBX-CODE-002` | `02A`;`12A` inventory | contract tests、roundtrip /redaction、protocol inventory、review | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-003` | `04A~08B`,`12A` | 30 owner machines /31 canonical enum entries /39 shared declarations inventory、transition /guard /error tests、review | P0 / VETO blocker | `not_executed` |
| `DEL-SBX-CODE-004` | `02B`,`04B~11C` | service tests、UoW /replay、query no-write、consumer /job owner-call audit | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-005` | `02B`,`03A~03B`,各adapter boundary | repository parity、strict config、builder /adapter tests、dependency review | P0 / architecture blocker | `not_executed` |
| `DEL-SBX-CODE-006` | `04B~09B` | 23 Command / Query entry tests、metadata /safe mapping review | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-007` | `10A~10B` | 9 consumer /13 relay behavior、dedup /retry /quarantine /no-rollback reports | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-008` | `11A~11C` | 10 Job input /selection /partial /stored replay /no-repair reports | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-009` | `04A~11C`;`12A` | `check_protocol_inventory.sh`证明55 /55与TC owner唯一 | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-010` | `02A~11C`;`12A` | 38 typed error producer inventory与ERR case /safe mapping | P0 blocker | `not_executed` |
| `DEL-SBX-CODE-011` | `02B`;各mutation;`12B` | 14 TXN、19 race、三通道replay、no-rollback /winner reports | P0 / VETO blocker | `not_executed` |
| `DEL-SBX-CODE-012` | `03B`,`07B~08B`,`12B`,`14B~14C` | all-carrier scanner、audit /metric label review、redaction-check | security / VETO blocker | `not_executed` |
| `DEL-SBX-CFG-001` | `03A` | source-lane /unknown /duplicate /ambiguous /unreadable /unsupported tests | P0 config blocker | `not_executed` |
| `DEL-SBX-CFG-002` | `03A`;`12A` | 40 /101 /44 expected manifest与coverage check | P0 blocker | `not_executed` |
| `DEL-SBX-CFG-003` | `03A` | NCFG /FC /XVAL negative fixture和safe issue review | P0 blocker | `not_executed` |
| `DEL-SBX-CFG-004` | `03B`,`13A` | P01~05 eligibility、P06 conditional、P07 reject、P05 identity tests | P0-C /P0-Q blocker as applicable | `not_executed` |
| `DEL-SBX-CFG-005` | `03B`;各runtime slice | same-generation /atomic publication、scope ceiling、rollback tests | P0 / VETO blocker | `not_executed` |
| `DEL-SBX-CFG-006` | `03B`,`13A~13B`,`14B~14C` | descriptor /lease /revoke tests、anti-leak scanner、provider audit ref | security / P0-Q blocker | `not_executed` |
| `DEL-SBX-ADP-001` | `02B`,`03B`,`04B~12B` | deterministic parity、failure injection、call /write budget、no host /network side effect | P0 blocker | `not_executed` |
| `DEL-SBX-ADP-002` | `13A~13B` | accepted ADR、immutable packet、13 CONF、redaction /cleanup /anti-substitution | P0-Q blocker;不可fake替代 | `not_executed` |
| `DEL-SBX-DATA-001` | `02B~14B` | 13类builder /schedule按seed重建、namespace隔离、review | test capability blocker | `not_executed` |
| `DEL-SBX-DATA-002` | `12A~13B` | 28 /28数据集、单主违规negative、cleanup disposition | P0 test blocker | `not_executed` |
| `DEL-SBX-DATA-003` | `13A~13B` | manifest schema与identity /capability /provider /cleanup negative fixture | P0-Q blocker | `not_executed` |

### 2.2 Test / Automation / Evidence: 13项

| 交付物ID | Boundary owner | 最小完成证据 | 未完成路由 | 当前事实 |
|---|---|---|---|---|
| `DEL-SBX-TEST-001` | 各capability;`12A` inventory | 254 expected manifest:237 P0-C +13 P0-Q +4 conditional,无orphan /duplicate | P0分母缺失为blocker | `not_executed` |
| `DEL-SBX-TEST-002` | 各phase;`12B~14A` | 16 suite可执行且保留正式status,008 /011 /012不重复主归属 | mandatory suite缺失为blocker | `not_executed` |
| `DEL-SBX-TEST-003` | `14A` | 7 gate trigger /aggregation /blocking /identity fixture与nonzero失败 | RELEASE blocker | `not_executed` |
| `DEL-SBX-TEST-004` | `13B` | 13 CONF固定packet执行或诚实Blocked +0 probe | P0-Q blocker | `not_executed` |
| `DEL-SBX-TEST-005` | `02B`,`09B~12B` | deterministic 14 TXN /19 race /replay /no-write /no-repair reports | P0 blocker | `not_executed` |
| `DEL-SBX-AUTO-001` | `02D`,`14A` | 5 gate scripts参数、context、role顺序、failure /blocked raw | gate blocker | `not_executed` |
| `DEL-SBX-AUTO-002` | `02D`,`14B~14C` | 3 report scripts只消费fixed raw;缺raw /schema非0;draft-only | evidence / handoff blocker | `not_executed` |
| `DEL-SBX-AUTO-003` | `02D`,`12A~14B` | 9 check scripts入口、safe finding、deny fixture、nonzero semantics | evidence integrity blocker | `not_executed` |
| `DEL-SBX-EVD-001` | `02C`,`14B` | 九schema、canonical bytes、self-digest、path /status negative fixture | evidence blocker | `not_executed` |
| `DEL-SBX-EVD-002` | `12B~14B` | 21 slot producer catalog、mapping与EV allocation denial | evidence blocker | `not_executed` |
| `DEL-SBX-EVD-003` | `02C`,`12B~14B` | fixed-run context / suite report.json /stdout /stderr pair,失败run保留 | evidence blocker | `not_executed` |
| `DEL-SBX-EVD-004` | `14B` | summary /suite /gate /index /integrity reports从same-run raw生成并回链 | evidence blocker | `not_executed` |
| `DEL-SBX-EVD-005` | `14C` | 四份acceptance draft与两review入口;generator无裁决 /签署字段 | handoff blocker | `not_executed` |

### 2.3 Design Handoff: 3项

| 交付物ID | 形成时机 | 完成证据 | 未完成路由 | 当前事实 |
|---|---|---|---|---|
| `DEL-SBX-DOC-001` | Step 13 | 正式`07`由Step 1~12已审查产物装配并通过一致性审计 | HDO blocker | `missing_until_step_13` |
| `DEL-SBX-DOC-002` | Step 13 | implementation ledger字段完整、32 boundary行、开放blocker诚实 | HDO blocker | `missing_until_step_13` |
| `DEL-SBX-DOC-003` | Step 13 | 32 /32 skeleton,只有一个current candidate,无泛化TBD /伪pass | HDO blocker | `missing_until_step_13` |

计数结论:

```text
deliverables_total = 39
code_config_adapter_data = 23
test_automation_evidence = 13
design_handoff = 3
runtime_completed = 0_of_36
design_handoff_completed = 0_of_3
completion_status = not_executed
```

---

## 3. Boundary、Phase与P0完成分母

| 分母 | 完成标准 | 允许缺口 | 当前事实 |
|---|---|---|---|
| 32 boundary | 每项Activation / Design / Scope / Worktree / Build / Test / Evidence / Commit / Handoff Gate有真实记录,真实hash已回写 | 0 | `0_of_32` |
| 14 phase | 所属boundary全完成,phase gate与后序依赖检查通过 | 0 | `0_of_14` |
| 237 P0-C | MAIN-CONTRACT、MAIN-SEAM、OPS固定source下全部Passed且未失效 | 0 | `not_run` |
| 13 P0-Q | 单一P05 /ENV-05 packet下全部Passed且identity /redaction /cleanup /pairing完整 | 0 | `not_run` |
| 4 conditional | 激活时按正式条件执行;未激活为`NotRunConditional` | 可不激活,但不得补P0 | `not_run` |
| 16 suite | 适用suite有fixed status和paired report;mandatory不得Blocked /missing | 仅正式conditional可NotRunConditional | `not_run` |
| 7 gate | 正确source、顺序、identity、digest与阻断语义完整 | 0 for applicable gate | `not_run` |
| 17 VETO | 全部可判定且`NotTriggered`才支持normal completion | 0 Blocked /Disputed /NotEvaluated | `17_not_evaluated` |

实现完成候选要求250项P0全部有效。P0-C与P0-Q正交,任何一轴缺失都不能由另一轴、conditional、targeted run、fake或人工说明补偿。

---

## 4. Canonical交付证据包

### 4.1 Fixed run包

| 交付项 | 固定路径 | 完成标准 | 禁止替代 | 当前事实 |
|---|---|---|---|---|
| raw root | `artifacts/test/<run_id>` | context、suite /check raw、digest、status和失败材料完整 | `latest`;空run;静态fixture冒充source | `absent` |
| summary | `reports/runs/<run_id>/summary.md` | same-run raw回链、scope /suite /missing /status可读 | 手写“全部通过” | `absent` |
| gate result | `reports/runs/<run_id>/gate-results.md` | gate、source identity、原始Failed /Blocked /conditional状态 | `gate-summary.md` | `absent` |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 21 slot适用性、raw /report /digest /status回链 | 静态EV表 | `absent` |
| redaction | `reports/runs/<run_id>/redaction-check.md` | artifact /report /acceptance /review roots扫描及finding | “已脱敏”自由文本 | `absent` |
| dependency | `reports/runs/<run_id>/dependency-boundary.md` | only-core compile、模块 /entry /trait边界 | manifest肉眼说明 | `absent` |
| report audit | `reports/runs/<run_id>/report-audit.md` | raw/report pairing、no-static、status fidelity、link /path审计 | generator自证pass | `absent` |

### 4.2 Acceptance与review包

| 交付项 | 固定路径 | 实现送验前要求 | 正式验收前附加要求 | 当前事实 |
|---|---|---|---|---|
| handoff | `reports/acceptance/handoff.md` | draft绑定fixed RELEASE /四source、范围、缺口和交付identity | independent review完成;最终三值只写受控section | `absent` |
| VETO | `reports/acceptance/veto-checklist.md` | 17项有evidence ref,不预填NotTriggered | 所有项最终可判定,无Blocked /Disputed /NotEvaluated | `absent` |
| risk | `reports/acceptance/risk-acceptance.md` | catalog /candidate /disclosure完整,无伪Accepted | 有条件路径逐项由真实authority Accepted且未过期 | `absent` |
| issues | `reports/acceptance/open-issues.md` | defect /blocker /invalidation /residual全量对账 | open S /A=0;B仅合格Accepted时可留 | `absent` |
| human review | `reports/review/reviewer-notes.md` | 实际review identity /version /finding /dispute | 与same RELEASE /四source digest一致 | `absent` |
| Agent review | `reports/review/agent-review.md` | 独立Agent review,不能由generator自审 | finding已处置或保留Disputed阻断 | `absent` |

禁止创建或消费`final-decision.md`、`acceptance-summary.md`、`gate-summary.md`和`latest`。不存在fixed raw /report pair时不得分配真实`EV-SBX-*` alias。

---

## 5. 15个Spike完成前处置

Spike关闭只能是有真实closure record的`supports_planned_design`、`requires_design_writeback`或`dependency_wait`。后者写台账时必须映射`blocked / handoff`,不是完成。

| Spike集合 | 主题 | 最迟关闭点 | 允许完成终态 | 未关闭影响 | 当前事实 |
|---|---|---|---|---|---|
| `SP-SBX-IMP-001~002` | workspace /core carrier兼容 | `01A` /`02A`前 | reviewed closure或正式上游回写 | 阻塞01A /02A | `not_executed` |
| `SP-SBX-IMP-003~004` | RFC 8785 /Shell规则 | `02C` /`02D`前 | 选择记录 + fixture;或dependency blocker | 阻塞02C /02D及14A~B | `not_executed` |
| `SP-SBX-IMP-005~006` | config assembly /exact ref source | `03A~04B`前 | closure checklist或design writeback | 阻塞受影响runtime slice | `not_executed` |
| `SP-SBX-IMP-007~008` | fake parity /safety race | 首次adapter;`08B`,最迟`12B` | parity /schedule record通过 | 阻塞对应boundary /12B | `not_executed` |
| `SP-SBX-IMP-009~011` | Query /Consumer-Event /Job source闭环 | `09A`,`10A~B`,`11A~C`前 | 逐族source matrix通过 | 阻塞对应boundary | `not_executed` |
| `SP-SBX-IMP-012` | P0-C source role | `12B` Evidence Gate前 | role identity /negative fixture通过 | 阻塞P0-C source能力 | `not_executed` |
| `SP-SBX-IMP-013~014` | P0-Q packet /probe disposition | `13A` /`13B`前 | immutable packet /disposition closure;依赖缺失则Blocked | 阻塞P0-Q | `not_executed` |
| `SP-SBX-IMP-015` | no-static /report generation | `14A`前,最迟`14C` | generation audit通过或design writeback | 阻塞evidence /handoff | `not_executed` |

完成判定前15 /15必须有终态记录。`dependency_wait`仍是未完成blocker,不能因Spike“已执行并确认依赖缺失”而宣称本轮实现完成。

---

## 6. 20个Risk完成前处置

| Risk集合 | 完成前要求 | 是否可risk acceptance | 未满足时 | 当前事实 |
|---|---|---|---|---|
| `R-SBX-IMP-001~003` HDO /repo /baseline /design drift | 前置关闭,32 boundary均按fixed baseline执行 | 否 | blocker /DesignReopen | `open_design_register` |
| `R-SBX-IMP-004` dependency /scope contamination | dependency /scope audit无命中 | 否;VETO面 | blocker /不通过依据 | `open_design_register` |
| `R-SBX-IMP-005~007` fake /config /identity-boundary-policy | parity、same-generation、coherent boundary和0-launch成立 | 否;P0 /VETO面 | blocker /修复复验 | `open_design_register` |
| `R-SBX-IMP-008~014` redaction /truth layering /second writer /replay /candidate /source /static evidence | 全部对应checks、P0和VETO未触发 | 否 | blocker;S /A /VETO路径 | `open_design_register` |
| `R-SBX-IMP-015` capability误述执行完成 | delivery /handoff清晰区分capability与runtime fact | 否,属于真实性前置 | 不可送验 | `open_design_register` |
| `R-SBX-IMP-016` P06 /P07 future scope | P06 inactive时conditional披露;P07请求DesignReopen | 仅scope disclosure,不是当前Accepted risk | 不影响P0或阻塞新scope | `open_design_register` |
| `R-SBX-IMP-017` physical retention /soak /fleet /alert /rollout | 当前claim内有正式前置;非当前scope时转合规DisclosureOnly /RR | 仅非P0且正式资格满足时 | blocker或DisclosureOnly | `open_design_register` |
| `R-SBX-IMP-018` risk acceptance滥用 | S /A、VETO、P0、evidence缺口均不进入Accepted | 否 | blocker /record invalid | `open_design_register` |
| `R-SBX-IMP-019` identity变更沿用旧结果 | invalidation /supersede和新run完整 | 否 | 旧结果不可消费 | `open_design_register` |
| `R-SBX-IMP-020` historical污染 | required reads /scope review无污染 | 否 | Design /Scope Gate失败 | `open_design_register` |

20 /20风险在完成判定时必须是以下之一:

- trigger已消除且真实gate记录支持`Closed`。
- 已转换为正式defect / VETO / blocker / DesignReopen并按该路径关闭;若仍open则不完成。
- 非P0 residual进入正式`06`资格审查,实际`Accepted`且未过期;只支持有条件路径。
- 不在frozen claim的future项形成`DisclosureOnly / NotApplicableByScope`,有正式scope依据和reopen trigger;不制造有条件结论。

---

## 7. 18个Open Question完成前处置

| OQ集合 | 关闭证据 /安全终态 | 最迟点 | 未关闭时 | 当前事实 |
|---|---|---|---|---|
| `OQ-SBX-IMP-001~003` | design commit /HDO、repo bootstrap、edition /core compatibility真实decision ref | `01A`前 | blocker | `open` |
| `OQ-SBX-IMP-004~005` | RFC 8785和Shell工具 /规则选择、fixture、owner | `02C` /`02D`前 | blocker | `open` |
| `OQ-SBX-IMP-006~009` | candidate、四维template、provider /material、authorized lab immutable identity | `13A` /`13B`前 | P0-Q Blocked +0 probe | `open` |
| `OQ-SBX-IMP-010~011` | CI binding、source invocation authority、真实run identity | source execution前 | source不运行;不可送验 | `open` |
| `OQ-SBX-IMP-012` | reviewer /acceptor /signer实际identity与authority source | FormalEntry /DecisionReady前 | draft未reviewed;不裁决 | `open` |
| `OQ-SBX-IMP-013` | retention carrier /authority;或当前scope的DisclosureOnly记录 | 相关release前 | blocker或proof-ceiling披露 | `open` |
| `OQ-SBX-IMP-014` | P06 formal activation;未激活保持`NotRunConditional` | P1 gate前 | 不补P0 | `open_future_conditional` |
| `OQ-SBX-IMP-015` | P07正式scope change和重建`00~07`;否则activation reject | 任一P07声明前 | DesignReopen | `open_future_scope` |
| `OQ-SBX-IMP-016` | real store /bus /target /scheduler /sink binding;或current scope保持opaque seam | real-like claim前 | 不阻P0-C,不得加compile dependency | `open_future_scope` |
| `OQ-SBX-IMP-017` | topology /workload /threshold /route /runbook;或current DisclosureOnly | production /P06+ claim前 | future blocker | `open_future_scope` |
| `OQ-SBX-IMP-018` | Step 13 32 skeleton逐项写入完整SP /R /OQ ref | HDO前 | HDO blocker | `open_until_step_13` |

OQ关闭必须记录decision owner、真实decision ref、适用baseline、受影响boundary和invalidating trigger。口头确认、placeholder ADR、planned issue或空签名不构成关闭。

---

## 8. 未完成项唯一处置表

| 未完成类型 | 唯一路由 | 是否允许“实现完成 /可送验” | 对验收三值的影响 |
|---|---|---|---|
| 任一39项mandatory交付物缺失 | blocker;补交付并重跑门禁 | 否 | 保持NotEntered /EntryBlocked |
| 任一boundary未完成或无真实hash /ledger回写 | blocker;恢复current boundary | 否 | 不进入验收 |
| P0-C /P0-Q Failed | defect /修复 /新run;必要时VETO /S路径 | 否 | 可形成不通过依据,但不能用缺失伪造不通过 |
| P0-C /P0-Q Blocked /missing /InfraFailed | execution blocker;补前置 /新run | 否 | 不可裁决 |
| conditional未激活 | `NotRunConditional` + scope依据 | 是,前提是不补P0且不在frozen claim | 不自动降为有条件通过 |
| VETO Triggered | S /terminal或修复复验;不可接受 | 否 | 只能不通过候选 |
| VETO Blocked /Disputed /NotEvaluated | 补证据 /关闭争议 | 否 | 不可裁决 |
| open S /A | 修复、复验并关闭 | 否 | 通过 /有条件通过均禁止 |
| open B | 修复;或按正式`06`实际Accepted | 仅Accepted且其余硬门禁通过时有条件可送验 | 最多有条件通过 |
| 非P0 residual | `DisclosureOnly`、延期WorkItem或正式Accepted | 视资格;不得隐藏 | 只有Accepted可能支持有条件通过 |
| Spike无closure | 执行 /取消 /design writeback /dependency blocker | 否,若影响当前scope | 未完成前不送验 |
| OQ过截止未决 | 执行其默认安全处置 | 通常否;future scope可DisclosureOnly | 不得从实现便利推断答案 |
| 字段 /DTO /state /phase conflict | DesignReopen;回写owner并新baseline | 否 | 旧packet失效 |
| raw存在但report缺失 /不配对 | 生成合法same-run report或重跑producer | 否 | evidence维度不可裁决 |
| review缺失 | 真实独立review | 否 | 不得DecisionReady |
| risk record仅Proposed /Pending /Expired | 继续评估、拒绝 /关闭或重新接受 | 否 | 不支持有条件路径 |

禁止使用“基本完成”“原则上完成”“主要功能完成”。实施层只允许`boundary_completed`、`implementation_complete_handoff_ready`或`implementation_incomplete`等精确状态;正式验收仍只允许`通过 /有条件通过 /不通过`。

---

## 9. 最终交付包停审

| 审计项 | 设计判定 | runtime结论 |
|---|---|---|
| 39交付物是否逐项有owner /证据 /失败路由 | `passed_design:39_of_39` | `not_executed` |
| 32 boundary是否要求九类Gate与真实hash | `passed_design:32_of_32` | `0_of_32` |
| 250 P0是否无补偿窗口 | `passed_design` | `not_run` |
| 17 VETO是否全量进入完成条件 | `passed_design:17_of_17` | `17_not_evaluated` |
| raw / report固定路径是否唯一 | `passed_design` | `absent` |
| acceptance / review分权是否完整 | `passed_design` | `absent` |
| 15 /20 /18集合是否有逐类关闭路由 | `passed_design` | `not_executed / open` |
| 是否允许S /A、P0、VETO、evidence缺口风险接受 | 否 | 不适用 |
| 是否预填run、EV、review、Accepted risk、verdict或signature | 否 | 无 |

本分件已完成并随Step 12主件停审。未经用户确认不得进入Step 13。
