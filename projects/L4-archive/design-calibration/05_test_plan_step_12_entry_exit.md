# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
> 正式回填：`05-测试方案.md` §12
> 日期：2026-09-13
> 状态：`completed / criteria_unambiguous_current_execution_not_entered / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 为 local/CI、formal-seam、release evidence 和整份测试完成分别定义可判定 entry/exit/pause/VETO |
| 输入 | 05 Step 6～11；正式 00 §14～15；03 §15～17；04 §11～14 |
| gate_status | `completed / criteria_unambiguous_current_execution_not_entered` |
| gate_reason | 文档设计门禁与未来测试执行门禁分离；local 与 formal P0 均有准则，blocked real seam 未被 skip/waive；当前执行条件明确未满足 |
| next_allowed_action | 按连续授权创建并完成 Step 13 |
| source_files | 05 Step 6～11；测试方案书写规范 §5.12；正式 00 §14～15；03 §15～17；04 §11～14 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 门禁层级与状态 | §2～§5 | done | 设计完成不等测试退出 |
| 分层进入准则 | §6.1～§6.3 | done | local/formal/release 前置独立 |
| 分层退出准则 | §6.4～§6.6 | done | required P0 blocked 不可删除 |
| pause/VETO | §6.7～§6.8 | done | 任一触发动作明确 |
| 当前评估与审计 | §6.9～§10 | done | 当前 `not_entered/blocked` 不伪 pass |

## 2. 本步输入与门禁语义

| 层级 | 回答的问题 | 当前状态 |
|---|---|---|
| design/document gate | 05 的测试设计是否足以装配正式文档 | Step 12 完成；待 Step 13～15 |
| local execution entry | 本地 deterministic P0 suite 是否具备真实运行前置 | `not_entered`：目标实现仓、suite/scripts/run 均不存在 |
| formal-seam entry | owner/provider/durable 正向 P0 是否具备正式合同、vector 和环境 | `blocked`：持续 blocker 未关闭 |
| release evidence exit | fixed run raw/report/EV 是否真实完整 | `not_run`：当前 0 run/artifact/report/EV |
| acceptance | 测试结果是否满足正式验收和风险接受 | 不属于 05；未来正式 06 裁决 |

“正式 05 可装配”仅说明验证方案闭合，不说明任何 execution entry/exit 已满足。所有未来 checklist 均保持未勾选；本 Step 的完成状态只评价准则设计是否清晰。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始测试前哪些文档必须冻结？ | 正式 00～05 的适用 revision 必须固定；03 的对象/协议/state/UoW/error 和 04 的 55 keys/profile 必须与测试 revision 一致。变更影响 P0 时先重审相关 Step。 |
| 哪些环境和数据必须可用？ | local P0 需 `ci-test`/controlled/replay 装配、对应 26 DS、本地 isolated cleanup；formal P0 另需逐 target 合同、versioned vector、真实 binding、safe namespace 与 cleanup/probe。 |
| 哪些自动化必须可运行？ | 11 个 P0主体 suites（含 formal-seam）及 PR/main/nightly/formal/release gates 和相关 checks；P1/P2 不替代。 |
| 退出时哪些用例必须通过？ | 102 个 P0 TC 的适用 local/negative 断言必须通过；每个 required formal positive lane 必须真实执行通过，不能 blocked/skip；五类 VETO 全通过。 |
| 哪些缺陷和风险阻断退出？ | 任一 S、未接受且影响 P0 的 A、P0 failed/infra_failed/blocked/not_run、raw/report/EV断链、formal prerequisite 未闭合、VETO/check失败均阻断完整退出。 |
| blocked 能否从分母删除？ | 不能。blocked required lane 必须保留在 gate denominator 和 residual 表，完整测试退出保持 blocked。 |
| 什么时候暂停而不是失败？ | 上游正式合同/设计 revision 改变、无法安全清理、状态/字段无正式来源、环境身份漂移、外部 effect 知识不确定且无 probe、发现 scope expansion 时暂停并回 owning document。 |
| 当前是否允许实际执行？ | 否。本任务只写设计；目标实现仓、scripts、runner、environment、run_id 均未建立，也没有测试执行授权。 |

## 4. Historical material 诊断与改动前后对比

| 历史口径 | 问题 | 当前处置 |
|---|---|---|
| “P0 场景全部通过、无 S 即退出” | 未区分 external required blocked、证据真实性和 infra failure | 分层 entry/exit + required formal lane + fixed-run evidence |
| staging fake 可作为 E2E entry | fake 不能提供 authority/finality | formal contract/vector/binding/cleanup 独立前置 |
| `02/03` 冻结即可开始 | 缺 04 config、05 data/suite/evidence revision | 固定正式 00～05 source refs |
| blocked/skip 不计分母 | 会制造伪通过 | required lane永久保留，完整 exit blocked |
| 文档完成等于测试可跑 | 当前无目标实现仓 | design gate 与 execution gate 分离 |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 进入 | 单一 checklist | local、formal、release evidence 三层 |
| 退出 | 用例计数 | TC + suite + VETO + defect + evidence + blocker |
| 暂停 | 未定义 | 设计漂移/unsafe env/unknown effect 明确回流 |
| 当前状态 | 容易误读“已完成” | design criteria completed；execution not_entered/blocked |

## 5. 进入 / 退出设计取舍

1. 本地 P0 可以在 formal seam 解阻前独立运行并形成局部证据，但不能据此宣告整份测试完成、验收或 readiness。
2. formal-seam 是 P0 required，而非可接受的 P1 residual；`blocked` 永远不是 `passed/skipped`，也不能用人工签字或 fake 代替。
3. P2 数值 measured lane 在 `AR-HLD-Q-002` 关闭前不是当前 P0 数值退出条件；但 P0 有界/进度/无静默截断仍必须通过。
4. acceptance/risk signoff 不由 05 勾选；05 只交付真实证据给 06。
5. 一次 release 可选择多个固定 run 组成送验集合，但每一证据实例必须绑定单一 run，聚合报告必须显式列出全部 source run，禁止 `latest` 或跨 run 偷换。

## 6. 结构化中间产物

### 6.1 Local / CI 执行进入准则

- [ ] 正式 `00-需求文档.md`～`05-测试方案.md` 的 source revision 已固定，且无影响当前 P0 的未审设计变更。
- [ ] 目标实现仓、6 crates 和实际测试文件存在，实际分母与 `6/26/8/7/30/32/18/8` 一致或有正式回写。
- [ ] 102 个 `TC-AR-*` 均有可发现的实现映射；本地/negative case 不被标为手工或跳过。
- [ ] 26 个 `DS-AR-*` 数据集可重复构造；每 case/run 隔离与 exact cleanup 已由测试工具实现。
- [ ] `ci-test`、controlled integration、`operations-replay` 的 required local slots 可装配；fake 只存在于 test profile。
- [ ] 12 配置域/55 keys 的 valid、missing、invalid、conflict 和 cross-field vectors 可构造，无隐式默认。
- [ ] deterministic fault/barrier/write/effect/capture spies 可覆盖 UoW、CAS/read-set/fence、unknown/reconcile、Query no-write 和 telemetry failure。
- [ ] PR/main/nightly planned gate 与 local P0 suites 可运行，失败/infra failure 返回非零并保留 safe raw。
- [ ] artifact/report roots 固定为 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`，run ID 显式且不是 `latest`。
- [ ] redaction、dependency、report-link、no-static-evidence、blocked-lane checks 可运行。

