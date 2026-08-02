# L4-sandbox 验收标准 Step 13 风险接受与遗留项

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/验收标准书写规范.md` §5.13
> 回填章节: `projects/L4-sandbox/06-验收标准.md` §13
> 创建日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_14
> 当前成熟度: design_only;未形成fixed RELEASE、实际风险接受、接受人、日期、follow-up ref、验收结论或签署
> 配套分件: `06_acceptance_step_13_risk_review_register.md`

---

## 1. Step状态与输入审计

| 项目 | 当前结论 |
|---|---|
| 用户是否确认Step 12并允许进入Step 13 | 是。Step 12两件产物均为`completed_reviewed_passed_to_step_13`。 |
| 是否读取当前标准 | 是。已读取验收SOP Step 13、书写规范§5.13、中间产物规范和真相源闭环 /可落码性标准。 |
| 是否读取正式风险来源 | 是。已读取正式`05`§14.4~§14.5及`05_test_plan_step_14_residual_risk_register.md`。 |
| 是否读取验收约束 | 是。已读取Step 2 scope、Step 3 ABSL-036、Step 4 entry / exit、Step 10 report gate、Step 11 VETO、Step 12缺陷 /放行。 |
| 是否读取粒度参考 | 是。已读取L1-governance与L1-artifact Step 13;只参考结构,未继承其“A可接受”、R级缺陷或领域风险。 |
| 旧正式`06`如何处理 | historical_material。旧预填风险、接受方向、空姓名 /日期和签署占位均不继承。 |
| 是否发现上游冲突 | 未发现阻塞本Step的冲突。L1参考允许严格A接受,但L4正式`05`和Step 4 /12明确open A不可risk acceptance,本项目按L4执行。 |
| 正式`06`是否修改 | 否。正式文档只能在Step 15装配。 |

---

## 2. 本步目标与职责边界

本Step完成以下事项:

1. 区分“证明上限披露”“可提交接受的残余风险”“mandatory blocker / DesignReopen”和“已被权威主体接受”四种不同事实。
2. 为`RR-SBX-001~008`固定基于frozen claim / target stage的动态路由,不得机械写成八条已接受风险。
3. 固定未来B级缺陷进入风险接受的资格条件;S / A、17个VETO、P0与evidence缺口始终不可接受。
4. 固定`reports/acceptance/risk-acceptance.md`的identity、字段、状态、authority、expiry / reopen与独立review要求。
5. 固定接受风险对“通过 /有条件通过 /不通过”和`07`、`09`、consumer project、future design reopen的传播。

本Step不执行以下事项:

- 不填写真实接受人姓名、authority assignment、决定时间、deadline、issue、implementation boundary或运维runbook引用。
- 不把`RR-SBX-001~008`的`pending_for_06`转写成`Accepted`。
- 不接受S / A、VETO、P0 Failed / Blocked / InfraFailed / missing、identity / evidence缺口、execution blocker或DesignReopen。
- 不用风险接受扩大frozen claim、补偿P0-C / P0-Q、宣称PROFILE-06 /07 ready或替代真实material安全资格。
- 不计算Step 14最终结论,不创建签署记录,不创建`07` implementation ledger / boundary skeleton。

---

## 3. 风险资格、记录状态与结论分离

### 3.1 资格路由

| 资格路由 | 唯一含义 | 是否需要接受记录 | 对结论的作用 |
|---|---|---:|---|
| `DisclosureOnly` | 能力 /目标不在当前frozen claim,只披露证明上限与未来trigger | 否;在handoff / risk文件中记录`NotApplicableByScope` | 不制造有条件通过;也不宣称该能力已验证 |
| `AcceptanceCandidate` | 当前目标阶段允许带着一个非P0、边界明确、可缓解且可限期关闭的残余风险前进 | 是 | 只有实际`Accepted`且全部门禁满足时,才可支撑有条件通过候选 |
| `MandatoryBlocker` | 风险对应能力已进入当前claim /合同 /目标阶段,但证据或前置不完整 | 不允许 | 阻断对应claim和放行;必须修复 /执行 /补证 |
| `DesignReopen` | 新public / config /领域 /production / unsupported语义越过当前设计 | 不允许 | 暂停验收,先回写owner文档并重建baseline |
| `Prohibited` | S / A、VETO、P0、安全 / truth / evidence或执行前置问题 | 不允许 | 不能通过风险接受改变原状态或结论 |

### 3.2 实际记录状态

以下状态只属于`reports/acceptance/risk-acceptance.md`验收记录层,不是Sandbox业务或测试enum:

| 状态 | 进入条件 | 是否可支撑有条件通过 |
|---|---|---:|
| `PendingAssessment` | catalog候选尚未绑定有效RELEASE / claim / evidence / authority | 否 |
| `NotApplicableByScope` | frozen claim明确未包含该目标,且scope review确认无隐含承诺 | 否;只披露 |
| `Proposed` | eligibility checks完整,已绑定实际owner / acceptor / action / deadline / follow-up,等待authority决定 | 否 |
| `Accepted` | 授权acceptor对同一fixed RELEASE与target stage作独立接受决定,review无未决争议 | 是,但仅是必要条件之一 |
| `Rejected` | authority拒绝接受或eligibility不成立 | 否;对应问题保持open / blocker |
| `Expired` | deadline / milestone、claim、identity、scope、VETO / defect或reopen trigger发生 | 否;立即停止消费旧接受 |
| `Closed` | follow-up完成并有新证据 /设计 /运行材料关闭风险 | 否需再接受;保留历史记录 |

当前没有实际acceptance batch或ABSL-036文件,所以`RR-SBX-001~008`只能保持catalog层`PendingAssessment`;不能预填`NotApplicableByScope`或`Accepted`。

---

## 4. SOP五问回答

| SOP问题 | L4-sandbox回答 |
|---|---|
| 1. 哪些风险可以支持有条件通过 | 仅`AcceptanceCandidate`中不影响P0、VETO、S / A、truth、安全、evidence或frozen claim的B级 /非P0 residual,且实际记录为有效`Accepted`。范围外披露本身不需要也不能制造条件结论。 |
| 2. 哪些风险不能接受 | 17个VETO、S / A、P0任何非Passed、identity / raw / report / digest / review缺口、execution / P0-Q blocker、DesignReopen、已激活P1 / P2 claim缺证据、真实material安全前置缺失。 |
| 3. 每个风险接受人是谁 | 设计只固定acceptance role;实际`Accepted`必须保存一个可定位的授权主体identity和authority source。只有角色名或“待填”不构成接受。 |
| 4. 后续动作和截止是什么 | 每项必须有可验证action、实际owner identity、follow-up ref、权威deadline或有界milestone、expiry / reopen trigger;缺任一项只能Pending / Rejected。 |
| 5. 是否同步实施计划或问题记录 | 是。所有实际Accepted必须至少同步一个真实issue / `07` boundary / `09` runbook / consumer plan / ADR;仅留在`06`无效。 |

---

## 5. 资格检查闭集

`RAQ-SBX-*`是风险接受资格审计索引,不是machine schema enum。

| 规则ID | 必须成立 | 不成立时路由 |
|---|---|---|
| `RAQ-SBX-001` | 记录绑定同一fixed RELEASE、四source digest、frozen claim、subject与target stage | PendingAssessment / Rejected |
| `RAQ-SBX-002` | 来源是RR-SBX、实际B级defect或经review确认的正式非P0 residual,不是自由文本新增语义 | DesignReopen / Rejected |
| `RAQ-SBX-003` | P0-C / P0-Q、250条P0和全部适用validation checks均有效 | MandatoryBlocker / Prohibited |
| `RAQ-SBX-004` | 17个VETO全部`NotTriggered`,无Blocked / Disputed / NotEvaluated | Prohibited |
| `RAQ-SBX-005` | open S / A=0,候选B无升级trigger且不影响P0 | Prohibited |
| `RAQ-SBX-006` | raw / report / evidence / review有效,无invalidated / orphan / static / identity mismatch | Prohibited |
| `RAQ-SBX-007` | 候选不属于当前mandatory claim、合同 /法规要求或目标阶段硬前置 | MandatoryBlocker |
| `RAQ-SBX-008` | 候选不要求新public / config /领域 /production语义,不绕DesignReopen | DesignReopen |
| `RAQ-SBX-009` | impact和证明上限有exact evidence / defect / scope refs,不是“未测所以可接受” | Rejected |
| `RAQ-SBX-010` | acceptance reason说明为何不污染P0且为何当前阶段可承受 | Rejected |
| `RAQ-SBX-011` | 实际risk owner identity与责任范围可定位 | Proposed不能成立 |
| `RAQ-SBX-012` | 实际acceptor identity、authority role与authority source可定位 | Accepted不能成立 |
| `RAQ-SBX-013` | 后续action可验证且有真实follow-up ref / owner mapping | Accepted不能成立 |
| `RAQ-SBX-014` | deadline来自权威日期或有界milestone source,同时定义expiry / reopen trigger | Accepted不能成立 |
| `RAQ-SBX-015` | human / agent review独立完成,无unresolved dispute,未回写raw / defect / VETO | Accepted不能成立 |
| `RAQ-SBX-016` | risk文件、open issues、handoff、VETO checklist和Step 14输入对账一致 | DecisionReady不能成立 |

资格检查只回答“是否允许提交 /维持接受”。最终authority仍可拒绝一个完全合格的候选,且拒绝不能被自动化改写。

---

## 6. RR-SBX-001~008动态处理口径

| Risk ID | 默认未激活路由 | 当前claim /目标触发后路由 | 可成为AcceptanceCandidate的严格窗口 | 下游动作 |
|---|---|---|---|---|
| `RR-SBX-001` PROFILE-06 durable / real-like未qualified | `DisclosureOnly`;记录NotRunConditional与证明上限 | frozen claim要求P06 / selected composition时`MandatoryBlocker` | 无;不能接受已激活P1证据缺口 | `07/09`形成composition /环境 /selected run |
| `RR-SBX-002` 无正式workload /数值阈值 | 无numeric claim时`DisclosureOnly`;P0仍按结构有界 | 合同 /claim要求SLO、容量或成本时`MandatoryBlocker` | 无;不能用接受代替权威阈值 / workload | 性能基线方案;`07/09` runner / capacity |
| `RR-SBX-003` PROFILE-07 / production / remote / hot inactive | `DisclosureOnly`;明确不具备production资格 | 任一P07 / production声明出现时`DesignReopen` | 无 | 先回写`00~04`,再重开`05/06/07` |
| `RR-SBX-004` consumer跨仓完整E2E未锁基线 | component-only claim下先`DisclosureOnly` | system /联合E2E claim要求时`MandatoryBlocker` | 仅target stage明确允许component acceptance先于联合E2E、shared seam P0有效、system authority与consumer follow-up已绑定时 | consumer `05/07` +真实joint issue /计划 |
| `RR-SBX-005` long soak / fleet lease-orphan-reaper未覆盖 | 非production target下先`DisclosureOnly` | production / soak / fleet SLO进入claim时`MandatoryBlocker`或DesignReopen | 仅进入implementation / bounded integration阶段、P0-Q lifecycle有效、ops + safety authority与pre-production stop gate完整时 | `07`实现boundary;`09` soak / reaper runbook |
| `RR-SBX-006` physical rollout / rollback / drift carrier未形成 | 未声明physical change时`DisclosureOnly` | P06+ rollout / software baseline claim要求时`MandatoryBlocker` | 无;目标要求physical success时必须形成真实carrier / evidence | `07/09` carrier、traffic / drain、rollback runbook |
| `RR-SBX-007` real sink / alert / pager / response未资格 | 不声明operator response时`DisclosureOnly` | profile /目标要求alert / response SLO时`MandatoryBlocker` | 无;不能接受缺失的运营响应能力 | `07/09`产品、route、阈值与runbook |
| `RR-SBX-008` evidence TTL /物理介质未定 | condition guard完整时为residual candidate或披露项 | 法规 /合同 /审计窗口要求数值TTL /介质时`MandatoryBlocker` | 仅无权威数值义务、当前condition guard全成立、进入implementation阶段且compliance authority接受在release前关闭时 | `07` storage / retention boundary;`09` TTL /介质 /删除runbook |

上表不改变正式`05`的八个Risk ID。RR-004 /005 /008的候选窗口也不是预先接受;任何实际记录仍需通过RAQ-001~016。

---

## 7. B级缺陷与新增Residual入口

| 候选类型 | 进入AcceptanceCandidate的附加条件 | 禁止情形 |
|---|---|---|
| open B defect | defect真实存在且DTR-009成立;不影响P0 / VETO /truth /evidence;有原failure / scope / upgrade trigger | 无defect ref、被错误降级、影响当前claim或可修复却无action |
| conditional P1 / P2 limitation | 目标未激活且只是证明上限披露时不需接受;只有target-stage transition明确承受残余时才可提案 | 已激活claim缺证据、用P1 / P2补P0 |
| operational follow-up | P0 safety guard完整,后续物理策略不改变当前truth,且目标阶段允许后置 | retention / cleanup guard不完整、法规要求已生效 |
| cross-project integration | Sandbox seam P0完整,system authority和consumer owner均可定位,follow-up有共同baseline | 把consumer业务语义 /生命周期转移给Sandbox |

任何新风险若无法回指正式scope / defect / RR来源,必须先作为open question或DesignReopen处理,不得在risk文件中自由创造一条可接受语义。

---

## 8. 风险接受记录契约

固定入口唯一为`reports/acceptance/risk-acceptance.md`,必须绑定ABSL-SBX-036与同一fixed RELEASE。即使没有接受项,也必须明确记录`accepted_set = empty`及review version,不能省略文件或暗含“无风险”。

| 字段组 | 必需内容 | 禁止替代 |
|---|---|---|
| identity | release /四source refs与digest、design / subject / claim / target stage、record / review version | branch、`latest`、CI URL或路径名作唯一identity |
| risk identity | stable risk ID、source kind / refs、affected claim / AC / defect / RR | 只有自由文本标题 |
| eligibility | qualification route、RAQ-001~016结果、P0 / VETO /S-A /evidence contamination checks | “低风险”一句话 |
| impact / reason | bounded impact、proof ceiling、acceptance reason、不可宣称内容 | 用接受理由改写测试结果 |
| evidence | runtime evidence tuple、fixed report / VCL / defect / review refs和digest | planned ESLOT、截图或手工摘要 |
| responsibility | actual owner identity / role、actual acceptor identity / authority source、review identities | 只有“负责人待填”或角色名 |
| follow-up | action、真实issue / `07` boundary / `09` runbook / consumer plan / ADR ref、verification gate | 口头承诺或只写未来处理 |
| time / invalidation | decision time、deadline / milestone source、expiry / reopen trigger、supersede refs | 无期限、可无限续期或静默沿用 |
| disposition | PendingAssessment / NotApplicableByScope / Proposed / Accepted / Rejected / Expired / Closed | checkbox、N/A、default Accepted |

### 8.1 状态转换

```text
PendingAssessment
  -> scope excludes: NotApplicableByScope
  -> RAQ complete: Proposed
  -> mandatory / reopen / prohibited: Rejected + blocker route

