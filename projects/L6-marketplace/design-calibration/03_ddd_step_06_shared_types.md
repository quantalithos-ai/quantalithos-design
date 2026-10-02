# Step6 shared词汇小循环

## 思考、诊断与取舍

能力：本地identity/version/fence、安全ownertransport、state/read/error/result与跨入口单authority。采用独立typedwrapper与有限enum；拒绝裸JSON/body/同一个StringRef覆盖多语义。所有ownerwrapper是本地transport，不声称owner正式export。Core actor/meta使用真实导出，domain仅typedcontextref，application唯一保存上下文。

批次计划：refs→revision/fence→safe读面→14state→输入/结果支撑。约300行一批，先词汇再U对象。Rustdoc英文承接Step3；与SOP中文示例冲突不改已确认编码规则。

### OwnerVersionRef

```rust
/// Carries OwnerVersionRef with explicit sources and no upstream body.
pub struct OwnerVersionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### OwnerVisibilityRef

```rust
/// Carries OwnerVisibilityRef with explicit sources and no upstream body.
pub struct OwnerVisibilityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### OwnerEligibilityRef

```rust
/// Carries OwnerEligibilityRef with explicit sources and no upstream body.
pub struct OwnerEligibilityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### OwnerMaterialRef

```rust
/// Carries OwnerMaterialRef with explicit sources and no upstream body.
pub struct OwnerMaterialRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MaterialKindRef

```rust
/// Carries MaterialKindRef with explicit sources and no upstream body.
pub struct MaterialKindRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MaterialApplicabilityRef

```rust
/// Carries MaterialApplicabilityRef with explicit sources and no upstream body.
pub struct MaterialApplicabilityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### PublisherRelationRef

```rust
/// Carries PublisherRelationRef with explicit sources and no upstream body.
pub struct PublisherRelationRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### PublisherPrincipalRef

```rust
/// Carries PublisherPrincipalRef with explicit sources and no upstream body.
pub struct PublisherPrincipalRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### PublisherAuthorityRef

```rust
/// Carries PublisherAuthorityRef with explicit sources and no upstream body.
pub struct PublisherAuthorityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MarketScopeRef

```rust
/// Carries MarketScopeRef with explicit sources and no upstream body.
pub struct MarketScopeRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### SourceVerificationRef

```rust
/// Carries SourceVerificationRef with explicit sources and no upstream body.
pub struct SourceVerificationRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### PublicationBasisRef

```rust
/// Carries PublicationBasisRef with explicit sources and no upstream body.
pub struct PublicationBasisRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### PublicationApplicationRef

```rust
/// Carries PublicationApplicationRef with explicit sources and no upstream body.
pub struct PublicationApplicationRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### ReviewHandoffRef

```rust
/// Carries ReviewHandoffRef with explicit sources and no upstream body.
pub struct ReviewHandoffRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### GovernanceDecisionRef

```rust
/// Carries GovernanceDecisionRef with explicit sources and no upstream body.
pub struct GovernanceDecisionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### GovernanceOutcomeRef

```rust
/// Carries GovernanceOutcomeRef with explicit sources and no upstream body.
pub struct GovernanceOutcomeRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DecisionValidityRef

```rust
/// Carries DecisionValidityRef with explicit sources and no upstream body.
pub struct DecisionValidityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MarketplaceListingRef

```rust
/// Carries MarketplaceListingRef with explicit sources and no upstream body.
pub struct MarketplaceListingRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。


### MarketVersionRef

```rust
/// Carries MarketVersionRef with explicit sources and no upstream body.
pub struct MarketVersionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### CategoryRef

```rust
/// Carries CategoryRef with explicit sources and no upstream body.
pub struct CategoryRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DistributionIntentRef

```rust
/// Carries DistributionIntentRef with explicit sources and no upstream body.
pub struct DistributionIntentRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DistributionConsumerRef

```rust
/// Carries DistributionConsumerRef with explicit sources and no upstream body.
pub struct DistributionConsumerRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DistributionReceiverRef

```rust
/// Carries DistributionReceiverRef with explicit sources and no upstream body.
pub struct DistributionReceiverRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DistributionRelationRef

```rust
/// Carries DistributionRelationRef with explicit sources and no upstream body.
pub struct DistributionRelationRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DistributionAttemptRef

```rust
/// Carries DistributionAttemptRef with explicit sources and no upstream body.
pub struct DistributionAttemptRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### ReceiverOutcomeRef

```rust
/// Carries ReceiverOutcomeRef with explicit sources and no upstream body.
pub struct ReceiverOutcomeRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### WithdrawalDispositionRef

```rust
/// Carries WithdrawalDispositionRef with explicit sources and no upstream body.
pub struct WithdrawalDispositionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DispositionAuthorityRef

```rust
/// Carries DispositionAuthorityRef with explicit sources and no upstream body.
pub struct DispositionAuthorityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### SafeReasonRef

```rust
/// Carries SafeReasonRef with explicit sources and no upstream body.
pub struct SafeReasonRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### ImpactRecordRef

```rust
/// Carries ImpactRecordRef with explicit sources and no upstream body.
pub struct ImpactRecordRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### NoticeIntentRef

```rust
/// Carries NoticeIntentRef with explicit sources and no upstream body.
pub struct NoticeIntentRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### NoticeTargetRef

```rust
/// Carries NoticeTargetRef with explicit sources and no upstream body.
pub struct NoticeTargetRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### NoticeChannelRef

```rust
/// Carries NoticeChannelRef with explicit sources and no upstream body.
pub struct NoticeChannelRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### NoticeOutcomeRef

```rust
/// Carries NoticeOutcomeRef with explicit sources and no upstream body.
pub struct NoticeOutcomeRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MarketOperationRef

```rust
/// Carries MarketOperationRef with explicit sources and no upstream body.
pub struct MarketOperationRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### StoredOperationResultRef

```rust
/// Carries StoredOperationResultRef with explicit sources and no upstream body.
pub struct StoredOperationResultRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。


### MarketResultSchemaRef

```rust
/// Represents the finite MarketResultSchemaRef surface without owning upstream truth.
pub enum MarketResultSchemaRef {
    /// V1 is a local classification.
    V1,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| V1 | V1 is a local classification. | 设计本地schema版，未发布/未运行，不代表ownercontractversion |

归属：contracts；设计本地schema版，未发布/未运行，不代表ownercontractversion

### MarketAuditRef

```rust
/// Carries MarketAuditRef with explicit sources and no upstream body.
pub struct MarketAuditRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DeferredWorkRef

```rust
/// Carries DeferredWorkRef with explicit sources and no upstream body.
pub struct DeferredWorkRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### RecoveryIntentRef

```rust
/// Carries RecoveryIntentRef with explicit sources and no upstream body.
pub struct RecoveryIntentRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### RecoveryAuthorityRef

```rust
/// Carries RecoveryAuthorityRef with explicit sources and no upstream body.
pub struct RecoveryAuthorityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### ObservationReceiptRef

```rust
/// Carries ObservationReceiptRef with explicit sources and no upstream body.
pub struct ObservationReceiptRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### QualifiedOwnerKindRef

```rust
/// Carries QualifiedOwnerKindRef with explicit sources and no upstream body.
pub struct QualifiedOwnerKindRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### CanonicalOwnerRef

```rust
/// Carries CanonicalOwnerRef with explicit sources and no upstream body.
pub struct CanonicalOwnerRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### OwnerConsumerContractRef

```rust
/// Carries OwnerConsumerContractRef with explicit sources and no upstream body.
pub struct OwnerConsumerContractRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### QualifiedReferenceSnapshotRef

```rust
/// Carries QualifiedReferenceSnapshotRef with explicit sources and no upstream body.
pub struct QualifiedReferenceSnapshotRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### SourceValidityRef

```rust
/// Carries SourceValidityRef with explicit sources and no upstream body.
pub struct SourceValidityRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### DisclosureDecisionRef

```rust
/// Carries DisclosureDecisionRef with explicit sources and no upstream body.
pub struct DisclosureDecisionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | formal owner/SDK/resolver输出的本地body-free transport token；非上游Rustexport，缺exact转换blocked；非空≤512bytes、不解析、不自造 |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MarketProjectionRef

```rust
/// Carries MarketProjectionRef with explicit sources and no upstream body.
pub struct MarketProjectionRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port或明确typedlookup返回的本地opaque ID；非空≤128bytes，不从字符串推类型/owner |

归属：contracts；本地typed transport wrapper，仅承载ref，不拥有或声明上游truth；constructor只用于校验过的adapter/ID输出。

### MarketContextRef

```rust
/// Carries MarketContextRef with explicit sources and no upstream body.
pub struct MarketContextRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | ID port分配、application ContextRecord保存键 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### ActorReference

