# Step 8. 设计测试环境与配置矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节: `05-测试方案.md` §8 测试环境与配置矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 设计测试环境与配置矩阵 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 7 测试数据;`03` 配置 / 外部依赖章节;`04` profile / 配置项 / 加载校验 / 失效策略 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_08_environment_config.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

定义 P0 测试在哪些环境、依赖和配置下执行,并明确跨仓依赖的类型和协作方式。

本 Step 只回答:

- `local-dev` / `ci-test` / `integration-like` / `operations-replay` / `staging-like` / `production-like` 分别测什么。
- 每个环境依赖哪些 store、resolver、publisher、handoff、audit、redaction、fixture 和 replay 输入。
- 哪些依赖是编译期依赖、运行期依赖、事件协作依赖或 replay fixture。
- 哪些依赖需要 fake / controlled / disabled / event replay。
- 哪些配置项影响测试结果,以及无效配置如何 fail-fast / reject / degraded。
- 环境不可用时如何处理,避免伪造 P0 pass。

本 Step 不定义具体 shell 脚本、CI job 名称、artifact 路径、report 路径、正式 evidence ID、真实产品部署步骤、环境变量真实名称、CLI flag、配置文件路径或 production runbook。自动化脚本和 gate 由 Step 9 固定,证据归档由 Step 13 固定,部署运维由后续 `09-部署与运维手册.md` 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已审核通过 | 提供 P0 用例、自动化候选和 config / redaction / dependency 用例 |
| `05_test_plan_step_07_test_data.md` | 已审核通过 | 提供 DS-ID-* 数据集、fake / controlled / disabled 数据口径和清理规则 |
| `05_test_plan_step_04_strategy_layers.md` | 已审核通过 | 提供 fake / controlled integration、write-audit、release gate 边界 |
| `04-配置设计.md` §6 / §7 / §9 / §11 / §12 | 正式输入 | 提供 P0 profile、配置项、加载校验、失败策略和测试承接 |
| `04_config_step_06_environment_profiles_matrix.md` | 已审核通过 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 语义 |
| `04_config_step_07_config_items.md` | 已审核通过 | 提供 `profile/store/actor_context/role_catalog/bus/outbox/projection/operations/external_refs/audit/redline/fixture` 配置项 |
| `04_config_step_09_loading_validation_activation.md` | 已审核通过 | 提供 strict JSON、source priority、startup/job/entry/test activation 和 no hot/reload |
| `04_config_step_11_failure_degradation.md` | 已审核通过 | 提供 fail-fast、fail-closed、reject-run、reject-entry、degraded、delayed、failed marker 口径 |
| `01-架构设计.md` 依赖裁剪结论 | 正式输入 | 提供除 `L0-core` 外 sibling repo 不作为 compile dependency 的边界 |
| `L1-governance` Step 8 calibration | 参考输入 | 只参考矩阵粒度和环境拓扑组织,不复用 governance 业务对象 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local / CI / integration / staging 分别测什么? | `local-dev` 支撑本地手动 smoke、command/query/job 主链和调试;`ci-test` 支撑 deterministic P0 contract/domain/service/fake integration;`integration-like` 支撑跨入口、controlled adapter、degraded/unavailable、topic completeness、handoff failure mapping 和 no fake fallback;`operations-replay` 支撑 outbox publish、projection rebuild、reference refresh、reconciliation、handoff delivery/retry 和 stored replay。`staging-like` / `production-like` 只作为 P1/P2,当前不作为 P0 pass 前置。 |
| 每个环境依赖哪些服务? | P0 依赖 in-memory 或 controlled store、fake / controlled role source、work / governance / artifact / memory / archive refs、fake publisher、fake handoff、captured audit sink、redaction checker、deterministic clock/id、write-audit repository 和 replay fixtures。真实 DB、bus、archive/object storage、secret provider、observability backend、HR/IdP 或 sibling product service 不属于 P0 必须服务。 |
| 哪些 feature flag / config 影响测试结果? | `profile.name`、`profile.allow_test_override`、`store.mode`、`actor_context.*`、`role_catalog.*`、`bus.publisher_mode`、`bus.topic_map_ref`、`outbox.publish.*`、`projection.*`、`operations.*`、`external_refs.*`、`audit.*`、`redline.*`、`fixture.*` 均影响测试装配和断言。 |
| 哪些依赖需要 mock 或 fake? | P0 使用 fake / controlled / disabled:role/capability resolver、governance basis resolver、work source resolver、memory/archive resolver、artifact/evidence resolver、publisher、handoff adapter、audit sink、repositories/UoW、clock/id、write-audit repository、redaction artifact corpus。 |
| 环境不可用时如何处理? | `local-dev` / `ci-test` profile 无法装配则 fail-fast 或测试失败,不得降级为 pass。`integration-like` / `operations-replay` adapter unavailable 必须返回 formal rejected / degraded / delayed / failed marker 或 rejected job,不得 silent fallback。P1/P2 环境不可用时记录 residual/selected-run unavailable,不得计入 P0 pass。 |
| 哪些依赖是编译期依赖,可用 path dependency? | 只有 `L0-core` / core contracts 类上游可作为 compile-time dependency。governance、work、artifact、memory/archive、observability、external GRC、HR/IdP 和其他 sibling business repo 均不得作为 identity 的 compile dependency。 |
| 哪些依赖是运行期依赖或事件协作依赖? | role/capability source、governance basis、work source、artifact/evidence、memory/archive、publisher、handoff、audit sink、consumer/callback 输入和 replay artifacts 都是 runtime、event 或 replay 协作依赖,必须通过 refs、safe snapshot、event fixture、fake / controlled adapter 或 replay root 验证。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 | 数据集已定义,但尚未绑定到运行环境和 profile | 本 Step 将 DS-ID-* 映射到 profile、依赖和清理策略 |
| `04` §6 | profile 已定义,但测试方案需要说明执行用途、依赖类型和风险 | 本 Step 转成测试环境矩阵 |
| `04` §7 / §9 / §11 | 配置项、加载校验和失效策略已定义,但测试方案需要说明哪些配置影响测试 | 本 Step 转成配置项到测试切口矩阵 |
| 跨仓依赖 | 容易把 runtime / event seam 写成 path dependency | 本 Step 明确 compile / runtime / event / replay 依赖类型 |
| P1/P2 | `staging-like` / `production-like` 容易被误写成 P0 gate | 本 Step 固定其非 P0 地位 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有 profile 和数据集 | 增加环境用途、依赖服务、依赖类型、协作方式、配置和风险 | 测试执行可定位 |
| 跨仓依赖 | 只说不依赖 sibling truth | 明确 compile / runtime / event / replay 分类 | 防止 path dependency 越界 |
| `integration-like` | 只有 controlled seam 方向 | 明确测试 adapter unavailable/degraded、topic completeness、handoff failure 和 no fake fallback | 支撑 P0 接缝测试 |
| `operations-replay` | 只有 replay 方向 | 明确 outbox/projection/reference/report/handoff/idempotency replay | 支撑恢复用例 |
| 环境不可用 | 未说明 | fail-fast / rejected / selected-run unavailable / residual,不得伪 pass | 防止验收证据失真 |

