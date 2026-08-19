# L2-runtime 05 测试方案 Step 1：确认测试输入边界

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填位置：正式 `projects/L2-runtime/05-测试方案.md` §1
> 重开日期：2026-08-17
> 状态：`done_stop_review`
> 当前模块：`input_boundary`
> 正式 05 写入：`locked_until_step_15`

## 1. Step 状态

| 项 | 当前结论 |
|---|---|
| 当前 Step | Step 1 / 确认测试输入边界 |
| 执行模式 | `full-restart + single-agent-serial` |
| 输入基线 | 当前正式 Runtime `00~04`；专项上游当前正式链；当前标准与 SOP |
| 历史材料 | Runtime 旧正式 `05/06/07`、旧 05 flow/Steps、README 和旧依赖顺序材料 |
| 本步结论 | 输入足以继续设计 local deterministic、negative、blocked-aware 测试；不满足任何 external positive integration、真实执行或 readiness 声明 |
| 内部设计缺口 | 未发现必须回写 `00~04` 才能完成 Step 1 的缺口 |
| 开放门禁 | 11 个 canonical blocker 原样保留；`L2R-LANG-001` 单列为实施前置，不并入 11 个 external blocker |
| 下一动作 | 停审；只有用户再次明确确认后才可创建或更新 Step 2 |

## 2. 本步目标、输入与输出

### 2.1 本步目标

确认测试方案依赖的需求、架构、概要、详细设计、配置设计和验收方向是否充分，固定输入权威顺序、依赖类型、历史污染及 blocker 测试姿态，使后续测试范围和测试切口只能从当前正式设计推出。

本 Step 只回答：

- 哪些文档和契约是当前测试设计真相源。
- `00~04` 各自向 05 提供什么输入。
- 哪些专项上游只允许测试 Runtime 的消费接缝和非所有权。
- 哪些开放项允许 negative/fake lane，哪些 positive claim 必须禁止。
- 哪些旧测试、验收和实施材料不得继承。

本 Step 不定义 P0/P1/P2、完整测试对象、测试切口、用例、数据、环境、suite、script、证据编号、路径、阈值或验收裁决；这些分别属于后续 Step。

### 2.2 本步输入

| 输入层 | 文件 / 范围 | 效力 | 本步用途 | 禁止继承 / 越界 |
|---|---|---|---|---|
| 流程与结构 | 测试 SOP、测试方案书写规范 | normative authority | Step 1~15 顺序、正式 15 章、输入边界字段 | 旧流程完成状态、旧章节自由命名 |
| 通用标准 | 通则、中间产物规范、真相源闭环标准、依赖裁剪规则 | normative authority | 三层门禁、可落码性、no-fabrication、依赖分类 | 以 README、工作文档或历史实现猜测覆盖标准 |
| Runtime 需求 | 正式 `00-需求文档.md` | current formal | FR/BR/NFR/AC/VF、owner、数据与禁止边界 | 新增需求、验收阈值或功能编号 |
| Runtime 架构 | 正式 `01-架构设计.md` | current formal | owner、依赖方向、交互、truth/phase 红线 | 重选架构、框架、部署或产品 |
| Runtime 概要 | 正式 `02-概要设计.md` | current formal | 八个业务组成部分、五个技术层、对象/接口/流/状态轮廓 | 用概要旧名覆盖详细设计 canonical name |
| Runtime 详细 | 正式 `03-详细设计.md` | current direct oracle | Rust 边界、七 crate、12 capability、对象/Port/协议/Flow/SM/UoW/error/concurrency/observation/test cuts | 在 05 补字段、状态、Port、error、事务或流程 |
| Runtime 配置 | 正式 `04-配置设计.md` | current direct oracle | strict JSON、profile、slot/job、validation、snapshot、cold change、failure、CFG-T 输入 | online reload、LKG、默认值、未定义 key 或 readiness |
| 专项上游 | Tools/Hub/Method/Sandbox/Observability/L0/L1 当前正式链及台账 | current seam truth with caveats | owner contract、runtime/event/ref/adapter/fake 边界 | 测试对方内部实现、私补 pending schema 或伪造资格 |
| 验收方向 | 正式 `00` 的 `AC-L2R-001~036`、`VF-L2R-001~008` | acceptance direction | 后续追溯与未来 evidence handoff 的方向 | 使用旧 06 的 denominator、verdict 或 signoff 作为当前事实 |
| 下游历史 | 旧正式 `05/06/07` 与旧校准材料 | `historical_material` | 污染、差异和越界审计 | 旧 TC/EV/suite/script/path/result/readiness/implementation status |

### 2.3 本步输出

- 权威与效力清单。
- Runtime `00~04` 到正式 05 章节的输入映射。
- compile/runtime/event/ref/adapter/fake 接缝分类。
- 历史污染清单。
- 11 个 canonical blocker 的测试姿态表。
- “不再回答 / 必须回答”清单。
- 正式 05 §1 回填草稿和 Step 2 门禁。

## 3. SOP 应问问题与回答

