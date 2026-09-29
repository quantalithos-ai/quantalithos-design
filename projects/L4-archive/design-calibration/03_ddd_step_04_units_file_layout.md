# Step 4. 收稳实现单元与文件布局

## 1. Step 状态与开工确认

- 状态：`completed / pass_with_upstream_blockers / stop_review`；`current_part = closed`。
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4；未来回填正式 03 §4。
- 开工依据：[Step 3](03_ddd_step_03_coding_runtime_constraints.md) 已通过；项目 ledger 与 03 flow 允许执行 Step 4。
- 写入边界：只定义目标实现仓的 planned unit/file contract；目标仓当前不存在，不创建实现文件，不进入 Step 5。

### 1.1 本 Step 串行小循环

1. A：选择布局形态，确定 crate/package/binary 与 dependency direction。
2. B：按 contracts → domain → application → infra → api → worker 推导最小文件集合。
3. C：补 root/test/Cargo path、文件职责、CP/入口覆盖和命名审计。
4. D：后置审计旧 03 污染，形成回填草稿，更新三层台账并停审。

## 2. 本步输入

- [Step 2 范围](03_ddd_step_02_scope.md)和 [Step 3 实现约束](03_ddd_step_03_coding_runtime_constraints.md)。
- [正式 02](../02-概要设计.md) §4/§5/§7/§11/§12：六 CP、四实现层、三运行角色、30 入口与 required ports。
- [02 Step 12](02_hld_step_12_detailed_design_handoff.md)：模块/文件、对象、接口、事务、配置和测试的详细设计展开上限。
- `standards/document/子项目目录与代码文件组织规范.md` 与详细设计书写规范 §5.4。
- `/home/aris/Projects/quantalithos-archive`、`/home/aris/Projects/quantalithos-core` 及 Core Cargo manifests 的只读核验结果。
- `L1-workspace`、`L1-governance`、`L1-artifact` Step 4 只作结构粒度参考，不复制其 crate 数量、领域文件或 outbox/jobs 选择。

## 3. SOP 问题回答

1. **包含哪些 crate/package/binary/library？** 采用 workspace 多 crate：`contracts`、`domain`、`application`、`infra`、`api`、`worker` 六个 library crate；`worker` 同时提供唯一 planned 常驻 binary `archive-worker`。`api` 先为 transport-neutral library，无未选框架的 server binary。
2. **怎样对应概要代码主体？** crate 按技术 role 划分，六 CP 跨 domain/application/contracts/infra 分布；api 承接 3 Command + 5 Query，worker 承接 5 Consumer + 17 logical Operations Job。六 CP 不映射成六服务仓或六 crate。
3. **怎样体现边界？** 目标路径为 `/home/aris/Projects/quantalithos-archive`，member 使用 `crates/<role>`；domain 只含本地纯规则，application 定义 required ports，infra 实现技术适配，入口 crate 不直接写 store 或调用 provider。
4. **哪些文件必须创建，哪些后续扩展？** 本步树中列出的 root/member/module/test 文件是 planned 最小集合。HTTP/RPC routes/server、DB migrations、具体 provider 子目录、outbound event/outbox/publisher、scripts/reports/artifacts、deployment、CLI/ops/jobs crate 均不在当前集合。
5. **文件负责什么？** 本步只固定对象组、协议族、service、port、adapter、handler/loop 和测试风险入口的唯一承载文件；字段、函数、trait method、schema、case 名分别留 Step 5～16。
6. **project slug？** `archive`。`L4` 只用于设计导航，不进入实现仓内部命名。
7. **member 是否为 `crates/<role>`？** 是，六个 member 均为短 role 目录。
8. **package 是否为 `<project>-<role>`？** 是，使用 `archive-contracts` 等 kebab-case package 名。
9. **library crate 是否为 `<project>_<role>`？** 是，使用 `archive_contracts` 等 snake_case crate 名。
10. **binary 是否表达入口？** 是，`archive-worker` 表示常驻后台执行/消费宿主；17 个 Operations Job 是 worker 内 logical handlers，不生成 17 个 binary。
11. **是否泄漏 L0/L1/L4？** 否。package/crate/module/file/type/function/binary 均禁止架构层级前缀。
12. **Core path dependency 放哪里？** planned root `Cargo.toml` 的 `[workspace.dependencies]` 使用真实路径 `../quantalithos-core/crates/contracts`；member 只在 Step 5 证明需要后声明 `workspace = true`。
13. **哪些关系不能进 Cargo graph？** Bus、L1 owners、workspace、artifact、observability、SDK、storage/integrity/KMS/compression/schema providers 与 receivers 只能通过 application port、infra adapter、consumer mapping、ref 或 test fake 表达。

## 4. 当前文档问题诊断

