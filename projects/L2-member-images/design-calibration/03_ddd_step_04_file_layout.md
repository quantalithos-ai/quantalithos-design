# L2-member-images 03 详细设计 Step 4：收稳实现单元与文件布局

> 创建日期：2026-08-25  
> 状态：`completed_pass`  
> 文档模式：`full-restart`  
> 回填位置：正式 `03-详细设计.md` 第 4 章（仅形成回填草稿，当前不得装配正式文档）  
> 前置：`03_ddd_step_03_constraints.md` 已通过。  
> 当前授权：用户允许继续至 Step 5；本 Step 完成后只可进入 Step 5，不得创建 Step 6、写正式 03、创建实现仓、Cargo 文件或 commit。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 的实现范围、Step 3 的 Rust workspace / dependency 约束、02 §4~§12 的代码主体、对象、接口、处理流和详细设计承接。 |
| 规范 | `详细设计讨论流程_SOP.md` Step 4、`详细设计书写规范.md` §5.4、`子项目目录与代码文件组织规范.md`。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-member-images`，现场未发现；下列所有路径均为 `planned layout`，不是现有文件、Cargo manifest、build 或测试事实。 |
| 本步目标 | 在不把五业务主体机械拆成 service/crate 的前提下，给后续对象、port、协议和流程提供明确 crate / module / file 归属。 |
| 本步禁止 | 不创建目录、Cargo、源码、脚本、reports、artifacts 或 implementation ledger；不把未关闭 owner contract 写入 `Cargo.toml`；不以未选 transport / scheduler 推导 active API、worker 或 outbound event。 |

## 1. Step 内计划与模块级门禁

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 布局形态判断 | §4 方案比较、§5.1 决策表 | `done` | 选择理由、拒绝理由和业务 / 技术双轴边界明确。 |
| 实现单元映射 | §5.2~§5.3 | `done` | 每个 member 有职责、package / crate 名和概要承接点。 |
| 文件边界 | §5.4~§5.5 | `done` | 每个 planned 文件组有责任与禁止项，不偷渡具体 schema / implementation。 |
| 命名 / 依赖审计 | §5.6~§5.7 | `done` | 无 L2 泄漏、无 active sibling path、无 reverse dependency。 |
| 回填与自检 | §6、§8 | `done` | 正式回填仍关闭，Step 5 可收稳模块实现契约主轴。 |

| 模块 / 范围 | 问题回答 | 诊断 | 改动前后 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|---|
| `planned_workspace_layout` | done | done | done | done | done | done | done | `pass` | 进入 Step 5，收稳模块职责、暴露面和依赖主轴。 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本轮实现包含哪些 crate / package / binary / library？ | 采用 workspace 多 crate 布局，含 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 planned member。`api` 和 `worker` 目前只承接逻辑入口 library；transport / event authority 未闭合，因此不固定 server 或常驻进程 binary。`jobs` 以明确动作命名的 planned binary 承接 nightly / refresh / reconcile / rebuild，不选择 scheduler。 |
| 2. 每个实现单元对应哪个概要代码主体？ | 五个业务主体横跨七个 member：contracts 承载 typed carrier；domain 承载本仓 truth/guard/state；application 承载 coordinator、port、UoW 和用例；infra 承载 repo、adapter、config、composition 和 fake；api/worker/jobs 承载 Command/Query、conditional event、operations job 入口。业务主体不一对一映射为 crate。 |
| 3. 文件路径如何体现模块边界？ | 使用 `crates/<role>/src/`；domain 按五业务主体及其 shared policy/history 分文件，application 按协调用例和 port 组分文件，infra 按 repository / adapter / projection / config 分文件。禁止 `common`、`utils`、`helper`、`manager` 作为顶层 role 或无语义文件。 |
| 4. 哪些文件必须创建，哪些仅后续扩展？ | Step 4 只给出未来实现的最小 planned file set。具体 DB migration、HTTP/RPC routes、broker client、scheduler、CLI、scripts、artifacts、reports、deployment、product-specific adapter 和 outbound event delivery 都不在当前布局中创建或默认存在。 |
| 5. 每个文件负责定义什么？ | 本 Step 只分配对象族、trait/port 类别、handler 类别、repo/adapter 类别和测试组；字段、函数签名、protocol schema、transaction、error mapping 和 test case 分别留给 Step 6~16。 |
| 6~11. project slug 与命名是否合规？ | project slug 为 `member-images`；实现仓为 `quantalithos-member-images`；member 目录为 `crates/<role>`；package 为 `member-images-<role>`；library crate 为 `member_images_<role>`；所有内部 module/file/type/function/binary 不含 `L2`、`l2_` 或重复的 `quantalithos` 前缀。 |
| 12. 已确认的 compile dependency 应如何落位？ | 当前 **没有** active compile dependency。将来仅在 `MI-UP-004` 正式闭合、actual Core package / lib 和消费 member 均再核对后，才允许 root `Cargo.toml` 的 `[workspace.dependencies]` 声明 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`，并由被批准的 member 以 `.workspace = true` 消费。该片段此时是条件性示意，不可写入 planned initial manifest。 |
| 13. 哪些关系不得进入 Cargo？ | Method Library、Runtime、Tools、Member、Member Service、Artifact、Bus、seed owner、builder、registry、evidence、Sandbox、governance、observability和所有 fake 均只能进入 port / adapter / ref / event / projection / test seam；不得写为本地 path dependency。 |