| SOP 问题 | 当前回答 | 直接依据 |
|---|---|---|
| 测试方案承接哪些需求、规则和非功能目标？ | 承接 20 项核心 FR、4 项外围增强方向、44 项 BR、19 项 NFR、36 项 AC 和 8 项 VF；核心是 run/goal-plan、context/memory、model decision、action/delegation、checkpoint/recovery/outcome/handoff 五闭环。外围增强只保留边界方向，不自动进入当前范围。 | `00` §§7、9~15 |
| 哪些概要 / 详细设计章节直接影响测试对象？ | `02` §§4~13 提供八个业务组成部分、技术分层、对象/API/流/状态/异常轮廓；`03` §§4~15 提供七 crate、12 capability、对象/Port/协议/Flow、31 个 SM、持久化/UoW、错误恢复、并发幂等、配置绑定、观测和最小验证清单。 | `02` §§4~13；`03` §§4~15 |
| 哪些验收项需要 05 提供证据方向？ | `AC-L2R-001~036` 和 `VF-L2R-001~008` 都需要未来真实测试证据支撑；05 只设计如何产生可追溯候选，不生成 evidence instance，也不做裁决。 | `00` §14；测试方案规范 §2.5 |
| 哪些内容不应在 05 重新定义？ | 需求编号、owner、数据 truth、架构方向、代码对象/字段/状态/Port/error/Flow/UoW、配置 key/lifecycle、外部 owner truth、验收门槛/verdict、实施语言实测/commit/readiness。 | 测试 SOP §§1~2；书写规范 §2 |
| 当前上游是否存在会阻塞测试设计的缺口？ | 存在 11 个 canonical blocker，另有 `L2R-LANG-001` 实施前置。它们不阻塞 local deterministic、negative、blocked-aware 方案设计；它们阻塞受影响 positive integration、真实 runner/test、artifact/report/evidence 和 readiness。 | `03` §§1.4、17；`04` §§1、14 |

## 4. 权威顺序与设计输入总览

### 4.1 当前权威顺序

```text
current standards + test SOP/writing rules
  -> current Runtime formal 00 -> 01 -> 02 -> 03 -> 04
  -> current upstream formal seam truth + ledgers
  -> Runtime 00 AC/VF acceptance direction
  -> historical 05/06/07 only for pollution audit
```

关键说明：

- 同一事实发生冲突时，当前标准和已经闭合的 Runtime `00~04` 优先。
- `03` 是代码契约直接 oracle；`04` 只在既有 code contract 内固定配置语义。
- 专项上游只提供其 owner 范围内的 current seam truth；dirty workspace 不等于 immutable baseline。
- 旧 05/06/07 不具备反向定义 `00~04` 的权力。

### 4.2 当前输入充分性

| 设计维度 | 当前输入是否足够 | 可继续设计什么 | 仍禁止什么 |
|---|---|---|---|
| local domain semantics | 足够 | construction、invariant、state、illegal transition、replay/late/unknown | 声称已有实现或测试通过 |
| application/Flow | 足够 | 命令/事件/Job 的 UoW、call order、failure/reconcile 断言方向 | 补写不存在的 Flow 或外部 success |
| query/read boundary | 足够 | visibility、freshness、empty/degraded/unknown、zero-write | 将 projection/observed 当 truth |
| configuration | 足够 | strict parsing、mapping、cross-field、startup snapshot、cold replacement | hot reload、online LKG、部署完成事实 |
| external seams | negative/fake 足够；positive 不足 | typed blocked/unavailable/unknown、zero-call、owner no-write | provider/execution/delivery/observed/readiness |
| implementation/toolchain | 设计输入足够；现实输入不足 | 未来 preflight 与 planned checks 的边界 | build/test command、commit、coverage、artifact |
| acceptance | 方向足够；裁决输入不足 | AC/VF trace direction | verdict、risk acceptance、signoff |

## 5. Runtime `00~04` 输入映射

### 5.1 需求输入映射

| `00` 输入族 | 当前库存 | 测试方案后续落点 | 本 Step 不提前决定 |
|---|---:|---|---|
| 核心功能 | `FR-L2R-001~020` | §2 范围、§3 切口、§5 追溯、§6 场景 | priority、TC 数量、suite |
| 外围增强 | `FR-L2R-E01~E04` | §2 非范围/P1/P2 判断、§14 风险 | 是否进入本轮可执行范围 |
| 业务规则 | `BR-L2R-001~044` | §3 owner/invariant 切口、§6 negative、§10 专项 | 具体 case/variant |
| 非功能 | `NFR-L2R-001~019` | §4 分层、§10 非功能、§12 gate、§14 residual | 无来源数值阈值 |
| 验收方向 | `AC-L2R-001~036` | §5 traceability、§13 future evidence handoff | verdict / pass 条件实例 |
| 一票否决方向 | `VF-L2R-001~008` | §5、§10、§12、§14 | severity 实例或已触发结论 |
| 数据归属 | Runtime truth/snapshot/ref/derived/forbidden body | §3/§6/§7/§10/§13 | 新 owner 或持久化正文 |

### 5.2 架构与概要输入映射

