# Step 10. 定义可观测性、审计与证据门禁

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
> 书写规范: `standards/document/验收标准书写规范.md` §5.10
> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_11
> 所属流程: `06_acceptance_calibration_flow.md`
> Evidence追溯分件: `06_acceptance_step_10_evidence_traceability_register.md`
> Report / handoff停审分件: `06_acceptance_step_10_report_handoff_review_register.md`
> 事实成熟度: 门禁设计为`PassDesign`;0 target repo,0 fixed run,0 runtime EV,0 report实例,0 review,0验收结论

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 9并允许进入Step 10 | 是。Step 9三件已改为`completed_reviewed_passed_to_step_10`。 |
| 项目台账与flow是否允许进入 | 是。两者已转为Step 10 `in_progress`。 |
| 是否读取当前标准 | 是。已读取验收SOP Step 10、书写规范§5.10、中间产物规范和真相源闭环标准。 |
| 是否读取直接输入 | 是。已读取正式`03`§14、正式`05`§9 /§13、测试Step 13主件 / schema分件、验收Step 3 /4 /9及L1参考。 |
| 是否发现上游冲突 | 是。`gate-summary.md`与当前固定`gate-results.md`冲突;已按`SBX-ACC-EVIDENCE-GATE-PATH-001`回写关闭。 |
| 是否修改正式`06` | 否。正式`06`仍只historical material,Step 15前禁止修改。 |
| 本Step停审规则 | 三件产物和机械审计完成后停审;用户确认前不进入Step 11。 |

### 1.1 Step内计划

| 计划项 | 状态 | 产物 /门禁 |
|---|---|---|
| 读标准、上游与参考 | done | §3 |
| 裁决固定路径冲突 | done | §5;`SBX-ACC-EVIDENCE-GATE-PATH-001` |
| 定义runtime observability / audit owner | done | §7;`OAG-SBX-001~014` |
| 定义evidence identity / schema / source / status门禁 | done | §8;`EG-SBX-001~021` |
| 闭合21个planned evidence slot | done | 追溯分件;`ESTOP-SBX-001~021` |
| 闭合report / validation / handoff / review | done | report分件;`RSTOP-SBX-*`,`ECA-SBX-*` |
| 完成机械审计、flow /台账和停审 | done | §13 |

---

## 2. 本步目标、边界与成熟度

本Step把运行时可观测契约、测试raw artifact、派生report、runtime evidence item、acceptance draft和independent review收口为可裁决门禁。它回答:

1. 哪些行为必须有formal audit / marker / report,哪些只允许safe log / metric。
2. trace、log、metric、audit、relay marker、handoff marker、job report和diagnostic issue分别由谁生成、谁消费。
3. 21个`ESLOT-SBX-*`何时才能生成runtime `EV-SBX-<FAMILY>-<NNN>`,何时必须保持missing。
4. 四个fixed source、RELEASE、九类schema、九项validation control和固定report如何交叉验证。
5. `reports/acceptance/*`和`reports/review/*`何时只是草稿,何时可作决策packet,不得替代什么。
6. 缺raw、缺report、orphan EV、静态造证据、redaction失败、review缺失如何传播。

本Step不运行suite / script,不创建真实`run_id`、artifact、report、EV alias、defect、review record、风险接受、裁决或签署。不定义观测后端产品、dashboard、alert threshold、retention天数或运维runbook。

| 对象 | 当前成熟度 | 本Step能作的结论 |
|---|---|---|
| runtime observability / audit contract | `designed` | 可定义必须surface和禁止carrier,不可证明已埋点 |
| `ESLOT-SBX-001~021` | `planned` | 可定义expected和生成条件,不可写成runtime EV |
| machine schema / scripts | `planned_not_implemented` | 可审核字段、path和失败语义,不可写已执行 |
| fixed source / RELEASE | `absent` | 可定义identity门禁,当前只能保持Blocked / NotEntered |
| acceptance / review文件 | `absent` | 可定义固定入口与review门禁,不可填充结论 |

---

## 3. 输入承接与权威映射

