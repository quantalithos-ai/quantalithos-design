# L2-tools 07 实施计划 Step 8：配置、环境与外部依赖准备

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 配置 authority | `04-配置设计.md` §3~§12 | ten roots、54 items、profile/source、V0~V8、B0~B8。 |
| 依赖方向 | `01` §8、`03` §13/§16 | compile/runtime/event/future 分类。 |
| 测试环境 | `05` §8~§9 | local/ci/integration/release 运行语义。 |
| 实际目录探测 | `/home/aris/Projects` read-only check | 区分 path exists 与 readiness。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 目标仓是否存在？ | `/home/aris/Projects/quantalithos-tools` 不存在，是 PH-01 实施启动 blocker。 | 实际目录检查。 |
| Core 依赖是否存在？ | `/home/aris/Projects/quantalithos-core/crates/contracts` 存在，package=`core-contracts`, crate=`core_contracts`, Rust 2024/MSRV 1.93；仍需实现期 baseline/API 复核。 | 实际 Cargo manifests。 |
| sibling 仓是否都是 Cargo 依赖？ | 否。只有 Core 是 compile candidate；Hub/Auth/Sandbox/Runtime 是 runtime seam，Bus/Obs event seam，SDK future consumer。 | 全局依赖规则。 |
| 哪些 profile 可用于 P0？ | `local-dev`,`ci-test`,`integration-like`；`staging-like`,`production-like` inactive/conditional。 | 04 §6、05 §8。 |
| fake 如何使用？ | deterministic/controlled fake 只证明本地 contract parity，不关闭 upstream blocker 或 readiness。 | 04/05。 |

## 当前材料问题诊断与取舍

| 议题 | 诊断 | 取舍 |
|---|---|---|
| 目录存在可能被误读为可联调 | capability-hub/bus/sdk 存在不等 contract/readiness | 只记录 existence；接口 readiness 仍按 formal owner/gate。 |
| sandbox/observability/runtime 目录缺失 | external positive 无法本地联调 | 不阻塞 local/negative；positive `blocked_dependency`。 |
| Core Cargo 存在但 tools-specific schema 未闭 | 可解析 crate 不等 authority 完整 | 允许 compile candidate；tools-specific schema 仍受 L2T-UP-008。 |
| 54 config item 不应复制到 07 | 容易漂移 | 07 只列 activation/readiness contract，正式04为唯一 schema。 |

## 结构化中间产物

### 本地仓状态与依赖分类

| 依赖 | 类型 | 本地路径状态（2026-08-07） | 协作方式 | 不可用处理 |
|---|---|---|---|---|
| Core | compile candidate | `quantalithos-core` exists；contracts manifest verified | local path candidate to `../quantalithos-core/crates/contracts` | Cargo/API mismatch -> pause/wait_design；不得复制类型 |
| Capability Hub | runtime seam | `quantalithos-capability-hub` exists | typed Port/controlled fake | existence 不等 readiness；blocked-aware |
| Authorization | runtime seam | 无独立确认路径 | typed consumption Port | missing/stale/conflict/unverifiable fail-closed |
| Sandbox | runtime seam | `quantalithos-sandbox` missing | typed readiness/execution Port | local negative continues；positive blocked |
| Runtime | consumer/runtime seam | `quantalithos-runtime` missing | canonical invocation caller Port/server contract | 不在 L2 实现 orchestration |
| Bus | event seam | `quantalithos-bus` exists | semantic event/collaboration Port | local attempt only；no delivery truth |
| Observability | event seam | `quantalithos-observability` missing | safe material/status Port | no store/Observed truth；positive blocked |
| SDK | future consumer | `quantalithos-sdk` exists | server contract/future client | no client readiness claim |

### Canonical profile 准备

| Profile | 用途 | P0 允许 binding | 不允许 | 当前状态 |
|---|---|---|---|---|
| `local-dev` | local reproduction | in-memory Stores, deterministic fake/disabled external slots | external readiness claim | planned |
| `ci-test` | deterministic PR/main/release | controlled fake, fixed Clock/ID, full 234 denominator | hidden external success/cross-run | planned |
| `integration-like` | controlled seam/fault tests | configured controlled adapters or explicit disabled | fallback to fake after configured failure | planned |
| `staging-like` | future owner qualification | only formal selected products/contracts | P0 compensation | inactive/blocked |
| `production-like` | future release/deployment | no fake, full owner/ops/security closure | any current readiness claim | inactive/blocked |

### Config activation contract

