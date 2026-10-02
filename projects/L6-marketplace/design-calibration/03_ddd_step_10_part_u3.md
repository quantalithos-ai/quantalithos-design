# Step10 U3 目录/市场版本独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用MarketVersion；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| MarketVersion | MarketVersionState | business / catalog admission | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### MarketVersionStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `MarketVersionState`；所属domain/本地business / catalog admission。Staged/Listed/Restricted同state只guarded无变化或原result，不能新增许可/assetbody；Withdrawn只读/重放，不relist 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u3.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u3.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local MarketVersion lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Staged | 登记未上架，不可获取 | 仅下列带guard转移 | Listed/Restricted/Withdrawn |
| Listed | 本地可上架姿态，获取仍当前gate | 仅下列带guard转移 | Restricted/Withdrawn |
| Restricted | 本地禁新获取，恢复需新有效依据显式list | 仅下列带guard转移 | Listed/Withdrawn |
| Withdrawn | 本次marketversion处置终态；重发新marketversion/申请 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn stage(input: MarketVersionCreationInput) -> Result<Self, DomainError>`创建`Staged`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Withdrawn，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[MarketVersion]
  factory -> Staged
  Staged -> Listed
  Restricted -> Listed
  Staged -> Restricted
  Listed -> Restricted
  Staged -> Withdrawn
  Listed -> Withdrawn
  Restricted -> Withdrawn
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | MarketVersionCreationInput.listing_ref/application_ref/source_binding对应Submitted fixedbasis和listing.publisher；VersionAdmissionInput.decision_binding/current来自FreshGate.admission，currentapproved正式有效且source/material/publisher/scope全匹配；VersionAdmissionPolicy.require_approved_for_listing不可豁免。Restrict/Withdraw正式authority+WithdrawalDisposition同Tx，lock_publisher先于lock_version/CAS；Restricted→Listed必须新有效正式依据/explicitintent，Withdrawn终态 | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Staged；currentapproved与固定application/source/material/scope全匹配；currentgate+versionrevision；拟to==Listed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Restricted；新有效正式依据/当前qualification；explicitintent，旧approved不可自复活；拟to==Listed；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Staged；正式处置/资格缺口依据；sameversionserialization；拟to==Restricted；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Listed；正式失效或资格不能证明；不是外部撤销推断；拟to==Restricted；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Staged；正式撤回authority，同versionserialization；拟to==Withdrawn；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C06 | C00 + CB；loadedstate==Listed；正式撤回authority，同versionserialization；拟to==Withdrawn；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C07 | C00 + CB；loadedstate==Restricted；正式撤回依据，不等待通知/外部audit；拟to==Withdrawn；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Staged/Listed/Restricted同state只guarded无变化或原result，不能新增许可/assetbody；Withdrawn只读/重放，不relist；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn list(&mut self, input: VersionAdmissionInput) -> Result<(), DomainError>` | Step6完整VersionAdmissionInput来源+CB；register_market_version/list_market_version/restrict_market_version/withdraw_market_version |
| `pub fn restrict(&mut self, input: VersionRestrictionInput) -> Result<(), DomainError>` | Step6完整VersionRestrictionInput来源+CB；register_market_version/list_market_version/restrict_market_version/withdraw_market_version |
| `pub fn withdraw(&mut self, input: VersionWithdrawalInput) -> Result<(), DomainError>` | Step6完整VersionWithdrawalInput来源+CB；register_market_version/list_market_version/restrict_market_version/withdraw_market_version |
| `pub fn stage(input: MarketVersionCreationInput) -> Result<Self, DomainError>` | Step6完整MarketVersionCreationInput来源+CB；register_market_version/list_market_version/restrict_market_version/withdraw_market_version |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_version/save_version/load_application/load_basis/load_publisher存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Staged | Listed | Restricted | Withdrawn |
|---|---|---|---|---|
| Staged | S | A | A | A |
| Listed | R | S | A | A |
| Restricted | R | A | S | A |
| Withdrawn | R | R | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Staged | Staged | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Staged-Staged |
| Staged | Listed | A | ListMarketVersion / list(VersionAdmissionInput input) | C01 / C00 / CB | 版本+decisionbinding+audit/result+projection责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Staged-Listed |
| Staged | Restricted | A | RestrictMarketVersion / restrict(VersionRestrictionInput input) | C03 / C00 / CB | disposition+PartialImpact+impactwork/audit/result；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Staged-Restricted |
| Staged | Withdrawn | A | WithdrawMarketVersion / withdraw(VersionWithdrawalInput input) | C05 / C00 / CB | immutable处置+impactwork/audit/result；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Staged-Withdrawn |
| Listed | Staged | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-MarketVersion-Listed-Staged |
| Listed | Listed | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Listed-Listed |
| Listed | Restricted | A | RestrictMarketVersion / restrict(VersionRestrictionInput input) | C04 / C00 / CB | 局部禁新获取，durableknownimpact；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Listed-Restricted |
| Listed | Withdrawn | A | WithdrawMarketVersion / withdraw(VersionWithdrawalInput input) | C06 / C00 / CB | 停新受理/未许可派发，影响known/unknown；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Listed-Withdrawn |
| Restricted | Staged | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-MarketVersion-Restricted-Staged |
| Restricted | Listed | A | ListMarketVersion / list(VersionAdmissionInput input) | C02 / C00 / CB | 新处置历史+audit/result；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Restricted-Listed |
| Restricted | Restricted | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Restricted-Restricted |
| Restricted | Withdrawn | A | WithdrawMarketVersion / withdraw(VersionWithdrawalInput input) | C07 / C00 / CB | 同局部原子承诺；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Restricted-Withdrawn |
| Withdrawn | Staged | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-MarketVersion-Withdrawn-Staged |
| Withdrawn | Listed | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-MarketVersion-Withdrawn-Listed |
| Withdrawn | Restricted | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-MarketVersion-Withdrawn-Restricted |
| Withdrawn | Withdrawn | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-MarketVersion-Withdrawn-Withdrawn |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | MarketVersionCreationInput.listing_ref/application_ref/source_binding对应Submitted fixedbasis和listing.publisher；VersionAdmissionInput.decision_binding/current来自FreshGate.admission，currentapproved正式有效且source/material/publisher/scope全匹配；VersionAdmissionPolicy.require_approved_for_listing不可豁免。Restrict/Withdraw正式authority+WithdrawalDisposition同Tx，lock_publisher先于lock_version/CAS；Restricted→Listed必须新有效正式依据/explicitintent，Withdrawn终态中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | MarketVersion独立carrier，4variant与Step6一致，16状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
