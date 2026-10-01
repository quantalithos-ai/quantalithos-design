# L5-chat 03 · Step 17 实施承接与跨文档预审

## 1. Step 状态

> done；pass_with_upstream_blockers；2026-10-01。SOP Step17/书写规范5.16/中间产物规范5.10。
> 回填正式03 §16；本步不是正式实现移交，不划phase/commit boundary，不创建implementation ledger/skeleton。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 17-A | 承接清单与前置阅读 | done |
| 17-B | 真相源/字段/构造/query/传递类型/状态 | done |
| 17-C | phase boundary预审、命名与修正、正反例 | done |

复杂度：十类闭环表分开，字段/协议全量详情回Step6/8/9，避免重定义；无另建truth或实现计划。状态/协议清单须逐项可回指。

## 2. 本步输入

当前正式00/01/02、校准Step1～16、详细设计规范、实施计划书写规范、代码实施台账与门禁规范、中间产物5.10及可落码性标准§九；项目README §3.3/8.2、TS/Rust语言和注释规范；Governance Step17承接/阅读/十表预复核颗粒度。所有正式04～07未来设计尚需授权，旧05/06不作为当前实现基线。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些可承接 | 十模块+native、typed对象/ports、43协议/flow、17主体、CAS/错误/去重/配置/低敏诊断/测试切口；正向SDK/host/provider仍blocked。 |
| 2. 实施前读什么 | §7.2明确规范与本项目00～07、calibration来源和实际SDK正式合同；04～07未完成不能开工。 |
| 3. 提交/git/语言/注释 | 列入阅读；将来核对项目级quantalithos-labs/quantalithos.ai@gmail.com，不能本轮设置身份；实现英文标识符/注释/test/commit。 |
| 4. 必填字段来源 | §7.3～7.4与Step6独立卡/Step8全字段映射逐族闭环，local id/当前store版/正式SDK材料分立。 |
| 5. Command/Event/Job构造 | typedInput→namedfactory→ports→currentCAS；缺contract/字段拒绝，不能以fake补生产input。 |
| 6. Query view/page/marker | §7.6全20Query独立response；opaque refs、localpage/helper、source/currentlineage在Step6～8唯一归属。 |
| 7. 状态是否统一 | §7.7十二enum/17主体承接Step10/16；05/06/07须使用此词表，不继承旧口语状态。 |
| 8. 是否依赖未来phase | 本步不造phase；§7.8区分local设计与正式SDK/host/证据前置，07必须逐boundary审计。 |
| 9. 哪些旧名/漂移 | 历史ChatThread/ChatReplyState等不进入当前truth；LocalStoragePort为概要责任名，正式接口LocalProjectionRepository；错误新增dependency_unavailable已同步。 |
| 10. 不能实施项 | SDK正向、Processprojection、关系/目录provider、durable/native、生产config/quality、04～07与真实证据。 |
| 11. 07如何引用 | 引正式03具体模块/schema/flow/state/consistency/test切口与calibration，不复制第二truth，不让实现者猜接口。 |
| 12. 07审计输入足够否 | 本地设计输入齐，外部依赖仍blocked；正式03装配后给07输入，07须对正式03/05/06/07逐phase/commit boundary再审；本步无Handoff Gate pass。 |

## 4. 当前文档问题诊断

| 位置 | 问题 | 本步处理 |
|---|---|---|
| 大量前序Step | 恢复时易只读摘要 | formal优先、calibration解释的阅读链 |
| 上游blocked | 容易把localpass当可实施 | §7.8明确所有实施仍not_started |
| 概要主语/旧正式03 | 名称可能形成别名truth | §7.9唯一名称索引和禁止旧名 |
| 后续05/06/07 | 尚无本轮正式TC/EV/boundary | 只映射CUT与真实AC，不自造证据/排期 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| handoff | 各Step详但入口分散 | 各类正式§位置与必要阅读 | 实施先读truth |
| 跨文档复核 | 可能只有“已遵循标准” | 十种闭环及pass/blocker分别记录 | 可定位缺口 |
| 正式设计完成 | 易被当实现ready | conditional local设计完成/外部blocked/07待审 | 不能伪通过 |
| naming | 概要与旧术语并存 | 当前exactname/factory/port唯一 | 无自行选边 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| formal03 + calibration入口、下游再审 | 单一基线、可追溯 | 仍需04～07 | 采用 |
| Step17提前制定phase和交付ready | 看似进度快 | 05/06/07未闭合、未有证据 | 不采用 |
| 外部SDK契约留给实现者猜 | 能开工 | 错权/重复effect/假成功 | 不采用 |

