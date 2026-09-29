# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 5\
> 日期：2026-09-14\
> 状态：`completed / phase_graph_fixed_with_blocked_lanes / continue_authorized`

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 5：设计实施阶段与依赖顺序 |
| 输入 | Step 4；正式 `01/03/05/06` 的依赖、实现、测试与验收边界 |
| 输出 | 八阶段依赖图、阶段总表、逐 Phase 可验证增量、停审与跨 Phase 审计 |
| 阶段轴 | `foundation → admission → query → capture/bundle → assessment → placement/lifecycle → restore → evidence/formal` |
| gate_status | `pass_with_blockers`（允许继续 Step 6；不授权实现、测试、验收或提交） |
| gate_reason | 八个 Phase 均形成可独立验证的功能增量；本地、受控与 formal 证明层分离，18 个 blocker/pending 已绑定阶段而未被降级 |
| next_allowed_action | `create_and_complete_step_06_tasks_commit_boundaries` |

## 2. Step 内计划

- [x] 从 Step 4 的交付面提取最小可验证纵切，而非按对象、crate 或文件拆 Phase。
- [x] 反查 `03` 的 compile graph、30/32 surface、18 states、UoW/effect 与 future handoff。
- [x] 反查 `05` 的 18 CUT、13 suites、5 gates、14 scripts、19 EV 和 `06` 的 AC/VETO。
- [x] 为每个 Phase 固定依赖、输入、输出、不包含、门禁、blocker 与证明上限。
- [x] 对八个 Phase 逐项停审，再审计跨 Phase 顺序、外部依赖和验收覆盖。
- [x] 形成正式 §5 回填草稿并同步 flow/project ledger。

复杂度判断：八个 Phase 和十六个候选 commit boundary 足以表达纵切与高风险分离；详细任务和批次留到 Step 6，不在本 Step 复制对象 schema 或测试正文。

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 最小可测试纵切是什么？ | PH-02 的 C01/C02 admission：typed contract + CP1/CP6 admission subset + local service/UoW/result replay；只证明 Archive 本地受理，不证明 owner authority 或 archived/restored。 | `03` §7.1/§8.2/§10～§12；`05` COMMAND/UOW/IDEMP |
| 哪些阶段必须前置？ | PH-01 先固定仓/依赖/config/证据壳；PH-02 admission/UoW 先于 Query、Job 与 effect；capture/closure 先于 assessment/placement/restore；PH-08 只汇总前序真实运行。 | `03` §4～§16；`05` §4/§9/§13 |
| 哪些风险必须前置？ | target repo/baseline/Core 在 PH-01；codec/store 在 PH-02；cursor/visibility 在 PH-03；owner source 在 PH-04；integrity/schema 在 PH-05；storage/governance 在 PH-06；artifact/receiver 在 PH-07；所有 formal seam 在 PH-08。 | `03` §17；`06` §13.1 |
| 每阶段能验证什么？ | PH-01 验边界壳；PH-02 admission/一致性；PH-03 五 Query zero-write；PH-04 per-source capture + exact closure；PH-05 assessment 分类；PH-06 external-effect 状态分轴；PH-07 per-owner restore；PH-08 raw→report→送验准备。 | 本文件 §7.2/§7.3 |
| 是否按对象裸拆？ | 否。26 objects 是阶段内容，Phase 以对用户/运维可观察的归档或恢复能力纵切命名。 | 实施计划 SOP Step 5 |
| 是否允许并行？ | 默认主链串行。某一 Phase 内 local negative/controlled 批次可与 external closure 准备分别推进，但 blocked positive 不得被并行 fake 取代，且项目级 current boundary 永远唯一。 | 台账规范；Step 3 ledger rules |
| Phase 是否有完整 I/O/门禁？ | 是；§7.2 给出统一总表，§7.3 给出逐 Phase 输入、输出、不包含和验证方式；Step 7 再展开 exact TC/EV/AC/VETO。 | 本文件 §7 |
| 是否前用后置能力？ | 否。前序可以声明后续所需 typed ref/slot，但不能调用后续 service、假定 external finality 或引用尚未生成的 EV 来通过。 | 闭环标准 phase-boundary 条款 |
| 是否逐 Phase 停审？ | 是，当前完成的是设计层停审；未来实施时必须以真实 boundary ledger 和 gate 重做，不继承此处“通过”为实现事实。 | 本文件 §7.4 |
| 跨 Phase 审计是否通过？ | 设计层无 unresolved 顺序冲突；存在明确 blocker，但均精确限制正向实现/证明，不阻止完成计划。 | 本文件 §7.5 |

