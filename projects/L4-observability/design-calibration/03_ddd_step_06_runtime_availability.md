# L4-observability 03-详细设计 Step 06 - R06.7-B application runtime availability

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 本批目标: 独立闭合 `AdapterAvailabilityScope`、`AdapterAvailabilityKind`、`AdapterAvailabilityState`
> 当前模式: full-restart 定向粒度修复

## 1. 批次状态与写入边界

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前批次 | `R06.7-B` |
| 批次状态 | `R06.7-B_done_consumed_by_R06.7-E` |
| 唯一语义 owner | `application::ports::runtime` |
| 构造 / 组装方 | `infra` probe / runtime builder；不拥有三类对象语义 |
| 允许写入 | 本文件静态纠错与控制文件一致性同步；C继续引用本文件的canonical三对象 |
| 禁止写入 | `R06.8`、Step 07~19、正式 `03-详细设计.md`、任何 `04` 文件、实现代码 |
| 验证状态 | design-only；所有实现 / 集成 / runtime 测试为 `planned/not_run` |
| 提交状态 | 不创建 commit |

本批只闭合三个 application runtime value / snapshot 对象。`AdapterAvailabilityProbe` trait 的完整签名仍属于 Step 07；R06.7-C 已消费三对象并闭合 infra runtime builder / technical registration，R06.7-D/E随后完成entry候选与跨模块审计且未改动本文件schema。B 的历史停审门已由用户确认消费，不单独授权进入任何后续批次。

## 2. 输入权威与历史材料处理

### 2.1 本批读取的权威输入

| 输入 | 用途 | 当前裁定 |
|---|---|---|
| `03_ddd_step_06_runtime_infra_entry_carriers.md` §§1~11 | R06.7-A authority、owner、scope inventory 与批次门禁 | current recovery source；A 已完成并经用户确认进入 B |
| `03_ddd_step_06_object_contracts.md` §6.7 / §6.25 | Step 06 对象资格、application owner、后置承接 | 旧 availability 合并段被本批独立卡覆盖 |
| `03_ddd_step_06_contracts_carriers.md` | `AdapterFamily` canonical owner | 只引用 finite family，不复制定义 |
| `03_ddd_step_06_domain_truth_signal_audit.md` §7.2 | `ObservedAt` canonical owner、clock / wire boundary | 复用本仓 boundary-clock instant，不创建 runtime-local timestamp |
| `03_ddd_step_06_application_external_effect_intent_tokens.md` | `ExternalEffectBindingRef` 的 application owner与不可泄漏 locator 边界 | exact binding 只复用于三类 external-effect family |
| `03_ddd_step_06_application_report_error_service.md` | `ApplicationError` 唯一 owner、service façade availability dependency | 不复制 error enum；只写 contextual mapping |
| `03_ddd_step_07_trait_port_adapter_contracts.md` availability use-site | probe consumer / producer 边界 | 只读取，不在本批复制 trait 签名或修改 Step 07 |
| `03_ddd_step_14_config_external_binding.md` §§8、9、17 | family / exact binding、safe catalog、complete-or-error assembly | raw config 与 concrete adapter 仍留在 infra |
| `standards/document/详细设计讨论流程_SOP.md` Step 06 | 对象卡、字段来源、factory / member、enum、闭环审计要求 | 每个对象独立成节；不能以 family 表替代 |
| `standards/document/详细设计书写规范.md` 5.5 | Rust-facing 可落码粒度 | 每个字段写类型、来源、约束；每个 variant 写来源与去向 |

### 2.2 历史材料与废止内容

以下内容只作为冲突诊断输入，不是 current contract：

1. 旧合并卡中 `AdapterAvailabilityState.diagnostic_ref`。availability probe 不得因探测创建或持久化 diagnostic summary；`DiagnosticSummaryRef` 的 mint / durable owner 不属于 runtime snapshot，因此本批移除该字段。
2. 旧 `is_available()` 与 `require_available()` 的合并语义。`Degraded` 是否可调用取决于 operation / read policy，通用布尔值不能授予调用权限；本批改为明确的分类谓词，不保留会把 `Degraded` 与 `Available` 混淆的 `require_available()`。
3. infra-local `AdapterBindingRef`、endpoint、route、topic、credential、provider status、health response body。它们不得进入 application scope / state。
4. `Unknown`、`Unsupported`、`Other(String)` 等动态 availability variant。当前四态是有限集合；不可分类的 probe failure 返回 typed `ApplicationError`，不能隐式新增 variant。