| 来源 | 当前设计输入 | 测试方案消费方式 | 不在 05 回答 |
|---|---|---|---|
| `01` §4/§9 | Runtime local truth、外部 owner、local-first 与 no reverse-write | owner/write-spy、phase separation、negative boundary | owner 重分配 |
| `01` §8 | only-Core compile；其余 runtime/event/ref/adapter/fake | dependency/static/contract/environment 输入 | 新 package graph |
| `01` §10/§13 | sync/event/job 交互、redaction、unknown/fence | flow/fault/observation 测试方向 | transport/backend 产品 |
| `02` §§4~5 | 八个业务组成部分、五个技术实现层 | 测试对象候选来源；Step 3 再正式抽取 | 测试层级和优先级 |
| `02` §6 | 对象轮廓与 owner/forbidden semantics | construction/invariant 候选 | 用概要名覆盖 `03` canonical type |
| `02` §§7~10 | API、关键流、状态和异常轮廓 | 协议/状态/failure completeness 核对 | 具体字段/transition/error oracle |
| `02` §11 | 配置影响轮廓 | 与正式 `04` 对照消费 | 配置 key 或 lifecycle 定稿 |

### 5.3 详细设计直接输入映射

| `03` 输入面 | 当前 canonical inventory / contract | 测试方案主要落点 | 输入边界结论 |
|---|---|---|---|
| workspace / crate | `contracts/domain/application/infra/api/worker/jobs` 七 crate；Rust planned baseline | §3、§4、§8、§9 | 只作 planned code/test boundary；target repo 不存在 |
| capabilities | `CAP-01~CAP-12` | §2~§6 | 每项必须保留独立 oracle 来源，不能由 smoke 替代 |
| public protocols | C01~C17、Q01~Q12、E01~E06、O01~O06、J01~J07 | §3、§5、§6、§14 | exact identity 是输入；case/suite denominator 后置决定 |
| state registry | `SM-01~SM-31` | §3、§5、§6、§10、§14 | 旧 `SM-01~18` 不是完整 current inventory |
| Flow / UoW | mutation common skeleton、local-before-call、matching receipt/reconcile、query zero-write | §3、§4、§6、§10 | 物理 DB/transaction qualification 仍 blocked |
| replay / concurrency | stable identity/digest、CAS、inbox/outbox、lease/cursor/page、late/quarantine | §3、§6、§10、§14 | unknown 不自动重放，late 不逆写 |
| error / recovery | typed layer errors、fence、manual/reconcile、no raw dependency text | §3、§6、§10、§11 | 不发明 error variant |
| external Ports | 13 canonical dependency slots；无 Sandbox slot | §3、§4、§6、§8 | `InvocationCallerPort` 是唯一正向 action seam |
| observation | body-free candidate、phase/disposition/correlation、redaction | §3、§6、§10、§13 | candidate/receipt/report 不是 evidence/observed |
| planned test input | `03` §15 object/Port/protocol/state 最小验证清单 | Step 3 起逐项展开 | 本 Step 不继承其中示例 TC 名为现行 registry |

### 5.4 配置设计直接输入映射

| `04` 输入面 | 当前 canonical contract | 测试方案主要落点 | 禁止历史语义 |
|---|---|---|---|
| strict shape | 12 roots、153 required exposed leaves、39 static-derived semantics | §3、§6~§10 | alias、partial object、external default |
| slot/job inventory | 13 slots x 5 leaves；7 jobs x 6 leaves | §3、§6~§10 | Candidate/Bound = Ready |
| source/assembly | one selected strict JSON；V0~V12；whole reject；one immutable snapshot | §6~§10、§12 | merge、leaf/request override、partial publish |
| operation capture | one snapshot per operation/page；by-ref miss closed | §6、§7、§10 | current snapshot 替代 historical ref |
| change lifecycle | whole-document compare/review/full validation/cold process replacement/rollback | §8、§10、§14 | in-process reload、N+1 online activation、reject-new/LKG |
| failure posture | Invalid/Blocked/Bound 与 path-specific fail-closed/degraded/unknown | §6、§10~§12 | ping/fake/design 关闭 blocker |
| downstream slices | `CFG-T01~15` | Step 3 后拆成切口、场景、数据、环境和门禁 | 将 slice 当已执行 case/result |

## 6. 专项上游与依赖六分类

### 6.1 分类口径

| 类型 | Runtime 测试侧含义 | 是否可推导 package 依赖 | 本 Step 的约束 |
|---|---|---:|---|
| compile | 代码直接引用正式发布的 shared crate/type/trait/DTO/error | 仅 exact reviewed Core 候选可 | 可规划 dependency/source compatibility 检查；当前不声称实际 Cargo graph |
| runtime | 运行时通过 service/client/Port 消费 owner 能力 | 否 | 测 Runtime caller contract、failure mapping 和 owner no-write |
| event | 通过 Bus/event carrier 交接 committed fact | 否 | 测 local inbox/outbox/material/replay；不把 receipt 当 delivery/observed |
| ref | 只持有 typed owner/ref/version/freshness/safe view | 否 | 测 malformed/missing/stale/conflict/body-free；不解析成 owner body |
| adapter | provider-neutral Port 的有限实现绑定 | 否 | 测 call order、typed outcome、blocked/unknown；不据此证明 provider readiness |
| fake | CI/TestFake 下的确定性有限替身 | 否 | 只证明本地语义与调用边界；不能关闭 external blocker |

### 6.2 Runtime 依赖裁剪与测试边界

