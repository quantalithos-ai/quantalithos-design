# Step 12. 定义实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12  
> 书写规范：`standards/document/实施计划书写规范.md` §5.12、§12  
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md` §九  
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md`  
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §12  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 12` |
| `current_module` | `completion_criteria_and_delivery_disposition` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_13` |
| `gate_reason` | 已将需求覆盖、交付物、phase/boundary、测试/验收、证据、设计闭环、VETO、缺陷、风险、review、handoff 和 readiness 分离为可审查判定；未完成项有 blocker/deferred/eligible-residual 处理口径；当前没有实现、测试、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。 |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_13_formal_document_assembly.md`，随后按 full-restart 装配正式 `07-实施计划.md`、implementation ledger 和 18 个 planned boundary skeleton |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `commit_required` | `false` |

本 Step 定义未来如何判断“实施完成并可交给 06 验收”，不声称当前已经完成实施。`implementation_complete` 不等于 `acceptance_passed`，`acceptance_passed` 不等于 `release_ready`，也不等于任何上游 Release、Artifact、Governance、Sandbox、Runtime 或 Observability truth 被修改。当前实际状态继续保持 `not_started / blocked / not_created`。

## 2. 本步输入、输出与强制约束

### 2.1 本步输入

| 输入 | 承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | P0 范围、P1/P2/future、非范围和防误入规则 | 不扩大需求分母，不把外围能力改成 P0 |
| `07_implementation_plan_step_04_deliverables.md` | 逻辑实施对象、代码/协议/配置/测试/证据/台账交付物 | 不把 planned 落点当作物理文件已存在 |
| `07_implementation_plan_step_05_phases_dependencies.md` | `PH-01`～`PH-06` 的顺序、增量、依赖和停审 | 不重排 phase，不新增阶段 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 18 个 `commit-ph-*`、任务、批次、allowed/forbidden scope | 不按文件拆 boundary，不合并不同 boundary |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 18 CUT、108 planned TC、12 suite、18 slot、GATE-01～12、AC/AR/TX/NFA/VETO 映射 | planned 不等 executed/pass；不新增测试或验收 authority |
| `07_implementation_plan_step_08_config_environment_dependencies.md` | 41 项配置、四 profile、环境/依赖和 fail-closed posture | 不把 profile、configured、enabled 或 ready 混为同一事实 |
| `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 12 Spike、18 风险、16 待确认、回写与重开规则 | 未关闭 blocker 不得被完成判定吞掉 |
| `07_implementation_plan_step_10_rollback_change_control.md` | pause/rollback/change/resume、失败材料和新 run lineage | 不删除失败材料，不跨 run 拼 evidence |
| `07_implementation_plan_step_11_commit_review_delivery.md` | Commit/Handoff Gate、review、message、artifact/report 交付纪律 | handoff、review 或 report 不自动产生 verdict |
| `06-验收标准.md` §3～§14 | baseline、entry/exit、AC、VETO、缺陷、风险、三值结论和签署边界 | 07 只定义可送验条件，不代行 06 裁决 |

### 2.2 本步输出

- 实施完成判定总表，以及 `complete / conditional_handoff / incomplete / blocked` 的明确语义。
- 六个 phase 与 18 个 commit boundary 的完成条件、证据、停止和交接规则。
- 需求覆盖、交付物、测试、验收、证据完整性、设计闭环和提交/评审的交付前审计表。
- `raw artifact → run report → check/evidence → acceptance handoff → independent review` 的同一 run 交付清单。
- 未完成项的 `blocker / deferred / eligible residual / waiting / not_run` 分类及其是否允许交付的规则。
- 未来正式 §12 的回填草稿，以及 Step 13 装配前输入完整性门禁。

### 2.3 强制约束

1. 禁止使用“基本完成”“大致完成”“原则上完成”作为最终实施结论。
2. 只有有来源、同一 run、可回链且经必要 review 的证据才能支持完成判定；raw artifact 不能替代人类可读 report。
3. P0、VETO、truth/security/dependency/config/evidence-integrity、字段/DTO/state/port/phase 冲突不得风险接受或延期为完成。
4. required test/check 的 `failed`、`blocked`、`not_run`、`timeout`、`flaky` 或 `incomplete` 不得被聚合器压成 `pass`；明确适用的 `not_applicable` 必须有来源和理由。
5. 实施完成只能表示实现包满足交给 06 验收的条件；`06` 的 `通过 / 有条件通过 / 不通过`、签署和 readiness 仍由相应 authority 产生。
6. 当前所有判定仅是未来执行合同；不创建目标实现仓、代码、测试、run、artifact、report、evidence、verdict、signoff 或 readiness。

## 3. SOP 问题回答

