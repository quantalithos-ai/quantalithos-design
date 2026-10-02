# 03 Step 11：持久化、事务与一致性契约

## 1. Step状态

2026-10-02；full-restart / single-agent；授权完成03，不含04或实现。completed / selfcheck_done / stop_review（文档）；外部资格blocked。正式03仍historical_material。开工门：前序Step1～10文档通过、通则/中间产物/闭环§5～6、详细SOP Step11与书写规范5.10已读。

### Step内计划

| 项 | 状态 | 产物位置 |
|---|---|---|
| 输入读取 | done | §2 |
| 问题回答 | done | §3 |
| 当前诊断 | done | §4 |
| 取舍 | done | §6 |
| 存储、codec与索引 | done | §7.1～7.3 |
| Repository/UoW与恢复 | done | §7.4～7.6 |
| 复杂度与跨Step审计 | done | §7.7 |
| 候选草稿与自检 | done | §8/10 |

## 2. 本步输入

[正式01§9](../01-架构设计.md)、[正式02§10～13](../02-概要设计.md)、[Step7完整ports](03_ddd_step_07_typed_ports.md)、[Step7 application callables](03_ddd_step_07_application_callables.md)、[Step6共享Row](03_ddd_step_06_shared_types.md)、[Step9 Job A/B](03_ddd_step_09_job_execution.md)、[Step10](03_ddd_step_10_state_matrix.md)及其问题、诊断、取舍、待确认。

[Governance持久化参考](../../L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md)已读职责、logical store与事务组织适用段；只借鉴组织，不引入它的outbox、approval或archive lane。九owner正式03/必要台账恢复见flow阅读记录；SDK/Identity/Gov项目台账未找到，资格不据此补造。

## 3. SOP问题回答

1. 哪些对象本仓拥有？listing/category、publisher relation、verification、application/basis/review、market version、distribution intent/relation/attempt、disposition/impact/notice、local operation/result/audit/work/recovery。技术提交帧与计划用于承接这些事实，不产生新业务truth。
2. 哪些只是ref/snapshot/projection？SourceBinding、MaterialReference与正式外部结果binding是body-free值；qualified snapshot只保留合法切片；read views来自committed本地事实与qualified snapshot。不保存外部正文、credentials、raw扫描、支付账本。
3. Repository如何命名/输入/返回？沿Step7的typed load/save/append/find/page/scan；统一Tx，save携ExpectedMarketRevision，append不可覆盖；同ref或唯一键读取完整typed对象。不能增万能JSON读取口。
4. 哪些flow事务？21Commands单accepted UoW；12Jobs按A/B分段，外部调用在SQL事务外；16Queries只读显式rollback。accepted事实、audit、完整原result与必要durable责任同提交。JobA只reserve/claim/checkpoint/许可，不声称最终结果。
5. 锁、version、projection？PG本地唯一键+CAS+行锁；publisher→version共同序列化，提交cursor需要真实commit顺序。选择本地写事务入口的单例帧锁，随后key/publisher/version，解决reserve提前assign与B新cursor的排序，不用非事务sequence假装commit高水位。暂以串行写入正确性基线，吞吐待Q-MP-01实测；不用跨owner事务/outbox。
6. projection失败怎么办？本地业务事实不回滚；Job本身保存真实失败/gap或保留原A职责，重新从committed truth构建完整manifest。缺原result/checkpoint不能猜成功；commitunknown先读取原key，不盲重跑外效应。

## 4. 当前文档问题诊断

Step7 `assign_cursor`没有PG commit-order细则；单独sequence存在高号先commit、低号迟到被upper漏扫风险。Step9 reserve先assign且B另assign，必须统一写入口锁序，不能临时把cursor锁移到某些flow末尾。

Step6各对象`pub(crate) rehydrate`跨domain/infra crate不可见；repo需合法公共Row codec，不得infra绕校验构造。实体revision镜像和Versioned单column必须说明保存后回读/结果修订，不能result携旧revision。Step7完整read/result/checkpoint已有签名，本步不新造业务读取面。

