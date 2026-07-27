# L3-capability-hub 07 实施计划 Step 8：配置、环境与外部依赖准备

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 8
> 书写规范: `standards/document/实施计划书写规范.md` §5.8
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 配置权威: `projects/L3-capability-hub/04-配置设计.md`
> 测试 / 验收权威: `projects/L3-capability-hub/05-测试方案.md`、`06-验收标准.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §8
> 输入: Step 3 前置矩阵、Step 5 `PH-01`~`PH-11`、Step 6 的 26 个 boundary、Step 7 门禁矩阵
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义配置、环境与外部依赖准备 |
| 当前状态 | completed_continuous_execution |
| canonical config | 18 modules、27 rows、21 bounded env leaves、3 profiles、3 entries、9 external slots / 14 calls、6 Worker sources、10 outbound routes |
| P0 environments | 前五个 `ENV-CH-*` planned contracts；Local / Integration profile |
| selected / release | `ENV-CH-SELECTED-STAGING`、`ENV-CH-RELEASE-CANDIDATE`；当前 blocked prerequisites |
| current path observation | `core-contracts` path exists；target implementation repo absent |
| current tool observation | design host reports Cargo/Rust/Rustdoc 1.93.0 and rustfmt 1.8.0-stable；target repo baseline仍未建立 |
| unresolved upstream blocker | `0`；目标仓和 selected products 是 implementation prerequisites |
| 下一动作 | 进入 Step 9，登记 Spike、风险、待确认事项和 controlled-reopen owner |

## 2. 本步输入与 SOP 问题回答

| 输入 | 本 Step 用途 | 结论 |
|---|---|---|
| Step 3 prerequisite matrix | 目标仓、toolchain、Cargo path、ledger、git 和 Rustdoc 前置 | 目标仓缺失阻断 PH-01 实现；不阻断设计闭合 |
| Step 5 phase graph | 依赖在哪个 phase 前必须 ready | PH-01 建基础；PH-02~10逐层启用；PH-11只聚合真实 lower-run |
| Step 6 boundaries | 把 config/dependency 检查落到提交边界 | 26/26 boundary 均有准备检查与不可用处理 |
| Step 7 gates | 配置/环境如何进入 raw/report/evidence | strict config、dependency、redaction、pairing、no-static均是 blocking |
| formal `03` §13 | workspace、Port、entry、Stage 0~7、dependency exact source | 只允许 `core-contracts` sibling compile edge |
| formal `04` §3~§11 | profile、raw path、binding、activation、failure | 本 Step 不复制或改写配置 schema，只抽取 readiness checks |
| formal `05` §8~§9 | 七环境、suite/gate/check roots | 前五个 P0；selected/release不可用不得算 pass |
| formal `06` §3~§14 | immutable manifest、blocked status、VETO | P0 prerequisite缺失、silent fallback、dependency越界均阻断 |

本步回答：

1. **哪些仓或服务是实施前置？** 目标实现仓、Rust toolchain、`core-contracts` path 是 PH-01 前置；Local/Integration 的完整 P0 graph、fake/controlled stores/Ports/sources/routes 是对应 phase 前置。
2. **哪些只在特定 phase 需要？** Worker 六 source 与十 route 在 PH-09；Jobs/replay 在 PH-10；report/evidence roots 和 review draft schema在 PH-11；selected products 只属于 P1/R4。
3. **本地/CI 必须准备哪些配置？** strict JSON root、profile/entry、one local authority、9/6/10 graph、clock/ID、fixed compatibility、technical policies、diagnostics、fixture和显式 artifact/report roots。
4. **fake/mock 允许到什么范围？** Local/Integration P0 允许 deterministic fake、inMemory、controlled unavailable/failure；必须与 durable/configured typed semantics parity。Deployment 禁止 fake，Disabled不能伪装 success。
5. **依赖不可用怎么处理？** target repo/core/toolchain/P0 graph 不可用即暂停或 gate failure；合法 negative fixture 按预期 typed branch 判定；selected product 不可用为 `blocked_dependency`，不补 P0。
6. **由谁提供？** 本项目提供 workspace、P0 fake/controlled adapters和tests；L0-core 提供唯一 compile contract；相邻 owner未来通过 Port/event/ref/adapter/handoff提供运行期协作；operations/security提供 Deployment material。
7. **本地路径是否存在？** 本轮只做路径观察：`/home/aris/Projects/quantalithos-core/crates/contracts` 存在；`/home/aris/Projects/quantalithos-capability-hub` 不存在。
8. **Cargo path 形态？** 唯一允许 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；目标仓建立后必须由 dependency check 复核。
9. **哪些不能是 Cargo dependency？** governance、method-library、runtime/tools、SDK、observability/audit、external documents、MCP/A2A/API products、event transport等均只能走 typed runtime/event/ref/adapter/fake seam。

## 3. 当前问题诊断与设计取舍

| 问题 | 风险 | 本 Step 处理 |
|---|---|---|
| target repo absent | implementation agent没有落点或伪称已初始化 | 固定 PH-01 hard prerequisite，不在设计仓创建实现仓 |
| design host toolchain可见 | 被误写成target baseline或测试事实 | 仅记 host observation；实现仓创建后重新冻结 toolchain manifest |
| formal `04` 配置很细 | 在 `07` 复制会形成第二 schema authority | 只列配置族、cardinality、phase readiness和 failure action |
| Configured/Fake/Disabled易被混用 | Configured failure自动fallback成fake/disabled | 分支显式；Missing永远拒绝；无自动转换 |
| selected external product未锁定 | 可能把真实MCP/A2A/API产品当P0依赖 | P0验证typed seam；产品 parity 留 P1 selected |
| external collaboration易变成本地delivery系统 | Hub吸收queue/retry/DLQ/ack truth | 十route只做immutable envelope到physical destination mapping |
| environment purpose与profile混淆 | 添加CI/staging枚举或隐藏default | 只有Local/Integration/Deployment；七个ENV是测试计划身份 |
| artifact/report root晚准备 | gate执行后无法留证据或改用`latest` | PH-01建目录合同；每个runner仍显式接收run-scoped roots |

### 3.1 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 把所有 sibling repo 加为 path dependencies | 不采用 | 违反唯一 compile edge、责任隔离和 VETO-CH-012 |
| P0 强制真实数据库、bus、MCP/A2A/API provider | 不采用 | 产品未选且会把产品 readiness 混入 semantic closure |
| Local/Integration 使用 parity-complete fake/controlled seam | 采用 | 可重复验证typed behavior、failure和no-write/no-repair |
| Configured failure自动降级Fake/Disabled | 禁止 | 会掩盖配置/依赖失败并伪造可用性 |
| 复用同一配置同时启动API/Worker/Jobs | 禁止 | formal `04` 要求one selected entry和independent immutable roots |
| design host工具版本直接成为Cargo锁定值 | 不采用 | 只能作为当前观察，目标仓baseline仍需真实preflight |

## 4. 依赖类型与当前观察

### 4.1 当前可观察路径 / 工具事实

| 项目 | 当前观察 | 设计结论 | 实现前动作 |
|---|---|---|---|
| target repo | `/home/aris/Projects/quantalithos-capability-hub` absent | implementation prerequisite | 创建或确认仓后记录真实 `.git`、branch/worktree、Cargo baseline |
| core contracts | `/home/aris/Projects/quantalithos-core/crates/contracts` exists | 唯一 sibling compile candidate | 在目标仓运行 Cargo metadata 和 dependency scan，不只做目录检查 |
| Cargo / Rust | host观察 `cargo 1.93.0`、`rustc 1.93.0` | 与formal `03`候选方向一致，但不是target lock | 目标仓记录toolchain/rust-version并运行check/fmt/rustdoc |
| rustfmt / rustdoc | host观察 `rustfmt 1.8.0-stable`、`rustdoc 1.93.0` | 工具可见，不等于Rustdoc coverage通过 | 实现期执行永久Rustdoc check |
| run/artifact/report roots | 未建立 | 不存在真实测试环境或证据 | PH-01只创建目录/CLI合同；真实run由显式`run_id`产生 |
| selected products | 未选择 | P1/R4 prerequisites | 由Step 9风险和未来manifest受控选择 |

当前观察不是实现仓 existence、dependency resolution、build/test pass、run或evidence；不得转录为 implementation ledger 的完成状态。

### 4.2 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| target capability-hub repo | repo | target implementation repository | `PH-01..11` | 本项目 implementation owner | directory + `.git` + worktree + Cargo workspace preflight | PH-01暂停；不得在设计仓替代实现 |
| `core-contracts` | repo/crate | 唯一 compile-time sibling dependency | `PH-01..11` | L0-core | exact path、Cargo metadata、import/public signature scan | 暂停；不得vendor/copy或改用其他 sibling |
| Rust/Cargo toolchain | tool | build/test/doc dependency | `PH-01..11` | implementation environment | version manifest、`cargo fmt/check/test/doc` capability | 暂停并修复环境；不得记gate pass |
| one local authority / 27 local-base Ports | store/adapter | P0 runtime dependency | `PH-02..10` | capability-hub infra | Stage 3 constructability、UoW/CAS/commit resolution parity | graph fail-fast；不得partial store/fallback |
| 9 external Port slots / 14 calls | adapter/ref | P0 typed runtime seam；P1 selected parity | `PH-04..11` | capability-hub infra + future external owners | 9/9 branch/family/ref checks、typed failure tests | P0 fake/disabled缺失失败；selected unavailable blocked |
| six Worker sources | event/source adapter | P0 controlled event seam；P1 selected source | `PH-05/07/09/11` | capability-hub worker + future source owners | six-slot graph、schema/actor/header-first、lifecycle tests | enabled missing blocks；Disabled不取消息；selected blocked |
| ten outbound routes | event collaboration | P0 controlled publisher seam；P1 selected transport | `PH-09..11` | capability-hub infra + transport owner | exact 10/10 family/ref/constructor check、A-B-C tests | configured graph缺项fail-fast；不创建local delivery truth |
| MCP/A2A/API source products | external product | runtime adapter dependency, never compile edge | `PH-04` selected onward | future integration owner | selected immutable adapter/config/TLS manifest + parity run | P0用typed fake/disabled；required selected unavailable blocks selected/release |
| governance result source | external ref/event | runtime/event seam | `PH-05/09` | governance owner | body-free ref outcome、source event/actor tests | unavailable typed；不得Hub生成approval/Policy |
| method-library asset source | external ref/event | runtime/event seam | `PH-05/07/09` | method-library owner | body-free asset ref/relation tests | unavailable typed；不得复制body/source/lifecycle |
| consumer / SDK references | external ref | runtime read/exposure seam | `PH-06..10` | runtime/tools and SDK owners | typed consumer refs、no reverse-write tests | unavailable/degraded typed；不得引入SDK client/cache |
| audit/document/secret references | external ref/handoff | runtime seam | `PH-04/07/09/10` | respective owners/providers | ref-only、redaction、handoff failure tests | no raw body/secret；Configured material缺失fail-fast |
| deterministic fixture/fault harness | test adapter | P0 test dependency | `PH-01..11` | capability-hub tests | fixture digest、same-family parity、cleanup/barrier checks | missing/invalid fixture使affected suite失败 |
| artifact/report filesystem roots | filesystem | evidence execution dependency | `PH-01..11` | implementation repo / gate caller | explicit writable roots、no `latest`、pairing dry-run | runner/builder失败；不得改到隐式路径 |
| selected staging/release environment | environment | P1/R4 dependency | `PH-11` only as declared | operations/security/integration owners | immutable environment/config/product/TLS/scope manifest | `blocked_dependency`; no P0 compensation or verdict |

## 5. 配置与环境准备合同

### 5.1 Canonical configuration family checks

| 配置族 | Cardinality / branch | 使用阶段 | 最低检查 | 失败处理 |
|---|---|---|---|---|
| root / schema / profile / entry | schema v1；one `local|integration|deployment`；one `api|worker|jobs` | `PH-01+` | strict JSON、selector assertion、entry section exact match | V0/V1 fail-fast；不读业务bytes |
| local authority | exactly one `inMemory|durable` | `PH-02+` | 27 local/base Ports same authority；Deployment durable-only | partial/second/Missing/inMemory Deployment blocks |
| external Ports | 9/9 `Configured|DeterministicFake|Disabled` | `PH-04+` | family/ref/branch exact；Deployment fake=0 | no fallback；Missing blocks activation |
| clock / ID | system or deterministic by profile | `PH-01+` | single source、fixture parity；Deployment system-only | missing/second/Deployment deterministic blocks |
| compatibility | `stableSurfaceV1 + sha256V1` | `PH-01+` | exact literals、fixture/codec/digest checks | alias/version drift controlled reopen |
| API entry | body/page/time bounds | `PH-03/04/05/06/07/08/11` as selected | pre-decode bytes、page reject/no clamp、non-cancelling timeout | invalid config/startup or request rejection |
| Worker entry/sources | bounds + 6/6 source unions | `PH-05/07/09/11` | global permits、six parked/disabled slots、header-first | partial graph/lifecycle/source mismatch blocks |
| Jobs entry | bytes/page/deadline/reentry policy | `PH-06/10/11` | exact 8 dispatch、collect-before-mutate、no entry auto-retry | generic execute/invalid policy blocks |
| collaboration routes | configured event Port requires 10/10 routes | `PH-09..11` | exact family set、one-way transport、immutable payload source | missing/wildcard/payload rewrite blocks |
| technical retry/timeouts | exact bounded objects | affected `PH-02..10` | typed retry eligibility + effect proof；commit observation不重做mutation | invalid/no proof => no retry or startup reject |
| diagnostics | `off|redacted` | `PH-01..11` | required profile presence + redaction/neutrality | raw/full/verbose或observer effect blocks |
| material registries / refs | endpoint/transport/credential/TLS/feed/actor/route/fixture | configured branches | closed kind/family/reachability/security; raw secret=0 | mismatch/orphan/cycle/unavailable fail-fast |
| artifact/report CLI roots | explicit `--run-id --artifact-root --report-root` | gate/report boundaries | root ownership、same-run path、write/digest/pairing | missing/implicit/cross-run invalidates gate |

### 5.2 Seven environment contracts

| Environment | Profile / entry | Purpose and required material | Status before implementation | Unavailable handling |
|---|---|---|---|---|
| `ENV-CH-LOCAL-CONTRACT` | Local；entry per case | one-cut reproduction、in-process Fake/Controlled、one DS | designed only；target repo absent | P0 prerequisite；cannot pass without execution |
| `ENV-CH-CI-STATIC` | no root or minimal Local constructability | inventory/dependency/Rustdoc/codec/config corpus | designed only；CI absent | static gate not run |
| `ENV-CH-CI-DETERMINISTIC` | Local/Integration；entries separate | all 189/638 P0 semantics with parity fake | designed only | missing harness/config fails main |
| `ENV-CH-INTEGRATION-CONTROLLED` | Integration；entries separate | Stage 0~7、9/6/10 graph、typed unavailable/failure | designed only | controlled graph failure blocks |
| `ENV-CH-RECOVERY-CONTROLLED` | Integration；Worker/Jobs primary | UoW/race/A-B-C/reentry/Unknown/barrier faults | designed only | failed cleanup/detached owner invalidates run |
| `ENV-CH-SELECTED-STAGING` | Deployment；one selected entry | real-like durable/external/TLS/observer parity | blocked: products/config not selected | `blocked_dependency`; no selected pass |
| `ENV-CH-RELEASE-CANDIDATE` | Deployment；declared release entries | actual lower-run aggregation + smoke + review drafts | blocked: repo/runs/operations prerequisites absent | release ineligible；no verdict/signoff |

Environment ID 是计划身份，不是 host、namespace、resource 或已经创建的环境。CI/staging/release 也不是新的 runtime profile。

### 5.3 Fake / Controlled / Disabled 使用边界

| Seam | P0 允许 | 必须保持的 parity | 禁止 | Phase |
|---|---|---|---|---|
| local authority / repositories | inMemory fake，Integration可durable-like | UoW、CAS/unique/current、rollback、commit tri-state、cursor/index、atomic sidecar | upsert、hidden cache、partial authority、Deployment inMemory | `PH-02..10` |
| idempotency/stored result/capture/job journal | deterministic fake | reserve one-winner、digest/key、immutable replay、capture/journal/report symmetry | duplicate重跑mutation、覆盖failed/unknown、TTL semantic | `PH-02..10` |
| external 9 Ports | same-family deterministic fake or explicit Disabled | exact 14 call signatures、typed unavailable/failure、body-free symmetry | generic adapter、fake success from Disabled、Configured->Fake fallback | `PH-04..10` |
| Worker sources | controlled/fake envelopes or Disabled | schema/source/actor/header-before-body、receipt/replay/lifecycle | body-first、fake ack/lease truth、partial six-source exposure | `PH-05/07/09` |
| outbound collaboration | controlled publisher/failure injection | immutable snapshot/capture/intent、A Durable before B、typed C | current-truth payload rebuild、queue/DLQ/attempt/ack store | `PH-09/10` |
| Query/material dependencies | controlled stale/degraded/unavailable | visibility-first、typed freshness/degraded、zero write/repair | silent empty、auto-refresh、first-row inference | `PH-06/08/10` |
| Jobs/recovery | frozen fixture/replay root | exact target plan、ordinal journal、stored report、safe terminalization | rescan/replan、recursive entry、core truth repair | `PH-10` |
| observer/report pipeline | local safe sink and raw-derived builders | profile inventory、redaction、same-run digest/pairing、business neutrality | static pass map、observer retry/UoW、builder verdict | `PH-01/11` |

Expected negative fixture只有在 exact case 实际运行并得到规定 typed oracle时才可通过；“依赖没装”本身不是 negative test pass。

## 6. Phase 与 boundary 准备矩阵

### 6.1 Phase readiness matrix

| Phase | 开工前必须 ready | 可后置 | 不可用处理 / stop-review |
|---|---|---|---|
| `PH-01` | target repo、`.git`/worktree、7-member Cargo skeleton、core path、toolchain、config/parser roots、scripts/ledger roots | real products、durable deployment | 任一必需项缺失暂停；设计期当前target repo未ready |
| `PH-02` | Local deterministic root、one inMemory authority、clock/ID、contract/domain/application fake foundation | external configured products | fake parity或638 registry source缺失阻断 |
| `PH-03` | identity/registry stores、expected-version/idempotency/result fixtures、API Local root | external source product | winner/history/no-write准备不全阻断 |
| `PH-04` | descriptor stores、external source/secret/doc fake/disabled bindings、redaction corpus、Integration graph | selected MCP/A2A/API | Configured/Fake/Disabled不闭合或body leak阻断 |
| `PH-05` | governance/method Port fake/disabled、I01/I02 controlled source fixtures、relation store | real governance/method events | owner/body/ref/receipt dependency缺口阻断 |
| `PH-06` | exposure/view stores、visibility resolver、consumer refs、API query environment | SDK client/runtime enforcement | missing visibility/applicability source或query mutation阻断 |
| `PH-07` | trace/impact/reference stores、I03..I06 fixtures、safe observer/redaction | real audit/document feeds | sidecar/capture/ref kind dependency缺口阻断 |
| `PH-08` | full API Query root、material/projection fixtures、stale/degraded fault harness | selected search/directory products | no-write/freshness source不全阻断 |
| `PH-09` | Worker Integration root、6 source graph、10 route graph、publisher/capture/receipt fixtures | real bus/source/transport | partial graph、header/body、A-B-C或cleanup failure阻断 |
| `PH-10` | Jobs Integration root、8 dispatch、frozen plan/journal/report/replay root、recovery harness | real scheduler/operations targets | replan/repair/reentry/report dependency缺口阻断 |
| `PH-11` | compatible lower runs、explicit roots、9 checks、4 builders、review draft schemas | non-required selected run | P0/report/VETO/review缺口保持not_decided；selected不补偿 |

### 6.2 Boundary readiness matrix

| Boundary | 必查配置 / 依赖 | 检查方式方向 | 不可用 / 冲突处理 |
|---|---|---|---|
| `commit-01-a` | target repo、workspace、core path、toolchain、git/worktree | preflight + dependency/Rustdoc checks | pause；不得创建copied core |
| `commit-01-b` | strict parser、3 profiles/3 entries、18/27/21 catalog、script/root CLI | config/catalog/no-static dry-run | config/root/script冲突阻断 |
| `commit-02-a` | core shared refs/metadata/codec candidate、safe error types | contract compile/roundtrip/doc | core shape冲突回写 owning design/debt |
| `commit-02-b` | one fake authority、domain state fixtures、638 registry | domain-state/state-pair check | parity或pair source缺失阻断 |
| `commit-02-c` | 36 Ports、UoW、idempotency/result/capture/job store fake shell | transaction/fake parity checks | hidden Port/partial authority/commit mapping阻断 |
| `commit-03-a` | identity/review typed source and state fixtures | contract/domain targeted | URL/provider/config substitute => VETO |
| `commit-03-b` | registry current/history/index fixtures | contract/domain targeted | allowlist/cache/listing semantics => VETO |
| `commit-03-c` | Local API root、same-UoW stores、clock/ID、stored result | service/TX targeted | winner/no-write/source dependency失败阻断 |
| `commit-04-a` | descriptor/risk/secret-safe fixtures、forbidden corpus | contract/redaction | raw body/secret/provider truth => VETO |
| `commit-04-b` | externalSource/secret/document configured-fake-disabled material | binding/config/redaction/dependency | product unavailable selected-blocked；P0 graph缺失失败 |
| `commit-05-a` | governance/method safe ref fixtures、relation state | contract/responsibility/redaction | approval/method body ownership => VETO |
| `commit-05-b` | relation stores、controlled resolver、I01/I02 source contracts | service/TX/inbound | worker loop后置；Port/fake缺口阻断 |
| `commit-06-a` | exposure/applicability/visibility typed fixtures | contract/state/responsibility | runtime allow/deny或SDK state => VETO |
| `commit-06-b` | visibility resolver、view store、consumer ref bindings、API root | service/query/binding | Missing source或query repair阻断 |
| `commit-07-a` | trace/impact/change/capture stores和safe observer fixture | TX/redaction/pairing | source/capture/revision不对称阻断 |
| `commit-07-b` | reference store/resolver/sidecar、I04..I06 fixtures | service/inbound/dependency | string kind/body/non-core edge => VETO |
| `commit-08-a` | query DTO/page/marker/read Port fixture | compile/doc/no-write scan | missing source回写 `03`；不得补write Port |
| `commit-08-b` | API core query root、visibility/degraded fixtures | main query/no-write | write/fallback/visibility leak hard block |
| `commit-08-c` | material/report read stores、freshness/redaction fixtures | main query/redaction | refresh/job/event side effect阻断 |
| `commit-09-a` | Worker root、6 source slots、feed/actor fixture、receipt store | entry/config/redaction/pairing | partial runner/body-first/replay mutation阻断 |
| `commit-09-b` | collaboration Port、10 route refs、snapshot/capture/publisher fixture | outbound/config/redaction | route缺失、payload重算或local delivery truth阻断 |
| `commit-10-a` | Jobs root、8 dispatch、public protocol/journal/report fixtures | compile/doc/job protocol | generic execute或schema/Rustdoc缺口阻断 |
| `commit-10-b` | frozen targets、material stores、journal/report/replay harness | jobs/state/TX/config | rescan/replan/core repair阻断 |
| `commit-10-c` | collaboration recovery intent/capture/commit-resolution fixtures | jobs/outbound/TX/redaction | blind retry/recursive entry/unknown success阻断 |
| `commit-11-a` | raw/check/builder fixture schema、explicit roots、safe sink | evidence pipeline + 9 checks | missing root/digest/redaction/no-static使artifact invalid |
| `commit-11-b` | compatible lower-run manifest、acceptance/review draft schema、selected refs if required | release dry-run/schema/VETO checks | missing required input保持not_decided；无自动signoff |

## 7. 不可用语义、停审与跨依赖审计

### 7.1 Environment / dependency unavailable matrix

| 场景 | 正确状态 / 行为 | 是否允许继续 | 是否可记 pass |
|---|---|---|---|
| target repo absent | implementation prerequisite | 不进入 PH-01 实现 | 否 |
| core path/Cargo resolution failed | prerequisite/dependency failure | 暂停当前 boundary | 否 |
| toolchain command unavailable | environment failure | 暂停并修复 | 否 |
| P0 config Missing/invalid/partial | fail-fast / gate failed | 不进入entry/next phase | 否 |
| DeterministicFake parity defect | suite failed / design difference | 修复或`wait_design` | 否 |
| explicit Disabled external slot | typed `NotConfigured` branch | 只在声明允许的case继续 | 仅exact expected case |
| Configured constructor/probe failed | startup/entry assembly failure | 不fallback | 否 |
| controlled unavailable/failure injection | exact typed unavailable/degraded/failed | case可继续到oracle | 仅oracle完全匹配时 |
| selected product/TLS/route unavailable | `blocked_dependency` | P0可独立；selected/release按manifest阻断 | 不计P0或selected pass |
| artifact/report root不可写 | runner/builder failed或`invalid_artifact` | 不提交/不handoff | 否 |
| redaction/dependency/report check失败 | blocking/VETO risk | 不进入后续 | 否 |
| host观察与target manifest不同 | baseline drift | 冻结新baseline并重新运行 | 旧观察非pass |

### 7.2 配置 / 环境停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| compile dependency only core-contracts | `pass-designed` | 实现期Cargo metadata再验证 |
| target repo readiness | `implementation_prerequisite` | 当前absent；PH-01前创建/确认 |
| 3 profile / 3 entry identity | `pass-designed` | environment purpose不得新增enum |
| 18/27/21 config inventory | `pass-designed` | `07`不复制第二schema；formal `04`继续权威 |
| 9/14 external Port surface | `pass-designed` | products unselected；P0 fake/disabled parity |
| 6 Worker sources / 10 routes | `pass-designed` | partial activation和wildcard route禁止 |
| fake/controlled/disabled boundary | `pass-designed` | no fallback、no semantic shortcut |
| seven ENV contracts | `pass-designed` | 当前均非真实环境；selected/release blocked |
| phase readiness | `11/11 pass-designed` | 每个phase有明确prerequisite与failure action |
| boundary readiness | `26/26 pass-designed` | 每个boundary有配置/依赖检查 |
| evidence roots | `pass-designed` | 不创建真实run/root内容或`latest` alias |
| execution truthfulness | `pass-designed` | repo/build/test/environment/evidence facts未伪造 |

### 7.3 跨配置 / 外部依赖审计

| 审计项 | 结果 | 结论 |
|---|---:|---|
| dependency categories | compile/runtime/event/ref/handoff/test/evidence/selected均分离 | pass-designed |
| non-core sibling compile edges | allowed count `0` | pass-designed |
| core compile edge | candidate count `1` | pass-designed |
| profile/entry set | `3 / 3` | pass-designed |
| config inventory | `18 modules / 27 rows / 21 env leaves` | pass-designed |
| binding inventory | `27 local/base Ports / 9 external Ports / 14 calls / 6 sources / 10 routes / 8 jobs` | pass-designed |
| phase preparation | `11/11` | pass-designed |
| boundary preparation | `26/26` | pass-designed |
| P0 selected contamination | `0` | pass-designed |
| automatic fallback paths | `0` allowed | pass-designed |
| forbidden responsibility leakage | runtime/tools execution、approval、method body、provider truth、marketplace、SDK client/cache、observer backend=`0` planned owners | pass-designed |
| unresolved upstream design blocker | `0` | pass-designed |

## 8. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` §4~§7

