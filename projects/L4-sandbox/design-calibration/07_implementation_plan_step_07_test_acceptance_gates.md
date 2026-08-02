# L4-sandbox 实施计划 Step 7 嵌入测试与验收门禁

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/实施计划书写规范.md` §5.7
> 测试真相源: `projects/L4-sandbox/05-测试方案.md`
> 验收真相源: `projects/L4-sandbox/06-验收标准.md`
> 回填章节: `07-实施计划.md` §7 测试与验收门禁嵌入
> 创建日期: 2026-07-17
> 状态: completed_reviewed_passed_to_step_8
> 本Step口径: 在已审查的14个phase和32个commit boundary上嵌入exact TC / suite / gate、AC / VETO、artifact / report、失败传播和审查责任。本Step不创建正式`07`、implementation ledger实例、boundary skeleton、目标仓代码、commit、真实`run_id`、`EV-SBX-*`、测试结果、风险接受、验收结论或签署。

---

## 1. Step状态与开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 6 / pending_user_review`;用户已明确“同意”。 | passed_for_step_7 |
| 文档级flow | Step 1~6已依次审查传递;Step 7是唯一合法下一步。 | passed_for_step_7 |
| Step级输入 | Step 5固定14 phase;Step 6固定32 boundary、62 task、108 batch与通用Gate;正式`05/06`已审查。 | passed_for_gate_embedding |
| 正式文档写入 | 本Step只形成§7回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_7 |
| ledger / skeleton实例 | 只补Step 13机械装配输入;当前不得创建实例。 | forbidden_until_step_13 |
| runtime事实 | 当前无实现仓、suite、script、CI、ENV、candidate、run、artifact、EV、review或验收实例。 | absent_not_adjudicated |
| 下游Step | 用户已确认Step 7;Step 8已获得一次性放行。 | passed_to_step_8 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 7 `嵌入测试与验收门禁`
current_module = `implementation_test_acceptance_gates_reviewed`
gate_status = completed_reviewed_passed_to_step_8
next_allowed_action = 由Step 8承接配置、环境与外部依赖准备;若发现门禁契约冲突则回退Step 7
phase_count = 14
commit_boundary_count = 32
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 完成门禁 |
|---:|---|---|---|
| 1 | 回写Step 6审查通过,读取Step 7规范、正式`05/06`与L1粒度参考。 | done | 唯一恢复点与权威编号明确 |
| 2 | 固定测试执行、artifact / report、EV成熟度、失败传播和review规则。 | done | 不混淆targeted、source、RELEASE与acceptance事实 |
| 3 | 完成14个phase门禁矩阵。 | done | 14 /14至少一个测试门禁,适用AC / VETO完整 |
| 4 | 完成32个boundary门禁矩阵。 | done | 32 /32有提交前测试、证据去向、失败处理 |
| 5 | 完成报告生成 /审查、phase / boundary停审与跨门禁审计。 | done | 16 suite、7 gate、17 script、21 slot、17 VETO无orphan |
| 6 | 输出§7回填草稿、blocker、自检和进入Step 8条件。 | done | 停在Step 7待用户审查 |

---

## 2. 本步输入与权威边界

| 输入 | 状态 | 本Step用途 | 不得改写 |
|---|---|---|---|
| Step 5 `PH-01~14`,`PHG-SBX-01~14`,`PH-QP` | completed_reviewed | phase级门禁、准备支线和汇合顺序 | phase数量、目标、依赖 |
| Step 6 `CB-SBX-01A~14C` | completed_reviewed | boundary级提交前门禁和ledger补充输入 | boundary ID、顺序、scope、batch、commit时机 |
| 正式`05`§3~§14 | reviewed test design | 254 TC、16 suite、7 gate、17 script、21 ESLOT、九schema、路径和状态 | TC / suite / gate / slot编号、主归属、成熟度 |
| 正式`06`§3~§14 | reviewed acceptance design | AC、17 VETO、evidence gate、缺陷 /复验、risk与final decision边界 | 裁决算法、VETO predicate、review与签署责任 |
| Step 6通用9 Gate | reviewed implementation discipline | 将Test / Evidence Gate展开为exact输入 | Activation / Design / Scope / Commit / Handoff语义 |
| L1-governance / L1-artifact Step 7 | granularity reference | 参考phase / boundary / evidence /停审密度 | 不继承领域ID、旧路径或旧gate-summary名称 |

权威冲突裁决:

1. 测试编号、suite、gate、script、artifact和report以当前正式`05`为准。
2. AC、VETO、evidence gate、review、risk与final decision以当前正式`06`为准。
3. 实施顺序、scope和commit boundary以已审查Step 5 /6为准。
4. 若三者无法同时成立,当前phase / boundary立即`blocked / wait_design`,回写owner文档并固定新design baseline;Step 7不得用近似编号或新增脚本绕过。

---

## 3. SOP 15项问题回答

| # | SOP问题 | 本Step回答 /落点 |
|---:|---|---|
| 1 | 每阶段执行哪些测试 | §7逐phase绑定exact suite / TC family / check。 |
| 2 | 哪些阶段对齐AC | PH-04~14按功能 /协议 /状态 / NFR对齐;PH-01~03绑定ARCH / CONFIG / evidence前置AC。 |
| 3 | 每个门禁产出什么证据 | §6.1 / §6.3固定raw、report、check、slot与成熟度;无producer时必须写`no_runtime_artifact`及具体理由。 |
| 4 | 失败能否进入下一阶段 | P0、VETO风险、identity、pairing、redaction、dependency失败均禁止;P1未激活只保留`NotRunConditional`且不补P0。 |
| 5 | 自动化与人工边界 | suite / check / schema / pairing自动化;acceptance四draft与两份独立review必须由人 / Agent审查。 |
| 6 | 哪些VETO提前规避 | 17项全部前移;§8逐boundary绑定最小相关VETO,§10.4做17 /17反查。 |
| 7 | 每阶段调用哪些gate script | §6.4 / §7列exact planned script;早期direct Cargo / fixture checks不伪装脚本已存在。 |
| 8 | artifact输出 | 所有实际run只允许`artifacts/test/<run_id>/...`;路径见§6.3。 |
| 9 | report输出 | 有合法raw的targeted / source run使用`reports/runs/<run_id>/...`;不得手写补raw。 |
| 10 | acceptance输出 | 仅14C形成四份draft生成能力;真实文件只在future fixed RELEASE packet中形成。 |
| 11 | 哪些报告需审查 | handoff、veto、risk、open issues、reviewer notes、agent review和最终裁决输入都需独立审查。 |
| 12 | 每boundary提交前门禁 | §8覆盖32 /32的suite / TC、AC / VETO、artifact / report和失败处理。 |
| 13 | phase / boundary / evidence缺口 | §10.5审计phase有门禁而boundary无门禁、有测试无证据owner、slot无producer等缺口。 |
| 14 | 门禁是否逐项停审 | §9对14 phase和32 boundary分别停审;只表示设计可执行。 |
| 15 | 跨门禁是否通过审计 | §10反查16 suite、7 gate、17 script、21 slot、17 VETO、254 TC和review责任。 |

---

## 4. 当前材料问题诊断

| 问题 | 风险 | 本Step处理 |
|---|---|---|
| Step 6 checks偏结构和family方向 | 实现者可能只跑cargo /局部测试,没有正式TC / AC / VETO归属 | 为32 boundary补exact suite / family和验收风险 |
| 16 suite是全局catalog | phase结束或commit前可能随意选择suite | 将suite压到14 phase和32 boundary,保留主归属与补强区别 |
| targeted run与fixed source run容易混用 | 局部绿色可能被错误升格为P0 / RELEASE结果 | 固定四级成熟度与禁止升格规则 |
| 21 ESLOT是planned catalog | 可能预分配`EV-SBX-*`或静态补洞 | 只有合法raw / report pair和validation controls后才允许future runtime分配 |
| acceptance draft路径已固定 | 实现阶段可能提前写Pass、risk accepted或签署 | 14C只实现generator / fixture,真实review /裁决仍属future验收过程 |
| P0-Q现实输入缺失 | 可能用P0-C / ENV-06替代或删除门禁 | 13A /13B保持Blocked activation;identity缺失0 launch |
| bootstrap早于artifact infrastructure | 可能要求01A生成尚不存在的schema artifact | 明确结构性门禁与`no_runtime_artifact`记录,不伪造run / EV |

---

## 5. 改动前后与设计取舍

| 维度 | Step 6后 | 本Step后 |
|---|---|---|
| Phase门禁 | PHG方向和planned suite | 14 /14 exact suite / script / AC / VETO / evidence /失败传播 |
| Boundary门禁 | required checks与Evidence Gate骨架 | 32 /32提交前测试、artifact / report、AC / VETO和review责任 |
| Evidence成熟度 | generic artifact applicable / N/A | structural -> targeted -> fixed source -> RELEASE -> acceptance严格分层 |
| 报告责任 | schema和路径已有 | generator、raw owner、reviewer和adjudicator分离 |
| VETO | formal catalog | 17项前置到具体phase / boundary,但不预写disposition |

| 取舍 | 选择 | 理由 |
|---|---|---|
| 每boundary分配正式EV | 不采用 | baseline与fixed source尚未形成,会制造静态alias或失效事实。 |
| 每boundary生成targeted raw / report | producer存在后采用 | 支持提交审查,但不自动进入RELEASE evidence index。 |
| 01A~02B强制machine artifact | 不采用 | canonical / script producer尚未实现;以真实结构检查记录并写N/A理由更诚实。 |
| P0-C代替P0-Q | 禁止 | 两轴均为P0必要证明,能力边界不同。 |
| 自动生成acceptance结论 | 禁止 | generator无review、risk acceptance或签署authority。 |
| 早期运行全量suite | 仅受影响回归需要时 | targeted owner先最早失败;12B /14A再收口完整source能力。 |

---

## 6. 门禁成熟度与统一失败语义

### 6.1 五级成熟度

| 级别 | 适用位置 | 允许形成 | 禁止升格 |
|---|---|---|---|
| `G0 Structural` | 01A~02B及无artifact producer的结构检查 | command / assertion记录、targeted test结果、boundary ledger check状态 | 不创建run、ESLOT item、EV或P0结论 |
| `G1 Targeted` | 02C后受影响suite / fixture / check | `artifacts/test/<run_id>` raw及配对targeted report | 不作为MAIN / OPS / P0Q source,不分配RELEASE结论 |
| `G2 Fixed Source` | 12B MAIN-CONTRACT / MAIN-SEAM / OPS能力;13B P0Q能力 | formal source context、完整suite / check raw和source reports | source capability不等于已存在source run或Passed |
| `G3 RELEASE` | 14A /14B聚合与evidence能力 | 按序四source校验、evidence index、gate / report packet | 缺任一source保持Blocked;聚合器不自产P0证明 |
| `G4 Acceptance` | 14C generator与future验收过程 | 四draft、两review、未来三值裁决与签署契约 | 实施脚本不得填写verdict、risk accepted、reviewed或signed |

### 6.2 统一失败与暂停表

| 失败类型 | 当前boundary可提交 | 下一boundary可激活 | 状态 /处理 |
|---|---|---|---|
| format / compile / lint失败 | 否 | 否 | 修复当前scope并重跑Build / Test Gate |
| mandatory TC / suite Failed | 否 | 否 | 保留失败材料;修复后新run,不得覆盖 |
| InfraFailed | 否 | 否 | 修复环境 / harness;不得映射产品Failed或Passed |
| Blocked前置 | 否 | 否 | 设计缺口为`blocked / wait_design`;现实依赖缺失记`dependency_wait`原因并映射`blocked / handoff`;缺项不得默认 |
| schema / digest / path失败 | 否 | 否 | 保留原artifact;修writer / verifier后新run |
| raw / report pairing失败 | 否 | 否 | 不分配EV;禁止手写report补洞 |
| redaction命中 | 否 | 否 | S级 / VETO风险;隔离材料并扩大受影响复验 |
| dependency boundary违规 | 否 | 否 | 移除非core编译依赖或回写架构;不可风险接受 |
| VETO `Triggered` | 否 | 否 | S级缺陷、停止相关launch、至少L-R5;历史immutable |
| VETO `Blocked / Disputed / NotEvaluated` | 否 | 否 | 不能写NotTriggered或DecisionReady |
| P0-Q identity缺失 | 否 | 否 | 13A /13B保持Blocked且probe / launch=0 |
| P1未激活 /不适用 | 仅不影响P0 boundary时可 | 可,但不得补P0 | `NotRunConditional`;保留formal trigger条件 |
| review缺失 /争议未清 | 实现commit可按14C generator门禁处理;验收不可结束 | 不得进入DecisionReady | 保持draft / Pending / Disputed |

