# Step 4. 抽取实施对象与交付物

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填章节: `07-实施计划.md` §4 实施对象与交付物清单

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 抽取实施对象与交付物 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 2~3、新版 `03/05/06`、`03_ddd_step_04~11` |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_04_deliverables.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 自动停审:交付物、非交付物和完成判定已列出;phase / commit boundary 留给 Step 5~6 |

## 2. 本步目标

从详细设计、测试方案和验收标准中抽取本轮实施会产生的代码、测试、配置、脚本、报告、证据和文档交付物,并明确哪些上游设计对象不是本轮实施交付物。

本 Step 只回答:

- 本轮会新增或重建哪些实现单元、模块、entry 和 job。
- 本轮会落地哪些 protocol、port、adapter、repository、state、transaction 和 replay surface。
- 本轮需要哪些测试、suite、脚本、artifact、report 和 acceptance 文件。
- 哪些内容属于非交付物,不得被实现阶段自然扩张进 P0。

本 Step 不定义 phase、commit boundary、BATCH、GATE 编号、具体测试命令、具体 run id、DDL 细节或正式 `07` 正文。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已完成 | 固定 P0 范围、非范围和 P1/P2 边界 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已完成 | 提供实现关注面阅读矩阵输入、仓库 / 脚本 / 证据路径规则 |
| `03-详细设计.md` | Step 19 final self-check 已完成 | 提供正式实现契约入口和实施承接清单 |
| `03_ddd_step_04_file_layout.md` | 已审核通过 | 提供 workspace、crate、binary、文件落点和依赖形态 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 提供模块职责、依赖方向和对象归属规则 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供对象 / 字段 / 状态 / helper 的正式契约来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 port、adapter、entry restriction 和 fake parity 交付输入 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 6 Command、14 Query、5 Consumer/Callback、10 Outbound、6 Job 协议族 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command/query/consumer/callback/outbound/job flow 和副作用顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供状态机、迁移 owner、query no-write 和 job no-repair 输入 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 logical store、version、UoW、stored replay 和 fake parity 输入 |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 TC、suite、artifact、report、EV 映射和脚本产面 |
| `06-验收标准.md` | 已审核通过 | 提供 AC/VETO、P0 evidence、acceptance report 和阻断规则 |
| 实施计划 SOP / 书写规范 | 当前标准 | 决定本 Step 输出为可判定交付物清单 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 代码交付物 | 抽取 workspace、crate、文件、entry、job 和模块职责 | `03` §4~§7、Step 4~8 | 代码交付物表 | 只列实现落点和完成判定,不复制字段 / flow |
| M2 协议 / port / adapter 交付物 | 抽取 protocol surface、repository / resolver / publisher / handoff / fake parity | Step 7~9、Step 11 | 协议与接口交付物表 | 不新增 Step 7 未定义 port 或 private fake surface |
| M3 状态 / 持久化 / 一致性交付物 | 抽取状态矩阵、logical stores、UoW、idempotency、stored replay 和 no-write/no-repair surface | Step 10~11 | 状态与事务交付物表 | 不定义物理 DDL;不把 cursor/version/key 混用 |
| M4 测试交付物 | 抽取 P0 测试切口、TC family、suite 和 fake / controlled evidence | `05` §3~§9、`06` §5~§12 | 测试交付物表 | 每项能回指 TC / suite / EV / AC 或 VETO |
| M5 脚本 / 报告 / 证据交付物 | 抽取 gate、report、check、artifact root、run report 和 acceptance report | `05` §9 / §13、`06` §10~§14 | 脚本与报告交付物表 | raw artifact 必须生成;不得静态声明 pass;不得使用 `latest` |
| M6 配置 / 数据 / 文档 / 非交付物 | 抽取 config、fixtures、migration、文档同步和明确非交付物 | `04`、`05`、`06`、Step 2~3 | 配置 / 数据 / 文档 / 非交付物表 | 不补 config schema、DDL、fixture 或 P1/P2 产品能力 |

