# Step10 U7 引用/snapshot/索引独立状态机审查

## 状态主语筛选前的思考

本族承接Step6完整字段与Step9独立flow，只有独立持久carrier进入矩阵。选用QualifiedReferenceSnapshot、ReadProjection；immutable refs/bindings、candidate DTO、read分类、SQL锁、UI本地状态不新增生命周期。A是合法带guard转换，S仅同状态合法无变化或明确field维护，R必拒绝；未知外效应不能靠S再发。

## 候选主语与批次

| 主语 | state字段/enum | 状态族 | 裁定 |
|---|---|---|---|
| QualifiedReferenceSnapshot | ReferenceSnapshotState | source/reference snapshot | 进入；逐对象矩阵，非ownertruth |
| ReadProjection | ReadProjectionState | projection/read maintenance | 进入；逐对象矩阵，非ownertruth |
| 本族ref/binding/read/DTO/helper | immutable或finiteclassification | 非独立生命周期 | 排除；本族carrier/原result承接，不造GlobalState |


### QualifiedReferenceSnapshotStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `ReferenceSnapshotState`；所属domain/本地source/reference snapshot。Qualified→Qualified完整正式refresh允许sameidentity更新slice；Stale重复mark_stale保留真实gap，Unavailable重复mark_unavailable no disclosedoldbody；Query不修改 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u7.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u7.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local QualifiedReferenceSnapshot lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
pub enum ReferenceSnapshotState {
    /// Carries local Qualified posture; it does not establish upstream truth.
    Qualified,
    /// Carries local Stale posture; it does not establish upstream truth.
    Stale,
    /// Carries local Unavailable posture; it does not establish upstream truth.
    Unavailable,
}
```

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Qualified | 本次影子来源匹配，仍需当前authority资格 | 仅下列带guard转移 | Stale/Unavailable |
| Stale | 旧影子明确陈旧，敏感/资格不据此放行 | 仅下列带guard转移 | Qualified/Unavailable |
| Unavailable | 无安全有效读取材料，返回缺口 | 仅下列带guard转移 | Qualified |

#### factory、恢复与终态

`pub fn capture(input: QualifiedSnapshotInput) -> Result<Self, DomainError>`创建`Qualified`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。无业务终结承诺；维护状态仅按矩阵循环。

#### ASCII状态图

```text
[QualifiedReferenceSnapshot]
  factory -> Qualified
  Qualified -> Stale
  Qualified -> Unavailable
  Stale -> Qualified
  Stale -> Unavailable
  Unavailable -> Qualified
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | QualifiedSnapshotInput.snapshot_ref/source_ref/source_version/safe_material/validity_ref来自formal currentexact consumer+scope，materialvariant与sourceclass匹配；刷新existing source identity不改，CAS+currentdisclosure。SourceRefreshFailureInput.has_safe_visible_old_material由actual旧safe material和当前披露计算，Unavailable→Stale禁止；无旧安全材料mark_unavailable | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Qualified；正式刷新失败仍有旧安全合法摘要；typedfailure不可吞；拟to==Stale；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Qualified；当前不可见/不支持/无合法安全材料；拟to==Unavailable；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Stale；formalresolver输出本体/type/version/validity完整且current可见；拟to==Qualified；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Stale；无安全oldmaterial或失去可见性；拟to==Unavailable；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Unavailable；本次formalqualifiedmaterial完整，exactconsumer/scope匹配；拟to==Qualified；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Qualified→Qualified完整正式refresh允许sameidentity更新slice；Stale重复mark_stale保留真实gap，Unavailable重复mark_unavailable no disclosedoldbody；Query不修改；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn refresh(&mut self, input: QualifiedSnapshotInput) -> Result<(), DomainError>` | Step6完整QualifiedSnapshotInput来源+CB；verify_publication_source/refresh_qualified_references/get_reference_freshness |
| `pub fn mark_stale(&mut self, input: SourceRefreshFailureInput) -> Result<(), DomainError>` | Step6完整SourceRefreshFailureInput来源+CB；verify_publication_source/refresh_qualified_references/get_reference_freshness |
| `pub fn mark_unavailable(&mut self, input: SourceRefreshFailureInput) -> Result<(), DomainError>` | Step6完整SourceRefreshFailureInput来源+CB；verify_publication_source/refresh_qualified_references/get_reference_freshness |
| `pub fn capture(input: QualifiedSnapshotInput) -> Result<Self, DomainError>` | Step6完整QualifiedSnapshotInput来源+CB；verify_publication_source/refresh_qualified_references/get_reference_freshness |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按SnapshotStorePort.load_snapshot/find_snapshot/save_snapshot; SourceOwnerPort.read_snapshot存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Qualified | Stale | Unavailable |
|---|---|---|---|
| Qualified | S | A | A |
| Stale | A | S | A |
| Unavailable | A | R | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Qualified | Qualified | S | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Qualified-Qualified |
| Qualified | Stale | A | RefreshQualifiedReferences / mark_stale(SourceRefreshFailureInput input) | C01 / C00 / CB | 旧切片+failuregap/report，禁positive资格；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Qualified-Stale |
| Qualified | Unavailable | A | RefreshQualifiedReferences / mark_unavailable(SourceRefreshFailureInput input) | C02 / C00 / CB | 保守no disclosure，不改业务truth；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Qualified-Unavailable |
| Stale | Qualified | A | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | C03 / C00 / CB | shadowtyped替换、audit/report及必要projection责任；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Stale-Qualified |
| Stale | Stale | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Stale-Stale |
| Stale | Unavailable | A | RefreshQualifiedReferences / mark_unavailable(SourceRefreshFailureInput input) | C04 / C00 / CB | explicitgap/no disclosure；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Stale-Unavailable |
| Unavailable | Qualified | A | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | C05 / C00 / CB | shadow更新，不复活Restrictedversion；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Unavailable-Qualified |
| Unavailable | Stale | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-QualifiedReferenceSnapshot-Unavailable-Stale |
| Unavailable | Unavailable | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-QualifiedReferenceSnapshot-Unavailable-Unavailable |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | QualifiedSnapshotInput.snapshot_ref/source_ref/source_version/safe_material/validity_ref来自formal currentexact consumer+scope，materialvariant与sourceclass匹配；刷新existing source identity不改，CAS+currentdisclosure。SourceRefreshFailureInput.has_safe_visible_old_material由actual旧safe material和当前披露计算，Unavailable→Stale禁止；无旧安全材料mark_unavailable中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | QualifiedReferenceSnapshot独立carrier，3variant与Step6一致，9状态对完整；没有外部approval或全局state |
| factory/member/flow | 4既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |



### ReadProjectionStateMachine

#### 独立思考、诊断与设计取舍

正式state词汇唯一来自Step6 `ReadProjectionState`；所属domain/本地projection/read maintenance。Fresh重放/readonly不隐式refresh；Stale重复安全invalidate保留gap；Rebuilding仅同frozenplan操作/readonly不得启动第二build；Unavailable保留gap，必须Rebuilding后Fresh 本机不解释ownerapproval/installed/paid/delivered/readiness；外部依赖未qualified只走明确blocked/unknown路径。

#### 状态集合与enum来源

[Step6对象](03_ddd_step_06_part_u7.md)、[共享词汇](03_ddd_step_06_shared_types.md)、[Step9本族flow](03_ddd_step_09_part_u7.md)、[完整ports](03_ddd_step_07_typed_ports.md)为关联authority。

```rust
/// Represents only the persisted local ReadProjection lifecycle.
/// It does not define upstream approval, transaction or readiness truth.
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

