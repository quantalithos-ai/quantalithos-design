# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填章节: `07-实施计划.md` §8 配置、环境与外部依赖准备
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义配置、环境与外部依赖准备 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 前置条件;Step 5 phase;Step 6 boundary;Step 7 gate;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 3 前置条件与阅读清单 | 已完成;用户已确认 | 提供目标仓、sibling repo、git config、目录命名、artifact/report root 和 memory seed 检查 |
| Step 5 PH-01~PH-08 | 已完成;用户已确认 | 确定每类配置 / 依赖在哪个 phase 前必须可用 |
| Step 6 `commit-01-a`~`commit-08-b` | 已完成;用户已确认 | 将配置 / 环境 / 外部依赖检查压到 commit boundary |
| Step 7 测试与验收门禁 | 已完成;用户已确认 | 承接 `config-redline`、`dependency-boundary`、`redaction-boundary`、report audit 和 acceptance handoff |
| `03_ddd_step_14_config_external_binding.md` | 已存在 | 提供 runtime builder、store / resolver / publisher / handoff adapter、topic binding 和唯一 compile-time dependency |
| `04-配置设计.md` 与配置校准 Step 6/7/12 | 已存在 | 提供四个 P0 profile、14 个配置模块、entry-local args、failure / degradation 和下游承接 |
| `05-测试方案.md` §8/§9/§13 | 已存在 | 提供 P0 环境矩阵、suite、artifact/report root 和 `EV-CAND-ART-*` |
| `06-验收标准.md` §3/§7/§10/§11 | 已存在 | 提供 P0 profile、config digest、dependency boundary、VETO 和 final evidence 规则 |
| 本地 `/home/aris/Projects` 检查 | 已执行 | `quantalithos-core/crates/contracts` 存在;`quantalithos-artifact` 当前未发现 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些外部服务或仓是实施前置依赖? | 编译期前置依赖只有 `/home/aris/Projects/quantalithos-core/crates/contracts`。目标实现仓 `/home/aris/Projects/quantalithos-artifact` 必须在 PH-01 开工前存在或由 PH-01 创建。其他 sibling repo 和外部产品不是 P0 编译期前置。 |
| 哪些依赖只在特定阶段需要? | PH-01 需要目标仓、Rust toolchain、core path dependency、config/script/artifact/report roots。PH-02~PH-04 需要 in-memory truth stores、idempotency/result store、fixed clock/id 和 source resolver fake。PH-05 需要 projection/reference/trace read stores。PH-06 需要 inbound consumer fixture/controlled source、topic map、relay store 和 fake publisher。PH-07 需要 job registry、report store、replay root、handoff/export fake targets。PH-08 需要 release `run_id`、raw artifact/report roots、report generators 和 acceptance templates。 |
| 哪些配置项必须在本地或 CI 环境准备? | `runtime.profile`、`runtime.strictValidation`、`stores.*`、`sourceResolvers.*`、`inboundConsumers.*`、`relay.*`、`jobs.*`、`handoff.*`、`boundary.*`、`idempotency.*`、`projection.*`、`reference.*`、`redaction.*`、`clockId.*`、`testFixtures.*`。 |
| 是否允许 fake / mock,允许到什么阶段为止? | P0 正式允许 fake / in-memory / controlled / disabled / replay-backed seam,并贯穿 PH-01~PH-08 的自动化和 release evidence。fake 必须保持正式 version、UoW、idempotency、receipt、outbox snapshot、query no-write、job report、redaction 和 error mapping 语义,不得降低业务不变量。 |
| 外部依赖不可用时是暂停、降级还是替代? | 目标仓、core contracts、Rust toolchain 不可用则暂停。P0 fake/controlled/replay-backed seam 配置缺失则 fail-fast 或 suite failed。运行期 resolver / publisher / handoff 的预期 unavailable 场景必须产生 degraded、delayed、failed marker 或 report。P1/P2 real-like 不可用只记录 residual / unavailable,不得计 P0 pass。 |
| 哪些依赖需要由其他团队或仓提供? | P0 编译期只需要 L0-core 的 `core-contracts`。work、process、governance、method-library、runtime/capability、bus、conversation、archive、observability、sync、SDK 和 external content source 只通过 runtime / event / adapter / handoff / replay seam 协作。 |
| 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在? | 当前本地存在 `quantalithos-core`、`quantalithos-bus`、`quantalithos-identity`、`quantalithos-method-library`、`quantalithos-process`、`quantalithos-sdk`、`quantalithos-work`、`quantalithos-conversation`、`quantalithos-governance` 和 design 仓;未发现 `quantalithos-artifact`。 |
| 哪些依赖是编译期依赖,Cargo 本地 path dependency 写法是否已经与详细设计一致? | 唯一编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。除 core 外,不得加入 sibling path dependency。 |
| 哪些依赖是运行期依赖或事件协作依赖,应该使用 API / SDK / adapter / event / projection / fake,而不是 Cargo path dependency? | bus、governance、work、process、method-library、runtime/capability、conversation、archive、observability、sync、SDK、external content source、workspace / console consumers 都必须通过 adapter、event、handoff、read API、projection/replay 或 fake / controlled seam 协作。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 3 | 已记录目标实现仓不存在 | 若不前置会阻塞 PH-01 | 本 Step 设为 PH-01 blocker |
| `03` Step 14 | 已定义代码绑定点,但实施计划还缺阶段化准备表 | 实现 agent 可能把外部依赖临场判断 | 本 Step 转成 phase / boundary 可检查表 |
| `04` Step 6/7 | profile 与配置项很完整 | 实施计划若复制全表会过长 | 本 Step 只抽取实施前必须准备和检查的配置项族 |
| `05` Step 8/9/13 | 测试环境、自动化、证据路径已固定 | 需要落到实现前目录和脚本准备 | 本 Step 固定 artifact/report root、P0 profiles 和 report generator 依赖 |
| `06` VETO | dependency/config/evidence 失败是验收红线 | 需要在 PH-01 和 PH-08 前置阻断 | 本 Step 增加不可用处理和 boundary 检查 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 外部依赖 | 分散在架构、详细、配置、测试、验收 | 按 compile/runtime/event/handoff/replay/test 分类 | 实施前可检查,不可用时有明确处理 |
| P0 profile | 已在 `04/05` 定义 | 进入实施准备和 release gate 前置 | 防止 profile 装配失败被晚发现 |
| fake / controlled | 配置和测试中已有语义 | 明确为 P0 正式 seam,但必须保持 parity | 防止 fake shortcut |
| 目标仓 | Step 3 已记录不存在 | 标记为 PH-01 blocker | 避免实现移交时无落点 |
| P1/P2 依赖 | 在测试 / 验收中列 residual | 明确不计 P0 pass | 防止 selected-run 污染主线 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 将所有 sibling repo 作为 Cargo path dependency | 编译期直接引用类型 | 违反 dependency boundary 与 L1 平权 | 不采用 |
| 仅 `core-contracts` 作为编译期依赖 | 边界清晰 | 需要 formal DTO / ref / fake seam | 采用 |
| P0 要求真实 DB / bus / archive / observability / sync | 更像生产 | 产品未锁定且阻塞 P0 | 不采用 |
| P0 使用 fake / controlled / replay-backed | 自动化稳定,可复现 | 不证明真实产品行为 | 采用,真实产品列 P1/P2 residual |
| 配置准备复制完整 `04` 字段表 | 信息最全 | 实施计划过长且形成第二配置真相源 | 不采用;只列实施检查族 |

