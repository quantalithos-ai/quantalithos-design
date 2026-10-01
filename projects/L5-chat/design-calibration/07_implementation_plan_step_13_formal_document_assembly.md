# L5-chat 07 · Step 13 参考

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | formal_stop_review；等待用户审阅，implementation wait_design |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step12已done、07flow/项目台账与对应来源；07 SOP Step13、书写规范5.13；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

正式13章只回填Step1～12收口规则和本Step参考；十表/局部/整体停审留calibration。10phase/21boundary/55经验/TC-EV-gate-source mapping及完整plannedledgers必须静态核后停审。

## 4. 当前文档问题诊断

没有正式07与implementationledger/skeleton，不能依靠旧README或提前判ready；本Step正式装配前先建立来源/十类审计，实际结果后填。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 没有正式07与implementationledger/skeleton，不能依靠旧README或提前判ready；本Step正式装配前先建立来源/十类审计，实际结果后填。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

不复制03字段schema或测试全文，仅source索引/任务与门禁；当前HEAD与formalbytes指纹分离approvedcommit，所有implementation实际gate保持blocked或pending。

## 7. 结构化中间产物

### 13.1 本项目正式来源

| 材料 | 阅读/使用位置 | 依据边界 |
|---|---|---|
| [00-需求文档.md](../00-需求文档.md) | 当前需求/实际AC/owner与项目/BPMN/目录范围 | 当前36actualAC；BASE001明确保留 |
| [01-架构设计.md](../01-架构设计.md)、[02-概要设计.md](../02-概要设计.md) | SDK-only、Desktop、组件/port与owner分域 | 不用历史README推业务模型 |
| [03-详细设计.md](../03-详细设计.md) | §3～16文件/载体/协议/flow/状态/一致性/测试切口 | local contract唯一来源，SDK positive仍blocked |
| [04-配置设计.md](../04-配置设计.md) | §3～13六profile/八域14字段/来源/激活/回退 | 示例非productionbudget，不授native权限 |
| [05-测试方案.md](../05-测试方案.md) | §6/7/9/13/14 TC/fixture/suite/EV/runner/schema/maturity | 216TC/16suiteEV，真实分层不足不能fake |
| [06-验收标准.md](../06-验收标准.md) | §3～14 gate/VETO/schema/defect/risk/review/签署 | 142P0/10VETO与私有DTO不重定义 |
| [设计台账](project_execution_ledger.md)与07flow/13Step | 恢复/校准/每章来源、局部停审与整体审计 | calibration解释，不覆盖formal；后续开工另读实施台账 |

### 13.2 规范来源

| 规范 | 使用章节 |
|---|---|
| [设计文档编写通则](../../../standards/document/设计文档编写通则.md) | 全文结构/小循环/正式正文只收口结论 |
| [中间产物规范](../../../standards/document/设计文档讨论中间产物规范.md) | 三层台账/逐Step/§5.10十类跨文档审计 |
| [真相源闭环与可落码性标准](../../../standards/document/设计真相源闭环与可落码性标准.md) | §7artifact/report；§9.1/9.2逐boundary55经验与暂停 |
| [全局依赖规则](../../../standards/document/全局项目依赖关系与裁剪规则.md) | §4.1 Layer5窗口/依赖类型裁剪，项目内部串行 |
| [需求SOP](../../../standards/document/需求文档讨论流程_SOP.md)、[需求书写规范](../../../standards/document/需求文档书写规范.md) | 启动边界/核心闭环与正式需求编号/owner，不在07增需求 |
| [实施计划SOP](../../../standards/document/实施计划讨论流程_SOP.md)、[实施计划书写规范](../../../standards/document/实施计划书写规范.md) | Step1～13对应正文/phase/batch/commit/memory/gates |
| [实施台账与门禁规范](../../../standards/document/代码实施台账与门禁规范.md) | §3.2.1全部planned skeleton、七gate/Worktree/恢复与实际记录 |
| [目录与文件规范](../../../standards/document/子项目目录与代码文件组织规范.md) | 单app/host命名、script/artifact/report位置 |
| [TypeScript规范](../../../standards/coding/typescript.md)、[JavaScript规范](../../../standards/coding/javascript.md)、[HTML/CSS规范](../../../standards/coding/html.md) | 按当前language文件读取，strict/type/组件/脚本/文档与视觉语义 |
| [Rust规范](../../../standards/coding/rust.md) | 只nativehost Rust，English/rustdoc/variant/fmt/clippy |
| [项目提交规范](../../README.md) §8.2 | 设计中文/实现英文、scope/body/footer与记忆唯一种子 |

### 13.3 上游与参考边界

十个专项上游L0-sdk、L1-conversation、L1-identity、L1-work、L1-governance、L1-artifact、L1-workspace、L2-member、L2-runtime、L4-observability的当前00～07及必要台账已读，当前正式80文件指纹刷新；只按§1/3/8/9引用其正式消费能力，不因文档存在称服务已接通。Process补充读[L1-process正式01](../../L1-process/01-架构设计.md)、[正式02](../../L1-process/02-概要设计.md)，positive安全projection仍待正式SDK合同。关系/目录provider仍待确认。

