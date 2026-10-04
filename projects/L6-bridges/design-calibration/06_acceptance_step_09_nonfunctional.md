# L6-bridges 06 Step9：非功能

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step9 / 书写§5.9；回填正式06§9。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| nonfunctional | pass | design_static_only_external_gates_open | enter_step_10 | Step8 21机/7联合门禁；00§13十六NFR/§14；03§12~15/16.8；04§7数值hardcap/§8secret/§11失败/§14actualqualification；05专项TC/EV。 |

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

十六NFR逐项；安全、性能、可用性、审计、幂等一致性、可观测性六类；每卡明确测量单位/范围、阈值来源、未测影响。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§9已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

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

Step8 21机/7联合门禁；00§13十六NFR/§14；03§12~15/16.8；04§7数值hardcap/§8secret/§11失败/§14actualqualification；05专项TC/EV。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 十六原NFR均与P0能力/共享保护相关，不将原强制项标P1。
2. zero forbidden材料/零非法副作用/单原effect按00要求；平台时限/配额/恢复window按actualqualifiedsource及currentbudget；04loader/static resource cap不是服务SLA。
3. 当前所有专项未执行，列入§13非可豁免风险，影响P0正向；no riskacceptance补未测。
4. actualP0违反安全/限流/顺序/unknown/追溯等阻正向；若原VETO/S/A另按§11/12，无材料暂停。
5. 每card固定具体TC/EV、参数实例、safe measurement/raw/report和实际资格。

#### AC-NFR-BR-001 可审查决策记录

- 问题/依据：受权binding/secret双有效如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的ExternalBinding.actor_basis/authorization_basis/directions_actions/generation；BridgeInstallation.secret_binding/qualification；qualified secret purpose/scope/current范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-002 可审查决策记录

- 问题/依据：配置/关系/mapping版本与撤销竞争如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的ConfigRevision/BindingGeneration/LocalRevision/ExpectedGeneration；managementfullmeaning、currentdispatch/action范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-003 可审查决策记录

- 问题/依据：平台消息/交互时限与可信接管如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的E01/E03 protocol ACK计划与actual执行；safe来源/owneraccept；actualplatformsource/capabilitydeadline、clock及attemptwindow范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-004 可审查决策记录

- 问题/依据：入站operation/变化/处理位置一致性如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的InboundHandoffRecord.operation_ref/protocol_disposition/owner_result；ExternalMessageMapping.change_kind/source_ref_version；StreamCursor.namespace_stream/epoch范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-005 可审查决策记录

- 问题/依据：外部故障局部隔离如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的SafePresentationPlan/DeliveryIntent/DeliveryAttempt、committed source、SecretResolution/PlatformDeliveryPort errors范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-006 可审查决策记录

- 问题/依据：安全外显/Gate/附件传播如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的SafePresentationPlan.disclosure_basis/projection_ref/attachment_grants/presentation_kind；Artifactgrant/window；visibility/Policy/Gate current范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-007 可审查决策记录

- 问题/依据：intent/attempt/receipt效果连续性如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的StableEffectIdentity、DeliveryIntent原source/target/binding/projection；DeliveryAttempt/PlatformReceipt原attempt_effect/authority_basis范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-008 可审查决策记录

- 问题/依据：交互来源/内部责任/action独立如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的ExternalActionBinding.source_intent/actor_responsibility/target_action/owner_revision/expiry_one_use/authorization_basis；CallbackVerificationRef范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-009 可审查决策记录

- 问题/依据：单次callback效果/延期响应不作Decision如何在00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV的one_use_claim/CallbackHandoffRecord.operation_ref/protocol_disposition/owner_result；ExternalActionBinding.expiry_one_use；ownerreadonlyprobe范围裁决，所需副作用是否同阶段成立？
- 诊断：该项没有当前测得值或实际资格，要求值不能被陈述成测量结果；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“用示例budget/公开资料或其他NFR通过替代”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-010 可审查决策记录

