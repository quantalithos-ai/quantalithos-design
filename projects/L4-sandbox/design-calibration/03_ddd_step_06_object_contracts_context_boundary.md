# Step 6 回归 6R-02: Context / Identity / Boundary 对象契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 创建日期: 2026-07-18
> 状态: `review_confirmed_consumed_by_6r_03_and_6r_04`
> 所属流程: `03_ddd_calibration_flow.md`
> 上游控制: `03_ddd_step_06_object_contracts_regression_control.md`
> shared truth: `03_ddd_step_06_object_contracts_shared_types.md`
> 当前边界: 本分件只闭合 intake context、execution environment identity、三类 resolution owner、coherent boundary、backend capability、isolation handle、lease window、相关 guard 与只读 view；不进入 policy、run、capture、failure、cleanup、repository、port、DTO、flow 或状态矩阵。

---

## 1. 批次状态与开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否确认进入 `6R-02` | 是。`6R-01` 审查点后用户已连续确认，并明确要求分批写入。 |
| `6R-01` 是否完成 | 是。52 个 named ref、8 个 semantic kind、55 个 selector、原38个 status owner、`ContractError` 与 public error kind 已闭合，设计差集为 0；`6R-03` batch 5后续新增第39个`HandoffTargetProgressStatus`并回填shared唯一owner，不改变本分件对象契约。 |
| 当前是否允许修改正式 `03-详细设计.md` | 否。正式文档只能在回归 Step 19 重新装配。 |
| 当前是否允许进入 `6R-03` | 是。用户已确认本分件与`6R-03`；当前`6R-04`继续消费 established links、active handle / lease linkage 与 read-source boundary。 |
| 是否实现代码或创建实现仓 | 否。本文件中的 Rust 仅表达 exact design contract。 |
| 是否发现新的 L1 / L2 blocker | 否。当前缺口属于 L4-sandbox Step 6 内部可落码性缺口。 |
| implementation 状态 | `CB-SBX-01A blocked / wait_design`，保持冻结。 |

### 1.1 分批写入计划

| 批次 | 内容 | 状态 | 完成门禁 |
|---:|---|---|---|
| 1 | 输入、效力、诊断、owner、capability-to-object map | completed | 范围、历史失效项和对象 inventory 无歧义 |
| 2 | responsibility、reference / context resolution、context、identity | completed | private fields、字段来源、factory、member、error、不变量闭合 |
| 3 | intake / external-body guards 与 negative cuts | completed | exact input / output / error；guard 不查询外部正文 |
| 4 | 十维 boundary requirement value object | completed | `BoundaryLimitKind` 10/10 有唯一 requirement 承接 |
| 5 | decision、coherent boundary、capability、handle、lease window | completed | 同代约束、fail-closed、handle / lease linkage 闭合 |
| 6 | boundary guards、read views、mapping 与历史失效账 | completed | view no-write；status / error mapping 唯一 |
| 7 | closure audit 与 control / flow / ledger 同步 | completed | inventory 差集 0，停在 `completed_wait_user_review` |

## 2. 本分件输入与效力

| 输入 | 本分件使用方式 | 效力 |
|---|---|---|
| `03_ddd_step_06_object_contracts_shared_types.md` | 复用 named ref、shared carrier、kind、status、`ContractError`；本分件不得复制或改名。 | canonical current |
| `03_ddd_step_05_module_contracts.md` | 固定 `contracts` / `domain` owner、依赖方向和禁止 adapter / repository 下沉。 | current upstream |
| `02_hld_step_06_key_objects_intake_boundary.md` | 提供对象责任、候选字段与禁止事项；字段只能经本分件校准后成为 exact contract。 | upstream skeleton |
| `02_hld_step_07_api_interface_skeleton.md` | 反查 `OpenControlledExecutionContext`、`EstablishExecutionBoundary` 与 query 的对象消费面。 | downstream consumer input |
| `02_hld_step_08_processing_flows.md` | 反查 intake / boundary 路径需要的 factory、guard 和 transition helper。 | downstream consumer input |
| `02_hld_step_09_state_machine.md`;`03_ddd_step_10_state_matrix.md` | 反查状态主语和触发缺口；旧 generic error 与不存在的方法不继承。 | historical consumer / conflict input |
| 正式 `00~02` | 保持 sandbox isolation truth、body-free、fail-closed、no weak fallback 与职责裁剪。 | current reviewed baseline |
| L1-governance / L1-artifact Step 6 | 参考单对象 private field、fallible factory、exact method、error 和 invariant 粒度。 | style / granularity reference |
| 原 `03_ddd_step_06_object_contracts.md` | 只识别旧对象名、消费者与冲突，不作为 canonical schema。 | historical_material |

效力规则：

1. 本文件是 `S6T-02-*` registry 的唯一对象正文；原 Step 6 §11、§24、§25 中同名 schema 全部降级为 `historical_material`。
2. `6R-01` 已定义的 ref、kind、status、shared carrier 和 error 不在本文件重复定义；代码块只引用 exact type。
3. 本文件可以定义对象自有 `DomainError` variant，但不得定义 repository、port、adapter、handler、DTO、transaction、处理流或状态矩阵。
4. `LeaseRecord` 的 canonical 正文属于 `6R-04`。本文件只定义 `LeaseWindow`，并固定 handle 创建时必须预生成且保存唯一 `LeaseRecordRef`；record 的字段、状态和 transition 不在本批展开。只有尚未建立 handle 的 read source 才允许 lease ref 缺失。
5. 后序 policy 只能消费 accepted context、active identity、established boundary 与显式 snapshot；boundary factory 不得读取 policy decision。

## 3. SOP 问题回答

| SOP 问题 | `6R-02` 回答 |
|---|---|
| 本批有哪些 capability | body-free intake、责任归属、三类 resolution 隔离、context acceptance、identity binding、十维 boundary requirement、capability matching、boundary establishment、handle lifecycle、lease window、guard 与只读 view。 |
| capability 由哪些对象承接 | 见 §8。每项 capability 均有唯一 truth / value / guard / view owner。 |
| 每个对象是否有 private fields 和字段来源 | 必须有；公开 view 同样使用 private fields 与 checked factory，禁止 aggregate literal 绕过校验。 |
| factory 是否 fallible | 具有非空、kind、关系、状态或时间不变量的 factory 全部返回 `Result`；只有组合两个已校验 typed value 的 `RequiredHandoffStatusItem::new` 与显式 `NotRequired` marker 为 infallible。 |
| member method 是否 exact | 必须给出完整参数和返回类型；状态迁移方法必须指明允许的 from / to。 |
| guard 是否拥有外部查询 | 否。guard 只消费已解析 value / snapshot，不调用 resolver、repository、clock 或 backend。 |
| view 是否拥有 truth | 否。view 只能从 committed object snapshot 显式投影，不触发 mutation。 |
| 哪些内容留给后续 Step | Step 7 trait / repository；Step 8 protocol DTO；Step 9 flow；Step 10 state matrix；Step 11 persistence；Step 12 error handling；Step 13 configuration。 |

## 4. 当前材料问题诊断

| 诊断 ID | 旧材料问题 | 本分件修正 |
|---|---|---|
| `SBX-DDD-6R02-001` | `ControlledExecutionContext` 同时承担 source resolution、responsibility resolution 和 acceptance，三类 owner 可互相覆盖。 | 分离 `ContextReferenceResolution`、`ExecutionContextResolution`、`ExecutionResponsibilityContext`；context 只持有各结果 ref / snapshot。 |
| `SBX-DDD-6R02-002` | `ExecutionResponsibilityContext` / `Anchor` 只有 public field 草图，没有 system actor、work source、trace 和 authorization negative cut。 | 给出 private fields、checked factory、actor requirement 与“只归责、不授权”不变量。 |
| `SBX-DDD-6R02-003` | 旧 `SandboxOpaqueRef` 被用于 profile、template、generation 和 mount marker，ref role 不可判断。 | 全部改用 typed `ExternalSourceRef` / `SafeSummaryRef`，并用 source kind 与 generation equality 校验。 |
| `SBX-DDD-6R02-004` | 旧 `ResourceLimitSet` 只列 CPU / memory / wall-clock / IO 的泛化 value ref，数值单位和 kind/value 对齐不确定。 | 定义 closed `ResourceLimitValue`、四个 named factory、单位和正值约束。 |
| `SBX-DDD-6R02-005` | `BoundaryLimitKind` 已有十个 variant，旧 requirement 只显式承接七个；mount 与 lifecycle 被静默并入 workspace / lease。 | mount 与 lifecycle 各自成为独立 requirement；十维 completeness 机械审计必须为 10/10。 |
| `SBX-DDD-6R02-006` | `CoherentBoundary` 保存重复的 resource / filesystem / network / process summary，可能与 requirement truth 漂移。 | boundary 只持有 immutable requirement ref、decision ref、capability ref、handle ref 与 status；详细限制由 requirement truth 唯一拥有。 |
| `SBX-DDD-6R02-007` | capability freshness、profile generation、template generation 与 handle generation 没有 exact equality 规则。 | 定义 `BoundaryGenerationBinding`，所有建立成功路径必须逐字段相等。 |
| `SBX-DDD-6R02-008` | 旧状态矩阵引用泛化 `DomainError::InvalidStateTransition` 和不存在的 helper。 | 每对象定义自有 error variant，逐 transition 绑定 exact method。 |
| `SBX-DDD-6R02-009` | 旧 handle 把 raw backend handle / profile ref 暴露风险留给 adapter 自行判断。 | domain 只接受 adapter 已转换的 `ExternalSourceRef` 与 `SafeSummaryRef`；raw SDK response 永不入 domain。 |
| `SBX-DDD-6R02-010` | `SandboxExecutionStatusView` / `BoundaryStatusView` 只有字段轮廓，可能成为第二 truth 或由 query 修补状态。 | 只允许 `from_committed_snapshot` 构造；view 无 transition / save / refresh 方法。 |

## 5. 改动前后对比

| 维度 | 回归前 | `6R-02` 目标 |
|---|---|---|
| resolution | 一个泛化状态在 intake、reference refresh 间复用 | 三个 owner、三个 status、无隐式互转 |
| responsibility | actor / work / reason public carrier | checked body-free context + immutable accountability anchor |
| boundary dimensions | 7 个显式、2 个被合并、1 个泛化 | 10 个 `BoundaryLimitKind` 全部唯一承接 |
| boundary truth | requirement 与 boundary 重复保存 summary | requirement 唯一保存限制；boundary 保存建立关系与 lifecycle |
| capability | 支持维度集合 + freshness 草图 | 逐维 support verdict、generation binding、freshness / observed time |
| handle / lease | handle 与 `LeaseRecord` 混写 | handle 本批闭合；`LeaseWindow` 本批闭合；record 留 `6R-04` |
| guard | 名称 + `evaluate(...)` 摘要 | exact input / output / owned error / negative cut |
| error | generic invalid transition | object-owned exact variant；public kind 只作后续 mapper 目标 |

## 6. 设计取舍

| 取舍 | 采用方案 | 未采用方案与原因 |
|---|---|---|
| resolution owner | 首次外部 refs、整体 context resolution、长期 tracked reference 三分 | 复用一个 enum 会让 refresh job 改写首次受理事实。 |
| requirement 表达 | 4 个 resource value + 6 个独立边界 requirement | 泛化 map / string key 无法穷尽 kind，opaque value 无法校验单位。 |
| mount / lifecycle | 独立 `MountBoundaryRequirement`、`BoundaryLifecycleRequirement` | 并入 workspace / lease 会丢失传播、source、release 与 cleanup redline。 |
| boundary aggregate | 关系型 truth，不复制限制明细 | 复制 summary 会产生 requirement 与 established boundary 两份 truth。 |
| capability 比较 | 每个 kind 一个 verdict，集合必须 10/10 | 单一 `supported: bool` 无法说明哪个 hard limit 不成立。 |
| lease 分批 | `LeaseWindow` 在本批；`LeaseRecord` 在 `6R-04` | 提前展开 record 会越过 failure / cleanup / reaper owner。 |
| guard 形态 | immutable rule snapshot + pure evaluate | guard 内查 backend / repository 会把 port 和时序混入 domain。 |

## 7. Owner 与依赖边界

| 代码 owner | 本分件 canonical 类型 | 允许依赖 | 禁止依赖 |
|---|---|---|---|
| `contracts::metadata` | `ExecutionResponsibilityContext` | `core_contracts`;shared refs / metadata | domain object、repository、authorization service |
| `contracts::views` | `SandboxExecutionStatusView`;`BoundaryStatusView` | named refs、status、`Timestamp` | domain mutation、repository、adapter response |
| `domain::context` | context、identity、resolution、responsibility anchor | contracts / core types | resolver implementation、policy、runtime agent loop |
| `domain::boundary::requirements` | generation binding、十维 requirements、lease window | contracts kinds / refs / timestamp | raw config、backend product config、policy decision |
| `domain::boundary` | decision、coherent boundary、capability、handle | requirement value、status、safe refs | SDK handle body、launch orchestration、cleanup repository |
| `domain::guards` | intake、external body、coherence、capability guards | immutable domain values | network / DB / clock / resolver / backend calls |

依赖方向固定为：

```text
core-contracts + contracts shared types
                  |
                  v
responsibility / resolution values
                  |
                  v
accepted context -> active identity -> complete requirements
                                      |              |
                                      v              v
                           fresh capability -> establishment decision
                                      |              |
                                      +-------> coherent boundary
                                                     |
                                                     v
                                        isolation handle + lease window
                                                     |
                                                     v
                                                read-only views
```

policy、run、capture、failure、cleanup 均只能位于图的后序，不允许反向成为 requirement 或 boundary factory 输入。

## 8. Capability-to-object map

| Capability ID | capability | canonical owner | 输入 | 输出 / 可观察结果 | negative cut |
|---|---|---|---|---|---|
| `SBX-CAP-CTX-01` | 组合 body-free responsibility | `ExecutionResponsibilityContext` | actor、work refs、reason、request origin | checked responsibility value | 不保存 actor/work 正文；不授权 |
| `SBX-CAP-CTX-02` | 固化执行责任锚点 | `ExecutionResponsibilityAnchor` | responsibility + trace | immutable anchor | 缺 actor / work anchor 不得建立 |
| `SBX-CAP-CTX-03` | 描述一次外部 ref 解析边界 | `ContextReferenceResolution` | source refs、safe summaries、forbidden markers、status | complete / stale / unavailable / invalid snapshot | 不改长期 reference state |
| `SBX-CAP-CTX-04` | 汇总 context 可受理性 | `ExecutionContextResolution` | reference resolution + responsibility anchor result | resolved / partial / unresolved / conflicted value | 不绑定 identity，不持久化外部正文 |
| `SBX-CAP-CTX-05` | 正式受理或拒绝 context | `ControlledExecutionContext` | source refs、responsibility、resolution / reason | pending、accepted、rejected、unresolved、closed truth | 不补记宿主直跑；不启动 backend |
| `SBX-CAP-CTX-06` | 绑定 execution environment identity | `ExecutionEnvironmentIdentity` | accepted context、anchor、trace | active identity truth | 不等于 member truth；不授权 |
| `SBX-CAP-GRD-01` | 判断最小 intake 前提 | `ControlledExecutionIntakeGuard` | resolution + required markers | `IntakeGuardDecision` | 不查询 resolver；unknown 不放行 |
| `SBX-CAP-GRD-02` | 排除外部正文 | `ExternalBodyExclusionGuard` | forbidden marker set | `ExternalBodyExclusionDecision` | marker 非空不得降级为 warning |
| `SBX-CAP-BND-01` | 表达 CPU / memory / wall-clock / IO hard limit | `ResourceLimitRequirement`;`ResourceLimitSet` | validated profile + explicit request | 4/4 resource requirements | 不保存 backend flag；不接受零值 |
| `SBX-CAP-BND-02` | 表达 filesystem boundary | `FilesystemBoundaryRequirement` | safe summary refs / profile | read-only root、host-write、special-file 规则 | 不保存 raw host path |
| `SBX-CAP-BND-03` | 表达 network boundary | `NetworkBoundaryRequirement` | explicit network intent / profile | default deny 与有限 allow summary | missing 不得默认 allow |
| `SBX-CAP-BND-04` | 表达 process boundary | `ProcessBoundaryRequirement` | process isolation profile | namespace、privilege、subprocess、signal 限制 | local fallback 不得放宽 |
| `SBX-CAP-BND-05` | 表达 workspace boundary | `WorkspaceBoundaryRequirement` | work refs / workspace summary | workspace visibility / write mode | 不拥有 work truth |
| `SBX-CAP-BND-06` | 表达 mount boundary | `MountBoundaryRequirement` | mount plan safe summary | source / target class、mode、propagation hard rule | 不接受 raw path 或 host root mount |
| `SBX-CAP-BND-07` | 表达 lifecycle boundary | `BoundaryLifecycleRequirement` | lease / cleanup profile | lease、renewal、release、reaper 前提 | 不等于 `LeaseRecord` |
| `SBX-CAP-BND-08` | 固定同代输入 | `BoundaryGenerationBinding` | profile / template / runtime / capability generations | equality-checked binding | 不允许跨代拼接 |
| `SBX-CAP-BND-09` | 汇总十维完整 requirement | `BoundaryRequirementSet` | accepted context、active identity、10 dimensions、generation | immutable complete set | 不读取后序 policy |
| `SBX-CAP-BND-10` | 描述 backend capability | `BackendCapabilitySummary`;`BoundaryCapabilityVerdictSet` | adapter body-free summary | 10/10 capability verdict + freshness | 不保存 SDK response |
| `SBX-CAP-BND-11` | 裁定 boundary establishment | `BoundaryEstablishmentDecision` | requirement、capability、guard decision、handle outcome | established / rejected / pending / unsupported / failed | unknown / stale 不得 success |
| `SBX-CAP-BND-12` | 拥有 coherent boundary truth | `CoherentBoundary` | requirement、decision、capability、handle | required -> established / terminal lifecycle | 不允许部分成功或 weak fallback |
| `SBX-CAP-BND-13` | 表达隔离环境 handle 生命周期 | `IsolationEnvironmentHandle` | typed backend handle ref、generation、lease linkage | created / active / release-pending / released / orphan-suspected | 不复活 released handle |
| `SBX-CAP-BND-14` | 表达 lease 时间窗口 | `LeaseWindow` | issued / expires / renewal deadline | checked immutable time window | 不拥有 reaper / cleanup transition |
| `SBX-CAP-GRD-03` | 校验 requirement 整体一致 | `BoundaryCoherenceGuard` | requirement set | `BoundaryCoherenceDecision` | 任一维缺失即拒绝 |
| `SBX-CAP-GRD-04` | 校验 capability 覆盖 | `BackendCapabilityGuard` | requirement + fresh capability | `BackendCapabilityDecision` | unsupported / unknown / stale fail-closed |
| `SBX-CAP-VIEW-01` | 暴露 execution status | `SandboxExecutionStatusView` | committed context / identity / linked refs | caller-safe read model | no-write；不推断后序 truth |
| `SBX-CAP-VIEW-02` | 暴露 boundary status | `BoundaryStatusView` | committed boundary / decision / capability / handle | caller-safe boundary read model | 不触发 refresh / release |

## 9. Canonical inventory 与正文顺序

| 顺序 | canonical type / family | category | ref / identity | 正文状态 |
|---:|---|---|---|---|
| 1 | `ExecutionResponsibilityContext` | contracts value | 无独立 repository ref | completed §10.1 |
| 2 | `ExecutionResponsibilityAnchor` | domain value | 随 identity 持久化 | completed §10.2 |
| 3 | `ContextReferenceResolution` | domain value object | `ContextReferenceResolutionRef` | completed §11.1 |
| 4 | `ExecutionContextResolution` | domain value object | `ExecutionContextResolutionRef` | completed §11.2 |
| 5 | `ControlledExecutionContext` | domain truth entity | `ControlledExecutionContextRef` | completed §12.1 |
| 6 | `ExecutionEnvironmentIdentity` | domain truth entity | `ExecutionEnvironmentIdentityRef` | completed §12.2 |
| 7 | intake guard input / decision support | domain value | 无 repository identity | completed §10.3 / §13.1 / §13.3 |
| 8 | `ControlledExecutionIntakeGuard` | domain guard | `ControlledExecutionIntakeGuardRef` | completed §13.4 |
| 9 | `ExternalBodyExclusionGuard` | domain guard | `ExternalBodyExclusionGuardRef` | completed §13.2 |
| 10 | resource / filesystem / network / process requirements | domain value | requirement set 内嵌 | completed §14.2~§14.6 |
| 11 | workspace / mount / lifecycle requirements | domain value | requirement set 内嵌 | completed §14.7~§14.9 |
| 12 | `BoundaryGenerationBinding` | domain value | requirement set 内嵌 | completed §14.10 |
| 13 | `BoundaryRequirementSet` | domain value object | `BoundaryRequirementSetRef` | completed §14.11 |
| 14 | capability verdict support | domain value | capability summary 内嵌 | completed §15.1 |
| 15 | `BackendCapabilitySummary` | domain snapshot | `BackendCapabilitySummaryRef` | completed §15.3 |
| 16 | `BoundaryEstablishmentDecision` | domain decision | `BoundaryEstablishmentDecisionRef` | completed §17.1 |
| 17 | `LeaseWindow` | domain value | handle / lease record 内嵌 | completed §16.2 |
| 18 | `IsolationEnvironmentHandle` | domain lifecycle entity | `IsolationEnvironmentHandleRef` | completed §16.3~§16.5 |
| 19 | `CoherentBoundary` | domain truth entity | `CoherentBoundaryRef` | completed §18 |
| 20 | boundary guard decision support | domain value | 无 repository identity | completed §19.1 / §19.3 |
| 21 | `BoundaryCoherenceGuard` | domain guard | `BoundaryCoherenceGuardRef` | completed §19.2 |
| 22 | `BackendCapabilityGuard` | domain guard | `BackendCapabilityGuardRef` | completed §19.4 |
| 23 | `SandboxExecutionStatusView` | contracts read view | `SandboxExecutionStatusViewRef` | completed §20.1~§21.2 |
| 24 | `BoundaryStatusView` | contracts read view | `BoundaryStatusViewRef` | completed §20.3~§21.3 |

本表 24 项均须在本文件出现唯一 canonical section。support family 可以包含多个 closed enum / set，但不得新增可独立持久化、可独立迁移而未登记的匿名 truth owner。

## 10. Responsibility 与 resolution support contract

### 10.1 `ExecutionResponsibilityContext`

`ExecutionResponsibilityContext` 位于 `contracts::metadata`，只组合 core actor / origin 与 body-free work refs。它能随 Command input 进入 application / domain，但不能自行证明 authorization。

```rust
use core_contracts::actor::{ActorRef, RequestOrigin};

/// 组合一次受控执行请求的最小归责语境，不拥有 actor、work 或 authorization truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExecutionResponsibilityContext {
    /// 可信 entry 提供的实际发起 actor。
    actor_ref: ActorRef,
    /// 仅包含 Work source kind 的 body-free work refs。
    work_refs: ExternalSourceRefSet,
    /// core 定义的可信 request origin。
    request_origin: RequestOrigin,
    /// 可选 caller-safe 归责原因，不构成授权依据。
    reason: Option<SandboxReason>,
}

impl ExecutionResponsibilityContext {
    /// 从可信 entry 已校验的 actor、work refs 与 request origin 构造归责语境。
    pub fn try_new(
        actor_ref: ActorRef,
        work_refs: ExternalSourceRefSet,
        request_origin: RequestOrigin,
        reason: Option<SandboxReason>,
    ) -> Result<Self, ResponsibilityContextError>;

    /// 返回实际发起 actor；包括后台任务在内均不得匿名。
    pub fn actor_ref(&self) -> &ActorRef;

    /// 返回 body-free work / project / implementation context refs。
    pub fn work_refs(&self) -> &ExternalSourceRefSet;

    /// 返回 core 定义的调用来源，只用于归责和审计。
    pub fn request_origin(&self) -> RequestOrigin;

    /// 返回 caller-safe reason，不把 reason 解释为权限或策略。
    pub fn reason(&self) -> Option<&SandboxReason>;
}

/// 构造最小 execution responsibility context 失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ResponsibilityContextError {
    /// actor id 在 Sandbox contract 边界校验为空。
    EmptyActorIdentity,
    /// 未提供任何 `ExternalSourceKind::Work` 来源。
    MissingWorkSource,
    /// work ref set 中混入非 Work 来源。
    NonWorkSource {
        /// work ref 实际携带的 external source kind。
        actual: ExternalSourceKind,
    },
}
```

| private field | exact source | 校验 / 角色 |
|---|---|---|
| `actor_ref` | sync entry 的 `ActorContext.actor` 或 job / operations context 的 core system actor | actor identity trim 后非空；`ActorKind` 仅归责，不授权。 |
| `work_refs` | request 中的 project / work / implementation refs 经 resolver 映射 | 非空；每项 `source_kind == Work`；不保存 work body。 |
| `request_origin` | `ActorContext.request_origin` | 原样保存；domain 不从 route、topic 或 operation name反推。 |
| `reason` | caller-safe request reason | 可选；若出现已由 `SandboxReason::try_new` 校验。 |

不变量与 negative cuts：

- human、AI member、integration 与 system job 都必须有显式 `ActorRef`；不得用 `Option<ActorRef>` 表达匿名正式入口。
- system job 必须由 core `ActorRef::system(...)` 或等价可信入口构造，不得用缺 actor 绕过门禁。
- `work_refs` 只接受 `ExternalSourceKind::Work`；tool、runtime、member-host、runner refs 归 `ControlledExecutionContext.source_refs`，不能冒充责任 work anchor。
- `request_origin` 不构成接口授权，`reason` 不构成 policy exception。

### 10.2 `ExecutionResponsibilityAnchor`

```rust
/// 固化 accepted context 与 execution identity 共用的不可变归责锚点。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExecutionResponsibilityAnchor {
    /// 从归责语境复制的实际发起 actor。
    actor_ref: ActorRef,
    /// 从归责语境复制的 body-free work refs。
    work_refs: ExternalSourceRefSet,
    /// 从归责语境复制的可信调用来源。
    request_origin: RequestOrigin,
    /// 与本次 context opening 相同的 trace identity。
    trace_context: SandboxTraceContext,
}

impl ExecutionResponsibilityAnchor {
    /// 从已校验责任语境和当前 request trace 固化 identity anchor。
    pub fn try_from_context(
        responsibility: &ExecutionResponsibilityContext,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, ResponsibilityAnchorError>;

    /// 返回不可变责任 actor，不据此推导 authorization。
    pub fn actor_ref(&self) -> &ActorRef;
    /// 返回不可变 body-free work refs。
    pub fn work_refs(&self) -> &ExternalSourceRefSet;
    /// 返回用于归责的 core request origin。
    pub fn request_origin(&self) -> RequestOrigin;
    /// 返回与 context opening 绑定的 trace identity。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 只比较责任主体、work refs、origin 与 trace identity，不查询外部 owner。
    pub fn matches_context(
        &self,
        responsibility: &ExecutionResponsibilityContext,
        trace_context: &SandboxTraceContext,
    ) -> bool;
}

/// 固化 responsibility anchor 失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ResponsibilityAnchorError {
    /// responsibility context 在进入 domain 前未满足最小条件。
    InvalidResponsibilityContext,
    /// trace identity 与本次 request / child invocation 不可验证。
    InvalidTraceContext,
}
```

| private field | exact source | 不变量 |
|---|---|---|
| `actor_ref`;`work_refs`;`request_origin` | 逐字段 clone 自 `ExecutionResponsibilityContext` | anchor 不接受另一份 independently supplied actor / work refs，避免责任拼接。 |
| `trace_context` | 当前 `SandboxServiceCallContext` 后续传入的已校验 trace | 与 context opening 同一 request / child trace；不保存 span body 或 baggage。 |

anchor 没有 mutation method。actor / work / trace 后续变化只能使 identity invalidated 或新建 context / identity，不能原地替换 anchor。

### 10.3 Resolution support sets

以下 support type 属于 `domain::context`，只承接一次 resolver outcome；它们不是公共 DTO，也不是长期 refresh state。

```rust
/// intake 所需 body-free source kind 的有序唯一集合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RequiredContextSourceKindSet(
    /// 按输入顺序保存且不重复的 required source kinds。
    Vec<ExternalSourceKind>,
);

impl RequiredContextSourceKindSet {
    /// 构造非空、有序唯一集合；重复 kind 必须拒绝。
    pub fn try_new(
        kinds: Vec<ExternalSourceKind>,
    ) -> Result<Self, ContextResolutionError>;

    /// 返回不可变 required kind 切片。
    pub fn as_slice(&self) -> &[ExternalSourceKind];
    /// 判断指定 source kind 是否属于 required set。
    pub fn contains(&self, kind: ExternalSourceKind) -> bool;
}

/// 一次 resolution 中缺失或不可用的必需 source kind 集合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UnresolvedContextItemSet(
    /// 按输入顺序保存且不重复的 unresolved required kinds。
    Vec<ExternalSourceKind>,
);

impl UnresolvedContextItemSet {
    /// 构造 ordered-unique unresolved set；是否属于 required set 由 resolution factory 对账。
    pub fn try_new(
        kinds: Vec<ExternalSourceKind>,
    ) -> Result<Self, ContextResolutionError>;
    /// 返回不可变 unresolved kind 切片。
    pub fn as_slice(&self) -> &[ExternalSourceKind];
    /// 判断当前是否没有 unresolved kind。
    pub fn is_empty(&self) -> bool;
}

/// 一次 resolution 中允许保持 pending 的非必需 source kind 集合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DeferredContextItemSet(
    /// 按输入顺序保存且不重复的 deferred optional kinds。
    Vec<ExternalSourceKind>,
);

impl DeferredContextItemSet {
    /// 构造 ordered-unique deferred set；是否误含 required kind 由 resolution factory 对账。
    pub fn try_new(
        kinds: Vec<ExternalSourceKind>,
    ) -> Result<Self, ContextResolutionError>;
    /// 返回不可变 deferred kind 切片。
    pub fn as_slice(&self) -> &[ExternalSourceKind];
    /// 判断当前是否没有 deferred kind。
    pub fn is_empty(&self) -> bool;
}

/// 两个 body-free 来源或摘要对同一语境给出互斥结论的安全冲突标记。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContextResolutionConflict {
    /// 冲突左端的 body-free source。
    left_source: ExternalSourceRef,
    /// 冲突右端的 body-free source，必须与左端不同源。
    right_source: ExternalSourceRef,
    /// 不含外部正文的冲突原因。
    reason: SandboxReason,
}

impl ContextResolutionConflict {
    /// 构造双源冲突；同一 source 的版本差异不得冒充双源冲突。
    pub fn try_new(
        left_source: ExternalSourceRef,
        right_source: ExternalSourceRef,
        reason: SandboxReason,
    ) -> Result<Self, ContextResolutionError>;
    /// 返回冲突左端 source。
    pub fn left_source(&self) -> &ExternalSourceRef;
    /// 返回冲突右端 source。
    pub fn right_source(&self) -> &ExternalSourceRef;
    /// 返回 caller-safe 冲突原因。
    pub fn reason(&self) -> &SandboxReason;
}

/// 保存插入顺序并拒绝重复 source pair 的冲突集合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContextResolutionConflictSet(
    /// 按输入顺序保存且拒绝重复无向 source pair 的冲突项。
    Vec<ContextResolutionConflict>,
);

impl ContextResolutionConflictSet {
    /// 构造 ordered-unique conflict set。
    pub fn try_new(
        conflicts: Vec<ContextResolutionConflict>,
    ) -> Result<Self, ContextResolutionError>;
    /// 返回不可变 conflict 切片。
    pub fn as_slice(&self) -> &[ContextResolutionConflict];
    /// 判断当前是否没有冲突项。
    pub fn is_empty(&self) -> bool;
}
```

