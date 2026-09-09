# Step 11. 持久化、事务与一致性契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填章节：`03-详细设计.md` §10

## 1. Step 状态

| 项目 | 内容 |
|---|---|
| 当前状态 | completed / pass_with_external_slots；含本轮恢复补审 |
| 输入 | Step 6 对象、Step 7 ports、Step 9 flows、Step 10 state matrix |
| 本步结论 | 采用具名原子提交；Query 零写；不设置 outbox |
| 仍开放 | WS-UP-001/002/003/004/005/006/007/008/006-S |

## 2. 本步输入

[Step6-B](03_ddd_step_06b_domain_objects.md)、[Step6-C](03_ddd_step_06c_support_services_entries.md)、[Step7](03_ddd_step_07_trait_port_adapter_contracts.md) §7.4/7.8、[Step9](03_ddd_step_09_function_flows.md) §7.1~7.10、[Step10](03_ddd_step_10_state_matrix.md) §7.2~7.10；SOP Step11与书写规范§5.10。参考governance Step11的逻辑存储、逐函数和事务批次；不继承其trace truth、outbox或history表。

## 3. SOP 问题回答

1. Workspace 拥有 `WorkspacePartition`、`PartitionProjection`、`SourceCoverage`、`SourceApplicationRecord`、`InboxItem`、`LocalAttentionState`、`ReadCursor`、`RebuildAttempt`、`GenerationState`、`InvalidationRecord`、`WorkspaceOperationRecord` 及其版本和局部结果。identity、conversation、work、process、governance、artifact、runtime、tools、SDK/cache、archive 的正文与决定只保存 typed ref、owner proof 或裁剪后的快照。
2. 物化对象、候选 generation、local overlay、source cursor、view revision、attempt version、operation record 分开存储；不以时间戳或 page cursor 代替业务版本。
3. repository 只提供 Step 7 已列出的具名函数；禁止 `save(entity)`、隐式 upsert 和 query 侧写入。外部 owner 的 safe query/event schema 未闭合时，adapter 返回 `ContractBlocked`。
4. 每个写 flow 先读 coherent snapshot，再由 domain 生成 tentative commit，最后由一个 `WorkspaceAtomicStore` 方法执行 CAS 事务。事务 unknown 必须由 `WorkspaceReadPort.resolve_commit` 权威回读。
5. 不需要 workspace outbox、publisher 或 archive handoff。L0-bus delivery 与 owner truth 不由本仓确认；本地 consumer receipt 只记录处理结果。

## 4. 当前文档问题诊断

初稿只列主表会漏baseline provenance和commit attempt回读；“具体driver以后选”也不能替代unknown终局证明。补充局部逻辑映射和必要的driver门禁；不会新增公开接口或业务状态。原“coverage revision”“generation-local validation revision”易被误读为新版本，统一使用现有ViewRevision及GenerationState字段。

## 5. 改动前后对比

| 原骨架 | 本步收口 | 可验证差异 |
|---|---|---|
| 具名store调用 | 每个调用的锁域、提交集、唯一性 | 部分写入不可见 |
| unknown回读 | 成功映射持久化，缺行返回Pending | 无负向证明不能重试 |
| baseline裸application ref | typed binding与operation同事务 | Inbox来源可回链 |
| 安全失效集合 | 分区串行化与集合全文比较 | 新失效不能被cutover漏掉 |

## 6. 设计取舍

本步固定逻辑存储合同，尚不选择数据库产品。写事务需在同一partition内串行化（可由行锁或具备等价谓词冲突检测的串行事务实现）；snapshot使用一个只读MVCC快照。网络查询与proof解析均在写事务之前完成。跨owner的现时有效性仍依赖WS-UP-003的正式合同，本地锁不提供跨域授权原子性。

不设后台GC或幂等TTL：当前无清理入口，原记录与安全栅栏必须保留；空间不足显式拒绝新增写，不能先删记录再接受重复。物理保留/迁移实现列入后续配置与实施门禁。

## 7. 结构化中间产物

