# L4-sandbox 实施计划 Step 9 Commit Boundary风险反查分件

> 主件: `07_implementation_plan_step_09_spikes_risks_open_questions.md`
> 风险登记: `07_implementation_plan_step_09_risk_spike_register.md`
> Boundary真相源: 已审查`07_implementation_plan_step_06_tasks_commit_boundaries.md`
> Gate /准备真相源: 已审查Step 7及`07_implementation_plan_step_08_boundary_readiness_matrix.md`
> 创建日期: 2026-07-17
> 状态: completed_supporting_register
> 事实边界: 本矩阵定义future boundary如何消费风险登记,不表示Spike已执行、问题已关闭、boundary已active、gate已通过或存在实现 /测试 /证据事实。

---

## 1. 使用规则

1. Step 13创建32件planned skeleton时,每件必须复制本表对应行的Spike / Risk / OQ refs、最迟关闭门禁和未关闭动作,并与Step 6~8的required reads、scope、checks、environment / dependency准备合并。
2. future boundary只能在前序Handoff Gate通过且自身Activation前置关闭后成为唯一current。风险预读不得形成第二个active boundary、并行staging或提前实现。
3. Spike只在该boundary Activation / Design Gate前回答不确定问题;Spike输出不是Build / Test / Evidence Gate结果。
4. 表中`disclosure_only`表示该事项不阻塞当前P0 boundary,但必须保留proof ceiling;若其claim进入current scope,按登记表转MandatoryBlocker或DesignReopen。
5. 任一上游schema /状态 /port /配置 /TC /evidence契约缺口统一`blocked / wait_design`;任一repo /tool /candidate /lab等现实依赖缺失统一记`dependency_wait`原因并映射`blocked / handoff`;当前allowed scope内可修复的gate failure映射`blocked / fix_gate_failure`。不得用risk acceptance覆盖。

### 1.1 HDO风险入口

| Gate | 必须消费 | 关闭条件 | 未关闭动作 |
|---|---|---|---|
| `HDO-SBX-00` | `R-SBX-IMP-001/003/019/020`;`OQ-SBX-IMP-001/018` | Step 1~12已审查;正式`07`、项目implementation ledger与32件planned skeleton同步创建;用户决定真实design baseline;所有planned风险ref可定位 | `blocked / wait_design`;不得创建 /修改目标实现仓,不得把当前设计HEAD或工作区状态伪装成handoff baseline |

## 2. PH-01~PH-08 Boundary风险矩阵

