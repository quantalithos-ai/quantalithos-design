# L2-member 03 详细设计 Step 4：收稳实现单元与文件布局

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4
> 对应正式回填章节：未来 `03-详细设计.md` §4“实现单元与文件布局”
> 生成日期：2026-08-26
> 状态：`completed / pass_with_upstream_blockers / stop_review`
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`；本文件是 planned layout，不创建实现仓、Cargo 文件或源码。

## 1. Step 状态与开工确认

### 1.1 Step 内计划

| 子阶段 | 可审查产物 | 状态 | 结论 |
|---|---|---|---|
| 输入恢复 | 项目台账、03 flow、Step 2~3、概要设计代码主体 | completed | 只承接 CP01~CP07 与正交实现分层；不把旧 03 当作目录基底。 |
| 目录规范与真实路径核验 | Step 4 SOP、详细设计书写规范 §5.4、目录组织规范、Core manifest | completed | 目标仓缺失；唯一已核验的 sibling Cargo 路径仍是 `core-contracts`。 |
| 布局取舍 | 单 crate、workspace、按 CP 拆 crate、固定 binary 方案比较 | completed | 选择 planned workspace 多 crate；不把 CP、transport 或 process 机械绑定为 crate / binary。 |
| 实现单元与文件职责 | member 映射、planned 文件树、职责表、命名检查 | completed | 七个 crate、无已锁定 binary、无 concrete transport adapter。 |
| 静态审计与停审 | 依赖分类、历史污染、未定边界、写入权限检查 | completed | 可进入 Step 5 的内容门禁已具备；用户授权上限要求本 Step 后立即停审。 |

### 1.2 输入与效力

| 输入 | 本 Step 的使用方式 | 不从中推导的内容 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 固定 CP01~CP07、九个 Application Service、`10 / 16 / 14 / 24 / 5` 接口分母与条件范围。 | 已经存在的模块、测试、binary 或集成。 |
| `03_ddd_step_03_constraints.md` | 承接 planned Rust 2024、Core-only compile、目标仓缺失、物理运行形态未选。 | HTTP / gRPC / UDS、DB、queue、scheduler、进程拓扑或真实 Cargo manifest。 |
| `02-概要设计.md` §4~§5、§7~§12 | 将双轴的业务组成部分与实现分层落到 crate / file 承载面。 | 新业务组成部分、外部 schema、owner 或正常传播方向。 |
| `02_hld_step_04_code_subject_framework.md`、`02_hld_step_12_detailed_design_handoff.md` | 校验入口、Application、Domain、Port、Store、Projection、Handoff 的正交关系。 | 具体 trait 方法、DTO 字段、transaction、state matrix 或 adapter activation。 |
| `L1-governance` Step 4 | 参考 workspace 多 crate 的分层粒度和命名纪律。 | Governance 的 domain 文件、GRC adapter、job、binary 或 source owner。 |
| `L2-runtime`、`L2-tools` Step 4 | 参考 Core-only compile、planned target repo 与 entry crate 的保守表达。 | Runtime / Tools 的 crate、domain、协议、执行职责或 binary。 |
| `子项目目录与代码文件组织规范.md` | 约束仓名、`crates/<role>`、package、crate、binary、文件命名。 | 为尚未确认的脚本、artifacts、reports、deploy 文件建立空目录。 |

### 1.3 本 Step 的边界

- 目标实现仓规划路径为 `/home/aris/Projects/quantalithos-member`，经 Step 3 核验当前不存在；本文件中的全部路径都是 `planned`。
- 本 Step 只确定实现单元、职责目录和文件归位，不定义 Rust struct、trait 函数、DTO schema、state transition、store method、transport adapter 或 test case。
- `L2M-UP-001~008` 继续阻塞 host / image / Runtime / Core member event / credential / rule taxonomy / third-subject 的正向合同；布局只能为 local、fake 或 blocked-aware code 留出位置。
- 旧 README、旧正式 `03-详细设计.md` 中的 Rust facade、UDS、gRPC、AG-UI、CloudEvents route、launch token、supervisord、DB / broker / cache 与 binary 结构仍为 historical material，零继承权。

## 2. SOP 问题回答

### 2.1 本轮包含哪些 crate、package、binary 与 library？

采用 **workspace 多 crate 架构**。业务组成部分不是 crate 边界；CP01~CP07 横跨 contracts、domain、application、infra 与逻辑入口 crate。最小 planned member 集合为：

- `contracts`：本仓 semantic Command / Query / Consumer / Event / Job / View / Receipt / Error carrier 与 local typed ref；不 shadow 外部 owner schema。
- `domain`：CP01~CP07 的 local truth、support truth、derived-read policy、append / successor invariant 与 domain error。
- `application`：九个 Application Service、entry-facing facade、Port / Store、UoW、idempotency 与 use-case 编排。
- `infra`：本仓技术 Store、blocked seam implementation、config candidate、runtime builder、Clock / ID adapter；不选择 physical product。
- `api`：Command / Query 的 transport-neutral entry translation；不是 HTTP、RPC server 或已启动的进程。
- `worker`：Consumer / feedback / committed-fact 的 transport-neutral dispatch 与 local continuation dispatch；不是已确认的常驻进程。
- `jobs`：五类 Operations Job 的 logical runner；不是已确认的 binary、scheduler 或定时任务。

`api`、`worker`、`jobs` 都只规划为 library crate；当前 **没有** 已锁定的 binary。以后若 owner contract 或部署决策需要 binary，必须以真实用户入口或具体 action 命名，并回开本 Step；不能把本表的逻辑入口误读为 process topology。

### 2.2 每个实现单元如何承接概要设计代码主体？

| 实现单元 | 类型 | 承接的代码主体 | 职责上限 | 对应概要设计 |
|---|---|---|---|---|
| `contracts` | library crate | Command / Query / Consumer / semantic Event / Job / View / Receipt boundary | 定义 member-owned semantic carrier 和 local ref；不定义 external exact envelope / route。 | §7、§12 |
| `domain` | library crate | CP01~CP07 的 record、policy、history、projection-state / read policy | 只保存本仓 local / support / derived-read truth；不读 I/O、config 或 transport。 | §4.2、§5、§6、§9 |
| `application` | library crate | Presence、Host Collaboration、Subscription Scope、Inbound Boundary、Runtime Mediation、Outbound Boundary、Interaction Trace、External Context Mirror、Member Read Model services | 编排 Domain、Port、UoW 与 local continuation；不拥有外部 truth。 | §4.2、§5、§8 |
| `infra` | library crate | Store / projection / continuation 的技术承载，blocked seam、runtime builder | 实现 inward Port；不把 local adapter 成功升级为 host / Runtime / Bus / downstream 成功。 | §4.2、§7、§11 |
| `api` | library crate，logical inbound | `PresenceCommandApi`、`RuntimeDeliveryCommandApi`、`InteractionTraceQueryApi`、`MemberQueryApi` 的 entry conversion | 只把已确认的 logical request / query 调入 application facade；不选择 route / transport。 | §4、§7 |
| `worker` | library crate，logical inbound / continuation | 14 个 owner-specific Consumer 的 dispatch、feedback / committed-fact re-entry、continuation dispatch | 校验并翻译已确认 logical input；不直接 mutation Store 或定义 generic provider. | §4、§7、§8 |
| `jobs` | library crate，logical operations | `PublicationRelayJob`、`ObservationRelayJob`、`ExternalContextRefreshJob`、`MemberProjectionRebuildJob`、`GapReconciliationJob` | 只继续 committed local fact 的 relay / refresh / rebuild / reconcile；不修复 source truth。 | §4、§7、§8 |

### 2.3 哪些文件必须创建，哪些必须保持为后续受控扩展？

| 类别 | 本 Step 的布局结论 | 创建 / 扩展门禁 |
|---|---|---|
| workspace bootstrap | root `Cargo.toml`、七个 member 的 `Cargo.toml` 与 `src/lib.rs` 是未来目标仓首次创建时的最小骨架。 | 仅在正式 03~07 完成且获得独立实现授权后创建；当前禁止写实现仓。 |
| stable responsibility files | 下文树中的 CP、service、store、entry 与 job 文件是已收稳业务 / 分层责任的 planned file group。 | 具体对象、trait、schema、function 与 tests 分别受 Step 5~16 约束；不能因文件已规划而抢先写 code。 |
| external source adapter | 不在当前树中预建 concrete carrier adapter。`infra/src/blocked_seams.rs` 只提供 fail-closed logical Port implementation slot。 | 获得 source-specific owner contract 后，先重开 Step 4 / 7，再加入命名为该 source 的 adapter 文件。 |
| binary / route / scheduler | 没有 `src/bin/`、`routes.rs`、runtime server、worker loop、cron / scheduler 文件。 | 需要 physical topology、transport、host / Runtime / Bus contract 的正式 authority 后再设计。 |
| persistence product / migrations | 没有 `migrations/`、SQL、ORM、table、cache 或 broker 文件。 | Step 11 与相应技术 / configuration authority 收稳后才可决定。 |
| scripts / artifacts / reports | 当前不规划 `scripts/`、`artifacts/`、`reports/`。 | 只有后续测试、验收、实施计划确认其为交付物时才按目录规范添加具体文件。 |

### 2.4 project slug、目录、package、crate 与 binary 命名如何确定？

```text
design directory      = projects/L2-member
implementation repo   = /home/aris/Projects/quantalithos-member   (planned; missing)
project slug          = member
workspace member root = crates/<role>
```

- `L2` 只用于设计仓导航，不能进入实现仓、package、crate、module、file、type、function、test 或 binary 名称。
- Cargo package 使用 `member-<role>`；Rust library crate 使用 `member_<role>`；member 目录只用短职责名，如 `crates/domain`，不重复 `member` 或 `quantalithos` 前缀。
- binary 当前统一为 `none planned`。未来只有确立物理入口后，才可使用 `member-api`、`member-worker` 或具体 action 名；此处不预设任何名称或路径。
- 设计文档可用中文说明；未来 Rust identifier、source comment、rustdoc 与 test name 仍必须遵守 Step 3 所承接的 English-only 规则。

### 2.5 哪个 Cargo.toml 可以使用 sibling path dependency？

唯一已核验且允许写入 planned Cargo 的 sibling relation 是 Core contracts。未来 workspace root `Cargo.toml` 可包含：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

这个路径对应实际存在的 `/home/aris/Projects/quantalithos-core/crates/contracts`、Cargo package `core-contracts` 与 Rust crate `core_contracts`。具体哪些 member 使用 `core-contracts.workspace = true` 留待 Step 5 的 crate dependency matrix，不由本 Step 假定所有 crate 都需要它。

`L0-bus`、`L0-sdk`、`L1-work`、`L1-identity`、`L1-governance`、`L1-conversation`、`L1-artifact`、`L2-runtime`、`L2-tools`、`L2-member-service`、`L2-member-images` 与任何外部系统不得出现于 path dependency 表。它们分别属于 runtime、event、ref、adapter、fake 或 persistence 关系，只能在后续 Port / adapter / event / projection / fake 契约中表达。

## 3. 布局取舍与当前材料诊断

### 3.1 布局形态决策

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | CP01~CP07 同时有 public semantic carrier、强 domain purity 需求与 API / Consumer / Job 三类逻辑入口；仅靠 review 难以守住依赖方向。 | 不采用单一 `src/` 承载全部层。 |
| workspace 多 crate 架构 | 是，planned | `contracts`、`domain`、`application`、`infra` 与三类 logical entry 可由 Cargo 边界表达，且与 L1-governance 的层级粒度一致。 | 需建立七 member workspace；实际 manifest / build 仍未发生。 |
| 每个 CP 一个 crate | 否 | CP 是业务责任轴，跨 Domain、Application、Port、Store 与 entry；按 CP 拆 crate 将制造循环依赖并诱发 mega adapter。 | CP 通过 module / service / file group 表达，不成为 package。 |
| 固定 API / worker / jobs binary 或一个 facade process | 否，保持 pending | `L2M-UP-001~005` 未闭口，transport、host lifecycle、scheduler、process topology 都没有 authority。 | 入口 crate 只保留 library boundary；不出现 binary 文件。 |
| 额外 `config`、`observability`、`common`、`utils` crate | 否 | 当前没有已确认的跨 crate compile reuse；`common` / `utils` 会掩盖 owner。 | config / builder 留 `infra`；观测 handoff 由 application / infra 的明确职责文件承接。 |

### 3.2 依赖方向（planned crate boundary）

```text
core-contracts
      ^
      |
  contracts
      ^
      |
    domain
      ^
      |
 application  <---- infra implements application-owned ports
      ^                    ^
      |                    |
 api / worker / jobs -------+
