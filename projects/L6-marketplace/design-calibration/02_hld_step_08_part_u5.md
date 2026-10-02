# Step8 U5 独立处理流

## 问题、诊断与取舍

U5先有据处置停新发，再独立影响/通知。late确认增量work与formal结果同UoW，cursor缺口Partial；通道ACK与正式结果分轴，失败不复活version。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### RestrictMarketVersion 处理流

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
[ Formal disposition / current qualification gap basis? ]
        |
        v
[ Version serialization: restrict + local audit + impact work atomically ]
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

- 主要处理：正式失效/未知资格或处置authority，不假造外部撤销；同version serialization，WithdrawalDisposition.record(QualifiedDispositionInput input)；MarketVersion.restrict(VersionRestrictionInput input)；ImpactRecord.start(ImpactEnumerationInput input)。
- 归属/保存：U5；WithdrawalDisposition + Restricted MarketVersion + PartialImpact + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：通知/审计外部失败不恢复获取；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### WithdrawMarketVersion 处理流

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
[ Formal withdrawal authority? ]
        |
        v
[ Version serialization: stop new admission + withdraw + impact work ]
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

- 主要处理：正式撤回authority/处置理由；同version serialization，与U4受理/许可竞争；MarketVersion.withdraw(VersionWithdrawalInput input)；ImpactRecord.start(ImpactEnumerationInput input)。
- 归属/保存：U5；WithdrawalDisposition + Withdrawn MarketVersion + PartialImpact + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Withdrawn终态不回Listed；新发新version/newreview；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### PlanImpactNotifications 处理流

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
[ Known / unknown impact + qualified target / channel? ]
        |
        v
[ Missing contract -> gap; valid plan -> deduplicated original notices ]
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

- 主要处理：scope内knownrelation/unknown candidates固定关联；正式channel/target授权具备才生成可派发计划；NoticeIntent.prepare(QualifiedNoticePlanInput input)。
- 归属/保存：U5；去重NoticeIntent + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：缺channel保留gap/blocked，不自造地址；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RecordNoticeOutcome 处理流

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
[ Original notice / target / channel / scope match? ]
        |
        v
[ Save formal outcome; ACK is not delivery ]
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

- 主要处理：正式通道来源，notice/target/channel/scope匹配；NoticeIntent.settle(NoticeOutcomeInput input)。
- 归属/保存：U5；NoticeOutcomeBinding + notice state/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：ACK不送达/已读/已处置；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetWithdrawalImpact 处理流

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
[ Typed GetWithdrawalImpact read source and freshness inspection ]
        |
        v
[ Known cursor coverage and unknown / late items stay separate ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：scope内knowncoverage与unknown/late分轴读取。
- 归属/保存：U5；disposition/impact+knownrelations。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不声称全安装受影响集合；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetNoticeProgress 处理流

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
[ Typed GetNoticeProgress read source and freshness inspection ]
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

- 主要处理：通道formal结果按scope裁剪。
- 归属/保存：U5；notice/outcomebinding/audit历史。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：读取不发通知；Confirmed不硬翻译Delivered；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### EnumerateKnownImpact 处理流

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
[ Fixed disposition cursor -> typed known relations / unknown attempts ]
        |
        v
[ Append deduplicated delta; missing cursor -> Partial ]
        |
        v
[ Cursor complete -> KnownScopeComplete; late results keep incremental work ]
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

- 主要处理：typed版本关系按稳定cursor读取，未知attempt保守候选；ImpactRecord.include(ImpactDeltaInput delta)；missing cursor保留Partial；late关系以新delta去重；仅声明cursor内KnownScopeComplete。
- 归属/保存：U5；ImpactRecord增量/coverage及notice planning责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不扫描外部全安装集合；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchNotice 处理流

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
[ Persisted original notice + qualified target / channel ]
        |
        v
[ Persist permission -> original notice dispatch ]
        |
        v
[ Formal outcome vs ACK vs commit-unknown stay distinct ]
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

- 主要处理：原意图claim/fence，当前channel/target权限；NoticeIntent.begin(NoticeDispatchInput input)后持久许可；NoticeChannelPort交接，formalmatching结果走RecordNoticeOutcome同规则，timeoutunknown。
- 归属/保存：U5；notice/work结果。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不以外部失败回滚撤回；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileNotice 处理流

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
[ Original notice -> formal channel probe ]
        |
        v
[ Formal match -> record; known-not-committed -> same-intent safe retry ]
        |
        v
[ No probe / unresolved -> wait, never revive withdrawn version ]
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

- 主要处理：原notice/channel formalprobe；匹配结果走RecordNoticeOutcome；known-not-committed才原意图安全重试；无probe保持CommitUnknown/Blocked等待人工依据。
- 归属/保存：U5；原notice outcome/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不得造通知成功/新意图盲发；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分9接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U5 internal stop_review/pass。