| 关联 owner / 项目 | 当前依赖类型 | Runtime 可验证的消费接缝 | 不属于 Runtime 测试的正向事实 | 当前 caveat / blocker |
|---|---|---|---|---|
| `L0-core` | compile candidate | exact type/ref/metadata/error compatibility、无 shadow schema、无 sibling compile edge | Runtime 私造 shared schema 或宣称已完成 Core bind | `L2R-UP-003/006`；实际 package/API 未绑定 |
| `L0-bus` | event | committed body-free outbox、stable ID/digest、inbox replay、publish pending/unknown | route、broker delivery、DLQ、subscriber accepted/observed | `L2R-UP-006/007` |
| `L0-sdk` | downstream runtime | 静态验证无 Runtime -> SDK 反向 package 依赖；future consumer contract 只作边界 | SDK client 可用、产品接入或 SDK readiness | `L2R-UP-003`；SDK 不反向成为 Runtime authority |
| `L2-tools` | runtime/ref/adapter | canonical action ref、attempt-before-call、finite receipt/status/error mapping、zero direct Sandbox call | Tool execution、cleanup、Tool audit truth、Sandbox success | `L2R-UP-001/003/007` |
| `L3-capability-hub` | runtime/ref | identity/exposure/descriptor safe view 的 owner/scope/version/freshness、missing/stale/unknown、registry no-write | capability registry、adapter descriptor/body、formal exposure truth、外部 adapter readiness | owner contract 只能消费；不得由 Runtime 补 registry |
| `L3-method-library` | runtime/ref | method/role/process definition ref/version/freshness、body-free resolution、dirty-source disclosure | method/role/process body/source、commit/hash/immutable baseline | `L2R-UP-008`；当前 workspace formal 有未提交改动 |
| `L1-governance` | runtime/event/ref | effective decision/policy safe view、owner/scope/freshness、missing/conflict/stale/unknown fail-closed | approval、Policy effective、risk acceptance 或 authorization truth | exact positive binding/qualification 未由 Runtime 拥有 |
| `L4-sandbox` | runtime/adapter，且只能经 Tools action seam 间接约束 | isolation-required guard、direct path zero-call、host fallback forbidden、blocked posture | isolation execution、capture、cleanup、receipt 或 readiness | `L2R-UP-001/007`；Runtime 无 Sandbox slot |
| `L4-observability` | event/ref/adapter | body-free observation candidate、redaction、local attempt/gap/outbox、backend unavailable | observed/audit/evidence truth、backend storage、retention、delivery qualification | `L2R-UP-002/006/007` |
| `L1-artifact` | runtime/event/ref | Artifact/Evidence typed ref、safe summary、handoff candidate、body no-write | Artifact/report/evidence body、lineage/verdict/acceptance truth | 与 handoff/observation 正向路径一并保持 blocked-aware |
| model owner | runtime/adapter | provider-neutral intent/submission/result disposition、refusal/timeout/unavailable/unknown、redaction | provider registry/route/secret/quota/cost/billing/raw result | `L2R-UP-004` |
| durable memory owner | ref/adapter | retrieval request/ref/use/candidate/gap、working-only fallback、stale/unavailable | episodic/semantic body、index、write/delete/retention/rebuild truth | `L2R-UP-005` |
| entry / Member / Products | downstream runtime/ref | typed actor/scope/authority fixture、invalid/missing/conflict rejection、facade boundary | member-service/container/image/product lifecycle、production entry readiness | `L2R-ENTRY-001` |

### 6.3 接缝测试总规则

1. Runtime 测试只观察 Runtime 自己的输入、local write set、调用顺序、typed outcome、状态/历史和安全输出。
2. 对方 fake/spy 可证明“Runtime 在收到某个有限返回时如何处理”，不能证明对方真实实现存在或可用。
3. event receipt、adapter response、handoff ACK、observation receipt 与 local outcome 必须分层；任何一个都不能自动升级为 delivered、accepted、observed 或 evidence。
4. 只有 exact Core candidate 可以在未来进入 compile lane；所有 sibling runtime/event/ref/adapter/fake 关系必须留在 Port/envelope/ref 边界。
5. 上游当前正式文件可以作为 contract direction；dirty/uncommitted 状态必须披露，不能生成 immutable source claim。

## 7. Canonical blocker test posture

以下 11 项是正式 `00~04` 持续传递的 canonical blocker。`允许 lane` 只表示后续可设计对应测试，不表示 case、runner 或结果已经存在。

