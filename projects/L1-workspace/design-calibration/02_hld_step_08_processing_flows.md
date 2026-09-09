# Step 8. 处理流

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 7；Step 5/6；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先通用骨架，再CP1→CP7；CP6四Job一Consumer、CP7六Query分批；最后逐接口/对象/原子边界审计
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 7；Step 5/6；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. 两个Command经入口上下文、正式scope/权限解析、幂等核对、局部对象和原子存储；没有Outbox。
2. 六Query先scope/list权限后读取及逐项裁剪，所有分支no-write。
3. 两Consumer先可信来源/版本/目标解析，再局部应用或失效；未知提交先查记录。
4. 四Operations区分接受、执行、替代、失效；不能绕过正式baseline和当前安全。
5. 仅点名Step6成员/工厂，参数写类型名；不在图里新造helper。
6. 需要点名原子提交、coverage、current指针与local意图隔离；完整调用链/DDL留03。
7. 2 Command+2 Consumer+4 Job全部独立画流。
8. 6 Query均涉及安全裁剪/缺失/分页或结果核对，全部画独立流，不机械归入简单GET。
9~11. 按CP执行；CP2/4无独立公开入口，但其只读/派生边界需单独停审；最后14入口反查。

## 4. 当前文档问题诊断

Step7仅说明接口类别，未解释unknown commit如何阻止重复、基线与增量怎样共享应用内核、查询结果核对如何不泄露旧成功。仅通用happy path不能满足这些边界。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为处理流，不补上游schema |

## 6. 设计取舍

采用14入口逐流图+七CP审查。所有图自上而下，图后2~5条设计点；事务内外只写结构边界，不提前编排完整trait调用或具体DB。拒绝将同类名字合并后遗漏不同失败分支。

## 7. 结构化中间产物

### 7.1 通用处理约束

| 路径 | 结构骨架 | 必须保留的分支 |
|---|---|---|
| Command | Inbound → 正式解析/局部幂等核对 → Domain变化 → 同分区效果与结果原子提交 | 不允许、同键不同输入、版本冲突、提交unknown；unknown不是rollback |
| Query | Inbound → scope/list access → 只读局部/owner材料 → 现时逐项决定 → 安全response | scope失败不带元信息；缺材料不当空；stale数据不可绕过现时授权 |
| Consumer | 可信来源 → 正式输入/目标绑定 → 已提交结果核对 → 按owner版本判定 → 原子局部应用 | Duplicate、LateIgnored、Gap、Conflict、Blocked；失败不占成功键 |
| Operations | 获准意图/持久attempt → 正式恢复或失效输入 → 候选/目标变化 → 局部原子结果 | 候选隔离、终态不隐式复活、跨分区不宣称全局事务 |

以上为骨架说明，不是新用例或已实现pipeline。外部调用不能包含上游写命令；正式外部合同缺失时保守退出，不能用fake结果作成功证明。

### CP1 分区建立处理流

#### 问题与依据

依据：Step7 ProvisionWorkspacePartition；Step6 WorkspacePartition/WorkspaceScope/WorkspaceOperationRecord。

分区不存在时如何定位相同请求？按已解析principal/scope+operation key；所有合法已有分区与新建响应都要走当前范围授权。

#### 诊断与取舍

先生成partition再去重会产生重复实体；GET代Provision则违反00。需要在唯一分区写边界一并持久结果，提交不明不返回成功。

采用：先resolver及幂等读，再分区唯一性和事务；没有业务理由创建project/member truth或projection；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

#### ProvisionWorkspacePartition 处理流

```text
Command / ProvisionWorkspacePartition
  │
  ▼
Inbound
  验证ActorContext、元数据和幂等键
  │
  ▼
ScopeService / PartitionService
  正式scope与创建权限；已有操作结果只读核对
  │
  ▼
WorkspacePartition / WorkspaceOperationRecord
  同principal/scope唯一；同键同输入复用，异输入冲突
  │
  ▼
WorkspaceStorePort
  同事务提交分区及操作结果，不建立投影
  │
  ▼
PartitionCommandResult
  已提交安全结果；unknown先核对，不猜成功
```

关键设计点：

- 外部scope/权限读取在局部写事务之外；提交仍须核对所用决定有效性和分区并发语境，03闭合安全栅栏。
- 新分区ID由本地受控来源生成；唯一性冲突读取既有分区再核验，不能返还其他主体分区。
- query不调用本流；字段完整来源、唯一约束及unknown结果定位留03，所需对象已有Step6。


