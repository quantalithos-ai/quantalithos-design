# Step 15. 可观测性与审计埋点契约

> SOP Step15；书写规范§5.14；回填正式03 §14。

## 1. Step 状态

completed / pass_with_external_slots。恢复补审完成；日志字段、指标、局部审计来源与故障行为已收口，进入Step16。

## 2. 本步输入

[Step8](03_ddd_step_08_protocol_contracts.md)十四入口及safe failure；[Step9](03_ddd_step_09_function_flows.md)逐flow提交点；[Step11](03_ddd_step_11_persistence_transaction_consistency.md)局部记录；[Step12](03_ddd_step_12_error_recovery.md)、[Step13](03_ddd_step_13_concurrency_idempotency.md)、[Step14](03_ddd_step_14_config_external_binding.md)。参考governance Step15的runtime/business audit区分与低基数规则，裁剪其publisher、handoff与治理trace主体。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些flow须审计？ | 两Command、source terminal、显式维护、失效以既有同事务局部记录为审查依据；Query不创建持久审计对象。 |
| 哪些失败记日志？ | 合同缺失、CAS冲突、unknown、完整性缺陷、输入拒绝与adapter失败；只写允许字段。 |
| 哪些路径需指标？ | 14入口结果、延迟、consumer分类、冲突、unknown、依赖故障与观测丢弃。 |
| 字段如何裁剪？ | §7.1白名单；不输出subject、正文、cursor、owner proof、业务key/digest。 |
| 哪些留运维？ | 日志sink、采样、保留、告警阈值、值班与dashboard；不在本文声称启用。 |

## 4. 当前文档问题诊断

初稿把partition/stream直接放日志，把多个partition的ViewRevision放一个role gauge，既可能泄露关系也无可比较意义；改为默认只记录固定类别和宿主安全关联。记录提交前的“成功”也可能虚构事实，现区分entry完成与已确认提交。

## 5. 改动前后对比

| 原问题 | 修正 |
|---|---|
| 所有日志必须有业务ID | 只允许宿主核验后的trace/request关联；业务ID留受控记录读取面 |
| revision全局gauge | 删除该指标；版本不跨partition/generation比较 |
| 日志成功=业务完成 | operation结果与delivery分开，Recovery Blocked也可能已提交 |
| 日志可替代局部审计 | 持久记录仍按Step11，sink失败不重跑事务 |

## 6. 设计取舍

不新增AuditRecord、AuditPort、outbox或全平台审计真相。运行日志/指标是宿主技术输出，可在Query中使用，但不写workspace数据库、不刷新视图、不生成证据文件。日志允许损失；业务审查依既有不可变记录而非日志完整性。无额外图，埋点与记录表覆盖全部位置。

## 7. 结构化中间产物

### 7.1 字段白名单

这些是技术埋点字段合同，不是新的业务DTO。实现位于既有entry、application编排点和infra wrapper；domain仍纯计算。

| 字段 | 类型 / 来源 | 约束 |
|---|---|---|
| entry_kind | 固定14入口名称之一 | 代码常量，不接受raw字符串 |
| channel | Command/Query/Consumer/Operations固定类别 | 与业务OperationChannel区分；仅技术标签 |
| trace_id / request_id | Option<Core TraceId/RequestId> | 只用宿主验证可用于运维关联的值；未经验证省略，禁止回显任意用户字符串 |
| stage | enum标签 entry/validation/read/commit/resolve/response | 代码封闭集合 |
| outcome | 对应Step8公共code/receipt/WriteDelivery或committed/not_committed/pending | 只标签，无payload |
| adapter_slot | Option<AdapterSlot> | Step6-C九种固定slot |
| duration_ms | u64单调计时差 | 不拿wall clock判断source freshness |
| mode / freshness / coverage | Option<ReadMode类别/DataFreshness/ReadCoverage> | 只有安全响应已构造时可写 |
| from_status / to_status | Option<RebuildStatus> | 只在提交确认后记录状态类别，无attempt ID |

默认禁止：actor/principal/scope/partition/generation/item/event/stream/result/commit_attempt ID、owner ref/proof、任意raw body、title、source query、cursor/token、key/digest、endpoint/DSN、secret、Debug dump和带payload的stack。需要具体目标排查时使用已有受控Query/内部只读记录面；不能随意增加日志脱敏hash，因为可关联hash仍泄露身份。

### 7.2 日志埋点

