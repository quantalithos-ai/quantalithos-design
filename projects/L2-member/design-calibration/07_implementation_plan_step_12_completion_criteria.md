# Step 12. 定义实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12。
>
> 回填章节：未来 `07-实施计划.md` §12 实施完成判定。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_12_completion_criteria.md`。只参考判定、闭环审计、证据、未完成项和停审结构；不继承 Governance 的范围、VETO、artifact、report、结论或实现事实。
>
> 事实边界：本文件只定义 future completion / conditional-completion / not-complete 规则。当前没有 target implementation repo、immutable baseline、code、commit、run、artifact、report、evidence、defect、verdict、signoff 或 readiness；所有“执行期判定”都不是当前结果。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12：定义实施完成判定 |
| 执行模式 | `full-restart + single-agent-serial`；Step 11 完成后按用户连续授权进入 |
| Step 开工确认 | 已读取项目级台账、07 flow、Step 2 / 4 / 6 / 7 / 9 / 11、正式 `06-验收标准.md`、07 SOP / 书写规范、真相源闭环标准及 L1-governance 同粒度材料 |
| 本步模块骨架 | `p0-scope-and-deliverables`、`closure-audit`、`evidence-and-handoff`、`incomplete-disposition` |
| 当前状态 | `completed / pass_for_design_with_explicit_blockers / serial_continuation_authorized` |
| 输出文件 | `projects/L2-member/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |
| 正式回填 | Step 13 后回填未来 `07-实施计划.md` §12；本 Step 不写正式 07 |
| 实施事实 | `not_started`；不创建 implementation ledger / boundary skeleton，不写实现仓、不提交、不生成报告或裁决 |
| 下一步 | 仅进入 Step 13，先完成 formal assembly 校准，再创建正式 07 与 planned ledgers / skeleton；不得提前填写完成结论 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 | 使用上限 |
|---|---|---|---|
| Step 2 P0 / P1 / P2 范围 | 已完成 | 固定 completion 只按 member-local P0 判断，P1/P2 不污染 P0 | 不扩大范围或将 blocked 当 pass |
| Step 4 交付物 | 已完成 | 固定 seven crate、CP01～07、config、checks、reports / handoff 的 future 完成项 | 不写 target paths 已存在 |
| Step 6 phase / 18 boundary | 已完成 | 固定完成前必须逐 boundary 达成、review、回退与 closure audit | 不改变 boundary inventory |
| Step 7 gate / evidence contract | 已完成 | 固定 P0 check、raw→report、EV / acceptance draft成熟度 | 不运行 suite 或生成产物 |
| Step 9 risks / Spike / OQ | 已完成 | 固定 blocker、residual和截止点的完成处理 | 不关闭任何风险 / OQ |
| Step 11 commit / review / delivery | 已完成 | 固定 future Commit / Handoff Gate、user-change protection与审查要求 | 不记录 hash、review 或 handoff事实 |
| `06-验收标准.md` §11～14 | 已读取 | 承接 `VF-L2M-001~009`、S/A/B/R、风险接受和通过 / 有条件通过 / 不通过裁决 | 07 只判定“实施可送验”；最终验收仍属正式 06 |
| `设计真相源闭环与可落码性标准.md` §九 | 已读取 | 固定交付前按 boundary 审计字段、DTO、state、ref、validation、idempotency、projection、artifact和 phase boundary | 缺口必须回写 owning source，不能实现端补洞 |

## 3. SOP 问题回答

