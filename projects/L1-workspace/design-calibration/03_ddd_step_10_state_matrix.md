# Step 10. 状态主语与逐状态转换矩阵

## 1. Step状态

状态：[x] completed；gate_status=pass_with_external_slots；stop_before_step11=true；前序已完成；formal_fill_allowed=false；仅设计，最多到Step10。

## 2. 输入

02 §9、Step6局部enum/方法、Step7 read/write与Step8 result、Step9逐flow；SOP Step10全条/书写§5.9；governance Step10状态主语/分族/逐表/非法迁移审查粒度，不继承其truth/outbox状态。

## 3. SOP问题回答

1~2：先筛选，纯ID/DTO/owner truth不造状态机。3~6：coverage、attention、attempt、generation二轴、局部读意图与响应/提交/entry分类分族。7~11：逐矩阵对应Step6方法+Step9flow、前置字段/副作用/错误/测试；最后跨状态审计，Step11前停止。

## 4. 诊断

不能把Fresh/Stale、Complete/Partial、AllowedSubset和generation safety合成统一status；四attempt终态不复活；entry disposition与持久生命周期分开。只有真正局部主语可推进，owning状态只消费。

## 5. 前后对比

此前语义/对象轮廓→本步具名合同；保留上游slot blocker，不把本地设计通过当正向集成闭合。

## 6. 取舍

逐模块/协议族/入口/状态主语小循环，先依据/问题/诊断/取舍，再合同与自检；不照搬governance业务对象。

## 7. 结构化产物

### 7.1 状态主语筛选、分族与批次

| 候选主语 | Step6/8来源 | 纳入方式 / 原因 | 状态族/顺序 |
|---|---|---|---|
| SourceCoverage | CoverageState | 独立逐stream/generation状态机 | projection/source，10A |
| InboxItem | AttentionState | 明示owner attention的局部镜像迁移，不造owner生命周期 | projection，10B |
| RebuildAttempt | RebuildStatus | 独立维护尝试状态机 | maintenance，10C |
| GenerationState.role | GenerationRole | 被选择角色轴 | maintenance，10D |
| GenerationState.safety_state | GenerationSafetyState | 验证/失效独立轴，不是权限truth | maintenance，10E |
| LocalAttentionState/ReadCursor | LocalReadBasis、ReadIntent、ReadClassification | 局部值更新/派生分类矩阵，不添加ReadState实体 | local intent/read，10F |
| SourceApplicationRecord/OperationRecord | TerminalApplyDisposition、StoredWorkspaceResult | append-only终局记录，无状态复活；提交/回放分类矩阵 | idempotency，10G |
| WorkspaceReadView/PageCursor | ReadAvailability/VisibilityPosture/Freshness/Coverage/Mode | 每次读的输出决策矩阵，无持久生命周期 | read/visibility，10H |
| commit/consumer/write result | CommitOutcome/Resolution、SourceChangeReceipt、SourceInvalidationReceipt、WriteDelivery | 调用结果分类，不等bus delivery或job事实 | entry，10I |
| AdapterObservation | AdapterAvailability | 装配观测矩阵，非runtime execution状态 | technical，10J |
| scope/slice/binding/key/ID/CutoverBasis | 不可变值或证明binding | 排除独立状态机，校验只引用owner当前决定 | 不适用 |
| InvalidationRecord/Effect | append-only依据、effect分类 | 不生成生命周期，纳入对应generation/coverage副作用表 | 不适用 |
| 所有外部L1 truth/runtime/tools/archive/SDK/UI | owner状态 | 排除；本仓仅消费正式safe状态，不为它们写迁移 | 不适用 |

每一族下状态集合→ASCII图/决策图→迁移/非法矩阵→自检，完毕后跨族审查。无GlobalState/SystemState，无Outbox/Handoff状态。本步首次引入的公共entry分类在Step8定义，已回登记6C索引；没有把DTO硬变持久实体。

公共规则：所有持久迁移由6B方法在内存tentative产生，再由7具名store原子提交，才作为真实局部状态读取；expected来源是Step9读取/请求，错误前self不变。所有未列迁移默认`DomainError::InvalidTransition`，source mismatch→Mismatch，version mismatch→VersionConflict，overflow→VersionExhausted，missing owner proof→MissingBasis，安全阻塞→SafetyBlocked；application安全映射见Step8，不裸透出内部详情。domain无I/O/日志/Outbox，application只写明确局部对象+结果，安全技术日志不等真实evidence。

### 7.2 10A SourceCoverage

依据：6B coverage字段、ConsumeSourceChange/Advance/Invalidate flow。问题：gap与partial不同，空页无法说明Complete，旧世代安全失效不能原地恢复。取舍：严格保留五状态及proof条件，所有变化包含于对应projection的view revision原子提交。

