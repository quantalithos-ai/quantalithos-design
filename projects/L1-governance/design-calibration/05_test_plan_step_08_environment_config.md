# Step 8. 设计测试环境与配置矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节: `05-测试方案.md` §8 测试环境与配置矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 设计测试环境与配置矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 7 测试数据;`03` 配置 / 外部依赖章节;`04` profile / 配置项 / 失效策略 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_08_environment_config.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

定义 P0 测试在哪些环境、依赖和配置下执行,并明确跨仓依赖的类型和协作方式。

本 Step 只回答:

- local / CI / integration-like / operations-replay / staging-like / production-like 分别测什么。
- 每个环境依赖哪些服务、store、adapter、topic、handoff、redaction 和 runtime profile。
- 哪些依赖是编译期依赖、运行期依赖或事件协作依赖。
- 哪些依赖需要 fake / controlled / disabled / event replay。
- 哪些配置影响测试结果,以及无效配置如何 fail-fast / reject / degraded。
- 环境不可用时如何处理,避免伪造 pass。

本 Step 不定义具体 shell 脚本、CI job 名称、artifact 路径、报告模板、正式 evidence ID、真实产品部署步骤或 production runbook。自动化脚本和 gate 由 Step 9 固定,证据归档由 Step 13 固定,生产部署运维由后续 `09-部署与运维手册.md` 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 P0 用例和自动化候选 |
| `05_test_plan_step_07_test_data.md` | 已完成 | 提供数据集、fake / controlled / disabled 数据口径 |
| `03_ddd_step_14_config_external_binding.md` | 正式输入 | 提供 runtime config、adapter availability、topic、dependency boundary 和 external binding |
| `04-配置设计.md` §6 / §7 / §9 / §11 / §12 | 正式输入 | 提供 P0 profile、config item、validation、failure strategy 和测试承接 |
| `01-架构设计.md` 依赖裁剪结论 | 正式输入 | 提供除 `L0-core` 外 sibling repo 不作为 compile dependency 的边界 |
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 提供 P0 fake / controlled integration 和 release gate 边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local / CI / integration / staging 分别测什么? | `local-dev` 支撑本地手动主链和调试;`ci-test` 支撑 deterministic P0 contract/domain/service/fake integration;`integration-like` 支撑跨入口、controlled adapter、degraded/unavailable 和 topic/handoff/export failure mapping;`operations-replay` 支撑 outbox/projection/reference/reconciliation/handoff/export/idempotency replay。`staging-like` / `production-like` 只作为 P1/P2,当前不作为 P0 pass 前置。 |
| 每个环境依赖哪些服务? | P0 依赖 in-memory/fake stores、fake/controlled resolver、fake publisher、fake handoff/archive/export、external GRC disabled/fake、deterministic clock/id、redaction checker 和 dependency metadata。真实 DB/bus/search/object storage/secret provider/external GRC 不属于 P0 必须服务。 |
| 哪些 feature flag / config 影响测试结果? | `runtime.profile`、`runtime.adapterMode`、`runtime.strictValidation`、store kinds、resolver/publisher/handoff/external GRC adapter refs、consumer enablement、topic map、jobs enablement/batch params、redaction deny list、metric label policy、clock/id refs 和 test fixture/replay roots。 |
| 哪些依赖需要 mock 或 fake? | P0 使用 fake 或 controlled:source resolver、publisher、handoff/archive/export、external GRC、repositories/UoW、clock/id、write-audit repository、redaction artifact corpus。API/worker/job entry 只通过 application ports 和 fake infra 验证。 |
| 环境不可用时如何处理? | P0 local/CI profile 无法装配则 fail-fast,不得降级为 pass。integration-like / operations-replay adapter unavailable 必须返回 degraded/delayed/failed marker 或 rejected job,不得 silent fallback。P1/P2 环境不可用时记录 residual/selected-run unavailable,不得伪装 P0 通过。 |
| 哪些依赖是编译期依赖,可用 path dependency? | 只有 `L0-core` / `core-contracts` 是允许的 compile-time upstream。process/work/artifact/identity/method/runtime/conversation/observability/archive/external GRC 均不得作为 sibling package dependency。 |
| 哪些依赖是运行期依赖或事件协作依赖? | source resolver、publisher、handoff/archive/export、external GRC、consumer input 和 replay artifacts 都是 runtime 或 event/replay 协作依赖,必须通过 fake / controlled / disabled / event replay / projection fixture 验证。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 | 数据集已经定义,但没有绑定到运行环境 | 本 Step 将数据集映射到 profile 和依赖服务 |
| `04` §6 | profile 已定义,但测试方案需要说明执行环境和风险 | 本 Step 转成环境矩阵 |
| `04` §12 | 配置测试主题已有,但没有测试环境承接 | 本 Step 转成配置矩阵 |
| 跨仓依赖 | 容易把 runtime/event seam 写成 path dependency | 本 Step 明确 compile/runtime/event/replay 依赖类型 |
| P1/P2 | staging-like / production-like 容易被误写成 P0 gate | 本 Step 固定其非 P0 地位 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有 profile 描述 | 增加环境用途、依赖类型、协作方式和风险 | 测试执行可定位 |
| 跨仓依赖 | 只说不依赖 sibling truth | 明确 compile/runtime/event/replay 分类 | 防止 path dependency 越界 |
| integration-like | 只有 controlled seam 方向 | 明确测试 adapter unavailable/degraded/failure mapping | 支撑 P0 接缝测试 |
| operations-replay | 只有 replay 方向 | 明确 outbox/projection/reference/report/handoff/idempotency replay | 支撑恢复用例 |
| 环境不可用 | 未说明 | fail-fast / selected-run unavailable / residual,不得伪 pass | 防止验收证据失真 |

