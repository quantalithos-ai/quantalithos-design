# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填章节: `07-实施计划.md` §8 配置、环境与外部依赖准备
> 当前模块: `R8.2 config environment dependencies:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义配置、环境与外部依赖准备 |
| 当前模块 | `R8.2 config environment dependencies:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | Step 3 前置阅读;Step 5 phase;Step 6 candidate boundary;Step 7 gate;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md` |
| 停审方式 | 用户已确认 Step 8,允许进入 Step 9 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 3 前置条件 | completed_confirmed | 提供目标实现仓、git config、旧 layout、sibling repo 和恢复顺序检查 |
| Step 5 PH-01~PH-11 | completed_confirmed | 确定配置 / 环境 / 外部依赖在哪个 phase 前必须准备 |
| Step 6 commit-01-a~commit-11-b | completed_confirmed | 将依赖准备落到 boundary 级 required checks / required reads |
| Step 7 gate matrix | completed_confirmed | 绑定 config-redline、dependency-boundary、redaction、report audit 和 artifact/report 输出 |
| `03-详细设计.md` §3~§4 / §13 / §16 | 已读取 | 提供七 crate layout、only `core-contracts` 编译期依赖、runtime adapter 和 handoff 边界 |
| `04-配置设计.md` §3~§12 | 已读取 | 提供 profile、config source、adapter binding、secret/redaction、fail-fast/degraded 和 downstream handoff |
| `05-测试方案.md` §6 / §9 / §13 | 已读取 | 提供 P0 suite、profile、run-scoped artifact/report 和 EV-ML 证据族 |
| `06-验收标准.md` §2~§11 | 已读取 | 提供 AC/VETO、evidence baseline、dependency/redaction/config/report 验收红线 |
| L1-governance Step 8 | framework_reference | 只参考“依赖准备表 / profile 表 / fake 边界 / phase 矩阵 / 停审记录”结构,不得复制 governance 领域事实 |

## 3. SOP 问题回答

1. 哪些外部服务或仓是实施前置依赖。

   回答: P0 编译期 sibling dependency 只允许 `/home/aris/Projects/quantalithos-core` 下的 `core-contracts`。目标实现仓是 `/home/aris/Projects/quantalithos-method-library`。`quantalithos-bus`、process、identity、runtime、member-images、artifact/archive、observability、governance、capability-hub、marketplace、console、external provider 只能作为 runtime / event / adapter / handoff / fake / controlled / disabled seam,不得成为 Cargo path dependency。

2. 哪些依赖只在特定阶段需要。

   回答: PH-01 需要目标仓、toolchain、workspace layout、core dependency、config/script/artifact/report root。PH-02~PH-07 需要 in-memory/fake stores、resolver / source / handoff seams 和 body-free redaction。PH-08 需要 read material / projection / query profile。PH-09 需要 inbound/outbound registry、topic-neutral binding 和 fake publisher。PH-10 需要 job registry、checkpoint/report/replay root 和 handoff/export target。PH-11 需要 release run_id、report generator、evidence index、VETO/handoff 模板。

3. 哪些配置项必须在本地或 CI 环境准备。

   回答: 必须准备 `local-dev`、`ci-test`、`integration-like`、`operations-replay` P0 profile 方向,以及 `runtime.*`、`stores.*`、`externalResolvers.*`、`inboundConsumers.*`、`outbox.*`、`jobs.*`、`handoff.*`、`externalGrc.*`、`redaction.*`、`boundary.*`、`clockId.*`、`testFixtures.*`、artifact/report root 和 run_id 输入方向。Step 8 只定义准备要求,不新增 key/env/schema。

4. 是否允许 fake / mock,允许到什么阶段为止。

   回答: P0 允许 fake / in-memory / controlled / disabled seam,并且这些 seam 是正式测试手段。fake 不得降低语义:必须保留 version、UoW、stored replay、marker source、topic-neutral event、handoff outcome、job report、redaction 和 query no-write 约束。真实 DB/bus/provider/secret backend 不作为 P0 必需前置。

5. 外部依赖不可用时是暂停、降级还是替代。

   回答: 目标仓、core path dependency、Rust toolchain、P0 required config、artifact/report root 不可用时暂停或 gate failed。runtime resolver / publisher / handoff target 不可用时按正式 flow 返回 unavailable / degraded / delayed / failed marker 或 report issue,不得改写 truth。P1 real-like selected-run 不可用只进入 residual,不得计 P0 pass。

6. 哪些依赖需要由其他团队或仓提供。

   回答: P0 只要求 L0-core 的 `core-contracts` 作为编译期基础。其他相邻仓只提供未来真实运行协作方向;P0 通过本仓 fake / controlled / disabled seam 证明协议和边界,不要求对方实现仓参与编译或运行。

7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在。

   回答: 目标实现仓 `/home/aris/Projects/quantalithos-method-library` 已存在,但当前 layout 仍是旧形态:workspace member 为 `crates/method_library_*`,没有 `crates/jobs`,README 仍提 snapshot/outbox/PostgreSQL。PH-01 / commit-01-a 必须先迁移到 `03` 要求的 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`。