| 输入 | 权威内容 | 本Step消费 |
|---|---|---|
| 验收SOP Step 10 / 书写规范§5.10 | 证据门禁、report完整性、handoff、逐项停审与跨证据审计 | 结构与必填表 |
| `03-详细设计.md` §14 | trace context、log、metric、`SandboxAuditTrace`、receipt、relay / handoff marker、job report、diagnostic issue | runtime可观测与formal audit边界 |
| `03_ddd_step_15_observability_audit.md` | flow级埋点、owner、redaction、query no-write、duplicate no-new-side-effect | `OAG-SBX-*`粒度 |
| `05-测试方案.md` §9 | 16 suite、7 gate、17 planned scripts、fixed-run raw / report | producer和validation control |
| `05-测试方案.md` §13 | 21 slot、runtime evidence生成链、固定目录、九schema、report maturity | evidence / report门禁 |
| `05_test_plan_step_13_evidence.md` | slot到PER / TC / suite / AC / VF,失败保留、review边界 | 追溯分件 |
| `05_test_plan_step_13_evidence_schemas.md` | 15 shared enum、9类JSON schema、digest、path、forbidden carrier | schema和status门禁 |
| 验收Step 3 /4 | ABSL-001~040、AENT / APAUSE / AEXT、四源identity、六个fixed acceptance / review入口 | entry / decision阶段传播 |
| 验收Step 5~9 | 功能、红线、协议、状态 /事务、NFR对planned evidence的引用 | AC / gate反查 |
| L1-governance / L1-artifact Step 10 | 表格组织和停审粒度 | 只作结构参考,不继承旧路径、EV或裁决 |

权威顺序固定为:当前通用标准 > 正式`03/05` > 已审查的当前L4中间产物 > L1结构参考 > 旧正式`06` / README historical material。

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 哪些行为必须有audit record | 有正式subject的accepted / business-rejected command、boundary / policy decision、run / capture / handoff、failure / control / cleanup / redline truth change必须有`SandboxAuditTrace`或所属formal marker / report。validation before subject与query不写business audit。 |
| 哪些行为必须有trace / log / metric | public command / query、consumer、relay、job、boundary / policy adapter、capture / handoff、cleanup / redline、UoW failure、config validation与no-write violation均必须有safe surface。 |
| 哪些测试报告必须归档 | fixed source与RELEASE的summary、gate-results、evidence index、coverage、redaction、dependency、report audit、suite / EV detail及六个acceptance / review文件。 |
| 证据缺失是否导致不通过 | mandatory证据缺失至少使验收不可裁决并保持Blocked;已执行断言Failed则导致对应AC失败。二者不得都写成产品Failed或都写成Skipped。 |
| 证据如何复查 | 从fixed RELEASE `evidence-index.md`回指root JSON和四源,再回指source suite report、case / check JSON、redacted logs与digest;禁止从Markdown反推raw。 |
| evidence index是否覆盖全部P0 EV | RELEASE expected set固定`ESLOT-SBX-001~019`;valid raw / report pair才生成item。missing slot必须留在`missing_slot_refs`,不分配alias。 |
| gate results是否覆盖全部release gate | `reports/runs/<run_id>/gate-results.md`必须覆盖GATE-SBX-PR / MAIN / OPS / P0Q / RELEASE及已激活conditional / scope-reopen的实际处置;路径唯一。 |
| redaction check是否覆盖raw与report | 必须同时扫描artifact root、run report root、acceptance和review输出;命中时只保留safe finding ref,不回显命中正文。 |
| handoff是否已审查补充 | 当前不存在。未来可由script生成草稿,但DecisionReady前必须有独立human / Agent review;草稿不得声明pass。 |
| veto checklist是否覆盖全部否决项 | 当前不存在。Step 11将固定最终VETO闭集;本Step只要求清单逐项有真实evidence / check / defect status,禁止默认Passed。 |
| risk acceptance是否支撑有条件通过 | 当前不存在且不作任何接受。Step 13只能处理彼时允许的候选;缺owner / action / expiry source或涉及VETO / S / A时不得有条件通过。 |
| 每个P0 EV是否能回指TC / artifact / report / AC | 追溯分件对`ESLOT-SBX-001~019`逐项定义必须回链;runtime必须展开exact TC / parameter / assertion,不允许range / wildcard。 |
| 每个evidence / report是否独立停审 | 是。slot分件使用`ESTOP-SBX-001~021`,report分件使用`RSTOP-SBX-*`;设计停审不runtime review状态分离。 |
| 跨证据审计是否检查伪造与孤儿 | report分件定义`ECA-SBX-*`,覆盖orphan / duplicate / missing / static / pairing / digest / path / redaction / blocked propagation / unreviewed draft。 |

---

## 5. 当前材料问题诊断与上游回写