| 状态 | 条件字段 | 终态/允许 |
|---|---|---|
| Unknown | no proven progress；cursor/watermark/proof缺失可None | 非终态；正式advance/gap/安全失效 |
| Partial | owner已证明部分声明范围 | 非终态；advance/gap/失效 |
| Complete | coverage_proof+cursor+watermark全Some且同声明范围 | 非终态；新正式输入可以降低完整性，不可永远sticky |
| Gap | gap_ref Some，保留最后安全cursor/watermark | 非终态；只能bridge proof修复 |
| Invalidated | 对应SafetyBlocked正式record/source fence | 本generation终态；不原地清除 |

```text
[factory] -> Unknown
Unknown/Partial/Complete -- proven advance --> Partial/Complete
Unknown/Partial/Complete -- proven gap -----> Gap
Gap -- proven bridge + advance ------------> Partial/Complete
Unknown/Partial/Complete/Gap -- safety -----> Invalidated
Invalidated --X--> any other state
DataStale: no CoverageState transition
```

| From | To | 触发函数/flow | 前置字段 | 局部副作用/事务 | 非法错误 |
|---|---|---|---|---|---|
| factory | Unknown | SourceCoverage.unknown；Advance baseline声明source初始化 | SourceStreamRef正式；候选 | cursor/watermark/proof/gap None | MissingBasis |
| Unknown/Partial/Complete | Partial | advance；Consume/Advance | SourceCursorBasis可比较、proof仅部分；不可倒退 | 更新安全cursor/watermark/proof，清gap；projection同事务next view | MissingBasis/Mismatch |
| Unknown/Partial/Complete | Complete | advance；Consume/Advance | 正式完整coverage且cursor/watermark非None | 更新同范围三件套，清gap | MissingBasis |
| Unknown/Partial/Complete | Gap | mark_gap；projection.mark_gap→mark_gap store | 正式缺口basis，已有局部GapRef | 保留安全位置，记录gap，不占terminal success键 | Mismatch |
| Gap | Gap | mark_gap；同source继续缺口 | 同等gap重入复用ref；不同缺口需正式范围 | 同等无效变更不next；新缺口可next view | Mismatch |
| Gap | Partial/Complete | advance；Consume/Advance | 正式bridge包含已缺范围，非普通新event | 清gap并随source结果原子推进 | MissingBasis |
| Unknown/Partial/Complete/Gap | Invalidated | invalidate；两失效入口 | record.effect SafetyBlocked、targets/source匹配 | same transaction generation安全+coverage+result | SafetyBlocked/Mismatch |
| 任意 | 原状态 | invalidate(DataStale)、duplicate/late | 明确DataStale或查原终局 | DataStale只记录失效/新鲜度；late/duplicate不退cursor | 不适用 |
| Invalidated | Invalidated | 重复安全失效 | 已授权record | 不复活；去重结果 | 不适用 |
| Invalidated | Unknown/Partial/Complete/Gap | 禁止 | 即便出现较新普通source数据也不可 | 无写；显式新candidate+baseline | SafetyBlocked |

自检：五变体一致，advance/mark_gap/invalidate和store配对存在；Complete没有仅由bool/非空决定。测试切口：bridge缺失不修gap、DataStale不Invalidated、倒退cursor拒绝、Invalidated终态、snapshot不见半更新。gate=pass_with_source_proofs。

### 7.3 10B InboxItem AttentionState

依据6B derive/apply_attention与Step9 CP3/4、baseline批。取舍：只复制owner明示的attention生命周期，本地read/pin/mute/hide不改变Present/Withdrawn。

| 状态 | 作用 | 终态 |
|---|---|---|
| Present | owner当前明示存在attention，列表还需现时可见性 | 否 |
| Withdrawn | owner明示撤回，本地保留引用/意图但默认不展示 | 对普通输入终止；只有正式较新reopen证明才能Present |

```text
[owner input] -> Present or Withdrawn
Present -- owner withdrawal --> Withdrawn
Withdrawn -- newer formal reopen --> Present
same/older proven input -> no change
local flags/read intent -X-> attention lifecycle
```

| From | To | 函数/flow | 前置 | 副作用 | 非法错误 |
|---|---|---|---|---|---|
| factory | Present/Withdrawn | InboxItem.derive / InboxProjector.derive；Consume/Advance | 正式attention identity/version/state与safe subject；application ref可回读 | 与projection/source record或baseline binding同事务 | MissingBasis/Mismatch |
| Present | Present | apply_attention；新正式输入 | 同stable identity、较新可比较version | 更新safe ref/version/application；不自动已读 | Mismatch |
| Present | Withdrawn | apply_attention | 明示撤回proof | 更新状态/版本，CP5 overrides/dispositions保留 | MissingBasis |
| Withdrawn | Present | apply_attention | 正式reopen+较新version，同identity；004未闭合则拒绝 | 恢复候选条目但重新现时裁剪，不清用户意图 | MissingBasis/InvalidTransition |
| Withdrawn | Withdrawn | apply_attention | 同/新撤回依据 | 保持撤回，不倒退 | Mismatch |
| 任意 | 原状态 | 已证明旧输入/重复 | owner comparator明确old/equal，equal异内容Conflict | 不改条目；source terminal规则另表 | DigestConflict |

