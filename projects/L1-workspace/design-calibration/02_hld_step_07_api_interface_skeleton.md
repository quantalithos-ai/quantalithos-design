# Step 7. 接口骨架

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 6；01 §10；上游接缝；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先分类与上下文，再CP1→CP7逐个对象能力与接口表，最后分类索引/历史差异/跨接口审计
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 6；01 §10；上游接缝；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. Command仅建立workspace分区与改局部用户意图，不写源域。
2. Query读取已提交局部状态或显式临时source聚合，全程no-write。
3. Inbound消费六L1的正式变化/撤销；事件身份和cursor规则需owner证明。
4. 本轮没有已授权workspace outbound family，明确not_applicable，不建Outbox。
5. refresh/rebuild/invalidate是Operations；查询不能代发。
6. Command需要ActorContext、CommandMetadata、幂等语境和预期本地版本（建立分区用唯一范围）。
7. Query需要ActorContext与查询语境；分页token不认证。
8. Consumer需要可信来源、event identity、schema、stream/版本/接续证据。
9~11. 按CP1~7审查归属及对象能力；内部协作单列，不当公开API。CP4纯派生没有独立外部写入口。

## 4. 当前文档问题诊断

Step6暴露Provision尚无partition ID、Gap/Blocked不占终局记录、安全失败不得携带scope、generation安全分轴等约束。若只列CRUD，会把只读查询变成隐式初始化或维护入口。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为接口骨架，不补上游schema |

## 6. 设计取舍

采用Command/Query/Inbound/Operations四个有效类别；Outbound显式不适用。内部port只列方向和能力，不定义trait或外部schema。接口锁本地名称和责任，不宣称上游同名API存在。

## 7. 结构化中间产物

### 7.1 分类与共享上下文

| 类别 | 上下文骨架 | 允许效果 | 明确禁止 |
|---|---|---|---|
| Command | ActorContext、CommandMetadata、IdempotencyKey、目标及预期本地版本 | 分区/局部意图与操作结果原子提交 | 上游业务命令、隐式刷新 |
| Query | ActorContext、QueryMetadata、ScopeSelector、读取/分页语境 | 只读局部状态或owner安全查询 | 创建分区、保存聚合结果、标已读、调度维护 |
| Inbound Event Consumer | 正式可信envelope、owner/stream/source identity、schema与版本/接续证明 | 局部投影、coverage、应用或失效记录 | 源truth、bus delivery/ack决定 |
| Operations Job | MaintenanceContext、显式维护意图、操作键、既有目标、预期版本 | attempt/candidate/失效与原子cutover | 代替用户意图、重置local overlay |
| Outbound Event | not_applicable | 无当前正式workspace输出事件族 | 不因参考仓有Outbox便复制 |

ActorContext/元数据为语义槽位，Core exact字段须WS-UP-007核验。局部键、操作类型和外部event身份分别命名；不得假定相同结构。

### 7.2 逐组成部分接口校准

### CP1 分区与范围

#### 问题与依据

来源：Step5 CP1、Step6 WorkspacePartition/WorkspaceScope、01 §9.1/10.1。

解析只向owning domain读取；Provision需要显式创建权限与局部唯一性。Personal/Project选择不是两套创建生命周期。

#### 诊断与取舍

不能向外暴露resolve(scope)后直接保存任意anchor；并发Provision要在无partition id时仍有稳定幂等键。

采用：一个正式Command ProvisionWorkspacePartition，ScopeService仅内部只读协作；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

##### Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| ProvisionWorkspacePartition | ActorContext、CommandMetadata、IdempotencyKey、ScopeSelector | PartitionCommandResult或安全拒绝 | ScopeService经ScopeResolverPort解析并核验创建权限；PartitionService按principal/scope唯一建立 | WorkspacePartition与WorkspaceOperationRecord同事务；可初始化明确空LocalAttentionState，不创建projection |

##### 内部协作（非公开API）

