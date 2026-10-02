# Step10 U2 申请/正式审核交接独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用PublicationApplication、ReviewHandoff；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| PublicationApplication | PublicationApplicationState | business / publication | 进入；逐对象矩阵，非ownertruth |
| ReviewHandoff | ReviewHandoffState | handoff propagation / review | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### PublicationApplicationStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `PublicationApplicationState`；所属domain/本地business / publication。Draft同state的revise更新候选但不approval；Submitted固定draft/basis/review不替换；Terminated只读/原结果，旧review与unknown责任仍保留 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u2.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u2.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local PublicationApplication lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
pub enum PublicationApplicationState {
    /// Carries local Draft posture; it does not establish upstream truth.
    Draft,
    /// Carries local Submitted posture; it does not establish upstream truth.
    Submitted,
    /// Carries local Terminated posture; it does not establish upstream truth.
    Terminated,
}
```

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Draft | 允许改草稿输入 | 仅下列带guard转移 | Submitted/Terminated |
| Submitted | 固定申请基线，等待独立handoff/决定 | 仅下列带guard转移 | Terminated |
| Terminated | 本地申请终止，不复活 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn draft(input: DraftPublicationInput) -> Result<Self, DomainError>`创建`Draft`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Terminated，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[PublicationApplication]
  factory -> Draft
  Draft -> Submitted
  Draft -> Terminated
  Submitted -> Terminated
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | DraftPublicationInput.application_ref/draft_spec与当前publisher/scope一致；revise只Draft且expected_revision等loaded；submit的QualifiedPublicationInput.source/publisher_ref/materials/scope_ref来自FreshGate.publication，basis_ref/review_ref来自IDPort，同Tx固定PublicationBasis与PendingDispatch handoff+work；terminate用正式ApplicationTerminationInput.authority_ref/reason_ref | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Draft；当前source/publisher/material，固定basis与scope；Draft revision；拟to==Submitted；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Draft；正式终止authority；拟to==Terminated；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Submitted；正式终止authority与当前reviewinspection；拟to==Terminated；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Draft同state的revise更新候选但不approval；Submitted固定draft/basis/review不替换；Terminated只读/原结果，旧review与unknown责任仍保留；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn revise(&mut self, input: DraftPublicationInput) -> Result<(), DomainError>` | Step6完整DraftPublicationInput来源+CB；create_publication_draft/revise_publication_draft/submit_publication_application/terminate_publication_application |
| `pub fn submit(&mut self, input: QualifiedPublicationInput) -> Result<(), DomainError>` | Step6完整QualifiedPublicationInput来源+CB；create_publication_draft/revise_publication_draft/submit_publication_application/terminate_publication_application |
| `pub fn terminate(&mut self, input: ApplicationTerminationInput) -> Result<(), DomainError>` | Step6完整ApplicationTerminationInput来源+CB；create_publication_draft/revise_publication_draft/submit_publication_application/terminate_publication_application |
| `pub fn draft(input: DraftPublicationInput) -> Result<Self, DomainError>` | Step6完整DraftPublicationInput来源+CB；create_publication_draft/revise_publication_draft/submit_publication_application/terminate_publication_application |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_application/save_application/load_basis/append_basis/load_review/save_review存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Draft | Submitted | Terminated |
|---|---|---|---|
| Draft | S | A | A |
| Submitted | R | S | A |
| Terminated | R | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Draft | Draft | S | RevisePublicationDraft / revise(DraftPublicationInput input) | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-PublicationApplication-Draft-Draft |
| Draft | Submitted | A | SubmitPublicationApplication / submit(QualifiedPublicationInput input) | C01 / C00 / CB | basis+review PendingDispatch+work+audit/result同UoW；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-PublicationApplication-Draft-Submitted |
| Draft | Terminated | A | TerminatePublicationApplication / terminate(ApplicationTerminationInput input) | C02 / C00 / CB | audit/result，不删草稿依据；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-PublicationApplication-Draft-Terminated |
| Submitted | Draft | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-PublicationApplication-Submitted-Draft |
| Submitted | Submitted | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-PublicationApplication-Submitted-Submitted |
| Submitted | Terminated | A | TerminatePublicationApplication / terminate(ApplicationTerminationInput input) | C03 / C00 / CB | 保留已有外部交接及unknown对账责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-PublicationApplication-Submitted-Terminated |
| Terminated | Draft | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-PublicationApplication-Terminated-Draft |
| Terminated | Submitted | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-PublicationApplication-Terminated-Submitted |
| Terminated | Terminated | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-PublicationApplication-Terminated-Terminated |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | DraftPublicationInput.application_ref/draft_spec与当前publisher/scope一致；revise只Draft且expected_revision等loaded；submit的QualifiedPublicationInput.source/publisher_ref/materials/scope_ref来自FreshGate.publication，basis_ref/review_ref来自IDPort，同Tx固定PublicationBasis与PendingDispatch handoff+work；terminate用正式ApplicationTerminationInput.authority_ref/reason_ref中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | PublicationApplication独立carrier，3variant与Step6一致，9状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### ReviewHandoffStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `ReviewHandoffState`；所属domain/本地handoff propagation / review。WaitingDecision只正式query/probe原intent不重发；MatchedDecision只原binding相等/历史，替代决定改变当前eligibility要新正式basis，不就地覆盖旧binding；Failed/ContractBlocked不能把S当send 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u2.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u2.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local ReviewHandoff lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| PendingDispatch | 待原意图交接 | 仅下列带guard转移 | WaitingDecision/CommitUnknown/ContractBlocked/Failed |
| WaitingDecision | 正式接收申请，非批准 | 仅下列带guard转移 | MatchedDecision |
| MatchedDecision | 匹配正式决定已关联，决定outcome仍需读取 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |
| CommitUnknown | 交接结果未知，原意图probe | 仅下列带guard转移 | WaitingDecision/Failed/MatchedDecision |
| ContractBlocked | consumer/SDK合同或binding不具备 | 仅下列带guard转移 | WaitingDecision/CommitUnknown |
| Failed | 明确未接收失败，可据原意图安全重试 | 仅下列带guard转移 | WaitingDecision/CommitUnknown |

#### factory、恢复与终态

`pub fn prepare(input: SubmittedApplicationInput) -> Result<Self, DomainError>`创建`PendingDispatch`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：MatchedDecision，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[ReviewHandoff]
  factory -> PendingDispatch
  PendingDispatch -> WaitingDecision
  PendingDispatch -> CommitUnknown
  PendingDispatch -> ContractBlocked
  PendingDispatch -> Failed
  Failed -> WaitingDecision
  Failed -> CommitUnknown
  ContractBlocked -> WaitingDecision
  ContractBlocked -> CommitUnknown
  CommitUnknown -> WaitingDecision
  CommitUnknown -> Failed
  WaitingDecision -> MatchedDecision
  CommitUnknown -> MatchedDecision
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | handoff_ref/application_ref/basis_ref固定且Current scope全匹配；dispatch正式current source/publisher/material+Gov consumer_contract，claim/fence/permission先持久；ReviewDispatchOutcomeInput::Confirmed含正式dispatch_outcome_ref，Unknown只能gap；Failed/ContractBlocked安全再发需原intentformalnotcommitted。record_decision绑定decision/application/basis/outcome/validity，经ReviewBindingPolicy(require_approved_for_listing=false)匹配；ACK/scan不可用 | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==PendingDispatch；正式接收原handoff，fixedbasis且申请未终止；拟to==WaitingDecision；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==PendingDispatch；许可已持久、timeout/crash可能提交；原intent；拟to==CommitUnknown；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==PendingDispatch；未外发、contract/SDK/sourcebinding缺失；拟to==ContractBlocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==PendingDispatch；正式证明未接收失败；拟to==Failed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Failed；原intent已证明未接收、当前gate、再次正式接收；拟to==WaitingDecision；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C06 | C00 + CB；loadedstate==Failed；原intent安全再发后结果未知；拟to==CommitUnknown；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C07 | C00 + CB；loadedstate==ContractBlocked；正式contract资格补齐，证明未外发，当前gate；拟to==WaitingDecision；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C08 | C00 + CB；loadedstate==ContractBlocked；补齐资格再发原intent，结果未知；拟to==CommitUnknown；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C09 | C00 + CB；loadedstate==CommitUnknown；formalprobe原intent确认接收，binding匹配；拟to==WaitingDecision；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C10 | C00 + CB；loadedstate==CommitUnknown；正式probe证明未接收失败；拟to==Failed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C11 | C00 + CB；loadedstate==WaitingDecision；正式Decision完整application/basis/scope绑定；拟to==MatchedDecision；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C12 | C00 + CB；loadedstate==CommitUnknown；正式query/probe决定证明匹配原申请；拟to==MatchedDecision；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | WaitingDecision只正式query/probe原intent不重发；MatchedDecision只原binding相等/历史，替代决定改变当前eligibility要新正式basis，不就地覆盖旧binding；Failed/ContractBlocked不能把S当send；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn record_dispatch(&mut self, outcome: ReviewDispatchOutcomeInput) -> Result<(), DomainError>` | Step6完整ReviewDispatchOutcomeInput来源+CB；submit_publication_application/dispatch_review_handoff/reconcile_review_handoff/record_governance_decision |
| `pub fn record_decision(&mut self, binding: GovernanceDecisionBinding) -> Result<(), DomainError>` | Step6完整GovernanceDecisionBinding来源+CB；submit_publication_application/dispatch_review_handoff/reconcile_review_handoff/record_governance_decision |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | Step6完整ContractGapInput来源+CB；submit_publication_application/dispatch_review_handoff/reconcile_review_handoff/record_governance_decision |
| `pub fn prepare(input: SubmittedApplicationInput) -> Result<Self, DomainError>` | Step6完整SubmittedApplicationInput来源+CB；submit_publication_application/dispatch_review_handoff/reconcile_review_handoff/record_governance_decision |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_review/save_review/load_application/load_basis; WorkStorePort.get_permission; OperationStorePort.load_checkpoint存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | PendingDispatch | WaitingDecision | MatchedDecision | CommitUnknown | ContractBlocked | Failed |
|---|---|---|---|---|---|---|
| PendingDispatch | S | A | R | A | A | A |
| WaitingDecision | R | S | A | R | R | R |
| MatchedDecision | R | R | S | R | R | R |
| CommitUnknown | R | A | A | S | R | A |
| ContractBlocked | R | A | R | A | S | R |
| Failed | R | A | R | A | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| PendingDispatch | PendingDispatch | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-PendingDispatch-PendingDispatch |
| PendingDispatch | WaitingDecision | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C01 / C00 / CB | 保存接收安全ref/audit/report；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-PendingDispatch-WaitingDecision |
| PendingDispatch | MatchedDecision | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-PendingDispatch-MatchedDecision |
| PendingDispatch | CommitUnknown | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C02 / C00 / CB | unknown+probe责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-PendingDispatch-CommitUnknown |
| PendingDispatch | ContractBlocked | A | DispatchReviewHandoff / block(ContractGapInput gap) | C03 / C00 / CB | 安全gap+blockedwork；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-PendingDispatch-ContractBlocked |
| PendingDispatch | Failed | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C04 / C00 / CB | 失败ref/audit/report；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-PendingDispatch-Failed |
| WaitingDecision | PendingDispatch | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-WaitingDecision-PendingDispatch |
| WaitingDecision | WaitingDecision | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-WaitingDecision-WaitingDecision |
| WaitingDecision | MatchedDecision | A | RecordGovernanceDecision / ReconcileReviewHandoff / record_decision(GovernanceDecisionBinding binding) | C11 / C00 / CB | 保存决定ref/outcome，绝不自动Listed；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-WaitingDecision-MatchedDecision |
| WaitingDecision | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-WaitingDecision-CommitUnknown |
| WaitingDecision | ContractBlocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-WaitingDecision-ContractBlocked |
| WaitingDecision | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-WaitingDecision-Failed |
| MatchedDecision | PendingDispatch | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-MatchedDecision-PendingDispatch |
| MatchedDecision | WaitingDecision | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-MatchedDecision-WaitingDecision |
| MatchedDecision | MatchedDecision | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-MatchedDecision-MatchedDecision |
| MatchedDecision | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-MatchedDecision-CommitUnknown |
| MatchedDecision | ContractBlocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-MatchedDecision-ContractBlocked |
| MatchedDecision | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-MatchedDecision-Failed |
| CommitUnknown | PendingDispatch | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-CommitUnknown-PendingDispatch |
| CommitUnknown | WaitingDecision | A | ReconcileReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C09 / C00 / CB | 原intent收敛+report；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-CommitUnknown-WaitingDecision |
| CommitUnknown | MatchedDecision | A | RecordGovernanceDecision / ReconcileReviewHandoff / record_decision(GovernanceDecisionBinding binding) | C12 / C00 / CB | unknown以正式依据收敛，不推approval；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-CommitUnknown-MatchedDecision |
| CommitUnknown | CommitUnknown | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-CommitUnknown-CommitUnknown |
| CommitUnknown | ContractBlocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-CommitUnknown-ContractBlocked |
| CommitUnknown | Failed | A | ReconcileReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C10 / C00 / CB | 保留原失败与安全retry依据；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-CommitUnknown-Failed |
| ContractBlocked | PendingDispatch | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-ContractBlocked-PendingDispatch |
| ContractBlocked | WaitingDecision | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C07 / C00 / CB | 原intent正式接收；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-ContractBlocked-WaitingDecision |
| ContractBlocked | MatchedDecision | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-ContractBlocked-MatchedDecision |
| ContractBlocked | CommitUnknown | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C08 / C00 / CB | unknownprobe责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-ContractBlocked-CommitUnknown |
| ContractBlocked | ContractBlocked | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-ContractBlocked-ContractBlocked |
| ContractBlocked | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-ContractBlocked-Failed |
| Failed | PendingDispatch | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-Failed-PendingDispatch |
| Failed | WaitingDecision | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C05 / C00 / CB | 同intent新attempt历史，非新approval；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-Failed-WaitingDecision |
| Failed | MatchedDecision | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-Failed-MatchedDecision |
| Failed | CommitUnknown | A | DispatchReviewHandoff / record_dispatch(ReviewDispatchOutcomeInput outcome) | C06 / C00 / CB | unknownprobe责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-Failed-CommitUnknown |
| Failed | ContractBlocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReviewHandoff-Failed-ContractBlocked |
| Failed | Failed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReviewHandoff-Failed-Failed |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | handoff_ref/application_ref/basis_ref固定且Current scope全匹配；dispatch正式current source/publisher/material+Gov consumer_contract，claim/fence/permission先持久；ReviewDispatchOutcomeInput::Confirmed含正式dispatch_outcome_ref，Unknown只能gap；Failed/ContractBlocked安全再发需原intentformalnotcommitted。record_decision绑定decision/application/basis/outcome/validity，经ReviewBindingPolicy(require_approved_for_listing=false)匹配；ACK/scan不可用中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | ReviewHandoff独立carrier，6variant与Step6一致，36状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
