# L6-bridges 03 Step8：Query协议与唯一view

## 1. Q范围、批次及统一请求

主文件Q问题/诊断/取舍已done；沿四个既有single-subject入口，不新增list/search、维护或分页surface。所有新schema唯一计划归属`crates/contracts/src/queries.rs`，view二级词汇唯一归属Step6 `views.rs/shared`，Application snapshot/projector不得直接出wire。请求为`BridgeQueryRequest<Get*Request>`，结果为`BridgeQueryResponse`；严格codec/metadata/error沿[共享协议](03_ddd_step_08_shared_protocol.md)。

| 协议 / canonical HLD | 模块 / 目标 | 既有port / projector | 未来Step9 flow | 停审 |
|---|---|---|---|---|
| Q01 GetBindingMappingView | U6读取U1完整事实 | SafeReadQualificationPort、InstallationRepository、MappingRepository、LocalViewProjector | GetBindingMappingView | pass |
| Q02 GetBridgeOperationView | U6读取原operation各stage | SafeReadQualificationPort、Inbound/Delivery/Callback/Continuity/SafeTraceRepository、LocalViewProjector | GetBridgeOperationView | pass |
| Q03 GetContinuityView | U6读取U5既有事实 | SafeReadQualificationPort、ContinuityRepository、LaneRepository、LocalViewProjector | GetContinuityView | pass |
| Q04 GetSafeHandoffView | U6读取audit/handoff事实 | SafeReadQualificationPort、SafeTraceRepository、LocalViewProjector | GetSafeHandoffView | pass |

actor是实际内部已认证ActorContext；body中的subject只有定位意义。API固定QueryDispatcher逐一映射原input；无metadata/context双承载。page=None、idempotency_key=None、consistency=原Eventual/Strong；当前query使用POST只为安全typed body，不改变只读/no-write语义；固定URL不含secret或subject。路由/HTTP产品尚未选择。

## 2. Q01 GetBindingMappingView

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/queries/binding-mapping-view` |
| caller / handler | 当前有subject读取资格的已认证内部调用方 / QueryDispatcher::BindingMapping -> GetBindingMappingView::execute |
| exact callable | `execute<'a>(&'a self, input: GetBindingMappingViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>` |

```rust
/// Q01完整定位，不自报visibility、scope或安装运行资格。
pub struct BridgeBindingViewQuery {
    /// 只允许Installation、Binding、Mapping三subject族。
    subject: BridgeViewSubjectRef,
}
/// HLD Query与DDD Request唯一收敛；wire仍只有subject字段。
pub type GetBindingMappingViewRequest = BridgeBindingViewQuery;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_subject(subject: BridgeViewSubjectRef) -> Result<Self, ContractViolation>` | /// 核Q01三族allowlist和原ref结构；不解析ref推scope。 |
| `pub fn into_subject(self) -> BridgeViewSubjectRef` | /// 原值移交GetBindingMappingViewInput.subject，不生成view ID。 |

完整input=context由actual host与原QueryMetadata/authority/trace组装，subject来自本DTO。resolver先核namespace/scope/资格；Installation/Binding/Mapping原完整row/key/hydration形成`ExistingLocalSnapshot`。LocalViewProjector.project(current,Some(snapshot),actual now)只投影原config/relation/mapping阶段和获准refs；absent只在已允许exact解析后NotFound。原安装Blocked/Suspended等是Business有限状态，不是新Disabled标记；当前允显才能输出。

## 3. Q02 GetBridgeOperationView

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/queries/operation-view` |
| caller / handler | 原operation/subject当前读授权调用方 / QueryDispatcher::BridgeOperation -> GetBridgeOperationView::execute |
| exact callable | `execute<'a>(&'a self, input: GetBridgeOperationViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>` |

```rust
/// Q02原operation分阶段安全只读，不请求probe/repair。
pub struct BridgeOperationViewQuery {
    /// 只Operation、Inbound、Presentation、Intent、Attempt、Receipt、Action、Callback。
    subject: BridgeViewSubjectRef,
}
/// Q02 Request是原Query别名，无重复operation/ref/scope字段。
pub type GetBridgeOperationViewRequest = BridgeOperationViewQuery;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_subject(subject: BridgeViewSubjectRef) -> Result<Self, ContractViolation>` | /// 核Q02八族及原定位，不以owner/platform结果构造新主语。 |
| `pub fn into_subject(self) -> BridgeViewSubjectRef` | /// 移交原subject到GetBridgeOperationViewInput；no IO。 |

