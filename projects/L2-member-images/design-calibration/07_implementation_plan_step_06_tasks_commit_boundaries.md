# 07 Step 6：拆分阶段任务、编写顺序与提交边界

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

| 输入 | 来源 | 目的 |
|---|---|---|
| 八 Phase / 24 boundary 草案 | `07_implementation_plan_step_05_phases_dependencies.md` | 固定任务与提交粒度 |
| 模块/对象/协议/flow | `03-详细设计.md` §4~§12 | 绑定代码批次与边界 |
| 配置/测试/验收 | `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` | 绑定提交前门禁 |
| 可落码标准 | `standards/document/设计真相源闭环与可落码性标准.md` §九 | 逐 boundary 经验复核 |
| 提交与台账规则 | 实施计划书写规范、代码实施台账规范 | 固定 Commit/Handoff Gate |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个 Phase 如何写 | 先锁 public contract 和测试切口，再实现 domain/application，随后接 infra/entry；高风险 state/UoW/idempotency/recovery 单独批次 | SOP Step 6、书写规范 §4.7 |
| 每个 boundary 如何描述 | 一句话功能增量 + allowed/forbidden scope + batches + required checks + Commit/Handoff Gate | 台账规范 §6 |
| 何时提交 | 当前 boundary 所有设计/范围/工作区/构建/测试/证据门禁通过且无 blocker 后；当前项目尚不能实际提交 | 实施计划规范 §4.8 |
| 哪些 boundary 必须阻断 | B01/B02、B03、OPEN/PF、MI-UP/Q-MI 影响的正向 mutation/consumer/recovery；目标仓/ baseline 缺失的 activation | 03 §17、05/06 |
| 如何避免过大批次 | 每 boundary 三个可验证批次，目标 100~300 行；状态/UoW/幂等/安全/恢复独立批次；超过 300/500 行必须拆分 | SOP Step 6 |
| 实现 agent 的责任 | 只做二次 baseline/scope/环境校验；遇设计缺口回报并停止，不现场补 schema/port/state | SOP §2.10 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 10 Command/6 Job 具有完整名称 | 可能被当成可直接写入的成功路径 | boundary 只允许合法 shape、zero-effect、blocked mapping，正向 lane 标 blocker |
| Query、projection、trace 交叉 | 可能把 read 修复写入 source | 单列 PH-06，严格 no-write 与 PF blocked |
| 入口模块名称存在 | 可能创建 HTTP/broker/cron 生命周期 | api/worker/jobs 只做 logical mapping/marker/action |
| outbound inventory 为零 | 仍可能沿用兄弟项目 publisher boundary | 不创建 outbound boundary；`NoneAuthorized` 只进 gate audit |
| 24 boundary 数量 | 未来 owner closure 可能改变范围 | 只有正式设计回写后才能调整；调整时同步 ledger/skeleton |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 任务 | capability 名称级 | `IMPL-<phase>-<seq>` 实施动作级 | 可执行、可判定 |
| 批次 | 未定义 | 72 个 planned batch（每 boundary 3 个） | 控制变更规模和高风险隔离 |
| 提交 | 无 | 24 个一 boundary 一 commit 的 planned 边界 | 可 review/回退/证据归属 |
| 设计复核 | 泛化“遵循标准” | 每 boundary 逐项字段/DTO/state/ref/UoW/projection/artifact/phase review | 防止实现端补洞 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一个 Phase 一个 commit | 简单 | diff 过大、风险难定位 | 不采用 |
| 每个文件/struct 一个 commit | 很细 | 噪音大、不能独立表达功能 | 不采用 |
| 每 Phase 三 boundary、每 boundary 三 batch | 规模适中、可验证、可回退 | 台账数量多 | 采用 |

## 结构化中间产物

### 通用编写顺序

```text
project ledger -> current boundary ledger -> required reads
  -> Design/Scope/Worktree Gate
  -> Batch A: contract + fixtures
  -> Batch B: domain/application + high-risk rule
  -> Batch C: infra/entry + targeted tests
  -> Build/Test/Evidence Gate
  -> Commit Gate
  -> Handoff Gate
  -> explicit successor activation
```