## 3. 当前材料诊断

| 材料 / 现象 | 风险 | 本 Step 处置 |
|---|---|---|
| 02 只提供业务主体和实现层正交视图 | 若直接以 BC-MI-01~05 创建 crate，会形成 domain / adapter / entry 循环 | 以七个工程职责 member 承接分层，五业务主体留作 module/capability 主轴。 |
| 当前不存在目标实现仓 | 容易把目录树或 package 名误报为现状 | 全部路径以 `planned` 标记；07 activation 前不创建、运行或验证。 |
| `api`、`worker`、`jobs` 的入口类型不同 | 容易因为入口存在而假定 HTTP、broker、cron 或运行进程 | api/worker 暂为 library boundary，jobs 仅定义动作名；产品和 activation 继续 pending。 |
| Core only conditional compile | 可能把实际 Core `crates/contracts` 路径直接放入 manifest | 在布局中明确零 active sibling dependency；将来路径由 Step 3 的受限条件控制。 |
| 旧正式 03 尚未打开 | 旧固定目录、脚本、产品或 service 分法可能污染重建 | 本 Step 未读取旧正式 03，只根据重建版 00~02 和规范生成 planned layout。 |

## 4. 改动前后对比与设计取舍

| 主题 | 改动前 / 未定状态 | 本 Step 结论 | 原因 |
|---|---|---|---|
| 布局形态 | 02 只给语言中立实现分层 | workspace 多 crate | 需要强制 contracts/domain/application/infra 的向内依赖，且有 logical Command/Query/event/job 多入口。 |
| 业务主体位置 | 五业务主体未映射物理位置 | 跨七个职责 member 协作 | 业务主体与实现分层正交，不能各自成为 crate / service。 |
| 对外入口 | 02 有 API / event / job 骨架 | api / worker 为 logical library，jobs 为 action candidate | transport、event schema、scheduler均未获得 authority。 |
| Core compile | 仅条件 authority | 初始布局零 active Core dependency | `MI-UP-004` 未关闭，不建 shadow / 未批准 path。 |
| 目标仓 | 无实现目录 | planned root / member / test tree | 支持后续 03 可落码，不虚构当前仓状态。 |

