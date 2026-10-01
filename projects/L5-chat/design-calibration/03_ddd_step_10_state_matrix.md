# L5-chat 03 · Step 10 状态机与转换矩阵

> 状态：done；gate_status：pass_with_upstream_blockers；日期：2026-10-01。
> 前置：Step9 done/pass_with_upstream_blockers；所有43协议flow已独立展开，Step6字段/方法回查修正。
> 输入：正式02 §9、Step6 state enum/对象字段、Step7读取/版本、Step8请求/结果、Step9触发flow。
> 规范：详细设计SOP Step10及书写规范5.9，参考L1-governance Step10主体筛选、状态族、逐机状态/图/转换/非法/停审粒度。
> 本步只planned local状态契约，无owner truth状态机、全局SystemState、实现/测试/验收证据。完成本Step立即停审，不推进Step11～19或装配正式03。

## 1. 状态主语筛选

| 候选主语/字段 | 入选 | 原因/状态族 |
|---|---|---|
| RouteContext.phase / RoutePhase | 是 | local entry生命周期，runtime/entry |
| AccessPosture.availability / AccessAvailability | 是 | current read/intent可见边界，read/visibility |
| ClientConsumptionContext.contextPosture | 是 | 单source消费代次生命周期，source/reference |
| SelectionState.phase / SelectionPhase | 是 | 当前安全对话选择，local display |
| ProjectNavigationState.selectionPosture / SelectionPhase | 是 | 项目阶段/node局部选择，复用enum，独立对象实例 |
| ProjectDetailViewModel.loadPosture | 是 | 项目页面载入/缺口，projection/read |
| ProcessFlowViewModel.loadPosture | 是 | 正式整体/阶段图载入，projection/read |
| ProcessNodeDetailViewModel.loadPosture | 是 | node/section读取，projection/read |
| ProjectConversationLinkViewModel.loadPosture | 是 | 关系及目标读取，projection/read |
| CompanyDirectoryViewModel.loadPosture | 是 | query/page载入，projection/read |
| DraftState.phase / DraftPhase | 是 | 用户本地输入与revision关联，local input |
| CommandAttemptState.resultPosture | 是 | 本地受控调用结果认识，effect/result correlation；不是owner业务truth |
| FreshnessMarker.state / FreshnessState | 是 | 正式来源水位解释持续读/收紧，不是任意纯marker |
| SafeMaterialSnapshot.disclosure / DisclosurePosture | 是 | 持有材料披露生命周期，read/visibility |
| ContinuityState.phase / ContinuityPhase | 是 | source恢复连续性，source/reference |
| LocalProjectionEntry.state / LocalProjectionState | 是 | local repository候选/清理maintenance |
| PlatformCapabilityState.capabilities[kind] | 是 | 每host能力技术资格，runtime/adapter |
| ShellLifecyclePosture | 否（附消费映射） | bounded host通知姿态，不新增自主业务状态机；closing不owner cancel |
| IntentFeedback/StatusAnnouncement/RecoveryViewModel | 否 | 由上述唯一状态派生的只读显示，不建第二truth |
| PageInfo/ReadSurface.status/DirectoryCoverage/Process role/ProjectDetailTab/IntentKind | 否 | 读结果或分类，没有独立迁移主语；ReadSurface受Access/Freshness安全约束 |
| ResultAuthority/FormalResultMaterial/ProbeResult/PreparedCommand/Receipt/LocalConsumerReceipt | 否 | 权威/一次输入输出/处置，不造第二Command生命周期 |
| DiagnosticHandoffView/CapabilityBindingRecord | 否 | 交付/装配资格一次结果，无本地持续truth推进 |
| LocalId/ExternalHandle/OwnerReference/Provenance/ContextFence/ReturnContext/Locator | 否 | ref或value、无独立状态；来源仍严格registry |
| Repository expectedVersion/slot generation/TTL/容量/重试counter | 否 | 版本和安全限制，无业务状态机 |
| Conversation/Turn/Participant/Project/ProjectMember/Member/Gate/Decision/Artifact/Workspace/Runtime/Process Token/Gateway | 否 | 各正式owner truth，只读安全展示 |

Chat无business truth/outbox propagation/backend idempotency report族；不能照抄Governance这些状态。17个入选local主体均有Step6正式enum，五page各独立实例；共有12个canonical enum。不会为目录/导航/层级再造同义状态集合。

## 2. 状态族与执行批次

| 顺序 | 状态族 | 状态机/模块 | 主要flow | 状态 |
|---|---|---|---|---|
| 10-A | runtime/entry + read/visibility + source isolation | Route/Access/Consumption | ResolveEntryAccess/ConsumeVisibilityChange | done |
| 10-B | local selection + page projection/read | Selection/ProjectNavigation/五Page | Navigate/Load*/Search/Change | done |
| 10-C | local input + effect/result认识 | Draft/CommandAttempt | Submit*/ReceiptOrResult/Probe | done |
| 10-D | source/read/maintenance | Freshness/Disclosure/Continuity/LocalProjection | Change/Resume/Refresh/Persist/Evict | done |
| 10-E | runtime/adapter | 每Platform capability、host通知消费附表 | ProbePlatform/ConsumeShellLifecycle | done |
| 10-F | cross-state audit | 字段/trigger/非法/测试/停止点 | 全部43flow | done |

## 3. 矩阵共同规则

状态名逐字承接Step6；每行独立From→To/具名trigger/Step9同名flow/字段前提/字段更新/副作用/非法错误。新实例factory用factory行，不能把cleared旧generation“恢复”。未列迁移一律invalid_transition且原值/无IO；字段/访问错分别invalid_input/access_denied/authority_missing，late=context_changed，CAS stale=local_conflict。重复同正式材料no-op须保留source identity/registry关联，不乱移cursor或terminal。本文“任一”只指本机列出的完整有限state set，不包含别机enum。

对象成员是pure immutable transition，无network/store；成功由coordinator当前root CAS提交，所有async qualified入参保留原incoming槽位；正式revoke校验current session/scope/source后可先收紧，不能被closed node slot拒绝。所有机器均无owner truth/outbox/trace/audit/history写入，副作用只Step9 local CAS/repository/正式SDK seam；SDK业务effect只有Submit dispatch。factory结构检查不授权限，fake不确认real attempt。

非法transition不追加观测审计/证据；低敏诊断需要独立显式用户操作与正式sink。planned切口是未来测试要求，没有测试结果。所有允许操作仍受Access/Freshness/Disposition与当前slot联合约束，但不新建全局状态机。

## 4. 10-A 入口、访问和消费隔离

### 4.1 RouteContext

主语：navigation/route_context.ts · RouteContext.phase；唯一enum：RoutePhase（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| unresolved | 等待正式入口解析 | 否 | resolve或clear |
| resolved | 正式入口可定位，access另验 | 否 | safe read/重新导航 |
| restricted | 正式入口受限 | 否 | 新入口重验/clear |
| expired | 旧语境需重验 | 否 | 新resolve/clear |
| cleared | 旧route refs已移除 | 是，旧generation | 新route另建 |

#### 状态转换图: 4.1 RouteContext

