# Step10 U5 撤回/影响/通知独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用ImpactRecord、NoticeIntent；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| ImpactRecord | ImpactCoverageKind | business / known impact coverage | 进入；逐对象矩阵，非ownertruth |
| NoticeIntent | NoticeIntentState | handoff propagation / notice | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### ImpactRecordStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `ImpactCoverageKind`；所属domain/本地business / known impact coverage。Partial允许include增量仍Partial；KnownScopeComplete同upper去重重复delta可no-op，不推安装全集；同cursor更晚external结果仍须明确新本地commitcursor 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u5.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u5.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local ImpactRecord lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
pub enum ImpactCoverageKind {
    /// Carries local Partial posture; it does not establish upstream truth.
    Partial,
    /// Carries local KnownScopeComplete posture; it does not establish upstream truth.
    KnownScopeComplete,
}
```

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Partial | 已知范围枚举尚有本地cursor缺口 | 仅下列带guard转移 | KnownScopeComplete |
| KnownScopeComplete | 指定cursor内已知集合完整，late关系仍增量；非全安装覆盖 | 仅下列带guard转移 | Partial |

#### factory、恢复与终态

`pub fn start(input: ImpactEnumerationInput) -> Result<Self, DomainError>`创建`Partial`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。无业务终结承诺；维护状态仅按矩阵循环。

#### ASCII状态图

```text
[ImpactRecord]
  factory -> Partial
  Partial -> KnownScopeComplete
  KnownScopeComplete -> Partial
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | ImpactEnumerationInput.disposition_ref/coverage_cursor来自accepted版本处置，Partial空初始不假完整；ImpactDeltaInput的relation_refs/unknown_attempt_refs取fixedupper联合scan typedrows，去重并exact version/disposition；enumeration_complete只能联合流终页且线性前序全部committed，nextcursor子plan包含完整after；late更高cursor/缺口让KnownScopeComplete→Partial | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Partial；固定disposition/sourcecursor范围内typed枚举完成，known/unknown集合去重；拟to==KnownScopeComplete；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==KnownScopeComplete；late relation或更高cursor形成新typed增量/缺口；拟to==Partial；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Partial允许include增量仍Partial；KnownScopeComplete同upper去重重复delta可no-op，不推安装全集；同cursor更晚external结果仍须明确新本地commitcursor；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn include(&mut self, delta: ImpactDeltaInput) -> Result<(), DomainError>` | Step6完整ImpactDeltaInput来源+CB；restrict_market_version/withdraw_market_version/enumerate_known_impact/record_receiver_outcome/reconcile_distribution/dispatch_distribution |
| `pub fn start(input: ImpactEnumerationInput) -> Result<Self, DomainError>` | Step6完整ImpactEnumerationInput来源+CB；restrict_market_version/withdraw_market_version/enumerate_known_impact/record_receiver_outcome/reconcile_distribution/dispatch_distribution |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_impact/save_impact/get_impact_by_disposition/scan_known_impact; WorkStorePort.load_plan存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Partial | KnownScopeComplete |
|---|---|---|
| Partial | S | A |
| KnownScopeComplete | A | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Partial | Partial | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ImpactRecord-Partial-Partial |
| Partial | KnownScopeComplete | A | EnumerateKnownImpact / include(ImpactDeltaInput delta) | C01 / C00 / CB | 保存coveragecursor/audit/report，非全安装集合；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ImpactRecord-Partial-KnownScopeComplete |
| KnownScopeComplete | Partial | A | RecordReceiverOutcome / DispatchDistribution / ReconcileDistribution / EnumerateKnownImpact / include(ImpactDeltaInput delta) | C02 / C00 / CB | 增量影响与必要noticeplanning责任，不覆盖旧known集；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ImpactRecord-KnownScopeComplete-Partial |
| KnownScopeComplete | KnownScopeComplete | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ImpactRecord-KnownScopeComplete-KnownScopeComplete |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | ImpactEnumerationInput.disposition_ref/coverage_cursor来自accepted版本处置，Partial空初始不假完整；ImpactDeltaInput的relation_refs/unknown_attempt_refs取fixedupper联合scan typedrows，去重并exact version/disposition；enumeration_complete只能联合流终页且线性前序全部committed，nextcursor子plan包含完整after；late更高cursor/缺口让KnownScopeComplete→Partial中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | ImpactRecord独立carrier，2variant与Step6一致，4状态对完整；没有外部approval或全局state |
| factory/member/flow | 2既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### NoticeIntentStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `NoticeIntentState`；所属domain/本地handoff propagation / notice。Confirmed原binding完全相等且不解释delivered/read；Dispatching/Unknown只probe不send；Failed/Blocked的S不构成retrypermission 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u5.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u5.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local NoticeIntent lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Prepared | 通知计划成立，未发出 | 仅下列带guard转移 | Dispatching/Blocked |
| Dispatching | 已持久发送许可，结果独立 | 仅下列带guard转移 | Confirmed/Failed/CommitUnknown |
| Confirmed | 匹配正式通道结果可查；是否送达由owner outcome说明 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |
| Failed | 明确未提交失败，允许安全原意图重试 | 仅下列带guard转移 | Dispatching |
| CommitUnknown | 可能发送，不盲重试 | 仅下列带guard转移 | Confirmed/Failed |
| Blocked | 通道/目标/权限合同不具备 | 仅下列带guard转移 | Dispatching |

#### factory、恢复与终态

`pub fn prepare(input: QualifiedNoticePlanInput) -> Result<Self, DomainError>`创建`Prepared`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Confirmed，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[NoticeIntent]
  factory -> Prepared
  Prepared -> Dispatching
  Prepared -> Blocked
  Dispatching -> Confirmed
  Dispatching -> Failed
  Dispatching -> CommitUnknown
  CommitUnknown -> Confirmed
  CommitUnknown -> Failed
  Failed -> Dispatching
  Blocked -> Dispatching
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | QualifiedNoticePlanInput五字段正式target/channel/current scope，unique(impact,target,channel,scope)；NoticeDispatchInput.permission原noticeintent/fence/target合法且先persist；NoticeOutcomeInput::Confirmed exactnotice/target/channel/scope正式binding，negative正式notcommit，Unknown gap；Failed/Blocked→Dispatching必须notcommitted+正式currentqualify+newfence sameintent | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Prepared；当前target/channelauthority+原intentfence，许可先持久；拟to==Dispatching；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Prepared；未外发合同/权限不具备；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Dispatching；matching正式channel结果ref（不是ACK自填）；拟to==Confirmed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Dispatching；正式已证明未提交失败；拟to==Failed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Dispatching；外部结果未知/许可后crash；拟to==CommitUnknown；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C06 | C00 + CB；loadedstate==CommitUnknown；原intentformalprobe matching结果；拟to==Confirmed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C07 | C00 + CB；loadedstate==CommitUnknown；formalprobe证明未提交失败；拟to==Failed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C08 | C00 + CB；loadedstate==Failed；明确未提交、currenttarget/channel、sameintent、新fence；拟to==Dispatching；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C09 | C00 + CB；loadedstate==Blocked；contract/authority补齐，typed证明未外发，同intent；拟to==Dispatching；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Confirmed原binding完全相等且不解释delivered/read；Dispatching/Unknown只probe不send；Failed/Blocked的S不构成retrypermission；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn begin(&mut self, input: NoticeDispatchInput) -> Result<(), DomainError>` | Step6完整NoticeDispatchInput来源+CB；plan_impact_notifications/dispatch_notice/reconcile_notice/record_notice_outcome |
| `pub fn settle(&mut self, input: NoticeOutcomeInput) -> Result<(), DomainError>` | Step6完整NoticeOutcomeInput来源+CB；plan_impact_notifications/dispatch_notice/reconcile_notice/record_notice_outcome |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | Step6完整ContractGapInput来源+CB；plan_impact_notifications/dispatch_notice/reconcile_notice/record_notice_outcome |
| `pub fn prepare(input: QualifiedNoticePlanInput) -> Result<Self, DomainError>` | Step6完整QualifiedNoticePlanInput来源+CB；plan_impact_notifications/dispatch_notice/reconcile_notice/record_notice_outcome |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_notice/save_notice/find_notice/load_impact; WorkStorePort.get_permission存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Prepared | Dispatching | Confirmed | Failed | CommitUnknown | Blocked |
|---|---|---|---|---|---|---|
| Prepared | S | A | R | R | R | A |
| Dispatching | R | S | A | A | A | R |
| Confirmed | R | R | S | R | R | R |
| Failed | R | A | R | S | R | R |
| CommitUnknown | R | R | A | A | S | R |
| Blocked | R | A | R | R | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Prepared | Prepared | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Prepared-Prepared |
| Prepared | Dispatching | A | DispatchNotice / begin(NoticeDispatchInput input) | C01 / C00 / CB | 外部调用在SQL事务外；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Prepared-Dispatching |
| Prepared | Confirmed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Prepared-Confirmed |
| Prepared | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Prepared-Failed |
| Prepared | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Prepared-CommitUnknown |
| Prepared | Blocked | A | DispatchNotice / block(ContractGapInput gap) | C02 / C00 / CB | gap/audit/report，不复活version；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Prepared-Blocked |
| Dispatching | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Dispatching-Prepared |
| Dispatching | Dispatching | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Dispatching-Dispatching |
| Dispatching | Confirmed | A | RecordNoticeOutcome / DispatchNotice / ReconcileNotice / settle(NoticeOutcomeInput input) | C03 / C00 / CB | binding/audit/fullreport，送达意义owner说明；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Dispatching-Confirmed |
| Dispatching | Failed | A | DispatchNotice / ReconcileNotice / settle(NoticeOutcomeInput input) | C04 / C00 / CB | 安全failure与同意图retry依据；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Dispatching-Failed |
| Dispatching | CommitUnknown | A | DispatchNotice / settle(NoticeOutcomeInput input) | C05 / C00 / CB | unknown+原intentprobe责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Dispatching-CommitUnknown |
| Dispatching | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Dispatching-Blocked |
| Confirmed | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Confirmed-Prepared |
| Confirmed | Dispatching | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Confirmed-Dispatching |
| Confirmed | Confirmed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Confirmed-Confirmed |
| Confirmed | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Confirmed-Failed |
| Confirmed | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Confirmed-CommitUnknown |
| Confirmed | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Confirmed-Blocked |
| Failed | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Failed-Prepared |
| Failed | Dispatching | A | DispatchNotice / begin(NoticeDispatchInput input) | C08 / C00 / CB | 重试历史追加，不新notice意图；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Failed-Dispatching |
| Failed | Confirmed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Failed-Confirmed |
| Failed | Failed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Failed-Failed |
| Failed | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Failed-CommitUnknown |
| Failed | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Failed-Blocked |
| CommitUnknown | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-CommitUnknown-Prepared |
| CommitUnknown | Dispatching | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-CommitUnknown-Dispatching |
| CommitUnknown | Confirmed | A | RecordNoticeOutcome / DispatchNotice / ReconcileNotice / settle(NoticeOutcomeInput input) | C06 / C00 / CB | 安全结果ref，非read/remediated；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-CommitUnknown-Confirmed |
| CommitUnknown | Failed | A | DispatchNotice / ReconcileNotice / settle(NoticeOutcomeInput input) | C07 / C00 / CB | 原failure，允许有据sameintent重试；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-CommitUnknown-Failed |
| CommitUnknown | CommitUnknown | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-CommitUnknown-CommitUnknown |
| CommitUnknown | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-CommitUnknown-Blocked |
| Blocked | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Blocked-Prepared |
| Blocked | Dispatching | A | DispatchNotice / begin(NoticeDispatchInput input) | C09 / C00 / CB | 本地新许可后externaldispatch；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Blocked-Dispatching |
| Blocked | Confirmed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Blocked-Confirmed |
| Blocked | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Blocked-Failed |
| Blocked | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-NoticeIntent-Blocked-CommitUnknown |
| Blocked | Blocked | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-NoticeIntent-Blocked-Blocked |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | QualifiedNoticePlanInput五字段正式target/channel/current scope，unique(impact,target,channel,scope)；NoticeDispatchInput.permission原noticeintent/fence/target合法且先persist；NoticeOutcomeInput::Confirmed exactnotice/target/channel/scope正式binding，negative正式notcommit，Unknown gap；Failed/Blocked→Dispatching必须notcommitted+正式currentqualify+newfence sameintent中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | NoticeIntent独立carrier，6variant与Step6一致，36状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