#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。本流回指CP1两对象与CP5共享操作记录；不复制上游truth，不发事件。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP2 安全来源协作

#### 问题与依据

依据：Step7 CP2内部接口；Step6 SourceSlice/VisibilityBinding；闭环标准resolver-first和empty page visibility要求。

取值顺序需先正式scope及list/query访问语境，再读owner安全摘要，按subject/version核验输出。空页没有item也不能跳过list access决定。

#### 诊断与取舍

如果从loaded slice拼authorization resolution，或用空items证明有权访问，query仍可能泄露scope存在性。

采用：CP2不另画外部API流；用明确的调用阶段与返回契约接入CP3/6/7，缺证明fail-closed；不写本地授权policy；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 调用阶段 | 正式来源 | 产物/失败 | 使用方 |
|---|---|---|---|
| 解析scope与query/list访问范围 | ScopeResolverPort + owning visibility chain | WorkspaceScope与list access语境；未证明则安全失败 | CP7所有Query；CP3/6目标与来源核验 |
| 读取安全source材料 | OwnerSourcePort正式typed safe query | OwnerSafeReadResult或明确source失败分类 | CP7 Transient、CP6 baseline、CP3需要正式补读时 |
| 绑定subject/version与当前决定 | VisibilityResolverPort | VisibilityBinding与SourceSlice；来源/版本不匹配拒绝 | 全部输出/应用 |
| 返回消费结果 | SourceReadService纯转换 | 允许子集、明确数据缺失或fail-closed | 调用方决定response或显式局部写；CP2自身不保存 |

empty page必须仍有正式scope/list access证明，不能从selector或空集合生成允许绑定。owner当前安全语义不足属于WS-UP-003，禁止以本地TTL或已缓存allow替代。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。无独立入口故不新增独立图；CP3/6/7图必须保留scope与当前授权阶段。新增empty page约束属于既有resolver-first，不新增本地对象。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP3 连续应用处理流

#### 问题与依据

依据：Step7 ConsumeSourceChange；Step6 PartitionProjection/SourceApplicationRecord/SourceCoverage、CP4 InboxItem。

终局结果与输入身份绑定，Gap/Blocked可恢复；source顺序由owner定义，baseline应用与事件共享内核但目标不同。

#### 诊断与取舍

把cursor与projection分两次提交会跳过输入；迟到不能仅靠时间戳；unknown之后直接重投会产生不确定副作用。

采用：可信输入及已有目标解析→当前安全与终局核对→owner顺序分类→同分区原子应用；失败诊断不得推进cursor；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

#### ConsumeSourceChange 处理流

```text
Inbound Event / ConsumeSourceChange
  │
  ▼
Consumer
  正式envelope、owner/stream/schema/identity、已有目标路由
  │
  ▼
ProjectionApplyService + CP1/CP2
  scope/版本/安全绑定；核对同分区同generation终局记录
  │
  ▼
SourceApplicationRecord / SourceCoverage
  同键同内容读回；异内容Conflict；owner顺序判定
  │
  ▼
PartitionProjection + InboxProjector
  Applied变化；LateIgnored不覆盖；Gap/Blocked不形成成功记录
  │
  ▼
WorkspaceStorePort
  projection、Inbox、终局记录、cursor、revision、coverage原子提交
  │
  ▼
ApplyResult
  unknown先只读核对；反馈bus必须使用其正式合同
```

关键设计点：

- Gap保留最后安全cursor，只有显式输入处理可写coverage诊断；query不能写诊断。顺序不可比较不视为LateIgnored。
- 本流不创建partition/candidate；current目标来自store，candidate目标来自CP6持久attempt，提交校验generation仍有效。
- CP4派生与source应用共原子边界；重复不新增Inbox/未读，不触发用户read intent；完整比较、去重保留与结果查找留03。


#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。三CP3对象及CP4派生均已定义；无裸event-id去重和跨域事务，Step9承接终局/coverage。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP4 Inbox原子派生协作

#### 问题与依据

依据：Step7 InboxProjector、Step6 InboxItem及CP3本Step处理流。

派生仅使用已核验owner attention，撤回需正式生命周期输入；重复和重建不能增加条目或改用户意图。

#### 诊断与取舍

独立Inbox提交可能出现cursor已推进而条目未生成；generation参与稳定item id又会丢失read关联。