```text
[new route] -> unresolved -> resolved
                    |           |
                    v           v
                restricted <- resolved
                    |           |
                    v           v
                  cleared <- expired
[new route/revalidation generation] -> unresolved
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | unresolved | RouteContextFactory.fromEntry/fromTarget | ResolveEntryAccess | LocalId/config/kind/current request generation；candidate结构有效 | entry/target候选，scope/context=null，return仅safe candidate | local新route CAS，无owner IO | invalid_input |
| factory | expired | RouteContextFactory.fromRestore | RestoreAfterShellRestart | approved RestorationHint，仅候选 | refs未恢复授权；generation新 | local route，之后resolve | dependency_unbound |
| unresolved | resolved | RouteContextFactory.applyEntryResult | ResolveEntryAccess | QualifiedEntryResolution formal registry；requestFence actor/session/route/generation匹配；readable scope，conversation/thread context必填 | scope/context/entry/target正式safe ref；phase resolved | route/access同受控CAS；无其它material导入 | authority_missing/context_changed |
| unresolved/resolved | restricted | RouteContextFactory.applyEntryResult / Access收紧协调 | ResolveEntryAccess/ConsumeVisibilityChange | formal restricted/hidden范围当前，若hidden清subject；普通error不猜正式deny | phase restricted，清不允许refs/return/context | 先hide/invalidate再stop/delete | access_denied/context_changed |
| unresolved/resolved | expired | RouteContextFactory.markExpired | ConsumeShellLifecycle/RestoreAfterShellRestart/ConsumeMaterialRevisionChange | 正式expiry或当前更严格安全期限，不用cache更新资格 | phase expired，禁止intent及旧result消费 | 收紧local，再query | invalid_transition |
| resolved/restricted/expired | unresolved | RouteContextFactory.changeScope / 新request factory | ResolveEntryAccess/NavigateProjectContext | 新generation safe integer、trusted current actor/scope候选、旧slots失效 | 清context/旧return；scope候选重新验证 | local CAS后resolve | invalid_input/context_changed |
| unresolved/resolved/restricted/expired | cleared | RouteContextFactory.clearForLogout | ConsumeVisibilityChange/ConsumeShellLifecycle/EvictLocalMaterial | current session/scope正式影响范围或trusted logout/closing | scope/entry/target/context/return=null；generation推进 | 先hide/invalidate，再释放/删除 | context_changed |
| resolved/restricted/expired/cleared | same | 读取/重复安全通知 | Load*/重复cleanup | same current identity，cleared仍refs空 | 无资格升级，phase不变 | readonly/no-op | context_changed |

#### 非法转换与planned切口

cleared→resolved、expired→resolved绕过新generation/正式entry结果均拒绝；raw deep link与validated=true不是authority。restricted/expired重验使用新请求generation，不复活原candidate授权。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：入口晚到、thread-parent错、group→project重新授权、hidden refs清、back缓存不授权限、cleared旧generation无复活。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 4.2 AccessPosture

主语：navigation/entry_guards.ts · 当前route及各section独立availability；唯一enum：AccessAvailability（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| available | formal可读/能力候选 | 否 | safe read，command另验 |
| read_only | formal只读 | 否 | read，无command |
| restricted | 安全受限状态 | 否 | 重新正式资格 |
| unavailable | 当前依赖暂不可用 | 否 | 只读重验 |
| blocked | 安全合同/资格缺失 | 否 | 资格闭合后重验 |
| hidden | subject不可披露 | 是，旧消费generation | 新generation独立资格 |

#### 状态转换图: 4.2 AccessPosture

```text
blocked/unavailable/restricted -> [new formal qualification] -> available/read_only
available -> read_only -> restricted/blocked/hidden
any current posture -> hidden
hidden(old generation) -X-> available
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | blocked | AccessPostureFactory.blocked | ResolveEntryAccess/Startup | 尚无正式contract或session/visibility | fence/visibility=null、capabilityRefs=[]，finite reason | safe local启动/entry遮蔽 | invalid_input |
| blocked/unavailable/restricted | available/read_only | AccessPostureFactory.fromQualified / 正式entry mapper | ResolveEntryAccess/LoadOwnerSummary/LoadIntentCapability | formal current registry/session/source/target/visibility，fake拒绝，context checks | fence/visibility正式填齐，capabilityRefs仅正式owner能力 | qualified结果CAS；无permission本地推断 | authority_missing |
| available/read_only | available/read_only | AccessPostureFactory.fromQualified | LoadIntentCapability/ResolveEntryAccess | 新formal capability/read结果current；升级read_only→available只能正式qualification | 更新正式capability refs，保留current scope | CAS current incoming，command仍再次guard | context_changed |
| available | read_only | AccessPostureFactory.applyVisibility | ConsumeVisibilityChange | formal next=read_only同current session/scope/source，旧available资格仍可safe读 | capabilityRefs=[]；availability read_only | 立即disable intent，local CAS；不cancel owner | authority_missing |
| available/read_only/restricted/unavailable/blocked | restricted/blocked/hidden | AccessPostureFactory.restrict/applyVisibility | ConsumeVisibilityChange/ConsumeShellLifecycle/EvictLocalMaterial | 只formal或更严安全收紧；next已声明，不扩大范围猜测 | refs/capabilities按姿态清，hidden无subject fence/ref | hide→stop→delete，failure不rollback | invalid_transition |
| available/read_only | unavailable | AccessPostureFactory.markUnavailable | Load*/ProbePlatformCapability | 当前只读依赖正式暂不可用，缺contract则blocked不unavailable | 无未经验证内容/capability；safe reason | safe local error，no private fallback | invalid_input |
| hidden | new generation blocked→available/read_only | 新Access factory + 正式qualification | ResolveEntryAccess | 旧generation先clear；新session/route/access request authority | 新对象填新fence/visibility，旧refs不复活 | 新route CAS+SDK resolve只读 | context_changed |

#### 非法转换与planned切口

任意本地角色/Participant/ProjectMember/host available/缓存命中把blocked、read_only或hidden升available均拒绝；button disabled不是server gate。AccessAvailability与CapabilityAvailability名字不同、主体不同。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：群聊项目串权、目录人员与DM能力独立、fake资格、read_only禁submit、hidden目标标签/引用/计数清。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 4.3 ClientConsumptionContext

主语：navigation/client_consumption_context.ts · 每consumer slot；唯一enum：ConsumptionContextPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| active | 当前source/request代次可匹配，非授权 | 否 | apply matched qualified result |
| invalidated | 禁止旧响应应用 | 否 | clear/stop read/feed |
| cleared | 旧引用已清 | 是，旧实例 | 新代次另建 |

#### 状态转换图: 4.3 ClientConsumptionContext

```text
[formal request factory] -> active -> invalidated -> cleared
                              |                      ^
                              +----------------------+
[new generation factory] -> active  (no old instance revival)
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | active | ConsumptionContextFactory.forRequest | Load*/Submit*/ResumeChangeContext/UpdateDirectorySearch | route可读；session/actor/scope/target/source/visibility正式qualified；requestGeneration新safe integer | fence/actor/scope/project/target/source/visibility完整，posture active | 先root登记slot，后SDK read/command | authority_missing/dependency_unbound |
| active | active | ConsumptionContextFactory.matches/isApplicable + matched CAS | Load*/ConsumeFormalChange/ConsumeResumeResult | 全部fence/actor/scope/project/target/source/visibility/代次等值，不跨owner版本 | context不变，业务safe slice独立更新 | CAS incoming checks，不改来包generation | context_changed |
| active | invalidated | ConsumptionContextFactory.invalidate | NavigateProjectContext/UpdateDirectorySearch/ConsumeVisibilityChange/父图版本变化 | reason session_changed/scope_changed/target_changed/source_changed/revoked当前可信 | posture invalidated；阻止来包，不自动授权新target | 先CAS/registry失效再cancel read/stop | invalid_input |
| active/invalidated | cleared | ConsumptionContextFactory.clear | ConsumeVisibilityChange/EvictLocalMaterial/ConsumeShellLifecycle | 正式范围或local cleanup，不要求old active；current session验证 | 全部外部refs/fence=null，保留local代次 | local清理；stop/delete失败仍不可应用 | context_changed |
| cleared/invalidated | new active | 新ConsumptionContextFactory.forRequest | 新Load*/新Search/新Resolve | 新slot或严格新requestGeneration；qualified来源，旧实例禁止修改 | new instance active；旧保持cleared/invalidated | 登记新slot后独立SDK | invalid_transition |

#### 非法转换与planned切口

invalidated/cleared原实例→active非法；晚到结果即使root版本仍匹配也不可消费。scope revoke必须检查current session/scope/source，不可因node slot已失效而忽略收紧。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：node A→B迟到、搜索g1→g2、父拓扑更新失效、source并行隔离、node关闭后的scope revoke、generation溢出。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 4.4 本族停审

入口phase不授权，access只formal资格可升级，consumer代次失效不可复活；scope revoke的安全例外有明确current session/scope/source门禁。三机独立不合成GlobalState，进入10-B。

## 5. 10-B 安全选择与五个page读取主体

### 5.1 SelectionState

主语：collaboration/selection_state.ts · 对话选择；唯一enum：SelectionPhase（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| empty | 未选择safe subject | 否 | select current context |
| selected | 当前正式surface内的选择 | 否 | safe Turn/Gate/Artifact/focus |
| stale | 来源变化后需重验 | 否 | 当前qualified重新select或clear |
| cleared | 旧context选择清除 | 是，旧实例 | 新context从empty建 |

#### 状态转换图: 5.1 SelectionState

```text
empty -> selected -> stale
  |          |         |
  v          v         v
cleared <- cleared <- cleared
stale -> selected  (qualified current surface only)
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | empty | SelectionFactory.empty | ResolveEntryAccess/LoadConversationSurface | 无subject refs | context/turn/gate/artifact/focus=null，expanded空 | 纯local初值 | invalid_input |
| factory | stale | SelectionFactory.fromRoute | ResolveEntryAccess | route resolved候选仍未材料重验 | safe候选而非active选择 | local only | authority_missing |
| empty/stale/selected | selected | SelectionFactory.selectContext/selectTurn | LoadConversationSurface/LoadTurnPage/local select helper | Access available/read_only；context samefence；turn在当前safe surface且disclosure可见 | 更新context/Turn、清不兼容Gate/Artifact；phase selected | local CAS，绝不read receipt/attention | access_denied/context_changed |
| selected | selected | SelectionFactory.moveFocus/setExpanded | LoadAccessibilityContext/local select helper | target当前safe region，regions有限且不泄露hidden | focus/expanded显示变化，不改owner选择 | local CAS；AT副作用非业务结果 | invalid_input |
| selected | stale | SelectionFactory.markStale | ConsumeMaterialRevisionChange/ConsumeFormalChange/父图变化 | 正式source版本变化或更严失效，旧ref只留安全候选 | phase stale，不可凭候选提交intent | local CAS/requery | context_changed |
| empty/selected/stale | cleared | SelectionFactory.clearForVisibilityChange | ConsumeVisibilityChange/EvictLocalMaterial/ConsumeShellLifecycle | 正式current范围/可信cleanup | refs/focus/expanded清 | hide先，AT图/list同裁剪 | authority_missing |
| cleared | new empty | SelectionFactory.empty新实例 | ResolveEntryAccess | 新fence/generation；旧instance不复活 | new refs空 | new local object | invalid_transition |

#### 非法转换与planned切口