## 7. 测试环境设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否要求真实 DB / bus | A. 要求真实产品;B. 使用 in-memory / fake / controlled | 采用 B。产品未锁定,真实产品进入 P1/P2 |
| sibling repo 是否作为 path dependency | A. 可以;B. 禁止,只允许 `L0-core` | 采用 B。符合依赖裁剪和 VF-GOV-010 |
| integration-like 是否等于 production-like | A. 是;B. 否,只验证 controlled seam | 采用 B。P0 不承诺生产 endpoint |
| external GRC disabled 是否阻断 core command | A. 阻断;B. 不阻断,只影响 export job | 采用 B。external GRC 不定义 Governance truth |
| 环境不可用是否可跳过并 pass | A. 可跳过;B. P0 fail-fast / P1 记录 unavailable | 采用 B。避免伪证据 |

## 8. 结构化中间产物

### 8.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 本地开发、手动验证 command/query/job 主链和调试 | in-memory stores、fake resolver、fake publisher、fake handoff、external GRC disabled、local/deterministic clock/id | compile:`L0-core`;runtime:fake adapters | fake / in-memory / disabled | `runtime.profile=local-dev`;`runtime.adapterMode=fake`;in-memory store refs;redaction deny list | DS-GOV-RUN + happy-path DS;manual run namespace | 不作为正式 release evidence;只作快速反馈 |
| `ci-test` | deterministic contract/domain/service/fake integration 自动化 | in-memory isolated stores、deterministic fake adapters、fixed clock/id、write-audit repo、redaction checker | compile:`L0-core`;runtime:fake infra;event:fixture envelopes | fake / fixture / generated metadata | `runtime.profile=ci-test`;strict validation;fixed clock/id;fake topic map | 全部 DS-GOV-* P0 datasets;run namespace drop | P0 必过;任一装配失败不得 fallback |
| `integration-like` | 跨入口、adapter unavailable/degraded、topic completeness、handoff/export failure mapping | in-memory or durable-like test store;controlled resolver/publisher/handoff/export;external GRC disabled by default | compile:`L0-core`;runtime:controlled adapters;event:controlled events | controlled / fake failure injection | `runtime.profile=integration-like`;adapterMode controlled;topic map complete;external GRC disabled/fake | DS-GOV-EXTREF/OUTBOX/HANDOFF/CONFIG/FAULT | 不证明真实产品 SLA;只证明 seam semantics |
| `operations-replay` | outbox publish、projection rebuild、reference refresh、reconciliation、handoff/export、idempotency replay | replay state store / fixtures、pending outbox、projection/reference/report/handoff markers、fake publisher/handoff | runtime:replay fixture;event:replay artifacts | event replay / fake adapters / controlled failure | `runtime.profile=operations-replay`;replay root ref;job metadata;batch/page params | DS-GOV-OUTBOX/PROJECTION/REFERENCE/REPORT/HANDOFF/IDEMP | replay root 必须脱敏;不能含 raw body |
| `staging-like` | P1 真实依赖 dry-run / pre-production selected-run | future durable store、real-like bus/resolver/handoff/secret refs | runtime:future real-like;event:future real event | real-like / dry-run / selected-run | future profile only;secret provider refs;no raw secret | future run-scoped durable data | P1/P2,不可作为当前 P0 pass 前置 |
| `production-like` | P1/P2 生产运行和运维语境 | future approved DB/bus/resolver/handoff/external GRC/secret provider | runtime:future production | approved real products | future production config;no fake/test fixture | future production-safe data strategy | 当前不执行;不能伪造 production evidence |