## 3. Capability、对象与 owner 映射

| capability | 输入 | 输出 | 主要副作用 | 承接对象 | 后续承接 |
|---|---|---|---|---|---|
| 定义一次 probe 的范围 | compile-time `AdapterFamily`、可选 exact effect binding | family 或 exact-effect scope | 无 | `AdapterAvailabilityScope` | Step 07 probe |
| 表达有限可用性分类 | validated config / probe classification | 四态 product-neutral kind | 无 | `AdapterAvailabilityKind` | Step 08/09 surface mapping；Step 12 error mapping |
| 形成一次不可变 snapshot | scope、kind、application clock time | safe availability snapshot | 无 domain write、无 external call | `AdapterAvailabilityState` | API / worker / jobs read-only consumption |
| 检查是否可进行无降级调用 | state classification | conservative boolean / contextual guard input | 无 | `AdapterAvailabilityState` + `Kind` | application façade / flow |

### 3.1 唯一 owner 与依赖方向

| 内容 | definition owner | construction owner | consumer | 禁止事项 |
|---|---|---|---|---|
| `AdapterFamily` | `contracts` canonical type | validated catalog / compile-time table | application / infra / domain policy | 本批不复制 enum |
| `ExternalEffectBindingRef` | `application::runtime` | validated config derivation | exact external-effect scope | 不暴露 raw binding |
| `ObservedAt` | `contracts::metadata` | application-owned clock boundary | snapshot timestamp | 不用 provider response time / DB default |
| availability scope / kind / state | `application::ports::runtime` | infra probe / builder | application façades and entry read surface | infra 不定义 shadow type |

三类对象是 application port boundary types。`infra` 可以构造它们，并只把selected profile实际需要的availability capability装入R06.8-B三个具名runtime之一；historical aggregate `BuiltObservabilityRuntime`不得恢复。Infra不能改变 variant、增加 provider-specific status、把 health 结果升级为业务成功，或把 raw binding 传回 application。

## 4. 跨对象语义裁定

### 4.1 Family scope 与 exact effect scope

`AdapterAvailabilityScope` 的 `effect_binding_ref` 不是通用 adapter locator，而是已经由 application runtime 校验过的 immutable external-effect binding identity。它只允许出现在以下三个 `AdapterFamily` 上：

| exact-capable family | exact binding 的用途 | 不代表 |
|---|---|---|
| `EventPublisher` | 一个 outbound publication target 的 historical binding | event 已发布、下游已消费或业务已接受 |
| `ReportHandoffDelivery` | 一个 report handoff target 的 historical binding | handoff 已交付、验收已签署或 report 已被接受 |
| `PeripheralExportDelivery` | 一个 peripheral export target 的 historical binding | dashboard / GRC / alert 已接收或形成 external truth |

其余 `AdapterFamily` 只能使用 family-level scope (`effect_binding_ref = None`)。即使 external-effect family 使用 `None`，它也只是 aggregate snapshot，不能授权具体 target call。exact scope 也只证明 probe 针对哪个 immutable binding，不证明该次 operation 成功。

### 4.2 Snapshot 与 truth / lifecycle 的分离

`AdapterAvailabilityState` 是一次 probe / validated-configuration classification 的不可变 runtime snapshot，不是 Step 10 的独立业务状态机。每次新的 probe 产生新的 value；不得原地推进、持久化、分配 cursor、写 outbox、写 diagnostic、修改 reference / projection / observation truth 或触发 external effect。

`observed_at` 是本仓 boundary clock 记录的分类时点。它不表示 external occurred time、freshness TTL、causal order、operation completion 或 acceptance time。snapshot 是否仍可用于某个 operation 的 freshness / policy 判断由 application flow 与 Step 14 配置边界决定，本对象不自行猜测过期。

### 4.3 四态的最小安全解释

