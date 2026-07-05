# Step 8. 设计测试环境与配置矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节: `05-测试方案.md` §8 测试环境与配置矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 设计测试环境与配置矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 7 测试数据;`03` config/external binding/observability/test cuts;`04` profile / validation / failure / handoff |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_08_environment_config.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

定义 P0 测试应该在什么环境、什么依赖形态和什么配置边界下执行,并把跨仓协作严格收束为 Artifact 已正式定义的 compile/runtime/event/handoff/replay seam。

本 Step 只回答:

- `local-dev`、`ci-test`、`integration-like`、`operations-replay` 各自验证什么,哪些只是 P1/P2 future direction。
- 每个环境依赖哪些 store、resolver、consumer、publisher、handoff target、clock/id、redaction 和 replay 输入。
- 哪些依赖属于 compile-time、runtime、event、handoff 或 replay 协作,哪些绝不能写成 sibling Cargo dependency。
- 哪些配置项和 feature 会直接影响测试结论。
- 环境或依赖不可用时如何 fail-fast、reject、degraded、delayed 或 failed marker,避免伪造 pass。

本 Step 不定义 CI job 名称、shell 脚本、artifact 目录、报告模板、正式 evidence ID、真实产品部署步骤或 production runbook。自动化脚本和 gate 由 Step 9 固定,证据归档由 Step 13 固定,生产部署和运维由未来 `09-部署与运维手册.md` 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 P0 用例矩阵、公共负向和 no-write / no-truth-repair 红线 |
| `05_test_plan_step_07_test_data.md` | 已完成 | 提供 truth/support/view/report/relay/handoff/config/redaction 数据集 |
| `01-架构设计.md` | 正式输入 | 提供唯一 compile-time 上游、非 core sibling 运行期协作边界和依赖裁剪 |
| `03_ddd_step_14_config_external_binding.md` | 正式输入 | 提供 runtime builder、adapter binding、resolver/publisher/handoff seam 和 fake parity |
| `03_ddd_step_15_observability_audit.md` | 正式输入 | 提供 redaction、safe diagnostics、relay/handoff failure 观测边界 |
| `03_ddd_step_16_test_cuts.md` | 正式输入 | 提供 config validation、adapter availability、dependency boundary、query no-write 和 handoff failure 测试主轴 |
| `04-配置设计.md` | 正式输入 | 提供四个 P0 profile、adapter mode、strict validation、topic binding、replay root 和 failure strategy |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 的正式 profile 语义 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 startup / entry / job / test harness 的加载校验和 activation 口径 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 fail-fast、fail-closed、degraded、delayed、failed marker 分类 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供配置测试、release gate 和 replay 证据承接口径 |
| `projects/L1-governance/design-calibration/05_test_plan_step_08_environment_config.md` | 已读取 | 只作为 Step 8 粒度框架参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 正式测试环境有哪些? | P0 只包括 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。`staging-like`、`production-like` 只保留为 P1/P2 future direction,当前不属于 P0 必过门禁。 |
| 哪些依赖允许 compile-time 引入? | 只有 `L0-core` 的 `core-contracts` 允许作为 compile-time upstream。除它之外,work、process、governance、method-library、runtime、conversation、workspace、archive、observability、sync、SDK、external content source 和 bus 都不得进入 Cargo dependency。 |
| 哪些依赖通过 runtime/event/handoff/replay 协作? | source resolver、inbound consumer、relay publisher、archive/observability/sync handoff、external content mirror、projection/report replay、de-identified replay root 都属于 runtime/event/handoff/replay seam。 |
| 哪些配置会直接影响测试结论? | `runtime.profile`、store binding、resolver mode、consumer enablement、relay topic map、handoff target registry、boundary / page/batch limits、idempotency retention、projection/reference freshness params、redaction deny list、clock/id、fixture set 和 replay root 都会改变测试可执行性和结果。 |
| 环境不可用如何处理? | P0 profile 自身装配失败一律 fail-fast。runtime dependency unavailable 只能按正式 role 产生 degraded、delayed、failed marker 或 current run rejected,不得 silent fallback。P1/P2 环境不可用只能记录 selected-run unavailable / residual risk,不能伪装成 P0 通过。 |
| fake / controlled / replay-backed 分别承担什么? | `fake` 保持正式 port 语义但不访问真实外部依赖;`controlled` 用于 seam 验证 unavailable/degraded/failure mapping;`replay-backed` 用于从去标识化历史状态和 artifact 根重建运行语境。它们都是环境语义的一部分,不是临时代码捷径。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 测试数据 | 已有数据集,但未绑定运行环境和依赖形态 | 本 Step 把数据集映射到 profile 和协作依赖 |
| `04` profile 设计 | 已定义 profile,但测试方案还缺执行环境语义 | 本 Step 转成环境矩阵和配置矩阵 |
| 依赖裁剪 | 上游已明确唯一 compile-time 上游,但测试文档尚未显式承接 | 本 Step 固化 compile/runtime/event/handoff/replay 分类 |
| unavailable 处理 | `04` 有 failure 策略,但测试方案还没说明哪些场景能算预期通过 | 本 Step 固定 fail-fast / degraded / delayed / failed marker 的环境级口径 |
| 历史 `05` | 旧环境通常只写 dev/test/staging | 本 Step 不继承旧环境命名和旧产品假设 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试环境口径 | 只有 profile 名称 | 增加用途、依赖、协作方式、数据策略和 unavailable 处理 | 让测试环境可执行、可审计 |
| 依赖边界 | 只有禁止规则 | 转成 compile/runtime/event/handoff/replay 分类表 | 防止误加 sibling Cargo dependency |
| config 对测试的影响 | 只在 Step 6 / 7 间接出现 | 明确映射到具体测试主题和数据集 | 便于 Step 9 自动化承接 |
| P1/P2 环境 | 只在配置文档里做 future direction | 在测试方案里显式降级为非 P0 | 防止 release gate 越界 |

