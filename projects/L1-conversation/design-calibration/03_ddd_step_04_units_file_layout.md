# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节: `projects/L1-conversation/03-详细设计.md` §4 实现单元与文件布局

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_02_scope.md` | P0 Conversation truth center 闭环和非范围 | 限定本步只创建 P0 必需实现单元 |
| `03_ddd_step_03_coding_runtime_constraints.md` | Rust 2024、源码英文、本地 sibling repo、path dependency 和运行期依赖倒置 | 决定 workspace、crate 命名和 Cargo dependency 边界 |
| `projects/L1-conversation/02-概要设计.md` §4 | Inbound / Operations、Application、Domain、Ports、Persistence、Outbox 分层 | 作为 crate 和目录职责映射来源 |
| `projects/L1-conversation/02-概要设计.md` §5~§8 | 8 个主要组成部分、对象轮廓、接口骨架和处理流 | 作为文件职责分配来源 |
| `projects/L1-conversation/02-概要设计.md` §11~§12 | 配置影响轮廓和详细设计承接清单 | 决定 config、runtime builder、scripts、reports 和 jobs 只落到支撑层 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、workspace member、package、crate、binary、scripts、artifacts、reports 命名规则 | 作为本步输出格式和命名门禁 |
| `/home/aris/Projects/quantalithos-core` | 已存在 sibling repo,`crates/contracts` 提供 `core-contracts` | 作为唯一确认编译期 path dependency 的真实路径来源 |

已确认结论:

```text
目标实现仓路径: /home/aris/Projects/quantalithos-conversation
project slug: conversation
布局形态: Rust workspace 多 crate 架构
当前 /home/aris/Projects 下尚未发现 quantalithos-conversation,实施计划应要求创建。
P0 编译期依赖只确认 core-contracts。
```

依赖的前序 Step:

```text
Step 1 已确认旧版 03 只作为问题诊断材料。
Step 2 已确认本轮范围和非范围。
Step 3 已确认编码规范、runtime、仓库、提交和跨仓依赖约束。
```

---

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library？

本轮采用 Rust workspace 多 crate 架构,包含 7 个 P0 实现单元:

| 实现单元 | 类型 | 是否 P0 必建 | 说明 |
|---|---|---|---|
| `crates/contracts` | library crate | 是 | Command、Query、Consumer、Event、Job、View、Receipt、Error、上下文和公共引用 DTO |
| `crates/domain` | library crate | 是 | Conversation truth、space、scope、fact、manifestation、trace、projection、reference、outbox 和 policy |
| `crates/application` | library crate | 是 | application service、handler 编排、port trait、unit of work、idempotency 和错误映射 |
| `crates/infra` | library crate | 是 | repository、store、resolver、outbox publisher、handoff adapter、runtime builder 和 config binding |
| `crates/api` | library + binary crate | 是 | Command / Query 入口适配、DTO mapping 和 API error mapping,不绑定具体 HTTP 产品 |
| `crates/worker` | library + binary crate | 是 | inbound event consumer、outbox relay、subscription / projection worker 的常驻或可运行入口 |
| `crates/jobs` | library + binary crate | 是 | operations job runner 与一次性 job binary,只处理已提交 truth 和派生状态 |

不在本轮必建的实现单元:

| 实现单元 | 不纳入原因 | 后续处理 |
|---|---|---|
| `crates/cli` | P0 主入口是 service API、worker 和 jobs,没有独立 CLI 需求 | 若实施计划需要维护 CLI,先补实施计划或后续设计 |
| `crates/ops` | 运维脚本和检查工具由 `scripts/` 承接即可 | 若出现复杂 Rust 运维工具,再评估 `xtask` 或 `ops` |
| `crates/chat_ui` | Chat UI 属于 `L5-chat` | 本仓只提供 authorized read / event boundary |
| `crates/workspace_view` | Workspace 聚合视图属于 `L1-workspace` | 本仓只提供 query / projection / event |
| `crates/runtime` | Runtime 推理循环和 tool 调用属于 `L2-runtime` / `L2-tools` | 本仓只接收 result fact 或 source ref |

### 3.2 每个实现单元对应概要设计中的哪个代码主体？

| 实现单元 | 对应概要设计代码主体 | 对应主要组成部分 |
|---|---|---|
| `contracts` | API / 接口骨架、上下文、错误、视图和事件 | Authorized consumption、fact append、manifestation、handoff |
| `domain` | Domain Model and Policies | 8 个主要组成部分的对象、状态和 policy |
| `application` | Application Services | space / scope、fact append、authorized query、manifestation、trace、derived maintenance、reference support |
| `infra` | Ports and External Seams、Persistence / Projection / Outbox | repository、projection store、snapshot store、resolver、publisher、handoff adapter |
| `api` | Inbound command / query intake | Command API、Query API |
| `worker` | Event intake、outbox relay、subscription / projection loop | Inbound Event Consumer、Outbound Event、Derived support |
| `jobs` | Operations | 9 个 Operations Job |

### 3.3 文件路径应该如何组织,才能体现模块边界？

文件路径按实现职责组织,不按业务组成部分直接拆 crate。业务组成部分横跨 domain、application、infra、api、worker 和 jobs,由模块文件表达归属。

```text
api / worker / jobs
        |
        v