[L1-governance 07](../../L1-governance/07-实施计划.md)仅作为phase/任务/提交粒度格式参考，03对应Step5～10沿此前已确认粒度；不引入治理backend/UoW/outbox语义作为Chat对象。旧Chat README、旧正文、draft/prototype和/tmp/chat仅historical/体验对照，不提供owner DTO、SDKexport或EV。L6-bridges仅并行兄弟boundary_reference，未停审设计不是正式输入。

### 13.4 使用与停点

正式本章只列已阅读依据和使用范围；十类审计、逐phase/boundary经验/停审记录留07各Step，正式§12给可审查移交门禁。全部implementation ledger/skeleton只是planned计划，不创建实现仓/source/lock/agent记忆、真实runner/artifact/report/review/signature或commit。正式07装配及静态审计完成后停审，继续实现需要用户后续明确范围与approvedbaseline。

### 本Step过程审查（不进正式正文）

#### 1. 真相源表

| 设计事实 | 真相源文档/章节 | 后续消费者 | 冲突/当前结论 |
|---|---|---|---|
| 需求/owner/实际AC | 当前00/01/02 | 03～07/实施 | 36actualAC；BASE001未改未关 |
| local字段/DTO/port/factory/props | 当前03 §5/6/7；03 Step6/7/8 | 05/06/07/实现 | 单一定义；不复制进memory或私造wire |
|43协议/flow | 03 §7/8与Step8/9 |05/06/07 | one-to-one，phase首次行为指定 |
|17状态/12enum |03 §5/9与Step6/10 |tests/acceptance | same词表；future保留reserved |
| 配置source/profile/十四字段 |04 §3～13 |runner/composition/baseline | strict来源与安全字面常量，不授权限 |
| TC/suite/EV/schema |05 §6/9/13 |06/07/tools |216/16/16原身份；完整分母/actualscope |
| gate/VETO/私有验收 |06 §5～14 |07/tools/review |142/10/六签署；E018签署前review |
| phase/boundary/批次/memory/maturity |本轮07 Step3～12 |form07/实施台账 |10phase/21boundary；当前actual未开始 |
| SDK/ownerformal能力 |十上游及Process/provider正式合同 | SDK adapter/real tests | CHAT-UP/WS-UP仍open；无旁路 |

#### 2. 字段闭环表

| local对象 | 字段组/类型 | 正式来源/factory | 输入映射/缺失 | 测试/验收/责任boundary |
|---|---|---|---|---|
| Route/Consumption | actor/scope/context/source/request/slot/generation/parent/query，ExternalHandle与fence |03 §5.1/7.4.1，QualifiedEntryResolution/Consumption factory | currentrequest/SDKregistry；缺authority/current拒绝，不route推scope |TC-PROTO-009/010、TC-STATE-001～009；GATE-CHAT-P-005/S-001～003；02-a |
| SafeMaterial/Preview | provenance/freshness/disclosure/ref/content/visibility |03 §5.2；SafeMaterialFactory/PreviewBoundary |qualifiedsafe材料；hidden清ref、unknown不能guessbody |TC-PROTO-015～018、TC-SAFE-004/008；02-b/03-b |
| Draft/Attempt | draftRef/revision/text/ref/submitting；intent/association/authority/result姿态 |03 §5.4、§12；Draft/Attempt/ResultGate |用户safe输入/正式prepare/结果，samefence/revision；ACK/unknown无终结 |TC-PROTO-001～004/051/052/071/072、STATE031～036、CONC001～005；04-a/b |
| Project/Process | project/currenttab/stage/node/source/parenttopology/versions/safeedges/ownersections |03 §5.3/7.6/8.6/9.5具名工厂 |正式Process/Worksafe材料；缺parent/超限blocked/stale/unsupported |TC-PROTO-033～042/083/084、STATE010～024、SAFE005、AT002；06-a/b |
| Link/Directory | bindingRef/targetaccess、providercoverage/query/pagelineage/三成员集合 |03 §5.3/7.6/7.10 |formalrelation/provider、independentaccess；未知coverage不称全员 |TC-PROTO-043～048/085/086、STATE025～030、SAFE006；06-c |
| Root/Repository | LocalVersion/partition/cachekey/snapshot/entry版/consumptioncheck |03 §5.6/10，ClientStatePort/MemoryRepo |同read版同turnCAS；delete失败restricted，无durable |TC-PROTO-025～028/077～080、STATE040～048、CONC010；02-b/05/09 |
| Continuity/Resume | source/changeidentity/watermark/recoveryRef/coverage/current |03 §5.5/7.7/7.9/8/9.7/12 |SDKqualified/source-local；gap/revoke先失效、ACK不fresh |TC-PROTO-049～060/067～076、STATE037～045/CONC；05-a/b |
| Platform/Config | trustedorigin/window/kind/capability与14validated字段 |03 §5.8/5.9/5.11；04完整strictsource |trustedinvocation/approvedpolicy、三leaf安全缺省；无许可blocked |CFG001～024、PROTO029/030、STATE049～051/REAL002/003；01/08 |
| machine/acceptance |完整05JSON/FileRef/CaseInstance与06ExpectedInstance/嵌套digest/六signoffs |05 §13.3～6；06 §10.4～6 |actualwriter/reader严格schema+JCS/bytesdigest，无actual不补ref |TC-REPORT-001～007、GATE-CHAT-E-001～018；01-b/09-b/10-a |

