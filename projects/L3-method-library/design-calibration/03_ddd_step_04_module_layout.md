# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节：`03-详细设计.md` §4 实现单元与文件布局

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 2 本轮范围 | P0 方法定义发布同步闭环完整展开,P1 只保留边界 |
| Step 3 实现约束 | Rust 契约、Rustdoc 中文注释、gateway 安全边界、PostgreSQL、L0-bus、Domain 不依赖外部设施 |
| `01-架构设计.md` §6 | P0 容器 / 进程: `method-library-api`、`outbox-relay`、`snapshot-exporter`、`operations-job` |
| `02-概要设计.md` §4 | 实现分层: Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters |
| `02-概要设计.md` §5 | 7 个业务主要组成部分及其代码主体 |
| 当前实现位置约束 | 实现可能发生在其他目录,本文使用 `method-library/` 表示目标实现仓根目录 |

已确认结论：

```text
Step 4 只收稳目标 Rust 实现仓的 workspace / crate / file tree。
它不展开字段、函数签名、schema、DDL 和处理流;这些留给 Step 5~11。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认本轮 P0 / P1 范围。
Step 3 已确认 Rust 契约写法、runtime 边界和安全边界。
```

---

## 3. SOP 问题回答

1. 本轮实现包含哪些 crate / package / binary / library？

   回答：建议采用 Rust workspace,包含 6 个 P0 实现单元:`method_library_domain`、`method_library_contracts`、`method_library_application`、`method_library_infra`、`method_library_api`、`method_library_worker`。其中 `method_library_api` 是 API 进程入口,`method_library_worker` 承载 outbox relay 和 operations job 二进制入口,其余为 library crate。

2. 每个实现单元对应概要设计中的哪个代码主体？

   回答：`domain` 对应 Domain Model / Policies 和方法定义真相;`contracts` 对应 Command / Query / Event / Snapshot / Job DTO;`application` 对应 application services 和 ports;`infra` 对应 PostgreSQL、L0-bus、object storage、governance adapter、projection;`api` 对应 Inbound API;`worker` 对应 OutboxRelayWorker 与 Operations Jobs。

3. 文件路径应该如何组织，才能体现模块边界？

   回答：按“crate 先隔离依赖方向,crate 内再按模块职责分包”组织。Domain crate 只放领域对象和策略;Application crate 放 service 和 port trait;Infra crate 放 port 实现;API crate 放 handler / route / gateway context extraction;Worker crate 放 outbox relay 和 operations job 执行入口。不得把 repository、HTTP handler 或 bus adapter 放进 domain。

4. 哪些文件必须创建，哪些文件只是后续可能扩展？

   回答：P0 必须创建 domain / contracts / application / infra / api / worker 的核心文件。P1 的 `MethodPlugin`、`MethodConfiguration`、dependency DAG、variability、cache 优化和 marketplace metadata 不在 P0 必建目录中展开,只在后续扩展清单中保留位置。