| 主体 | 输入/输出骨架 | 边界 |
|---|---|---|
| ScopeService / ScopeResolverPort | ActorContext + ScopeSelector → WorkspaceScope或安全失败 | 正式owner读取；不从partition id推断，WS-UP-005开放 |

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。建立与解析分离；对象均在Step6；未知提交按操作键核对，未建立时不依赖partition id。Step8须独立展开Provision。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP2 安全来源消费

#### 问题与依据

来源：Step6 SourceSlice/VisibilityBinding、01 §10.1、WS-UP-001/003。

CP2是否需要公开safe-source API？否；它为查询、应用和恢复提供内部正式读取及决定校验。每源适用性独立，不把governance当统一授权者。

#### 诊断与取舍

若把适配成功当安全，原始owner response会穿透到projection；单个缓存allow也无法解释撤销与版本绑定。

采用：保留SourceReadService、OwnerSourcePort、VisibilityResolverPort内部协作表，无独立Command/Query入口；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 主体/类别 | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| SourceReadService / 内部只读协作 | ActorContext、WorkspaceScope、SourceReadSelection、正式决定语境 | SourceSlice或安全失败分类 | OwnerSourcePort与VisibilityResolverPort | 不持久化快照；写入只能交CP3/CP6显式路径 |
| OwnerSourcePort / runtime读取边界 | 已解析scope、获准source selection、版本要求 | OwnerSafeReadResult语义槽位 | identity/conversation/work/process/governance/artifact owning query | 正式schema与coverage仍WS-UP-001；未知字段不透传 |
| VisibilityResolverPort / runtime决定消费 | ActorContext、scope、source subject/version、输出范围 | OwnerVisibilityResolution → VisibilityBinding或fail-closed | 各owning chain正式决定 | 003缺口时禁止生成allow；无authorization command |

本部分无独立公开API、consumer或job；被CP3/6/7调用不改变其只读性质。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。两对象均有来源；无新授权truth或公开helper。Step8由调用部分标出本接缝。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP3 连续投影

#### 问题与依据

来源：Step6三个CP3对象、01 §9.3、02 Step5 CP3；上游事件接缝WS-UP-002。

进入投影的是正式event input；来源schema、identity、version与接续证明须先核验。相同输入可重复，但不同owner或generation不能共享裸事件键。

#### 诊断与取舍

若每个来源草拟一个推测event family会越权补上游；若Gap写成永久终局结果，补齐后无法恢复。

采用：一个本地ConsumeSourceChange用例，六来源映射待正式合同逐项闭合；事件处理结果不当bus ack；baseline复用内部ProjectionApplyService；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

##### Inbound Event Consumer

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| ConsumeSourceChange | 六L1 owner经L0-bus正式事件；逐源绑定pending | TrustedSourceEnvelope、SourceIdentity、SourceVersionBasis、SourceCursorBasis、目标已有partition/generation | ApplyResult；Applied时PartitionProjection/InboxItem/SourceCoverage/SourceApplicationRecord原子提交 | 同键同digest读原结果；异digest冲突；Gap/Blocked不占终局键；不推进bus delivery truth |

| 内部协作 | 输入/输出 | 对象能力及约束 |
|---|---|---|
| ProjectionApplyService | 经CP1/2核验输入 + TargetGeneration → ApplyResult | apply/assert_generation；CP4派生同事务；不能按接收时间覆盖新版本 |
| WorkspaceStorePort | 分区原子应用集合/安全只读lookup → committed result或unknown | 原子结果与cursor/coverage一体；缺口诊断可单独提交但不推进消费位置；unknown先核对 |

Consumer名称是本地用例，不是owner event type。用户请求或重放不能自行指定任意candidate；目标路由需CP6已持久化维护依据。来源不可验证时不写受影响状态。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。对象及终局语义与Step6一致；Step8独立画消费流程。基线应用为CP6内部调用，不另设伪公开Apply API。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP4 Inbox投影

#### 问题与依据

来源：Step5 CP4、Step6 InboxItem；WS-UP-004。

Inbox由明示attention派生，是否允许单独CreateInboxItem？不允许；条目id跨generation稳定，来源生命周期由owner决定。

#### 诊断与取舍

