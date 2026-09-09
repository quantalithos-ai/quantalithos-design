# Step 9. 状态机

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 8；Step 6/7；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先状态主语筛选，再CP1~7逐组定义/允许禁止/图与传播；最后跨状态触发覆盖审计
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 8；Step 6/7；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1~2. 正式状态只来自Step6：SourceCoverage、InboxItem、RebuildAttempt、GenerationState；SourceApplicationRecord是不可变终局标签，ReadCursor是意图与三值派生，ReadView是响应多轴。
3. 触发来自Step7/8的Command、Consumer、Operations；Query只算响应不写状态。
4. 允许迁移需正式来源/版本/覆盖或显式操作；禁止缺口跨越、旧allow复活、终态自动重试。
5. 状态影响局部投影/读姿态；无workspace Outbox，不能把传播写成bus或archive truth。
6~9. 按CP1→7审查，无状态对象明确不适用；状态名重复必须带对象/轴，不合并成全局状态。

## 4. 当前文档问题诊断

Step6对象卡片只列集合，尚未规定Gap何时恢复、Withdrawn能否重新出现、Ready被并发变化推翻后的处理。直接画统一workspace状态机会混淆角色/安全/数据/用户意图。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为状态机，不补上游schema |

## 6. 设计取舍

采用对象归属及状态轴分离；同名Blocked只在其对象语境解释。安全失效终止原generation服务，经新candidate恢复；迟到/重复属于输入判定而非投影生命周期。所有未来完整状态矩阵/错误处理留03，概要迁移必须足以判断主线。

## 7. 结构化中间产物

### 7.1 状态主语筛选

| CP | 主语 | 状态性质 | 触发来源 |
|---|---|---|---|
| CP1 | WorkspacePartition/WorkspaceScope | 无独立业务状态机；分区是否物化由current_generation表示 | Provision或CP6切换；owner scope状态不属本地 |
| CP2 | SourceSlice/VisibilityBinding | 不可变快照/引用，无本地授权生命周期 | 正式owner决定的读取消费 |
| CP3 | SourceCoverage；SourceApplicationRecord | coverage可迁移；应用记录终局不可变 | ConsumeSourceChange、AdvanceWorkspaceRecovery、失效入口 |
| CP4 | InboxItem | owner驱动派生生命周期 | CP3/CP6中的InboxProjector |
| CP5 | LocalAttentionState/ReadCursor/WorkspaceOperationRecord | 局部版本与意图变化；三值派生/不可变结果，不造业务生命周期 | ChangeWorkspaceLocalState；只读结果查询 |
| CP6 | RebuildAttempt/GenerationState/InvalidationRecord | attempt生命周期；generation角色与安全轴；失效记录不可变 | 四Job与ConsumeSourceInvalidation |
| CP7 | WorkspaceReadView/WorkspacePageCursor | 按请求派生姿态/读取语境，无持久状态迁移 | 六Query |

### CP1 范围与分区无独立业务状态机

#### 问题与依据

来源：Step6两CP1对象、Step8 Provision及cutover。

partition未物化不是实体Draft，scope verified也不是本地membership事实。

#### 诊断与取舍

历史候选把unresolved/verified/revoked写进scope对象，容易让本地状态代替正式resolver。

采用：不建立业务enum；明确分区建立/当前指针以及owner范围的区别；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 项 | 允许变化/来源 | 禁止 |
|---|---|---|
| 分区存在性 | Provision显式原子建立，重复返回既有身份 | Query建立或复制project/member生命周期 |
| current_generation为空 | 尚无物化结果；由CP6完成cutover后变为当前指针 | 将空指针当Complete empty |
| WorkspaceScope | 每次正式解析得到不可变范围值；变化重新核验 | 本地Verified/Revoked状态代替owner决定 |

本部分无独立状态机，不画状态图；CP6承载generation迁移，CP7只读派生缺失姿态。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。状态源归属清楚，没有为值对象造状态；后续触发对应已有入口。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP2 来源快照与决定引用

#### 问题与依据

来源：Step6 SourceSlice/VisibilityBinding；Step8 CP2。

缓存快照可以保留旧数据，但决定当前是否仍适用要重新取得正式证明。

#### 诊断与取舍

若把call timeout持久化为owner Invalid，或让binding从Denied自行转Allowed，会越权生成授权truth。