```

关键说明：

- 箭头表示 Cargo / code dependency 的允许方向，不表达 network、event route、Runtime handoff、host IPC 或 process topology。
- `contracts` 可引用 Core shared primitive；`domain` 不能引用 infra、entry、transport、config 或 external sibling；`application` 定义 Port / UoW / idempotency，不能引用 concrete infra。
- `infra` 只能向内实现 application-owned Port；`api`、`worker`、`jobs` 只通过 builder / facade 调 application，禁止直写 Store 或 mutation Domain object。
- Step 5 才会形成逐 crate 的精确 dependency matrix；本图不是“所有箭头都已经写入 Cargo”的事实。

### 3.3 历史材料差异审计

| 历史 / 未定倾向 | 风险 | 本 Step 处置 |
|---|---|---|
| 旧 03 的 persona、endpoint、capability、execution-binding、summary 五模块 | 少于当前 CP01~CP07，且混入 identity / Runtime / capability truth。 | 不继承任何目录或文件名；按业务责任与分层双轴重建。 |
| 旧 README 的单 Rust facade、UDS / gRPC、supervisord、固定 port | 将 physical carrier 与 process topology伪装为本仓事实。 | `api` / `worker` / `jobs` 仅有 library crate，无 `bin/`、route 或 transport 文件。 |
| 按七个 CP 建七个 crate | 把业务责任轴变成 compile boundary，容易产生反向依赖。 | CP 仅在 domain / application / worker 文件组中落位。 |
| 以 `common`、`utils`、generic provider / listener 收纳 external relation | 混淆 source owner，可能偷渡 MCP / A2A / API adapter。 | 不建立此类目录；unclosed source 仅进入 `application::ports` 和 `infra::blocked_seams`。 |
| 因本机存在 sibling repo 而加入 Cargo | 把 runtime / event / ref 关系伪装成 compile dependency。 | root 仅有真实 `core-contracts` path candidate；其余完全排除。 |

## 4. 结构化中间产物

### 4.1 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| workspace root | Cargo workspace | 收拢 seven planned member、Rust 2024 / MSRV inheritance 与唯一 Core dependency alias。 | §4、Step 3 约束 |
| `contracts` | library crate | member-owned semantic protocol carrier、typed ref、metadata、read view、safe error / receipt。 | §7、§12 |
| `domain` | library crate | CP01~CP07 local / support / derived-read object group、policy、history invariant。 | §5、§6、§9 |
| `application` | library crate | 九个 Application Service、facade、Port / Store、UoW、idempotency、local-first orchestration。 | §4、§5、§8 |
| `infra` | library crate | backend-neutral local store、projection / continuation / idempotency implementation slots、blocked seam、builder。 | §4、§7、§11 |
| `api` | library crate | Command / Query logical entry mapping。 | §4、§7 |
| `worker` | library crate | owner-specific Consumer / feedback dispatch 与 local continuation dispatch。 | §4、§7、§8 |
| `jobs` | library crate | 五类 Operations Job runner。 | §4、§7、§8 |
| `tests/` | future test layout, not a crate | 按 contracts / domain / application / seams / projection / support 分组承接未来 Step 16。 | §12；Step 16 future |

### 4.2 目录 / Cargo package / Rust crate / binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `member-contracts` | `member_contracts`; binary: none | 仅 member semantic contract、local ref、metadata、safe read / receipt / error carrier。 | workspace 内可复用；不承诺跨仓直接依赖或发布。 |
| `crates/domain` | library crate | `member-domain` | `member_domain`; binary: none | CP01~CP07 的 domain object group、policy、invariant、domain error。 | 否。 |
| `crates/application` | library crate | `member-application` | `member_application`; binary: none | Application Service、facade、Port / UoW / idempotency contract 与 orchestration。 | 否。 |
| `crates/infra` | library crate | `member-infra` | `member_infra`; binary: none | local Store、blocked seam、config candidate、builder、technical adapters。 | 否。 |
| `crates/api` | logical entry library crate | `member-api` | `member_api`; binary: none planned | Command / Query entry mapping；无 route / framework / server assumption。 | 否。 |
| `crates/worker` | logical entry library crate | `member-worker` | `member_worker`; binary: none planned | Consumer、feedback、committed-fact 与 continuation dispatch。 | 否。 |
| `crates/jobs` | logical operations library crate | `member-jobs` | `member_jobs`; binary: none planned | relay / refresh / rebuild / reconcile runner。 | 否。 |

### 4.3 planned 文件布局树

下列树是目标实现仓未来创建时的文件边界，不表示当前文件存在。`tests/` 只保留分类目录；具体测试文件、fixture、script、artifact 与 report 必须等待 Step 16、05~07 的独立门禁。

```text
quantalithos-member/                                      # planned implementation repository
  Cargo.toml                                              # workspace members, Rust baseline, Core alias only
  crates/
    contracts/
      Cargo.toml                                          # member-contracts manifest
      src/
        lib.rs                                            # public module exports and crate rustdoc
        refs.rs                                           # member-local IDs and typed external-ref wrappers
        metadata.rs                                       # correlation, actor, idempotency and safe metadata carriers
        commands.rs                                       # semantic Command request / result carriers
        queries.rs                                        # semantic Query request / response carriers
        consumers.rs                                      # logical Consumer input / disposition carriers
        events.rs                                         # local semantic Event candidates, never a route
        jobs.rs                                           # logical Job input / report carriers
        views.rs                                          # body-free summary, outlet and diagnostic read carriers
        receipts.rs                                       # Consumer / handoff receipt and quarantine-safe carriers
        errors.rs                                         # protocol-safe error codes and redacted details
    domain/
      Cargo.toml                                          # member-domain manifest
      src/
        lib.rs                                            # domain exports
        invariants.rs                                     # cross-CP owner, subject, body-free and history guards
        presence_host.rs                                  # CP01 object / policy group
        inbound.rs                                        # CP02 object / policy group
        runtime_mediation.rs                              # CP03 object / policy group
        outbound.rs                                       # CP04 object / policy group
        interaction_trace.rs                              # CP05 object / policy group
        external_context_mirror.rs                        # CP06 object / policy group
        read_model.rs                                     # CP07 projection-state / read-policy group
        errors.rs                                         # DomainError group
    application/
      Cargo.toml                                          # member-application manifest
      src/
        lib.rs                                            # application exports
        facade.rs                                         # entry-facing routing to named services, never a mega owner
        presence_service.rs                               # PresenceApplicationService use cases
        host_collaboration_service.rs                     # HostCollaborationService use cases
        subscription_scope_service.rs                     # SubscriptionScopeService use cases
        inbound_boundary_service.rs                       # InboundBoundaryService use cases
        runtime_mediation_service.rs                      # RuntimeMediationService use cases
        outbound_boundary_service.rs                      # OutboundBoundaryService use cases
        interaction_trace_service.rs                      # InteractionTraceService use cases
        external_context_mirror_service.rs                # ExternalContextMirrorService use cases
        member_read_model_service.rs                      # MemberReadModelService use cases
        ports/
          mod.rs                                          # explicit Port module exports
          stores.rs                                       # local truth, support, projection and continuation Store traits
          sources.rs                                      # owner-specific safe source / resolver Port traits; no generic hub
          handoff.rs                                      # host, publication and observation logical handoff Port traits
          technical.rs                                    # Clock, ID and other technical Port traits
        unit_of_work.rs                                   # local atomicity boundary, not distributed transaction
        idempotency.rs                                    # local key / digest / duplicate result boundary
        errors.rs                                         # ApplicationError group
    infra/
      Cargo.toml                                          # member-infra manifest
      src/
        lib.rs                                            # infra exports
        config.rs                                         # typed effective-config candidate and validation boundary
        runtime_builder.rs                                # composition root; rejects missing required logical slots
        local_truth_store.rs                              # CP01~CP05 local truth / history Store implementations
        support_truth_store.rs                            # CP06 support truth Store implementation slot
        projection_store.rs                               # CP07 rebuildable projection Store implementation slot
        continuation_store.rs                             # local attempt / gap continuation carrier, not a broker / outbox product
        idempotency_store.rs                              # idempotency persistence implementation slot
        blocked_seams.rs                                  # fail-closed Port implementations while exact source contracts are pending
        clock_id.rs                                       # Clock and ID implementation slots
        errors.rs                                         # InfraError group
    api/
      Cargo.toml                                          # member-api manifest
      src/
        lib.rs                                            # logical API entry exports
        command_entry.rs                                  # Command DTO to application facade mapping
        query_entry.rs                                    # Query DTO to application facade mapping
        errors.rs                                         # protocol disposition mapping without transport status assumption
    worker/
      Cargo.toml                                          # member-worker manifest
      src/
        lib.rs                                            # logical worker entry exports
        presence_host.rs                                  # CP01 host feedback dispatch
        inbound.rs                                        # CP02 inbound fact dispatch
        runtime_mediation.rs                              # CP03 Runtime material dispatch
        outbound.rs                                       # CP04 delivery feedback dispatch
        interaction_trace.rs                              # CP05 committed-fact / observation feedback dispatch
        external_context_mirror.rs                        # CP06 owner-specific source update dispatch
        read_model.rs                                     # CP07 committed-fact / resolution update dispatch
        continuation_dispatch.rs                           # committed local continuation dispatch, no scheduler loop
        errors.rs                                         # worker boundary error classification
    jobs/
      Cargo.toml                                          # member-jobs manifest
      src/
        lib.rs                                            # logical job runner exports
        publication_relay.rs                              # PublicationRelayJob logical runner
        observation_relay.rs                              # ObservationRelayJob logical runner
        external_context_refresh.rs                       # ExternalContextRefreshJob logical runner
        projection_rebuild.rs                             # MemberProjectionRebuildJob logical runner
        gap_reconciliation.rs                             # GapReconciliationJob logical runner
        errors.rs                                         # job execution-disposition mapping
  tests/
    contracts/                                            # future protocol / carrier test slices
    domain/                                               # future invariant / state test slices
    application/                                          # future command / query / consumer / job flow slices
    seams/                                                # future blocked-aware Port / fake slices
    projection/                                           # future rebuild / no-write / freshness slices
    support/                                              # future fixtures and deterministic fakes
