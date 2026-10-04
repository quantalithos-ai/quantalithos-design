# L6-bridges 06 Step6：边界红线

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step6 / 书写§5.6；回填正式06§6。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| boundary_gate | pass | design_static_only_external_gates_open | enter_step_7 | 00§10~11/14；01§8~9/14；03§6/8/13/16.3~16.5；04§8；05 CUT-BR-BIND/MAP/PRIVATE/READ/AUDIT/SURFACE/REAL；Step5全部16FR卡。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

所有权/授权/私有secret与正文/阶段/变化/附件/action/连续性/读取/依赖与P1共16项；全部对应原BR/DR，无新增第七VETO。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§6已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

00§10~11/14；01§8~9/14；03§6/8/13/16.3~16.5；04§8；05 CUT-BR-BIND/MAP/PRIVATE/READ/AUDIT/SURFACE/REAL；Step5全部16FR卡。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 不保存：DR017~020规定的owner/平台正文、secret及敏感材料；检查actual durable、公开返回与所有观测出口，不以ref类型名免检。
2. 下游consumer只有disposition，不回写桥接relation；Bridges也不得反向写owner私表。
3. capability/Workspace/projection均不授authoritative权限或完整性；核对formal provenance/current。
4. P1新平台/额外功能/产品入口不得替代四平台P0、实际授权或资格缺口。
5. 红线失败阻P0正向；仅符合原六VETO时按§11确证，不把缺材料或每一红线另造VETO。

#### AC-BOUND-BR-001 可审查决策记录

- 问题/依据：local truth与owner/平台truth隔离如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的19Domain仅03§16.2原字段；BridgeInstallation、ExternalBinding、mapping、InboundHandoffRecord、DeliveryIntent/Attempt/PlatformReceipt、CallbackHandoffRecord、DedupRecord、StreamCursor/GapRecord、RecoveryRecord/SafeAuditRecord/SafeHandoffRecord范围裁决，所需副作用是否同阶段成立？
- 诊断：local truth名称不能赋其两端实体所有权；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“有映射表就等于拥有目标实体”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-002 可审查决策记录

- 问题/依据：安装与内部binding双资格及撤销如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的ExternalBinding.installation_ref/external_scope/internal_target/actor_basis/authorization_basis/directions_actions/generation/state；BridgeInstallation.qualification/config_revision；C02、J01、E03范围裁决，所需副作用是否同阶段成立？
- 诊断：platform scope并不覆盖internal responsibility/authorization；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“OAuth scope有效即允许全部方向和动作”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-003 可审查决策记录

- 问题/依据：外部主体与typed映射不生成内部身份如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的ExternalIdentityMapping.external_account/actor_kind/internal_actor/binding_ref/generation/basis；ExternalLocationMapping.external_location/parent_location/internal_target；ExternalMessageMapping.external_message/generation_direction；C03范围裁决，所需副作用是否同阶段成立？
- 诊断：显示名和平台ID只locator，不是internal actor authority；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“把所有外部user统一为GlobalMember”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-004 可审查决策记录

- 问题/依据：opaque secret引用及private解析边界如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的BridgeInstallation.secret_binding/config_revision/configuration_basis；OpaqueSecretBindingRef；03§13 private resolver与04§8 secret规范；C01/J05范围裁决，所需副作用是否同阶段成立？
- 诊断：ref形状与provider/KMS实际资格是不同层；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“写个环境变量名就算完成credential资格”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-005 可审查决策记录

- 问题/依据：可信来源/回环marker与外部正文瞬时边界如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的InboundHandoffRecord.verified_source/origin_marker/source_ref/mapping_context/protocol_disposition；E01 Private/Continuity；E03 private verification；ExternalMessageMapping.origin_marker范围裁决，所需副作用是否同阶段成立？
- 诊断：来源认证和可恢复source资格不能彼此替代；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“Webhook已HTTP接收就可持久化原body”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-006 可审查决策记录

- 问题/依据：ACK/owner接纳与内部Turn阶段边界如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的InboundHandoffRecord.protocol_disposition/owner_result/target_mode/actor_ref/material_ref/required_digest_ref；BridgeTargetModeSlot；E01；03§16.3范围裁决，所需副作用是否同阶段成立？
- 诊断：传输响应和业务owner结果四类authority不能提升；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“平台200等于内部处理完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-007 可审查决策记录