采用：两对象不迁移；失败分类由读/维护调用方承接，已知正式失效由CP6记录；不造授权enum；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 对象/输入情形 | 处理 | 状态owner | 禁止迁移 |
|---|---|---|---|
| SourceSlice | 不可变安全快照；新正式输入形成新快照并经CP3应用 | 源truth在owner；本地coverage在CP3 | 不把网络timeout转成source deletion |
| VisibilityBinding | 只引用现时有效性证明；不适用则拒绝当前消费 | owning authorization chain | 不在workspace把Denied/Unknown转Allowed |
| 正式撤销 | 交ConsumeSourceInvalidation及CP6局部失效记录 | owner决定 + workspace局部安全效果 | 不等待下一次数据刷新才阻止泄露 |

无独立状态机，不画状态图；binding不是永久允许令牌；empty list仍需要正式访问语境。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。CP2既无持久化授权状态又保留明确fail-closed出口，与Step8调用流一致。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP3 来源覆盖与终局应用

#### 问题与依据

来源：Step6 SourceCoverage与SourceApplicationRecord；Step8 ConsumeSourceChange/AdvanceWorkspaceRecovery。

coverage可从Unknown到Partial/Complete；Gap需正式续接证明解除；Invalidated不在旧generation原地复活。终局记录Applied/LateIgnored不迁移。

#### 诊断与取舍

Complete容易被空页或最大cursor误触发；Gap若只看新数据到达即清除仍可能漏事件。迟到忽略不等消费位置可任意跳跃。

采用：覆盖状态逐源解释，保持最后安全cursor；重新完整证明可恢复Gap；安全失效仅新candidate重建。Duplicate/Conflict/Blocked为返回分支而非终局对象状态；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Unknown | 当前源覆盖尚未证明 | 受限 | 不能宣称空或complete |
| Partial | 仅部分已知范围可证明 | 受限 | 安全内容可读，但不能承诺总体count |
| Complete | 声明范围有正式覆盖/接续证明 | 是，仍需安全判断 | 不是六域全局同时最新 |
| Gap | 连续性缺失或比较不可证明 | 受限 | 不越过缺口推进消费位置 |
| Invalidated | 正式安全失效阻断旧覆盖 | 否 | 在新candidate重建证明，不原地恢复 |

#### 状态流转图

SourceCoverage（每source/partition/generation独立）

```text
Unknown
  │ ConsumeSourceChange / AdvanceWorkspaceRecovery：正式部分材料
  ▼
Partial
  │ 同上：完整范围及连续性证明
  ▼
Complete
  │ ConsumeSourceChange：缺口证明
  ▼
Gap
  │ 同上或Advance：正式补齐/重新证明
  ▼
Partial / Complete
```

关键说明：

- 任一非Invalidated状态可由正式安全失效进入Invalidated；该终态不在本图主恢复链中反向跳出。
- Unknown/Partial也可直接发现Gap；有完整baseline证明时Unknown可直接Complete，必须有来源而非空页推断。

| 允许迁移 | 触发/条件 | 影响 |
|---|---|---|
| Unknown → Partial/Complete/Gap | ConsumeSourceChange或Advance，有对应owner证明 | 与局部应用原子提交 |
| Partial → Partial/Complete/Gap；Complete → Complete/Gap | 同上，比较与覆盖范围一致 | 无证明不推进source cursor |
| Gap → Partial/Complete | 正式补齐连续性或获准重新证明已声明范围 | 缺口解除，未覆盖部分仍Partial |
| Unknown/Partial/Complete/Gap → Invalidated | 两失效入口的SafetyBlocked依据 | 旧覆盖不能供给受影响输出 |

| 禁止迁移 | 原因 |
|---|---|
| Gap → Complete仅因收到更大cursor或超时重试 | 无正式接续证明 |
| Invalidated → Partial/Complete在旧generation | 安全失效不可被旧允许输入复活 |
| Complete → Partial只因一次Query失败 | Query no-write；请求可派生partial，不篡改已提交coverage |

SourceApplicationRecord只保存Applied或LateIgnored不可变终局结果；Duplicate读回，不新增状态。Gap/Blocked/Conflict均不写成功去重键，已存在成功记录不可被Conflict覆盖。LateIgnored也必须由owner顺序证明，不能倒退cursor。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。coverage触发均有Step7/8入口；不把输入失败固化为不可重试终局。状态传播在本Step跨组图统一表达。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP4 Inbox派生状态

#### 问题与依据

来源：Step6 InboxItem.attention_state；Step8 CP4及普通消费/恢复。

Present/Withdrawn只是owner attention派生；同一attention是否可撤回后重启，要由owner生命周期决定。

#### 诊断与取舍

若定义Withdrawn→Present无条件允许，旧事件会复活撤回项；若hide等同Withdrawn，又会让局部偏好改变来源truth。

