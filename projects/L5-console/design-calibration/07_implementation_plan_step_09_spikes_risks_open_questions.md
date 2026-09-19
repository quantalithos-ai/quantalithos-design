# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填章节：`07-实施计划.md` §9 Spike、风险与待确认事项
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与输入确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 · Spike、风险与待确认事项 |
| 当前状态 | `done / pass / self_reviewed`（设计层；`step_stop_review`） |
| 输入基线 | Step 1 blocker；Step 5 phase；Step 6 boundary；Step 7 gate；Step 8 依赖/环境准备；正式 `03/04/05/06` |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改 |
| 本步输出 | Spike 表、风险表、待确认事项表、回写触发矩阵、截止点和跨风险审计 |
| 下一动作 | Step 9 停审后进入 Step 10；按用户“完成全部 07”授权继续 |

## 2. 本步输入与问题诊断

| 输入/问题 | 影响 | 处理 |
|---|---|---|
| `BLK-CON-07-001` 目标实现仓不存在 | 无法验证 package、runner、worktree、build 和 commit identity | 设为 PH-01 前 blocker；SP-001 只做 future bootstrap dry-run，不创建仓 |
| `BLK-CON-07-002` exact owner/SDK surface 未闭合 | positive Query/Command/Topic/adapter 可能猜造 schema | 以 contract-closure Spike 和 boundary blocker 处理；safe/no-call/disabled 先行 |
| `BLK-CON-07-003` immutable design/delivery/environment baseline 未固定 | 不能生成真实 hash、run、handoff 或 evidence | 设为 PH-08/handoff blocker；不得填占位 hash |
| `RES-CON-07-001` browser/AT、carrier、diagnostic authority pending | selected gate 或生产正向绑定不可判定 | 设计 semantic/session/body-free 上限；SP 输出选择矩阵/contract checklist |
| `RES-CON-07-002` framework/router/bundler/package manager pending | 具体入口、命令、文件落点不可锁定 | 保持 framework-neutral；目标仓 authority 到达前不写具体命令 |
| `CON-Q-034～047` 仍 open/pending | 可能影响 positive integration、durability、diagnostic、兼容和量化 | 分成 blocker、conditional residual 或 future trigger；不得用“后续确认”悬空 |

## 3. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 哪些技术点需要 Spike？ | 只对会改变 phase/boundary、gate、evidence 或设计闭环的点做 Spike：目标仓/工具链 bootstrap、配置 strict dry-run、SDK safe surface、visibility/safe-field、carrier/concurrency、semantic a11y、diagnostic redaction、invalidation disabled branch、report pairing/no-static。 |
| 2. 哪些风险阻塞阶段？ | 目标仓/runner/core package、exact owner/SDK contract、设计 baseline、forbidden dependency/body、Query write、unknown replay、redaction、evidence pairing/no-static 和 phase boundary 越界均阻塞；selected browser/AT、生产 sink、量化仅为 residual，除非正式 baseline 将其设为 required。 |
| 3. 哪些待确认事项影响提交边界/验收门禁？ | package/host authority、safe-field/qualification、submit/idempotency/reconcile、carrier medium、invalidation envelope、browser/AT matrix、diagnostic sink、baseline/run/review authority 都会影响对应 boundary 和 PH-08 handoff。 |
| 4. 每个 Spike 输出什么？ | 必须输出 dry-run report、contract closure checklist、fixture/mapping review、semantic matrix、redaction report、pairing/no-static audit 或明确的 `blocked` 记录；不得只留口头结论。 |
| 5. 风险处理方式和截止点？ | 每个风险绑定 phase/boundary、owner、处理动作、触发条件和截止点；P0 blocker 在对应 boundary 开工前关闭，否则暂停；P1/P2 residual 在启用或送验前重新定级。 |
| 6. 哪些风险需要回写上游设计？ | 任何新增/缺失字段、DTO、Port、状态、错误、safe-field、scope、reconcile、carrier、config key、test/evidence schema 或 phase boundary 必须回写 `03/04/05/06/07` 对应真相源；实施者不得自补。 |

## 4. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 先做真实 owner integration Spike | 早见正向体验 | 合同未闭合，容易产生 guessed DTO/第二 truth | 不采用 |
| 用 safe/disabled contract Spike 先验证边界 | 可验证负向、结构、语义和证据链 | 正向能力延后 | 采用 |
| 所有 pending 都标长期风险 | 表面简单 | 没有截止点，实施者会临场判断 | 不采用 |
| 按 blocker/residual/future 分层并绑定 trigger/deadline | 可审计、可暂停和重新定级 | 表格较多 | 采用 |
| 用样例/静态 JSON 代替 report/evidence Spike | 生成快 | 违反 no-static-evidence | 不采用 |