| 方案 | 优点 | 风险 / 代价 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层 | 初始文件少 | domain purity、logical entry 和 future contract boundary 主要依赖 review，难以防止 external adapter 向内泄漏 | 不采用。 |
| B. workspace 多 crate（职责型） | Cargo 可强制技术层方向；可隔离 public-ish carrier、domain、application、infra和多入口 | 初始 member 较多，需 07 先建 workspace | 采用。 |
| C. 每个业务主体一个 crate | 名称与能力直观 | 一个主体跨 domain/application/infra/entry，导致循环或重复 carrier | 不采用。 |
| D. 单列 config/observability/cli/ops crate | 表面明确 | 当前无跨 crate reuse 或 interactive entry authority，过早分裂 | 不采用；config归 infra，observability按 domain/application/infra 切口分配，人工动作归 jobs。 |

## 5. 结构化中间产物

### 5.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有 staged truth、inward ports、projection / adapter 边界和三类 logical entry，需要编译边界强化 | 不使用 `src/contracts` 等单 crate 顶层布局。 |
| workspace 多 crate 架构 | 是（planned） | `contracts -> domain -> application` 与 `infra` 实现 port 的方向可由 Cargo 限制；api/worker/jobs 保持边界入口 | 目标仓需建立七个 member；尚不表示任何 binary / product activated。 |
| 按 Definition/Build/Qualification/Supply/Reference 拆 crate | 否 | 这些是业务责任切片，跨所有实现层 | 在 Step 5 作为 capability/module 主轴，不成为 Cargo boundary。 |

### 5.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | planned library crate | typed ID/ref、metadata、Command/Query、conditional inbound event、Job、view、safe protocol error carrier | 02 §7 接口骨架、§9 状态主语、§12 03 handoff。 |
| `domain` | planned library crate | 本仓 definition / assembly、build candidate、qualification、supply、reference-derived truth、state、guard、history 和 domain error | 02 §5~§6、§9。 |
| `application` | planned library crate | coordinator/use case、port trait、UoW、idempotency、query / conditional consumer / job orchestration | 02 §4、§7~§10、§12。 |
| `infra` | planned library crate | repository、projection store、adapter、configuration binding、runtime composition、blocked adapter 与 fake | 02 §3~§4、§8、§10~§11。 |
| `api` | planned logical-entry library crate | Command / Query decode、validation、application facade call 与 safe result mapping | 02 §7.1~§7.3。 |
| `worker` | planned conditional-entry library crate | verified inbound event decode / authority check / receipt mapping；仅在 authority 到位时接入 | 02 §7.4、§8.4；`MI-UP-005`。 |
| `jobs` | planned operations library + action binary candidates | nightly sweep、attempt/qualification/reference/handoff reconciliation、projection rebuild 的 bounded runner | 02 §7.4、§8.3~§8.6。 |

### 5.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `member-images-contracts` | `member_images_contracts` | workspace 内共享 carrier、typed ref、safe views/errors | 仅 workspace-internal；不得作为 Member Service / external Rust public contract。 |
| `crates/domain` | library crate | `member-images-domain` | `member_images_domain` | local truth、state、guard、history | 否。 |
| `crates/application` | library crate | `member-images-application` | `member_images_application` | use case、port、UoW、idempotency | 否。 |
| `crates/infra` | library crate | `member-images-infra` | `member_images_infra` | port implementations、composition、config、fake | 否。 |
| `crates/api` | logical-entry library crate | `member-images-api` | `member_images_api` | command/query handler boundary | 否；transport binary pending product authority。 |
| `crates/worker` | conditional-entry library crate | `member-images-worker` | `member_images_worker` | inbound event consumer boundary | 否；worker binary pending `MI-UP-005` / runtime binding。 |
| `crates/jobs` | library crate + planned action binaries | `member-images-jobs` | `member_images_jobs`; `run_nightly_build_sweep`, `reconcile_build_attempts`, `reevaluate_pending_qualifications`, `refresh_external_reference_snapshots`, `rebuild_image_derived_views`, `reconcile_image_handoffs` | bounded operations entry | action binaries are planned only; not scheduler or execution evidence。 |

### 5.4 Planned 文件布局树

