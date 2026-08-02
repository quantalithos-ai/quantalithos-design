# L4-sandbox 验收标准 Step 12 缺陷分级、复验与放行规则

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 书写规范: `standards/document/验收标准书写规范.md` §5.12
> 回填章节: `projects/L4-sandbox/06-验收标准.md` §12
> 创建日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_13
> 当前成熟度: design_only;未执行验收,未创建缺陷、复验run、风险接受或放行结论
> 配套分件: `06_acceptance_step_12_defect_retest_review_register.md`

---

## 1. Step状态与输入审计

| 项目 | 当前结论 |
|---|---|
| 用户是否确认Step 11并允许进入Step 12 | 是。Step 11三件产物均为`completed_reviewed_passed_to_step_12`。 |
| 是否读取当前标准 | 是。已读取验收SOP Step 12、书写规范§5.12、中间产物规范和真相源闭环 /可落码性标准。 |
| 是否读取正式上游 | 是。已读取正式`05`§11 /§12 /§14,重点核对S / A / B、L-R1~L-R5、证据失效、250条P0和RR-SBX-001~008。 |
| 是否读取当前验收输入 | 是。已读取Step 4进入 /暂停 /退出、Step 10 evidence / report、Step 11 VETO主件及分件。 |
| 是否读取粒度参考 | 是。已读取L1-governance与L1-artifact Step 12;只参考结构,未继承其S/A/B/R或“A可接受”口径。 |
| 旧正式`06`如何处理 | historical_material。旧S / A / B泛化描述、“A视情况”、空checkbox、缺陷实例和签署占位均不继承。 |
| 是否发现上游冲突 | 未发现阻塞本Step的冲突。L1参考与L4正式`05`的等级 /接受边界不同,已以L4正式上游为准。 |
| 正式`06`是否修改 | 否。正式文档只能在Step 15装配。 |

---

## 2. 本步目标与职责边界

本Step完成以下事项:

1. 固定验收层只使用`S / A / B`三种缺陷等级,并与测试状态、问题归因、验收过程状态和风险处置状态分离。
2. 固定17个`VETO-SBX-*`一经有效命中必为S级,且任何S / A都不能通过风险接受计入P0退出或放行。
3. 固定首个失败保存、归因、升级、containment、复验选择、证据失效、关闭材料和缺陷重开规则。
4. 复用正式`05`的`L-R1~L-R5`和`RT-SBX-019`,把修复范围转成验收可审查的selection、new fixed run和supersede链。
5. 固定缺陷对`NotEntered / EntryBlocked / InReview / Paused / DecisionReady`以及“通过 /有条件通过 /不通过”的传播。

本Step不执行以下事项:

- 不运行测试、复验或验收,不创建`run_id`、runtime EV、defect ref、commit、review或结论。
- 不绑定具体缺陷系统或发明缺陷ID格式;`reports/acceptance/open-issues.md`只是验收视图,不是缺陷真相源。
- 不把`Blocked / InfraFailed / NotRunConditional / DesignReopen / ResidualTracked`制造成第四种缺陷等级。
- 不在本Step接受B级风险;只判定其是否具备进入Step 13候选的资格。
- 不定义Step 13实际接受人 /截止时间实例,也不定义Step 14最终聚合与签署。
- 不把tools semantic execution、runtime agent loop或member lifecycle缺陷转移给Sandbox;只裁其接缝与越界。

---

## 3. 五层词汇与唯一语义

| 层级 | 允许词汇 | 唯一含义 | 不得替代 |
|---|---|---|---|
| 测试 / check状态 | `Passed / Failed / Blocked / InfraFailed / NotRunConditional` | 固定run中断言或执行前置的事实 | 不能直接当S / A / B |
| 问题归因 | product / contract;test-infra;DesignReopen;execution-blocker;conditional residual | 决定问题进入缺陷、上游回写、前置关闭或残余风险哪条路径 | 不能当缺陷等级 |
| 缺陷等级 | `S / A / B` | 已归因为产品 /契约或测试基础设施问题后的严重度 | 只允许三值闭集 |
| 验收过程状态 | `NotEntered / EntryBlocked / InReview / Paused / DecisionReady / Closed` | Step 4定义的验收批次位置 | 不能改写测试或缺陷状态 |
| VETO disposition | `NotEvaluated / Blocked / NotTriggered / Triggered / Disputed` | Step 11 checklist逐否决项判断 | `Triggered`才形成S级硬红线依据 |