- 问题/依据：编辑/删除/线程不改写两端truth如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的ExternalMessageMapping.source_ref_version/change_kind/owner_result/effect_ref/generation_direction；ExternalLocationMapping.parent_location；E01/C03/C04；四平台current capability范围裁决，所需副作用是否同阶段成立？
- 诊断：平台变化动作名称相同但语义和支持不等价；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“统一把edit/delete转换成普通新消息”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-008 可审查决策记录

- 问题/依据：committed/投影/Workspace不是外显授权如何在00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT的SafePresentationPlan.source_ref_version/binding_context/projection_ref/disclosure_basis/presentation_kind/capability_ref/attachment_grants；E02/C04；Workspace provenance；03§13范围裁决，所需副作用是否同阶段成立？
- 诊断：披露资格与动作资格独立，缓存只读不能授authoritative权；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脱敏后的投影可无条件发送”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-009 可审查决策记录

- 问题/依据：附件仅正式准入/访问/传播ref如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的SafePresentationPlan.attachment_grants/projection_ref/disclosure_basis；QualifiedMaterialRefSlot/AttachmentGrantRefSetSlot；Artifact准入/访问/传播port；E01/C04范围裁决，所需副作用是否同阶段成立？
- 诊断：读取与传播是两个独立authority；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“能下载附件就能转发”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-010 可审查决策记录

- 问题/依据：intent/receipt与平台事实及内部提交不互代如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的DeliveryIntent.intent_ref/effect_ref/operation_ref/source_projection/target_context/operation_kind/plan_ref/lane_ref/retry_basis/state/local_revision；DeliveryAttempt.attempt_ref/intent_effect/claim_ref/qualification_ref/attempt_window/result_ref/state/local_revision；PlatformReceipt.attempt_effect/result_kind/external_locator/authority_basis/no_effect_basis；J01/J02范围裁决，所需副作用是否同阶段成立？
- 诊断：局部receipt只是获准已知观察，不拥有平台消息truth；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“transport success统一写送达成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-011 可审查决策记录

- 问题/依据：callback来源/责任/action与owner决定分离如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的ExternalActionBinding.source_intent/actor_responsibility/target_action/owner_revision/binding_generation/expiry_one_use/authorization_basis/one_use_claim；CallbackHandoffRecord.verification_ref/protocol_disposition/owner_result；E03范围裁决，所需副作用是否同阶段成立？
- 诊断：按钮与协议响应都不是正式审批结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“verified callback直接更新Gate”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-012 可审查决策记录

- 问题/依据：六namespace去重与留存不得无限重放如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的DedupRecord.namespace_scope/idempotency_key/semantic_identity/operation_effect/result_ref/retention_window/state；C01~06/E01~04/J01~05各technical key；J05 expiry范围裁决，所需副作用是否同阶段成立？
- 诊断：去重ID与作业ID/expired窗口不同权威；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“过了TTL就可以生成新key再执行”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-013 可审查决策记录

- 问题/依据：cursor分阶段/stream/epoch及gap权威覆盖如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的StreamCursor.namespace_stream/epoch/position/comparator_ref/coverage_ref/revision/state；GapRecord.cursor_ref/operation_ref/range_ref/coverage_ref/recovery_ref/window_basis；E01 Continuity/J03范围裁决，所需副作用是否同阶段成立？
- 诊断：连续性是阶段和来源受限定事实，不能提升全链完成；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“最后seen位置足以关闭全部gap”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-014 可审查决策记录

- 问题/依据：unknown恢复不创造新effect/目标如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的RecoveryRecord.original_subject/operation_effect/authorization_basis/qualification_ref/probe_result/resolution_kind；DeliveryAttempt及DispatchLane.unresolved_head/rate_bounds/retry_budget；C06/J02/J03/J04范围裁决，所需副作用是否同阶段成立？
- 诊断：故障与no-effect不同，恢复并非重新执行授权；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“失败后总是重发一次”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-015 可审查决策记录