### 6.3 Artifact、report与状态固定入口

下表只定义未来运行必须使用的固定入口。`<run_id>`是运行时由合法writer生成的opaque identity,不是本Step分配的实例;禁止使用`latest`、project子目录、acceptance / review的run子目录或从路径推断identity。

| 对象 | 唯一固定入口 | 最低真实性要求 | 允许成熟度 |
|---|---|---|---|
| run context | `artifacts/test/<run_id>/meta/context.json` | launch前固定run / parent、intent / scope、trigger / change refs、gate、ENV / PROFILE、revisions、roots和digest;source run另固定role | G1~G3 |
| source / config identity | `artifacts/test/<run_id>/meta/source-commits.json`;`meta/config-digest.json` | design / subject / core / harness revision与generation / redacted config / material digest可定位;错配不得补默认 | G1~G3 |
| suite raw | `artifacts/test/<run_id>/suites/<suite_id>/report.json`;`cases/<tc_id>/<parameter_id>.json`;redacted `stdout.log` / `stderr.log` | 保留exact TC / parameter / assertion、status、failure、safe ref、digest和resource disposition;失败也写raw | G1~G3 |
| raw check | `artifacts/test/<run_id>/checks/<check>.json` | 固定expected / observed / missing / duplicate / status和safe finding;不得只输出布尔值 | G1~G3 |
| qualification raw | `artifacts/test/<run_id>/suites/SUITE-SBX-013/qualification-result.json` | 同一candidate / profile / generation / ENV / capability / template / provider identity、probe refs与teardown / containment | G2~G3 |
| machine evidence index | `artifacts/test/<run_id>/evidence-index.json` | 只从合法四source raw / report pair和validation controls派生;item有nonempty TC / AC / artifact / report refs及digest | G3 |
| run / suite report | `reports/runs/<run_id>/summary.md`;`suites/<suite_id>.md` | 只读固定raw;原样保留Failed / Blocked / InfraFailed / NotRunConditional | G1~G3 |
| gate / coverage report | `reports/runs/<run_id>/gate-results.md`;`tc-coverage.md`;`protocol-inventory.md`;`per-coverage.md` | 固定source identity、254主归属、55协议和PER producer;不得另造`gate-summary.md` | G2~G3 |
| integrity report | `reports/runs/<run_id>/redaction-check.md`;`dependency-boundary.md`;`report-audit.md` | 回指每项raw check path / digest / status;pairing、no-static、blocked propagation和cleanup不得只写总结 | G1~G3 |
| human evidence view | `reports/runs/<run_id>/evidence-index.md`;`evidence/<evidence_id>.md` | 只投影machine index;不得手工新增EV、改变status或删除missing | G3 |
| acceptance draft | `reports/acceptance/handoff.md`;`veto-checklist.md`;`risk-acceptance.md`;`open-issues.md` | 正文固定RELEASE与四source digest;只生成待审输入,不预填结论 /接受 /签署 | G4 |
| independent review | `reports/review/reviewer-notes.md`;`agent-review.md` | 独立记录identity / version / time、orphan / digest / redaction / trace findings与争议 | G4 |

补充约束:

1. `CB-SBX-01A~02B`尚无统一artifact producer,其boundary ledger只能记录`no_runtime_artifact`及具体理由;不得虚构run目录来满足表面配对。
2. 从`CB-SBX-02C`起,只要某项required check生成machine raw,同一targeted run就必须生成配对report或明确Failed / Blocked;没有pair不得分配runtime `EV-SBX-*`。
3. G1 targeted run只能证明当前revision / scope的局部增量,不得写`release_source_role`,不得被MAIN / OPS / P0Q / RELEASE聚合器消费。
4. G2 source run必须使用正式`05`§9.2 / §13.4固定role、ENV、PROFILE和manifest;MAIN-CONTRACT与MAIN-SEAM必须为不同run。
5. G3 RELEASE只按`MAIN-CONTRACT -> MAIN-SEAM -> OPS -> P0Q`聚合;聚合器自身不运行P0 case、不修正source status、不从`latest`选源。
6. 所有JSON遵守RFC 8785、顶层自身digest排除、`sha256:<64 lowercase hex>`、集合排序去重和仓根相对路径约束。原artifact在digest / schema失败后保持immutable。
7. retention只承接正式`05`§13.5的condition-based guard;本Step不发明TTL天数,也不把test artifact retention与sandbox resource cleanup混为一个owner。

### 6.4 17个planned script责任闭集

| Planned script | 首次实现boundary | 最终责任 | 失败 /越权处理 |
|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | 02D最小;12B完整 | 承载PR、MAIN两个role及受影响targeted suite selector,显式写intent / scope / trigger / change refs | nonzero并保留首个failure / infra;不得把PR / targeted升格为MAIN |
| `scripts/gates/run_operations_gate.sh` | 14A;12B先形成OPS writer能力 | 运行ENV-04 operations source和SUITE-012 + expanded 007~010 /014 | 缺replay / cleanup disposition或source identity即阻断 |
| `scripts/gates/run_backend_conformance_gate.sh` | 13B | 校验immutable qualification manifest后执行SUITE-013 | identity缺失`Blocked`且probe / launch=0;不得替换candidate |
| `scripts/gates/run_release_gate.sh` | 14A | 按固定顺序校验四source identity / digest并聚合RELEASE | 任一缺失、错序、错role、错digest或异常保持Blocked |
| `scripts/gates/run_selected_real_like_gate.sh` | 14A | 只运行已正式激活的PROFILE-06 / SUITE-015 conditional scope | 未资格化为`NotRunConditional`;不得补P0 |
| `scripts/reports/generate_reports.sh` | 02D最小;14B完整 | 分stage从raw生成suite / run / evidence人读投影 | 缺raw / schema错nonzero;不得推断Pass或手写补洞 |
| `scripts/reports/generate_gate_results.sh` | 14B | 从fixed source / RELEASE raw生成唯一`gate-results.md` | 原样保留Blocked / Failed / conditional;不得另建同义summary |
| `scripts/reports/generate_acceptance_handoff.sh` | 14C | 生成四份acceptance draft并固定RELEASE /四source refs | 不得写三值verdict、risk accepted、reviewed或signed |
| `scripts/checks/check_redaction.sh` | 02D最小;12B完整 | 扫描artifact / run report / acceptance / review四层root和deny marker | 命中即Failed且finding不回显正文;安全材料隔离 |
| `scripts/checks/check_dependency_boundary.sh` | 02D最小;12B完整 | 对账manifest / graph,只允许core-contracts sibling compile edge | 非core sibling或模块越界即Failed,不得风险接受 |
| `scripts/checks/check_tc_coverage.sh` | 14A;12A先形成manifest | 对账254 TC、maturity与唯一suite owner | missing / duplicate /换义即Failed,不得声明P0覆盖 |
| `scripts/checks/check_protocol_inventory.sh` | 14A;12A先形成manifest | 对账10 Command +13 Query +9 Consumer +13 Event +10 Job =55 | 缺失 /错族即Failed,AC-SBX-031不可通过 |
| `scripts/checks/check_artifact_report_pairing.sh` | 14A;02D最小检查 | 对账blocking invocation / evidence item的raw / report / digest pair | missing / orphan即Failed,禁止分配 /接受EV |
| `scripts/checks/check_no_static_evidence.sh` | 02D最小;14A完整 | 禁止静态EV / pass / signature及无raw回链的draft | 命中即Failed并触发VETO-SBX-017评估 |
| `scripts/checks/check_qualification_identity.sh` | 13A preflight;14A收口 | 校验candidate / profile / generation / ENV / material / provider连续性 | missing为Blocked +0 launch;错配为Failed |
| `scripts/checks/check_blocked_propagation.sh` | 14A;02D先验证safe enum | 禁止Blocked / InfraFailed / NotRunConditional映射为Skipped / Passed / N/A | 任一非法映射使RELEASE失败 |
| `scripts/checks/check_cleanup_disposition.sh` | 13B;14A收口 | 校验每个test resource的cleaned / contained / investigation / teardown处置 | active / orphan / guard bypass / teardown失败阻断evidence / entry |

`02D`,`12A /12B`,`13A /13B`,`14A~14C`之间的“最小入口 / producer能力 /完整编排”是同一planned script的渐进实现,不是第二套脚本。任何CLI参数细化必须保持正式`05`§9.3输入和状态语义,不得新增同义入口绕过17项闭集。

### 6.5 7个formal gate嵌入位置

| Gate | 最早增量验证 | 完整执行 /收口boundary | 必需输入 | 证明上限与失败传播 |
|---|---|---|---|---|
| `GATE-SBX-PR` | 02D后每个受影响boundary | 14A selector完整 | ENV-02;SUITE-001~004 +016及dependency / TC manifest适用slice | 只最早失败;Failed / InfraFailed阻merge,不替代MAIN |
| `GATE-SBX-MAIN` | 12B | 14A /14B | 不同run的MAIN-CONTRACT:ENV-02 / PROFILE-02 /001~011 +014;MAIN-SEAM:ENV-03 / PROFILE-03 /005 /008 /010 /011 | 任一role缺失 /错配阻断;两个role不得合并 |
| `GATE-SBX-OPS` | 11C targeted simulation | 12B source writer;14A /14B收口 | ENV-04 / PROFILE-04;012 + expanded 007~010 /014;cleanup / pairing | 不证明candidate;Failed / missing不能作RELEASE input |
| `GATE-SBX-P0Q` | 13A identity preflight | 13B source writer;14A /14B收口 | ENV-05 / PROFILE-05;单一packet;SUITE-013;identity / redaction / cleanup | 当前现实输入开放;Blocked / Failed / substitution均阻断P0-Q |
| `GATE-SBX-RELEASE` | 14A failure fixtures | 14A /14B | 同baseline四source固定identity / digest与全部controls | 只聚合不自产证明;任一异常保持Blocked |
| `GATE-SBX-P1` | 14A conditional selector | 14A /14B | formal trigger后的ENV-06 / PROFILE-06 / SUITE-015 | 未激活`NotRunConditional`;不改变P0 |
| `GATE-SBX-SCOPE-REOPEN` | 03A unsupported / absence slice | 14A /14C审计 | design diff + SUITE-003 /016 + trigger / change refs | 命中新public / config / remote / hot surface先回写`00~04`,暂停实现 |

### 6.6 自动化、review与adjudication责任分离

| 责任角色 | 可执行 | 必须检查 | 禁止 |
|---|---|---|---|
| boundary implementer / test runner | 运行当前required suite / check,生成immutable raw并记录boundary ledger | exact revision / scope、首个失败、resource disposition、无关worktree保护 | 自行缩减mandatory TC、删除失败run、填写EV /验收结论 |
| report generator | 从固定raw生成suite / gate / evidence / acceptance draft | schema、digest、source role、status fidelity、missing项 | 推断Pass、改raw、默认VETO NotTriggered、生成签署 |
| boundary reviewer | 提交前审查测试增量、raw / report pair、AC / VETO风险和失败处置 | staged scope、目标TC、safe output、G0 N/A理由或G1 pair | 用代码review替代machine check、把targeted结果升格source |
| test / evidence owner | 审查fixed source manifest、validation controls、slot producer与RELEASE index | 254 /55 /21、四source顺序、pairing、redaction、cleanup | 为missing slot手写alias或选择性忽略Failed source |
| independent human reviewer / Agent | 分别写`reviewer-notes.md`与`agent-review.md` | identity、orphan、digest、redaction、trace、VETO / defect / risk来源与争议 | 编辑raw / report状态、代替另一review、把Disputed吞并 |
| acceptance adjudicator / signer | 按正式`06`聚合entry、AC、VETO、defect、risk和review并在未来签署 | FormalEntryReady、DecisionReady、三值算法、authority与失效条件 | 让script / implementer代签,接受VETO / S级缺陷,把draft当裁决 |