| SOP 问题 | Runner 收口回答 |
|---|---|
| 本轮需求覆盖如何判定？ | 以 Step 2 的 P0 分母为准，覆盖 `CP-RUN-01~05`、`FR-RUN-001~013`、`BR-RUN-001~025`、适用 `NFA-RUN-001~007`、`AC-RUN-001~011`、`AR-RUN-001~015`、`TX-RUN-*` 和 `VETO-RUN-001~012`。`FR-RUN-014~016`、无 authority 的性能/容量和真实 T2～T4 positive 只记录为 future/conditional/blocked，不减少 P0 安全分母。 |
| 交付物是否全部完成？ | 以 Step 4 交付面和 Step 6 的 18 个 boundary 为分母；逻辑对象、协议/adapter、配置、测试/fixture、gate/check/report、raw/report/evidence、handoff 和 ledger 均须有实际或明确的 blocker 记录。规划文件中的 `planned`、路径模板和 skeleton 不能证明交付完成。 |
| 测试门禁是否全部通过？ | 每个适用 boundary 的 Test Gate、Evidence Gate 和 phase aggregate gate 必须有真实状态。required gate 只有 `pass` 或有来源的 `not_applicable` 才能继续；`blocked/not_run/failed/timeout/flaky/incomplete` 使受影响 boundary/phase 停止。 |
| 验收门禁是否全部通过或有合法风险接受？ | 07 只检查 AC/AR/TX/NFA/VETO 是否具备真实可判定入口、fixed-run package 和 06 handoff；不填写实际 verdict。VETO、S、P0 truth/security/dependency/config/evidence integrity 永远不能 risk-accept；其余 residual 必须先满足 06 §13 eligibility、权限、期限和 trigger。 |
| Spike、风险和待确认事项是否关闭？ | 每个影响当前 P0 或 required boundary 的 Spike/OQ 必须有批准输出或明确 blocked/waiting 记录；开放 blocker 不允许 `implementation_complete`。只影响 P1/P2 或条件 NFR 的 residual 可以延期或进入合法风险接受，但不能被写成 P0 pass。 |
| `reports/runs/<run_id>` 是否从 raw 生成？ | 是完成条件之一。run report、suite report、gate result、evidence index 和 integrity report 必须从同一 `artifacts/test/<run_id>/` 生成并双向可回链；缺 raw、source digest 不匹配或静态手写 report 均不合格。 |
| acceptance handoff 是否已审查？ | `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md` 以及适用的 `risk-acceptance.md` 必须存在于同一 decision/run 语境并经人/Agent review；脚本初稿、Runner 本地日志或 ACK/PID/port 不能替代审查。 |
| artifact/report 是否通过安全和链接检查？ | redaction、dependency-boundary、evidence-links、report-pairing、cleanup 和 no-static 检查均须有机器结果；scanner/tool unavailable 不是 clean。任何 raw body、secret、private seam、跨 run 拼接或残留均阻断。 |
| 是否仍有字段、DTO、状态、命名或 phase boundary 冲突？ | 不允许。冲突必须按 Step 10 `pause → change-upstream → new baseline → affected recheck` 处理；实现者不能用默认值、字符串 ref、隐式 mapper、状态压缩或后续 phase 结果补口。 |
| 是否完成 `03/04/05/06/07` 的交付实现前可落码闭环审计？ | 是，作为实施完成前置条件；每个 phase/boundary 都需复核字段/DTO/ref、状态、port/adapter/UoW、配置来源、测试/证据、AC/VETO 和 phase boundary。任何未通过项必须回写真相源并重建受影响 baseline。 |
| 实施完成是否等于验收通过或 release readiness？ | 不等。实施完成最多产生“可送 06 验收”的 handoff；验收 authority 依据 06 的 lifecycle、三值 verdict、VETO、风险和签署作裁决，release/readiness 还需 T3/T4、GRC、运维和目标环境 authority。 |

## 4. 当前文档问题诊断

| 发现 | 风险 | 本 Step 处理 |
|---|---|---|
| Step 7/11 已有 gate 和 handoff，但尚无统一完成语义 | 可能把 boundary pass、phase pass 或文档完成误写成整体完成 | 定义实施结果、验收结果和 readiness 三层分离矩阵 |
| 六个 phase 的“设计层通过”容易被理解为执行期通过 | 可能跳过实现仓、fixed run、review 和 evidence | 所有 phase/boundary 行同时列实际证据要求和当前 `planned/blocked/not_created` |
| 18 slot、108 TC 和 12 suite 可能被当作已产生证据 | 可能制造静态 EV 或虚假分母 | 固定 raw/report/check/evidence 的同 run 物化条件；计划 ID 不算实例 |
| 风险、延期和 blocker 的边界分散在 Step 9/10 与 06 §13 | 可能用风险签字绕过 P0/VETO | 建立未完成项处理表和 risk-acceptance eligibility 约束 |
| 设计闭环复核只出现在开工/提交前 | 设计变更后旧 mapping 可能继续使用 | 增加交付实现前总闭环审计和 rebaseline 规则 |
| report/handoff、06 verdict、release/readiness 名称相近 | 可能把 handoff 或文档 pass 当最终裁决 | 明确各 authority、输入、输出和禁止升级关系 |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 目的 |
|---|---|---|---|
| 实施完成语义 | 分散于 phase、gate、commit 和验收文件 | `implementation_complete` 仅表示满足 07 handoff 条件 | 防止越权生成验收/release 结论 |
| 证据分母 | 有 raw/report/evidence 路径合同，但缺总完成门 | 每项必须同 run、可回链、经相应审查 | 防止计划路径或静态 EV 冒充结果 |
| phase/boundary | 有独立门禁，缺少总体完成回收 | 六 phase、18 boundary 全部纳入完成矩阵 | 防止遗漏局部 blocker |
| 未完成项 | blocker、waiting、residual 分布在多步 | 统一分类、处理、是否允许 handoff | 让延期和风险接受可审查 |
| 设计闭环 | 开工前和提交前复核 | 交付前再做 03/04/05/06/07 总审计 | 防止旧 baseline 继续流转 |
| 当前事实 | 文档合同已完成，执行事实未创建 | 明确所有实际状态仍 `not_created/not_run/blocked` | 保持事实诚实 |