| 位置 | 级别 | 允许字段 | 含义 |
|---|---|---|---|
| 14入口接收/完成 | debug/info | entry_kind/channel、获准trace/request、stage、outcome、duration | 一次调用，不证明提交 |
| metadata/限长拒绝 | warn | kind、validation、InvalidRequest | 不打印解析失败原输入 |
| Scope/Visibility wrapper | warn | slot、safe公共code、耗时 | 未授权不打印隐藏目标 |
| owner/source/recovery读取 | debug/warn | slot、read、outcome、耗时 | 不打source版本/水位 |
| 写store CAS结果 | info/warn | kind、commit、Conflict/committed/not_committed/pending | 不输出expected/observed具体业务版本 |
| duplicate replay | info | kind、response、Duplicate | 不再次记录新业务迁移 |
| source terminal/gap | info/warn | consumer kind、对应receipt类别 | Gap非terminal成功 |
| recovery迁移 | info | kind、from/to、committed | 已提交的Blocked/Failed如实分类 |
| resolve_commit | warn；长期缺陷error | kind、resolve、Pending/Operation/Source/Gap/NotCommitted类别 | 不把Missing映射rollback |
| 数据完整性损坏 | error | kind、stage、NotAvailable | 不能输出损坏对象详情 |
| cursor失败 | debug | query kind、CursorInvalid | 不区分密钥存在/解密失败 |
| builder配置拒绝 | error | slot、固定错误类别 | 不打印完整配置 |

### 7.3 指标契约

| 指标 | 类型 / 单位 | 触发位置 | 标签白名单 |
|---|---|---|---|
| workspace_write_total | counter / calls | 两Command及四Operations完成 | entry_kind、delivery或safe code |
| workspace_query_total | counter / calls | 六Query完成 | entry_kind、mode、availability |
| workspace_source_apply_total | counter / calls | source change返回 | disposition（完整Step8分类） |
| workspace_invalidation_total | counter / partition results | invalidation每target处理 | disposition；无目标只记NoTargets类别 |
| workspace_conflict_total | counter / conflicts | store/application冲突 | resource_class=partition/local/projection/attempt/key |
| workspace_unknown_commit_total | counter / occurrences | 首次Unknown及解析完成 | stage、resolution类别 |
| workspace_call_duration_ms | histogram / ms | entry完成 | entry_kind；桶值留04/运维 |
| workspace_dependency_failure_total | counter / calls | adapter失败 | AdapterSlot、safe code |
| workspace_telemetry_dropped_total | counter / observations | 技术sink有界队列拒绝 | signal=log/metric |

不按target创建时序；无source lag秒数/版本gauge，owner未给比较/时间合同不能自行计算。计数是调用量而非唯一业务变更量；duplicate单独类别，不承诺observability exactly-once。

### 7.4 审计材料与构造位置

| 审计材料（非outbound event） | 触发/构造 | 字段来源 | 读取/消费者 |
|---|---|---|---|
| WorkspaceOperationRecord | 两Command、四Operations、单partition失效；同事务 | Step6-B key/digest/result_ref/StoredWorkspaceResult | GetWorkspaceOperationResult、read.operation，现时授权 |
| SourceApplicationRecord | Applied/LateIgnored；同事务 | Step6-B完整SourceApplicationKey、digest、terminal、cursor/revision | source_application、受控内部诊断 |
| InvalidationRecord | 正式owner或Operations依据已验证 | id、targets、basis、operation按Step6-B | snapshot/invalidation_snapshot，受控recovery/status |
| BaselineApplicationBinding | baseline/catch-up批次提交 | application、operation、attempt、generation、baseline、revision | baseline_application回链 |
| commit_results / gap_results | 各具名事务内部 | Step11技术binding | resolve_commit；不公开新Query |
| Query访问 | 运行日志/指标 | 安全类别与允许关联 | 宿主运维；无持久业务审计记录 |

本表只是已有记录的审计使用方式，未新增record或公共接口。拒绝没有accepted record；Gap有局部marker但没有source成功键。重建Completed证明来自同事务pointer/attempt结果，日志不提供补充授权。

### 7.5 故障、隐私与验证

sink不可用不回滚业务、不改变safe response；有界丢弃不阻塞事务。提交后日志丢失从权威局部记录审查；不得重放业务补日志。Query无local write spy必须覆盖观测开启和关闭两种情况；恶意payload、token、DSN、owner标识canary不得出现在捕获日志。测试只用人工测试标记，不输出真实凭据。source安全失败时连item count/provenance标签都不记录。

## 8. 回填草稿

正式§14摘录日志/指标/局部审计表，保留无业务ID白名单、no-write Query及sink故障语义。完整字段合同为本步§7；不用观测材料推导业务真相。

## 9. 待确认事项

日志后端、采样/保留/告警和安全trace关联策略待04/运维。未有宿主安全关联规则时trace/request字段为None；不阻塞安全类别日志。WS-UP九项保持，不能通过日志“证明”外部接缝可用。

## 10. 进入下一步条件

14入口、CAS、source/recovery、unknown与配置失败都有埋点；已有审计材料有构造与读取来源；无高基数/正文/权限泄露。补审通过，进入Step16。
