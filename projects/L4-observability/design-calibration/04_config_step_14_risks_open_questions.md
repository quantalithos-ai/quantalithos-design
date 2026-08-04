# L4-observability 04-配置设计 Step 14：定义风险与待确认事项

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 14
> 回填章节：`04-配置设计.md` §14
> 当前模式：`full-restart_after_current_M3`
> 本步边界：汇总 Step01~13 的真实风险、待确认事项、阻塞范围、安全默认及 `03` 回写状态；
> 不选择产品、数值、物理机制，不执行测试、迁移或实施，不创建真实 evidence、verdict 或 signoff

## 1. Step 状态

| 项 | Current 值 |
|---|---|
| 当前文档 | `04-配置设计.md`，formal 仍冻结 |
| 当前 Step | Step14 `定义风险与待确认事项` |
| 当前模块 | `config-risk-open-question-ddd-impact-closure` |
| 输出文件 | `projects/L4-observability/design-calibration/04_config_step_14_risks_open_questions.md` |
| 前序门禁 | Step01~13 current 产物完成；Step13=`pass_consumed_by_step_14` |
| 写入状态 | `completed_current_full_rewrite` |
| gate_status | `pass_consumed_by_step_15` |
| gate_reason | 六个 SOP 问题、12 affected、14 风险、14 待确认、Step01~13 影响汇总及 current/future 回写门禁闭合 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker / affected | I05 两项 `open_upstream_internal`、H13 `open_controlled`、其余 9 项 `inherited_affected` 均保持开放 |
| current `03` 回写 | `0 pending`；Step07 supporting types 与 Step09 R2 均已先回写并进入 formal `03` |
| implementation readiness | `blocked`；current `05~07`、target reality、逐 boundary audit、ledger/skeleton 与真实 test/evidence 未完成 |
| next_allowed_action | `continue_to_current_step_15_under_continuous_M4_authorization` |

### 1.1 执行记录

| 动作 | Current 输入 / 结论 | 状态 |
|---|---|---|
| 读取标准 | 配置 SOP Step14、书写规范 §5.14、通用中间产物与可落码门禁 | done |
| 读取上游 | formal `03` §13/§16/§17 与 Step18 风险产物 | done |
| 读取本轮输入 | current Step01~13 的 impact、open material、affected 与 completion gate | done |
| 后置审计旧 Step14 | 旧 81 行 schema-first 摘要含已废弃对象与过时结论，只作 historical diagnosis | done |
| 参考粒度 | L1-governance、L1-artifact Step14 的风险/事项/回写/停审结构 | done |
| 汇总未决项 | 配置设计已决、boundary precondition、future design trigger、invariant VETO 分层 | done |
| 真实性检查 | 未伪造产品、实例值、run、test、artifact、evidence、verdict、signoff 或 commit | done |

## 2. 本步目标与非目标

### 2.1 目标

1. 把 Step01~13 分散的风险与未决事项合并为一个可执行 register，并明确 owner、最迟关闭点和未确认前行为。
2. 区分“配置设计定稿是否被阻塞”与“某个 RuntimeLike / production / migration boundary 是否被阻塞”。
3. 覆盖 Step01~13 所有 `是否影响 03=是` 的结论，确认不存在 `待回写` 或 `阻塞待确认` 的 current 契约。
4. 保留 12 项 inherited affected 的 exact ID、分类、阻塞范围和安全默认，禁止用配置闭合上游 schema/owner/flow gap。
5. 为 Step15 提供可以直接装配的 §14 草稿，同时保持 future product/mechanism/numeric/evidence 为未确认材料。

### 2.2 非目标

- 不把 store、transport、scheduler、secret provider、configuration control plane 或 external target 选型写成 current contract。
- 不把 candidate baseline/hard range 升级为生产默认、SLO、capacity、readiness 或 acceptance threshold。
- 不为 remote source、admin override、hot reload、in-place swap、automatic LKG 或 force rollback 预留隐藏 key/API。
- 不创建新 Rust type、field、trait、port、error、state、store、builder stage、flow 或 telemetry schema。
- 不宣称 target repository、physical capability、test harness、script、artifact、evidence 或 reviewer 已经存在。

## 3. SOP 六问回答