Step4 planned migrations/infra路径已存在；本步写逻辑/物理映射及契约，不创建DDL脚本。历史03在独立结论后Step19作污染对比。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| cursor | 只有同Tx要求 | 写入口帧锁、commit顺序与source高水位分层 | 防漏扫描与自追踪循环 |
| Row/revision | 跨crate恢复与镜像未闭合 | 校验codec public、一列revision、存后结果读回 | 消除实施私有补口 |
| durable responsibility | 完整typed定义 | PK/UK/绑定、checkpoint/result/read成对 | crash恢复可定位 |
| ownership | 全部body-free | PG字段/索引/codec同样不得纳正文 | 存储不绕红线 |

## 6. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 无事务sequence/时间戳作为scan upper | 少锁 | commit顺序不确定，恢复漏项 | 拒绝 |
| PG事务帧锁+transactional counter | commit有序、rollback不可见、符合现有reserve | 全局写吞吐受限，需profile | 采用当前正确性基线；优化必须重开11/13/16 |
| 只存原结果ref或当下view | 省空间 | duplicate无法完整重放 | 拒绝 |
| 完整typed result/checkpoint+有界安全payload | 原始报告可恢复 | 存储与保留需authority | 采用；不默认GC |
| 字段级typed Row+严格版本codec | enum/optional/invariant可验证 | 维护成本 | 采用；JSONB只容纳已定义组合字段 |

## 7. 结构化中间产物

### 7.1 存储单元：数据所有权

本单元思考见§3.1～3.3、§4 Row诊断、§6 typed Row取舍。范围是infra PostgreSQL映射，不追加business对象。所有表名为planned实现契约，不是已经存在的表/迁移。

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| PublisherRelation / SourceVerification / QualificationOutcomeRecord | U1 domain/local fact | Bind/Release/Verify | qualification、publish/current gate | relation/核验/outcome/audit原子，不写Identity主体 |
| PublicationApplication / PublicationBasis / ReviewHandoff | U2 domain | Draft/Revise/Submit/Terminate/Record、review Jobs | progress、admission、reconcile | Submitted固定basis；binding嵌入review，非approval truth |
| MarketplaceListing / MarketVersion / Category | U3 domain | 五C、U5处置 | catalog/version、acquisition、impact | mutable CAS；版本source不可就地更换 |
| DistributionIntent / Relation / Attempt | U4 domain | Request/Cancel/Record、distribution Jobs | progress、impact、reconcile | intent全轴保存；relation只formal Confirmed attach；结果/late责任同B |
| WithdrawalDisposition / ImpactRecord / NoticeIntent | U5 domain | Restrict/Withdraw/Plan/Record、三个Jobs | impact/notice progress | disposition immutable，impact固定已知scope；撤回不等待notice |
| CoreContextRecord / OperationRecord / StoredOperationResult / JobCheckpoint | U6 application/local truth | 两Runner | complete replay、GetOperationResult、recovery | 原metadata/result/checkpoint完整成对；Query无context记录 |
| MarketAuditRecord / ObservationOutcomeBinding | U6 local audit/ref | accepted flow、Obs Jobs | audit/progress、observation | audit append-only；外部receipt不升级evidence |
| DeferredWork / DeferredPlan / DispatchPermission / late-impact关联 | U6 durable responsibility | Commands、Jobs | Worker/原意图reconcile | work+plan原子、permission+checkpoint同A；所有后继可恢复 |
| RecoveryIntent | U6 domain | Request/RunMarketRecovery | recovery progress | finite本地目标；不递归修Recovery/外部truth |
| QualifiedReferenceSnapshot | U7 snapshot | Verify/Refresh Jobs | gate安全切片、freshness、rebuild | state+完整safe_material/validity同保存，不是owner长期缓存授权 |
| ReadProjection / manifest / safe views | U7 derived | 初始化/重建Jobs | current-disclosure Queries | publish整套原子；不得从旧index重建 |
| 提交counter、row source frame、search vectors | infra技术记录 | UoW/store | bounded scans、dependency highwater | 不作domain状态、owner版本或approval |

### 7.2 表 / projection契约

通用mutable列：typed PK、明确scope索引列、`revision BIGINT CHECK revision>=0`、`source_sequence BIGINT`、已定义Row字段。revision上限为PG有符号64位范围，超界IntegrityFailure，不回绕；Rust u64不代表PG可存任意u64。scope从对象/本地关联解析，不能从opaque ref解析。组合字段采用严格版本codec的JSONB，拒绝unknown字段/variant，不存任意客户JSON。scope索引镜像与typed关联读取不符为IntegrityFailure。