| 问题 | 判定 | 处理 |
|---|---|---|
| 旧正式`06` | historical material | 只有泛化API / DB / log / trace证据和空checkbox,不用于本Step。 |
| L1 Step 10使用`gate-summary.md` | historical reference drift | 不继承;当前通用标准一致要求`gate-results.md`。 |
| L4已审查`05`使用`gate-summary.md` | 当前上游冲突 | 登记`SBX-ACC-EVIDENCE-GATE-PATH-001`,受控回写正式`05`、测试Step 9 /13 /15、flow和验收Step 4。 |
| Step 5~9引用planned slot | 合法但不足以裁决 | 本Step补充runtime item生成、fixed source、schema、validation和review条件,不将slot升格为实例。 |
| 无formal report-audit TC | contained gap | pairing / no-static等仍是validation control,不自动分配EV;若未来要求它们成为独立EV,必须重开`05` Step 5 /6 /9 /13。 |
| 无target repo / scripts / ENV / run | execution blocker | 不阻塞证据门禁设计,阻塞真实evidence、entry和裁决。 |
| retention无权威天数 | downstream physical-policy gap | 只使用condition-based guard;不发明TTL。 |

回写仅统一report文件名与planned writer名,没有改变suite、gate、source role、schema、status、TC、slot、测试结果或证据事实。项目内不得再保留可消费的第二gate report入口。

---

## 6. 验收裁决取舍

| 议题 | 采用方案 | 禁止方案 | 理由 |
|---|---|---|---|
| log能否替代formal audit | 不能;log / metric只是运行观测surface | 解析log重建truth change | log不是owner truth,可采样且不得携带敏感正文 |
| query是否为可追溯而写audit | 不能;query只写safe log / metric | query写audit / refresh / repair | 保持正式query no-write |
| duplicate replay是否新建audit / relay | 不能;只写safe replay log / metric | 为每次重放新建side effect | 保持stored replay与幂等契约 |
| evidence item能否从slot catalog直接生成 | 不能;必须有真实raw / report pair和checks | 从静态JSON / Markdown分配EV | 防止设计覆盖冒充执行覆盖 |
| report能否修正raw status | 不能;只能原样渲染并添加safe说明 | 把Failed / Blocked写成Passed / Skipped | 保持证据不可变 |
| acceptance draft能否替代raw / report | 不能;只是handoff和review入口 | 只看handoff宣告通过 | 保持可复核链 |
| review能否回写raw index | 不能;Reviewed / Disputed只写独立review record | 覆盖raw `review_status`或status | 保持raw immutable和审查独立性 |
| validation control是否自动是EV | 不是;它们决定item是否可信 | 无formal TC却为validation report分配EV | 不越过测试真相源 |
| conditional slot能否补偿P0 | 不能;020 /021只在formal trigger后适用 | 用P1 / P2或real-like结果补P0-Q | 保持证明上限与fixed source身份 |
| 缺证据是否统一写产品Failed | 不能;区分assertion Failed与identity / environment / evidence Blocked | 丢失失败主语 | 保持缺失传播可解释 |

---

## 7. Runtime可观测、审计与marker门禁

`OAG-SBX-*`是本Step内observability / audit gate索引,不是新需求AC、TC、EV、VETO或runtime schema enum。正式裁决仍聚合到`AC-SBX-039`和`AC-SBX-041`,并支撑其他AC / VF的证据可解释性。

### 7.1 Owner与carrier分层

| Surface | Writer owner / 触发 | 必须字段或回链 | 消费方 | 禁止替代 /泄漏 |
|---|---|---|---|---|
| `SandboxTraceContext` | API / worker / jobs entry从metadata / envelope / job input读取 | `trace_ref`与operation kind;domain / repository不自生成 | log / metric / audit / diagnostic关联 | raw request、event body、job body、随机补trace |
| command entry / completion log | entry adapter | trace、command kind、safe actor / subject ref、digest ref、result、duration | operations / test assertions | raw idempotency key、raw request、secret、stack |
| command metric | application / entry boundary返回前 | low-cardinality command kind / result / error kind | monitoring / tests | request / actor / subject / trace ID作label |
| `SandboxAuditTrace` | accepted command或有formal subject的business rejection所在UoW | subject、from / to status、reason ref、source cursor、trace context、related marker refs | audit query、reconciliation、relay、investigation | log替代audit;raw body / secret / adapter response |
| validation diagnostic | validation before subject / config builder / adapter preflight | stable code、safe summary、redacted diagnostic ref、supporting refs | troubleshooting / test | 伪造business audit;free text、stack、raw config |
| consumer receipt | inbound consumer accepted / duplicate / quarantined | receipt ref、source event ref、disposition、stored result ref、optional trace ref | worker ack / retry / quarantine | 强行创建不存在的subject audit;event body |
| relay marker | source transaction append / relay publish job | relay ref、event kind、source cursor、payload ref、relay status | relay worker / operations | payload body;publish failure回滚owner truth |
| handoff marker | handoff command / retry / feedback | handoff ref、target refs、status、receipt / report refs | cleanup guard / operations | downstream package body;marker替代owner truth |
| job report | operations job终止或stored replay | report ref、item refs、counts、status、stored result ref | tests / operations / acceptance evidence | 用free-form summary替代item;duplicate新建report |
| cleanup / redline report item | cleanup / reaper / redline flow | cleanup / redline ref、guard、containment、disposition、safe reason | security / operations / evidence | force-clean掩盖truth;raw process / artifact body |
| query log / metric | query entry boundary | query kind、surface status、freshness、page-limit class、duration | monitoring / test | audit append、write UoW、refresh / repair side effect |
| UoW / repository diagnostic | transaction / repository failure boundary | operation kind、phase、repository kind、error kind、diagnostic ref | troubleshooting / tests | SQL、record body、stack trace |
| config validation / availability signal | config validator / runtime builder | profile ref、section、adapter slot、availability、diagnostic ref | startup / operations / tests | raw material、endpoint / topic、degraded allow hard guard |

