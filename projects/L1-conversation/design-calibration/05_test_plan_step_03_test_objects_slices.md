# L1-conversation 05 测试方案 Step 3: 抽取测试对象与测试切口

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §3 测试对象与测试切口
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 抽取测试对象与测试切口 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_03_test_objects_slices.md` |

本步只回答“哪些对象必须测、从哪些切口测”。完整测试策略、用例矩阵、测试数据、环境矩阵、自动化门禁和证据编号分别留给 Step 4 ~ Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | P0/P1/P2 范围、一票否决范围、接缝测试边界 | 作为测试对象筛选边界 |
| `03_ddd_step_05_module_contracts_axis.md` | contracts / domain / application / infra / api / worker / jobs 模块主轴 | 作为模块测试对象来源 |
| `03_ddd_step_06_object_contracts.md` | domain object、value object、policy、state object、projection object 契约 | 作为 domain 单测对象来源 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository / port / adapter 契约 | 作为 integration / adapter 测试对象来源 |
| `03_ddd_step_08_protocol_contracts.md` | Command、Query、Inbound Consumer、Outbound Event、Operations Job 协议全集 | 作为协议测试对象来源 |
| `03_ddd_step_09_function_flows.md` | 逐接口处理流、事务、错误和副作用 | 作为 service / flow 测试切口来源 |
| `03_ddd_step_10_state_matrix.md` | 14 组正式状态机与非法转换 | 作为状态机测试对象来源 |
| `03_ddd_step_11` ~ `03_ddd_step_15` | 事务、一致性、错误恢复、幂等、配置、观测与 redaction | 作为横切测试对象来源 |
| `03_ddd_step_16_test_slices.md` | 详细设计最小测试切口 | 必须全部承接，不得漏项 |

## 3. SOP 问题回答

### 3.1 哪些 domain object / value object / policy 必须单测?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `ConversationTruthState`、`ConversationTruthPolicy`、`ConversationOutboxRecord` | Step 6 / Step 10 | truth 可写 / 可读 / 受限 / handoff / closed guard，outbox kind 与 payload ref | truth 被 UI、projection 或外部依赖改写 | domain unit |
| `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` | Step 6 / Step 10 | 创建、关闭、scope change、visibility 裁剪、非法迁移 | fact 脱离 space / scope，授权边界失效 | domain unit |
| `VisibilityPolicy` | Step 6 / Step 9 | append / read / manifestation / review / derived output 的 visibility guard | query、search、cursor 或 handoff 越权输出 | domain policy unit |
| `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt` | Step 6 / Step 10 / Step 13 | append-only、source result-only、forbidden body reject、duplicate / conflict receipt | fact 被覆盖、runtime reasoning body 入库 | domain unit |
| `ConversationReadModel`、`ConversationChangeCursor` | Step 6 / Step 10 | authorized view、cursor owner、stale / expired / invalidated、query 不写 truth | read model 反写真相或跨 consumer 复用 | projection unit |
| `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot` | Step 6 / Step 10 / Step 15 | ref-only、safe snapshot、manifested / stale / unresolved / revoked、digest guard | 来源仓 truth 漂移或正文泄露 | domain unit |
| `ManifestationPolicy`、`ReferenceValidityPolicy` | Step 6 / Step 12 | source type、snapshot digest、resolution / freshness / visibility 判断 | 自行补造 work / governance / artifact truth | domain policy unit |
| `ConversationTraceContext`、`ReviewAnchor` | Step 6 / Step 10 / Step 15 | trace seal、retention、review target visibility、sensitive read audit | 关键变化不可复盘或越权审计 | domain unit |
| `TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` | Step 6 / Step 10 / Step 12 | pending / retry / failed / handed off / archived，payload ref-only | handoff 失败回滚业务 truth 或输出正文 | domain + job unit |
| `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`DerivedViewPolicy` | Step 6 / Step 10 / Step 11 | fresh / stale / rebuilding / failed，search refs only，cursor no regress | 派生结果成为第二 truth | projection unit |
| `ReferenceResolutionState`、`ExternalReferenceProjection` | Step 6 / Step 10 / Step 12 | pending / fresh / stale / unresolved / invalid，display fragment 裁剪 | unresolved 被伪造成来源成功 | projection unit |