### 7.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方 | 读取方 | 一致性要求 |
|---|---|---|---|---|
| WorkspacePartition | domain / application | PartitionService、RecoveryService cutover | 全部 Query、Recovery | stable scope key 唯一；partition version CAS |
| PartitionProjection | domain / application | ProjectionApplyService、RecoveryService | Query、Recovery | generation/view revision 同一分区原子可读 |
| SourceCoverage | projection | ProjectionApplyService、RecoveryService | Query、Recovery | cursor/watermark 只能来自 owner proof |
| SourceApplicationRecord | projection | ProjectionApplyService | consumer replay、诊断 | key+digest 不可变；仅 Applied/LateIgnored 终局 |
| InboxItem | inbox projection | ProjectionApplyService | Inbox Query | 同 source application 原子写入；owner attention 输入可追溯 |
| LocalAttentionState / ReadCursor | local attention | LocalAttentionService | local/inbox Query | local revision CAS；不随 generation 切换删除 |
| RebuildAttempt / GenerationState | recovery | RecoveryService | recovery Query、cutover | attempt、role、safety 三轴按具名事务提交 |
| InvalidationRecord | recovery | RecoveryService | Query safety gate、诊断 | append-only；每目标版本逐一校验 |
| WorkspaceOperationRecord | domain / application | 两Command、四Operations、source invalidation逐partition | operation Query、unknown resolution | operation key+digest 唯一；结果不可覆盖 |

### 7.2 逻辑存储契约

| 存储对象 | 主键 / 唯一键 | 关键索引 | 版本字段 |
|---|---|---|---|
| partitions | `WorkspacePartitionId`; `(principal, StableScopeKey)` unique | principal+scope、current generation | `PartitionVersion` |
| projections | `(partition, generation)` | partition+generation、source stream | `ViewRevision` |
| source_applications | `SourceApplicationKey(owner, stream, event, partition, generation)` unique；result_ref unique | source owner/stream/event | stored cursor/revision，不自增 |
| coverage | `(partition, generation, stream)` unique | stream、coverage state | 所属projection的ViewRevision；无独立计数器 |
| inbox_items | `(partition, generation, InboxItemId)` unique | stable attention identity、state | view revision |
| local_attention | `(partition)` unique | principal+partition | `LocalRevision` |
| read_cursors | `(partition, AttentionStreamRef)` unique | stream+last basis | local revision |
| recovery_attempts | `RebuildAttemptId`; active partition index | partition+status | `AttemptVersion` |
| generations | `(partition, GenerationId)` unique；每partition最多一个Current | partition+role | validated_revision是ViewRevision；并发比较role/safety/basis全文 |
| invalidations | `InvalidationId` unique | partition+source+effect、generation目标 | append-only；不同依据可影响相同目标，无target-only unique |
| operation_records | `WorkspaceOperationKey(actor_id, scope, channel, kind, key)` unique；result_ref unique | partition+operation ref | immutable result |
| baseline_applications | `ApplicationResultRef` unique，与source结果ref命名空间互斥 | partition+generation+operation | Step7 BaselineApplicationBinding全部字段；append-only |
| gap_results | `CommitAttemptId` unique | GapRef、partition+generation+stream | 技术提交回执；不占SourceApplicationKey |
| commit_results | `CommitAttemptId` unique | 完整business key、digest、result binding | 不可变；与效果同事务插入 |

分表仅是逻辑投影：ReadCursor属于LocalAttentionState集合；SourceCoverage与InboxItem属于PartitionProjection集合。拆成物理行时，adapter必须原子装配全部集合并验证FK；不能出现无父partition/generation的记录。外部ref/proof按owner正式codec序列化，缺codec时相关正向路径blocked，不能存任意JSON。

`commit_results`位于infra/store_adapter.rs的技术存储，不新增domain对象。逻辑字段为：attempt: CommitAttemptId；binding: Operation(key: WorkspaceOperationKey, digest: SafeInputDigest, result: WorkspaceOperationRef) / Source(key: SourceApplicationKey, digest: SafeInputDigest, result: ApplicationResultRef) / Gap(key: SourceApplicationKey, digest: SafeInputDigest, gap: GapRef)。变体必须完整保存对应字段；每次提交只选一类。result FK、业务效果与此回执同事务；相同attempt异binding拒绝。Gap回执只证明这次gap事务，后续同source key仍可Applied。完整签名沿Step7，不另导出通用技术写API。

