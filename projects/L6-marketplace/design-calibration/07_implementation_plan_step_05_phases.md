# 07 Step 5：实施阶段与依赖顺序

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | 前序Step4/Step3阅读修复；正式03 §6～17、04 §7、05 §6/9/13、06 §5/7/8/10；SOP Step5及书写规范5.5 |

### Step 内计划

| 单元 | 状态 | 产物 |
|---|---|---|
| 来源/问题/诊断/取舍 | done | §输入～取舍 |
| 七phase逐个收口 | done | §阶段表和下方定向小循环；按01→07串行推导 |
| 复杂度/跨phase审计 | done | chain/前置承载表；boundary细分交Step6 |
| 回填草稿 | done | 本Step末及正式§5 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

把43对象、49入口与读写/恢复/配置/证据承载面组织为可验证phase，禁止当前门禁依赖未来结果。

## 本步输入

[Step4交付物](07_implementation_plan_step_04_delivery_inventory.md)的问题/诊断/取舍和open项；[03全库存](../03-详细设计.md)§6.3、§10～17；[05自动化](05_test_plan_step_09_automation_gates.md)§7和[06证据索引](06_acceptance_step_10_evidence_index.md)。正式schema不在本Step复制。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 最小可运行或可测试的纵切是什么。 | 最小纯contract/guard可测试；第一个本地纵切为03-a的来源/责任→申请→正式决定消费→上架；所有前置类型、scope、原结果和UoW先闭合。 |
| 2. 哪些阶段必须先于其他阶段。 | PH-01→02→03→04→05→06→07；PH-04另显式依赖PH-03的Listed/ref，不以示例替真实读面。 |
| 3. 哪些风险或跨仓依赖需要前置。 | Core/SDK export、publisher/material/Gov/receiver/probe和artifact工具分别在最早使用点Spike；positive资格不会凭本计划成立。 |
| 4. 每个阶段完成后能验证什么。 | 每phase输出与门禁见阶段表；初期只定向层检查，完整主suite/EV留到可执行层齐全。 |
| 5. 是否存在按对象拆分而不可验证的阶段。 | 不按对象裸拆phase；foundation必须可编译/codec/guard，durable必须可事务回放，后续按功能纵切。 |
| 6. 哪些阶段可以并行，哪些不能并行。 | 本轮单agent严格串行；未来实现也按前置gate推进，不授权parallel agent或跨phase并行。 |
| 7. 每个 phase 是否有明确的功能增量、输入、输出、测试门禁和验收门禁。 | 七行均有正式输入、可验证输出、G-P编号、AC/VETO及非范围。 |
| 8. 每个 phase 是否包含只能由后续 phase 提供的对象、协议、flow、状态或证据。 | 发现的前置缺口已回修：FlowSupport/readfacade/ports在02-a，plan/lookup在02-b，U7重建在03-b，raw/report在01-a；不得由future生成当前成功。 |
| 9. 每个 phase 完成后是否通过停审。 | 下方逐phase定向小循环记录只表示本轮设计审查；实际Phase Gate等待run。 |
| 10. 所有 phase 完成后,依赖顺序、风险前置、外部依赖和验收覆盖是否通过跨 phase 审计。 | 跨phase审计检查链、49flow/215path/98TC主归属、资格与工具成熟度；Step13读-only核验才可最终pass。 |

## 当前文档问题诊断

初稿PH-03/04并列却要求PH-03的Listed版本；U1只有scope而无实现；search在03-b、rebuild在05-a导致读面依赖后置能力；早期证据门禁依赖07-a才存在的工具。上述四项都属于07排程truth，不改业务schema。

## 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| chain | publication与distribution并列 | 先来源/上架，再分发 | exact Listed gate前置 |
| U1 | 无边界 | 全部4flow归03-a | publisher/资格闭环 |
| U7 | refresh/rebuild后置05-a | 全4flow随catalog归03-b | 目录读面能重建且不会隐式维护 |
| 工具 | 全07-a | 01-a bootstrap，07-a final capability | early失败输出有生成者，shell不是finalEV |
| 公共helper | 业务时临场补 | 02-a/02-b明确首批 | 不依赖future service |

## 设计取舍

| 方案 | 结论 / 理由 |
|---|---|
| 先typed contracts/domain，再公共执行/PG，再业务 | 采用；前置面有正式03定义 |
| 目录只使用手工fixture然后将rebuild留未来 | 拒绝作为运行closure；测试fixture仅证明contract，不是可用catalog |
| 为早期门禁新增suite/修改98库存 | 拒绝；定向执行必须披露partial，不能偷换主集合 |
| 将八SDK positive全部前置 | 拒绝；当前只formal port/fake或真实Blocked，06-c再按资格装配 |

