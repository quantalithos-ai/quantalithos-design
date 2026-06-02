# L1-conversation 07 实施计划 Step 4: 抽取实施对象与交付物

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §4 实施对象与交付物清单
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 抽取实施对象与交付物 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_04_deliverables.md` |

本步从详细设计、配置设计、测试方案和验收标准中抽取本轮实际交付的代码、接口、事件、job、adapter、配置、测试、脚本、证据和报告产物。本步不设计 phase 顺序，不拆 commit boundary，不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 Conversation truth center P0 闭环、`FR-CONV-001~008`、P0-supporting 最小切口和非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承目标仓、`core-contracts` path dependency、命名、scripts、artifacts、reports 前置规则 |
| `03-详细设计.md` §4~§16 | 已完成 | 抽取 workspace、crate、对象、trait、协议、处理流、状态、事务、配置、观测和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 抽取 JSON config、profile、runtime graph、resolver / handoff / reports、redaction 和 failure modes |
| `05-测试方案.md` §4~§14 | 已完成 | 抽取测试分层、TC / EV、gate scripts、artifact、report、redaction 和回归要求 |
| `06-验收标准.md` §4~§14 | 已完成 | 抽取 AC-FUNC、AC-RED、AC-SYNC、AC-STATE、AC-TX、AC-IDEM、AC-NFR、AC-EVID 和 VETO |

校准来源:

- `design-calibration/03_ddd_step_04_units_file_layout.md`
- `design-calibration/03_ddd_step_05_module_contracts_axis.md`
- `design-calibration/03_ddd_step_06_object_contracts.md`
- `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
- `design-calibration/03_ddd_step_08_protocol_contracts.md`
- `design-calibration/03_ddd_step_09_function_flows.md`
- `design-calibration/03_ddd_step_16_test_slices.md`
- `design-calibration/04_config_step_07_config_items.md`
- `design-calibration/05_test_plan_step_06_cases.md`
- `design-calibration/05_test_plan_step_09_automation_ci_gates.md`
- `design-calibration/05_test_plan_step_13_reports_evidence.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_07_interface_event_sync.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`

## 3. SOP 问题回答

### 3.1 本轮会新增或修改哪些代码模块?

本轮会在 `/home/aris/Projects/quantalithos-conversation` 新增 Rust workspace 多 crate 实现。代码模块包括 `contracts`、`domain`、`application`、`infra`、`api`、`worker` 和 `jobs`。这些模块对应 `03-详细设计.md` §4 / §5 的实现单元，但实施对象不按对象逐个拆任务，而是按能证明 Conversation truth center P0 闭环的交付物组织。

### 3.2 本轮会新增或修改哪些接口、事件、job 或 adapter?

本轮会交付 10 个 Command API、11 个 Query API、6 个 inbound event consumer、9 个 outbound event payload、9 个 operations job、repository / UoW / resolver / publisher / handoff / projection / config / observability port，以及 in-memory / fake 默认 adapter。真实生产 DB / MQ / search / trace / archive 产品 adapter、Chat UI、Workspace 聚合视图、Runtime 推理、Bridges 平台协议和 Governance / Artifact / Identity 原始 truth 不在本轮交付范围。

### 3.3 本轮会新增哪些测试?

本轮会新增 domain unit、contract roundtrip、service、query、worker、job、config、integration-like、operations-replay、release redline、report 和 redaction 分层测试。suite 以 `SUITE-CONV-PR-*`、`SUITE-CONV-MAIN-*`、`SUITE-CONV-NIGHTLY-*`、`SUITE-CONV-RELEASE-*` 为主，用例族覆盖 `TC-CONV-SPACE-*`、`TC-CONV-SCOPE-*`、`TC-CONV-FACT-*`、`TC-CONV-QUERY-*`、`TC-CONV-MAN-*`、`TC-CONV-CONSUMER-*`、`TC-CONV-HANDOFF-*`、`TC-CONV-OUTBOX-*`、`TC-CONV-DERIVED-*`、`TC-CONV-CURSOR-*`、`TC-CONV-CONSISTENCY-*`、`TC-CONV-CONFIG-*`、`TC-CONV-REPORT-*` 和 `TC-CONV-REDACTION-*`。