采用：只允许正式新增/更新/撤回；撤回后同identity复活的未闭合合同保持blocked，正式新identity可产生新item；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Present | owner attention在已消费版本有效 | 是，仍需当前可见性 | 不是用户未读状态 |
| Withdrawn | owner明确撤回后的派生标记 | 否，不作为有效attention展示 | marker/ref本身也受裁剪 |

#### 状态流转图

InboxItem

```text
尚未派生
  │ ConsumeSourceChange / AdvanceWorkspaceRecovery：正式attention创建
  ▼
Present
  │ 同上：正式更新可保持Present；正式撤回向下
  ▼
Withdrawn
```

关键说明：

- hide/mute/read/unread不参与本状态迁移，它们属于CP5局部意图。
- 新generation重建按正式attention identity映射；重复/旧输入不使Withdrawn重新Present。

| 允许 | 禁止 |
|---|---|
| 正式创建 → Present；正式较新更新Present → Present；正式撤回Present → Withdrawn | 由query、local hide或任务状态推断撤回 |
| 正式baseline可直接派生Withdrawn（若owner合同明确包含该标记） | 仅以时间戳更大或旧allow重放使Withdrawn → Present |

同identity撤回后复活并非当前已承诺能力；WS-UP-004未给正式生命周期前保持blocked。正式新attention identity走新对象派生，不篡改旧记录。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。Present/Withdrawn字段与来源一致，未把用户意图加入状态机。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP5 局部版本与读意图派生

#### 问题与依据

来源：Step6 LocalAttentionState/ReadCursor/WorkspaceOperationRecord；Step8 ChangeWorkspaceLocalState/ListWorkspaceInbox。

local state变化受显式命令和local revision约束；Read/Unread/Unknown是给定item与用户意图的纯派生，不应被当source消费状态。

#### 诊断与取舍

将Unknown作为待重建写状态会让query反写意图；操作结果也不应该在每次重放时更新success时间或结果。

采用：无独立业务生命周期，逐情形说明意图修改与派生分类；操作记录不可变；重建保留local truth；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 值/情形 | 含义 | 是否可进入正常主线 | 来源与禁止 |
|---|---|---|---|
| Absent local state | 既有partition未保存overlay | 受限 | Query保持Absent；仅Provision或首次显式Change可建立 |
| Present local revision | 已有显式局部意图版本 | 是 | Change按expected版本提交；重建不覆盖 |
| Read | 当前item被可比较已读依据覆盖，且无有效未读例外 | 派生可用 | 不写owner receipt |
| Unread | 明确未读例外或正式可比较的未读依据 | 派生可用 | 不由source cursor推进清除 |
| Unknown | 尚无足够依据或跨generation映射不可证明 | 受限 | 不猜Read；不由query持久化默认 |
| WorkspaceOperationRecord已提交结果 | 与局部效果原子保存的不可变结果 | 可安全读回 | 无success→success更新；无记录不代表rollback |

允许：ChangeWorkspaceLocalState在同principal/scope上以expected local语境修改受控意图，新local revision取代旧版本；显式MarkUnread保留例外，合法Advance按既有意图规则更新。禁止：Query写intent、CP6覆盖意图、source重复增加unread、旧页游标充当read cursor、幂等结果重放重新执行副作用。

本部分无独立业务状态机，不画状态迁移图；Read/Unread/Unknown按每次安全输入纯计算，不能列为持久化迁移事件。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。局部版本与source/view/generation分离，所有写触发只有Step7已授权Command，传播只通过CP7重新读取感知。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP6 恢复生命周期与generation双轴

#### 问题与依据

来源：Step6三个维护对象；Step8四Job及失效Consumer。

attempt有Requested至Completed和Blocked/Failed/Superseded终态；角色Candidate/Current/Retired独立于安全Unverified/Validated/SafetyBlocked。

#### 诊断与取舍

Ready后candidate revision变化需要再验证，不能用旧cutover basis；安全失效不可降级成普通stale。角色Current与fresh毫无等价关系。

采用：显式列attempt允许/禁止迁移，Ready可在非安全失效的并发变化下回到验证；安全轴只在正式验证与失效间流转，SafetyBlocked原generation不复活；失效记录不可变；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

##### RebuildAttempt状态

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Requested | 已接受显式维护意图 | 是 | 尚无来源完成承诺 |
| Baselining | 正式基线枚举/读取中 | 是 | 不以空页证明完成 |
| CatchingUp | 按正式基线续接点消费变化 | 是 | bus准备不等执行 |
| Validating | 检查候选覆盖/版本/安全与并发语境 | 是 | 不写current |
| Ready | 特定候选revision通过检查 | 受限 | 切换前仍须再核验 |
| Completed | 本地原子cutover已提交 | 终态 | 不代表下游接收 |
| Blocked | 缺少正式合同/安全/来源证明 | 否，终态 | 恢复需新显式attempt |
| Failed | 本次维护有确定本地失败结果 | 否，终态 | unknown commit不等Failed |
| Superseded | 非终态被正式replacement替代 | 否，终态 | 旧worker不可再提交 |