独立consumer和CP3同时写条目会拆开应用与cursor事务；hide/unread放在本部分会重建丢意图。

采用：仅内部InboxProjector，通过CP3原子应用或CP6基线构建进入；公开读取归CP7，local动作归CP5；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 内部接口骨架 | 输入骨架 | 输出骨架 | 状态效果 | 边界 |
|---|---|---|---|---|
| InboxProjector / derive与apply_attention | WorkspacePartitionId、GenerationId、OwnerAttentionInput、ApplicationResultRef | InboxItem变更集合或不可派生分类 | 在CP3/CP6事务内写Present/Withdrawn派生条目 | 不单独提交、不自造attention、不调用上游通知或receipt |

无独立Command、Query、Consumer或Job。CP3 ConsumeSourceChange及CP6重建处理流承接本能力；CP7 ListWorkspaceInbox只读。WS-UP-004未闭合时不从普通业务事件推断待办。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。本部分无孤儿API；InboxItem的Present/Withdrawn与局部read/hide分离。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP5 局部注意力

#### 问题与依据

来源：Step6 LocalAttentionState/ReadCursor/WorkspaceOperationRecord、00 FR-WS-007/008、01 §9.3。

局部read/unread、pin/mute/hide、preference/focus/last-opened都需显式命令；结果读回必须重新裁剪。

#### 诊断与取舍

若把last-opened放Query或把MarkRead同步为conversation receipt，会违反no-write与owner边界；一个任意JSON patch易接受未归属字段。

采用：一个typed ChangeWorkspaceLocalState Command承接既有LocalAttentionChange受控变体；ReadIntent为其中子类，结果查询归CP7；不引入任意字段patch；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

##### Command API

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| ChangeWorkspaceLocalState | ActorContext、CommandMetadata、IdempotencyKey、WorkspaceScope/partition、LocalAttentionChange、LocalReadBasis expected | LocalStateCommandResult或冲突/安全拒绝 | LocalAttentionService核验actor/scope/目标可见性；同键结果核对；按expected版本应用受控变体 | LocalAttentionState、ReadCursor与WorkspaceOperationRecord同事务；不写source/projection/generation |

| 受控变体组 | 能力 | 限制 |
|---|---|---|
| ReadIntent | Advance/MarkUnread | 稳定attention ref/version；不可比较时不猜已读，不用source cursor |
| LocalDisposition | pin/mute/hide的显式设定或清除 | 只在workspace范围改变排列/隐藏，不扩大owner可见性 |
| WorkspacePreference | 受控呈现偏好 | 不是policy/authorization规则；字段全集留03 |
| LastOpened / Focus | 显式设置或清除已解析subject ref | 不是runtime context，不从GET隐式更新 |

Absent expected仅用于已有partition首次显式local command初始化；并发另一命令建立后必须冲突，不把Absent当任意版本。修改read intent即使不能立即映射新generation，也保留可解释的Unknown派生。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。命令覆盖Step5局部capability；无任意JSON patch，无跨域副作用；Step8须独立展开；GetWorkspaceOperationResult由CP7承接共享结果。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP6 失效与重建

#### 问题与依据

来源：Step6 RebuildAttempt/GenerationState/InvalidationRecord、01 §9.3/9.4、WS-UP-001/002/003。

维护接受与执行进度要区分；用户或运维显式请求创建attempt，后续worker按已持久意图推进。失败重试是新attempt，不是Query激活旧任务。

#### 诊断与取舍

一个Refresh接口若既取baseline又直接覆写current，无法解释中断与cutover；撤销若等待完整重建，旧页仍可能泄露。

采用：RequestWorkspaceRecovery与AdvanceWorkspaceRecovery两维护入口；InvalidateWorkspaceView显式维护及ConsumeSourceInvalidation正式事件入口共用失效内核；必要时SupersedeWorkspaceRecovery显式替代非终态attempt；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