## 7. 结构化中间产物

### 7.1 实施承接清单

| 承接项 | 正式03装配位置/来源 | 使用方式 |
|---|---|---|
| 输入/范围/语言/布局 | §1～4，Step1～4 | 当前Desktop-first单TS app+Taurihost，planned路径 |
| 模块/对象/props/工厂/状态 | §5，Step5/6 | 每模块代码主体与每字段来源，不以旧truth替代 |
| typedport/adapter/索引 | §5/6，Step7 | 消费者定义port，composition注入；正向binding条件 |
| 43协议/43flow | §7/8，Step8/9 | typedenvelope、全字段、独立调用图/伪代码/副作用 |
| 17状态主体/12enum | §9，Step10 | 精确矩阵/非法，不新增owner状态 |
| local一致性 | §10，Step11 | 同turn root/repo CAS，source独立、hide先stop/delete |
| 15错误/恢复/并发幂等 | §11/12，Step12/13 | effectunknown只probe，local与SDK业务幂等分立 |
| config/依赖/诊断 | §13/14，Step14/15 | 14字段绑定、默认disabled、外部合同blocked |
| 测试切口与证据 | §15，Step16 | CUT-P01～43/S01～17、并发安全、planned脚本；05/06细化 |
| 风险/移交前复核 | §16/17，Step17/18 | 未通过内容先回设计，不启动实现 |
| formal装配/评审 | Step19 | 18章正文与来源，停在03 |

### 7.2 实施前置阅读

| 材料 | 阅读目的/门禁 |
|---|---|
| 本项目正式00/01/02/装配后03 | owner/需求/架构/模块与exactcontracts；旧README仅historical |
| 未来当前正式04/05/06/07 | config数值/用例与证据/boundary；未完成不得开工 |
| project_execution_ledger/03flow/具体Step | 恢复点、缺口、设计来源；冲突formal优先并回写calibration |
| 全局依赖规则/通则/中间产物/真相源闭环标准 | SDK-only/Layer5窗口、局部小循环、字段/状态/metadata/projection/evidence审计 |
| standards/coding/typescript.md | TS lowerCamelCase/类型/strict错误；实现英文注释，不直接复制设计中文JSDoc |
| standards/coding/rust.md | 仅src-tauri nativehost；English rustdoc/variant，typedResult/leastauthority |
| standards/document/子项目目录与代码文件组织规范.md | planned文件/module/package/bin、mixed工程分域 |
| projects/README.md §3.3/8.2 | 项目git身份与提交语言/标题body/footer；本轮无设置/commit |
| 实施计划书写规范/代码实施台账与门禁规范 | 07逐boundary审计、allowedscope/checks/CommitGate/HandoffGate、plannedledger |
| 当前SDK及列明owner正式00～07/必要台账 | 具体consume能力、新鲜度、权限、receipt/result、cursor/resume、provider与safe ref |
| 原型停审/信息架构/恢复与可访问性记录 | 五tab/BPMN层级与interaction体验；demo不是业务合同或证据 |

### 7.3 真相源表

| 设计事实 | 真相源 | 后续消费者 | 冲突处理 |
|---|---|---|---|
| 功能/AC/owner边界 | 当前正式00/01/02 | 03～07 | 不在详细设计改需求；BASE001显式open |
| local字段/类型/函数 | 装配正式03 §5/6；Step6/7 | 05/06/07 | 单一定义、无临时schema |
| local协议/flow | §7/8；Step8/9 | 同上 | 原request字段和current资格，失败停流程 |
| 状态与非法处理 | §5/9/11；Step6/10/12 | tests/acceptance | 12enum/17主体精确命名 |
| 业务authority/幂等/cursor | SDK与各owner正式合同 | binding/integration | 当前blocked不能fake补齐 |
| BPMN/token/gateway/join | Process正式source | 图/list/node/AT | Work/Governance不替代Process |
| 项目↔群聊/公司目录 | 正式provider待确认 | links/directory | unknownowner blocked，不在client建立truth |
| 实施phase/commit/test/EV | 未来正式05/06/07 | 实施台账/运行证据 | 本步不生成；07必须整体再审 |

### 7.4 字段闭环表

此表列关键条件字段；所有carrier的全字段继续回Step6独立卡、Step8逐接口全字段，不用本表缩减schema。