5. 每个文件负责定义哪些对象、trait、handler、repository 或测试？

   回答：本步在文件职责表中只分配文件责任,不展开完整对象字段和函数。对象字段由 Step 6 展开,trait / port 由 Step 7 展开,API / event / job schema 由 Step 8 展开,处理流由 Step 9 展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` 旧 §3 / §20 | 旧版曾有目录结构,但基于旧 A-H 和旧章节链 | 与当前 13 章概要设计和新版详细设计 SOP 不一致 |
| `03-详细设计.md` 全文 | 旧内容把对象、接口、数据流分散堆叠,缺少“先 crate / file tree,再模块契约”的入口 | Step 5 模块实现契约缺少稳定落点 |
| `02-概要设计.md` §4 | 已有代码主体框架,但明确不是目录树 | 不能直接复制为文件布局 |
| `02-概要设计.md` §5 | 主要组成部分是业务主线,不是 Rust crate | 需要把业务主线映射到实现分层和 crate |
| P1 相关内容 | 概要设计中保留 P1 对象和接口位置 | 需要在文件布局里避免 P1 污染 P0 必建目录 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实现入口 | 旧 03 从模块职责和对象定义开始 | 新 03 先固定 workspace / crate / file tree | 让实现者先知道代码放哪里 |
| 模块依据 | 容易按 A-H 或 7 类对象直接建目录 | 按 Rust workspace + 实现分层建 crate,再在 Step 5 映射业务模块 | 避免业务主线和技术分层混用 |
| Domain 边界 | 旧文多处说明不依赖外部设施,但目录层未强制体现 | 独立 `method_library_domain` crate,禁止 HTTP / PG / bus 进入 | 用依赖结构守住边界 |
| Ports 位置 | 旧文 ports / repository 分散在后续章节 | 先在 `method_library_application/src/ports/` 固定 port trait 位置 | Step 7 可直接展开 trait 契约 |
| P1 文件 | 旧文大量 P1 对象和接口可能被误写入 P0 目录 | P1 不进入 P0 必建文件树,只保留扩展清单 | 保持 Step 2 的 P0 / P1 分离 |
| 实现位置 | 可能默认在当前设计仓实现 | 使用 `method-library/` 表示目标实现仓根目录,实际实现目录可替换 | 适配用户可能在其他目录实现 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 单 crate + `src/domain` / `src/application` / `src/infra` | 起步简单 | 依赖方向只靠约定,domain 容易误依赖 infra | 不采用 |
| 每个业务主要组成部分一个 crate | 业务主线清楚 | 生命周期、定义真相、同步、查询会大量交叉依赖,crate 数过多 | 不采用 |
| 6 crate workspace: domain / contracts / application / infra / api / worker | 依赖方向清晰,又不会过度拆分 | 初始 workspace 稍重 | 采用 |

---

## 7. 结构化中间产物

### 7.1 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `method_library_domain` | library crate | 定义 MethodContent、7 类 P0 definition、value object、domain policy、domain error | §4.2 Domain Model / Policies;§5.5 方法定义真相与规则;§5.6 关系校验与边界保护 |
| `method_library_contracts` | library crate | 定义 Command / Query / Event / Snapshot / Job DTO、ActorContext、metadata、error response | §7 API / 接口骨架;§11 详细设计承接清单 |
| `method_library_application` | library crate | 编排 command / query / job service,定义 port trait,维护事务用例边界 | §5.4 生命周期与发布治理;§5.7 同步快照;§5.8 查询追溯;§5.9 恢复运维 |
| `method_library_infra` | library crate | 实现 PostgreSQL repository / unit of work / audit / outbox / projection、L0-bus publisher、外部 adapter | §4.2 Persistence / Projection / Outbound Adapters;§5.7;§5.8 |
| `method_library_api` | binary crate | 暴露 Command / Query / Snapshot / Operations HTTP 或 RPC 入口,提取 gateway context,映射错误响应 | §4.2 Inbound / Operations;§7 Command / Query 骨架 |
| `method_library_worker` | binary crate | 运行 outbox relay 与 operations job,包括 seed、replay、rebuild、recalculate | §5.7 定义同步与快照供给;§5.9 基线初始化与恢复运维 |

### 7.2 文件布局树

```text
method-library/
  Cargo.toml                              # workspace 根配置
  crates/
    method_library_domain/                # 领域模型与领域规则
      Cargo.toml
      src/
        lib.rs                            # 导出 domain public API
        error.rs                          # domain error
        content/
          mod.rs                          # MethodContent 聚合模块入口
          aggregate.rs                    # MethodContent aggregate
          kind.rs                         # MethodContentKind
          lifecycle.rs                    # MethodContentLifecycle
          version.rs                      # DefinitionVersion
          fingerprint.rs                  # Fingerprint
          reference.rs                    # DefinitionReference
        definitions/
          mod.rs                          # 7 类 P0 definition subtype 入口
          qualification.rs                # Qualification definition
          role_definition.rs              # RoleDefinition definition
          task_definition.rs              # TaskDefinition definition
          work_product_definition.rs      # WorkProductDefinition definition
          process_template_def.rs         # ProcessTemplateDef definition
          view_profile.rs                 # ViewProfile definition
          ai_policy_def.rs                # AIPolicyDef definition
        policies/
          mod.rs                          # domain policy 入口
          publish_policy.rs               # 发布规则
          reference_validation_policy.rs  # definition 引用校验
          boundary_guard.rs               # Definition / Use 边界保护
          fingerprint_policy.rs           # canonical fingerprint 规则
          view_profile_match_policy.rs    # ViewProfile 匹配规则
    method_library_contracts/             # 协议 DTO 与共享契约
      Cargo.toml
      src/
        lib.rs
        actor.rs                          # ActorContext / ActorRef
        metadata.rs                       # CommandMetadata / RequestMetadata
        commands.rs                       # P0 command DTO
        queries.rs                        # P0 query DTO
        events.rs                         # outbound / inbound event DTO
        snapshots.rs                      # DefinitionSnapshot DTO
        jobs.rs                           # operations job input / output
        errors.rs                         # API error response DTO
    method_library_application/           # 应用服务与端口
      Cargo.toml
      src/
        lib.rs
        error.rs                          # application error
        services/
          mod.rs
          content_command_service.rs      # draft / review / publish / retire / supersede
          publish_governance_service.rs   # gate / audit / outbox 编排
          definition_sync_service.rs      # event / replay / resync 编排
          snapshot_export_service.rs      # snapshot 导出
          view_profile_resolve_service.rs # ResolveViewProfile
          trace_query_service.rs          # definition trace query
          operations_service.rs           # seed / replay / rebuild / recalculate 编排
        ports/
          mod.rs
          unit_of_work.rs                 # UnitOfWork port
          method_content_repository.rs    # MethodContentRepository port
          audit_log.rs                    # AuditLogPort
          outbox.rs                       # OutboxPort
          gate_decision.rs                # GateDecisionPort
          blob_ref.rs                     # BlobRefPort
          event_publisher.rs              # EventPublisherPort
          projection.rs                   # Read / snapshot / trace projection port
          clock.rs                        # Clock port
          id_generator.rs                 # IdGenerator port
    method_library_infra/                 # 基础设施适配
      Cargo.toml
      src/
        lib.rs
        error.rs                          # infra error
        persistence/
          mod.rs
          postgres/
            mod.rs
            unit_of_work.rs               # PostgreSQL UnitOfWork adapter
            method_content_repository.rs  # PostgreSQL repository adapter
            audit_log.rs                  # audit store adapter
            outbox_store.rs               # outbox store adapter
            projections.rs                # read / trace / snapshot projection adapter
        bus/
          mod.rs
          l0_event_publisher.rs           # L0-bus event publisher adapter
        blob/
          mod.rs
          object_storage_blob_ref.rs      # object storage ref validator
        governance/
          mod.rs
          gate_decision_client.rs         # governance gate decision adapter
    method_library_api/                   # API 入口
      Cargo.toml
      src/
        main.rs                           # API process bootstrap
        lib.rs
        routes/
          mod.rs
          command_routes.rs               # command route binding
          query_routes.rs                 # query route binding
          snapshot_routes.rs              # snapshot route binding
          operations_routes.rs            # operations trigger route binding
        handlers/
          mod.rs
          command_handlers.rs             # command handlers
          query_handlers.rs               # query handlers
          snapshot_handlers.rs            # snapshot handlers
          operations_handlers.rs          # operations handlers
        extractors/
          mod.rs
          gateway_context.rs              # actor / metadata extraction, no auth
        response.rs                       # success response mapping
        error_mapping.rs                  # error to HTTP / RPC status mapping
    method_library_worker/                # worker / job 入口
      Cargo.toml
      src/
        lib.rs
        bin/
          outbox_relay.rs                 # outbox relay binary
          operations_job.rs               # operations job binary
        outbox_relay/
          mod.rs
          worker.rs                       # relay loop
          checkpoint.rs                   # relay cursor / checkpoint
        operations/
          mod.rs
          seed_initial_method_assets.rs   # seed job
          replay_definition_events.rs     # replay job
          rebuild_definition_index.rs     # rebuild projection job
          recalculate_fingerprint.rs      # fingerprint recalculation job
  tests/
    publish_flow.rs                       # P0 publish integration contract
    query_snapshot.rs                     # query / snapshot integration contract
    outbox_relay.rs                       # outbox relay integration contract