##### Operations Job

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| RequestWorkspaceRecovery | MaintenanceContext、显式RecoveryIntent(Refresh/Rebuild)、操作键、既有partition、expected PartitionVersion | RecoveryRequestResult；同事务创建RebuildAttempt、Candidate+Unverified GenerationState及WorkspaceOperationRecord | 只是接受维护，不等于baseline/replay/cutover完成；缺权限不创建 |
| AdvanceWorkspaceRecovery | 受控worker、持久RebuildAttempt、expected AttemptVersion、正式baseline/接续能力 | RecoveryProgressResult；candidate应用进度或Blocked/Failed；最终可原子Completed | 只推进已有意图；每源证明不足不切换；不覆盖local overlay；unknown先查结果 |
| SupersedeWorkspaceRecovery | MaintenanceContext、旧attempt、已获准replacement attempt ref、expected AttemptVersion、操作键 | RecoverySupersedeResult；旧非终态Superseded及操作结果 | replacement必须同分区正式存在；阻止旧worker提交；不复活Blocked/Failed |
| InvalidateWorkspaceView | MaintenanceContext、已有target selection、正式或获准局部InvalidationBasis、操作键 | InvalidationResult；InvalidationRecord及覆盖目标的局部失效 | DataStale不能冒充owner删除；SafetyBlocked作用所有关联generation，不等重建 |

##### Inbound Event Consumer

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| ConsumeSourceInvalidation | 正式owning domain撤销/失效事件，经获准bus协作 | TrustedSourceEnvelope、SourceIdentity、正式影响范围/版本/决定失效依据 | InvalidationResult与系统命名空间操作结果；关联coverage/generation安全失效 | 不从timeout生成tombstone，不用旧allow恢复；跨分区传播不宣称全局原子，查询仍现时核验决定 |

| 内部port | 输入/输出骨架 | 责任边界 |
|---|---|---|
| RecoverySourcePort | 已解析scope + source selection + baseline/续接请求 → OwnerBaselineBasis及安全输入 | owner baseline与正式接续，不是旧projection/SDK/archive；bus replay preparation不是executor |
| WorkspaceStorePort（复用） | candidate/attempt版本/coverage/切换或失效变更 → 局部原子结果 | current指针与generation角色、attempt结果同分区提交；所有安全栅栏留03闭合 |

缺口事件若没有正式失效依据，由CP3只记coverage诊断；不能路由为owner撤销。普通变化与明确失效使用不同consumer语义，不双重计作同一投影效果。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。五个入口均回指Step6维护对象，普通变化归CP3。cutover是Advance内部受控阶段，非任意公开Promote API。Step8分别展开。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP7 读取与交接

#### 问题与依据

来源：Step6 WorkspaceReadView/WorkspacePageCursor、安全失败DTO；01 §10.1/10.2，00 FR-WS-001/005/006/007/010。

Personal/Project是否独立生命周期？否，GetWorkspaceView显式scope分支。读取物化与临时聚合需显式模式；后者不发durable revision。Inbox、局部状态、操作及恢复结果读取都需现时可见性。

#### 诊断与取舍

把export作为job会产生未授权handoff truth；GetOperationResult若返回旧完整成功结果，可绕过最新撤销；页游标不应跨view/local版本继续。

采用：按六个正式Query提供受控read surface；GetWorkspaceView内显式Materialized/Transient模式；ExportWorkspaceReadModel只读且受WS-UP-006约束；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

##### Query API