| 存储对象 | 用途 / 完整字段来源 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|---|
| mp_publishers | PublisherRelationRow | relation_ref | scope_ref, state, relation_ref | revision |
| mp_verifications | SourceVerificationRow | verification_ref | publisher_ref, source_sequence, verification_ref | revision |
| mp_qualification_outcomes | QualificationOutcomeRecord全字段 | outcome_ref | subject/source_ref与source_sequence | immutable |
| mp_applications | PublicationApplicationRow | application_ref | draft_spec.publisher_ref, scope, state | revision唯一列 |
| mp_publication_bases | PublicationBasisRow | basis_ref | publisher_ref, scope_ref | immutable |
| mp_reviews | ReviewHandoffRow，包含完整decision_binding | handoff_ref；UK(application_ref,basis_ref) | state, application_ref | revision |
| mp_listings | MarketplaceListingRow | listing_ref | publisher_ref, category关联 | revision唯一列 |
| mp_listing_categories | category_refs有序/去重镜像 | (listing_ref,category_ref) | category_ref,listing_ref | 随listing事务替换 |
| mp_versions | MarketVersionRow | version_ref；UK(listing_ref,source_binding完整不可变身份) | listing_ref,state,version_ref；source owner/ref/version | revision唯一列 |
| mp_categories | CategoryRow | category_ref | scope_ref,parent_ref,category_ref | revision唯一列 |
| mp_distribution_intents | DistributionIntentRow | intent_ref | version_ref,consumer_ref,scope_ref,state | revision唯一列 |
| mp_distribution_relations | DistributionRelationRow含outcome_binding | relation_ref；UK(intent_ref) | version_ref,source_sequence,relation_ref | revision |
| mp_distribution_attempts | DistributionAttemptRow含outcome_binding | attempt_ref | intent_ref,source_sequence,attempt_ref；state=CommitUnknown候选索引 | revision唯一列 |
| mp_dispositions | WithdrawalDispositionRow | disposition_ref | version_ref,source_sequence,disposition_ref | immutable |
| mp_impacts | ImpactRecordRow全relation/unknown sets | impact_ref；UK(disposition_ref) | disposition_ref | revision |
| mp_notices | NoticeIntentRow全fence/outcome | notice_ref；UK(impact_ref,target_ref,channel_ref,scope_ref) | impact_ref,state,source_sequence,notice_ref | revision唯一列 |
| mp_core_contexts | CoreContextRecord，原Core actor+Command/Worker metadata | context_ref | 不提供主体认证搜索 | immutable |
| mp_operations | OperationRecordRow+Corekey派生列 | operation_ref；UK(operation_kind,scope_ref,key_bytes) | context_ref；state | revision唯一列 |
| mp_results | StoredOperationResultRow完整safe_result/schema | result_ref；UK(operation_ref) | operation_ref,result_kind | immutable |
| mp_job_checkpoints | JobCheckpoint完整request/reserved/work/fence | reserved.operation_ref | work_ref,fence.generation | immutable |
| mp_audits | MarketAuditRecordRow | audit_ref | subject_ref,scope,source_sequence,audit_ref | immutable |
| mp_observation_bindings | ObservationOutcomeBindingRow | operation_ref | scope_ref,outcome_ref | immutable matching-only |
| mp_work | DeferredWorkRow | work_ref；UK(intent_ref,target_ref) | scope,state,source_sequence,work_ref | revision唯一列 |
| mp_work_plans | DeferredPlan完整window/targets/projection_plan/audit_refs | work_ref，FK mp_work | 无隐式当前plan | immutable |
| mp_permissions | DispatchPermission全字段 | (target_ref,fence.work_ref,fence.generation) | intent_ref,version_ref | immutable |
| mp_late_impact_work | attempt/disposition/work精确关联 | (attempt_ref,disposition_ref)；UK(work_ref) | disposition_ref | immutable |
| mp_recoveries | RecoveryIntentRow | recovery_ref | target_ref,state | revision唯一列 |
| mp_snapshots | QualifiedReferenceSnapshotRow完整safe_material | snapshot_ref；UK(source_ref完整identity,scope) | scope,source_sequence,snapshot_ref | revision唯一列 |
| mp_projections | ReadProjectionRow | projection_ref；UK(kind,scope_ref) | state,source_cursor | revision唯一列 |
| mp_projection_items | 完整ProjectionBuildItem manifest含Rendered/Omitted | (projection_ref,view_key) | finite kind, safe search vector | 随publish原子替换 |
| mp_fact_versions | typed本仓Row的不可变历史镜像，供fixedupper/as-of scan | (typed subject,revision) | scope,source_sequence,typed subject,revision | immutable；与mutable save同Tx |
| mp_commit_frame | infra单例(id=1,last_sequence) | id=1 | 无domain读取入口 | transaction counter |