| # | 问题 | 本项目回答 |
|---:|---|---|
| 1 | 本轮需求覆盖如何判定 | 以 Step 2 P0 为准：`C-L2M-1~5`、`FR-L2M-001~012` 的 member-local / negative / blocked-aware 语义、相应 `BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033` 与 `VF-L2M-001~009` 都须有真实可回链的实现 / gate 结论。`FR-L2M-E01~E03`、P1 owner selected run、P2 SLO / deployment不计 P0 pass。 |
| 2 | 交付物如何判定完成 | Step 4 的 seven library crates、CP01～07 local surface、finite 10 Command / 16 Query / 14 Consumer / 5 Job、logical Store/UoW/fake parity、config / checks / report capability及 handoff material都必须按 Step 6 boundary 实现、验证和审查；外部 truth、transport、physical product和真实 owner success不被冒充为本仓交付。 |
| 3 | tests / acceptance gates 如何判定 | 所有 P0 blocking check 必须真实执行并产生可回链结果；redaction、dependency、replay、no-write、raw→report pair、static-evidence guard 和适用 VETO 不能风险接受。P1 selected seam unavailable只能 residual / not_run，绝不可写为 P0 pass。 |
| 4 | Spike / risk / OQ 如何处理 | 每项必须在其 Step 9 最迟 boundary 前产生关闭、明确取消、合规 residual或 `blocked / wait_design`。`L2M-DDD-001`、影响 P0 的 DDD / scope gap、target repo / baseline、P0 truth / evidence blocker未闭合时不得宣称完成。 |
| 5 | 是否有一票否决 | 是。`VF-L2M-001~009` 任一命中，或 redaction / dependency / evidence integrity failure、fake / planned / blocked伪装为正向事实，均不能完成或有条件完成。 |
| 6 | 未完成项如何分类 | P0缺失、VETO/S、设计闭环、hard dependency、report provenance 和 truth-repair 均为 blocker；不影响 P0的 A（须逐项正式接受）、B/R、P1/P2 selected-run unavailable或无 workload/SLO authority可按 06 的规则成为 residual；risk acceptance不关闭 blocker。 |
| 7 | raw / report 的关系 | 每个实际 run 的 raw artifact必须位于 `artifacts/test/<run_id>/...`，可读报告必须由同一 raw source生成于 `reports/runs/<run_id>/...`；raw 不能替代 report，`<run_id>` 仍是运行期变量。 |
| 8 | acceptance 文件如何审查 | `reports/acceptance/handoff.md`、`veto-checklist.md`、适用的 `risk-acceptance.md` 和 `open-issues.md` 必须由获授权人或 Agent 审查；generator draft不能自动成为 verdict、signoff 或 readiness。 |
| 9 | redaction / link / evidence 审计 | 需要 redaction-boundary、dependency-boundary、report-generation-audit、evidence-index 和 path / link review；任一缺失、failed、static或无法回链均阻断完成。 |
| 10 | 字段、DTO、状态、命名、phase conflict | 不能遗留。任何适用 closure gap 都必须回写 `03/04/05/06/07` 或 external owner，固定新 baseline并重审 affected boundary；不得以 fake、default、direct Store mutation或 title workaround关闭。 |
| 11 | 是否需要交付前可落码审计 | 是。每个 PH / boundary 都要复核正式 `03/05/06/07` 的 truth、carrier、state、Store / UoW、test / acceptance、evidence和 phase boundary；当前只完成 design-level audit plan，execution audit尚未开始。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 2 / 4 | P0 与交付物已拆开，但没有统一的结束规则 | 容易把部分 crate 或 local happy path写成“完成” | 汇总 P0 / delivery / boundary / gate的必要条件 |
| Step 6 / 7 | 18 个 boundary和门禁存在，但执行不等于最终可送验 | 可能遗漏 evidence、review或 VETO | 建立 completion、closure、evidence和 handoff判定表 |
| Step 9 | blocker 和 residual 共存 | 可能错误把所有开放项都视为可接受，或反过来阻断合理 P1 residual | 依据 06 分出不可接受 blocker与合规 residual |
| Step 11 | commit / delivery纪律已定义 | 没有最终判定会使 handoff缺少完成边界 | 纳入 Commit / Handoff Gate和 user-change protection |
| 当前执行事实 | repo、baseline、run、reports、reviews不存在 | 容易误填 present-tense pass / conditional completion | 所有结论使用 `execution-time decision`，当前只保留 blocker事实 |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| completion 口径 | 分散在 scope、gate、risk和 acceptance | 统一为可送验条件、结果矩阵和未完成项处置 | 禁止“基本完成” |
| closure review | boundary 前有预复核 | 加入交付前全量 PH / boundary audit | 避免局部通过后遗留设计冲突 |
| evidence | Step 7定义生成路径 | 明确 raw→report→index→review全链是完成必要条件 | 防止静态证据 |
| residual | P1/P2和 blocker都标 pending | 区分合规 residual、P0 blocker与不可风险接受项 | 防止改变事实等级 |
| final decision | 可能与验收混层 | 07只判定实现“可送验”；正式 06保留最终裁决 | 保持文档职责边界 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| tests 有绿色结果即实施完成 | 不采用 | 无法覆盖 owner boundary、VETO、证据完整性、review和设计闭环。 |
| 使用“基本完成”或口头延期 | 不采用 | 不可审查，也会掩盖 blocker和残余风险。 |
| implementation completion 与 acceptance verdict合并 | 不采用 | 07不替代 06 的最终验收裁决职责。 |
| 完成只代表“实现可送验”，最终 verdict由 06和验收责任人裁决 | 采用 | 边界清楚，且不会伪造 signoff / readiness。 |
| 将 P1 selected seam unavailable记为 P0 fail或P0 pass | 不采用 | 前者扩大P0，后者污染事实；只能为明确 residual / not_run。 |