```

关键说明：

- 该目录树是目标代码仓布局,不表示当前设计仓已有这些文件。
- `method_library_domain` 不允许依赖 `method_library_infra`、`method_library_api`、PostgreSQL、L0-bus 或 HTTP 框架。
- P1 的 `MethodPlugin` / `MethodConfiguration` 不在 P0 必建目录树中展开。
- `tests/` 只列最小集成测试入口,完整测试矩阵留给 Step 16 和 `05-测试方案.md`。

### 7.3 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/method_library_domain/src/content/aggregate.rs` | domain content | `MethodContent` | 承载 P0 定义资产共同聚合根 |
| `crates/method_library_domain/src/content/lifecycle.rs` | domain content | `MethodContentLifecycle` | 定义生命周期状态集合和领域转换入口 |
| `crates/method_library_domain/src/content/fingerprint.rs` | domain content | `Fingerprint` | 表达 canonical 内容指纹 |
| `crates/method_library_domain/src/definitions/*.rs` | domain definitions | 7 类 P0 subtype | 承载各 definition 专属语义 |
| `crates/method_library_domain/src/policies/publish_policy.rs` | domain policies | `PublishPolicy` | 校验发布、published 不可变和 gate 前置规则 |
| `crates/method_library_domain/src/policies/reference_validation_policy.rs` | domain policies | `ReferenceValidationPolicy` | 校验 definition 间引用合法性 |
| `crates/method_library_domain/src/policies/boundary_guard.rs` | domain policies | `DefinitionUseBoundaryGuard` | 阻止下游 Use truth 进入本仓 |
| `crates/method_library_contracts/src/commands.rs` | contracts | command DTO | 定义 Create / Update / Submit / Publish / Deprecate / Retire / Supersede 等命令输入输出 |
| `crates/method_library_contracts/src/queries.rs` | contracts | query DTO | 定义 Get / List / Version / Resolve / Trace / Compare 等查询输入输出 |
| `crates/method_library_contracts/src/events.rs` | contracts | event DTO | 定义 method_library.* event envelope 与 payload |
| `crates/method_library_contracts/src/snapshots.rs` | contracts | snapshot DTO | 定义 `DefinitionSnapshot` 输出契约 |
| `crates/method_library_contracts/src/jobs.rs` | contracts | job DTO | 定义 seed / replay / rebuild / recalculate job input / output |
| `crates/method_library_application/src/services/content_command_service.rs` | application services | `MethodContentCommandService` | 编排写路径命令 |
| `crates/method_library_application/src/services/publish_governance_service.rs` | application services | `PublishGovernanceService` | 编排 gate、audit、outbox 和发布一致性 |
| `crates/method_library_application/src/services/definition_sync_service.rs` | application services | `DefinitionSyncService` | 编排 event、replay 和 resync |
| `crates/method_library_application/src/services/snapshot_export_service.rs` | application services | `SnapshotExportService` | 导出 snapshot |
| `crates/method_library_application/src/services/view_profile_resolve_service.rs` | application services | `ViewProfileResolveService` | 解析 active ViewProfile |
| `crates/method_library_application/src/services/trace_query_service.rs` | application services | `DefinitionTraceQueryService` | 聚合 version / audit / outbox / snapshot 追溯链 |
| `crates/method_library_application/src/services/operations_service.rs` | application services | `MethodOperationsService` | 编排 seed / replay / rebuild / recalculate |
| `crates/method_library_application/src/ports/*.rs` | application ports | port trait | 定义 repository、unit_of_work、audit、outbox、gate、blob、event、projection、clock、id_generator 抽象 |
| `crates/method_library_infra/src/persistence/postgres/*.rs` | infra persistence | PostgreSQL adapters | 实现 write model、audit、outbox、projection 和 transaction |
| `crates/method_library_infra/src/bus/l0_event_publisher.rs` | infra bus | `L0EventPublisher` | 实现事件发布到 L0-bus |
| `crates/method_library_infra/src/blob/object_storage_blob_ref.rs` | infra blob | `ObjectStorageBlobRefAdapter` | 校验 blob ref 可用性 |
| `crates/method_library_infra/src/governance/gate_decision_client.rs` | infra governance | `GateDecisionClient` | 查询或校验 governance gate decision ref |
| `crates/method_library_api/src/extractors/gateway_context.rs` | api extractor | gateway context extractor | 从外层可信入口提取 actor / metadata,不做认证 |
| `crates/method_library_api/src/handlers/*.rs` | api handlers | handlers | 将协议请求映射到 application service 调用 |
| `crates/method_library_api/src/error_mapping.rs` | api response | error mapping | 将 domain / application / infra error 映射为 HTTP / RPC 错误 |
| `crates/method_library_worker/src/outbox_relay/worker.rs` | worker outbox | outbox relay worker | 扫描 outbox、发布 L0-bus、更新传播状态 |
| `crates/method_library_worker/src/operations/*.rs` | worker operations | operations jobs | 执行 seed、replay、rebuild、recalculate |
| `tests/publish_flow.rs` | integration tests | publish flow tests | 验证 publish、audit、outbox 同事务最小闭环 |
| `tests/query_snapshot.rs` | integration tests | query / snapshot tests | 验证查询和 snapshot 输出契约 |
| `tests/outbox_relay.rs` | integration tests | relay tests | 验证 outbox retry / replay 入口 |

