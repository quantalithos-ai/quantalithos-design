# L6-bridges 03 Step10：外显计划、逻辑effect与单次attempt

共用E0~E4/U/测试简称见[主文件§6](03_ddd_step_10_state_matrix.md#6-共用转换错误与副作用契约)。三机不合成“发送成功”；PlatformReceipt只immutable known分类，F有限消费，不是第四个状态机。

## M07 / SafePresentationPlan

### 问题、诊断与取舍

归属U3 Domain `delivery/safe_presentation_plan.rs`；enum=`PresentationState`。全字段/签名回指[Step6 SafePresentationPlan](03_ddd_step_06_domain_contracts.md#safepresentationplan)，C04/E02/J01/J05/Q02。外显许可、能力与投递不同；敏感Gate降级只能明确获准的无敏感/无action存在性提示或route，不能截短审批内容自行降级。原plan含义不能恢复或换材料。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Qualified | 原完整内容当前获准 | 否 | assert_current/invalidate/block；不是永久披露权 |
| Degraded | 正式获准无敏感无动作提示/route | 否 | assert_current/invalidate/block；零审批action |
| Blocked | 原外显依据未立/失效 | 是 | 只读原结果；无恢复 |
| Stale | 原source/target/版本不再适用 | 是 | 只读历史；新含义需新plan |

### ASCII转换图

```text
[prepare] -> Qualified --invalidate--> Stale
          -> Degraded  --invalidate--> Stale
          -> Blocked
             Qualified / Degraded --block--> Blocked
```

从Degraded到Qualified不是合法边；payload永不成为durable plan字段。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| PQ | Delivery.get_plan完整10字段；PresentationQualificationPort.qualify/revalidate给同plan/source_ref_version/binding_context/projection_ref/disclosure_basis/attachment_grants/presentation_kind/capability_ref的CurrentPresentationQualification；实际now/window/受众/Gate适用性与Artifact grant当前齐 |
| PI | Presentation.qualify_invalidation(plan,job.basis)的actual PresentationInvalidationBasisRef；原版本/target/projection/expiry或当前外显资格失效，ExpectedLocalRevision为actual row |

`SafePresentationPlan.prepare` @ C04/E02十参：Established且PermittedContent及三个required Slot齐才Qualified；explicit ApprovedNoticeNoAction/ApprovedRouteNoAction qualification且全部相符才Degraded；Missing/Stale为Blocked，不能默认降级。固定local1、stage_plan Absent；C04/E02同StableEffectIdentity已有结果先复用。Blocked安全plan分支零intent/lane/effect；合格plan连qualified lane/intent在同U首建，未调用平台。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Qualified | Stale | `SafePresentationPlan.invalidate` @ J01/J05 | PI原版本/target/期限、local expected | local next；原refs不换；U plan | E0/E1/E2 |
| Degraded | Stale | `SafePresentationPlan.invalidate` @ J01/J05 | 同上，降级资格也失效 | 同上 | E0/E1/E2 |
| Qualified | Blocked | `SafePresentationPlan.block` @ J01/J05 | PI当前资格不成立+finite reason/local | local next；阻派发；U plan | E0/E1/E2 |
| Degraded | Blocked | `SafePresentationPlan.block` @ J01/J05 | 同上，不创建action | 同上 | E0/E1/E2 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Stale/Blocked恢复或原plan更换source/target/附件，Degraded自动升Qualified | E0/E2；零修改/audit；新含义需要新受权source/plan，不绕原key/effect唯一 |
| Gate默认低敏感、degraded仍附审批action/敏感正文/原token | E4/E2或PE::Denied；存在性与链接也须正式披露资格 |
| current/Artifact grant/Workspace可见性不足仍render/send | PE::Stale/NotEstablished/Unavailable；不缓存正文/URL；Workspace不是权限owner |

具体U：Delivery.stage_plan Present + 完整expected/read-set、原key/result/audit/正式条件handoff；首prepare plan/intent/qualified lane同U，各Absent轴独立。外部IO前再次PQ及binding/secret/window/rate验证；J01失败不把原plan补新材料，Q02只safe slice。planned D逐4边/三factory结果/非法；A敏感Gate/受众；P附件/private payload禁止durable；C不可变effect；L关联CAS/unknown；R当前裁剪。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 4状态/4边与enum/02/原成员一致；三factory分支、PQ/PI/不可变含义、显式无action降级/U/测试已核；无reserved，Gate/Artifact/Workspace实际资格仍未解除 |

## M08 / DeliveryIntent

### 问题、诊断与取舍

归属U3 Domain `delivery/delivery_intent.rs`；enum=`DeliveryIntentState`。全字段/签名回指[Step6 DeliveryIntent](03_ddd_step_06_domain_contracts.md#deliveryintent)，C04/E02/J01/J02/Q02。一个StableEffectIdentity固化原source/projection/target/kind/plan/lane；attempt只能追加，不能换effect绕唯一键。known rejection、NoIo、NoEffect、retry资格不同；禁止先KnownRejected再恢复重试。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Planned | 原含义固化未外呼 | 否 | claim/block/mark_unsupported |
| Dispatching | 当前claim成立，可能有IO | 否 | apply_receipt/schedule_retry/mark_unknown |
| RetryWait | 权威no-effect及完整有限retry资格已记 | 否 | 等全部下界后claim；block/mark_unsupported |
| PlatformAccepted | 原effect平台业务接受 | 是 | 只读/迟到同义结果复用；不等送达或已读 |
| KnownRejected | 原effect确定终态拒绝 | 是 | 只读；不能复活重发 |
| Indeterminate | 原effect可能发生但结果未知 | 否 | 原权威known finalize或全资格same-effect retry |
| Blocked | 临时资格/原材料欠缺，阻新IO | 否 | 只原plan未变且原effect已证无效果才restore_planned |
| Unsupported | 正式method无能力且无合法降级 | 是 | 只读，无send fallback |

### ASCII转换图

```text
[from_plan] -> Planned ----claim----> Dispatching --known--> PlatformAccepted
                ^  |                     |     +--known--> KnownRejected
       restore  |  |                     |
              Blocked <---block--- RetryWait <--no-effect+eligibility--+
                ^                  |                                  |
                |                  +--claim--> Dispatching --unknown--> Indeterminate
          Planned/RetryWait --unsupported--> Unsupported               |
                         Indeterminate --known finalize or qualified retry--+
```

最后一行以矩阵为准：known只两终态，retry只RetryWait；无Indeterminate直接dispatch。

### 字段guard与构造

| 标签 | typed字段 / 实际来源 |
|---|---|
| DC | Delivery.read_snapshot完整11字段/all attempts/receipts/original + Lane.read_snapshot/shared bounds + Installation/Mapping；actual source_projection/target_context/operation_kind/plan_ref/lane_ref/effect_ref及original均固定；全current/bounds经Presentation.qualify_dispatch形成DispatchEligibilityRef、same-tx FencedClaimRef，local expected/now |
| DK | 原immutable PlatformReceipt与AttemptEffectRef/authority/known kind一致；优先读既有receipt，不从ACK/HTTP码制造；apply_receipt只原effect终态accepted或确定不可retry拒绝 |
| DR | Presentation.qualify_retry(tx外)核原DeliverySnapshot/LaneSnapshot/CurrentPresentationQualification/NoEffectBasisRef/TrustedJobContext；RetryEligibilityRef五源no_effect/budget/presentation/window/not_before同effect，所有rate/backoff下界取max，原预算/期限不重置 |
| DB | no-IO前真实current/material缺口；Unsupported必须actual逐method CapabilitySnapshotRef明确unsupported且无合法降级，来源欠缺只Blocked；local expected |
| DP | J02原NoEffect处理的Blocked分支：actual CurrentPresentationQualification + same effect NoEffectBasisRef/local/now；同原plan/source/target/effect，仅临时seam恢复、原plan Qualified/Degraded仍合法；J02原recovery/window/budget/DR完整门禁仍必需，不以restore跳过恢复准入；不能借NoIo/NotFound |

`DeliveryIntent.from_plan` @ C04/E02十二参固定Planned/local1/retry Missing，StableEffectSubject::Delivery及完整DeliveryOperationMeaning一致；同effect unique查询先existing复用。新plan/intent及qualified scope唯一lane同U，lane双Absent首建而非伪existing1；缺fresh lane资格零Planned/IO。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Planned | Dispatching | `DeliveryIntent.claim` @ J01 A | DC同effect/claim/current/all bounds | local next；同U新attempt+lane claim；actual提交不是已IO | E0/E1/E2/E3 |
| RetryWait | Dispatching | `DeliveryIntent.claim` @ J01 A | DC + Established DR、全部等待下界及预算有效 | 同上，原effect不换 | E0/E1/E2/E3 |
| Planned | Blocked | `DeliveryIntent.block` @ J01 | DB真实缺口/local | local next，零receipt/平台IO；U intent | E0/E1/E2 |
| RetryWait | Blocked | `DeliveryIntent.block` @ J01 | DB/local，保原retry历史 | 同上 | E0/E1/E2 |
| Planned | Unsupported | `DeliveryIntent.mark_unsupported` @ J01 | DB正式capability/finite reason/local | 原intent终态；无send替代edit/delete/reply | E0/E1/E2 |
| RetryWait | Unsupported | `DeliveryIntent.mark_unsupported` @ J01 | 同上 | 同上 | E0/E1/E2 |
| Dispatching | PlatformAccepted | `DeliveryIntent.apply_receipt` @ J01 C/J02 | DK Accepted/local | known结果引用，U attempt/receipt/intent/lane | E0/E1/E2/E3 |
| Dispatching | KnownRejected | `DeliveryIntent.apply_receipt` @ J01 C/J02 | DK确定终态Rejected/local | 原拒绝保真，非transport错误 | E0/E1/E2/E3 |
| Dispatching | RetryWait | `DeliveryIntent.schedule_retry` @ J01 C/J02 | DR完整五源/local/now | 建立retry_basis/local next；零新attempt/send | E0/E1/E2/E3 |
| Dispatching | Indeterminate | `DeliveryIntent.mark_unknown` @ J01 C | actual同AttemptEffectRef/finite reason/local | 保原effect/claim/head；U intent+attempt/lane | E0/E1/E2 |
| Indeterminate | PlatformAccepted | `DeliveryIntent.apply_receipt` @ J02 | DK权威同effect known | 只finalize；不再次dispatch | E0/E1/E2/E3 |
| Indeterminate | KnownRejected | `DeliveryIntent.apply_receipt` @ J02 | DK确定原effect拒绝 | 同上 | E0/E1/E2/E3 |
| Indeterminate | RetryWait | `DeliveryIntent.schedule_retry` @ J02 | DR同effect权威NoEffect，非NoIo | 只记eligibility；后续J01重新全部核验 | E0/E1/E2/E3 |
| Blocked | Planned | `DeliveryIntent.restore_planned` @ J02 | DP，完整原plan仍有效 | 原含义恢复/local next；同U原subject+recovery；零IO | E0/E1/E2/E3 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| 三终态出边、Indeterminate直接claim、Blocked schedule_retry、KnownRejected -> RetryWait | E0/E3；零修改/audit，不能利用普通错误隐藏known结果 |
| 拒绝/timeout/NoIo/lease/NotFound直接给NoEffect，重置budget/window或缩短下界 | E2/E3；PE::NotEstablished/Unavailable，原head/effect保留 |
| 原effect换plan/source/target/parent/method/secret版本，edit/delete/reply退化为send | E0/E1/E2/E4；零第二effect/正文缓存 |

DP是J02原Intent/NoEffect flow的state-specific选择：Blocked只能原`restore_planned`，Dispatching/Indeterminate才三参`schedule_retry`，不能无条件照片段对Blocked调用；不新增entry/port/资格源。J05 body allowlist无Intent，02概念J05触发不能直接执行本机成员；只按其原关联资格维护阻current，J01/J02承担本表具名边。

具体U：A完整intent/lane双轴+新Attempt Absent+原key/result/audit；B原attempt InFlight提交后last current/private/secret短借，PlatformDelivery.dispatch至多一次；C/D/J02完整原intent/attempt/lane/receipt(新才Absent)及合格mapping同U，不能部分释放head或覆A结果。DP/J02 recovery同原subject CAS，不自动send；unknown只权威只读probe/manual。planned D逐14边；C同effect/NoEffect/等待/late known；L全关联CAS/unique/原mutation；B全rate/业务结果/method差异；A/Gate与P private/secret日志禁区；J有界invocation，R current slice。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 8状态/14边与enum/02/原成员一致；DC/DK/DR/DB/DP完整原字段/取得面/U已核，DP state分派不允许Blocked schedule_retry、J05 body不授Intent；三终态不复活、零新增reserved，测试沿原target，平台/恢复资格仍未建立 |

## M09 / DeliveryAttempt

### 问题、诊断与取舍

归属U3 Domain `delivery/delivery_attempt.rs`；enum=`DeliveryAttemptState`。全字段/签名回指[Step6 DeliveryAttempt](03_ddd_step_06_domain_contracts.md#deliveryattempt)，J01/J02/Q02。Claimed不证明未IO，InFlight不证明送达；采用先A实际claim，再B实际InFlight，最后private seam一次dispatch。NoIo是原attempt权威证明，不是业务NoEffect/恢复资格。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Claimed | 原attempt claim已准备，尚未证外呼 | 否 | begin_io/权威record_not_dispatched/恢复mark_unknown |
| InFlight | 原请求可能离开private seam | 否 | record_result/mark_unknown；无回Claimed |
| KnownAccepted | 原attempt权威business接受 | 是 | immutable receipt/history读取，非用户已读 |
| KnownRejected | 原attempt权威business拒绝 | 是 | 只读；intent retry另核，不重用attempt |
| Indeterminate | 原attempt效果无法确定 | 否 | 权威known或NoIo finalize；不直接begin_io |
| NotDispatched | 权威已证原attempt从未IO | 是 | 只读；不等intent自动retry |

### ASCII转换图

```text
[claim_for] -> Claimed --begin_io--> InFlight --known--> KnownAccepted/KnownRejected
                |                       |                       ^
          NoIo  |  crash unknown         | unknown               | known
                v       +---------------+--> Indeterminate -----+
          NotDispatched <--- authoritative NoIo ---------+
```

无InFlight -> NotDispatched；J01 B后实际NoIo必须先合法C Indeterminate，再actual行独立D finalize。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| AC | Delivery.get_attempt/read_snapshot完整8字段；intent_effect/claim_ref/qualification_ref/attempt_window来自same effect资格/actual FencedClaimRef；actual local expected、now；final current资格与fence/window和全部bounds一致 |
| AK | PlatformDelivery实际KnownPlatformBusinessResult或J02原权威ProbeOutcome::Platform完整known，原PlatformBusinessResultRef同attempt/effect/method/authority；known SlotEstablished，SDK status/ACK不足 |
| AN | 同attempt NoIoProofRef来自actual driver/正式边界证明或可正式再取得的原retained proof；非NoEffectBasisRef/lease/timeout；local expected实际行 |

`DeliveryAttempt.claim_for` @ J01 A七参固定Claimed/local1/result Missing；same-tx原Lane.reserve_claim + Intent.claim/Lane.claim，全关联expected，Attempt.stage Absent实际A提交后读取。B `begin_io`候选实际提交后才能跨private/secret，commit未知零dispatch。Claimed crash不可证明IO只恢复unknown。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Claimed | InFlight | `DeliveryAttempt.begin_io` @ J01 B | AC当前fence/资格/local/now，actual A | local next；U attempt；actual B后一次IO | E0/E1/E2 |
| Claimed | NotDispatched | `DeliveryAttempt.record_not_dispatched` @ J01/J02原NoIo finalize | AN权威未IO + 原actual Claimed | local next；终态attempt；lane/intent各合法边另核 | E0/E1/E2/E3 |
| InFlight | KnownAccepted | `DeliveryAttempt.record_result` @ J01 C/J02 | AK Accepted/local | result SlotEstablished；U attempt/intent/receipt/lane | E0/E1/E2/E3 |
| InFlight | KnownRejected | `DeliveryAttempt.record_result` @ J01 C/J02 | AK Rejected/local | 同上；retry资格不由本标签授予 | E0/E1/E2/E3 |
| InFlight | Indeterminate | `DeliveryAttempt.mark_unknown` @ J01 C | actual原可能IO、finite reason/local | 保claim/effect；U关联unknown head | E0/E1/E2 |
| Claimed | Indeterminate | `DeliveryAttempt.mark_unknown` @ J02 crash恢复 | actual原stage无法证IO/local | local next；保original，不造receipt | E0/E1/E2 |
| Indeterminate | KnownAccepted | `DeliveryAttempt.record_result` @ J02 | AK权威同attempt accepted | 只finalize，零再次dispatch | E0/E1/E2/E3 |
| Indeterminate | KnownRejected | `DeliveryAttempt.record_result` @ J02 | AK权威确定拒绝 | 同上 | E0/E1/E2/E3 |
| Indeterminate | NotDispatched | `DeliveryAttempt.record_not_dispatched` @ J01 D/J02原NoIo finalize | AN，C实际提交后的original行 | 只finalize；旧attempt不可重用 | E0/E1/E2/E3 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| InFlight直接NotDispatched、Claimed直接known Accepted、任一终态/Indeterminate再次begin_io | E0/E3；零修改/audit/第二IO；已知结果保原original |
| NoEffect/HTTP error/lease代AN、取得ACK当AK、自动SDK retry换attempt | E2/E3、PE::NotEstablished/Unavailable；不以超时制造NoIo |
| 原fence/secret current/全部bound失效仍IO，payload或SDK raw error入safe记录 | E2/E4/PE::Stale；实际known结果仍原safe材料交接 |

具体U：A新Attempt+原Intent/Lane claim全CAS；B attempt Present+原全read-set/result/audit；C/D/J02原attempt/intent/lane必要联动、new receipt仅actual known时Absent、known mapping合格才同U；旧receipt优先immutable复用。实际NoIo若发生于B后，C防守性Indeterminate保存责任后D按AN，本表不虚构新的ProbeOutcome::NoIo；只能actual proof满足。DK/DR/DP在Intent机决定去向，AN不自动授权retry。planned D逐9边/非法；L A/B/C/D crash、原mutation/unique；C同attempt/noIO vs noeffect/late结果；B业务分类/rate；P短借及raw日志禁区；J有界取消；R各stage独立读取。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 6状态/9边匹配enum/02/原成员；AC/AK/AN及B后C实际unknown->D actual NoIo次序、receipt immutable/全关联CAS/U/测试已核；不虚构NoIo probe variant，无reserved；真实proof未立不推进 |