| Boundary | Spike refs | Risk refs | OQ refs | Activation / Design前必须关闭或确认 | 未关闭 /命中时处置 |
|---|---|---|---|---|---|
| `CB-SBX-01A` | `SP-001/002` | `R-001~004`,`R-019/020` | `OQ-001~003`,`OQ-018` | HDO、目标仓策略、用户文件保护、git identity、Rust baseline、core exact revision /compatibility、only-core graph | design /scope漂移`wait_design`;repo /core /tool缺失记`dependency_wait`并`handoff`;不得创建业务代码、local shared type或commit |
| `CB-SBX-02A` | `SP-002` | `R-002~004`,`R-008`,`R-019/020` | `OQ-003` | core shared type /kind /package与body-free carrier source map 1:1闭合 | exact shared surface缺失回L0或`03/07`;不得alias错误kind、私造carrier或引入non-core依赖 |
| `CB-SBX-02B` | `SP-007` | `R-003/005/011/019/020` | - | semantic fake具备UoW staged commit /rollback、version、idempotency和three-channel stored replay | 外部required harness缺失记`dependency_wait`并`handoff`;当前scope fake失败`fix_gate_failure`;设计语义不唯一`wait_design`;不得简化为无事务map /盲重试 |
| `CB-SBX-02C` | `SP-003` | `R-003/008/013/014/019/020` | `OQ-004` | RFC 8785实现 /verifier、canonical /self-digest /path fixtures与schema owner确定 | `blocked`;无合格现实tool记`dependency_wait`并`handoff`,schema冲突`wait_design`,当前scope writer错误`fix_gate_failure`;不得静态EV、Passed或命令存在性替代 |
| `CB-SBX-02D` | `SP-004/015` | `R-003/004/008/013~015/020` | `OQ-005` | approved Shell规则 /lint、safe nonzero /raw preservation、最小脚本fixture和scope absence | `blocked`;现实规则 /tool缺失记`dependency_wait`并`handoff`,设计冲突`wait_design`,script错误`fix_gate_failure`;不得宣称CI binding、source run、EV或report通过 |
| `CB-SBX-03A` | `SP-005` | `R-003/006/008/019/020` | - | 40组 /101项 /44域expected manifest、single raw owner、NCFG /FC /XVAL与0-publication规则闭合 | config owner缺口`wait_design`;unknown /ambiguous /forbidden source保持Failed且0 publication |
| `CB-SBX-03B` | `SP-005/007` | `R-003/005/006/008/016/019/020` | `OQ-014~016` | P01~05 composition、23 descriptor /10 class、same-generation publication、P06 conditional和P07 reject可机械判定 | current P0缺口阻断;P06保持`NotRunConditional`;P07请求DesignReopen;真实产品不作为P0-C前置 |
| `CB-SBX-04A` | - | `R-003/007/008/019/020` | - | execution identity所有字段 /ref /初态 /error owner和body-free边界闭合 | source不唯一`wait_design`;不得匿名、自造context或接收外部正文 |
| `CB-SBX-04B` | `SP-006/007` | `R-003/005/007/008/011/019/020` | - | exact generation、resolver fake、UoW /stored replay /audit /relay source map与negative branch闭合 | 外部required fake缺失记`dependency_wait`并`handoff`;当前scope fake失败`fix_gate_failure`;契约缺口`wait_design`;不得等待Query /publisher或伪造real source |
| `CB-SBX-05A` | `SP-006` | `R-003/007/019/020` | `OQ-007` | active identity、four-dimension isolation + workspace requirement /template、handle /lease与state owner闭合;只消费抽象capability契约 | P0-C schema缺口`wait_design`;candidate现实输入仅`disclosure_only`,不阻塞contract boundary也不构成P0-Q证明 |
| `CB-SBX-05B` | `SP-006/007` | `R-003/005/007/019/020` | `OQ-006/007` | non-executing backend /capability fake、exact context /requirement /I065 generation source与no weak fallback闭合 | P0-C fake /设计缺口阻断;candidate未定不阻塞本slice但P0-Q保持NotEvaluated;不得host fallback |
| `CB-SBX-06A` | `SP-006` | `R-003/007/008/019/020` | - | policy /authorization body-free carrier、freshness /conflict /unsupported与high-risk fail-closed matrix闭合 | 任一source /state不唯一`wait_design`;不得local allow、正文入仓或Accepted default |
| `CB-SBX-06B` | `SP-006/007` | `R-003/005/007/008/011/019/020` | - | one-shot policy port、exact prior requirement、stored result /audit /relay /replay与backend call budget=0闭合 | missing /stale /conflict /unsupported保持formal reject;不得复用old decision或launch |
| `CB-SBX-07A` | `SP-006/007` | `R-003/005/007/008/011/019/020` | - | exact boundary /handle /lease active guard、Accepted policy、non-executing launch outcome与owner-call trace闭合 | mismatch /expiry /non-Accepted时launch=0;不得重算lease、scan latest或实现tool semantics |
| `CB-SBX-07B` | `SP-007` | `R-003/005/008/009/011/019/020` | - | capture outcome /size /redaction /partial /failed、body-free material和source truth no-rollback闭合 | raw leak为S /VETO;unavailable /partial诚实保留;不得升格Artifact /observability truth |
| `CB-SBX-07C` | `SP-007` | `R-003/005/008/009/019/020` | - | target identity、handoff fact、retryable /failed、receipt证明上限与capture no-rollback闭合 | target缺失按formal reject /failed;receipt不等于downstream accepted;不得回滚capture |
| `CB-SBX-08A` | `SP-007` | `R-003/005/007~009/019/020` | - | control race、failure classification source、unknown /partial语义和audit /replay闭合 | 无唯一classification`wait_design`;unknown不得成功;不得混入runtime agent recovery orchestration |
| `CB-SBX-08B` | `SP-007/008` | `R-003/005/008/009/017/019/020` | `OQ-013/017` | guard-first、release call budget、lease /orphan /containment /investigation与simulation disposition闭合 | non-Allowed release=0;物理TTL /fleet项`disclosure_only`;若法规 /production claim激活则MandatoryBlocker,无真实delete探索 |

## 3. PH-09~PH-14 Boundary风险矩阵