## 7. 测试环境设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否要求真实 DB / bus | A. 要求真实产品;B. 使用 in-memory / fake / controlled | 采用 B。产品未锁定,真实产品进入 P1/P2 selected-run |
| sibling repo 是否作为 path dependency | A. 可以;B. 禁止,只允许 `L0-core` / core contracts | 采用 B。符合依赖裁剪和 VETO-ID-006 |
| `integration-like` 是否等于 production-like | A. 是;B. 否,只验证 controlled seam | 采用 B。P0 不承诺生产 endpoint 或生产 SLA |
| disabled adapter 是否可伪造 success | A. 可以;B. 不可以,必须返回 formal unavailable / rejected / disabled surface | 采用 B。对齐 `04` no fake fallback |
| 环境不可用是否可跳过并 pass | A. 可跳过;B. P0 fail-fast / P1 记录 unavailable | 采用 B。避免伪造证据 |

## 8. 结构化中间产物

### 8.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 本地开发、手动 smoke、调试 command/query/job 主链 | in-memory stores、fake role source、fake publisher、fake handoff、captured audit、optional deterministic clock/id | compile:`L0-core`;runtime:fake adapters | fake / in-memory / disabled | `profile.name=local-dev`;`store.mode=in-memory`;`role_catalog.source_mode=fake`;`bus.publisher_mode=fake`;`audit.sink_mode=local`;optional `fixture.*` | DS-ID-RUN-001 + happy-path DS;manual run namespace | 不作为正式 release evidence;只作快速反馈 |
| `ci-test` | deterministic P0 contract/domain/service/fake integration 自动化 | isolated in-memory stores、deterministic fake adapters、fixed clock/id、write-audit repository、redaction checker | compile:`L0-core`;runtime:fake infra;event:fixture envelopes | fake / fixture / generated metadata | `profile.name=ci-test`;strict JSON;`fixture.clock_mode=fixed`;`fixture.id_sequence_mode=deterministic`;topic map fixture;redline all true | 全部 DS-ID-* P0 datasets;run namespace drop;fake reset | P0 必过;任一装配失败不得 fallback |
| `integration-like` | 跨入口、controlled adapter、degraded/unavailable、topic completeness、handoff failure mapping、no fake fallback | in-memory or durable-like test store、controlled role/work/governance/memory/archive adapters、controlled publisher/handoff/audit | compile:`L0-core`;runtime:controlled adapters;event:controlled events | controlled / fake failure injection | `profile.name=integration-like`;controlled mode where enabled;endpoint refs as opaque refs only;topic map complete;test override false | DS-ID-ROLE/CAREER/MEMORY/HANDOFF/OUTBOX/PUBLISHER/CONFIG/FAULT | 不证明真实产品 SLA;只证明 seam semantics |
| `operations-replay` | outbox publish、projection rebuild、reference refresh、reconciliation、handoff delivery/retry、stored result/report replay | replay state store / fixtures、pending outbox、projection/reference/report/handoff/idempotency stores、fake or controlled adapters | runtime:replay fixture;event:replay artifacts | event replay / fake adapters / controlled failure | `profile.name=operations-replay`;`operations.run_id_required=true`;`operations.replay.*_ref`;job batch/page params;replay run clock/id | DS-ID-OUTBOX/PROJECTION/REFERENCE/REPORT/HANDOFF/IDEMP/FAULT | replay root 必须脱敏;不能含 raw body / raw secret |
| `staging-like` | P1 真实依赖 dry-run / pre-production selected-run | future durable store、real-like bus/resolver/handoff/secret refs | runtime:future real-like;event:future real event | real-like / dry-run / selected-run | future profile only;secret provider refs;no raw secret;no test fixture override | future run-scoped durable data | P1/P2,不可作为当前 P0 pass 前置 |
| `production-like` | P1/P2 生产运行和运维语境 | future approved DB/bus/resolver/handoff/audit/secret provider | runtime:future production | approved real products | future production config;no fake/test fixture | future production-safe data strategy | 当前不执行;不能伪造 production evidence |

