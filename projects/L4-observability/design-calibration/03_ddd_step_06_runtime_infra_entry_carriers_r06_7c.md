# L4-observability 03-详细设计 Step 06 - R06.7-C infra runtime builder 与 technical carrier 对象契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 上游 authority: `design-calibration/03_ddd_step_06_runtime_infra_entry_carriers.md`、`design-calibration/03_ddd_step_06_runtime_availability.md`
> 本批目标: 逐对象闭合 infra runtime builder、entry-safe registration、bounded invocation carrier、finite catalog 与 complete-or-error runtime assembly
> 当前模式: full-restart 定向粒度修复

## 1. 批次状态与写入边界

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前详细设计 Step | Step 06 `逐模块定义对象实现契约` |
| 当前修复批次 | `R06.7-C` |
| 批次完成状态 | `R06.7-C_done_consumed_by_R06.7-E` |
| 批次范围 | infra runtime builder、technical registration、Consumer delivery/frame/completion、Job invocation/result/failure、9+9 finite catalog、validated worker/jobs slice、complete-or-error runtime assembly |
| 规范性 owner | technical carrier 与 runtime assembly 归 `infra::runtime_builder`；已有 application availability 语义继续归 `application::ports::runtime` |
| 构造方 | runtime builder 派生 validated slice / registration / runtime；`worker` 与 `jobs` 只构造 exact finite handler catalog；entry 不解析 locator |
| 正式文档回填 | 不进行；正式 `03-详细设计.md` 继续冻结到 Step 19 |
| 实现写入 | 不进行；本批只有 design-only contract |
| 验证状态 | 所有检查均为 `planned/not_run`，没有运行测试或 runtime |
| 提交状态 | 不创建 commit |
| 本批允许修改 | 本文件、Step 06 主控、R06.7-A/B checkpoint、详细设计 flow、项目执行台账 |
| 本批禁止修改 | Step 07~19、正式 `03`、任何 `04` 文件、`05`/`06`/`07` 正式文件、实现代码、implementation ledger 与 boundary skeleton |

本文件是 R06.7-C 当时的完整对象契约来源。R06.8-B 已消费本文件并
定向替换 C-11、C-13、裸 context factory 和 publication façade 相关段落：
C-01~C-10、C-12、C-14、C-15 继续有效；C-13 的唯一 current source 是
`03_ddd_step_06_final_cross_module_gate_r06_8b.md` §8。下文凡出现一个
`BuiltObservabilityRuntime` 同时保存 API/worker/jobs handles、public
accessor、五 façade、裸 context factory、all-three same-assembly 或
`build(config)` 单一输出，均为 `historical_material_superseded`，不能落码。
冻结 Step 07 / Step 14 仍只作为 definition/use 输入；任何冲突必须服从
R06.8-B current owner，不能自行选一个。

## 2. 本批输入、读取记录与 authority order

### 2.1 读取的标准与上游

| 输入 | 本批采用的结论 |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 06 | 按模块 capability -> 对象 -> 字段来源 -> factory/member -> 生命周期/持久化 -> error -> verification cut 逐对象闭口；family 表不能替代对象卡 |
| `standards/document/详细设计书写规范.md` §5.5、§5.16 | Rust-facing 类型、字段、函数、变体和测试切口必须可由实现者直接承接；正式正文只放收口结论 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物先于正式文档；批次完成后更新 flow / ledger 并停审 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 每个字段、状态、错误、phase 和边界必须有唯一来源；不能让实现者补造隐含 carrier |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 只有 `core-contracts` 是编译期 sibling dependency；runtime/provider 细节留在 infra adapter |
| `03_ddd_step_04_file_layout.md` | runtime builder 的物理落点为 `crates/infra/src/runtime_builder.rs`；worker/jobs 是独立 entry crate |
| `03_ddd_step_05_module_contracts.md` | `worker/jobs -> infra`；infra 不反向依赖 entry；registrar 是 technical composition seam，不是 application business port |
| `03_ddd_step_06_runtime_infra_entry_carriers.md` §§1~11 | R06.7-A 的 owner inventory、historical exclusion、no-locator/no-material 和 batch defer boundary |
| `03_ddd_step_06_runtime_availability.md` §§1~14 | R06.7-B 的三类 application-owned availability object；C 只能消费，不复制 |
| `03_ddd_step_06_object_contracts.md` §6.25/§6.26 | current pointer、对象资格、既有 application runtime support owner 和禁止范围 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` §12.4 | R2 technical registration use-site、9+9 static catalog、opaque handle、group atomicity；本批不重写 trait body |
| `03_ddd_step_14_config_external_binding.md` §§9.3、9.4、17、18 | validated root、safe entry slice、builder stages、startup error taxonomy、raw/private split |
| `03_ddd_step_08_protocol_contracts.md` §7.7/§7.9 | 9 个 Consumer 与 9 个 Job 的既有 public wrapper；C 不新增 DTO |
| `03_ddd_step_12_error_recovery.md` §§8.3、8.5、8.8、9.5 | Protocol/Application/Worker/Job error 的既有 owner 和 runtime failure mapping |
| `03_ddd_step_13_concurrency_idempotency.md` | Consumer redelivery、Job duplicate、group registration 与 stable identity 不得被技术 carrier 改写 |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 仅参考 infra/api/worker/jobs 对象卡的粒度和 owner/生命周期/禁止项写法，不复制 Governance truth |
| `projects/L1-artifact/design-calibration/03_ddd_step_06_object_contracts.md` | 仅参考实现级对象表、字段来源和 planned verification cut 的粒度，不复制 Artifact truth |

### 2.2 authority order

当同一名称在多个冻结文件出现时，本批按以下顺序裁定：

1. 当前需求 / 架构 truth boundary：Observability 只拥有 observation-side fact、projection、audit 和 evidence linkage，不拥有业务 source truth。
2. 当前正式 `02-概要设计.md` 与其 current calibration outputs：确定入口、runtime、no-write、body-free、handoff 和 maintenance intent。
3. 当前 Step 04 / Step 05：确定物理 owner、依赖方向和禁止反向依赖。
4. 当前 Step 06 application owner addenda 与 R06.7-A/B：确定已闭合类型和不得重复定义的语义。
5. 本文件：确定 C 批 technical carrier 的唯一 definition、factory、member、生命周期与 error mapping。
6. 冻结 Step 07 / Step 14：只用于检查 use-site、调用时机和 downstream affected definition。
7. 旧正式文档、README、旧 ledger、旧 boundary：historical material，不产生 current contract。

### 2.3 SOP 问题回答

#### 本批需要闭合哪些模块 capability?

| 模块 | capability | C 批闭合内容 | 不在 C 批闭合 |
|---|---|---|---|
| `infra::runtime_builder` | 从 validated root 形成 entry-safe wiring | validated registration、worker/jobs slice、BuiltRuntime、startup error | raw key、source precedence、secret resolution schema、Step 14 trait definition |
| infra technical registration seam | 将 pre-resolved private binding 接到 entry callback | delivery、frame、completion、opaque registrar use-site、group atomicity | transport SDK、ack token、topic、scheduler API、provider body |
| `worker::consumers` | 提交九个 exact Consumer handler | `InboundConsumerHandlerCatalog` 的九槽 totality和 registration match | handler trait body、consumer protocol DTO、consumer business flow |
| `jobs` composition root | 提交九个 exact Job handler | invocation/result/failure wrapper的 exact variant 与 catalog totality | Job plan、claim、report state、schedule locator解析 |
| `infra::runtime_builder` + entry roots | 暴露一个可调用 runtime 或一个 startup error | complete-or-error assembly、zero partial handle escape | API/worker/jobs 自有 loop/context/disposition object（R06.7-D/E） |

#### 为什么 catalog 的定义 owner 与构造 owner 可以不同?

Catalog 的字段 shape 必须由 infra technical seam 固定，才能让 registrar 对 9 个 slot 做统一 totality 检查；实际 handler 是 entry crate 的模块职责，因此 `worker` / `jobs` 构造 slot。构造 owner 不等于语义 owner，也不允许 entry 增加第十个 slot、free-text map 或 default handler。

#### 本批如何证明没有移动业务 truth?

所有 C 批对象均是 startup、process-local 或 invocation carrier：

- registration 只描述 operation / producer / schema，不描述事件内容或业务结果；
- frame 只暂存一次受限的 inbound protocol bytes，不持久化；
- completion 携带已经由 application 分类的 `ObservationConsumerReceipt`，不创建 receipt；
- Job invocation/result/failure 只包装已有 public Job request/response，不能合成 metadata 或 report；
- BuiltRuntime 只表示 wiring 完成，不表示 adapter healthy、event delivered、Job completed、evidence authentic 或 acceptance signed。

## 3. C 批总 owner / construction / consumer registry

### 3.1 唯一定义 owner

| 对象 | 唯一定义 owner | 构造 / 组装 owner | 主要消费者 | persistence |
|---|---|---|---|---|
| `ValidatedInboundConsumerRegistration` | `infra::runtime_builder` | runtime builder，从 validated root + private slot 派生 | worker registrar / exact handler mapper | 不持久化 |
| `ValidatedJobScheduleRegistration` | `infra::runtime_builder` | runtime builder，从 validated root + private trigger 派生 | jobs registrar / schedule mapper | 不持久化 |
| `InboundConsumerDelivery` | infra technical registration seam（逻辑归属 `infra::runtime_builder`） | registrar 在一次 callback 前构造 | 一个 exact worker handler | 不持久化 |
| `InboundEnvelopeFrame` | infra technical registration seam | transport adapter 在 bound check 后构造 | exact Consumer decoder | 不持久化 |
| `InboundConsumerCompletion` | infra technical registration seam | worker handler mapper 在已有 receipt 后构造 | registrar 的 transport action mapper | 不持久化 |
| `InboundConsumerHandlerCatalog` | `infra::runtime_builder` shape | `worker::consumers` 提交九个 typed slots | inbound registrar | 不持久化 |
| `ObservationJobInvocation` | infra technical registration seam | scheduler 只转交已有 typed request | exact Job handler | 不持久化 |
| `ObservationJobInvocationResult` | infra technical registration seam | exact Job handler返回已有 typed response | jobs entry / public mapper | result/report由application另行承接；本wrapper不持久化 |
| `ObservationJobInvocationFailure` | infra technical registration seam | dispatch boundary包装既有 Protocol/Application error | jobs entry / error mapper | 不持久化 |
| `ObservationJobHandlerCatalog` | `infra::runtime_builder` shape | `jobs` composition root 提交九个 typed slots | schedule registrar / one-shot runner | 不持久化 |
| `ValidatedWorkerEntryConfig` | `infra::runtime_builder` | validated root 派生 | worker loop / registrar setup | 不单独持久化 |
| `ValidatedJobsEntryConfig` | `infra::runtime_builder` | validated root 派生 | jobs composition / registrar setup | 不单独持久化 |
| historical `BuiltObservabilityRuntime` aggregate | `infra::runtime_builder` | runtime builder stage 12 | historical API/worker/jobs aggregate root | `superseded_by_R06.8-B_C13`；current为三个具名profile-specific built-runtime wrappers，各自只含一个assignment |
| `RuntimeAssemblyIssueRef` | `infra::runtime_builder` | startup issue allocator | `RuntimeAssemblyError` / 后续 safe telemetry | 不作为 evidence / run / durable truth |
| `RuntimeAssemblyError` | `infra::runtime_builder` | builder failure mapping | startup caller | 不持久化 |

### 3.2 C 批不重新定义的类型

以下名称只在本文件中作为已确认输入引用，不产生新的 definition：

| 类型 | current owner | C 批用法 |
|---|---|---|
| `AdapterAvailabilityScope` / `AdapterAvailabilityKind` / `AdapterAvailabilityState` | `application::ports::runtime` | BuiltRuntime 暴露的 probe 返回值；不复制字段或 variant |
| `AdapterAvailabilityProbe` | Step 07 application port | BuiltRuntime 保存 `Arc<dyn ...>`；trait 签名不在 C 重写 |
| `InboundConsumerHandler` / `ObservationJobHandler` | Step 07 technical seam | catalog slot 的 trait object；不写 trait body或future alias |
| `InboundConsumerRegistrar` / `JobScheduleRegistrar` | Step 07 technical seam | BuiltRuntime 保存 prebuilt registrar；不重写 trait签名 |
| `RegisteredInboundConsumerSet` / `RegisteredJobScheduleSet` | Step 07 opaque handle seam | register-all成功后的 process ownership；不定义数据字段 |
| `ObservationJobRequest<T>` / `ObservationJobResponse<T>` | `contracts` / Step 08 | Invocation / Result 的九个既有 wrapper variant |
| `ObservationConsumerReceipt` | `contracts` / Step 08 | Completion 的既有 receipt payload |
| `ConfigBindingRef` / `ExternalEffectBindingRef` / `ExternalEffectPhase` / `Positive*` | `application::runtime` | validated source / error context / private bound；不重新声明 |
| `ValidatedApiEntryConfig` | `infra::config` / Step 14 | BuiltRuntime 保存现有 API-safe slice；C 不新增 API slice object card |
| `ProtocolError` / `ApplicationError` / `WorkerError` / `JobError` | 各自既有 owner | 只做映射，不新造 parallel error enum |

## 4. 共同边界与判定规则

### 4.1 Entry-safe carrier 的共同字段红线

任何 C 批 object 都不得拥有或通过 accessor 暴露：

- raw config map、source document、path、environment variable、profile locator；
- endpoint、topic、route、cron、scheduler locator、transport token、credential、secret；
- provider response/error body、payload body、source audit body、evidence body；
- repository、UoW、concrete adapter、service locator、private registry、downcast handle；
- external runtime run id、evidence alias、verdict、signature、acceptance receipt；
- 可让 entry 重新读取 current config、current route 或 current target 的 getter。

### 4.2 Immutable assembly rule

本段的“一个 aggregate runtime 同时供三个 entry”是
`historical_material_superseded`。Current invariant按 R06.8-B §8 收敛为：
每次独立 binary builder invocation只选择一个 entry；该 profile 的 safe
slice、service/assembler facet和matching registrar/private slots来自同一
`ValidatedObservabilityConfig` / `ConfigBindingRef` / linear invocation，并
整体进入一个具名 built-runtime wrapper。Entry不得跨 invocation替换任一
字段；不同进程即使使用同一config revision，也不宣称共享对象identity或
联合原子激活。

### 4.3 Startup error-context rule

`RuntimeAssemblyError` is owned by `infra::runtime_builder` and its registrar implementations. Entry crates never construct it and no C catalog constructor may require an entry-owned `ConfigBindingRef` or `RuntimeAssemblyIssueRef`.

| construction site | validation responsibility | C-15 mapping |
|---|---|---|
| runtime builder | validates C-01/C-02 source, finite namespace, uniqueness, typed bounds, private-slot cardinality and same-config identity before calling `from_validated` / `from_complete` | builder has the current config/issue context and returns `InvalidConfiguration`, `RequiredCapabilityMissing` or `EntryBindingIncomplete` before exposing the value |
| entry composition root | supplies nine typed handler slots through shape-only catalog constructors; it does not classify startup errors | none; catalog is moved to the infra registrar |
| infra registrar | validates catalog slot/operation/enablement/schedule totality while holding private assembly context | registrar maps mismatch or prepare/arm failure to `EntryBindingIncomplete` with its own config/issue context |

This prevents a factory from silently minting diagnostic context or asking `worker` / `jobs` to fabricate startup identity. A `from_validated` / `from_complete` precondition violation is an infra assembly defect caught by the builder's totality checks, not a recoverable entry error.

### 4.4 Finite namespace rule

- Consumer 固定 9 个 `ObservationInboundConsumerOperation` variant；operation -> producer family 是静态 total map。
- Job 固定 9 个 `ObservationJobOperation` variant；public `PrepareExternalAuditExport` 静态映射到 internal `PrepareExternalAuditExportDelivery`。
- catalog 使用具名 `Option<Arc<dyn Handler>>` 字段，不使用 `Vec`、`HashMap`、字符串 key、closure map、first-match 或 default handler。
- `None` 只表示该 operation 在 validated configuration 中明确 disabled；unknown / missing / mismatch 不是 disabled，而是 startup assembly failure。

### 4.5 Error boundary rule

| 失败位置 | 唯一错误面 | 是否允许 runtime 暴露 |
|---|---|---:|
| raw source load / parse / cross-field validation | `RuntimeAssemblyError::ConfigSourceUnavailable` / `InvalidConfiguration` | 否 |
| secret / endpoint / store / adapter capability assembly | 对应 startup `RuntimeAssemblyError` variant | 否 |
| registration/catalog totality、prepare、arm | `RuntimeAssemblyError::EntryBindingIncomplete` | 否；本次全部 registration revoke/join |
| inbound frame missing/oversized/malformed | `ProtocolError::InvalidEnvelope`，随后由 worker policy映射 completion | 是，作为一次 invocation rejection；不调用 handler |
| Consumer application failure after dispatch | `InboundConsumerCompletion` 仍由已有 receipt/action mapping决定；具体 application error由既有 service返回 | 是 |
| Job request wrapper mismatch | `ObservationJobInvocationFailure::Protocol(ProtocolError::RouteBodyMismatch)` | 是，不能伪造 response/report |
| Job application failure before complete response | `ObservationJobInvocationFailure::Application(ApplicationError)` | 是，entry继续既有 Job error mapping |
| callback ack/dead-letter runtime failure | 既有 `WorkerError::AckFailed` / `DeadLetterFailed` | 是；不回滚已提交 local result |

## 5. R06.7-C 对象卡索引

本批每个 `FC` 都在后续独立小节闭口；索引不是对象卡替代品。

| 卡号 | 对象 | 模块 / 逻辑文件 | 资格 | 关键承接 |
|---:|---|---|---|---|
| C-01 | `ValidatedInboundConsumerRegistration` | `infra::runtime_builder` | FC | locator-free Consumer metadata |
| C-02 | `ValidatedJobScheduleRegistration` | `infra::runtime_builder` | FC | locator-free scheduled Job metadata |
| C-03 | `InboundConsumerDelivery` | infra technical seam | FC | exact operation/producer/schema/actor/frame |
| C-04 | `InboundEnvelopeFrame` | infra technical seam | FC | bounded move-only protocol bytes |
| C-05 | `InboundConsumerCompletion` | infra technical seam | FC | acknowledge/retry/dead-letter action + receipt |
| C-06 | `InboundConsumerHandlerCatalog` | `infra::runtime_builder` shape; worker constructs | FC | nine typed Consumer slots |
| C-07 | `ObservationJobInvocation` | infra technical seam | FC | nine existing Job request wrappers |
| C-08 | `ObservationJobInvocationResult` | infra technical seam | FC | nine existing Job response wrappers |
| C-09 | `ObservationJobInvocationFailure` | infra technical seam | FC | Protocol/Application only |
| C-10 | `ObservationJobHandlerCatalog` | `infra::runtime_builder` shape; jobs constructs | FC | nine typed Job slots |
| C-11 | `ValidatedWorkerEntryConfig` | `infra::runtime_builder` | FC_affected | Consumer registrations保留；resident publication cadence/limit受E裁定影响，R06.8修正 |
| C-12 | `ValidatedJobsEntryConfig` | `infra::runtime_builder` | FC | enabled Jobs + schedules + invocation budget |
| C-13 | historical aggregate `BuiltObservabilityRuntime` | `infra::runtime_builder` | superseded | R06.8-B §8已闭合三个具名profile-specific built runtimes、exact assignments和matching process-local activation seams；旧aggregate/accessor shape不得恢复 |
| C-14 | `RuntimeAssemblyIssueRef` | `infra::runtime_builder` | TC/FC-safe carrier | startup-only redacted correlation |
| C-15 | `RuntimeAssemblyError` | `infra::runtime_builder` | FC | finite startup-only failure |

## 6. C-01 `ValidatedInboundConsumerRegistration`

### 6.1 Capability and boundary

该对象是一个已经完成 infra 预解析的 Consumer registration 的 entry-safe metadata。它只告诉 worker “哪个 finite operation、哪个已认证 producer family、允许哪些 schema version”；它不携带 transport、actor-policy、credential、topic、offset、provider 或 private registry information。

| 项 | 契约 |
|---|---|
| definition owner | `infra::runtime_builder` |
| construction owner | runtime builder，在 raw `InboundConsumerBindingConfig` 完成验证、transport/actor-policy pair 已成功解析之后构造 |
| consumer | `worker::consumers` 的 exact typed mapper 与 `InboundConsumerRegistrar` |
| persistence | 不持久化；只存在于一次 immutable runtime assembly |
| lifecycle | validated -> sorted/unique -> exposed in worker slice -> consumed by registration；assembly 失败时不暴露 |
| truth boundary | 不创建 receipt、reservation、domain state、outbox 或 audit event |

### 6.2 Rust-facing definition

```rust
/// Locator-free metadata for one pre-resolved inbound Consumer registration.
pub struct ValidatedInboundConsumerRegistration {
    /// Exact finite Consumer operation selected by the static route table.
    operation: ObservationInboundConsumerOperation,