## 7. 结构化中间产物

### 7.1 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-artifact` | repo | 目标实现仓 | PH-01~PH-08 | 本项目 | `test -d`;`git status`;workspace check | PH-01 暂停,先创建或确认仓 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | repo/crate | 唯一编译期 sibling dependency | PH-01 起 | L0-core | path exists;Cargo dependency graph | 不可用则暂停 |
| Rust toolchain | tool | build/test dependency | PH-01 起 | local toolchain | `cargo fmt --check`;`cargo check` | 不可用则暂停 |
| in-memory truth / UoW stores | config/adapter | P0 runtime dependency | PH-02~PH-04 | artifact-infra | runtime builder smoke;service-flow tests | 不可用则 suite failed |
| idempotency / stored result / report store | config/adapter | P0 runtime dependency | PH-02 起;PH-07 report replay | artifact-infra | duplicate replay tests;infra-runtime-fake | 不可用则暂停或 suite failed |
| projection / reference / trace stores | config/adapter | P0 runtime dependency | PH-05 起 | artifact-infra | query/projection/stale tests | 缺 source 则暂停或回写设计 |
| work context resolver / event source | adapter/event | runtime / event seam | PH-06 | fake/controlled resolver | consumer tests | P0 fake 缺失失败;real unavailable degraded/residual |
| process context resolver / event source | adapter/event | runtime / event seam | PH-06 | fake/controlled resolver | consumer tests | 同上 |
| governance context resolver / event source | adapter/event | runtime / event seam | PH-02/PH-04/PH-06 | fake/controlled resolver | command/consumer tests | unresolved -> delayed/rejected/degraded |
| method artifact definition resolver | adapter/event | runtime / event seam | PH-02/PH-06 | fake/controlled resolver | intake/consumer tests | unresolved -> delayed/rejected |
| runtime/capability signal resolver | adapter/event | runtime / event seam | PH-02/PH-06 | fake/controlled resolver | automation/consumer tests | unavailable -> pending/degraded |
| external content source resolver | adapter/event/replay | runtime / event seam | PH-02/PH-06/PH-07 | fake/controlled/replay resolver | mirror/refresh tests | body never stored;unavailable -> degraded/failed marker |
| fake publisher / topic map | adapter/config | P0 event transport dependency | PH-06~PH-08 | artifact-infra | topic map check;outbox publisher tests | enabled topic missing fail-fast |
| archive / observability / sync handoff targets | adapter/config | P0 fake/controlled handoff seam | PH-07~PH-08 | artifact-infra | handoff/export tests | disabled expected;enabled missing reject/fail-fast |
| conversation / workspace / SDK consumers | downstream runtime/API consumers | runtime / consumption boundary | PH-05~PH-08 | downstream repos/fake consumers | query/read/handoff tests | 不阻塞 Artifact P0 |
| artifact/report root | filesystem | test evidence dependency | PH-01~PH-08 | implementation repo | script dry-run;report audit | missing path blocks gate/report |
| release `run_id` | entry-local parameter | evidence identity | PH-08 | release gate caller | release script arg validation | missing/invalid blocks release gate |