- 问题/依据：lane/rate/retry/backlog有界如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的QualifiedLaneOrderScope/QualifiedRateLimitBoundSet/RetryBudgetRef；DispatchLane.rate_bounds/retry_budget/unresolved_head；04execution/profile；来源/attemptwindow范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-011 可审查决策记录

- 问题/依据：故障/重启/失效有权威恢复如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的RecoveryRecord原subject/operation_effect/source/currentprobe；LocalCommit/Owner/Platform/Consumer分支；bindinggeneration/window/refavailability范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-012 可审查决策记录

- 问题/依据：安全审计材料与consumer接纳分离如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的SafeAuditRecord/BodyFreeMutationMaterial、SafeHandoffRecord/canonical/admission/current/disposition；03§14四出口及observabilityproducer范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-013 可审查决策记录

- 问题/依据：namespace/cursor/replay正式覆盖如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的六namespacequalifiedkey/fullmeaning/window；StreamCursor.namespace_stream/epoch/comparator_ref/coverage_ref；GapRecord与两coverage范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-014 可审查决策记录

- 问题/依据：安全状态可解释与读取零维护如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的四Q/BridgeLocalView.view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；原stage/current/completecommittedsnapshot范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-015 可审查决策记录

- 问题/依据：所有durable/观测/证据出口零敏感材料如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的19Domain/03localstore、四观测出口、BridgeProtocolError、privatelease；05Closed Harness records/canonicaldigest/RedactionCheck；04opaque配置范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-NFR-BR-016 可审查决策记录

- 问题/依据：阶段/低基数与真实性不提升readiness如何在00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV的ProtocolAck/LocalCommit/Owner/Platform/Consumer各slot；finiteevent/trace/log/metric分类；05record status/currentcoverage/maturity/qualification范围裁决，所需副作用是否同阶段成立？
- 诊断：该维度每个actualscope需要自己的安全测量/资格，计划定义与合成负例不能替实际positive；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“其他平台成功或示例profile数值替代本项实测”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

不宜凭示例budget/公开URL推吞吐、p95、可用率、ACK统一延迟或恢复SLO。absence不是零泄漏实测。04fixture5000毫秒/maxwait上界60000只本地callbudget，不是授权retry或平台期限。

## 5. 改动前后对比

| 内容 | 原可能误用 | 本步决定 |
|---|---|---|
| 阈值 | 默认SLA/硬编码quota | requirement不变量或actualqualified合同 |
| hardcap | 示例值等prod批准 | loader/source约束与approvedprofile分别 |
| 未测 | 风险接受即可正向 | P0缺证非豁免，登记后blocked |
| 测量 | 记录raw平台请求/异常 | 仅safe分类/数量/时间差/approvedrefs |

## 6. 验收裁决取舍与复杂度

复杂度高，16项各独立卡与阈值表，不创造benchmarkscript/TC或未来源目标。每项写实际scope/方法/阈值/来源/缺失裁决，逐项静态停审；实际值与测得值均不在本轮伪填。

## 7. 结构化中间产物

### 9.1 阈值与未执行规则

所有NFR为P0；00§13的不变量是要求不是已测结果。actual数量/时间/容量观测仅安全分类/有界计数/已获准时间差与测试实例，不输出raw外部ID/bucket/endpoint/secret/body。

平台消息/interaction时限、所有rate下界、retention/recovery/attempt窗口及approvedbusinessbudget必须由当前qualified安装/source/method/owner/provider取得；无来源正向blocked。04§7 loader cap（snapshot≤1048576 bytes、depth≤32、累计array elements≤1024）及max_wait_millis合法范围1~60000等只静态解析/本地resource约束，fixture值/公开资料不成为统一SLA、实际quota或批准profile。clock/单位/current必须一致，配置只能更保守，不能缩平台等待下界。

未执行的P0 NFR进入§13缺口登记但**不可风险豁免**，不据planned TC、公开URL或localnegative给actualpositive。正文门禁没有p95/RPS/availability/RTO等未来源数字。

### 9.2 独立NFR门禁

