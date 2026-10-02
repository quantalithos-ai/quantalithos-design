# Step10 U6 审计/恢复独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用OperationRecord、DeferredWork、RecoveryIntent；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| OperationRecord | OperationRecordState | idempotency / full stored replay | 进入；逐对象矩阵，非ownertruth |
| DeferredWork | DeferredWorkState | durable responsibility / technical fence | 进入；逐对象矩阵，非ownertruth |
| RecoveryIntent | RecoveryIntentState | recovery / local progress | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### OperationRecordStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `OperationRecordState`；所属domain/本地idempotency / full stored replay。Reserved samekey等待OperationInProgress/正式恢复，无blindsecondmutation；Completed只能currentdisclosure后原完整结果读取，changedintent IdempotencyConflict，不覆盖result 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u6.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u6.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local OperationRecord lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
pub enum OperationRecordState {
    /// Carries local Reserved posture; it does not establish upstream truth.
    Reserved,
    /// Carries local Completed posture; it does not establish upstream truth.
    Completed,
}
```

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Reserved | 本地预占未完成，竞争返回in-progress/reconcile | 仅下列带guard转移 | Completed |
| Completed | 原结果已保存，可typed重放，禁止重跑domain | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn reserve(input: QualifiedOperationInput) -> Result<Self, DomainError>`创建`Reserved`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Completed，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[OperationRecord]
  factory -> Reserved
  Reserved -> Completed
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | OperationContext.operation_kind/scope_ref/metadata_ref/intent_fingerprint与trusted Corecontext一致；key唯一(scope,kind,Core key bytes)，lock_operation_key后二查；StoredOperationResult.operation_ref/result_kind/schema_ref/safe_result完整读取可用，resultref匹配winning reserved IDs；必要work/audit与facts同UoW；oldReserved recovery只完整checkpoint+正式结果和全部原report依据，不能投影猜 | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Reserved；原operation/scope/key/intent一致、complete原public安全result可读；sameUoW；拟to==Completed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Reserved samekey等待OperationInProgress/正式恢复，无blindsecondmutation；Completed只能currentdisclosure后原完整结果读取，changedintent IdempotencyConflict，不覆盖result；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn complete(&mut self, result: StoredOperationResult) -> Result<(), DomainError>` | Step6完整StoredOperationResult来源+CB；全部21Command/全部12Job/get_operation_result |
| `pub fn reserve(input: QualifiedOperationInput) -> Result<Self, DomainError>` | Step6完整QualifiedOperationInput来源+CB；全部21Command/全部12Job/get_operation_result |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按OperationStorePort.find_by_key/load_operation/save_operation/load_result/append_result/load_checkpoint存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Reserved | Completed |
|---|---|---|
| Reserved | S | A |
| Completed | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Reserved | Reserved | S | find_by_key/load_operation原Reserved查询；只OperationInProgress或正式恢复，不能fullresultreplay | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-OperationRecord-Reserved-Reserved |
| Reserved | Completed | A | 全部Command/Job flow / complete(StoredOperationResult result) | C01 / C00 / CB | domain或局部report+audit+result+requiredwork原子；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-OperationRecord-Reserved-Completed |
| Completed | Reserved | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-OperationRecord-Completed-Reserved |
| Completed | Completed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-OperationRecord-Completed-Completed |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | OperationContext.operation_kind/scope_ref/metadata_ref/intent_fingerprint与trusted Corecontext一致；key唯一(scope,kind,Core key bytes)，lock_operation_key后二查；StoredOperationResult.operation_ref/result_kind/schema_ref/safe_result完整读取可用，resultref匹配winning reserved IDs；必要work/audit与facts同UoW；oldReserved recovery只完整checkpoint+正式结果和全部原report依据，不能投影猜中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | OperationRecord独立carrier，2variant与Step6一致，4状态对完整；没有外部approval或全局state |
| factory/member/flow | 2既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### DeferredWorkStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `DeferredWorkState`；所属domain/本地durable responsibility / technical fence。Pending无自动send；Blocked无automaticretry；Settled只原report。Claimed→Claimed不是普通S，是显式A新probe-only fence；expiry不是外部notcommit 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u6.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u6.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local DeferredWork lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Pending | 耐久责任未claim | 仅下列带guard转移 | Claimed/Blocked |
| Claimed | 已有worker/fence，进程崩溃不代表effect失败 | 仅下列带guard转移 | Settled/Blocked/Claimed |
| Settled | 本地结果/report持久化完成，非外部全局成功 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |
| Blocked | 合同/unknown/人工依据阻塞；有据原意图恢复 | 仅下列带guard转移 | Claimed |

#### factory、恢复与终态

`pub fn schedule(input: DurableResponsibilityInput) -> Result<Self, DomainError>`创建`Pending`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Settled，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[DeferredWork]
  factory -> Pending
  Pending -> Claimed
  Pending -> Blocked
  Claimed -> Settled
  Claimed -> Blocked
  Blocked -> Claimed
  Claimed -> Claimed
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | DurableResponsibilityInput.target_ref/effect_intent/fence非空typedplan且origin operation真实sameTx；WorkClaimInput.fence.work_ref/generation/expiry当前CAS与Clock；Blocked重claim需formal recovery/currentgate，expiredClaimed仅Reconcile probe-only（同self A），旧许可仍原externalintent。WorkSettlementInput.result_ref实际完整report已捕获同B，无dangling本work责任或durable successor已承接；work拟保存state/report一致 | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Pending；当前worker正式范围、typed原target/intent、CASfence；拟to==Claimed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Pending；缺contract/plan/权限，未派发；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Claimed；完整itemreport/result已存，无悬空本work责任；externalunknown若有后继责任必须已durable承接；拟to==Settled；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Claimed；externalunknown/probe缺失/typed来源缺口；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Blocked；正式恢复依据/currentgate；原dispatch可能发生先probe，只有明确未发才send；拟to==Claimed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C06 | C00 + CB；loadedstate==Claimed；旧lease失效且typedinspection决定probe-only；禁止第二dispatch许可；拟to==Claimed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Pending无自动send；Blocked无automaticretry；Settled只原report。Claimed→Claimed不是普通S，是显式A新probe-only fence；expiry不是外部notcommit；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn claim(&mut self, input: WorkClaimInput) -> Result<(), DomainError>` | Step6完整WorkClaimInput来源+CB；全部12Job/request_market_recovery |
| `pub fn settle(&mut self, input: WorkSettlementInput) -> Result<(), DomainError>` | Step6完整WorkSettlementInput来源+CB；全部12Job/request_market_recovery |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | Step6完整ContractGapInput来源+CB；全部12Job/request_market_recovery |
| `pub fn schedule(input: DurableResponsibilityInput) -> Result<Self, DomainError>` | Step6完整DurableResponsibilityInput来源+CB；全部12Job/request_market_recovery |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按WorkStorePort.load_work/save_work/claim/load_plan/get_permission/append_permission; OperationStorePort.load_checkpoint存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Pending | Claimed | Settled | Blocked |
|---|---|---|---|---|
| Pending | S | A | R | A |
| Claimed | R | A | A | A |
| Settled | R | R | S | R |
| Blocked | R | A | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Pending | Pending | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Pending-Pending |
| Pending | Claimed | A | 各Dispatch/Reconcile/Refresh/Rebuild/Recovery Job / claim(WorkClaimInput input) | C01 / C00 / CB | 持久claim，不证明externalaccepted；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Pending-Claimed |
| Pending | Settled | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Pending-Settled |
| Pending | Blocked | A | 各对应Job / block(ContractGapInput gap) | C02 / C00 / CB | 安全gap/fullreport；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Pending-Blocked |
| Claimed | Pending | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Claimed-Pending |
| Claimed | Claimed | A | 所属Reconcile Job / claim(WorkClaimInput input) | C06 / C00 / CB | CAS新claim只核对原effect；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Claimed-Claimed |
| Claimed | Settled | A | 各对应Job / settle(WorkSettlementInput input) | C03 / C00 / CB | localsettlement，不外部全局成功；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Claimed-Settled |
| Claimed | Blocked | A | 各对应Job / block(ContractGapInput gap) | C04 / C00 / CB | 保留原intent与对账责任，无自动retry；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Claimed-Blocked |
| Settled | Pending | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Settled-Pending |
| Settled | Claimed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Settled-Claimed |
| Settled | Settled | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Settled-Settled |
| Settled | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Settled-Blocked |
| Blocked | Pending | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Blocked-Pending |
| Blocked | Claimed | A | RunMarketRecovery及所属Job / claim(WorkClaimInput input) | C05 / C00 / CB | 同intent新fence/追加历史；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Blocked-Claimed |
| Blocked | Settled | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-DeferredWork-Blocked-Settled |
| Blocked | Blocked | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-DeferredWork-Blocked-Blocked |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | DurableResponsibilityInput.target_ref/effect_intent/fence非空typedplan且origin operation真实sameTx；WorkClaimInput.fence.work_ref/generation/expiry当前CAS与Clock；Blocked重claim需formal recovery/currentgate，expiredClaimed仅Reconcile probe-only（同self A），旧许可仍原externalintent。WorkSettlementInput.result_ref实际完整report已捕获同B，无dangling本work责任或durable successor已承接；work拟保存state/report一致中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | DeferredWork独立carrier，4variant与Step6一致，16状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### RecoveryIntentStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `RecoveryIntentState`；所属domain/本地recovery / local progress。Requested/Running只显式无变化读取或typed本地进度；Blocked不能无据回Running；Completed只原report，不systemready 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u6.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u6.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local RecoveryIntent lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Requested | 恢复请求局部受理 | 仅下列带guard转移 | Running/Blocked |
| Running | 按原intent或qualified重建计划执行 | 仅下列带guard转移 | Completed/Blocked |
| Completed | 本次本地report成立，不宣称业务恢复/ready | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |
| Blocked | 无probe/authority/typed输入，不盲修复 | 仅下列带guard转移 | Running |