#### 环境拓扑图: L1-governance P0 测试依赖

```text
                         [L0-core / core-contracts]
                                   ^
                                   | [compile]
                                   |
[api / worker / jobs entry] -> [governance application services]
        | [runtime]                       | [runtime]
        v                                 v
[runtime builder + config]        [in-memory repositories / UoW]
        | [runtime]                       |
        v                                 v
[fake / controlled adapters]      [projection / reference / outbox / report stores]
        | [event/runtime]                 |
        v                                 v
[event fixtures / replay roots]   [redaction + dependency checks]

External sibling projects and external GRC:
  process / work / artifact / identity / method / runtime / conversation / observability / archive / GRC
  -> [runtime/event/replay only through refs, safe snapshots, events, adapters]
  -> no [compile] dependency except L0-core
```

关键说明:

- `L0-core` / `core-contracts` 是唯一允许的 compile-time upstream。
- Sibling repos 在 P0 中只通过 refs、safe snapshots、events、adapters 或 replay fixtures 协作。
- P0 不要求真实 DB / bus / search / external GRC 产品。
- Redaction 和 dependency checks 是 release evidence 的输入,但具体脚本由 Step 9 固定。

### 8.2 测试依赖类型与协作方式判定表

| 依赖对象 | 依赖类型 | 是否允许 path dependency | P0 协作方式 | 覆盖用例 / 数据 | 风险 |
|---|---|---|---|---|---|
| `L0-core` / `core-contracts` | compile | 是 | package/path dependency or published contract dependency | all TC;DS-GOV-PROTOCOL-* | 版本漂移需 lock / digest |
| process | runtime / event | 否 | process governance context ref、safe snapshot、event fixture | TC-GOV-CONSUMER-002;DS-GOV-EXTREF-* | 真实 process 状态机差异留 P1 |
| work | runtime / event | 否 | work governance context ref、safe snapshot、event fixture | TC-GOV-CONSUMER-003;DS-GOV-EXTREF-* | 真实 work lifecycle 差异留 P1 |
| artifact / evidence / archive | runtime / event / replay | 否 | artifact/evidence refs、archive target refs、body-free fixtures | TC-GOV-CMD-016~018;TC-GOV-JOB-006;DS-GOV-COMPLIANCE-* | package/body validation 不在 P0 |
| identity | runtime / event | 否 | actor capability summary fake、identity event fixture | TC-GOV-CMD-007~009;TC-GOV-CONSUMER-001 | 真实 auth backend 不在 P0 |
| method-library | runtime / event | 否 | method policy/control snapshot fake | TC-GOV-CMD-010/014;TC-GOV-CONSUMER-005~006 | DSL/body 不在 P0 |
| runtime / capability hub | runtime / event | 否 | runtime signal ref / capability summary fixture | TC-GOV-CMD-019;TC-GOV-CONSUMER-007 | tool execution body 不在 P0 |
| conversation / workspace / console | runtime / event | 否 | conversation context ref / display boundary fixture | TC-GOV-CONSUMER-008 | UI rendering 不在 P0 |
| observability | runtime / event | 否 | alert summary ref、safe diagnostic refs、redaction artifact fixture | TC-GOV-CONSUMER-009;TC-GOV-REDACTION-* | physical log backend 不在 P0 |
| external GRC | runtime | 否 | disabled by default;controlled fake for export boundary | TC-GOV-JOB-007;TC-GOV-CONFIG-007 | vendor schema/credentials P1/P2 |
| DB / durable store | runtime | 否 for P0 | in-memory store;future durable-like selected-run only | all repository tests;DS-GOV-* | real isolation/perf P1/P2 |
| message bus / DLQ | runtime / event | 否 for P0 | fake publisher/topic map;event fixtures | TC-GOV-OUTBOX-*;TC-GOV-CONSUMER-* | real routing P1 |
| redaction checker | local tool / runtime artifact | 不适用 | scanner fixture and artifact corpus | TC-GOV-REDACTION-*;DS-GOV-REDACTION-* | script path Step 9 |
| dependency metadata check | local tool | 不适用 | generated package graph / manifest scan | TC-GOV-ARCH-001;DS-GOV-ARCH-001 | tool path Step 9 |

