# L2-member-images 03 详细设计 Step 6：逐模块定义对象实现契约

> 创建日期：2026-08-25  
> 最近更新：2026-08-26  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6  
> 回填位置：正式 `03-详细设计.md` 第 5 章的对象实现契约、第 6 章全局索引（当前只形成回填草稿，不得装配正式 03）  
> 当前授权：用户已明确同意仅完成 Step 6；完成后必须停审，未经再次明确确认不得进入 Step 7。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 恢复入口 | 已先读取 `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、Step 5 模块主轴与 Step 5~9 粒度校准；恢复点为 `03 / Step 6 / object_contracts / pass`。 |
| 直接输入 | `03_ddd_step_03_constraints.md`、`03_ddd_step_04_file_layout.md`、`03_ddd_step_05_module_contracts.md`、`02_hld_step_06_key_objects.md`、`02_hld_step_07_api_interface_skeleton.md`、`02_hld_step_08_processing_flows.md`、`02_hld_step_09_state_machine.md`、`02_hld_step_12_detailed_design_handoff.md`、`02_hld_step_13_risks_open_questions.md`。 |
| 参照方法 | 参照 `L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` 的逐模块、逐对象、分批停审和跨项闭环审计方法；不继承其治理对象、outbox、publisher、外部产品或正向合同。 |
| 本步目标 | 将五个 capability 的 33 个已收稳 domain 对象/guard，以及本仓稳定的 contracts、application、infra carrier，收敛为可直接转写的 Rust 类型、字段、函数、factory、状态和不变量。 |
| 本步上限 | 只定义 workspace-internal carrier、本仓 local truth 与 product-neutral seam state；Trait/port 实现留 Step 7，协议 DTO 留 Step 8，函数级 flow 留 Step 9，完整状态矩阵留 Step 10，配置 key/产品选择留后续 Step 和 04。 |
| 本步禁止 | 不读取旧正式 `03-详细设计.md`；不创建实现仓、Cargo、代码、测试、report、evidence、digest 实例、run_id、artifact result、consumer confirmation、readiness 或 commit。 |
| 外部边界 | `L2-member`、`L2-member-service` 和未闭口上游内容只作为 pending。任何 external 值只可进入 typed ref、body-free safe conclusion、`blocked` / `unavailable` / `gap` 或 future reopen point。 |

## 1. Step 内计划、批次与模块门禁

### 1.1 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---:|---|---|---|---|---|
| 6.0 | 开工框架、对象归属、批次、模块顺序、non-core 闭口决策 | `done` | 是 | `pass` | 6.1 |
| 6.1 | `contracts`：shared vocabulary、typed ref、metadata、safe disposition、local read marker、状态 enum | `done` | 是 | `pass` | 6.2 |
| 6.2 | `domain::definition` / `assembly` / guard：DefinitionAssembly 九对象 | `done` | 是 | `pass` | 6.3 |
| 6.3 | `domain::build` / guard：BuildCandidate 六对象 | `done` | 是 | `pass` | 6.4 |
| 6.4 | `domain::qualification` / guard：Qualification 六对象 | `done` | 是 | `pass` | 6.5 |
| 6.5 | `domain::supply` / guard：SupplyEntry 五对象 | `done` | 是 | `pass` | 6.6 |
| 6.6 | `domain::reference` / guard / read model：ReferenceDerived 七对象 | `done` | 是 | `pass` | 6.7 |
| 6.7 | `application`：operation context、UoW/idempotency/result与 coordinator carrier | `done` | 是 | `pass` | 6.8 |
| 6.8 | `infra`：config/composition/adapter availability/blocked/fake carrier | `done` | 是 | `pass` | 6.9 |
| 6.9 | `api` / `worker` / `jobs`：闭口或 defer 决策与必要 local marker | `done` | 是 | `pass` | 6.10 |
| 6.10 | 高复用字段、对象组字段、状态、命名、Step 7 承接及回填审计 | `done` | 是 | `completed_stop_review` | 等待用户确认 Step 7 |

单批次控制单次写入和审查规模，不限制对象卡片的最终详略。任何字段、function、enum variant、来源或禁止事项未闭合时，该批次不得标记完成。

### 1.2 模块执行顺序表

| 顺序 | 模块 / 对象组 | 模块职责 | 主要输入 | 完成后停审点 |
|---:|---|---|---|---|
| 1 | `contracts` | 为全部后续模块提供 workspace-internal typed carrier，且不成为 sibling public contract | Step 3 约束、02 接口骨架、Step 5 seam 分类 | shared ref、metadata、safe disposition、state enum 不泄漏 external body。 |
| 2 | `domain::definition` / `assembly` / `guards` | 拥有 DefinitionAssembly local truth、pin/placement 和 revision 前置 | 02 对象轮廓、definition/baseline/revision 状态轴 | 任一 mapping/component/seed 缺口只形成 incomplete/blocked/gap。 |
| 3 | `domain::build` / `guards` | 拥有 intent、snapshot、attempt、outcome 与 candidate 的阶段事实 | 02 build 流和状态轴 | ACK、registry presence、unknown 不得直接形成 candidate。 |
| 4 | `domain::qualification` / `guards` | 拥有 provenance、gate、eligibility 与 Artifact handoff 的本仓事实 | 02 qualification 流和 pending 边界 | 不自造 gate inventory、evidence body 或 Artifact formal ref。 |
| 5 | `domain::supply` / `guards` | 拥有 availability transition、pinned entry 与 consumer gap | 02 supply 流和状态轴 | local availability 不代表 launch、health 或 consumer confirmation。 |
| 6 | `domain::reference` / `guards` | 拥有 body-free snapshot、gap、trace、freshness和只读 read model 语义 | 02 reference/projection 流 | projection/fake/read model 不得反写核心 truth。 |
| 7 | `application` | 拥有 use-case operation carrier、UoW/idempotency/result semantic 与 coordinator identity | Step 5 coordinator 归属 | 不定义 port 方法或 external DTO。 |
| 8 | `infra` | 拥有 product-neutral config/composition/adapter availability/blocked/fake carrier | Step 4 infra 文件边界 | 不将 slot、adapter 或 fake 升格为业务成功。 |
| 9 | `api` / `worker` / `jobs` | 判断入口对象当前能否闭口，并只保留必要 local marker | Step 5 non-core 决策、MI-UP-005、Q-MI-003 | 不生成 route、topic、verified envelope、scheduler、run/report/evidence。 |

### 1.3 非 core 模块对象闭口 / defer 决策

| 模块 | 当前 Step 6 是否闭口 | 需要闭口的对象组 | defer 的对象组与理由 | 后续承接 Step |
|---|---|---|---|---|
| `application` | 是，限稳定 carrier | `ImageOperationContext`、`ImageUnitOfWorkBoundary`、`ImageIdempotencyRecord`、`StoredImageOperationResult`、五 coordinator identity | port trait、repository/external 调用签名与完整 command/query input/output | Step 7~9 |
| `infra` | 是，限稳定 carrier | `ImageRuntimeConfigRef`、`ImageAdapterSlot`、`ImageAdapterAvailabilityMarker`、`ImageRuntimeAssemblyState`、`ImageFakeMode` | concrete adapter、store、backend配置字段和 product binding | Step 7、14 |
| `api` | 明确 defer | 无独立 entry object；只复用 `OperationMetadata` 与 contracts safe result carrier | route、public request/result、authorization和transport均未获 authority | Step 8、9 |
| `worker` | 仅必要 conditional marker | `InboundContractState`，只表达 `MI-UP-005` 目前不可验证 | envelope、topic、receipt、dedup persistence、consumer process 均未闭口 | Step 7~9 |
| `jobs` | 仅必要 action marker | `ImageJobActionKind`，只表达已列出的 bounded action 名称 | lease、cursor、schedule、run_id、report、evidence与执行事实均未闭口 | Step 7~9、11~16 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 0. 是否先建立骨架、批次与顺序？ | 是。§1 先固定 6.0~6.10 批次、模块顺序和 non-core 闭口决策；对象卡仅可在对应批次写入。 |
| 1. 是否需要 shared vocabulary？ | 需要。`contracts` 先闭合本仓 typed local ref、external body-free ref、metadata、reason/disposition、状态 enum 和 read marker；它不是对 Member Service 或 sibling 的公开 Rust contract。 |
| 2~4. 功能如何映射对象？ | 五 capability 仍是 domain truth 主轴；每个对象均回指 Step 5 的 capability、输入、状态/副作用和后续 port/flow，不让某个对象吸收相邻 owner truth。 |
| 5. 如何避免无人承接或对象过大？ | 33 个对象按五个 domain 文件组唯一归属；guard 只做 pure local validation，trace/read model只做解释或只读，coordinator不拥有 truth。 |
| 6. non-core 如何决定？ | application/infra 的稳定 carrier在本 Step 闭口；api 不造对象；worker/jobs 只保留必要 local marker，其他对象按正确的 port/protocol/flow Step 延后。 |
| 7~11. struct/enum/function/factory 如何可落码？ | 每张对象卡给出 Rust 契约片段、字段类型/来源、公开成员函数完整签名、factory 输入覆盖和不可由 factory 填补的来源；所有 ID 来自 application-owned future factory/port，不由 domain、repository、route或字符串自行生成。 |
| 12~13. 状态与 variant 如何处理？ | 所有当前状态枚举在 `contracts` 以唯一 Rust-facing 名称闭口，逐 variant 记录 Rustdoc、来源与去向；详细迁移矩阵仍留 Step 10。 |
| 14. 模块内停审怎样判断？ | 每个 capability 批次完成后审计功能承接、字段来源、合法状态、external boundary与禁止反向依赖。 |
| 15~16. 跨模块字段与状态如何闭环？ | §14 结束时统一审计 high-reuse metadata/ref/reason、五组 truth、read/projection、adapter/entry marker；任何未闭口 external field记录 owner/blocker。 |
| 17. 哪些明确留给 Step 7+？ | repository、resolver、builder、registry、evidence、Artifact、consumer、UoW、ID/clock、protocol DTO、flow、state matrix、config key、error mapping、tests 均逐项进入 Step 7 承接清单。 |

## 3. 当前材料诊断与改动前后

| 诊断项 | 若直接沿用 02 骨架的风险 | 本 Step 的处置 |
|---|---|---|
| 02 对象只有字段/函数轮廓 | 类型归属、factory 输入、状态载荷与不变量仍可能由实现者猜补 | 为每对象补齐 Rust-facing字段、来源、成员函数、factory、状态引用和禁止事项。 |
| 外部 ref 常以名称级出现 | implementation 可能用裸字符串、provider body或 fake private map 伪造 source | 统一为 named body-free external ref；所有 exact kind、owner、允许来源与 wrong-kind reject 写入 contracts catalog。 |
| `digest` 与 provenance 语义容易越界 | 可能把 adapter ACK、tag或猜测内容写成可验证 identity | 只闭合本仓 `VerifiedContentIdentityRef` / local binding 入口；它必须来自未来的 safe conclusion，当前不产生真实 digest或发布事实。 |
| HLD 状态为语义表 | 同义状态会在 domain、view、adapter和入口之间漂移 | 以唯一 contracts enum 作为 Rust-facing carrier；Step 10 仅补转换矩阵，不重命名。 |
| application/infra/entry 容易被整体后推 | Step 7~9 会临时发明 idempotency、availability或job carrier | 仅闭合稳定 carrier；缺协议 authority 的 api/worker/jobs对象显式 defer。 |

## 4. 本步设计取舍

### 4.1 共享类型取舍

| 方案 | 收益 | 风险 | 决定 |
|---|---|---|---|
| 用裸 `String` / JSON 保存所有 ref、reason、state | 写法短 | 不能验证 owner/kind，易把 external body、tag或 fake 语义偷渡进本仓 | 不采用。 |
| 为每个 sibling 私造完整 DTO | 表面“对接完整” | 违反 owner、并行窗口和 pending 纪律 | 不采用。 |
| 以本仓 typed local ref、named external body-free ref、safe disposition和 gap 建立最小 carrier | 可落码且保持 reopen point | 后续正式 contract 到位后需重审 adapter/protocol | 采用。 |

### 4.2 状态与恢复取舍

- truth object 的状态只能由同层对象成员函数改变；repository save、projection、adapter、fake 或 entry mapping 不得代替 transition。
- `unknown`、`blocked`、`gap`、`stale`、`unavailable` 均为可见安全状态，而不是可忽略的空值；恢复必须以新 snapshot、revision、attempt、evaluation、transition 或 gap context 发生。
- `accepted`、`buildable`、`eligible`、`available` 只在各自 local stage 成立，绝不推出 Artifact、Member Service、container、runtime 或整体 readiness。

### 4.3 factory 与来源取舍

- domain factory 接收已生成的 local ID、已验证的 typed ref、operation metadata或安全结论；它不读 I/O、不生成 external ref、不选择产品、不构造 live state。
- repository load 可以重建已持久化字段，但不能借此产生新的 ID、reason、timestamp或状态。
- 所有 `Option<T>` 都有明确语义：只允许在关联 external contract 尚未验证、当前状态不需要该字段或旧历史重建时为空；不得作为绕过 guard 的默认值。

## 5. 对象归属与反查总览

| 模块 | capability / 功能 | 本 Step 对象 | 文件主归属 | 后续主要承接 |
|---|---|---|---|---|
| `contracts` | shared vocabulary、metadata、safe read/disposition | typed ref、metadata、reason、state enum、read marker | `ids_refs.rs`、`metadata.rs`、`views.rs`、`errors.rs` | Step 7 port input/output；Step 8 protocol。 |
| `domain` | DefinitionAssembly | `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision`、`MappingSourceSnapshot`、`ComponentPinSet`、`SeedPlacementBinding`、`AssemblyCompletenessGuard`、`PinIntegrityGuard` | `definition.rs`、`assembly.rs`、`guards.rs` | mapping/component/seed/repository ports；definition flow/state。 |
| `domain` | BuildCandidate | `BuildIntent`、`BuildAttempt`��`BuildInputSnapshot`、`BuildOutcomeConclusion`、`CandidateImage`、`CandidateFormationGuard` | `build.rs`、`guards.rs` | builder/registry/repository ports；build flow/state。 |
| `domain` | Qualification | `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision`、`ArtifactHandoffRecord`、`ProvenanceCompletenessGuard`、`ApplicableGateGuard` | `qualification.rs`、`guards.rs` | evidence/Artifact/repository ports；qualification flow/state。 |
| `domain` | SupplyEntry | `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap`、`EntryPinGuard`、`AvailabilityTransitionGuard` | `supply.rs`、`guards.rs` | consumer/repository ports；supply flow/state。 |
| `domain` | ReferenceDerived | `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness`、`ImageTraceRecord`、`ImageDerivedReadModel`、`ReferenceValidityGuard`、`ProjectionReadOnlyGuard` | `reference.rs`、`guards.rs`、`history.rs` | projection/source/repository ports；refresh/rebuild/query flow。 |
| `application` | operation orchestration carrier | `ImageOperationContext`、`ImageUnitOfWorkBoundary`、`ImageIdempotencyRecord`、`StoredImageOperationResult`、five coordinator identity | `facade.rs`、`unit_of_work.rs`、`idempotency.rs`、`*_service.rs` | Step 7 port / UoW；Step 8/9 DTO/flow。 |
| `infra` | configuration/composition/adapter safety carrier | `ImageRuntimeConfigRef`、`ImageAdapterAvailabilityMarker`、`ImageRuntimeAssemblyState`、`ImageFakeMode` | `config.rs`、`runtime_builder.rs`、`fakes.rs` | Step 7 implementations；Step 14 config binding。 |
| `api` / `worker` / `jobs` | logical entry only | api defer；`InboundContractState`；`ImageJobActionKind` | planned entry files | Step 7~9 / later only。 |

## 6. `contracts` shared vocabulary 与状态契约

### 6.1 `contracts` 写入边界

`contracts` 只承载本 workspace 内可复用的 typed carrier。它可以被 domain/application/infra/entry 依赖，但不得依赖这些模块；也不得成为 `L2-member-service`、`L2-member`、Method Library、Runtime、Tools、Artifact、Sandbox或任何外部 provider 的 Rust public contract。

| 类型类别 | 正式归属 | 当前允许内容 | 明确禁止 |
|---|---|---|---|
| local ID / ref | `contracts::ids_refs` | 本仓 object identity、exact local kind、canonical display | 用 repository row id、route参数、timestamp或字符串前缀自行伪造 identity。 |
| external ref | `contracts::ids_refs` | owner、exact kind、opaque identity、optional opaque revision、安全验证来源 | external body、manifest、provider response、secret、raw log、Artifact/member truth。 |
| metadata | `contracts::metadata` | idempotency、correlation、causation、recorded-at、actor/source ref | authentication/authorization truth、live session、runtime checkpoint。 |
| reason / disposition | `contracts::errors` | 有限的本仓安全类别、body-free source/ref | raw error text、vendor error code、未闭口对端 error schema。 |
| state / view marker | `contracts::views` | local stage、freshness、conditional availability和gap marker | single global ready、consumer/container health、publisher/delivery state。 |

### 6.2 基础 Rust-facing carrier

```rust
/// 本仓内部使用的非空稳定文本；不得承载外部正文或未校验 JSON。
pub struct NonEmptyText(pub String);

/// 本仓对象的 opaque 主键；由 application 层经未来 ID port 生成。
pub struct ImageLocalId(pub NonEmptyText);

/// 可排序的 UTC 时刻载体；仅表达本仓记录时点。
pub struct UtcTimestamp {
    /// 自 Unix epoch 起的毫秒数。
    pub epoch_millis: i128,
}

/// 本仓持久化对象的乐观并发版本，不是外部 release 或 artifact version。
pub struct LocalObjectVersion(pub u64);

/// 本次操作的稳定幂等键；由入口 request 或已确认 consumer metadata 提供。
pub struct IdempotencyKey(pub NonEmptyText);

/// 用于串联本仓操作和 trace 的 opaque 关联标识。
pub struct CorrelationRef(pub NonEmptyText);

/// 指向前一条已知本仓操作或外部安全来源，不承载 payload。
pub struct CausationRef(pub NonEmptyText);

/// 外部 actor/source 的 body-free 身份引用；不表示认证或授权已通过。
pub struct ActorOrSourceRef(pub NonEmptyText);

/// 脱敏、结构化且可安全展示的本仓原因。
pub struct SafeReason {
    /// 有限原因类别。
    pub category: SafeReasonCategory,
    /// 可选的相关 local/external ref；不得填原始错误正文。
    pub related_ref: Option<OpaqueReference>,
}

/// 所有 Command、conditional inbound 和 Job 可复用的操作元数据。
pub struct OperationMetadata {
    /// 重放、冲突和去重的唯一语境。
    pub idempotency_key: IdempotencyKey,
    /// 本仓 trace 串联键。
    pub correlation_ref: CorrelationRef,
    /// 触发本次操作的 body-free actor 或 source 身份；不证明认证或授权。
    pub actor_or_source_ref: Option<ActorOrSourceRef>,
    /// 若本操作由已知事件、job 或 command 触发，则记录其安全引用。
    pub causation_ref: Option<CausationRef>,
    /// 入口记录本次操作的时点。
    pub recorded_at: UtcTimestamp,
}
```

| carrier | 作用 | 约束 / 来源 |
|---|---|---|
| `NonEmptyText` | 受限技术文本包装 | constructor 必须拒绝空/纯空白；仅用于 opaque ID、canonical label或已脱敏 reason。 |
| `ImageLocalId` | local truth ID 的统一底层形态 | future `IdGeneratorPort` 生成；domain/repository/api/worker/jobs不得自行 mint。 |
| `UtcTimestamp` | local record time | future `ClockPort` 或已验证 metadata 提供；不得假装 external execution completion time。 |
| `LocalObjectVersion` | future optimistic concurrency input | repository load/save闭合于 Step 7/11；不等同 image/tag/artifact revision。 |
| `IdempotencyKey` | 操作去重语境 | command/event/job入口提供或 future factory生成；不能由 payload/body/hash临时拼接。 |
| `CorrelationRef` / `CausationRef` | 可追溯串联 | 仅记录安全引用；不包含 event payload、trace body或 run id。 |
| `ActorOrSourceRef` | actor或integration source的最小身份语境 | 不证明 actor有授权，也不保存 profile、credential或session。 |
| `SafeReason` | fail-closed 解释 | 只能来自 domain guard、safe adapter conclusion或正式 resolution；禁止 raw provider message。 |
| `OperationMetadata` | 跨入口一致的最小元数据 | 每个写操作都必须有；`actor_or_source_ref` 只说明来源身份而非授权，具体 DTO字段/serialization留 Step 8。 |

#### `OperationMetadata` 的字段 / 创建闭口

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `idempotency_key` | `IdempotencyKey` | 将同一写操作限定在稳定的重放语境内 | command、条件入站事件或 bounded job 的 future validated metadata；query 不创建或消费写入 reservation。 |
| `correlation_ref` | `CorrelationRef` | 串联同一 local operation / trace 语境 | entry 经过基础校验后显式提供；不得由 domain、repository 或 external body 推导。 |
| `actor_or_source_ref` | `Option<ActorOrSourceRef>` | 表达已知 body-free actor/source | API 命令可有 actor ref；条件 event / job 可有 source ref；`None` 只能表示当前 protocol 尚未获得可安全保留的来源身份，不能绕过后续 authorization/authority 检查。 |
| `causation_ref` | `Option<CausationRef>` | 连接已知先行 command/event/job/ref | future protocol mapping 在可验证时提供；不存 event payload、job run ID 或 raw trace。 |
| `recorded_at` | `UtcTimestamp` | 记录本仓何时接受该 metadata | future `ClockPort` / validated input 提供；不是外部动作完成时刻。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn OperationMetadata::new(idempotency_key: IdempotencyKey, correlation_ref: CorrelationRef, actor_or_source_ref: Option<ActorOrSourceRef>, causation_ref: Option<CausationRef>, recorded_at: UtcTimestamp) -> Self` | 建立最小写操作 metadata | 已验证的 stable key、body-free refs 与 local recorded time | `OperationMetadata` | application 在 Step 8/9 protocol-to-operation 映射后调用；不验证 transport authority。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 写操作必须显式携带 metadata | application 的 command、条件入站和 job flow 不得用隐含 globals、payload hash 或随机文本代替幂等/关联语境；具体 reserve / replay 由 Step 7、13 闭合。 |
| 来源身份不等权限真相 | `ActorOrSourceRef` 不能充当 authorization、Member Service confirmation、runtime session、broker receipt 或 governance approval。 |
| query 不进入写入 metadata 语义 | read-only query 可携带将来独立 read metadata，但不得借 `OperationMetadata` 保留幂等记录或启动 mutation。 |

### 6.3 local / external ref、集合与安全结论

```rust
/// 本仓 local object 的封闭类别；禁止用字符串或 repository row id 代替。
pub enum LocalObjectKind {
    /// Image family local truth.
    ImageFamilyDefinition,
    /// Image variant local truth.
    ImageVariantDefinition,
    /// Immutable assembly baseline.
    AssemblyBaseline,
    /// Versioned variant revision.
    VariantRevision,
    /// Body-free local mapping source snapshot.
    MappingSourceSnapshot,
    /// Local build intent.
    BuildIntent,
    /// Local build attempt.
    BuildAttempt,
    /// Immutable build input snapshot.
    BuildInputSnapshot,
    /// Safe build outcome conclusion.
    BuildOutcomeConclusion,
    /// Local candidate image truth.
    CandidateImage,
    /// Local provenance binding.
    ProvenanceBinding,
    /// Local gate evaluation.
    GateEvaluation,
    /// Local eligibility decision.
    EligibilityDecision,
    /// Local Artifact handoff record.
    ArtifactHandoffRecord,
    /// Local availability transition history item.
    AvailabilityTransition,
    /// Local pinned supply entry.
    InstantiableEntry,
    /// Local Member Service handoff gap.
    ConsumerHandoffGap,
    /// Body-free external reference snapshot.
    ExternalReferenceSnapshot,
    /// Local cross-owner contract gap.
    ContractGap,
    /// Local projection freshness marker.
    ProjectionFreshness,
    /// Append-only local image trace record.
    ImageTraceRecord,
    /// Rebuildable image read model identity.
    ImageDerivedReadModel,
    /// Local operation replay record.
    ImageIdempotencyRecord,
    /// Stored local operation result identity.
    StoredImageOperationResult,
}

/// A typed reference to one local Member Images object.
pub struct LocalObjectRef {
    /// Expected object kind; every receiving field validates this exact value.
    pub object_kind: LocalObjectKind,
    /// Opaque local identity generated by the application layer.
    pub object_id: ImageLocalId,
}

/// External owner whose body remains outside this repository.
pub enum ExternalOwnerKind {
    /// Role and method-asset owner.
    MethodLibrary,
    /// Runtime component owner.
    Runtime,
    /// Tool component owner.
    Tools,
    /// Member component owner.
    Member,
    /// Supervisor component owner; its exact release contract remains pending.
    Supervisor,
    /// Policy/memory/workspace template authority; exact semantic ownership remains pending.
    SeedAuthority,
    /// Product-neutral build executor boundary owner.
    Builder,
    /// Product-neutral registry/output-reference boundary owner.
    Registry,
    /// Member Service consumer owner.
    MemberService,
    /// Artifact and lineage owner.
    Artifact,
    /// Governance/policy authority owner.
    Governance,
    /// Sandbox/base-image boundary owner.
    Sandbox,
    /// Conditional Core shared-contract owner.
    Core,
}

/// Exact body-free category expected for an external reference.
pub enum ExternalReferenceKind {
    /// Role-to-image-variant mapping source.
    RoleVariantMapping,
    /// Immutable component release.
    ComponentRelease,
    /// Static policy, memory, workspace, or role-extra seed template.
    SeedTemplate,
    /// Base image identity; a hardened base remains future-only until scope closes.
    BaseImage,
    /// Compatibility conclusion supplied by a component owner.
    CompatibilityConclusion,
    /// Controlled request handed to a builder boundary.
    BuildHandoff,
    /// External build execution identity.
    BuildExecution,
    /// Immutable build output or image identity.
    ImmutableImage,
    /// Safe evidence or gate conclusion identity.
    EvidenceConclusion,
    /// Formal Artifact consumable reference.
    ArtifactConsumable,
    /// Consumer contract identity owned by Member Service.
    ConsumerContract,
    /// Consumer-side confirmation identity, not container/runtime state.
    ConsumerConfirmation,
    /// Formal owner-side contract resolution.
    ContractResolution,
    /// Applicable gate authority identity.
    GateAuthority,
    /// Authority-owned applicable gate-set identity; the inventory body remains external.
    ApplicableGateSet,
    /// Verified content-identity reference supplied by a safe external conclusion.
    VerifiedContentIdentity,
}

/// An opaque external reference with an explicit owner and kind.
pub struct OpaqueReference {
    /// Owner that defines the referenced truth.
    pub owner: ExternalOwnerKind,
    /// Exact expected external reference kind.
    pub reference_kind: ExternalReferenceKind,
    /// Canonical opaque identity supplied by the owner; never a copied body.
    pub opaque_identity: NonEmptyText,
    /// Optional immutable revision supplied by the owner; mutable selectors are rejected by guards.
    pub revision: Option<NonEmptyText>,
}

/// A body-free binding between an immutable output and the safe conclusion that verified it.
pub struct VerifiedContentIdentityRef {
    /// Reference whose kind must be VerifiedContentIdentity.
    pub content_identity_ref: OpaqueReference,
    /// Safe conclusion or execution reference that verified this identity.
    pub verification_source_ref: OpaqueReference,
}

/// Ordered, deduplicated local refs with one required object kind.
pub struct OrderedLocalRefSet {
    /// Required kind for every entry.
    pub expected_kind: LocalObjectKind,
    /// Entries sorted by canonical local id and unique by local id.
    pub entries: Vec<LocalObjectRef>,
}

/// Ordered, deduplicated external refs with one required owner/kind pair.
pub struct OrderedExternalRefSet {
    /// Required owner for every entry.
    pub expected_owner: ExternalOwnerKind,
    /// Required kind for every entry.
    pub expected_kind: ExternalReferenceKind,
    /// Entries sorted by owner, kind, opaque identity, then revision.
    pub entries: Vec<OpaqueReference>,
}

/// Safe, body-free conclusion accepted from an approved external seam.
pub struct SafeReferenceConclusion {
    /// The source reference being characterized.
    pub source_ref: OpaqueReference,
    /// Conservative local disposition; it is never overall readiness.
    pub disposition: SafeDisposition,
    /// Optional redacted local explanation.
    pub reason: Option<SafeReason>,
}

/// Typed reference to an ImageFamilyDefinition local object.
pub struct ImageFamilyDefinitionRef(pub LocalObjectRef);
/// Typed reference to an ImageVariantDefinition local object.
pub struct ImageVariantDefinitionRef(pub LocalObjectRef);
/// Typed reference to an AssemblyBaseline local object.
pub struct AssemblyBaselineRef(pub LocalObjectRef);
/// Typed reference to a VariantRevision local object.
pub struct VariantRevisionRef(pub LocalObjectRef);
/// Typed reference to a MappingSourceSnapshot local object.
pub struct MappingSourceSnapshotRef(pub LocalObjectRef);
/// Typed reference to a BuildIntent local object.
pub struct BuildIntentRef(pub LocalObjectRef);
/// Typed reference to a BuildAttempt local object.
pub struct BuildAttemptRef(pub LocalObjectRef);
/// Typed reference to a BuildInputSnapshot local object.
pub struct BuildInputSnapshotRef(pub LocalObjectRef);
/// Typed reference to a BuildOutcomeConclusion local object.
pub struct BuildOutcomeConclusionRef(pub LocalObjectRef);
/// Typed reference to a CandidateImage local object.
pub struct CandidateImageRef(pub LocalObjectRef);
/// Typed reference to a ProvenanceBinding local object.
pub struct ProvenanceBindingRef(pub LocalObjectRef);
/// Typed reference to a GateEvaluation local object.
pub struct GateEvaluationRef(pub LocalObjectRef);
/// Typed reference to an EligibilityDecision local object.
pub struct EligibilityDecisionRef(pub LocalObjectRef);
/// Typed reference to an ArtifactHandoffRecord local object.
pub struct ArtifactHandoffRecordRef(pub LocalObjectRef);
/// Typed reference to an AvailabilityTransition local object.
pub struct AvailabilityTransitionRef(pub LocalObjectRef);
/// Typed reference to an InstantiableEntry local object.
pub struct InstantiableEntryRef(pub LocalObjectRef);
/// Typed reference to a ConsumerHandoffGap local object.
pub struct ConsumerHandoffGapRef(pub LocalObjectRef);
/// Typed reference to an ExternalReferenceSnapshot local object.
pub struct ExternalReferenceSnapshotRef(pub LocalObjectRef);
/// Typed reference to a ContractGap local object.
pub struct ContractGapRef(pub LocalObjectRef);
/// Typed reference to a ProjectionFreshness local object.
pub struct ProjectionFreshnessRef(pub LocalObjectRef);
/// Typed reference to an ImageTraceRecord local object.
pub struct ImageTraceRecordRef(pub LocalObjectRef);
/// Typed reference to an ImageDerivedReadModel local object.
pub struct ImageDerivedReadModelRef(pub LocalObjectRef);
/// Typed reference to an ImageIdempotencyRecord local object.
pub struct ImageIdempotencyRecordRef(pub LocalObjectRef);
/// Typed reference to a StoredImageOperationResult local object.
pub struct StoredImageOperationResultRef(pub LocalObjectRef);

/// Body-free Role-to-image-variant mapping reference owned by Method Library.
pub struct MappingSourceRef(pub OpaqueReference);
/// Body-free immutable component-release reference owned by Runtime, Tools, Member, or Supervisor.
pub struct ComponentReleaseRef(pub OpaqueReference);
/// Body-free static template reference for policy, memory, workspace, or role extras.
pub struct SeedTemplateRef(pub OpaqueReference);
/// Body-free immutable base-image reference.
pub struct BaseImageRef(pub OpaqueReference);
/// Body-free compatibility conclusion reference supplied by a component owner.
pub struct CompatibilityConclusionRef(pub OpaqueReference);
/// Body-free external build-handoff reference.
pub struct BuildHandoffRef(pub OpaqueReference);
/// Body-free external build-execution reference.
pub struct ExternalBuildExecutionRef(pub OpaqueReference);
/// Body-free immutable image reference; it must not use a mutable selector.
pub struct ImmutableImageRef(pub OpaqueReference);
/// Body-free evidence conclusion reference, not evidence body or gate policy.
pub struct EvidenceConclusionRef(pub OpaqueReference);
/// Body-free Artifact consumable reference owned by L1-artifact.
pub struct ArtifactConsumableRef(pub OpaqueReference);
/// Body-free Member Service consumer-contract reference.
pub struct ConsumerContractRef(pub OpaqueReference);
/// Body-free Member Service confirmation reference; not a container/runtime status.
pub struct ConsumerConfirmationRef(pub OpaqueReference);
/// Body-free formal owner-side contract-resolution reference.
pub struct ContractResolutionRef(pub OpaqueReference);
/// Body-free gate-authority reference.
pub struct GateAuthorityRef(pub OpaqueReference);
/// Body-free applicable-gate-set reference; no gate inventory is copied locally.
pub struct ApplicableGateSetRef(pub OpaqueReference);

/// The local decision lane that a gap is allowed to freeze.
pub enum DecisionLane {
    /// Definition identity or mapping lane.
    Definition,
    /// Assembly baseline lane.
    Assembly,
    /// Variant revision lane.
    Revision,
    /// Build intent lane.
    BuildIntent,
    /// Build attempt or outcome lane.
    BuildAttempt,
    /// Candidate formation lane.
    Candidate,
    /// Provenance, gate, or eligibility lane.
    Qualification,
    /// Artifact handoff lane.
    ArtifactHandoff,
    /// Local availability and entry lane.
    Supply,
    /// Member Service consumer-handoff lane.
    ConsumerHandoff,
    /// Read-only projection lane.
    Projection,
}

/// Dependency classification retained with each boundary gap.
pub enum DependencySeamKind {
    /// Conditional source-level shared contract dependency.
    Compile,
    /// Runtime consumption relationship without a source dependency.
    Runtime,
    /// Conditional inbound event relationship.
    Event,
    /// Body-free reference relationship.
    Ref,
    /// External adapter relationship.
    Adapter,
    /// Test-only fake seam.
    Fake,
}
```

| 类型 | 字段 / variant 约束 | 合法创建来源 | 禁止替代 |
|---|---|---|---|
| `LocalObjectRef` | `object_kind` 必须与接收字段规定的 `LocalObjectKind` 完全一致 | domain factory生成 local truth ref，或 repository load重建 | 裸 `ImageLocalId`、DB主键、URL参数、字符串 prefix。 |
| `OpaqueReference` | `(owner, reference_kind, opaque_identity, revision)` 是最小可验证形态；不得保存 body | approved adapter 的 safe output、已闭口 owner input或 repository load | raw payload、manifest body、provider SDK type、secret、runtime live state。 |
| `VerifiedContentIdentityRef` | `content_identity_ref.kind=VerifiedContentIdentity`；`verification_source_ref` 必须来自 approved safe conclusion | `BuildOutcomeConclusion` 的保守结论，且由未来 Step 7 adapter surface验证 | tag、`latest`、registry presence、猜测 hash、由本仓从正文计算的外部 identity。 |
| `OrderedLocalRefSet` | 同一 `expected_kind`、按 canonical ID升序、去重、可否为空由具体字段表声明 | domain factory / validated input | 混合 object kind、保留输入无序、用 Vec 语义掩盖重复。 |
| `OrderedExternalRefSet` | 同一 owner/kind、按 canonical reference排序、去重、body-free | safe resolver conclusion | 混入不同 owner/kind、raw body、mutable selector。 |
| `SafeReferenceConclusion` | `VerifiedUsable` 只表示该 ref 可用于指定 local guard；不代表 candidate/eligibility/availability/consumer成功 | approved adapter/owner safe result | 外部 ACK、HTTP 2xx、broker ACK、cache hit、fake私有状态。 |
| `DecisionLane` | 一个 gap 只冻结明确 lane；不全局冻结或误解为 global readiness | gap factory 的受影响 capability | 用一个 `ready=false` 代替分阶段 semantic。 |
| `DependencySeamKind` | 必须与 Step 5 seam 分类一致 | `ContractGap` / adapter availability 记录 | 将 runtime/ref/adapter消费关系写成 Cargo dependency。 |

