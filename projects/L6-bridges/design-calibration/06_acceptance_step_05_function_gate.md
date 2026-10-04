# L6-bridges 06 Step5：功能门禁

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step5 / 书写§5.5；回填正式06§5。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| function_gate | pass | design_static_only_external_gates_open | enter_step_6 | Step1~4全部来源/基线/未决；00§9/14；03§8/9/10/15.1~15.2和05§3/6/13、case/EV registry；验收SOP Step5、书写§5.5。 |

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

16独立FR验收项AC-FUNC-BR-001~016；先逐项可审查决策→规范卡→局部静态停审，最后FR全覆盖/冲突/路径跨审。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§5已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

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

Step1~4全部来源/基线/未决；00§9/14；03§8/9/10/15.1~15.2和05§3/6/13、case/EV registry；验收SOP Step5、书写§5.5。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 每FR按原对象/协议/current/guard与safe结果定义本项通过，不只体验可用。
2. 失败分确证合同不成立与缺材料blocked，不能升级unknown/ACK。
3. 引用本FR所属cut的完整具体TC/EV数组及fixedrun路径，不另造TC。
4. P1只非关键更多组合，不能承接任何16FR最低验证。
5. 任何已承诺P0实际不成立阻总体正向，VETO按原触发而非全部缺口都VETO。
6. 每项都明列原FR/AC/设计源、field/state、TC/EV/path和impact。
7. 逐项完成局部文档检查再推进，留§3/10记录。
8. 最后16FR唯一主门禁、全TC登记合法、shared EV允许复用但不多算通过、P0不豁免。

#### AC-FUNC-BR-001 可审查决策记录

- 问题/依据：配置/secret引用准入如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的C01 ConfigureBridgeInstallation、BridgeInstallation.namespace/platform_kind/config_revision/capability_ref/secret_binding/route_policy/configuration_basis/qualification/state/local_revision范围裁决，所需副作用是否同阶段成立？
- 诊断：配置静态合法不足证明账号/provider或授权；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“配置成功=桥接已启用”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-002 可审查决策记录

- 问题/依据：显式binding生命周期如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的C02 ManageExternalBinding、ExternalBinding.external_scope/internal_target/actor_basis/authorization_basis/directions_actions/generation/local_revision；Pending/Active/Suspended/Revoked范围裁决，所需副作用是否同阶段成立？
- 诊断：平台安装与内部relation授权是两条独立依据；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“管理员/PAT自动绑定”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-003 可审查决策记录

- 问题/依据：外部identity/channel/message映射如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的C03 MaintainExternalMapping；ExternalIdentityMapping.external_account/actor_kind/internal_actor/binding_ref/generation/basis；Location.external_location/parent_location/internal_target；Message.external_message/source_ref_version/generation_direction/origin_marker/mapping_basis范围裁决，所需副作用是否同阶段成立？
- 诊断：显示名与定位不是身份/权限truth；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“external_id直接GlobalMember”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-004 可审查决策记录

- 问题/依据：可信入站与安全接管如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的E01 PlatformInputReceivedConsumer；InboundHandoffRecord.verified_source/origin_marker/source_ref/operation_ref/mapping_context/target_mode/actor_ref/material_ref/required_digest_ref/protocol_disposition/owner_result范围裁决，所需副作用是否同阶段成立？
- 诊断：合法平台来源不能替actor责任或safe材料owner资格；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“HTTP ACK即内部提交”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-005 可审查决策记录

- 问题/依据：Conversation正式交接如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的E01的BridgeTargetModeSlot、actor_ref/material_ref/required_digest_ref/owner_result；Conversation AppendFact/ManifestExternalFact正式mode、OwnerAccepted/OwnerRejected/Indeterminate范围裁决，所需副作用是否同阶段成立？
- 诊断：来源认证/Integration actor不等业务参与者授权；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“任何accepted都算Turn完成”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-006 可审查决策记录

- 问题/依据：编辑/删除/线程差异如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的E01/C03；ExternalMessageMapping.change_kind/source_ref_version/external_message；ExternalLocationMapping.parent_location；GapRecord/StreamCursor原comparator范围裁决，所需副作用是否同阶段成立？
- 诊断：四平台删除通知/线程/版本恢复能力不等价；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“外部删除直接内部删除”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-007 可审查决策记录

