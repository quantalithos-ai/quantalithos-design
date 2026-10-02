# 03 Step 15：可观测性与审计埋点契约

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。已读SOP Step15、规范5.14、闭环2.14/2.14-a与Step14；本Step只定义代码埋点和安全审计，不写运维阈值、不新增协议或外部producer资格。

### Step内计划

| 单元 | 状态 | 位置 |
|---|---|---|
| 输入/回答/诊断/取舍 | done | §2～6 |
| runtime log/metric/trace | done | §7.1～7.3 |
| 逐flow审计与Obs边界 | done | §7.4～7.6 |
| 候选/自检/同步 | done | §8/10 |

## 2. 本步输入

[Step14](03_ddd_step_14_config_bindings.md)的配置绑定/缺失策略/资格待确认；[Step8协议](03_ddd_step_08_protocol_contracts.md)、[Step9独立流](03_ddd_step_09_function_flows.md)、[Job分段](03_ddd_step_09_job_execution.md)、[Step11](03_ddd_step_11_persistence_transactions.md)、[Step12](03_ddd_step_12_errors_recovery.md)、[U6对象](03_ddd_step_06_part_u6.md)、[共享输入](03_ddd_step_06_shared_types.md)。Obs当前正式03职责/安全producer切口已恢复阅读；其局部修复不证明Marketplace exact producer与SDKoperation可用。

## 3. SOP问题回答

1. 哪些必须审计？21C真实accepted局部变化、12J真实B结果/blocked报告；JobA以原checkpoint/permission持久责任追溯，不能提前记最终成功。16Q及original replay不新增business audit。
2. 哪些错误日志？validation/disclosure/transition/conflict/contract/transport/commitunknown/fence/codec各有限安全code；所有错误禁rawbody/stack/secret。Rejected无accepted审计；Job合法Blocked是实际报告，不是外部成功。
3. 哪些指标？入口结果、SQL阶段/rollback/unknown、owner read/dispatch/probe、work claim/fence、projection/reference freshness、固定upper覆盖与late责任；标签只固定enum/phase，不带业务ref或自由reason。
4. 字段分别是什么？日志有限selector/phase/outcome/code与已披露可选trace关联；业务audit沿现有六字段，不增状态字段；Obs只原operation和已提交auditset，回执独立。
5. 哪些留运维？SLO/阈值/采样/保留/告警/仪表盘与runbook。04负责telemetry资源profile，05安全断言，06证据上限，07实施切口；本轮不执行这些文档。

## 4. 当前文档问题诊断

Step9逐flow已有safeaudit/fullresult/work，但runtime埋点未形成有限字段表。MarketAuditRecord没有action/state字段，不能临时写同名虚构enum：操作kind由关联OperationRecord读取，状态与结果由同帧typed事实/完整StoredOperationResult追溯。trace是Coremetadata的关联，不是新的本地业务状态或audit正文。

Obs Job若自动再投递自身audit会形成无限责任链；projection纯维护audit若参与同kind高水位会无限Stale。采用原业务operation的有限安全audit集投递、维护审计不递归；沿Step11按依赖kind排除技术自写。

## 5. 改动前后对比

| 项 | 前 | 后 | 理由 |
|---|---|---|---|
| telemetry | 横切原则 | 有限位置/字段/标签/阶段 | 可测安全、不以日志代审计 |
| audit | 独立flow分散 | 每accepted入口审计inventory | 不增通用outbox/假成功 |
| Obs | typed port与Job | original auditset资格与防递归 | 回执不升级evidence |

## 6. 设计取舍

| 方案 | 收益 | 风险 | 结论 |
|---|---|---|---|
| raw request/response调试 | 易排障 | 泄露正文/secret | 拒绝 |
| 固定typed安全字段、低基数指标 | 可诊断与验证 | 细节需业务ref授权读取 | 采用 |
| 每次请求都写accepted audit/outbox | 看似统一 | Query/replay写入、虚构事件 | 拒绝 |
| 真实本地变化原子审计，外部回执分层 | 对应truth与责任 | 必须显式逐flow区分 | 采用 |

## 7. 结构化中间产物

### 7.1 Runtime字段与trace来源