## 7. 测试环境设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否要求真实 DB / bus / target | A. 要求真实产品;B. 使用 in-memory / fake / controlled / replay-backed | 采用 B。正式产品未锁定,且 P0 只验证 Artifact 语义闭环 |
| 非 core sibling 是否允许 path dependency | A. 允许;B. 禁止 | 采用 B。与 `00/01/03/04` 的依赖裁剪完全一致 |
| `integration-like` 是否等于生产模拟 | A. 等于;B. 只做 controlled seam 验证 | 采用 B。P0 不为未锁定产品背书 |
| `operations-replay` 是否并入 `ci-test` | A. 并入;B. 独立 profile | 采用 B。replay 有独立 report、outbox、reference refresh 和 idempotency 语义 |
| optional handoff/consumer disabled 是否阻断核心 truth 主链 | A. 阻断;B. 仅阻断相关 job / optional path | 采用 B。Artifact 核心主链不能被外围增强反向阻断 |

## 8. 结构化中间产物

### 8.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 依赖类型 | 协作方式 | 关键配置 / feature | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 本地主链调试、手动跑 command/query/job 和最小 smoke | in-memory stores、fake resolver、fake publisher、fake handoff target、consumer disabled or fixture-only、local/system clock/id | compile:`core-contracts`;runtime:fake adapters | fake / disabled / in-memory | `runtime.profile=local-dev`;strict validation;fake publisher route refs | `DS-ART-RUN-001` + happy-path truth/support/view datasets | 不作为正式验收 evidence |
| `ci-test` | deterministic P0 contract/domain/service/fake integration 自动化 | isolated in-memory stores、deterministic fake resolver、fixture consumer、fake publisher with asserted topic map、fake handoff targets、fixed clock/id、write-audit / no-repair audit helper | compile:`core-contracts`;runtime:fake infra;event:fixture envelopes | fake / fixture / deterministic | `runtime.profile=ci-test`;`testFixtures.fixtureSetRef` required;strict validation | 全量 `DS-ART-*` P0 datasets;run-scoped cleanup | 任一装配失败不得 fallback |
| `integration-like` | adapter unavailable/degraded、topic completeness、handoff failure、controlled seam 验证 | in-memory or durable-like test store through ports、controlled resolver/consumer、controlled publisher route map、controlled handoff targets | compile:`core-contracts`;runtime:controlled adapters;event:controlled events | controlled / failure injection / no real sibling code dependency | `runtime.profile=integration-like`;controlled adapter modes;topic map complete | `DS-ART-EXTREF-*`;`DS-ART-MIRROR-001`;`DS-ART-OUTBOX-001`;`DS-ART-HANDOFF-001`;`DS-ART-CONFIG-*` | 不证明真实产品行为,只证明 seam semantics |
| `operations-replay` | relay publication、projection rebuild、reference refresh、reconciliation、handoff 和 duplicate replay 恢复验证 | replay-backed state/report/outbox fixtures、controlled or fake publisher、controlled resolver、replay handoff targets、replay clock/id | runtime:replay-backed + controlled;event:replay artifacts | replay-backed / controlled / fake | `runtime.profile=operations-replay`;`testFixtures.replayArtifactRootRef` required and de-identified | `DS-ART-OUTBOX-001`;`DS-ART-PROJECTION-001`;`DS-ART-MIRROR-001`;`DS-ART-REPORT-001`;`DS-ART-HANDOFF-001`;`DS-ART-IDEMP-001` | replay 语料若不脱敏必须直接 reject |
| `staging-like` | P1 selected-run、真实依赖 dry-run、future release candidate | future durable store、future real-like resolver/publisher/handoff/consumer | runtime:future real-like | selected-run / dry-run | future provider-facing refs | future durable-like datasets | 当前不属于 P0 |
| `production-like` | P1/P2 生产运行和运维场景 | future approved DB/bus/targets/providers | runtime:future production | approved runtime only | future production config | future production-safe data only | 当前不执行,不能伪造 production evidence |