## 6. 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 只看所有测试通过 | 简单 | 遗漏设计闭环、VETO、redaction、handoff 和 owner 权限 | 不采用 |
| 把实施完成与 06 验收 verdict 合并 | 输出少 | 违反文档职责，可能在无签署时宣称通过 | 不采用 |
| 只要 P0 代码完成就交付 | 便于尽快移交 | 没有同 run 证据、报告和 review，无法裁决 | 不采用 |
| 以“可送验 handoff”作为 07 的终点 | 责任清晰，保留 06 authority | 需要严格区分 conditional handoff 和 final verdict | 采用 |
| 未完成项全部永久阻塞 | 安全 | 合法 P1/P2 residual 无法登记和演进 | 不采用；允许有资格的 residual 独立记录 |
| 允许任意风险接受覆盖缺口 | 灵活 | 会绕过 P0/VETO/required seam 和证据完整性 | 不采用；仅按 06 §13 eligibility 处理 |

## 7. 结构化中间产物

### 7.1 结果语义与 authority 分离

| 层级 | 可声明的结果 | 必须满足 | 不可声明 |
|---|---|---|---|
| Boundary | `boundary_complete` 或 `boundary_blocked/incomplete` | 当前 boundary 的 Design/Scope/Toolchain/Contract-State/Test/Evidence/Commit/Handoff Gate 有真实状态；同 boundary 无跨界改动 | 不得以单个 boundary 结果代表 phase、整体实施或验收 |
| Phase | `phase_complete` 或 `phase_blocked/incomplete` | 该 phase 全部 boundary 完成、aggregate gate 有证据、无未处理 blocker、phase review 完成 | 不得吞掉 boundary failed/blocked/not_run；不自动启用下一 phase |
| Implementation handoff | `implementation_complete` 或 `conditional_handoff` | P0 分母、交付物、18 boundary、证据和闭环审计满足 07 条件；handoff/review package 完整 | 不得生成 `通过/有条件通过/不通过`、signoff 或 readiness |
| Acceptance | `not_entered/entered/decision_pending/suspended/decided` + 06 三值 verdict | 06 entry/exit、fixed run、VETO、缺陷、风险、签署和 decision package 完整 | 不得由 Runner、实现者或 07 代签 owner truth |
| Release/readiness | 由目标 tier、GRC、平台/运维和 release authority 声明 | 相应 T3/T4 baseline、环境、SLO/retention、review 和签署 | 不得由文档完成、profile、ACK、PID、port、本地 log 或 handoff 推导 |

`conditional_handoff` 只表示存在已按 06 §13 记录且有资格的 residual，允许把材料交给验收 authority 评估；它不是“有条件通过”，也不是对缺少 required seam 或 required evidence 的豁免。

### 7.2 实施完成判定总表

| 判定项 | 完成标准 | 必须证据 | 当前事实/结论 |
|---|---|---|---|
| P0 需求覆盖 | Step 2 P0 的 capability、FR、BR、适用 NFA、AC、AR、TX、VETO 均有实现/测试/验收映射；P1/P2 不污染分母 | trace matrix、boundary/phase mapping、06 引用 | 设计映射已计划；实际实现未开始 |
| 逻辑交付物 | Step 4 的 code、protocol/adapter、config、test/data、gate/check/report、evidence、handoff 交付面均有实际状态 | boundary ledger、diff、review notes、reports | 全部 `planned`；物理交付物未创建 |
| 18 commit boundary | `commit-ph-01-a`～`commit-ph-06-b` 各自完成且没有跨 boundary 文件、后续 phase 依赖或用户改动混入 | boundary ledger、scope snapshot、commit/review record | 18 行计划已闭合；没有 implementation commit |
| Phase aggregate | `PH-01`～`PH-06` 的 boundary、测试、证据、review 和停止条件全部满足 | phase report、gate-results、phase review | 设计层可审查；执行层 `not_run/blocked` |
| 测试门禁 | 所有 required suite/CUT/TC 和 negative/controlled lane 通过或有来源的 N/A；任何 required blocked/not_run 不被隐藏 | `reports/runs/<run_id>/`、suite/check report | 无 `run_id`、无 report，不能判定通过 |
| 验收准备 | AC/AR/TX/NFA/VETO 均可从固定 run 证据判定，目标 tier 和 scope 已固定 | baseline、evidence index、06 handoff | target tier/baseline 尚未固定，`baseline_blocked` |
| VETO 与 P0 红线 | 全部适用 VETO 真实 clear；无 truth/security/dependency/config/evidence-integrity finding | `reports/acceptance/veto-checklist.md`、独立 review | 无实例；不得 risk-accept |
| 缺陷与复验 | S 级为零；其他缺陷已修复复验或具备合法 residual eligibility；失败材料保留 | `open-issues.md`、retest report、run lineage | 未执行，不能声称 zero defects |
| 证据完整性 | raw→report→check→evidence→handoff 双向可回链，同一 run/source digest，redaction/dependency/link/pairing/cleanup 通过 | artifact/report/check paths、audit reports | 未创建；`not_created` |
| 设计闭环 | 03/04/05/06/07 的 fields/DTO/state/ref/port/config/test/evidence/phase boundary 无 unresolved conflict | design-closure audit、new baseline refs | 设计规则已固定；目标仓和上游 seam 仍 blocker |
| Review 与交付 | Design、scope、implementation、test/evidence、security/dependency、config、acceptance review 分离；handoff 内容完整 | reviewer notes、handoff package、ledger | 无 reviewer/run；不能 handoff |
| 完成声明权限 | 由实现计划/实施负责人只能声明 `implementation_complete` 或 `conditional_handoff`；06/产品/安全/运维/GRC authority 各自声明其结论 | signed/role-bound decision records（未来） | 当前无 authority 实例、无签署 |

