# L2-runtime 05 测试方案 Step 2：测试目标、范围与非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填位置：正式 `05-测试方案.md` §2
> 输入：`05_test_plan_step_01_input_boundary.md`、当前正式 `00/03/04`
> 状态：`completed_continuous_authorized`

## 1. 本步目标与边界

本 Step 固定本轮测试设计要证明的系统性质、P0/P1/P2 口径和明确非范围。它不创建测试切口、TC、suite、数据集、脚本或证据实例；这些由 Step 3 以后推导。

### 1.1 SOP 问题回答

| SOP 问题 | 当前结论 |
|---|---|
| P0 必须证明什么？ | 在 deterministic local、blocked adapter 和隔离 fake 条件下，Runtime 能以正式主体/scope 驱动有界 loop，维护 run/goal-plan/context/memory/model/action/delegation/checkpoint/recovery/outcome/handoff local truth；所有 protocol、state、UoW、replay、unknown、redaction、owner 边界可判定。 |
| P1/P2 如何处理？ | P1 只做结构性 performance characterization、冷替换/rollback 设计验证和可选非核心能力分解，不设无来源数值阈值。P2 包括外围增强和真实跨 owner positive qualification，只保留边界、入口条件和 blocked 状态。 |
| 哪些下游能力只测接缝？ | Tools、Hub、Method、Governance、Sandbox、Observability、Artifact、model、durable memory、Bus、entry/product 均只测 Runtime 消费接缝、失败映射和 no-write；不测对方内部完整实现。 |
| 非范围有哪些残余风险？ | 外部正向执行、provider、durability、delivery/observed、production entry 和具体产品未被证明；对应 blocker 原样传递，不能被 P0 local success 冲掉。 |
| 哪些范围项关联一票否决？ | owner truth 侵入、fail-open/host fallback、forbidden body、unknown 盲重试、外部状态反写、fake/plan 冒充 readiness、非 Core package 依赖、无法回指 current formal source，分别对应 `VF-L2R-001~008`。 |

## 2. 当前文档诊断与前后差异

| 维度 | 旧 Step 2 / 正式 05 | 当前重建结论 | 原因 |
|---|---|---|---|
| 状态范围 | `SM-01~18` | current `SM-01~SM-31` 全部 P0 | `03` §9 唯一 canonical registry 已扩展 |
| 配置变化 | reload/N+1/reject-new/LKG 为 P1 | startup-only、operation/page capture、whole-document cold replacement/rollback | `04` 明确无 in-process reload |
| protocol 分母 | 17/12/6/6/7 + 18 SM | 17/12/6/6/7 + 31 SM；切口和 case 数后续重新推导 | 旧 state denominator 已失效 |
| external integration | 与 local plan 混列 | positive lane 独立 `blocked_dependency`，不减少 local P0 | 防 fake/blocked 变成 skip/pass |
| evidence/suite | 旧 109 slots / 12 suites 反向进入范围 | 本 Step 不继承任何数量；由新 cut/case 推导 | 严守 Step 独立判断 |
| Rust | 作为测试实现事实描述 | 仅承接 planned Rust 2024/1.93 contract；build/toolchain 未验证 | `L2R-LANG-001` |

## 3. 本轮测试目标

| 目标 ID | 优先级 | 要证明的性质 | 不等价于 |
|---|---:|---|---|
| `TGO-L2R-01` | P0 | public envelope、typed ID/ref/scope/correlation/digest/error 均可构造、拒绝和安全序列化 | Core exact package 已绑定 |
| `TGO-L2R-02` | P0 | loop kernel 每次只执行一个有界 operation，lease/step/cursor/budget/no-progress/hard-yield 不变量成立 | scheduler 或 async runtime ready |
| `TGO-L2R-03` | P0 | CAP-01~12 的 local domain/application 语义、写集、状态、历史和 replay 可确定验证 | 外部 owner success |
| `TGO-L2R-04` | P0 | 17 Command、12 Query、6 inbound、6 outbound、7 Job 每个独立 protocol/Flow 可测试 | aggregate smoke 代替逐项测试 |
| `TGO-L2R-05` | P0 | `SM-01~SM-31` 每个正式状态主体的合法/非法迁移、stale CAS、replay 与 unknown fence 可验证 | 旧 18-state subset 足够 |
| `TGO-L2R-06` | P0 | local UoW、reservation、inbox/outbox、CAS、lease/page/cursor 和 external-call phase 不产生 partial truth 或重复 effect | 物理 DB/broker durability 已证明 |
| `TGO-L2R-07` | P0 | 13 dependency slots 和所有 owner seam 在 missing/stale/conflict/pending/unavailable/unknown 下 fail closed，zero bypass | fake/adapter 是真实 qualification |
| `TGO-L2R-08` | P0 | strict config 的 12/153/39/13x5/7x6、V0~V12、snapshot capture、cold replacement ceiling 可验证 | 配置已部署或热更新 |
| `TGO-L2R-09` | P0 | forbidden body、secret、raw external material、hidden reasoning 和高基数内容不进入 truth/event/checkpoint/handoff/report | Observability backend 已交付 |
| `TGO-L2R-10` | P0 | 测试 raw/report/candidate-evidence 设计保持 same-run、可追溯、失败保留且不产生 verdict | 当前已有 artifact/evidence |
| `TGO-L2R-11` | P1 | 固定 workload/profile 下分解 local 与 external wait，检查有界性和回归趋势 | 数值 SLA/SLO 已批准 |
| `TGO-L2R-12` | P2 blocked | 为真实 Tools/Sandbox/model/memory/checkpoint/Bus/Obs/entry qualification 固定独立入口条件 | 当前 positive integration 可执行 |