planned实现位置：infra `telemetry.rs`、API mapper、Worker loop、两个Runner与八SDK adapter。可使用既定Rust `tracing`生态；exporter/采样/资源由04与运维定，不凭本文增加OTel服务、Bus或业务truth。若日志/指标export失败，不能回滚已经提交的业务事实；记录失败不得递归调用ObservationPort。

| 字段族 | 允许 | 禁止 / 来源 |
|---|---|---|
| runtime必选 | 固定entry selector、phase、outcome、ErrorCode/PortError固定tag、adapter kind、UowMode | selector来自49有限入口，不直接取URL；不自由reason/message |
| runtime可选关联 | 原Core RequestMetadata.request_id/trace_id；当前授权且safe的operation/work/result ref与数值frame | 不把这些当metric label；不记录actor_id、key、fingerprint、digest、token、raw endpoint；无原metadata时省略，不补造 |
| runtime耗时 | monotonic elapsed、有限计数/批量大小 | Clock业务时间不作耗时或提交顺序；不承诺外部SLO |
| business audit | 既有audit_ref/subject_ref/operation_ref/actor_ref/basis_refs/cursor六字段 | ActorReference指向受控CoreContextRecord，不是公开人类身份档案；无raw请求/ownerbody/stack |
| trace | C的meta.request、Q的meta.request、J的context.request所携原TraceId | 当前Core是RequestMetadata.trace_id，不假称存在TraceContext Rust类型；domain不生成trace/span，trace不证明业务成功 |

entry建立有限selector的span，Runner增加prepare/reserve/A/external/B/finish阶段，PG/SDK adapter添加有限依赖kind子span；仅继承原trace关联。没有正式SDK透传协议时只本地关联，不自定义owner headers，不生成跨系统span证据。未披露请求的关联仅受控runtime sink可见，API错误仍沿Step12 no-echo。

### 7.2 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| API/Worker startup/config validation | info / error | entry、phase=startup、固定config失败code、adapter kind/disposition | 未就绪启动不伪成ready；无config文件正文/secretref值 |
| Runner.prepare / ReadFacade.authorize | debug / info | selector、phase=disclosure、outcome=allowed/denied、固定code、原trace关联 | 拒绝无主体/存在性泄漏；不打印请求DTO |
| key lookup/reserve race | info / warn | selector、phase=reserve、outcome=fresh/replayed/in_progress/conflict | 区分原结果重放；不记录key/fingerprint |
| domain guard/CAS/fence | warn | selector、phase=guard/apply、IllegalTransition/VersionConflict/FenceMismatch等固定code | 定位拒绝；失败不记accepted audit |
| UoW A/C/B commit | info / error | selector、phase=command/a/b、KnownCommitted/Unknown/rollback、可披露operation_ref/frame | 只有KnownCommitted记本地提交；Unknown非rollback |
| SDK read/dispatch/probe | info / warn / error | adapter kind、有限operation、phase、typed result classification/error、elapsed | dispatch调用过的timeout只可能未知；无responsebody/endpoint |
| Work claim/renew/late result | info / warn | selector、phase=claim/late、固定结果、可披露work/operation ref | 旧fence不能覆盖新事实；晚结果保持责任 |
| Query ready/empty/notvisible/degraded | debug / info | selector、ReadSurfaceKind/固定degrade分类 | 不写业务审计/修复；隐藏count/ref/token不进日志 |
| projection build/reference refresh | info / warn | selector、kind、phase、items计数/固定分类、elapsed | 批次完整性；不输出safe_material正文/manifest全文 |
| codec/FK/manifest/result integrity | error | selector、phase、IntegrityFailure/CodecFailure固定code | 保留原责任、不能猜造完整结果；无SQL参数/stack |
| runtime export failure/shutdown | warn / info | entry、phase、固定code/未结束work计数 | 停新工作、保留checkpoint；不新投递自身诊断 |

### 7.3 指标埋点表

标签值必须有限。`entry`是49个固定入口tag；`adapter`八kind加postgres；`code`是18ErrorCode或固定none；`phase`仅start/prepare/reserve/command/a/external/b/query/shutdown；state/kind沿既有finite enum。不得以HTTP路径、错误文本或ref替代标签。

