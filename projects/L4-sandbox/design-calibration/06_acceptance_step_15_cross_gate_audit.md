# L4-sandbox 验收标准 Step 15 跨门禁与跨文档一致性审计

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 15
> 固定产物来源: `standards/document/设计文档讨论中间产物规范.md` §5.10
> 配套主件: `06_acceptance_step_15_formal_document_assembly.md`
> 创建日期: 2026-07-15
> 状态: completed_reviewed_passed_to_07
> 审计对象: 正式`00~06`、验收Step 1~15及其主件 /分件
> 事实边界: 本文审计设计闭环,不证明实现、测试执行、runtime evidence或验收通过

---

## 1. 审计方法与冲突门禁

本审计以正式owner文档和已确认Step产物为输入,执行以下规则:

1. 汇总表只作跨文档反查索引,不成为新的字段、状态、协议或验收项真相源。
2. 正式`03/04/05`与对应校准产物不一致时,暂停受影响章节并回写owner文档;实现者不得二选一。
3. planned ESLOT只证明证据位置已设计;只有固定run下raw + report + checks通过后才能分配runtime EV alias。
4. `Blocked / Missing / Invalidated / Disputed / NotEvaluated`不得映射为`Passed`或风险接受。
5. 任一VETO为`Triggered`时总体只能不通过;VETO、S / A、P0、evidence identity和DesignReopen不得接受。
6. 当前没有正式`07`、implementation ledger或planned boundary skeleton,Phase / commit审计只能判定`not_applicable_until_07`,不能伪造边界。

审计状态闭集:

| 状态 | 含义 |
|---|---|
| pending | 尚未对正式装配结果执行 |
| passed | 输入和正式正文同源,无冲突 |
| pending_user_review | 设计与静态审计完成,等待用户决定是否切换到下一正式文档 |
| resolved_writeback | 曾有冲突,已回写owner并保留记录 |
| blocked | 外部实现 /环境 /证据尚不存在,但不阻塞规则设计 |
| unresolved | 设计输入冲突且尚未修正;阻断Step 15完成 |
| not_applicable_until_07 | 只有进入实施计划后才有合法审计对象 |

本文中的`passed`只表示设计真相源、正式正文与校准产物的静态一致性审计通过,不表示实现、测试、P0-Q、runtime evidence或验收结论通过。

---

## 2. 跨门禁裁决总审计表

| 审计ID | 审计链 | 输入闭集 | 正式落点 | 当前状态 | 最终判据 |
|---|---|---|---|---|---|
| CG-SBX-01 | scope -> baseline -> entry | ASCP-SBX-001~024;ABSL-SBX-001~040;AENT-SBX-001~016 | §2~§4 | passed | P0-C / P0-Q、四source、FormalEntryReady无断裂 |
| CG-SBX-02 | canonical AC ->设计 -> TC -> slot -> EV / report ->裁决 | Step 5~10主件 /追溯分件 | §5~§10 | passed | 每个P0 AC存在完整小循环,无“见报告”泛化 |
| CG-SBX-03 | protocol / state / error闭集 | 55 protocol;31 canonical enum entry /30 owner-level machine /39 shared declaration;38 typed error | §7~§8 /§15 | passed | `03`为名称owner;`05`逐项映射TC;`06`逐名 /逐ID反查,三层差异为零 |
| CG-SBX-04 | evidence identity -> schema -> pairing -> aggregation -> review | 21 ESLOT;九schema;四source;RELEASE;六fixed acceptance / review入口 | §3 /§10 | passed | 缺失 /失效不映射Passed,不存在第二入口 |
| CG-SBX-05 | redline / VETO -> defect -> decision | 16 RL;17 VETO;S / A / B;九维结论 | §6 /§11 /§12 /§14 | passed | 17 /17 VETO不可被风险或签署覆盖 |
| CG-SBX-06 | defect -> retest -> closure -> risk | DTR;L-R1~L-R5;DRT;DCL;DRL;RAQ;RR | §12~§13 | passed | 仅有效非P0 B / residual可形成Accepted候选 |
| CG-SBX-07 | AEXT -> FDQ ->三值 -> effect -> authorization -> signoff | 16 AEXT;8 FDQ;九维;5必签 +2条件 | §4 /§14 | passed | 无packet /签署时保持absent_not_adjudicated |
| CG-SBX-08 | 15章 ->来源 ->延伸阅读 ->参考 | Step 1~15;书写规范 | 全文 | passed | 15章逐章具体可定位,无过程问题原文 |

