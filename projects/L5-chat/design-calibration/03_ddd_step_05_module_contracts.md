# L5-chat 03 · Step 5 模块实现契约

> 状态：done；gate_status：pass_with_upstream_blockers；日期：2026-10-01重审。
> 前置：当前Step4重审通过；2026-10-01新授权Step5～10，参考Governance框架后原位复核，按序推进。
> 来源：正式01依赖方向、正式02 §4～§12、Step3/4；参考Governance Step5的模块责任、依赖、归属和停审结构。
> 所有实现路径、能力和测试切口均planned；本文不证明SDK可用或产品实现。

## 1. Step内计划与问题回答

| 批次 | 可审查产物 | 状态 | 门禁 |
|---|---|---|---|
| 模块主轴 | §2～§3 | done | 七个概要部分和三个支撑模块有唯一责任 |
| 模块小循环 | §4～§14 | done | 每模块暴露、依赖、归属、禁止事项明确 |
| 整体审计与回填 | §15～§17 | done | 无反向依赖、owner写入、组件业务IO |

| SOP问题 | 回答 |
|---|---|
| 拆成哪些实现模块 | app/navigation/collaboration/intents/continuity/materials/local_state/sdk/platform/config；另有单一native_host实现单元。 |
| 与概要关系 | navigation等七个功能模块对应七个概要部分；app/sdk/config为支撑，native_host实现platform的最小宿主边界。 |
| 暴露内容 | 不可变local模型、纯策略、coordinator、typed port与React props；不发布公共domain包。 |
| 依赖规则 | 数据模型和port定义在消费者责任模块；实现adapter由app注入，核心不import adapter实现。 |
| 对象归属 | §4～§14逐模块固定；同一对象只在一处定义。 |

## 2. 判断与取舍

采用Step4既定功能目录，避免额外crate/package改变已经校准的单app布局。Governance的后端UoW/outbox/worker组织不适用于Chat；参考其审查细度，不继承其领域职责。

纯对象文件不得import React、SDK client实例、Tauri或storage driver。coordinator依赖typed ports，UI只持snapshot/callback。TS接口可type-only互引；运行期依赖必须为下图有向无环结构。状态恢复、配置与host缺能力均有明确受限分支。

## 3. 模块总览与依赖图

| 模块 | 实现单元 | 主要职责 | 暴露内容 | 允许运行期依赖 |
|---|---|---|---|---|
| app | chat | 启动、装配、页面注册/绑定 | ApplicationComposition、ClientApplicationShell、PageRegistry | 所有模块的公开入口，仅装配处可用sdk/platform实现 |
| navigation | chat | route/context与入口守卫 | RouteContext、AccessPosture、guards、coordinator | local_state/materials纯模型 |
| collaboration | chat | 对话、项目五标签、整体/阶段/节点、关联群聊及公司目录展示 | view models、三个新增coordinator、只读renderer、UI props | navigation/materials/local_state纯模型；intents/continuity/platform仅类型与回调 |
| intents | chat | 草稿、一次意图尝试、结果门控 | DraftState、CommandAttemptState、gate、coordinators | navigation/materials/local_state |
| continuity | chat | formal change消费、缺口、恢复、unknown探测编排 | ContinuityState、ResumeContext、reducer、coordinators | navigation/materials/local_state/intents |
| materials | chat | owner-safe材料、来源、freshness、preview资格 | snapshot/ref/marker、纯composer/policies | 无运行期业务模块依赖 |
| local_state | chat | immutable store、draft、投影repository、安全清理 | store/repository ports、安全guard、memory adapter | materials纯策略；其余状态类型仅type-only |
| sdk | chat | 正式SDK能力校验与客户端ports实现 | capability binding、query/command/change/ref/handoff adapters | @quantalithos/sdk正式exports；消费者类型type-only；materials纯映射 |
| platform | chat | 宿主最小能力、生命周期、AT语义 | platform ports、Desktop/Web-preview adapters、AT adapter | navigation/local_state/materials纯模型；Tauri仅Desktop adapter |
| config | chat | 限定配置加载/验证 | ClientConfig、ConfigLoader | 无业务模块实例依赖 |
| native_host | chat-desktop | Tauri启动与有限IPC | platform.rs宿主capability dispatch | Tauri2；不import业务SDK或owner仓 |

