# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填章节: `07-实施计划.md` §8 配置、环境与外部依赖准备

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义配置、环境与外部依赖准备 |
| 当前状态 | 进行中;按依赖类型分批写入 |
| 输入基线 | Step 3 前置检查;Step 5 phase;Step 6 boundary;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md` |
| 输出文件 | `projects/L1-governance/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` |
| 停审方式 | 用户已要求自动执行后续 Step;本 Step 完成后直接进入 Step 9 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 3 前置条件与阅读清单 | 已完成 | 提供目标仓、sibling repo、git config、目录命名、memory seed 检查 |
| Step 5 PH-01~PH-08 | 已完成 | 确定依赖在哪个 phase 使用 |
| Step 6 commit boundary | 已完成 | 确定依赖在哪个提交前必须准备 |
| `03-详细设计.md` §3/§4/§5 | 已存在 | 提供 Rust workspace、crate layout、唯一 core path dependency、外部 seam 约束 |
| `04-配置设计.md` §3~§7 | 已存在 | 提供 config control plane、profile、config item、adapter binding |
| `05-测试方案.md` §8/§9 | 已存在 | 提供测试环境、suite、artifact/report root 和 profile 用途 |

## 3. SOP 问题回答

1. 哪些外部服务或仓是实施前置依赖。

   回答: 编译期前置依赖只有 `/home/aris/Projects/quantalithos-core` 中的 `core-contracts`。目标实现仓 `/home/aris/Projects/quantalithos-governance` 必须在 PH-01 开工前存在或创建。identity、process、work、artifact、method-library、runtime、conversation、observability、archive、bus、SDK、external GRC 均不是编译期前置依赖。

2. 哪些依赖只在特定阶段需要。

   回答: Config profile and fake runtime 在 PH-01 需要;context/input/gate/policy services 使用 in-memory stores in PH-02~PH-04;query/projection/trace stores in PH-05;consumer resolvers/publisher topics in PH-06;job replay/handoff/export targets in PH-07;release artifact/report roots in PH-08。

3. 哪些配置项必须在本地或 CI 环境准备。

   回答: `runtime.profile`、store bindings、resolver families、inbound consumer schema allowlist、outbox publisher topic map、jobs enabled kinds、handoff/archive/export target refs、external GRC disabled/default fake、redaction deny list、clock/id deterministic config、artifact/report roots。

4. 是否允许 fake / mock,允许到什么阶段为止。

   回答: P0 允许 fake / in-memory / controlled / disabled seam,并且它们是正式测试手段。fake 不允许跳过 version、state、receipt、outbox、marker、redaction 或 idempotency 语义。真实 DB/bus/search/object storage/external GRC 不作为 P0 必需前置。

5. 外部依赖不可用时是暂停、降级还是替代。

   回答: 编译期 core dependency 或目标仓不可用则暂停。P0 fake/controlled dependency 不可用则测试失败。P1/P2 real-like/production-like 不可用只记录 residual,不得计 P0 pass。runtime resolver/publisher/handoff failure 在正式场景下返回 degraded/delayed/failed marker/report,不改写 core truth。

6. 哪些依赖需要由其他团队或仓提供。

   回答: P0 只需要 core-contracts。其他相邻仓提供 runtime/event/ref/snapshot/handoff/export 语义,但 P0 通过 fake/controlled seam 验证,不要求对方实现仓参与编译。

7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在。

   回答: Step 3 检查确认 `/home/aris/Projects/quantalithos-core` 存在,目标 `/home/aris/Projects/quantalithos-governance` 当前未发现。PH-01 必须先创建或确认目标仓。

8. 哪些依赖是编译期依赖,Cargo 本地 path dependency 写法是否已经与详细设计一致。

   回答: 唯一编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。除 core 外,不得加入 sibling path dependency。

9. 哪些依赖是运行期依赖或事件协作依赖,应该使用 API / SDK / adapter / event / projection / fake,而不是 Cargo path dependency。

   回答: identity、process、work、artifact、method-library、runtime、conversation、observability、archive、external GRC、message bus、handoff target and export target 均是运行期 / 事件 / adapter / handoff / fake 协作依赖。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 3 | 已记录目标实现仓不存在 | 若不前置会阻塞 PH-01 | 本 Step 设为 PH-01 blocker |
| `03` §3 | 只说明唯一 core dependency | 需要落实到实施检查 | 本 Step 加入依赖准备表和失败处理 |
| `04` §6/§7 | 配置项很多 | 实施计划不能复制完整配置表 | 本 Step 只抽取实施前必须准备的配置和 phase 使用点 |
| `05` §9 | suite 依赖 artifact/report root | 需要转为目录准备 | 本 Step 固定 artifacts/reports 根目录 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 外部依赖 | 分散在架构 / 详细 / 配置 / 测试文档 | 按编译期、运行期、事件、handoff、test replay 分类 | 实施前可检查 |
| fake 使用 | 有配置口径 | 明确 fake 是 P0 正式 seam,但不得降低语义 | 防止 fake shortcut |
| 目标仓 | 仅在 Step 3 记录 | PH-01 blocker | 防止移交时找不到仓 |
| P1/P2 依赖 | 容易被误当 P0 | 明确 residual / selected-run,不计 P0 pass | 防止伪通过 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 将相邻仓全部作为 Cargo path dependency | 编译期类型直接可用 | 违反架构红线和 VF-GOV-010 | 不采用 |
| 仅 core-contracts 作为编译期依赖 | 边界清楚 | 需要 contracts DTO / ref / fake seam | 采用 |
| P0 要求真实 DB/bus/external GRC | 接近生产 | 产品未锁定且阻塞 P0 | 不采用 |
| P0 使用 fake/controlled/disabled seam | 可自动化且可复现 | 不能证明真实产品行为 | 采用,真实产品列 P1/P2 residual |

## 7. 结构化中间产物

### 7.1 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-governance` | repo | 目标实现仓 | PH-01~PH-08 | 本项目 | `test -d`;`git status`;workspace check | PH-01 暂停,先创建或确认仓 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | repo/crate | 唯一编译期 sibling dependency | PH-01 起 | L0-core | path exists;Cargo dependency graph | 不可用则暂停 |
| Rust toolchain | tool | build/test dependency | PH-01 起 | local toolchain | `cargo check`;`cargo fmt --check` | 不可用则暂停 |
| in-memory truth stores | config/adapter | P0 runtime dependency | PH-02~PH-04 | governance-infra | runtime builder fake profile test | 不可用则测试失败 |
| projection / reference / trace stores | config/adapter | P0 runtime dependency | PH-05 起 | governance-infra | query/projection tests | 不可用则测试失败 |
| idempotency / result / report store | config/adapter | P0 runtime dependency | PH-02 起;job report PH-07 | governance-infra | duplicate replay tests | 不可用则暂停或测试失败 |
| identity actor capability resolver | adapter/event | runtime / event seam | PH-03/PH-06 | fake/controlled resolver | consumer/service tests | fake unavailable fails;real unavailable degraded/residual |
| process governance context resolver | adapter/event | runtime / event seam | PH-02/PH-06 | fake/controlled resolver | consumer/query tests | fake unavailable fails;real unavailable degraded/residual |
| work governance context resolver | adapter/event | runtime / event seam | PH-02/PH-06 | fake/controlled resolver | consumer/query tests | fake unavailable fails;real unavailable degraded/residual |
| artifact evidence summary resolver | adapter/event | runtime / event seam | PH-04/PH-06 | fake/controlled resolver | redaction and consumer tests | unavailable -> degraded/failed marker |
| method policy / control resolver | adapter/event | runtime / event seam | PH-04/PH-06 | fake/controlled resolver | policy/control/consumer tests | unavailable -> delayed/degraded |
| runtime signal resolver | adapter/event | runtime / event seam | PH-06 | fake/controlled resolver | consumer tests | unavailable -> delayed/degraded |
| conversation context resolver | adapter/event | runtime / event seam | PH-06 | fake/controlled resolver | consumer tests | unavailable -> delayed/degraded |
| observability alert resolver | adapter/event | runtime / event seam | PH-06 | fake/controlled resolver | consumer/redaction tests | unavailable -> delayed/degraded |
| fake publisher / topic map | adapter/config | P0 runtime dependency | PH-06~PH-08 | governance-infra | topic map check;outbox publisher tests | missing enabled topic fail-fast |
| handoff / archive target | adapter/config | P0 fake/controlled handoff seam | PH-07~PH-08 | governance-infra | handoff/export tests | disabled target rejected/failed marker |
| external GRC export target | adapter/config | P0 disabled/fake seam;P1 real-like | PH-07~PH-08 | governance-infra;future external provider | config redline;export tests | P0 disabled allowed;enabled missing fail-fast/reject |
| artifact/report root | filesystem | test evidence dependency | PH-01~PH-08 | implementation repo | script dry-run;report audit | missing path blocks gate/report |
| release run id | entry-local parameter | evidence identity | PH-08 | release gate caller | release script argument validation | missing/invalid blocks release gate |

