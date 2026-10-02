# Step8 U6 独立处理流

## 问题、诊断与取舍

U6共用OperationRecord/StoredResult/Audit/Work在localUoW；reserved进程中断需operationreconcile不fakeaccepted。恢复typed目标、原intent/probe，人为根据必须formal且不能填success。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### RequestMarketRecovery 处理流

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
[ Current operator authority + finite typed original target? ]
        |
        v
[ Request local recovery; no owner truth / arbitrary SQL target ]
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

- 主要处理：正式operator/system actor scope与恢复authority；RecoveryIntent.request(RecoveryRequestInput input)。
- 归属/保存：U6；Requested RecoveryIntent + durable work/audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不接收任意SQL/ownerref写目标；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetMarketAudit 处理流

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
[ Typed GetMarketAudit read source and freshness inspection ]
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

- 主要处理：typed subject resolver-first，裁剪actor/basis/reason。
- 归属/保存：U6；append-only local audit+observation binding。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：rawlog/evidence禁止，不声明Obs已接纳；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetRecoveryProgress 处理流

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
[ Typed GetRecoveryProgress read source and freshness inspection ]
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

- 主要处理：scope内逐item及blocked/unknown读取。
- 归属/保存：U6；recovery/work/stored report。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：不运行恢复、不ready推断；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetOperationResult 处理流

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
[ Typed GetOperationResult read source and freshness inspection ]
        |
        v
[ Original typed result: missing / wrong kind -> integrity gap, NO reconstruction ]
        |
        v
[ Visibility intersection + freshness / missing / degraded ]
        |
        v
[ Safe typed view / page / counts (no write) ]
```

- 主要处理：当前读取authority与resultkind匹配；missing/错kind为完整性缺口，不现查truth重建。
- 归属/保存：U6；OperationRecord→StoredOperationResult typed完整原面。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：只读，不重新domain transition；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RunMarketRecovery 处理流

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
[ Typed target inspection + current recovery authority ]
        |
        v
[ External unknown -> owning reconciliation; projection -> qualified rebuild ]
        |
        v
[ Store full per-item report; no basis / probe -> Blocked ]
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

- 主要处理：authority/typed目标当前核验；RecoveryIntent.begin(QualifiedRecoveryInput input)；effectunknown调用所属Reconcile job；qualified派生调用U7rebuild；RecoveryIntent.record(RecoveryOutcomeInput input)；Blocked无probe/manualbasis。
- 归属/保存：U6；recovery state+typed逐项原report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不改外部truth/历史、不复活Withdrawn；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchObservation 处理流

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
[ Fixed local audit set + formal producer admission / redaction / scope ]
        |
        v
[ Persist original intent -> qualified Obs handoff ]
        |
        v
[ Official outcome vs ACK / commit-unknown, local audit unchanged ]
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

- 主要处理：正式produceradmission/安全材料/固定audit集+scope核验；intent-before-effect；ObservationPort原intent交接；formalreceipt与ACK分轴，unknown原intent对账。
- 归属/保存：U6；ObservationOutcomeBinding/local work/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Archive没有activeexport/restore；no rawbody；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileObservation 处理流

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
[ Original audit handoff -> formal probe / fixed material binding ]
        |
        v
[ Matching receipt -> reference; no probe -> blocked-unknown ]
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

- 主要处理：formalproducer/原intent probe和固定audit set读取；matchingresult才保存ObservationOutcomeBinding；无probe保持unknown/Blocked。
- 归属/保存：U6；原external audit结果/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：local audit不等externaladmitted，不盲重发；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分7接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U6 internal stop_review/pass。