| 位置 | 问题 / 风险 | 本步处置 |
|---|---|---|
| 正式 02 §4 | 六 CP、四层和三运行角色尚无 crate/file 映射 | 采用技术 role 多 crate，三条轴保持正交 |
| 正式 01 三运行角色 | 可能被误拆成三个服务/部署 | api library + 单 worker binary；运行角色语义分模块，可同宿主承载 |
| 17 Operations Job | 同时创建 `worker` 与 `jobs` 会表达重复后台入口 | 全部作为常驻 worker 的 logical operation handlers；当前不建 `jobs` crate |
| 3 outbound candidates | 建 `events.rs`/outbox/publisher 会提前把候选变 ready | 当前树故意不含发送文件；解锁必须回退 02 和本 Step |
| external contracts | 按每个 owner/provider 预建具体 client 会伪造 exact contract | infra 只列按 authority class/port family 的 blocked adapter 落点 |
| 目标实现仓 | 当前不存在 | 所有路径标为 planned；不声称 manifests/source/tests 已存在 |
| 旧正式 03 | 单仓目录围绕 ArchiveIndex、RetentionClass、LegalHold 和 provider 展开 | 完全不继承；只按正式 02 的 26 对象与 30 入口重推 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 只有抽象实现层；旧 03 是污染单体布局 | planned Rust workspace 多 crate | 用 Cargo direction 强制 domain/provider、query/write 分离 |
| crate 主轴 | 六 CP 容易被机械拆仓 | 六个技术 role，CP 在 role 内按主语分文件 | 保持业务轴与技术轴正交 |
| 后台入口 | Consumer/Job 可能重复落 worker/jobs | 一个 worker crate/binary，内部两类 loop/handler | 符合常驻任务语义和目录规范 |
| 同步入口 | 旧材料暗示具体 RPC/route | api 仅 transport-neutral library | framework/host 尚无 authority |
| 外部依赖 | 旧文件固定 provider/SDK/owner 客户端 | local ports + blocked adapter 文件；仅 Core contracts 可 compile | 不把 runtime/ref/event 伪装为 package dependency |
| 测试位置 | 未确认 Cargo 发现边界 | 每个 member 使用本地 `tests/*.rs` | 虚拟 workspace 根不承载孤儿 integration tests |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| 单 crate 模块分层 | manifests 少、起步快 | domain 纯净、read/write capability 和多入口主要靠 review | 不采用 |
| 技术 role workspace 多 crate | 编译方向清晰，protocol/domain/application/entry 分离 | 初始 member 与 mapping 成本更高 | 采用 |
| 每 CP 一个 crate | 业务名直观 | 同一 use case/UoW 横跨层，易形成循环和服务化误读 | 不采用 |
| `worker` + `jobs` 两个后台 role | 入口分类表面明确 | 当前 17 Job 均是持久状态驱动的后台推进，会重复表达同类入口 | 不采用；统一 worker |
| 每个 Job 一个 binary | 可单独运行 | 产生 17 个调度表面和无 authority 的运维接口 | 不采用 |
| API library + worker binary | 不伪选 transport，同时具备后台宿主落点 | 同步宿主需外部合同关闭后补 | 采用 |

## 7. 结构化中间产物

### 7.1 布局形态决策

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有同步/消费/后台多入口、公共协议面、较重 infra，且必须编译期隔离纯 domain | 不以目录/review 单独承担关键依赖边界 |
| workspace 多 crate 架构 | 是 | contracts/domain/application/infra/api/worker 的依赖方向可被 Cargo 强制 | 建六个 member；Step 5 继续收稳 crate/module export 与 dependency matrix |
| 按六 CP 拆 crate | 否 | CP 是业务组成轴，不是技术依赖轴；CP1/3/5/6 存在跨对象局部事务 | CP 在 domain/service/operation 文件内映射，不物理服务化 |

其他仓是否直接依赖 Archive Rust DTO 当前未成立，因此它不是选择多 crate 的依据。`contracts` 的独立性用于仓内边界和潜在正式协议实现，不能推导 SDK/L1 已获准 Cargo 依赖本仓。

### 7.2 实现单元总表

| 实现单元 | 类型 | 核心职责 | 对应正式 02 |
|---|---|---|---|
| `contracts` | library crate | 2 个跨层正式 value/ref 对象（`DeclaredArchiveScope`、`GovernanceDecisionRef`）、Archive-local typed refs/context、3 Command、5 Query、5 Consumer mapped input、17 Job I/O、safe views/errors；无 outbound family | §6.3/§6.19/§6.28、§7、§12 |
| `domain` | library crate | 其余 24 个 Archive-owned truth/value/history 对象、不变量、多轴状态与纯 closure/assessment rules | §5/§6/§9 |
| `application` | library crate | 8 个 service/use-case family、7 required/local port family、局部 UoW/幂等/编排 | §4/§5/§7/§8/§12 |
| `infra` | library crate | local store 与 external port adapters、配置绑定、runtime construction；只翻译不裁决 | §3/§7.6/§11 |
| `api` | transport-neutral library crate | 3 Command 与 5 no-write Query handler；不含 route/server/provider | §7.2/§7.3/§8.2/§8.7 |
| `worker` | library + binary crate | 5 Consumer 常驻接入、17 Job 有界推进、两类 loop/shutdown 与 fail-closed wiring | §7.4/§7.5/§8.3~§8.6 |