`ResidualTracked`、`Accepted`、`Rejected`或condition expiry属于Step 13风险处置,不是缺陷等级。`RetestPassed`只表示复验阶段结果,也不自动等于缺陷`Closed`或验收通过。

---

## 4. SOP五问回答

| SOP问题 | L4-sandbox回答 |
|---|---|
| 1. S / A / B如何定义 | S是VETO、安全 / truth / evidence硬红线或P0正式语义失真;A是P0功能、协议、状态、错误、可用性或测试能力失败但尚未命中S;B只限非P0 / conditional /诊断质量或无硬阈值偏差。 |
| 2. 每级如何影响结论 | open S / A均阻断“通过”和“有条件通过”;S可进入terminal不通过,A在修复窗口内触发Paused,不修复 /无法关闭时只能不通过;open B不得支持“通过”,只有Step 13合法接受后才可能支持“有条件通过”。 |
| 3. 修复后如何复验 | 先保存原失败,按L-R1~L-R5只升级不缩减;执行新fixed run,覆盖原TC、family、suite、gate / check及适用Release四源,再形成invalidation / supersede和独立review。 |
| 4. 哪些缺陷可以风险接受 | S / A一律不可以。只有不影响P0、VF / VETO、truth、安全、evidence、scope和激活claim的B可进入Step 13候选;本Step不产生接受事实。 |
| 5. 哪些必须阻断下一阶段 | 任一open S / A、VETO Triggered / Disputed / Blocked、P0 Failed / Blocked / InfraFailed / missing、evidence invalidation、DesignReopen或执行前置缺口都阻断放行;其中后四类未必是产品缺陷。 |

---

## 5. 当前材料诊断与设计取舍

| 议题 | 本项目裁决 | 排除口径 | 原因 |
|---|---|---|---|
| 等级闭集 | 只用S / A / B | L1参考的R级 | 正式`05`明确`ResidualTracked`不是第四等级 |
| A级风险接受 | 不允许计入P0退出、验收进入或放行 | “不影响P0时A可接受” | Step 4 AENT-010、AEXT-015与正式`05` EXT-P06均要求open A=0 |
| B级放行 | 只形成Step 13候选 | 本Step直接accepted | 接受需要authority、action、期限来源和expiry trigger |
| Gate Failed | 先归因再分级 | 一律S或重复建缺陷 | 同一失败可能来自产品、harness、环境或设计缺口 |
| Gate Blocked | 保持前置blocker | 创建产品缺陷或风险接受 | 没有有效产品断言,不能证明产品错误 |
| evidence缺失 | 先Blocked / Paused | 一律触发VETO-017 | 普通missing pair与静态造证 /篡改必须区分 |
| 单次绿色重跑 | 只作调查输入 | 覆盖原失败并关闭 | 原失败immutable;无根因 /防回归不得关闭 |
| terminal不通过 | 允许安全停止剩余评估 | 把剩余项写Passed / N/A | AEXT-016要求逐项披露未评估项 |

---

## 6. 归因与分级规则

`DTR-SBX-*`是验收设计检查索引,不是machine enum或缺陷ID。

