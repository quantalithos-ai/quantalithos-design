# Step 12. 定义实施完成判定

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12
> 回填章节：`07-实施计划.md` §12 实施完成判定
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_12_completion_criteria.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与输入确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 · 定义实施完成判定 |
| 当前状态 | `done / pass / self_reviewed`（设计层；`step_stop_review`） |
| 输入基线 | Step 2 P0 scope；Step 4 deliverables；Step 7 phase/boundary gates；Step 9 risks/OQ；Step 11 commit/review/delivery；正式 `06` final decision rules |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改 |
| 本步输出 | 完成判定表、闭环项标准、PH/boundary 交付前可落码审计、证据清单、未完成项处理、最终交付清单 |
| 当前实施事实 | `not_entered / blocked_by_missing_implementation_repo_and_baseline`；无真实完成结论 |
| 下一动作 | Step 12 停审后进入 Step 13 full-restart 装配；正式 07 仍尚未创建 |

## 2. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 本轮需求覆盖如何判定？ | Step 2 的 P0 目标、范围和 00/03/05/06 追溯必须全部映射到已完成的 phase/boundary；conditional positive 只有 baseline 明确 enabled 且 exact contract/evidence 完整时才计入适用范围。 |
| 2. 交付物是否全部完成？ | 十模块、5 Command、16 Query、1 conditional consumer、四项配置、测试/报告工具链、planned evidence/handoff 均必须按 Step 4/6/7 完成；0 Event/0 Job 不得被“补实现”，禁止结构出现即不完成。 |
| 3. 测试/验收门禁是否通过？ | 所有适用 P0 gate、redaction、dependency、pairing/no-static、VETO 和 evidence integrity 必须有真实 fixed run、raw artifact、paired report、digest 和 review；07 不自行产生 06 verdict/signoff。 |
| 4. 风险、Spike、OQ 是否关闭？ | P0 blocker、required contract、设计闭环和 S/VETO 必须关闭；P1/P2/future 可作为 residual/延期，但必须有 owner、acceptor（若需）、deadline/trigger 和后续 ref。 |
| 5. 是否存在一票否决？ | `VETO-CON-001～007`、S 级红线、Query/side-path write、forbidden body、private dependency、static evidence、report mismatch、设计闭环 blocker 均不可风险接受。 |
| 6. 未完成项如何处理？ | P0 缺失/失败→blocker，不得称完成；A 级非硬红线在 06 允许的严格条件下才可候选有条件完成；B/R/P1/P2→residual/延期，不能贡献 P0 positive/readiness。 |
| 7. reports 是否必须从 artifacts 生成？ | 是。`reports/runs/<run_id>` 必须由同一 `artifacts/test/<run_id>` 真实 raw 生成；raw 不能替代 report，不能使用 `latest` 或跨 run 拼接。 |
| 8. acceptance reports 是否需审查？ | `handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`、evidence-index 和 review notes 必须由人/Agent审查；脚本只能生成 draft/facts。 |
| 9. artifact/report 是否需 redaction/link 检查？ | 是；forbidden body、secret、raw error、orphan、run mismatch、缺 digest 或 no-static evidence 均使送验无效或触发 S/VETO。 |
| 10. 是否仍存在字段/DTO/state/phase 冲突即可完成？ | 不可。任何未关闭的字段、DTO、Port、状态、scope、carrier、reconcile、config、evidence 或 phase boundary 冲突都阻断完成。 |
| 11. 是否执行 phase/boundary 交付前可落码审计？ | 必须。对 PH-01～PH-08、22 boundary 逐项检查正式 `03/05/06/07` 来源、允许/禁止范围、依赖、门禁、证据、提交和 handoff；未通过项先回写设计。 |

## 3. 当前材料问题诊断

| 问题 | 风险 | 本 Step 修正 |
|---|---|---|
| Step 7 只有 gate 设计，没有最终完成门槛 | 可能把计划通过误写成实施完成 | 建立完成/有条件完成/不完成三类执行期结论 |
| 证据、VETO、risk、review 分散 | 可能缺 raw/report/review 仍送验 | 将 evidence、report、handoff、VETO、risk 和 design closure 纳入硬条件 |
| residual 可能被当作“基本完成” | P1/P2 污染 P0/readiness | 禁止“基本完成”；residual 必须有 owner/trigger，且不贡献 P0 pass |
| 设计闭环只在 boundary 前复核 | 后期变更可能留下冲突 | PH/boundary 交付前再次全量审计 |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| “代码合并即完成” | 简单 | 无测试/证据/验收约束 | 不采用 |
| “大多数 P0 通过即可” | 灵活 | 会掩盖 VETO、证据或设计 blocker | 不采用 |
| 用三类结果和逐项证据判定 | 可审查且符合 06 | 需要完整 handoff/review | 采用 |
| raw artifact 直接作为完成证据 | 少一步报告 | 不可读且无法完成 pairing/review | 不采用 |
| P1/P2 unavailable 阻断所有完成 | 保守 | 把后置条件误当核心 | 不采用；进入 residual/有条件范围 |