| Blocker | 受影响面 | 允许的 local / negative / fake lane | 明确禁止的 positive claim | 未来关闭输入 |
|---|---|---|---|---|
| `L2R-UP-001` | invocation、feedback、SM-07/08/31、C09/E02/J05 | attempt/fence 先提交；finite pending/reject/blocked/unknown；direct Sandbox 与 host fallback 零调用 | executed、isolated、cleaned up、successful receipt/feedback、可安全重试 | Tools -> Sandbox canonical mapping、action/receipt/status/feedback/cleanup contract 与真实 qualification |
| `L2R-UP-002` | handoff、outbox、SM-14/16、C16/E06/J06 | body-free material、local attempt/gap、ACK mismatch/late/unknown、gap 不自闭合 | delivered、accepted、observed、downstream consumed 或由 Runtime 自行关闭 gap | producer/source/route/ACK/status/Observability 正式合同与 qualification |
| `L2R-UP-003` | action DTO、Core/SDK seam | typed category/ref/digest、no-shadow-schema、no reverse SDK dependency、blocked contract mapping | Runtime 私造 shared Tools DTO、exact compile compatibility、SDK client readiness、positive submit | Core tools-specific formal schema/version/source；SDK downstream contract |
| `L2R-UP-004` | model materialization/decision、C06/C07/E01、SM-06/17/22/23 | provider-neutral request、finite semantic result/refusal/timeout/unavailable/unknown、raw/body/secret zero persistence | provider selected/routed、quota/cost known、raw result accepted、adapter/provider ready | model owner semantic contract、selected adapter/profile 和独立真实 qualification |
| `L2R-UP-005` | context/memory、C04/C05/J03/Q05、SM-05/15 | working-memory semantics、retrieval request/ref/use/candidate/gap、stale/missing/unavailable | durable write/index/delete/retention/rebuild、episodic/semantic body committed | durable memory owner 的 retrieval/lifecycle/ref contract、implementation 与 qualification |
| `L2R-UP-006` | Core/Bus/Obs schema、event/outbox/projection/freshness | local envelope/inbox/outbox、stable ID/digest、exact replay、pending/unknown/gap、projection no-write | shared schema authority、route valid、delivered、observed、backend current | exact Core/Bus/Obs schemas、routes、ordering、receipt/status contracts |
| `L2R-UP-007` | Sandbox/Observability positive adapters | fake profile isolation、blocked adapter、no fake Ready、no static evidence、positive lane unavailable | real isolation/observation integration、artifact/evidence、backend or system readiness | real Sandbox/Observability implementation artifacts与独立 qualification |
| `L2R-UP-008` | Method definition/source refs、revision/progress | current-workspace typed ref/version/freshness、dirty disclosure、missing/stale behavior | immutable commit/hash/source baseline、clean reproducible provenance | owner-selected clean immutable Method Library baseline/ref/digest |
| `L2R-CP-001` | checkpoint/recovery、C13/J04/J05、SM-11/12 | Prepared/CommitPending/CommitUnknown 分层、matching/mismatch/unknown scripted receipt、fence、no-resume unknown | physical atomicity proven、stable Committed、automatic Resume、backend qualified | physical commit/receipt/status/reconcile contract、selected store and fault qualification |
| `L2R-ENTRY-001` | profile/scope/child/API/worker/jobs entry | typed actor/scope/authority fixture、invalid/missing/conflict reject、facade-only mapping | production actor/member/product mapping、container/member lifecycle、production entry ready | owning typed entry contract、selected binding/profile 和真实 integration tests |
| `L2R-IMPL-001` | 所有 planned code/test/evidence surface | 文档级 planned object/cut/check 与 future preflight 条件 | repo、source、build、commit、runner、test result、coverage、artifact/report/evidence/verdict/readiness | authorized target repo、frozen baseline、实现、真实 runner/run 和完整生命周期 |

### 7.1 `L2R-LANG-001` 的单独处理

`03` §17.1 另列 `L2R-LANG-001`：Rust、edition `2024`、`rust-version = 1.93` 是 planned baseline，concrete async runtime、transport、database、broker、scheduler 仍未选择。它不是上述 11 个 external/canonical blocker 的新增第 12 项，而是 `implementation_prerequisite`：

- 允许后续设计 Rust contract/layout 的 planned test boundary。
- 不允许声称 toolchain compatibility、build success、runtime/DB/scheduler behavior 或性能结果。
- 在真实实现前必须由 implementation preflight 固定并验证；若产品选择改变 `03/04` 契约，则受控重开设计。

### 7.2 Blocker 聚合结论

| 问题 | 结论 |
|---|---|
| 是否阻塞 Step 2 测试范围讨论 | 否；可继续区分 local、negative、blocked-aware 和 positive-blocked 范围 |
| 是否阻塞 exact local oracle 设计 | 否；`00~04` 已固定对象、状态、Flow、配置和失败上限 |
| 是否阻塞 positive integration | 是；按 blocker 对应面逐项阻塞 |
| 是否可由 fake/spy/blocked adapter 关闭 | 否 |
| 是否可由文档、目录、ping 或 candidate/Bound 关闭 | 否 |
| 是否可生成当前 artifact/report/evidence/readiness | 否；`L2R-IMPL-001` 仍开放 |

## 8. 当前文档问题与历史污染诊断

### 8.1 旧正式 05 污染表

| 历史内容 | 与 current truth 的冲突 | 当前处理 | 后续重建设防 |
|---|---|---|---|
| `SM-01~18`、分母 `17/12/6/6/7/18` | 正式 `03` 当前 state registry 为 `SM-01~SM-31` | 整体拒绝继承；不能仅把 18 改成 31 后沿用旧矩阵 | Step 3 从 `03` current registry 重新抽取；Step 5/6 再建覆盖与 case |
| `20 CUT` registry | 由旧 Step 3 形成，尚未按 current 31 SM 和 current 04 重审 | 只作为“必须重新枚举风险面”的历史提示 | Step 2 定范围，Step 3 从 current design 独立生成 cuts |
| `109 planned EV slots`、EV family/alias | 依赖旧 cut/case/suite/denominator | 不继承编号、数量、映射或状态 | Step 13 在前置 Steps 闭合后重建 candidate evidence contract |
| `12 suites`、4 checks、script 名与 selector | 未经本 restart 的对象、层级、自动化和门禁 Steps 重新论证 | 不继承名称、数量、命令或存在性 | Step 4/9 分别重建；不存在实现前只能 planned |
| 固定 artifact/report tree | 与旧 TC/EV/suite 绑定，且不是实际文件 | 不继承路径；不得作为当前 evidence identity | Step 13 基于新 registry 重新决策，仍不得生成真实 artifact |
| reload、N/N+1、reject-new、LKG | 正式 `04` 明确 startup-only、no in-process reload，变更是完整校验后的 cold process replacement | 作为配置生命周期污染拒绝 | 后续只验证 startup capture、by-ref miss、cold replacement/rollback truth ceiling |
| “exact denominator 已闭合”“all CUT map”等自检 | 只表示旧设计文本自洽，不是 current restart 结论 | 不继承 pass/closed 结论 | 每个新 Step 独立审计并停审 |
| `closed_stop_review` 与旧 Step 完成状态 | 用户已明确 full-restart，旧状态失效 | 当前正式 05 仍保持历史文件，不可写，Step 15 才删除重建 | flow/ledger 维持 formal lock |