8. Cargo 本地 path dependency 写法是否已经与详细设计一致。

   回答: 正式方向是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`,实施时必须重新核对目标仓相对路径、package 名和 lib crate 名。除 `core-contracts` 外,不得加入 sibling path dependency。

9. 哪些依赖应使用 API / SDK / adapter / event / projection / fake。

   回答: bus、process、identity、runtime、member-images、artifact/archive、observability、governance、capability-hub、marketplace、console、external provider、handoff/export target 都必须通过 ref、safe summary、adapter、event、projection/material、fake、controlled seam 或 disabled branch 协作。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | boundary 有任务和 checks,但未统一依赖准备 | 实现 agent 可能开工后才发现 config / repo / path 缺失 | 本 Step 建 phase / boundary 准备矩阵 |
| Step 7 | gate 已绑定 suite / evidence | 缺 gate 前置环境说明会导致 evidence 无法生成 | 本 Step 固定 artifact/report root 和 profile 准备 |
| 旧实现仓 | 当前 layout 与正式 `03` 不一致 | 若直接开发会沿旧 crate / snapshot / outbox 方向前进 | PH-01 / commit-01-a 设为 layout migration blocker |
| `04` | 配置项很多 | 实施计划不能重写完整 config schema | 只抽取实施前必备 profile、binding 和 redline |
| P1/P2 真实依赖 | 容易被误当 P0 前置 | P0 被真实外部系统阻塞或伪 pass | 明确 fake/controlled/disabled 是 P0 seam,真实 selected-run 只 residual |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 外部依赖 | 分散在 `03/04/05/06` | 按 compile / runtime / event / handoff / test replay 分类 | 实现开工前可检查 |
| profile | 只在配置设计中定义 | 映射到 phase、boundary 和 required checks | 防止 config gate 后补 |
| fake seam | 只说明允许 | 明确 fake 不能跳过正式语义 | 防止测试捷径 |
| 目标仓现状 | Step 3 已记录 | commit-01-a 明确迁移旧 layout | 防止沿旧实现继续 |
| evidence root | Step 7 定义路径 | Step 8 设为 PH-01 准备项 | 防止 PH-11 才发现报告路径缺失 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有相邻仓写成 Cargo path dependency | 类型直接可用 | 违反 dependency boundary 和 VETO-ML-012 | 不采用 |
| 只允许 `core-contracts` 编译期依赖 | 边界清楚,便于 dependency audit | 需要 fake / adapter / DTO 承接运行协作 | 采用 |
| P0 依赖真实 DB / bus / provider | 接近生产 | 产品未锁定且阻塞 P0 | 不采用 |
| P0 使用 fake / controlled / disabled seam | 可复现、可自动化、能保留边界语义 | 不能证明真实 provider 行为 | 采用,真实 provider 进入 P1/P2 selected-run |
| Step 8 创建真实 implementation ledger | 看似提前闭环 | Step 11/12 尚未固定 commit / handoff 纪律 | 不采用 |

## 7. 结构化中间产物

### 7.1 外部依赖准备表

| 依赖项 | 类型 | 使用阶段 | 检查方式 | 不可用处理 |
|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-method-library` | target repo | PH-01 起 | path exists;git status;workspace audit | PH-01 暂停或先修 layout |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | compile dependency candidate | PH-01 起 | path/package/lib 名核对;dependency-boundary | 不可用则暂停 |
| Rust toolchain / Cargo | toolchain | PH-01 起 | fmt/check/test gate | 不可用则暂停环境修复 |
| `local-dev` / `ci-test` profile | P0 profile | PH-01 起 | config smoke;fixture parse | invalid profile fail-fast |
| `integration-like` profile | P0 controlled seam | PH-03 起 | controlled adapter/failure mapping tests | fake/controlled seam 缺失则 gate failed |
| `operations-replay` profile | P0 job/replay profile | PH-10 起 | job-run-start / replay root validation | missing input -> job rejected/gate failed |
| in-memory / fake repositories | P0 runtime seam | PH-02 起 | infra-runtime-fake;service-flow-fast | 不得跳过 version/UoW |
| external resolver / source adapters | runtime seam | PH-03~PH-07 | resolver registry tests;redaction | unavailable -> formal degraded/delayed/rejected |
| inbound / outbound / publisher seam | event seam | PH-09 起 | entry-worker-job;topic-neutral binding | topic missing fail-fast;failure 不回滚 truth |
| handoff / export / report target | handoff seam | PH-10~PH-11 | operations-replay;report audit | disabled/failure 进入 safe report |
| artifact/report roots | evidence dependency | PH-01 起;PH-11 full | path dry-run;report-generation-audit | missing root blocks gate |