#### factory、恢复与终态

`pub fn request(input: RecoveryRequestInput) -> Result<Self, DomainError>`创建`Requested`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Completed，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[RecoveryIntent]
  factory -> Requested
  Requested -> Running
  Requested -> Blocked
  Running -> Completed
  Running -> Blocked
  Blocked -> Running
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | RecoveryRequestInput.target_ref typed原target/authority_ref正式owner授权；QualifiedRecoveryInput authority/target/inspection与RecoveryPolicy.evaluate require_original_intent=true匹配；RecoveryOutcomeInput.Completed/Blocked result_ref均本次reserved结果，完整MarketJobReport逐item/gap/durable责任同B保存。未知或no-probe不能强Completed；manualbasis必须正式not opaque text | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Requested；currentoperatorauthority+typed目标/原intent检查；拟to==Running；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Requested；无qualifiedtyped输入/权限/probe正式basis；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Running；本次逐itemreport完整、local职责成立，不能压平unknown；拟to==Completed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Running；无probe/manualbasis或恢复结果无法证明；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Blocked；正式依据补齐，仍原intent/currentgate；拟to==Running；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Requested/Running只显式无变化读取或typed本地进度；Blocked不能无据回Running；Completed只原report，不systemready；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn begin(&mut self, input: QualifiedRecoveryInput) -> Result<(), DomainError>` | Step6完整QualifiedRecoveryInput来源+CB；request_market_recovery/run_market_recovery/get_recovery_progress |
| `pub fn record(&mut self, input: RecoveryOutcomeInput) -> Result<(), DomainError>` | Step6完整RecoveryOutcomeInput来源+CB；request_market_recovery/run_market_recovery/get_recovery_progress |
| `pub fn request(input: RecoveryRequestInput) -> Result<Self, DomainError>` | Step6完整RecoveryRequestInput来源+CB；request_market_recovery/run_market_recovery/get_recovery_progress |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_recovery/save_recovery; WorkStorePort.load_plan; OperationStorePort.load_checkpoint存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Requested | Running | Completed | Blocked |
|---|---|---|---|---|
| Requested | S | A | R | A |
| Running | R | S | A | A |
| Completed | R | R | S | R |
| Blocked | R | A | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Requested | Requested | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Requested-Requested |
| Requested | Running | A | RunMarketRecovery / begin(QualifiedRecoveryInput input) | C01 / C00 / CB | localprogress/audit/report；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Requested-Running |
| Requested | Completed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Requested-Completed |
| Requested | Blocked | A | RunMarketRecovery / record(RecoveryOutcomeInput input) | C02 / C00 / CB | safegap/fullreport；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Requested-Blocked |
| Running | Requested | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Running-Requested |
| Running | Running | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Running-Running |
| Running | Completed | A | RunMarketRecovery / record(RecoveryOutcomeInput input) | C03 / C00 / CB | reportref/audit/result，非业务ready；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Running-Completed |
| Running | Blocked | A | RunMarketRecovery / record(RecoveryOutcomeInput input) | C04 / C00 / CB | 保留旧目标与缺口，不修owner；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Running-Blocked |
| Completed | Requested | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Completed-Requested |
| Completed | Running | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Completed-Running |
| Completed | Completed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Completed-Completed |
| Completed | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Completed-Blocked |
| Blocked | Requested | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Blocked-Requested |
| Blocked | Running | A | RunMarketRecovery / begin(QualifiedRecoveryInput input) | C05 / C00 / CB | 追加恢复历史，原unknown先probe；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Blocked-Running |
| Blocked | Completed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-RecoveryIntent-Blocked-Completed |
| Blocked | Blocked | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-RecoveryIntent-Blocked-Blocked |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | RecoveryRequestInput.target_ref typed原target/authority_ref正式owner授权；QualifiedRecoveryInput authority/target/inspection与RecoveryPolicy.evaluate require_original_intent=true匹配；RecoveryOutcomeInput.Completed/Blocked result_ref均本次reserved结果，完整MarketJobReport逐item/gap/durable责任同B保存。未知或no-probe不能强Completed；manualbasis必须正式not opaque text中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | RecoveryIntent独立carrier，4variant与Step6一致，16状态对完整；没有外部approval或全局state |
| factory/member/flow | 3既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
