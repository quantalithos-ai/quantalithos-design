# L2-member-images 03 详细设计 Step 7：逐模块定义 Trait / Port / Adapter 契约

> 创建日期：2026-08-26  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7  
> 回填位置：正式 `03-详细设计.md` 第 5 章各模块的 Trait / Port / Adapter 契约及第 6 章索引（当前仅为 calibration，禁止装配正式 03）  
> 当前授权：用户已明确同意仅进入 Step 7。完成本文件后必须停审；未经再次明确确认不得创建 Step 8。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 恢复入口 | 已先读取 `project_execution_ledger.md`、`03_ddd_calibration_flow.md`、Step 6 §16.5、Step 5 模块契约、Step 5~9 的 L1-governance 粒度校准、Step 7 SOP/书写规范，以及 02 的接口骨架、处理流和状态输入。 |
| 直接输入 | `03_ddd_step_05_module_contracts.md`、`03_ddd_step_06_object_contracts.md`、`02_hld_step_07_api_interface_skeleton.md`、`02_hld_step_08_processing_flows.md`、`02_hld_step_09_state_machine.md`、`02_hld_step_12_detailed_design_handoff.md`、`02_hld_step_13_risks_open_questions.md`。 |
| 参照方法 | 参照 `L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` 的逐模块、逐接缝、逐函数、模块停审和跨接缝闭环形式；不复制其 outbox、publisher、治理对象、外部产品、run/report 或已闭合正向合同。 |
| 本步目标 | 在 Step 6 的对象、字段、状态和 guard 基础上，定义 application-owned 的 technical / repository / resolver / store port、infra 的 implementation / blocked / fake 边界，以及 api / worker / jobs 的调用限制。 |
| 本步产出上限 | 定义 Rust-facing trait、参数、返回、错误、读取面、expected-version、UoW、append-only、projection / replay和adapter安全边界；不定义公共 DTO / route / topic / event envelope / job report / DDL / retry算法。 |
| 本步禁止 | 不读取旧正式 `03-详细设计.md`；不创建实现仓、Cargo、代码、测试、artifact、digest实例、run_id、report、evidence、readiness、commit 或 Step 8。 |
| 外部边界 | 对 Runtime、Tools、Member、Method Library、Artifact、Member Service、Governance、Core 等未闭口内容，port 只接收/返回 typed body-free ref、safe conclusion、`blocked` / `unavailable` / `unknown` / gap 或 reopen condition；不得私造 body、schema、source dependency、digest、accepted handoff、consumer confirmation 或发布结果。 |

## 1. Step 内计划、批次与模块门禁

### 1.1 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---:|---|---|---|---|---|
| 7.0 | 开工框架、port 归属、错误 / helper /写入门禁 | `done` | 是 | `pass` | 7.1 |
| 7.1 | application technical port：Clock、ID、UoW、version / page、canonical-input边界 | `done` | 是 | `pass_with_blocked_canonical_input` | 7.2 |
| 7.2 | DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry local truth repository ports | `done` | 是 | `pass` | 7.3 |
| 7.3 | reference / projection / trace / gap / idempotency / stored-result port | `done` | 是 | `pass_with_defer` | 7.4 |
| 7.4 | mapping / component / seed、builder / registry、evidence / Artifact、Member Service external seams | `done` | 是 | `pass_with_blockers` | 7.5 |
| 7.5 | infra implementation matrix、blocked/fake parity、entry restrictions | `done` | 是 | `pass_as_contract` | 7.6 |
| 7.6 | 模块停审、Step 6 open-item closure、跨接缝审计、回填草稿和停审门禁 | `done` | 是 | `completed_stop_review` | 用户确认 Step 8 |

### 1.2 本 Step 模块执行顺序

| 顺序 | 模块 / 接缝组 | 本轮要收稳的能力 | 主要输入 | 完成后停审点 |
|---:|---|---|---|---|
| 1 | `application` shared / technical | ID、clock、UoW、version / page、canonical stable input、受限 port 错误 | Step 6 contracts/application carrier | 所有 ID/time/version来源唯一；query 不开写 UoW；尚未有协议 schema 的 canonical input 不假装已可用。 |
| 2 | `application` DefinitionAssembly repository | family / variant / baseline / revision / mapping snapshot 的 versioned读取和保存 | §8 对象能力与 02 definition flow | 必需的 cross-object load、history list、save/UoW/expected-version 成对存在。 |
| 3 | `application` BuildCandidate repository | intent / snapshot / attempt / outcome / candidate 的读取、保存和 unknown恢复读取面 | §9 与 02 build flow | handoff/ACK 不替代 outcome；unknown recovery可列出既有 attempt。 |
| 4 | `application` Qualification / Supply repository | provenance / gate / eligibility / Artifact handoff，transition / entry / consumer gap | §10~§11 与 02 qualification/supply flow | Artifact/consumer owner truth 不落本仓；local history和current entry读取面闭合。 |
| 5 | `application` ReferenceDerived / replay | snapshot、gap、trace、projection、truth snapshot、idempotency/result 的读写和重建面 | §12~§13 与 02 query/job flow | projection只读且有 existing-view lookup；duplicate不重跑。 |
| 6 | `application` external seams | mapping/component/seed、builder/registry、evidence/gate/Artifact、Member Service、conditional inbound | Step 5 seam 分类与 pending | 每个外部seam均只有安全 carrier；pending seam无正向 branch。 |
| 7 | `infra` / entries | implementation、composition、fake、api/worker/jobs访问限制 | §14~§15 stable carrier | fake不入生产；entry 不绕过application；无 publisher/outbox。 |

## 2. SOP 问题回答

| SOP 问题 | 本步收敛回答 |
|---|---|
| 哪些模块需要定义 trait / port？ | 仅 `application` 定义 repository、technical、resolver、replay / projection 与 external seam port。`contracts` / `domain` 不定义 infrastructure port；`infra` 只实现；`api` / `worker` / `jobs` 只调用 application facade。 |
| 哪些模块负责实现这些 trait / port？ | `infra` 的 planned durable store、blocked adapter、test-only fake、clock / ID 与 composition 文件实现 application port。实现不反向进入 `application`、`domain` 或 sibling crate。 |
| 哪些能力需要接缝？ | 所有本仓 truth mutation、versioned query、append-only trace、projection rebuild、reference snapshot、gap维护、idempotency replay、build observation和受控 handoff都需要接缝。domain transition / guard 保持 pure，不调用 port。 |
| 每个 port 承接什么？ | 本文每节的 capability / 接缝清单逐项回指 Step 6 对象能力、字段来源、状态或 02 flow；没有对象能力或后续 flow 的 port 不新增。 |
| 读取面是否覆盖 Step 8~11？ | 对 local truth 采用 `get_*_with_version`、必要 history/list/current lookup；对 projection 采用 existing-view index / freshness / committed truth snapshot；对 replay 采用 reserve / result load。公共 page DTO、外部 envelope、route和job report仍留 Step 8。 |
| 写入版本和事务如何闭合？ | mutable local truth / marker 必须以 `Versioned<T>` 的 `LocalObjectVersion` 取得 `ExpectedLocalObjectVersion::Exact`；新对象只用 `Absent`；save 统一接受 `&dyn ImageUnitOfWork`。trace是 append-only，不带 expected-version。 |
| 哪些依赖只能通过 port？ | 所有 local persistence、clock/ID、external resolver、builder/registry、evidence / Artifact、Member Service、configuration availability 都只能经 application-owned port；不得直接导入 SDK、数据库、broker、sibling Cargo crate或外部 body。 |
| pending external contract 如何处理？ | `MI-UP-001/002/004/005/007/009`、`Q-MI-003/004` 受影响 seam 只定义 blocked / unavailable / unknown / gap / reopen 条件。当前不存在 `PublisherPort`、outbox port、outbound payload、delivery state或正向 consumer/Artifact acceptance。 |

## 3. 当前材料诊断与设计取舍

| 诊断项 | 若不收稳的风险 | 本 Step 处置 |
|---|---|---|
| Step 6 已定义 33 个对象，但未写 repository读取面 | Step 9 会以裸 ID、字符串、cache 或 fake map 猜补 cross-object load和current事实 | 用 typed ref + `Versioned<T>` + 明确 list/current lookup 闭合本仓 local persistence面。 |
| `LocalObjectVersion` 已存在但尚无 expected-version 语义 | 新建与更新可能混用 timestamp、row-id或无版本覆盖 | 新建只允许 `ExpectedLocalObjectVersion::Absent`；更新必须从同一对象的 versioned read取得 `Exact`。 |
| `StableOperationInputRef` 尚无具体 DTO canonicalization | 实现者可能把 payload hash、image digest、event body或随机文本当幂等 identity | 仅定义 application-owned canonicalization boundary；协议字段未闭口前标记不可调用，不假称已生成 digest。 |
| `ImageDerivedReadModel` 缺少按 scope稳定查找面的明确 port | query/rebuild 可能从 variant string、projection cache或私有 map 猜 view identity | 定义 `ImageProjectionLookupKey`、existing-view index和 committed-truth snapshot port；public view DTO / id 仍留 Step 8。 |
| Builder / Artifact / Member Service 的 owner-side contract 未闭口 | adapter可能返回 ACK、tag、provider body、consumer observed state并被误升级为成功 | 外部 port 只表达安全 reference conclusion / blocked result；Artifact 和 Member Service 当前仅可返回 gap/reopen，不给 accepted/confirmation 分支。 |
| L1-governance 有 outbox/publisher，但本仓无 outbound authority | 机械复制会凭空定义 event、payload、delivery和提交语义 | 明确 absence 是设计结论：本 Step 不创建 PublisherPort、outbox repository、delivery state或 outbound flow。 |

### 3.1 关键取舍

| 方案 | 收益 | 风险 / 代价 | 决定 |
|---|---|---|---|
| A. 用一个万能 `Repository` + `String` key | 表面简短 | 不能保护 exact-kind、读取面、version和 capability owner | 不采用。 |
| B. 每个 object 一律拆独立 crate / port | 表面隔离强 | 过度拆分，跨对象 flow 仍会缺少本 capability 的一致读取面 | 不采用；按五 capability 各自的 application repository port分组。 |
| C. capability repository + typed object method | 所有对象仍有明确 get/save/list，且 application coordinator能完整读取同组事实 | port 文件较长，需要统一审计 | 采用。 |
| D. 以 adapter ACK / config availability 直接写 local truth | 少一层判断 | 会把 build、gate、Artifact、consumer及运行事实混同 | 不采用；adapter结果先是 safe conclusion / unavailable / unknown。 |
| E. 先为 pending owner 写完整正向 adapter DTO | 看似方便日后对接 | 单方伪造 Method Library、Member、Artifact、Member Service 或 event contract | 不采用；仅保留 typed ref / reason / gap/reopen seam。 |

## 4. 模块级 port 归属总览

| 模块 | 是否定义 port | 是否实现 port | 是否可直接访问 port | 结论 |
|---|---|---|---|---|
| `contracts` | 否 | 否 | 否 | 只提供 workspace-internal typed carrier；不得依赖 application / domain / infra 或成为 sibling public contract。 |
| `domain` | 否 | 否 | 否 | 只提供 object、guard、state、`DomainError`；不得读取 repository、adapter、config、SDK或 external body。 |
| `application` | 是 | 否 | 是 | 唯一 port owner；协调 UoW、version、idempotency、local truth与受限外部seam。 |
| `infra` | 否 | 是 | 否 | 实现 durable / blocked / fake adapter；不得增加业务决定或 owner truth。 |
| `api` | 否 | 否 | 否 | 未来仅将 Command/Query DTO 映射到 application facade；不得访问 repository/domain/adapter。 |
| `worker` | 否 | 否 | 否 | 当前只能暴露 unavailable/rejected/reopen marker；正式 authority 后也只能调用 application consumer facade。 |
| `jobs` | 否 | 否 | 否 | 未来只触发 bounded action facade；不得拥有 scheduler、run、report、evidence或直接存储访问。 |

#### 模块调用图：application-owned port 反转依赖

```text
[api] ----- call ----> [application facade] ---- call ----> [domain]
                              |
                              | port call
                              v
                         [application ports]
                              ^
                              | impl
                         [infra adapters]

[worker] -- conditional call -> [application facade]
[jobs] ------ bounded call ---> [application facade]
```

关键说明：

- 图表达代码依赖和调用方向，不表达 HTTP、broker、scheduler、container或部署拓扑。
- `infra` 只能实现 application 所有的 trait；application 不导入 concrete infra、SDK或 sibling crate。
- worker 当前没有可写入的 verified-event path；jobs 也没有 outbound publisher path。

## 5. Shared application port helper、错误与写入门禁

### 5.1 application-local helper 与版本语义

以下类型属于 planned `crates/application/src/ports.rs` 或 `unit_of_work.rs`。它们不是 public protocol DTO，也不得进入 `contracts`、sibling schema、外部 body 或 Cargo dependency。

```rust
/// application 内部事务的 opaque 标识，仅用于同一次本地 UoW 的诊断与 fake parity。
pub struct ImageTransactionRef(pub NonEmptyText);

/// 描述一次保存是新建对象还是基于已加载版本更新。
pub enum ExpectedLocalObjectVersion {
    /// 仅允许当前对象尚不存在时创建；不得用于覆盖既有对象。
    Absent,
    /// 仅允许与 versioned read 返回的版本完全一致时更新。
    Exact(LocalObjectVersion),
}

/// repository 内部分页游标；不等同 local object version、truth watermark 或 public page token。
pub struct ImageRepositoryCursor(pub NonEmptyText);

/// application repository 的稳定分页请求；仅供内部读取面使用。
pub struct ImageRepositoryPageRequest {
    /// 前一页返回的 opaque cursor；第一页为 None。
    pub after: Option<ImageRepositoryCursor>,
    /// 调用方请求的最大条数；具体上限由未来配置/实现约束，不由本类型暗设默认值。
    pub limit: u32,
}

/// repository 返回的分页结果；公共 Query page DTO 必须在 Step 8 单独映射。
pub struct ImageRepositoryPage<T> {
    /// 按该读取面声明的稳定排序返回的条目。
    pub items: Vec<T>,
    /// 下一页的 opaque cursor；None 表示没有后续页。
    pub next_after: Option<ImageRepositoryCursor>,
}

/// 一个持久化本仓对象及其唯一可用于下一次 optimistic write 的版本。
pub struct Versioned<T> {
    /// 已提交或由同一 UoW 暂存的本仓对象值。
    pub value: T,
    /// 仅由对应 repository versioned read/save 返回的 optimistic version。
    pub version: LocalObjectVersion,
}
```

| helper | 作用 | 正式来源 / 禁止替代 |
|---|---|---|
| `ImageTransactionRef` | 把同一 UoW 的 repository / fake断言关联起来 | 只能由 `ImageUnitOfWorkManager::begin` 产生；不得用 correlation、timestamp、idempotency key、run id或 string 临时拼接。 |
| `ExpectedLocalObjectVersion` | 区分新建与更新 | `Absent` 仅来自尚未存在的 object factory；`Exact` 仅来自同对象 `Versioned<T>.version`；不能用 external revision、image tag、digest、page cursor或 watermark。 |
| `ImageRepositoryCursor` | 内部 stable pagination | 只表示读取位置；不得作为 version、object ref、public cursor或 source cursor。 |
| `ImageRepositoryPageRequest/Page<T>` | 统一 local list reading surface | 各 port 必须声明排序和 empty 语义；Step 8 如对外分页，必须独立定义 contracts page DTO 和映射。 |
| `Versioned<T>` | 使 read 与 optimistic write配对 | 所有 mutable truth / marker save 的 expected version唯一来源；append-only trace不使用它。 |