- 问题/依据：安全外显与敏感Gate如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的C04 PrepareExternalDelivery/E02 CommittedSourceAvailableConsumer；SafePresentationPlan.source_ref_version/binding_context/projection_ref/disclosure_basis/attachment_grants/presentation_kind/capability_ref范围裁决，所需副作用是否同阶段成立？
- 诊断：披露四维不能用单一可见bool替代；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“低敏感默认可审批”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-008 可审查决策记录

- 问题/依据：附件引用准入与传播如何在00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut的C04/E01/J01；AttachmentGrantRefSetSlot、Artifact authorized ref/read/propagation/current/expiry与private短借renderer范围裁决，所需副作用是否同阶段成立？
- 诊断：附件存在不证明当前读取或传播资格；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“有效file URL即永久可共享”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-009 可审查决策记录

- 问题/依据：稳定投递/attempt/receipt如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的J01 DispatchQueuedDeliveryJob；DeliveryIntent.effect_ref/operation_ref/source_projection/target_context/operation_kind/plan_ref/lane_ref/retry_basis；Attempt.claim_ref/attempt_window/result_ref；PlatformReceipt.authority_basis/no_effect_basis范围裁决，所需副作用是否同阶段成立？
- 诊断：内部commit/平台transport成功/业务接受/已读互不等价；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“发送请求成功就Delivered”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-010 可审查决策记录

- 问题/依据：回调认证/责任/动作绑定如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的C05 BindExternalAction/E03 PlatformCallbackReceivedConsumer；ExternalActionBinding.source_intent/actor_responsibility/target_action/owner_revision/binding_generation/expiry_one_use/authorization_basis/one_use_claim；CallbackHandoffRecord.verification_ref范围裁决，所需副作用是否同阶段成立？
- 诊断：source验证与内部action资格必须逐维验证；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“签名有效即按钮有审批权”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-011 可审查决策记录

- 问题/依据：正式owner动作交接如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的E03 owner_action_ref/one_use_claim/owner_result/protocol_disposition；正式OwnerActionPort与原owner operation/current；OwnerAccepted/OwnerRejected/Indeterminate范围裁决，所需副作用是否同阶段成立？
- 诊断：只有owning动作结果能说明正式Decision，平台响应不能；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“callback返回200代表批准”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-012 可审查决策记录

- 问题/依据：去重/cursor/gap如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的DedupRecord.namespace_scope/idempotency_key/semantic_identity/operation_effect/result_ref/retention_window；StreamCursor.namespace_stream/epoch/position/comparator_ref/coverage_ref/revision；GapRecord.range_ref/coverage_ref/window_basis范围裁决，所需副作用是否同阶段成立？
- 诊断：protocol/owner/effect位置及expiry维护/业务key不是同一轴；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“去重TTL后自然重新执行”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-013 可审查决策记录

- 问题/依据：lane/rate-limit/安全retry如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的DispatchLane.order_scope/head_dependency/claim_fence/unresolved_head/rate_bounds/retry_budget/revision；J01/J02；平台shared global/method/resource/bucket与RetryEligibility范围裁决，所需副作用是否同阶段成立？
- 诊断：限流信号不提供无效果证明，runtime资源hardcap不提供批准预算；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“退避后盲重试直到成功”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-014 可审查决策记录

- 问题/依据：受权回放/对账恢复如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的C06 RequestBridgeRecovery/J02 ReconcileBridgeOperationJob/J03 ReconcileStreamGapJob；RecoveryRecord.original_subject/operation_effect/authorization_basis/qualification_ref/probe_result/resolution_kind范围裁决，所需副作用是否同阶段成立？
- 诊断：四种authority proof不可跨主语消费，local已提交不证明外部效果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“恢复=再发送一次”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-015 可审查决策记录

- 问题/依据：安全审计材料与consumer交接如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的SafeAuditRecord.mutation_ref/operation_ref/subject_refs/stage_reason/basis_refs/trace_ref/producer_revision；SafeHandoffRecord.canonical_material_ref/producer_admission/claim/consumer_result/retention_window；O01/E04/J04范围裁决，所需副作用是否同阶段成立？
- 诊断：business audit安全ref不能当test EV；producer static map无Bridges不能私自填；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“有日志即可宣审计接收”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-FUNC-BR-016 可审查决策记录

