# Step10 U1 来源/发布责任独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用PublisherRelation、SourceVerification；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| PublisherRelation | PublisherRelationState | business / publisher relation | 进入；逐对象矩阵，非ownertruth |
| SourceVerification | SourceVerificationState | source/reference qualification | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### PublisherRelationStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `PublisherRelationState`；所属domain/本地business / publisher relation。Bound只能读取或正式无变化本地关联；Released只原结果/历史，不回Bound或重验publishertruth 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u1.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u1.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local PublisherRelation lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
pub enum PublisherRelationState {
    /// Carries local Bound posture; it does not establish upstream truth.
    Bound,
    /// Carries local Released posture; it does not establish upstream truth.
    Released,
}
```

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Bound | 本地关联有效，后续当前授权仍复核 | 仅下列带guard转移 | Released |
| Released | 本地关联解除，不反写主体truth | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn bind(input: QualifiedPublisherInput) -> Result<Self, DomainError>`创建`Bound`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Released，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[PublisherRelation]
  factory -> Bound
  Bound -> Released
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | QualifiedPublisherInput.relation_ref/principal_ref/authority_ref/scope_ref来自IDPort与PublisherAuthorityPort.resolve_publisher；AuthorityDispositionInput.authority_ref/reason_ref/verification_refs来自正式authorize_operation和typed verification关联；SourceVerification.publisher_ref必须等relation_ref；UnitOfWork.lock_publisher后re-read Bound，save Exact revision | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Bound；正式解除authority，load relation revision；拟to==Released；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Bound只能读取或正式无变化本地关联；Released只原结果/历史，不回Bound或重验publishertruth；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn release(&mut self, input: AuthorityDispositionInput) -> Result<(), DomainError>` | Step6完整AuthorityDispositionInput来源+CB；bind_publisher_relation/release_publisher_relation |
| `pub fn bind(input: QualifiedPublisherInput) -> Result<Self, DomainError>` | Step6完整QualifiedPublisherInput来源+CB；bind_publisher_relation/release_publisher_relation |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_publisher/save_publisher存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Bound | Released |
|---|---|---|
| Bound | S | A |
| Released | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Bound | Bound | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-PublisherRelation-Bound-Bound |
| Bound | Released | A | ReleasePublisherRelation / release(AuthorityDispositionInput input) | C01 / C00 / CB | 保存relation、audit/result及依赖verification失效责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-PublisherRelation-Bound-Released |
| Released | Bound | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-PublisherRelation-Released-Bound |
| Released | Released | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-PublisherRelation-Released-Released |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | QualifiedPublisherInput.relation_ref/principal_ref/authority_ref/scope_ref来自IDPort与PublisherAuthorityPort.resolve_publisher；AuthorityDispositionInput.authority_ref/reason_ref/verification_refs来自正式authorize_operation和typed verification关联；SourceVerification.publisher_ref必须等relation_ref；UnitOfWork.lock_publisher后re-read Bound，save Exact revision中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | PublisherRelation独立carrier，2variant与Step6一致，4状态对完整；没有外部approval或全局state |
| factory/member/flow | 2既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### SourceVerificationStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `SourceVerificationState`；所属domain/本地source/reference qualification。Pending/Qualified/Blocked仅typed现状或原完整结果；Qualified/Blocked仍允许明确依赖Invalidated，不在同record重走qualification。新核验新verification_ref 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u1.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u1.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local SourceVerification lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Pending | 待本次核验，不供新positive | 仅下列带guard转移 | Qualified/Blocked/Invalidated |
| Qualified | 本次固定输入合格，非永久授权 | 不回初始；只允许矩阵明确后续失效/读取 | Invalidated |
| Blocked | 缺失/不支持/冲突/失败安全缺口 | 不回初始；只允许矩阵明确后续失效/读取 | Invalidated |
| Invalidated | 旧核验不再可用；新核验另建记录 | 不回初始；只允许矩阵明确后续失效/读取 | guarded读取/原结果 |

#### factory、恢复与终态

`pub fn start(input: SourceVerificationInput) -> Result<Self, DomainError>`创建`Pending`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。终态（或不再重核本记录的结论态）：Qualified/Blocked/Invalidated，只有下面矩阵明确A仍合法；否则新对象/新intent。

#### ASCII状态图

```text
[SourceVerification]
  factory -> Pending
  Pending -> Qualified
  Pending -> Blocked
  Pending -> Invalidated
  Qualified -> Invalidated
  Blocked -> Invalidated
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | SourceVerificationInput.publisher_ref/source_candidate.scope_ref与Bound relation全匹配；SourceGatePolicy.evaluate正式SourceBinding ownerref/version/digest/visibility/eligibility、MaterialReference.binding/applicability、CurrentAuthorityInput.publisher_ref/scope_ref；QualificationOutcomeInput全payload+实际outcome sidecar；invalidate的outcome_ref/reason必须真实本地persist且Publisher Released | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Pending；SourceGatePolicy全部正式binding/材料/authority匹配；outcome来自qualifiedport；拟to==Qualified；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Pending；正式缺口/unsupported/missing/conflict，safeoutcome可回指；拟to==Blocked；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Pending；关联relation释放的正式局部失效依据；拟to==Invalidated；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Qualified；关联relation已释放且依赖映射typed；拟to==Invalidated；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Blocked；旧过程依赖releasedrelation；拟to==Invalidated；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Pending/Qualified/Blocked仅typed现状或原完整结果；Qualified/Blocked仍允许明确依赖Invalidated，不在同record重走qualification。新核验新verification_ref；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn record(&mut self, outcome: QualificationOutcomeInput) -> Result<(), DomainError>` | Step6完整QualificationOutcomeInput来源+CB；verify_publication_source/release_publisher_relation |
| `pub fn invalidate(&mut self, input: SourceInvalidationInput) -> Result<(), DomainError>` | Step6完整SourceInvalidationInput来源+CB；verify_publication_source/release_publisher_relation |
| `pub fn start(input: SourceVerificationInput) -> Result<Self, DomainError>` | Step6完整SourceVerificationInput来源+CB；verify_publication_source/release_publisher_relation |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按MarketStorePort.load_verification/save_verification/load_qualification_outcome/append_qualification_outcome存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Pending | Qualified | Blocked | Invalidated |
|---|---|---|---|---|
| Pending | S | A | A | A |
| Qualified | R | S | R | A |
| Blocked | R | R | S | A |
| Invalidated | R | R | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Pending | Pending | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Pending-Pending |
| Pending | Qualified | A | VerifyPublicationSource / record(QualificationOutcomeInput outcome) | C01 / C00 / CB | 固定SourceBinding/MaterialReference+localaudit/result；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Pending-Qualified |
| Pending | Blocked | A | VerifyPublicationSource / record(QualificationOutcomeInput outcome) | C02 / C00 / CB | 保存Blocked与gap，禁止positive；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Pending-Blocked |
| Pending | Invalidated | A | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | C03 / C00 / CB | audit+本地资格不再使用；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Pending-Invalidated |
| Qualified | Pending | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Qualified-Pending |
| Qualified | Qualified | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Qualified-Qualified |
| Qualified | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Qualified-Blocked |
| Qualified | Invalidated | A | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | C04 / C00 / CB | audit+失效责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Qualified-Invalidated |
| Blocked | Pending | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Blocked-Pending |
| Blocked | Qualified | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Blocked-Qualified |
| Blocked | Blocked | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Blocked-Blocked |
| Blocked | Invalidated | A | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | C05 / C00 / CB | 保留旧gap/history；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Blocked-Invalidated |
| Invalidated | Pending | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Invalidated-Pending |
| Invalidated | Qualified | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Invalidated-Qualified |
| Invalidated | Blocked | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-SourceVerification-Invalidated-Blocked |
| Invalidated | Invalidated | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-SourceVerification-Invalidated-Invalidated |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | SourceVerificationInput.publisher_ref/source_candidate.scope_ref与Bound relation全匹配；SourceGatePolicy.evaluate正式SourceBinding ownerref/version/digest/visibility/eligibility、MaterialReference.binding/applicability、CurrentAuthorityInput.publisher_ref/scope_ref；QualificationOutcomeInput全payload+实际outcome sidecar；invalidate的outcome_ref/reason必须真实本地persist且Publisher Released中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | SourceVerification独立carrier，4variant与Step6一致，16状态对完整；没有外部approval或全局state |
| factory/member/flow | 3既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