### 7.2 Observability / audit gate登记

| Gate | 主题 | 必须成立 | Planned证明 | 失败 /缺失影响 |
|---|---|---|---|---|
| OAG-SBX-001 | Trace source | command / query / consumer / job的trace只来自formal input;domain / repo 0 mint | ESLOT-002 /008 /015;CTR / CMD / QRY / CNS / JOB适用断言 | trace不可关联或自生成则AC-039 /041不可通过 |
| OAG-SBX-002 | Accepted command chain | truth save、audit、relay、projection stale、stored result、cursor同UoW并可回链 | ESLOT-002~006 /009 /011 /015;TXN / CMD / EVT | 缺formal audit或回链断裂则对应AC Failed |
| OAG-SBX-003 | Rejection boundary | validation-before-subject只写log / metric / diagnostic;有subject business reject写audit | ESLOT-002~004 /012 /015;ERR / CMD | 伪造audit或漏掉subject rejection则AC-039 /041 Failed |
| OAG-SBX-004 | Query no-write | query只写safe log / metric;0 audit / relay / repair / cleanup / redline side effect | ESLOT-007 /011 /015;QRY / TXN / RACE | 任一write为一致性与审计边界失败 |
| OAG-SBX-005 | Consumer receipt | accepted / duplicate / quarantined均有receipt / disposition;trace ref按subject optional | ESLOT-005 /008~010 /015;CNS | 丢receipt、重复side effect或伪造trace则不通过 |
| OAG-SBX-006 | Boundary / policy decision | decision status、reason、context / decision ref和diagnostic安全可关联 | ESLOT-003 /004 /015 /017;CMD / CONF | 决策盲区、partial boundary或raw policy body泄漏则失败 |
| OAG-SBX-007 | Run / capture / handoff | owner truth、audit、capture / handoff marker、report / disposition可回链 | ESLOT-005 /015 /018 /019;CMD / EVT / CONF | 缺链、package body泄漏或下游状态改写owner truth则失败 |
| OAG-SBX-008 | Relay no-rollback | source append与publish result分层;publish failure只改relay / report | ESLOT-009 /010 /015;EVT-015 / JOB-001 / RACE-014 | publish failure回滚owner truth或缺marker则失败 |
| OAG-SBX-009 | Cleanup / reaper / redline | guard、containment、cleanup / redline status、report item和safe reason完整 | ESLOT-006 /007 /015 /018;JOB / CONF / ERR | 提前释放、force-clean、缺disposition或泄漏则AC-038 /041失败并传Step 11 |
| OAG-SBX-010 | Duplicate replay | 0新business audit / relay / handoff / report item;允许safe replay log / metric | ESLOT-009~011;CNS / TXN / JOB | duplicate新建side effect则AC-040及相关AC失败 |
| OAG-SBX-011 | UoW / no-write violation | transaction phase / error可定位;no-write / no-repair violation必须显式signal | ESLOT-007 /011 /012 /015;TXN / RACE / ERR | 吞错、raw SQL / stack泄漏或无violation signal则失败 |
| OAG-SBX-012 | Config validation / builder | strict validation / availability有safe signal;hard guard不得degraded allow | ESLOT-004 /012~015;CFG / ERR | 默认值、weak fallback、raw material或静默degraded则失败 |
| OAG-SBX-013 | Metric cardinality | label只允许kind / state / result / category;不含实例ID或free text | ESLOT-015;CTR-006 / CFG-030及适用NFR断言 | 高基数 /敏感label则AC-041 Failed |
| OAG-SBX-014 | Diagnostic redaction | diagnostic只含stable code、safe summary / ref和supporting refs | ESLOT-012 /015 /018 /019;ERR / CFG / CONF | raw body、secret、full sensitive ref、stack或artifact body命中则不通过 |