- 问题/依据：全durable与审计出口body-free不伪造证据如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的SafeAuditRecord.mutation_ref/operation_ref/subject_refs/stage_reason/basis_refs/trace_ref/producer_revision；SafeHandoffRecord.canonical_material_ref/producer_admission/consumer_result/retention_window；BridgeProtocolError.issue/area/reason范围裁决，所需副作用是否同阶段成立？
- 诊断：安全与真实性是所有出口共同门禁而非日志一处过滤；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“先完整记录原始材料再离线脱敏”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-016 可审查决策记录

- 问题/依据：query只读与provenance/current不可反写真相如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的Q01~Q04 BridgeLocalView.view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；SafeReadQualificationPort/current resolver/actual complete snapshot/ReadDisclosureRules范围裁决，所需副作用是否同阶段成立？
- 诊断：读取资格与维护授权是两个独立命令边界；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“查询不一致时自动修复后再返回”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-BOUND-BR-017 可审查决策记录

- 问题/依据：依赖方向/P1与候选产品不能放行P0如何在00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT的01§8 dependency裁剪/§14 P1；03 public Contracts/Domain/Application/Infra/Entry/Jobs边界；04 route/provider/capability config；L5-chat=reference_only范围裁决，所需副作用是否同阶段成立？
- 诊断：Layer5并行设计许可并不等实际依赖可用或产品已选；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“SDK候选或并行产品设计已足以宣布Bridges ready”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

Step5可裁决功能不等于边界已测；DR引用存在不等读/传播授权，任一adapter或error mapper都可能泄露。需要把20DR/24BR按不同authority与出口独立卡化，并保持owner truth和local facts分离。

## 5. 改动前后对比

| 主题 | 改动前 | 本步决定 |
|---|---|---|
| 所有权 | 功能卡内分散 | 单独owner与20DR映射 |
| 安全边界 | private seam资料不等运行 | 必测存储/外呼/出口/拒绝无副作用 |
| 红线失败 | 易把blocked当VETO | 确证失败/缺材料分开 |
| 依赖 | 候选包不等已选 | 仅架构允许的类型，P1不放行P0 |

## 6. 验收裁决取舍与复杂度

选择独立16红线卡而非一张“无越权”总表；每项逐字段、实际no-write/negative副作用和固定TC/EV。复杂度高，逐项decision→normative→static_stop，不新增业务状态/DTO/脚本。

## 7. 结构化中间产物

### 6.1 共同裁决规则

红线的实际验证范围为：当前选定安装及owner/driver/secret/route实现的接缝、local durable和公开/观测出口。synthetic negative只证明受控断言，不代表actual资格通过。全部P0；缺材料暂停，实际失败阻正向，只有命中00六VETO才按§11否决。不得消费后续phase作为当前通过证据。

### 6.2 独立边界门禁