#### 3. DTO / Event / Job到local对象构造闭环表

| 输入族 | 目标local对象 | 完整来源/派生 | 不得混同/缺失行为 | 协议/责任 |
|---|---|---|---|---|
| 受控Command/localintent |Draft/Attempt/Feedback |03 §7.3/8.3/5.4/12逐字段/factory |local intentRef≠ownerkey/result；missingprepare blocked，potentialeffectunknown |SubmitConversationIntent/SubmitGovernanceIntent等；04/05 |
| Query response |SafeVM/Page/Freshness |03 §7.4～6/8.4～6具名Factory/load/failLoad |empty≠notvisible/missing；snapshot版≠sourcecursor；缺依赖typederror |20Query；§7.2逐映射 |
| SDK inbound consumer |ChangeAcceptance/LocalConsumerReceipt/rootpatch |03 §7.7/8.7/10current检查同CAS |SDKACK≠ownercommit；late不把incoming改current；unknown/gap不fresh |七consumer；04/05 |
| 诊断/support |DiagnosticContext/HandoffView |03六字段/usercurrent/mode/sink |不扩rawlog/ref/token；disabled零IO；unknown无retry |三support协议/Job；05-b/07-b |
| localmaintenance/recovery |Continuity/Resume/LocalProjection/RecoveryVM |03 §7.9/8.9/10/12正式source/版本读面 |noownerjobUoW/outbox；restart重验/不恢复confirmed；delete失败restricted |八恢复维护Job；02/04/05 |
| Local nav/search |ProjectNavigation/LocalDirectorySearch |03 §7.10/8.10当前root/parent/query |选择不binding；旧页不混query；错current拒绝 |NavigateProjectContext/UpdateDirectorySearch；06 |

#### 4. 状态闭环表

| 主体与正式状态源 | enum/matrix/trigger来源 | 合法/非法判定 | TC/EV/boundary |
|---|---|---|---|
| RouteContext | 03 §9.4.1/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-001, TC-STATE-002, TC-STATE-003；EV-UNIT-003；commit-02-a |
| AccessPosture | 03 §9.4.2/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-004, TC-STATE-005, TC-STATE-006；EV-UNIT-003；commit-02-a |
| ClientConsumptionContext | 03 §9.4.3/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-007, TC-STATE-008, TC-STATE-009；EV-UNIT-003；commit-02-a |
| SelectionState | 03 §9.5.1/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-010, TC-STATE-011, TC-STATE-012；EV-UI-002；commit-03-a |
| ProjectNavigationState | 03 §9.5.2/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-013, TC-STATE-014, TC-STATE-015；EV-UI-002；commit-06-a |
| ProjectDetailViewModel | 03 §9.5.3/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-016, TC-STATE-017, TC-STATE-018；EV-UI-002；commit-06-a |
| ProcessFlowViewModel | 03 §9.5.4/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-019, TC-STATE-020, TC-STATE-021；EV-UI-002；commit-06-b |
| ProcessNodeDetailViewModel | 03 §9.5.5/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-022, TC-STATE-023, TC-STATE-024；EV-UI-002；commit-06-b |
| ProjectConversationLinkViewModel | 03 §9.5.6/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-025, TC-STATE-026, TC-STATE-027；EV-UI-003；commit-06-c |
| CompanyDirectoryViewModel | 03 §9.5.7/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-028, TC-STATE-029, TC-STATE-030；EV-UI-003；commit-06-c |
| DraftState | 03 §9.6.1/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-031, TC-STATE-032, TC-STATE-033；EV-UNIT-001；commit-04-a |
| CommandAttemptState | 03 §9.6.2/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-034, TC-STATE-035, TC-STATE-036；EV-UNIT-001；commit-04-a |
| FreshnessMarker | 03 §9.7.1/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-037, TC-STATE-038, TC-STATE-039；EV-UNIT-002；commit-02-b |
| SafeMaterialSnapshot | 03 §9.7.2/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-040, TC-STATE-041, TC-STATE-042；EV-UNIT-004；commit-02-b |
| ContinuityState | 03 §9.7.3/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-043, TC-STATE-044, TC-STATE-045；EV-UNIT-002；commit-05-a |
| LocalProjectionEntry | 03 §9.7.4/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-046, TC-STATE-047, TC-STATE-048；EV-UNIT-004；commit-02-b |
| PlatformCapabilityState | 03 §9.8.1/§5对应唯一enum，逐row/guard/trigger | 全matrix行与unlisted negative保留；无owner状态；后序trigger未实现不能pass | TC-STATE-049, TC-STATE-050, TC-STATE-051；EV-NATIVE-001；commit-08-a |