关键说明：
- 图表达实现动作顺序，不表达某个对象的完整函数调用链。
- Batch A/B/C 不是提交名；三个批次共同形成一个 boundary 的可验证增量。
- 任一 gate 失败或设计 blocker 未闭，不能进入下一批次或提交。

### Phase 任务与批次表

| Phase | 任务编号（编写顺序） | 实施动作 | 代码批次 | 输出/完成判定 |
|---|---|---|---|---|
| PH-01 | IMPL-01-01 | 建立七 crate workspace 与命名检查 | BATCH-01-01 | 仅 planned layout；目标仓/manifest 核验后才可判定 |
|  | IMPL-01-02 | 建立 contracts/config/composition skeleton | BATCH-01-02 | typed binding；strict parse 入口 |
|  | IMPL-01-03 | 建立 scripts/ledger/test harness skeleton | BATCH-01-03 | 固定参数/path contract |
|  | IMPL-01-04 | 细化 local config/error carriers | BATCH-01-04 | GATE-02 前置输入 |
|  | IMPL-01-05 | 绑定 TestOnly fake isolation | BATCH-01-05 | ci-test-only negative case |
|  | IMPL-01-06 | 初始化 boundary ledger/report shell | BATCH-01-06 | 无实际 report/evidence |
| PH-02 | IMPL-02-01 | 建立 definition/variant typed carriers 与纯 factory | BATCH-02-01 | mapping identity 可构造 |
|  | IMPL-02-02 | 建立 static pin/seed placement/assembly guards | BATCH-02-02 | forbidden body/live negative |
|  | IMPL-02-03 | 建立 revision/derivation application seam | BATCH-02-03 | history/replacement 规则可检验 |
| PH-03 | IMPL-03-01 | 建立 intent/snapshot/attempt/candidate contracts | BATCH-03-01 | state/status carrier |
|  | IMPL-03-02 | 建立 conservative outcome 与 B01/B02 stop | BATCH-03-02 | no UoW/reserve/write |
|  | IMPL-03-03 | 建立 bounded nightly/reconcile selectors | BATCH-03-03 | no scheduler/run/evidence |
| PH-04 | IMPL-04-01 | 建立 provenance/gate/eligibility contracts | BATCH-04-01 | body-free conclusion carrier |
|  | IMPL-04-02 | 建立 Artifact/qualification gap adapter seam | BATCH-04-02 | MI-UP-007/Q-MI-004 blocked |
|  | IMPL-04-03 | 建立 qualification facade/error/redaction tests | BATCH-04-03 | no positive eligibility |
| PH-05 | IMPL-05-01 | 建立 availability/history/entry contracts | BATCH-05-01 | local transition carrier |
|  | IMPL-05-02 | 建立 local supply guard/query | BATCH-05-02 | no consumer readiness |
|  | IMPL-05-03 | 建立 ConsumerHandoffGap entry mapping | BATCH-05-03 | MI-UP-001 blocked |
| PH-06 | IMPL-06-01 | 建立 reference/view/page/marker contracts | BATCH-06-01 | 10 Query response shape |
|  | IMPL-06-02 | 建立 projection freshness/no-write guard | BATCH-06-02 | PF recovery remains blocked |
|  | IMPL-06-03 | 建立 API query/trace/gap mapping | BATCH-06-03 | strict read-only |
| PH-07 | IMPL-07-01 | 建立 two inbound marker carriers | BATCH-07-01 | accepted_input=false |
|  | IMPL-07-02 | 建立 six bounded Job action carriers | BATCH-07-02 | no scheduler/lease/retry |
|  | IMPL-07-03 | 绑定 api/worker/jobs facade-only entries | BATCH-07-03 | no direct store/transport |
| PH-08 | IMPL-08-01 | 建立 fixture、gate/check script parameter shell | BATCH-08-01 | fixed run arguments |
|  | IMPL-08-02 | 建立 report/evidence/redaction derivation shell | BATCH-08-02 | no static pass |
|  | IMPL-08-03 | 建立 controlled smoke/handoff draft tooling | BATCH-08-03 | review_required；不生成实例 |