selectedContext=null时不能持Turn/Gate/Artifact；selected不已读/attention truth。cleared旧实例select非法，必须新empty；从hidden候选直接选择拒绝。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：旧Turn删除/隐藏、thread切换清不兼容targets、focus隐藏、返回不授权、无read receipt副作用。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.2 ProjectNavigationState

主语：collaboration/project_navigation_state.ts · 项目局部选择；唯一enum：SelectionPhase（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| empty | 无project/下钻选择 | 否 | 正式route候选 |
| selected | 当前safe project/stage/node版本已核对 | 否 | tab/viewport/read下钻 |
| stale | 候选需新父拓扑/访问重验 | 否 | formal重新选择 |
| cleared | 旧项目选择移除 | 是，旧context | 新route另建 |

#### 状态转换图: 5.2 ProjectNavigationState

```text
[fromRoute candidate] -> empty/stale -> selected
                                      |     |
                                      v     v
                                    stale -> cleared
[new route] -> empty/stale
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | empty/stale | ProjectNavigationFactory.fromRoute | ResolveEntryAccess/NavigateProjectContext | null project→empty；Work正式项目候选→stale；route kind兼容 | overview、stage/node/revision=null、viewport初值、safe return | local factory，不设进度route | invalid_input |
| empty/stale/selected | selected | ProjectNavigationFactory.selectStage/selectNode | NavigateProjectContext/LoadStageProcessFlow/LoadProcessNodeDetail | 同Work项目、formal safe拓扑含获准stage/node、正式父级关系及current revision | 更新stage/node/topologyRevision，node选择清其它不兼容；activeTab进度仅local | single root CAS后Query，无Process/Work执行 | access_denied/context_changed |
| empty/stale/selected | same | ProjectNavigationFactory.selectTab/setViewport | NavigateProjectContext | 五tab有限分类、finite x/y/zoom及config范围；仅current safe instance | activeTab/viewport，不改正式scope或选中资格 | local CAS，图布局非业务truth | invalid_input |
| selected/stale | stale | ProcessDrilldownCoordinator.invalidateParent / local导航裁剪 | ConsumeFormalChange/LoadProjectProcessFlow/LoadStageProcessFlow | formal parent topology source换版，current项目 | 清stage/node/旧viewport/revision及旧return下钻refs；新parent待query | invalidate child slots先，清node details | context_changed |
| empty/stale/selected | cleared | ProjectNavigationFactory.invalidate | ConsumeVisibilityChange/EvictLocalMaterial | current正式visibility作用project/node范围；project撤销清全部 | project/stage/node/revision/return=null，selectionPosture cleared | hide/AT焦点清，后stop/delete | authority_missing |
| cleared | new empty/stale | ProjectNavigationFactory.fromRoute新对象 | ResolveEntryAccess | newroute generation+正式入口候选 | 新对象，不保留旧stage/授权 | local route+独立query | invalid_transition |

#### 非法转换与planned切口

tab=progress不selected、不证明流程运行；工单/群聊→项目须Work正式关系与target access，不能从群成员推项目权限。ProjectNavigation没有PageLoadPosture，不发明六个page机器。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：任务点击进progress、群聊项目往返、父版本变化、hidden node、viewport bounds、五tab无顶层progress。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.3 ProjectDetailViewModel

主语：collaboration/project_detail_view_model.ts · loadPosture；唯一enum：PageLoadPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| loading | 当前安全请求等待来源 | 否 | qualified read或失败裁剪 |
| ready | 当前获准section可用 | 否 | 展示/下钻受独立access |
| partial | 部分section/coverage缺口 | 否 | 只展示获准部分，refresh |
| stale | 正式版本/语境可能落后 | 否 | safe候选与重查 |
| blocked | 缺合同/访问/安全资格 | 否 | 合同闭合后新请求 |
| unavailable | 当前读取暂不可用 | 否 | 只读重验 |

#### 状态转换图: 5.3 ProjectDetailViewModel

```text
[qualified new request] -> loading -> ready
                              |           |
                              +-> partial +-> stale
                              |              |
                              +-> blocked/unavailable
[new access/source query] -> loading
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | ProjectDetailFactory.forProject | LoadProjectDetail | 正式target/access/active source context满足；项目主access与各owner section独立；navigation只同root派生 | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | ProjectDetailFactory.applySection/applyWorkItems/applyEvidence/applyFlow/applyLinks | LoadProjectDetail/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新projectReference、projectSummary/flowView/conversationLinks/workItems/evidenceRefs；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | ProjectDetailFactory.applySection/applyWorkItems/applyEvidence/applyFlow/applyLinks/ProjectDetailFactory.failLoad | LoadProjectDetail/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | ProjectDetailFactory.failLoad / parent/source失效协调 | LoadProjectDetail/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；项目主access与各owner section独立；navigation只同root派生 | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | ProjectDetailFactory.restrict/ProjectDetailFactory.failLoad | LoadProjectDetail/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响projectReference、projectSummary/flowView/conversationLinks/workItems/evidenceRefs及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | ProjectDetailFactory.failLoad | LoadProjectDetail | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | ProjectDetailFactory.forProject / 新request | LoadProjectDetail | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProjectDetail/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

#### 非法转换与planned切口

blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：project revoked裁剪全部，部分section失败仅partial；项目主access与各owner section独立；navigation只同root派生；error mapping与未列迁移拒绝。 此页独立实例使用同PageLoadPosture enum；factory缺正式provider/关系不能构造loading模型，shell返回安全blocked面，无假ref。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.4 ProcessFlowViewModel

主语：collaboration/process_flow_view_model.ts · loadPosture；唯一enum：PageLoadPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| loading | 当前安全请求等待来源 | 否 | qualified read或失败裁剪 |
| ready | 当前获准section可用 | 否 | 展示/下钻受独立access |
| partial | 部分section/coverage缺口 | 否 | 只展示获准部分，refresh |
| stale | 正式版本/语境可能落后 | 否 | safe候选与重查 |
| blocked | 缺合同/访问/安全资格 | 否 | 合同闭合后新请求 |
| unavailable | 当前读取暂不可用 | 否 | 只读重验 |

#### 状态转换图: 5.4 ProcessFlowViewModel

```text
[qualified new request] -> loading -> ready
                              |           |
                              +-> partial +-> stale
                              |              |
                              +-> blocked/unavailable
[new access/source query] -> loading
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | ProcessFlowFactory.forContext | LoadProjectProcessFlow/LoadStageProcessFlow | 正式target/access/active source context满足；正式Process关联、拓扑/状态适用版本，fork/join/Gateway正式角色；图/list/AT同集合 | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | ProcessFlowFactory.applyTopology/applyState/applyGovernanceRefs | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新project/process/stage refs、topologyMaterial/stateMaterial、provenance/governanceRefs；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | ProcessFlowFactory.applyTopology/applyState/applyGovernanceRefs/ProcessFlowFactory.failLoad | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | ProcessFlowFactory.failLoad / parent/source失效协调 | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；正式Process关联、拓扑/状态适用版本，fork/join/Gateway正式角色；图/list/AT同集合 | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | ProcessFlowFactory.restrict/ProcessFlowFactory.failLoad | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响project/process/stage refs、topologyMaterial/stateMaterial、provenance/governanceRefs及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | ProcessFlowFactory.failLoad | LoadProjectProcessFlow/LoadStageProcessFlow | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | ProcessFlowFactory.forContext / 新request | LoadProjectProcessFlow/LoadStageProcessFlow | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProjectProcessFlow/LoadStageProcessFlow/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

#### 非法转换与planned切口

blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：parent/state版本不兼容stale/partial，不补XML或推join；正式Process关联、拓扑/状态适用版本，fork/join/Gateway正式角色；图/list/AT同集合；error mapping与未列迁移拒绝。 此页独立实例使用同PageLoadPosture enum；factory缺正式provider/关系不能构造loading模型，shell返回安全blocked面，无假ref。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.5 ProcessNodeDetailViewModel

主语：collaboration/process_node_detail_view_model.ts · loadPosture；唯一enum：PageLoadPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| loading | 当前安全请求等待来源 | 否 | qualified read或失败裁剪 |
| ready | 当前获准section可用 | 否 | 展示/下钻受独立access |
| partial | 部分section/coverage缺口 | 否 | 只展示获准部分，refresh |
| stale | 正式版本/语境可能落后 | 否 | safe候选与重查 |
| blocked | 缺合同/访问/安全资格 | 否 | 合同闭合后新请求 |
| unavailable | 当前读取暂不可用 | 否 | 只读重验 |

#### 状态转换图: 5.5 ProcessNodeDetailViewModel

```text
[qualified new request] -> loading -> ready
                              |           |
                              +-> partial +-> stale
                              |              |
                              +-> blocked/unavailable
[new access/source query] -> loading
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | NodeDetailFactory.forNode | LoadProcessNodeDetail | 正式target/access/active source context满足；current node及parentRevision、正式关联及每section独立source/access | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | NodeDetailFactory.applyAssociations/applySection | LoadProcessNodeDetail/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新nodeReference/topologyRevision/associationRefs/sections；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | NodeDetailFactory.applyAssociations/applySection/NodeDetailFactory.failLoad | LoadProcessNodeDetail/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | NodeDetailFactory.failLoad / parent/source失效协调 | LoadProcessNodeDetail/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；current node及parentRevision、正式关联及每section独立source/access | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | NodeDetailFactory.restrict/NodeDetailFactory.failLoad | LoadProcessNodeDetail/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响nodeReference/topologyRevision/associationRefs/sections及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | NodeDetailFactory.failLoad | LoadProcessNodeDetail | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | NodeDetailFactory.forNode / 新request | LoadProcessNodeDetail | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProcessNodeDetail/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

