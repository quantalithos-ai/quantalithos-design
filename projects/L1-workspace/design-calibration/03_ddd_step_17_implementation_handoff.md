# Step 17. 详细设计到实施计划的承接与闭环复核

> SOP Step17；书写规范§5.16；中间产物规范§5.10；回填正式03 §16。

## 1. Step 状态

completed / pass_with_external_slots；Step16已通过。这里只交付设计承接输入，未授权实现，未创建implementation ledger或boundary skeleton。

## 2. 本步输入

本项目00/01/02及03 Step1~16；中间产物规范§5.10十项复核表、真相源闭环与可落码性标准、实施计划书写规范、Rust编码规范、目录规范、projects/README §8.2。参考governance Step17的逐字段、Query、公共传递类型与boundary前置复核，裁剪其业务truth和outbox。

## 3. SOP 问题回答

| 问题组 | 回答 |
|---|---|
| 1~3 承接和前置阅读 | §7.1/7.2固定可引用契约、标准、真实git identity观察；不引用不存在的“提交规范.md”。 |
| 4~6 字段/构造/Query | §7.3~7.5逐对象族与六Query列来源；外部slot明确blocked，不能伪闭合。 |
| 7 状态一致 | §7.6与Step10/16同名；05/06尚待生成，不假称跨未有文档已通过。 |
| 8~10 boundary/旧名/缺口 | §7.7~7.9拒绝后续证据提前消费；已修正错误、keys、配置、观测与草稿进度。 |
| 11~12 07如何承接 | 引用正式03章节和Step文件；07需重新按每个phase/commit boundary审计03/05/06/07。 |

## 4. 当前文档问题诊断

初稿只写“字段可回指”不足以支持实现审查；需要明确闭合的局部字段和未闭合外部输入。初稿列不存在standards/document/提交规范.md，现使用projects/README §8.2与实施计划规范。首批合批写入和过早完成标记作为过程偏差保留，不改写成已满足严格串行。

## 5. 改动前后对比

| 初稿 | 补审后 |
|---|---|
| 六行泛化闭环表 | 十类规定复核材料，字段、入口、Query、状态均可回源 |
| “可实现”统一判断 | 本地设计可承接，owner/driver/后续正式设计仍阻塞对应实现 |
| placeholder提交规范 | 使用已存在标准，git config只读确认 |
| 03完成=实施移交 | 07整体审计与所有planned skeleton仍是未来要求 |

## 6. 设计取舍

正式03是入口，字段级实现合同作为其明确引用部分保留在Step6/7/8/9/10/11等材料。冲突须回源一致修正，不能让实现者任选较新的文件。phase/commit划分、排期、实际证据与永久记忆种子均不在Step17新增。无需额外图，以下表表达完整承接链。

## 7. 结构化中间产物

### 7.1 真相源与承接清单

| 事实 / 承接项 | 真相源 | 后续消费者 / 处理 |
|---|---|---|
| 只读owner与需求 | 正式00 FR-WS-001~010/BR-WS-001~012；正式01 | 04~07不得改变owner/反写禁令 |
| 七CP/16对象/14入口 | 正式02 §4~10 | 03细化，不新增业务主体 |
| 七role/77计划文件 | Step4/5 | 07按文件职责裁剪boundary，计划路径不是已建源码 |
| 对象字段/状态/函数 | Step6-A/B/C、Step7 callable | 实施必须完整读取，不从正式摘要自补字段 |
| DTO/结果/receipt与14flow | Step8/9 | 05/06覆盖正/负；07同boundary具备可调用面 |
| 局部事务与版本 | Step10/11/13 | durable/fake遵同语义，WS-LOCAL-001未验证 |
| 错误、安全输出 | Step8/12 | 映射一致，日志不暴露内部错误 |
| 配置与观测 | Step14/15 | 04选择绑定与数值；05验证限额/密钥/redaction |
| 最小测试切口 | Step16 | 05补用例/环境，06补验收，07补required checks |
| 外部输入 | owning正式文档，Step6-A slot登记 | owner关闭后重新校准受影响字段/port/flow；workspace不造truth |