## 结构化中间产物

#### 阶段依赖图: Marketplace 的实施闭包

```text
[PH-01 contracts/domain/config + raw/report bootstrap]
  | enables typed inputs, failure diagnostics and report capability
  v
[PH-02 ports/runners/UoW + PG/lookup/plan/fake]
  | enables source, review and local publication
  v
[PH-03 U1/U2/U3 + U7 catalog/reference/rebuild]
  | supplies exact Listed version and usable read projection
  v
[PH-04 U4 distribution + U5 withdrawal/known impact/notice]
  | supplies durable responsibility and late-outcome facts
  v
[PH-05 U6 audit reads + recovery/Observation jobs]
  | supplies all 49 application result/report surfaces
  v
[PH-06 37 HTTP routes / 12 internal jobs / Web / 8 SDK slots]
  | permits full local regression; positive requires qualification
  v
[PH-07 22 tools complete / final EV / reviewed handoff]
```

关键说明：箭头表示实施前置，不表示部署或实时业务调用。PH-04 必须等待PH-03，不再并列；PH-03 查询所需U7维护不后置。01-a即交付失败诊断与raw/report/minimal-index工具能力；正式材料须提交后固定源码、新run生成。07-a完善final EV能力，完整材料通过后才Handoff07-b。全部工作由当前agent串行设计，不启动代理。

### 阶段总表

| PH | 可验证功能增量 | 依赖 / 输入 | 输出 | 测试/验收门禁（计划） |
|---|---|---|---|---|
| PH-01 | 类型、纯领域、配置与证据bootstrap | 正式03/04/05/06 + toolchain（待核验） | 43对象/14carrier/33canonical纯形状；七字段loader；22脚本参数/最小raw/report能力 | G-P1：D/C定向层与工具负例；AC-MP-G01/G02/G04；不等完整EV |
| PH-02 | 公共执行与本地durable frame | PH-01 + 实际PG前置 | 17ports/146方法、runner/readfacade/FlowSupport、32store/CAS/history/as-of/fake同语义 | G-P2：P/R/I定向原子性、原result/rollback；AC-MP-G02/G03；实际PG不可fake替代 |
| PH-03 | 来源/审核消费/目录与引用维护 | PH-02 | U1+U2、U3全部、U7全部；26flow；四projection builder/shadow/current read | G-P3：S/I/P/R定向；AC-MP-101/102/103/201/202/203/301/302/303；positive保留blocker |
| PH-04 | 分发与撤回通知责任 | PH-02 + PH-03 | U4七/U5九flow；no-new锁、原permission/probe、knownimpact | G-P4：W/S/R/P定向；AC-MP-401/402/403/501/502；VETO-MP-3/4/5 |
| PH-05 | 审计读取/恢复与安全交接 | PH-02 + PH-03 + PH-04 | U6三Q/一C/三J，完整原report/typed recovery/Observation防递归 | G-P5：R/X/P定向；AC-MP-302/503/504/G02/G03；Obspositive阻断 |
| PH-06 | 入口、Web与SDK adapter装配 | PH-01～05 | 37route/12内部Job/typed UI/8slot exact或Blocked，entry不直store | G-P6：W/B/I/C/X；AC-MP-G01/G04；全部49入口映射；未有qualification不开放positive |
| PH-07 | 全库存证据工具与分层审查交接 | PH-01～06 | 22脚本full capability、98TC/EV+requiredsubcase、artifact/seal、reviewed drafts/ledger | G-P7：11suite完整、20AC/5VETO按06三值；运行/审查均not-run |

### 前置承载与非范围

