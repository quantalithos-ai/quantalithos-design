# L2-tools 03 详细设计 Step 5: 定义模块实现契约主轴

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §5、§6、§16
> 当前写入许可: 只允许本 Step 中间产物与 flow / ledger；正式 03 仍禁止写入。

---

## 1. Step 开工与输入

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 4 `completed / pass`;`next_allowed_action=create_step_05_module_contracts`。 |
| 直接输入 | `03_ddd_step_04_file_layout.md`;正式 02 §4~§7、§12；正式 01 §8~§9。 |
| 过程标准 | 详细设计 SOP Step 5；详细设计书写规范 §5.5。 |
| 业务主轴 | 六个组成部分，不拆成业务 crate。 |
| 工程主轴 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 |
| 本步限制 | 不写 41 对象字段全集、trait 方法签名、DTO schema、函数流、状态矩阵、DDL、配置值、测试结果或实施 boundary。 |

## 2. SOP 问题回答

### 2.1 模块集合与唯一职责

| 模块 | 实现单元 | 唯一职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `tools-contracts` | Public protocol carrier、typed ref、metadata、view、receipt、error。 | `Command` / `Query` / `Consumer` / `Event` / `Job` DTO、view、typed ref、protocol error。 | `core-contracts`（仅实际可核查类型）。 |
| `domain` | `crates/domain` / `tools-domain` | 六组成部分的 L2-owned truth、relation、assessment、fact、state、policy 和 invariant。 | Domain objects、state enums、policy、change facts、`DomainError`，仅供本仓 application。 | `contracts`、可核查的 `core-contracts`。 |
| `application` | `crates/application` / `tools-application` | Command / Query / Consumer / Job 用例编排、transaction、idempotency、Port owner。 | Service facade、repository / external Port traits、UoW、stored result、`ApplicationError`。 | `domain`、`contracts`、可核查的 `core-contracts`。 |
| `infra` | `crates/infra` / `tools-infra` | Repository / projection store / resolver / publisher / handoff adapter、config candidate、composition、fake。 | Adapter、store、builder、fake assembly、`InfraError`。 | `application`、`domain`、`contracts`、可核查的 `core-contracts`。 |
| `api` | `crates/api` / `tools-api` | 同步 Command / Query 的输入转换、handler、response / error mapping、入口 wiring。 | Handler facade、transport-neutral route seam、`ApiError`、`tools-api` binary。 | `application`、`infra`（仅 wiring）、`contracts`。 |
| `worker` | `crates/worker` / `tools-worker` | Inbound Consumer、event collaboration continuation、projection maintenance lifecycle。 | Consumer runner、continuation runner、`WorkerError`、`tools-worker` binary。 | `application`、`infra`（仅 binary wiring）、`contracts`。 |
| `jobs` | `crates/jobs` / `tools-jobs` | 四个 Operations Job 的输入、cursor / watermark、报告映射和 one-shot lifecycle。 | Job runner facade、job report、`JobError` 和四个 action binaries。 | `application`、`infra`（仅 wiring）、`contracts`。 |

### 2.2 六个业务组成部分的主 owner

业务组成部分是语义边界，不是 crate。每个组成部分有一个 truth owner 主轴和多个协作层：

| 组成部分 | Truth / policy owner | Application owner | Public carrier | Persistence / projection | Entry / async owner |
|---|---|---|---|---|---|
| 工具合同与演进 | `domain::contract` | `application::contract_service` | `contracts::{commands,queries,views,events}` | `ToolContractStore` + contract history | `api` Command / Query；event candidate 由 application 形成 |
| Capability Binding 与受控来源 | `domain::binding` | `application::binding_service` | binding commands / query / envelope | `CapabilityBindingStore` + assessment / snapshot store | `api`；Hub clue consumer 在 `worker` |
| 规范调用与受理 | `domain::invocation` | `application::invocation_service` | invocation command / view | `ToolInvocationStore` + admission record | `api`；Runtime caller 通过 Port，不入 Cargo |
| 执行前置与条件交接 | `domain::{precondition,handoff}` | `application::{precondition_service,handoff_service}` | requirement / assessment / handoff carriers | handoff store + attempt store | `api` Command；Authorization / Sandbox seam blocked-aware |
| Outcome、审计与安全交接 | `domain::{outcome,safe_handoff}` | `application::{outcome_service,safe_handoff_service}` | outcome / audit / event / receipt carriers | outcome-audit store + submission store | Sandbox source consumer / event continuation；Bus / Obs 不拥有本地 truth |
| 引用完整性与受控派生 | `domain::integrity` | `application::integrity_service` + `job_service` | report / projection / gap views | `ReferenceStore` + `ProjectionStore` | Queries、four Jobs、worker maintenance；不得修 subject |