### 7.3 六个 phase 的完成判定矩阵

| Phase | 完成功能增量 | 必须完成的 boundary | 主要门禁/证据 | 失败或缺失处理 | 当前状态 |
|---|---|---|---|---|---|
| `PH-01` 仓、配置、测试与证据前置 | 目标仓/authority、逻辑装配、strict config、fixture、固定路径和 gate/check/report contract 可被验证 | `01-a`、`01-b` | Design/Scope/Toolchain/Config/Contract Gate；`S-RUN-CONTRACT/CONFIG/SECURITY`；dependency/event-zero/redaction/path checks | 实现仓、技术 authority、store guarantee 或工具缺失即 `blocked`；不创建 fake ready | `planned / physical_blocked` |
| `PH-02` Context、显式选择与材料资格 | exact context/selection、generation、acquisition/verification/qualification/cache 分轴可测试 | `02-a`、`02-b`、`02-c` | CTX/MAT/CONTRACT/DOMAIN/SERVICE/CONFIG/CONTROLLED；AC-001～004、VETO-001/002/009 | implicit/latest、authority/integrity bypass 或 positive seam 缺失即停；只可保留 semantic negative | `planned / upstream_blocked` |
| `PH-03` 请求、控制、资源与恢复 | request/control intent、resource guard、UoW/idempotency、Unknown/RecoveryCase、no-replay 可验证 | `03-a`、`03-b`、`03-c`、`03-d` | REQ/CTL/RES/REC/IDM/UOW/JOB/REPLAY；AC-005～009、TX-001～009、VETO-003/006/007 | ACK/PID/port→Running、Confirmed→Cleaned、owner repair/replay 或 store/readback 缺失即停 | `planned / external_blocked` |
| `PH-04` 预览、诊断、交接与 Query | bounded/redacted presentation、diagnosis/handoff posture、12 Query no-write/read identity 可验证 | `04-a`、`04-b`、`04-c` | PRE/OBS/QRY/ENTRY/SECURITY；AC-010/011、AR-002/005/010/015、VETO-008/010/011/012 | raw leak、Query write/refresh/reconcile/probe、receipt→evidence 或 safe seam 缺失即停 | `planned / observability_blocked` |
| `PH-05` Consumer、Job、自动化与报告 | header-first Consumer、local-only Job claim/checkpoint/report、event=0、same-run report capability 可验证 | `05-a`、`05-b`、`05-c`、`05-d` | CNS/JOB/UOW/REPLAY/SECURITY/CONTRACT；AC-003/008/009/010/011、VETO-004/005/007/011/012 | payload/ACK/cursor、owner repair/replay、event/outbox/topic 非零、static/cross-run evidence 即停 | `planned / transport_blocked` |
| `PH-06` selected integration/release/handoff | 已批准 public seam、immutable baseline、fixed run、全量 checks、独立 review 和 handoff 输入可裁决 | `06-a`、`06-b` | CONTROLLED/E2E/SECURITY/REPLAY、GATE-04/09/10/11/12、06 entry/exit/VETO | 缺 authority、baseline、环境、required check、pair 或 review 即 `baseline_blocked/not_run`；不生成 verdict | `planned / baseline_blocked` |

### 7.4 18 个 commit boundary 完成判定矩阵

下表是完成判定的最小 boundary 分母。`pass` 只表示未来该 boundary 的真实门禁通过；当前所有行仍是计划状态。一个 boundary 的实现完成不能替代同 phase 其他 boundary，也不能把 planned evidence 当作实例。