#### 非法转换与planned切口

blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：父图变化invalidateParent先清node/sections，不能旧node复活；current node及parentRevision、正式关联及每section独立source/access；error mapping与未列迁移拒绝。 此页独立实例使用同PageLoadPosture enum；factory缺正式provider/关系不能构造loading模型，shell返回安全blocked面，无假ref。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.6 ProjectConversationLinkViewModel

主语：collaboration/project_conversation_link_view_model.ts · loadPosture；唯一enum：PageLoadPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| loading | 当前安全请求等待来源 | 否 | qualified read或失败裁剪 |
| ready | 当前获准section可用 | 否 | 展示/下钻受独立access |
| partial | 部分section/coverage缺口 | 否 | 只展示获准部分，refresh |
| stale | 正式版本/语境可能落后 | 否 | safe候选与重查 |
| blocked | 缺合同/访问/安全资格 | 否 | 合同闭合后新请求 |
| unavailable | 当前读取暂不可用 | 否 | 只读重验 |

#### 状态转换图: 5.6 ProjectConversationLinkViewModel

```text
[qualified new request] -> loading -> ready
                              |           |
                              +-> partial +-> stale
                              |              |
                              +-> blocked/unavailable
[new access/source query] -> loading
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | ProjectConversationLinkFactory.forAnchor | LoadProjectConversationLinks | 正式target/access/active source context满足；provider正式owner/version；每target独立入口资格，关系不赋目标access | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | ProjectConversationLinkFactory.applyRelationship/applyTargetAccess | LoadProjectConversationLinks/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新anchorReference/relationshipMaterial/targets/provenance；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | ProjectConversationLinkFactory.applyRelationship/applyTargetAccess/ProjectConversationLinkFactory.failLoad | LoadProjectConversationLinks/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | ProjectConversationLinkFactory.failLoad / parent/source失效协调 | LoadProjectConversationLinks/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；provider正式owner/version；每target独立入口资格，关系不赋目标access | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | ProjectConversationLinkFactory.restrict/ProjectConversationLinkFactory.failLoad | LoadProjectConversationLinks/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响anchorReference/relationshipMaterial/targets/provenance及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | ProjectConversationLinkFactory.failLoad | LoadProjectConversationLinks | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | ProjectConversationLinkFactory.forAnchor / 新request | LoadProjectConversationLinks | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProjectConversationLinks/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

#### 非法转换与planned切口

blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：解绑立即失效target/return，不能cache恢复binding；provider正式owner/version；每target独立入口资格，关系不赋目标access；error mapping与未列迁移拒绝。 此页独立实例使用同PageLoadPosture enum；factory缺正式provider/关系不能构造loading模型，shell返回安全blocked面，无假ref。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.7 CompanyDirectoryViewModel

主语：collaboration/company_directory_view_model.ts · loadPosture；唯一enum：PageLoadPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| loading | 当前安全请求等待来源 | 否 | qualified read或失败裁剪 |
| ready | 当前获准section可用 | 否 | 展示/下钻受独立access |
| partial | 部分section/coverage缺口 | 否 | 只展示获准部分，refresh |
| stale | 正式版本/语境可能落后 | 否 | safe候选与重查 |
| blocked | 缺合同/访问/安全资格 | 否 | 合同闭合后新请求 |
| unavailable | 当前读取暂不可用 | 否 | 只读重验 |

#### 状态转换图: 5.7 CompanyDirectoryViewModel

```text
[qualified new request] -> loading -> ready
                              |           |
                              +-> partial +-> stale
                              |              |
                              +-> blocked/unavailable
[new access/source query] -> loading
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | CompanyDirectoryFactory.forProvider | LoadCompanyDirectory/UpdateDirectorySearch | 正式target/access/active source context满足；formal provider/人类AIcoverage、current query代次/page lineage，nextPageRef只读派生 | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | CompanyDirectoryFactory.applyPage | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新providerReference/searchState/people/pageInfo/nextPageRef/coverage；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | CompanyDirectoryFactory.applyPage/CompanyDirectoryFactory.failLoad | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | CompanyDirectoryFactory.failLoad / parent/source失效协调 | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；formal provider/人类AIcoverage、current query代次/page lineage，nextPageRef只读派生 | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | CompanyDirectoryFactory.restrict/CompanyDirectoryFactory.failLoad | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响providerReference/searchState/people/pageInfo/nextPageRef/coverage及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | CompanyDirectoryFactory.failLoad | LoadCompanyDirectory/UpdateDirectorySearch | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | CompanyDirectoryFactory.forProvider / 新request | LoadCompanyDirectory/UpdateDirectorySearch | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadCompanyDirectory/UpdateDirectorySearch/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

#### 非法转换与planned切口

blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：rapid search旧页丢弃，hidden时名单/query/游标/选择清；formal provider/人类AIcoverage、current query代次/page lineage，nextPageRef只读派生；error mapping与未列迁移拒绝。 此页独立实例使用同PageLoadPosture enum；factory缺正式provider/关系不能构造loading模型，shell返回安全blocked面，无假ref。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 5.8 本族停审

Selection/ProjectNavigation各自对象状态且同enum；五Page各自独立字段/trigger/来源，未合成GlobalLoading。图/列表/AT同safe拓扑，目录覆盖/关系不client truth。PageLoad error回Step6 §20.5与Step9 §12.4，有失败成员不留实现补猜；全部切口planned，上游blocker保留。进入10-C。

## 6. 10-C 草稿与受控结果认识

### 6.1 DraftState

主语：intents/draft_state.ts · DraftState.phase/revisionHint；唯一enum：DraftPhase（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| empty | 无输入 | 否 | edit/clear |
| editing | 用户改稿，校验失效 | 否 | validate/attach/reply/edit |
| locally_valid | 当前revision本地结构有效，非业务授权 | 否 | capability recheck/submit |
| invalid | 本地issues非空 | 否 | edit/revalidate/clear |
| submitting | 此revision已绑定attempt | 否 | 保留显示、编辑新revision/匹配clear |
| restored | safe候选待语境校验 | 否 | validate/edit/clear；默认不durable恢复text |
| cleared | 此revision text/ref清除 | 是，此旧revision | 显式新revision edit |

#### 状态转换图: 6.1 DraftState

```text
empty -> editing -> locally_valid -> submitting -> cleared
            |          ^                |
            v          |                v
          invalid -----+              editing(new revision)
restored -> editing/locally_valid/invalid
cleared -> editing(new revision only)
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | empty | DraftFactory.empty | LoadDraft/local explicit编辑helper | current verified Conversation context；local draftId，项目目录禁止建稿 | text空/ref空/revision0/submittingIntent=null | unique root draft map，不owner写 | authority_missing |
| factory | restored | DraftFactory.restore | RestoreAfterShellRestart | 正式safe serializer/storage资格+currentaccess；本轮默认正文durable禁用 | 恢复候选revision，checkedRevision=null、issues待校验 | 本轮text恢复正向blocked，不宣称持久化 | dependency_unbound |
| empty/editing/invalid/locally_valid/restored/cleared | editing | DraftFactory.edit/attach/setReplyTarget | local composer callback/SubmitConversationIntent准备 | text/ref/reply safe当前context；newRevision=old+1 safeinteger；cleared仅新revision | safeText/ref/reply更新，validation失效、submittingIntent=null | local CAS，编辑不取消旧attempt | invalid_input/unsafe_material |
| submitting | editing | DraftFactory.edit | local composer callback/SubmitConversationIntent进行中 | 显式用户编辑，revision+1，旧attempt已reserved不得复用调用权 | 新稿保留、校验失效、清新draft.submittingIntent；旧attempt关联不删 | local CAS，不owner cancel | invalid_input |
| editing/restored/invalid/locally_valid | locally_valid | DraftFactory.validate | SubmitConversationIntent前local validate | checkedRevision=current revision；issues=[]；当前access与DraftPolicy结构条件满足 | validation当前revision、phase locally_valid | local CAS；非owner允许发送 | invalid_transition |
| editing/restored/invalid/locally_valid | invalid | DraftFactory.validate | SubmitConversationIntent前local validate | issues包含empty/too_long/unsafe_ref/context_unverified任一；有限code | checkedRevision=current、issues完整、phase invalid | local only，不prepare/dispatch | invalid_input |
| locally_valid | submitting | DraftFactory.markSubmitting | SubmitConversationIntent | expectedRevision==current，currentaccess/capability另验，intent来自local reservation | submittingIntent填当前intent、phase submitting | 与attempt reservation同root CAS，后no-effect prepare | context_changed/local_conflict |
| submitting | editing | DraftFactory.releaseSubmission | SubmitConversationIntent pre-dispatch失败/ConsumeCommandReceiptOrResult正式failed/rejected | 同draftRef/revision/submittingIntent且attempt failed/rejected；unknown/pending/confirmed拒绝 | 保留text/ref/revision，清submitting关联及旧validation，后validate才能locally_valid/invalid | local CAS，未知attempt不重发 | invalid_transition |
| empty/editing/locally_valid/invalid/submitting/restored | cleared | DraftFactory.clear | ConsumeCommandReceiptOrResult/ConsumeVisibilityChange/EvictLocalMaterial | 正式confirmed_revision只draftRef/revision完全匹配；revoke/logout只当前范围；user_discard明确 | safeText=''、refs=[]/reply=null/submitting=null；phase cleared | 单root或安全cleanup CAS；text不诊断 | context_changed |
| submitting | submitting | 重复相同revision提交读取 | SubmitConversationIntent重复点击 | 同draft/revision已有nonterminal attempt | 返回已有feedback，draft不变 | 无第二SDK调用 | invalid_transition |

#### 非法转换与planned切口

locally_valid不server授权；validation旧revision不能submit。unknown/result timeout不清稿或自动重放。confirmed旧revision不能清编辑后的稿，cleared新编辑必须revision推进。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：空稿/IME、限长/ref、旧validation、双击、提交中编辑、旧确认保留新稿、revoke清text，默认durable disabled。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 6.2 CommandAttemptState

主语：intents/command_attempt_state.ts · local result认识；唯一enum：CommandResultPosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| draft | 本地预留尚未可能调用 | 否 | no-effect prepare或pre-call失败 |
| submitted | 已预留调用权，可能已发起，非业务成功 | 否 | formal receipt/result/probe |
| pending | formal处理中 | 否 | wait/probe/result |
| confirmed | formal committed权威核验 | 是，同intent | 重复同结果no-op |
| rejected | formal业务拒绝 | 是，同intent | 新显式intent另建 |
| failed | 确定副作用未成立 | 是，同intent | 新显式intent另建 |
| unknown | 已可能调用，副作用不确定 | 否 | probe/query/wait/用户决定 |

#### 状态转换图: 6.2 CommandAttemptState

```text
draft -> submitted -> pending -> confirmed/rejected/failed
  |          |           |                   (terminal)
  v          v           v