采用：在CP3/CP6同事务形成Inbox变更集合；稳定attention id与generation存储轴分离；无独立consumer/flow；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 场景 | 输入/行为 | 局部提交边界 | 禁止 |
|---|---|---|---|
| 首次/更新attention | 正式identity/version与可见source ref；derive/apply_attention | InboxItem与CP3来源应用同事务 | 从work priority或governance状态自行推断attention |
| owner撤回 | 正式Withdrawn输入 | 条目标记与来源coverage同事务 | local hide代替owner撤回 |
| duplicate/late | CP3先完成身份及版本判定 | duplicate无新写，正式late不倒退条目 | 每次delivery新增Inbox id |
| rebuild | 新generation下按同一稳定attention身份派生 | candidate内部同样复用原子应用 | 覆盖CP5 read/unread/pin/mute |

来源缺少attention合同不拒绝本来可安全消费的非Inbox摘要；只阻塞需要该attention能力的子路径，不能用推断填补。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。没有漏画正式入口：本部分没有外部用例。对象能力被CP3与CP6的流覆盖，04关注资源但不能配置伪造attention。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP5 局部用户意图处理流

#### 问题与依据

依据：Step7 ChangeWorkspaceLocalState受控变体；Step6 local state/read cursor/operation record。

已读位置、明确未读例外及其他偏好统一受local版本控制；Absent用于首次显式初始化，而非盲写。

#### 诊断与取舍

当前projection缺口不应重置已保存的用户意图；旧generation中的读依据若不能映射，必须保留Unknown而非自动推进。

采用：显式输入→scope/目标当前权限→幂等与local版本→受控变体→local state/operation原子结果；跨域零写入；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

#### ChangeWorkspaceLocalState 处理流

```text
Command / ChangeWorkspaceLocalState
  │
  ▼
Inbound
  ActorContext、元数据、幂等键、typed变体、expected local语境
  │
  ▼
LocalAttentionService + CP1/CP2
  解析既有partition与目标关系；取得现时允许决定
  │
  ▼
WorkspaceOperationRecord + LocalAttentionState
  原结果安全核对；版本冲突保持原值；Absent仅首次显式初始化
  │
  ▼
ReadCursor / LocalAttentionState
  read/unread或局部disposition/preference/focus/last-opened变更
  │
  ▼
WorkspaceStorePort
  局部意图、local revision、操作结果同事务
  │
  ▼
LocalStateCommandResult
  committed安全结果；unknown先核对，不再发上游命令
```

关键设计点：

- 本地read intent不等于conversation receipt；cannot map保留Unknown；显式未读例外不被普通推进无条件清除。
- query/list/open view均不调用本流；重建只换projection，不重置local state。
- 首个显式local命令允许建立Absent overlay，但要求partition已存在；同键重放先读原结果并重新裁剪，03补变体和并发完整协议。


#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。四变体组均受一局部原子边界控制；不重复造ReadCommand领域对象；无隐式refresh或跨域写。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP6 恢复与失效处理流

#### 问题与依据

依据：Step7四Job及ConsumeSourceInvalidation；Step6三个恢复对象、共享操作结果、CP3应用内核。

Request只接受意图；Advance复用CP2 baseline和CP3应用，验证Ready后切换；Supersede显式终止旧worker；失效覆盖所有已有相关generation。

#### 诊断与取舍

多阶段恢复如果没有attempt/version/current指针共同检查，会在旧worker完成或新撤销后错误切换；跨分区撤销不能假装单事务。

采用：分别画五流：接受/推进/替代/显式失效/owner失效。切换只在本分区原子；先前决定有效性不足即block；所有读仍独立现时核验；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

#### RequestWorkspaceRecovery 处理流

```text
Operations / RequestWorkspaceRecovery
  │
  ▼
Operations入口
  MaintenanceContext、显式RecoveryIntent、操作键、expected partition版本
  │
  ▼
RecoveryService + CP1/CP2
  既有目标、维护权限与操作结果核对
  │
  ▼
RebuildAttempt + GenerationState
  新attempt及Candidate/Unverified；来源不足不伪造baseline
  │
  ▼
WorkspaceStorePort
  意图、candidate与操作结果同分区提交
  │
  ▼
RecoveryRequestResult
  返回已接受attempt，不表示完成
```

关键设计点：