---

## 3. §5.10-1 真相源表

| 设计事实 | 真相源文档 | 章节 /中间产物 | 后续消费者 | 冲突处理 | 状态 |
|---|---|---|---|---|---|
| Sandbox定位、C / FR / BR / AC / VF和非范围 | 正式`00-需求文档.md` | C-SBX-1~5、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010 | `01~07` | 旧README /旧`06`冲突时以正式`00`为准 | passed |
| execution isolation truth、依赖方向、数据所有权、安全红线 | 正式`01-架构设计.md` | execution environment identity、coherent boundary、fail-closed、capture / cleanup | `02~07` | 产品语义、host fallback或相邻仓直连不能覆盖架构 | passed |
| 六个主要组成部分、关键对象、接口 / flow /状态骨架 | 正式`02-概要设计.md` | 组件、对象、接口、处理流、状态主题 | `03/05/06/07` | 旧五段主线不得进入正文 | passed |
| 七模块、对象 /字段 /构造、55协议、31 canonical enum entry /30 owner-level machine /39 shared declaration、事务和38错误 | 正式`03-详细设计.md` | §4~§15及DDD校准Step 4~16 | `04~07` | 缺字段 /状态 /surface时回写`03`,不由`06`补设计 | passed |
| PROFILE、I001~I101、40配置组、D01~D44、AHG / EHR / VETO-CFG | 正式`04-配置设计.md` | §5~§14;Step 6~12 | `05~07` | 验收只消费,不得新增配置项或默认值 | passed |
| 38 CUT / CBC / PER、254 TC、28 DS、7 ENV / PROFILE、16 suite、7 gate | 正式`05-测试方案.md` | §3~§12;测试Step 3~12 | `06/07` | 数量 /ID漂移时先回写`05` | passed |
| 21 ESLOT、九schema、四source run、fixed报告和20 RT / 8 RR | 正式`05-测试方案.md` | §13~§14;测试Step 13~14 | `06/07/09` | ESLOT不得冒充runtime EV;RR不得冒充Accepted | passed |
| 验收scope、门禁、VETO、风险和三值裁决 | 验收Step 1~14 | `06_acceptance_step_01_*`至`14_*` | 正式`06` | 只装配已确认结论;发现冲突回到owner Step | passed |
| 最终验收标准 | 正式`06-验收标准.md` | §1~§15 | `07/09`与未来验收执行 | 用户已确认为`07`直接上游;验收过程仍`NotEntered` | passed_reviewed |
| phase / commit / implementation boundary | 未来正式`07-实施计划.md` | 当前已进入Step 1,但正式文档和boundary均不存在 | implementation agent | 验收Step禁止预造 | not_applicable_until_07_step_5_6 |

---

## 4. §5.10-2 字段闭环表

本表按安全关键字段族审计,完整逐字段定义仍以正式`03`对象 /协议契约为准。