### 5.2 application port 错误面

`ImageApplicationError` 是本 Step port 函数的最小安全错误面。它不替代 Step 12 的 retry、transport、日志和恢复设计；不携带 SQL、HTTP、SDK、broker、secret、payload、trace正文或 fake私有状态。

```rust
/// application port 可安全表达的失败类别；完整错误映射留 Step 12。
pub enum ImageApplicationError {
    /// domain factory、guard或transition拒绝了本仓输入。
    Domain(DomainError),
    /// 以 typed local ref 读取对象时未找到已提交对象。
    NotFound {
        /// 请求的本仓对象。
        subject_ref: LocalObjectRef,
    },
    /// optimistic write 的 expected version 与当前已提交版本不一致。
    VersionConflict {
        /// 发生冲突的本仓对象。
        subject_ref: LocalObjectRef,
        /// 调用方从 versioned read 获得的版本。
        expected: LocalObjectVersion,
        /// repository 当前观察到的版本；缺失时不得被解释为可创建。
        observed: Option<LocalObjectVersion>,
    },
    /// local store 或外部 seam 当前不可安全使用。
    Unavailable {
        /// 脱敏、结构化的阻断原因。
        reason: SafeReason,
    },
    /// port 返回值、typed-ref、UoW mode或adapter boundary违反了已声明契约。
    ContractViolation {
        /// 不含 raw transport / provider 细节的安全原因。
        reason: SafeReason,
    },
    /// 同一 stable key ��用于不同 input/channel/operation 的幂等冲突。
    IdempotencyConflict {
        /// 已标准化的冲突原因。
        reason: ImageIdempotencyConflictReason,
    },
    /// replay 所指的本地 result shell 或其 replay body不存在或不匹配。
    StoredResultMissing {
        /// 请求读取的 replay result 引用。
        result_ref: ImageOperationResultRef,
    },
    /// UoW 无法开始、提交或回滚；不暴露底层实现错误。
    TransactionBoundary {
        /// 安全的本地事务边界原因。
        reason: SafeReason,
    },
}
```

| error variant | 允许来源 | 调用方当前处理上限 | 禁止事项 |
|---|---|---|---|
| `Domain` | 已定义 `DomainError` | Step 8/12 再映射 protocol；当前不得重写为 provider success/failure | 不吞掉为 `None` 或自动重试。 |
| `NotFound` | exact typed local ref lookup | command 可形成安全拒绝；query 的 missing surface后续定义 | 不用裸 ID、generic ref或scan fallback重建。 |
| `VersionConflict` | versioned save / marker save | future flow 必须停止当前 mutation并走 Step 12/13 口径 | 不以 save retry、timestamp或 last-write-wins覆盖。 |
| `Unavailable` | blocked slot、owner pending、safe adapter conclusion | 形成 blocked/unavailable/gap，不得生成正向 domain state | 不暴露 SDK/SQL/HTTP 原因。 |
| `ContractViolation` | exact kind、UoW、page、adapter / fake boundary校验 | fail closed | 不通过 fake private map或配置绕过。 |
| `IdempotencyConflict` | `ImageIdempotencyRecord` same key / different stable input | 返回安全冲突 surface | 不重跑 mutation。 |
| `StoredResultMissing` | duplicate lookup未找到 matching replay body | 停止 replay并交给恢复设计 | 不重算当前 truth或 job scan伪造旧结果。 |
| `TransactionBoundary` | UoW manager | rollback后所有 staged local write不可见 | 不泄露底层 exception。 |

### 5.3 写入与读取的统一门禁

| 写入类别 | 读取前置 | 写入函数要求 | UoW / version 口径 | 禁止事项 |
|---|---|---|---|---|
| mutable local truth / marker | 对既有对象使用 `get_*_with_version` 或 versioned list；新对象确认不存在 | `save_*` 均接受 `ExpectedLocalObjectVersion` 和同一 write UoW | `Absent` 新建；`Exact(loaded.version)` 更新 | repository 自行 mint ID、无版本覆盖、用 external version。 |
| append-only trace | typed subject / source ref已由 application / domain形成 | `append_trace` 接受完整 `ImageTraceRecord` 和 UoW | 无 expected-version；与关联 local truth / result 同一 UoW时由 flow决定 | update/delete旧 trace、拿 trace 反写 truth。 |
| projection / freshness | 仅 committed truth snapshot和 existing public projection slot | view / marker save 使用 versioned读取值 | `ImageDerivedReadModel` / `ProjectionFreshness` 各自 versioned save | 从 cache/fake/external body重建或临时造 view ref。 |
| idempotency / replay | validated write context + future canonical stable input | reserve、save replay、complete均在同一 UoW | reservation/version/result 顺序在 §11 闭合 | duplicate重新执行业务 mutation / job。 |
| external seam | typed ref / local object仅用于构造受控 request | adapter只返回 safe ref / conclusion / blocked | external call不是 local transaction commit证据 | ACK、2xx、tag、cache命中直接save candidate/eligible/available。 |

## 6. Application 基础 technical port 契约（7.1）

### 6.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| 为所有 Step 6 object factory提供 local ID | `ImageIdGeneratorPort` | five coordinator、reference/projection/replay service | `infra::clock_id` / test fake | Step 8 DTO→factory，Step 9 flow，Step 11 persistence。 |
| 为 metadata、snapshot、history、marker提供 local time | `ImageClockPort` | application service / jobs / infra composition validation | `infra::clock_id` / test fake | Step 9 ordering，Step 10 transitions。 |
| 形成 write transaction boundary | `ImageUnitOfWork` / `ImageUnitOfWorkManager` | application write service | `infra::repositories` / test fake | Step 9 flow、Step 11 transaction。 |
| 为 read/save提供 version/page carrier | §5.1 helpers | all repository callers | each infra store / fake | Step 8 public page mapping，Step 11 store。 |
| 为 idempotency提供 stable body-free input identity | `ImageOperationInputCanonicalizerPort` | application write facade only | future infra canonicalizer / test fake | Step 8 concrete input fields，Step 13 idempotency；当前尚不可正向调用。 |

#### 6.2 `ImageClockPort`

```rust
/// 为本仓记录、snapshot、marker 和 append-only trace 提供可信的 local time。
pub trait ImageClockPort {
    /// 返回当前本仓记录时点；不是外部构建完成、consumer确认或运行时状态时点。
    fn now(&self) -> UtcTimestamp;
}
```

| 函数 | 使用方 / 字段来源 | 禁止事项 |
|---|---|---|
| `now` | `OperationMetadata.recorded_at`、baseline/snapshot/attempt/outcome/decision/transition/trace/marker/replay的 local time | 不从 adapter body、registry时间、event payload、DB默认值或 runtime live state静默取代。 |

#### 6.3 `ImageIdGeneratorPort`

```rust
/// 为所有本仓 local object 和 application carrier 生成 opaque local ID。
pub trait ImageIdGeneratorPort {
    /// 生成一个尚未绑定具体 object kind 的本仓 opaque ID；kind 由接收 factory / typed ref校验。
    fn new_local_id(&self) -> ImageLocalId;
}
```

| 覆盖对象组 | 生成位置 | 不变量 |
|---|---|---|
| DefinitionAssembly / BuildCandidate / Qualification / SupplyEntry / ReferenceDerived 所有 local object | coordinator 在调用 domain factory前 | domain、repository、adapter、api、worker、jobs不得拼接或自增 ID。 |
| `ImageIdempotencyRecord` / `StoredImageOperationResult` / replay附属 carrier | application reservation / result assembly前 | 不是 idempotency key、external ref、digest、run id或 DB row id。 |
| `ProjectionFreshness` / `ImageDerivedReadModel` / `ImageTraceRecord` | projection / trace application flow | 只能与 typed object factory结合；不由 query请求或 cache 临时构造。 |

#### 6.4 `ImageUnitOfWork` 与 `ImageUnitOfWorkManager`

```rust
/// 一个 application-owned 本地写事务句柄；不暴露数据库、锁、连接或 provider client。
pub trait ImageUnitOfWork {
    /// 返回此写事务的 opaque local 标识，用于同一事务内的 port / fake一致性断言。
    fn transaction_ref(&self) -> &ImageTransactionRef;

    /// 返回该事务允许的 application mutation mode。
    fn mode(&self) -> ImageUnitOfWorkMode;
}

/// 创建、提交和回滚本仓 local write UoW 的 application-owned port。
pub trait ImageUnitOfWorkManager {
    /// 为一个 `ReadWrite` boundary 创建 local write UoW；ReadOnly boundary 必须被拒绝。
    async fn begin(
        &self,
        boundary: &ImageUnitOfWorkBoundary,
    ) -> Result<Box<dyn ImageUnitOfWork>, ImageApplicationError>;

    /// 原子提交已经由 application stage 的 local truth、marker、trace、replay 和 reservation写入。
    async fn commit(
        &self,
        unit_of_work: Box<dyn ImageUnitOfWork>,
    ) -> Result<(), ImageApplicationError>;

    /// 回滚同一 UoW 的全部 staged local write；rollback 后不得读取到任何 staged truth、trace、freshness或result。
    async fn rollback(
        &self,
        unit_of_work: Box<dyn ImageUnitOfWork>,
    ) -> Result<(), ImageApplicationError>;
}
```

| 阶段 | 正式口径 |
|---|---|
| `begin` | 只接受 `ImageUnitOfWorkBoundary.mode=ReadWrite` 且 `mutable_kinds` 合法非空的 write operation；query不调用它。 |
| read / guard | Step 9 的 write flow 在取得 UoW 后读取需要 optimistic write 的对象，获得 `Versioned<T>`；domain guard只消费已加载对象。 |
| stage | 同一 UoW 内可 stage 本次 local truth、append-only trace、受影响 existing projection freshness、stored replay和 idempotency completion；具体哪些对象由每条 flow定义。 |
| commit | 只有全部 required local write成功时提交；外部 adapter ACK、consumer observed state、publisher delivery和container状态不是 commit依据。 |
| rollback | 任一 local write / version / result / contract失败时回滚全部 staged local write；不把 rollback后对象、trace、result或freshness暴露给 query/replay。 |

#### 6.5 `ImageOperationInputCanonicalizerPort`：受控但当前 blocked 的 canonical-input边界

`StableOperationInputRef` 已由 Step 6 定义，但 Command / Event / Job 的完整字段 schema 依法留在 Step 8。因此本 Step 只定义 canonicalization 的 owner、禁止事项与 reopen gate，**不声称当前任一协议已经有可调用的 canonical input**。

```rust
/// 由 Step 8 的每个独立 protocol mapper 实现的、可验证的 operation input 视图。
/// 当前 Step 不定义其字段，避免从 pending DTO、event payload 或 job report猜补。
pub trait CanonicalImageOperationInput {
    /// 返回被 canonicalization 的稳定 application operation identity。
    fn operation_name(&self) -> &ImageOperationName;

    /// 返回该输入所属的 write channel；Query 不得实现或传入本 trait。
    fn channel(&self) -> ImageOperationChannel;
}

/// 把已由 protocol mapper 完整收稳的 write input 映射为 body-free stable input identity。
pub trait ImageOperationInputCanonicalizerPort {
    /// canonicalize 只在 Step 8 已为该 operation 定义字段级 source / optional / mismatch规则后可调用。
    async fn canonicalize(
        &self,
        context: &ImageOperationContext,
        input: &dyn CanonicalImageOperationInput,
    ) -> Result<StableOperationInputRef, ImageApplicationError>;
}
```

| 项 | 当前结论 |
|---|---|
| owner | `application` 拥有 port；`infra` 未来实现；api/worker/jobs仅在已完成 protocol mapper 后调用 application facade，不能自行 hash。 |
| 允许输入 | 仅 Step 8 为某一 operation 字段级闭合后的 typed local ref、typed external body-free ref、safe reason / action value与显式 optional语义。 |
| 禁止输入 | raw DTO / event body / job report、payload bytes、image digest、Artifact digest、tag、timestamp、correlation、idempotency key本身、route、topic、fake private map、config和 provider response。 |
| 当前状态 | `blocked_for_positive_use`。每个 Command、conditional inbound和Job在 Step 8 定义独立 canonical input后，才可将本 port移入可实施 flow；此前 reservation / replay只能作为设计承接，不得实现。 |
| reopen 条件 | Step 8 必须为每个 write protocol完成 DTO字段、selector、typed-ref source、optional语义、canonical ordering与same-key/different-input语义；Step 13 再收稳并发/重入细节。 |

### 6.6 application technical port 停审记录

| 审查项 | 结论 | 缺口 / 后续 |
|---|---|---|
| ID / clock是否有唯一 owner和实现方向 | `pass` | `application` 定义、`infra` 实现；具体 generator产品不选。 |
| version/page helper是否不泄漏为 public DTO | `pass` | Step 8 必须另定义 public page/view schema。 |
| UoW读写、commit/rollback是否已界定 | `pass` | 每个具体 flow 的 object顺序与 store schema留 Step 9 / 11。 |
| canonical stable input是否未伪装为 digest | `pass_with_blocker` | `CanonicalImageOperationInput` 字段必须等 Step 8；当前不能实现 reservation正向路径。 |
| query是否避免 idempotency / write UoW | `pass` | `ReadOnly` query只用 repository read surface。 |

## 7. DefinitionAssembly local truth repository port（7.2 / 模块一）

### 7.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| family / variant 建立、关联、阻断、supersede | family / variant versioned get、identity lookup、save | `DefinitionAssemblyCoordinator` | `infra::repositories` / fake | DefineImageVariant、definition query、Step 11 uniqueness。 |
| immutable baseline capture / supersede | baseline exact get、按 variant list、save | `DefinitionAssemblyCoordinator` | `infra::repositories` / fake | CaptureAssemblyBaseline、derivation query。 |
| revision proposal、buildability读取、supersede | revision exact get、current-by-variant、list、save | `DefinitionAssemblyCoordinator`、Build coordinator | `infra::repositories` / fake | ProposeVariantRevision、RequestBuildIntent、Step 10 revision state。 |
| mapping snapshot读取与保存 | mapping snapshot exact get / latest-by-ref、save | Definition / Reference coordinator | `infra::repositories` / fake | mapping refresh、baseline / revision guard。 |

### 7.2 `DefinitionAssemblyRepositoryPort`

`DefinitionAssemblyRepositoryPort` 只保存本仓 `ImageFamilyDefinition`、`ImageVariantDefinition`、`AssemblyBaseline`、`VariantRevision` 与 `MappingSourceSnapshot`。它不保存 Method Library mapping body、RoleDefinition、component / seed body、live memory、runtime / tools / member state或任何 provider response。