infra -> application -> domain
   |          |           |
   +----------+-----------+
              |
              v
          contracts
              |
              v
        core-contracts
```

关键说明:

- `domain` 不依赖 `infra`、`api`、`worker`、`jobs`、database、queue、HTTP、bus runtime 或外部服务。
- `application` 依赖 `domain` 与 `contracts`,定义 port trait 和事务边界,不依赖具体 adapter。
- `infra` 实现 application ports,承接 repository、resolver、outbox、handoff、config 和 runtime wiring。
- `api`、`worker`、`jobs` 只做入口和运行承载,不拥有业务 truth。
- `core-contracts` 是唯一进入 Cargo dependency 的上游编译期依赖。

### 3.4 哪些文件必须创建,哪些文件只是后续可能扩展？

| 类别 | 本轮必须创建 | 后续可能扩展 |
|---|---|---|
| workspace 根 | `Cargo.toml`、`README.md` | workspace lint、release profile、publish metadata |
| Rust crates | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | `cli`、`ops`、`xtask` |
| tests | `tests/conversation_truth_flow.rs`、`tests/authorized_consumption_flow.rs`、`tests/cross_domain_manifestation_flow.rs`、`tests/handoff_and_projection_flow.rs` | 性能、chaos、external product adapter tests |
| scripts | `scripts/gates/`、`scripts/reports/`、`scripts/checks/` | release automation、local dev helpers |
| evidence | `artifacts/test/<run_id>/`、`reports/` | 外部交付包或长期归档 |

### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试？

本步在 §7.5 文件职责表中只分配文件责任。对象字段和函数由 Step 6 展开;trait / port / adapter 方法由 Step 7 展开;Command / Query / Event / Job schema 由 Step 8 展开;逐接口处理流由 Step 9 展开。

### 3.6 当前仓的 project slug 是什么？

`conversation`。

### 3.7 workspace member 目录是否使用 `crates/<role>`？

是。使用 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`。

### 3.8 Cargo package 是否使用 `<project>-<role>`？

是。使用 `conversation-contracts`、`conversation-domain`、`conversation-application`、`conversation-infra`、`conversation-api`、`conversation-worker`、`conversation-jobs`。

### 3.9 Rust library crate 是否使用 `<project>_<role>`？

是。使用 `conversation_contracts`、`conversation_domain`、`conversation_application`、`conversation_infra`、`conversation_api`、`conversation_worker`、`conversation_jobs`。

### 3.10 binary 名是否表达用户入口或具体动作？

是。`conversation-api` 和 `conversation-worker` 表达常驻入口;job binary 使用具体动作名,例如 `publish_conversation_outbox`、`rebuild_conversation_read_models`、`refresh_external_reference_snapshots`。

### 3.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名？