`source_binding完整身份`是owner_kind/contract/canonical_ref/owner_version/asset_digest/visibility_ref/eligibility_ref的typed稳定编码。市场版本不依本地SemVer字符串判唯一；若同source身份在一个listing已有版本，注册返回UniqueConflict，不upsert。外部ref不建跨仓SQL FK；本地basis/application/review、relation/intent、attempt/intent、impact/disposition、notice/impact、operation/context/result、work/plan的FK是RESTRICT，无CASCADE DELETE。Submitted和terminal历史不物理删除。

`mp_work UK(intent,target)`不是重试新intent：Distribution重试新attempt→新target，Notice/Review same-intent复用该work并走正式恢复/fence；维护续页按原Step9以新LocalWork identity保留完整window。拒绝第二个活动相同职责。

### 7.3 字段 / codec / 版本 / 搜索

| 项 | 保存规则 | 恢复读取规则 | 错误与测试 |
|---|---|---|---|
| typed ref / scalar | wrapper的现有字段逐值保存；不trim/casefold/parse opaque | 对应schema validator，保留exact值 | malformed/unknown tag拒绝，no-echo |
| enum/Optional/set | 固定schema版本，显式None不填空ref；有界集合完整保序/去重 | state-condition refs全部校验 | truncated/unknown variant/缺必需载荷IntegrityFailure |
| SourceBinding / Material / external binding | 嵌入owning Row，body-free完整保存 | getter返回完整字段，不只有ref | owner/version/digest/visibility/scope错配拒绝 |
| result/report/checkpoint | 严格codec，fullvariant+allitems+后继refs；schema_ref实际选择该codec版本 | 按kind/schema验证，不current projection补结果 | missing/wrongkind/checkpoint mismatchIntegrityFailure |
| mutable create | MustNotExist；新行revision=0，与factory一致 | getter Versioned.revision=实体显式revision镜像 | duplicate PK/UK UniqueConflict |
| mutable update | Exact(r)须等load返回；数据库CAS使revision=r+1；输入对象携r，adapter写一列新r+1 | save返回VersionedRef的新revision；后续公开snapshot要用该值或同Tx重读 | affected rows=0 VersionConflict，不能盲upsert |
| immutable append | PK不存在插入；相同原ID只能核对完整值，不更新 | 完整原值 | 不同payload同ID IntegrityFailure/UniqueConflict |
| search index | PG17 FTS simple向量+pg_trgm按safe catalog字段；title/description/tags/type/category来自已披露safe_metadata | EN/ZH字面子串语义；FTS用于英文token；中文子串trigram验证，短词literal fallback | 模式字符按literal绑定参数，不当SQL/regex；排序/性能profile待Q-MP-01 |

搜索计划：query/filter先validated，再**当前**scope/source_constraints与listing/version处置筛选，再匹配safe文本、排序、分页与同谓词count。P0搜索统一`literal-substring OR simple-FTS`，中文不是未证明的中文分词语义。候选使用index仅缩小读取集合，不决定资格。短词仍有界页/请求预算，不保证全库低延迟；在Q-MP-01测量前不得声明SLO满足。

每个domain对象的Row codec `rehydrate`须在domain crate公开且完整验证，Row类型亦公开导出。pure policy/view的Row只是校验/测试codec，不另建长期truth表。infra不可直接绕factory/rehydrate组装有非法condition字段的对象；已定义的公开codec不是新的业务Command。

存储单元停审：Row逐字段来源、PK/UK/index/revision/immutable/source-body排除已映射；尚需事务单元核对cursor、query、A/B与fake parity。候选§10.1～10.3使用本单元表及严格codec规则，不增加表外truth。

