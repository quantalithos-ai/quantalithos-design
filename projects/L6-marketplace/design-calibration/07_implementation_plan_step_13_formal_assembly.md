# 07 Step 13：正式实施计划装配

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step1～12；实施SOP Step13/书写规范主链；中间产物/闭环§9/代码台账；当前07flow/projectledger |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 初审发现问题/回所属Step/真相源 | done | Step1～12、04flow/Step7+正式04一句 |
| 独立结构化库存/骨架 | done | 7phase/15boundary/49task/49flow/215path/98TC/55×15 |
| 复杂度与批次 | done | 正式A～E装配；经验/库存另附录 |
| 正式回填 | done | 13章结论已按A～E传播；实际静态已核 |
| 实际静态检查/修复 | done | 07_implementation_static_review_record.md；37文件与完整库存检查通过，修复后复验 |
| 停审与状态同步 | done | completed/selfcheck_done/stop_review/waiting_user_confirmation；implementation依旧planned |

## 本步目标

完成13章正式07、implementationledger及全部15planned skeleton；状态真实性、正式sources与可落码移交门禁一致，不实施或提交。

## 本步输入

Step1～12已完成本轮定向结构化，保留各自SOP/问题/诊断/取舍/回填/open。现有07为本轮新建装配草稿，非historicaltruth；初审发现误差，先回所属Step而非只改正式稿。旧README/draft/原型或重启前历史不得授权设计真相。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 正式文档是否完整覆盖书写规范章节主链。 | 正式13章主链按规范，从Step1～12结论分A～E批传播；装配与实际静态核验已完成。 |
| 2. 每一章是否来自已确认中间产物。 | 每章具体calibration与延伸阅读；不会把SOP问答/诊断复制正式正文。 |
| 3. 阶段编号、任务编号和门禁编号是否一致。 | PH01～07、49tasks/BATCH族、15boundary、98TC/EV与主suite/AC-MP/VETO-MP统一后再实核。 |
| 4. 上游引用、测试引用和验收引用是否准确。 | 真实文件引用/requiredreads、11正式suite与20AC/5VETO、04七字段及九owner资格静态核；引用不资格。 |
| 5. 是否存在详细设计内容被复制进实施计划。 | 不复制03 structs/traits/flowbody/DDL，正式07只职责/来源/排程/门禁及schema导航。 |
| 6. 每个 phase / commit boundary 是否都有开工前字段、DTO、状态、证据和 phase boundary 复核。 | 七phase和15boundary有正式来源/55独立审计/原始工具成熟度/当前和future区分。 |
| 7. 正式 `07` 是否包含交付实现前可落码闭环审计门禁、审计表和对应永久记忆种子。 | Step12逐15表/§9.1审计、55项与MEM-MP-010完整种子；immutablebaseline未冻仍不handoff。 |
| 8. 是否存在未解释的空表、空图或占位内容。 | 未有事实明确not_created/pending/blocked，不伪填空表为pass；全部主链/ASCII图有label和解释，skeleton是合法planned而非敷衍placeholder。 |

## 当前文档问题诊断

初审：15误写14、suite字母猜业务、JSONleaf误计七字段、U1漏排、U7/runner/plan/证据工具后置、PH04与PH03并列、55经验与Worktree/CommitRecord缺失、旧pass声明误导。全部先回Step3/5/6/7/8及其前后关联，04仅最小句修；final gate不能在实际静态前pass。

追加源码固定审查：正式05 Context的implementation_commit/generator_commit必须真实同源，不能以旧HEAD代表未提交增量。已回Step3/5/6/7/11/12与15骨架/库存附录，进一步修正表格的提交前/后口径与MEM-MP-006，再传播正式07；提交前只非合格诊断，07-a提交后newrun产完整材料，Handoff通过前不激活07-b。05/06schema和required集合保持不变。

包含静态记录的扩展检查发现Step9缺独立“待确认事项”节，原内容在结构化产物内。已按固定十段归位，责任/截止/waiting不变，回填结论不新增。该次检查退出1留在静态记录；修复后必须重新执行才登记完成。

## 改动前后对比

| 项 | 初审 | 本次结构化 / 装配目标 |
|---|---|---|
| pipeline | future依赖/并列 | 串行7phase，PH04先有PH03Listed |
| coverage | 14口径/U1缺/粗batch | 15/49flow/49task族/215path/98TC分配 |
| gating | 字母误译/早期EV | 11真suite/早期partial与07-afinal分离 |
| source pinning | 未提交增量可能冒旧HEAD/finalEV | 提交前诊断不入正式Context；提交后固定真实源码/newrun再核Handoff |
| config | 七leaf/locale遗漏 | 七Rust字段，04源句先修 |
| audit | 少数经验/缺ledger事实 | 55×15 P/N/B与所有实际gates未执行 |
| truth | 草稿pass | 先staticrecord再同步Step/flow/台账 |