- Refresh与Rebuild复用RecoveryMode，不重复对象；二者都禁止直接覆写current。
- 缺正式baseline/接续会在推进时Blocked，可拒绝无合法维护权限的请求；用户查询不会创建attempt。
- 03必须定义ID来源、幂等和candidate建档原子边界；本图无调度实现或真实run id。

#### AdvanceWorkspaceRecovery 处理流

```text
Operations / AdvanceWorkspaceRecovery
  │
  ▼
Worker入口
  读取持久attempt与expected AttemptVersion；拒绝终态旧任务
  │
  ▼
RecoveryService + RecoverySourcePort / CP2
  正式baseline、每源覆盖与接续；不足则Blocked
  │
  ▼
PartitionProjection / CP3 + InboxProjector
  candidate分批原子应用；不影响current/local overlay
  │
  ▼
RebuildAttempt / GenerationState
  CatchingUp、Validating、Ready；校验同一候选revision
  │
  ▼
WorkspaceStorePort
  再核对attempt/partition/current与安全语境；原子切换/退役/Completed
  │
  ▼
RecoveryProgressResult
  成功仅本地cutover；冲突不切换，unknown先核对
```

关键设计点：

- source query/baseline与bus preparation都不等于已闭合接续；无正式比较规则不声称追平。
- Ready后的输入、安全失效或并发current变化都使既有cutover依据失效；拒绝提交后在非终态重新验证，不复活Blocked/Failed。
- 新current与旧Retired、分区指针和attempt完成同事务；local overlay保持不变。具体栅栏、进度保存和崩溃恢复留03。

#### SupersedeWorkspaceRecovery 处理流

```text
Operations / SupersedeWorkspaceRecovery
  │
  ▼
Operations入口
  获准替代意图、旧/新attempt、expected版本及操作键
  │
  ▼
RecoveryService
  读取两attempt；同分区、replacement合法、旧任务非终态
  │
  ▼
RebuildAttempt
  旧attempt进入Superseded，不再允许candidate提交/切换
  │
  ▼
WorkspaceStorePort
  替代状态与操作结果原子提交，旧worker并发写冲突
  │
  ▼
RecoverySupersedeResult
  不改变current，不复制用户意图
```

关键设计点：

- 先新建合法replacement再显式替代；不能仅凭request中的两个ID声称关系成立，必须读持久对象。
- 已Completed/Blocked/Failed/Superseded不通过本操作复活；candidate清理不在本流隐式发生，清理边界留03/04。

#### InvalidateWorkspaceView 处理流

```text
Operations / InvalidateWorkspaceView
  │
  ▼
Operations入口
  正式维护权限、目标选择、InvalidationBasis与操作键
  │
  ▼
RecoveryService + WorkspaceStorePort只读目标枚举
  仅已有partition/source/generation；核验依据与影响关系
  │
  ▼
InvalidationRecord / SourceCoverage / GenerationState
  DataStale或SafetyBlocked分别处理，涵盖旧/当前/候选
  │
  ▼
WorkspaceStorePort
  每分区失效效果与操作结果原子提交
  │
  ▼
InvalidationResult
  跨分区未完成如实返回未完成，不声称全局成功
```

关键设计点：

- 维护DataStale不制造owner tombstone；明确SafetyBlocked不能等物理删除后才生效。
- 目标必须来自正式存储枚举/owner影响关系，不能对opaque ref猜分区。03需细化fanout进度与查询安全栅栏。

#### ConsumeSourceInvalidation 处理流

```text
Inbound Event / ConsumeSourceInvalidation
  │
  ▼
Consumer
  可信owner envelope、事件身份、正式影响/版本/撤销依据
  │
  ▼
RecoveryService + CP1/CP2
  系统操作键核对；解析已有受影响目标，不以旧allow替代
  │
  ▼
InvalidationRecord / SourceCoverage / GenerationState
  应用正式失效；不依赖普通数据流补齐才安全裁剪
  │
  ▼
WorkspaceStorePort
  每目标原子失效与系统结果；重复返回既有本地结果
  │
  ▼
InvalidationResult
  仍有目标未处理不得声称全部完成；bus反馈另按正式合同
```

关键设计点：

- 安全撤销不能因数据流Gap而被忽略；无法建立正式影响/现时权限时读侧fail-closed，不能靠本地推测撤销语义。
- 重复不复活目标；旧允许事件不能盖过更晚的正式撤销。跨分区传播不是全域事务，查询始终现时核验。
- 03承接系统键与普通source application键的分离、fanout覆盖/恢复与禁止旧worker写回；本流不定义上游撤销协议。