#### 状态流转图

RebuildAttempt

```text
Requested
  │ AdvanceWorkspaceRecovery
  ▼
Baselining
  │ 正式基线完成且续接点可证明
  ▼
CatchingUp
  │ 声明覆盖满足
  ▼
Validating
  │ 候选版本/安全/并发校验通过
  ▼
Ready
  │ 原子cutover再核验通过
  ▼
Completed
```

关键说明：

- Requested~Ready任一非终态可因明确缺口进入Blocked，或确定本地失败进入Failed；Supersede入口可显式进入Superseded。
- Ready校验依据仅因候选revision或合法并发变化过期，可回Validating；明确安全失效不能借回退绕过Blocked。
- 终态无向前迁移；新attempt有新身份，历史结果不改写。

| 允许迁移 | 触发/条件 | 禁止 |
|---|---|---|
| Requested→Baselining→CatchingUp→Validating→Ready→Completed | Advance；每阶段正式证据及expected版本成立，最后同分区原子切换 | 跳过baseline接续，Ready直接等价current |
| Baselining/CatchingUp→自身 | 合法分批进度，原子保存 | unknown不经结果核对即重复副作用 |
| Validating→CatchingUp；Ready→Validating | 来源明确需补足接续/旧校验依据过期，attempt仍合法非终态 | 以回退清除正式撤销 |
| 任一非终态→Blocked/Failed | 分别为证明不足/确定失败，safe failure basis必填 | timeout直接当确定失败 |
| 任一非终态→Superseded | SupersedeWorkspaceRecovery且replacement关系经读取核验 | Completed/Blocked/Failed/Superseded→任何非终态 |

##### GenerationState角色与安全轴

| 状态轴/值 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| role: Candidate | 隔离构建目标 | 仅维护 | 普通Query不可混出 |
| role: Current | 分区选用世代 | 受限 | 不等Fresh/Complete/Allowed |
| role: Retired | 被原子切换取代的旧世代 | 否 | 不继续旧分页 |
| safety: Unverified | 未有适用校验依据 | 否，不可cutover | 新candidate初值 |
| safety: Validated | 特定语境曾获有效校验 | 受限 | 每次输出/cutover需现时核验 |
| safety: SafetyBlocked | 已知正式安全失效 | 否 | 无原地复活 |

#### 状态流转图

GenerationRole

```text
Candidate
  │ AdvanceWorkspaceRecovery：原子cutover
  ▼
Current
  │ 后续合法candidate原子取代
  ▼
Retired
```

关键说明：

- 每分区至多一个current指针，角色变化和指针/attempt结果同事务。
- 角色不承载freshness；Current+SafetyBlocked是合法且必须拒绝受影响输出的组合。

#### 状态流转图

GenerationSafetyState

```text
Unverified
  │ AdvanceWorkspaceRecovery：正式校验
  ▼
Validated
  │ InvalidateWorkspaceView / ConsumeSourceInvalidation：安全失效
  ▼
SafetyBlocked
```

关键说明：

- Unverified也可直接SafetyBlocked；Validated校验依据失效可退为Unverified重新验证，不能把正式撤销当普通过期。
- SafetyBlocked无回退到Validated；以新generation从owner重新构建，旧allow/replay不能清除失效。

| 允许 | 禁止 |
|---|---|
| Candidate→Current、旧Current→Retired同一次合法cutover | Retired→Current；未validated或coverage不足的candidate被提升 |
| Unverified→Validated；Validated→Unverified仅校验语境过期；Unverified/Validated→SafetyBlocked | SafetyBlocked→Validated；用本地TTL替代owner现时决定 |

InvalidationRecord无独立状态机；DataStale影响CP7请求freshness推导，SafetyBlocked影响coverage与generation安全轴。Query只读失效记录，不新增失效或触发重建。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。三种状态主语与Step6保持对应；所有触发来自Step7/8。Ready/Validated语义分开，unknown commit不编造终态；完整穷举矩阵留03。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP7 读取多轴姿态及游标失效

#### 问题与依据

来源：Step6 WorkspaceReadView/WorkspacePageCursor及外层安全失败；Step8六Query。

读取结果可同时stale、partial与AllowedSubset，但scope或安全无法证明时返回fail-closed安全失败。游标变化只是拒绝继续读取，不是状态迁移。

