# Step6 U6 审计/恢复对象小循环

## 思考、诊断与取舍

capability：审计/恢复，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| OperationContext | 不以key单独判断相同；command key来自meta.request；worker仅其正式wrapper | domain / immutable/value | operation_kind,scope_ref,metadata_ref,intent_fingerprint；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| OperationRecord | 与accepted变化/audit/work同UoW保存完整原值；初始Reserved；持久冲突不能假success | domain / statecarrier | operation_ref,context,result_ref,state,revision；Reserved/Completed | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| StoredOperationResult | immutable仅typed读取/校验；rehydrate后移03；同UoW保存原结果，不用当前projection重建 | domain / immutable/value | result_ref,operation_ref,result_kind,safe_result,schema_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| MarketAuditRecord | immutable仅typed读取/校验；rehydrate后移03；同UoW追加，不覆旧；纠错新record | domain / immutable/value | audit_ref,subject_ref,operation_ref,actor_ref,basis_refs,cursor；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| DeferredWork | fence持久化，过期claim需判断effectunknown；只本地责任完成/结果已存；缺合同或unknown需probe，不任意再发；accepted同UoW初始Pending | domain / statecarrier | work_ref,operation_ref,target_ref,intent_ref,fence,result_ref,state,revision；Pending/Claimed/Settled/Blocked | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| RecoveryIntent | scope/目标/原意图核对；report完整逐项保存，缺probe保持Blocked；初始Requested，只受理局部恢复 | domain / statecarrier | recovery_ref,target_ref,authority_ref,report_ref,state,revision；Requested/Running/Completed/Blocked | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ObservationOutcomeBinding | 正式producer/材料/intent binding；ACK不能生成admitted | contracts / immutable/value | outcome_ref,operation_ref,audit_refs,scope_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| RecoveryPolicy | typed目标/现状/authority；unknown必须probe；confirmed/known-not-committed/unknown，禁止猜结果；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| AuditRecoveryView | immutable仅typed读取/校验；rehydrate后移03；不能输出secret/rawlog/evidence/verdict | contracts / readview | operation_ref,audit_refs,work_refs,recovery_refs,observation_binding；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### OperationContext