### 7.2 配置与环境检查表

| 配置 / 环境项 | 使用阶段 | 检查方式 | 失败处理 |
|---|---|---|---|
| `runtime.profile` | PH-01 起 | config parse smoke;profile matrix test | unknown profile fail-fast |
| `runtime.adapterMode` | PH-01 起 | config redline | unsupported mode fail-fast |
| `runtime.strictValidation` | PH-01 起 | config redline | false or invalid P0 profile fail-fast |
| `stores.*.kind/configRef` | PH-02 起 | runtime builder tests | missing/unsupported fail-fast |
| `externalResolvers.families[]` | PH-03/PH-04/PH-06 | resolver registry tests | missing required family fail-fast |
| `inboundConsumers.supportedSchemaVersion` | PH-06 | consumer version tests | unsupported version rejected/dead-letter |
| `outbox.transportTopicBindings` | PH-06 | topic map verification | enabled event key missing fail-fast |
| `jobs.enabledKinds[]` | PH-07 | jobs registry tests | unknown kind fail-fast |
| `handoff.traceTargets[]` / `archiveTargets[]` | PH-07 | handoff target validation | missing target rejects job |
| `externalGrc.enabled/adapterRef/targetRef` | PH-07 | config redline/export tests | disabled allowed;enabled missing fail-fast |
| redaction deny list / metric label policy | PH-01 起;full PH-08 | redaction-boundary | scan failure blocks |
| deterministic clock/id | PH-01 起 | fixture/run determinism tests | missing fixture fails tests |
| artifact/report roots | PH-01 起 | script dry-run;report audit | missing root blocks scripts |