| support invariant | exact rule |
|---|---|
| required set | 至少含 `Identity`、`Work` 与一个 caller source (`Tool | Runtime | MemberHost | Runner`)；实际 required set 由 intake guard snapshot 明示，不由 resolution factory隐式加默认值。 |
| unresolved set | 只能含 required set 中的 kind；重复 kind 拒绝，不以最后一个覆盖。 |
| deferred set | 只能含 required set 之外、当前 request 实际声明的 source kind；非空时整体状态只能是 `Partial`，且不能支持 identity binding。 |
| conflict pair | 两端不得 `same_source()`；同一 source 的 source-version 变化属于 stale / invalid，不伪造为双源冲突。 |
| conflict reason | 只允许安全摘要，不包含 resolver raw response 或外部 body。 |

### 10.4 `ContextResolutionError`

```rust
/// 一次 intake resolution value 的字段组合或状态不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ContextResolutionError {
    /// required source kind set 为空，无法形成正式 intake rule。
    EmptyRequiredSourceKinds,
    /// required set 重复包含载荷中的 source kind。
    DuplicateRequiredSourceKind {
        /// required set 中重复出现的 external source kind。
        kind: ExternalSourceKind,
    },
    /// unresolved set 重复包含载荷中的 source kind。
    DuplicateUnresolvedSourceKind {
        /// unresolved set 中重复出现的 external source kind。
        kind: ExternalSourceKind,
    },
    /// deferred set 重复包含载荷中的 source kind。
    DuplicateDeferredSourceKind {
        /// deferred set 中重复出现的 external source kind。
        kind: ExternalSourceKind,
    },
    /// unresolved set 中的载荷 kind 并非 required kind。
    UnresolvedKindWasNotRequired {
        /// 被错误放入 unresolved set 的 non-required source kind。
        kind: ExternalSourceKind,
    },
    /// deferred set 中的载荷 kind 实际属于 required set。
    DeferredKindWasRequired {
        /// 被错误放入 deferred set 的 required source kind。
        kind: ExternalSourceKind,
    },
    /// 冲突两端指向同一 source，不能构成双源冲突。
    ConflictingSourceMustDiffer,
    /// conflict set 重复包含同一个无向 source pair。
    DuplicateConflictPair,
    /// resolution 与 owning context 不一致；载荷给出 expected / actual ref。
    ContextRefMismatch {
        /// owning object 要求的 controlled execution context ref。
        expected: ControlledExecutionContextRef,
        /// resolution 实际绑定的 controlled execution context ref。
        actual: ControlledExecutionContextRef,
    },
    /// execution resolution 引用的 reference snapshot 与实际输入不一致。
    ReferenceResolutionRefMismatch {
        /// execution resolution 记录的 reference resolution ref。
        expected: ContextReferenceResolutionRef,
        /// caller 实际提供的 reference resolution ref。
        actual: ContextReferenceResolutionRef,
    },
    /// 整体 resolution status 与 unresolved / deferred / conflict 字段组合不一致。
    StatusFieldMismatch {
        /// 与 resolution support fields 组合冲突的 canonical status。
        status: ExecutionContextResolutionStatus,
    },
    /// reference resolution status 与 sources / summaries / reason / marker 组合不一致。
    ReferenceStatusFieldMismatch {
        /// 与 reference snapshot fields 组合冲突的 canonical status。
        status: ContextReferenceResolutionStatus,
    },
    /// 尝试把非空 forbidden-body markers 构造为可受理 snapshot。
    ForbiddenExternalBodyPresent,
}
```

这些 variant 只描述字段与状态关系，不包含 raw ref string、external payload、resolver cause 或泛化 message。public mapper 候选为 `Validation`、`ReferenceUnresolved` 或 `ForbiddenExternalBody`，exact mapping 在 Step 12 回归闭合。

## 11. Resolution object contract

### 11.1 `ContextReferenceResolution`

```rust
/// 记录一次 intake 外部引用解析到 body-free 程度的不可变快照。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContextReferenceResolution {
    /// 本地 immutable reference resolution identity。
    reference_resolution_ref: ContextReferenceResolutionRef,
    /// 本次 snapshot 唯一归属的 pending context。
    context_ref: ControlledExecutionContextRef,
    /// resolver 返回的 body-free source refs。
    source_refs: ExternalSourceRefSet,
    /// 与 source kinds 对齐的 body-free safe summaries。
    safe_summaries: SafeSummaryRefSet,
    /// entry / resolver 识别出的 forbidden-body markers。
    forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
    /// 本次 reference snapshot 的 canonical status。
    resolution_status: ContextReferenceResolutionStatus,
    /// 非 Complete 状态的 caller-safe 原因。
    resolution_reason: Option<SandboxReason>,
    /// application clock 提供的 snapshot 观察时间。
    observed_at: Timestamp,
}

impl ContextReferenceResolution {
    /// 构造完整且不含外部正文的 intake reference snapshot。
    pub fn complete(
        reference_resolution_ref: ContextReferenceResolutionRef,
        context_ref: ControlledExecutionContextRef,
        source_refs: ExternalSourceRefSet,
        safe_summaries: SafeSummaryRefSet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        observed_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 构造 source version 或 safe summary 已过期的 snapshot。
    pub fn stale(
        reference_resolution_ref: ContextReferenceResolutionRef,
        context_ref: ControlledExecutionContextRef,
        source_refs: ExternalSourceRefSet,
        safe_summaries: SafeSummaryRefSet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 构造 resolver / source 暂不可用的 snapshot。
    pub fn unavailable(
        reference_resolution_ref: ContextReferenceResolutionRef,
        context_ref: ControlledExecutionContextRef,
        source_refs: ExternalSourceRefSet,
        safe_summaries: SafeSummaryRefSet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 构造引用归属、格式、边界或正文排除校验失败的 snapshot。
    pub fn invalid(
        reference_resolution_ref: ContextReferenceResolutionRef,
        context_ref: ControlledExecutionContextRef,
        source_refs: ExternalSourceRefSet,
        safe_summaries: SafeSummaryRefSet,
        forbidden_body_markers: ForbiddenExternalBodyMarkerSet,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 返回本地 reference resolution identity。
    pub fn reference_resolution_ref(&self) -> &ContextReferenceResolutionRef;
    /// 返回 owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 resolver 提供的 body-free source refs。
    pub fn source_refs(&self) -> &ExternalSourceRefSet;
    /// 返回 safe summary refs。
    pub fn safe_summaries(&self) -> &SafeSummaryRefSet;
    /// 返回 forbidden-body marker set。
    pub fn forbidden_body_markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回 canonical reference resolution status。
    pub fn resolution_status(&self) -> ContextReferenceResolutionStatus;
    /// 返回非 Complete 状态的 caller-safe reason。
    pub fn resolution_reason(&self) -> Option<&SandboxReason>;
    /// 返回 snapshot observed time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 只有 `Complete` 且 marker 为空时才可进入整体 context resolution。
    pub fn supports_intake(&self) -> bool;

    /// 判断 source 与 safe summary 是否都覆盖指定 kind。
    pub fn covers_kind(&self, kind: ExternalSourceKind) -> bool;
}
```

| private field | exact source | invariant |
|---|---|---|
| `reference_resolution_ref` | application id generator | named local ref；不得从 source ref 拼接。 |
| `context_ref` | pending context | 固定一次 intake owner；snapshot 不可改挂其他 context。 |
| `source_refs` | `ContextReferenceResolverPort` 后续返回的 body-free refs | `Complete | Stale` 必须非空；`Unavailable | Invalid` 可为空或保存已校验部分；identity 只看 kind / ref，不解析字符串。 |
| `safe_summaries` | resolver 已标记 safe 的 summary refs | 每个 summary kind 必须在 `source_refs` 有同 kind 来源；不要求两者 opaque ref 相同。 |
| `forbidden_body_markers` | entry schema scanner / resolver boundary | 非空时 `Complete` factory 必须返回 `ForbiddenExternalBodyPresent`。 |
| `resolution_status` | 四个 named factory 唯一写入 | 不提供 public arbitrary-status constructor。 |
| `resolution_reason` | stale / unavailable / invalid safe mapper | `Complete => None`；其余状态必须 `Some`。 |
| `observed_at` | application clock | 表示 snapshot 观察时间，不充当 source version 或 refresh cursor。 |

factory 校验矩阵：

| factory | status | source / summary | marker | reason | 可支持 intake |
|---|---|---|---|---|---|
| `complete` | `Complete` | source 非空；summary kind 必须有 source kind | 必须空 | `None` | 是 |
| `stale` | `Stale` | 可保留最后 body-free refs / summaries | 必须空 | 必须有 | 否 |
| `unavailable` | `Unavailable` | 可为空或保留最后成功 snapshot | 必须空 | 必须有 | 否 |
| `invalid` | `Invalid` | 仅保存已通过 carrier 校验的部分 | 可空或非空 | 必须有 | 否 |

`ContextReferenceResolution` 没有 mutation method。consumer / refresh 得到新 resolver outcome 时创建新 snapshot；旧 snapshot 保持审计可读。它不替代 `ReferenceResolutionState`，也不允许 query 把 `Stale | Unavailable | Invalid` 改为 `Complete`。

### 11.2 `ExecutionContextResolution`

```rust
/// 汇总一次 pending context 是否具备正式 acceptance 前提的不可变判断结果。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExecutionContextResolution {
    /// 本地 immutable execution resolution identity。
    resolution_ref: ExecutionContextResolutionRef,
    /// 本次 resolution 唯一归属的 context。
    context_ref: ControlledExecutionContextRef,
    /// 本次判断消费的 exact reference snapshot ref。
    reference_resolution_ref: ContextReferenceResolutionRef,
    /// intake guard 明示的 required source kinds。
    required_source_kinds: RequiredContextSourceKindSet,
    /// 当前不可用的 required kinds。
    unresolved_items: UnresolvedContextItemSet,
    /// 当前尚待补齐的 optional kinds。
    deferred_items: DeferredContextItemSet,
    /// 当前已识别的双源冲突集合。
    conflicts: ContextResolutionConflictSet,
    /// 整体 context resolution status。
    resolution_status: ExecutionContextResolutionStatus,
    /// 非 Resolved 状态的 caller-safe reason。
    resolution_reason: Option<SandboxReason>,
    /// application clock 提供的判断时间。
    evaluated_at: Timestamp,
}

impl ExecutionContextResolution {
    /// 构造可支持 context acceptance 与 identity candidate 的完整 resolution。
    pub fn resolved(
        resolution_ref: ExecutionContextResolutionRef,
        context_ref: ControlledExecutionContextRef,
        reference_resolution: &ContextReferenceResolution,
        required_source_kinds: RequiredContextSourceKindSet,
        evaluated_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 构造非必需来源仍待补齐的 pending resolution；不得绑定 identity。
    pub fn partial(
        resolution_ref: ExecutionContextResolutionRef,
        context_ref: ControlledExecutionContextRef,
        reference_resolution: &ContextReferenceResolution,
        required_source_kinds: RequiredContextSourceKindSet,
        deferred_items: DeferredContextItemSet,
        reason: SandboxReason,
        evaluated_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 构造必需来源缺失、过期或暂不可用的 resolution。
    pub fn unresolved(
        resolution_ref: ExecutionContextResolutionRef,
        context_ref: ControlledExecutionContextRef,
        reference_resolution: &ContextReferenceResolution,
        required_source_kinds: RequiredContextSourceKindSet,
        unresolved_items: UnresolvedContextItemSet,
        reason: SandboxReason,
        evaluated_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 构造来源或摘要互斥的 resolution。
    pub fn conflicted(
        resolution_ref: ExecutionContextResolutionRef,
        context_ref: ControlledExecutionContextRef,
        reference_resolution: &ContextReferenceResolution,
        required_source_kinds: RequiredContextSourceKindSet,
        conflicts: ContextResolutionConflictSet,
        reason: SandboxReason,
        evaluated_at: Timestamp,
    ) -> Result<Self, ContextResolutionError>;

    /// 返回本地 execution resolution identity。
    pub fn resolution_ref(&self) -> &ExecutionContextResolutionRef;
    /// 返回 owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回本次判断消费的 exact reference snapshot ref。
    pub fn reference_resolution_ref(&self) -> &ContextReferenceResolutionRef;
    /// 返回 required source kinds。
    pub fn required_source_kinds(&self) -> &RequiredContextSourceKindSet;
    /// 返回 unresolved required kinds。
    pub fn unresolved_items(&self) -> &UnresolvedContextItemSet;
    /// 返回 deferred optional kinds。
    pub fn deferred_items(&self) -> &DeferredContextItemSet;
    /// 返回双源冲突集合。
    pub fn conflicts(&self) -> &ContextResolutionConflictSet;
    /// 返回 canonical execution resolution status。
    pub fn resolution_status(&self) -> ExecutionContextResolutionStatus;
    /// 返回非 Resolved 状态的 caller-safe reason。
    pub fn resolution_reason(&self) -> Option<&SandboxReason>;
    /// 返回 resolution evaluated time。
    pub fn evaluated_at(&self) -> &Timestamp;

    /// 校验本 resolution 与传入 reference snapshot 同属一个 context 且可绑定 identity。
    pub fn supports_execution_identity(
        &self,
        reference_resolution: &ContextReferenceResolution,
    ) -> bool;

    /// `Partial | Unresolved | Conflicted` 均阻断 acceptance。
    pub fn blocks_acceptance(&self) -> bool;

    /// 只有 conflicted、invalid 或 forbidden-body 输入要求立即拒绝；unavailable 可保持 pending。
    pub fn requires_rejection(
        &self,
        reference_resolution: &ContextReferenceResolution,
    ) -> bool;
}
```

| factory | exact prerequisites | status-field relation |
|---|---|---|
| `resolved` | reference status `Complete`；marker 空；required kind 逐项 `covers_kind == true` | unresolved / deferred / conflicts 全空；reason `None` |
| `partial` | reference status `Complete`；required kind 全覆盖；deferred 非空且不属于 required set | unresolved / conflicts 空；reason `Some` |
| `unresolved` | unresolved 非空且每项属于 required set；reference `Stale | Unavailable | Invalid` 时也必须显式列出受影响 required kind，不能仅凭 reference status 构造空 unresolved set | deferred / conflicts 空；reason `Some` |
| `conflicted` | conflicts 非空；reference 可为 `Complete`，或为 markers 为空且确有双源冲突的 `Invalid`；不得把 forbidden body 伪装成普通 conflict | unresolved / deferred 空；reason `Some` |

`ExecutionContextResolutionStatus::Partial` 不表示 degraded launch；它只允许 context 保持 `PendingResolution`。`Conflicted` 不可被 intake guard 覆盖为 accepted。`Invalid` 是 `ContextReferenceResolutionStatus`，整体 resolution 必须按受影响 required kinds 映射为 `Unresolved`，或在确有双源冲突且 forbidden markers 为空时映射为 `Conflicted`；intake guard 再按 reference `Invalid` 优先拒绝。两类 status 不互相 cast。

## 12. Context 与 execution environment identity contract

### 12.1 `ControlledExecutionContext`

```rust
/// 拥有一次正式受控执行请求在 Sandbox 内的入口语境与 acceptance truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledExecutionContext {
    /// Sandbox 内的受控执行 context identity。
    context_ref: ControlledExecutionContextRef,
    /// command / entry 声明且 body-free 的 source refs。
    source_refs: ExternalSourceRefSet,
    /// 已校验的责任归属语境。
    responsibility_context: ExecutionResponsibilityContext,
    /// 与本次正式入口绑定的 trace context。
    trace_context: SandboxTraceContext,
    /// context 入口接纳流程的 canonical lifecycle status。
    intake_status: ControlledExecutionIntakeStatus,
    /// 最近一次 immutable execution resolution ref。
    latest_resolution_ref: Option<ExecutionContextResolutionRef>,
    /// acceptance 时预生成并原子绑定的 environment identity ref。
    environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
    /// 非正常 active 状态的 caller-safe status reason。
    status_reason: Option<SandboxReason>,
    /// context 首次打开时间。
    opened_at: Timestamp,
    /// 最近一次状态变化时间。
    status_changed_at: Timestamp,
    /// 最近一次状态变化对应的 audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl ControlledExecutionContext {
    /// 创建等待 resolver 与 intake guard 判断的正式入口语境。
    pub fn open_pending(
        context_ref: ControlledExecutionContextRef,
        source_refs: ExternalSourceRefSet,
        responsibility_context: ExecutionResponsibilityContext,
        trace_context: SandboxTraceContext,
        opened_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, ControlledExecutionContextError>;

    /// 在 resolved snapshot 与 accepted guard decision 成立后记录 acceptance 和预生成 identity ref。
    pub fn accept(
        &mut self,
        resolution: &ExecutionContextResolution,
        reference_resolution: &ContextReferenceResolution,
        decision: &IntakeGuardDecision,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        audit_trace_ref: SandboxAuditTraceRef,
        accepted_at: Timestamp,
    ) -> Result<(), ControlledExecutionContextError>;

    /// 在 required refs 暂不可用时进入可重试的 unresolved 状态。
    pub fn mark_unresolved(
        &mut self,
        resolution: &ExecutionContextResolution,
        decision: &IntakeGuardDecision,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionContextError>;

    /// 记录 optional source 尚待补齐的 partial resolution，并保持 `PendingResolution`。
    pub fn record_partial_resolution(
        &mut self,
        resolution: &ExecutionContextResolution,
        decision: &IntakeGuardDecision,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionContextError>;

    /// 从 unresolved 重新进入 resolution pending；不复用旧 resolution 作为成功依据。
    pub fn resume_resolution(
        &mut self,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), ControlledExecutionContextError>;

    /// 依据 pending context 上的明确 reject decision 终止 intake；Rejected 为终态。
    pub fn reject(
        &mut self,
        resolution: &ExecutionContextResolution,
        decision: &IntakeGuardDecision,
        audit_trace_ref: SandboxAuditTraceRef,
        rejected_at: Timestamp,
    ) -> Result<(), ControlledExecutionContextError>;

    /// 在下游 lifecycle 已形成 checked closure basis 后关闭 accepted context。
    pub fn close(
        &mut self,
        cleanup_guard: &CleanupGuard,
        current_redline_coverage: &RedlineContainmentCoverageSnapshot,
        current_redlines: &[RedlineContainment],
        reason: SandboxReason,
        audit_trace_ref: SandboxAuditTraceRef,
        closed_at: Timestamp,
    ) -> Result<(), ControlledExecutionContextError>;

    /// 返回 context identity。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回正式入口声明的 body-free source refs。
    pub fn source_refs(&self) -> &ExternalSourceRefSet;
    /// 返回已校验 responsibility context。
    pub fn responsibility_context(&self) -> &ExecutionResponsibilityContext;
    /// 返回入口 trace context。
    pub fn trace_context(&self) -> &SandboxTraceContext;
    /// 返回当前 intake lifecycle status。
    pub fn intake_status(&self) -> ControlledExecutionIntakeStatus;
    /// 返回最近一次 execution resolution ref。
    pub fn latest_resolution_ref(&self) -> Option<&ExecutionContextResolutionRef>;
    /// 返回 acceptance 原子绑定的 identity ref。
    pub fn environment_identity_ref(&self) -> Option<&ExecutionEnvironmentIdentityRef>;
    /// 返回当前 caller-safe status reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回 context opened time。
    pub fn opened_at(&self) -> &Timestamp;
    /// 返回最近状态变化时间。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近状态变化的 audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只有 accepted 且已有 identity ref 才满足 boundary 前置条件。
    pub fn can_enter_boundary(&self) -> bool;

    /// 为 boundary factory 返回 exact accepted-context 错误，而非 bool fallback。
    pub fn require_accepted_for_boundary(
        &self,
    ) -> Result<(), ControlledExecutionContextError>;
}
```

| private field | exact source | invariant |
|---|---|---|
| `context_ref` | application id generator | Sandbox named ref；不由 external refs / request id 拼接。 |
| `source_refs` | command input 经 resolver carrier 校验 | 非空；至少包含 `Work` 与 caller source；只保存 body-free refs。 |
| `responsibility_context` | §10.1 checked value | actor 与 work refs 必须成立；不作为 policy source。 |
| `trace_context` | request / consumer / job call context | 与 responsibility anchor 的 trace 必须一致。 |
| `intake_status` | factory / exact transition | 初始 `PendingResolution`；只有表中方法可修改。 |
| `latest_resolution_ref` | 最近一次 `ExecutionContextResolution` | pending 初始为空；accepted / rejected / unresolved 必须有；resume 后保留历史最新 ref 但不能当作本轮 success。 |
| `environment_identity_ref` | `accept` 参数，由 application 预生成 | 仅 `Accepted | Closed` 可为 `Some`；其余状态必须 `None`。 |
| `status_reason` | guard decision / closure basis safe reason | `PendingResolution | Accepted => None`；`Rejected | Unresolved | Closed => Some`。partial self-transition 的 reason 保留在 immutable resolution / decision，不复制到 context。 |
| `opened_at`;`status_changed_at` | application clock | transition 时间不得早于 opened time；具体 timestamp comparison 依赖 core `Timestamp` contract。 |
| `last_audit_trace_ref` | 同一 UoW append-only audit staging | 每个状态变化必须替换；不由对象自行生成。 |

exact transition table：

| method | from | to | hard prerequisites | exact owned error |
|---|---|---|---|---|
| `open_pending` | factory | `PendingResolution` | source 非空；责任 work refs 是 source 子集；trace 匹配 request | `EmptyExecutionSources`;`ResponsibilitySourceMismatch` |
| `accept` | `PendingResolution` | `Accepted` | resolution `Resolved`；reference `Complete` 且同 context；decision `Accepted` 且 refs 匹配；identity ref 非空 | `AcceptanceResolutionNotResolved`;`IntakeDecisionMismatch`;`ResolutionContextMismatch` |
| `mark_unresolved` | `PendingResolution` | `Unresolved` | resolution 必须为 `Unresolved` 且 unresolved required set 非空；decision `PendingResolution`；reason 必须来自 decision | `UnresolvedDecisionMismatch`;`ResolutionContextMismatch` |
| `record_partial_resolution` | `PendingResolution` | `PendingResolution` | resolution 必须为 `Partial`、deferred set 非空且 unresolved set 为空；decision `PendingResolution`；更新 latest resolution / audit / time，但 context reason 保持 `None` | `PartialDecisionMismatch`;`ResolutionContextMismatch` |
| `resume_resolution` | `Unresolved` | `PendingResolution` | 新 audit / time；清除 status reason 和 identity ref | `ContextTransitionNotAllowed` |
| `reject` | `PendingResolution` | `Rejected` | decision `Rejected`；resolution 同 context；reason 必须来自 decision；原为 `Unresolved` 时必须先 `resume_resolution` 并以新 snapshot 重新评估 | `RejectionDecisionMismatch`;`ResolutionContextMismatch` |
| `close` | `Accepted` | `Closed` | `cleanup_guard.permits_context_closure_for(self.context_ref, current_redline_coverage, current_redlines) == Ok(true)`；coverage来自fresh complete lineage index且每条redline均Released；显式`reason`来自同一checked cleanup closure basis | `ClosureContextMismatch`;`CleanupGuardDidNotAllowContextClosure`;`ContextTransitionNotAllowed` |

```rust
/// `ControlledExecutionContext` 自有构造、迁移与关系错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ControlledExecutionContextError {
    /// context opening 未提供任何 body-free execution source。
    EmptyExecutionSources,
    /// source set 不含 Tool / Runtime / MemberHost / Runner caller source。
    MissingCallerSource,
    /// responsibility work refs 不是 context source refs 的同源子集。
    ResponsibilitySourceMismatch,
    /// resolution 或 decision 的 owning context 与载荷 expected / actual 不一致。
    ResolutionContextMismatch {
        /// context transition 要求匹配的 controlled execution context ref。
        expected: ControlledExecutionContextRef,
        /// resolution 或 decision 实际绑定的 context ref。
        actual: ControlledExecutionContextRef,
    },
    /// accept 消费的 execution resolution 不是 Resolved；载荷给出实际 status。
    AcceptanceResolutionNotResolved {
        /// acceptance 实际收到的 execution resolution status。
        actual: ExecutionContextResolutionStatus,
    },
    /// accept 消费的 reference snapshot 不是 Complete；载荷给出实际 status。
    ReferenceResolutionNotComplete {
        /// acceptance 实际收到的 reference resolution status。
        actual: ContextReferenceResolutionStatus,
    },
    /// decision ref / kind / relation 不满足 acceptance 路径。
    IntakeDecisionMismatch,
    /// decision 或 resolution 不满足 required-unresolved 路径。
    UnresolvedDecisionMismatch,
    /// decision 或 resolution 不满足 optional-partial self-transition。
    PartialDecisionMismatch,
    /// decision 或 resolution 不满足 rejection 路径。
    RejectionDecisionMismatch,
    /// context 已经绑定 identity，禁止重复 assignment。
    IdentityRefAlreadyAssigned {
        /// 已持有 environment identity ref 的 controlled execution context。
        context_ref: ControlledExecutionContextRef,
    },
    /// cleanup guard 绑定的 context 与 closure target 不一致。
    ClosureContextMismatch {
        /// closure target 的 controlled execution context ref。
        expected: ControlledExecutionContextRef,
        /// cleanup guard 实际允许闭合的 context ref。
        actual: ControlledExecutionContextRef,
    },
    /// cleanup guard 未明确允许关闭该 context。
    CleanupGuardDidNotAllowContextClosure,
    /// 载荷 context 的 from / to 状态不在 exact transition table 中。
    ContextTransitionNotAllowed {
        /// 拒绝 transition 的 controlled execution context identity。
        context_ref: ControlledExecutionContextRef,
        /// transition 前实际 canonical intake status。
        from: ControlledExecutionIntakeStatus,
        /// caller 请求进入的目标 intake status。
        to: ControlledExecutionIntakeStatus,
    },
    /// 新状态时间早于既有状态时间。
    StatusTimestampMovedBackwards {
        /// status time relation 校验失败的 context identity。
        context_ref: ControlledExecutionContextRef,
    },
}
```

`accept` 不启动 boundary、policy 或 backend，也不写其 ref。它只记录 acceptance 与 application 预生成的 `environment_identity_ref`。`Accepted` context、resolved snapshot、active identity 和 intake audit 必须由 Step 7 的同一 UoW 原子提交；identity bind 失败时整组 rollback，禁止持久化 accepted-without-identity 中间态。`record_partial_resolution` 是唯一允许的 `PendingResolution -> PendingResolution` exact self-transition；`mark_unresolved` 不得再承接 optional deferred item。`Unresolved` 也不得直接 `reject`，因为 intake guard 只接受 pending context；必须先 `resume_resolution`，创建并评估新 snapshot，再沿 `reject` 或 `accept` 收束。`CleanupGuard::permits_context_closure_for` 在 `6R-04` 与 cleanup truth 同节定义；它消费fresh complete redline coverage与exact loaded rows并返回checked result，不得用旧单参数bool、guard ref、空set、absence、配置或job disposition替代。

### 12.2 `ExecutionEnvironmentIdentity`

```rust
/// 将 accepted context、resolved responsibility 与 Sandbox execution environment identity 绑定。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExecutionEnvironmentIdentity {
    /// Sandbox execution environment identity 的本地 typed ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// identity 永久绑定的 accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// acceptance 使用的 exact Resolved snapshot ref。
    resolution_ref: ExecutionContextResolutionRef,
    /// actor / work / origin / trace 的 immutable responsibility anchor。
    responsibility_anchor: ExecutionResponsibilityAnchor,
    /// identity 绑定流程的 canonical lifecycle status。
    identity_status: ExecutionEnvironmentIdentityStatus,
    /// Closed / Invalidated 状态的 caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// identity 首次绑定时间。
    bound_at: Timestamp,
    /// 最近一次状态变化时间。
    status_changed_at: Timestamp,
    /// 最近一次状态变化对应的 audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl ExecutionEnvironmentIdentity {
    /// 为刚 accepted 的 context 建立 active identity；必须使用 context 已登记的预生成 identity ref。
    pub fn bind(
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        context: &ControlledExecutionContext,
        resolution: &ExecutionContextResolution,
        responsibility_anchor: ExecutionResponsibilityAnchor,
        audit_trace_ref: SandboxAuditTraceRef,
        bound_at: Timestamp,
    ) -> Result<Self, ExecutionEnvironmentIdentityError>;

    /// 在 context 已通过 checked closure basis 关闭后关闭 identity。
    pub fn close(
        &mut self,
        context: &ControlledExecutionContext,
        reason: SandboxReason,
        audit_trace_ref: SandboxAuditTraceRef,
        closed_at: Timestamp,
    ) -> Result<(), ExecutionEnvironmentIdentityError>;

    /// 在责任链、source ownership 或安全锚点失效时阻断后续 execution。
    pub fn invalidate(
        &mut self,
        reason: SandboxReason,
        audit_trace_ref: SandboxAuditTraceRef,
        invalidated_at: Timestamp,
    ) -> Result<(), ExecutionEnvironmentIdentityError>;

    /// 返回 environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 identity 永久绑定的 context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 acceptance 使用的 exact resolution ref。
    pub fn resolution_ref(&self) -> &ExecutionContextResolutionRef;
    /// 返回 immutable responsibility anchor。
    pub fn responsibility_anchor(&self) -> &ExecutionResponsibilityAnchor;
    /// 返回当前 identity lifecycle status。
    pub fn identity_status(&self) -> ExecutionEnvironmentIdentityStatus;
    /// 返回 terminal identity 的 caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回 identity bound time。
    pub fn bound_at(&self) -> &Timestamp;
    /// 返回最近状态变化时间。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近状态变化的 audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只有 Active identity 才可作为 boundary requirement anchor。
    pub fn can_anchor_boundary(&self) -> bool;

    /// 校验 active identity 与 accepted context 为同一原子 intake 结果。
    pub fn require_active_for(
        &self,
        context: &ControlledExecutionContext,
    ) -> Result<(), ExecutionEnvironmentIdentityError>;
}
```