    /// Producer family authenticated by the infra binding validator.
    producer_family: ObservationProducerFamily,

    /// Schema versions accepted by this registration.
    accepted_schema_versions: Vec<SchemaVersion>,
}
```

Fields are private. The type is not `Serialize`, does not implement conversion to any raw binding type, and does not expose a registry key.

### 6.3 Field source and invariants

| 字段 | 类型 | 来源 | 必须满足 |
|---|---|---|---|
| `operation` | `ObservationInboundConsumerOperation` | validated entry binding + Step 06 finite operation namespace | 9 个 variant 之一；同一 slice 内唯一；不得由字符串或 topic 名派生 |
| `producer_family` | `ObservationProducerFamily` | Step 08 static operation -> producer table | 必须等于 operation 的 compile-time required family；不能由 payload 覆盖 |
| `accepted_schema_versions` | `Vec<SchemaVersion>` | validated root accepted set 与 binary-supported set 的交集 | 非空、canonical sorted、unique；P0 只允许 `[SchemaVersion::V1]`；不得放入 `DigestProfileVersion` / source version |

`accepted_schema_versions` 是 safe enum metadata，不是 payload bytes 或 parser object。若交集为空、出现 unknown version、operation duplicate、producer mismatch 或 slice 与 private slot 数量不等，runtime builder 必须在 entry exposure 前返回 `RuntimeAssemblyError::EntryBindingIncomplete` 或 `InvalidConfiguration`，不得生成一个“以后 first delivery 再失败”的 item。

### 6.4 Factory and members

| member | exact signature | 作用 / 失败 |
|---|---|---|
| validated constructor | `pub(crate) fn from_validated(operation: ObservationInboundConsumerOperation, producer_family: ObservationProducerFamily, accepted_schema_versions: Vec<SchemaVersion>) -> Self` | 只在 builder 已完成静态 producer map、schema 非空/排序/去重和 P0 supported set 校验后调用；不做 I/O、不自行构造 startup error |
| operation accessor | `pub fn operation(&self) -> ObservationInboundConsumerOperation` | 返回 finite operation；不返回 string route |
| producer accessor | `pub fn producer_family(&self) -> ObservationProducerFamily` | 返回 safe producer family；不返回 transport identity |
| schema accessor | `pub fn accepted_schema_versions(&self) -> &[SchemaVersion]` | 只读借用 canonical list；不允许 caller 改写 |
| exact match | `pub fn matches_delivery(&self, producer_family: ObservationProducerFamily, schema_version: SchemaVersion) -> bool` | 判断一次 delivery 是否在 safe registration 范围；不解析 frame |
| canonical key | `pub(crate) fn canonical_key(&self) -> (u16, u16)` | 仅供 builder sort/totality；discriminator 来自 finite enum，不是 raw index |

No `from_raw`, `resolve`, `locator`, `into_transport_binding`, `is_enabled_by_default` or `Debug` body dump member is permitted.

### 6.5 Error, lifecycle and planned cuts

| 场景 | 结果 |
|---|---|
| operation unknown / producer mismatch / empty schema | builder 在调用 `from_validated` 前返回 startup `InvalidConfiguration` or `EntryBindingIncomplete`; no worker exposure |
| delivery producer/schema mismatch | no handler invocation; registrar maps to `ProtocolError::InvalidEnvelope` and existing worker rejection policy |
| runtime config reload | creates a new runtime assembly; existing registration object is not mutated |
| persistence / domain truth | none; object disappears with runtime assembly |

Planned verification cuts: static 9-row producer map; operation uniqueness; schema intersection; canonical ordering independent of source array order; no-locator compile-time surface scan; disabled operation = absent registration rather than generic fallback. Status: `planned/not_run`.

## 7. C-02 `ValidatedJobScheduleRegistration`

### 7.1 Capability and boundary

该对象表示一个 scheduled Job operation 已有一个可携带完整现有 `ObservationJobRequest<T>` 的 pre-resolved trigger。它不表示 Job enabled、Job started、Job completed，也不携带 cron、scheduler locator、target catalog 或 request synthesis material。

| 项 | 契约 |
|---|---|
| definition owner | `infra::runtime_builder` |
| construction owner | runtime builder，从 validated schedule binding 与 scheduler capability descriptor 派生 |
| consumer | `jobs` composition root / `JobScheduleRegistrar` |
| persistence | 不持久化；只作为当前 assembly 的 safe metadata |
| lifecycle | raw binding validated -> one registration -> group registration -> opaque process handle |
| truth boundary | 不创建 Job plan、claim、report、idempotency result、external run id 或 evidence |

### 7.2 Rust-facing definition

```rust
/// Locator-free metadata for one pre-resolved scheduled Job trigger.
pub struct ValidatedJobScheduleRegistration {
    /// Exact finite Job operation represented by this schedule.
    operation: ObservationJobOperation,
}
```

The actual trigger and its scheduler-private capability remain inside infra registrar state. No public accessor can retrieve its schedule ref, cron, endpoint, actor, or scheduler object.

### 7.3 Field source, factory and members

| 字段 / member | 类型 / 签名 | 来源与约束 |
|---|---|---|
| `operation` | `ObservationJobOperation` | validated `job_schedules` entry；必须是 9 个 finite variant 之一；同一 schedule slice 唯一 |
| constructor | `pub(crate) fn from_validated(operation: ObservationJobOperation) -> Self` | 只在 builder 已完成 finite / enabled / duplicate 检查后调用；不解析 scheduler、不自行构造 startup error |
| `operation()` | `pub fn operation(&self) -> ObservationJobOperation` | 返回 typed operation；不返回 public name string或schedule locator |
| `matches_invocation()` | `pub fn matches_invocation(&self, operation: ObservationJobOperation) -> bool` | exact operation equality；不制造 invocation |
| `canonical_key()` | `pub(crate) fn canonical_key(&self) -> u16` | finite discriminator sort；不使用 raw source index |

`ValidatedJobScheduleRegistration` 与 `enabled_jobs` 的关系必须满足：scheduled operation 必须属于 enabled set；enabled 但未 scheduled 的 Job 可以保持 operator-callable，但不能因此自动创建 schedule registration。一个 scheduler 如果只能传 operation、不能传完整现有 request，则在 stage 8 capability check 失败，不能先注册再在 first call 合成 metadata/input。

### 7.4 Error, lifecycle and planned cuts

| 场景 | 结果 |
|---|---|
| schedule references unknown/disabled/duplicate operation | builder 在调用 `from_validated` 前返回 `InvalidConfiguration` 或 `EntryBindingIncomplete`；不暴露 jobs root |
| scheduler cannot carry complete request | `RequiredCapabilityMissing`；无 registration slot |
| schedule trigger later fires | registrar 只转交完整 `ObservationJobInvocation`;不补字段、不重读 current config |
| restart / config change | new assembly creates new registration; old process-local object is dropped |

Planned cuts: enabled/scheduled subset totality; duplicate and source-order independence; no schedule locator getter; complete-request capability negative case; operator-callable-but-unscheduled case. Status: `planned/not_run`.

## 8. C-03 `InboundConsumerDelivery`

### 8.1 Capability and boundary

`InboundConsumerDelivery` 是 transport adapter 在一个 callback 边界传给 exact Consumer handler 的 move-only carrier。它把路由所需的 typed metadata 和一次性 frame 组合起来；它不把 transport completion、application receipt、payload DTO 或 provider metadata 带入 handler。

| 项 | 契约 |
|---|---|
| definition owner | infra technical registration seam / `infra::runtime_builder` |
| construction owner | registrar 在 safe registration match 和 frame bound check 后构造 |
| consumer | 一个与 `operation` exact 相等的 `InboundConsumerHandler` |
| persistence | 不持久化；callback 返回后释放 |
| ownership | move-only；handler 取得唯一 frame ownership，registrar 不保留副本 |

### 8.2 Rust-facing definition

```rust
/// Move-only delivery passed to exactly one registered Consumer handler.
pub struct InboundConsumerDelivery {
    /// Exact finite Consumer operation selected by the registrar.
    operation: ObservationInboundConsumerOperation,