#### 5. Query response / view闭环表

| Query | 正式view/schema/字段与marker来源 | empty / hidden / partial / stale / unavailable | publicref/repo界限 | TC与boundary |
|---|---|---|---|---|
| ResolveEntryAccess | 03 §7.4.1完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-009, TC-PROTO-010；commit-02-a |
| LoadConversationSurface | 03 §7.4.2完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-011, TC-PROTO-012；commit-03-a |
| LoadTurnPage | 03 §7.4.3完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-013, TC-PROTO-014；commit-03-a |
| LoadOwnerSummary | 03 §7.4.4完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-015, TC-PROTO-016；commit-03-b |
| LoadArtifactPreview | 03 §7.4.5完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-017, TC-PROTO-018；commit-03-b |
| LoadIntentCapability | 03 §7.4.6完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-019, TC-PROTO-020；commit-04-a |
| ProbeCommandAttempt | 03 §7.4.7完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-021, TC-PROTO-022；commit-04-a |
| LoadResumeContext | 03 §7.4.8完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-023, TC-PROTO-024；commit-05-a |
| LoadLocalProjection | 03 §7.5.1完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-025, TC-PROTO-026；commit-02-b |
| LoadDraft | 03 §7.5.2完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-027, TC-PROTO-028；commit-04-a |
| ProbePlatformCapability | 03 §7.5.3完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-029, TC-PROTO-030；commit-08-a |
| LoadAccessibilityContext | 03 §7.5.4完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-031, TC-PROTO-032；commit-03-a |
| LoadProjectList | 03 §7.6.1完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-033, TC-PROTO-034；commit-06-a |
| LoadProjectDetail | 03 §7.6.2完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-035, TC-PROTO-036；commit-06-a |
| LoadProjectProcessFlow | 03 §7.6.3完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-037, TC-PROTO-038；commit-06-b |
| LoadStageProcessFlow | 03 §7.6.4完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-039, TC-PROTO-040；commit-06-b |
| LoadProcessNodeDetail | 03 §7.6.5完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-041, TC-PROTO-042；commit-06-b |
| LoadProjectConversationLinks | 03 §7.6.6完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-043, TC-PROTO-044；commit-06-c |
| LoadCompanyDirectory | 03 §7.6.7完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-045, TC-PROTO-046；commit-06-c |
| LoadMemberContext | 03 §7.6.8完整output→§5具名view/factory、§8同名flow/current source | formalpage/source access才empty/hidden；missingcontract依赖error；partial/stale各section/current；failLoad不伪success | qualifiedhandle/lineage不反解；localrepo仅localkey | TC-PROTO-047, TC-PROTO-048；commit-06-c |

#### 6. Phase / commit boundary闭环表