没有。计划实现仓为 `quantalithos-conversation`,仓内 member 目录为 `crates/<role>`,package 为 `conversation-<role>`,crate 为 `conversation_<role>`。

### 3.12 如果本仓存在已确认的编译期依赖,path dependency 应写在哪个 `Cargo.toml`？

`core-contracts` 写在根 `Cargo.toml` 的 `[workspace.dependencies]`,由需要的 member 使用 `workspace = true`。

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

路径来源:

```text
/home/aris/Projects/quantalithos-core/crates/contracts
```

### 3.13 哪些运行期依赖或事件协作依赖不能进入 Cargo 依赖？

| 关系 | 类型 | 正确落点 |
|---|---|---|
| `L0-bus` | 事件协作 | outbox publisher port、consumer adapter、worker wiring |
| `L1-identity` | 运行期 / 事件协作 | actor resolver port、identity changed consumer |
| `L1-work` / `L1-governance` / `L1-artifact` | 运行期 / 事件协作 | source fact resolver port、manifestation consumer、snapshot resolver |
| `L2-runtime` / `L6-bridges` | 事件协作 | result fact / mapped fact consumer,只接收结果性事实 |
| `L4-observability` / `L4-archive` | handoff | trace / archive handoff port |
| `L0-sdk` / `L5-chat` / `L1-workspace` | 下游消费 | query、projection、event 和 client boundary |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 仍围绕 Conversation / Turn / StreamEvents / AG-UI / event-to-turn mapping 组织 | 会把本仓实现拉回聊天展示和实时推送口径 |
| 旧版文件布局 | 未按 `contracts/domain/application/infra/api/worker/jobs` 明确 Cargo 边界 | 实现者无法用编译依赖保护 domain 和 application 边界 |
| 新版 `02-概要设计.md` §4 | 给出代码主体框架,但不是可直接创建的目录树 | Step 4 必须转译为 workspace / crate / file tree |
| 新版 `02-概要设计.md` §5 | 8 个主要组成部分是业务主线,不是 crate 划分 | 不能每个业务组成部分建一个 crate,否则会制造循环依赖 |
| 新版 `02-概要设计.md` §11 | 配置影响仍是轮廓 | 本步只能设置 `infra` / `runtime_builder` / scripts 承载位置,具体配置契约留给 Step 14 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 旧版聊天 / 推送式模块 | Rust workspace 多 crate | 支撑公共契约、domain 纯净、多入口和长期演进 |
| crate 划分 | 未收稳 | `contracts` / `domain` / `application` / `infra` / `api` / `worker` / `jobs` | 用编译依赖和入口分层保护边界 |
| 业务组成部分 | 容易按业务组成部分直接建 crate | 业务组成部分落到各 crate 内的模块和文件 | 避免 space / fact / trace / projection 跨 crate 互相循环 |
| 事件协作 | 容易直接依赖 bus / identity / work 等仓 | 只允许 port / adapter / consumer / handoff | 对齐 Step 3 依赖裁剪 |
| 文件职责 | 旧版无法指导实现者创建文件 | 输出目录映射、文件树、文件职责和命名检查 | 满足 1:1 创建仓库结构 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 单 crate 模块分层 | 起步快、文件少 | contracts、domain、infra、api、worker 和 jobs 边界只能靠约定,不利于其他仓复用 DTO | 不采用 |
| 方案 B: 每个业务主要组成部分一个 crate | 业务名称直观 | space、fact、manifestation、trace、projection 都需要共享 truth、scope、policy 和 outbox,容易循环依赖 | 不采用 |
| 方案 C: workspace 多 crate,按实现职责拆分 | 依赖方向清晰,公共契约可复用,多入口自然,适合长期平台化 | 初始结构较重,实施计划需要按纵切推进 | 采用 |
| 方案 D: 继续沿用旧 Turn / StreamEvents 布局 | 改动少 | 与新版概要设计主线冲突,会误导实现者 | 不采用 |