    /// Authenticated producer family from the safe registration metadata.
    producer_family: ObservationProducerFamily,

    /// Declared schema version of the inbound envelope.
    schema_version: SchemaVersion,

    /// Body-free actor projection mapped at the trusted inbound boundary.
    actor_ref: ActorSafeRef,

    /// Single-consumption bounded envelope frame.
    envelope: InboundEnvelopeFrame,
}
```

All fields remain private. `InboundConsumerDelivery` must not implement `Clone` or `Copy`; `Debug`/`Display` must not expose frame bytes or actor body.

### 8.3 Field source and constructors

| 字段 | 类型 | 来源 | 约束 |
|---|---|---|---|
| `operation` | `ObservationInboundConsumerOperation` | matched `ValidatedInboundConsumerRegistration` | handler catalog slot、metadata 和 field 三者 exact equal |
| `producer_family` | `ObservationProducerFamily` | matched safe registration | 不能从 payload 推导；必须匹配 operation static map |
| `schema_version` | `SchemaVersion` | inbound header before payload parse | 必须在 registration accepted set；unsupported 不进入 handler |
| `actor_ref` | `ActorSafeRef` | trusted transport/actor-policy mapper | 只含 safe actor projection；不含 display/credential/session |
| `envelope` | `InboundEnvelopeFrame` | checked frame factory | bounded、move-only、single-consumption；不得 clone |

| factory / member | exact signature | 作用 / 禁止事项 |
|---|---|---|
| infra-private constructor | `pub(crate) fn from_registration(registration: &ValidatedInboundConsumerRegistration, schema_version: SchemaVersion, actor_ref: ActorSafeRef, envelope: InboundEnvelopeFrame) -> Result<Self, ProtocolError>` | 从 canonical registration 复制 operation/producer；验证 schema 与 frame 已校验关系；不读取 locator、不解析 payload；不保存 registration 引用 |
| operation | `pub fn operation(&self) -> ObservationInboundConsumerOperation` | safe dispatch key |
| producer | `pub fn producer_family(&self) -> ObservationProducerFamily` | safe routing metadata |
| schema | `pub fn schema_version(&self) -> SchemaVersion` | exact parser selection；不返回 raw token |
| actor | `pub fn actor_ref(&self) -> &ActorSafeRef` | 借用 actor projection；不提供 credential/identity lookup |
| frame consume | `pub fn into_envelope(self) -> InboundEnvelopeFrame` | transfer sole frame ownership；调用后 delivery 不可用 |

### 8.4 Error / lifecycle / no-truth

`from_registration` 失败时必须返回 `ProtocolError::InvalidEnvelope`，且不调用 handler、不创建 UoW、不创建 reservation、不写 receipt/outbox。delivery 的 operation metadata 只用于路由，不能成为 operation context 或 idempotency key。handler 负责用 frame 的 bounded bytes 做 header-before-payload validation，再进入既有 application Consumer service。

Planned cuts: operation/producer/schema mismatch matrix; actor projection redaction; move-only compile-time check; handler receives exactly one frame; no repository/UoW/adapter call before application service; no payload duplication in metadata. Status: `planned/not_run`.

## 9. C-04 `InboundEnvelopeFrame`

### 9.1 Capability and boundary

该对象是一次 inbound invocation 的受限 protocol material。它不是 configuration、secret、stored event、public DTO、evidence body 或 dead-letter archive。frame 只能在 transport adapter 已知 finite bound 且本次读取未超过 bound 时构造。

### 9.2 Rust-facing definition

```rust
/// Opaque bounded bytes consumed exactly once by one Consumer decoder.
pub struct InboundEnvelopeFrame {
    bytes: Box<[u8]>,
}
```

The byte field is private. The type must not implement `Clone`, `Copy`, `Debug`, `Display`, `Serialize` or `Deserialize`; it has no `as_bytes(&self)` borrowing accessor that could permit a second consumer.

### 9.3 Bound owner and factory

The finite frame limit is a private infra registrar/transport capability derived from validated configuration. It is not a new public config key and is not exposed in `ValidatedWorkerEntryConfig`. It must not be inferred from `boundary.max_request_body_bytes`, from a provider response, or from a runtime environment variable at callback time.

| member | exact signature | 语义 |
|---|---|---|
| checked constructor | `pub(crate) fn try_from_received(bytes: Box<[u8]>, declared_limit_bytes: usize) -> Result<Self, ProtocolError>` | `declared_limit_bytes > 0`，且 `bytes.len()` 必须 `> 0`、`<= declared_limit_bytes`；超限、空 frame、invalid limit 返回 `InvalidEnvelope`；不截断、不重试、不写入 |
| transport factory | `pub(crate) fn try_from_transport<I>(chunks: I, declared_limit_bytes: usize) -> Result<Self, ProtocolError>` where `I: IntoIterator<Item = Box<[u8]>>` | 累积前执行 checked length；超过 limit 立即丢弃本次 frame 并返回 `InvalidEnvelope`；不得先拼成无界 buffer |
| consume bytes | `pub fn into_bounded_bytes(self) -> Box<[u8]>` | 唯一 bytes consumption；转移 ownership |
| length | `pub fn len(&self) -> usize` | 只返回长度，不返回内容；供 pre-parse guard / telemetry safe count |
| bound predicate | `pub fn is_within(&self, declared_limit_bytes: usize) -> bool` | limit 非零且长度在界内；不重新构造、不调用 transport |

`declared_limit_bytes` 是 infra 在 stage 3/8 从 validated typed byte limit 做 checked conversion 后保存进 private registrar slot 的实现值。zero、`usize` conversion overflow 或 unbounded sentinel 使 assembly 失败，不能把 invalid limit 传给 factory。C 批不定义 `PositiveByteSize`、`04` key/default/range，也不允许 callback 重新读取配置。

### 9.4 Frame error and lifecycle

| 场景 | 处理 |
|---|---|
| empty frame | `ProtocolError::InvalidEnvelope`；不调用 handler |
| oversized frame | `ProtocolError::InvalidEnvelope`；不截断、不保存原始 bytes、不自动重试同一 frame |
| unbounded transport descriptor | startup `RuntimeAssemblyError::RequiredCapabilityMissing`；不暴露 Consumer registration |
| header declares unsupported schema | frame 可以在 transport boundary被丢弃；worker返回 `UnsupportedSchema` surface，不解析 payload |
| handler decode | exact handler 消费一次；decode后的 public payload由 Step 08/09处理，frame自身不保存结果 |

Frame never enters repository, UoW, outbox, report, evidence linkage, audit record or Job plan. A transport dead-letter action may carry only the existing safe receipt/marker; it cannot archive this frame body.

Planned cuts: empty/one-byte/exact-limit/limit+1; chunk accumulation without unbounded allocation; no `Clone`/`Debug`/serialization surface; unsupported schema before payload parse; body absent from error/log candidate; no persistence spy calls. Status: `planned/not_run`.

## 10. C-05 `InboundConsumerCompletion`

### 10.1 Capability and boundary

`InboundConsumerCompletion` 是 exact worker entry mapper 在取得既有 typed Consumer receipt、并按显式 entry transport policy 选定动作后交给 registrar 的一次性 carrier。它只携带 receipt 与 action kind，不保存 ack token、offset、topic、redelivery count、dead-letter queue locator 或 provider response。它不是 `ObservationConsumerOutcome` 的替代品，也不是 durable result；receipt outcome 本身不能自动推出 transport action。

### 10.2 Rust-facing definition

```rust
/// Transport action selected by the exact worker entry policy.
pub enum InboundConsumerCompletion {
    /// Execute the selected transport acknowledgement.
    Acknowledge(ObservationConsumerReceipt),

    /// Request transport redelivery without claiming a local success.
    Retry(ObservationConsumerReceipt),