## 5. 结构化中间产物

### 5.1 Spike 表

| 编号 | Spike 描述 | 影响阶段/boundary | 必须输出 | 截止点 | 当前状态 | 失败处理 |
|---|---|---|---|---|---|---|
| `SP-CON-07-001` | target repo/bootstrap/toolchain authority dry-run | PH-01 / `commit-01-a` | repo/path/package/toolchain/worktree checklist | 开工 `commit-01-a` 前 | `blocked / not_run` | 不创建 design-side替代仓；回报 `BLK-CON-07-001` |
| `SP-CON-07-002` | strict four-key config/profile negative dry-run | PH-01 / `commit-01-a/b` | parse/profile/duplicate/unknown/forbidden report | `commit-01-b` 前 | `planned / not_run` | validation contract不全则回写 04，禁止 silent fallback |
| `SP-CON-07-003` | official SDK public export and safe adapter surface review | PH-03/PH-07 / `commit-03-a`,`07-a/b` | export/version/DTO/ref/scope/safe-field closure checklist | 首个 positive adapter 前 | `blocked / contract_pending` | 保持 no-call/disabled；回写 03/06 |
| `SP-CON-07-004` | context/visibility/qualification/safe-field mapping review | PH-02/03 / `commit-02-a`,`03-a` | source-to-safe-field matrix and redaction fixture list | `commit-03-a` 前 | `blocked / authority_pending` | restricted/blocked；不得披露存在性或正文 |
| `SP-CON-07-005` | command submit/reconcile/idempotency/unknown posture | PH-04 / `commit-04-b` | operation/key/result/reconcile checklist and no-replay cases | `commit-04-b` 前 | `blocked / contract_pending` | owner positive blocked；unknown stays unknown |
| `SP-CON-07-006` | session carrier/late-drop/single-writer race review | PH-04/07 / `commit-04-c`,`07-c` | carrier ceiling, scope, race permutation and invalidation fixture map | `commit-04-c` 前 | `conditional / session_only` | 不声明 durable/cross-tab；回写 03/04 |
| `SP-CON-07-007` | eight-topic partition/canonical-order isolation review | PH-05 / `commit-05-a/b/c` | descriptor registry, order, partial/strict-empty matrix | `commit-05-a` 前 | `planned / not_run` | owner facet未闭合则 disabled/partial，阻断 readiness 推导 |
| `SP-CON-07-008` | semantic a11y action/focus/announce equivalence review | PH-02/06 / `commit-02-b`,`06-b` | shared guard/action/outcome matrix and fallback checklist | `commit-06-b` 前 | `conditional / matrix_pending` | semantic P0 保留；selected browser/AT residual |
| `SP-CON-07-009` | diagnostic whitelist/redaction/sink isolation review | PH-06 / `commit-06-c` | body-free envelope, forbidden corpus, recursion/failure report | `commit-06-c` 前 | `conditional / sink_pending` | disabled/body-free only；leak→S/VETO |
| `SP-CON-07-010` | invalidation disabled/future envelope order/dedup review | PH-07 / `commit-07-c` | version/order/dedup contract checklist and disabled proof | `commit-07-c` 前 | `blocked / contract_pending` | consumer disabled/zero-write；不直连 bus/cursor/replay |
| `SP-CON-07-011` | fixed-run report/pairing/no-static evidence dry-run | PH-08 / `commit-08-a/b/c` | same-run raw/report/pairing/redaction/no-static audit | `commit-08-a` 前 | `blocked / baseline_pending` | 不生成 candidate/EV；保留 blocked 状态 |

每个 Spike 的输出必须引用正式文档和实际输入来源；在目标仓、authority 或 baseline 不存在时，输出只能是 `blocked/not_run` 记录，不能伪造 demo、hash、run 或报告结果。

### 5.2 风险表