| 状态 | 局部作用 | 终态 / 恢复限制 | 允许操作 |
|---|---|---|---|
| Fresh | 声明cursor内的派生切片，可见性仍当前校验 | 仅下列带guard转移 | Stale/Rebuilding/Unavailable |
| Stale | 落后来源，不变成授权 | 仅下列带guard转移 | Rebuilding/Unavailable |
| Rebuilding | 独立重建工作中，不暴露半成品 | 仅下列带guard转移 | Fresh/Stale/Unavailable |
| Unavailable | 当前无合法派生读取，only声明安全fallback | 仅下列带guard转移 | Rebuilding |

#### factory、恢复与终态

`pub fn initialize(input: ProjectionCreationInput) -> Result<Self, DomainError>`创建`Stale`；其完整输入schema见Step6，ID仅IDPort，qualified字段仅formalport，不能DTO填状态。保存MustNotExist及必要audit/fullresult/work同对应flow的UoW。rehydrate从完整Row/typed读取恢复现存字段，不factory重置；illegal/部分Row为IncompleteRecord/IntegrityFailure。无业务终结承诺；维护状态仅按矩阵循环。

#### ASCII状态图

```text
[ReadProjection]
  factory -> Stale
  Fresh -> Stale
  Fresh -> Rebuilding
  Stale -> Rebuilding
  Unavailable -> Rebuilding
  Rebuilding -> Fresh
  Rebuilding -> Stale
  Rebuilding -> Unavailable
  Fresh -> Unavailable
  Stale -> Unavailable
  S: guarded same-state read / explicit field maintenance
  R: reject; no arbitrary state setter
```