### 代码批次规则

| 批次类别 | 预计规模 | 必须单独验证 | 不能包含 |
|---|---|---|---|
| Contract/fixture | 100~220 行 | type/shape/body-free tests | domain mutation、external body |
| Domain/application | 120~300 行 | guard/state/error/no-write tests | 后续 Phase result |
| High-risk consistency | 100~260 行 | UoW/version/idempotency/recovery negative | 私加 lease/TTL/global key |
| Infra/entry | 100~280 行 | config/fake/entry mapping tests | provider route、scheduler、transport lifecycle |
| Script/report | 不按行数估算但必须拆 | argument/path/redaction/pairing checks | actual run、静态 verdict |

### 24 个 Commit Boundary 总表

| Boundary | Phase | 一句话目标 | 允许的当前增量 | 明确不包含 | Gate |
|---|---|---|---|---|---|
| `commit-01-a` | PH-01 | 建立七职责 workspace 与 contracts 最小骨架 | layout、package/crate naming、typed carrier skeleton | 业务实现、Core path、binary activation | GATE-01 |
| `commit-01-b` | PH-01 | 建立 strict config/composition 与 local binding | 21 key binding、profile/fake validation shell | remote config、hot reload、secret/body | GATE-02 |
| `commit-01-c` | PH-01 | 建立 scripts、test root 与 ledger shell | gate/report/check parameter contract | actual test/run/report/evidence | GATE-03 |
| `commit-02-a` | PH-02 | 建立 definition/mapping typed domain | definition/ref/factory/invalid source | Role/mapping body、fallback | GATE-04 |
| `commit-02-b` | PH-02 | 建立 static pin/assembly guard | component/seed/base ref、placement、static-live reject | live state、owner release success | GATE-05 |
| `commit-02-c` | PH-02 | 建立 revision/derivation seam | revision history、application mapping | build candidate/digest | GATE-06 |
| `commit-03-a` | PH-03 | 建立 build intent/snapshot/attempt contracts | typed states、immutable snapshot shape | builder success、stored result | GATE-07 |
| `commit-03-b` | PH-03 | 建立 outcome/candidate conservative stop | failed/blocked/unknown mapper、B01/B02 stop | candidate digest/ref | GATE-08 |
| `commit-03-c` | PH-03 | 建立 bounded nightly/reconcile action | explicit page/selector/action marker | scheduler、lease、run/report | GATE-09 |
| `commit-04-a` | PH-04 | 建立 provenance/gate/eligibility contracts | safe conclusion and guard | gate provider/evidence body | GATE-10 |
| `commit-04-b` | PH-04 | 建立 Artifact handoff gap seam | typed handoff ref/gap | Artifact acceptance/formal ref | GATE-11 |
| `commit-04-c` | PH-04 | 建立 qualification service/error/redaction boundary | blocked/unknown/error mapping | positive eligibility | GATE-12 |
| `commit-05-a` | PH-05 | 建立 availability/history/entry contracts | local transition/history carriers | terminal persistence completion (B03) | GATE-13 |
| `commit-05-b` | PH-05 | 建立 local supply guard/query | pinned local entry/read model | consumer launch/health | GATE-14 |
| `commit-05-c` | PH-05 | 建立 consumer gap/facade mapping | `ConsumerHandoffGap`/unavailable | manifest/confirmation | GATE-15 |
| `commit-06-a` | PH-06 | 建立 reference/query/view contracts | 10 Query DTO/view/page/marker | auth/product policy | GATE-16 |
| `commit-06-b` | PH-06 | 建立 projection freshness/no-write guard | existing projection read, blocked rebuild | invented recovery edge | GATE-17 |
| `commit-06-c` | PH-06 | 建立 API query/trace/gap mapping | strict read-only entry | transport route/trace append on read | GATE-18 |
| `commit-07-a` | PH-07 | 建立 marker-only inbound entries | two marker identities, rejected/reopen | envelope/receipt/dedup/write | GATE-19 |
| `commit-07-b` | PH-07 | 建立 bounded six-job action surface | selector/result/error mapping | scheduler/lease/positive mutation | GATE-20 |
| `commit-07-c` | PH-07 | Wire logical entries through facade | api/worker/jobs mapping tests | direct store, event bus, cron | GATE-21 |
| `commit-08-a` | PH-08 | 建立 gate/check script skeleton | fixed args, raw path shell, fixture contract | real test execution | GATE-22 |
| `commit-08-b` | PH-08 | 建立 report/evidence/redaction derivation | same-run index/report shell | static EV/VETO pass | GATE-23 |
| `commit-08-c` | PH-08 | 建立 controlled smoke/handoff drafts | review-required acceptance drafts | verdict/signoff/readiness | GATE-24 |