| private field | exact source | invariant |
|---|---|---|
| `environment_identity_ref` | context `accept` 使用的同一预生成 ref | 必须与 `context.environment_identity_ref` 相等。 |
| `context_ref` | accepted context | identity 永不改挂 context。 |
| `resolution_ref` | acceptance 使用的 resolved snapshot | 必须等于 `context.latest_resolution_ref`，且 resolution context 匹配。 |
| `responsibility_anchor` | §10.2 factory | actor/work/origin 必须与 context responsibility 相同，trace 必须与 context trace 相同。 |
| `identity_status` | `bind / close / invalidate` | `Active -> Closed | Invalidated`；两者终态。 |
| `status_reason` | `close` 的显式 checked closure reason / `invalidate` 的 safe reason | `Active => None`；terminal status 必须 `Some`。context 与 identity 同批关闭时必须传入同一个 closure reason。 |
| `bound_at`;`status_changed_at` | application clock | status time 不回退。 |
| `last_audit_trace_ref` | staged audit truth ref | 每次 transition 必须更新。 |

```rust
/// execution environment identity 自有构造与 lifecycle 错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ExecutionEnvironmentIdentityError {
    /// bind 输入的 context 未 Accepted；载荷给出 context 和实际 status。
    ContextWasNotAccepted {
        /// identity bind 尝试消费的 controlled execution context ref。
        context_ref: ControlledExecutionContextRef,
        /// context 实际 canonical intake status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// 预生成 identity ref 与 context 已登记 ref 不一致。
    ContextIdentityRefMismatch {
        /// accepted context 已预登记的 environment identity ref。
        expected: ExecutionEnvironmentIdentityRef,
        /// identity factory 实际收到的 environment identity ref。
        actual: ExecutionEnvironmentIdentityRef,
    },
    /// resolution ref 与 context acceptance 记录不一致。
    ResolutionRefMismatch {
        /// accepted context 已记录的 execution resolution ref。
        expected: ExecutionContextResolutionRef,
        /// identity factory 实际收到的 execution resolution ref。
        actual: ExecutionContextResolutionRef,
    },
    /// responsibility anchor 的 actor / work / origin / trace 与 context 不一致。
    ResponsibilityAnchorMismatch,
    /// identity 与传入 context 的 owning ref 不一致。
    IdentityContextMismatch {
        /// execution environment identity 永久绑定的 context ref。
        expected: ControlledExecutionContextRef,
        /// transition 实际收到的 context ref。
        actual: ControlledExecutionContextRef,
    },
    /// 当前 identity 不是 Active，不能作为 boundary anchor。
    IdentityNotActive {
        /// 未满足 active 前提的 execution environment identity。
        identity_ref: ExecutionEnvironmentIdentityRef,
        /// identity 实际 canonical lifecycle status。
        actual: ExecutionEnvironmentIdentityStatus,
    },
    /// normal close 输入的 context 尚未 Closed。
    ContextWasNotClosed {
        /// identity normal close 所属的 controlled execution context ref。
        context_ref: ControlledExecutionContextRef,
        /// context 实际 canonical intake status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// 载荷 identity 的 from / to 不在 exact lifecycle 中。
    IdentityTransitionNotAllowed {
        /// 拒绝 transition 的 execution environment identity。
        identity_ref: ExecutionEnvironmentIdentityRef,
        /// transition 前实际 canonical identity status。
        from: ExecutionEnvironmentIdentityStatus,
        /// caller 请求进入的目标 identity status。
        to: ExecutionEnvironmentIdentityStatus,
    },
    /// 新 identity status time 早于既有 status time。
    StatusTimestampMovedBackwards {
        /// status time relation 校验失败的 identity。
        identity_ref: ExecutionEnvironmentIdentityRef,
    },
}
```

identity 不是 actor / member / runtime `ExecutionInstance` truth，不拥有认证、授权、agent loop、session 或 callback lifecycle。`Invalidated` 不允许恢复为 `Active`；后续重试必须创建新 context 与新 identity。正常 closure UoW 先以同一个 checked `CleanupGuard` 和同一个 `SandboxReason` 调用 context `close`，再调用 identity `close`；任一步失败整组回滚，不能产生 closed context + active identity。

### 12.3 Context / identity atomicity handoff

Step 7 必须把 `OpenControlledExecutionContext` 的成功路径固定为以下顺序和单一 transaction boundary：

```text
open_pending context
  -> persistable reference resolution candidate
  -> resolved execution resolution
  -> accepted IntakeGuardDecision
  -> generate identity ref
  -> context.accept(... identity ref ...)
  -> ExecutionEnvironmentIdentity::bind(same identity ref, accepted context, ...)
  -> stage audit + relay + stored result
  -> commit context + both resolutions + identity + audit atomically
```

任一 constructor / transition / save / outbox staging 失败必须 rollback。duplicate replay 读取 stored result，不重跑 `accept` 或 `bind`。repository 不得提供“单独保存 accepted context 且稍后补 identity”的 callable。

## 13. Intake guard contract

### 13.1 External-body exclusion support

```rust
/// guard 必须覆盖的全部 forbidden external-body marker；与一次扫描结果类型隔离。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BlockedExternalBodyMarkerSet(
    /// 按 canonical variant 顺序覆盖全部 forbidden marker 的 rule set。
    Vec<ExternalBodyMarker>,
);

impl BlockedExternalBodyMarkerSet {
    /// 构造 ordered-unique rule set，并要求覆盖 `ExternalBodyMarker` 全部 12 个 variant。
    pub fn try_new(
        markers: Vec<ExternalBodyMarker>,
    ) -> Result<Self, ExternalBodyExclusionGuardError>;

    /// 返回不可变 blocked marker 切片。
    pub fn as_slice(&self) -> &[ExternalBodyMarker];
    /// 判断指定 marker 是否被本 guard rule 阻断。
    pub fn blocks(&self, marker: ExternalBodyMarker) -> bool;
    /// 判断 rule set 是否穷尽全部 12 个 canonical marker。
    pub fn is_complete(&self) -> bool;
}

/// 一次 external-body exclusion 判断的有限结果。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ExternalBodyExclusionDecisionKind {
    /// 扫描结果不含 forbidden marker。
    Clear,
    /// 至少发现一个 forbidden marker，必须拒绝或 quarantine。
    Rejected,
}

/// 绑定 guard、context 与扫描结果的一次 immutable exclusion decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExternalBodyExclusionDecision {
    /// 产生本 decision 的 exact exclusion guard ref。
    guard_ref: ExternalBodyExclusionGuardRef,
    /// 本 decision 唯一绑定的 pending context ref。
    context_ref: ControlledExecutionContextRef,
    /// entry / resolver scanner 提供的 checked marker set。
    markers: ForbiddenExternalBodyMarkerSet,
    /// Clear 或 Rejected 的有限处置类别。
    decision_kind: ExternalBodyExclusionDecisionKind,
    /// Rejected 时的 fixed caller-safe reason。
    reason: Option<SandboxReason>,
    /// application clock 提供的判断时间。
    evaluated_at: Timestamp,
}

impl ExternalBodyExclusionDecision {
    /// 返回产生 decision 的 exclusion guard ref。
    pub fn guard_ref(&self) -> &ExternalBodyExclusionGuardRef;
    /// 返回 decision 绑定的 context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 scanner 识别出的 forbidden marker set。
    pub fn markers(&self) -> &ForbiddenExternalBodyMarkerSet;
    /// 返回 finite exclusion decision kind。
    pub fn decision_kind(&self) -> ExternalBodyExclusionDecisionKind;
    /// 返回 Rejected decision 的 fixed safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回判断时间。
    pub fn evaluated_at(&self) -> &Timestamp;
    /// 判断本 decision 是否为 Clear 且 marker set 为空。
    pub fn is_clear(&self) -> bool;
}
```

`BlockedExternalBodyMarkerSet` 的 completeness 顺序按 `6R-01` variant 顺序固定：`IdentityBody`、`WorkBody`、`ToolSemanticBody`、`RuntimeLoopBody`、`MemberHostBody`、`RunnerBody`、`PolicyDefinitionBody`、`ArtifactBody`、`ObservabilityBody`、`InvestigationBody`、`BackendBody`、`SecretMaterial`。缺任一项、重复任一项或出现未来新增但未纳入 completeness audit 的 variant，guard factory 都必须失败；不得通过 wildcard 自动放行未来 variant。

### 13.2 `ExternalBodyExclusionGuard`

```rust
/// 对所有禁止入仓的外部正文类别执行不可配置关闭的严格排除判断。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ExternalBodyExclusionGuard {
    /// strict exclusion guard 的 typed ref。
    guard_ref: ExternalBodyExclusionGuardRef,
    /// 必须 12/12 完整的 blocked marker rules。
    blocked_markers: BlockedExternalBodyMarkerSet,
    /// 本 rule snapshot 的激活时间。
    activated_at: Timestamp,
}

impl ExternalBodyExclusionGuard {
    /// 构造严格 guard；blocked marker coverage 必须为 12/12。
    pub fn try_strict(
        guard_ref: ExternalBodyExclusionGuardRef,
        blocked_markers: BlockedExternalBodyMarkerSet,
        activated_at: Timestamp,
    ) -> Result<Self, ExternalBodyExclusionGuardError>;

    /// 对已由 entry / resolver 识别的 marker set 作纯判断，不读取或回显正文。
    pub fn evaluate(
        &self,
        context_ref: &ControlledExecutionContextRef,
        markers: ForbiddenExternalBodyMarkerSet,
        evaluated_at: Timestamp,
    ) -> ExternalBodyExclusionDecision;

    /// 返回 strict exclusion guard ref。
    pub fn guard_ref(&self) -> &ExternalBodyExclusionGuardRef;
    /// 返回 12/12 blocked marker rules。
    pub fn blocked_markers(&self) -> &BlockedExternalBodyMarkerSet;
    /// 返回 guard rule snapshot 激活时间。
    pub fn activated_at(&self) -> &Timestamp;
}

/// external-body exclusion guard 自有构造错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ExternalBodyExclusionGuardError {
    /// blocked marker rule set 为空，无法形成 strict guard。
    EmptyBlockedMarkerSet,
    /// rule set 重复包含载荷中的 marker。
    DuplicateBlockedMarker {
        /// strict blocked set 中重复出现的 external-body marker。
        marker: ExternalBodyMarker,
    },
    /// rule set 未覆盖载荷中的 canonical marker。
    IncompleteBlockedMarkerCoverage {
        /// strict blocked set 中缺失的 canonical external-body marker。
        missing: ExternalBodyMarker,
    },
}
```

| evaluate input | exact source | rule |
|---|---|---|
| `context_ref` | pending context | decision 必须绑定具体 context，不产生全局匿名判断。 |
| `markers` | schema scanner / resolver 已构造的 `ForbiddenExternalBodyMarkerSet` | 空 => `Clear + None`；非空 => `Rejected + Some(fixed safe reason)`。 |
| `evaluated_at` | application clock | guard 不自行读取系统时间。 |

`evaluate` 不会失败，因为输入 carrier 已 checked、guard coverage 已在 factory 闭合。它也不丢弃 marker：decision 保存完整 marker enum set 供安全审计，但不得包含正文、路径、secret 或 raw payload。debug / fake / local profile 与 retry 均不能把 `Rejected` 改为 `Clear`。

### 13.3 Intake decision support

```rust
/// 一次 controlled execution intake guard 的有限处置。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum IntakeGuardDecisionKind {
    /// 最小责任、引用与正文排除前提均成立。
    Accepted,
    /// 当前仍缺少可安全解析的输入，只能保持 pending / unresolved。
    PendingResolution,
    /// 输入冲突、非法或携带 forbidden body，必须终止当前 context。
    Rejected,
}

/// 绑定 guard 与全部一次性 resolution snapshot 的 intake decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IntakeGuardDecision {
    /// 产生本 decision 的 exact intake guard ref。
    guard_ref: ControlledExecutionIntakeGuardRef,
    /// 本 decision 唯一绑定的 pending context ref。
    context_ref: ControlledExecutionContextRef,
    /// 本次判断消费的 execution resolution ref。
    resolution_ref: ExecutionContextResolutionRef,
    /// 本次判断消费的 reference resolution ref。
    reference_resolution_ref: ContextReferenceResolutionRef,
    /// 本次判断消费的 exclusion guard ref。
    exclusion_guard_ref: ExternalBodyExclusionGuardRef,
    /// Accepted / PendingResolution / Rejected 处置类别。
    decision_kind: IntakeGuardDecisionKind,
    /// non-Accepted decision 的 caller-safe reason。
    reason: Option<SandboxReason>,
    /// application clock 提供的判断时间。
    evaluated_at: Timestamp,
}

impl IntakeGuardDecision {
    /// 返回产生 decision 的 intake guard ref。
    pub fn guard_ref(&self) -> &ControlledExecutionIntakeGuardRef;
    /// 返回 decision 绑定的 context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 exact execution resolution ref。
    pub fn resolution_ref(&self) -> &ExecutionContextResolutionRef;
    /// 返回 exact reference resolution ref。
    pub fn reference_resolution_ref(&self) -> &ContextReferenceResolutionRef;
    /// 返回 exact exclusion guard ref。
    pub fn exclusion_guard_ref(&self) -> &ExternalBodyExclusionGuardRef;
    /// 返回 finite intake decision kind。
    pub fn decision_kind(&self) -> IntakeGuardDecisionKind;
    /// 返回 non-Accepted decision reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回 decision evaluated time。
    pub fn evaluated_at(&self) -> &Timestamp;
    /// 判断 decision 是否允许正式 acceptance。
    pub fn is_accepted(&self) -> bool;
    /// 判断 decision 是否要求保持 pending / unresolved。
    pub fn is_pending(&self) -> bool;
    /// 判断 decision 是否要求终止当前 intake。
    pub fn is_rejected(&self) -> bool;
}
```

decision 字段只能由 `ControlledExecutionIntakeGuard::evaluate` 写入，不提供 public constructor 或 serde aggregate literal。`Accepted => reason None`；`PendingResolution | Rejected => reason Some`。它是同一 UoW 中的判断值，不是独立持久化状态机，也不替代 `ControlledExecutionContext.intake_status`。

### 13.4 `ControlledExecutionIntakeGuard`

```rust
/// 校验正式 Sandbox intake 的 actor、work、caller source、resolution 与正文排除前提。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ControlledExecutionIntakeGuard {
    /// 不可变 intake guard 规则的 typed identity。
    guard_ref: ControlledExecutionIntakeGuardRef,
    /// 本 rule snapshot 要求的完整 source kind set。
    required_source_kinds: RequiredContextSourceKindSet,
    /// 必须与 decision 使用的 strict exclusion guard 相等。
    exclusion_guard_ref: ExternalBodyExclusionGuardRef,
    /// 本 rule snapshot 的激活时间。
    activated_at: Timestamp,
}

impl ControlledExecutionIntakeGuard {
    /// 构造固定 intake rule snapshot；required set 必须含 Identity、Work 和 caller source。
    pub fn try_new(
        guard_ref: ControlledExecutionIntakeGuardRef,
        required_source_kinds: RequiredContextSourceKindSet,
        exclusion_guard_ref: ExternalBodyExclusionGuardRef,
        activated_at: Timestamp,
    ) -> Result<Self, ControlledExecutionIntakeGuardError>;

    /// 对同一 pending context 的 checked values 作纯判断。
    pub fn evaluate(
        &self,
        context: &ControlledExecutionContext,
        resolution: &ExecutionContextResolution,
        reference_resolution: &ContextReferenceResolution,
        exclusion_decision: &ExternalBodyExclusionDecision,
        evaluated_at: Timestamp,
    ) -> Result<IntakeGuardDecision, ControlledExecutionIntakeGuardError>;

    /// 返回 intake guard rule identity。
    pub fn guard_ref(&self) -> &ControlledExecutionIntakeGuardRef;
    /// 返回 required source kind set。
    pub fn required_source_kinds(&self) -> &RequiredContextSourceKindSet;
    /// 返回绑定的 strict exclusion guard ref。
    pub fn exclusion_guard_ref(&self) -> &ExternalBodyExclusionGuardRef;
    /// 返回 guard rule snapshot 激活时间。
    pub fn activated_at(&self) -> &Timestamp;
}

/// controlled intake guard 自有构造、关系与状态错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ControlledExecutionIntakeGuardError {
    /// required set 未包含 Identity source kind。
    MissingIdentityRequirement,
    /// required set 未包含 Work source kind。
    MissingWorkRequirement,
    /// required set 未包含任何允许的 caller source kind。
    MissingCallerRequirement,
    /// evaluate 输入 context 不是 PendingResolution。
    ContextWasNotPending {
        /// intake guard 尝试评估的 controlled execution context ref。
        context_ref: ControlledExecutionContextRef,
        /// context 实际 canonical intake status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// execution resolution 与 target context 不一致。
    ResolutionContextMismatch {
        /// intake guard 目标 controlled execution context ref。
        expected: ControlledExecutionContextRef,
        /// execution resolution 实际绑定的 context ref。
        actual: ControlledExecutionContextRef,
    },
    /// reference resolution 与 target context 不一致。
    ReferenceResolutionContextMismatch {
        /// intake guard 目标 controlled execution context ref。
        expected: ControlledExecutionContextRef,
        /// reference resolution 实际绑定的 context ref。
        actual: ControlledExecutionContextRef,
    },
    /// reference snapshot sources 与 context 声明 sources 未按 same-source 双向覆盖。
    ReferenceSourceSetMismatch,
    /// execution resolution 引用的 reference snapshot 与实际输入不一致。
    ResolutionReferenceMismatch {
        /// execution resolution 已记录的 reference resolution ref。
        expected: ContextReferenceResolutionRef,
        /// guard evaluate 实际收到的 reference resolution ref。
        actual: ContextReferenceResolutionRef,
    },
    /// exclusion decision 与 target context 不一致。
    ExclusionContextMismatch {
        /// intake guard 目标 controlled execution context ref。
        expected: ControlledExecutionContextRef,
        /// exclusion decision 实际绑定的 context ref。
        actual: ControlledExecutionContextRef,
    },
    /// exclusion decision 使用的 guard 与 intake rule 绑定 guard 不一致。
    ExclusionGuardMismatch {
        /// intake rule 固定绑定的 external-body exclusion guard ref。
        expected: ExternalBodyExclusionGuardRef,
        /// exclusion decision 实际记录的 guard ref。
        actual: ExternalBodyExclusionGuardRef,
    },
    /// responsibility context 未满足 actor / work / origin 最小不变量。
    ResponsibilityContextInvalid,
    /// reference snapshot 未覆盖载荷中的 required source kind。
    RequiredSourceNotCovered {
        /// strict intake rule 要求但 reference snapshot 未覆盖的 source kind。
        kind: ExternalSourceKind,
    },
    /// evaluated time 不满足 canonical timestamp contract 或早于 guard activation。
    GuardEvaluationTimestampInvalid,
}
```

exact decision matrix：

| priority | input condition | decision | reason owner |
|---:|---|---|---|
| 1 | exclusion decision `Rejected` 或 markers 非空 | `Rejected` | fixed forbidden-body safe reason；markers 单独保存 |
| 2 | reference status `Invalid` | `Rejected` | reference resolution safe reason |
| 3 | execution resolution `Conflicted` | `Rejected` | execution resolution safe reason |
| 4 | reference status `Stale | Unavailable` | `PendingResolution` | reference resolution safe reason |
| 5 | execution resolution `Partial | Unresolved` | `PendingResolution` | execution resolution safe reason |
| 6 | execution `Resolved` + reference `Complete` + required kinds 逐项覆盖 + responsibility valid | `Accepted` | `None` |

优先级必须按表执行，不能让后一个 success condition 覆盖前一个 rejection。不存在 permissive default 分支：若新增 status variant 导致 match 非穷尽，编译必须失败；不得 `_ => Accepted` 或 `_ => PendingResolution`。

### 13.5 Guard 与 context 的关系校验

`ControlledExecutionContext::accept / record_partial_resolution / mark_unresolved / reject` 必须逐项比较：

| comparison | 必须相等 / 成立 |
|---|---|
| context relation | `decision.context_ref == self.context_ref` |
| execution resolution | `decision.resolution_ref == resolution.resolution_ref` |
| reference resolution | `decision.reference_resolution_ref == resolution.reference_resolution_ref == reference_resolution.reference_resolution_ref` |
| source identity | context 与 reference snapshot 的 source refs 按 `same_source()` 双向全覆盖；不得只比较 kind、数量或输入顺序，也不得接受 resolver 注入的额外 source |
| exclusion guard | decision 记录的 guard ref 必须是 intake guard 固定引用的 guard；context 方法只消费已封装 decision，不接受裸 bool。 |
| decision kind | `accept => Accepted`;`record_partial_resolution | mark_unresolved => PendingResolution`;`reject => Rejected` |
| resolution status | `accept => Resolved`;`record_partial_resolution => Partial`;`mark_unresolved => Unresolved`;`reject => Conflicted` 或 reference `Invalid` / exclusion rejected 的映射结果 |
| reason | accepted 无 reason；unresolved / rejected 将 decision safe reason 原样写入；partial reason 留在 immutable resolution / decision，context pending reason 保持 `None`。 |

因此需要把 §12.1 的 `accept` 增加 intake guard ref 对账来源。实现时 `IntakeGuardDecision` private fields 与 `ControlledExecutionIntakeGuard` private constructor 保证 decision 不可伪造；Step 7 application service 仍必须先加载 command 指定的 guard ref，并按 expected version / active rule snapshot 校验，不能接受 request 内嵌 guard body。

## 14. Boundary requirement exact contract

### 14.1 `BoundaryRequirementError`

本节所有 requirement value 共用一个封闭错误族，但每个 variant 都点名失败对象与字段，不使用 `InvalidRequirement(String)` 泛化占位。

```rust
/// 十维 boundary requirement 的数值、来源、关系或完整性校验失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryRequirementError {
    /// 载荷指出 resource kind 与值为零的具体字段名。
    ZeroResourceLimit {
        /// 出现零值的 CPU / memory / wall-clock / IO boundary kind。
        kind: BoundaryLimitKind,
        /// 出现零值的固定字段名，不包含 request payload。
        field: &'static str,
    },
    /// memory swap ceiling 大于 memory ceiling。
    MemorySwapExceedsMemory,
    /// wall-clock termination grace 未严格小于 max duration。
    WallClockGraceNotBelowLimit,
    /// resource set 重复包含载荷中的 kind。
    DuplicateResourceLimit {
        /// resource limit set 中重复出现的 canonical resource kind。
        kind: BoundaryLimitKind,
    },
    /// resource set 缺少载荷中的 required kind。
    MissingResourceLimit {
        /// complete resource limit set 中缺失的 canonical resource kind。
        kind: BoundaryLimitKind,
    },
    /// filesystem requirement 未禁止宿主写入。
    FilesystemHostWriteWasNotDenied,
    /// filesystem requirement 未禁止特殊文件访问。
    FilesystemSpecialFileAccessWasNotDenied,
    /// filesystem requirement 未禁止设备访问。
    FilesystemDeviceAccessWasNotDenied,
    /// filesystem requirement 未禁止 symlink escape。
    FilesystemSymlinkEscapeWasNotDenied,
    /// network access mode 不属于当前 closed fail-closed 集合。
    NetworkPolicyWasUnrestricted,
    /// allowlisted egress 未提供任何 validated summary。
    NetworkAllowlistMissing,
    /// DenyAll 模式意外携带 allowlist summary。
    NetworkAllowlistUnexpected,
    /// network requirement 未禁止 ingress。
    NetworkIngressWasNotDenied,
    /// network requirement 未禁止 host network access。
    NetworkHostAccessWasNotDenied,
    /// network requirement 未禁止未列明 DNS resolution。
    NetworkUnlistedDnsWasNotDenied,
    /// network summary 的载荷 source kind 不是 IsolationBackend。
    NetworkSummarySourceKindInvalid {
        /// network allowlist summary 实际携带的 external source kind。
        actual: ExternalSourceKind,
    },
    /// process requirement 未要求独立 process namespace。
    ProcessIsolationWasNotRequired,
    /// process requirement 未禁止宿主进程可见性。
    ProcessHostVisibilityWasNotDenied,
    /// process requirement 未要求 privilege drop。
    ProcessPrivilegeWasNotDropped,
    /// process requirement 未禁止 new privileges。
    ProcessNewPrivilegesWereNotDenied,
    /// process requirement 未禁止向宿主进程传递 signal。
    ProcessHostSignalDeliveryWasNotDenied,
    /// process count 为零，不能形成 hard ceiling。
    ProcessCountWasZero,
    /// subprocess policy 与 max process count 的 closed relation 不一致。
    SubprocessPolicyCountMismatch,
    /// workspace requirement 未提供任何 Work ref。
    WorkspaceRefsEmpty,
    /// workspace ref 的载荷 source kind 不是 Work。
    WorkspaceSourceKindInvalid {
        /// workspace ref 实际携带的 external source kind。
        actual: ExternalSourceKind,
    },
    /// workspace requirement 未禁止 parent escape。
    WorkspaceEscapeWasNotDenied,
    /// workspace requirement 未禁止宿主 workspace 写入。
    WorkspaceHostWriteWasNotDenied,
    /// ephemeral workspace 未要求 release 时丢弃临时写层。
    WorkspaceEphemeralDiscardWasNotRequired,
    /// mount rule set 重复包含同一个 canonical rule key。
    DuplicateMountRule,
    /// mount source summary 的载荷 kind 不在允许集合中。
    MountSourceKindInvalid {
        /// mount source summary 实际携带的 external source kind。
        actual: ExternalSourceKind,
    },
    /// mount target summary 的载荷 kind 不是 Work。
    MountTargetKindInvalid {
        /// mount target summary 实际携带的 external source kind。
        actual: ExternalSourceKind,
    },
    /// mount requirement 未要求 private propagation。
    MountPropagationWasNotPrivate,
    /// mount requirement 未禁止宿主 root mount。
    HostRootMountWasNotDenied,
    /// mount requirement 未禁止 device mount。
    DeviceMountWasNotDenied,
    /// mount requirement 未禁止 runtime 扩大 mount set。
    RuntimeMountExpansionWasNotDenied,
    /// lifecycle max lease duration 为零。
    LifecycleLeaseDurationWasZero,
    /// lifecycle orphan detection grace 为零。
    LifecycleOrphanDetectionGraceWasZero,
    /// lifecycle requirement 未要求 release confirmation。
    LifecycleReleaseConfirmationWasNotRequired,
    /// lifecycle requirement 未要求 cleanup guard。
    LifecycleCleanupGuardWasNotRequired,
    /// lifecycle requirement 未要求 reaper。
    LifecycleReaperWasNotRequired,
    /// bounded renewal extension 为零。
    LifecycleRenewalExtensionWasZero,
    /// bounded renewal count 为零。
    LifecycleRenewalCountWasZero,
    /// 单次 renewal extension 大于 max lease duration。
    LifecycleRenewalExtensionExceedsLeaseDuration,
    /// generation binding 的载荷字段具有错误 source kind。
    GenerationSourceKindInvalid {
        /// source-kind relation 失败的固定 generation binding 字段名。
        field: &'static str,
        /// generation source ref 实际携带的 external source kind。
        actual: ExternalSourceKind,
    },
    /// generation binding 的载荷字段缺少 source version。
    GenerationVersionMissing {
        /// 缺少 source version 的固定 generation binding 字段名。
        field: &'static str,
    },
    /// generation binding 的载荷字段 version 与 canonical generation 不一致。
    GenerationMismatch {
        /// source version 不匹配的固定 generation binding 字段名。
        field: &'static str,
    },
    /// compose 输入 context 未 Accepted；载荷给出 actual status。
    ContextWasNotAccepted {
        /// requirement compose 尝试消费的 controlled execution context ref。
        context_ref: ControlledExecutionContextRef,
        /// context 实际 canonical intake status。
        actual: ControlledExecutionIntakeStatus,
    },
    /// compose 输入 identity 未 Active；载荷给出 actual status。
    IdentityWasNotActive {
        /// requirement compose 尝试消费的 execution environment identity ref。
        identity_ref: ExecutionEnvironmentIdentityRef,
        /// identity 实际 canonical lifecycle status。
        actual: ExecutionEnvironmentIdentityStatus,
    },
    /// compose 输入 context 与 identity 不是同一 intake 结果。
    ContextIdentityMismatch,
    /// complete requirement set 缺少载荷中的 boundary kind。
    RequirementDimensionMissing {
        /// ten-dimensional requirement set 中缺失的 canonical boundary kind。
        kind: BoundaryLimitKind,
    },
    /// complete requirement set 重复承接载荷中的 boundary kind。
    RequirementDimensionDuplicated {
        /// ten-dimensional requirement set 中重复承接的 canonical boundary kind。
        kind: BoundaryLimitKind,
    },
    /// requirement created time 不满足 canonical timestamp ordering contract。
    RequirementTimestampInvalid,
}
```

### 14.2 `ResourceLimitRequirement`