### 6.2 Formal-seam 执行进入准则

以下条件按 source/owner/provider/receiver target 独立检查，任一缺失使对应 lane=`blocked`：

- [ ] owning project 的正式合同明确 selector/payload/ref、authority、schema/version、fence/watermark/coverage、错误和兼容窗口。
- [ ] exact owner/provider binding 与配置 identity 可定位，不通过 sibling compile、private DB、fake 或 workspace fallback 获得。
- [ ] owner/provider versioned conformance vector 携带 provenance、适用 target、正负结果和 formal approval，且不含未授权正文/secret。
- [ ] durable store/UoW、codec/cursor、integrity/compatibility、governance/storage/receiver 的实际能力和 probe/reconcile 语义已按 target 核验。
- [ ] formal environment、safe run namespace、权限、secret ref resolution、清理 API 与 cleanup finality 已获 owner 批准。
- [ ] external effect 的 idempotency/correlation、ACK/commit、NotDispatched/MayHaveDispatched 和 late result 语义可判定。
- [ ] restoration 逐 owner receiver schema、material scope、commit/probe/compensation 和 no-direct-write 边界可执行。
- [ ] audit material 的 redaction/coverage/verification/handoff contract 可执行；runtime signal 不替代。
- [ ] formal gate 能将 prerequisite missing 记为 blocked 并非零，不把它写成 skip/pass。