```rust
/// 提供 DefinitionAssembly local truth 的 typed、versioned读取与写入面。
pub trait DefinitionAssemblyRepositoryPort {
    /// 按 exact local family ref 读取 family 与其 optimistic version；缺失返回 None。
    async fn get_family_with_version(
        &self,
        family_ref: &ImageFamilyDefinitionRef,
    ) -> Result<Option<Versioned<ImageFamilyDefinition>>, ImageApplicationError>;

    /// 按本仓安全 family name 查找已存在 family；同名多条必须返回 ContractViolation，不允许任意选择。
    async fn find_family_by_name_with_version(
        &self,
        family_name: &NonEmptyText,
    ) -> Result<Option<Versioned<ImageFamilyDefinition>>, ImageApplicationError>;

    /// 保存新建或经 versioned read 修改的 family。
    async fn save_family(
        &self,
        family: &ImageFamilyDefinition,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ImageFamilyDefinition>, ImageApplicationError>;

    /// 按 exact local variant ref 读取 variant 与其 optimistic version；缺失返回 None。
    async fn get_variant_with_version(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
    ) -> Result<Option<Versioned<ImageVariantDefinition>>, ImageApplicationError>;

    /// 按 family读取其所有 variant，canonical sort 为 local variant id 升序；空页表示该 family当前无 variant。
    async fn list_variants_by_family(
        &self,
        family_ref: &ImageFamilyDefinitionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ImageVariantDefinition>>, ImageApplicationError>;

    /// 保存新建或经 versioned read 修改的 variant。
    async fn save_variant(
        &self,
        variant: &ImageVariantDefinition,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ImageVariantDefinition>, ImageApplicationError>;

    /// 按 exact baseline ref读取 immutable baseline与版本；缺失返回 None。
    async fn get_baseline_with_version(
        &self,
        baseline_ref: &AssemblyBaselineRef,
    ) -> Result<Option<Versioned<AssemblyBaseline>>, ImageApplicationError>;

    /// 按 variant列出 baseline history，按 captured_at、baseline local id升序；仅返回本仓baseline，不反查外部静态输入正文。
    async fn list_baselines_by_variant(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<AssemblyBaseline>>, ImageApplicationError>;

    /// 保存新建或只允许状态 / supersede字段变更的 baseline；infra不得改写 immutable input字段。
    async fn save_baseline(
        &self,
        baseline: &AssemblyBaseline,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<AssemblyBaseline>, ImageApplicationError>;

    /// 按 exact revision ref读取 revision与版本；缺失返回 None。
    async fn get_revision_with_version(
        &self,
        revision_ref: &VariantRevisionRef,
    ) -> Result<Option<Versioned<VariantRevision>>, ImageApplicationError>;

    /// 读取某 variant当前 active revision；没有 pointer或pointer失效返回 None，不从 history猜补。
    async fn find_active_revision_by_variant_with_version(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
    ) -> Result<Option<Versioned<VariantRevision>>, ImageApplicationError>;

    /// 按 variant列出 revision history，按 created_at、revision local id升序，包含 buildable / invalid / superseded历史。
    async fn list_revisions_by_variant(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<VariantRevision>>, ImageApplicationError>;

    /// 列出仍可作为 build-intent 输入的 persisted buildable revision；仅用于明确的 query / job scope，不能代替 scheduler选择。
    async fn list_buildable_revisions(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<VariantRevision>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 revision。
    async fn save_revision(
        &self,
        revision: &VariantRevision,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<VariantRevision>, ImageApplicationError>;

    /// 按 exact mapping snapshot ref读取本仓 snapshot与版本；缺失返回 None。
    async fn get_mapping_snapshot_with_version(
        &self,
        snapshot_ref: &MappingSourceSnapshotRef,
    ) -> Result<Option<Versioned<MappingSourceSnapshot>>, ImageApplicationError>;

    /// 按 body-free mapping source ref读取该定义用途下最新 snapshot；没有本地 snapshot返回 None，不访问 Method Library。
    async fn find_latest_mapping_snapshot_by_source_with_version(
        &self,
        mapping_ref: &MappingSourceRef,
    ) -> Result<Option<Versioned<MappingSourceSnapshot>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 mapping snapshot；只能保存 safe conclusion / validity，不保存 mapping body。
    async fn save_mapping_snapshot(
        &self,
        snapshot: &MappingSourceSnapshot,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<MappingSourceSnapshot>, ImageApplicationError>;
}
```

| 读取 / 写入面 | 读取键或 version 来源 | missing / conflict 语义 | 不能替代 |
|---|---|---|---|
| exact `get_*_with_version` | corresponding typed local ref；返回的 `Versioned<T>.version` 是后续同对象 save唯一 `Exact` 来源 | missing = `Ok(None)`；wrong kind = `ContractViolation` | 裸 ID、route参数、名称猜测、external ref。 |
| `find_family_by_name_with_version` | `NonEmptyText family_name` | no match = `None`；多行 = `ContractViolation` | 任取第一条、case/normalization私补。 |
| `list_*_by_variant/family` | typed scope ref + internal page | empty = 空 page；scope wrong-kind = error | 全库 scan、variant label、Role / mapping body。 |
| active / latest lookup | local relation ref 或 typed mapping ref | missing pointer/snapshot = `None`；关系不一致 = `ContractViolation` | 从 history newest / external body自动猜 current。 |
| `save_*` | complete local object + `Absent` / matching `Exact` + same write UoW | duplicate create / version mismatch = `VersionConflict`；UoW mode不符 = `ContractViolation` | repository auto-mint、upsert、silent merge、immutable field rewrite。 |

### 7.3 DefinitionAssembly 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| family、variant、baseline、revision、mapping snapshot 是否均有 typed read/save | `pass` | 全部只读/写本仓 local truth；domain guard仍不直接访问port。 |
| revision→BuildCandidate 所需读取面 | `pass` | `get_revision_with_version` 和 `list_buildable_revisions` 已闭合；Job 的具体 scope DTO留 Step 8。 |
| baseline immutable / history语义 | `pass` | save只允许 factory / transition后的对象；Step 11 再定义持久化层防改字段策略。 |
| Method Library / component / seed body是否泄漏 | `pass` | port只保存 `MappingSourceSnapshot` 的 body-free carrier；resolver另在 7.4 定义。 |
| version / UoW来源是否闭合 | `pass` | existing object only来自 `Versioned<T>`；new object使用 `Absent`。 |

## 8. BuildCandidate local truth repository port（7.2 / 模块二）

### 8.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| intent request / pending / block / cancel | intent exact get、find by revision / metadata scope、save | `BuildIntentCoordinator` | `infra::repositories` / fake | RequestBuildIntent、nightly sweep。 |
| immutable snapshot capture / validation | snapshot exact get、find by intent/revision、save | Build coordinator | `infra::repositories` / fake | attempt precondition、build trace query。 |
| external attempt observation / unknown recovery | attempt exact get、list active / recoverable、save | Build coordinator、reconcile job | `infra::repositories` / fake | RecordBuildOutcome、ReconcileBuildAttempts。 |
| safe outcome storage | outcome exact get、find by attempt、save | Build coordinator | `infra::repositories` / fake | candidate formation / provenance。 |
| candidate formation / qualification handoff | candidate exact get、find by attempt / image ref、save | Build / Qualification coordinator | `infra::repositories` / fake | EvaluateCandidateEligibility、trace query。 |

### 8.2 `BuildCandidateRepositoryPort`

```rust
/// 提供 BuildCandidate local truth、immutable snapshot 与 side-effect observation 的 typed persistence 接缝。
pub trait BuildCandidateRepositoryPort {
    /// 按 exact intent ref读取 intent与版本；缺失返回 None。
    async fn get_intent_with_version(
        &self,
        intent_ref: &BuildIntentRef,
    ) -> Result<Option<Versioned<BuildIntent>>, ImageApplicationError>;

    /// 读取同一 revision下仍处于 accepted/pending/blocked/cancelled历史的 intents；按 local intent id升序。
    async fn list_intents_by_revision(
        &self,
        revision_ref: &VariantRevisionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<BuildIntent>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 local build intent。
    async fn save_intent(
        &self,
        intent: &BuildIntent,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<BuildIntent>, ImageApplicationError>;

    /// 按 exact snapshot ref读取 immutable build input snapshot与版本；缺失返回 None。
    async fn get_snapshot_with_version(
        &self,
        snapshot_ref: &BuildInputSnapshotRef,
    ) -> Result<Option<Versioned<BuildInputSnapshot>>, ImageApplicationError>;

    /// 读取某 revision下既有 snapshot context；按 captured_at、snapshot local id升序，不从 baseline重新临时构造。
    async fn list_snapshots_by_revision(
        &self,
        revision_ref: &VariantRevisionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<BuildInputSnapshot>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 snapshot；不得由 store添加输入、digest或 live state。
    async fn save_snapshot(
        &self,
        snapshot: &BuildInputSnapshot,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<BuildInputSnapshot>, ImageApplicationError>;

    /// 按 exact attempt ref读取 attempt与版本；缺失返回 None。
    async fn get_attempt_with_version(
        &self,
        attempt_ref: &BuildAttemptRef,
    ) -> Result<Option<Versioned<BuildAttempt>>, ImageApplicationError>;

    /// 读取一个 intent下的 attempts，按 created_at、attempt local id升序，保留 failed / unknown / superseded历史。
    async fn list_attempts_by_intent(
        &self,
        intent_ref: &BuildIntentRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<BuildAttempt>>, ImageApplicationError>;

    /// 列出可被 reconciliation 明确检查的 pending / unknown attempts；只返回既有本仓记录，不触发外部查询或重试。
    async fn list_reconcilable_attempts(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<BuildAttempt>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 attempt；outcome / supersede transition必须先由 domain验证。
    async fn save_attempt(
        &self,
        attempt: &BuildAttempt,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<BuildAttempt>, ImageApplicationError>;

    /// 按 exact outcome ref读取安全 build outcome conclusion与版本；缺失返回 None。
    async fn get_outcome_with_version(
        &self,
        outcome_ref: &BuildOutcomeConclusionRef,
    ) -> Result<Option<Versioned<BuildOutcomeConclusion>>, ImageApplicationError>;

    /// 读取一个 attempt已经保存的安全 outcome；没有时返回 None，不以 handoff / ACK / tag合成 outcome。
    async fn find_outcome_by_attempt_with_version(
        &self,
        attempt_ref: &BuildAttemptRef,
    ) -> Result<Option<Versioned<BuildOutcomeConclusion>>, ImageApplicationError>;

    /// 保存本仓安全 outcome conclusion；每个 attempt至多一个当前 outcome，重复不同 conclusion必须显式冲突。
    async fn save_outcome(
        &self,
        outcome: &BuildOutcomeConclusion,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<BuildOutcomeConclusion>, ImageApplicationError>;

    /// 按 exact candidate ref读取 candidate与版本；缺失返回 None。
    async fn get_candidate_with_version(
        &self,
        candidate_ref: &CandidateImageRef,
    ) -> Result<Option<Versioned<CandidateImage>>, ImageApplicationError>;

    /// 按 attempt读取 candidate；未形成或 negative / unknown lane时返回 None，不从 immutable image ref猜 candidate。
    async fn find_candidate_by_attempt_with_version(
        &self,
        attempt_ref: &BuildAttemptRef,
    ) -> Result<Option<Versioned<CandidateImage>>, ImageApplicationError>;

    /// 按 immutable image ref查找已记录的 candidate；仅 exact immutable typed ref可用，多个 local candidate绑定同一 image ref时返回 ContractViolation。
    async fn find_candidate_by_image_with_version(
        &self,
        image_ref: &ImmutableImageRef,
    ) -> Result<Option<Versioned<CandidateImage>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 candidate；不得把 registry presence或 adapter ACK自动写为 Formed。
    async fn save_candidate(
        &self,
        candidate: &CandidateImage,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<CandidateImage>, ImageApplicationError>;
}
```

| 读取 / 写入面 | 读取面覆盖 | missing / conflict 语义 | 禁止事项 |
|---|---|---|---|
| intent/snapshot exact + list | Request、nightly、snapshot capture和 trace都可回读本仓语境；snapshot 只持有 `revision_ref`，因此按 revision 列表读取 | missing = `None`；page empty = no record | 以 revision label、job name、scheduler tick或 event body推 intent，或杜撰 snapshot→intent 关系。 |
| attempt exact + reconcilable list | outcome记录、unknown recovery、reconcile job | list仅枚举 existing pending/unknown；不启动 external effect | 全表无界扫描、从 adapter私有状态生成 attempt。 |
| outcome exact / by attempt | candidate guard所需安全 outcome | absent outcome = `None`，不会升格 handoff | ACK、HTTP 2xx、tag、registry cache。 |
| candidate exact / by attempt / immutable image | qualification 和 build trace的必要读取面 | duplicate immutable mapping = `ContractViolation` | mutable selector、裸 digest、Artifact ref。 |
| all `save_*` | local object + expected version + same UoW | VersionConflict / wrong UoW fail closed | auto-retry unknown、upsert、factory bypass、external result写入。 |

### 8.3 BuildCandidate 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| intent、snapshot、attempt、outcome、candidate 是否都有 exact read/save | `pass` | 读取面覆盖 Step 8/9/10所需对象关联和 history。 |
| unknown / reconciliation是否不触发盲重试 | `pass` | `list_reconcilable_attempts` 只列既有记录；external resolution另在 7.4。 |
| candidate是否不由ACK/tag/registry presence形成 | `pass` | outcome和candidate均需独立 typed local record。 |
| expected-version / UoW是否成对 | `pass` | read `Versioned<T>` 与 save `ExpectedLocalObjectVersion` 成对。 |
| build provider body是否未进入local store | `pass` | 仅存 `BuildHandoffRef`、execution / identity safe refs 和 safe conclusion。 |

## 9. Qualification local truth repository port（7.2 / 模块三）

### 9.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| candidate → provenance binding | provenance exact get、find by candidate / snapshot、save | `QualificationCoordinator` | `infra::repositories` / fake | EvaluateCandidateEligibility、provenance query。 |
| authority-driven gate evaluation | evaluation exact get、list by candidate、save | Qualification coordinator / reevaluate job | `infra::repositories` / fake | eligibility decision / pending re-evaluation。 |
| image-local eligibility decision | decision exact get、current-by-candidate、history list、save | Qualification / Supply coordinator | `infra::repositories` / fake | PublishInstantiableEntry、qualification query。 |
| Artifact local handoff observation | handoff exact get、list pending/gap、save | Qualification coordinator / reconcile job | `infra::repositories` / fake | RecordArtifactHandoff、handoff gap query。 |

### 9.2 `QualificationRepositoryPort`