### 7.4 事务单元开工：问题、诊断与取舍

承接7.1～7.3。问题是完整表落地后如何让Frame、A/B与读面共享一个Tx，不漏掉晚提交。采用ReadWrite入口锁mp_commit_frame的单例行、READ COMMITTED加显式scope/subject锁与CAS；ReadOnly采用REPEATABLE READ READ ONLY稳定本地快照。拒绝把external calls包进Tx、非事务sequence或新表假作owner。局部锁提供本仓顺序，不保证跨owner撤销原子性；所有正式prechecks在SQL事务外，进入写段须重读本地对象并检查与已核验basis/authority的绑定。

### 7.5 Repository函数持久化语义

完整参数、关联Tx、返回与有限PortError以[Step7逐trait](03_ddd_step_07_typed_ports.md)为唯一声明；下表按函数组补SQL语义，不以简写替代正式签名。

| 函数签名入口 / 组 | 作用 | 锁 / 事务要求 | 返回 | 错误 |
|---|---|---|---|---|
| UnitOfWork.begin(mode) | 创建唯一连接Tx | RW先SELECT单例帧FOR UPDATE，RO不写不锁 | P::Tx | begin失败Unavailable |
| UnitOfWork.assign_cursor(tx) | counter按事务+1，缓存本Tx同一个frame | 已staged local rows；RW锁持有到commit | MarketSourceCursor | RO→ReadOnlyViolation、溢出→IntegrityFailure |
| UnitOfWork.current_cursor(tx) | 本地已提交snapshot高水位 | RO；不分配 | MarketSourceCursor | Unavailable |
| lock_operation_key(tx,key) | 固定kind/scope/key串行 | 帧锁后；用有界exact bytes映射advisory lock，哈希碰撞只能过度串行；UK仍判同key | () | lock超预算Unavailable |
| lock_publisher / lock_version | release/positive、withdraw/permission同row | 帧→key→publisher→version，同类多ref稳定typed排序 | () | missing由typed load判定，错误rollback |
| MarketStore load/save各mutable pair | 完整Row→validated domain/CAS | save同RW，不能自行commit；load read-your-writes | Option<Versioned<T>> / VersionedRef<R> | Missing由application映射；CAS/UK/codec有限错误 |
| load_basis/append_basis、load_disposition/append_disposition、outcome pair | 原immutable材料/处置/核验 | append在owning accepted UoW | 完整原typed fact | 不允许覆盖 |
| list_versions/page_listed_versions/list_categories、page_attempts_by_intent/page_notices_by_impact | public本地列表 | RO；过滤在分页前，listed过滤在SQL谓词内 | typed Page，Corepage token | InvalidCursor/Unavailable，无writer |
| list_*内部scans / scan_known_impact | 稳定window读取 | after<position<=upper且strict progress | ScanPage含exact复合cursor | 无skip隐式漏页；坏cursor InvalidCursor |
| OperationStore.find_by_key/load_operation/load_context | 唯一原key与metadata链 | 当前披露先于结果返回；Tx内完整read | Versioned operation / Corecontext | 缺context IntegrityFailure |
| append_result/load_result/load_by_operation | 完整原receipt/report重放 | append同accepted/B；UK(operation) | StoredOperationResult完整variant | Completed缺result或错kind IntegrityFailure |
| append_checkpoint/load_checkpoint/find_checkpoints_by_work | 冻结原Job请求与reserved IDs | A内append immutable，不overwrite | 完整JobCheckpoint | 绑定/原IDs不一致IntegrityFailure |
| AuditStore.append_audit/load_audit/list_audits | 同事实安全audit | append在same RW；list按current disclosure | 完整记录/Page | 拒绝unsafe body，不把日志当audit |
| observation binding pair | 正式receipt ref配对 | exact operation/auditset/scope；只formal确认 | 完整binding | different原binding IntegrityFailure |
| WorkStore.save/load/claim/list_pending/find_by_intent | 唯一责任与fence/CAS | claim检查expected revision与now；禁止任意续期再发 | Versioned work / ScanPage | expired/fence非法，安全阻断 |
| append_plan/load_plan、permission pair | 完整冻结计划与当次外发许可 | work+plan；A permission+checkpoint+合法begin同Tx | 完整plan/permission | 缺plan/许可不允许外发 |
| record_late_impact_work | late outcome和所有适用disposition的增量责任 | B锁同version，UK(attempt,disposition)，work+plan一并保存 | () | UK冲突只完整核对，不重复调度 |
| SnapshotStore四方法 | state+body-free material完整存取 | revision CAS、source/scope UK | Versioned snapshot | 缺body/错binding IntegrityFailure |
| ProjectionStore load/find/publish_views | state+manifest+views原子 | B同Tx replace，旧读者完整旧snapshot；禁止半Fresh | ProjectionReadSet / VersionedRef | manifest/body错配IntegrityFailure |
| plan_projection/read_truth_sources/source_cursor | 从typed owningfacts及qualified snapshots构建 | 同identity依赖谓词，upper固定，plan非空；发布前再比高水位 | 完整plan/items/cursor | 源变化Stale；源缺口Unavailable，不旧index重建 |