| 字段族 | 正式owner /类型来源 | 输入或派生来源 | 构造 /校验边界 | 缺失处理 | 测试覆盖入口 | 验收落点 | 状态 |
|---|---|---|---|---|---|---|---|
| execution environment identity | 正式`03`identity / snapshot对象 | caller refs + resolved immutable snapshot | admission / prepare前绑定,后续只按ref消费 | fail-closed,不得启动 | IDN / CMD / ARCH family | §5 /§6 | passed |
| resource limits | 正式`03`resource policy / effective snapshot | policy输入 +受控配置解析 | launch前验证并绑定effective values | reject / blocked,不得弱fallback | POL / CFG / CMD / NFR | §5 /§6 /§9 | passed |
| filesystem boundary | 正式`03`filesystem policy / mount snapshot | typed refs +受控materialization | prepare / launch guard | deny + audit,no-write | POL / CFG / SEC / ARCH | §5 /§6 /§9 | passed |
| network boundary | 正式`03`network policy / effective rules | typed policy + resolved endpoints | launch前闭合,运行期不可静默放宽 | deny + classify + audit | POL / CFG / SEC / ARCH | §5 /§6 /§9 | passed |
| process boundary | 正式`03`process / launch contract | runtime / tool refs但不含semantic body | launch policy校验后构造 | reject / contain,不得host fallback | CMD / POL / ERR / SEC | §5 /§6 | passed |
| tool / runtime launch refs | 正式`03`public carrier与typed ref | L2-tools / L2-runtime接缝输入 | Sandbox只验证可执行承载契约 | typed failure,不解释tools语义 / agent loop | CMD / CNS / ARCH | §5 /§7 | passed |
| artifact capture refs | 正式`03`capture / handoff对象 | stdout / stderr / file / usage / audit capture | capture后形成typed candidate / ref | partial必须显式分类,不得升格Artifact truth | CAP / EVT / JOB | §5 /§7 /§10 | passed |
| lease / cleanup / reaper identity | 正式`03`lease / cleanup状态与job carrier | execution identity + clock / policy snapshot | acquire / renew / expire / reap的事务边界 | classify / retry / quarantine,不得先删证据 | JOB / STA / TXN / RACE | §5 /§8 /§12 | passed |
| evidence identity / digest | 正式`05`九schema | fixed source context + raw / report生成器 | schema / digest / path / pairing checks | Missing / Invalidated / Blocked | ESLOT-SBX-001~021 | §3 /§10 | passed |

---

## 5. §5.10-3 DTO / Event / Job到Domain对象构造闭环表

| 输入契约族 | 目标Domain事实 /对象族 | 必填完整性 | 不得混同 | 缺失 /重复 /重试行为 | 关联处理流 | 验收入口 | 状态 |
|---|---|---|---|---|---|---|---|
| 10 Command | admission、environment、lease、run、capture、cleanup owner对象 | 以正式`03`逐Command request / result为准 | caller intent != effective environment;tool ref != tool semantics | typed reject / idempotent replay / no-write | command flows | PG-SBX-001~010;§5 /§7 | passed |
| 9 Consumer | 上游事实的本地typed intake / snapshot | envelope identity、version / digest与payload refs完整 | upstream lifecycle != Sandbox lifecycle | duplicate幂等;gap / invalid quarantine或retry | consumer flows | PG-SBX-024~032;SYNC | passed |
| 13 Outbound Event | Sandbox已提交事实的public carrier | committed identity、typed refs、owner status / reason | event carrier !=下游truth;capture ref !=Artifact truth | commit后发布;retry不回滚owner truth | event flows | PG-SBX-033~045;SYNC | passed |
| 10 Operations Job | lease、reaper、cleanup、reconciliation、relay等受控批次 | job cursor / scope / generation / policy identity按正式契约完整 | cursor != version;reaper !=member lifecycle | deterministic claim;retry / quarantine;no blind repair | job flows | PG-SBX-046~055;§8 | passed |

---

## 6. §5.10-4 状态闭环表