    /// Request transport dead-letter handling for an already classified delivery.
    DeadLetter(ObservationConsumerReceipt),
}
```

The payload type is the existing `ObservationConsumerReceipt`; C does not define a parallel receipt or disposition enum. The enum is process-local and must not be serialized as a public event. Its public cross-crate shape exists because `worker -> infra`; it does not make arbitrary outcome/action pairing a supported API.

### 10.3 Variant semantics and construction

| variant | construction precondition | allowed implication | forbidden implication |
|---|---|---|---|
| `Acknowledge(receipt)` | exact worker mapper has selected acknowledgement under the current entry policy；`Accepted` requires committed local result，`Duplicate` requires exact stored receipt replay | registrar may acknowledge this delivery | does not mean external business accepted，does not prove evidence authenticity，and does not authorize acknowledgement for every other receipt outcome |
| `Retry(receipt)` | exact worker mapper has selected redelivery from an explicit recovery classification | same delivery may be redelivered later；application idempotency remains authority | does not reopen durable state，does not authorize an immediate loop，and cannot represent `CommitOutcomeUnknown` before probe/classification |
| `DeadLetter(receipt)` | exact worker mapper has selected transport isolation；a locally owned dead-letter fact may be claimed only after its body-free marker committed | registrar may request transport dead-letter handling | does not archive raw frame，invent local dead-letter truth，or imply that every permanent-looking error is dead-letter eligible |

The receipt-to-action boundary is deliberately split between rules already fixed upstream and decisions that C must not invent:

| receipt outcome | C-fixed constraint | action selection status after C |
|---|---|---|
| `Accepted` | local result/receipt commits before `Acknowledge` | fixed to acknowledge-after-commit |
| `Duplicate` | replay exact stored receipt；do not parse/apply again | fixed to acknowledge without reapply |
| `Delayed` | no immediate loop；`CommitOutcomeUnknown` requires probe before any retry | `Retry` versus policy-approved acknowledgement remains entry-policy work |
| `Rejected` | no local truth mutation；do not infer retryability from the outcome token | acknowledgement versus dead-letter remains entry-policy work |
| `UnsupportedSchema` | payload is not parsed；same unsupported body is not blindly retried | producer/runtime action remains entry-policy work；no default action |
| `Quarantined` | only a body-free quarantine marker may be committed；raw body never re-enters the normal path | isolation/acknowledgement handoff remains entry-policy work |
| `DeadLettered` | formal body-free dead-letter marker must commit before transport handoff is claimed | transport handoff must still be selected and confirmed；no constructor-side inference |
| `NoOp` | no hidden application mutation or reapply | final transport action remains exact-flow entry mapping |

| member | exact signature | 语义 |
|---|---|---|
| ack shape factory | `pub fn acknowledge(receipt: ObservationConsumerReceipt) -> Self` | only wraps an action already selected by the exact worker mapper；does not validate or authorize the receipt outcome；no I/O |
| retry shape factory | `pub fn retry(receipt: ObservationConsumerReceipt) -> Self` | only wraps an action already selected by explicit recovery policy；does not decide retryability or run a retry loop |
| dead-letter shape factory | `pub fn dead_letter(receipt: ObservationConsumerReceipt) -> Self` | only wraps an action already selected after required local classification/marker；does not resolve a queue or create dead-letter truth |
| receipt borrow | `pub fn receipt(&self) -> &ObservationConsumerReceipt` | safe inspection; no body/transport locator |
| action predicate | `pub const fn is_retry(&self) -> bool` / `is_dead_letter(&self) -> bool` / `is_acknowledge(&self) -> bool` | pure classification; no side effect |
| receipt move | `pub fn into_receipt(self) -> ObservationConsumerReceipt` | registrar pattern-match variant 后取得 receipt；不产生新的 action carrier |

Only the exact worker mapper may call the three shape factories. C cannot encode the still-deferred entry policy inside a cross-crate carrier without prematurely defining D/E; therefore call-site totality and the outcome/action matrix are mandatory static/mapper tests, not constructor claims. A default branch, wildcard-to-ack, wildcard-to-retry, wildcard-to-dead-letter, or inference from error text is forbidden.

The registrar must execute the selected variant directly against its private transport SDK and must not reclassify the receipt or substitute another action. No fourth action enum or free-text action is introduced. Ack failure maps to existing `WorkerError::AckFailed`; dead-letter handoff failure maps to `WorkerError::DeadLetterFailed`; neither error rolls back a committed local receipt.

### 10.4 Lifecycle, persistence and planned cuts

Completion is created after the exact worker mapper obtains a typed receipt and selects one explicit action, then is consumed once by the registrar. It is never stored as domain state, never used as a source for a new UoW, and never converted to a generic disposition. R06.7-E later deleted `EntryDisposition` as `HX`; this C-05 carrier remains the sole Consumer transport-action carrier.

Planned cuts: every receipt outcome appears in the mapper matrix；`Accepted` ack-after-commit；`Duplicate` ack-without-reapply；`Rejected` and `UnsupportedSchema` have no default action；`Delayed` cannot blindly retry indeterminate commit；quarantine/dead-letter never archive raw body；shape factories are called only by exact worker mappers；registrar does not reclassify；ack/dead-letter failure does not roll back local truth. Status: `planned/not_run`.

## 11. C-06 `InboundConsumerHandlerCatalog`

### 11.1 Capability and owner split

Catalog 固定 inbound registrar 能接受的全部 callback shape；其 definition owner 是 infra technical seam，而九个 handler instance 由 `worker::consumers` 构造。该 owner split 允许 `worker -> infra`，同时保证 infra 不依赖 worker crate。

| 项 | 契约 |
|---|---|
| definition owner | `infra::runtime_builder` |
| construction owner | `worker::consumers` / worker composition root |
| consumer | `InboundConsumerRegistrar::register_all`（Step 07 trait use-site） |
| persistence | 不持久化；成功后被 opaque registered set 持有 |
| lifecycle | construct exact slots -> validate against registration metadata -> move into registrar -> prepare-all/arm-all |
| forbidden | dynamic map、default handler、free-text key、unknown passthrough、handler lookup API |

### 11.2 Rust-facing definition

```rust
/// Exact finite callback catalog for all P0 inbound Consumer operations.
pub struct InboundConsumerHandlerCatalog {
    consume_bus_observation_material: Option<Arc<dyn InboundConsumerHandler>>,
    consume_source_audit_material: Option<Arc<dyn InboundConsumerHandler>>,
    consume_identity_observation_context: Option<Arc<dyn InboundConsumerHandler>>,
    consume_governance_audit_context: Option<Arc<dyn InboundConsumerHandler>>,
    consume_artifact_evidence_context: Option<Arc<dyn InboundConsumerHandler>>,
    consume_runtime_signal_summary: Option<Arc<dyn InboundConsumerHandler>>,
    consume_sandbox_signal_summary: Option<Arc<dyn InboundConsumerHandler>>,
    consume_archive_handoff_feedback: Option<Arc<dyn InboundConsumerHandler>>,
    consume_report_consumer_feedback: Option<Arc<dyn InboundConsumerHandler>>,
}
```

Fields stay private so a catalog can only be formed through the finite slot constructor. Slot totality is checked by the infra registrar, which is the only component with the assembly error context. `Arc` permits one immutable handler to be retained by a process registration; it does not allow downcast, repository access or concrete adapter extraction.

### 11.3 Constructor and totality members

```rust
impl InboundConsumerHandlerCatalog {
    pub fn from_slots(
        consume_bus_observation_material: Option<Arc<dyn InboundConsumerHandler>>,
        consume_source_audit_material: Option<Arc<dyn InboundConsumerHandler>>,
        consume_identity_observation_context: Option<Arc<dyn InboundConsumerHandler>>,
        consume_governance_audit_context: Option<Arc<dyn InboundConsumerHandler>>,
        consume_artifact_evidence_context: Option<Arc<dyn InboundConsumerHandler>>,
        consume_runtime_signal_summary: Option<Arc<dyn InboundConsumerHandler>>,
        consume_sandbox_signal_summary: Option<Arc<dyn InboundConsumerHandler>>,
        consume_archive_handoff_feedback: Option<Arc<dyn InboundConsumerHandler>>,
        consume_report_consumer_feedback: Option<Arc<dyn InboundConsumerHandler>>,
    ) -> Self;
}
```

| member | exact signature | contract |
|---|---|---|
| finite slot constructor | signature above | 只包装九个 typed slot；不创建 error、不运行 handler、不做 I/O |
| totality predicate | `pub(crate) fn matches_registrations(&self, registrations: &[ValidatedInboundConsumerRegistration]) -> bool` | enabled registration exact one `Some`、slot name与`handler.operation()` exact；disabled operation exact `None`；无 missing/extra/duplicate；`false`由 registrar 映射为 `EntryBindingIncomplete` |
| enabled count | `pub fn enabled_count(&self) -> usize` | 仅统计 `Some`；不得用 count 代替逐slot totality |
| lookup for registrar | `pub(crate) fn take_for(&mut self, operation: ObservationInboundConsumerOperation) -> Option<Arc<dyn InboundConsumerHandler>>` | registrar 内部 exact finite match；每slot只take一次；不向entry公开 generic map |
| all empty | `pub fn is_empty(&self) -> bool` | pure shape predicate；只有 registrar 已确认 validated root 无 enabled Consumer 时才可接受该结果 |

### 11.4 Slot / metadata matrix

| field | required operation | required producer family |
|---|---|---|
| `consume_bus_observation_material` | `ConsumeBusObservationMaterial` | `Bus` |
| `consume_source_audit_material` | `ConsumeSourceAuditMaterial` | `SourceOwner` |
| `consume_identity_observation_context` | `ConsumeIdentityObservationContext` | `Identity` |
| `consume_governance_audit_context` | `ConsumeGovernanceAuditContext` | `Governance` |
| `consume_artifact_evidence_context` | `ConsumeArtifactEvidenceContext` | `Artifact` |
| `consume_runtime_signal_summary` | `ConsumeRuntimeSignalSummary` | `Runtime` |
| `consume_sandbox_signal_summary` | `ConsumeSandboxSignalSummary` | `Sandbox` |
| `consume_archive_handoff_feedback` | `ConsumeArchiveHandoffFeedback` | `Archive` |
| `consume_report_consumer_feedback` | `ConsumeReportConsumerFeedback` | `ReportConsumer` |

The catalog does not carry producer/schema metadata itself; `matches_registrations` consumes the canonical registrations and verifies the slot/handler operation. Producer/schema remain registration facts, preventing two mutable sources.

### 11.5 Group registration and planned cuts

The catalog is moved into one registrar call. Before any callback can run, registrar must evaluate `matches_registrations`, prepare all slots, verify exact totality, then arm all. Any failure revokes and joins every slot prepared in this attempt and returns `EntryBindingIncomplete` with the registrar's assembly context; no partial handle is returned. Planned cuts: all 512 enabled/disabled slot combinations constrained against matching registration set; wrong handler operation; extra/missing slot; source-order independence; no callback before `Ok`; revoke/join after every injected prepare/arm failure. Status: `planned/not_run`.

## 12. C-07 `ObservationJobInvocation`

### 12.1 Capability and boundary

This enum is an infra-entry internal dispatch wrapper over the nine existing public Job requests. It does not define a second Job DTO and cannot be constructed from schedule metadata alone.

```rust
/// Complete existing Job request carried by one scheduler or operator invocation.
pub enum ObservationJobInvocation {
    PublishObservationOutbox(ObservationJobRequest<PublishObservationOutboxJobInput>),
    RebuildObservationReadModels(ObservationJobRequest<RebuildObservationReadModelsJobInput>),
    RebuildSignalRollups(ObservationJobRequest<RebuildSignalRollupsJobInput>),
    RefreshReferenceSnapshots(ObservationJobRequest<RefreshReferenceSnapshotsJobInput>),
    ScanObservationGaps(ObservationJobRequest<ScanObservationGapsJobInput>),
    CoordinateObservationReplay(ObservationJobRequest<CoordinateObservationReplayJobInput>),
    PrepareReportHandoffDelivery(ObservationJobRequest<PrepareReportHandoffDeliveryJobInput>),
    PrepareExternalAuditExport(ObservationJobRequest<PrepareExternalAuditExportJobInput>),
    RebuildPeripheralViews(ObservationJobRequest<RebuildPeripheralViewsJobInput>),
}
```

### 12.2 Variant mapping

| invocation variant | internal `ObservationJobOperation` | public Job identity constraint |
|---|---|---|
| `PublishObservationOutbox` | `PublishObservationOutbox` | request name exact match |
| `RebuildObservationReadModels` | `RebuildObservationReadModels` | exact match |
| `RebuildSignalRollups` | `RebuildSignalRollups` | exact match |
| `RefreshReferenceSnapshots` | `RefreshReferenceSnapshots` | exact match |
| `ScanObservationGaps` | `ScanObservationGaps` | exact match |
| `CoordinateObservationReplay` | `CoordinateObservationReplay` | exact match |
| `PrepareReportHandoffDelivery` | `PrepareReportHandoffDelivery` | exact match |
| `PrepareExternalAuditExport` | `PrepareExternalAuditExportDelivery` | this is the only public/internal spelling difference; static map required |
| `RebuildPeripheralViews` | `RebuildPeripheralViews` | exact match |

### 12.3 Factory, members and invariants

The nine constructors are finite and independently named; no generic `new(operation, request)` or string-routed constructor exists:

| constructor | exact signature | required public name / result variant |
|---|---|---|
| publish outbox | `pub fn publish_observation_outbox(request: ObservationJobRequest<PublishObservationOutboxJobInput>) -> Result<Self, ProtocolError>` | `PublishObservationOutbox` / `Self::PublishObservationOutbox` |
| rebuild read models | `pub fn rebuild_observation_read_models(request: ObservationJobRequest<RebuildObservationReadModelsJobInput>) -> Result<Self, ProtocolError>` | `RebuildObservationReadModels` / `Self::RebuildObservationReadModels` |
| rebuild signal rollups | `pub fn rebuild_signal_rollups(request: ObservationJobRequest<RebuildSignalRollupsJobInput>) -> Result<Self, ProtocolError>` | `RebuildSignalRollups` / `Self::RebuildSignalRollups` |
| refresh reference snapshots | `pub fn refresh_reference_snapshots(request: ObservationJobRequest<RefreshReferenceSnapshotsJobInput>) -> Result<Self, ProtocolError>` | `RefreshReferenceSnapshots` / `Self::RefreshReferenceSnapshots` |
| scan observation gaps | `pub fn scan_observation_gaps(request: ObservationJobRequest<ScanObservationGapsJobInput>) -> Result<Self, ProtocolError>` | `ScanObservationGaps` / `Self::ScanObservationGaps` |
| coordinate replay | `pub fn coordinate_observation_replay(request: ObservationJobRequest<CoordinateObservationReplayJobInput>) -> Result<Self, ProtocolError>` | `CoordinateObservationReplay` / `Self::CoordinateObservationReplay` |
| prepare report handoff | `pub fn prepare_report_handoff_delivery(request: ObservationJobRequest<PrepareReportHandoffDeliveryJobInput>) -> Result<Self, ProtocolError>` | `PrepareReportHandoffDelivery` / `Self::PrepareReportHandoffDelivery` |
| prepare external audit export | `pub fn prepare_external_audit_export(request: ObservationJobRequest<PrepareExternalAuditExportJobInput>) -> Result<Self, ProtocolError>` | public `PrepareExternalAuditExport` / `Self::PrepareExternalAuditExport`; `operation()` maps to internal `PrepareExternalAuditExportDelivery` |
| rebuild peripheral views | `pub fn rebuild_peripheral_views(request: ObservationJobRequest<RebuildPeripheralViewsJobInput>) -> Result<Self, ProtocolError>` | `RebuildPeripheralViews` / `Self::RebuildPeripheralViews` |

Each constructor performs only the checks that C can prove from the current public wrapper: its typed parameter fixes the request/input variant at compile time, and its body checks `request.job_name` against the fixed row. A name mismatch returns canonical `ProtocolError::RouteBodyMismatch`. C does not call or define a universal request-completeness method because no such upstream contract exists.

Metadata and the nine input-specific field invariants remain the responsibility of the existing exact Job request mapper under Step 08 §7.9.3. That mapper must reject missing/invalid metadata, limit, scope, target, cursor, consumer, replay/no-write guard, or other operation-specific input before application work; C-07 neither duplicates those checks nor supplies defaults. The constructor does not rewrite the request or infer a name from `T`.

| member | exact signature | contract |
|---|---|---|
| operation | `pub fn operation(&self) -> ObservationJobOperation` | total static variant map |
| public name | `pub fn public_job_name(&self) -> &ObservationJobName` | borrows the already checked request name；does not validate metadata/input |
| metadata | `pub fn metadata(&self) -> &ObservationJobMetadata` | borrows existing metadata; no new run/idempotency/actor value |
| map variant | `pub fn stable_variant_name(&self) -> &'static str` | internal telemetry/static match only; not schedule/config key |