### 7.2 配置与环境检查表

| 配置 / 环境项 | 使用阶段 | 检查方式 | 失败处理 |
|---|---|---|---|
| `runtime.profile` | PH-01 起 | config parse smoke;profile matrix test | unknown profile fail-fast |
| `runtime.strictValidation` | PH-01 起 | `config-redline` | false or invalid P0 profile fail-fast |
| `stores.*.kind/configRef` | PH-02 起 | runtime builder tests | missing/unsupported fail-fast |
| `sourceResolvers.adapterRef/mode/unavailableDisposition` | PH-02/PH-06/PH-07 | resolver registry tests | missing required family fail-fast |
| `inboundConsumers.enabledNamespaces/sourceMode/supportedSchemaVersion` | PH-06 | consumer schema/version tests | unsupported version rejected/dead-letter |
| `relay.publisherAdapterRef/transportTopicBindings` | PH-06 | topic map verification | enabled event key missing fail-fast |
| `jobs.defaultBatchSize/maxParallelism/retryPolicyRef/jobTimeoutSeconds` | PH-07 | jobs registry / runner tests | invalid value reject/fail-fast |
| `handoff.archiveTargets/observabilityTargets/syncTargets` | PH-07 | handoff target validation | enabled missing target rejects job |
| `boundary.*` | PH-01 起;query/jobs from PH-05 | API/query/job validation tests | invalid request/page/batch rejected |
| `idempotency.*RetentionSeconds` | PH-02 起 | idempotency retention tests | retention conflict fail-fast |
| `projection.*` / `reference.*` | PH-05 起 | degraded/freshness/rebuild/refresh tests | invalid fail-fast;runtime unavailable -> degraded |
| `redaction.*` | PH-01 起;full PH-08 | `redaction-boundary`;release redaction check | scan or unsafe config failure blocks |
| `clockId.*` | PH-01 起 | deterministic run tests | missing/incompatible binding fails tests |
| `testFixtures.fixtureSetRef` | `ci-test` | suite fixture load | missing fixture set fail-fast |
| `testFixtures.replayArtifactRootRef` | `operations-replay` | replay root validation | missing/raw replay root rejects run |
| artifact/report roots | PH-01 起 | script dry-run;report audit | missing root blocks scripts |