```text
quantalithos-member-images/
  Cargo.toml                                      # planned workspace root; members/toolchain only
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                                    # crate exports and rustdoc root
        ids_refs.rs                               # local IDs, typed refs, reason / freshness markers
        metadata.rs                               # command/query/event/job metadata and correlation
        commands.rs                               # local Command request/result carriers
        queries.rs                                # Query request/response carriers
        inbound_events.rs                          # conditional inbound event envelope/receipt carrier only
        jobs.rs                                   # operations job input/status carrier
        views.rs                                  # derived / safe view, gap and unavailable carriers
        errors.rs                                 # protocol-safe errors and dispositions
    domain/
      Cargo.toml
      src/
        lib.rs                                    # domain exports
        vocabulary.rs                             # typed local value objects and shared vocabulary
        definition.rs                             # image family / variant / mapping source validity
        assembly.rs                               # baseline, component pin, seed placement, revision
        build.rs                                  # intent, attempt, snapshot, outcome, candidate
        qualification.rs                          # provenance, gate, eligibility, Artifact handoff gap
        supply.rs                                 # transition, entry, availability, consumer gap
        reference.rs                              # external snapshot, contract gap, trace, freshness, read model
        guards.rs                                 # completeness, pin, candidate, gate, entry and read-only guards
        history.rs                                # append / supersede history helpers
        states.rs                                 # local state family definitions
        errors.rs                                 # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                                    # application exports
        facade.rs                                 # logical command/query/job facade
        definition_service.rs                     # definition, baseline and revision use cases
        build_service.rs                          # intent, attempt and candidate use cases
        qualification_service.rs                  # provenance, gate, eligibility and handoff use cases
        supply_service.rs                         # publish, replace, rollback, retire and resolve use cases
        reference_service.rs                      # snapshot, gap, trace and projection coordination
        query_service.rs                          # read-only query orchestration
        consumer_service.rs                       # conditional inbound event-to-command mapping
        job_service.rs                            # bounded operations job orchestration
        ports/
          mod.rs                                  # port exports
          repositories.rs                         # local truth/history/projection/idempotency repository traits
          external.rs                             # ref, builder, registry, evidence, Artifact and consumer seam traits
          technical.rs                            # clock, ID, UoW and lease traits
        unit_of_work.rs                           # local atomicity boundary
        idempotency.rs                            # canonical request/replay/conflict semantics
        errors.rs                                 # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                                    # infra exports
        config.rs                                 # typed config binding / validation, no product selection
        runtime_builder.rs                         # composition root; blocked slot wiring
        repositories.rs                           # local truth/history repository implementations
        projection_store.rs                        # read model / freshness storage implementation
        idempotency_store.rs                       # idempotency store implementation
        source_adapters.rs                         # mapping/component/seed ref and safe conclusion adapters
        build_adapters.rs                          # builder/registry conservative outcome adapters
        qualification_adapters.rs                  # evidence/Artifact safe conclusion and gap adapters
        supply_adapters.rs                         # consumer supply boundary adapter
        clock_id.rs                               # time/ID implementation adapters
        fakes.rs                                  # deterministic fail-closed test doubles
        errors.rs                                 # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                                    # logical API entry exports
        command_handlers.rs                       # command decode/validation/facade mapping
        query_handlers.rs                         # query decode/visibility/freshness mapping
        mappers.rs                                # safe carrier/result mapping
        errors.rs                                 # entry error mapping
    worker/
      Cargo.toml
      src/
        lib.rs                                    # conditional consumer entry exports
        inbound_event_consumer.rs                 # authority/dedup/receipt boundary
        source_refresh_consumer.rs                # conditional source-refresh intake boundary
        errors.rs                                 # worker error mapping
    jobs/
      Cargo.toml
      src/
        lib.rs                                    # operations job exports
        runners.rs                                # bounded page/cursor/lease runner helpers
        errors.rs                                 # job error mapping
      bin/
        run_nightly_build_sweep.rs                # planned action entry, not scheduler
        reconcile_build_attempts.rs               # planned action entry
        reevaluate_pending_qualifications.rs      # planned action entry
        refresh_external_reference_snapshots.rs   # planned action entry
        rebuild_image_derived_views.rs            # planned action entry
        reconcile_image_handoffs.rs               # planned action entry
  tests/
    contracts/                                    # carrier, typed-ref and safe error tests
    domain/                                       # invariant, guard and state transition tests
    application/                                  # command/query/job/idempotency flow tests
    integration_seams/                            # fake/blocked adapter and UoW/projection tests
    support/                                      # non-production fixtures and fakes
```