failed     unknown <---- unknown
             |
             +-> pending/confirmed/rejected/failed (formal probe/result only)
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | draft | AttemptFactory.fromDraft/fromGovernance | SubmitConversationIntent/SubmitGovernanceIntent | currentactor/fence/capability，conversation draft pair或Governance gate/action完整 | intent/kind/fence/actor及draft或Gate/action；association/receipt/result=null；dispatched=false | local reservation CAS，SDK无调用 | invalid_input/authority_missing |
| draft | draft | AttemptFactory.bindIdempotency | Submit*Intent | formal no-effect prepare返回association，sameintent/actor/fence；payload SDK冻结 | association填formal handle，dispatched仍false | CAS候选，可与调用权reservation合并 | authority_missing |
| draft | submitted | AttemptFactory.reserveDispatch | Submit*Intent | preparedRef正式registry、association非null，当前slot/capability，唯一CAS胜出 | dispatched=true、submitted、nextAction=wait；no request body | CAS后至多一次SDK.dispatch，不要等ACK再标 | context_changed/local_conflict |
| draft | failed | AttemptFactory.failBeforeDispatch | Submit*Intent | dispatched=false且确定未调用；no-effect prepare失败保证正式，无owner effect | failed/none、safe reason；保留/重验稿 | localCAS，零dispatch | invalid_transition |
| submitted | pending | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；formal处理中material，或正式pending receipt（unknown转pending只formal probe/result） | resultPosture=pending，result/receipt仅formal；nextAction=wait | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | confirmed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式committed authority且effect=committed、formal resultRef或明确business-confirming receiptRef | resultPosture=confirmed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | rejected | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式业务拒绝material.effect=rejected且formal resultRef | resultPosture=rejected，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | failed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式material.effect=no_effect且关联可核对，不能仅HTTP失败/not_found | resultPosture=failed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | unknown | AttemptFactory.markUnknown / gate unresolved | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；dispatched=true且副作用未能证明；非terminal | resultPosture=unknown，result/receipt仅formal；nextAction=probe | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | pending | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；formal处理中material，或正式pending receipt（unknown转pending只formal probe/result） | resultPosture=pending，result/receipt仅formal；nextAction=wait | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | confirmed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式committed authority且effect=committed、formal resultRef或明确business-confirming receiptRef | resultPosture=confirmed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | rejected | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式业务拒绝material.effect=rejected且formal resultRef | resultPosture=rejected，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | failed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式material.effect=no_effect且关联可核对，不能仅HTTP失败/not_found | resultPosture=failed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | unknown | AttemptFactory.markUnknown / gate unresolved | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；dispatched=true且副作用未能证明；非terminal | resultPosture=unknown，result/receipt仅formal；nextAction=probe | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | pending | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；formal处理中material，或正式pending receipt（unknown转pending只formal probe/result） | resultPosture=pending，result/receipt仅formal；nextAction=wait | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | confirmed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式committed authority且effect=committed、formal resultRef或明确business-confirming receiptRef | resultPosture=confirmed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | rejected | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式业务拒绝material.effect=rejected且formal resultRef | resultPosture=rejected，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | failed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式material.effect=no_effect且关联可核对，不能仅HTTP失败/not_found | resultPosture=failed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | unknown | AttemptFactory.markUnknown / gate unresolved | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；dispatched=true且副作用未能证明；非terminal | resultPosture=unknown，result/receipt仅formal；nextAction=probe | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| confirmed/rejected/failed | same | 重复sameformal结果或local read | ConsumeCommandReceiptOrResult/ProbeCommandAttempt | 同correlation与同正式terminal结果identity；冲突结果不覆盖 | 终态保持，反馈只读 | no-op，零SDK业务调用 | invalid_transition |
| failed/rejected | new draft（新intent） | UserIntentCoordinator.retry + AttemptFactory factory | 显式retry helper/Submit*Intent | ExplicitRetryInput.previousIntent关联已terminal非confirmed；当前formal retryAllowed、capability、用户明确、新draftRevision/Gate/action重新验证 | 新intentId/association独立、旧保持终态 | 新logical intent完整reservation，非重放旧unknown | access_denied/invalid_transition |

#### 非法转换与planned切口

按钮/HTTP2xx/websocket/AG-UI ACK/普通receipt、cache/fake不得confirmed；unknown不得draft/submitted重新dispatch，not_found无正式no-effect结果不能failed。terminal冲突结果拒绝，不变成第二成功；retry只新用户intent。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：双击reservation、prepare冻结、调用前后断线、普通receipt、Gate/action错配、probe not_found、formal no effect、同terminal重复/冲突、旧确认不清新稿。 optimistic是Feedback派生：submitted/pending可逆local占位；unknown显式待确认；confirmed/failed由正式result轴驱动，无第二Optimistic业务状态机。SDK.prepare/dispatch/probe exact合同未确认仍blocked。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 6.3 本族停审

draftRevision与localVersion/SDK association独立；Gate/action duplicate字段已回Step6；调用权pre-CAS且unknown绝不重发。confirmed/rejected/failed正式资格不同，失败有no-effect边界。二机不变成owner Turn/Decision状态，上游SDK/Governance正向仍blocked；进入10-D。

## 7. 10-D 来源水位、披露、连续性和本地维护

### 7.1 FreshnessMarker

主语：materials/freshness_interpreter.ts · 每safe材料/source marker；唯一enum：FreshnessState（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| fresh | formal revision+coverage均有效 | 否 | 获准显示/仍独立access |
| stale | 来源可能落后 | 否 | safe受限显示/正式refresh |
| partial | formal局部覆盖 | 否 | 显示获准部分/补读 |
| unknown | 来源水位未知 | 否 | 安全状态/正式读取 |
| expired | 安全使用期限已过 | 是，该材料版本 | 新正式材料替换 |

#### 状态转换图: 7.1 FreshnessMarker