#### 环境拓扑图: L1-artifact P0 测试依赖

```text
                        [L0-core / core-contracts]
                                  ^
                                  | [compile-time]
                                  |
[api / worker / jobs entries] -> [artifact application services]
        | [runtime]                         | [runtime]
        v                                   v
[runtime builder + validated config] [repositories / UoW / result stores]
        | [runtime]                         |
        v                                   v
[fake / controlled / replay-backed adapters] [projection / reference / relay / handoff stores]
        | [event / handoff / replay]
        v
[fixture envelopes / replay root / controlled targets]

non-core siblings and external systems:
  work / process / governance / method-library / runtime / conversation / workspace /
  archive / observability / sync / sdk / bus / external content
  -> runtime/event/handoff/replay only
  -> never compile-time dependency
```

关键说明:

- `core-contracts` 是唯一允许的 compile-time sibling upstream。
- 6 个 inbound consumer 和 8 个 outbound / handoff seam 都通过 event / adapter / replay 协作验证,不通过源码依赖验证。
- `PublishPendingArtifactRelays` 是 internal worker facade,它的环境验证并入 relay publisher seam,不计入 6 个 public jobs。
- P0 不要求真实 DB、真实 bus、真实 archive / observability / sync 产品。

### 8.2 测试依赖类型与协作方式判定表

| 依赖对象 | 依赖类型 | 是否允许 Cargo dependency | P0 协作方式 | 覆盖主轴 | 风险 |
|---|---|---|---|---|---|
| `L0-core/core-contracts` | compile-time | 是 | path or package dependency | 全部 `TC-ART-*` | 版本漂移需要 lock / digest 管理 |
| work | runtime / event | 否 | `WorkArtifactContextChangedPayload`、safe snapshot、resolver fake | `TC-ART-CONSUMER-001`;read/backref traces | 真实 work 生命周期不在 P0 |
| process | runtime / event | 否 | `ProcessArtifactContextChangedPayload`、safe snapshot、resolver fake | `TC-ART-CONSUMER-002` | 真实 process 状态差异不在 P0 |
| governance | runtime / event | 否 | `GovernanceArtifactContextChangedPayload`、safe snapshot、resolver fake | `TC-ART-CONSUMER-003`;review/basis context | 治理真相不迁入 Artifact |
| method-library | runtime / event | 否 | `MethodArtifactDefinitionChangedPayload`、definition resolver fake | `TC-ART-CONSUMER-004` | method definition body 禁入 |
| runtime / capability | runtime / event | 否 | `RuntimeArtifactSignalRecordedPayload`、automation source ref | `TC-ART-CONSUMER-005`;automation path | runtime output body 禁入 |
| external content source | runtime / event / replay | 否 | `ExternalContentSourceChangedPayload`、mirror snapshot、refresh record | `TC-ART-CONSUMER-006`;`TC-ART-JOB-002`;`TC-ART-QUERY-013` | raw content body 禁入 |
| bus / relay transport | runtime / event | 否 | fake / controlled publisher + topic map completeness | `TC-ART-OUTBOX-*`;`TC-ART-RELAY-001`;`TC-ART-CONFIG-*` | 真路由和 broker SLA 不在 P0 |
| archive target | runtime / handoff | 否 | fake / controlled archive target refs | `TC-ART-JOB-004` | package body 禁入 |
| observability target | runtime / handoff | 否 | fake / controlled observability target refs | `TC-ART-JOB-005`;`TC-ART-REDACTION-*` | observability body 禁入 |
| sync target | runtime / handoff | 否 | fake / controlled sync target refs | `TC-ART-JOB-006` | sync 私有副本正文禁入 |
| workspace / conversation / sdk consumers | runtime / consumption boundary | 否 | consumer scope refs / handoff refs / read surface policies | `TC-ART-QUERY-007`;`TC-ART-CMD-015~016` | 只测边界,不测其内部产品 |
| dependency metadata checker | local tool | 不适用 | manifest/dependency graph fixture | `TC-ART-ARCH-001` | 工具路径由 Step 9 固定 |