## 7. 结构化中间产物

### 7.1 Future implementation completion 判定表

| 判定项 | future 标准 | future evidence / review | 当前结论 |
|---|---|---|---|
| P0 scope coverage | Step 2 P0能力、AC / VF分母均有 implementation、targeted gate与可追溯 disposition | boundary ledger、trace matrix、`reports/runs/<run_id>` | execution-time decision；当前 `not_run` |
| delivery completion | Step 4 的 planned code / config / check / report capability完成，非范围未混入 | actual diff、boundary ledger、review | execution-time decision；target repo缺失 |
| 18 boundaries | `commit-01-a`～`commit-08-b`均完成 current-boundary gates、review、handoff，且不跨 phase | commit history、boundary ledgers、review records | execution-time decision；均 planned / blocked |
| P0 checks | Step 7 所有适用 fmt / check / targeted test / redaction / dependency / replay / no-write / report checks有真实结果 | raw artifact + report pair | execution-time decision；未运行 |
| VETO / S | `VF-L2M-001~009`全未命中，S=0 | reviewed VETO checklist、open issues、retest records | execution-time decision；不可预填 |
| risk discipline | 仅合法 A/B/R / P1/P2 residual有 owner、acceptor、deadline_or_trigger；不影响 P0 | reviewed risk acceptance / open issues | execution-time decision / not_applicable；当前无 acceptance record |
| evidence integrity | raw→report→evidence index、digest、TC/AC/VF refs、redaction/dependency/report audit全可回链 | `reports/runs/<run_id>/...` | execution-time decision；无 run |
| acceptance handoff | handoff / VETO / risk / open issues documents由真实输出形成且经审查 | `reports/acceptance/*` | execution-time decision；无 draft / review |
| design closure | applicable field、DTO、state、ref、validation, UoW / replay、projection、artifact和 phase boundary无未闭合项 | design-closure audit + formal sources | execution-time decision；开放 blocker仍在 |

### 7.2 可落码闭环完成标准