旧普通事件不能因包含待办词语重开，新的generation不能改变稳定InboxItemId。测试切口：推测attention拒绝、Withdrawn未正式reopen不可恢复、同identity不同generation保持local override、plain query不改生命周期。自检：二状态/正式来源/两事务路径一致，gate=pass_with_004。


### 7.4 10C RebuildAttempt

来源：6A RebuildStatus、6B request/start_baseline/accept_baseline/catch_up/mark_ready/revalidate/block/fail/supersede/complete，Step9三个恢复入口及安全失效。问题：终态与Ready回Validating需区分。取舍：四终态不复活；请求重试读原结果，新尝试由新Request显式创建，不把Blocked当可恢复等待态。

| 状态 | 必填/禁止字段 | 终态 / 下一入口 |
|---|---|---|
| Requested | baseline/continuation/failure/replacement None | 否，Advance |
| Baselining | 首批前baseline可None；非末批后baseline+continuation必Some | 否，Advance |
| CatchingUp | baseline必Some，获准接续依据必须可取得 | 否，Advance |
| Validating | baseline+完整接续proof，可重核expected partition | 否，Advance |
| Ready | candidate Validated，完整CutoverBasis/validated_revision；failure/replacement None | 否，Advance |
| Completed | 切换事务已提交；failure/replacement None | 是，只读/原操作回放 |
| Blocked | failure Some，按code的gap/invalidation条件引用；replacement None | 是，新Request才能新尝试 |
| Failed | failure Some；replacement None | 是，新Request |
| Superseded | replacement Some且同partition，不含failure | 是，只读原结果 |

```text
Requested -> Baselining -> CatchingUp -> Validating -> Ready -> Completed
                 | loop        | loop       ^          |
                 +-------------+            +----------+
                                             lawful revalidation
Requested/Baselining/CatchingUp/Validating/Ready -> Blocked | Failed | Superseded
Completed/Blocked/Failed/Superseded -X-> any state
```

| From | To | 触发函数 / flow | 前置字段/检查 | 副作用与提交 | 非法错误 |
|---|---|---|---|---|---|
| factory | Requested | request；RequestRecovery | ID/partition/mode/expected_partition明确 | attempt0→commit1，candidate/empty projection/result同事务 | Mismatch |
| Requested | Baselining | start_baseline；Advance | expected_attempt匹配、安全栅栏允许 | attempt next+result，尚不拿baseline | VersionConflict/SafetyBlocked |
| Baselining | Baselining | accept_baseline；Advance | owner proof，同baseline范围，complete=false且continuation Some | bounded候选批+bindings+attempt next+result | MissingBasis/Mismatch |
| Baselining | CatchingUp | accept_baseline；Advance | complete由正式范围proof，获准接续可定位 | 同上；不自动继续下一阶段 | MissingBasis |
| CatchingUp | CatchingUp | catch_up；Advance | 正式continuation匹配，complete=false | 同candidate批+attempt next+result | MissingBasis |
| CatchingUp | Validating | catch_up；Advance | 正式接续覆盖证明complete=true | 保存最终continuation，未promote | MissingBasis |
| Validating | Ready | mark_ready；Advance | CutoverBasis含完整coverage/current visibility，candidate revision同快照，basis.expected_attempt=expected.next | candidate.validate+attempt next同save_recovery | MissingBasis/VersionConflict |
| Ready | Validating | revalidate；Advance或candidate source更新 | 合法并发版本变化/新候选数据；不是安全失效 | candidate.invalidate_validation（若Validated）+attempt next，同事务；pointer不变 | SafetyBlocked/VersionConflict |
| Ready | Completed | complete；Advance→cutover | candidate Validated、所有basis轴+失效集合/current proofs一致 | promote/old retire/pointer+partition next/attempt next/result同事务 | VersionConflict/SafetyBlocked |
| 任一非终态 | Blocked | block；Advance/两安全失效flow | 确定性合同缺失/正式gap/已存安全失效，failure条件齐全 | attempt next+failure，当前pointer不变；安全失效与generation/coverage一起写 | MissingBasis/Mismatch |
| 任一非终态 | Failed | fail；Advance | 无效baseline/确定处理失败，failure安全分类；并非unknown commit | attempt next+failure+result，保留旧current | Mismatch |
| 任一非终态 | Superseded | supersede；SupersedeRecovery | replacement不同id、同partition、当前非终态、无环，原子复查 | 旧attempt next+replacement+result，不改变新尝试 | InvalidTransition/VersionConflict |
| 任一终态 | 原状态 | 相同原operation key重入或Query | exact stored result / 当前read | 无迁移，不再次next | 不适用 |
| 任一终态 | 任一其他状态 | 禁止 | 新key不能解锁 | 无写 | InvalidTransition |