context来源同Q01；完整read根据具体ref调用原Inbound/Delivery/Callback/Continuity/SafeTraceRepository读取已提交同op facts/result关联；ACK、local commit、owner accepted、platform business与consumer各自stage，禁止GlobalSuccess/TurnCommitted/Delivered/Read推断。Recovery subject只能Q03；不依HLD描述文字添加第二入口。完整原op unknown保Indeterminate marker，不查平台或owner新状态。

## 4. Q03 GetContinuityView

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/queries/continuity-view` |
| caller / handler | 原连续性subject当前读授权调用方 / QueryDispatcher::Continuity -> GetContinuityView::execute |
| exact callable | `execute<'a>(&'a self, input: GetContinuityViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>` |

```rust
/// Q03原连续性只读，不reserve、推进cursor或释放lane。
pub struct BridgeContinuityViewQuery {
    /// 只Dedup、Cursor、Gap、Lane、Recovery五族。
    subject: BridgeViewSubjectRef,
}
/// Q03 Request复用唯一Query schema。
pub type GetContinuityViewRequest = BridgeContinuityViewQuery;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_subject(subject: BridgeViewSubjectRef) -> Result<Self, ContractViolation>` | /// 核五族/ref形状，不用平台offset造Store cursor。 |
| `pub fn into_subject(self) -> BridgeViewSubjectRef` | /// 原subject交GetContinuityViewInput，无mutation。 |

context同Q01；ContinuityRepository/LaneRepository原完整row/read_basis/current disclosure形成snapshot。可见state/revision、gap未闭合、lane unresolved、recovery unknown只原事实；不导出平台opaque resume token、private offset或repository cursor。当前stage/ref不允显便从View集合排除，不能报告hidden_total=0或remaining全库数量。

## 5. Q04 GetSafeHandoffView

| 项 | 完整合同 |
|---|---|
| route | `POST /bridges/v1/queries/safe-handoff-view` |
| caller / handler | 原audit/handoff当前读授权调用方 / QueryDispatcher::SafeHandoff -> GetSafeHandoffView::execute |
| exact callable | `execute<'a>(&'a self, input: GetSafeHandoffViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>` |

```rust
/// Q04只读原audit/handoff，不生成canonical或evidence。
pub struct SafeHandoffViewQuery {
    /// 只Audit、Handoff两族。
    subject: BridgeViewSubjectRef,
}
/// Q04 Request复用唯一Query schema。
pub type GetSafeHandoffViewRequest = SafeHandoffViewQuery;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_subject(subject: BridgeViewSubjectRef) -> Result<Self, ContractViolation>` | /// 核两族/ref结构，不把日志引用当canonical材料。 |
| `pub fn into_subject(self) -> BridgeViewSubjectRef` | /// 原subject交GetSafeHandoffViewInput，不启动J04。 |

context同Q01；SafeTraceRepository完整immutable audit/原handoff/results/hydration读取，经同subject resolver/current裁剪。实际canonical/schema/admission缺口不伪造producer成功；consumer accepted只原consumer阶段，不代表evidence/report/verdict/signoff/readiness。query不补材料、不append audit、不修改handoff。

## 6. 唯一response字段与marker闭环

四Q响应固定`{version,result}`，result唯一原BridgeReadResult；View完整schema是Step6 BridgeLocalView六字段，不添加total_count/page/cursor/debug/refresh字段。以下是字段级wire引用及来源，不重复声明第二view。

| exact字段 | Contracts类型 / 原schema | 来源 -> encode约束 |
|---|---|---|
| view_subject | BridgeViewSubjectRef / views.rs的18个原typed variant | actual resolved/获准subject；库原identity，不生成projection ID，不输出未准入family。 |
| scope_ref | AuthorizedReadScopeRef / shared/authority.rs的SafeAuthorityRef newtype | SafeReadQualificationPort原scope及source/version/window，不能由ref文本或snapshot猜。 |
| stage_slice | SafeStageSlice { observations: Vec<SafeStageObservation>, basis: AuthorizedReadScopeRef } | 完整committed snapshot经ReadDisclosureRules.stages过滤；same stage唯一，未获准阶段省略，不生成success替代。 |
| qualified_refs | VisibleSafeRefSet { refs: Vec<SafePublicRef>, scope: AuthorizedReadScopeRef, validity: SafeValidityWindow } | current visible集合与snapshot refs交集；bounded/unique；长度仅可见count，禁止hidden total或额外计数字段。 |
| freshness | ViewFreshnessKind：ExistingRevision(LocalRevision)、Stale(SafeReasonCode)、Degraded(SafeReasonCode)、Indeterminate(SafeReasonCode) | actual原local版本/失效/明确受限/未知事实；不能用requested_at、trace或查询到达时间造“fresh”。 |
| availability | SafeViewDisposition，只Qualified/Degraded可进View | current read结果；Denied/Unavailable必须外层有限结果，不带六字段。 |

| 二级payload / exact schema | 原来源及禁止替代 |
|---|---|
| SafeStageObservation：Protocol(ProtocolAckDisposition)、LocalCommit(LocalCommitKind)、Owner(OwnerResultKind)、Platform(PlatformStageKind)、Consumer(ConsumerResultKind)、Business(SafeLocalBusinessState) | 各族结果/业务state具名原getter；PlatformStageKind仅NotAttempted/InFlight/BusinessAccepted/KnownRejected/Indeterminate，不表示送达/已读。原17业务state由有限SafeLocalBusinessState对应，不造统一status。 |
| SafePublicRef：Subject(BridgeViewSubjectRef)、Authority(SafeAuthorityRef) | 只current明确允许的local/authority引用；Opaque形状不是body-free证明，source/ref contract须建立。 |
| SafeAuthorityRef / SafeValidityWindow / LocalRevision / SafeReasonCode | 完整字段/标签唯一见Step6 shared基础卡，G0 codec原factory递归；不得只序列化id而丢kind/source/scope/revision或窗口，也不得输出Stale内旧hidden ref。 |

`BridgeLocalView::from_qualified_fields`全部六入参逐字段来自上表；LocalViewProjector仅接CurrentReadQualification+ExistingLocalSnapshot，不允许API直接接Domain/private。`assert_read_shape(current,actual now)`和port返回前revalidate必须成立；整个链no write/audit/dedup/ID/refresh/probe/repair。

| result / missing surface | planned HTTP / 严格口径 |
|---|---|
| View(view) | 200；可见集合可能合法empty，但不表示不存在/无效果；actual snapshot缺必需部分只能Unavailable。 |
| NotVisible(reason) | 403；同一安全原因，无subject/ref/count/found、细化stage或可侧信道错误。 |
| NotFound(reason) | 404；只有current已允许exact subject解析且actual committed读不存在；不能解释为owner/platform no-effect。 |
| Unavailable(reason) | 503；缺合同/来源、Strong不满足或完整读取超预算；无empty成功、写fallback或自动retry承诺。 |
| stale / unknown / degraded | View中原freshness/stage/availability，不能用HTTP整体failed覆盖；前提仍current允显。 |
| rebuilding / disabled | 当前没有独立projection/job事实，不生成marker；原安装Suspended/Blocked是获准Business state。 |

分页：四body单subject；QueryMetadata.page=Some在dispatch前InvalidMetadata，idempotency_key=Some同样拒绝。Step7 BridgeRepositoryPageRequest/Page/Cursor只供有界完整snapshot读取，items转入完整snapshot再过滤，next/token不出wire；所需集合超过预算不能将第一页冒充完整View。Eventual沿actual已提交本地读取，Strong须driver保证当次本地一致read，不跨域owner/platform刷新；无法满足则Unavailable。

## 7. Q复杂度、草稿与停审

四完整deferred Query+四透明Request别名，没有第二read model/page/marker/实体或ID。每个Query factory穷尽allowlist/into_subject，metadata和actual上下文由wrapper/host唯一供给；二级完整schema沿Step6，字段来源与空/hidden/未知各自闭口。future正式03§7包含四独立协议、上表与page非适用说明。

人工schema/allowlist/完整view/current/no-write/方向检查pass；静态审计后才开放E0。计划测试沿原safe read/API与contracts：四wrong-family、page/key拒绝、current撤销隐藏存在性、可见empty与missing区别、stage独立、hidden count、Strong失败、超预算、全链零write/probe/audit；全部planned，未执行。

组内静态停审pass：六文档48表/32围栏行、584唯一定义，缺类型/重复/结构/字段Rustdoc错误0，diff-check通过；只进入E0。