### 7.2 实施前置阅读

| 文档 / 检查 | 目的 / 观察上限 |
|---|---|
| 本项目正式00/01/02/03（装配后）及每章校准来源 | 需求→对象→协议→flow→状态全链 |
| standards/document/设计真相源闭环与可落码性标准.md | 字段、权限、ref、事务、phase与证据门禁 |
| standards/document/设计文档讨论中间产物规范.md §5.10 | 十项闭环复核，不跳过字段和公开类型 |
| standards/document/实施计划书写规范.md | 07整体移交、implementation ledger与全部planned skeleton |
| standards/document/子项目目录与代码文件组织规范.md | package/crate/bin/member路径、测试发现 |
| standards/coding/rust.md | Rust标识符/rustdoc/注释英文、类型和测试规范 |
| projects/README.md §8.2 | 设计仓中文主题/实现仓英文、scope、body/footer规则 |
| git config user.name / user.email | 本轮设计仓只读观察为quantalithos-labs / quantalithos.ai@gmail.com；不能代表未建实现仓 |
| Core实际crate/exports与所属owner正式契约 | sibling path/精确符号/版本核验；无伪tag/rev |
| 后续正式04/05/06/07与当时台账 | 均未在本轮生成；正式实施前必读且完成门禁 |

目标实现仓计划为/home/aris/Projects/quantalithos-workspace；Step3记录未发现，本轮不创建，不将目录计划当实现基线。编码planned Rust2024/MSRV1.93；精确依赖pin未验证。用户未要求commit，本轮不提交。

### 7.3 字段闭环表

字段全集由Step6各卡片给出，以下列构造必需与条件字段组；不删除卡片中的任何字段。测试引用Step16切口，所有实际验收证据待06/执行期，当前无EV别名。