Scheduler/entry must not construct missing `job_execution_ref`, `JobRunId` correlation, actor, idempotency key, trace, requested time, target, cursor, consumer or input. The full request is moved into exactly one handler; the invocation itself is not persisted. It cannot implement conversion from `ValidatedJobScheduleRegistration`.

Planned cuts: nine typed request/name combinations；72 wrong-name negatives；external-audit spelling map；exact Job mappers retain all metadata/input validation；no fabricated universal validator or duplicated field validator；schedule-to-invocation conversion absent；no fabricated run/evidence identity. Status: `planned/not_run`.

## 13. C-08 `ObservationJobInvocationResult`

### 13.1 Capability and boundary

This enum carries one complete existing public Job response from the exact handler back to the jobs entry. It does not create a report, infer a result from a handler return code, or convert a technical registration success into a Job success.

```rust
/// Complete existing Job response returned by one exact Job handler.
pub enum ObservationJobInvocationResult {
    PublishObservationOutbox(ObservationJobResponse<PublishObservationOutboxJobOutput>),
    RebuildObservationReadModels(ObservationJobResponse<RebuildObservationReadModelsJobOutput>),
    RebuildSignalRollups(ObservationJobResponse<RebuildSignalRollupsJobOutput>),
    RefreshReferenceSnapshots(ObservationJobResponse<RefreshReferenceSnapshotsJobOutput>),
    ScanObservationGaps(ObservationJobResponse<ScanObservationGapsJobOutput>),
    CoordinateObservationReplay(ObservationJobResponse<CoordinateObservationReplayJobOutput>),
    PrepareReportHandoffDelivery(ObservationJobResponse<PrepareReportHandoffDeliveryJobOutput>),
    PrepareExternalAuditExport(ObservationJobResponse<PrepareExternalAuditExportJobOutput>),
    RebuildPeripheralViews(ObservationJobResponse<RebuildPeripheralViewsJobOutput>),
}
```

### 13.2 Factory, validation and lifecycle

The result uses the same finite constructor discipline as C-07:

| constructor | exact signature | required public name / result variant |
|---|---|---|
| publish outbox | `pub fn publish_observation_outbox(response: ObservationJobResponse<PublishObservationOutboxJobOutput>) -> Result<Self, ApplicationError>` | `PublishObservationOutbox` / `Self::PublishObservationOutbox` |
| rebuild read models | `pub fn rebuild_observation_read_models(response: ObservationJobResponse<RebuildObservationReadModelsJobOutput>) -> Result<Self, ApplicationError>` | `RebuildObservationReadModels` / `Self::RebuildObservationReadModels` |
| rebuild signal rollups | `pub fn rebuild_signal_rollups(response: ObservationJobResponse<RebuildSignalRollupsJobOutput>) -> Result<Self, ApplicationError>` | `RebuildSignalRollups` / `Self::RebuildSignalRollups` |
| refresh reference snapshots | `pub fn refresh_reference_snapshots(response: ObservationJobResponse<RefreshReferenceSnapshotsJobOutput>) -> Result<Self, ApplicationError>` | `RefreshReferenceSnapshots` / `Self::RefreshReferenceSnapshots` |
| scan observation gaps | `pub fn scan_observation_gaps(response: ObservationJobResponse<ScanObservationGapsJobOutput>) -> Result<Self, ApplicationError>` | `ScanObservationGaps` / `Self::ScanObservationGaps` |
| coordinate replay | `pub fn coordinate_observation_replay(response: ObservationJobResponse<CoordinateObservationReplayJobOutput>) -> Result<Self, ApplicationError>` | `CoordinateObservationReplay` / `Self::CoordinateObservationReplay` |
| prepare report handoff | `pub fn prepare_report_handoff_delivery(response: ObservationJobResponse<PrepareReportHandoffDeliveryJobOutput>) -> Result<Self, ApplicationError>` | `PrepareReportHandoffDelivery` / `Self::PrepareReportHandoffDelivery` |
| prepare external audit export | `pub fn prepare_external_audit_export(response: ObservationJobResponse<PrepareExternalAuditExportJobOutput>) -> Result<Self, ApplicationError>` | public `PrepareExternalAuditExport` / `Self::PrepareExternalAuditExport`; `operation()` maps to internal `PrepareExternalAuditExportDelivery` |
| rebuild peripheral views | `pub fn rebuild_peripheral_views(response: ObservationJobResponse<RebuildPeripheralViewsJobOutput>) -> Result<Self, ApplicationError>` | `RebuildPeripheralViews` / `Self::RebuildPeripheralViews` |

These constructors consume only a response already formed by the exact Job response mapper. Their check is intentionally narrow: the typed parameter fixes the output variant at compile time, and the constructor verifies only that `response.job_name` matches the fixed row. A name mismatch returns canonical `application::errors::ApplicationError::PersistenceInvariantViolation`. C-08 does not define a second application error owner.

Deep `result_ref` / outcome / output / report / error consistency is a precondition of calling C-08, not a validator implemented by this carrier. The exact per-Job response assembler must establish the Step 08 §7.9.4 and Step 12 §13.4 invariants before construction. If it cannot establish a complete response, it returns the exact existing `ApplicationError` through C-09 and must not construct C-08 or fabricate a report/result. The frozen Step 08 affected review must make those nine assembler checks explicit; C does not invent a nonexistent universal response validator or callable name.

| member | exact signature | contract |
|---|---|---|
| operation | `pub fn operation(&self) -> ObservationJobOperation` | same total mapping as invocation |
| public name | `pub fn public_job_name(&self) -> &ObservationJobName` | borrows existing response field |
| outcome | `pub fn outcome(&self) -> &ObservationJobOutcome` | borrows public classification; does not mutate durable report |
| result move | each exact jobs mapper pattern-matches and consumes the variant | no generic `Any`/downcast/output erasure |

The result wrapper is process-local. Durable authority remains the existing stored result / `ObservationJobReportDraft` / report surface. For `DuplicateReplayed`, the exact response mapper must supply the original stored response and must not rerun the Job；C-08 only preserves that wrapper. A response passed to C-08 must already contain the assembler-approved result/report pair；C-08 never mints, repairs, or revalidates either.

Planned cuts: nine typed response/name combinations；72 wrong-name negatives；typed output mismatch unrepresentable at each constructor；nine exact response assemblers cover result/outcome/output/report/error invariants in the Step 08 affected review；assembler failure returns existing `ApplicationError` through C-09；duplicate exact replay；no report/result generation；result enum absent from persistence schema. Status: `planned/not_run`.

## 14. C-09 `ObservationJobInvocationFailure`

### 14.1 Capability and definition

This enum is used only before a complete public Job response can be formed. It reuses existing error owners and deliberately has no `Runtime`, `Infra`, `Worker`, `Job`, string-message or provider-error variant.

```rust
/// Existing typed failure before a complete public Job response can be formed.
pub enum ObservationJobInvocationFailure {
    /// Public request or route/body validation failed before application work.
    Protocol(ProtocolError),

    /// Application orchestration failed before a complete response was formed.
    Application(ApplicationError),
}
```

### 14.2 Constructors and mapping

| member | exact signature | contract |
|---|---|---|
| protocol factory | `pub fn protocol(error: ProtocolError) -> Self` | no UoW success/report/result may be implied |
| application factory | `pub fn application(error: ApplicationError) -> Self` | preserves canonical application classification; no string parsing |
| protocol predicate | `pub const fn is_protocol(&self) -> bool` | pure classification |
| safe mapping | jobs entry pattern-matches and maps through existing Step 12 recovery/public error rules | no generic status/default retry |

| failure source | expected variant | forbidden behavior |
|---|---|---|
| missing/malformed request or wrong body variant | `Protocol(InvalidEnvelope/RouteBodyMismatch)` | create fake response/report/result ref |
| application validation, dependency, consistency or commit classification before complete response | `Application(exact variant)` | collapse to `JobError`, raw message or retryable bool |
| handler returned complete failure response/report | C-08 result with formal `ObservationJobOutcome` | also return C-09 failure; two authorities |
| registration/setup failure | `RuntimeAssemblyError` before root exposure | wrap as invocation failure |

This wrapper is not persisted and does not itself choose scheduler retry. Recovery derives from the existing protocol/application error plus durable phase; commit/finalize unknown cannot be blindly retried.

Planned cuts: every ProtocolError/ApplicationError family preserved; complete-response and failure mutually exclusive; no report/result mint; no raw detail/debug leakage; registration error cannot enter C-09. Status: `planned/not_run`.

## 15. C-10 `ObservationJobHandlerCatalog`

### 15.1 Capability and owner split

The Job catalog is the finite callback shape consumed by `JobScheduleRegistrar` and one-shot jobs composition. Infra owns the shape; jobs constructs handlers. Enabled and scheduled are separate sets: every enabled Job needs a handler, while only scheduled Jobs need a registrar private trigger.

```rust
/// Exact finite callback catalog for all P0 observation Job operations.
pub struct ObservationJobHandlerCatalog {
    publish_observation_outbox: Option<Arc<dyn ObservationJobHandler>>,
    rebuild_observation_read_models: Option<Arc<dyn ObservationJobHandler>>,
    rebuild_signal_rollups: Option<Arc<dyn ObservationJobHandler>>,
    refresh_reference_snapshots: Option<Arc<dyn ObservationJobHandler>>,
    scan_observation_gaps: Option<Arc<dyn ObservationJobHandler>>,
    coordinate_observation_replay: Option<Arc<dyn ObservationJobHandler>>,
    prepare_report_handoff_delivery: Option<Arc<dyn ObservationJobHandler>>,
    prepare_external_audit_export: Option<Arc<dyn ObservationJobHandler>>,
    rebuild_peripheral_views: Option<Arc<dyn ObservationJobHandler>>,
}
```

### 15.2 Constructor and validation contracts

```rust
impl ObservationJobHandlerCatalog {
    pub fn from_slots(
        publish_observation_outbox: Option<Arc<dyn ObservationJobHandler>>,
        rebuild_observation_read_models: Option<Arc<dyn ObservationJobHandler>>,
        rebuild_signal_rollups: Option<Arc<dyn ObservationJobHandler>>,
        refresh_reference_snapshots: Option<Arc<dyn ObservationJobHandler>>,
        scan_observation_gaps: Option<Arc<dyn ObservationJobHandler>>,
        coordinate_observation_replay: Option<Arc<dyn ObservationJobHandler>>,
        prepare_report_handoff_delivery: Option<Arc<dyn ObservationJobHandler>>,
        prepare_external_audit_export: Option<Arc<dyn ObservationJobHandler>>,
        rebuild_peripheral_views: Option<Arc<dyn ObservationJobHandler>>,
    ) -> Self;
}
```

Every `Some(handler)` must return the exact corresponding `ObservationJobOperation`; the `prepare_external_audit_export` field must return `PrepareExternalAuditExportDelivery`. The shape constructor does not classify a mismatch; the infra registrar performs that check with its private assembly context and returns `EntryBindingIncomplete` without exposing a partial registered set.

| member | exact signature | contract |
|---|---|---|
| finite slot constructor | signature above | 只包装九个 typed slot；不创建 error、不运行 handler、不做 I/O |
| enabled totality predicate | `pub(crate) fn matches_enabled(&self, enabled_jobs: &[ObservationJobOperation]) -> bool` | enabled exact `Some`、slot name与`handler.operation()` exact；disabled exact `None`; all nine checked；`false`由 registrar 映射为 `EntryBindingIncomplete` |
| scheduled subset predicate | `pub(crate) fn matches_schedules(&self, schedules: &[ValidatedJobScheduleRegistration]) -> bool` | every scheduled operation enabled and `Some`; unscheduled enabled is legal；`false`由 registrar 映射为 `EntryBindingIncomplete` |
| enabled count | `pub fn enabled_count(&self) -> usize` | informational only; not a totality substitute |
| scheduled take | `pub(crate) fn take_scheduled_for(&mut self, operation: ObservationJobOperation) -> Option<Arc<dyn ObservationJobHandler>>` | registrar only；exact finite match；each scheduled slot moved once；unscheduled slot is not taken by registrar |
| empty | `pub fn is_empty(&self) -> bool` | pure shape predicate；只有 registrar 已确认 validated enabled set empty 时才可接受该结果 |