### 7.3 Fake / Controlled / Disabled / Replay 使用边界

| Seam | P0 允许模式 | 不允许 | 使用阶段 |
|---|---|---|---|
| repository / UoW | in-memory fake with version / rollback / commit-unknown semantics | 跳过 optimistic version 或 rollback | PH-02 起 |
| idempotency / result / report | fake store with duplicate replay semantics | duplicate 直接重跑 mutation | PH-02 起;job PH-07 |
| source resolver | fake or controlled safe snapshot | 返回 external body、raw secret 或 full sensitive ref | PH-02/PH-06/PH-07 |
| inbound consumer input | fixture-only or controlled event envelope with schema version | unsupported version 仍解析 payload | PH-06 |
| outbox publisher | fake/controlled publisher with topic map and failure injection | publish 时从 current truth 重算 payload | PH-06 |
| query degraded | controlled unavailable projection/reference source | degraded query 修复 projection/reference 或写 truth | PH-05 |
| handoff/export | fake/controlled target with partial failure | handoff/export 写 core truth 或保存 target body | PH-07 |
| operations replay | replay-backed de-identified state/report/outbox refs | raw historical body or secret in replay root | PH-07~PH-08 |
| report generator | local script from raw artifacts | static JSON / hand-written pass | PH-08 |

### 7.4 Phase 级准备矩阵

| Phase | 开工前必须确认 | 可后置准备 | 不可用处理 |
|---|---|---|---|
| PH-01 | target repo, core path dependency, Rust toolchain, git config, workspace naming, config/script/artifact/report roots | real adapters,durable stores | target repo/core/toolchain 不可用则暂停 |
| PH-02 | in-memory truth/UoW/idempotency/result store、fixed clock/id、method/governance/runtime resolver fake | inbound event worker,relay publisher | fake store or resolver 缺失阻断 |
| PH-03 | version/lineage repository fake、history/audit store、expected-version tests | real upstream lifecycle | design/source 缺口则暂停 |
| PH-04 | baseline store、governance/method resolver fake、redaction deny list | query/API/event/job entry | redaction or resolver boundary failed 阻断 |
| PH-05 | projection/reference/trace stores、visibility/degraded source、query profile | consumer/outbox publisher | query store or visibility/degraded source 缺失则暂停 |
| PH-06 | inbound schema allowlist、resolver registry、topic map、relay store、fake publisher | public operations job DTO | topic/resolver/publisher missing fail-fast |
| PH-07 | job registry、stored report store、replay root、handoff/archive/observability/sync targets | final acceptance reports | report/scope/target 缺失阻断 job boundary |
| PH-08 | release run_id、artifact/report roots、report generators、acceptance templates、redaction/dependency/report audit scripts | P1 selected-run | missing evidence dependency blocks release gate |

### 7.5 Commit boundary 配置 / 依赖检查