### 7.3 Redaction与低基数硬边界

以下carrier在log、metric、audit、artifact、report、acceptance和review全链路禁止:raw secret / token / private key / credential value、full sensitive ref、raw endpoint / topic、SQL、HTTP / SDK / event body、process output正文、external body、stack trace、artifact package body、observability ledger body。

只允许typed / opaque ref、digest、stable code、closed enum、safe count、low-cardinality kind和redacted diagnostic ref。redaction report不得回显命中字符或正文;否则检查本身成为二次泄漏。

---

## 8. Evidence identity、schema、source与report门禁

`EG-SBX-*`是本Step内evidence gate索引,不是canonical AC、runtime EV、VETO或新测试用例。追溯分件按slot展开,报告分件按文件与validation control展开。

### 8.1 Evidence生成链和唯一定位

```text
reviewed PER / EHR / ESLOT catalog
  -> fixed source run context + immutable source / config identity
  -> real suite report.json + case JSON + redacted stdout / stderr + safe artifact
  -> schema / digest / path + nine validation controls
  -> source report pair
  -> runtime evidence item and detail page
  -> RELEASE evidence index with ordered source_run_refs
  -> acceptance drafts
  -> independent human / Agent review
  -> later acceptance adjudication
```

唯一runtime evidence实例定位为`(run_id,evidence_id,artifact_digest)`。`ESLOT-SBX-*`、`EV-SBX-<FAMILY>-<NNN>`pattern、root index digest、`latest`、branch、CI job URL、截图或Markdown行号均不能单独定位实例。当前本文不产生任何该三元组。

### 8.2 Evidence gate总表

| Gate | 证据主题 | 必须存在 /成立 | 通过条件 | 失败 /缺失传播 |
|---|---|---|---|---|
| EG-SBX-001 | Fixed baseline identity | context、source revisions、config identity、subject / design / harness refs | path / run / revision / digest交叉一致,无`latest` | 缺失使source不可升格,acceptance Blocked |
| EG-SBX-002 | Ordered release sources | MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q四source refs | 顺序、role / gate / ENV / PROFILE、revision和digest全部一致 | 任一source缺失 /错配使RELEASE Blocked / Failed |
| EG-SBX-003 | Suite raw completeness | 每个blocking invocation有`report.json`、stdout / stderr、适用case / safe artifact | Failed / Blocked / InfraFailed也保留,零输出保留零字节digest | 缺文件使pairing Failed,不分配EV |
| EG-SBX-004 | Nine-schema validity | 九类schema适用实例 | schema version、required field、enum、cross-field、digest、path均合法 | writer / report nonzero;gate InfraFailed或Blocked |
| EG-SBX-005 | Exact case coverage | 完整exact TC / parameter / assertion / execution role | expected / observed / primary唯一,无range / wildcard / duplicate主归属 | coverage Failed;对应AC不可裁决 |
| EG-SBX-006 | Reviewed slot catalog | reviewed `ESLOT-SBX-001~021` immutable ref | RELEASE expected 001~019;020 /021只在formal trigger后适用 | catalog漂移触发invalidation / DesignReopen |
| EG-SBX-007 | Runtime item derivation | valid raw / report pair + prerequisite checks | item含nonempty TC / artifact / report refs和自身digest;一slot / run最多一item | 静态item、空ref或duplicate item使no-static / report audit Failed |
| EG-SBX-008 | P0 evidence index | machine index + human `evidence-index.md` | 001~019全部有valid item,missing empty,source refs完整 | missing / orphan / digest mismatch使送验不成立 |
| EG-SBX-009 | Gate results | `reports/runs/<run_id>/gate-results.md` | 全部适用gate、source status、missing、blocked reason原样完整 | 缺报告、少gate或改status则不通过 |
| EG-SBX-010 | Redaction | redaction check raw + `redaction-check.md` | artifact / run reports / acceptance / review扫描Clean,负向fixture safe | 命中或扫描范围不全使门禁Failed,传Step 11 |
| EG-SBX-011 | Dependency boundary | dependency check raw + `dependency-boundary.md` | 只有允许的core compile upstream,图与manifest一致 | non-core sibling编译依赖或缺图则失败 |
| EG-SBX-012 | TC coverage control | TC coverage raw + `tc-coverage.md` | 254主归属 =237 P0-C +13 P0-Q +4 conditional,无missing / duplicate | 分母漂移、缺失或duplicate则失败 |
| EG-SBX-013 | Protocol inventory | protocol check raw + `protocol-inventory.md` | 55 /55 formal surface且family / TC / status一致 | 缺协议、旧名或错family则AC-031等不可通过 |
| EG-SBX-014 | Artifact / report pairing | pairing check raw + `report-audit.md` | 每个blocking suite / item有raw / report / digest pair | orphan raw / report / EV或missing pair则不分配 /不接受EV |
| EG-SBX-015 | No static evidence | no-static check raw + `report-audit.md` | item只从真实pair派生,acceptance无default pass | 手写EV、静态pass、planned slot升格使门禁Failed |
| EG-SBX-016 | Qualification identity | identity check + qualification result | candidate / profile / generation / ENV / capability / template / provider适用digest完整 | identity缺失只能Blocked且0 probe / launch |
| EG-SBX-017 | Blocked propagation | blocked check + source / gate reports | Blocked / InfraFailed / NotRunConditional保持原状态,不映射Skipped / Passed | 状态吞并使report audit和RELEASE失败 |
| EG-SBX-018 | Cleanup disposition | cleanup check + case / qualification / job reports | 每个test resource有cleaned / contained / investigation / teardown处置 | active / orphan / guard bypass / teardown failed阻断evidence与entry |
| EG-SBX-019 | Acceptance draft set | handoff / veto / risk / open issues四个fixed file | 绑定同一RELEASE /四源digest,scope / missing诚实,不预填pass / accept / sign | 草稿缺失阻断entry;虚假结论使证据门禁失败 |
| EG-SBX-020 | Independent review | reviewer notes + agent review两个fixed file | identity / version / time可定位,orphan / path / digest / redaction / trace审计完成 | 缺review阻断DecisionReady;Disputed不得被忽略 |
| EG-SBX-021 | Invalidation / retention | defect / invalidation / supersede refs + retention class | 旧证据immutable,变更影响面完整,保留至验收 /调查条件关闭 | 覆盖旧失败、删除hold证据或沿用invalidated Passed则不通过 |