所有 boundary 的 planned ledger 路径为 `design-calibration/implementation-boundaries/<boundary>.md`；当前只有 `commit-01-a` 可作为 current identity，其他边界必须保持 `planned / wait_until_current`。

## 开工前设计闭环复核（逐 boundary）

复核按 `设计真相源闭环与可落码性标准.md` §九执行。`通过（设计）`只表示字段、来源和边界在设计层可定位，不表示代码、测试或运行结果已经存在；`blocker` 表示受当前 owner、仓库或设计缺口限制的正向路径，必须在实现台账中保持阻断。

| Boundary | 字段 / DTO / 状态闭环 | metadata / idempotency / UoW | projection / artifact / evidence | phase boundary | 结论与处置 |
|---|---|---|---|---|---|
| `commit-01-a` | contracts 最小 carrier 与七职责目录可回指 03 §4/§7；业务字段不在本边界新增 | 当前只建立类型壳，不 begin UoW、不 reserve | 只保留 ledger/report path contract，不产生实例 | 不引用后续 domain/service | `blocker`：目标实现仓缺失；保持 `blocked / wait_design`。 |
| `commit-01-b` | 21 key、profile、binding/error 来源可回指 04 §3~§11 | config snapshot identity 只作 planned carrier；不作业务 idempotency | strict config negative fixture 设计可回指 05 §8/§9 | 不激活 entry、adapter 或 job | `通过（设计）`；实现前仍需目标仓与 toolchain preflight。 |
| `commit-01-c` | script argument/path carrier 可回指 05 §9/§13 | 不创建 result、run 或 replay | raw/report/evidence roots 只写 contract | 不调用后续 phase 产物 | `通过（设计）`；actual run 永远为 `not_started`。 |
| `commit-02-a` | Definition/variant/mapping ref factory 与 invalid source 回指 03 §5/§7/§9 | 当前不执行 mutation；future input 的 key 仍受 B01/B02 | 不生成 candidate 或 evidence | 只做 definition domain | `blocker`：`MI-UP-003`；保留 ref-only/gap。 |
| `commit-02-b` | static pin、component/seed/base ref、placement guard 回指 03 §5/§8/§9 | 不把 live state 当 snapshot；不 reserve | 不声明 release/Artifact | 不实现 consumer 或 builder success | `blocker`：`MI-UP-002/006/008`；只允许 negative guard。 |
| `commit-02-c` | revision/derivation history 与 supersede 状态回指 03 §9/§10 | future version/history 需要 B01/B02 才能写 | 不生成 build digest | 不调用 PH-03 outcome | `blocker`：写路径待重开；仅保留纯映射。 |
| `commit-03-a` | intent/snapshot/attempt/candidate carrier 与状态族回指 03 §7~§10 | canonical input/UoW/result 未闭合（B01/B02） | candidate 只能是 typed relation 壳 | 不进入 qualification | `blocker`：当前只做 state/shape。 |
| `commit-03-b` | outcome/unknown/blocked/failed mapper 有正式错误与 disposition | 不 reserve、不 commit、不恢复 | 不填 digest/ref/result body | 不越过 build phase | `blocker`：B01/B02；禁止成功候选。 |
| `commit-03-c` | bounded selector/page/action marker 可构造 | scheduler/lease/run 不在本边界 | 不生成 nightly report/evidence | 不激活 PH-07 job runner | `通过（负向设计）`；正向调度保持未授权。 |
| `commit-04-a` | provenance/gate/eligibility safe conclusion 可回指 03 §7/§9 | 不伪造 gate evidence 或 stored result | evidence 只保留 body-free ref/gap | 不跨入 Artifact handoff | `blocker`：`Q-MI-004`。 |
| `commit-04-b` | Artifact handoff ref/gap carrier 与 owner boundary 可定位 | 不 mint formal Artifact ref | 不把 ACK/digest 当 Artifact evidence | 不调用 supply | `blocker`：`MI-UP-007`；只做 gap seam。 |
| `commit-04-c` | qualification error/redaction/disposition 对称 | 不做 positive eligibility UoW | 不生成 Passed/Eligible evidence | 不进入 availability | `blocker`：owner/policy pending。 |
| `commit-05-a` | availability/history/entry state 与 transition carrier 回指 03 §9/§10 | terminal persistence 受 `DDD-S11-B03` 阻断 | 不生成 consumer confirmation | 不调用 PH-06 query facade | `blocker`：B03；只保留 local transition shape。 |
| `commit-05-b` | local pinned entry/read model 与 unavailable mapper 可构造 | 不 launch/health/confirm；Query no-write | projection read 只读 existing marker | 不越过 consumer seam | `通过（设计）`；positive supply 仍 pending。 |
| `commit-05-c` | `ConsumerHandoffGap`、unavailable、reopen carrier 对称 | 不写 consumer truth 或 result | 不创建 manifest/ref confirmation | 不接 member-service implementation | `blocker`：`MI-UP-001`。 |
| `commit-06-a` | 10 Query request/response/page/marker names 与 03 §7.2 闭合 | Query 明确无 UoW/reserve | view/ref/projection source 可回指 | 不调用 jobs/recovery | `通过（设计）`；必须保留 no-write。 |
| `commit-06-b` | freshness/rebuild disposition 与 `PF-UNAVAILABLE-RECOVERY` 可定位 | 不由 Query 修复 truth | existing projection marker 只读；rebuild 为 blocked | 不增加 recovery edge | `blocker`：PF；保持 `Unavailable`。 |
| `commit-06-c` | API mapper 的 visible/not-visible/degraded/unavailable 对称 | entry 不生成 metadata/key 或 trace | report/evidence 仅 planned path | 不绑定 HTTP/transport route | `通过（设计）`；只做 logical mapping。 |
| `commit-07-a` | 两条 inbound marker carrier 与 `accepted_input=false` 闭合 | 无 envelope/receipt/dedup/UoW | 不产出 event artifact | 不激活 Bus | `blocker`：`MI-UP-005`；marker-only。 |
| `commit-07-b` | 六 Job input/result/error/selector 结构与 03 §7.4 闭合 | no scheduler/lease/retry/reserve；B01/B02 stop | job report 仅 planned shell | 不调用 recovery implementation | `blocker`：B01/B02、PF。 |
| `commit-07-c` | api/worker/jobs facade mapping 不新增 DTO | 不直连 store/adapter/event bus | 不产出 entry evidence instance | 不改变职责边界 | `通过（设计）`；目标仓缺失仍阻断激活。 |
| `commit-08-a` | fixture/check argument schema 可回指 05 §9 | 不把 script run 当 idempotency/result | raw writer path 固定但不写实例 | 不读取未来 report | `通过（设计）`；只建 planned tooling。 |
| `commit-08-b` | report/evidence index identity 与 raw pair 规则闭合 | same-run pairing 只由 future raw 产生 | no-static-evidence、redaction、digest 规则可审查 | 不生成 acceptance verdict | `通过（设计）`；当前无 raw/report。 |
| `commit-08-c` | smoke/handoff draft 字段只回指 05/06 | 不签署、不 risk-accept、不 readiness | acceptance drafts 必须 `review_required` | 不改变 06 authority | `blocker`：owner/implementation 未闭；只可规划草稿。 |