### 8.3 Profile 配置矩阵

| Profile | Store config | Resolver / consumer | Publisher / topic | Jobs / replay | Handoff / export | Redaction / diagnostics | Clock / id |
|---|---|---|---|---|---|---|---|
| `local-dev` | in-memory truth/projection/reference/outbox/report | fake resolver;consumers optional local | fake publisher;local topic map | jobs enabled manually;small page defaults | fake handoff;external GRC disabled | deny list non-empty;safe diagnostics local | deterministic or local system |
| `ci-test` | isolated in-memory per run | deterministic fake resolver;event fixtures | fake publisher with asserted topic map | all P0 jobs enabled with fixed page/batch | fake handoff/export with fault profiles;external GRC disabled/fake only by case | redaction scan required;high-cardinality false | fixed clock/id |
| `integration-like` | in-memory or durable-like test store through ports | controlled resolver/consumer;unavailable/degraded injection | controlled publisher/bus seam;topic completeness required | runner enabled;failure mapping cases | controlled handoff/export target;external GRC disabled default | redaction required;diagnostic refs only | deterministic or controlled runtime |
| `operations-replay` | replay fixture store | replay snapshot/reference states | pending outbox replay;fake publisher | publish/rebuild/refresh/reconcile/handoff/export replay | replay handoff targets;external GRC fake/disabled | replay artifacts must be de-identified | replay run clock/id |
| `staging-like` | future durable store refs | future real-like resolver/consumer | future real-like bus/topic | future selected-run jobs | future handoff/export dry-run | secret provider refs;redaction required | runtime clock/id |
| `production-like` | future production store refs | future approved adapters | future production topic map | future operations jobs | future approved targets | secret provider only;no raw secret | production provider |

### 8.4 配置项到测试切口矩阵