| 规则ID | 输入事实 | 归因 /分级动作 | Gate /验收传播 |
|---|---|---|---|
| `DTR-SBX-001` | 首个`Failed` case / check | 先保存raw、report、identity、assertion和首个failure ref,再归因 | 未归因前受影响gate保持Failed |
| `DTR-SBX-002` | 产品行为违反正式`00~04`唯一契约 | 创建 /关联一个产品缺陷,按S / A / B分类 | 按等级与影响scope传播 |
| `DTR-SBX-003` | fixture、scheduler、scanner、runner、report generator或harness不可信 | 归为test-infra issue;P0相关默认A起步,伪造 /吞红线升S | 相关结果invalid,修复后必须执行有效产品断言 |
| `DTR-SBX-004` | 无法从正式契约得到唯一断言或上游冲突 | 不分S / A / B;登记DesignReopen并回写owner文档 | 相关Step / suite /验收项Paused或EntryBlocked |
| `DTR-SBX-005` | target repo、ENV、candidate、provider、lab或必需输入缺失 | 不创建产品缺陷;保持execution blocker | P0-Q / RELEASE /验收保持Blocked / NotEntered |
| `DTR-SBX-006` | P1 / P2 /量化未激活 | 不创建缺陷;保持NotRunConditional / residual candidate | 不阻断P0,不得声称已验证 |
| `DTR-SBX-007` | 任一`VETO-SBX-001~017`有效`Triggered` | 必须关联S级缺陷;同一root cause只建一个primary defect | 阻断相关gate / RELEASE,总体只能不通过 |
| `DTR-SBX-008` | P0 assertion失败但未证明VETO / S | 默认A;继续调查升级条件 | open A阻断entry、P0退出与放行 |
| `DTR-SBX-009` | 非P0 / conditional /诊断质量偏差且不触及硬红线 | 可定B;必须记录scope与升级trigger | 不改写P0状态;只可进入Step 13候选 |
| `DTR-SBX-010` | 多suite / report观察到同一root cause | 共享一个primary defect ref,其余作为affected evidence / finding | 禁止按聚合行复制缺陷和关闭结论 |
| `DTR-SBX-011` | 后续证据证明VF / VETO、P0 truth、安全或evidence integrity | A / B立即升S,原分类历史保留 | 不得因test / fake / conditional环境降级 |
| `DTR-SBX-012` | 分类证据不足或review Disputed | 不得猜等级或降级;保持triage open / Paused | 争议关闭前不得DecisionReady |

---

## 7. 缺陷分级表

| 缺陷级别 | 定义 | Sandbox典型触发 | 对验收结论的影响 | 复验要求 |
|---|---|---|---|---|
| `S` | 任一VETO、不可接受安全 / truth / evidence红线,或导致P0正式语义失真 | host / fake formal success;四维silent degrade;policy fail-open;正文 / secret泄漏;truth升格 /二写;duplicate重算;cleanup先删;redline脱管;非法依赖;静态造证 /状态篡改 | 当前批次“通过 /有条件通过”均禁止;可转terminal不通过;必须contain / preserve,不可风险接受 | 至少L-R5新四源 + RELEASE;原TC、全部受影响family / suite / checks和独立review;安全处置另行闭合 |
| `A` | P0功能、协议、状态、错误、可用性或测试能力失败,但尚未证明命中S | typed error错误但仍fail-closed;P0 receipt / report字段错;harness不稳定;结构有界性失败未造成红线 | 触发EntryBlocked或Paused;open A=0前不得通过 /有条件通过;不可风险接受计入P0退出 | 至少原TC +同family +完整suite,按共享面升L-R3 /4;跨gate、P0-Q或release后发现升L-R5 |
| `B` | 只影响非P0 / conditional /诊断质量 /可读性,且无正式硬阈值、无升级触发 | PROFILE-06 selected-run问题;raw完整时report文案;无硬SLO的sample偏差;非P0维护性 | open B不支持无条件通过;可修复关闭,或经Step 13合法接受后支持有条件通过;不得补偿P0 | 修复时执行受影响TC / conditional suite / report review;接受时保留验证上限、owner、动作、期限来源和重开trigger |

任何“严重但尚未执行”的前置缺失不是S。S必须有有效finding证明红线predicate;普通`Blocked / InfraFailed / missing`只阻断裁决或触发test-infra处置。

---

## 8. 17个VETO到S级的统一传播