### 2.3 每个模块对外暴露与禁止暴露

| 模块 | 对外暴露 | 明确禁止暴露 |
|---|---|---|
| `contracts` | 可序列化的安全 carrier、typed identity / ref、error code、page / freshness markers。 | Raw request、prompt、capture、provider body、secret、DB row、transport-specific header。 |
| `domain` | 供 application 调用的构造器、guard、transition、normalized safe summary、domain error。 | Repository / config / clock implementation、HTTP / RPC / broker / runtime loop。 |
| `application` | 调用方可组合的 service facade、caller-owned traits、UoW 与 stored replay。 | Concrete adapter、framework type、external client、entry-specific state。 |
| `infra` | 由 composition root 使用的 adapter / store / builder / fake。 | 第二套业务语义、允许/拒绝裁决、把 blocked provider 伪装 ready。 |
| `api` | Handler 与 route assembly placeholder。 | 直接 repository write、domain state mutation、external orchestration。 |
| `worker` | Consumer / continuation / projection runner。 | 直接写 subject truth、拥有 Bus delivery / Sandbox lifecycle、接收 raw body。 |
| `jobs` | Job runner 与 typed report。 | 修复 contract / Binding / outcome subject；制造 run_id / evidence 事实。 |

### 2.4 依赖方向与禁止方向

```text
core-contracts
      ^
      |
  contracts
      ^
    domain
      ^
  application  <---- infra (implements application-owned ports)
      ^             ^
      |             |
   api / worker / jobs (entry wiring only)
```

允许依赖：`contracts -> core-contracts`；`domain -> contracts`；`application -> domain + contracts`；`infra -> application + domain + contracts`；`api/worker/jobs -> application + infra + contracts`。

禁止：反向依赖、entry 之间互依、domain 依赖 infra、application 依赖具体 DB / bus / HTTP / SDK、任何非 Core sibling Cargo dependency、无边界 `common / utils / manager`。

### 2.5 对象、trait、handler、repository 归属

| 主体类型 | 唯一归属 | 归属规则 |
|---|---|---|
| Typed ID / ref / metadata / DTO / view / receipt / protocol error | `contracts` | 只承载 public carrier，不定义业务 invariant。 |
| Aggregate / entity / value / fact / assessment / snapshot / state / projection state / policy | `domain` | 只承载 L2 semantic truth 或受控派生语义。 |
| Service / repository trait / external Port / resolver / publisher / handoff / UoW / idempotency | `application` | Trait 由 caller 拥有，service 承担写权与 transaction 编排。 |
| Durable / fake repository、adapter、projection store、config、builder | `infra` | 实现 application trait，不夺取 owner。 |
| Sync handler / route seam | `api` | 仅转换输入输出并调用 application。 |
| Consumer / continuation / projection worker | `worker` | 仅承接异步入口与 lifecycle。 |
| Job runner / report mapping | `jobs` | 仅 one-shot operations，不修 core subject。 |

## 3. 六组成部分的模块 capability 映射

### 3.1 工具合同与演进

| Capability | 主模块 | 输入 / 输出 | 写权与协作 |
|---|---|---|---|
| Establish / retire stable tool contract | `application` -> `domain` | Command -> contract view / error | 仅 owning Command 写 contract lifecycle；store 由 infra 实现。 |
| Define / adopt formal definition revision | `domain` + `application` | Candidate + impact -> current / history fact | 不含 implementation、provider、secret body；revision history immutable。 |
| Assess compatibility impact | `domain` | Definition refs -> impact fact | Assessment 不切换 current；Query / Job 只报告。 |
| Read current / history / gaps | `contracts` + `application` | Query -> body-free view | Query no-write、source unavailable 显式。 |
| Emit safe contract change candidate | `domain` + `application` | Committed fact -> candidate | 不等于 Bus delivered。 |

### 3.2 Capability Binding 与受控来源