Proposed
  -> authority accepts: Accepted
  -> authority declines: Rejected

Accepted
  -> deadline / trigger / identity / claim changes: Expired
  -> follow-up verified: Closed
  -> defect / VETO / evidence invalidation: Expired + Paused
```

接受决定不得由generator、agent review、Step 14签署或owner自认替代。若同一主体兼任acceptor与final authority,仍必须分别形成风险接受动作和最终签署动作。

---

## 9. 不可风险接受闭集

| 类别 | 不可接受项 | 强制路由 |
|---|---|---|
| VETO / severity | `VETO-SBX-001~017`任一非NotTriggered;open S / A;VF / VETO-CFG命中 | 修复 /复验或不通过 |
| P0 | P0-C / P0-Q Failed、Blocked、InfraFailed、missing;250条P0非完整Passed | 阻断entry /放行 |
| evidence | identity、raw / report / digest、pairing、redaction、dependency、no-static、review、invalidation缺口 | EntryBlocked / Paused;补证或新packet |
| execution | target repo、suite / CI、ENV-02~05、candidate、provider、lab缺失 | execution blocker;不得接受为已覆盖 |
| scope / design | mandatory claim缺证据;new public / config / domain / P07 / production / unsupported surface | MandatoryBlocker或DesignReopen |
| security | 真实material anti-leak、provider least privilege / native audit、cleanup / containment前置缺失 | activation blocker;保持guard |
| responsibility | 无实际owner、acceptor、authority source、follow-up ref或deadline source | Pending / Rejected;不能支撑条件结论 |

风险接受不能关闭缺陷、改写VETO、改变gate状态、生成EV、补足scope或解除containment。

---

## 10. 下游同步与失效传播

| 风险方向 | 必须同步位置 | 最低同步内容 | 不得越权 |
|---|---|---|---|
| implementation / test follow-up | `07-实施计划.md` boundary / implementation ledger或真实issue | risk / action / owner / verification gate / deadline / expiry refs | `07`不得选择acceptor或声明Accepted |
| operations / profile / retention | `09-部署与运维手册.md` | product / profile / runbook / soak / alert / TTL / media / stop gate | `09`不得弱化condition guard |
| consumer E2E | 对应consumer `05/07`与joint issue / plan | shared baseline、truth owner、contract / E2E gate、target stage | 不把consumer lifecycle移入Sandbox |
| product / scope evolution | future `00~04`与ADR / open question | trigger、affected public / domain / config / claim和reopen入口 | 不由`06/07/09`私自补契约 |
| final acceptance | Step 14 conclusion input | only effective Accepted records、Rejected / Expired / disclosure set和review version | signoff不等于risk acceptance |

任一Accepted记录若follow-up ref删除 /变更、deadline到期、claim / target stage升级、identity漂移、evidence失效、B升A / S或VETO finding出现,立即转`Expired`,验收过程按APAUSE-SBX-001~012重新判定。

---

## 11. 风险接受对结论的影响

| 风险集合 | Step 13输出 | Step 14结论上限 |
|---|---|---|
| 无风险候选且`accepted_set = empty`,全部披露 /关闭项对账完整 | risk dimension clear | 可成为“通过”候选 |
| 存在有效Accepted的非P0风险,其余门禁全满足 | condition set完整 | 最多“有条件通过”候选 |
| 只有DisclosureOnly / NotApplicableByScope,无Accepted | proof ceiling披露 | 不因披露自动降为有条件通过 |
| 存在PendingAssessment / Proposed / Expired或unreviewed记录 | risk decision incomplete | 不得DecisionReady /有条件通过 |
| 存在Rejected且对应问题未关闭 | open issue / blocker | 不得放行;完整材料可进入不通过裁决 |
| 任一Prohibited / MandatoryBlocker / DesignReopen被写Accepted | risk record invalid | 不通过或Paused;触发evidence /review调查 |

Step 13不决定最终“是否允许进入下一阶段”。它只向Step 14提供有效条件集、披露集、拒绝 /过期集和不可接受冲突。

---

## 12. 正式`06` §13回填草稿

Step 15装配时,正式§13必须包含:

1. §3的资格路由与记录状态,明确范围外披露不等于风险接受。
2. §5 `RAQ-SBX-001~016`资格闭集和§8固定风险记录字段。
3. §6 `RR-SBX-001~008`动态路由,不得预填Accepted / NotApplicableByScope。
4. §7 B级 /新增residual入口与§9不可风险接受闭集。
5. §10下游同步、expiry / reopen和§11结论影响。
6. SOP表头“风险 /影响 /接受理由 /动作 /责任人 /接受人 /截止时间”必须保留,并扩展source / evidence / authority / expiry / follow-up / status字段。
7. 当前实际事实只写`risk-acceptance.md absent`,`RR-SBX-001~008 PendingAssessment`,`accepted_set unknown`,不得填写人名、日期、issue、接受或签署。

---

## 13. 当前Readiness、blocker与Step结论

| 项目 | 当前状态 | 对Step 13的影响 |
|---|---|---|
| `RR-SBX-001~008` | catalog `pending_for_06`;本Step视为`PendingAssessment` | 只能定义路由,不能接受 |
| ABSL-SBX-036 / risk file | absent | 无实际风险记录或empty accepted set |
| fixed RELEASE / claim / target stage | absent | 无法判定NotApplicable / Candidate / Blocker实例 |
| owner / acceptor / authority | role设计存在,实际identity不存在 | `Accepted`不可能成立 |
| follow-up / deadline / review | absent | `Proposed`也不能成立 |
| target repo / execution / evidence | blocked / absent | 不可risk acceptance,但不阻塞本Step规则设计 |

当前没有阻塞Step 13设计收口的未解上游blocker。开放项阻塞实际风险资格、接受、失效和有条件通过,不得伪造成accepted、none或not applicable。

```text
current_document = `06-验收标准.md`
current_step = Step 13 `定义风险接受与遗留项`
main_artifact = completed_reviewed_passed_to_step_14
rr_catalog_count = 8
current_rr_status = all_pending_assessment
actual_risk_acceptance_created = no
actual_acceptor_assigned = no
formal_document_modified = no
next_allowed_action = 用户已确认;由Step 14接续最终结论与签署口径
commit_required = no
```