#### 触发函数与字段条件authority

| condition_ref | 具体条件 / 读取面 | guard失败 |
|---|---|---|
| C00 | 当前Coreactor/ScopeResolver披露先核；samekey原result先于fresh business；mutableload的Versioned.revision唯一列与ExpectedMarketRevision::Exact，allowedpair只是必要条件，不绕过binding/fence/authority | NotVisible/NotAuthorized/IdempotencyConflict/VersionConflict；reject且不泄漏ref/count |
| CB | ProjectionCreationInput明确typedidentity+scope+committed cursor，不空body初始Fresh；ProjectionRebuildPlanInput kind/scope/projection/source_cursor/snapshot_refs/view_keys/sources非空exact，全部committedfacts+qualifiedsnapshots fixedcursor可读。ProjectionBuildOutcomeInput.items每key唯一Rendered或安全Omitted、manifest完整，当前scope+version/CAS+cursor仍等才publish_views原子Fresh；更高cursormark_stale，missing源mark_unavailable，旧index不能source | BindingMismatch/CurrentGateDenied/ContractBlocked/UnsafeMaterial/IntegrityFailure；不自造批准或证据 |
| C01 | C00 + CB；loadedstate==Fresh；正式committedsourcecursor比projection更新，typedtarget匹配；拟to==Stale；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C02 | C00 + CB；loadedstate==Fresh；kind/scope/typedview keys非空、committedfacts+qualifiedsnapshots完整固定cursor；拟to==Rebuilding；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C03 | C00 + CB；loadedstate==Stale；正式typedplan非空且sourcebound；拟to==Rebuilding；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C04 | C00 + CB；loadedstate==Unavailable；新合法plan/currentreadscope具备；拟to==Rebuilding；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C05 | C00 + CB；loadedstate==Rebuilding；完整安全shadow与固定cursor，revision/CAS匹配；无partial掩盖；拟to==Fresh；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C06 | C00 + CB；loadedstate==Rebuilding；构建期间新committedcursor变化，typedinvalidationsource；拟to==Stale；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C07 | C00 + CB；loadedstate==Rebuilding；缺材料/失败/错scope/无safeoutput；拟to==Unavailable；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C08 | C00 + CB；loadedstate==Fresh；currentdisclosure/sourceplan不具备合法read；拟to==Unavailable；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| C09 | C00 + CB；loadedstate==Stale；plan缺失/空来源或safeview无法构造；拟to==Unavailable；用上述typed读取/正式输入，不自然语言bool | 非法pair IllegalTransition；合法pair条件失败用精确safe error，Job仅可走本矩阵明确block/unknown |
| CS | Fresh重放/readonly不隐式refresh；Stale重复安全invalidate保留gap；Rebuilding仅同frozenplan操作/readonly不得启动第二build；Unavailable保留gap，必须Rebuilding后Fresh；samefingerprint原fullresult才replay；明确合法field维护用本机原函数/CAS，不新external许可 | 非identicalbinding或不同intent拒绝；不是“同state即可重发” |