```text
app -> navigation, collaboration, intents, continuity, materials, local_state
app -> sdk, platform, config                      [composition only]
continuity -> intents -> navigation -> materials
continuity -> navigation, materials, local_state
collaboration -> navigation, materials, local_state
intents -> materials, local_state
platform -> navigation, materials, local_state
local_state -> materials
sdk -> @quantalithos/sdk, materials              [formal binding only]
platform/DesktopAdapter -> native_host          [bounded IPC]

core coordinator -- injected typed port --> sdk/platform implementation
UI -- snapshot/callback --> app binding -- coordinator --> store
```

关键说明：port调用箭头不是import实现；type-only共享不会触发运行期循环。local_state不得import coordinator、React或sdk；materials不得由navigation实例反向调用。没有owner API、bus或跨平台业务truth节点。

## 4. app模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02代码主体总览；初始化、依赖注入、页面切换、订阅释放。 |
| 对象/文件 | ApplicationComposition(application_composition.ts)、ClientApplicationShell(client_application_shell.tsx)、PageRegistry(page_registry.tsx)、ClientRoutes(client_routes.ts)、ClientStateBinding(client_state_binding.ts)。 |
| 暴露 | create/dispose composition、render shell、use selector、route registration。 |
| 输入/输出 | validated config + SDK binding status + platform adapter → coordinators与安全初始store；失败输出blocked启动面。 |
| 允许/禁止 | 可装配所有公开入口；禁止注入raw credential、把未绑定能力注册为available、组件直接访问client实例。 |
| 状态/副作用 | 启动与dispose只影响local生命周期；解绑订阅、取消query、清理内存；取消command不等于取消owner副作用。 |
| 测试切口 | 绑定缺失仍显示受限UI；双mount不会双发；dispose后的回包不写新generation。 |
| 停审 | pass：装配归属唯一；SDK正向绑定依CHAT-UP-001 blocked。 |

## 5. navigation模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.6/6.3/6.11～12；安全进入、返回、scope切换、深链再验。 |
| 对象/文件 | RouteContext(route_context.ts)、AccessPosture/VisibilityGuard/ScopeEntryGuard(entry_guards.ts)、RouteContextCoordinator(route_context_coordinator.ts)。 |
| 新增context | ClientConsumptionContext(client_consumption_context.ts)归navigation；actor/scope/project/target/source/请求代次及active/invalidated/cleared，本地代次不赋权/不等于owner版本。 |
| 暴露 | 未验证route factory、formal entry apply、scope change/expiry/clear、guard decision。 |
| port归属 | EntryAccessPort声明在entry_guards.ts，由SdkQueryAdapter实现；调用方coordinator。 |
| 输入/输出 | SDK安全入口引用+可信session binding→access和route；缺来源blocked，hidden不返回标题/正文。 |
| 禁止 | 从URL或opaque ref解析scope、深链自动发送/审批、resolved等于authorized/fresh。 |
| 副作用/测试 | scope change先generation失效与隐藏旧面再query；测试晚到回包、跨account返回、hidden清理。 |
| 停审 | pass：入口与权限来源分离；CHAT-UP-001/002保留。 |

