# L4-sandbox 验收Step 12 缺陷、复验与放行停审登记

> 主件: `06_acceptance_step_12_defects_retest_release.md`
> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 创建日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_13
> 审查性质: design stop-review;不创建实际defect、run、review、risk acceptance或release decision

---

## 1. 审查范围与结论口径

本分件验证Step 12设计能否完整承接正式`05`与Step 4 /10 /11。表中的“通过（设计）”只表示规则可执行、追溯无孤儿,不表示测试通过、缺陷为0、复验完成或允许放行。

| 审查集合 | 期望闭集 | 设计门禁 |
|---|---:|---|
| 缺陷等级 | 3 | 只允许S / A / B,无R或ResidualTracked第四等级 |
| VETO到S传播 | 17 | 每个`VETO-SBX-*` Triggered都必须为S且L-R5 |
| suite / check归因 | 16 suite +关键check族 | 默认A / B / Blocked与升S条件明确 |
| 复验选择 | 14 DRT + L-R1~L-R5 | 修复面有出口,scope只升级 |
| 关闭材料 | 11 DCL | S / A / B所需材料与禁止risk acceptance明确 |
| 放行传播 | 12 DRL | entry / pause / resume /三值候选与Step 4一致 |

---

## 2. 等级、状态与归因分离停审

| 审计项 | 设计结论 | 缺口 /修正 |
|---|---|---|
| 正式等级是否只含S / A / B | 通过 | 排除L1参考的R级;ResidualTracked只留Step 13 |
| Failed是否自动等于缺陷 | 否 | 先执行DTR-001~006归因 |
| Blocked是否创建产品缺陷 | 否 | 保持execution blocker / gate Blocked |
| InfraFailed是否等于产品A | 否 | 先归test-infra;P0相关以A阻断,有效产品断言仍需新run |
| NotRunConditional是否缺陷 | 否 | 保持conditional residual /激活trigger |
| VETO Blocked是否等于S | 否 | 只有有效Triggered才按DTR-007为S |
| DesignReopen是否第四等级 | 否 | 回写owner设计并暂停相关范围 |
| B accepted是否缺陷Closed | 否 | 原缺陷 /问题与Step 13风险记录分别保留 |
| RetestPassed是否自动Closed | 否 | DCL-001~010适用材料完整后才可关闭 |
| 同一root cause是否可重复建缺陷 | 否 | DTR-010固定primary defect + affected findings |

---

## 3. VETO-SBX-001~017到S级停审

| VETO | S级映射 | primary containment /阻断 | 最低复验 | 设计结论 |
|---|---|---|---|---|
| 001 | S;核心闭环 /轴替代 | 阻断RELEASE与正式success | L-R5 +核心五节点全链 | 通过（设计） |
| 002 | S;非法carrier冒充formal | 停止新launch,保留identity / preflight | L-R5 +CMD / CFG / CONF / identity | 通过（设计） |
| 003 | S;四维partial boundary | containment,P0-Q / RELEASE失败 | L-R5 +四维CONF / boundary / P0Q | 通过（设计） |
| 004 | S;policy fail-open | 阻断launch /高风险动作 | L-R5 +policy / ERR / CFG / CONF | 通过（设计） |
| 005 | S;truth ownership /领域编排越界 | 停止越界writer /设计;必要时DesignReopen | L-R5 +contract / protocol / scope / dependency | 通过（设计） |
| 006 | S;raw / sensitive leak | 隔离材料,保持扫描与调查现场 | L-R5 +全carrier redaction / provider适用P0Q | 通过（设计） |
| 007 | S;partial / mixed generation | 阻断startup / activation,发布0 handle | L-R5 +CFG / builder / pairing | 通过（设计） |
| 008 | S;unsupported / compatibility安全削弱 | strict reject或DesignReopen | L-R5 +CFG / ARCH / scope-absence | 通过（设计） |
| 009 | S;material升格下游truth | 阻断handoff结论,保留owner / receipt材料 | L-R5 +CMD / CNS / JOB / write-audit | 通过（设计） |
| 010 | S;formal audit /trace断裂 | 相关accepted result失效,阻断DecisionReady | L-R5 +audit / UoW / evidence pairing | 通过（设计） |
| 011 | S;failure回滚source /重建payload | 保留source truth / stored payload,阻断relay结论 | L-R5 +CNS / EVT / JOB / relay race | 通过（设计） |
| 012 | S;second writer /第二语义 | 阻断query / job / reconciliation entry | L-R5 +QRY / JOB / write-audit / protocol | 通过（设计） |
| 013 | S;duplicate / stored result重算 | 阻断owner副作用,保留replay材料 | L-R5 +TXN / CNS / JOB / RACE | 通过（设计） |
| 014 | S;cleanup先删 /绕guard | 停止delete / release,保持证据hold | L-R5 +cleanup / blocked / OPS / P0Q | 通过（设计） |
| 015 | S;lease / orphan / redline脱管 | 停止新use / release,保持containment | L-R5 +lifecycle / cleanup / P0Q | 通过（设计） |
| 016 | S;非法dependency /模块方向 | 阻断build / PR / MAIN | L-R5 +dependency graph / ARCH / scope | 通过（设计） |
| 017 | S;静态造证 /状态篡改 | 保留全部证据现场,阻断RELEASE /DecisionReady | L-R5 +全部受影响producer / VC / review | 通过（设计） |