| Domain对象 / 字段 | 类型 | 来源与构造入口 | 缺失处理 | 测试 / 验收 |
|---|---|---|---|---|
| WorkspaceScope kind/anchor/resolution_ref/principal | ScopeKind/OwnerScopeRef/OwnerResolutionRef/ActorId | ScopeResolverPort.resolve→from_resolution | 005 blocked；不能解析string | scope/visibility切口；待06 |
| WorkspacePartition partition_id/principal/scope/partition_version/current_generation | WorkspacePartitionId/ActorId/WorkspaceScope/PartitionVersion/Option<GenerationId> | IdPort+Core actor+resolver→provision；store提交version1 | 无scope拒绝；current None合法 | Provision；待06 |
| SourceSlice owner/scope/items/version_basis/visibility | SourceOwner/WorkspaceScope/Vec<SafeSourceItem>/SourceVersionBasis/VisibilityBinding | OwnerReadPort+VisibilityPort→from_owner | 001/003 blocked，禁止raw body | safe query/apply；待06 |
| VisibilityBinding decision_refs/principal/scope/subject_binding/validity_basis | owner formal typed refs | bind_result/bind_subject/from_resolution | 缺现时决定fail-closed | 每次读撤权；待06 |
| PartitionProjection partition_id/generation_id/view_revision/source_slices/inbox_items/coverage | 本地ID/ViewRevision/SourceSlice/InboxItem/SourceCoverage集合 | empty_candidate→apply、mark_gap、invalidate | 无正式来源不能Complete | apply原子；待06 |
| SourceCoverage source/applied_cursor/watermark/coverage_state/gap_ref/coverage_proof | CoverageState及Option owner basis/GapRef | owner advance/mark_gap/invalidate | 缺bridge不推进；Invalidated终态 | 五状态；待06 |
| SourceApplicationRecord application_key/input_digest/outcome/result_ref/cursor_basis/view_revision | 完整Ksrc/SafeInputDigest/TerminalApplyDisposition等 | source验证→record→apply_source同事务 | Gap/Unknown不构造terminal | duplicate/late/gap；待06 |
| InboxItem item_id/source_attention_ref/attention_version/attention_state/source_ref/generation_id/source_application_ref | InboxItemId/AttentionState/owner ref/ApplicationResultRef | OwnerAttentionInput→derive/apply_attention | 004 blocked；baseline ref须binding | 两attention状态；待06 |
| LocalAttentionState partition_id/principal/local_revision/read_cursors/dispositions/preferences/last_opened/focus | LocalRevision、按stream集合及Step6 typed值 | 明确Change→initialize/change | 无local Query只Absent；可空值不写默认 | local/cutover隔离；待06 |
| ReadCursor stream/read_basis/unread_overrides/intent_revision | AttentionStreamRef/Option<AttentionReadBasis>/id集合/LocalRevision | 明确ReadIntent与AttentionIdentityResolution→apply | 不可比较拒绝；无relation分类Unknown | 多stream/override；待06 |
| WorkspaceOperationRecord operation_key/request_digest/result/result_ref/partition_ref/revision_basis | Kop/SafeInputDigest/WorkspaceOperationRef/StoredWorkspaceResult | 对应flow tentative committed工厂→store确认 | 已存结果不可重算 | six writes+失效replay；待06 |
| RebuildAttempt attempt_id/partition_id/mode/candidate_generation/attempt_version/status/failure_basis/baseline_basis/continuation/replacement/expected_partition_version | Step6-B完整typed字段 | Request生成，Advance/失效/替代提供条件字段 | Blocked/Failed必failure；Superseded必replacement | 九状态；待06 |
| GenerationState generation_id/partition_id/role/safety_state/invalidation_refs/validated_revision/cutover_basis | 两enum、Option<ViewRevision/CutoverBasis>、失效引用集合 | candidate→validate/promote/retire/invalidate | 无完整basis不得切换 | 双轴；待06 |
| InvalidationRecord invalidation_id/target/basis/safety_effect/operation_ref | 本地id/ExistingWorkspaceTargetSet/InvalidationBasis/WorkspaceOperationRef | 正式owning basis→record；单partition事务 | 未知/无权零业务写 | DataStale/SafetyBlocked；待06 |
| WorkspaceReadView scope/read_basis/items/provenance/freshness/coverage/next_cursor | Step6-C WorkspaceReadInputs全部字段 | 只读port+现时决定→compose | 安全未知无内容；新鲜度未知可Unknown | 六Query；待06 |
| WorkspacePageCursor principal/partition_id/generation_id/view_revision/local_revision/query_binding/visibility_basis/position | Step6-B八字段typed合同 | 已授权排序结果+全绑定轴→工厂/codec | owner codec未闭合blocked；错轴CursorInvalid | token与no-write；待06 |

### 7.4 DTO/Event/Job构造闭环

| 输入协议 | 目标对象 / 构造 | 来源 / 不得混同 | 缺失与对应flow |
|---|---|---|---|
| ProvisionWorkspacePartition | Scope+Partition+OperationRecord | actor从宿主，scope由resolver，ID由IdPort | 缺005拒绝；Step9 ProvisionFlow |
| ChangeWorkspaceLocalState | LocalAttentionState+ReadCursor+OperationRecord | expected来自请求；attention关系从owner；query不生成意图 | 004/005 blocked；ChangeLocalFlow |
| ConsumeSourceChange | SourceSlice/Coverage/Inbox/Projection/SourceApplicationRecord | source identity≠delivery；owner cursor≠view revision | 001~004 blocked；ConsumeSourceChangeFlow |
| ConsumeSourceInvalidation | InvalidationRecord+target safety/coverage+operation | source认证actor≠业务target principal | 002/003/005 blocked；逐partition flow |
| RequestWorkspaceRecovery | Attempt+Candidate+empty projection+operation | 新ID≠新授权；已存partition | 缺scope拒绝；RequestFlow |
| AdvanceWorkspaceRecovery | baseline/catch-up/validate或cutover各对象 | 正式baseline≠旧projection；commit≠业务Completed | 缺接续/效力blocked；AdvanceFlow |
| SupersedeWorkspaceRecovery | 原attempt与operation | replacement须已存在、同partition、不成环 | 不满足Conflict；SupersedeFlow |
| InvalidateWorkspaceView | InvalidationRecord及target snapshots | DataStale≠SafetyBlocked | 无依据拒绝；InvalidateFlow |