### 3.2 哪些 application service 必须做 service test?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `ConversationSpaceCommandService` | Step 5 / Step 9 | create / close space，初始 scope、visibility、truth、outbox 同事务 | space 不完整或 outbox 失败后 truth 半提交 | application service |
| `ParticipantScopeCommandService` | Step 5 / Step 9 | participant update、scope change history、version conflict、projection stale | 参与范围变化不可追溯 | application service |
| `VisibilityScopeCommandService` | Step 5 / Step 9 | visibility update、sealed 扩张拒绝、read side invalidation | 授权范围被配置或 query 绕过 | application service |
| `ConversationFactAppendService` | Step 5 / Step 9 / Step 13 | append / retract、idempotency、conflict、receipt、trace、outbox rollback | 重复输入形成冲突 truth | application service |
| `ConversationManifestationService` | Step 5 / Step 9 / Step 12 | external ref resolution、safe snapshot、manifestation、unresolved / digest mismatch | 来源事实被复制或推断 | application service |
| `AuthorizedConversationQueryService` | Step 5 / Step 9 | read model、fact list、cursor、search、trace / review read visibility | query 写入状态或越权输出 | query service |
| `ConversationTraceReviewService` | Step 5 / Step 9 | review anchor、trace handoff、archive handoff、retention guard | 追溯材料不可交接或泄露正文 | application service |
| `ConversationDerivedMaintenanceService` | Step 5 / Step 9 / Step 11 | rebuild / refresh / cursor maintenance / consistency validation 编排 | 维护 job 自动修写真相 | job service |

### 3.3 哪些 repository / adapter / worker 必须做集成测试?

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| truth / fact / manifestation / trace repositories | Step 7 / Step 11 | unique key、expected version、transaction rollback、list / lock | 持久化语义与 service 假设不一致 | repository integration |
| projection / cursor / reference repositories | Step 7 / Step 11 | stale / failed marker、cursor sequence、authorized projection read | 派生状态污染 truth 或倒退 | repository integration |
| outbox repository / publisher port | Step 7 / Step 11 / Step 12 | enqueue rollback、publish retry / failed、same event id rerun | 下游感知重复或 truth 回滚 | adapter + job integration |
| idempotency repository | Step 7 / Step 13 | same key same digest、same key different digest、consumer duplicate、job rerun | 重复 command / event / job 产生冲突 truth | repository integration |
| actor / source reference resolver fake adapter | Step 7 / Step 12 / Step 14 | unresolved、digest mismatch、configured ref missing、no body copy | fake 被误当真实成功 | adapter integration |
| trace / archive handoff fake adapter | Step 7 / Step 12 / Step 14 | retryable failure、permanent failure、receipt ref、redaction required | handoff 泄露 payload 或覆盖 truth | adapter + job integration |
| API command / query handlers | Step 8 / Step 9 | envelope mapping、metadata、idempotency key、HTTP error mapping | handler 自行补字段或跳过 guard | handler integration |
| worker consumers | Step 8 / Step 9 / Step 13 | event envelope、duplicate、quarantine、ack failure、projection stale | 来源事件重复或非法 envelope 污染 truth | worker integration |
| operations job runners | Step 8 / Step 9 / Step 13 | job input、batch transaction、partial failure、rerun、report ref | 维护动作不可复核或自动修真相 | job integration |
| config loader / validator / runtime builder | `04` §7 / §9 / §11 | unsupported profile、non-strict redaction、path shape、unwritable report root | 配置绕过 P0 红线 | config integration |