## 5. 结构化中间产物

### 5.1 实施完成判定表

| 判定项 | 标准 | 证据要求 | 当前设计上限 |
|---|---|---|---|
| P0 需求覆盖 | Step 2 P0 scope 与 00/03/05/06 trace 全部有实现和 gate 入口 | trace matrix、boundary review、适用 TC/EV | 执行期判定；当前未执行 |
| 交付物完整 | Step 4 code/config/test/data/script/report/handoff 交付面均完成；禁止结构保持 absent | staged diff、boundary ledger、architecture scan | 执行期判定 |
| P0 gate | PH-01～PH-08 适用 P0 gate、redaction/dependency/pairing/no-static 全通过 | same-run raw/report、gate results、digest | 当前无 run，不能 pass |
| 验收可送验 | 06 进入条件、EV/VETO/handoff/risk/review 资料完整 | `reports/acceptance/*`、review notes | 07 只准备路径，不裁决 |
| 设计闭环 | 字段/DTO/Port/state/scope/carrier/reconcile/config/evidence/phase 无 blocker | phase/boundary closure audit | 当前 exact contracts 未闭合 |
| 提交/交付纪律 | 22 boundary 一一对应 commit、scope/message/check/handoff 完整 | commit hashes、ledger、reports | 当前无 commit |
| VETO/S | 7 VETO 未命中、S=0、evidence integrity 合格 | veto checklist、defect/retest refs | 当前 `not_evaluated` |
| residual 处理 | 所有 B/R/P1/P2 有 owner/acceptor/trigger/deadline；不影响适用 P0 | risk/open-issues/review | 当前 candidates 未接受 |

### 5.2 闭环项完成标准

| 闭环项 | 完成标准 | 证据 | 未满足处理 |
|---|---|---|---|
| 字段/DTO/Port | 所有当前 boundary 只使用正式定义；无临时字段或 guessed DTO | design closure + contract tests | blocker；回写 03 |
| 状态/转换 | 代码、TC、06 使用同一正式状态/轴；unknown 不被压扁 | state/flow reports | blocker；回写 03/06 |
| Query/side effect | 16 Query zero-write；唯一 owner write 是 `OwnerCommandPort.submit` | call ledger、architecture/no-write report | S/VETO；不完成 |
| ownership/dependency | SDK/formal boundary only；无 DB/repository/private bus/BFF/第二 truth | architecture/dependency report | S/VETO；不完成 |
| topic isolation | 八主题 canonical order、partial/empty/failure isolation 保持 | composition/recovery reports | P0 blocker/VETO-007 |
| recovery/a11y | subject-specific plan、one-action ceiling、三通道等价 | recovery/a11y reports | P0/VETO-006 |
| config | 四 key、strict whole-document、startup-only、zero-secret、no silent fallback | config-redline report | P0/VETO-004 |
| evidence | raw→report→candidate/EV→handoff/VETO 可追溯；无 orphan/static | report/pairing/no-static audit | evidence invalid/S |
| phase boundary | 当前 phase 不依赖后续 phase；22 boundary scope 无越界 | closure matrix、commit review | blocker；回写 07 |

### 5.3 交付实现前可落码闭环审计