#### 环境拓扑图: L1-identity P0 测试依赖

```text
                         [L0-core / core-contracts]
                                   ^
                                   | [compile]
                                   |
[api / worker / jobs entry] -> [identity application services]
        | [runtime]                       | [runtime]
        v                                 v
[runtime builder + config]        [in-memory repositories / UoW]
        | [runtime]                       |
        v                                 v
[fake / controlled adapters]      [projection / reference / outbox / report stores]
        | [event/runtime/replay]          |
        v                                 v
[event fixtures / replay roots]   [redaction + dependency checks]

Sibling / external systems:
  governance / work / artifact / memory-archive / observability / HR-IdP / external products
  -> [runtime/event/replay only through refs, safe snapshots, events, adapters]
  -> no [compile] dependency except L0-core / core contracts
```

关键说明:

- `L0-core` / core contracts 是唯一允许的 compile-time upstream。
- Sibling business repos 在 P0 中只通过 refs、safe snapshots、events、adapters 或 replay fixtures 协作。
- P0 不要求真实 DB、bus、archive/object storage、secret provider、observability 或 HR/IdP 产品。
- Redaction 和 dependency checks 是后续 release evidence 的输入,但具体脚本由 Step 9 固定。

### 8.2 测试依赖类型与协作方式判定表