物理数据库、DDL、迁移和具体锁类型留给 `04-配置设计.md` 与实施阶段；上述键、唯一性和版本语义不可削弱。

### 7.3 Repository 函数与事务边界

下表签名为去掉self与lifetime的阅读简写；唯一完整可调用定义为Step7 §7.4/7.8（PortFuture含ApplicationError）。额外读面source_snapshot、invalidation_snapshot、recovery_snapshot都必须同一分区快照；baseline_application校验来源FK；affected_target/affected_targets只枚举已存分区，按UUID bytes seek，无写与授权副作用。

| 函数签名 | 作用 | 锁 / 事务要求 | 返回 / 错误 |
|---|---|---|---|
| `find_partition(&ActorId, &StableScopeKey) -> PortFuture<Option<WorkspacePartition>>` | 只读定位 | read transaction；不创建 | `None` 或 `ApplicationError` |
| `snapshot(WorkspacePartitionId) -> PortFuture<Option<WorkspaceSnapshot>>` | 读取 current projection、local、invalidations | coherent read | 缺失返回 `None`，不伪造空 |
| `operation(&WorkspaceOperationKey) -> PortFuture<Option<WorkspaceOperationRecord>>` | 查既有结果 | read-only | 同 digest 回原记录；异 digest 冲突 |
| `source_application(&SourceApplicationKey) -> PortFuture<Option<SourceApplicationRecord>>` | 查 source terminal | read-only | 不重放 domain |
| `resolve_commit(CommitAttemptId) -> PortFuture<CommitResolution>` | 解析提交不确定性 | 权威结果读取 | Operation/Source/Gap/NotCommitted/Pending |
| `provision(ProvisionCommit) -> PortFuture<CommitOutcome<WorkspaceOperationRecord>>` | 分区首次创建 | partition+operation 同事务 | CAS / unique conflict |
| `change_local(LocalChangeCommit) -> PortFuture<CommitOutcome<WorkspaceOperationRecord>>` | overlay 与操作记录同写 | 锁partition并检查expected；只写local/record/commit回执，不改partition version | expected mismatch / unknown |
| `apply_source(SourceApplyCommit) -> PortFuture<CommitOutcome<SourceApplicationRecord>>` | projection、inbox、coverage、cursor、record 原子应用 | 单 partition 原子事务 | Applied/LateIgnored/Unknown |
| `mark_gap(SourceGapCommit) -> PortFuture<CommitOutcome<GapRef>>` | 记录非终局 gap | coverage/gap marker 同事务 | Gap 不占 source success key |
| `save_recovery(RecoveryCommit) -> PortFuture<CommitOutcome<WorkspaceOperationRecord>>` | 保存 attempt/candidate/baseline | attempt、candidate、operation 同事务 | CAS / ContractBlocked |
| `cutover(CutoverCommit) -> PortFuture<CommitOutcome<WorkspaceOperationRecord>>` | current 指针切换 | old/new generation、partition、attempt、result 同事务 | VersionConflict / SafetyBlocked |
| `invalidate(InvalidationCommit) -> PortFuture<CommitOutcome<WorkspaceOperationRecord>>` | 逐目标安全失效 | record、coverage、generation safety、result 同事务 | MissingBasis / VersionConflict |

### 7.4 一致性策略

| 场景 | 策略 | 失败后状态 |
|---|---|---|
| source application | owner proof、source key、current generation、view expected 全部匹配后一次提交 | self 不变；可记录 gap；不推进 cursor |
| local change | expected local revision 与 overlay 存在性 CAS | `VersionConflict`；不创建隐式 overlay |
| recovery advance | attempt version、candidate view、baseline binding 一起校验 | technical失败保持原状态；只有具名failure依据可保存Blocked |
| cutover | candidate Validated、safety proof、partition pointer expected 同时满足 | 旧 current 保留；不 fallback 到 retired |
| invalidation | owner validity 与每个 affected target 的版本都成立 | 已提交目标保留独立结果；未知提交先 lookup |
| query | 只读 coherent snapshot 或 owner safe slices | 缺 proof 时 fail-closed；不写 refresh/read cursor |