关键说明：

- `api`、`worker` 与 `jobs` 表达逻辑入口；目录树不选择 HTTP、RPC、broker、cron、container 或 process topology。
- `inbound_events.rs` 仅承接条件入站事件；没有 `outbound_events.rs`、outbox relay 或 delivery 文件，因为 `MI-UP-009` 未闭合。
- `contracts` 不持有下游 consumer exact manifest/ref schema；该合同继续由 `MI-UP-001` 挂起。
- tests 仅为未来验证切口目录，未创建 fixture、run_id、report、evidence或测试结果。

### 5.5 文件职责与禁止方向表

| 文件组 | 定义内容 | 主要责任 | 明确禁止 |
|---|---|---|---|
| `contracts/src/*` | local carrier、typed ref、metadata、view、safe error | 保持 Command/Query/event/job 输入输出的类型边界 | domain mutation、repository、SDK、external body、public consumer contract invented locally。 |
| `domain/src/definition.rs`、`assembly.rs` | family/variant、baseline/revision、pin/placement | DefinitionAssembly local truth 与不变量 | Role mapping body、component/seed body、live state。 |
| `domain/src/build.rs` | intent/attempt/snapshot/outcome/candidate | BuildCandidate staged truth | scheduler、builder job、registry body 或 ACK→candidate shortcut。 |
| `domain/src/qualification.rs`、`supply.rs` | provenance/gate/eligibility/handoff、transition/entry/gap | Qualification 与 SupplyEntry staged truth | governance/evidence/Artifact/consumer/container truth，或 eligibility→availability shortcut。 |
| `domain/src/reference.rs`、`guards.rs`、`history.rs` | snapshot/gap/trace/freshness、pure guard、append history | ReferenceDerived、fail-closed 与 recover-by-new-context | projection/cache/fake writeback 或 history overwrite。 |
| `application/src/*_service.rs` | use-case orchestration、local decision order | coordinator、UoW、idempotency、port invocation order | concrete adapter、product endpoint、direct external body / SDK。 |
| `application/src/ports/*` | repository / resolver / builder / evidence / consumer seam traits | inward dependency inversion | adapter implementation、external positive schema invention。 |
| `infra/src/*` | repo / adapter / config / composition / fake implementation | implement approved ports，convert external outcome to conservative local input | business readiness / owner decision、default bypass、fake into production truth。 |
| `api/src/*` | logical command/query mapping | input validation和 safe response mapping | direct repo/domain construction、transport / authorization product selection。 |
| `worker/src/*` | conditional inbound authority/dedup/receipt mapping | only invoke application after verification | active broker/ACK claim、direct truth write、outbound publication。 |
| `jobs/src/*` | bounded operation runner | select persisted scope and invoke application job flow | scheduler ownership、blind retry、repair owner truth、run evidence。 |
| `tests/**` | future test cuts and support doubles | validate formal contracts later | production composition、evidence/readiness statement。 |

### 5.6 Planned 依赖方向

```text
contracts
    ^
    |
domain
    ^
    |
application -- defines ports / UoW / idempotency
    ^
    |                  ^
api / worker / jobs    |
                       |
infra -- implements application ports and composition
```