#### 6.3.1 local/external ownership、typed-ref exact-kind 与 seam enum 逐 variant 审计

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `LocalObjectKind::ImageFamilyDefinition` | `Image family local truth.` | family typed-ref kind | corresponding domain factory / repository load | `ImageFamilyDefinitionRef` only。 |
| `LocalObjectKind::ImageVariantDefinition` | `Image variant local truth.` | variant typed-ref kind | corresponding domain factory / repository load | `ImageVariantDefinitionRef` only。 |
| `LocalObjectKind::AssemblyBaseline` | `Immutable assembly baseline.` | baseline typed-ref kind | corresponding domain factory / repository load | `AssemblyBaselineRef` only。 |
| `LocalObjectKind::VariantRevision` | `Versioned variant revision.` | revision typed-ref kind | corresponding domain factory / repository load | `VariantRevisionRef` only。 |
| `LocalObjectKind::MappingSourceSnapshot` | `Body-free local mapping source snapshot.` | mapping snapshot typed-ref kind | corresponding domain factory / repository load | `MappingSourceSnapshotRef` only。 |
| `LocalObjectKind::BuildIntent` | `Local build intent.` | build intent typed-ref kind | corresponding domain factory / repository load | `BuildIntentRef` only。 |
| `LocalObjectKind::BuildAttempt` | `Local build attempt.` | attempt typed-ref kind | corresponding domain factory / repository load | `BuildAttemptRef` only。 |
| `LocalObjectKind::BuildInputSnapshot` | `Immutable build input snapshot.` | snapshot typed-ref kind | corresponding domain factory / repository load | `BuildInputSnapshotRef` only。 |
| `LocalObjectKind::BuildOutcomeConclusion` | `Safe build outcome conclusion.` | outcome typed-ref kind | corresponding domain factory / repository load | `BuildOutcomeConclusionRef` only。 |
| `LocalObjectKind::CandidateImage` | `Local candidate image truth.` | candidate typed-ref kind | corresponding domain factory / repository load | `CandidateImageRef` only。 |
| `LocalObjectKind::ProvenanceBinding` | `Local provenance binding.` | provenance typed-ref kind | corresponding domain factory / repository load | `ProvenanceBindingRef` only。 |
| `LocalObjectKind::GateEvaluation` | `Local gate evaluation.` | gate evaluation typed-ref kind | corresponding domain factory / repository load | `GateEvaluationRef` only。 |
| `LocalObjectKind::EligibilityDecision` | `Local eligibility decision.` | eligibility typed-ref kind | corresponding domain factory / repository load | `EligibilityDecisionRef` only。 |
| `LocalObjectKind::ArtifactHandoffRecord` | `Local Artifact handoff record.` | local handoff typed-ref kind | corresponding domain factory / repository load | `ArtifactHandoffRecordRef` only。 |
| `LocalObjectKind::AvailabilityTransition` | `Local availability transition history item.` | history typed-ref kind | corresponding domain factory / repository load | `AvailabilityTransitionRef` only。 |
| `LocalObjectKind::InstantiableEntry` | `Local pinned supply entry.` | local entry typed-ref kind | corresponding domain factory / repository load | `InstantiableEntryRef` only。 |
| `LocalObjectKind::ConsumerHandoffGap` | `Local Member Service handoff gap.` | consumer gap typed-ref kind | corresponding domain factory / repository load | `ConsumerHandoffGapRef` only。 |
| `LocalObjectKind::ExternalReferenceSnapshot` | `Body-free external reference snapshot.` | local snapshot typed-ref kind | corresponding domain factory / repository load | `ExternalReferenceSnapshotRef` only。 |
| `LocalObjectKind::ContractGap` | `Local cross-owner contract gap.` | local gap typed-ref kind | corresponding domain factory / repository load | `ContractGapRef` only。 |
| `LocalObjectKind::ProjectionFreshness` | `Local projection freshness marker.` | freshness typed-ref kind | corresponding domain factory / repository load | `ProjectionFreshnessRef` only。 |
| `LocalObjectKind::ImageTraceRecord` | `Append-only local image trace record.` | trace typed-ref kind | corresponding domain factory / repository load | `ImageTraceRecordRef` only。 |
| `LocalObjectKind::ImageDerivedReadModel` | `Rebuildable image read model identity.` | derived-view typed-ref kind | corresponding domain factory / repository load | `ImageDerivedReadModelRef` only。 |
| `LocalObjectKind::ImageIdempotencyRecord` | `Local operation replay record.` | application replay typed-ref kind | application factory / repository load | `ImageIdempotencyRecordRef` only。 |
| `LocalObjectKind::StoredImageOperationResult` | `Stored local operation result identity.` | application result typed-ref kind | application factory / repository load | `StoredImageOperationResultRef` only。 |
| `ExternalOwnerKind::MethodLibrary` | `Role and method-asset owner.` | RoleDefinition / mapping owner boundary | approved ref / safe conclusion | `RoleVariantMapping` only; never copied body。 |
| `ExternalOwnerKind::Runtime` | `Runtime component owner.` | runtime release boundary | approved ref / safe conclusion | `ComponentRelease` only; no runtime loop truth。 |
| `ExternalOwnerKind::Tools` | `Tool component owner.` | tools release boundary | approved ref / safe conclusion | `ComponentRelease` only; no tool execution truth。 |
| `ExternalOwnerKind::Member` | `Member component owner.` | member release boundary | approved ref / safe conclusion | `ComponentRelease` only; no member truth。 |
| `ExternalOwnerKind::Supervisor` | `Supervisor component owner; its exact release contract remains pending.` | pending supervisor release boundary | only body-free pending ref if validated | `ComponentRelease` seam; no invented schema。 |
| `ExternalOwnerKind::SeedAuthority` | `Policy/memory/workspace template authority; exact semantic ownership remains pending.` | static seed owner boundary | approved ref / safe conclusion | `SeedTemplate` only; never live state。 |
| `ExternalOwnerKind::Builder` | `Product-neutral build executor boundary owner.` | build executor boundary | safe ref / conclusion | handoff/execution/image kinds only; no builder product truth。 |
| `ExternalOwnerKind::Registry` | `Product-neutral registry/output-reference boundary owner.` | output identity boundary | safe ref / conclusion | immutable image / verified identity only; no tag presence claim。 |
| `ExternalOwnerKind::MemberService` | `Member Service consumer owner.` | consumer contract boundary | safe ref / conclusion | consumer contract/confirmation only; no lifecycle truth。 |
| `ExternalOwnerKind::Artifact` | `Artifact and lineage owner.` | Artifact handoff boundary | formal artifact ref / resolution only when closed | no Artifact version/lineage body。 |
| `ExternalOwnerKind::Governance` | `Governance/policy authority owner.` | applicable gate authority boundary | safe authority/evidence ref | gate input only; no policy inventory。 |
| `ExternalOwnerKind::Sandbox` | `Sandbox/base-image boundary owner.` | base-image boundary | safe base ref | `BaseImage` only; no sandbox policy/backend。 |
| `ExternalOwnerKind::Core` | `Conditional Core shared-contract owner.` | conditional compile-contract boundary | only after MI-UP-004 formal closure | current no active Cargo dependency。 |
| `ExternalReferenceKind::RoleVariantMapping` | `Role-to-image-variant mapping source.` | mapping identity | `MethodLibrary` body-free ref | definition mapping input only。 |
| `ExternalReferenceKind::ComponentRelease` | `Immutable component release.` | component pin identity | Runtime/Tools/Member/Supervisor ref | assembly/build input only。 |
| `ExternalReferenceKind::SeedTemplate` | `Static policy, memory, workspace, or role-extra seed template.` | static seed identity | SeedAuthority ref | static placement only; never live state。 |
| `ExternalReferenceKind::BaseImage` | `Base image identity; a hardened base remains future-only until scope closes.` | base identity | Sandbox/approved owner ref | assembly input only; no backend policy。 |
| `ExternalReferenceKind::CompatibilityConclusion` | `Compatibility conclusion supplied by a component owner.` | safe compatibility evidence identity | component-owner safe conclusion | pin guard only。 |
| `ExternalReferenceKind::BuildHandoff` | `Controlled request handed to a builder boundary.` | handoff identity | future builder adapter | attempt handoff only; not accepted build。 |
| `ExternalReferenceKind::BuildExecution` | `External build execution identity.` | execution identity | future safe builder conclusion | provenance/outcome input only。 |
| `ExternalReferenceKind::ImmutableImage` | `Immutable build output or image identity.` | immutable image identity | Builder/Registry safe conclusion | candidate / entry guard input only。 |
| `ExternalReferenceKind::EvidenceConclusion` | `Safe evidence or gate conclusion identity.` | evidence conclusion identity | Governance/evidence safe seam | gate/provenance input only。 |
| `ExternalReferenceKind::ArtifactConsumable` | `Formal Artifact consumable reference.` | Artifact consumer ref identity | only formal Artifact handoff | handoff record only; current pending。 |
| `ExternalReferenceKind::ConsumerContract` | `Consumer contract identity owned by Member Service.` | consumer contract identity | only formal Member Service input | consumer gap / future validation。 |
| `ExternalReferenceKind::ConsumerConfirmation` | `Consumer-side confirmation identity, not container/runtime state.` | consumer confirmation identity | only formal Member Service input | consumer gap resolve; not health/readiness。 |
| `ExternalReferenceKind::ContractResolution` | `Formal owner-side contract resolution.` | cross-owner closure identity | owner formal resolution | `ContractGap` / handoff resolve only。 |
| `ExternalReferenceKind::GateAuthority` | `Applicable gate authority identity.` | gate authority identity | Governance safe boundary | gate guard input only。 |
| `ExternalReferenceKind::ApplicableGateSet` | `Authority-owned applicable gate-set identity; the inventory body remains external.` | gate-set identity | Governance safe boundary | evaluation context only; no copied inventory。 |
| `ExternalReferenceKind::VerifiedContentIdentity` | `Verified content-identity reference supplied by a safe external conclusion.` | verified content identity | approved safe conclusion | candidate/entry pin only; no locally computed digest。 |
| `DecisionLane::Definition` | `Definition identity or mapping lane.` | freezes definition-only positive work | `ContractGap` diagnosis | definition gap; no global ready state。 |
| `DecisionLane::Assembly` | `Assembly baseline lane.` | freezes assembly-only positive work | `ContractGap` diagnosis | assembly gap。 |
| `DecisionLane::Revision` | `Variant revision lane.` | freezes revision-only positive work | `ContractGap` diagnosis | revision gap。 |
| `DecisionLane::BuildIntent` | `Build intent lane.` | freezes intent creation | `ContractGap` diagnosis | build-intent gap。 |
| `DecisionLane::BuildAttempt` | `Build attempt or outcome lane.` | freezes attempt/outcome decision | `ContractGap` diagnosis | build recovery gap。 |
| `DecisionLane::Candidate` | `Candidate formation lane.` | freezes candidate formation | `ContractGap` diagnosis | candidate gap。 |
| `DecisionLane::Qualification` | `Provenance, gate, or eligibility lane.` | freezes qualification decision | `ContractGap` diagnosis | qualification gap。 |
| `DecisionLane::ArtifactHandoff` | `Artifact handoff lane.` | freezes Artifact handoff only | `ContractGap` diagnosis | Artifact gap; no Artifact truth。 |
| `DecisionLane::Supply` | `Local availability and entry lane.` | freezes local supply transition | `ContractGap` diagnosis | supply gap。 |
| `DecisionLane::ConsumerHandoff` | `Member Service consumer-handoff lane.` | freezes consumer handoff only | `ContractGap` diagnosis | consumer gap; not local entry rewrite。 |
| `DecisionLane::Projection` | `Read-only projection lane.` | freezes read rebuild/service condition | `ContractGap` diagnosis | read gap; not truth mutation。 |
| `DependencySeamKind::Compile` | `Conditional source-level shared contract dependency.` | future compile relation classification | only after formal shared-contract closure | current no active sibling Cargo dependency。 |
| `DependencySeamKind::Runtime` | `Runtime consumption relationship without a source dependency.` | runtime seam classification | Step 5 seam matrix | infra/runtime boundary; never Cargo by implication。 |
| `DependencySeamKind::Event` | `Conditional inbound event relationship.` | event seam classification | MI-UP-005 future contract | worker reopen point; no topic/envelope now。 |
| `DependencySeamKind::Ref` | `Body-free reference relationship.` | reference seam classification | typed `OpaqueReference` | resolver/guard input; no copied body。 |
| `DependencySeamKind::Adapter` | `External adapter relationship.` | adapter seam classification | infra slot / safe adapter conclusion | Step 7 adapter port; no SDK truth。 |
| `DependencySeamKind::Fake` | `Test-only fake seam.` | test seam classification | explicit `ImageFakeMode::TestOnly` | test composition only; never production truth。 |

### 6.4 reason、disposition 与用途 carrier

```rust
/// Safe category for a local rejection, gap, or degraded conclusion.
pub enum SafeReasonCategory {
    /// A required local or external reference is absent.
    Missing,
    /// A previously valid reference no longer supports a new decision.
    Stale,
    /// Two required identities or conclusions disagree.
    Conflict,
    /// An owner, adapter, or projection cannot currently be reached or verified.
    Unavailable,
    /// An external side effect or conclusion cannot be determined safely.
    Unknown,
    /// A local invariant or guard rejected the proposed operation.
    ValidationRejected,
    /// An external exact schema, authority, or confirmation is still pending.
    ContractPending,
    /// A requested transition is not legal from the current local state.
    InvalidTransition,
    /// A replay conflicts with an existing idempotent result.
    IdempotencyConflict,
}

/// Conservative disposition of a safe external or local guard conclusion.
pub enum SafeDisposition {
    /// The narrow reference/guard condition was verified for its declared use.
    VerifiedUsable,
    /// More safe input is required before a conclusion can be made.
    Pending,
    /// A local guard rejected the condition.
    Rejected,
    /// A required authority or input prevents the lane from advancing.
    Blocked,
    /// The result of an external operation is not safely knowable.
    Unknown,
    /// A source or local view is unavailable.
    Unavailable,
    /// An exact cross-owner contract is missing or unverifiable.
    Gap,
}

/// Static seed class that may be placed into an image build input.
pub enum StaticSeedKind {
    /// Policy template reference, without governance-policy body.
    PolicyTemplate,
    /// Memory template reference, never a live memory/checkpoint.
    MemoryTemplate,
    /// Workspace template reference, never a mounted live workspace.
    WorkspaceTemplate,
    /// Role-extra static template reference.
    RoleExtraTemplate,
}

/// Static target category for a permitted seed placement.
pub enum StaticPlacementKind {
    /// Image filesystem policy-template target.
    PolicyLayer,
    /// Image filesystem memory-template target.
    MemoryLayer,
    /// Image filesystem workspace-seed target.
    WorkspaceSeedLayer,
    /// Image filesystem role-extra target.
    RoleExtraLayer,
}

/// Build-intent origin accepted by this repository.
pub enum BuildTriggerKind {
    /// A local command explicitly requested a build intent.
    Command,
    /// The bounded nightly sweep selected a persisted buildable revision.
    NightlySweep,
    /// A conditionally verified inbound event was mapped after its contract closes.
    VerifiedInboundEvent,
}

/// Local availability-history action, not a deployment or consumer lifecycle action.
pub enum AvailabilityTransitionKind {
    /// Publish a newly eligible immutable entry.
    Publish,
    /// Replace a prior local entry with a new immutable entry.
    Replace,
    /// Point current supply back to an earlier still-valid immutable entry through a new transition.
    Rollback,
    /// Retire a local entry without deleting history.
    Retire,
}
```

| enum | Rustdoc 变体审计 | 允许来源 | 允许去向 |
|---|---|---|---|
| `SafeReasonCategory::Missing` | `A required local or external reference is absent.` | 表达明确缺少的 ref / 输入 | domain guard、safe adapter conclusion | `SafeReason` / gap / blocked branch；不写 provider body。 |
| `SafeReasonCategory::Stale` | `A previously valid reference no longer supports a new decision.` | 表达旧上下文不可继续正向使用 | snapshot / gap / guard | stale marker 或新 context；不得静默复活旧输入。 |
| `SafeReasonCategory::Conflict` | `Two required identities or conclusions disagree.` | 表达相互冲突的安全条件 | local guard / safe conclusion | conflict state / rejected branch；不得选择其中一项继续。 |
| `SafeReasonCategory::Unavailable` | `An owner, adapter, or projection cannot currently be reached or verified.` | 表达当前不可读/不可验证 | safe adapter / projection guard | unavailable / blocked surface；不得 fallback。 |
| `SafeReasonCategory::Unknown` | `An external side effect or conclusion cannot be determined safely.` | 表达结果不可判定 | reconciliation / safe adapter conclusion | unknown state / safe recovery context；不得正常重试或标成功。 |
| `SafeReasonCategory::ValidationRejected` | `A local invariant or guard rejected the proposed operation.` | 表达本仓不变量拒绝 | domain factory / guard | rejected / invalid transition error；不含 raw input。 |
| `SafeReasonCategory::ContractPending` | `An external exact schema, authority, or confirmation is still pending.` | 表达跨 owner 合同未闭口 | declared pending boundary | gap / reopen-required；不得转 positive result。 |
| `SafeReasonCategory::InvalidTransition` | `A requested transition is not legal from the current local state.` | 表达状态迁移非法 | domain/application transition assertion | `DomainError` / safe reject；不得强行改 state。 |
| `SafeReasonCategory::IdempotencyConflict` | `A replay conflicts with an existing idempotent result.` | 表达 key 被不同 stable input 复用 | `ImageIdempotencyRecord::mark_conflict` | application conflict surface；不得重跑 mutation。 |
| `DomainError::Validation(SafeReason)` | `A field, ref, set, or local invariant did not pass validation.` | 承载已脱敏的本地校验失败原因 | object factory / guard | caller safe error mapping；不含 raw input。 |
| `DomainError::WrongReferenceKind(SafeReason)` | `A local object ref or external ref did not have the expected exact kind/owner.` | 承载 exact-kind/owner 拒绝原因 | typed-ref receiving guard | caller safe error mapping；不得接受裸 ref。 |
| `DomainError::InvalidTransition(SafeReason)` | `A requested object transition is illegal from the current lifecycle state.` | 承载非法状态迁移原因 | domain/application transition assertion | caller safe error mapping；不得强行变更 state。 |
| `DomainError::Blocked(SafeReason)` | `A required local or external condition is missing, stale, conflicting, unavailable, or pending.` | 承载 lane fail-closed 原因 | guard / gap / safe conclusion | blocked surface / new context；不得 fallback。 |
| `DomainError::Conflict(SafeReason)` | `A deterministic set or association would contain a duplicate or inconsistent member.` | 承载 collection / association 冲突原因 | set factory / guard | caller safe error mapping；不得静默去重掩盖冲突。 |
| `SafeDisposition::VerifiedUsable` | `The narrow reference/guard condition was verified for its declared use.` | 窄范围 ref / guard 可用 | local guard / approved safe adapter | designated local guard only；不得直接设置 candidate/eligibility/availability。 |
| `SafeDisposition::Pending` | `More safe input is required before a conclusion can be made.` | 还需输入 | factory / guard / local reconciliation | pending context；不得当作 pass。 |
| `SafeDisposition::Rejected` | `A local guard rejected the condition.` | 条件被本仓规则拒绝 | local guard | rejected / invalid state；不得 fallback。 |
| `SafeDisposition::Blocked` | `A required authority or input prevents the lane from advancing.` | lane 被明确阻断 | gap / guard / safe adapter | blocked state / safe surface；只冻结受影响 lane。 |
| `SafeDisposition::Unknown` | `The result of an external operation is not safely knowable.` | side effect / conclusion 不可判定 | reconciliation / safe adapter | unknown state / recovery context；不得标 success。 |
| `SafeDisposition::Unavailable` | `A source or local view is unavailable.` | source / view 无法安全使用 | safe adapter / projection | unavailable surface；不得自动修复。 |
| `SafeDisposition::Gap` | `An exact cross-owner contract is missing or unverifiable.` | owner contract/ref/schema 缺口 | `ContractGap` / boundary validation | gap / reopen point；不得自造对端 DTO。 |
| `StaticSeedKind::PolicyTemplate` | `Policy template reference, without governance-policy body.` | policy 静态模板 | validated `SeedTemplateRef` | `SeedPlacementBinding`；不是 governance truth。 |
| `StaticSeedKind::MemoryTemplate` | `Memory template reference, never a live memory/checkpoint.` | memory 种子模板 | validated `SeedTemplateRef` | static image layer；不得变 live memory。 |
| `StaticSeedKind::WorkspaceTemplate` | `Workspace template reference, never a mounted live workspace.` | workspace 种子模板 | validated `SeedTemplateRef` | static image layer；不得 mount。 |
| `StaticSeedKind::RoleExtraTemplate` | `Role-extra static template reference.` | role extra 种子模板 | validated `SeedTemplateRef` | static image layer；不得含 runtime extras state。 |
| `StaticPlacementKind::PolicyLayer` | `Image filesystem policy-template target.` | policy 静态层目标 | `SeedPlacementBinding::bind` | assembly guard；不是 runtime mount。 |
| `StaticPlacementKind::MemoryLayer` | `Image filesystem memory-template target.` | memory 模板层目标 | `SeedPlacementBinding::bind` | assembly guard；不形成 checkpoint。 |
| `StaticPlacementKind::WorkspaceSeedLayer` | `Image filesystem workspace-seed target.` | workspace seed 静态层目标 | `SeedPlacementBinding::bind` | assembly guard；不形成 live workspace。 |
| `StaticPlacementKind::RoleExtraLayer` | `Image filesystem role-extra target.` | role extra 静态层目标 | `SeedPlacementBinding::bind` | assembly guard；不是 tool/runtime injection。 |
| `BuildTriggerKind::Command` | `A local command explicitly requested a build intent.` | 明确 command 请求 | future validated command mapping | `BuildIntent::request`；不是 build execution。 |
| `BuildTriggerKind::NightlySweep` | `The bounded nightly sweep selected a persisted buildable revision.` | maintenance 选择已持久化 revision | future bounded job mapping | `BuildIntent::request` 或 blocked；不是 scheduler run fact。 |
| `BuildTriggerKind::VerifiedInboundEvent` | `A conditionally verified inbound event was mapped after its contract closes.` | 未来已验证事件触发 | only after MI-UP-005 + Step 7/8 closure | `BuildIntent::request`; 当前不可构造。 |
| `AvailabilityTransitionKind::Publish` | `Publish a newly eligible immutable entry.` | 提议本仓新 entry 供给 | supply application flow | `AvailabilityTransition` guard / history；不代表 external publish。 |
| `AvailabilityTransitionKind::Replace` | `Replace a prior local entry with a new immutable entry.` | 提议新 entry 替换旧 entry | supply application flow | transition guard / history；不覆盖旧 history。 |
| `AvailabilityTransitionKind::Rollback` | `Point current supply back to an earlier still-valid immutable entry through a new transition.` | 以新 history 指向有效旧 entry | supply application flow | transition guard / history；不复活旧 transition。 |
| `AvailabilityTransitionKind::Retire` | `Retire a local entry without deleting history.` | 停止 local entry 供给且保留历史 | supply application flow | transition guard / entry retirement；不删对象。 |

### 6.5 状态 enum：DefinitionAssembly

```rust
/// Image family and variant definition lifecycle; it never represents build or supply success.
pub enum DefinitionLifecycle {
    /// A definition identity exists but required source or assembly context is not yet usable.
    Draft,
    /// Mapping, required pins, and static placement are usable for the declared definition scope.
    Resolved,
    /// A gap, stale source, conflict, or static/live violation blocks new positive definition work.
    Blocked,
    /// A newer definition or revision superseded this historical context.
    Superseded,
}

/// Immutable assembly baseline completeness for one captured input context.
pub enum BaselineCompleteness {
    /// Required pin, placement, base, or source validity is missing.
    Incomplete,
    /// All currently required static immutable inputs are present and mutually consistent.
    Complete,
    /// Required inputs disagree or violate a pin/static boundary.
    Conflict,
    /// A later baseline superseded this historical baseline.
    Superseded,
}

/// Variant revision lifecycle used only before and during build-intent eligibility.
pub enum VariantRevisionLifecycle {
    /// A revision was proposed and still needs completeness/pin validation.
    Proposed,
    /// The revision passed local assembly guards and may request a build intent.
    Buildable,
    /// The proposed revision cannot enter a build lane because its inputs are invalid.
    Invalid,
    /// A newer revision superseded this historical revision.
    Superseded,
}
```

| enum / 变体 | Rustdoc 注释 | 允许来源 | 允许去向 |
|---|---|---|---|
| `DefinitionLifecycle::Draft` | `A definition identity exists but required source or assembly context is not yet usable.` | `ImageFamilyDefinition::create`、`ImageVariantDefinition::define` | `Resolved`、`Blocked`、`Superseded`。 |
| `DefinitionLifecycle::Resolved` | `Mapping, required pins, and static placement are usable for the declared definition scope.` | definition/baseline guard 的 `VerifiedUsable` 结果 | 可产生 baseline / revision；后续可转 `Blocked` / `Superseded`。 |
| `DefinitionLifecycle::Blocked` | `A gap, stale source, conflict, or static/live violation blocks new positive definition work.` | `mark_blocked` 或 fresh gap | 只能由新 definition context恢复；不直接转 `Resolved`。 |
| `DefinitionLifecycle::Superseded` | `A newer definition or revision superseded this historical context.` | `supersede` | 终态历史；不得新建 build intent。 |
| `BaselineCompleteness::Incomplete` | `Required pin, placement, base, or source validity is missing.` | `AssemblyBaseline::capture`或重新评估 | `Complete` / `Conflict`仅在新 baseline context；不得形成 buildable revision。 |
| `BaselineCompleteness::Complete` | `All currently required static immutable inputs are present and mutually consistent.` | `AssemblyCompletenessGuard::check_baseline` | 可支持 revision validation；可被新发现 gap标记为 `Conflict` 或被 supersede。 |
| `BaselineCompleteness::Conflict` | `Required inputs disagree or violate a pin/static boundary.` | assembly/pin guard | 仅新 baseline context可恢复；不 fallback。 |
| `BaselineCompleteness::Superseded` | `A later baseline superseded this historical baseline.` | `AssemblyBaseline::supersede` | 终态历史。 |
| `VariantRevisionLifecycle::Proposed` | `A revision was proposed and still needs completeness/pin validation.` | `VariantRevision::propose` | `Buildable` / `Invalid` / `Superseded`。 |
| `VariantRevisionLifecycle::Buildable` | `The revision passed local assembly guards and may request a build intent.` | `VariantRevision::validate` | `BuildIntent::request`；不是 build/candidate/eligibility成功。 |
| `VariantRevisionLifecycle::Invalid` | `The proposed revision cannot enter a build lane because its inputs are invalid.` | guard reject | 新 revision可替代；不得转 buildable。 |
| `VariantRevisionLifecycle::Superseded` | `A newer revision superseded this historical revision.` | `VariantRevision::supersede` | 终态历史。 |

### 6.6 状态 enum：BuildCandidate

```rust
/// Local build-intent lifecycle; acceptance is not an external build result.
pub enum BuildIntentLifecycle {
    /// Local revision and trigger passed the intent guard.
    Accepted,
    /// The intent waits for a required verified source or contract.
    Pending,
    /// A missing, stale, conflicting, or unavailable seam blocks the intent lane.
    Blocked,
    /// The intent ended before an external side effect was recorded.
    Cancelled,
}

/// Completeness of the immutable input snapshot required before an attempt can be handed off.
pub enum BuildSnapshotLifecycle {
    /// All required static inputs and their identities are immutable and mutually consistent.
    Complete,
    /// One or more required static inputs are absent.
    Incomplete,
    /// The snapshot conflicts with revision, baseline, or source identity.
    Invalid,
}

/// Local observation lifecycle of one external build attempt.
pub enum BuildAttemptLifecycle {
    /// The local attempt exists but has not yet been handed off.
    Created,
    /// A controlled handoff was recorded; external acceptance is not yet known.
    HandoffPending,
    /// An external side effect may have occurred but outcome is not yet known.
    OutcomePending,
    /// A safe external outcome was verified; candidate formation still remains.
    Succeeded,
    /// A safe external failure conclusion was recorded.
    Failed,
    /// External side effect, commit, or outcome cannot safely be determined.
    Unknown,
}

/// Candidate formation conclusion; it remains independent from eligibility and availability.
pub enum CandidateLifecycle {
    /// Attempt, snapshot, outcome, and immutable output identity passed the formation guard.
    Formed,
    /// Output or outcome did not satisfy the candidate formation guard.
    Rejected,
    /// A contract/source gap prevents candidate formation from being decided.
    Blocked,
    /// Candidate identity or external outcome cannot safely be determined.
    Unknown,
}

/// Conservative result class supplied by a build/registry adapter.
pub enum BuildResultKind {
    /// A safe conclusion indicates success, but does not itself create a candidate.
    Succeeded,
    /// A safe conclusion indicates a terminal failed attempt.
    Failed,
    /// The adapter cannot determine the external outcome.
    Unknown,
    /// The adapter or required source is currently unavailable.
    Unavailable,
}

```

| enum / 变体 | Rustdoc 注释 | 允许来源 | 允许去向 |
|---|---|---|---|
| `BuildIntentLifecycle::Accepted` | `Local revision and trigger passed the intent guard.` | `BuildIntent::request` / `accept` | 可捕获 snapshot / 建 attempt；不等 external execution。 |
| `BuildIntentLifecycle::Pending` | `The intent waits for a required verified source or contract.` | `BuildIntent` factory / pending transition | 新 intent context或等待安全输入；不能生 candidate。 |
| `BuildIntentLifecycle::Blocked` | `A missing, stale, conflicting, or unavailable seam blocks the intent lane.` | gap / guard / safe adapter conclusion | only fresh context after resolution；不得 fallback。 |
| `BuildIntentLifecycle::Cancelled` | `The intent ended before an external side effect was recorded.` | `BuildIntent` cancellation transition | history only / new intent context；不得产生 candidate。 |
| `BuildSnapshotLifecycle::Complete` | `All required static inputs and their identities are immutable and mutually consistent.` | `BuildInputSnapshot::capture` + guard | `BuildAttempt::start`。 |
| `BuildSnapshotLifecycle::Incomplete` | `One or more required static inputs are absent.` | snapshot guard / capture | 不得 handoff；新 snapshot/intent 承接。 |
| `BuildSnapshotLifecycle::Invalid` | `The snapshot conflicts with revision, baseline, or source identity.` | snapshot guard | 不得 handoff；必须新 context，不得原地修补。 |
| `BuildAttemptLifecycle::Created` | `The local attempt exists but has not yet been handed off.` | `BuildAttempt::start` | `HandoffPending`、`Failed`、`Unknown`。 |
| `BuildAttemptLifecycle::HandoffPending` | `A controlled handoff was recorded; external acceptance is not yet known.` | `BuildAttempt::record_handoff` | `OutcomePending` / `Failed` / `Unknown`；ACK不是成功。 |
| `BuildAttemptLifecycle::OutcomePending` | `An external side effect may have occurred but outcome is not yet known.` | safe handoff conclusion | `Succeeded` / `Failed` / `Unknown`。 |
| `BuildAttemptLifecycle::Succeeded` | `A safe external outcome was verified; candidate formation still remains.` | `record_outcome(Succeeded)` | candidate guard；不得直接 eligibility。 |
| `BuildAttemptLifecycle::Failed` | `A safe external failure conclusion was recorded.` | `record_outcome(Failed)` | 历史读取 / 新 attempt context。 |
| `BuildAttemptLifecycle::Unknown` | `External side effect, commit, or outcome cannot safely be determined.` | unknown safe conclusion、timeout/reconciliation | 等 resolution或新 recovery context；不得普通 retry/success。 |
| `CandidateLifecycle::Formed` | `Attempt, snapshot, outcome, and immutable output identity passed the formation guard.` | `CandidateFormationGuard::check` + `CandidateImage::form` | 仅作为 Qualification 输入；不表示 eligibility、Artifact、supply 或 consumer success。 |
| `CandidateLifecycle::Rejected` | `Output or outcome did not satisfy the candidate formation guard.` | candidate guard / negative local context | 历史读取或新 attempt/candidate context；不得进入 eligibility。 |
| `CandidateLifecycle::Blocked` | `A contract/source gap prevents candidate formation from being decided.` | `ContractGap` / safe blocked conclusion | 等待 owner resolution 后的新 context；不得用 availability/ACK 解除。 |
| `CandidateLifecycle::Unknown` | `Candidate identity or external outcome cannot safely be determined.` | unknown safe conclusion / reconciliation | 等 safe resolution 或新 context；不得形成 candidate/eligibility。 |
| `BuildResultKind::Succeeded` | `A safe conclusion indicates success, but does not itself create a candidate.` | approved future build/registry adapter safe conclusion | `BuildOutcomeConclusion`，随后仍需 candidate guard。 |
| `BuildResultKind::Failed` | `A safe conclusion indicates a terminal failed attempt.` | approved future build/registry adapter safe conclusion | `BuildOutcomeConclusion` / failed attempt history；不得建candidate。 |
| `BuildResultKind::Unknown` | `The adapter cannot determine the external outcome.` | safe adapter unknown conclusion / reconciliation | `BuildOutcomeConclusion` / attempt unknown；不得正常 retry 或 success。 |
| `BuildResultKind::Unavailable` | `The adapter or required source is currently unavailable.` | body-free adapter availability conclusion | `BuildOutcomeConclusion` / blocked or unknown path；不得由 fake private state 捏造。 |

### 6.7 状态 enum：Qualification、SupplyEntry、ReferenceDerived 与 entry marker

```rust
/// Provenance completeness for one candidate binding.
pub enum ProvenanceLifecycle {
    /// Input, execution, output, and required source links are verifiable.
    Complete,
    /// A required provenance link is missing.
    Incomplete,
    /// Required provenance links disagree.
    Conflict,
}

/// Local evaluation state for authority-driven applicable gates.
pub enum GateEvaluationLifecycle {
    /// Applicable gate conclusions are still being collected.
    Pending,
    /// Every currently applicable gate has a safe positive conclusion.
    Passed,
    /// At least one applicable gate has a safe negative conclusion.
    Failed,
    /// Gate authority or required evidence cannot be determined.
    Blocked,
    /// An external gate outcome cannot safely be determined.
    Unknown,
}

/// Local image eligibility lifecycle; it is not Artifact or consumer acceptance.
pub enum EligibilityLifecycle {
    /// Provenance or gate input is not yet complete.
    Pending,
    /// Image-domain provenance and applicable gates permit supply evaluation.
    Eligible,
    /// Image-domain prerequisites were conclusively not satisfied.
    Ineligible,
    /// A required authority, contract, or safe conclusion is missing.
    Blocked,
}

/// Conditional Artifact handoff state recorded by this repository.
pub enum ArtifactHandoffLifecycle {
    /// The local handoff context is open and has no safe owner conclusion yet.
    Pending,
    /// Exact Artifact schema, ref condition, or owner conclusion is unavailable.
    Gap,
    /// An owner-side accepted handoff was verified after its formal contract closed.
    Accepted,
}

/// Local availability transition lifecycle.
pub enum AvailabilityTransitionLifecycle {
    /// A local availability change was proposed and awaits guards.
    Proposed,
    /// A local availability history entry was committed.
    Committed,
    /// The proposed local transition did not pass its guard.
    Rejected,
    /// A later transition superseded this historical transition context.
    Superseded,
}

/// Local supply entry lifecycle; it does not describe container, session, or consumer health.
pub enum InstantiableEntryLifecycle {
    /// No verified immutable entry is currently supplied for this variant context.
    Unavailable,
    /// A local immutable pinned entry is available for the declared image-domain scope.
    Available,
    /// A newer entry superseded this historical entry.
    Superseded,
    /// The entry was explicitly retired while retaining history.
    Retired,
}

/// Member Service handoff gap lifecycle.
pub enum ConsumerHandoffGapLifecycle {
    /// An exact consumer contract, ref verification, or confirmation is missing.
    Open,
    /// A formal consumer contract and safe confirmation resolved this gap.
    Resolved,
    /// The prior gap context no longer applies to a new handoff judgment.
    Stale,
}

/// Cross-owner contract gap lifecycle.
pub enum ContractGapLifecycle {
    /// A gap was recorded and awaits owner-controlled resolution.
    Open,
    /// The affected positive lane is explicitly frozen.
    Blocked,
    /// A formal resolution reference verified the gap closure.
    Resolved,
    /// The historical gap context expired and requires a fresh judgment.
    Expired,
}

/// Validity of a body-free external snapshot for a declared local use.
pub enum ReferenceValidity {
    /// The snapshot is usable only for its declared local guard/use context.
    Valid,
    /// The snapshot explains history but cannot support a new positive decision.
    Stale,
    /// Owner, identity, revision, or conclusion conflicts were found.
    Conflict,
    /// The source cannot currently be read or verified.
    Unavailable,
}

/// Freshness of a read-only, rebuildable projection.
pub enum ProjectionFreshnessLifecycle {
    /// The read model has caught up to its declared committed-truth watermark.
    Fresh,
    /// The read model may be read but its watermark is behind committed truth.
    Stale,
    /// The read model is being rebuilt from committed truth.
    Rebuilding,
    /// The read model cannot currently be served.
    Unavailable,
}

/// Conditional inbound contract state, not an event envelope or broker receipt.
pub enum InboundContractState {
    /// No formal inbound event authority/schema is currently usable.
    Unavailable,
    /// An input was rejected because owner, identity, version, or schema was not verified.
    Rejected,
    /// A future formal contract may reopen this entry after its authority is verified.
    ReopenRequired,
}

/// Bounded local action identity for jobs; it is not a scheduler or execution report.
pub enum ImageJobActionKind {
    /// Select persisted buildable revisions and request build intents.
    NightlyBuildSweep,
    /// Reconcile persisted build attempts against safe external conclusions.
    ReconcileBuildAttempts,
    /// Reevaluate persisted pending qualification contexts.
    ReevaluatePendingQualifications,
    /// Refresh body-free external reference snapshots.
    RefreshExternalReferenceSnapshots,
    /// Rebuild read-only image-derived views from committed truth.
    RebuildImageDerivedViews,
    /// Reconcile local Artifact and consumer handoff gaps.
    ReconcileArtifactAndConsumerHandoffs,
}

```

