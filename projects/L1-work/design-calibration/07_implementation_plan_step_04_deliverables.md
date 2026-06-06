# L1-work 07 实施计划 Step 4: 抽取实施对象与交付物

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §4 实施对象与交付物清单
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 抽取实施对象与交付物 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_04_deliverables.md` |

本步从详细设计、配置设计、测试方案和验收标准中抽取本轮实际交付的代码、接口、事件、job、adapter、配置、测试、脚本、证据和报告产物。本步不设计 phase 顺序,不拆 commit boundary,不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 Work truth center P0 闭环、`FR-WORK-001~008`、P0-supporting 最小切口和非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承目标仓、`core-contracts` path dependency、命名、scripts、artifacts、reports 和永久记忆前置规则 |
| `03-详细设计.md` §4~§16 | 已完成 | 抽取 workspace、crate、对象、trait、协议、处理流、状态、事务、配置、观测和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 抽取 `WorkRuntimeConfig`、profile、runtime graph、resolver / publisher / handoff、reports、redaction 和 failure modes |
| `05-测试方案.md` §4~§14 | 已完成 | 抽取测试分层、`TC-WORK-*`、`EV-WORK-*`、gate scripts、artifact、report、redaction 和回归要求 |
| `06-验收标准.md` §2~§11 | 已完成 | 抽取 `AC-WORK-*`、`VF-WORK-*`、P0 / P1 / P2、基线、准入准出、一票否决和证据裁决口径 |

校准来源:

- `design-calibration/03_ddd_step_04_file_layout.md`
- `design-calibration/03_ddd_step_05_module_contracts.md`
- `design-calibration/03_ddd_step_06_object_contracts.md`
- `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
- `design-calibration/03_ddd_step_08_protocol_contracts.md`
- `design-calibration/03_ddd_step_09_function_flows.md`
- `design-calibration/03_ddd_step_10_state_matrix.md`
- `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
- `design-calibration/03_ddd_step_12_error_recovery.md`
- `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
- `design-calibration/03_ddd_step_14_config_external_binding.md`
- `design-calibration/03_ddd_step_15_observability_audit.md`
- `design-calibration/03_ddd_step_16_test_cuts.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/04_config_step_06_profiles_matrix.md`
- `design-calibration/04_config_step_07_config_items.md`
- `design-calibration/04_config_step_08_sensitive_secrets.md`
- `design-calibration/04_config_step_11_failure_modes.md`
- `design-calibration/05_test_plan_step_06_cases_matrix.md`
- `design-calibration/05_test_plan_step_09_automation_gates.md`
- `design-calibration/05_test_plan_step_13_reports_evidence.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_06_data_architecture_redline.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`
- `design-calibration/06_acceptance_step_11_veto.md`

## 3. SOP 问题回答

### 3.1 本轮会新增或修改哪些代码模块?

本轮会在 `/home/aris/Projects/quantalithos-work` 新增 Rust 2024 workspace 多 crate 实现。代码模块包括 `contracts`、`domain`、`application`、`infra`、`api`、`worker` 和 `jobs`。这些模块对应 `03-详细设计.md` §4 / §5 的实现单元。

实施对象不按“把对象索引逐个落码”组织,而是按能证明 Work truth center P0 闭环的交付物组织。对象、trait、DTO 和状态只在其支撑 P0 交付物时进入本轮代码范围。

### 3.2 本轮会新增或修改哪些接口、事件、job 或 adapter?

本轮会交付:

- 18 个 Command 入口。
- 8 个 Query 入口。
- 7 个 Inbound Event Consumer。
- 10 个 Outbound Event payload。
- 6 个 Operations Job。
- repository / UnitOfWork / idempotency / resolver / publisher / handoff / projection / config / clock / id generator port。
- in-memory repository、fake resolver、fake publisher、fake handoff、deterministic clock / id 和 configured adapter ref 校验。

真实生产 DB / MQ / search / trace / archive 产品 adapter、真实跨仓端到端、Workspace UI、高级看板、容量分析、自动维护建议和生产 runbook 不在本轮交付范围。

### 3.3 本轮会新增哪些测试?

本轮会新增 unit、contract、service、integration、worker / job、config、redaction、release gate 和 evidence report 分层测试。测试族覆盖:

- `TC-WORK-CORE-001~004`
- `TC-WORK-MEMBER-001~004`
- `TC-WORK-FORMAL-001~005`
- `TC-WORK-PROMOTE-001~005`
- `TC-WORK-DEP-001~005`
- `TC-WORK-ITER-001~005`
- `TC-WORK-QUERY-001~008`
- `TC-WORK-OPS-001~006`
- `TC-WORK-CFG-001~017`
- `TC-WORK-NFR-001~005`

证据族覆盖 `EV-WORK-CORE-*`、`EV-WORK-MEMBER-*`、`EV-WORK-FORMAL-*`、`EV-WORK-PROMOTE-*`、`EV-WORK-DEP-*`、`EV-WORK-ITER-*`、`EV-WORK-QUERY-*`、`EV-WORK-OPS-*`、`EV-WORK-CFG-*` 和 `EV-WORK-NFR-*`。

### 3.4 本轮会产生哪些配置、迁移、种子数据或文档同步?

本轮会产生:

- `WorkRuntimeConfig` loader / validator / runtime builder。
- `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile fixtures。
- in-memory store、fake adapter、configured ref、deterministic clock / id 和 redaction fixtures。
- run-scoped test data、seed builders 和 sanitized snapshots。
- gate / check / report scripts。
- `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` / `reports/acceptance` 结构。

当前 P0 不要求数据库 migration。若实现中存在状态初始化,应作为 in-memory store、fixture、local state root 或 test seed 处理,不得伪造生产迁移完成。

### 3.5 哪些上游设计对象本轮不交付?

不交付以下能力或对象:

- `FR-WORK-E01~E05` 的产品级增强能力:高级看板、多视图偏好、自动维护建议、容量趋势、项目工具能力治理协同、跨项目依赖理解。
- 真实生产 DB / MQ / search / trace / archive adapter 和 deployment topology。
- config center、hot reload、admin override、secret provider / KMS / Vault 产品接入。
- workspace 产品体验、conversation 正文、process 正文、governance 决策正文、artifact / evidence 正文、runtime progress / ImplementationPlan 正文。
- production SLO、容量阈值硬化、on-call runbook 和 production-like 全量跨仓验收。

这些可以作为 P1 / P2、风险接受或后续专项输入,但不得成为本轮 P0 DTO 必填字段、P0 gate、P0 配置必填项或 P0 通过条件。

### 3.6 哪些交付物跨仓或依赖外部模块?

编译期跨仓依赖只有 `/home/aris/Projects/quantalithos-core/crates/contracts` 的 `core-contracts` path dependency。其他相邻仓只通过 port、adapter、event、snapshot、handoff、query 或 fake seam 协作,不作为 Cargo dependency。

跨仓或外部相关交付物包括:

- identity member / actor resolver seam。
- conversation work context consumer seam。
- method definition resolver seam。
- process timebox / timing resolver seam。
- governance decision resolver seam。
- artifact evidence resolver seam。
- runtime promote request consumer seam。
- bus publisher / outbox seam。
- observability / archive handoff seam。
- workspace / SDK 下游 query / event surface。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物尚未集中列出 | `03` 写实现契约,`04` 写配置,`05` 写测试证据,`06` 写验收门禁 | 后续阶段拆分缺少清晰交付边界 | 统一抽成实施对象、交付物、非交付物和跨仓依赖清单 |
| 详细设计对象很多 | `03` §6~§8 对象、trait、协议完整 | 直接搬运会导致按对象实施 | 只抽取支撑 P0 闭环的可判定交付物 |
| P0-supporting 容易被误后置 | projection、reference refresh、outbox、reconciliation、reports 是支撑边界 | 主闭环无法验收或证据缺失 | 明确列入交付物和测试证据 |
| scripts / reports 容易后补 | `05` / `06` 均要求 artifacts、reports、redaction 和 evidence index | 最终证据不可审计 | 作为正式交付物列入 |
| 真实外部 adapter 容易膨胀 | 生产 DB / MQ / trace / archive 很容易被误纳入 P0 | 延误第一批实现并破坏范围 | 写入非交付物清单,本轮只交付 port + fake / in-memory |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 交付物口径 | 分散在 `03/04/05/06` | 按 code / api / event / job / adapter / config / test / evidence / report 分组 | 让实施对象可检查、可验收 |
| 实施对象来源 | 容易等同于对象索引 | 只抽取 P0 闭环需要交付的对象和模块 | 防止按对象排任务 |
| P0-supporting | 可能被误读为后置增强 | projection、reference、outbox、reconciliation、reports 进入最小可验收切口 | 符合 `06` 验收标准 |
| 测试交付 | 可能被视为后置动作 | 测试 suite、gate、artifact、report 作为交付物 | 符合可验证增量原则 |
| 外部依赖 | 可能被误写成真实跨仓前置 | 编译期只依赖 core;运行期和事件协作用 fake / fixture / boundary | 保持 P0 可独立实现 |
| 非范围 | 散落在上游章节 | 集中列为非交付物 | 防止 P1 / P2 能力污染 P0 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 列交付物 | 易对应文件布局 | 容易忽视 API、event、job、test、report 等横切交付 | 不单独采用 |
| 按 P0 功能闭环列交付物 | 能对应需求和验收 | 需要额外标注预计落点 | 采用为主组织方式 |
| 把真实 DB / MQ / trace / archive adapter 作为交付物 | 更接近生产 | 与 P0 fake / in-memory 默认可验证路径冲突 | 不采用 |
| 交付 port + in-memory / fake adapter | 可独立测试和验收 | 生产 adapter 风险后置 | 采用 |
| 只交付代码,测试和报告后补 | 编码启动快 | 无法通过 `06` 证据和验收门禁 | 不采用 |
| 测试、脚本、artifact、report 同列交付物 | 每阶段可验证 | 初始交付物清单更长 | 采用 |

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 本轮口径 | 完成判定 |
|---|---|---|---|---|
| Rust workspace 多 crate 骨架 | code | `03` §4 | 建立 `contracts / domain / application / infra / api / worker / jobs` 边界 | workspace 可编译,依赖方向不反转 |
| `work-contracts` | code | `03` §6~§8 | typed ref、state / reason、Command / Query / Event / Job / View / Error DTO、fixtures | DTO roundtrip、required field、domain-only type absent tests 通过 |
| `work-domain` | code | `03` §5 / §6 / §9 / §10 | Project、ProjectMember、Backlog、WorkItem、ChildWorkItem、dependency、blocker、Iteration、PromoteResult、reference / trace / outbox、policy | domain unit、状态机、invariant 和 forbidden body tests 通过 |
| `work-application` | code | `03` §7 / §9 / §11~§13 | command / query / consumer / job service、port trait、UoW、idempotency、error mapping | service tests 验证事务顺序、幂等、rollback 和副作用 |
| `work-infra` | code / config | `03` §5 / §11 / §13~§15、`04` | in-memory store、repository adapter、projection store、resolver、publisher、handoff、config、runtime builder、clock / id、observability | integration、config、redaction 和 adapter tests 通过 |
| `work-api` | code / binary | `03` §7~§9 | synchronous Command / Query handler、DTO mapper、error mapping、route assembly | API validation、error mapping、query no-write tests 通过 |
| `work-worker` | code / binary | `03` §7~§9 | inbound consumers、outbox publisher loop、projection invalidation worker | consumer dedup、dead-letter、outbox retry 和 projection worker tests 通过 |
| `work-jobs` | code / binary | `03` §7~§9 | projection rebuild、reference refresh、reconciliation、trace handoff、archive handoff job runner | job_run_id、partial failure、report ref 和 rerun tests 通过 |
| P0 JSON 配置与 profile fixtures | config | `04` §3~§12 | local-dev / ci-test / integration-like / operations-replay profile、runtime graph、security、reports | `TC-WORK-CFG-*` 与 config evidence 通过 |
| P0 测试、artifact、report、acceptance handoff | test / evidence / report | `05` §4~§14、`06` §2~§11 | automated suites、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | EV / AC / VETO 可回链固定 run_id |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §3 / §4、Step 3 | `/home/aris/Projects/quantalithos-work`、`Cargo.toml`、`crates/*` | 目标仓存在,workspace 可编译 |
| L0-core path dependency | code / dependency | `03` §3 / §4、`06` `VF-WORK-008` | root `Cargo.toml` / crate `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 可编译 |
| Contracts typed refs / states / views / errors / fixtures | code | `03` §6~§8 | `crates/contracts/src/{refs,commands,queries,events,jobs,views,errors,fixtures}.rs` | contract roundtrip、required / forbidden field、domain-only type absent tests 通过 |
| 18 个 Command DTO 与 handler | code / api | `03` §7~§9、`06` `AC-WORK-006~013` | `crates/contracts/src/commands.rs`、`crates/api/src/command_handlers.rs`、application services | validation、idempotency、outbox、error mapping tests 通过 |
| 8 个 Query DTO 与 handler | code / api | `03` §7~§9、`06` `AC-WORK-005/012` | `crates/contracts/src/queries.rs`、`crates/api/src/query_handlers.rs`、query service | no-write、visibility、stale / failed marker tests 通过 |
| 7 个 Inbound Event Consumer | code / event | `03` §7~§9 | `crates/contracts/src/events.rs`、`crates/worker/src/event_consumers.rs`、consumer service | duplicate、dead-letter、snapshot / marker only tests 通过 |
| 10 个 Outbound Event payload 与 publisher | code / event | `03` §7~§9 / §14 | `crates/contracts/src/events.rs`、`crates/worker/src/outbox_publisher.rs`、`crates/infra/src/publishers.rs` | event schema、payload body absent、publish failure evidence tests 通过 |
| 6 个 Operations Job runners | code / binary | `03` §7~§9、`06` `AC-WORK-013` | `crates/contracts/src/jobs.rs`、`crates/jobs/src/*` | item UoW、partial failure、rerun、report ref tests 通过 |
| Domain truth objects and policies | code | `03` §5 / §6 / §9 / §10 | `crates/domain/src/{project,member,backlog,work_item,promote,dependency,iteration,reference,trace,outbox,errors}.rs` | CORE / MEMBER / FORMAL / PROMOTE / DEP / ITER domain tests 通过 |
| Repository、UoW、idempotency 和 in-memory store | code | `03` §7 / §11~§13 | `crates/application/src/{ports,unit_of_work,idempotency}.rs`、`crates/infra/src/*stores*.rs` | rollback、duplicate、conflict、version conflict、commit unknown tests 通过 |
| Runtime config loader 与 runtime builder | code / config | `03` §13、`04` §3~§12 | `crates/infra/src/{config,runtime_builder}.rs`、config fixtures | valid profile 可启动,unsupported profile / raw secret / bad path fail-fast |
| Resolver、publisher、handoff fake adapters | code / adapter | `03` §7 / §13~§15、`04` §6~§11 | `crates/infra/src/{source_resolvers,publishers,handoff_adapters}.rs` | unresolved、retry、failed、fake-as-production reject tests 通过 |
| Projection、search、read model 和 trace support | code | `03` §6 / §8 / §11 / §15、`06` `AC-WORK-012/013` | `crates/domain/src/reference.rs`、`crates/infra/src/projection_stores.rs`、query / jobs | read-only projection、refs-only search、trace page、no-write tests 通过 |
| Trace、audit、safe diagnostic 和 redaction support | code / evidence | `03` §14~§15、`06` `AC-WORK-019/027/029` | `crates/domain/src/trace.rs`、`crates/infra/src/clock_id.rs`、report checks | forbidden body 不进入 truth / event / log / audit / report |
| Automated test suites | test | `03` §15、`05` §4~§12 | crate unit tests、`tests/contract`、`tests/service`、`tests/integration`、support fixtures | P0 `TC-WORK-*` 阻断用例通过 |
| Gate scripts | script | `05` §9 / §13、`06` §4 | `scripts/gates/*` | 支持 `--run-id`、`--artifact-root`、`--config-profile`,输出固定 run artifact |
| Report scripts | script / report | `05` §13、`06` §10 | `scripts/reports/*` | 输出 `reports/runs/<run_id>` 与 `reports/acceptance` 初稿 |
| Check scripts | script | `05` §13、`06` §10 / §11 | `scripts/checks/*` | redaction / forbidden body / path / dependency 命中时非 0 exit |
| Artifact 与 report 目录结构 | evidence / report | `05` §13、`06` §2~§4 / §10 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 无 `<project>` 层级,正式引用不使用 `latest` |

### 7.3 测试与证据交付清单

| 测试 / 证据交付物 | 类型 | 来源 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| `unit-contract-domain` | test suite | `03` §15、`05` §4~§6 | crate unit tests | contracts roundtrip、domain state、policy tests 通过 |
| `service-core` / `service-all` | test suite | `05` §4~§6 | service tests | Command UoW、idempotency、rollback、outbox、trace tests 通过 |
| `api-contract-fast` | test suite | `05` §4~§6 | API / contract tests | Command / Query / Event / Job schema、metadata、error surface tests 通过 |
| `integration-p0` | test suite | `05` §4~§9 | integration tests | in-memory repository、runtime builder、fake adapter 主线通过 |
| `worker-job-contract` / `consumer-outbox` | test suite | `05` §4~§9 | worker / job tests | consumer dedup、outbox publish、job partial failure / rerun tests 通过 |
| `config-fast` / `config-redaction` | test suite | `04` §7~§11、`05` §8~§10 | config tests / scans | profile、validation、sensitive、fake marker、raw body scan 通过 |
| `release-main-smoke` | release gate | `05` §9、`06` §4 | `scripts/gates/*` | project -> member -> work -> iteration -> query / trace smoke 通过 |
| `release-config-redline` | release gate | `05` §9、`06` §10~§11 | `scripts/gates/*`;`scripts/checks/*` | redaction、forbidden output、fake marker、config boundary 通过 |
| `release-evidence-pack` | release gate | `05` §13、`06` §10~§11 | `scripts/reports/*` | evidence index、gate results、redaction report、veto checklist 生成并可追溯 |
| `EV-WORK-*` evidence files | evidence | `05` §13、`06` §10 | `reports/runs/<run_id>/evidence/` | 每条 P0 EV 回指 TC / AC / design_contract_refs / artifact refs |

### 7.4 非交付物清单

| 非交付物 | 不交付原因 | 本轮替代表达 |
|---|---|---|
| 高级看板、多视图偏好、复杂排序分组 | `FR-WORK-E01` 外围增强 | P0 `ProjectBoardView` / query surface |
| 自动化维护建议、自动 spillover、自动解除阻塞 | `FR-WORK-E02` 外围增强且可能改写 truth | reconciliation issue marker / read-only report |
| 容量趋势、负载风险预测、portfolio 视图 | `FR-WORK-E03` / `FR-WORK-E05` 后续分析专项 | NFR 观察报告和风险记录 |
| 项目内工具能力调整治理协同 | `FR-WORK-E04` 后续治理 / 方法专项 | method / governance ref、snapshot、controlled resolver |
| conversation suggestion / process planning / runtime plan body | 来源仓正文不归 Work | source ref、summary ref、promote marker、forbidden body guard |
| Artifact evidence / ImplementationPlan 正文 | Artifact truth 不归 Work | evidence ref、completion summary ref、safe snapshot marker |
| Identity GlobalMember / Role / Actor 生命周期 | Identity truth 不归 Work | GlobalMemberRef、ActorRef、capability snapshot |
| 真实生产 DB / MQ / search / trace / archive | P1 / P2 infra / ops 专项 | port + in-memory / fake adapter |
| config center / hot reload / admin override | P1 / P2 config / ops 专项 | static JSON + startup / job-start validation |
| secret provider / KMS / Vault | P1 / P2 security ops 专项 | ref-only sensitive config、fake / configured ref validation |
| deployment topology、production SLO、on-call runbook | 运维 / 部署专项 | selected reports、NFR observation 和 risk acceptance |

### 7.5 跨仓 / 外部依赖清单

| 依赖对象 | 依赖类型 | 本轮交付内容 | 不交付内容 | 验证方式 |
|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖 | Cargo path dependency、shared metadata、ActorRef、typed core refs、Command / Query metadata | 复制 core contracts | dependency compile、contract roundtrip、`VF-WORK-008` 检查 |
| `quantalithos-bus` | 事件协作依赖 | outbox publisher port、event payload、fake publisher、publish retry / failed evidence | 真实 broker / bus runtime | `TC-WORK-OPS-001`;outbound event tests |
| `quantalithos-identity` | 运行期 resolver / event seam | member / actor resolver port、identity member changed fixture、unresolved marker | GlobalMember / Role / Actor 生命周期 | `TC-WORK-MEMBER-*`;identity boundary negative |
| `quantalithos-conversation` | 事件协作依赖 | work context changed consumer fixture、source ref / summary ref | conversation body / chat UI | `TC-WORK-FORMAL-*`;forbidden body scan |
| `quantalithos-method-library` | 运行期 resolver seam | method definition snapshot resolver、ref-only snapshot | method definition body / lifecycle | `TC-WORK-CFG-*`;resolver unavailable marker |
| `quantalithos-process` | 运行期 resolver / event seam | timebox / timing ref、process timing changed fixture | process planning truth / process state | `TC-WORK-ITER-*`;process boundary negative |
| `quantalithos-governance` | 运行期 resolver seam | governance decision ref / safe summary resolver | governance decision truth | `TC-WORK-PROMOTE-*`;high-risk policy reference |
| `quantalithos-artifact` | 运行期 resolver seam | evidence ref / completion summary resolver | artifact body / evidence lifecycle | `TC-WORK-DEP-005`;forbidden evidence body scan |
| `quantalithos-runtime` | 事件协作依赖 | runtime promote request consumer fixture、source ref、pending intake | runtime progress / ImplementationPlan body | `TC-WORK-PROMOTE-*`;runtime body reject |
| `quantalithos-workspace` | 下游消费依赖 | query / projection / board view surface | workspace product UI / aggregation truth | `TC-WORK-QUERY-*`;query no-write |
| `quantalithos-observability` / `quantalithos-archive` | handoff / downstream seam | trace / archive handoff port、fake handoff、failed marker | global trace store、archive package body | `TC-WORK-OPS-005~006`;handoff redaction |
| `quantalithos-sdk` | 下游 consumer | public contracts surface | generated SDK package | contract roundtrip / schema review |

### 7.6 交付物边界图

图类型: 交付物边界图

图标题: L1-work P0 交付物与依赖边界

```text
core-contracts
  |
  v
work-contracts
  |
  v
work-domain -> work-application -> work-infra
      |                 |              |
      |                 v              v
      |             work-api       work-worker
      |                                |
      +--------------------------------+
                       |
                       v
                   work-jobs
                       |
                       v
tests + scripts + artifacts/test/<run_id> + reports/
```

关键说明:

- 图表达本轮交付物之间的依赖边界,不表达完整函数调用链。
- `work-infra` 本轮以 in-memory / fake 默认路径交付,不代表生产 adapter 完成。
- `tests + scripts + artifacts + reports` 是正式交付物,不是实现完成后的附属动作。
- 运行期和事件协作仓只通过 port / adapter / fixture / event surface 进入,不作为 Cargo dependency。

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §4。

````markdown
## 4. 实施对象与交付物清单

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“测试与证据交付清单”“非交付物清单”和“跨仓 / 外部依赖清单”小节,了解本轮交付物为什么按可验收功能闭环组织,而不是直接搬运详细设计对象索引。

本轮在 `/home/aris/Projects/quantalithos-work` 交付 Rust 2024 workspace,包含 `work-contracts`、`work-domain`、`work-application`、`work-infra`、`work-api`、`work-worker` 和 `work-jobs` 七个 workspace member。

本轮交付范围包括 18 个 Command、8 个 Query、7 个 Inbound Event Consumer、10 个 Outbound Event、6 个 Operations Job、repository / UoW / idempotency / resolver / publisher / handoff / projection / config / clock / id generator port、in-memory / fake adapter、P0 config profile、automated suites、gate / report / check scripts、`artifacts/test/<run_id>` 和 `reports/` 证据结构。

本轮不交付高级看板、多视图偏好、自动维护建议、容量趋势、工具治理协同、跨项目依赖理解、真实生产 DB / MQ / search / trace / archive adapter、config center、hot reload、admin override、secret provider、production SLO、deployment topology 或 on-call runbook。
````

## 9. 待确认事项

无阻塞进入 Step 5 的待确认事项。

后续必须继续收口:

- Step 5 把本步交付物组织成按依赖推进的阶段,不得按单个对象或文件机械拆 phase。
- Step 6 为每个交付物批次定义 commit boundary、验证门禁和提交关系。
- Step 7 将本步测试与证据交付物嵌入阶段门禁,尤其是 `TC-WORK-*`、`EV-WORK-*`、redaction、path check 和 veto checklist。
- Step 8 明确 config profile、runtime builder、fake / configured adapter 和外部依赖准备。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 实施对象清单已列出 | 已满足 |
| 交付物清单已列出 | 已满足 |
| 测试与证据交付清单已列出 | 已满足 |
| 非交付物清单已列出 | 已满足 |
| 跨仓 / 外部依赖清单已列出 | 已满足 |
| 交付物均可追溯到上游文档 | 已满足 |
| 交付物完成判定可审查 | 已满足 |

结论:可以进入 Step 5,设计实施阶段与依赖顺序。