```text
unknown -> fresh/partial (qualified source only)
fresh -> stale/partial/unknown -> expired
stale/partial/unknown -> fresh (new coverage+revision)
expired -> [new qualified material] -> fresh/partial/unknown
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | unknown/stale/partial/fresh | FreshnessInterpreter.fromRevision | Load*/ResumeChangeContext/ConsumeResumeResult | formal qualified source/context；fresh必须revisionRef/coverageRef非null并正式覆盖成立 | state/revisionRef/coverageRef/reason完整source-local | 随materials/surface/page CAS，无业务提交 | authority_missing |
| fresh | stale | FreshnessInterpreter.markStale | ConsumeMaterialRevisionChange/ConsumeShellLifecycle/RefreshStaleMaterial准备 | 已知source更新/gap或更严本地失效，旧access仍独立可验 | state stale，finite reason；保留最后正式revision仅候选 | local CAS/readonly refresh | context_changed |
| fresh/stale/unknown | partial | FreshnessInterpreter.fromRevision | Load*/ConsumeResumeResult | 正式coverage partial且current source资格，不以items数量推 | state partial、formal marker，原source隔离 | qualified CAS，无全局snapshot | authority_missing |
| fresh/stale/partial | unknown | 当前source资格失效的安全裁剪 | ConsumeFormalChange/ConsumeShellLifecycle | 无法解释当前revision/coverage，不能假stale=fresh | clear不能证明的coverage/revision，state unknown；不披露无资格内容 | 收紧local；requery资格不足blocked | invalid_transition |
| stale/partial/unknown | fresh | FreshnessInterpreter.fromRevision | Load*/RefreshStaleMaterial/ConsumeResumeResult | newformal current revision/coverage完整，current slot/source一致；resume正式feed边界 | state fresh、formal new marker，clear stale reason | qualified CAS，仅本source | authority_missing/context_changed |
| fresh/stale/partial/unknown | expired | FreshnessInterpreter.expire | ConsumeEvictionTrigger/EvictLocalMaterial/正式expiry变化 | formal expiry或local更严格期限，不按TTL生成fresh | expired，coverage清；正文/ref按披露收紧 | hide/cleanup；no owner expiry写 | invalid_input |
| expired | new fresh/partial/unknown | 新formal material factory/fromRevision | RefreshStaleMaterial/Load* | 新正式材料/新request qualification，旧expired版本不复活 | 新材料marker，对应正式source版本 | replace safe snapshot CAS | authority_missing |

#### 非法转换与planned切口

cache命中、reconnect成功、HTTP200、SDK ACK、local TTL仍有效都不能fresh；Work/Runtime源fresh不证明Process/Governance源。unknown无visibility qualification不能显示正文。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：source独立版本、partial coverage、过期preview、requery无coverage、hidden refresh迟到、缓存不fresh。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 7.2 SafeMaterialSnapshot

主语：materials/safe_material_snapshot.ts · disclosure；唯一enum：DisclosurePosture（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| visible | 正式safe材料可显示 | 否 | safe text/ref，非raw body |
| redacted | 正式adapter脱敏可显示 | 否 | 显示已脱敏tokens |
| restricted | 仅安全受限状态 | 否 | 有限reason，不subject内容 |
| unavailable | 当前无safe材料 | 否 | gap/资格获取 |
| cleared | 内容和引用已移除 | 是，此材料实例 | 新正式材料另建 |

#### 状态转换图: 7.2 SafeMaterialSnapshot

```text
[qualified safe read] -> visible/redacted
                         |       |
                         v       v
                     restricted/unavailable -> cleared
[new qualified snapshot] -> visible/redacted (not old refs revival)
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | visible/redacted | SafeMaterialFactory.fromQualified / SafeMaterialComposer.compose | LoadOwnerSummary/Load*/ConsumeFormalChange | sameowner/source/fence/current slot；formal visibility/redaction；content safe allowlist，fake隔离 | materialId local，owner/provenance/content正式safe，freshness分source | root materials/slice CAS，无body durable | unsafe_material/authority_missing |
| visible | redacted | SafeMaterialComposer.compose / Snapshot.restrict | ConsumeVisibilityChange/正式材料刷新 | 新的正式safe redaction或本地更严格裁剪，不能从原body自造所谓safe恢复 | 仅批准textTokens/references/labels，移除不获准字段 | local pure裁剪+CAS，AT同安全内容 | unsafe_material |
| visible/redacted/unavailable | restricted | SafeMaterialFactory.restrict /对应view restrict | ConsumeVisibilityChange/ConsumeShellLifecycle/EvictLocalMaterial | current安全收紧；缺访问时不保留owner label/ref等泄露信息 | content=null；subject refs/provenance按资格清；finite reason | hide先，再stop/delete | authority_missing/context_changed |
| visible/redacted/restricted | unavailable | SafeMaterialFactory.restrict /当前safe材料缺口 | Load*/RefreshStaleMaterial error | 无当前safe material或正式能力暂不可用，不存在推断 | content/ref清，safe posture unavailable | local error UI，no private body fallback | invalid_transition |
| visible/redacted/restricted/unavailable | cleared | SafeMaterialFactory.clear | ConsumeVisibilityChange/EvictLocalMaterial/ConsumeShellLifecycle | trusted current affected scope/target或local更严格清理 | ownerRef/provenance/content=null，disclosure cleared | CAS hide、后repo确认删除；memoryclear不durable证明 | context_changed |
| restricted/unavailable/cleared | new visible/redacted | SafeMaterialFactory.fromQualified新材料 | Load*/RefreshStaleMaterial | newformal registry/access/current source，不复用旧实例资格 | 新snapshot safe内容；旧cleared不复活 | qualified replace CAS | authority_missing |

#### 非法转换与planned切口

本地展开/按钮/host capability/缓存命中不能扩大disclosure；redacted只正式安全映射，不从raw source猜脱敏。cleared旧材料不可取回原text/ref。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：XSS/任意HTML/URL拒绝、hidden引用/labels清、诊断不带正文、AT无隐藏内容、图隐藏边与计数无泄露。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 7.3 ContinuityState

主语：continuity/continuity_state.ts · per-source连续性；唯一enum：ContinuityPhase（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| fresh | 正式覆盖连续 | 否 | accepted连续change |
| stale | 水位尚未确认 | 否 | formal resume/requery |
| gap | SDK明确缺口 | 否 | requery，不能单event填齐 |
| reconnecting | 技术连接恢复 | 否 | qualified resume |
| resuming | 正式恢复中/single-flight | 否 | 等待当前recovery result |
| restricted | 访问收紧 | 是，旧source语境 | 新资格newcontext |
| blocked | 缺正式能力 | 否 | contract闭合后重验 |
| needs_action | 用户/支持操作 | 否 | allowed安全选择 |

#### 状态转换图: 7.3 ContinuityState