推荐方案:方案 C。
原因:
- `L1-conversation` 既有公共协议,又有领域 truth、应用编排、外部 adapter、worker 和 jobs。
- 多 crate 可以让 `domain` 不依赖运行承载,让 `contracts` 成为对外稳定面。
- 业务主线应在模块和服务中表达,不应直接变成 crate 边界。

---

## 7. 结构化中间产物

### 7.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层 | 否 | 本仓有公共协议、多入口、较重 adapter 和 worker / job 运行承载 | 边界弱,后续实现容易混入外部 truth |
| workspace 多 crate | 是 | 符合 public contracts、domain 纯净、application port、infra adapter、api、worker、jobs 分层 | 需要创建 7 个 crate,但依赖方向可检查 |

### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 定义公共 DTO、上下文、引用、错误、事件、job 和 view | §7 API / 接口骨架 |
| `domain` | library crate | 定义 truth、space、scope、fact、manifestation、trace、projection、reference、policy 和状态 | §5~§6、§9 |
| `application` | library crate | 定义 use case service、port trait、unit of work、idempotency、handler 编排和应用错误 | §8、§12 |
| `infra` | library crate | 实现 repository、adapter、config、runtime builder、publisher、handoff 和 store | §4、§11、§12 |
| `api` | library + binary crate | 承载 Command / Query 入口、routing、DTO mapping 和错误映射 | §7.3~§7.4 |
| `worker` | library + binary crate | 承载 inbound consumer、outbox relay、projection / subscription worker | §7.5、§8.5 |
| `jobs` | library + binary crate | 承载 operations job runner 和 9 个 job 入口 | §7.5、§8.6 |

### 7.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `conversation-contracts` | `conversation_contracts` | 公共协议对象 | 是 |
| `crates/domain` | library crate | `conversation-domain` | `conversation_domain` | 领域对象与 policy | 否 |
| `crates/application` | library crate | `conversation-application` | `conversation_application` | 用例编排与 ports | 否 |
| `crates/infra` | library crate | `conversation-infra` | `conversation_infra` | adapter 与 runtime wiring | 否 |
| `crates/api` | library + binary crate | `conversation-api` | `conversation_api` / `conversation-api` | Command / Query 入口 | 是 |
| `crates/worker` | library + binary crate | `conversation-worker` | `conversation_worker` / `conversation-worker` | Consumer / relay / worker 入口 | 是 |
| `crates/jobs` | library + binary crate | `conversation-jobs` | `conversation_jobs` / action binaries | Operations job 入口 | 是 |

### 7.4 文件布局树

```text
quantalithos-conversation/
  Cargo.toml
  README.md
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs
        refs.rs
        context.rs
        metadata.rs
        commands.rs
        queries.rs
        consumers.rs
        events.rs
        jobs.rs
        views.rs
        receipts.rs
        errors.rs
    domain/
      Cargo.toml
      src/
        lib.rs
        error.rs
        truth.rs
        space.rs
        scope.rs
        fact.rs
        manifestation.rs
        trace.rs
        projection.rs
        reference.rs
        outbox.rs
        policies.rs
    application/
      Cargo.toml
      src/
        lib.rs
        errors.rs
        ports.rs
        unit_of_work.rs
        idempotency.rs
        space_scope_service.rs
        fact_append_service.rs
        authorized_query_service.rs
        manifestation_service.rs
        trace_review_service.rs
        derived_maintenance_service.rs
        reference_snapshot_service.rs
        outbox_service.rs
    infra/
      Cargo.toml
      src/
        lib.rs
        config.rs
        runtime_builder.rs
        repositories.rs
        projection_stores.rs
        snapshot_stores.rs
        source_resolvers.rs
        outbox_publisher.rs
        handoff_adapters.rs
        clock_id.rs
    api/
      Cargo.toml
      src/
        lib.rs
        main.rs
        command_handlers.rs
        query_handlers.rs
        dto_mapping.rs
        error_mapping.rs
    worker/
      Cargo.toml
      src/
        lib.rs
        main.rs
        event_consumers.rs
        outbox_worker.rs
        projection_worker.rs
        worker_runtime.rs
    jobs/
      Cargo.toml
      src/
        lib.rs
        job_runtime.rs
        bin/
          publish_conversation_outbox.rs
          rebuild_conversation_read_models.rs
          rebuild_conversation_search_index.rs
          maintain_conversation_change_cursors.rs
          refresh_external_reference_snapshots.rs
          deliver_trace_handoff.rs
          deliver_archive_handoff.rs
          validate_conversation_consistency.rs
          cleanup_expired_conversation_cursors.rs
  tests/
    conversation_truth_flow.rs
    authorized_consumption_flow.rs
    cross_domain_manifestation_flow.rs
    handoff_and_projection_flow.rs
  scripts/
    gates/
    reports/
    checks/
  artifacts/
    test/
  reports/
```