| 对象/字段 | 类型/来源 | 构造入口/输入 | 缺失处理 | 测试/验收映射 |
|---|---|---|---|---|
| RouteContext actor/scope/context | 正式ExternalHandle，context项目/目录可null | QualifiedEntryResolution→RouteFactory/guard | authority_missing；不造Conversation | CUT-P05；真实00入口AC |
| ClientConsumptionContext source/target/generation/parent/query | qualifiedsource/当前注册slot及本地代次 | ConsumptionContextFactory/ConsumptionRequest | context_changed；不改incoming | CUT-CAS/ROOT；AC-NFR001～007 |
| DraftState draftRef/revision/text/reply/attachments | localidentity/用户safeinput/正式safe refs | DraftFactory；ConversationIntentInput | invalid/blocked，正文只内存 | CUT-P01/14；AC-FR005～006 |
| CommandAttempt association/Gate/action/result | SDKpreparedassociation/GovernanceInput/formalresult | AttemptFactory.fromDraft/fromGovernance/reserveDispatch/applyResult | 无association不dispatch；无authority不terminal | CUT-P01/02/26；真实intentAC |
| page VM/material/provenance/freshness | 正式source+visibility+opaqueversion | 每namedfactory/mapper→currentCAS | partial/stale/blocked；无rawbody | CUT-P06～24；AC-FR011～014 |
| ProjectNavigationState project/stage/node/parent | 同safegraph正式refs/parent版 | current模型选择 | oldparent/hidden拒绝 | CUT-P42；AC-FR011/013 |
| root/patch expected/checks | read返回LocalVersion+原slot/incoming | ClientStatePort.compareAndSet | 无检查/错版零部分patch | CUT-ROOT/CAS |
| LocalProjection key/partition/locator/localVersion | LocalIdentityPort/SDKsafealias+locator/repo版 | projectionfactory/repositorysave | 无serializerblocked；无durable | CUT-P13/38～40 |
| DiagnosticContext全部六字段 | 本地id/currentepoch/finitecategory/reason/explicituser/platform | factory→DiagnosticPort | extra字段拒绝，disabled零IO | CUT-DIAGNOSTIC；AC-NFR001～007 |
| host request origin/window/kind | trustedboundedhost | HostBoundaryGuard | 无正式hostproof不放行 | CUT-DESKTOP |

### 7.5 DTO/Event/Job构造闭环

| 输入族 | 目标对象 | 来源/必填闭环 | 不得混同 | 缺失处理/flow |
|---|---|---|---|---|
| 两Submit | Draft/Attempt/FrozenPayload/PreparedCommand/Feedback | Step8完整Input→Step6工厂；SDKprepare无effect/association | draftRevision≠root版≠SDKkey；receipt≠result | guard拒绝；同名Step9 |
| query20项 | Route/surface/page/material/host/AT/localview | typedinput→Step7port→qualifiedprojection→namedfactory | owneropaqueversion≠localversion；queryempty≠missing | localguard或safe failure；逐同名flow |
| consumer7项 | localchange/result/resume/visibility/lifecycle/cleanup | formalQualification或trustedhost→pure state→currentCAS | LocalConsumerReceipt≠SDKACK≠businessconfirm | ignored/blocked/restricted/needs_requery |
| diagnostic2项/Emit | DiagnosticContext/HandoffView | 显式用户六字段，mode与正式sink资格 | accepted≠evidence；requestId≠业务key | disabled/blocked/unknown |
| 其他maintenanceJobs | Resume/Recovery/Projection/CacheLifecycle | typedinput/currentread/repo版本/formalcoverage | localjob≠ownerRun/修复 | error/partial-safe/noeffect |
| navigation/search | ProjectNavigation/DirectorySearch/ConsumptionContext | 当前safe模型及root版/新query代次 | localselection≠bindingtruth | invalid/context_changed；两个同名flow |

### 7.6 全20Query response/page/marker闭环

字段级schema归Step6/8原卡；refs只正式registry或localtypedid，不能反解。local读/AT/host只校验各自协议所需current资格，不强制伪造owner source。SafeReadSurface允许的empty/missing必须来自可披露正式source，unavailable不推不存在。