#### 6.7.1 Qualification、SupplyEntry、ReferenceDerived 与 entry enum 逐 variant 审计

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ProvenanceLifecycle::Complete` | `Input, execution, output, and required source links are verifiable.` | 候选的来源链完整 | `ProvenanceCompletenessGuard` | gate / eligibility input；不等 Artifact / entry / consumer success。 |
| `ProvenanceLifecycle::Incomplete` | `A required provenance link is missing.` | 来源链缺 link | provenance factory / guard | pending / blocked qualification context；不得 gate pass。 |
| `ProvenanceLifecycle::Conflict` | `Required provenance links disagree.` | 来源链冲突 | provenance guard | conflict surface / new context；不得继续 eligibility。 |
| `GateEvaluationLifecycle::Pending` | `Applicable gate conclusions are still being collected.` | gate 集尚未闭合 | `GateEvaluation::open` / conclusion intake | collect / close；不得视为 pass。 |
| `GateEvaluationLifecycle::Passed` | `Every currently applicable gate has a safe positive conclusion.` | 适用 gate 的安全正向结论齐备 | `ApplicableGateGuard` after formal authority input | eligibility input；不等 Artifact / supply。 |
| `GateEvaluationLifecycle::Failed` | `At least one applicable gate has a safe negative conclusion.` | 至少一个适用 gate 否定 | `ApplicableGateGuard` | ineligible path / history；不得 fallback。 |
| `GateEvaluationLifecycle::Blocked` | `Gate authority or required evidence cannot be determined.` | authority / evidence 不可确认 | safe gap / guard | blocked qualification lane；不得自造 inventory。 |
| `GateEvaluationLifecycle::Unknown` | `An external gate outcome cannot safely be determined.` | outcome 不可判定 | safe adapter / reconciliation | unknown recovery context；不得 mark passed。 |
| `EligibilityLifecycle::Pending` | `Provenance or gate input is not yet complete.` | 资格输入尚未收齐 | `EligibilityDecision::open` / evaluate | await evaluation；不得 supply。 |
| `EligibilityLifecycle::Eligible` | `Image-domain provenance and applicable gates permit supply evaluation.` | 本仓资格满足 | `EligibilityDecision::evaluate` | `EntryPinGuard` input；不等 Artifact accepted / entry available。 |
| `EligibilityLifecycle::Ineligible` | `Image-domain prerequisites were conclusively not satisfied.` | 本仓资格被否定 | `EligibilityDecision::evaluate` | history / new qualification context；不得 supply。 |
| `EligibilityLifecycle::Blocked` | `A required authority, contract, or safe conclusion is missing.` | 正向资格被缺口冻结 | gap / evaluate | blocked lane；不得以 adapter available 解除。 |
| `ArtifactHandoffLifecycle::Pending` | `The local handoff context is open and has no safe owner conclusion yet.` | handoff 尚无 owner conclusion | `ArtifactHandoffRecord::open` | gap / conditional acceptance；当前不能声明 accepted。 |
| `ArtifactHandoffLifecycle::Gap` | `Exact Artifact schema, ref condition, or owner conclusion is unavailable.` | Artifact boundary未闭口 | `record_gap` | gap view / later reopen；不得 mint Artifact ref。 |
| `ArtifactHandoffLifecycle::Accepted` | `An owner-side accepted handoff was verified after its formal contract closed.` | 仅记录 owner-side verified acceptance | `bind_artifact_ref` with formal refs | local handoff history；当前 MI-UP-007 未闭口不可构造。 |
| `AvailabilityTransitionLifecycle::Proposed` | `A local availability change was proposed and awaits guards.` | local supply history 草案 | `AvailabilityTransition::propose` | committed / rejected / superseded。 |
| `AvailabilityTransitionLifecycle::Committed` | `A local availability history entry was committed.` | 本仓供给 history 已提交 | transition guard + future UoW | entry update / history query；不等 registry/container/consumer success。 |
| `AvailabilityTransitionLifecycle::Rejected` | `The proposed local transition did not pass its guard.` | transition guard 否定 | `AvailabilityTransition::reject` | history / new transition context；不得更改 existing entry。 |
| `AvailabilityTransitionLifecycle::Superseded` | `A later transition superseded this historical transition context.` | 旧 history 被新 context替代 | `AvailabilityTransition::supersede` | history only；不得删除。 |
| `InstantiableEntryLifecycle::Unavailable` | `No verified immutable entry is currently supplied for this variant context.` | 当前无本仓 local entry | entry factory / transition | later available / retired context；不表达 host state。 |
| `InstantiableEntryLifecycle::Available` | `A local immutable pinned entry is available for the declared image-domain scope.` | local supply 可供 consumer reference | entry factory / committed transition | consumer gap / query; 不等 launch / health / readiness。 |
| `InstantiableEntryLifecycle::Superseded` | `A newer entry superseded this historical entry.` | 历史 entry 被新 entry替代 | `InstantiableEntry::supersede` | history only；不得删 pin chain。 |
| `InstantiableEntryLifecycle::Retired` | `The entry was explicitly retired while retaining history.` | local entry 停供 | `InstantiableEntry::retire` | history/query；不得删除或影响 owner truth。 |
| `ConsumerHandoffGapLifecycle::Open` | `An exact consumer contract, ref verification, or confirmation is missing.` | consumer lane 缺口打开 | `ConsumerHandoffGap::open` | consumer gap / later stale or conditional resolve。 |
| `ConsumerHandoffGapLifecycle::Resolved` | `A formal consumer contract and safe confirmation resolved this gap.` | contract-specified handoff closure | future formal consumer validator | local gap history；MI-UP-001 未闭口当前不可构造，不等 launch/health。 |
| `ConsumerHandoffGapLifecycle::Stale` | `The prior gap context no longer applies to a new handoff judgment.` | 旧 gap 不再可用于新判断 | `mark_stale` | history / new gap context；不得静默 close。 |
| `ContractGapLifecycle::Open` | `A gap was recorded and awaits owner-controlled resolution.` | 跨 owner gap 已被记录 | `ContractGap::open` | blocked / resolved / expired。 |
| `ContractGapLifecycle::Blocked` | `The affected positive lane is explicitly frozen.` | 特定 lane 被冻结 | `ContractGap::block` | resolution / expiry；不得冻结无关 lane。 |
| `ContractGapLifecycle::Resolved` | `A formal resolution reference verified the gap closure.` | owner resolution 已被 body-free ref 支撑 | `ContractGap::resolve` | new local decision context；不得由 config/ACK/projection关闭。 |
| `ContractGapLifecycle::Expired` | `The historical gap context expired and requires a fresh judgment.` | 旧 gap 已过期 | `ContractGap::expire` | new gap / snapshot context；不得恢复为 open。 |
| `ReferenceValidity::Valid` | `The snapshot is usable only for its declared local guard/use context.` | snapshot 对指定用途可用 | `ExternalReferenceSnapshot::capture` / guard | declared guard only；不得跨 use 提升。 |
| `ReferenceValidity::Stale` | `The snapshot explains history but cannot support a new positive decision.` | old snapshot 仅保留解释性 | `invalidate` | history / fresh capture；不得正向使用。 |
| `ReferenceValidity::Conflict` | `Owner, identity, revision, or conclusion conflicts were found.` | snapshot 输入冲突 | `invalidate` / guard | safe gap / new capture；不得选择一方继续。 |
| `ReferenceValidity::Unavailable` | `The source cannot currently be read or verified.` | source当前不可读 | `invalidate` / adapter conclusion | unavailable / gap surface；不得 fallback。 |
| `ProjectionFreshnessLifecycle::Fresh` | `The read model has caught up to its declared committed-truth watermark.` | read model 与本地 committed truth watermark 对齐 | `ProjectionFreshness::mark_fresh` | query read；不等业务 ready。 |
| `ProjectionFreshnessLifecycle::Stale` | `The read model may be read but its watermark is behind committed truth.` | read model 落后 | `mark_stale` | degraded query / rebuild；不得 query 直接写修复。 |
| `ProjectionFreshnessLifecycle::Rebuilding` | `The read model is being rebuilt from committed truth.` | 正在按 committed truth 重建 | `begin_rebuild` | fresh / unavailable；不得从 projection 反推 truth。 |
| `ProjectionFreshnessLifecycle::Unavailable` | `The read model cannot currently be served.` | read surface不可用 | `mark_unavailable` | unavailable query surface；不得改 core truth。 |
| `InboundContractState::Unavailable` | `No formal inbound event authority/schema is currently usable.` | current inbound boundary 不可用 | `InboundContractMarker::unavailable` | worker safe rejection；不得写 BuildIntent。 |
| `InboundContractState::Rejected` | `An input was rejected because owner, identity, version, or schema was not verified.` | future input 的安全拒绝 | `InboundContractMarker::rejected` | local disposition / stored result shell；不得产生 receipt/candidate。 |
| `InboundContractState::ReopenRequired` | `A future formal contract may reopen this entry after its authority is verified.` | 明确重开点 | `InboundContractMarker::reopen_required` | Step 7~9 re-evaluation；非 accepted state。 |
| `ImageJobActionKind::NightlyBuildSweep` | `Select persisted buildable revisions and request build intents.` | 选择 buildable revision | future job/application flow | build intent request / safe blocked；不等 build success。 |
| `ImageJobActionKind::ReconcileBuildAttempts` | `Reconcile persisted build attempts against safe external conclusions.` | 对 existing attempts 保守 reconciliation | future job/application flow | outcome/gap/new context；不得盲重试 unknown。 |
| `ImageJobActionKind::ReevaluatePendingQualifications` | `Reevaluate persisted pending qualification contexts.` | 重新评估 pending qualification | future job/application flow | evaluation/decision/gap；不得默认 pass。 |
| `ImageJobActionKind::RefreshExternalReferenceSnapshots` | `Refresh body-free external reference snapshots.` | 刷新 snapshot | future job/reference flow | snapshot/gap/freshness；不反写 core truth。 |
| `ImageJobActionKind::RebuildImageDerivedViews` | `Rebuild read-only image-derived views from committed truth.` | 重建 read-only view | future job/projection flow | freshness marker；不修复 truth。 |
| `ImageJobActionKind::ReconcileArtifactAndConsumerHandoffs` | `Reconcile local Artifact and consumer handoff gaps.` | 重新检查 handoff gap | future job/application flow | gap/resolution context；当前不得伪 accept/confirm。 |

| 状态族 | 关键来源与允许去向 | 当前红线 |
|---|---|---|
| `ProvenanceLifecycle` | `ProvenanceCompletenessGuard` 仅从 candidate/snapshot/execution/output safe refs得到；`Complete` 才能参与 gate/eligibility | 不从 adapter availability、raw log或猜测 digest 得到 complete。 |
| `GateEvaluationLifecycle` | authority-driven safe conclusion；`Passed` 只能作为 eligibility input | Q-MI-004 未闭口时不构造 inventory或假设 passed。 |
| `EligibilityLifecycle` | `EligibilityDecision::evaluate`；`Eligible` 可进入 supply guard | 不等 Artifact accepted、entry available或consumer confirmation。 |
| `ArtifactHandoffLifecycle` | `ArtifactHandoffRecord` 的 local observation；`Accepted` 当前仅 conditional | MI-UP-007未关闭时只能 `Pending` / `Gap`，不制造 formal ref。 |
| `AvailabilityTransitionLifecycle` | supply guard决定；`Committed` 是本地 history | 不等 registry、container或Member Service success。 |
| `InstantiableEntryLifecycle` | entry factory/transition决定；`Available` 是本仓 local supply | 不表达 host/container/session/health/readiness。 |
| `ConsumerHandoffGapLifecycle` | consumer contract/ref安全验证；`Resolved` 当前仅 conditional | MI-UP-001未关闭时保持 `Open` / `Stale`，不伪确认。 |
| `ContractGapLifecycle` | owner-controlled resolution；`Resolved` 必须带 `ContractResolution` external ref | 不静默删除、不能用本仓配置、adapter ACK或projection关闭。 |
| `ReferenceValidity` | approved reference snapshot intake | stale/conflict/unavailable 不得成为正向 truth input。 |
| `ProjectionFreshnessLifecycle` | projection builder从 committed truth watermark产生 | fresh不表示业务 ready；projection不得写 core truth。 |
| `InboundContractState` | worker local validation或当前 absent authority | 不创建 event topic/envelope/receipt；arrival不写 intent。 |
| `ImageJobActionKind` | bounded local action选择 | 不创建 cron、lease、run_id、report、evidence或scheduler lifecycle。 |

### 6.8 `contracts` 模块 capability → 对象映射与停审

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| local object identity | application minted ID / repository load | typed local ref | 无 I/O；wrong-kind拒绝 | `ImageLocalId`、`LocalObjectKind`、`LocalObjectRef` | ID port / repository Step 7。 |
| external safe reference | owner-safe ref/conclusion | body-free external ref / safe conclusion | ref validation或gap | `OpaqueReference`、`SafeReferenceConclusion`、`VerifiedContentIdentityRef` | source/external port Step 7。 |
| operation metadata | command/job/future verified input | `OperationMetadata` | idempotency/correlation carrier | metadata types | protocol DTO Step 8，flow Step 9。 |
| safe failure surface | local guard / safe adapter conclusion | reason/disposition/gap marker | 不升级成功 | `SafeReason`、`SafeDisposition`、state enums | error model Step 12。 |
| read marker | committed truth / projection builder | freshness/gap/status carrier | read-only | projection/ref/gap enums | query protocol Step 8、read flow Step 9。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| IDs / local refs | 本仓 identity | newtype / typed ref | kind-bound construction、canonical comparison | 不生成 ID，不跨仓造 truth。 |
| external refs / sets | body-free owner binding | typed ref / deterministic set | owner/kind validation、sort/dedup | 不带 external body或假装 compiled dependency。 |
| metadata | operation correlation | value object | non-empty / metadata consistency | 不做 auth、runtime session或event receipt。 |
| safe disposition / reason | conservative branch explanation | enum / value object | fail-closed category | 不承载 vendor error / readiness。 |
| lifecycle enums | Rust-facing domain / entry state labels | enum | 唯一命名、variant boundary | 不定义状态转换 matrix或external lifecycle；application technical enum 归 `application`。 |

| 模块 | 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|---|
| `contracts` | owner、kind、body-free、state naming和metadata是否足够供后续对象引用 | `pass_after_6.1` | Step 8 仍须定义每个 DTO/schema，Step 7须定义 ID/clock/port surface；不会生成 outbound event carrier。 |

## 7. `domain` shared semantic helper 与错误契约

### 7.1 domain 写入边界

`domain` 仅依赖 §6 的 contracts carrier。所有 factory 都接收 application 层已经生成的 ID、metadata 与受控 ref；所有 transition 仅改变本仓所属对象的 state/reason/ref。它不得读取 repository、adapter、config、runtime、SDK、sibling crate、external body或live state。

```rust
/// Domain error categories sufficient for object factories and transitions.
///
/// Transport mapping, retry classification, and public error DTO remain deferred to Step 8 and Step 12.
pub enum DomainError {
    /// A field, ref, set, or local invariant did not pass validation.
    Validation(SafeReason),
    /// A local object ref or external ref did not have the expected exact kind/owner.
    WrongReferenceKind(SafeReason),
    /// A requested object transition is illegal from the current lifecycle state.
    InvalidTransition(SafeReason),
    /// A required local or external condition is missing, stale, conflicting, unavailable, or pending.
    Blocked(SafeReason),
    /// A deterministic set or association would contain a duplicate or inconsistent member.
    Conflict(SafeReason),
}

/// One required owner/kind pair for a local guard; it never embeds the owner body.
pub struct RequiredExternalReferenceRule {
    /// Expected owner of the referenced truth.
    pub owner: ExternalOwnerKind,
    /// Expected body-free reference kind.
    pub reference_kind: ExternalReferenceKind,
}

/// Ordered unique required external-reference rules for a declared local guard.
pub struct RequiredExternalReferenceRuleSet {
    /// Rules sorted by owner then kind and deduplicated by that pair.
    pub rules: Vec<RequiredExternalReferenceRule>,
}

/// A static seed kind/placement pair permitted by the current local assembly scope.
pub struct StaticSeedPlacementRule {
    /// Required template category.
    pub seed_kind: StaticSeedKind,
    /// Only allowed static placement category.
    pub placement_kind: StaticPlacementKind,
}

/// Ordered unique static seed rules; no live state can be made permitted by omission.
pub struct StaticSeedPlacementRuleSet {
    /// Rules sorted by seed kind then placement kind.
    pub rules: Vec<StaticSeedPlacementRule>,
}

/// Component slot inside one image assembly; each slot remains a ref-only input.
pub enum ComponentSlotKind {
    /// Runtime component pin.
    Runtime,
    /// Tools component pin.
    Tools,
    /// Member component pin.
    Member,
    /// Supervisor component pin.
    Supervisor,
    /// A role-specific extra component pin.
    RoleExtra,
}

/// One immutable component release pin and its safe compatibility context.
pub struct ComponentPin {
    /// Assembly slot occupied by this pin.
    pub slot: ComponentSlotKind,
    /// External release reference whose kind must be ComponentRelease.
    pub release_ref: OpaqueReference,
    /// Body-free conclusion about compatibility; it never contains a report body.
    pub compatibility: SafeReferenceConclusion,
}

/// Ordered unique component pins, deduplicated by slot plus immutable release identity.
pub struct ComponentPinList {
    /// Pins sorted by slot, owner, opaque identity, then revision.
    pub pins: Vec<ComponentPin>,
}

/// One input role inside an immutable build snapshot.
pub enum BuildInputRole {
    /// Variant revision that defines the build context.
    VariantRevision,
    /// Captured assembly baseline.
    AssemblyBaseline,
    /// Runtime component release.
    RuntimeComponent,
    /// Tools component release.
    ToolsComponent,
    /// Member component release.
    MemberComponent,
    /// Supervisor component release.
    SupervisorComponent,
    /// Role-extra component release.
    RoleExtraComponent,
    /// Static policy/memory/workspace/role-extra seed template.
    StaticSeed,
    /// Immutable base image reference.
    BaseImage,
    /// Body-free role-to-variant mapping source.
    MappingSource,
}

/// A single build input ref with its declared role; all values remain body-free.
pub struct BuildInputBinding {
    /// Semantic role of this input in the static build context.
    pub role: BuildInputRole,
    /// Local or external ref represented as a trace-safe source reference.
    pub source_ref: TraceSourceRef,
}

/// Deterministic build input bindings, sorted by role then canonical source ref.
pub struct BuildInputBindingSet {
    /// Entries are unique by role plus canonical source ref; empty is invalid for a complete snapshot.
    pub entries: Vec<BuildInputBinding>,
}

/// A local, deterministic description of a captured input set; it is not an external digest claim.
pub struct BuildInputIdentity {
    /// Canonical immutable bindings that define the snapshot identity.
    pub bindings: BuildInputBindingSet,
}

/// Append-only trace source can refer either to local truth or a body-free external reference.
pub enum TraceSourceRef {
    /// A typed local object reference.
    Local(LocalObjectRef),
    /// A body-free external owner reference.
    External(OpaqueReference),
}

/// Ordered, deduplicated trace inputs, sorted by source class and canonical ref.
pub struct TraceSourceRefSet {
    /// Entries must contain only declared local or body-free external refs.
    pub entries: Vec<TraceSourceRef>,
}

/// Current known availability facts consumed by the transition guard.
pub struct CurrentAvailabilityFacts {
    /// Current local entry, when any; expected kind is InstantiableEntry.
    pub current_entry_ref: Option<LocalObjectRef>,
    /// Latest committed transition, when any; expected kind is AvailabilityTransition.
    pub latest_transition_ref: Option<LocalObjectRef>,
    /// Whether an earlier entry is still immutable and eligible for a rollback transition.
    pub rollback_target_is_verified: bool,
}

/// Allowed local availability history actions for a declared supply scope.
pub struct AvailabilityTransitionRuleSet {
    /// Unique transition kinds allowed by the policy; all must be evaluated by the guard.
    pub allowed_kinds: Vec<AvailabilityTransitionKind>,
}

/// Identifies a projection family without defining a product catalog or manifest schema.
pub enum ProjectionKind {
    /// Safe definition and assembly summary projection.
    DefinitionSummary,
    /// Safe build trace projection.
    BuildTrace,
    /// Safe provenance and eligibility projection.
    QualificationSummary,
    /// Safe local supply-entry catalog projection.
    SupplyCatalog,
    /// Safe contract-gap projection.
    ContractGapSummary,
}

/// A watermark made only from committed local truth references and the observed record time.
pub struct TruthWatermark {
    /// Committed local objects represented by this watermark, sorted by kind then id.
    pub committed_subjects: Vec<LocalObjectRef>,
    /// Local time at which the builder observed the committed subject set.
    pub observed_at: UtcTimestamp,
}

/// One body-free stage summary exposed by a rebuildable read model.
pub struct SafeStageSummary {
    /// The distinct local decision lane summarized.
    pub lane: DecisionLane,
    /// Current safe disposition for that lane.
    pub disposition: SafeDisposition,
    /// Optional local truth subject that produced the summary.
    pub subject_ref: Option<LocalObjectRef>,
    /// Optional safe reason; no raw body or provider message is allowed.
    pub reason: Option<SafeReason>,
}

/// Ordered unique stage summaries, one maximum per decision lane.
pub struct SafeStageSummarySet {
    /// Entries sorted by DecisionLane and deduplicated by lane.
    pub entries: Vec<SafeStageSummary>,
}
```

| helper | 作用 | 不变量与来源 |
|---|---|---|
| `DomainError` | object factory/transition 的最小错误面 | 每个 payload都是 `SafeReason`；Step 12 才定义完整错误模型、retry与transport映射。 |
| required-rule sets | guard 的显式 required external owner/kind 集 | 排序、去重；规则由已收稳本仓 scope或正式 authority ref给出，不能以 config 放宽。 |
| `ComponentPin` / list | runtime/tools/member/supervisor/role-extra静态 release装配 | release必须为 immutable `ComponentRelease` ref；compatibility是safe conclusion，不是组件truth/report。 |
| build input helpers | snapshot 中每个 static input 的角色和可重建 identity | `BuildInputIdentity` 不是 external digest；仅 canonical ref set，缺/冲突时 snapshot不完整或无效。 |
| trace helpers | local/external ref-only causation | external source绝不含body；trace不写回truth。 |
| supply/availability helpers | guard验证已有 local facts和允许动作 | 仅本仓 local facts；不读取 consumer/container/registry health。 |
| projection helpers | 只读可重建view的水位与safe stage summary | watermarks来自 committed local truth；fresh不表示业务ready。 |

#### 7.1.1 Domain shared helper enum 逐 variant 审计

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ComponentSlotKind::Runtime` | `Runtime component pin.` | runtime 静态组件槽 | `ComponentPinSet::assemble` | `ComponentPin` / baseline only。 |
| `ComponentSlotKind::Tools` | `Tools component pin.` | tools 静态组件槽 | `ComponentPinSet::assemble` | `ComponentPin` / baseline only。 |
| `ComponentSlotKind::Member` | `Member component pin.` | member 静态组件槽 | `ComponentPinSet::assemble` | `ComponentPin` / baseline only; pending release remains visible。 |
| `ComponentSlotKind::Supervisor` | `Supervisor component pin.` | supervisor 静态组件槽 | `ComponentPinSet::assemble` | `ComponentPin` / baseline only; no invented contract。 |
| `ComponentSlotKind::RoleExtra` | `A role-specific extra component pin.` | role-extra静态组件槽 | `ComponentPinSet::assemble` | `ComponentPin` / baseline only。 |
| `BuildInputRole::VariantRevision` | `Variant revision that defines the build context.` | revision build input角色 | snapshot capture | immutable snapshot binding。 |
| `BuildInputRole::AssemblyBaseline` | `Captured assembly baseline.` | baseline build input角色 | snapshot capture | immutable snapshot binding。 |
| `BuildInputRole::RuntimeComponent` | `Runtime component release.` | runtime release input角色 | verified component pin | immutable snapshot binding。 |
| `BuildInputRole::ToolsComponent` | `Tools component release.` | tools release input角色 | verified component pin | immutable snapshot binding。 |
| `BuildInputRole::MemberComponent` | `Member component release.` | member release input角色 | verified component pin | immutable snapshot binding；pending cannot default。 |
| `BuildInputRole::SupervisorComponent` | `Supervisor component release.` | supervisor release input角色 | verified component pin | immutable snapshot binding；no schema invention。 |
| `BuildInputRole::RoleExtraComponent` | `Role-extra component release.` | role extra release input角色 | verified component pin | immutable snapshot binding。 |
| `BuildInputRole::StaticSeed` | `Static policy/memory/workspace/role-extra seed template.` | static seed input角色 | `SeedPlacementBinding` | immutable snapshot binding；never live state。 |
| `BuildInputRole::BaseImage` | `Immutable base image reference.` | base image input角色 | safe `BaseImageRef` | immutable snapshot binding。 |
| `BuildInputRole::MappingSource` | `Body-free role-to-variant mapping source.` | mapping source input角色 | `MappingSourceSnapshot` | immutable snapshot binding；not mapping body。 |
| `TraceSourceRef::Local(LocalObjectRef)` | `A typed local object reference.` | append trace中的本仓来源 | typed local object ref | `TraceSourceRefSet` / trace only；exact kind仍需验证。 |
| `TraceSourceRef::External(OpaqueReference)` | `A body-free external owner reference.` | append trace中的外部来源 | safe opaque ref | `TraceSourceRefSet` / trace only；不得携带 body。 |
| `ProjectionKind::DefinitionSummary` | `Safe definition and assembly summary projection.` | definition read projection类别 | projection builder | read-only freshness/read model。 |
| `ProjectionKind::BuildTrace` | `Safe build trace projection.` | build read projection类别 | projection builder | read-only freshness/read model。 |
| `ProjectionKind::QualificationSummary` | `Safe provenance and eligibility projection.` | qualification read projection类别 | projection builder | read-only freshness/read model。 |
| `ProjectionKind::SupplyCatalog` | `Safe local supply-entry catalog projection.` | supply read projection类别 | projection builder | read-only freshness/read model。 |
| `ProjectionKind::ContractGapSummary` | `Safe contract-gap projection.` | gap read projection类别 | projection builder | read-only freshness/read model。 |