| Commit boundary | 必查配置 / 依赖 | 检查方式 | 失败处理 |
|---|---|---|---|
| `commit-01-a` | target repo、workspace、core path dependency、Rust toolchain | `cargo check`;dependency boundary | 暂停或修正 workspace |
| `commit-01-b` | P0 profiles、config modules、script roots、artifact/report directories | config smoke;script dry-run | 修正 profile/script/root |
| `commit-02-a` | fact/intake/review contracts 不依赖 external body | contract/domain tests | 若需要外部 body,回写 design |
| `commit-02-b` | truth/UoW/idempotency/result stores、method/governance/runtime resolver fake | `service-flow-fast`;`infra-runtime-fake` | 修正 fake parity 或设计 |
| `commit-03-a` | version store/history/id generator/clock binding | `contract-domain-fast` version slice | missing binding blocks |
| `commit-03-b` | lineage relation store and safe resolver refs | `contract-domain-fast` lineage slice | resolver/source 缺口回设计 |
| `commit-03-c` | version/lineage application runtime fake and replay guard | `service-flow-fast`;`infra-runtime-fake` | conflict/replay 缺口阻断 |
| `commit-04-a` | baseline formal version source and redaction-safe baseline refs | baseline contract tests | missing source blocks |
| `commit-04-b` | baseline services、history audit、redaction targeted | `service-flow-fast`;redaction targeted | redaction or source failure blocks |
| `commit-05-a` | query/view/projection identities and page limits | query contract tests | missing query config/source blocks |
| `commit-05-b` | projection/reference stores、visibility/degraded/freshness source | query no-write/projection tests | side effect or missing source blocks |
| `commit-05-c` | API query entry、trace/report read roots、read-only report refs | API query tests | backref/report read source missing blocks |
| `commit-06-a` | consumer namespaces and schema allowlist | consumer contract tests | unsupported/missing schema blocks |
| `commit-06-b` | resolver registry、snapshot/receipt/stale stores、fixed clock/id | `entry-worker-job` consumer slice | missing resolver or stale source blocks |
| `commit-06-c` | outbox store、publisher adapter、topic map、relay retry config | `operations-replay-core`;topic map check | topic/payload source missing blocks |
| `commit-07-a` | job registry、report/result store、handoff/export marker config | job contract tests | shared job surface missing blocks |
| `commit-07-b` | replay root、projection/reference maintenance plans、stored report replay | `operations-replay-core` jobs slice | missing plan/report source blocks |
| `commit-07-c` | handoff/archive/observability/sync target refs and redaction | handoff/export tests;redaction targeted | disabled/failed target must report;leak blocks |
| `commit-08-a` | release gate script args、artifact/report roots、dependency/redaction/report audit shell | release dry-run;report audit shell | missing script/root blocks |
| `commit-08-b` | release run_id、P0 profiles、all reports、acceptance templates、VETO checklist | release gate;report-generation-audit;VETO audit | missing artifact/report/VETO evidence blocks |

### 7.6 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | P0 处理 | 是否可记 pass |
|---|---|---|---|
| target repo | `/home/aris/Projects/quantalithos-artifact` 不存在 | PH-01 暂停或创建仓后再继续 | 否 |
| core-contracts | path 不存在或 Cargo 无法解析 | 暂停;不得 vendored copy | 否 |
| Rust toolchain | `cargo check` / `cargo fmt` 无法运行 | 暂停环境修复 | 否 |
| P0 config profile | profile unknown,strict validation false,required binding missing | fail-fast | 否 |
| in-memory fake store | version/UoW/idempotency parity 失败 | suite failed | 否 |
| fake resolver | required P0 resolver family missing | runtime builder fail-fast or suite failed | 否 |
| controlled unavailable resolver | 预期 unavailable/degraded/failure mapping 场景 | 断言 delayed/degraded/failed marker/report | 仅预期场景可通过 |
| topic map | enabled outbound key 缺 binding | startup fail-fast | 否 |
| fake publisher failure | retryable/permanent failure injection | 标 retryable/failed relay state and report,truth unchanged | 预期场景可通过 |
| handoff/export target disabled | job target disabled | job rejected/failed marker/report | 预期场景可通过 |
| replay root | missing,not de-identified,or raw body present | replay run rejected | 否 |
| P1 real-like selected-run | real DB/bus/vendor unavailable | residual/unavailable | 不计 P0 pass |
| artifact/report root | gate/report cannot write outputs | gate failed | 否 |