### 8.3 九类machine schema门禁

| 类别 | Schema / path | 验收必检 | 非法时 |
|---|---|---|---|
| Run context | `sandbox.test.run-context.v1`;`meta/context.json` | run / gate / intent / scope / trigger / change / ENV / PROFILE / role / revision / roots / retention / digest | launch前Blocked / InfraFailed |
| Source revisions | `sandbox.test.source-revisions.v1`;`meta/source-commits.json` | design / subject / core-contracts / harness immutable refs及digest | source不可升格 |
| Config identity | `sandbox.test.config-identity.v1`;`meta/config-digest.json` | canonical ENV / PROFILE、generation、redacted config ref、material descriptor digest | identity失败 / Blocked |
| Suite report | `sandbox.test.suite-report.v1`;`suites/<suite>/report.json` | expected / observed TC、counts、status、failure、log digests、disposition | pairing / schema Failed |
| Case result | `sandbox.test.case-result.v1`;case JSON | exact TC / parameter / role / layer / CUT / PER / assertions / safe refs / disposition | 不得进入evidence item |
| Check result | `sandbox.test.check-result.v1`;`checks/<check>.json` | input path / digest、status、stable findings、safe refs、failure | validation control不可声明Passed |
| Safe artifact | `sandbox.test.safe-artifact.v1`;suite safe JSON | manifest-owned name / kind / status / safe refs / closed summary | 未知kind只能InfraFailed |
| Qualification result | `sandbox.test.qualification-result.v1`;SUITE-013 result | candidate identity、probe refs、product disposition、teardown、redaction | identity缺失只能Blocked |
| Evidence index | `sandbox.test.evidence-index.v1`;root + item | expected / missing slot、ordered source refs、checks、nonempty raw / report / TC refs、item / root digest | 不分配alias;RELEASE不可通过 |

### 8.4 状态闭集与禁止映射

| 主语 | 正式状态闭集 | 禁止映射 |
|---|---|---|
| Artifact / suite / case / check / evidence | `Passed`,`Failed`,`Blocked`,`NotRunConditional`,`InfraFailed` | `Skipped`,`Waived`,`Partial`,`UnknownPass`,`N/A` |
| Assertion | `Passed`,`Failed`,`Blocked`,`NotEvaluated` | 未执行写Passed;Blocked写Failed而丢失主语 |
| Redaction | `Clean`,`Failed`,`Blocked`,`NotEvaluated` | 未扫描写Clean |
| Review | raw index初始`Pending`;独立review使用`Reviewed`,`Disputed` | 回写raw index、用Reviewed改写evidence status |
| Acceptance process | Step 4的`NotEntered / EntryBlocked / InReview / Paused / DecisionReady`语义 | 把evidence Blocked直接伪写为产品Failed或已进入review |

