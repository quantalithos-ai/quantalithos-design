# Step7 U2 接口小循环

## 问题、诊断与取舍

正式决定记录是受控internal映射入口，任何用户原始Approved字段不可信。Dispatch和Reconcile是内部worker正式job，原intent+fence+storedreport语义完整；Gov query可读不证明marketbinding。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| CreatePublicationDraft | DraftPublicationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | PublicationApplicationResult | publisher当前编辑授权；PublicationApplication.draft(DraftPublicationInput input) | PublicationApplication + 安全draft_spec候选 |
| RevisePublicationDraft | PublicationApplicationRef application_ref；DraftPublicationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | PublicationApplicationResult | 读取application+revision，检查Draft；PublicationApplication.revise(DraftPublicationInput input) | Draft + 新安全draft_spec（尚非qualifiedbasis） |
| SubmitPublicationApplication | PublicationApplicationRef application_ref；QualifiedPublicationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | PublicationApplicationResult | 重新核验U1当前来源责任材料；PublicationBasis.freeze(QualifiedPublicationInput input)；PublicationApplication.submit(QualifiedPublicationInput input)；ReviewHandoff.prepare(SubmittedApplicationInput input) | 固定PublicationBasis + Submitted application + ReviewHandoff + work |
| TerminatePublicationApplication | PublicationApplicationRef application_ref；ApplicationTerminationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | PublicationApplicationResult | 正式终止权限，读取当前review上下文；PublicationApplication.terminate(ApplicationTerminationInput input) | Terminated申请 + 原交接状态保留 |
| RecordGovernanceDecision | ReviewHandoffRef handoff_ref；QualifiedDecisionInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | ReviewProgressResult | GovernancePort取得正式决定与完整适用binding；ReviewBindingPolicy.evaluate(PublicationBasis basis, GovernanceDecisionBinding decision, CurrentDecisionInput current)；ReviewHandoff.record_decision(GovernanceDecisionBinding binding) | GovernanceDecisionBinding + ReviewHandoff + audit/result |

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetPublicationProgress | PublicationApplicationRef application_ref；ActorContext actor；QueryMetadata meta | ApplicationProgressView | application/basis/review/decision safe refs | 只读，不触发Govpoll/提交 |

### Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| DispatchReviewHandoff | ReviewHandoffRef handoff_ref；DeferredWorkRef work_ref；MarketWorkerContext context | ReviewJobReport，含逐项target/outcome/gap/result refs | review/work局部进度；timeout CommitUnknown，原intent不重建 |
| ReconcileReviewHandoff | ReviewHandoffRef handoff_ref；DeferredWorkRef work_ref；MarketWorkerContext context | ReviewJobReport，含逐项target/outcome/gap/result refs | matched决定/局部交接进度/report；恢复不自造批准，不从querysummary推出outcome |


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U2 internal stop_review/pass。
