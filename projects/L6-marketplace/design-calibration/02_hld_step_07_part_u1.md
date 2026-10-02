# Step7 U1 接口小循环

## 问题、诊断与取舍

Bind/Release只本地关联，Verify只局部核验记录。Qualified*Input不是调用者可信标签，entry必须经formal resolver重构；不允许客户端自填资质。

计划：入口分类→对象反查→typed骨架→flow/state反查→回填→停审；当前表尚未写入。

## 结构化接口与回填

### Command

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| BindPublisherRelation | QualifiedPublisherInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | PublisherRelationResult | 正式publisher/组织authority解析；SourceGatePolicy当前scope核验；PublisherRelation.bind(QualifiedPublisherInput input) | PublisherRelation + audit/result |
| ReleasePublisherRelation | PublisherRelationRef relation_ref；AuthorityDispositionInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | PublisherRelationResult | typed读取relation+revision；正式解除authority核验；PublisherRelation.release(AuthorityDispositionInput input)；关联核验置Invalidated | PublisherRelation + source资格失效责任 |
| VerifyPublicationSource | SourceVerificationInput input；ActorContext actor；CommandMetadata meta（key唯一meta.request） | SourceQualificationResult | SourceOwnerPort/MaterialAuthorityPort正式qualified读取；SourceGatePolicy.evaluate(SourceBinding source, PublisherRelation publisher, MaterialReferenceSet materials, CurrentAuthorityInput authority)；SourceVerification.start(SourceVerificationInput input)；record(QualificationOutcomeInput outcome) | SourceVerification + 固定SourceBinding/MaterialReference + audit/result |

### Query

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetSourceQualification | SourceVerificationRef verification_ref；ActorContext actor；QueryMetadata meta | SourceQualificationView | SourceVerification + typed qualified snapshot | 不refresh/自证有效 |

### Job

本部分无该类active入口。


## 自检与停审

对象/函数来源均已在Step6；command metadata唯一，query只读；job是worker-internal formal surface，其key由本地worker wrapper唯一提供而非复制Core command字段。没有activeevent/假schema；本部分接口逐个对应Step8flow和Step9trigger。正式§7摘录表与边界。U1 internal stop_review/pass。