### 7.3 目录 / Package / Crate / Binary 映射

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library | `archive-contracts` | `archive_contracts` / 无 binary | public/local protocol vocabulary 与 DTO | 是；不等于跨仓 Rust 分发已获准 |
| `crates/domain` | library | `archive-domain` | `archive_domain` / 无 binary | Archive domain truth 与纯规则 | 否；仓内实现边界 |
| `crates/application` | library | `archive-application` | `archive_application` / 无 binary | services、ports、UoW、use-case orchestration | 否；仓内实现边界 |
| `crates/infra` | library | `archive-infra` | `archive_infra` / 无 binary | adapters、store/config/runtime construction | 否；仓内技术边界 |
| `crates/api` | library | `archive-api` | `archive_api` / 无 binary | transport-neutral command/query handlers | 是；行为入口，不承诺 HTTP/RPC binding |
| `crates/worker` | library + binary | `archive-worker` | `archive_worker` / `archive-worker` | consumer 与 background operation 常驻宿主 | binary 是运行入口；library 仅仓内装配/测试 |

当前不创建 `jobs`、`cli`、`ops`、`config` 或 `observability` crate。配置归 infra；观测/audit hook 位于各职责模块并在 Step 15 闭合；一次性人工命令若未来获准，必须重审 role，而不能把现有 logical Job 自动变成 binary。

### 7.4 Planned compile dependency 方向

```text
archive_api --------depends_on-------> archive_application
     |                                         |
     +-------------depends_on------------------+----> archive_contracts
                                               |             |
archive_worker -----depends_on----> archive_infra            |
     |                                  |                    |
     +---------depends_on-------------->+--> archive_application
                                        |          |
                                        +----------+-------> archive_domain
                                                   |              |
                                                   +--------------+----> archive_contracts
                                                                         |
                                                                         +----> core_contracts
                                                                                verified symbols only

runtime/event/ref/adapter (not Cargo dependencies):
owners / bus / workspace / artifact / observability / capabilities / receivers
```

关键说明：

- 图是 allowed maximum，不是已存在 Cargo graph；Step 5 仍须逐 member 缩减实际 dependency/export。
- `archive_domain` 只可依赖 contracts 中的纯 Archive-local vocabulary，不能依赖 protocol handler、Tokio、infra 或 provider。
- `archive_worker` 通过 application/infra 装配，不直接绕过 port 写 store；`archive_api` 不依赖 infra，以阻止 query 获得全写 adapter。
- 不允许任何 owner、Bus、SDK、provider 或 receiver sibling 进入图中 compile 边。

| 依赖仓库 | 全局类型 | `Cargo.toml` 位置 | planned path 写法 | 不可用时处置 |
|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | compile candidate | workspace root `[workspace.dependencies]`；确需 member 用 `workspace=true` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | path/symbol/语义任一不符即阻塞受影响 compile path，不复制 shadow shared type |

其他所有仓和外部能力不进入 path dependency 表；其本地目录存在与否不改变关系分类。

### 7.5 Planned 文件布局树