| VETO族 | VETO ID | S级primary处置 | 最低复验方向 |
|---|---|---|---|
| 核心 / entry / boundary / policy | 001~004 | 停止相关launch,保持identity / boundary / policy材料 | L-R5;CMD / STA / ERR / CONF与P0-Q适用全链 |
| truth ownership / sensitive | 005~006 | 隔离材料,停止越界writer / output,执行全carrier调查 | L-R5;contract / protocol / redaction / dependency适用 |
| config / unsupported | 007~008 | 阻断startup / activation,必要时DesignReopen | L-R5;CFG / ARCH / scope / generation与check |
| capture / audit / relay | 009~011 | 阻断handoff / publish结论,保留source truth和stored payload | L-R5;CMD / CNS / EVT / JOB / audit / pairing |
| second writer / replay | 012~013 | 阻断相关entry,保留UoW / stored result / race材料 | L-R5;QRY / JOB / TXN / RACE / write-audit |
| cleanup / containment | 014~015 | 停止release /新use,保持guard、containment和调查材料 | L-R5;CMD / JOB / CONF / cleanup / P0-Q lifecycle |
| architecture / evidence integrity | 016~017 | 阻断build / RELEASE /DecisionReady,保留graph或全部证据现场 | L-R5;dependency或全部受影响producer / VC / independent review |

逐VETO exact来源和trigger仍以Step 11追溯分件为准。本表只定义severity / handling传播,不重定义VETO predicate。

---

## 9. 缺陷生命周期与验收记录契约

```text
Detected -> Preserved -> Attributed -> Classified
  -> ContainedOrBlocked -> FixedOrWrittenBack -> ReadyForRetest
  -> RetestFailed: Reopened
  -> RetestPassed + ClosureComplete: Closed
```

这些词只是缺陷工作流阶段,不是Sandbox业务状态或必须新增的代码enum。实际缺陷系统可以使用等价状态,但必须保留以下可审查字段:

| 阶段 | 强制记录 | 禁止动作 |
|---|---|---|
| Detected / Preserved | first failure source run、TC / parameter / assertion、suite / gate、raw / report digest、subject / config / ENV / PROFILE identity | 覆盖原失败、只保存截图或`latest` |
| Attributed / Classified | attribution、S / A / B理由、AC / VF / VETO / PER、affected gates / evidence、primary root cause | 未归因直接降B;同根因复制缺陷 |
| ContainedOrBlocked | launch / handoff / release / cleanup适用containment、resource disposition、gate和acceptance process影响 | 为清理环境绕guard或删除调查材料 |
| FixedOrWrittenBack | 实际修复revision或design writeback ref、change surface、RT / DRT selection | 缺正式契约时测试私自补语义 |
| ReadyForRetest | 新fixed identities、expected TC / suites / checks、selection review | 用旧run /旧candidate拼接 |
| RetestFailed / Reopened | 新失败refs、影响扩展、旧closure / evidence invalidation | 用后一次绿色覆盖reopen |
| RetestPassed / Closed | 全部必跑raw / report、checks、supersede、automation、防回归和review完成 | 把RetestPassed自动写Closed |

`reports/acceptance/open-issues.md`必须引用上述记录并与gate、evidence、VETO、review对账;它不能编辑缺陷源状态或充当唯一关闭证据。

---

## 10. 修复后复验范围

### 10.1 L-R1~L-R5只升级规则

| 复验级别 | 最低触发 | 最低执行集合 | 验收效力上限 |
|---|---|---|---|
| `L-R1 targeted` | 局部修复且formal contract / assertion未变 | 原失败TC全部参数、原负向fixture和直接副作用断言 | 只证明局部修复;不能单独关闭S / A |
| `L-R2 family` | DTO / enum / state / error mapper / owner flow变化 | L-R1 +同协议 /状态 /错误 /owner family | 不替代完整suite |
| `L-R3 suite` | fixture / repository / adapter / UoW / scheduler / scanner / shared helper变化 | 受影响suite完整manifest +相关checks | 不替代其他受影响gate |
| `L-R4 gate` | P0 shared contract、generation、redaction、dependency、report或OPS变化 | 固定subject下对应PR / MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q完整输入 | 只证明该gate / identity |
| `L-R5 release` | S、VETO、P0-Q、跨gate、evidence integrity或release后发现 | 新MAIN-CONTRACT + MAIN-SEAM + OPS + P0Q四源、250 P0、全部适用checks / reports / evidence与新RELEASE | 形成新验收输入;不自动关闭缺陷或验收通过 |

复验scope取所有正式影响面的并集,只能升级不能取交集。单跑原TC始终不足以关闭S / A。