| Boundary | 必须形成的增量 | 必须有的完成证据 | 必须阻断的情况 | 当前状态 |
|---|---|---|---|---|
| `commit-ph-01-a` | 目标仓/authority、逻辑装配和依赖分类可审查 | Design/Scope/Worktree/Toolchain/Contract Gate、依赖边界和 event=0 检查 | 实现仓或技术 authority 缺失、私有依赖、物理路径猜测 | `planned / blocked` |
| `commit-ph-01-b` | strict config/profile/readiness、fixture/path、gate/check/report 合同 | Config/Contract/Evidence Gate、profile isolation、redaction/path/pairing 规则 | fail-open、leaf override、隐式 root、scanner unavailable 被当 clean | `planned / blocked` |
| `commit-ph-02-a` | context、exact selection、generation/invalidation 纵切 | CTX contract/domain cases、generation/write audit、no-latest 检查 | `latest/default`、scope/generation mismatch、authority 本地补判 | `planned / blocked` |
| `commit-ph-02-b` | acquisition、verification、qualification、cache protection 分轴 | MAT/IDM/UOW cases、完整性和重复效果报告 | Complete→Qualified shortcut、digest/authority bypass、坏材料进入 run | `planned / blocked` |
| `commit-ph-02-c` | public adapter availability 与 Q01～Q05 safe query | controlled/availability、dependency/redaction/no-write checks | SDK/private seam、cache-as-authority、Query 写入或 exact seam 未闭合 | `planned / blocked` |
| `commit-ph-03-a` | run/control/resource local truth、guard 和状态保护 | CTL/RES state matrix、resource/guard cases | Accepted→Running、Confirmed→Cleaned、probe→allocation shortcut | `planned / blocked` |
| `commit-ph-03-b` | effect ordering、UoW、idempotency、stored result/Unknown | REQ/CTL/IDM/UOW cases、call/write journal、result refs | external/commit Unknown 被重放、ACK/PID/port 升级状态、owner write | `planned / blocked` |
| `commit-ph-03-c` | RecoveryCase、manual review、no-replay/reclaim protection | REC/REPLAY/JOB cases、predecessor/supersedes lineage | 自动 replay/resend/reclaim/resume/delete、缺 readback 被压成 success | `planned / blocked` |
| `commit-ph-03-d` | lifecycle services、entry mapping、Q06～Q08 safe reads | SERVICE/ENTRY/REPLAY cases、query write audit、stored-result mapping | Query/entry 写入、state compression、result detail 丢失 | `planned / blocked` |
| `commit-ph-04-a` | bounded presentation、body-free/redaction-safe fields | PRE/OBS contract、forbidden-corpus/redaction report | raw body/secret/path/URL/PID/port/stack 泄露、未定义 visibility | `planned / blocked` |
| `commit-ph-04-b` | diagnosis/handoff slots、visibility/freshness/unknown posture | service/entry/security/replay cases、link/pairing checks | receipt→evidence、raw fallback、report orphan、Observability private seam | `planned / blocked` |
| `commit-ph-04-c` | committed read sections、projection identity、no-write entry | QRY/BND cases、call/write audit、projection identity report | refresh/reconcile/probe/upsert、section identity 缺失、Query side effect | `planned / blocked` |
| `commit-ph-05-a` | header-first Consumer、receipt/disposition、duplicate negative loop | CNS/CONTRACT cases、payload/ACK/cursor/event-zero audit | payload parse/hash/store、owner cursor、ACK、outbound event/topic 非零 | `planned / blocked` |
| `commit-ph-05-b` | local Job DTO、claim/checkpoint/report/result symmetry | JOB/UOW/REPLAY cases、stored-report replay and idempotency report | public result 不完整、report 不可重放、owner repair/replay 入口 | `planned / blocked` |
| `commit-ph-05-c` | Job runner、generation/claim fence、no-repair/no-replay | claim/checkpoint/cleanup cases、stale-claim and owner-write scan | takeover、owner mutation、automatic replay/delete、scheduler/store authority 缺失 | `planned / blocked` |
| `commit-ph-05-d` | gate/check/report/index capability、same-run pairing | report-generation、redaction/dependency/link/pairing/no-static checks | 静态 EV、跨 run、缺 pair、generator failure 或 unavailable 被记 clean | `planned / blocked` |
| `commit-ph-06-a` | selected public seam、baseline/preflight、controlled slot | immutable baseline、target-tier preflight、selected checks | authority/baseline/environment/fixed run/private seam 缺失 | `planned / blocked` |
| `commit-ph-06-b` | same-run evidence、VETO、handoff、independent review 输入 | all required reports/checks、handoff/VETO/open issues/review package | VETO 未 clear、required check unavailable、cross-run、review 缺失 | `planned / blocked` |

Boundary 完成的共同条件是：当前 design baseline 未失效；allowed scope 无越界；required reads、字段/DTO/state/ref/port/config/evidence 均闭合；Test/Evidence/Commit/Handoff Gate 有真实证据；失败材料和变更 lineage 已保留；不存在不可接受的 P0/VETO finding。`commit` 本身不是完成证据，只有在 Commit Gate 和 Handoff Gate 都通过后才可记录真实 hash；当前没有 hash。

### 7.5 交付实现前可落码闭环审计

| 审计面 | 必须确认 | 证据入口 | 不通过处理 | 当前事实 |
|---|---|---|---|---|
| 需求追溯 | P0 capability/FR/BR/NFA 与 phase/boundary/TC/AC 一一可回链 | trace matrix、05/06 mapping | 回写 00/05/06，重建受影响 mapping | 设计 mapping planned |
| 字段/DTO/ref | 03 中正式字段、typed ref、metadata、result、receipt、report 能被唯一构造 | 03 Step 6/8、contract review | `pause + change-upstream`，禁止实现端补字段 | 未执行 |
| 状态/错误/恢复 | 21 状态、Unknown、Blocked、RecoveryCase、terminal disposition 和错误映射一致 | 03 Step 9～12、state/test review | 回写 03/05/06；不能压成 Failed/Partial/Success | 未执行 |
| port/adapter/owner | required read/write/semantic adapter、availability、owner truth 和责任方向明确 | 03 Step 7、上游 seam record | 等 owner public contract；不得复制私有实现 | `RUN-UP-001~008` open |
| 配置/装配 | 41 项、source、profile、strict validation、configured/enabled/ready、failure/rollback 一致 | 04、Step 8 config matrix | 回写 04；fail-closed，不能 fallback | authority blocked |
| 测试/数据 | 18 CUT、108 TC、12 suite、18 slot、fixture/fault/redaction 分母稳定 | 05、Step 7 gate matrix | 回写 05；旧 run/mapping 失效 | planned only |
| 验收/红线 | AC/AR/TX/NFA/VETO、target tier、entry/exit 和 risk eligibility 一致 | 06、Step 7/12 mapping | 回写 06；VETO/P0 不可接受 | baseline 未建立 |
| phase boundary | 当前 boundary 不依赖后续对象、结果、证据或 owner truth | Step 5/6/10/11/12 review | 拆 boundary 或回退当前 WIP | 设计层 planned |
| evidence materialization | raw、report、check、index、handoff、review 同 run/source digest 可双向到达 | 05/06 path contract | 保留失败材料，新 run；不得静态补洞 | 未创建 |
| review/authority | 设计、实现、测试/证据、安全、配置、验收/GRC review 角色分离且有权限 | Step 11、06 §14 | `handoff` blocked，不自签 | 未确认 |