### 7.3 Fake / Controlled / Disabled 使用边界

| Seam | P0 允许模式 | 不允许 | 使用阶段 |
|---|---|---|---|
| repository / UoW | in-memory fake with version/UoW semantics | 跳过 optimistic version、rollback、commit unknown | PH-02 起 |
| idempotency/result/report | fake store with duplicate replay semantics | duplicate 直接重跑 mutation | PH-02 起;job PH-07 |
| source resolver | fake or controlled safe snapshot | 返回 external body or raw secret | PH-03/PH-04/PH-06 |
| consumer input | fake event fixture with schema version | unsupported version 仍解析 payload | PH-06 |
| outbox publisher | fake publisher with topic map and retry failure injection | publish 时从 current truth 重算 payload | PH-06 |
| handoff/archive | fake/controlled target with partial failure | handoff/export 写 core truth | PH-07 |
| external GRC | disabled by default;controlled fake export when enabled in tests | external GRC 定义 Governance truth | PH-07 |
| report generator | local script from raw artifacts | 静态 JSON or hand-written pass | PH-08 |

### 7.4 Phase 级准备矩阵

| Phase | 开工前必须确认 | 可后置准备 | 不可用处理 |
|---|---|---|---|
| PH-01 | 目标实现仓、core path dependency、Rust toolchain、git config、workspace naming、artifact/report roots | 真实 adapter、durable stores | 目标仓/core/toolchain 不可用则暂停 |
| PH-02 | in-memory truth/idempotency/result store、fixed clock/id、context/input config profile | gate/decision/policy resolvers | fake store 不可用则测试失败;设计缺口则暂停 |
| PH-03 | actor capability resolver fake、context/input repository、decision/approval store | policy/control/compliance resolvers | resolver fake 缺失阻断 service tests |
| PH-04 | method policy/control resolver fake、artifact evidence summary fake、redaction deny list | query/API/event/job entry | redaction or resolver boundary failed 阻断 |
| PH-05 | projection/reference/trace stores、visibility policy input、query profile | event consumers/outbox publisher | query store or visibility source 缺失则暂停/回写设计 |
| PH-06 | inbound consumer schema allowlist、resolver families、topic map、fake publisher、outbox store | public operations job DTO | topic missing fail-fast;consumer/publisher fake 缺失阻断 |
| PH-07 | job registry、report store、replay root, handoff/archive/export fake targets | release run final reports | report store/scope target 缺失阻断 job boundary |
| PH-08 | release run_id、artifact/report root、redaction/dependency/report audit scripts、acceptance report templates | P1 selected-run | missing release evidence dependency blocks release gate |