| SOP 问题 | Current 回答 |
|---|---|
| 哪些配置问题仍可能影响落地？ | Physical store/transport/scheduler/provider capability、external same-token/probe/historical resolution、host exclusive switch/drain、historical registry/obligation scan、I05/H13 与其余 affected、target repo reality、下游测试/验收/计划都影响具体 boundary；它们不允许由 implementation 猜测。 |
| 哪些事项会阻塞测试、验收、实施或运维？ | `05~07` full-restart、真实 harness/evidence、target reality 与 all boundary audit 阻塞整体 kickoff；I05/H13/physical/external/host/migration事项只阻塞其 affected positive boundary；truth/security/dependency VETO 阻塞并否决相关边界。 |
| 每个待确认事项需要谁确认？ | 上游 schema/producer owner、H13 owner、架构/infra/adapter/host owner、安全/运维 owner、配置/测试/验收/实施计划维护者与用户，见 §7。 |
| 未确认前如何处理？ | 缺 capability 不暴露 RuntimeLike boundary；缺 exact binding 不消费、不调用、不 reroute；Unknown probe/manual；缺 owner 不 mint/finalize；缺 evidence 保持 `not_run/not_evaluated`；禁止任何 source truth writeback。 |
| 哪些结论改变了 formal `03` 代码契约？ | Step07 的 6 类 supporting type/static map 与 Step09 的 locator-free registrar/group atomicity 曾影响 `03`，均已在当前 formal `03` 完成 targeted writeback；Step01~13 其余 current 结论不改变代码契约。 |
| 是否仍需回写 `03`？ | Current baseline 无 `待回写`/`阻塞待确认`；future 若要求新 source/hot reload/public provider API/local audit registry/host port/new physical owner 等，必须先回写 owner DDD Step 与 formal `03`，不得直接进入 Step15 的已确认契约。 |

## 4. Historical material 诊断

| Material | Current 身份 | 风险 | 处理 |
|---|---|---|---|
| old Step14 81 行摘要 | `historical_material_replaced` | 使用 `NormalizedLogRecord/MetricPoint/TraceSpanRecord/AuditEventProjection` 等已废弃 schema-first 心智，未汇总 Step01~13 impact | 本文件全量替换；不得恢复对象、hash-chain 或旧 pass 状态 |
| old formal `04` 292 行 | `historical_material_pre_current_M3` | 旧 key/profile/value/source order/downstream ID 可反向污染 current typed root | Step15 只能从 current Step01~14 装配 |
| README 产品与数字 | `historical_candidate_only` | OTel/TimescaleDB/Grafana/DORA/EBM/hash-chain、P95、天数等可能被误当默认或验收阈值 | 不进入 current contract；需要正式 ADR/workload/evidence 才能讨论 |
| old `05/06/07` | `historical_downstream_direction` | 旧 case/AC/phase/evidence 编号与 current `03/04` 不一致 | M4 后续逐文档 full-restart；不继承通过事实 |
| old implementation ledger/skeleton | `historical_material` | 边界与 current `07` 尚未一一对应 | current `07` 完成后全部重建 |

## 5. 风险分类与处理语义

| Status | 含义 | 是否允许 Step15 | 未关闭前行为 |
|---|---|---|---|
| `closed_current_design` | 配置设计已作出 current 决策并有 source/impact 记录 | yes | 保持 source 和回归门禁 |
| `controlled_open` | 风险仍在，但已有 fail-closed/manual/disabled 安全默认 | yes，必须作为风险可见 | 只阻塞 affected boundary，不猜测 positive path |
| `precondition_open` | 实施、测试、验收或 production boundary 的开工前置条件未满足 | yes，不能声称 ready | 到 owner gate 关闭前不得启动相应范围 |
| `future_design_trigger` | 当前不支持；一旦进入范围会改变 `03/04` 契约 | yes，只能写 unsupported/evolution | 先重开上游设计与 impact audit |
| `invariant_guarded` | truth/security/no-write/dependency 等不可风险接受边界 | yes，作为 VETO | 违反即停止/否决，不存在 override key |

“本轮新发现上游 blocker=`none`”只说明 Step14 没有发现需要回退 formal `00~03` 的新问题；它不等于既有
I05/H13/affected 已关闭，也不等于 implementation readiness 已通过。

## 6. Current affected register