| Phase / boundary | 包含当前增量 | 排除后序 | 前置/不能依赖后序 | tests/验收/实际移交 |
|---|---|---|---|---|
| PH-01 / commit-01-a | 安全启动、配置与源码边界；exactscope与三类批次 | owner/SDK positive IO、业务路由/shell composition、native、报告实际run | baseline/授权；02-a只能type-only前置，06-c才完整composition | config, boundary；06/07逐gate关联，approved design commit/授权、精确Node/npm/UI/runner版本与来源；移交blocked |
| PH-01 / commit-01-b | 机器检查与index-shell工具；exactscope与三类批次 | full_ev detail、acceptance writer/签署、missing case补执行、CLI任意mode升级 | commit-01-a；02-a只能type-only前置，06-c才完整composition | 既有report/review；06/07逐gate关联，approved runner/JCS/crypto来源与版本；maturity批准；后序TC未实现；移交blocked |
| PH-02 / commit-02-a | qualified安全导航与当前消费隔离；exactscope与三类批次 | SDK export/private HTTP、后序项目行为、composition假constructor、durable | commit-01-b；02-a只能type-only前置，06-c才完整composition | navigation；06/07逐gate关联，formal Entry/visibility/current context能力缺口，positive binding不激活；移交blocked |
| PH-02 / commit-02-b | memory安全材料与清理；exactscope与三类批次 | durable/crypto driver、跨端草稿同步、change资格实现 | commit-02-a；02-a只能type-only前置，06-c才完整composition | continuity, persistence；06/07逐gate关联，safe locator/partition/retention合同与durable未闭合，当前只memory；移交blocked |
| PH-03 / commit-03-a | 对话Turn呈现与可访问交互；exactscope与三类批次 | send/governance positive提交、项目/目录行为、native/manual AT通过 | commit-02-b；02-a只能type-only前置，06-c才完整composition | presentation, process；06/07逐gate关联，formal Turn/分页来源；真实WebView/AT未批准；移交blocked |
| PH-03 / commit-03-b | GateCard、引用与owner摘要；exactscope与三类批次 | Gov dispatch/Decision写入、URL/body反解、Process topology/真实native open | commit-03-a；02-a只能type-only前置，06-c才完整composition | presentation；06/07逐gate关联，CHAT-UP-003/004/005/006、WS-UP；移交blocked |
| PH-04 / commit-04-a | 草稿、发送、结果与unknown探测；exactscope与三类批次 | 离线业务queue、自动retry、Gov positive binding、SDK digest/幂等truth实现 | commit-03-b；02-a只能type-only前置，06-c才完整composition | intent, presentation, persistence；06/07逐gate关联，CHAT-UP-001/002，正式association/result/probe窗口未确认；移交blocked |
| PH-04 / commit-04-b | 治理受控意图与反馈；exactscope与三类批次 | client Decision/审批success truth、GovernanceGate=BPMNGateway、SDK拒绝绕过 | commit-04-a；02-a只能type-only前置，06-c才完整composition | intent；06/07逐gate关联，CHAT-UP-003正式Governance action/receipt/result/capability；移交blocked |
| PH-05 / commit-05-a | source-local实时消费与resume；exactscope与三类批次 | 内部bus、opaque cursor排序、ACK=coverage、跨source统一fresh/auto submit | commit-04-b；02-a只能type-only前置，06-c才完整composition | continuity；06/07逐gate关联，CHAT-UP-002/005/008变化/coverage/resume合同；移交blocked |
| PH-05 / commit-05-b | 离线、重启、stale恢复与低敏支持；exactscope与三类批次 | 从memory恢复授权/confirmed、durablelocator伪提供、rawlogs/后台观测、自动handoffretry | commit-05-a；02-a只能type-only前置，06-c才完整composition | continuity, diagnostic；06/07逐gate关联，SDK locator/resume/probe、CHAT-UP-007、trustedlifecycle/retention；移交blocked |
| PH-06 / commit-06-a | 项目统一五tab与任务进度入口；exactscope与三类批次 | 顶层progress route、WorkItem推Process/Runtime、后序graph/relationship假成功 | commit-05-b；02-a只能type-only前置，06-c才完整composition | process；06/07逐gate关联，Work/Workspace safe项目与Process目标正式关联；移交blocked |
| PH-06 / commit-06-b | 整体、阶段、节点BPMN只读下钻；exactscope与三类批次 | 颜色/WorkItem/Tool日志推流程或汇聚、图编辑/发token、GovernanceGate当Gateway | commit-06-a；02-a只能type-only前置，06-c才完整composition | presentation, process；06/07逐gate关联，CHAT-UP-008与正式Process projection/关联/change/resume、viewer/布局库来源/格式/pin/AT资格；移交blocked |
| PH-06 / commit-06-c | 项目群聊、公司目录与完整装配；exactscope与三类批次 | client建binding、GlobalMember推全公司/ProjectMember/Participant、SDK positive IO | commit-06-b；02-a只能type-only前置，06-c才完整composition | directory；06/07逐gate关联，CHAT-UP-009关系owner/provider/权限，BASE001；移交blocked |
| PH-07 / commit-07-a | 正式SDK读取、提交与probe绑定；exactscope与三类批次 | 缺export shim、unknown cast、SDK源码/privateHTTP/bus、本地业务幂等store | commit-06-c；02-a只能type-only前置，06-c才完整composition | sdk-real；06/07逐gate关联，CHAT-UP-001/003/004/005/006/008/009、WS-UP、formal测试tenant/source/exactexports；移交blocked |
| PH-07 / commit-07-b | 正式变化、重连与跨端证明；exactscope与三类批次 | 内部bus、WSACK升级业务/coverage、未批准handoff/自动retry | commit-07-a；02-a只能type-only前置，06-c才完整composition | sdk-real；06/07逐gate关联，CHAT-UP-002/005/007/008、WS-UP变化/locator、两端环境；移交blocked |
| PH-08 / commit-08-a | 最小可信host与技术能力；exactscope与三类批次 | safe_storage/controlled_open执行variant、任意shell/file/network、业务SDK、Mobile | commit-07-b；02-a只能type-only前置，06-c才完整composition | host-unit；06/07逐gate关联，exactTauri/Rust/WebView/插件来源、nativeorigin/window/main权限批准；移交blocked |
| PH-08 / commit-08-b | 实际Desktop与手工AT；exactscope与三类批次 | preview/fake代native/manualAT、未批准OS称支持、写新业务逻辑 | commit-08-a；02-a只能type-only前置，06-c才完整composition | desktop-real, at-real；06/07逐gate关联，批准OS/AT/工具/签名source和actualoperator；移交blocked |
| PH-09 / commit-09-a | 全参数安全、错误与质量回归；exactscope与三类批次 | 跨boundary修全部src、篡改分母/阈值、missingreal改skip | commit-08-b；02-a只能type-only前置，06-c才完整composition | errors；06/07逐gate关联，CHAT-BASE-001、qualitybudget/source/version/requiredreal层与残余合同；移交blocked |
| PH-09 / commit-09-b | 完整machine到fullEV报告；exactscope与三类批次 | signoff/acceptancepass、crossrun拼证据、rawbody归档、未批准retention/ACL发布 | commit-09-a；02-a只能type-only前置，06-c才完整composition | report；06/07逐gate关联，actualrun/EV、BASE001、retention/ACL/source/release批准；移交blocked |
| PH-10 / commit-10-a | 验收私有DTO与初稿生成；exactscope与三类批次 | writer代签/接受风险、digest签署循环、publicownerDTO、自动acceptancepass | commit-09-b；02-a只能type-only前置，06-c才完整composition | 既有report/review；06/07逐gate关联，approvedfullEV/role/source/BASE001，实际review/signaturewaiting；移交blocked |
| PH-10 / commit-10-b | 实际审阅与受控交付记录；exactscope与三类批次 | 源码commit代actualacceptance、dirtybaseline称ready、未批准发布/P0关闭 | commit-10-a；02-a只能type-only前置，06-c才完整composition | 既有report/review；06/07逐gate关联，实际六角色签署/risk/release/source/归档；未闭合P0皆blocked；移交blocked |

