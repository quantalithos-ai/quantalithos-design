# Step10 U4 受控分发独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用DistributionIntent、DistributionAttempt；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| DistributionIntent | DistributionIntentState | business / distribution intent | 进入；逐对象矩阵，非ownertruth |
| DistributionAttempt | DistributionAttemptState | dispatch / receiver result | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### DistributionIntentStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `DistributionIntentState`；所属domain/本地business / distribution intent。Accepted只原intent读取/replay；Cancelled再次明确无变化cancel不覆盖旧attempt，不能Accepted或消去已发生外效应 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u4.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u4.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local DistributionIntent lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
pub enum DistributionIntentState {
    /// Carries local Accepted posture; it does not establish upstream truth.
    Accepted,
    /// Carries local Cancelled posture; it does not establish upstream truth.
    Cancelled,
}
```

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Accepted | 本地受理，有耐久交接责任，非installed | 仅下列带guard转移 | Cancelled |
| Cancelled | 本地不再启动新派发，既有external结果继续对账 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn accept(input: QualifiedAcquisitionInput) -> Result<Self, DomainError>`创建`Accepted`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Cancelled，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[DistributionIntent]
  factory -> Accepted
  Accepted -> Cancelled
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | QualifiedAcquisitionInput.target/version/consumer/receiver/scope全正式，AcquisitionGatePolicy 当前Listed+approved；cancel用正式DistributionCancelInput.authority_ref/reason_ref、Core actor current consumer scope；同version serialization。Accepted不installed；Cancelled阻止新permission，保留Confirmed/Unknown attempt | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Accepted；consumer/currentscope授权；typedattempt现状；拟to==Cancelled；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Accepted只原intent读取/replay；Cancelled再次明确无变化cancel不覆盖旧attempt，不能Accepted或消去已发生外效应；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn cancel(&mut self, input: DistributionCancelInput) -> Result<(), DomainError>` | Step6完整DistributionCancelInput来源+CB；request_distribution/cancel_distribution/record_receiver_outcome |
| `pub fn accept(input: QualifiedAcquisitionInput) -> Result<Self, DomainError>` | Step6完整QualifiedAcquisitionInput来源+CB；request_distribution/cancel_distribution/record_receiver_outcome |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_intent/save_intent/get_relation_by_intent/list_attempts_by_intent存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Accepted | Cancelled |
|---|---|---|
| Accepted | S | A |
| Cancelled | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Accepted | Accepted | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionIntent-Accepted-Accepted |
| Accepted | Cancelled | A | CancelDistribution / cancel(DistributionCancelInput input) | C01 / C00 / CB | 保留旧externalresult/unknown对账，阻止未发新许可；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionIntent-Accepted-Cancelled |
| Cancelled | Accepted | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionIntent-Cancelled-Accepted |
| Cancelled | Cancelled | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionIntent-Cancelled-Cancelled |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | QualifiedAcquisitionInput.target/version/consumer/receiver/scope全正式，AcquisitionGatePolicy 当前Listed+approved；cancel用正式DistributionCancelInput.authority_ref/reason_ref、Core actor current consumer scope；同version serialization。Accepted不installed；Cancelled阻止新permission，保留Confirmed/Unknown attempt中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | DistributionIntent独立carrier，2variant与Step6一致，4状态对完整；没有外部approval或全局state |
| factory/member/flow | 2既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### DistributionAttemptStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `DistributionAttemptState`；所属domain/本地dispatch / receiver result。Confirmed必须原binding完全相等；Failed/Blocked只有原终态报告；Dispatching/CommitUnknown只原intentprobe，不能S再dispatch，prepared no-op不许可 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u4.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u4.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local DistributionAttempt lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Prepared | 尚未派发，需当前gate | 仅下列带guard转移 | Dispatching/Blocked |
| Dispatching | 已获局部dispatch许可，可能外部commit | 仅下列带guard转移 | Confirmed/Failed/CommitUnknown |
| Confirmed | 正式receiver outcome匹配，仅局部映射 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |
| Failed | 正式证明未提交失败；重试需安全原意图依据 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |
| CommitUnknown | 提交可能发生，禁止盲retry | 仅下列带guard转移 | Confirmed/Failed |
| Blocked | 派发前合同/资格不成立，不自恢复 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn prepare(input: DistributionDispatchInput) -> Result<Self, DomainError>`创建`Prepared`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Confirmed/Failed/Blocked，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[DistributionAttempt]
  factory -> Prepared
  Prepared -> Dispatching
  Prepared -> Blocked
  Dispatching -> Confirmed
  Dispatching -> Failed
  Dispatching -> CommitUnknown
  CommitUnknown -> Confirmed
  CommitUnknown -> Failed
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | DistributionDispatchInput.intent_ref/fence.work_ref等winning samework；begin CurrentDispatchGateInput.permission/current正式source/approved/receiver/currentscope且Intent Accepted/Version Listed，samepublisher→version lock/CAS。ReceiverOutcomeInput::Confirmed binding全intent/version/consumer/receiver/scope匹配，inspection对应；KnownNotCommitted只formalprobe证据；Unknown真实gap。Failed/Blocked终态，安全retry newattempt sameintent，不begin旧attempt | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Prepared；原intentAccepted、currentgate、sameversionserialize未撤回、claimfence；拟to==Dispatching；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Prepared；合同缺口/已取消/撤回/资格不成立，尚未许可；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Dispatching；formaloutcome原intent/version/consumer/receiver/scope全matching；拟to==Confirmed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Dispatching；正式证明未提交失败；拟to==Failed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Dispatching；外部timeout/原许可后crash可能commit；拟to==CommitUnknown；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C06 | C00 + CB；loadedstate==CommitUnknown；formalprobe/正式结果matching提交；拟to==Confirmed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C07 | C00 + CB；loadedstate==CommitUnknown；formalprobe证明未提交失败；拟to==Failed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Confirmed必须原binding完全相等；Failed/Blocked只有原终态报告；Dispatching/CommitUnknown只原intentprobe，不能S再dispatch，prepared no-op不许可；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn begin(&mut self, input: CurrentDispatchGateInput) -> Result<(), DomainError>` | Step6完整CurrentDispatchGateInput来源+CB；request_distribution/dispatch_distribution/reconcile_distribution/record_receiver_outcome |
| `pub fn settle(&mut self, input: ReceiverOutcomeInput) -> Result<(), DomainError>` | Step6完整ReceiverOutcomeInput来源+CB；request_distribution/dispatch_distribution/reconcile_distribution/record_receiver_outcome |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | Step6完整ContractGapInput来源+CB；request_distribution/dispatch_distribution/reconcile_distribution/record_receiver_outcome |
| `pub fn prepare(input: DistributionDispatchInput) -> Result<Self, DomainError>` | Step6完整DistributionDispatchInput来源+CB；request_distribution/dispatch_distribution/reconcile_distribution/record_receiver_outcome |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_attempt/save_attempt/load_intent/get_relation_by_intent/save_relation; WorkStorePort.get_permission存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Prepared | Dispatching | Confirmed | Failed | CommitUnknown | Blocked |
|---|---|---|---|---|---|---|
| Prepared | S | A | R | R | R | A |
| Dispatching | R | S | A | A | A | R |
| Confirmed | R | R | S | R | R | R |
| Failed | R | R | R | S | R | R |
| CommitUnknown | R | R | A | A | S | R |
| Blocked | R | R | R | R | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Prepared | Prepared | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Prepared-Prepared |
| Prepared | Dispatching | A | DispatchDistribution / begin(CurrentDispatchGateInput input) | C01 / C00 / CB | dispatch许可先持久，再externalcall；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Prepared-Dispatching |
| Prepared | Confirmed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Prepared-Confirmed |
| Prepared | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Prepared-Failed |
| Prepared | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Prepared-CommitUnknown |
| Prepared | Blocked | A | DispatchDistribution / block(ContractGapInput gap) | C02 / C00 / CB | gap/audit/fullreport；不externaldispatch；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Prepared-Blocked |
| Dispatching | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Dispatching-Prepared |
| Dispatching | Dispatching | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Dispatching-Dispatching |
| Dispatching | Confirmed | A | RecordReceiverOutcome / DispatchDistribution / ReconcileDistribution / settle(ReceiverOutcomeInput input) | C03 / C00 / CB | receiverbinding+relationoutcome+lateimpact责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Dispatching-Confirmed |
| Dispatching | Failed | A | DispatchDistribution / ReconcileDistribution / settle(ReceiverOutcomeInput input) | C04 / C00 / CB | 安全failure+原report，旧attempt终态；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Dispatching-Failed |
| Dispatching | CommitUnknown | A | DispatchDistribution / settle(ReceiverOutcomeInput input) | C05 / C00 / CB | unknown+reconcile责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Dispatching-CommitUnknown |
| Dispatching | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Dispatching-Blocked |
| Confirmed | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Confirmed-Prepared |
| Confirmed | Dispatching | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Confirmed-Dispatching |
| Confirmed | Confirmed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Confirmed-Confirmed |
| Confirmed | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Confirmed-Failed |
| Confirmed | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Confirmed-CommitUnknown |
| Confirmed | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Confirmed-Blocked |
| Failed | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Failed-Prepared |
| Failed | Dispatching | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Failed-Dispatching |
| Failed | Confirmed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Failed-Confirmed |
| Failed | Failed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Failed-Failed |
| Failed | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Failed-CommitUnknown |
| Failed | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Failed-Blocked |
| CommitUnknown | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-CommitUnknown-Prepared |
| CommitUnknown | Dispatching | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-CommitUnknown-Dispatching |
| CommitUnknown | Confirmed | A | RecordReceiverOutcome / DispatchDistribution / ReconcileDistribution / settle(ReceiverOutcomeInput input) | C06 / C00 / CB | 保存原outcome及撤回后lateimpactdelta；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-CommitUnknown-Confirmed |
| CommitUnknown | Failed | A | DispatchDistribution / ReconcileDistribution / settle(ReceiverOutcomeInput input) | C07 / C00 / CB | 旧attemptterminal，允许当前gate下原intent新attempt；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-CommitUnknown-Failed |
| CommitUnknown | CommitUnknown | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-CommitUnknown-CommitUnknown |
| CommitUnknown | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-CommitUnknown-Blocked |
| Blocked | Prepared | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Blocked-Prepared |
| Blocked | Dispatching | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Blocked-Dispatching |
| Blocked | Confirmed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Blocked-Confirmed |
| Blocked | Failed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Blocked-Failed |
| Blocked | CommitUnknown | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DistributionAttempt-Blocked-CommitUnknown |
| Blocked | Blocked | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DistributionAttempt-Blocked-Blocked |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | DistributionDispatchInput.intent_ref/fence.work_ref等winning samework；begin CurrentDispatchGateInput.permission/current正式source/approved/receiver/currentscope且Intent Accepted/Version Listed，samepublisher→version lock/CAS。ReceiverOutcomeInput::Confirmed binding全intent/version/consumer/receiver/scope匹配，inspection对应；KnownNotCommitted只formalprobe证据；Unknown真实gap。Failed/Blocked终态，安全retry newattempt sameintent，不begin旧attempt中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | DistributionAttempt独立carrier，6variant与Step6一致，36状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