```rust
/// 提供 Qualification local truth 和 Artifact handoff observation 的 typed persistence 接缝。
pub trait QualificationRepositoryPort {
    /// 按 exact provenance ref读取 binding与版本；缺失返回 None。
    async fn get_provenance_with_version(
        &self,
        provenance_ref: &ProvenanceBindingRef,
    ) -> Result<Option<Versioned<ProvenanceBinding>>, ImageApplicationError>;

    /// 按 candidate读取其 provenance bindings；按 bound_at、binding local id升序，历史 conflict也保留可读。
    async fn list_provenance_by_candidate(
        &self,
        candidate_ref: &CandidateImageRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ProvenanceBinding>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 provenance binding；store不得计算或替换 content identity。
    async fn save_provenance(
        &self,
        provenance: &ProvenanceBinding,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ProvenanceBinding>, ImageApplicationError>;

    /// 按 exact gate evaluation ref读取本仓 evaluation与版本；缺失返回 None。
    async fn get_gate_evaluation_with_version(
        &self,
        evaluation_ref: &GateEvaluationRef,
    ) -> Result<Option<Versioned<GateEvaluation>>, ImageApplicationError>;

    /// 按 candidate列出 gate evaluations；按 evaluated_at、evaluation local id升序，不枚举或查询 Governance gate inventory。
    async fn list_gate_evaluations_by_candidate(
        &self,
        candidate_ref: &CandidateImageRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<GateEvaluation>>, ImageApplicationError>;

    /// 列出本仓仍为 pending / blocked / unknown 的 evaluations，以供 bounded reevaluation；空页不代表 gate passed。
    async fn list_reevaluable_gate_evaluations(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<GateEvaluation>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 gate evaluation；其 conclusion 必须保持 body-free。
    async fn save_gate_evaluation(
        &self,
        evaluation: &GateEvaluation,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<GateEvaluation>, ImageApplicationError>;

    /// 按 exact eligibility decision ref读取 decision与版本；缺失返回 None。
    async fn get_eligibility_with_version(
        &self,
        decision_ref: &EligibilityDecisionRef,
    ) -> Result<Option<Versioned<EligibilityDecision>>, ImageApplicationError>;

    /// 读取 candidate当前可用的 image-local eligibility decision；不存在、non-eligible或关系不一致时返回 None / ContractViolation，绝不从 gate status推导。
    async fn find_current_eligibility_by_candidate_with_version(
        &self,
        candidate_ref: &CandidateImageRef,
    ) -> Result<Option<Versioned<EligibilityDecision>>, ImageApplicationError>;

    /// 按 candidate列出 eligibility decision history，按 decided_at、decision local id升序。
    async fn list_eligibility_by_candidate(
        &self,
        candidate_ref: &CandidateImageRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<EligibilityDecision>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 image-local eligibility decision。
    async fn save_eligibility(
        &self,
        decision: &EligibilityDecision,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<EligibilityDecision>, ImageApplicationError>;

    /// 按 exact handoff record ref读取本仓 Artifact handoff observation与版本；缺失返回 None。
    async fn get_artifact_handoff_with_version(
        &self,
        handoff_ref: &ArtifactHandoffRecordRef,
    ) -> Result<Option<Versioned<ArtifactHandoffRecord>>, ImageApplicationError>;

    /// 按 candidate列出 Artifact handoff record history，按 recorded_at、handoff local id升序。
    async fn list_artifact_handoffs_by_candidate(
        &self,
        candidate_ref: &CandidateImageRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ArtifactHandoffRecord>>, ImageApplicationError>;

    /// 列出本仓 Pending / Gap 的 handoff observations；仅作 reconciliation输入，不能将列表存在解释为 Artifact acceptance。
    async fn list_reconcilable_artifact_handoffs(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ArtifactHandoffRecord>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的本仓 handoff record；在 MI-UP-007 未关闭时只允许 Pending / Gap record进入store。
    async fn save_artifact_handoff(
        &self,
        handoff: &ArtifactHandoffRecord,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ArtifactHandoffRecord>, ImageApplicationError>;
}
```

| 读取 / 写入面 | 读取面覆盖 | missing / conflict 语义 | 禁止事项 |
|---|---|---|---|
| provenance / evaluation / eligibility exact + history | qualification flow能加载同一 candidate的完整 local chain | exact missing = `None`；candidate relation不一致 = `ContractViolation` | 从 trace、candidate image、gate ref或 Artifact ref拼 object。 |
| reevaluable gate list | job只处理 existing pending/blocked/unknown local evaluation | empty = no-op；不得默认为 pass | 读取/复制 Governance inventory或 evidence body。 |
| current eligibility lookup | supply entry guard的唯一 eligibility load面 | no current eligible = `None`；不合格不是 `Eligible` | 从 `GateEvaluation::Passed`、adapter availability或 config直接构造。 |
| handoff exact / pending list | RecordArtifactHandoff和reconcile只处理 local observation | pending/gap仅是 local state；accepted要求未来 formal seam | Artifact storage、lineage、artifact owner acceptance / ref mint。 |
| all `save_*` | typed local object + expected version + same write UoW | version / lifecycle conflict fail closed | 把 owner ref/body、gate inventory、real digest或 artifact acceptance写入本仓。 |

### 9.3 Qualification 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| provenance、gate、eligibility、handoff是否均有 local read/save | `pass` | 每组对象有 exact typed ref与 history / reconciliation读取面。 |
| Q-MI-004 gate inventory是否仍外置 | `pass_with_pending` | port不返回 gate inventory；仅持久化 `ApplicableGateSetRef` 和 safe conclusion bindings。 |
| MI-UP-007 Artifact positive lane是否未伪造 | `pass_with_pending` | local handoff store允许 Pending / Gap；Accepted依赖未来正式 resolver且当前不能产生。 |
| supply所需 eligibility读取面 | `pass` | `find_current_eligibility_by_candidate_with_version` 是唯一 current load面。 |
| version / UoW / body-free边界 | `pass` | 所有 mutable save带 expected-version/UoW，外部body不入store。 |

## 10. SupplyEntry local truth repository port（7.2 / 模块四）

### 10.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| append-only availability action / current facts | transition exact get、history list、current facts lookup、append | `AvailabilityCoordinator` | `infra::repositories` / fake | publish / replace / rollback / retire flow。 |
| local pinned entry creation / publish / retire / supersede | entry exact get、current-by-variant、list、save | Availability / query coordinator | `infra::repositories` / fake | ResolveInstantiableEntry、catalog query。 |
| Member Service gap visibility | consumer gap exact get、list by entry / open-or-stale list、save | Availability / Reference coordinator | `infra::repositories` / fake | resolve query、handoff reconciliation。 |

### 10.2 `SupplyEntryRepositoryPort`

```rust
/// 提供 SupplyEntry local availability history、pinned entry 与 consumer-gap 的 typed persistence 接缝。
pub trait SupplyEntryRepositoryPort {
    /// 按 exact transition ref读取 append-only local availability history与版本；缺失返回 None。
    async fn get_availability_transition_with_version(
        &self,
        transition_ref: &AvailabilityTransitionRef,
    ) -> Result<Option<Versioned<AvailabilityTransition>>, ImageApplicationError>;

    /// 按 variant列出 availability history，排序为 proposed_at、transition local id升序；不会删除或重排旧 history。
    async fn list_availability_history_by_variant(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<AvailabilityTransition>>, ImageApplicationError>;

    /// 从已提交 local history与entry构造 transition guard所需 current facts；没有当前entry/transition时返回合法的空 facts，不访问 consumer/container/registry。
    async fn load_current_availability_facts(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
    ) -> Result<CurrentAvailabilityFacts, ImageApplicationError>;

    /// 追加新的 local availability transition；仅 `Absent` 可创建，任何既有 transition不得被覆盖或删除。
    async fn append_availability_transition(
        &self,
        transition: &AvailabilityTransition,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<AvailabilityTransition>, ImageApplicationError>;

    /// 按 exact entry ref读取 pinned entry与版本；缺失返回 None。
    async fn get_entry_with_version(
        &self,
        entry_ref: &InstantiableEntryRef,
    ) -> Result<Option<Versioned<InstantiableEntry>>, ImageApplicationError>;

    /// 读取 variant当前 local entry；没有 current `Available` entry时返回 None，不把 latest history、consumer ref或 registry状态当entry。
    async fn find_current_entry_by_variant_with_version(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
    ) -> Result<Option<Versioned<InstantiableEntry>>, ImageApplicationError>;

    /// 按 variant列出所有 entry history，按 created_at、entry local id升序；包含 retired / superseded本仓历史。
    async fn list_entries_by_variant(
        &self,
        variant_ref: &ImageVariantDefinitionRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<InstantiableEntry>>, ImageApplicationError>;

    /// 列出当前 local `Available` entries，按 variant local ref、entry local id升序；仅供 catalog / rebuild使用，非 consumer confirmation清单。
    async fn list_available_entries(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<InstantiableEntry>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 entry；只有 domain guard / transition已完成时才允许 status变更。
    async fn save_entry(
        &self,
        entry: &InstantiableEntry,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<InstantiableEntry>, ImageApplicationError>;

    /// 按 exact consumer gap ref读取本仓 gap与版本；缺失返回 None。
    async fn get_consumer_handoff_gap_with_version(
        &self,
        gap_ref: &ConsumerHandoffGapRef,
    ) -> Result<Option<Versioned<ConsumerHandoffGap>>, ImageApplicationError>;

    /// 按可选 entry范围列出 consumer gaps；None只用于明确的 schema-level query，不可被实现解释为全局 consumer truth扫描。
    async fn list_consumer_handoff_gaps(
        &self,
        entry_ref: Option<&InstantiableEntryRef>,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ConsumerHandoffGap>>, ImageApplicationError>;

    /// 列出 Open / Stale consumer gaps，以供本仓 bounded reconciliation；只返回 gap context，不返回 Member Service contract / confirmation body。
    async fn list_reconcilable_consumer_handoff_gaps(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ConsumerHandoffGap>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 consumer gap；MI-UP-001未关闭时store必须拒绝 Resolved gap。
    async fn save_consumer_handoff_gap(
        &self,
        gap: &ConsumerHandoffGap,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ConsumerHandoffGap>, ImageApplicationError>;
}
```

| 读取 / 写入面 | 读取面覆盖 | missing / conflict 语义 | 禁止事项 |
|---|---|---|---|
| current availability facts | `AvailabilityTransitionGuard` 的唯一 persistence input | 没有entry/history = empty `CurrentAvailabilityFacts`；不等 error或 available | consumer confirmation、container health、registry status。 |
| append transition | append-only history、rollback / retire新上下文 | `Absent`以外写入拒绝；已提交history不得覆盖 | update/delete，或由 consumer回调直接 append。 |
| current / list entry | resolve、catalog、projection rebuild的 local supply读取面 | no current `Available` = `None`；entry history保留 | `latest`、tag、launch/health、Artifact accepted。 |
| consumer gap read/save | gap可见、reconcile和read view | current pending下 resolved save = `Unavailable/ContractViolation` | Member Service manifest、instance、host、container / session state。 |
| all mutable entry/gap save | typed local ref / expected version / UoW | stale version、wrong state或 wrong UoW fail closed | auto-repair entry、silent consumer confirmation、全局 readiness。 |

### 10.3 SupplyEntry 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| transition、entry、consumer gap是否均有独立 read/save | `pass` | append-only history、current entry和gap被分开，不混为一个 supply record。 |
| local availability是否与 consumer/container状态分离 | `pass` | current facts仅加载 local history/entry；不读外部运行状态。 |
| rollback / retire是否保留 append-only语义 | `pass` | `append_availability_transition` 只允许 `Absent`；entry状态变更仍需 versioned save。 |
| MI-UP-001是否保持 pending | `pass_with_pending` | `Resolved` gap现在不能写；Member Service resolver另在 7.4 仅作 blocker。 |
| catalog / resolve / projection读取面 | `pass` | current/list entry 和 gap list覆盖后续 query / rebuild，公共 view/schema留 Step 8。 |

## 11. ReferenceDerived、projection 与 replay port（7.3 / 模块五）

### 11.1 capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| body-free reference snapshot与validity history | snapshot exact / latest-by-source-use / list / save | `ReferenceIntakeCoordinator`、definition/build/qualification/supply service | `infra::repositories` / fake | RefreshExternalReferenceSnapshots、reference validation。 |
| named cross-owner gap | gap exact / affected-lane list / save | all coordinators、query / reconcile job | `infra::repositories` / fake | GetContractGaps、reopen / reconcile flow。 |
| append-only safe trace | subject/source list + append | all write / maintenance services | `infra::repositories` / fake | GetImageTrace、Step 15 audit切口。 |
| committed local truth snapshot | explicit read model rebuild input | `ReferenceIntakeCoordinator` / query service | `infra::projection_store` / fake | RebuildImageDerivedViews、view creation。 |
| existing projection identity / freshness / read model | index lookup、exact view / freshness read、save / stale list | query / rebuild service | `infra::projection_store` / fake | all 10 Query protocol、projection job。 |
| stable idempotency reservation / replay | reserve / complete / result save / result load | command / future consumer / job facade | `infra::idempotency_store` / fake | Step 8 result surface、Step 13 replay。 |

### 11.2 reference snapshot、gap 与 trace repository

```rust
/// 提供本仓 body-free external snapshot、named gap 与 append-only trace 的持久化接缝。
pub trait ReferenceDerivedRepositoryPort {
    /// 按 exact snapshot ref读取 local external-reference snapshot与版本；缺失返回 None。
    async fn get_external_snapshot_with_version(
        &self,
        snapshot_ref: &ExternalReferenceSnapshotRef,
    ) -> Result<Option<Versioned<ExternalReferenceSnapshot>>, ImageApplicationError>;

    /// 按 source ref 和 exact local use读取最新 snapshot；不存在返回 None，不调用外部 owner。
    async fn find_latest_external_snapshot_by_source_and_use_with_version(
        &self,
        source_ref: &OpaqueReference,
        use_kind: ReferenceUseKind,
    ) -> Result<Option<Versioned<ExternalReferenceSnapshot>>, ImageApplicationError>;

    /// 读取一个 source/use 下的 snapshot history，按 captured_at、snapshot local id升序。
    async fn list_external_snapshots_by_source_and_use(
        &self,
        source_ref: &OpaqueReference,
        use_kind: ReferenceUseKind,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ExternalReferenceSnapshot>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 body-free snapshot；source body、raw SDK response和live state一律拒绝。
    async fn save_external_snapshot(
        &self,
        snapshot: &ExternalReferenceSnapshot,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ExternalReferenceSnapshot>, ImageApplicationError>;

    /// 按 exact gap ref读取本仓 contract gap与版本；缺失返回 None。
    async fn get_contract_gap_with_version(
        &self,
        gap_ref: &ContractGapRef,
    ) -> Result<Option<Versioned<ContractGap>>, ImageApplicationError>;

    /// 列出一个 local decision lane中 Open / Blocked gap；按 recorded_at、gap local id升序，空页表示此 lane当前无本仓 gap。
    async fn list_open_gaps_by_lane(
        &self,
        lane: DecisionLane,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ContractGap>>, ImageApplicationError>;

    /// 按 owner、seam kind和受影响lane列出 gap；所有过滤条件都必须显式给出，避免从 consumer / external text推断 owner。
    async fn list_gaps_by_boundary(
        &self,
        owner: ExternalOwnerKind,
        seam_kind: DependencySeamKind,
        lane: DecisionLane,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<Versioned<ContractGap>>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 local gap；只有 formal resolution port 明确返回 resolution ref后才可保存 Resolved。
    async fn save_contract_gap(
        &self,
        gap: &ContractGap,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ContractGap>, ImageApplicationError>;

    /// 按 exact trace ref读取 append-only trace；缺失返回 None。
    async fn get_trace(
        &self,
        trace_ref: &ImageTraceRecordRef,
    ) -> Result<Option<ImageTraceRecord>, ImageApplicationError>;

    /// 按 typed local subject列出 append-only trace，按 recorded_at、trace local id升序；不允许以 generic / external ref反查本仓对象。
    async fn list_trace_by_subject(
        &self,
        subject_ref: &LocalObjectRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<ImageTraceRecord>, ImageApplicationError>;

    /// 追加一条完整、已由 application形成的 trace；append没有 expected version，且不能修改/删除旧 trace。
    async fn append_trace(
        &self,
        trace: &ImageTraceRecord,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<ImageTraceRecordRef, ImageApplicationError>;
}
```