### 7.2 配置与环境检查表

| 配置 / 环境族 | 使用阶段 | 检查方式 | 失败处理 |
|---|---|---|---|
| `runtime.*` | PH-01 起 | strict profile / readiness validation | invalid fail-fast |
| `stores.*` / material store binding | PH-02 起;PH-08 起 | runtime builder;logical store completeness | required missing fail-fast |
| `externalResolvers.*` | PH-03 起 | family uniqueness;mode/profile compatibility | missing required family fail-fast |
| `inboundConsumers.*` | PH-09 起 | schema/version allowlist;dedup retention | unsupported rejected,no parse/no write |
| `outbox.*` | PH-09 起 | publisher ref;topic-neutral route coverage | enabled route missing fail-fast |
| `jobs.*` | PH-10 起 | job kind enum;batch/retry/retention validation | invalid startup fail-fast or job rejected |
| `handoff.*` / `externalGrc.*` | PH-10~PH-11 | target ref;enabled conditional required | enabled missing fail-fast/job rejected |
| `redaction.*` / `boundary.*` | PH-01 起 | redaction-boundary;body-free check | unsafe fail-closed |
| `clockId.*` / `testFixtures.*` | PH-01 起 | deterministic fixture profile validation | invalid fixture test fail-fast |
| artifact/report roots and run_id | PH-01 起;PH-11 full | dry-run;report audit;no latest | missing/invalid blocks evidence |

### 7.3 Fake / Controlled / Disabled 使用边界

| Seam | P0 允许模式 | 不允许 | 使用阶段 |
|---|---|---|---|
| repository / UoW | in-memory fake with version and rollback semantics | 半提交、无 expected version、rollback 后可见 accepted truth | PH-02 起 |
| idempotency / stored result | fake store with duplicate replay semantics | duplicate 直接重跑 mutation | PH-02 起 |
| resolver / external source | fake or controlled safe summary | raw external body、provider response body、synthetic marker | PH-03~PH-07 |
| query material | fake material store with formal freshness/degraded marker source | query-time repair/backfill/core truth write | PH-08 起 |
| inbound consumer | fake event fixture with schema/version/dedup | unsupported payload 仍解析或写 truth | PH-09 起 |
| outbound publisher | fake publisher with outcome and retry failure injection | publish failure rollback accepted truth | PH-09 起 |
| job runner | controlled job harness with checkpoint/report store | job 修 core truth、lease-as-truth | PH-10 起 |
| report generator | local generation from raw artifact | static JSON、hand-written pass、`latest` | PH-11 |

### 7.4 Phase 准备矩阵

| Phase | 开工前必须确认 | 可后置准备 | 不可用处理 |
|---|---|---|---|
| PH-01 | target repo、旧 layout 审计、core path、toolchain、artifact/report root | 真实 adapter / durable store | 暂停或修 layout |
| PH-02 | contracts/domain/application foundation config、fake store、fixed clock/id | business resolver | gate failed |
| PH-03 | definition/catalog repository fake、source boundary fixture | formalization/version config | design gap 或 gate failed |
| PH-04 | formalization/version state/replay store | distribution / publisher | gate failed |
| PH-05 | consumption/distribution availability seam、handoff shell fake | worker publisher | unavailable 按 formal marker |
| PH-06 | trace/audit/impact stores、redaction profile | report generator full | redaction leak blocks |
| PH-07 | external summary body-free adapter、peripheral residual marker | marketplace / real provider | provider real-like residual only |
| PH-08 | query material store、projection/read profile、no-write guard | refresh jobs | missing marker source -> design stop |
| PH-09 | consumer schema allowlist、topic-neutral binding、fake publisher | real bus | topic missing fail-fast |
| PH-10 | job registry、checkpoint/report store、replay root、handoff target | release signoff | job rejected/failed report |
| PH-11 | fixed run_id、report generators、redaction/dependency/config/report audit、acceptance templates | P1 selected-run | release gate failed |