## 6. collaboration模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.4、6.4～6.6；group/channel/dm共用ConversationPage，thread独立上下文。 |
| 对象/文件 | SelectionState、TurnPresentationModel、ConversationSurfaceViewModel、ConversationPageViewModel、PageViewModelAssembler、CollaborationSurfaceCoordinator；Step4既定pages/components。 |
| 模型命名 | canonical为ConversationSurfaceViewModel；ConversationPageViewModel只为实现内UI组合类型，包装surface+composer/feedback/recovery/AT，无重复Turn集合或独立truth，不改02正式主语。 |
| port归属 | CollaborationReadPort定义在collaboration_surface_coordinator.ts；SDK query adapter实现。 |
| 项目/流程/目录capability | ProjectContextCoordinator承接LoadProjectList/Detail/ConversationLinks/NavigateProjectContext；ProcessDrilldownCoordinator承接LoadProjectProcessFlow/LoadStageProcessFlow/LoadProcessNodeDetail；DirectoryCoordinator承接LoadCompanyDirectory/LoadMemberContext/UpdateDirectorySearch。typed port具体声明由本轮Step7承接；本Step只固定消费者归属。 |
| 六新增对象 | ProjectDetailViewModel/ProjectNavigationState/ProcessFlowViewModel/ProcessNodeDetailViewModel/ProjectConversationLinkViewModel/CompanyDirectoryViewModel各在Step4准确文件内独立定义；Step6收稳字段、状态、函数、props。 |
| 页面/组件 | ProjectListPage→ProjectDetailPage五标签，CompanyDirectoryPage独立目录；进度tab内ReadOnlyProcessRenderer+ProcessNodeDetailPanel，ProjectConversationLinks双向入口；图和列表共享safe topology，受限名称/数量/关系不可泄漏。 |
| 暴露 | entry与分页加载、pure assembly、selection action、组件props；不向组件暴露SDK DTO。 |
| Turn分派 | 正式safe render category映射message/gate/artifact/member/project/runtime/system/unsupported；未知类型降级，不猜domain类型。 |
| Gate/Artifact | GateCard显示formal摘要+capability+attempt反馈；Artifact只ref/安全preview descriptor，无raw body或自造download URL。 |
| 摘要边界 | Work项目/工作项、Process流程/Gateway/汇聚、Governance Gate、Runtime统计分源；目录/ProjectMember/Participant/Member在场独立；不推完成度/批准/DM资格，Identity不自动提供完整公司目录。 |
| 禁止 | UI自行请求owner、点按钮即成功、页面自行聚合Workspace truth、以列表空推断不存在。 |
| 副作用/测试 | 只更新local view/selection；测试未知Turn、thread返回、revoked隐藏、键盘与窄窗、不串owner状态。 |
| 新增验证切口 | planned：项目/节点/搜索切换迟到、父拓扑更新、并行join与Gate分立、解绑/撤销/返回、覆盖不完整、图/列表/AT裁剪；原型或safe commit/test/tool摘要不作为验收证据。 |
| 停审 | pass：页面/组件责任与回调闭合；摘要/preview正向依CHAT-UP-004～006。 |

## 7. intents模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.5/6.7～10；draft edit、发送/治理受控意图、retry/probe。 |
| 对象/文件 | DraftState、CommandAttemptState、CommandResultGate、IntentFeedbackViewModel；UserIntentCoordinator、DraftCoordinator、composer/feedback。 |
| ports | IntentCommandPort、IntentProbePort声明于user_intent_coordinator.ts；SDK command/query实现。 |
| 暴露 | draft factory/edit/validate、attempt reserve、submit、formal result gate、explicit retry。 |
| 状态 | draft与attempt分轴；optimistic只是local占位，confirmed只由匹配intent/actor/scope/idempotency和owner结果authority产生。 |
| receipt门控 | 普通接收/排队receipt仅submitted/pending；正式合同具业务确认含义的receipt或正式result/change才支持confirmed。unknown须probe/query/wait；failed新attempt须用户动作/正式capability/SDK重试与幂等合同。 |
| 幂等 | 同一逻辑意图使用SDK提供的稳定association；重复点击复用local in-flight，unknown先probe；不能凭本地digest替代SDK幂等合同。 |
| 禁止 | command取消当owner取消、ACK确认、unknown自动重发、保留raw request/owner result body、客户端实现Governance policy。 |
| 副作用/测试 | local reserve在SDK调用前；dispatch后断线unknown；确认只清除匹配草稿revision，测试编辑期间确认不清新稿。 |
| 停审 | pass：attempt不替代truth；正向发送/审批仍CHAT-UP-001/003 blocked。 |