| 配置 / feature | 影响测试 | 覆盖用例 | 数据集 | 失败策略 |
|---|---|---|---|---|
| `runtime.profile` | profile matrix and entry selection | TC-GOV-CONFIG-001/005 | DS-GOV-CONFIG-001/NEG-001 | unknown profile fail-fast |
| `runtime.adapterMode` | fake / controlled / future real-like mode | TC-GOV-CONFIG-001/005 | DS-GOV-CONFIG-* | incompatible mode fail-fast |
| `runtime.strictValidation` | strict JSON/type/cross-field validation | TC-GOV-CONFIG-002 | DS-GOV-CONFIG-NEG-001 | false or invalid P0 fail-fast |
| `stores.*.kind` / `stores.*.configRef` | repository and UoW test backing | TC-GOV-CMD-027~029;TC-GOV-IDEMP-* | DS-GOV-FAULT-001;DS-GOV-RUN-001 | missing/unsupported fail-fast |
| resolver adapter refs | external safe snapshot / degraded behavior | TC-GOV-CONSUMER-*;TC-GOV-JOB-003 | DS-GOV-EXTREF-*;DS-GOV-REFERENCE-001 | unavailable -> delayed/degraded/partial |
| inbound consumer enablement / schema allowlist | consumer accepted/unsupported behavior | TC-GOV-CONSUMER-001~012 | DS-GOV-PROTOCOL-* | unsupported -> `UnsupportedVersion` |
| outbox publisher refs / topic map | outbound event publish and topic completeness | TC-GOV-OUTBOX-*;TC-GOV-CONFIG-004 | DS-GOV-OUTBOX-001;DS-GOV-PUBLISHER-001 | missing topic fail-fast;publish fail marker |
| jobs enabled / batch/page params | operations job runner behavior | TC-GOV-JOB-* | DS-GOV-REPORT/OUTBOX/REFERENCE/HANDOFF | invalid job input rejected |
| handoff/archive/export target refs | handoff/export marker behavior | TC-GOV-JOB-005~007;TC-GOV-IDEMP-011~012 | DS-GOV-HANDOFF-001;DS-GOV-PUBLISHER-001 | disabled target rejected/failed marker |
| external GRC enabled/target refs | external export boundary | TC-GOV-JOB-007;TC-GOV-CONFIG-007 | DS-GOV-CONFIG-* | disabled does not block core truth;enabled missing fail-fast/reject |
| redaction deny list / metric label policy | no-output and low-cardinality checks | TC-GOV-REDACTION-* | DS-GOV-REDACTION-* | unsafe config fail-fast;scan failure blocks |
| clock/id refs | deterministic time/id | all state and trace tests | DS-GOV-RUN-001 | missing/incompatible fail-fast |
| replay root ref | operations-replay dataset source | TC-GOV-JOB-*;TC-GOV-IDEMP-* | DS-GOV-OUTBOX/REFERENCE/REPORT/HANDOFF | missing or non-deidentified rejected |

### 8.5 环境到数据集矩阵

| 环境 | 数据集 | 使用方式 | 清理 / 隔离 |
|---|---|---|---|
| `local-dev` | DS-GOV-RUN-001;core happy datasets | manual command/query/job sanity | run namespace reset |
| `ci-test` | all DS-GOV-* P0 datasets | deterministic automated suites | run namespace drop;fake reset |
| `integration-like` | DS-GOV-EXTREF-*;DS-GOV-OUTBOX-001;DS-GOV-PUBLISHER-001;DS-GOV-HANDOFF-001;DS-GOV-CONFIG-* | controlled adapter and failure mapping | adapter reset;run namespace drop |
| `operations-replay` | DS-GOV-OUTBOX-001;DS-GOV-PROJECTION-001;DS-GOV-REFERENCE-001;DS-GOV-REPORT-001;DS-GOV-HANDOFF-001;DS-GOV-IDEMP-001 | replay publish/rebuild/refresh/reconcile/handoff/export | replay run namespace cleanup |
| `staging-like` | future durable selected-run datasets | P1 selected-run only | future run-scoped cleanup |
| `production-like` | future production-safe datasets | P1/P2 operations validation | future runbook |

### 8.6 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | P0 处理 | 是否可记 pass |
|---|---|---|---|
| `local-dev` config invalid | runtime builder failed | local run fails;developer fixes config | 否 |
| `ci-test` invalid config / missing fake adapter | runtime builder failed | CI fail-fast | 否 |
| `ci-test` fake store unavailable due test harness bug | suite failed | treat as test infra defect,not pass | 否 |
| `integration-like` controlled resolver unavailable | command/query/consumer returns degraded/delayed/partial by scenario | scenario asserts marker;unexpected unavailable fails | 仅预期场景可通过 |
| `integration-like` topic map missing | runtime build fails | fail-fast;no publisher facade | 否 |
| `operations-replay` replay root missing or not de-identified | job rejected / profile validation fail | fail suite | 否 |
| external GRC disabled | export job disabled/rejected marker;core commands still pass | pass only if boundary asserted | 是,限边界用例 |
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
| compile dependency | 是否只允许 `L0-core` | 通过 | 检查脚本留 Step 9 |
| runtime/event dependencies | 是否明确 fake / controlled / disabled / replay | 通过 | 无 |
| config matrix | 是否承接 `04` P0 profile and gates | 通过 | env key / file path 留 Step 9/09 |
| environment unavailable handling | 是否禁止伪 pass | 通过 | P1 unavailable 只记录 residual |