`NotAdjudicable`只是验收文字对“缺必需证据无法作通过裁决”的说明,不是新machine enum。

### 8.5 Fixed source与RELEASE顺序

| 顺序 | Role | Gate | ENV / PROFILE | 主要证明责任 | 不能替代 |
|---:|---|---|---|---|---|
| 1 | MAIN-CONTRACT | GATE-SBX-MAIN | SBX-ENV-02 / SBX-PROFILE-02 | 237条P0-C主结果、contract / state / protocol / config主体 | MAIN-SEAM / OPS / PR / diagnostic |
| 2 | MAIN-SEAM | GATE-SBX-MAIN | SBX-ENV-03 / SBX-PROFILE-03 | controlled resolver / publisher / target / sink seam和failure mapping | 合并到MAIN-CONTRACT的同一run |
| 3 | OPS | GATE-SBX-OPS | SBX-ENV-04 / SBX-PROFILE-04 | replay、cleanup / redline simulation、pairing和honest disposition | MAIN或P0Q主结果 |
| 4 | P0Q | GATE-SBX-P0Q | SBX-ENV-05 / SBX-PROFILE-05 | candidate真实四维、lifecycle、capture、cleanup / redline、anti-substitution | P0-C、ENV-06、host、fake、历史packet |

RELEASE aggregation另建fixed run,context使用GATE-SBX-RELEASE / Release / SBX-ENV-02 / SBX-PROFILE-02并省略source role。聚合器身份不生产P0证明;证明效力只来自上表有序四source refs。

---

## 9. 缺失、失败、争议与裁决传播

| 情形 | 正确主语 /状态 | 验收影响 | 禁止处理 |
|---|---|---|---|
| source identity或ENV前置缺失 | source / gate `Blocked`;0 launch适用 | P0-C / P0-Q / RELEASE保持Blocked | 用另profile、历史run或默认值替代 |
| case assertion真实失败 | case / suite `Failed` | 对应AC / VF candidate失败并进Step 11 /12 | 改写Blocked、Skipped或删除artifact |
| script / writer系统失败 | `InfraFailed` | 证明不成立,不能通过 | 当作产品Failed或从旧report补洞 |
| mandatory raw / report / slot missing | pairing / evidence Blocked or Failed | 无runtime item,送验或对应AC不可裁决 | 手写EV / report、预留alias |
| inactive conditional slot | `NotRunConditional` | 不改P0结果,不宣称已验证 | 写Passed或补偿P0 |
| redaction或dependency失败 | check `Failed` | evidence gate失败;按Step 11评估VETO | 风险接受覆盖或回显finding正文 |
| qualification identity缺失 | P0Q `Blocked`;probe refs empty | P0-Q / RELEASE不能通过 | 先probe后补identity |
| cleanup / teardown失败 | case / check / qualification原状态 | 阻断evidence和entry,进safety / VETO评估 | force-clean、删调查证据 |
| acceptance draft缺失 | FormalEntryReady不满足 | 保持NotEntered / EntryBlocked | 进入后review再首次创建 |
| independent review缺失 | review incomplete | 不得DecisionReady | 用generator、同一writer或签署代替 |
| review `Disputed` | 独立争议记录 | 必须解决或进入最终不通过依据 | 回写raw为Passed或删除note |
| evidence invalidated | 旧artifact immutable + invalidation / supersede | 受影响结论暂停,需新run / review | 改文字继续消费旧Passed |

本Step不定义最终“通过 /有条件通过 /不通过”聚合算法或签署主体;它们仍属于Step 13 /14。本Step只定义缺哪个证据时不得声明什么。

---

## 10. 复杂度与分件裁决

| 判断 | 结论 |
|---|---|
| 主件是否可同时容纳21 slot和全部report停审 | 否。会超过500行并降低逐项审查可读性。 |
| 拆分方式 | 主件承载owner、总门禁、schema / status / source和传播;trace分件承载21 slot;report分件承载固定文件、九control、handoff / review和跨证据审计。 |
| 分件是否属于未来Step | 否。两个分件都是当前Step 10的必要中间产物。 |
| 是否降低可落码粒度 | 否。反而保留slot、schema、path、owner、status、check、review和传播的一一映射。 |

---