## Commit boundary 经验适用性复核

下表是设计者在移交实现前完成的经验扫描。`不适用`必须给出原因；`blocker` 不交给实现者现场补齐。

| Boundary | 适用经验项（标准 §九） | 不适用项及理由 | 结论 | 设计者处置 |
|---|---|---|---|---|
| `commit-01-a` | 字段/DTO、phase boundary、shared type、目录/依赖 | outbox、projection rebuild、artifact materialization：尚未建立 | `blocker` | 等目标仓与 Core carrier 核验；不写代码。 |
| `commit-01-b` | 配置绑定、sensitive/redaction、support carrier | 状态迁移、stored result：本边界不推进 truth | `通过（设计）` | 保留 strict/fail-closed。 |
| `commit-01-c` | artifact materialization、machine artifact schema、entry args | domain transition、outbox：脚本壳不触发业务 | `通过（设计）` | 保持 planned/not_generated。 |
| `commit-02-a` | ref identity、validation truth、factory 初始状态、字段闭环 | projection rebuild、public job：非当前对象 | `blocker` | `MI-UP-003` 未闭。 |
| `commit-02-b` | static/live、support carrier、跨 ref guard、状态字段 | stored result、event：不写外部协作 | `blocker` | `MI-UP-002/006/008` 未闭。 |
| `commit-02-c` | history record、version、supersede、phase reserved | artifact、query status：不产生 read model | `blocker` | 等 B01/B02。 |
| `commit-03-a` | service input、state、phase boundary、metadata source | outbox/publisher：inventory 为零 | `blocker` | 只保留 typed state。 |
| `commit-03-b` | outcome mapper、error enum、no-write、unknown | projection rebuild：不做 recovery | `blocker` | B01/B02 stop。 |
| `commit-03-c` | public job surface、bounded selector、entry args | UoW/replay：当前 job 不写 | `通过（负向设计）` | 不加 scheduler/lease。 |
| `commit-04-a` | evidence/gate source、safe conclusion、status truth | history transition：本边界不推进 availability | `blocker` | `Q-MI-004` 保持 gap。 |
| `commit-04-b` | artifact materialization、ref identity、owner boundary | job report：不生成 report | `blocker` | `MI-UP-007` 保持 pending。 |
| `commit-04-c` | error/disposition、redaction、validation truth | public event：outbound 为零 | `blocker` | 禁止 positive eligibility。 |
| `commit-05-a` | state matrix、history factory、version/append | artifact/report：不产生证据 | `blocker` | B03 回写条件明确。 |
| `commit-05-b` | query/projection read、status marker、no-write | UoW/replay：local supply 未授权写 | `通过（设计）` | 只读 existing local truth。 |
| `commit-05-c` | handoff carrier、ref/gap、phase boundary | outbox、publisher：无 outbound | `blocker` | `MI-UP-001` 等待。 |
| `commit-06-a` | Query response/view/page、visibility/freshness source、no-write | idempotency：Query 不 reserve | `通过（设计）` | 保持 10 Query exact names。 |
| `commit-06-b` | projection rebuild source、freshness mapper、no-repair | public job：重建 job 后置且 blocked | `blocker` | PF 未闭。 |
| `commit-06-c` | API disposition、entry context source、safe error | transport lifecycle：不选 HTTP/broker | `通过（设计）` | logical facade-only。 |
| `commit-07-a` | inbound protocol、marker/error、event owner | receipt/dedup/UoW：owner contract 未闭 | `blocker` | `accepted_input=false`。 |
| `commit-07-b` | public job schema、bounded action、error/result symmetry | persistence/replay、scheduler：均未授权 | `blocker` | B01/B02/PF stop。 |
| `commit-07-c` | facade I/O、phase boundary、entry local args | event/outbox：不接 Bus | `通过（设计）` | 禁止 direct store/transport。 |
| `commit-08-a` | machine artifact schema、entry args、redaction | domain/status：脚本不改变 truth | `通过（设计）` | no actual run。 |
| `commit-08-b` | evidence pairing、digest/canonicalization、report materialization | business UoW：不产生事实 | `通过（设计）` | no static evidence。 |
| `commit-08-c` | acceptance handoff、artifact/report pairing、phase exit | positive owner qualification：尚未选择 | `blocker` | `review_required`，不写 verdict。 |