计数:17 /17。普通evidence missing、scanner故障或graph缺失只保持Blocked / test-infra issue,不自动映射上表的S。

---

## 4. Suite与check归因 /升级覆盖

| Suite / check | 默认失败归因 /等级 | 升S条件 | DRT出口 | 设计结论 |
|---|---|---|---|---|
| SUITE-001 carrier-contract | product / test-infra A | body / ref越界或metadata缺失仍进入formal | DRT-001 /009 | 通过（设计） |
| SUITE-002 state-invariants | product A | terminal重开、hard guard绕过、非法truth | DRT-002 /007 | 通过（设计） |
| SUITE-003 config-security-static | product / tool A | redaction / dependency、partial generation、forbidden override成功 | DRT-008 /009 /014 | 通过（设计） |
| SUITE-004 command-query-service | product A | host / policy bypass、query write、owner truth污染 | DRT-003 | 通过（设计） |
| SUITE-005 consumer-event-relay | product A | unsafe body、duplicate二写、failure回滚source | DRT-004 /006 | 通过（设计） |
| SUITE-006 job-maintenance | product A | report伪成功、job修truth、duplicate副作用 | DRT-005 /006 | 通过（设计） |
| SUITE-007 transaction-replay | product A | partial visibility、commit unknown盲重试、result重算 | DRT-003~006 | 通过（设计） |
| SUITE-008 adapter-parity | product / harness A | fake吞hard failure并让错误P0语义通过 | DRT-006 /008 | 通过（设计） |
| SUITE-009 deterministic-race | product / scheduler A | 双winner、半状态、cleanup / redline误release | DRT-006 /007 /010 | 通过（设计） |
| SUITE-010 error-recovery | product A | fail-open、raw error leak、recovery重写truth | DRT-002 /003 /009 | 通过（设计） |
| SUITE-011 protocol-inventory | product / tool A | 缺协议被伪完整或旁路formal contract | DRT-001 /013 | 通过（设计） |
| SUITE-012 operations-simulation | product A | cleanup先删、redline释放、maintenance修truth | DRT-005 /007 /010 | 通过（设计） |
| SUITE-013 backend-conformance | 当前Blocked,无默认产品等级 | 合法packet下真实越界、weak fallback、anti-leak、cleanup失败 | DRT-009~011 | 通过（设计） |
| SUITE-014 structural-boundedness | product A | 进一步破坏核心闭环 /安全guard | DRT-012 | 通过（设计） |
| SUITE-015 conditional-real-like | B或NotRunConditional | 结果冒充P0 /静态伪验证 | DRT-008 /012 /013 | 通过（设计） |
| SUITE-016 future-scope-absence | A或DesignReopen | unsupported静默成功 /领域越界 /绕重开实现 | DRT-008 /014 | 通过（设计） |
| redaction / dependency / no-static | finding确认红线时S;工具故障先test-infra A / Blocked | 泄漏、非法edge、造证 /篡改被有效确认 | DRT-009 /013 /014 | 通过（设计） |
| TC / protocol / pairing / identity / blocked checks | 默认A / Blocked按归因 | 故意伪完整、替换identity或吞Blocked | DRT-001 /011 /013 | 通过（设计） |
| cleanup disposition check | 默认A / Blocked按归因 | guard绕过、提前release /删证据、伪disposition | DRT-010 /011 /013 | 通过（设计） |

16 suite和关键check族均有归因、升S和复验出口。Gate总状态不能代替首个失败finding与root-cause归因。

---

## 5. 复验层级与变更面停审

| 审计项 | 设计结论 | 依据 |
|---|---|---|
| L-R1~L-R5是否连续且效力上限明确 | 通过 | 主件§10.1 |
| S / VETO是否至少L-R5 | 是 | 主件§7 /§8 /DRL-003 |
| A是否至少原TC + family + suite | 是 | 主件§7;L-R1单独不足 |
| B修复是否仍需受影响验证 | 是 | DRT适用集合;不能只改状态 |
| scope是否按多变更取并集 | 是 | 主件§10.1只升级 |
| P0-Q identity变化是否0 case复用 | 是 | 主件§10.3 |
| raw兼容的report修复能否局部复验 | 可以 | DRT-013 + DRL-005;仍需pairing / no-static / review |
| raw缺失时能否手写report补证 | 否 | 必须重跑producer |
| 新public / config / domain surface能否直接加测试 | 否 | DRT-014先DesignReopen |
| tools / runtime / member领域语义是否进入Sandbox复验 | 否 | 只验证shared seam;越界归VETO-005 / DesignReopen |

