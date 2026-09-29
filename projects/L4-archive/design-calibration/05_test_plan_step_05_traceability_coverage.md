# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 正式回填：`05-测试方案.md` §5
> 日期：2026-09-13
> 状态：`completed / pass_with_blocked_positive_lanes / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 建立 F/BR/NFR/VETO、设计契约、18 个 CUT、TC 候选与 evidence 槽位之间的双向追溯 |
| 输入 | 正式 00 §9～16、正式 01～04、Step 3～4 |
| gate_status | `completed / pass_with_blocked_positive_lanes` |
| gate_reason | P0 需求、规则、VETO 与 CUT 无静默空洞；受外部合同阻塞的正向 lane 均显式保留 |
| next_allowed_action | 创建并完成 Step 6 |
| source_files | 正式 00～04；03 Step 08/10/16；04 Step 12/14；05 Step 1～4 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 建立需求正向矩阵 | §6.1～6.3 | done | 9 F、12 BR、NFR、5 VETO 均有 CUT/TC/EV 槽位 |
| 建立 CUT 反向矩阵 | §6.4 | done | 18/18 CUT 有需求或设计风险来源 |
| 登记 blocker 覆盖 | §6.5 | done | 每项具备 blocked positive、negative、证明上限、exit/VETO |
| 逐项停审 | §6.6 | done | 设计依据、自动化、证据槽位和状态可判定 |
| 跨矩阵审计 | §6.7 | done | 无孤儿、重复 ID、静态造证据或 phase 越界 |
| 回填与影响判断 | §7～10 | done | 不提前生成正式证据或 06 AC 编号 |

## 2. 本步输入与覆盖状态语义

| 输入 | 本 Step 使用 |
|---|---|
| `00-需求文档.md` §9～14/16 | `F-AR-001～009`、`BR-AR-001～012`、八类 NFR、五类 VETO 方向 |
| `01-架构设计.md` §4/8～15 | truth owner、source authority、依赖分类、真实接缝 blocker |
| `02-概要设计.md` §5～10 | CP、对象、协议、flow、state 与 error 的结构来源 |
| `03-详细设计.md` §5～15 | 26 对象、30/32 入口、18 状态、UoW、幂等、错误、配置、观测和最小切口 |
| `04-配置设计.md` §7～14 | 12 配置域、55 P0 key、strict load、assembly、fail-closed 与下游门禁 |
| Step 3 / Step 4 | 18 个 CUT 与六层验证位置 |

覆盖状态使用两轴，不把设计覆盖误写成执行事实：

| 设计覆盖状态 | 含义 | 允许的执行状态 |
|---|---|---|
| `planned` | 已有 CUT、TC 候选和 evidence 槽位，可进入用例设计 | `not_run` |
| `blocked-positive` | 正向验证所需正式合同/环境未闭合；负向 fail-closed 仍已规划 | `blocked`；负向未来可单独执行 |
| `pending-06` | 测试证据槽位已预留，正式 AC/VETO 编号留 06 | `not_run` |
| `not-covered` | 无可执行承接 | 本 Step 不允许静默存在，必须进入风险 |

`TC-AR-<FAMILY>-*` 和 `EV-CAND-AR-<FAMILY>-*` 在本 Step 只是稳定候选族，不是已创建测试或真实证据。Step 6 固定 TC 明细；Step 13 才固定证据 ID、artifact/report schema 和真实性约束。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 需求对应哪些设计章节？ | 见 §6.1；每个 F-AR 回指 03 的对象、协议、flow、状态/UoW，并按需承接 04 配置门禁。 |
| 每个 P0 需求至少有哪些场景？ | 正向主线、关键拒绝/阻断、unknown/partial、重复/冲突与所有权负向；外部正向在合同缺失时标为 blocked-positive。 |
| 哪些场景必须自动化？ | 所有本地 P0 contract/domain/service/entry/negative/static 场景必须自动化；真实接缝在解阻后自动或受控执行，不能以人工口头确认替代。 |
| evidence 如何编号？ | 当前使用 `EV-CAND-AR-*` 候选槽位；Step 13 收敛为 planned `EV-AR-*`，真实实例必须绑定固定 run、suite、artifact digest。 |
| 哪些需求暂未覆盖？ | 无静默未覆盖；外部 source/governance/integrity/storage/receiver/durable/NFR 正向均是 required-but-blocked。 |
| 每个 CUT 是否有来源？ | 是，18/18 均回指 F/BR/NFR/VETO，或明确回指 03/04 的设计风险。 |
| 每个 P0 是否有 CUT/TC/EV？ | 是；“有槽位”不等已执行或已通过。 |
| 是否通过停审？ | 是；双向追溯和 blocker 四联映射通过，允许进入 Step 6。 |

## 4. Historical material 诊断

| 旧材料口径 | 问题 | 当前处置 |
|---|---|---|
| 旧 05 的 14 个 `TC-001` 类编号 | 不能回指当前 F/BR、26 对象或 30 入口 | 全部废弃，不做 alias |
| “归档成功率 100%”“查询小于 3 秒” | 无 workload、环境和测量 authority | 不进入覆盖矩阵；只保留进度可见、有界和未来 threshold gate |
| 固定 retention、provider、digest | 越过治理/安全/存储 owner | 映射为 fail-closed negative 与 blocked positive |
| 旧 06 验收编号/结论 | 正式 06 尚未重建 | 不继承；本 Step 仅写 `pending-06` |
| 日志即证据 | 无 raw→report→EV 真实性链 | 独立 REPORT CUT；Step 13 固定证据结构 |

## 5. 改动前后对比与测试设计取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 追溯方向 | 旧需求→旧用例单向 | F/BR/NFR/VETO→CUT→TC→EV 与 CUT→来源双向 | 可发现孤儿设计契约 |
| 覆盖结论 | 有用例即“覆盖/通过” | planned、blocked-positive、pending-06 与执行状态分离 | 不伪造执行事实 |
| 外部接缝 | fake positive 计成功 | real seam required-but-blocked；fake 只证明本地映射 | 维持 authority/finality |
| 证据编号 | 日志名或占位路径 | 候选 evidence 族，Step 13 再绑定固定路径/schema | 避免静态造 EV |
| VETO | 尾部人工检查 | 每类 VETO 都有自动化负向 TC 候选 | P0 不靠口头审查 |

| 取舍 | 结论 |
|---|---|
| 是否为每条 BR 建独立 case | 按风险族聚合，但矩阵逐条/逐组可反查；Step 6 提供明确断言 |
| 是否提前给正式 AC | 否；正式 06 才拥有 AC/VETO 编号和 verdict 规则 |
| blocked positive 是否算“未覆盖” | 设计覆盖已建立，但执行不可退出；状态必须保持 `blocked-positive` |
| static scan 能否关闭外部 blocker | 不能；只证明 dependency/redaction/absence 等局部事实 |

## 6. 结构化中间产物

### 6.1 功能需求正向覆盖矩阵

| 需求 ID | 设计依据 | 场景 | CUT | 用例候选 | 自动化 | evidence 槽位 | 覆盖状态 |
|---|---|---|---|---|---|---|---|
| `F-AR-001` | 03 §5.2/7.1/8.2/9/10/12 | C01 admission、非法 scope/authority、duplicate/conflict/commit unknown | CONTRACT/OBJECT/COMMAND/UOW/IDEMPOTENCY | `TC-AR-COMMAND-001～005` | 是 | `EV-CAND-AR-COMMAND-*` | planned；owner authority positive 部分 blocked |
| `F-AR-002` | 03 §5.2/7.3～7.5/8.4～8.5 | 8 source binding/capture、fence/coverage、partial/stale/missing/conflicting、Auxiliary | AUTHORITY/CONSUMER/JOB/EFFECT | `TC-AR-AUTHORITY-*`;`TC-AR-JOB-002～004`;`TC-AR-CONSUMER-002` | 是 | `EV-CAND-AR-AUTHORITY-*` | blocked-positive `AR-UP-001/006～008` |
| `F-AR-003` | 03 §5.2/7.4/8.5/9/10 | exact manifest set、closure incomplete/overfull、revision/fence race、seal guard | OBJECT/STATE/JOB/UOW | `TC-AR-JOB-005～006`;`TC-AR-UOW-002` | 是 | `EV-CAND-AR-BUNDLE-*` | planned；完整 source positive blocked |
| `F-AR-004` | 03 §5.2/7.2/7.4/8.3/8.5/9/11 | immutable assessment、Unknown/Unsupported/IntegrityFailed、target 隔离、无假 Verified | OBJECT/STATE/JOB/QUERY | `TC-AR-JOB-007～008`;`TC-AR-QUERY-003` | 是 | `EV-CAND-AR-ASSESS-*` | blocked-positive `AR-UP-004` |
| `F-AR-005` | 03 §5.2/7.3～7.4/8.4～8.5/9/11 | placement/retrieval/lifecycle 多轴、ACK≠commit、hold/decision guard、probe | EFFECT/STATE/CONSUMER/JOB | `TC-AR-JOB-009～012`;`TC-AR-CONSUMER-003～004` | 是 | `EV-CAND-AR-EFFECT-*` | blocked-positive `AR-UP-003/005` |
| `F-AR-006` | 03 §5.1/7.2/8.3/10/14 | 五 Query current visibility、partial/stale、cursor、strict zero-write | QUERY/SECURITY/OBSERVE | `TC-AR-QUERY-001～008` | 是 | `EV-CAND-AR-QUERY-*` | planned；continuation positive blocked local-002/003 |
| `F-AR-007` | 03 §5.2/7.1/7.4/8.2/8.5/9 | C02 validation、frozen owner set、compatibility/eligibility、plan exactness | COMMAND/RESTORE/JOB | `TC-AR-COMMAND-006～009`;`TC-AR-JOB-013` | 是 | `EV-CAND-AR-RESTORE-*` | blocked-positive `AR-UP-004/006/009` |
| `F-AR-008` | 03 §5.2/7.3～7.4/8.4～8.5/9/11 | owner-specific material、receiver exact match、intent-before-effect、no owner DB write | RESTORE/AUTHORITY/EFFECT/JOB | `TC-AR-JOB-014～016`;`TC-AR-CONSUMER-005` | 是 | `EV-CAND-AR-RESTORE-*` | blocked-positive `AR-UP-006/009` |
| `F-AR-009` | 03 §7.3～7.4/8.4～8.5/11～12 | per-item outcomes、exact probe、partial resume、compensation authority、complete replay | RESTORE/IDEMPOTENCY/EFFECT/JOB | `TC-AR-JOB-016～017`;`TC-AR-IDEMP-*` | 是 | `EV-CAND-AR-RECOVERY-*` | blocked-positive `AR-UP-009`;local durable blocked |

### 6.2 业务规则覆盖矩阵

| 规则 | 设计契约 | 关键反断言 | CUT / TC 候选 | evidence 槽位 | 状态 |
|---|---|---|---|---|---|
| `BR-AR-001` | source binding/capture fields、coverage/fence | 缺 authority/version/fence/coverage 不得 captured | AUTHORITY；`TC-AR-AUTHORITY-001～004` | `EV-CAND-AR-AUTHORITY-*` | planned + positive blocked |
| `BR-AR-002` | manifest exact set/closure/read-set | incomplete/overfull/phantom 不得 Sealed | OBJECT/UOW；`TC-AR-JOB-005～006`;`TC-AR-UOW-002` | `EV-CAND-AR-BUNDLE-*` | planned |
| `BR-AR-003` | `ArchiveBundleState::Sealed` 边界 | Sealed 不推出 archived/approved/committed/restored | STATE；`TC-AR-STATE-003` | `EV-CAND-AR-STATE-*` | planned |
| `BR-AR-004` | source-authority matrix | workspace/observability/artifact ref 不补 canonical | AUTHORITY；`TC-AR-AUTHORITY-005～008` | `EV-CAND-AR-AUTHORITY-*` | planned |
| `BR-AR-005` | assessment/placement/lifecycle/handoff 独立轴 | 任一轴结果不得传播到另一轴 | STATE/EFFECT；`TC-AR-STATE-004～007` | `EV-CAND-AR-STATE-*` | planned |
| `BR-AR-006` | decision-bound lifecycle flow | missing/stale/conflict/hold 不得派发/删除 | COMMAND/JOB/AUTHORITY；`TC-AR-COMMAND-010～012`;`TC-AR-JOB-011` | `EV-CAND-AR-GOVERNANCE-*` | planned + positive blocked |
| `BR-AR-007` | ownership/outbound absence | 不生成 SoA/AIIA/Claim，不决定项目状态，不发布 owner fact | DEPENDENCY/AUTHORITY；`TC-AR-DEPENDENCY-002`;`TC-AR-AUTHORITY-008` | `EV-CAND-AR-BOUNDARY-*` | planned |
| `BR-AR-008` | typed Unknown/Unsupported/IntegrityFailed/Conflict | 不压成 success，不盲重试 | STATE/EFFECT/RESTORE；`TC-AR-EFFECT-*`;`TC-AR-RESTORE-*` | `EV-CAND-AR-RECOVERY-*` | planned |
| `BR-AR-009` | restore material/handoff ports | Bundle 不成为跨域写权，Archive 不写 owner DB | RESTORE/AUTHORITY；`TC-AR-RESTORE-001～004` | `EV-CAND-AR-RESTORE-*` | planned + positive blocked |
| `BR-AR-010` | per-owner/item outcome/history | 一 owner/一 item 结果不广播、不覆盖其他项 | RESTORE/STATE；`TC-AR-RESTORE-005～008` | `EV-CAND-AR-RESTORE-*` | planned |
| `BR-AR-011` | native durable records + safe refs | 缺 basis/history/result 不得 completed/sealed | UOW/OBSERVE/REPORT；`TC-AR-UOW-*`;`TC-AR-OBSERVE-*` | `EV-CAND-AR-TRACE-*` | planned；durable proof blocked |
| `BR-AR-012` | module/port/data ownership boundary | Archive 不持有/反写任一 owning-domain truth | AUTHORITY/DEPENDENCY/SECURITY | `EV-CAND-AR-BOUNDARY-*` | planned |

### 6.3 NFR 与 VETO 覆盖矩阵

| 输入 | 验证目标 | CUT / TC 候选 | 自动化 | evidence 槽位 | 状态 |
|---|---|---|---|---|---|
| 性能：进度可见 | L/L+1 边界显式 partial/blocked/continuation；不静默截断 | RESOURCE/JOB；`TC-AR-RESOURCE-001～003` | 是 | `EV-CAND-AR-NFR-*` | planned；数值 threshold blocked `AR-HLD-Q-002` |
| 性能：Query 只读 | bounded committed snapshot，不回源写或长事务 | QUERY/RESOURCE；`TC-AR-QUERY-*` | 是 | `EV-CAND-AR-QUERY-*` | planned |
| 可用性 | 单 seam 失败保留局部已知事实，不造全局成功 | EFFECT/RESTORE/JOB | 是 | `EV-CAND-AR-RECOVERY-*` | planned + real-seam blocked |
| 安全 | owner/body/secret/authority/cross-domain write 零越界 | AUTHORITY/SECURITY/DEPENDENCY | 是 | `EV-CAND-AR-SECURITY-*` | planned |
| 审计/可追溯 | intent、basis、finding、outcome、result 链可追；raw 不泄漏 | UOW/OBSERVE/REPORT | 是 | `EV-CAND-AR-TRACE-*` | planned；observability handoff blocked |
| 幂等/一致性 | same/same replay、same/different conflict、CAS/fence、unknown probe | UOW/IDEMPOTENCY/EFFECT | 是 | `EV-CAND-AR-IDEMP-*` | planned；durable restart blocked |
| 可观测性 | A1～A9 safe posture 可见；sink 不干扰 truth | OBSERVE/SECURITY | 是 | `EV-CAND-AR-OBSERVE-*` | planned；backend proof blocked |
| VETO-1：跨域写 | 所有 store/port spies 与 dependency scan 证明零 owner DB write | AUTHORITY/DEPENDENCY/RESTORE | 是 | `EV-CAND-AR-VETO-*` | planned |
| VETO-2：状态传播 | Sealed/Verified/Eligible/material-ready/partial 不升格全局成功 | STATE/OBJECT | 是 | `EV-CAND-AR-VETO-*` | planned |
| VETO-3：缺 authority 仍成功 | missing/unknown/conflict/unsupported 均 fail-closed | AUTHORITY/CONFIG/STATE | 是 | `EV-CAND-AR-VETO-*` | planned |
| VETO-4：projection/ref/fake 冒真相 | 8 source class classification 与 production fake absence | AUTHORITY/CONFIG/DEPENDENCY | 是 | `EV-CAND-AR-VETO-*` | planned |
| VETO-5：不可追溯/unknown 盲重放 | result/history/effect key 缺失阻断；exact probe only | UOW/IDEMPOTENCY/EFFECT/REPORT | 是 | `EV-CAND-AR-VETO-*` | planned；durable/real seam blocked |

### 6.4 18 个 CUT 反向覆盖矩阵

| CUT | 需求/规则/设计来源 | 场景焦点 | TC 候选 | evidence 槽位 | 状态 |
|---|---|---|---|---|---|
| `CUT-AR-CONTRACT` | F1～9；03 §5.1/7 | DTO/ref/enum/metadata/round-trip/unsupported | `TC-AR-CONTRACT-*` | `EV-CAND-AR-CONTRACT-*` | planned |
| `CUT-AR-OBJECT` | F1～9；BR1～5/8～11；03 §5.2 | 26 objects factory/rehydrate/invariant/no mutation on error | `TC-AR-OBJECT-*` | `EV-CAND-AR-OBJECT-*` | planned |
| `CUT-AR-STATE` | BR2～5/8/10；03 §9 | 18 states legal/illegal/multi-axis non-propagation | `TC-AR-STATE-*` | `EV-CAND-AR-STATE-*` | planned |
| `CUT-AR-COMMAND` | F1/5/7；03 C01～C03 | admission/result/UoW/blocked/conflict/unknown | `TC-AR-COMMAND-*` | `EV-CAND-AR-COMMAND-*` | planned/blocked-positive |
| `CUT-AR-QUERY` | F6；BR3/4/8/12；03 Q01～Q05 | safe view/current visibility/cursor/strict zero-write | `TC-AR-QUERY-*` | `EV-CAND-AR-QUERY-*` | planned/continuation blocked |
| `CUT-AR-CONSUMER` | F2/5/8/9；03 E01～E05 | envelope/dedup/route/late/ACK/receipt | `TC-AR-CONSUMER-*` | `EV-CAND-AR-CONSUMER-*` | planned/real event blocked |
| `CUT-AR-JOB` | F1～5/7～9；03 J01～J17 | fixed target/claim/checkpoint/report/partial | `TC-AR-JOB-*` | `EV-CAND-AR-JOB-*` | planned/real seam blocked |
| `CUT-AR-UOW` | BR2/10/11；03 §10 | atomicity/CAS/read-set/range/fence/probe | `TC-AR-UOW-*` | `EV-CAND-AR-UOW-*` | planned/durable blocked |
| `CUT-AR-IDEMPOTENCY` | F9；BR8/10/11；03 §12 | reserve/replay/conflict/result missing/partial resume | `TC-AR-IDEMP-*` | `EV-CAND-AR-IDEMP-*` | planned/durable blocked |
| `CUT-AR-EFFECT` | F2/5/8/9；BR5/6/8/10 | intent-before-effect/dispatch knowledge/probe/reconcile | `TC-AR-EFFECT-*` | `EV-CAND-AR-EFFECT-*` | planned/real seam blocked |
| `CUT-AR-AUTHORITY` | BR1/4/6/7/9/12；source matrix | owner/source/decision/receiver isolation | `TC-AR-AUTHORITY-*` | `EV-CAND-AR-AUTHORITY-*` | planned/positive blocked |
| `CUT-AR-RESTORE` | F7～9；BR8～10 | plan/material/handoff/outcome/compensation/no write | `TC-AR-RESTORE-*` | `EV-CAND-AR-RESTORE-*` | planned/positive blocked |
| `CUT-AR-CONFIG` | 04 §7～12 | 55 keys/source/cross-field/assembly/failure/pinning | `TC-AR-CONFIG-*` | `EV-CAND-AR-CONFIG-*` | planned/production assembly blocked |
| `CUT-AR-SECURITY` | NFR security/audit；03 §14；04 §8 | default-deny/redaction/canary/current visibility | `TC-AR-SECURITY-*` | `EV-CAND-AR-SECURITY-*` | planned |
| `CUT-AR-OBSERVE` | BR11；NFR observe；03 §14 | telemetry/native truth/material layers/non-interference | `TC-AR-OBSERVE-*` | `EV-CAND-AR-OBSERVE-*` | planned/handoff blocked |
| `CUT-AR-DEPENDENCY` | BR7/12；01 §8；03 §13 | compile/runtime/event/ref/adapter/fake；outbound absence | `TC-AR-DEPENDENCY-*` | `EV-CAND-AR-DEPENDENCY-*` | planned; SDK direction blocked |
| `CUT-AR-RESOURCE` | NFR performance/availability；04 budgets | L/L+1、bounded page/batch/in-flight、no invented threshold | `TC-AR-RESOURCE-*` | `EV-CAND-AR-NFR-*` | planned/numeric baseline blocked |
| `CUT-AR-REPORT` | BR11；evidence standard；03 §15.3 | raw/report pairing、failure output、no static EV/no latest | `TC-AR-REPORT-*` | `EV-CAND-AR-REPORT-*` | planned |

### 6.5 Blocker 四联覆盖

| blocker | blocked positive lane | 必测 negative/fail-closed | 证明上限 | exit/VETO |
|---|---|---|---|---|
| `AR-UP-001/006～008` | 8 source owner material/closure | missing/stale/conflict/Auxiliary/ref-not-body | 不证明完整跨域 capture | release exit blocked；冒 canonical 为 VETO |
| `AR-UP-002` | project archive/restore lifecycle handoff | local Accepted/Sealed/Succeeded 不推导 owner state | 不证明 archived/restored | 状态传播为 VETO |
| `AR-UP-003` | retention/hold/delete/risk execution | absent/stale/conflicting/hold→Blocked、zero dispatch | 不证明治理授权/处置成功 | positive exit blocked；default allow 为 VETO |
| `AR-UP-004` | digest/signature/schema positive | missing/unsupported/mismatch→Unknown/Blocked/IntegrityFailed | 不证明 Verified/长期可读 | positive exit blocked；假 Verified 为 VETO |
| `AR-UP-005` | durable placement/retrieval/lifecycle | ACK/timeout/NotFound 不等 commit；exact probe | 不证明 storage durability/RTO | positive exit blocked；ACK=commit 为 VETO |
| `AR-UP-009` | per-owner receiver commit/compensation | mapping drift/partial/unknown/isolation/no DB write | 不证明 restored/receiver committed | positive exit blocked；direct write 为 VETO |
| `AR-ARCH-001` | SDK/downstream conformance | Archive Cargo graph 不引入 SDK | 不裁决全局矩阵 | compile reverse edge 阻断 |
| `AR-HLD-Q-001` | outbound publish/delivery | outbox/topic/publisher/config/delivery evidence 均不存在 | 不产生 outbound EV | 任意 ready outbound 为 VETO |
| `AR-HLD-Q-002` | numerical performance/recovery claim | typed bound、L/L+1、visible partial | 不证明数值 SLA/readiness | 数值 exit 条件 blocked |
| `AR-03-LOCAL-001～005` | durable codec/cursor/store/config/telemetry | missing binding、mismatch、fake isolation、redaction/non-interference | 仅 local contract，不证明 restart/provider/backend | 对应 production exit blocked |
| `AR-03-LOCAL-006` | 全部真实运行与项目 readiness | 文档/static consistency only | 0 run/artifact/report/EV/verdict | 当前不得判定测试通过 |

### 6.6 覆盖矩阵停审记录

| 覆盖项 | 审查项 | 结论 | 缺口/修正 |
|---|---|---|---|
| F-AR-001～009 | design→CUT→TC→EV 槽位 | 通过 | 正向 real seams 保持 blocked |
| BR-AR-001～012 | 不变量/禁止/显式变化/owner 边界 | 通过 | 无规则只留人工确认 |
| NFR | 方法、自动化与 threshold authority | 通过 | 数值项转 `AR-HLD-Q-002` |
| 五类 VETO | 可触发负向与阻断口径 | 通过 | 正式编号留 06 |
| 18 CUT | 反向来源、场景与证据族 | 通过 | 无 orphan CUT |
| blocker | 四联映射 | 通过 | 无 fake closure |

### 6.7 跨覆盖项审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 孤儿 F/BR/NFR/VETO | 无 | 全部有 CUT/TC/EV 候选 |
| 孤儿设计契约 | 无 | 26/30/32/18/8/55 由对应 CUT 承接 |
| 孤儿 CUT | 无 | 18/18 反向可定位 |
| 重复 TC/EV ID | 无 | 当前仅族；Step 6/13 建唯一实例 |
| P0 仅人工确认 | 无 | 本地负向/静态均自动化；real seam 是 blocked，不是人工 pass |
| phase 越界 | 无 | 不把 Accepted/Sealed/Verified/handoff outcome 升格为 owner/project 状态 |
| 静态造证据 | 无 | candidate 槽位不构成 evidence instance |

## 7. 复杂度判断

矩阵跨 9 个功能需求、12 条业务规则、NFR/VETO、18 CUT 与 18 个 blocker/pending，需按正向、反向和 blocker 三层展示；无需另建附件。Step 6 将按 18 个 CUT 逐批固定可执行 TC，不在本 Step 填数据集、suite、路径或执行结果。

## 8. 回填草稿

正式 §5 应保留：覆盖状态语义、功能需求矩阵、规则矩阵、NFR/VETO 矩阵、18 CUT 反向表和 blocker 四联表。每条 P0 都必须从设计来源追到 TC 与 evidence 槽位；`blocked-positive` 不能改成 skipped 或 covered-pass。正式 06 的 AC/VETO 编号不得在 05 预造。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；当前场景均能用正式对象、入口、状态、错误与配置表达 |
| 新 owning-project blocker | 无 |
| 持续 blocker/pending | `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002`、`AR-03-LOCAL-001～006` |
| 正式证据/AC | Step 13 / 后续 06 才固定；当前没有真实证据或 verdict |

## 10. 进入下一步条件

- [x] F/BR/NFR/VETO 均有设计依据、CUT、TC 与 evidence 候选。
- [x] 18/18 CUT 有反向追溯，无孤儿设计契约。
- [x] 每个 blocker 有 positive blocked、negative、证明上限和 exit/VETO 姿态。
- [x] 未把 planned/blocked 写成 passed/skipped。
- [x] 未生成真实 run、artifact、report、EV、AC 或 readiness。
- [x] 允许进入 Step 6。
