# L6-bridges 06 Step11：一票否决

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step11 / 书写§5.11；回填正式06§11。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| blockers | pass | design_static_only_external_gates_open | enter_step_12 | Step10 22EV/8report门禁；00§14.2原六VETO；01owner/依赖红线；03状态/authority/private/UoW；04 config/secret/actual；05EV/VETO方向及defect规则。 |

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

六VETO严格原ID/名/范围；逐项确证条件、安全检查来源、missing分支、固定veto-checklist与no-waiver，尾表覆盖全部不变量族。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§11已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

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

Step10 22EV/8report门禁；00§14.2原六VETO；01owner/依赖红线；03状态/authority/private/UoW；04 config/secret/actual；05EV/VETO方向及defect规则。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 六原VETO actual确证触发直接不通过；未建资格/unsupported/缺材料不臆判触发。
2. 来源逐条00§14.2原BR/DR/AC及01/03对应红线，不新增否决编号。
3. 检查未来同run实际cases/suites/checks/current资格及safeartifact/report、人审链，证据真实安全，raw材料不为确证公开。
4. 全部no waiver，风险接受/严重度降级/设计认可不覆盖。
5. 核心所有权/授权/材料/阶段/效果位置读取/私有审批全部六族覆盖；其他P0失败按原门禁阻positive，无需新增VETO。
6~8. 各VETO独立卡含具体TC/EV及固定veto-checklist路径、实际触发/缺证据的不同裁决，逐项停审与跨覆盖无豁免冲突。

#### VETO-BR-001 可审查决策记录

- 问题/依据：真相及身份越界如何在00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV的19Domain ownership/typed ref；ExternalIdentityMapping/Location/Message及C03；deleteownerdisposition；L1/platformtruth与GlobalMember范围裁决，所需副作用是否同阶段成立？
- 诊断：只有真实同source/基线与实际断言确证才能触发否决；资料缺失不能当VETO已失败或未触发；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“无材料就写VETO通过/触发或签风险豁免”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### VETO-BR-002 可审查决策记录

- 问题/依据：未授权操作如何在00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV的双重installation/bindingbasis/currentgeneration；SafePresentationPlan.disclosure_basis；ExternalActionBinding.authorization_basis/owner_revision/actor_responsibility范围裁决，所需副作用是否同阶段成立？
- 诊断：只有真实同source/基线与实际断言确证才能触发否决；资料缺失不能当VETO已失败或未触发；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“无材料就写VETO通过/触发或签风险豁免”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### VETO-BR-003 可审查决策记录

- 问题/依据：材料/凭证泄露如何在00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV的全部durable/API/payload/log/trace/metrics/report/evidence/handoff；privatelease/rawerror/secret/callback；redactionallowlist；sensitiveGate/Artifact传播范围裁决，所需副作用是否同阶段成立？
- 诊断：只有真实同source/基线与实际断言确证才能触发否决；资料缺失不能当VETO已失败或未触发；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“无材料就写VETO通过/触发或签风险豁免”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### VETO-BR-004 可审查决策记录

- 问题/依据：阶段或证据伪造如何在00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV的ProtocolAck/LocalCommit/Owner/Platform/Consumerstage；EvidencePage/ReportIndex/Handoff/HumanReview；四maturity与manualfinalauthority范围裁决，所需副作用是否同阶段成立？
- 诊断：只有真实同source/基线与实际断言确证才能触发否决；资料缺失不能当VETO已失败或未触发；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“无材料就写VETO通过/触发或签风险豁免”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### VETO-BR-005 可审查决策记录

- 问题/依据：效果/位置或读取破坏如何在00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV的原op/effect/key/target/window；StreamCursor/GapRecord两coverage；DispatchLane.unresolved_head/rate_bounds；fourQuery no-write范围裁决，所需副作用是否同阶段成立？
- 诊断：只有真实同source/基线与实际断言确证才能触发否决；资料缺失不能当VETO已失败或未触发；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“无材料就写VETO通过/触发或签风险豁免”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### VETO-BR-006 可审查决策记录

- 问题/依据：私有审批/直接执行如何在00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV的C05初绑/E03one-use/OwnerActionPort；Gate/Decisionownertruth；禁止Runtime/Tools直接执行source；formalresponsibility/Policy/Gate范围裁决，所需副作用是否同阶段成立？
- 诊断：只有真实同source/基线与实际断言确证才能触发否决；资料缺失不能当VETO已失败或未触发；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“无材料就写VETO通过/触发或签风险豁免”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

