# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
> 正式回填：`05-测试方案.md` §10
> 日期：2026-09-13
> 状态：`completed / qualitative_nfr_closed_numeric_and_real_seams_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 把正式 00 的非功能要求、03 的一致性/恢复/观测契约和 04 的失效姿态收敛为可执行专项矩阵 |
| 输入 | 正式 00 §13～15；03 §10～15/17；04 §7～14；05 Step 5～9 |
| gate_status | `completed / qualitative_nfr_closed_numeric_and_real_seams_blocked` |
| gate_reason | P0 非功能、五类 VETO 和安全红线均有方法、环境、可判定条件与证据候选；无来源数值和真实接缝均保持 blocked |
| next_allowed_action | 按连续授权创建并完成 Step 11 |
| source_files | 00 §13～15；03 §10～15/17；04 §7～14；05 Step 5～9；测试方案书写规范 §5.10 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 非功能来源与阈值分类 | §2～§5 | done | requirement/design/workload 三类来源不混用 |
| 专项矩阵 | §6.1～§6.4 | done | 性能、安全、一致性、恢复、观测、审计均可判定 |
| VETO/blocker 转译 | §6.5～§6.6 | done | required positive、negative、证明上限同时保留 |
| suite/证据承接 | §6.7～§6.8 | done | 不新增 TC，不提前造正式 EV |
| 停审与跨专项审计 | §6.9～§10 | done | 无无来源阈值、fake closure 或状态越级 |

## 2. 本步输入与事实边界

| 输入 | 本 Step 使用 | 不得推导 |
|---|---|---|
| 00 §13 | 进度可见、Query 只读、局部可读、安全、追溯、幂等、一致性和可观测性 | 分钟级 SLA、吞吐、容量、RTO/RPO |
| 00 §14.1 | 五类一票否决方向 | 当前验收 verdict 或风险接受 |
| 03 §10～12 | UoW/CAS/read-set/fence、错误、commit knowledge、幂等与 partial resume | durable store 已实现或重启事实 |
| 03 §13～14 | exact slots、配置绑定、三层信号与 denylist | provider、secret、KMS、观测 backend readiness |
| 04 §7～11 | 12 域/55 keys、strict validation、fail-fast/fail-closed | 隐式默认、hot reload、production binding |
| Step 6～9 | 102 TC、26 DS、环境/profile、13 suites、5 gates、14 scripts | 测试已经实现、执行或通过 |

专项结果继续使用 `EV-CAND-AR-*` 槽位。真实阈值只有在可定位的 requirement、owner policy 或 workload/measurement authority 中出现后才能成为通过条件；当前 `AR-HLD-Q-002` 未关闭，任何性能/容量/RTO/RPO 数字都只能是缺失输入，不能由本 Step 补造。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些性能指标必须验证？ | P0 验证有界工作、L/L+1、显式 partial/blocked/continuation、Query 零写、进度与结果计数可见；duration/count 可采样但无硬阈值。吞吐、P95、容量、RTO/RPO 为 P2 measured 且当前 blocked。 |
| 哪些安全和边界红线必须负向测试？ | 跨域写、状态越级、缺 authority 仍成功、projection/ref/fake 冒真相、unknown 盲重放，以及 raw secret/body/key/digest/location/selector/provider response 泄漏全部必须阻断。 |
| 哪些一致性和恢复场景必须故障注入？ | UoW begin/save/commit/probe、CAS/range/negative read-set、claim fence、intent-before-effect、NotDispatched/MayHaveDispatched、result missing、partial resume、mapping drift、late feedback、compensation。 |
| 哪些日志、指标和审计证据必须存在？ | entry/UoW/effect/state/query/claim 的安全类别信号、Archive native record/result/report 关系、redaction/dependency/report-pairing 检查；外部 audit material 正向受 `AR-UP-007` 阻塞。 |
| 阈值来自哪里？ | 结构性条件来自 00/03/04；exact set、zero forbidden write/effect/leak、状态/TC 分母来自正式设计；数值性能只能来自未来 workload/environment/test authority。 |
| dependency unavailable 如何判？ | 预期注入可使该负向 case 通过；非预期依赖故障为 failed/infrastructure_failed；正式前置缺失为 blocked，三者均不能升级全局成功。 |
| fake 可以证明什么？ | 证明纯逻辑、调用顺序、错误映射、no-write 和 fail-closed；不能证明 owner authority、durability、crypto、storage commit、receiver commit、审计后端或 readiness。 |
| 当前是否需要新增 TC？ | 不需要。Step 6 的 RESOURCE/SECURITY/OBSERVE/UOW/IDEMP/EFFECT/AUTHORITY/RESTORE/CONFIG/DEPENDENCY/REPORT/VETO 已覆盖本 Step；这里只组合专项。 |

## 4. Historical material 诊断与改动前后对比

| 历史口径 | 问题 | 当前处置 |
|---|---|---|
| cold query P95 `<3s`、成功率 `100%` | 无 workload、环境、样本和 authority | 删除硬阈值；保留采样与 `AR-HLD-Q-002` |
| fixed digest/签名/存储 tier | 私造算法、key、provider 与 commit | 用 typed Unknown/Unsupported/IntegrityFailed/CommitUnknown；正向 blocked |
| legal hold/purge 成功用例 | Archive 无决定权且 governance seam 未闭合 | 只验证正式 decision guard、缺失/冲突零 dispatch |
| E2E mock success | fake 冒充真实 finality | controlled negative 与 formal-seam positive 分开 |
| 日志存在即审计完整 | runtime signal 不等 native truth 或 observability material | 三层证据边界 + raw/report pairing |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 性能 | 无来源数字 | qualitative P0 + measured P2 blocked |
| 安全 | 若干口头边界 | 五类 VETO、denylist、zero-write/effect 可自动判定 |
| 恢复 | timeout 后 retry | dispatch knowledge、exact probe/reconcile、partial resume |
| 观测 | dashboard/log | safe signal、native record、external material 三层 |
| 证明 | mock 集成 | local/formal-seam 证明上限显式分离 |

## 5. 专项测试设计取舍

1. 不把“无硬阈值”理解为“不测性能”：P0 必须验证有界、可中断、进度可见、不静默截断，并采集安全的 duration/count；数值裁决保持 blocked。
2. exact-set、zero forbidden effect、102 TC/18 状态/55 key 覆盖是离散设计断言，不是未经来源的产品 SLO。
3. recovery 以事实知识为轴：local commit 用 `probe_commit`，external MayHaveDispatched 用 exact probe/reconcile；不得用超时直接判失败或成功。
4. 可观测性失败不得改变业务结果；mandatory native record 失败则 accepted UoW 不成立，二者不能混为“日志降级”。
5. formal-seam 正向专项保留为 P0 required + blocked；P1 hardening 和 P2 measured 不可替代。

## 6. 结构化中间产物

### 6.1 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | evidence 候选 |
|---|---|---|---|---|---|
| 有界工作与进度 | 大包/多 source/多 owner 时静默停滞或假 Complete | RESOURCE L/L+1、job checkpoint/report、partial/continuation assertions | CI/nightly；`ci-test`/`operations-replay` | 每次调用服从配置正界；超限显式 partial/blocked/continuation；不静默截断 | `EV-CAND-AR-NFR-001` |
| 时延/吞吐采样 | 无基线却声称性能达标 | suite 记录 duration/count/work units/config identity | nightly；future measured | 当前只要求同 run 安全采样可追溯；无数值 pass；正式数值 lane blocked | `EV-CAND-AR-NFR-002` |
| Query 非干扰 | 查询触发回源、写入或长写事务 | 五 Query × telemetry on/off；write/effect spies | PR/main；`ci-test` | `begin_uow/reserve/save/append/complete/claim/external_port = 0`；返回 safe posture | `EV-CAND-AR-QUERY-*` |
| Source authority | owner/class/version/fence/coverage 被混淆 | 8 source vector、wrong-owner、missing、Auxiliary elevation | main/formal-seam | negative 全部 fail-closed；formal positive 仅 owner-versioned vector，当前 blocked | `EV-CAND-AR-AUTHORITY-*` |
| Bundle closure | manifest 与实际集合不闭合仍 seal | exact set、phantom/range race、revision/fence mismatch | main/nightly | incomplete/overfull/conflict 不 `Sealed`；同 revision/basis 可追溯 | `EV-CAND-AR-BUNDLE-*` |
| Integrity/compatibility | missing/unsupported/mismatch 被写成 Verified | typed capability outcomes、target/revision isolation | controlled/formal-seam | Unknown/Unsupported/IntegrityFailed 保真；算法/key/provider 正向 blocked | `EV-CAND-AR-ASSESS-*` |
| UoW/并发/幂等 | 半提交、二次 effect、旧 fence 提交 | deterministic fault/barrier、CAS/read-set/fence、same/same/different | main/nightly/replay | 原子可见；exactly-one body；完整 replay；Conflict 不改原记录；old fence 零提交 | `EV-CAND-AR-UOW-*`;`EV-CAND-AR-IDEMP-*` |
| External effect | ACK/timeout 被当 committed，盲重派 | intent-before-effect + NotDispatched/MayHaveDispatched + correlation fault | main/replay/formal-seam | intent 先 durable；ACK≠commit；Unknown 只 exact reconcile；正向 finality blocked | `EV-CAND-AR-EFFECT-*` |
| Lifecycle 安全 | Archive 自定 retention/hold/delete/risk | missing/stale/conflicting/hold vectors；dispatch spy | main/formal-seam | 无正式 current decision 时零 dispatch/cleanup；治理正向 blocked | `EV-CAND-AR-GOVERNANCE-*` |
| Restore 隔离与恢复 | Bundle 获跨域写权、全 owner 成功传播 | multi-owner plan、material eligibility、mapping drift、partial/outcome/compensation | main/replay/formal-seam | owner/item 独立；zero owner DB write；HandoffComplete/Succeeded≠restored；正向 receiver blocked | `EV-CAND-AR-RESTORE-*` |
| 可用性/降级 | 单 seam 故障造成全局假成功或丢失已知结果 | source/storage/receiver/visibility/sink failure injection | main/replay | 已提交局部结果可审查；总体保守为 Partial/Blocked/Unknown；无 silent fallback | `EV-CAND-AR-NFR-003` |
| 安全与脱敏 | secret/body/ref/key/digest/location/selector 泄漏 | synthetic canary + API/log/metric/span/native/report 扫描 | main/release | denylist canary 零出现；失败不回显原值；hidden 不可枚举 | `EV-CAND-AR-SECURITY-*` |
| 观测非干扰 | sink 改变业务结果或 Query 写集 | sink enabled/disabled/unavailable/redaction-failed 对照 | main/release | business result/native required records 不因 sink 改变；Query 始终零写 | `EV-CAND-AR-OBSERVE-001` |
| 审计/追溯 | basis/intent/outcome/result 链断裂或 telemetry 冒证据 | native relation audit + formal material prerequisite | nightly/formal-seam | Archive native chain 完整；runtime signal 不冒 evidence；external audit positive blocked | `EV-CAND-AR-OBSERVE-002`;`EV-CAND-AR-REPORT-*` |
| 配置与依赖 | invalid winner/fake/SDK/provider/outbound 偷渡 | strict 55-key、assembly、source graph、outbound absence checks | PR/main/release | candidate 整体拒绝；无 production fake/SDK reverse compile/provider package/ready outbound | `EV-CAND-AR-CONFIG-*`;`EV-CAND-AR-DEPENDENCY-*` |
| 证据真实性 | 静态表、latest、跨 run 或缺 raw 造证据 | report pairing/no-static/redaction/blocked-lane checks | nightly/release | fixed run raw↔report；blocked/failed 分母独立；当前不产生正式 EV | `EV-CAND-AR-REPORT-*` |

### 6.2 性能、容量与恢复目标来源表

| 维度 | 当前 P0 可判定口径 | 数值状态 | 解锁所需 authority |
|---|---|---|---|
| page/batch/source/item work | typed positive bound + L/L+1 + visible continuation | 数值 pending | workload profile + 04 正式值 |
| in-flight/lease/timeout/retry/probe | cross-field 关系有效；无 zero/default/infinite/blind retry | 数值 pending | workload/environment + failure budget |
| Bundle size/throughput | 每批进度、计数、partial 可见 | blocked | Bundle distribution + environment + measurement method |
| Query latency | strict no-write；duration sample 可关联 profile/snapshot | blocked | representative workload + percentile/window |
| archive/restore RTO/RPO | 不声称；Unknown/Blocked/Partial 可定位 | blocked | owner/storage/receiver recovery contract + measurement authority |
| evidence retention | 覆盖固定 run 审查、验收和缺陷复验需求 | 时长 pending | governance/records policy owner |

`AR-HLD-Q-002` 未关闭前，任何数值未达都不能被写成当前 failed，任何样本较快也不能被写成 passed/readiness；formal execution 应返回 `blocked` 或在 P2 measured lane 保持 `not_run`。

### 6.3 一致性与恢复故障注入矩阵

| 故障点 | 注入/操作 | 必须断言 | suite |
|---|---|---|---|
| local save/commit | before-save、after-save-before-commit、commit unknown | 全部回滚或 probe 后确定；无半对象/Completed-without-result | `archive-consistency-replay` |
| CAS/range/negative read | stale version、phantom required item、concurrent seal | stale writer/closure abort；不漏项 seal | `archive-consistency-replay` |
| idempotency | parallel same/same、same/different、missing result | once + full replay；Conflict/ConsistencyDefect；零重算/effect | `archive-consistency-replay` |
| worker fence | old claim after renew/supersede | old fence 的 truth/result/checkpoint/effect 全拒绝 | `archive-entry-worker` |
| source dispatch | crash before/after intent、feedback late/mismatch | 未提交 intent 零调用；已提交 fixed intent 可 reconcile；历史不覆盖 | `archive-consistency-replay` |
| storage/lifecycle | ACK、timeout、NotFound、hold change | ACK≠commit；MayHaveDispatched→Unknown；decision 重核；无盲重派 | `archive-consistency-replay` |
| restore handoff | receiver unavailable/mapping drift/partial/late conflict | per-item 独立；drift 零 intent；unknown 只 reconcile；不直写 owner | `archive-authority-restore-negative` |
| partial resume | mixed result + explicit unresolved subset | 已成功 target 零调用；新 key/report 关联原 run；不全量扫描重跑 | `archive-consistency-replay` |
| telemetry/report | sink failure、raw missing、pair mismatch | business不变；证据 lane failed/blocked，不造 EV | `archive-security-observe`;`archive-report-audit` |

### 6.4 安全、观测与审计检查表

| 红线 | 注入/检查 | 通过条件 | 失败级别候选 |
|---|---|---|---|
| cross-domain write | store schema/call graph/receiver spies | owner DB/command 内部不可访问；只走 handoff | S |
| false global state | Accepted/Sealed/Verified/Eligible/MaterialReady/item Succeeded 组合 | 不产生 archived/dissolved/restored/owner committed/global success | S |
| authority fail-open | missing/unknown/conflict/unsupported inputs | Blocked/Unknown/Unsupported/IntegrityFailed；零危险 effect | S |
| Auxiliary/ref/fake elevation | workspace/artifact/audit summary/fake 替代 canonical/material | 拒绝或明确 Auxiliary/partial；formal lane仍 blocked | S |
| blind replay | 删除 result/effect key、external Unknown 后 retry | ConsistencyDefect/CommitUnknown；只 exact probe | S |
| sensitive disclosure | synthetic denylist canary | API/log/metric/span/native artifact/report 中零出现 | S |
| high-cardinality telemetry | arbitrary owner/ref/id/digest/free text 作为 label | 只允许 finite enum/category；检查失败阻断 | A/S（若泄漏则 S） |
| evidence forgery | handwritten pass/static JSON/latest/cross-run | no-static/pairing check 失败并阻断 | S |
| outbound smuggling | outbox/publisher/topic/delivery surface/config | `AR-HLD-Q-001` 前全部 absent/blocked | S |

### 6.5 五类 VETO 专项映射

| VETO | 用例 | 专项 gate | 当前证明上限 |
|---|---|---|---|
| V1 跨域写 | `TC-AR-VETO-001`、AUTHORITY-005 | authority/restore negative + dependency | 可证明本仓 local surface 无越权；receiver 内部正向 blocked |
| V2 状态越级 | `TC-AR-VETO-002`、STATE-001～015 | domain/state + release checks | local 状态传播可证明；owner/project 状态不由本仓证明 |
| V3 缺 authority 仍成功 | `TC-AR-VETO-003` | config/authority/effect negative | fail-closed 可证明；正式 allow/commit blocked |
| V4 projection/ref/fake 冒真相 | `TC-AR-VETO-004` | authority/dependency/formal-seam | classification 可证明；owner material positive blocked |
| V5 不可追溯/盲重放 | `TC-AR-VETO-005` | consistency/report audit | local relation/probe rule可证明；durable restart/external finality blocked |

### 6.6 Blocker / pending 的专项转译

| blocker 组 | required positive 专项 | 可执行 negative | 证明上限 / 退出姿态 |
|---|---|---|---|
| `AR-UP-001/006～008` | source/material/closure/audit handoff | missing/mismatch/Auxiliary/ref-not-body | 不证明完整跨域 Bundle；formal exit blocked |
| `AR-UP-002` | lifecycle trigger/restore owner state | phase-local state non-propagation | 不证明 archived/restored；越级为 VETO |
| `AR-UP-003～005` | governance/integrity/storage finality | decision/hold/unknown/ACK/probe negatives | 不证明授权、Verified、durability、RTO |
| `AR-UP-009` | receiver commit/compensation | mapping/partial/unknown/no-write | 不证明 restored/owner committed |
| `AR-ARCH-001` | SDK consumer direction | no reverse compile scan | 不裁决全局依赖 owner；release不能忽略 |
| `AR-HLD-Q-001` | outbound conformance | surface/config absence | 不产生 outbound EV；任意 ready surface 为 VETO |
| `AR-HLD-Q-002` | measured NFR/RTO/RPO | L/L+1、progress/partial | 不作数值裁决；P2 blocked/not_run |
| `AR-03-LOCAL-001～005` | codec/cursor/durable/config/telemetry production parity | missing/mismatch/fake isolation/non-interference | 只证明 local contract；production exit blocked |
| `AR-03-LOCAL-006` | 真实实现与运行 | static consistency only | 当前 0 run/artifact/report/EV/verdict/readiness |

### 6.7 专项到 suite / gate 映射

| 专项 | Primary suite | Gate | 阻断姿态 |
|---|---|---|---|
| state/closure/authority classification | `archive-contract-domain` | PR/main | local P0 failed 阻断 |
| Query/performance structural | `archive-service-flow`;`archive-resource-bounds` | PR/nightly | zero-write/visible-bound failed 阻断；numeric pending |
| UoW/idempotency/effect/recovery | `archive-consistency-replay`;`archive-entry-worker` | main/nightly/release | local failed 阻断；durable positive blocked |
| restore/lifecycle/security | `archive-authority-restore-negative` | main/release | negative failed 阻断；formal positive blocked |
| config/dependency/outbound | `archive-config-boundary`;`archive-dependency-boundary` | PR/release | 任一红线 failed 阻断 |
| redaction/observe | `archive-security-observe` | main/release | leak/non-interference failed 阻断 |
| report/evidence truth | `archive-report-audit` | nightly/release | missing raw/static/latest/cross-run 阻断 |
| real seam | `archive-formal-seam` | formal/release | prerequisite 缺失=`blocked`，绝不 skip/pass |
| numerical workload | `archive-p2-measured` | future | `AR-HLD-Q-002` 前 not_run/blocked |

### 6.8 专项证据最小字段

| 证据类 | 最小安全字段 | 禁止 |
|---|---|---|
| resource sample | run/suite/case/profile/config ref、work-unit category/count、duration、status | 无来源阈值结论、raw selector/owner ID |
| fault/recovery | fault point、pre/post state category、commit knowledge、calls/counts、result/report ref | payload/effect key、猜测 finality |
| security/redaction | canary class、scanned paths、match count、scanner status | canary raw value、secret hash 旁路 |
| authority/formal seam | owner/source/contract/schema version refs、target、prerequisite status | owner正文、fake success、静态 pass |
| report truth | fixed run、TC/suite/raw/report refs、raw digest、status/limitation | `latest`、跨 run 拼接、验收 verdict |

### 6.9 专项停审与跨专项审计

| 审计项 | 结论 | 缺口 / 上限 |
|---|---|---|
| P0 非功能类别 | 通过 | 性能/可用/安全/审计/一致性/观测均有方法 |
| 五类 VETO | 通过 | 全有负向用例与 blocking gate |
| 无来源硬阈值 | 无 | 数值 lane 保持 `AR-HLD-Q-002` blocked |
| formal positive 降级 | 无 | required-but-blocked，fake 不替代 |
| fault/recovery 完整 | 通过 | local/deterministic 可执行；durable/provider blocked |
| Query no-write | 通过 | telemetry 两姿态同为零写/effect |
| redaction/observability | 通过 | signal/native/material 三层不混同 |
| 新 TC / 正式 EV | 无 | 复用 102 TC；仍为 EV-CAND |
| 上游状态/authority 越权 | 无 | workspace 始终 Auxiliary；Archive 只记录自身 truth |

## 7. 复杂度判断

采用 16 类专项、6 组结构化矩阵和现有 13 suites 足以表达风险，而不发明测试框架、provider、环境数值或新协议。性能被拆为结构性 P0 与 measured P2，可防止“没有数字就不测”及“随手给数字”两种漂移。

## 8. 回填草稿

正式 §10 应保留专项矩阵、性能/容量/RTO 来源表、故障注入矩阵、安全/观测检查、VETO/blocker 转译和 suite 映射。必须显式声明：P0 qualitative 条件可设计验证，numerical workload 与真实接缝正向仍 blocked；duration/count 采样不构成 SLO 达标；fake 不构成 authority、durability、commit 或 readiness 证明。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；专项只组合已有 protocol/state/UoW/error/config/observe 契约 |
| 新 blocker | 无 |
| 持续 blocker/pending | `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002`、`AR-03-LOCAL-001～006` 全保留 |
| 待后续 | 缺陷分级/复验→Step 11；进出准则→Step 12；正式 EV schema/path→Step 13；residual/owner→Step 14 |

## 10. 进入 Step 11 门禁

- [x] P0 性能结构、安全、一致性、恢复、观测、审计和可用性均有验证方法。
- [x] 每项有环境、可判定条件、suite 与 evidence candidate，未新增执行事实。
- [x] 五类 VETO 和全部 blocker/pending 均有专项转译。
- [x] 无无来源数值、fake closure、owner truth/state 越级或正式 EV 伪造。
- [x] 逐专项停审和跨专项审计无 unresolved 冲突。
- [x] 允许进入 Step 11。
