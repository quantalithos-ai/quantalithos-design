# Step 14. 配置引用与外部依赖绑定

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14
> 书写规范：`standards/document/详细设计书写规范.md` §5.13
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md`
> 回填位置：未来正式 `03-详细设计.md` §13
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 14 |
| current_module | `config_dependencies:binding_and_readiness` |
| gate_status | `pass_for_step_15` |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| technology_decision_status | `blocked_pending_authority` |
| next_allowed_action | 创建 Step 15 可观测性与审计埋点中间产物 |

本步定义代码绑定点和依赖分类，不生成完整 `04-配置设计.md`，不锁具体环境变量、endpoint、secret、backend、transport、retry 数值或产品。

## 2. SOP 问题回答

| 问题 | Runner 答案 |
|---|---|
| 哪些模块读配置？ | 只有 `infra` builder/config、entry、worker、operations 装配层读取 validated config；application 接收 typed ports/limits；domain/contracts 不读取 config。 |
| 配置项默认值如何处理？ | 只定义类型占位、读取位置和 fail-closed 语义；数值、profile/env 合并和 secret 来源留 `04`。不得把“local default”写成 production readiness。 |
| 哪些外部依赖走 adapter？ | L0-sdk、Artifact/Governance authority、Sandbox、Runtime、Observability、Archive、Platform resource、clock/id 和 local stores 全部通过 Step 7 port/adapter；当前 positive readiness 保持 blocked/pending。 |
| 运行期/事件依赖如何表达？ | SDK/API/adapter、safe projection、header-first Consumer、handoff 或 fake；不得把运行期/事件协作写成 package/path dependency。 |
| 依赖缺失怎么办？ | 编译期 shared contract 缺失则暂停；运行期/事件依赖可用 fake/fixture 保持语义，但 upstream typed contract 缺失必须回设计，不能私造 DTO。 |

## 3. 配置引用表

| 配置绑定项 | 类型（占位） | 读取模块 | 默认/缺失语义 | 详细配置落点 |
|---|---|---|---|---|
| profile/config identity | `RunnerRuntimeProfileRef` / `RunnerInfraConfigRef` | `infra/config`、builder | 缺失/冲突拒绝 | `04` profile/config |
| local truth store | `RunnerStoreConfigRef` | `infra/runtime_builder` | 不可证明 transaction/version/durability 时 builder Blocked | `04` store |
| projection/read-section store | `RunnerStoreConfigRef` | builder/projection adapter | 缺失则 query degraded，refresh 不创建 identity | `04` projection |
| idempotency/stored-result store | `RunnerStoreConfigRef` | builder/result adapter | 缺失则禁止 write/external effect | `04` idempotency/result |
| cache/quarantine capability | `RunnerAdapterConfigRef` | builder/material adapter | unavailable -> acquisition/run blocked | `04` cache |
| source/authority/integrity adapters | `RunnerAdapterConfigRefSet` | builder/application ports | exact upstream contract 未闭合则 Blocked | `04` external bindings |
| Sandbox/Runtime adapters | `RunnerAdapterConfigRefSet` | builder/application ports | configured ≠ Ready；positive call blocked until authority | `04` runtime/sandbox |
| observability/diagnostic/handoff | `RunnerAdapterConfigRefSet` | builder/J04/C11 | safe read/handoff unavailable -> bounded blocked surface | `04` observability |
| page/body/batch bounds | typed finite limits | entry/query/job validation | missing/invalid -> entry rejected; no hidden default | `04` boundary |
| idempotency windows | typed durations | result/operations stores | values pending; never delete unresolved records | `04` idempotency |
| job parallelism/retry/timeout | typed job policy | operations/worker | values pending; no retry may break no-replay | `04` jobs |
| clock/id generator | `RunnerAdapterConfigRef` | infra builder | deterministic fake in tests; unavailable blocks mutation | `04` platform |
| feature enablement | finite feature markers | builder/registry | may disable peripheral paths only | `04` features |

完整配置格式、env/profile/secret、endpoint、topic、timeout/retry/retention 数值不在本步固定。

## 4. Config section 到代码绑定

| 绑定层 | 代码职责 | 注入内容 | 不变量 |
|---|---|---|---|
| `infra/config` | load/validate/redact | validated refs/finite limits | 不暴露 raw secret/body |
| `infra/runtime_builder` | assemble registry/UoW/services | Step 7 ports and markers | missing core store => not Ready |
| `entry` | validate command/query metadata/page | typed boundary limits | 不绕过 actor/scope/idempotency |
| `worker` | readiness-first consumer | worker port markers | positive Consumer remains blocked |
| `operations` | job registry/claim/checkpoint policy | bounded page/timeout/parallelism | job 不修 owner truth |
| `application` | receive typed policy/port | no raw config | no config-driven state bypass |
| `domain/contracts` | pure object/protocol | no config handles | state/ownership cannot be feature-flagged |

## 5. 外部依赖绑定表

| 依赖 | 绑定接口 | 当前状态 | 不可用处理 |
|---|---|---|---|
| `L0-sdk` | SDK-first semantic adapters | exact surface pending `RUN-UP-008` | Blocked/Unsupported；不猜 client method |
| Artifact/Governance authority | `ReleaseAuthorityReadPort` / `MaterialSourcePort` / verifier | blocked `RUN-UP-001/002` | no Current/Verified/Qualified；不下载/启动 |
| Sandbox | `SandboxRunPort` | blocked `RUN-UP-003/007` | no positive side effect; accepted not running |
| Runtime | `RuntimeStatusReadPort` | blocked `RUN-UP-004` | unknown safe view; no local Running |
| Platform resources | `PlatformResourcePort` | blocked `RUN-UP-007` | conflict/unknown -> fail closed |
| Observability | diagnostic/handoff ports | blocked `RUN-UP-005` | bounded preview/diagnosis unavailable; no evidence |
| Archive | `ArchiveReferencePort` | peripheral blocked `RUN-UP-006` | no startup/cleanup success dependency |
| local stores/cache | repository/UoW/MaterialCache ports | blocked `RUN-DDD-001~003` | no fallback store; builder not Ready |
| Clock / ID / digest | Step 7 application ports | semantic only | deterministic fake for design tests; no ad hoc IDs/time |

Runtime/event dependencies use adapter/API/projection/fake. They must not become Cargo/package dependency merely because a sibling repository exists.

## 6. 跨仓依赖裁剪

| 关联项目 | 全局关系 | Runner 角色 | 依赖类型 | 当前文档主链 | 裁剪口径 |
|---|---|---|---|---|---|
| `L0-core` | shared contract source | consumes shared refs/metadata only | compile candidate | yes, semantic | exact path/crate pending authority |
| `L0-sdk` | client facade | consumes formal APIs/SDK | runtime/compile candidate | yes, boundary | SDK-first; exact version/surface pending |
| `L4-sandbox` | isolation support | request/control/read via public seam | runtime | yes | no private implementation reuse |
| Artifact/Governance/Runtime/Observability/Archive | truth/diagnostic owners | read safe surfaces/handoff | runtime | yes | no local truth writeback |
| `L0-bus` | event backbone | current planned Consumer only | event | reserved/blocked | no outbound event; no direct package dependency |

```text
Global baseline
  |
  | crop related edges only
  v