### 8.3 Profile 配置矩阵

| Profile | Store mode | Resolver / consumer mode | Relay publisher / topic mode | Jobs / replay mode | Handoff target mode | Redaction / diagnostics | Clock / id |
|---|---|---|---|---|---|---|---|
| `local-dev` | in-memory | fake / disabled / fixture-only | fake publisher + local route refs | manual jobs,small page defaults | fake targets or disabled | deny list enabled;safe diagnostics only | local/system or deterministic |
| `ci-test` | in-memory isolated per run | deterministic fake / fixture-only | fake publisher with asserted topic map | all P0 public jobs + relay facade under deterministic harness | fake targets with injected failures | mandatory redaction scan | fixed deterministic |
| `integration-like` | in-memory or durable-like test store | controlled / unavailable / degraded injection | controlled publisher + complete topic map | selected P0 seam jobs,controlled failure mapping | controlled target refs | redacted diagnostics only | deterministic or controlled runtime |
| `operations-replay` | replay-backed state / report / outbox fixtures | replay snapshot + controlled resolvers | pending relay replay + fake/controlled publisher | publish/rebuild/refresh/reconcile/handoff replay | replay or controlled targets | de-identified replay diagnostics only | replay clock + deterministic id |
| `staging-like` | future durable store | future real-like | future real-like | future selected-run | future real-like | provider-facing refs only | runtime-like |
| `production-like` | future production store | future approved | future approved | future production operations | future approved | provider-facing refs only | production provider |

### 8.4 配置项到测试切口矩阵

| 配置 / feature | 影响测试 | 覆盖用例 | 数据集 | 失败策略 |
|---|---|---|---|---|
| `runtime.profile` | profile selection and isolation | `TC-ART-CONFIG-001` | `DS-ART-CONFIG-001`;`DS-ART-CONFIG-NEG-001` | unknown profile fail-fast |
| `runtime.strictValidation` | strict parser / validator behavior | `TC-ART-CONFIG-002` | `DS-ART-CONFIG-NEG-001` | false or invalid in P0 fail-fast |
| `stores.*` | repository/UoW backing and deterministic isolation | `TC-ART-IDEMP-004~005`;`TC-ART-JOB-*` | `DS-ART-RUN-001`;`DS-ART-FAULT-001` | missing binding fail-fast |
| `sourceResolvers.*` | resolved/unresolved/failed external refs | `TC-ART-CONSUMER-*`;`TC-ART-QUERY-013` | `DS-ART-EXTREF-*`;`DS-ART-MIRROR-001` | invalid binding fail-fast;runtime unavailable => delayed/degraded |
| `inboundConsumers.*` | consumer enablement and supported schema | `TC-ART-CONSUMER-*`;`TC-ART-CONTRACT-003` | `DS-ART-PROTOCOL-*`;`DS-ART-EXTREF-*` | invalid namespace/schema fail-fast |
| `relay.publisherAdapterRef` / `transportTopicBindings` | outbox publish and route completeness | `TC-ART-OUTBOX-*`;`TC-ART-RELAY-001`;`TC-ART-CONFIG-004` | `DS-ART-OUTBOX-001`;`DS-ART-PUBLISHER-001` | missing enabled topic fail-fast |
| `handoff.*Targets` | archive / observability / sync handoff availability | `TC-ART-JOB-004~006` | `DS-ART-HANDOFF-001`;`DS-ART-PUBLISHER-001` | startup fail-fast or current run reject |
| `handoff.emitTraceAvailableEventFromHandoff` | trace event optional topic dependency | `TC-ART-CONFIG-004`;`TC-ART-OUTBOX-007` | `DS-ART-CONFIG-NEG-001`;`DS-ART-OUTBOX-001` | true without route binding fail-fast |
| `boundary.maxPageLimit` and job batches | query/job page and batch validation | `TC-ART-CONFIG-004`;`TC-ART-JOB-*` | `DS-ART-CONFIG-NEG-001`;`DS-ART-REPORT-001` | invalid page/batch reject |
| `idempotency.*` | duplicate replay and retention window | `TC-ART-IDEMP-001~004` | `DS-ART-IDEMP-001`;`DS-ART-REPORT-001` | retention conflict fail-fast |
| `projection.*` / `reference.*` | degraded freshness and maintenance defaults | `TC-ART-QUERY-009~013`;`TC-ART-JOB-001~003`;`TC-ART-IDEMP-007` | `DS-ART-PROJECTION-001`;`DS-ART-MIRROR-001` | invalid config fail-fast;runtime unavailable => degraded |
| `redaction.*` | no-output and low-cardinality checks | `TC-ART-REDACTION-001~002` | `DS-ART-REDACTION-*` | unsafe relax fail-fast |
| `clockId.*` | deterministic state / trace / report assertions | all time-sensitive `TC-ART-*` | `DS-ART-RUN-001` | incompatible profile binding fail-fast |
| `testFixtures.fixtureSetRef` | `ci-test` fixture availability | `TC-ART-CONFIG-001`;all `ci-test` suites | `DS-ART-CONFIG-001`;`DS-ART-RUN-001` | missing fixture set test fail-fast |
| `testFixtures.replayArtifactRootRef` | replay profile source and de-identification | `TC-ART-CONFIG-004`;`TC-ART-JOB-*`;`TC-ART-IDEMP-*` | `DS-ART-CONFIG-NEG-001`;`DS-ART-REPORT-001` | missing or raw replay root reject |