副作用：domain只变尝试；store事务如Step9，各flow无Outbox/上游command。终态的candidate不是被删除：仍可读诊断，但source consumer必须拒绝对终态Candidate的应用；Completed后generation Current/Retired允许对应current规则，不由attempt终态自动阻止current常规投影更新。

测试切口：每行positive/negative边界、attempt overflow、same key回原状态而非当前进度、Ready basis的next version、终态四种不能Advance/Supersede；安全失效无ref不能伪failure；unknown不能Failed。自检：九状态/方法/条件字段/事务触发齐全，gate=pass_with_recovery_proofs。

### 7.5 10D GenerationRole

来源6B GenerationState与WorkspacePartition.select_generation。取舍：role只表示本地选择，不代表安全/权限/来源完整；Retired不回滚成Current，需新candidate正式恢复。

| 状态 | 含义 | 终态 |
|---|---|---|
| Candidate | 新显式尝试的隔离generation | 非终态；仅切换可Current |
| Current | partition pointer选中 | 非终态；后续切换可Retired |
| Retired | 曾current且被替换 | 本generation角色终态；安全失效仍可追加 |

```text
factory -> Candidate -- cutover --> Current -- next cutover --> Retired
Candidate/Current/Retired: safety is a separate axis
Retired -X-> Current
```

| From | To | 方法/flow | 前置 | 原子副作用 | 非法错误 |
|---|---|---|---|---|---|
| factory | Candidate | candidate；Request | 新generation、已有partition | 与Requested同事务，无pointer | Mismatch |
| Candidate | Current | promote；Advance Ready | safety Validated，attempt Ready，basis full match | pointer candidate、partition next、old retire、attempt Completed/result同时 | SafetyBlocked/VersionConflict |
| Current | Retired | retire；另一个candidate切换 | 当前pointer仍本id，新candidate同partition已获准 | old role更新和新pointer同事务，不独立retire唯一current | VersionConflict |
| 任意 | 原状态 | invalidate/Query/source普通更新 | 依据/目标匹配 | 只安全/投影轴，不改role | Mismatch |
| Retired | Current/Candidate | 禁止 | 不提供rollback API | 无写 | InvalidTransition |
| Candidate | Retired | 本范围不提供此迁移 | Superseded/Blocked保留隔离Candidate，由attempt禁止再写 | 无偷偷“删除”等新状态 | InvalidTransition |

合法组合：Candidate可Unverified/Validated/SafetyBlocked；Current可Validated/SafetyBlocked；Retired可Validated/SafetyBlocked。Current+Unverified不能由任何本范围flow产生；current正常source应用不撤销其局部安全轴，但查询仍对每次输出核验当前owner决定。候选变更才invalidate_validation。测试：一个partition最多一个Current，首次cutover old_current None，旧generation页失效，不用Retired fallback。自检：角色图不含业务授权，gate=pass。

### 7.6 10E GenerationSafetyState与失效effect

问题：Validated可能被误当持久授权，SafetyBlocked可能被普通revalidate清除。取舍：Validated只是本地候选验证轨迹；每次read/current source应用都需现时proof；SafetyBlocked在同generation安全终态，恢复要新generation/正式baseline。

| 状态 | 字段约束 | 可做 |
|---|---|---|
| Unverified | Candidate；validated_revision/cutover_basis None | 显式验证或接受安全失效 |
| Validated | Candidate需validated_revision与basis匹配；Current/Retired保留历史切换依据，不冒充现时权限 | Candidate合法变更→Unverified；安全失效→SafetyBlocked |
| SafetyBlocked | 非空正式invalidation_refs；不能清为空；role不变 | 只读安全诊断/追加失效，不能promote或原地验证 |

```text
Candidate/Unverified -- validate --> Candidate/Validated
Candidate/Validated -- candidate data change --> Candidate/Unverified
Unverified/Validated -- safety invalidation --> SafetyBlocked
SafetyBlocked -X-> Unverified/Validated
DataStale: no safety transition
```