### 8.8 跨环境 / 配置审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 自动化和人工测试环境是否可定位 | 通过 | local-dev / ci-test / integration-like / operations-replay 均已定义 |
| 是否区分 compile/runtime/event/replay 依赖 | 通过 | 见 §8.2 |
| 是否存在 sibling path dependency 越界 | 通过 | 除 `L0-core` 外均禁止 compile dependency |
| 是否把真实 DB/bus/external GRC 写成 P0 前置 | 通过 | 真实产品均 P1/P2 |
| 是否把 staging/production unavailable 伪装 pass | 通过 | P1/P2 unavailable 只记录 residual |
| 配置是否可定位到 profile / config domain | 通过 | 见 §8.3 / §8.4 |
| 数据集是否映射到环境 | 通过 | 见 §8.5 |
| 环境不可用处理是否明确 | 通过 | 见 §8.6 |
| 是否提前定义 CI scripts/artifact | 通过 | 留 Step 9 / Step 13 |

## 9. 对上游设计的影响判定

| 环境 / 配置结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 环境使用 `local-dev` / `ci-test` / `integration-like` / `operations-replay` | 否 | 承接 `04` profile | 无需回写 |
| `staging-like` / `production-like` 不作为 P0 pass | 否 | 范围边界 | Step 14 记录风险 |
| Only `L0-core` compile dependency | 否 | 承接架构依赖裁剪 | Step 9 固定检查方式 |
| P0 使用 fake / controlled / disabled / replay | 否 | 产品中立 | 无需回写 |
| 若 Step 9 需要未定义 CLI/env key | 是 | 配置入口闭口缺口 | 回写 `04` 或 `09` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“环境矩阵”“环境拓扑图”“测试依赖类型与协作方式判定表”“Profile 配置矩阵”“配置项到测试切口矩阵”和“跨环境 / 配置审计表”小节,了解 P0 测试在哪些环境、依赖和配置下执行。

正式 `05-测试方案.md` §8 应回填:

- P0 测试环境包括 `local-dev`、`ci-test`、`integration-like` 和 `operations-replay`。
- `staging-like` 和 `production-like` 属于 P1/P2 selected-run 或 future operations,不作为当前 P0 pass 前置。
- 只有 `L0-core` / `core-contracts` 可作为 compile-time upstream;sibling repos 和 external GRC 只通过 runtime/event/replay seam 协作。
- P0 不要求真实 DB、bus、search、object storage、secret provider 或 external GRC 产品。
- 配置矩阵必须覆盖 runtime profile、adapter mode、strict validation、store refs、resolver/publisher/topic、jobs、handoff/export、external GRC、redaction、clock/id 和 replay root。
- P0 环境不可用或配置非法不得 silent fallback 或伪造 pass。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| CI suite / gate 脚本名称 | 影响自动化执行 | Step 9 固定 |
| artifact-root / report-root 路径 | 影响证据归档 | Step 9 / Step 13 固定 |
| config file path / env key / CLI selector | 影响 entry local args | 若 `04`/`09` 未定义,后续回写 |
| dependency check 实现方式 | 影响 VF-GOV-010 | Step 9 固定 |
| P1 staging-like selected-run 是否进入后续 release | 影响残余风险 | Step 14 记录 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 自动化和人工测试环境均可定位 | 通过 | local-dev / ci-test / integration-like / operations-replay |
| 跨仓依赖类型和协作方式已明确 | 通过 | compile/runtime/event/replay 已区分 |
| 配置矩阵覆盖 P0 profile 和 config gates | 通过 | 见 §8.3 / §8.4 |
| 环境不可用处理已明确 | 通过 | 见 §8.6 |
| 跨环境审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 可进入 Step 9 | 通过 | 下一步设计自动化与 CI/CD 门禁;进入前等待用户审查 |