#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。五入口覆盖完整；所有状态主体均在Step6；安全失效与数据freshness分离，输出成功限定本地已提交范围；没有archive或bus执行truth。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CP7 安全读取与交接处理流

#### 问题与依据

依据：Step7六Query；Step6 response/游标/安全失败DTO；01 §10；CP2 list access约束。

每个读取先解析访问范围，再读取现有材料，现时裁剪。分页必须同一read basis；空集合仍需访问证明；operation结果无记录不证明rollback。

#### 诊断与取舍

只读常规路径不足解释Transient无durable版本、local缺失、恢复状态泄露、export误被当归档完成。

采用：六Query各有独立图；GetWorkspaceView两显式模式共享安全边界。无自动fallback、无query补建、无输出计数绕过裁剪；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

#### GetWorkspaceView 处理流

```text
Query / GetWorkspaceView
  │
  ▼
Inbound
  ActorContext、显式scope/模式/selection、分页绑定
  │
  ▼
WorkspaceQueryService + CP1/CP2
  正式scope/list access；失败不透露范围存在性
  │
  ▼
只读材料分支
  ├─ Materialized：既有同generation/view/local语境
  └─ Transient：owner安全query，逐源版本/coverage
  │
  ▼
VisibilityBinding / WorkspaceReadView
  现时逐项裁剪；缺失/partial/stale分轴，不造完整空
  │
  ▼
WorkspaceQueryResult
  稳定物化页才有next cursor；安全失败不带内容元信息
```

关键设计点：

- Materialized缺分区/投影不触发Provision或恢复；Transient是显式请求模式，不是未声明fallback，不持久化聚合结果。
- cursor核对principal/scope/query/generation/view/local/visibility绑定，无法继续时要求重新读取。
- Fresh/Complete必须来自所声明source集合的正式证明；空页也先验证list access；03补稳定页读取一致性和安全失败DTO。

#### ListWorkspaceInbox 处理流

```text
Query / ListWorkspaceInbox
  │
  ▼
Inbound
  ActorContext、scope、过滤排序和可选page cursor
  │
  ▼
WorkspaceQueryService + CP1/CP2
  正式scope/list access；核验稳定分页语境
  │
  ▼
InboxItem + LocalAttentionState / ReadCursor
  只读同一generation/view/local语境；不初始化Absent
  │
  ▼
现时可见性裁剪与纯派生
  先裁剪再应用local隐藏/排序；Read/Unread/Unknown
  │
  ▼
安全Inbox page
  只计允许且覆盖可证明的集合；无持久化写
```

关键设计点：

- owner Withdrawn与local hide不同；Unknown不能变成已读，重复条目不靠unread计数累加。
- 分页local revision变化不能静默继续；source gaps与可见性裁剪不得伪装complete empty。
- 03细化稳定attention排序/位置与ReadCursor关系；本流不发送receipt或local command。

#### GetWorkspaceLocalState 处理流

```text
Query / GetWorkspaceLocalState
  │
  ▼
Inbound
  ActorContext、scope与受控local字段选择
  │
  ▼
WorkspaceQueryService + CP1/CP2
  正式scope权限；既有partition只读lookup
  │
  ▼
LocalAttentionState
  Present读已有版本；Absent保持Absent
  │
  ▼
现时目标决定裁剪
  focus、last-opened、disposition refs也须安全
  │
  ▼
SafeLocalStateView
  无初始化、无默认值持久化
```

关键设计点：

- 不可见目标的存在、数量和旧ref都不能返回；本地所有权不取消owner引用的当前可见性。
- Absent与显式保存的空值有区别；03定义safe local DTO，不把读取变成首次偏好写入。

#### GetWorkspaceOperationResult 处理流

```text
Query / GetWorkspaceOperationResult
  │
  ▼
Inbound
  ActorContext、scope、操作ref或原操作键
  │
  ▼
WorkspaceQueryService + CP1/CP2
  正式scope及操作结果访问关系，不能由ref猜actor
  │
  ▼
WorkspaceOperationRecord
  只读已提交结果与本地版本；不重跑命令
  │
  ▼
当前可见性重裁剪
  旧成功中的target/ref/metadata不绕过撤销
  │
  ▼
SafeOperationResult / 安全NotAvailable
  不存在记录不证明事务rollback
```

关键设计点：