### 7.7 配置 / 环境停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 编译期依赖是否只有 core-contracts | 设计层通过 | PH-01 / PH-08 执行 dependency boundary check |
| 目标实现仓是否已存在 | 当前未发现 | PH-01 开工前 blocker |
| P0 是否依赖真实 DB/bus/archive/observability/sync | 未依赖 | 真实产品进入 P1/P2 residual |
| fake 是否允许降低语义 | 不允许 | fake 必须覆盖 version/UoW/idempotency/outbox/report/redaction |
| profile 是否覆盖 P0 环境 | 通过 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` |
| artifact/report root 是否前置 | 通过 | PH-01 创建,PH-08 全量校验 |
| 外部依赖不可用处理是否明确 | 通过 | 编译期暂停;P0 fake fail;P1 residual |

### 7.8 跨配置 / 外部依赖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 依赖类型是否区分 compile/runtime/event/handoff/replay/test evidence | 通过 | 见 §7.1 |
| 是否存在非 core sibling compile dependency 风险 | 已前置阻断 | `dependency-boundary` check |
| 是否把 P1/P2 依赖伪装成 P0 必过 | 未发现 | selected-run 只 residual |
| 是否把 config 用于改变业务不变量 | 已阻断 | 配置不得改变 truth/state/query no-write/outbox/job boundary |
| 是否覆盖 PH-01~PH-08 依赖准备 | 通过 | 见 §7.4 |
| 是否覆盖 boundary 级依赖检查 | 通过 | 见 §7.5 |
| 是否覆盖不可用处理 | 通过 | 见 §7.6 |
| 是否需要回写 `03/04/05/06` | 当前无 | 本 Step 只承接已存在配置 / 测试 / 验收真相源 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“外部依赖准备表”“配置与环境检查表”“Fake / Controlled / Disabled / Replay 使用边界”“Phase 级准备矩阵”“Commit boundary 配置 / 依赖检查”和“环境不可用处理表”小节,了解实施前配置与依赖如何收敛。

正式 `07-实施计划.md` §8 应回填:

L1-artifact 的 P0 编译期依赖只允许 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。除 `L0-core` / `core-contracts` 外,work、process、governance、method-library、runtime/capability、conversation、archive、observability、sync、SDK、bus 和 external content source 不得成为 Cargo path dependency。它们只能通过 ref、safe summary、snapshot、event、adapter、handoff、replay 或 fake / controlled seam 协作。

目标实现仓 `/home/aris/Projects/quantalithos-artifact` 是 PH-01 开工前 blocker。若仓不存在,不得开始业务代码实现;若 core-contracts、Rust toolchain、P0 profile 或 artifact/report root 不可用,对应 boundary 必须暂停或 fail-fast,不得以 residual 伪装通过。

P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。`staging-like` 和 `production-like` 只属于 P1/P2 future direction,不作为 P0 pass 前置。P0 允许 fake / in-memory / controlled / disabled / replay-backed seam,但 fake 必须遵守正式 repository version、UoW、idempotency、receipt、outbox payload snapshot、projection stale、query no-write、job report、redaction 和 error mapping 语义。

实施前和各 phase 前必须检查 `runtime`、`stores`、`sourceResolvers`、`inboundConsumers`、`relay`、`jobs`、`handoff`、`boundary`、`idempotency`、`projection`、`reference`、`redaction`、`clockId`、`testFixtures` 等配置项族。invalid config、missing enabled topic、unsafe redaction、non-core sibling compile dependency、raw replay root、static report 或 missing artifact/report root 均为 blocking failure。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标实现仓创建方式 | 当前仅记录 blocker,不在设计仓直接创建 | PH-01 执行 |
| release `run_id` 命名规则 | 本 Step 不固定具体值 | Step 12 / PH-08 |
| real DB / bus / archive / observability / sync 产品 | P0 不锁定 | Step 9 risk / P1/P2 residual |
| replay artifact root 具体路径 | 本 Step 只要求 `operations-replay` 有 de-identified replay root | Step 9 / Step 12 继续收口 |
| future selected-run 是否引入 durable-like store | 当前不进入 P0 | Step 9 risk |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 外部依赖准备表完整 | 通过 | compile/runtime/event/handoff/replay/test evidence 已区分 |
| 配置与环境检查表完整 | 通过 | 14 个配置项族已覆盖 |
| fake / controlled / replay 使用边界明确 | 通过 | fake 不降低语义 |
| phase / boundary 级准备矩阵完整 | 通过 | PH-01~PH-08 与 20 个 commit boundary 已覆盖 |
| 不可用处理明确 | 通过 | blocking / degraded / residual 已区分 |
| 可进入 Step 9 | 待用户确认 | 下一步定义 Spike、风险与待确认事项 |