| 审计对象 | 正式状态闭集 | 产生 /迁移来源 | 禁止口径 | TC /证据入口 | 验收落点 | 状态 |
|---|---|---|---|---|---|---|
| 30个status enum | 正式`03`§9及`03_ddd_step_10_state_matrix.md`逐enum exact variants | 正式Command / Consumer / Job函数 | `Pending`、`Publishing`、跨owner同名推断及不存在的reconciliation迁移 | STA family;ESLOT-SBX-002 /009 /011 /013 /018 /019 /020 /021按producer | §8 | passed |
| 14事务 /重放主题 | Step 8 transaction register固定提交、回滚、no-write / no-repair语义 | 正式`03`§10~§13 | 副作用失败回滚owner truth、字符串错误匹配 | TXN / ERR / CAP / EVT family | §8 /§12 | passed |
| 19 deterministic race | Step 8 race register固定winner / loser / side effect | version / idempotency / claim边界 | 双winner、silent overwrite、跨identity拼接 | RACE family | §8 /§9 | passed |
| 验收过程状态 | `NotEntered / EntryBlocked / InReview / Paused / DecisionReady / Closed` | Step 4 /14 | 用最终三值或证据状态替代 | AENT / APAUSE / AEXT | §4 /§14 | passed |
| 结论生效状态 | `Draft / PendingSignoff / Effective / RejectedBySignoff / Invalidated / Superseded` | Step 14 | Draft授权下游、覆盖历史记录 | FDQ / signoff packet | §14 | passed |

---

## 7. §5.10-5 Query response / view闭环表

| Query范围 | Response / view来源 | 只读 /可见性边界 | empty / missing / degraded口径 | public ref规则 | 测试入口 | 验收入口 | 状态 |
|---|---|---|---|---|---|---|---|
| 13 Query全闭集 | 正式`03`§7 Query协议及对象projection | query不得写owner truth、触发repair或推进lifecycle | 逐Query使用正式typed empty / not-found / visibility / degraded结果 | 只暴露正式public id / typed ref,不泄漏secret / host path /外部正文 | QRY family | PG-SBX-011~023;ISA | passed |
| run evidence views | 正式`05`fixed reports | report只解释immutable machine artifact | Missing / Invalidated / Disputed显式呈现 | `<run_id>`和source identity固定,no latest | report / schema checks | §10 | passed |
| acceptance handoff view | `reports/acceptance/handoff.md` | draft / final section分层,不得反写raw | 无AEXT / FDQ时无最终结论 | fixed RELEASE +四source digest | review / acceptance checks | §14 | passed |

---

## 8. §5.10-6 Phase / commit boundary闭环表

| Phase / boundary | 当前可审计输入 | 明确排除 | 前置 | 当前判定 | 后续动作 |
|---|---|---|---|---|---|
| 验收设计 ->实施计划文档 | 正式`00~06`和全部校准产物 | runtime授权、implementation commit、测试结果 | 用户审查确认正式`06` | passed_to_07_step_1 | 已进入`07` SOP;Step 1只做输入边界,不预造implementation boundary |
| implementation phase / commit boundaries | 当前已有`07` flow / Step 1,但无正式`07`、implementation ledger或skeleton | 不从验收Step或输入边界臆造boundary ID / commit | `07` Step 5~6定phase / boundary,Step 13装配 | not_applicable_until_07_step_5_6 | Step 6定义ledger / skeleton schema;Step 13创建全部planned文件 |
| runtime next-stage / release authorization | Step 14仅定义未来契约 | 设计文档推进不等于runtime授权 | Effective三值结论 +适用签署 | blocked | 未来真实验收执行形成 |

---

## 9. §5.10-7 Public protocol传递类型闭环表