| 完整对象函数签名 | 输入authority / flow |
|---|---|
| `pub fn mark_stale(&mut self, input: ProjectionInvalidationInput) -> Result<(), DomainError>` | Step6完整ProjectionInvalidationInput来源+CB；rebuild_market_read_projection/get_projection_freshness/search_marketplace_catalog |
| `pub fn begin_rebuild(&mut self, input: ProjectionRebuildPlanInput) -> Result<(), DomainError>` | Step6完整ProjectionRebuildPlanInput来源+CB；rebuild_market_read_projection/get_projection_freshness/search_marketplace_catalog |
| `pub fn publish(&mut self, input: ProjectionBuildOutcomeInput) -> Result<(), DomainError>` | Step6完整ProjectionBuildOutcomeInput来源+CB；rebuild_market_read_projection/get_projection_freshness/search_marketplace_catalog |
| `pub fn mark_unavailable(&mut self, input: ProjectionBuildFailureInput) -> Result<(), DomainError>` | Step6完整ProjectionBuildFailureInput来源+CB；rebuild_market_read_projection/get_projection_freshness/search_marketplace_catalog |
| `pub fn initialize(input: ProjectionCreationInput) -> Result<Self, DomainError>` | Step6完整ProjectionCreationInput来源+CB；rebuild_market_read_projection/get_projection_freshness/search_marketplace_catalog |

所有flow名称均能回指Step9；“全部21Command/全部12Job”是现有完整inventory集合，不产生通用新protocol。成员函数自身仅改内存对象；application按ProjectionStorePort.load_projection/find_projection/read_truth_sources/save_projection/publish_views/plan_projection存取/加锁/记录，不调用setter越矩阵。

#### 全量状态对矩阵

| From/To | Fresh | Stale | Rebuilding | Unavailable |
|---|---|---|---|---|
| Fresh | S | A | A | A |
| Stale | R | S | A | A |
| Rebuilding | A | A | S | A |
| Unavailable | R | R | A | S |

A / S / R每个组合在下一表独立绑定条件与测试。factory不是持久state pair，已单独审查；没有phase reserved transition，本boundary不得增ownerstate。

| From | To | 分类 | 触发函数 / 对应flow | 前置条件ref | 局部保存与副作用 | 非法错误 | planned测试 |
|---|---|---|---|---|---|---|---|
| Fresh | Fresh | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Fresh-Fresh |
| Fresh | Stale | A | RebuildMarketReadProjection / mark_stale(ProjectionInvalidationInput input) | C01 / C00 / CB | 只派生marker，不写business；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Fresh-Stale |
| Fresh | Rebuilding | A | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | C02 / C00 / CB | 持久维护语境/不暴露shadow；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Fresh-Rebuilding |
| Fresh | Unavailable | A | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | C08 / C00 / CB | 不泄漏旧缓存；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Fresh-Unavailable |
| Stale | Fresh | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReadProjection-Stale-Fresh |
| Stale | Stale | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Stale-Stale |
| Stale | Rebuilding | A | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | C03 / C00 / CB | 安全新shadow；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Stale-Rebuilding |
| Stale | Unavailable | A | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | C09 / C00 / CB | explicitgap，不能旧index修truth；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Stale-Unavailable |
| Rebuilding | Fresh | A | RebuildMarketReadProjection / publish(ProjectionBuildOutcomeInput input) | C05 / C00 / CB | 原子替换typedviews+sourcecursor+report；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Rebuilding-Fresh |
| Rebuilding | Stale | A | RebuildMarketReadProjection / mark_stale(ProjectionInvalidationInput input) | C06 / C00 / CB | 不发布旧shadow为Fresh；后续新scopeplan；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Rebuilding-Stale |
| Rebuilding | Rebuilding | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Rebuilding-Rebuilding |
| Rebuilding | Unavailable | A | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | C07 / C00 / CB | gap+完整逐itemreport；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Rebuilding-Unavailable |
| Unavailable | Fresh | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReadProjection-Unavailable-Fresh |
| Unavailable | Stale | R | 无合法trigger；入口/domain拒绝 | C00先披露；pair明确R，即使外部approved也不能绕过 | 全部本地mutation rollback；0accepted result/audit/work/effect，旧外效应不被回滚 | DomainError::IllegalTransition → ErrorCode::IllegalTransition | ST-ReadProjection-Unavailable-Stale |
| Unavailable | Rebuilding | A | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | C04 / C00 / CB | 显式重建不业务恢复；对应owning save Exact + audit/fullresult/requiredwork原子；0event/outbox | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Unavailable-Rebuilding |
| Unavailable | Unavailable | S | 当前typed读取 / 原完整resultreplay；CS限定的field维护 | CS / C00 | 读取/replay 0写/ID/Clock/effect；明确field维护仅owning CAS+其flowaudit/result | guard失败用已有精确safe error；不能伪成功 | ST-ReadProjection-Unavailable-Unavailable |