| From | To | 方法/flow | 前置字段 | 副作用 | 非法错误 |
|---|---|---|---|---|---|
| factory | Unverified | candidate；Request | 新candidate | 依据None，无已验证事实 | Mismatch |
| Unverified | Validated | validate；Advance Validating | role Candidate、完整coverage/visibility、candidate revision匹配、无生效source安全阻塞 | 记录validated_revision/cutover_basis；与Ready同事务 | MissingBasis/SafetyBlocked |
| Validated | Validated | validate；同合法验证 | Candidate，同basis或获准重校且expected匹配 | 不据此提升owner权限 | VersionConflict |
| Validated | Unverified | invalidate_validation；候选data/gap或合法Ready回校 | role Candidate且不是SafetyBlocked | 清验证字段；Ready attempt→Validating同事务 | InvalidTransition |
| Unverified/Validated | SafetyBlocked | invalidate；两失效入口 | record.effect SafetyBlocked、affected target/source真实 | 追加去重record refs；coverage Invalidated；非终态attempt Blocked | MissingBasis/Mismatch |
| SafetyBlocked | SafetyBlocked | invalidate；新/重复安全记录 | 合法匹配basis | 只追加独立依据，不能clear | Mismatch |
| 任意 | 原状态 | DataStale/Query | 明确effect或纯读 | DataStale保存record/新鲜度，不改coverage/safety | 不适用 |
| SafetyBlocked | Unverified/Validated | 禁止 | 新baseline也不能在旧generation直接解锁 | 无写，新Request新candidate | SafetyBlocked |

安全失效时清除candidate可用validation字段；Current/Retired历史basis可以保留仅用于诊断，但任何判断以safety_state为先，不能从旧basis重新allow。新candidate不自动继承旧generation SafetyBlocked值，但必须在validate/cutover正式证明新baseline与当前source权威决定已覆盖/取代旧失效；缺证明仍Blocked。DataStale记录何时不再影响freshness需要正式新读取/基线覆盖该失效的证明，本阶段保守保持Stale，不自动按时间过期。

测试：DataStale只stale、角色current保持但read拒绝安全失效、候选数据变化撤销validation、SafetyBlocked不可被Ready→Validating绕过、source栅栏与切换CAS竞态。自检：三状态/两轴组合/失效记录/影响范围闭合；003有效性未闭合不产生allow，gate=pass_with_003。


### 7.7 10F 局部意图、LocalReadBasis与ReadClassification

不创建ReadState实体或统一read cursor状态机。LocalAttentionState.local_revision描述明确用户写入，ReadCursor按正式AttentionStreamRef唯一；ReadClassification是查询按当前安全item+正式关系的纯派生结果。scope/projection/generation变化不删除意图。

```text
LocalReadBasis: Absent -- explicit Change --> Present(revision 1)
Present(n) -- explicit valid Change --> Present(n + 1)
Query/rebuild/source event ---------> no local change
Read intent + current item + owner relation -> Read | Unread | Unknown
```

| 主语/From | To/结果 | 方法/flow | 输入条件 | 副作用 / 非法 |
|---|---|---|---|---|
| overlay不存在 | Present(1) | initialize+change；ChangeLocal | request.expected_local Absent，scope操作权限，change解析完整 | overlay+operation原子；并发已存在VersionConflict |
| Present(n) | Present(n+1) | change；ChangeLocal | expected Present(n)、checked_next、已解析变体 | 只本地相应字段，失败self不变；overflow VersionExhausted |
| read basis None | Some(正式basis) | ReadCursor.apply(Advance) | identity/stream匹配，正式已见basis | intent_revision=本次local next，保留overrides |
| read basis Some(a) | Some(b) | apply(Advance) | b与a正式可比较且不倒退 | 不清MarkUnread；不可比较MissingBasis、倒退Mismatch |
| overrides未含item | 加入item | apply(MarkUnread) | 当前可见/有效item同stream正式解析 | 集合去重；不修改owner receipt |
| overrides已含item | 不重复条目 | apply(MarkUnread) | 同合法输入 | 全命令新key仍按explicit change版本规则；同key由record拦截，无二次版本 |
| dispositions/preferences/focus/last_opened | 明确请求值 | LocalAttentionState.change | SetDisposition目标正式、SetPreference有限字段、Some ref现时可见，None清除 | 本地展示数据，不能扩大visibility |
| 当前可见item+override匹配 | Unread | ReadCursor.classify；ListInbox | stable identity可证；override优先 | 零写；缺关系不默认Read |
| 无override+正式覆盖关系 | Read | classify | 同stream/跨generation正式映射proof | 零写；source cursor不参与 |
| 无override+正式未覆盖关系 | Unread | classify | owner正式后续关系 | 零写 |
| 缺cursor/身份关系不可证/不支持映射 | Unknown | ListInbox/relate/classify | 当前item本身仍需可见 | 零写；不能Unknown→自动Advance |

LocalReadBasis::Absent/Present不是局部删除生命周期，本范围没有delete/reset overlay入口。初始LocalAttentionState/ReadCursor revision0只在未提交构造中出现；已存cursor intent_revision可0仅未设置占位，但初始化不持久化不必要空cursor。返回None focus既可能未设置也可能裁剪，不新增隐藏计数。

测试切口：同scope多stream独立；Read Advance不可比较拒绝；override跨cutover保留；source/Query不会写last_opened；本地版本变化页失效；无local不隐式持久默认值。自检：本地值更新与派生三值分开，不创建owner read truth，gate=pass_with_004。

### 7.8 10G 幂等终局与stored replay