#### AC-NFR-BR-001 受权binding/secret双有效

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-001；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | ExternalBinding.actor_basis/authorization_basis/directions_actions/generation；BridgeInstallation.secret_binding/qualification；qualified secret purpose/scope/current |
| 通过条件 | positive安装/内部授权/责任/target/direction/action与exactsecretrefprovider用途当前有效；negative拒绝missing/stale/跨scope；safe存储与出口扫描零forbidden |
| 失败条件 | 资格互代、默认Active/credentialfallback、rawsecret落durable |
| 副作用断言 | invalid不形成可执行关系/owner或platformIO；不把ref存在当provider可用 |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-017","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 安全 | unauthorized/过期/跨namespace可执行关系及明文durablesecret=0；当前所有必须basis成立；来源00NFR001与04secret实际资格 | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-002 配置/关系/mapping版本与撤销竞争

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-002；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | ConfigRevision/BindingGeneration/LocalRevision/ExpectedGeneration；managementfullmeaning、currentdispatch/action |
| 通过条件 | 配置/binding/mapping版本轴独立全部CAS；重复原meaning复用；并发撤销与排队派发/回调最终current决定；historyknown不被抹去 |
| 失败条件 | 旧generation越撤销、CAS轴互代、冲突silenttargetreplace、rollbackversion |
| 副作用断言 | negative全行零修改；撤销阻新效果，不声称已取消历史foreignIO |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-003","EV-CONTRACT-010","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 幂等/一致性 | samekey同义只原结果，冲突新effect=0；撤销后旧queue新IO=0；来源00NFR002/03fullCAS | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-003 平台消息/交互时限与可信接管

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-003；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | E01/E03 protocol ACK计划与actual执行；safe来源/owneraccept；actualplatformsource/capabilitydeadline、clock及attemptwindow |
| 通过条件 | 未来真实safe时间差证据绑定平台/source/clock和各期限，deadline前/边界/超期/ACKloss完整实例；可靠接管另safe可恢复ref或owner实际accept，不用及时ACK顶替 |
| 失败条件 | 超已核期限却协议成功、统一ACKSLA、token续期、无safe来源声称可靠接管 |
| 副作用断言 | ACK仅protocol；超期/owner未就绪真实解释、不造OwnerAccepted/Turn；rawrequest/token不入计时材料 |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-009","EV-CONTRACT-019","EV-REAL-001","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 性能 | 逐installation/source/mode/family核消息/interaction各自qualified期限；实际ACK/拒绝/deferred必须在该窗口内；未知阈值blocked；来源00NFR003/03平台差异/04qualification | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-004 入站operation/变化/处理位置一致性

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-004；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | InboundHandoffRecord.operation_ref/protocol_disposition/owner_result；ExternalMessageMapping.change_kind/source_ref_version；StreamCursor.namespace_stream/epoch |
| 通过条件 | 同义重复/异义冲突、edit/delete/thread及missingmapping/incomparable/gap完整实例；ACK/ownerposition分离；currentowner合同再取材料才回放 |
| 失败条件 | 变化伪新发言、ACK推进owner、gap吞掉、无saferef自动回放 |
| 副作用断言 | duplicate/illegal无ownernewcall；不从rawdurable补source；sourceversion/原op保留 |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-005","EV-CONTRACT-011","EV-CONTRACT-010"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 幂等/一致性 | 每原operation至多同原owner效果；duplicate新effect=0；ACK带来的ownercomplete推进=0；来源00NFR004/03源recipe/coverage | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-005 外部故障局部隔离

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-005；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | SafePresentationPlan/DeliveryIntent/DeliveryAttempt、committed source、SecretResolution/PlatformDeliveryPort errors |
| 通过条件 | platform unavailable/source/ref/secretexpiry/commitunknown/credentialrevocation故障注入按原safe状态；内部已committedtruth不变；scope隔离不越qualifiedtarget |
| 失败条件 | 外部失效回滚内部Turn、silent换频道/平台、把unknown重标rejected或success |
| 副作用断言 | 仅本地blocked/unknownhistory；恢复不默认新send；没有凭证/附件fallback |
| 具体TC | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-008","EV-CONTRACT-006","EV-CONTRACT-013","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 可用性 | 外部fault造成ownertruth回滚/重造、无受权fallbacktarget/凭证/永久URL=0；unknown不KnownRejected；来源00NFR005 | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-006 安全外显/Gate/附件传播

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-006；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | SafePresentationPlan.disclosure_basis/projection_ref/attachment_grants/presentation_kind；Artifactgrant/window；visibility/Policy/Gate current |
| 通过条件 | 实际披露/提示/入口/action各自basis；敏感只获准安全无action降级，低敏感不默认操作；必要附件准入/读取/传播有效，省略actualowner许可 |
| 失败条件 | 用可用性/低敏感放行敏感内容；能read即share；过期URL替永久公开链接 |
| 副作用断言 | 受限无payload/send/actionbinding；ref/body/URL不出观测；明确unsupported/degraded并非positive送达 |
| 具体TC | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-006","EV-CONTRACT-007","EV-CONTRACT-018","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 安全 | 敏感Gate正文/未获准存在性与附件传播/未授权action=0；必要attachment无basis则阻塞；来源00NFR006/ownerformal权限 | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-007 intent/attempt/receipt效果连续性

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-007；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | StableEffectIdentity、DeliveryIntent原source/target/binding/projection；DeliveryAttempt/PlatformReceipt原attempt_effect/authority_basis |
| 通过条件 | concurrentclaim/崩溃/timeout/leasefence/known拒绝完整实例；same原source/target/versions/effect，新attempt有NoEffect/current/window依据；accepted仅platformstage |
| 失败条件 | 换effect/target消未知、transportOK称Known、leaseexpiredblindretry；accepted称已读/内部done |
| 副作用断言 | unknownhead/claim原责任保留；noeffect仅实际权威证明；ownertruth不改 |
| 具体TC | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-008","EV-CONTRACT-014","EV-CONTRACT-010","EV-CONTRACT-013"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 幂等/一致性 | 每logicaleffect的并发/duplicate额外业务效果=0；unknownreceipt=0；historyimmutable不覆盖；来源00NFR007/03effect/NoEffect | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-008 交互来源/内部责任/action独立

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-008；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | ExternalActionBinding.source_intent/actor_responsibility/target_action/owner_revision/expiry_one_use/authorization_basis；CallbackVerificationRef |
| 通过条件 | 每平台source/installation签验与stored source关系、actual责任/target/action/ownercurrent/expiry；私有context只当前call，不自授权；owner二次决定 |
| 失败条件 | 签名/管理员/按钮/低敏感即approve；actor自动映射或跨sourcecurrent |
| 副作用断言 | invalidzeroownercall/Decisionwrite/RuntimeTools；safe反例扫描不输出敏感选择 |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-018","EV-CONTRACT-002","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 安全 | 伪造/跨主体/跨target/撤销/过期owneraction=0；三个authority独立成立；来源00NFR008/03currentverification | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-009 单次callback效果/延期响应不作Decision

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-009；00§13原NFR；03§8~15/16；04current配置/资格；05对应TC/EV |
| 正式对象/字段/协议/状态 | one_use_claim/CallbackHandoffRecord.operation_ref/protocol_disposition/owner_result；ExternalActionBinding.expiry_one_use；ownerreadonlyprobe |
| 通过条件 | singleuseconcurrent/duplicate/currentownerchanged/unknown/refresult读取完整实例；expiry不续凭证，ACK/deferred/ownresult阶段分开 |
| 失败条件 | 重复新op、延期默认成功、staleresult跨当前visibility泄露、unknown另IDhandoff |
| 副作用断言 | claim不复活/复用，ownerunknown原责任保留；读取旧result仍zeroIOcurrent |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-010","EV-CONTRACT-014","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际当前真实安装/source/method/owner/driver的依据与approved预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值与来源 | 测量scope/未测影响 |
|---|---|---|
| 幂等/一致性 | sameaction重复新ownereffect=0；deferred续token/审批默认批准=0；unknown只原op；来源00NFR009及NFR003interaction期限 | 每实际选用平台/owner/driver及TC全部封闭参数；同run safe原测量输出及EV，当前planned/not_evaluated；未知/未测阻P0正向，§13非可豁免登记 |