| 最早boundary | 必须已经存在的正式面 | 当前可验证 / 不能宣称 |
|---|---|---|
| 01-a | value/ref/DTO/state/domain + 05 schema/22 script contract | 每对象/类型分批；raw/失败report与minimal-index-shell能力；不能finalEV/退出 |
| 02-a | 17 ports、FlowSupport/FreshGate、ReadFacade、Command/Job runner、原result、ScopeResolver typed seam、UoW | fake只test/controlled；production缺qualification返回Blocked，无默认verified |
| 02-b | 32stores、全部计划/lookup/read/write/codec、事务帧/历史/固定upper | plan builder读取所有typed表，不调用尚未有的业务service；其他族测试构造typed已提交fixture，不造实际truth |
| 03-a | U1→U2→U3 commands所需source/basis/current gate | 21C需要Observation/projection work可在02持久排队，执行由03-b/05-b的独立Job；未执行不能宣称Fresh/handoff完成 |
| 03-b | U3 query + U7完整refresh/rebuild，四kind全plan/input/manifest/current filter | builder依赖02-b存取而非04/05服务；完整scope合法Empty与Degraded分别测试；Query零写 |
| 04-a/b | listed version、原intent/probe/late shared lock | 只局部分发/撤回/known影响，不installed/paid/delivered |
| 05-a/b | 原typed audit/result/work/恢复目标/readsurface | readonly replay与Observation独立；无Archive writer、TTL/GC |
| 06-a/b/c | 49application surface完整，entry只mapper；八SDK exactmapping | 未qualificationpositive保持Blocked，不用generic call/self Bound/fake fallback |
| 07-a/b | 早期工具已有，完整TC实现/runner/实际来源满足 | 98EV/detail/index后seal检查/draft审查，不生成自裁verdict/signoff |

### 本轮逐phase定向小循环记录

本表记录的是当前Step13审计中按PH-01→07执行的设计回修，不虚构首次Step5的历史运行。每行完成问题/来源→诊断→取舍→结构化→候选正文→本地设计停审后才推下一行。

| 单元 | 来源/问题 | 诊断与取舍 | 已落产物 / 停审结论 |
|---|---|---|---|
| PH-01 | 正式03/04/05/06 + toolchain（待核验）；增量是否能独立验证 | 43对象/14carrier/33canonical纯形状；七字段loader；22脚本参数/最小raw/report能力；删除future依赖与非范围 | G-P1与阶段表；设计分配完成，execution waiting |
| PH-02 | PH-01 + 实际PG前置；增量是否能独立验证 | 17ports/146方法、runner/readfacade/FlowSupport、32store/CAS/history/as-of/fake同语义；删除future依赖与非范围 | G-P2与阶段表；设计分配完成，execution waiting |
| PH-03 | PH-02；增量是否能独立验证 | U1+U2、U3全部、U7全部；26flow；四projection builder/shadow/current read；删除future依赖与非范围 | G-P3与阶段表；设计分配完成，execution waiting |
| PH-04 | PH-02 + PH-03；增量是否能独立验证 | U4七/U5九flow；no-new锁、原permission/probe、knownimpact；删除future依赖与非范围 | G-P4与阶段表；设计分配完成，execution waiting |
| PH-05 | PH-02 + PH-03 + PH-04；增量是否能独立验证 | U6三Q/一C/三J，完整原report/typed recovery/Observation防递归；删除future依赖与非范围 | G-P5与阶段表；设计分配完成，execution waiting |
| PH-06 | PH-01～05；增量是否能独立验证 | 37route/12内部Job/typed UI/8slot exact或Blocked，entry不直store；删除future依赖与非范围 | G-P6与阶段表；设计分配完成，execution waiting |
| PH-07 | PH-01～06；增量是否能独立验证 | 22脚本full capability、98TC/EV+requiredsubcase、artifact/seal、reviewed drafts/ledger；删除future依赖与非范围 | G-P7与阶段表；设计分配完成，execution waiting |

### 跨phase审计

| 检查 | 设计结论 / 未关闭 |
|---|---|
| 图/表/任务chain同源 | 已统一串行链；Step6再核boundary依赖 |
| 49flow与七U | U1/U2/U3/U7归03，U4/U5归04，U6归05；每入口唯一业务owner |
| 公共前置/phase越界 | 02-a ports/helpers，02-b plan/store，03-b rebuild已显式分配；无later callback依赖 |
| 早期验证/证据 | bootstrap在01-a；early partial不是suite pass、EV valid或验收完成 |
| owner/Scope/Billing/Archive | local负例可设计，positive资格受阻；财务/归档/0active event不进入phase |
| 运行门禁 | 全not-run；实际G-P只能未来真实执行产生 |

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

## 回填草稿

正式§5采用链图、七phase输入/输出/门禁及前置承载说明；§6展开15边界及批次。所有raw/tool/full-EV/审查保持planned。前置修复只调整07职责分配，不增加03业务面。

## 待确认事项

actual环境、不可变baseline、owner positive、容量/retention与审查者仍未具备；必须在各最早使用点按Step9处理。每phase实际gate不能用本Step设计记录代替。

## 进入下一步条件

七phase来源/非范围/前置surface经Step13实际静态核对，设计条件已满足；外部blocker不关闭。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