## 4. 范围与优先级矩阵

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / ceiling |
|---|---|---:|---|---|
| shared vocabulary / envelope / error | local contract | P0 | type、scope、digest、body-free、deterministic mapping | 不补 Core schema |
| loop activation / step / continuation / yield | local domain/service | P0 | one activation/step、T1/T2/T3、lease/budget/no-spin | 不选 scheduler/runtime |
| admission / control / run | local domain/service | P0 | negative admission zero run、resume proof、terminal freeze | 不取消外部执行 |
| goal-plan / progress / reflection proposal | local truth | P0 | revision graph、CAS、once-only fact、candidate != active | 不成为 Work/Process truth |
| context / working memory / retrieval mediation | local + ref seam | P0 | deterministic order/budget/freeze/use/gap/working-only | 不写 durable body/index/lifecycle |
| model intent / binding / turn / decision | local + adapter seam | P0 local/negative | provider-neutral、ephemeral body、late/unknown fence | 不测 provider route/secret/quota/cost |
| action / guard / attempt / feedback | local + Tools seam | P0 local/negative | five-owner guard、record-before-call、no Executed、once-only feedback | 不证明 Tool/Sandbox execution |
| delegation / child incorporation | local + child seam | P0 local/negative | strict subset、budget、isolated context、once-only result | 不拥有 member/container lifecycle |
| checkpoint / recovery / continuation | local + CP seam | P0 local/negative | Prepared != Committed、matching receipt、Unknown no-resume | 不证明 physical durability |
| outcome / handoff / projection | local + event/ref seam | P0 local/negative | one local outcome、attempt/gap、delivery/observed split、history-only rebuild | 不证明 downstream acceptance |
| Commands C01~C17 | protocol/Flow | P0 | 每项 schema、idempotency、UoW、error、phase | 不由 facade smoke 替代 |
| Queries Q01~Q12 | protocol/read | P0 | visibility-first、freshness、zero UoW/write/refresh | 不把 view 当 truth |
| inbound E01~E06 | event/worker | P0 | source/schema/order/dedupe/late/collision、receipt before ACK | 不证明 broker delivery |
| outbound O01~O06 | event/outbox | P0 | commit-time immutable snapshot、stable ID/digest、exact republish | publish receipt != observed |
| Jobs J01~J07 | operation/job | P0 | lease/page/cursor/report、partial/unknown、same page resume | 不拥有 scheduler lifecycle |
| state registry SM-01~31 | domain state | P0 | every legal edge、all nonlisted illegal edges、stale/replay/fence | 不允许全局 state manager 替代 |
| repository/UoW/concurrency/re-entry | persistence contract | P0 | expected version、unique key、CAS、local-first、unknown | 不证明具体 DB isolation |
| 13 external slots / blocked adapters | boundary contract | P0 negative | exact slot tuple、typed result、zero call、no Ready | positive provider qualification blocked |
| strict configuration | config/service | P0 | `CFG-T01~15` 全切片和 no-secret/no-partial-publication | 不定义 path/mount/deploy command |
| observation / audit candidate | local/event | P0 | phase/ref/redaction/cardinality、candidate != evidence | 不测试 backend retention/storage |
| entry Api/Worker/Jobs/TestFake | entry/service | P0 | authority/profile/facade-only/fake isolation | 不测试 product/member lifecycle |
| structural performance characterization | NFR | P1 | bounded workload、stage decomposition、trend baseline format | 无数值 pass threshold |
| cold replacement/rollback orchestration | config/operations seam | P1 design + P2 real | full validation、truth separation、Unknown/manual | 不声明部署拓扑或 rollback success |
| peripheral experiments `FR-L2R-E01~E04` | future/read-only | P2 | only source/no-write/no-effect boundary | 不进入当前 P0 completion denominator |
| external positive qualification | integration | P2 blocked | owner contract+adapter+profile+real implementation 后独立执行 | blocked 不计 pass/skip |