### 5.1 DRT覆盖反查

| DRT范围 | 覆盖主题 | 孤儿检查 |
|---|---|---|
| 001~002 | carrier / protocol / state / error | 无 |
| 003~005 | command / query / consumer / event / job | 无 |
| 006~007 | UoW / replay / race / lifecycle | 无 |
| 008~010 | config / sensitive / cleanup / redline | 无 |
| 011~012 | candidate /四维 /boundedness | 无 |
| 013~014 | report / evidence / dependency / scope | 无 |

---

## 6. 关闭材料与evidence失效停审

| 审查项 | S | A | B | 设计结论 |
|---|---:|---:|---:|---|
| first failed fixed run / raw / report保留 | 必需 | 必需 | 有执行失败时必需 | 通过（设计） |
| attribution / severity / formal refs | 必需 | 必需 | 适用 | 通过（设计） |
| containment / resource disposition | 相关必需 | 相关必需 | 相关必需 | 通过（设计） |
| fix / writeback ref | 必需 | 必需 | 修复时必需 | 通过（设计） |
| DRT / RT selection与new identity | 必需 | 必需 | 修复时必需 | 通过（设计） |
| new run必跑集合 | 必需 | 必需 | 修复时必需 | 通过（设计） |
| validation checks | 相关必需 | 相关必需 | 相关必需 | 通过（设计） |
| invalidated / superseded链 | 必需 | 必需 | 影响旧证据时必需 | 通过（设计） |
| automation / prevention说明 | 必需 | 必需 | 适用 | 通过（设计） |
| independent review / acceptance packet对账 | 必需 | 必需 | 影响验收时必需 | 通过（设计） |
| risk acceptance作为关闭材料 | 禁止 | 禁止 | 只可另建Step 13记录 | 通过（设计） |

| Evidence变化 | 原材料处理 | 验收消费 | 设计结论 |
|---|---|---|---|
| 产品 / contract / UoW变化 | immutable historical | 受影响Passed / EV失效,等待新run | 通过（设计） |
| harness / assertion变化 | 原raw保留归因 | 旧结果不证明新harness | 通过（设计） |
| scanner / redaction变化 | digest有效raw可重扫 | 旧redaction结论失效 | 通过（设计） |
| report generator变化 | compatible raw保留 | derived report / index重生成并复审 | 通过（设计） |
| generation / profile / P0Q identity变化 | 旧packet保留 | 禁止拼接,完整新packet | 通过（设计） |
| defect重开 / VETO新finding | 原closure / evidence保留 | 相关EV invalidated / superseded,触发Paused | 通过（设计） |

---

## 7. Entry、Pause、Resume与结论候选一致性

| 场景 | Step 4契约 | Step 12传播 | 设计结论 |
|---|---|---|---|
| entry前open S / A | AENT-010不满足 | DRL-001 EntryBlocked;不得risk accept | 一致 |
| entry前P0 / evidence blocker | AENT-005~012不满足 | DRL-011,不制造产品缺陷 | 一致 |
| review中新S / A / VETO | APAUSE-005 | DRL-002立即Paused;修复或不通过 | 一致 |
| defect重开 / evidence invalidation | APAUSE-006 | DCL / evidence失效 + DRL-002 | 一致 |
| raw不变的derived report修复 | Step 4允许局部resume | DRL-005复查pairing / review后恢复 | 一致 |
| subject / source / P0 run变化 | Step 4要求新batch /全量AENT | DRL-004新RELEASE,禁止局部resume | 一致 |
| confirmed VETO / S不修复 | AEXT-016 terminal route | DRL-003 /012只能不通过 | 一致 |
| open B未接受 | AEXT-009 /015不满足 | DRL-007不支持放行 | 一致 |
| open B合法接受 | AEXT-009 /015可能满足 | DRL-008 /010最多有条件通过候选 | 一致 |
| 0 open defect且无风险 | AEXT-015可能满足 | DRL-009通过候选 | 一致 |
| terminal剩余未评估 | AEXT-016逐项披露 | DRL-012禁止Passed / N/A | 一致 |

---

## 8. 放行与风险边界停审