| Boundary | Spike refs | Risk refs | OQ refs | Activation / Design前必须关闭或确认 | 未关闭 /命中时处置 |
|---|---|---|---|---|---|
| `CB-SBX-09A` | `SP-009` | `R-003/008/010/019/020` | - | 13 /13 view /selector /cursor /visibility /stale source与typed finder callable surface闭合 | 缺finder /marker source`wait_design`;不得storage scan、string guess或临时enum |
| `CB-SBX-09B` | `SP-007/009` | `R-003/005/008/010/019/020` | - | semantic read fake、degraded /empty /bounded page fixtures和write-audit=0闭合 | unavailable按formal mapper;write /refresh /repair命中VETO-SBX-012,阻断Handoff |
| `CB-SBX-10A` | `SP-007/010` | `R-003/005/008/010/011/019/020` | - | 9 source identity /schema /dedup /receipt /affected marker与quarantine闭合 | enabled binding缺失loop不启动;consumer不得造core success、二写或吞duplicate |
| `CB-SBX-10B` | `SP-007/010` | `R-003/005/008/009/011/019/020` | `OQ-016` | 13 stored payload /source identity /route /publisher outcome /dead-letter闭合 | real bus只`disclosure_only`;payload source缺口`wait_design`;publish failure不得回滚source |
| `CB-SBX-11A` | `SP-007/011` | `R-003/005/008/010/011/019/020` | - | 10 typed job input /scope /selection /page /per-item UoW /stored report replay闭合 | scope /report缺口`wait_design`;duplicate owner calls必须0,不得用job修truth |
| `CB-SBX-11B` | `SP-007/011` | `R-003/005/008~011/019/020` | `OQ-016` | relay /reference /capability /handoff job target、partial report与no-rollback /no-repair闭合 | real target不作为P0-C前置;adapter failure写partial /failed,不得修source或隐藏failed item |
| `CB-SBX-11C` | `SP-007/008/011` | `R-003/005/008~011/017/019/020` | `OQ-013/017` | safety /projection /derived /reconciliation job的guard-first、atomic report、write-set和simulation scope闭合 | physical soak /alert /fleet只`disclosure_only`;release=0 for non-Allowed;不得伪装scheduler已运行 |
| `CB-SBX-12A` | - | `R-003/004/006/008/010/013/019/020` | - | 55 protocol、30 owner machines /31 canonical enum entries /39 shared declarations、38 error、254 TC、40 /101 /44 manifest读取与唯一主归属无缺失 /换义 | design inventory缺口`wait_design`;不得新增同义ID或用report伪装完整 |
| `CB-SBX-12B` | `SP-007/008/012` | `R-003~013`,`R-019/020` | - | 14 TXN /19 race、fake parity、redaction、MAIN-CONTRACT /MAIN-SEAM /OPS writer能力和fixed identity全量闭合 | 任一P0-C /role /pairing缺口阻断;不得写真实source Passed、合并MAIN roles或用targeted补source |
| `CB-SBX-13A` | `SP-013` | `R-001/003/004/006~008/012/019/020` | `OQ-006~009` | 单一candidate ADR /revision、P05 /ENV-05 /generation /template /capability /provider /material /lab immutable packet全部形成 | 任一缺失source `Blocked`;probe /launch=0;现实依赖缺失记`dependency_wait`并`handoff`,新surface`wait_design`;无搜索 /替换 |
| `CB-SBX-13B` | `SP-007/008/014` | `R-003/005/007~009/012/013/019/020` | `OQ-006~009` | 13A packet未变、CONF harness、identity /redaction /cleanup checks、product +lab disposition与authorized lab形成 | preflight异常不执行CONF;failure /containment保留;teardown不能改写product truth;无source Passed预填 |
| `CB-SBX-14A` | `SP-004/012/015` | `R-003/004/008/013~015/019/020` | `OQ-005/010/011` | 7 gate /9 check、四source固定顺序、status /identity /digest /missing fixtures和Shell规则闭合 | CI binding未形成只验证local fixture;前序13B Handoff未通过则不激活;不得声称workflow /source存在 |
| `CB-SBX-14B` | `SP-003/015` | `R-003/008/013~015/019/020` | `OQ-004/010/011` | 九schema /21 slot、RFC 8785、fixed roots、raw /report pairing、EV allocation guard和failure preservation闭合 | missing /mismatch /static input nonzero;无合法runtime pair不分配EV;不得伪造run ID |
| `CB-SBX-14C` | `SP-015` | `R-003/004/008/013~020` | `OQ-010~018` | acceptance generator只产四份draft /handoff;VETO /defect /risk /conditional字段与review分权、residual disclosure和Step 13风险ref闭合 | 真实CI /run /review /authority缺失不阻塞draft capability但禁止任何裁决事实;P06 conditional、P07 DesignReopen;S /A /VETO不可接受 |

引用缩写按本分件统一展开为`SP-SBX-IMP-*`、`R-SBX-IMP-*`和`OQ-SBX-IMP-*`;例如`SP-003`即`SP-SBX-IMP-003`。正式§9和planned skeleton必须使用全ID,不得只保留缩写。

## 4. Phase级风险传播