#### 7. Public protocol传递类型闭环表

| surface | 外层/传递类型来源 | 缺失/duplicate/retry/phase | 依赖与检查 |
|---|---|---|---|
| 全43ClientRequest/Reply |03 §7.1通用，§7.3～10每个typedinput/reply；§5完整二级carrier/LocalPage/ReadSurface |版本/字段/authority严格拒绝；localno-op/currentCAS与commandunknown按原契约 |所有43行与86TC；无ownerwire或genericunknown |
| ref/session/current |sdk_capability_binding/route_context/client_consumption_context唯一 |qualifiedregistry/slot/source/parent/query；fieldmissingcurrenterror |02-a ownerpath前置，positive07、原readonly来源不私造 |
| result/probe/receipt |03 §5.4/7.3/7.4/7.7；ResultAuthority/PreparedCommand/FormalProbeResult |ACK不confirm；同terminalno-op、冲突拒绝、unknownprobeonly |04-a/b→07-a/bformal，两层proof分立 |
| change/resume/localjob |03 §5.5/5.6/7.7/7.9；LocalConsumerReceipt/Resume/Projection/DeleteResult |source去重与水位同CAS、gap重取、deletefailedrestricted |05local→07SDK；无内部bus/UoW |
| host/config/support |03 §5.8/5.9/5.11/7.5/7.8；04strictJSON |trustedorigin/window/kind、explicituser/mode/finiteoutput；disabled/blocked |Rustshapes只两个probe/三error，TSstatus唯一平台文件；未知插件无执行variant |
| evidence/acceptance |05 chat.test.v1完整schema+06 chat.acceptance.v1私有schema |maturity/ref/digest/分母/redaction/署名严检；missingactualref不补 |01-b/09-b/10-a；私有tools非Chatpublictypes |

#### 8. 命名一致性表

| 类型 | canonical | 禁止漂移 | 核对 |
|---|---|---|---|
| 产品/包 |quantalithos-chat/npm chat、chat-desktop/chat_desktop/binchat |L5/l5_代码前缀、公共ChatSDK/backend |03 §3/4、07 scope/skeleton |
| 主体 |ConversationSurfaceViewModel、SafeMaterialFactory、IntentFeedbackFactory、PreviewBoundary.isOpenable |ChatThread/ChatReplyState、FeedbackFactory/evaluate同义 |43协议/flow/state保留逐字 |
| 页面 |project_detail五tab/progress、company_directory |顶层独立projectprogress、身份摘要=完整目录 |本轮00～06未改；07 tasks/gate追溯 |
| 流程 |BPMN、Process fork/branch/join、GovernanceGate独立 |BPNM口语拼写、治理Gate=Gateway/流程truth |Processsourceblocked及viewer格式Spike |
| 版本/身份 |LocalVersion/rootentry、draftRevision、opaque ownercursor/source、querygeneration |到达time=顺序、localid=SDKkey、route=parseownerref |03/05/06/07同scope |
| 测试/证据 |216TC/16EV/142gate/10VETO/36actualAC |CUT当执行、原型/摘要=EV、未注册AC-NFR008～024 |完整集合静态核，BASE001open |
| script/root |三05CLI、artifacts/test/<run_id>/reports/runs/<run_id> |latest、再嵌project、reports目录放scripts |所有skeleton共用固定source |

#### 9. 冲突与修正表

| 项/位置 | 风险 | 本轮修正/当前结论 |
|---|---|---|
| partialComposition/后序roottypes |02-a compile缺字段或早造fakecoordinator |完整readonlytransitiveowner声明、06-c激活，§6/12/全部skeleton同步 |
| earlygate/wholeTC族 |前置切口当全族/完整PR/EV |§7 primary只首次切口，09-a全分母；early missingblocked，受保护合并不豁免 |
| PlatformCapabilityState路径 |03 §4概览未列§5明确唯一文件 |从已有03 §5.8提取exactownerpath到02-a/08-a，不重定义状态或改03 |
| 10-a验收redaction |sameCLI扩候选/archive漏scope |Step6/7把check_redaction与redaction_policy最小路径加入10-a，之后重新核 |
| viewer/布局依赖 |未批准库/格式/AT让实现自选或私造XML |SP003补source/license/pin/inputmapping；Step6/12与06-b skeleton同步最小package/lock、source/格式/pin/AT blocker；未批blocked |
| acceptance增参数/旧EV |旧manifest/EV报告被10-a篡改覆盖 |09-b fullEV后10-a新的现有TC参数/newrun/review；06.ExpectedInstance≠actualref/E018无cycle |
| CHAT-BASE-001 |旧00未注册AC索引 |保持open，不改00/伪关；只36actualAC，获授权需求原位修后重审 |
| SDK/Process/provider/native/版本/quality/ACL |规划结束被误称implementationready |全positive合同/环境/批准仍blocked，所有actualledger无pass |
| skeleton协议/状态索引格式 | 对象数组直接join导致名称无法阅读 | 12份骨架原位投影正式name，43协议/17主体保持原身份；最终静态检查拒绝object占位 |