| 依赖对象 | 依赖类型 | 是否允许 path dependency | P0 协作方式 | 覆盖用例 / 数据 | 风险 |
|---|---|---|---|---|---|
| `L0-core` / core contracts | compile | 是 | package/path dependency or published contract dependency | 全部 TC;DS-ID-PROTOCOL-* | 版本漂移需 lock / digest |
| governance basis | runtime | 否 | `GovernanceBasisRef`、safe basis summary、controlled resolver | TC-ID-CMD-003~004;DS-ID-LIFECYCLE-* | 真实 governance 状态机差异留 P1 |
| role/capability source | runtime / event | 否 | safe role/capability snapshot、source changed event fixture | TC-ID-CMD-005~006;TC-ID-CONSUMER-001;DS-ID-ROLE-* | RoleDefinition / CapabilityDefinition body 不在 P0 |
| work source | runtime / event | 否 | work participation ref、event fixture、duplicate source marker | TC-ID-CMD-007~008;TC-ID-CONSUMER-002;DS-ID-CAREER-* | ProjectMember body 不在 P0 |
| artifact/evidence source | runtime | 否 | evidence refs only、disabled/fake/controlled resolver | TC-ID-CONFIG-003;TC-ID-REDACTION-*;DS-ID-REFERENCE-* | evidence body/product adapter P1 |
| memory/archive source | runtime / event / replay | 否 | memory refs、archive/handoff callback fixture、body-free state | TC-ID-CMD-009~012;TC-ID-CONSUMER-003~004;DS-ID-MEMORY/HANDOFF-* | memory text / archive package forbidden |
| message bus / topic map | runtime / event | 否 for P0 | fake publisher、topic map fixture、event replay | TC-ID-OUTBOX-*;DS-ID-OUTBOX/PUBLISHER-* | real routing P1 |
| handoff target | runtime | 否 for P0 | fake / controlled handoff adapter and receipt markers | TC-ID-JOB-004~005;TC-ID-IDEMP-010;DS-ID-HANDOFF-* | real target delivery P1 |
| DB / durable store | runtime | 否 for P0 | in-memory store;future durable-like selected-run only | repository/fault/idempotency cases;DS-ID-RUN/FAULT-* | real isolation/perf P1/P2 |
| audit / observability sink | runtime | 否 for P0 | captured sink / local marker / redacted diagnostics | TC-ID-REDACTION-*;DS-ID-REDACTION-* | physical log backend P1 |
| redaction checker | local tool / runtime artifact | 不适用 | scanner fixture and artifact corpus | TC-ID-REDACTION-*;DS-ID-REDACTION-* | script path Step 9 |
| dependency metadata check | local tool | 不适用 | generated package graph / manifest scan | TC-ID-ARCH-001;DS-ID-ARCH-001 | tool path Step 9 |

### 8.3 Profile 配置矩阵

