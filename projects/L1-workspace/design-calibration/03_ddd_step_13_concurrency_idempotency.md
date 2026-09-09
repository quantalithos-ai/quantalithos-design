# Step 13. 并发、幂等与重入保护

> SOP Step13；书写规范§5.12；回填正式03 §12。

## 1. Step 状态

completed / pass_with_external_slots；恢复补审已完成。前序Step12通过；下一步Step14。

## 2. 本步输入

[Step6-A](03_ddd_step_06a_shared_contracts.md)两个完整key与版本；[Step8](03_ddd_step_08_protocol_contracts.md) digest与各DTO；[Step9](03_ddd_step_09_function_flows.md) S0及14 flow；[Step11](03_ddd_step_11_persistence_transaction_consistency.md)、[Step12](03_ddd_step_12_error_recovery.md)。参考governance Step13的逐资源竞争和重入矩阵；不采用其reservation/outbox模型。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些并发修改？ | 所有同partition写入、候选推进/失效/cutover、local修改；分区首次创建竞争stable key。 |
| 哪些可能重复？ | 两Command、四Operations、两Consumer；Query重复无业务副作用。 |
| key来自哪里？ | metadata唯一key或owner正式event identity，按§7.2完整结构编码。 |
| 重复返回什么？ | 同key同digest读原immutable result；异digest Conflict；Gap不是成功去重键。 |
| 如何验证？ | 在读后/提交前设屏障，再执行两调用，检查原子集合和revision只推进获准次数。 |

## 4. 当前文档问题诊断

首批把partition放进Recovery operation key，漏channel；这与Step6-A不一致。修正为所有Operation使用相同五字段key，partition/expected/budget属于digest。首批“终态直接回原结果”缺少同key条件，已改为新key不能复活终态。

## 5. 改动前后对比

| 原歧义 | 当前合同 |
|---|---|
| 入口名+key即幂等 | actor_id+stable scope+channel+kind+key全量唯一 |
| expected变化仍可同key重试 | expected入digest；新expected是新显式意图 |
| Unknown自动下一轮写 | 先权威解析；Pending禁止替代写 |
| fanout一条成功即全成功 | 每partition独立receipt；不跳未决目标 |

## 6. 设计取舍

不建in-flight business reservation，不为幂等独立增加Running状态。store同partition串行化+唯一键+CAS，进程内锁不是持久正确性前提；若driver无法保证则WS-LOCAL-001阻塞。幂等窗口首版不提供TTL/删除/键重用；记录缺失或容量不足不能改成重新成功。表已表达竞争与恢复顺序，不新增ASCII图。

## 7. 结构化中间产物

### 7.1 并发场景

| 场景 | 冲突资源 / 控制 | 失败与结果 | 最小测试 |
|---|---|---|---|
| 同key Provision并发 | operation unique先检查；stable partition key unique | 一次创建，其余原结果；异digest Conflict | 并发开始均未见partition |
| 不同key Provision相同scope | (principal,stable scope)唯一 | 一胜一Conflict；不得给第二key伪Provisioned | operation记录只保存获胜请求 |
| 两次ChangeLocal | Absent/Present LocalReadBasis CAS；锁partition | 一次local next；旧expected Conflict | Absent初始化与已有overlay均测 |
| Source Applicable竞争 | projection ViewRevision与完整source key | 同key原terminal；不同key重新正式classify | 不按到达先后补cursor |
| Late与Applicable竞争 | 同partition锁+source正式顺序证明 | late仅append，原cursor/view不变 | late不能回退 |
| Gap与bridge输入竞争 | coverage/gap、candidate view/attempt | 旧gap CAS失败重新读；不会覆盖已推进cursor | gap无terminal键 |
| Candidate event与Advance | candidate view/role/safety、attempt version | 变更撤销validation；Ready回Validating | 同事务修改，不漏attempt |
| Candidate event与Supersede | attempt终态校验 | 后提交source拒绝；既存Applied可安全replay | 终态candidate不得接新事件 |
| 两个Advance | expected attempt/view/partition | 一次batch和stored result；另一Conflict或Duplicate | 基线bindings不重复 |
| Cutover与Cutover | pointer/partition expected与完整CutoverBasis | 一个Current；另一重新校验或Conflict | 不双Current |
| Cutover与Invalidate | 锁域相同；失效集合全文/目标版本CAS | 旧basis不能promote；owner即时撤权fail-closed | 两种提交顺序都测 |
| Local与Cutover | local独立，partition expected仍检查 | local不可被切换重置；必要Conflict | read_cursors/overrides保存 |
| Query与所有写 | 单次MVCC，页绑定全轴 | 返回完整旧/新快照；下一页旧轴CursorInvalid | 无持久页snapshot |
| 多partition失效 | 逐partition事务；无跨域锁 | 部分结果不冒充整体原子 | 第二目标失败保留首目标 |

### 7.2 精确key和窗口