06若简单把缺report就认定VETO触发，会伪造实际问题结论；反之以unsupported/blocked为正向passed也违反实际阶段。需要明确确证负向退出无需先跑完全部正向，但原basis/source/authority必须足够。

## 5. 改动前后对比

| 校准 | 误用 | 本步决定 |
|---|---|---|
| 六原ID | 另造红线/第七VETO | 原名/来源/范围不变 |
| 缺材料 | 自动判actualVETO失败 | pause/not_evaluated，阻positive |
| 确证failure | 仍等所有正向结果才结论 | 足够安全真实材料可提前不通过 |
| 风险接受 | 有人签就覆盖 | 六项无豁免，P0/S/A同样不可 |

## 6. 验收裁决取舍与复杂度

六VETO各微循环，复杂度高；下列safe检查只定义未来证据链，不调用业务、不存raw、不创建实际checklist/run/verdict。整个项目范围与P0红线不扩大。

## 7. 结构化中间产物

### 11.1 确证/缺证据与否决权

唯一否决项为00§14.2六原ID。每卡“通过条件”指未来actual完整检查证明该范围未破坏红线；当前planned/not_evaluated。平台不支持/SDK或provider未选/材料未生成不是新增VETO，但不能P0正向放行。

actual确证触发任一原VETO，授权验收方依据安全同run/source/baseline材料裁总体**不通过**，无riskacceptance或条件通过；已有充分确证可以负向终止，不必等待全部剩余正向case。若只有疑点、缺material/check/qualification而不能确证，暂停核验，不伪填触发/未触发/通过；仍禁止正向结论。

### 11.2 六独立否决检查