| 指标（planned name） | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| marketplace_entry_total | Counter | 入口唯一结束点，每请求一次 | entry、result=accepted/replayed/rejected/degraded/unknown、code |
| marketplace_entry_duration_seconds | Histogram | 入口monotonic总耗时 | entry、result |
| marketplace_uow_total | Counter | commit/rollback实际返回 | phase、mode、result=committed/unknown/rolled_back/failed |
| marketplace_frame_lock_seconds | Histogram | ReadWrite入口帧锁实际等待 | phase、result=acquired/failed |
| marketplace_owner_call_total | Counter | read/dispatch/probe实际调用结束 | adapter、有限operation、call=read/dispatch/probe、result |
| marketplace_owner_call_duration_seconds | Histogram | SDK调用monotonic elapsed | adapter、call、result |
| marketplace_work_claim_total | Counter | 实际claim/CAS/fence结束 | entry、result=claimed/blocked/conflict/expired_probe_only |
| marketplace_read_surface_total | Counter | Query返回面 | entry、surface=ready/empty/missing/not_visible/degraded、固定degrade分类 |
| marketplace_projection_items_total | Counter | committed完整manifest逐item | kind、result=rendered/omitted；rollback不计committed |
| marketplace_impact_item_total | Counter | committed枚举/late delta | phase=enumerate/late、result=included/unknown/omitted |
| marketplace_integrity_failure_total | Counter | codec/result/manifest检查失败 | area=codec/result/checkpoint/manifest/binding、code |
| marketplace_telemetry_export_failure_total | Counter | 实际exporter失败 | sink=log/metric/trace；只本地计数，不递归发送 |

计数的attempt与commit含义分开：owner call记录调用，不证明结果提交；业务提交counter只在KnownCommitted或后续正式key解析确认后一次打点。丢失/重复runtime指标允许作为诊断偏差，不凭指标修业务truth；不引入持久指标去重账本。指标不能作06证据或付款/安装/审批证明。

runtime单元停审：字段来源、no-body、finite label、trace单authority与commitunknown区分已固定；下一audit单元不能扩充audit schema或增加event。

### 7.4 逐flow审计与accepted副作用inventory

本单元先核对Step9。诊断：Observation两个Job在原稿没有明确本地work生产方，无法从APIaccepted路径抵达；不能靠Worker临时构造原audit。采用既有`schedule`在**audit构造后、receipt/report构造前**创建Observation工作，与原audit/result同提交；不新增port/DTO/event。源业务C/J只生产安全原operation+auditset，正式producer不具资格时后续Job明确Blocked，本地审计仍完整。

通用inventory不是泛化成功模板：下表每行指实际接受的局部事实；21C均同Tx追加一个safeaudit、完整原typedresult并complete原Operation。12J均A保存claim/checkpoint/必要permission，B仅真实匹配结果或合法Blocked报告同Tx追加audit/fullreport/必要successor；A不提前记最终audit。所有49flow均**无outbox、无新的business trace对象、无外部正文history**。Domain变化写入Step11 typed fact history；Query/replay无该history。原Core trace只关联context；状态由typed事实/result追溯，不在audit私加字段。

`P`表示沿Step9.queue_projections产生本scope受影响projection责任；不是命令直接改Fresh→Stale。读取以Step11 dependency highwater降级；重建由既有Job正式mark_stale/publish。`O`表示新增明确的原operation安全audit投递责任，目标/intent都Observation(originalop)，不等于Obs接纳。其他责任均是既有协议。