### 4.1 模块停审记录

| 模块 | 结论 | 说明 |
|---|---|---|
| M1 | 通过 | 代码交付物按 7 个 workspace crate、entry binary 和 jobs binary 抽取 |
| M2 | 通过 | 协议、port 和 adapter 交付物只承接 Step 7~9,未新增私有 surface |
| M3 | 通过 | 状态 / 持久化交付物只列实现目标和完成判定,物理 schema 留实现阶段按 Step 11 契约落地 |
| M4 | 通过 | 测试交付物覆盖 P0 切口、TC family、10 个 blocking suite 和 EV family |
| M5 | 通过 | 脚本、artifact、report 和 acceptance 文件均绑定 run-scoped 路径 |
| M6 | 通过 | 配置、测试数据、文档同步和非交付物边界已列出,未把 P1/P2 写成 P0 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮会新增或修改哪些代码模块? | 目标实现仓重建为 Rust workspace,交付 `identity-contracts`、`identity-domain`、`identity-application`、`identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 七个实现单元及其正式文件布局。 |
| 本轮会新增或修改哪些接口、事件、job 或 adapter? | 交付 6 Command、14 Query、5 Inbound Event Consumer / Callback、10 Outbound Event、6 Operations Job,以及 application-owned repository / resolver / publisher / handoff / report / UoW / idempotency / stored replay / entry facade port surface。 |
| 本轮会新增哪些测试? | 交付 contracts/domain/application/infra/entry/job/report/redaction/dependency/evidence 层测试,并覆盖 `TC-ID-CONTRACT-*`、`TC-ID-DOMAIN-*`、`TC-ID-STATE-*`、`TC-ID-CMD-*`、`TC-ID-QUERY-*`、`TC-ID-CONSUMER-*`、`TC-ID-OUTBOX-*`、`TC-ID-JOB-*`、`TC-ID-IDEMP-*`、`TC-ID-CONFIG-*`、`TC-ID-REDACTION-*`、`TC-ID-ARCH-001`。 |
| 本轮会产生哪些配置、迁移、种子数据或文档同步? | 交付 P0 profile / runtime builder / adapter mode 的实现承接、run-scoped DS-ID fixtures、logical store 对应 durable / fake implementation、scripts、artifact/report 输出和正式 `07` 文档装配。物理 DDL 只能按 Step 11 logical store 语义实现,不得由本 Step 发明。 |
| 哪些上游设计对象本轮不交付? | 相邻 truth、外部正文、账号 / credential / session、本体授权裁决、RoleDefinition / CapabilityDefinition body、Project / WorkItem / ProjectMember truth、memory body、archive package、UI/dashboard、production-like capacity 和 runbook 均不交付。 |
| 哪些交付物跨仓或依赖外部模块? | 编译期只允许 `core-contracts` path dependency;method/work/basis/memory/archive/bus/observability/downstream consumer 均只能通过 runtime port、event、adapter、handoff 或 replay fixture 协作。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧实现仓 | 当前实现仓可能仍是旧单 crate skeleton | 本 Step 以新版 workspace 为交付物,旧实现只作迁移 reality 输入 |
| 旧 `07-实施计划.md` | 旧草案无法反映新版协议、job、evidence 和 boundary | 不继承旧阶段或旧交付物;Step 13 重建正式文档 |
| `03` 字段级契约 | 字段 / 状态 / flow 细节在校准文件中,正式摘要不宜复制 | 本 Step 只列交付物,具体落码阅读由 Step 3 / Step 6 继续承接 |
| `05` evidence 产面 | suite、artifact、report 和 EV 已定义,实施计划尚未转成交付物 | 本 Step 抽取为脚本、测试和报告交付物 |
| `06` 验收产面 | acceptance 文件和 VETO 裁决要求已定义,实施计划尚未列入交付物 | 本 Step 抽取为 acceptance report / checklist 交付物 |
| phase / commit boundary | 尚未定义 | 留给 Step 5~6,本 Step 不提前拆 |

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 交付物来源 | 旧 `07` 偏任务和旧实现假设 | 从新版 `03/05/06` 抽取 | 防止旧口径回流 |
| 代码交付物 | 旧单 crate 或模糊模块 | 7 个 workspace crate + 入口 binary + jobs binary | 与 Step 4 / 5 文件布局和模块契约对齐 |
| 协议交付物 | 分散描述 | 6 Command、14 Query、5 Consumer/Callback、10 Outbound、6 Job | 与 Step 8 protocol inventory 对齐 |
| 测试交付物 | 泛化“运行测试” | 10 个 P0 blocking suite、TC family、EV family、raw artifact 和 suite report | 与 `05/06` 证据口径对齐 |
| 报告交付物 | 未明确 | run report、evidence index、redaction、dependency、report audit、acceptance handoff、veto checklist、risk/open issues/review notes | 支撑最终验收裁决 |
| 非交付物 | 容易自然膨胀 | 明确外部 truth、body、UI、真实产品、capacity、runbook 不交付 | 防止 P0 范围扩大 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 交付物是否按对象枚举 | A. 列全部对象;B. 按实现单元 / surface / 测试产物抽取 | 采用 B。实施计划不应退化成对象清单,对象细节留 `03` |
| 是否现在定义 phase | A. 在 Step 4 直接拆阶段;B. 先完成交付物清单 | 采用 B。phase 依赖交付物抽取,正式顺序留 Step 5 |
| 是否把真实产品适配作为 P0 交付 | A. 真实 DB / bus / archive 等进入 P0;B. P0 交付 formal port + fake / controlled / disabled parity | 采用 B。真实产品 selected-run 只作为 P1/P2 或 residual |
| 是否把报告脚本视为测试附属 | A. 测试后再补报告;B. 把脚本 / report / evidence 作为正式交付物 | 采用 B。`05/06` 要求 raw artifact、report pairing 和 evidence index 可裁决 |
| 是否在本 Step 定义 DDL 和 fixture schema | A. 直接写;B. 只列持久化 / 数据交付物,细节回指 Step 11 / `05` | 采用 B。本 Step 不补 schema 或 fixture 真相源 |

## 9. 结构化中间产物

### 9.1 实施对象清单

| 实施对象族 | 覆盖内容 | 来源 | 实施归属 | 完成判定 |
|---|---|---|---|---|
| Workspace 实现单元 | `contracts/domain/application/infra/api/worker/jobs` 七个 crate | `03` §4~§5;Step 4~5 | 目标实现仓 | workspace、package、crate、binary 和依赖方向与详细设计一致 |
| Public contracts | refs、metadata、commands、queries、events、jobs、views、receipts、errors | Step 6 / Step 8 | `crates/contracts` | DTO / typed refs / public markers 编译通过并由 contract tests 覆盖 |
| Domain model | member、lifecycle、role、career、memory、trace/audit、projection/reference/report、outbox/handoff、changes、errors | Step 6 / Step 10 | `crates/domain` | factory / policy / state transition tests 覆盖正式状态与不变量 |
| Application services | command、query、consumer、maintenance、propagation、results、idempotency、ports、errors | Step 7~9 / Step 11 | `crates/application` | flow 顺序、UoW、stored replay、query no-write 和 job no-repair tests 通过 |
| Infra adapters | config、UoW、repositories、projection/reference store、resolvers、publisher、handoff、report writer、memory runtime | Step 7 / Step 11 / `04` | `crates/infra` | fake / controlled / durable-like parity 与 version / rollback / redaction tests 通过 |
| Entry surface | API route/handler、worker consumer/callback、job runner/binaries | Step 7~9 | `crates/api`;`crates/worker`;`crates/jobs` | entry 只做 mapping / dispatch,不绕过 application facade |
| Evidence tooling | gates、reports、checks、artifact/report writer | `05` §9 / §13;`06` §10~§14 | `scripts/*`;`artifacts/test/<run_id>`;`reports/` | raw artifact、suite report、evidence index 和 audit report 成对生成 |

### 9.2 代码交付物表

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Rust workspace root | code / config | `03` §4;Step 4 file layout | `Cargo.toml` | members、workspace dependencies、Rust edition 和 `core-contracts` path 口径正确 |
| `identity-contracts` crate | code | `03` §4~§7;Step 6 / 8 | `crates/contracts` | public refs / DTO / view / event / job / receipt / error surface 编译和 roundtrip 测试通过 |
| `identity-domain` crate | code | `03` §5~§6;Step 10 | `crates/domain` | truth、state、policy、guard、domain error 无 infra 依赖且 domain tests 通过 |
| `identity-application` crate | code | Step 7~9 / Step 11 / Step 13 | `crates/application` | services、ports、UoW、idempotency、stored replay、result assembly 通过 service tests |
| `identity-infra` crate | code | Step 7 / Step 11 / `04` | `crates/infra` | durable/fake/controlled/disabled adapters 使用正式 port surface,无 private fake bypass |
| `identity-api` entry | code | Step 7~9 / `05` entry tests | `crates/api` | handlers 只做 request context / DTO mapping / facade dispatch |
| `identity-worker` entry | code | Step 7~9 / `05` entry tests | `crates/worker` | consumers/callbacks 支持 receipt replay、unsupported、delayed/quarantined 且不隐式建档 |
| `identity-jobs` entry | code | Step 7~9 / `05` operations tests | `crates/jobs` | runner 和 6 job binaries 经 application facade 执行,duplicate replay 不重跑 job body |
| `core-contracts` compile dependency | config | `03` §3~§4;Step 3 前置 | workspace root `Cargo.toml` | 只在 workspace dependency 统一声明,业务 sibling 不进入 Cargo dependency |

### 9.3 协议 / 接口 / Adapter 交付物表

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 6 个 Command protocol + handler target | code / protocol | Step 8.2;Step 9 command flows | `crates/contracts/src/commands.rs`;`crates/application/src/command_service.rs`;`crates/api/src/handlers.rs` | accepted/rejected/duplicate/conflict/result surface 与 flow tests 对齐 |
| 14 个 Query protocol + read service | code / protocol | Step 8.3;Step 9 query flows | `crates/contracts/src/queries.rs`;`crates/application/src/query_service.rs` | visibility-first、missing/not-visible/degraded/stale/no-write surface 可测 |
| 5 个 Inbound / Callback protocol + worker dispatch | code / protocol | Step 8.4;Step 9 inbound/callback flows | `crates/contracts/src/events.rs`;`crates/application/src/consumer_service.rs`;`crates/worker` | accepted / duplicate receipt / unsupported / delayed / quarantined 分支可测 |
| 10 个 Outbound event material | code / protocol | Step 8.5;Step 9 outbound material | `crates/contracts/src/events.rs`;`crates/application/src/propagation_service.rs` | accepted-only、body-free payload marker、topic boundary 和 publish failure isolation 可测 |
| 6 个 Operations Job protocol + runner | code / protocol | Step 8.6;Step 9 job flows | `crates/contracts/src/jobs.rs`;`crates/application/src/maintenance_service.rs`;`crates/jobs` | job report item refs、partial/failed/retryable/noop、stored report replay 可测 |
| Application port surface | code | Step 7 | `crates/application/src/ports.rs` | repository、resolver、publisher、handoff、report、clock/id/UoW/idempotency/stored result port 与 Step 7 一致 |
| Infra adapter implementation | code | Step 7 / Step 11 | `crates/infra/src/*.rs` | fake 与 durable-like 按同一 key/index/version/UoW/append-only/redaction 语义执行 |
| Entry facade restriction | code | Step 7.8 | `crates/application/src/services.rs`;`crates/api`;`crates/worker`;`crates/jobs` | entry 层无法直接访问 repository / publisher / handoff / projection store |

### 9.4 状态 / 持久化 / 一致性交付物表

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Formal state enums and transition helpers | code | Step 6 / Step 10 | `crates/domain/src/*.rs`;`crates/contracts/src/views.rs` | 状态名、迁移 owner、terminal guard、非法转换错误与 Step 10 一致 |
| Identity-owned logical stores | code / persistence | Step 11 | `crates/infra/src/repositories.rs`;future durable migrations | logical store key、unique index、version、append-only、body-free 语义可测 |
| UnitOfWork and cursor assignment | code | Step 7 / Step 11 | `crates/application/src/ports.rs`;`crates/infra/src/unit_of_work.rs` | accepted path same-UoW、rollback visibility、cursor/version 分离可测 |
| Idempotency and stored replay | code | Step 6 / Step 7 / Step 9 / Step 13 | `crates/application/src/idempotency.rs`;`crates/application/src/results.rs`;infra store | command / consumer / callback / job duplicate replay 只读 stored public surface |
| Projection / reference / report maintenance | code | Step 7 / Step 9~11 | `crates/application/src/maintenance_service.rs`;`crates/infra/src/projection_store.rs`;`reference_store.rs`;`report_writer.rs` | query 不 rebuild / refresh,job report-only,no truth repair |
| Outbox / handoff propagation markers | code | Step 6 / Step 9~11 | `crates/domain/src/outbox_handoff.rs`;`crates/application/src/propagation_service.rs`;infra adapters | Published != Delivered,side-effect failure 不回滚 accepted truth |

### 9.5 测试交付物表

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Contract / domain tests | test | `05` §3~§6;`06` §5~§10 | implementation tests under contracts/domain | `contract-domain-fast` 覆盖 `TC-ID-CONTRACT-*`、`TC-ID-DOMAIN-*`、`TC-ID-STATE-*` |
| Application service flow tests | test | `05` command/query/consumer cuts | application / infra integration tests | `service-flow-fast` 覆盖 command、query、consumer main and negative branches |
| Infra fake / controlled parity tests | test | `05` consistency / adapter cuts;`06` AC-CONC | infra tests | `infra-runtime-fake` 覆盖 version、rollback、stored replay、projection lookup、reference bundle、fake parity |
| Entry / worker / job tests | test | `05` entry-worker-job suite | api/worker/jobs tests | `entry-worker-job` 覆盖 handler mapping、worker disposition、job report/replay |
| Operations replay tests | test | `05` outbox/job/idempotency cuts | jobs / application / infra tests | `operations-replay-core` 覆盖 publish/rebuild/refresh/reconcile/handoff/retry/no truth repair |
| Config tests | test | `04`;`05` config cuts | config/runtime tests | `config-redline` 覆盖 strict config、profile isolation、disabled adapter no fake success |
| Redaction tests | test / check | `05` redaction cuts;`06` VETO-ID-003 | redaction suite + check script | `redaction-boundary` 与 `check_redaction.sh` clean |
| Dependency boundary tests | test / check | `01`;`03` module contracts;`06` VETO-ID-006 | dependency metadata/check script | `dependency-boundary` 与 dependency report clean |
| Report generation audit tests | test / check | `05` §9 / §13;`06` evidence integrity | report audit suite + check scripts | `report-generation-audit` 证明 raw artifact/report pairing 和 no static evidence |
| Release smoke tests | test / gate | `05` release gate;`06` final gates | release gate | `release-main-smoke` 生成 representative P0 closure evidence |

### 9.6 脚本 / 报告 / 证据交付物表

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| CI gate runner | script | `05` §9.3 | `scripts/gates/run_ci_gate.sh` | 可按 suite/run-id/profile 生成 raw artifacts and suite reports |
| Release gate runner | script | `05` §9.3 | `scripts/gates/run_release_gate.sh` | P0 release suite 任一失败则非 0,并保留 failed artifact |
| Selected P1 gate runner | script | `05` §9.3 | `scripts/gates/run_selected_p1_gate.sh` | P1 unavailable 只产 residual / unavailable marker,不替代 P0 pass |
| Report generator | script | `05` §9.3 / §13 | `scripts/reports/generate_reports.sh`;`build_gate_summary.sh`;`build_evidence_candidates.sh` | 从 raw artifact 生成 suite reports、summary、gate summary 和 evidence draft |
| Redaction / dependency / pairing / static checks | script | `05` §9.3;`06` §10~§12 | `scripts/checks/*.sh` | redaction、dependency、artifact/report pairing、no static evidence 失败均阻断 |
| Raw artifact tree | artifact | `05` §1;`06` §10 | `artifacts/test/<run_id>/...` | 由 runner 生成,不得手写 pass,失败 artifact 不删除 |
| Run reports | report | `05` §1 / §13;`06` §10 | `reports/runs/<run_id>/...` | summary、gate-summary、evidence-index、suite reports、redaction、dependency、report-audit 可生成 |
| Acceptance reports | report | `06` §10~§14 | `reports/acceptance/*.md` | handoff、veto checklist、risk acceptance、open issues 可回指 fixed run evidence |
| Review reports | report | `06` §14 | `reports/review/*.md` | reviewer notes 与 agent review 不替代 raw artifact |

### 9.7 配置 / 数据 / 文档交付物表

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| P0 runtime config binding | config / code | `04`;`03` Step 14 | `crates/infra/src/config.rs`;entry wiring | invalid fail-fast、disabled adapter no fake success、topic/target completeness 可测 |
| Test datasets and deterministic builders | test data | `05` §7 | test support modules | DS-ID run namespace、fixed clock/id、formal refs、negative fixture isolation 可测 |
| Logical persistence implementation | code / migration | Step 11 | infra repositories and future durable migration files | physical schema 保留 Step 11 logical key/index/version/replay semantics |
| Developer scripts directory | script | Step 3 / `05` | `scripts/dev` optional | 不替代 formal gates;只服务本地调试 |
| Formal `07` assembly | doc | Step 13 | `projects/L1-identity/07-实施计划.md` | 由 Step 1~12 中间产物装配,不是本 Step 直接修改 |
| Implementation handoff references | doc | `03` §16~§18;Step 3 | formal `07` §3 / §12 / §13 | 每个 phase/boundary 后续能回指阅读矩阵和可落码审计 |

### 9.8 非交付物清单

| 非交付物 | 类型 | 来源 | 当前处理 |
|---|---|---|---|
| 登录、账号、session、credential 校验实现 | product / auth | Step 2;`03` 非范围 | 不进入 P0;只消费可信 actor/context |
| 相邻业务 truth 或 external truth 修复 | cross-system truth | `00/03/06` | 只保存 refs、safe summaries、markers、issue refs;maintenance report-only |
| RoleDefinition / CapabilityDefinition / ProjectMember / memory / archive / artifact / conversation body | external body | `03` body-free boundary;`06` VETO-ID-003 | 不保存、不传播、不进入 report/artifact |
| 真实 DB / bus / archive / metric / external provider 产品端到端 | product integration | `05/06` P1/P2 | P0 只交付 formal port + fake/controlled/disabled parity |
| UI、dashboard、advanced employee homepage | product experience | Step 2;`05/06` residual | P2 或后续产品体验 |
| production-like capacity、hard SLO、旧性能阈值 | non-P0 NFR | `05/06` | P0 只交付 duration/count sample 和趋势记录 |
| 自动 remediation、跨仓 truth repair、runbook | operations / product | `03/06` | 不进入 P0;只能有 report-only finding / residual |
| 新增 implementation phase / commit boundary | planning | SOP Step 5~6 | 本 Step 不定义;后续 Step 5~6 处理 |

## 10. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 本 Step 只抽取交付物,不新增 schema、port、state、DTO、test 或 evidence | 否 | 承接 `03/05/06` | 无需回写 |
| 代码交付物确认采用 workspace 多 crate | 是 | 下游 Step 5~6 phase / boundary 输入 | 后续按该交付物集合设计阶段 |
| 测试和报告交付物必须纳入实施阶段 | 是 | Step 7 test / acceptance gate 输入 | Step 7 将映射到 boundary |
| 配置和环境交付物需要进一步拆解 | 是 | Step 8 输入 | Step 8 承接 profile / adapter / artifact root |
| 风险和 P1/P2 residual 不在本 Step 判定 | 是 | Step 9 输入 | 后续分类 blocker / spike / deferred / residual |
| 正式 `07` §4 待回填 | 是 | Step 13 正式装配 | 本 Step 只提供回填草稿 |

## 11. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“模块计划 / 模块目录”“实施对象清单”“代码交付物表”“测试交付物表”“脚本 / 报告 / 证据交付物表”和“非交付物清单”小节,了解实施交付物如何从正式 `03/05/06` 收敛。

正式 `07-实施计划.md` §4 应回填:

- 本轮交付物分为代码、协议 / 接口、状态 / 持久化 / 一致性、测试、脚本 / 报告 / 证据、配置 / 数据 / 文档六类。
- 代码交付物是 `identity-contracts`、`identity-domain`、`identity-application`、`identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 七个 workspace crate,以及 `identity-api`、`identity-worker` 和 6 个 operations job binary。
- 协议交付物覆盖 6 Command、14 Query、5 Inbound Event Consumer / Callback、10 Outbound Event 和 6 Operations Job,并由 application-owned port / adapter surface 支撑。
- 测试交付物覆盖 10 个 P0 blocking suite:`contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`report-generation-audit`、`release-main-smoke`。
- 脚本与证据交付物包括 `scripts/gates`、`scripts/reports`、`scripts/checks`、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review`。
- 非交付物包括认证 / 登录、相邻 truth、外部正文、真实产品端到端、UI/dashboard、production-like capacity、自动 remediation 和 runbook。

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓真实状态与 workspace 迁移成本 | 影响 Step 5 phase 顺序和 Step 6 commit boundary | Step 5~6 设计阶段时继续 reality check |
| 旧 migrations 是否迁移、删除或重建 | 影响 persistence phase | Step 11 logical semantics 是来源;Step 5~6 不得让旧 DDL 反向决定新设计 |
| P1 selected-run 环境是否存在 | 影响 Step 8 / Step 9 | 不阻塞 P0;后续记录 optional / residual |
| scripts 是否已有旧实现可复用 | 影响 Step 7 / Step 8 | 后续按正式 `05/06` 验证,不能继承旧 pass 口径 |
| 物理 durable product 选择 | 影响 future adapter / migration | P0 先以 formal fake / controlled / disabled parity 为主 |

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 实施对象已列出 | 通过 | 见 §9.1 |
| 代码交付物已列出 | 通过 | 见 §9.2 |
| 协议 / port / adapter 交付物已列出 | 通过 | 见 §9.3 |
| 状态 / 持久化 / 一致性交付物已列出 | 通过 | 见 §9.4 |
| 测试交付物已列出 | 通过 | 见 §9.5 |
| 脚本 / 报告 / 证据交付物已列出 | 通过 | 见 §9.6 |
| 配置 / 数据 / 文档交付物和非交付物已列出 | 通过 | 见 §9.7 / §9.8 |
| 未提前定义 phase / commit boundary | 通过 | 留给 Step 5~6 |
| 可进入 Step 5 | 通过 | 下一步:设计实施阶段与依赖顺序 |