## 8. continuity模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.7/6.13～16；formal change、resume/requery、gap、restart、跨端刷新。 |
| 对象/文件 | ContinuityState、ResumeContext、ChangeAcceptanceRecord、RecoveryViewModel；ChangeReducer、ResumeCoordinator、RecoveryCoordinator。 |
| ports | ChangeFeedPort/ChangeQualificationPort/ResumePort定义于change_reducer.ts、resume_coordinator.ts；SDK change adapter实现。 |
| 暴露 | qualified reducer、formal resume、generation-bound requery、unknown probe协调；恢复context只有一份canonical。 |
| 接受规则 | opaque cursor不比较字符串、不按arrival time排序；SDK必须提供formal qualification，缺失则blocked/requery。 |
| 新增消费边界 | source-local版本与cursor，不做跨owner原子snapshot；检查ClientConsumptionContext/current代次。Process拓扑与状态版本不兼容partial/stale，父图变更使旧stage/node/ref失效；解绑/目录撤销先遮蔽/失效consumer，再清理。 |
| 多端 | 每端消费owner formal change重建自己local view；不peer-sync draft、不同步local optimistic result、不造server receipt。 |
| 禁止 | 内部bus/topic/offset、缓存恢复即fresh、reconnect ACK即恢复、gap后继续无条件merge、offline command queue自动重放。 |
| 副作用/测试 | 接受记录/水位/局部view同local CAS；duplicate no-op；测试gap、晚到generation、revoke race、重启unknown。 |
| 停审 | pass：Chat reducer和SDK资格职责分开；CHAT-UP-002保持blocked。 |

## 9. materials模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.9/6.20～24；safe display、provenance/freshness解释、preview guard。 |
| 对象/文件 | SafeMaterialSnapshot、OwnerReference、ProvenanceMetadata、FreshnessMarker、PreviewReference(safe_material_snapshot.ts)；composer/mapper/interpreter/preview boundary。 |
| 暴露 | immutable factories、restrict/clear、safe content mapping、preview qualification；纯函数无IO。 |
| 输入/输出 | adapter已证明来源/可见性safe projection→Chat display tokens/ref；二次裁剪只会收紧。 |
| 节点/关联材料 | 正式节点ref和关系读取逐target验证；各Work/Gate/Artifact/Runtime/诊断section独立source/visibility/freshness；不按标题/日志猜关系，不从其他source补缺口。 |
| 禁止 | owner raw body、版本链/证据正文、credential、runtime/tool/provider/bridge payload；从cache补hidden字段。 |
| 依赖 | 零业务实例依赖；AccessPosture只type-only输入，不调用navigation。 |
| 测试切口 | 来源缺失拒绝、假fresh拒绝、safe link allowlist、未知render category、不含原始body。 |
| 停审 | pass：owner类型通过SDK边界引用，Chat只定义display schema。 |

## 10. local_state模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.10/6.25～27；state CAS、draft store、受限投影、清理。 |
| 对象/文件 | ClientStateStore、DraftStore、LocalProjectionEntry、CacheLifecycleRecord、LocalProjectionRepository、PersistenceSafetyGuard、CacheEvictionCoordinator、MemoryProjectionRepository。 |
| 暴露 | read immutable snapshot/subscribe/CAS；load/save/evict安全投影；hold/persist/restore决策。 |
| version | local version仅store/repository读取生成；不与owner revision/cursor/draft revision互换。 |
| 新增切片 | 项目VM/nav、流程/节点、关系/目录及消费context均local safe state；缓存按account/scope/project/target/source切分，context active/旧请求代次不持久恢复。 |
| durable | 默认memory；durable driver/crypto未闭合，不持久化draft文本或展示文本；不写IndexedDB/sqlite占位实现。 |
| 清理 | 先遮蔽与generation fence，再停止consumer，最后repository删除；删除失败仍restricted/evicting，绝不伪称cleared。 |
| 禁止 | raw event/command、credential、owner body、任意浏览器storage、无account/scope分区；本地cache成为truth。 |
| 测试切口 | CAS冲突、scope/account隔离、unsafe拒存、删除失败、恢复再验、memory无durable承诺。 |
| 停审 | pass：读取/写入配对责任明确；durable资格依CHAT-DDD-004-PLAT-001 blocked。 |