| 编号 | 类型/级别 | 描述 | 影响阶段/boundary | 处理方式 | 截止点 | 当前状态 |
|---|---|---|---|---|---|---|
| `RISK-CON-07-001` | blocker/P0 | 目标实现仓不存在 | 全部；PH-01 | 等 authority；重新做 repo/worktree/toolchain check | `commit-01-a` 开工前 | `open / blocked` |
| `RISK-CON-07-002` | blocker/P0 | package manager/framework/router/bundler/host/runner 未固定 | `01-a`,`02-b`,`07-a`,`08-a` | 只读目标仓/host authority；不从 README 选型 | 对应 boundary 开工前 | `open / blocked` |
| `RISK-CON-07-003` | blocker/P0 | exact owner/SDK DTO、scope、qualification、safe-field、reconcile 未闭合 | `03-*`,`04-b`,`05-*`,`07-b` | 回写 03/05/06；先 safe/no-call/disabled | 首个 positive facet 前 | `open / blocked` |
| `RISK-CON-07-004` | blocker/P0 | Query/side-path 或 adapter 引入写入、private source 或第二 truth | `03-*`,`07-*` | architecture/no-write/dependency gate；命中即停 | 每个 boundary 提交前 | `open / guard_required` |
| `RISK-CON-07-005` | blocker/P0 | forbidden body/secret/raw error/credential 进入生命周期 | `02/03/06/08` | synthetic corpus、redaction、VETO；失败不可接受 | 每个适用 gate | `open / guard_required` |
| `RISK-CON-07-006` | blocker/P0 | unknown result replay/double submit/receipt→confirmed 推导 | `04-b`,`07-b` | single-flight、reconcile、no-replay tests；合同缺失则 blocked | `commit-04-b` 前 | `open / contract_pending` |
| `RISK-CON-07-007` | blocker/P0 | evidence/report 缺 raw、pair、digest 或静态 pass | `01-b`,`08-*` | pairing/no-static/report audit；保留失败材料 | `commit-08-a` 前 | `open / guard_required` |
| `RISK-CON-07-008` | blocker/P0 | phase/boundary 越界或后续能力前置 | 全部 | Step 6/7 mapping review；移回正确 boundary | 每个 boundary 开工/提交前 | `open / review_required` |
| `RISK-CON-07-009` | blocker/P0 | config unknown/duplicate/forbidden key 或 silent fallback | `01-a`,`08-a` | strict whole-document reject；回写 04 | `commit-01-a` 前 | `open / guard_required` |
| `RISK-CON-07-010` | residual/P1 | browser/AT selected matrix 未固定 | `02-b`,`05-c`,`06-b` | semantic P0；记录 selected unavailable | 启用 selected 前 | `open / residual` |
| `RISK-CON-07-011` | residual/P1 | carrier durability/TTL/migration/cross-tab 未固定 | `04-c`,`07-c` | session-volatile ceiling；触发后回写 03/04 | 宣称 durability 前 | `open / residual` |
| `RISK-CON-07-012` | residual/P1 | production diagnostic sink/envelope/retention 未固定 | `06-c`,`08-c` | disabled/body-free；不产 production evidence | 启用生产 sink 前 | `open / residual` |
| `RISK-CON-07-013` | residual/P1 | quantitative/compatibility authority 未固定 | `05-c`,`08-b` | structural/semantic only；不写阈值 verdict | 进入 selected/release 前 | `open / residual` |
| `RISK-CON-07-014` | future/P2 | L5/L6 adjacent link/ref 未停审 | `05`,`07` | link disabled；双方正式合同后重开 | 启用 link 前 | `open / future` |

### 5.3 待确认事项表

| 编号 | 待确认事项 | 影响 | 责任/来源 | 截止点或触发器 | 未关闭时动作 |
|---|---|---|---|---|---|
| `OQ-CON-07-001` | 目标仓何时由谁提供，package/toolchain 事实是什么 | 全部 | 项目/实现 owner | PH-01 开工前 | `blocked / wait_design` |
| `OQ-CON-07-002` | framework/router/bundler/package manager/host lifecycle | `01-a`,`02-b`,`07-a` | 实现仓/host authority | 对应 boundary 开工前 | framework-neutral；不得猜命令 |
| `OQ-CON-07-003` | SDK public version/export 与 owner query/command DTO | `03/04/05/07` | L0 SDK + owner services | 首个 positive adapter 前 | no-call/disabled；回写 03 |
| `OQ-CON-07-004` | scope/visibility/qualification/safe-field/source freshness contract | `02/03/05` | Identity/Policy/Gate/owner | protected facet 开启前 | restricted/blocked；不披露 |
| `OQ-CON-07-005` | submit operation/key/result/reconcile/idempotency contract | `04-b`,`07-b` | command owner/SDK | owner command enabled 前 | unknown/no-replay；不宣称 confirmed |
| `OQ-CON-07-006` | carrier medium/TTL/migration/cross-tab/CAS authority | `04-c`,`07-c` | product/architecture | durability 或 cross-tab 声明前 | session-only ceiling |
| `OQ-CON-07-007` | browser/AT selected matrix and diagnostic sink/envelope | `05-c`,`06-b/c`,`08` | test/a11y/observability/host | selected/production enabled 前 | semantic/body-free residual |
| `OQ-CON-07-008` | invalidation envelope/version/order/dedup/observed freshness | `07-c` | SDK/host | consumer enabled 前 | disabled/zero-write |
| `OQ-CON-07-009` | immutable design/delivery/environment/dependency baseline and review authority | `08`,`12`,`13` | design/implementation/acceptance | handoff/送验前 | `not_entered`；不填 hash/run |
| `OQ-CON-07-010` | P1/P2 quantitative/compatibility/retention authority | `05/06/08/12` | product/test/ops/compliance | 加入 release scope 前 | residual；不贡献 P0 |