各行均复用Step8完整DTO和Step7完整工厂/port签名，非本表字段足够即允许编码。所有unknown先resolve_commit，stored结果与效果同事务。

### 7.5 Query与公开传递类型闭环

| Query | Response / 关键字段 | 来源与空/不可见规则 | ID/页 / 测试 |
|---|---|---|---|
| GetWorkspaceView | WorkspaceViewResponse scope/basis/availability/visibility/freshness/coverage/items/provenance/page | source safe slice或current snapshot；empty也须list决定 | Materialized全轴；Transient无durable token；Step16同名 |
| ListWorkspaceInbox | WorkspaceInboxResponse及WorkspaceInboxItemView/read/flags/page | 可见Present+局部意图+owner relation；无local仍零写 | 稳定InboxItemId跨generation保留；local变化页失效 |
| GetWorkspaceLocalState | WorkspaceLocalStateResponse scope/state | LocalStateSurface Absent/Present来自已存overlay | 主体仍先授权；无snapshot写 |
| GetWorkspaceOperationResult | WorkspaceOperationResponse operation_ref/result | immutable原结果；不可公开任一ref则整体拒绝 | operation_by_ref须partition；不重新构造 |
| GetWorkspaceRecoveryStatus | WorkspaceRecoveryResponse version/status/role/safety/current/failure/replacement | recovery_snapshot；条件字段按状态 | attempt/current分轴；零Advance |
| ExportWorkspaceReadModel | WorkspaceExportResponse read_model/schema_version | 同safe read合同，schema_version=1 | Export QueryKind独立，006未闭合无archive承诺 |

| Public surface | 二级类型 / 正式归属 | schema来源 / 禁止 |
|---|---|---|
| Command/Operations结果 | WorkspaceWriteResult、WriteDelivery、StoredWorkspaceResult及refs；contracts | Step8 §7.2、Step6-A；不import domain实体 |
| Consumer输入/结果 | Step8两Request/receipt/SourceInvalidationPageReceipt | 正式source envelope仍owner slot；receipt不表示ACK |
| Query页 | WorkspacePageRequest/Info/Token、WorkspaceReadBasis、LocalReadBasis | Step8/6-A，token=codec输出，不作owner cursor |
| Query安全结果 | SafeWorkspaceItem/SafeProvenance/owner ref | 001/003/005未闭合；不任意JSON代替 |
| Recovery结果 | RebuildStatus/GenerationRole/Safety、RecoveryFailureBasis、replacement ref | Step6-A/8/10；failure载荷条件保留 |
| 技术carrier | snapshots/commits/CutoverBasis/BaselineApplicationBinding | Step6-C/7/11；只仓内，不升级public archive schema |

### 7.6 状态闭环

| 状态 | 正式值 / 触发 | 禁止 / 下游测试 |
|---|---|---|
| CoverageState | Unknown/Partial/Complete/Gap/Invalidated；advance/mark_gap/invalidate | Invalidated不解除，Step16五状态 |
| AttentionState | Present/Withdrawn；derive/apply_attention | 无owner reopen不复活 |
| RebuildStatus | Requested/Baselining/CatchingUp/Validating/Ready/Completed/Blocked/Failed/Superseded | 四终态不复活；九状态逐行Step10/16 |
| GenerationRole | Candidate/Current/Retired；promote/retire | 无rollback到Retired |
| GenerationSafetyState | Unverified/Validated/SafetyBlocked；validate/invalidate | 安全失效在该generation终态 |
| Read与entry分类 | Step10 §7.7~7.11原名 | 不建global状态；05/06待按原名映射 |

### 7.7 Phase / commit与验收承接