## 5. 非范围、风险归属与防串线

| 非范围 | Owner / 后续去向 | 当前残余风险 | 05 必须留下的边界 |
|---|---|---|---|
| Tools execution / Tool truth | L2-tools | action positive path 未证明 | attempt/marker/zero bypass/blocked outcome |
| capability registry / exposure truth / external adapters | Capability Hub | capability qualification 未证明 | read-only safe view、no registry write |
| Method/Role/Process body/source | Method Library | dirty source、immutable baseline 未闭 | typed ref/version/freshness、no body/commit claim |
| approval / Policy effective truth | Governance | positive binding 未证明 | missing/stale/conflict/unknown fail-closed |
| Sandbox isolation/capture/cleanup | Sandbox via Tools | isolation readiness 未证明 | no direct slot、host fallback zero call |
| model provider control plane | model owner | provider integration/quality/cost 未证明 | provider-neutral finite disposition、no raw body |
| durable episodic/semantic lifecycle | memory owner | durable memory capability未证明 | retrieval/ref/candidate/gap only |
| Bus routes/delivery/DLQ | Bus owner | event positive delivery 未证明 | local inbox/outbox/exact replay only |
| Observability backend/audit/evidence truth | Observability | observed/retention/readiness 未证明 | body-free candidate/attempt/gap only |
| Artifact/report/evidence/verdict body | Artifact/acceptance owners | downstream consumption 未证明 | typed ref/candidate；no body or verdict |
| member-service/container/image/product/marketplace | downstream owners | production entry 未证明 | typed entry authority only |
| async runtime/transport/DB/broker/scheduler/provider SDK | implementation/operations | build/physical semantics 未证明 | product-neutral contract；selection triggers review |
| actual scripts/runs/reports/evidence | target implementation/test lifecycle | 当前无法执行或验收 | all outputs remain planned/not-created |

## 6. Blocker lane 口径

| Lane | 当前允许范围 | 状态上限 | 不得计入 |
|---|---|---|---|
| `local_deterministic` | pure domain、service+fake/spy、logical repository、strict config | planned runnable after implementation | external integration/readiness |
| `negative_boundary` | missing/stale/conflict/reject/unavailable/unknown、zero-call/no-write | planned runnable after implementation | provider success |
| `blocked_adapter` | exact blocker/slot/posture、BuildDisposition Blocked | expected blocked behavior | skip/pass or blocker closure |
| `integration_candidate` | owner contract frozen但real qualification不全的 contract lane | `blocked_dependency/not_runnable` until all entry gates | P0 local pass replacement |
| `positive_qualification` | real owner implementation/profile/evidence all present | unavailable today | any current completion claim |

## 7. 正式 §2 回填草稿

本轮 P0 目标是证明 Runtime 在确定性本地、blocked adapter 和隔离 fake 条件下具备完整且 fail-closed 的运行编排语义：七 crate 边界、loop kernel、CAP-01~12、17 Commands、12 Queries、6 inbound Events、6 outbound Events、7 Jobs、`SM-01~SM-31`、UoW/CAS/inbox/outbox/lease/cursor、13 external slots、strict configuration、observation/redaction 和 entry isolation 都必须可独立验证。P0 local completion 不等于任何 Tools/Sandbox/model/memory/checkpoint/Bus/Observability/entry positive readiness。

P1 只覆盖固定 workload/profile 下的结构性性能分解、趋势和 cold replacement/rollback 的设计语义，不使用无来源数值阈值。`FR-L2R-E01~E04`、具体产品、真实跨 owner integration 和 production qualification 属于 P2/future/blocked。所有非范围均保留 owner、风险和 fail-closed test boundary，不得通过 fake、planned suite、blocked case 或静态文档计为通过。

## 8. Step 2 停审

| 审查项 | 结论 |
|---|---|
| P0 能证明完整 Runtime local 主链 | pass |
| 48 protocol/job 与 31 state 未因 blocker 缩分母 | pass |
| P1 无来源阈值已排除 | pass |
| P2 positive lane 与 local P0 分离 | pass |
| 每个非范围有 owner、风险和 boundary | pass |
| VF-L2R-001~008 均进入 P0 redline 方向 | pass |
| 未创建 cut/TC/EV/suite/path | pass |
| 新增 blocker | none |

```text
step_status = completed_continuous_authorized
next_step = Step 3
formal_05_write_allowed = false_until_step_15
```