| Stage | 必须准备 | 失败行为 |
|---|---|---|
| V0~V2 | strict JSON shape/type/ten roots/required items | fail-fast, no runtime object |
| V3~V4 | profile/source/cross-section invariants | no fallback to lower source/default/fake |
| V5 | seven Store/UoW/CAS/pair/page/watermark/replay capability | missing capability blocks graph |
| V6 | external slot mode/ref/family/version/blocker class | valid blocked-aware adapter or typed config error |
| V7 | sensitive/body/redaction + NC-L2T-001~025 sweep | unsafe override hard fail |
| V8 | total slots/registration/event target/config identity | zero entry exposure on failure |
| B0~B8 | immutable config -> Stores/UoW -> Clock/ID -> Ports -> facades -> entries -> redline audit | dispose partial graph; never expose half bundle |

### Phase/Boundary readiness 摘要

| Phase | 必须 ready | 可后置 | 不可用行为 |
|---|---|---|---|
| PH-01 | target repo/git/worktree/toolchain/Core path | external products | repo absent currently blocks implementation |
| PH-02~04 | deterministic Store/UoW/fake + relevant typed Port | positive Hub/provider | parity failure blocks; positive remains conditional |
| PH-05~06 | Auth/Sandbox/source/collaboration blocked adapters and fault harness | real run/route/status | no default allow/host/fallback |
| PH-07~09 | projection/read/receipt/job fixtures and bounded scopes | durable/selected environment | missing source explicit degraded/blocked |
| PH-10 | complete 54-item candidate, V0~V8/B0~B8, seven entry bundles | staging/production products | no partial graph/entry |
| PH-11 | fixed run roots, 11 suite/check registries, report/evidence builders | conditional-provider run | missing denominator invalidates eligibility |

### 工具与文件系统前置

| 检查 | 要求 | 当前状态 |
|---|---|---|
| Rust | edition 2024, MSRV compatible with Core 1.93 | planned; target repo absent |
| Cargo workspace | seven exact members | planned |
| git identity | repo-local `quantalithos-labs` / `quantalithos.ai@gmail.com` | pending |
| scripts | `scripts/gates`,`scripts/reports`,`scripts/checks`,`scripts/dev` | planned |
| raw/report roots | explicit fixed run, writable, no `latest` | planned/not_created |
| secret/ref | opaque ref only; no raw value/digest in output | design-closed; execution pending |

### Environment unavailable matrix

| 场景 | 状态/动作 | 可继续范围 | 可记 pass |
|---|---|---|---|
| target repo absent | implementation blocked | design only | 否 |
| Core path/API mismatch | pause current boundary | none until closure | 否 |
| valid explicit Disabled external slot | typed NotConfigured/blocked branch | declared local/negative case | only exact case oracle |
| configured adapter unavailable | typed unavailable, no fallback | unaffected local truth | not positive |
| external repo/service missing | `blocked_dependency` | local P0/negative | 否 |
| artifact/report root unwritable | invalid_artifact/gate failure | preserve prior runs | 否 |
| profile mismatch/fake leak | hard failure/VF risk | none | 否 |

### 配置/依赖停审与跨审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Core compile candidate | pass-observed | actual manifest exists; implementation baseline pending。 |
| non-Core Cargo dependencies | zero allowed | runtime/event/future seam only。 |
| target repo readiness | blocked prerequisite | not a design blocker; implementation cannot start。 |
| profile/source/fake separation | pass-designed | no fallback/readiness promotion。 |
| 54 item/V0~V8/B0~B8 coverage | pass-designed | authority remains formal 04。 |
| external positive | blocked/conditional | L2T-UP-001~009 retained。 |
| current run/evidence | none | no artifact/report/environment claim。 |

## 回填草稿

正式 07 §8 应记录实际路径 existence 与依赖类型，明确 Core local path candidate、其他 sibling 不得进 Cargo；配置只引用正式04的 ten roots/54 items、profile、V0~V8/B0~B8；目标仓缺失与 baseline 未冻结是 PH-01 前置 blocker。

## 待确认事项与进入下一步条件

| 事项 | 影响 | 截止点 |
|---|---|---|
| target repo creation/authorization | all implementation | commit-01-a activation |
| immutable design baseline | Design Gate | implementation handoff |
| durable Store/product/TLS/route | future positive/integration | corresponding adapter boundary |
| safe config digest projection | release evidence | PH-11; absent means unavailable, never raw hash |

- [x] 配置、profile、环境、依赖和不可用语义明确。
- [x] 实际 path existence 与 readiness 分离。
- [x] 无 sibling dependency 越界或 fake readiness。
