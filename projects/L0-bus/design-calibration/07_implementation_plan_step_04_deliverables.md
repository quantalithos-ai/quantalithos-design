# L0-bus 07 实施计划 Step 4: 实施对象与交付物

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 4 中间产物。
> 本步从详细设计、配置设计、测试方案和验收标准中抽取本轮实际交付的代码、接口、事件、job、adapter、配置、测试、脚本、证据和报告产物。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 抽取实施对象与交付物 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §4 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承“默认可验证事件传递主闭环”、F-001~F-008、P0 / P0-min 和非范围 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承目标仓、L0-core path dependency、命名、scripts、artifacts、reports 前置规则 |
| `03-详细设计.md` §4~§15 | 已完成 | 抽取 workspace、crate、对象、trait、协议、处理流、状态、事务、配置、观测和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 抽取 JSON config、profile、runtime graph、backend binding、failure mode 和 config evidence |
| `05-测试方案.md` §4~§14 | 已完成 | 抽取测试分层、TS / TC / EV、gate、artifact、report 和回归要求 |
| `06-验收标准.md` §4~§14 | 已完成 | 抽取 AC-FUNC、AC-RED、AC-IF、AC-STATE、AC-TX、AC-IDEM、AC-CONC、AC-NFR、AC-EVID 和 VETO |

---

## 3. SOP 问题回答

### 3.1 本轮会新增或修改哪些代码模块?

本轮会在 `/home/aris/Projects/quantalithos-bus` 新增 Rust workspace 多 crate 实现。代码模块包括 `contracts`、`domain`、`application`、`infra`、`api`、`worker` 和 `jobs`。这些模块对应 `03-详细设计.md` §4 / §5 的实现单元,但实施对象不按对象逐个拆任务,而是按能证明 P0 事件传递主闭环的交付物组织。

### 3.2 本轮会新增或修改哪些接口、事件、job 或 adapter?

本轮会交付 5 个 Command API、7 个 Query API、3 个 inbound event consumer、9 个 outbound event payload、6 个 operations job、repository / UoW / publisher / source / backend / observability port,以及 in-memory / fake 默认 adapter。真实生产 MQ / DB adapter、真实 SDK 高层客户端、真实治理审批和真实观测面板不在本轮交付范围。

### 3.3 本轮会新增哪些测试?

本轮会新增 unit、service、integration、API / consumer / job / contract、release gate / E2E 分层测试。测试场景覆盖 `TS-BUS-001`~`TS-BUS-010`,用例族覆盖 `TC-BUS-PUB-*`、`TC-BUS-SEM-*`、`TC-BUS-DLV-*`、`TC-BUS-FDB-*`、`TC-BUS-REC-*`、`TC-BUS-OUT-*`、`TC-BUS-OBX-*`、`TC-BUS-BND-*`、`TC-BUS-CFG-*` 和 `TC-BUS-RED-*`。

### 3.4 本轮会产生哪些配置、迁移、种子数据或文档同步?

本轮会产生严格 JSON 配置 demo、local / ci-test / release-like profile fixture、runtime graph 构建配置、in-memory / fake backend 配置、fixture outbox fact、backend signal fixture、subscriber feedback fixture、artifact / report 生成配置和验收交接材料。当前 P0 不要求数据库 migration;如果实现中存在状态初始化,应作为 in-memory store / fixture / local state root 初始化处理。

### 3.5 哪些上游设计对象本轮不交付?

不交付 gateway/auth/TLS、生产级 Kafka / NATS / Redis / RabbitMQ / durable DB adapter、业务 payload body truth、governance decision truth、长期 observability 存储和 dashboard、SDK high-level client、config center、hot reload、admin override、multi-backend / multi-tenant 全量矩阵、exactly-once / effectively-once 承诺、部署运维 runbook。

### 3.6 哪些交付物跨仓或依赖外部模块?