```text
quantalithos-archive/                         # planned target repo; currently absent
  Cargo.toml                                  # virtual workspace and approved shared dependencies
  rustfmt.toml                                # repository formatting intent
  crates/
    contracts/
      Cargo.toml                              # archive-contracts library manifest
      src/
        lib.rs                                # explicit public module/export root
        refs.rs                               # Archive-local ids/refs; external refs remain opaque typed refs
        context.rs                            # actor/command/query/worker contexts and Core mapping seam
        scope.rs                              # DeclaredArchiveScope shared immutable value object
        governance_decision.rs                # GovernanceDecisionRef shared opaque decision binding
        commands.rs                           # three Command request/result DTO families
        queries.rs                            # five no-write Query request selectors
        consumers.rs                          # five validated local consumer input/result carriers
        operations.rs                         # logical Operations Job protocol module root
        operations/
          coordination.rs                     # AdvanceArchiveJob I/O
          capture.rs                          # plan/capture/reconcile source I/O
          bundle.rs                           # assemble/seal I/O
          verification.rs                     # integrity/compatibility assessment I/O
          lifecycle.rs                        # placement/retrieval/lifecycle/reconcile I/O
          restore.rs                          # plan/material/handoff/reconcile/compensation I/O
        views.rs                              # five safe query response/view/page markers
        errors.rs                             # public safe error codes/details
      tests/
        protocol_boundaries.rs                # DTO boundary and safe serialization risks
    domain/
      Cargo.toml                              # archive-domain library manifest
      src/
        lib.rs                                # explicit domain module/export root
        request.rs                            # ArchiveRequest
        job.rs                                # ArchiveJob + ArchiveJobStageRecord
        source_binding.rs                     # ArchiveSourceBinding
        capture.rs                            # CaptureAttempt + CaptureCoverage + SourceCaptureFinding
        bundle.rs                             # ArchiveBundle
        manifest.rs                           # BundleManifest + ManifestEntry
        closure.rs                            # ManifestClosure + ClosureFinding
        verification.rs                       # VerificationAssessment + VerificationFinding
        compatibility.rs                      # CompatibilityAssessment
        placement.rs                          # ArchivePlacement
        lifecycle.rs                          # LifecycleExecution + ExternalActionRecord
        restore_request.rs                    # RestoreRequest
        restore_plan.rs                       # RestorePlan + RestoreItem
        restore_handoff.rs                    # RestoreHandoff + HandoffOutcome + CompensationRecord
        errors.rs                             # domain invariant/transition errors
      tests/
        domain_invariants.rs                  # 24 domain-object invariant risk suite
        state_axis_boundaries.rs              # multi-axis/non-propagation risk suite
    application/
      Cargo.toml                              # archive-application library manifest
      src/
        lib.rs                                # explicit service/port export root
        request_service.rs                    # archive/restore admission and job coordination
        source_capture_service.rs             # source planning/capture/reconcile orchestration
        bundle_assembly_service.rs            # manifest revision/closure/seal orchestration
        bundle_verification_service.rs        # integrity/compatibility orchestration and read separation
        placement_service.rs                  # placement/retrieval orchestration
        lifecycle_execution_service.rs        # decision-bound lifecycle orchestration
        restore_service.rs                    # plan/material/handoff/reconcile/compensation orchestration
        archive_query_service.rs              # five no-write query compositions
        ports.rs                              # required port module root
        ports/
          store.rs                            # read capabilities plus local atomic write/UoW contracts
          support.rs                          # ID/clock/authority/visibility and restricted handle contracts
          source_export.rs                    # per-owner approved material/export required family
          integrity.rs                        # integrity/signature capability required seam
          compatibility.rs                    # schema/version compatibility required seam
          governance.rs                       # decision applicability/validity required seam
          archive_storage.rs                  # placement/retrieval/lifecycle feedback/probe seam
          restore_receiver.rs                 # per-owner handoff/outcome/probe/compensation seam
        unit_of_work.rs                       # local UoW/fixed revision/commit-unknown abstraction
        idempotency.rs                        # request/action/handoff key and input-digest coordination
        worker_control.rs                     # application-owned claim/checkpoint and bounded runner control
        errors.rs                             # application rejection/block/conflict/unknown taxonomy
      tests/
        admission_consistency.rs              # command idempotency and local atomicity risks
        query_no_write.rs                     # five Query capability isolation risks
        operation_boundaries.rs               # 17 Job bounded-progress/recovery risks
        support/
          mod.rs                              # test-only support registration
          fakes.rs                            # local port fakes; never production fallback
    infra/
      Cargo.toml                              # archive-infra library manifest
      src/
        lib.rs                                # explicit adapter/config/builder module root
        store_adapter.rs                      # Archive local store adapter; backend/schema not selected
        context_adapter.rs                    # Archive-local ID/clock; no authority fallback
        authority_adapter.rs                  # formal admission/dispatch authority and visibility scope links
        visibility_adapter.rs                 # current formal disclosure; no write or permission cache
        source_export_adapters.rs             # owner-specific bindings; all unsupported until contract closure
        integrity_adapter.rs                  # capability binding; no algorithm/key ownership
        compatibility_adapter.rs              # schema capability binding; no migration authority
        governance_adapter.rs                 # decision ref/validity binding; no policy evaluation
        archive_storage_adapter.rs            # placement/retrieval/lifecycle provider binding
        restore_receiver_adapters.rs          # per-owner receiver binding; no direct database writes
        consumer_adapters.rs                  # trusted envelope/source mapping; no Bus ack truth
        config.rs                             # RuntimeConfig groups/loader/validator type locations
        runtime_builder.rs                    # fail-closed dependency construction and capability validation
        errors.rs                             # technical failure to application error mapping
      tests/
        adapter_contracts.rs                  # adapter translation/blocked/error equivalence risks
        wiring_fail_closed.rs                 # unavailable capability and query/write isolation risks
    api/
      Cargo.toml                              # archive-api transport-neutral library manifest
      src/
        lib.rs                                # explicit handler exports; no transport server
        command_handlers.rs                   # three Command application entry handlers
        query_handlers.rs                     # five no-write Query handlers
        errors.rs                             # safe application-to-protocol error mapping
      tests/
        handler_boundaries.rs                 # command/query effect and disclosure risks
    worker/
      Cargo.toml                              # archive-worker library + binary manifest
      src/
        lib.rs                                # consumer/operation/runtime modules for composition and tests
        main.rs                               # archive-worker startup, shutdown and fail-closed wiring
        consumer_loop.rs                      # five inbound consumer dispatch loop
        consumers.rs                          # consumer handler module root
        consumers/
          archive_trigger.rs                  # formal trigger mapping; admission authority still required
          source_export_feedback.rs           # attempt/fence/source feedback correlation
          governance_change.rs                # decision change correlation; no policy interpretation
          storage_feedback.rs                 # action feedback mapping; ack is not commit
          restore_receiver_feedback.rs        # per-owner outcome mapping; success is not restored
        operation_loop.rs                     # bounded selection/lease/fence/checkpoint dispatch
        operations.rs                         # operation handler module root
        operations/
          coordination.rs                     # AdvanceArchiveJob handler
          capture.rs                          # Plan/Capture/Reconcile source handlers
          bundle.rs                           # AssembleBundleManifest/SealArchiveBundle handlers
          verification.rs                     # integrity/compatibility handlers
          lifecycle.rs                        # place/retrieve/execute/reconcile handlers
          restore.rs                          # build/prepare/dispatch/reconcile/compensate handlers
        errors.rs                             # loop/dispatch/shutdown failure mapping
      tests/
        consumer_boundaries.rs                # duplicate/out-of-order/unmatched/quarantine risks
        operation_recovery.rs                 # lease/fence/crash/commit-unknown recovery risks
```