| Phase | 主要风险主题 | Phase完成前必须成立 | 不得形成的虚假结论 |
|---|---|---|---|
| PH-01 | HDO、repo /toolchain /core、依赖裁剪 | `01A`全部前置真实关闭 | “设计工作区=baseline”“仓不存在也可已实现” |
| PH-02 | carrier /UoW /canonical /Shell kernel | shared type、parity、canonical和script规则可机械验证 | canonical命令存在=RFC 8785通过;fixture=CI |
| PH-03 | strict config /material /generation | complete same-generation publication与P06 /P07边界 | partial Ready、raw material或P07 ready |
| PH-04 | intake /execution identity | identity owner、UoW、audit /replay闭合 | 匿名 /自造context为formal success |
| PH-05 | coherent boundary | active identity前置、四维隔离 + workspace requirement整体decision、no weak fallback | controlled fake=candidate qualification |
| PH-06 | policy /launch gate | fail-closed与backend call=0 | sandbox拥有policy truth或local allow |
| PH-07 | run /capture /handoff | exact guards、truth分层、failure no-rollback | capture /receipt=Artifact /downstream truth |
| PH-08 | failure /control /cleanup /redline | unknown诚实、guard-first、release=0 | force cleanup、advisory containment、已证明长期TTL |
| PH-09 | read surface | 13 Query callable source和write=0 | scan /repair或Query作为第二写源 |
| PH-10 | consumer /relay | 9 /13 source identity、dedup /receipt、stored payload | event正文入仓、publish失败回滚source |
| PH-11 | jobs | 10 Job stored report、partial诚实、no-repair | duplicate重跑、manual=scheduled、job修truth |
| PH-12 | P0-C hardening | 237 P0-C owner、55 /30 owner machines /31 enum entries /39 shared declarations /38 /14 /19与三source writer能力 | source run /Passed /EV已产生 |
| PH-13 | P0-Q | exact P05 packet、13 CONF harness、双disposition | fake /P06 /host替代、缺identity仍probe |
| PH-14 | gate /report /draft | 五级maturity、四source aggregation、no-static和分权 | CI /run /EV /risk acceptance /verdict /signature已存在 |

## 5. 转换与传播算法

```text
before activating a boundary:
  load exact design baseline, project ledger, boundary skeleton
  load this row's full SP / R / OQ records

  if an applicable Spike has no reviewed closure record:
    gate_status = blocked
    next_allowed_action = wait_design for design gaps
    next_allowed_action = handoff for dependency_wait

  if an Open Question is past its exact deadline:
    apply its default safe disposition
    never infer a decision from implementation convenience

  if a design owner surface is missing or conflicts:
    gate_status = blocked
    next_allowed_action = wait_design
    invalidate affected downstream planned checks

  if a required repo / tool / environment / candidate / lab is unavailable:
    gate_status = blocked
    blocker_reason = dependency_wait
    next_allowed_action = handoff

  if boundary is 13A / 13B and qualification identity is incomplete:
    source_status = Blocked
    require probe_calls = 0 and launch_calls = 0

  if only P1 / P2 future input is inactive:
    preserve DisclosureOnly or NotRunConditional
    do not block current P0 unless the claim has entered scope

  if S / A, VF / VETO, P0 failure or evidence-integrity risk is triggered:
    block commit / source / release as owned by the formal gate
    never route to risk acceptance
```

## 6. 覆盖与停审

### 6.1 计数审计

| 对象 | 设计数量 | 本矩阵覆盖 | 结论 |
|---|---:|---:|---|
| HDO | 1 | 1 | covered |
| Phase | 14 | 14 | covered |
| Commit Boundary | 32 | 32 | covered |
| Spike | 15 | 15 | covered;均有最迟关闭boundary |
| Risk | 20 | 20 | covered;均有boundary或future trigger入口 |
| Open Question | 18 | 18 | covered;均有decision deadline和默认安全处置 |

### 6.2 跨Boundary审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否改变Step 6顺序 | 否 | 仍严格单current `01A -> ... -> 14C` |
| 是否把Spike当实现phase /commit | 否 | Spike只在Activation / Design前输出closure record |
| 是否让candidate阻塞P0-C | 否 | 05A /05B仅抽象核对;现实packet只阻塞13A /13B |
| 是否允许fake证明P0-Q | 否 | 13A /13B exact P05 /ENV-05,缺失Blocked +0 launch |
| 是否允许CI缺失阻塞local script capability | 否 | 14A可local fixture;真实source invocation仍等待CI /authority |
| 是否允许P06 /P07补P0 | 否 | P06 `NotRunConditional`;P07 DesignReopen |
| 是否把risk acceptance当fallback | 否 | S /A、VETO、P0、前置和evidence风险全部Prohibited /MandatoryBlocker |
| 是否预填执行事实 | 否 | 当前0 active boundary、0 Spike execution、0 result、0 risk acceptance |

```text
hdo_count = 1_of_1
phase_count = 14_of_14
boundary_count = 32_of_32
spike_ref_count = 15_of_15
risk_ref_count = 20_of_20
open_question_ref_count = 18_of_18
active_boundary = 0
executed_spike = 0
closed_runtime_risk = 0
accepted_runtime_risk = 0
```