- 问题/依据：受权只读局部状态如何在00§9/14；03§8~13/15/16；04§7~12；05§6对应cut的Q01~Q04 BridgeLocalView.view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；SafeReadQualificationPort与complete committed snapshot范围裁决，所需副作用是否同阶段成立？
- 诊断：安全Query是观测入口，不是lazy维护入口；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“查询顺便修复数据”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

05§6有独立cut断言，00§14按能力汇总；需要FR一一门禁，不能按TC passed率或把unsupported保护分支当已承诺正向。

## 5. 改动前后对比

| 项 | 上游材料 | 06落实 | 原因 |
|---|---|---|---|
| 主功能 | 16FR/五能力 | 16主门禁+横切交叉 | 无孤儿FR |
| 证据 | 22cut/116TC/22EV计划 | 明列具体数组/path/actual资格 | 不使用泛称all |
| 阶段 | owner/platform/consumer各自结果 | 保独立结果与零非法副作用 | 防伪成功 |

## 6. 验收裁决取舍与复杂度

| 方案 | 判断 |
|---|---|
| 逐FR主项、完整cut断言与qualified正向分别裁决 | 采用；共享证据只链接，不计两次运行 |
| 五个总成功项/通过率阈值 | 不采用；会遗漏对象/缺参数/资格 |

复杂度：16项分C1/2/3/4/5批次，每项独立小循环，主文件规范卡供正式装配；没有另添业务接口。

## 7. 结构化中间产物

### 5.1 共同功能裁决

`AC-FUNC-BR-*`是06操作门禁ID，原`AC-BR-001~038`保持00真相；两者不冒别名。以下16项全P0，所列TC全部参数/断言与横切门禁均必须成立，当前只有planned/not_evaluated。actual成功须独立对应qualified seam；negative/unsupported可验证保护但不证明同scope正向。