### 10.2 变更面到必跑集合

`DRT-SBX-*`是复验选择审计索引。

| 规则ID | 修复面 | 必跑TC / suite | 必跑check /特殊要求 |
|---|---|---|---|
| `DRT-SBX-001` | carrier / metadata / protocol | 原TC + CTR /受影响协议family;SUITE-001 /011及owner suite | TC coverage + protocol inventory;schema变化先DesignReopen |
| `DRT-SBX-002` | state / terminal guard / error | 原STA / ERR + owner CMD / CNS / JOB;SUITE-002 /010 | 合法 /非法迁移、rollback和safe surface |
| `DRT-SBX-003` | command / query | 原CMD / QRY + TXN / ERR;SUITE-004 /007 /010 | Query全量保持write=0;MAIN |
| `DRT-SBX-004` | consumer / event / relay | 原CNS / EVT + duplicate / no-rollback;SUITE-005 /007 /011 | protocol + pairing;source owner / receipt同时验证 |
| `DRT-SBX-005` | job / maintenance | 原JOB + duplicate / partial / no-repair;SUITE-006 /007 /012 | cleanup + pairing;report counts / stored replay |
| `DRT-SBX-006` | UoW / idempotency / stored result | TXN-001~014 + owner channel + ERR;SUITE-007~010适用 | fault injection、single winner、pairing;MAIN + OPS |
| `DRT-SBX-007` | race / control / lifecycle | 原RACE +相关CMD / JOB;SUITE-009 /012 | deterministic schedule + cleanup disposition |
| `DRT-SBX-008` | config / profile / builder / unsupported | 原CFG +适用I / NCFG / FC / XVAL;SUITE-003 /008 /016 | dependency / redaction / scope;0或完整same-generation publication |
| `DRT-SBX-009` | sensitive / redaction | 原CTR / CFG / ERR / CONF;SUITE-003,涉及provider加013 | 全扫描根redaction;真实material资格和P0Q适用 |
| `DRT-SBX-010` | cleanup / lease / reaper / redline | CMD-013~020、JOB-005~007、CFG-022、RACE;SUITE-012 | cleanup + blocked propagation;真实backend完整013 / P0Q |
| `DRT-SBX-011` | four-dimension / candidate identity | CONF-001~013;SUITE-013完整packet | identity + redaction + cleanup;八类identity任一变化0旧case复用 |
| `DRT-SBX-012` | structural boundedness | COND-004 +受影响QRY / JOB / TXN / RACE;SUITE-014 | MAIN + OPS;不使用历史数字 |
| `DRT-SBX-013` | report / gate / evidence工具 | 原失败check +全部受影响suite summary | pairing + no-static + blocked propagation;raw缺失重跑producer |
| `DRT-SBX-014` | dependency / module / scope | ARCH-001~003、CFG-007 /029;SUITE-003 /016 | dependency + scope-reopen;新public / domain面先回写`00~04` |

### 10.3 P0-Q identity不可拼接

- subject revision、candidate、PROFILE-05、generation、capability、boundary template、environment、provider / material identity任一变化,整个旧qualification packet失效。
- 新packet必须完整重跑SUITE-013的13条TC及identity / redaction / cleanup / pairing checks,不得从旧packet抽取Passed行。
- lab teardown与产品cleanup disposition分别记录;强制lab回收不能修正产品truth或把产品失败变pass。
- ENV-02~04、PROFILE-06、host / fake / fixture都不能作为P0-Q复验输入。

---

## 11. 证据失效、复验关闭与重开

### 11.1 证据失效矩阵

| 变化 /发现 | 可保留 | 必须失效 /重做 |
|---|---|---|
| product / contract / state / UoW / error mapping变化 | 原run作historical investigation | 受影响Passed / EV;按DRT新run |
| assertion / fixture / scheduler / harness变化 | 原raw供归因 | 受影响参数 / suite对新harness的证明 |
| redaction catalog / scanner变化 | digest可验证的immutable raw | 旧redaction结论;raw不完整则重跑producer |
| report generator / Markdown变化 | compatible raw / case status | report / index / draft;同raw重生成并复跑pairing / no-static |
| config / profile / generation / dependency变化 | 旧组合材料 | 新组合gate;禁止跨generation拼接 |
| P0-Q identity任一变化 | 旧packet immutable | 整个qualification结论 / EV;完整新packet |
| defect重开 / VETO新finding | 原失败 /修复材料 | 相关evidence标记invalidated / superseded,验收停止消费 |
| 纯文案且raw digest /语义 /引用不变 | product raw | derived report重生成和review continuity |