#### VETO-BR-001 真相及身份越界

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | VETO-BR-001、BR-BR-001、BR-BR-003、BR-BR-009、AC-BR-004、AC-BR-011、AC-BR-020；00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV |
| 正式对象/字段/协议/状态 | 19Domain ownership/typed ref；ExternalIdentityMapping/Location/Message及C03；deleteownerdisposition；L1/platformtruth与GlobalMember |
| 通过条件 | actual两端truth/权限不归本仓，owner私表/正文mirror/内部entity自动create均0；mapping/knownreceipt仅local关系事实；外部delete只原获准变化，不抹内部truth |
| 失败条件 | 实际存储/调用/结果确证owner或平台truth越界、内部delete抹truth、external_id创建GlobalMember；对应badscope行与source/current同run可复核 |
| 副作用断言 | 检查只safe计数/分类/refs及testassertions；无试图补造identity/owner事实；actual触发阻全部正向，不公开真实IDs |
| 具体TC | ["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005","TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-003","EV-CONTRACT-005","EV-CONTRACT-018","EV-CONTRACT-014","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；该VETO actual确证触发即总体不通过，禁止风险接受/有条件通过；充分负证可提前终止，其余not_evaluated不伪pass。无材料暂停，不臆判失败或签署 |

| 否决检查固定路径 | 处理规则 |
|---|---|
| `reports/acceptance/<run_id>/veto-checklist.md` | 本原ID逐项人工安全检查，回指同run真实EV/report/check/artifact/current资格；无材料标not_evaluated/blocked，不造“未触发” |
| `reports/acceptance/<run_id>/decision.md`及`signatures.md` | §14实际授权验收方只三值裁决；本项确证触发必须不通过，no waiver；当前waiting未创建 |
| 缺口/副作用 | safe检查/只读反查，缺证pause；不要求raw业务body/secret或运行新的外部效果去补证据 |

#### VETO-BR-002 未授权操作

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | VETO-BR-002、BR-BR-002、BR-BR-004、BR-BR-010、BR-BR-011、BR-BR-014、BR-BR-016、AC-BR-003、AC-BR-016、AC-BR-023；00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV |
| 正式对象/字段/协议/状态 | 双重installation/bindingbasis/currentgeneration；SafePresentationPlan.disclosure_basis；ExternalActionBinding.authorization_basis/owner_revision/actor_responsibility |
| 通过条件 | actual所有相应effects双重资格及finalcurrent成立；撤销/跨actor/target/missingbasis拒绝效果0；低敏感/签名不默认display/action；owner当前二次核验 |
| 失败条件 | actual外呼/ownerhandoff已发生且current权限缺失/撤销/跨scope或仅按钮签名/低敏感即授权；source/basis与测试assertion真实关联 |
| 副作用断言 | 检查不以secret/grant值公开证明，只safequalification槽及正式privateauthority审查；actual未经授权effects不可risk豁免 |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004","TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002","EV-CONTRACT-006","EV-CONTRACT-009","EV-CONTRACT-017","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；该VETO actual确证触发即总体不通过，禁止风险接受/有条件通过；充分负证可提前终止，其余not_evaluated不伪pass。无材料暂停，不臆判失败或签署 |

| 否决检查固定路径 | 处理规则 |
|---|---|
| `reports/acceptance/<run_id>/veto-checklist.md` | 本原ID逐项人工安全检查，回指同run真实EV/report/check/artifact/current资格；无材料标not_evaluated/blocked，不造“未触发” |
| `reports/acceptance/<run_id>/decision.md`及`signatures.md` | §14实际授权验收方只三值裁决；本项确证触发必须不通过，no waiver；当前waiting未创建 |
| 缺口/副作用 | safe检查/只读反查，缺证pause；不要求raw业务body/secret或运行新的外部效果去补证据 |

#### VETO-BR-003 材料/凭证泄露

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | VETO-BR-003、BR-BR-005、BR-BR-011、BR-BR-012、BR-BR-021、DR-BR-017、DR-BR-018、DR-BR-019、DR-BR-020、AC-BR-017、AC-BR-037、AC-BR-038；00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV |
| 正式对象/字段/协议/状态 | 全部durable/API/payload/log/trace/metrics/report/evidence/handoff；privatelease/rawerror/secret/callback；redactionallowlist；sensitiveGate/Artifact传播 |
| 通过条件 | actual全出口完整safe检查，禁止body/凭证/privatecallback/敏感审批/rawerror/未许可存在性及可还原派生0；附件真实grant/expiry传播受控；unsafe候选不落盘 |
| 失败条件 | 实际出口/存储安全检查确证任一forbidden材料、敏感Gate正文外显或附件非法公开传播；不能以事后脱敏表覆盖 |
| 副作用断言 | 禁止记录raw命中值/原buffer/正文hash/凭证URL；安全确证只有限类别/测试path摘要，incidentprivate渠道核；触发无豁免 |
| 具体TC | ["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004","TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-018","EV-CONTRACT-006","EV-CONTRACT-007","EV-CONTRACT-017","EV-CONTRACT-021","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；该VETO actual确证触发即总体不通过，禁止风险接受/有条件通过；充分负证可提前终止，其余not_evaluated不伪pass。无材料暂停，不臆判失败或签署 |

| 否决检查固定路径 | 处理规则 |
|---|---|
| `reports/acceptance/<run_id>/veto-checklist.md` | 本原ID逐项人工安全检查，回指同run真实EV/report/check/artifact/current资格；无材料标not_evaluated/blocked，不造“未触发” |
| `reports/acceptance/<run_id>/decision.md`及`signatures.md` | §14实际授权验收方只三值裁决；本项确证触发必须不通过，no waiver；当前waiting未创建 |
| 缺口/副作用 | safe检查/只读反查，缺证pause；不要求raw业务body/secret或运行新的外部效果去补证据 |

#### VETO-BR-004 阶段或证据伪造

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | VETO-BR-004、BR-BR-007、BR-BR-013、BR-BR-016、BR-BR-022、AC-BR-008、AC-BR-018、AC-BR-024、AC-BR-032、AC-BR-038；00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV |
| 正式对象/字段/协议/状态 | ProtocolAck/LocalCommit/Owner/Platform/Consumerstage；EvidencePage/ReportIndex/Handoff/HumanReview；四maturity与manualfinalauthority |
| 通过条件 | actualsafe记录与stage实际来源符合，ACK不ownercommit、internalcommit不externalreceipt、callbackresponse不Decision、handoff不consumeraccept；run/case/EV/signature真材料且无自动ready |
| 失败条件 | 真实报告/状态或签署确证错误阶段提升、静态物化run/evidence/test/receipt/verdict/signoff/readiness；aggregateexit0不能对抗actualcase |
| 副作用断言 | audit/ref/plan不升级EV；检查与reportonlyread不fabricatecase/身份；充分确证可直接不通过，不强制凑全正向测试 |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005","TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005","TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004","EV-CONTRACT-008","EV-CONTRACT-009","EV-CONTRACT-016","EV-CONTRACT-019","EV-CONTRACT-021"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；该VETO actual确证触发即总体不通过，禁止风险接受/有条件通过；充分负证可提前终止，其余not_evaluated不伪pass。无材料暂停，不臆判失败或签署 |

| 否决检查固定路径 | 处理规则 |
|---|---|
| `reports/acceptance/<run_id>/veto-checklist.md` | 本原ID逐项人工安全检查，回指同run真实EV/report/check/artifact/current资格；无材料标not_evaluated/blocked，不造“未触发” |
| `reports/acceptance/<run_id>/decision.md`及`signatures.md` | §14实际授权验收方只三值裁决；本项确证触发必须不通过，no waiver；当前waiting未创建 |
| 缺口/副作用 | safe检查/只读反查，缺证pause；不要求raw业务body/secret或运行新的外部效果去补证据 |

#### VETO-BR-005 效果/位置或读取破坏

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | VETO-BR-005、BR-BR-017、BR-BR-018、BR-BR-019、BR-BR-020、BR-BR-023、BR-BR-024、AC-BR-029、AC-BR-030、AC-BR-031、AC-BR-033、AC-BR-034；00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV |
| 正式对象/字段/协议/状态 | 原op/effect/key/target/window；StreamCursor/GapRecord两coverage；DispatchLane.unresolved_head/rate_bounds；fourQuery no-write |
| 通过条件 | actualunknown只原identity权威readonlyprobe/合法sameeffect资格；no BlindRetry/targetswap，gapfullcoverage才能closed/推进；windowunknown/expired不automaticreplay；Qwrite/probe/replay/audit0 |
| 失败条件 | actual timeout/leaseunknown盲重发/换ID目标、越gap虚报complete、window无效自动replay或Query有维护/效果；原identity/期望/副作用断言同source |
| 副作用断言 | negative全部safe计数/finite状态，不记录rawop/外部IDs；检查不启动真实retry/maintenance；unknown原责任不清 |
| 具体TC | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005","TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004","TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-010","EV-CONTRACT-011","EV-CONTRACT-012","EV-CONTRACT-013","EV-CONTRACT-015","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；该VETO actual确证触发即总体不通过，禁止风险接受/有条件通过；充分负证可提前终止，其余not_evaluated不伪pass。无材料暂停，不臆判失败或签署 |

| 否决检查固定路径 | 处理规则 |
|---|---|
| `reports/acceptance/<run_id>/veto-checklist.md` | 本原ID逐项人工安全检查，回指同run真实EV/report/check/artifact/current资格；无材料标not_evaluated/blocked，不造“未触发” |
| `reports/acceptance/<run_id>/decision.md`及`signatures.md` | §14实际授权验收方只三值裁决；本项确证触发必须不通过，no waiver；当前waiting未创建 |
| 缺口/副作用 | safe检查/只读反查，缺证pause；不要求raw业务body/secret或运行新的外部效果去补证据 |

#### VETO-BR-006 私有审批/直接执行

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | VETO-BR-006、BR-BR-015、AC-BR-022、AC-BR-024、AC-BR-025；00§14.2原VETO来源；01owner/依赖红线；03§8~14/16；04current；05对应TC/EV |
| 正式对象/字段/协议/状态 | C05初绑/E03one-use/OwnerActionPort；Gate/Decisionownertruth；禁止Runtime/Tools直接执行source；formalresponsibility/Policy/Gate |
| 通过条件 | actualcallback只受权正式owner动作+owner二次核验；BridgesGate批准/Decision写及直接Runtime/Tools=0，外部低敏感/reaction/管理员不授action |
| 失败条件 | 实际localapprove/Gatewrite/Decision或callback直接Runtime/Tools效果确证绕owner正式动作；当前责任/授权不可被签名补齐 |
| 副作用断言 | 检查zerobusinesswrite，素材不复制敏感审批选择/context；source/auth未知pause、不补Decision结果；actualtrigger不风险接受 |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009","EV-CONTRACT-018","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际selected owner/platform/driver/current须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；该VETO actual确证触发即总体不通过，禁止风险接受/有条件通过；充分负证可提前终止，其余not_evaluated不伪pass。无材料暂停，不臆判失败或签署 |

| 否决检查固定路径 | 处理规则 |
|---|---|
| `reports/acceptance/<run_id>/veto-checklist.md` | 本原ID逐项人工安全检查，回指同run真实EV/report/check/artifact/current资格；无材料标not_evaluated/blocked，不造“未触发” |
| `reports/acceptance/<run_id>/decision.md`及`signatures.md` | §14实际授权验收方只三值裁决；本项确证触发必须不通过，no waiver；当前waiting未创建 |
| 缺口/副作用 | safe检查/只读反查，缺证pause；不要求raw业务body/secret或运行新的外部效果去补证据 |

### 11.3 六否决族覆盖规则

| 不变量族 | 唯一原否决 | 覆盖与不冲突规则 |
|---|---|---|
| owner/platformtruth与身份 | VETO-BR-001 | mapping/变化/owner私表/GlobalMember；其他P0边界同样阻正向但不新增VETO |
| 双资格/current披露/action | VETO-BR-002 | 安装与内部basis/撤销/actor/target/低敏感/签名，依赖缺失只pause |
| 全出口body/secret/敏感/附件 | VETO-BR-003 | API/观测/报告/人审与durable/临时候选，unsafe内容不为确证归档 |
| 阶段/材料真实性 | VETO-BR-004 | ACK/local/owner/platform/consumer分离，四成熟度、EV/签署真实，不造ready |
| unknown/key/cursor/window/no-write | VETO-BR-005 | 原effect/current/rate/覆盖/replay/Query；绝不以risk接受作为gapcomplete |
| owner审批与执行 | VETO-BR-006 | 只ownerhandoff，不localDecision或Runtime/Tools；各动作资格独立 |

同一安全事实可触发多项，但不构成多次执行或新VETO。S/A/P0/VETO不可风险接受；充分确证负向不强求剩余positive，证据不足则暂停；没有实际否决检查结果时不得臆判触发、未触发、verdict或签署。

## 8. 回填草稿

正式06§11直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15装配前过程归档

以下为本Step原§7末的设计静态审查记录，仅留过程区，不进入正式正文，不代表运行。

### 11.3 跨VETO覆盖停审

| 不变量族 | 唯一原否决 | 覆盖与不冲突规则 |
|---|---|---|
| owner/platformtruth与身份 | VETO-BR-001 | mapping/变化/owner私表/GlobalMember；其他P0边界同样阻正向但不新增VETO |
| 双资格/current披露/action | VETO-BR-002 | 安装与内部basis/撤销/actor/target/低敏感/签名，依赖缺失只pause |
| 全出口body/secret/敏感/附件 | VETO-BR-003 | API/观测/报告/人审与durable/临时候选，unsafe内容不为确证归档 |
| 阶段/材料真实性 | VETO-BR-004 | ACK/local/owner/platform/consumer分离，四成熟度、EV/签署真实，不造ready |
| unknown/key/cursor/window/no-write | VETO-BR-005 | 原effect/current/rate/覆盖/replay/Query；绝不以risk接受作为gapcomplete |
| owner审批与执行 | VETO-BR-006 | 只ownerhandoff，不localDecision或Runtime/Tools；各动作资格独立 |

六项逐原ID/正式来源/具体TC/EV/固定路径/触发裁决静态停审完整；同安全事实可触发多项但不是多次执行或新VETO。S/A/P0/VETO不能风险接受；确证负向不强求剩余positive，证据不足则暂停。当前未有实际否决检查结果、触发、verdict或签署。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| VETO-BR-001 | 正式合同/原字段、通过/失败/副作用、27个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| VETO-BR-002 | 正式合同/原字段、通过/失败/副作用、32个具体TC和5个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| VETO-BR-003 | 正式合同/原字段、通过/失败/副作用、37个具体TC和6个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| VETO-BR-004 | 正式合同/原字段、通过/失败/副作用、32个具体TC和6个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| VETO-BR-005 | 正式合同/原字段、通过/失败/副作用、29个具体TC和6个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| VETO-BR-006 | 正式合同/原字段、通过/失败/副作用、17个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。六原VETO independent检查卡与crosscoverage完成，只定义确证标准，不填写实际触发/未触发/验收结论。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_12。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