#### AC-BOUND-BR-001 local truth与owner/平台truth隔离

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-001、DR-BR-001、DR-BR-002、DR-BR-003、DR-BR-007、DR-BR-009、DR-BR-012、DR-BR-014、DR-BR-015、DR-BR-016、DR-BR-017；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | 19Domain仅03§16.2原字段；BridgeInstallation、ExternalBinding、mapping、InboundHandoffRecord、DeliveryIntent/Attempt/PlatformReceipt、CallbackHandoffRecord、DedupRecord、StreamCursor/GapRecord、RecoveryRecord/SafeAuditRecord/SafeHandoffRecord |
| 通过条件 | actual持久化/写请求只落local候选及实际UoW；owner/platform只经正式typed port读/交接；owner私表、内部/平台实体正文副本和owner修改调用为0；重建只修局部引用 |
| 失败条件 | 以local映射/receipt当owner或平台truth；直接读写owner私表或复制正文；恢复创建/抹除owner事实 |
| 副作用断言 | 记录同run存储写集/外呼类别安全计数与已授权safe refs；失败路径owner私表/平台新效果=0；actual历史owner事实不变化 |
| 具体TC | ["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-014","EV-CONTRACT-003","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-002 安装与内部binding双资格及撤销

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-002、BR-BR-004、DR-BR-002、DR-BR-005；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | ExternalBinding.installation_ref/external_scope/internal_target/actor_basis/authorization_basis/directions_actions/generation/state；BridgeInstallation.qualification/config_revision；C02、J01、E03 |
| 通过条件 | 安装来源与内部主体/目标/方向/action/basis独立实际valid；C02激活有formal当前依据；派发/owner action前重核expected generation、撤销与current；并发撤销后禁止旧队列新效果 |
| 失败条件 | 安装成功、管理员或旧binding当内部授权；缺依据默认Active；撤销被旧queue或重复C02绕过 |
| 副作用断言 | 拒绝不生成Active关系/attempt/owner action；旧known效果只保历史不删除或改成功；CAS冲突不静默换目标 |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-017","EV-CONTRACT-008","EV-CONTRACT-009"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-003 外部主体与typed映射不生成内部身份

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-003、DR-BR-003；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | ExternalIdentityMapping.external_account/actor_kind/internal_actor/binding_ref/generation/basis；ExternalLocationMapping.external_location/parent_location/internal_target；ExternalMessageMapping.external_message/generation_direction；C03 |
| 通过条件 | installation+platform+kind+generation隔离；human/AI/Integration独立依据；parent Slot与typed target实际一致；同名/mention/raw external_id不能生成GlobalMember/Conversation/内部频道或授读/审批资格 |
| 失败条件 | 同名自动绑定、跨安装key碰撞、external_id转GlobalMember；缺parent默认root、kind错配 |
| 副作用断言 | negative内部创建身份/频道/Conversation calls=0；mapping不替换原目标；同key异meaning Conflict且无新effect |
| 具体TC | ["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-003","EV-CONTRACT-002","EV-CONTRACT-009"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-004 opaque secret引用及private解析边界

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-005、DR-BR-001、DR-BR-006、DR-BR-019；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | BridgeInstallation.secret_binding/config_revision/configuration_basis；OpaqueSecretBindingRef；03§13 private resolver与04§8 secret规范；C01/J05 |
| 通过条件 | durable只ref/provider/version/scope资格；raw token/secret/OAuth code只获准private lease；失效/未选resolver/provider/KMS安全停止，无默认凭证/身份fallback；轮换不重造effect |
| 失败条件 | 明文进config/store/错误/报告；secret ref字符串替代正式解析依据；轮换退回历史token或另一个bot |
| 副作用断言 | 解析失败的platform/owner效果=0；raw lease不序列化不缓存durable；公开error只有finite三字段 |
| 具体TC | ["TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-017","EV-CONTRACT-018","EV-CONTRACT-002"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-005 可信来源/回环marker与外部正文瞬时边界

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-006、DR-BR-007、DR-BR-018；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | InboundHandoffRecord.verified_source/origin_marker/source_ref/mapping_context/protocol_disposition；E01 Private/Continuity；E03 private verification；ExternalMessageMapping.origin_marker |
| 通过条件 | platform+installation验证和时效由当前adapter证明；回环只verified origin与stored intent/locator；client marker不能跳核验；raw body获准瞬时转换且不durable，safe来源实际成立才接管 |
| 失败条件 | 信客户端自报origin/签名不校install；raw event落queue/DB/evidence；无safe来源但ACK被称可靠接管 |
| 副作用断言 | invalid/loop无owner/平台新effect；safe ref不存在不造记录代替正文；仅finite verification/ack阶段进入材料 |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-018","EV-CONTRACT-005"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-006 ACK/owner接纳与内部Turn阶段边界

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-007、BR-BR-008、DR-BR-007、DR-BR-008、DR-BR-010；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | InboundHandoffRecord.protocol_disposition/owner_result/target_mode/actor_ref/material_ref/required_digest_ref；BridgeTargetModeSlot；E01；03§16.3 |
| 通过条件 | AppendFact/ManifestExternalFact按Conversation当前合同；integration source不替human责任，owner要求的digest与准入分别成立；ACK、safe接管、owner实际result/ref与内部Turn独立叙述，未知原identity对账 |
| 失败条件 | ACK写OwnerAccepted/Turn committed；local metadata伪Turn；digest代表存储许可；无材料资格交正文 |
| 副作用断言 | 无材料/actor/basis owner call=0；unknown不造accepted ref；owner denied不推进owner cursor complete |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-021","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-007 编辑/删除/线程不改写两端truth

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-009、DR-BR-003、DR-BR-010；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | ExternalMessageMapping.source_ref_version/change_kind/owner_result/effect_ref/generation_direction；ExternalLocationMapping.parent_location；E01/C03/C04；四平台current capability |
| 通过条件 | change回原message+version与正式mode；不可比保gap、缺mapping隔离；unsupported/degraded有当前capability与owner许可；外部delete不物理删内部truth，不默换target/新发言 |
| 失败条件 | 缺mapped message仍edit/delete；把unsupported变新普通消息；用thread root猜目标或跨流比较version |
| 副作用断言 | 无依据变化无owner或平台mutation；历史ref/known效果保留；gap不无依据close，原parent不改 |
| 具体TC | ["TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-005","EV-CONTRACT-003","EV-CONTRACT-011","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-008 committed/投影/Workspace不是外显授权

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-010、BR-BR-011、DR-BR-004、DR-BR-005、DR-BR-010、DR-BR-020；00§10~11；01§8~9；03§6/8/13/16；04§8；05对应CUT |
| 正式对象/字段/协议/状态 | SafePresentationPlan.source_ref_version/binding_context/projection_ref/disclosure_basis/presentation_kind/capability_ref/attachment_grants；E02/C04；Workspace provenance；03§13 |
| 通过条件 | source实际committed且按current受众/visibility/Policy/Gate核验；存在性/提示/入口/action独立basis；敏感正文永不payload；低敏感不默认动作，Workspace只上下文，stale snapshot不能授权 |
| 失败条件 | commit/projection/workspace member当permission；把敏感正文或未获准存在性外显；造URL/按钮 |
| 副作用断言 | 受限时no send/no bind action；获准degrade只safe提示，未建立入口不输出；trace/report不泄隐藏存在性 |
| 具体TC | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-006","EV-CONTRACT-018","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-009 附件仅正式准入/访问/传播ref

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-012、DR-BR-011、DR-BR-018；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | SafePresentationPlan.attachment_grants/projection_ref/disclosure_basis；QualifiedMaterialRefSlot/AttachmentGrantRefSetSlot；Artifact准入/访问/传播port；E01/C04 |
| 通过条件 | inbound准入与outbound传播各具actual Artifact basis/ref及current有效性；必要附件失败阻塞，只有owner许可可省略；过期撤销链接不fallback公开永久URL；不保文件副本 |
| 失败条件 | 平台attachment下载或内部读取资格自动等于传播；省略必要附件；不经准入保存字节或分享tokenized URL |
| 副作用断言 | 未获准attachment无send/永久上传；only safe reference，不序列化附件byte/error/URL；省略的许可同run可核 |
| 具体TC | ["TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-007","EV-CONTRACT-006","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-010 intent/receipt与平台事实及内部提交不互代

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-013、DR-BR-009；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | DeliveryIntent.intent_ref/effect_ref/operation_ref/source_projection/target_context/operation_kind/plan_ref/lane_ref/retry_basis/state/local_revision；DeliveryAttempt.attempt_ref/intent_effect/claim_ref/qualification_ref/attempt_window/result_ref/state/local_revision；PlatformReceipt.attempt_effect/result_kind/external_locator/authority_basis/no_effect_basis；J01/J02 |
| 通过条件 | 原effect+source/target/versions保持；每attempt回原intent；只有actual method权威business accepted/rejected才receipt，unknown不造receipt；platform_accepted不是已读，内部commit不是外部送达 |
| 失败条件 | HTTP2xx或queued/intent当receipt；换source/target/effect消未知；known_rejected默认证明no-effect |
| 副作用断言 | known immutable receipt不覆写；timeout/lease未知保原责任；owner事实不回滚；重试额外效果无证明为0 |
| 具体TC | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-008","EV-REAL-001","EV-CONTRACT-013"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-011 callback来源/责任/action与owner决定分离

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-014、BR-BR-015、BR-BR-016、DR-BR-012、DR-BR-013、DR-BR-019；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | ExternalActionBinding.source_intent/actor_responsibility/target_action/owner_revision/binding_generation/expiry_one_use/authorization_basis/one_use_claim；CallbackHandoffRecord.verification_ref/protocol_disposition/owner_result；E03 |
| 通过条件 | installation/actor/原message/target/action/owner当前/expiry共同核验，source认证和action许可分别成立；private context不授权；one-use原identity；仅正式owner二次决定，ACK/deferred单列，旧结果current读取 |
| 失败条件 | 签名/管理员/低敏感/reaction即审批；本地Gate/Decision或Runtime/Tools调用；篡改/跨target/过期仍执行；private context公开 |
| 副作用断言 | invalid/action缺失owner call=0；已claim不复活，duplicate无新owner效果；unknown只原op对账；no Decision local write |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-018","EV-CONTRACT-010"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-012 六namespace去重与留存不得无限重放

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-017、BR-BR-024、DR-BR-015；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | DedupRecord.namespace_scope/idempotency_key/semantic_identity/operation_effect/result_ref/retention_window/state；C01~06/E01~04/J01~05各technical key；J05 expiry |
| 通过条件 | 03六namespace与作用域独立；same key+meaning复用原结果，变义Conflict隔离；restart/rotation保原effect；实际授权窗口/current预算成立；Expired/未知窗口禁止自动重execute |
| 失败条件 | 跨namespace复用或raw body hash当meaning；换ID重放，删除unknown dedup后补发；TTL当expiry authority；无界留存 |
| 副作用断言 | duplicate no-new-effect；冲突write=0；expiry保原key/op/unknown责任和tombstone，不清空业务历史；safe retention有限 |
| 具体TC | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-010","EV-CONTRACT-014","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-013 cursor分阶段/stream/epoch及gap权威覆盖

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-018、DR-BR-014；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | StreamCursor.namespace_stream/epoch/position/comparator_ref/coverage_ref/revision/state；GapRecord.cursor_ref/operation_ref/range_ref/coverage_ref/recovery_ref/window_basis；E01 Continuity/J03 |
| 通过条件 | 只有正式comparator同namespace/stream/epoch可比；protocol/owner/effect位置独立推进，gap全范围+阶段coverage证明才Closed；partial/unknown保Open/Manual/Incomparable，snapshot不证明Bus/platform全链完整 |
| 失败条件 | 字符串比较position、跨epoch混用；ACK推进owner或platform cursor；略过未覆盖gap报告complete |
| 副作用断言 | 无coverage不推进相关cursor/no close；恢复不replay raw；原gap追溯保留且CAS同UoW |
| 具体TC | ["TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-011","EV-CONTRACT-005","EV-CONTRACT-013"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-014 unknown恢复不创造新effect/目标

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-019、BR-BR-020、DR-BR-016；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | RecoveryRecord.original_subject/operation_effect/authorization_basis/qualification_ref/probe_result/resolution_kind；DeliveryAttempt及DispatchLane.unresolved_head/rate_bounds/retry_budget；C06/J02/J03/J04 |
| 通过条件 | 恢复有explicit当前basis+原source/op/effect；LocalCommit/Owner/Platform/Consumer各自authority只读对账；actual no-effect/current/lane/rate/budget全成立才重试，否则indeterminate/manual/missing_source；只修local |
| 失败条件 | timeout/lease loss即无效果；重启/恢复binding自动补发；probe未established就改KnownRejected；越head、改频道/平台/source |
| 副作用断言 | 原unknown无盲retry；拒绝无owner/platform effect；probe只读；原attempt/receipt/history/identity保留 |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013","EV-CONTRACT-012","EV-CONTRACT-008","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-015 全durable与审计出口body-free不伪造证据

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-021、BR-BR-022、DR-BR-016、DR-BR-017、DR-BR-018、DR-BR-019、DR-BR-020；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | SafeAuditRecord.mutation_ref/operation_ref/subject_refs/stage_reason/basis_refs/trace_ref/producer_revision；SafeHandoffRecord.canonical_material_ref/producer_admission/consumer_result/retention_window；BridgeProtocolError.issue/area/reason |
| 通过条件 | DB/queue/outbox/API/log/trace/metrics/report/evidence/handoff全出口禁止body、secret、private callback、tokenized URL、敏感审批/raw error及可还原派生；真实mutation才audit，真实consumer disposition才接受；计划/静态不变runtime EV/verdict |
| 失败条件 | 脱敏后保raw error/body hash；producer send即ConsumerAccepted；制造run/artifact/signoff；高基数raw ID/endpoint自由文本外发 |
| 副作用断言 | negative扫描结果只安全fixture labels/finite分类，不输出真实秘密；强制handoff资格缺失限制相应操作；no recursive evidence/audit producer |
| 具体TC | ["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-018","EV-CONTRACT-016","EV-CONTRACT-021","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-016 query只读与provenance/current不可反写真相

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-023、DR-BR-004、DR-BR-005；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | Q01~Q04 BridgeLocalView.view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；SafeReadQualificationPort/current resolver/actual complete snapshot/ReadDisclosureRules |
| 通过条件 | 按当前qualified scope/visibility只读实际complete snapshot，六字段来源明确；Denied隐藏存在性，Strong不足Unavailable；不refresh/repair/advance/replay，不创造view ID/page/cursor或no-op audit |
| 失败条件 | query触发维护、出错修mapping或默认empty success；projection反推basis或cursor，hidden计数/旧result泄露 |
| 副作用断言 | local/owner/platform mutation/no-op audit=0，禁止rebuild/maintenance jobs；返回前visibility重核 |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-003","EV-CONTRACT-011","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-BOUND-BR-017 依赖方向/P1与候选产品不能放行P0

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | BR-BR-001、AC-BR-037、AC-BR-038；00§10~11/14；01§8~9/14；03§6/8~13/16；04§8/14；05对应CUT |
| 正式对象/字段/协议/状态 | 01§8 dependency裁剪/§14 P1；03 public Contracts/Domain/Application/Infra/Entry/Jobs边界；04 route/provider/capability config；L5-chat=reference_only |
| 通过条件 | only允许shared Contracts->core候选，外层实际SDK/runtime adapter不反向导入Domain；四平台P0逐安装资格，不因P1另平台成功替代；route/APIKey/OAuth/KMS/SDK实际选择核验，Chat未停审不作truth |
| 失败条件 | Domain依赖platform SDK/framework/private lease或产品type入wire；要求下游源码全仓实现；用P1/fake成功或Chat草稿解除P0 |
| 副作用断言 | package/contract静态边界与actual资格证据分别记录；不创建/修改upstream/repo，不生成ready；blocked范围保留 |
| 具体TC | ["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-001","EV-CONTRACT-017","EV-REAL-001","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

### 6.3 数据分类与红线覆盖规则

| 原数据 | 分类/所有权 | 独立门禁 |
|---|---|---|
| DR-BR-001 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-004 |
| DR-BR-002 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-002 |
| DR-BR-003 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-003、AC-BOUND-BR-007 |
| DR-BR-004 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-008、AC-BOUND-BR-016 |
| DR-BR-005 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-002、AC-BOUND-BR-008、AC-BOUND-BR-016 |
| DR-BR-006 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-004 |
| DR-BR-007 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-005、AC-BOUND-BR-006 |
| DR-BR-008 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-006 |
| DR-BR-009 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-010 |
| DR-BR-010 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-006、AC-BOUND-BR-007、AC-BOUND-BR-008 |
| DR-BR-011 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-009 |
| DR-BR-012 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-011 |
| DR-BR-013 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-011 |
| DR-BR-014 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-013 |
| DR-BR-015 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-012 |
| DR-BR-016 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-014、AC-BOUND-BR-015 |
| DR-BR-017 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-001、AC-BOUND-BR-015 |
| DR-BR-018 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-005、AC-BOUND-BR-009、AC-BOUND-BR-015 |
| DR-BR-019 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-004、AC-BOUND-BR-011、AC-BOUND-BR-015 |
| DR-BR-020 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-008、AC-BOUND-BR-015 |

| 覆盖面 | 裁决规则 | 缺口处理 |
|---|---|---|
| 24BR/20DR/所有出口与各authority | 下列17独立卡覆盖全部原编号；共享EV可引用，同一instance仅计一次 | required材料缺失则blocked/not_evaluated |
| projection/SDK/P1/Chat | 不反写truth，不互代安装与授权，不污染P0 | actual资格缺口不可风险接受 |
| 红线与VETO | P0失败阻正向；只按§11确证六原VETO | 材料不足暂停，不新增VETO或臆判命中 |
| 来源与路径 | 00~05正式来源及本章具体TC/EV固定run、no-write断言均required | 不以计划表替代外部run/report实例 |

设计静态材料不产生consumer接受、平台资格、测试结果或最终验收结论。

## 8. 回填草稿

正式06§6直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15装配前过程归档

以下为本Step原§7末的设计静态审查记录，仅留过程区，不进入正式正文，不代表运行。

### 6.3 数据/红线覆盖与跨项停审

| 原数据 | 分类/所有权 | 独立门禁 |
|---|---|---|
| DR-BR-001 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-004 |
| DR-BR-002 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-002 |
| DR-BR-003 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-003、AC-BOUND-BR-007 |
| DR-BR-004 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-008、AC-BOUND-BR-016 |
| DR-BR-005 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-002、AC-BOUND-BR-008、AC-BOUND-BR-016 |
| DR-BR-006 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-004 |
| DR-BR-007 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-005、AC-BOUND-BR-006 |
| DR-BR-008 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-006 |
| DR-BR-009 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-010 |
| DR-BR-010 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-006、AC-BOUND-BR-007、AC-BOUND-BR-008 |
| DR-BR-011 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-009 |
| DR-BR-012 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-011 |
| DR-BR-013 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-011 |
| DR-BR-014 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-013 |
| DR-BR-015 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-012 |
| DR-BR-016 | 沿00§11原truth/snapshot/ref分类，只有local主语可写 | AC-BOUND-BR-001、AC-BOUND-BR-014、AC-BOUND-BR-015 |
| DR-BR-017 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-001、AC-BOUND-BR-015 |
| DR-BR-018 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-005、AC-BOUND-BR-009、AC-BOUND-BR-015 |
| DR-BR-019 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-004、AC-BOUND-BR-011、AC-BOUND-BR-015 |
| DR-BR-020 | 禁止durable正文；只有原获准private瞬时边界 | AC-BOUND-BR-008、AC-BOUND-BR-015 |

| 跨项审查 | 设计结论 | actual裁决 |
|---|---|---|
| 24BR/20DR/所有出口与各authority | 17独立卡无原编号孤儿；同EV可被引用但同instance仅计一次 | 全部planned/not_evaluated |
| projection/SDK/P1/Chat | 不反写truth、不互代安装与授权、不污染P0 | actual缺口blocked，非风险接受 |
| 红线与VETO | P0失败阻正向；只六原VETO按§11确证，缺材料暂停 | 无新增VETO或当前命中结论 |
| 来源与路径 | 00~05正式来源、全TC数组/EV固定run及no-write断言 | 无外部run/report实例 |

设计静态停审不产生真实consumer接受、平台资格、测试结果或最终验收结论。

### Step15修正后重审

AC-BOUND-BR-010：上述修正已与03§5/8.1/16正式源再核，规范id/fields/pass/fail/effects及TC/EV引用实际静态检查errors=[]。只纠正06表述，不改原业务schema/guard/测试注册表；不代表actualcase/EV/qualification。Step15跨审同时核对139卡及191字段/150pair；过程话语留此区。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| AC-BOUND-BR-001 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-002 | 正式合同/原字段、通过/失败/副作用、26个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-003 | 正式合同/原字段、通过/失败/副作用、14个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-004 | 正式合同/原字段、通过/失败/副作用、21个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-005 | 正式合同/原字段、通过/失败/副作用、14个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-006 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-007 | 正式合同/原字段、通过/失败/副作用、20个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-008 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-009 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-010 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-011 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-012 | 正式合同/原字段、通过/失败/副作用、23个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-013 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-014 | 正式合同/原字段、通过/失败/副作用、21个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-015 | 正式合同/原字段、通过/失败/副作用、22个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-016 | 正式合同/原字段、通过/失败/副作用、19个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-BOUND-BR-017 | 正式合同/原字段、通过/失败/副作用、30个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。17红线逐项决策/卡/静态停审完成，实际覆盖24BR/20DR无孤儿；没有新增VETO或修改任何上游/05协议。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_7。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