| Capability | 主模块 | 输入 / 输出 | 写权与协作 |
|---|---|---|---|
| Declare / replace / invalidate relation | `application` -> `domain` | Binding Command -> relation view | 只有 Binding Commands 写 relation / history。 |
| Consume Hub controlled ref / snapshot | `worker` -> `application` | Envelope -> snapshot / assessment / gap | Consumer 不改 relation；Hub provider 仍 runtime seam。 |
| Assess bound / explicit-unbound at time | `domain` | Ref / snapshot -> assessment | Null / name hit 不自动等于 unbound / valid。 |
| Read binding view | `contracts` + `application` | Query -> selected assessment / gaps | 不等于 authorization。 |

### 3.3 规范调用与受理

| Capability | 主模块 | 输入 / 输出 | 写权与协作 |
|---|---|---|---|
| Canonicalize invocation | `application` -> `domain` | Formal intent + context -> invocation / anchor | 不保存 raw request、plan、loop、checkpoint。 |
| Establish pre-execution admission | `application` -> `domain` | Invocation -> immutable admission | 受理先于任何真实执行；拒绝分支可形成 no-execution。 |
| Read invocation / admission | `application` | Query -> stable view | 不拉外部 body，不刷新状态。 |
| Idempotent duplicate handling | `application` | key + digest -> stored replay / conflict | 同语义复用结果，不创建第二 invocation。 |

### 3.4 执行前置与条件交接

| Capability | 主模块 | 输入 / 输出 | 写权与协作 |
|---|---|---|---|
| Derive execution requirement | `domain` | invocation + definition + binding assessment -> requirement | 不产生 authorization allow / deny。 |
| Consume authorization result | `application` + blocked Port | invocation-bound result -> assessment / fail-closed | `L2T-UP-001~002`;不自授权。 |
| Evaluate Sandbox applicability / readiness | `application` + blocked Port | requirement + readiness snapshot -> handoff eligibility | 不拥有 run / receipt / cleanup；不可 host bypass。 |
| Prepare handoff and append local attempt | `application` -> `infra` port | safe context -> handoff / attempt / negative outcome | Attempt 是本地事实，不等于 external accepted。 |

### 3.5 Outcome、审计与安全交接

| Capability | 主模块 | 输入 / 输出 | 写权与协作 |
|---|---|---|---|
| Accept and normalize source | `application` -> `domain` | source ref + safe summary -> source assessment / outcome | Mapping 未闭口则 conservative gap；不保存 raw material。 |
| Establish one terminal outcome + audit | `application` + UoW | accepted source or no-execution -> outcome + audit | Local truth first，同一 L2 boundary atomic。 |
| Evaluate four-gate safe handoff | `domain` | outcome / audit refs + target -> eligibility / material | minimal、body-free、redacted、correlated 合取不可绕过。 |
| Submit local collaboration attempt | `application` -> `infra` Port | material -> attempt / degradation | 不推导 delivered / observed；Bus / Obs 不回滚。 |
| Read outcome / audit / external refs | `application` | Query -> layered view | 外部 status ref 独立。 |

### 3.6 引用完整性与受控派生

| Capability | 主模块 | 输入 / 输出 | 写权与协作 |
|---|---|---|---|
| Assess typed refs | `domain` + `application` | ref + authority -> validity assessment | 不修 subject、不补正文。 |
| Open / resolve consistency gap | `application` -> `domain` | formal evidence ref -> gap transition | Subject owner 先修；resolution Command 只验证。 |
| Rebuild / refresh projections | `jobs` + `application` + `infra` | watermark -> projection state / report | 不反写 core；可 stale / rebuilding / unavailable。 |
| Search / diff / diagnostic / guidance | `application` + `contracts` | safe Query -> projection / report view | 外围读取不成为核心前置。 |
| Refresh external refs | `jobs` + blocked resolver | refs -> new assessment / gap | 无 source 时 unknown / blocked，不伪造 observed。 |

## 4. 模块职责与文件主体

### 4.1 `contracts`

| 项 | 内容 |
|---|---|
| 文件 | `refs.rs`;`metadata.rs`;`commands.rs`;`queries.rs`;`consumers.rs`;`events.rs`;`jobs.rs`;`views.rs`;`errors.rs` |
| Capability | Public carrier、typed refs、metadata、visibility / freshness / gap / unavailable surface。 |
| 对象映射 | 41 对象的 protocol-facing refs / summaries / views；不复制 domain invariant。 |
| 对外 | 所有 public DTO、view、event candidate、job report、protocol error。 |
| 依赖 | 仅 `core-contracts` 中实际核查的 generic type。 |
| 错误 | `ProtocolError` / stable code；body-free、可序列化。 |
| 测试 | DTO construction、round-trip、forbidden-body、version / unknown enum、empty / stale / unavailable view。 |