### 5.4 回写目标矩阵

| 缺口类型 | 真相源 | 必须同步的 07 位置 | 安全动作 |
|---|---|---|---|
| object/protocol/flow/state/carrier/reconcile | `03-详细设计.md` | Step 6/7/8/10/12 | pause、固定新 design baseline、重做受影响 boundary |
| config key/profile/source/failure | `04-配置设计.md` | Step 8/10/12 | reject guessed config；重做 config gates |
| TC/suite/artifact/report/EV/pairing | `05-测试方案.md` | Step 7/8/10/12 | 保留失败 run；重做测试/报告审计 |
| AC/VETO/risk/signoff/readiness | `06-验收标准.md` | Step 7/9/10/12 | 不由 07 发明裁决；暂停送验 |
| phase/boundary/gate/commit/handoff | `07` calibration/formal 07 | Step 6/7/10/11/12 | 调整计划并重新审计 |

## 6. 跨风险与截止点审计

| 审计项 | 结论 | 依据 |
|---|---|---|
| 每个 Spike 是否有输出和截止点 | `pass` | SP-001～011 均有 report/checklist/matrix/audit 目标与 boundary 截止点 |
| 每个风险是否绑定 phase/boundary | `pass` | RISK-001～014 均有影响范围、处理动作和截止点 |
| blocker 是否阻止继续实现 | `pass` | target repo、exact contract、P0 safety/evidence、设计越界均 blocked |
| residual 是否污染 P0 | `pass` | browser/AT、carrier、diagnostic、quantitative、adjacent link 均不贡献 P0 pass |
| 是否有长期悬空“后续确认” | `pass` | OQ-001～010 均有 boundary 截止点或 enabled/送验触发器 |
| 回写目标是否唯一 | `pass` | 03/04/05/06/07 分域映射，无实现端自由补口 |
| Step 5/6/7/8 一致性 | `pass` | phase 顺序、22 boundary、gate、依赖和失败姿态无冲突 |
| 事实诚实 | `pass` | 当前所有 Spike/risk/OQ 状态为 planned/open/blocked/residual；无 run/evidence/verdict |

## 7. 回填草稿

正式 §9 应保留 Spike 的输出/截止点、P0 blocker 与 P1/P2 residual 的分层、OQ 的启用触发器，以及“未关闭 blocker 不得继续”的规则。不要在正式文档中填写实际 owner、日期、hash、run 或风险接受签署。

## 8. 待确认事项

本 Step 的待确认事项已由 `OQ-CON-07-001～010` 结构化登记；它们不是已完成的项目决定。用户/authority 未提供新事实前，不得将任何 OQ 改成 closed 或 positive integration。

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Spike 有明确输出 | `pass` | 每项都不是开放式探索 |
| 风险按 blocker/residual/future 分类 | `pass` | P0 与 P1/P2 分离 |
| 待确认事项有截止点/触发器 | `pass` | 无长期悬空项 |
| 回写设计触发明确 | `pass` | 03/04/05/06/07 分域 |
| blocker 影响范围可审查 | `pass` | 与 phase/boundary 绑定 |
| 正式 07 仍未写入且无执行事实 | `pass` | Step 13 前关闭 |
| 可进入 Step 10 | `pass` | 继续定义暂停、回退、变更和恢复 |

## 10. Step 自审记录

- [x] 已回答 Step 9 六个 SOP 问题。
- [x] 已建立 11 个 Spike、14 个风险和 10 个待确认事项，并为每项绑定输出/截止点或触发器。
- [x] 已区分 P0 blocker、P1 residual 与 P2/future，不将后置事项写成“后续确认”或正向能力。
- [x] 已建立 03/04/05/06/07 回写目标矩阵。
- [x] 未创建实现仓、代码、测试、run、artifact/report/evidence、verdict/signoff/readiness 或 commit。

## 11. Step 9 停审结论

Step 9 在设计层 `done / pass / self_reviewed`，并切换为 `step_stop_review`。Spike、风险和 OQ 已形成可执行的截止点与安全动作；持续 blocker 不被风险表消解。按用户“完成全部 07”授权，下一步进入 Step 10。