+----------------+
| L5-runner      |
+---+--------+---+
    | [compile candidate] L0-core / L0-sdk contracts
    | [runtime] L0-sdk, Artifact, Governance, Sandbox, Runtime,
    |           Observability, Archive
    | [event] L0-bus planned Consumer (currently blocked)
    v
safe refs / public APIs / semantic adapters / fake seams
```

图示仅表达依赖类型，不表达调用顺序或 transport。

当前没有足够 authority 锁定 `/home/aris/Projects/quantalithos-runner` 的 package、crate、Cargo path 或 binary；不得从 README/旧 03 继承 Rust/Tauri/Docker 等技术。

## 7. 禁止配置化边界

- 不得改变 truth owner、state matrix、actor visibility、exact version/generation、idempotency 必填或 Query no-write。
- 不得允许保存 Release/Artifact/Governance/Sandbox/Runtime/Observability/Archive 正文、raw payload、secret、host path 或 private adapter state。
- 不得以 feature flag 把 `Accepted` 变成 `Running`、`Complete` 变成 `Qualified`、`Confirmed` 变成 `Cleaned` 或 receipt 变成 evidence。
- 不得把 non-core sibling repo 配为 package/Cargo dependency；依赖类型必须先经全局裁剪规则确认。
- 不得用 config 放宽 safety guard、bypass formal API、启用当前 reserved Consumer positive path 或制造 projection identity。

## 8. Runtime builder 绑定顺序（逻辑）

```text
load config -> validate/redact refs and finite limits
  -> build local store/UoW capability markers
  -> build idempotency/result/repository adapters
  -> build external semantic adapters (currently blocked/pending)
  -> build Clock/Id/Digest ports
  -> construct application facade/entry/worker/jobs
  -> mark Ready only when core local guarantees are proven
```

`Ready` 只表示 local composition 可 fail-closed 暴露；不表示 owner adapter、Sandbox、Runtime、Consumer 或 product shell ready。Config reload 必须创建新 builder/marker，不得原地修改已暴露业务 truth。

## 9. 前序闭环审计与 Step 15 handoff

| 审计项 | 结论 |
|---|---|
| config read location | pass |
| adapter/port binding | pass for semantic surface |
| compile/runtime/event classification | pass; exact path blocked |
| configured vs enabled vs ready | pass |
| no config bypass of truth/safety | pass |
| numeric defaults/secret/endpoint | pending `04` |
| exact SDK/package/backend | blocked `RUN-UP-001~008`, `RUN-DDD-001~003` |

Step 15 must define safe logging/metrics/audit points for config rejection, adapter blocked/unavailable, builder readiness, feature-disabled surfaces and dependency correlation without recording secrets, raw bodies or paths.

## 10. Step 14 完成条件

| 条件 | 结论 |
|---|---|
| 配置读取模块和绑定点 | completed |
| 外部依赖 adapter/port/fake | completed as semantic contract |
| compile/runtime/event 分类 | completed |
| 禁止配置化边界 | completed |
| exact config file/default/product | blocked and left to `04`/authority |
| next gate | `pass_for_step_15` |

Step 14 完成。本文不证明配置文件、runtime builder、adapter、测试或 production readiness 存在。