| Query | value类型 | 字段/source闭环 | negative/identity规则 | 切口 |
|---|---|---|---|---|
| ResolveEntryAccess | RouteContext | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-05 |
| LoadConversationSurface | ConversationPageViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-06 |
| LoadTurnPage | ConversationSurfaceViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-07 |
| LoadOwnerSummary | SafeMaterialSnapshot | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-08 |
| LoadArtifactPreview | PreviewResultView | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-09 |
| LoadIntentCapability | IntentCapabilityView | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-10 |
| ProbeCommandAttempt | IntentFeedbackViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-11 |
| LoadResumeContext | ResumeContext | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-12 |
| LoadLocalProjection | LocalProjectionEntry \| null | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-13 |
| LoadDraft | DraftState \| null | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-14 |
| ProbePlatformCapability | PlatformCapabilityState | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-15 |
| LoadAccessibilityContext | AccessibilityState | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-16 |
| LoadProjectList | LocalPage<SafeMaterialSnapshot> | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-17 |
| LoadProjectDetail | ProjectDetailViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-18 |
| LoadProjectProcessFlow | ProcessFlowViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-19 |
| LoadStageProcessFlow | ProcessFlowViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-20 |
| LoadProcessNodeDetail | ProcessNodeDetailViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-21 |
| LoadProjectConversationLinks | ProjectConversationLinkViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-22 |
| LoadCompanyDirectory | CompanyDirectoryViewModel | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-23 |
| LoadMemberContext | readonly SafeMaterialSnapshot[] | Step8同名全字段→Step6独立factory→Step7port | current slot/actor/source/visibility/lineage匹配；hidden清引用，empty只正式授权 | CUT-P-24 |

### 7.7 状态闭环

| enum | 唯一正式状态值 | 产生/合法/禁止依据 | planned切口 |
|---|---|---|---|
| RoutePhase | unresolved/resolved/restricted/expired/cleared | RouteFactory；Step10 §4.1 | S01 |
| AccessAvailability | available/read_only/restricted/unavailable/blocked/hidden | AccessPostureFactory/正式资格；§4.2 | S02 |
| ConsumptionContextPosture | active/invalidated/cleared | contextfactory；§4.3 | S03 |
| SelectionPhase | empty/selected/stale/cleared | selection/projectnavigationfactory；§5.1/5.2 | S04/05 |
| PageLoadPosture | loading/ready/partial/stale/blocked/unavailable | 五page namedfactory/failLoad；§5.3～5.7 | S06～10 |
| DraftPhase | empty/editing/locally_valid/invalid/submitting/restored/cleared | DraftFactory；§6.1 | S11 |
| CommandResultPosture | draft/submitted/pending/confirmed/rejected/failed/unknown | AttemptFactory+CommandResultGate；§6.2 | S12 |
| FreshnessState | fresh/stale/partial/unknown/expired | Formalmarkerfactory；§7.1 | S13 |
| DisclosurePosture | visible/redacted/restricted/unavailable/cleared | SafeMaterialFactory；§7.2 | S14 |
| ContinuityPhase | fresh/stale/gap/reconnecting/resuming/restricted/blocked/needs_action | ContinuityFactory；§7.3 | S15 |
| LocalProjectionState | absent/cached/restored/stale/restricted/evicting/cleared | Projectionfactory/repo delete；§7.4 | S16 |
| CapabilityAvailability | available/restricted/unavailable/needs_action/unknown | 每hostcapability正式probe；§8.1 | S17 |

全部正式05/06/07沿用上述值；optimistic只是feedback布尔派生，不新增状态。非法迁移错误回Step12，验收EV由未来06定义，不在本表补造。

### 7.8 Phase/commit boundary预审与传递类型

| 范围（非phase定义） | 包含/前置 | 排除与不得依赖后续 | 测试/验收责任 |
|---|---|---|---|
| localpure/store/UI合同 | §5～12完整字段/方法/矩阵；未来07先审 | 不依赖真实SDK/host成功，fixture不宣称productionbinding | CUT-P/S与本地安全；05/06待展开 |
| 正式SDK/owner集成 | 对应CHAT-UP正式合同逐项关闭 | 不能消费未停审兄弟/伪export/未有source | integration实测future，不fake代替 |
| native/safe存储 | host权限/版本/cleanup/locator全部资格 | memoryOnly当前true，durable/mobile不偷偷启用 | Desktop/存储gate未来 |
| evidence/report/acceptance | 正式05/06与真实run，07明确成熟度 | index壳不当最终EV/验收；safe摘要非report | 路径scripts契约；当前无证据 |
| 正式移交实现 | 04～07完成，07逐boundary审计正式03/05/06/07 | 本步不创建implementationledger/skeleton/readiness | 全部not_started/waiting |