| 审计项 | 结论 | 说明 |
|---|---|---|
| open S能否支持有条件通过 | 否 | VETO / S不可接受 |
| open A能否支持有条件通过 | 否 | L4正式`05`与AENT / AEXT要求open A=0 |
| B是否可由本Step直接接受 | 否 | 只输出Step 13候选资格 |
| accepted B是否改变P0状态 | 否 | 最多形成有条件通过候选 |
| execution blocker是否可风险接受 | 否 | 保持Blocked / NotEntered |
| evidence missing / Disputed是否可接受 | 否 | 保持Paused / DecisionReady否 |
| P1 / P2结果是否可补偿P0 | 否 | claim独立且conditional不可替代 |
| 无硬阈值sample是否强制建缺陷 | 否 | 记录trend / residual;阈值形成后重开 |
| terminal不通过是否等于下一阶段放行 | 否 | Step 14另定disposition |
| 通过候选是否自动通过 | 否 | Step 14必须计算唯一结论并签署 |

---

## 9. 跨缺陷 /复验 /放行审计

| Audit ID | 审计问题 | 设计结论 | 缺口 /修正 |
|---|---|---|---|
| `DRA-SBX-001` | S / A / B是否唯一三等级 | 通过 | 无 |
| `DRA-SBX-002` | 测试状态是否与severity分离 | 通过 | 无 |
| `DRA-SBX-003` | attribution是否先于分级 | 通过 | DTR-001~006 |
| `DRA-SBX-004` | 17个VETO是否全映射S | 通过;17 /17 | 无 |
| `DRA-SBX-005` | VETO Blocked是否误建S | 否 | Triggered才S |
| `DRA-SBX-006` | 16 suite是否都有归因 /升级 /复验出口 | 通过;16 /16 | 无 |
| `DRA-SBX-007` | validation checks是否区分工具故障与红线finding | 通过 | 无 |
| `DRA-SBX-008` | 同一root cause是否重复建缺陷 | 否 | DTR-010 |
| `DRA-SBX-009` | L-R1是否被误作S / A关闭充分条件 | 否 | 只能局部证明 |
| `DRA-SBX-010` | P0-Q packet是否允许拼旧case | 否 | 0旧case复用 |
| `DRA-SBX-011` | 14个DRT是否覆盖全部专项 | 通过;14 /14 | 无 |
| `DRA-SBX-012` | 11个DCL是否覆盖关闭与风险禁止 | 通过;11 /11 | 无 |
| `DRA-SBX-013` | 证据失效是否保留immutable历史 | 是 | 无 |
| `DRA-SBX-014` | 绿色重跑是否覆盖原失败 | 否 | 无根因 /防回归不得关闭 |
| `DRA-SBX-015` | open S / A是否可risk accept | 否 | 无 |
| `DRA-SBX-016` | B是否只能进入Step 13候选 | 是 | 无实际接受 |
| `DRA-SBX-017` | 12个DRL是否与AENT / APAUSE / AEXT一致 | 通过;12 /12 | 无 |
| `DRA-SBX-018` | 三值候选是否越权形成最终结论 | 否 | 留Step 14 |
| `DRA-SBX-019` | terminal route是否诚实披露未评估项 | 是 | 0伪Passed / N/A |
| `DRA-SBX-020` | tools / runtime / member领域缺陷是否混入Sandbox | 否 | 只裁shared seam /越界 |
| `DRA-SBX-021` | 当前是否伪造defect / run / EV /review /acceptance | 否 | 全部不存在 |
| `DRA-SBX-022` | 是否修改正式`06`或创建Step 13 /07产物 | 否 | 保持Step边界 |

跨缺陷、复验与放行审计未发现unresolved设计冲突。

---

## 10. 当前停审结论与下一步门禁

| 条件 | 当前设计状态 | 说明 |
|---|---|---|
| 缺陷对结论的影响可判定 | 通过（设计） | S / A / B与三值候选明确 |
| 缺陷规则与VETO一致 | 通过（设计） | 17 /17 Triggered -> S -> L-R5 |
| 复验和关闭材料固定 | 通过（设计） | L-R1~L-R5、14 DRT、11 DCL |
| 放行 /暂停传播固定 | 通过（设计） | 12 DRL与Step 4一致 |
| 当前实际缺陷 /复验是否存在 | 否 | 不得宣称0缺陷或已关闭 |
| 是否可自动进入Step 13 | 否 | 必须先由用户审查并明确确认Step 12 |

```text
review_register_status = completed_reviewed_passed_to_step_13
formal_severity_count = 3
veto_to_s_review = 17_of_17
suite_review = 16_of_16
drt_review = 14_of_14
dcl_review = 11_of_11
drl_review = 12_of_12
cross_audit = 22_of_22
runtime_defect_created = no
runtime_retest_executed = no
upstream_blocker_for_step_12 = none
formal_06_modified = no
step_13_created = no
implementation_artifacts_created = no
commit_required = no
next_allowed_action = 用户已确认;由Step 13接续风险接受与遗留项
```