---

## 7. 14个Phase测试与验收门禁矩阵

表中`CTR / CMD / QRY / CNS / EVT / JOB / STA / TXN / RACE / ERR / CFG / ARCH / CONF / COND`均指正式`TC-SBX-*` family,不是新ID。所有“执行 /输出”均为未来完成门禁,不表示当前已运行。

| Phase | 测试门禁 | 验收门禁 | 执行脚本 | artifact输出 | report输出 | 失败处理 |
|---|---|---|---|---|---|---|
| PH-01 | G0 workspace / Cargo metadata / seven-crate / binary / target version / only-core dependency结构检查;ARCH-001 /003的可执行前置 | AC-SBX-031 ARCH-SLICE;VETO-SBX-005 /016 | direct `cargo metadata --no-deps`,`cargo check --workspace`与manifest审查;此时planned script尚不存在 | `no_runtime_artifact`:只在boundary ledger记录command、revision和无producer理由 | 无runtime report;handoff记录结构检查摘要 | 任一HDO / version / core revision / dependency失败均不得进入PH-02;设计冲突`wait_design` |
| PH-02 | SUITE-SBX-001全6 CTR;UoW / replay kernel fixture;canonical / path / digest及minimal script safe-failure fixtures | AC-SBX-031 /034 /035 /039 /040;VETO-SBX-005 /006 /013 /016 /017 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_dependency_boundary.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_no_static_evidence.sh`的最小入口 | 02C前为G0;phase结束形成G1 `meta/*`,`suites/SUITE-SBX-001/*`,`checks/*`synthetic / targeted raw | `summary.md`;`suites/SUITE-SBX-001.md`;适用integrity report | 任一carrier / canonical / replay / script failure阻断;不得把fixture算ESLOT item或MAIN source |
| PH-03 | SUITE-SBX-003 /008 targeted:CFG-001~030、ARCH-001~003、strict generation / material / publication / parity / unsupported absence | AC-SBX-031 /034 /035 /037 /038 /041;VETO-SBX-002 /006~008 /016 /017 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_dependency_boundary.sh`;`scripts/checks/check_redaction.sh`;scope-reopen selector | G1 suite raw与config / safe material / dependency check raw | suite reports;`dependency-boundary.md`;`redaction-check.md` | invalid / partial generation、unsafe material、fallback或new surface均阻断;new surface先DesignReopen |
| PH-04 | SUITE-SBX-002 /004 targeted:CMD-001/002、STA-001~003、ERR-014/015及适用TXN / RACE / rollback / replay补强 | AC-SBX-006~008 /026 /032~035 /037~041;VETO-SBX-001 /002 /005 /006 /010 /013 /016 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_dependency_boundary.sh` | G1 intake / protocol / consistency / audit suite raw与checks | suite reports;targeted redaction / dependency reports | anonymous / unresolved误接收、正文入仓、accepted group非原子或duplicate重算均阻断 |
| PH-05 | SUITE-SBX-002 /004 /008 targeted:CMD-003/004、STA-004~009、ERR-006/007/027/029/030及适用TXN / RACE;active identity前置、四维隔离 + workspace requirement all-or-nothing与weak-fallback=0 | AC-SBX-009~011 /027 /032~041适用;VETO-SBX-001~003 /005 /006 /010 /013 /016 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_dependency_boundary.sh` | G1 boundary / consistency / config / audit raw;P0-Q仍无qualification raw | suite / integrity targeted reports | active identity或任一required dimension缺失 /unsupported /跨代、partial handle、I065 /lease错误或fake升格P0-Q均阻断 |
| PH-06 | SUITE-SBX-002 /004 /010 targeted:CMD-005/006/008、STA-010~012、ERR-005及适用TXN / RACE;所有non-allow backend call=0 | AC-SBX-012~015 /028 /032~035 /037~041;VETO-SBX-001 /004~006 /010 /013 /016 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_blocked_propagation.sh` | G1 policy / replay / error / audit suite raw与checks | suite reports;targeted redaction / status fidelity report | missing / stale / conflict / unsupported / high-risk unauthorized任何launch或旧decision复用均阻断 |
| PH-07 | SUITE-SBX-002 /004 /008 /010 targeted:CMD-007~012、STA-013~015、ERR-009/035~038及适用TXN / RACE;run / capture / handoff no-rollback | AC-SBX-016~019 /029 /032~035 /037~041;VETO-SBX-001 /005 /006 /009~011 /013 /016 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_artifact_report_pairing.sh` | G1 execution / protocol / replay / consistency / error / audit raw | suite reports;targeted redaction / report-audit | guard前launch、lease重算、raw output、Partial升格或delivery失败回滚capture均阻断 |
| PH-08 | SUITE-SBX-002 /004 /010 /012 targeted:CMD-013~020、STA-016~019、ERR-010/011及适用TXN / RACE;non-Allowed release=0 | AC-SBX-020~023 /030 /032~035 /037~041;VETO-SBX-001 /005 /006 /010 /012~016 | `scripts/gates/run_ci_gate.sh`;`scripts/gates/run_operations_gate.sh` targeted;`scripts/reports/generate_reports.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_cleanup_disposition.sh` | G1 safety / operations / error / audit raw与cleanup disposition | suite reports;`redaction-check.md`;targeted `report-audit.md` | unknown=>success、early delete、force release、advisory redline或无disposition均阻断并保留调查材料 |
| PH-09 | SUITE-SBX-004 /011 /014 targeted:QRY-001~026、STA-020~023、RACE-019;13/13 read surface、typed lookup、bounded selection、write=0 | AC-SBX-018 /020~023 /030~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009 /010 /012 /016 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_protocol_inventory.sh`;`scripts/checks/check_dependency_boundary.sh` | G1 read / protocol / consistency / audit / boundedness raw | query / protocol suite reports;targeted inventory report | finder缺失scan、cursor混型、visibility泄漏、Query write / audit append / repair均阻断 |
| PH-10 | SUITE-SBX-005 /008 /011 targeted:CNS-001~022、EVT-001~015、STA-024、RACE-014/015;9 Consumer +13 Event完整 | AC-SBX-008 /012 /015 /017~023 /029~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009~013 /016 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_protocol_inventory.sh`;`scripts/checks/check_artifact_report_pairing.sh` | G1 protocol / relay / replay / consistency / audit / arch raw | consumer / event / protocol reports;integrity reports | trusted-source绕过、body泄漏、dedup混同、payload非source snapshot或publish回滚source均阻断 |
| PH-11 | SUITE-SBX-006 /012 targeted:JOB-001~012及适用TXN / RACE;10/10 job、bounded selection、stored report、partial与no-repair | AC-SBX-018~023 /030~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009~016 | `scripts/gates/run_ci_gate.sh`;`scripts/gates/run_operations_gate.sh` targeted;`scripts/reports/generate_reports.sh`;`scripts/checks/check_cleanup_disposition.sh`;`scripts/checks/check_artifact_report_pairing.sh` | G1 job / safety / read / relay / replay / config / audit raw | job / operations reports;targeted cleanup / report-audit | job修core truth、整批重复副作用、Failed无report、partial隐藏或guard bypass均阻断 |
| PH-12 | SUITE-SBX-001~012 /014 /016;237 P0-C、55 protocol、30 owner machines /31 canonical enum entries /39 shared declarations、38 error、14 TXN、19 race;MAIN-CONTRACT / MAIN-SEAM / OPS role与9 controls | AC-SBX-006~041全部P0-C slice;VETO-SBX-001~017的P0-C producer / integrity面 | `scripts/gates/run_ci_gate.sh`;`scripts/gates/run_operations_gate.sh`;`scripts/reports/generate_reports.sh`;§6.4全部9个`check_*`路径 | G2 MAIN-CONTRACT / MAIN-SEAM / OPS fixed source raw能力;ESLOT-001~016 producer / pair | 各source完整run / suite / gate / coverage / inventory / integrity reports | orphan、分母漂移、role混用、race不确定、pairing / redaction / blocked传播失败均阻断;不得预写source Passed |
| PH-13 | SUITE-SBX-013全13 CONF;qualification identity preflight、四维 / lifecycle / capture / reaper / redline / substitution、redaction与cleanup | P0-Q适用AC-SBX-008~011 /013~014 /016~023 /027~030 /034~035 /037~041;AC-SBX-031 ARCH-SLICE supporting;VETO-SBX-001~017适用predicate | `scripts/gates/run_backend_conformance_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/check_qualification_identity.sh`;`scripts/checks/check_redaction.sh`;`scripts/checks/check_cleanup_disposition.sh`;`scripts/checks/check_blocked_propagation.sh` | G2 P0Q fixed source能力;qualification result;ESLOT-017~019 producer | SUITE-013 report;qualification / identity / redaction / cleanup reports | candidate packet任一identity缺失时Blocked且0 probe;失败保留product disposition与teardown / containment |
| PH-14 | 全部适用SUITE-SBX-001~016、7 gate、17 script、9 controls、21 slot;四sourceRELEASE聚合和acceptance draft generator audit | AC-SBX-006~041与EG-SBX-001~021;VETO-SBX-001~017;正式`06`entry / defect / risk / final规则 | §6.4全部5个gate、3个report与9个check exact路径;P1 / scope只在formal trigger下 | G3 RELEASE index / raw checks;G4 draft输入;020 /021仅formal trigger时expected | 完整run / gate / evidence / integrity reports;四acceptance draft;未来两review | 任一source / control / slot / review缺失保持Blocked;generator不得写verdict / risk accepted / review / signature |

### 7.1 Phase报告生成与审查责任

| Phase范围 | 生成脚本 /输入 | 输出 | 人 / Agent审查要求 |
|---|---|---|---|
| PH-01 | 无统一producer;direct structural checks | boundary ledger中的`no_runtime_artifact`和handoff摘要 | boundary reviewer确认无producer理由真实,且未用空run伪造证据 |
| PH-02~11 | `scripts/reports/generate_reports.sh`读取同一G1 targeted raw | `reports/runs/<run_id>/summary.md`,`suites/*.md`及适用integrity report | boundary reviewer核scope、exact family、failure、pairing与成熟度;设计缺口由designer回写owner文档 |
| PH-12 | `scripts/reports/generate_reports.sh`;source writer与validation raw | 三个G2 source各自run / suite / coverage / inventory / integrity report | test / evidence owner确认MAIN双role分run、OPS独立、237分母和ESLOT-001~016 producer;不得写source存在 /通过事实 |
| PH-13 | `scripts/reports/generate_reports.sh`;P0Q raw / qualification result | P0Q suite / qualification / identity / redaction / cleanup reports | qualification + security reviewer核同一packet与0 substitution;缺现实输入保持Blocked |
| PH-14 | `scripts/reports/generate_gate_results.sh`;`scripts/reports/generate_reports.sh`;`scripts/reports/generate_acceptance_handoff.sh` | RELEASE gate / evidence packet、四acceptance draft | 两名独立reviewer未来分别写review文件;acceptance adjudicator按正式`06`裁决,实现者 / generator无authority |

---

## 8. 32个Commit Boundary提交前门禁矩阵

矩阵叠加Step 6的`CG-SBX-BASE`与`HG-SBX-BASE`,不替代format / build / staged scope / message / ledger检查。`Suite / TC`列只消费正式`05`;`AC / VETO`列只消费正式`06`。`artifact`和`report`均指未来成功实现producer后必须生成的输出,不是当前实例。

### 8.1 PH-01~PH-08: `CB-SBX-01A~08B`

| Boundary | 提交前exact suite / TC门禁 | AC / VETO关联 | Artifact输出 | Report输出 | 成熟度与失败处理 | Review责任 |
|---|---|---|---|---|---|---|
| `CB-SBX-01A` | direct Cargo / package / binary / dependency graph结构检查;ARCH-001 /003只能在目标仓形成后判定 | AC-SBX-031 ARCH-SLICE;VETO-SBX-005 /016 | `no_runtime_artifact`:boundary ledger记录command、target revision与无producer理由 | 无`reports/runs`;handoff摘要记录seven-crate / only-core检查 | G0;HDO、target version、core revision、workspace / graph任一不闭合即不提交 /不激活02A | build / architecture reviewer核路径、依赖方向和无业务scope;design owner关闭现实前置 |
| `CB-SBX-02A` | SUITE-SBX-001 contract slice:CTR-001~006;roundtrip、required field、typed-ref family、metadata / digest input、body-free / redaction | AC-SBX-031 /034 /035 /039 /040;VETO-SBX-005 /006 /016 | `no_runtime_artifact`:contract test结果与assertion只记boundary ledger,尚无canonical writer | 无run report;handoff列exact 6 /6 CTR结果与失败ref | G0;任一carrier / ref / metadata / safe-surface失败即不提交;不得先实现业务DTO绕过 | contracts + security reviewer核formal type owner和forbidden-body拒绝 |
| `CB-SBX-02B` | SUITE-SBX-007 kernel precondition;TXN-001~014涉及的staged commit / rollback / version / cursor / three-channel replay primitive fixtures,但不冒充具体flow主结果 | AC-SBX-032 /039 /040;VETO-SBX-010 /012 /013 | `no_runtime_artifact`:semantic fake trace与stored replay assertion记ledger | 无run report;handoff摘要固定rollback / version / replay contract | G0;fake无法证明all-or-nothing、version loser或stored replay即不提交;不得统计237主case | application / infra consistency reviewer核fake parity和无domain-specific私有语义 |
| `CB-SBX-02C` | canonical / noncanonical / self-digest / path escape / schema status / redaction writer-reader fixtures;不认领业务suite主结果 | AC-SBX-035 /039;EG-SBX-001~007前置;VETO-SBX-006 /017 | fixture-only `artifacts/test/<run_id>/meta/*`,`checks/*`及safe schema样本;无source role / EV | `reports/runs/<run_id>/summary.md`与fixture detail,只从raw生成 | G1 fixture-only;RFC 8785工具未固定、digest / path / schema任一失败即不提交;原失败样本保留 | evidence tooling + security reviewer核canonical bytes、self-digest、path和safe finding |
| `CB-SBX-02D` | minimal script syntax / lint / missing-input / nonzero / safe-output fixtures;VC-001 /002 /006最小面;不认领业务TC | AC-SBX-031 /035 /039;EG-SBX-010 /011 /015 /017前置;VETO-SBX-006 /016 /017 | G1 synthetic `meta/*`,`checks/{redaction,dependency,no-static}.json`与script invocation raw | `summary.md`,`redaction-check.md`,`dependency-boundary.md`,`report-audit.md`最小投影 | G1;Shell规则 / lint未固定或任一失败被吞并即不提交;不得生成release / acceptance输出 | automation + evidence reviewer核6个入口、参数、退出码、四态传播和无静态pass |
| `CB-SBX-03A` | SUITE-SBX-003:CFG-001~030 + ARCH-001~003适用;strict unknown / duplicate / ambiguous / unsupported、40 /101 /44 coverage、redacted issue | AC-SBX-031 /035 /037 /038 /041;VETO-SBX-006~008 /016 | G1 `suites/SUITE-SBX-003/*`及dependency / redaction raw checks | suite report、`dependency-boundary.md`,`redaction-check.md` | G1;invalid输入非0 publication、分母漂移、unsafe issue或unsupported silent ignore均不提交;new surface DesignReopen | config + architecture + security reviewer核FDT / NCFG / FC / XVAL与absence |
| `CB-SBX-03B` | SUITE-SBX-003 /008 targeted:CFG generation / material / profile / availability / atomic publication / parity;P05缺前置拒绝、P06 conditional、P07 reopen | AC-SBX-010 /011 /031 /034 /035 /037 /038 /041;VETO-SBX-002 /003 /006~008 /016 | G1 config generation、safe material descriptor、adapter parity suite raw与redaction checks | suite reports、targeted redaction / scope report | G1;partial / mixed generation、raw material、P05 fallback或P06 /07冒充P0均不提交 | config / material / runtime-builder reviewer核same-generation complete set与lease / revoke边界 |
| `CB-SBX-04A` | SUITE-SBX-002 /004 contract-domain slice:CMD-001/002、STA-001~003、ERR-014/015;constructor / factory / illegal / terminal / forbidden-body | AC-SBX-006~008 /026 /032~035 /037~041;VETO-SBX-001 /002 /005 /006 /010 /016 | G1 `suites/SUITE-SBX-002/*`,`SUITE-SBX-004/*`的intake case raw及safe contract artifacts | 对应suite reports与targeted redaction report | G1;anonymous / unresolved变Accepted、wrong ref、正文进入carrier或状态不闭合即不提交 | contracts / domain / security reviewer核Command 1 source map、factory和event payload |
| `CB-SBX-04B` | SUITE-SBX-004主slice +002 /007 /009 /010补强:CMD-001/002及intake适用TXN / RACE / ERR;accepted / rejected / unresolved / duplicate / conflict / rollback / call budget | AC-SBX-006~008 /026 /032~041;VETO-SBX-001 /002 /005 /006 /010 /013 /016 | G1 intake service / consistency / error / audit raw与redaction check | suite reports、targeted `redaction-check.md` / `report-audit.md` | G1;accepted group非原子、duplicate重算、entry绕service、resolver body入仓或rollback可见即不提交 | application / transaction / API / audit reviewer核UoW side-effect inventory与stored replay |
| `CB-SBX-05A` | SUITE-SBX-002 /004 contract-domain slice:CMD-003/004、STA-004~009、ERR-006/007/027/029/030;active identity、四维隔离 + workspace requirement、coherent set、handle / lease、weak fallback factory | AC-SBX-009~011 /027 /032~041适用;VETO-SBX-001~003 /005 /006 /010 /016 | G1 boundary state / protocol / error raw;无qualification result | suite reports与targeted redaction report | G1;active identity或required dimension缺失、跨代、partial handle、policy反向输入或weak variant即不提交;P0-Q保持NotEvaluated | contracts / boundary-domain / security reviewer核active identity前置、显式四维隔离 + workspace requirement和Context -> Boundary顺序 |
| `CB-SBX-05B` | SUITE-SBX-002 /004 /008及007 /009 /010适用补强:CMD-003/004、boundary TXN / RACE / ERR;unsupported / stale / unavailable / grouped rollback / exact reads / call budget | AC-SBX-009~011 /027 /032~041;VETO-SBX-001~003 /005 /006 /010 /012 /013 /016 | G1 boundary / consistency / config / audit raw,含I065-bounded handle / lease safe refs | suite reports、targeted parity / redaction / report-audit | G1;all-or-nothing、I065、exact requirement / handle / lease、duplicate或adapter call budget任一失败即不提交;fake不得升格P0-Q | boundary + transaction + adapter reviewer核grouped save、partial failure保存和no weak fallback |
| `CB-SBX-06A` | SUITE-SBX-002 /004 /010 contract-domain slice:CMD-005/006、STA-010~012、ERR-005;missing / stale / conflict / unsupported均非Accepted | AC-SBX-012~015 /028 /032~035 /037~041;VETO-SBX-001 /004~006 /010 /016 | G1 policy state / protocol / typed-error / safe-audit raw | suite reports与targeted redaction report | G1;policy body、local allow、unknown->Accepted、unsafe error或状态不闭合即不提交 | policy contract / domain / security reviewer核body-free source map与fail-closed state |
| `CB-SBX-06B` | SUITE-SBX-004 /010主slice +002 /007 /009补强:CMD-005/006/008及policy适用TXN / RACE / ERR;non-Allowed launch call=0、exact requirement、stale / duplicate | AC-SBX-012~015 /028 /032~041;VETO-SBX-001 /004~006 /010 /012 /013 /016 | G1 policy / replay / consistency / error / audit raw与blocked / redaction checks | suite reports、targeted redaction / status-fidelity / report-audit | G1;current config重建、latest scan、旧Accepted复用、entry bypass或任何backend launch依赖即不提交 | application / policy integration / transaction reviewer核one-shot snapshot、UoW与0 launch |
| `CB-SBX-07A` | SUITE-SBX-002 /004 /008 /010及007 /009适用:CMD-007/008、STA-013 run slice、TXN / RACE / ERR;boundary / handle / persisted lease / policy exact guard、duplicate no-relaunch | AC-SBX-016 /019 /029 /032~041适用;VETO-SBX-001~006 /010 /013 /016 | G1 run / protocol / replay / consistency / error / audit raw与adapter call trace | suite reports、targeted redaction / pairing report | G1;guard任一不匹配仍launch、lease重算、duplicate relaunch、rollback半状态或tool semantics进入scope即不提交 | run / boundary / policy / backend / transaction reviewer核四方guard与owner truth |
| `CB-SBX-07B` | SUITE-SBX-002 /004 /008 /010及007 /009适用:CMD-009/010、STA-014 capture slice、ERR-009 /037 /038;Complete / Partial / Failed / Unavailable、raw-body rejection、no-recapture | AC-SBX-016~019 /029 /032~041;VETO-SBX-001 /005 /006 /009 /010 /013 /016 | G1 capture / material-ref / protocol / consistency / audit raw与redaction check | suite reports、targeted `redaction-check.md` / `report-audit.md` | G1;raw process output、Partial升Complete、Artifact / Obs truth升格、duplicate recapture或rollback不诚实即不提交 | capture + material + observability-boundary + security reviewer核body-free refs和status honesty |
| `CB-SBX-07C` | SUITE-SBX-002 /004 /008 /010及007 /009适用:CMD-011/012、STA-015 handoff slice、ERR-009/035~038;Delivered / Retryable / Failed、target mismatch、source unchanged | AC-SBX-017~019 /029 /032~041;VETO-SBX-001 /005 /006 /009~011 /013 /016 | G1 handoff / relay / replay / consistency / audit raw与pairing check | suite reports、targeted pairing / redaction report | G1;target错配、伪Delivered、delivery失败回滚capture、downstream truth入仓或duplicate redelivery即不提交 | handoff / transaction / downstream-seam reviewer核target identity、stored result和no rollback |
| `CB-SBX-08A` | SUITE-SBX-002 /004 /010 /012及007 /009适用:CMD-013~016、STA-016、ERR全相关;control conflict / replay、known / unknown classification、terminal guard / race | AC-SBX-020 /022 /032~041适用;VETO-SBX-001 /005 /006 /010 /012 /013 /016 | G1 control / failure / replay / consistency / error / audit raw | suite reports、targeted redaction / report-audit | G1;unknown变success、classification改run truth、raw detail泄漏、second winner或runtime recovery编排混入即不提交 | safety domain / control worker / transaction reviewer核single truth和unknown保守传播 |
| `CB-SBX-08B` | SUITE-SBX-002 /004 /010 /012及007 /009适用:CMD-017~020、STA-017~019、ERR-010/011;Allowed / Blocked / PendingEvidence / Investigation、release=0、redline / retention / race | AC-SBX-021~023 /030 /032~041;VETO-SBX-001 /005 /006 /010 /012~016 | G1 cleanup / redline / lease / containment / error / audit raw与cleanup disposition check | suite reports、`redaction-check.md`,targeted cleanup / report-audit | G1;non-Allowed release、early delete、force-clean、advisory redline、ordinary receipt解除containment或无disposition即不提交 | safety + operations + security reviewer核guard-first、release call budget和调查材料保留 |

### 8.2 PH-09~PH-14: `CB-SBX-09A~14C`

| Boundary | 提交前exact suite / TC门禁 | AC / VETO关联 | Artifact输出 | Report输出 | 成熟度与失败处理 | Review责任 |
|---|---|---|---|---|---|---|
| `CB-SBX-09A` | SUITE-SBX-004 /011 contract slice:QRY-001~026 schema / constructor、STA-020~023;visible / empty / restricted / stale / degraded / missing、typed lookup / no-scan contract | AC-SBX-018 /020~023 /030~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009 /010 /012 /016 | G1 query carrier / view / read-port / state / safe-audit raw | query contract / protocol reports与targeted dependency / redaction report | G1;13 surface缺失、wrong selector / cursor、unbounded scan contract、body泄漏或write surface进入即不提交 | contracts / query / access-control reviewer核13/13 view、visibility、page / marker和typed key |
| `CB-SBX-09B` | SUITE-SBX-004 /011 /014及008 /009适用:QRY-001~026、RACE-019;visible / empty / restricted / stale / degraded / missing、bounded selection、write audit=0 | AC-SBX-018 /020~023 /030~041;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009 /010 /012 /016 | G1 read / protocol / consistency / audit / boundedness raw与write-audit check | suite reports、targeted protocol / boundedness / report-audit | G1;任何Query write / audit append / refresh / rebuild / cleanup / repair、finder scan或visibility泄漏即不提交 | application / API / projection / audit reviewer核read-only facade、RACE-019和zero-write |
| `CB-SBX-10A` | SUITE-SBX-005 /008 /011及007 /009 /010适用:CNS-001~022;9 Consumer schema / source / body / dedup / accepted / duplicate / delayed / quarantine / target mismatch / rollback | AC-SBX-008 /012 /015 /017~023 /029~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /009~013 /016 | G1 consumer / receipt / replay / consistency / error / audit / arch raw与redaction check | consumer / protocol suite reports、targeted redaction / report-audit | G1;trusted source绕过、invalid仍write、body落仓、receipt重算、duplicate二写或consumer建core success即不提交 | consumer / transaction / worker / security reviewer核9/9 source map、stored receipt和quarantine |
| `CB-SBX-10B` | SUITE-SBX-005 /008 /011及007 /009 /010适用:EVT-001~015、RACE-014/015;13 payload、stored immutable snapshot、relay retry / dead-letter、topic key、source unchanged | AC-SBX-017~023 /029 /031~041适用;VETO-SBX-005 /006 /009~013 /016 | G1 event / protocol / relay / replay / consistency / error / audit raw与pairing / redaction checks | event / relay / protocol reports、targeted integrity reports | G1;kind / payload错配、从current truth重建、缺stored payload发布、route越界或publisher失败回滚source即不提交 | event / outbox / publisher / transaction reviewer核source-tx snapshot、cursor、route和no rollback |
| `CB-SBX-11A` | SUITE-SBX-006 /011 contract-kernel slice:JOB-001~012 shared contract、invalid / empty / partial / stored report replay;适用TXN / ERR | AC-SBX-018~023 /030~041适用;AC-SBX-031 PROTOCOL-SLICE;VETO-SBX-005 /006 /010 /012 /013 /016 | G1 job carrier / selection / replay / error / audit raw | job / protocol suite reports与targeted report-audit | G1;10 surface缺失、job_run_ref作key、partial无item、duplicate重算report、entry直访repository或Failed无report即不提交 | job contract / application / entry reviewer核10/10 input、selection、per-item report和stored replay |
| `CB-SBX-11B` | SUITE-SBX-006 /012及005 /007~010适用:JOB-001~004 /011 /012;bounded page、per-item UoW、duplicate owner calls=0、relay / handoff no-rollback、honest partial | AC-SBX-018~023 /030 /032~041;VETO-SBX-005 /006 /009~013 /016 | G1 collaboration job / read / relay / replay / consistency / config / audit raw | job / operations reports、targeted pairing / redaction report | G1;scope expansion、整批重复副作用、refresh建boundary / policy truth、handoff回滚source或partial隐藏即不提交 | jobs / relay / handoff / reference reviewer核bounded selection、per-item UoW与owner call budget |
| `CB-SBX-11C` | SUITE-SBX-006 /012及007~010 /014适用:JOB-005~010 /011 /012;guard-first、committed source rebuild、atomic report、partial、no core repair / no query repair | AC-SBX-020~023 /030~041;VETO-SBX-005 /006 /009~016 | G1 safety / read / relay / replay / consistency / config / audit / boundedness raw与cleanup check | job / OPS-targeted reports、cleanup / redaction / report-audit | G1;reaper绕guard、force release、projection / reconciliation修core truth、latest private scan、atomic report破坏或无resource disposition即不提交 | safety / operations / projection / reconciliation reviewer核Jobs 5~10和no-repair边界 |
| `CB-SBX-12A` | inventory gate:55 protocol、30 owner machines /31 canonical enum entries /39 shared declarations、38 typed error、254 expected TC与237 P0-C唯一owner;SUITE-SBX-001~006 /010 /011 targeted补缺,不得新增语义 | AC-SBX-006~041的P0-C trace完整性;AC-SBX-031双slice;VETO-SBX-001 /005 /006 /010 /012 /013 /016 /017 | G1 expected manifests、inventory raw与受影响suite raw;无machine evidence index / EV | suite reports、targeted `tc-coverage.md`,`protocol-inventory.md`,`per-coverage.md` | G1;55 /30 owner machines /31 enum entries /39 shared declarations /38 /254 /237任一missing / duplicate /错族 /换义或owner orphan即不提交;设计缺口回写owner | contracts + test architecture + acceptance trace reviewer逐项核唯一owner,不按总数抽样 |
| `CB-SBX-12B` | SUITE-SBX-001~012 /014 /016;全14 TXN、19 deterministic race、fake parity、COND-004;MAIN-CONTRACT / MAIN-SEAM / OPS writer与VC-001~006 /008适用 | AC-SBX-006~041全部P0-C slice;EG-SBX-001~018适用;VETO-SBX-001~017的P0-C / integrity面 | G2三个fixed source的raw / schema / checks / ESLOT-001~016 producer与pairing能力;不预造run / EV | 各source run / suite / gate / coverage / protocol / PER / redaction / dependency / report-audit能力 | G2 capability;任一TXN / race不确定、fake parity断裂、role混用、schema / pairing / status传播失败即不提交;不得写source Passed | test / consistency / evidence / security reviewers分别核237、14、19、双MAIN role、OPS和controls |
| `CB-SBX-13A` | qualification preflight fixtures:immutable candidate ADR / revision、PROFILE-05 / ENV-05 / generation / template / capability / provider / material identity;ARCH-001 + CONF identity前置;substitution / missing call=0 | P0-Q前置AC-SBX-008~011 /013~014 /027~028 /034~035 /038;AC-SBX-031 ARCH-SLICE supporting;VETO-SBX-001~009 /016~017适用predicate | G1 preflight / qualification identity raw能力;无CONF probe result、无ESLOT item | identity / preflight targeted report;缺输入时明确Blocked reason | G1;全部现实activation input未闭合前boundary保持`blocked_pre_implementation`;任何missing / mismatch为Blocked且probe / launch=0 | design / qualification / security / provider reviewer固定单一packet和credential no-store;不得实现多candidate选择 |
| `CB-SBX-13B` | SUITE-SBX-013全CONF-001~013;identity preflight -> four-dimension / lifecycle / capture / failure / reaper / redline / material / anti-leak -> teardown;VC-001 /007 /008 /009 | P0-Q适用AC-SBX-008~011 /013~014 /016~023 /027~030 /034~035 /037~041;AC-SBX-031 ARCH-SLICE supporting;VETO-SBX-001~017适用predicate | G2 P0Q fixed source raw能力、qualification-result、identity / redaction / cleanup checks与ESLOT-017~019 producer | SUITE-SBX-013 / qualification / identity / redaction / cleanup / report-audit reports | G2 capability;缺packet即Blocked +0 launch;probe Failed、raw leak、substitution、teardown / containment无disposition均不提交且保留调查材料 | qualification runner + security + operations reviewer核13/13 exact packet、product disposition和lab teardown |
| `CB-SBX-14A` | 7 gate /17 script inventory中的5 gate +9 check orchestration fixtures;wrong role / ENV / order / identity / digest / missing / Failed / Blocked / InfraFailed / conditional;P1与scope selector | EG-SBX-001~018 /021;VETO-SBX-001 /002 /006 /007 /008 /014~017 | G2/G3 orchestration synthetic raw checks;不产RELEASE Pass、EV或acceptance draft | fixture-only gate / integrity reports,状态必须保真 | G2/G3 tooling;任一非法状态归一、四source选序、`latest`、scope trigger吞并或check safe-failure错误即不提交 | automation / release / evidence / security reviewer核7 /7 gate、9 /9 check和固定四source顺序 |
| `CB-SBX-14B` | 九schema writer / reader、21 /21 slot expected / missing、canonical digest / path / status、pairing / no-static / allocation、run / suite / gate / evidence renderer roundtrip | EG-SBX-001~018 /021;VETO-SBX-006 /010 /017;全部AC的evidence可裁决性 | G3 machine index / item、raw check与renderer能力;只有合法pair未来才分配`EV-SBX-*` | `summary.md`,`gate-results.md`,coverage / inventory / integrity、suite / evidence / index reports | G3 tooling;missing raw / pair、schema / digest / path错误、source status改写、slot orphan或静态alias即不提交 | evidence schema / report / security reviewer核九类schema、21 slot、digest backlink和status fidelity |
| `CB-SBX-14C` | acceptance generator fixtures:同一RELEASE /四source绑定、VETO-SBX-001~017 / defect / RR / conditional fields、四draft、review入口、254 /16 /7 scope audit、no verdict / signature | EG-SBX-019~021;VETO-SBX-001~017;正式`06`§11~§14的entry / risk / final边界 | G4 draft generator fixture raw;不创建真实review、risk acceptance、verdict或signature | 四份acceptance draft能力与review入口;fixture报告证明无预填裁决 | G4 tooling;任何Pass / ConditionalPass、risk accepted、Reviewed、Signed默认值、missing隐藏、路径漂移或P1补P0即不提交 | acceptance tooling + independent review-contract + security reviewer核draft / review / adjudication分权 |

### 8.3 Boundary artifact / report最小判定算法

```text
for each CB-SBX boundary:
  require Step 6 Build / Test / Evidence / Commit / Handoff gates
  require all Step 7 exact suite / TC slices applicable to changed scope
  require all linked AC / VETO risks have a machine assertion or an explicit pre-runtime design check

  if maturity == G0:
    require boundary ledger no_runtime_artifact with producer-absence reason
    forbid run_id, ESLOT item, EV alias, source role, acceptance claim
  else:
    require fixed raw under artifacts/test/<run_id>
    require paired report under reports/runs/<run_id>
    require status fidelity, redaction and resource disposition

  if any mandatory check is Failed / InfraFailed / Blocked / missing:
    forbid commit and next-boundary activation
    preserve immutable failure material
    route design gaps to blocked / wait_design
    route external environment gaps to dependency_wait reason + blocked / handoff

  if all implementation checks are valid:
    allow Commit Gate evaluation only
    do not infer source Passed, RELEASE Passed, VETO NotTriggered or acceptance verdict
```

### 8.4 Boundary review record required fields

Step 13创建的32件planned skeleton必须从本Step增补以下字段;字段为空时boundary不得通过Test / Evidence / Commit Gate:

| 字段 | 必填内容 | 禁止值 /替代 |
|---|---|---|
| `test_gate_refs` | exact `SUITE-SBX-*`与完整`TC-SBX-*` / parameter refs,或G0 direct check命令 | 缩写ID注册、`all tests`、CI URL |
| `acceptance_refs` | exact `AC-SBX-*`,`VETO-SBX-*`,适用EG / RL / NFCHK辅助索引 | 自创AC / VETO、只写章节名 |
| `artifact_expectation` | `no_runtime_artifact` +理由,或fixed raw paths / schema / status / digest | `N/A`、`latest`、预填run_id / EV |
| `report_expectation` | fixed paired report paths和generator,或G0无report理由 | 手写pass table、同义report入口 |
| `evidence_maturity` | `G0 Structural / G1 Targeted / G2 Fixed Source / G3 RELEASE / G4 Acceptance`之一 | `final`,`verified`,`passed` |
| `failure_disposition` | stop / preserve / rerun / wait_design / dependency_wait与新run规则;若写台账,dependency_wait必须映射`blocked / handoff` | waive、Skipped、覆盖旧失败、非法`next_allowed_action` |
| `review_owners` | boundary reviewer及适用test / evidence / security / qualification / acceptance reviewer | generator自审、implementation agent代签 |
| `review_result` | future runtime事实,初态保持`pending_not_executed` | planned skeleton预填reviewed / passed |

---

## 9. Phase与Commit Boundary门禁停审

本节的`PassDesign`只表示测试、证据、报告、失败和review责任在设计上可执行;不表示代码存在、测试已跑、artifact / report有效、VETO未命中或验收通过。`PassDesignBlockedActivation`表示设计闭合但Step 6已登记的现实前置尚未关闭。

### 9.1 14 /14 Phase停审记录

| Phase | 增量测试覆盖 | Evidence / report可判定 | 失败 / review责任 | 停审结论 |
|---|---|---|---|---|
| PH-01 | workspace / Cargo / dependency结构检查闭合 | G0 `no_runtime_artifact`理由明确,不造run | 前置失败停止;build / architecture review | `PassDesignBlockedActivation`:HDO、baseline、目标仓 /版本 /core revision待固定 |
| PH-02 | carrier、persistence kernel、canonical与script fixture闭合 | G0 -> G1边界和synthetic pair明确 | contract / canonical / script失败停止;contracts / consistency / evidence review | `PassDesign`;02C /02D现实前置仍分别阻断对应boundary |
| PH-03 | CFG / ARCH / parity与scope absence闭合 | G1 config / material / integrity输出明确 | invalid / fallback / new surface停止;config / security / architecture review | `PassDesign` |
| PH-04 | intake Command / state / TXN / race / error闭合 | G1 INTAKE / protocol / consistency / audit输出明确 | 匿名 /正文 /非原子 /重算停止;domain / transaction / API review | `PassDesign` |
| PH-05 | active identity前置、四维coherent isolation + workspace requirement、handle / lease与weak-fallback闭合 | G1 BOUNDARY producer,P0-Q仍NotEvaluated | missing /partial /跨代 /I065错误停止;boundary / adapter / security review | `PassDesign` |
| PH-06 | policy fail-closed、high-risk与0 launch闭合 | G1 POLICY / error / audit与status fidelity明确 | 任一non-allow launch停止;policy / transaction / security review | `PassDesign` |
| PH-07 | run / capture / handoff、partial与no-rollback闭合 | G1 EXECUTION / relay / replay / audit pair明确 | guard / raw body /升格 /rollback失败停止;run / capture / handoff review | `PassDesign` |
| PH-08 | failure / control / cleanup / redline与release=0闭合 | G1 SAFETY / cleanup disposition明确 | unknown success / early delete / advisory redline停止;safety / operations / security review | `PassDesign` |
| PH-09 | 13 Query、bounded selection、RACE-019与write=0闭合 | G1 READ / protocol / boundedness明确 | scan /泄漏 /写入 /repair停止;query / projection / access review | `PassDesign` |
| PH-10 | 9 Consumer +13 Event、receipt / payload / no-rollback闭合 | G1 PROTOCOL / RELAY / REPLAY / audit明确 | authority / body / dedup /payload source失败停止;consumer / event / publisher review | `PassDesign` |
| PH-11 | 10 Job、partial / replay / guard / no-repair闭合 | G1 operations / cleanup / report pair明确 | scope扩张 /二次副作用 /truth repair停止;job / safety / projection review | `PassDesign` |
| PH-12 | 237 P0-C、55 /30 owner machines /31 enum entries /39 shared declarations /38、14 TXN、19 race与P0-C source能力闭合 | G2 MAIN双role / OPS、ESLOT-001~016与controls明确 | orphan / role / pairing / redaction / status失败停止;test / evidence / security review | `PassDesign`;source能力不等于source run存在或Passed |
| PH-13 | single packet与13 CONF / qualification / teardown闭合 | G2 P0Q、ESLOT-017~019与identity / cleanup明确 | identity缺失Blocked +0 launch;qualification / security / operations review | `PassDesignBlockedActivation`:candidate / ENV-05 / provider / material / lab待固定 |
| PH-14 | 7 gate、17 script、9 control、21 slot与四source / draft闭合 | G3 RELEASE + G4 draft / review路径明确 | 缺source / pair / review保持Blocked;release / evidence / independent acceptance review | `PassDesign`;generator无裁决 /签署权 |

### 9.2 32 /32 Commit Boundary停审记录

| Boundary | 测试增量是否覆盖 | Artifact / report与成熟度 | 失败 / review是否明确 | 停审结论 |
|---|---|---|---|---|
| `CB-SBX-01A` | seven-crate / dependency direct checks | G0;`no_runtime_artifact` | 是;build / architecture | `PassDesignBlockedActivation` |
| `CB-SBX-02A` | CTR-001~006 carrier contract | G0;无producer理由明确 | 是;contracts / security | `PassDesign` |
| `CB-SBX-02B` | UoW / replay semantic kernel | G0;无producer理由明确 | 是;consistency / infra | `PassDesign` |
| `CB-SBX-02C` | canonical / digest / path / schema fixture | G1 fixture raw / report pair | 是;evidence / security | `PassDesignBlockedActivation` |
| `CB-SBX-02D` | minimal script / VC safe-failure fixture | G1 synthetic checks / reports | 是;automation / evidence | `PassDesignBlockedActivation` |
| `CB-SBX-03A` | full CFG + ARCH strict parser slice | G1 config / integrity pair | 是;config / architecture / security | `PassDesign` |
| `CB-SBX-03B` | profile / material / generation / builder | G1 generation / parity / redaction pair | 是;config / material / runtime builder | `PassDesign` |
| `CB-SBX-04A` | intake contract / state / error | G1 suite raw / reports | 是;contracts / domain / security | `PassDesign` |
| `CB-SBX-04B` | intake service / TXN / race / replay | G1 service / integrity pair | 是;application / transaction / API | `PassDesign` |
| `CB-SBX-05A` | boundary contract / active identity + four-dimension isolation / workspace requirement state | G1 boundary raw;P0-Q无结果 | 是;boundary domain / security | `PassDesign` |
| `CB-SBX-05B` | boundary UoW / adapter / I065 / exact reads | G1 boundary / parity / audit pair | 是;transaction / adapter / boundary | `PassDesign` |
| `CB-SBX-06A` | policy contract / state / error | G1 policy / safe error pair | 是;policy domain / security | `PassDesign` |
| `CB-SBX-06B` | policy service / snapshot / 0 launch | G1 policy / replay / status pair | 是;policy integration / transaction | `PassDesign` |
| `CB-SBX-07A` | guarded run / lease / no relaunch | G1 run / consistency / audit pair | 是;run / backend / transaction | `PassDesign` |
| `CB-SBX-07B` | capture status / body-free material refs | G1 capture / redaction pair | 是;capture / material / security | `PassDesign` |
| `CB-SBX-07C` | handoff target / outcome / no rollback | G1 handoff / pairing pair | 是;handoff / downstream seam | `PassDesign` |
| `CB-SBX-08A` | control / classification / unknown / race | G1 safety / error / audit pair | 是;safety / control / transaction | `PassDesign` |
| `CB-SBX-08B` | cleanup guard / containment / release=0 | G1 cleanup / disposition pair | 是;safety / operations / security | `PassDesign` |
| `CB-SBX-09A` | 13 Query carrier / read-port / no-scan | G1 query contract / protocol pair | 是;query / access / contracts | `PassDesign` |
| `CB-SBX-09B` | 13 Query service / bounded / write=0 | G1 read / boundedness / write-audit pair | 是;application / projection / API | `PassDesign` |
| `CB-SBX-10A` | 9 Consumer / dedup / receipt / quarantine | G1 consumer / replay / redaction pair | 是;consumer / worker / transaction | `PassDesign` |
| `CB-SBX-10B` | 13 Event / stored payload / publisher | G1 relay / protocol / pairing pair | 是;event / outbox / publisher | `PassDesign` |
| `CB-SBX-11A` | 10 Job contract / shared kernel / replay | G1 job / protocol / report pair | 是;job contract / application / entry | `PassDesign` |
| `CB-SBX-11B` | collaboration jobs / no rollback | G1 operations / relay / report pair | 是;jobs / relay / handoff | `PassDesign` |
| `CB-SBX-11C` | safety / projection jobs / no repair | G1 operations / cleanup / boundedness pair | 是;safety / projection / reconciliation | `PassDesign` |
| `CB-SBX-12A` | 55 /30 owner machines /31 enum entries /39 shared declarations /38 /254 /237 inventory | G1 manifests / coverage reports;无EV | 是;test architecture / acceptance trace | `PassDesign` |
| `CB-SBX-12B` | 14 TXN /19 race / full P0-C / source writers | G2 MAIN / OPS producer / report能力 | 是;test / consistency / evidence / security | `PassDesign` |
| `CB-SBX-13A` | qualification identity / anti-substitution / 0 launch | G1 preflight;无probe result | 是;design / qualification / security | `PassDesignBlockedActivation` |
| `CB-SBX-13B` | 13 CONF / P0Q writer / teardown | G2 P0Q / qualification / cleanup能力 | 是;qualification / security / operations | `PassDesignBlockedActivation` |
| `CB-SBX-14A` | 7 gate /9 control orchestration failure fixture | G2/G3 synthetic orchestration reports | 是;automation / release / evidence | `PassDesign` |
| `CB-SBX-14B` | 9 schema /21 slot / pairing / renderer | G3 evidence / report能力;无静态EV | 是;evidence schema / report / security | `PassDesign` |
| `CB-SBX-14C` | four draft / review entry / scope audit | G4 draft能力;无真实review / verdict | 是;acceptance tooling / review contract | `PassDesign` |

停审闭集:

- 14 /14 phase均有测试门禁、验收 / VETO关联、artifact / report、失败传播和review owner。
- 32 /32 boundary均有提交前测试门禁;3个G0 boundary具有具体producer缺失理由,不是裸`N/A`。
- `01A /02C /02D /13A /13B`保持`PassDesignBlockedActivation`;其余只表示`PassDesign`,没有boundary被标为runtime ready / passed。
- 任一baseline / scope / suite / schema / gate / AC / VETO变化都使受影响停审失效,必须回到owner Step重复核。

---

## 10. 跨门禁覆盖、证据归属与反向审计

### 10.1 16 /16 Suite显式反查

本表只登记实施owner与完整门禁位置;TC主归属数量仍由正式`05`§9.1唯一维护。

| Suite | 主责任 /实施位置 | Phase / source门禁 | 不得替代 |
|---|---|---|---|
| `SUITE-SBX-001` | 02A carrier;12A补清单;12B source | PH-02 targeted;MAIN-CONTRACT | 不以schema fixture代6 CTR主结果 |
| `SUITE-SBX-002` | 04A起逐state增量;12A /12B全量 | PH-04~12;MAIN-CONTRACT | 未实现owner variant不计覆盖 |
| `SUITE-SBX-003` | 03A /03B config / ARCH;12B全量 | PH-03 /12;PR / MAIN | target缺失ARCH只能Blocked |
| `SUITE-SBX-004` | 04B起Command;09B补Query;12B全量 | PH-04~12;PR / MAIN | 局部Command绿色不代表13 Query完整 |
| `SUITE-SBX-005` | 10A /10B Consumer / Event | PH-10 /12;MAIN-CONTRACT + MAIN-SEAM | 两role必须不同run |
| `SUITE-SBX-006` | 11A~11C Job | PH-11 /12;MAIN-CONTRACT + OPS适用 | report不得隐藏failed item |
| `SUITE-SBX-007` | 02B kernel;纵切增量;12B全14 TXN | PH-02~12;MAIN + OPS补强 | kernel fixture不计具体flow主结果 |
| `SUITE-SBX-008` | 03B起repository / adapter parity;12B全量 | PH-03~12;MAIN双role + OPS适用 | fake parity不证明P0-Q |
| `SUITE-SBX-009` | 04B起race增量;12B全19 | PH-04~12;MAIN + OPS补强 | 概率压测不替deterministic双顺序 |
| `SUITE-SBX-010` | 04A起typed error;12A /12B全38 | PH-04~12;MAIN双role + OPS补强 | 字符串匹配不算typed producer覆盖 |
| `SUITE-SBX-011` | 09A起protocol inventory;12A /12B 55 /55 | PH-09~12;MAIN双role | 总数不替exact family / disposition |
| `SUITE-SBX-012` | 08B primitive;11C operations;12B OPS writer | PH-08 /11 /12;OPS | simulation不证明candidate真实lifecycle |
| `SUITE-SBX-013` | 13A identity preflight;13B 13 CONF | PH-13;P0Q | ENV-01~04 / fake / PROFILE-06不得替代 |
| `SUITE-SBX-014` | 09B bounded query;11C jobs;12B全量 | PH-09~12;MAIN / OPS | 只证明结构有界,不发明数值SLO |
| `SUITE-SBX-015` | 14A selected-run入口 | PH-14;P1 conditional | `NotRunConditional`不补P0 |
| `SUITE-SBX-016` | 03A absence;12B /14A scope guard | PH-03 /12 /14;PR / scope-reopen | 命中新surface必须DesignReopen |

### 10.2 7 /7 Gate与17 /17 Script机械反查

| Catalog | 显式闭集 | Owner /收口 | 审计结果 |
|---|---|---|---|
| 7 gate | `GATE-SBX-PR`;`GATE-SBX-MAIN`;`GATE-SBX-OPS`;`GATE-SBX-P0Q`;`GATE-SBX-RELEASE`;`GATE-SBX-P1`;`GATE-SBX-SCOPE-REOPEN` | 12B source基础;13B P0Q;14A全selector / orchestration;14B renderer | 7 /7,无第二gate名称 |
| 5 gate script | `scripts/gates/run_ci_gate.sh`;`scripts/gates/run_operations_gate.sh`;`scripts/gates/run_backend_conformance_gate.sh`;`scripts/gates/run_release_gate.sh`;`scripts/gates/run_selected_real_like_gate.sh` | 02D最小入口;12B /13B producer;14A收口 | 5 /5,入口和formal gate不是一一重复命名 |
| 3 report script | `scripts/reports/generate_reports.sh`;`scripts/reports/generate_gate_results.sh`;`scripts/reports/generate_acceptance_handoff.sh` | 02D最小;14B前两项;14C handoff | 3 /3,script不放`reports/`输出目录 |
| 9 check script | `scripts/checks/check_redaction.sh`;`scripts/checks/check_dependency_boundary.sh`;`scripts/checks/check_tc_coverage.sh`;`scripts/checks/check_protocol_inventory.sh`;`scripts/checks/check_artifact_report_pairing.sh`;`scripts/checks/check_no_static_evidence.sh`;`scripts/checks/check_qualification_identity.sh`;`scripts/checks/check_blocked_propagation.sh`;`scripts/checks/check_cleanup_disposition.sh` | 02D最小VC;12A manifests;12B /13A /13B producer;14A收口 | 9 /9,与VC-001~009一一对应 |

### 10.3 21 /21 ESLOT显式反查

| Slot | Producer boundary / source | Phase聚合 | 当前设计事实 |
|---|---|---|---|
| `ESLOT-SBX-001` CONTRACT | 02A contract;12B MAIN | PH-14 | planned producer;无EV |
| `ESLOT-SBX-002` INTAKE | 04A /04B;12B MAIN | PH-14 | planned producer;无EV |
| `ESLOT-SBX-003` BOUNDARY | 05A /05B;12B MAIN | PH-14 | planned producer;无EV |
| `ESLOT-SBX-004` POLICY | 06A /06B;12B MAIN | PH-14 | planned producer;无EV |
| `ESLOT-SBX-005` EXECUTION | 07A~07C;12B MAIN | PH-14 | planned producer;无EV |
| `ESLOT-SBX-006` SAFETY | 08A /08B;11C OPS;12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-007` READ | 09A /09B;11C OPS;12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-008` PROTOCOL | 04A~11C;12A inventory;12B source | PH-14 | planned producer;无EV |
| `ESLOT-SBX-009` RELAY | 10B;11B;12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-010` REPLAY | 02B primitive;04B~11C;12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-011` CONSISTENCY | 02B primitive;04B~12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-012` ERROR | 04A~12A /12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-013` CONFIG | 03A /03B;12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-014` CHANGE | 03A /03B;12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-015` AUDIT | 04A~12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-016` ARCH | 01A /03A;12A /12B | PH-14 | planned producer;无EV |
| `ESLOT-SBX-017` QUAL-BOUNDARY | 13B P0Q | PH-14 | planned;activation blocked |
| `ESLOT-SBX-018` QUAL-LIFECYCLE | 13B P0Q | PH-14 | planned;activation blocked |
| `ESLOT-SBX-019` QUAL-IDENTITY | 13A preflight /13B P0Q | PH-14 | planned;activation blocked |
| `ESLOT-SBX-020` REAL-LIKE | 14A P1 only after formal trigger | PH-14 conditional | `NotRunConditional` design contract |
| `ESLOT-SBX-021` SCOPE | 03A absence /14A scope gate | PH-14 conditional | trigger causesDesignReopen |

RELEASE默认expected set固定为`ESLOT-SBX-001~019`;020 /021只在合法formal trigger下加入当次expected set。表中producer是代码 /脚本能力owner,不是runtime item或`EV-SBX-*`实例。

### 10.4 17 /17 VETO前置反查

| VETO | 最早规避boundary | 全量证明 /聚合owner | 缺失 /触发传播 |
|---|---|---|---|
| `VETO-SBX-001` | 04A核心节点起 | 12B +13B +14A /14B /14C | 核心 /P0-Q缺证据Blocked;Triggered仅不通过 |
| `VETO-SBX-002` | 03B profile /04A identity | 13A /13B qualification;14C checklist | host / fake substitution proof缺失Blocked |
| `VETO-SBX-003` | 05A /05B active identity +四维隔离 /workspace requirement | 13B CONF-001~006;14C | identity缺失、required dimension unsupported /跨代仍launch触发 |
| `VETO-SBX-004` | 06A /06B fail-closed | 12B P0-C +13B适用;14C | policy proof缺失Blocked |
| `VETO-SBX-005` | 01A dependency /02A carrier | 12A /12B inventory;14A /14C | 外部truth /领域编排混入触发 |
| `VETO-SBX-006` | 02A body-free /02C redaction | 全phase redaction;13B;14A~14C | scanner不完整Blocked;泄漏Triggered候选 |
| `VETO-SBX-007` | 03A /03B generation | 12B +14A /14C | partial / invalid publication触发 |
| `VETO-SBX-008` | 03A unsupported absence | 12B SUITE-016 +14A scope;14C | future surface未测Blocked;命中先reopen |
| `VETO-SBX-009` | 07B capture /07C handoff | 09B~13B适用 +14C | material升格 proof缺失Blocked |
| `VETO-SBX-010` | 04B accepted audit | 12B AUDIT /report-audit +14C | trace缺口Blocked /触发 |
| `VETO-SBX-011` | 07C no capture rollback | 10B /11B relay +12B;14C | stored payload / no-rollback缺失Blocked |
| `VETO-SBX-012` | 08A owner /09B no-write | 11C no-repair +12B;14C | write-audit / protocol缺失Blocked |
| `VETO-SBX-013` | 02B replay kernel /04B duplicate | 10A /11A +12B TXN;14C | replay proof缺失Blocked |
| `VETO-SBX-014` | 08B cleanup guard | 11C /13B cleanup +14A /14C | disposition缺失Blocked;guard bypass触发 |
| `VETO-SBX-015` | 08B orphan / redline | 11C /13B lifecycle +14C | lab / lifecycle缺失Blocked |
| `VETO-SBX-016` | 01A dependency / module | 12A /12B ARCH +14A /14C | graph / target缺失Blocked |
| `VETO-SBX-017` | 02C /02D evidence integrity | 12B /13B producers +14A~14C | missing pair一般Blocked;静态造证据触发 |

17项runtime disposition当前仍全部`NotEvaluated`,不是`NotTriggered`。本表只证明每项有最早规避点、producer、聚合owner和传播规则。

### 10.5 254 TC、AC、report与review跨门禁审计

| 审计项 | 检查口径 | 结论 | 缺口 /修正 |
|---|---|---|---|
| Phase门禁 | PH-01~14至少一项test gate | passed_design:14 /14 | PH-01明确G0结构检查,未伪造suite run |
| Boundary门禁 | CB-SBX-01A~14C提交前测试 | passed_design:32 /32 | 3个G0 boundary均有具体无producer理由 |
| TC分母 | 14 family =237 P0-C +13 P0-Q +4 conditional =254 | passed_design | 12A唯一owner manifest;12B /13B producer;14C scope audit;不得按范围字符串生成machine item |
| Suite闭集 | SUITE-SBX-001~016 | passed_design:16 /16 | §10.1显式逐项反查 |
| Gate闭集 | 7 formal gate | passed_design:7 /7 | §10.2无第二同义gate |
| Script闭集 | 5 gate +3 report +9 check | passed_design:17 /17 | §6.4 / §10.2 owner唯一 |
| Evidence slot | ESLOT-SBX-001~021 | passed_design:21 /21 | §10.3逐项producer / source / maturity明确 |
| Machine schema | 正式九类schema | passed_design:9 /9 | 02C primitive;14B收口;未创建实例 |
| Validation controls | VC-001~009 | passed_design:9 /9 | 02D /12B /13A /13B /14A渐进owner明确 |
| AC覆盖 | AC-SBX-006~041及协议 /状态 /NFR / evidence辅助索引 | passed_design | phase / boundary前置;正式裁决仍只在`06` |
| VETO覆盖 | VETO-SBX-001~017 | passed_design:17 /17 | §10.4逐项;当前全NotEvaluated |
| Artifact归属 | G0 reason或固定`artifacts/test/<run_id>` | passed_design | 禁止`latest`、project子层、静态alias |
| Report归属 | fixed `reports/runs/<run_id>` / acceptance / review入口 | passed_design | 禁止`gate-summary.md`等同义入口 |
| Raw / report pairing | 每blocking invocation / item有pair + digest | passed_design | 缺pair不分配EV;VC-005阻断 |
| Redaction | artifact / run / acceptance / review四root | passed_design | VC-001;任一泄漏不可接受 |
| Source角色 | MAIN-CONTRACT -> MAIN-SEAM -> OPS -> P0Q | passed_design | 两MAIN不同run;RELEASE不自产P0证明 |
| Targeted升格 | G1不得成为source / RELEASE | blocked_by_design | §6.1 / §8.3明确禁止 |
| P1补偿 | P1 unavailable / unqualified | blocked_by_design | `NotRunConditional`,不改变P0 |
| Acceptance draft | 14C四draft +两review入口 | passed_design | generator不写verdict / risk accepted / review / signature |
| Review责任 | boundary / test / evidence / security / independent / adjudicator | passed_design | §6.6 / §7.1 / §8 / §9明确分权 |
| Risk acceptance | 只能正式`06`§13 authority未来裁决 | not_performed | VETO / S级不可接受;本Step无实例 |
| 伪事实扫描 | commit / run / EV / result / review / verdict / signature | passed | 全文仅planned / future / absent口径 |

跨门禁审计没有发现必须回写`00~06`才能完成Step 7的unresolved设计冲突。开放项均是实现 /执行前现实前置,已绑定exact boundary并在§12登记。

---

## 11. 正式`07` §7回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
>
> 延伸阅读:
> - 正式装配时应继续阅读本Step的“五级成熟度”“17个planned script责任闭集”“14个Phase门禁矩阵”“32个Commit Boundary门禁矩阵”“门禁停审”和“跨门禁反向审计”,不得只复制本节摘要。

Step 13装配正式`07-实施计划.md`§7时,至少回填以下结构:

1. 测试 / evidence五级成熟度与统一失败传播。
2. fixed artifact / report / acceptance / review路径及禁止`latest`、同义入口和静态alias规则。
3. 17个planned script、7个formal gate和9个validation control的渐进owner。
4. 14 /14 phase测试与验收门禁矩阵,保留exact suite / family、AC / VETO、script、artifact / report和失败处理列。
5. 32 /32 boundary提交前门禁矩阵,保留evidence maturity与review owner;不得压缩成phase摘要。
6. 14 +32停审、16 suite /21 slot /17 VETO反查与254 TC分母审计。

正式§7核心正文草稿如下:

Sandbox实施不是在PH-14一次性补测。每个phase和commit boundary必须先执行Step 6的Build / Test / Evidence / Commit / Handoff Gate,再叠加本章绑定的exact `SUITE-SBX-*` / `TC-SBX-*`、AC / VETO、artifact / report和review门禁。任何mandatory Failed、InfraFailed、Blocked、missing、schema / digest / pairing、redaction、dependency、VETO风险或未清review都不得提交当前boundary或激活下一boundary;修复后必须生成新run并保留原失败材料。

Evidence成熟度严格分为:

```text
G0 Structural
  -> G1 Targeted
  -> G2 Fixed Source
  -> G3 RELEASE
  -> G4 Acceptance
```

`CB-SBX-01A~02B`在统一artifact producer形成前只允许把direct check和`no_runtime_artifact`理由写入boundary ledger,不得创建空run / ESLOT item / EV。`CB-SBX-02C`后产生machine raw的targeted run必须使用`artifacts/test/<run_id>`并在`reports/runs/<run_id>`形成配对报告;G1结果不得作为MAIN / OPS / P0Q source。PH-12只交付MAIN-CONTRACT、MAIN-SEAM与OPS source writer能力,PH-13只交付固定candidate packet下的P0Q source能力;能力实现不等于source run存在或Passed。

RELEASE只允许按以下固定顺序消费同一design / subject / core / harness baseline下的四source:

```text
MAIN-CONTRACT (SBX-ENV-02 / SBX-PROFILE-02)
  -> MAIN-SEAM (SBX-ENV-03 / SBX-PROFILE-03)
  -> OPS (SBX-ENV-04 / SBX-PROFILE-04)
  -> P0Q (SBX-ENV-05 / SBX-PROFILE-05)
  -> GATE-SBX-RELEASE aggregation
```

两个MAIN role必须使用不同run;RELEASE聚合器不自产P0证明、不改source status、不从`latest`选源。P0-C与P0-Q是正交必要轴,不得互相替代。PROFILE-06 / SUITE-SBX-015未激活时保持`NotRunConditional`,不得补偿P0;SUITE-SBX-016命中新future surface时必须暂停并回写`00~04`。

运行输出只使用以下固定入口:

```text
artifacts/test/<run_id>/meta/
artifacts/test/<run_id>/suites/
artifacts/test/<run_id>/checks/
artifacts/test/<run_id>/evidence-index.json
reports/runs/<run_id>/
reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md
reports/review/{reviewer-notes,agent-review}.md
```

PH-14的`scripts/reports/generate_acceptance_handoff.sh`只生成四份draft并固定RELEASE /四source identity、missing、VETO / defect / risk输入。它不得填写通过 /有条件通过 /不通过结论、风险已接受、review已完成或签署。两份独立review由未来human reviewer和Agent分别形成,最终裁决与签署只按正式`06`的FormalEntryReady、DecisionReady、VETO、缺陷、风险和三值算法执行。

### 11.1 正式§7必须保留的最小摘要表

| Phase范围 | 门禁成熟度 /主要测试 | Evidence / report责任 | 验收与失败上限 |
|---|---|---|---|
| PH-01 | G0 workspace / dependency direct checks | ledger `no_runtime_artifact` | AC-031 ARCH前置;失败不得开PH-02 |
| PH-02~11 | G0 -> G1逐能力targeted suites | fixed targeted raw / paired reports | AC / VETO前置;不得升格source |
| PH-12 | G2 P0-C:237 /55 /30 owner machines /31 enum entries /39 shared declarations /38 /14 /19、MAIN双role + OPS | ESLOT-001~016 producer / source reports | source能力不等于Passed |
| PH-13 | G2 P0-Q:single packet +13 CONF | ESLOT-017~019 / qualification / teardown | identity缺失Blocked +0 launch |
| PH-14 | G3 RELEASE + G4 acceptance draft | 7 gate /17 script /9 control /21 slot /四draft | 缺source / review保持Blocked;无自动裁决 |

正式装配不得删除§8的32行boundary矩阵或把它改成“按需运行相关测试”。实现ledger和32件skeleton还必须接收`test_gate_refs`,`acceptance_refs`,`artifact_expectation`,`report_expectation`,`evidence_maturity`,`failure_disposition`,`review_owners`,`review_result`字段,以便实现agent不再反复要求设计者补门禁。

---

## 12. Blocker、待确认事项与上游影响

### 12.1 开放但不阻塞Step 7设计停审的现实前置

| 前置 / blocker | Exact boundary / gate | 当前状态 | 未关闭时处理 |
|---|---|---|---|
| 可复现design commit baseline与HDO-SBX-00 | HDO /01A Activation | open_before_handoff | `wait_design`;不得创建 /修改目标仓 |
| 目标仓、edition / rust-version、core revision与兼容性 | 01A Activation / Design | open_before_bootstrap | 01A保持blocked;ARCH runtime check不伪造 |
| RFC 8785实现库 / verifier | 02C Activation;14B复用 | open_before_schema_writer | 不得以`jq` / `sha256sum`存在性代替canonical fixtures |
| Shell规则与lint /等价检查 | 02D Activation;14A复用 | open_before_script | 02D不得提交;17入口不允许无审查扩展 |
| candidate ADR / revision、ENV-05 / PROFILE-05、generation / template / capability、provider / material identity | 13A Activation | open_before_p0q | 13A /13B Blocked且probe / launch=0 |
| dedicated lab、authorized candidate与resource disposition能力 | 13B Activation | open_before_probe | 不执行13 CONF,不生成P0Q source |
| CI provider / binding与credential-safe invocation | 14A Activation / Step 8 | open_before_ci_binding | 可验证script fixture,不得宣称CI已接入 |
| retention物理介质 / TTL数值策略 | Step 8 /9 / future operations design | open_conditional | 只执行condition-based guard,不发明期限 |
| PROFILE-06 composition / workload / baseline / threshold | GATE-SBX-P1 future trigger | inactive_conditional | `NotRunConditional`;不影响P0但无量化结论 |

### 12.2 已解决的动态状态冲突

| Blocker ID | 状态 | 冲突 | 本Step修正 | 契约影响 |
|---|---|---|---|---|
| `SBX-IMP-DOWNSTREAM-STATUS-STEP7-001` | resolved_by_07_step_7_dynamic_writeback | 正式`05`§15.5与正式`06`§15.5仍把`07`下游进度写为Step 5,与Step 7已完成待审的项目恢复点冲突。 | 只回写两份正式文档的下游状态与变更记录,并同步测试flow、验收flow、`07` flow和项目台账。 | 不改TC、suite、gate、script、slot、AC、VETO、schema、状态、结果或验收事实。 |

### 12.3 Blocker裁决

- 没有发现必须回写正式`00~06`才能完成Step 7设计收口的上游blocker。
- 动态状态冲突已按§12.2受控回写并关闭,不属于测试 /验收契约冲突。
- 正式`05`与`06`之间的suite / gate / evidence / VETO契约可同时成立;本Step未新增或改写owner编号。
- L1参考仓存在旧candidate evidence /同义report写法,已作为粒度参考而未继承;不构成当前上游冲突。
- 上表现实前置阻塞future implementation / execution,不阻塞用户审查本Step;不得将其状态改写为ready。
- 若Step 8读取环境 /依赖后发现ENV / PROFILE / material / provider契约与正式`04/05`冲突,必须回退owner文档并使本Step受影响停审失效。

---

## 13. 自检、停审与进入Step 8条件

| 自检项 | 结果 |
|---|---|
| 是否逐项回答SOP 15个问题 | 通过,15 /15 |
| 是否固定artifact / report / acceptance / review路径 | 通过;禁止`latest`和同义入口 |
| 是否固定五级maturity与统一失败传播 | 通过,G0~G4;mandatory failure不继续 |
| 是否覆盖14个phase | 通过,14 /14 |
| 是否覆盖32个commit boundary | 通过,32 /32 |
| 每个boundary是否有exact测试、AC / VETO、artifact / report、失败和review | 通过;G0项有具体无producer理由 |
| 是否完成14 +32门禁停审 | 通过;5项保持blocked activation |
| 16 suite是否逐项有owner | 通过,16 /16 |
| 7 gate是否逐项有owner | 通过,7 /7 |
| 17 script是否逐项有owner | 通过,5 gate +3 report +9 check |
| 21 ESLOT是否逐项有producer / maturity | 通过,21 /21;当前0 EV实例 |
| 九schema /九validation control是否有实施owner | 通过,9 /9 +9 /9 |
| 17 VETO是否逐项有最早规避 / producer / aggregation owner | 通过,17 /17;runtime全NotEvaluated |
| 254 TC分母是否闭合 | 通过,237 P0-C +13 P0-Q +4 conditional;12A /12B /13B /14C owner明确 |
| targeted / source / RELEASE / acceptance是否禁止混用 | 通过 |
| acceptance generator与review / adjudication是否分权 | 通过;14C无裁决 /风险接受 /签署权 |
| 是否发现阻塞Step 7的上游设计冲突 | 否 |
| 是否创建正式`07`、implementation ledger或boundary skeleton | 否,留待Step 13同步创建 |
| 是否创建实现代码、commit、run、EV、测试结果、review、风险接受、结论或签署 | 否 |

### 13.1 进入Step 8条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Phase门禁矩阵完整 | passed_design | 14 /14 |
| Commit boundary门禁矩阵完整 | passed_design | 32 /32 |
| Evidence / report / review归属明确 | passed_design | G0~G4与固定路径闭合 |
| 门禁失败处理明确 | passed_design | failure / blocked / infra / VETO / review均不继续 |
| 门禁逐项停审完成 | passed_design | 14 +32完成;现实前置诚实保留 |
| 跨门禁审计无unresolved冲突 | passed_design | 16 /7 /17 /21 /17 /254反查闭合 |
| 用户确认Step 7 | passed | 用户已明确同意,Step 8获得一次性放行 |

```text
step_7_result = completed_reviewed_passed_to_step_8
current_document = `07-实施计划.md`
current_step = Step 7 `嵌入测试与验收门禁`
current_module = `implementation_test_acceptance_gates_reviewed`
gate_status = completed_reviewed_passed_to_step_8
phase_gate_count = 14_of_14
commit_boundary_gate_count = 32_of_32
suite_count = 16_of_16
formal_gate_count = 7_of_7
planned_script_count = 17_of_17
planned_evidence_slot_count = 21_of_21
veto_count = 17_of_17
tc_count = 254_of_254_design_owner
next_allowed_action = 由Step 8承接配置、环境与外部依赖准备;若发现门禁契约冲突则回退Step 7
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
real_test_execution = not_started
real_evidence_created = no
allow_step_8_discussion = yes_user_confirmed
commit_required = no
```