## Boundary 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 一句话描述 | 24 个 boundary 均可用一个实施动作描述 | 无；名称与 Phase 对齐。 |
| 独立 review / 验证 / 回退 | 每个 boundary 只聚合同一可验证增量，三批次可单独检查 | 当前仅 `commit-01-a` 可称 current，其余等待前序。 |
| 设计闭环 | local、negative、marker、query-no-write、planned tooling 已闭合 | mutation/UoW/replay/recovery/owner positive 继续 blocker。 |
| 提交粒度 | 一 boundary 一 planned commit；不按文件/struct 拆分 | 未来 owner closure 若改变范围，必须同步 Step 5/6、ledger、skeleton。 |
| 证据归属 | boundary -> Gate -> suite -> TC/EV -> fixed path 可回指 | 所有 artifact/report/evidence 仍 `not_generated`。 |

## 跨 boundary 依赖、门禁与证据审计

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 依赖顺序 | `01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08`，每 Phase 三 boundary | 不允许跨阶段调用后续对象。 |
| phase 越界 | Query、marker、job 和 report 不反写前置 truth；PH-04 不消费 PH-05 confirmation | 若发现越界，回写 03/04/05 后重开 boundary。 |
| 测试重复 / 缺失 | 24 Gate 各有 planned TC/EV/suite 入口；共享 negative case 由 owning suite 归属 | 执行期不得跨 run 拼接或重复计数。 |
| artifact / report 归属 | raw 在 `artifacts/test/<run_id>`，report 在 `reports/runs/<run_id>`，acceptance 在 `reports/acceptance` | 目前均未创建实例。 |
| blocker 传播 | B01/B02、B03、OPEN/PF、MI-UP、Q-MI 在受影响边界保留 `blocked/gap/unknown` | 不得借 boundary 完成宣称 readiness。 |
| 当前激活身份 | 仅 `commit-01-a` | 目标仓缺失，当前 `blocked / wait_design`。 |