#### AC-NFR-BR-010 lane/rate/retry/backlog有界

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-010；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | QualifiedLaneOrderScope/QualifiedRateLimitBoundSet/RetryBudgetRef；DispatchLane.rate_bounds/retry_budget/unresolved_head；04execution/profile；来源/attemptwindow |
| 通过条件 | 逐平台bucket/method/resource/global与跨lane共享scope测试，header单位/clock来源current；server提示下界不得缩；窗口/预算交集实际判断，有界积压且unknownhead阻越序 |
| 失败条件 | 硬编码quota/缩Retry-After/忽略global、无限queue或used归零、无实际budget默认通行、跨lane承诺总序 |
| 副作用断言 | 预算不足只waiting/blocked；不提前retry或换target/lane/账号；localmaxwait不是businessretry授权 |
| 具体TC | ["TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-012","EV-CONTRACT-017","EV-CONTRACT-019","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 性能 | 不早于所有适用rate下界及policybackoff的最大值；actual并发/等待/attempt/backlog≤同scope批准预算；未知或耗尽停止；来源00NFR010/03rate/04hardrange与actualpolicy | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

#### AC-NFR-BR-011 故障/重启/失效有权威恢复

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-011；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | RecoveryRecord原subject/operation_effect/source/currentprobe；LocalCommit/Owner/Platform/Consumer分支；bindinggeneration/window/refavailability |
| 通过条件 | restart/crash/rotatedsecret/expiredmaterial/ownerunavailable/probeunsupported/budgetexhausted完整反例；sameidentityreadonlyreconcile，known合法finalize，无source保missing_source/blocked |
| 失败条件 | binding恢复即重发、无probe把unknown当NoEffect、refexpired换latest/新payload/ID、runtime停机清unresolved |
| 副作用断言 | 原attempt/history/tombstone保留；no rawcache恢复来源；manual/indeterminate如实而非availability通过 |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013","EV-CONTRACT-008","EV-CONTRACT-010","EV-CONTRACT-019","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 可用性 | restart/回退/失效造成额外未知效果或无受权fallback=0；自动续交须原formal权威no-effect/同op恢复合同、current及预算；来源00NFR011 | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

#### AC-NFR-BR-012 安全审计材料与consumer接纳分离

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-012；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | SafeAuditRecord/BodyFreeMutationMaterial、SafeHandoffRecord/canonical/admission/current/disposition；03§14四出口及observabilityproducer |
| 通过条件 | configure/binding/source/owner/callback/attempt/receipt/gap/recovery/handoff原ref版本basisfinite分类可追；actualmutation归档safe，consumer结果只有真实disposition；qualified非递归rule current |
| 失败条件 | 缺关键audit却报完备、producer发送即消费接受、rawbody/hash/secret写证据、缺强制admissionaudit-onlyfallback |
| 副作用断言 | 真实key/audit/result/条件handoff同U；query/noop无fakeaudit；未建立ObservabilityBridgeproducer明确blocked |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-018","EV-CONTRACT-014","EV-CONTRACT-021"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 审计/可追溯 | 每actual关键localmutation唯一safeaudit+originalkey/result；强制交接actual准入缺失不得进行相应positive；forbiddenmaterial=0；来源00NFR012/03observationrule | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

#### AC-NFR-BR-013 namespace/cursor/replay正式覆盖

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-013；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | 六namespacequalifiedkey/fullmeaning/window；StreamCursor.namespace_stream/epoch/comparator_ref/coverage_ref；GapRecord与两coverage |
| 通过条件 | 所有namespace/epoch/current窗口/补集与fault实例，comparator正式，协议/owner/effect水位独立；rebuildlocalonly，不从query/projection构authority |
| 失败条件 | 跨streamposition、stringcompare、snapshot空页全覆盖、expiredkey重执行、rawbodycache重放 |
| 副作用断言 | 未覆盖水位/gap保留；原key/op/effect结果不换；recoveryproof缺失noIO/noadvance |
| 具体TC | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-010","EV-CONTRACT-011","EV-CONTRACT-013","EV-CONTRACT-005","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 幂等/一致性 | 同义单结果、冲突零新效果；不可比/未覆盖gap的stageadvance=0；超过qualifieddedupwindow自动replay=0；来源00NFR013/03typedcontinuity | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

#### AC-NFR-BR-014 安全状态可解释与读取零维护

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-014；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | 四Q/BridgeLocalView.view_subject/scope_ref/stage_slice/qualified_refs/freshness/availability；原stage/current/completecommittedsnapshot |
| 通过条件 | 各visible状态与scope/hidden/degraded/absent/Strong不足/currentrevoked反例；返回前current过滤，无rawrefs/existence泄露；维持protocol/local/owner/platform/consumer/业务独立slice |
| 失败条件 | fresh/empty误盖unknown、查询refresh/repair/replay/advance、hidden总数或不可见原result、workspace缓存授权 |
| 副作用断言 | 维护须独立explicit命令；读取不启动Jobs/allocID/clock刷新state，只纯projector；获准refs有界唯一 |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015","EV-CONTRACT-016","EV-CONTRACT-011","EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 可观测性 | 允许scope内waiting/blocked/known/indeterminate/gap/cooldown/handoffwaiting可准确解释；querymutation/newaudit=0；来源00NFR014/03六view字段 | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

#### AC-NFR-BR-015 所有durable/观测/证据出口零敏感材料

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-015；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | 19Domain/03localstore、四观测出口、BridgeProtocolError、privatelease；05Closed Harness records/canonicaldigest/RedactionCheck；04opaque配置 |
| 通过条件 | 全路径故障/拒绝/SDKDebug/secretcopy/serialisation/storeraw/log/trace/metric/report/handoff负例扫描；所有actualsafeartifact/report redactioncomplete，扫描细节只safefixture标签/finite摘要 |
| 失败条件 | 一处未覆盖出口、hash敏感正文、先存后清洗、rawSDKerror.source、隐藏审批existence、token出现 |
| 副作用断言 | 禁止材料不durable/不外显，不输出扫描命中值；实际泄漏构原VETO相应确证，不用脱敏补报告豁免安全 |
| 具体TC | ["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-018","EV-CONTRACT-021","EV-CONTRACT-017","EV-CONTRACT-019","EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 安全 | 未获准body/attachments/rawplatformerror/secret/token/OAuthcode/privatecallback/tokenizedURL/敏感审批/未许可存在性及可还原派生=0；来源00NFR015/DR017~020 | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

#### AC-NFR-BR-016 阶段/低基数与真实性不提升readiness

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | NFR-BR-016；00§13原NFR；03§8~15/16；04currentqualification/预算；05对应closedTC/EV |
| 正式对象/字段/协议/状态 | ProtocolAck/LocalCommit/Owner/Platform/Consumer各slot；finiteevent/trace/log/metric分类；05record status/currentcoverage/maturity/qualification |
| 通过条件 | 每safe结果绑定actualauthority/scope与同run真实实例，低基数有限分类；materialrefs只有获准报告路径，不入metriclabels；未测/未资格planned/not_evaluated/blocked；设计自检与运行结论分开 |
| 失败条件 | configurationaccepted/ACK/localcomplete当owner或platformsuccess；staticmapping物化EV/签名，公共研究称4of4，maturity夸大 |
| 副作用断言 | 没有actualrun/report，本轮只有normative设计；history/unknown原责任如实；negative局部通过不能替positive资格 |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-CONTRACT-016","EV-CONTRACT-019","EV-CONTRACT-018","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualscope/currentowner/platform/source/driver/admission与approved窗口/预算须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| 维度 | 指标/阈值及来源 | 测量scope/未测影响 |
|---|---|---|
| 可观测性 | 阶段错误提升、rawID/endpoint/自由文本/digest/凭证进入低基数材料、假run/receipt/test/EV/verdict/signoff/readiness=0；来源00NFR016/03truthboundary/05四成熟度 | 全部具体TC及封闭参数、同run safe测量/check/EV/固定路径；当前planned/not_evaluated；未测/未知阻P0正向、§13非豁免登记 |

### 9.3 质量门禁聚合规则

| 聚合面 | required规则 | 裁决影响 |
|---|---|---|
| 16原NFR/六类别 | 每项阈值、测量scope、通过/失败/副作用及具体TC/EV分别满足 | 无未来源SLA；计划不产生actual值 |
| static/approved/actual | loader hard cap不是服务SLA，fixture不是approved profile；actual deadline/rate/window不得猜测 | 资格或预算缺失阻对应positive |
| 禁止与不变量 | 0/单原effect沿00要求，与实际测试结果分离 | 实际违反P0阻正向，原VETO按§11确证 |
| 专项未执行 | required P0未测须在§13保留不可豁免缺口 | 不允许风险接受将未测P0判通过 |
| scope/安全 | 各实际安装/owner/driver/窗口独立证据；测量只用safe分类/时间差/有界计数 | 不保存原消息或凭证以证明测试 |

只有实际完整测量与资格满足本卡才可裁actual通过；文档自检不能释放平台、性能、availability或readiness。

## 8. 回填草稿

正式06§9直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15装配前过程归档

以下为本Step原§7末的设计静态审查记录，仅留过程区，不进入正式正文，不代表运行。

### 9.3 跨NFR停审

| 审查 | 设计结论 | 裁决影响 |
|---|---|---|
| 16原NFR/六类别 | 16独立卡一一映射，阈值/测量scope/通过失败副作用/具体TC与EV固定路径 | 无未来源SLA，actual值全部未测 |
| static/approved/actual | loaderhardcap≠服务SLA，fixture≠approvedprofile，actualqualifieddeadline/rate/window缺失不可猜 | 对应positive blocked |
| 禁止与不变量 | 0/单原effect是00要求，不是测试结果 | actual违反P0阻正向，VETO按§11确证 |
| 专项未执行 | 全部planned；§13记录非可豁免P0缺口 | 不采用“未测但风险接受所以通过” |
| scope/安全 | 每实际安装/owner/driver/窗口独立证据，measurement仅safe分类/时间差/有界计数 | 不要求保存原消息/凭证以证明测试 |

只有未来实际完整测量与资格满足本卡，才允许actual门禁通过；文档自检不释放任何平台、性能、availability或readiness。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| AC-NFR-BR-001 | 正式合同/原字段、通过/失败/副作用、21个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-002 | 正式合同/原字段、通过/失败/副作用、20个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-003 | 正式合同/原字段、通过/失败/副作用、36个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-004 | 正式合同/原字段、通过/失败/副作用、18个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-005 | 正式合同/原字段、通过/失败/副作用、26个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-006 | 正式合同/原字段、通过/失败/副作用、20个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-007 | 正式合同/原字段、通过/失败/副作用、21个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-008 | 正式合同/原字段、通过/失败/副作用、21个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-009 | 正式合同/原字段、通过/失败/副作用、23个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-010 | 正式合同/原字段、通过/失败/副作用、30个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-011 | 正式合同/原字段、通过/失败/副作用、34个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-012 | 正式合同/原字段、通过/失败/副作用、21个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-013 | 正式合同/原字段、通过/失败/副作用、24个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-014 | 正式合同/原字段、通过/失败/副作用、17个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-015 | 正式合同/原字段、通过/失败/副作用、34个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-NFR-BR-016 | 正式合同/原字段、通过/失败/副作用、29个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。16NFR及六类别独立门禁完成；无新增未来源SLA/实际值，全部未测P0明确阻正向。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_10。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