| Profile | Store config | Resolver / consumer | Publisher / topic | Jobs / replay | Handoff / archive | Redaction / diagnostics | Clock / id |
|---|---|---|---|---|---|---|---|
| `local-dev` | `store.mode=in-memory`;logical stores local | `role_catalog.source_mode=fake`;external refs mostly disabled/fake | `bus.publisher_mode=fake`;local topic map ref | jobs enabled manually;small page/batch defaults | fake handoff;memory/archive disabled/fake | local/captured audit;redaction profile identity-safe | deterministic or local system |
| `ci-test` | isolated in-memory per run | deterministic fake resolver;event fixtures;write-audit installed | fake publisher with asserted topic map | all P0 jobs enabled with fixed page/batch | fake handoff with injected failure cases | redaction scan required;redline all true | fixed deterministic |
| `integration-like` | in-memory or durable-like test store through ports | controlled resolver/consumer;unavailable/degraded injection | controlled publisher/bus seam;topic completeness required | runner enabled;failure mapping cases | controlled handoff target;memory/archive controlled where tested | redaction required;diagnostic refs only | deterministic or controlled runtime |
| `operations-replay` | replay fixture store | replay snapshot/reference states | pending outbox replay;fake publisher | publish/rebuild/refresh/reconcile/handoff/retry replay | replay handoff targets | replay artifacts must be de-identified | replay run clock/id |
| `staging-like` | future durable store refs | future real-like resolver/consumer | future real-like bus/topic | future selected-run jobs | future handoff/archive dry-run | secret provider refs;redaction required | runtime clock/id |
| `production-like` | future production store refs | future approved adapters | future production topic map | future operations jobs | future approved targets | secret provider only;no raw secret | production provider |

### 8.4 配置项到测试切口矩阵

| 配置 / feature | 影响测试 | 覆盖用例 | 数据集 | 失败策略 |
|---|---|---|---|---|
| `profile.name` | profile matrix and entry selection | TC-ID-CONFIG-001 | DS-ID-CONFIG-001 | unknown profile fail-fast |
| `profile.allow_test_override` | fixture/deterministic override isolation | TC-ID-CONFIG-002~003 | DS-ID-CONFIG-NEG-001 | non-test override fail-closed |
| `store.mode` / `store.dsn_ref` | repository and UoW backing | TC-ID-CMD-015;TC-ID-IDEMP-* | DS-ID-FAULT-001;DS-ID-RUN-001 | missing/unsupported fail-fast |
| `actor_context.*` | required actor/trace/idempotency metadata | TC-ID-CONTRACT-002;TC-ID-IDEMP-001 | DS-ID-ACTOR-001;DS-ID-PROTOCOL-NEG-001 | reject current entry |
| `role_catalog.*` | role source resolution, fixture compatibility and source fingerprint | TC-ID-CMD-005~006;TC-ID-CONSUMER-001 | DS-ID-ROLE-*;DS-ID-REFERENCE-001 | missing required ref fail-fast;runtime unavailable rejected/degraded |
| `bus.publisher_mode` / `bus.topic_map_ref` | outbound event publication and topic completeness | TC-ID-OUTBOX-*;TC-ID-CONFIG-004 | DS-ID-OUTBOX-001;DS-ID-PUBLISHER-001 | missing topic fail-fast;publish fail marker |
| `outbox.publish.*` | publish job scan, retry and failure behavior | TC-ID-OUTBOX-009~010;TC-ID-JOB-005 | DS-ID-OUTBOX-001;DS-ID-PUBLISHER-001 | invalid job input rejected |
| `projection.*` | query not-ready and rebuild behavior | TC-ID-QUERY-003~015;TC-ID-JOB-001;TC-ID-IDEMP-008 | DS-ID-PROJECTION-001 | invalid config fail-fast;not-ready no-write |
| `operations.*` | job run identity, replay roots and retry enablement | TC-ID-JOB-*;TC-ID-IDEMP-004 | DS-ID-REPORT/OUTBOX/REFERENCE/HANDOFF/IDEMP-* | missing run/replay refs rejected |
| `external_refs.*` | governance basis、work source、memory/archive、artifact/evidence and handoff target availability | TC-ID-CMD-004;TC-ID-CONSUMER-*;TC-ID-JOB-004;TC-ID-CONFIG-003 | DS-ID-LIFECYCLE/CAREER/MEMORY/HANDOFF/REFERENCE-* | explicit disabled no fake success;enabled missing ref fail-fast/reject |
| `audit.*` | audit/trace sink, compensation and redaction profile | TC-ID-REDACTION-001~003;TC-ID-CONFIG-002 | DS-ID-REDACTION-* | unsafe profile or disabled compensation fail-fast |
| `redline.*` | no auth in identity, ref-only, query no-write, stored replay guard | TC-ID-CONFIG-002;TC-ID-ARCH-001;TC-ID-REDACTION-* | DS-ID-CONFIG-NEG-001;DS-ID-ARCH-001 | any false fail-fast |
| `fixture.*` | fixed clock, deterministic id and fixture seed | 全部 deterministic TC | DS-ID-RUN-001;DS-ID-CONFIG-001 | missing/incompatible test fail-fast |