| kind | 允许的事实 | 不允许的推断 | 默认调用语义 |
|---|---|---|---|
| `Available` | 在该 scope 的 probe 边界上，所需 adapter capability 被判定为可尝试 | 外部调用已成功、已发布、已交付、已消费 | 可进入 application operation guard；仍需执行结果闭环 |
| `Degraded` | adapter 仍可提供受限或只读能力，或 application 明确将其标为降级 | 可自动当作完整 capability；可推断成功 | 只有 operation / read policy 明确允许时才可继续；否则映射为 family-specific unavailable/degraded result |
| `Unavailable` | 当前 scope 不能提供所需 capability | 可 fallback 到 current/default target、fake success 或静默跳过 | 阻止需要该 capability 的 call；Query 可暴露安全 availability surface |
| `Misconfigured` | validated configuration 或 binding capability 不满足正式约束 | 可通过 alias、默认值、provider status 或重试掩盖 | required startup binding 使 assembly fail；已暴露 runtime 的调用必须 fail closed |

`Available` 是唯一可以让通用 guard 返回“unrestricted attempt allowed”的分类；`Degraded` 不等于 `Available`。是否允许 degraded read 是 application policy，不由 enum 自己发起调用。

## 5. `AdapterAvailabilityScope` 对象卡

### 5.1 责任与资格

| 项 | 内容 |
|---|---|
| 资格 | `FC` full card |
| 逻辑 owner | `application::ports::runtime` |
| planned file | `crates/application/src/ports/runtime.rs`；Step 04 当前物理布局缺少该显式文件，R06.8 统一 file-layout affected review |
| 责任 | 表达一次 family-level 或 exact external-effect availability classification 的范围 |
| 不负责 | probe、catalog lookup、health call、operation authorization、external effect、持久化 |
| 输入 | `AdapterFamily`；可选 validated `ExternalEffectBindingRef` |
| 输出 | immutable scope value |
| persistence | 不独立持久化；可由 `AdapterAvailabilityState` 和同一 operation carrier 按值传递 |

### 5.2 Rust-facing definition

```rust
/// Product-neutral scope of one adapter availability classification.
pub struct AdapterAvailabilityScope {
    /// Compile-time adapter family.
    adapter_family: AdapterFamily,

    /// Exact immutable binding for an external-effect family, when applicable.
    effect_binding_ref: Option<ExternalEffectBindingRef>,
}
```

字段必须保持 typed。`adapter_family` 不能改为字符串；`effect_binding_ref` 不能改为 `AdapterBindingRef`、URL、route、topic、credential、provider account 或任意 raw config object。

### 5.3 字段来源与约束

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `adapter_family` | `AdapterFamily` | 选择 product-neutral port family | 来自 contracts finite family table；未知 token、provider 名称、动态 variant 在 config validation 阶段拒绝 |
| `effect_binding_ref` | `Option<ExternalEffectBindingRef>` | 在 exact-capable external-effect family 上指向 immutable destination / idempotency namespace revision | `Some` 只允许 `EventPublisher`、`ReportHandoffDelivery`、`PeripheralExportDelivery`；`None` 表示 family aggregate / non-target scope；不包含 locator 或 secret |

### 5.4 Factory / rehydrate / member contract

| member | exact signature | 输入来源 | 失败 / 副作用 |
|---|---|---|---|
| family scope | `pub fn family(adapter_family: AdapterFamily) -> Self` | compile-time family or validated family catalog | 只生成 `None` binding；无 I/O、无 lookup |
| exact effect scope | `pub fn exact_effect(adapter_family: AdapterFamily, effect_binding_ref: ExternalEffectBindingRef) -> Result<Self, ApplicationError>` | application-validated binding identity | 非 exact-capable family 或关系不合法返回 `ApplicationError::InvalidRequest`；不解析 binding、不调用 adapter |
| generic constructor | `pub fn try_new(adapter_family: AdapterFamily, effect_binding_ref: Option<ExternalEffectBindingRef>) -> Result<Self, ApplicationError>` | trusted application / infra assembly input；调用前必须已由 validated external-binding catalog确认 ref/family关系 | 校验 family/binding pair；不接受 raw scalar；无持久化 |
| rehydrate | `pub fn try_rehydrate(adapter_family: AdapterFamily, effect_binding_ref: Option<ExternalEffectBindingRef>) -> Result<Self, ApplicationError>` | 已保存的 application carrier / plan material, 若后续对象需要恢复 | 只验证 typed shape；不查询当前 catalog、不替换 old binding；本 scope 自身当前不建立 durable row |
| family accessor | `pub fn adapter_family(&self) -> &AdapterFamily` | self | 只读；不假定 contracts enum 的 ownership / `Copy` 实现 |
| binding accessor | `pub fn effect_binding_ref(&self) -> Option<&ExternalEffectBindingRef>` | self | 只返回 opaque typed ref；不提供 locator resolution |
| scope predicate | `pub fn is_family_scope(&self) -> bool` | self | `effect_binding_ref.is_none()` |
| exact predicate | `pub fn is_exact_effect_scope(&self) -> bool` | self | 只有 exact-capable family + `Some(ref)` 才为 true |
| exact comparison | `pub fn matches_exact_effect_binding(&self, expected: &ExternalEffectBindingRef) -> bool` | loaded application binding | 仅做 identity equality；不证明 binding 当前可解析或健康 |
| scope equality | `pub fn same_scope(&self, other: &Self) -> bool` | 两个已校验 scope | 精确比较 family 与 opaque binding identity；不比较 availability / time |