图后说明：

- 该树只包含 planned 最小职责文件；每个文件是否拆分、公开哪些 symbol 和 member 间精确依赖留 Step 5，不能据此声称源码存在。
- `source_export_adapters.rs` 与 `restore_receiver_adapters.rs` 是 port-family 的技术落点，不表示任何具体 owner contract 已实现；关闭前 runtime builder 必须拒绝启用受影响正向路径。
- `operations/` 在 contracts 与 worker 中分别表示 protocol family 和 handler family，不是独立 Cargo `jobs` role；17 个 Job 计数由 §7.7 审计。
- 不画对象关系或运行时 sequence；这些分别属于 Step 6 和 Step 9。文件树已经是本 Step 唯一必画的结构图。

### 7.6 Root 与 member 装配文件职责

| 文件路径 | 所属单元 | 定义内容 | 主要责任 / 禁止越界 |
|---|---|---|---|
| `Cargo.toml` | workspace root | 六个 members、workspace package/toolchain 与 approved dependencies | 虚拟 workspace，无 root package；仅 Core contracts 可有 sibling path |
| `rustfmt.toml` | workspace root | 格式化意图 | 不用 unstable 选项掩盖编译/语义问题 |
| `crates/<role>/Cargo.toml` | each member | package/lib/bin targets 和最小 dependencies | 精确依赖留 Step 5；不得全员默认依赖 infra/Tokio/Core |
| `crates/<role>/src/lib.rs` | each member | 明确模块声明和受控 exports | 不使用 blanket `pub use` 暴露内部 truth/adapter |
| `crates/worker/src/main.rs` | worker | 唯一 planned process entry | 只装配/启动/停机；不实现业务规则或绕过 application |

### 7.7 文件职责与正式分母覆盖

#### 7.7.1 Contracts 与 Domain

| 文件 / 文件组 | 承接内容 | 覆盖检查 |
|---|---|---|
| `contracts/{refs,context,scope,governance_decision}.rs` | Archive typed refs、Core actor/metadata mapping、worker context，以及跨 Command/domain 共用的 `DeclaredArchiveScope` / `GovernanceDecisionRef` | shared/local/external 类型须在 Step 6/8 分流；两对象仍计入正式 26 分母且不承载 owner truth |
| `contracts/commands.rs` | 3 Command request/result families | `RequestArchive`、`RequestRestore`、`RequestLifecycleExecution` |
| `contracts/queries.rs` + `views.rs` | 5 Query selectors 和 safe response/view/page | 全部 no-write；不存在/隐藏统一安全输出 |
| `contracts/consumers.rs` | 5 个已验证本地 consumer carriers | 不复制 owner/Bus exact envelope schema |
| `contracts/operations/*` | 17 个 logical Job I/O | 六文件按 CP/职责分组，不变成 binary/API |
| `contracts/errors.rs` | public safe error | 不透出 raw source/provider/secret/隐藏 target |
| `domain/request.rs` + `job.rs` | CP1 3 个 domain 对象 | request/job/stage record 唯一落点；scope 定义在 contracts |
| `domain/source_binding.rs` + `capture.rs` | CP2 4 对象 | binding/attempt/coverage/finding 唯一落点 |
| `domain/{bundle,manifest,closure}.rs` | CP3 5 对象 | bundle/manifest/entry/closure/finding 唯一落点 |
| `domain/{verification,compatibility}.rs` | CP4 3 对象 | 两 assessment + finding 唯一落点 |
| `domain/{placement,lifecycle}.rs` | CP5 3 个 domain 对象 | placement/execution/action record 唯一落点；decision ref 定义在 contracts |
| `domain/{restore_request,restore_plan,restore_handoff}.rs` | CP6 6 对象 | request/plan/item/handoff/outcome/compensation 唯一落点 |
| `domain/errors.rs` | local invariant/transition errors | 不承载 provider error 或统一 success enum |

#### 7.7.2 Application 与 Infra