审计结论只能是 `pass / blocked / not_run / incomplete` 等有证据状态；“文档已写完”不能填入实现闭环审计的通过列。若任何一行发生变更，必须建立新 design baseline，并重新审查受影响 phase/boundary，旧 package 不回写。

### 7.6 交付证据链与固定路径

```text
artifacts/test/<run_id>/
  -> reports/runs/<run_id>/
  -> checks / evidence-index / evidence-detail
  -> reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md
  -> reports/review/{reviewer-notes,agent-review}.md
  -> 06 acceptance authority
```

| 交付证据项 | 固定路径/身份 | 完成标准 | 缺失或失败处理 | 当前状态 |
|---|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>/` | case/suite/stdout/stderr/check 原始材料含 run/profile/source digest；failed/partial 保留 | `not_created` 或 `incomplete`；不得用别的 run 补洞 | 未创建 |
| suite/run reports | `reports/runs/<run_id>/` | 由同一 run raw 生成 summary、suite、gate-results 和 integrity reports | report 不能从静态模板或手工状态生成；新 run 重建 | 未创建 |
| evidence index/detail | 同一 run 的 `evidence-index` 和 detail | TC/CUT/suite/slot/AC、raw、report、check、digest 双向可达；没有 valid pair 就是 incomplete | 不生成伪 EV；保留缺口和 blocker | 未创建 |
| redaction/dependency/link/pairing/cleanup checks | raw/check roots 下机器结果 | 所有 required check 有明确 pass/fail/blocked/not_run；unavailable 不记 clean | 受影响 boundary/phase 停止；必要时 VETO 候选 | 未创建 |
| acceptance handoff | `reports/acceptance/handoff.md` | 明确 scope、target tier、baseline/run、已执行/未执行、open issues、remaining blocker | 初稿需人/Agent review；不能生成 verdict | 未创建 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 每个适用 `VETO-RUN-001~012` 有真实引用和结论 | 缺任一项或 disputed 不能 handoff | 未创建 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 仅 eligible residual；有 owner、acceptor、scope、期限/trigger、action、evidence | P0/VETO/S 或缺权限不得接受 | 未创建 |
| open issues/retest | `reports/acceptance/open-issues.md` 及 new-run lineage | S/A/B/R、修复、复验、predecessor/supersedes 和仍开放项透明 | 失败材料不得删除；旧 status/digest 不回写 | 未创建 |
| independent review | `reports/review/` | 设计、测试/证据、安全/依赖、验收 review 分离，争议可回链 | 缺 review 只能 `handoff_blocked` | 未创建 |

固定路径是计划合同，不表示目录或实例已经存在。禁止使用 `latest`、跨 run 拼接、无 source digest 的 alias、Runner 本地日志替代正式报告，或把 handoff 草稿当作 acceptance verdict。

### 7.7 未完成项处理与结果矩阵

| 未完成项分类 | 识别条件 | 处理动作 | 是否允许 `implementation_complete` |
|---|---|---|---|
| `blocker` | P0 交付缺失、required gate failed/blocked/not_run、VETO/P0 finding、设计闭环冲突、required seam/authority/tool 不可用 | `pause`；修复或回写 owning source；新 baseline/run；保留旧材料 | 否 |
| `deferred` | 明确属于 `FR-RUN-014~016`、P2/future 或未启用的附加能力，且不改变 P0 分母/安全语义 | 登记 owner、触发条件、影响和重开入口；不把它写成 pass | 可以，但不得宣称该能力完成 |
| `eligible_residual` | 仅影响非关键 residual/NFA 条件，满足 06 §13 risk eligibility，且不触碰 VETO/P0/truth/security/evidence integrity | 生成版本化 risk record，由有权 acceptor 决定；到期/trigger 自动重开 | 仅可产生 `conditional_handoff`，不产生 06 verdict |
| `waiting` | 等待上游 public seam、技术 authority、平台矩阵、reviewer 或 GRC 输入 | 保持 waiting/blocked，记录 owner 和最迟关闭点 | 否 |
| `not_run` | required 执行未发生、环境/工具缺失或 baseline 未固定 | 记录真实未执行原因；不得转成 N/A 或 pass | 否 |
| `failed/timeout/flaky/incomplete` | 实际执行结果不是稳定通过或证据链不完整 | 保留原始结果，按 Step 10 建新 run，执行最小/全量受影响回归 | 否，直到新结果满足门禁 |
| `not_applicable` | 该 boundary 明确不产生某类产物，且正式映射说明理由 | 在 ledger/report 中写出适用范围和来源；不得用来掩盖 unavailable | 仅对该项有效，不自动放行其他门禁 |

实施结果矩阵：

| 结果 | 必要条件 | 可做什么 | 不可做什么 |
|---|---|---|---|
| `implementation_complete` | P0 全覆盖；18 boundary 和六 phase 真实完成；required Test/Evidence/Commit/Handoff Gate 通过；无 blocker/VETO/P0；设计闭环和 review 完整 | 将同一 package 交给 06 进入合法验收 | 不生成 06 verdict、signoff 或 release readiness |
| `conditional_handoff` | P0 主线和 required safety 通过；只剩符合 06 §13 的 residual，风险记录和权限完整 | 把带条件 package 交给 06 评估 | 不绕过 required test、required seam、VETO、S/P0 或证据缺口；不叫“有条件通过” |
| `incomplete` | 至少一项 required 交付/证据/审查未闭合，但未形成可接受完成条件 | 保留材料、修复、重跑或回写设计 | 不进入下一 phase，不 handoff |
| `blocked` | 外部 authority、目标仓、baseline、工具或设计 truth 未到达，或红线命中 | 等待/回写/修复，记录恢复点 | 不提交、不生成 verdict/readiness |

`conditional_handoff` 不是降低完成标准的快捷方式。若缺失项会影响 Runner 的 truth ownership、版本/完整性、安全、资源/清理、恢复、Query no-write、Consumer no-ACK、Job no-repair、event=0 或 evidence integrity，必须是 `blocker`，不能登记为 residual。

### 7.8 需求、验收与交付结果的三层分离

| 层 | 负责者 | 允许的状态/结论 | 输入 | 禁止升级 |
|---|---|---|---|---|
| 07 实施计划 | 实施/设计负责人 | `planned / in_progress / blocked / incomplete / implementation_complete / conditional_handoff` | boundary、gate、report、review package | 不写 `通过 / 有条件通过 / 不通过`、signoff、readiness |
| 06 验收 | 验收 authority/GRC | lifecycle + `通过 / 有条件通过 / 不通过` | fixed-run evidence、VETO、缺陷、风险、required signoff | 不修改 RunnerRun、Release、Governance、Sandbox、Observability truth |
| Release/readiness | 产品、运维、平台、GRC 和相应 owner | target-tier/scoped readiness 或 not_ready | 06 decision package、环境/SLO/retention、release authority | 不由文档完整、profile、ACK/PID/port、本地日志或 handoff 推导 |

即使未来 07 的 `implementation_complete` 成立，当前目标仍可能因 `RUN-UP-*`、`RUN-OPS-*` 或 T2/T3/T4 条件保持 `blocked/not_ready`。同样，06 的验收结论也不能把 Runner 本地 projection 反写为外部 owner truth。

### 7.9 Step 13 装配前输入完整性门禁

Step 13 允许 full-restart 装配前，必须逐项确认：

| 检查项 | 必须满足 | 当前状态 |
|---|---|---|
| Step 1～12 文件 | 每个文件存在，状态、输入、问题回答、诊断、取舍、结构化产物、回填草稿、待确认和自审可追溯 | Step 1～11 已存在；Step 12 当前完成 |
| Flow 状态 | 总 flow 的 Step 12 标为 `[x]`，current recovery point 指向 Step 13 | 待本 Step 后回写 |
| Scope/phase/boundary | P0 分母、六 phase、18 boundary、allowed/forbidden scope 和 gate ID 在 Step 2/5/6/7/12 一致 | 需 Step 13 前交叉审计 |
| Test/acceptance 分母 | 18 CUT、108 planned TC、12 suite、18 slot、AC/AR/TX/NFA/VETO 编号无新增孤儿或冲突 | 设计层已映射，实际未执行 |
| 事实边界 | 正式 07、implementation ledger、boundary skeleton、实现仓和执行实例仍未提前创建 | 当前满足 |
| 正式章节来源 | §1～§13 每章有对应 calibration 文件和延伸阅读入口；正式正文不新增结论 | 待 Step 13 装配 |
| implementation ledger 时序 | 只有 Step 13 能创建 `implementation_execution_ledger.md` 与 18 个 boundary skeleton | 当前禁止 |
| planned 状态保真 | 未来 boundary 只能为 `planned / blocked / waiting`，不得写 pass、commit、run、artifact 或 readiness | 当前满足 |

若任一项不满足，Step 13 必须暂停，修复 flow/Step/owner truth 后再装配；不能用正式正文覆盖缺口。

## 8. 回填草稿（未来正式 `07-实施计划.md` §12）

正式 §12 只保留收口结论和执行期需要的矩阵，详细问题回答、诊断、取舍与本 Step 的完整审计留在本文件。正文建议按以下顺序装配：

1. **完成语义与权限**：`implementation_complete` 只表示满足 07 handoff 条件，不等 06 verdict 或 release readiness。
2. **实施完成判定表**：保留 P0 覆盖、交付物、18 boundary、phase aggregate、Test/Evidence Gate、验收准备、VETO、缺陷、证据、设计闭环和 review 项。
3. **phase/boundary 完成矩阵**：六 phase 与 18 boundary 的完成增量、证据和阻断条件只引用本文件和 Step 6/7，不复制详细设计字段。
4. **交付证据表**：固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*`、`reports/review/*` 的同 run/source digest、redaction、dependency、link、pairing、cleanup 要求。
5. **未完成项处理**：区分 blocker、deferred、eligible residual、waiting、not_run、failed/incomplete；VETO/P0/truth/security/evidence integrity 不可 risk-accept。
6. **交付前闭环审计**：按 phase/boundary 复核 03/04/05/06/07；冲突先回写真相源、建新 baseline、重跑受影响门禁。
7. **当前事实声明**：截至正式 07 装配前，没有目标实现仓、实现 commit、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。