## 回填草稿（供正式 07 §6）

实施按八个 Phase、24 个 commit boundary、每 boundary 三个 planned batch 组织。每一 boundary 在实现前必须完成字段/DTO、状态、ref identity、validation truth、metadata/idempotency、projection/artifact、phase boundary 和证据归属复核；遇 B01/B02、B03、OPEN/PF 或 owner pending 时，只能实现设计允许的 pure contract、no-write、marker、gap 或 bounded selector。当前 `commit-01-a` 因目标仓缺失和 baseline 未冻结保持 `blocked / wait_design`，其余 boundary 为 `planned / wait_until_current`。

## 待确认事项

1. 目标实现仓何时建立、初始用户改动与 immutable design baseline 如何固定。
2. `MI-UP-001~009`、`Q-MI-001~004` 和 DDD/PF blocker 的 owner closure 是否改变任何 boundary。
3. 若 `L0-core` shared carrier 尚未导出，是否先由 Core owner 完成上游闭口，而不是在本仓复制类型。
4. 未来实际 evidence runner 的 machine JSON schema、digest algorithm 和 report writer 是否按 05/06 保持不变。

## 进入 Step 7 条件

- 24 boundary 均有任务、批次、允许/禁止范围、设计经验复核、Gate、Commit Gate 和 Handoff Gate。
- 跨 boundary 依赖、测试、证据和 blocker 传播没有未登记冲突。
- 当前实现状态、目标仓缺失和无实际执行事实已写入项目级台账与后续 Step 输入。
- 用户已授权继续本轮 07；Step 7 仅规划门禁，不启动测试执行。

**Step 6 结论：`completed_with_explicit_blockers`。**