## 4. 当前材料问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 旧材料倾向先定 provider/存储层级 | 未闭合产品选择会污染早期阶段 | PH-06 只保留 provider-neutral port/effect，positive blocked |
| `03` 六 crate 是技术轴，不是功能阶段 | 按 crate 横拆会产生不可运行半成品 | 每个 Phase 按需要纵跨 contracts/domain/application/infra/api/worker |
| formal seam 大量 blocked | 若删掉会伪造 P0 完整，若全前置会使本地验证无法推进 | requiredness 保留；local/controlled/formal 三层门禁分开 |
| Query 容易被 Bundle/restore 后置能力拖入写路径 | 破坏 no-write 与独立可验证性 | PH-03 只读取 committed fixtures/snapshot；任何 repair/retrieve/probe 均后置且禁止由 Query 触发 |
| scripts/report 易被提前当 evidence | 会制造静态 EV/pass | PH-01 仅目录/接口壳，PH-08 才允许从真实 raw 只读生成；当前均无实例 |
| outbound candidate 易被当自然演进阶段 | `AR-HLD-Q-001` 未关闭时会制造未授权系统 | 不设 outbound Phase；各 Phase 都验证其持续不存在 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施主轴 | 交付面散列在六 role 与六 CP | 八个归档/恢复可验证 Phase | 可绑定独立门禁和回退 |
| 外部 seam | 与本地实现混合 | 每阶段标 local/controlled/formal 上限 | fake 不冒 finality |
| 风险顺序 | blocker 只在总表登记 | 精确绑定最迟开工点和受影响 Phase | 避免临场 workaround |
| evidence | 可误解为最后补报告 | PH-01 固定能力壳，逐阶段留 raw，PH-08 汇总 | 证据与实现同生、结论后置 |
| 并行 | 未定义 | 主链串行；只允许 Phase 内不互相授权的准备工作 | 保持单一 current boundary |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按六 crate 横向实施 | 文件归属直观 | 每阶段无完整行为，测试和事务后置 | 不采用 |
| 按 26 对象逐批实现 | 容易计数 | 破坏 DTO→state→UoW→result 闭环 | 不采用 |
| 将所有 external seam 放 PH-01 | 早发现集成问题 | 18 blocker 会冻结所有本地闭环 | 不采用；只前置 exact blocker 检查 |
| 八个纵切 Phase、每个分 local/formal 证明层 | 能在不伪造外部成功时推进可验证增量 | Step 6/7 需要更精确 boundary 映射 | 采用 |
| 单设 outbound Phase | 看似完整 | 当前 outbound 分母为 0，违反 `AR-HLD-Q-001` | 禁止 |

## 7. 结构化中间产物

### 7.1 阶段依赖图

#### 阶段依赖图：L4-archive 实施阶段顺序

```text
[PH-01 Foundation / runtime / evidence shell]
  | enables typed local work; no business success
  v
[PH-02 Request admission / local consistency]
  | creates committed request/job/result truth
  v
[PH-03 Safe query / visibility / continuation]
  | reads one committed snapshot; zero write/effect
  v
[PH-04 Source capture / Bundle exact closure]
  | produces per-source material facts + immutable manifest basis
  v
[PH-05 Integrity / compatibility assessment]
  | produces target-specific immutable assessments
  v
[PH-06 Placement / retrieval / lifecycle execution]
  | records intent, effect knowledge and exact reconcile
  v
[PH-07 Restore plan / material / owner handoff]
  | isolates per-owner outcome and compensation
  v
[PH-08 Fixed-run evidence / formal seam / acceptance handoff]

Cross-cutting at every phase:
  Query no-write | source authority | no owner DB write | no outbound
  UoW/CAS/fence | redaction | blocked-lane visibility | no fake promotion
```

