## Step 4. 抽取实施对象与交付物

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
- 回填章节：`07-实施计划.md` §4 实施对象与交付物清单

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/02-概要设计.md`
  - `projects/L0-core/03-详细设计.md`
  - `projects/L0-core/04-配置设计.md`
  - `projects/L0-core/05-测试方案.md`
  - `projects/L0-core/06-验收标准.md`
- 已确认结论：
  - 本轮实施目标是 L0-core P0 契约来源仓闭环。
  - F-001~F-004 全量进入 P0；F-005~F-007 只进入 P0-min 最小切口。
  - 交付物必须可判定，不能使用“完善相关代码”这类模糊项。
  - 不允许把全部对象清单当作实施对象清单。
- 依赖的前序 Step：
  - `07_implementation_plan_step_02_scope.md`
  - `07_implementation_plan_step_03_prerequisites_reading.md`

### 3. SOP 问题回答

1. 本轮会新增或修改哪些代码模块。

   回答：本轮会交付 L0-core Rust workspace 多 crate 骨架，以及 `contract-source/`、`release-snapshots/`、`crates/l0_core_contracts`、`crates/l0_core_domain`、`crates/l0_core_application`、`crates/l0_core_infra`、`crates/l0_core_cli`、`crates/l0_core_jobs` 和 `state/*` 本地状态根。实施对象来自 `03-详细设计.md` §4 / §5，但交付物按可验证闭环组织，不按对象逐个拆成任务。

2. 本轮会新增或修改哪些接口、事件、job 或 adapter。

   回答：接口交付物包括 5 个 Command API、8 个 Query API、7 个 outbound event payload、6 个 Operations Job / Worker 输入输出和统一错误映射。adapter 交付物包括 file store、audit store、outbox store、projection store、idempotency store、reference resolver fake / stub、gate fake、toolchain runner fake、event publisher fake 和 runtime wiring。真实 L0-bus、真实 L0-sdk、真实 L1 业务联调不是本轮交付物。

3. 本轮会新增哪些测试。

   回答：本轮会新增 `fmt_lint_suite`、`unit_domain_suite`、`service_command_query_suite`、`dto_schema_contract_suite`、`config_smoke_suite`、`integration_persistence_suite`、`worker_job_suite`、`outbox_relay_boundary_suite` 和 `e2e_minimal_loop_suite` 对应的实现仓测试。`nightly_fault_recovery_suite` 和 `nfr_baseline_suite` 可以形成初始脚手架或风险记录，但不作为本轮 P0 完整容量验收交付物。

4. 本轮会产生哪些配置、迁移、种子数据或文档同步。

   回答：本轮产生严格 JSON 配置 demo、local / ci-test / integration / release-like profile fixture、7 个 P0 runtime 配置项映射、contract source fixture、release snapshot fixture、projection / audit / outbox / idempotency 临时状态根、测试数据 fixture、evidence index 逻辑结构和必要文档同步。当前不需要数据库迁移；如果实现仓引入文件型 schema 初始化，也应作为状态根初始化或 fixture 处理，不写成数据库 migration。

5. 哪些上游设计对象本轮不交付。

   回答：不交付在线 HTTP / gRPC server、认证授权、真实 L0-bus publish / subscribe / ack / retry / dead-letter runtime、L0-sdk 高层客户端、L1 业务聚合与业务状态机、真实 L4 observability / archive、config center、hot reload、admin override、真实 KMS / Vault、完整多语言 binding、样例仓、可视化、外部包发布中心、完整性能容量压测和生产级部署运维手册。

6. 哪些交付物跨仓或依赖外部模块。

   回答：CloudEvent / outbox boundary 面向 L0-bus，但本轮只交付可被 fake publisher / boundary suite 验证的 outbox 与 relay 接缝；DTO / schema / package view / guide sample 面向 L0-sdk 和 L1+，但本轮只交付可消费来源，不交付下游客户端体验；gate、reference、toolchain、publisher 均使用 port + fake / stub adapter 表达，真实系统接入进入后续仓或风险接受。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `07-实施计划.md` | 尚未创建 §4 实施对象与交付物清单 | 后续阶段拆分缺少可判定的交付边界 |
| `03-详细设计.md` §5 / §6 | 对象、trait、port、adapter 很完整 | 若直接搬成任务清单，会变成对象导向实施，缺少可验证功能闭环 |
| `03-详细设计.md` §7 / §8 | 协议和处理流已定义 | 需要转成接口 / job / event 交付物，而不是重写协议细节 |
| `04-配置设计.md` §7 | 7 个 P0 配置项已收稳 | 需要把配置 demo、profile fixture 和 runtime 校验列成交付物 |
| `05-测试方案.md` §6 / §9 | TC / suite / EV 已定义 | 需要把自动化 suite 作为实施交付物嵌入，而不是最后补测试 |
| `06-验收标准.md` §5~§7 | AC-FUNC / AC-SYNC / 红线已定义 | 需要把完成判定绑定到验收项，防止交付物不可验 |
| 外部依赖 | 真实 bus/sdk/L1 未进入 P0 前置 | 需要明确交付 fake / boundary 接缝，不交付真实联调 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 交付物口径 | 无正式交付物清单 | 按代码、接口、事件、job、adapter、测试、配置、数据和文档同步分组 | 让实施对象可追溯、可检查、可验收 |
| 实施对象来源 | 容易直接搬运对象索引 | 只抽取支撑 P0 / P0-min 闭环的对象和模块 | 避免按对象机械拆分任务 |
| 测试交付 | 容易最后统一补测试 | 将 P0 suite 和关键 TC 作为实施交付物 | 符合可验证增量原则 |
| 外部依赖 | 容易误写成真实外部集成 | 明确 fake / stub / boundary suite 是本轮交付，真实集成后置 | 保持 L0-core 可独立闭环 |
| 配置 / 数据 | 容易只写“准备配置” | 明确 JSON demo、profile fixture、状态根和测试 fixture | 前置条件和验收证据需要可定位 |
| 非交付物 | 分散在上游非范围中 | 集中列出非交付物清单 | 防止 P1 / P2 能力污染 P0 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate / object 列交付物 | 易与文件布局对应 | 容易把全部对象当任务，无法体现功能闭环和验收判定 | 不采用 |
| 按可验证 P0 闭环列交付物 | 能关联需求、详细设计、测试和验收 | 需要在每项中注明预计落点和判定方式 | 采用 |
| 把真实 L0-bus / L0-sdk / L1 联调列为交付物 | 集成真实性强 | 会阻塞底座仓，且违反 Step 2 非范围 | 不采用 |
| 只交付 outbox / schema / package view / fake boundary | 支持独立实现和验收，保留跨仓接缝 | 真实联调风险需要后续仓继续承接 | 采用 |
| 先实现代码，测试后补 | 编码启动快 | 可能导致阶段完成不可判定 | 不采用 |
| 把测试 suite、fixture 和证据结构作为交付物 | 每阶段都能验证 | 前期交付物数量更多 | 采用 |

### 7. 结构化中间产物

#### 7.1 实施对象清单

| 实施对象 | 类型 | 来源章节 | 本轮口径 | 完成判定 |
|---|---|---|---|---|
| Rust workspace 多 crate 骨架 | code | `03` §4 | 建立 contracts / domain / application / infra / cli / jobs 依赖边界 | workspace 可构建，依赖方向不反转 |
| `contract-source/` | asset root | `03` §4 / §10 | 契约源码 truth 输入根 | fixture 可读，source ref 可解析 |
| `release-snapshots/` | asset root | `03` §4 / §10 | 发布快照输出根 | snapshot metadata 与 asset fingerprint 可验证 |
| `l0_core_contracts` | code | `03` §7 | Command / Query / Event / Job / View / Receipt / Error DTO | DTO roundtrip 和 schema contract suite 通过 |
| `l0_core_domain` | code | `03` §5 / §9 | 契约定义、发布、快照、事实、投影、策略不变量 | unit domain suite 通过 |
| `l0_core_application` | code | `03` §5 / §8 / §10~§12 | application service、port trait、事务、幂等和错误映射 | service command/query suite 通过 |
| `l0_core_infra` | code | `03` §5 / §10 / §13 | 文件型 stores、fake adapter、runtime wiring | integration persistence 和 config smoke 通过 |
| `l0_core_cli` | binary | `03` §7 / §8 | CLI command / query / operations trigger | CLI smoke 和错误码验证通过 |
| `l0_core_jobs` | binary | `03` §7 / §8 | 5 个 job binary + outbox relay worker | worker job suite 和 relay boundary suite 通过 |
| P0 JSON 配置与 profile fixture | config | `04` §7 / §9 | 7 个 P0 配置项、严格 JSON、profile fixture | `TC-CONFIG-001~003` 通过 |
| P0 测试与证据结构 | test / evidence | `05` §6 / §9 / §13 | 自动化 suite、fixture、EV 逻辑路径 | P0 EV 可定位 |

#### 7.2 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Workspace 与 crate 骨架 | code | `03` §4 | `<l0-core-code-root>/Cargo.toml`、`crates/*` | `cargo check` 或等价门禁通过 |
| Contract DTO 契约 | code | `03` §7.2~§7.6 | `crates/l0_core_contracts/src/*.rs` | `TC-DTO-001`、EV-CONTRACT-001 通过 |
| Domain 不变量与状态机 | code | `03` §5 / §9 | `crates/l0_core_domain/src/*` | lifecycle、release、snapshot、fact、projection unit tests 通过 |
| Application command/query/job service | code | `03` §8 / §10~§12 | `crates/l0_core_application/src/services/*` | `TC-CMD-*`、`TC-QUERY-*`、`TC-IDEM-*` 通过 |
| Port trait 契约 | code | `03` §5.5 / §13.3 | `crates/l0_core_application/src/ports/*` | application 不依赖 concrete adapter |
| File store 与状态根 adapter | code | `03` §10 / §13 | `crates/l0_core_infra/src/stores/*`、`state/*` | integration persistence suite 通过 |
| Runtime wiring | code | `03` §13 / `04` §9 | `crates/l0_core_infra/src/runtime_wiring.rs` | CLI / job runtime 可由 `CoreRuntimeConfig` 构建 |
| CLI 入口 | binary | `03` §7 / §8 | `crates/l0_core_cli/src/main.rs` | command / query smoke 与错误码验证通过 |
| Operations jobs 与 relay worker | binary | `03` §7.5 / §8.4 | `crates/l0_core_jobs/src/bin/*.rs` | `TC-JOB-*`、`TC-OUTBOX-002` 通过 |
| Outbound events 与 outbox boundary | code / event | `03` §7.4 / §10 | contracts events + outbox store / relay | CloudEvent 字段、event id、pending / failed 通过 |
| JSON 配置 demo 与 profile fixture | config / test | `04` §7 / §9 | config fixtures / test fixtures | `TC-CONFIG-001~003` 通过 |
| P0 测试 suite | test | `05` §6 / §9 | target repo test modules / CI jobs | PR/main/release gate 对应 suite 可运行 |
| Evidence index 逻辑结构 | evidence | `05` §13 / `06` §10 | artifacts / report index | EV-CI / EV-UNIT / EV-SVC / EV-CONTRACT / EV-E2E 可定位 |
| 文档同步记录 | doc | `06` §13 / §14 | implementation notes / handoff note | 偏离设计时能回写 design 文档或登记风险 |

#### 7.3 非交付物清单

| 非交付物 | 不交付原因 | 本轮替代表达 |
|---|---|---|
| 在线 HTTP / gRPC server | `03` 明确非范围 | CLI + Rust library call |
| 认证授权 / 凭据校验 | 属于安全网关或身份边界 | 可信 `ActorContext` / metadata 输入 |
| 真实 L0-bus runtime | 相邻仓职责 | CloudEvent payload + outbox + fake publisher / boundary suite |
| L0-sdk 高层客户端 | 相邻仓职责 | DTO / schema / package view / guide sample |
| L1 业务状态机和业务联调 | 下游业务仓职责 | release snapshot / package view / outbox boundary 可消费 |
| 真实 L4 observability / archive | 观测归档仓职责 | trace / audit / evidence 字段与逻辑路径 |
| config center / hot reload / admin override | P1 / P2 | 严格 JSON + 启动期配置加载 |
| 真实 KMS / Vault / secret provider | P1 / P2 | 禁止 raw secret，使用 redacted / ref 口径 |
| 完整多语言 binding / 样例仓 / 可视化 | P1 / P2 或相邻体验 | schema 稳定、package view、guide sample 最小切口 |
| 完整性能容量压测 | 当前无生产负载模型 | baseline / risk record，必要时后续 release gate 标记 |

#### 7.4 跨仓 / 外部依赖清单

| 依赖对象 | 本轮交付内容 | 不交付内容 | 后续承接 |
|---|---|---|---|
| L0-bus | CloudEvent schema、outbox event、relay boundary、fake publisher | 真实 publish / subscribe / ack / retry / dead-letter | L0-bus 仓测试与验收 |
| L0-sdk | DTO / schema、package view、guide sample | 高层客户端、重试、认证封装、developer experience | L0-sdk 仓设计与实现 |
| L1+ 仓 | 可消费 release snapshot 和契约引用 | 业务聚合、业务状态机、真实业务联调 | 对应 L1 仓验收 |
| Gate / review system | `ApprovedGateRef` 与 fake gate | 真实审批系统 | 后续治理或平台接入 |
| Toolchain runner | fake validate / fingerprint / snapshot exporter | 完整外部工具链发布体验 | 后续 adapter 增强 |
| Observability / archive | trace、audit、evidence 字段 | 真实存储、面板、归档恢复 | L4 观测归档仓承接 |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §4。

```md
## 4. 实施对象与交付物清单

> 校准来源：
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施对象清单”“交付物清单”“非交付物清单”和“跨仓 / 外部依赖清单”小节，了解本轮交付物如何从详细设计、配置设计、测试方案和验收标准收敛。

本轮实施对象围绕 L0-core P0 契约来源仓闭环组织，不按对象索引机械拆分。交付物必须可构建、可测试、可验收，并能追溯到 `02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| Workspace 与 crate 骨架 | code | `03` §4 | `<l0-core-code-root>/Cargo.toml`、`crates/*` | `cargo check` 或等价门禁通过 |
| Contract DTO 契约 | code | `03` §7 | `crates/l0_core_contracts/src/*.rs` | `TC-DTO-001`、EV-CONTRACT-001 通过 |
| Domain 不变量与状态机 | code | `03` §5 / §9 | `crates/l0_core_domain/src/*` | domain unit tests 通过 |
| Application service 与 port | code | `03` §8 / §10~§12 | `crates/l0_core_application/src/*` | command / query / idempotency tests 通过 |
| Infra adapter 与 runtime wiring | code | `03` §10 / §13、`04` §9 | `crates/l0_core_infra/src/*` | integration persistence 和 config smoke 通过 |
| CLI 与 Operations jobs | binary | `03` §7 / §8 | `crates/l0_core_cli`、`crates/l0_core_jobs` | CLI smoke、worker job 和 relay suite 通过 |
| JSON 配置、profile 与 fixture | config / test | `04` §7 / §9 | config fixtures / test fixtures | `TC-CONFIG-001~003` 通过 |
| P0 自动化测试与 evidence index | test / evidence | `05` §6 / §9 / §13、`06` §10 | target repo test modules / CI / artifacts | P0 EV 可定位 |

本轮不交付在线 HTTP / gRPC server、认证授权、真实 L0-bus runtime、L0-sdk 高层客户端、L1 业务联调、真实 L4 观测归档、config center、hot reload、admin override、真实 KMS / Vault、完整多语言 binding、样例仓、可视化、外部包发布中心和完整性能容量压测。

跨仓能力以 boundary 方式交付：L0-bus 只交付 CloudEvent / outbox / relay boundary，L0-sdk 只交付 DTO / schema / package view / guide sample，L1+ 只交付 release snapshot 和契约引用可消费基础。真实下游联调进入相邻仓或后续系统级验收。
```

### 9. 待确认事项

- 目标实现仓真实路径 `<l0-core-code-root>` 仍需由实施者在开工前确认。
- 目标实现仓实际 CI job 名称、artifact 物理路径和测试命令仍需在 Step 7 / Step 8 / Step 11 固定。
- 如果目标实现仓已有额外 crate 命名、feature、workspace 或 toolchain 约束，只能叠加在本交付物清单之上，不能放宽 P0 交付边界。

建议方案：接受上述待确认项并进入 Step 5。原因是 Step 4 已明确本轮交付物与非交付物，剩余问题属于阶段顺序、环境准备和提交纪律的后续收束内容。

### 10. 进入下一步条件

- 本轮交付物与非交付物明确。
- 交付物均能追溯到上游文档。
- 可以进入 Step 5，继续设计实施阶段与依赖顺序。
