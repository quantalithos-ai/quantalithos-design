# Step8 U1 独立处理流

## 问题、诊断与取舍

U1正式主体/来源/材料核验与local Bound/Qualified分开；缺owner不生成verified/digest。Release产生依赖资格失效责任，不能删历史。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### BindPublisherRelation 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Formal publisher / organization / scope authority? ]
        |
        v
[ Missing -> blocked; qualified -> local Bound only ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：正式publisher/组织authority解析；SourceGatePolicy当前scope核验；PublisherRelation.bind(QualifiedPublisherInput input)。
- 归属/保存：U1；PublisherRelation + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：非Identity登录/verified写入；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReleasePublisherRelation 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Current authority + local relation revision? ]
        |
        v
[ Release + invalidate dependent qualifications; append history ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：typed读取relation+revision；正式解除authority核验；PublisherRelation.release(AuthorityDispositionInput input)；关联核验置Invalidated。
- 归属/保存：U1；PublisherRelation + source资格失效责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：解除不能删历史或改主体truth；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### VerifyPublicationSource 处理流

```text
[ Current actor / scope / typed intent ]
        |
        v
[ Reserve canonical operation (short local transaction) ]
        |
        v
[ Duplicate -> typed stored original result; conflict -> reject ]
        |
        v
[ New intent -> typed load + qualified owner prechecks ]
        |
        v
[ Owner type / ref / version / digest / visibility + materials? ]
        |
        v
[ Missing or mismatch -> Blocked; formal match -> Qualified ]
        |
        v
[ Short local UoW: revision + owning guard (admission only when required) ]
        |
        v
[ Changed facts + safe audit + complete result + required durable work ]
        |
        v
[ Commit -> local accepted (not external success) ]
```

- 主要处理：SourceOwnerPort/MaterialAuthorityPort正式qualified读取；SourceGatePolicy.evaluate(SourceBinding source, PublisherRelation publisher, MaterialReferenceSet materials, CurrentAuthorityInput authority)；SourceVerification.start(SourceVerificationInput input)；record(QualificationOutcomeInput outcome)。
- 归属/保存：U1；SourceVerification + 固定SourceBinding/MaterialReference + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：缺contract记录Blocked，拒绝假digest/签名；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetSourceQualification 处理流

```text
[ Current actor -> formal scope / disclosure resolver ]
        |
        v
[ Unknown scope -> safe no disclosure ]
        |
        v
[ Current actor / scope / source visibility intersection ]
        |
        v
[ Typed GetSourceQualification read source and freshness inspection ]
        |
        v
[ Safe subject / summary / count disclosure, no refresh or write ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：读取scope裁剪资格/材料缺口。
- 归属/保存：U1；SourceVerification + typed qualified snapshot。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不refresh/自证有效；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分4接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U1 internal stop_review/pass。