#### 诊断与取舍

单一优先级enum会丢失coverage/数据时效组合；blocked若携带hidden来源列表会泄露授权边界。

采用：分轴定义响应取值；WorkspaceReadView只代表可安全构造的Available子集；整体Blocked/Unavailable/FailClosed在SafeReadFailure中表达且无敏感元信息；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 响应轴/值 | 含义 | 是否可进入正常主线 | 约束 |
|---|---|---|---|
| DataFreshness: Fresh | 声明来源集合有足够现时数据证明 | 是，仍需权限 | 非全域同时最新 |
| DataFreshness: Stale | 可证明数据较旧，当前读取权限仍成立 | 受限 | 不借旧数据沿用旧授权 |
| DataFreshness: Unknown | 无法判定数据时效 | 受限 | 不显示为Fresh |
| ReadCoverage: Complete | 所声明、允许公开的集合完整性可证明 | 是 | empty需list access与覆盖证明 |
| ReadCoverage: Partial/Unknown | 仅有部分/尚无完整证明 | 受限 | 不返回伪完整count/隐藏来源清单 |
| Availability: Available | 可安全构造view | 是 | 内容仅AllowedSubset |
| Availability: Blocked/Unavailable | 请求必要前提未满足/无可服务材料 | 否或仅安全状态 | 外层SafeReadFailure，不构造假view |
| Visibility: AllowedSubset | 当前允许部分输出 | 受限或是 | 所有ref/count/provenance同样裁剪 |
| Visibility: FailClosed | 当前scope/决定不可证明或撤销 | 否 | 外层安全失败，不携带scope/ref/count/provenance |

允许：Query从当前读取证据纯计算各轴，不产生持久迁移。禁止：将stale强制变fresh、partial强制空/complete、旧page cursor作为权限、Transient伪造durable版本、失败查询建立projection。

WorkspacePageCursor同样无状态机：完整绑定匹配且当前权限可验证才继续；principal/scope/query/generation/view/local/visibility任一不可服务则要求重读。不得Query更新cursor记录、静默换代或返回隐藏数据。无独立状态迁移图；跨状态影响在后续传播图收束。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。多轴值与外层失败边界一致；六Query不触发任何持久状态，未发明UI状态。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### 7.3 状态传播与跨组审计

#### 状态传播关系图

```text
已提交局部状态变化
  ├─ CP3 coverage/应用 → 同世代projection及Inbox
  ├─ CP5局部意图      → read/unread/排列纯派生
  └─ CP6失效/切换     → current选择与可服务范围
  │
  ▼
CP7现时安全读取
  内容、ref、count、provenance统一裁剪
  │
  ▼
多轴WorkspaceReadView或SafeReadFailure
  下游只读消费；无Outbox、无archive完成事实
```

关键说明：

- 传播图只表达局部状态如何影响read model，不表示bus投递、SDK缓存或archive确认。
- 安全拒绝优先；数据Fresh或coverage Complete均不能跳过当前authorization。
- 查询只派生响应，不能反向触发状态变化；无隐式重建。

| 审计项 | 结论 | 依据 |
|---|---|---|
| 状态归属 | pass | 七CP逐组，状态主语均回指Step6 |
| 触发覆盖 | pass | 持久变化全部对应Step7/8 Command/Consumer/Job；Query无写触发 |
| 同名含义 | pass | attempt Blocked、generation SafetyBlocked、response Blocked分别限定；Current不等Fresh |
| 禁止迁移 | pass | Gap不跨越；旧allow不复活；终态新attempt；局部意图不随重建覆盖 |
| 不变记录 | pass | SourceApplicationRecord、WorkspaceOperationRecord、InvalidationRecord不造迁移机 |
| 未来详设 | pending | 03补全部guard、失败分类、并发/事务与测试切口，非本Step已实现证明 |

### 7.4 后置历史差异

| 旧位置 | 旧口径 | 当前判断/回填影响 |
|---|---|---|
| draft/03 §4.1 | scope verified/revoked、projection current/stale/partial等混轴 | 废弃统一状态组；采用本Step主语与轴分离 |
| draft/02 §2.5 | fail-closed>blocked>partial>stale>fresh单序建议 | 仅保留安全拒绝优先，其他值为正交组合，非总序enum |
| draft/03 §4.1 Local cursor | unset/advanced/conflict/recalculating混合状态 | 意图版本与请求失败/派生分类分开，不造持久recalculating |

## 8. 回填草稿

正式§9摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

对象状态、允许禁止迁移、14入口触发关系和传播图已静态审查。所有已列状态有承载对象；无scope authorization或上游业务状态机，无Query写迁移。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 10。
