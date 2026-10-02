# Step8 U7 独立处理流

## 问题、诊断与取舍

U7scope resolver只read不refreshsnapshot；typedsnapshotstate与本体同时read。refresh失败保留旧合法摘要/明确state，rebuild使用固定cursor非空typedplan和shadow，query不能调用这些job。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### GetReferenceFreshness 处理流

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
[ Typed GetReferenceFreshness read source and freshness inspection ]
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

- 主要处理：formalreadscope再typed切片读取，missing/degraded分支。
- 归属/保存：U7；typed qualified snapshot/state/validity。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：state不能代替snapshot本体，不refresh；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetProjectionFreshness 处理流

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
[ Typed GetProjectionFreshness read source and freshness inspection ]
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

- 主要处理：typedprojection identity与current披露检查。
- 归属/保存：U7；scope-bound ReadProjection/cursor/state。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：Fresh不代表业务ready；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RefreshQualifiedReferences 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Finite typed source / kind / consumer / scope plan ]
        |
        v
[ Formal READ resolver -> state + optional typed safe material ]
        |
        v
[ Qualified -> replace shadow; failure -> Stale or Unavailable, never truth repair ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：formalresolver逐source类型核验，不用ID推schema；QualifiedReferenceSnapshot.refresh(QualifiedSnapshotInput input)，失败保留旧合法切片+Stale或Unavailable；输出state+typed切片+逐itemgaprefs。
- 归属/保存：U7；qualifiedsnapshot shadow/state+audit/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不得自动解除Restricted或改申请/源truth；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RebuildMarketReadProjection 处理流

```text
[ Persisted typed target / original intent / operation context ]
        |
        v
[ Claim + fence + complete prior-report replay check ]
        |
        v
[ Inspect prior dispatch: unknown -> original probe, no blind send ]
        |
        v
[ Typed kind / scope / view identities + nonempty plan + fixed source cursor ]
        |
        v
[ Committed local facts + qualified owner snapshots -> safe new shadow ]
        |
        v
[ Missing input -> Unavailable; complete shadow -> atomic replace, not old-index repair ]
        |
        v
[ Short local transaction -> permission / maintenance marker ]
        |
        v
[ External seam or safe shadow build (outside SQL transaction) ]
        |
        v
[ Matching typed outcome + audit + full item report + stored result ]
        |
        v
[ Short local commit -> settle local work / keep blocked-unknown ]
```

- 主要处理：typed plan绑定projectionkind/scope与非空正式来源、固定cursor；ReadProjection.begin_rebuild(ProjectionRebuildPlanInput input)；从committedfacts+qualifiedsnapshots构造typedviews；ReadProjection.publish(ProjectionBuildOutcomeInput input)，缺材料Unavailable。
- 归属/保存：U7；ReadProjection安全shadow及state/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不从旧projection自建truth、不触发ownerwrite；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分4接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U7 internal stop_review/pass。
