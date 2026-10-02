# Step8 U2 独立处理流

## 问题、诊断与取舍

U2Draft改动与Submitted不可变分开；Terminate保留已经外发/unknown review，formaldecisionmatched不自动Listed。Gov handshake缺合同blocked。

计划：逐接口输入/归属→读写/owner接缝→独立diagram→typed参数/结果→coverage/回填→停审；当前图尚未写入。

## 结构化flow与回填

#### CreatePublicationDraft 处理流

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
[ Publisher editing authority + body-free draft input ]
        |
        v
[ Create Draft, no review dispatch / market listing ]
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

- 主要处理：publisher当前编辑授权；PublicationApplication.draft(DraftPublicationInput input)。
- 归属/保存：U2；PublicationApplication + 安全draft_spec候选。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：材料引用存在不自动Submitted；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RevisePublicationDraft 处理流

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
[ Application is Draft? ]
        |
        v
[ No -> reject immutable submitted basis; yes -> new safe draft specification ]
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

- 主要处理：读取application+revision，检查Draft；PublicationApplication.revise(DraftPublicationInput input)。
- 归属/保存：U2；Draft + 新安全draft_spec（尚非qualifiedbasis）。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：Submitted不原地换输入；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### SubmitPublicationApplication 处理流

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
[ Current source / publisher / material gate? ]
        |
        v
[ Fixed PublicationBasis + Submitted + pending review in one UoW ]
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

- 主要处理：重新核验U1当前来源责任材料；PublicationBasis.freeze(QualifiedPublicationInput input)；PublicationApplication.submit(QualifiedPublicationInput input)；ReviewHandoff.prepare(SubmittedApplicationInput input)。
- 归属/保存：U2；固定PublicationBasis + Submitted application + ReviewHandoff + work。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：缺publisher/material/source合同不提交；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### TerminatePublicationApplication 处理流

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
[ Original review not yet sent / sent / commit-unknown? ]
        |
        v
[ Terminate local application; keep sent-unknown reconciliation ]
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

- 主要处理：正式终止权限，读取当前review上下文；PublicationApplication.terminate(ApplicationTerminationInput input)。
- 归属/保存：U2；Terminated申请 + 原交接状态保留。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：已外发/unknown不假造外部取消；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### RecordGovernanceDecision 处理流

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
[ Formal exact application / basis / scope outcome? ]
        |
        v
[ Mismatch -> reject; match -> bind decision, never auto-list ]
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

- 主要处理：GovernancePort取得正式决定与完整适用binding；ReviewBindingPolicy.evaluate(PublicationBasis basis, GovernanceDecisionBinding decision, CurrentDecisionInput current)；ReviewHandoff.record_decision(GovernanceDecisionBinding binding)。
- 归属/保存：U2；GovernanceDecisionBinding + ReviewHandoff + audit/result。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：不把ACK/waived当approved，不自动上架；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### GetPublicationProgress 处理流

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
[ Typed GetPublicationProgress read source and freshness inspection ]
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

- 主要处理：读取分轴进度与缺口。
- 归属/保存：U2；application/basis/review/decision safe refs。全部读取no-write，resolver不刷新业务snapshot。
- 禁止/03交接：只读，不触发Govpoll/提交；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### DispatchReviewHandoff 处理流

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
[ Typed original review + fixed basis + current application status ]
        |
        v
[ Prepared -> persist dispatch context -> formal Gov intake ]
        |
        v
[ Accepted -> WaitingDecision; timeout -> CommitUnknown; no contract -> blocked ]
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

- 主要处理：claim持久责任/fence，重核验未终止及固定basis；正式Gov接收原handoff意图；ReviewHandoff.record_dispatch(ReviewDispatchOutcomeInput outcome)。
- 归属/保存：U2；review/work局部进度。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：timeout CommitUnknown，原intent不重建；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

#### ReconcileReviewHandoff 处理流

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
[ Original review intent -> formal probe / decision read ]
        |
        v
[ Matched outcome -> local record; no probe -> wait formal manual basis ]
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

- 主要处理：按原handoff formalprobe/query，不重新提交；接收结果与决定分轴；qualified决定调用RecordGovernanceDecision同domain；unknown无probe保留人工依据/ContractBlocked。
- 归属/保存：U2；matched决定/局部交接进度/report。accepted及完整原result/audit/必要durable责任同local UoW，ownereffect不跨事务；各rejected/blocked/unknown有安全来源。
- 禁止/03交接：恢复不自造批准，不从querysummary推出outcome；完整DTO→domain字段、typed get/save、revision/fence/错误与报告逐item由03闭合，fake/durable同语义。

## 自检/停审

本部分8接口均独立图+三项notes；Step7无遗漏，对象/成员均Step6，不创造event/API。业务gate与localcommit/outsideeffect分层，query无写，report保留逐item refs；正式§8摘录。U2 internal stop_review/pass。