正式 `07-实施计划.md` §8 应固定：目标实现仓是 PH-01 实施前置，唯一 sibling 编译依赖为 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。其余 governance、method-library、runtime/tools、SDK、observability/audit、external documents、MCP/A2A/API 和 event transport均通过 typed Port/event/ref/adapter/handoff/fake seam协作，不得成为Cargo path dependency或Hub truth owner。

配置准备只承接formal `04` 的 18 modules、27 rows、21 env leaves、Local/Integration/Deployment、API/Worker/Jobs、9 external slots、6 sources、10 routes和complete activation predicate。P0前五个环境可使用parity-complete inMemory、DeterministicFake、Controlled和explicit Disabled；Configured失败绝不fallback，Deployment fake=0。Selected staging和release candidate当前为blocked prerequisites，不能补偿P0或形成验收结论。

## 9. 待确认事项与 Step 9 输入

| 事项 | 当前状态 | 下一步 owner |
|---|---|---|
| target repo创建、git/worktree/Cargo baseline | implementation prerequisite | PH-01 / implementation ledger |
| core shared serde wire长期兼容 | non-blocking design-sync debt | Step 9 risk；触发时reopen `03/04/05` |
| durable authority product/schema/migration | selected product unresolved | Step 9 spike/risk；future persistence owner |
| 9 external adapter products / 6 source products / 10 route transports | selected unresolved | Step 9 product-binding spikes |
| credential/TLS/provider material | selected/operations unresolved | Step 9 security risk；future `09` operations |
| concrete observability backend | controlled reopen | Step 9 risk；不得当前新增dependency/config |
| selected/release environment owner and config artifact | downstream prerequisite | Step 9 + Step 12 completion criteria |
| artifact retention/permissions/cutover/runbook | operations document absent | Step 9 risk；不在本Step猜策略 |
| current upstream design blocker | none | 允许进入 Step 9 |

## 10. Step 8 完成记录

| 项目 | 状态 |
|---|---|
| Step 8 设计产物 | completed_continuous_execution |
| external dependency readiness rows | 15 |
| phase / boundary readiness | 11/11；26/26 |
| canonical config/binding | 18/27/21；3 profiles；3 entries；27+9/14+6+10+8 |
| current observations | core path exists；target repo absent；host toolchain observed only |
| fake/selected separation | P0 parity seam closed；P1/R4 unavailable remains blocked |
| implementation facts | 0；未声明target repo、build、test、environment、run、artifact、evidence或commit已完成 |
| next step | Step 9 Spike、风险与待确认事项 |