| 文件 / 文件组 | 承接内容 | 主要责任 / blocker 上限 |
|---|---|---|
| `application/request_service.rs` | ArchiveRequestService + job coordination | 受理/复用本地结果，不批准项目/治理状态 |
| `application/source_capture_service.rs` | SourceCaptureService | per-source plan/capture/reconcile；external exact contract blocked |
| `application/bundle_assembly_service.rs` | BundleAssemblyService | fixed inventory → immutable revision/closure/seal guard |
| `application/bundle_verification_service.rs` | BundleVerificationService | fixed-input assessment；读 `VerifyArchiveBundle` 不触发 assessment |
| `application/placement_service.rs` | PlacementService | placement/retrieval intent/result 与 unknown reconcile 分离 |
| `application/lifecycle_execution_service.rs` | LifecycleExecutionService | 只执行正式 decision；不选择期限/hold/delete/risk |
| `application/restore_service.rs` | RestoreService | per-owner plan/material/handoff/outcome/compensation |
| `application/archive_query_service.rs` | ArchiveQueryService | 五 Query 只读组合与 current redaction；仅 read capabilities |
| `application/ports/*` | 7 required/local port families | local need only；不声明对端存在同名 API |
| `application/{unit_of_work,idempotency,errors}.rs` | 横切的局部 transaction/key/error contract location | 只固定落点，精确契约留 Step 7/11~13 |
| `infra/store_adapter.rs` | ArchiveStorePort adapter | backend/schema/DDL 未选，不表示 durability ready |
| `infra/*_adapter*.rs` | 六类 external required seam + consumer mapping | contract/provider 未闭合时只能 disabled/blocked |
| `infra/config.rs` + `runtime_builder.rs` | config types、validation、dependency construction | 配置不创造 authority/provider/success；缺 capability fail-closed |
| `infra/errors.rs` | technical error mapping | 保存 timeout/unknown/conflict，禁止乐观扁平化 |

#### 7.7.3 API 与 Worker

| 文件 / 文件组 | 承接内容 | 主要责任 / 禁止事项 |
|---|---|---|
| `api/command_handlers.rs` | 3 Command handlers | 校验协议并调用 application；不直接 store/provider |
| `api/query_handlers.rs` | 5 Query handlers | 仅只读 service/capability；不隐式 capture/verify/retrieve/repair |
| `api/errors.rs` | safe response mapping | current disclosure，隐藏与不存在不侧漏 |
| `worker/consumer_loop.rs` + `consumers/*` | 5 Consumer handlers | trusted mapping、dedupe、unmatched/quarantine；local commit 不等 Bus ack |
| `worker/operation_loop.rs` | 17 Job 共用 selection/lease/fence/checkpoint shell | 每次有界推进，stale worker 拒绝，取消不等 rollback |
| `worker/operations/coordination.rs` | 1 Job | `AdvanceArchiveJob` |
| `worker/operations/capture.rs` | 3 Jobs | `PlanArchiveSources`、`CaptureArchiveSource`、`ReconcileSourceCapture` |
| `worker/operations/bundle.rs` | 2 Jobs | `AssembleBundleManifest`、`SealArchiveBundle` |
| `worker/operations/verification.rs` | 2 Jobs | `AssessBundleIntegrity`、`AssessBundleCompatibility` |
| `worker/operations/lifecycle.rs` | 4 Jobs | `PlaceArchiveBundle`、`RetrieveArchiveBundle`、`ExecuteArchiveLifecycle`、`ReconcileExternalAction` |
| `worker/operations/restore.rs` | 5 Jobs | `BuildRestorePlan`、`PrepareRestoreMaterial`、`DispatchRestoreHandoff`、`ReconcileRestoreHandoff`、`ExecuteRestoreCompensation` |
| `worker/main.rs` | worker binary | 装配已启用 capabilities；未闭合 required path 不得伪启动 ready |

Operations 覆盖计数为 `1 + 3 + 2 + 2 + 4 + 5 = 17`。Consumer 覆盖为 5；Command/Query 覆盖为 `3 + 5`。本树没有 outbound event/outbox/publisher 文件，符合 `AR-HLD-Q-001` 的关闭前上限。

### 7.8 测试发现与证据边界

| planned test file | Cargo owner | 风险切口 | 当前不可声称 |
|---|---|---|---|
| `contracts/tests/protocol_boundaries.rs` | archive-contracts | typed carrier、安全序列化、external schema 不伪造 | exact owner/Bus/provider contract 通过 |
| `contracts/tests/protocol_boundaries.rs` + `domain/tests/domain_invariants.rs` | archive-contracts + archive-domain | 2 个跨层 value/ref 对象与 24 个 domain 对象的不变量、closure/authority/per-owner 红线 | 完整 Step 16 case 或测试已运行 |
| `domain/tests/state_axis_boundaries.rs` | archive-domain | 多轴状态与禁止推导 | acceptance verdict |
| `application/tests/admission_consistency.rs` | archive-application | admission/idempotency/local atomic risk | durable transaction ready |
| `application/tests/query_no_write.rs` | archive-application | 五 Query 无写能力 | current external authorization 已集成 |
| `application/tests/operation_boundaries.rs` | archive-application | 17 Job bounded/probe/retry/compensation | provider/receiver success |
| `infra/tests/adapter_contracts.rs` | archive-infra | adapter translation 与 fail-closed | external contract pass（blocker 未闭合） |
| `infra/tests/wiring_fail_closed.rs` | archive-infra | missing capability、query/write isolation | deployment readiness |
| `api/tests/handler_boundaries.rs` | archive-api | Command/Query effect 分离与安全错误 | HTTP/RPC conformance |
| `worker/tests/consumer_boundaries.rs` | archive-worker | duplicate/out-of-order/unmatched/quarantine | Bus ack/delivery proof |
| `worker/tests/operation_recovery.rs` | archive-worker | lease/fence/crash/commit-unknown | real recovery/RTO evidence |