## 11. sdk模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 正式02接口层；SDK public export/capability资格与Chat消费者port实现。 |
| 对象/文件 | SdkCapabilityBinding、SdkQueryAdapter、SdkCommandAdapter、SdkChangeAdapter、SdkReferenceAdapter、DiagnosticHandoffAdapter。 |
| 暴露 | consumer ports实现和capability status；client实例只能在composition持有。 |
| 资格 | 每operation需formal export/type、actor/scope、error/result、redaction、compatibility明确；generic unknown skeleton不满足。 |
| blocked行为 | 返回typed dependency_unbound，不尝试私有HTTP/内部bus；UI可使用unavailable fixture，但必须fake标记且不确认真实业务。 |
| 禁止 | Chat发明owner wire DTO、token解析、host提供业务transport、直接owner仓import、SDK eventClient.publish当协作提交。 |
| 测试切口 | 未绑定fail-closed、fake marker保留、result authority拒ACK、source/scope mismatch。 |
| 停审 | pass：local seam可设计；exact绑定blocked，不能以本文关闭CHAT-UP-*。 |

## 12. platform模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §5.8/6.17～19；Desktop lifecycle、capability、focus与AT。 |
| 对象/文件 | PlatformCapabilityState、AccessibilityState、StatusAnnouncement、PlatformCapabilityAdapter、ShellLifecycleCoordinator、AccessibilitySemanticAdapter、DesktopPlatformAdapter、WebPreviewPlatformAdapter。 |
| ports | PlatformPort、AccessibilityPort、LifecyclePort声明platform_ports.ts；Desktop/Web-preview分别实现。 |
| 暴露 | capability probe、bounded lifecycle、focus/live-region、安全preview open请求；不授权业务。 |
| 可访问性 | semantic roles、keyboard action、focus restore、polite/assertive公告、reduced motion；公告由local posture生成且不包含隐藏正文。 |
| 只读renderer边界 | ReadOnlyProcessRenderer归collaboration展示adapter，platform只提供焦点/AT/宿主能力；成熟库待选，不执行BPMN，只有正式授权BPMN可用bpmn-js viewer候选，不生成XML。 |
| 宿主 | close/background/cancel不判定owner结果；IPC origin/window/schema/capability校验；无任意file/shell/URL。 |
| 禁止 | mobile包、通知即审批/已读、OS credential进入UI/store、主机网络代理owner调用。 |
| 测试切口 | unavailable等价路径、键盘/焦点、live-region不重复、late callback、IPC拒未授权origin。 |
| 停审 | pass：Desktop-first不改变共享语义；host能力资格仍blocked。 |

## 13. config模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | 02 §11；load、strict validate、composition输入。 |
| 对象/文件 | ClientConfig(client_config.ts)、ConfigLoader(config_loader.ts)。 |
| 暴露 | immutable validated profile和safe issue codes。 |
| 输入/输出 | 本地受限profile引用/数值→validated config；未知键/不安全配置fail-fast。 |
| 禁止 | raw secret/endpoint、关闭result/visibility guard、开启raw persistence、把blocked SDK capability配为available。 |
| 新增禁配项 | 不配置Process/关系/目录owner、不造join/绑定/覆盖、不关闭source/context/代次/撤销检查；viewer/profile/缓存/局部viewport只能改变允许的表现。 |
| 后续 | Step14与正式04固定完整来源优先级、数值、版本；本Step6闭合稳定字段类别。 |
| 停审 | pass：配置不是truth owner；无生产连接事实。 |

## 14. native_host模块小循环

| 项 | 契约 |
|---|---|
| 来源/能力 | Step3/4 Tauri2单crate；最小宿主生命周期和有限capability dispatch。 |
| 对象/文件 | main.rs启动、lib.rs装配、platform.rs HostCapabilityRequest/HostCapabilityResponse/HostBoundaryGuard。 |
| 暴露 | 经main.json限定的IPC；具体插件与能力需Step7/14闭合。 |
| 依赖/禁止 | 只Tauri工具；禁止业务SDK、owner客户端、内部bus、推理/Tools、任意shell/file。 |
| 错误/测试 | 拒未知请求/窗口/origin，返回safe code；native测试切口只planned。 |
| 停审 | pass：宿主责任已固定，IPC实际资格保持blocked。 |

## 15. 跨模块审计

