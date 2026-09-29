# Step 5. 定义功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 5\
> 正式回填：`06-验收标准.md` §5\
> 日期：2026-09-13\
> 状态：`completed / nine_p0_function_ac_closed_formal_positive_lanes_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 5：定义功能验收门禁 |
| 目标 | 将 `F-AR-001～009` / A1～A9 逐项转成可判定、可追溯且不越权的 P0 功能 AC |
| gate_status | `completed / nine_p0_function_ac_closed_formal_positive_lanes_blocked` |
| gate_reason | 9/9 功能均有正式设计、exact TC、EV family、固定 report path、通过/失败条件和裁决影响；required formal positive lane 未被 fake 或局部结果替代 |
| next_allowed_action | 按连续授权创建并完成 Step 6 |
| source_files | 正式 00 §7/9/14；03 §5～12；05 §5～6/12～14；05 Step 5/6/13；Step 1～4；L1-governance Step 5 粒度样本 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 5A | 九项功能 AC registry | done | `F-AR-001～009` 各一稳定 AC |
| 5B | AC→设计→TC→EV→report 闭环 | done | 无泛化“见测试报告” |
| 5C | 逐项停审 | done | 9/9 来源、条件、phase 与 evidence 固定 |
| 5D | P1/P2 后置边界 | done | 不污染 P0、不关闭 blocker |
| 5E | 跨功能裁决审计 | done | 无孤儿、冲突、跨 run 或局部成功越级 |

## 2. 本步输入与裁决前提

功能 AC 裁决的是固定送验交付在真实 formal seam 下是否实现对应能力，而不是判断文档是否写完。每个 AC 的真实通过至少要求：一个 primary fixed `<run_id>`、所列 exact TC 全部为合格 P0 结果、相应 EV instance 可回指同 run raw/suite/report、所影响的 formal prerequisite 已有 owning-project closure proof，并且没有 VETO 或 S 级缺陷。

`blocked`、`infrastructure_failed`、`not_run` 均不是功能通过。local/fake negative 可证明 fail-closed 分支，却不能证明 owner export、integrity、storage commit、governance authority 或 receiver commit 的正向成立。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能的通过条件是什么？ | 见 §7.1；九项分别以受理、采集、闭包、评估、存储/生命周期、只读查询、恢复计划、材料交接、结果/补偿的正式不变量判定。 |
| 每个 P0 功能的失败条件是什么？ | 任一必需输入/状态/历史/外部 finality 缺失或错误、required TC 非 passed、EV 不合格、formal lane blocked，均使对应 AC 不通过或不可形成通过；命中红线则由 Step 11 VETO。 |
| 证据来自哪里？ | 只接受正式 05 的 exact TC、19 个 `EV-AR-*` family 的真实 instance、`reports/runs/<run_id>/evidence-index.md` 及对应 suite/EV page 回指的 raw。 |
| 哪些 P1 只做后置边界验收？ | 具名 provider/storage/KMS/SDK/product 组合验证；只有 release 明确纳入且有独立 run 时才裁决，不能覆盖 P0 formal seam。 |
| 哪些功能失败导致总体不通过？ | 九项全部为 P0；任何一项真实 failed，或完整验收时仍 blocked/not_run/infra-failed，最终不得为“通过”或“有条件通过”。 |
| 能否回指设计、TC、EV 与 report？ | 可以，见 §7.2；所有引用均是正式 03/05 名称与 fixed-run 路径。 |
| 是否逐项停审？ | 是，见 §7.4；9/9 完成小循环，不填写实际 pass/fail。 |
| 跨功能是否有缺口或冲突？ | 无设计层 unresolved 冲突；真实正向证明仍被持续 blocker 阻塞，作为 required lane 保留。 |

## 4. Historical material 诊断

| 历史口径 | 问题 | 当前处置 |
|---|---|---|
| `ArchivedSnapshot`、`ArchiveIndex`、timeline/RCA | 已不属于正式 A1～A9 / 六 CP | 不建立 alias，不进入 AC |
| “包生成成功即归档成功” | 混淆 `Sealed`、storage commit 与 project state | 分别由 AC 003～005 判定，禁止全局成功传播 |
| restore ticket/export 即恢复 | 缺少 plan/item/material/handoff/outcome/compensation | 由 AC 007～009 分层判定 |
| API 返回、ACK、日志或 fake 即成功 | 不能证明 local commit 或 external finality | 只接受 fixed-run raw→EV→report 闭环 |
| 固定六域、provider、期限和数值 | 无正式 authority | 不进入功能通过条件；保留 blocker/P1/P2 |

## 5. 改动前后对比

| 项 | 旧 06 | 当前 Step | 原因 |
|---|---|---|---|
| 功能主轴 | snapshot/index/restore ticket | `F-AR-001～009` / A1～A9 | 对齐正式 00 |
| 功能成功 | 泛化“可归档/可恢复” | 每一能力独立的 local truth、external finality 与保守聚合 | 防状态越级 |
| 证据 | API/DB/log | exact TC + EV + same-run report/raw | 可复验、不可静态造证据 |
| 外部缺口 | 可跳过或人工确认 | P0 required `blocked` | 不降级真实价值链 |
| P1/P2 | 混入主线 | selected combination / measured future | 不以产品或数值替代 P0 |

## 6. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| AC 粒度 | 九个 F 各一稳定 P0 AC | 按 26 对象或 30 入口重复建立功能 AC | 以用户价值为功能主轴，对象/协议在 Step 6～8 加严 |
| formal positive 缺失 | AC 保持 P0 且 blocked | local negative/fake 通过后判 AC passed | fake 不证明 authority/finality |
| 一项 partial 是否整体失败 | 对该 AC 不得通过；保留逐 source/item 事实 | 用局部成功平均或覆盖失败 | Archive 必须保守聚合 |
| 证据复用 | 允许 EV family 被多个 AC 引用，但每个 AC 需 exact TC 子集 | 一条 smoke 泛化全部功能 | 避免 evidence 复用变成覆盖偷换 |
| VETO | 功能失败先形成 AC 失败；红线命中由 Step 11 独立否决 | 在本 Step 提前编号 VETO | 保持 Step 独立性 |

## 7. 结构化中间产物

### 7.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---:|---|---|---|
| `AC-AR-FUNC-001` | `F-AR-001` 归档请求受理与范围解释 | P0 | checked scope、authority 与 operation identity 固定；request/job/initial stage/stored result 同 UoW；same/same 完整重放、same/different Conflict；`Accepted` 仅表示本地受理 | scope/authority 不可解释仍 Accepted；半提交、丢 result、冲突覆盖原记录、local commit unknown 时重跑，或推导 project archived | `TC-AR-COMMAND-001～002`,`TC-AR-OBJECT-001`,`TC-AR-STATE-001～003`,`TC-AR-UOW-001/003`,`TC-AR-IDEMP-001～003`; `EV-AR-COMMAND-001`,`EV-AR-OBJECT-001`,`EV-AR-STATE-001`,`EV-AR-UOW-001`,`EV-AR-IDEMP-001` |
| `AC-AR-FUNC-002` | `F-AR-002` 逐源快照/导出/引用采集 | P0 | 八类 source 各有 formal authority、requiredness、owner-specific version/fence/coverage/provenance；exact attempt feedback 才 settle；partial/stale/missing/conflicting 保真，workspace 永为 Auxiliary | 用统一 schema/跨 owner version 比较；缺 authority/contract/fence/coverage 仍 Bound/Captured；Auxiliary/ref/summary 补 canonical；unknown 盲 recapture | `TC-AR-AUTHORITY-001～004`,`TC-AR-CONSUMER-002`,`TC-AR-JOB-002～004`,`TC-AR-OBJECT-002`,`TC-AR-STATE-004～005`; `EV-AR-AUTHORITY-001`,`EV-AR-CONSUMER-001`,`EV-AR-JOB-001`,`EV-AR-OBJECT-001`,`EV-AR-STATE-001` |
| `AC-AR-FUNC-003` | `F-AR-003` Manifest 与包内容闭包 | P0 | frozen declared/actual inventory、immutable manifest revision、exact difference/finding 与 range/negative read-set 一致；只有 Complete + exact assessment/placement basis 才可 `ClosureReady/Sealed` | missing/extra/phantom/race 被隐藏；旧 revision 或 incomplete/overfull 被 seal；Sealed 推导 archived/approved/owner committed | `TC-AR-OBJECT-003`,`TC-AR-STATE-006`,`TC-AR-JOB-005～006`,`TC-AR-UOW-002`; `EV-AR-OBJECT-001`,`EV-AR-STATE-001`,`EV-AR-JOB-001`,`EV-AR-UOW-001` |
| `AC-AR-FUNC-004` | `F-AR-004` 完整性与版本兼容评估 | P0 | exact Bundle revision/input/capability/target 的 immutable assessment 独立记录；`Verified`,`IntegrityFailed`,`Unknown`,`Blocked` 与 target-specific supported/unsupported/unknown 保真；重验新建 assessment | 仅凭 ref/config/fake 生成 Verified；复用其他 target 结论；Unknown/Unsupported/IntegrityFailed 压成成功；自动迁移或覆盖失败历史 | `TC-AR-OBJECT-004`,`TC-AR-STATE-007`,`TC-AR-QUERY-003`,`TC-AR-JOB-007～008`; `EV-AR-OBJECT-001`,`EV-AR-STATE-001`,`EV-AR-QUERY-001`,`EV-AR-JOB-001` |
| `AC-AR-FUNC-005` | `F-AR-005` 存储位置与生命周期执行记录 | P0 | placement、retrieval、lifecycle、external action 各轴独立；intent 先持久化、外部调用在 Tx 外、typed outcome 后提交；current decision/hold 重核；ACK、commit、retrievable、compensated 分离，unknown exact probe | 无 decision/hold/delete authority 仍派发；ACK/timeout 当 Committed；placement 推导 retrievable；NotFound 当无 effect 后盲重派；Archive 自定 retention/purge | `TC-AR-COMMAND-005～006`,`TC-AR-CONSUMER-003～004`,`TC-AR-JOB-009～012`,`TC-AR-OBJECT-005`,`TC-AR-STATE-008～011`,`TC-AR-EFFECT-001～004`; `EV-AR-COMMAND-001`,`EV-AR-CONSUMER-001`,`EV-AR-JOB-001`,`EV-AR-OBJECT-001`,`EV-AR-STATE-001`,`EV-AR-EFFECT-001` |
| `AC-AR-FUNC-006` | `F-AR-006` 归档材料只读查询与验证 | P0 | Q01～Q05 在 current visibility 和单 committed snapshot 下返回 safe `Visible/NotAvailable/Partial/Stale/Blocked/Unknown` surface；public/private cursor 隔离；telemetry on/off 均 durable/external write=0 | Query 触发 assembly/assessment/retrieve/material/probe/repair；混 snapshot；撤权后复活旧 body；泄漏 private cursor/raw body；任一 durable write 或外部 effect | `TC-AR-QUERY-001～005`,`TC-AR-CONTRACT-004`,`TC-AR-SECURITY-002`,`TC-AR-OBSERVE-001`; `EV-AR-QUERY-001`,`EV-AR-CONTRACT-001`,`EV-AR-SECURITY-001`,`EV-AR-OBSERVE-001` |
| `AC-AR-FUNC-007` | `F-AR-007` 恢复申请校验与计划形成 | P0 | request 固定 exact Bundle revision、非空唯一 owner set、authority 与 compatibility/eligibility；plan revision/item set immutable；逐 owner receiver mapping 独立，缺一项保守聚合且无跨 owner Tx | stale/missing/integrity-failed/unsupported 仍 Accepted/Ready；owner set 缺漏/重复；一 owner ready 覆盖 blocked；admission 解析 receiver 或授予写权；mapping drift 原地改 plan | `TC-AR-COMMAND-003～004`,`TC-AR-JOB-013`,`TC-AR-RESTORE-001/003`,`TC-AR-OBJECT-006`,`TC-AR-STATE-012`; `EV-AR-COMMAND-001`,`EV-AR-JOB-001`,`EV-AR-RESTORE-001`,`EV-AR-OBJECT-001`,`EV-AR-STATE-001` |
| `AC-AR-FUNC-008` | `F-AR-008` Owner-specific 材料生成与交接 | P0 | 只为 exact eligible item 生成 owner-approved minimum material/ref；dispatch-time receiver exact match；handoff intent-before-effect；逐 owner typed outcome；Archive 对 owner DB/import internal 零访问 | partial/stale/missing/unsupported/integrity-failed/retrieval unknown 仍 MaterialReady；Bundle 被当写权；mapping drift 仍派发；ACK 当 receiver commit；直接写上游 | `TC-AR-JOB-014～016`,`TC-AR-CONSUMER-005`,`TC-AR-RESTORE-002～004`,`TC-AR-AUTHORITY-005`,`TC-AR-STATE-013～014`; `EV-AR-JOB-001`,`EV-AR-CONSUMER-001`,`EV-AR-RESTORE-001`,`EV-AR-AUTHORITY-001`,`EV-AR-STATE-001` |
| `AC-AR-FUNC-009` | `F-AR-009` 结果记录、重试与补偿编排 | P0 | accepted/rejected/partial/conflicting/commit-unknown/compensation-required 按 owner/item 独立 append；same/same 完整 replay；partial resume 只处理显式未决集合；unknown 用 original key/input exact probe；补偿需正式 authority 且不改原 outcome | 一项结果广播；result/history/effect correlation 缺失仍 complete；blind retry；补偿覆盖原失败或改 owner truth；Succeeded/HandoffComplete 推导 restored | `TC-AR-JOB-016～017`,`TC-AR-RESTORE-004～005`,`TC-AR-IDEMP-001～004`,`TC-AR-EFFECT-002～004`,`TC-AR-STATE-012～016`; `EV-AR-JOB-001`,`EV-AR-RESTORE-001`,`EV-AR-IDEMP-001`,`EV-AR-EFFECT-001`,`EV-AR-STATE-001` |

### 7.2 功能验收闭环矩阵

统一 report 入口为 `reports/runs/<run_id>/evidence-index.md`；下表列出必须同时存在的专项可读报告。每个 EV page 位于 `reports/runs/<run_id>/evidence/<EV-ID>.md`，并回指同 run raw。

| 验收项 ID | 设计契约 | exact TC 主范围 | 正式 EV | 专项 report path | 裁决影响 |
|---|---|---|---|---|---|
| `AC-AR-FUNC-001` | 03 §7.1 C01、§8.2、§9、§10/12 | COMMAND-001～002；OBJECT-001；STATE-001～003；UOW-001/003；IDEMP-001～003 | COMMAND/OBJECT/STATE/UOW/IDEMP | `reports/runs/<run_id>/suites/archive-service-flow.md`; `.../archive-consistency-replay.md` | failed/blocked/not-run 均不得通过；越级状态可能 VETO |
| `AC-AR-FUNC-002` | 03 §7.3 E02、§7.4 J02～J04、§7.5 | AUTHORITY-001～004；CONSUMER-002；JOB-002～004；OBJECT-002；STATE-004～005 | AUTHORITY/CONSUMER/JOB/OBJECT/STATE | `reports/runs/<run_id>/suites/archive-authority-restore-negative.md`; `.../archive-formal-seam.md` | formal owner positive 未通过则 AC blocked |
| `AC-AR-FUNC-003` | 03 §7.4 J05/J06、§9/10 | OBJECT-003；STATE-006；JOB-005～006；UOW-002 | OBJECT/STATE/JOB/UOW | `reports/runs/<run_id>/suites/archive-contract-domain.md`; `.../archive-consistency-replay.md` | 任一 exact-set/seal 失败不得通过 |
| `AC-AR-FUNC-004` | 03 §7.2 Q03、§7.4 J07/J08、§9 | OBJECT-004；STATE-007；QUERY-003；JOB-007～008 | OBJECT/STATE/QUERY/JOB | `reports/runs/<run_id>/suites/archive-service-flow.md`; `.../archive-formal-seam.md` | integrity/schema formal positive 未通过则 blocked |
| `AC-AR-FUNC-005` | 03 C03/E03/E04/J09～J12、§9～12 | COMMAND-005～006；CONSUMER-003～004；JOB-009～012；OBJECT-005；STATE-008～011；EFFECT-001～004 | COMMAND/CONSUMER/JOB/OBJECT/STATE/EFFECT | `reports/runs/<run_id>/suites/archive-consistency-replay.md`; `.../archive-formal-seam.md` | governance/storage positive 未通过则 blocked；fail-open 可能 VETO |
| `AC-AR-FUNC-006` | 03 §7.2 Q01～Q05、§8.3、§14 | QUERY-001～005；CONTRACT-004；SECURITY-002；OBSERVE-001 | QUERY/CONTRACT/SECURITY/OBSERVE | `reports/runs/<run_id>/suites/archive-service-flow.md`; `.../archive-security-observe.md` | 任一 Query 写或泄漏即失败，可能 VETO |
| `AC-AR-FUNC-007` | 03 C02/J13、§9/10 | COMMAND-003～004；JOB-013；RESTORE-001/003；OBJECT-006；STATE-012 | COMMAND/JOB/RESTORE/OBJECT/STATE | `reports/runs/<run_id>/suites/archive-authority-restore-negative.md`; `.../archive-formal-seam.md` | receiver/authority positive 未通过则 blocked |
| `AC-AR-FUNC-008` | 03 E05/J14～J16、§7.5/§10 | JOB-014～016；CONSUMER-005；RESTORE-002～004；AUTHORITY-005；STATE-013～014 | JOB/CONSUMER/RESTORE/AUTHORITY/STATE | `reports/runs/<run_id>/suites/archive-authority-restore-negative.md`; `.../archive-formal-seam.md` | direct write/假 finality 触发 VETO；formal positive blocked 时不得通过 |
| `AC-AR-FUNC-009` | 03 J16/J17、§9～12 | JOB-016～017；RESTORE-004～005；IDEMP-001～004；EFFECT-002～004；STATE-012～016 | JOB/RESTORE/IDEMP/EFFECT/STATE | `reports/runs/<run_id>/suites/archive-consistency-replay.md`; `.../archive-formal-seam.md` | 盲重放/断链可能 VETO；补偿/receiver positive blocked 时不得通过 |

### 7.3 P1 / P2 功能后置边界

| 项 | 当前优先级 | 允许的未来裁决 | 不得做的替代 |
|---|---:|---|---|
| selected storage/integrity/KMS/compression provider | P1 | 具名 target/version/config/vector 的独立 conformance run | 不替代抽象 formal seam、commit/probe 或安全 P0 |
| selected SDK/client/product consumer | P1 | 只读契约兼容与错误 surface | 不引入 Archive→SDK compile，不作为 owner write 权 |
| product UI / operator workflow | P1/future | 需求正式纳入后单独 AC | 不用 UI smoke 代替九项功能证据 |
| latency/throughput/capacity/RTO/RPO/long-run/cross-region | P2 | authority、workload、method、threshold、owner 固定后 measured run | 不以样本数字或未执行项支撑通过/readiness |

### 7.4 功能验收项停审记录

| 验收项 ID | 正式来源与名称 | 条件可判定 | TC/EV/report 固定 | phase / 外部缺口 | 停审结论 |
|---|---|---|---|---|---|
| `AC-AR-FUNC-001` | `F-AR-001`、C01、正式状态/UoW | 是 | 是 | authority positive retained | 通过设计停审；实际未裁决 |
| `AC-AR-FUNC-002` | `F-AR-002`、E02/J02～J04、8 source | 是 | 是 | `AR-UP-001/006～008` blocked | 通过设计停审；required lane 保留 |
| `AC-AR-FUNC-003` | `F-AR-003`、J05/J06、exact set | 是 | 是 | source positive blocked | 通过设计停审；无局部 seal 越级 |
| `AC-AR-FUNC-004` | `F-AR-004`、Q03/J07/J08 | 是 | 是 | `AR-UP-004` blocked | 通过设计停审；无假 Verified |
| `AC-AR-FUNC-005` | `F-AR-005`、C03/E03/E04/J09～J12 | 是 | 是 | `AR-UP-003/005` blocked | 通过设计停审；ACK≠commit |
| `AC-AR-FUNC-006` | `F-AR-006`、Q01～Q05 | 是 | 是 | cursor/durable proof pending | 通过设计停审；Query strict no-write |
| `AC-AR-FUNC-007` | `F-AR-007`、C02/J13 | 是 | 是 | `AR-UP-004/006/009` blocked | 通过设计停审；不授予写权 |
| `AC-AR-FUNC-008` | `F-AR-008`、E05/J14～J16 | 是 | 是 | `AR-UP-006/009` blocked | 通过设计停审；per-owner boundary |
| `AC-AR-FUNC-009` | `F-AR-009`、J16/J17、reconcile | 是 | 是 | `AR-UP-009`/durable pending | 通过设计停审；不盲重放 |

### 7.5 跨功能门禁裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 功能缺门禁 / 孤儿功能 AC | 无；`F-AR-001～009` = 9/9 AC | 无 |
| 设计名称漂移 | 无；仅用正式对象、C/Q/E/J 与状态 | historical 主语全部排除 |
| exact TC / EV 孤儿 | 功能相关 family 均有映射；其余横切 TC/EV 留 Step 6～10 | Step 15 再做 102/19 总审计 |
| 单一 smoke 泛化 | 未采用 | 每项有 exact TC 子集与专项 suite |
| evidence 重复冲突 | EV family 可复用，但必须按 AC exact `tc_refs` 展开 | 禁止一份泛化 EV page 宣称所有 AC |
| required lane 被降级 | 无 | 18 项 blocker/pending 均保留，不可 N/A/skip |
| P1/P2 污染 P0 | 无 | selected/measured 只后置，不替代 P0 |
| 状态/phase 越级 | 无 | admission、seal、assessment、handoff、compensation 各轴独立 |
| 跨 run 拼接 | 禁止 | primary run + 显式 supplemental 规则留 Step 10/14 |
| 裁决影响冲突 | 无 | 任一 P0 failed/blocked/not-run 均不能形成通过；VETO 另由 Step 11 |

## 8. 回填草稿

正式 §5 应回填 §7.1 功能门禁表，并保留闭环矩阵的设计/TC/EV/report/裁决信息。正文须声明九项全部 P0、formal positive required、local/fake negative 不能形成 AC 通过，且当前没有实际结果。P1/P2 只作为后置组合/测量，不得用来关闭 P0 blocker。

## 9. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00/03/05 回写 | 无；九项需求、协议、TC 与 EV 名称一致 |
| 新 blocker | 无 |
| 持续 blocker | 12 upstream/architecture + 6 local pending 全部保留；分别阻断相关 formal positive AC |
| 后续加严 | Step 6 所有权红线；Step 7 协议/依赖；Step 8 状态/UoW；Step 10 EV；Step 11 VETO |

## 10. 进入 Step 6 条件

- [x] 九个 P0 功能各有唯一稳定 AC。
- [x] 每项有通过、失败、设计、exact TC、EV、report path 与裁决影响。
- [x] 9/9 验收项完成设计停审，未伪造实际结论。
- [x] 跨功能审计无 unresolved 冲突。
- [x] formal blocked lane 未删除、降级、skip 或由 fake 替代。

当前 `gate_status`：`completed / nine_p0_function_ac_closed_formal_positive_lanes_blocked`。

`next_allowed_action`：按连续授权创建并完成 Step 6。