| Affected ID | Classification | 配置侧阻塞范围 | 未关闭前安全默认 | Close owner / route |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | I05 schema allowlist/decode/fixture/accepted handler | slot disabled 或 startup fail；parse/UoW/ack 前 zero write | L1-artifact canonical schema/encoder/registration owner + `03/04/05/07` |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | I05 exact producer/event/registration binding | 禁止全订阅、任选、名称匹配和字段并集；binding 不完整不注册 | L1-artifact producer owner + `04/07` |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 positive execution/completion/H13 | `Blocked`/manual；zero H13/source write/result fabrication | H13 owner current design decision |
| `R06-F-AFFECT-UOW-01` | `inherited_affected` | accepted mutation 与 physical atomicity | 不提供可关闭 history/outbox/result 的 config；能力不足不暴露 adapter | current `03` + `07` per-boundary UoW audit |
| `S08-RECOVERY-CLASS-OWNER-01` | `inherited_affected` | retry/dead-letter/manual policy | 未分类 fail closed；retry values不重分类错误 | current `03/05/07` exact mapper audit |
| `R07-EXTERNAL-PHASE-LINK-01` | `inherited_affected` | publication/handoff/export exact binding | link 不完整不调用 external target；old work只解析原 binding | current `04/07` capability/binding record |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `inherited_affected` | same-token retry/probe/accounting | Unknown保留 intent 并 probe/manual；不换 token/route/budget | current `04/07` capability audit |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `inherited_affected` | Consumer accepted owner-coupled Event | 无 same-UoW typed snapshot 则 rollback；不从 current truth 补建 | current `03/07` vertical slice |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `inherited_affected` | worker completion/ack action | probe original stored result；仍未知则 controlled retry/manual，不 ack success | current `03/05/07` Consumer gate |
| `S08-JOB-REPORT-REF-OWNER-01` | `inherited_affected` | Job result/report/finalize | 不 mint 假 ref，不 finalize `Completed` | current `03/07` Job vertical slice |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `inherited_affected` | public DTO/mapper/wire/config finite parser | 不建 alias/default/private duplicate；缺 owner 在 entry/UoW 前拒绝 | current `03` owner registry + `07` compile boundary |
| `03-RPR-S09-PER-FLOW` | `inherited_affected` | 60 protocol implementation slices | config totality/assembly pass 不替代 exact flow audit | current `03` Step09 + `07` per-boundary audit |

Step14 关闭 `0/12`。配置只能提供 exact binding、capability gate、snapshot 与 fail-closed 行为，不能生成上游
payload、business owner、UoW、result、report 或 implementation evidence。

## 7. 风险表