```rust
/// Carries ActorReference with explicit sources and no upstream body.
pub struct ActorReference {
    /// Carries context_ref; see the source and invariant table.
    pub context_ref: MarketContextRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context_ref | `MarketContextRef` | 指向唯一Core ActorContext所在ContextRecord；不复制AI/human identity字段 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### SharedMetadataReference

```rust
/// Represents the finite SharedMetadataReference surface without owning upstream truth.
pub enum SharedMetadataReference {
    /// References the single stored Core command metadata.
    Command(MarketContextRef),
    /// References the single stored worker request metadata.
    Worker(MarketContextRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Command(MarketContextRef) | References the single stored Core command metadata. | 有限分类，不自动授权。 |
| Worker(MarketContextRef) | References the single stored worker request metadata. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### MarketRevision

```rust
/// Carries MarketRevision with explicit sources and no upstream body.
pub struct MarketRevision {
    /// Carries value; see the source and invariant table.
    pub value: u64,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| value | `u64` | repo row的optimistic revision；对象显式revision与Versioned.revision为同一column，必须相等，不双写 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### ExpectedMarketRevision

```rust
/// Represents the finite ExpectedMarketRevision surface without owning upstream truth.
pub enum ExpectedMarketRevision {
    /// Requires an explicit create with no existing row.
    MustNotExist,
    /// Requires the previously loaded row revision.
    Exact(MarketRevision),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| MustNotExist | Requires an explicit create with no existing row. | 有限分类，不自动授权。 |
| Exact(MarketRevision) | Requires the previously loaded row revision. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### Versioned<T>

```rust
/// Carries Versioned<T> with explicit sources and no upstream body.
pub struct Versioned<T> {
    /// Carries value; see the source and invariant table.
    pub value: T,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| value | `T` | typed rehydrate返回完整对象 |
| revision | `MarketRevision` | repo同一revisioncolumn；对象已有revision只是镜像同值，不额外column |

归属：application；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### VersionedRef<R>

```rust
/// Carries VersionedRef<R> with explicit sources and no upstream body.
pub struct VersionedRef<R> {
    /// Carries reference; see the source and invariant table.
    pub reference: R,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| reference | `R` | save后typedID |
| revision | `MarketRevision` | 同tx新revision |

归属：application；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketSourceCursor

```rust
/// Carries MarketSourceCursor with explicit sources and no upstream body.
pub struct MarketSourceCursor {
    /// Carries sequence; see the source and invariant table.
    pub sequence: u64,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| sequence | `u64` | PG同UoW提交事实顺序；0仅无事实初始，不伪造ownercursor |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketInstant

```rust
/// Carries MarketInstant with explicit sources and no upstream body.
pub struct MarketInstant {
    /// Carries unix_millis; see the source and invariant table.
    pub unix_millis: i64,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| unix_millis | `i64` | ClockPort输出本地时间，不能当owner version/有效性/外部event时间 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### DispatchFence

```rust
/// Carries DispatchFence with explicit sources and no upstream body.
pub struct DispatchFence {
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
    /// Carries generation; see the source and invariant table.
    pub generation: u64,
    /// Carries expires_at; see the source and invariant table.
    pub expires_at: MarketInstant,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| work_ref | `DeferredWorkRef` | claim工作 |
| generation | `u64` | 同work递增CAS |
| expires_at | `MarketInstant` | 本地lease上界；失效不证明外部未commit |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketIntentFingerprint

```rust
/// Carries MarketIntentFingerprint with explicit sources and no upstream body.
pub struct MarketIntentFingerprint {
    /// Carries sha256; see the source and invariant table.
    pub sha256: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| sha256 | `String` | 版本化RFC8785+SHA256：有限完整业务字段+selector+actor/delegate identity+正式scope；exact规范及33DTO映射见Step13§7.2～7.3；排除key/trace/time/locale/hints，小写64hex，仅本地意图摘要 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketProjectionKind

```rust
/// Represents the finite MarketProjectionKind surface without owning upstream truth.
pub enum MarketProjectionKind {
    /// Catalog is a local classification.
    Catalog,
    /// Progress is a local classification.
    Progress,
    /// Impact is a local classification.
    Impact,
    /// Audit is a local classification.
    Audit,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Catalog | Catalog is a local classification. | 有限分类，不自动授权。 |
| Progress | Progress is a local classification. | 有限分类，不自动授权。 |
| Impact | Impact is a local classification. | 有限分类，不自动授权。 |
| Audit | Audit is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### MarketDispositionKind

```rust
/// Represents the finite MarketDispositionKind surface without owning upstream truth.
pub enum MarketDispositionKind {
    /// Restrict is a local classification.
    Restrict,
    /// Withdraw is a local classification.
    Withdraw,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Restrict | Restrict is a local classification. | 有限分类，不自动授权。 |
| Withdraw | Withdraw is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### ReadSurfaceKind

```rust
/// Represents the finite ReadSurfaceKind surface without owning upstream truth.
pub enum ReadSurfaceKind {
    /// Ready is a local classification.
    Ready,
    /// Empty is a local classification.
    Empty,
    /// Missing is a local classification.
    Missing,
    /// NotVisible is a local classification.
    NotVisible,
    /// Stale is a local classification.
    Stale,
    /// Rebuilding is a local classification.
    Rebuilding,
    /// Unavailable is a local classification.
    Unavailable,
    /// Unsupported is a local classification.
    Unsupported,
    /// Failed is a local classification.
    Failed,
    /// Disabled is a local classification.
    Disabled,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Ready | Ready is a local classification. | 有限分类，不自动授权。 |
| Empty | Empty is a local classification. | 有限分类，不自动授权。 |
| Missing | Missing is a local classification. | 有限分类，不自动授权。 |
| NotVisible | NotVisible is a local classification. | 有限分类，不自动授权。 |
| Stale | Stale is a local classification. | 有限分类，不自动授权。 |
| Rebuilding | Rebuilding is a local classification. | 有限分类，不自动授权。 |
| Unavailable | Unavailable is a local classification. | 有限分类，不自动授权。 |
| Unsupported | Unsupported is a local classification. | 有限分类，不自动授权。 |
| Failed | Failed is a local classification. | 有限分类，不自动授权。 |
| Disabled | Disabled is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### DomainError

```rust
/// Represents the finite DomainError surface without owning upstream truth.
pub enum DomainError {
    /// InvalidInput is a local classification.
    InvalidInput,
    /// WrongReferenceKind is a local classification.
    WrongReferenceKind,
    /// BindingMismatch is a local classification.
    BindingMismatch,
    /// IllegalTransition is a local classification.
    IllegalTransition,
    /// CurrentGateDenied is a local classification.
    CurrentGateDenied,
    /// MissingSource is a local classification.
    MissingSource,
    /// MissingAuthority is a local classification.
    MissingAuthority,
    /// UnsafeMaterial is a local classification.
    UnsafeMaterial,
    /// IncompleteRecord is a local classification.
    IncompleteRecord,
    /// FenceMismatch is a local classification.
    FenceMismatch,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| InvalidInput | InvalidInput is a local classification. | 有限分类，不自动授权。 |
| WrongReferenceKind | WrongReferenceKind is a local classification. | 有限分类，不自动授权。 |
| BindingMismatch | BindingMismatch is a local classification. | 有限分类，不自动授权。 |
| IllegalTransition | IllegalTransition is a local classification. | 有限分类，不自动授权。 |
| CurrentGateDenied | CurrentGateDenied is a local classification. | 有限分类，不自动授权。 |
| MissingSource | MissingSource is a local classification. | 有限分类，不自动授权。 |
| MissingAuthority | MissingAuthority is a local classification. | 有限分类，不自动授权。 |
| UnsafeMaterial | UnsafeMaterial is a local classification. | 有限分类，不自动授权。 |
| IncompleteRecord | IncompleteRecord is a local classification. | 有限分类，不自动授权。 |
| FenceMismatch | FenceMismatch is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。


### ErrorCode

```rust
/// Represents the finite ErrorCode surface without owning upstream truth.
pub enum ErrorCode {
    /// InvalidInput is a local classification.
    InvalidInput,
    /// MissingIdempotencyKey is a local classification.
    MissingIdempotencyKey,
    /// NotAuthorized is a local classification.
    NotAuthorized,
    /// NotVisible is a local classification.
    NotVisible,
    /// Missing is a local classification.
    Missing,
    /// BindingMismatch is a local classification.
    BindingMismatch,
    /// IllegalTransition is a local classification.
    IllegalTransition,
    /// VersionConflict is a local classification.
    VersionConflict,
    /// IdempotencyConflict is a local classification.
    IdempotencyConflict,
    /// OperationInProgress is a local classification.
    OperationInProgress,
    /// ContractBlocked is a local classification.
    ContractBlocked,
    /// CurrentGateDenied is a local classification.
    CurrentGateDenied,
    /// FenceMismatch is a local classification.
    FenceMismatch,
    /// IntegrityFailure is a local classification.
    IntegrityFailure,
    /// Unavailable is a local classification.
    Unavailable,
    /// ExternalCommitUnknown is a local classification.
    ExternalCommitUnknown,
    /// Unsupported is a local classification.
    Unsupported,
    /// UnsafeMaterial is a local classification.
    UnsafeMaterial,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| InvalidInput | InvalidInput is a local classification. | 有限分类，不自动授权。 |
| MissingIdempotencyKey | MissingIdempotencyKey is a local classification. | 有限分类，不自动授权。 |
| NotAuthorized | NotAuthorized is a local classification. | 有限分类，不自动授权。 |
| NotVisible | NotVisible is a local classification. | 有限分类，不自动授权。 |
| Missing | Missing is a local classification. | 有限分类，不自动授权。 |
| BindingMismatch | BindingMismatch is a local classification. | 有限分类，不自动授权。 |
| IllegalTransition | IllegalTransition is a local classification. | 有限分类，不自动授权。 |
| VersionConflict | VersionConflict is a local classification. | 有限分类，不自动授权。 |
| IdempotencyConflict | IdempotencyConflict is a local classification. | 有限分类，不自动授权。 |
| OperationInProgress | OperationInProgress is a local classification. | 有限分类，不自动授权。 |
| ContractBlocked | ContractBlocked is a local classification. | 有限分类，不自动授权。 |
| CurrentGateDenied | CurrentGateDenied is a local classification. | 有限分类，不自动授权。 |
| FenceMismatch | FenceMismatch is a local classification. | 有限分类，不自动授权。 |
| IntegrityFailure | IntegrityFailure is a local classification. | 有限分类，不自动授权。 |
| Unavailable | Unavailable is a local classification. | 有限分类，不自动授权。 |
| ExternalCommitUnknown | ExternalCommitUnknown is a local classification. | 有限分类，不自动授权。 |
| Unsupported | Unsupported is a local classification. | 有限分类，不自动授权。 |
| UnsafeMaterial | UnsafeMaterial is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### SafeFailureRef

```rust
/// Carries SafeFailureRef with explicit sources and no upstream body.
pub struct SafeFailureRef {
    /// Carries code; see the source and invariant table.
    pub code: ErrorCode,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: Option<SafeReasonRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| code | `ErrorCode` | 有限失败分类 |
| reason_ref | `Option<SafeReasonRef>` | 只安全原因ref，非raw SQL/HTTP/secret/body |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### ContractGapInput

```rust
/// Carries ContractGapInput with explicit sources and no upstream body.
pub struct ContractGapInput {
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: SafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| failure_ref | `SafeFailureRef` | 缺exact consumer/authority/SDK绑定；不自动重试 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SafeReadContext

```rust
/// Carries SafeReadContext with explicit sources and no upstream body.
pub struct SafeReadContext {
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries disclosure_ref; see the source and invariant table.
    pub disclosure_ref: DisclosureDecisionRef,
    /// Carries source_constraints; see the source and invariant table.
    pub source_constraints: SourceVisibilityConstraintSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope_ref | `MarketScopeRef` | 正式resolved当前scope |
| disclosure_ref | `DisclosureDecisionRef` | 正式披露裁剪依据 |
| source_constraints | `SourceVisibilityConstraintSet` | 当前owner/market/organization交集；缺任何一方positive不可用 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SourceVisibilityConstraint

```rust
/// Carries SourceVisibilityConstraint with explicit sources and no upstream body.
pub struct SourceVisibilityConstraint {
    /// Carries source_ref; see the source and invariant table.
    pub source_ref: TypedOwnerReference,
    /// Carries visibility_ref; see the source and invariant table.
    pub visibility_ref: OwnerVisibilityRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_ref | `TypedOwnerReference` | formaltyped来源 |
| visibility_ref | `OwnerVisibilityRef` | 当次可见依据 |
| validity_ref | `SourceValidityRef` | 当次正式有效性 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SafeBasisReference

```rust
/// Carries SafeBasisReference with explicit sources and no upstream body.
pub struct SafeBasisReference {
    /// Carries kind; see the source and invariant table.
    pub kind: SafeBasisKind,
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `SafeBasisKind` | 显式selector |
| token | `String` | 正式basis的body-free opaque引用；kind与adapter输出匹配，禁parse |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SafeBasisKind

```rust
/// Represents the finite SafeBasisKind surface without owning upstream truth.
pub enum SafeBasisKind {
    /// Source is a local classification.
    Source,
    /// Material is a local classification.
    Material,
    /// Publisher is a local classification.
    Publisher,
    /// Decision is a local classification.
    Decision,
    /// Receiver is a local classification.
    Receiver,
    /// Disposition is a local classification.
    Disposition,
    /// Notice is a local classification.
    Notice,
    /// Observation is a local classification.
    Observation,
    /// LocalAudit is a local classification.
    LocalAudit,
    /// Reason is a local classification.
    Reason,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Source | Source is a local classification. | 有限分类，不自动授权。 |
| Material | Material is a local classification. | 有限分类，不自动授权。 |
| Publisher | Publisher is a local classification. | 有限分类，不自动授权。 |
| Decision | Decision is a local classification. | 有限分类，不自动授权。 |
| Receiver | Receiver is a local classification. | 有限分类，不自动授权。 |
| Disposition | Disposition is a local classification. | 有限分类，不自动授权。 |
| Notice | Notice is a local classification. | 有限分类，不自动授权。 |
| Observation | Observation is a local classification. | 有限分类，不自动授权。 |
| LocalAudit | LocalAudit is a local classification. | 有限分类，不自动授权。 |
| Reason | Reason is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### MarketAuditSubjectRef

```rust
/// Represents the finite MarketAuditSubjectRef surface without owning upstream truth.
pub enum MarketAuditSubjectRef {
    /// Identifies a local publisher relation.
    Publisher(PublisherRelationRef),
    /// Identifies local source qualification.
    Verification(SourceVerificationRef),
    /// Identifies a publication application.
    Application(PublicationApplicationRef),
    /// Identifies review handoff.
    Review(ReviewHandoffRef),
    /// Identifies a listing.
    Listing(MarketplaceListingRef),
    /// Identifies an exact market version.
    Version(MarketVersionRef),
    /// Identifies a category.
    Category(CategoryRef),
    /// Identifies local distribution intent.
    Distribution(DistributionIntentRef),
    /// Identifies local attempt.
    Attempt(DistributionAttemptRef),
    /// Identifies local withdrawal.
    Disposition(WithdrawalDispositionRef),
    /// Identifies known impact.
    Impact(ImpactRecordRef),
    /// Identifies notice intent.
    Notice(NoticeIntentRef),
    /// Identifies original operation.
    Operation(MarketOperationRef),
    /// Identifies local recovery.
    Recovery(RecoveryIntentRef),
    /// Identifies a qualified snapshot.
    Snapshot(QualifiedReferenceSnapshotRef),
    /// Identifies read projection.
    Projection(MarketProjectionRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Publisher(PublisherRelationRef) | Identifies a local publisher relation. | 有限分类，不自动授权。 |
| Verification(SourceVerificationRef) | Identifies local source qualification. | 有限分类，不自动授权。 |
| Application(PublicationApplicationRef) | Identifies a publication application. | 有限分类，不自动授权。 |
| Review(ReviewHandoffRef) | Identifies review handoff. | 有限分类，不自动授权。 |
| Listing(MarketplaceListingRef) | Identifies a listing. | 有限分类，不自动授权。 |
| Version(MarketVersionRef) | Identifies an exact market version. | 有限分类，不自动授权。 |
| Category(CategoryRef) | Identifies a category. | 有限分类，不自动授权。 |
| Distribution(DistributionIntentRef) | Identifies local distribution intent. | 有限分类，不自动授权。 |
| Attempt(DistributionAttemptRef) | Identifies local attempt. | 有限分类，不自动授权。 |
| Disposition(WithdrawalDispositionRef) | Identifies local withdrawal. | 有限分类，不自动授权。 |
| Impact(ImpactRecordRef) | Identifies known impact. | 有限分类，不自动授权。 |
| Notice(NoticeIntentRef) | Identifies notice intent. | 有限分类，不自动授权。 |
| Operation(MarketOperationRef) | Identifies original operation. | 有限分类，不自动授权。 |
| Recovery(RecoveryIntentRef) | Identifies local recovery. | 有限分类，不自动授权。 |
| Snapshot(QualifiedReferenceSnapshotRef) | Identifies a qualified snapshot. | 有限分类，不自动授权。 |
| Projection(MarketProjectionRef) | Identifies read projection. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。


### MarketWorkTargetRef

```rust
/// Represents the finite MarketWorkTargetRef surface without owning upstream truth.
pub enum MarketWorkTargetRef {
    /// Carries Review with ReviewHandoffRef.
    Review(ReviewHandoffRef),
    /// Carries Distribution with DistributionAttemptRef.
    Distribution(DistributionAttemptRef),
    /// Carries Notice with NoticeIntentRef.
    Notice(NoticeIntentRef),
    /// Carries Observation with MarketOperationRef.
    Observation(MarketOperationRef),
    /// Carries Recovery with RecoveryIntentRef.
    Recovery(RecoveryIntentRef),
    /// Carries Snapshot with QualifiedReferenceSnapshotRef.
    Snapshot(QualifiedReferenceSnapshotRef),
    /// Carries Projection with MarketProjectionRef.
    Projection(MarketProjectionRef),
    /// Carries Impact with ImpactRecordRef.
    Impact(ImpactRecordRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Review(ReviewHandoffRef) | Carries Review. | 有限分类，不自动授权。 |
| Distribution(DistributionAttemptRef) | Carries Distribution. | 有限分类，不自动授权。 |
| Notice(NoticeIntentRef) | Carries Notice. | 有限分类，不自动授权。 |
| Observation(MarketOperationRef) | Carries Observation. | 有限分类，不自动授权。 |
| Recovery(RecoveryIntentRef) | Carries Recovery. | 有限分类，不自动授权。 |
| Snapshot(QualifiedReferenceSnapshotRef) | Carries Snapshot. | 有限分类，不自动授权。 |
| Projection(MarketProjectionRef) | Carries Projection. | 有限分类，不自动授权。 |
| Impact(ImpactRecordRef) | Carries Impact. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### MarketEffectIntentRef

```rust
/// Represents the finite MarketEffectIntentRef surface without owning upstream truth.
pub enum MarketEffectIntentRef {
    /// Carries Review with ReviewHandoffRef.
    Review(ReviewHandoffRef),
    /// Carries Distribution with DistributionIntentRef.
    Distribution(DistributionIntentRef),
    /// Carries Notice with NoticeIntentRef.
    Notice(NoticeIntentRef),
    /// Carries Observation with MarketOperationRef.
    Observation(MarketOperationRef),
    /// Carries LocalWork with DeferredWorkRef.
    LocalWork(DeferredWorkRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Review(ReviewHandoffRef) | Carries Review. | 有限分类，不自动授权。 |
| Distribution(DistributionIntentRef) | Carries Distribution. | 有限分类，不自动授权。 |
| Notice(NoticeIntentRef) | Carries Notice. | 有限分类，不自动授权。 |
| Observation(MarketOperationRef) | Carries Observation. | 有限分类，不自动授权。 |
| LocalWork(DeferredWorkRef) | Carries LocalWork. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### MarketReadViewKey

```rust
/// Carries MarketReadViewKey with explicit sources and no upstream body.
pub struct MarketReadViewKey {
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries subject; see the source and invariant table.
    pub subject: MarketAuditSubjectRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `MarketProjectionKind` | 显式read族 |
| subject | `MarketAuditSubjectRef` | typedlocal主体 |
| scope_ref | `MarketScopeRef` | 同一projection scope，不从ref猜 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SourceVerificationTarget

```rust
/// Carries SourceVerificationTarget with explicit sources and no upstream body.
pub struct SourceVerificationTarget {
    /// Carries owner_kind_candidate; see the source and invariant table.
    pub owner_kind_candidate: String,
    /// Carries opaque_candidate; see the source and invariant table.
    pub opaque_candidate: String,
    /// Carries owner_version_candidate; see the source and invariant table.
    pub owner_version_candidate: String,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_kind_candidate | `String` | UI选项只映射到受控owner adapter候选；五展示类型不是canonicalkind |
| opaque_candidate | `String` | 请求候选ref，resolver-first，非canonical |
| owner_version_candidate | `String` | 候选不可变版本，owner重核 |
| scope_ref | `MarketScopeRef` | resolver范围不是clientpublic标签 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SourceSafeSummary

```rust
/// Carries SourceSafeSummary with explicit sources and no upstream body.
pub struct SourceSafeSummary {
    /// Carries display_label; see the source and invariant table.
    pub display_label: String,
    /// Carries binding; see the source and invariant table.
    pub binding: SourceBinding,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| display_label | `String` | owner正式safe label≤256unicodechars，不搬正文 |
| binding | `SourceBinding` | exact已核验来源 |
| validity_ref | `SourceValidityRef` | 正式摘要/披露有效性 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketCategoryLabel

```rust
/// Carries MarketCategoryLabel with explicit sources and no upstream body.
pub struct MarketCategoryLabel {
    /// Carries text; see the source and invariant table.
    pub text: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| text | `String` | 本地taxonomy标签1～64unicodechars；展示locale不是businessID |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketListingMetadata

```rust
/// Carries MarketListingMetadata with explicit sources and no upstream body.
pub struct MarketListingMetadata {
    /// Carries title; see the source and invariant table.
    pub title: String,
    /// Carries description; see the source and invariant table.
    pub description: String,
    /// Carries tags; see the source and invariant table.
    pub tags: Vec<String>,
    /// Carries display_type; see the source and invariant table.
    pub display_type: DisplayAssetCategory,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| title | `String` | 本地市场标题1～120chars |
| description | `String` | 仅原创市场描述≤2000chars，不接受资产正文/base64/payload |
| tags | `Vec<String>` | 去重排序≤20项，每项≤64chars |
| display_type | `DisplayAssetCategory` | 仅UI分类，不当owner kind |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### DisplayAssetCategory

```rust
/// Represents the finite DisplayAssetCategory surface without owning upstream truth.
pub enum DisplayAssetCategory {
    /// Method is a local classification.
    Method,
    /// Role is a local classification.
    Role,
    /// ProcessTemplate is a local classification.
    ProcessTemplate,
    /// Capability is a local classification.
    Capability,
    /// MemberImage is a local classification.
    MemberImage,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Method | Method is a local classification. | 市场展示五类；是否实际可发布由owner ref/contract判定；Artifact是材料来源而非自动新增可发布类。 |
| Role | Role is a local classification. | 市场展示五类；是否实际可发布由owner ref/contract判定；Artifact是材料来源而非自动新增可发布类。 |
| ProcessTemplate | ProcessTemplate is a local classification. | 市场展示五类；是否实际可发布由owner ref/contract判定；Artifact是材料来源而非自动新增可发布类。 |
| Capability | Capability is a local classification. | 市场展示五类；是否实际可发布由owner ref/contract判定；Artifact是材料来源而非自动新增可发布类。 |
| MemberImage | MemberImage is a local classification. | 市场展示五类；是否实际可发布由owner ref/contract判定；Artifact是材料来源而非自动新增可发布类。 |

归属：contracts；市场展示五类；是否实际可发布由owner ref/contract判定；Artifact是材料来源而非自动新增可发布类。

### MarketCatalogSafeMetadata

```rust
/// Carries MarketCatalogSafeMetadata with explicit sources and no upstream body.
pub struct MarketCatalogSafeMetadata {
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries source_summary; see the source and invariant table.
    pub source_summary: Option<SourceSafeSummary>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| metadata | `MarketListingMetadata` | local已committedmetadata |
| source_summary | `Option<SourceSafeSummary>` | qualified且可见时才有，不默认为空合格 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### DraftPublicationSpec

```rust
/// Carries DraftPublicationSpec with explicit sources and no upstream body.
pub struct DraftPublicationSpec {
    /// Carries source_candidate; see the source and invariant table.
    pub source_candidate: SourceVerificationTarget,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries material_candidates; see the source and invariant table.
    pub material_candidates: Vec<OwnerMaterialRef>,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_candidate | `SourceVerificationTarget` | 候选asset，仅正式核验后固定basis |
| publisher_ref | `PublisherRelationRef` | local责任关联 |
| material_candidates | `Vec<OwnerMaterialRef>` | 材料候选，不假称scan passed |
| scope_ref | `MarketScopeRef` | 当前scope约束 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### DispatchPermission

```rust
/// Carries DispatchPermission with explicit sources and no upstream body.
pub struct DispatchPermission {
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries effect_intent; see the source and invariant table.
    pub effect_intent: MarketEffectIntentRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: Option<MarketVersionRef>,
    /// Carries authority_basis; see the source and invariant table.
    pub authority_basis: SafeBasisReferenceSet,
    /// Carries issued_at; see the source and invariant table.
    pub issued_at: MarketInstant,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target_ref | `MarketWorkTargetRef` | 原target |
| effect_intent | `MarketEffectIntentRef` | 原external幂等意图 |
| fence | `DispatchFence` | claim currentfence |
| version_ref | `Option<MarketVersionRef>` | 分发必须Some exactversion；review/notice/observation无版本许可时None |
| authority_basis | `SafeBasisReferenceSet` | 正式当前gate结果 |
| issued_at | `MarketInstant` | ClockPort，在同version serialization许可UoW提交后才外发 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### LocalGateResult

```rust
/// Carries LocalGateResult with explicit sources and no upstream body.
pub struct LocalGateResult {
    /// Carries allowed; see the source and invariant table.
    pub allowed: bool,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries failure; see the source and invariant table.
    pub failure: Option<SafeFailureRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| allowed | `bool` | 只表示本地guard全部满足，非approval |
| basis_refs | `SafeBasisReferenceSet` | 必须完整正式basis，不允许空集合allowed |
| failure | `Option<SafeFailureRef>` | allowed=false必须Some；allowed=true必须None |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### PublisherRelationState

```rust
/// Represents the finite PublisherRelationState surface without owning upstream truth.
pub enum PublisherRelationState {
    /// Carries local Bound posture; it does not establish upstream truth.
    Bound,
    /// Carries local Released posture; it does not establish upstream truth.
    Released,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Bound | Carries local Bound posture; it does not establish upstream truth. | carrier=PublisherRelation；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Released | Carries local Released posture; it does not establish upstream truth. | carrier=PublisherRelation；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=PublisherRelation；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### SourceVerificationState

```rust
/// Represents the finite SourceVerificationState surface without owning upstream truth.
pub enum SourceVerificationState {
    /// Carries local Pending posture; it does not establish upstream truth.
    Pending,
    /// Carries local Qualified posture; it does not establish upstream truth.
    Qualified,
    /// Carries local Blocked posture; it does not establish upstream truth.
    Blocked,
    /// Carries local Invalidated posture; it does not establish upstream truth.
    Invalidated,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Pending | Carries local Pending posture; it does not establish upstream truth. | carrier=SourceVerification；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Qualified | Carries local Qualified posture; it does not establish upstream truth. | carrier=SourceVerification；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Blocked | Carries local Blocked posture; it does not establish upstream truth. | carrier=SourceVerification；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Invalidated | Carries local Invalidated posture; it does not establish upstream truth. | carrier=SourceVerification；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=SourceVerification；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### PublicationApplicationState

```rust
/// Represents the finite PublicationApplicationState surface without owning upstream truth.
pub enum PublicationApplicationState {
    /// Carries local Draft posture; it does not establish upstream truth.
    Draft,
    /// Carries local Submitted posture; it does not establish upstream truth.
    Submitted,
    /// Carries local Terminated posture; it does not establish upstream truth.
    Terminated,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Draft | Carries local Draft posture; it does not establish upstream truth. | carrier=PublicationApplication；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Submitted | Carries local Submitted posture; it does not establish upstream truth. | carrier=PublicationApplication；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Terminated | Carries local Terminated posture; it does not establish upstream truth. | carrier=PublicationApplication；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=PublicationApplication；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### ReviewHandoffState

```rust
/// Represents the finite ReviewHandoffState surface without owning upstream truth.
pub enum ReviewHandoffState {
    /// Carries local PendingDispatch posture; it does not establish upstream truth.
    PendingDispatch,
    /// Carries local WaitingDecision posture; it does not establish upstream truth.
    WaitingDecision,
    /// Carries local MatchedDecision posture; it does not establish upstream truth.
    MatchedDecision,
    /// Carries local CommitUnknown posture; it does not establish upstream truth.
    CommitUnknown,
    /// Carries local ContractBlocked posture; it does not establish upstream truth.
    ContractBlocked,
    /// Carries local Failed posture; it does not establish upstream truth.
    Failed,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| PendingDispatch | Carries local PendingDispatch posture; it does not establish upstream truth. | carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| WaitingDecision | Carries local WaitingDecision posture; it does not establish upstream truth. | carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| MatchedDecision | Carries local MatchedDecision posture; it does not establish upstream truth. | carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| CommitUnknown | Carries local CommitUnknown posture; it does not establish upstream truth. | carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| ContractBlocked | Carries local ContractBlocked posture; it does not establish upstream truth. | carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Failed | Carries local Failed posture; it does not establish upstream truth. | carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=ReviewHandoff；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### MarketVersionState

```rust
/// Represents the finite MarketVersionState surface without owning upstream truth.
pub enum MarketVersionState {
    /// Carries local Staged posture; it does not establish upstream truth.
    Staged,
    /// Carries local Listed posture; it does not establish upstream truth.
    Listed,
    /// Carries local Restricted posture; it does not establish upstream truth.
    Restricted,
    /// Carries local Withdrawn posture; it does not establish upstream truth.
    Withdrawn,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Staged | Carries local Staged posture; it does not establish upstream truth. | carrier=MarketVersion；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Listed | Carries local Listed posture; it does not establish upstream truth. | carrier=MarketVersion；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Restricted | Carries local Restricted posture; it does not establish upstream truth. | carrier=MarketVersion；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Withdrawn | Carries local Withdrawn posture; it does not establish upstream truth. | carrier=MarketVersion；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=MarketVersion；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### DistributionIntentState

```rust
/// Represents the finite DistributionIntentState surface without owning upstream truth.
pub enum DistributionIntentState {
    /// Carries local Accepted posture; it does not establish upstream truth.
    Accepted,
    /// Carries local Cancelled posture; it does not establish upstream truth.
    Cancelled,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Accepted | Carries local Accepted posture; it does not establish upstream truth. | carrier=DistributionIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Cancelled | Carries local Cancelled posture; it does not establish upstream truth. | carrier=DistributionIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=DistributionIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### DistributionAttemptState

```rust
/// Represents the finite DistributionAttemptState surface without owning upstream truth.
pub enum DistributionAttemptState {
    /// Carries local Prepared posture; it does not establish upstream truth.
    Prepared,
    /// Carries local Dispatching posture; it does not establish upstream truth.
    Dispatching,
    /// Carries local Confirmed posture; it does not establish upstream truth.
    Confirmed,
    /// Carries local Failed posture; it does not establish upstream truth.
    Failed,
    /// Carries local CommitUnknown posture; it does not establish upstream truth.
    CommitUnknown,
    /// Carries local Blocked posture; it does not establish upstream truth.
    Blocked,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Prepared | Carries local Prepared posture; it does not establish upstream truth. | carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Dispatching | Carries local Dispatching posture; it does not establish upstream truth. | carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Confirmed | Carries local Confirmed posture; it does not establish upstream truth. | carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Failed | Carries local Failed posture; it does not establish upstream truth. | carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| CommitUnknown | Carries local CommitUnknown posture; it does not establish upstream truth. | carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Blocked | Carries local Blocked posture; it does not establish upstream truth. | carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=DistributionAttempt；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### ImpactCoverageKind

```rust
/// Represents the finite ImpactCoverageKind surface without owning upstream truth.
pub enum ImpactCoverageKind {
    /// Carries local Partial posture; it does not establish upstream truth.
    Partial,
    /// Carries local KnownScopeComplete posture; it does not establish upstream truth.
    KnownScopeComplete,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Partial | Carries local Partial posture; it does not establish upstream truth. | carrier=ImpactRecord；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| KnownScopeComplete | Carries local KnownScopeComplete posture; it does not establish upstream truth. | carrier=ImpactRecord；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=ImpactRecord；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### NoticeIntentState

```rust
/// Represents the finite NoticeIntentState surface without owning upstream truth.
pub enum NoticeIntentState {
    /// Carries local Prepared posture; it does not establish upstream truth.
    Prepared,
    /// Carries local Dispatching posture; it does not establish upstream truth.
    Dispatching,
    /// Carries local Confirmed posture; it does not establish upstream truth.
    Confirmed,
    /// Carries local Failed posture; it does not establish upstream truth.
    Failed,
    /// Carries local CommitUnknown posture; it does not establish upstream truth.
    CommitUnknown,
    /// Carries local Blocked posture; it does not establish upstream truth.
    Blocked,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Prepared | Carries local Prepared posture; it does not establish upstream truth. | carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Dispatching | Carries local Dispatching posture; it does not establish upstream truth. | carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Confirmed | Carries local Confirmed posture; it does not establish upstream truth. | carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Failed | Carries local Failed posture; it does not establish upstream truth. | carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| CommitUnknown | Carries local CommitUnknown posture; it does not establish upstream truth. | carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Blocked | Carries local Blocked posture; it does not establish upstream truth. | carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=NoticeIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### OperationRecordState

```rust
/// Represents the finite OperationRecordState surface without owning upstream truth.
pub enum OperationRecordState {
    /// Carries local Reserved posture; it does not establish upstream truth.
    Reserved,
    /// Carries local Completed posture; it does not establish upstream truth.
    Completed,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Reserved | Carries local Reserved posture; it does not establish upstream truth. | carrier=OperationRecord；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Completed | Carries local Completed posture; it does not establish upstream truth. | carrier=OperationRecord；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=OperationRecord；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### DeferredWorkState

```rust
/// Represents the finite DeferredWorkState surface without owning upstream truth.
pub enum DeferredWorkState {
    /// Carries local Pending posture; it does not establish upstream truth.
    Pending,
    /// Carries local Claimed posture; it does not establish upstream truth.
    Claimed,
    /// Carries local Settled posture; it does not establish upstream truth.
    Settled,
    /// Carries local Blocked posture; it does not establish upstream truth.
    Blocked,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Pending | Carries local Pending posture; it does not establish upstream truth. | carrier=DeferredWork；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Claimed | Carries local Claimed posture; it does not establish upstream truth. | carrier=DeferredWork；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Settled | Carries local Settled posture; it does not establish upstream truth. | carrier=DeferredWork；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Blocked | Carries local Blocked posture; it does not establish upstream truth. | carrier=DeferredWork；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=DeferredWork；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。


### RecoveryIntentState

```rust
/// Represents the finite RecoveryIntentState surface without owning upstream truth.
pub enum RecoveryIntentState {
    /// Carries local Requested posture; it does not establish upstream truth.
    Requested,
    /// Carries local Running posture; it does not establish upstream truth.
    Running,
    /// Carries local Completed posture; it does not establish upstream truth.
    Completed,
    /// Carries local Blocked posture; it does not establish upstream truth.
    Blocked,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Requested | Carries local Requested posture; it does not establish upstream truth. | carrier=RecoveryIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Running | Carries local Running posture; it does not establish upstream truth. | carrier=RecoveryIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Completed | Carries local Completed posture; it does not establish upstream truth. | carrier=RecoveryIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Blocked | Carries local Blocked posture; it does not establish upstream truth. | carrier=RecoveryIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=RecoveryIntent；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### ReferenceSnapshotState

```rust
/// Represents the finite ReferenceSnapshotState surface without owning upstream truth.
pub enum ReferenceSnapshotState {
    /// Carries local Qualified posture; it does not establish upstream truth.
    Qualified,
    /// Carries local Stale posture; it does not establish upstream truth.
    Stale,
    /// Carries local Unavailable posture; it does not establish upstream truth.
    Unavailable,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Qualified | Carries local Qualified posture; it does not establish upstream truth. | carrier=QualifiedReferenceSnapshot；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Stale | Carries local Stale posture; it does not establish upstream truth. | carrier=QualifiedReferenceSnapshot；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Unavailable | Carries local Unavailable posture; it does not establish upstream truth. | carrier=QualifiedReferenceSnapshot；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=QualifiedReferenceSnapshot；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。

### ReadProjectionState

```rust
/// Represents the finite ReadProjectionState surface without owning upstream truth.
pub enum ReadProjectionState {
    /// Carries local Fresh posture; it does not establish upstream truth.
    Fresh,
    /// Carries local Stale posture; it does not establish upstream truth.
    Stale,
    /// Carries local Rebuilding posture; it does not establish upstream truth.
    Rebuilding,
    /// Carries local Unavailable posture; it does not establish upstream truth.
    Unavailable,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Fresh | Carries local Fresh posture; it does not establish upstream truth. | carrier=ReadProjection；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Stale | Carries local Stale posture; it does not establish upstream truth. | carrier=ReadProjection；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Rebuilding | Carries local Rebuilding posture; it does not establish upstream truth. | carrier=ReadProjection；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |
| Unavailable | Carries local Unavailable posture; it does not establish upstream truth. | carrier=ReadProjection；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。 |

归属：contracts；carrier=ReadProjection；合法来源/去向详见当前02§9，Step10完整矩阵承接；不允许DTO指定任意state。


### QualifiedSourceRuleInput

```rust
/// Carries QualifiedSourceRuleInput with explicit sources and no upstream body.
pub struct QualifiedSourceRuleInput {
    /// Carries contract_ref; see the source and invariant table.
    pub contract_ref: OwnerConsumerContractRef,
    /// Carries require_immutable_version; see the source and invariant table.
    pub require_immutable_version: bool,
    /// Carries require_visibility; see the source and invariant table.
    pub require_visibility: bool,
    /// Carries require_eligibility; see the source and invariant table.
    pub require_eligibility: bool,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| contract_ref | `OwnerConsumerContractRef` | 正式consumer规则，activepublish三个require必须true，配置不可豁免 |
| require_immutable_version | `bool` | 正式consumer规则，activepublish三个require必须true，配置不可豁免 |
| require_visibility | `bool` | 正式consumer规则，activepublish三个require必须true，配置不可豁免 |
| require_eligibility | `bool` | 正式consumer规则，activepublish三个require必须true，配置不可豁免 |

归属：contracts；正式consumer规则，activepublish三个require必须true，配置不可豁免

### ReviewBindingRequirements

```rust
/// Carries ReviewBindingRequirements with explicit sources and no upstream body.
pub struct ReviewBindingRequirements {
    /// Carries contract_ref; see the source and invariant table.
    pub contract_ref: OwnerConsumerContractRef,
    /// Carries require_approved_for_listing; see the source and invariant table.
    pub require_approved_for_listing: bool,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| contract_ref | `OwnerConsumerContractRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| require_approved_for_listing | `bool` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### VersionAdmissionRequirements

```rust
/// Carries VersionAdmissionRequirements with explicit sources and no upstream body.
pub struct VersionAdmissionRequirements {
    /// Carries source_rules; see the source and invariant table.
    pub source_rules: QualifiedSourceRuleInput,
    /// Carries review_rules; see the source and invariant table.
    pub review_rules: ReviewBindingRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_rules | `QualifiedSourceRuleInput` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| review_rules | `ReviewBindingRequirements` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### AcquisitionRequirements

```rust
/// Carries AcquisitionRequirements with explicit sources and no upstream body.
pub struct AcquisitionRequirements {
    /// Carries admission; see the source and invariant table.
    pub admission: VersionAdmissionRequirements,
    /// Carries receiver_contract_ref; see the source and invariant table.
    pub receiver_contract_ref: OwnerConsumerContractRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| admission | `VersionAdmissionRequirements` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| receiver_contract_ref | `OwnerConsumerContractRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### DispositionRequirements

```rust
/// Carries DispositionRequirements with explicit sources and no upstream body.
pub struct DispositionRequirements {
    /// Carries authority_contract_ref; see the source and invariant table.
    pub authority_contract_ref: OwnerConsumerContractRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| authority_contract_ref | `OwnerConsumerContractRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### RecoveryRequirements

```rust
/// Carries RecoveryRequirements with explicit sources and no upstream body.
pub struct RecoveryRequirements {
    /// Carries authority_contract_ref; see the source and invariant table.
    pub authority_contract_ref: OwnerConsumerContractRef,
    /// Carries require_original_intent; see the source and invariant table.
    pub require_original_intent: bool,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| authority_contract_ref | `OwnerConsumerContractRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| require_original_intent | `bool` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ReadBoundaryRequirements

```rust
/// Carries ReadBoundaryRequirements with explicit sources and no upstream body.
pub struct ReadBoundaryRequirements {
    /// Carries scope_contract_ref; see the source and invariant table.
    pub scope_contract_ref: OwnerConsumerContractRef,
    /// Carries require_current_disclosure; see the source and invariant table.
    pub require_current_disclosure: bool,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope_contract_ref | `OwnerConsumerContractRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| require_current_disclosure | `bool` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### CurrentAuthorityInput

```rust
/// Carries CurrentAuthorityInput with explicit sources and no upstream body.
pub struct CurrentAuthorityInput {
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| publisher_ref | `PublisherRelationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| authority_ref | `PublisherAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| validity_ref | `SourceValidityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### CurrentDecisionInput

```rust
/// Carries CurrentDecisionInput with explicit sources and no upstream body.
pub struct CurrentDecisionInput {
    /// Carries decision_ref; see the source and invariant table.
    pub decision_ref: GovernanceDecisionRef,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: GovernanceOutcomeRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: DecisionValidityRef,
    /// Carries approved; see the source and invariant table.
    pub approved: bool,
    /// Carries binding; see the source and invariant table.
    pub binding: PublicationBasis,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| decision_ref | `GovernanceDecisionRef` | approved只允许formal Gov exactmapping；不由scan/signature/ACK推，缺对应contract blocked |
| outcome_ref | `GovernanceOutcomeRef` | approved只允许formal Gov exactmapping；不由scan/signature/ACK推，缺对应contract blocked |
| validity_ref | `DecisionValidityRef` | approved只允许formal Gov exactmapping；不由scan/signature/ACK推，缺对应contract blocked |
| approved | `bool` | approved只允许formal Gov exactmapping；不由scan/signature/ACK推，缺对应contract blocked |
| binding | `PublicationBasis` | approved只允许formal Gov exactmapping；不由scan/signature/ACK推，缺对应contract blocked |

归属：contracts；approved只允许formal Gov exactmapping；不由scan/signature/ACK推，缺对应contract blocked

### CurrentQualificationInput

```rust
/// Carries CurrentQualificationInput with explicit sources and no upstream body.
pub struct CurrentQualificationInput {
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries publisher; see the source and invariant table.
    pub publisher: CurrentAuthorityInput,
    /// Carries materials; see the source and invariant table.
    pub materials: MaterialReferenceSet,
    /// Carries decision; see the source and invariant table.
    pub decision: CurrentDecisionInput,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `SourceBinding` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| publisher | `CurrentAuthorityInput` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| materials | `MaterialReferenceSet` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| decision | `CurrentDecisionInput` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedPublisherInput

```rust
/// Carries QualifiedPublisherInput with explicit sources and no upstream body.
pub struct QualifiedPublisherInput {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `PublisherRelationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| principal_ref | `PublisherPrincipalRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| authority_ref | `PublisherAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### AuthorityDispositionInput

```rust
/// Carries AuthorityDispositionInput with explicit sources and no upstream body.
pub struct AuthorityDispositionInput {
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
    /// Carries verification_refs; see the source and invariant table.
    pub verification_refs: Vec<SourceVerificationRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| authority_ref | `DispositionAuthorityRef` | 正式当前解除authority+≤batchlimit有限verificationrefs；逐关联核验，不无界事务不重复key续办 |
| reason_ref | `SafeReasonRef` | 正式当前解除authority+≤batchlimit有限verificationrefs；逐关联核验，不无界事务不重复key续办 |
| verification_refs | `Vec<SourceVerificationRef>` | 正式当前解除authority+≤batchlimit有限verificationrefs；逐关联核验，不无界事务不重复key续办 |

归属：contracts；正式当前解除authority+≤batchlimit有限verificationrefs；逐关联核验，不无界事务不重复key续办

### SourceVerificationInput

```rust
/// Carries SourceVerificationInput with explicit sources and no upstream body.
pub struct SourceVerificationInput {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries source_candidate; see the source and invariant table.
    pub source_candidate: SourceVerificationTarget,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | IDport+候选，factory Pending/bindingNone/materialsEmpty/outcomeNone |
| publisher_ref | `PublisherRelationRef` | Verify请求关联+typedpublisher当前authority，保存后Release可按正式localtyped关联失效；不只同scope猜关联 |
| source_candidate | `SourceVerificationTarget` | IDport+候选，factory Pending/bindingNone/materialsEmpty/outcomeNone |

归属：contracts；IDport+候选，factory Pending/bindingNone/materialsEmpty/outcomeNone


### SourceInvalidationInput

```rust
/// Carries SourceInvalidationInput with explicit sources and no upstream body.
pub struct SourceInvalidationInput {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: QualificationOutcomeRef,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `QualificationOutcomeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| reason_ref | `SafeReasonRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedPublicationInput

```rust
/// Carries QualifiedPublicationInput with explicit sources and no upstream body.
pub struct QualifiedPublicationInput {
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries materials; see the source and invariant table.
    pub materials: MaterialReferenceSet,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: ReviewHandoffRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| basis_ref | `PublicationBasisRef` | application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入 |
| source | `SourceBinding` | application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入 |
| publisher_ref | `PublisherRelationRef` | application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入 |
| materials | `MaterialReferenceSet` | application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入 |
| scope_ref | `MarketScopeRef` | application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入 |
| review_ref | `ReviewHandoffRef` | application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入 |

归属：contracts；application重核formal U1当前source/publisher/material/scope；basis/reviewIDs由IDport；只内侧qualified输入

### DraftPublicationInput

```rust
/// Carries DraftPublicationInput with explicit sources and no upstream body.
pub struct DraftPublicationInput {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | Create IDport，Revise要求application_ref等于loadedID；Draft/basisNone/reviewNone |
| draft_spec | `DraftPublicationSpec` | Create IDport，Revise要求application_ref等于loadedID；Draft/basisNone/reviewNone |

归属：contracts；Create IDport，Revise要求application_ref等于loadedID；Draft/basisNone/reviewNone

### SubmittedApplicationInput

```rust
/// Carries SubmittedApplicationInput with explicit sources and no upstream body.
pub struct SubmittedApplicationInput {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | submit同UoW创建，PendingDispatch且outcome/failure/decisionNone |
| application_ref | `PublicationApplicationRef` | submit同UoW创建，PendingDispatch且outcome/failure/decisionNone |
| basis_ref | `PublicationBasisRef` | submit同UoW创建，PendingDispatch且outcome/failure/decisionNone |

归属：contracts；submit同UoW创建，PendingDispatch且outcome/failure/decisionNone

### ApplicationTerminationInput

```rust
/// Carries ApplicationTerminationInput with explicit sources and no upstream body.
pub struct ApplicationTerminationInput {
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| authority_ref | `DispositionAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| reason_ref | `SafeReasonRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ListingCreationInput

```rust
/// Carries ListingCreationInput with explicit sources and no upstream body.
pub struct ListingCreationInput {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| publisher_ref | `PublisherRelationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| metadata | `MarketListingMetadata` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| category_refs | `CategoryRefSet` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ListingMetadataInput

```rust
/// Carries ListingMetadataInput with explicit sources and no upstream body.
pub struct ListingMetadataInput {
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| metadata | `MarketListingMetadata` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| category_refs | `CategoryRefSet` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### MarketVersionCreationInput

```rust
/// Carries MarketVersionCreationInput with explicit sources and no upstream body.
pub struct MarketVersionCreationInput {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | ID与typedlisting/appbasis exactsource匹配，Staged/decisionNone/dispositionNone |
| listing_ref | `MarketplaceListingRef` | ID与typedlisting/appbasis exactsource匹配，Staged/decisionNone/dispositionNone |
| source_binding | `SourceBinding` | ID与typedlisting/appbasis exactsource匹配，Staged/decisionNone/dispositionNone |
| application_ref | `PublicationApplicationRef` | ID与typedlisting/appbasis exactsource匹配，Staged/decisionNone/dispositionNone |

归属：contracts；ID与typedlisting/appbasis exactsource匹配，Staged/decisionNone/dispositionNone

### VersionAdmissionInput

```rust
/// Carries VersionAdmissionInput with explicit sources and no upstream body.
pub struct VersionAdmissionInput {
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: GovernanceDecisionBinding,
    /// Carries current; see the source and invariant table.
    pub current: CurrentQualificationInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| decision_binding | `GovernanceDecisionBinding` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| current | `CurrentQualificationInput` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### VersionRestrictionInput

```rust
/// Carries VersionRestrictionInput with explicit sources and no upstream body.
pub struct VersionRestrictionInput {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| authority_ref | `DispositionAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### VersionWithdrawalInput

```rust
/// Carries VersionWithdrawalInput with explicit sources and no upstream body.
pub struct VersionWithdrawalInput {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| authority_ref | `DispositionAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### CategoryCreationInput

```rust
/// Carries CategoryCreationInput with explicit sources and no upstream body.
pub struct CategoryCreationInput {
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| category_ref | `CategoryRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| label | `MarketCategoryLabel` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| parent_ref | `OptionalCategoryRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | freshformalresolver taxonomy scope，root不可用implicitdefault |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### CategoryChangeInput

```rust
/// Carries CategoryChangeInput with explicit sources and no upstream body.
pub struct CategoryChangeInput {
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| label | `MarketCategoryLabel` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| parent_ref | `OptionalCategoryRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。


### AcquisitionTargetInput

```rust
/// Carries AcquisitionTargetInput with explicit sources and no upstream body.
pub struct AcquisitionTargetInput {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| consumer_ref | `DistributionConsumerRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| receiver_ref | `DistributionReceiverRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedAcquisitionInput

```rust
/// Carries QualifiedAcquisitionInput with explicit sources and no upstream body.
pub struct QualifiedAcquisitionInput {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries target; see the source and invariant table.
    pub target: AcquisitionTargetInput,
    /// Carries current; see the source and invariant table.
    pub current: CurrentQualificationInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| target | `AcquisitionTargetInput` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| current | `CurrentQualificationInput` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### AcceptedDistributionInput

```rust
/// Carries AcceptedDistributionInput with explicit sources and no upstream body.
pub struct AcceptedDistributionInput {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: DistributionRelationRef,
    /// Carries intent; see the source and invariant table.
    pub intent: DistributionIntentSnapshot,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `DistributionRelationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| intent | `DistributionIntentSnapshot` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### DistributionDispatchInput

```rust
/// Carries DistributionDispatchInput with explicit sources and no upstream body.
pub struct DistributionDispatchInput {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| intent_ref | `DistributionIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| fence | `DispatchFence` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### DistributionCancelInput

```rust
/// Carries DistributionCancelInput with explicit sources and no upstream body.
pub struct DistributionCancelInput {
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: RecoveryAuthorityRef,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| authority_ref | `RecoveryAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| reason_ref | `SafeReasonRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### CurrentDispatchGateInput

```rust
/// Carries CurrentDispatchGateInput with explicit sources and no upstream body.
pub struct CurrentDispatchGateInput {
    /// Carries permission; see the source and invariant table.
    pub permission: DispatchPermission,
    /// Carries current; see the source and invariant table.
    pub current: CurrentQualificationInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| permission | `DispatchPermission` | 当前formalqualification+同version serialization许可，begin保存Dispatching后commit才externalcall |
| current | `CurrentQualificationInput` | 当前formalqualification+同version serialization许可，begin保存Dispatching后commit才externalcall |

归属：contracts；当前formalqualification+同version serialization许可，begin保存Dispatching后commit才externalcall

### DistributionOutcomeContext

```rust
/// Carries DistributionOutcomeContext with explicit sources and no upstream body.
pub struct DistributionOutcomeContext {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| version_ref | `MarketVersionRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| consumer_ref | `DistributionConsumerRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| receiver_ref | `DistributionReceiverRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ImpactEnumerationInput

```rust
/// Carries ImpactEnumerationInput with explicit sources and no upstream body.
pub struct ImpactEnumerationInput {
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries coverage_cursor; see the source and invariant table.
    pub coverage_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| impact_ref | `ImpactRecordRef` | 固定committedcursor，Partial/emptyrefs；空枚举不假全安装覆盖 |
| disposition_ref | `WithdrawalDispositionRef` | 固定committedcursor，Partial/emptyrefs；空枚举不假全安装覆盖 |
| coverage_cursor | `MarketSourceCursor` | 固定committedcursor，Partial/emptyrefs；空枚举不假全安装覆盖 |

归属：contracts；固定committedcursor，Partial/emptyrefs；空枚举不假全安装覆盖

### ImpactDeltaInput

```rust
/// Carries ImpactDeltaInput with explicit sources and no upstream body.
pub struct ImpactDeltaInput {
    /// Carries relation_refs; see the source and invariant table.
    pub relation_refs: DistributionRelationRefSet,
    /// Carries unknown_attempt_refs; see the source and invariant table.
    pub unknown_attempt_refs: DistributionAttemptRefSet,
    /// Carries coverage_cursor; see the source and invariant table.
    pub coverage_cursor: MarketSourceCursor,
    /// Carries enumeration_complete; see the source and invariant table.
    pub enumeration_complete: bool,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_refs | `DistributionRelationRefSet` | 本地typedrelation/unknown增量去重；enumcomplete只固定cursor本地范围完整；late增量超cursor重新Partial |
| unknown_attempt_refs | `DistributionAttemptRefSet` | 本地typedrelation/unknown增量去重；enumcomplete只固定cursor本地范围完整；late增量超cursor重新Partial |
| coverage_cursor | `MarketSourceCursor` | 本地typedrelation/unknown增量去重；enumcomplete只固定cursor本地范围完整；late增量超cursor重新Partial |
| enumeration_complete | `bool` | 本地typedrelation/unknown增量去重；enumcomplete只固定cursor本地范围完整；late增量超cursor重新Partial |

归属：contracts；本地typedrelation/unknown增量去重；enumcomplete只固定cursor本地范围完整；late增量超cursor重新Partial

### DistributionImpactInput

```rust
/// Carries DistributionImpactInput with explicit sources and no upstream body.
pub struct DistributionImpactInput {
    /// Carries relation; see the source and invariant table.
    pub relation: DistributionRelationSnapshot,
    /// Carries attempt; see the source and invariant table.
    pub attempt: DistributionAttemptSnapshot,
    /// Carries disposition; see the source and invariant table.
    pub disposition: WithdrawalDispositionSnapshot,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation | `DistributionRelationSnapshot` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| attempt | `DistributionAttemptSnapshot` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| disposition | `WithdrawalDispositionSnapshot` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedNoticePlanInput

```rust
/// Carries QualifiedNoticePlanInput with explicit sources and no upstream body.
pub struct QualifiedNoticePlanInput {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | formal target/channel/current scope；unique(impact,target,channel,scope)，Prepared/refsNone |
| impact_ref | `ImpactRecordRef` | formal target/channel/current scope；unique(impact,target,channel,scope)，Prepared/refsNone |
| target_ref | `NoticeTargetRef` | formal target/channel/current scope；unique(impact,target,channel,scope)，Prepared/refsNone |
| channel_ref | `NoticeChannelRef` | formal target/channel/current scope；unique(impact,target,channel,scope)，Prepared/refsNone |
| scope_ref | `MarketScopeRef` | formal target/channel/current scope；unique(impact,target,channel,scope)，Prepared/refsNone |

归属：contracts；formal target/channel/current scope；unique(impact,target,channel,scope)，Prepared/refsNone

### NoticeDispatchInput

```rust
/// Carries NoticeDispatchInput with explicit sources and no upstream body.
pub struct NoticeDispatchInput {
    /// Carries permission; see the source and invariant table.
    pub permission: DispatchPermission,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| permission | `DispatchPermission` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### NoticeOutcomeContext

```rust
/// Carries NoticeOutcomeContext with explicit sources and no upstream body.
pub struct NoticeOutcomeContext {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| target_ref | `NoticeTargetRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| channel_ref | `NoticeChannelRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。


### QualifiedOperationInput

```rust
/// Carries QualifiedOperationInput with explicit sources and no upstream body.
pub struct QualifiedOperationInput {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries context; see the source and invariant table.
    pub context: OperationContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| context | `OperationContext` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：domain；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### DurableResponsibilityInput

```rust
/// Carries DurableResponsibilityInput with explicit sources and no upstream body.
pub struct DurableResponsibilityInput {
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
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| work_ref | `DeferredWorkRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| operation_ref | `MarketOperationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| target_ref | `MarketWorkTargetRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| intent_ref | `MarketEffectIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| fence | `DispatchFence` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### WorkClaimInput

```rust
/// Carries WorkClaimInput with explicit sources and no upstream body.
pub struct WorkClaimInput {
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries now; see the source and invariant table.
    pub now: MarketInstant,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| fence | `DispatchFence` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| now | `MarketInstant` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### WorkSettlementInput

```rust
/// Carries WorkSettlementInput with explicit sources and no upstream body.
pub struct WorkSettlementInput {
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: StoredOperationResultRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| fence | `DispatchFence` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| result_ref | `StoredOperationResultRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### RecoveryRequestInput

```rust
/// Carries RecoveryRequestInput with explicit sources and no upstream body.
pub struct RecoveryRequestInput {
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: RecoveryIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: RecoveryAuthorityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| recovery_ref | `RecoveryIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| target_ref | `MarketWorkTargetRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| authority_ref | `RecoveryAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedRecoveryInput

```rust
/// Carries QualifiedRecoveryInput with explicit sources and no upstream body.
pub struct QualifiedRecoveryInput {
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: RecoveryAuthorityRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries inspection; see the source and invariant table.
    pub inspection: Option<ExternalEffectInspectionInput>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| authority_ref | `RecoveryAuthorityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| target_ref | `MarketWorkTargetRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| inspection | `Option<ExternalEffectInspectionInput>` | external Review/Distribution/Notice/Observation target must Some formal original-intent proof; local Snapshot/Projection/Impact target None, no fabricated remote notcommit; Recovery recursion blocked |

归属：contracts；正式恢复authority+exact typed original target; external inspection Some proof/current unknown, local maintenance None and only durable exact continuation; require_original_intent cannot be disabled

### ObservationOutcomeContext

```rust
/// Carries ObservationOutcomeContext with explicit sources and no upstream body.
pub struct ObservationOutcomeContext {
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
| operation_ref | `MarketOperationRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| audit_refs | `MarketAuditRefSet` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### RecoveryTargetInput

```rust
/// Carries RecoveryTargetInput with explicit sources and no upstream body.
pub struct RecoveryTargetInput {
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries effect_intent; see the source and invariant table.
    pub effect_intent: MarketEffectIntentRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target_ref | `MarketWorkTargetRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| effect_intent | `MarketEffectIntentRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### OwnerReferenceContext

```rust
/// Carries OwnerReferenceContext with explicit sources and no upstream body.
pub struct OwnerReferenceContext {
    /// Carries owner_kind_ref; see the source and invariant table.
    pub owner_kind_ref: QualifiedOwnerKindRef,
    /// Carries canonical_ref; see the source and invariant table.
    pub canonical_ref: CanonicalOwnerRef,
    /// Carries contract_ref; see the source and invariant table.
    pub contract_ref: OwnerConsumerContractRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_kind_ref | `QualifiedOwnerKindRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| canonical_ref | `CanonicalOwnerRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| contract_ref | `OwnerConsumerContractRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedSnapshotInput

```rust
/// Carries QualifiedSnapshotInput with explicit sources and no upstream body.
pub struct QualifiedSnapshotInput {
    /// Carries snapshot_ref; see the source and invariant table.
    pub snapshot_ref: QualifiedReferenceSnapshotRef,
    /// Carries source_ref; see the source and invariant table.
    pub source_ref: TypedOwnerReference,
    /// Carries source_version; see the source and invariant table.
    pub source_version: OwnerVersionRef,
    /// Carries safe_material; see the source and invariant table.
    pub safe_material: QualifiedSnapshotMaterial,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| snapshot_ref | `QualifiedReferenceSnapshotRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| source_ref | `TypedOwnerReference` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| source_version | `OwnerVersionRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| safe_material | `QualifiedSnapshotMaterial` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| validity_ref | `SourceValidityRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### SourceRefreshFailureInput

```rust
/// Carries SourceRefreshFailureInput with explicit sources and no upstream body.
pub struct SourceRefreshFailureInput {
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: SafeFailureRef,
    /// Carries has_safe_visible_old_material; see the source and invariant table.
    pub has_safe_visible_old_material: bool,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| failure_ref | `SafeFailureRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| has_safe_visible_old_material | `bool` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ReadSubjectInput

```rust
/// Carries ReadSubjectInput with explicit sources and no upstream body.
pub struct ReadSubjectInput {
    /// Carries subject; see the source and invariant table.
    pub subject: MarketAuditSubjectRef,
    /// Carries source_refs; see the source and invariant table.
    pub source_refs: Vec<TypedOwnerReference>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `MarketAuditSubjectRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| source_refs | `Vec<TypedOwnerReference>` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ReadSourceInspectionInput

```rust
/// Carries ReadSourceInspectionInput with explicit sources and no upstream body.
pub struct ReadSourceInspectionInput {
    /// Carries source_refs; see the source and invariant table.
    pub source_refs: Vec<TypedOwnerReference>,
    /// Carries snapshot_refs; see the source and invariant table.
    pub snapshot_refs: QualifiedReferenceSnapshotRefSet,
    /// Carries surface; see the source and invariant table.
    pub surface: ReadSurfaceKind,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: Option<SafeFailureRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_refs | `Vec<TypedOwnerReference>` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| snapshot_refs | `QualifiedReferenceSnapshotRefSet` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| surface | `ReadSurfaceKind` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| failure_ref | `Option<SafeFailureRef>` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。


### ProjectionCreationInput

```rust
/// Carries ProjectionCreationInput with explicit sources and no upstream body.
pub struct ProjectionCreationInput {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| kind | `MarketProjectionKind` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| scope_ref | `MarketScopeRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| source_cursor | `MarketSourceCursor` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ProjectionInvalidationInput

```rust
/// Carries ProjectionInvalidationInput with explicit sources and no upstream body.
pub struct ProjectionInvalidationInput {
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_cursor | `MarketSourceCursor` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| reason_ref | `SafeReasonRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### ProjectionRebuildPlanInput

```rust
/// Carries ProjectionRebuildPlanInput with explicit sources and no upstream body.
pub struct ProjectionRebuildPlanInput {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
    /// Carries snapshot_refs; see the source and invariant table.
    pub snapshot_refs: QualifiedReferenceSnapshotRefSet,
    /// Carries view_keys; see the source and invariant table.
    pub view_keys: MarketReadViewKeySet,
    /// Carries sources; see the source and invariant table.
    pub sources: Vec<ProjectionTruthSource>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |
| kind | `MarketProjectionKind` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |
| scope_ref | `MarketScopeRef` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |
| source_cursor | `MarketSourceCursor` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |
| snapshot_refs | `QualifiedReferenceSnapshotRefSet` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |
| view_keys | `MarketReadViewKeySet` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |
| sources | `Vec<ProjectionTruthSource>` | 非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source |

归属：contracts；非空typedcommitted localfacts+qualifiedsnapshots；旧index不能为source

### ProjectionBuildOutcomeInput

```rust
/// Carries ProjectionBuildOutcomeInput with explicit sources and no upstream body.
pub struct ProjectionBuildOutcomeInput {
    /// Carries plan; see the source and invariant table.
    pub plan: ProjectionRebuildPlanInput,
    /// Carries items; see the source and invariant table.
    pub items: Vec<ProjectionBuildItem>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| plan | `ProjectionRebuildPlanInput` | 原冻结nonemptyfixedsourceplan |
| items | `Vec<ProjectionBuildItem>` | 每viewkey恰一项Rendered/Omitted，缺项不complete |

归属：contracts；完整fixedcursor safeviews；plan与kind/scope/keys一致，原子publish，不暴露partial

### ProjectionBuildFailureInput

```rust
/// Carries ProjectionBuildFailureInput with explicit sources and no upstream body.
pub struct ProjectionBuildFailureInput {
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: SafeFailureRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| failure_ref | `SafeFailureRef` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |
| source_cursor | `MarketSourceCursor` | 内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。 |

归属：contracts；内侧typed输入：ID字段由IDPort生成，其余来自明确requestcandidate→formalport输出或typedlocal读取；Qualified/Current前缀不可客户端直填，缺正式来源blocked；body-free。

### QualifiedSourceInput

```rust
/// Carries QualifiedSourceInput with explicit sources and no upstream body.
pub struct QualifiedSourceInput {
    /// Carries owner_ref; see the source and invariant table.
    pub owner_ref: TypedOwnerReference,
    /// Carries owner_version; see the source and invariant table.
    pub owner_version: OwnerVersionRef,
    /// Carries asset_digest; see the source and invariant table.
    pub asset_digest: OwnerAssetDigest,
    /// Carries visibility_ref; see the source and invariant table.
    pub visibility_ref: OwnerVisibilityRef,
    /// Carries eligibility_ref; see the source and invariant table.
    pub eligibility_ref: OwnerEligibilityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_ref | `TypedOwnerReference` | 正式resolver输出，不解析字符串 |
| owner_version | `OwnerVersionRef` | owner提供不可变版本 |
| asset_digest | `OwnerAssetDigest` | owner提供摘要，不本地重算 |
| visibility_ref | `OwnerVisibilityRef` | owner正式可见依据 |
| eligibility_ref | `OwnerEligibilityRef` | owner消费资格依据 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedMaterialInput

```rust
/// Carries QualifiedMaterialInput with explicit sources and no upstream body.
pub struct QualifiedMaterialInput {
    /// Carries material_ref; see the source and invariant table.
    pub material_ref: OwnerMaterialRef,
    /// Carries binding; see the source and invariant table.
    pub binding: SourceBinding,
    /// Carries kind_ref; see the source and invariant table.
    pub kind_ref: MaterialKindRef,
    /// Carries applicability_ref; see the source and invariant table.
    pub applicability_ref: MaterialApplicabilityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| material_ref | `OwnerMaterialRef` | Artifact/正式材料authority输出 |
| binding | `SourceBinding` | 被核验exact来源 |
| kind_ref | `MaterialKindRef` | authority正式kind，不本地发明scan enum |
| applicability_ref | `MaterialApplicabilityRef` | 适用/有效性依据 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedDecisionInput

```rust
/// Carries QualifiedDecisionInput with explicit sources and no upstream body.
pub struct QualifiedDecisionInput {
    /// Carries decision_ref; see the source and invariant table.
    pub decision_ref: GovernanceDecisionRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: GovernanceOutcomeRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: DecisionValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| decision_ref | `GovernanceDecisionRef` | Gov正式来源 |
| application_ref | `PublicationApplicationRef` | 指定申请，不泛化 |
| basis_ref | `PublicationBasisRef` | 来源/材料/scope完整绑定 |
| outcome_ref | `GovernanceOutcomeRef` | 正式approved/rejected等结果ref，非本地enum |
| validity_ref | `DecisionValidityRef` | 有效期/替代/撤销正式依据 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedReceiverOutcome

```rust
/// Carries QualifiedReceiverOutcome with explicit sources and no upstream body.
pub struct QualifiedReceiverOutcome {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: ReceiverOutcomeRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `ReceiverOutcomeRef` | receiver正式结果 |
| intent_ref | `DistributionIntentRef` | 原外部幂等意图 |
| version_ref | `MarketVersionRef` | 与sourcebinding匹配 |
| consumer_ref | `DistributionConsumerRef` | 指定consumer |
| receiver_ref | `DistributionReceiverRef` | 来源owner匹配 |
| scope_ref | `MarketScopeRef` | 正式结果范围 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedDispositionInput

```rust
/// Carries QualifiedDispositionInput with explicit sources and no upstream body.
pub struct QualifiedDispositionInput {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
    /// Carries action; see the source and invariant table.
    pub action: MarketDispositionKind,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 本地ID |
| version_ref | `MarketVersionRef` | exact处置对象 |
| authority_ref | `DispositionAuthorityRef` | 正式处置依据/来源资格失效依据 |
| action | `MarketDispositionKind` | 仅Restrict/Withdraw本地有限意图 |
| reason_ref | `SafeReasonRef` | 安全原因，不原正文 |
| source_cursor | `MarketSourceCursor` | 同UoW提交序列用于影响增量 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### OperationResultInput

```rust
/// Carries OperationResultInput with explicit sources and no upstream body.
pub struct OperationResultInput {
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

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。


### MarketAuditInput

```rust
/// Carries MarketAuditInput with explicit sources and no upstream body.
pub struct MarketAuditInput {
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

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedObservationOutcome

```rust
/// Carries QualifiedObservationOutcome with explicit sources and no upstream body.
pub struct QualifiedObservationOutcome {
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

归属：contracts；formal Observation receipt + original operation/audit set/scope exact binding; producer/redaction consumer qualification must exist; no evidence/verdict/readiness

### QualifiedOwnerReferenceInput

```rust
/// Carries QualifiedOwnerReferenceInput with explicit sources and no upstream body.
pub struct QualifiedOwnerReferenceInput {
    /// Carries owner_kind_ref; see the source and invariant table.
    pub owner_kind_ref: QualifiedOwnerKindRef,
    /// Carries canonical_ref; see the source and invariant table.
    pub canonical_ref: CanonicalOwnerRef,
    /// Carries contract_ref; see the source and invariant table.
    pub contract_ref: OwnerConsumerContractRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_kind_ref | `QualifiedOwnerKindRef` | 正式owner kind映射，不以UI五类型定义enum |
| canonical_ref | `CanonicalOwnerRef` | 正式owner/SDK提供opaque ref |
| contract_ref | `OwnerConsumerContractRef` | 当前operation/consumer正式资格来源 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedNoticeOutcome

```rust
/// Carries QualifiedNoticeOutcome with explicit sources and no upstream body.
pub struct QualifiedNoticeOutcome {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: NoticeOutcomeRef,
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `NoticeOutcomeRef` | channel正式结果 |
| notice_ref | `NoticeIntentRef` | 原意图关联 |
| target_ref | `NoticeTargetRef` | 指定通知目标 |
| channel_ref | `NoticeChannelRef` | 结果来源 |
| scope_ref | `MarketScopeRef` | 安全披露范围 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualifiedReadInput

```rust
/// Carries QualifiedReadInput with explicit sources and no upstream body.
pub struct QualifiedReadInput {
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries disclosure_ref; see the source and invariant table.
    pub disclosure_ref: DisclosureDecisionRef,
    /// Carries source_constraints; see the source and invariant table.
    pub source_constraints: SourceVisibilityConstraintSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope_ref | `MarketScopeRef` | 正式scope resolver |
| disclosure_ref | `DisclosureDecisionRef` | 当前披露依据，不由ref或public标签猜 |
| source_constraints | `SourceVisibilityConstraintSet` | owner/市场/组织交集 |

归属：contracts；内侧factory input覆盖完整目标字段；ID/cursor由本地port，owner fields来自formaltypedadapter；不暴露为客户端qualified断言。

### QualificationOutcomeInput

```rust
/// Represents the finite QualificationOutcomeInput surface without owning upstream truth.
pub enum QualificationOutcomeInput {
    /// Carries Qualified with QualifiedQualificationPayload.
    Qualified(QualifiedQualificationPayload),
    /// Carries Blocked with QualificationFailurePayload.
    Blocked(QualificationFailurePayload),
    /// Carries Invalidated with QualificationFailurePayload.
    Invalidated(QualificationFailurePayload),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Qualified(QualifiedQualificationPayload) | Carries Qualified. | 有限分类，不自动授权。 |
| Blocked(QualificationFailurePayload) | Carries Blocked. | 有限分类，不自动授权。 |
| Invalidated(QualificationFailurePayload) | Carries Invalidated. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### QualifiedQualificationPayload

```rust
/// Carries QualifiedQualificationPayload with explicit sources and no upstream body.
pub struct QualifiedQualificationPayload {
    /// Carries binding; see the source and invariant table.
    pub binding: SourceBinding,
    /// Carries materials; see the source and invariant table.
    pub materials: MaterialReferenceSet,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: QualificationOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `SourceBinding` | formalqualified全组合，不能bindingNone；outcome是正式safe来源或本地typed核验record关联，不伪造owner决定 |
| materials | `MaterialReferenceSet` | formalqualified全组合，不能bindingNone；outcome是正式safe来源或本地typed核验record关联，不伪造owner决定 |
| outcome_ref | `QualificationOutcomeRef` | formalqualified全组合，不能bindingNone；outcome是正式safe来源或本地typed核验record关联，不伪造owner决定 |

归属：contracts；formalqualified全组合，不能bindingNone；outcome是正式safe来源或本地typed核验record关联，不伪造owner决定

### QualificationFailurePayload

```rust
/// Carries QualificationFailurePayload with explicit sources and no upstream body.
pub struct QualificationFailurePayload {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: QualificationOutcomeRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: SafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `QualificationOutcomeRef` | 本地核验安全结果ref关联缺口来源，非上游qualificationtruth |
| failure_ref | `SafeFailureRef` | 本地核验安全结果ref关联缺口来源，非上游qualificationtruth |

归属：contracts；本地核验安全结果ref关联缺口来源，非上游qualificationtruth

### ReviewDispatchOutcomeInput

```rust
/// Represents the finite ReviewDispatchOutcomeInput surface without owning upstream truth.
pub enum ReviewDispatchOutcomeInput {
    /// Carries Confirmed with ReviewDispatchOutcomeRef.
    Confirmed(ReviewDispatchOutcomeRef),
    /// Carries KnownNotCommitted with SafeFailureRef.
    KnownNotCommitted(SafeFailureRef),
    /// Carries Unknown with SafeFailureRef.
    Unknown(SafeFailureRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Confirmed(ReviewDispatchOutcomeRef) | Carries Confirmed. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |
| KnownNotCommitted(SafeFailureRef) | Carries KnownNotCommitted. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |
| Unknown(SafeFailureRef) | Carries Unknown. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |

归属：contracts；Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown

### ReceiverOutcomeInput

```rust
/// Represents the finite ReceiverOutcomeInput surface without owning upstream truth.
pub enum ReceiverOutcomeInput {
    /// Carries Confirmed with ReceiverOutcomeBinding.
    Confirmed(ReceiverOutcomeBinding),
    /// Carries KnownNotCommitted with SafeFailureRef.
    KnownNotCommitted(SafeFailureRef),
    /// Carries Unknown with SafeFailureRef.
    Unknown(SafeFailureRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Confirmed(ReceiverOutcomeBinding) | Carries Confirmed. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |
| KnownNotCommitted(SafeFailureRef) | Carries KnownNotCommitted. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |
| Unknown(SafeFailureRef) | Carries Unknown. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |

归属：contracts；Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown

### NoticeOutcomeInput

```rust
/// Represents the finite NoticeOutcomeInput surface without owning upstream truth.
pub enum NoticeOutcomeInput {
    /// Carries Confirmed with NoticeOutcomeBinding.
    Confirmed(NoticeOutcomeBinding),
    /// Carries KnownNotCommitted with SafeFailureRef.
    KnownNotCommitted(SafeFailureRef),
    /// Carries Unknown with SafeFailureRef.
    Unknown(SafeFailureRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Confirmed(NoticeOutcomeBinding) | Carries Confirmed. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |
| KnownNotCommitted(SafeFailureRef) | Carries KnownNotCommitted. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |
| Unknown(SafeFailureRef) | Carries Unknown. | Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown |

归属：contracts；Confirmed仅正式原intent匹配结果；review Confirmed只WaitingDecision；notcommitted必须formalproof，timeout只能Unknown

### ExternalEffectInspectionInput

```rust
/// Represents the finite ExternalEffectInspectionInput surface without owning upstream truth.
pub enum ExternalEffectInspectionInput {
    /// Carries Confirmed with SafeBasisReferenceSet.
    Confirmed(SafeBasisReferenceSet),
    /// Carries KnownNotCommitted with SafeBasisReferenceSet.
    KnownNotCommitted(SafeBasisReferenceSet),
    /// Carries Unknown with SafeFailureRef.
    Unknown(SafeFailureRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Confirmed(SafeBasisReferenceSet) | Carries Confirmed. | formalprobe结果，Confirmed/NotCommitted需非空formalbasis；缺probe Unknown不盲发 |
| KnownNotCommitted(SafeBasisReferenceSet) | Carries KnownNotCommitted. | formalprobe结果，Confirmed/NotCommitted需非空formalbasis；缺probe Unknown不盲发 |
| Unknown(SafeFailureRef) | Carries Unknown. | formalprobe结果，Confirmed/NotCommitted需非空formalbasis；缺probe Unknown不盲发 |

归属：contracts；formalprobe结果，Confirmed/NotCommitted需非空formalbasis；缺probe Unknown不盲发

### RecoveryOutcomeInput

```rust
/// Represents the finite RecoveryOutcomeInput surface without owning upstream truth.
pub enum RecoveryOutcomeInput {
    /// Carries Completed with StoredOperationResultRef.
    Completed(StoredOperationResultRef),
    /// Carries Blocked with StoredOperationResultRef.
    Blocked(StoredOperationResultRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Completed(StoredOperationResultRef) | Carries Completed. | 完整逐itemreport已存，Completed非systemready |
| Blocked(StoredOperationResultRef) | Carries Blocked. | 完整逐itemreport已存，Completed非systemready |

归属：contracts；完整逐itemreport已存，Completed非systemready


### ProjectionTruthSource

```rust
/// Represents the finite ProjectionTruthSource surface without owning upstream truth.
pub enum ProjectionTruthSource {
    /// Carries Listing with MarketplaceListingRef.
    Listing(MarketplaceListingRef),
    /// Carries Version with MarketVersionRef.
    Version(MarketVersionRef),
    /// Carries Application with PublicationApplicationRef.
    Application(PublicationApplicationRef),
    /// Carries Relation with DistributionRelationRef.
    Relation(DistributionRelationRef),
    /// Carries Impact with ImpactRecordRef.
    Impact(ImpactRecordRef),
    /// Carries Audit with MarketAuditRef.
    Audit(MarketAuditRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Listing(MarketplaceListingRef) | Carries Listing. | 仅committedlocalfacts，不含旧index |
| Version(MarketVersionRef) | Carries Version. | 仅committedlocalfacts，不含旧index |
| Application(PublicationApplicationRef) | Carries Application. | 仅committedlocalfacts，不含旧index |
| Relation(DistributionRelationRef) | Carries Relation. | 仅committedlocalfacts，不含旧index |
| Impact(ImpactRecordRef) | Carries Impact. | 仅committedlocalfacts，不含旧index |
| Audit(MarketAuditRef) | Carries Audit. | 仅committedlocalfacts，不含旧index |

归属：contracts；仅committedlocalfacts，不含旧index

### ProjectionSafeView

```rust
/// Represents the finite ProjectionSafeView surface without owning upstream truth.
pub enum ProjectionSafeView {
    /// Carries Catalog with CatalogReadView.
    Catalog(CatalogReadView),
    /// Carries Progress with ApplicationProgressView.
    Progress(ApplicationProgressView),
    /// Carries Impact with ImpactNoticeView.
    Impact(ImpactNoticeView),
    /// Carries Audit with AuditRecoveryView.
    Audit(AuditRecoveryView),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Catalog(CatalogReadView) | Carries Catalog. | typedsafeview与plan kind/scope/keys一致，无domainentity/rawbody |
| Progress(ApplicationProgressView) | Carries Progress. | typedsafeview与plan kind/scope/keys一致，无domainentity/rawbody |
| Impact(ImpactNoticeView) | Carries Impact. | typedsafeview与plan kind/scope/keys一致，无domainentity/rawbody |
| Audit(AuditRecoveryView) | Carries Audit. | typedsafeview与plan kind/scope/keys一致，无domainentity/rawbody |

归属：contracts；typedsafeview与plan kind/scope/keys一致，无domainentity/rawbody

### QualifiedSnapshotMaterial

```rust
/// Represents the finite QualifiedSnapshotMaterial surface without owning upstream truth.
pub enum QualifiedSnapshotMaterial {
    /// Carries Source with SourceSafeSummary.
    Source(SourceSafeSummary),
    /// Carries Publisher with QualifiedPublisherInput.
    Publisher(QualifiedPublisherInput),
    /// Carries Material with QualifiedMaterialInput.
    Material(QualifiedMaterialInput),
    /// Carries Decision with QualifiedDecisionInput.
    Decision(QualifiedDecisionInput),
    /// Carries Receiver with QualifiedReceiverOutcome.
    Receiver(QualifiedReceiverOutcome),
    /// Carries Notice with QualifiedNoticeOutcome.
    Notice(QualifiedNoticeOutcome),
    /// Carries Observation with QualifiedObservationOutcome.
    Observation(QualifiedObservationOutcome),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Source(SourceSafeSummary) | Carries Source. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |
| Publisher(QualifiedPublisherInput) | Carries Publisher. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |
| Material(QualifiedMaterialInput) | Carries Material. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |
| Decision(QualifiedDecisionInput) | Carries Decision. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |
| Receiver(QualifiedReceiverOutcome) | Carries Receiver. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |
| Notice(QualifiedNoticeOutcome) | Carries Notice. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |
| Observation(QualifiedObservationOutcome) | Carries Observation. | finitebody-freeformalslice；Unavailable禁止披露旧safe_material |

归属：contracts；finitebody-freeformalslice；Unavailable禁止披露旧safe_material

### DistributionIntentSnapshot

```rust
/// Carries DistributionIntentSnapshot with explicit sources and no upstream body.
pub struct DistributionIntentSnapshot {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries state; see the source and invariant table.
    pub state: DistributionIntentState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 本地ID |
| version_ref | `MarketVersionRef` | 用户明确选择，不latest |
| consumer_ref | `DistributionConsumerRef` | 正式receiver/scope绑定 |
| receiver_ref | `DistributionReceiverRef` | 正式typed receiver，不猜类型→安装目标 |
| scope_ref | `MarketScopeRef` | 当前authority范围 |
| state | `DistributionIntentState` | Accepted/Cancelled |
| revision | `MarketRevision` | repo并发版本 |

归属：contracts；从typedlocalcommitted entity逐字段复制的安全结果快照；不可作为写入truth或currentgate。

### DistributionRelationSnapshot

```rust
/// Carries DistributionRelationSnapshot with explicit sources and no upstream body.
pub struct DistributionRelationSnapshot {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: DistributionRelationRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalReceiverOutcomeBinding,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `DistributionRelationRef` | 与intent同UoW分配 |
| intent_ref | `DistributionIntentRef` | 唯一意图关联 |
| version_ref | `MarketVersionRef` | 固定版本 |
| consumer_ref | `DistributionConsumerRef` | 正式消费关联 |
| outcome_binding | `OptionalReceiverOutcomeBinding` | 仅匹配正式结果回指 |

归属：contracts；从typedlocalcommitted entity逐字段复制的安全结果快照；不可作为写入truth或currentgate。

### DistributionAttemptSnapshot

```rust
/// Carries DistributionAttemptSnapshot with explicit sources and no upstream body.
pub struct DistributionAttemptSnapshot {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalReceiverOutcomeBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries state; see the source and invariant table.
    pub state: DistributionAttemptState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 本地ID |
| intent_ref | `DistributionIntentRef` | 原意图不变 |
| fence | `DispatchFence` | 本地claim/dispatch许可版本，非外部授权 |
| outcome_binding | `OptionalReceiverOutcomeBinding` | Confirmed必有matching结果 |
| failure_ref | `OptionalSafeFailureRef` | Failed/Blocked/Unknown安全来源 |
| state | `DistributionAttemptState` | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | `MarketRevision` | 原子保存/旧fence拒绝 |

归属：contracts；从typedlocalcommitted entity逐字段复制的安全结果快照；不可作为写入truth或currentgate。

### WithdrawalDispositionSnapshot

```rust
/// Carries WithdrawalDispositionSnapshot with explicit sources and no upstream body.
pub struct WithdrawalDispositionSnapshot {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
    /// Carries action; see the source and invariant table.
    pub action: MarketDispositionKind,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 本地ID |
| version_ref | `MarketVersionRef` | exact处置对象 |
| authority_ref | `DispositionAuthorityRef` | 正式处置依据/来源资格失效依据 |
| action | `MarketDispositionKind` | 仅Restrict/Withdraw本地有限意图 |
| reason_ref | `SafeReasonRef` | 安全原因，不原正文 |
| source_cursor | `MarketSourceCursor` | 同UoW提交序列用于影响增量 |

归属：contracts；从typedlocalcommitted entity逐字段复制的安全结果快照；不可作为写入truth或currentgate。

### SourceQualificationReadInput

```rust
/// Carries SourceQualificationReadInput with explicit sources and no upstream body.
pub struct SourceQualificationReadInput {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries safe_summary; see the source and invariant table.
    pub safe_summary: Option<SourceSafeSummary>,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | 已提交核验关联 |
| safe_summary | `Option<SourceSafeSummary>` | qualified owner摘要，无正文 |
| read_context | `SafeReadContext` | resolver当前裁剪 |
| status | `ReadSurfaceKind` | 按正式读取结果映射，不持久业务状态 |

归属：contracts；assemble只typed读取的safeview字段；currentdisclosure先通过，不在Query刷新，degraded用ReadSurface不假填qualified。

### ApplicationProgressReadInput

```rust
/// Carries ApplicationProgressReadInput with explicit sources and no upstream body.
pub struct ApplicationProgressReadInput {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 本地truth |
| review_ref | `OptionalReviewHandoffRef` | 独立交接进度 |
| decision_binding | `OptionalGovernanceDecisionBinding` | body-free可见决定依据 |
| status | `ReadSurfaceKind` | 只读missing/stale/degraded安全结果 |

归属：contracts；assemble只typed读取的safeview字段；currentdisclosure先通过，不在Query刷新，degraded用ReadSurface不假填qualified。

### CatalogReadInput

```rust
/// Carries CatalogReadInput with explicit sources and no upstream body.
pub struct CatalogReadInput {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries version_refs; see the source and invariant table.
    pub version_refs: MarketVersionRefSet,
    /// Carries safe_metadata; see the source and invariant table.
    pub safe_metadata: MarketCatalogSafeMetadata,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | committed local事实 |
| version_refs | `MarketVersionRefSet` | exact版本候选不可fallback |
| safe_metadata | `MarketCatalogSafeMetadata` | 本地允许metadata+owner safe摘要 |
| read_context | `SafeReadContext` | 当前可见交集 |
| status | `ReadSurfaceKind` | empty/missing/not-visible/stale/degraded/unsupported/failed安全面 |

归属：contracts；assemble只typed读取的safeview字段；currentdisclosure先通过，不在Query刷新，degraded用ReadSurface不假填qualified。


### DistributionReadInput

```rust
/// Carries DistributionReadInput with explicit sources and no upstream body.
pub struct DistributionReadInput {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: OptionalDistributionIntentRef,
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: OptionalDistributionRelationRef,
    /// Carries attempt_refs; see the source and invariant table.
    pub attempt_refs: DistributionAttemptRefSet,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `OptionalDistributionIntentRef` | 资格读面可无意图，不自动建 |
| relation_ref | `OptionalDistributionRelationRef` | 已知局部关系 |
| attempt_refs | `DistributionAttemptRefSet` | 已保存历史及unknown |
| read_context | `SafeReadContext` | 当前范围，不因旧成功泄漏 |
| status | `ReadSurfaceKind` | 结果安全姿态 |

归属：contracts；assemble只typed读取的safeview字段；currentdisclosure先通过，不在Query刷新，degraded用ReadSurface不假填qualified。

### ImpactNoticeReadInput

```rust
/// Carries ImpactNoticeReadInput with explicit sources and no upstream body.
pub struct ImpactNoticeReadInput {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries notice_refs; see the source and invariant table.
    pub notice_refs: NoticeIntentRefSet,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 已提交处置 |
| impact_ref | `ImpactRecordRef` | 已知集合/coverage |
| notice_refs | `NoticeIntentRefSet` | safe attempts/results |
| read_context | `SafeReadContext` | 同scope裁剪数量/细节 |

归属：contracts；assemble只typed读取的safeview字段；currentdisclosure先通过，不在Query刷新，degraded用ReadSurface不假填qualified。

### AuditRecoveryReadInput

```rust
/// Carries AuditRecoveryReadInput with explicit sources and no upstream body.
pub struct AuditRecoveryReadInput {
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

归属：contracts；assemble只typed读取的safeview字段；currentdisclosure先通过，不在Query刷新，degraded用ReadSurface不假填qualified。

### SourceQualificationResult

```rust
/// Carries SourceQualificationResult with explicit sources and no upstream body.
pub struct SourceQualificationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries state; see the source and invariant table.
    pub state: SourceVerificationState,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: Option<SourceBinding>,
    /// Carries material_refs; see the source and invariant table.
    pub material_refs: MaterialReferenceSet,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: OptionalQualificationOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| verification_ref | `SourceVerificationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `SourceVerificationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `Option<SourceBinding>` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| material_refs | `MaterialReferenceSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| outcome_ref | `OptionalQualificationOutcomeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### PublisherRelationResult

```rust
/// Carries PublisherRelationResult with explicit sources and no upstream body.
pub struct PublisherRelationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublisherRelationState,
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation_ref | `PublisherRelationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublisherRelationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| principal_ref | `PublisherPrincipalRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| authority_ref | `PublisherAuthorityRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| scope_ref | `MarketScopeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### PublicationApplicationResult

```rust
/// Carries PublicationApplicationResult with explicit sources and no upstream body.
pub struct PublicationApplicationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublicationApplicationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| draft_spec | `DraftPublicationSpec` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| basis_ref | `OptionalPublicationBasisRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| review_ref | `OptionalReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### ReviewProgressResult

```rust
/// Carries ReviewProgressResult with explicit sources and no upstream body.
pub struct ReviewProgressResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries state; see the source and invariant table.
    pub state: ReviewHandoffState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries dispatch_outcome_ref; see the source and invariant table.
    pub dispatch_outcome_ref: OptionalReviewDispatchOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| handoff_ref | `ReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `ReviewHandoffState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| failure_ref | `OptionalSafeFailureRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| dispatch_outcome_ref | `OptionalReviewDispatchOutcomeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### MarketplaceListingResult

```rust
/// Carries MarketplaceListingResult with explicit sources and no upstream body.
pub struct MarketplaceListingResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| metadata | `MarketListingMetadata` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| category_refs | `CategoryRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### CategoryResult

```rust
/// Carries CategoryResult with explicit sources and no upstream body.
pub struct CategoryResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| category_ref | `CategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| label | `MarketCategoryLabel` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| parent_ref | `OptionalCategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### MarketVersionResult

```rust
/// Carries MarketVersionResult with explicit sources and no upstream body.
pub struct MarketVersionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| version_ref | `MarketVersionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `SourceBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `MarketVersionState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### DistributionResult

```rust
/// Carries DistributionResult with explicit sources and no upstream body.
pub struct DistributionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries intent; see the source and invariant table.
    pub intent: DistributionIntentSnapshot,
    /// Carries relation; see the source and invariant table.
    pub relation: DistributionRelationSnapshot,
    /// Carries attempts; see the source and invariant table.
    pub attempts: Vec<DistributionAttemptSnapshot>,
    /// Carries impact_work_refs; see the source and invariant table.
    pub impact_work_refs: DeferredWorkRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| intent | `DistributionIntentSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation | `DistributionRelationSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| attempts | `Vec<DistributionAttemptSnapshot>` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| impact_work_refs | `DeferredWorkRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### WithdrawalResult

```rust
/// Carries WithdrawalResult with explicit sources and no upstream body.
pub struct WithdrawalResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries version; see the source and invariant table.
    pub version: MarketVersionResult,
    /// Carries disposition; see the source and invariant table.
    pub disposition: WithdrawalDispositionSnapshot,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries coverage_kind; see the source and invariant table.
    pub coverage_kind: ImpactCoverageKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| version | `MarketVersionResult` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| disposition | `WithdrawalDispositionSnapshot` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| impact_ref | `ImpactRecordRef` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| coverage_kind | `ImpactCoverageKind` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |

归属：contracts；version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除

### NoticePlanResult

```rust
/// Carries NoticePlanResult with explicit sources and no upstream body.
pub struct NoticePlanResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries notice_refs; see the source and invariant table.
    pub notice_refs: NoticeIntentRefSet,
    /// Carries duplicate_notice_refs; see the source and invariant table.
    pub duplicate_notice_refs: NoticeIntentRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| impact_ref | `ImpactRecordRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| notice_refs | `NoticeIntentRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| duplicate_notice_refs | `NoticeIntentRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### NoticeResult

```rust
/// Carries NoticeResult with explicit sources and no upstream body.
pub struct NoticeResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries state; see the source and invariant table.
    pub state: NoticeIntentState,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalNoticeOutcomeBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| notice_ref | `NoticeIntentRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `NoticeIntentState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| outcome_binding | `OptionalNoticeOutcomeBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| failure_ref | `OptionalSafeFailureRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### RecoveryResult

```rust
/// Carries RecoveryResult with explicit sources and no upstream body.
pub struct RecoveryResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: RecoveryIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries state; see the source and invariant table.
    pub state: RecoveryIntentState,
    /// Carries report_ref; see the source and invariant table.
    pub report_ref: OptionalStoredOperationResultRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| recovery_ref | `RecoveryIntentRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| target_ref | `MarketWorkTargetRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `RecoveryIntentState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| report_ref | `OptionalStoredOperationResultRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### CommandReceipt

```rust
/// Carries CommandReceipt with explicit sources and no upstream body.
pub struct CommandReceipt {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: StoredOperationResultRef,
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
    /// Carries work_refs; see the source and invariant table.
    pub work_refs: DeferredWorkRefSet,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed |
| result_ref | `StoredOperationResultRef` | accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed |
| audit_refs | `MarketAuditRefSet` | accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed |
| work_refs | `DeferredWorkRefSet` | accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed |
| basis_refs | `SafeBasisReferenceSet` | accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed |
| source_cursor | `MarketSourceCursor` | accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed |

归属：contracts；accepted完整原值；replay逐字段原值返还，不重建，不新增原结果replaybool，HTTPheader另表示replayed

### MarketError

```rust
/// Carries MarketError with explicit sources and no upstream body.
pub struct MarketError {
    /// Carries code; see the source and invariant table.
    pub code: ErrorCode,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: Option<SafeReasonRef>,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: Option<MarketOperationRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| code | `ErrorCode` | 失败不raw透传；preacceptreject不保存OperationCompleted或业务audit；已accepted unknown保存typedreport |
| reason_ref | `Option<SafeReasonRef>` | 失败不raw透传；preacceptreject不保存OperationCompleted或业务audit；已accepted unknown保存typedreport |
| operation_ref | `Option<MarketOperationRef>` | 失败不raw透传；preacceptreject不保存OperationCompleted或业务audit；已accepted unknown保存typedreport |

归属：contracts；失败不raw透传；preacceptreject不保存OperationCompleted或业务audit；已accepted unknown保存typedreport

### PageInfo

```rust
/// Carries PageInfo with explicit sources and no upstream body.
pub struct PageInfo {
    /// Carries next_token; see the source and invariant table.
    pub next_token: Option<core_contracts::metadata::PageToken>,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
    /// Carries visible_count; see the source and invariant table.
    pub visible_count: Option<u64>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| next_token | `Option<core_contracts::metadata::PageToken>` | nexttoken由scope/filter/fixedcursor/order键绑定opaque签名cursor；count只同scope完整可见，缺失None而不是hidden total |
| source_cursor | `MarketSourceCursor` | nexttoken由scope/filter/fixedcursor/order键绑定opaque签名cursor；count只同scope完整可见，缺失None而不是hidden total |
| visible_count | `Option<u64>` | nexttoken由scope/filter/fixedcursor/order键绑定opaque签名cursor；count只同scope完整可见，缺失None而不是hidden total |

归属：contracts；nexttoken由scope/filter/fixedcursor/order键绑定opaque签名cursor；count只同scope完整可见，缺失None而不是hidden total

### Page<T>

```rust
/// Carries Page<T> with explicit sources and no upstream body.
pub struct Page<T> {
    /// Carries items; see the source and invariant table.
    pub items: Vec<T>,
    /// Carries info; see the source and invariant table.
    pub info: PageInfo,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| items | `Vec<T>` | 只可见typed项；limit唯一CoreQueryMetadata.page，token错scope/filter拒绝 |
| info | `PageInfo` | 只可见typed项；limit唯一CoreQueryMetadata.page，token错scope/filter拒绝 |

归属：contracts；只可见typed项；limit唯一CoreQueryMetadata.page，token错scope/filter拒绝

### ReadMarker

```rust
/// Carries ReadMarker with explicit sources and no upstream body.
pub struct ReadMarker {
    /// Carries surface; see the source and invariant table.
    pub surface: ReadSurfaceKind,
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: Option<MarketProjectionRef>,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: Option<MarketSourceCursor>,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: Option<SafeFailureRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| surface | `ReadSurfaceKind` | Ready/Empty需合格source，Stale等明确姿态，无currentvisibility不披露marker/ref数量 |
| projection_ref | `Option<MarketProjectionRef>` | Ready/Empty需合格source，Stale等明确姿态，无currentvisibility不披露marker/ref数量 |
| source_cursor | `Option<MarketSourceCursor>` | Ready/Empty需合格source，Stale等明确姿态，无currentvisibility不披露marker/ref数量 |
| failure_ref | `Option<SafeFailureRef>` | Ready/Empty需合格source，Stale等明确姿态，无currentvisibility不披露marker/ref数量 |

归属：contracts；Ready/Empty需合格source，Stale等明确姿态，无currentvisibility不披露marker/ref数量


### ReadSurface<T>

```rust
/// Represents the finite ReadSurface<T> surface without owning upstream truth.
pub enum ReadSurface<T> {
    /// Carries Ready with QualifiedPage<T>.
    Ready(QualifiedPage<T>),
    /// Carries Empty with ReadMarker.
    Empty(ReadMarker),
    /// Does not reveal existence or hidden counts.
    NotVisible,
    /// Reports absence only when current disclosure allows it.
    Missing,
    /// Carries Degraded with ReadDegradation.
    Degraded(ReadDegradation),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Ready(QualifiedPage<T>) | Carries Ready. | Ready非empty，Empty有正式可见读源；degraded载体的marker不能Ready/Empty |
| Empty(ReadMarker) | Carries Empty. | Ready非empty，Empty有正式可见读源；degraded载体的marker不能Ready/Empty |
| NotVisible | Does not reveal existence or hidden counts. | Ready非empty，Empty有正式可见读源；degraded载体的marker不能Ready/Empty |
| Missing | Reports absence only when current disclosure allows it. | Ready非empty，Empty有正式可见读源；degraded载体的marker不能Ready/Empty |
| Degraded(ReadDegradation) | Carries Degraded. | Ready非empty，Empty有正式可见读源；degraded载体的marker不能Ready/Empty |

归属：contracts；Ready非empty，Empty有正式可见读源；degraded载体的marker不能Ready/Empty

### QualifiedPage<T>

```rust
/// Carries QualifiedPage<T> with explicit sources and no upstream body.
pub struct QualifiedPage<T> {
    /// Carries page; see the source and invariant table.
    pub page: Page<T>,
    /// Carries marker; see the source and invariant table.
    pub marker: ReadMarker,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| page | `Page<T>` | 纯contractsview+page；Ready允许exactdetail 1项，列表非空；Empty独立variant |
| marker | `ReadMarker` | 纯contractsview+page；Ready允许exactdetail 1项，列表非空；Empty独立variant |

归属：contracts；纯contractsview+page；Ready允许exactdetail 1项，列表非空；Empty独立variant

### ReadDegradation

```rust
/// Carries ReadDegradation with explicit sources and no upstream body.
pub struct ReadDegradation {
    /// Carries marker; see the source and invariant table.
    pub marker: ReadMarker,
    /// Carries safe_reason; see the source and invariant table.
    pub safe_reason: Option<SafeReasonRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| marker | `ReadMarker` | stale/rebuilding/unavailable/unsupported/failed/disabled姿态，无可见性不返回来源refs |
| safe_reason | `Option<SafeReasonRef>` | stale/rebuilding/unavailable/unsupported/failed/disabled姿态，无可见性不返回来源refs |

归属：contracts；stale/rebuilding/unavailable/unsupported/failed/disabled姿态，无可见性不返回来源refs

### JobItemResult

```rust
/// Carries JobItemResult with explicit sources and no upstream body.
pub struct JobItemResult {
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries outcome; see the source and invariant table.
    pub outcome: JobItemOutcome,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries effect_intent; see the source and invariant table.
    pub effect_intent: MarketEffectIntentRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: Option<MarketSourceCursor>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target_ref | `MarketWorkTargetRef` | 每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发 |
| outcome | `JobItemOutcome` | 每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发 |
| basis_refs | `SafeBasisReferenceSet` | 每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发 |
| failure_ref | `OptionalSafeFailureRef` | 每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发 |
| effect_intent | `MarketEffectIntentRef` | 每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发 |
| source_cursor | `Option<MarketSourceCursor>` | 每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发 |

归属：contracts；每item完整safe报告；Confirmed/NotCommitted formalbasis，Unknown failure，SkippedNoOp不外发

### JobItemOutcome

```rust
/// Represents the finite JobItemOutcome surface without owning upstream truth.
pub enum JobItemOutcome {
    /// Confirmed is a local classification.
    Confirmed,
    /// KnownNotCommitted is a local classification.
    KnownNotCommitted,
    /// CommitUnknown is a local classification.
    CommitUnknown,
    /// Blocked is a local classification.
    Blocked,
    /// CompletedLocal is a local classification.
    CompletedLocal,
    /// SkippedNoOp is a local classification.
    SkippedNoOp,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Confirmed | Confirmed is a local classification. | 有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness |
| KnownNotCommitted | KnownNotCommitted is a local classification. | 有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness |
| CommitUnknown | CommitUnknown is a local classification. | 有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness |
| Blocked | Blocked is a local classification. | 有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness |
| CompletedLocal | CompletedLocal is a local classification. | 有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness |
| SkippedNoOp | SkippedNoOp is a local classification. | 有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness |

归属：contracts；有限结果分类不持久独立lifecycle；Confirmed非approval/delivery/readiness

### MarketJobReport

```rust
/// Carries MarketJobReport with explicit sources and no upstream body.
pub struct MarketJobReport {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: StoredOperationResultRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries items; see the source and invariant table.
    pub items: Vec<JobItemResult>,
    /// Carries next_cursor; see the source and invariant table.
    pub next_cursor: Option<MarketSourceCursor>,
    /// Carries work_state; see the source and invariant table.
    pub work_state: DeferredWorkState,
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
    /// Carries spawned_work_refs; see the source and invariant table.
    pub spawned_work_refs: DeferredWorkRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| result_ref | `StoredOperationResultRef` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| work_ref | `DeferredWorkRef` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| fence | `DispatchFence` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| items | `Vec<JobItemResult>` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| next_cursor | `Option<MarketSourceCursor>` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| work_state | `DeferredWorkState` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| audit_refs | `MarketAuditRefSet` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |
| spawned_work_refs | `DeferredWorkRefSet` | 每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled |

归属：contracts；每Job同完整schema，family typed aliases明确；原报告full stored，每item结果和必要work同UoW，unknown不settled

### MarketResultSurface

```rust
/// Represents the finite MarketResultSurface surface without owning upstream truth.
pub enum MarketResultSurface {
    /// Carries Publisher with PublisherRelationResult.
    Publisher(PublisherRelationResult),
    /// Carries Source with SourceQualificationResult.
    Source(SourceQualificationResult),
    /// Carries Application with PublicationApplicationResult.
    Application(PublicationApplicationResult),
    /// Carries Review with ReviewProgressResult.
    Review(ReviewProgressResult),
    /// Carries Listing with MarketplaceListingResult.
    Listing(MarketplaceListingResult),
    /// Carries Category with CategoryResult.
    Category(CategoryResult),
    /// Carries Version with MarketVersionResult.
    Version(MarketVersionResult),
    /// Carries Distribution with DistributionResult.
    Distribution(DistributionResult),
    /// Carries Withdrawal with WithdrawalResult.
    Withdrawal(WithdrawalResult),
    /// Carries NoticePlan with NoticePlanResult.
    NoticePlan(NoticePlanResult),
    /// Carries Notice with NoticeResult.
    Notice(NoticeResult),
    /// Carries Recovery with RecoveryResult.
    Recovery(RecoveryResult),
    /// Carries Job with MarketJobReport.
    Job(MarketJobReport),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Publisher(PublisherRelationResult) | Carries Publisher. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Source(SourceQualificationResult) | Carries Source. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Application(PublicationApplicationResult) | Carries Application. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Review(ReviewProgressResult) | Carries Review. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Listing(MarketplaceListingResult) | Carries Listing. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Category(CategoryResult) | Carries Category. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Version(MarketVersionResult) | Carries Version. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Distribution(DistributionResult) | Carries Distribution. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Withdrawal(WithdrawalResult) | Carries Withdrawal. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| NoticePlan(NoticePlanResult) | Carries NoticePlan. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Notice(NoticeResult) | Carries Notice. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Recovery(RecoveryResult) | Carries Recovery. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |
| Job(MarketJobReport) | Carries Job. | 完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致 |

归属：contracts；完整原typedresult，不用id/bool/projection替代；kind/operation/schema/resultref必须与payload一致

### MarketResultKind

```rust
/// Represents the finite MarketResultKind surface without owning upstream truth.
pub enum MarketResultKind {
    /// Publisher is a local classification.
    Publisher,
    /// Source is a local classification.
    Source,
    /// Application is a local classification.
    Application,
    /// Review is a local classification.
    Review,
    /// Listing is a local classification.
    Listing,
    /// Category is a local classification.
    Category,
    /// Version is a local classification.
    Version,
    /// Distribution is a local classification.
    Distribution,
    /// Withdrawal is a local classification.
    Withdrawal,
    /// NoticePlan is a local classification.
    NoticePlan,
    /// Notice is a local classification.
    Notice,
    /// Recovery is a local classification.
    Recovery,
    /// Job is a local classification.
    Job,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Publisher | Publisher is a local classification. | 有限分类，不自动授权。 |
| Source | Source is a local classification. | 有限分类，不自动授权。 |
| Application | Application is a local classification. | 有限分类，不自动授权。 |
| Review | Review is a local classification. | 有限分类，不自动授权。 |
| Listing | Listing is a local classification. | 有限分类，不自动授权。 |
| Category | Category is a local classification. | 有限分类，不自动授权。 |
| Version | Version is a local classification. | 有限分类，不自动授权。 |
| Distribution | Distribution is a local classification. | 有限分类，不自动授权。 |
| Withdrawal | Withdrawal is a local classification. | 有限分类，不自动授权。 |
| NoticePlan | NoticePlan is a local classification. | 有限分类，不自动授权。 |
| Notice | Notice is a local classification. | 有限分类，不自动授权。 |
| Recovery | Recovery is a local classification. | 有限分类，不自动授权。 |
| Job | Job is a local classification. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。


### MarketOperationKind

```rust
/// Represents the finite MarketOperationKind surface without owning upstream truth.
pub enum MarketOperationKind {
    /// BindPublisherRelation is a local classification.
    BindPublisherRelation,
    /// ReleasePublisherRelation is a local classification.
    ReleasePublisherRelation,
    /// VerifyPublicationSource is a local classification.
    VerifyPublicationSource,
    /// CreatePublicationDraft is a local classification.
    CreatePublicationDraft,
    /// RevisePublicationDraft is a local classification.
    RevisePublicationDraft,
    /// SubmitPublicationApplication is a local classification.
    SubmitPublicationApplication,
    /// TerminatePublicationApplication is a local classification.
    TerminatePublicationApplication,
    /// RecordGovernanceDecision is a local classification.
    RecordGovernanceDecision,
    /// DispatchReviewHandoff is a local classification.
    DispatchReviewHandoff,
    /// ReconcileReviewHandoff is a local classification.
    ReconcileReviewHandoff,
    /// CreateMarketplaceListing is a local classification.
    CreateMarketplaceListing,
    /// EditMarketplaceListing is a local classification.
    EditMarketplaceListing,
    /// MaintainMarketCategory is a local classification.
    MaintainMarketCategory,
    /// RegisterMarketVersion is a local classification.
    RegisterMarketVersion,
    /// ListMarketVersion is a local classification.
    ListMarketVersion,
    /// RequestDistribution is a local classification.
    RequestDistribution,
    /// CancelDistribution is a local classification.
    CancelDistribution,
    /// RecordReceiverOutcome is a local classification.
    RecordReceiverOutcome,
    /// DispatchDistribution is a local classification.
    DispatchDistribution,
    /// ReconcileDistribution is a local classification.
    ReconcileDistribution,
    /// RestrictMarketVersion is a local classification.
    RestrictMarketVersion,
    /// WithdrawMarketVersion is a local classification.
    WithdrawMarketVersion,
    /// PlanImpactNotifications is a local classification.
    PlanImpactNotifications,
    /// RecordNoticeOutcome is a local classification.
    RecordNoticeOutcome,
    /// EnumerateKnownImpact is a local classification.
    EnumerateKnownImpact,
    /// DispatchNotice is a local classification.
    DispatchNotice,
    /// ReconcileNotice is a local classification.
    ReconcileNotice,
    /// RequestMarketRecovery is a local classification.
    RequestMarketRecovery,
    /// RunMarketRecovery is a local classification.
    RunMarketRecovery,
    /// DispatchObservation is a local classification.
    DispatchObservation,
    /// ReconcileObservation is a local classification.
    ReconcileObservation,
    /// RefreshQualifiedReferences is a local classification.
    RefreshQualifiedReferences,
    /// RebuildMarketReadProjection is a local classification.
    RebuildMarketReadProjection,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| BindPublisherRelation | BindPublisherRelation is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| ReleasePublisherRelation | ReleasePublisherRelation is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| VerifyPublicationSource | VerifyPublicationSource is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| CreatePublicationDraft | CreatePublicationDraft is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RevisePublicationDraft | RevisePublicationDraft is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| SubmitPublicationApplication | SubmitPublicationApplication is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| TerminatePublicationApplication | TerminatePublicationApplication is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RecordGovernanceDecision | RecordGovernanceDecision is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| DispatchReviewHandoff | DispatchReviewHandoff is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| ReconcileReviewHandoff | ReconcileReviewHandoff is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| CreateMarketplaceListing | CreateMarketplaceListing is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| EditMarketplaceListing | EditMarketplaceListing is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| MaintainMarketCategory | MaintainMarketCategory is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RegisterMarketVersion | RegisterMarketVersion is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| ListMarketVersion | ListMarketVersion is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RequestDistribution | RequestDistribution is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| CancelDistribution | CancelDistribution is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RecordReceiverOutcome | RecordReceiverOutcome is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| DispatchDistribution | DispatchDistribution is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| ReconcileDistribution | ReconcileDistribution is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RestrictMarketVersion | RestrictMarketVersion is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| WithdrawMarketVersion | WithdrawMarketVersion is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| PlanImpactNotifications | PlanImpactNotifications is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RecordNoticeOutcome | RecordNoticeOutcome is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| EnumerateKnownImpact | EnumerateKnownImpact is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| DispatchNotice | DispatchNotice is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| ReconcileNotice | ReconcileNotice is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RequestMarketRecovery | RequestMarketRecovery is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RunMarketRecovery | RunMarketRecovery is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| DispatchObservation | DispatchObservation is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| ReconcileObservation | ReconcileObservation is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RefreshQualifiedReferences | RefreshQualifiedReferences is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |
| RebuildMarketReadProjection | RebuildMarketReadProjection is a local classification. | 21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支 |

归属：contracts；21Commands+12Jobs selector唯一DTOtag/typedjob variant；不是从route/ref/config猜分支

### QualificationOutcomeRef

```rust
/// Carries QualificationOutcomeRef with explicit sources and no upstream body.
pub struct QualificationOutcomeRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | 本地安全qualification结果/正式reviewdispatch材料的typedtransport；正式basis未存在不得伪造；local缺口record必须实际persist同UoW |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### ReviewDispatchOutcomeRef

```rust
/// Carries ReviewDispatchOutcomeRef with explicit sources and no upstream body.
pub struct ReviewDispatchOutcomeRef {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | 本地安全qualification结果/正式reviewdispatch材料的typedtransport；正式basis未存在不得伪造；local缺口record必须实际persist同UoW |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。

### SourceBindingRow

```rust
/// Carries SourceBindingRow with explicit sources and no upstream body.
pub struct SourceBindingRow {
    /// Carries owner_ref; see the source and invariant table.
    pub owner_ref: TypedOwnerReference,
    /// Carries owner_version; see the source and invariant table.
    pub owner_version: OwnerVersionRef,
    /// Carries asset_digest; see the source and invariant table.
    pub asset_digest: OwnerAssetDigest,
    /// Carries visibility_ref; see the source and invariant table.
    pub visibility_ref: OwnerVisibilityRef,
    /// Carries eligibility_ref; see the source and invariant table.
    pub eligibility_ref: OwnerEligibilityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_ref | `TypedOwnerReference` | 正式resolver输出，不解析字符串 |
| owner_version | `OwnerVersionRef` | owner提供不可变版本 |
| asset_digest | `OwnerAssetDigest` | owner提供摘要，不本地重算 |
| visibility_ref | `OwnerVisibilityRef` | owner正式可见依据 |
| eligibility_ref | `OwnerEligibilityRef` | owner消费资格依据 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### MaterialReferenceRow

```rust
/// Carries MaterialReferenceRow with explicit sources and no upstream body.
pub struct MaterialReferenceRow {
    /// Carries material_ref; see the source and invariant table.
    pub material_ref: OwnerMaterialRef,
    /// Carries binding; see the source and invariant table.
    pub binding: SourceBinding,
    /// Carries kind_ref; see the source and invariant table.
    pub kind_ref: MaterialKindRef,
    /// Carries applicability_ref; see the source and invariant table.
    pub applicability_ref: MaterialApplicabilityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| material_ref | `OwnerMaterialRef` | Artifact/正式材料authority输出 |
| binding | `SourceBinding` | 被核验exact来源 |
| kind_ref | `MaterialKindRef` | authority正式kind，不本地发明scan enum |
| applicability_ref | `MaterialApplicabilityRef` | 适用/有效性依据 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### PublisherRelationRow

```rust
/// Carries PublisherRelationRow with explicit sources and no upstream body.
pub struct PublisherRelationRow {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries state; see the source and invariant table.
    pub state: PublisherRelationState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `PublisherRelationRef` | 本地ID port分配 |
| principal_ref | `PublisherPrincipalRef` | 正式人类/组织authority提供，非AI ID默认映射 |
| authority_ref | `PublisherAuthorityRef` | 当前scope与授权来源 |
| scope_ref | `MarketScopeRef` | 正式resolver范围 |
| state | `PublisherRelationState` | 本地Bound/Released；不外部Verified |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### SourceVerificationRow

```rust
/// Carries SourceVerificationRow with explicit sources and no upstream body.
pub struct SourceVerificationRow {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries source_candidate; see the source and invariant table.
    pub source_candidate: SourceVerificationTarget,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: OptionalSourceBinding,
    /// Carries material_refs; see the source and invariant table.
    pub material_refs: MaterialReferenceSet,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: OptionalQualificationOutcomeRef,
    /// Carries state; see the source and invariant table.
    pub state: SourceVerificationState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | 本地ID生成 |
| source_candidate | `SourceVerificationTarget` | 来自请求的typed安全owner/type/opaque候选/版本/scope；未qualified时可回指所核验对象，绝不是canonicalref自造 |
| publisher_ref | `PublisherRelationRef` | Verify请求关联+typedpublisher当前authority，保存后Release可按正式localtyped关联失效；不只同scope猜关联 |
| source_binding | `OptionalSourceBinding` | 仅正式来源组合已核验时存在；Blocked缺源允许缺失但禁止提交 |
| material_refs | `MaterialReferenceSet` | 只适用body-free组合 |
| outcome_ref | `OptionalQualificationOutcomeRef` | Pending可无；Qualified/Blocked/Invalidated必须安全结果/缺口依据 |
| state | `SourceVerificationState` | Pending/Qualified/Blocked/Invalidated |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### SourceGatePolicyRow

```rust
/// Carries SourceGatePolicyRow with explicit sources and no upstream body.
pub struct SourceGatePolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: QualifiedSourceRuleInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `QualifiedSourceRuleInput` | application传入适用规则，禁止配置豁免 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### SourceQualificationViewRow

```rust
/// Carries SourceQualificationViewRow with explicit sources and no upstream body.
pub struct SourceQualificationViewRow {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries safe_summary; see the source and invariant table.
    pub safe_summary: Option<SourceSafeSummary>,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | 已提交核验关联 |
| safe_summary | `Option<SourceSafeSummary>` | qualified owner摘要，无正文 |
| read_context | `SafeReadContext` | resolver当前裁剪 |
| status | `ReadSurfaceKind` | 按正式读取结果映射，不持久业务状态 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省


### PublicationBasisRow

```rust
/// Carries PublicationBasisRow with explicit sources and no upstream body.
pub struct PublicationBasisRow {
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries materials; see the source and invariant table.
    pub materials: MaterialReferenceSet,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| basis_ref | `PublicationBasisRef` | 本地ID |
| source | `SourceBinding` | U1固定来源 |
| publisher_ref | `PublisherRelationRef` | 已核验责任关联 |
| materials | `MaterialReferenceSet` | 审核适用材料固定集 |
| scope_ref | `MarketScopeRef` | 正式范围 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### PublicationApplicationRow

```rust
/// Carries PublicationApplicationRow with explicit sources and no upstream body.
pub struct PublicationApplicationRow {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 本地ID |
| draft_spec | `DraftPublicationSpec` | typed安全来源/责任/材料候选与scope由Draft输入持久化；Submitted不再改，非qualifiedbasis |
| basis_ref | `OptionalPublicationBasisRef` | Draft可无；Submitted必须typed固定PublicationBasis |
| review_ref | `OptionalReviewHandoffRef` | Draft可无；submit同UoW生成独立review责任 |
| state | `PublicationApplicationState` | Draft/Submitted/Terminated |
| revision | `MarketRevision` | repo返回用于optimistic save |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ReviewHandoffRow

```rust
/// Carries ReviewHandoffRow with explicit sources and no upstream body.
pub struct ReviewHandoffRow {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries dispatch_outcome_ref; see the source and invariant table.
    pub dispatch_outcome_ref: OptionalReviewDispatchOutcomeRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries state; see the source and invariant table.
    pub state: ReviewHandoffState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | 提交时原子生成 |
| application_ref | `PublicationApplicationRef` | 原申请固定关联 |
| basis_ref | `PublicationBasisRef` | 原审查对象 |
| dispatch_outcome_ref | `OptionalReviewDispatchOutcomeRef` | WaitingDecision/Unknown/Failed保存原意图交接结果或安全unknown来源 |
| failure_ref | `OptionalSafeFailureRef` | ContractBlocked/Failed/Unknown具安全缺口/失败依据 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 仅正式matched决定存在时 |
| state | `ReviewHandoffState` | 局部进度而非Approved |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### GovernanceDecisionBindingRow

```rust
/// Carries GovernanceDecisionBindingRow with explicit sources and no upstream body.
pub struct GovernanceDecisionBindingRow {
    /// Carries decision_ref; see the source and invariant table.
    pub decision_ref: GovernanceDecisionRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: PublicationBasisRef,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: GovernanceOutcomeRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: DecisionValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| decision_ref | `GovernanceDecisionRef` | Gov正式来源 |
| application_ref | `PublicationApplicationRef` | 指定申请，不泛化 |
| basis_ref | `PublicationBasisRef` | 来源/材料/scope完整绑定 |
| outcome_ref | `GovernanceOutcomeRef` | 正式approved/rejected等结果ref，非本地enum |
| validity_ref | `DecisionValidityRef` | 有效期/替代/撤销正式依据 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ReviewBindingPolicyRow

```rust
/// Carries ReviewBindingPolicyRow with explicit sources and no upstream body.
pub struct ReviewBindingPolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: ReviewBindingRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `ReviewBindingRequirements` | 正式审查适用需求 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ApplicationProgressViewRow

```rust
/// Carries ApplicationProgressViewRow with explicit sources and no upstream body.
pub struct ApplicationProgressViewRow {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 本地truth |
| review_ref | `OptionalReviewHandoffRef` | 独立交接进度 |
| decision_binding | `OptionalGovernanceDecisionBinding` | body-free可见决定依据 |
| status | `ReadSurfaceKind` | 只读missing/stale/degraded安全结果 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### MarketplaceListingRow

```rust
/// Carries MarketplaceListingRow with explicit sources and no upstream body.
pub struct MarketplaceListingRow {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries metadata; see the source and invariant table.
    pub metadata: MarketListingMetadata,
    /// Carries category_refs; see the source and invariant table.
    pub category_refs: CategoryRefSet,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | 本地ID |
| publisher_ref | `PublisherRelationRef` | U1责任关联 |
| metadata | `MarketListingMetadata` | 用户允许市场描述/标签，拒绝body |
| category_refs | `CategoryRefSet` | U3分类关联 |
| revision | `MarketRevision` | repo返回并发版本 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### MarketVersionRow

```rust
/// Carries MarketVersionRow with explicit sources and no upstream body.
pub struct MarketVersionRow {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 本地ID，不是owner version |
| listing_ref | `MarketplaceListingRef` | 目录关联 |
| source_binding | `SourceBinding` | 一经登记不可换owner版本 |
| application_ref | `PublicationApplicationRef` | 对应固定审查对象 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 上架必须正式有效approved |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 限制/撤回依据 |
| state | `MarketVersionState` | Staged/Listed/Restricted/Withdrawn |
| revision | `MarketRevision` | 单版本序列化并发依据 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### CategoryRow

```rust
/// Carries CategoryRow with explicit sources and no upstream body.
pub struct CategoryRow {
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| category_ref | `CategoryRef` | 本地ID |
| label | `MarketCategoryLabel` | 市场标签，不上游资产enum |
| parent_ref | `OptionalCategoryRef` | typed父关联 |
| scope_ref | `MarketScopeRef` | 本地Category.scope_ref完整typedstore列 |
| revision | `MarketRevision` | 变更并发保护 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### VersionAdmissionPolicyRow

```rust
/// Carries VersionAdmissionPolicyRow with explicit sources and no upstream body.
pub struct VersionAdmissionPolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: VersionAdmissionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `VersionAdmissionRequirements` | 批准binding与正式来源需求 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### CatalogReadViewRow

```rust
/// Carries CatalogReadViewRow with explicit sources and no upstream body.
pub struct CatalogReadViewRow {
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries version_refs; see the source and invariant table.
    pub version_refs: MarketVersionRefSet,
    /// Carries safe_metadata; see the source and invariant table.
    pub safe_metadata: MarketCatalogSafeMetadata,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| listing_ref | `MarketplaceListingRef` | committed local事实 |
| version_refs | `MarketVersionRefSet` | exact版本候选不可fallback |
| safe_metadata | `MarketCatalogSafeMetadata` | 本地允许metadata+owner safe摘要 |
| read_context | `SafeReadContext` | 当前可见交集 |
| status | `ReadSurfaceKind` | empty/missing/not-visible/stale/degraded/unsupported/failed安全面 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省


### DistributionIntentRow

```rust
/// Carries DistributionIntentRow with explicit sources and no upstream body.
pub struct DistributionIntentRow {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries state; see the source and invariant table.
    pub state: DistributionIntentState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 本地ID |
| version_ref | `MarketVersionRef` | 用户明确选择，不latest |
| consumer_ref | `DistributionConsumerRef` | 正式receiver/scope绑定 |
| receiver_ref | `DistributionReceiverRef` | 正式typed receiver，不猜类型→安装目标 |
| scope_ref | `MarketScopeRef` | 当前authority范围 |
| state | `DistributionIntentState` | Accepted/Cancelled |
| revision | `MarketRevision` | repo并发版本 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### DistributionRelationRow

```rust
/// Carries DistributionRelationRow with explicit sources and no upstream body.
pub struct DistributionRelationRow {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: DistributionRelationRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalReceiverOutcomeBinding,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `DistributionRelationRef` | 与intent同UoW分配 |
| intent_ref | `DistributionIntentRef` | 唯一意图关联 |
| version_ref | `MarketVersionRef` | 固定版本 |
| consumer_ref | `DistributionConsumerRef` | 正式消费关联 |
| outcome_binding | `OptionalReceiverOutcomeBinding` | 仅匹配正式结果回指 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### DistributionAttemptRow

```rust
/// Carries DistributionAttemptRow with explicit sources and no upstream body.
pub struct DistributionAttemptRow {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalReceiverOutcomeBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries state; see the source and invariant table.
    pub state: DistributionAttemptState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 本地ID |
| intent_ref | `DistributionIntentRef` | 原意图不变 |
| fence | `DispatchFence` | 本地claim/dispatch许可版本，非外部授权 |
| outcome_binding | `OptionalReceiverOutcomeBinding` | Confirmed必有matching结果 |
| failure_ref | `OptionalSafeFailureRef` | Failed/Blocked/Unknown安全来源 |
| state | `DistributionAttemptState` | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | `MarketRevision` | 原子保存/旧fence拒绝 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ReceiverOutcomeBindingRow

```rust
/// Carries ReceiverOutcomeBindingRow with explicit sources and no upstream body.
pub struct ReceiverOutcomeBindingRow {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: ReceiverOutcomeRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `ReceiverOutcomeRef` | receiver正式结果 |
| intent_ref | `DistributionIntentRef` | 原外部幂等意图 |
| version_ref | `MarketVersionRef` | 与sourcebinding匹配 |
| consumer_ref | `DistributionConsumerRef` | 指定consumer |
| receiver_ref | `DistributionReceiverRef` | 来源owner匹配 |
| scope_ref | `MarketScopeRef` | 正式结果范围 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### AcquisitionGatePolicyRow

```rust
/// Carries AcquisitionGatePolicyRow with explicit sources and no upstream body.
pub struct AcquisitionGatePolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: AcquisitionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `AcquisitionRequirements` | 正式source/auth/Gov/receiver与market未撤回要求 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### DistributionReadViewRow

```rust
/// Carries DistributionReadViewRow with explicit sources and no upstream body.
pub struct DistributionReadViewRow {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: OptionalDistributionIntentRef,
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: OptionalDistributionRelationRef,
    /// Carries attempt_refs; see the source and invariant table.
    pub attempt_refs: DistributionAttemptRefSet,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `OptionalDistributionIntentRef` | 资格读面可无意图，不自动建 |
| relation_ref | `OptionalDistributionRelationRef` | 已知局部关系 |
| attempt_refs | `DistributionAttemptRefSet` | 已保存历史及unknown |
| read_context | `SafeReadContext` | 当前范围，不因旧成功泄漏 |
| status | `ReadSurfaceKind` | 结果安全姿态 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### WithdrawalDispositionRow

```rust
/// Carries WithdrawalDispositionRow with explicit sources and no upstream body.
pub struct WithdrawalDispositionRow {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: DispositionAuthorityRef,
    /// Carries action; see the source and invariant table.
    pub action: MarketDispositionKind,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 本地ID |
| version_ref | `MarketVersionRef` | exact处置对象 |
| authority_ref | `DispositionAuthorityRef` | 正式处置依据/来源资格失效依据 |
| action | `MarketDispositionKind` | 仅Restrict/Withdraw本地有限意图 |
| reason_ref | `SafeReasonRef` | 安全原因，不原正文 |
| source_cursor | `MarketSourceCursor` | 同UoW提交序列用于影响增量 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ImpactRecordRow

```rust
/// Carries ImpactRecordRow with explicit sources and no upstream body.
pub struct ImpactRecordRow {
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries relation_refs; see the source and invariant table.
    pub relation_refs: DistributionRelationRefSet,
    /// Carries unknown_attempt_refs; see the source and invariant table.
    pub unknown_attempt_refs: DistributionAttemptRefSet,
    /// Carries coverage_cursor; see the source and invariant table.
    pub coverage_cursor: MarketSourceCursor,
    /// Carries coverage_kind; see the source and invariant table.
    pub coverage_kind: ImpactCoverageKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| impact_ref | `ImpactRecordRef` | 本地ID |
| disposition_ref | `WithdrawalDispositionRef` | 原处置关联 |
| relation_refs | `DistributionRelationRefSet` | 本地已知exact版本关系 |
| unknown_attempt_refs | `DistributionAttemptRefSet` | 保守未知交接集合 |
| coverage_cursor | `MarketSourceCursor` | 稳定枚举及late增量来源 |
| coverage_kind | `ImpactCoverageKind` | Partial/KnownScopeComplete不代表全安装 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### NoticeIntentRow

```rust
/// Carries NoticeIntentRow with explicit sources and no upstream body.
pub struct NoticeIntentRow {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries dispatch_fence; see the source and invariant table.
    pub dispatch_fence: OptionalDispatchFence,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalNoticeOutcomeBinding,
    /// Carries state; see the source and invariant table.
    pub state: NoticeIntentState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 本地ID |
| impact_ref | `ImpactRecordRef` | 影响对象 |
| target_ref | `NoticeTargetRef` | 正式可通知目标，非全安装用户 |
| channel_ref | `NoticeChannelRef` | 正式通道，缺合同不派发 |
| scope_ref | `MarketScopeRef` | typedstored NoticeIntent.scope_ref完整读取 |
| failure_ref | `OptionalSafeFailureRef` | Blocked/Failed/Unknown的安全来源 |
| dispatch_fence | `OptionalDispatchFence` | Dispatching必有原intent当前许可；旧fence结果不得覆盖 |
| outcome_binding | `OptionalNoticeOutcomeBinding` | 正式结果可选，ACK不是delivered |
| state | `NoticeIntentState` | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | `MarketRevision` | claim及结果旧fence保护 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省


### NoticeOutcomeBindingRow

```rust
/// Carries NoticeOutcomeBindingRow with explicit sources and no upstream body.
pub struct NoticeOutcomeBindingRow {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: NoticeOutcomeRef,
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `NoticeOutcomeRef` | channel正式结果 |
| notice_ref | `NoticeIntentRef` | 原意图关联 |
| target_ref | `NoticeTargetRef` | 指定通知目标 |
| channel_ref | `NoticeChannelRef` | 结果来源 |
| scope_ref | `MarketScopeRef` | 安全披露范围 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### WithdrawalImpactPolicyRow

```rust
/// Carries WithdrawalImpactPolicyRow with explicit sources and no upstream body.
pub struct WithdrawalImpactPolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: DispositionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `DispositionRequirements` | 正式authority与已知范围约束 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ImpactNoticeViewRow

```rust
/// Carries ImpactNoticeViewRow with explicit sources and no upstream body.
pub struct ImpactNoticeViewRow {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries notice_refs; see the source and invariant table.
    pub notice_refs: NoticeIntentRefSet,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 已提交处置 |
| impact_ref | `ImpactRecordRef` | 已知集合/coverage |
| notice_refs | `NoticeIntentRefSet` | safe attempts/results |
| read_context | `SafeReadContext` | 同scope裁剪数量/细节 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### OperationContextRow

```rust
/// Carries OperationContextRow with explicit sources and no upstream body.
pub struct OperationContextRow {
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

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### OperationRecordRow

```rust
/// Carries OperationRecordRow with explicit sources and no upstream body.
pub struct OperationRecordRow {
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

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### StoredOperationResultRow

```rust
/// Carries StoredOperationResultRow with explicit sources and no upstream body.
pub struct StoredOperationResultRow {
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

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### MarketAuditRecordRow

```rust
/// Carries MarketAuditRecordRow with explicit sources and no upstream body.
pub struct MarketAuditRecordRow {
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

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### DeferredWorkRow

```rust
/// Carries DeferredWorkRow with explicit sources and no upstream body.
pub struct DeferredWorkRow {
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

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### RecoveryIntentRow

```rust
/// Carries RecoveryIntentRow with explicit sources and no upstream body.
pub struct RecoveryIntentRow {
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

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ObservationOutcomeBindingRow

```rust
/// Carries ObservationOutcomeBindingRow with explicit sources and no upstream body.
pub struct ObservationOutcomeBindingRow {
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

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### RecoveryPolicyRow

```rust
/// Carries RecoveryPolicyRow with explicit sources and no upstream body.
pub struct RecoveryPolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: RecoveryRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `RecoveryRequirements` | 正式恢复/权限/原意图依据 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省


### AuditRecoveryViewRow

```rust
/// Carries AuditRecoveryViewRow with explicit sources and no upstream body.
pub struct AuditRecoveryViewRow {
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

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### TypedOwnerReferenceRow

```rust
/// Carries TypedOwnerReferenceRow with explicit sources and no upstream body.
pub struct TypedOwnerReferenceRow {
    /// Carries owner_kind_ref; see the source and invariant table.
    pub owner_kind_ref: QualifiedOwnerKindRef,
    /// Carries canonical_ref; see the source and invariant table.
    pub canonical_ref: CanonicalOwnerRef,
    /// Carries contract_ref; see the source and invariant table.
    pub contract_ref: OwnerConsumerContractRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_kind_ref | `QualifiedOwnerKindRef` | 正式owner kind映射，不以UI五类型定义enum |
| canonical_ref | `CanonicalOwnerRef` | 正式owner/SDK提供opaque ref |
| contract_ref | `OwnerConsumerContractRef` | 当前operation/consumer正式资格来源 |

归属：contracts；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### QualifiedReferenceSnapshotRow

```rust
/// Carries QualifiedReferenceSnapshotRow with explicit sources and no upstream body.
pub struct QualifiedReferenceSnapshotRow {
    /// Carries snapshot_ref; see the source and invariant table.
    pub snapshot_ref: QualifiedReferenceSnapshotRef,
    /// Carries source_ref; see the source and invariant table.
    pub source_ref: TypedOwnerReference,
    /// Carries source_version; see the source and invariant table.
    pub source_version: OwnerVersionRef,
    /// Carries safe_material; see the source and invariant table.
    pub safe_material: QualifiedSnapshotMaterial,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
    /// Carries state; see the source and invariant table.
    pub state: ReferenceSnapshotState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| snapshot_ref | `QualifiedReferenceSnapshotRef` | 本地ID |
| source_ref | `TypedOwnerReference` | 正式来源 |
| source_version | `OwnerVersionRef` | 来源版本/cursor |
| safe_material | `QualifiedSnapshotMaterial` | finite source/publisher/material/decision/receiver/notice/observation safe切片；无正文 |
| validity_ref | `SourceValidityRef` | 正式owner有效性，非本地fresh自证 |
| state | `ReferenceSnapshotState` | Qualified/Stale/Unavailable |
| revision | `MarketRevision` | 更新CAS来源 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### QualifiedReadContextRow

```rust
/// Carries QualifiedReadContextRow with explicit sources and no upstream body.
pub struct QualifiedReadContextRow {
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries disclosure_ref; see the source and invariant table.
    pub disclosure_ref: DisclosureDecisionRef,
    /// Carries source_constraints; see the source and invariant table.
    pub source_constraints: SourceVisibilityConstraintSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope_ref | `MarketScopeRef` | 正式scope resolver |
| disclosure_ref | `DisclosureDecisionRef` | 当前披露依据，不由ref或public标签猜 |
| source_constraints | `SourceVisibilityConstraintSet` | owner/市场/组织交集 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ReadProjectionRow

```rust
/// Carries ReadProjectionRow with explicit sources and no upstream body.
pub struct ReadProjectionRow {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
    /// Carries snapshot_refs; see the source and invariant table.
    pub snapshot_refs: QualifiedReferenceSnapshotRefSet,
    /// Carries view_keys; see the source and invariant table.
    pub view_keys: MarketReadViewKeySet,
    /// Carries state; see the source and invariant table.
    pub state: ReadProjectionState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 本地typed projection identity |
| kind | `MarketProjectionKind` | Catalog/Progress/Impact/Audit四有限切片族 |
| scope_ref | `MarketScopeRef` | 不可跨scope复用 |
| source_cursor | `MarketSourceCursor` | 重建committed facts稳定cursor |
| snapshot_refs | `QualifiedReferenceSnapshotRefSet` | typed safe来源 |
| view_keys | `MarketReadViewKeySet` | view kind+market subject+scope身份，非解析opaque字符串 |
| state | `ReadProjectionState` | Fresh/Stale/Rebuilding/Unavailable |
| revision | `MarketRevision` | rebuild compare与原子发布 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### ReadBoundaryPolicyRow

```rust
/// Carries ReadBoundaryPolicyRow with explicit sources and no upstream body.
pub struct ReadBoundaryPolicyRow {
    /// Carries requirements; see the source and invariant table.
    pub requirements: ReadBoundaryRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `ReadBoundaryRequirements` | 正式disclosure/sourcevisibility交集 |

归属：domain；仅typedrepository decode到完整行后rehydrate；不允许客户端/fake私有字段造缺省

### OptionalSourceBinding

```rust
/// Provides the documented local OptionalSourceBinding carrier.
pub type OptionalSourceBinding = Option<SourceBinding>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### MaterialReferenceSet

```rust
/// Provides the documented local MaterialReferenceSet carrier.
pub type MaterialReferenceSet = Vec<MaterialReference>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### OptionalQualificationOutcomeRef

```rust
/// Provides the documented local OptionalQualificationOutcomeRef carrier.
pub type OptionalQualificationOutcomeRef = Option<QualificationOutcomeRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalPublicationBasisRef

```rust
/// Provides the documented local OptionalPublicationBasisRef carrier.
pub type OptionalPublicationBasisRef = Option<PublicationBasisRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalReviewHandoffRef

```rust
/// Provides the documented local OptionalReviewHandoffRef carrier.
pub type OptionalReviewHandoffRef = Option<ReviewHandoffRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalReviewDispatchOutcomeRef

```rust
/// Provides the documented local OptionalReviewDispatchOutcomeRef carrier.
pub type OptionalReviewDispatchOutcomeRef = Option<ReviewDispatchOutcomeRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalSafeFailureRef

```rust
/// Provides the documented local OptionalSafeFailureRef carrier.
pub type OptionalSafeFailureRef = Option<SafeFailureRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalGovernanceDecisionBinding

```rust
/// Provides the documented local OptionalGovernanceDecisionBinding carrier.
pub type OptionalGovernanceDecisionBinding = Option<GovernanceDecisionBinding>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### CategoryRefSet

```rust
/// Provides the documented local CategoryRefSet carrier.
pub type CategoryRefSet = Vec<CategoryRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### OptionalWithdrawalDispositionRef

```rust
/// Provides the documented local OptionalWithdrawalDispositionRef carrier.
pub type OptionalWithdrawalDispositionRef = Option<WithdrawalDispositionRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalCategoryRef

```rust
/// Provides the documented local OptionalCategoryRef carrier.
pub type OptionalCategoryRef = Option<CategoryRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### MarketVersionRefSet

```rust
/// Provides the documented local MarketVersionRefSet carrier.
pub type MarketVersionRefSet = Vec<MarketVersionRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### OptionalReceiverOutcomeBinding

```rust
/// Provides the documented local OptionalReceiverOutcomeBinding carrier.
pub type OptionalReceiverOutcomeBinding = Option<ReceiverOutcomeBinding>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalDistributionIntentRef

```rust
/// Provides the documented local OptionalDistributionIntentRef carrier.
pub type OptionalDistributionIntentRef = Option<DistributionIntentRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref


### OptionalDistributionRelationRef

```rust
/// Provides the documented local OptionalDistributionRelationRef carrier.
pub type OptionalDistributionRelationRef = Option<DistributionRelationRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### DistributionAttemptRefSet

```rust
/// Provides the documented local DistributionAttemptRefSet carrier.
pub type DistributionAttemptRefSet = Vec<DistributionAttemptRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### DistributionRelationRefSet

```rust
/// Provides the documented local DistributionRelationRefSet carrier.
pub type DistributionRelationRefSet = Vec<DistributionRelationRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### OptionalDispatchFence

```rust
/// Provides the documented local OptionalDispatchFence carrier.
pub type OptionalDispatchFence = Option<DispatchFence>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### OptionalNoticeOutcomeBinding

```rust
/// Provides the documented local OptionalNoticeOutcomeBinding carrier.
pub type OptionalNoticeOutcomeBinding = Option<NoticeOutcomeBinding>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### NoticeIntentRefSet

```rust
/// Provides the documented local NoticeIntentRefSet carrier.
pub type NoticeIntentRefSet = Vec<NoticeIntentRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### OptionalStoredOperationResultRef

```rust
/// Provides the documented local OptionalStoredOperationResultRef carrier.
pub type OptionalStoredOperationResultRef = Option<StoredOperationResultRef>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### SafeBasisReferenceSet

```rust
/// Provides the documented local SafeBasisReferenceSet carrier.
pub type SafeBasisReferenceSet = Vec<SafeBasisReference>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### MarketAuditRefSet

```rust
/// Provides the documented local MarketAuditRefSet carrier.
pub type MarketAuditRefSet = Vec<MarketAuditRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### DeferredWorkRefSet

```rust
/// Provides the documented local DeferredWorkRefSet carrier.
pub type DeferredWorkRefSet = Vec<DeferredWorkRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### RecoveryIntentRefSet

```rust
/// Provides the documented local RecoveryIntentRefSet carrier.
pub type RecoveryIntentRefSet = Vec<RecoveryIntentRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### OptionalObservationOutcomeBinding

```rust
/// Provides the documented local OptionalObservationOutcomeBinding carrier.
pub type OptionalObservationOutcomeBinding = Option<ObservationOutcomeBinding>;
```

归属：contracts；None语义由所属carrier生命周期约束；不能补空ref

### SourceVisibilityConstraintSet

```rust
/// Provides the documented local SourceVisibilityConstraintSet carrier.
pub type SourceVisibilityConstraintSet = Vec<SourceVisibilityConstraint>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### QualifiedReferenceSnapshotRefSet

```rust
/// Provides the documented local QualifiedReferenceSnapshotRefSet carrier.
pub type QualifiedReferenceSnapshotRefSet = Vec<QualifiedReferenceSnapshotRef>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束

### MarketReadViewKeySet

```rust
/// Provides the documented local MarketReadViewKeySet carrier.
pub type MarketReadViewKeySet = Vec<MarketReadViewKey>;
```

归属：contracts；typed集合去重保留稳定顺序；空仅无已知项，不等缺失/全覆盖；batchlimit约束


### OwnerAssetDigest

```rust
/// Carries OwnerAssetDigest with explicit sources and no upstream body.
pub struct OwnerAssetDigest {
    /// Carries token; see the source and invariant table.
    pub token: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| token | `String` | owner提供的不可变资产摘要transport；不本地hash资产、不假填sha256、不把MarketIntentFingerprint当资产digest |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。