```rust
use std::num::{NonZeroU32, NonZeroU64};

/// `ResourceLimitRequirement` 的私有数值载体，禁止绕过 checked factory 直接构造。
#[derive(Clone, Debug, Eq, PartialEq)]
enum ResourceLimitValue {
    Cpu {
        quota_micros: NonZeroU64,
        period_micros: NonZeroU64,
    },
    Memory {
        max_memory_bytes: NonZeroU64,
        max_swap_bytes: u64,
    },
    WallClock {
        max_duration_millis: NonZeroU64,
        termination_grace_millis: u64,
    },
    Io {
        max_read_bytes_per_second: NonZeroU64,
        max_write_bytes_per_second: NonZeroU64,
        max_operations_per_second: NonZeroU64,
    },
}

/// 一项单位明确、后端产品无关且只能经 checked factory 构造的 hard resource limit。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResourceLimitRequirement {
    /// 与 private value variant 一一对应的 canonical resource kind。
    kind: BoundaryLimitKind,
    /// 单位明确且只能经 named factory 创建的 private resource value。
    value: ResourceLimitValue,
}

impl ResourceLimitRequirement {
    /// 构造 CPU quota；application 负责把 profile / request 单位转换为 microseconds。
    pub fn cpu(
        quota_micros: u64,
        period_micros: u64,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 构造 memory ceiling；`max_swap_bytes == 0` 表示禁用 swap。
    pub fn memory(
        max_memory_bytes: u64,
        max_swap_bytes: u64,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 构造 wall-clock ceiling；grace 必须严格小于总时限。
    pub fn wall_clock(
        max_duration_millis: u64,
        termination_grace_millis: u64,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 构造 IO ceiling；三个维度都必须大于零，不允许“零代表无限”。
    pub fn io(
        max_read_bytes_per_second: u64,
        max_write_bytes_per_second: u64,
        max_operations_per_second: u64,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 返回该 requirement 唯一对应的 resource kind。
    pub fn kind(&self) -> BoundaryLimitKind;

    /// CPU requirement 返回 `(quota_micros, period_micros)`，其余 kind 返回 `None`。
    pub fn cpu_values(&self) -> Option<(NonZeroU64, NonZeroU64)>;

    /// memory requirement 返回 `(max_memory_bytes, max_swap_bytes)`，其余 kind 返回 `None`。
    pub fn memory_values(&self) -> Option<(NonZeroU64, u64)>;

    /// wall-clock requirement 返回 `(max_duration_millis, termination_grace_millis)`。
    pub fn wall_clock_values(&self) -> Option<(NonZeroU64, u64)>;

    /// IO requirement 返回 `(read_bps, write_bps, operations_per_second)`。
    pub fn io_values(&self) -> Option<(NonZeroU64, NonZeroU64, NonZeroU64)>;
}
```

`kind` 与 private `value` variant 必须一一对应；四个 factory 是唯一构造入口。数值 `0` 永远不解释为 unlimited。若产品需要“禁用该资源”，必须由对应边界语义表达，例如 IO 仍要有最小 hard ceiling；不得通过 `None` 或最大整数隐式放宽。具体数值和上限来源由 Step 13 配置 / profile 合成闭合，本批只固定单位、正值与关系。

### 14.3 `ResourceLimitSet`

```rust
/// 完整承接 CPU、memory、wall-clock 与 IO 四个资源维度的有序集合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ResourceLimitSet {
    /// CPU 强制上限要求。
    cpu: ResourceLimitRequirement,
    /// memory 强制上限要求。
    memory: ResourceLimitRequirement,
    /// wall-clock 强制上限要求。
    wall_clock: ResourceLimitRequirement,
    /// IO 强制上限要求。
    io: ResourceLimitRequirement,
}

impl ResourceLimitSet {
    /// 从任意输入顺序构造 4/4 complete set；缺失、重复或非资源 kind 均拒绝。
    pub fn try_complete(
        requirements: Vec<ResourceLimitRequirement>,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 返回 CPU hard requirement。
    pub fn cpu(&self) -> &ResourceLimitRequirement;
    /// 返回 memory hard requirement。
    pub fn memory(&self) -> &ResourceLimitRequirement;
    /// 返回 wall-clock hard requirement。
    pub fn wall_clock(&self) -> &ResourceLimitRequirement;
    /// 返回 IO hard requirement。
    pub fn io(&self) -> &ResourceLimitRequirement;

    /// 按 canonical kind 顺序返回只读 requirement。
    pub fn get(
        &self,
        kind: BoundaryLimitKind,
    ) -> Option<&ResourceLimitRequirement>;

    /// 固定返回 `[Cpu, Memory, WallClock, Io]`，供 completeness audit 使用。
    pub fn covered_kinds(&self) -> [BoundaryLimitKind; 4];
}
```

`ResourceLimitSet` 不提供 `insert`、`remove` 或 mutable slice。显式 request、profile 和 template 的“取更严格值”合成算法属于 Step 7 application helper；domain factory 只接收合成后的 complete set，且 backend capability 只能验证，不能反向修改 requirement。

### 14.4 `FilesystemBoundaryRequirement`

```rust
/// Sandbox root filesystem 的可见性模式。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum RootFilesystemMode {
    /// root filesystem 只读；写入只能发生在显式 workspace / mount boundary 内。
    ReadOnly,
}

/// 文件系统可见性、写入、特殊文件与 escape 的 hard requirement。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FilesystemBoundaryRequirement {
    /// 当前 closed baseline 固定为只读 root filesystem。
    root_mode: RootFilesystemMode,
    /// 是否禁止对宿主 filesystem 写入。
    forbid_host_write: bool,
    /// 是否禁止 socket / pipe / proc-like 特殊文件访问。
    forbid_special_file_access: bool,
    /// 是否禁止设备文件访问。
    forbid_device_access: bool,
    /// 是否禁止通过 symlink 逃逸可见 filesystem boundary。
    forbid_symlink_escape: bool,
}

impl FilesystemBoundaryRequirement {
    /// 构造严格 filesystem boundary；五项 hard requirement 不允许关闭。
    pub fn try_strict(
        root_mode: RootFilesystemMode,
        forbid_host_write: bool,
        forbid_special_file_access: bool,
        forbid_device_access: bool,
        forbid_symlink_escape: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 固定返回 Filesystem boundary kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回 root filesystem visibility mode。
    pub fn root_mode(&self) -> RootFilesystemMode;
    /// 返回是否禁止宿主 filesystem 写入。
    pub fn forbids_host_write(&self) -> bool;
    /// 返回是否禁止特殊文件访问。
    pub fn forbids_special_file_access(&self) -> bool;
    /// 返回是否禁止设备访问。
    pub fn forbids_device_access(&self) -> bool;
    /// 返回是否禁止 symlink escape。
    pub fn forbids_symlink_escape(&self) -> bool;
}
```

`kind()` 固定返回 `Filesystem`。writable workspace 和 mount 不在本对象存 path / body，而由 §14.7 / §14.8 独立承接。当前基线没有“可写 root”正式模式；未来如需新增，必须先回到需求 / 架构和 `BoundaryLimitKind` guard 影响审查，不能由配置私增 enum variant。

### 14.5 `NetworkBoundaryRequirement`

```rust
/// 受控环境允许的 network surface。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum NetworkAccessMode {
    /// 无 ingress、无 egress、无 host-network access。
    DenyAll,
    /// 无 ingress，仅允许已验证 safe-summary 中列出的 egress target。
    AllowlistedEgress,
}

/// 默认拒绝的 network boundary requirement。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NetworkBoundaryRequirement {
    /// DenyAll 或 AllowlistedEgress 的 closed network mode。
    access_mode: NetworkAccessMode,
    /// validated profile 提供的 body-free egress target summaries。
    allowlist_summaries: SafeSummaryRefSet,
    /// 是否禁止所有 ingress。
    forbid_ingress: bool,
    /// 是否禁止 host-network access。
    forbid_host_network: bool,
    /// 是否禁止未列明 DNS resolution。
    forbid_unlisted_dns_resolution: bool,
}

impl NetworkBoundaryRequirement {
    /// 构造 no-network requirement；allowlist 必须为空。
    pub fn deny_all(
        allowlist_summaries: SafeSummaryRefSet,
        forbid_ingress: bool,
        forbid_host_network: bool,
        forbid_unlisted_dns_resolution: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 构造显式 allowlisted egress；summary 必须非空且全部来自 validated backend/profile source。
    pub fn allowlisted_egress(
        allowlist_summaries: SafeSummaryRefSet,
        forbid_ingress: bool,
        forbid_host_network: bool,
        forbid_unlisted_dns_resolution: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 固定返回 Network boundary kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回 closed network access mode。
    pub fn access_mode(&self) -> NetworkAccessMode;
    /// 返回 validated body-free allowlist summaries。
    pub fn allowlist_summaries(&self) -> &SafeSummaryRefSet;
    /// 返回是否禁止 ingress。
    pub fn forbids_ingress(&self) -> bool;
    /// 返回是否禁止 host network access。
    pub fn forbids_host_network(&self) -> bool;
    /// 返回是否禁止未列明 DNS resolution。
    pub fn forbids_unlisted_dns_resolution(&self) -> bool;
    /// 判断 requirement 是否要求完全 network denial。
    pub fn requires_network_denial(&self) -> bool;
}
```

allowlist summary 的 `source_kind` 必须是 `IsolationBackend`，表示 validated boundary profile / network rule summary，而不是 backend probe 反向生成的 requirement。`Policy` source 只能在后序 policy decision 中裁定，不得在这里扩大 allowlist。两个 factory 均要求 ingress、host network 与 unlisted DNS 为 denied；缺省、unknown 或空 policy input 只能选择 `deny_all`，不能隐式选择 `AllowlistedEgress`。

### 14.6 `ProcessBoundaryRequirement`

```rust
/// 子进程创建策略。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum SubprocessPolicy {
    /// 禁止创建子进程；max process count 必须为 1。
    Denied,
    /// 允许在同一隔离 process boundary 内创建有限子进程。
    Limited,
}

/// 进程 namespace、权限、子进程、信号与数量 hard requirement。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProcessBoundaryRequirement {
    /// 是否要求独立 process namespace。
    require_process_namespace: bool,
    /// 是否禁止宿主进程可见性。
    forbid_host_process_visibility: bool,
    /// 是否要求 privilege drop。
    require_privilege_drop: bool,
    /// 是否禁止进程获得新 privileges。
    forbid_new_privileges: bool,
    /// 子进程禁止或有限允许策略。
    subprocess_policy: SubprocessPolicy,
    /// 隔离 boundary 内允许的最大 process count。
    max_process_count: NonZeroU32,
    /// 是否禁止向宿主进程传递 signal。
    forbid_host_signal_delivery: bool,
}

impl ProcessBoundaryRequirement {
    /// 构造 strict process boundary；所有 isolation bool 必须成立且 count 与 policy 对齐。
    pub fn try_strict(
        require_process_namespace: bool,
        forbid_host_process_visibility: bool,
        require_privilege_drop: bool,
        forbid_new_privileges: bool,
        subprocess_policy: SubprocessPolicy,
        max_process_count: u32,
        forbid_host_signal_delivery: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 固定返回 Process boundary kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回是否要求 process namespace。
    pub fn requires_process_namespace(&self) -> bool;
    /// 返回是否禁止宿主进程可见性。
    pub fn forbids_host_process_visibility(&self) -> bool;
    /// 返回是否要求 privilege drop。
    pub fn requires_privilege_drop(&self) -> bool;
    /// 返回是否禁止 new privileges。
    pub fn forbids_new_privileges(&self) -> bool;
    /// 返回 subprocess policy。
    pub fn subprocess_policy(&self) -> SubprocessPolicy;
    /// 返回 non-zero process count ceiling。
    pub fn max_process_count(&self) -> NonZeroU32;
    /// 返回是否禁止 host signal delivery。
    pub fn forbids_host_signal_delivery(&self) -> bool;
}
```

factory 要求 namespace、host visibility deny、privilege drop、no-new-privileges 与 host signal deny 全部成立。`Denied` 时 `max_process_count == 1`；`Limited` 时必须大于 1。具体 seccomp / AppArmor / cap-drop profile 只由 validated profile summary 和 capability verdict 证明，不作为 backend-specific field 写入对象。

### 14.7 `WorkspaceBoundaryRequirement`

```rust
/// workspace 在受控环境内的写入模式。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum WorkspaceWriteMode {
    /// workspace 只读。
    ReadOnly,
    /// 写入仅发生在与宿主隔离的临时层；不回写外部 work truth。
    IsolatedEphemeral,
}

/// work refs 对应 workspace 的可见性、写入和 escape requirement。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WorkspaceBoundaryRequirement {
    /// 本次 execution 可见的 body-free Work refs。
    workspace_refs: ExternalSourceRefSet,
    /// workspace 的只读或 isolation-owned ephemeral 写模式。
    write_mode: WorkspaceWriteMode,
    /// 是否禁止越过 workspace parent boundary。
    forbid_parent_escape: bool,
    /// 是否禁止回写宿主 workspace。
    forbid_host_workspace_write: bool,
    /// 是否在 release 时丢弃 isolation-owned ephemeral writes。
    discard_ephemeral_writes_on_release: bool,
}

impl WorkspaceBoundaryRequirement {
    /// 构造 workspace requirement；refs、write mode 和 escape redlines 必须共同成立。
    pub fn try_new(
        workspace_refs: ExternalSourceRefSet,
        write_mode: WorkspaceWriteMode,
        forbid_parent_escape: bool,
        forbid_host_workspace_write: bool,
        discard_ephemeral_writes_on_release: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 固定返回 Workspace boundary kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回 body-free Work refs。
    pub fn workspace_refs(&self) -> &ExternalSourceRefSet;
    /// 返回 workspace write mode。
    pub fn write_mode(&self) -> WorkspaceWriteMode;
    /// 返回是否禁止 parent escape。
    pub fn forbids_parent_escape(&self) -> bool;
    /// 返回是否禁止宿主 workspace 写入。
    pub fn forbids_host_workspace_write(&self) -> bool;
    /// 返回是否要求 release 时丢弃 ephemeral writes。
    pub fn discards_ephemeral_writes_on_release(&self) -> bool;
}
```

`workspace_refs` 必须非空且每项 `source_kind == Work`。两个 write mode 都必须 deny parent escape 与宿主 workspace write；`IsolatedEphemeral` 还必须 `discard_ephemeral_writes_on_release == true`。该 discard 只描述 workspace layer 处置，不代表 capture / material 已可删除；实际 release 仍受 lifecycle requirement 和后序 cleanup guard 约束。

### 14.8 `MountBoundaryRequirement`

```rust
/// 单个 body-free mount rule 的访问模式。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MountAccessMode {
    /// mount source 只能以只读方式暴露。
    ReadOnly,
    /// 只允许写入 isolation-owned ephemeral source，不允许宿主 source 回写。
    IsolatedEphemeralReadWrite,
}

/// 单个 mount source 与 workspace target 的 body-free rule。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MountBoundaryRule {
    /// 不含 raw path 的 mount source summary。
    source_summary: SafeSummaryRef,
    /// 不含 raw path 的 workspace target summary。
    target_summary: SafeSummaryRef,
    /// source 在 target 上的 exact access mode。
    access_mode: MountAccessMode,
}

impl MountBoundaryRule {
    /// 构造 body-free mount rule，并校验 source / target kind 与 access mode 关系。
    pub fn try_new(
        source_summary: SafeSummaryRef,
        target_summary: SafeSummaryRef,
        access_mode: MountAccessMode,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 返回 body-free mount source summary。
    pub fn source_summary(&self) -> &SafeSummaryRef;
    /// 返回 body-free workspace target summary。
    pub fn target_summary(&self) -> &SafeSummaryRef;
    /// 返回 mount access mode。
    pub fn access_mode(&self) -> MountAccessMode;
}

/// 显式 mount rule set 与传播 / host redline requirement；空 rule set 表示不挂载任何额外来源。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MountBoundaryRequirement {
    /// ordered-unique body-free mount rules；空集合表示 no-extra-mount。
    rules: Vec<MountBoundaryRule>,
    /// 是否要求 private mount propagation。
    require_private_propagation: bool,
    /// 是否禁止宿主 root mount。
    forbid_host_root_mount: bool,
    /// 是否禁止 device mount。
    forbid_device_mount: bool,
    /// 是否禁止 runtime 在 launch 后扩大 mount set。
    forbid_runtime_mount_expansion: bool,
}

impl MountBoundaryRequirement {
    /// 构造 mount requirement；`rules` 可为空，但 redline bool 必须全部成立。
    pub fn try_new(
        rules: Vec<MountBoundaryRule>,
        require_private_propagation: bool,
        forbid_host_root_mount: bool,
        forbid_device_mount: bool,
        forbid_runtime_mount_expansion: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 固定返回 Mount boundary kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回 ordered-unique mount rules。
    pub fn rules(&self) -> &[MountBoundaryRule];
    /// 返回是否要求 private propagation。
    pub fn requires_private_propagation(&self) -> bool;
    /// 返回是否禁止 host root mount。
    pub fn forbids_host_root_mount(&self) -> bool;
    /// 返回是否禁止 device mount。
    pub fn forbids_device_mount(&self) -> bool;
    /// 返回是否禁止 runtime mount expansion。
    pub fn forbids_runtime_mount_expansion(&self) -> bool;
}
```

空 `rules` 是明确的 no-extra-mount requirement，并完整承接 `BoundaryLimitKind::Mount`，不是维度缺失。非空时 mount source summary 只允许 `Work | Tool | Artifact | IsolationBackend`；target summary 必须是 `Work`，代表已验证 workspace target summary。对象不保存 raw source / target path。`IsolatedEphemeralReadWrite` 的 source 必须为 `IsolationBackend`，证明写层由 isolation backend 管理，而不是宿主 work / tool / artifact source。rule 按 `(source_kind, source_summary_ref, target_summary_ref)` 唯一；重复拒绝。四个 boundary bool 必须全部为 true，尤其 runtime 不能在 launch 后扩大 mount set。

### 14.9 `BoundaryLifecycleRequirement`

```rust
/// 隔离环境 lease 是否允许受限续约。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LeaseRenewalRequirement {
    /// 当前 boundary 禁止 lease renewal。
    Forbidden,
    /// 允许在载荷给出的单次 extension 和次数上限内续约。
    Bounded {
        /// 单次 lease renewal 允许的最大正 extension，单位 milliseconds。
        max_extension_millis: NonZeroU64,
        /// 一个 lease lifecycle 允许的最大正 renewal 次数。
        max_renewals: NonZeroU32,
    },
}

/// lease、release confirmation、cleanup guard 与 reaper 的独立 boundary dimension。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryLifecycleRequirement {
    /// 单个 lease window 的最大 duration。
    max_lease_duration_millis: NonZeroU64,
    /// lease renewal 的 forbidden / bounded requirement。
    renewal: LeaseRenewalRequirement,
    /// expiry 后进入 orphan detection 的 non-zero grace。
    orphan_detection_grace_millis: NonZeroU64,
    /// 是否要求 backend release confirmation。
    require_release_confirmation: bool,
    /// 是否要求 cleanup guard 明确允许 release。
    require_cleanup_guard: bool,
    /// 是否要求 reaper 覆盖 orphan / expiry 收束。
    require_reaper: bool,
}

impl BoundaryLifecycleRequirement {
    /// 构造 lifecycle requirement；duration、renewal 与三项安全 redline 必须成立。
    pub fn try_new(
        max_lease_duration_millis: u64,
        renewal: LeaseRenewalRequirement,
        orphan_detection_grace_millis: u64,
        require_release_confirmation: bool,
        require_cleanup_guard: bool,
        require_reaper: bool,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 固定返回 Lifecycle boundary kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回 max lease duration。
    pub fn max_lease_duration_millis(&self) -> NonZeroU64;
    /// 返回 lease renewal requirement。
    pub fn renewal(&self) -> &LeaseRenewalRequirement;
    /// 返回 orphan detection grace。
    pub fn orphan_detection_grace_millis(&self) -> NonZeroU64;
    /// 返回是否要求 release confirmation。
    pub fn requires_release_confirmation(&self) -> bool;
    /// 返回是否要求 cleanup guard。
    pub fn requires_cleanup_guard(&self) -> bool;
    /// 返回是否要求 reaper。
    pub fn requires_reaper(&self) -> bool;
}
```

`max_lease_duration_millis` 与 orphan grace 必须大于零。`Bounded` 的 extension 和 renewal count 也必须大于零，且单次 extension 不得超过 max lease duration；具体续约总预算由 Step 13 profile 给出。release confirmation、cleanup guard、reaper 三项必须为 true，配置不得关闭。该对象只定义 requirement，不创建 `LeaseRecord`、不判断 lease expiry、不执行 release 或 reaper。

### 14.10 `BoundaryGenerationBinding`

`BoundaryGenerationBinding` 解决旧材料中 profile / template / runtime / capability “同代”只靠描述、实现者无法判断 equality 的问题。builder / resolver 必须为四个外部 ref 注入同一个 canonical generation `ResourceRef` 作为 `source_version_ref`；domain 不解析 generation 字符串，只比较 core value equality。

```rust
use core_contracts::metadata::ResourceRef;

/// 把 boundary profile、limit template、runtime 与 capability generation 固定到同一代。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryGenerationBinding {
    /// profile / template / runtime / capability 共用的 canonical generation identity。
    generation_ref: ResourceRef,
    /// 已校验的 boundary profile source ref。
    boundary_profile_ref: ExternalSourceRef,
    /// 完整的 limit template source ref。
    limit_template_ref: ExternalSourceRef,
    /// 按 generation 固定的 runtime binding source ref。
    runtime_generation_ref: ExternalSourceRef,
    /// capability 探测所用的 generation source ref。
    capability_generation_ref: ExternalSourceRef,
}

impl BoundaryGenerationBinding {
    /// 构造同代绑定；四个 external ref 的 source version 必须等于 generation ref。
    pub fn try_new(
        generation_ref: ResourceRef,
        boundary_profile_ref: ExternalSourceRef,
        limit_template_ref: ExternalSourceRef,
        runtime_generation_ref: ExternalSourceRef,
        capability_generation_ref: ExternalSourceRef,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 返回 canonical generation identity。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 validated boundary profile ref。
    pub fn boundary_profile_ref(&self) -> &ExternalSourceRef;
    /// 返回 complete limit template ref。
    pub fn limit_template_ref(&self) -> &ExternalSourceRef;
    /// 返回 generation-scoped runtime ref。
    pub fn runtime_generation_ref(&self) -> &ExternalSourceRef;
    /// 返回 capability generation ref。
    pub fn capability_generation_ref(&self) -> &ExternalSourceRef;

    /// 只比较 canonical generation ref，不从 external resource ref 推断代次。
    pub fn same_generation(&self, other: &Self) -> bool;
}
```

| field | required source kind | source-version invariant | owner |
|---|---|---|---|
| `generation_ref` | core `ResourceRef` | trim 后非空；是 builder / config release 提供的 canonical generation identity | external release / builder，不是 Sandbox truth |
| `boundary_profile_ref` | `IsolationBackend` | `source_version_ref == generation_ref` | validated boundary profile summary |
| `limit_template_ref` | `IsolationBackend` | `source_version_ref == generation_ref` | validated complete limit template summary |
| `runtime_generation_ref` | `Runtime` | `source_version_ref == generation_ref` | generation-scoped runtime binding summary |
| `capability_generation_ref` | `IsolationBackend` | `source_version_ref == generation_ref` | capability probe / summary generation |

四个 ref 都只携带 body-free external identity / version / optional digest。缺 source version、source kind 错误或任一 version 不相等都返回 exact error；不得以“最新 profile”“当前 runtime”或 timestamp proximity 替代同代 equality。

### 14.11 `BoundaryRequirementSet`

```rust
/// 对一次 accepted execution context 固定十个必须共同成立的 boundary dimension。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryRequirementSet {
    /// 不可变完整 requirement set 的 typed identity。
    requirement_ref: BoundaryRequirementSetRef,
    /// 所属 accepted context ref。
    context_ref: ControlledExecutionContextRef,
    /// 所属 active environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// profile / template / runtime / capability 的同代绑定。
    generation_binding: BoundaryGenerationBinding,
    /// CPU / memory / wall-clock / IO 四维 hard limits。
    resource_limits: ResourceLimitSet,
    /// filesystem 强制边界要求。
    filesystem: FilesystemBoundaryRequirement,
    /// network 强制边界要求。
    network: NetworkBoundaryRequirement,
    /// process 强制边界要求。
    process: ProcessBoundaryRequirement,
    /// workspace 强制边界要求。
    workspace: WorkspaceBoundaryRequirement,
    /// mount 强制边界要求。
    mount: MountBoundaryRequirement,
    /// lease / cleanup / reaper 的 lifecycle 强制要求。
    lifecycle: BoundaryLifecycleRequirement,
    /// complete requirement set 创建时间。
    created_at: Timestamp,
}

impl BoundaryRequirementSet {
    /// 从 accepted context、active matching identity、同代 binding 与十维完整要求构造 immutable set。
    pub fn compose(
        requirement_ref: BoundaryRequirementSetRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        generation_binding: BoundaryGenerationBinding,
        resource_limits: ResourceLimitSet,
        filesystem: FilesystemBoundaryRequirement,
        network: NetworkBoundaryRequirement,
        process: ProcessBoundaryRequirement,
        workspace: WorkspaceBoundaryRequirement,
        mount: MountBoundaryRequirement,
        lifecycle: BoundaryLifecycleRequirement,
        created_at: Timestamp,
    ) -> Result<Self, BoundaryRequirementError>;

    /// 返回 complete requirement set identity。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 owning environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 canonical generation binding。
    pub fn generation_binding(&self) -> &BoundaryGenerationBinding;
    /// 返回四维 resource hard limits。
    pub fn resource_limits(&self) -> &ResourceLimitSet;
    /// 返回 filesystem requirement。
    pub fn filesystem(&self) -> &FilesystemBoundaryRequirement;
    /// 返回 network requirement。
    pub fn network(&self) -> &NetworkBoundaryRequirement;
    /// 返回 process requirement。
    pub fn process(&self) -> &ProcessBoundaryRequirement;
    /// 返回 workspace requirement。
    pub fn workspace(&self) -> &WorkspaceBoundaryRequirement;
    /// 返回 mount requirement。
    pub fn mount(&self) -> &MountBoundaryRequirement;
    /// 返回 lifecycle requirement。
    pub fn lifecycle(&self) -> &BoundaryLifecycleRequirement;
    /// 返回 requirement set created time。
    pub fn created_at(&self) -> &Timestamp;

    /// 固定返回十个 canonical kind，顺序与 `BoundaryLimitKind` 定义一致。
    pub fn covered_kinds(&self) -> [BoundaryLimitKind; 10];

    /// 因 exact typed fields 不可缺失，checked object 恒为 true；供 guard / audit 明示断言。
    pub fn is_complete(&self) -> bool;

    /// 判断 network requirement 是否为 DenyAll。
    pub fn requires_network_denial(&self) -> bool;
    /// 判断 filesystem / workspace / mount 组合是否需要后续 write guard。
    pub fn requires_filesystem_write_guard(&self) -> bool;

    /// 校验 capability / handle / decision 是否与本 set 使用同一 generation。
    pub fn generation_ref(&self) -> &ResourceRef;
}
```

| dimension | exact owner field | canonical kind coverage |
|---|---|---|
| CPU | `resource_limits.cpu` | `Cpu` |
| memory | `resource_limits.memory` | `Memory` |
| wall-clock | `resource_limits.wall_clock` | `WallClock` |
| IO | `resource_limits.io` | `Io` |
| filesystem | `filesystem` | `Filesystem` |
| network | `network` | `Network` |
| process | `process` | `Process` |
| workspace | `workspace` | `Workspace` |
| mount | `mount` | `Mount` |
| lifecycle | `lifecycle` | `Lifecycle` |

`compose` 的 exact checks：

1. `context.require_accepted_for_boundary()` 必须成功，且 context 有 environment identity ref。
2. `identity.require_active_for(context)` 必须成功，且 identity ref 等于 context 已登记的 ref。
3. `workspace.workspace_refs` 的每个 external source 必须在 context source refs 或 responsibility work refs 中有 `same_source()` 匹配；不能注入当前 execution 之外的 workspace。
4. resource set 必须 4/4；六个独立 requirement 的 `kind()` 必须分别为 expected kind；`covered_kinds()` 去重后必须为 10/10。
5. generation binding 必须已通过四 ref 同代校验；factory 不读取 capability body，也不接收 policy snapshot / decision。
6. `created_at` 不得早于 context opening / identity binding；具体比较使用 core `Timestamp` 的 canonical ordering helper，若当前 core export 不支持则登记 Activation blocker，不得使用字符串比较。

### 14.12 Requirement immutability 与合成 owner

`BoundaryRequirementSet` 创建后没有 mutation method。需要改变任何限额、allowlist、workspace、mount、lifecycle 或 generation 时必须创建新 requirement ref 和新 boundary establishment attempt；不得原地扩大已建立 boundary。

Step 7 application helper 必须承担以下合成规则，但不能改变 domain invariant：

| input | application 合成责任 | domain 最终门禁 |
|---|---|---|
| explicit request | 解析 typed requirement input；缺失项不得默认放宽 | exact factory 拒绝 zero / unrestricted / incomplete |
| validated boundary profile | 提供 hard defaults 与 security redline | hard bool 关闭时 factory 拒绝 |
| complete limit template | 与 explicit request 逐维取更严格值 | `ResourceLimitSet` 必须 4/4 |
| generation-scoped runtime | 提供 runtime generation external ref | source version 必须等于 canonical generation |
| backend capability | 只在 requirement 创建后验证 | 不作为 compose 输入，不可反向降低 requirement |
| policy | 后序消费 requirement / boundary | 严禁作为 compose 输入 |

因此 `BoundaryRequirementSet` 是“本次必须落实什么”的唯一 truth；`BackendCapabilitySummary` 只回答“给定 backend 是否能逐项证明落实”，两者不可合并。

## 15. Backend capability exact contract

### 15.1 Capability verdict support