### 4.2 `domain`

| 项 | 内容 |
|---|---|
| 文件 | `contract.rs`;`binding.rs`;`invocation.rs`;`precondition.rs`;`handoff.rs`;`outcome.rs`;`safe_handoff.rs`;`integrity.rs`;`shared.rs`;`policies.rs`;`errors.rs` |
| Capability | 六组成部分的 aggregate / fact / assessment / state / policy / invariant。 |
| 对象映射 | 正式 02 §6 的 41 对象全部由 domain 拥有语义定义；projection / view 的 carrier 由 contracts 表达。 |
| 对外 | 仅 application 可调用的 constructors、guards、transitions、safe summaries、`DomainError`。 |
| 依赖 | `contracts`、Core generic；不依赖 I/O / config / external。 |
| 错误 | Invalid identity / revision / relation / anchor / state / body / invariant。 |
| 测试 | Object invariant、transition legality、owner write guard、no raw body、terminal uniqueness。 |

### 4.3 `application`

| 项 | 内容 |
|---|---|
| 文件 | `contract_service.rs`;`binding_service.rs`;`invocation_service.rs`;`precondition_service.rs`;`handoff_service.rs`;`outcome_service.rs`;`safe_handoff_service.rs`;`integrity_service.rs`;`consumer_service.rs`;`job_service.rs`;`ports.rs`;`unit_of_work.rs`;`idempotency.rs`;`errors.rs` |
| Capability | 全部 13 Command、11 Query、5 Consumer、4 Job 的 use-case 编排，以及 4 Event candidate continuation。 |
| 对象映射 | `CommandMetadata` / `QueryMetadata` / stored result / attempt disposition / job report 等 carrier；不创造第二 domain truth。 |
| 对外 | Service facade、caller-owned repository / external Port traits、UoW、idempotency contract、`ApplicationError`。 |
| 依赖 | domain + contracts；不依赖 concrete adapter / transport。 |
| 错误 | Validation、not found、version conflict、idempotency conflict、blocked / unavailable、transaction failure。 |
| 测试 | Per-command transaction / replay、query no-write、consumer dedup、job no-subject-repair、blocked port mapping。 |

### 4.4 `infra`

| 项 | 内容 |
|---|---|
| 文件 | `config.rs`;`runtime_builder.rs`;`repositories.rs`;`projection_store.rs`;`idempotency_store.rs`;`reference_store.rs`;`source_resolvers.rs`;`publishers.rs`;`handoff_adapters.rs`;`clock_id.rs`;`fakes.rs`;`errors.rs` |
| Capability | 实现 application ports，提供 durable-neutral / fake parity、composition 和 typed unavailable。 |
| 对象映射 | Stored aggregate / history / attempt / gap / projection carriers 的 adapter mapping；不定义 owner。 |
| 对外 | Runtime builder、adapter constructors、fake assembly、InfraError。 |
| 依赖 | application / domain / contracts；非 Core provider 以 runtime config / adapter interface 注入。 |
| 错误 | Backend unavailable、serialization mismatch、adapter blocked、mapping unsupported、commit outcome unknown。 |
| 测试 | Fake parity、adapter mapping、redaction、blocked / unavailable、repository expected-version。 |

### 4.5 `api`

| 项 | 内容 |
|---|---|
| 文件 | `command_handlers.rs`;`query_handlers.rs`;`routes.rs`;`errors.rs`;`bin/tools_api.rs` |
| Capability | 把 transport-neutral input 转为 application call，并把 typed result / error 映射为未来 transport carrier。 |
| 对象映射 | 仅 public DTO / view / error；不拥有 domain object。 |
| 对外 | API binary / handler facade。 |
| 禁止 | 固定 HTTP / RPC、直写 store、外部 orchestrator、body logging。 |
| 测试 | Handler mapping、no-write Query、error redaction、missing metadata / actor。 |

### 4.6 `worker`

| 项 | 内容 |
|---|---|
| 文件 | `consumers.rs`;`collaboration_worker.rs`;`projection_worker.rs`;`errors.rs`;`bin/tools_worker.rs` |
| Capability | Consumer dispatch、dedup / ordering carrier、safe collaboration continuation、projection maintenance lifecycle。 |
| 对象映射 | Envelope / receipt / assessment / gap / watermark 输入输出；不拥有 subject state。 |
| 对外 | Worker process entry。 |
| 禁止 | 直接 repository write、Bus delivery truth、Sandbox run lifecycle、Runtime recovery。 |
| 测试 | Duplicate / out-of-order, blocked source, continuation retry ownership boundary, projection stale marker。 |