`try_rehydrate` 不是 runtime snapshot 的持久化许可。它只给后续 application carrier 在确实拥有该字段时一个 shape-validation 入口；R06.7-B 不新增 availability store 或 durable schema。

### 5.5 Scope invariants

1. `Some(effect_binding_ref)` 与 non-external-effect family 的组合必须拒绝。
2. exact scope 的 binding identity 必须保持原值；不能在 probe 或 retry 时替换为 current/default binding。
3. family scope 不能被 external effect adapter 当作 target authorization。
4. scope 不携带 `diagnostic_ref`、reason body、provider status、credential、endpoint、route、topic 或 response body。
5. scope equality 只表示 `(adapter_family, effect_binding_ref)` 相同，不表示 availability、freshness、operation success 或 external acceptance。

## 6. `AdapterAvailabilityKind` 对象卡

### 6.1 责任与资格

| 项 | 内容 |
|---|---|
| 资格 | `FC` full card |
| 逻辑 owner | `application::ports::runtime` |
| 责任 | 提供有限、product-neutral 的 availability classification |
| 不负责 | 业务结果、external lifecycle、retry authority、config mutation、operation authorization |
| 来源 | runtime probe、validated config / capability validation、controlled fake 的 formal classification |
| persistence | 不独立持久化；仅作为 runtime snapshot / safe surface input |

### 6.2 Rust-facing definition

```rust
/// Finite product-neutral classification of one adapter scope.
pub enum AdapterAvailabilityKind {
    /// The required capability may be attempted at this scope.
    Available,

    /// Only explicitly permitted degraded or read-only use may continue.
    Degraded,

    /// The required capability is not currently usable.
    Unavailable,

    /// Validated configuration or capability declaration is invalid.
    Misconfigured,
}
```

### 6.3 Variant、来源、去向与调用谓词

| variant | 允许来源 | 允许去向 | exact semantics |
|---|---|---|---|
| `Available` | successful safe probe or validated capability classification | application operation guard、read surface、telemetry mapping | 只表示可尝试；调用结果必须另行落 application outcome / durable surface |
| `Degraded` | safe probe classification with restricted capability | policy-aware degraded read / delayed / limited surface | 不得被 generic guard 当作 unrestricted availability；不能自动降级为 success |
| `Unavailable` | timeout / dependency unavailability / known unavailable probe result | family-specific unavailable error、query availability surface、delayed classification | 不调用目标 adapter；不得 fallback |
| `Misconfigured` | deterministic config or capability validation | startup assembly error、blocked operation、safe diagnostic mapping | 不自动重载、修 config、启用 fake 或调用 provider |

### 6.4 Pure member functions

| member | exact signature | semantics |
|---|---|---|
| strict availability | `pub const fn is_available(&self) -> bool` | 仅 `Available` 为 true；`Degraded` 明确为 false |
| degraded classification | `pub const fn is_degraded(&self) -> bool` | 仅 `Degraded` 为 true |
| strict guard | `pub const fn allows_unrestricted_call(&self) -> bool` | 仅 `Available` 为 true；不执行 call、不检查 binding |
| policy gate | `pub const fn requires_operation_policy(&self) -> bool` | `Degraded` 为 true；表示必须由 operation/read policy 再判断 |
| blocking classification | `pub const fn blocks_unqualified_call(&self) -> bool` | `Unavailable` / `Misconfigured` 为 true |
| configuration defect | `pub const fn is_configuration_defect(&self) -> bool` | 仅 `Misconfigured` 为 true |
| safe token | `pub const fn stable_name(&self) -> &'static str` | 返回固定内部 token；不得从 provider 或 raw config 动态生成 |