### 7.4 后续扩展文件清单

| 后续扩展 | 建议位置 | 触发条件 |
|---|---|---|
| `MethodPlugin` / `MethodConfiguration` | `method_library_domain/src/plugin/`、`method_library_domain/src/configuration/` | P1 正式启动 |
| `PluginCompositionPolicy` | `method_library_domain/src/policies/plugin_composition_policy.rs` | P1 dependency DAG / variability 收稳 |
| marketplace metadata adapter | `method_library_infra/src/marketplace/` | L6-marketplace 契约收稳 |
| read cache adapter | `method_library_infra/src/cache/` | ResolveViewProfile 或列表查询性能成为 P0/P1 明确需求 |
| search adapter | `method_library_infra/src/search/` | PostgreSQL projection 无法满足查询性能 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草文字：

````md
## 4. 实现单元与文件布局

本文使用 `method-library/` 表示目标实现仓根目录。若代码实现发生在其他目录,应把以下 workspace / crate / file tree 套用到目标实现仓。

### 4.1 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `method_library_domain` | library crate | 定义 MethodContent、7 类 P0 definition、value object、domain policy、domain error | §4.2 Domain Model / Policies;§5.5;§5.6 |
| `method_library_contracts` | library crate | 定义 Command / Query / Event / Snapshot / Job DTO、ActorContext、metadata、error response | §7 API / 接口骨架 |
| `method_library_application` | library crate | 编排 command / query / job service,定义 port trait,维护事务用例边界 | §5.4;§5.7;§5.8;§5.9 |
| `method_library_infra` | library crate | 实现 PostgreSQL repository / unit of work / audit / outbox / projection、L0-bus publisher、外部 adapter | §4.2 Persistence / Projection / Outbound Adapters |
| `method_library_api` | binary crate | 暴露 Command / Query / Snapshot / Operations HTTP 或 RPC 入口,提取 gateway context,映射错误响应 | §4.2 Inbound / Operations |
| `method_library_worker` | binary crate | 运行 outbox relay 与 operations job,包括 seed、replay、rebuild、recalculate | §5.7;§5.9 |