## 设计取舍

本轮full-restart仍只从当前正式00～06独立结论装配。正在装配的新草稿通过所属Step修复传播，不重新借historical正文。复杂库存/逐经验放规范性附录及独立skeleton，正式不复制业务schema；实际运行与baseline冻结保持阻断。

## 结构化中间产物

### 正式装配批次与来源

| 批次 | 章节 | 必须结论 | 当前计划检查 |
|---|---|---|---|
| A | §1～4 | 输入/所有权/具体reads/机械记忆/交付物 | 正式sources/path，不复制schema |
| B | §5～6 | serialchain、7phase任务/批次/15scope/gates/55入口 | U1/U7/前置tools/PG/future不跨 |
| C | §7～9 | 11suite/98归属、7Runtime字段/依赖、Spike最早截止 | formalIDs/成熟度/fullinventory不缩 |
| D | §10～12 | 用户dirty保护/新run、33提交规则/15body、pre-handoff逐边界 | actualgate/immutablebaseline/review事实边界 |
| E | §13 | 参考入口/静态记录/停审 | 全链接与状态；等待用户确认 |

### implementation ledger 装配要求

| 产物 | 数量 | 当前status | gate真实性 |
|---|---|---|---|
| project implementation ledger | 1 | planned；current=none、候选01-a；blocked / wait_design | 没有授权/immutablebaseline/targetrepo |
| boundary skeleton | 15 | planned / wait_until_current | RequiredReads pending/Activationblocked/其他gatepending |
| 55独立经验 | 825设计行 | P/N/B仅设计来源结论 | 不等Build/Test/EV/Commit/Handoff pass |
| targetrepo/scratch/code/run/artifact/report | 0新建 | not_created | 禁止本轮代建 |

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

### 静态审计清单（已执行，结果见静态记录）

| 审计面 | required核验 | 状态 |
|---|---|---|
| 结构 | 13正式章与具体source/延伸阅读，13Step问题集/十段及小循环 | pass (design-only) |
| phase/boundary | 7phase/15串行、PH04依PH03、U1/U7/runner/plan/tools前置 | pass (design-only) |
| 库存 | 49flow唯一owner、215path、98TC↔EV、11suite、55×15、49task/BATCH族 | pass (design-only) |
| 名称/config | 正式FR/AC-MP/VETO-MP、七Rust字段/六域/八slot/四profile | pass (design-only) |
| coverage/evidence | 未缩required参数化集合、rawreportpath/成熟度/6artifact6seal/DAG/newrun | pass (design-only) |
| ledger | 全15statusplanned/wait_until_current、Worktree/CommitRecord/无fake工单 | pass (design-only) |
| baseline/ownership | source不资格，currentnone/immutable未冻、无ownerbody/approval/Billing/Archivewriter | pass (design-only) |
| Markdown | scoped本地link/anchor/围栏/表格列/图label/异常转义 | pass (design-only) |
| patchscope | 仅本项目文档/calibration/ledger，其他dirty保留 | pass (design-only) |
| authenticity | 无代码/targetrepo/commit/run/实际结果/evidence/verdict/signoff/readiness | pass (design-only) |

### 整体闭环与proof范围

正式00scope→01dependency→02七U→03types/ports/flow/state/PG→04config→05tests/schema→06AC/VETO→07排程/gate；每boundary具体来源见Step12及库存附录。local设计定义完成不等实际实现；formal-selected资格和capacitycandidate不由本轮关闭。workingtree未提交/不冻结commit，所以真实implementationhandoff仍blocked。

## 回填草稿

正式07已装配13章结论，15planned skeleton/currentnone及remaining blockers可追溯。实际检查结果见静态记录，Step1～13/flow/projectledger同步completed后立即停审，等待用户确认，不自动进入实现。

## 待确认事项

用户确认07与是否额外授权实施，immutablebaseline、targetrepo/toolchain/export/PG/exactowner/current资格及reviewer仍waiting/blocked；不是正式文档“空白”，不能伪填source/pass。

## 进入下一步条件

A～E正式传播、静态记录实际执行及修复复验完成，all15planned/gates真实；本轮设计条件满足。立即停审等待用户确认，不自动实施。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