| 协议surface | 数量 | 正式归属 | carrier /传递类型规则 | 缺失 /duplicate /retry | 依赖边界 | 测试 /验收入口 | 状态 |
|---|---:|---|---|---|---|---|---|
| Command | 10 | 正式`03`contracts / application surface | 只传正式request / result / typed ref / enum | typed reject;幂等键按owner规则 | 不解释tools semantic execution或agent loop | CMD;PG-SBX-001~010 | passed |
| Query | 13 | 正式`03`contracts / query surface | 只读DTO / view,secret / host detail受控 | typed empty / not-found / degraded | 不触发repair或跨仓写入 | QRY;PG-SBX-011~023 | passed |
| Consumer | 9 | 正式`03`adapter intake | envelope + typed upstream refs / snapshot | duplicate幂等;gap / invalid显式处理 | 运行期 /事件依赖经port / adapter | CNS;PG-SBX-024~032 | passed |
| Outbound Event | 13 | 正式`03`committed fact carrier | committed identity + typed refs,不嵌外部正文 | relay retry不回滚owner truth | 下游消费不反写Sandbox truth | EVT;PG-SBX-033~045 | passed |
| Operations Job | 10 | 正式`03`operations surface | typed scope / cursor / generation / policy refs | deterministic claim / retry / quarantine | job不接管member / runtime lifecycle | JOB;PG-SBX-046~055 | passed |

---

## 10. §5.10-8 命名一致性表

| 名称类型 | 正式名称 /路径 | 禁用旧名 /口语名 | 审计位置 | 状态 |
|---|---|---|---|---|
| gate report | `reports/runs/<run_id>/gate-results.md` | `gate-summary.md` | 正式§3 /§10 /§15 | passed |
| final decision入口 | `reports/acceptance/handoff.md`的`Final Decision and Signoff` section | `final-decision.md`;`acceptance-summary.md` | 正式§14 | passed |
| process state | `NotEntered / EntryBlocked / InReview / Paused / DecisionReady / Closed` | `Pending`;把NotEntered写成不通过 | 正式§4 /§14 | passed |
| evidence maturity | planned ESLOT -> future runtime EV | 把ESLOT写成EV;静态EV alias | 正式§5~§10 | passed |
| execution truth | current正式`00~03`定义的environment / run / lease / capture边界 | 旧`SandboxExecution / SandboxSession / SandboxCommand / SandboxOutput / Control`主线 | 全文 | passed |
| acceptance decision | `通过 / 有条件通过 / 不通过` | 基本 /原则 /大体 /部分 /观察通过 | 正式§12~§14 | passed |
| risk state | `PendingAssessment / NotApplicableByScope / Proposed / Accepted / Rejected / Expired / Closed` | 把catalog项写成已接受,或引入非正式`Fulfilled / Superseded` | 正式§13 | resolved_writeback |

---

## 11. §5.10-9 冲突与修正表

| 冲突ID | 冲突位置 | 类型 | 影响 | 修正 | 状态 |
|---|---|---|---|---|---|
| SBX-ACC-BASELINE-PATH-001 | 正式`05` /验收Step 3 | fixed path冲突 | acceptance / review入口不唯一 | 已回写固定平铺入口 | resolved_writeback |
| SBX-ACC-BASELINE-IDENTITY-001 | 正式`04/05` | ENV / PROFILE identity漂移 | source run无法同identity聚合 | 已回写canonical全名与聚合器identity | resolved_writeback |
| SBX-ACC-BASELINE-SOURCE-RUN-001 | 正式`05` | MAIN环境混装 | 单run绑定两组identity | 已拆MAIN-CONTRACT / MAIN-SEAM四source聚合 | resolved_writeback |
| SBX-ACC-STATE-NAME-001 | 正式`03` | 状态名 /迁移漂移 | 状态验收不可判定 | 已按31-entry canonical矩阵回写并保留30 owner-level machine口径 | resolved_writeback |
| SBX-TEST-EVIDENCE-PRODUCER-001 | 正式`05` | slot producer漏项 | future evidence可能无raw入口 | 已回写对应suite owner | resolved_writeback |
| SBX-ACC-EVIDENCE-GATE-PATH-001 | 正式`05`及校准产物 | report path冲突 | 出现双入口 | 已统一`gate-results.md` | resolved_writeback |
| SBX-ACC-STEP15-RISK-STATE-001 | Step 15总审计初稿§10 | risk state命名漂移 | 总审计可能反向污染正式§13 | 已按Step 13七状态闭集改为`NotApplicableByScope / Closed`,并排除`Fulfilled / Superseded` | resolved_writeback |
| SBX-ACC-HIST-001 | 旧README /旧`06` | historical污染 | 旧对象 /证据 /结论进入新正文 | full-restart排除 +全文扫描;只在明确禁止说明中命中旧名 | passed |
| SBX-TEST-EXECUTION-001 | 实现 /运行环境 | external blocker | 不能执行或生成runtime evidence | 保持Blocked,不阻塞规则设计 | blocked |
| SBX-TEST-P0Q-001 | ENV-05 / P0-Q | qualification blocker | P0-Q与release不可裁决 | 保持Blocked,不得替代 | blocked |