### 3.4 哪些 Command / Query / Event / Job 必须做协议和流程测试?

| 协议组 | 必测对象 | 测试切口 | 推荐测试层级 |
|---|---|---|---|
| Command | `CreateConversationSpace`、`CloseConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope`、`AppendConversationFact`、`RetractConversationFact`、`ManifestExternalFact`、`CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff` | request / metadata / idempotency / domain construction / outbox rollback / error mapping | contract + API + application |
| Query | `GetConversationReadModel`、`ListConversationFacts`、`GetConversationFact`、`GetConversationChangeCursor`、`PollConversationChanges`、`SearchConversationHistory`、`GetCrossDomainManifestation`、`GetConversationTraceContext`、`GetReviewAnchor`、`GetConversationProjectionState`、`GetExternalReferenceProjection` | visibility denied、not found、stale / failed marker、query no-write | contract + query handler |
| Inbound Consumer | `ConsumeWorkContextChanged`、`ConsumeGovernanceFactCommitted`、`ConsumeArtifactFactCommitted`、`ConsumeRuntimeResultCommitted`、`ConsumeBridgeMappedFactReceived`、`ConsumeIdentityActorChanged` | valid event、duplicate、quarantine、source body absent、projection stale | contract + worker |
| Outbound Event | `ConversationSpaceChangedEvent`、`ConversationScopeChangedEvent`、`ConversationFactAppendedEvent`、`ConversationFactRetractedEvent`、`CrossDomainManifestationChangedEvent`、`ConversationChangeAvailableEvent`、`TraceHandoffRequestedEvent`、`ArchiveHandoffRequestedEvent`、`ConversationProjectionStateChangedEvent` | payload ref-only、schema version、publish failed、forbidden body absent | contract + publisher |
| Operations Job | `PublishConversationOutbox`、`RebuildConversationReadModels`、`RebuildConversationSearchIndex`、`MaintainConversationChangeCursors`、`RefreshExternalReferenceSnapshots`、`DeliverTraceHandoff`、`DeliverArchiveHandoff`、`ValidateConversationConsistency`、`CleanupExpiredConversationCursors` | job input、partial failure、rerun、report ref、no auto-repair truth | contract + job runner |

### 3.5 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口?

| 横切对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| 14 组正式状态机 | Step 10 | 每组至少一个合法转换和一个非法转换；使用正式 enum variant | 旧状态名或口语状态回流 | domain / job |
| command truth + outbox 同事务 | Step 11 | outbox enqueue failure rolls back truth / trace / receipt | 半提交导致事实不可追溯 | service + repository |
| projection / handoff / publish 最终一致 | Step 11 / Step 12 | downstream failure 不回滚 truth，只推进 retry / failed / stale marker | 外围失败破坏核心 truth | job + query |
| command / consumer / job idempotency | Step 13 | same key same digest、same key different digest、duplicate event、rerun existing receipt | 重复输入形成多个 truth | service / worker / job |
| version / sequence conflict | Step 11 / Step 13 | append / retract / cursor advance 并发只允许一个成功 | 并发导致顺序倒退或覆盖 | repository + concurrency |
| forbidden body / redaction | Step 15 / `04` §8 | runtime reasoning body、bridge body、artifact body、secret 不进 truth / log / event / report | 数据归属和安全一票否决 | observability + integration |
| config fail-fast / fail-closed | `04` §7 / §9 / §11 | unsupported profile、non-strict redaction、unwritable path、extra project layer | 证据不可验收或配置绕过红线 | config + gate |

### 3.6 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口?