| group | 读取 / 写入规则 | 禁止事项 |
|---|---|---|
| snapshot | `(OpaqueReference, ReferenceUseKind)` 是 latest/history读取的完整键；不同 use不得互用 | 从 source字符串、Role body、component body或 cache猜 snapshot。 |
| gap | owner + seam kind + lane显式分组；gap只冻结一个 lane | 用一个 `ready=false`、adapter availability、ack或 fake关闭 gap。 |
| trace | `LocalObjectRef` 才是 repository-readable subject key；trace source可包含 external opaque ref但不能拿它反查 local subject | 用 generic external ref、raw log、payload、view/cache或 string prefix作为 subject。 |
| save / append | mutable snapshot/gap走 versioned save；trace只 append；同一 write flow按其 UoW原子性要求执行 | 通过 trace / snapshot / gap反写 core truth或暗改外部 owner。 |

### 11.3 projection identity、truth snapshot 与 read-model repository

`ImageDerivedReadModel` 尚未在 Step 8 形成 public DTO / stable external view ref。因此本 port 只使用 application-local typed key，不把 `ImageLocalId`、cursor或 variant ref擅自暴露为 public projection identity。

```rust
/// 选择一类本仓 projection 与可选 variant scope 的 application-local lookup key。
pub struct ImageProjectionLookupKey {
    /// 已定义的 safe projection family。
    pub projection_kind: ProjectionKind,
    /// Definition / build / qualification / supply 视图可绑定一个 variant；contract-gap catalog可为 None。
    pub variant_ref: Option<ImageVariantDefinitionRef>,
}

/// 从已经 committed 的本仓 local truth 组装 projection rebuild输入的 port。
pub trait CommittedImageTruthSnapshotPort {
    /// 读取一个 projection key对应的 committed local truth snapshot；没有可读 truth时返回 None，不从 projection/cache/fake补造。
    async fn load_committed_truth_snapshot(
        &self,
        key: &ImageProjectionLookupKey,
    ) -> Result<Option<CommittedImageTruthSnapshot>, ImageApplicationError>;
}

/// 提供既有 read model、freshness及其稳定 local index的 repository port。
pub trait ImageProjectionRepositoryPort {
    /// 按 projection key查找既有 read-model ref；没有既有行返回 None，query不得因此创建 view。
    async fn find_read_model_ref_by_key(
        &self,
        key: &ImageProjectionLookupKey,
    ) -> Result<Option<ImageDerivedReadModelRef>, ImageApplicationError>;

    /// 按 exact local view ref读取 read model与版本；缺失返回 None。
    async fn get_read_model_with_version(
        &self,
        view_ref: &ImageDerivedReadModelRef,
    ) -> Result<Option<Versioned<ImageDerivedReadModel>>, ImageApplicationError>;

    /// 按 exact local freshness ref读取 freshness marker与版本；缺失返回 None。
    async fn get_projection_freshness_with_version(
        &self,
        freshness_ref: &ProjectionFreshnessRef,
    ) -> Result<Option<Versioned<ProjectionFreshness>>, ImageApplicationError>;

    /// 通过一个既有 read-model ref读取其关联 freshness；没有关联行返回 None，不以 Fresh 默认值代替。
    async fn find_freshness_by_read_model_with_version(
        &self,
        view_ref: &ImageDerivedReadModelRef,
    ) -> Result<Option<Versioned<ProjectionFreshness>>, ImageApplicationError>;

    /// 列出由一个已提交 local subject影响的既有 public-facing projection rows；空页表示当前无既有 view需要标脏，不能临时生成 view ref。
    async fn list_existing_views_affected_by_subject(
        &self,
        subject_ref: &LocalObjectRef,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<ImageDerivedReadModelRef>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 read model；只有通过 `CommittedImageTruthSnapshotPort` 获得的truth snapshot可作为写入来源。
    async fn save_read_model(
        &self,
        view: &ImageDerivedReadModel,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ImageDerivedReadModel>, ImageApplicationError>;

    /// 保存新建或 versioned update 的 freshness marker；不可用 / stale原因必须保留为 SafeReason或 local gap ref。
    async fn save_projection_freshness(
        &self,
        freshness: &ProjectionFreshness,
        expected_version: ExpectedLocalObjectVersion,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ProjectionFreshness>, ImageApplicationError>;
}
```

| projection concern | 正式口径 |
|---|---|
| rebuild truth source | `CommittedImageTruthSnapshotPort.load_committed_truth_snapshot` 只能从 committed local DefinitionAssembly / BuildCandidate / Qualification / SupplyEntry / ReferenceDerived truth及 local watermark组装，不能从 read model、cache、fake private state、owner body或 external response构造。 |
| existing view lookup | query先 `find_read_model_ref_by_key`，再读取 view + freshness；missing是后续 Step 8 的 missing/degraded surface，不允许 query创建、rebuild或扫描truth。 |
| affected view lookup | mutation / marker flow只调用 `list_existing_views_affected_by_subject` 标脏既有 row；空页 = no-op，不派生新的 public view identity。 |
| key stability | `ImageProjectionLookupKey` 由 `ProjectionKind` + optional typed variant ref组成；不解析 strings、route、method name、artifact ref、consumer ref或 page cursor。 |
| freshness | `Fresh` 只表示已知 local watermark一致，不代表 image eligible/available、Artifact accepted、Member Service confirmation或 runtime readiness。 |

### 11.4 idempotency reservation 与 stored-result port

`StoredImageOperationResult` 是 Step 6 的 metadata shell；完整 Command / conditional inbound / Job public result body要到 Step 8 才能定义。为避免 duplicate 重跑，本 port 已定义 shell和 future replay-body的强制读取链，但当前任何尚未完成 Step 8 schema 的 operation 都不得声称可保存正向 result。

```rust
/// reserve 操作返回的新建、重复或冲突结果；不含 public result body。
pub enum ImageIdempotencyReservation {
    /// 没有同键记录，调用方可在同一 UoW 内继续 stage本次操作。
    Reserved {
        /// 新建 reservation 的 typed local ref。
        record_ref: ImageIdempotencyRecordRef,
    },
    /// 同一 key/channel/operation/stable input 已完成；调用方必须 load stored result，不得重跑。
    Duplicate {
        /// 已完成 reservation 的 typed ref。
        record_ref: ImageIdempotencyRecordRef,
        /// 被重放的 local result shell引用。
        result_ref: ImageOperationResultRef,
    },
    /// 同一 key被不同 channel、operation或 stable input复用。
    Conflict {
        /// 安全冲突解释。
        reason: ImageIdempotencyConflictReason,
    },
}

/// 由 Step 8 在每个具体协议已定义结果 schema后提供的可持久化 replay body。
/// 当前 Step 不定义字段，避免把 command/event/job DTO或 report私造进 application shell。
pub trait StoredImageOperationReplayBody {
    /// 返回与 stored result shell一致的 operation identity。
    fn operation_name(&self) -> &ImageOperationName;

    /// 返回与 stored result shell一致的 result category。
    fn result_kind(&self) -> StoredImageOperationResultKind;
}

/// 处理本仓 reservation、stored-result shell和已闭口 replay body 的 application-owned port。
pub trait ImageIdempotencyRepositoryPort {
    /// 以完整 write context和 stable input尝试 reserve；Query 不得调用。
    async fn reserve(
        &self,
        context: &ImageOperationContext,
        stable_input_ref: &StableOperationInputRef,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<ImageIdempotencyReservation, ImageApplicationError>;

    /// 按 exact idempotency record ref读取 reservation与版本；缺失返回 None。
    async fn get_record_with_version(
        &self,
        record_ref: &ImageIdempotencyRecordRef,
    ) -> Result<Option<Versioned<ImageIdempotencyRecord>>, ImageApplicationError>;

    /// 保存 shell和已闭口的 replay body；调用方必须保证 body 的 operation/kind 与 shell相同。
    async fn save_stored_result(
        &self,
        result: &StoredImageOperationResult,
        replay_body: &dyn StoredImageOperationReplayBody,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<StoredImageOperationResultRef, ImageApplicationError>;

    /// 将 Reserved record连接到已保存的 result ref；同一 UoW 内的 result save必须先于 complete。
    async fn complete(
        &self,
        record: &ImageIdempotencyRecord,
        expected_version: ExpectedLocalObjectVersion,
        result_ref: &ImageOperationResultRef,
        unit_of_work: &dyn ImageUnitOfWork,
    ) -> Result<Versioned<ImageIdempotencyRecord>, ImageApplicationError>;

    /// 按 stable result ref读取 shell；不存在返回 None。
    async fn get_stored_result(
        &self,
        result_ref: &ImageOperationResultRef,
    ) -> Result<Option<StoredImageOperationResult>, ImageApplicationError>;

    /// 按 shell result ref读取已闭口的 replay body；body缺失、operation/kind不匹配必须返回 StoredResultMissing / ContractViolation。
    async fn get_replay_body(
        &self,
        result_ref: &ImageOperationResultRef,
    ) -> Result<Box<dyn StoredImageOperationReplayBody>, ImageApplicationError>;
}
```

| replay phase | 正式口径 |
|---|---|
| reserve | `context` 必须是 non-query `ReadWrite`，并包含 validated metadata；same key + same channel + same operation + same `StableOperationInputRef` 才可 `Duplicate`。 |
| accepted / negative result | flow先保存 `StoredImageOperationResult` + Step 8已闭口 replay body，再以 versioned reservation执行 `complete`，最后同一 UoW commit。 |
| duplicate | 必须 `get_stored_result` + `get_replay_body`；任何缺失/mismatch均返回 `StoredResultMissing` / `ContractViolation`，不得重新执行 domain transition、external call或 job scan。 |
| conflict | same key但 channel/operation/stable input不同，返回 `IdempotencyConflict`；不得覆盖旧 record或返回其 result。 |
| current blocked scope | 因 Step 8尚未定义任何完整 protocol result body，当前没有可实施的 positive `save_stored_result`调用；本 trait是承接契约而非实现授权。 |

### 11.5 ReferenceDerived / projection / replay 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| snapshot / gap / trace是否各有类型正确的读取与写入面 | `pass` | snapshot/gap versioned，trace append-only，external body始终隔离。 |
| projection rebuild truth source是否明确 | `pass` | 仅 `CommittedImageTruthSnapshotPort`；明确禁止 projection/cache/fake自重建。 |
| public-looking view identity是否避免临时拼接 | `pass_with_defer` | application-local key/index已定义；Step 8 必须定义正式 public view/page schema。 |
| affected existing view读取面是否存在 | `pass` | `list_existing_views_affected_by_subject` 空页为 no-op。 |
| duplicate是否有 shell→body读取链 | `pass_with_blocker` | port完整，但 body schema等 Step 8；当前不得重跑或伪造结果。 |
| outbox / publisher是否未被机械复制 | `pass` | MI-UP-009未关闭，本仓无此 port。 |

## 12. External seam port 契约（7.4）

本节的 port 仍由 `application::ports::external` 定义、由 `infra::{source_adapters,build_adapters,qualification_adapters,supply_adapters,fakes}` 实现。它们不是对外 DTO、HTTP/RPC client、broker consumer、provider SDK 或 sibling Rust contract。每个入参与返回值均是本仓 typed local ref、named body-free external ref、`SafeReferenceConclusion` 或安全阻断原因。

**当前时点约束：**`MI-UP-001/002/003/005/006/007`、`Q-MI-003/004` 仍未关闭。因此下文的 trait 只闭合调用方向、typed carrier、错误面和 fail-closed 分支；它们不证明任一 concrete adapter 已配置，也不授权产生 Role mapping、组件 release、seed、真实 digest、Artifact accepted、consumer confirmation、事件 receipt 或发布结果。若未来 owner-side formal contract 关闭，必须重开受影响的 Step 7~9，而不是把本节的类型壳解释为当前正向能力。

### 12.1 external seam capability / 接缝清单

| capability / 对象能力 | application-owned port | 调用方 | planned infra 实现方 | seam 分类与当前上限 |
|---|---|---|---|---|
| mapping snapshot、component pin、seed/base placement 的 body-free source judgment | `ImageAssemblyReferenceResolverPort` | `DefinitionAssemblyCoordinator`、`ReferenceIntakeCoordinator` | `source_adapters.rs` / test fake | Method Library=`runtime + ref`；Runtime/Tools/Member/Supervisor=`ref`；seed/base=`ref + adapter`；只返回 conclusion / blocked。 |
| controlled build handoff 与已存在 attempt 的保守结果观察 | `BuilderRegistryPort` | `BuildIntentCoordinator`、reconcile job application facade | `build_adapters.rs` / blocked adapter / test fake | `adapter + ref`；`Q-MI-003`下无产品、无 provider request/response、无 current positive implementation。 |
| authority/gate/evidence 与 Artifact handoff 的当前边界诊断 | `QualificationBoundaryPort` | `QualificationCoordinator`、handoff reconciliation facade | `qualification_adapters.rs` / blocked adapter / test fake | Governance/Artifact=`ref + adapter`；只能给出 blocked/unavailable/unknown/gap/reopen，不能形成 `Passed`、Artifact ref 或 `Accepted`。 |
| local pinned entry 面向 Member Service 的未闭口 consumer boundary | `MemberServiceSupplyPort` | `AvailabilityCoordinator`、resolve/reconcile facade | `supply_adapters.rs` / blocked adapter / test fake | `runtime + ref + adapter`；`MI-UP-001`下只形成 `ConsumerHandoffGap` 输入，不能返回 manifest/contract/confirmation。 |
| conditional inbound event 与 bounded operations entry 的可用性诊断 | `ImageEntryBoundaryPort` | future `consumer_service` / `job_service` facade | `runtime_builder.rs` / blocked adapter / test fake | inbound=`event`，job is local bounded entry; 无 envelope/topic/receipt/scheduler/run/report。 |
| Core shared carrier | **无 port** | 不适用 | 不适用 | `compile` 仍被 `MI-UP-004` 阻断；零 active Cargo path dependency，不能用 adapter 或 local alias 绕过。 |

### 12.2 assembly reference resolver：mapping / component / seed / base

`ImageAssemblyReferenceResolverPort` 只判断一个已经命名的 body-free ref 能否作为指定的本仓静态装配输入。它不读取或返回 RoleDefinition、mapping body、runtime/tools/member/supervisor release body、policy/memory/workspace seed body、image filesystem path、secret、live memory/checkpoint、workspace live content或容器状态。

```rust
/// A body-free result of inspecting one named external source for a declared local use.
pub enum ImageReferenceResolution {
    /// The adapter returned a source-matching safe conclusion; it still has only the narrow use
    /// stated by the invoked method and does not prove a complete baseline or runtime readiness.
    Concluded {
        /// Body-free conclusion whose source ref must equal the inspected input ref.
        conclusion: SafeReferenceConclusion,
    },
    /// A required owner contract or static input is absent or explicitly blocked.
    Blocked {
        /// Structured, redacted reason for the blocked local lane.
        reason: SafeReason,
    },
    /// The source boundary cannot currently be read or validated.
    Unavailable {
        /// Structured, redacted availability reason.
        reason: SafeReason,
    },
    /// The adapter cannot safely determine a source conclusion.
    Unknown {
        /// Structured, redacted uncertainty reason.
        reason: SafeReason,
    },
}

/// Resolves only body-free static assembly references into safe local conclusions.
pub trait ImageAssemblyReferenceResolverPort {
    /// Inspects a Method Library Role-to-variant mapping ref for DefinitionAssembly use.
    async fn inspect_mapping_for_definition(
        &self,
        mapping_ref: &MappingSourceRef,
    ) -> Result<ImageReferenceResolution, ImageApplicationError>;

    /// Inspects one immutable Runtime, Tools, Member, Supervisor, or role-extra component pin.
    async fn inspect_component_for_assembly(
        &self,
        slot: ComponentSlotKind,
        release_ref: &ComponentReleaseRef,
    ) -> Result<ImageReferenceResolution, ImageApplicationError>;

    /// Inspects one static policy, memory, workspace, or role-extra template placement.
    async fn inspect_seed_for_assembly(
        &self,
        template_ref: &SeedTemplateRef,
        seed_kind: StaticSeedKind,
        placement_kind: StaticPlacementKind,
    ) -> Result<ImageReferenceResolution, ImageApplicationError>;

    /// Inspects a body-free immutable base-image reference for static assembly use.
    async fn inspect_base_image_for_assembly(
        &self,
        base_image_ref: &BaseImageRef,
    ) -> Result<ImageReferenceResolution, ImageApplicationError>;
}
```