### 7.5 写事务展开与失败恢复

| 场景 | 开始/提交 | 原子写集合 | 回滚条件 |
|---|---|---|---|
| Provision | proof准备完成→查unique→提交 | partition(version1,current None)、operation、commit回执；不初始化local | scope/key冲突或结果不一致 |
| Local | 锁partition→Absent/Present CAS→提交 | local(next)、operation、回执；其余只读校验 | expected、目标resolution不符 |
| Applied | 锁partition→复查target/attempt/失效集合→提交 | projection slices+inbox+coverage/cursor+view next、terminal record、candidate safety/attempt必要更新、回执 | 任何FK/版本/依据不符 |
| LateIgnored | 锁partition→正式late proof与终局key复查→提交 | 仅terminal record和回执；保存原安全cursor/revision | 无正式obsolete证明 |
| Gap | 锁partition→gap与target校验→提交 | coverage/gap、必要view next、candidate撤销validation/Ready回Validating、gap回执 | 不允许跳cursor或写terminal success |
| Request/Advance/Supersede | 锁partition→attempt/candidate CAS→提交 | attempt/candidate/projection、baseline bindings、operation、回执；Supersede原子复查replacement存在且同partition无环 | 终态、版本、来源或replacement不符 |
| Cutover | 锁partition→全basis比较→提交 | new Current、old Retired、pointer/partition next、attempt Completed、operation、回执 | candidate/view/attempt/pointer/失效集合任一变化 |
| Invalidate | 锁partition→枚举目标与before全文复查→提交 | append invalidation、各target projection/safety、必要attempt Blocked、operation、回执 | 目标集合遗漏、版本变化、依据不成立 |

操作记录竞争优先完整key比digest：命中同digest返回原结果，再做现时安全裁剪，不用旧expected拒绝合法replay。不同key竞争由CAS拒绝；不能给另一个key伪造旧操作的成功记录。新candidate插入、source应用和失效共用partition串行化域，检查该partition全部适用失效；不存在独立“全平台source授权栅栏”写入。

成功回执在权威存储可查→解析Operation/Source/Gap并核验关联记录；关联记录缺失→InvariantViolation，不补造。缺回执只能Pending；NotCommitted必须附带driver已证明事务终止且不能晚提交的内部确认，本步不伪造该能力。驱动终局证明/重启识别机制属于WS-LOCAL-001，在具体driver验证前禁止自动重试unknown。租约超时、连接断开、进程退出、只读副本未见记录都不构成回滚证明。

查询读取同一MVCC快照，返回后复核当前owner有效性；不持写锁、不为分页持久化snapshot。超出装配内存/行数预算整体报安全资源失败，不返回截断的“Complete”。安全失效优先于Fresh/Stale判断；普通gap可安全Stale/Partial，SafetyBlocked禁止读内容。ASCII图不另画：Step9/10已有顺序/状态图，本步事务表足以表达原子集合。

## 8. 回填草稿与审计

正式 §10 应保留：数据所有权表、逻辑存储键、具名 repository、七类事务边界和“无 outbox/no-write query/unknown 先回读”规则。字段级合同回指 [Step 7](03_ddd_step_07_trait_port_adapter_contracts.md)、[Step 9](03_ddd_step_09_function_flows.md) 和 [Step 10](03_ddd_step_10_state_matrix.md)。

审计结果：所有可变对象均有 owner、版本和写入 flow；Query 没有写 port；source gap 不伪造成功；local 与 generation 分离；WS-UP 缺口只形成 blocked slot。进入 Step12 的条件已满足。

## 9. 待确认

- 具体 durable driver、隔离级别、索引实现和迁移工具待 04/07；不改变本步语义。
- owner event cursor/baseline canonical schema 待 WS-UP-002；application/adapter在准备阶段阻塞受影响调用，store不能为缺字段生成替代值。
- WS-LOCAL-001：durable driver终局证明、重启回读和锁域验证未执行；当前只定义能力要求，阻塞真实durable交付。

## 10. 下一步门禁

`Step 11 = completed_stop_review`；允许进入 Step12，正式03仍不可装配。