### 8.2 旧正式 06 污染表

| 历史内容 | 当前效力 | 污染风险 | 本 restart 处理 |
|---|---|---|---|
| 20 CUT、18 SM、109 slots、12 suites、4 checks | historical downstream assumption | 反向固定新 05 的测试库存 | 全部不得作为 05 输入；仅 `00` AC/VF 是 current acceptance direction |
| old TC/EV/evidence gate refs | historical only | 让新 case/EV 迁就旧编号 | 不继承；未来 06 必须消费重建后的正式 05 |
| artifact/run/defect/retest/signoff schema | downstream design direction only | 提前决定 Step 11~13 或伪造 authority | 可作为污染/问题清单，不作为 current contract |
| “通过/有条件通过/不通过”规则 | acceptance owner domain | 05 越界裁决 | 05 只设计未来证据，不形成 verdict；当前 acceptance 仍 `not_entered` |
| current `none/not_bound/0` 等字段 | 历史文档中的 no-fabrication 声明 | 被误当成本轮正式验收实例 | 只保留事实边界：没有真实验收；不继承旧 registry |

### 8.3 旧正式 07 与实施材料污染表

| 历史内容 | 当前效力 | 污染风险 | 本 restart 处理 |
|---|---|---|---|
| 35 boundaries、phase/gate/batch/commit subject | historical implementation plan | 反向固定 05 suite/case/evidence，或误报实施已安排 | 不继承；新 07 必须在新 05/06 之后重建 |
| implementation ledger 与 boundary skeleton | historical planned artifacts | 被解释为实现仓、commit 或执行进度 | 不修改、不消费为 current implementation truth |
| `pass-designed` / `completed` | 旧文档设计状态 | 被提升为 implementation/test readiness | 全部降级为 historical status，不关闭任何 blocker |
| 18 SM、20 CUT、109 slot 等输入 | 已被 current `03/04` 推翻或待重审 | 将污染沿实施链传回测试设计 | 明确切断反向依赖 |
| Rust 2024/1.93、target repo absent | Rust baseline 与 absent reality 方向仍可从 current `03` 独立确认 | 误把计划版本写成实测环境 | 只引用 current `03` 的 planned baseline；实际 preflight 仍未发生 |

### 8.4 历史材料可保留的有限价值

旧材料只能提醒后续必须讨论以下问题：exact denominator、failure retention、same-run pairing、redaction、dependency boundary、blocked positive lane 和 05/06/07 phase separation。它不能预先决定这些问题的答案、编号、数量、路径、脚本或状态。

## 9. 改动前后对比

| 维度 | full-restart 前旧口径 | Step 1 当前口径 | 变更原因 |
|---|---|---|---|
| 输入 authority | 旧 05 自称承接 00~04，并被 06/07 继续引用 | current `00~04` 与标准唯一正向输入；旧 05/06/07 全部 historical | 切断下游反向定义上游 |
| 状态测试 | 18 个状态机 | 输入必须覆盖 current `SM-01~SM-31`；具体范围/case 后置 | 正式 `03` 已扩展并闭合 registry |
| 配置生命周期 | reload/N+1/reject-new/LKG | startup-only immutable snapshot + whole-document cold replacement | 正式 `04` 明确禁止 online reload |
| 测试库存 | 20 CUT、固定 TC/EV/suite/check | 当前为 0 个被本 restart 批准的 cut/TC/EV/suite/check；后续逐 Step 生成 | 避免继承未复核设计判断 |
| external seam | finite fake 与 positive lane 在旧完整方案中并存 | negative/fake 可设计；positive lane 按 11 blocker 显式不可用 | fake 不能证明 readiness |
| implementation | 旧 07 已有 planned boundaries/skeleton | 对本 restart 仅是 historical；target repo/implementation/test 均不存在 | 保持串行与事实边界 |
| language | Rust 设计和实施计划混读 | current `03` 固定 planned Rust baseline；实际 toolchain/product 未验证 | 区分 design contract 与 execution fact |
| evidence | 旧 109 slots 和固定路径 | 只承接 future evidence 需要；编号/schema/path 到 Step 13 再决定 | evidence 必须建立在新 case/suite 上 |

## 10. 测试设计取舍