SourceApplicationRecord只两种不可变TerminalApplyDisposition。WorkspaceOperationRecord存StoredWorkspaceResult（Provisioned/LocalChanged/Recovery/Invalidated），没有Reserved/Running生命周期；提交不确定性由技术commit attempt解析，不覆盖immutable结果。

```text
[no terminal record] -- atomic apply ---------> Applied
[no terminal record] -- proven obsolete -----> LateIgnored
[existing record] -- same key/digest ---------> replay original (no transition)
[existing record] -- different digest -------> Conflict (record unchanged)
Gap/Blocked/Retry/Rejected/Unknown -X-> fabricate terminal success
```

| From | To/结果 | trigger | 检查字段 | 副作用 / 错误 |
|---|---|---|---|---|
| 无source record | Applied | record+apply_source；ConsumeChange | 全SourceApplicationKey、digest、正式cursor、projection新revision | record/投影/Inbox/coverage同commit |
| 无source record | LateIgnored | record+apply_source | 正式Late proof；原安全cursor/revision | 只append record，不退cursor/改projection |
| 已有Applied/LateIgnored | 同原record | source_application；重复 | digest相同 | Duplicate携original/result/revision/cursor，零写 |
| 已有任一终局 | Conflict | source_application/唯一键 | digest不同 | 原值不覆写，safe Conflict |
| gap/blocked | 无terminal record | mark_gap/分类分支 | 缺口/来源合同缺失 | gap可局部写但非success key；后续正式输入可重试 |
| 无operation record | StoredWorkspaceResult对应variant | 各具名原子store | key.kind/channel、target、typed result/basis一致 | 效果+record同事务 |
| 已有operation record | 同原结果 | operation/operation_by_ref | 同key/digest，现时可见 | 原status/revision不改成当前值；recovery以后推进也不改旧结果 |
| 任一记录 | “改状态/覆盖result” | 禁止 | append-only | 无写，InvariantViolation |

WorkspaceWriteResult.delivery Committed/Duplicate只是本次交付方式；StoredWorkspaceResult::Recovery(status=Blocked/Failed)可以是**成功保存的失败终态结果**，不能把delivery Committed误解为业务恢复Completed。BaselineApplicationBinding不是source终局记录，无伪event key，映射与候选batch/operation同事务保存。

测试切口：same event key/generation唯一；different generation可独立应用但需同源proof；baseline mapping无悬空ref；unknown无记录不允许构造成功；replay保持最初attempt status。自检：没有伪Reservation状态，两个terminal语义与entry分类分离，gate=pass。

### 7.9 10H 查询姿态、版本与分页判定

只读输出无持久迁移。成功WorkspaceReadView的Available/AllowedSubset由getter给出；失败外层SafeReadFailure仅availability/code，无scope/ref/count/provenance。下面是每次查询的决策矩阵，不创建WorkspaceReadStatus owner。

```text
current scope/list/item decision missing -> fail closed
current decision valid -> select explicit mode
  Materialized -> coherent current snapshot -> safety gate -> freshness/coverage
  Transient    -> owner no-write slices ----> freshness/coverage (no durable revision)
allowed items -> stable filtering/order -> validate bound page -> safe output
```

| 轴/输入 | 输出 | 来源 | 禁止 / 测试边界 |
|---|---|---|---|
| 当前scope/权限不可证 | FailureAvailability::Blocked + NotAvailable | Scope/Visibility ports | 不因旧snapshot显示scope/hidden存在 |
| 允许scope但必需contract没绑定 | Blocked + ContractBlocked | adapter正式缺口 | 不能fake success/空Complete |
| 技术不可用且语境可公开 | Unavailable + SourceUnavailable | ports | 不把未读到数据解释为撤销/删除 |
| 已授权有安全内容（可空） | Available + AllowedSubset | compose/current bindings | AllowedSubset非全域授权 |
| owner当前version/watermark可证明+无仍适用DataStale | DataFreshness::Fresh | 正式current proof | 不用本地更新时间/缓存TTL推fresh |
| 已知数据落后或适用DataStale | Stale | 正式比较/失效record | Stale不豁免当前权限 |
| 无法比较新鲜度 | Unknown | source basis不足但安全可证 | 不能写last_refresh伪造Fresh |
| 可见声明selection完整证明 | ReadCoverage::Complete | 每正式范围proof | items为空可Complete但须proof，不能逆推 |
| 可安全表达部分/无法表达完整性 | Partial / Unknown | 裁剪后safe coverage | 不给hidden source数量/名字 |
| Materialized | Materialized(partition,generation,view,local) | 原子snapshot | 不混candidate/旧local；current缺失无自动fallback |
| Transient | Transient(source_versions) | SourceReadService no-write | 不注入fake generation/view/local revision，next None |
| 旧generation/view/local/query/visibility token | CursorInvalid | PageCursor.validate+codec | 不silent换snapshot，token不是allow证明 |
| 无local overlay | LocalReadBasis::Absent / LocalStateSurface::Absent | snapshot/find_partition | 不initialize；其余scope仍必授权 |
| candidate正在重建/已失败但current安全 | 仍读current，freshness按真实证明 | snapshot | 不从attempt Requested推全view blocked，也不读候选 |
| current SafetyBlocked | 受影响view整体fail-closed | safety轴+现时owner | 不换retired或把SafetyBlocked降为普通stale |