### 7.5 Commit Boundary 配置 / 依赖检查

| Boundary | 必查配置 / 依赖 | 检查方式 | 失败处理 |
|---|---|---|---|
| commit-01-a | target repo layout、core path dependency、package/crate naming | workspace audit;dependency-boundary seed | 不提交,先迁移 layout |
| commit-01-b | config skeleton、profile fixtures、artifact/report dirs | config smoke;path dry-run | 修 profile/path |
| commit-02-a~02-c | fake store、UoW、idempotency/result shell | contract/domain/application checks | schema/port 缺口回设计 |
| commit-03-a~04-b | definition/catalog/formalization stores and replay source | contract-domain-fast;service-flow-fast | truth/state/replay 缺口阻断 |
| commit-05-a~05-b | consumption/distribution availability and handoff fake | service-flow-fast;infra-runtime-fake | downstream truth 或 marker 缺口阻断 |
| commit-06-a~07-b | trace/audit/external body-free and peripheral residual seam | redaction-boundary;service-flow-fast | raw body 或 peripheral blocker 阻断 |
| commit-08-a~08-c | query material stores、freshness/degraded marker source | query no-write;infra-runtime-fake | source missing stop |
| commit-09-a~09-b | consumer schema、topic-neutral route、publisher fake | entry-worker-job;redaction | topic/payload/source 缺口阻断 |
| commit-10-a~10-c | job registry、checkpoint/report/replay root、handoff target | operations-replay-core | job truth repair 或 report 缺口阻断 |
| commit-11-a~11-b | run_id、report generator、acceptance templates、audit scripts | report-generation-audit;release-main-smoke | static evidence/VETO/report gap 阻断 |

### 7.6 目标实现仓 layout 迁移准备

| 当前实现仓现状 | 正式目标 | 处理 boundary |
|---|---|---|
| `crates/method_library_contracts` 等旧命名 | `crates/contracts` / package `method-library-contracts` / crate `method_library_contracts` | commit-01-a |
| 当前无 `crates/jobs` | 增加 `crates/jobs` / `method-library-jobs` | commit-01-a |
| README 提 snapshot/outbox/PostgreSQL 主线 | README 改为当前 definition/formalization/consumption/trace/query/event/job/evidence 主线 | commit-01-a 或 commit-01-b |
| Cargo 依赖存在产品化 `sqlx` 等旧倾向 | PH-01 审计是否属于 P0 必需;非 P0 不得驱动设计 | commit-01-a dependency-boundary |
| 当前 reports 目录存在旧材料风险 | 只保留/迁移为 run-scoped reports 方向,不得作为 current evidence | commit-01-b |

### 7.7 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | P0 处理 | 是否可记 pass |
|---|---|---|---|
| target repo | 不存在或非 git workspace | PH-01 暂停 | 否 |
| core-contracts | path/package/lib 不匹配 | 暂停,不得 vendored copy | 否 |
| Rust toolchain | fmt/check/test 无法运行 | 环境修复后重试 | 否 |
| required config/profile | 缺失或非法 | fail-fast | 否 |
| fake repository / resolver | required P0 fake 缺失 | gate failed | 否 |
| controlled unavailable scenario | 预期不可用 | 返回 formal unavailable/degraded/delayed/failed | 仅预期场景可通过 |
| real provider / real bus | P1 selected-run 环境缺失 | residual/unavailable | 不计 P0 pass |
| artifact/report root | 无法写 raw artifact/report | gate failed | 否 |