关键说明：图只表达阶段依赖，不是函数调用链。PH-04～PH-08 的 required formal positive 受对应 owner/provider 合同阻塞；阻塞不允许前序 Phase 借 fake 产生 `Bound/Verified/Committed/restored/readiness`。

### 7.2 阶段总表

| Phase | 可验证实施目标 | 依赖 | 核心交付物 | 主要未来门禁 | 当前姿态 |
|---|---|---|---|---|---|
| PH-01 | 建立目标仓六 role、Core 候选核验、strict runtime/config 与 scripts/raw/report 壳 | 无；target repo/授权前置 | workspace/crate skeleton、runtime builder boundary、12-domain binding shell、14 script interface shell | Build/DEP/CONFIG path checks；`VETO-AR-008/009` absence | blocked by repo/baseline；只可 planned |
| PH-02 | 打通 C01/C02 admission、request/job/stage、reservation/result、UoW/CAS/replay | PH-01 | contracts/domain/application/local store contracts、thin command entry、controlled tests | CONTRACT/OBJECT/STATE/COMMAND/UOW/IDEMP；`AC-AR-CMD-001/002` | local planned；codec/durable/formal authority blocked |
| PH-03 | 暴露 Q01～Q05 safe view、visibility、snapshot/cursor 和严格 zero-write | PH-02 | query/view DTO、read session/store、API query handler、write/effect spy | QUERY/SECURITY/OBSERVE；`AC-AR-QUERY-001～005`、TX-003、VETO-006 | base local planned；cursor/visibility positive blocked |
| PH-04 | 逐 source bind/capture/reconcile，并从 frozen inventory 形成 immutable manifest exact closure | PH-02；PH-03 提供 safe observation | E02、J02～J06、CP2/CP3、authority matrix、closure findings | AUTHORITY/JOB/CONSUMER/UOW/STATE；FUNC-002/003 | local negative/closure planned；owner positive blocked |
| PH-05 | 对 exact Bundle/target 形成 immutable integrity/compatibility assessment | PH-04 | Q03 read surface binding、J07/J08、CP4、typed Unknown/Unsupported/IntegrityFailed | OBJECT/STATE/JOB/QUERY；FUNC-004、STATE-007 | controlled negative planned；formal algorithm/schema blocked |
| PH-06 | 以 intent-before-effect 实现 placement/retrieval/lifecycle 与 exact probe/reconcile | PH-05 | C03、E03/E04、J09～J12、CP5、effect history | COMMAND/CONSUMER/JOB/EFFECT/UOW/IDEMP；FUNC-005 | local orchestration planned；storage/governance positive blocked |
| PH-07 | 冻结 owner set，形成 restore plan/material/handoff/outcome/compensation | PH-05/06 | E05、J13～J17、CP6、per-owner receiver/effect record | RESTORE/AUTHORITY/EFFECT/JOB/STATE；FUNC-007～009 | local negative planned；artifact/receiver positive blocked |
| PH-08 | 在所有 required seam 可核验后执行 fixed run、只读生成报告并形成待审 handoff | PH-01～07 + all formal prerequisites | 13 suites、5 gates、14 scripts capability、19 EV instances 与 acceptance drafts（未来） | 全 102 TC、19 EV、10 VETO、release/formal gate、具名 review | 当前 blocked；不得生成实例或 verdict |

### 7.3 逐 Phase 可验证增量