### 15.3 Operation / slot matrix

| field | exact operation | schedule requirement |
|---|---|---|
| `publish_observation_outbox` | `PublishObservationOutbox` | optional schedule; may be operator/resident invocation |
| `rebuild_observation_read_models` | `RebuildObservationReadModels` | optional |
| `rebuild_signal_rollups` | `RebuildSignalRollups` | optional |
| `refresh_reference_snapshots` | `RefreshReferenceSnapshots` | optional |
| `scan_observation_gaps` | `ScanObservationGaps` | optional |
| `coordinate_observation_replay` | `CoordinateObservationReplay` | optional |
| `prepare_report_handoff_delivery` | `PrepareReportHandoffDelivery` | optional |
| `prepare_external_audit_export` | `PrepareExternalAuditExportDelivery` | optional; public request name differs |
| `rebuild_peripheral_views` | `RebuildPeripheralViews` | optional |

The jobs composition root constructs each enabled immutable handler once as an `Arc`. It retains one `Arc` in the exact one-shot handler registry and passes an `Arc::clone` into the corresponding C-10 slot; cloning the pointer does not create a second handler or registry. R06.7-D reviewed and rejected an additional `ObservationJobRunnerContext` wrapper because C-07 invocation plus the exact handler already carry the complete entry call. `JobScheduleRegistrar::register_all` validates the complete enabled catalog, calls `take_scheduled_for` only for scheduled operations, and releases its remaining unscheduled catalog references after totality succeeds. It must not silently schedule an unscheduled handler or consume the jobs root's retained one-shot handle.

### 15.4 Group atomicity and planned cuts

For scheduled slots, registration uses prepare-all -> totality -> arm-all. Any failure revokes/joins every prepared schedule and returns `EntryBindingIncomplete`; no Job callback may start before success. Empty scheduled set returns an empty opaque registered handle while the jobs root retains enabled one-shot handlers. Planned cuts: nine field/operation checks; all enabled/scheduled subset combinations; external-audit spelling mismatch; empty schedules + nonempty enabled set; one-shot Arc remains callable after catalog consumption; callback-before-Ok negative; revoke/join injection; no scheduler locator/metadata synthesis. Status: `planned/not_run`.

## 16. C-11 `ValidatedWorkerEntryConfig`

### 16.1 Capability and boundary

该对象是 runtime builder 给 worker composition root 的 locator-free slice。R06.7-E已将其标记为`FC_affected`：当前只确认已验证Consumer registration属于worker slice；下列resident outbox cadence/limit字段是historical affected definition，R06.8必须删除或重新归入canonical Job/config derivation。它不会把 raw `InboundConsumerBindingConfig`、transport handle、actor-policy locator、outbox repository 或 publisher adapter 传入 worker。

```rust
/// Immutable locator-free worker entry slice derived from one validated runtime.
pub struct ValidatedWorkerEntryConfig {
    inbound_consumers: Vec<ValidatedInboundConsumerRegistration>,
    // Historical affected fields; not current implementation authority.
    outbox_loop_cadence: PositiveDurationMillis,
    outbox_candidate_limit: PositiveLimit,
}
```

### 16.2 Field source, factory and members

| 字段 | 来源与约束 |
|---|---|
| `inbound_consumers` | validated enabled Consumer set经C-01派生；canonical operation order、unique；每项有对应private transport/actor-policy slot；不含locator/material |
| `outbox_loop_cadence` | validated typed positive duration；只表示resident loop调度预算，不是publication retry或external timeout |
| `outbox_candidate_limit` | validated typed positive limit；只限制一次application publication service candidate selection，不表示完成数量 |

| member | exact signature / contract |
|---|---|
| constructor | `pub(crate) fn from_validated(inbound_consumers: Vec<ValidatedInboundConsumerRegistration>, outbox_loop_cadence: PositiveDurationMillis, outbox_candidate_limit: PositiveLimit) -> Self`；只在 builder 已检查 operation uniqueness、typed bounds 和 private-slot cardinality 后调用；canonicalize，不读取 raw source 或构造 adapter |
| registrations | `pub fn inbound_consumers(&self) -> &[ValidatedInboundConsumerRegistration]`；无private slot lookup |
| cadence | `pub fn outbox_loop_cadence(&self) -> &PositiveDurationMillis`；worker只可传给既有resident loop/application facade |
| candidate limit | `pub fn outbox_candidate_limit(&self) -> &PositiveLimit`；只作为一次candidate selection上限 |
| enabled predicate | `pub fn enables_consumer(&self, operation: ObservationInboundConsumerOperation) -> bool`；exact finite membership，无default |
| count | `pub fn consumer_count(&self) -> usize`；不能替代逐slot totality |

The slice does not expose frame limit, transport action, service locator, repository, UoW or raw timeout. Frame bound remains a private registrar capability. Missing private slot, duplicate operation, invalid order/value or safe/private cardinality mismatch fails startup with `EntryBindingIncomplete` / `InvalidConfiguration`; no worker root is exposed.

The object is process-local and non-persistent. It cannot create truth, receipt, outbox or Job request. Planned cuts: canonical order; empty/disabled/all-enabled subsets; duplicate registration; typed cadence/limit boundaries; no private getter; worker uses application publication facade only. Status: `planned/not_run`.

## 17. C-12 `ValidatedJobsEntryConfig`

### 17.1 Capability and boundary

该对象是给 jobs composition root 的 locator-free Job/schedule slice。它区分 enabled 与 scheduled，并只提供一次 invocation 的 bounded `job_timeout`；不携带 cron、schedule locator、target catalog、current config、plan、claim、report 或 request synthesis input。

```rust
/// Immutable locator-free Jobs entry slice derived from one validated runtime.
pub struct ValidatedJobsEntryConfig {
    enabled_jobs: Vec<ObservationJobOperation>,
    job_schedules: Vec<ValidatedJobScheduleRegistration>,
    job_timeout: PositiveDurationMillis,
}
```

### 17.2 Field source, factory and members

| 字段 | 来源与约束 |
|---|---|
| `enabled_jobs` | validated finite Job set；canonical order、unique；enabled但unscheduled合法 |
| `job_schedules` | C-02派生的scheduled subset；canonical order、unique；每项必须属于enabled set；无trigger material |
| `job_timeout` | validated positive duration；只是一轮runner invocation budget，不是durable execution timeout、external cancellation或plan field |

| member | exact signature / contract |
|---|---|
| constructor | `pub(crate) fn from_validated(enabled_jobs: Vec<ObservationJobOperation>, job_schedules: Vec<ValidatedJobScheduleRegistration>, job_timeout: PositiveDurationMillis) -> Self`；只在 builder 已检查 finite/unique/order/subset 和 timeout 后调用；不解析 scheduler |
| enabled jobs | `pub fn enabled_jobs(&self) -> &[ObservationJobOperation]`；canonical read-only slice，不暴露locator/trigger |
| schedules | `pub fn job_schedules(&self) -> &[ValidatedJobScheduleRegistration]`；canonical read-only slice，不暴露locator/trigger |
| timeout | `pub fn job_timeout(&self) -> &PositiveDurationMillis`；不得写入Job plan或resume current config |
| enabled predicate | `pub fn enables_job(&self, operation: ObservationJobOperation) -> bool`；exact finite membership |
| scheduled predicate | `pub fn schedules_job(&self, operation: ObservationJobOperation) -> bool`；exact finite membership |
| subset check | `pub fn schedules_only_enabled_jobs(&self) -> bool`；pure invariant |

An enabled-but-unscheduled Job remains operator/one-shot callable and still requires a C-10 handler. A schedule never creates missing request metadata. Unknown/duplicate/disabled schedule, invalid timeout or scheduled-not-enabled mismatch fails startup; no partial jobs root or schedule escapes.

The object is process-local and non-persistent; it does not create plan/claim/report/source truth. Planned cuts: all enabled/scheduled subsets; empty schedules + enabled handlers; duplicate/unknown operation; timeout boundary; no locator; no synthesized request; enabled totality independent of schedule totality. Status: `planned/not_run`.

## 18. C-13 historical aggregate `BuiltObservabilityRuntime`（superseded）

### 18.1 Capability and complete assembly contract

本节代码块、factory/accessor表和 all-three same-assembly lifecycle 是
R06.7-C 历史 checkpoint，已由 R06.8-B §8 supersede。Current 不存在该
aggregate type、十二参数 constructor、五 façade、裸 context factory、
service/slice/registrar accessor或三个 root 共激活。Current只保留本节的
complete-or-error、process-local、no raw/private material、no truth/evidence
claim原则，并由三个具名 built-runtime wrappers 分别实现。

```rust
/// Complete immutable wiring assembled without depending on entry crates.
pub struct BuiltObservabilityRuntime {
    truth_write_service: Arc<dyn ObservationTruthWriteService>,
    read_service: Arc<dyn ObservationReadService>,
    inbound_event_service: Arc<dyn ObservationInboundEventService>,
    maintenance_service: Arc<dyn ObservationMaintenanceService>,
    publication_service: Arc<dyn ObservationPublicationService>,
    operation_context_factory: Arc<dyn ObservationOperationContextFactory>,
    availability_probe: Arc<dyn AdapterAvailabilityProbe>,
    api_entry: ValidatedApiEntryConfig,
    worker_entry: ValidatedWorkerEntryConfig,
    jobs_entry: ValidatedJobsEntryConfig,
    inbound_consumer_registrar: Arc<dyn InboundConsumerRegistrar>,
    job_schedule_registrar: Arc<dyn JobScheduleRegistrar>,
}
```

No field exposes concrete repository、adapter、UoW、private registry or raw config. Existing `ValidatedApiEntryConfig` remains an infra config/Step 14 safe slice; C-13 consumes it without creating a duplicate API object card.

### 18.2 Historical factory and access surface（do not implement）

```rust
impl BuiltObservabilityRuntime {
    pub(crate) fn from_complete(
        truth_write_service: Arc<dyn ObservationTruthWriteService>,
        read_service: Arc<dyn ObservationReadService>,
        inbound_event_service: Arc<dyn ObservationInboundEventService>,
        maintenance_service: Arc<dyn ObservationMaintenanceService>,
        publication_service: Arc<dyn ObservationPublicationService>,
        operation_context_factory: Arc<dyn ObservationOperationContextFactory>,
        availability_probe: Arc<dyn AdapterAvailabilityProbe>,
        api_entry: ValidatedApiEntryConfig,
        worker_entry: ValidatedWorkerEntryConfig,
        jobs_entry: ValidatedJobsEntryConfig,
        inbound_consumer_registrar: Arc<dyn InboundConsumerRegistrar>,
        job_schedule_registrar: Arc<dyn JobScheduleRegistrar>,
    ) -> Self;
}
```

| member | exact signature / contract |
|---|---|
| builder-only constructor | exact 12-argument `from_complete` signature above；consumes only stage-11-complete values；stage 11 performs all structural/error checks before this infallible move；no partial value is exposed |
| truth write accessor | `pub fn truth_write_service(&self) -> Arc<dyn ObservationTruthWriteService>`；cloned immutable handle |
| read accessor | `pub fn read_service(&self) -> Arc<dyn ObservationReadService>`；cloned immutable handle |
| inbound event accessor | `pub fn inbound_event_service(&self) -> Arc<dyn ObservationInboundEventService>`；cloned immutable handle |
| maintenance accessor | `pub fn maintenance_service(&self) -> Arc<dyn ObservationMaintenanceService>`；cloned immutable handle |
| publication accessor | `pub fn publication_service(&self) -> Arc<dyn ObservationPublicationService>`；cloned immutable handle |
| context accessor | `pub fn operation_context_factory(&self) -> Arc<dyn ObservationOperationContextFactory>`；all roots use this exact assembly handle |
| availability accessor | `pub fn availability_probe(&self) -> Arc<dyn AdapterAvailabilityProbe>`；read/probe only, no health mutation |
| API slice accessor | `pub fn api_entry(&self) -> &ValidatedApiEntryConfig`；read-only safe slice，无 raw root |
| worker slice accessor | `pub fn worker_entry(&self) -> &ValidatedWorkerEntryConfig`；read-only safe slice，无 private slot getter |
| jobs slice accessor | `pub fn jobs_entry(&self) -> &ValidatedJobsEntryConfig`；read-only safe slice，无 trigger getter |
| Consumer registrar accessor | `pub fn inbound_consumer_registrar(&self) -> Arc<dyn InboundConsumerRegistrar>`；cloned exact handle，不允许 replacement/lookup |
| Job registrar accessor | `pub fn job_schedule_registrar(&self) -> Arc<dyn JobScheduleRegistrar>`；cloned exact handle，不允许 replacement/lookup |