Fresh/Complete可独立组合，Stale/Complete也可；Unknown freshness不自动等Partial coverage。当安全unknown，不能用这些数据轴组合继续返回内容。source集合metadata和count与同一当前决定一起裁剪。表不生成任何persisted state；QueryConsistency::Strong明确拒绝，不对只读接口承诺跨域原子。

分页local QueryBinding绑定kind/scope/selection/order/limit，并与actor/generation/view/local/visibility/position整体认证加密；codec失败统一CursorInvalid。未定义owner canonical位置的Sources分页保持001/006 blocked；Inbox使用本地StablePagePosition，不混source consume cursor/attention read basis。

测试切口：stale+permission revoked拒绝、empty先list授权、scope failure零元数据、同token换actor拒绝、Current切换导致旧页失效、Transient无durable field、read no-write spy。自检：输出enum名全部来自6A/8，不创造authorization状态机，gate=pass_with_visibility_contract。

### 7.10 10I 提交与consumer入口结果分类

这些是调用结果，不是新增domain实体；技术attempt持久实现由Step11设计，当前只固定不可混淆的语义。receipt是本地处理结果，不代表L0-bus delivery状态。

```text
commit call -> Committed(value) | NotCommitted | Unknown(attempt)
Unknown -> authoritative lookup -> Operation | Source | Gap | NotCommitted | Pending
Pending -> keep unknown; never claim rollback
consumer terminal -> Applied/LateIgnored/duplicate; all other dispositions are not success keys
```

| 分类集合 | 来源/条件 | 允许后续 | 禁止 |
|---|---|---|---|
| CommitOutcome::Committed | store已提交且结果可回读 | 构造当前获准结果 | 以预期结果替代提交确认 |
| NotCommitted | 权威事务已终止且不可能晚提交 | 重新读expected后按相同业务key受控重试 | 把timeout/None当此结果 |
| Unknown | 无法确认事务结果 | resolve_commit | 直接改key执行/记录业务Failed |
| CommitResolution::Operation/Source/Gap | 权威已保存对象/marker | 回精确结果（安全裁剪） | 重新apply或重复next revision |
| CommitResolution::Pending | 仍不可证终局 | 保持OutcomeUnknown/后续只读查询 | 生成result_ref/success |
| WriteDelivery::Committed/Duplicate | 原子新提交/相同key原结果 | 本次结果包装，无迁移 | Committed等同恢复Completed |
| SourceChangeReceipt::Applied/LateIgnored/Duplicate | 已存terminal record | transport可按正式绑定下一动作 | 声称ACK/quarantine已经发生 |
| Gap | 已存局部gap无terminal record | 等正式bridge/replay/rebuild | 占用source success键 |
| Blocked/Retry/Rejected/Conflict | 合同缺失/暂不可用/非法输入/异digest | 保持各自安全姿态；Retry须正式策略 | 包装成success、写上游正文 |
| SourceChangeReceipt::Unknown | commit未知 | 先权威lookup | 可自动原样再次写 |
| SourceInvalidationReceipt::NoTargets | 当次既有目标为空 | 新delivery可重新枚举 | “永久无影响”全局成功键 |
| Invalidation Applied/Duplicate/Blocked/Retry/Rejected/Conflict/Unknown | 单partition独立分类 | PageReceipt逐项返回/处理未决 | 少数成功→全fanout成功 |

SourceInvalidationPageReceipt不是全局状态机：next只本地枚举seek，未决项必须先解决；重投已成功项读原结果。SourceChange的Gap没有terminal receipt record，恢复后的同event可Applied；已Applied再重复不是状态回退而是交付Duplicate。非法映射为ApplicationError::InvariantViolation→NotAvailable，无额外truth写。

测试：unknown→Pending重复保持未知、未知已提交返旧结果、gap无终局键、fanout中一个Unknown不能安全跳页、NoTargets不建分区、bus适配未闭合不能宣布ACK。自检：结果variant全集来自7/8，安全技术状态不冒充实现证据，gate=pass。

### 7.11 10J AdapterAvailability观测

| 值 | 来源 | 当前行为 / 后续 | 非法与测试 |
|---|---|---|---|
| Bound | 配置/driver已接线的本次观测，failure None | RuntimeBuilder.validate_bindings可通过该slot；每次实际调用仍会失败 | 不能当readiness/signoff/owning contract闭合 |
| Unavailable | 技术无法访问，failure Some安全code | 受影响功能Unavailable，不生产fake fallback | missing cause组合InvalidValue |
| ContractBlocked | owner/schema/绑定缺失，failure Some | 受影响正向功能blocked/fail-closed | 不能以设置Bound绕正式source契约 |