| 负向切口 | 来源章节 | 必须拒绝 / 暴露的行为 |
|---|---|---|
| Command 缺 actor、metadata、idempotency key、trace ref 或目标对象必填字段 | Step 8 | `ProtocolError::MissingRequiredField` 或对应 application error |
| Query 缺 consumer、visibility context、page / consistency 或目标 ref | Step 8 | reject / not visible / not found，且 query 不写 truth |
| Inbound event 缺 event id、source ref、idempotency key、version 或 digest | Step 8 / Step 12 | quarantine 或 reject，不写 truth |
| Outbound event 缺 committed truth ref、payload ref 或 schema version | Step 8 | event 不得生成或不得发布 |
| Job input 缺 `JobRunId`、scope、batch、report root 或 idempotency key | Step 8 / `04` §7 | job fail-fast，输出 failure summary |
| `ExternalFactRef` 与 `ExternalFactSnapshot` / `DisplaySummaryRef` 混同 | Step 6 / Step 8 | reject，禁止把 source body 当 safe snapshot |
| `ArchivePackageRef` / `TracePayloadRef` 与正文混同 | Step 6 / Step 15 | reject 或 redaction check failure |
| fake / fixture / controlled adapter 被标记为 production evidence | Step 2 / `04` §6 | test / report failure，不能作为真实集成通过 |

### 3.7 哪些状态名必须以详细设计正式 enum variant 为准?

| 状态机组 | 正式状态名来源 | 测试要求 |
|---|---|---|
| truth / space | `ConversationTruthState`、`ConversationSpaceLifecycleState` | 不使用 open/closed 口语断言替代正式 variant |
| scope | `ParticipantScopeState`、`VisibilityScopeState`、`ScopeChangeState` | visibility sealed / restricted 必须按 Step 10 表达 |
| fact / receipt | `ConversationFactState`、`FactAppendResult` | receipt 是 outcome，不写成可变生命周期 |
| manifestation / reference | `ManifestationState`、`ReferenceResolutionState` | unresolved / stale / invalid 必须保留 |
| projection / cursor / outbox | `ProjectionFreshnessState`、`ConversationChangeCursorState`、`ConversationOutboxPublicationState` | query 不能把 stale 改 fresh，published 不回 pending |
| trace / handoff | `TraceRetentionState`、`TraceHandoffState`、`ArchiveHandoffState` | handed off / archived 后不可 retry |

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧稿按 Turn / stream / projection 罗列测试，无法覆盖新版 domain object、协议、状态和配置红线 | 不继承旧测试对象 |
| `03` §15 | 最小验证切口已经完整，但仍是详细设计视角 | 本步转换为测试方案 §3 的测试对象与切口 |
| `03_ddd_step_16_test_slices.md` | 接口清单很细，但不负责 P0/P1/P2 范围裁剪 | 本步结合 Step 2 范围重排 |
| `04-配置设计.md` | 配置测试切口散落在 profile、配置项、失效模式和下游承接章节 | 本步纳入 config / reports / redaction 测试对象 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试对象抽取方式 | 旧稿按消息、turn、stream 或模块经验罗列 | 按 domain / service / repository / adapter / protocol / state / config 抽取 |
| 详细设计承接 | 只参考部分 API | 覆盖 Step 6、7、8、9、10、11、12、13、15、16 |
| 负向切口 | 容易留给人工 review | 字段缺失、DTO 构造失败、引用混同、forbidden body 和 fake-as-production 均进入测试对象 |
| 状态名 | 旧口语状态可能回流 | 明确所有状态断言以 Step 10 正式 enum variant 为准 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否逐接口生成完整用例 | Step 3 直接列 TC | Step 3 只列测试对象和切口 | B | 用例矩阵属于 Step 6 |
| 是否按模块简单列测试 | 只列 contracts/domain/api | 结合业务对象、协议、状态和横切风险 | B | 测试对象不能只按技术层级 |
| 是否复制 Step 16 全部接口表 | 全量复制 | 分组承接，细节回指 Step 16 | B | 避免重复，正式用例阶段再展开 |
| 是否把配置测试后移 | 只在 Step 8 讨论配置 | Step 3 先把 config / reports / redaction 列为测试对象 | B | 配置红线属于 P0 一票否决 |

## 7. 结构化中间产物