The object must not implement public arbitrary `Clone`, `with_*`, field replacement, `downcast`, `into_repository` or `resolve_binding`. Same-assembly identity is enforced by one linear builder transaction: stages 1~11 keep all twelve values unexposed and move them together into this crate-private constructor. C-13 does not invent a runtime ID, comparison token or evidence identity. A later entry root may only borrow a slice and clone its matching registrar from this same instance; public APIs cannot inject or replace either side.

### 18.3 Historical lifecycle and current retained boundary

Creation occurs only after builder stages 1~11 complete. Stage 11 owns all checks that can produce C-15; stage 12 moves the twelve complete values through `from_complete` and returns this object. Stage 13 entry-local catalog registration is not implied. A stage 13 failure exposes no partial registered root and revokes all prepared items from that attempt. Reconfiguration creates a new complete assembly/process activation; no in-place adapter/service swap exists.

This object is process-local immutable wiring, not durable truth or evidence. Planned cuts: all required handles; same-assembly pairing; no downcast/raw config; no callback before registration; no private material in debug; new assembly required for config change. Status: `planned/not_run`.

## 19. C-14 `RuntimeAssemblyIssueRef`

### 19.1 Responsibility and definition

`RuntimeAssemblyIssueRef` 是 startup-only、body-free 诊断关联 carrier。它可让后续 Step 15 安全关联同一次 assembly failure，但不证明 external call、Job、evidence 或验收系统记录存在。

```rust
/// Body-free correlation identity for one runtime assembly issue.
#[repr(transparent)]
pub struct RuntimeAssemblyIssueRef(BodyFreeRef);
```

| 项 | 契约 |
|---|---|
| owner | `infra::runtime_builder` |
| mint source | infra startup issue allocator，从已验证 generated `BodyFreeRef` 产生 |
| factory | `pub(crate) fn from_generated(value: BodyFreeRef) -> Self`；不从raw message/path/secret/provider response派生 |
| accessor | `pub fn as_body_free_ref(&self) -> &BodyFreeRef`；只供safe startup telemetry/error mapping |
| equality | exact issue identity；不等于config ref、trace ref、run id、evidence alias |
| lifetime | one assembly attempt；process-local safe correlation |
| persistence | 不作为durable row、result、report、outbox、audit truth或acceptance evidence |

The wrapper must not implement `Display`, full-value serialization or conversions to `JobRunId`, `TraceId`, `EvidenceLinkageRef`, `DiagnosticSummaryRef` or `ConfigBindingRef`. `Debug` follows redacted `BodyFreeRef` behavior.

Every `RuntimeAssemblyError` variant carries exactly one issue ref. Missing issue ref is an internal assembly invariant and must fail closed; it is not repaired by inventing evidence. Planned cuts: generated ref validation; cross-wrapper conversion absence; redacted debug; no raw body/path/secret; no persistence/evidence mint. Status: `planned/not_run`.

## 20. C-15 `RuntimeAssemblyError`

### 20.1 Rust-facing definition

```rust
/// Startup-only failure returned when a complete runtime cannot be assembled.
pub enum RuntimeAssemblyError {
    ConfigSourceUnavailable {
        issue_ref: RuntimeAssemblyIssueRef,
    },
    InvalidConfiguration {
        config_ref: Option<ConfigBindingRef>,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    SensitiveReferenceUnavailable {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    StoreCompatibilityMismatch {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    AdapterConstructionFailed {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        effect_binding_ref: Option<ExternalEffectBindingRef>,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    RequiredCapabilityMissing {
        config_ref: ConfigBindingRef,
        adapter_family: AdapterFamily,
        effect_binding_ref: Option<ExternalEffectBindingRef>,
        phase: Option<ExternalEffectPhase>,
        issue_ref: RuntimeAssemblyIssueRef,
    },
    EntryBindingIncomplete {
        config_ref: ConfigBindingRef,
        issue_ref: RuntimeAssemblyIssueRef,
    },
}
```

The enum is the only startup error owner. It carries no provider text、endpoint、credential、schedule、handler string、payload、stack trace、Job report、public outcome、evidence alias or acceptance signature.

### 20.2 Variant source and required behavior

| variant | detection boundary | required behavior | forbidden mapping |
|---|---|---|---|
| `ConfigSourceUnavailable` | raw source load before validated identity | abort before adapter/service construction | raw path/value、secret、`InvalidRequest` |
| `InvalidConfiguration` | parse/type/range/cross-field/profile/redline/digest validation | reject whole candidate | default-and-continue、raw dump |
| `SensitiveReferenceUnavailable` | infra-only credential/endpoint/reference resolution | required surface aborts; no fake fallback | secret/body、silent enable/disable |
| `StoreCompatibilityMismatch` | schema/UoW/unique/CAS/fence capability check | no affected facade/Job registry | process mutex/best-effort substitute |
| `AdapterConstructionFailed` | concrete adapter construction | exact family/binding stays unassembled | provider body、downcast、current-target fallback |
| `RequiredCapabilityMissing` | declared capability vs implementation/entry descriptor | enabled surface aborts or remains explicitly disabled only under validated requirement class | capability lie、Unsupported as success |
| `EntryBindingIncomplete` | safe slice/catalog/registrar totality or prepare/arm | zero entry root; revoke/join all prepared items | partial route/loop/schedule、warning handle、first-call failure |

### 20.3 Members and lifecycle

| member | exact signature / contract |
|---|---|
| issue | `pub fn issue_ref(&self) -> &RuntimeAssemblyIssueRef`；total seven-variant match |
| config | `pub fn config_ref(&self) -> Option<&ConfigBindingRef>`；typed identity only |
| family | `pub fn adapter_family(&self) -> Option<AdapterFamily>`；finite family only |
| effect binding | `pub fn effect_binding_ref(&self) -> Option<&ExternalEffectBindingRef>`；opaque ref, no resolution |
| phase | `pub fn phase(&self) -> Option<ExternalEffectPhase>`；finite phase only |
| entry predicate | `pub const fn is_entry_binding_incomplete(&self) -> bool` |
| safe code | `pub const fn stable_code(&self) -> &'static str`；fixed internal startup token, not config/business state |

`stable_code()` uses an exhaustive match rather than enum ordinal, `Debug` text or provider detail:

| variant | exact stable code |
|---|---|
| `ConfigSourceUnavailable` | `observability.runtime.config_source_unavailable` |
| `InvalidConfiguration` | `observability.runtime.invalid_configuration` |
| `SensitiveReferenceUnavailable` | `observability.runtime.sensitive_reference_unavailable` |
| `StoreCompatibilityMismatch` | `observability.runtime.store_compatibility_mismatch` |
| `AdapterConstructionFailed` | `observability.runtime.adapter_construction_failed` |
| `RequiredCapabilityMissing` | `observability.runtime.required_capability_missing` |
| `EntryBindingIncomplete` | `observability.runtime.entry_binding_incomplete` |

These tokens are process-startup diagnostic classifications. They are not public protocol error codes, config keys, durable evidence aliases, acceptance IDs or authorization inputs; changing display text must not change them.

The enum is consumed by startup composition, not retried as an application operation or converted to Command/Query/Consumer/Job outcome. Under the current R06.8-B contract, after the selected one of `BuiltApiObservabilityRuntime`、`BuiltWorkerObservabilityRuntime` or `BuiltJobsObservabilityRuntime` exists, later failures use existing `ApplicationError`, `WorkerError`, `JobError` and public mappings. The historical aggregate name is not restored. The error is not persisted as a real run/evidence record.

Planned cuts: seven variants; field-presence matrix; exact stage mapping; complete-or-error; no raw detail; no business UoW; redacted safe code/issue ref. Status: `planned/not_run`.

## 21. Runtime builder assembly contract

### 21.1 Builder owner and callable surface

`infra::runtime_builder` 是 C 批唯一 runtime assembly owner。它可以依赖
`application`、`domain`、`contracts` 和 `core-contracts`，但不能依赖
`api`、`worker` 或 `jobs`。配置激活的 stages 1~4 由 `infra::config` 的
loader / validator / identity boundary 先完成并产出
`ValidatedObservabilityConfig`。下表中的单一 `build(config) ->
`BuiltObservabilityRuntime` callable 是 historical；current R06.8-B §8.4
使用 `build_api`、`build_worker`、`build_jobs` 三个 finite method，各自只
负责选定 profile 的 stages 5~12并返回匹配具名 runtime或C-15 error。

| logical member | C 批固定契约 |
|---|---|
| historical operation | `build(&self, config: ValidatedObservabilityConfig)`；superseded，不实现 |
| current operations | `build_api` / `build_worker` / `build_jobs`；exact signatures见R06.8-B §8.4 |
| completion | asynchronous completion resolving to the matching one of three finite built-runtime wrappers or `RuntimeAssemblyError` |
| input ownership | consumes one fully validated root；does not accept raw source、entry-local catalog or locator |
| output atomicity | exactly one complete selected-profile runtime or one startup error；no other profile assignment、partial runtime、warning tuple or deferred first-call assembly |
| upstream activation boundary | `infra::config` stages 1~4 load raw sources、parse/type/range、cross-field/profile validation and establish `ConfigBindingRef`；failure uses the same C-15 error owner but occurs before this callable is invoked |
| builder boundary | stages 5~12 resolve private references、check stores/capabilities、construct adapters/probe/services、derive safe slices/registrars and move `from_complete` |
| entry boundary | stage 13 is performed independently by the selected API/worker/jobs process after stage 12；profile-local totality/registration failure maps to `EntryBindingIncomplete` and makes no claim about another process |

This is a logical callable contract, not a second trait declaration. The existing Step 14 `ObservabilityRuntimeBuilder` use-site remains frozen input, while exact Rust async lowering and any object-safe future alias belong to the later Step 07 / Step 14 affected review. C therefore defines no `RuntimeBuildFuture`, registrar trait body or handler trait body.

### 21.2 Thirteen-stage assembly matrix

| stage | 输入 | 输出 / ownership | 必须检查 | 失败结果 |
|---:|---|---|---|---|
| 1 | raw source loader result、entry selector | infra-private raw candidate | source availability；不记录 raw value | `ConfigSourceUnavailable`；属于上游 config activation，不是 `build` 的输入 |
| 2 | raw candidate | typed candidate | parse/type/overflow/unknown token | `InvalidConfiguration`；属于上游 config activation |
| 3 | typed candidate | cross-field compatible candidate | profile、redline、store/limit/retention/retry/capability compatibility | `InvalidConfiguration`；属于上游 config activation |
| 4 | compatible candidate | `ConfigBindingRef` + `ValidatedObservabilityConfig` | identity stable、body/secret excluded | `InvalidConfiguration`；完成后才调用 `build` |
| 5 | validated config + sensitive refs / endpoint refs | adapter-private resolved material | secret never enters safe carrier | `SensitiveReferenceUnavailable` |
| 6 | store bindings + required schema | repositories/UoW/idempotency/projection/job store capability descriptors | atomic UoW、unique、CAS、fence、schema revision | `StoreCompatibilityMismatch` |
| 7 | validated technical inputs + store descriptors | clock/id/digest factories、repositories、application port implementations | required constructor parity；no business transition | `AdapterConstructionFailed` / `RequiredCapabilityMissing` |
| 8 | external/entry binding descriptors + private resolved material | resolver/publisher/delivery/transport/actor/scheduler private adapters and capability descriptors | exact family/effect binding、frame bound、complete Job request capability、declared-vs-implemented capabilities | `AdapterConstructionFailed` / `RequiredCapabilityMissing` |
| 9 | adapter descriptors and safe probes | application `AdapterAvailabilityProbe` implementation | application-owned scope/kind/state factory；no diagnostic mint/no write | `RequiredCapabilityMissing` / `AdapterConstructionFailed` |
| 10 | application ports + validated policy/execution inputs + safe external catalog | four entry-callable service handles + private input-assembly/context/canonicalizer internals + publication collaborator dependencies | no infra config/concrete adapter in application；selected entry只能取得matching assembler facet；no fifth entry façade | `AdapterConstructionFailed` / `InvalidConfiguration` |
| 11 | validated root + selected entry method + service/assembler handles + private entry handles | exactly one API、worker or jobs assignment；worker/jobs含matching registrar | exact selected-profile field totality；raw-binding/private-slot/safe-item same config identity；other profiles absent | `EntryBindingIncomplete` |
| 12 | one complete selected assignment | matching named built-runtime wrapper | all selected-profile fields present；complete-or-error；no assignment getter/partial escape | `EntryBindingIncomplete` |
| 13 | matching built runtime + entry-created finite catalog/route table | one process-local API root、registered Consumer set or jobs runners/schedule set | profile-local prepare-all -> totality -> arm/publish-all；zero active subset on failure | `EntryBindingIncomplete`；selected entry/infra seam |

Stage 13 is performed by entry crates after stage 12 returns. It is listed here because C-06/C-10 catalogs and registrar atomicity depend on its exact handoff, but C does not define API/worker/jobs local state or `EntryDisposition`.

### 21.3 Complete-or-error pseudocode

```text
activate():
  validated_config = infra_config_stage_1_to_4(raw_sources, entry_selector)
  return runtime_builder.build(validated_config)