| 闭环项 | future 完成标准 | future evidence | 当前处理 |
|---|---|---|---|
| baseline / repo | immutable design manifest、authorized target repo、workspace / crate / Core path可核验 | project / boundary ledger Design Gate | `L2M-DDD-001` + dirty baseline阻断 |
| field / DTO / typed carrier | Command / Query / Consumer / Job能由正式 source构造，safe error / replay carrier完整 | formal 03 + contract tests + boundary review | 对应 DDD gap必须 `wait_design` |
| state / transition / version | legal helper、expected version、CAS / UoW / error mapping一致 | state tests、replay / fake-parity reports | `scope_supersede_gap`及 helper/version gap阻断 affected lane |
| validation / owner truth | screening、resolver、Runtime、host等只消费正式 owner ref / safe result | negative / blocked tests、owner selected-run（如适用） | `L2M-UP-001~008` 正向 lane保持 blocked |
| Store / idempotency / receipt / report | exact stored carrier、duplicate replay、rollback / unknown、receipt和 Job report闭合 | service / Consumer / Job reports | `L2M-DDD-002~007`阻断 affected lane |
| Query / projection | no-write、committed source、freshness / stale / gap、rebuild no-repair闭合 | query / projection reports | DDD-006/007未闭合时 `wait_design` |
| redaction / dependency / candidate | body-free、Core-only compile、no generic adapter、24 candidate non-materialized | redaction / dependency reports | `L2M-UP-005` 未关闭前持续 hard stop |
| artifact / report / review | raw source、readable report、index、draft review、VETO / risk lineages完整 | report audit、acceptance review | 当前没有 run / report / review |
| phase boundary | 无当前 boundary引用后续 phase、external success或最终证据 | boundary review + formal 07 mapping | 真实 diff / review前不可 pass |

### 7.3 交付实现前可落码闭环审计计划

> 此表规定 future audit，所有 `status` 都是当前设计判断，不是 implementation gate result。每个 boundary变为 current 前与每个 PH交付前都必须重新执行其适用行；若结论不是 `pass`，必须先回写对应真相源并固定新 baseline。

| Phase / boundary | 必审正式范围 | 适用 closure focus | 当前 design posture | future failure action |
|---|---|---|---|---|
| PH-01 / `commit-01-a/b` | `03` §3～4；`04` config / binding；`05` evidence path；`07` §3 / §6～8 | repo / baseline、seven crates、Core-only path、profile、artifact materialization | `blocked`：repo / baseline / Core mapping未闭合 | `wait_design` / authorization；不创建 shadow workspace |
| PH-02 / `commit-02-a/b` | CP01 object / protocol / state / Store / test cuts；`05/06` CP01 | double anchor、presence transition、UoW / replay、host local vs owner truth | `blocked`：repo、credential / host seam、Store decision | 回写 03 / owner；不私造 IPC / credential |
| PH-03 / `commit-03-a/b` | CP02 object / protocol / flow / state / Store；`05/06` screening | source / scope、four-state screening、body-free、successor、receipt / replay | `blocked`：scope supersede、receipt、screening source | `wait_design`；unknown fail-closed，不 direct Store save |
| PH-04 / `commit-04-a/b` | CP03 object / protocol / flow / state / Store；`05/06` Runtime cuts | typed Runtime refs、attempt / result-link / reception、local vs Runtime truth | `blocked`：Runtime mapping / outcome source | 回写 owner / 03；不实现 Runtime trigger / outcome |
| PH-05 / `commit-05-a/b` | CP04 / CP05 sources、redaction、trace / observation tests | safe material、attempt-gap、append-only trace、no delivery / observed / Event claim | `blocked`：DDD-004/005、UP-004/005 | `wait_design`；不物化 Event / publisher / outbox |
| PH-06 / `commit-06-a/b` | CP06 / CP07 sources、projection / Query / config / test | owner-scoped resolution、source / version、committed-only projection、no-write | `blocked`：DDD-006/007、resolver / source | `wait_design`；不 generic resolve或 source repair |
| PH-07 / `commit-07-a/b/c/d` | Consumer / Job protocol、flow、receipt / report / replay sources | finite source / pre-gate、receipt / report typed replay、partial isolation | `blocked`：DDD-003~007、external source | `wait_design`；不 scan / reconstruct / blind retry |
| PH-08 / `commit-08-a/b` | `05` artifact/report；`06` VETO / defects / risk / signoff；`07` gates / delivery | fixed baseline / run, raw→report→index, redaction / dependency, review scope | `blocked`：repo、real run / artifact / report / review缺失 | no static evidence / verdict；重新执行 / 审查后才可送验 |

### 7.4 Future delivery evidence 表