所有测试入口位于具体 Cargo package 下；`tests/support` 只由 application test 显式导入，不进入生产 `lib.rs`。本 Step 不创建 scripts/artifacts/reports：它们是否是交付物及命令合同需 Step 16/05~07 才能确定。

### 7.9 命名与依赖检查表

| 检查项 | 通过条件 | 本步结果 |
|---|---|---|
| 设计仓目录 | `projects/L4-archive` | pass；只用于设计导航 |
| planned 实现仓 | `/home/aris/Projects/quantalithos-archive` | pass_as_plan；当前不存在，未创建 |
| project slug | `archive` | pass |
| member 目录 | `crates/<role>` 且不重复项目前缀 | pass；六个短 role |
| Cargo package | `archive-<role>` kebab-case | pass |
| Rust library crate | `archive_<role>` snake_case | pass |
| binary | 表达用户/运行入口 | pass；仅 `archive-worker` |
| 文件/module | `snake_case` 且表达具体职责 | pass；无顶层 `utils/common/helper/manager` |
| 架构层级泄漏 | 不含 `L0/L1/L4/l0_/l1_/l4_` | pass |
| worker/jobs 同义冲突 | 同类常驻入口只使用一个 role | pass；不创建 `jobs` crate |
| compile dependency | 只有核验 `core-contracts` 可进入 | pass_with_recheck_gate |
| runtime/event/ref/adapter | 不进入 sibling Cargo dependency | pass |
| outbound candidate | 合同前无 event/outbox/publisher 文件 | pass_with_AR-HLD-Q-001 |
| external adapter | 文件存在不表示 exact contract/provider ready | pass_with_AR-UP-001~009 |
| tests | 每个 suite 有具体 member owner | pass_as_plan；未运行 |

### 7.10 CP、对象、接口与文件闭环审计

| 审计维度 | 分母 | 文件落点 | 结果 |
|---|---:|---|---|
| CP | 6 | contracts 跨层 value/ref + domain 主语文件 + 8 application service family + worker operations | pass；未按 CP 拆 crate |
| 正式对象 | 26 | contracts 2 个正式对象文件 + domain 14 个主语文件 | pass；`2 contracts + 24 domain = 26`，每对象唯一；修复 public DTO 对 domain 的反向依赖风险 |
| Command | 3 | contracts commands + api command handlers + request/lifecycle/restore services | pass |
| Query | 5 | contracts queries/views + api query handlers + archive query service | pass；no-write 隔离 |
| Consumer | 5 | contracts consumers + worker consumers 五文件 | pass |
| Operations Job | 17 | contracts/operations 六组 + worker/operations 六组 | pass；`1+3+2+2+4+5=17` |
| Required/local ports | 7 | application/ports 七文件 + infra adapter 落点 | pass_with_external_blockers |
| Outbound candidate | 3 | 无 production 文件 | pass；按 blocker 保持不实现 |
| Source authority class | 8 | source binding/capture/manifest + source adapter family | pass；workspace 仍 Auxiliary |
| 测试风险入口 | 11 | 六 member 的 package-local tests | pass_as_plan；非 Step 16 完整 case |

闭环只证明布局可承接正式 02，不证明后续字段、trait、协议、事务或测试已经完成。Step 5 必须继续定义每个 crate/module 的 exports 和依赖；若发现对象/入口/状态主语需要改变，应回退正式 02，而不是在布局树中新增。

## 8. 后置历史材料审计

| 历史材料 | 污染布局 / 主语 | 当前替换或排除 |
|---|---|---|
| 旧 `03-详细设计.md` §1/§3 | 单体目录围绕 index/retention/legal hold/retrieval 展开 | 不继承；用六技术 role 和正式 26 对象重推 |
| 旧 `application/index_service.rs` | `BuildArchiveIndex` / cold query 成为核心写链 | 不创建；查询只组合 Archive-owned state，索引实现留 Step 11 且不是新 truth |
| 旧 `retention_service.rs` / lifecycle objects | 本仓拥有 `RetentionClass`、`LegalHold`、`PurgeEligibility` | 不创建；只保留 `GovernanceDecisionRef`、decision port 和 execution guard |
| 旧 storage/security layout | 固定 S3/MinIO/Glacier、AES/SHA/provider | 只保留 provider-neutral adapter/capability seam，算法与产品 blocked |
| 旧 RPC/topic/events | 预设 route/topic/publish | api transport-neutral；consumer local carrier；无 outbound files |
| README/draft | 技术栈、性能、7 年、UI/RCA/search 文件候选 | 不进入 planned 树；分别等待 04~07、workload 或需求重开 |
| 参考项目 Step 4 | 七 role、jobs/outbox 等既有选择 | 只借粒度；Archive 根据常驻作业与 outbound blocker 裁剪为六 role |