#### AC-FUNC-BR-001 配置/secret引用准入

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-001、AC-BR-002、AC-BR-006；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C01 ConfigureBridgeInstallation、BridgeInstallation.namespace/platform_kind/config_revision/capability_ref/secret_binding/route_policy/configuration_basis/qualification/state/local_revision |
| 通过条件 | strict JSON完整/actual required齐；configure只Configured，Qualified必须J05正式current资格；exact五purpose/provider/key/revision/scope/window在IO前成立 |
| 失败条件 | 文件parse或PAT即激活、旧secretfallback、漏required、越资源限制或durable明文 |
| 副作用断言 | configure/validate-only零secret解析/平台IO；config/local expected分别wholeCAS，失败无partial |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-017","EV-CONTRACT-018","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-002 显式binding生命周期

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-002、AC-BR-001、AC-BR-003、AC-BR-005、AC-BR-007；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C02 ManageExternalBinding、ExternalBinding.external_scope/internal_target/actor_basis/authorization_basis/directions_actions/generation/local_revision；Pending/Active/Suspended/Revoked |
| 通过条件 | 正式两端/current/basis后才Active；suspend/revoke具named mutation及checked generation；重复同义复原result |
| 失败条件 | Pending循环自授、平台admin代授权、旧generation继续派发、冲突替target或终态复活 |
| 副作用断言 | 撤销后的新/旧queued效果调用0；historical known/receipt不删；unique/expected/audit/result同U |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-010","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-003 外部identity/channel/message映射

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-003、AC-BR-004、AC-BR-006；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C03 MaintainExternalMapping；ExternalIdentityMapping.external_account/actor_kind/internal_actor/binding_ref/generation/basis；Location.external_location/parent_location/internal_target；Message.external_message/source_ref_version/generation_direction/origin_marker/mapping_basis |
| 通过条件 | 全locator隔installation/kind/generation；0/1/多结果明确；message只实际known link_known；每typed回链可解释 |
| 失败条件 | 同名/external_id串绑、first/latest取候选、unknown造Linked、缺parent默认为root |
| 副作用断言 | GlobalMember/Conversation创建0；wrongscope/多命中零外呼/新mapping；unique竞争whole winner |
| 具体TC | ["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-003","EV-CONTRACT-001","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-004 可信入站与安全接管

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-004、AC-BR-008、AC-BR-009、AC-BR-012、AC-BR-013、AC-BR-014；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | E01 PlatformInputReceivedConsumer；InboundHandoffRecord.verified_source/origin_marker/source_ref/operation_ref/mapping_context/target_mode/actor_ref/material_ref/required_digest_ref/protocol_disposition/owner_result |
| 通过条件 | 每平台verified源/时效/current及marker自发送关系；具safe可恢复ref或owner已接纳才可靠接管；protocol ACK独立 |
| 失败条件 | 伪签/过期/自报marker获信、没有safe材料仍可靠ACK、ACK改OwnerAccepted或重复造owner效果 |
| 副作用断言 | verified/claim前不durable raw；claim actual commit后才owner；preflight零owner/ID，private不出safe出口 |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-018","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-005 Conversation正式交接

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-005、AC-BR-010；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | E01的BridgeTargetModeSlot、actor_ref/material_ref/required_digest_ref/owner_result；Conversation AppendFact/ManifestExternalFact正式mode、OwnerAccepted/OwnerRejected/Indeterminate |
| 通过条件 | 完整mapping/current责任/材料/digest按所选正式owner mode传；accepted只原owner result/ref；unknown原op只读对账 |
| 失败条件 | integration代human、桥接自己造Turn、digest作为内容权限、同未知请求换ID再交 |
| 副作用断言 | ownercall原op/参数计数1；no local Turn；ACKlost不新owner效果 |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-013","EV-CONTRACT-010"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-006 编辑/删除/线程差异

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-006、AC-BR-011、AC-BR-019；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | E01/C03；ExternalMessageMapping.change_kind/source_ref_version/external_message；ExternalLocationMapping.parent_location；GapRecord/StreamCursor原comparator |
| 通过条件 | create/edit/delete回原mapping及可比版本；四平台thread/topic/root能力独立；unsupported或正式degraded可解释 |
| 失败条件 | 缺mapping伪new普通消息、外部delete抹内部truth、opaque字符串排序、默换channel/root |
| 副作用断言 | 不支持/缺parent/不可比零owner变更和平台edit/delete；partial/gap不得推进Owner stage |
| 具体TC | ["TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-005","EV-CONTRACT-003","EV-CONTRACT-011"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-007 安全外显与敏感Gate

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-007、AC-BR-015、AC-BR-016、AC-BR-019、AC-BR-021；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C04 PrepareExternalDelivery/E02 CommittedSourceAvailableConsumer；SafePresentationPlan.source_ref_version/binding_context/projection_ref/disclosure_basis/attachment_grants/presentation_kind/capability_ref |
| 通过条件 | source committed且current；existence/hint/entry/action各proof独立；只获准安全Qualified/Degraded投影，无敏感正文 |
| 失败条件 | event接收当commit、未获准存在性泄露、低敏感默认按钮、入口缺失造URL或stale发送 |
| 副作用断言 | 缺任一basis prepare/send=0；current在dispatch前重核；Gate approve/Decision write=0 |
| 具体TC | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-006","EV-CONTRACT-018","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-008 附件引用准入与传播

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-008、AC-BR-017、AC-BR-020；00§9/14；03§8/9/13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C04/E01/J01；AttachmentGrantRefSetSlot、Artifact authorized ref/read/propagation/current/expiry与private短借renderer |
| 通过条件 | 入/出站均正式准入/访问/传播；required不可用阻；omission只有owner显式许可；private bytes限预算 |
| 失败条件 | 无传播依据上传/公开link、过期撤销替永久URL、正文/下载token/hash持久或强行省必要附件 |
| 副作用断言 | 缺required授权零send/upload；drop lease不宣zeroize；redirect/oversize/cumulative预算失败安全零泄露 |
| 具体TC | ["TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-007","EV-CONTRACT-018","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-009 稳定投递/attempt/receipt

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-009、AC-BR-018、AC-BR-020、AC-BR-021；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | J01 DispatchQueuedDeliveryJob；DeliveryIntent.effect_ref/operation_ref/source_projection/target_context/operation_kind/plan_ref/lane_ref/retry_basis；Attempt.claim_ref/attempt_window/result_ref；PlatformReceipt.authority_basis/no_effect_basis |
| 通过条件 | A/B/C原短U阶段，actual B后current/all bounds通过才一次dispatch；平台business result取KnownAccepted/KnownRejected，immutable receipt只known；C失败仅原known finalize |
| 失败条件 | plan/HTTP2xx当actual commit或送达、unknown造receipt、C失败重send、换source/target/effect |
| 副作用断言 | 同effect singlewinner/dispatch=1；C whole receipt/mapping/lane/result/audit；B可能已提交零fresh send、保Indeterminate/unresolved_head |
| 具体TC | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-008","EV-CONTRACT-014","EV-CONTRACT-010"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-010 回调认证/责任/动作绑定

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-010、AC-BR-022、AC-BR-023、AC-BR-025、AC-BR-026、AC-BR-027；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C05 BindExternalAction/E03 PlatformCallbackReceivedConsumer；ExternalActionBinding.source_intent/actor_responsibility/target_action/owner_revision/binding_generation/expiry_one_use/authorization_basis/one_use_claim；CallbackHandoffRecord.verification_ref |
| 通过条件 | 安装/verified callback、source message、actor/target/action/owner current/window共同有效；初绑无callback/actionID前提；双回调one-use claim wholeCAS |
| 失败条件 | 签名/PAT/admin/reaction/context代授权、跨actor/target/消息/过期仍claim、Claimed复活Active |
| 副作用断言 | actual wholeclaim后仅winner ownercall；无资格claim/owner=0；callbacktoken/response_url/raw context不durable |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-002","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-011 正式owner动作交接

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-011、AC-BR-024；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | E03 owner_action_ref/one_use_claim/owner_result/protocol_disposition；正式OwnerActionPort与原owner operation/current；OwnerAccepted/OwnerRejected/Indeterminate |
| 通过条件 | owner二次核责任与当前状态；ACK/deferred与动作结果独立；unknown/lateknown只原op probe/finalize；回显遵当前read scope |
| 失败条件 | 本地批准Gate/写Decision/直执行Runtime/Tools；超时换ID批准；deferred延token/window |
| 副作用断言 | 额外审批/直接执行=0；duplicate ownercall不增；current read撤销无result ref/count存在性泄露 |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-013","EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-012 去重/cursor/gap

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-012、AC-BR-029、AC-BR-034、AC-BR-035；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | DedupRecord.namespace_scope/idempotency_key/semantic_identity/operation_effect/result_ref/retention_window；StreamCursor.namespace_stream/epoch/position/comparator_ref/coverage_ref/revision；GapRecord.range_ref/coverage_ref/window_basis |
| 通过条件 | 六namespace key recipe独立，samekey同完整meaning/result；同stream/epoch正式After才推进；J03 B full gap source coverage与C新stage proof独立；J05两key/op同U保目标责任 |
| 失败条件 | 变义复用/跨namespace，opaque字串排序，ACK/空页/count越gap complete，Expired重新执行/删除key/result |
| 副作用断言 | duplicate新ID/owner/send=0；所有guard失败原对象不变；B成功C失败仅保B，禁止C假advance |
| 具体TC | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-010","EV-CONTRACT-011","EV-CONTRACT-020"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-013 lane/rate-limit/安全retry

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-013、AC-BR-030、AC-BR-036；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | DispatchLane.order_scope/head_dependency/claim_fence/unresolved_head/rate_bounds/retry_budget/revision；J01/J02；平台shared global/method/resource/bucket与RetryEligibility |
| 通过条件 | 全部shared scope预约/最大lowerbound，Retry-After/retry_after不能缩短；unresolved head阻后继；sameop权威NoEffect+current+原used/window/budget齐才retry |
| 失败条件 | 单mutex代global，429/timeout/lease/cancel当NoEffect，budget归零/续窗口，SDK暗retry |
| 副作用断言 | unknown后额外dispatch=0，后继不能越head；超预算/unknown budget停；无跨lane总序承诺 |
| 具体TC | ["TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-012","EV-CONTRACT-019","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-014 受权回放/对账恢复

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-014、AC-BR-028、AC-BR-031、AC-BR-034；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | C06 RequestBridgeRecovery/J02 ReconcileBridgeOperationJob/J03 ReconcileStreamGapJob；RecoveryRecord.original_subject/operation_effect/authorization_basis/qualification_ref/probe_result/resolution_kind |
| 通过条件 | 显式request basis/current；LocalCommit/Owner/Platform/Consumer独立只读probe；known优先/原subject收口；缺safe source/method资格manual/blocked/indeterminate |
| 失败条件 | NotFound/TTL/absence当RolledBack/NoEffect，probe变execute、新key/target/凭证fallback、重建owner/platformtruth |
| 副作用断言 | 原key/effect/target/window/used不变；只读probe零send/approve/freshapply；局部修复无新owner/平台效果 |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013","EV-CONTRACT-011","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-015 安全审计材料与consumer交接

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、AC-BR-032、AC-BR-034、AC-BR-035、AC-BR-036；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | SafeAuditRecord.mutation_ref/operation_ref/subject_refs/stage_reason/basis_refs/trace_ref/producer_revision；SafeHandoffRecord.canonical_material_ref/producer_admission/claim/consumer_result/retention_window；O01/E04/J04 |
| 通过条件 | actual mutation同U安全audit；正式producer/schema/admission/canonical/current后O01/J04原op交接；E04 NonRecursiveResultOnly；强制审计不足先阻效果 |
| 失败条件 | 冒其他family/producer、log替audit、本地handoff/ACK当ConsumerAccepted或EV、unknown重复canonical |
| 副作用断言 | 缺mandatory准入zero mutation/IO；feedback实际local mutation仍须同U安全audit，零新canonical/O01/producer；backlog/retention有批准有限预算 |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-021","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-FUNC-BR-016 受权只读局部状态

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-016、AC-BR-033、AC-BR-034、AC-BR-036；00§9/14；03§8~13/15/16；04§7~12；05§6对应cut |
| 正式对象/字段/协议/状态 | Q01~Q04 BridgeLocalView.view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；SafeReadQualificationPort与complete committed snapshot |
| 通过条件 | resolver-first/current资格、完整一致snapshot、返回前visibility重核；View仅Qualified/Degraded，Denied/Unavailable/authorized absent分开；原stage结果不合并 |
| 失败条件 | query refresh/probe/repair/replay/advance/audit、hidden fake empty或拼跨revisionview、缺scope填默认 |
| 副作用断言 | 所有mutable/probe/ID/claim/audit/owner/platform effects计数0；hidden不出ref/count/existence；不创建durable View |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-001","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

### 5.2 功能聚合

16主FR一一有门禁，shared TC/EV可交叉引用，但每实际instance只有一个primary suite且不重复计数。C1~C5及全部横切§6~11均为required；全部P0失败不以通过率弥补。P1只有已批准非关键扩组合，无实际接受材料时仍open；P2未承诺。actual缺qualification不能将不支持/保护拒绝升级已承诺正向通过。

## 8. 回填草稿

正式06§5直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15修正后重审

AC-FUNC-BR-015：上述修正已与03§5/8.1/16正式源再核，规范id/fields/pass/fail/effects及TC/EV引用实际静态检查errors=[]。只纠正06表述，不改原业务schema/guard/测试注册表；不代表actualcase/EV/qualification。Step15跨审同时核对139卡及191字段/150pair；过程话语留此区。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| AC-FUNC-BR-001 | 正式合同/原字段、通过/失败/副作用、28个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-002 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-003 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-004 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-005 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-006 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-007 | 正式合同/原字段、通过/失败/副作用、21个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-008 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-009 | 正式合同/原字段、通过/失败/副作用、16个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-010 | 正式合同/原字段、通过/失败/副作用、14个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-011 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-012 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-013 | 正式合同/原字段、通过/失败/副作用、24个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-014 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-015 | 正式合同/原字段、通过/失败/副作用、15个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-FUNC-BR-016 | 正式合同/原字段、通过/失败/副作用、13个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。16FR主项独立决策→卡→局部检查已串行完成，固定TC/EV数组合法；跨FR/P1/阶段/无证处理和16/16主项无孤儿静态核对errors=[]。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_6。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