#### 非法转换、失败与测试口径

| 情况 | 行为与证据边界 |
|---|---|
| R或任意DTO state setter | DomainError::IllegalTransition → ErrorCode::IllegalTransition；atomicrollback，不返回accepted。API/worker safe错误不含rawowner/SQL/body |
| A但authority/binding/revision/fence失败 | 使用已定义MissingAuthority/BindingMismatch/CurrentGateDenied/FenceMismatch及Port CAS；不能利用A强填owner结果。无accepted业务audit；实际Job阻止派发可通过合法block分支记录safegap/fullreport |
| 外部effect已可能提交 | rollback本地B不等effect取消；原checkpoint/permission保留，正式原intentprobe。Expiredlease/ACK不是KnownNotCommitted |
| S/replay | 完整payload原值；current披露收缩先拒绝/隐藏，不削减原payload再说原replay；CS不能生成第二effect |
| 每个ST测试 | 按上表逐pair建立合法fixture：A逐guard缺失/错binding/rollback+成功state/effect；S sameintent副作用0且field维护只白名单；R状态不变、无result/work/ownercall。测试未执行，不生成evidence |
| 额外竞争切口 | ProjectionCreationInput明确typedidentity+scope+committed cursor，不空body初始Fresh；ProjectionRebuildPlanInput kind/scope/projection/source_cursor/snapshot_refs/view_keys/sources非空exact，全部committedfacts+qualifiedsnapshots fixedcursor可读。ProjectionBuildOutcomeInput.items每key唯一Rendered或安全Omitted、manifest完整，当前scope+version/CAS+cursor仍等才publish_views原子Fresh；更高cursormark_stale，missing源mark_unavailable，旧index不能source中的CAS、scope、cursor/fence与formal资格变化；Query writer/ID/Clock计数0；所有外部positive仍blocked |

#### 单状态机停审

| 检查 | 结论 / 后续 |
|---|---|
| 主语/enum/state词汇 | ReadProjection独立carrier，4variant与Step6一致，16状态对完整；没有外部approval或全局state |
| factory/member/flow | 5既有方法逐签名回指；negative结果按Step9 Job，原Record候选Command仅Confirmed；不借状态扩scope |
| 字段/读取/副作用 | CB与每Cxx指向完整schema/ports，owning CAS+safe audit/fullresult/necessarywork；immutablecheckpoint/manifest无新state |
| error/replay/test | IllegalTransition精确错误、S保护和逐ST planned切口齐备；只是文档内部停审，非代码/run/signoff |
| 下一动作 | 本机停审后继续本族下一carrier，再跨族审计；Step10全部完成即停，不进入11，不提交 |