### 8.5 环境到数据集矩阵

| 环境 | 数据集 | 使用方式 | 清理 / 隔离 |
|---|---|---|---|
| `local-dev` | DS-ID-RUN-001;DS-ID-MEMBER-001;DS-ID-LIFECYCLE-001;DS-ID-ROLE-001;DS-ID-PROJECTION-001 | manual command/query/job sanity | run namespace reset |
| `ci-test` | all DS-ID-* P0 datasets | deterministic automated suites | run namespace drop;fake reset;isolated leak fixture delete |
| `integration-like` | DS-ID-ROLE-*;DS-ID-CAREER-*;DS-ID-MEMORY-*;DS-ID-HANDOFF-*;DS-ID-OUTBOX-001;DS-ID-PUBLISHER-001;DS-ID-CONFIG-*;DS-ID-FAULT-001 | controlled adapter and failure mapping | adapter reset;run namespace drop |
| `operations-replay` | DS-ID-OUTBOX-001;DS-ID-PROJECTION-001;DS-ID-REFERENCE-001;DS-ID-REPORT-001;DS-ID-HANDOFF-001;DS-ID-IDEMP-001;DS-ID-FAULT-001 | replay publish/rebuild/refresh/reconcile/handoff/retry | replay run namespace cleanup |
| `staging-like` | future durable selected-run datasets | P1 selected-run only | future run-scoped cleanup |
| `production-like` | future production-safe datasets | P1/P2 operations validation | future runbook |

### 8.6 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | P0 处理 | 是否可记 pass |
|---|---|---|---|
| `local-dev` config invalid | runtime builder failed | local run fails;developer fixes config | 否 |
| `ci-test` invalid config / missing fake adapter | runtime builder failed | CI fail-fast | 否 |
| `ci-test` fake store unavailable due test harness bug | suite failed | treat as test infra defect,not pass | 否 |
| `integration-like` controlled resolver unavailable | command/query/consumer returns rejected/degraded/delayed by scenario | scenario asserts marker;unexpected unavailable fails | 仅预期场景可通过 |
| `integration-like` topic map missing | runtime build fails | fail-fast;no publisher facade | 否 |
| `operations-replay` replay root missing or not de-identified | job rejected / profile validation fail | fail suite | 否 |
| optional external resolver disabled | dependent operation returns formal disabled/unavailable/rejected/degraded surface | pass only if boundary asserted | 是,限边界用例 |
| `staging-like` unavailable | selected-run unavailable | record P1 residual/unavailable | 不计 P0 pass |
| `production-like` unavailable | not in current scope | record future risk | 不计 P0 pass |

### 8.7 环境 / 配置停审记录

| 环境 / 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | 是否支持本地主链且不作为正式验收 | 通过 | 无 |
| `ci-test` | 是否覆盖 deterministic P0 自动化 | 通过 | suite 名称留 Step 9 |
| `integration-like` | 是否覆盖 controlled adapter / degraded / failure mapping | 通过 | 不证明真实产品 |
| `operations-replay` | 是否覆盖 job/replay/recovery 数据 | 通过 | replay artifact path 留 Step 9/13 |
| `staging-like` / `production-like` | 是否未被写成 P0 pass 前置 | 通过 | 进入 Step 14 残余风险 |
| compile dependency | 是否只允许 `L0-core` / core contracts | 通过 | 检查脚本留 Step 9 |
| runtime/event dependencies | 是否明确 fake / controlled / disabled / replay | 通过 | 无 |
| config matrix | 是否承接 `04` P0 profile and gates | 通过 | config file path / env key / CLI selector 留 Step 9 或后续配置闭口 |
| environment unavailable handling | 是否禁止伪 pass | 通过 | P1 unavailable 只记录 residual |