编译期跨仓依赖只有 L0-core `core-contracts` 本地 path dependency。运行期外部依赖以 port + fake / in-memory adapter 表达,不作为 P0 启动前置。事件协作依赖通过 inbound fixture、outbound event payload、publisher sink、tap output 和 report evidence 验证,不直接依赖发布方、订阅方、SDK、governance、observability 或业务仓源码。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物尚未集中列出 | `03` 写实现契约,`05` 写测试证据,`06` 写验收门禁 | 后续阶段拆分缺少清晰交付边界 | 统一抽成实施对象、交付物、非交付物和跨仓依赖清单 |
| 详细设计对象很多 | `03` §6~§8 对象、trait、协议完整 | 直接搬运会导致按对象实施 | 只抽取支撑 P0 / P0-min 闭环的可判定交付物 |
| P0-min 易被误后置 | Outbox relay、backend default path 是支撑边界 | 主闭环无法验收 | 明确列入交付物和测试证据 |
| scripts / reports 易后补 | `03` / `05` / `06` 均要求 scripts、artifacts、reports | 最终证据不可审计 | 作为正式交付物列入 |
| 真实外部 adapter 易膨胀 | 生产 MQ / DB 很容易被误纳入 P0 | 延误第一批实现并破坏范围 | 写入非交付物清单,本轮只交付 port + fake / in-memory |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 交付物口径 | 分散在 `03/04/05/06` | 按 code / api / event / job / adapter / config / test / evidence / report 分组 | 让实施对象可检查、可验收 |
| 实施对象来源 | 容易等同于对象索引 | 只抽取 P0 闭环需要交付的对象和模块 | 防止按对象排任务 |
| 测试交付 | 可能被视为后置动作 | 测试 suite、gate、artifact、report 作为交付物 | 符合可验证增量原则 |
| 外部依赖 | 可能被误写成真实 MQ / DB 前置 | 编译期只依赖 core;运行期和事件协作使用 fake / fixture / boundary | 保持 P0 可独立实现 |
| 非范围 | 散落在上游章节 | 集中列为非交付物 | 防止 P1 / P2 能力污染 P0 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 列交付物 | 易对应文件布局 | 容易忽视 API、event、job、test、report 等横切交付 | 不单独采用 |
| 按业务闭环列交付物 | 能对应需求和验收 | 需要额外标注预计落点 | 采用为主组织方式 |
| 把真实 MQ / DB adapter 作为交付物 | 更接近生产 | 与 P0 fake / in-memory 默认可验证路径冲突 | 不采用 |
| 交付 port + in-memory / fake adapter | 可独立测试和验收 | 生产 adapter 风险后置 | 采用 |
| 只交付代码,测试和报告后补 | 编码启动快 | 无法通过 `06` 证据和验收门禁 | 不采用 |
| 测试、脚本、artifact、report 同列交付物 | 每阶段可验证 | 初始交付物清单更长 | 采用 |

---

## 7. 结构化中间产物

### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 本轮口径 | 完成判定 |
|---|---|---|---|---|
| Rust workspace 多 crate 骨架 | code | `03` §4 | 建立 `contracts / domain / application / infra / api / worker / jobs` 边界 | workspace 可编译,依赖方向不反转 |
| `bus_contracts` | code | `03` §7 | Command、Query、Event、Job、View、Receipt、protocol error DTO | JSON roundtrip、schema、错误 DTO 测试通过 |
| `bus_domain` | code | `03` §5 / §6 / §9 | Publication、Delivery、Feedback、Recovery、ReadOutput、Backend、Audit、Policy、状态 enum | domain unit、状态机和 boundary tests 通过 |
| `bus_application` | code | `03` §5 / §8 / §10~§12 | use case service、port trait、UoW、幂等、错误组合 | service tests 验证事务顺序、幂等和副作用 |
| `bus_infra` | code | `03` §5 / §10 / §13 / §14 | in-memory store、repository adapter、publisher / source / backend fake、config、runtime builder、projection、observability | integration、config、redaction 和 adapter tests 通过 |
| `bus_api` | code / binary | `03` §7 / §8 | HTTP JSON Command / Query / Recovery API、DTO mapper、error mapping | API route、header、validation、error mapping tests 通过 |
| `bus_worker` | code / binary | `03` §7 / §8 | outbox relay、backend signal、timeout、read output worker loop | consumer duplicate、ack failure、retryable failure tests 通过 |
| `bus_jobs` | binary | `03` §7 / §8 | outbox relay、delivery progression、retry cycle、projection、backend capability operations job | item transaction、partial success、cursor、summary tests 通过 |
| P0 JSON 配置与 profile fixture | config | `04` §3~§12 | local / ci-test / release-like profile、runtime graph、secret ref、fail-fast / fail-closed | `TC-BUS-CFG-*` 与 config summary 通过 |
| P0 测试、artifact、report、acceptance handoff | test / evidence / report | `05` §4~§14、`06` §10~§14 | automated suites、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | `TC-BUS-RED-*`、EV / RP 和 acceptance index 可定位 |

### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §3 / §4、Step 3 | `/home/aris/Projects/quantalithos-bus`、`Cargo.toml`、`crates/*` | 目标仓存在,`cargo check` 或等价门禁通过 |
| L0-core path dependency | code / dependency | `03` §3 / §4 / §13、`06` AC-IF-006 | root `Cargo.toml` / crate `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 可编译 |
| Command DTO 与 handler | code / api | `03` §7 / §8、`06` AC-IF-001 | `crates/contracts/src/commands.rs`、`crates/api/src/command.rs`、application services | 5 个 Command API 的 validation、idempotency、audit、error mapping tests 通过 |
| Query DTO 与 handler | code / api | `03` §7 / §8、`06` AC-IF-002 | `crates/contracts/src/queries.rs`、`crates/api/src/query.rs`、`ReadOutputService` | 7 个 Query 不写 truth,stale / missing marker tests 通过 |
| Inbound event consumer | code / event | `03` §7 / §8、`06` AC-IF-003 | `crates/worker/src/outbox_relay.rs`、`backend_signal.rs`、`timeout.rs` | duplicate、source ack failure、private body rejected tests 通过 |
| Outbound event payload 与 publisher boundary | code / event | `03` §7 / §8 / §14、`06` AC-IF-004 | `crates/contracts/src/events.rs`、`crates/application` publisher service、`crates/infra` sink | 9 个 event schema、forbidden body absent、publish failure evidence tests 通过 |
| Operations job runners | code / binary | `03` §7 / §8、`06` AC-IF-005 | `crates/jobs/src/*` | 6 个 job 的 item UoW、partial success、cursor、summary tests 通过 |
| Domain 状态机与 policy | code | `03` §5 / §6 / §9、`06` AC-STATE-* | `crates/domain/src/*` | publication、delivery、feedback、recovery、projection 状态机 tests 通过 |
| Repository、UoW、idempotency 和 in-memory store | code | `03` §10 / §12、`06` AC-TX-* / AC-IDEM-* | `crates/application/src/ports/*`、`crates/infra/src/memory_store/*` | unique、expected version、same key same digest / different digest tests 通过 |
| Runtime config loader 与 runtime builder | code / config | `03` §13、`04` §3~§12、`06` AC-FUNC-009 | `crates/infra/src/config.rs`、`runtime_builder.rs`、config fixtures | valid profile 可启动,invalid / raw secret / reload request 稳定失败 |
| Backend / source / publisher fake adapters | code / adapter | `03` §13、`06` AC-IF-007 / AC-IF-008 | `crates/infra/src/transport/*`、`source/*`、`publisher/*` | in-memory / fake 默认路径能证明 P0-min |
| Audit、tap、projection 与 redaction 支撑 | code / evidence | `03` §14、`06` AC-FUNC-006 / AC-NFR-002 / AC-EVID-* | `crates/infra/src/projection/*`、`observability/*`、report checks | forbidden body 不进入 log / audit / event / projection / evidence |
| 自动化测试 suite | test | `05` §4~§12 | `tests/`、crate unit tests、integration tests | `TS-BUS-001`~`010` 对应 P0 / P0-min 用例族通过 |
| Gate scripts | script | `03` §15、`05` §9 / §13 | `scripts/gates/run_ci_gate.sh`、`run_release_gate.sh` | 支持 `--run-id`、`--artifact-root`、`--config-profile`,输出固定 run artifact |
| Report scripts | script / report | `05` §13、`06` AC-FUNC-010 | `scripts/reports/generate_reports.sh`、`generate_acceptance_handoff.sh` | 输出 `reports/runs/<run_id>` 与 `reports/acceptance` |
| Check scripts | script | `05` §13、`06` AC-EVID / VETO | `scripts/checks/check_artifacts.sh`、`check_redaction.sh`、`check_report_links.sh` | artifact 完整性、脱敏和 report links checks 通过 |
| Artifact 与 report 目录结构 | evidence / report | `05` §13、`06` §10 | `artifacts/test/<run_id>`、`reports/` | 无 `<project>` 层级,正式引用不使用 `latest` |

### 7.3 非交付物清单

| 非交付物 | 不交付原因 | 本轮替代表达 |
|---|---|---|
| gateway、登录认证、token 校验、TLS | 属于入口安全或其他边界 | actor / metadata / privileged ref 接缝 |
| 生产级 Kafka / NATS / Redis / RabbitMQ / durable DB adapter | P1 adapter 专项 | port + in-memory / fake adapter + unavailable / unsupported 语义 |
| 业务 payload 正文真相 | 归 publisher / artifact / 业务仓 | payload ref / digest / metadata,禁止保存 body |
| governance decision truth | 归 governance 仓 | approval ref、audit chain ref、failure material |
| 长期 observability 存储、dashboard、alerting | 归 observability / ops | tap、trace、audit、metrics material 和 report |
| SDK high-level client | 归 L0-sdk | Query / event / view / error contract |
| config center、hot reload、admin override | P2 config / ops | 启动期 JSON config,reload request rejected |
| multi-backend / multi-tenant 全量矩阵 | P2 platform | 单一默认可验证 path + port seam |
| exactly-once / effectively-once 承诺 | 后续专项 | at-least-once + idempotency anchor |
| 部署运维 runbook | 部署与运维手册 | gate scripts、report scripts 和 acceptance handoff |

### 7.4 跨仓 / 外部依赖清单

| 依赖对象 | 依赖类型 | 本轮交付内容 | 不交付内容 | 验证方式 |
|---|---|---|---|---|
| L0-core `core-contracts` | 编译期依赖 | Cargo path dependency、contract compile、shared envelope / metadata / trace / error 使用 | 复制 core shared contracts | dependency snapshot、contract compile、`TC-BUS-PUB-*` |
| L0-core committed outbox source | 运行期 / 事件来源 | `OutboxFactSourcePort`、fixture source、duplicate / ack failure 语义 | 真实 L0-core 服务运行依赖 | `TC-BUS-OBX-*` |
| MQ backend / store | 运行期依赖 | `TransportBackendPort`、in-memory backend、fake unavailable / unsupported / uncertain commit | 生产 MQ / durable DB adapter | `TC-BUS-BND-*`、integration tests |
| Publisher / subscriber 业务仓 | 事件协作依赖 | publication command fixture、delivery feedback fixture、fake subscriber | 业务仓源码依赖和业务副作用 | `TC-BUS-PUB-*`、`TC-BUS-FDB-*` |
| SDK / observability / governance / operator | 只读消费 / 事件协作 | transport view、failure material、audit trail、outbound event、report | SDK client、dashboard、governance decision body | `TC-BUS-OUT-*`、redaction report、fake consumer evidence |

### 7.5 交付物边界图

```text
L0-core core-contracts
  |
  v
bus-contracts
  |
  v
bus-domain -> bus-application -> bus-infra
                         |             |
                         v             v
                     bus-api       bus-worker / bus-jobs
                         |             |
                         v             v
                    tests + scripts + artifacts/test/<run_id> + reports/
```

关键说明:

- 图表达本轮交付物之间的依赖边界,不表达完整函数调用链。
- `bus-infra` 本轮以 in-memory / fake 默认路径交付,不代表生产 adapter 完成。
- `tests + scripts + artifacts + reports` 是正式交付物,不是实现完成后的附属动作。

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §4。

```markdown
## 4. 实施对象与交付物清单

> 校准来源：
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”和“跨仓 / 外部依赖清单”小节，了解本轮交付物如何从详细设计、配置设计、测试方案和验收标准收敛。

本轮实施对象围绕 L0-bus P0 默认可验证事件传递主闭环组织,不按对象索引机械拆分。交付物必须可构建、可测试、可验收,并能追溯到 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 目标仓与 workspace 初始化 | code | `03` §3 / §4 | `/home/aris/Projects/quantalithos-bus`、`Cargo.toml`、`crates/*` | 目标仓存在,workspace 可编译 |
| L0-core path dependency | code / dependency | `03` §3 / §4 / §13、`06` AC-IF-006 | root / crate `Cargo.toml` | `core-contracts` 本地 path dependency 可编译 |
| Command / Query / Event / Job DTO | code | `03` §7 | `crates/contracts/src/*.rs` | schema、roundtrip、错误 DTO tests 通过 |
| Domain 状态机与 policy | code | `03` §5 / §6 / §9 | `crates/domain/src/*` | publication、delivery、feedback、recovery、projection 状态机 tests 通过 |
| Application service、port、UoW 和幂等 | code | `03` §8 / §10~§12 | `crates/application/src/*` | service、transaction、idempotency tests 通过 |
| Infra in-memory / fake adapter 与 runtime builder | code / adapter | `03` §10 / §13 / §14、`04` | `crates/infra/src/*` | integration、config、redaction tests 通过 |
| API、worker、operations jobs | code / binary | `03` §7 / §8 | `crates/api`、`crates/worker`、`crates/jobs` | route、consumer、job runner tests 通过 |
| P0 自动化测试、gate scripts、reports 和 artifacts | test / script / evidence | `03` §15、`05`、`06` | `tests/`、`scripts/`、`artifacts/test/<run_id>`、`reports/` | P0 / P0-min 用例族、redaction、report links 和 acceptance index 可验证 |

本轮不交付 gateway/auth/TLS、生产级 MQ / DB adapter、业务 payload 正文真相、governance decision truth、长期 observability dashboard、SDK high-level client、config center、hot reload、admin override、multi-backend / multi-tenant 全量矩阵、exactly-once / effectively-once 承诺和部署运维 runbook。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 目标仓当前不存在 | Step 3 已确认 `/home/aris/Projects/quantalithos-bus` 未发现 | 初始阶段必须包含建仓和 workspace 初始化 | 接受,在 Step 5 / Step 6 转为早期阶段和提交边界 |
| production adapter 是否提前做 | 当前非 P0 | 若提前做会放大范围 | 不做,仅保留 port + fake / in-memory |
| artifact / report 具体生成细节 | `05` / `06` 已定义结构,实现命令待 Step 7 / Step 11 固定 | 影响 gate 和提交前检查 | 接受,后续写入测试门禁和交付纪律 |
| 目标仓首批提交历史 | 目标仓不存在时无历史可参考 | 首批提交必须完全依照实施计划规范 | 接受,Step 11 再固定提交纪律 |

建议方案: 接受上述待确认事项并进入 Step 5。原因是 Step 4 已明确本轮交付物与非交付物,剩余事项属于阶段顺序、测试门禁和提交纪律的后续收束内容。

---

## 10. 进入下一步条件

- 本轮交付物与非交付物明确。
- 交付物均能追溯到 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 或 `06-验收标准.md`。
- 跨仓依赖已区分编译期依赖、运行期依赖和事件协作依赖。
- 可以进入 Step 5,继续设计实施阶段与依赖顺序。