### 4.2 文件布局树

```text
method-library/
  Cargo.toml
  crates/
    method_library_domain/
      src/
        lib.rs
        error.rs
        content/
          mod.rs
          aggregate.rs
          kind.rs
          lifecycle.rs
          version.rs
          fingerprint.rs
          reference.rs
        definitions/
          mod.rs
          qualification.rs
          role_definition.rs
          task_definition.rs
          work_product_definition.rs
          process_template_def.rs
          view_profile.rs
          ai_policy_def.rs
        policies/
          mod.rs
          publish_policy.rs
          reference_validation_policy.rs
          boundary_guard.rs
          fingerprint_policy.rs
          view_profile_match_policy.rs
    method_library_contracts/
      src/
        lib.rs
        actor.rs
        metadata.rs
        commands.rs
        queries.rs
        events.rs
        snapshots.rs
        jobs.rs
        errors.rs
    method_library_application/
      src/
        lib.rs
        error.rs
        services/
          content_command_service.rs
          publish_governance_service.rs
          definition_sync_service.rs
          snapshot_export_service.rs
          view_profile_resolve_service.rs
          trace_query_service.rs
          operations_service.rs
        ports/
          unit_of_work.rs
          method_content_repository.rs
          audit_log.rs
          outbox.rs
          gate_decision.rs
          blob_ref.rs
          event_publisher.rs
          projection.rs
          clock.rs
          id_generator.rs
    method_library_infra/
      src/
        persistence/postgres/
        bus/
        blob/
        governance/
    method_library_api/
      src/
        main.rs
        routes/
        handlers/
        extractors/
        response.rs
        error_mapping.rs
    method_library_worker/
      src/
        bin/
          outbox_relay.rs
          operations_job.rs
        outbox_relay/
        operations/
  tests/
    publish_flow.rs
    query_snapshot.rs
    outbox_relay.rs
```

### 4.3 布局边界

- `method_library_domain` 不允许依赖 HTTP、PostgreSQL、L0-bus、object storage 或下游系统。
- `method_library_application` 只依赖 domain、contracts 和 ports,不直接依赖具体 adapter。
- `method_library_infra` 实现 application ports。
- `method_library_api` 只做入口、context extraction、handler 和 error mapping,不做领域判断。
- `method_library_worker` 只运行 relay / job,不得绕过 application / domain 规则直接改写真相。
- P1 的 `MethodPlugin` / `MethodConfiguration` 不进入 P0 必建文件树。
````

---

## 9. 待确认事项

无。

---

## 10. 进入下一步条件

- 实现单元总表已经确认。
- 文件布局树已经可以让实现者创建目标代码仓。
- 每类文件责任已经清楚,但没有提前展开字段、trait、schema 和处理流。
- 用户已确认 Step 4,可以进入 Step 5 定义模块实现契约主轴。