```rust
/// backend 对一项 exact boundary requirement 的有限评估结果。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum BoundaryCapabilityVerdictKind {
    /// adapter 能给出 body-free proof summary，证明 exact requirement 可强制落实。
    Supported,
    /// backend 明确不能落实 exact requirement。
    Unsupported,
    /// 当前信息不足以证明支持或不支持；必须 pending / fail-closed。
    Unknown,
}

/// 一个 boundary kind 对 exact requirement 的 checked capability verdict。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryCapabilityVerdict {
    /// 本 verdict 唯一评估的 boundary limit kind。
    kind: BoundaryLimitKind,
    /// adapter 对该 exact requirement 给出的有限结论。
    verdict_kind: BoundaryCapabilityVerdictKind,
    /// `Supported | Unsupported` 必有的 body-free backend proof summary。
    verification_summary: Option<SafeSummaryRef>,
    /// `Unsupported | Unknown` 必有的 caller-safe 原因。
    reason: Option<SandboxReason>,
}

impl BoundaryCapabilityVerdict {
    /// 构造支持结论；proof summary 必须来自 isolation backend。
    pub fn supported(
        kind: BoundaryLimitKind,
        verification_summary: SafeSummaryRef,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 构造明确不支持结论；必须携带安全原因和 backend proof summary。
    pub fn unsupported(
        kind: BoundaryLimitKind,
        verification_summary: SafeSummaryRef,
        reason: SandboxReason,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 构造不可验证结论；不得伪造 proof summary。
    pub fn unknown(
        kind: BoundaryLimitKind,
        reason: SandboxReason,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 返回本 verdict 覆盖的 boundary limit kind。
    pub fn kind(&self) -> BoundaryLimitKind;
    /// 返回有限 capability verdict 类别。
    pub fn verdict_kind(&self) -> BoundaryCapabilityVerdictKind;
    /// 返回 body-free backend proof summary；`Unknown` 必须为 `None`。
    pub fn verification_summary(&self) -> Option<&SafeSummaryRef>;
    /// 返回不支持或不可验证时的 caller-safe 原因。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 判断该 exact requirement 是否已获得 `Supported` 结论。
    pub fn is_supported(&self) -> bool;
}

/// 逐项覆盖十个 `BoundaryLimitKind` 的 ordered capability verdict set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryCapabilityVerdictSet {
    /// CPU hard limit 的 exact capability verdict。
    cpu: BoundaryCapabilityVerdict,
    /// memory hard limit 的 exact capability verdict。
    memory: BoundaryCapabilityVerdict,
    /// wall-clock hard limit 的 exact capability verdict。
    wall_clock: BoundaryCapabilityVerdict,
    /// IO hard limit 的 exact capability verdict。
    io: BoundaryCapabilityVerdict,
    /// filesystem boundary 的 exact capability verdict。
    filesystem: BoundaryCapabilityVerdict,
    /// network boundary 的 exact capability verdict。
    network: BoundaryCapabilityVerdict,
    /// process boundary 的 exact capability verdict。
    process: BoundaryCapabilityVerdict,
    /// workspace boundary 的 exact capability verdict。
    workspace: BoundaryCapabilityVerdict,
    /// mount boundary 的 exact capability verdict。
    mount: BoundaryCapabilityVerdict,
    /// lifecycle boundary 的 exact capability verdict。
    lifecycle: BoundaryCapabilityVerdict,
}

impl BoundaryCapabilityVerdictSet {
    /// 从任意输入顺序构造 10/10 set；缺失、重复均拒绝。
    pub fn try_complete(
        verdicts: Vec<BoundaryCapabilityVerdict>,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 按 canonical kind 返回唯一 verdict；complete set 不存在缺失分支。
    pub fn get(
        &self,
        kind: BoundaryLimitKind,
    ) -> &BoundaryCapabilityVerdict;
    /// 按 `BoundaryLimitKind` canonical 顺序返回十项只读 verdict。
    pub fn as_ordered_array(&self) -> [&BoundaryCapabilityVerdict; 10];
    /// 判断十项 verdict 是否全部为 `Supported`。
    pub fn all_supported(&self) -> bool;
    /// 判断集合中是否至少存在一个明确 `Unsupported` verdict。
    pub fn contains_unsupported(&self) -> bool;
    /// 判断集合中是否至少存在一个 `Unknown` verdict。
    pub fn contains_unknown(&self) -> bool;

    /// 返回所有非 supported kind，顺序与 `BoundaryLimitKind` 一致。
    pub fn unsupported_or_unknown_kinds(&self) -> Vec<BoundaryLimitKind>;
}
```

`verification_summary` 只证明 adapter 已对该 summary 绑定的 exact requirement 做出评估，不保存 cgroup、namespace、mount path、network rule、SDK response 或 host identity。`Supported` / `Unsupported` summary 的 `source_kind` 必须是 `IsolationBackend`；`Unknown` 不允许携带 summary，避免把未知 probe 冒充 proof。

### 15.2 `BackendCapabilitySummaryError`

```rust
/// capability snapshot 的 proof、coverage、generation 或 status 关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BackendCapabilitySummaryError {
    /// backend ref 的 source kind 不是 `IsolationBackend`；载荷给出实际 kind。
    BackendSourceKindInvalid {
        /// backend ref 实际携带的 source kind。
        actual: ExternalSourceKind,
    },
    /// 某项 proof summary 不是 isolation backend 摘要；载荷定位 kind 与实际来源。
    VerificationSummarySourceKindInvalid {
        /// proof summary 正在评估的 boundary limit kind。
        kind: BoundaryLimitKind,
        /// proof summary 实际携带的 source kind。
        actual: ExternalSourceKind,
    },
    /// complete verdict set 缺少载荷指定的 boundary limit kind。
    MissingCapabilityVerdict {
        /// 未被 verdict set 覆盖的 kind。
        kind: BoundaryLimitKind,
    },
    /// complete verdict set 重复包含载荷指定的 boundary limit kind。
    DuplicateCapabilityVerdict {
        /// 出现重复 verdict 的 kind。
        kind: BoundaryLimitKind,
    },
    /// `Supported` verdict 没有 isolation backend proof summary。
    SupportedVerdictMissingProof {
        /// 缺少 proof summary 的 supported kind。
        kind: BoundaryLimitKind,
    },
    /// `Supported` verdict 错误携带 failure reason。
    SupportedVerdictHadReason {
        /// 错误携带 reason 的 supported kind。
        kind: BoundaryLimitKind,
    },
    /// `Unsupported` verdict 没有 isolation backend proof summary。
    UnsupportedVerdictMissingProof {
        /// 缺少 proof summary 的 unsupported kind。
        kind: BoundaryLimitKind,
    },
    /// `Unsupported` verdict 没有 caller-safe reason。
    UnsupportedVerdictMissingReason {
        /// 缺少 reason 的 unsupported kind。
        kind: BoundaryLimitKind,
    },
    /// `Unknown` verdict 错误携带 proof summary，可能把未知结果冒充证明。
    UnknownVerdictHadProof {
        /// 错误携带 proof summary 的 unknown kind。
        kind: BoundaryLimitKind,
    },
    /// `Unknown` verdict 没有 caller-safe reason。
    UnknownVerdictMissingReason {
        /// 缺少 reason 的 unknown kind。
        kind: BoundaryLimitKind,
    },
    /// capability snapshot 评估的 requirement ref 与调用方要求不一致。
    CapabilityRequirementMismatch {
        /// 调用方要求匹配的 immutable requirement ref。
        expected: BoundaryRequirementSetRef,
        /// capability snapshot 实际评估的 requirement ref。
        actual: BoundaryRequirementSetRef,
    },
    /// backend、requirement 与 capability snapshot 未绑定同一 generation。
    CapabilityGenerationMismatch,
    /// capability status 与十项 verdict 的组合不一致。
    CapabilityStatusVerdictMismatch {
        /// 与 verdict 组合冲突的 canonical capability status。
        status: BackendCapabilitySummaryStatus,
    },
    /// observed time 不满足 canonical timestamp contract。
    CapabilityTimestampInvalid,
    /// `Fresh` capability snapshot 的 freshness window 为零。
    ZeroFreshnessWindow,
}
```

### 15.3 `BackendCapabilitySummary`

```rust
/// 某一 backend generation 对某一个 immutable boundary requirement set 的 body-free capability snapshot。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendCapabilitySummary {
    /// 本 immutable capability snapshot 的 typed identity。
    capability_ref: BackendCapabilitySummaryRef,
    /// 提供十维 capability 证明的 isolation backend source。
    backend_ref: ExternalSourceRef,
    /// 本 snapshot 唯一评估的 immutable requirement set ref。
    assessed_requirement_ref: BoundaryRequirementSetRef,
    /// requirement、backend source version 与 snapshot 共用的 generation。
    generation_ref: ResourceRef,
    /// 对十个 boundary limit kind 的 complete ordered verdict set。
    verdicts: BoundaryCapabilityVerdictSet,
    /// 从 verdict 与 freshness 关系唯一得出的 canonical status。
    capability_status: BackendCapabilitySummaryStatus,
    /// 非 `Fresh` 状态必有的 caller-safe 原因。
    status_reason: Option<SandboxReason>,
    /// application clock 提供的 backend observation time。
    observed_at: Timestamp,
    /// `Fresh` 状态必有的正 freshness window；其他状态必须为空，单位 milliseconds。
    freshness_window_millis: Option<NonZeroU64>,
}

impl BackendCapabilitySummary {
    /// 构造十维全部 supported 且具有正 freshness window 的 snapshot。
    pub fn fresh(
        capability_ref: BackendCapabilitySummaryRef,
        backend_ref: ExternalSourceRef,
        requirements: &BoundaryRequirementSet,
        verdicts: BoundaryCapabilityVerdictSet,
        observed_at: Timestamp,
        freshness_window_millis: u64,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 构造已过 freshness window 的 immutable snapshot；不得继续 establish。
    pub fn stale(
        capability_ref: BackendCapabilitySummaryRef,
        backend_ref: ExternalSourceRef,
        requirements: &BoundaryRequirementSet,
        verdicts: BoundaryCapabilityVerdictSet,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 构造至少一个 kind 不可验证且没有明确 unsupported 的 snapshot。
    pub fn unknown(
        capability_ref: BackendCapabilitySummaryRef,
        backend_ref: ExternalSourceRef,
        requirements: &BoundaryRequirementSet,
        verdicts: BoundaryCapabilityVerdictSet,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 构造至少一个 exact requirement 明确不受支持的 snapshot。
    pub fn unsupported(
        capability_ref: BackendCapabilitySummaryRef,
        backend_ref: ExternalSourceRef,
        requirements: &BoundaryRequirementSet,
        verdicts: BoundaryCapabilityVerdictSet,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, BackendCapabilitySummaryError>;

    /// 返回 immutable capability snapshot identity。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回提供 capability 证明的 isolation backend source ref。
    pub fn backend_ref(&self) -> &ExternalSourceRef;
    /// 返回本 snapshot 唯一评估的 requirement set ref。
    pub fn assessed_requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 snapshot 绑定的 canonical backend generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回十维 complete capability verdict set。
    pub fn verdicts(&self) -> &BoundaryCapabilityVerdictSet;
    /// 返回 canonical capability snapshot status。
    pub fn capability_status(&self) -> BackendCapabilitySummaryStatus;
    /// 返回非 `Fresh` 状态的 caller-safe 原因。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回 backend capability observation time。
    pub fn observed_at(&self) -> &Timestamp;
    /// 返回正 freshness window；仅 `Fresh` 状态存在，单位 milliseconds。
    pub fn freshness_window_millis(&self) -> Option<NonZeroU64>;

    /// 只在 `Fresh`、checked age 未到 window、requirement / generation 相等且 10/10 supported 时返回 true。
    pub fn supports_at_age(
        &self,
        requirements: &BoundaryRequirementSet,
        checked_age_millis: u64,
    ) -> bool;

    /// 判断 snapshot 是否因 stale、unknown 或 checked age 到期而要求创建新 snapshot。
    pub fn requires_refresh_at_age(&self, checked_age_millis: u64) -> bool;
    /// 判断当前 status / verdict / checked age 是否禁止 boundary establishment。
    pub fn must_fail_closed_at_age(&self, checked_age_millis: u64) -> bool;
}
```

| factory | verdict relation | status reason | `freshness_window_millis` |
|---|---|---|---|
| `fresh` | 10/10 `Supported` | `None` | `Some(non-zero)` |
| `stale` | complete set，可含任意 verdict | `Some` | `None` |
| `unknown` | 至少一个 `Unknown`，不得含 `Unsupported` | `Some` | `None` |
| `unsupported` | 至少一个 `Unsupported` | `Some` | `None` |

| field | exact source | invariant |
|---|---|---|
| `observed_at` | Step 7 clock port 在 adapter capability mapping 完成时给出的 canonical timestamp | 不从 backend response string 直接复制；domain 不作字符串排序。 |
| `freshness_window_millis` | validated boundary capability freshness profile；若 request 提供更短 hard window则取更严格值 | 仅 `Fresh` 为 `Some(non-zero)`；不能使用 adapter default、backend product default 或 free-form duration。 |
| `checked_age_millis`（decision input） | Step 7 clock port 对 `evaluated_at - observed_at` 的 checked elapsed result | 不存入 summary；与 `evaluated_at` 成对进入 guard decision。 |

所有 factory 要求 `backend_ref.source_kind == IsolationBackend`，且其 `source_version_ref` 等于 requirements generation。`Fresh` 的有效性由 `checked_age_millis < freshness_window_millis` 判定；equality 已到期。`requires_refresh_at_age` 对 `Fresh` 到期、`Stale` 和 `Unknown` 返回 true，对同代明确 `Unsupported` 返回 false；generation 变化必须创建另一 snapshot。`must_fail_closed_at_age` 只有 fresh、window 内、10/10 supported 时为 false。snapshot 不提供 `mark_fresh` / `mark_stale` mutation；refresh job 创建新 capability ref。backend port unavailable 且没有合法 snapshot 时由 application / infra error 承接，不伪造 `Unknown` summary；只有 adapter 能形成十维 complete verdict 时才可创建 summary。

## 16. Lease window 与 isolation handle contract

### 16.1 Temporal comparison gate

2026-07-18 读取 `/home/aris/Projects/quantalithos-core/crates/contracts/src/metadata.rs` 后确认：当前可检索 `Timestamp` 是 string newtype，并派生 `Ord`；core 没有定义规范化 timestamp parser、instant arithmetic 或安全 ordering helper。Sandbox 设计因此固定以下规则：

| rule | 结论 |
|---|---|
| timestamp storage | 所有发生时间仍复用 core `Timestamp`，不重新引入 `SandboxInstant`。 |
| ordering | 禁止直接使用当前 string-derived `Ord`、字符串字典序、数据库 locale 或未声明格式比较。 |
| duration | lease、freshness 与 timeout 的预算使用单位明确的 non-zero milliseconds。 |
| elapsed evaluation | Step 7 clock port 必须根据固定 canonical timestamp contract 返回 `(evaluated_at, checked_elapsed_millis)`；domain 只比较整数 duration，不能接受 caller 计算的裸 freshness bool。 |
| persisted expiry | Step 11 可以保存由同一 clock implementation 计算的 physical `expires_at` 索引列，但必须可由 domain `starts_at + duration` 重算验证，不成为第二 truth。 |
| activation | exact core revision、timestamp canonical format / parser / arithmetic compatibility 是既有 `BLK-SBX-VERSION-001` 的关闭子条件；未关闭前受影响 boundary 不得 Activation。 |

这不是新的 L1 / L2 semantic blocker，也不阻塞对象 contract 设计完成；它会阻塞真实 lease、freshness 和 transition time implementation。本文不声称 parser、fixture 或测试已存在。

### 16.2 `LeaseWindow`

```rust
/// lease 在 canonical start timestamp 后的有界 duration 与 renewal cutoff。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LeaseWindow {
    /// backend environment creation acknowledgement 后的 canonical lease start time。
    starts_at: Timestamp,
    /// 从 start time 起计算的正 lease duration，单位 milliseconds。
    duration_millis: NonZeroU64,
    /// 可选续约截止偏移，必须严格小于 lease duration，单位 milliseconds。
    renewal_deadline_offset_millis: Option<NonZeroU64>,
}

/// 基于 checked elapsed milliseconds 得出的 lease window 位置，不是 persisted `LeaseRecordStatus`。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum LeaseWindowPosition {
    /// 尚未超过 renewal cutoff；若 lifecycle requirement 允许，可申请受限续约。
    Renewable,
    /// 已超过 renewal cutoff，但 lease duration 尚未结束。
    RenewalClosed,
    /// elapsed 大于或等于 duration，必须进入 lease / orphan / cleanup 路径。
    Expired,
}

impl LeaseWindow {
    /// 从 clock start 与 lifecycle profile 的正 duration 构造 window。
    pub fn try_new(
        starts_at: Timestamp,
        duration_millis: u64,
        renewal_deadline_offset_millis: Option<u64>,
    ) -> Result<Self, LeaseWindowError>;

    /// 返回 canonical lease start time；caller 不得直接按字符串比较。
    pub fn starts_at(&self) -> &Timestamp;
    /// 返回正 lease duration，单位 milliseconds。
    pub fn duration_millis(&self) -> NonZeroU64;
    /// 返回可选续约截止偏移，单位 milliseconds。
    pub fn renewal_deadline_offset_millis(&self) -> Option<NonZeroU64>;

    /// 只消费 clock port 已校验的 elapsed milliseconds，不解析 timestamp 字符串。
    pub fn position_at_elapsed(
        &self,
        elapsed_millis: u64,
    ) -> LeaseWindowPosition;

    /// 校验 window 不超过指定 boundary lifecycle requirement，并返回可落码的 exact error。
    pub fn validate_against(
        &self,
        requirement: &BoundaryLifecycleRequirement,
    ) -> Result<(), LeaseWindowError>;
}

/// lease window 的 duration / renewal relation 不合法。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LeaseWindowError {
    /// lease start timestamp 在 contract boundary trim 后为空。
    EmptyStartTimestamp,
    /// lease duration 为零，无法形成有界 window。
    ZeroDuration,
    /// 已声明 renewal cutoff，但其 offset 为零。
    ZeroRenewalDeadlineOffset,
    /// renewal cutoff 不早于 lease expiry，无法形成受限续约窗口。
    RenewalDeadlineNotBeforeExpiry,
    /// lifecycle requirement 禁止续约，但 window 错误携带 renewal cutoff。
    RenewalForbiddenButDeadlinePresent,
    /// lifecycle requirement 允许 bounded renewal，但 window 缺少 renewal cutoff。
    BoundedRenewalDeadlineMissing,
    /// lease duration 超过 owning boundary lifecycle requirement 的 hard maximum。
    ExceedsLifecycleRequirement {
        /// 当前 window 请求的正 duration，单位 milliseconds。
        duration_millis: NonZeroU64,
        /// lifecycle requirement 允许的正最大 duration，单位 milliseconds。
        max_duration_millis: NonZeroU64,
    },
}
```

| field | exact source | invariant |
|---|---|---|
| `starts_at` | application clock 在 backend environment creation acknowledgement 后给出的 canonical timestamp | trim 后非空；不使用 lexicographic ordering。 |
| `duration_millis` | `BoundaryLifecycleRequirement.max_lease_duration_millis` 与 adapter supported lease budget 取更严格值 | 大于零；不得超过 lifecycle requirement。 |
| `renewal_deadline_offset_millis` | lifecycle renewal profile | `Forbidden => None`；`Bounded => Some` 且严格小于 duration。 |

`LeaseWindow::try_new` 只负责 window 自身的正值和 cutoff 关系；`LeaseWindow::validate_against` 同时校验 window duration 不超过 lifecycle maximum，且 `Forbidden <=> cutoff None`、`Bounded <=> cutoff Some`。具体位置判定必须按以下 closed branch 实现：

| condition | result |
|---|---|
| `elapsed_millis >= duration_millis` | `Expired` |
| elapsed 未到期且 cutoff 为 `None` | `RenewalClosed` |
| elapsed 未到期且 `elapsed_millis < cutoff` | `Renewable` |
| elapsed 未到期且 `elapsed_millis >= cutoff` | `RenewalClosed` |

因此 cutoff equality 已进入 `RenewalClosed`，expiry equality 已进入 `Expired`。`LeaseWindowPosition` 不能直接写入 `LeaseRecord.lease_status` 而绕过其 transition。`6R-04` 的 `LeaseRecord` 必须接收 checked elapsed value、调用 `position_at_elapsed`，再通过自有 exact transition 进入 expiring / expired。

### 16.3 Backend handle descriptor 与 lifecycle observation

```rust
/// adapter 从 raw backend response 映射出的 body-free environment descriptor。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationEnvironmentDescriptor {
    /// adapter 提供的稳定 opaque backend environment identity；只允许 isolation backend source。
    backend_handle_ref: ExternalSourceRef,
    /// 不含 SDK response、host identity、path 或 credential 的 lifecycle summary。
    lifecycle_summary: SafeSummaryRef,
    /// backend handle source version 必须匹配的 canonical generation。
    generation_ref: ResourceRef,
}

impl IsolationEnvironmentDescriptor {
    /// 两个 carrier 都必须来自同一 isolation backend generation。
    pub fn try_new(
        backend_handle_ref: ExternalSourceRef,
        lifecycle_summary: SafeSummaryRef,
        generation_ref: &ResourceRef,
    ) -> Result<Self, IsolationEnvironmentHandleError>;

    /// 返回稳定 opaque backend environment source ref。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回 body-free lifecycle summary ref。
    pub fn lifecycle_summary(&self) -> &SafeSummaryRef;
    /// 返回 descriptor 绑定的 canonical backend generation。
    pub fn generation_ref(&self) -> &ResourceRef;
}

/// backend 对指定 isolation environment 当前 lifecycle 的有限观察类别。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum IsolationEnvironmentLifecycleObservationKind {
    /// backend 明确观察到环境仍存在。
    ObservedPresent,
    /// backend 明确确认环境已释放。
    ReleaseConfirmed,
    /// lifecycle source 当前不可用，不能证明环境已释放。
    Unavailable,
    /// backend observation 与 Sandbox handle / lease 关系冲突。
    Conflicted,
}

/// adapter 从 raw lifecycle response 映射出的 body-free checked observation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationEnvironmentLifecycleObservation {
    /// 本 observation 唯一对应的 stable backend environment source ref。
    backend_handle_ref: ExternalSourceRef,
    /// 不含 backend response body 的 lifecycle observation summary。
    observation_summary: SafeSummaryRef,
    /// backend handle source version 与 owning handle 必须匹配的 generation。
    generation_ref: ResourceRef,
    /// adapter 映射出的有限 lifecycle observation 类别。
    observation_kind: IsolationEnvironmentLifecycleObservationKind,
    /// 除 `ReleaseConfirmed` 外各 observation 必有的 caller-safe 原因。
    reason: Option<SandboxReason>,
    /// application clock 提供的 observation time。
    observed_at: Timestamp,
}

impl IsolationEnvironmentLifecycleObservation {
    /// 构造与指定 handle / generation 同源的 lifecycle observation。
    pub fn try_new(
        backend_handle_ref: ExternalSourceRef,
        observation_summary: SafeSummaryRef,
        observation_kind: IsolationEnvironmentLifecycleObservationKind,
        reason: Option<SandboxReason>,
        generation_ref: &ResourceRef,
        observed_at: Timestamp,
    ) -> Result<Self, IsolationEnvironmentHandleError>;

    /// 返回 observation 对应的 backend handle ref。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回不含 backend response body 的 summary ref。
    pub fn observation_summary(&self) -> &SafeSummaryRef;
    /// 返回有限 lifecycle observation 类别。
    pub fn observation_kind(&self) -> IsolationEnvironmentLifecycleObservationKind;
    /// 返回 observation 绑定的 canonical backend generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 caller-safe observation reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回 adapter observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

descriptor / observation 允许保存 backend 提供的稳定 opaque handle identity，但不允许 raw SDK response、container / pod / host body、credential、socket、path 或 lifecycle object。所有 backend / summary carrier 的 source kind 必须是 `IsolationBackend`；`backend_handle_ref.source_version_ref` 与显式 `generation_ref` 必须都等于 requirement generation。summary carrier 本身没有 version 字段，因此不能用 summary ref 或 digest 代替 generation equality。`ReleaseConfirmed` 的 reason 必须为 `None`；`ObservedPresent | Unavailable | Conflicted` 必须有 safe reason。

### 16.4 `IsolationEnvironmentHandle`

```rust
/// Sandbox 对一个 backend isolation environment 的 typed lifecycle handle truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationEnvironmentHandle {
    /// Sandbox 本地 isolation environment lifecycle identity。
    isolation_handle_ref: IsolationEnvironmentHandleRef,
    /// adapter 提供的 stable opaque backend environment source ref。
    backend_handle_ref: ExternalSourceRef,
    /// 所属 controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// 与 context 一致且处于 active lineage 的 environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// backend environment 必须落实的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 创建该 backend environment 时使用的 fresh capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// 预生成且与 handle 原子关联的 coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// requirement、capability、descriptor 与 handle 共用的 generation。
    generation_ref: ResourceRef,
    /// 本 handle 唯一关联的 lease truth ref；canonical record 在 `6R-04`。
    lease_ref: LeaseRecordRef,
    /// 创建 handle 时已按 lifecycle requirement 校验的 immutable lease window。
    lease_window: LeaseWindow,
    /// 本 handle 的 canonical lifecycle status。
    handle_status: IsolationEnvironmentHandleStatus,
    /// 仅 `OrphanSuspected` 状态必有的 lifecycle observation safe reason。
    status_reason: Option<SandboxReason>,
    /// 最近一次已校验 lifecycle observation 的 body-free summary ref。
    latest_lifecycle_observation: Option<SafeSummaryRef>,
    /// backend descriptor 首次映射为本地 handle 的 canonical time。
    created_at: Timestamp,
    /// 当前 status 生效时间，必须单调不回退。
    status_changed_at: Timestamp,
    /// 最近一次 handle transition 对应的 audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl IsolationEnvironmentHandle {
    /// 从 adapter body-free descriptor 创建 `Created` handle；boundary / lease refs 均预生成。
    pub fn create(
        isolation_handle_ref: IsolationEnvironmentHandleRef,
        boundary_ref: CoherentBoundaryRef,
        lease_ref: LeaseRecordRef,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        capability_decision: &BackendCapabilityDecision,
        descriptor: IsolationEnvironmentDescriptor,
        lease_window: LeaseWindow,
        audit_trace_ref: SandboxAuditTraceRef,
        created_at: Timestamp,
    ) -> Result<Self, IsolationEnvironmentHandleError>;

    /// 在同一 boundary transaction 中由 established boundary 激活 handle。
    pub fn activate(
        &mut self,
        boundary: &CoherentBoundary,
        audit_trace_ref: SandboxAuditTraceRef,
        activated_at: Timestamp,
    ) -> Result<(), IsolationEnvironmentHandleError>;

    /// cleanup guard 允许后进入 release pending；guard contract 在 `6R-04` 唯一展开。
    pub fn mark_release_pending(
        &mut self,
        cleanup_guard: &CleanupGuard,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), IsolationEnvironmentHandleError>;

    /// 只接受同 backend / handle / generation 的 body-free release confirmation。
    pub fn mark_released(
        &mut self,
        release_observation: IsolationEnvironmentLifecycleObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        released_at: Timestamp,
    ) -> Result<(), IsolationEnvironmentHandleError>;

    /// lease / backend lifecycle 不一致时进入 orphan-suspected 终止 launch 状态。
    pub fn suspect_orphan(
        &mut self,
        lease: &LeaseRecord,
        lifecycle_observation: IsolationEnvironmentLifecycleObservation,
        audit_trace_ref: SandboxAuditTraceRef,
        suspected_at: Timestamp,
    ) -> Result<(), IsolationEnvironmentHandleError>;

    /// 返回 Sandbox 本地 isolation handle identity。
    pub fn isolation_handle_ref(&self) -> &IsolationEnvironmentHandleRef;
    /// 返回 stable opaque backend environment source ref。
    pub fn backend_handle_ref(&self) -> &ExternalSourceRef;
    /// 返回 owning controlled execution context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 handle 绑定的 execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 backend environment 应落实的 immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回创建环境时使用的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回与 handle 原子关联的 coherent boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 handle 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回唯一关联的 lease record ref。
    pub fn lease_ref(&self) -> &LeaseRecordRef;
    /// 返回已按 lifecycle requirement 校验的 immutable lease window。
    pub fn lease_window(&self) -> &LeaseWindow;
    /// 返回 canonical isolation handle lifecycle status。
    pub fn handle_status(&self) -> IsolationEnvironmentHandleStatus;
    /// 返回 orphan suspicion 的 caller-safe observation 原因；其他 status 为 `None`。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回最近一次 checked lifecycle observation summary ref。
    pub fn latest_lifecycle_observation(&self) -> Option<&SafeSummaryRef>;
    /// 返回本地 handle 创建时间。
    pub fn created_at(&self) -> &Timestamp;
    /// 返回当前 status 生效时间。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近一次 transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 判断 `Created` handle 是否只与载荷指定的预生成 boundary ref 匹配。
    pub fn can_activate_boundary(&self, boundary_ref: &CoherentBoundaryRef) -> bool;
    /// 判断 active handle 与 established boundary 的 refs / generation 是否足以支持后序 launch guard。
    pub fn can_support_launch(&self, boundary: &CoherentBoundary) -> bool;
}
```

exact lifecycle：

| method | from | to | hard prerequisites |
|---|---|---|---|
| `create` | factory | `Created` | accepted context、active identity、matching requirement、fresh 10/10 capability、matching `Supported` capability decision、descriptor generation、lease window satisfied |
| `activate` | `Created` | `Active` | boundary `Established`；boundary / requirement / capability / handle / generation refs 全相等 |
| `mark_release_pending` | `Created | Active | OrphanSuspected` | `ReleasePending` | cleanup guard 对该 context / handle / lease 明确 `Allowed`；不得只传 guard ref |
| `mark_released` | `ReleasePending` | `Released` | observation `ReleaseConfirmed`，且 backend handle / generation 与 owning handle 相等 |
| `suspect_orphan` | `Created | Active | ReleasePending` | `OrphanSuspected` | `LeaseRecord::supports_orphan_suspicion_for(handle_ref)` 为 true；observation 为 `ObservedPresent | Unavailable | Conflicted` |

`Released` 是终态，不能复活。`OrphanSuspected` 不能回到 `Active`，只能经 cleanup guard 进入 release pending。adapter establish failure但返回 partial stable handle 时仍可用 `create` 保存 `Created` handle并由 failed boundary decision触发 cleanup；它绝不能 `activate`。

| handle status | `status_reason` | `latest_lifecycle_observation` |
|---|---|---|
| `Created` | `None` | `Some(descriptor.lifecycle_summary)` |
| `Active` | `None` | 保留上一项 |
| `ReleasePending` | `None` | 保留上一项；cleanup guard 不被转换为 reason |
| `Released` | `None` | `Some(release_observation.observation_summary)`；release confirmation 本身无 failure reason |
| `OrphanSuspected` | `Some(observation.reason)` | `Some(observation.observation_summary)` |

`create` 必须逐项比较 capability decision 的 requirement ref、capability ref、decision kind 与 summary 的 `supports_at_age(requirements, decision.checked_age_millis())`；不得只检查 persisted `Fresh` status。status reason 不从 guard ref、audit text 或 backend raw message派生。

### 16.5 `IsolationEnvironmentHandleError`

```rust
/// isolation handle 的 descriptor、关系、generation 或 lifecycle 不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IsolationEnvironmentHandleError {
    /// backend handle ref 不是 isolation backend source；载荷给出实际 kind。
    BackendHandleSourceKindInvalid {
        /// backend handle ref 实际携带的 source kind。
        actual: ExternalSourceKind,
    },
    /// descriptor / observation summary 不是 isolation backend summary。
    LifecycleSummarySourceKindInvalid {
        /// lifecycle summary 实际携带的 source kind。
        actual: ExternalSourceKind,
    },
    /// backend handle source version 不等于显式 canonical generation。
    BackendHandleGenerationMismatch,
    /// descriptor 或 observation 的显式 generation 与 owning relation 不一致。
    LifecycleDescriptorGenerationMismatch,
    /// context 与 execution environment identity 不属于同一 accepted context lineage。
    ContextIdentityMismatch,
    /// requirement set 不属于目标 controlled execution context。
    RequirementContextMismatch,
    /// requirement set 不属于目标 execution environment identity。
    RequirementIdentityMismatch,
    /// capability snapshot 评估的 requirement 与 handle 输入不一致。
    CapabilityRequirementMismatch,
    /// capability guard decision 评估的 requirement 与 handle 输入不一致。
    CapabilityDecisionRequirementMismatch,
    /// capability guard decision 评估的 snapshot 与 handle 输入不一致。
    CapabilityDecisionSummaryMismatch,
    /// handle creation 收到的 capability guard decision 不是 `Supported`。
    CapabilityDecisionWasNotSupported {
        /// capability guard decision 实际有限处置类别。
        actual: BackendCapabilityDecisionKind,
    },
    /// capability snapshot 不是可用于创建 handle 的 `Fresh` 状态。
    CapabilityWasNotFresh {
        /// capability snapshot 实际 canonical status。
        actual: BackendCapabilitySummaryStatus,
    },
    /// capability verdict set 未逐项支持十维 exact requirements。
    CapabilityDidNotSupportAllRequirements,
    /// capability、requirement、descriptor 与 handle generation 不一致。
    CapabilityGenerationMismatch,
    /// lease window 自身或其 lifecycle requirement relation 校验失败。
    LeaseWindowInvalid {
        /// 保留 exact lease window failure，不折叠为泛化 validation message。
        source: LeaseWindowError,
    },
    /// handle 或 transition 输入引用了另一 coherent boundary。
    BoundaryRefMismatch {
        /// handle 创建时预绑定的 boundary ref。
        expected: CoherentBoundaryRef,
        /// transition 实际收到的 boundary ref。
        actual: CoherentBoundaryRef,
    },
    /// activation 输入 boundary 未处于 `Established`。
    BoundaryWasNotEstablished {
        /// 未满足 activation 前提的 boundary ref。
        boundary_ref: CoherentBoundaryRef,
        /// boundary 实际 canonical status。
        actual: CoherentBoundaryStatus,
    },
    /// cleanup guard 没有对 context / boundary / handle / lease 关系明确允许 release。
    CleanupGuardDidNotAllowRelease,
    /// cleanup guard 评估的 handle relation 与目标 handle 不一致。
    CleanupGuardHandleMismatch,
    /// release confirmation 的 backend source kind 不是 `IsolationBackend`。
    ReleaseConfirmationSourceKindInvalid {
        /// release observation 实际携带的 source kind。
        actual: ExternalSourceKind,
    },
    /// release observation 指向另一 backend environment source。
    ReleaseConfirmationSourceMismatch,
    /// lifecycle observation generation 与 owning handle generation 不一致。
    LifecycleObservationGenerationMismatch,
    /// transition 收到的 lifecycle observation kind 不满足该 transition 前提。
    LifecycleObservationKindMismatch {
        /// transition 实际收到的 finite observation kind。
        actual: IsolationEnvironmentLifecycleObservationKind,
    },
    /// observation kind 与 `Option<SandboxReason>` 有无关系不一致。
    LifecycleObservationReasonMismatch {
        /// reason 关系不合法的 finite observation kind。
        actual: IsolationEnvironmentLifecycleObservationKind,
    },
    /// owning lease 尚不能证明存在 orphan suspicion 前提。
    LeaseDidNotSupportOrphanSuspicion,
    /// orphan / release 输入 lease ref 与 handle 预绑定 ref 不一致。
    LeaseRefMismatch {
        /// handle 预绑定的 lease record ref。
        expected: LeaseRecordRef,
        /// transition 实际收到的 lease record ref。
        actual: LeaseRecordRef,
    },
    /// 请求的 handle lifecycle transition 不在 closed transition graph 中。
    HandleTransitionNotAllowed {
        /// 拒绝 transition 的 isolation handle identity。
        handle_ref: IsolationEnvironmentHandleRef,
        /// transition 前实际 canonical status。
        from: IsolationEnvironmentHandleStatus,
        /// caller 请求进入的目标 status。
        to: IsolationEnvironmentHandleStatus,
    },
    /// status change time 早于当前 status 生效时间或不满足 canonical time contract。
    StatusTimestampMovedBackwards {
        /// 时间关系校验失败的 isolation handle identity。
        handle_ref: IsolationEnvironmentHandleRef,
    },
}
```

`CleanupGuard` 与以下 exact forward methods 在 `6R-04` 定义；它们的返回值必须是已绑定对象关系的 checked decision / permission，不得由 caller 传 bool、guard ref、configuration 或 operator flag 替代：

| owner | exact method | 本批 consumer | 最小关系输入 | 结果用途 |
|---|---|---|---|---|
| `LeaseRecord` | `supports_orphan_suspicion_for(handle_ref: &IsolationEnvironmentHandleRef) -> bool` | `IsolationEnvironmentHandle::suspect_orphan` | lease 与 handle ref / context / generation | 只决定是否可建立 orphan suspicion，不证明 backend 已释放。 |
| `FailureClassification` | `blocks_boundary_for(boundary_ref: &CoherentBoundaryRef, handle_ref: &IsolationEnvironmentHandleRef) -> bool` | `CoherentBoundary::mark_failed` | failure classification、boundary、partial/active handle | 只决定是否可进入 boundary `Failed`。 |
| `CleanupGuard` | `permits_release_for(context_ref: &ControlledExecutionContextRef, boundary_ref: &CoherentBoundaryRef, handle_ref: &IsolationEnvironmentHandleRef, lease_ref: &LeaseRecordRef) -> bool` | handle进入`ReleasePending` / same-target release recovery | cleanup evidence、investigation、redline 与四 refs | 只决定release authorization；boundary completion直接消费matching `CleanupCompletionBasis`。 |
| `CleanupGuard` | `permits_context_closure_for(context_ref, current_redline_coverage, current_redlines) -> Result<bool, CleanupGuardError>` | context / identity close | 同一context的cleanup completion basis + fresh完整redline coverage | 只在Completed且coverage全Released时允许闭合。 |

上述 bool 是 `CleanupGuard` / `LeaseRecord` / `FailureClassification` 已封装的纯读取结果，不是外部输入，也不能在 service、fake 或测试 fixture 中自行计算。`BoundaryEstablishmentDecision` 的 `requires_cleanup_guard` 仍需沿对应 exact owner method 读取；boundary release closure不再消费一般permission，而由matching completion basis逐项证明。

## 17. Boundary establishment decision contract

### 17.1 `BoundaryEstablishmentDecision`

```rust
/// 记录一个 immutable boundary establishment attempt 的正式裁定。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryEstablishmentDecision {
    /// 本 immutable establishment attempt 的 typed identity。
    decision_ref: BoundaryEstablishmentDecisionRef,
    /// 本 attempt 唯一裁定的 coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// 本 attempt 消费的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 除 requirement rejection 外，本 attempt 消费的 capability snapshot ref。
    capability_ref: Option<BackendCapabilitySummaryRef>,
    /// established 或 failed-with-partial-handle attempt 对应的 handle ref。
    handle_ref: Option<IsolationEnvironmentHandleRef>,
    /// 本 attempt 消费的 exact requirement coherence guard ref。
    coherence_guard_ref: BoundaryCoherenceGuardRef,
    /// 消费 capability 时使用的 exact backend capability guard ref。
    capability_guard_ref: Option<BackendCapabilityGuardRef>,
    /// 本 immutable attempt 的 canonical decision status。
    decision_status: BoundaryEstablishmentDecisionStatus,
    /// 除 `Established` 外各 status 必有的 caller-safe reason。
    decision_reason: Option<SandboxReason>,
    /// application clock 提供的正式裁定时间。
    decided_at: Timestamp,
    /// 本 attempt 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
}