### 8.5 环境到数据集矩阵

| 环境 | 数据集 | 使用方式 | 清理 / 隔离 |
|---|---|---|---|
| `local-dev` | `DS-ART-RUN-001`;核心 happy-path truth/support/view datasets | 本地主链和最小 smoke | run namespace reset |
| `ci-test` | 全量 `DS-ART-*` P0 datasets | deterministic 自动化主环境 | run reset + fake adapter reset |
| `integration-like` | `DS-ART-EXTREF-*`;`DS-ART-MIRROR-001`;`DS-ART-OUTBOX-001`;`DS-ART-HANDOFF-001`;`DS-ART-FAULT-001`;`DS-ART-CONFIG-*` | controlled seam / failure mapping | run reset + controlled adapter reset |
| `operations-replay` | `DS-ART-OUTBOX-001`;`DS-ART-PROJECTION-001`;`DS-ART-MIRROR-001`;`DS-ART-REPORT-001`;`DS-ART-HANDOFF-001`;`DS-ART-IDEMP-001` | replay / recovery / duplicate verification | replay run cleanup + fake reset |
| `staging-like` | future durable selected-run datasets | P1 selected-run only | future run-scoped cleanup |
| `production-like` | future production-safe datasets | P1/P2 operations validation only | future runbook |

### 8.6 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | P0 处理 | 是否可记 pass |
|---|---|---|---|
| `local-dev` | startup config invalid or required fake binding missing | local run fail-fast | 否 |
| `ci-test` | runtime builder failed or fixture set missing | suite fail-fast | 否 |
| `ci-test` fake infra | harness bug makes fake store/publisher unavailable | 记为 test infra defect,不得伪装 pass | 否 |
| `integration-like` controlled resolver | 预期 unavailable/degraded/failure mapping case | 仅当断言 delayed/degraded/failed marker 命中时通过 | 仅预期场景可通过 |
| `integration-like` topic map missing | publisher seam cannot assemble | fail-fast | 否 |
| `operations-replay` replay root missing / not de-identified | replay current run rejected | 否 |
| archive / observability / sync target disabled | 仅相关 handoff job reject / disabled marker;core truth flow 仍可通过 | 是,仅限边界用例 |
| non-core sibling compile dependency missing | should never be compiled directly | 作为 architecture/dependency boundary failure | 否 |
| `staging-like` / `production-like` unavailable | future selected-run not executed | 记录 unavailable / residual risk | 不计 P0 pass |