```rust
/// Carries OperationContext with explicit sources and no upstream body.
pub struct OperationContext {
    /// Carries operation_kind; see the source and invariant table.
    pub operation_kind: MarketOperationKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries metadata_ref; see the source and invariant table.
    pub metadata_ref: SharedMetadataReference,
    /// Carries intent_fingerprint; see the source and invariant table.
    pub intent_fingerprint: MarketIntentFingerprint,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_kind | `MarketOperationKind` | Entry有限command/job分类 |
| scope_ref | `MarketScopeRef` | 正式scope resolver输出 |
| metadata_ref | `SharedMetadataReference` | 引用Core command/query或本地worker wrapper，不重复字段authority |
| intent_fingerprint | `MarketIntentFingerprint` | 本地规范意图指纹算法03收口，非资产digest |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn same_intent(&self, candidate: OperationContext) -> bool` | 不以key单独判断相同 | OperationContext candidate：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_entry(input: QualifiedOperationInput) -> Result<Self, DomainError>` | QualifiedOperationInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | command key来自meta.request；worker仅其正式wrapper；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: OperationContextRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### OperationRecord

```rust
/// Carries OperationRecord with explicit sources and no upstream body.
pub struct OperationRecord {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries context; see the source and invariant table.
    pub context: OperationContext,
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: OptionalStoredOperationResultRef,
    /// Carries state; see the source and invariant table.
    pub state: OperationRecordState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | 本地ID |
| context | `OperationContext` | operation/scope/key/intent规范组合 |
| result_ref | `OptionalStoredOperationResultRef` | Completed必有完整结果 |
| state | `OperationRecordState` | Reserved/Completed |
| revision | `MarketRevision` | 唯一键/CAS来源 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn complete(&mut self, result: StoredOperationResult) -> Result<(), DomainError>` | 与accepted变化/audit/work同UoW保存完整原值 | StoredOperationResult result：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn reserve(input: QualifiedOperationInput) -> Result<Self, DomainError>` | QualifiedOperationInput的独立字段schema见shared_types；Reserved；result_ref=None | 初始Reserved；持久冲突不能假success；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: OperationRecordRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Reserved；result_ref=None。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### StoredOperationResult

```rust
/// Carries StoredOperationResult with explicit sources and no upstream body.
pub struct StoredOperationResult {
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: StoredOperationResultRef,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries result_kind; see the source and invariant table.
    pub result_kind: MarketResultKind,
    /// Carries safe_result; see the source and invariant table.
    pub safe_result: MarketResultSurface,
    /// Carries schema_ref; see the source and invariant table.
    pub schema_ref: MarketResultSchemaRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| result_ref | `StoredOperationResultRef` | 本地ID |
| operation_ref | `MarketOperationRef` | 与record绑定 |
| result_kind | `MarketResultKind` | 有限command/job类型，不能错kind读取 |
| safe_result | `MarketResultSurface` | 完整原receipt/status/subject/item/outcome/gap/cursor安全字段 |
| schema_ref | `MarketResultSchemaRef` | 本地正式schema版本03闭合，不伪造已发布版本 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn capture(input: OperationResultInput) -> Result<Self, DomainError>` | OperationResultInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 同UoW保存原结果，不用当前projection重建；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: StoredOperationResultRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### MarketAuditRecord

```rust
/// Carries MarketAuditRecord with explicit sources and no upstream body.
pub struct MarketAuditRecord {
    /// Carries audit_ref; see the source and invariant table.
    pub audit_ref: MarketAuditRef,
    /// Carries subject_ref; see the source and invariant table.
    pub subject_ref: MarketAuditSubjectRef,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries actor_ref; see the source and invariant table.
    pub actor_ref: ActorReference,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries cursor; see the source and invariant table.
    pub cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| audit_ref | `MarketAuditRef` | 本地ID |
| subject_ref | `MarketAuditSubjectRef` | typed market subject，不从ref字符串反推 |
| operation_ref | `MarketOperationRef` | 原意图关联 |
| actor_ref | `ActorReference` | Core ActorContext正式来源 |
| basis_refs | `SafeBasisReferenceSet` | 来源/决定/reason/outcome安全回指 |
| cursor | `MarketSourceCursor` | 本地提交后稳定排序，不自证外部audit |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn append_fact(input: MarketAuditInput) -> Result<Self, DomainError>` | MarketAuditInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 同UoW追加，不覆旧；纠错新record；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: MarketAuditRecordRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### DeferredWork

```rust
/// Carries DeferredWork with explicit sources and no upstream body.
pub struct DeferredWork {
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: MarketEffectIntentRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: OptionalStoredOperationResultRef,
    /// Carries state; see the source and invariant table.
    pub state: DeferredWorkState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| work_ref | `DeferredWorkRef` | 本地ID |
| operation_ref | `MarketOperationRef` | 原操作 |
| target_ref | `MarketWorkTargetRef` | 有限typed review/distribution/notice/observation/projection target |
| intent_ref | `MarketEffectIntentRef` | 原外部幂等意图 |
| fence | `DispatchFence` | 本地claim许可token |
| result_ref | `OptionalStoredOperationResultRef` | settled工作原report回指 |
| state | `DeferredWorkState` | Pending/Claimed/Settled/Blocked |
| revision | `MarketRevision` | claim CAS/过期worker拒绝 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn claim(&mut self, input: WorkClaimInput) -> Result<(), DomainError>` | fence持久化，过期claim需判断effectunknown | WorkClaimInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn settle(&mut self, input: WorkSettlementInput) -> Result<(), DomainError>` | 只本地责任完成/结果已存 | WorkSettlementInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | 缺合同或unknown需probe，不任意再发 | ContractGapInput gap：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn schedule(input: DurableResponsibilityInput) -> Result<Self, DomainError>` | DurableResponsibilityInput的独立字段schema见shared_types；Pending；result_ref=None；fence初代未claim | accepted同UoW初始Pending；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: DeferredWorkRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Pending；result_ref=None；fence初代未claim。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### RecoveryIntent

```rust
/// Carries RecoveryIntent with explicit sources and no upstream body.
pub struct RecoveryIntent {
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: RecoveryIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: RecoveryAuthorityRef,
    /// Carries report_ref; see the source and invariant table.
    pub report_ref: OptionalStoredOperationResultRef,
    /// Carries state; see the source and invariant table.
    pub state: RecoveryIntentState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| recovery_ref | `RecoveryIntentRef` | 本地ID |
| target_ref | `MarketWorkTargetRef` | 原intent/attempt/projection typed目标 |
| authority_ref | `RecoveryAuthorityRef` | 正式操作权限/人工依据 |
| report_ref | `OptionalStoredOperationResultRef` | 逐item安全恢复结果 |
| state | `RecoveryIntentState` | Requested/Running/Completed/Blocked |
| revision | `MarketRevision` | 并发来源 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn begin(&mut self, input: QualifiedRecoveryInput) -> Result<(), DomainError>` | scope/目标/原意图核对 | QualifiedRecoveryInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn record(&mut self, input: RecoveryOutcomeInput) -> Result<(), DomainError>` | report完整逐项保存，缺probe保持Blocked | RecoveryOutcomeInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn request(input: RecoveryRequestInput) -> Result<Self, DomainError>` | RecoveryRequestInput的独立字段schema见shared_types；Requested；report_ref=None | 初始Requested，只受理局部恢复；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: RecoveryIntentRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Requested；report_ref=None。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ObservationOutcomeBinding

```rust
/// Carries ObservationOutcomeBinding with explicit sources and no upstream body.
pub struct ObservationOutcomeBinding {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: ObservationReceiptRef,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `ObservationReceiptRef` | 正式Obs结果ref |
| operation_ref | `MarketOperationRef` | 原审计交接意图 |
| audit_refs | `MarketAuditRefSet` | 已提交安全audit集 |
| scope_ref | `MarketScopeRef` | producer/披露范围 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, context: ObservationOutcomeContext) -> bool` | 正式producer/材料/intent binding | ObservationOutcomeContext context：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_observer(input: QualifiedObservationOutcome) -> Result<Self, DomainError>` | QualifiedObservationOutcome的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | ACK不能生成admitted；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ObservationOutcomeBindingRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### RecoveryPolicy

```rust
/// Carries RecoveryPolicy with explicit sources and no upstream body.
pub struct RecoveryPolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: RecoveryRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `RecoveryRequirements` | 正式恢复/权限/原意图依据 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, intent: RecoveryIntent, target: RecoveryTargetInput) -> Result<LocalGateResult, DomainError>` | typed目标/现状/authority；unknown必须probe | RecoveryIntent intent；RecoveryTargetInput target：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn classify(&self, input: ExternalEffectInspectionInput) -> Result<ExternalEffectInspectionInput, DomainError>` | confirmed/known-not-committed/unknown，禁止猜结果 | ExternalEffectInspectionInput input：typed原对象/正式port qualified输入，不调用I/O | Result<ExternalEffectInspectionInput, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: RecoveryRequirements) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: RecoveryPolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### AuditRecoveryView

```rust
/// Carries AuditRecoveryView with explicit sources and no upstream body.
pub struct AuditRecoveryView {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
    /// Carries work_refs; see the source and invariant table.
    pub work_refs: DeferredWorkRefSet,
    /// Carries recovery_refs; see the source and invariant table.
    pub recovery_refs: RecoveryIntentRefSet,
    /// Carries observation_binding; see the source and invariant table.
    pub observation_binding: OptionalObservationOutcomeBinding,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | 本地语境 |
| audit_refs | `MarketAuditRefSet` | 安全追加历史 |
| work_refs | `DeferredWorkRefSet` | 耐久责任 |
| recovery_refs | `RecoveryIntentRefSet` | 恢复report引用 |
| observation_binding | `OptionalObservationOutcomeBinding` | 正式接纳独立来源 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn assemble(input: AuditRecoveryReadInput) -> Result<Self, DomainError>` | AuditRecoveryReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不能输出secret/rawlog/evidence/verdict；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: AuditRecoveryViewRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