### 4.7 `jobs`

| 项 | 内容 |
|---|---|
| 文件 | `runners.rs`;`errors.rs`;四个 binary files |
| Capability | `CheckCapabilityBindingConsistency`、`CheckReferenceIntegrity`、`RebuildToolDerivedViews`、`RefreshExternalStatusRefs`。 |
| 对象映射 | Job input / report / assessment / gap / projection state / external ref。 |
| 对外 | One-shot action binaries、typed report。 |
| 禁止 | 直接 adopt / replace / accept / repair subject、伪造 run / evidence / signoff。 |
| 测试 | Cursor / watermark、no-subject-repair、partial / stale / failed report、blocked resolver。 |

## 5. 跨模块 owner 与依赖审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 41 对象 semantic owner | pass | 全部由 `domain` 拥有；carrier / view 在 `contracts`，编排在 `application`。 |
| 13/11/5/4/4 entry owner | pass | API / worker / jobs 只负责入口；service facade 在 application。 |
| Repository / external Port owner | pass | Traits 在 application，implementations 在 infra。 |
| Projection / report owner | pass | Domain 定义状态语义，application 决定写权，infra 存储，jobs 驱动。 |
| Event candidate ownership | pass | Domain/application 形成已提交事实的安全候选；publisher 只适配，不拥有 delivery。 |
| Runtime / authorization / Sandbox boundary | pass | 仅以 blocked-aware Port / ref / summary 进入，不生成相邻 truth。 |
| Query no-write | pass | Query handler -> application read service -> repository / projection read；无 refresh / repair。 |
| Consumer / Job write boundary | pass | Consumer / Job 只形成 ref / assessment / gap / projection，subject repair formal re-entry。 |
| Entry dependency direction | pass | `api/worker/jobs` 不互依，不被 domain / application 反向依赖。 |
| No unbounded shared module | pass | 未新增 `common / utils / manager / shared` 顶层 crate。 |

## 6. Step 6 / 7 承接门禁

| 后续 Step | 必须承接 | 未承接时回退 |
|---|---|---|
| Step 6 objects | 六组成部分按 `domain` 文件分组；shared typed refs / public markers 在 contracts；application carriers 不能成为匿名新 truth。 | 若需新增 identity / state / history 主语，回退正式 02 对象池。 |
| Step 7 ports | 每个 application service 的 caller / implementer / error / blocked status；每个 store 有唯一 owner。 | 若 Port 改变依赖类别或 owner，回退 Step 1~3 / 正式 01。 |
| Step 8 protocols | 每个 handler / consumer / job 对应一个 public DTO family；secondary types 不藏在 entry。 | 若新增 public surface，回退正式 02 §7。 |
| Step 9 flows | 每个 API / consumer / job 有独立 callable 与 UoW；通用流仅作模板。 | 若 flow 改写 domain owner 或 side-effect truth，回退 Step 5 / 6。 |
| Step 10 states | 只为 domain-owned state subject 建 matrix；carrier / projection freshness 不能被误加全局状态。 | 若出现跨 owner state machine，回退 Step 5。 |

## 7. 回填草稿

正式 §5 应按七模块组织：每个模块写职责、文件主体、六组成部分 capability 映射、对象归属、Port / adapter 边界、关键函数入口、错误和测试切口；章末保留 shared vocabulary / typed ref、非 core carrier、字段来源、状态 owner 与 Step 7 承接摘要。具体字段、trait 签名和协议 schema 留在 Step 6~8 中间产物后再装配。

## 8. 门禁

| 条件 | 结果 |
|---|---|
| 七模块职责与 Step 4 member 一致 | pass |
| 六业务组成部分有唯一 truth / application owner | pass |
| 41 对象可定位到 domain / contracts / application carrier | pass |
| Port / repository / adapter / entry 归属明确 | pass |
| 依赖图单向且禁止方向清楚 | pass |
| Query / Consumer / Job 写权边界明确 | pass |
| Step 6~10 承接和回退条件明确 | pass |
| 正式 03 未修改 | pass |

```text
step_status = completed
gate_status = pass
gate_reason = seven implementation modules, six business ownership axes, object/carrier/port/entry/store ownership and one-way dependency boundaries are closed; Step 6 and Step 7 can proceed without ownership drift
next_allowed_action = create_step_06_object_contracts
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