### 11.2 关闭材料

`DCL-SBX-*`是关闭材料检查索引。

| 规则ID | 关闭材料 | S | A | B |
|---|---|---:|---:|---:|
| `DCL-SBX-001` | 原失败run、TC / parameter / assertion、suite / gate、raw / report refs | 必需 | 必需 | 有执行失败时必需 |
| `DCL-SBX-002` | attribution、root cause、severity理由、AC / VF / VETO / PER影响 | 必需 | 必需 | 适用 |
| `DCL-SBX-003` | containment / resource / investigation disposition | 相关即必需 | 相关即必需 | 相关即必需 |
| `DCL-SBX-004` | 修复revision / design writeback与change refs | 必需 | 必需 | 修复时必需 |
| `DCL-SBX-005` | DRT / RT选择、selection review和新fixed identities | 必需 | 必需 | 修复时必需 |
| `DCL-SBX-006` | 新run全部必跑TC / suite / check / gate结果 | 必需 | 必需 | 修复时必需 |
| `DCL-SBX-007` | redaction / dependency / pairing / identity / cleanup结果 | 相关即必需 | 相关即必需 | 相关即必需 |
| `DCL-SBX-008` | old evidence invalidated / superseded与新evidence refs | 必需 | 必需 | 影响旧证据时必需 |
| `DCL-SBX-009` | automation新增 /扩展或无需新增的可审理由 | 必需 | 必需 | 适用 |
| `DCL-SBX-010` | independent review、open-issues / VCL / handoff对账 | 必需 | 必需 | 影响验收时必需 |
| `DCL-SBX-011` | risk owner /理由 /动作 /期限来源 /reopen trigger | 禁止 | 禁止 | 仅Step 13接受时必需 |

一次绿色重跑、缺陷系统状态`Closed`、人工口头确认或新report单独存在都不足以关闭。若同identity间歇变绿,缺陷保持open / intermittent candidate,扩大scheduler / timing / fixture调查并补deterministic防回归。

---

## 12. 暂停、恢复与放行规则

`DRL-SBX-*`是验收放行检查索引,不是最终结论实例。

| 规则ID | 当前事实 | 验收过程动作 | 结论 /下一阶段上限 |
|---|---|---|---|
| `DRL-SBX-001` | entry前存在open S / A、未复验修复或P0 invalidation | 保持`NotEntered / EntryBlocked` | 不得开始正式review |
| `DRL-SBX-002` | InReview中新发现S / A、VETO、P0失败或证据失效 | 立即`Paused`,停止新增通过结论和签署 | 修复 +新packet后重新入场,或转不通过路径 |
| `DRL-SBX-003` | 有效VETO Triggered / S且当前批次不修复 | 保持containment,形成terminal finding与未评估清单 | 只能terminal不通过 |
| `DRL-SBX-004` | A修复完成且baseline / P0 source变化 | 按DRT新run / supersede,建立新RELEASE和全量AENT | 不允许局部resume跨packet |
| `DRL-SBX-005` | 只有derived report / cross-ref修复且raw / identity /语义不变 | 重生成、pairing / no-static与独立review后可局部resume | 仍需重验受影响AENT / AEXT |
| `DRL-SBX-006` | 任一open S / A | 不得风险接受或隐藏 | 通过 /有条件通过均禁止 |
| `DRL-SBX-007` | open B尚未修复且未被Step 13合法接受 | 保持open issue | 不支持通过 /有条件通过 |
| `DRL-SBX-008` | open B满足非P0边界且Step 13合法接受 | 保留原缺陷open / accepted-risk关联和expiry | 最多支持有条件通过,不改P0状态 |
| `DRL-SBX-009` | open S / A / B=0且无其他风险接受,所有门禁 / review满足 | 交Step 14聚合 | 可成为“通过”候选,不自动通过 |
| `DRL-SBX-010` | S / A=0,VETO全NotTriggered,P0完整,只存在合法B / RR / conditional接受 | 交Step 14聚合 | 可成为“有条件通过”候选 |
| `DRL-SBX-011` | Blocked / InfraFailed / missing / DesignReopen / Disputed未关闭 | 保持EntryBlocked / Paused;不能risk accept | 不得放行;是否终止由Step 14按完整材料裁决 |
| `DRL-SBX-012` | terminal不通过材料完整 | 满足AEXT-001~014 +016,披露全部未评估项 | 可DecisionReady为不通过;0伪Passed / N/A |