### 7.5 Commit boundary 配置 / 依赖检查

| Commit boundary | 必查配置 / 依赖 | 检查方式 | 失败处理 |
|---|---|---|---|
| commit-01-a | target repo, workspace, core path dependency, Rust toolchain | `cargo check`;dependency boundary | 暂停或修正 workspace |
| commit-01-b | config profiles, script roots, artifact/report directories | config smoke;script dry-run | 修正 profile or script |
| commit-02-a | context/input refs do not require external body | contract tests | 回写 DTO if external body required |
| commit-02-b | in-memory repositories, UoW, idempotency/result store | service-flow-fast | 修正 fake semantics or design |
| commit-03-a/b/c | actor capability/context resolvers and decision stores | service-flow-fast | resolver missing -> design/infra fix |
| commit-04-a/b/c/d | method/evidence resolver fake and redaction config | contract/service/redaction | redaction failure blocks |
| commit-05-a/b/c | projection/reference/trace stores and visibility decision source | query no-write/visibility tests | missing source ->回写 design |
| commit-06-a/b | consumer schema allowlist and resolver registry | consumer tests | unsupported path or resolver missing blocks |
| commit-06-c/d | outbox record store, publisher adapter, topic map, retry config | outbox publisher tests | topic/version/payload source missing blocks |
| commit-07-a/b | job registry, stored report store, replay root, policy refs | operations-replay-core | missing report/scope source blocks |
| commit-07-c/d | handoff/archive/export target refs, external GRC disabled/fake config | handoff/export tests | disabled target expected;enabled missing fails |
| commit-08-a/b | run_id, artifact/report root, release scripts, acceptance templates | release gate/report audit | missing artifact/report blocks release |

### 7.6 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | P0 处理 | 是否可记 pass |
|---|---|---|---|
| target repo | `/home/aris/Projects/quantalithos-governance` 不存在 | PH-01 暂停,先创建或确认 | 否 |
| core-contracts | path 不存在或 Cargo 无法解析 | 暂停;不得改为 vendored copy | 否 |
| local / CI Rust toolchain | `cargo check` 无法运行 | 暂停环境修复 | 否 |
| in-memory fake store | fake store 构造或 version/UoW 语义失败 | suite failed | 否 |
| fake resolver | required P0 resolver family missing | runtime builder fail-fast or test failed | 否 |
| controlled resolver unavailable | 预期 unavailable 场景 | 返回 degraded/delayed marker and report | 仅预期场景可通过 |
| topic map missing | enabled outbound event key 无 binding | startup fail-fast | 否 |
| fake publisher failure | 注入 retryable/permanent failure | 标 failed/dead-letter/report,不改 truth | 预期场景可通过 |
| handoff/export target disabled | job target disabled | job rejected/failed marker/report | 预期场景可通过 |
| external GRC disabled | P0 default disabled | core commands/jobs pass;export disabled/rejected | 是,限 disabled boundary |
| P1 real-like unavailable | selected-run 环境缺失 | residual/unavailable | 不计 P0 pass |
| artifact/report root missing | gate/report 无法写输出 | gate failed | 否 |

### 7.7 配置 / 环境停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 编译期依赖是否只有 core-contracts | 设计层通过 | PH-01 执行 dependency boundary check |
| 目标实现仓是否已存在 | 当前未发现 | PH-01 开工前 blocker |
| P0 是否依赖真实 DB/bus/external GRC | 未依赖 | 真实产品进入 P1/P2 residual |
| fake 是否允许降低语义 | 不允许 | fake 必须覆盖 version/UoW/idempotency/outbox/report |
| profile 是否覆盖 P0 环境 | 通过 | local-dev/ci-test/integration-like/operations-replay |
| artifact/report root 是否前置 | 通过 | PH-01 创建,PH-08 全量校验 |
| 外部依赖不可用处理是否明确 | 通过 | 编译期暂停;P0 fake fail;P1 residual |