### 6.3 Release evidence 进入准则

- [ ] 选定的 local 与 formal source run 均固定、不可变、可回溯 design/implementation/config source refs。
- [ ] 每个 suite 的 `report.json`、case JSON、stdout/stderr 和 safe artifacts 已按 Step 13 schema 生成；失败输出也保留。
- [ ] 所有 source run 已完成 redaction，且报告生成器只读取列明的 fixed run roots。
- [ ] report generator、evidence index、acceptance handoff 初稿和所有 checks 可运行；不得从静态 mapping 生成 pass。
- [ ] failed/blocked/infrastructure_failed/not_run/passed 分母独立，102 TC 与 required formal lanes 无遗漏。

### 6.4 Local / CI 阶段退出准则

- [ ] 所有 local/negative P0 `TC-AR-*` 断言均通过，且无 skipped/not_run/infra_failed。
- [ ] PR/main/nightly 的适用 local P0 suites 全部通过；失败 suite 的 raw 仍完整可审。
- [ ] 26 objects、18 states、30 logical/32 surfaces、55 keys 与五 Query telemetry 双姿态覆盖分母一致。
- [ ] UoW、CAS/range/negative read-set、fence、same/same、same/different、missing result、commit unknown、partial resume 故障矩阵通过。
- [ ] 五类 VETO 的本地负向、redaction、dependency/outbound absence、report authenticity checks 通过。
- [ ] 无未关闭 S；无未接受且影响 local P0 的 A；缺陷复验均有 failed/fixed run 链。
- [ ] local raw/report/候选证据完整，但报告明确其不能关闭 formal blocker 或证明 readiness。

### 6.5 完整测试退出准则

- [ ] §6.4 local/CI 退出全部满足。
- [ ] 每个 required formal-seam positive lane 均已满足 §6.2 并真实执行；不存在 blocked/skipped/not_run/infra_failed。
- [ ] owner/source、governance、integrity/compatibility、storage/retrieval、durable restart、restore receiver、audit handoff 的正向与负向 conformance 均通过。
- [ ] `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002` 和 `AR-03-LOCAL-001～006` 对影响测试退出的 target 均有 owning-project closure proof；不能用本仓报告代替。
- [ ] 102 TC 全部有真实 case raw；每个 EV family/instance 能回指正式 TC、suite、fixed run raw digest 和 human report。
- [ ] formal/release gates、五类 VETO、redaction/dependency/pairing/no-static/blocked-lane checks 全通过。
- [ ] S=0；影响 P0 的 A=0 或由未来 06 按正式规则裁决，但任何 S/VETO 不可接受。
- [ ] 残余 P1/P2 风险有明确 owner、影响、触发和处理；required P0 不得被移动至 residual。
- [ ] Step 13 报告/证据已归档并可交给正式 06；05 本身不填写 acceptance verdict/signoff/readiness。

### 6.6 数值专项退出规则

| lane | 当前退出要求 | 当前姿态 |
|---|---|---|
| P0 structural resource | positive bounds、L/L+1、progress/partial、Query no-write、无无限 retry 均通过 | planned；未来 local 可执行 |
| P2 measured performance | workload、environment、percentile/window、threshold、owner 均正式后执行 | `blocked/not_run`；不影响 qualitative P0，但禁止性能达标声明 |
| RTO/RPO/capacity | owner/storage/receiver recovery contract + measurement method + threshold | `blocked`；禁止 readiness/DR 声明 |

### 6.7 暂停 / 阻断准则