| 当前边界 | 可承接 | 明确排除 / 前置 | 测试与验收 |
|---|---|---|---|
| 03设计输出 | 对象、ports、14 flow、状态、事务、配置/观测、切口 | 不拆PH/commit，不引用未来真实证据 | Step16 planned，06未生成 |
| 未来07 planned boundary | 引用正式03及对应Step；逐boundary allowed_scope/required checks | 04/05/06完成、owner slot按影响关闭；不能依赖后续boundary才生成结果 | 每boundary映射真实05/06，当前不填假ID |
| 未来implementation ledger与全部skeleton | 用户明确要求在07完成时同时创建 | 当前03不创建；未来只能planned/blocked/waiting | 禁止伪commit/run/verdict/signoff/readiness |
| artifact materialization | 当前export仅read response | 没有artifact writer/report generator/archive package | 不适用业务artifact；测试证据规则由05~07闭合 |

需求验收输入映射：FR-WS-001/002→scope/visibility；003/005/006→read model；004→source原子/次序；007/008→Inbox/local；009→recovery；010→export。各组对应Step16同名切口；正式AC/EV尚未创建，不能宣称覆盖已执行。

### 7.8 命名一致性

| 正式名称 | 不采用旧名 / 用法 | 状态 |
|---|---|---|
| OwnerReadPort / VisibilityPort | 02/Step4历史OwnerSourcePort/VisibilityResolverPort | Step7已收敛；02骨架名仅历史映射 |
| WorkspaceReadPort / WorkspaceAtomicStore | 全能WorkspaceStorePort注入Query | 已拆能力面 |
| read_cursors | LocalAttentionState单read_cursor | 02局部回源已修 |
| AttemptVersion / ViewRevision / PartitionVersion / LocalRevision | 统一version、source offset、wall clock互替 | 独立typed轴 |
| OutcomeUnknown / Pending | Failed/NotCommitted混用 | Step11/12统一 |
| workspace-<role> / workspace_<role> | l1_源码前缀、package snake_case | 遵专门目录规范 |
| SafeReadFailure/ReadVisibilityPosture | 自创HTTP错误、授权全局状态 | 沿Step8 |

### 7.9 冲突与修正记录

| ID | 冲突位置 / 影响 | 处置 |
|---|---|---|
| WS-DOC-01 | Step12首批错误/consumer映射不符Step8 | 已补审修正；无新public enum |
| WS-DOC-02 | Step13首批key漏channel/混partition | 已按Step6-A五字段Kop统一 |
| WS-DOC-03 | Step14首批配置泛化/Observation可配置 | typed限额、程序观测与分支DI已补齐 |
| WS-DOC-04 | Step15首批业务ID日志与revision gauge | 删除默认业务ID与不可比较gauge |
| WS-DOC-05 | Step16首批接口族泛述 | 十四入口独立断言、五类验证能力已补齐 |
| WS-DOC-06 | 首批合写与过早完成标记 | 撤回标记并顺序补审；历史偏差仍记录 |
| WS-DOC-07 | Step17不存在提交规范路径 | 改projects/README §8.2与实施计划规范 |

正例：unknown提交后权威回读原operation，再按当前权限输出原结果。反例：没有结果行便以新key重试并声称原事务失败。
正例：基线来源无正式schema时标blocked并给出缺失owner。反例：fixture用任意JSON构造“已验证”输入。

## 8. 回填草稿

正式§16保留承接、阅读、闭环上限与未来07审计要求；本步十类复核表作为规范性延伸阅读。未闭合schema或新接口需求必须先回设计修正，不能交给实现者自主扩字段。

## 9. 待确认事项

WS-UP九项、WS-LOCAL-001~003及04~07待闭合。没有真实driver终局/联调/基线/测试报告/实现仓/commit事实。正式03完成只允许后续设计承接，绝非整体实现移交通过。

## 10. 进入下一步条件

局部事实有唯一来源、构造/读面/状态/测试可互查，外部缺口与未来phase明确阻塞，无实现者选边。补审通过，进入Step18风险收口。