| delivery evidence | fixed future path | completion standard | current status |
|---|---|---|---|
| raw suite artifacts | `artifacts/test/<run_id>/suites/<suite>/` | actual P0 output、profile、TC refs、disposition、digest；失败 raw仍保存 | `not_created / not_run` |
| run reports | `reports/runs/<run_id>/suites/*.md`、`gate-results.md` | same raw source生成，包含真实 disposition | `not_created / not_run` |
| redaction / dependency / report audit | `reports/runs/<run_id>/{redaction-check,dependency-boundary,report-audit}.md` | no forbidden body / secret、Core-only、pair / provenance可追溯 | `not_created / not_run` |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | TC / AC / VF / artifact digest / report / disposition都可回链 | `not_created / not_run` |
| acceptance handoff | `reports/acceptance/handoff.md` | baseline、run、scope、open issues和审查责任完整 | `not_created / not_reviewed` |
| VETO checklist | `reports/acceptance/veto-checklist.md` | `VF-L2M-001~009`逐项以真实事实裁决 | `not_created / not_reviewed` |
| risk / open issues | `reports/acceptance/{risk-acceptance,open-issues}.md` | 只记录可接受 residual；owner / acceptor / deadline_or_trigger完整 | `not_created / not_reviewed` |
| design closure audit | `reports/acceptance/design-closure-audit.md` 或 handoff受控章节 | 18 boundary的 closure audit无 blocker，或明确不送验 | `not_created / not_run` |

### 7.5 未完成项处理表

| 未完成项 | 分类 / 处理 | 是否允许 future implementation completion |
|---|---|---|
| P0 CP / Command / Query / Consumer / Job delivery缺失 | blocker；补 implementation与适用 gate | 否 |
| P0 gate、replay / no-write、redaction、dependency或 report audit failed | blocker；修 current boundary并复验 | 否 |
| `VF-L2M-001~009` 命中或 S级未关闭 | VETO / S blocker；不可风险接受 | 否 |
| target repo、immutable baseline或 Core compatibility缺失 | hard precondition blocker；先授权 / 固定 / 核验 | 否 |
| affected P0 `L2M-DDD-*` / `scope_supersede_gap`未闭合 | design blocker；回写 owning 03 / 04 / 05 / 06 / 07后重审 | 否 |
| host / Runtime / image / resolver等 P1 selected seam unavailable | residual / `not_run`；保持 local P0和事实等级分开 | 可以，仅当它不属于该P0 claim |
| A级但不影响 P0或 VETO | 仅在正式 risk acceptance有 owner、acceptor、deadline_or_trigger时条件处理 | 仅有条件 |
| B/R residual、P1/P2 optional enhancement、workload / SLO authority缺失 | residual / deferred；保留 follow-up和触发点 | 可以或有条件，不得写相应能力通过 |
| physical durability / crash / production capacity未定 | P1/P2 residual；不得声称 durable / readiness | 可以，仅限 logical local P0完成 |
| actual report可读性问题但 raw存在 | 修 report或按非P0风险处理；不能以 raw替代 | 视对 evidence integrity影响 |
| user / unrelated changes混入 | Scope / Worktree blocker；隔离 stage，保护用户文件 | 否，直到清理 current boundary范围 |

### 7.6 Future completion outcome matrix

| future outcome | necessary conditions | not sufficient / prohibited shorthand |
|---|---|---|
| `implementation_complete_and_ready_for_acceptance` | P0 scope / delivery / 18 boundaries / checks完成；VETO未命中；S=0；evidence和review完整；closure audit无 blocker | 不等于最终验收 verdict、signoff、release或 readiness；最终裁决仍在 06 |
| `implementation_conditionally_complete_and_ready_for_acceptance` | 上述 P0 / VETO / S / evidence / closure条件均成立，仅有正式接受且不影响P0的 A/B/R / P1/P2 residual | 不能用于接受 blocked P0、VETO、S、missing run / report或 owner truth gap |
| `implementation_not_complete` | 任一 P0缺失 / failed、VETO、S、evidence不完整、closure blocker、baseline/repo缺失或用户改动混入 | 不得表述为“基本完成”“待小修”“预计可送验” |
| `acceptance_pending_or_not_decidable` | implementation evidence或正式验收输入不足，或实际验收尚未执行 | 不能用 planned / fake / blocked / not_run替代验收结论 |

