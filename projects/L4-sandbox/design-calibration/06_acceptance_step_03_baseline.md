# Step 3. 固定验收基线

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/验收标准书写规范.md` §5.3
> 回填章节: `06-验收标准.md` §3 验收基线
> 生成日期: 2026-07-14
> 状态: completed_reviewed_passed_to_step_4_with_step_4_entry_phase_writeback
> 所属流程: `06_acceptance_calibration_flow.md`
> 结构化分件: `06_acceptance_step_03_baseline_register.md`
> 本Step口径: 固定未来验收必须使用的文档、送验、交付、环境、配置、数据、依赖、fixed run、artifact / report、acceptance和review基线规则;不填写当前不存在的真实值,不生成验收项、runtime EV、结果、风险接受、结论或签署,不修改旧正式`06`。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 2 | 是。用户已明确回复“同意”;Step 2和两层台账均已放行Step 3。 |
| 项目 /文档 /Step门禁 | 通过。当前只允许完成Step 3;不得进入Step 4或修改正式`06`。 |
| 是否读取Step 3标准 | 是。已读取验收SOP Step 3、书写规范§5.3及通用中间产物 /真相源标准。 |
| 是否读取上游输入 | 是。已复核Step 1~2、正式`00~05`,重点读取`05` §7~§14、证据schema、回归与formal assembly。 |
| 是否读取粒度参考 | 是。已读取L1-governance和L1-artifact的验收Step 3;只参考结构,不继承其profile、EV或run语义。 |
| 旧正式`06`定位 | `historical_material`。旧泛化文档批次、test / staging、API / DB / trace证据和签署占位不得进入当前基线。 |
| 是否发现上游冲突 | 是。Step 3发现路径、metadata、canonical identity与MAIN source-run四项并已回写;Step 4另发现entry / decision阶段歧义并定向回写本Step。 |
| 当前实例事实 | 目标实现仓、交付、ENV实例、四个source run、raw / report、acceptance / review均不存在;当前没有可填的真实run或结论。 |
| 正式`06`是否修改 | 否。正式文件仍保持historical material,等待Step 15全量装配。 |
| 当前状态 | Step 3主件、登记分件、上游定向回写和机械自检均已完成;用户已明确确认并放行Step 4。 |

### 1.1 Step内计划

| 计划项 | 状态 | 可审查产物 /完成门禁 |
|---|---|---|
| 恢复状态并读取标准 /上游 | done | §2~§3;三层门禁、SOP十问和source material明确 |
| 诊断基线冲突并回写上游 | done | §5及§9;四项blocker有明确状态和影响面 |
| 回答SOP十问 | done | §4;文档、交付、run与三类固定路径逐项回答 |
| 固定基线闭集 | done | 分件§1~§4;ABSL-SBX-001~040、四源矩阵和字段规则完整 |
| 固定缺失 /变更 /失效传播 | done | 分件§5~§7;Blocked / Failed边界与禁止引用明确 |
| 完成范围反查 | done | 分件§8;ASCP-SBX-001~024无孤儿scope |
| 形成正式§3回填草稿 | done | §10;只收口规则,不写实例结论 |
| 机械自检并停审 | done | §12~§13;flow和项目台账已更新为`pass_wait_review`,未创建Step 4 |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| M1 文档 /标准 /交付source | done | done | done | done | done | pass | pass | 由M2接续 |
| M2 ENV / PROFILE / config / data / dependency | done | done | done | done | done | pass | pass | 由M3接续 |
| M3 fixed run / artifact / report / acceptance packet | done | done | done | done | done | pass | pass | 由M4接续 |
| M4 缺失传播 /失效 /上游影响 | done | done | done | done | done | pass | passed_to_step_4 | 用户已确认;由Step 4接续 |

---

## 2. 本步目标与边界

Step 2已经确定“验什么”。本Step把它转成“必须固定哪一组事实,后续裁决才有唯一主语”。核心不是填写一个`run_id`,而是建立从immutable design、送验claim、subject / build、role-specific environment到四个source run、RELEASE聚合、raw / report、acceptance / review的完整identity链。

本Step必须形成:

1. 正式`00~05`与适用标准的immutable source ref要求。
2. 送验claim、target repository、subject、build / image、core-contracts、harness和dependency graph的交付identity。
3. SBX-ENV-01~07 / SBX-PROFILE-01~07中本轮适用组合、config generation、数据、suite和依赖composition的固定规则。
4. MAIN-CONTRACT、MAIN-SEAM、OPS、P0Q四个fixed source run及RELEASE aggregation的角色、顺序与逐源digest规则。
5. `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*.md`、`reports/review/*.md`的合法入口。
6. 缺失、identity mismatch、基线变更、evidence invalidation和conditional claim激活的传播规则。
7. 当前真实readiness,并明确哪些缺口阻塞实际验收但不阻塞本Step规则设计。

本Step不形成:

- 不指定或伪造真实implementation commit、build ID、image digest、config digest、provider、lab、`run_id`或review version。
- 不分配`EV-SBX-*`,不把21个planned ESLOT、EHR或PER升格为runtime evidence。
- 不定义Step 4进入 /退出checkbox的最终文本,只提供其基线输入。
- 不提前生成Step 5~14的验收项、通过 /失败条件、VETO裁决、风险接受或最终签署。
- 不选择backend、provider、store、bus、sink、retention介质或数值SLO。
- 不创建正式`07`、implementation ledger、boundary skeleton、实现仓目录或任何测试 /报告实例。

---

## 3. 本步输入与读取结论

### 3.1 标准与前序Step

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| 验收SOP Step 3 | current | 提供十问、基线表、artifact / report / handoff路径与禁止引用 |
| 验收书写规范§5.3 | current | 提供正式§3必须输出的需求 /设计 /测试 /交付 /环境 /数据 /证据基线结构 |
| 中间产物规范 | current | 约束逐Step、先思考后写、分件、停审和三层台账 |
| 真相源闭环标准 | current | 约束immutable source、证据成熟度、实现前置与不得伪造事实 |
| `06_acceptance_step_01_input_boundary.md` | reviewed | 提供权威输入、证据成熟度和待固定基线候选 |
| `06_acceptance_step_02_scope.md` | reviewed | 提供AG-SBX-01~11、ASCP-SBX-001~024、P0双轴与P1 / P2激活规则 |

### 3.2 正式设计与测试输入

| 输入 | 本Step直接消费 | 当前成熟度 |
|---|---|---|
| `00-需求文档.md` | C / FR / BR / AC / VF、六类NFR、P0 /外围和风险触发 | reviewed design content;immutable source ref待固定 |
| `01-架构设计.md` | execution isolation truth、依赖裁剪、四维boundary、capture / handoff、cleanup / redline | reviewed design content;immutable source ref待固定 |
| `02-概要设计.md` | 组成部分、对象、接口、flow、state主题与异常 /配置影响 | reviewed design content;immutable source ref待固定 |
| `03-详细设计.md` | 55协议、31 canonical enum entry /30 owner-level machine /39 shared declaration、38 error、事务 /幂等 /并发、观测与test cut | reviewed design content;immutable source ref待固定 |
| `04-配置设计.md` | PROFILE-01~07、I001~I101、generation、EHR、VETO-CFG与activation | reviewed design content;immutable source ref待固定 |
| `05-测试方案.md` | 254 TC、28 DS、7 ENV / PROFILE、16 suite、7 gate、21 ESLOT、九schema、RT / RR | reviewed planned test baseline;无实现 /执行实例 |
| `05` Step 9 /11 /12 /13 /14 /15 | gate、复验、进退、evidence schema、回归 /失效和正式审计 | reviewed explanatory source;四源修正已回写 |
| 旧`README.md` /旧正式`06` | 仅供historical差异诊断 | forbidden as current baseline |

当前设计仓HEAD为可定位revision,但L4-sandbox当前正式文档和校准产物存在未纳入该revision的工作树内容。因此该HEAD不能被填入未来ABSL-SBX-008作为“代表当前设计内容”的immutable baseline。本文不要求现在提交,也不创建替代revision。

---

## 4. SOP十问回答

| SOP问题 | 回答 |
|---|---|
| 1. 按哪一版需求和设计验收? | 按正式`projects/L4-sandbox/00-需求文档.md`至`05-测试方案.md`以及适用验收 /通用标准。实际送验必须固定包含这些当前内容的immutable design / standards ref和逐文件digest;当前工作树尚无这样的统一revision,不得用现有HEAD冒充。 |
| 2. 按哪一版测试方案和测试结果裁决? | 测试方案按正式`05`;测试结果只消费四个fixed source run经GATE-SBX-RELEASE聚合后的final evidence packet。planned TC / ESLOT不等于结果;每个runtime EV必须回链正式TC、raw / report pair和validation checks。 |
| 3. 送验build / commit / image是什么? | 当前不存在。实际验收前必须固定target repository、subject revision、clean / status digest、build / package manifest、artifact digest;若送验claim包含image,再固定immutable image digest。core-contracts和test harness revision必须独立固定。 |
| 4. 环境、配置、数据和依赖是什么? | 每个source run单独固定一个canonical ENV / PROFILE、config generation、effective config / material descriptor digest、dataset / suite manifest和依赖composition。MAIN-CONTRACT=02,MAIN-SEAM=03,OPS=04,P0Q=05;不同profile不要求同一config generation,但必须属于同一送验source set。 |
| 5. 基线变更如何处理? | design、subject、core、harness、profile / config、data、suite / slot、candidate packet、report / scanner或acceptance refs变化时,按正式`05` §11 / §14使受影响旧结果失效,生成新fixed run / report / review version并记录invalidated / superseded;不得覆盖旧artifact。 |
| 6. 本轮固定`run_id`是什么? | 当前不填真实值。未来至少固定MAIN-CONTRACT、MAIN-SEAM、OPS、P0Q和RELEASE五个不同run ID;P1只有claim激活时另有独立run。不得使用`latest`或从路径 /时间推断。 |
| 7. 原始机器证据是否位于`artifacts/test/<run_id>`? | 必须是。根目录当前不存在。禁止增加project子层、`latest`或用临时目录 /手工文件作为正式raw基线。 |
| 8. 人类可读报告是否位于`reports/runs/<run_id>`? | 必须是。每个source和RELEASE都需固定summary、gate / coverage、suite / evidence与完整性报告并回链raw digest;根目录当前不存在。 |
| 9. 验收交接是否位于`reports/acceptance/`? | 必须是固定平铺的`handoff.md`,`veto-checklist.md`,`risk-acceptance.md`,`open-issues.md`;独立review固定在`reports/review/reviewer-notes.md`和`agent-review.md`。六文件当前均不存在,正文未来必须绑定fixed RELEASE、四源digest和各自review version。 |
| 10. 是否存在不可作为正式基线的引用? | 是。`latest`、branch / mutable tag、旧README /旧`06`、project子目录、acceptance / review run子目录、planned ESLOT、静态pass、PR / diagnostic绿色、低profile替代P0Q、聚合器ENV身份和空checkbox均禁止。 |

---

## 5. 当前材料与historical material问题诊断

| 位置 /材料 | 问题 | 本Step处理 |
|---|---|---|
| 旧正式`06`基线 | 使用“当前文档批次”、泛化test / staging和不可定位API / DB / trace | 全部降级historical;以ABSL-SBX-001~040重建 |
| 正式`05`旧acceptance / review路径 | 曾使用`reports/acceptance/<run_id>`与`reports/review/<run_id>` | 回写固定平铺入口;identity由正文承载;SBX-ACC-BASELINE-PATH-001关闭 |
| 正式`02/03/05`文件头 | 曾仍写Draft /待审查,与flow已审查状态冲突 | 只校准metadata,不改变designed事实成熟度;SBX-ACC-BASELINE-META-001关闭 |
| Step 13机器ENV / PROFILE | 曾使用非canonical缩写,Release aggregator无identity | 回写SBX-ENV / SBX-PROFILE全名并固定聚合器02;SBX-ACC-BASELINE-IDENTITY-001关闭 |
| GATE-SBX-MAIN | 曾把ENV-02与controlled ENV-03表达成一个fixed run,但context只能绑定一组identity | 保持单一gate,拆MAIN-CONTRACT / MAIN-SEAM两个run,RELEASE固定四源顺序;SBX-ACC-BASELINE-SOURCE-RUN-001关闭 |
| 当前设计revision | 当前HEAD不包含L4-sandbox未提交工作树内容 | ABSL-008保持待固定;不提交、不伪造source ref |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox`不存在 | ABSL-010~016保持Blocked;不创建仓或实现 |
| artifact / reports | `artifacts/test`,`reports/runs`,`reports/acceptance`,`reports/review`均不存在 | ABSL-030~039保持absent;不创建空目录或静态报告 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 本Step收稳后 | 原因 |
|---|---|---|---|
| 文档版本 | “当前文档 /批次” | `00~05` + standards逐文件digest + immutable design ref | 保证裁决版本可复查 |
| 送验主语 | build / commit未成体系 | claim、repo、subject、build / image、core、harness、dependency graph闭链 | 避免报告与被测物脱节 |
| 环境 | test / staging或多个profile混写 | 每个run唯一ENV / PROFILE / config generation | 保证机器identity诚实 |
| MAIN | 一个run同时声称02和03 | 单一gate下两个fixed role / run | 消除无法编码的双identity context |
| RELEASE | MAIN / OPS / P0Q三源泛称 | MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q固定顺序、逐源digest | seam证据不可隐藏在主run中 |
| config关系 | 容易要求跨profile同一config | 各source独立profile-specific identity,共享同一送验revision set | 不伪造跨profile相等 |
| evidence | 设计slot或泛化报告 | raw / report pair、final index、runtime EV和validation checks | 防止静态造证据 |
| acceptance / review | run子目录或路径承载identity | 固定平铺入口,正文承载release / source / review identity | 对齐标准路径且仍可版本化 |
| 基线变化 | 未统一失效 | invalidated / superseded +新run / review version + immutable保留 | 防止旧Passed跨identity复用 |

---

## 7. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 当前是否填真实值 | 全部真实实例保持待固定 / absent | 用占位commit、示例run或当前HEAD填表 | 当前无事实来源,占位会被误消费 |
| design revision | 要求未来形成包含当前内容的immutable ref | 把现有HEAD当作当前设计版本 | HEAD不含工作树变更 |
| MAIN gate / run关系 | gate保持一个,source run拆两个role | 新增第二个gate;或一个run含两profile | 前者无业务必要,后者违反context schema |
| config跨源关系 | 同revision set下逐source固定 | 四源强制同config generation | profile不同,强制相等不真实 |
| RELEASE证明效力 | 只来自四源 | 聚合器ENV-02也算P0-C证据 | 聚合器只执行完整性检查 |
| P0Q替代 | 仅ENV-05 / PROFILE-05完整packet | MAIN、OPS、P1或历史candidate替代 | P0-Q是不可替代核心轴 |
| acceptance路径 | 标准固定平铺入口 | `<release_run_id>`子目录 | 当前标准已明确固定入口 |
| 风险文件 | 即使无接受项也生成明确记录,但不预填接受 | 缺文件解释为“无风险”或模板预勾选 | 缺文件无法证明审查过 |
| conditional claim | 送验前声明激活,独立run | 看到结果后再决定是否适用 | 防止选择性范围收缩 |

---

## 8. 结构化中间产物总览

完整字段、40个稳定基线槽、缺失 /失效规则和ASCP覆盖位于`06_acceptance_step_03_baseline_register.md`。主件只保留裁决摘要,避免把超过500行的登记表压成不可审查长表。

### 8.1 基线类别摘要

| 类别 | ABSL范围 | 核心内容 | 当前实例状态 |
|---|---|---|---|
| 文档 /标准 | 001~008 | `00~05`、适用标准、逐文件digest和统一immutable design ref | 内容reviewed;immutable ref未形成 |
| 送验 /交付 | 009~016 | claim、repo、subject、build / image、core、harness、dependency graph | 目标仓与全部实例缺失 |
| ENV / config / data / dependency | 017~023 | role-specific环境、generation、candidate、DS、suite / slot、composition、redaction | 只有设计,无实例manifest |
| fixed run | 024~029 | MAIN-CONTRACT、MAIN-SEAM、OPS、P0Q、RELEASE和conditional P1 | 均无真实run |
| evidence / acceptance / review | 030~040 | raw、run reports、final index、P0Q packet、四份handoff、两份review、失效ledger | 路径和实例均不存在 |

### 8.2 固定Release source set

| 顺序 | Role | Gate | ENV / PROFILE | 证明上限 |
|---:|---|---|---|---|
| 1 | MAIN-CONTRACT | GATE-SBX-MAIN | SBX-ENV-02 / SBX-PROFILE-02 | 237条P0-C主结果与contract / invariant主体 |
| 2 | MAIN-SEAM | GATE-SBX-MAIN | SBX-ENV-03 / SBX-PROFILE-03 | controlled seam补强,不证明真实隔离 |
| 3 | OPS | GATE-SBX-OPS | SBX-ENV-04 / SBX-PROFILE-04 | lifecycle / replay / cleanup simulation补强 |
| 4 | P0Q | GATE-SBX-P0Q | SBX-ENV-05 / SBX-PROFILE-05 | 固定candidate真实四维与lifecycle资格 |

聚合器另有独立RELEASE run,固定SBX-ENV-02 / SBX-PROFILE-02。它必须逐源验证context / source revisions / config identity / evidence index digest,但不得把自己的环境身份写成上述第五个证明source。

### 8.3 当前readiness与裁决上限

| 层级 | 当前事实 | 允许写法 | 禁止写法 |
|---|---|---|---|
| design | `00~05`内容和Step 1~3规则已形成,但未形成代表当前工作树的immutable ref | `reviewed design content; source ref待固定` | `design baseline fixed` |
| delivery | 目标实现仓不存在 | `Blocked before acceptance entry` | `build ready` /虚构commit |
| environment | 七类ENV / PROFILE只有设计 | `environment instances absent` | `test environment available` |
| P0-C | 无MAIN-CONTRACT / MAIN-SEAM / OPS run | `NotEvaluated / Blocked` | `P0-C passed` |
| P0-Q | 无candidate、provider、lab或P0Q run | `Blocked; 0 launch` | `N/A` /低profile替代 |
| RELEASE | 无四源与aggregation | `Blocked` | `release evidence ready` |
| evidence | 无raw、report、EV或review | `none generated` | planned ESLOT写成EV |
| acceptance | 无handoff、风险接受、结论或签署 | `not entered` | 预填通过 /有条件通过 |

### 8.4 正式进入基线与裁决包完整性判定

Step 4复核发现需要区分两个时点:正式验收审查开始前必须已有完整测试 / evidence / acceptance draft输入;review结论、风险裁决与签署只能在验收过程中形成。以下第一组是`FormalEntryReady`前置,第二组是`DecisionPacketComplete`前置。

```text
FormalEntryReady
  = ABSL-001~012 + applicable 013 + 014~028 + applicable 029 complete
  AND ABSL-030~034 complete
  AND ABSL-035~037 identity-bound drafts exist
  AND no unresolved entry blocker defined by Step 4

DecisionPacketComplete
  = FormalEntryReady
  AND ABSL-035~037 finalized for the same fixed RELEASE
  AND ABSL-038~039 independent reviews complete
  AND applicable ABSL-040 invalidation / supersede relations resolved
```

未来一个验收批次只有满足`DecisionPacketComplete`且Step 4~14全部退出要求,裁决输入包才算完整。review、风险接受和签署不得为了满足`FormalEntryReady`被预填。

原完整性表达保留为逐项审计展开:

```text
ABSL-001~008 complete
AND ABSL-009~016 all applicable delivery identities complete
AND ABSL-017~023 complete for every mandatory source role
AND ABSL-024~028 are distinct fixed runs with valid ordered refs
AND ABSL-030~039 complete at the phase where each item is required
AND ABSL-036 honestly records pending / accepted / rejected / none without pre-acceptance fabrication
AND ABSL-040 contains every applicable invalidation / supersede relation
```

两个表达式都只定义阶段完整性,不定义“通过”。即使裁决包完整,任何P0 Failed、Blocked、VF / VETO命中或open S / A仍可导致不通过;这些规则留给Step 4~14。

---

## 9. 上游影响与Blocker处理

### 9.1 本Step发现并回写的上游冲突

| Blocker | 影响面 | 状态 | 回写结果 |
|---|---|---|---|
| SBX-ACC-BASELINE-PATH-001 | 正式`05`;测试Step 9 /13 /15 | `resolved_by_acceptance_step_3_writeback` | acceptance / review改为固定平铺路径,正文承载release / source / review identity |
| SBX-ACC-BASELINE-META-001 | 正式`02/03/05`文件头 | `resolved_by_acceptance_step_3_writeback` | metadata与已审查flow对齐,不改变契约或执行成熟度 |
| SBX-ACC-BASELINE-IDENTITY-001 | 正式`05`;测试Step 9 /13 /14 /15 | `resolved_by_acceptance_step_3_writeback` | canonical SBX-ENV / SBX-PROFILE和RELEASE aggregator identity明确 |
| SBX-ACC-BASELINE-SOURCE-RUN-001 | 正式`05`;测试Step 9~15 | `resolved_by_acceptance_step_3_writeback` | MAIN拆为两个source role / run,四源顺序与schema闭合 |
| SBX-ACC-ENTRY-PHASE-001 | Step 3主件 /登记分件 | `resolved_by_acceptance_step_4_writeback` | 区分FormalEntryReady与DecisionPacketComplete;四源 / evidence / draft在进入前齐备,review /风险裁决 /签署在进入后完成 |

上述回写只校准设计基线与验收阶段语义,不是实际测试执行,也不产生run、evidence或验收结论。正式`05`仍保持reviewed planned test baseline。

### 9.2 开放但不阻塞Step 3规则设计的事项

| Blocker | 当前状态 | 阻塞什么 | 不阻塞什么 |
|---|---|---|---|
| SBX-ACC-DELIVERY-001 | open_for_delivery_baseline | 实际验收进入、所有fixed run | Step 3基线规则和后续验收门禁设计 |
| SBX-ACC-EXECUTION-001 | open_for_07_precheck_and_execution | suite / script / CI执行与handoff生成 | Step 4~14定义未来裁决规则 |
| SBX-ACC-EVIDENCE-001 | open_for_runtime_evidence | 实际验收项结论、VETO、风险接受、签署 | planned evidence消费规则设计 |
| SBX-ACC-P0Q-001 | open_for_p0q_execution | P0-Q和整体P0实际裁决 | P0-Q通过 /失败规则设计 |
| SBX-ACC-RETENTION-001 | open_for_07_09_physical_policy | 数值TTL /介质和适用目标放行 | condition-based guard与基线identity |
| SBX-ACC-IMPLEMENT-001 | blocked_by_formal_06 | 正式`07`及实现开工 | 当前`06` Step 3~15设计 |

当前没有阻塞Step 3收口或Step 4规则设计的未解决上游冲突。若后续验收项发现正式字段、TC或evidence schema不可裁决,必须触发SBX-ACC-DESIGN-REOPEN-001并回写owner文档。

### 9.3 对上游正式文档的进一步影响

| 文档 | 是否需要继续修改 | 判定 |
|---|---:|---|
| `00-需求文档.md` | 否 | Step 3未改变目标、范围、AC或VF |
| `01-架构设计.md` | 否 | 四源是测试 /验收identity,未改变运行架构或truth ownership |
| `02-概要设计.md` | 已完成metadata校准 | 无对象、组件、flow或状态变化 |
| `03-详细设计.md` | 已完成metadata校准 | 未新增业务DTO;release source role属于test-local schema |
| `04-配置设计.md` | 否 | canonical ENV / PROFILE沿用既有定义;未新增配置项 |
| `05-测试方案.md` | 已完成四项定向回写 | gate数仍7,suite仍16,schema文件仍九类;只校准路径、identity和四源真实性 |

---

## 10. 正式`06-验收标准.md` §3回填草稿

以下内容只作为Step 15装配草稿。当前正式`06`不得修改。

### 10.1 章节来源声明草稿

```md
> 校准来源:
> - `design-calibration/06_acceptance_step_03_baseline.md`
> - `design-calibration/06_acceptance_step_03_baseline_register.md`
>
> 延伸阅读:
> - 建议继续阅读主件的“SOP十问回答”“上游影响与Blocker处理”和分件的“稳定基线登记闭集”“缺失与状态传播”“基线变更、失效与复验”,了解本章如何固定送验主语并防止旧证据跨基线复用。
```

### 10.2 验收基线原则草稿

正式验收必须固定一份immutable baseline packet。该packet同时绑定正式设计与标准、送验claim、subject / build / shared contracts / test harness、role-specific ENV / PROFILE / config / data / suite manifest、四个fixed source run、RELEASE aggregation、raw / report、acceptance handoff和独立review。

本章中的“待固定”表示送验前置要求,不表示已有实例。实际值缺失时按§4进入 /退出条件传播为Blocked或不可裁决,不得填示例值、使用`latest`或把planned evidence写成runtime evidence。

### 10.3 文档与交付基线草稿

| 基线类型 | 必须固定 | 实际送验标识 | 缺失影响 |
|---|---|---|---|
| 需求基线 | 正式`00-需求文档.md`路径、immutable design ref、content digest | 送验前填写 | AC / VF适用版本不可判定 |
| 设计基线 | 正式`01~04`逐文件path / digest及同一design ref | 送验前填写 | 架构、对象、协议、状态、配置与红线版本不可判定 |
| 测试基线 | 正式`05-测试方案.md`、254 TC /16 suite /21 slot manifest和harness revision | 送验前填写 | 测试分母与evidence producer不可判定 |
| 标准基线 | 验收SOP、书写规范及适用通用标准immutable ref | 送验前填写 | 裁决规则版本不可判定 |
| 送验声明 | 目标阶段、P0 mandatory、激活的P1 / P2 claim、明确非范围和declaration ref | 送验前填写 | mandatory scope不可判定 |
| subject | target repository、immutable implementation revision、workspace status digest | 送验前填写 | 无固定被测主语 |
| build / image | build / package manifest及sha256;claim含image时固定image digest | 送验前按适用填写 | bytes与subject不可回链 |
| shared contracts / harness | core-contracts revision / digest、test harness / writer revision | 送验前填写 | DTO契约或断言版本不可复验 |
| dependency boundary | lockfile / graph digest与dependency check | 送验前填写 | 构建不可复现或职责越界不可判定 |

当前设计仓工作树尚未形成可代表本轮内容的immutable design ref,目标实现仓也不存在。因此上述实际标识不得在设计阶段预填。

### 10.4 环境、配置、数据和source run草稿

每个fixed source run只能绑定一组`environment_id`,`profile_id`,`config_generation_ref`。Release source set固定如下:

| 顺序 / Role | Gate | ENV / PROFILE | 必需范围 | 证明边界 |
|---|---|---|---|---|
| 1 MAIN-CONTRACT | GATE-SBX-MAIN | SBX-ENV-02 / SBX-PROFILE-02 | SUITE-001~011 /014、237条P0-C主结果与MAIN checks | contract / invariant主体,不证明真实隔离 |
| 2 MAIN-SEAM | GATE-SBX-MAIN | SBX-ENV-03 / SBX-PROFILE-03 | SUITE-005 /008 /010 /011 controlled seam补强 | 接缝语义,不证明真实隔离 |
| 3 OPS | GATE-SBX-OPS | SBX-ENV-04 / SBX-PROFILE-04 | SUITE-012及007~010 /014扩展参数 | simulation与operations补强 |
| 4 P0Q | GATE-SBX-P0Q | SBX-ENV-05 / SBX-PROFILE-05 | SUITE-013整包及identity / redaction / cleanup checks | 固定candidate真实四维资格 |

四源必须使用不同fixed `run_id`,共享同一design / subject / core-contracts / test-harness revision。每个source分别固定自己的config generation、effective config / material descriptor digest、dataset / suite manifest和dependency composition;不同profile不要求使用同一config generation。

GATE-SBX-RELEASE另建独立aggregation run,聚合器固定SBX-ENV-02 / SBX-PROFILE-02。其`source_run_refs`必须按表中顺序保存role、run、gate、ENV / PROFILE、subject / config refs和context / source revisions / config identity / evidence index digest。聚合器自身不产生P0证明效力。

### 10.5 Evidence、acceptance与review入口草稿

| 入口 | 固定路径 | 必须绑定 | 当前状态 |
|---|---|---|---|
| machine raw | `artifacts/test/<run_id>/...` | fixed run context、suite / case / check、logs、digest | 不存在 |
| run reports | `reports/runs/<run_id>/...` | raw digest、gate / coverage / evidence / audit报告 | 不存在 |
| handoff | `reports/acceptance/handoff.md` | fixed RELEASE、四源identity / digest、scope / missing、review version | 不存在 |
| veto | `reports/acceptance/veto-checklist.md` | fixed RELEASE、VF / VETO evidence refs与状态 | 不存在 |
| risk | `reports/acceptance/risk-acceptance.md` | fixed RELEASE、风险owner role /动作 /期限 /状态;无接受项也须明确 | 不存在 |
| issues | `reports/acceptance/open-issues.md` | Failed / Blocked / missing / invalidated / disputed完整集合 | 不存在 |
| human review | `reports/review/reviewer-notes.md` | fixed RELEASE、四源digest、review identity / version / time | 不存在 |
| agent review | `reports/review/agent-review.md` | orphan / duplicate / path / digest / redaction / trace复核 | 不存在 |

禁止使用`latest`、project子层、acceptance / review run子目录、branch / mutable tag、旧README /旧`06`、planned ESLOT、静态pass、PR / diagnostic结果、低profile替代P0Q或聚合器identity作为正式基线。

### 10.6 变更与失效草稿

基线固定后,design / subject / core-contracts / harness、profile / config、dataset / suite、candidate packet、report / scanner或acceptance source refs的任何变化都必须按正式`05` §11 / §14判定影响面。受影响旧evidence标记invalidated / superseded并保留immutable artifact;生成新的fixed run、RELEASE packet和适用review version。不得覆盖旧失败、删除旧证据或只修改handoff文字继续消费旧Passed。

---

## 11. 复杂度与分件判断

| 判断 | 结论 |
|---|---|
| Step 3是否超过单件500行风险 | 是。40个基线槽、字段矩阵、缺失 /失效规则和24个scope反查无法安全压缩 |
| 拆分方式 | 主件承载SOP回答、诊断、取舍、总览、回填草稿和停审;登记分件承载ABSL闭集与机械规则 |
| 是否创建未来Step文件 | 否。分件属于当前Step 3,不是Step 4 |
| 是否影响正式章节来源 | 正式§3必须同时引用主件和登记分件 |
| 是否降低可落码粒度 | 否。分件保留role、field、path、digest、状态传播和失效关系 |

---

## 12. Step自检

| 自检项 | 当前结论 |
|---|---|
| SOP十问是否逐项回答 | 通过;§4为10 /10 |
| ABSL-SBX-001~040是否唯一、连续、无断号 | 通过;40定义 /40唯一 |
| ASCP-SBX-001~024是否均有基线覆盖 | 通过;分件§8覆盖24 /24 |
| 文档 /交付 /环境 /配置 /数据 /依赖是否完整 | 设计闭集完成;实例缺口诚实保留 |
| MAIN双identity冲突是否消解 | 已拆为MAIN-CONTRACT / MAIN-SEAM两个fixed run |
| RELEASE是否固定四源顺序与逐源digest | 通过;旧三源语义只保留在改动前诊断中 |
| artifact / report / acceptance / review路径是否符合标准 | 通过;旧路径只保留在historical /禁止引用表中 |
| 是否伪造commit、run、EV、结果、review或签署 | 否 |
| 是否修改正式`06`或创建Step 4 | 否,待git机械确认 |
| 是否创建实现代码 / ledger / skeleton | 否 |
| 是否存在阻塞本Step规则设计的上游blocker | 否;四项上游冲突已回写,执行blocker保持open |

---

## 13. 停审与进入下一步条件

本Step已完成机械自检并经用户确认。Step 4只允许按以下顺序接续:

1. 先把本Step、flow和项目台账从`pass_wait_review`转为`passed_to_step_4`。
2. 读取验收SOP Step 4、书写规范§5.4、本Step主件 /分件及正式`05` §11~§13。
3. 创建`06_acceptance_step_04_entry_exit.md`并定义未来进入 /退出条件。

用户确认前禁止:

- 创建Step 4文件或预写Step 4 checkbox。
- 修改正式`06-验收标准.md`。
- 创建正式`07`、implementation ledger或planned boundary skeleton。
- 创建目标实现仓、artifact / report目录、run、EV、风险接受或签署。

```text
current_document = `06-验收标准.md`
current_step = Step 3 `固定验收基线`
current_module = `completed_reviewed`
gate_status = passed_to_step_4
gate_reason = 用户已确认ABSL-SBX-001~040、四源run identity、合法路径、缺失传播、变更失效、ASCP-SBX-001~024反查和正式§3回填草稿
next_allowed_action = 由`06_acceptance_step_04_entry_exit.md`接续;不得进入Step 5
formal_document_write = prohibited_until_step_15
real_acceptance_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