| Phase / boundary | 复核范围 | 必查项 | 当前设计结论 | 执行期结论 |
|---|---|---|---|---|
| PH-01 / `commit-01-a/b` | `03` §3/§4/§13；`04` §3～§12；`05` §8/§9；`06` §3/§10 | package/toolchain、四 config、roots、dependency absence、static paths | `pass with blockers`；target repo/runner/baseline缺失 | 待真实仓/命令 |
| PH-02 / `commit-02-a/b` | `03` §5/§8/§9；`05` CTX/NAV/A11Y；`06` AC-CON-001/002 | context/visibility/qualification、selection cleanup、semantic route | `pass with blockers`；host authority pending | 待真实 gate |
| PH-03 / `commit-03-a/b/c` | `03` §5～§8；`05` VIEW/ADAPTER/ARCH；`06` AR/IFG | safe-field/source axes、16 Query zero-write、safe link/reconcile | `pass with blockers`；exact query surface pending | 待真实 gate |
| PH-04 / `commit-04-a/b/c` | `03` §7～§12；`05` INTENT/STATE/CONSISTENCY；`06` TX/CC | draft/request/result、submit sole write、unknown/no-replay、carrier/race | `pass with blockers`；owner/reconcile/carrier contract pending | 待真实 gate |
| PH-05 / `commit-05-a/b/c` | `03` §5/§7/§8；`05` TOPIC/SEC/A11Y；`06` AC-CON-005/VETO-007 | eight partitions、canonical order、strict empty、failure isolation | `pass with blockers`；owner facet/browser authority pending | 待真实 gate |
| PH-06 / `commit-06-a/b/c` | `03` §9/§11/§14/§15；`05` RECOVERY/A11Y/DIAG；`06` §8/§10/§11 | typed recovery、semantic equivalence、body-free diagnostics/redaction | `pass with blockers`；sink/AT pending | 待真实 gate |
| PH-07 / `commit-07-a/b/c` | `03` §6/§7/§10/§13；`05` ADAPTER/CONSISTENCY/ARCH；`06` IFG | narrow adapter registry、fake/formal parity、disabled invalidation | `blocked_for_positive`；exact SDK/invalidation contract pending | 待真实 gate |
| PH-08 / `commit-08-a/b/c` | `05` §9/§13/§14；`06` §3/§10～§14；Step 7 | fixed run, reports, EV/VETO/handoff/review, no-static | `blocked`；baseline/run/review authority absent | 待真实 run |

任何一行执行期结论只有在真实 baseline、代码、gate、artifact/report/evidence 和 review 完成后才能填写；当前表中的设计结论不是实施通过。

### 5.4 交付证据项