```text
binding observations -> validate required slots -> accept assembly or reject
(no persistent runtime/adapter lifecycle is introduced)
```

观测对象自身不可用任意setter改状态，RuntimeBuilder.record按slot唯一；重新装配需要新的观测集合，不自动切换业务generation。Query根本不读取builder就绪来决定allow，真实可见性仍来自owning ports。测试为未来装配unit contract，不运行health probe，不产生真实readiness。自检：不加runtime execution owner。

### 7.12 跨状态机审计、非法转换与停审

| 审计项 | 结论 / 唯一口径 |
|---|---|
| enum命名 | CoverageState Unknown/Partial/Complete/Gap/Invalidated；AttentionState Present/Withdrawn；RebuildStatus九值；GenerationRole三值与Safety三值；没有口语别名 |
| 触发覆盖 | 每持久行对应6B工厂/成员及Step9用例；query只派生/读，entry分类在7/8已定义 |
| owner边界 | 无source authorization/业务生命周期自造；SafetyBlocked只是本地消费决定，不裁决owner truth |
| 终态 | attempt四终态不复活；Retired不反选；SafetyBlocked与Invalidated不旧generation原地清除 |
| 多轴一致 | candidate validation失效与Ready回Validating同commit；安全失效→Blocked且不清安全轴；cutover只切current/candidate不改CP5 |
| 幂等/unknown | 终局record不可变；query当前裁剪不改stored结果；unknown没有空记录就rollback的捷径 |
| 测试承接 | 每族已列positive/negative/并发切口，仅planned未执行；Step16/05/06应复用正式enum名 |
| 配置/实施边界 | 没有预借Step11~19实现/driver/错误重试配置作为已完成；本步已定的局部安全约束必须后续承接 |
| 外部blocker | 001~008/006-S未关闭；无新owning blocker；新发现均本地读写/字段闭环修订，回源6/7/8/9 |

默认未列持久迁移一律拒绝；拒绝不写对象、不append假结果/Outbox/上游状态。日志若需要只记录安全code/operation family/Core trace，完整可观测性在未进入的Step15继续设计，不声称日志/evidence已生成。历史审计剔除governance truth/Outbox/handoff/job lifecycle，只参考其状态主语筛选、按族独立矩阵和跨flow校验方法。

回填正式§9：筛选后的状态主语、每族状态集合/ASCII图/转换或分类矩阵、非法与副作用、跨轴不变量；过程性gate/批次留本文件。**本轮停点是Step10完成，Step11开始前；不得自动继续持久化设计或装配正式03。**


### 7.13 本轮最终静态审计记录

2026-09-07，唯一agent执行，只读检查Markdown与设计文本，非项目测试/编译。Step5~10六主Step均具1~10十段，Step6三个附录按模块/对象组组织。最终扩展检查本轮14个文件（9份Step产物、2份台账/flow、3份02回源文件），围栏与表格结构无异常、88个本地Markdown链接可解析、所有planned `.rs` 引用位于Step4既定布局，无新增计划源码文件。协议独立小节14/14、函数流14/14、同文件重复类型定义0；源代码型公开字段的未定义外部类型逐一对应6A/7/8的blocked slot清单，没有把它们注册为已实现本地schema。

人工交叉审查修正：6B/6C卡片顺序；Core QueryConsistency实际只有Strong/Eventual，首版拒Strong；service/entry补全方法而非只给名字；VisibilityPort/ReadPort增补并入唯一trait；candidate event读取、失效逐目标CAS、baseline provenance回读、Ready basis提交后attempt版本、source gap权威lookup、SourceInvalidation逐分区分页结果。局部修复不增owner/入口/业务状态；02只修read_cursors集合并重新停审。

事实边界：正式03不存在，Step11~19文件不存在，目标实现文件未创建；未运行cargo/tests/owner集成，未产生run_id/artifact/report/evidence/verdict/signoff/readiness或baseline事实，未commit。实际外部source/visibility/attention/baseline/protocol缺口仍实施blocker，不因本Step“completed”关闭。


## 8. 回填草稿

§7已形成状态主语筛选、10个状态/分类组、逐组ASCII图/矩阵、非法转换与跨状态审查；正式§9按对应组回填，当前不装配正式03。

## 9. 待确认

WS-UP-001~008/006-S保持open，具体正向schema/绑定仍blocked；不跨项目回写。

## 10. 下一步门禁

Step10与Step5~10交叉静态审查已完成，停在Step11开始前；next_allowed_action=wait_user_before_step11。仅本地设计通过，WS-UP-001~008/006-S仍open；不声称实现、测试、集成或用户签署完成。