## 11. 正式章节回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
> - `design-calibration/06_acceptance_step_10_evidence_traceability_register.md`
> - `design-calibration/06_acceptance_step_10_report_handoff_review_register.md`
>
> 延伸阅读:
> - 建议继续阅读主件的“Runtime可观测、审计与marker门禁”“Evidence gate总表”“九类machine schema门禁”和“缺失传播”,再阅读两个分件的21-slot追溯和逐report停审。

正式`06-验收标准.md` §10后续必须回填:

1. `OAG-SBX-001~014`对runtime trace / log / metric / audit / marker / report的owner、必须surface和禁止替代。
2. `EG-SBX-001~021`的通过、失败和缺失传播,不将它们写成新canonical AC。
3. P0 expected slot固定001~019;020 /021只在formal conditional / reopen trigger后适用。
4. 九类schema、正式status闭集和MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q固定顺序。
5. 唯一gate report入口为`reports/runs/<run_id>/gate-results.md`,禁止第二同义路径。
6. 九项validation control、run report、四个acceptance draft和两个independent review文件的完整性门禁。
7. 静态造EV、orphan / duplicate / missing pair、redaction /依赖失败、Blocked吞并、unreviewed draft和invalidated evidence不得通过。

正式章节不得填写真实`run_id`、EV alias、report实例、review结果、风险接受、裁决或签署。

---

## 12. 上游影响、待确认与blocker

| 项目 | 状态 | 对本Step的影响 | 后续处理 |
|---|---|---|---|
| `SBX-ACC-EVIDENCE-GATE-PATH-001` | resolved_by_acceptance_step_10_writeback | 不再阻塞;唯一path已固定 | 后续`06/07`只能引用`gate-results.md` |
| `SBX-ACC-EVIDENCE-001` | open_for_runtime_evidence | 不阻塞设计;阻塞实际裁决 | 目标仓 / scripts / fixed run形成后才可生成实例 |
| `SBX-ACC-DELIVERY-001` | open_for_delivery_baseline | 当前只能NotEntered | 送验时固定ABSL-001~040 |
| `SBX-ACC-P0Q-001` | open_for_p0q_execution | P0Q / RELEASE保持Blocked | candidate / provider / dedicated lab齐备后才能0->launch |
| `SBX-ACC-RETENTION-001` | open_for_07_09_physical_policy | 不影响condition guard设计 | `07/09`选物理介质和期限,不得越过hold |
| report-audit无formal TC | contained_by_validation_control_boundary | control可阻断evidence,但不生成独立EV | 若要独立EV,先重开`05` |

当前没有阻塞Step 10设计收口的未解上游blocker。开放项阻塞真实送验、执行、evidence、review、通过或签署,不授权缩减门禁或伪造成熟度。

---

## 13. 自检与停审

| 检查项 | 结论 |
|---|---|
| SOP 14个问题是否逐项回答 | 通过;§4已逐项回答。 |
| Runtime owner / carrier是否分层 | 通过;§7.1分离trace / log / metric / audit / receipt / marker / report / diagnostic。 |
| `OAG-SBX-001~014`是否连续唯一 | 通过;14 /14。 |
| `EG-SBX-001~021`是否连续唯一 | 通过;21 /21。 |
| 21 slot是否逐项追溯与停审 | 通过;21 ESLOT /21 ESTOP,family / producer与测试Step 13零差异。 |
| 九schema、九validation control、四source是否闭合 | 通过;9 /9、9 /9、4 /4。 |
| fixed report / acceptance / review是否逐文件停审 | 通过;21 RSTOP、六个fixed acceptance / review文件完整。 |
| 是否存在第二gate report活跃路径 | 否;active契约全部为`gate-results.md`,旧名只存于historical /冲突登记。 |
| 是否伪造runtime evidence / review /结论 | 否;具体runtime EV alias=0,真实run / report / review /接受 /签署=0。 |
| 是否修改正式`06`或提前创建Step 11 / `07` | 否 |
| Markdown表格与diff格式是否合法 | 通过;三件33张表无列错,`git diff --check -- projects/L4-sandbox`无输出。 |
| 正式`06`是否保持未修改 | 通过;SHA-256仍为`003d98327b927ba4c776f71d7f9a8d08d3b04dbb20603e7a504ce67baff3c476`。 |

```text
current_document = `06-验收标准.md`
current_step = Step 10 `可观测性、审计与证据门禁`
gate_status = completed_reviewed_passed_to_step_11
formal_06_modified = no
runtime_acceptance = NotEntered
runtime_evidence_created = no
next_allowed_action = 用户已确认Step 10;Step 11可依flow开始
commit_required = no
```