impl BoundaryEstablishmentDecision {
    /// 在 requirement coherence 与十维 backend capability 均成立且 handle 已创建时裁定 established。
    pub fn established(
        decision_ref: BoundaryEstablishmentDecisionRef,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        handle: &IsolationEnvironmentHandle,
        coherence_decision: &BoundaryCoherenceDecision,
        capability_decision: &BackendCapabilityDecision,
        decided_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, BoundaryEstablishmentDecisionError>;

    /// 在 requirement 自身跨维冲突或违反 hard redline 时裁定 rejected。
    pub fn rejected(
        decision_ref: BoundaryEstablishmentDecisionRef,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        coherence_decision: &BoundaryCoherenceDecision,
        decided_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, BoundaryEstablishmentDecisionError>;

    /// capability snapshot stale / unknown，或 `Fresh` 但 checked age 已到 window 时裁定 pending；不得调用 backend establish。
    pub fn pending_capability(
        decision_ref: BoundaryEstablishmentDecisionRef,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        coherence_decision: &BoundaryCoherenceDecision,
        capability_decision: &BackendCapabilityDecision,
        decided_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, BoundaryEstablishmentDecisionError>;

    /// capability snapshot 明确存在 unsupported verdict 时裁定 unsupported。
    pub fn unsupported(
        decision_ref: BoundaryEstablishmentDecisionRef,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        coherence_decision: &BoundaryCoherenceDecision,
        capability_decision: &BackendCapabilityDecision,
        decided_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, BoundaryEstablishmentDecisionError>;

    /// capability 已支持但 backend establish / verification 失败时裁定 failed。
    pub fn failed(
        decision_ref: BoundaryEstablishmentDecisionRef,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        coherence_decision: &BoundaryCoherenceDecision,
        capability_decision: &BackendCapabilityDecision,
        partial_handle: Option<&IsolationEnvironmentHandle>,
        reason: SandboxReason,
        decided_at: Timestamp,
        audit_trace_ref: SandboxAuditTraceRef,
    ) -> Result<Self, BoundaryEstablishmentDecisionError>;

    /// 返回 immutable establishment attempt identity。
    pub fn decision_ref(&self) -> &BoundaryEstablishmentDecisionRef;
    /// 返回本 attempt 唯一裁定的 coherent boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回本 attempt 消费的 requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回本 attempt 消费的 capability snapshot ref。
    pub fn capability_ref(&self) -> Option<&BackendCapabilitySummaryRef>;
    /// 返回 established 或 partial-failure handle ref。
    pub fn handle_ref(&self) -> Option<&IsolationEnvironmentHandleRef>;
    /// 返回本 attempt 使用的 requirement coherence guard ref。
    pub fn coherence_guard_ref(&self) -> &BoundaryCoherenceGuardRef;
    /// 返回本 attempt 使用的 backend capability guard ref。
    pub fn capability_guard_ref(&self) -> Option<&BackendCapabilityGuardRef>;
    /// 返回 canonical establishment decision status。
    pub fn decision_status(&self) -> BoundaryEstablishmentDecisionStatus;
    /// 返回 non-established decision 的 caller-safe reason。
    pub fn decision_reason(&self) -> Option<&SandboxReason>;
    /// 返回正式裁定时间。
    pub fn decided_at(&self) -> &Timestamp;
    /// 返回本 attempt 对应的 audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只说明本 attempt 的裁定；不能单独证明 run 可 launch。
    pub fn is_established(&self) -> bool;

    /// failed 且产生 partial handle 时，或 established handle 后续需释放时返回 true。
    pub fn requires_cleanup_guard(&self) -> bool;
}
```

| factory | coherence decision | capability decision / summary | handle | status |
|---|---|---|---|---|
| `established` | `Coherent` | `Supported`;summary `Fresh`;10/10 supported | `Created`;refs / generation 全匹配 | `Established` |
| `rejected` | `Rejected` | 不消费 capability | `None` | `Rejected` |
| `pending_capability` | `Coherent` | `Pending`;summary `Stale | Unknown`，或 `Fresh` 且 decision 证明 checked age 已到 window | `None` | `PendingCapability` |
| `unsupported` | `Coherent` | `Unsupported`;summary `Unsupported` | `None` | `Unsupported` |
| `failed` | `Coherent` | `Supported`;summary `Fresh` | `None` 或 matching `Created` partial handle | `Failed` |

只有 `Established` 的 reason 为 `None`；其余 factory 从 guard decision 或显式 sanitized backend failure 取得 `Some`。decision 不接受 adapter raw error，不保存 backend product name，不读取 policy。

### 17.2 `BoundaryEstablishmentDecisionError`

```rust
/// establishment attempt 的 guard、requirement、capability、handle 或状态关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryEstablishmentDecisionError {
    /// coherence decision 评估的 requirement ref 与 attempt 输入不一致。
    CoherenceDecisionRequirementMismatch,
    /// success / capability 路径收到的 coherence decision 不是 `Coherent`。
    CoherenceDecisionWasNotCoherent,
    /// rejection 路径收到的 coherence decision 不是 `Rejected`。
    CoherenceDecisionWasNotRejected,
    /// capability decision 评估的 requirement ref 与 attempt 输入不一致。
    CapabilityDecisionRequirementMismatch,
    /// capability decision 评估的 summary ref 与 attempt 输入不一致。
    CapabilityDecisionSummaryMismatch,
    /// established / failed 路径收到的 capability decision 不是 `Supported`。
    CapabilityDecisionWasNotSupported,
    /// pending 路径收到的 capability decision 不是 `Pending`。
    CapabilityDecisionWasNotPending,
    /// unsupported 路径收到的 capability decision 不是 `Unsupported`。
    CapabilityDecisionWasNotUnsupported,
    /// established / failed 路径的 capability summary 不是 `Fresh`。
    CapabilitySummaryWasNotFresh {
        /// capability summary 实际 canonical status。
        actual: BackendCapabilitySummaryStatus,
    },
    /// pending 路径的 capability summary 不是 `Stale | Unknown`。
    CapabilitySummaryDidNotRequirePendingAtAge {
        /// capability summary 实际 canonical status。
        actual: BackendCapabilitySummaryStatus,
        /// capability decision 保存的 checked snapshot age，单位 milliseconds。
        checked_age_millis: u64,
    },
    /// unsupported 路径的 capability summary 不是 `Unsupported`。
    CapabilitySummaryWasNotUnsupported {
        /// capability summary 实际 canonical status。
        actual: BackendCapabilitySummaryStatus,
    },
    /// established / partial-failure 输入 handle 不是 `Created`。
    HandleWasNotCreated {
        /// handle 实际 canonical lifecycle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// handle 预绑定的 boundary ref 与 attempt boundary ref 不一致。
    HandleBoundaryMismatch,
    /// handle 绑定的 requirement ref 与 attempt requirement ref 不一致。
    HandleRequirementMismatch,
    /// handle 绑定的 capability ref 与 attempt capability ref 不一致。
    HandleCapabilityMismatch,
    /// handle、requirement 与 capability generation 不一致。
    HandleGenerationMismatch,
    /// failed attempt 的 optional partial handle 与保存的 handle relation 不一致。
    PartialHandleMismatch,
    /// decision time 不满足 canonical timestamp contract 或早于所消费 snapshot。
    DecisionTimestampInvalid,
}
```

### 17.3 Decision immutability

decision 没有 transition method。capability refresh、retry establish 或 backend retry 必须创建新 `BoundaryEstablishmentDecisionRef`；`CoherentBoundary.latest_decision_ref` 可以在受限 transition 中指向新 attempt，但历史 decision 不修改。duplicate command replay 读取 stored result，不创建第二个 decision。

## 18. `CoherentBoundary` truth contract

```rust
/// 拥有十维 requirement 作为一个整体是否已建立、拒绝、失败或释放的 Sandbox truth。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CoherentBoundary {
    /// 本地 coherent boundary truth identity。
    boundary_ref: CoherentBoundaryRef,
    /// 所属 controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// 所属 active execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// 本 boundary 唯一承接的 immutable ten-dimensional requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 最近一次已应用 establishment attempt ref。
    latest_decision_ref: Option<BoundaryEstablishmentDecisionRef>,
    /// pending / established / failed attempt 消费的 capability snapshot ref。
    capability_ref: Option<BackendCapabilitySummaryRef>,
    /// established 或 failed-with-cleanup-handle boundary 对应的 handle ref。
    handle_ref: Option<IsolationEnvironmentHandleRef>,
    /// established 后使 boundary 失败的 formal failure classification ref。
    failure_ref: Option<FailureClassificationRef>,
    /// requirement、capability、handle 与 boundary 共用的 generation。
    generation_ref: ResourceRef,
    /// boundary relation truth 的 canonical lifecycle status。
    boundary_status: CoherentBoundaryStatus,
    /// 非 `Required | Established` 状态的 caller-safe reason。
    status_reason: Option<SandboxReason>,
    /// requirement 首次形成 `Required` boundary truth 的时间。
    created_at: Timestamp,
    /// 当前 boundary status 生效时间，必须单调不回退。
    status_changed_at: Timestamp,
    /// 最近一次 boundary transition 对应的 audit trace ref。
    last_audit_trace_ref: SandboxAuditTraceRef,
}

impl CoherentBoundary {
    /// 为完整 requirement 创建 `Required` boundary truth；不表示 backend 已调用。
    pub fn require(
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        audit_trace_ref: SandboxAuditTraceRef,
        created_at: Timestamp,
    ) -> Result<Self, CoherentBoundaryError>;

    /// 应用 pending capability decision；可由新 decision 重复 pending，但不得覆盖 terminal truth。
    pub fn record_pending_capability(
        &mut self,
        decision: &BoundaryEstablishmentDecision,
        capability: &BackendCapabilitySummary,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CoherentBoundaryError>;

    /// 应用 rejected / unsupported decision；两者在 boundary truth 上都进入 `Rejected`。
    pub fn record_rejected(
        &mut self,
        decision: &BoundaryEstablishmentDecision,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CoherentBoundaryError>;

    /// 应用 established decision 与 `Created` handle，形成 established boundary。
    pub fn record_established(
        &mut self,
        decision: &BoundaryEstablishmentDecision,
        capability: &BackendCapabilitySummary,
        handle: &IsolationEnvironmentHandle,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CoherentBoundaryError>;

    /// 应用 establish failure；partial handle 只形成 cleanup obligation，不使 boundary 可 launch。
    pub fn record_establishment_failed(
        &mut self,
        decision: &BoundaryEstablishmentDecision,
        partial_handle: Option<&IsolationEnvironmentHandle>,
        audit_trace_ref: SandboxAuditTraceRef,
        changed_at: Timestamp,
    ) -> Result<(), CoherentBoundaryError>;

    /// established 后收到 matching backend / lease lifecycle failure 时进入 failed。
    pub fn mark_failed(
        &mut self,
        handle: &IsolationEnvironmentHandle,
        failure: &FailureClassification,
        audit_trace_ref: SandboxAuditTraceRef,
        failed_at: Timestamp,
    ) -> Result<(), CoherentBoundaryError>;

    /// matching handle 已released且completion basis证明同一authorization / confirmation后进入released。
    pub fn mark_released(
        &mut self,
        handle: &IsolationEnvironmentHandle,
        completion_basis: &CleanupCompletionBasis,
        audit_trace_ref: SandboxAuditTraceRef,
        released_at: Timestamp,
    ) -> Result<(), CoherentBoundaryError>;

    /// 返回 coherent boundary truth identity。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 owning controlled execution context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 owning execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回唯一承接的 immutable requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回最近一次已应用 establishment decision ref。
    pub fn latest_decision_ref(&self) -> Option<&BoundaryEstablishmentDecisionRef>;
    /// 返回当前 boundary relation 消费的 capability snapshot ref。
    pub fn capability_ref(&self) -> Option<&BackendCapabilitySummaryRef>;
    /// 返回 established 或 failed cleanup handle ref。
    pub fn handle_ref(&self) -> Option<&IsolationEnvironmentHandleRef>;
    /// 返回使 established boundary 失败的 formal failure ref。
    pub fn failure_ref(&self) -> Option<&FailureClassificationRef>;
    /// 返回 boundary 绑定的 canonical generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回 canonical coherent boundary lifecycle status。
    pub fn boundary_status(&self) -> CoherentBoundaryStatus;
    /// 返回当前非成功状态的 caller-safe reason。
    pub fn status_reason(&self) -> Option<&SandboxReason>;
    /// 返回 `Required` boundary truth 创建时间。
    pub fn created_at(&self) -> &Timestamp;
    /// 返回当前 status 生效时间。
    pub fn status_changed_at(&self) -> &Timestamp;
    /// 返回最近一次 transition audit trace ref。
    pub fn last_audit_trace_ref(&self) -> &SandboxAuditTraceRef;

    /// 只在 established 且 capability / handle refs 均存在时返回 true。
    pub fn is_established(&self) -> bool;

    /// 返回 launch guard 所需 refs；非 established 返回 exact error。
    pub fn require_established_links(
        &self,
    ) -> Result<EstablishedBoundaryLinks<'_>, CoherentBoundaryError>;
}

/// 从一个 established boundary 原子借出的 launch guard relation links。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct EstablishedBoundaryLinks<'a> {
    /// established boundary 唯一承接的 requirement set ref。
    requirement_ref: &'a BoundaryRequirementSetRef,
    /// established attempt 使用的 fresh capability snapshot ref。
    capability_ref: &'a BackendCapabilitySummaryRef,
    /// 与 established boundary 原子关联的 active handle ref。
    handle_ref: &'a IsolationEnvironmentHandleRef,
    /// requirement、capability、handle 共用的 canonical generation。
    generation_ref: &'a ResourceRef,
}

impl<'a> EstablishedBoundaryLinks<'a> {
    /// 返回 established boundary 的 immutable requirement set ref。
    pub fn requirement_ref(&self) -> &'a BoundaryRequirementSetRef;
    /// 返回 established attempt 使用的 capability snapshot ref。
    pub fn capability_ref(&self) -> &'a BackendCapabilitySummaryRef;
    /// 返回与 established boundary 原子关联的 handle ref。
    pub fn handle_ref(&self) -> &'a IsolationEnvironmentHandleRef;
    /// 返回四项 established links 共用的 canonical generation。
    pub fn generation_ref(&self) -> &'a ResourceRef;
}
```

`EstablishedBoundaryLinks<'a>` 是只借用 `requirement_ref`、`capability_ref`、`handle_ref` 与 `generation_ref` 的 domain support return value；它虽因 public method return type 而具有 public type visibility，但字段保持 private，不可由 caller 构造，不可序列化、不可持久化，也不是新 truth owner。它避免后序 run guard 接收四个可任意拼接的裸 ref。

exact lifecycle：

```text
factory -> Required
Required -> PendingCapability | Established | Rejected | Failed
PendingCapability -> PendingCapability | Established | Rejected | Failed
Established -> Failed | Released
Failed(with matching cleanup handle) -> Released
Rejected / Released -> terminal
```

| transition | relation checks |
|---|---|
| pending | decision `PendingCapability`；boundary / requirement ref 匹配；capability ref 与 decision 相等；不写 handle ref。 |
| rejected | decision `Rejected | Unsupported`；不写 handle；reason 来自 decision。 |
| established | decision `Established`；capability `Fresh` 10/10；handle `Created`；五类 ref 与 generation 全相等。 |
| establishment failed | decision `Failed`；partial handle presence 与 decision.handle_ref 一致；`failure_ref` 保持 `None`，因为 establishment attempt failure 尚未冒充正式 failure classification。 |
| mark failed | handle ref / context / identity / requirement / generation 匹配；`FailureClassification::blocks_boundary_for(boundary_ref, handle_ref)` 为 true；保存 failure ref / safe reason。 |
| released | handle `Released`；`CleanupCompletionBasis`的boundary / context / identity / handle / generation逐项等于本boundary与handle，且backend target、release summary、authorization audit / time延续同一confirmation；status reason直接复制basis的caller-safe completion reason。若当前boundary为`Failed`，必须已有matching cleanup `handle_ref`。该handle可以是establishment failure留下的partial handle，也可以是established后runtime failure关联的handle；无matching handle的failed boundary不可进入`Released`。一般cleanup permission、guard ref、`Allowed` status或caller reason均不能替代completion basis。 |

`CoherentBoundary` 不保存 resource、filesystem、network、process、workspace、mount 或 lifecycle 的重复 summary。十维详细 truth 永远由 immutable `BoundaryRequirementSet` 唯一拥有；boundary 只保存关系与 lifecycle。

### 18.1 `CoherentBoundaryError`

```rust
/// coherent boundary 的 relation、decision、handle 或 lifecycle 不变量失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CoherentBoundaryError {
    /// requirement set 未满足 ten-dimensional completeness，不能创建 `Required` truth。
    RequirementWasIncomplete,
    /// decision 裁定的 boundary ref 与 owning boundary 不一致。
    DecisionBoundaryMismatch,
    /// decision 消费的 requirement ref 与 owning boundary 不一致。
    DecisionRequirementMismatch,
    /// transition 收到的 decision status 不满足该 transition 前提。
    DecisionStatusMismatch {
        /// transition 实际收到的 canonical decision status。
        actual: BoundaryEstablishmentDecisionStatus,
    },
    /// capability ref 与 decision、handle 或 owning boundary relation 不一致。
    CapabilityRefMismatch,
    /// established transition 收到的 capability summary 不是 `Fresh`。
    CapabilityWasNotFresh {
        /// capability summary 实际 canonical status。
        actual: BackendCapabilitySummaryStatus,
    },
    /// capability verdict set 未逐项支持十维 exact requirements。
    CapabilityDidNotSupportAllRequirements,
    /// handle ref 与 decision 或 owning boundary relation 不一致。
    HandleRefMismatch,
    /// established / partial-failure transition 收到的 handle 不是 `Created`。
    HandleWasNotCreated {
        /// handle 实际 canonical lifecycle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// release transition 收到的 handle 不是 `Released`。
    HandleWasNotReleased {
        /// handle 实际 canonical lifecycle status。
        actual: IsolationEnvironmentHandleStatus,
    },
    /// context 与 execution environment identity 不属于同一 boundary lineage。
    ContextIdentityMismatch,
    /// requirement、capability、handle 或 boundary generation 不一致。
    GenerationMismatch,
    /// failed decision 的 optional partial handle 与 boundary 保存关系不一致。
    PartialHandlePresenceMismatch,
    /// 无 matching cleanup handle 的 failed boundary 被请求进入 release closure。
    FailedBoundaryHadNoCleanupHandle,
    /// failure classification 未明确阻止目标 boundary / handle 继续使用。
    FailureDidNotBlockBoundary,
    /// failure classification 绑定的 boundary 与目标 boundary 不一致。
    FailureBoundaryMismatch,
    /// failure classification 绑定的 handle 与目标 handle 不一致。
    FailureHandleMismatch,
    /// cleanup completion basis未延续目标boundary / handle / authorization / confirmation关系。
    CleanupCompletionBasisMismatch,
    /// 请求 established-only links 时 boundary 不处于 `Established`。
    BoundaryNotEstablished {
        /// 未满足 established 前提的 boundary identity。
        boundary_ref: CoherentBoundaryRef,
        /// boundary 实际 canonical lifecycle status。
        actual: CoherentBoundaryStatus,
    },
    /// 请求的 boundary lifecycle transition 不在 closed transition graph 中。
    BoundaryTransitionNotAllowed {
        /// 拒绝 transition 的 coherent boundary identity。
        boundary_ref: CoherentBoundaryRef,
        /// transition 前实际 canonical status。
        from: CoherentBoundaryStatus,
        /// caller 请求进入的目标 status。
        to: CoherentBoundaryStatus,
    },
    /// status change time 早于当前 status time 或不满足 canonical time contract。
    StatusTimestampMovedBackwards {
        /// 时间关系校验失败的 coherent boundary identity。
        boundary_ref: CoherentBoundaryRef,
    },
}
```

### 18.2 Establishment atomicity handoff

Step 7 必须把成功路径固定在一个 UoW：

```text
compose immutable requirements
  -> CoherentBoundary::require(pre-generated boundary ref)
  -> evaluate coherence + capability guards
  -> call backend only when both allow
  -> IsolationEnvironmentHandle::create(pre-generated handle/boundary/lease refs)
  -> BoundaryEstablishmentDecision::established(... created handle ...)
  -> boundary.record_established(...)
  -> handle.activate(&boundary, ...)
  -> LeaseRecord::open(pre-generated lease ref, active handle, same lease window) [6R-04]
  -> stage audit + relay + stored result
  -> commit requirement + boundary + decision + capability ref + handle + lease + audit atomically
```

`Required` boundary、`Created` handle 或 established decision 均不得作为成功中间态单独提交。backend call 已产生环境但 transaction 失败时，application 必须保留 body-free partial handle / cleanup obligation，并走 Step 12 recovery；不得重试后假装没有外部环境。

## 19. Boundary guard contract

### 19.1 `BoundaryCoherenceDecision`

```rust
/// requirement set 自身跨十维是否 coherent 的纯领域判断。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum BoundaryCoherenceDecisionKind {
    /// 十维 requirement complete 且所有跨维 hard invariant 成立。
    Coherent,
    /// 至少一个跨维 hard invariant 冲突，禁止进入 backend capability establishment。
    Rejected,
}

/// 绑定 guard 与 immutable requirement set 的 coherence decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryCoherenceDecision {
    /// 产生本 decision 的 exact coherence guard ref。
    guard_ref: BoundaryCoherenceGuardRef,
    /// 本 decision 唯一评估的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// coherence evaluation 的有限处置类别。
    decision_kind: BoundaryCoherenceDecisionKind,
    /// `Rejected` 时按 canonical kind 顺序保存的非空冲突 kind 集合。
    conflicting_kinds: Vec<BoundaryLimitKind>,
    /// `Rejected` 时必有的 caller-safe coherence 原因。
    reason: Option<SandboxReason>,
    /// application clock 提供的纯判断时间。
    evaluated_at: Timestamp,
}

impl BoundaryCoherenceDecision {
    /// 返回产生 decision 的 exact coherence guard ref。
    pub fn guard_ref(&self) -> &BoundaryCoherenceGuardRef;
    /// 返回本 decision 唯一评估的 requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回有限 coherence decision kind。
    pub fn decision_kind(&self) -> BoundaryCoherenceDecisionKind;
    /// 返回按 canonical kind 顺序排列的冲突 kind；`Coherent` 时为空。
    pub fn conflicting_kinds(&self) -> &[BoundaryLimitKind];
    /// 返回 rejection 的 caller-safe 原因。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回 coherence evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;
    /// 判断十维 requirement 是否通过 coherence hard gate。
    pub fn is_coherent(&self) -> bool;
}
```

`Coherent => conflicting_kinds empty + reason None`；`Rejected => non-empty ordered-unique conflicting kinds + reason Some`。decision 只能由 guard 构造，不提供 public factory / arbitrary serde。

### 19.2 `BoundaryCoherenceGuard`

```rust
/// 对 complete requirement 执行十维 coverage 与跨维 hard invariant 判断。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryCoherenceGuard {
    /// 不可变 coherence rule snapshot 的 typed identity。
    guard_ref: BoundaryCoherenceGuardRef,
    /// 必须与 canonical `BoundaryLimitKind` 十项一一相等的 closed coverage。
    required_kinds: [BoundaryLimitKind; 10],
    /// 本 guard rule snapshot 的 activation time。
    activated_at: Timestamp,
}

impl BoundaryCoherenceGuard {
    /// required kinds 必须与 `BoundaryLimitKind` canonical 10 variant 完全一致。
    pub fn try_strict(
        guard_ref: BoundaryCoherenceGuardRef,
        required_kinds: [BoundaryLimitKind; 10],
        activated_at: Timestamp,
    ) -> Result<Self, BoundaryCoherenceGuardError>;

    /// 对 immutable requirement 作纯判断，不调用 capability / backend / policy。
    pub fn evaluate(
        &self,
        requirements: &BoundaryRequirementSet,
        evaluated_at: Timestamp,
    ) -> Result<BoundaryCoherenceDecision, BoundaryCoherenceGuardError>;

    /// 返回 immutable coherence guard identity。
    pub fn guard_ref(&self) -> &BoundaryCoherenceGuardRef;
    /// 返回 canonical ten-dimensional rule coverage。
    pub fn required_kinds(&self) -> &[BoundaryLimitKind; 10];
    /// 返回 guard rule snapshot activation time。
    pub fn activated_at(&self) -> &Timestamp;
}

/// boundary coherence guard 的 rule coverage 或 relation 错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BoundaryCoherenceGuardError {
    /// strict rule coverage 重复包含载荷指定的 boundary kind。
    DuplicateRequiredKind {
        /// strict coverage 中出现重复的 boundary limit kind。
        kind: BoundaryLimitKind,
    },
    /// strict rule coverage 缺少载荷指定的 canonical boundary kind。
    MissingRequiredKind {
        /// strict coverage 中缺失的 boundary limit kind。
        kind: BoundaryLimitKind,
    },
    /// guard coverage 与 requirement set 的 ten-dimensional coverage 不一致。
    RequirementCoverageMismatch,
    /// evaluation time 不满足 canonical timestamp contract 或早于 guard activation。
    GuardEvaluationTimestampInvalid,
}
```

除了各 requirement factory 已校验的不变量，`evaluate` 还必须校验以下跨维关系：

| coherence rule | rejected kinds | rationale |
|---|---|---|
| wall-clock max duration + termination grace 不得超过 lifecycle max lease duration | `WallClock`;`Lifecycle` | lease 不得先于受控终止窗口结束。 |
| `WorkspaceWriteMode::ReadOnly` 时所有 mount 必须 `ReadOnly` | `Workspace`;`Mount` | writable mount 不能绕过 read-only workspace。 |
| `IsolatedEphemeral` workspace 至少有一个 matching `IsolationBackend` ephemeral mount rule | `Workspace`;`Mount` | 写层必须有显式 isolation-owned source。 |
| network `DenyAll` 时 allowlist 必须空；allowlisted mode 时 summary 非空 | `Network` | 不允许 stale / hidden allowlist。 |
| subprocess `Denied` 时 max process count 必须为 1 | `Process` | process count 不得暗中允许子进程。 |
| lifecycle cleanup guard / release confirmation / reaper 必须全 true | `Lifecycle` | 配置不能关闭安全收束。 |
| generation binding 四 ref 必须同代 | 全部十维 | 跨代组合不能宣称 coherent。 |

`evaluate` 返回 `Rejected` 是正式 requirement hard mismatch，不是 warning。它不返回 `Pending`：checked requirement 信息不足应在 compose 前失败，不能构造半完整 set。

### 19.3 `BackendCapabilityDecision`

```rust
/// backend capability guard 对 exact requirement snapshot 的有限处置。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum BackendCapabilityDecisionKind {
    /// fresh snapshot 对十维 exact requirements 全部给出可验证支持。
    Supported,
    /// snapshot stale、含 unknown verdict，或 fresh snapshot 已到 window，必须 refresh / fail-closed。
    Pending,
    /// snapshot 明确包含至少一个 unsupported exact requirement。
    Unsupported,
}

/// 绑定 requirement、capability snapshot 与 guard 的 capability decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendCapabilityDecision {
    /// 产生本 decision 的 exact backend capability guard ref。
    guard_ref: BackendCapabilityGuardRef,
    /// 本 decision 唯一评估的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 decision 唯一消费的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// capability evaluation 的有限处置类别。
    decision_kind: BackendCapabilityDecisionKind,
    /// pending / unsupported 时按 canonical kind 顺序保存的受影响 kind。
    non_supported_kinds: Vec<BoundaryLimitKind>,
    /// pending / unsupported 时来自 capability snapshot，或由 guard 固定生成的 expiry safe reason。
    reason: Option<SandboxReason>,
    /// Step 7 clock port 对 `evaluated_at - capability.observed_at` 给出的 checked age，单位 milliseconds。
    checked_age_millis: u64,
    /// application clock 提供的纯判断时间。
    evaluated_at: Timestamp,
}

impl BackendCapabilityDecision {
    /// 返回产生 decision 的 exact backend capability guard ref。
    pub fn guard_ref(&self) -> &BackendCapabilityGuardRef;
    /// 返回本 decision 唯一评估的 requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回本 decision 唯一消费的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回有限 backend capability decision kind。
    pub fn decision_kind(&self) -> BackendCapabilityDecisionKind;
    /// 返回 pending / unsupported 涉及的 canonical boundary kinds。
    pub fn non_supported_kinds(&self) -> &[BoundaryLimitKind];
    /// 返回 pending / unsupported 的 caller-safe 原因。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回与 evaluation time 成对生成的 checked snapshot age，单位 milliseconds。
    pub fn checked_age_millis(&self) -> u64;
    /// 返回 backend capability evaluation time。
    pub fn evaluated_at(&self) -> &Timestamp;
    /// 判断 snapshot 是否明确支持 exact ten-dimensional requirements。
    pub fn is_supported(&self) -> bool;
}
```

### 19.4 `BackendCapabilityGuard`

```rust
/// 校验 capability snapshot 是否对同一 requirement / generation 给出十维可验证支持。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendCapabilityGuard {
    /// 不可变 backend capability guard 的 typed identity。
    guard_ref: BackendCapabilityGuardRef,
    /// 本 guard 固定评估的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 本 guard 固定消费的 capability snapshot ref。
    capability_ref: BackendCapabilitySummaryRef,
    /// 本 guard binding 的 activation time。
    activated_at: Timestamp,
}

impl BackendCapabilityGuard {
    /// 固定一次 establishment attempt 使用的 requirement 与 capability snapshot。
    pub fn bind(
        guard_ref: BackendCapabilityGuardRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        activated_at: Timestamp,
    ) -> Result<Self, BackendCapabilityGuardError>;

    /// 作纯判断；不 refresh capability，不调用 backend，不读取 policy。
    pub fn evaluate(
        &self,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
        checked_age_millis: u64,
        evaluated_at: Timestamp,
    ) -> Result<BackendCapabilityDecision, BackendCapabilityGuardError>;

    /// 返回 immutable backend capability guard identity。
    pub fn guard_ref(&self) -> &BackendCapabilityGuardRef;
    /// 返回 guard 固定评估的 requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 guard 固定消费的 capability snapshot ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回 guard binding activation time。
    pub fn activated_at(&self) -> &Timestamp;
}

/// backend capability guard 的绑定或关系错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BackendCapabilityGuardError {
    /// evaluate 输入的 requirement ref 与 guard binding 不一致。
    RequirementRefMismatch {
        /// guard binding 固定的 requirement set ref。
        expected: BoundaryRequirementSetRef,
        /// evaluate 实际收到的 requirement set ref。
        actual: BoundaryRequirementSetRef,
    },
    /// evaluate 输入的 capability ref 与 guard binding 不一致。
    CapabilityRefMismatch {
        /// guard binding 固定的 capability snapshot ref。
        expected: BackendCapabilitySummaryRef,
        /// evaluate 实际收到的 capability snapshot ref。
        actual: BackendCapabilitySummaryRef,
    },
    /// capability snapshot 评估的 requirement 与 guard requirement 不一致。
    CapabilityRequirementMismatch,
    /// capability snapshot generation 与 requirement generation 不一致。
    CapabilityGenerationMismatch,
    /// capability verdict set 没有完整覆盖 canonical 十维 boundary kinds。
    CapabilityVerdictCoverageIncomplete,
    /// evaluation time 不满足 canonical timestamp contract 或早于 guard activation。
    GuardEvaluationTimestampInvalid,
}
```

exact decision matrix：

| summary status | verdict relation | guard decision | reason / kind list |
|---|---|---|---|
| `Fresh` 且 `checked_age_millis < freshness_window_millis` | 10/10 supported | `Supported` | reason `None`；list empty |
| `Fresh` 且 `checked_age_millis >= freshness_window_millis` | 10/10 supported | `Pending` | guard-owned fixed safe expiry reason；十个 kind 作为 expired scope |
| `Fresh` | 任一 unsupported / unknown | invalid summary relation，返回 guard error；不作 allow | 由 summary factory 本应阻止 |
| `Stale` | complete set | `Pending` | summary reason；所有非-supported kind；若当前均 supported，仍以十个 kind 作为 stale scope |
| `Unknown` | 至少一个 unknown | `Pending` | summary reason；unknown kind list |
| `Unsupported` | 至少一个 unsupported | `Unsupported` | summary reason；unsupported kind list |

decision 必须保存本次 `checked_age_millis`，并与 `evaluated_at` 一起来自 Step 7 clock port 的同一次 checked elapsed 结果；guard 不解析 timestamp，也不接受 caller-computed freshness bool。decision priority 不使用 wildcard；未来新增 summary / verdict variant 时必须编译失败并回到本节重审。`Pending` 不调用 backend establish，`Unsupported` 不降级为弱后端或 host-run。

### 19.5 Guard separation invariant

`BoundaryCoherenceGuard` 判断“要求本身是否完整且相互不冲突”；`BackendCapabilityGuard` 判断“指定 backend snapshot 是否能证明 exact requirements”。正式 `BoundaryEstablishmentDecision` 必须同时记录两者的 guard ref；不得把 coherence reject 伪装成 backend unsupported，也不得用 backend supported 覆盖 requirement hard mismatch。

## 20. Read-view source snapshot contract

view 位于 `contracts::views`，不能接收 domain object。application / projection mapper 只能从同一个 committed snapshot 复制 named refs、canonical statuses、safe reasons 与 observed time，再调用本节 checked source constructor。source snapshot 是不可持久化 helper，不是第二 truth。

### 20.1 Required handoff snapshot

```rust
/// 一个 required handoff fact 的 committed status pair。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RequiredHandoffStatusItem {
    /// completion 所要求的一个 handoff fact identity。
    handoff_ref: HandoffFactRef,
    /// 与 handoff ref 来自同一 committed snapshot 的 canonical status。
    handoff_status: HandoffFactStatus,
}

impl RequiredHandoffStatusItem {
    /// 组合一个 committed handoff ref/status pair；不查询或推进 handoff truth。
    pub fn new(
        handoff_ref: HandoffFactRef,
        handoff_status: HandoffFactStatus,
    ) -> Self;
    /// 返回 required handoff fact identity。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回同一 committed snapshot 中的 handoff status。
    pub fn handoff_status(&self) -> HandoffFactStatus;
}

/// 本次 execution completion 所需 handoff 的显式状态。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum RequiredHandoffStatusSet {
    /// capture contract 明确判定无需任何 downstream handoff。
    NotRequired,
    /// 至少一个 handoff required；每个 ref 只能出现一次。
    Required(
        /// 非空且 handoff ref 唯一的 required handoff 状态项。
        Vec<RequiredHandoffStatusItem>,
    ),
}

impl RequiredHandoffStatusSet {
    /// 表达 capture contract 已明确判定本次 completion 不需要 handoff。
    pub fn not_required() -> Self;
    /// 构造非空、ref 唯一的 required handoff status set。
    pub fn try_required(
        items: Vec<RequiredHandoffStatusItem>,
    ) -> Result<Self, StatusViewError>;
    /// 判断所有 required handoff 是否都已处于 delivered / terminal-success 状态。
    pub fn all_delivered(&self) -> bool;
    /// 判断至少一个 required handoff 是否仍 pending 或已 failed。
    pub fn has_pending_or_failed(&self) -> bool;
    /// 返回 required handoff items；`NotRequired` 返回空切片。
    pub fn items(&self) -> &[RequiredHandoffStatusItem];
}
```

空 `Required(Vec::new())` 非法，必须显式使用 `NotRequired`。`NotRequired` 只能由 committed capture / handoff ownership result 映射，query 不得因找不到 handoff projection 而自行选择；找不到 source 必须产生 degraded reason。

### 20.2 `SandboxExecutionStatusSourceSnapshot`

```rust
/// 从同一个 committed truth / projection snapshot 复制出的 execution view source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusSourceSnapshot {
    /// 本 view source 唯一归属的 controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// 与 context 关联的 optional execution environment identity ref。
    environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
    /// context 在同一 committed snapshot 中的 canonical intake status。
    intake_status: ControlledExecutionIntakeStatus,
    /// environment identity ref 存在时必须同时存在的 canonical status。
    identity_status: Option<ExecutionEnvironmentIdentityStatus>,
    /// 与 context 关联的 optional coherent boundary ref。
    boundary_ref: Option<CoherentBoundaryRef>,
    /// boundary ref 存在时必须同时存在的 canonical status。
    boundary_status: Option<CoherentBoundaryStatus>,
    /// 与 context 关联的 optional policy execution decision ref。
    policy_decision_ref: Option<PolicyExecutionDecisionRef>,
    /// policy decision ref 存在时必须同时存在的 canonical status。
    policy_status: Option<PolicyExecutionDecisionStatus>,
    /// 与 context 关联的 optional controlled execution run ref。
    run_ref: Option<ControlledExecutionRunRef>,
    /// run ref 存在时必须同时存在的 canonical status。
    run_status: Option<ControlledExecutionRunStatus>,
    /// 与 run 关联的 optional capture fact ref。
    capture_ref: Option<CaptureFactRef>,
    /// capture ref 存在时必须同时存在的 canonical status。
    capture_status: Option<CaptureFactStatus>,
    /// capture completion 对 required handoff 的显式 committed knowledge。
    required_handoffs: Option<RequiredHandoffStatusSet>,
    /// 当前 chain 中 optional formal failure classification ref。
    failure_ref: Option<FailureClassificationRef>,
    /// failure ref 存在时必须同时存在的 canonical status。
    failure_status: Option<FailureClassificationStatus>,
    /// 当前 chain 中 optional cleanup guard ref。
    cleanup_guard_ref: Option<CleanupGuardRef>,
    /// cleanup guard ref 存在时必须同时存在的 canonical status。
    cleanup_status: Option<CleanupGuardStatus>,
    /// 当前 chain 中 optional redline containment ref。
    redline_ref: Option<RedlineContainmentRef>,
    /// redline ref 存在时必须同时存在的 canonical status。
    redline_status: Option<RedlineContainmentStatus>,
    /// 同一 committed snapshot 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// mapper 从 committed snapshot 读取这些关系的 observation time。
    observed_at: Timestamp,
}

impl SandboxExecutionStatusSourceSnapshot {
    /// 构造 relation-checked source；所有 optional ref/status 必须成对出现。
    pub fn try_new(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
        intake_status: ControlledExecutionIntakeStatus,
        identity_status: Option<ExecutionEnvironmentIdentityStatus>,
        boundary_ref: Option<CoherentBoundaryRef>,
        boundary_status: Option<CoherentBoundaryStatus>,
        policy_decision_ref: Option<PolicyExecutionDecisionRef>,
        policy_status: Option<PolicyExecutionDecisionStatus>,
        run_ref: Option<ControlledExecutionRunRef>,
        run_status: Option<ControlledExecutionRunStatus>,
        capture_ref: Option<CaptureFactRef>,
        capture_status: Option<CaptureFactStatus>,
        required_handoffs: Option<RequiredHandoffStatusSet>,
        failure_ref: Option<FailureClassificationRef>,
        failure_status: Option<FailureClassificationStatus>,
        cleanup_guard_ref: Option<CleanupGuardRef>,
        cleanup_status: Option<CleanupGuardStatus>,
        redline_ref: Option<RedlineContainmentRef>,
        redline_status: Option<RedlineContainmentStatus>,
        audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, StatusViewError>;

    /// 返回 view source 唯一归属的 controlled execution context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 context 的 canonical intake status。
    pub fn intake_status(&self) -> ControlledExecutionIntakeStatus;
    /// 返回 optional boundary canonical status；其 ref/status pair 已在 factory 对账。
    pub fn boundary_status(&self) -> Option<CoherentBoundaryStatus>;
    /// 返回 optional policy decision status；其 ref/status pair 已在 factory 对账。
    pub fn policy_status(&self) -> Option<PolicyExecutionDecisionStatus>;
    /// 返回 optional controlled run status；其 ref/status pair 已在 factory 对账。
    pub fn run_status(&self) -> Option<ControlledExecutionRunStatus>;
    /// 返回 optional capture status；其 ref/status pair 已在 factory 对账。
    pub fn capture_status(&self) -> Option<CaptureFactStatus>;
    /// 返回 capture completion 对 required handoff 的 explicit knowledge。
    pub fn required_handoffs(&self) -> Option<&RequiredHandoffStatusSet>;
    /// 返回 optional formal failure status。
    pub fn failure_status(&self) -> Option<FailureClassificationStatus>;
    /// 返回 optional cleanup guard status。
    pub fn cleanup_status(&self) -> Option<CleanupGuardStatus>;
    /// 返回 optional redline containment status。
    pub fn redline_status(&self) -> Option<RedlineContainmentStatus>;
    /// 返回同一 committed snapshot 的 audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回 committed source observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

source constructor exact pair rules：

- identity、boundary、policy、run、capture、failure、cleanup、redline 的 `Option<Ref>` 与 `Option<Status>` 必须同时 `Some` 或同时 `None`。
- `required_handoffs` 只能在 capture pair 存在时出现；capture complete 但 completion mapper 不知道 handoff requirement 时，不能构造 success source，必须走 degraded view input。
- run absent 时 capture pair 与 required handoff 必须同时 absent；只有 failure pair 可以表达 launch 前 failure，该组合由 `VisibleFailed` guard 接受，不允许 `VisibleCompleted`。
- source snapshot 不判断 visibility；query authorization 和 existence ambiguity 由 application `SandboxQueryAccessDecision` 后续处理。

### 20.3 `BoundaryStatusSourceSnapshot`

```rust
/// 从同一个 committed boundary group 复制出的 contracts-only view source。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusSourceSnapshot {
    /// 本 committed boundary group 的 coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// boundary group 唯一归属的 controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// boundary group 唯一归属的 execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// boundary group 唯一承接的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// 最近一次 optional establishment decision ref。
    decision_ref: Option<BoundaryEstablishmentDecisionRef>,
    /// decision ref 存在时必须同时存在的 canonical status。
    decision_status: Option<BoundaryEstablishmentDecisionStatus>,
    /// boundary group 当前 optional capability snapshot ref。
    capability_ref: Option<BackendCapabilitySummaryRef>,
    /// capability ref 存在时必须同时存在的 canonical status。
    capability_status: Option<BackendCapabilitySummaryStatus>,
    /// boundary group 当前 optional isolation handle ref。
    isolation_handle_ref: Option<IsolationEnvironmentHandleRef>,
    /// handle ref 存在时必须同时存在的 canonical status。
    handle_status: Option<IsolationEnvironmentHandleStatus>,
    /// handle 存在时按 boundary lifecycle relation出现的 optional lease ref。
    lease_ref: Option<LeaseRecordRef>,
    /// coherent boundary 在同一 committed group 中的 canonical status。
    boundary_status: CoherentBoundaryStatus,
    /// 同一 committed boundary group 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// mapper 从 committed group 读取这些关系的 observation time。
    observed_at: Timestamp,
}

impl BoundaryStatusSourceSnapshot {
    /// 校验 boundary group 的 optional pair 与 status relation，不查询 repository / backend。
    pub fn try_new(
        boundary_ref: CoherentBoundaryRef,
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        requirement_ref: BoundaryRequirementSetRef,
        decision_ref: Option<BoundaryEstablishmentDecisionRef>,
        decision_status: Option<BoundaryEstablishmentDecisionStatus>,
        capability_ref: Option<BackendCapabilitySummaryRef>,
        capability_status: Option<BackendCapabilitySummaryStatus>,
        isolation_handle_ref: Option<IsolationEnvironmentHandleRef>,
        handle_status: Option<IsolationEnvironmentHandleStatus>,
        lease_ref: Option<LeaseRecordRef>,
        boundary_status: CoherentBoundaryStatus,
        audit_trace_ref: SandboxAuditTraceRef,
        observed_at: Timestamp,
    ) -> Result<Self, StatusViewError>;

    /// 返回 committed boundary group identity。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 boundary owning context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 boundary owning execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 boundary 唯一承接的 immutable requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回最近一次 optional establishment decision ref。
    pub fn decision_ref(&self) -> Option<&BoundaryEstablishmentDecisionRef>;
    /// 返回 optional establishment decision canonical status。
    pub fn decision_status(&self) -> Option<BoundaryEstablishmentDecisionStatus>;
    /// 返回 boundary group 当前 optional capability snapshot ref。
    pub fn capability_ref(&self) -> Option<&BackendCapabilitySummaryRef>;
    /// 返回 optional capability snapshot canonical status。
    pub fn capability_status(&self) -> Option<BackendCapabilitySummaryStatus>;
    /// 返回 boundary group 当前 optional isolation handle ref。
    pub fn isolation_handle_ref(&self) -> Option<&IsolationEnvironmentHandleRef>;
    /// 返回 optional isolation handle canonical status。
    pub fn handle_status(&self) -> Option<IsolationEnvironmentHandleStatus>;
    /// 返回 lifecycle relation 中的 optional lease record ref。
    pub fn lease_ref(&self) -> Option<&LeaseRecordRef>;
    /// 返回 coherent boundary canonical status。
    pub fn boundary_status(&self) -> CoherentBoundaryStatus;
    /// 返回同一 committed boundary group 的 audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回 committed boundary group observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

`Established` boundary source 必须有 established decision、fresh capability、`Active | ReleasePending | OrphanSuspected` handle 和 lease ref，明确排除 `Released`；一旦 handle 已确认 released，同一 committed group 的 boundary 必须为 `Released`。`Required` 可没有 decision / capability / handle；`PendingCapability` 必须有 pending decision + stale/unknown capability 且无 handle；`Rejected` 必须有 rejected/unsupported decision且无 handle；`Failed` 可以无 handle，或带 `Created | Active | ReleasePending | OrphanSuspected` cleanup handle，其中 `Created` 表示 establish failure 的 partial handle，`Active` 表示 established 后发生正式 failure 且 cleanup 尚未获准；`Failed + Released handle` 是禁止的半提交组合，必须与 boundary `Released` 原子提交；`Released` 必须有 released handle与 lease ref。

### 20.4 `StatusViewError`

```rust
/// read-view source pair、visible status 或 degraded marker 关系失败。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum StatusViewError {
    /// optional ref 与 canonical status 没有同时出现或同时缺失。
    OptionalRefStatusPairMismatch {
        /// 发生 pair mismatch 的固定 owner 名，不包含外部 identity。
        owner: &'static str,
    },
    /// `Required` handoff set 为空，应使用显式 `NotRequired`。
    RequiredHandoffSetEmpty,
    /// required handoff set 重复包含同一个 handoff ref。
    DuplicateRequiredHandoff {
        /// 在 required set 中重复出现的 handoff fact ref。
        handoff_ref: HandoffFactRef,
    },
    /// source 未携带 capture pair 却携带 required handoff knowledge。
    RequiredHandoffWithoutCapture,
    /// committed source 无法唯一支持请求的 public visible status。
    VisibleStatusSourceMismatch {
        /// mapper 尝试派生但 source relation 不支持的 visible status。
        requested: SandboxExecutionVisibleStatus,
    },
    /// completed capture 缺少“required set / not required”的显式 handoff knowledge。
    MissingCompletionHandoffKnowledge,
    /// active formal failure 阻止 view 显示 ready / running / completed success。
    ActiveFailurePreventsSuccess,
    /// active redline containment 阻止 view 显示 success。
    ActiveRedlinePreventsSuccess,
    /// cleanup guard blocked 状态阻止 view 显示 success。
    CleanupBlockPreventsSuccess,
    /// degraded factory 收到空 reason set，无法解释 degraded status。
    DegradedReasonsEmpty,
    /// degraded reason set 中出现完全相同的 caller-safe reason。
    DuplicateDegradedReason,
    /// ready / running / completed success view 错误携带 degraded reasons。
    DegradedReasonsPresentOnSuccessView,
    /// boundary source 的 optional links/status 组合不支持 canonical boundary status。
    BoundarySourceStatusMismatch {
        /// 与 source relation 冲突的 coherent boundary status。
        boundary_status: CoherentBoundaryStatus,
    },
    /// source observed time 不满足 canonical timestamp contract。
    StatusViewTimestampInvalid,
}
```

## 21. Public read-view exact contract

### 21.1 `StatusViewDegradedReasonSet`

```rust
/// 读取面可安全暴露的非空、ordered-unique degraded reason set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StatusViewDegradedReasonSet(
    /// 按 mapper 输入顺序保存且不重复的 caller-safe degraded reasons。
    Vec<SandboxReason>,
);

impl StatusViewDegradedReasonSet {
    /// 构造非空、ordered-unique degraded reason set；不自动去重。
    pub fn try_new(
        reasons: Vec<SandboxReason>,
    ) -> Result<Self, StatusViewError>;
    /// 返回不可变 degraded reason 切片。
    pub fn as_slice(&self) -> &[SandboxReason];
    /// 判断 reason set 是否为空；checked instance 必须恒为 false。
    pub fn is_empty(&self) -> bool;
}
```

重复 reason 必须拒绝，不自动去重。reason 只能来自 projection stale / missing、reference unavailable、handoff source missing 或 visibility-safe mapper；不得保存 SQL、backend error、external body 或 existence-sensitive ref。

### 21.2 `SandboxExecutionStatusView`

```rust
/// 面向 caller 的 execution status 只读视图；所有字段都来自同一个 committed snapshot。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxExecutionStatusView {
    /// 本 execution read model snapshot 的 typed identity。
    view_ref: SandboxExecutionStatusViewRef,
    /// view 唯一归属的 controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// committed source 中 optional execution environment identity ref。
    environment_identity_ref: Option<ExecutionEnvironmentIdentityRef>,
    /// committed source 中 optional coherent boundary ref。
    boundary_ref: Option<CoherentBoundaryRef>,
    /// committed source 中 optional policy execution decision ref。
    policy_decision_ref: Option<PolicyExecutionDecisionRef>,
    /// committed source 中 optional controlled execution run ref。
    run_ref: Option<ControlledExecutionRunRef>,
    /// committed source 中 optional capture fact ref。
    capture_ref: Option<CaptureFactRef>,
    /// committed source 中 optional formal failure classification ref。
    failure_ref: Option<FailureClassificationRef>,
    /// committed source 中 optional cleanup guard ref。
    cleanup_guard_ref: Option<CleanupGuardRef>,
    /// committed source 中 optional redline containment ref。
    redline_ref: Option<RedlineContainmentRef>,
    /// context 在 source snapshot 中的 canonical intake status。
    intake_status: ControlledExecutionIntakeStatus,
    /// 由 closed priority rules 从 committed source 唯一派生的 public status。
    visible_status: SandboxExecutionVisibleStatus,
    /// caller-safe degraded reasons；success view 必须为空。
    degraded_reasons: Vec<SandboxReason>,
    /// source snapshot 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// source snapshot 的 observation time，不表示 truth transition time。
    observed_at: Timestamp,
}

impl SandboxExecutionStatusView {
    /// 从完整 committed source 派生非 degraded view；不查询或修改任何 truth。
    pub fn from_committed_snapshot(
        view_ref: SandboxExecutionStatusViewRef,
        source: SandboxExecutionStatusSourceSnapshot,
    ) -> Result<Self, StatusViewError>;

    /// 从安全但不完整的 committed source 派生 view，并保留 degraded reasons。
    pub fn from_degraded_snapshot(
        view_ref: SandboxExecutionStatusViewRef,
        source: SandboxExecutionStatusSourceSnapshot,
        degraded_reasons: StatusViewDegradedReasonSet,
    ) -> Result<Self, StatusViewError>;

    /// 返回 execution read model snapshot identity。
    pub fn view_ref(&self) -> &SandboxExecutionStatusViewRef;
    /// 返回 view 唯一归属的 controlled execution context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 committed source 中 optional execution environment identity ref。
    pub fn environment_identity_ref(&self) -> Option<&ExecutionEnvironmentIdentityRef>;
    /// 返回 committed source 中 optional coherent boundary ref。
    pub fn boundary_ref(&self) -> Option<&CoherentBoundaryRef>;
    /// 返回 committed source 中 optional policy decision ref。
    pub fn policy_decision_ref(&self) -> Option<&PolicyExecutionDecisionRef>;
    /// 返回 committed source 中 optional controlled execution run ref。
    pub fn run_ref(&self) -> Option<&ControlledExecutionRunRef>;
    /// 返回 committed source 中 optional capture fact ref。
    pub fn capture_ref(&self) -> Option<&CaptureFactRef>;
    /// 返回 committed source 中 optional formal failure ref。
    pub fn failure_ref(&self) -> Option<&FailureClassificationRef>;
    /// 返回 committed source 中 optional cleanup guard ref。
    pub fn cleanup_guard_ref(&self) -> Option<&CleanupGuardRef>;
    /// 返回 committed source 中 optional redline containment ref。
    pub fn redline_ref(&self) -> Option<&RedlineContainmentRef>;
    /// 返回 context canonical intake status。
    pub fn intake_status(&self) -> ControlledExecutionIntakeStatus;
    /// 返回由 closed priority rules 派生的 public visible status。
    pub fn visible_status(&self) -> SandboxExecutionVisibleStatus;
    /// 返回 caller-safe degraded reasons；不暴露内部 cause 或 external body。
    pub fn degraded_reasons(&self) -> &[SandboxReason];
    /// 返回 source snapshot 对应的 audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回 source snapshot observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 判断 view 是否携带至少一个 caller-safe degraded reason。
    pub fn is_degraded(&self) -> bool;
    /// 判断 view 是否可显示 ready / running / completed success 且没有 degraded reason。
    pub fn can_show_success(&self) -> bool;
}
```

visible status derivation priority：

| priority | committed source condition | derived status | additional guard |
|---:|---|---|---|
| 1 | intake `Rejected | Unresolved`；boundary `Rejected | Failed`；policy `Rejected | Blocked | FailClosed`；run `Failed | Terminated`；capture `Failed | Unavailable`；failure present and not superseded;cleanup `Blocked`;redline `Detected | Contained | HandoffPending | Terminal` | `VisibleFailed` | known failure 不能被 degraded reasons 掩盖。 |
| 2 | degraded reason set 非空且没有 priority 1 known failure | `VisibleDegraded` | 不允许 `can_show_success == true`。 |
| 3 | intake `PendingResolution`；boundary absent / `Required | PendingCapability`；policy absent / `Pending`；identity absent | `VisiblePending` | 后序 refs 缺失是正常前置 pending，不猜 ready。 |
| 4 | context accepted + identity active + boundary established + policy accepted + run absent或`Preparing` | `VisibleReady` | 无 active failure / redline / cleanup block。 |
| 5 | run `Running` | `VisibleRunning` | boundary established、policy accepted、identity active；capture 必须 absent。 |
| 6 | run `Completed` + capture `Complete` + required handoff knowledge present且全部 delivered / not required + 无 active failure / redline / cleanup block | `VisibleCompleted` | 缺任一 source 必须 degraded或failed，不能 completed。 |

`ControlledExecutionIntakeStatus::Closed` 不单独决定 visible result：若 source 保留完整 completed chain，可展示 `VisibleCompleted`；若保留 failure chain，展示 `VisibleFailed`；若 chain 不完整，展示 `VisibleDegraded`。`CaptureFactStatus::Partial` 或 required handoff pending / failed 在 run completed 后展示 `VisibleDegraded`，并必须有 safe degraded reason。

`from_committed_snapshot` 要求能由 source 唯一推导 `Pending | Ready | Running | Completed | Failed`；若 source 关系不足以唯一判断，返回 `VisibleStatusSourceMismatch`，application 必须显式调用 degraded factory。`from_degraded_snapshot` 仍先应用 known-failure priority；因此 view 可以是 `VisibleFailed` 且附 degraded reasons，但 `VisibleReady | VisibleRunning | VisibleCompleted` 绝不能携带 degraded reasons。

### 21.3 `BoundaryStatusView`

```rust
/// 面向 caller 的 boundary / capability / handle 只读状态摘要。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BoundaryStatusView {
    /// 本 boundary read model snapshot 的 typed identity。
    view_ref: BoundaryStatusViewRef,
    /// committed boundary group 的 coherent boundary ref。
    boundary_ref: CoherentBoundaryRef,
    /// boundary 所属的 controlled execution context ref。
    context_ref: ControlledExecutionContextRef,
    /// boundary 所属的 execution environment identity ref。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// boundary 唯一承接的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
    /// committed group 中 optional latest establishment decision ref。
    decision_ref: Option<BoundaryEstablishmentDecisionRef>,
    /// committed group 中 optional capability snapshot ref。
    capability_ref: Option<BackendCapabilitySummaryRef>,
    /// committed group 中 optional isolation environment handle ref。
    isolation_handle_ref: Option<IsolationEnvironmentHandleRef>,
    /// committed group lifecycle relation中的 optional lease record ref。
    lease_ref: Option<LeaseRecordRef>,
    /// coherent boundary 在 source group 中的 canonical status。
    boundary_status: CoherentBoundaryStatus,
    /// optional decision ref 对应的 canonical status。
    decision_status: Option<BoundaryEstablishmentDecisionStatus>,
    /// optional capability ref 对应的 canonical status。
    capability_status: Option<BackendCapabilitySummaryStatus>,
    /// optional handle ref 对应的 canonical lifecycle status。
    handle_status: Option<IsolationEnvironmentHandleStatus>,
    /// caller-safe degraded reasons；完整 committed view 必须为空。
    degraded_reasons: Vec<SandboxReason>,
    /// source boundary group 对应的 audit trace ref。
    audit_trace_ref: SandboxAuditTraceRef,
    /// source boundary group 的 observation time，不表示 truth transition time。
    observed_at: Timestamp,
}

impl BoundaryStatusView {
    /// 从 relation-checked committed boundary group 构造非 degraded view。
    pub fn from_committed_snapshot(
        view_ref: BoundaryStatusViewRef,
        source: BoundaryStatusSourceSnapshot,
    ) -> Result<Self, StatusViewError>;

    /// 从安全但不完整的 boundary group 构造 degraded view；不改变 canonical boundary status。
    pub fn from_degraded_snapshot(
        view_ref: BoundaryStatusViewRef,
        source: BoundaryStatusSourceSnapshot,
        degraded_reasons: StatusViewDegradedReasonSet,
    ) -> Result<Self, StatusViewError>;

    /// 返回 boundary read model snapshot identity。
    pub fn view_ref(&self) -> &BoundaryStatusViewRef;
    /// 返回 committed coherent boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回 boundary owning controlled execution context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回 boundary owning execution environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回 boundary 唯一承接的 immutable requirement set ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回 optional latest establishment decision ref。
    pub fn decision_ref(&self) -> Option<&BoundaryEstablishmentDecisionRef>;
    /// 返回 optional capability snapshot ref。
    pub fn capability_ref(&self) -> Option<&BackendCapabilitySummaryRef>;
    /// 返回 optional isolation environment handle ref。
    pub fn isolation_handle_ref(&self) -> Option<&IsolationEnvironmentHandleRef>;
    /// 返回 boundary lifecycle relation中的 optional lease record ref。
    pub fn lease_ref(&self) -> Option<&LeaseRecordRef>;
    /// 返回 coherent boundary canonical status。
    pub fn boundary_status(&self) -> CoherentBoundaryStatus;
    /// 返回 optional establishment decision canonical status。
    pub fn decision_status(&self) -> Option<BoundaryEstablishmentDecisionStatus>;
    /// 返回 optional capability snapshot canonical status。
    pub fn capability_status(&self) -> Option<BackendCapabilitySummaryStatus>;
    /// 返回 optional isolation handle canonical status。
    pub fn handle_status(&self) -> Option<IsolationEnvironmentHandleStatus>;
    /// 返回 caller-safe degraded reasons。
    pub fn degraded_reasons(&self) -> &[SandboxReason];
    /// 返回 source boundary group 对应的 audit trace ref。
    pub fn audit_trace_ref(&self) -> &SandboxAuditTraceRef;
    /// 返回 source boundary group observation time。
    pub fn observed_at(&self) -> &Timestamp;

    /// 判断 boundary view 是否携带至少一个 degraded reason。
    pub fn is_degraded(&self) -> bool;
    /// 判断 canonical boundary status 是否为 `Established`。
    pub fn is_established(&self) -> bool;
    /// 判断 boundary/decision/capability/handle/lease relation 是否足以显示 launch-ready boundary。
    pub fn can_show_launch_ready_boundary(&self) -> bool;
}
```

`BoundaryStatusView` 不定义第二个 `BoundaryVisibleStatus`。它直接显示 `6R-01` canonical boundary / decision / capability / handle status，避免状态 owner 漂移。`can_show_launch_ready_boundary` 只有以下全部成立才返回 true：boundary `Established`、decision `Established`、capability `Fresh`、handle `Active`、lease ref 存在、degraded reasons 为空。它仍不证明 policy accepted 或 run 可启动。

### 21.4 View no-write / no-second-truth invariant

两个 view：

- 没有 `mark_*`、`refresh`、`repair`、`release`、`retry`、repository 或 port method。
- 不接受 domain aggregate reference；只消费 contracts-only committed source snapshot。
- 不从缺失 ref 推断 success，不从 timestamp 推断 lifecycle，不从 capability status 推断 backend product health。
- view ref 是 read-model identity，不得转换成 context、boundary、decision、handle 或 truth ref。
- query 只能读取 existing source / projection；projection stale 时返回 degraded view或 query surface error，不能触发 refresh / rebuild / backend probe。

## 22. `6R-02` closure audit

本节只记录设计契约静态闭环，不代表 Rust 实现、编译、测试、运行或验收已经发生。对象正文仍以 §10~§21 为唯一 canonical definition，本节只做差集和承接审计。

### 22.1 24/24 canonical inventory audit

| # | canonical object / family | 字段来源闭环 | factory / member 闭环 | status / transition / error / ref | direct consumer | forward owner | 结果 |
|---:|---|---|---|---|---|---|---|
| 1 | `ExecutionResponsibilityContext` | trusted actor、Work refs、request origin、safe reason | `try_new` + 4 getters | stateless；`ResponsibilityContextError`；无 repository ref | context opening、anchor | Step 8 entry metadata mapper | closed |
| 2 | `ExecutionResponsibilityAnchor` | 只从 checked responsibility + request trace 复制 | `try_from_context`;`matches_context`;getters | immutable；`ResponsibilityAnchorError`；随 identity 保存 | identity bind / compare | Step 7 opening UoW | closed |
| 3 | `ContextReferenceResolution` | resolver body-free refs / summaries / markers + clock | 4 status factories + relation getters | immutable 4-status snapshot；`ContextResolutionError`；named ref | execution resolution、intake guard | Step 7 resolver port / mapper | closed |
| 4 | `ExecutionContextResolution` | exact reference snapshot + required / deferred / unresolved / conflict sets | 4 status factories + support predicates | immutable 4-status value；`ContextResolutionError`；named ref | context transition、intake guard、identity | Step 7 resolver outcome mapper | closed |
| 5 | `ControlledExecutionContext` | generated ref、declared sources、responsibility、trace、decision / resolution、clock、audit | `open_pending`;6 exact transition methods;getters / boundary precondition | 5-state closed graph；`ControlledExecutionContextError`；named ref | identity、requirements、execution status view | Step 7 repository/UoW；Step 10 matrix revalidation | closed |
| 6 | `ExecutionEnvironmentIdentity` | generated ref + accepted context + resolved ref + immutable anchor + clock / audit | `bind`;`close`;`invalidate`;`require_active_for`;getters | 3-state closed graph；`ExecutionEnvironmentIdentityError`；named ref | requirements、boundary、views | Step 7 repository/UoW；Step 10 matrix revalidation | closed |
| 7 | intake support family | required / unresolved / deferred kinds、conflict pair、forbidden markers、checked decisions | all set factories、decision getters / predicates | no independent lifecycle；errors stay with resolution / exclusion / intake guard | guards、context transitions | Step 8 DTO secondary types only where public | closed |
| 8 | `ControlledExecutionIntakeGuard` | generated guard ref、strict kind set、exclusion guard ref、activation / evaluation time | `try_new`;pure `evaluate`;getters | immutable rule；`ControlledExecutionIntakeGuardError`；named ref | context acceptance / pending / rejection | Step 7 guard repository / loader | closed |
| 9 | `ExternalBodyExclusionGuard` | generated guard ref、complete marker coverage、activation / evaluation time | `try_strict`;pure `evaluate`;getters | immutable rule；`ExternalBodyExclusionGuardError`；named ref | intake guard | Step 7 guard repository / loader | closed |
| 10 | resource / filesystem / network / process requirements | explicit request + validated profile/template；numeric units and safety bools explicit | named resource factories、4/4 set factory、per-dimension checked factories/getters | immutable values；exact `BoundaryRequirementError`;embedded in requirement set | coherence guard、capability comparison | Step 8 command input mapping；Step 13 config binding | closed |
| 11 | workspace / mount / lifecycle requirements | Work refs、safe summaries、validated mount/lifecycle profile | checked factories、ordered-unique rules、renewal / safety predicates | immutable values；exact `BoundaryRequirementError`;embedded | coherence guard、lease/cleanup downstream | `LeaseRecord` / cleanup in `6R-04`;Step 13 config binding | closed |
| 12 | `BoundaryGenerationBinding` | canonical generation + profile/template/runtime/capability source versions | `try_new`;getters / `same_generation` | immutable；generation-specific errors；embedded | requirement compose、capability / handle match | Step 7 source loader | closed |
| 13 | `BoundaryRequirementSet` | accepted context、active identity、generation binding、10 exact dimensions、clock | `compose`;dimension getters / predicates | immutable complete truth；`BoundaryRequirementError`；named ref | coherence/capability guards、boundary/handle | Step 7 compose helper / repository | closed |
| 14 | capability verdict support | adapter-mapped kind/verdict/proof summary/safe reason | 3 verdict factories、10/10 set factory、lookup / aggregate predicates | immutable closed verdict kinds；`BackendCapabilitySummaryError`;embedded | capability summary / guard | Step 7 backend adapter mapper | closed |
| 15 | `BackendCapabilitySummary` | isolation backend ref、exact requirement / generation、10 verdicts、clock/freshness | 4 status factories + support / refresh / fail-closed predicates | immutable 4-status snapshot；exact error；named ref | capability guard、decision、handle、view | refresh job in `6R-05`;clock port Step 7 | closed |
| 16 | `BoundaryEstablishmentDecision` | requirement + both guard decisions + capability + optional created handle + clock/audit | 5 immutable outcome factories + cleanup predicate | 5-status immutable attempt；exact error；named ref | coherent boundary / status view | Step 7 establishment flow / stored result | closed |
| 17 | `LeaseWindow` | backend creation time + lifecycle hard duration / renewal cutoff | `try_new`;`position_at_elapsed`;`validate_against`;getters | immutable position helper；`LeaseWindowError`;embedded | handle、future lease record | checked elapsed clock + `LeaseRecord` in `6R-04` | closed |
| 18 | `IsolationEnvironmentHandle` | descriptor、context/identity/requirement/capability/boundary/generation、mandatory pre-generated lease ref/window、clock/audit | `create`;4 exact transitions;relation predicates/getters | 5-state closed graph；exact error；named ref | boundary、cleanup/reaper、views | 4 exact methods owned by `6R-04`;Step 7 UoW | closed |
| 19 | `CoherentBoundary` | requirement lineage、latest decision/capability/handle/failure refs、generation、clock/audit | `require`;6 exact transition methods;established-links getter | 6-state closed graph；exact error；named ref | policy/run guards、cleanup、views | failure/cleanup methods in `6R-04`;Step 7 UoW | closed |
| 20 | boundary guard decision support | exact guard/requirement/capability refs、kind lists、safe reason、evaluation time | private construction by guards；getters / predicates | immutable decision values；no repository identity | establishment decision | Step 7 orchestration local value | closed |
| 21 | `BoundaryCoherenceGuard` | generated guard ref、canonical 10-kind coverage、activation / evaluation time | `try_strict`;pure `evaluate`;getters | immutable rule；exact guard error；named ref | establishment decision | Step 7 guard repository / loader | closed |
| 22 | `BackendCapabilityGuard` | generated guard ref + exact requirement/capability binding + time | `bind`;pure `evaluate`;getters | immutable rule；exact guard error；named ref | establishment decision | Step 7 guard repository / loader | closed |
| 23 | `SandboxExecutionStatusView` | one checked committed source snapshot + optional non-empty degraded reason set | complete/degraded factories + read predicates/getters | derived visible status only；`StatusViewError`；view ref | 13 Query response mapping | Step 7 projection reader；Step 8 response DTO | closed |
| 24 | `BoundaryStatusView` | one checked committed boundary group + optional non-empty degraded reason set | complete/degraded factories + readiness predicates/getters | displays canonical statuses, no second enum；`StatusViewError`；view ref | boundary/capability Queries | Step 7 projection reader；Step 8 response DTO | closed |

Inventory result: `24 expected / 24 canonical / 24 closed / 0 missing / 0 duplicate canonical owner`。`EstablishedBoundaryLinks<'a>`、source snapshot、decision/set/error 等二级类型均已在 owning family 同节给出 schema，不新增独立 truth owner。

### 22.2 Field-source and data-boundary audit

| field group | generated / trusted input | body-free external input | committed owner / lookup | clock / audit | forbidden source | 结果 |
|---|---|---|---|---|---|---|
| responsibility / context / identity | named refs、core actor/origin/trace | Work / Tool / Runtime / MemberHost / Runner refs and safe summaries | resolution refs、guard decisions、accepted context lineage | all timestamps and audit refs passed explicitly | anonymous actor、external body、authorization inference | closed |
| ten-dimensional requirements | requirement ref + explicit request | validated profile/template/work/mount summaries and versioned generation refs | accepted context + active identity | `created_at` explicit | raw path、backend flag、policy decision、weak defaults | closed |
| capability / establishment | capability/decision/guard refs | isolation backend ref and body-free proof summaries | exact immutable requirement and created handle relation | observed/valid/decided/audit explicit | raw SDK response/error、backend product name、host identity | closed |
| handle / lease linkage | handle/boundary/lease refs pre-generated as one relation | stable opaque backend handle source + lifecycle summary | requirement/capability/context/identity/generation links | created/status/observation/audit explicit | container/pod/host body、credential、socket、path | closed |
| read views | view ref + contracts-only source helpers | none directly; only committed safe refs/reasons | one committed truth/projection snapshot | observation/audit explicit | query-side repair/probe、domain mutation、existence-sensitive raw detail | closed |

Every persisted or public field has one of four explicit source classes: caller/trusted entry, body-free adapter/resolver mapping, committed owner relation, or application-supplied id/time/audit. No field is sourced from a route string, status guess, default allow, external body, raw error, or query-time mutation.

### 22.3 Status and transition closure audit

| owner | initial / factory status | allowed transition owner | terminal / immutable rule | exact failure owner | 结果 |
|---|---|---|---|---|---|
| `ContextReferenceResolution` | `complete/stale/unavailable/invalid` factories | none; refresh creates new ref | all snapshots immutable | `ContextResolutionError` | closed |
| `ExecutionContextResolution` | `resolved/partial/unresolved/conflicted` factories | none; re-evaluation creates new ref | all values immutable | `ContextResolutionError` | closed |
| `ControlledExecutionContext` | `open_pending -> PendingResolution` | `accept`;`record_partial_resolution`;`mark_unresolved`;`resume_resolution`;`reject`;`close` | `Rejected | Closed` terminal；`Unresolved` must resume before new decision | `ControlledExecutionContextError` | closed |
| `ExecutionEnvironmentIdentity` | `bind -> Active` | `close`;`invalidate` | `Closed | Invalidated` terminal | `ExecutionEnvironmentIdentityError` | closed |
| `BackendCapabilitySummary` | 4 status-specific factories | none; refresh creates new ref | snapshot immutable | `BackendCapabilitySummaryError` | closed |
| `BoundaryEstablishmentDecision` | 5 outcome-specific factories | none; retry creates new attempt ref | decision immutable | `BoundaryEstablishmentDecisionError` | closed |
| `IsolationEnvironmentHandle` | `create -> Created` | `activate`;`mark_release_pending`;`mark_released`;`suspect_orphan` | `Released` terminal；orphan cannot reactivate | `IsolationEnvironmentHandleError` | closed |
| `CoherentBoundary` | `require -> Required` | pending/rejected/established/establishment-failed/runtime-failed/released methods | `Rejected | Released` terminal；failed release requires matching handle | `CoherentBoundaryError` | closed |
| guard decisions / views | pure evaluate / derive | no mutation method | immutable; views never write truth | owning guard error / `StatusViewError` | closed |

Old Step 10 remains `downstream_revalidation_pending`: it still contains old status names, old signatures and generic `DomainError::InvalidStateTransition`. This is a recorded consumer conflict, not an alternate transition source and not a blocker to completing the current Step 6 object contract.

### 22.4 Ref, consumer, and forward-dependency audit

| forward owner | exact callable / obligation fixed here | `6R-02` consumer | allowed deferral | blocker behavior |
|---|---|---|---|---|
| `LeaseRecord` (`6R-04`) | `supports_orphan_suspicion_for(&IsolationEnvironmentHandleRef) -> bool` | `IsolationEnvironmentHandle::suspect_orphan` | record fields/status/transitions only | missing or weaker callable blocks `6R-04` completion |
| `FailureClassification` (`6R-04`) | `blocks_boundary_for(&CoherentBoundaryRef, &IsolationEnvironmentHandleRef) -> bool` | `CoherentBoundary::mark_failed` | classification object body only | caller-computed bool is forbidden |
| `CleanupGuard` (`6R-04`) | `permits_release_for(&ControlledExecutionContextRef, &CoherentBoundaryRef, &IsolationEnvironmentHandleRef, &LeaseRecordRef) -> bool` | handle进入`ReleasePending` / same-target release recovery | cleanup evidence/state body only | guard ref、config或operator flag不能替代；boundary completion消费`CleanupCompletionBasis` |
| `CleanupGuard` (`6R-04`) | `permits_context_closure_for(&ControlledExecutionContextRef, &RedlineContainmentCoverageSnapshot, &[RedlineContainment]) -> Result<bool, CleanupGuardError>` | context / identity closure | cleanup completion truth + fresh complete redline coverage | missing/incomplete coverage keeps context/identity open |
| Step 7 clock port | canonical timestamp validation + checked elapsed milliseconds | freshness, lease position, transition ordering | exact trait signature to Step 7 | `BLK-SBX-VERSION-001` blocks Activation until core compatibility is fixed |
| Step 7 UoW / repositories | atomic context+identity and requirement+boundary+decision+handle+lease groups | all truth entities | trait/transaction details to Step 7/11 | partial-success persistence is forbidden |
| Step 8 protocols | named refs/shared statuses/read views only | Commands / Queries | DTO fields to Step 8 | domain-only type or old alias blocks protocol closure |
| Step 10 state matrices | exact methods/errors/status owners from this file | all lifecycle subjects | matrix presentation to Step 10 | old signature/name must be replaced, not aliased |

Current dynamic closure metadata after `6R-04` batch 4:

| forward item | current canonical output / relation | current state | remaining action |
|---:|---|---|---|
| #1 `LeaseRecord::supports_orphan_suspicion_for` | exact handle ref relation -> owner-computed `bool` | closed_in_6r_04_batch_3_review_confirmed | canonical body唯一在failure-cleanup-read §13.2，batch 4只定向扩展release surface；本文件consumer无需补判断 |
| #2 `FailureClassification::blocks_boundary_for` | exact boundary + handle relation -> owner-computed `bool` | closed_in_6r_04_batch_2_review_confirmed | canonical body唯一在failure-cleanup-read §12.1；本文件consumer无需补判断 |
| #3 `CleanupGuard::permits_release_for` | exact context + boundary + handle + lease relation -> release authorization permission | revalidated_by_6r_04_16_7_writeback | canonical body与negative cut唯一在failure-cleanup-read §14.2 / §14A.5；只供handle进入`ReleasePending`或same-target恢复，boundary closure直接消费matching completion basis |
| #4 `CleanupGuard::permits_context_closure_for` | exact context + fresh complete all-Released redline coverage -> checked owner permission | reclosed_by_6r_04_16_7_writeback | canonical body与negative cut唯一在failure-cleanup-read §14.0 / §14.2 / §14A.5；matching Completed truth仍不足以替代fresh coverage |

该动态表只更新forward consumer的关闭状态，不改写已确认的`6R-02`对象正文，也不复制lease / cleanup owner判断到handle、boundary、context或identity。

All 15 Sandbox-owned identities in the `S6T-02` family use the named refs fixed by `6R-01`; embedded values and decisions without repository identity do not invent a ref. Ref-role unresolved count is `0`.

### 22.5 Historical-invalid difference audit

| historical material / pattern | current canonical replacement | active schema / signature survivor | conclusion |
|---|---|---:|---|
| `SandboxOpaqueRef` for profile/generation/mount/backend handle | role-specific `ExternalSourceRef` / `SafeSummaryRef` / named local ref + generation equality | 0 | diagnosis mention only; no compatibility alias |
| shared `ReferenceResolutionStatus` | `ExecutionContextResolutionStatus`;`ContextReferenceResolutionStatus`;tracked owner remains `6R-04` | 0 | no cast or superset status |
| `BoundaryDecisionStatus`;`BoundaryCoherenceStatus`;`BackendCapabilityStatus`;`IsolationHandleStatus` | exact object-owned canonical status enums from `6R-01` | 0 | old Step 10 consumer must be rewritten |
| generic `DomainError::InvalidStateTransition` | object-owned exact transition errors with ref/from/to/relation payload | 0 | no string fallback |
| seven-dimension / merged mount-lifecycle requirement | 4 resource + filesystem/network/process/workspace/mount/lifecycle = 10 exact kinds | 0 | completeness is mechanical 10/10 |
| single capability bool / kind list | ten exact verdicts + proof/reason + freshness/generation | 0 | unknown/stale/unsupported fail closed |
| raw backend handle / lifecycle body | checked descriptor and observation with stable opaque source + safe summary | 0 | raw adapter material excluded |
| boundary duplicating limit summaries | immutable `BoundaryRequirementSetRef` relation | 0 | one requirement truth only |
| public-field view / query-side repair | private view fields + checked committed source + degraded factory | 0 | no-write / no-second-truth |
| loose or optional handle lease relation | mandatory pre-generated `LeaseRecordRef` + checked `LeaseWindow` | 0 | record lifecycle remains exactly deferred to `6R-04` |

Historical-invalid result: current code-contract blocks contain `0` active old aliases, `0` old status owners, `0` generic transition errors, and `0` backend-specific domain kinds. Historical names may appear only in diagnosis/audit prose.

### 22.6 Static document difference audit

| audit dimension | expected | actual | unresolved |
|---|---:|---:|---:|
| canonical inventory | 24 | 24 | 0 |
| `S6T-02-*` registry rows | 17 | 17 mapped to canonical sections | 0 |
| boundary dimensions | 10 | 10 uniquely covered | 0 |
| public type Chinese Rustdoc missing | 0 | 0 | 0 |
| public callable Chinese Rustdoc missing | 0 | 0 | 0 |
| public enum variant Chinese Rustdoc missing | 0 | 0 | 0 |
| named public struct field Chinese Rustdoc missing | 0 | 0 | 0 |
| public tuple field Chinese Rustdoc missing | 0 | 0 | 0 |
| payload-bearing enum field Chinese Rustdoc missing | 0 | 0 | 0 |
| exact `6R-04` forward methods | 4 | 4 registered | 0 |
| active historical-invalid survivor | 0 | 0 | 0 |

These are static design-document audits only. They do not claim compilation, unit tests, integration tests, runtime runs, evidence aliases, implementation commits, or acceptance sign-off.

### 22.7 Batch conclusion and review gate

| gate item | result |
|---|---|
| capability-to-object ownership | pass; every `SBX-CAP-CTX/BND/GRD/VIEW` capability has one canonical owner |
| private fields and exact field sources | pass; §10~§21 plus §22.2 |
| fallible factory / exact member / error | pass; no placeholder callable or generic transition error |
| state and transition closure | pass for Step 6 object contract; old Step 10 explicitly remains downstream revalidation pending |
| body-free / security redline | pass; no external body, weak fallback, host-run or raw adapter material enters domain/view |
| ref and consumer closure | pass; named ref / embedded-value split is explicit; all forward methods are registered |
| implementation authority | unchanged: `CB-SBX-01A blocked / wait_design` |
| current downstream batch | `6R-04 batch_6 §16.7 RedlineContainmentView completed_wait_user_review` |

Current recovery point:

```text
document = 03-详细设计.md
step = Step 6 regression / 6R-04
status = batch_6_16_7_redline_containment_view_completed_wait_user_review
next_allowed_action = wait_user_review_before_§16.8
formal_03_to_07 = unchanged / invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
```

No new L1/L2 semantic blocker was found. The existing `BLK-SBX-VERSION-001` remains an implementation Activation gate for canonical timestamp and exact core revision compatibility; it does not justify inventing string time comparison or weakening lease/freshness contracts.