| 审查项 | 结论 | 依据/限制 |
|---|---|---|
| 概要覆盖 | pass | 七个功能部分逐一对应；app/sdk/config为支撑 |
| 所有Step4责任 | pass | 页面/组件/model/coordinator/store/adapter/config/native均有归属 |
| 运行期循环 | pass | port注入；模型type-only；materials不反调navigation |
| UI副作用 | pass | UI callbacks由app绑定；无业务IO或owner写入 |
| owner权威 | pass | 只formal SDK材料；Workspace unread/pin/preferences不转为Chat权威 |
| 外部资格 | pass_with_upstream_blockers | exact SDK/owner/host/storage保持blocked，不影响local责任设计 |
| 复杂度 | justified | 沿既定10目录+单host，不新增后台service/crate/global domain |

## 16. 回填草稿

未来正式03 §5.1～5.2引用本文件§3～§14，保留每模块职责/暴露/allowed&forbidden依赖、对象/port归属与ASCII图。§6索引来源为本文件责任表；不得装配新增模块。当前不回填正式03。

## 17. 待确认与进入下一步

当前进入Step6框架/粒度复核；typed ports与exact binding由新授权Step7承接。CHAT-UP001～009、WS-UP-*、CHAT-BASE001及host/storage/质量资格open。

进入Step6条件：模块来源、责任、依赖、归属和停审均通过；exact integration blocker只阻塞对应正向adapter，不阻塞Chat-local契约展开。

### 2026-10-01 Governance框架/粒度复核与本轮门禁

| Governance Step5要素 | Chat原位承接 | 结论 |
|---|---|---|
| 输入/SOP回答/旧材料诊断/方案取舍 | §1/2、当前00～02及Step3/4；旧formal03不作为新设计输入 | pass |
| 模块总览/依赖图/职责 | §3及§4～14，十客户端模块+native host，依赖图为运行期有向无环；type-only互引不注入实例 | pass |
| 文件与代码主体映射 | Step4计划树/责任表是路径唯一来源；当前Step5每模块固定对象、入口与消费者port归属 | pass |
| 功能→对象→接缝 | §4～14独立小循环；没有server truth、UoW/outbox/内部bus或backend worker | pass |
| 测试/证据 | 每模块具名planned切口；source/代次/撤销、dispatch/unknown、图/列表/AT、安全IPC和默认memory | pass；非测试结果 |
| 后续逐Step承接 | Step6对象载体→Step7 ports→Step8协议→Step9流程→Step10矩阵 | pass_with_upstream_blockers |

| 独立模块停审 | 核对的实际契约 | 开放项 |
|---|---|---|
| app | composition注入三新增coordinator；React effect仅订阅/释放，不自动dispatch；page registry覆盖三顶层入口 | SDK/host装配资格 |
| navigation | route与ClientConsumptionContext分工；actor/scope/target/source/request代次；project/directory不伪造Conversation context | 入口/深链resolver |
| collaboration | 六独立新VM、三coordinator、五标签及只读下钻；summary不是BPMN topology；目录与三类成员分源 | CHAT-UP008/009 |
| intents | draft revision/attempt/SDK association分离；普通receipt不可confirmed，unknown不可自动重发 | CHAT-UP001/003 |
| continuity | 单source水位/consumer槽位、duplicate/gap/revoke；无跨owner原子fresh | CHAT-UP002/008 |
| materials | 正式safe tokens/ref/provenance；只收紧披露，缺owner资格不造引用 | CHAT-UP004～006/009 |
| local_state | 唯一root/CAS/checks/source map，删除确认与遮蔽分开，默认memory | durable/safe locator |
| sdk | 只实现消费者typed port；exact matrix未确认均blocked；fake不可承认真实业务 | CHAT-UP001～009 |
| platform | Desktop/预览分域，Process graph/list/AT用同safe材料；IPC限定宿主能力 | host/OS资格 |
| config | 只能validated profile/local limits，不能配置owner/授权/confirmed/fresh | Step14/04版本及确值 |
| native_host | 单Tauri crate，可信window/origin probe-only，禁止业务SDK/owner IO | capability allowlist |

跨模块停审：本Step主轴与治理参考结构同粒度；本项目模块数按客户端职责裁剪，没有照搬后端七crate。当前Step5 done/pass_with_upstream_blockers；进入Step6复核typed字段/工厂/状态及支撑类型。所有集成blocker保持open，不装配正式03，不实现/测试/提交。