### 7.1 测试对象与切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| domain object / policy | Step 6 / Step 10 | 构造、不变量、状态、visibility、ref-only、redaction guard | truth / source / authorization 红线失效 | unit |
| application service / flow | Step 9 / Step 11 / Step 13 | 编排顺序、事务、幂等、错误映射、outbox 副作用 | 半提交或重复 truth | service |
| repository / adapter / worker / job | Step 7 / Step 11 / Step 12 | 持久化语义、fake failure injection、quarantine、rerun、report ref | fake-as-production 或恢复不可复核 | integration |
| Command / Query / Consumer / Event / Job protocol | Step 8 | schema、必填字段、DTO roundtrip、metadata、payload ref-only | 协议字段与 domain 构造不闭合 | contract + handler |
| state / transaction / idempotency / recovery | Step 10 ~ Step 13 | legal / illegal transition、rollback、retry、failed marker、conflict | 状态名漂移或一致性断裂 | unit + service + job |
| configuration / scripts / evidence | `04` §6 ~ §12、`03` §15 | profile、path shape、redaction check、gate / report scripts | 证据不可验收或配置绕过红线 | config + gate |

### 7.2 Step 4 承接提示

| 切口组 | Step 4 需要决定 |
|---|---|
| domain object / policy | 哪些必须在 unit 层作为 PR gate，哪些可在 nightly 扩展 |
| application service / flow | 哪些 service tests 是 P0-blocking release gate |
| repository / adapter / worker / job | 哪些进入 integration-like，哪些只用 fake adapter failure injection |
| protocol | 哪些 contract roundtrip 进入 CI，哪些 handler mapping 进入 API gate |
| state / consistency / idempotency | 哪些非法转换、rollback 和 duplicate 是一票否决 |
| configuration / scripts / evidence | 哪些 config / report / redaction 检查必须在 gate 阶段执行 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §3 时摘录。

```markdown
## 3. 测试对象与测试切口

> 校准来源：
> - `design-calibration/05_test_plan_step_03_test_objects_slices.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“待确认事项”小节，了解测试对象如何从详细设计对象契约、协议契约、状态矩阵、事务幂等和配置红线收敛而来。

本轮测试对象按六组组织：domain object / policy、application service / flow、repository / adapter / worker / job、Command / Query / Consumer / Event / Job protocol、state / transaction / idempotency / recovery、configuration / scripts / evidence。

domain object / policy 必须覆盖 Conversation truth、space / scope、fact、manifestation、projection、trace、handoff、reference 和 redaction guard。application service 必须覆盖事务、幂等、错误映射和 outbox 副作用。protocol 必须覆盖 10 个 Command、11 个 Query、6 个 Inbound Consumer、9 个 Outbound Event 和 9 个 Operations Job。状态测试必须以 `03_ddd_step_10_state_matrix.md` 的正式 enum variant 为准。字段缺失、DTO 构造失败、引用混同、forbidden body、fake-as-production 和配置红线必须作为负向测试切口进入后续用例设计。
```

## 9. 待确认事项

无阻塞进入 Step 4 的待确认事项。

后续 Step 必须继续收口:

- Step 4 为本步测试对象分配测试层级、执行阶段和门禁位置。
- Step 5 将 FR / BR / NFR 映射到本步切口组。
- Step 6 逐项生成用例时必须回指本步测试对象和详细设计真相源。
- Step 7 不得为未列入本步范围的对象发明 fixture。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 domain / protocol / service / state / config 测试对象明确 | 通过 | 六组测试对象已列出 |
| 详细设计 §15 最小验证清单已承接 | 通过 | 模块、接口、状态、一致性和脚本切口均已纳入 |
| 负向测试切口明确 | 通过 | 字段缺失、DTO 构造失败、引用混同、forbidden body、fake-as-production 已列出 |
| 可以进入 Step 4 | 通过 | 下一步制定测试策略与分层 |