| Risk ID | Severity / status | 风险与触发条件 | 影响 / 阻塞范围 | 缓解与未触发前处理 | 负责人 / 待确认方 |
|---|---|---|---|---|---|
| `OBS-CFG-R-001` | critical / `controlled_open` | I05 canonical payload/schema/producer binding 缺失却启用 Consumer | 错误消费 Artifact truth、错误 ack/write；阻塞 I05 positive boundary | exact schema/producer gate 未闭合前 disabled/startup fail、zero write | L1-artifact owner / 配置 / entry owner |
| `OBS-CFG-R-002` | high / `controlled_open` | H13 owner 未闭合却让 J06 写 execution/result | fabricated execution/report；阻塞 J06 positive boundary | `Blocked`/manual；不写 H13、不伪造 result/report | H13 owner / Job owner |
| `OBS-CFG-R-003` | high / `precondition_open` | physical store/DDL/index/CAS/UoW/fence capability 未映射 | durable adapter可能破坏 atomicity、cursor、claim、history/outbox；阻塞 affected RuntimeLike store boundary | `07` reality/spike逐 logical contract 证明；能力不足不暴露该 adapter | 架构 / infra / 实施计划维护者 |
| `OBS-CFG-R-004` | high / `precondition_open` | transport/topic/ack/DLQ/schedule/host registration capability 未验证 | entry totality、duplicate completion、exclusive ownership不可证明；阻塞相应 entry boundary | exact typed catalog + prebuilt registrar + group atomicity；缺项 startup fail | infra / Bus / host / entry owner |
| `OBS-CFG-R-005` | critical / `controlled_open` | external adapter不支持 stable token、probe、known-success finalize、historical binding | ambiguous outcome导致 duplicate/wrong target/wrong finalize；阻塞 production effect boundary | capability precheck；Unknown/Unsupported保留 intent 转 manual，不 blind retry | adapter / external / infra owner |
| `OBS-CFG-R-006` | high / `precondition_open` | secret/credential resolver、rotation overlap、old-token resolution未验证 | sensitive material泄露或 old effect 无法恢复；阻塞 selected sensitive binding | ordinary config只存 opaque ref；stage5 private resolution；overlap未证明则 new ref/manual | security / infra / operations owner |
| `OBS-CFG-R-007` | high / `precondition_open` | host 无法执行 separate candidate build、exclusive four-class ownership switch、drain/reconcile | partial exposure、double admission或 false rollback；阻塞 runtime activation boundary | protected candidate -> complete build -> exclusive switch -> drain；unknown先 reconcile | host / runtime / operations owner |
| `OBS-CFG-R-008` | medium / `controlled_open` | retention/lease/retry/batch/parallelism/timeout baseline被当生产默认或 SLO | early release、retry storm、starvation、容量误判；阻塞 production tuning/acceptance | baseline与hard range分离；真实 workload/evidence 前保持 `not_evaluated` | config / operations / test / acceptance owner |
| `OBS-CFG-R-009` | high / `precondition_open` | historical registry/obligation scan/reader retention无 physical owner | old Job/outbox/intent/report 无法恢复或 reader 过早退役；阻塞 migration/retirement | old reader/dual-resolution -> switch-new -> obligation zero -> retire；无 scan 不退役 | infra / migration / operations / plan owner |
| `OBS-CFG-R-010` | high / `future_design_trigger` | 要求 remote/config-center/admin/CLI/multi-file/include/hot reload/in-place swap/automatic LKG | 改变 reader、identity、audit、builder、concurrency、rollback/error contract | current strict DECL/one JSON/allowlisted ENV + cold assembly；future 先回写 `03/04` | architecture / config / runtime owner |
| `OBS-CFG-R-011` | critical / `invariant_guarded` | raw secret/body/locator/hash escape进入 config、log、metric、trace、audit、report 或 evidence | security、privacy与审计可信性失效；affected boundary immediate VETO | redaction-before-serialization、private material、body-free refs、no fingerprint output | security / all implementers / reviewers |
| `OBS-CFG-R-012` | critical / `invariant_guarded` | 配置改变 truth/state/UoW/no-write，Query 写 durable effect，或观测反写 source truth | ownership与业务正确性失效；project-wide immediate VETO | 无相关 key/trait/fallback；configuration只控制已授权技术能力 | architecture / domain / application / reviewer |
| `OBS-CFG-R-013` | critical / `invariant_guarded` | 配置、health、correlation、handoff或 report 被当 verdict/signoff/evidence truth | fabricated acceptance/evidence；release immediate VETO | config ref只作 technical identity；真实 evidence/verdict由 `05/06/07` 授权流程产生 | test / acceptance / evidence / reviewer |
| `OBS-CFG-R-014` | critical / `invariant_guarded` | provider或相邻系统通过 config 引入 non-`L0-core` sibling compile dependency | dependency pruning和 ownership 失效；dependency boundary VETO | runtime opaque binding/port/ref；新增 compile edge先回 architecture/DDD | architecture / dependency reviewer |

## 8. 待确认事项表