所有事务handle只由UnitOfWork consume一次；错误作用域统一rollback，drop是最后资源保险不是已证明rollback。commit连接断开返回Unknown，不能声称KnownNotCommitted。不得在port内隐式事务、隐式重试业务或private fake getter。

### 7.6 事务边界与一致性

#### 提交帧与依赖游标

`begin(ReadWrite)`取得mp_commit_frame行锁后，任何其他本地写Txn都不能先越过当前Txn提交。`assign_cursor`在原staged reserve/事实后将counter加1；同Tx再次调用返回同值。rollback撤销counter/各表更新，分配值没有accepted事实；需要read-your-writes时current_cursor可读同Tx值。RO current_cursor读自己的稳定已提交快照。各变更行source_sequence、audit.cursor、accepted receipt共享该frame；JobB是新的RW Tx，必须分配新result frame，不复制A cursor。

这样避免sequence高号先提交而漏低号迟到；代价是本地所有写段串行。lock时间只覆盖短SQL，无外部I/O；读不阻塞帧锁，长scan必须有界。PG与fake保持相同顺序。尚无吞吐结果，Q-MP-01不关闭。

`ProjectionStore.source_cursor(identity)`是该kind/scope依赖事实的MAX(source_sequence)，不是全局counter。四种kind的依赖谓词固定如下，不增Listing/Version等variant。全部exclude operation/context/key/checkpoint/permission/lease、projection自身与重建/刷新/observation/reconcile纯维护报告及其自audit；GetMarketAudit仍能完整读取这些安全audit。predicate用于plan/read/publish/check一致，不从last updated time推出。

| MarketProjectionKind | 本地truth source与安全snapshot来源 |
|---|---|
| Catalog | listing/category/version、关联publisher/verification及source资格safe snapshot |
| Progress | application/basis/review、distribution intent/attempt/relation及相应qualified snapshot |
| Impact | disposition/impact/notice、所涉relation/unknown attempt及相应qualified snapshot |
| Audit | accepted业务audit与recovery事实；排除以上纯维护selfaudit/report |

fixedupper的跨Txn续页不能只用当前行`source_sequence<=upper`：较早已存在行被后续更新后会移出窗口。每次mutable save同Tx追加`mp_fact_versions`的完整typed Row+scope+revision+frame；内部scan从该subject在upper内的**最新**合法版本取值，排序仍按该版本frame和typed subject，必要immutable facts直接按自身frame。Projection plan/read也使用同一as-of来源。保存的是本仓body-free事实历史，不复制owner正文，不创建新domain History对象或公共入口。无正式保留/删除authority前不GC；缺as-of镜像IntegrityFailure，不能假无项。late更新大于upper由新cursor的增量职责处理。