### 3.4 本轮会产生哪些配置、迁移、种子数据或文档同步?

本轮会产生严格 JSON 配置 demo、local / ci-test / integration-like / operations-replay profile fixture、runtime graph 配置、fake resolver / fake publisher / fake handoff 配置、projection / retention / reports / security 配置、deterministic fixture builder、run-scoped test data、artifact / report 生成配置和验收交接材料。当前 P0 不要求数据库 migration；如果实现中存在状态初始化，应作为 in-memory store、fixture 或 local state root 初始化处理。

### 3.5 哪些上游设计对象本轮不交付?

不交付 Chat UI、Workspace 首页 / inbox / 项目视图、Runtime 推理、agent loop、tool call body、Bridges 外部平台协议生命周期、Governance 裁决逻辑、Artifact 正文 / 版本 / 证据链生命周期、Identity 成员生命周期、真实生产 DB / MQ / search / trace / archive 产品、真实跨仓端到端、config center、hot reload、admin override、auto repair truth、production SLO 和 production runbook。

### 3.6 哪些交付物跨仓或依赖外部模块?

编译期跨仓依赖只有 L0-core `core-contracts` 本地 path dependency。运行期外部依赖以 port + fake / in-memory / fixture adapter 表达，不作为 P0 启动前置。事件协作依赖通过 inbound fixture、outbound event payload、publisher sink、handoff port、resolver port 和 report evidence 验证，不直接依赖 bus、identity、work、governance、artifact、runtime、bridges、observability、archive、sdk、chat 或 workspace 源码。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物尚未集中列出 | `03` 写实现契约，`04` 写配置，`05` 写测试证据，`06` 写验收门禁 | 后续阶段拆分缺少清晰交付边界 | 统一抽成实施对象、交付物、非交付物和跨仓依赖清单 |
| 详细设计对象很多 | `03` §6~§8 对象、trait、协议完整 | 直接搬运会导致按对象实施 | 只抽取支撑 P0 / P0-supporting 闭环的可判定交付物 |
| P0-supporting 易被误后置 | projection、search、cursor、outbox、reports 是支撑边界 | 主闭环无法验收或证据缺失 | 明确列入交付物和测试证据 |
| scripts / reports 易后补 | `03` / `05` / `06` 均要求 scripts、artifacts、reports | 最终证据不可审计 | 作为正式交付物列入 |
| 真实外部 adapter 易膨胀 | 生产 DB / MQ / archive / trace 很容易被误纳入 P0 | 延误第一批实现并破坏范围 | 写入非交付物清单，本轮只交付 port + fake / in-memory |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 交付物口径 | 分散在 `03/04/05/06` | 按 code / api / event / job / adapter / config / test / evidence / report 分组 | 让实施对象可检查、可验收 |
| 实施对象来源 | 容易等同于对象索引 | 只抽取 P0 闭环需要交付的对象和模块 | 防止按对象排任务 |
| P0-supporting | 可能被误读为后置增强 | projection、search、cursor、outbox、reports 进入最小可验收切口 | 符合 `06` 验收标准 |
| 测试交付 | 可能被视为后置动作 | 测试 suite、gate、artifact、report 作为交付物 | 符合可验证增量原则 |
| 外部依赖 | 可能被误写成真实跨仓前置 | 编译期只依赖 core；运行期和事件协作用 fake / fixture / boundary | 保持 P0 可独立实现 |
| 非范围 | 散落在上游章节 | 集中列为非交付物 | 防止 P1 / P2 能力污染 P0 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 列交付物 | 易对应文件布局 | 容易忽视 API、event、job、test、report 等横切交付 | 不单独采用 |
| 按 P0 功能闭环列交付物 | 能对应需求和验收 | 需要额外标注预计落点 | 采用为主组织方式 |
| 把真实 DB / MQ / trace / archive adapter 作为交付物 | 更接近生产 | 与 P0 fake / in-memory 默认可验证路径冲突 | 不采用 |
| 交付 port + in-memory / fake adapter | 可独立测试和验收 | 生产 adapter 风险后置 | 采用 |
| 只交付代码，测试和报告后补 | 编码启动快 | 无法通过 `06` 证据和验收门禁 | 不采用 |
| 测试、脚本、artifact、report 同列交付物 | 每阶段可验证 | 初始交付物清单更长 | 采用 |

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 本轮口径 | 完成判定 |
|---|---|---|---|---|
| Rust workspace 多 crate 骨架 | code | `03` §4 | 建立 `contracts / domain / application / infra / api / worker / jobs` 边界 | workspace 可编译，依赖方向不反转 |
| `conversation_contracts` | code | `03` §7 | Command、Query、Consumer、Event、Job、View、Receipt、error DTO | DTO roundtrip、required field、error DTO tests 通过 |
| `conversation_domain` | code | `03` §5 / §6 / §9 | space、scope、fact、manifestation、projection、trace、outbox、policy、状态 enum | domain unit、状态机、invariant 和 forbidden body tests 通过 |
| `conversation_application` | code | `03` §5 / §8 / §10~§13 | use case service、query service、consumer service、job service、port trait、UoW、idempotency、error | service tests 验证事务顺序、幂等和副作用 |
| `conversation_infra` | code | `03` §5 / §10 / §13~§15、`04` | in-memory store、repository adapter、resolver、publisher、handoff、config、runtime builder、projection store、observability | integration、config、redaction 和 adapter tests 通过 |
| `conversation_api` | code / binary | `03` §7 / §8 | HTTP / RPC style Command / Query handler、DTO mapper、error mapping、binary entry | API validation、error mapping、query no-write tests 通过 |
| `conversation_worker` | code / binary | `03` §7 / §8 | inbound consumer、outbox relay、projection worker、binary entry | consumer duplicate、quarantine、outbox retry 和 projection worker tests 通过 |
| `conversation_jobs` | code / binary | `03` §7 / §8 | 9 个 operations job runner 和 action binary | job_run_id、item transaction、partial failure、report ref 和 rerun tests 通过 |
| P0 JSON 配置与 profile fixture | config | `04` §3~§12 | local / ci-test / integration-like / operations-replay profile、runtime graph、security、reports | `TC-CONV-CONFIG-001` 与 config evidence 通过 |
| P0 测试、artifact、report、acceptance handoff | test / evidence / report | `05` §4~§14、`06` §10~§14 | automated suites、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | EV / AC / VETO 可回链固定 run_id |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §3 / §4、Step 3 | `/home/aris/Projects/quantalithos-conversation`、`Cargo.toml`、`crates/*` | 目标仓存在，workspace 可编译 |
| L0-core path dependency | code / dependency | `03` §3 / §4 / §13、`06` AC-SYNC-006 | root `Cargo.toml` / crate `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 可编译 |
| Command DTO 与 handler | code / api | `03` §7 / §8、`06` AC-SYNC-001 | `crates/contracts/src/commands.rs`、`crates/api/src/command_handlers.rs`、application services | 10 个 Command API 的 validation、idempotency、outbox、error mapping tests 通过 |
| Query DTO 与 handler | code / api | `03` §7 / §8、`06` AC-SYNC-002 | `crates/contracts/src/queries.rs`、`crates/api/src/query_handlers.rs`、query service | 11 个 Query 不写 truth，visibility、stale / failed marker tests 通过 |
| Inbound event consumer | code / event | `03` §7 / §8、`06` AC-SYNC-003 | `crates/contracts/src/events.rs`、`crates/worker/src/event_consumers.rs`、consumer service | 6 个 consumer 的 duplicate、quarantine、ref-only boundary tests 通过 |
| Outbound event payload 与 outbox publisher | code / event | `03` §7 / §8 / §14、`06` AC-SYNC-004 | `crates/contracts/src/events.rs`、`crates/worker/src/outbox_relay.rs`、`crates/jobs/src/outbox_publisher.rs` | 9 个 event schema、payload body absent、publish failure evidence tests 通过 |
| Operations job runners | code / binary | `03` §7 / §8、`06` AC-SYNC-005 | `crates/jobs/src/*` | 9 个 job 的 item UoW、partial success、cursor、report ref tests 通过 |
| Domain 状态机与 policy | code | `03` §5 / §6 / §9、`06` AC-STATE-* / AC-RED-* | `crates/domain/src/*` | truth、space、scope、fact、manifestation、projection、outbox、handoff 状态机 tests 通过 |
| Repository、UoW、idempotency 和 in-memory store | code | `03` §10~§13、`06` AC-TX-* / AC-IDEM-* | `crates/application/src/ports.rs`、`unit_of_work.rs`、`idempotency.rs`、`crates/infra/src/repositories.rs` | rollback、duplicate、conflict、sequence monotonic tests 通过 |
| Runtime config loader 与 runtime builder | code / config | `03` §13、`04` §3~§12、`06` AC-NFR-009 / AC-RED-008 | `crates/infra/src/config.rs`、`runtime_builder.rs`、config fixtures | valid profile 可启动，unsupported profile / raw secret / bad path fail-fast |
| Resolver、publisher、handoff fake adapters | code / adapter | `03` §13~§15、`04` §6~§11 | `crates/infra/src/source_resolvers.rs`、`outbox_publisher.rs`、`handoff_adapters.rs` | unresolved、retry、failed、fake-as-production reject tests 通过 |
| Projection、search、cursor 和 read model support | code | `03` §6 / §8 / §10、`06` AC-FUNC-006~008 | `crates/domain/src/projection.rs`、`crates/infra/src/projection_stores.rs`、jobs | derived read-only、refs-only search、cursor monotonic tests 通过 |
| Trace、audit、safe diagnostic 和 redaction support | code / evidence | `03` §14~§15、`06` AC-NFR-006 / AC-EVID-* | `crates/domain/src/trace.rs`、`crates/infra/src/clock_id.rs`、report checks | forbidden body 不进入 truth / event / log / audit / report |
| 自动化测试 suite | test | `05` §4~§12 | crate unit tests、`tests/`、integration-like fixtures | PR / main / nightly / release suite 可运行 |
| Gate scripts | script | `03` §15、`05` §9 / §13 | `scripts/gates/run_ci_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile`，输出固定 run artifact |
| Report scripts | script / report | `05` §13、`06` AC-EVID-* | `scripts/reports/generate_reports.sh` | 输出 `reports/runs/<run_id>` 与 `reports/acceptance` 初稿 |
| Check scripts | script | `05` §13、`06` AC-EVID / VETO | `scripts/checks/check_redaction.sh` | redaction / forbidden body 命中时非 0 exit，保留 failure summary |
| Artifact 与 report 目录结构 | evidence / report | `05` §13、`06` §10 | `artifacts/test/<run_id>`、`reports/` | 无 `<project>` 层级，正式引用不使用 `latest` |

### 7.3 非交付物清单

| 非交付物 | 不交付原因 | 本轮替代表达 |
|---|---|---|
| Chat UI、前端消息展示、富媒体渲染 | 属于 `L5-chat` 产品体验 | query / event / projection surface |
| Workspace 首页 / inbox / 项目聚合视图 | 属于 `L1-workspace` 聚合视图 | authorized view / refs |
| Runtime 推理、agent loop、tool call body、reasoning body | 属于 Runtime truth | result fact ref / safe snapshot / forbidden body guard |
| Bridges 外部平台协议和原始消息正文 | 属于 Bridges / 外部平台 truth | bridge mapped fact ref / marker |
| Governance 裁决逻辑 | 属于 Governance truth | governance fact ref / safe snapshot / manifestation |
| Artifact 正文、版本、证据链生命周期 | 属于 Artifact truth | artifact ref / safe snapshot / unresolved marker |
| Identity 成员生命周期 | 属于 Identity truth | actor / participant ref、fake resolver、unresolved marker |
| 真实生产 DB / MQ / search / trace / archive 产品 | P1 / production adapter 专项 | port + in-memory / fake adapter + retry / failed / unresolved 语义 |
| 真实跨仓端到端联调 | 依赖多个仓库实现和部署 | controlled seam、fixture、risk acceptance |
| config center、hot reload、admin override | P2 config / ops | 启动期 / job-startup JSON config，reload request rejected |
| auto repair truth | 会破坏 no-auto-repair 红线 | validation report、issue marker、manual follow-up |
| production SLO、容量数字和 runbook | 后续 NFR / operations 专项 | qualitative baseline、gate report、risk acceptance |

### 7.4 跨仓 / 外部依赖清单

| 依赖对象 | 依赖类型 | 本轮交付内容 | 不交付内容 | 验证方式 |
|---|---|---|---|---|
| L0-core `core-contracts` | 编译期依赖 | Cargo path dependency、shared IDs、ActorRef、TraceContext、metadata、error refs | 复制 core shared contracts | dependency compile、contract roundtrip、`TC-CONV-SPACE-*` |
| L0-bus | 事件协作依赖 | outbox publisher port、event payload、fake publisher、publish retry / failed evidence | 真实 bus runtime / broker | `TC-CONV-OUTBOX-*`;`EV-CONV-OUTBOX-001` |
| L1-identity | 运行期 resolver / event seam | ActorResolverPort、identity actor changed consumer fixture、unresolved marker | 创建、退休或改变成员生命周期 | `TC-CONV-SCOPE-*`;`TC-CONV-CONSUMER-*` |
| L1-work / L1-governance / L1-artifact | 来源事实引用 | ExternalFactResolverPort、source event fixture、safe snapshot / unresolved / mismatch marker | 来源仓正文和 lifecycle truth | `TC-CONV-MAN-*`;`EV-CONV-MAN-001` |
| L2-runtime / L6-bridges | 事件协作依赖 | runtime result / bridge mapped fact consumer fixture、forbidden body guard | runtime reasoning body、platform message body | `TC-CONV-CONSUMER-*`;`EV-CONV-REDACTION-001` |
| L4-observability / L4-archive | handoff 依赖 | trace handoff / archive handoff port、fake handoff、retry / failed / archived marker | 全局 trace store、archive package body | `TC-CONV-HANDOFF-*`;`EV-CONV-HANDOFF-001` |
| L0-sdk / L5-chat / L1-workspace | 下游消费 | query / event / projection surface、authorized view、ref-only change sensing | 下游 client、UI、workspace 体验 | `TC-CONV-QUERY-*`;`TC-CONV-OUTBOX-*` |

### 7.5 交付物边界图

图类型: 交付物边界图

图标题: L1-conversation P0 交付物与依赖边界

```text
core-contracts
  |
  v
conversation-contracts
  |
  v
conversation-domain -> conversation-application -> conversation-infra
      |                         |                    |
      |                         v                    v
      |                 conversation-api      conversation-worker
      |                         |                    |
      +-------------------------+--------------------+
                                |
                                v
                        conversation-jobs
                                |
                                v
        tests + scripts + artifacts/test/<run_id> + reports/
```

关键说明:

- 图表达本轮交付物之间的依赖边界，不表达完整函数调用链。
- `conversation-infra` 本轮以 in-memory / fake 默认路径交付，不代表生产 adapter 完成。
- `tests + scripts + artifacts + reports` 是正式交付物，不是实现完成后的附属动作。
- 运行期和事件协作仓只通过 port / adapter / fixture / event surface 进入，不作为 Cargo dependency。

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §4。

````markdown
## 4. 实施对象与交付物清单

> 校准来源：
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”和“跨仓 / 外部依赖清单”小节，了解本轮交付物如何从详细设计、配置设计、测试方案和验收标准收敛。

本轮实施对象围绕 L1-conversation Conversation truth center P0 闭环组织，不按对象索引机械拆分。交付物必须可构建、可测试、可验收，并能追溯到 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §3 / §4 | `/home/aris/Projects/quantalithos-conversation`、`Cargo.toml`、`crates/*` | 目标仓存在，workspace 可编译 |
| L0-core path dependency | code / dependency | `03` §3 / §4 / §13、`06` AC-SYNC-006 | root / crate `Cargo.toml` | `core-contracts` 本地 path dependency 可编译 |
| Command / Query / Event / Job DTO | code | `03` §7 | `crates/contracts/src/*.rs` | schema、roundtrip、错误 DTO tests 通过 |
| Domain 状态机与 policy | code | `03` §5 / §6 / §9 | `crates/domain/src/*` | space、scope、fact、manifestation、projection、outbox、handoff 状态机 tests 通过 |
| Application service、port、UoW 和幂等 | code | `03` §8 / §10~§13 | `crates/application/src/*` | service、transaction、idempotency tests 通过 |
| Infra adapter、config 和 runtime builder | code / adapter | `03` §10 / §13~§15、`04` | `crates/infra/src/*` | integration、config、redaction tests 通过 |
| API、worker 和 operations jobs | code / binary | `03` §7 / §8 | `crates/api`、`crates/worker`、`crates/jobs` | handler、consumer、outbox relay、job runner tests 通过 |
| P0 自动化测试、gate scripts、reports 和 artifacts | test / script / evidence | `03` §15、`05`、`06` | `tests/`、`scripts/`、`artifacts/test/<run_id>`、`reports/` | P0 EV、redaction、report links 和 acceptance index 可验证 |

本轮不交付 Chat UI、Workspace 聚合视图、Runtime 推理、Bridges 外部平台协议、Governance 裁决、Artifact 正文和证据链生命周期、Identity 成员生命周期、真实生产外部服务、真实跨仓端到端、config center、hot reload、auto repair truth、production SLO 和 production runbook。
````

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 目标仓当前不存在 | Step 3 已确认 `/home/aris/Projects/quantalithos-conversation` 不存在 | 初始阶段必须包含建仓和 workspace 初始化 | 接受，在 Step 5 / Step 6 转为早期阶段和提交边界 |
| production adapter 是否提前做 | 当前非 P0 | 若提前做会放大范围 | 不做，仅保留 port + fake / in-memory |
| artifact / report 具体生成细节 | `05` / `06` 已定义结构，实现命令待 Step 7 / Step 11 固定 | 影响 gate 和提交前检查 | 接受，后续写入测试门禁和交付纪律 |
| 目标仓首批提交历史 | 目标仓不存在时无历史可参考 | 首批提交必须完全依照实施计划规范 | 接受，Step 11 再固定提交纪律 |

建议方案: 接受上述待确认事项并进入 Step 5。原因是 Step 4 已明确本轮交付物与非交付物，剩余事项属于阶段顺序、测试门禁和提交纪律的后续收束内容。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 本轮交付物与非交付物明确 | 已满足 |
| 交付物均能追溯到上游文档 | 已满足 |
| 跨仓依赖已区分编译期依赖、运行期依赖和事件协作依赖 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 4 可以进入 Step 5。Step 5 应把上述交付物组织为按依赖推进的阶段化可验证功能增量，并输出阶段依赖图、阶段总表和阶段顺序理由。