所有行必须携带ActorContext、QueryMetadata与显式scope/目标；表中省略的共享项不表示可匿名调用。

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| GetWorkspaceView | ScopeSelector、ReadMode(Materialized/Transient)、SourceReadSelection、QueryBinding、可选WorkspacePageCursor | WorkspaceQueryResult：View或SafeReadFailure | Materialized读取同generation/revision/local语境；Transient经CP2读owner安全来源 | 无partition/projection不补建；Transient无durable revision与物化游标，不自动fallback |
| ListWorkspaceInbox | ScopeSelector、InboxSelection、QueryBinding、可选WorkspacePageCursor | 安全Inbox page或SafeReadFailure | 同语境InboxItem及LocalAttentionState/ReadCursor | 可见性先于过滤计数；Unknown不猜已读；不因列表读取更新read cursor |
| GetWorkspaceLocalState | ScopeSelector、LocalStateSelection | SafeLocalStateView或安全缺失/拒绝 | LocalAttentionState及目标ref当前决定 | 缺失返回Absent，不创建；focus/last-opened也裁剪 |
| GetWorkspaceOperationResult | ScopeSelector、OperationLookup（操作ref或原scope/操作键） | SafeOperationResult或安全NotAvailable | WorkspaceOperationRecord的已提交结果 | 无记录不证明rollback；现时权限不足不透露原操作目标；不重放效果 |
| GetWorkspaceRecoveryStatus | ScopeSelector、RebuildAttemptId或受控当前维护选择 | SafeRecoveryStatus或安全失败 | RebuildAttempt、GenerationState、SourceCoverage、InvalidationRecord | 不调度/重试；blocked细节、source refs也受裁剪 |
| ExportWorkspaceReadModel | ScopeSelector、ExportSelection、稳定读取语境/可选page cursor | SafeReadExportPage或SafeReadFailure | 复用已提交WorkspaceReadView安全内容与来源语境 | no-write；不创建snapshot/attempt，不承诺archive accepted/frozen；006未闭合不能声明外部协议可用 |

所有查询响应DTO只有接口责任，无新领域生命周期。物化多页若绑定的generation、view/local版本、权限语境不再可服务，显式要求重新读取，不静默跨页换语境。具体schema/error/code/认证方式留03。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。六查询覆盖Step5读capability，无Query写路径、无Outbox或下游写adapter。scope未解析时安全失败不带scope/ref/count/provenance。Step8为裁剪/缺失/分页/结果核对分别给流程。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### 7.3 分类、对象与处理流覆盖审计

| 归属 | 正式入口 | Step8承接 | 本步检查 |
|---|---|---|---|
| CP1 | ProvisionWorkspacePartition | 独立Command流 | 分区唯一性、创建权限、无ID时幂等 |
| CP2 | 无独立外部入口；SourceReadService/两resolver-source port | CP3/6/7中的只读接缝 | 不造owner API、不持久化查询 |
| CP3 | ConsumeSourceChange | 独立Consumer流 | 终局记录、版本/coverage、重复与未知提交 |
| CP4 | 无独立外部入口；InboxProjector | CP3/6原子派生 | 不遗漏对象能力，不拆事务 |
| CP5 | ChangeWorkspaceLocalState | 独立Command流 | 受控变体、local版本、三值read |
| CP6 | Request/Advance/SupersedeWorkspaceRecovery、InvalidateWorkspaceView、ConsumeSourceInvalidation | 四Job与一Consumer独立流 | candidate/cutover、撤销、旧worker禁止提交 |
| CP7 | 六Query（见本部分完整名称） | 六独立安全读流程；GetWorkspaceView包含两个显式模式 | no-write、缺失不等空、当前授权、页绑定、export非archive |

本Step共14个正式用例入口：2 Command、6 Query、2 Inbound、4 Operations；Outbound为not_applicable。内部service/port/derive不计公开入口；无新增业务owner。

### 7.4 后置历史差异

| 旧位置 | 旧口径 | 当前判断/影响 |
|---|---|---|
| draft/03 §5 | 泛化query/event/local command seam | 修改为本Step具名入口；无HTTP/schema承诺 |
| draft/03 §4.3 | export/local handoff attempt可能持久化 | 废弃写路径；ExportWorkspaceReadModel只读，未闭合archive接缝仍blocked |
| draft/03 §3.1 | RefreshAttempt与RebuildAttempt并列候选 | 合并为RebuildAttempt+RecoveryMode；不重复生命周期 |
| governance参考Step7 outbound/trace/export job | 治理事实输出与handoff marker | 不继承；workspace无已授权outbound family/归档写状态 |

## 8. 回填草稿

正式§7摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

静态审计：14入口的对象归属、读写类别、共享上下文、结果核对、正式owner输入、无Outbox与no-write均有显式承接；owner exact协议仍blocked，未写HTTP/schema/trait实现。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 8。