| Question ID | Current 状态 | 待确认事项 | 当前影响 / 最迟时点 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|---|---|---|
| `OBS-CFG-OQ-001` | `open_upstream_internal` | I05 payload/schema/encoder/registration 的 canonical owner 与版本集 | 阻塞 I05 fixture、decode、accepted handler；I05 boundary前 | L1-artifact schema/producer owner | slot disabled/startup fail；zero parse/UoW/ack/write |
| `OBS-CFG-OQ-002` | `open_upstream_internal` | I05 exact producer event-to-consumer binding | 阻塞 subscription/registration；I05 boundary前 | L1-artifact producer + Bus/entry owner | 不全订阅、不任选、不字段并集 |
| `OBS-CFG-OQ-003` | `open_controlled` | H13/J06 execution record 与 result owner | 阻塞 J06 positive completion；J06 boundary前 | H13/Job design owner | `Blocked`/manual；不 mint report/result |
| `OBS-CFG-OQ-004` | `precondition_open` | target repository、workspace/Cargo/git/dirty/file reality | 决定真实落点与 boundary；`07` initialization前 | implementation plan / core / future agent | design repo不写代码；仓存在后先 reality check |
| `OBS-CFG-OQ-005` | `precondition_open` | physical store/queue/object-store、DDL/index/partition/CAS/UoW/fence能力 | 决定 durable adapter；对应 boundary前 | architecture / infra / data owner | 只承认 logical contract；能力不足保持 blocked |
| `OBS-CFG-OQ-006` | `precondition_open` | HTTP/RPC/topic/consumer/ack/DLQ/schedule与host ownership mechanism | 决定 entry/activation；对应 boundary前 | Bus / infra / host / operations owner | exact mapping缺失 startup fail；不 partial register |
| `OBS-CFG-OQ-007` | `precondition_open` | real external adapter的token/probe/finalize/historical lookup能力 | 决定 publication/handoff/export；production effect前 | adapter / external / infra owner | Unsupported/Unknown -> intent retained + manual |
| `OBS-CFG-OQ-008` | `precondition_open` | secret provider、locator resolution、credential rotation overlap/old-token strategy | 决定 sensitive binding；rotation/production前 | security / infra / operations owner | root只存opaque ref；无overlap不原地rotation |
| `OBS-CFG-OQ-009` | `controlled_open` | retention/reservation/lease/heartbeat/retry/backoff/jitter/batch/parallelism/timeout生产值 | 决定 resource/recovery；production candidate前 | config / infra / operations / adjacent owner | 用明确 candidate + hard range；不继承README或假default |
| `OBS-CFG-OQ-010` | `precondition_open` | historical registry、global obligation inventory与retirement authority | 决定 old reader/binding removal；migration前 | infra / migration / release / operations owner | old reader/resolver保留；无authoritative zero不retire |
| `OBS-CFG-OQ-011` | `future_design_trigger` | 是否需要 config center/admin override/hot reload/in-place swap/automatic LKG | 当前不支持；进入任何实现范围前 | architecture / runtime / security / operations owner | corresponding source/key/API均reject/absent；先回写design |
| `OBS-CFG-OQ-012` | `open_downstream` | current `05/06` 的case、fixture、workload、artifact、evidence、AC/VETO/reviewer | 决定测试验收与数值；`07` audit前 | test / acceptance maintainers / user | 保持planned/not-run/not-evaluated；不继承旧ID/结果 |
| `OBS-CFG-OQ-013` | `open_downstream` | current `07` phase/task/boundary、reality gate、ledger与all skeleton | 决定implementation handoff；kickoff前 | implementation plan maintainer / user | 不自行拆实现、不复用old skeleton、不移交agent |
| `OBS-CFG-OQ-014` | `open_downstream` | planned scripts、artifact/report schema、evidence index与真实执行目录 | 决定 gate traceability；`07`完成前 | test / acceptance / plan / reviewer | 不创建fake run/artifact/report/alias/pass/signoff |

待确认项均有安全默认和最迟时点。它们不是 implementation freedom；owner未确认时不得选“最方便”的 provider、
product、fallback、route、number、alias、reader 或 recovery branch。

## 9. Step01~13 对 `03` 影响汇总

| Source Step | Current 配置结论 | 是否影响 `03` | Formal / calibration 位置 | 处理状态 |
|---|---|---|---|---|
| Step01 | 只承接 typed root/builder/binding/snapshot，不重定义代码契约 | 否 | formal `03` §13 | 无回写 |
| Step02 | P0/P1/P2与non-goal只限定配置范围 | 否 | formal `00~03` | 无回写 |
| Step03 | raw -> validated -> builder -> runtime/slices/snapshot，11 control planes/23 domains | 否 | formal `03` §5/§13 | 无回写 |
| Step04 | allowed/forbidden 配置化边界；truth/state/UoW/no-write不可配置 | 否 | formal `00/01/03` invariants | 无回写 |
| Step05 | `DECL < one strict JSON < allowlisted ENV`、invalid winner不fallback | 否 | raw reader细节由`04`拥有 | 无回写 |
| Step06 | `LocalTest/IntegrationLike/RuntimeLike`与six lanes document view | 否 | existing profile/mode types | 无回写 |
| Step07 | 6类supporting type、14 Query enum与9 Consumer producer static map定义缺口 | 是 | DDD Step06/08/13/14/17/19；formal §6/§7/§12/§13 | **已回写**；`CFG-BLK-07-01 resolved` |
| Step07 | canonical raw paths、numeric baseline/range、nested JSON/ENV registry | 否 | loader-facing schema由`04`拥有 | 无回写 |
| Step08 | opaque sensitive ref、private material、no-output、cold rotation | 否 | existing builder/security/redaction contract | 无回写 |
| Step09 | locator-free worker/jobs slices、finite metadata、prebuilt registrars、group atomicity | 是 | DDD Step05/07/14/17/19；formal §5/§13/§15/§16 | **已回写**；`CFG-BLK-09-01 resolved` |
| Step09 | strict parse、candidate identity与13-stage complete-or-error assembly细节 | 否 | existing typed root/builder stage semantics | 无回写 |
| Step10 | external host cold switch/drain、external config audit与historical obligation operational gate | 否，current L4 public/business contract未扩展 | host/physical mechanism后置`07` | 无回写 |
| Step11 | 25类failure、Disabled/Unavailable/Misconfigured/Degraded分离 | 否 | existing error/capability semantics | 无回写 |
| Step12 | test/acceptance/implementation/operations handoff | 否 | downstream contract only | 无回写 |
| Step13 | field/schema/digest/store/binding migration与retirement规则 | 否，current first baseline无migration API/store | formal `03` existing historical semantics + future `07` | 无回写 |