正式 §12 不应填写真实 `run_id`、digest、commit hash、缺陷数量、风险签署、verdict、signoff 或 readiness；这些只能由后续实现/验收 authority 产生。

## 9. 待确认事项、持续 blocker 与重开触发

| 编号 | 事项 | 影响 | 未确认前处理 | 重开入口 | 当前状态 |
|---|---|---|---|---|---|
| `RUN-DDD-001~003` | 目标实现仓、技术/runtime/入口、local store/cache guarantees 未闭合 | PH-01、物理交付、工具和持久化门禁无法执行 | `blocked`；不创建仓、baseline 或路径事实 | Step 3/8/9、PH-01、`commit-ph-01-a/b` | `blocked` |
| `RUN-UP-001~008` | Artifact/Governance/Sandbox/Runtime/Observability/Archive/platform/L0-sdk Runner-facing positive seam 未闭合 | PH-02～PH-06 positive、owner readback、handoff 受阻 | semantic negative/controlled/disabled；不猜 DTO/API/private implementation | 对应上游正式文档到达后重开 03/04/05/06/07 mapping | `blocked / waiting` |
| `RUN-OPS-001~002` | production SLO/capacity/retention、真实 integration/GRC/review authority 未闭合 | PH-06、T3/T4、最终 handoff/readiness 无法裁决 | `baseline_blocked/not_run`；不写 hard threshold 或 verdict | Step 9/PH-06/06 entry-exit | `blocked` |
| `RUN-DOC-003` | 正式 07、implementation ledger、planned skeleton 尚未建立 | 不能移交实现 agent | 只有 Step 13 才允许创建 | Step 13 | `open / blocking` |
| `OQ-RUN-016` | boundary review、evidence review、risk/disposition owner 和权限未确认 | 不能 handoff 或 risk-accept | 不自签，不生成 verdict | Step 11/06 §14 | `waiting` |
| `OQ-RUN-013` | target tier、immutable baseline、fixed run、environment identity 和 retention 未确认 | 06 entry、PH-06 evidence 和 release lane 受阻 | `not_entered / baseline_blocked` | Step 8/9/PH-06 | `blocked` |
| `05/06/07 truth change` | 需求、TC、AC/VETO、phase/boundary 或 evidence schema 变化 | 旧完成矩阵和 package 失效 | pause、回写、new baseline、受影响范围回归 | Step 10/12/13 | `waiting` |