`stable_name()` 仅供后续 safe telemetry / static mapping 使用，不能作为 public protocol schema、config lookup key 或业务 truth。variant 没有 `Other(String)`、numeric alias、provider status payload 或动态扩展入口。

### 6.5 Unknown / Unsupported 处理

| 输入情况 | 当前处理 | 禁止处理 |
|---|---|---|
| unknown config token | `RuntimeAssemblyError::InvalidConfiguration`（startup）或 `ApplicationError::InvalidRequest`（application boundary） | fallback 到首个 variant / `Available` |
| unsupported capability declaration | validated config 阶段 `Misconfigured` 或 assembly error | 用 `Degraded` 掩盖结构不兼容 |
| probe 无法安全分类 | 返回对应 typed `ApplicationError`，不构造 synthetic state | 新增 `Unknown`、复制 provider enum、伪造 `Unavailable` 后继续写 truth |
| provider response body / status string | 丢弃或由 infra safe mapper 分类 | 将 raw body/status 放入 kind 或 state |

## 7. `AdapterAvailabilityState` 对象卡

### 7.1 责任与资格

| 项 | 内容 |
|---|---|
| 资格 | `FC` full card |
| 逻辑 owner | `application::ports::runtime` |
| 构造方 | infra probe / runtime builder；controlled fake 也必须使用同一 factory |
| 消费方 | application façade、API / worker / jobs read-only entry state、后续 safe telemetry mapper |
| 责任 | 绑定 scope、kind 与本仓分类时间，形成 immutable snapshot |
| 不负责 | durable lifecycle、external call、domain transition、diagnostic mint、retry / fallback、public outcome |
| persistence | 不单独持久化；如果 future carrier 保存它，必须按值保存并保留 exact scope/kind/time |

### 7.2 Rust-facing definition

```rust
/// Immutable application-owned snapshot of one adapter availability classification.
pub struct AdapterAvailabilityState {
    /// Family-level or exact external-effect scope that was classified.
    scope: AdapterAvailabilityScope,

    /// Product-neutral availability classification.
    availability: AdapterAvailabilityKind,

    /// Boundary-clock time at which this classification was obtained.
    observed_at: ObservedAt,
}
```

本批明确不包含 `diagnostic_ref`。安全错误关联由 `ApplicationError`、startup `RuntimeAssemblyIssueRef` 或后续 Step 15 safe telemetry 各自负责；probe 不因产生 state 而 mint `DiagnosticSummaryRef`，也不将 health observation 写成 diagnostic truth。