#### 10. 正反例

| 场景 | 正确执行 | 错误执行 |
|---|---|---|
| boundary载体 |02-a同ownerpath完整readonly/initial，current操作定向typed测试；后序方法reserved |用any/fake空对象满足完整Composition/丢root字段 |
| SDK/Gate |formalprepare关联→一次CASdispatch→正式result/probe；ACK仍pending/unknown |点审批/HTTP2xx/WebSocket或AG-UI ACK立即confirmed |
| BPMN |Processqualified拓扑，safegraph/list同nodes/edges，父版变清child；并行branch/joinsource |把阶段画串行列表/从完成工单推join/治理Gate当gateway |
| 项目与群聊 |同project五tab；一群≤一项目、多群不同Participant；relation和targetaccess各验 |route/cursor/ref猜项目绑定；目录visible就可DM或全员统计 |
| 局部门禁 |当前variant真实断言，fullsuite缺future行blocked；新manifest/newrun不覆盖 |删未实现variant/参数、targeted通过冒全PR/16EV |
| evidence |same-run schema/JCS双digest/materialize/两redaction→fullEV→实际review/E018→同inputdigest签署 |无run造EV、截图=验收、签署循环或递归删nestedDigest |
| plannedledger |唯一currentblocked/waitdesign、未来planned/waitcurrent、gateblocked无hash，approvedbaselinewaiting |观察dirtyHEAD当approved、skeleton=Handoffpassed/可开工 |
| commit/用户diff |已有提交授权+scope/checks/message实际证据后单boundarystage |全仓add/reset/跨boundary/amend他人或本轮未授权commit |

#### 逐boundary formal03/05/06/07设计停审

详见Step12§12.3与Step6逐55项：21项均reviewed_design_with_blockers；无未登记schema/phase规划冲突被交给实施者猜测。设计规则闭口不等externalcontract或实际开工：CHAT-UP九项/WS-UP八项/BASE/source/native/版本/预算/ACL/role/授权baseline全部保留；设计者只完成当前文档/计划检查，actualgate不能pass。

#### 书写规范与台账规范评审清单

下列结论仅裁决设计文件/规则完整性，真实implementation/checks/evidence/acceptance均未发生。

| 检查项 | 设计静态依据 | 设计结果 |
|---|---|---|
| 上游正式引用 | 07 §1/13；00～06指纹未变，十个上游80指纹一致 | 通过（仅设计规则） |
| 前置阅读、语言、提交规范 | 07 §3.1/3.4/13；TS/JS/HTML与host Rust分域 | 通过（仅设计规则） |
| 阶段校准阅读矩阵 | 07 §3.2；21skeleton各phase读取来源与exact章节 | 通过（仅设计规则） |
| 启动与永久记忆种子及门禁 | 07 §3.3；11稳定MEM、十一字段、生成/刷新/失效/冲突/禁止项，当前不生成记忆 | 通过（仅设计规则） |
| 记忆规范路径来自当前栈 | 07 §3.1/3.3；不默认全仓Rust，targethost单独读 | 通过（仅设计规则） |
| 项目级git user检查 | 07 §3.4；项目级name/email未来确认，不运行global配置 | 通过（仅设计规则） |
| 可验证功能增量phase | 07 §5/6；10phase/21boundary按可独立review功能 | 通过（仅设计规则） |
| 每阶段输入/输出/依赖/门禁/提交 | 07 §5/6/7；无后序runtime依赖，当前移交仍blocked | 通过（仅设计规则） |
| 阶段内编写顺序 | 07 §6每phase IMPL顺序表；type-only owner预声明与06-c composition停点 | 通过（仅设计规则） |
| 批次六字段完整 | 07 §6；63组含目标/输入输出/规模/检查/提交关系，后续拆子批规则 | 通过（仅设计规则） |
| 开工前字段/DTO/状态/phase审计 | 07 §3/6/12；Step6每boundary全部55项、Step13十表 | 通过（仅设计规则） |
| 大批次与高风险拆分 | 07 §6.1；超300拆100～200行子批、超500必拆，高风险独立 | 通过（仅设计规则） |
| 每boundary提交时机 | 07 §6/11；实际七gate+Worktree、staged/message与已有授权才提交 | 通过（仅设计规则） |
| 嵌入TC/验收门禁 | 07 §7；216TC/16EV/142P0gate/10VETO与36actualAC，primary≠全variant | 通过（仅设计规则） |
| 配置/环境/外部准备 | 07 §8；六profiles/八域十四字段，版本/source/native资格与safe失败 | 通过（仅设计规则） |
| Spike/风险/待确认截止 | 07 §9；9spike及phase/能力截止，当前未执行实验 | 通过（仅设计规则） |
| 暂停/回退/变更控制 | 07 §10；unknown保留、用户diff保护、设计源变更回owner校准 | 通过（仅设计规则） |
| 可审查完成判定/证据 | 07 §12；计划/boundary/验收/发布四事实等级，actual仍waiting | 通过（仅设计规则） |
| 每章来源与延伸阅读 | 13章逐Step正文一一一致，所有相对文件链接有效 | 通过（仅设计规则） |
| 不复制详细实现契约 | 07只保留phase/scope/source/check/gate规则，完整DTO/enum/schema以03/05/06为单一来源 | 通过（仅设计规则） |
| 项目台账/全部planned骨架 | implementation ledger+21完整skeleton；唯一current01-a blocked，未来planned/wait_until_current | 通过（仅设计规则） |
| 真实门禁/证据/授权分域 | 全部21×9实际gate blocked，189evidence waiting，无实现/commit/run/EV/签署/readiness | 通过（仅设计规则） |