### 7.2 shared helper 的工厂 / 函数闭口

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn NonEmptyText::parse(value: String) -> Result<NonEmptyText, DomainError>` | 建立非空文本 | `String value` | `Result<NonEmptyText, DomainError>` | 拒绝空/纯空白；不验证external owner。 |
| `pub fn LocalObjectRef::new(object_kind: LocalObjectKind, object_id: ImageLocalId) -> LocalObjectRef` | 构造 local typed ref | exact kind、application-generated id | `LocalObjectRef` | 纯函数；接收字段必须再验证 expected kind。 |
| `pub fn OpaqueReference::new(owner: ExternalOwnerKind, reference_kind: ExternalReferenceKind, opaque_identity: NonEmptyText, revision: Option<NonEmptyText>) -> Result<OpaqueReference, DomainError>` | 构造 body-free external ref | owner/kind/identity/revision | `Result<OpaqueReference, DomainError>` | 拒绝空 identity 和明确 mutable selector；不验证 owner body。 |
| `pub fn RequiredExternalReferenceRuleSet::new(rules: Vec<RequiredExternalReferenceRule>) -> Result<Self, DomainError>` | 验证 required rule set | rule list | `Result<Self, DomainError>` | 排序去重，拒绝空集与重复 owner/kind。 |
| `pub fn ComponentPinList::from_pins(pins: Vec<ComponentPin>) -> Result<Self, DomainError>` | 建立 deterministic pin list | pin list | `Result<Self, DomainError>` | slot/release must be unique; `release_ref.kind=ComponentRelease`。 |
| `pub fn BuildInputIdentity::from_bindings(bindings: BuildInputBindingSet) -> Result<Self, DomainError>` | 固化 canonical input identity | deterministic binding set | `Result<Self, DomainError>` | 只接受静态 local/external ref；不计算或声明 digest。 |
| `pub fn TruthWatermark::from_committed(subjects: Vec<LocalObjectRef>, observed_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立 truth watermark | local refs、time | `Result<Self, DomainError>` | 按 kind/id排序去重；不得含 projection/fake作为truth source。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| `TraceSourceRef` 不能带 body | external payload、log、report、manifest、seed正文、role正文和live state永远不进入 trace。 |
| external ref 不能被 domain mint | domain只验证传入 ref的结构/expected kind；owner actual resolution由 Step 7 adapter / resolver承接。 |
| ID 与 timestamp 不能由 domain推测 | factory仅接收 application传入值；任何缺失必须返回 `DomainError::Blocked` 或等待上层处理。 |
| helper state不代替业务state | `SafeDisposition`、watermark、config/adapter marker都不能改变 definition/build/qualification/supply truth。 |

## 8. `domain::definition` / `assembly` / `guards`：DefinitionAssembly 对象契约

### 8.1 模块 capability 与对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 登记 family / variant 本仓语义 | application-generated local ID、family ref/name、mapping safe snapshot | local definition ref | draft/resolved/blocked/superseded | Method Library mapping仅 ref | definition repo / mapping port、Define protocol/flow。 |
| 固化 assembly baseline | variant、mapping snapshot、runtime/tools/member/supervisor/extras pin、static seed、base ref | immutable baseline | incomplete/complete/conflict/superseded | component/seed/base外部truth仅 ref | reference/repository port、Capture flow。 |
| 提议并验证 revision | variant ref、baseline ref、derivation reason | revision | proposed/buildable/invalid/superseded | pure guard | repository/Propose flow。 |
| 验证静态完整性与 pin | baseline / pin / seed ref集合、现有 policy ref | safe local disposition | 不写 I/O；只决定本仓局部状态 | no owner body / no config bypass | Step 7 resolver / Step 9 flow。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ImageFamilyDefinition` | family identity 与 variant关联 | local aggregate | attach variant、维护active revision ref、supersede | 不拥有Role/mapping/component正文；不表达candidate/availability。 |
| `ImageVariantDefinition` | variant persona/assembly identity与mapping binding | local entity | bind mapping、block、link current revision | 不硬编码Role→variant；不读取live runtime/member state。 |
| `AssemblyBaseline` | 一次 immutable static assembly context | local immutable aggregate | capture、validate completeness、supersede | 不存seed/component semantic body或`latest`。 |
| `VariantRevision` | definition→baseline的可追溯revision | local aggregate/history anchor | propose、validate、supersede、can request build | 不包含build/candidate/eligibility状态。 |
| `MappingSourceSnapshot` | body-free mapping snapshot | local reference snapshot | capture、check usable、invalidate | 不复制RoleDefinition/mapping body。 |
| `ComponentPinSet` | 必需release pin集合 | immutable value object | validate complete、diff、reject mutable selector | 不定义release schema或compatibility report。 |
| `SeedPlacementBinding` | template ref→static placement | immutable value object | validate static、compare binding | 不保存live memory/checkpoint/credential。 |
| `AssemblyCompletenessGuard` | baseline structure验证 | pure guard | check baseline/seed | 不读取external body，不放宽required input。 |
| `PinIntegrityGuard` | release pin immutability验证 | pure guard | check pins | 不把source path/tag转immutable identity。 |

### 8.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `ImageFamilyDefinition` | family归属与revision pointer | ID、safe name、variant refs、active revision、lifecycle | `create` | attach/set active/block/supersede | `DefinitionLifecycle` | command intent、local refs、guard。 |
| `ImageVariantDefinition` | mapping-bound variant identity | ID、family ref、persona label、mapping snapshot、revision ref、lifecycle | `define` | bind/resolve/block/supersede | `DefinitionLifecycle` | command + safe mapping snapshot。 |
| `AssemblyBaseline` | immutable static assembly | ID、variant、mapping/pins/seeds/base、completeness/time | `capture` | verify/supersede | `BaselineCompleteness` | validated local/external refs + clock。 |
| `VariantRevision` | buildable decision前置 | ID、variant/baseline refs、derivation reason、state、supersedes/time | `propose` | validate/supersede/can request | `VariantRevisionLifecycle` | local refs、guard、clock。 |
| `MappingSourceSnapshot` | mapping source validity | ID、source ref、safe conclusion、validity/time | `capture` | usable/invalidate | `ReferenceValidity` | mapping adapter safe conclusion。 |
| `ComponentPinSet` | pin completeness / immutability | pins、required rule set | `assemble` | complete/diff/has mutable | none | component refs + safe compatibility conclusion。 |
| `SeedPlacementBinding` | template placement安全性 | template ref、kind、placement、validity | `bind` | static-safe/matches | `ReferenceValidity` | seed owner safe ref/conclusion。 |
| `AssemblyCompletenessGuard` | static assembly validation | required ref rules、seed rules | `from_rules` | check baseline/check seeds | `SafeDisposition` | current scope rules；不读config。 |
| `PinIntegrityGuard` | pin validation | required component slots | `from_required_slots` | check pins | `SafeDisposition` | current scope required slots；不猜owner contract。 |

#### 8.3 `ImageFamilyDefinition`

```rust
/// 本仓 image family 的 local truth，维护 variant 归属和当前 revision 指针；不拥有任何外部 Role 或 component 正文。
pub struct ImageFamilyDefinition {
    /// 由 application 层生成的 family 身份。
    pub family_id: ImageLocalId,
    /// 仅供本仓安全识别的 family 名称。
    pub family_name: NonEmptyText,
    /// 同属本 family 的 variant refs，按 canonical local ID 去重排序。
    pub variant_refs: OrderedLocalRefSet,
    /// 当前有效 revision；它不是 candidate、eligibility 或 supply 指针。
    pub active_revision_ref: Option<VariantRevisionRef>,
    /// family 的 definition 局部生命周期。
    pub lifecycle: DefinitionLifecycle,
    /// 当前 blocked 或 superseded 的安全原因。
    pub terminal_reason: Option<SafeReason>,
    /// 由新 family 语境替代时指向的后继 family ref。
    pub superseded_by: Option<ImageFamilyDefinitionRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `family_id` | `ImageLocalId` | family主键 | application ID factory生成；repository可重建。 |
| `family_name` | `NonEmptyText` | safe local name | command intent提供；不得含Role正文或外部schema。 |
| `variant_refs` | `OrderedLocalRefSet` | family下variant关联 | `expected_kind=ImageVariantDefinition`；由`attach_variant`加入。 |
| `active_revision_ref` | `Option<VariantRevisionRef>` | 当前revision pointer | 仅`set_active_revision`写入；resolved family可以为空直到有buildable revision。 |
| `lifecycle` | `DefinitionLifecycle` | definition状态 | `create`初始`Draft`。 |
| `terminal_reason` | `Option<SafeReason>` | blocked/superseded解释 | 仅`Blocked`或`Superseded`可有值。 |
| `superseded_by` | `Option<ImageFamilyDefinitionRef>` | 替代链 | 仅`Superseded`可有值，且不得等于self。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ImageFamilyDefinitionRef` | 得到 typed family ref | 无 | `ImageFamilyDefinitionRef` | 纯函数；kind必须为`ImageFamilyDefinition`。 |
| `pub fn attach_variant(&mut self, variant_ref: ImageVariantDefinitionRef) -> Result<(), DomainError>` | 关联本 family variant | typed variant ref | `Result<(), DomainError>` | 仅Draft/Resolved；去重；不读取variant body。 |
| `pub fn mark_resolved(&mut self) -> Result<(), DomainError>` | 标记local definition relation可用 | 无 | `Result<(), DomainError>` | Draft→Resolved；不得表示baseline/build/candidate成功。 |
| `pub fn set_active_revision(&mut self, revision_ref: VariantRevisionRef) -> Result<(), DomainError>` | 更新当前revision pointer | typed revision ref | `Result<(), DomainError>` | 仅Resolved；不验证revision body，Step 9由application/repository读取后协调。 |
| `pub fn mark_blocked(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 冻结新definition/revision lane | safe reason | `Result<(), DomainError>` | Draft/Resolved→Blocked；写terminal reason。 |
| `pub fn supersede(&mut self, replacement_ref: ImageFamilyDefinitionRef, reason: SafeReason) -> Result<(), DomainError>` | 追加family替代关系 | non-self replacement、reason | `Result<(), DomainError>` | 非Superseded→Superseded；不删除history。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(family_id: ImageLocalId, family_name: NonEmptyText) -> Result<Self, DomainError>` | 建立初始family | app-generated ID、safe name | `Result<ImageFamilyDefinition, DomainError>` | DefineImageVariant相关flow；初始Draft、空variant set。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| family不拥有外部truth | 只保存本仓local refs；RoleDefinition/mapping/component/seed正文均不可进入。 |
| active revision不是供给事实 | `active_revision_ref` 不得被解释为candidate、eligible、available、Artifact或consumer状态。 |
| 终态不复活 | Blocked/Superseded需要新family/revision语境，不得原地设回Resolved。 |

#### 8.4 `ImageVariantDefinition`

```rust
/// 一个 image variant 的本仓 identity 与 body-free mapping binding；维护定义边界而非运行时成员状态。
pub struct ImageVariantDefinition {
    /// 由 application 层生成的 variant 身份。
    pub variant_id: ImageLocalId,
    /// 所属本仓 family。
    pub family_ref: ImageFamilyDefinitionRef,
    /// 安全的 persona/variant 标签；不是 RoleDefinition 正文。
    pub persona_label: NonEmptyText,
    /// 当前 body-free Role-to-variant mapping snapshot。
    pub mapping_snapshot_ref: MappingSourceSnapshotRef,
    /// 当前本仓 revision pointer。
    pub current_revision_ref: Option<VariantRevisionRef>,
    /// definition 生命周期。
    pub lifecycle: DefinitionLifecycle,
    /// blocked/superseded语境的安全原因。
    pub terminal_reason: Option<SafeReason>,
    /// 新variant definition替代本语境时的ref。
    pub superseded_by: Option<ImageVariantDefinitionRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `variant_id` | `ImageLocalId` | variant主键 | application factory。 |
| `family_ref` | `ImageFamilyDefinitionRef` | family归属 | command已选本仓family；Step 9验证关联一致性。 |
| `persona_label` | `NonEmptyText` | 安全variant label | command intent；不能以此代替mapping owner truth。 |
| `mapping_snapshot_ref` | `MappingSourceSnapshotRef` | mapping validity入口 | `MappingSourceSnapshot::capture`所得local ref；不得放mapping body。 |
| `current_revision_ref` | `Option<VariantRevisionRef>` | revision pointer | 仅经link revision写入；未形成revision时为空。 |
| `lifecycle` | `DefinitionLifecycle` | 局部定义状态 | define初始Draft；guard驱动resolved/blocked。 |
| `terminal_reason` / `superseded_by` | `Option<SafeReason>` / `Option<ImageVariantDefinitionRef>` | 终态解释/替代链 | 与family同样的state条件；self replacement禁止。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ImageVariantDefinitionRef` | 得到typed variant ref | 无 | `ImageVariantDefinitionRef` | pure。 |
| `pub fn bind_mapping(&mut self, mapping_snapshot_ref: MappingSourceSnapshotRef) -> Result<(), DomainError>` | 更换到新local mapping snapshot context | typed snapshot ref | `Result<(), DomainError>` | Draft/Resolved；不读取mapping body。 |
| `pub fn mark_resolved(&mut self) -> Result<(), DomainError>` | 定义输入可供baseline判断 | 无 | `Result<(), DomainError>` | Draft→Resolved；不代表baseline complete。 |
| `pub fn link_revision(&mut self, revision_ref: VariantRevisionRef) -> Result<(), DomainError>` | 写当前revision pointer | typed revision ref | `Result<(), DomainError>` | 仅Resolved；实际cross-object consistency留flow。 |
| `pub fn mark_blocked(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 记录source/static-live gap | safe reason | `Result<(), DomainError>` | Draft/Resolved→Blocked；阻断新revision lane。 |
| `pub fn supersede(&mut self, replacement_ref: ImageVariantDefinitionRef, reason: SafeReason) -> Result<(), DomainError>` | 追加替代关系 | replacement/ref reason | `Result<(), DomainError>` | 不能原地替换identity或history。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn define(variant_id: ImageLocalId, family_ref: ImageFamilyDefinitionRef, persona_label: NonEmptyText, mapping_snapshot_ref: MappingSourceSnapshotRef) -> Result<Self, DomainError>` | 建立variant definition | app ID、family、safe label、local snapshot | `Result<ImageVariantDefinition, DomainError>` | DefineImageVariant；初始Draft。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| mapping永远外置 | snapshot ref只表达本仓观察，不能hardcode Role→variant映射或复制body。 |
| static/live分离 | 不读runtime loop、live memory、checkpoint、member session、tool execution或container state补齐definition。 |
| revision与后续阶段分离 | current revision不等candidate/eligibility/availability。 |

#### 8.5 `AssemblyBaseline`

```rust
/// 一次不可变的静态镜像装配语境；仅当必要 refs、pins 与静态 seed 可验证时才可成为完整 baseline。
pub struct AssemblyBaseline {
    /// 由 application 层生成的 baseline 身份。
    pub baseline_id: ImageLocalId,
    /// 本 baseline 所属 variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 形成此baseline时使用的mapping snapshot。
    pub mapping_snapshot_ref: MappingSourceSnapshotRef,
    /// runtime、tools、member、supervisor与role extras的不可变release pins。
    pub component_pins: ComponentPinSet,
    /// policy/memory/workspace/role-extra模板的静态placement bindings。
    pub seed_bindings: Vec<SeedPlacementBinding>,
    /// 不可变base image ref；hardened base未获scope时只能以gap阻断，不得猜补。
    pub base_image_ref: BaseImageRef,
    /// 当前静态输入完整性。
    pub completeness: BaselineCompleteness,
    /// baseline捕获时点。
    pub captured_at: UtcTimestamp,
    /// 发现缺失/冲突时的安全解释。
    pub reason: Option<SafeReason>,
    /// 后继baseline；旧baseline保留可追溯。
    pub superseded_by: Option<AssemblyBaselineRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `baseline_id` | `ImageLocalId` | baseline主键 | application ID factory。 |
| `variant_ref` | `ImageVariantDefinitionRef` | 静态输入归属variant | command / loaded definition context；不可用裸ID。 |
| `mapping_snapshot_ref` | `MappingSourceSnapshotRef` | mapping来源语境 | safe snapshot；本对象不保存mapping正文。 |
| `component_pins` | `ComponentPinSet` | 必要runtime/tools/member/supervisor/extras release集合 | `ComponentPinSet::assemble`；缺member/supervisor/extra时可为Incomplete/Blocked，不能default。 |
| `seed_bindings` | `Vec<SeedPlacementBinding>` | 静态模板与placement集合 | `SeedPlacementBinding::bind`；按template ref + placement去重排序；不可含live state。 |
| `base_image_ref` | `BaseImageRef` | base identity | approved safe ref；hardened base仍future-only时不从默认tag推导。 |
| `completeness` | `BaselineCompleteness` | baseline state | capture初始由guard结论设置。 |
| `captured_at` | `UtcTimestamp` | 固化判断语境 | application clock。 |
| `reason` | `Option<SafeReason>` | incomplete/conflict/superseded解释 | 对应状态必须有；Complete时为空。 |
| `superseded_by` | `Option<AssemblyBaselineRef>` | immutable history链 | 仅Superseded；不得self ref。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> AssemblyBaselineRef` | 得到typed baseline ref | 无 | `AssemblyBaselineRef` | pure。 |
| `pub fn is_complete(&self) -> bool` | 判断可否进入revision guard | 无 | `bool` | 仅`Complete`为true。 |
| `pub fn apply_completeness(&mut self, disposition: SafeDisposition, reason: Option<SafeReason>) -> Result<(), DomainError>` | 写入本地完整性结论 | guard disposition、optional reason | `Result<(), DomainError>` | VerifiedUsable→Complete；Pending/Blocked/Unavailable→Incomplete；Rejected/Conflict category→Conflict；不调用外部。 |
| `pub fn supersede(&mut self, replacement_ref: AssemblyBaselineRef, reason: SafeReason) -> Result<(), DomainError>` | 追加新baseline替代关系 | replacement、reason | `Result<(), DomainError>` | 非Superseded→Superseded；不可覆盖input字段。 |
| `pub fn supports_revision(&self) -> bool` | 判断baseline是否可作为revision输入 | 无 | `bool` | 仅Complete；不创建revision。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(baseline_id: ImageLocalId, variant_ref: ImageVariantDefinitionRef, mapping_snapshot_ref: MappingSourceSnapshotRef, component_pins: ComponentPinSet, seed_bindings: Vec<SeedPlacementBinding>, base_image_ref: BaseImageRef, captured_at: UtcTimestamp) -> Result<Self, DomainError>` | 固化静态baseline候选 | 所有静态refs与app ID/time | `Result<AssemblyBaseline, DomainError>` | CaptureAssemblyBaseline；初始按必要字段存在性为Incomplete或待guard结论，不能自动Complete。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| immutable input | baseline成立后不得追加component、seed或base；需要修改时创建新baseline并supersede。 |
| no default/latest/live | 任何必要release/base/template缺失、mutable或live时必须incomplete/conflict/blocked。 |
| 完整baseline也不是成功 | Complete只表示static input可判断，绝不表示build/candidate/eligibility/availability。 |

#### 8.6 `VariantRevision`

```rust
/// 将一个 variant definition 与不可变baseline绑定的本仓revision；它只管理build意图前置。
pub struct VariantRevision {
    /// application 层生成的revision身份。
    pub revision_id: ImageLocalId,
    /// 所属variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 不可变baseline引用。
    pub baseline_ref: AssemblyBaselineRef,
    /// 由本仓operation记录的安全派生原因。
    pub derivation_reason: SafeReason,
    /// revision局部生命周期。
    pub lifecycle: VariantRevisionLifecycle,
    /// invalid/superseded时的安全解释。
    pub terminal_reason: Option<SafeReason>,
    /// 旧revision被替代时的后继ref。
    pub superseded_by: Option<VariantRevisionRef>,
    /// 提议时点。
    pub created_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `revision_id` | `ImageLocalId` | revision主键 | application ID factory。 |
| `variant_ref` / `baseline_ref` | typed local ref | source definition与immutable input语境 | command + loaded truth；Step 9检查cross-ref一致性。 |
| `derivation_reason` | `SafeReason` | 为什么产生新revision | command intent / safe change conclusion；不存owner body。 |
| `lifecycle` | `VariantRevisionLifecycle` | buildability状态 | propose初始Proposed。 |
| `terminal_reason` / `superseded_by` | optional reason/ref | terminal语义 | 仅Invalid/Superseded时相应存在。 |
| `created_at` | `UtcTimestamp` | 本仓成立时点 | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> VariantRevisionRef` | 得到revision ref | 无 | `VariantRevisionRef` | pure。 |
| `pub fn validate(&mut self, baseline: &AssemblyBaseline, completeness_guard: &AssemblyCompletenessGuard, pin_guard: &PinIntegrityGuard) -> Result<SafeDisposition, DomainError>` | 根据loaded baseline与pure guards判定buildability | baseline、两个guard | `Result<SafeDisposition, DomainError>` | 仅Proposed；VerifiedUsable→Buildable，其余→Invalid；不启动构建。 |
| `pub fn can_start_build(&self) -> bool` | 判断是否可请求intent | 无 | `bool` | 仅Buildable；不交接builder。 |
| `pub fn supersede(&mut self, replacement_ref: VariantRevisionRef, reason: SafeReason) -> Result<(), DomainError>` | 追加替代关系 | non-self replacement、reason | `Result<(), DomainError>` | 任何非Superseded→Superseded；历史不可覆盖。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn propose(revision_id: ImageLocalId, variant_ref: ImageVariantDefinitionRef, baseline_ref: AssemblyBaselineRef, derivation_reason: SafeReason, created_at: UtcTimestamp) -> Result<Self, DomainError>` | 建revision候选 | app ID、local refs、reason/time | `Result<VariantRevision, DomainError>` | ProposeVariantRevision；初始Proposed。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| buildable的窄含义 | 只允许`RequestBuildIntent`前置；不是external build、candidate或supply结果。 |
| 不重写baseline/digest | revision仅引用baseline；改变输入必须新baseline/new revision。 |
| invalid不被修复 | Invalid后必须新revision，而非把旧对象原地设Buildable。 |

#### 8.7 `MappingSourceSnapshot`

```rust
/// 对 Method Library Role-to-variant mapping 的body-free本地快照；维护指定用途的validity，不拥有mapping truth。
pub struct MappingSourceSnapshot {
    /// application生成的snapshot身份。
    pub snapshot_id: ImageLocalId,
    /// kind必须为RoleVariantMapping的外部mapping ref。
    pub mapping_ref: MappingSourceRef,
    /// safe owner conclusion，不携带mapping body。
    pub conclusion: SafeReferenceConclusion,
    /// 本地用途下的validity。
    pub validity: ReferenceValidity,
    /// 捕获时点。
    pub captured_at: UtcTimestamp,
    /// stale/conflict/unavailable解释。
    pub invalid_reason: Option<SafeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `snapshot_id` | `ImageLocalId` | snapshot主键 | app ID factory。 |
| `mapping_ref` | `MappingSourceRef` | Method Library owner binding | external ref必须owner=MethodLibrary、kind=RoleVariantMapping；MI-UP-003未闭口时不能伪造。 |
| `conclusion` | `SafeReferenceConclusion` | 当前safe input结论 | mapping/source adapter的body-free输出。 |
| `validity` | `ReferenceValidity` | local use validity | capture由conclusion映射；不是owner lifecycle。 |
| `captured_at` | `UtcTimestamp` | capture语境 | clock。 |
| `invalid_reason` | `Option<SafeReason>` | invalid原因 | valid时None；stale/conflict/unavailable必须Some。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> MappingSourceSnapshotRef` | 得到snapshot ref | 无 | `MappingSourceSnapshotRef` | pure。 |
| `pub fn is_usable_for_definition(&self) -> bool` | 判断能否作definition/baseline输入 | 无 | `bool` | 仅Valid且conclusion=VerifiedUsable。 |
| `pub fn invalidate(&mut self, validity: ReferenceValidity, reason: SafeReason) -> Result<(), DomainError>` | 明确标记stale/conflict/unavailable | non-Valid validity、reason | `Result<(), DomainError>` | Valid→non-Valid；不改变外部owner。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(snapshot_id: ImageLocalId, mapping_ref: MappingSourceRef, conclusion: SafeReferenceConclusion, captured_at: UtcTimestamp) -> Result<Self, DomainError>` | 从safe ref创建本地snapshot | app ID、owner ref/conclusion/time | `Result<MappingSourceSnapshot, DomainError>` | Definition / Reference intake；按conclusion得到Valid或保守validity。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no mapping body | snapshot永不携带RoleDefinition、mapping内容、role count或method asset正文。 |
| stale不支持新决策 | stale/conflict/unavailable只能解释历史、创建gap或block新definition/revision lane。 |

#### 8.8 `ComponentPinSet`

```rust
/// 一组不可变component release pins，覆盖runtime、tools、member、supervisor与受控role extras；维护pin完整性而非组件truth。
pub struct ComponentPinSet {
    /// 按slot和canonical immutable release ref去重排序的pins。
    pub pins: ComponentPinList,
    /// 当前scope所需的component slot规则。
    pub required_slots: Vec<ComponentSlotKind>,
    /// pin集合的本地安全结论。
    pub disposition: SafeDisposition,
    /// incomplete/conflict/blocked解释。
    pub reason: Option<SafeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `pins` | `ComponentPinList` | immutable release pins | each ref owner可以Runtime/Tools/Member/Supervisor，kind=ComponentRelease；role-extra也须对应正式owner。 |
| `required_slots` | `Vec<ComponentSlotKind>` | 当前必要slot | 从已收稳assembly scope规则得出；不能用config减少。 |
| `disposition` | `SafeDisposition` | completeness/immutability结论 | PinIntegrityGuard给出；`VerifiedUsable`才满足完整pin。 |
| `reason` | `Option<SafeReason>` | fail-closed解释 | VerifiedUsable时None；其他需Some。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_complete(&self) -> bool` | 判断required slot均有immutable pin | 无 | `bool` | 仅VerifiedUsable。 |
| `pub fn contains_slot(&self, slot: ComponentSlotKind) -> bool` | 查询slot是否被pin | slot | `bool` | pure。 |
| `pub fn diff(&self, other: &ComponentPinSet) -> OrderedExternalRefSet` | 生成body-free pin差异集合 | other pin set | `OrderedExternalRefSet` | 只返回ComponentRelease refs；不复制component body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn assemble(pins: ComponentPinList, required_slots: Vec<ComponentSlotKind>, disposition: SafeDisposition, reason: Option<SafeReason>) -> Result<Self, DomainError>` | 构造pin集合和验证结论 | deterministic pins、scope slots、guard output | `Result<ComponentPinSet, DomainError>` | CaptureAssemblyBaseline；不自动默认member/supervisor/extra。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| immutable-only | `latest`、mutable tag、source path、package version或guess不能被转换为release pin。 |
| owner truth外置 | 本对象不保存runtime/tools/member/supervisor binary、manifest或compatibility report正文。 |
| missing必须可见 | MI-UP-002等未闭口输入表现为非VerifiedUsable，不由fake/config补齐。 |

#### 8.9 `SeedPlacementBinding`

```rust
/// 一个静态模板引用到镜像静态层的binding；维护template/placement边界，绝不携带live state或seed正文。
pub struct SeedPlacementBinding {
    /// kind必须为SeedTemplate的外部模板引用。
    pub template_ref: SeedTemplateRef,
    /// 模板的静态类别。
    pub seed_kind: StaticSeedKind,
    /// 仅表达静态镜像层placement的类别。
    pub placement_kind: StaticPlacementKind,
    /// 模板ref在当前用途下的validity。
    pub validity: ReferenceValidity,
    /// 非Valid状态的安全解释。
    pub reason: Option<SafeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `template_ref` | `SeedTemplateRef` | policy/memory/workspace/role extra template owner binding | external ref kind必须`SeedTemplate`；MI-UP-006未闭口时只能收到safe ref/gap，不能造body。 |
| `seed_kind` | `StaticSeedKind` | 区分模板用途 | command/source safe conclusion给出；不推断semantic body。 |
| `placement_kind` | `StaticPlacementKind` | 约束其镜像静态层位置 | `StaticSeedPlacementRuleSet`校验；不是runtime mount/path/volume。 |
| `validity` | `ReferenceValidity` | 本地装配可用性 | source conclusion映射；Valid以外不进入complete baseline。 |
| `reason` | `Option<SafeReason>` | stale/conflict/unavailable解释 | Valid时None；非Valid时Some。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_static_safe(&self) -> bool` | 判断binding是否可用于静态assembly | 无 | `bool` | 仅Valid；不加载模板正文。 |
| `pub fn matches(&self, template_ref: &SeedTemplateRef, placement_kind: StaticPlacementKind) -> bool` | 判断binding键是否相同 | template ref、placement | `bool` | pure；用于去重。 |
| `pub fn invalidate(&mut self, validity: ReferenceValidity, reason: SafeReason) -> Result<(), DomainError>` | 让旧binding显式失效 | non-Valid validity、reason | `Result<(), DomainError>` | 不修改template owner或另一个baseline。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn bind(template_ref: SeedTemplateRef, seed_kind: StaticSeedKind, placement_kind: StaticPlacementKind, conclusion: SafeReferenceConclusion) -> Result<Self, DomainError>` | 从safe template conclusion建立binding | typed ref/kind/placement/conclusion | `Result<SeedPlacementBinding, DomainError>` | CaptureAssemblyBaseline；由conclusion映射initial validity。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| template而非live state | policy/memory/workspace seed只可是模板；live memory、checkpoint、credential、mounted workspace和runtime state均禁止。 |
| placement而非执行配置 | 不在该对象定义目录路径、mount、shell command、container lifecycle或secret处理。 |
| invalid不被默认绕过 | stale/conflict/unavailable必须使受影响baseline不可complete，恢复以新binding发生。 |

#### 8.10 `AssemblyCompletenessGuard`

```rust
/// 检查一个baseline是否包含当前scope要求的静态、body-free且不可变输入；只输出本仓保守结论。
pub struct AssemblyCompletenessGuard {
    /// 必要外部owner/kind规则；不含owner正文。
    pub required_reference_rules: RequiredExternalReferenceRuleSet,
    /// 允许的静态seed类别与placement规则。
    pub required_seed_rules: StaticSeedPlacementRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_reference_rules` | `RequiredExternalReferenceRuleSet` | 表达当前assembly需要哪些外部ref类型 | 从已收稳本仓scope/正式owner input得到；不得由config静默减少。 |
| `required_seed_rules` | `StaticSeedPlacementRuleSet` | 约束seed的static-safe组合 | 同上；不内嵌policy/memory/workspace正文。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check_baseline(&self, baseline: &AssemblyBaseline, mapping_snapshot: &MappingSourceSnapshot) -> SafeDisposition` | 检查baseline结构与mapping validity | loaded baseline、snapshot | `SafeDisposition` | pure；缺/ref失效→Blocked/Pending/Unavailable，不能输出业务ready。 |
| `pub fn check_seed_bindings(&self, bindings: &[SeedPlacementBinding]) -> SafeDisposition` | 验证必要seed及static-safe placement | binding slice | `SafeDisposition` | pure；拒绝live/unknown/重复/错placement。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_rules(required_reference_rules: RequiredExternalReferenceRuleSet, required_seed_rules: StaticSeedPlacementRuleSet) -> Result<Self, DomainError>` | 建立guard | deterministic rule sets | `Result<AssemblyCompletenessGuard, DomainError>` | application service装配domain guard；不调用adapter。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| pure guard | 不访问repository、clock、config、SDK、template body或runtime。 |
| fail closed | required rule缺失、source stale/conflict/unavailable或seed不static-safe时不能返回`VerifiedUsable`。 |
| 不替治理 | 这是本仓结构完整性，不定义或替代governance approval/policy truth。 |

#### 8.11 `PinIntegrityGuard`

```rust
/// 校验必要component pins均是受控不可变release，并拒绝mutable selector、猜测版本和owner不匹配。
pub struct PinIntegrityGuard {
    /// 当前scope必须出现的component slots。
    pub required_slots: Vec<ComponentSlotKind>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_slots` | `Vec<ComponentSlotKind>` | 指定runtime/tools/member/supervisor/role extra必要slot | 由正式scope规则输入；排序去重且不可为空。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check_pins(&self, pins: &ComponentPinSet) -> SafeDisposition` | 检查完整性、owner/kind与不可变性 | pin set | `SafeDisposition` | pure；`latest`/mutable/缺slot/compatibility不可用不得VerifiedUsable。 |
| `pub fn rejects_mutable_selector(&self, release_ref: &ComponentReleaseRef) -> bool` | 显式判断release ref是否非法mutable | typed component ref | `bool` | pure；不尝试解析或替换为猜测release。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_required_slots(required_slots: Vec<ComponentSlotKind>) -> Result<Self, DomainError>` | 创建pin guard | deduplicated slots | `Result<PinIntegrityGuard, DomainError>` | baseline/revision validation。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no mutable translation | guard不得把tag、path、package version或human label转换为immutable release。 |
| no owner claim | component release/compatibility owner仍在Runtime/Tools/Member/Supervisor；MI-UP-002未闭口不假设pass。 |
| local-only outcome | 输出只影响baseline/revision本仓判断，不能变成build/consumer成功。 |

### 8.12 DefinitionAssembly 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| capability是否均有对象承接 | `pass` | family/variant/baseline/revision/snapshot/pin/seed/guards均有唯一domain归属。 |
| 外部body是否被隔离 | `pass` | mapping、component、seed、base、compatibility均只以typed ref / safe conclusion进入。 |
| 字段来源是否可追溯 | `pass_with_pending` | local ID/time/metadata来自future application/technical port；外部ref shape受MI-UP-002/003/006阻断，保持gap。 |
| 状态语义是否分层 | `pass` | definition/baseline/revision不含build/candidate/eligibility/supply。 |
| 是否越过port/flow边界 | `pass` | adapter/repository/DTO/transaction未提前定义，转入Step 7~11。 |

## 9. `domain::build` / `guards`：BuildCandidate 对象契约

### 9.1 模块 capability 与对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 请求本地 build intent | buildable revision、trigger、metadata | intent ref / safe blocked conclusion | accepted/pending/blocked/cancelled | command/job/future verified event | build repo、trigger/idempotency port、Request protocol/flow。 |
| 固化 immutable build input | revision、baseline、canonical static refs | snapshot | complete/incomplete/invalid | no live/secret/body | snapshot repository/flow。 |
| 记录 build attempt / outcome | intent、complete snapshot、safe handoff/outcome | attempt / outcome ref | created/pending/succeeded/failed/unknown | builder/registry adapter | builder/registry port、outcome flow。 |
| 形成 candidate | attempt+snapshot+safe output identity | candidate | formed/rejected/blocked/unknown | immutable output identity only | qualification flow / repository。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `BuildIntent` | local request decision | aggregate | accept/block/cancel、can start attempt | 不代表builder任务或candidate。 |
| `BuildInputSnapshot` | immutable static input context | immutable aggregate | validate complete、match revision | 不含live state/secret/raw body。 |
| `BuildAttempt` | external side-effect observation | entity/history anchor | record handoff/outcome/unknown/supersede | 不将ACK设success，不盲retryunknown。 |
| `BuildOutcomeConclusion` | safe external result | value/entity | determine candidate input usability | 不保存raw job/log/report或造digest。 |
| `CandidateImage` | local candidate formation truth | entity | form/reject/block/unknown、handoff to qualification | 不等eligible/available。 |
| `CandidateFormationGuard` | formation consistency validation | pure guard | validate attempt/snapshot/outcome/output | 不调用builder/registry、不接受tag。 |

### 9.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory | 成员函数 | 状态 | 字段来源 |
|---|---|---|---|---|---|---|
| `BuildIntent` | trigger和revision的本地接受 | ID、revision、trigger metadata/state/reason/time | `request` | accept/block/cancel/can start | `BuildIntentLifecycle` | command/job/conditionalworker + app ID/clock。 |
| `BuildInputSnapshot` | static immutable input binding | ID、revision/baseline、input identity/state/reason/time | `capture` | validate/matches | `BuildSnapshotLifecycle` | loaded local truth + controlled refs。 |
| `BuildAttempt` | side-effect local observation | ID、intent/snapshot/handoff/state/outcome/supersede/time | `start` | record handoff/outcome/unknown/supersede | `BuildAttemptLifecycle` | local refs + safe adapter conclusion。 |
| `BuildOutcomeConclusion` | adapter outcome normalization | ID、attempt/execution/result/output/reason/time | `conclude` | candidate input check | `BuildResultKind` | future builder/registry safe adapter。 |
| `CandidateImage` | candidate local truth | ID、attempt/revision/output/basis/state/reason/time | `form` | reject/block/mark unknown | `CandidateLifecycle` | guard + safe outcome + app ID/clock。 |
| `CandidateFormationGuard` | correlation/immutable output validation | allowed disposition rules | `from_policy` | check/check identity | `SafeDisposition` | fixed local invariant，不读product config。 |

#### 9.3 `BuildIntent`

```rust
/// 一次来源明确的本地构建意图；只证明本仓允许开始attempt判断，不证明外部构建已经执行。
pub struct BuildIntent {
    /// application层生成的intent身份。
    pub intent_id: ImageLocalId,
    /// 必须是Buildable的revision引用；实际loaded-state检查由flow协调。
    pub revision_ref: VariantRevisionRef,
    /// command、nightly或future verified inbound event触发类型。
    pub trigger_kind: BuildTriggerKind,
    /// body-free触发来源；不得保存event payload或scheduler run。
    pub trigger_ref: OpaqueReference,
    /// 操作元数据语境。
    pub metadata: OperationMetadata,
    /// intent局部生命周期。
    pub lifecycle: BuildIntentLifecycle,
    /// pending/blocked/cancelled解释。
    pub reason: Option<SafeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `intent_id` | `ImageLocalId` | intent主键 | application ID factory。 |
| `revision_ref` | `VariantRevisionRef` | build前置revision | command/job选择的persisted ref；application/flow验证loaded revision为Buildable。 |
| `trigger_kind` | `BuildTriggerKind` | origin分类 | command、nightly或future verified event；当前event authority未闭口。 |
| `trigger_ref` | `OpaqueReference` | 触发来源 | Command可用Core/local accepted trigger ref；Nightly可用local bounded action ref；event必须在MI-UP-005关闭后才可用。 |
| `metadata` | `OperationMetadata` | idempotency/correlation/time | request/job/verified input提供；不可从payload猜算。 |
| `lifecycle` | `BuildIntentLifecycle` | local state | request初始由guard决定Accepted/Pending/Blocked。 |
| `reason` | `Option<SafeReason>` | 非accepted原因 | Accepted时None；其余必须Some。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> BuildIntentRef` | 得到intent ref | 无 | `BuildIntentRef` | pure。 |
| `pub fn accept(&mut self) -> Result<(), DomainError>` | 允许进入snapshot/attempt判断 | 无 | `Result<(), DomainError>` | Pending→Accepted仅由futureflow在新安全输入后调用；不能从Blocked/Cancelled复活。 |
| `pub fn mark_pending(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 等待verified source/contract | safe reason | `Result<(), DomainError>` | Accepted/Pending→Pending；不启动external work。 |
| `pub fn block(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 显式阻断本intent lane | safe reason | `Result<(), DomainError>` | Accepted/Pending→Blocked；不能形成candidate。 |
| `pub fn cancel(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 在side effect前取消 | safe reason | `Result<(), DomainError>` | 仅Accepted/Pending；Step 9必须证明还无attempt handoff。 |
| `pub fn can_start_attempt(&self) -> bool` | 判断是否可捕获snapshot | 无 | `bool` | 仅Accepted；仍需complete snapshot。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn request(intent_id: ImageLocalId, revision_ref: VariantRevisionRef, trigger_kind: BuildTriggerKind, trigger_ref: OpaqueReference, metadata: OperationMetadata, initial_disposition: SafeDisposition, reason: Option<SafeReason>) -> Result<Self, DomainError>` | 建立intent与保守initial state | app ID、revision、trigger、metadata、guard conclusion | `Result<BuildIntent, DomainError>` | RequestBuildIntent / Nightly；event lane当前只能Pending/Blocked/Unavailable语义。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| accepted不等completed | intent从不表达external job已经创建、registry存在、output出现或candidate形成。 |
| event arrival不可接受 | `VerifiedInboundEvent` 仅在worker/contract验证后；当前MI-UP-005下不得产生Accepted。 |
| 消除重放靠metadata | 同一idempotency/correlation的处理由application/store承接；domain不得私造hash或scan map。 |

#### 9.4 `BuildInputSnapshot`

```rust
/// 一次attempt之前的不可变静态输入快照；它的identity来自canonical refs而非本仓捏造的外部digest。
pub struct BuildInputSnapshot {
    /// application层生成的snapshot身份。
    pub snapshot_id: ImageLocalId,
    /// build所依据的revision。
    pub revision_ref: VariantRevisionRef,
    /// revision所依据的baseline。
    pub baseline_ref: AssemblyBaselineRef,
    /// canonical static input bindings。
    pub input_identity: BuildInputIdentity,
    /// snapshot完整性。
    pub lifecycle: BuildSnapshotLifecycle,
    /// incomplete/invalid解释。
    pub reason: Option<SafeReason>,
    /// 捕获时点。
    pub captured_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `snapshot_id` | `ImageLocalId` | snapshot主键 | application ID factory。 |
| `revision_ref` / `baseline_ref` | typed local refs | build输入本地context | loaded revision/baseline；flow验证关联。 |
| `input_identity` | `BuildInputIdentity` | immutable input集合 | 从baseline、mapping snapshot、pins、seed/base refs按角色canonical化；不保存body/digest。 |
| `lifecycle` | `BuildSnapshotLifecycle` | completeness状态 | capture + guard设定。 |
| `reason` | `Option<SafeReason>` | incomplete/invalid解释 | Complete时None；否则Some。 |
| `captured_at` | `UtcTimestamp` | frozen time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> BuildInputSnapshotRef` | 得到snapshot ref | 无 | `BuildInputSnapshotRef` | pure。 |
| `pub fn is_complete(&self) -> bool` | 判断可否起attempt | 无 | `bool` | 仅Complete。 |
| `pub fn validate_against(&mut self, revision: &VariantRevision, baseline: &AssemblyBaseline) -> Result<SafeDisposition, DomainError>` | 验证ref一致与baseline完整性 | loaded revision/baseline | `Result<SafeDisposition, DomainError>` | 仅capture后；VerifiedUsable→Complete，其他→Incomplete/Invalid；不调用adapter。 |
| `pub fn matches_revision(&self, revision_ref: &VariantRevisionRef) -> bool` | 验证revision一致 | typed revision ref | `bool` | pure。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(snapshot_id: ImageLocalId, revision_ref: VariantRevisionRef, baseline_ref: AssemblyBaselineRef, input_identity: BuildInputIdentity, captured_at: UtcTimestamp) -> Result<Self, DomainError>` | 固化snapshot候选 | app ID、local refs、canonical input/time | `Result<BuildInputSnapshot, DomainError>` | request intent后；初始Incomplete直到validate。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| snapshot不可补写 | 捕获后不可加ref/seed/component；修改输入必须new snapshot/new attempt context。 |
| no live/secret | live memory/checkpoint、credential、runtime state、raw body均不能位于input identity。 |
| no fabricated digest | object没有外部digest字段；真实content identity只能以future safe ref进入outcome/provenance。 |

#### 9.5 `BuildAttempt`

```rust
/// 一次基于complete snapshot的外部构建尝试的本仓观察记录；未知副作用保持unknown而非普通重试。
pub struct BuildAttempt {
    /// application层生成的attempt身份。
    pub attempt_id: ImageLocalId,
    /// 对应已accepted的intent。
    pub intent_ref: BuildIntentRef,
    /// 必须为complete的immutable snapshot。
    pub snapshot_ref: BuildInputSnapshotRef,
    /// controlled external handoff ref；它不证明external acceptance。
    pub handoff_ref: BuildHandoffRef,
    /// attempt局部观察状态。
    pub lifecycle: BuildAttemptLifecycle,
    /// safe outcome conclusion，在已记录时存在。
    pub outcome_ref: Option<BuildOutcomeConclusionRef>,
    /// unknown/failed/handoff的安全解释。
    pub reason: Option<SafeReason>,
    /// 新attempt替代旧unknown/failed语境时的ref。
    pub superseded_by: Option<BuildAttemptRef>,
    /// 建立时点。
    pub created_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `attempt_id` | `ImageLocalId` | attempt主键 | application ID factory。 |
| `intent_ref` / `snapshot_ref` | typed local refs | trigger和frozen input语境 | application flow加载并验证Accepted/Complete。 |
| `handoff_ref` | `BuildHandoffRef` | controlled adapter handoffidentity | builder seam safe output；不包含job body。 |
| `lifecycle` | `BuildAttemptLifecycle` | local observation state | start初始Created。 |
| `outcome_ref` | `Option<BuildOutcomeConclusionRef>` | safe result ref | Succeeded/Failed通常必须Some；Created/HandoffPending可None；Unknown可None。 |
| `reason` | `Option<SafeReason>` | state解释 | Failed/Unknown必须Some。 |
| `superseded_by` | `Option<BuildAttemptRef>` | recovery history chain | 仅failed/unknown的new context替代；不得self。 |
| `created_at` | `UtcTimestamp` | local record time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> BuildAttemptRef` | 得attempt ref | 无 | `BuildAttemptRef` | pure。 |
| `pub fn record_handoff(&mut self, reason: Option<SafeReason>) -> Result<(), DomainError>` | 记录controlled handoff等待 | optional safe reason | `Result<(), DomainError>` | Created→HandoffPending；不宣称accepted/succeeded。 |
| `pub fn mark_outcome_pending(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 记录side effect后结果未定 | safe reason | `Result<(), DomainError>` | HandoffPending→OutcomePending。 |
| `pub fn record_outcome(&mut self, outcome_ref: BuildOutcomeConclusionRef, outcome: &BuildOutcomeConclusion) -> Result<(), DomainError>` | 绑定safe outcome并更新状态 | typed ref、loaded outcome | `Result<(), DomainError>` | HandoffPending/OutcomePending→Succeeded/Failed/Unknown；验证outcome.attempt_ref==self ref。 |
| `pub fn mark_unknown(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 保守标记unknown | safe reason | `Result<(), DomainError>` | Created/HandoffPending/OutcomePending→Unknown；不得自动retry。 |
| `pub fn supersede(&mut self, replacement_ref: BuildAttemptRef, reason: SafeReason) -> Result<(), DomainError>` | 追加恢复语境 | non-self replacement/reason | `Result<(), DomainError>` | 仅Failed/Unknown；保留旧状态和outcome。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(attempt_id: ImageLocalId, intent_ref: BuildIntentRef, snapshot_ref: BuildInputSnapshotRef, handoff_ref: BuildHandoffRef, created_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立attempt | app ID、accepted intent ref、complete snapshot ref、safe handoff/time | `Result<BuildAttempt, DomainError>` | Step 9 flow在读取对象后验证preconditions；初始Created。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| unknown是安全终点 | `Unknown`不得原地转Succeeded或形成candidate；需safe resolution或new attempt context。 |
| handoff不等执行完成 | `BuildHandoffRef`/ACK/adapter return均不构成candidate条件。 |
| history不覆盖 | recovery以new attempt+supersede，不能覆盖旧attempt字段。 |

#### 9.6 `BuildOutcomeConclusion`

```rust
/// 外部build/registry结果的本仓安全结论；只保存可回链的ref、kind和reason，不保存raw execution body。
pub struct BuildOutcomeConclusion {
    /// application层生成的outcome身份。
    pub outcome_id: ImageLocalId,
    /// 结论所属attempt。
    pub attempt_ref: BuildAttemptRef,
    /// body-free外部execution identity。
    pub execution_ref: ExternalBuildExecutionRef,
    /// 保守结果种类。
    pub result_kind: BuildResultKind,
    /// 被safe source验证的immutable content identity；未知/失败/不可用时可为空。
    pub output_identity_ref: Option<VerifiedContentIdentityRef>,
    /// 结论的安全原因。
    pub reason: Option<SafeReason>,
    /// 外部结论被本仓记录时点；不是外部完成事实时间。
    pub recorded_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `outcome_id` | `ImageLocalId` | local outcome ID | application ID factory。 |
| `attempt_ref` | `BuildAttemptRef` | attempt关联 | command/adapter input must match loaded attempt。 |
| `execution_ref` | `ExternalBuildExecutionRef` | external execution identity | owner=Builder或Registry、kind=BuildExecution；不存job body。 |
| `result_kind` | `BuildResultKind` | conservative observation | future approved adapter safe conclusion；不能由ACK/HTTP status直接构造。 |
| `output_identity_ref` | `Option<VerifiedContentIdentityRef>` | immutable output binding | 仅Succeeded且safe source验证时Some；不得以tag/guess/raw digest代替。 |
| `reason` | `Option<SafeReason>` | failed/unknown/unavailable解释 | Succeeded时可以None；其他必须Some。 |
| `recorded_at` | `UtcTimestamp` | local observation time | application clock/metadata。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> BuildOutcomeConclusionRef` | 得outcome ref | 无 | `BuildOutcomeConclusionRef` | pure。 |
| `pub fn can_enter_candidate_guard(&self) -> bool` | 判断是否具备candidate guard最小输入 | 无 | `bool` | 仅Succeeded且`output_identity_ref.is_some()`。 |
| `pub fn is_unknown_or_unavailable(&self) -> bool` | 判断应阻止正向推导 | 无 | `bool` | Unknown/Unavailable返回true。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn conclude(outcome_id: ImageLocalId, attempt_ref: BuildAttemptRef, execution_ref: ExternalBuildExecutionRef, result_kind: BuildResultKind, output_identity_ref: Option<VerifiedContentIdentityRef>, reason: Option<SafeReason>, recorded_at: UtcTimestamp) -> Result<Self, DomainError>` | 接收safe adapter结果形成结论 | all listed fields | `Result<BuildOutcomeConclusion, DomainError>` | RecordBuildOutcome；factory强制Succeeded需identity，Failed/Unknown/Unavailable需reason。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| result不等candidate | `Succeeded`只进入candidate guard；无法绕过snapshot/correlation/immutable identity验证。 |
| no raw body | log、report、callback payload、registry manifest body和provider错误均禁止。 |
| no fabricated content identity | 本对象只能引用`VerifiedContentIdentityRef`，不产生真实digest或artifact结果。 |

#### 9.7 `CandidateImage`

```rust
/// 已通过candidate formation guard的本仓镜像候选；维护candidate阶段truth，不拥有资格、Artifact或供给事实。
pub struct CandidateImage {
    /// application层生成的candidate身份。
    pub candidate_id: ImageLocalId,
    /// 形成candidate的attempt。
    pub attempt_ref: BuildAttemptRef,
    /// candidate源revision。
    pub revision_ref: VariantRevisionRef,
    /// 已验证的immutable image identity。
    pub image_ref: ImmutableImageRef,
    /// 验证该identity的safe binding。
    pub formation_basis: VerifiedContentIdentityRef,
    /// candidate局部状态。
    pub lifecycle: CandidateLifecycle,
    /// rejected/blocked/unknown解释。
    pub reason: Option<SafeReason>,
    /// 形成或记录状态时点。
    pub formed_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `candidate_id` | `ImageLocalId` | candidate主键 | application ID factory。 |
| `attempt_ref` / `revision_ref` | typed local refs | attempt/revision chain | CandidateFormationGuard + loaded objects验证。 |
| `image_ref` | `ImmutableImageRef` | immutable candidate image ref | owner=Registry/Builder、kind=ImmutableImage，canonical immutable identity；不能latest/tag。 |
| `formation_basis` | `VerifiedContentIdentityRef` | output验证依据 | outcome safe binding；exact underlying ref kind须验证。 |
| `lifecycle` | `CandidateLifecycle` | formation status | form初始Formed；或guard结论创建negative context。 |
| `reason` | `Option<SafeReason>` | negative state解释 | Formed时None；其余Some。 |
| `formed_at` | `UtcTimestamp` | local formation time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> CandidateImageRef` | 得candidate ref | 无 | `CandidateImageRef` | pure。 |
| `pub fn is_formed(&self) -> bool` | 判断能否进入qualification输入 | 无 | `bool` | 仅Formed。 |
| `pub fn reject(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 记录formation拒绝 | reason | `Result<(), DomainError>` | 仅尚未交给qualification的Formed候选可转Rejected；若已持久化形成history，flow应新建negative context而非覆盖。 |
| `pub fn block(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 记录contract/source gap | reason | `Result<(), DomainError>` | Formed→Blocked只可在尚未开始qualification之前；后续判断应新建qualification context。 |
| `pub fn mark_unknown(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 记录identity/结果未知 | reason | `Result<(), DomainError>` | 不进入eligibility。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn form(candidate_id: ImageLocalId, attempt_ref: BuildAttemptRef, revision_ref: VariantRevisionRef, image_ref: ImmutableImageRef, formation_basis: VerifiedContentIdentityRef, formed_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立formed candidate | app ID、validated local refs、immutable ref/basis/time | `Result<CandidateImage, DomainError>` | CandidateFormationGuard verified后；初始Formed。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| candidate阶段独立 | Candidate不等eligible、Artifact accepted、entry available、consumer confirmed或container started。 |
| immutable identity | `image_ref`必须是immutable；registry presence、tag、latest、handwritten digest均不可用。 |
| negative状态不伪恢复 | Blocked/Unknown/Rejected需新attempt/candidate/qualification语境，不能用adapter callback原地变Formed。 |

#### 9.8 `CandidateFormationGuard`

```rust
/// 验证attempt、snapshot、outcome和immutable output identity关联的pure guard；不调用builder或registry。
pub struct CandidateFormationGuard {
    /// 唯一允许作为candidate输入的安全结果类别。
    pub required_result_kind: BuildResultKind,
    /// 必须满足的output external ref规则。
    pub required_output_rule: RequiredExternalReferenceRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_result_kind` | `BuildResultKind` | 明确只接收Succeeded | 固定为Succeeded；不得由config改为Unknown/Unavailable。 |
| `required_output_rule` | `RequiredExternalReferenceRule` | immutable image身份预期owner/kind | owner=Builder或Registry，kind=ImmutableImage；future product adapter不改变此语义。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check(&self, attempt: &BuildAttempt, snapshot: &BuildInputSnapshot, outcome: &BuildOutcomeConclusion) -> SafeDisposition` | 校验attempt/snapshot/outcome关联 | loaded objects | `SafeDisposition` | pure；requires matching refs、Complete snapshot、Succeeded+identity；Unknown/Unavailable不产生VerifiedUsable。 |
| `pub fn check_output_identity(&self, output: &VerifiedContentIdentityRef) -> SafeDisposition` | 验证output identity ref形态 | verified content binding | `SafeDisposition` | pure；拒绝wrong kind、mutable selector和missing verification source。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict() -> Self` | 创建固定fail-closed guard | 无 | `CandidateFormationGuard` | domain composition；无config/adapter依赖。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| ACK/registry presence不足 | adapter acknowledgement、HTTP 2xx或tag visibility不是candidate formation input。 |
| correlation必须可回链 | attempt、snapshot、outcome与output binding不一致时必须Rejected/Blocked/Unknown，不能猜修。 |
| pure且窄 | guard不写history、不调用I/O、不创建candidate；application flow负责持久化/trace。 |

### 9.9 BuildCandidate 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| intent/attempt/snapshot/outcome/candidate是否分层 | `pass` | 每个阶段有独立对象与lifecycle，避免accepted/ACK/registry presence偷换成功。 |
| unknown是否隔离 | `pass` | `BuildAttempt`/outcome/candidate各有Unknown语义；恢复仅新context或future safe resolution。 |
| content identity是否越界 | `pass_with_pending` | 只接受future safe external binding，不声称生成真实digest、artifact、report或发布结果。 |
| external产品是否被选择 | `pass` | Builder/Registry只作为future adapter owner/ref，Q-MI-003保持pending。 |
| port/transaction/idempotency是否未提前伪定义 | `pass` | Step 7闭合adapter/repository/UoW/ID surfaces；Step 8~11闭合协议/flow/transaction。 |

## 10. `domain::qualification` / `guards`：Qualification 对象契约

### 10.1 模块 capability 与对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 建立可回链provenance | formed candidate、complete snapshot、safe execution/output refs | provenance binding | complete/incomplete/conflict | builder/registry仅提供safe refs | provenance repository / qualification flow。 |
| 评估适用gate | candidate、authority-owned applicable set、safe conclusion refs | gate evaluation | pending/passed/failed/blocked/unknown | governance/evidence truth外置 | evidence/gate resolver port。 |
| 形成本仓eligibility | candidate、provenance、gate evaluation | eligibility decision | pending/eligible/ineligible/blocked | 不代表Artifact或consumer结果 | qualification repository/supply flow。 |
| 记录Artifact handoff | eligible candidate、optional owner ref / gap | handoff record | pending/gap/conditional accepted | L1-artifact owner | Artifact port/reconcile flow。 |
| fail-closed qualification guard | loaded local objects + safe refs | safe disposition | pure validation | no gate inventory/body | Step 7 port、Step 9 flow。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ProvenanceBinding` | candidate来源链 | immutable local relation | bind/verify/mark conflict | 不保存evidence/Artifact body。 |
| `GateEvaluation` | authority-driven gate conclusions | local evaluation record | open/record/close/supersede | 不定义gate kind/priority/inventory。 |
| `EligibilityDecision` | image-domain资格判断 | local decision truth | evaluate/supersede/permits supply | 不代表Artifact/consumer confirmation。 |
| `ArtifactHandoffRecord` | artifact边界local observation | conditional handoff record | open/bind ref/record gap | 不mint Artifact ref/version/lineage。 |
| `ProvenanceCompletenessGuard` | provenance binding验证 | pure guard | check required sources/binding | 不从adapter availability推complete。 |
| `ApplicableGateGuard` | safe applicable-gate conclusion验证 | pure guard | evaluate local evaluation | 不从缺失/unknown fail open。 |

### 10.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory | 成员函数 | 状态 | 字段来源 |
|---|---|---|---|---|---|---|
| `ProvenanceBinding` | candidate/snapshot/execution/output关系 | ID、candidate/snapshot/execution/output、source bindings、state/reason/time | `bind` | verify/mark conflict | `ProvenanceLifecycle` | loaded local truth + safe external refs。 |
| `GateEvaluation` | owner authority下的本地gate评估 | ID、candidate、applicable set ref、conclusions、state/reason/supersede/time | `open` | record/close/supersede | `GateEvaluationLifecycle` | authority/evidence safe refs。 |
| `EligibilityDecision` | image qualification decision | ID、candidate/provenance/gate refs、state/reason/supersede/time | `decide` | evaluate/supersede/permits supply | `EligibilityLifecycle` | loaded local qualification truth。 |
| `ArtifactHandoffRecord` | Artifact contract/gap观察 | ID、candidate/eligibility、optional artifact ref/gap/state/reason/time | `open` | bind/record gap | `ArtifactHandoffLifecycle` | local refs + future safe Artifact input。 |
| `ProvenanceCompletenessGuard` | source链完整性 | required roles / output rule | `strict` | check | `SafeDisposition` | local invariant。 |
| `ApplicableGateGuard` | applicable gate保守评估 | gate authority ref | `from_authority` | evaluate | `SafeDisposition` | formal authority ref / safe conclusions。 |

#### 10.3 Qualification shared helper carrier

```rust
/// Required role of a provenance source; this is a structure category, not an evidence inventory.
pub enum ProvenanceSourceRole {
    /// The complete local build input snapshot.
    InputSnapshot,
    /// The body-free external build execution identity.
    Execution,
    /// The verified immutable output identity.
    OutputIdentity,
    /// An optional body-free mapping source that explains the variant derivation.
    MappingSource,
    /// An optional component/seed/base reference needed to explain a declared input binding.
    AssemblySource,
}

/// One provenance-source binding from a required role to a local or external safe ref.
pub struct ProvenanceSourceBinding {
    /// Structural role served by this source.
    pub role: ProvenanceSourceRole,
    /// Local snapshot/candidate ref or body-free external source ref.
    pub source_ref: TraceSourceRef,
}

/// Ordered unique provenance sources, sorted by role then canonical ref.
pub struct ProvenanceSourceBindingSet {
    /// The set is deduplicated by role plus canonical source ref.
    pub entries: Vec<ProvenanceSourceBinding>,
}

/// One safe conclusion for an authority-owned applicable gate; it never exposes gate/evidence body.
pub struct GateConclusionBinding {
    /// Body-free gate conclusion ref whose kind must be EvidenceConclusion.
    pub conclusion_ref: EvidenceConclusionRef,
    /// Conservative conclusion state for this one applicable gate.
    pub disposition: SafeDisposition,
    /// Optional safe explanation for non-usable/negative result.
    pub reason: Option<SafeReason>,
}

/// Ordered unique safe gate conclusions, sorted by canonical conclusion ref.
pub struct GateConclusionBindingSet {
    /// Entries are unique by conclusion ref and never contain gate/evidence bodies.
    pub entries: Vec<GateConclusionBinding>,
}
```

| helper | 作用 | 约束 / 来源 |
|---|---|---|
| `ProvenanceSourceRole` | 固定本仓要求的来源结构角色 | 不是 BOM/scan/signature/gate kind列表；Q-MI-004不因此被关闭。 |
| `ProvenanceSourceBinding(Set)` | 用ref-only方式回链candidate输入/执行/输出 | `InputSnapshot`、`Execution`、`OutputIdentity`是strict guard的必要角色；附加source可解释但不替代必要角色。 |
| `GateConclusionBinding(Set)` | 在applicable set范围内保存safe结论 | 只接受EvidenceConclusion ref和safe disposition；不枚举policy、priority、evidence正文。 |

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ProvenanceSourceRole::InputSnapshot` | `The complete local build input snapshot.` | provenance 必要 snapshot角色 | local `BuildInputSnapshot` ref | provenance strict guard。 |
| `ProvenanceSourceRole::Execution` | `The body-free external build execution identity.` | provenance 必要 external execution角色 | safe `ExternalBuildExecutionRef` | provenance strict guard。 |
| `ProvenanceSourceRole::OutputIdentity` | `The verified immutable output identity.` | provenance 必要 output角色 | safe verified immutable ref | provenance strict guard；不得由 tag/digest猜测。 |
| `ProvenanceSourceRole::MappingSource` | `An optional body-free mapping source that explains the variant derivation.` | 解释性 mapping来源 | `MappingSourceSnapshot` / safe ref | trace/provenance explanation；不替代必要角色。 |
| `ProvenanceSourceRole::AssemblySource` | `An optional component/seed/base reference needed to explain a declared input binding.` | 解释性 assembly来源 | component/seed/base safe ref | trace/provenance explanation；不含 body。 |

#### 10.4 `ProvenanceBinding`

```rust
/// 一个candidate、complete snapshot、external execution与verified output之间的本仓provenance关系；不拥有外部证据或artifact truth。
pub struct ProvenanceBinding {
    /// application层生成的binding身份。
    pub binding_id: ImageLocalId,
    /// 已formed的candidate。
    pub candidate_ref: CandidateImageRef,
    /// candidate对应的complete input snapshot。
    pub snapshot_ref: BuildInputSnapshotRef,
    /// body-free external execution identity。
    pub execution_ref: ExternalBuildExecutionRef,
    /// 已验证immutable output content identity。
    pub output_identity_ref: VerifiedContentIdentityRef,
    /// 可回链的ref-onlysource bindings。
    pub source_bindings: ProvenanceSourceBindingSet,
    /// provenance完整性状态。
    pub lifecycle: ProvenanceLifecycle,
    /// incomplete/conflict解释。
    pub reason: Option<SafeReason>,
    /// 本仓binding记录时点。
    pub bound_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `binding_id` | `ImageLocalId` | binding主键 | application ID factory。 |
| `candidate_ref` | `CandidateImageRef` | qualification source | application flow加载并验证CandidateImage=Formed。 |
| `snapshot_ref` | `BuildInputSnapshotRef` | immutable input链 | loaded snapshot=Complete且与candidate attempt关联。 |
| `execution_ref` | `ExternalBuildExecutionRef` | external execution identity | safe outcome / adapter；不存execution body。 |
| `output_identity_ref` | `VerifiedContentIdentityRef` | output identitybinding | candidate formation basis或safe outcome；不由本仓生成digest。 |
| `source_bindings` | `ProvenanceSourceBindingSet` | 回链结构源 | `InputSnapshot`/`Execution`/`OutputIdentity`角色必须存在；ordered/dedup。 |
| `lifecycle` | `ProvenanceLifecycle` | completeness | bind初始由guard判断或Incomplete。 |
| `reason` | `Option<SafeReason>` | noncomplete解释 | Complete为None，否则Some。 |
| `bound_at` | `UtcTimestamp` | local record time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ProvenanceBindingRef` | 得binding ref | 无 | `ProvenanceBindingRef` | pure。 |
| `pub fn verify(&mut self, guard: &ProvenanceCompletenessGuard) -> SafeDisposition` | 根据pure guard更新complete/incomplete/conflict | provenance guard | `SafeDisposition` | 不读取evidence body；只改本binding lifecycle/reason。 |
| `pub fn supports_eligibility(&self) -> bool` | 判断可否作eligibility input | 无 | `bool` | 仅Complete。 |
| `pub fn mark_conflict(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 显式标记链路冲突 | safe reason | `Result<(), DomainError>` | Complete/Incomplete→Conflict；不更改candidate/snapshot。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn bind(binding_id: ImageLocalId, candidate_ref: CandidateImageRef, snapshot_ref: BuildInputSnapshotRef, execution_ref: ExternalBuildExecutionRef, output_identity_ref: VerifiedContentIdentityRef, source_bindings: ProvenanceSourceBindingSet, bound_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立provenance语境 | app ID、local/external safe refs、canonical bindings/time | `Result<ProvenanceBinding, DomainError>` | EvaluateCandidateEligibility；initial Incomplete直到guard验证。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| content identity必须回链 | candidate、snapshot、execution、output identity必须在future flow通过ref一致性检查；不能用tag或handwritten digest。 |
| complete不等gate pass | Complete仅允许gate/eligibility判断；不代表Artifact、entry或consumer成功。 |
| 不保存body | evidence、artifact、builder log、component/seed正文都不能进入source binding。 |

#### 10.5 `GateEvaluation`

```rust
/// 在一个authority-owned applicable gate set下保存本仓safe结论的评估记录；不定义任何外部gate inventory或policy正文。
pub struct GateEvaluation {
    /// application层生成的evaluation身份。
    pub evaluation_id: ImageLocalId,
    /// 被评估candidate。
    pub candidate_ref: CandidateImageRef,
    /// authority-owned applicable gate set的body-free ref。
    pub applicable_gate_set_ref: ApplicableGateSetRef,
    /// 本仓保存的safe conclusion bindings。
    pub conclusions: GateConclusionBindingSet,
    /// gate评估生命周期。
    pub lifecycle: GateEvaluationLifecycle,
    /// pending/failed/blocked/unknown解释。
    pub reason: Option<SafeReason>,
    /// 新评估替代旧语境时的ref。
    pub superseded_by: Option<GateEvaluationRef>,
    /// 最近一次本仓评估时点。
    pub evaluated_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `evaluation_id` | `ImageLocalId` | evaluation主键 | app ID factory。 |
| `candidate_ref` | `CandidateImageRef` | evaluation对象 | loaded formed candidate。 |
| `applicable_gate_set_ref` | `ApplicableGateSetRef` | gate applicability authority | owner=Governance、kind=ApplicableGateSet；Q-MI-004未闭口时只有pending/blocked安全输入，不能填inventory。 |
| `conclusions` | `GateConclusionBindingSet` | safe conclusion集合 | each EvidenceConclusion ref；不得含evidence正文。 |
| `lifecycle` | `GateEvaluationLifecycle` | local state | open初始Pending。 |
| `reason` | `Option<SafeReason>` | state解释 | Pending可None；Failed/Blocked/Unknown必须Some；Passed为None。 |
| `superseded_by` | `Option<GateEvaluationRef>` | 重评估history | Superseded不在enum中；本对象以记录replacement+后续flow保留历史，当前lifecycle留最后可读结论。 |
| `evaluated_at` | `UtcTimestamp` | local evaluation time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> GateEvaluationRef` | 得evaluation ref | 无 | `GateEvaluationRef` | pure。 |
| `pub fn record_conclusion(&mut self, binding: GateConclusionBinding) -> Result<(), DomainError>` | 添加safe gate conclusion | body-free binding | `Result<(), DomainError>` | Pending；按canonical ref去重；不创建gate truth。 |
| `pub fn close(&mut self, guard: &ApplicableGateGuard) -> SafeDisposition` | 由guard导出生命周期 | loaded guard | `SafeDisposition` | Pending→Passed/Failed/Blocked/Unknown；不改变authority/gate owner。 |
| `pub fn supersede(&mut self, replacement_ref: GateEvaluationRef, reason: SafeReason) -> Result<(), DomainError>` | 记录新评估语境 | non-self ref/reason | `Result<(), DomainError>` | 保留旧conclusions；不delete/overwrite。 |
| `pub fn passed(&self) -> bool` | 判断可否作eligibility input | 无 | `bool` | 仅Passed。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(evaluation_id: ImageLocalId, candidate_ref: CandidateImageRef, applicable_gate_set_ref: ApplicableGateSetRef, evaluated_at: UtcTimestamp) -> Result<Self, DomainError>` | 创建待评估context | app ID、candidate、authority ref/time | `Result<GateEvaluation, DomainError>` | EvaluateCandidateEligibility；initial Pending。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| applicable set外置 | 本仓不枚举BOM、scan、signature或priority，也不把Q-MI-004当已解决。 |
| missing/unknown不通过 | 无safe conclusion、authority缺失、conflict或unknown都不得进入Passed。 |
| passed不等availability | Gate passed只输入EligibilityDecision，不自动制造Artifact、entry、consumer或container事实。 |

#### 10.6 `EligibilityDecision`

```rust
/// 基于本仓candidate、provenance与gate evaluation的镜像域资格判断；它不拥有Artifact或Member Service acceptance truth。
pub struct EligibilityDecision {
    /// application层生成的decision身份。
    pub decision_id: ImageLocalId,
    /// 被判断的candidate。
    pub candidate_ref: CandidateImageRef,
    /// provenance binding引用。
    pub provenance_ref: ProvenanceBindingRef,
    /// applicable gate evaluation引用。
    pub gate_evaluation_ref: GateEvaluationRef,
    /// 本仓eligibility生命周期。
    pub lifecycle: EligibilityLifecycle,
    /// 结构化决定原因。
    pub reason: Option<SafeReason>,
    /// 新decision替代旧语境时的ref。
    pub superseded_by: Option<EligibilityDecisionRef>,
    /// 本仓决定时点。
    pub decided_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `decision_id` | `ImageLocalId` | decision主键 | app ID factory。 |
| `candidate_ref` | `CandidateImageRef` | image candidate | loaded CandidateImage=Formed。 |
| `provenance_ref` | `ProvenanceBindingRef` | source chain | loaded binding关联same candidate。 |
| `gate_evaluation_ref` | `GateEvaluationRef` | gate conclusion | loaded evaluation关联same candidate。 |
| `lifecycle` | `EligibilityLifecycle` | qualification state | decide初始Pending。 |
| `reason` | `Option<SafeReason>` | decision解释 | Eligible时None；Ineligible/Blocked必须Some；Pending可None。 |
| `superseded_by` | `Option<EligibilityDecisionRef>` | reevaluation chain | 不得self；新decision而非改写历史。 |
| `decided_at` | `UtcTimestamp` | local time | app clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> EligibilityDecisionRef` | 得eligibility ref | 无 | `EligibilityDecisionRef` | pure。 |
| `pub fn evaluate(&mut self, candidate: &CandidateImage, provenance: &ProvenanceBinding, gates: &GateEvaluation) -> Result<EligibilityLifecycle, DomainError>` | 根据loaded同candidate对象得到本仓资格 | candidate/provenance/evaluation | `Result<EligibilityLifecycle, DomainError>` | Pending→Eligible仅candidate Formed + provenance Complete + gates Passed；failed→Ineligible；缺/unknown→Blocked/Pending。 |
| `pub fn permits_supply(&self) -> bool` | 判断可否进入entry guard | 无 | `bool` | 仅Eligible；不创建entry。 |
| `pub fn supersede(&mut self, replacement_ref: EligibilityDecisionRef, reason: SafeReason) -> Result<(), DomainError>` | 追加re-evaluation history | replacement/reason | `Result<(), DomainError>` | 保留旧decision；不改Artifact/consumer状态。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn decide(decision_id: ImageLocalId, candidate_ref: CandidateImageRef, provenance_ref: ProvenanceBindingRef, gate_evaluation_ref: GateEvaluationRef, decided_at: UtcTimestamp) -> Result<Self, DomainError>` | 开启资格判断 | app ID、three local refs/time | `Result<EligibilityDecision, DomainError>` | EvaluateCandidateEligibility；初始Pending。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 同candidate一致性 | evaluate必须要求candidate/provenance/gate的local ref一致；不一致是Conflict/Blocked而非自行选择一个。 |
| image资格边界 | Eligible只允许SupplyEntry判断，不代表Artifact formalization、Member Service contract、container launch/health或consumer confirmation。 |
| 不可配置化绕过 | applicable gate / provenance要求由guard/authority决定，不能用config把Blocked改Eligible。 |

#### 10.7 `ArtifactHandoffRecord`

```rust
/// eligible candidate向Artifact owner交接的本仓边界记录；保存local observation与gap，不定义ArtifactVersion、lineage或owner acceptance truth。
pub struct ArtifactHandoffRecord {
    /// application层生成的handoff record身份。
    pub handoff_id: ImageLocalId,
    /// 本仓candidate。
    pub candidate_ref: CandidateImageRef,
    /// 本仓eligibility decision。
    pub eligibility_ref: EligibilityDecisionRef,
    /// 若正式schema/ref条件已验证，则保存body-free Artifact consumable ref。
    pub artifact_ref: Option<ArtifactConsumableRef>,
    /// `Accepted` 观察所依赖的正式 owner-side resolution；Pending/Gap 时必须为空。
    pub resolution_ref: Option<ContractResolutionRef>,
    /// 若合同未闭口或无safe conclusion，则保存本仓gap。
    pub gap_ref: Option<ContractGapRef>,
    /// conditional handoff state。
    pub lifecycle: ArtifactHandoffLifecycle,
    /// pending/gap/accepted的安全解释。
    pub reason: Option<SafeReason>,
    /// local record time。
    pub recorded_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `handoff_id` | `ImageLocalId` | handoff主键 | app ID factory。 |
| `candidate_ref` / `eligibility_ref` | typed local refs | image-side handoff context | flow验证same candidate且eligibility Eligible。 |
| `artifact_ref` | `Option<ArtifactConsumableRef>` | formal consumable ref | 仅future Artifact port取得已验证ref时Some；MI-UP-007当前不假设。 |
| `resolution_ref` | `Option<ContractResolutionRef>` | accepted 的正式关闭依据 | 仅 `Accepted` 时为Some，且由Artifact owner/正式合同解析面提供；不得由本仓配置、adapter ACK 或字符串补造。 |
| `gap_ref` | `Option<ContractGapRef>` | handoff缺口 | Pending/Gap时通常Some；由ReferenceDerived local truth记录。 |
| `lifecycle` | `ArtifactHandoffLifecycle` | local observation | open初始Pending。 |
| `reason` | `Option<SafeReason>` | safe explanation | Gap必须Some；Accepted不得把ref absence隐藏。 |
| `recorded_at` | `UtcTimestamp` | local observation time | app clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ArtifactHandoffRecordRef` | 得handoff ref | 无 | `ArtifactHandoffRecordRef` | pure。 |
| `pub fn record_gap(&mut self, gap_ref: ContractGapRef, reason: SafeReason) -> Result<(), DomainError>` | 显式记录unverifiable handoff | local gap ref/reason | `Result<(), DomainError>` | Pending/Gap→Gap；清空 `artifact_ref` 与 `resolution_ref`；不改变eligibility。 |
| `pub fn bind_artifact_ref(&mut self, artifact_ref: ArtifactConsumableRef, resolution_ref: ContractResolutionRef) -> Result<(), DomainError>` | 在formal contract可验证后记录accepted观察 | typed Artifact/resolution ref | `Result<(), DomainError>` | Pending/Gap→Accepted；同时持久化 `artifact_ref` 与 `resolution_ref`；需要Step 7/8 future port证明；不得由本仓mint。 |
| `pub fn is_accepted(&self) -> bool` | 判断是否有conditional owner-side conclusion | 无 | `bool` | 仅Accepted且artifact_ref=Some。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(handoff_id: ImageLocalId, candidate_ref: CandidateImageRef, eligibility_ref: EligibilityDecisionRef, recorded_at: UtcTimestamp) -> Result<Self, DomainError>` | 开启handoff context | app ID、local refs/time | `Result<ArtifactHandoffRecord, DomainError>` | RecordArtifactHandoff；初始Pending、无artifact/gap。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| owner truth分离 | 不定义ArtifactVersion、lineage、baseline、storage或artifact materialization；这些归L1-artifact。 |
| 当前positive lane被阻断 | MI-UP-007未关闭时，record只能Pending/Gap，禁止写Accepted或伪造Artifact ref。 |
| accepted 的最小证据形态 | `Accepted` 必须同时有 `artifact_ref=Some`、`resolution_ref=Some`、`gap_ref=None`；本仓只保存这些 body-free refs，不保存 Artifact owner body。 |
| handoff不回滚image truth | Artifact缺口不删除candidate/provenance/eligibility历史；只阻断受影响新lane。 |

#### 10.8 `ProvenanceCompletenessGuard`

```rust
/// 验证provenance必需结构链接和verified output binding的pure guard；不读取evidence、artifact或provider正文。
pub struct ProvenanceCompletenessGuard {
    /// 必须出现的provenance source roles。
    pub required_roles: Vec<ProvenanceSourceRole>,
    /// output identity必须遵循的owner/kind规则。
    pub output_identity_rule: RequiredExternalReferenceRule,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `required_roles` | `Vec<ProvenanceSourceRole>` | source结构要求 | 至少InputSnapshot/Execution/OutputIdentity；排序去重；不是evidence inventory。 |
| `output_identity_rule` | `RequiredExternalReferenceRule` | verified output形态 | kind=VerifiedContentIdentity；不由本仓生成digest。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check(&self, binding: &ProvenanceBinding) -> SafeDisposition` | 判断complete/incomplete/conflict | provenance binding | `SafeDisposition` | pure；关联断裂/重复/identity不符→Rejected/Blocked；不读external body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict() -> Self` | 建立当前最小严格guard | 无 | `ProvenanceCompletenessGuard` | qualification domain composition；无product/gate配置。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| adapter availability不等complete | adapter可用、HTTP response或registry presence不能替代input/execution/output关联。 |
| 缺身份不能猜 | 缺external verified content identity时只能Incomplete/Blocked/Conflict，不能由tag/字符串填补。 |
| no evidence body | guard只查看typed refs与safe conclusion结构。 |

#### 10.9 `ApplicableGateGuard`

```rust
/// 基于authority-owned applicable gate set评估本仓safe conclusions的pure guard；任何缺失或unknown都保持fail-closed。
pub struct ApplicableGateGuard {
    /// gate applicability的external authority引用。
    pub authority_ref: GateAuthorityRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `authority_ref` | `GateAuthorityRef` | 外部门禁applicability owner | owner=Governance、kind=GateAuthority；无authority时guard不能Passed。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn evaluate(&self, evaluation: &GateEvaluation) -> SafeDisposition` | 归纳safe conclusions | evaluation | `SafeDisposition` | pure；所有applicable conclusion VerifiedUsable才VerifiedUsable；Rejected→Rejected；gap/unavailable/unknown→Blocked/Unknown。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_authority(authority_ref: GateAuthorityRef) -> Result<Self, DomainError>` | 建立authority-driven guard | typed authority ref | `Result<ApplicableGateGuard, DomainError>` | qualification service加载正式owner safe context后；当前Q-MI-004可能阻断。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 无inventory补造 | 不定义BOM/scan/signature种类、priority或evidence body。 |
| unknown不可pass | Missing/Unknown/Unavailable/Gap永远不能映射为Passed/Eligible。 |
| authority不由config替换 | config不可产生或变更gate authority truth。 |

### 10.10 Qualification 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| provenance/gate/eligibility/handoff是否分域 | `pass` | 四个对象均有独立local state；Eligibility不隐含Artifact或consumer结果。 |
| digest/provenance是否保持安全边界 | `pass_with_pending` | 仅future safe `VerifiedContentIdentityRef`，无真实digest/report/artifact事实。 |
| gate inventory是否未私造 | `pass` | 仅ApplicableGateSet/GateAuthority ref；Q-MI-004保持开放。 |
| Artifact owner边界是否保留 | `pass` | `ArtifactHandoffRecord`是本仓local observation；MI-UP-007下只Pending/Gap。 |
| port/协议/flow是否后置 | `pass` | evidence/Artifact port、DTO、transaction/error映射留Step 7~12。 |

## 11. `domain::supply` / `guards`：SupplyEntry 对象契约

### 11.1 模块 capability 与对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 提议并追加本地 availability 变化 | variant、eligible candidate、既有 local entry/history、operation metadata | `AvailabilityTransition` | proposed / committed / rejected / superseded；只追加 history | 不读取 registry/container/consumer live state | availability repository / UoW、Publish/Transition/Rollback flow。 |
| 提供 immutable pinned image entry | eligible decision、complete provenance、immutable image ref、transition guard | `InstantiableEntry` | unavailable / available / superseded / retired | consumer 仅经 ref/runtime/adapter seam 消费 | supply repository / Member Service seam / Resolve query。 |
| 显式记录 consumer 侧未闭口条件 | entry（可选）、consumer contract/ref/confirmation 的缺失或不一致 | `ConsumerHandoffGap` | open / conditional resolved / stale | `L2-member-service` owner truth 外置 | consumer supply port / reconciliation flow。 |
| 验证 pin 与 availability history | loaded local entry/eligibility/provenance/history | `SafeDisposition` | pure guard，无 I/O、无历史写入 | 不将 `latest`、registry presence、launch/health 作为输入 | Step 7 repository/consumer port；Step 9 supply flow。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `AvailabilityTransition` | 本仓 availability history | append-only domain history record | propose / commit / reject / supersede | 不代表 registry published、container lifecycle、consumer confirmation。 |
| `InstantiableEntry` | 可交给下游查询的 pinned entry | local supply truth | create / publish / supersede / retire / pin check | 不创建 container，不宣称 launch、health、session 或 overall readiness。 |
| `ConsumerHandoffGap` | Member Service boundary缺口 | local boundary gap record | open / conditional resolve / stale | 不保存 Member Service manifest、host、container 或 confirmation body。 |
| `EntryPinGuard` | entry 前置验证 | pure policy / guard | check immutable image、eligibility与provenance | 不读取 consumer state 或放宽 immutable pin。 |
| `AvailabilityTransitionGuard` | transition/history合法性验证 | pure policy / guard | check action、当前 history、rollback target | 不删除、覆盖或反向修复旧 history。 |

### 11.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `AvailabilityTransition` | 追加一条 local supply action 语境 | ID、variant、action、candidate/prior/resulting entry refs、状态、reason、history pointer、time | `propose` | commit/reject/supersede | `AvailabilityTransitionLifecycle` | loaded local refs、application ID/clock、guard结果。 |
| `InstantiableEntry` | 固化可查询的 immutable entry | ID、variant/candidate/eligibility/provenance/image refs、状态、transition/history/time | `create` | publish/supersede/retire/is_pinned | `InstantiableEntryLifecycle` | loaded local qualification truth、safe immutable image ref、application ID/clock。 |
| `ConsumerHandoffGap` | 指定 consumer lane 的 gap | ID、optional entry/contract、gap kind、state、resolution/confirmation、reason、time | `open` | resolve/mark_stale/blocks_consumer | `ConsumerHandoffGapLifecycle` | Member Service body-free ref或当前缺口、application ID/clock。 |
| `EntryPinGuard` | 判断 entry 能否成为 local available supply | permitted image owners、required kind、eligibility/provenance requirements | `strict` | check_entry | `SafeDisposition` | fixed local invariant；不从 config 放宽。 |
| `AvailabilityTransitionGuard` | 判断动作与历史是否可提交 | allowed action rule set | `strict` | check_transition | `SafeDisposition` | fixed append-only local semantics + loaded current facts。 |

#### 11.3 `AvailabilityTransition`

```rust
/// 一条 append-only 的本仓 availability history；它只记录镜像供给判断，不是部署或 consumer 生命周期事实。
pub struct AvailabilityTransition {
    /// 由 application 层生成的 transition 身份。
    pub transition_id: ImageLocalId,
    /// 本条变化作用的 image variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 本次 local availability 行为。
    pub transition_kind: AvailabilityTransitionKind,
    /// 本次行为关联的 candidate；retire 可为空，publish/replace 必须在 Step 9 读取时验证。
    pub candidate_ref: Option<CandidateImageRef>,
    /// 变化前的 local entry；首次 publish 可为空。
    pub prior_entry_ref: Option<InstantiableEntryRef>,
    /// 此变化形成或指向的 local entry；proposed 时可为空。
    pub resulting_entry_ref: Option<InstantiableEntryRef>,
    /// 本条 history 自身的生命周期。
    pub lifecycle: AvailabilityTransitionLifecycle,
    /// 拒绝、阻断或 supersede 的安全解释。
    pub reason: Option<SafeReason>,
    /// 替代当前历史语境的新 transition；永不删除旧记录。
    pub superseded_by: Option<AvailabilityTransitionRef>,
    /// 本仓提出此变化的时点。
    pub proposed_at: UtcTimestamp,
    /// 本地 history 被提交时的时点；未提交时为空。
    pub committed_at: Option<UtcTimestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `transition_id` | `ImageLocalId` | history主键 | application ID factory；repository 只可重建。 |
| `variant_ref` | `ImageVariantDefinitionRef` | supply scope | command/job 加载的 local variant；不得以 Role、tag 或 consumer key代替。 |
| `transition_kind` | `AvailabilityTransitionKind` | publish/replace/rollback/retire 语义 | Command 或 bounded job 明确提供；不来自 registry 观察或 consumer callback。 |
| `candidate_ref` | `Option<CandidateImageRef>` | entry源 candidate | publish/replace 由 Step 9 加载并验证 formed/eligible chain；retire 可为空。 |
| `prior_entry_ref` / `resulting_entry_ref` | `Option<InstantiableEntryRef>` | history前后关系 | 从 loaded local entry / generated entry ref 提供；不得指向 consumer/container。 |
| `lifecycle` | `AvailabilityTransitionLifecycle` | transition state | `propose` 初始 `Proposed`。 |
| `reason` | `Option<SafeReason>` | non-committed / superseded解释 | `Rejected` / `Superseded` 必须为 `Some`；`Committed` 必须为 `None`。 |
| `superseded_by` | `Option<AvailabilityTransitionRef>` | append-only替代链 | 仅 `Superseded` 时为 `Some`，不得 self reference。 |
| `proposed_at` / `committed_at` | `UtcTimestamp` / `Option<UtcTimestamp>` | local temporal context | application clock；`Committed` 必须有 `committed_at`，其余必须为空。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> AvailabilityTransitionRef` | 获得 typed transition ref | 无 | `AvailabilityTransitionRef` | pure；kind 必须为 `AvailabilityTransition`。 |
| `pub fn commit(&mut self, resulting_entry_ref: Option<InstantiableEntryRef>, facts: &CurrentAvailabilityFacts, guard: &AvailabilityTransitionGuard, committed_at: UtcTimestamp) -> Result<(), DomainError>` | 在 strict guard 后提交 local history | entry ref、loaded current facts、pure guard、clock time | `Result<(), DomainError>` | 仅 `Proposed -> Committed`；不创建 entry、不触发 consumer 或 registry side effect。 |
| `pub fn reject(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 记录不能成立的 transition | safe reason | `Result<(), DomainError>` | 仅 `Proposed -> Rejected`；不改变 prior entry。 |
| `pub fn supersede(&mut self, replacement_ref: AvailabilityTransitionRef, reason: SafeReason) -> Result<(), DomainError>` | 用新 transition 语境保留旧 history | non-self replacement/reason | `Result<(), DomainError>` | `Proposed` / `Committed` / `Rejected -> Superseded`；不修改已有 committed_at。 |
| `pub fn is_committed(&self) -> bool` | 判断本条是否为 local committed history | 无 | `bool` | 仅 `Committed` 返回 true；不推导 entry currentness。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn propose(transition_id: ImageLocalId, variant_ref: ImageVariantDefinitionRef, transition_kind: AvailabilityTransitionKind, candidate_ref: Option<CandidateImageRef>, prior_entry_ref: Option<InstantiableEntryRef>, proposed_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立待验证的 history context | app ID、local refs、action、clock | `Result<AvailabilityTransition, DomainError>` | Publish/Transition/Rollback/Retire flow；初始不含 resulting entry / committed time。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| history append-only | rollback、replacement与retire必须创建新 `AvailabilityTransition`；不得原地改写此前已提交 action 或删除历史。 |
| committed 仅是本仓事实 | `Committed` 不表示 external registry publication、Artifact handoff、Member Service receive、container launch 或 health。 |
| 依据必须可回链 | guard 失败、缺 pin、缺 eligibility、stale/unknown current facts 时只能 reject/blocked，不能以 `latest`、tag、adapter ACK 或 consumer observed state 提交。 |

#### 11.4 `InstantiableEntry`

```rust
/// 面向下游查询的本仓 immutable pinned image entry；它只代表本地 supply 可用性，绝不代表实例已启动或健康。
pub struct InstantiableEntry {
    /// 由 application 层生成的 entry 身份。
    pub entry_id: ImageLocalId,
    /// 此 entry 所属的 image variant。
    pub variant_ref: ImageVariantDefinitionRef,
    /// 可回链的 formed candidate。
    pub candidate_ref: CandidateImageRef,
    /// 允许供给判断的本仓 eligibility decision。
    pub eligibility_ref: EligibilityDecisionRef,
    /// 可回链的 complete provenance binding。
    pub provenance_ref: ProvenanceBindingRef,
    /// 不可变 image identity；禁止 mutable selector。
    pub image_ref: ImmutableImageRef,
    /// 记录本地 available / retired 等状态。
    pub lifecycle: InstantiableEntryLifecycle,
    /// 提交 availability history 后关联的 transition。
    pub availability_transition_ref: Option<AvailabilityTransitionRef>,
    /// 被新 entry 替代时的后继 entry。
    pub superseded_by: Option<InstantiableEntryRef>,
    /// retire 或异常状态的安全解释。
    pub reason: Option<SafeReason>,
    /// 本仓创建 entry 候选的时点。
    pub created_at: UtcTimestamp,
    /// local supply 成立时点；仅 Available 时有值。
    pub published_at: Option<UtcTimestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `entry_id` | `ImageLocalId` | entry主键 | application ID factory。 |
| `variant_ref` / `candidate_ref` / `eligibility_ref` / `provenance_ref` | typed local refs | entry完整 local chain | application flow 加载并验证同一 candidate/variant 与 `Eligible` / `Complete`；不得由 consumer提供。 |
| `image_ref` | `ImmutableImageRef` | 下游可消费的 immutable image identity | 来自 formed candidate的 validated ref；Builder/Registry owner、`ImmutableImage` kind，禁止 `latest` / mutable tag。 |
| `lifecycle` | `InstantiableEntryLifecycle` | local supply state | `create` 初始 `Unavailable`。 |
| `availability_transition_ref` | `Option<AvailabilityTransitionRef>` | 已提交 availability history 关联 | 仅 `Available` / `Retired` / `Superseded` 的历史语境可有；`publish` 写入。 |
| `superseded_by` | `Option<InstantiableEntryRef>` | 新 entry替代链 | 仅 `Superseded` 时为 `Some`，不得 self reference。 |
| `reason` | `Option<SafeReason>` | unavailable/retired/superseded解释 | `Available` 必须为 `None`；其他 state 按状态保留安全解释。 |
| `created_at` / `published_at` | `UtcTimestamp` / `Option<UtcTimestamp>` | local record/publish time | application clock；`Available` 必须有 `published_at`。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> InstantiableEntryRef` | 获得 typed entry ref | 无 | `InstantiableEntryRef` | pure。 |
| `pub fn publish(&mut self, transition_ref: AvailabilityTransitionRef, eligibility: &EligibilityDecision, provenance: &ProvenanceBinding, guard: &EntryPinGuard, published_at: UtcTimestamp) -> Result<(), DomainError>` | 将已验证候选变成 local available entry | local transition/decision/provenance、pure guard、clock | `Result<(), DomainError>` | 仅 `Unavailable -> Available`；不调用 Member Service、不创建容器。 |
| `pub fn supersede(&mut self, replacement_ref: InstantiableEntryRef, transition_ref: AvailabilityTransitionRef, reason: SafeReason) -> Result<(), DomainError>` | 保留旧 entry并指向新 entry | non-self refs、reason | `Result<(), DomainError>` | `Available -> Superseded`；不得清除 image/provenance链。 |
| `pub fn retire(&mut self, transition_ref: AvailabilityTransitionRef, reason: SafeReason) -> Result<(), DomainError>` | 退出 local supply但保留历史 | committed transition / reason | `Result<(), DomainError>` | `Unavailable` / `Available -> Retired`；不删除对象。 |
| `pub fn is_immutable_pinned(&self) -> bool` | 判断 image ref 是否仍符合 immutable形式 | 无 | `bool` | pure；不联系 registry查询。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(entry_id: ImageLocalId, variant_ref: ImageVariantDefinitionRef, candidate_ref: CandidateImageRef, eligibility_ref: EligibilityDecisionRef, provenance_ref: ProvenanceBindingRef, image_ref: ImmutableImageRef, created_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立 entry候选 | app ID、validated refs、immutable image、clock | `Result<InstantiableEntry, DomainError>` | PublishInstantiableEntry；初始 `Unavailable`，必须经 guard/transition 才可 `Available`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| entry 不拥有 consumer truth | entry不能保存或推断 Member Service instance、host、container、runtime session、launch、health 或 confirmation。 |
| immutable pin 强制 | 所有 `Available` entry 必须有固定 immutable image ref、`Eligible` decision和 `Complete` provenance；不能以 registry presence或 tag代替。 |
| 退役/回滚不复活旧对象 | rollback通过新的 transition 和新/既有仍验证的 entry 形成；`Retired` / `Superseded` 不得原地设回 `Available`。 |

#### 11.5 `ConsumerHandoffGap`

```rust
/// 向 Member Service 提供 pinned entry 时的本仓边界缺口记录；不拥有 consumer contract、manifest、container 或 confirmation truth。
pub struct ConsumerHandoffGap {
    /// 由 application 层生成的 gap 身份。
    pub gap_id: ImageLocalId,
    /// 若已有本地 entry，则记录其安全 ref；没有 entry时仍可表达 contract gap。
    pub entry_ref: Option<InstantiableEntryRef>,
    /// Member Service 的 body-free consumer contract ref；MI-UP-001 未闭口时允许为空。
    pub consumer_contract_ref: Option<ConsumerContractRef>,
    /// 当前缺口针对的最小 consumer boundary 类别。
    pub gap_kind: ConsumerHandoffGapKind,
    /// 本仓 gap 生命周期。
    pub lifecycle: ConsumerHandoffGapLifecycle,
    /// `Resolved` 所依赖的正式 contract resolution。
    pub resolution_ref: Option<ContractResolutionRef>,
    /// `Resolved` 所依赖的 body-free consumer confirmation；不等 container/runtime health。
    pub confirmation_ref: Option<ConsumerConfirmationRef>,
    /// open/stale/resolution失败的安全解释。
    pub reason: Option<SafeReason>,
    /// 本仓观察到该 gap 的时点。
    pub observed_at: UtcTimestamp,
}

/// Classifies the narrow consumer handoff condition that is missing or unverifiable.
pub enum ConsumerHandoffGapKind {
    /// The exact consumer-side schema or manifest shape is not closed.
    Schema,
    /// The supplied entry reference cannot be verified under the consumer contract.
    EntryReference,
    /// The consumer requires a qualification condition whose owner-side contract is pending.
    Qualification,
    /// A formal consumer confirmation is required but not safely available.
    Confirmation,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gap_id` | `ImageLocalId` | consumer gap主键 | application ID factory。 |
| `entry_ref` | `Option<InstantiableEntryRef>` | local entry关联 | loaded local entry；无 entry时仍可记录 schema/contract gap。 |
| `consumer_contract_ref` | `Option<ConsumerContractRef>` | consumer owner语境 | 仅未来 Member Service approved ref；`MI-UP-001` 当前可为空，不能猜 contract identity。 |
| `gap_kind` | `ConsumerHandoffGapKind` | gap 粒度 | command/query/reconcile 对具体缺口分类；不承载 consumer body。 |
| `lifecycle` | `ConsumerHandoffGapLifecycle` | gap state | `open` 初始 `Open`。 |
| `resolution_ref` / `confirmation_ref` | optional typed external refs | conditional close evidence | 仅 `Resolved` 时均为 `Some`；当前不生成实例。 |
| `reason` | `Option<SafeReason>` | gap/stale解释 | `Open` / `Stale` 必须为 `Some`；resolved不以 reason伪装 confirmation。 |
| `observed_at` | `UtcTimestamp` | local observation time | application clock，不是下游 runtime observed time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ConsumerHandoffGapRef` | 获得 typed gap ref | 无 | `ConsumerHandoffGapRef` | pure。 |
| `pub fn resolve(&mut self, consumer_contract_ref: ConsumerContractRef, resolution_ref: ContractResolutionRef, confirmation_ref: ConsumerConfirmationRef) -> Result<(), DomainError>` | 在 future formal contract 关闭后记录本仓 conditional resolve | three body-free owner refs | `Result<(), DomainError>` | 仅 `Open -> Resolved`；不读取 confirmation body、不推导 launch/health。 |
| `pub fn mark_stale(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 使旧 gap不再判断新 handoff | safe reason | `Result<(), DomainError>` | `Open -> Stale`；新判断必须创建新 gap context。 |
| `pub fn blocks_consumer_handoff(&self) -> bool` | 判断当前是否阻断 consumer lane | 无 | `bool` | `Open` / `Stale` 返回 true；不影响 local entry availability。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(gap_id: ImageLocalId, entry_ref: Option<InstantiableEntryRef>, consumer_contract_ref: Option<ConsumerContractRef>, gap_kind: ConsumerHandoffGapKind, reason: SafeReason, observed_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立可见的 consumer handoff gap | app ID、optional local/external refs、kind/reason/time | `Result<ConsumerHandoffGap, DomainError>` | ResolveInstantiableEntry / reconciliation；`MI-UP-001` 未闭口时的唯一正当路径。 |

| enum 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ConsumerHandoffGapKind::Schema` | `The exact consumer-side schema or manifest shape is not closed.` | 记录 exact manifest/schema缺口 | `MI-UP-001` / safe boundary validation | `ConsumerHandoffGap::open`；不得转为 consumer success。 |
| `ConsumerHandoffGapKind::EntryReference` | `The supplied entry reference cannot be verified under the consumer contract.` | 记录 pinned entry ref验证缺口 | future consumer ref validator | `ConsumerHandoffGap::open` / consumer query gap。 |
| `ConsumerHandoffGapKind::Qualification` | `The consumer requires a qualification condition whose owner-side contract is pending.` | 记录 consumer-specific资格边界缺口 | future formal consumer condition | gap/reopen；不修改 local eligibility。 |
| `ConsumerHandoffGapKind::Confirmation` | `A formal consumer confirmation is required but not safely available.` | 记录 confirmation缺口 | future Member Service safe boundary | gap/reopen；不等 launch/health。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 当前 positive path 不可声称 | `MI-UP-001` 未关闭时，factory只可 `Open` 或后续 `Stale`，不得调用/写入 `Resolved`、contract/ref/confirmation实例。 |
| gap 不回写 local supply | consumer缺口只冻结 `DecisionLane::ConsumerHandoff`；不得将既有 `InstantiableEntry::Available` 改为 unavailable，也不得删除 history。 |
| resolved 不等运行成功 | 即使未来有 safe confirmation，它也仅说明 contract-specified consumer handoff；不得升级为 process/container/session/health readiness。 |

#### 11.6 `EntryPinGuard`

```rust
/// 验证本仓 entry 的 immutable image、eligibility 与 provenance 前置；不读取 consumer、container 或 registry live state。
pub struct EntryPinGuard {
    /// 允许提供 immutable image identity 的外部 owner；当前只限 Builder 或 Registry 语义。
    pub permitted_image_owners: Vec<ExternalOwnerKind>,
    /// entry image ref 必须具有的 external kind。
    pub required_image_kind: ExternalReferenceKind,
    /// local eligibility 前置。
    pub required_eligibility: EligibilityLifecycle,
    /// local provenance 前置。
    pub required_provenance: ProvenanceLifecycle,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `permitted_image_owners` | `Vec<ExternalOwnerKind>` | 允许 immutable image owner集合 | 固定排序/去重为 Builder、Registry；不是 provider产品选择。 |
| `required_image_kind` | `ExternalReferenceKind` | image ref 结构要求 | 固定 `ImmutableImage`；不得允许 `BuildExecution`、tag或 content body。 |
| `required_eligibility` | `EligibilityLifecycle` | entry前置资格 | 固定 `Eligible`；config不得放宽。 |
| `required_provenance` | `ProvenanceLifecycle` | entry前置来源链 | 固定 `Complete`；缺失/冲突不通过。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check_entry(&self, entry: &InstantiableEntry, eligibility: &EligibilityDecision, provenance: &ProvenanceBinding) -> SafeDisposition` | 验证entry可否进入 local supply | loaded entry/qualification objects | `SafeDisposition` | pure；owner/kind、pin、same candidate与前置状态不符即 `Rejected` / `Blocked`。 |
| `pub fn accepts_image_ref(&self, image_ref: &ImmutableImageRef) -> bool` | 验证 immutable image ref结构 | typed image ref | `bool` | pure；不查询 registry。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict() -> Self` | 建立固定 fail-closed entry guard | 无 | `EntryPinGuard` | supply domain composition；不读 raw config或owner body。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| mutable selector 一律拒绝 | `latest`、可变 tag、registry presence、handwritten digest或缺 verification source都不得通过。 |
| local supply前置不可省略 | `Eligible` 和 `Complete` 必须来自相同 candidate链；不能用 Artifact/consumer confirmation或adapter availability替代。 |
| pure guard | 不写 entry/transition/history，不做 external I/O，不启动 consumer操作。 |

#### 11.7 `AvailabilityTransitionGuard`

```rust
/// 验证 local availability action 与 append-only history 的 pure guard；不拥有 deployment、registry 或 consumer truth。
pub struct AvailabilityTransitionGuard {
    /// 允许的 local supply actions。
    pub allowed_actions: AvailabilityTransitionRuleSet,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `allowed_actions` | `AvailabilityTransitionRuleSet` | local action白名单 | `Publish`、`Replace`、`Rollback`、`Retire` 均按各自 history前置检查；固定 domain rule，非 config feature flag。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check_transition(&self, transition: &AvailabilityTransition, facts: &CurrentAvailabilityFacts) -> SafeDisposition` | 验证 action/history/current ref 前置 | proposed transition、loaded local facts | `SafeDisposition` | pure；rollback必须有仍验证的target，replace/retire需符合当前entry关系。 |
| `pub fn permits(&self, kind: AvailabilityTransitionKind) -> bool` | 判断当前 local rules 是否含该 action | action kind | `bool` | pure；不表示 action已提交。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict() -> Self` | 建立 append-only local supply guard | 无 | `AvailabilityTransitionGuard` | supply domain composition；没有删除/覆盖模式。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| rollback 是新 history | rollback不得修改或复活旧 transition/entry；只能经新 `AvailabilityTransition` 指向已验证 local target。 |
| downstream state 无权提交 | consumer confirmation、container state、registry health、scheduler tick和adapter ACK不能作为 `Committed` 的充分条件。 |
| 不修复相邻 owner truth | guard只判断 loaded local refs；不能创建 Artifact、Member Service或Registry事实。 |

### 11.8 SupplyEntry 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| availability/entry/consumer gap是否独立 | `pass` | transition、entry与consumer gap各有独立生命周期；local availability不升级为consumer或container事实。 |
| rollback/history是否 append-only | `pass` | replacement、rollback、retire均要求新 transition / new context；持久化顺序留 Step 9/11。 |
| pin/eligibility/provenance是否完整前置 | `pass` | `EntryPinGuard` fail-closed；Builder/Registry实际 resolver和repository读取面留 Step 7。 |
| Member Service pending是否未伪关闭 | `pass_with_pending` | `MI-UP-001` 下仅 `ConsumerHandoffGap::Open/Stale`；无 manifest/confirmation/launch/health事实。 |
| port、transaction、query DTO 是否未抢写 | `pass` | supply repository、consumer port、command/query schema、UoW顺序与error mapping留 Step 7~13。 |

## 12. `domain::reference` / `guards` / `history`：ReferenceDerived 对象契约

### 12.1 模块 capability 与对象映射

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 捕获外部 body-free reference 的当前安全观察 | typed external ref、safe conclusion、local capture time | `ExternalReferenceSnapshot` | valid / stale / conflict / unavailable；可追加新 snapshot | owner body始终外置 | source/ref repository port、refresh/reconcile flow。 |
| 对 exact contract / authority / ref 缺口建模 | seam kind、owner、affected lane、safe reason | `ContractGap` | open / blocked / conditional resolved / expired | 不自行关闭上游/兄弟合同 | resolution/source port、gap query、reopen flow。 |
| 表达 projection freshness 和只读 rebuild | committed truth watermark、gap、local time | `ProjectionFreshness`、`ImageDerivedReadModel` | fresh / stale / rebuilding / unavailable | projection不成为truth write source | projection repository / query / rebuild flow。 |
| 追加 explain-only trace | local subject、body-free local/external sources、metadata/reason | `ImageTraceRecord` | append-only，无 domain state transition | 不保留 raw log/report/evidence body | trace repository / audit / read flow。 |
| 强制 ref validity 与 projection writeback边界 | snapshots、use context、truth watermark | `SafeDisposition` | pure guard，无 I/O | fake/cache/read model不反写 definition/build/qualification/supply | Step 7 ports、Step 9 maintenance flow。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ExternalReferenceSnapshot` | 外部 ref 的 local shadow | body-free snapshot truth | capture / invalidate / usable-for | 不复制 owner body，不成为 owner truth。 |
| `ContractGap` | 跨 owner 缺口 | local boundary record | open / block / conditional resolve / expire | 不当作 global readiness，也不静默删除。 |
| `ProjectionFreshness` | read model 的可读/滞后语义 | local projection marker | start / stale / rebuild / fresh / unavailable | 不修改 core truth。 |
| `ImageTraceRecord` | 阶段来源解释链 | append-only trace record | record / links | 不含 raw body，非第二 truth。 |
| `ImageDerivedReadModel` | 安全的可重建查询聚合 | read-only derived model | rebuild / inspect freshness / unavailable | 不调用 domain mutation / external lookup。 |
| `ReferenceValidityGuard` | 单个 snapshot 的 use-boundary校验 | pure guard | check | 不把 cache/fake/old snapshot 变成positive input。 |
| `ProjectionReadOnlyGuard` | rebuild source 和 no-writeback校验 | pure guard | allow rebuild / reject writeback | 不让 maintenance 修复 core truth。 |

### 12.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `ExternalReferenceSnapshot` | 固定 body-free ref observation | ID、source ref、declared use/lane、safe conclusion、validity/reason/time、supersede | `capture` | usable_for/invalidate/supersede | `ReferenceValidity` | approved adapter safe output、application ID/clock。 |
| `ContractGap` | 使受影响 positive lane 可见地 fail closed | ID、seam/owner/reason/lane/state/resolution/expiry/time | `open` | block/resolve/expire/affects | `ContractGapLifecycle` | local boundary diagnosis、formal resolution ref、application ID/clock。 |
| `ProjectionFreshness` | 记录 view 与 committed truth的关系 | ID、projection kind、watermark,state,gap,rebuilt time | `start` | mark stale/begin rebuild/mark fresh/mark unavailable | `ProjectionFreshnessLifecycle` | committed local truth / projection builder、application ID/clock。 |
| `ImageTraceRecord` | append safe causation record | ID、subject/sources、correlation/causation、reason,time | `record` | links/has_source | none | domain/application assembled typed refs + metadata。 |
| `ImageDerivedReadModel` | 生成只读阶段摘要 | ID、variant(optional)、stage summary、entry/gap summary、freshness/watermark | `from_truth` | rebuild/is_readable/mark unavailable | `ProjectionFreshnessLifecycle` via freshness | committed local truth + pure builder output；不从external body。 |
| `ReferenceValidityGuard` | 验证 owner/kind/revision/validity/use | expected rules、allowed lanes | `from_rules` | check | `SafeDisposition` | fixed local boundary invariants。 |
| `ProjectionReadOnlyGuard` | 验证 rebuild输入与禁止writeback | permitted projection kinds | `strict` | allow_rebuild/reject writeback | `SafeDisposition` | fixed local read-only policy。 |

#### 12.3 ReferenceDerived shared helper carrier

```rust
/// The declared local use of a body-free external snapshot; it does not identify an external API or transport.
pub enum ReferenceUseKind {
    /// Use as a DefinitionAssembly mapping source input.
    DefinitionMapping,
    /// Use as a static component, seed, or base assembly input.
    AssemblyInput,
    /// Use as a BuildCandidate handoff, execution, output, or outcome input.
    BuildOutcome,
    /// Use as a Qualification provenance, gate, or Artifact-handoff input.
    QualificationInput,
    /// Use as a SupplyEntry consumer-boundary input.
    ConsumerSupply,
    /// Use only to explain a query, trace, or derived projection.
    ReadOnlyExplanation,
}

/// A safe entry summary; it exposes a local pinned entry ref or a local consumer gap without a consumer manifest body.
pub struct SafeEntrySummary {
    /// Available local entry when the supply lane is locally available.
    pub entry_ref: Option<InstantiableEntryRef>,
    /// Consumer-boundary gap that must remain visible to a downstream query.
    pub consumer_gap_ref: Option<ConsumerHandoffGapRef>,
    /// Safe local availability disposition, never container readiness.
    pub disposition: SafeDisposition,
}

/// A read-only input assembled from committed local truth; it cannot be constructed from a projection/cache/fake alone.
pub struct CommittedImageTruthSnapshot {
    /// Optional variant scope of the assembled view.
    pub variant_ref: Option<ImageVariantDefinitionRef>,
    /// Current safe stage summaries from committed local records.
    pub stage_summaries: SafeStageSummarySet,
    /// Optional local supply/consumer-boundary summary.
    pub entry_summary: Option<SafeEntrySummary>,
    /// Watermark proving which committed local subjects were used.
    pub watermark: TruthWatermark,
}
```

| helper / enum | 作用 | 约束 / 来源 |
|---|---|---|
| `ReferenceUseKind` | 将 snapshot的有效性限定到一个本仓判断用途 | 不表示 provider route/topic，不允许一个 `Valid` snapshot 跨用途自动提升为可用。 |
| `SafeEntrySummary` | 在 read model 中保留 local entry/gap 区分 | `entry_ref` / `consumer_gap_ref` 由 committed local supply/reference truth提供；不含 manifest、host或health。 |
| `CommittedImageTruthSnapshot` | 使 rebuild输入可检查而非由 projection反推 | application/infra projection builder 读取 committed local truth后创建；无外部正文、无 fake private state。 |

| enum 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ReferenceUseKind::DefinitionMapping` | `Use as a DefinitionAssembly mapping source input.` | mapping source受限用途 | definition application flow | `ReferenceValidityGuard::check`；不得直接形成resolved definition。 |
| `ReferenceUseKind::AssemblyInput` | `Use as a static component, seed, or base assembly input.` | static assembly受限用途 | baseline/revision flow | assembly guard；禁止 live state。 |
| `ReferenceUseKind::BuildOutcome` | `Use as a BuildCandidate handoff, execution, output, or outcome input.` | build seam受限用途 | build flow / safe adapter output | build guard；不得由ACK构成candidate。 |
| `ReferenceUseKind::QualificationInput` | `Use as a Qualification provenance, gate, or Artifact-handoff input.` | qualification seam受限用途 | qualification flow | provenance/gate/handoff guard；不得自造Artifact truth。 |
| `ReferenceUseKind::ConsumerSupply` | `Use as a SupplyEntry consumer-boundary input.` | Member Service边界受限用途 | supply/reconcile/query flow | consumer gap / future safe handoff；不代表launch/health。 |
| `ReferenceUseKind::ReadOnlyExplanation` | `Use only to explain a query, trace, or derived projection.` | 解释性用途 | query/projection builder | read/trace；永不作为新 positive decision input。 |

#### 12.4 `ExternalReferenceSnapshot`

```rust
/// 一个外部 owner ref 的 body-free local snapshot；它只为已声明的 local use 保存安全结论，不能替代 source truth。
pub struct ExternalReferenceSnapshot {
    /// 由 application 层生成的 snapshot 身份。
    pub snapshot_id: ImageLocalId,
    /// 被观察的 external owner reference。
    pub source_ref: OpaqueReference,
    /// 本快照被允许支持的单一 local use。
    pub use_kind: ReferenceUseKind,
    /// approved seam 给出的 body-free safe conclusion。
    pub conclusion: SafeReferenceConclusion,
    /// 当前 ref validity。
    pub validity: ReferenceValidity,
    /// stale/conflict/unavailable解释。
    pub reason: Option<SafeReason>,
    /// 由新 snapshot替代时的ref。
    pub superseded_by: Option<ExternalReferenceSnapshotRef>,
    /// 本仓捕获时点。
    pub captured_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `snapshot_id` | `ImageLocalId` | snapshot主键 | application ID factory。 |
| `source_ref` | `OpaqueReference` | owner identity | Step 7 future source resolver/adapter safe output；不得含 body。 |
| `use_kind` | `ReferenceUseKind` | 限定适用场景 | application flow 明确选择；一个 snapshot不跨 lane自动复用。 |
| `conclusion` | `SafeReferenceConclusion` | local safety observation | approved adapter / owner safe result；`VerifiedUsable` 只用于此 `use_kind`。 |
| `validity` | `ReferenceValidity` | ref lifecycle | capture初始由 conclusion/guard 归纳。 |
| `reason` | `Option<SafeReason>` | non-valid解释 | `Valid` 必须为 `None`；其余必须为 `Some`。 |
| `superseded_by` | `Option<ExternalReferenceSnapshotRef>` | snapshot history | 只在创建新 snapshot context时写入；不得self。 |
| `captured_at` | `UtcTimestamp` | local capture time | application clock；不是 source modification / execution time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ExternalReferenceSnapshotRef` | 获得 typed snapshot ref | 无 | `ExternalReferenceSnapshotRef` | pure。 |
| `pub fn is_usable_for(&self, use_kind: ReferenceUseKind) -> bool` | 判断能否作指定 local input | declared use | `bool` | 仅 `Valid` 且 exact use kind；不查询 owner。 |
| `pub fn invalidate(&mut self, validity: ReferenceValidity, reason: SafeReason) -> Result<(), DomainError>` | 将旧snapshot显式变为stale/conflict/unavailable | non-Valid state/reason | `Result<(), DomainError>` | `Valid -> Stale/Conflict/Unavailable`；恢复必须新snapshot。 |
| `pub fn supersede(&mut self, replacement_ref: ExternalReferenceSnapshotRef, reason: SafeReason) -> Result<(), DomainError>` | 连接新snapshot语境 | non-self ref/reason | `Result<(), DomainError>` | 保留旧 conclusion；不改写 source ref/body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn capture(snapshot_id: ImageLocalId, source_ref: OpaqueReference, use_kind: ReferenceUseKind, conclusion: SafeReferenceConclusion, captured_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立一条 body-free snapshot | app ID、typed external ref、安全结论、clock | `Result<ExternalReferenceSnapshot, DomainError>` | RefreshExternalReferenceSnapshots / source intake；初始 validity 由结论映射，不能默认 `Valid`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| snapshot 永不成为 source truth | 不保存 RoleDefinition、component release、seed、build log、evidence、Artifact或Member Service正文。 |
| stale恢复走新 context | `Stale` / `Conflict` / `Unavailable` 不得原地回 `Valid`；必须新 capture + supersede。 |
| local use严格 | `ReadOnlyExplanation` snapshot永不进入definition/build/qualification/supply正向 guard。 |

#### 12.5 `ContractGap`

```rust
/// 一个跨 owner exact contract/ref/authority 缺口的本仓记录；它只冻结指定 decision lane，并保留正式关闭的引用入口。
pub struct ContractGap {
    /// 由 application 层生成的 gap 身份。
    pub gap_id: ImageLocalId,
    /// 缺口发生的依赖接缝类别。
    pub seam_kind: DependencySeamKind,
    /// 缺口对应的 external truth owner。
    pub owner: ExternalOwnerKind,
    /// 受影响的最小 local decision lane。
    pub affected_lane: DecisionLane,
    /// 结构化且脱敏的缺口原因。
    pub reason: SafeReason,
    /// 当前 gap lifecycle。
    pub lifecycle: ContractGapLifecycle,
    /// `Resolved` 所需的 formal owner-side resolution ref。
    pub resolution_ref: Option<ContractResolutionRef>,
    /// `Expired` 的安全解释；旧 gap不可继续污染新判断。
    pub expiry_reason: Option<SafeReason>,
    /// 记录时点。
    pub recorded_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gap_id` | `ImageLocalId` | gap主键 | application ID factory。 |
| `seam_kind` | `DependencySeamKind` | 保留 compile/runtime/event/ref/adapter/fake分类 | Step 5 seam classification；不得因消费关系改写为 compile。 |
| `owner` | `ExternalOwnerKind` | exact owner定位 | safe boundary diagnosis；不得由 consumer猜 owner。 |
| `affected_lane` | `DecisionLane` | 限定冻结范围 | flow/guard明确给定；一个 gap不能代替 global ready=false。 |
| `reason` | `SafeReason` | gap解释 | domain guard、safe adapter或pending authority诊断；无 raw body。 |
| `lifecycle` | `ContractGapLifecycle` | gap state | `open` 初始 `Open`。 |
| `resolution_ref` | `Option<ContractResolutionRef>` | formal close依据 | 仅 `Resolved` 时 `Some`；当前 MI-UP/Q pending不填。 |
| `expiry_reason` | `Option<SafeReason>` | expired解释 | 仅 `Expired` 时 `Some`；不是静默删除。 |
| `recorded_at` | `UtcTimestamp` | local observation time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ContractGapRef` | 获得 typed gap ref | 无 | `ContractGapRef` | pure。 |
| `pub fn block(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 显式冻结受影响 lane | safe reason | `Result<(), DomainError>` | `Open -> Blocked`；不影响不相关lane或既有history。 |
| `pub fn resolve(&mut self, resolution_ref: ContractResolutionRef) -> Result<(), DomainError>` | 在 future formal owner resolution 后记录关闭 | typed formal resolution ref | `Result<(), DomainError>` | `Open/Blocked -> Resolved`；当前 pending输入不可调用。 |
| `pub fn expire(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 使旧 gap context失效 | safe reason | `Result<(), DomainError>` | `Open/Blocked -> Expired`；新判断必须新建 gap。 |
| `pub fn affects(&self, lane: DecisionLane) -> bool` | 判断gap是否冻结某lane | decision lane | `bool` | 仅 `Open/Blocked` 且exact lane返回true。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(gap_id: ImageLocalId, seam_kind: DependencySeamKind, owner: ExternalOwnerKind, affected_lane: DecisionLane, reason: SafeReason, recorded_at: UtcTimestamp) -> Result<Self, DomainError>` | 创建可见 gap | app ID、分类/owner/lane/reason/time | `Result<ContractGap, DomainError>` | source/consumer/Artifact/event/adapter boundary failure；初始 `Open`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no global readiness | gap只冻结其 `affected_lane`，不得用它断言全仓/全链 ready 或不ready。 |
| resolution 外置 | `Resolved` 需要 formal `ContractResolutionRef`；本仓 config、fake、cache、ACK、tag、projection都无权关闭。 |
| 遗留事实不删除 | gap不删除candidate、eligibility、entry、trace或history；只阻断受影响的新 decision。 |

#### 12.6 `ProjectionFreshness`

```rust
/// 一个 read-only projection 与其 committed local truth watermark 的关系；freshness 从不表示业务、consumer或运行时 readiness。
pub struct ProjectionFreshness {
    /// 由 application 层生成的 freshness marker 身份。
    pub freshness_id: ImageLocalId,
    /// 本 marker 所属 projection family。
    pub projection_kind: ProjectionKind,
    /// 当前已知 committed truth watermark。
    pub source_watermark: TruthWatermark,
    /// read model freshness lifecycle。
    pub lifecycle: ProjectionFreshnessLifecycle,
    /// refresh/rebuild被阻断时关联的 gap。
    pub gap_ref: Option<ContractGapRef>,
    /// stale/unavailable解释。
    pub reason: Option<SafeReason>,
    /// 成功重建后的本地时点。
    pub last_rebuilt_at: Option<UtcTimestamp>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `freshness_id` | `ImageLocalId` | marker主键 | application ID factory。 |
| `projection_kind` | `ProjectionKind` | view family | query/rebuild use case明确选择；不含 product catalog / manifest schema。 |
| `source_watermark` | `TruthWatermark` | 已消费truth边界 | 仅 committed local truth refs + clock；projection/fake不能充当来源。 |
| `lifecycle` | `ProjectionFreshnessLifecycle` | read state | `start` 初始 `Stale`；不默认 fresh。 |
| `gap_ref` | `Option<ContractGapRef>` | external/adapter阻断解释 | `Unavailable` 时通常 `Some`；不以 gap取代 watermark。 |
| `reason` | `Option<SafeReason>` | non-fresh解释 | `Fresh` 必须 `None`；`Stale`/`Unavailable` 必须有安全说明。 |
| `last_rebuilt_at` | `Option<UtcTimestamp>` | latest successful local rebuild | 仅 `Fresh` 时 `Some`；application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ProjectionFreshnessRef` | 获得 typed freshness ref | 无 | `ProjectionFreshnessRef` | pure。 |
| `pub fn mark_stale(&mut self, source_watermark: TruthWatermark, reason: SafeReason) -> Result<(), DomainError>` | 表达 projection滞后 | newest watermark/reason | `Result<(), DomainError>` | `Fresh/Rebuilding -> Stale`；不写 core truth。 |
| `pub fn begin_rebuild(&mut self, source_watermark: TruthWatermark) -> Result<(), DomainError>` | 打开从truth重建语境 | committed watermark | `Result<(), DomainError>` | `Stale -> Rebuilding`；不读projection作为source。 |
| `pub fn mark_fresh(&mut self, source_watermark: TruthWatermark, rebuilt_at: UtcTimestamp) -> Result<(), DomainError>` | 记录与watermark一致的成功rebuild | committed watermark/time | `Result<(), DomainError>` | `Rebuilding -> Fresh`；清除gap/reason，不声明business ready。 |
| `pub fn mark_unavailable(&mut self, gap_ref: ContractGapRef, reason: SafeReason) -> Result<(), DomainError>` | 让读侧显式不可用 | local gap/reason | `Result<(), DomainError>` | `Stale/Rebuilding -> Unavailable`；不修改 truth。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(freshness_id: ImageLocalId, projection_kind: ProjectionKind, source_watermark: TruthWatermark) -> Result<Self, DomainError>` | 建立尚未证明fresh的 marker | app ID、projection kind、committed watermark | `Result<ProjectionFreshness, DomainError>` | projection registration / rebuild preparation；初始 `Stale`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| projection只读 | 本对象和其 lifecycle不能修改 DefinitionAssembly、BuildCandidate、Qualification或SupplyEntry truth。 |
| fresh仅为读侧一致性 | `Fresh` 不表示 candidate/eligibility/availability、Artifact/consumer handoff或运行时 ready。 |
| rebuild必须从truth开始 | `mark_fresh` 之前的输入必须由 committed local truth watermark构成，不能由 cache/fake/recovered view推断。 |

#### 12.7 `ImageTraceRecord`

```rust
/// 一条 append-only 的本仓安全追溯记录；连接 local subject 与 body-free source refs，但不拥有业务状态或外部正文。
pub struct ImageTraceRecord {
    /// 由 application 层生成的 trace record 身份。
    pub trace_id: ImageLocalId,
    /// 被解释的 local domain/ref/projection subject。
    pub subject_ref: LocalObjectRef,
    /// 该 subject 的 local 或 body-free external sources。
    pub source_refs: TraceSourceRefSet,
    /// operation-level correlation context。
    pub correlation_ref: CorrelationRef,
    /// 可选的安全 causation link。
    pub causation_ref: Option<CausationRef>,
    /// 仅用于解释的安全原因。
    pub reason: SafeReason,
    /// 本仓追加记录时点。
    pub recorded_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `trace_id` | `ImageLocalId` | trace record主键 | application ID factory。 |
| `subject_ref` | `LocalObjectRef` | 被解释对象 | application flow 从当前 local truth/ref marker传入；不使用裸ID。 |
| `source_refs` | `TraceSourceRefSet` | 安全来源集合 | object factory/flow组装；只含local ref或body-free external ref，排序去重。 |
| `correlation_ref` / `causation_ref` | typed metadata refs | operation关联 | `OperationMetadata` 或同等 validated application context；不含 run ID/payload。 |
| `reason` | `SafeReason` | why trace exists | guard/adapter/local transition safe explanation；不含raw log。 |
| `recorded_at` | `UtcTimestamp` | local append time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ImageTraceRecordRef` | 获得 typed trace ref | 无 | `ImageTraceRecordRef` | pure。 |
| `pub fn links(&self, subject_ref: &LocalObjectRef) -> bool` | 判断是否解释某subject | local typed ref | `bool` | pure；exact kind/id matching。 |
| `pub fn has_source(&self, source_ref: &TraceSourceRef) -> bool` | 判断包含某安全source | trace source | `bool` | pure；不解析external body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn record(trace_id: ImageLocalId, subject_ref: LocalObjectRef, source_refs: TraceSourceRefSet, correlation_ref: CorrelationRef, causation_ref: Option<CausationRef>, reason: SafeReason, recorded_at: UtcTimestamp) -> Result<Self, DomainError>` | 建立append-only trace record | app ID、typed refs、metadata/reason/time | `Result<ImageTraceRecord, DomainError>` | committed truth/gap/projection marker 后的 trace append；具体存储顺序留 Step 9/11。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| trace不是第二truth | trace不能触发或覆盖definition/build/qualification/supply state，亦不得用于reconstruct缺失truth。 |
| no raw body | provider payload、build log、manifest、evidence、Artifact、consumer confirmation正文、secret/live state均禁止。 |
| append-only | 修正解释需追加新trace record并通过causation关联，不得改写旧record。 |

#### 12.8 `ImageDerivedReadModel`

```rust
/// 一个从 committed local truth 可重建的安全读模型；它暴露阶段摘要、entry/gap 与 freshness，不提供 domain mutation。
pub struct ImageDerivedReadModel {
    /// 由 application 层生成的 view 身份。
    pub view_id: ImageLocalId,
    /// 可选variant scope；catalog view可为空。
    pub variant_ref: Option<ImageVariantDefinitionRef>,
    /// 各 local decision lane 的显式安全摘要。
    pub stage_summaries: SafeStageSummarySet,
    /// local supply/consumer boundary的安全摘要。
    pub entry_summary: Option<SafeEntrySummary>,
    /// 本view基于的 committed truth watermark。
    pub source_watermark: TruthWatermark,
    /// 与此view绑定的 freshness marker。
    pub freshness_ref: ProjectionFreshnessRef,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `view_id` | `ImageLocalId` | read model主键 | application ID factory；不作为 truth identity。 |
| `variant_ref` | `Option<ImageVariantDefinitionRef>` | view范围 | query/rebuild输入；catalog场景可空。 |
| `stage_summaries` | `SafeStageSummarySet` | 阶段态显式surface | 从 committed local truth归纳，一lane最多一项；不压成 global ready。 |
| `entry_summary` | `Option<SafeEntrySummary>` | entry或consumer gap读取面 | 仅从 committed local supply/reference truth归纳；不含 member-service manifest。 |
| `source_watermark` | `TruthWatermark` | rebuild证据边界 | `CommittedImageTruthSnapshot` 提供；不从projection/cache/fake生成。 |
| `freshness_ref` | `ProjectionFreshnessRef` | 读侧 freshness关联 | loaded/created local marker；query必须读取其实际 state。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ImageDerivedReadModelRef` | 获得 typed view ref | 无 | `ImageDerivedReadModelRef` | pure。 |
| `pub fn rebuild(&mut self, truth: &CommittedImageTruthSnapshot, freshness_ref: ProjectionFreshnessRef) -> Result<(), DomainError>` | 仅用 committed truth 重建 view fields | checked truth snapshot / freshness ref | `Result<(), DomainError>` | 替换此 derived view内容；不得写back source objects。 |
| `pub fn is_readable_with(&self, freshness: &ProjectionFreshness) -> bool` | 判断read side是否可服务 | loaded freshness | `bool` | `Fresh` / `Stale` 可读，`Rebuilding` / `Unavailable` 不可读；不影响truth。 |
| `pub fn stage_for(&self, lane: DecisionLane) -> Option<&SafeStageSummary>` | 查询单lane summary | lane | `Option<&SafeStageSummary>` | pure；不推断缺失lane为ready。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_truth(view_id: ImageLocalId, truth: CommittedImageTruthSnapshot, freshness_ref: ProjectionFreshnessRef) -> Result<Self, DomainError>` | 从正式 truth 快照构造view | app ID、truth snapshot、marker ref | `Result<ImageDerivedReadModel, DomainError>` | RebuildImageDerivedViews；不直接接受external response或projection snapshot。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no writeback | read model及其repository/fake/cache均没有 domain mutation权限。 |
| gap/freshness必须可见 | query不得把 `Stale` / `Rebuilding` / `Unavailable` / consumer gap压缩为空结果或 `ready=true`。 |
| 可重建 | 同一 committed truth watermark应产生确定性阶段摘要；具体排序/paging/persistence由 Step 7/8/11 闭合。 |

#### 12.9 `ReferenceValidityGuard`

```rust
/// 验证外部 snapshot 是否可用于指定 local use 的 pure guard；它不连接 adapter、不读取 cache也不生成 owner truth。
pub struct ReferenceValidityGuard {
    /// 此 guard可消费的 external owner/kind规则。
    pub allowed_rules: RequiredExternalReferenceRuleSet,
    /// 此 guard允许的 narrow local uses。
    pub allowed_uses: Vec<ReferenceUseKind>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `allowed_rules` | `RequiredExternalReferenceRuleSet` | owner/kind边界 | 固定 local capability规则；不能由 adapter/config扩大。 |
| `allowed_uses` | `Vec<ReferenceUseKind>` | use allowlist | 排序去重且非空；`ReadOnlyExplanation` 不得被用于正向 guard。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn check(&self, snapshot: &ExternalReferenceSnapshot, requested_use: ReferenceUseKind) -> SafeDisposition` | 验证snapshot/ref/use是否可用 | loaded snapshot / requested use | `SafeDisposition` | pure；wrong owner/kind、stale/conflict/unavailable或use不符均不能 `VerifiedUsable`。 |
| `pub fn accepts_use(&self, requested_use: ReferenceUseKind) -> bool` | 判断guard是否允许该use | use kind | `bool` | pure。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_rules(allowed_rules: RequiredExternalReferenceRuleSet, allowed_uses: Vec<ReferenceUseKind>) -> Result<Self, DomainError>` | 建立use-bound reference guard | validated rules/uses | `Result<ReferenceValidityGuard, DomainError>` | definition/build/qualification/supply的application/domain composition。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no cache/fake source | fake只在测试中验证同样的fail-closed结果，cache/projection只能解释读侧，均不可作为production snapshot source。 |
| no guessed fallback | stale/conflict/unavailable/wrong-kind都必须 `Blocked` / `Rejected` / `Unknown`，不得用旧tag或私造ref填补。 |
| snapshot不跨用途 | 与snapshot自身 `use_kind` 不完全一致的requested use不得通过。 |

#### 12.10 `ProjectionReadOnlyGuard`

```rust
/// 验证 projection rebuild 只读取 committed local truth 并禁止 writeback 的 pure guard。
pub struct ProjectionReadOnlyGuard {
    /// 本仓允许的 projection families。
    pub permitted_projection_kinds: Vec<ProjectionKind>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `permitted_projection_kinds` | `Vec<ProjectionKind>` | projection scope | 固定排序/去重；只覆盖本仓已定义安全view，不预设产品manifest。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn allow_rebuild(&self, projection_kind: ProjectionKind, truth: &CommittedImageTruthSnapshot) -> SafeDisposition` | 验证rebuild使用合法 projection和committed truth | projection kind / truth snapshot | `SafeDisposition` | pure；缺 watermark或非法kind不能 `VerifiedUsable`。 |
| `pub fn reject_writeback(&self, target_ref: &LocalObjectRef) -> DomainError` | 统一产生禁止projection回写的domain error | attempted truth target | `DomainError` | pure；任何domain truth target都拒绝。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn strict() -> Self` | 建立全部已定义安全projection的只读 guard | 无 | `ProjectionReadOnlyGuard` | projection domain composition；具体 repository port留 Step 7。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| projection永不修复truth | rebuild、cache miss、read error或fake result不能修改 definition、baseline、revision、attempt、candidate、eligibility、entry、history或gap。 |
| truth输入必须已提交 | pending in-memory mutation、external response、consumer observed state、fake private map均不是 `CommittedImageTruthSnapshot` 合法来源。 |
| 不产生外部副作用 | guard不发布、handoff、refresh source或启动job；这些由future application flow协调。 |

### 12.11 ReferenceDerived 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| snapshot/gap/trace/projection是否与core truth分离 | `pass` | 所有对象只保存local refs、safe reason、watermark或body-free external ref；无owner body/no writeback。 |
| stale/unknown/recovery是否走新context | `pass` | snapshot/gap均需新capture/new gap context或formal resolution；trace append-only。 |
| projection freshness是否未被写成readiness | `pass` | `Fresh` 仅表示watermark一致，query仍必须暴露stage/gap。 |
| dependency seam分类是否保留 | `pass` | `ContractGap`保留compile/runtime/event/ref/adapter/fake；无active sibling Cargo依赖。 |
| ports、storage、query DTO/flow是否后置 | `pass` | resolver/projection/trace/gap repository、protocol和rebuild/reconcile顺序留 Step 7~11。 |

## 13. `application`：operation、idempotency 与 coordinator stable carrier

### 13.1 模块 capability 与对象映射

`application` 只拥有 use-case 编排所需的 stable carrier 与 coordinator identity。它不拥有任何五阶段 domain truth，也不在本 Step 定义 repository、external adapter、UoW trait method、DTO 或函数级事务顺序。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 规范化 command/query/conditional event/job 的操作语境 | validated local entry metadata、operation name、channel | `ImageOperationContext` | query no-write；write需要idempotency | 不验证transport认证、topic或scheduler | Step 8 protocol、Step 9 entry/application flow。 |
| 声明 UoW 参与边界 | operation context、write/read intent | `ImageUnitOfWorkBoundary` | declarative transaction participation | 不实现 DB/transaction | Step 7 UoW port、Step 11 persistence。 |
| 保存重放/冲突语义 | stable metadata / future canonical stable-input identity | `ImageIdempotencyRecord`、`StoredImageOperationResult` | reserved/completed/conflict | 不生成 payload hash、consumer receipt、job report | Step 7 store port、Step 8 result DTO、Step 13 idempotency。 |
| 按 capability编排 domain objects | application facade 已注入的 future services | five coordinator identity | no local truth mutation by carrier itself | 不持有 concrete adapter / repository | Step 7 port trait、Step 9 flow。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ImageOperationContext` | entry-to-application metadata normalization | application value object | build / asserts no-write / requires idempotency | 不承载 public DTO、auth/authority或event envelope。 |
| `ImageUnitOfWorkBoundary` | 事务意图与参与者语义 | application coordination marker | read-only/write boundary validation | 不提供 transaction implementation、SQL或lock。 |
| `ImageIdempotencyRecord` | replay reservation semantic | application technical record | reserve / match / complete / conflict | 不计算 payload digest、不重跑 domain mutation。 |
| `StoredImageOperationResult` | stored replay result shell | application result marker | build / matches ref | 不保存 DTO/receipt/report/evidence body。 |
| five coordinator identity | capability use-case责任定位 | application facade/service marker | expose operation ownership | 不拥有 domain truth/port/concrete I/O。 |

### 13.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `ImageOperationContext` | 约束入口语义 | channel/name/metadata/write boundary | `from_write` / `from_query` | requires idempotency/assert query no write | `ImageOperationChannel` | API/worker/jobs future validated local mapping。 |
| `ImageUnitOfWorkBoundary` | 区分read/write及可持久化subject | operation ref/channel/mode | `for_context` | permits mutation/assert read-only | `ImageUnitOfWorkMode` | application operation context；exact port留 Step 7。 |
| `ImageIdempotencyRecord` | stable replay/conflict state | local ID/key/channel/name/result ref/state/reason/time | `reserve` | matches/complete/mark conflict | `ImageIdempotencyLifecycle` | operation context、future canonicalizer/store、ID/clock。 |
| `StoredImageOperationResult` | 向duplicate提供 local result shell | local ID/result ref/kind/correlation/time | `record` | matches ref | `StoredImageOperationResultKind` | application ID、operation context；仅保存 metadata shell，不保留或指向 protocol body。 |
| coordinator identities | 定义五组用例主语 | no instance field / type marker | `new` | operation_name/handles | none | application facade composition；不引用concrete adapter。 |

#### 13.3 Application shared helper carrier、technical enum 与唯一归属

```rust
/// Declares whether an application operation is read-only or may stage local truth changes.
pub enum ImageUnitOfWorkMode {
    /// The operation reads committed truth or projections and must not reserve idempotency or mutate state.
    ReadOnly,
    /// The operation may mutate local truth and requires a future UoW/idempotency path.
    ReadWrite,
}

/// Classifies an entry protected by application orchestration rules; it is not transport, broker, or scheduler configuration.
pub enum ImageOperationChannel {
    /// A synchronous command that may request local-truth mutation.
    Command,
    /// A query that must remain read-only.
    Query,
    /// A conditional inbound event that may write only after formal authority and schema close.
    InboundEvent,
    /// An operations job that performs bounded maintenance on a persisted scope.
    OperationsJob,
}

/// A stable application operation name; its public DTO, route, or topic remains deferred to Step 8.
pub struct ImageOperationName(pub NonEmptyText);

/// A local result identity generated by application code for stored-result lookup.
pub struct ImageOperationResultId(pub ImageLocalId);

/// A reference to a stored local result shell for replay, not a consumer receipt, report, or evidence body.
pub struct ImageOperationResultRef {
    /// The application operation that produced this result.
    pub operation_name: ImageOperationName,
    /// The application-generated local result identity.
    pub result_id: ImageOperationResultId,
}

/// Technical lifecycle of an idempotency reservation; it is not a domain lifecycle.
pub enum ImageIdempotencyLifecycle {
    /// The key is reserved and no replayable result has been stored.
    Reserved,
    /// The operation ended and is associated with one stored local result.
    Completed,
    /// The same key was used for a different operation or stable input context.
    Conflict,
}

/// Safe local category of a stored result; it contains no DTO, consumer receipt, job report, or evidence body.
pub enum StoredImageOperationResultKind {
    /// A local accepted or rejected result surface for one command.
    CommandResult,
    /// A local disposition surface for a conditionally inbound input that was safely rejected or unavailable.
    InboundDisposition,
    /// A local action disposition surface for one bounded job.
    JobDisposition,
}

/// A body-free stable-input identity supplied by a future canonicalization boundary; it is not a cryptographic claim, image digest, or payload body.
pub struct StableOperationInputRef(pub OpaqueReference);

/// A normalized conflict explanation for idempotency-key reuse; it cannot include input/event/job body.
pub struct ImageIdempotencyConflictReason(pub SafeReason);
```

| helper / enum | 作用 | 约束 / 来源 |
|---|---|---|
| `ImageUnitOfWorkMode` | 给 future UoW port/flow一个稳定的 read/write carrier | query必须 `ReadOnly`；command/conditional event/job在允许写本仓truth时为 `ReadWrite`，并非 DB transaction已开启。 |
| `ImageOperationChannel` | application-owned entry分类 | 唯一正式归属在本节，`contracts` 不定义它；不表达 route、topic、broker、scheduler或transport。 |
| `ImageOperationName` / `ImageOperationResultId` / `ImageOperationResultRef` | application 的稳定 operation / replay identity | 仅由 future application protocol mapping 与 ID boundary 形成；不是 public DTO、receipt、report 或 evidence。 |
| `ImageIdempotencyLifecycle` | reservation technical lifecycle | 只服务 application replay/store；不与 domain lifecycle、Artifact 或 consumer 状态混用。 |
| `StoredImageOperationResultKind` | stored-result metadata shell分类 | 只分类 local shell，不构造或引用 DTO body、consumer receipt、job report 或 evidence body。 |
| `StableOperationInputRef` | 使幂等匹配基于 future validated stable input identity | 只允许 future local canonicalizer产生的 body-free ref；不得计算或宣称digest、不得带 payload / run ID。 |
| `ImageIdempotencyConflictReason` | 封装安全重放冲突原因 | `SafeReasonCategory::IdempotencyConflict`；不得存原始输入。 |

| enum 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ImageUnitOfWorkMode::ReadOnly` | `The operation reads committed truth or projections and must not reserve idempotency or mutate state.` | `ImageOperationContext::from_query` | query/UoW assertion；不得保存truth或result reservation。 |
| `ImageUnitOfWorkMode::ReadWrite` | `The operation may mutate local truth and requires a future UoW/idempotency path.` | valid command、future verified event、bounded job context | future UoW/idempotency port；不等 transaction committed。 |
| `ImageOperationChannel::Command` | `A synchronous command that may request local-truth mutation.` | Step 8 command mapping | `ImageOperationContext::from_write` / future command flow；不得表达 route 或授权结果。 |
| `ImageOperationChannel::Query` | `A query that must remain read-only.` | Step 8 query mapping | `ImageOperationContext::from_query` / query UoW assertion；不得 reserve idempotency 或 mutation。 |
| `ImageOperationChannel::InboundEvent` | `A conditional inbound event that may write only after formal authority and schema close.` | only after MI-UP-005 and Step 7/8 contract validation | future conditional worker mapping；当前不得进入 positive construction。 |
| `ImageOperationChannel::OperationsJob` | `An operations job that performs bounded maintenance on a persisted scope.` | Step 8 bounded job mapping | future job/application flow；不表示 scheduler / run / execution result。 |
| `ImageIdempotencyLifecycle::Reserved` | `The key is reserved and no replayable result has been stored.` | `ImageIdempotencyRecord::reserve` | `Completed` / `Conflict`；不得重跑或直接修改 domain truth。 |
| `ImageIdempotencyLifecycle::Completed` | `The operation ended and is associated with one stored local result.` | `ImageIdempotencyRecord::complete` after local result shell exists | replay lookup only；不得回 `Reserved`。 |
| `ImageIdempotencyLifecycle::Conflict` | `The same key was used for a different operation or stable input context.` | `ImageIdempotencyRecord::mark_conflict` | safe conflict surface；不得回 `Reserved` 或重跑。 |
| `StoredImageOperationResultKind::CommandResult` | `A local accepted or rejected result surface for one command.` | future command application flow | local replay shell；public DTO仍留Step 8。 |
| `StoredImageOperationResultKind::InboundDisposition` | `A local disposition surface for a conditionally inbound input that was safely rejected or unavailable.` | only future conditional inbound flow | local safe disposition；不是broker receipt。 |
| `StoredImageOperationResultKind::JobDisposition` | `A local action disposition surface for one bounded job.` | future bounded job flow | local replay shell；不是run report或evidence。 |

#### 13.4 `ImageOperationContext`

```rust
/// Carries validated local execution metadata for one application operation; it is neither a public DTO nor an authorization/transport context.
pub struct ImageOperationContext {
    /// The entry channel governed by application orchestration rules.
    pub channel: ImageOperationChannel,
    /// Stable local operation identity used by idempotency/result records.
    pub operation_name: ImageOperationName,
    /// Metadata retained by write operations; query contexts retain none.
    pub metadata: Option<OperationMetadata>,
    /// Declared local mutation boundary.
    pub unit_of_work_mode: ImageUnitOfWorkMode,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `channel` | `ImageOperationChannel` | entry类别 | API/worker/jobs future mapping；`InboundEvent` 当前仅在 `MI-UP-005`关闭后可构造写context。 |
| `operation_name` | `ImageOperationName` | stable operation identity | application constant / future protocol name mapping；不能使用route/topic/payload临时拼接。 |
| `metadata` | `Option<OperationMetadata>` | write metadata | `Command` / `InboundEvent` / `OperationsJob` 必须 `Some`；`Query` 必须 `None`。 |
| `unit_of_work_mode` | `ImageUnitOfWorkMode` | read/write intent | `Query=ReadOnly`；其余只有已允许mutation时 `ReadWrite`；不等持久化已提交。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_idempotency(&self) -> bool` | 判断是否必须走 future reservation | 无 | `bool` | `Command` / `InboundEvent` / `OperationsJob` 为true，`Query`为false。 |
| `pub fn assert_query_no_write(&self) -> Result<(), DomainError>` | 保护 query只读 | 无 | `Result<(), DomainError>` | query携带metadata或`ReadWrite`时拒绝；不写状态。 |
| `pub fn assert_write_metadata_complete(&self) -> Result<(), DomainError>` | 保护写operation最小metadata | 无 | `Result<(), DomainError>` | write缺metadata/稳定key/关联时拒绝；不做authority验证。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_write(channel: ImageOperationChannel, operation_name: ImageOperationName, metadata: OperationMetadata) -> Result<Self, DomainError>` | 构造本地写操作context | command/event/job channel、name、metadata | `Result<ImageOperationContext, DomainError>` | application command / conditional consumer / job entry；拒绝 `Query`。 |
| `pub fn from_query(operation_name: ImageOperationName) -> Self` | 构造只读query context | operation name | `ImageOperationContext` | query service；固定`Query`、无metadata、`ReadOnly`。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| context不证明authority | actor/source ref只记录body-free metadata；auth、broker verification、scheduler ownership、governance approval均不由本对象判断。 |
| current event lane保持封闭 | `InboundEvent` 的正向构造仍受 `MI-UP-005`阻断；本对象不提供绕过`InboundContractState`的入口。 |
| query绝不预留写资源 | query不创建 idempotency record、stored result、UoW write scope或domain mutation。 |

#### 13.5 `ImageUnitOfWorkBoundary`

```rust
/// Describes application transaction participation for one local operation without implementing a database, lock, or transaction.
pub struct ImageUnitOfWorkBoundary {
    /// Local operation whose persistence participation is being declared.
    pub operation_name: ImageOperationName,
    /// Read-only or read-write persistence intent.
    pub mode: ImageUnitOfWorkMode,
    /// Local truth kinds that may be mutated by this operation; empty for reads.
    pub mutable_kinds: Vec<LocalObjectKind>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `operation_name` | `ImageOperationName` | UoW归属operation | `ImageOperationContext`；必须与future protocol/flow名称一致。 |
| `mode` | `ImageUnitOfWorkMode` | read/write scope | context/operation rule；不表达 concrete transaction。 |
| `mutable_kinds` | `Vec<LocalObjectKind>` | potential local truth mutation面 | `ReadOnly` 时必须空；`ReadWrite` 时排序去重、只含本仓local kind，具体load/save配对留 Step 7/9。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn permits_mutation_of(&self, kind: LocalObjectKind) -> bool` | 判断UoW声明是否允许某local kind变更 | local kind | `bool` | pure；不授权external owner truth。 |
| `pub fn assert_read_only(&self) -> Result<(), DomainError>` | 确保query无mutation面 | 无 | `Result<(), DomainError>` | `ReadOnly` + empty kinds才通过。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_context(context: &ImageOperationContext, mutable_kinds: Vec<LocalObjectKind>) -> Result<Self, DomainError>` | 将operation context显式映射为UoW boundary | validated context / local kind list | `Result<ImageUnitOfWorkBoundary, DomainError>` | application service before future UoW port；不开始transaction。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| UoW不是实现 | 本对象不包含 repository、connection、transaction id、lock、lease、commit/rollback result。 |
| only local truth | `mutable_kinds` 不得列出 Method Library、Runtime、Tools、Member Service、Artifact、Governance、Sandbox或外部ref种类。 |
| exact sequence后置 | factory只声明scope；load/version/save/idempotency/trace/projection的调用与原子性由 Step 7、9、11、13闭合。 |

#### 13.6 `ImageIdempotencyRecord`

```rust
/// Stores the local technical replay reservation for one non-query operation; it contains no request/event/job body and no domain truth.
pub struct ImageIdempotencyRecord {
    /// Application-generated reservation identity.
    pub record_id: ImageLocalId,
    /// Normalized key copied from validated operation metadata.
    pub idempotency_key: IdempotencyKey,
    /// Channel protected by this reservation; Query is forbidden.
    pub channel: ImageOperationChannel,
    /// Operation protected by this reservation.
    pub operation_name: ImageOperationName,
    /// Future body-free stable-input identity used for duplicate matching.
    pub stable_input_ref: StableOperationInputRef,
    /// Result ref once the operation completes.
    pub result_ref: Option<ImageOperationResultRef>,
    /// Reservation lifecycle.
    pub lifecycle: ImageIdempotencyLifecycle,
    /// Safe conflict explanation.
    pub conflict_reason: Option<ImageIdempotencyConflictReason>,
    /// Local reservation time.
    pub reserved_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `record_id` | `ImageLocalId` | reservation主键 | application ID factory。 |
| `idempotency_key` | `IdempotencyKey` | replay key | `ImageOperationContext.metadata`；query禁止。 |
| `channel` / `operation_name` | application carriers | 匹配范围 | `ImageOperationContext`；不能在load后被改变。 |
| `stable_input_ref` | `StableOperationInputRef` | duplicate match identity | future canonicalization port输出；不等 image digest、不含raw request/event/job body。 |
| `result_ref` | `Option<ImageOperationResultRef>` | completed replay pointer | 仅 `Completed` 为Some，且name相同；其surface读取留 Step 7/8。 |
| `lifecycle` | `ImageIdempotencyLifecycle` | reservation state | `reserve` 初始 `Reserved`。 |
| `conflict_reason` | `Option<ImageIdempotencyConflictReason>` | conflict安全解释 | 仅 `Conflict` 为Some；无payload。 |
| `reserved_at` | `UtcTimestamp` | local time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> ImageIdempotencyRecordRef` | 获得 typed reservation ref | 无 | `ImageIdempotencyRecordRef` | pure；kind必须为 `ImageIdempotencyRecord`。 |
| `pub fn matches(&self, channel: ImageOperationChannel, operation_name: &ImageOperationName, stable_input_ref: &StableOperationInputRef) -> bool` | 判断是否为同一可重放操作 | channel/name/stable input | `bool` | pure；不读取stored result body。 |
| `pub fn complete(&mut self, result_ref: ImageOperationResultRef) -> Result<(), DomainError>` | 连接已存local result | result ref | `Result<(), DomainError>` | 仅 `Reserved -> Completed`；operation name必须一致。 |
| `pub fn mark_conflict(&mut self, reason: ImageIdempotencyConflictReason) -> Result<(), DomainError>` | 标记key复用冲突 | safe reason wrapper | `Result<(), DomainError>` | 仅 `Reserved -> Conflict`；清空result ref。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(record_id: ImageLocalId, context: &ImageOperationContext, stable_input_ref: StableOperationInputRef, reserved_at: UtcTimestamp) -> Result<Self, DomainError>` | 从validated write context创建reservation | app ID/context/stable ref/time | `Result<ImageIdempotencyRecord, DomainError>` | future IdempotencyRepositoryPort new-key path；query / missing metadata拒绝。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| duplicate不重跑 | `Completed` 的同match输入必须由future stored result lookup返回；不能重新执行domain transition或job scan。 |
| no fabricated digest | `StableOperationInputRef` 不是内容digest/签名；其canonicalization算法、version和storage由 Step 7/8/13闭合。 |
| 终态不可回退 | `Completed` / `Conflict` 不得回 `Reserved`，新语境必须有新key/record。 |

#### 13.7 `StoredImageOperationResult`

```rust
/// A metadata shell for one stored local operation result; the protocol/result body stays outside this object contract.
pub struct StoredImageOperationResult {
    /// Application-generated local record identity.
    pub stored_result_id: ImageLocalId,
    /// Stable replay reference exposed to an idempotency record.
    pub result_ref: ImageOperationResultRef,
    /// Safe category of the stored surface.
    pub result_kind: StoredImageOperationResultKind,
    /// Operation correlation retained for local trace lookup.
    pub correlation_ref: CorrelationRef,
    /// Local record time.
    pub recorded_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `stored_result_id` | `ImageLocalId` | result shell主键 | application ID factory；`result_ref.result_id`可不同且专用于replay identity。 |
| `result_ref` | `ImageOperationResultRef` | replay pointer | application result ID/name；与idempotency record同operation。 |
| `result_kind` | `StoredImageOperationResultKind` | stored surface类别 | application flow选择；不表示actual consumer receipt/job report。 |
| `correlation_ref` | `CorrelationRef` | trace关联 | `OperationMetadata`；不得重新生成。 |
| `recorded_at` | `UtcTimestamp` | local store time | application clock。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn to_ref(&self) -> StoredImageOperationResultRef` | 获得 typed stored-result ref | 无 | `StoredImageOperationResultRef` | pure。 |
| `pub fn matches_ref(&self, result_ref: &ImageOperationResultRef) -> bool` | 匹配replay ref | stable result ref | `bool` | pure；不读取body。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|
| `pub fn record(stored_result_id: ImageLocalId, result_ref: ImageOperationResultRef, result_kind: StoredImageOperationResultKind, correlation_ref: CorrelationRef, recorded_at: UtcTimestamp) -> Result<Self, DomainError>` | 记录local stored-result shell | app IDs/refs/kind/metadata/time | `Result<StoredImageOperationResult, DomainError>` | application write path完成后；protocol body、durability与read method留 Step 7/8/13。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| result shell不等协议body | 不保存 command DTO、API response、event receipt、job report、evidence或raw error。 |
| query无stored result | query结果为read model/explicit freshness，不得作为幂等写入结果保存。 |
| result shell必须可追溯 | `result_ref.operation_name` 与 `correlation_ref` 必须来自同一 operation context；未来 lookup 只能以 `result_ref` 查本地 shell，协议 body 不属于该对象。缺失时实现停止而非重跑。 |

#### 13.8 coordinator identity

```rust
/// Owns DefinitionAssembly use-case orchestration; it does not own definition or external source truth.
pub struct DefinitionAssemblyCoordinator;

/// Owns BuildCandidate use-case orchestration; it does not own builder, registry, or external job truth.
pub struct BuildIntentCoordinator;

/// Owns Qualification use-case orchestration; it does not own evidence, gate-policy, or Artifact truth.
pub struct QualificationCoordinator;

/// Owns SupplyEntry use-case orchestration; it does not own Member Service, container, or lifecycle truth.
pub struct AvailabilityCoordinator;

/// Owns body-free reference intake and projection-rebuild orchestration; it does not make a shadow source authoritative.
pub struct ReferenceIntakeCoordinator;
```

| coordinator | 责任 | 暴露能力 | 不变量 / 禁止事项 | 后续承接 |
|---|---|---|---|---|
| `DefinitionAssemblyCoordinator` | 编排definition/baseline/revision的local sequence | `operation_name()`、`handles()` marker | 不读取mapping/component/seed body，不直接实现resolver | Step 7 definition repository/reference ports；Step 9 flows。 |
| `BuildIntentCoordinator` | 编排intent/snapshot/attempt/outcome/candidate sequence | operation marker | 不拥有scheduler/builder/registry truth，不盲重试unknown | Step 7 builder/registry ports；Step 9 flows。 |
| `QualificationCoordinator` | 编排provenance/gate/eligibility/handoff gap sequence | operation marker | 不定义evidence/gate inventory/Artifact truth | Step 7 evidence/Artifact ports；Step 9 flows。 |
| `AvailabilityCoordinator` | 编排publish/replace/rollback/retire/resolve | operation marker | 不创建container、不判断consumer launch/health/confirmation | Step 7 supply/consumer ports；Step 9 flows。 |
| `ReferenceIntakeCoordinator` | 编排snapshot/gap/trace/freshness/read model intake/rebuild | operation marker | 不把snapshot/projection/fake当source truth、不反写core | Step 7 source/projection/trace ports；Step 9 flows。 |

| 函数签名 | 所属对象 | 作用 | 调用方 | 事务要求 |
|---|---|---|---|---|
| `pub fn DefinitionAssemblyCoordinator::operation_name() -> ImageOperationName` | `DefinitionAssemblyCoordinator` | 返回stable coordinator marker | future facade/handler | 不开启UoW。 |
| `pub fn BuildIntentCoordinator::operation_name() -> ImageOperationName` | `BuildIntentCoordinator` | 返回stable coordinator marker | future facade/worker/jobs | 不开启UoW。 |
| `pub fn QualificationCoordinator::operation_name() -> ImageOperationName` | `QualificationCoordinator` | 返回stable coordinator marker | future facade/handler | 不开启UoW。 |
| `pub fn AvailabilityCoordinator::operation_name() -> ImageOperationName` | `AvailabilityCoordinator` | 返回stable coordinator marker | future facade/query service | 不开启UoW。 |
| `pub fn ReferenceIntakeCoordinator::operation_name() -> ImageOperationName` | `ReferenceIntakeCoordinator` | 返回stable coordinator marker | future facade/worker/jobs/query service | 不开启UoW。 |

### 13.9 Application 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| operation/UoW/idempotency/result是否有唯一归属 | `pass` | stable carrier均在application；实际trait、durability、transaction、canonicalization及protocol body留Step 7~13。 |
| five coordinator是否只编排、不拥有truth | `pass` | 各coordinator为identity/责任标记，domain truth仍归五个domain capability。 |
| query no-write与event conditional是否明确 | `pass` | Query context无metadata/写scope；`MI-UP-005`未闭口时InboundEvent不进入positive construction。 |
| stored result是否未伪造receipt/report/evidence | `pass` | 仅local metadata shell；exact protocol/state仍以后续Step闭合。 |
| 依赖方向是否保持 | `pass` | application只依赖contracts/domain carrier；不含infra concrete、external SDK或sibling crate。 |

## 14. `infra`：config / composition / adapter availability / fake stable carrier

### 14.1 模块 capability 与对象映射

`infra` 在 Step 6 只闭口“如何表达尚未绑定产品的 composition 前置、slot 可用性与 fake 边界”。它不定义 adapter trait/implementation、config key、secret、endpoint、store schema、provider client、实际 runtime、process、container或 readiness。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| 引用经验证的 infra 配置语境 | future validated config source / safe ref | `ImageRuntimeConfigRef` | body-free ref或blocked reason | 不读取/保存raw config/secret | Step 7 config source port、Step 14 config binding。 |
| 声明 composition 所需 seam slot | planned slot kind、dependency classification | `ImageAdapterSlot` | unbound/available/blocked/unknown/fake-only marker | 不选择 provider、不激活Cargo dependency | Step 7 adapter matrix / implementation。 |
| 汇总本地 composition validation | config ref、slot marker、fake mode | `ImageRuntimeAssemblyState` | unassembled/assembled/blocked | 不等 server/worker/container readiness | Step 7 runtime builder、Step 14 config。 |
| 约束 test fake | explicit mode / slot marker | `ImageFakeMode` | production vs test-only boundary | fake不得进入production composition | Step 7 fake parity、Step 16 test cuts。 |

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ImageRuntimeConfigRef` | config安全引用 | infra value object | validate body-free config ref / indicate missing | 不含key/value/secret/URL/topic/cron/retry。 |
| `ImageAdapterSlot` | seam composition slot | infra composition marker | bind availability / block / mark fake | 不实现adapter、不作为业务成功。 |
| `ImageAdapterAvailabilityMarker` | slot observed availability | infra safety carrier | available/blocked/unknown/fake-only surface | 不替代builder/gate/consumer/registry事实。 |
| `ImageRuntimeAssemblyState` | composition result | infra aggregate marker | start / validate / block | 不启动process，不表达readiness。 |
| `ImageFakeMode` | fake boundary | infra enum | production/test-only separation | 不作为运行时feature或产品配置。 |

### 14.2 对象能力 → 字段 / 函数 / 状态映射

| 对象 | 对象能力 | 必需字段 | factory / 构造入口 | 成员函数 | 状态 enum / variant | 字段来源 |
|---|---|---|---|---|---|---|
| `ImageRuntimeConfigRef` | 安全地定位infra config语境 | optional opaque ref / safe reason | `bound` / `blocked` | is_bound / reason | `ImageRuntimeConfigState` | future config binding validation；不接受raw config。 |
| `ImageAdapterSlot` | 声明seam与local availability | slot kind / seam kind / marker | `declare` | update marker / requires real adapter | `ImageAdapterSlotKind` | planned infra composition + Step 5 seam classification。 |
| `ImageAdapterAvailabilityMarker` | 一次slot validation结论 | slot kind / availability / reason / time | `record` | is_production_usable | `ImageAdapterAvailability` | runtime builder/config/adapter validation；无外部业务结论。 |
| `ImageRuntimeAssemblyState` | 汇总slots与config的composition判断 | config ref / slots / fake mode/lifecycle/reason | `start` | validate / block / is assembled | `ImageRuntimeAssemblyLifecycle` | local builder validation / application ID/clock；不启动runtime。 |
| `ImageFakeMode` | 限制fake composition | no fields | enum variant | allows fake / assert production | `ImageFakeMode` | explicit composition call；不从环境默认推断。 |

#### 14.3 Infra shared carrier 与 enum variant 审计

```rust
/// Classifies an adapter slot used by infra composition; it is not a provider-product selection.
pub enum ImageAdapterSlotKind {
    /// A Role-to-variant mapping or reference-source seam.
    MappingSource,
    /// A Runtime, Tools, Member, or Supervisor component-reference seam.
    ComponentReference,
    /// A policy, memory, workspace, or role-extra static-seed seam.
    SeedReference,
    /// A Builder or Registry conservative-outcome seam.
    BuildAndRegistry,
    /// An Evidence, applicable-gate, or Artifact safe-conclusion seam.
    QualificationAndArtifact,
    /// A Member Service pinned-entry consumer seam.
    MemberServiceSupply,
    /// A local truth, history, read-model, or idempotency persistence seam.
    LocalStore,
}

/// Availability of one adapter slot within this repository; it reports composition capability, not external business success.
pub enum ImageAdapterAvailability {
    /// The slot is assembled with a boundary-conforming adapter or local-store implementation.
    Available,
    /// The slot is unconfigured, lacks authority, or is disabled; callers must take a blocked or gap branch.
    Blocked,
    /// The slot availability cannot currently be determined safely.
    Unknown,
    /// The slot is provided only by a deterministic fake and may be used only in test composition.
    FakeOnly,
}

/// Lifecycle of local runtime composition; it is not a service-process, container, or readiness state.
pub enum ImageRuntimeAssemblyLifecycle {
    /// Local composition validation has not completed.
    Unassembled,
    /// Required local slots are assembled under control; external positive contracts may still be gaps.
    Assembled,
    /// A required slot, config reference, or boundary validation blocks assembly.
    Blocked,
}

/// State of the body-free infra config reference retained by this repository.
pub enum ImageRuntimeConfigState {
    /// A validated body-free config reference is available for composition.
    Bound,
    /// Config is absent, invalid, or cannot be exposed safely; composition must remain blocked.
    Blocked,
}

/// Boundary for fake mode; a test fake must not enter production composition.
pub enum ImageFakeMode {
    /// Normal composition; each real slot availability still requires its own check.
    Production,
    /// Deterministic fake composition for use only in a test harness.
    TestOnly,
}
```

| enum / 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ImageAdapterSlotKind::MappingSource` | `A Role-to-variant mapping or reference-source seam.` | mapping reference seam | infra composition declaration | `ImageAdapterSlot`；不选择provider/compiled dependency。 |
| `ImageAdapterSlotKind::ComponentReference` | `A Runtime, Tools, Member, or Supervisor component-reference seam.` | component ref seam | infra composition declaration | `ImageAdapterSlot`；只接受body-free ref。 |
| `ImageAdapterSlotKind::SeedReference` | `A policy, memory, workspace, or role-extra static-seed seam.` | static seed seam | infra composition declaration | `ImageAdapterSlot`；不得接live memory/workspace。 |
| `ImageAdapterSlotKind::BuildAndRegistry` | `A Builder or Registry conservative-outcome seam.` | build/registry seam | infra composition declaration | `ImageAdapterSlot`；ACK不等candidate。 |
| `ImageAdapterSlotKind::QualificationAndArtifact` | `An Evidence, applicable-gate, or Artifact safe-conclusion seam.` | qualification/Artifact seam | infra composition declaration | `ImageAdapterSlot`；pending时blocked/gap。 |
| `ImageAdapterSlotKind::MemberServiceSupply` | `A Member Service pinned-entry consumer seam.` | consumer handoff seam | infra composition declaration | `ImageAdapterSlot`；不表示launch/health/confirmation。 |
| `ImageAdapterSlotKind::LocalStore` | `A local truth, history, read-model, or idempotency persistence seam.` | local persistence seam | infra composition declaration | `ImageAdapterSlot`；不保存external owner truth。 |
| `ImageAdapterAvailability::Available` | `The slot is assembled with a boundary-conforming adapter or local-store implementation.` | local composition availability | runtime builder validation | `ImageRuntimeAssemblyState`；不等external/business success。 |
| `ImageAdapterAvailability::Blocked` | `The slot is unconfigured, lacks authority, or is disabled; callers must take a blocked or gap branch.` | visible no-adapter state | config/boundary validation | blocked/gap branch；不得fallback。 |
| `ImageAdapterAvailability::Unknown` | `The slot availability cannot currently be determined safely.` | conservative uncertain state | infra validation | unknown/disposition branch；不得按Available使用。 |
| `ImageAdapterAvailability::FakeOnly` | `The slot is provided only by a deterministic fake and may be used only in test composition.` | test seam | explicit test composition | test-only parity;不得进production。 |
| `ImageRuntimeAssemblyLifecycle::Unassembled` | `Local composition validation has not completed.` | initial composition marker | `ImageRuntimeAssemblyState::start` | `Assembled` / `Blocked`；非process state。 |
| `ImageRuntimeAssemblyLifecycle::Assembled` | `Required local slots are assembled under control; external positive contracts may still be gaps.` | controlled local assembly | runtime builder after validation | application wiring；不等readiness。 |
| `ImageRuntimeAssemblyLifecycle::Blocked` | `A required slot, config reference, or boundary validation blocks assembly.` | visible composition failure | runtime builder validation | safe blocked surface；不得由default/fake解除。 |
| `ImageRuntimeConfigState::Bound` | `A validated body-free config reference is available for composition.` | config ref可用 | future config validation | runtime assembly validation；不暴露config内容。 |
| `ImageRuntimeConfigState::Blocked` | `Config is absent, invalid, or cannot be exposed safely; composition must remain blocked.` | config缺口 | config validation | runtime assembly blocked；不得用环境默认值补齐。 |
| `ImageFakeMode::Production` | `Normal composition; each real slot availability still requires its own check.` | normal mode boundary | explicit composition call | production validation；不代表所有slot可用。 |
| `ImageFakeMode::TestOnly` | `Deterministic fake composition for use only in a test harness.` | test-only mode boundary | explicit test harness | fake parity test；不得产生production truth/evidence。 |

#### 14.4 `ImageRuntimeConfigRef`

```rust
/// A body-free reference to validated infra configuration; it contains no key, value, secret, URL, topic, cron, or provider selection.
pub struct ImageRuntimeConfigRef {
    /// Optional opaque reference to the external or local configuration authority.
    pub config_ref: Option<OpaqueReference>,
    /// Whether a composition-safe reference is available.
    pub state: ImageRuntimeConfigState,
    /// Safe reason when the reference cannot be used.
    pub reason: Option<SafeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `config_ref` | `Option<OpaqueReference>` | config authority identity | future config-binding validation提供；`Bound`时Some，`Blocked`时None；不含key/value/secret。 |
| `state` | `ImageRuntimeConfigState` | config ref可用性 | `bound` / `blocked` factory决定；不是配置值有效性细节。 |
| `reason` | `Option<SafeReason>` | blocked解释 | `Blocked`时Some，`Bound`时None；无raw validation message。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_bound(&self) -> bool` | 判断是否有安全config ref | 无 | `bool` | `Bound && config_ref.is_some()`；不读取config。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn bound(config_ref: OpaqueReference) -> Result<Self, DomainError>` | 建立body-free config binding | validated opaque ref | `Result<ImageRuntimeConfigRef, DomainError>` | future Step 14 config binding；拒绝无owner/kind/identity的ref。 |
| `pub fn blocked(reason: SafeReason) -> Self` | 建立可见config gap | safe reason | `ImageRuntimeConfigRef` | current product/config authority absent path。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no raw config | secret、credential、endpoint、provider、topic、cron、retry/batch数字和真实config body均禁止进入。 |
| config不创造truth | `Bound` 只允许infra composition继续判断；不能生成candidate、eligibility、entry、handoff或consumer成功。 |
| blocked不得fallback | 缺config ref时必须保持blocked，不从environment/default/fake private value生成`Bound`。 |

#### 14.5 `ImageAdapterSlot`

```rust
/// Declares one planned infra seam slot and its local availability marker without implementing an adapter.
pub struct ImageAdapterSlot {
    /// The named seam category in this repository.
    pub slot_kind: ImageAdapterSlotKind,
    /// Dependency classification retained from the module seam matrix.
    pub seam_kind: DependencySeamKind,
    /// Latest local availability observation for the slot.
    pub availability: ImageAdapterAvailability,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `slot_kind` | `ImageAdapterSlotKind` | seam identity | planned infra composition；不等 provider implementation。 |
| `seam_kind` | `DependencySeamKind` | 依赖分类 | Step 5 matrix；必须保持compile/runtime/event/ref/adapter/fake实际分类。 |
| `availability` | `ImageAdapterAvailability` | local composition marker | `ImageAdapterAvailabilityMarker` / runtime validation；不表达外部结果。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn requires_real_adapter(&self) -> bool` | 判断production composition是否需real adapter | 无 | `bool` | `FakeOnly`/`Blocked`/`Unknown`均不能用于production positive path。 |
| `pub fn apply_availability(&mut self, marker: &ImageAdapterAvailabilityMarker) -> Result<(), DomainError>` | 更新本slot的local availability | marker | `Result<(), DomainError>` | exact slot kind匹配；不创建 adapter、不改变domain truth。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn declare(slot_kind: ImageAdapterSlotKind, seam_kind: DependencySeamKind) -> Result<Self, DomainError>` | 声明未验证slot | kind/seam classification | `Result<ImageAdapterSlot, DomainError>` | runtime builder planning；初始 `Unknown`，不默认available。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| slot不是adapter | 本对象不能有 client、SDK、endpoint、credential、provider response或port method。 |
| seam分类不漂移 | Member Service/runtime/ref/adapter消费关系不能仅因slot存在变成Cargo compile dependency。 |
| unavailable不等业务失败 | `Blocked/Unknown/FakeOnly` 仅指导composition和safe application分支，不把外部lane结果改写为failed。 |

#### 14.6 `ImageAdapterAvailabilityMarker`

```rust
/// Records one safe local conclusion about an infra slot; it does not report a build, gate, registry, Artifact, or consumer outcome.
pub struct ImageAdapterAvailabilityMarker {
    /// Slot described by this conclusion.
    pub slot_kind: ImageAdapterSlotKind,
    /// Conservative local availability.
    pub availability: ImageAdapterAvailability,
    /// Safe explanation for non-available states.
    pub reason: Option<SafeReason>,
    /// Local observation time.
    pub observed_at: UtcTimestamp,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `slot_kind` | `ImageAdapterSlotKind` | marker归属slot | runtime builder / adapter validation明确提供。 |
| `availability` | `ImageAdapterAvailability` | 保守结论 | future composition validation / fake mode；不能由provider HTTP status代替。 |
| `reason` | `Option<SafeReason>` | non-available解释 | `Blocked`/`Unknown`/`FakeOnly` 必须Some，`Available`必须None。 |
| `observed_at` | `UtcTimestamp` | local validation time | application/infra clock port；不是external action time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_production_usable(&self) -> bool` | 判断是否可用于production assembly | 无 | `bool` | 仅 `Available`，不含`FakeOnly`。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn record(slot_kind: ImageAdapterSlotKind, availability: ImageAdapterAvailability, reason: Option<SafeReason>, observed_at: UtcTimestamp) -> Result<Self, DomainError>` | 记录local slot conclusion | slot/kind/reason/time | `Result<ImageAdapterAvailabilityMarker, DomainError>` | runtime builder validation / fake composition；factory校验reason/state一致。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| availability不能升格领域事实 | `Available` 不表示mapping合法、component兼容、build成功、digest验证、gate passed、Artifact accepted、entry available或consumer确认。 |
| fake明确隔离 | `FakeOnly` 只能与 `ImageFakeMode::TestOnly` 共同出现，Step 7/16需验证其不进入production composition。 |
| 外部状态不泄漏 | marker不存SDK error、URL、secret、raw response或service health。 |

#### 14.7 `ImageRuntimeAssemblyState`

```rust
/// Aggregates local composition validation inputs without starting a runtime, process, worker, job scheduler, or container.
pub struct ImageRuntimeAssemblyState {
    /// Body-free configuration reference state.
    pub config: ImageRuntimeConfigRef,
    /// Declared infra seam slots in deterministic order.
    pub slots: Vec<ImageAdapterSlot>,
    /// Explicit production or test-only fake boundary.
    pub fake_mode: ImageFakeMode,
    /// Local composition lifecycle.
    pub lifecycle: ImageRuntimeAssemblyLifecycle,
    /// Safe blocked explanation.
    pub reason: Option<SafeReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `config` | `ImageRuntimeConfigRef` | config前置 | `Bound`或`Blocked`；不泄漏content。 |
| `slots` | `Vec<ImageAdapterSlot>` | composition seam列表 | slot kind排序去重；需要的slot集合由后续runtime builder/port matrix收敛，不能凭此造provider。 |
| `fake_mode` | `ImageFakeMode` | test/prod boundary | explicit factory input；不得由环境隐式切换。 |
| `lifecycle` | `ImageRuntimeAssemblyLifecycle` | composition state | `start` 初始 `Unassembled`。 |
| `reason` | `Option<SafeReason>` | blocked解释 | `Blocked`时Some，`Unassembled/Assembled`时None。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn validate(&mut self) -> Result<ImageRuntimeAssemblyLifecycle, DomainError>` | 归纳config、slot和fake边界的local assembly state | 无 | `Result<ImageRuntimeAssemblyLifecycle, DomainError>` | `Unassembled -> Assembled/Blocked`；不实例化adapter/process。 |
| `pub fn block(&mut self, reason: SafeReason) -> Result<(), DomainError>` | 显式阻止composition | safe reason | `Result<(), DomainError>` | `Unassembled -> Blocked`；不得默认恢复。 |
| `pub fn is_assembled(&self) -> bool` | 判断local composition是否通过 | 无 | `bool` | 仅`Assembled`；不等 runtime/service readiness。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn start(config: ImageRuntimeConfigRef, slots: Vec<ImageAdapterSlot>, fake_mode: ImageFakeMode) -> Result<Self, DomainError>` | 建立composition validation context | body-free config/slots/mode | `Result<ImageRuntimeAssemblyState, DomainError>` | infra runtime builder；初始`Unassembled`，不启动任何I/O。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| assembled不等ready | `Assembled`只表示本仓local composition验证通过；没有server、worker、job、container、external adapter or consumer success结论。 |
| production拒绝fake | `Production`下任何`FakeOnly` slot必须导致`Blocked`；不允许silent fallback。 |
| 未选择产品 | slot列表与config ref不确定DB/broker/builder/registry/evidence/transport产品或部署拓扑。 |

### 14.8 Infra 模块内停审

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| config/slot/availability/composition/fake是否有稳定归属 | `pass` | 每个carrier在infra有唯一归属；具体port和adapter implementation留Step 7。 |
| `Assembled`是否未被误写成readiness | `pass` | 明确不表示process/container/worker/scheduler/external/consumer成功。 |
| product/secret/raw config是否未进入对象 | `pass` | 仅body-free config ref和safe reason；Q-MI-003保持开放。 |
| fake是否隔离 | `pass` | `TestOnly`和`FakeOnly`不得进入production composition；test parity留Step 7/16。 |
| sibling compile依赖是否未偷渡 | `pass` | slot/seam只记录classification，当前无active sibling Cargo dependency。 |

## 15. `api` / `worker` / `jobs`：entry 闭口 / defer 与必要 local marker

### 15.1 `api`：明确 defer，不创建 entry object

| 项目 | Step 6 结论 | 理由 | 正确承接 |
|---|---|---|---|
| 独立 API handler / mapper object | `defer` | transport、route/RPC、public request/result、authorization、serialization均未获 authority；`OperationMetadata` 和application carrier已足以承接内部语义 | Step 8 protocol、Step 9 synchronous handler flow、Step 12 error mapping、Step 14 config binding。 |
| API runtime/process state | `not owned` | 本仓无 server/topology/readiness owner | 不创建。 |
| API outcome / external surface | `defer` | 不得让 stored local result shell冒充 public DTO/HTTP response | Step 8。 |

`api` 当前唯一可以消费的对象是 `ImageOperationContext::from_query/from_write` 的 future mapping结果和 contracts safe carrier；它不能直接构造 domain object、调用repository或持有infra adapter。该结论本身是 Step 6 闭口，不表示 API 已存在。

### 15.2 `worker`：conditional inbound marker

```rust
/// A local marker for the currently unverifiable inbound-event boundary; it is not an envelope, topic, receipt, or broker-process state.
pub struct InboundContractMarker {
    /// Conditional inbound family whose authority/schema is not yet usable.
    pub state: InboundContractState,
    /// Safe explanation of the unavailable, rejected, or reopen condition.
    pub reason: Option<SafeReason>,
    /// Local observation time.
    pub observed_at: UtcTimestamp,
}
```

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续 Step 承接 |
|---|---|---|---|---|
| 显式暴露 conditional inbound event 的当前不可用边界 | `MI-UP-005` pending、safe local boundary diagnosis | `InboundContractMarker` | unavailable / rejected / reopen-required；不写 truth | Step 7 conditional source/dedup port；Step 8 event schema；Step 9 consumer flow。 |

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `state` | `InboundContractState` | current conditional input disposition | `MI-UP-005`未闭口时只能 `Unavailable` / `Rejected` / `ReopenRequired`；不是broker receipt。 |
| `reason` | `Option<SafeReason>` | fail-closed说明 | `Unavailable` / `Rejected`必须Some；`ReopenRequired`可说明future authority条件；无payload。 |
| `observed_at` | `UtcTimestamp` | local marker time | application/infra clock；不是event time或delivery receipt time。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn rejects_writes(&self) -> bool` | 判断worker是否必须拒绝写入 | 无 | `bool` | 在当前所有state为true；不创建 intent/snapshot/candidate。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn unavailable(reason: SafeReason, observed_at: UtcTimestamp) -> Self` | 建立当前无formal authority的marker | safe reason/time | `InboundContractMarker` | worker composition/current boundary；不读broker。 |
| `pub fn rejected(reason: SafeReason, observed_at: UtcTimestamp) -> Self` | 记录无法验证的conditional input | safe reason/time | `InboundContractMarker` | future worker prevalidation failed path；不存envelope。 |
| `pub fn reopen_required(reason: Option<SafeReason>, observed_at: UtcTimestamp) -> Self` | 记录未来需正式重新打开的边界 | optional safe reason/time | `InboundContractMarker` | authority/schema later closes前的explicit marker。 |

| enum 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `InboundContractState::Unavailable` | `No formal inbound event authority/schema is currently usable.` | 表示当前无可用 formal inbound contract | `InboundContractMarker::unavailable` | worker safe rejection；不得写 BuildIntent。 |
| `InboundContractState::Rejected` | `An input was rejected because owner, identity, version, or schema was not verified.` | 表示未来接收输入后的安全拒绝 | `InboundContractMarker::rejected` | local disposition/result shell；不得产生receipt/candidate。 |
| `InboundContractState::ReopenRequired` | `A future formal contract may reopen this entry after its authority is verified.` | 表示设计重开点 | `InboundContractMarker::reopen_required` | Step 7~9 future re-evaluation；非accepted state。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| current write path is closed | `MI-UP-005`未闭口时，worker不得创建 verified envelope、topic、receipt、dedup record、intent或candidate。 |
| no broker/process truth | marker不表示broker可达、message arrival、consumer started、delivery或observability。 |
| application only | 未来闭口后worker也只能映射到application，不能直接save repository或调用domain transition。 |

### 15.3 `jobs`：bounded action marker

```rust
/// Names one bounded local maintenance action without defining a scheduler, lease, cursor, run identifier, report, evidence, or execution fact.
pub struct ImageJobActionMarker {
    /// The declared bounded action kind.
    pub action_kind: ImageJobActionKind,
    /// Safe reason when the action cannot safely proceed.
    pub reason: Option<SafeReason>,
}
```

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续 Step 承接 |
|---|---|---|---|---|
| 命名已获概要支持的 bounded maintenance 语义 | selected `ImageJobActionKind`、optional safe reason | `ImageJobActionMarker` | 仅action identity/blocked说明；不证明执行 | Step 7 technical/repository/UoW port、Step 8 job carrier、Step 9 job flow、Step 11~16 execution semantics。 |

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `action_kind` | `ImageJobActionKind` | bounded job identity | 仅六项概要已列动作；不能增加scheduler、release/publish或evidence action。 |
| `reason` | `Option<SafeReason>` | 当前不能行动的安全解释 | `None`仅表示未表达local blocker，不等action已运行/成功；不得存run/report/evidence。 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_maintenance_only(&self) -> bool` | 验证action未越权为owner truth repair | 无 | `bool` | 六个现有动作均true；不表达已执行。 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn declare(action_kind: ImageJobActionKind, reason: Option<SafeReason>) -> Self` | 建立job action marker | bounded kind/optional reason | `ImageJobActionMarker` | jobs runner future entry；没有scheduler或run metadata。 |

| enum 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `ImageJobActionKind::NightlyBuildSweep` | `Select persisted buildable revisions and request build intents.` | 从已持久化buildable revision选择intent候选 | future jobs/application flow | `BuildIntent` request or safe blocked；不等build成功。 |
| `ImageJobActionKind::ReconcileBuildAttempts` | `Reconcile persisted build attempts against safe external conclusions.` | 对existing attempt做保守reconciliation | future jobs/application flow | new safe outcome/gap/new context；不得盲重试unknown。 |
| `ImageJobActionKind::ReevaluatePendingQualifications` | `Reevaluate persisted pending qualification contexts.` | 重新评估persisted pending qualification | future jobs/application flow | new evaluation/decision/gap；不得默认gate pass。 |
| `ImageJobActionKind::RefreshExternalReferenceSnapshots` | `Refresh body-free external reference snapshots.` | 刷新body-free source observations | future jobs/reference flow | new snapshot/gap/freshness；不反写core truth。 |
| `ImageJobActionKind::RebuildImageDerivedViews` | `Rebuild read-only image-derived views from committed truth.` | 重建只读view | future jobs/projection flow | fresh/stale/unavailable marker；不修复truth。 |
| `ImageJobActionKind::ReconcileArtifactAndConsumerHandoffs` | `Reconcile local Artifact and consumer handoff gaps.` | 重新检查local handoff/gap context | future jobs/application flow | new gap/resolution context；当前pending不伪accept/confirm。 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| no scheduler/run/report | marker无cron、lease、cursor、run_id、report、evidence、verdict、signoff或实际执行状态。 |
| maintenance不修复truth | job可选择已持久化scope并调用application；不能自行改变相邻owner truth或绕过domain guard。 |
| unknown不盲重试 | BuildAttempt unknown、external source unknown、gate unknown均走safe resolution/new context，不由marker指示重复副作用。 |

### 15.4 entry 模块内停审

| 模块 | 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|---|
| `api` | 是否在无authority下避免伪造handler/route/DTO | `pass` | 完全defer；只消费未来 application/contracts carrier。 |
| `worker` | 是否有唯一conditional状态carrier且未造envelope/receipt | `pass_with_pending` | `InboundContractMarker` + `InboundContractState`；MI-UP-005保持开放。 |
| `jobs` | 是否只保留bounded action且未造scheduler/run/report/evidence | `pass` | `ImageJobActionMarker` + enum；执行语义留后续Step。 |
| all entries | 是否直接访问domain/repository/adapter | `pass` | 均只能未来调用application facade；Step 7/9闭合具体调用面。 |

## 16. 全局审计、回填草稿与 Step 7 承接门禁

本节只审计 Step 6 已定义的对象契约是否可以被后续 Step 逐项承接；不提前定义 port 方法、DTO body、函数级流程、持久化 schema、真实配置、测试结果或实施事实。所有“future”均是设计承接点，不能被理解为已经存在的实现或 readiness。

### 16.1 高复用字段来源审计

| 字段 / 字段族 | 出现对象组 | 正式类型 / 唯一归属 | 允许来源 | 后续闭合位置 | 禁止推导 / 实现暂停条件 |
|---|---|---|---|---|---|
| `*_id` / `ImageLocalId` | 五组 local truth、gap、trace、projection、idempotency、stored result | `contracts::ImageLocalId` | future application `IdGeneratorPort`；repository load仅可重建 | Step 7 ID port；Step 11 persistence | domain、adapter、entry、repository均不得自行 mint；无正式 source 时停止实现。 |
| `LocalObjectRef` 与 typed `*Ref` | local relation、history、trace、projection、application replay | `contracts`，`LocalObjectKind` 精确绑定 | object `to_ref()`、factory、repository load | Step 7 repository；Step 8 protocol；Step 11 persistence | 禁止裸 ID、row ID、route、title、string prefix；factory/`to_ref()`与接收方必须 exact-kind reject。 |
| `OpaqueReference` 与 named external `*Ref` | mapping/component/seed/build/evidence/Artifact/consumer/gap | `contracts`，owner + kind + opaque identity + optional immutable revision | approved future resolver/adapter safe output、formal owner input、repository load | Step 7 resolver/adapter；Step 14 binding | 禁止 payload、manifest、SDK type、secret、raw log、live state；owner/kind不符时停。 |
| `VerifiedContentIdentityRef` / immutable image ref | outcome、candidate、entry pin、provenance | `contracts` | future approved safe conclusion，验证源必须是 body-free ref | Step 7 build/registry seam；Step 9 build flow | 禁止 tag/`latest`/registry presence/本仓计算 digest；没有 verification source 时不得形成 candidate/entry。 |
| `OperationMetadata` | command/conditional event/job context、trace、idempotency | `contracts::metadata` | validated entry metadata + future clock；query不使用 | Step 8 protocol；Step 9 flow；Step 13 idempotency | actor/source不等 auth；禁止 payload hash/random text替代 key/correlation。 |
| `ImageOperation*` / UoW / result carriers | application context、idempotency、stored result | `application`，非 `contracts` | future protocol-to-application mapping、ID/clock/canonicalizer/store | Step 7 UoW/result/idempotency port；Step 8 protocol；Step 13 replay | channel/result kind不得变 transport/receipt/report；stored shell不得引用或保存 DTO body。 |
| lifecycle / `SafeReason` / `SafeDisposition` | domain truth、gap、projection、infra、entry marker | `contracts`（domain/entry state）或 `application`（technical replay state） | factory、domain guard、safe adapter conclusion、formal resolution | Step 10 state matrix；Step 12 error recovery | `VerifiedUsable`/`Assembled`/`Available` 均非全局 ready；原因不含 raw external error。 |
| `UtcTimestamp` / `LocalObjectVersion` | all persisted carrier、history、trace、infra marker | `contracts` | future `ClockPort` / repository load | Step 7 clock/repository；Step 11/13 consistency | timestamp不是 external execution time；version不是 image/artifact revision、digest、cursor或 lock token。 |
| `TruthWatermark` / `SafeStageSummary` | projection freshness/read model | `domain::reference` helper | committed local truth scan + local clock | Step 7 projection read port；Step 9 rebuild flow；Step 11 storage | 不能从 projection/cache/fake/external body 生成；fresh只表示 read watermark。 |
| `ImageRuntimeConfigRef` / adapter availability / fake mode | infra composition | `infra` | future config validation、explicit composition、safe local observation | Step 7 adapter implementation；Step 14 config | 不含 key/value/secret/URL/topic/cron/product；availability不改变 domain truth。 |
| `InboundContractMarker` / `ImageJobActionMarker` | worker/jobs entry | entry modules | current boundary diagnosis / future application mapping | Step 7~9 entry seam/flow；Step 12~16 later semantics | 不造 event envelope/topic/receipt/scheduler/run/report/evidence；worker/jobs不得直连 repository。 |

### 16.2 对象组字段来源审计

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| `contracts` identity/ref/metadata/reason/state | `LocalObjectRef`、`OpaqueReference`、`OperationMetadata`、`SafeReason` | ID/ref/metadata均有 typed carrier、exact-kind/owner与 body-free 边界；domain/entry state 与 application technical state的归属已分开 | Step 7 source/ID/clock ports；Step 8 DTO；Step 10/12 state/error | DTO或对象字段需要外部 body、裸字符串、未定义 typed ref，或 enum缺逐 variant承接时停止。 |
| DefinitionAssembly | `AssemblyBaseline`、`VariantRevision` | app ID/clock、family/variant local refs、mapping snapshot、component pin、seed/base safe refs、pure guard | Step 7 mapping/component/seed/base resolver + repository；Step 8/9 input/flow；Step 10 state | mapping/RoleDefinition、release/seed正文、live memory/workspace或 mutable selector才可构造时停止。 |
| BuildCandidate | `BuildIntent`、`BuildInputSnapshot`、`BuildAttempt`、`CandidateImage` | revision/baseline/local refs、static binding identity、safe handoff/execution/outcome/image ref、local reason/time | Step 7 builder/registry/store; Step 8/9 build protocol/flow; Step 10/11 state/persistence | ACK、tag、registry presence、unknown outcome或本地猜测 digest 被要求形成 candidate 时停止。 |
| Qualification | `ProvenanceBinding`、`GateEvaluation`、`EligibilityDecision`、`ArtifactHandoffRecord` | candidate/snapshot local refs，safe execution/output/evidence/gate/Artifact refs，formal gap/resolution slots | Step 7 evidence/gate/Artifact/repository ports；Step 8/9 protocol/flow；Step 10 | Q-MI-004 gate inventory、MI-UP-007 Artifact schema/ref或证据 body被要求自造时停止。 |
| SupplyEntry | `AvailabilityTransition`、`InstantiableEntry`、`ConsumerHandoffGap` | local entry/history refs、verified immutable image, provenance/eligibility refs、formal consumer contract/confirmation slots | Step 7 consumer/supply repository; Step 8/9 protocol/flow; Step 10/11 | host/container/session/launch/health替代 pin/eligibility，或 MI-UP-001未闭口却要求 resolved/confirmed 时停止。 |
| ReferenceDerived | `ExternalReferenceSnapshot`、`ContractGap`、`ProjectionFreshness`、`ImageDerivedReadModel` | safe external refs/conclusions、committed local truth watermark、typed local refs、clock | Step 7 source/projection/trace/gap ports；Step 8 query; Step 9 rebuild/reconcile; Step 11 | snapshot/projection/fake被要求作为 owner truth或反写 core truth时停止。 |
| application | `ImageOperationContext`、`ImageIdempotencyRecord`、`StoredImageOperationResult` | validated metadata、application ID/clock、future canonical stable-input ref、本地 result shell ref | Step 7 UoW/idempotency/result store；Step 8 DTO/result surface；Step 13 replay | duplicate没有正式 lookup，或需保存 DTO/receipt/report body才可重放时停止，不得重跑。 |
| infra | `ImageAdapterSlot`、`ImageRuntimeAssemblyState` | planned seam class、body-free config ref、explicit fake mode、safe local availability | Step 7 adapter/store implementations；Step 14 config | 需要选定 provider、secret、runtime/container lifecycle或把 availability升格为业务结果时停止。 |
| api/worker/jobs | `InboundContractMarker`、`ImageJobActionMarker` | future validated application mapping，现阶段仅 fail-closed marker/action identity | Step 7 entry seams；Step 8 protocol；Step 9 flows | API route/DTO、worker envelope/topic/receipt、job schedule/run/report被当作 Step 6 object 需要时停止。 |

### 16.3 状态闭环审计

| 状态族 | 状态主语 | 初始状态 / 来源 | 关键迁移 | 终态 / 特殊状态 | 后续 Step 闭合位置 |
|---|---|---|---|---|---|
| DefinitionAssembly | definition / baseline / revision | `Draft`、`Incomplete`、`Proposed` 来自各 factory | resolved / complete / buildable 只能经 local guard；gap/invalid走 visible negative state | `Blocked`、`Conflict`、`Invalid`、`Superseded` 不隐式复活 | Step 9 flow、Step 10 matrix、Step 16 object/state tests。 |
| BuildCandidate | intent / snapshot / attempt / candidate | intent accepted/pending；snapshot capture；attempt created；candidate guard | handoff/outcome/candidate formation严格分步 | `Cancelled`、`Failed`、`Rejected`、`Blocked`、`Unknown` 均需新 context或safe resolution | Step 7 builder/registry ports、Step 9 flow、Step 10 matrix、Step 12 recovery。 |
| Qualification | provenance / gate / eligibility / Artifact handoff | bind/open/decide/open factory | provenance complete、gate passed、eligible分别独立；Artifact accepted只在 formal contract closed 后 | conflict/failed/ineligible/blocked/gap保持分层；`Accepted` 当前 conditional | Step 7 evidence/Artifact ports、Step 9 flow、Step 10 matrix。 |
| SupplyEntry | transition / entry / consumer gap | proposed transition、unavailable entry、open gap | guard后才 committed/available；consumer resolution另行验证 | rejected/superseded/retired/history与open/stale gap不重写 local supply；resolved当前 conditional | Step 7 consumer/repository ports、Step 9 flow、Step 10 matrix。 |
| ReferenceDerived | snapshot / contract gap / projection freshness | capture/open/start | snapshot valid仅限 declared use；rebuild只从 committed truth；gap按 lane block | stale/conflict/unavailable、blocked/resolved/expired、rebuilding/unavailable均不改变 core truth | Step 7 projection/source ports、Step 8 query、Step 9 flow、Step 10 matrix。 |
| application technical | context/UoW/idempotency/stored result | query=`ReadOnly`; write=`ReadWrite`; reservation=`Reserved` | `Reserved -> Completed/Conflict`; duplicate只 lookup | completed/conflict不回 reserved；stored shell无 protocol body | Step 7 store/UoW、Step 8 protocol、Step 13 idempotency。 |
| infra composition | config ref / slot / assembly | config `Bound/Blocked`; slot `Unknown`; assembly `Unassembled` | validate -> `Assembled/Blocked`; fake只 TestOnly | `Assembled`/`Available` 只是 local composition，不是 service/runtime readiness | Step 7 adapter, Step 14 config, Step 16 fake boundary tests。 |
| entry disposition/action | worker marker / job action | inbound unavailable/rejected/reopen; job is declared action | future verified event 才能重开；job flow才能有结果 | no accepted envelope, broker receipt, scheduler/run lifecycle in current object model | Step 7~9; Step 12 error, Step 16 entry tests。 |

### 16.4 命名、typed-ref exact-kind 与跨模块依赖审计

| 审计项 | 结论 | 证据 / 约束 | 未满足时处置 |
|---|---|---|---|
| 唯一对象归属 | `pass` | domain truth/guard按五 capability归 `domain`; application channel/UoW/idempotency/result归 `application`; infra composition归 `infra`; entry marker只归其 entry。 | 不得将 application technical type回填到 `contracts`；新增对象先重做归属审计。 |
| typed local ref exact kind | `pass` | `LocalObjectKind`、`LocalObjectRef`与各 typed `*Ref` 有一一对应（包括 `MappingSourceSnapshot`）；factory/`to_ref()`/接收字段均要求 exact kind。 | raw ID / wrong-kind /未定义 wrapper 一律拒绝，Step 7 repository不得绕过。 |
| external ref owner/kind | `pass_with_pending` | §6.3.1 已逐项限定 owner/kind/use；formal Artifact、consumer、event、Core fields仍 pending。 | 未闭口 owner input只能形成 safe ref/gap/blocker，不得复制 body或写 positive contract。 |
| module dependency direction | `pass` | `contracts -> domain -> application`; infra implements future application ports; entry只调用application。 | domain不得读取I/O/config/SDK/sibling；application不得依赖concrete infra；entry不得直连domain/repository。 |
| seam classification | `pass` | compile/runtime/event/ref/adapter/fake均保留为 `DependencySeamKind`; current sibling Cargo dependency = zero。 | 不得因消费关系加 Cargo path dependency；Core只在 MI-UP-004关闭后重核验。 |
| no outbound publication model | `pass` | current object model没有 outbound event、outbox、publisher或delivery state。 | Step 7不得私加 publisher/outbox；若权威出现须从上游重新开放设计。 |
| template / seed / build product / live state | `pass` | seed仅 `StaticSeedKind` + static placement；candidate/entry是本仓阶段对象；live memory/checkpoint/workspace/container state不进入。 | 任何live state字段或试图把 template当运行态时停止并回报边界冲突。 |
| readiness vocabulary | `pass` | 不存在 global ready；`VerifiedUsable`/`Buildable`/`Eligible`/`Available`/`Assembled`各有 local stage含义。 | 任何实现/文档把阶段状态推导整体 readiness须撤回并重审。 |

### 16.5 Step 7 Trait / Port / Adapter 承接清单

| Step 7 契约组 | 必须承接的 Step 6 内容 | Step 7 输出要求 | 若未承接的实现 blocker |
|---|---|---|---|
| ID / clock / canonical input | `ImageLocalId`、`UtcTimestamp`、`OperationMetadata`、`StableOperationInputRef` | application-owned `IdGeneratorPort`、`ClockPort`、stable-input canonicalization boundary；明确 owner、failure和no-digest claim | factory无法获得 ID/time；idempotency会伪造 hash/digest。 |
| DefinitionAssembly repository + ref resolver | family/variant/baseline/revision/snapshot/pin/seed guards的 typed field来源 | get/list/save + mapping/component/seed/base safe resolver contracts；明确 compile/runtime/ref/adapter relation | 无法构造/加载 guard 所需 local refs，或需读取外部 body。 |
| BuildCandidate repository + builder/registry seam | intent/snapshot/attempt/outcome/candidate、safe content identity | local persistence port与 builder/registry safe conclusion port；unknown/availability/handoff semantics；不产生 real digest | candidate/outcome无法安全判定；ACK/tag被误用。 |
| Qualification repository + evidence/gate/Artifact seam | provenance/gate/eligibility/handoff、formal resolution slots | evidence/gate applicability / Artifact safe-ref resolver；exact pending condition、gap/reopen behavior | gate inventory/Artifact ref被本仓私造，或 accepted无 formal ref。 |
| Supply repository + Member Service consumer seam | transition/entry/consumer gap、pin guard、confirmation/ref slots | local supply persistence、consumer contract/ref/confirmation resolver；明确 ref relation非源码依赖 | entry/handoff gap无读取面，或将 consumer state当本仓 truth。 |
| Reference/projection/trace/gap repository | snapshot/gap/freshness/read model/trace/watermark | source snapshot、gap、projection, trace read/write ports；projection rebuild source和 no-writeback guard | projection identity/watermark/trace subject靠实现猜补。 |
| UoW / idempotency / stored result | `ImageUnitOfWorkBoundary`、reservation/result shell、coordinator carriers | UoW mode、atomic write boundary、reserve/get/complete/conflict/result lookup interfaces；no DTO body in shell | duplicate只能重跑；transaction与state change无法对齐。 |
| infra composition / adapter / fake | config ref、slot, availability marker, assembly state, fake mode | infra implementations map only to application ports; explicit production/test composition and fail-closed slot handling | concrete provider/secret/SDK/health被塞入domain/application，或 fake进入production。 |
| conditional worker / bounded job entry seam | inbound marker、job action marker、channel constraints | conditional source validation/dedup seam and bounded job scope seam；MI-UP-005的 reopen precondition必须明确 | event/topic/receipt、scheduler/run/report被无authority实现。 |
| cross-seam audit | all typed refs, reason/state, adapter availability, dependency classification | one seam matrix covering owner, direction, failure, fake, mapping to application port; no publisher/outbox | port隐含 sibling compile dependency或positive external result。 |

### 16.6 正式 `03-详细设计.md` 回填草稿

| 正式章节 | 回填来源 | 回填内容 | 装配前提 / 注意 |
|---|---|---|---|
| §5 模块实现契约 / `contracts` | §6、§16.1、§16.4 | typed ID/ref、metadata、safe reason/disposition、domain/entry lifecycle以及 exact-kind/owner约束 | 仅在 Step 19 装配；application technical carrier不误归 `contracts`。 |
| §5 / five `domain` capabilities | §8~§12、§16.2~§16.3 | 每个对象卡、字段/工厂/函数/不变量、state来源与分层边界 | 保留 field source和禁止事项；不引入 port/DTO/flow细节。 |
| §5 / `application` | §13、§16.1、§16.3 | operation/UoW/idempotency/result shell与五 coordinator identity | stored result 无 DTO/body/self-reference；port留Step 7。 |
| §5 / `infra` | §14、§16.1、§16.3 | config ref/slot/availability/assembly/fake carrier | 不写 product/secret/runtime process/readiness。 |
| §5 / entries | §15、§16.1、§16.3 | api defer、worker conditional marker、jobs action marker | 不伪造 route/topic/envelope/receipt/schedule/run/report。 |
| §5 收口摘要与 §6 global index | §5、§16.2~§16.5 | shared vocabulary、non-core closure/defer、field/state audit摘要、Step 7承接、全对象索引 | 仅在 Step 19 且后续Step不冲突时装配；不得将本过程表原样当正式正文。 |

### 16.7 pending / blocker 与本批结论

| 编号 / 类别 | 当前状态 | Step 6 收敛口径 | 后续正式闭合 / 实现 blocker |
|---|---|---|---|
| `MI-UP-001` Member Service consumer contract/manifest/ref/confirmation | `pending` | 仅 `ConsumerHandoffGap`、typed consumer ref slots和 `DecisionLane::ConsumerHandoff`；不写 resolved/confirmation实例。 | Step 7 consumer seam、Step 8/9 contract/flow；未闭口时不实现 positive consumer handoff。 |
| `MI-UP-002` Member release / compatibility | `pending` | member仅 component release safe ref；不拥有 member truth。 | Step 7 component resolver；未闭口时 baseline/revision保持 incomplete/blocked。 |
| `MI-UP-004` conditional Core shared contract | `pending` | `Core` 是 conditional owner；当前 active sibling Cargo dependency为零。 | Step 7 only after formal closure and path/package recheck；否则不得写 Cargo dependency。 |
| `MI-UP-005` inbound build/source event | `pending` | 仅 `InboundContractMarker::Unavailable/Rejected/ReopenRequired`；无 envelope/topic/receipt/dedup fact。 | Step 7~9 reopening；未闭口时 worker write path关闭。 |
| `MI-UP-007` Artifact handoff | `pending` | `ArtifactHandoffRecord` 只可 Pending/Gap；`Accepted`需 Artifact ref+formal resolution ref。 | Step 7 Artifact seam；未闭口时无 accepted handoff。 |
| `MI-UP-009` outbound build/release event | `pending` | outbound event inventory为零；无 outbox/publisher/delivery object。 | 若权威形成，必须重新打开范围/Step而非私造。 |
| `Q-MI-003` product/config/backend choice | `pending` | infra只表达 config ref/slot/availability/fake；不选产品。 | Step 14 / 04；未闭口时不写 provider config。 |
| `Q-MI-004` gate/evidence inventory and priority | `pending` | gate只消费 authority-owned safe ref/conclusion；不复制 inventory。 | Step 7/8/9；未闭口时无法 positive `Passed` lane。 |

本 Step 结论：所有既定对象组已按模块写出可落码的类型、字段、factory、函数、状态与禁止事项；高复用字段、对象组来源、状态、命名和跨 seam 均已完成审计。未闭口内容已被限定为 future port/protocol/flow/matrix/config/test 承接点或显式 pending，不构成 Step 6 内应继续私造的 schema。

### 16.8 Step 6 完成检查与停审门禁

| 检查项 | 结论 | 依据 |
|---|---|---|
| 写入批次 6.0~6.10 是否完整 | `pass` | §1 批次、§6~§15对象卡与本节全局审计已覆盖。 |
| shared carrier / typed ref / public marker是否有归属 | `pass` | `contracts` 与 `application` technical carrier的归属已区分；没有跨 sibling public Rust contract。 |
| five domain capability与non-core对象是否闭口/defer清楚 | `pass` | §8~§15及§1.3分别记录 domain、application、infra、api、worker、jobs。 |
| 每个 enum variant 是否有 Rustdoc与逐项审计 | `pass` | enum代码块均有 `///`；§6.3.1、§6.4、§6.5~§6.7.1、§13.3、§14.3、§15有逐项表。 |
| 字段来源与状态闭环是否完成 | `pass` | §16.1~§16.3。 |
| Step 7 承接是否按 port/repository/resolver/adapter逐项命名 | `pass` | §16.5。 |
| 正式03 / Step7 / implementation是否未提前创建 | `pass` | 本轮仅修改 Step 6 calibration；正式03、Step7、实现仓、Cargo、测试、证据、commit均未创建。 |
| 用户授权边界 | `stop_review_required` | 用户仅授权 Step 6；下一步必须等待用户明确确认 Step 7。 |

**停审结论：**Step 6 已完成，当前不得创建 `03_ddd_step_07_trait_port_adapter_contracts.md`、不得装配正式 `03-详细设计.md`、不得实现或提交。唯一允许的后续动作是在用户再次明确同意后，先读取本文件 §16.5、Step 7 SOP/书写规范与项目/flow 台账，再开启 Step 7。