```text
fresh -> stale/gap/reconnecting -> resuming -> fresh (coverage only)
             |                       |
             +-> blocked/restricted <-+
             +-> needs_action -> [qualified resume]
gap -X-> fresh by one event
reconnecting -X-> fresh by connection/ACK
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | blocked/stale | ContinuityFactory.initial | ResolveEntryAccess/LoadResumeContext | unbound source/null context→blocked；正式source+matched active context→stale | source/消费语境当前；cursor/revision/gap/recovery为空，nextAction requery | local source map，no feed presumedfresh | authority_missing |
| factory | stale | ContinuityFactory.fromCache | RestoreAfterShellRestart | safe缓存候选，cursor须formal rebind | stale，绝不fresh，source资格独立 | local recovery候选 | dependency_unbound |
| fresh | fresh | ContinuityFactory.accept | ConsumeFormalChange | ChangeAcceptanceRecord accepted且formal连续current source；SDK明确identity/order/coverage | lastAcceptedRevision/cursor正式更新，consumed key同source CAS | 一次root payload/cursor/consumed原子；no business command | continuity_gap |
| fresh/stale/reconnecting/resuming | gap | ContinuityFactory.markGap | ConsumeFormalChange/ConsumeResumeResult | SDK明确formal gapRef，source一致；无法descriptor则blocked | gapRef填、nextAction=requery，保留最后accepted cursor | safe state CAS，后source requery | authority_missing |
| fresh | stale | source安全失效/requery policy | ConsumeMaterialRevisionChange/ConsumeShellLifecycle | 正式source变动/更严失效，不能将其他owner新版视为本source顺序 | stale/nextAction requery；不乱移cursor | local安全收紧 | context_changed |
| fresh/stale/gap | reconnecting | ContinuityFactory.markReconnecting | ConsumeShellLifecycle | 可信offline/foreground连接恢复，无current restricted/blocked | reconnecting，保持最后cursor候选 | technicalSDK/host，无fresh声明 | invalid_transition |
| stale/gap/reconnecting/blocked/needs_action | resuming | ContinuityFactory.beginResume | ResumeChangeContext/RequeryAfterGap/AcknowledgeLocalRecoveryAction | formal capability与重新验证active context；allowed action，newrecovery source一致；同source single-flight | activeRecovery必填、phase resuming，nextAction wait | localCAS后唯一只读resume/requery | authority_missing/invalid_transition |
| resuming | fresh | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status complete且formal revision+coverage+feed boundary成立 | phase=fresh；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | stale | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status partial且有限覆盖 | phase=stale；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | gap | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status gap且formal gapRef | phase=gap；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | restricted | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status denied/正式visibility当前范围 | phase=restricted；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | blocked | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status blocked/缺contract | phase=blocked；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | needs_action | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；正式恢复无法安全继续且finite reason/用户操作要求 | phase=needs_action；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| fresh/stale/gap/reconnecting/resuming | restricted/blocked | ContinuityFactory.restrict /安全contract失效 | ConsumeVisibilityChange/ConsumeShellLifecycle | formalcurrent范围或更严contract blocked，scope revoke不依赖oldslot active | 清cursor/gap/recovery，nextAction clear/needs_action | 先hide/invalidate，后stop/delete | authority_missing |
| fresh/stale/gap/reconnecting/resuming/blocked | needs_action | ContinuityFactory.requireAction | ResumeChangeContext/RequeryAfterGap/AcknowledgeLocalRecoveryAction | 当前不能自动安全恢复，finite reason；不新增resend动作 | phase needs_action，finite safe next action | local UI/显式用户选择 | invalid_input |
| restricted/blocked/needs_action | new stale | ContinuityFactory.initial新context | ResolveEntryAccess/LoadResumeContext | newqualified current session/scope/source/visibility，旧refs已clear | 新source语境、no cursor trust，stale/requery | 新query/resume起点 | authority_missing |

#### 非法转换与planned切口

gap/reconnecting直接fresh非法；opacity cursor/revision不排序、不从arrival推丢消息。accepted单事件不覆盖历史gap，localconsumed集合不能代SDK连续性。scope revoke先hide；受限old source不能通过resume授权復活。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：duplicate/乱序/gap、partial resume、旧恢复、SDK ACK、maxConsumedChanges边界、source版本隔离、node关闭scope revoke。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 7.4 LocalProjectionEntry

主语：local_state/local_projection_repository.ts · 受限本地候选；唯一enum：LocalProjectionState（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| absent | repository无记录的synthetic结果 | 是，此读结果 | 新guarded保存另建记录 |
| cached | 合格local投影已保存 | 否 | safe load/evict |
| restored | safe候选已载入，待验证 | 否 | 正式入口查询/清理 |
| stale | 来源待重新验证 | 否 | safe恢复候选/清理 |
| restricted | 当前不可安全披露或delete未确认 | 否 | 安全清理/新资格 |
| evicting | 已隐藏并删除中 | 否 | 等delete确认，不save旧generation |
| cleared | 确认删除（限定memory facts） | 是，旧记录 | 新generation/key独立记录 |

#### 状态转换图: 7.4 LocalProjectionEntry

```text
absent -> [new guarded save] -> cached -> restored/stale
                                 |             |
                                 v             v
                              restricted -> evicting -> cleared
                                              |
                                              v
                                          restricted(delete failed)
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | absent | LocalProjectionRepository.load返回null | LoadLocalProjection/RestoreAfterShellRestart | 当前partition/key合法，本地无记录，不owner缺失 | 无实体，不创建emptypayload成功record | readonly local结果 | access_denied |
| new record/absent | cached | LocalProjectionEntry.fromRoute/fromDraft + LocalProjectionRepository.save | PersistLocalProjection | guard.canPersist允许，safe locator/schema qualified；expected=null要求不存在；fence真正save时当前 | entry key/partition/hint/payload/state cached；repo.localVersion生成 | 同JSturn memoryversion CAS/set，无durable | dependency_unbound/local_conflict |
| cached/restored/stale | cached | LocalProjectionRepository.save | PersistLocalProjection | load返回expectedVersion同entry/partition，currentfence/非evictwrite eligibility | safe payload仅批准值，version更新，cached | memory save，root不fresh | local_conflict/context_changed |
| cached/stale | restored/stale | LocalProjectionEntry.restore | RestoreAfterShellRestart | guard.canRestore及正式当前entry access；缓存仍candidate，不能fresh | restored或stale姿态，严禁恢复授权/confirmed/text durable | local受限候选，SDK resolve/probe独立 | authority_missing |
| cached/restored/stale | restricted | LocalProjectionEntry.restrict | ConsumeVisibilityChange/LoadLocalProjection/RestoreAfterShellRestart | 更严safe access/revoke/恢复未合格，当前范围 | 敏感payload/ref移除，state restricted | hide/invalidatesave资格 | context_changed |
| cached/restored/stale/restricted | evicting | LocalProjectionEntry.beginEvict | ConsumeEvictionTrigger/EvictLocalMaterial | currentreason/分区资格；先root隐藏/禁止旧pending save | payload已遮蔽，state evicting；record.deleteConfirmed=false | stop feed后versioned repo delete | access_denied |
| evicting | cleared | LocalProjectionEntry.finishEvict / CacheLifecycleRecord.finish | EvictLocalMaterial/ConsumeEvictionTrigger | DeleteResult.deleted或already_absent正式repo确认；expectedVersion配对 | payload/refs移除，record.deleteConfirmed=true、safeError=null | 本地memory删除事实，非durable/evidence | storage_unavailable |
| evicting | restricted | CacheLifecycleRecord.finish / LocalProjectionEntry.restrict | EvictLocalMaterial/ConsumeEvictionTrigger | DeleteResult.failed或localversion conflict，无法证明删除 | deleteConfirmed=false，safeError有限，保持hide | 不rollback root遮蔽；只读重查/cleanup | storage_unavailable/local_conflict |
| cleared/absent | new cached | 新generation/key guarded factory+save | PersistLocalProjection | newcurrentfence/qualification，新记录identity，不重用旧pending save | 新record版本，不恢复旧safe body | localmemoryCAS，新authority证明 | invalid_transition |

#### 非法转换与planned切口

evicting/cleared旧generation save非法；partition/key不能从ref/actor拼，ExternalHandle token/credential/previewURL/text不得序列化。storage error不cleared；保存cached不authorized/fresh。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：expected版本、跨分区、revoke后pending save、delete失败、scope sweep、null absent、durable默认off、newsession保护。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 7.5 本族停审

四state族有独立source资格/字段与version来源；fresh≠confirmed、cleared内存≠durable证明、reconnecting≠连续性恢复。scope撤销/cleanup失败和pending save防复活闭合，readonlysummary不acceptance。所有SDK/serializer/storage缺口保持blocked，进入10-E。

## 8. 10-E 宿主技术资格与生命周期消费

### 8.1 PlatformCapabilityState（每kind）

主语：platform/platform_capability_state.ts · capabilities[kind]；唯一enum：CapabilityAvailability（Step6），触发flow逐行回Step9。

| 状态 | 作用 | 是否终态 | 允许操作 |
|---|---|---|---|
| unknown | 尚未正式证明能力 | 否 | 可信host probe |
| available | 正式当前host资格可用 | 否 | 仅已批准能力 |
| restricted | 宿主策略受限 | 否 | 用户动作/重新probe |
| unavailable | 宿主不提供或缺绑定 | 否 | 等价安全显示/重验 |
| needs_action | 用户需完成宿主操作 | 否 | explicit user action后重新probe |

#### 状态转换图: 8.1 PlatformCapabilityState（每kind）

```text
unknown -> available/restricted/unavailable/needs_action
available -> restricted/unavailable/needs_action/unknown
restricted/unavailable/needs_action -> [new trusted probe] -> any current posture
host available -X-> business Access/Command confirmed
```

关键说明：图为主路径，完整合法分支以矩阵为准；新实例不复活旧generation，diagram不表达owner业务执行。

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | unknown | PlatformCapabilityState.initial | ProbePlatformCapability/Startup | approvedconfig platform，V1 desktop或web_preview，mobile_reserved拒装配 | 每capability初始unknown；无批准probe结果 | local状态，不native执行 | invalid_input |
| unknown | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |

#### 非法转换与planned切口

fake host事件/window_id文本/用户config不能available，技术能力绝不提升业务access或result。native本轮只Lifecycle/Accessibility probe；controlled_preview/safe_storage未闭合必不可用，不添加伪handler。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

planned切口：旧probe、origin/window伪造、Web preview不可native、host权限收紧、needs_action后重验、host可用仍SDKblocked。

| 停审项 | 结论 |
|---|---|
| enum/状态名/主体 | 与Step6单一定义一致；不新增全局状态 |
| trigger/条件/字段 | 方法回Step6、flow回Step9，字段来自正式typed输入/当前root或repository version |
| 非法/副作用/切口 | 错误不推进状态；local CAS与SDK side effect分界明确；验证仅planned |
| 上游/证据 | pass_with_upstream_blockers，未实现/执行测试/验收，不产生readiness |

### 8.2 ShellLifecyclePosture消费覆盖（不是自主业务状态机）

通知来自可信hostBinding/current sessionEpoch/generation，PlatformCapabilityState.applyLifecycle(state,event)只记录技术posture；ShellLifecycleCoordinator.consume按Step9继续安全动作。任何通知不可代表owner取消/提交/恢复成功。

| 可信posture | 输入全部字段 | 当前local字段/动作 | SDK/host作用 | 禁止推断 |
|---|---|---|---|---|
| foreground | hostBindingRef/sessionEpoch/generation/posture | 重新probe/入口access验证，sources仍stale/reconnecting | SDK正式resume/requery只读，AT回safe main | foreground≠fresh/authorized |
| background | 同上 | current sources stale，可能已dispatch非terminal保守unknown | 正式能力允许的stop/pause，不业务重发 | 后台通知≠owner failed/cancelled |
| offline | 同上 | source reconnecting/gap保留，attempt unknown风险明确 | 无未知业务重送；只有正式probe/read恢复 | offline≠no effect |
| restarting | 同上 | 旧fence/consumer slots失效、敏感memory清，缓存仅候选 | 新入口resolve/locator rebind缺能力blocked | restart≠恢复旧权限或confirmed |
| closing | 同上 | 先hide/invalidate，清UI/host订阅/敏感内存 | stopAll/允许local cleanup；no owner cancel | close≠durable saved/deleted/evidence |

相同generation重复通知no-op或重复safe cleanup，不新增SDK业务调用；旧session/host事件ignored。unknown通知类型unsupported_material，失效不扩大权限。五通知完整消费覆盖，CapabilityAvailability每kind独立机器，技术生命周期不合入Command/Continuity。全部planned切口与host集成blocked。

### 8.3 本族停审

每PlatformCapabilityKind有独立CapabilityAvailability，五host通知完整消费但不虚造owner取消/恢复。native请求仍最小probe，safe_storage/controlled_preview正向blocked；host事件来源资格不由window文本赋予。planned host/AT切口尚未执行，进入10-F设计审计。