#### 正式装配/台账静态审计记录

2026-10-02，当前agent串行完成以下实际**静态文档**审计；无应用运行或实际测试证据。

| 检查 | 本轮静态结果 | 证据/事实边界 |
|---|---|---|
| 正文/来源 | 13主章标题顺序、各Step §7正文逐章一致；过程十表未入正式正文 | 相对link归一化逐字比较；无新增未校准需求/DTO |
| 阶段/边界/批次 | 10phase、21exactboundary、63计划批次顺序闭合；完整Composition06-c、rootreadonly前置/唯一ownerpath闭合 | 仅任务/依赖/文件scope/检查计划，无实现 |
| 集合/追溯 | 43协议/43flow、17主体/12canonicalenum、216TC、16suite/EV、142P0gate+10VETO、36actualAC保持原集合；关联无悬空 | 03/05/06/00直接核对；BASE001仍open，P0不可risk豁免 |
| 经验/逐项审查 | 21×55=1155分类；562closed_design_only、554not_applicable、39blocked_external；原标准全部项目逐项适用性核验 | 不把closed_design_only当真实gate；未发现超出现有55类别需新增经验，standards未改 |
| 全量台账 | implementation项目台账和21planned skeleton存在且非空；exactfiles/内容/requiredreads/checks/title与07一致 | current唯一01-a blocked/wait_design；未来20planned/wait_until_current |
| 实施门禁/实际记录 | 21×9=189行activation/七gate/Worktree均blocked，evidencewaiting；actualcommit/message/status/build/run/EV/signoff均waiting | 没有fakehash或approvedbaseline；观察HEAD与byteshash分离 |
| 机器/报告/验收 | 三CLI/maturity/root/proof分层、manifest完整分母、newrun/E018/sixsignature规则来源一致；验收redaction范围已补齐 | 这里只校验设计规则，目标仓/runner/report尚不存在，不运行CLI |
| 文档结构/字符/引用 | 本轮38文件的围栏、表格列、相对文件链接、cursor、对象placeholder/乱码与尾随空白检查通过 | inline Node只读取设计文件；不是application test或EV |
| 来源稳定 | 本项目00～06七指纹不变；十个专项owner80指纹不变；正式07byteshash在implementationledger，formal无自hash环 | 只静态来源指纹，不是批准commit/actualbuild |
| diff与scope | 本轮07/校准scope的git diff --check通过；完整L5-chat diff仍报告前序00/01八行Markdown硬换行尾随空格 | 保留已停审00/01；直接补检untracked文档无尾随空白；其他项目/SDK/原型未修改 |

本轮38份为正式07、07flow、13独立Step、设计项目台账、implementation项目台账及21boundary skeleton。全部手工patch不超过180行，serial小循环后静态复核；没有创建实现仓/source/lock/agent记忆、安装、build/run/应用test、实际artifact/report/EV、验收/接受风险/签署、readiness或commit。

正式07 design_complete / formal_stop_review；当前Step13 done、flow/设计台账同步停审。真实实施仍not_started / blocked，approved含00～07 designcommit与实施授权waiting。下一动作仅等待用户审阅；后续获明确实施授权再读实施台账→唯一current boundary→正式07 §3/6/7/9～12及当前SDK/工具/平台/source批准来源，不自动跨入实现。


## 8. 回填草稿

正式07 §13仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

待13章按来源装配、21plannedboundary/项目ledger创建、集合/路径/facts/Markdown/七源指纹/gitdiff静态核验后完成；不执行应用测试。 本步只作设计/文档静态检查，不是应用测试或readiness。正式装配与全部planned实施台账骨架静态核对后立即停审，不进入实现、不提交commit。