| 函数 | 输入 exact-kind / 当前输出 | 允许的 application 后续动作 | 禁止事项 |
|---|---|---|---|
| `inspect_mapping_for_definition` | `owner=MethodLibrary`、`kind=RoleVariantMapping`；返回 source-matching conclusion 或 negative resolution | `Concluded` 只能成为 `MappingSourceSnapshot::capture` 的候选输入；negative outcome 可形成 definition/assembly gap | 不返回 RoleDefinition、role count、mapping body或 direct variant creation。 |
| `inspect_component_for_assembly` | `kind=ComponentRelease`，owner须与 `ComponentSlotKind` 和 pin guard相符 | 仅可供 `ComponentPin` / `ComponentPinSet` 的 safe conclusion 和后续 pure guard 使用 | 不返回 binary、manifest、compatibility report body、`latest` 或 runtime live state。 |
| `inspect_seed_for_assembly` | `owner=SeedAuthority`、`kind=SeedTemplate`；`seed_kind` 与 `placement_kind` 必须由调用方显式给出 | 仅可供 `SeedPlacementBinding::bind` 的 conclusion 输入 | 不加载模板语义正文，不接受 memory/checkpoint/workspace live state、mount/path、credential或 command。 |
| `inspect_base_image_for_assembly` | `kind=BaseImage`，immutable selector规则由 guard复核 | 仅可进入 baseline/input snapshot 的 body-free binding | 不把 hardened base future scope、registry tag或镜像 digest 猜成已验证 base。 |

`ImageReferenceResolution::Concluded` 的 `conclusion.source_ref` 必须与传入 ref 在 owner/kind/opaque identity/revision 上完全相等；任何不等是 `ImageApplicationError::ContractViolation`。当前 `MI-UP-002/003/006` 未关闭的 concrete production composition 只能返回 `Blocked`、`Unavailable` 或 `Unknown`；不得以此 enum 的存在声称 `VerifiedUsable` 已发生。`ReferenceIntakeCoordinator` 如需保留结果，必须经 `MappingSourceSnapshot` 或 `ExternalReferenceSnapshot` 的 factory、对应 repository versioned save 和同一 local UoW，而不能把 adapter result直接写进 baseline/revision。

### 12.3 builder / registry seam：controlled handoff 与保守 observation

`BuilderRegistryPort` 的输入只由已持久化的 local attempt/snapshot 与其中的 static body-free bindings组成。它不定义 provider request、registry manifest、tag、digest、build log、callback payload、job report或发布 API。`Recorded` 只表示本仓获得一个可追溯的 handoff ref，**不**表示 builder 已接受、执行、成功、发布或产生 candidate。

```rust
/// Conservative result of requesting a controlled external build handoff.
pub enum BuildHandoffSubmission {
    /// A body-free handoff identity was recorded; no external acceptance is implied.
    Recorded {
        /// Opaque boundary ref returned by the controlled builder seam.
        handoff_ref: BuildHandoffRef,
    },
    /// A required build boundary or static input is blocked before a handoff can be recorded.
    Blocked {
        /// Structured, redacted blocking reason.
        reason: SafeReason,
    },
    /// The build boundary is currently unavailable.
    Unavailable {
        /// Structured, redacted availability reason.
        reason: SafeReason,
    },
    /// The handoff effect cannot safely be determined.
    Unknown {
        /// Structured, redacted uncertainty reason.
        reason: SafeReason,
    },
}

/// Body-free observation used to construct one local BuildOutcomeConclusion and, after
/// cross-object checks, a CandidateImage candidate.
pub struct BuildOutcomeObservation {
    /// External execution identity; it contains no provider execution body.
    pub execution_ref: ExternalBuildExecutionRef,
    /// Conservative result classification, not a candidate or publication verdict.
    pub result_kind: BuildResultKind,
    /// Immutable image ref supplied by the same safe output observation; it is never a tag,
    /// mutable selector, locally calculated digest, or registry-presence inference.
    pub immutable_image_ref: Option<ImmutableImageRef>,
    /// Verified immutable content identity only when a safe owner-side conclusion supplied it.
    pub output_identity_ref: Option<VerifiedContentIdentityRef>,
    /// Required for failed, unknown, or unavailable observations; never a raw provider error.
    pub reason: Option<SafeReason>,
}

/// Conservative result of inspecting an already recorded build attempt.
pub enum BuildOutcomeResolution {
    /// A body-free observation is available for local domain validation.
    Observed {
        /// Observation that still must pass BuildOutcomeConclusion factory and candidate guard.
        observation: BuildOutcomeObservation,
    },
    /// The boundary contract or required source blocks outcome inspection.
    Blocked {
        /// Structured, redacted blocking reason.
        reason: SafeReason,
    },
    /// The builder/registry boundary is unavailable.
    Unavailable {
        /// Structured, redacted availability reason.
        reason: SafeReason,
    },
    /// The external side effect or output cannot safely be classified.
    Unknown {
        /// Structured, redacted uncertainty reason.
        reason: SafeReason,
    },
}

/// Exchanges only local build context and body-free refs with a product-neutral builder/registry boundary.
pub trait BuilderRegistryPort {
    /// Requests a controlled handoff for a previously validated static input snapshot.
    async fn submit_handoff(
        &self,
        intent_ref: &BuildIntentRef,
        input_snapshot: &BuildInputSnapshot,
    ) -> Result<BuildHandoffSubmission, ImageApplicationError>;

    /// Inspects an already recorded attempt without retrying, recreating, or mutating it.
    async fn inspect_outcome(
        &self,
        attempt: &BuildAttempt,
    ) -> Result<BuildOutcomeResolution, ImageApplicationError>;
}
```

| 结果 / 规则 | application 可做什么 | 明确不能做什么 |
|---|---|---|
| `BuildHandoffSubmission::Recorded` | 在同一 future flow 中以已加载 `intent_ref`、complete snapshot和返回的 `BuildHandoffRef` 调用 `BuildAttempt::start`；随后仍由 local lifecycle / UoW 管理 | 不把 recorded/ACK/2xx 当 `HandoffPending` 之后的 `Succeeded`、candidate、digest或发布。 |
| `BuildOutcomeResolution::Observed` | 用 clock 形成 `BuildOutcomeConclusion::conclude` 的候选；仅 `Succeeded` 且 `immutable_image_ref` 与 `output_identity_ref` 都由同一 safe observation提供时，才可在 future flow将 immutable image ref 与 loaded outcome binding一起交给 `CandidateFormationGuard` | 不直接 save candidate；`Succeeded` 仍不是 candidate，两个 ref都不是本仓生成的真实 digest。 |
| `Blocked` / `Unavailable` / `Unknown` | 形成 local blocked/unknown/gap或由 Step 9 recovery新建 context | 不隐式 retry、不从 registry cache/tag/private fake map猜结果、不覆盖既有 attempt。 |
| 当前 `Q-MI-003` | planned implementation只能是 blocked/fake seam，具体 builder/registry product待后续配置与设计重开 | 不选择 backend、endpoint、credential、SDK、image tag policy、registry API或 release workflow。 |

外部 handoff/observation 不属于 `ImageUnitOfWork` commit证据：local UoW 只原子提交本仓对象、trace、freshness及已闭合 replay；具体外部调用与 local mutation的顺序留 Step 9，unknown recovery留 Step 12~13。

`BuildOutcomeObservation` 的 `Option` 语义在本 Step 固定：`Succeeded` 必须同时提供 `immutable_image_ref=Some` 与 `output_identity_ref=Some`；`Failed`、`Unknown`、`Unavailable` 两者必须均为 `None`，且 `reason=Some`。不允许根据 `BuildOutcomeConclusion`、tag、cache、stored result 或 attempt history在事后补出 image ref；若需要重试判定，必须取得一条新的、仍受本 port 合同约束的 safe observation，并由 future flow保留本次与既有 local chain 的一致性检查。

### 12.4 qualification / Artifact seam：只诊断 boundary，不产生 acceptance

当前 `Q-MI-004` 没有 authority-owned gate inventory / priority，`MI-UP-007` 没有 image Artifact handoff formal schema。故此处故意**不**定义 evidence body query、gate list、Artifact delivery、Artifact accept、Artifact version/lineage、receipt或 formal resolution 输出。port 只将已知的 typed ref 或其缺失转换成可见的本仓安全边界。

```rust
/// Current non-positive assessment of an authority/evidence boundary.
pub enum QualificationBoundaryAssessment {
    /// Applicable gate authority or inventory cannot support a local positive decision.
    Blocked {
        /// Structured, redacted blocking reason.
        reason: SafeReason,
    },
    /// The authority/evidence boundary cannot currently be inspected.
    Unavailable {
        /// Structured, redacted availability reason.
        reason: SafeReason,
    },
    /// A safe conclusion cannot be determined from the currently formal inputs.
    Unknown {
        /// Structured, redacted uncertainty reason.
        reason: SafeReason,
    },
    /// A later owner contract must reopen this seam before it can carry a positive use case.
    ReopenRequired {
        /// Structured, redacted pending-contract reason.
        reason: SafeReason,
    },
}

/// Current non-positive assessment of the Artifact handoff boundary.
pub enum ArtifactHandoffBoundaryAssessment {
    /// A local Artifact handoff context must remain a named gap.
    Gap {
        /// Structured, redacted gap reason.
        reason: SafeReason,
    },
    /// The Artifact owner boundary is currently unavailable.
    Unavailable {
        /// Structured, redacted availability reason.
        reason: SafeReason,
    },
    /// Formal Artifact schema and owner resolution must be closed before handoff can advance.
    ReopenRequired {
        /// Structured, redacted pending-contract reason.
        reason: SafeReason,
    },
}

/// Diagnoses external qualification and Artifact boundaries without owning their truth.
pub trait QualificationBoundaryPort {
    /// Inspects whether supplied authority references can support a gate-evaluation attempt.
    async fn assess_gate_boundary(
        &self,
        authority_ref: Option<&GateAuthorityRef>,
        applicable_gate_set_ref: Option<&ApplicableGateSetRef>,
    ) -> Result<QualificationBoundaryAssessment, ImageApplicationError>;

    /// Inspects an existing body-free evidence conclusion ref without returning its body or gate inventory.
    async fn assess_evidence_boundary(
        &self,
        conclusion_ref: &EvidenceConclusionRef,
        applicable_gate_set_ref: Option<&ApplicableGateSetRef>,
    ) -> Result<QualificationBoundaryAssessment, ImageApplicationError>;

    /// Diagnoses the formal Artifact handoff boundary for an eligible local context.
    async fn assess_artifact_handoff_boundary(
        &self,
        candidate_ref: &CandidateImageRef,
        eligibility_ref: &EligibilityDecisionRef,
        proposed_artifact_ref: Option<&ArtifactConsumableRef>,
    ) -> Result<ArtifactHandoffBoundaryAssessment, ImageApplicationError>;
}
```

`Option` 的语义在此固定：`authority_ref`、`applicable_gate_set_ref` 和 `proposed_artifact_ref` 为 `None` 只表示对应 owner-side ref 当前未能安全提供，绝不触发 default、guess、cache lookup或本仓 mint。`QualificationBoundaryAssessment` 的任何分支都不能使 `GateEvaluation` 进入 `Passed`，或使 `EligibilityDecision` 进入 `Eligible`；`ArtifactHandoffBoundaryAssessment` 的任何分支都不能调用 `ArtifactHandoffRecord::bind_artifact_ref`。调用方只能创建/更新本仓 `ContractGap`、使 gate/eligibility保持 pending/blocked/unknown，或记录 `ArtifactHandoffRecord::record_gap`。这也是 `MI-UP-007` 的唯一当前 lane。

### 12.5 Member Service supply seam：only gap / reopen at the current boundary

`InstantiableEntry::Available` 是本仓 local supply 事实，不代表 Member Service 已收到 manifest、选择 variant、创建 instance、启动 container、挂载 workspace、确认 launch 或报告 health。`MI-UP-001` 未闭口时，`MemberServiceSupplyPort` 必须将任何尝试显式留在 `ConsumerHandoffGap` lane；它没有 `accept`、`publish_manifest`、`confirm`、`launch`、`health` 或 `resolve_entry` 成功函数。

```rust
/// Non-positive result of checking the Member Service consumer boundary.
pub enum MemberServiceSupplyAssessment {
    /// The consumer boundary lacks an exact formal schema, ref validation, or confirmation contract.
    Gap {
        /// Narrow consumer-gap category to persist locally.
        gap_kind: ConsumerHandoffGapKind,
        /// Structured, redacted gap reason.
        reason: SafeReason,
    },
    /// The consumer boundary cannot currently be inspected.
    Unavailable {
        /// Narrow consumer-gap category to persist locally.
        gap_kind: ConsumerHandoffGapKind,
        /// Structured, redacted availability reason.
        reason: SafeReason,
    },
    /// A later Member Service formal contract must reopen this seam.
    ReopenRequired {
        /// Narrow consumer-gap category to persist locally.
        gap_kind: ConsumerHandoffGapKind,
        /// Structured, redacted pending-contract reason.
        reason: SafeReason,
    },
}

/// Diagnoses, but does not implement, the Member Service pinned-entry consumer boundary.
pub trait MemberServiceSupplyPort {
    /// Assesses whether a local pinned entry can be represented under a supplied consumer contract ref.
    /// At the current boundary every successful call must return a non-positive assessment.
    async fn assess_pinned_entry_handoff(
        &self,
        entry_ref: Option<&InstantiableEntryRef>,
        consumer_contract_ref: Option<&ConsumerContractRef>,
    ) -> Result<MemberServiceSupplyAssessment, ImageApplicationError>;

    /// Assesses whether an existing local ConsumerHandoffGap may be rechecked; it does not return
    /// a confirmation, resolution ref, manifest, instance, host, or runtime status.
    async fn assess_gap_reopen(
        &self,
        gap: &ConsumerHandoffGap,
    ) -> Result<MemberServiceSupplyAssessment, ImageApplicationError>;
}
```

| 输入 / 结果 | 当前正式行为 | 禁止事项 |
|---|---|---|
| `entry_ref=None` | 可返回 `Schema` / `EntryReference` 类 gap，表示 local entry缺失或 consumer schema未闭口；不把缺 entry伪装为 consumer result | 不扫描 catalog、映射 Role、创建 entry或推导 image variant。 |
| `consumer_contract_ref=None` | 只能返回 `Schema` / `Qualification` / `Confirmation` 类 gap 或 reopen；不得猜 contract identity | 不从 L2-member-service draft、route、container config或 string拼 ref。 |
| `Gap` / `Unavailable` / `ReopenRequired` | application 只能使用 `ConsumerHandoffGap::open` / `mark_stale` 与 versioned local store形成可见 consumer lane | 不调用 `ConsumerHandoffGap::resolve`、不写 `Resolved`、不保存 confirmation/resolution ref。 |
| future formal contract | 只有 owner-side exact manifest/variant/ref/qualification/confirmation 均正式关闭后，才可重开 Step 7/8/9，增加正向 resolver result | 不由本仓、fake、config或 local `Available` entry 自行解除 `MI-UP-001`。 |