| surface | 传递类型归属 | 缺失/duplicate/retry | dependency边界 |
|---|---|---|---|
| ClientRequest/Reply | app local envelope/typedInput；Step8 §3 | strict版本/业务session；失败无fake successreply | 不serialize handles/SDKprivateDTO |
| 20Query view/page | Step6各module；LocalPage/LocalPageInfo/LocalPageRequest与lineage helper | empty/hide/stale各有来源；ref与repo key不互cast | Step7typed port只qualified安全return |
| commandresult/receipt/probe | intentscarrier/ResultAuthority；Step6 §17 | sameformalresult no-op；unknownprobeonly | ordinaryACK无resultauthority |
| consumerpayload/receipt | continuitycarrier/LocalConsumerReceipt；Step6 §18/Step8 §3 | qualifiedsource重复/noeffect/needs_requery | SDK qualification负责顺序/coverage |
| localmaintenance/cleanup | local_statecarrier/repo DeleteResult；Step6 §8/18 | versionedCAS/deletefailure restricted | 无ownerUoW/outbox/durable假成功 |
| host/config/diagnostic | platform/config/sdkcarrier；Step6 §19 | strictscope/extra字段拒绝、disabled零IO | unknown只configparser，不业务DTO |

### 7.9 命名一致性、冲突与修正

| 名称类别 | canonical | 禁止漂移/说明 |
|---|---|---|
| owner对象 | Conversation/Turn/Participant、Project/WorkItem、ProcessInstance/Activity/Token/Gateway、Gate/Decision等正式owner | 不在Chat造ChatThread或ApprovalSuccess truth |
| surface/工厂 | ConversationSurfaceViewModel；SafeMaterialFactory；IntentFeedbackFactory | 禁旧ChatReplyState或另套FeedbackFactory |
| preview | PreviewBoundary.isOpenable | evaluate不是有效成员 |
| repository | LocalProjectionRepository/DraftPort/ClientStatePort | 概要LocalStoragePort仅责任描述，不再加第二接口 |
| 结果姿态 | CommandResultPosture | 不以sent/done/success替换confirmed/unknown |
| 项目进度 | project_detail.progress tab | 不造顶层progress route |
| 流程 | BPMN Processfork/branch/join；Governance Gate独立 | 不将BPNM拼写或Gate当gateway，原型非source |
| SDK方法 | Step7consumer-ownedport方法 | localoperation不等SDKpublicexport |
| 错误 | dependency_unavailable | 与dependency_unbound/platform_unavailable/storage_unavailable分立 |
| 用例/证据 | CUT只是03切口；TC/EV待05/06 | 不冒充testresult或acceptance |

| 冲突ID | 位置/影响 | 修正/状态 |
|---|---|---|
| CHAT-DDD-006-CARRIER-001 | carrier/字段构造 | 前轮原位补齐closed_design，外部binding不随之closed |
| CHAT-DDD-012-ERROR-001 | SDK已绑定read失效无独立code | Step6/9/12同步dependency_unavailable，closed_design |
| CHAT-DDD-016-SCRIPT-001 | planned测试交付脚本缺职责 | Step4/16补planned合同，closed_design；未实现 |
| CHAT-BASE-001 | 00 §16未定义AC-NFR008～024 | open；不改00，不把这些号作正式证据 |
| CHAT-UP/WS-UP/host/storage/config/quality | 外部/后续合同 | open/blocked，进入Step18，不转交实现者猜测 |

### 7.10 正反例

正确：当前safe节点→typedProcessNodeReadInput→SDK正式projection→原slot/parent/source资格→NodeFactory→CAS→节点detail；缺合同显示blocked。正式结果与草稿新revision独立。
错误：从日志/WorkItem数量画Process图；从目录条目创建DM；从ACK将GateCard置approved；缓存confirmed重启自动重发；以原型截图或safe test摘要宣称验收。

## 8. 回填草稿

正式03 §16采用§7完整承接/阅读/十类预复核；正式§1～15分别保留原契约细节，不由本章复述替代。07将来必须基于正式03/05/06/07逐boundary再审，包括字段级carrier/refkind/scope/page/material/selector/metadata/idempotency/projection/evidence/phase经验项。

## 9. 待确认事项

Step18集中记录CHAT-UP/WS-UP、BASE001、host/storage/config/quality与正式04～07；本地设计闭环不等实际SDK可编译、宿主可用、真实验收或Handoff Gate通过。未确认内容不实施。

## 10. 进入下一步条件

承接与阅读、十类闭环、命名/已修问题和blocked范围已可审查；43协议/flow及20Query引用保持唯一，17主体词表一致。本地门禁通过，进入Step18风险；不创建实现台账。