### 7.8 跨配置 / 外部依赖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 依赖类型是否区分 compile/runtime/event/handoff/test replay | 通过 | 表 7.1 已区分 |
| 是否存在非 core sibling compile dependency 风险 | 已前置阻断 | dependency-boundary check |
| 是否把 P1/P2 依赖伪装成 P0 必过 | 未发现 | P1 selected-run 只 residual |
| 是否把 config 用于改变设计不变量 | 已阻断 | 禁止配置化 truth/state/query no-write/outbox source |
| 是否覆盖 PH-01~PH-08 依赖准备 | 通过 | 表 7.4 |
| 是否覆盖 boundary 级依赖检查 | 通过 | 表 7.5 |
| 是否覆盖不可用处理 | 通过 | 表 7.6 |

## 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §8。正式装配时应避免复制 `04-配置设计.md` 的完整配置项表,只保留实施前和阶段前必须准备的配置 / 环境 / 外部依赖。

### 8.1 实施前置依赖

P0 编译期依赖只允许:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

除 `L0-core` / `core-contracts` 外,identity、process、work、artifact、method-library、runtime、conversation、observability、archive、bus、SDK 和 external GRC 不得成为 Cargo path dependency。它们只能通过 ref、safe summary、snapshot、event、adapter、handoff、export target 或 fake / controlled seam 协作。

目标实现仓 `/home/aris/Projects/quantalithos-governance` 是 PH-01 开工前 blocker。若仓不存在,不得开始业务代码实现。

### 8.2 P0 Profile and Fake Boundary

P0 profile 为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。`staging-like` and `production-like` 不作为 P0 必过 profile。

P0 允许 fake / in-memory / controlled / disabled seam,但 fake 必须遵守正式 repository version、UoW、idempotency、receipt、outbox payload snapshot、projection stale、job report、redaction 和 error mapping 语义。fake 不得把失败静默改成 success,不得保存外部正文,不得绕过正式状态迁移。

### 8.3 Phase Dependency Summary

| Phase | 必备环境 / 配置 | 不可用处理 |
|---|---|---|
| PH-01 | target repo, core dependency, toolchain, config/script roots | 暂停 |
| PH-02~PH-04 | in-memory stores, idempotency/result stores, fixed clock/id, required resolvers | suite failed or design回写 |
| PH-05 | projection/reference/trace stores, visibility source | query boundary 暂停 |
| PH-06 | consumer schema allowlist, resolver registry, topic map, fake publisher | startup/test fail-fast |
| PH-07 | job registry, report store, replay root, handoff/export targets | job boundary 暂停 |
| PH-08 | release run_id, artifact/report roots, report generators, acceptance templates | release gate failed |

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标实现仓创建方式 | 当前仅记录 blocker,不在设计仓直接创建 | PH-01 执行 |
| release run_id | 本 Step 不固定具体值 | PH-08 / Step 12 |
|真实 DB/bus/search/object storage 产品 | P0 不锁定 | P1/P2 risk |
| external GRC vendor | P0 disabled/fake;真实 vendor 留后续 | Step 9 risk |
| config CLI / env key 最终参数 | 以 `04-配置设计.md` 为准;若缺失则 PH-01 前回写配置设计 | Step 10 pause rule |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 关键外部依赖已列出 | 通过 | 表 7.1 |
| 编译期 / 运行期 / 事件 / handoff 依赖已区分 | 通过 | non-core 不得 compile dependency |
| 配置与环境检查方式明确 | 通过 | 表 7.2 / 7.5 |
| fake / controlled / disabled 边界明确 | 通过 | 表 7.3 |
| 外部依赖不可用处理明确 | 通过 | 表 7.6 |
| 跨依赖审计无 unresolved 冲突 | 通过 | 目标仓不存在作为 PH-01 blocker |
| 可进入 Step 9 | 通过 | 下一步定义 Spike、风险与待确认事项 |