- 本流用于提交unknown核对，但不能把NotAvailable直接翻译为可无条件重试；03需权威store读及同键重试条件。
- 无授权与不存在不能泄露可区分敏感信息；查询不可新建操作记录或source application。

#### GetWorkspaceRecoveryStatus 处理流

```text
Query / GetWorkspaceRecoveryStatus
  │
  ▼
Inbound
  ActorContext、scope、attempt选择
  │
  ▼
WorkspaceQueryService + CP1/CP2
  正式维护状态读取权限；解析已有attempt关系
  │
  ▼
RebuildAttempt / GenerationState / SourceCoverage
  只读进展、已提交结果与安全失效依据
  │
  ▼
安全状态组装
  Ready非Completed；source/target/原因元信息裁剪
  │
  ▼
SafeRecoveryStatus
  不推进、不重试、不创建replacement
```

关键设计点：

- 只输出可证明且允许公开的本地状态，不能把bus preparation、baseline读取或archive消费称为完成。
- 多个分区读取不是全局快照；未完成/不可读范围如实受限，不泄露hidden原因；03定义status摘要映射。

#### ExportWorkspaceReadModel 处理流

```text
Query / ExportWorkspaceReadModel
  │
  ▼
Inbound
  ActorContext、scope、ExportSelection、稳定读取语境
  │
  ▼
WorkspaceQueryService + CP1/CP2
  正式导出读取权限；WS-UP-006接缝门禁
  │
  ▼
PartitionProjection / local overlay
  只读同generation/view/local；缺失不创建snapshot
  │
  ▼
WorkspaceReadView + 当前visibility
  内容/ref/count/provenance统一裁剪
  │
  ▼
SafeReadExportPage
  按绑定分页；不保存handoff或下游确认
```

关键设计点：

- 输出只是稳定workspace read model，不能声明archive accepted/frozen、恢复包或SDK cache baseline。
- 多页绑定失效时重新读取，不继续拼装成伪一致export；没有额外archive写adapter。
- 03收口本地export DTO与no-write；外部消费者协议仍由WS-UP-006控制，不以本流设计证明集成完成。


#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。六Query均有独立图及安全缺失分支，覆盖两读取模式与空页权限；逐图未发现写事务、调度或真实外部执行声明。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### 7.3 跨处理流审计

| 检查项 | 结论 | 具体覆盖 |
|---|---|---|
| 入口覆盖 | pass | Step7的14入口各有独立图，CP2/4为内部协作且给不另画图理由 |
| 对象反查 | pass | 所有流程使用的领域对象来自Step6的16对象；输入/结果仅DTO，未发明业务聚合 |
| 普通应用原子性 | pass | CP3投影/Inbox/终局记录/cursor/revision/coverage同分区提交；Gap不占成功键 |
| 局部意图原子性 | pass | CP5 local state与操作结果同事务；CP6不覆盖local overlay |
| 恢复与安全 | pass | Request不是Completed；Advance须再验current/attempt/安全；Supersede阻止旧worker |
| unknown commit | pass | Command/consumer/job先读已提交结果，NotAvailable不证明rollback，不无条件重做 |
| Query no-write | pass | 六Query均没有初始化、保存snapshot、推进cursor、标已读、刷新、调度或handoff marker |
| 空/缺失/不可见 | pass | empty也先获list access；missing不当empty；元信息同样裁剪 |
| page/版本 | pass | 物化绑定principal/scope/query/generation/view/local/visibility；Transient无durable游标 |
| 外部接缝 | blocked | 001~008/006-S仍开放；正向owner协议、bus反馈、baseline续接及export无法凭本图闭合 |

### 7.4 后置历史差异

| 旧位置 | 旧口径 | 当前判断 | 回填影响 |
|---|---|---|---|
| draft/02 §2.6 | 缺口尝试replay/rebuild | 限缩 | 显式维护或持久attempt执行；query不代发，bus preparation不视为executor |
| draft/03 §4.3 | 刷新与导出可形成局部attempt | 拆分 | 维护显式attempt成立；export只读，不增加handoff truth |
| governance参考Step8 | 按治理同构流族展开，含Outbox/handoff | 仅参考分析粒度 | 本仓14入口独立展开，既不复制治理truth也不建Outbox |

## 8. 回填草稿

正式§8摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

14独立图均带2~5条关键设计点；七CP逐段停审。跨流对象、分类、no-write、原子与未知提交审查完成；无完整代码/协议/DDL。没有发现可由本仓补齐的上游合同，blocker维持。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 9。