| 触发 | 当前动作 | 重新进入条件 |
|---|---|---|
| 正式 00～05 发生影响 P0 的 revision | 暂停受影响 suite/report | 回写 owning Step、追溯/TC/EV 后固定新 source ref |
| 对象/字段/state/error/flow 无正式来源 | 停止实现者猜测 | 回写 03/04 与受影响 05 Step |
| formal prerequisite 缺失 | lane=`blocked`、gate 非零 | owning project closure proof + §6.2 全满足 |
| environment/config identity 漂移 | 停止该 run，不混用输出 | 新 fixed run + pinned identity |
| namespace/cleanup 不安全或失败 | 停止后续复用，记录 infrastructure failure | exact cleanup proof / 新隔离环境 |
| MayHaveDispatched 且无 exact probe | 保持 CommitUnknown/ReconcileRequired，不重派 | 正式 probe/reconcile 或人工处置边界 |
| redaction/body/secret 泄漏 | S/VETO，隔离输出，不传播报告 | 修复、清理受影响材料、全量 P0 新 run |
| required raw/report 缺失或静态 pass | evidence exit blocked | 从真实 runner 重新生成 fixed-run raw/report |

### 6.8 VETO 退出门禁

| VETO | 通过条件 | 当前状态 |
|---|---|---|
| V1 跨域写 | owner DB/业务命令/governance truth 写面不存在，restore 只 handoff | not_run |
| V2 状态越级 | local/axis 状态不推导 archived/dissolved/restored/owner commit/global success | not_run |
| V3 缺 basis 成功 | 缺 source/decision/hold/integrity/storage/receiver/schema 均 fail-closed | not_run；positive prerequisites blocked |
| V4 ref/projection/fake 冒真相 | workspace 始终 Auxiliary；ref/body、fake/formal 分类可证明 | not_run；formal positive blocked |
| V5 不可追溯/盲重放 | result/history/effect/raw/report 链完整；Unknown 只 exact probe | not_run；durable/formal blocked |

### 6.9 当前门禁评估

| 门禁 | 当前结果 | 原因 |
|---|---|---|
| Step 12 设计完成 | pass | entry/exit/pause/VETO 均可判定 |
| local execution entry | not_entered | 无目标实现仓、tests/scripts/runner/config/run |
| formal-seam entry | blocked | 12 upstream/architecture + 6 local pending 未关闭 |
| local/full test exit | not_run / blocked | 0 case run、artifact、report、EV；required formal lanes blocked |
| formal 05 装配 | waiting Step 13～14 | execution 不作为设计文档装配的伪前置 |
| acceptance/readiness | not_applicable in 05 | 正式 06 未来裁决；当前禁止声称 |

## 7. 复杂度判断

单一 checklist 会把 local planned、formal blocked 和文档完成混为一体，因此采用五层门禁。完整退出仍严格：required external positives 不可因本地测试完成被删除；与此同时，持续 blocker 不阻止 05 设计文档按授权装配。

## 8. 回填草稿

正式 §12 应保留门禁层级、local/formal/release entry、local/full exit、暂停/VETO 和当前评估。所有未来执行条件以未勾选形式出现；明确正式 05 完成只表示测试设计完成，当前 execution entry 未发生、formal exit blocked、验收/readiness 不属于本文。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；准则只组合已有设计和测试边界 |
| 新 blocker | 无 |
| 持续 blocker/pending | 全部保留，并作为 formal entry/full exit 的显式阻断条件 |
| 待 06 | acceptance verdict、S/A裁决、risk acceptance、signoff 和 readiness |
| 待 07 | tests/scripts/gates/reports/checks 的 phase/boundary 实施；当前未创建 |

## 10. 进入 Step 13 门禁

- [x] local、formal、release evidence 的进入条件分别可判定。
- [x] local exit 与 full exit 分离，required formal lane 未被降级/skip/residual。
- [x] 五类 VETO、S/A、blocked/infra/not_run 和暂停回流明确。
- [x] 当前 design pass 与 execution not_entered/blocked 明确分离。
- [x] 未产生 run、artifact、report、EV、verdict 或 readiness。
- [x] 允许进入 Step 13。