```

### 4.4 文件职责表

| 文件路径 | 所属实现单元 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | member 列表、workspace Rust baseline、唯一 Core alias | 只定义 workspace 和 `core-contracts` shared dependency，不列 runtime / event sibling。 |
| `crates/contracts/src/refs.rs` | contracts | local IDs、typed external refs、purpose / reason marker slots | 避免把 external owner object 或 untyped string 纳入 member domain。 |
| `crates/contracts/src/metadata.rs` | contracts | correlation、actor、idempotency、safe metadata | 不携带 raw body、credential 或 transport header。 |
| `crates/contracts/src/commands.rs`、`queries.rs` | contracts | semantic read / write carrier | 只定义 member boundary，不写 application behavior。 |
| `crates/contracts/src/consumers.rs`、`receipts.rs` | contracts | logical Consumer input、receipt、quarantine-safe disposition | 不确定 external envelope / route，不修改 source truth。 |
| `crates/contracts/src/events.rs`、`jobs.rs` | contracts | local semantic event candidate、job input / report carrier | 不表示 Bus route、delivery、scheduler 或 evidence。 |
| `crates/contracts/src/views.rs`、`errors.rs` | contracts | body-free views、safe error code / details | 保持 Query no-write 与 redaction boundary。 |
| `crates/domain/src/invariants.rs` | domain | cross-CP subject / owner / body-free / append-history guards | 不是 `common` bucket，不读取 external data。 |
| `crates/domain/src/presence_host.rs` 至 `read_model.rs` | domain | 分别承载 CP01~CP07 对象组和 policy group | 每个 CP 的 object schema / state / method 由 Step 6 / 10 再收稳。 |
| `crates/domain/src/errors.rs` | domain | `DomainError` group | 不泄露 adapter / backend error。 |
| `crates/application/src/facade.rs` | application | entry-facing service routing | 不代替九个服务，不持有 truth 或 generic `MemberService`。 |
| `crates/application/src/*_service.rs` | application | 九个命名 Application Service 的 use-case group | 只编排 Domain、Port、UoW、idempotency；不直接使用 concrete infra。 |
| `crates/application/src/ports/*.rs` | application | application-owned Store、source、handoff、technical trait group | source traits必须 owner-specific，不建立 generic provider / listener。 |
| `crates/application/src/unit_of_work.rs`、`idempotency.rs` | application | local atomicity、stored result、duplicate / conflict boundary | 不构成 distributed transaction、cache 或 blind replay。 |
| `crates/infra/src/local_truth_store.rs`、`support_truth_store.rs`、`projection_store.rs` | infra | local / support / derived-read technical Store slots | 不选择 DB、schema、table、index 或复制 external truth。 |
| `crates/infra/src/continuation_store.rs` | infra | local attempt / gap continuation carrier | 不等同 Broker、Bus delivery、outbox product或 retry scheduler。 |
| `crates/infra/src/blocked_seams.rs` | infra | pending source 的 fail-closed / blocked / waiting implementation slot | 不构造 carrier、default-pass、fake success 或 generic adapter。 |
| `crates/infra/src/config.rs`、`runtime_builder.rs` | infra | typed config candidate、dependency assembly | config 不改变 invariant；builder 不假定 process / transport。 |
| `crates/api/src/command_entry.rs`、`query_entry.rs` | api | entry carrier 到 facade 的 translation | 不定义 HTTP route、RPC method、server lifecycle或 direct Store access。 |
| `crates/worker/src/<cp>.rs` | worker | CP01~CP07 owner-specific Consumer / feedback dispatch | 不覆盖 local source decision、不给 external feedback 赋予 truth。 |
| `crates/worker/src/continuation_dispatch.rs` | worker | 已提交 local attempt / gap continuation dispatch | 不选择 polling、queue、worker loop、retry policy 或 scheduler。 |
| `crates/jobs/src/*.rs` | jobs | 五类 Operations Job logical runner | 不创建 source truth、不把 job report 写成 execution evidence。 |
| `tests/**` | future test layout | fixture、fake、contract / invariant / flow / seam / projection slice | 不在本 Step 命名 case、script、run、artifact、report 或 result。 |

### 4.5 本地多仓 compile dependency 位置

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | planned path dependency 写法 | 影响的实现单元 | 说明 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile | future root `Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 首先是 contracts；其他 member 仅在 Step 5 确认需要时通过 workspace alias 引用 | 路径来自真实 Core layout；不等于 member-specific Core schema / event route 已闭口。 |

### 4.6 命名与边界检查表

| 检查项 | 通过条件 | 本 Step 结论 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-member`，且明确为 planned / missing | 符合。 |
| project slug | 使用 `member`，不使用 `L2-member`、`l2_member` 或 `quantalithos-member` 作为内部名称 | 符合。 |
| member 目录 | 仅 `crates/<role>`，无 `crates/member_domain` 或架构层级前缀 | 符合。 |
| Cargo package | `member-<role>` | 符合。 |
| Rust library crate | `member_<role>` | 符合。 |
| binary | 当前为 `none planned`；未定义伪入口、端口或进程 | 符合。 |
| 文件 / module 名 | English `snake_case`，按 CP / service / role 表达职责 | 符合。 |
| 无无界 bucket | 不使用 `common`、`utils`、`helper`、generic provider / listener | 符合。 |
| CP 与 crate 分离 | CP01~CP07 不机械变为 crate；各 CP 在 domain / application / worker 位置可追溯 | 符合。 |
| compile dependency | 只有真实 `core-contracts` path candidate | 符合。 |
| runtime / event / ref / adapter / fake 分类 | 未进入 Cargo path 表；只在 future ports / blocked seams / tests 说明 | 符合。 |
| 不伪造现状 | 未创建实现仓、Cargo、source、binary、test、script、artifact、report 或运行结论 | 符合。 |

## 5. 回填草稿

未来正式 `03-详细设计.md` §4 只应保留：

1. workspace 多 crate 的布局结论及其不采用单 crate / CP-per-crate 的简短理由；
2. 实现单元总表、目录 / package / crate / binary 映射表；
3. §4.3 的 planned 文件树和 §4.4 的职责边界；
4. Core-only compile path 与 runtime / event / ref 关系不进 Cargo 的说明；
5. “api / worker / jobs 无 binary planned，物理入口需后续 authority”的显式边界。

正式正文不得带入本文件中的历史材料诊断、路径探测过程、当前仓缺失的现场描述、用户授权上限、未来步骤计划、测试 / 证据 / readiness 表述，或未闭口 external adapter 的细节。

## 6. 待确认事项与回开条件

| ID / 条件 | 当前影响 | 本 Step 的保守口径 | 何时必须回开 |
|---|---|---|---|
| `L2M-UP-001`、`L2M-UP-006` | host collaboration、startup credential、IPC / lifecycle | 仅 Ports 与 `blocked_seams` slot；无 host adapter / binary / credential file。 | host / credential owner 发布可引用的 exact contract。 |
| `L2M-UP-002` | image release / pinned entry supply | 不进入 object、crate、Cargo 或 file layout。 | image / service owner 给出 consumer contract，且影响 bootstrap / entry。 |
| `L2M-UP-003`、`L2M-UP-004` | Runtime entry / material / handoff mapping | 仅 Runtime Port 与 CP03 application / worker 责任文件；无 Runtime client carrier。 | Runtime 发布 exact entry / source family contract。 |
| `L2M-UP-005` | member-specific Core schema / event family / route | `events.rs` 只可承载 semantic candidate；无 concrete envelope / route adapter。 | Core / Bus owner 发布 shared member contract。 |
| `L2M-UP-007` | screening rule source / taxonomy | CP06 source Port / blocked seam，不建 policy engine / allowlist。 | Governance owner 发布 safe result shape。 |
| `L2M-UP-008` | third execution subject | `refs.rs` 与 domain guard 只支持 current project subject + global anchor。 | Work / Identity owner 关闭 third-subject lifecycle。 |
| physical persistence / UoW / durability / workload | infra Store / continuation file的内部形态 | file role 已固定，DB / queue / migrations / settings 未选。 | Step 11 或新的技术 authority 需要改变 Store / transaction boundary。 |
| Go authority、non-Rust Core binding 或 00/01 language reopen | workspace / package / file structure | 当前仅 planned Rust layout。 | Step 3 的 reopen trigger 被满足时，Step 3 与本 Step 必须一起重做。 |
| physical binary / transport / scheduler / deployment choice | `api` / `worker` / `jobs` 入口边界 | library-only，no binary planned。 | 新 choice 需要新增 bin、route、loop、scheduler 或 host assembly 文件时。 |

## 7. 自检、停审与下一动作

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 3 的 planned Rust 与 Core-only compile 约束已正确承接 | pass | 无 Go dual layout、无 Rust implementation claim、无非 Core path dependency。 |
| 实现单元总表完整 | pass | workspace root、七个 crate、future test layout 均有唯一职责和概要设计回指。 |
| package / crate / binary 映射完整 | pass | seven `member-<role>` / `member_<role>` 已明确；binary 明确为 none planned。 |
| 文件树可直接指导未来创建 | pass | 所有列出的 production path 有职责；外部 carrier 与 test physical files 被受控后置。 |
| CP 与实现层没有混写 | pass | CP 作为 domain / application / worker file group，未被机械拆为 crate。 |
| 未定 physical / external seam 没有被伪造 | pass_with_upstream_blockers | 无 DB、queue、transport、IPC、route、adapter、process 或 scheduler choice；`L2M-UP-001~008` 保持开放。 |
| 无 runtime / event sibling 偷渡为 Cargo | pass | 仅 `core-contracts` 在 path table；其余保持正确分类。 |
| 未进入后续 Step 或正式正文 | pass | 未创建 Step 5、未修改 `03-详细设计.md`、未创建实现仓或代码。 |

```text
step_04_status = completed
step_04_gate = pass_with_upstream_blockers
gate_status = blocked_by_user_step_04_stop
next_allowed_action = wait_for_explicit_user_confirmation_of_step_05
step_05_file_allowed = false_until_explicit_user_confirmation
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```