| 入口 | 本地接受事实 / audit触发 | 正式basis或局部事实回指 | 必要责任 / 派生影响 |
|---|---|---|---|
| BindPublisherRelation | relation bind | 正式publisher authority+scope | P、O |
| ReleasePublisherRelation | relation release与核验失效 | release authority+实际verifications | P、O；不删除既有版本/结果 |
| VerifyPublicationSource | verification/outcome/safe snapshot | immutable source/material/publisher/current gate或实际gap | P、O；不自产scan/approval |
| CreatePublicationDraft | Draft application | typed source candidates与scope basis | P、O |
| RevisePublicationDraft | Draft CAS更新 | 旧revision与当前授权basis | P、O |
| SubmitPublicationApplication | Submitted+immutablebasis+review | 当前publisher/source/material basis | DispatchReviewHandoff、P、O |
| TerminatePublicationApplication | 局部Terminated | 当次authority/原basis | P、O；已发handoff仍原intentprobe |
| RecordGovernanceDecision | matched正式决定binding与申请局部状态 | Governance原完整decision+basis/subject/scope | P、O；ACK/signature/scan无approval |
| CreateMarketplaceListing | local metadata listing | publisher/source current basis | P、O |
| EditMarketplaceListing | metadata CAS | 当前publisher/currentdisclosure | P、O；不改资产正文 |
| MaintainMarketCategory | local typed taxonomy | 明确scope/parent授权 | P、O |
| RegisterMarketVersion | Staged immutable source association | 原application/basis/source完整绑定 | P、O |
| ListMarketVersion | Listed admission | 正式current approved/source/material/publisher | P、O；本地Listed非第二审批 |
| RequestDistribution | intent/relation/attempt与许可前责任 | current eligibility+receiver qualification | DispatchDistribution、P、O |
| CancelDistribution | Cancelled intent | 当前cancel authority | P、O；旧Confirmed/Unknown attempt不抹除 |
| RecordReceiverOutcome | 正式Confirmed结果与relation attach | 原intent/attempt/version/receiver/scope outcome | late impact责任、P、O |
| RestrictMarketVersion | Restricted+immutabledisposition+impact | 当前disposition authority与本地cursor | EnumerateKnownImpact、P、O |
| WithdrawMarketVersion | Withdrawn终态+disposition+impact | 同上，撤回不等notice完成 | EnumerateKnownImpact、P、O |
| PlanImpactNotifications | 每target唯一NoticeIntent | 实际impact与formal channel资格 | DispatchNotice、P、O |
| RecordNoticeOutcome | 正式Confirmed通知binding | 原notice/channel/target/scope | P、O；不证明阅读/卸载 |
| RequestMarketRecovery | Requested recovery+正式authorityref | typed target与current recovery authority | RunMarketRecovery、P、O |
| DispatchReviewHandoff | handoff真实progress/Blocked/Unknown | 原application/basis/intent及formal dispatch分类 | 原intent Reconcile、P、O；不自动批准 |
| ReconcileReviewHandoff | 原probe正式收束或Blocked | 原permission/checkpoint/fullproof | 必要恢复责任、P、O；不盲再发 |
| DispatchDistribution | attempt结果/Unknown与关系 | 原permission/version/intent/receiver | 原intent Reconcile、late impact、P、O |
| ReconcileDistribution | 原probe结果与关系/晚结果责任 | 原fullbinding，不用当前view重建 | late impact/正式重试责任、P、O |
| EnumerateKnownImpact | fixedupper本地known set报告 | relation/unknownattempt as-of事实与window | continuation责任、P、O；不声称全世界complete |
| DispatchNotice | notice真实binding/Unknown/Blocked | 原notice/permission/channel | ReconcileNotice、P、O |
| ReconcileNotice | 原probe真实收束/Blocked | 原notice intent与正式proof | 必要恢复责任、P、O |
| RunMarketRecovery | recovery进度+原责任安全承接 | formal recovery authority+原checkpoint/probe/localfacts | typed reconcile/maintenance、P；**无O**，防维护链自投递 |
| DispatchObservation | 正式observer binding或Blocked/Unknown报告 | 原业务operation+frozenauditset+scope+permission | ReconcileObservation（必要时）；**无O、无递归P** |
| ReconcileObservation | 原Obs probe结果或Blocked | 同一原operation/auditset，不用当前Jobaudit替换 | 必要原责任；**无O、无递归P** |
| RefreshQualifiedReferences | 实际qualified snapshot更新/gap | owner正式safe slice/current validity | continuation/P、O；不复活market version |
| RebuildMarketReadProjection | 本scope完整Rendered/Omitted manifest publish/gap | committedfacts+qualifiedsnapshots/固定plan | continuation；**无O、无递归P**，排除自audit高水位 |