Current `03` impact 总计：`2` 个已完成 targeted writeback group，`0` 个 `待回写`，`0` 个
`阻塞待确认`。因此满足 SOP 进入 Step15 的代码契约门禁。

## 10. Future `03` 回写触发器

| Trigger | Required return point | 当前处理 |
|---|---|---|
| new config source/reader/public loader、multi-file/include/config center/admin/CLI | DDD Step04/05/07/12/14/17/19 + formal §4/§5/§11/§13 | unsupported；不得实现key/source |
| hot reload/watch/in-place adapter swap/partial assembly/automatic LKG | DDD Step09/11~14/17/19 + formal §8/§10~§13 | current cold complete assembly only |
| public secret/provider trait、provider-specific root/public error | DDD Step04~07/12/14/17 + architecture as needed | provider detail remains infra-private/product-neutral |
| local durable config audit/history/registry/obligation repository | DDD Step05~07/09~11/14/15/17/19 | external authority/physical mapping first；new local owner blocked |
| L4 public host activation/drain/reconcile port/state | DDD Step05~07/09~14/17/19 | host mechanism留`07`；不能私建public API |
| new schema/digest/binding migration runtime state/error/port | DDD Step06/09~14/17/19 + current `04` Step13 | migration保持document/operational contract |
| application/domain/entry读取raw root/locator/provider availability | DDD ownership/flow review；通常 current VETO | prohibited；least-authority slices only |
| source truth/acceptance/evidence/report authority由配置决定 | return formal `00~03/05/06` owning authority | hard VETO，不提供兼容路径 |

Future trigger 不是 current `是否影响03=是` 的已确认配置结论；它们尚未进入范围，故不能被 Step15 写成支持能力。
一旦 owner 将其纳入范围，状态必须先改为 `待回写` 或 `阻塞待确认`，完成回写后重跑受影响配置 Step。

## 11. Readiness 与阻塞范围

| Check surface | Current state | Blocks | Close at |
|---|---|---|---|
| formal `00~03` baseline | current/consistent | none for Step15 | closed |
| current `04` Step01~14 | completed design records | only formal assembly remains | Step15 |
| I05 two blockers | `open_upstream_internal` | I05 positive boundary only | upstream owner + downstream propagation |
| H13 | `open_controlled` | J06 positive execution/completion only | H13 owner decision |
| remaining 9 affected | `inherited_affected` | exact applicable boundaries | `03/05/07` owner audits |
| physical products/capabilities | `not_established/not_evaluated` | affected RuntimeLike/production boundaries | target reality + `07` spike/gate |
| current `05/06/07` | historical/pending restart | overall implementation kickoff | subsequent M4 documents |
| implementation ledger/skeleton | historical | implementation handoff | rebuilt with current `07` |
| real tests/evidence/verdict | absent/not run | acceptance/release | authorized execution after design/implementation |
| implementation readiness | `blocked` | whole project kickoff | all applicable preconditions closed |

Formal `04` 可以在 Step15 定稿，因为不存在 current `03` 待回写项；这不表示任何 affected production boundary、
整体 implementation kickoff、test、acceptance 或 release 已就绪。