| crate | 允许依赖 | 禁止依赖 |
|---|---|---|
| `contracts` | approved local serialization/error candidates；future formally approved Core carrier only | domain/application/infra/entry crates；all non-Core siblings。 |
| `domain` | contracts；future formally approved Core carrier only | application/infra/api/worker/jobs、config、async runtime、transport、store、SDK。 |
| `application` | contracts、domain | infra concrete、HTTP/DB/bus/builder/registry/evidence SDK。 |
| `infra` | contracts、domain、application | api/worker/jobs；business truth mutation / reverse policy ownership。 |
| `api` | contracts、application、infra composition | direct repository / adapter use、worker/jobs、domain mutation bypass。 |
| `worker` | contracts、application、infra composition | api/jobs、direct domain/repository write、unverified event forwarding。 |
| `jobs` | contracts、application、infra composition | api/worker、scheduler ownership、external owner repair。 |

### 5.7 命名与 compile 审计表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓名称 | `quantalithos-member-images`，不含 Layer 编号 | `pass`（planned path）。 |
| member 目录 | 仅 `crates/contracts/domain/application/infra/api/worker/jobs`，无项目名前缀 | `pass`。 |
| package / crate | `member-images-<role>` / `member_images_<role>` | `pass`。 |
| file / module | snake_case、职责明确；无 `common/utils/helper/manager` bucket | `pass`。 |
| binary | 仅 jobs 动作名；api/worker 不预设 process binary | `pass`。 |
| L2 泄漏 | package/crate/module/file/type/function/binary均不含 `L2` / `l2_` | `pass`。 |
| Core dependency | no active Cargo path before `MI-UP-004`; real candidate path recorded only as conditional check | `pass`。 |
| non-Core sibling | runtime/event/ref/adapter/fake 不进入 Cargo | `pass`。 |

## 6. 正式文档回填草稿（暂不写入）

### 6.1 第 4 章《实现单元与文件布局》草稿

正式 03 应采用 §5.1~§5.7 的布局决策、实现单元表、目录/package/crate/binary 映射、planned 文件树和职责表。正文须声明目标实现仓尚不存在，所有路径只为 planned boundary；采用 workspace 多 crate 是为了强制职责层依赖而非把五业务主体拆成七个部署服务。`contracts` 仅为 workspace carrier，不能替 `L2-member-service` 定义 public consumer schema；当前没有 active sibling Cargo dependency，`core-contracts` 仅在 `MI-UP-004` 完成后重新核对。

## 7. 待确认事项

- `MI-UP-004`：Core image-specific shared contract 未闭合，root manifest 不能包含 active `core-contracts` entry；若关闭后需重审 consumer crate matrix。
- `MI-UP-005`：worker event source、receipt carrier exact schema和 worker process activation尚未闭合；worker crate 保持 conditional logical boundary。
- `MI-UP-001/007`：consumer / Artifact exact exchange schema 未闭合；contracts / adapters 只分配本仓 neutral carrier与 gap，不定义对端 body。
- `Q-MI-003`：API transport、event broker、scheduler、DB、builder/registry/evidence backend未选，故不设 route、bin server、broker adapter、migration或 deployment 文件。
- `07` 前必须决定创建 / 接管目标实现仓的 authority；Step 4 不能越权创建它。

## 8. 完成审计与下一步门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 布局形态、member、package、crate、binary 与文件职责明确 | `pass` | 均为可创建的 planned path，未声称现有实现。 |
| 五业务主体未机械映射为 crate / service | `pass` | 业务主体通过跨 member module/capability 协作承接。 |
| Core-only conditional compile 与所有非-Core seam 仍分离 | `pass` | 无 active path dependency 或 external schema。 |
| pending API / event / scheduler / product没有被写成 active entry | `pass` | api/worker logical，jobs only planned actions。 |
| 命名遵守目录规范且无 Layer 泄漏 | `pass` | member / package / crate / file / binary 审计完成。 |
| 未创建实现仓、Cargo、代码、测试或提交 | `pass` | 仅新增本项目 calibration 文件并更新台账。 |

```text
step_status = completed
gate_status = pass
gate_reason = planned_workspace_layout_and_file_boundaries_are_explicit
next_allowed_action = create_and_complete_step_05_module_contracts
formal_03_write_allowed = false
implementation_allowed = false
commit_required = false
```