任何新增`unresolved`行都会阻断Step 15完成。

---

## 12. §5.10-10 正反例

正确闭环:

```text
canonical AC / design contract
  -> exact TC range
  -> planned ESLOT
  -> fixed source run下raw + report + checks
  -> runtime EV alias
  -> reports/runs/<run_id>/evidence-index.md
  -> gate-results.md
  -> reports/acceptance/handoff.md
  -> AEXT / FDQ / signoff
```

正确原因:

- 每层都有独立identity与成熟度,planned设计不会被误写成执行事实。
- Failed / Blocked / Missing / Invalidated可沿链传播,不能被摘要文字吞掉。
- VETO、risk和final decision各有唯一固定入口与authority边界。

错误闭环:

```text
需求大致满足
  -> 见测试报告
  -> 风险已知
  -> 原则通过
```

错误原因:

- 缺设计契约、TC、slot、run identity、report path和failure传播。
- “已知风险”不等于有效风险接受,也没有authority、期限或stop gate。
- “原则通过”不是允许的三值结论,不能产生下一阶段或发布授权。

---

## 13. 最终机械与语义审计清单

| 检查项 | 预期 | 当前状态 |
|---|---|---|
| 正式章节 | §1~§15顺序和名称逐字一致 | passed;15 /15 |
| 来源块 | 15 /15章均引用具体文件并有针对性延伸阅读 | passed;15 /15 |
| P0闭环 | AC ->设计 -> TC -> ESLOT -> future EV / report ->裁决 | passed_design;237 P0-C +13 P0-Q双轴保持独立 |
| protocol闭集 | 10 Command +13 Query +9 Consumer +13 Event +10 Job =55 | passed;55 /55 exact name在`03/05/06`可反查 |
| state闭集 | 31 /31 exact canonical enum entry,对应30 owner-level machine且无旧名 | passed;owner / STA /验收三层exact-name差异为0 |
| error闭集 | 38 /38 typed error,无字符串匹配裁决 | passed;owner与ERR用例exact-name差异为0 |
| evidence闭集 | 21 /21 ESLOT、九schema、四source、fixed report | passed_design;不表示runtime item存在 |
| VETO闭集 | 17 /17,全部不可风险接受 | passed_design;runtime仍全部NotEvaluated |
| risk边界 | 8 RR均为catalog PendingAssessment,无实际Accepted | passed |
| 当前事实 | NotEntered;final decision absent;无授权 /签署 | passed;事实边界未被装配改写 |
| 禁止路径 | 禁用名称只可出现在禁止清单,不得作为实际入口 | passed;无第二实际入口 |
| 禁止伪造 | 无静态run ID、commit、EV、结果、缺陷、接受人或日期 | passed |
| Markdown | 表格列结构、fence、引用文件和`git diff --check`通过 | passed;0列错、18个成对fence、0缺失设计引用 |
| unresolved冲突 | 0 | passed;风险状态命名漂移已resolved_writeback |

最终审计结论:`CG-SBX-01~08`全部通过设计一致性审计,§5.10十类表无unresolved冲突。用户已确认正式`06`并放行到`07` Step 1;真实实现 /测试 /验收执行状态仍为未开始,该文档确认不表示任何runtime验收结论。