| 候选做法 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| 在旧 05 上逐词修补 18 -> 31、reload -> cold replacement | 写作快 | 旧 cut/case/EV/suite 的推导链仍污染，无法证明覆盖完整 | 禁止 |
| 直接从 `03` §15 复制 planned TC 名和 layout | 有详细设计锚点 | §15 是最小验证输入，不是 current 05 registry；会跳过 Step 2~6 | 禁止直接继承；只作设计 oracle |
| 从 current `00~04` 按 Step 独立重建 | 每个范围、cut、case、数据和证据都有新推导链 | 工作量较大 | 采用 |
| 把开放 external seam 全部排除 | 方案简洁 | 漏掉 fail-closed、zero-call、blocked/unknown 和 owner no-write 核心风险 | 禁止；保留 negative/blocked-aware lane |
| 用 fake 代替 positive integration | 可确定执行 | 会伪造 external closure/readiness | 禁止；fake 只证明有限 local semantics |
| 现在固定 TC/EV/suite/path | 提前形成完整感 | 越过 Step 2/3/4/6/9/13，且会污染后续决策 | 禁止 |

## 11. 不再回答与必须回答

### 11.1 测试方案不再回答

| 问题 | 当前 owner / 去向 | 05 的处理 |
|---|---|---|
| Runtime 应拥有哪些业务/外部 truth？ | 正式 `00/01` | 只验证 owner 边界，不重新分配 |
| 对象字段、状态、Port、error、Flow、UoW 应是什么？ | 正式 `03` | 只建立 oracle；发现缺口回流 `03` |
| 配置 key/default/source/lifecycle 是什么？ | 正式 `04` | 只验证 current strict contract；发现缺口回流 `04` |
| Tools/Sandbox/Hub/Method/Governance/Obs 内部如何实现？ | 对应 owner 项目 | 只测 Runtime caller、failure 和 no-write |
| provider route/secret/quota/cost、DB/broker/scheduler 选什么？ | owning adapter / implementation / operations | 保持 product-neutral 或 blocked，不在测试方案偷选 |
| 什么结果算验收通过、谁签署？ | future formal `06` | 只提供真实 evidence 的设计入口 |
| 实施顺序、commit boundary 和实际命令是什么？ | future formal `07` 与真实实现仓 | 05 只提供可引用的 test gate contract |
| 现有测试是否通过、覆盖率多少、系统是否 ready？ | 真实实现与执行生命周期 | 当前答案固定为不存在这些事实 |

### 11.2 测试方案后续必须回答

| 必答问题 | 作用 | 主要 Step |
|---|---|---:|
| 本轮证明什么、P0/P1/P2 和非范围是什么？ | 固定 completion denominator 与风险归属 | 2 |
| current `00~04` 的每类对象和风险在哪里被最早发现？ | 建立测试对象、cut 与分层 | 3~4 |
| 20 FR、44 BR、19 NFR、36 AC、8 VF 如何双向追溯？ | 防 orphan requirement/design/test | 5 |
| 17/12/6/6/7 protocols 与 31 SM 如何逐项验证？ | 防 aggregate smoke 和旧分母缩水 | 3、5、6 |
| 每个对象/Flow/状态/Port/配置的正向、负向、边界、并发、replay、unknown 断言是什么？ | 形成可执行测试 oracle | 6 |
| 数据、fixture、clock/ID/digest/fault 如何合法构造且不含 forbidden body？ | 保证测试可重复、安全 | 7 |
| compile/runtime/event/ref/adapter/fake 在什么环境隔离？ | 防 sibling package 依赖与 fake leakage | 8 |
| 哪些测试进入什么自动化门禁，runner 不存在时如何标记？ | 防静态 pass、空 selector 和 hidden skip | 9 |
| NFR、redaction、owner no-write、failure/recovery 如何验证且不发明阈值？ | 覆盖横切风险 | 10 |
| 缺陷、复验、进入/退出、报告、证据和回归如何保持同一事实链？ | 让 future 06 可裁决 | 11~14 |
| 所有编号、suite、path、状态是否可回指本 restart 中间产物？ | 正式装配前最终防污染 | 15 |

## 12. 正式 `05-测试方案.md` §1 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读该中间产物的“Runtime `00~04` 输入映射”“专项上游与依赖六分类”“Canonical blocker test posture”和“历史污染诊断”，了解本章边界如何收敛。