## 9. 10-F 跨状态机与逐接口闭环审计

### 9.1 canonical enum与主体数量

| canonical enum | 对象主体/实例 | 数量 | 来源 |
|---|---|---|---|
| RoutePhase | RouteContext | 1 | Step6 §4.1 |
| AccessAvailability | route与各独立section AccessPosture（同契约、多实例） | 1主体族 | Step6 §4.2 |
| ConsumptionContextPosture | 每source/query/section consumer slot | 1主体族 | Step6 §4.5 |
| SelectionPhase | SelectionState、ProjectNavigationState | 2 | Step6 §5.1/5.8 |
| PageLoadPosture | ProjectDetail、ProcessFlow、NodeDetail、ProjectConversationLink、CompanyDirectory | 5 | Step6 §5.7/5.9～13/20.5 |
| DraftPhase | DraftState | 1 | Step6 §6.1 |
| CommandResultPosture | CommandAttemptState | 1 | Step6 §6.2/17 |
| FreshnessState | 每source FreshnessMarker | 1主体族 | Step6 §3.3 |
| DisclosurePosture | SafeMaterialSnapshot | 1 | Step6 §3.4 |
| ContinuityPhase | 单source ContinuityState | 1主体族 | Step6 §7.1/18 |
| LocalProjectionState | LocalProjectionEntry、CacheLifecycleRecord派生 | 1主体族 | Step6 §8.3～6 |
| CapabilityAvailability | 每host kind capability | 1主体族 | Step6 §10.1/19 |
| 合计 | 12 enum、17独立local主体契约 | 17 | 非owner机器/全局机器 |

所有模型多实例不等于新canonical enum。ProjectNavigation只有选择状态，无PageLoad；shell/receipt/probe/diagnostic分类不计持续状态机。

### 9.2 Step9全43入口的状态读取/触发覆盖

| 协议组（每项已有独立flow） | 本Step矩阵承接 |
|---|---|
| SubmitConversationIntent、SubmitGovernanceIntent | §6 Draft/Command；§4 Access/Consumption；optimistic仅Feedback派生 |
| RequestSafePreview、LoadArtifactPreview | §4 Access/Consumption；§7 Freshness/Disclosure；§8host可打开资格，不新增preview业务命令状态 |
| AcknowledgeLocalRecoveryAction | §7 Continuity/Projection；§6 unknown只probe；local动作不业务提交 |
| ResolveEntryAccess | §4 Route/Access/Consumption；§5 safe selection候选 |
| LoadConversationSurface、LoadTurnPage | §4 Consumption/Access；§5 Selection；§7 Freshness/Disclosure/Continuity |
| LoadOwnerSummary、LoadMemberContext | §7 Freshness/Disclosure分source；§4独立Access/Consumption |
| LoadIntentCapability | §4Access/Consumption；结果能力snapshot非独立机器 |
| ProbeCommandAttempt、ResolveUnknownAttempt | §6Command，只formal gate收敛unknown |
| LoadResumeContext、ResumeChangeContext、RequeryAfterGap | §7Continuity/currentsource coverage；不将连接/ACK变fresh |
| LoadLocalProjection、LoadDraft | §7Projection/§6Draft只读；cache不access，null不owner缺失 |
| ProbePlatformCapability、LoadAccessibilityContext | §8Capability、§5Focus/Selection/派生AT，业务权限不升级 |
| LoadProjectList | Work safe page/Access/Freshness；列表无Project truth机 |
| LoadProjectDetail | §5.3PageLoad，各source marker/Access独立 |
| LoadProjectProcessFlow、LoadStageProcessFlow | §5.4PageLoad/§5.2Selection/§4Consumption，正式Process状态只读 |
| LoadProcessNodeDetail | §5.5PageLoad/§5.2Selection/section独立Disclosure/Consumption |
| LoadProjectConversationLinks | §5.6PageLoad，关系/targets access独立，不binding truth机 |
| LoadCompanyDirectory、UpdateDirectorySearch | §5.7PageLoad与query/page generation隔离，不目录truth机 |
| ConsumeFormalChange、ConsumeMaterialRevisionChange | §7 source continuity/freshness + 对应page模型/§4Consumption |
| ConsumeCommandReceiptOrResult | §6唯一Command result轴；同revision清draft |
| ConsumeResumeResult | §7Continuity formal coverage/gap，原incoming全部slots |
| ConsumeVisibilityChange | §4收紧/消费失效；§5选择/页面清；§7披露/Projection清理 |
| ConsumeShellLifecycle | §8通知消费；§7source stale/reconnect、§6unknown，不owner cancel |
| ConsumeEvictionTrigger、EvictLocalMaterial | §7Projection，hide先于stop/delete，失败restricted |
| ClientDiagnosticHandoffRequested、ClientSupportContextRequested、EmitDiagnosticHandoff | 低敏一次交付结果，无业务状态机；disabled不IO、unknown不重送 |
| RefreshStaleMaterial | §7正式新材料freshness，Access撤销优先 |
| RestoreAfterShellRestart | §4Route/§7Projection/Continuity，旧confirmed/access不可恢复 |
| PersistLocalProjection | §7versioned local record，currentfence/partition save，不ownertruth |
| NavigateProjectContext | §5.2局部选择/五tab；stage/node独立read，无顶层progress |

### 9.3 名称、字段、trigger和非法转换审计

| 审计项 | 结论/修正 |
|---|---|
| 状态集合 | 与Step6 12canonical enum逐字一致；每机全状态/初始/终态/矩阵/非法/切口完整 |
| 状态主语 | 只17local主体，五page独立；ownertruth/DTO/诊断receipt/计数器已筛除 |
| 字段来源 | 当前root版本、正式request槽位、SDK资格/来源、repo版本、typed Input；无自然语言未知字段补造 |
| trigger完整 | 本机factory/成员回Step6，protocol flow回Step9；缺函数已原位补markUnavailable/releaseSubmission/五failLoad |
| cleared含义 | route/consumer/selection/disclosure旧实例终止；Draft旧revisionclear后显式newrevision可edit；Projection只确认memorydelete，非durable证明 |
| failed/unknown | failed必须pre-dispatch无effect或formal no-effect；unknown无自动retry；not_found不failed |
| fresh/ready/resolved/available/confirmed | 分别source coverage、当前page加载、入口定位、read/host能力（不同enum）、正式业务提交，不互推 |
| source/父版本/搜索 | 独立来源、parentRevision与请求代次/current slot同时校验，不跨owner原子snapshot |
| 幂等/重入 | command预留dispatch权一次；terminal同正式结果no-op；source duplicate不乱移cursor；save oldfence禁止 |
| 撤销/cleanup | 正式scope收紧覆盖已关闭node，registry/slot/hide先于stop/delete，failure不rollback安全 |
| 图/列表/AT | 同safe topology/版本/选择；没有hiddenlabel/count/edge泄露，Gateway不等Gate，不补XML |
| backend副作用 | 无truth/UoW/outbox/bus/audit/history；SDK实际业务effect仅Submit一次dispatch，结果正式gate |
| reserved/phase | Mobile、native受控preview、安全durable、未闭合SDK/provider能力不绑定；没有reserved状态被伪current实现 |
| 测试/验收名 | planned使用本Step精确enum；只引用真实AC-NFR001～007/NFR001～024/AC-FR011～014，不借未定义AC-NFR008～024 |
| 证据 | 全部planned contracts/切口，未build/run/test/commit/evidence/verdict/readiness；外部blocked不能用fake补成完成 |

### 9.4 诊断、修复、回填与停止点

诊断：没有主体筛选会混入owner业务状态和DTO分类，通用矩阵无法证明每page/父版本/来源/非法行为。修正：先筛17主体、12enum，逐机集合/ASCII图/每转换字段/副作用/非法错误/切口，再覆盖全部43flow；反向缺口在Step6～9原位补齐。取舍：local保守unknown、visibility fail-closed、source独立，不用流程图/普通ACK/界面状态推owner事实。

回填草稿：§4～8逐机矩阵及§9审计，供未来正式03 §9与测试/实施承接。当前只通过本地设计门禁，gate_status=pass_with_upstream_blockers；CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、host/storage/config/quality仍open/blocked。Step11～19 not_authorized，04～07 waiting，正式03保持historical_material。

**本轮授权Step5～10至此完成并停审。** 下一动作只有用户审阅这些中间产物；后续如获授权，先读项目台账/03flow/Step10及SOP Step11、书写规范5.10、Governance Step11，再讨论本地持久化与一致性（默认memory，不伪durable）。不跨文档、不创建implementation ledger/boundary skeleton（仅正式07完成时）、不实现、不运行测试、不提交commit。

### 9.5 本轮静态文档核对范围

只对本轮Step6～10/03flow/项目台账进行Markdown围栏、表格列数、schema单一定义、43协议↔43flow、17主体↔17图、状态/方法名/字段来源及停止点核对；这不是应用测试、编译或SDK集成验证。真实SDK eventClient两generic unknown方法仍throw host runtime wiring，positive bindings维持blocked；正式03无本轮写入。

仓级git diff --check同时报告前轮00/01头部Markdown硬换行空格；不改已停审00/01，不将此既有格式现象作为本轮设计或运行证据。未触碰其他项目的已有工作树变化。用户只需审阅Step5～10校准材料；Step11以后等待授权。