### 12.6 conditional inbound / bounded job entry seam

`MI-UP-005` 尚未提供可验证 event family、source authority、identity/version、schema、dedup scope、receipt或 broker semantics。因此本 Step 不定义 `EventEnvelope`、topic、event id、payload、receipt、offset、consumer loop或 outbound compensation。为避免 future entry 直接访问 repository，本仓只定义一个可查询的 boundary disposition port；其 output 必须映射到 Step 6 的 `InboundContractMarker`，不是消息处理结果。

```rust
/// Current disposition of a conditionally inbound event family.
pub enum ConditionalInboundBoundaryAssessment {
    /// No owner-authorized inbound contract is currently usable.
    Unavailable {
        /// Structured, redacted pending/availability reason.
        reason: SafeReason,
    },
    /// A future input family is known not to satisfy current authority preconditions.
    Rejected {
        /// Structured, redacted rejection reason.
        reason: SafeReason,
    },
    /// A future formal contract is required before a worker write path may be designed.
    ReopenRequired {
        /// Structured, redacted pending-contract reason.
        reason: SafeReason,
    },
}

/// Current availability of one named bounded job action; this is not a scheduler or run result.
pub enum ImageJobActionAvailability {
    /// The action has a safe local application facade direction but no execution fact.
    Declared,
    /// The action cannot proceed because a required local or external seam is blocked.
    Blocked {
        /// Structured, redacted blocking reason.
        reason: SafeReason,
    },
    /// The action must be redesigned after a pending owner contract closes.
    ReopenRequired {
        /// Structured, redacted pending-contract reason.
        reason: SafeReason,
    },
}

/// Provides entry-boundary dispositions without decoding a transport or running maintenance work.
pub trait ImageEntryBoundaryPort {
    /// Returns the current fail-closed disposition for the named conditional inbound family.
    async fn inspect_inbound_boundary(
        &self,
        marker: &InboundContractMarker,
    ) -> Result<ConditionalInboundBoundaryAssessment, ImageApplicationError>;

    /// Returns whether a declared bounded action may be handed to an application facade later.
    async fn inspect_job_action_boundary(
        &self,
        marker: &ImageJobActionMarker,
    ) -> Result<ImageJobActionAvailability, ImageApplicationError>;
}
```

| entry | 可调用对象 | current outcome | 重新开放前绝对禁止 |
|---|---|---|---|
| `worker::inbound_event_consumer` / `source_refresh_consumer` | `ImageEntryBoundaryPort::inspect_inbound_boundary`，未来仅通过 `consumer_service` facade | `Unavailable` / `Rejected` / `ReopenRequired`；可更新本地 marker，但不写 core truth | envelope/topic/receipt/dedup persistence、BuildIntent、snapshot、candidate、source truth mutation、broker/process observability。 |
| `jobs::runners` / planned action binaries | `ImageEntryBoundaryPort::inspect_job_action_boundary`，未来仅通过 `job_service` facade | `Declared` 只说明一个 bounded action identity已被设计；`Blocked`/`ReopenRequired` 只说明不得执行 | scheduler、cron、lease、cursor、run_id、report、evidence、verdict、signoff、unbounded retry、direct repository/adapter call。 |
| `api` | 本节不提供 API port；API 仍等 Step 8 command/query schema 与 Step 9 handler flow | no API action is made active by this Step | route/RPC/authorization/serialization/runtime server、direct repository/domain/adapter call。 |

### 12.7 external seam 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| mapping/component/seed/base 是否只传 body-free ref与safe conclusion | `pass_with_pending` | `MI-UP-002/003/006` 未关闭；conclusion 枚举不等 concrete positive adapter。 |
| builder/registry 是否区分 handoff、outcome、candidate与真实 digest | `pass_with_pending` | `Recorded` / `Observed` 均须继续经过 domain guard；`Q-MI-003` 阻断产品实现。 |
| gate/evidence/Artifact 是否未私造 inventory、Artifact ref或 accepted | `pass_with_blocker` | `Q-MI-004` 与 `MI-UP-007` 使 port只返回 non-positive boundary assessment。 |
| Member Service 是否未把 local entry 当 consumer confirmation | `pass_with_blocker` | `MI-UP-001` 下只有 `ConsumerHandoffGap` / reopen；无 manifest、confirmation或 lifecycle port。 |
| inbound / job 是否未造 transport或执行事实 | `pass_with_blocker` | `MI-UP-005` 仍关闭 worker write path；jobs只有 bounded action boundary，不含 scheduler/run/report。 |
| Core compile dependency 是否未被 adapter伪装绕过 | `pass_with_blocker` | `MI-UP-004` 仍为零 active Cargo path；无 Core port/local alias。 |

## 13. Infra implementation / fake parity 与 entry restriction 契约（7.5）

### 13.1 planned adapter implementation matrix

下表是 future implementation 的唯一归属方向，不声明文件、adapter、store、配置或 fake 已存在。每一 implementation 都必须只实现 application-owned port；具体 persistence schema、provider binding、config key、transaction engine 和 test fixture 仍分别留 Step 11、14、16。

| application port / trait group | planned infra file | implementation responsibility | blocked / fake parity requirement |
|---|---|---|---|
| `ImageClockPort`、`ImageIdGeneratorPort` | `clock_id.rs` | 产生 local time / opaque ID，不依赖 object text、route、external ref、DB row id或 timestamp拼接 | fake 必须可控且 deterministic；不得使 fake time/ID成为 domain/production identity规则。 |
| `ImageUnitOfWorkManager` + all local truth repositories | `repositories.rs` | versioned get/list/save、same-UoW staging、append-only trace、unique relation enforcement | durable 与 fake 都必须拒绝 wrong-kind、wrong-UoW、implicit upsert、stale version；rollback后 staged local truth/result/marker不可见。 |
| `CommittedImageTruthSnapshotPort`、`ImageProjectionRepositoryPort` | `projection_store.rs` | 仅从 committed local truth读取 snapshot，保存/read existing view与freshness | fake/durable 都不得由 view/cache/private map构造 truth 或 query-time创建 view。 |
| `ImageIdempotencyRepositoryPort` | `idempotency_store.rs` | reserve / stored shell / replay body / complete 的 same-UoW local storage | fake/durable 必须同样拒绝 missing/mismatch replay，duplicate不得重跑 mutation/job；Step 8 body未闭口时无正向存储调用。 |
| `ImageAssemblyReferenceResolverPort` | `source_adapters.rs` | 验证 named body-free refs并映射为 resolution enum | unavailable/unknown/blocked与 fake 行为必须显式返回，不得读取owner body、解析 string、默认为 `Concluded`。 |
| `BuilderRegistryPort` | `build_adapters.rs` | product-neutral handoff/observation mapping | blocked adapter和 fake 不能将 ACK/tag/cache/fixture shortcut映射为 candidate/digest/availability。 |
| `QualificationBoundaryPort` | `qualification_adapters.rs` | 权威/evidence/Artifact boundary的 non-positive assessment | fake/durable 不得返回 gate pass、Artifact ref、formal resolution、accepted handoff或 owner inventory。 |
| `MemberServiceSupplyPort` | `supply_adapters.rs` | consumer boundary diagnosis / reopen direction | fake/durable 不得返回 manifest、consumer confirmation、host/container/session/launch/health或 `Resolved` evidence。 |
| `ImageEntryBoundaryPort`、composition availability | `runtime_builder.rs`、`config.rs` | 对 slot/config/fake mode给出 local availability与 entry disposition | `Available`/`Assembled` 仅 local composition；production拒绝 `FakeOnly`，未配置不得 fallback。 |
| all test doubles | `fakes.rs` + `tests/support` | deterministic port implementation，仅供 `ImageFakeMode::TestOnly` composition | 不导出到 production composition，不拥有 private truth、无法绕过 expected-version/UoW/body-free/entry restrictions。 |

### 13.2 adapter availability surface

`ImageAdapterAvailabilityMarker` 已在 Step 6 定义。以下 port 使 application / composition 能读取这一 local marker，而不让服务去读 config body、adapter private state或 provider health。它的 `Available` 仍然仅表示本仓 boundary-conforming implementation 已装配；它不能生成任何 domain positive state。

```rust
/// Reads the latest local availability marker for a declared infra slot.
pub trait ImageAdapterAvailabilityPort {
    /// Returns the recorded local marker for exactly one declared slot; missing marker is None,
    /// never an implicit Available default.
    async fn get_slot_availability(
        &self,
        slot_kind: ImageAdapterSlotKind,
    ) -> Result<Option<ImageAdapterAvailabilityMarker>, ImageApplicationError>;

    /// Lists only declared local slot markers in deterministic slot-kind order; empty means no
    /// local marker has been recorded and does not prove that no external boundary exists.
    async fn list_slot_availability(
        &self,
        page: &ImageRepositoryPageRequest,
    ) -> Result<ImageRepositoryPage<ImageAdapterAvailabilityMarker>, ImageApplicationError>;
}
```

| marker value | composition action | application/domain consequence |
|---|---|---|
| `Available` | corresponding infra implementation may be wired subject to config/fake mode validation | no automatic mapping validity, build success, candidate, gate pass, Artifact acceptance, entry availability or consumer confirmation. |
| `Blocked` | caller must select blocked/gap branch | may produce only safe `Unavailable` / gap input, never fallback adapter success. |
| `Unknown` | caller must retain unknown / fail-closed branch | cannot reinterpret as Available via cache, default or fake private state. |
| `FakeOnly` | allowed only under `ImageFakeMode::TestOnly` | production assembly must remain blocked; fake result cannot be recorded as evidence/readiness. |

`ImageAdapterAvailabilityPort` is implemented by `infra::runtime_builder` / `config` using the Step 6 carrier; it is not a new source-of-truth repository and it does not save domain truth. Any persistent marker update belongs to a future configuration/composition flow and must use the same local UoW/version rules if it becomes mutable local state; Step 14 decides its configuration binding, not this Step.

### 13.3 entry module call restrictions

| module | may call | must not call | current state |
|---|---|---|---|
| `api` | future application command/query facade after Step 8 schema and Step 9 flow close | repository, UoW manager, domain constructor/transition, resolver, adapter, config, fake private state | deferred; no route/server/public DTO in Step 7. |
| `worker` | `ImageEntryBoundaryPort` for fail-closed marker handling; future `consumer_service` facade only after `MI-UP-005` closure | repository, UoW, domain, builder/registry, source resolver, broker ACK/receipt/outbox/publisher | blocked for truth write; no event envelope/topic/receipt. |
| `jobs` | `ImageEntryBoundaryPort` for action boundary; future `job_service` facade only | repository, UoW, domain, resolver/adapter direct call, scheduler/run/report/evidence/signoff | declared bounded actions only; no execution fact. |
| `infra` composition root | constructs application port implementations and passes them into allowed entry/application composition | calling domain transitions or inventing business branch based on product/config/availability | planned only; no provider/product selection. |

There is deliberately no `PublisherPort`, outbox repository, outbound payload snapshot, delivery-state adapter, publisher fake, or outbound event entry in this matrix. `MI-UP-009` remains an absence boundary. Should outbound authority later arrive, the project must reopen Step 2/3/5/7/8/9/11~13 instead of adding an adapter under this completed Step 7.

### 13.4 infra / entry 模块内停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| every application port has a planned infra owner | `pass` | mapping is to planned files only; physical files and implementations do not yet exist. |
| fake/durable parity covers version, UoW, replay, body-free and blocked behavior | `pass_as_contract` | concrete test cases remain Step 16; no fake may add a positive branch missing from durable design. |
| `ImageAdapterAvailabilityPort` avoids provider/config leakage | `pass` | marker is local composition observation only; Step 14 still owns config binding. |
| api/worker/jobs do not bypass application | `pass` | API deferred; worker write blocked; jobs only declare bounded action. |
| no publisher/outbox/outbound delivery is introduced | `pass` | `MI-UP-009` remains pending; absence is intentional. |

## 14. Step 6 open-item closure（7.6 / first close）

Step 6 §16.5 列出的承接项在本 Step 的收口如下。这里的“关闭”只表示已获得本仓 Trait / Port / Adapter 的 callable surface、owner 和限制；它**不**表示 pending external owner 已关闭、具体实现存在、协议 schema已产生、flow已执行或任何 positive business result成立。

| Step 6 open item / 承接项 | Step 7 关闭结论 | 仍后置的步骤 / blocker |
|---|---|---|
| ID / clock / canonical input | `ImageIdGeneratorPort`、`ImageClockPort`、`ImageOperationInputCanonicalizerPort` 已有 owner、签名和禁止输入；canonicalizer 仍 `blocked_for_positive_use` | Step 8 每协议字段/可选语义与 Step 13 并发幂等；不得生成 digest。 |
| DefinitionAssembly repository + ref resolver | repository的 family/variant/baseline/revision/mapping snapshot versioned read/save 与 `ImageAssemblyReferenceResolverPort` 已闭合 | `MI-UP-002/003/006` 的 concrete resolution、Step 8 protocol、Step 9 flow、Step 11 store。 |
| BuildCandidate repository + builder/registry seam | intent/snapshot/attempt/outcome/candidate local read/save 与 `BuilderRegistryPort` 的 handoff/observation carrier 已闭合 | `Q-MI-003` product choice；Step 8/9 exact command/flow；无 real digest/publish claim。 |
| Qualification repository + evidence/gate/Artifact seam | provenance/gate/eligibility/handoff local store与 `QualificationBoundaryPort` 的 non-positive boundary diagnosis 已闭合 | `Q-MI-004` gate inventory/priority、`MI-UP-007` Artifact formal handoff；不得产生 `Passed` / `Accepted`。 |
| Supply repository + Member Service consumer seam | transition/entry/consumer gap local read/save 与 `MemberServiceSupplyPort` 的 gap/reopen direction 已闭合 | `MI-UP-001` manifest/ref/qualification/confirmation；当前不得 `Resolved`。 |
| Reference/projection/trace/gap repository | snapshot/gap/trace、committed-truth snapshot、existing projection/freshness ports已闭合 | Step 8 public view/page schema、Step 9 rebuild timing、Step 11 persistence; projection不可回写truth。 |
| UoW / idempotency / stored result | manager、version helpers、reservation/replay typed surface与 duplicate no-rerun rule已闭合 | Step 8 replay body、Step 11 transaction store、Step 13 canonicalization/concurrency；无 completed positive replay body。 |
| infra composition / adapter / fake | implementation matrix、availability lookup、blocked/fake parity、production fake exclusion已闭合为设计契约 | Step 14 config binding、Step 16 executable tests；`Q-MI-003`仍不选产品。 |
| conditional worker / bounded job entry seam | `ImageEntryBoundaryPort` 与 entry only-through-application restrictions已闭合 | `MI-UP-005` event authority/schema；Step 8 event/job carrier、Step 9 flow；无 envelope/receipt/run/report。 |
| cross-seam audit | 下节逐项复核 owner、read surface、version/UoW、projection、fake与外部 body边界 | Step 8 以后仍须以具体 protocol/flow/state复核，不能把本表当实施许可。 |