本测试方案只承接当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`。`00` 提供 20 项核心 FR、44 项 BR、19 项 NFR、36 项 AC、8 项 VF、数据 owner 和禁止边界；`01` 提供 Runtime local truth、外部 owner、依赖方向、交互与横切红线；`02` 提供八个业务组成部分、技术分层以及对象、接口、流程、状态和异常轮廓；`03` 提供 planned Rust workspace、七 crate、12 capability、17 Commands、12 Queries、6 inbound Events、6 outbound Events、7 Jobs、`SM-01~SM-31`、对象/Port/Flow/UoW/error/concurrency/observation 和 §15 最小验证输入；`04` 提供 12-root strict JSON、153 required exposed leaves、39 static-derived semantics、13x5 slots、7x6 jobs、V0~V12、startup-only immutable snapshot、operation/page capture、whole-document cold replacement/rollback 和 `CFG-T01~15`。

只有 exact reviewed `L0-core` contract 是未来 compile dependency 候选。`L0-bus`、Tools、Capability Hub、Method Library、Governance、Sandbox、Observability、Artifact、model、durable memory 及 entry/product 边界必须按 runtime/event/ref/adapter/fake seam 测试，不得伪装成 Cargo/package 依赖。Runtime 测试只验证本仓 caller contract、local write set、调用顺序、typed failure、状态/历史、safe material 和 owner no-write；不测试或补定义上游内部实现与 truth。

`L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` 继续开放。它们允许 local deterministic、negative、blocked-aware 和隔离 fake 测试设计，但阻塞受影响 positive integration、真实执行、artifact/report/evidence 和 readiness。`L2R-LANG-001` 是单独的 implementation preflight：Rust 2024/1.93 仍是 planned baseline，实际 toolchain、async runtime、transport、database、broker 和 scheduler 未验证或选择。

旧正式 `05/06/07`、旧校准 Steps、README 和旧依赖顺序材料仅是 `historical_material`。其中 `SM-01~18`、20 CUT、109 planned EV slots、12 suites、4 checks、TC/EV 编号、script/path、reload/N+1/reject-new/LKG、验收 denominator、实施 boundaries 和所有旧完成状态均不得继承。后续 Steps 必须从 current `00~04` 重新建立范围、cut、case、data、environment、gate 和 evidence contract。

本文不会重新定义需求、owner、对象字段、状态、Port、error、Flow、UoW、配置语义、外部 provider truth、验收裁决或实施事实。当前不存在实现仓、build/test run、coverage、artifact、report、evidence instance、verdict、signoff 或 readiness。

## 13. 待确认事项与开放问题

| 事项 | 当前判断 | 影响范围 | 当前规则 / 后续处理 |
|---|---|---|---|
| 11 个 canonical blocker 仍开放 | 非 Step 1 blocker | positive integration、execution、evidence/readiness | 后续每 Step 显式传播；不得转 skip/pass |
| `L2R-LANG-001` toolchain/product 未验证 | implementation prerequisite | build/runtime/DB/broker/scheduler 与性能 | Step 8/9/10 只写 planned/profile-neutral；真实 07 preflight 再固定 |
| Method Library workspace dirty | source caveat | immutable source/provenance positive lane | 使用 current formal ref + dirty disclosure；不声称 commit baseline |
| Capability Hub / Method 当前 workspace 有既有改动 | upstream current-workspace caveat | 读取到的 formal content 可能继续变化 | 每个相关 Step 恢复时重新核对；不绑定 commit/digest |
| current 06/07 依赖旧 05 | historical downstream pollution | 所有旧 denominator/evidence/implementation mapping | 不回写它们；等待新正式 05 完成后按串行链重建 |
| performance numeric authority absent | 不阻塞结构性设计 | NFR 数值 pass/fail | Step 10 只定义分解测量和 authority requirement，不发明 SLA |

本 Step 无需用户对某个设计选项作额外选择；需要的是 Step 1 停审确认。任何上游 current formal 在 Step 2 前发生变化时，先重开本 Step 的受影响映射。

## 14. Step 1 自检与停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 标准/SOP/书写规范已读取 | pass | 已按 Step 1 要求组织完整中间产物 |
| Runtime `00~04` 输入清单明确 | pass | requirement/architecture/HLD/DDD/config 均有结构化映射 |
| 专项上游已裁剪 | pass | compile/runtime/event/ref/adapter/fake 分列，owner truth 未转移 |
| current inventory 使用正确 | pass | 17/12/6/6/7 protocols；`SM-01~SM-31`；12/153/39/13x5/7x6 配置输入 |
| 旧 05/06/07 污染已隔离 | pass | 不继承 20 CUT、18 SM、109 EV、suite/check/script/path 或旧状态 |
| blocker posture 完整 | pass | 11 canonical blocker 逐项定义允许 lane、禁止 claim 和 future closure |
| `L2R-LANG-001` 未混入 canonical 11 | pass | 单列为 implementation prerequisite |
| 未提前进入后续 Step | pass | 未定义 priority、cut、case、data、environment、suite、EV 或 path |
| 未修改正式 05 | pass | formal write 继续锁到 Step 15 |
| 未伪造执行事实 | pass | 无 run/result/artifact/report/evidence/verdict/signoff/readiness |
| 是否发现新的上游 blocker | none | 仅保留既有 blocker 和 dirty-workspace caveat |
| 是否需要回写 `00~04` | no | 未发现 current internal contract 缺口 |

## 15. 进入下一步条件

- [x] 输入文档、权威顺序和效力明确。
- [x] Runtime `00~04` 到测试方案的输入映射明确。
- [x] 专项上游及六类依赖 seam 的测试边界明确。
- [x] 11 个 canonical blocker 的 negative/fake/positive posture 明确。
- [x] 历史 05/06/07 的编号、配置生命周期、证据和状态污染已隔离。
- [x] “不再回答 / 必须回答”清单已形成。
- [x] 正式 §1 回填草稿已形成，但未写入正式 05。
- [x] 当前不存在需要回流 `00~04` 的 Step 1 blocker。
- [ ] 用户再次明确确认进入 Step 2。

```text
current_document = 05-测试方案.md
current_step = Step 1
current_module = input_boundary
gate_status = done_stop_review
formal_05_write_allowed = false_until_step_15
next_step = Step 2
next_step_allowed = false_until_user_confirmation_after_step_1
commit_required = false
```