### 12.1 三值候选矩阵

| 目标候选 | 缺陷硬条件 | 其他不可缺条件 | 禁止替代 |
|---|---|---|---|
| 通过 | open S / A / B=0 | 17 VETO全NotTriggered;P0完整;无accepted risk;AEXT-001~015 | 绿色重跑、旧run或口头豁免 |
| 有条件通过 | open S / A=0;仅合格B可保持open | VETO / P0同通过;Step 13接受与expiry完整;AEXT-001~015 | A、execution blocker、evidence缺口或P1补P0 |
| 不通过-完整评估 | 缺陷 /失败按真实状态保留 | 所有mandatory项已评估;AEXT-001~015 | 把Failed改conditional |
| 不通过-terminal | confirmed VETO / S / P0 failure或不可恢复evidence失真 | AEXT-001~014 +016;安全停止且未评估清单完整 | 将未评估项写Passed / N/A |

本Step只定义候选上限。Step 14才计算唯一最终结论和“是否允许进入下一阶段”。

---

## 13. 正式`06` §12回填草稿

Step 15装配时,正式§12必须包含:

1. §7的S / A / B缺陷分级表,并明确不存在R级缺陷。
2. §3的五层词汇分离和§6 `DTR-SBX-001~012`归因 /升级规则。
3. 17个VETO一经有效Triggered必须为S,但Blocked / missing本身不自动成为S。
4. §9生命周期和§11 `DCL-SBX-001~011`关闭材料;RetestPassed不自动等于Closed。
5. §10 `L-R1~L-R5`与`DRT-SBX-001~014`;S / VETO至少L-R5,scope只升级。
6. §11证据失效 / supersede规则,原失败和旧packet不可覆盖或跨identity拼接。
7. §12 `DRL-SBX-001~012`及三值候选矩阵;open S / A不能放行,B只能由Step 13合法接受。
8. 当前只能写design-only与无实际缺陷 /复验 /结论事实,不得预填缺陷为0或任何放行结果。

---

## 14. 当前Readiness、blocker与Step结论

| 项目 | 当前状态 | 对Step 12的影响 |
|---|---|---|
| `SBX-ACC-DEFECT-001` | design resolved by本Step,待用户审查 | 规则完整不表示实际缺陷为0 |
| target repo / subject / suites / scripts | open_for_07_precheck_and_execution | 阻塞真实failure、defect和retest实例 |
| ENV-02~05 / P0-Q packet | Blocked / absent | 阻塞P0-C / P0-Q执行,不创建产品缺陷 |
| runtime EV / report / review | absent | 阻塞缺陷关闭和DecisionReady |
| RR-SBX-001~008 | pending_for_06_step_13 | 不是本Step已接受的B或放行条件 |
| retention物理策略 | open_for_07_09 | 不阻塞规则设计;不得越过DCL /调查guard删证据 |

当前没有阻塞Step 12设计收口的未解上游blocker。开放项阻塞真实执行、缺陷分类、复验、关闭和放行,不得写成`0 open defects`、accepted或Passed。

```text
current_document = `06-验收标准.md`
current_step = Step 12 `定义缺陷分级、复验与放行规则`
main_artifact = completed_reviewed_passed_to_step_13
formal_severity_set = S_A_B_only
runtime_defect_created = no
runtime_retest_executed = no
release_decision_created = no
formal_document_modified = no
next_allowed_action = 用户已确认;由Step 13定义风险接受与遗留项
commit_required = no
```