### 7.7 Completion 停审与跨审计

| 审查项 | 设计层结论 | 缺口 / 处理 |
|---|---|---|
| P0、交付物、18 boundaries、Step 7 checks均进入完成判定 | `pass_for_design` | execution尚未开始，所有具体结果仍空缺。 |
| VETO / S、redaction、dependency、evidence integrity不可被风险接受 | `pass_for_design` | 完全承接 06，不修改其裁决权。 |
| P1/P2 / selected seam不会污染 P0 | `pass_for_design` | 仅合法 residual可进入 conditional completion。 |
| raw→report→index→review与 Commit / Handoff Gate一致 | `pass_for_design` | 无 run / artifact / report / review，不能填 pass。 |
| 交付前 closure audit覆盖 PH-01～08 / 18 boundary | `pass_for_design` | future audit仍会因 target repo、UP / DDD blocker而 blocked。 |
| 当前是否可宣称 completion / conditional completion | `blocked` | `L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-001~008`、dirty baseline和所有 execution facts缺失。 |

## 8. 回填草稿

未来正式 `07-实施计划.md` §12 应明确：L2-member 只能在 P0 member-local范围、Step 4交付物、18 个 boundary、Step 7所有适用 P0 gate、`VF-L2M-001~009`、S级、raw→report→index→review、Commit / Handoff Gate和按 PH / boundary执行的正式 `03/05/06/07` 可落码审计全部满足后，宣称 `implementation_complete_and_ready_for_acceptance`。这只表示实现可送验；最终“通过 / 有条件通过 / 不通过”仍由 `06-验收标准.md` 和获授权验收责任人裁决。

有条件完成仅允许保留不影响 P0 truth / security / dependency / evidence integrity 的、已正式接受且带 owner、acceptor、deadline_or_trigger的 A/B/R / P1/P2 residual。P0缺失、VETO / S、redaction / dependency / report audit failure、target repo / immutable baseline缺失、affected design closure gap、fake / planned / blocked / not_run伪装和用户改动混入均是不可接受 blocker。所有 artifact / report / acceptance 路径在实际运行前仍为 future variables；本项目当前没有 completion、conditional completion、acceptance verdict、signoff或 readiness事实。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 | 最迟点 |
|---|---|---|---|
| target repo、implementation authorization与 immutable design baseline | 所有 implementation completion 条件 | `L2M-DDD-001` / dirty baseline；不得创建或假定 | PH-01 / `commit-01-a`前 |
| Core actual compatibility与 physical Store / UoW decision | compile / durable completion claims | only planned mapping / logical fake；不作durability断言 | affected boundary前 |
| scope successor、receipt、CP04～07 helper / version闭环 | affected P0 boundary closure | `wait_design`，回写 owning source | affected boundary前 |
| owner selected seam是否属于P0 | local versus positive completion范围 | 按 Step 2 / 06，未闭合时只 residual或 blocker | selected run / acceptance前 |
| fixed run、report generator、reviewer与 risk acceptor | evidence / conditional completion | `<run_id>`、人员和结果均不预填 | PH-08 execution / handoff前 |
| workload / SLO / capacity authority | performance / readiness claim | 保留P2 residual，不填阈值 | 任一性能结论前 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| completion、conditional、not-complete与acceptance-pending口径 | `pass_for_design` | 不使用“基本完成”，不越过06裁决职责。 |
| P0 / VETO / S / evidence / closure / residual规则 | `pass_for_design` | 与 Step 2 / 4 / 6 / 7 / 9 / 11 / 06一致。 |
| PH / boundary closure audit计划 | `pass_for_design` | 18 boundary和正式 03/05/06/07均有回指。 |
| 真实 completion证据 | `blocked` | 当前无 repo、baseline、implementation、run或审查。 |
| 可进入 Step 13 | `authorized` | 下一步先创建并完成 formal assembly Step 文件；其后才可创建正式 07、implementation ledger与planned skeleton。 |