| Phase | 功能增量 | 输入 | 输出 | 明确不包含 | 验证/证明上限 |
|---|---|---|---|---|---|
| PH-01 | 从 absent 到可审查的编译/装配/证据边界 | `03` §3～§4/§13～§15；`04`；Step 3 | future manifest、六 crate、strict builder、script CLI/path shells | 业务 DTO/state、真实 provider、run/report/evidence | 静态/build/config/依赖检查；不证明功能 |
| PH-02 | 两类请求的本地受理和完整 replay | C01/C02 contracts；CP1/CP6 admission subset；UoW | request/job/stage/result/reservation local vertical slices | source capture、receiver resolve/material、archived/restored | controlled local tests；formal authority/durable restart 仍 blocked |
| PH-03 | 五类 committed snapshot 安全查询 | PH-02 committed fixture；visibility/cursor contract | five Query views/handlers、NotAvailable/degraded/continuation | refresh/repair/capture/retrieve/probe/cache/audit write | telemetry 双姿态 zero-write；formal visibility/cursor 受 pending 限制 |
| PH-04 | 八 source 独立采集与 manifest exact-set 闭包 | declared scope、owner binding/material、PH-02 UoW | per-source binding/attempt/coverage/finding、manifest revision/closure | integrity success、placement、owner/project state | negative/controlled + local closure；完整 capture formal blocked |
| PH-05 | fixed target assessment 且失败姿态保真 | exact Bundle revision/closure、capability/schema target | verification/compatibility assessment/finding | 自动 migrate、私造 digest/signature/key、覆盖旧 assessment | local classification；Verified/formal compatibility blocked |
| PH-06 | external action 知识与业务状态分轴 | verified/supported basis、storage/governance decision/hold | placement/retrieval/lifecycle intents/outcomes/reconcile history | retention/delete 决策、ACK=commit、blind redispatch、Sealed=archived | call order/fault local；external finality blocked |
| PH-07 | owner-specific restore 编排与补偿 | exact Bundle/assessment/retrieval、frozen owner/receiver/material authority | plan/item/material/handoff/outcome/compensation | direct owner DB、跨 owner Tx、item success=restored | negative/isolation local；receiver/material positive blocked |
| PH-08 | 同 run raw→report→EV→acceptance package | 实际 immutable baseline、all required seams、PH-01～07 code | future qualified raw/reports/EV/reviewed drafts | 新业务功能、静态 pass、跨 run 拼接、risk/signoff/readiness 自批 | 只有真实 formal/release gate 可证明；当前 zero instances |

### 7.4 Phase 设计停审记录

| Phase | 审查项 | 设计层结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | 是否只建立边界且不伪装实现存在 | pass_with_blockers | target repo、baseline、Core exports 未核验；保持 planned/blocked |
| PH-02 | 是否形成独立 admission/UoW 增量且不解析 external receiver | pass_with_blockers | operation codec/durable UoW/formal authority 未闭合 |
| PH-03 | 五 Query 是否可独立验证且绝不写/repair | pass_with_blockers | cursor mapping/visibility binding 未闭合；不可跨 snapshot 降级 |
| PH-04 | source 与 manifest 是否同一可验证 capture→closure 增量且 per-source 隔离 | pass_with_blockers | owner/export/material formal contracts 未闭合；workspace 固定 Auxiliary |
| PH-05 | assessment 是否固定 input/target 且不由 ref/fake 造成功 | pass_with_blockers | algorithm/key/schema authority 未闭合 |
| PH-06 | effect 是否 intent-first、ACK/commit/unknown 分离且不产生治理决定 | pass_with_blockers | storage/governance/probe formal seams 未闭合 |
| PH-07 | restore 是否按 owner/item 隔离并只 handoff | pass_with_blockers | Artifact material、receiver/outcome/compensation contracts 未闭合 |
| PH-08 | 是否只汇总真实 fixed-run evidence 而不新增功能/裁决 | correctly_blocked | all required seam、实现、run、review 均不存在；不得静态生成 |