| 证据项 | 固定路径 | 完成标准 | 当前事实 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>/` | P0 suite raw、meta、case refs、失败保真、digest | 不存在 |
| run reports | `reports/runs/<run_id>/` | summary、suite reports、gate results、evidence-index、redaction/pairing/dependency/report audit | 不存在 |
| acceptance handoff | `reports/acceptance/handoff.md` | baseline/scope/facet/open issues/review version 经人/Agent审查 | 不存在 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 7 项逐项真实 source/evidence/reviewer conclusion | 不存在；实际 `not_evaluated` |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 仅有条件完成时，具名 owner/acceptor/trigger/signature | 不存在；candidate 未接受 |
| open issues | `reports/acceptance/open-issues.md` | S/A/B/R、复验、关闭或 residual trigger | 不存在 |
| review notes | `reports/review/*` | 记录争议、完整性、失败保真和是否可进入 06 | 不存在 |
| design closure audit | `reports/acceptance/design-closure-audit.md` 或 handoff section | 8 phase/22 boundary 无未修 blocker | 不存在；当前设计 blockers 存在 |

### 5.5 未完成项处理表

| 未完成项 | 处理 | 是否允许宣称完成 |
|---|---|---|
| target repo、baseline、runner、required contract 缺失 | blocker；等待/回写设计 | 否 |
| P0 gate、Query no-write、redaction、dependency、pairing/no-static 失败 | 修复并用新 run 复验 | 否 |
| VETO-CON-001～007 或 S 级开放 | 不可风险接受；修复后全量 P0 | 否 |
| 字段/DTO/state/phase closure blocker | 回写正式真相源并重复审计 | 否 |
| A 级非硬红线 | 仅按 06 严格风险接受候选 | 最多有条件完成 |
| B/R/P1/P2 residual | 具名 owner/acceptor/trigger/deadline，记录 open issue | 可有条件；不贡献 P0/readiness |
| selected browser/AT/quantitative/production sink unavailable | residual；未启用 facet 不计 required | 可完成 P0 主线，但不得宣称 selected/production pass |
| 旧阈值、固定 control/metric 数量、UI→readiness 推导 | 删除/回写；不得接受 | 否 |

### 5.6 最终交付清单（未来执行期）

| 交付物 | 完成判定 |
|---|---|
| 十职责模块与 planned client package | target repo authority、编译/类型检查和 boundary review 通过 |
| 5 Command / 16 Query / 1 conditional consumer | protocol inventory、no-write/sole-write、state/error/race tests 通过；0 Event/0 Job absence 保持 |
| 四项配置与三 profile | config redline、strict/startup-only、zero-secret/fail-closed 通过 |
| test data/suites/gates/checks | 96 TC 与 data registry/runner 映射真实可执行 |
| artifacts/reports/evidence candidates | 同一 fixed run raw/report/digest/pairing/redaction 完整 |
| acceptance handoff/VETO/risk/open issues | 由人/Agent审查；不自动写 verdict/signoff/readiness |
| 22 boundary commits/handoff | 每 boundary 实际 gate、scope、message、hash、handoff 完整 |
| design closure audit | 8 phase/22 boundary 无未修 P0 blocker |

### 5.7 完成结果矩阵

| 结果 | 必须满足 | 允许表达 |
|---|---|---|
| `完成 / 可送验` | P0 scope/交付物完成；适用 P0 gate 全过；VETO 未命中；S=0；证据/报告/审查完整；设计闭环无 blocker | 可进入 06 正式验收生命周期；不自动等于 production readiness |
| `有条件完成 / 可送验带 residual` | 所有适用 P0 成立；VETO/S=0；仅已接受且不影响硬门禁的 A/B/R/P1 residual | 受 owner/trigger/deadline 约束；不把 residual 写成 positive/readiness |
| `不完成 / 不可送验` | 任一 P0 gate failed/blocked；VETO/S；证据不可裁决；设计闭环 blocker；未审查 handoff | 继续 pause/fix/retest；不得提交或移交 |
| `not_entered` | baseline/implementation/run/review 尚未固定 | 当前事实；不是 verdict |

## 6. 跨完成判定审计

| 审计项 | 结论 | 依据 |
|---|---|---|
| P0 scope、交付物、gate、风险均纳入判定 | `pass` | Step 2/4/7/9/11 交叉映射 |
| VETO/S 不可风险接受 | `pass` | 正式 06 §11～§13 |
| evidence integrity 是硬条件 | `pass` | raw/report/pairing/redaction/no-static/review |
| design closure audit 是硬条件 | `pass` | §5.3、§5.4 |
| P1/P2 不污染 P0 | `pass` | residual 需 trigger，不贡献 pass |
| 06 仍拥有最终 verdict/signoff/readiness | `pass` | 07 只判定实施可送验，不产生验收裁决 |
| 当前是否可宣称实施完成 | `no` | implementation repo/baseline/run/evidence 均未固定 |

## 7. 回填草稿

正式 §12 应保留完成结果矩阵、P0/VETO/evidence/design-closure 硬条件、phase/boundary 交付前审计、未完成项处理和证据路径。当前实施状态必须写 `not_entered / blocked_by_missing_implementation_repo_and_baseline`，不得写“基本完成”、通过、签署或 readiness。

## 8. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 实际完成判定的 run/baseline/review version | 执行期由真实台账和 06 裁决固定；当前不存在 |
| residual 是否可有条件送验 | 由 06 风险接受/最终裁决决定；07 不代签 |
| design closure audit 独立报告还是 handoff section | 执行期按 05/06 authority 选择；当前只定义字段 |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 完成判定表完整 | `pass` | §5.1、§5.7 |
| 闭环项标准完整 | `pass` | §5.2 |
| 8 phase/22 boundary 交付前审计完整 | `pass` | §5.3 |
| evidence/handoff/VETO/risk 证据项完整 | `pass` | §5.4 |
| 未完成项处理清楚 | `pass` | §5.5 |
| 不伪造当前完成事实 | `pass` | 当前 not_entered/blocker |
| 可进入 Step 13 | `pass` | full-restart 装配正式 07、implementation ledger 和 boundary skeleton |

## 10. Step 自审记录

- [x] 已回答 Step 12 十一个 SOP 问题。
- [x] 已定义完成/有条件完成/不完成/not_entered 四种实施期状态边界（not_entered 不是 verdict）。
- [x] 已将 8 phase、22 boundary 的字段/DTO/state/dependency/evidence/phase closure 审计纳入完成条件。
- [x] 已明确 raw artifact 不能替代 report、acceptance draft 必须人/Agent审查、VETO/S 不可接受。
- [x] 已保持 06 的最终裁决权，不生成 verdict/signoff/readiness。
- [x] 未创建实现仓、代码、测试、run、artifact/report/evidence、commit 或实际完成结论。

## 11. Step 12 停审结论

Step 12 在设计层 `done / pass / self_reviewed`，并切换为 `step_stop_review`。实施只有在真实 baseline、代码、gate、artifact/report、review 和设计闭环均满足时才可宣称完成；当前实际状态仍 `not_entered / blocked_by_missing_implementation_repo_and_baseline`。按用户授权，下一步进入 Step 13 full-restart 装配。