### 7.3 字段来源与约束

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope` | `AdapterAvailabilityScope` | 说明本次 classification 覆盖 family 或 exact binding | 由 application-owned scope factory 生成；必须通过 family/binding compatibility validation |
| `availability` | `AdapterAvailabilityKind` | 表达有限 runtime/config classification | 来自 safe probe 或 validated config；不得从 public response success、health HTTP code 或 provider text直接推业务结果 |
| `observed_at` | `ObservedAt` | 记录本仓 boundary clock 的 classification time | 必填、canonical UTC；不得从 external occurred time、DB default、adapter completion time或entry本地 clock补值 |

### 7.4 Factory / member contract

| member | exact signature | 输入来源 | 失败 / 副作用 |
|---|---|---|---|
| construct snapshot | `pub fn try_new(scope: AdapterAvailabilityScope, availability: AdapterAvailabilityKind, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | validated scope、formal kind、application `ClockPort` output | scope relation invalid返回 `InvalidRequest`；不做 I/O、不写 store、不调用 adapter |
| scope accessor | `pub fn scope(&self) -> &AdapterAvailabilityScope` | self | 只读 |
| kind accessor | `pub fn availability(&self) -> &AdapterAvailabilityKind` | self | 只读借用；不映射 public outcome，也不假定 enum `Copy` |
| time accessor | `pub fn observed_at(&self) -> &ObservedAt` | self | 只读；不作为 freshness decision |
| family predicate | `pub fn is_family_scope(&self) -> bool` | self.scope | 只读 |
| exact predicate | `pub fn is_exact_effect_scope(&self) -> bool` | self.scope | 只读；exact 不等于 authorized |
| strict call predicate | `pub fn allows_unrestricted_call(&self) -> bool` | self.availability | 仅 Available；不检查 operation-specific policy |
| degraded policy hint | `pub fn requires_operation_policy(&self) -> bool` | self.availability | Degraded 时 true；不直接允许调用 |
| blocking predicate | `pub fn blocks_unqualified_call(&self) -> bool` | self.availability | Unavailable / Misconfigured 时 true |
| snapshot comparison | `pub fn matches_scope(&self, expected: &AdapterAvailabilityScope) -> bool` | loaded expected scope | 只比较 scope identity；不比较 current catalog或health |
| snapshot equality | `pub fn same_snapshot(&self, other: &Self) -> bool` | 两个 immutable snapshot | 精确比较 scope、kind、observed_at；不表示 external success |

不得提供 `&mut self` 状态转换、`refresh()`、`probe()`、`retry()`、`fallback()`、`enable()` 或 `persist()` 成员。新 classification 必须创建新 value，由 owning runtime registry 替换 process-local snapshot。

### 7.5 State invariants

1. `scope` 本身必须先通过 `AdapterAvailabilityScope` 的 family/binding 关系校验。
2. `observed_at` 必须存在且可按 `ObservedAt` canonical 规则比较；不可使用隐式 `now()`。
3. `Available`、`Degraded`、`Unavailable`、`Misconfigured` 都是 classification，不是业务 lifecycle state；state 不进入 domain transition matrix。
4. state 不携带 raw config、locator、credential、provider body、external run id、evidence alias、verdict、signoff、acceptance receipt 或真实测试 evidence。
5. state equality / replacement 只表示 snapshot fields 相等；不能作为 external effect idempotency、publication success、delivery receipt或业务 truth identity。
6. probe timeout / unavailable 不得通过 state factory 伪造 `Available`；unknown mapping必须在 factory 之前由明确 error path处理。

## 8. 三对象组合矩阵

### 8.1 Scope x kind x call boundary

| scope | kind | application guard | query / diagnostic surface | external effect |
|---|---|---|---|---|
| family (`None`) | `Available` | 只允许 family-level capability check；不能授权 target | 可作为 aggregate availability | 必须再次取得 exact binding scope；不得直接 call |
| family (`None`) | `Degraded` | 只能按 operation policy决定受限能力 | 可暴露 degraded surface | 不得把 aggregate degraded当 target permission |
| family (`None`) | `Unavailable` / `Misconfigured` | family-dependent operation blocked | 暴露 unavailable / disabled / config-defect surface | 不 call、不 fallback |
| exact external effect (`Some`) | `Available` | exact binding identity match 后可进入 operation guard | 可暴露 exact binding safe classification | 仍须 stable token/payload/intent equality与正式 call result |
| exact external effect (`Some`) | `Degraded` | 只在该 effect flow 明确支持 degraded 时继续 | 暴露 degraded/delayed surface | 不可自动宣布 prepared/published/delivered |
| exact external effect (`Some`) | `Unavailable` / `Misconfigured` | exact call blocked；old binding 不替换 | 暴露 safe unavailable/disabled surface | 不 call、不切 current binding |

### 8.2 Availability 到 application error 的 contextual mapping

availability snapshot 不直接产生 error，因为 generic state 不知道调用方的 family-specific error语义。application façade 在拥有 operation context 后按下表映射：

| family | `Unavailable` / strict `Degraded` block | `Misconfigured` / disabled binding | 备注 |
|---|---|---|---|
| `ObservationStore` / `ProjectionStore` / `IdempotencyStore` / `JobExecutionStore` | `ApplicationError::RepositoryUnavailable` | `ApplicationError::AdapterDisabled` 或 startup assembly error | 不切 in-memory store；不写 partial truth |
| resolver families | `ApplicationError::ReferenceUnavailable` 或 `ResolverUnavailable` | `ApplicationError::AdapterDisabled` | formal resolver outcome 与 call failure保持区分 |
| `EventPublisher` | `ApplicationError::PublisherUnavailable` | `ApplicationError::AdapterDisabled` | outbox truth保留；不伪造 Published |
| `ReportHandoffDelivery` / `PeripheralExportDelivery` | `ApplicationError::DeliveryUnavailable` | `ApplicationError::AdapterDisabled` | handoff/export local state保留；不伪造 Delivered |
| `Clock` / `IdGenerator` | startup `RuntimeAssemblyError`；operation不可开始 | startup `RuntimeAssemblyError` | handler 不私造时间或 identity |

`Degraded` 在允许的 read-only / limited flow 中不必转换为 error，而是进入对应 `ObservationAvailabilitySurface` 或 application result carrier。具体 public enum / DTO mapping 留 Step 08，不能在本批创建第二套 surface。

### 8.3 与 public availability surface 的关系

Step 08 已有的 `ObservationAvailabilitySurface` 是 public/query mapping，不是本批三对象的替代定义：

| application snapshot | public mapping 方向 |
|---|---|
| `Available` | `ObservationAvailabilitySurface::Available`，但只表示 read surface 可用，不表示业务 operation success |
| `Degraded` | 通过既有 degraded / failure surface 规则映射；不得新增 `AdapterAvailabilitySurface` |
| `Unavailable` | `Unavailable { ... }`，gap / reason 只有已有 formal carrier 可提供时才携带 |
| `Misconfigured` | `Disabled { ... }` 或 pre-exposure application / protocol error，取决于入口阶段 |

本表只规定方向，不修改冻结 Step 08 schema；Step 08 解冻后必须逐协议审查字段来源与错误映射。

## 9. 依赖、可观测性与安全边界

### 9.1 依赖规则

```text
contracts::AdapterFamily / contracts::metadata::ObservedAt
                    |
                    v
application::ports::runtime::{Scope, Kind, State}
                    ^
                    |
          infra probe / runtime builder
```

1. application 不依赖 infra concrete type。
2. infra 只能从 validated root / private registry 构造 application carrier，并丢弃 raw locator / credential。
3. API、worker、jobs 只能读取 snapshot 或通过 assigned application façade 使用它；不得 downcast probe、repository 或 adapter。
4. availability probe 不触发 domain write、projection rebuild、reference refresh、outbox append、report handoff、external delivery 或 audit append。

### 9.2 Safe telemetry handoff

后续 Step 15 可以从 snapshot 读取以下低基数字段：`adapter_family`、`availability_kind`、scope 是否 exact、safe binding identity（若正式 telemetry policy允许）和 `observed_at` 的经过 policy 处理的时间信息。不得记录 endpoint、topic、route、credential、provider account、response body、raw config 或把 gauge 当作 operation success。

本批没有创建 diagnostic event、metric name、trace span schema、audit event schema 或 evidence alias；这些仍由 Step 15 / downstream affected review 定义。

## 10. 持久化、状态机与 no-write 结论

| 审查项 | 结论 |
|---|---|
| 是否是独立 durable truth | 否；是 process/runtime snapshot carrier |
| 是否进入 Step 10 状态机 | 否；旧 Step 10 已明确 availability kind 是 replacement snapshot，不是 lifecycle state |
| 是否需要 repository / UoW | 否；probe / assembly 是 read/classification boundary |
| 是否能推进 domain truth | 不能 |
| 是否能授权 external effect | 不能；exact scope 只缩小 probe 范围，token / flow guard 仍必须存在 |
| 是否能作为 accepted / published / delivered / signed evidence | 不能 |
| 是否能在 unavailable 时自动 fallback | 不能 |
| 是否能由 Query 触发 probe 写入 | 不能；Query 只消费已有 snapshot / surface |

## 11. Planned verification cuts

以下均为设计计划，不是已执行结果：

| cut | 覆盖内容 | 状态 |
|---|---|---|
| scope-family-totality | 13 个 `AdapterFamily` 与 `Some/None` 组合；只有 3 个 exact-capable family 接受 `Some` | planned/not_run |
| scope-identity | exact binding equality、old binding 不被 current binding 替换、family aggregate 不授权 target | planned/not_run |
| kind-totality | 四 variant、stable token、unknown / alias / `Other(String)` rejection | planned/not_run |
| state-construction | scope compatibility、必填 `ObservedAt`、immutable replacement、无 diagnostic mint | planned/not_run |
| call-boundary | Available / Degraded / Unavailable / Misconfigured 与 family-specific error mapper 的完整矩阵 | planned/not_run |
| no-write | probe / state factory 对 repository、UoW、outbox、projection、reference、external client 的 zero-call spy | planned/not_run |
| redaction | Debug / telemetry candidate 不出现 locator、credential、provider body、raw config、external run id | planned/not_run |
| timestamp | canonical `ObservedAt` round-trip、probe time source、禁止 DB/provider/entry fallback | planned/not_run |
| fake-parity | controlled fake、durable adapter、real adapter wrapper 共用三对象 factory 与四态语义 | planned/not_run |

不得以这些 planned cuts 声称实现测试、runtime health、真实 evidence、run ID、验收签署或 commit 已存在。

## 12. Step 07 / Step 14 承接清单

### 12.1 Step 07

Step 07 只能引用本文件的三个 canonical type，并定义 `AdapterAvailabilityProbe` trait 的 exact callable surface。它必须验证：

1. probe 接受 typed `AdapterAvailabilityScope`，不接受 raw family token、locator 或 config body。
2. 返回的 `AdapterAvailabilityState` 必须由本文件的 factory 形成；infra 不得返回 shadow state。
3. probe error 与 formal four-state classification 分开；不能将 unknown provider error静默变成业务 success。
4. exact external-effect probe 使用 historical `ExternalEffectBindingRef`；不能 fallback 到 current/default route。
5. probe 不持久化 diagnostic、outbox、projection 或 domain truth。

本批不复制 Step 07 trait 签名、不修改 Step 07 文件。Step 07 的 affected review 还必须检查 resolver / store / publisher / delivery 各 family 的 error mapping 是否与 §8.2一致。

### 12.2 Step 14 / `04`

Step 14 负责 raw config parsing、source precedence、binding catalog、probe implementation 和 startup exposure。它可以把 validated config defect 映射为 `Misconfigured` 或 `RuntimeAssemblyError::InvalidConfiguration`，但不能：

- 重新定义三类 application object；
- 把 `AdapterBindingRef` 转成 application 可解析 locator；
- 用 health 2xx 宣布 operation success；
- 在 optional adapter disabled 时伪造 no-op success；
- 让 config reload 改写已有 exact binding identity。

## 13. R06.7-B stop review

| 检查项 | 结果 |
|---|---|
| 三个对象均有独立对象卡 | pass_design_only |
| owner / construction owner / consumer 分离 | pass_design_only |
| scope 的 family/exact binding 关系闭合 | pass_design_only；exact 仅限三个 external-effect family |
| `Available` / `Degraded` / `Unavailable` / `Misconfigured` 语义不重叠 | pass_design_only |
| `Degraded` 不被通用布尔方法当作 unrestricted availability | pass_design_only |
| `ObservedAt` 字段来源闭合 | pass_design_only；application clock，禁止 provider/DB/entry fallback |
| 旧 `diagnostic_ref` 越权问题已处理 | pass_design_only；从 state 移除 |
| no-write / no-truth / no-evidence 边界闭合 | pass_design_only |
| Step 07 trait 未在本批重复定义 | pass_design_only |
| raw config / locator / credential 未进入 application | pass_design_only |
| 实现、runtime、集成测试是否执行 | no；`planned/not_run` |
| commit、run ID、evidence alias、signoff 是否创建 | no |

## 14. 已消费交接

R06.7-B 已被用户确认的 `R06.7-C` 消费，随后作为canonical availability输入被R06.7-D/E读取。C 在不复制三对象定义的前提下闭合 infra runtime builder 与 technical carriers；其 canonical source 是 `03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md` §§1~28。D/E均未改动本文件三对象schema。

本文件原交接点 `R06.7-B_done_waiting_user_before_R06.7-C` 与C/D交接点均为已消费的historical checkpoint，不承担current gate。当前恢复点只由Step 06主控§6.29、flow与project ledger定义为`R06.7-E_done_waiting_user_before_R06.8`。

未经用户明确确认，不得进入 R06.8、Step 07~19、formal `03`、`04` 或实现代码。