以上 `pass_with_blockers` 只表示 Phase 设计边界可进入 Step 6，不表示相应代码、测试或 external positive 可以开始。实施期每一项必须重新停审。

### 7.5 跨 Phase 依赖闭环审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 顺序由功能依赖而非文件驱动 | 通过 | foundation→local truth→safe read→capture/closure→assessment→effect→restore→evidence |
| 当前 Phase 是否依赖后续实现才能测试 | 通过 | 使用 controlled fixture/port 只证明 local；后续 success 不作为前序 pass 条件 |
| admission 与 effect 分离 | 通过 | C01/C02/C03 均先只提交本地 intent/result；external dispatch 后置相应 Job |
| source-authority totality | 通过但 formal blocked | 八类逐 target；workspace Auxiliary；ref/material/owner truth 不互补 |
| Query no-write | 通过 | PH-03 建立，PH-04～07 新增 truth 后持续回归；不触发后置功能 |
| external effect/finality | 通过但 formal blocked | PH-06/07 精确 probe/reconcile；fake/ACK 不产生 commit/success |
| outbound absence | 通过 | 所有 Phase 均无 outbox/topic/publisher/delivery；若解锁须回开 02～07 |
| blocker 是否前置到最迟开工点 | 通过 | 18 项均映射 PH-01～08；Step 9 再固定 spike/owner/deadline |
| 测试/验收是否阶段嵌入 | 通过 | 每 Phase 有 CUT/AC/VETO 入口；Step 7 展开 exact mapping |
| evidence 是否可静态伪造 | 通过 | PH-08 只读真实 raw；当前 zero instance/correctly blocked |
| 并行是否破坏单一 current boundary | 通过 | 默认串行；准备工作不授权另一个 boundary 或 external success |
| Phase 数量与 Step 3 boundary 阅读矩阵 | 通过 | 8 Phase、16 candidate boundaries 一致；Step 6 固定最终 boundary IDs |

## 8. 回填草稿

正式 `07` §5 应保留：八阶段 ASCII 依赖图、阶段总表和统一推进规则；明确每阶段是纵跨技术 role 的可验证归档/恢复能力，而非 crate/object 清单；local/controlled/formal proof 分层；PH-08 只汇总真实 raw；18 blocker/pending 精确阻止相应 positive lane；Query no-write、workspace Auxiliary、owner-only truth、intent-before-effect、per-owner restore、no outbound 和 no-static-evidence 是全阶段红线。

## 9. 待确认事项、上游影响与事实边界

| 事项 | owner / 影响 | 截止点 | 当前姿态 |
|---|---|---|---|
| 16 个 commit boundary 的批次、scope、gate | Step 6 | Step 6 完成前 | 下一步展开 |
| exact TC/EV/AC/VETO 分配 | Step 7 | 每 boundary 提交前 | 尚未执行，仅有设计来源 |
| 18 blocker/pending | 对应 owning project / local owner | 对应 Phase 激活前 | 全部 open；不得 workaround |
| target repo / immutable baseline | 用户与 implementation owner | PH-01 Design Gate | absent/pending |

本 Step 未发现新增 owning-project blocker；没有修改上游正式文档，没有创建实现仓、代码、测试、run、report、evidence 或 commit。

## 10. 自检与进入下一步条件

- [x] 阶段依赖图和阶段总表完整。
- [x] 八个 Phase 均有功能增量、输入、输出、不包含、测试/验收门禁和证明上限。
- [x] 每个 Phase 已完成设计层停审，blocked lane 未伪装为 pass。
- [x] 跨 Phase 顺序、风险前置、external dependency、验收覆盖和越界风险无 unresolved 设计冲突。
- [x] 未按对象/文件裸拆，未新增 outbound/provider/owner truth 或实现事实。
- [x] 连续授权允许 Step 6；implementation/test/acceptance/commit 仍禁止。

`gate_status = pass_with_blockers`; `next_allowed_action = create_and_complete_step_06_tasks_commit_boundaries`。