build(validated_config):
  private_refs    = stage_5(validated_config)
  stores          = stage_6(validated_config, private_refs)
  technical       = stage_7(validated_config, stores)
  external        = stage_8(validated_config, private_refs, technical)
  availability    = stage_9(external, technical.clock)
  application     = stage_10(stores, external.safe_catalog, validated_config.policy)
  entry_slices    = stage_11(validated_config.entries, external.private_handles, application)
  runtime         = stage_12(application, availability, entry_slices)
  return runtime
```

Every activation or builder stage failure drops all unexposed local constructors and returns one redacted `RuntimeAssemblyError` through the activation owner. No `Result<(partial_runtime, warnings), error>` shape is allowed. A stage must not write observation truth, projection, reference, outbox, report, evidence linkage or external effect as part of assembly.

### 21.4 Same-assembly and no-reverse-dependency checks

| check | required result |
|---|---|
| service/assembler identity | selected entry's service and matching assembler facet come from one builder invocation；naked context factory never crosses entry boundary |
| worker slice/registrar identity | safe registrations correspond one-to-one with registrar private slots from same `ConfigBindingRef` |
| jobs slice/registrar identity | scheduled safe items correspond one-to-one with private triggers from same `ConfigBindingRef` |
| availability/probe identity | probe returns current application-owned objects and exact binding scope; no infra shadow enum |
| crate direction | infra never imports entry crate; entry never receives raw infra private material |
| public boundary | no C object becomes new Step 08 DTO or public business result |

## 22. Registrar group transaction contract

### 22.1 Consumer registration

`InboundConsumerRegistrar::register_all(catalog)` must execute the following logical phases atomically for one assembly:

1. `prepare_all`: for every enabled safe registration, pair exact operation/producer/schema metadata with the corresponding private transport/actor-policy slot and handler.
2. `totality_check`: verify all enabled operations have exactly one handler, all disabled operations have none, and all safe items have one private slot.
3. `arm_all`: activate callbacks only after every prepared item passes checks.
4. `return_opaque_handle`: return `RegisteredInboundConsumerSet` only after all active handles are owned by the returned process-local object.

If any prepare/totality/arm step fails, registrar revokes every item prepared by this call, awaits/join-drains any spawned registration task, and returns `RuntimeAssemblyError::EntryBindingIncomplete`. It never returns a warning, partial handle or active subset. No Consumer callback may run before `register_all` returns `Ok`.

### 22.2 Job schedule registration

`JobScheduleRegistrar::register_all(catalog)` uses the same four phases for the scheduled subset. It validates the complete enabled catalog first, then registers only `ValidatedJobScheduleRegistration` entries. Enabled-but-unscheduled operations remain available through the jobs one-shot/operator path and are not silently dropped or scheduled.

The scheduler callback must receive a complete existing `ObservationJobRequest<T>` and be mapped to C-07. If the scheduler cannot carry the request, stage 8 fails `RequiredCapabilityMissing`; it cannot synthesize metadata, input, scope, target, cursor, consumer, run identity or evidence identity.

### 22.3 Failure and shutdown boundary

Registrar failure is startup/entry composition failure, not `ApplicationError`, `WorkerError` or `JobError` from a business invocation. Once registration succeeds, callback failures use the existing worker/jobs mapping. Shutdown/drain ownership remains in the selected runtime and later operations/config contract; C does not invent drain timeout or persistence state.

## 23. Cross-object field-source and lifecycle audit

| audit dimension | closed rule | planned verification |
|---|---|---|
| operation identity | all Consumer/Job operation values originate from application finite enums; no string/route/cron aliases | static enum-map scan |
| producer identity | Consumer producer family comes only from Step 08 static map and validated binding | nine-row totality test |
| schema identity | accepted schemas come from validated root ∩ binary-supported set; frame header is checked before payload | schema positive/negative matrix |
| actor identity | delivery actor is `ActorSafeRef` projection from trusted boundary; no credential/display body | redaction and mismatch tests |
| Job identity | invocation carries existing `ObservationJobRequest<T>`; no C object mints run/idempotency/actor/input | constructor compile/test cuts |
| config identity | one selected builder invocation derives its safe slice、private slots、registrar and named runtime from one `ConfigBindingRef`; the ref is opaque/body-free and does not prove cross-process atomicity | selected-invocation binding relation test |
| frame bytes | only `InboundEnvelopeFrame` owns bounded bytes, one consumption, no persistence | bounded allocation/ownership tests |
| receipt | completion wraps one existing `ObservationConsumerReceipt` after explicit entry-policy selection；it does not create result/outcome or infer a default action | definite/deferred outcome-action matrix；no-default and call-site tests |
| response/report | C-08 checks only typed variant + public name and wraps an assembler-approved response；durable report/deep invariants remain application/exact-mapper owned | constructor name tests + Step 08 exact response-assembler affected tests |
| availability | BuiltRuntime consumes application-owned state/probe; no infra shadow kind/state | definition/use scan |
| startup issue | every startup error carries one redacted issue ref; never evidence/run/signoff | safe-detail scan |
| entry slice | worker/jobs receive safe metadata and typed budgets only | locator/material static scan |

## 24. No-locator, no-material, no-business-truth audit

### 24.1 Static forbidden surface

The following identifiers must not occur as fields, public accessors or serialized members of C objects: `AdapterBindingRef`, `TransportBindingRef`, `PolicyBindingRef`, `ScheduleBindingRef`, `CredentialRef`, `StoreBindingRef`, endpoint/path/topic/route/cron strings, provider response/body, raw config map, repository/UoW concrete type, `Any`, `downcast`, external `run_id`, evidence alias, verdict, signature and acceptance receipt.

Private infra implementation may hold the first group internally for stage 5/8, but no C object may expose it across the entry boundary. Planned static scan: `planned/not_run`.

### 24.2 Business truth non-ownership

| C object family | explicitly does not own |
|---|---|
| registration/slice | enabled business truth, source truth, schedule truth, Job report |
| delivery/frame/completion | payload truth, receipt creation, transport truth durable state, external acceptance |
| invocation/result/failure | Job plan/claim/report, public outcome authority, real run identity |
| catalog/registrar | handler business policy, domain transition, repository write, callback result |
| BuiltRuntime/startup error | adapter success, event delivery, evidence authenticity, acceptance signoff |

## 25. R06.7-C planned verification cuts

| cut id | planned assertion | status |
|---|---|---|
| `C-OWNER-01` | 15 C objects each has one definition owner and no duplicate current declaration | planned/not_run |
| `C-REG-01` | 9 Consumer registrations are finite, producer/schema total, canonical and locator-free | planned/not_run |
| `C-REG-02` | 9 Job schedule registrations are unique and subset of enabled jobs; unscheduled enabled remains legal | planned/not_run |
| `C-FRAME-01` | empty/limit/limit+1/chunked frame behavior is bounded and single-consumption | planned/not_run |
| `C-FRAME-02` | unbounded transport descriptor fails startup before registration | planned/not_run |
| `C-COMPLETE-01` | action preserves the exact existing receipt；known mappings and deferred mappings are exhaustive；`Rejected`/`UnsupportedSchema` have no default action；registrar never reclassifies or rolls back local truth | planned/not_run |
| `C-CATALOG-01` | Consumer and Job catalogs reject missing/extra/wrong handler operation | planned/not_run |
| `C-CATALOG-02` | enabled/scheduled distinction is preserved; no default or fallback handler | planned/not_run |
| `C-JOB-01` | 9 invocation/result variants preserve existing typed wrappers and exact public names without a fabricated universal completeness API | planned/not_run |
| `C-JOB-02` | exact request/response mappers retain field/deep-invariant validation；Protocol/Application failure is mutually exclusive with complete response；no fabricated report/result | planned/not_run |
| `C-ASSEMBLY-01` | 13 stages are ordered and every failure returns one startup error, never partial runtime | planned/not_run |
| `C-ASSEMBLY-02` | selected-profile slice/service/assembler/registrar identity comes from one invocation；other profiles absent；no cross-process atomicity claim | planned/not_run |
| `C-ATOMIC-01` | prepare-all/totality/arm-all failure revokes/joins all prepared items | planned/not_run |
| `C-ATOMIC-02` | no callback/route/schedule is active before `register_all` returns `Ok` | planned/not_run |
| `C-SAFE-01` | static fields/accessors contain no locator, secret, provider body, run/evidence/signoff identity | planned/not_run |
| `C-NOWRITE-01` | builder, registration, frame and catalog construction make zero domain/UoW/repository/outbox/external-effect writes | planned/not_run |

No cut above has been executed. These are implementation/test handoff requirements only; they are not evidence, test results or runtime health claims.

## 26. Downstream handoff and explicit defer list

### 26.1 Step 07

Step 07 may define the exact object-safe `InboundConsumerHandler`, `ObservationJobHandler`, `InboundConsumerRegistrar`, `JobScheduleRegistrar`, opaque registered-handle traits and future aliases. It must consume the C-01~C-15 types without shadow definitions, preserve `worker/jobs -> infra`, and map registrar failures to C-15. It must not move raw locator/material into the public trait surface.

### 26.2 R06.7-D / E consumed conclusions

- R06.7-D reviewed `ObservationCommandHandlerState`, `ObservationQueryHandlerState`, `OutboxPublisherLoopState`, `ProjectionWorkerLoopState` and `ObservationJobRunnerContext` independently and classified all five as `DX`; no canonical entry state object is added.
- C-03~C-10 remain the complete Consumer / Job technical invocation surface. Static API handlers use root-level least-authority assignment and per-call local values rather than a shared result-bearing state object.
- `PublishObservationOutbox` remains the single formal Operations Job entry mode; the provisional C-11 resident-loop values and publication façade composition are affected definitions for R06.8, not authorization for a second worker execution path.
- R06.7-E deleted `EntryDisposition` as `HX`; no alias/wrapper or renamed generic entry disposition may be restored.
- E retained C-03~C-10 as canonical without reopening their schema, and marked C-11/C-13 `FC_affected` for the R06.8 publication/root-assignment corrections.
- `ObservationConsumerDisposition` and `ObservationJobDisposition` remain historical exclusions.

### 26.3 Step 14 / `04`

Step 14 remains owner of raw config, source precedence, key/default/range, secret/endpoint resolution, transport/actor/scheduler binding and builder implementation details. It must consume C-01/C-02/C-11/C-12/C-13/C-15 without redefinition. `04` is not reopened in this batch.

### 26.4 Step 08~13 and Step 15~19

Public DTO, flow, state, persistence, recovery, concurrency, telemetry, test, handoff and formal assembly remain downstream affected-use work. C objects do not create a new protocol, business state, durable schema, audit event or evidence alias.

## 27. R06.7-C stop review

| 检查项 | 结果 |
|---|---|
| 15 个 C 对象均有独立对象卡 | pass_design_only |
| 每个字段有来源、类型、边界和 consumer | pass_design_only |
| registration / catalog / invocation namespace finite and total | pass_design_only |
| frame bounded、move-only、single-consumption | pass_design_only |
| completion 与 receipt / public outcome / durable result 分层 | pass_design_only |
| completion 已区分 fixed/deferred outcome-action mapping，且无默认 ack/retry/dead-letter | pass_design_only |
| enabled 与 scheduled 语义分离 | pass_design_only |
| Job invocation/result 只检查 typed variant + fixed public name，不引用不存在的统一 validator | pass_design_only |
| BuiltRuntime complete-or-error、无 partial exposure | pass_design_only |
| RuntimeAssemblyError 七变体和 issue ref 边界闭合 | pass_design_only |
| no-locator / no-material / no-business-truth | pass_design_only |
| Step 07 trait body 未在本批定义 | pass_design_only |
| R06.7-D/E 未提前写入 at C completion | pass_design_only；D/E later consumed this checkpoint without reopening C-01~C-10 schema；C-11/C-13为affected handoff |
| formal `03`、Step 07~19、`04`、实现代码未修改 | pass_design_only |
| verification | no；全部 `planned/not_run` |
| commit/run ID/evidence alias/signoff/test result | no |

## 28. 当前停审点

`R06.7-C` 已完成 design-only并由用户确认的R06.7-D/E消费。E的current source是`03_ddd_step_06_runtime_entry_cross_module_r06_7e.md` §§1~18；E保留C-01~C-10 schema、将C-11/C-13标记为`FC_affected`、删除`EntryDisposition`，并把三个executable seam交给R06.8。当前唯一下一批是`R06.8`，必须等待用户明确确认后才能进入。

本批未发现新的外部上游 blocker。`R06.7-ENTRY-DISPOSITION-OWNER`已由E以删除方式关闭；既有 `R06.6-F2-H13-UPSTREAM=open_controlled`、`R06-F-AFFECT-UOW-01=open_controlled_downstream`、`03-RPR-S06-GRANULARITY=open` 与三个executable seam继续阻塞implementation-ready。未经确认不得进入R06.8、Step07~19、正式`03`、任何`04`文件或实现代码。当前不需要提交commit。