关键说明:
- `artifacts/test/<run_id>` 和 `reports/` 遵守 `子项目目录与代码文件组织规范.md`,不得增加 `<project>` 中间层。
- 本步只定义文件责任,不创建实现仓文件。
- 具体数据库、队列、HTTP、搜索、缓存产品不得出现在目录名中。

### 7.5 文件职责表

| 文件路径 | 所属实现单元 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/contracts/src/commands.rs` | `contracts` | Command DTO | 写入入口协议 |
| `crates/contracts/src/queries.rs` | `contracts` | Query DTO | 授权读取协议 |
| `crates/contracts/src/consumers.rs` | `contracts` | Inbound consumer input | 来源事件消费协议 |
| `crates/contracts/src/events.rs` | `contracts` | Outbound event DTO | truth、change、handoff 和 projection freshness 传播 |
| `crates/contracts/src/jobs.rs` | `contracts` | Operations job input / output | job 触发和结果协议 |
| `crates/contracts/src/views.rs` | `contracts` | Read model / projection view | 下游读取输出 |
| `crates/domain/src/truth.rs` | `domain` | Conversation truth state / policy | 保护本仓 truth 边界 |
| `crates/domain/src/space.rs` | `domain` | ConversationSpace | 对话空间 lifecycle 和 owner |
| `crates/domain/src/scope.rs` | `domain` | ParticipantScope / VisibilityScope / VisibilityPolicy | 参与和可见范围 |
| `crates/domain/src/fact.rs` | `domain` | ConversationFact / FactSourceRef / FactAppendPolicy | 正式事实追加 |
| `crates/domain/src/manifestation.rs` | `domain` | CrossDomainManifestation / ExternalFactRef / snapshot policy | 跨域显化 |
| `crates/domain/src/trace.rs` | `domain` | Trace context / review / handoff records | 复盘、审计和交接意图 |
| `crates/domain/src/projection.rs` | `domain` | Projection state / search / cursor projection | 派生状态 |
| `crates/domain/src/reference.rs` | `domain` | Reference resolution / external reference projection | 外部引用和降级显示 |
| `crates/application/src/ports.rs` | `application` | repository / resolver / publisher / handoff ports | 外部能力倒置 |
| `crates/application/src/*_service.rs` | `application` | application services | 用例编排、事务、幂等和 domain 调用 |
| `crates/infra/src/repositories.rs` | `infra` | repository adapter | 持久化接口实现 |
| `crates/infra/src/source_resolvers.rs` | `infra` | source resolver adapters | identity / work / governance / artifact / runtime / bridge 引用解析 |
| `crates/infra/src/outbox_publisher.rs` | `infra` | outbox publisher adapter | 事件协作发布 |
| `crates/infra/src/handoff_adapters.rs` | `infra` | trace / archive handoff adapters | 交接外部系统 |
| `crates/api/src/command_handlers.rs` | `api` | command handlers | 调用 application 写路径 |
| `crates/api/src/query_handlers.rs` | `api` | query handlers | 调用 authorized query 路径 |
| `crates/worker/src/event_consumers.rs` | `worker` | inbound event consumers | 来源变化消费和状态推进 |
| `crates/worker/src/outbox_worker.rs` | `worker` | outbox relay | 发布已提交 outbox |
| `crates/jobs/src/bin/*.rs` | `jobs` | job binaries | 运行 9 个 operations job |
| `tests/*_flow.rs` | integration tests | P0 主链集成测试 | 覆盖 truth、读取、显化、交接和派生 |

### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-conversation` | 通过 |
| project slug | `conversation` | 通过 |
| member 目录 | `crates/<role>`,不含项目名前缀 | 通过 |
| Cargo package | `conversation-<role>` | 通过 |
| Rust crate | `conversation_<role>` | 通过 |
| binary 名 | `conversation-api`、`conversation-worker` 或具体 action name | 通过 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `l0_` / `l1_` | 通过 |
| 占位文件 | 不创建 `utils.rs`、`helper.rs`、`service.rs` 这类泛名文件 | 通过 |

### 7.7 Path dependency 表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期 | 根 `Cargo.toml` `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 提供共享上下文、引用、metadata、错误和基础 contract |
| `quantalithos-bus` | 事件协作 | 不写 Cargo dependency | 不适用 | 通过 outbox publisher port / consumer adapter |
| `quantalithos-identity` | 运行期 / 事件协作 | 不写 Cargo dependency | 不适用 | 通过 actor resolver port / identity changed consumer |
| `quantalithos-work` / `quantalithos-governance` / `quantalithos-artifact` | 运行期 / 事件协作 | 不写 Cargo dependency | 不适用 | 通过 source fact resolver / manifestation consumer |
| `quantalithos-observability` / `quantalithos-archive` | handoff | 不写 Cargo dependency | 不适用 | 通过 trace / archive handoff port |

### 7.8 实现单元依赖图

#### 模块依赖图: L1-conversation workspace 依赖方向

```text
crates/api
  |
  v
crates/application
  |
  v
crates/domain
  |
  v
crates/contracts
  |
  v
core-contracts

crates/worker
  |
  v
crates/application

crates/jobs
  |
  v
crates/application

crates/infra
  |
  v
crates/application ports
```

关键说明:
- `infra` 实现 `application` 定义的 ports,由 `api` / `worker` / `jobs` 运行装配调用。
- `domain` 只依赖 `contracts` 和基础类型,不得反向依赖运行承载。
- `api`、`worker`、`jobs` 不直接绕过 application 改写 repository。
- 事件协作和运行期依赖只出现在 port / adapter / worker / job 中。

---

## 8. 回填草稿

正式 `03-详细设计.md` §4 可引用本文件以下内容:

- §7.2 实现单元总表
- §7.3 目录 / Package / Crate / Binary 映射表
- §7.4 文件布局树
- §7.5 文件职责表
- §7.6 命名检查表
- §7.7 Path dependency 表
- §7.8 实现单元依赖图

回填时无需重复本文件的全部 SOP 问题回答,但必须在正式章节列出引用来源:

```text
本章主要引用 `design-calibration/03_ddd_step_04_units_file_layout.md`。
若需要查看完整目录树、文件职责表和 path dependency 约束,继续阅读该文件 §7.2~§7.8。
```

---

## 9. 待确认事项

| 待确认项 | 推荐方案 | 原因 |
|---|---|---|
| 是否现在创建 `/home/aris/Projects/quantalithos-conversation` 实现仓 | 不在详细设计阶段创建 | 本步只产出设计中间产物,实现仓创建应由实施计划或实现 agent 执行 |
| 是否增加 `crates/cli` | 暂不增加 | P0 没有独立 CLI 主线,避免空入口 |
| 是否让 `api` 绑定具体 HTTP / RPC 框架 | 暂不绑定 | 具体产品选择属于后续实现或配置 / 实施阶段,本步只固定入口职责 |

---

## 10. 进入下一步条件

```text
已确认 L1-conversation 的目标实现仓、workspace 形态、7 个 P0 实现单元、目录 / package / crate / binary 映射、文件布局树、文件职责、命名检查和唯一 Cargo path dependency。
实现者可以据此创建仓库骨架,并知道每个文件属于哪个模块。
```