内部scan按`(source_sequence,typed subject)`排序；相同frame不同relation/attempt必须稳定tie-break。`scan_known_impact` union Relation和UnknownAttempt，保留variant+ref，与fixedupper/after绑定。KnownScopeComplete只指该upper的本地已知范围；late B更高cursor→include_delta→Partial+durable续责，不能claim所有安装用户。多个disposition要遍历全部适用页，预算耗尽整体rollback或保存原有正式continuation，不截断成功。

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| 21Command fresh | SQL外prechecks完成后RW | CommandRunner.finish | guard/CAS/任一必需写失败 | Corecontext/Reserved、owningfacts、sidecar、audit、完整原result、requiredwork+plan、Completed |
| Command replay/conflict | 当前authority/disclosure + RO原key | RO rollback；race RW也rollback | hidden/wrongkind/missing result | 不生成ID/cursor/audit/work，不修改旧结果 |
| 16Queries | current ScopeResolver后RO | 每出口显式rollback | 所有read/validation error | 只有读取，ID/Clock/reserve/audit/refresh/dispatch=0 |
| Job A | SQL外current gate或原intentinspection后RW | checkpoint/claim/begin/permission完毕commit | CAS/非法claim/资格缺口 | context/Reserved、原checkpoint、work claim、dispatch必要permission；维护begin如适用 |
| 外部段 | A KnownCommitted之后 | 无SQL Tx | timeout不等notcommit | 只有正式SDK dispatch/probe；原external intent不换 |
| Job B | 新RW/resultcursor，reload fence/target | JobRunner.finish | wrongbinding/旧fence/任一保存失败 | typed正式outcome或真实gap、owning state、lateimpact、audit、全item report、work settlement/block、successors+plan、Completed |
| 原Job恢复 | 原checkpoint与正式证明后RW | finish_original同B | 不能重建全部原report/后继ref | 使用原ID和完整原request；原Reserved可继续等待，不currentview填齐 |
| snapshot refresh | A后正式owner只读，无SQL外发effect | B | source/binding/safety/cursor/codec错 | safe_material+state+validity+audit/fullreport/work原子，不复活version |
| projection publish | committed typedplan/reads后B | publish_views+report+audit/work | manifest不全/重复key/sourcecursor变化 | viewset+manifest+ReadProjection同Tx；源变更不Fresh |

业务拒绝不留下成功audit/result；合法Job处理blocked/unknown的安全报告是实际处理事实，不是新业务positive。A成功B失败不能回滚owner；保留A职责，下一处理probe-only。

### 7.7 跨Step审计与fake等价

| 审计项 | 结果 / 修正 | 最小断言入口 |
|---|---|---|
| 43对象 vs physical stores | policy/view/immutable组合值没有被误造truth表；其Row仍可验证 | codec test |
| 17ports/146methods | 不新增port，仅深化UoW及typed pair的PG语义 | port conformance |
| codec crosscrate | rehydrate公开给infra，校验仍唯一；scope索引不从ref解析 | 后续独立crate编译切口，当前未run |
| revision mirror | creation0/update+1；result用save返回或同Tx完整readback | duplicate完整revision稳定 |
| 49flows | 21C accepted、16Q no-write、12J A/B/unknown与§7.6吻合 | runner failure injection |
| projection dependency cursor | 排除维护selfaudit；业务audit仍可重建；全manifest+state成对 | empty/missing/sourcechanged |
| fake durable parity | 快照读取隔离、全局写帧、UK/CAS/FK/完整codec与所有append不可覆盖同样实现；支持knownrollback/knowncommit/commitunknown故障模式 | PG vs fake conformance，不能以内存map绕公开port |
| evidence | 只实际文档核对，无DB/测试执行 | 05/06后续资格 |

事务单元停审：锁序/帧/typed完整读取/accepted A-B/unknown/partial/CAS/fake等价已闭合。性能、retention与真实ownerconsumer仍blocked。复杂度采用本文件分单元分批，无额外业务附录；完整ports/Rows/49flows继续是规范性展开来源。

## 8. 回填草稿

正式§10承接7.1归属表、7.2全store/索引、7.3 codec/revision/search、7.5逐Repository语义与7.6事务帧/A-B/只读/source高水位表；引用完整Step6 Row与Step7 ports、Step9独立flow，不复制过程诊断。所有表/迁移是planned契约，不声明已存在DB。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01保留。数据保留/删除authority与容量阈值不由本Step编数值。外部Owner/SDK正向合同未闭合不影响本地安全存储契约讨论，不表示可开始实施。

## 10. 进入下一步条件

存储索引/完整结果与checkpoint、source as-of history、A/B原子、current scope/只读、four-kind dependency cursor、revision和codec可见性逐项文档自检已完成；前序Step6/7公开codec与frame约束已回修。未执行PG/Rust测试。允许在本次授权内读取SOP Step12、规范5.11与现有错误/recovery类型；不关闭外部资格，不进入04。