任何 blocker 关闭都不自动产生实施完成；必须重新读取 owner truth、更新 baseline、复核受影响 boundary，并保留旧材料 lineage。

## 10. 进入 Step 13 条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 完成语义区分实施、验收和 readiness | `pass` | §7.1、§7.8；不把 handoff 当 verdict |
| P0 需求覆盖和 Step 4 交付物分母固定 | `pass` | §3、§7.2；P1/P2/future 不污染 P0 |
| 六 phase 与 18 boundary 的完成条件可审查 | `pass` | §7.3、§7.4；当前仍 planned/blocked |
| Test/Evidence/Commit/Handoff Gate 与同 run 证据链闭合 | `pass` | §7.6；实例尚未创建 |
| 未完成项分类和风险接受资格明确 | `pass` | §7.7；P0/VETO 不可接受 |
| 03/04/05/06/07 交付前闭环审计与重开规则明确 | `pass` | §7.5、§7.9；冲突必须回写真相源 |
| Step 13 输入完整性清单已定义 | `pass` | §7.9；装配前再次执行 |
| 当前事实边界保真 | `pass` | 无实现仓、baseline、run、artifact/report/evidence/verdict/signoff/readiness |
| 允许进入 Step 13 | `pass_for_step_13` | 下一步只创建并完成 `07_implementation_plan_step_13_formal_document_assembly.md`；在其前不得创建正式 07、implementation ledger 或 boundary skeleton |

## 11. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 2/4/7/9/11 与 06 最终规则而未新增需求 | `pass` | 只汇总既有分母、gate、VETO、风险和权限；未新增 DTO、状态、阈值或 owner truth |
| 是否包含书写规范要求的需求覆盖、测试门禁、验收门禁表 | `pass` | §7.2 明确三类及其证据/当前事实 |
| 是否定义未完成项、延期、风险接受和 blocker | `pass` | §7.7 分类、动作和允许结果完整 |
| 是否禁止 raw 替代 report、脚本初稿替代审查、计划 ID 冒充 evidence | `pass` | §2.3、§7.6 |
| 是否把 VETO/P0/truth/security/dependency/config/evidence integrity 设为不可接受 | `pass` | §2.3、§7.7 |
| 是否覆盖 phase/boundary 和交付前可落码闭环审计 | `pass` | §7.3～§7.5、六 phase/18 boundary |
| 是否保持 implementation complete、06 verdict、release readiness 分离 | `pass` | §7.1、§7.8 |
| 是否保持 planned/blocked/waiting/not_run 与实际 pass 分离 | `pass` | 全文当前状态栏和未完成项矩阵 |
| 是否遵守 Step 13 时序 | `pass` | 正式 07、implementation ledger、boundary skeleton 仍禁止提前创建 |

## 12. Step 结论与门禁

```text
current_document = 07-实施计划.md
current_step = 12
current_module = completion_criteria_and_delivery_disposition
gate_status = completed / pass / self_reviewed
gate_reason = 需求覆盖、交付物、六 phase、18 commit boundary、测试/验收、证据链、设计闭环、VETO、缺陷、风险、review、handoff 和 readiness 分离均已形成可审查完成合同；未完成项处理、同一 run 配对、交付前闭环审计和 Step 13 输入完整性门禁已固定。当前没有实现、测试、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。
next_allowed_action = create_and_complete_07_step_13_formal_document_assembly
formal_07_write_allowed = false_until_step_13_assembly
implementation_ledger_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