### 8.8 跨环境 / 配置审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 自动化和人工测试环境是否可定位 | 通过 | local-dev / ci-test / integration-like / operations-replay 均已定义 |
| 是否区分 compile/runtime/event/replay 依赖 | 通过 | 见 §8.2 |
| 是否存在 sibling path dependency 越界 | 通过 | 除 `L0-core` / core contracts 外均禁止 compile dependency |
| 是否把真实 DB/bus/archive/secret provider 写成 P0 前置 | 通过 | 真实产品均 P1/P2 |
| 是否把 staging/production unavailable 伪装 pass | 通过 | P1/P2 unavailable 只记录 residual |
| 配置是否可定位到 profile / config domain | 通过 | 见 §8.3 / §8.4 |
| 数据集是否映射到环境 | 通过 | 见 §8.5 |
| 环境不可用处理是否明确 | 通过 | 见 §8.6 |
| 是否提前定义 CI scripts/artifact/report/evidence | 通过 | 留 Step 9 / Step 13 |

## 9. 对上游设计的影响判定

| 环境 / 配置结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 环境使用 `local-dev` / `ci-test` / `integration-like` / `operations-replay` | 否 | 承接 `04` profile | 无需回写 |
| `staging-like` / `production-like` 不作为 P0 pass | 否 | 范围边界 | Step 14 记录风险 |
| only `L0-core` / core contracts compile dependency | 否 | 承接架构依赖裁剪 | Step 9 固定检查方式 |
| P0 使用 fake / controlled / disabled / replay | 否 | 产品中立 | 无需回写 |
| config file path / env key / CLI selector 未固定 | 否 | 当前 Step 分工 | 若 Step 9 需要未定义入口 schema,回写 `04` 或记录 blocker |
| 若 Step 9 发现某 TC 无可执行环境或门禁产面 | 是 | 测试执行闭环缺口 | 回写 Step 9 / Step 13 或记录风险 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“环境矩阵”“环境拓扑图”“测试依赖类型与协作方式判定表”“Profile 配置矩阵”“配置项到测试切口矩阵”和“跨环境 / 配置审计表”小节,了解 P0 测试在哪些环境、依赖和配置下执行。

正式 `05-测试方案.md` §8 应回填:

- P0 测试环境包括 `local-dev`、`ci-test`、`integration-like` 和 `operations-replay`。
- `staging-like` 和 `production-like` 属于 P1/P2 selected-run 或 future operations,不作为当前 P0 pass 前置。
- 只有 `L0-core` / core contracts 可作为 compile-time upstream;sibling business repos 只通过 runtime/event/replay seam 协作。
- P0 不要求真实 DB、bus、archive/object storage、secret provider、observability backend 或 HR/IdP 产品。
- 配置矩阵必须覆盖 profile、store、actor_context、role_catalog、bus、outbox、projection、operations、external_refs、audit、redline 和 fixture。
- P0 环境不可用或配置非法不得 silent fallback 或伪造 pass。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| CI suite / gate 脚本名称 | 影响自动化执行 | Step 9 固定 |
| artifact-root / report-root 路径 | 影响证据归档 | Step 9 / Step 13 固定 |
| config file path / env key / CLI selector | 影响 entry local args and jobs input | 若 `04`/后续运维未定义,Step 9 记录 blocker 或回写 |
| dependency check 实现方式 | 影响 VETO-ID-006 | Step 9 固定 |
| P1 staging-like selected-run 是否进入后续 release | 影响残余风险 | Step 14 记录 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 自动化和人工测试环境均可定位 | 通过 | local-dev / ci-test / integration-like / operations-replay |
| 跨仓依赖类型和协作方式已明确 | 通过 | compile/runtime/event/replay 已区分 |
| 配置矩阵覆盖 P0 profile 和 config gates | 通过 | 见 §8.3 / §8.4 |
| 环境不可用处理已明确 | 通过 | 见 §8.6 |
| 跨环境审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 9 | 待用户确认 | 用户审核通过后进入 Step 9: 设计自动化与 CI/CD 门禁 |