16Q逐入口沿Step9只读；GetMarketAudit也不自产审计。Fresh Empty须同谓词合法空集；NotVisible/Degraded无hiddenref/count/token。原result replay仅return原payload与runtime replay分类，**0新audit/O/P/work/claim/externalcall**。Rejected C全部rollback，不保存“失败acceptedaudit”；真正JobBlocked局部状态+报告可以accepted，basis_refs只有实际安全gap/authority，不假填formal resultref。

### 7.5 Observation work生产与防递归

生产方为21C和表中八J（review2、distribution2、impact1、notice2、reference1）。各业务flow独立inventory必须与下列明确调用一致；七U Step9 C代码和shared Job执行回修为同一契约，不以Worker私有map补口。

```rust
// Before receipt/report: frozen audit exists in the SAME committing transaction.
let observation_work = support.schedule(
    &reserved, None,
    MarketWorkTargetRef::Observation(reserved.operation.value.operation_ref.clone()),
    MarketEffectIntentRef::Observation(reserved.operation.value.operation_ref.clone()),
    MarketOperationKind::DispatchObservation,
    scope.scope_ref.clone(), None, None, vec![audit.audit_ref.clone()],
)?;
// Commands add to works before receipt; qualifying Jobs add to successors before report.
```

该纯调用只新建本地planned责任ID（不是外部receipt/evidence/run），不调用SDK/owner；初始Pending与完整DeferredPlan原子保存。context/receipt/report的work_refs必须包含实际生成的该ID，原result replay不重复生成。Obs audit_refs只本operation已提交安全audit集；当前每flow一个，future多audit只能显式扩充已提交原集合，不能捕获后续reconcile或维护audit。UK(intent,target)阻止同operation重复投递责任。

Worker依据已定义DispatchObservation DTO从持久work/plan取原auditset与正式context/fence/key；不扫描所有audit并猜intent。scope、producer/redaction与SDKexactoperation缺失则qualify返回ContractBlocked/typedgap，保存真实Blocked报告；无externalcall、无ObservationOutcomeBinding。无probe的潜在commit保留waiting责任，不能把ACK升级正式receipt。

### 7.6 Obs adapter与证据上限

ObservationPort的qualify/dispatch/probe仅承接原operation、frozenauditset、scope、原permission；local safeaudit先committed。`ObservationOutcomeBinding::from_observer`仅接受正式QualifiedObservationOutcome，完整operation/auditset/scope匹配才持久。不能保存Obs ledgerbody、构造材料/evidencealias/真实run/verdict/signoff。

审计dispatch/probe自身B仍有本地audit/report但不O；Rebuild纯维护audit排除本kinddependency highwater，防自身无限Stale。无Archive producer/export/restore、无Bus/outbox、无支付流水。外部producer消费资格须owner当前正式contract与SDK exact schema闭合；本文的局部闭口不是外部ready。

audit单元停审：33accepted入口、16Q/no-write、O生产与三类维护/Obs防递归、原auditset/fullreceipt/sourcecursor/ref安全均已核对；下步16映射最小断言，实际adapter测试仍not-run。

## 8. 文档草稿

候选正式§14采用§7.1字段/trace、§7.2日志、§7.3指标、§7.4逐flowinventory及§7.5～7.6安全Obs链。所有代码路径planned，telemetry不提供证据或ownertruth；不将本Step的过程诊断写入正式03。

## 9. 待确认项

MP-UP-008、受影响Obs producer/redaction/SDK exact mapping仍blocked；其余MP-UP/SRC/Q不关闭。telemetry数值与formal human auth不在本Step造默认。

## 10. 自检与下一动作

文档自检：21C代码已逐处补既有schedule，全部位于audit之后/receipt之前；八J在shared执行原型以有限kind匹配补O/P，RunRecovery只P，Obs2/Rebuild无O/P。原report构造在责任之后，所有新refs与原result同Tx；33入口inventory完整、16Q/replay零写、metric无高基数label、trace来自实际Coremetadata。实际静态计数21C/十段/shared Job inventory通过；这不是运行或producer证据。下一读Step16 SOP/规范5.15及测试切口标准，不提交commit。
