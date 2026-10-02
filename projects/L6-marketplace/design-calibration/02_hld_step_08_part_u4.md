# Step8 U4 独立处理流

## 问题、诊断与取舍

U4sameintent重放原完整result，受理+attempt/relation/work同UoW。派发许可在同version边界，Withdraw后未许可阻塞；许可已提交按可能外发纳影响，外部瞬时撤销不是本地承诺。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### RequestDistribution 处理流

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
[ Exact version + consumer / receiver + current source / authority / approval? ]
        |
        v
[ Version serialization: reject restricted / withdrawn; accept one intent ]
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

- 主要处理：resolver当前source/auth/Gov/receiver资格与exact版本；同版本序列化，AcquisitionGatePolicy.evaluate(MarketVersion version, CurrentQualificationInput current, AcquisitionTargetInput target)；DistributionIntent.accept(QualifiedAcquisitionInput input)；DistributionRelation.for_intent(AcceptedDistributionInput input)；DistributionAttempt.prepare(DistributionDispatchInput input)。
- 归属/保存：U4；DistributionIntent + Relation + PreparedAttempt + work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：withdrawal后不新accepted，free同gate；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### CancelDistribution 处理流

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
[ Prepared vs Dispatching / Unknown / Confirmed attempt? ]
        |
        v
[ Cancel local intent; keep external result and unknown reconciliation ]
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

- 主要处理：consumer当前授权+typed意图/attempt/fence；DistributionIntent.cancel(DistributionCancelInput input)。
- 归属/保存：U4；Cancelled intent + 原attempt/未知责任保留。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不伪造receiver rollback，既有结果对账；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RecordReceiverOutcome 处理流

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
[ Original intent / version / consumer / receiver / scope match? ]
        |
        v
[ Save formal outcome; withdrawn version -> durable late-impact delta ]
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

- 主要处理：receiver正式来源与intent/version/consumer/receiver/scope全binding；DistributionAttempt.settle(ReceiverOutcomeInput input)；DistributionRelation.attach(ReceiverOutcomeBinding binding)；若已撤回/限制，则增量knownimpact和notice待交接责任。
- 归属/保存：U4；attempt formalmapped result + relation outcome + 迟到影响责任。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：ACK非commit/installed/paid；错binding拒绝；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetAcquisitionEligibility 处理流

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
[ Typed GetAcquisitionEligibility read source and freshness inspection ]
        |
        v
[ Current qualified owner / authority / Gov read: unknown is NOT eligible ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：当前read权限与qualification分轴；不可证明来源则blocked/unknown，不消费过期entitlement。
- 归属/保存：U4；当前正式资格+exact市场版本。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不创建intent、免费不豁免、不造财务；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetDistributionProgress 处理流

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
[ Typed GetDistributionProgress read source and freshness inspection ]
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

- 主要处理：scope内local与external分轴读取。
- 归属/保存：U4；intent/relation/attempt/receiverbinding。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：旧成功不绕权限，不探测/重试；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchDistribution 处理流

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
[ Prepared original attempt + current acquisition gate ]
        |
        v
[ Version serialization: permission before effect; stale / withdrawn -> Blocked ]
        |
        v
[ Original receiver dispatch -> matching result / Failed / CommitUnknown ]
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

- 主要处理：持久claim/fence；未派发同version边界再查nonwithdrawn与当前gate；DistributionAttempt.begin(CurrentDispatchGateInput input)；许可先持久；ReceiverPort按原intent/exactref交接；qualified结果经RecordReceiverOutcome同规则，timeoutunknown。
- 归属/保存：U4；attempt/work结果及安全item refs。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：已许可后外部瞬时撤销不保证；unknown不能盲发；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileDistribution 处理流

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
[ Dispatching / CommitUnknown original attempt -> receiver probe ]
        |
        v
[ Matching commit -> record; unknown -> wait ]
        |
        v
[ Known-not-committed + current gate -> safe new attempt for SAME intent ]
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

- 主要处理：ReceiverPort按原intent/probe检查binding；matching结果走RecordReceiverOutcome同domain；known-not-committed且当前gate成立才允许原intent安全新attempt；无probe等待正式人工依据。
- 归属/保存：U4；原attempt结果/knownimpact增量/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不猜installed，不由intentCancelled覆盖formal结果；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分7接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U4 internal stop_review/pass。