### 7.8 配置 / 环境停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 编译期依赖是否只有 `core-contracts` | 设计层通过 | PH-01 执行 dependency-boundary |
| 目标实现仓是否存在 | 已存在但 layout 旧 | commit-01-a 迁移 |
| 是否依赖真实 DB / bus / provider | 不作为 P0 依赖 | P1/P2 selected-run residual |
| fake 是否可降低语义 | 不可 | fake 必须覆盖 version/UoW/idempotency/marker/report/redaction |
| P0 profile 是否明确 | 通过 | `local-dev`,`ci-test`,`integration-like`,`operations-replay` |
| artifact/report root 是否前置 | 通过 | PH-01 建路径;PH-11 全量 audit |
| 是否创建真实 implementation ledger | 未创建 | 留到 Step 11/12/13 后实现移交前 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“外部依赖准备表”“配置与环境检查表”“Fake / Controlled / Disabled 使用边界”“Phase 准备矩阵”“Commit Boundary 配置 / 依赖检查”和“目标实现仓 layout 迁移准备”小节。

正式 `07-实施计划.md` §8 后续应回填:

P0 编译期 sibling dependency 只允许 `quantalithos-core` / `core-contracts`。除 `core-contracts` 外,任何 bus、process、identity、runtime、member-images、artifact/archive、observability、governance、capability-hub、marketplace、console 或 external provider 都不得进入 Cargo path dependency;这些关系只能通过 ref、safe summary、adapter、event、handoff、projection/material、fake、controlled seam 或 disabled branch 协作。

实施前必须准备 `local-dev`、`ci-test`、`integration-like`、`operations-replay` P0 profile 方向,并确保 required config、adapter slot、store binding、resolver family、topic-neutral route、job registry、handoff target、redaction rule、artifact/report root 和 run_id 输入在对应 phase 前可校验。invalid config、raw secret/body、forbidden invariant override、missing required store/topic/target 均不得 degraded 成成功。

目标实现仓 `/home/aris/Projects/quantalithos-method-library` 已存在,但当前 layout 属旧实现形态。PH-01 / commit-01-a 的第一职责是迁移 workspace、crate/package 命名和 `crates/jobs`,并清理旧 snapshot/outbox/PostgreSQL 主线对当前实施计划的影响。PH-01 / commit-01-b 再建立 config/profile、script shell、artifact/report root 和 path checks。

fake / in-memory / controlled / disabled seam 是 P0 正式测试手段,但不得降低正式语义。fake 必须保留 version、UoW、stored replay、marker source、query no-write、publisher outcome、job report、redaction 和 body-free 约束。真实 provider、真实 bus、durable store 和 production-like profile 只进入 P1/P2 selected-run 或 residual,不得替代 P0 controlled suite。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `core-contracts` package / lib 名是否与目标路径一致 | 影响 commit-01-a | 实现期开工前复核 |
| 旧实现仓 `sqlx` 等依赖是否保留 | 影响 dependency-boundary | commit-01-a 审计后决定,不得驱动设计 |
| config skeleton 的文件格式、目录和 CLI 名称 | 已由正式 `04-配置设计.md` §9 与正式 `07-实施计划.md` §3 / §6 / §8 闭口: `config/profiles/` 下四个 strict JSON 文件,CLI 固定为 `--config-profile`、`--run-id`、`--artifact-root`、`--report-root` | `commit-01-b` 可按 formal 口径实施,本 Step 不再保留 open question |
| release run_id 格式 | 影响 PH-11 evidence | Step 12 固定占位规则,执行期填真实 run_id |
| P1 real-like selected-run 范围 | 影响 residual | Step 9 风险与待确认事项记录 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Step 7 已确认 | 通过 | 用户已确认 |
| L1 Step 8 只作为框架参考 | 通过 | 未复制 governance 领域事实 |
| P0 编译期依赖边界已定义 | 通过 | only `core-contracts` |
| profile / config / fake seam 准备已定义 | 通过 | 对齐 `04` |
| phase / boundary 依赖准备已定义 | 通过 | 对齐 Step 5/6/7 |
| 目标实现仓旧 layout 风险已记录 | 通过 | commit-01-a 处理 |
| 未修改正式 `07` 或实现仓 | 通过 | 本 Step 只写设计中间产物 |
| 可进入 R8.2 / Step 9 | 通过 | 用户已确认,允许推进到 Step 9 |

## 11. R8.2 用户确认记录

| 确认项 | 结论 |
|---|---|
| 用户确认 | 已确认 |
| 确认输入 | `同意` |
| 确认范围 | Step 8 配置、环境与外部依赖准备中间产物 |
| 后续动作 | 推进到 Step 9 `R9.1 spikes risks open questions:先思考` |
| 限制 | Step 13 前仍不得修改正式 `07-实施计划.md`;不得创建真实 implementation ledger、boundary ledger、CI、脚本、代码或 evidence |