## 15. 模块与跨接缝闭环审计（7.6 / final audit）

### 15.1 Trait / Port / Adapter 索引与唯一 owner

| 名称 | 类型 | 定义位置 | caller / implementation direction | 关键边界 |
|---|---|---|---|---|
| `ImageClockPort` | technical port | `application::ports::technical` | application -> infra `clock_id` / fake | local record time only. |
| `ImageIdGeneratorPort` | technical port | `application::ports::technical` | application -> infra `clock_id` / fake | local opaque ID only. |
| `ImageUnitOfWork` / `ImageUnitOfWorkManager` | technical port | `application::unit_of_work` | application -> infra repository/fake UoW | ReadWrite only; commit/rollback local writes only. |
| `ImageOperationInputCanonicalizerPort` | technical port | `application::idempotency` | application -> future infra/fake | blocked until Step 8 gives exact protocol input. |
| `DefinitionAssemblyRepositoryPort` | local truth repository | `application::ports::repositories` | definition service -> infra repository/fake | family/variant/baseline/revision/mapping local truth. |
| `BuildCandidateRepositoryPort` | local truth repository | `application::ports::repositories` | build service -> infra repository/fake | intent/snapshot/attempt/outcome/candidate local truth. |
| `QualificationRepositoryPort` | local truth repository | `application::ports::repositories` | qualification service -> infra repository/fake | provenance/gate/eligibility/handoff local truth. |
| `SupplyEntryRepositoryPort` | local truth repository | `application::ports::repositories` | supply service -> infra repository/fake | transition/entry/consumer-gap local truth. |
| `ReferenceDerivedRepositoryPort` | reference/history repository | `application::ports::repositories` | reference/query service -> infra repository/fake | snapshots/gaps/append-only trace only. |
| `CommittedImageTruthSnapshotPort` | projection input port | `application::ports::repositories` | projection rebuilder -> infra projection store/fake | committed local truth only. |
| `ImageProjectionRepositoryPort` | projection repository | `application::ports::repositories` | query/rebuild service -> infra projection store/fake | existing view/freshness; no query-time creation. |
| `ImageIdempotencyRepositoryPort` | replay repository | `application::idempotency` | write facade -> infra idempotency store/fake | duplicate reads stored shell/body, never reruns. |
| `ImageAssemblyReferenceResolverPort` | external resolver | `application::ports::external` | definition/reference service -> source adapter/fake | body-free mapping/component/seed/base conclusion only. |
| `BuilderRegistryPort` | external adapter | `application::ports::external` | build service -> build adapter/fake | handoff/observation is not candidate/digest/publish. |
| `QualificationBoundaryPort` | external boundary adapter | `application::ports::external` | qualification service -> qualification adapter/fake | non-positive assessment only while blockers remain. |
| `MemberServiceSupplyPort` | external boundary adapter | `application::ports::external` | supply service -> supply adapter/fake | consumer gap/reopen only while `MI-UP-001` remains open. |
| `ImageEntryBoundaryPort` | entry boundary port | `application::ports::external` | consumer/job service -> runtime builder/blocked fake | no envelope, broker, scheduler or run fact. |
| `ImageAdapterAvailabilityPort` | composition availability port | `application::ports::technical` | composition/application -> runtime builder/config/fake | local marker only; no business success. |

The index is intentionally limited to port contracts. It does not create a public API index, a sibling import surface, a Cargo dependency, a route, a topic, a manifest schema or a runtime topology; those remain either Step 8/14 material or external-owner pending items.

### 15.2 cross-seam audit table

| 审计项 | 结论 | evidence / constraint | 不满足时处置 |
|---|---|---|---|
| port ownership / reverse dependency | `pass` | only `application` owns ports; infra implements; contracts/domain own no infrastructure port; api/worker/jobs only call facade direction | any direct infra/domain/repository access from entry or concrete infra import by application returns to Step 5/7 redesign. |
| local truth read surface | `pass` | five repository groups provide exact typed get, scope/history/current lookup and explicit empty/missing semantics | Step 8/9 may not scan fake map, infer current from history, or add ad hoc lookup. |
| expected-version source | `pass` | every mutable local truth/marker save receives `ExpectedLocalObjectVersion` and same `ImageUnitOfWork`; `Exact` comes only from `Versioned<T>.version` | use of timestamp, cursor, external revision/tag/digest or last-write-wins is rejected. |
| UoW / append / replay ordering | `pass_with_defer` | UoW begin/commit/rollback, append-only trace and reservation -> result -> complete chain are named | exact per-protocol sequencing waits Step 8/9/11/13; no positive replay body exists yet. |
| query / projection separation | `pass` | query sees existing indexed read model + freshness; rebuild input is `CommittedImageTruthSnapshotPort`; affected existing views only | query cannot create/rebuild/scan truth; projection/cache/fake cannot write core truth. |
| page helper ownership | `pass_with_defer` | `ImageRepositoryPageRequest/Page<T>` are application-local and each list function declares sort/empty semantics | Step 8 must define independent public page DTO/token; no internal cursor leakage. |
| typed ref exact-kind / external body | `pass` | local refs enter repository by typed wrapper; external seams take named `OpaqueReference` wrappers and return safe carriers | raw ID/string, SDK/provider body, manifest/template content, live memory/checkpoint/workspace, logs/reports/secrets are `ContractViolation` or design stop. |
| static template versus live state | `pass` | seed resolver accepts only `SeedTemplateRef` + static kind/placement; baseline/snapshot uses body-free binding | live runtime memory/checkpoint/workspace/container state may not enter any resolver, repository, build input or fake. |
| builder outcome / immutable identity | `pass_with_pending` | observation separates handoff, execution, result kind, immutable image ref and verification source; candidate guard remains required | ACK/2xx/tag/cache/guessed digest cannot form candidate; concrete positive adapter awaits `Q-MI-003`. |
| Artifact boundary | `pass_with_blocker` | `QualificationBoundaryPort` exposes only non-positive assessment; local record can remain Pending/Gap | no gate inventory, Artifact consumable ref, resolution or `Accepted` until `MI-UP-007` / `Q-MI-004` formally close. |
| Member Service boundary | `pass_with_blocker` | `MemberServiceSupplyPort` exposes only gap/unavailable/reopen; `ConsumerHandoffGap` is separate from local entry | no consumer manifest/ref confirmation/launch/health; no `Resolved` until `MI-UP-001` closes. |
| conditional inbound event | `pass_with_blocker` | entry port only returns availability/rejection/reopen marker and worker has no write path | no envelope/topic/receipt/dedup/broker or BuildIntent creation before `MI-UP-005` and Step 8 reopen. |
| jobs | `pass_with_defer` | jobs only inspect an action boundary and call future application facade | no scheduler, lease, cursor, run_id, report, evidence, verdict, signoff, direct repo/adapter or blind retry. |
| fake / durable parity | `pass_as_contract` | same version/UoW/missing/conflict/blocked/body-free/replay rules; test fake only under `TestOnly` | a fake positive branch unavailable in durable design is a design defect, not a test convenience. |
| compile/runtime/event/ref/adapter/fake classification | `pass_with_blocker` | all external seam rows retain explicit classification; Core is zero active compile dependency | consumption must not add Cargo path dependency; `MI-UP-004` requires formal package/path recheck. |
| outbound absence | `pass` | no publisher, outbox, payload, delivery state, outbound event or publishing job port exists | future authority requires reopening affected design steps; it cannot be appended to infra matrix. |

### 15.3 Step 7 protocol / flow readiness boundary

This Step has made enough **internal port surface** available for a later Step 8 to define protocol fields without inventing repository/adapter names. It has **not** made any external pending lane ready. The following distinction is binding:

| later work | allowed Step 8/9 precondition after user authorization | still blocked / must remain a placeholder |
|---|---|---|
| local Command / Query | local typed objects, repository reads/writes, UoW/version, projection/read-only, safe error carriers | complete DTO/result/replay-body schema, canonical input, exact transaction ordering and protocol error mapping. |
| local bounded Job | declared action marker, persisted local scope port and entry boundary check | scheduler/run/report/evidence, retry/lease/cursor policy and any external positive effect. |
| conditional inbound event | only unavailable/rejected/reopen marker and `ImageEntryBoundaryPort` | envelope/topic/source authority/dedup/receipt/accepted mapping and any truth mutation under `MI-UP-005`. |
| mapping/component/seed/reference refresh | typed body-free resolver port and snapshot/gap store | source body, positive owner confirmation, mutable selector, live-state import; affected MI-UP blockers remain. |
| build / qualification / supply handoff | local object/repository and conservative adapter boundary | product backend, real digest, gate pass/inventory, Artifact accepted, Member Service confirmation/manifest/launch/health. |

### 15.4 formal `03-详细设计.md` 回填草稿

> 校准来源：
> - `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“Application 基础 technical port 契约”“DefinitionAssembly / BuildCandidate / Qualification / SupplyEntry local truth repository port”“ReferenceDerived、projection 与 replay port”“External seam port 契约”“Infra implementation / fake parity 与 entry restriction 契约”和“模块与跨接缝闭环审计”小节，了解 port 所属、读取面、version/UoW、projection、fake 和 pending external boundary 如何收敛。

正式 `03-详细设计.md` 第 5 章将按模块回填以下收口结论，且只能在 Step 19 的正式装配门禁开放后写入：

| 正式章节 / 模块 | 取自本 Step 的回填结论 | 装配时必须保留的限制 |
|---|---|---|
| `application` | 是唯一 port owner；technical/UoW/idempotency、五类 local repository、projection/replay与 external seam均有 typed Rust-facing surface | public protocol DTO、route/topic、result body和逐 flow顺序不在本节装配；canonicalizer 当前不可正向使用。 |
| DefinitionAssembly / BuildCandidate | local repository保存本仓 truth；assembly resolver和 builder/registry seam只提供 body-free conclusion/handoff/observation | mapping/component/seed body、provider/product、ACK/tag/digest/candidate shortcuts禁止写入。 |
| Qualification / SupplyEntry | local qualification/supply truth、Artifact and Member Service boundary均显式分离 | `MI-UP-007` / `MI-UP-001` 未闭口时仅 Pending/Gap/reopen，不写 `Accepted` / `Resolved` 或 consumer runtime事实。 |
| ReferenceDerived / query projection | committed truth snapshot、existing projection、freshness、trace、gap与 replay store有明确读写面 | query不创建 view；projection/fake/cache不反写truth；public view/page等 Step 8。 |
| `infra` | 只实现 application ports，按 planned file matrix承接 store/adapter/blocked/fake/composition；availability只是 local composition | 不声称配置、产品、adapter、fake、store或实现仓存在；fake不进 production。 |
| `api` / `worker` / `jobs` | 入口仅调用 application facade；worker当前 fail-closed，jobs只保留 bounded action | 无 API route、event envelope/topic/receipt、scheduler/run/report/evidence；无 outbound publisher/outbox。 |
| 第 6 章索引 | 引用 §15.1 的 trait/port名称、模块和定义位置 | 索引不新增 trait / protocol / implementation fact。 |

### 15.5 pending / blocker ledger

| 编号 | 当前状态 | 本 Step 已收口的安全边界 | 仍阻断的正向事项 / reopen condition |
|---|---|---|---|
| `MI-UP-001` Member Service consumer contract | `pending` | `MemberServiceSupplyPort` + `ConsumerHandoffGap` 只可 Gap/Unavailable/Reopen | exact manifest/variant/ref/qualification/confirmation; reopen Step 7~9 only after owner formal close. |
| `MI-UP-002` member component release / compatibility | `pending` | component resolver accepts only named immutable ref and safe conclusion | actual Member release shape/compatibility; no pinned positive component conclusion until owner closes. |
| `MI-UP-003` Method Library mapping query/body | `pending` | mapping resolver/snapshot preserve ref-only use and gap | exact mapping authority/query/body; no RoleDefinition/mapping body or direct role mapping result. |
| `MI-UP-004` Core shared contract | `pending` | no Core port/local alias/Cargo path; seam remains `compile` classification only | formal Core type/export/package/path must be verified before any compile dependency. |
| `MI-UP-005` inbound event | `pending` | entry port and `InboundContractMarker` preserve unavailable/rejected/reopen | source authority, event schema, envelope, dedup, receipt, truth-write flow. |
| `MI-UP-006` seed semantic / ownership contract | `pending` | only static seed ref/kind/placement safe resolver input | template semantic body / allowed owner shape; live memory/workspace always excluded. |
| `MI-UP-007` Artifact handoff | `pending` | qualification boundary only returns non-positive assessment; local record remains Pending/Gap | formal Artifact consumable ref, resolution, acceptance/lineage boundary. |
| `MI-UP-009` outbound build/release event | `pending / absent` | explicit absence of publisher/outbox/delivery port | authority must reopen design; no local workaround. |
| `Q-MI-003` backend/product/config choice | `pending` | adapter slots/availability/blocked/fake matrix only | builder/registry/store/config product and binding belong Step 14/04 after authority. |
| `Q-MI-004` gate/evidence inventory / priority | `pending` | typed authority/set/conclusion refs and non-positive boundary assessment | no gate kind/list/priority/positive passed lane until authority formalizes it. |

## 16. Step 7 完成检查与停审门禁（7.6）

| 检查项 | 结论 | 依据 |
|---|---|---|
| 7.0~7.6 写入批次是否完整 | `pass` | §1、§4~§15 已覆盖 shared/technical、five repository groups、reference/projection/replay、external seams、infra/entry和全局审计。 |
| 每个 port 是否有 caller、implementation direction、参数、返回与错误面 | `pass` | §6~§13 的 trait Rust contract及 capability matrix；implementation均明确为 planned。 |
| Step 8~11 所需 local read/save、version/UoW、projection/replay表面是否有承接 | `pass_with_defer` | local surface已闭合；protocol body、flow sequence、state matrix、DDL/transaction/retry仍由后续 Step 完成。 |
| external pending 是否未被写成正向合同或验收事实 | `pass_with_blockers` | §12、§15.3、§15.5 仅保留 body-free/gap/blocked/unavailable/unknown/reopen；无 digest、Artifact accepted、consumer confirmation、event receipt。 |
| fake / composition 是否与 production boundary隔离 | `pass_as_contract` | §13 matrix和 `ImageFakeMode::TestOnly`；具体测试留 Step 16。 |
| no outbound publisher/outbox 是否保持 | `pass` | §11、§13、§15均明确无此 port；`MI-UP-009` 未关闭。 |
| formal 03 / Step 8 / implementation / commit 是否未提前发生 | `pass` | 本轮只更新 Step 7 calibration和台账/flow；未读旧正式 03、未装配正式文档、未建实现仓或 Cargo、未运行测试、未提交。 |
| 用户授权边界 | `stop_review_required` | 用户仅授权到 Step 7；下一动作必须等待用户再次明确确认 Step 8。 |

```text
step_status = completed_stop_review
gate_status = blocked
gate_reason = user_confirmation_required_for_step_08
next_allowed_action = wait_for_explicit_user_confirmation_before_creating_step_08
formal_03_write_allowed = false
old_formal_03_read_allowed = false_until_step_19_historical_audit
implementation_allowed = false
commit_required = false
```

**停审结论：**`03` 的 Step 7 已完成。当前仅允许停审并等待用户明确确认；不得创建 `03_ddd_step_08_protocol_contracts.md`、不得装配正式 `03-详细设计.md`、不得创建实现仓/Cargo/代码/测试/证据，也不得提交 commit。