### 8.7 环境 / 配置停审记录

| 环境 / 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | 是否支持本地主链且不冒充正式证据 | 通过 | 无 |
| `ci-test` | 是否覆盖 deterministic P0 自动化 | 通过 | suite 名称留 Step 9 |
| `integration-like` | 是否覆盖 controlled seam 和 failure mapping | 通过 | 不证明真实产品 |
| `operations-replay` | 是否覆盖 replay/recovery/idempotency/report 语义 | 通过 | replay artifact 路径留 Step 9/13 |
| `staging-like` / `production-like` | 是否保持 future direction | 通过 | Step 14 再记残余风险 |
| compile-time dependency rule | 是否只允许 `core-contracts` | 通过 | check 脚本留 Step 9 |
| config matrix | 是否承接 `04` 的 profile/validation/failure 口径 | 通过 | env key / file path 留 Step 9/09 文档链 |
| unavailable handling | 是否禁止伪 pass | 通过 | selected-run unavailable 只记风险 |

### 8.8 跨环境 / 配置审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 环境是否都可定位 | 通过 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` 已闭合 |
| compile/runtime/event/handoff/replay 是否已区分 | 通过 | 见 §8.2 |
| 是否存在非 core sibling Cargo dependency 越界 | 无 | 见 §8.2 |
| 是否把真实产品写成 P0 前置 | 无 | 真实产品全部降级到 P1/P2 |
| 环境是否映射回 Step 7 数据集 | 通过 | 见 §8.5 |
| unavailable 是否会被伪装成 pass | 不允许 | 见 §8.6 |
| 是否提前定义脚本 / artifact 目录 / evidence ID | 无 | 留 Step 9 / Step 13 |

## 9. 对上游设计的影响判定

| 环境 / 配置结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 测试环境固定为四个 profile | 否 | 承接 `04` profile | 无需回写 |
| compile-time upstream 仅 `core-contracts` | 否 | 承接 `00/01/03/14` 依赖裁剪 | 无需回写 |
| non-core sibling 只通过 runtime/event/handoff/replay seam 协作 | 否 | 架构承接 | 无需回写 |
| P0 使用 fake / controlled / replay-backed,不要求真实产品 | 否 | 产品中立测试口径 | 无需回写 |
| 若 Step 9 需要正式 CLI/env key/script path,而 `04/09` 未给出 | 是 | 配置入口闭口缺口 | 后续回写 `04` 或未来 `09-部署与运维手册.md` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“环境矩阵”“环境拓扑图”“测试依赖类型与协作方式判定表”“Profile 配置矩阵”“配置项到测试切口矩阵”和“跨环境 / 配置审计表”小节。

正式 `05-测试方案.md` §8 应回填:

- P0 测试环境只包括 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。
- `staging-like` 和 `production-like` 仅属于 P1/P2 future direction,不作为当前 P0 pass 前置。
- `core-contracts` 是唯一允许的 compile-time sibling upstream;其他 sibling 和外部系统只能通过 runtime/event/handoff/replay seam 协作。
- P0 不要求真实 DB、bus、archive、observability、sync 或 external content 产品。
- 测试环境配置矩阵必须覆盖 runtime profile、store binding、resolver mode、consumer enablement、relay topic map、handoff targets、boundary limits、idempotency retention、projection/reference params、redaction、clock/id、fixture set 和 replay root。
- 环境不可用或配置非法不得 silent fallback,也不得伪造 pass。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| CI suite / gate 脚本名称 | 影响执行入口 | Step 9 固定 |
| artifact/report/replay root 目录结构 | 影响证据归档 | Step 9 / Step 13 固定 |
| dependency boundary check 的实现方式 | 影响 `TC-ART-ARCH-001` 自动化 | Step 9 固定 |
| future selected-run 是否引入 durable-like store | 影响 Step 14 残余风险 | 当前保留为 future direction |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 测试环境均已定位 | 通过 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` |
| 依赖类型和协作方式已明确 | 通过 | compile/runtime/event/handoff/replay 已区分 |
| 配置矩阵已覆盖测试主轴 | 通过 | 见 §8.3 / §8.4 |
| 数据集已映射到环境 | 通过 | 见 §8.5 |
| unavailable 处理已明确 | 通过 | 见 §8.6 |
| 可进入 Step 9 | 通过 | 下一步设计自动化与 CI/CD 门禁;进入前等待用户审查 |