## 12. 未确认前统一处理规则

| 未决类型 | Allowed current statement | Forbidden shortcut |
|---|---|---|
| product/capability unknown | product-neutral typed binding + `not_established` | 写死 vendor/DSN/topic/path/driver default |
| numeric/workload unknown | explicit candidate baseline + hard validation range + `not_evaluated` | 冒充SLO/capacity/acceptance threshold |
| schema/producer unknown | disabled/startup fail before body/UoW/ack | broad allowlist、guessing或private DTO |
| external outcome unknown | retain exact intent/token/binding, probe/manual | blind retry、换token/route、health=>success |
| historical obligation unknown | keep old reader/resolver/material protection | date-only/health-only retirement |
| owner/ref unknown | do not mint/finalize/complete | random/placeholder ref或empty success |
| test/evidence absent | planned/not-run/not-evaluated | fake alias、result、verdict或signoff |
| future feature requested | design-change-required + stop affected scope | hidden key、temporary trait、implementation-only bypass |
| truth/security/dependency violation | immediate VETO | risk acceptance、emergency override或profile exception |

## 13. Formal `04` §14 回填草稿

Formal `04-配置设计.md` 只能在 Step15 装配。§14 应保留以下 current 内容，不复制 calibration 的历史诊断或
执行过程：

1. 三层 blocker/readiness 结论：本轮新 upstream blocker=`none`；12 affected仍open；implementation readiness=`blocked`。
2. 14项风险的 trigger、severity/status、affected scope、安全默认与owner。
3. 14项待确认的状态、最迟关闭点与未确认前行为。
4. Step01~13 impact汇总：Step07/09已回写，current `待回写=0`、`阻塞待确认=0`。
5. Future `03` trigger 与 current unsupported 边界，禁止将其写成可用 key/API。
6. `formal 04 complete != implementation/test/acceptance ready` 的真实性声明。

建议正式章节最小结构：

```markdown
## 14. 风险与待确认事项

### 14.1 风险分类与三层状态
### 14.2 Inherited affected register
### 14.3 风险表
### 14.4 待确认事项
### 14.5 详细设计回写清单
### 14.6 未确认前处理与 readiness
```

## 14. Cross-risk / writeback audit

| Audit item | Verdict | Evidence / rule |
|---|---|---|
| Step01~13 未关闭事项均有 owner/安全默认/最迟时点 | pass | §6~§8 |
| 12 affected exact IDs/status preserved | pass | `2 upstream + 1 controlled + 9 inherited`；closed `0/12` |
| current `03` impact items complete | pass | Step07/09 `已回写`；pending/blocking `0` |
| future impact误写为current contract | no | §10明确design trigger |
| product/physical/numeric/evidence fabricated | no | all remain `not_established/not_evaluated/not_run` |
| query/source truth writeback escape | no | VETO + zero-write/default rules |
| Disabled/Unavailable/Misconfigured/Degraded collapsed | no | Step11 semantics retained |
| old Job/outbox/intent/plan/report current fallback | no | Step10/13 historical obligation retained |
| report/evidence/config ref upgraded to verdict/signoff | no | `OBS-CFG-R-013` VETO |
| formal Step15 gate can open | yes | no `待回写`/`阻塞待确认` current impact item |
| implementation readiness can open | no | current `05~07`/target/boundaries/tests/evidence pending |

## 15. Completion gate

| Gate | Status | Reason |
|---|---|---|
| SOP six questions | pass | §3逐项回答 |
| required risk table | pass | 14 risks with scope/mitigation/owner |
| required question table | pass | 14 questions with current impact/owner/default |
| required `03` writeback list | pass | Step01~13 complete；2 already written back；0 pending/blocking |
| blocker/affected truthfulness | pass | no new upstream blocker；12 affected open；readiness blocked |
| formal body unchanged | pass | formal `04`仍是historical material，Step15前未写 |
| fabrication guard | pass | no implementation/test/evidence/verdict/signoff/commit facts |
| gate_status | `pass_consumed_by_step_15` | 用户连续M4授权允许进入下一Step |
| next_allowed_action | `continue_to_current_step_15_under_continuous_M4_authorization` | 只读取Step15标准与current Step01~14后装配formal `04` |

Current Step14 完成。当前不需要提交；用户未要求 commit。