旧文件仍保留原状作为 historical material；正式 Step 19 才允许删除并重建 `03-详细设计.md`。本轮没有从旧文件复制任何业务主语或技术产品选择。

## 9. 回填草稿

### 9.1 实现单元与文件布局

目标实现仓计划为 `/home/aris/Projects/quantalithos-archive`，遵循 `standards/document/子项目目录与代码文件组织规范.md`，采用 workspace 多 crate 架构。六个技术 role 为 contracts、domain、application、infra、api 和 worker；它们承载六 CP 的跨层实现，不与 CP 一一映射。`archive-api` 保持传输无关 library；`archive-worker` 是唯一 planned 常驻 binary，统一承载五个 Consumer 与十七个 logical Operations Job。

只有真实 `core-contracts` 是 sibling compile dependency candidate；所有 owner、Bus、workspace、artifact、observability、SDK、provider 与 receiver 关系都留在 port/adapter/event/ref 边界。目标实现仓目前不存在，本文所有文件均是计划契约而非现状；external adapter 文件也不表示合同或 provider ready。

布局形态、映射、依赖方向与文件树采用本 Step §7.1~§7.5；文件职责、测试落点和命名审计采用 §7.6~§7.10。

## 10. 待确认事项、完成门禁与停审

### 10.1 待确认与后续回退点

| 待确认项 | 当前安全处置 | 后续关闭 / 回退规则 |
|---|---|---|
| API transport/host 与是否需要 binary | 仅 library handlers，无 routes/server | Step 7/8/14 或正式 host contract；若新增 binary 回审本 Step |
| 17 Job 是否需要独立 one-shot 运维入口 | 统一常驻 worker logical handlers，不暴露 17 binaries | 真实调度/运维合同证明需要时回审角色与安全入口 |
| store backend/schema/migrations | 只列 `store_adapter.rs` | Step 11/14；不能从文件名推导 DB 已选 |
| external owner/provider/receiver exact adapters | family 文件 + disabled/blocked wiring | `AR-UP-001~009` 分别由 owning authority 关闭 |
| outbound event/outbox/publisher | 不进入布局 | `AR-HLD-Q-001` 关闭后先回退 02 Step 6~9，再重审 Step 4 |
| Core member 具体引用集合 | root path 可用，member 不默认全引 | Step 5/6/8 逐 symbol 与 dependency matrix 收缩 |
| scripts/reports/artifacts/deployment | 当前不创建 | Step 16、05~07 或部署设计证明为交付物后补 |

### 10.1.1 Step 5 反查修正（2026-09-10）

Step 5 做 public surface / Cargo dependency 闭环时发现：`DeclaredArchiveScope` 与 `GovernanceDecisionRef` 同时进入正式 Command 输入；若只定义在 domain，会迫使 `archive-contracts` 反向依赖 `archive-domain`，或产生同名 shadow DTO。现将两者的 planned definition owner 修正为 `archive-contracts`，domain 直接消费同一 immutable value/ref。正式对象总数、CP 归属和业务语义不变；`DeclaredArchiveScope` 仍只校验声明形状，`GovernanceDecisionRef` 仍只绑定 owner-issued decision，不获得 policy/hold/delete/risk authority。

### 10.2 完成门禁

Step 07 反查补充（2026-09-11）：新增 planned `application/src/ports/support.rs`、`application/src/worker_control.rs` 与 `infra/src/{context_adapter,authority_adapter,visibility_adapter}.rs` 五个文件职责。claim/checkpoint 持久 carrier 归 application-local，worker 只导入；authority/visibility 为独立技术 runtime slot。六 crate、26 正式对象、30 入口、7 业务/local port family 不变，未创建源码。Core symbol 只由 contracts 显式 re-export，其他 member 不因代码片段路径增加 Core direct dependency。

| 门禁 | 结论 |
|---|---|
| SOP 十三问 | 全部回答 |
| 必需输出 | 布局决策、实现单元、package/crate/binary 映射、文件树、职责表、命名表、path dependency 表齐全 |
| 可直接创建 | planned 路径明确且每个文件有责任；没有依赖未定义对象全集来理解目录 |
| 正式分母 | 6 CP、26 对象、30 入口、7 ports 全覆盖；3 outbound candidates 明确排除 production path |
| 边界 | 无 owner truth、governance decision、Artifact body/lineage、workspace canonical、observability backend 或 SDK/provider 反向依赖 |
| 事实诚实 | 目标仓不存在；未声称 Cargo、源码、测试、provider、bundle、digest、commit、handoff 或 readiness 存在/成功 |
| 当时授权与当前修正 | Step 4 原始完成后已停审且当时未创建 Step 5；当前仅接受 Step 5 对两对象 definition owner 的反查修正，正式 03 仍未修改 |

`gate_status = completed / pass_with_upstream_blockers / reviewed_by_step_5`。本步原始停审已履行；Step 5 仅校正了跨层 value/ref 的 definition owner，未改变六 role、CP、对象总数、入口或 port 分母。对象/trait/协议的精确内容仍须 Step 6 以后完成。
