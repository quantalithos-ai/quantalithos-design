# L6-bridges 03 Step10：owner及consumer交接责任状态

共用E0~E4/U/测试简称见[主文件§6](03_ddd_step_10_state_matrix.md#6-共用转换错误与副作用契约)。按M06/M10/M11/M17实际到达追加；交接记录不拥有内部Conversation/Turn、Gate/Decision或Observability的truth。

## M06 / InboundHandoffRecord

### 问题、诊断与取舍

归属U2 Domain `inbound/inbound_handoff_record.rs`；enum=`InboundHandoffState`。全字段/签名回指[Step6 InboundHandoffRecord](03_ddd_step_06_domain_contracts.md#inboundhandoffrecord)，E01/J02/Q02。分来源验证、内部资格、原owner op交接、ACK及结果；采用A Verified、B claim actual提交、C结果actual提交，不用平台ACK当Turn提交，不缓存正文支持恢复。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Verified | 来源成立，不等内部材料/权限齐 | 否 | qualify/block/quarantine/begin_handoff |
| Blocked | 原材料或内部资格欠缺 | 否 | qualify；完整原no-effect/recovery下begin_handoff |
| Quarantined | 回环/冲突等安全隔离 | 是 | 受限历史，零owner IO |
| HandoffPending | 原op durable接管，效果可能发生 | 否 | apply_owner_result/mark_unknown；不得无据第二次交接 |
| OwnerAccepted | 原op正式owner accepted ref | 是 | 只final history；非外部送达 |
| OwnerRejected | 原op正式owner拒绝 | 是 | 只final history；不换op重交 |
| Indeterminate | owner效果可能发生但结果未知 | 否 | 原op权威finalize；权威no-effect+全部资格才resume |

### ASCII转换图

```text
[from_verified] -> Verified --block--> Blocked
                    |                  |
                    +----qualified-----+--> HandoffPending
                    |                           |    |
                quarantine                 known|    |unknown
                    v                           v    v
                Quarantined       OwnerAccepted/OwnerRejected
                                                ^    Indeterminate
                                                |      |
                                                +known-+
             Indeterminate --qualified same-op no-effect--> HandoffPending
```

来源验证或ACK不能越过claim/current/material/digest guard；图的known箭头均同原op。

### 字段guard与构造

| 标签 | typed字段 / 实际取得 |
|---|---|
| HV | PlatformIngress.verify原verified_source/origin/source；完整SourceOperationMeaning与Mapping.read_authorized_snapshot、source/version先成立。fresh缺mapping/source/version零record/dedup/audit/result；未verified raw也不能创建记录 |
| HQ | 原14字段、operation_ref/verified_source/origin不变；Binding current、Actor责任、Conversation.resolve_target_mode/qualify_material/revalidate_material给mapping_context/target_mode/actor_ref/material_ref/required_digest_ref；AppendFact正式Integration/BridgeMapped责任及owner-required digest，UnknownRequirement拒绝；附件只Artifact authorized grant/ref |
| HC | UoW.reserve_handoff_claim同subject/op/source/window，HandoffClaimRef；local expected为actual A baseline；完整HQ/now，B actual commit后last current/material/secret短借才能handoff一次 |
| HR | Blocked/Indeterminate重入必须same original NoEffectBasisRef + RecoveryQualificationRef、原source材料可正式再取、recovery窗口/预算及全部HQ；C06/J02只给原恢复资格/权威结果，不在J02再次owner IO |
| HO | actual OwnerHandoffResultRef同operation/target/source；Accepted有真实OwnerAcceptedRef，Rejected有正式确定依据；Pending不是Rejected/no-effect，Unknown调用mark_unknown |

`InboundHandoffRecord.from_verified` @ E01 A十二参固定Verified/local1、owner_result Missing；可缺非required Slots不授权durable，HV完整meaning仍必要。首建Inbound.stage Absent + 原dedup/A seed/audit/条件handoff实际U。既有Verified才能下一B；禁止首候选直接连调成员以Present伪existing。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Verified | Blocked | `InboundHandoffRecord.block` @ E01 | HV已有原行+finite材料/权限缺口/local | local next；安全拒绝；U inbound | E0/E1/E2 |
| Verified | Quarantined | `InboundHandoffRecord.quarantine` @ E01 | HV已有原meaning/row、finite loop/conflict/local | local next；零raw/假actor；U inbound | E0/E1/E2/E4 |
| Verified | HandoffPending | `InboundHandoffRecord.begin_handoff` @ E01 B | HC/HQ，首次resume/recovery None | claim对应接管、local next；actual B才可能owner IO | E0/E1/E2 |
| Blocked | HandoffPending | `InboundHandoffRecord.begin_handoff` @ E01原op重入 | HR + HC/HQ完整 | 同op续接、零新original；U inbound | E0/E1/E2/E3 |
| HandoffPending | OwnerAccepted | `InboundHandoffRecord.apply_owner_result` @ E01 C/J02 | HO Accepted/local expected | actual owner_result/accepted关联；U inbound+合格known mapping | E0/E1/E2/E3 |
| HandoffPending | OwnerRejected | `InboundHandoffRecord.apply_owner_result` @ E01 C/J02 | HO Rejected/local expected | 原拒绝结果保真；U inbound | E0/E1/E2/E3 |
| HandoffPending | Indeterminate | `InboundHandoffRecord.mark_unknown` @ E01 C | 同op可能effect但无known/local | 保original/claim、local next；U inbound | E0/E1/E2 |
| Indeterminate | OwnerAccepted | `InboundHandoffRecord.apply_owner_result` @ J02 | HO权威同op已知/local | known-only finalize，零再次handoff | E0/E1/E2/E3 |
| Indeterminate | OwnerRejected | `InboundHandoffRecord.apply_owner_result` @ J02 | HO权威确定拒绝/local | 同上 | E0/E1/E2/E3 |
| Indeterminate | HandoffPending | `InboundHandoffRecord.begin_handoff` @ E01原op重入 | HR + HC/HQ，unknown不能冒NoEffect | same op有据续接；actual claim后才外部调用 | E0/E1/E2/E3 |

### 同态维护、非法与副作用

`qualify`仅Verified/Blocked字段维护：七参HQ/local/now，原op/source固定，mode/actor/digest/source版本一致；不自行升HandoffPending。`apply_owner_result`的Pending只HandoffPending同态记录，Indeterminate不能被Pending降级。`record_protocol_disposition`仅actual原verified source ACK字段，业务state不变、local expected另核；重复同ACK零mutation，终态历史ACK也不复活业务。

| 非法请求 | 精确处置 / audit |
|---|---|
| ACK/HTTP 2xx -> OwnerAccepted、digest UnknownRequirement当NotRequired、source-only造durable | E2/E3；fresh零U/audit，已原op保责任；无Turn真相创建 |
| Quarantined/OwnerAccepted/OwnerRejected回边、unknown由NotFound/lease/取消推出resume | E0/E3；不生成新op或重交正文 |
| revoked/expired材料仍owner IO、正文/token/敏感审批或附件URL入record/audit | PE::Stale/Denied/NotEstablished或E2/E4；private短借在tx外，原known结果不丢 |

具体U：A/B/C各原mutation，Inbound.stage + 完整expected/read-set、原dedup/immutable A seed/audit/正式条件handoff；B含same-tx claim，C如合格known回链再Mapping.stage_message同U；零隐式Tombstone/owner实体删除。post-effect失败保actual结果及原mutation，不用`?`丢original；Q02零write/probe。planned D逐10边/同态/非法；A责任/Gate/digest；Cmeaning/op/NoEffect/late result；L A/B/C crash与immutable seed；B/I/W各ACK/source-mode/cancel；P材料/secret禁止日志。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 7状态/10边匹配enum/02/原成员；HV零durable、HC actual claim、HR同op恢复/HQ材料/HO known、三U及ACK同态已核；无reserved，不以本地pass宣Turn/送达或owner兼容ready |

## M10 / ExternalActionBinding

### 问题、诊断与取舍

归属U4 Domain `callback/external_action_binding.rs`；enum=`ExternalActionState`。全字段/签名回指[Step6 ExternalActionBinding](03_ddd_step_06_domain_contracts.md#externalactionbinding)，C05/E03/J05/Q02。平台签名、source message、内部actor动作授权与one-use四者独立；采用完整known source资格初绑，one-use原子接管后永久不释放/复活，不从外部按钮token授审批权。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Active | 原source/责任/target/action/expiry完整，尚未消费 | 否 | assert_current/claim_once/expire/revoke |
| Claimed | one-use永久绑定原callback/op | 是 | 原callback结果对账；不回Active |
| Expired | 正式期限已到 | 是 | 受限history；不续token/期限 |
| Revoked | 原action/relation受权撤销 | 是 | 原known结果保真，不复活 |

### ASCII转换图

```text
[bind] -> Active --claim_once--> Claimed
             +----expire------> Expired
             +----revoke------> Revoked
```

Claimed只是one-use接管，不是owner批准/Decision产生。

### 字段guard与构造

| 标签 | typed字段 / 实际来源 |
|---|---|
| XA | Callback.get_action及known source_intent/installation、12字段；CallbackVerification.verify_bound_source、ActorResponsibility.revalidate、OwnerAction.qualify_binding/qualify_action共同核actor_responsibility/target_action/owner_revision/binding_generation/expiry_one_use/authorization_basis；CurrentActionQualification同原source/actor/动作/期限/current撤销 |
| XC | E03完整QualifiedCallbackContext/OwnerActionQualificationRef、same-tx UoW.reserve_one_use实际OneUseClaimRef同action/callback/operation，one_use_claim Missing、actual local expected/now；owner执行仍二次Policy/Gate核验 |
| XE | J05 OwnerAction.qualify_expiry的actual ActionExpiryOneUseRef与原source/action及actual now，local expected；后台未落Expired也即时拒绝E03 IO |
| XR | J05 Binding.qualify_revocation actual RevocationBasisRef同action/relation/actor/scope/local；不能从reason/current Stale直接cast |

`ExternalActionBinding.bind` @ C05十二参固定Active/local1/one_use Missing；必须C05 ActionBindingQualification八字段完整且explicit允许action/disclosure，known source message合法；Callback.stage_action Absent/source unique。签名source-only或降级plan不可建Active；C05零claim/owner IO。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Active | Claimed | `ExternalActionBinding.claim_once` @ E03 B | XA/XC full current/local/now | one_use Established与原op固定；同U callback OwnerPending+dedup | E0/E1/E2/E3 |
| Active | Expired | `ExternalActionBinding.expire` @ J05 | XE actual正式expiry/local/now | local next；原source/授权历史保留；U action | E0/E1/E2 |
| Active | Revoked | `ExternalActionBinding.revoke` @ J05 | XR actual原basis/local | local next；阻后续动作；U action | E0/E1/E2 |

### 非法与副作用

| 非法请求 | 精确处置 / audit |
|---|---|
| Claimed重复claim/expire/revoke或回Active，cancel/owner拒绝释放one-use | E0/E3；零修改/audit/重批，原callback/op只权威finalize |
| 换actor/message/target/owner_revision/generation、expired窗口或raw choice当owner动作 | E1/E2/E4、PE::Denied/Stale/NotEstablished；按钮来源不授权内部审批 |
| C02直接调用action.revoke或E03拒绝自动落Expired | 当前C02只relation；当前E03 expiry先安全拒绝，持久维护仅具名J05；零新wire action/副作用 |

具体U：E03 B完整action/callback local expected + reserve_one_use + Callback.begin_handoff + 原key/immutable result/audit/条件handoff，actual commit后last XA/current才OwnerAction.handoff。J05维护只有Active合法边，C02 relation撤销即时令XA失效，背景J05实际XR才落Revoked；原已Claimed不撤销owner事实。Q02 current裁剪不授动作。planned D逐3边/终态补集；A/Gate全责任/owner revision；C same one-use/op/replay；L原子claim/并发winner/unknown；Bcallback签名source差异；P敏感审批/token禁日志；I/W入口责任。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 4状态/3边匹配enum/02/原成员；C05完整known source、XA/XC/XE/XR及one-use同U/J05实际维护/测试已核，C02/E03无隐式新增写边；无reserved，Claimed永久不复活 |

## M11 / CallbackHandoffRecord

### 问题、诊断与取舍

归属U4 Domain `callback/callback_handoff_record.rs`；enum=`CallbackHandoffState`。全字段/签名回指[Step6 CallbackHandoffRecord](03_ddd_step_06_domain_contracts.md#callbackhandoffrecord)，E03/J02/Q02。来源签名只验证来源，raw choice须正式安全owner语义映射、责任/target/owner revision/Gate/期限全部再核；采用Verified A、one-use/OwnerPending B、known/unknown C。不存在回Indeterminate重新approve路径。

### 状态集合

| 状态 | 作用 | 是否终态 | 允许关键操作 |
|---|---|---|---|
| Verified | 完整callback来源责任与target/action已验 | 否 | begin_handoff/block/reject |
| Blocked | 原正式合同/basis不可用 | 是 | 只读；不恢复审批 |
| Rejected | 原已验证记录的过期/冲突/跨target拒绝 | 是 | 只读；未验源不能造此durable记录 |
| OwnerPending | 原one-use/op durable，动作可能发生 | 否 | apply_owner_result/mark_unknown |
| OwnerAccepted | owner二次验证后的实际动作结果 | 是 | 历史读取，非Bridges自产Decision |
| OwnerRejected | owner确定拒绝 | 是 | 历史读取，one-use不释放 |
| Indeterminate | 原owner动作效果未知 | 否 | 权威same-op known finalize；零再次handoff |

### ASCII转换图

```text
[from_verified] -> Verified --complete one-use claim--> OwnerPending
                    |  |                                   |   |
                  block reject                          known unknown
                    v  v                                   v   v
                 Blocked Rejected             OwnerAccepted/OwnerRejected
                                                         ^   Indeterminate
                                                         +------known------+
```

ACK/defer是独立字段，OwnerPending/Indeterminate无回Verified/Active。

### 字段guard与构造

| 标签 | typed字段 / 唯一来源 |
|---|---|
| CVF | CallbackVerification.verify_source_only -> actual action/known message + actor责任/owner安全语义/current/expiry -> verify complete QualifiedCallbackContext；原10字段action_binding_ref/verification_ref/owner_action_ref三Slot必Established、同account/source/action/target/generation/revision；仅source-only失败零Verified |
| CVC | actual reserve_one_use OneUseClaimRef同action/callback/operation，OwnerActionQualificationRef/CurrentActionQualification全一致，local expected实际A baseline/now；Action.claim_once + 本record.begin_handoff同B U |
| CVO | actual OwnerActionResultRef同operation/target/action/owner authority；Accepted/Rejected是known原结果；Pending只同态OwnerPending，不作NoEffect；owner执行二次Policy/Gate不被Bridges替代 |

`CallbackHandoffRecord.from_verified` @ E03 A九参固定Verified/local1、三required Slot Established、one_use/owner_result Missing；无raw choice/token/context。未达到CVF只有entry finite拒绝/blocked，不能“受控失败factory”假造Verified；当前无另一个fresh Blocked/Rejected factory。已有合法actual记录下一阶段才block/reject。

### 转换矩阵

| From | To | 触发成员 / flow | 字段guard | 候选副作用 / 提交组 | 非法错误 |
|---|---|---|---|---|---|
| Verified | OwnerPending | `CallbackHandoffRecord.begin_handoff` @ E03 B | CVF/CVC all current/local/now | one_use原op绑定、local next；同U action Claimed | E0/E1/E2/E3 |
| Verified | Blocked | `CallbackHandoffRecord.block` @ E03 | 已有CVF record、finite合同缺口/local | local next；安全拒绝；零claim/owner | E0/E1/E2 |
| Verified | Rejected | `CallbackHandoffRecord.reject` @ E03 | 已有CVF record、finite冲突/期限/local | local next；不保存被拒raw | E0/E1/E2/E4 |
| OwnerPending | OwnerAccepted | `CallbackHandoffRecord.apply_owner_result` @ E03 C/J02 | CVO known Accepted/local | owner_result Established；U callback/原关联 | E0/E1/E2/E3 |
| OwnerPending | OwnerRejected | `CallbackHandoffRecord.apply_owner_result` @ E03 C/J02 | CVO known Rejected/local | 原拒绝保真；action仍Claimed | E0/E1/E2/E3 |
| OwnerPending | Indeterminate | `CallbackHandoffRecord.mark_unknown` @ E03 C | actual同op可能effect、finite reason/local | 保one-use/original；零再approve | E0/E1/E2 |
| Indeterminate | OwnerAccepted | `CallbackHandoffRecord.apply_owner_result` @ J02 | CVO权威same-op Accepted | 只finalize；action不回Active | E0/E1/E2/E3 |
| Indeterminate | OwnerRejected | `CallbackHandoffRecord.apply_owner_result` @ J02 | CVO权威same-op Rejected | 同上 | E0/E1/E2/E3 |

### 同态、非法与副作用

`apply_owner_result`的Pending仅OwnerPending同态记录原安全结果，Indeterminate的迟到Pending不降级；`record_protocol_disposition`只actual原source ACK字段、业务state不变/local expected另核，重复无变不写audit。不用ACK状态控制one-use或owner结果。

| 非法请求 | 精确处置 / audit |
|---|---|
| Indeterminate续交/重新claim、终态回Verified、Rejected/owner拒绝释放one-use | E0/E3；零新mutation/audit/owner动作，原op权威只读恢复 |
| 签名/source-only直接Verified/OwnerPending，跨account/target/action/owner revision、降级展示含action | E2/E4或PE::Denied/Stale/NotEstablished；不绕Policy/Gate |

具体U：A Callback.stage_callback Absent及原dedup/A seed/audit；B full action/callback expected + reserve_one_use/Action.claim_once/OwnerPending同U，actual B提交后重核current才OwnerAction.handoff一次；C/J02 callback Present+原action/read-set/dedup/immutable seed/audit/正式条件handoff，action Claimed不修改。post-effect未知保original/phase，零raw审批日志、zero Decision/Turn真相/新报告。planned D逐8边/同态/终态补集；A二次Policy/Gate/actor revision；C重放/one-use/late结果；L A/B/C unknown；B/I/W不同callback协议/ACK；P敏感材料禁日志；R当前不披露审批存在性。

### 单机停审

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned测试 | pass_design_static | 7状态/8边匹配enum/02/原成员；CVF三Slot全资格、CVC same-tx one-use/actual B、CVO二验known及ACK同态/U/测试已核，无fresh失败factory或resume审批；无reserved、owner准入不提升 |

## M17 / SafeHandoffRecord

### 问题、诊断与取舍

归属U6 Domain `traceability/safe_handoff_record.rs`；enum=`SafeHandoffState`。全字段/签名回指[Step6 SafeHandoffRecord](03_ddd_step_06_domain_contracts.md#safehandoffrecord)，触发回指Step9共享§8条件O01、Job§4/J04及§5/J05、Inbound§4/E04、Job§2/J02。它只保存已获准的 canonical body-free 材料引用、producer admission、consumer namespace operation、claim 和 consumer disposition；不拥有 Observability、evidence、report、verdict 或平台/consumer 真相。`ConsumerAccepted` 仅表示正式 consumer 结果，不表示 evidence、验收或 signoff。

M17 的风险是把“可再次交接”误写成通用 outbox 或把 ACK/timeout/NotFound 当作 NoEffect。取舍是严格四阶段：先读取原记录与正式 readonly consumer qualification，再在实际 durable claim/phase commit 后交接；只有同 operation、同 canonical、同 source/schema/window 的权威 `NoEffectBasisRef` 才允许 `resume_pending`。任何未知继续保留原 claim/material/op。

### 状态集合与 ASCII

| 状态 | 作用 | 终态 | 允许关键操作 |
|---|---|---:|---|
| Pending | canonical/admission/current 已齐，尚未 claim | 否 | begin_handoff/block |
| Dispatching | 原 consumer op 已 durable claim，可能已发生交接 | 否 | apply_consumer_result/mark_unknown/block |
| ConsumerAccepted | consumer 正式接纳结果 | 是 | 只读；不可重交 |
| ConsumerRejected | consumer 正式拒绝结果 | 是 | 只读；不可重交 |
| Indeterminate | 交接可能发生但结果未知 | 否 | 权威同op结果；NoEffect 后 resume_pending |
| Blocked | schema/admission/material/current 不可用；原可能效果/claim仍保留 | 否 | 同原材料/op、正式NoEffect及current全齐才 resume_pending；无证明只保责任 |

```text
from_canonical
      |
      v
   Pending --claim + durable phase--> Dispatching --known Accepted--> ConsumerAccepted
      |                                      |  \--known Rejected--> ConsumerRejected
      |                                      \--unknown/timeout----> Indeterminate
      \--current lost---------------------------------------------> Blocked

Indeterminate --same-op authoritative NoEffect + current--> Pending
Blocked      --same canonical/op + formal NoEffect + current--> Pending
Pending/Dispatching --J05 maintenance basis invalid--> Blocked
```

ACK 只进入 `ProtocolAckDisposition`，不推动上述业务状态；`ConsumerResultKind::Pending` 只能在 `Dispatching` 同态记录，不能把 `Indeterminate` 复活为 Pending。

### 字段 guard、构造与唯一来源

| 标签 | typed 条件 / 唯一来源 |
|---|---|
| HF | `SafeHandoffRecord::from_canonical` 十一参：实际 `SafeAuditRecord`、`CanonicalSafeMaterialRef`、`ProducerAdmissionRef`、原 consumer `BridgeOperationRef`、schema/retention/current/now；consumer_result 与 claim 均 `Missing`。缺 canonical/admission/schema/window 不创建 Pending。 |
| HC | `SafeTraceRepository.reserve_handoff_claim` + `begin_handoff`；same source audit/material/schema/admission/original op/current，actual local expected/now；claim 和 record phase 在同 UoW，commit 后才准许 foreign consumer IO。 |
| HK | `ConsumerDispositionRef` 必须同 handoff operation/source/schema；`Accepted`/`Rejected` 是正式 known result；`Pending` 只同态，不证明未接纳。 |
| HU | `mark_unknown` 仅 actual Dispatching 且可能 effect；保留 claim、material、operation 和原 immutable seed。 |
| HR | `resume_pending` 仅 `Indeterminate`/`Blocked`，同 canonical/op/source/schema/window，正式 `NoEffectBasisRef` + 当前 admission/retention/预算；先实际 local commit，下一次 claim 才另起 U。 |
| HB | `block` 仅J05已有 Pending/Dispatching 行、实际 `QualificationMaintenanceBasisRef` 与有限 reason；Dispatching 已发生未知时不清 claim、不换材料。J04/E04资格失败的finite Blocked返回不等此durable边。 |

`from_canonical`仅条件O01附着的actual业务mutation，在正式Mandatory/OptionalQualified分支以原audit/canonical/admission在同U首建Pending；它不是发送入口。J04只读/推进既有原handoff，E04只finalize原consumer结果，两者均不首建Pending。`rehydrate` 只接受同 subject/revision 的 `LocalHydrationBasisRef`，不重新授权。Q04 只读，不创建、修复、resume 或触发 consumer。

### 转换矩阵

| From | To | 具名成员 / flow | 必要 guard | U / 外部副作用 | 非法错误 |
|---|---|---|---|---|---|
| Pending | Dispatching | `begin_handoff` @ J04 A（O01后也复用此唯一claim通路） | HF/HC 全 current、claim 实际 reservation、local CAS | audit/dedup/immutable seed/record/claim 同 U；commit unknown 不外呼 | E0/E1/E2/E3 |
| Pending | Blocked | `block` @ J05 | HB actual basis/current 失效 | 保 canonical/op；安全 local mutation，零 consumer IO | E0/E1/E2 |
| Dispatching | ConsumerAccepted | `apply_consumer_result` @ E04/J04 B/J02 B | HK actual same-op known Accepted + local CAS | 结果关联原 row/seed/audit；不产生新 canonical/O01 | E0/E1/E2/E3 |
| Dispatching | ConsumerRejected | `apply_consumer_result` @ E04/J04 B/J02 B | HK actual same-op known Rejected + local CAS | 同上；Rejected 不释放 claim 语义之外的事实 | E0/E1/E2/E3 |
| Dispatching | Indeterminate | `mark_unknown` @ E04/J04 B | HU actual possible effect/finite reason/local | 保原 claim/material/op；不新增 producer/consumer call | E0/E1/E2 |
| Dispatching | Blocked | `block` @ J05 | HB 合法维护 basis；保 unknown claim | local-only block；零重交 | E0/E1/E2/E3 |
| Indeterminate | ConsumerAccepted | `apply_consumer_result` @ E04/J02/J04 | HK 权威 same-op Accepted | known-only finalize；不回 Pending/不重交 | E0/E1/E2/E3 |
| Indeterminate | ConsumerRejected | `apply_consumer_result` @ E04/J02/J04 | HK 权威 same-op Rejected | 同上 | E0/E1/E2/E3 |
| Indeterminate | Pending | `resume_pending` @ J04 R | HR formal NoEffect + current/admission/预算全齐 | 原 record actual commit；下一 U 才 claim/外呼 | E0/E1/E2/E3 |
| Blocked | Pending | `resume_pending` @ J04 R | HR 同原材料/op、实际 NoEffect/current requalification | 同上；不凭 timeout/NotFound/ACK lost | E0/E1/E2/E3 |

### 非法、错误与副作用边界

| 非法请求 | 处置 |
|---|---|
| ACK/HTTP 2xx/transport close -> ConsumerAccepted，或 timeout/NotFound -> NoEffect | `E0/E3` 或原 `PE::Indeterminate`；保原 operation/claim/material，零重交。 |
| Indeterminate 直接 `begin_handoff`、换 consumer op/material/schema、重复 claim、终态回 Pending | `E0/E2/E3`；不产生新 canonical、audit、operation 或 consumer IO。 |
| 从 `ConsumerResultKind::Pending`/Rejected 伪造 NoEffect，或把 owner/platform/local commit 当 consumer result | `E1/E2/E3`；保持原阶段，必要时 Manual/Blocked。 |
| raw body/token/secret/敏感 gate 内容进入 record、audit 或 error | `E4 = CV::ForbiddenMaterial`，pure输入外映射为已有`PE::InvalidInput(ContractViolation::ForbiddenMaterial)`；只保存正式canonical的typed safe ref，禁止 raw/reversible 派生。 |

具体 U 顺序：初建仅O01条件附着的原业务U；J04先tx外读原 handoff/audit/material/current与正式 readonly consumer result。known优先result-only；`R`仅Indeterminate/Blocked且实际NoEffect/current全齐时提交Pending，先actual提交再新读原行。`A`在同U reserve claim + begin_handoff + 原dedup/immutable seed/audit，actual commit后最后current核验才handoff；`B`tx外接结果后原row CAS finalize。J02/E04只原结果finalize，J05只HB维护block；所有original-handoff lifecycle阶段均须tx外正式NonRecursiveResultOnly规则覆盖该阶段全部拟写subjects，audit必需、handoff=None，缺规则零begin/stage/IO，不默认audit-only。claim/commit unknown保原op，零新claim或外呼。Blocked带旧claim并没有known finalize出边；迟到known须保host原结果/责任并走受权人工出口，不捏NoEffect复活或发明Blocked->ConsumerAccepted边。不能新建outbox/report/evidence或第二producer。

### planned 测试切口与单机停审

沿Step9§7.5唯一planned索引A/C/R/D/B/L/P/S/W/J规划：十条合法边逐行、终态/同态/错误补集；commit-before-send、claim竞争、consumer known/unknown、ACK分离、formal NoEffect、原op/material不变、逐阶段非递归rule、Blocked迟到known保责任、敏感材料零泄露、Q04零写。Worker target是原`crates/worker/tests/consumer_dispatch_tests.rs`，不新造worker boundary测试文件。均为planned，未执行。

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| enum/状态/边/函数/guard/副作用/planned 测试 | pass_design_static_fail_closed | 6状态/10迁移；X纠正factory/claim只O01附着及J04、result-only E04/J02、J05只block、逐阶段非递归rule与exact错误/Worker target；成员/enum未改。resume只formal NoEffect、Blocked late-known不补边；BR-UP-006/O01 admission仍未建立。 |