Kop = WorkspaceOperationKey(actor_id: ActorId, scope: StableScopeKey, channel: OperationChannel, kind: OperationKind, key: IdempotencyKey)。
Ksrc = SourceApplicationKey(owner: SourceOwner, stream: SourceStreamRef, event: SourceEventIdentity, partition: WorkspacePartitionId, generation: GenerationId)。

| 入口 | key来源 / channel / kind | digest中的区别字段 | 窗口 / 重复处理 |
|---|---|---|---|
| ProvisionWorkspacePartition | metadata.request.idempotency_key；Command/Provision | scope、全部DTO字段 | 无自动过期；原Provisioned |
| ChangeWorkspaceLocalState | metadata.request.idempotency_key；Command/ChangeLocal | partition、expected_local、change全部变体载荷 | 原LocalChanged |
| RequestWorkspaceRecovery | metadata.idempotency_key；Operations/RequestRecovery | partition、mode、expected等全部DTO字段 | 原Requested结果，不返回当前进度 |
| AdvanceWorkspaceRecovery | metadata.idempotency_key；Operations/AdvanceRecovery | partition、attempt、expected、budget | 原该次batch结果 |
| SupersedeWorkspaceRecovery | metadata.idempotency_key；Operations/SupersedeRecovery | target、replacement、expected | 原Superseded结果 |
| InvalidateWorkspaceView | metadata.idempotency_key；Operations/InvalidateView | 完整target与basis、expected | 原Invalidated结果 |
| ConsumeSourceChange | 正式event构造Ksrc | 正式payload/schema/version/cursor与target | 原Applied/LateIgnored；无任意TTL |
| ConsumeSourceInvalidation | Kop；SourceInvalidation/SourceInvalidation | 正式事件与每目标语义 | 子key=正式event canonical+partition UUID bytes+target principal canonical，length-prefix无歧义 |
| 六Query | 无key、无幂等写 | page仅绑定查询语境 | 重复读当前获准结果，不固定历史 |

Operation actor_id是有效调用身份；失效consumer保留认证source actor，业务target principal不得替换认证身份。恢复请求partition不属于Kop稳定身份，但必须入digest与scope检查。外部event/stream/anchor canonical字段未闭合时阻止key构造（002/005），不退回字符串拼接。

### 7.3 Digest规范与重入顺序

唯一编码规则为Step8 §7.2：SHA-256；operation域workspace.operation.v1，source域workspace.source.v1；字段按DTO声明顺序，以u32大端length-prefix、u64大端整数、bool 0/1、enum名称UTF-8、Option标志、Vec长度编码。长度超过u32或不合法集合先拒绝；集合按正式唯一key排序，不得重复。所有影响语义的expected、budget、target、selector入digest；trace/request_id、临时proof、时间和随机结果ID不入。

Owner canonical codec未闭合即ContractBlocked；不以Debug、JSON、字符串trim、display name替代。分页after/limit等调度参数不得改变source invalidation的单target效果或业务key；若同event id出现不同实质basis仍异digest Conflict。

| 重入来源 | 保护 | 下一动作 |
|---|---|---|
| 客户端网络重试 | 当前scope授权→完整key/digest→原record | replay原status/version，重新裁剪输出 |
| 新expected继续操作 | 原unknown先resolve；旧事务确定终止/已提交 | 由调用方作新决策、新key；不得隐式改旧请求 |
| Operation终态后新key | domain终态检查 | Conflict，新的恢复需新Request/new candidate |
| Unknown且结果缺失 | commit_results权威查询 | Pending；driver正式终止证明才NotCommitted |
| Gap后重新投递 | 无source终局key；重新owner classify | bridge proof合法可Applied，否则继续Gap/Blocked |
| baseline分页重跑 | operation result+BaselineApplicationBinding原子 | 不重构另一份Inbox来源 |
| fanout重投 | child key逐partition查原值；新目标重新正式解析 | 先解决未决项再移动next |
| NoTargets后新delivery | 无global完成键 | 重新枚举；新candidate仍受当前source决定约束 |

相同业务key已经成功但此次driver返回Committed(original)时，service交付分类必须为Duplicate：对照拟创建result_ref与返回record的result_ref；拟创建ID必须全新且唯一，UUID碰撞直接冲突。不根据当前版本推断新旧结果。该条细化Step7 CommitOutcome“可回原记录”的交付识别，不改公开schema。

### 7.4 自检

完整键与Step6-A逐字段一致；digest与Step8编码一致；源terminal只有两值；无reservation；local版本与generation分离；CAS竞争可回指Step11事务。fake只可验证本地机制，未闭合owner proof的正向集成仍blocked。

## 8. 回填草稿

正式§12引用§7的竞争、键、窗口和重入表；不复制governance的全局reservation/TTL/outbox重跑机制。Step16承接屏障竞争测试。

## 9. 待确认事项

WS-UP-002/003/004/005阻塞真实source/visibility/attention身份；WS-LOCAL-001阻塞durable并发与unknown终局验证；记录保留容量/运营处置交04/07，禁止本轮自增清理能力。

## 10. 进入下一步条件

并发、幂等键计算、duplicate结果、unknown和fanout重入均有确定处置。补审通过，进入Step14。
