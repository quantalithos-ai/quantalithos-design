# L5-chat 03 · Step 11 持有、持久化、事务与一致性

## 1. Step 状态

> 状态：done；gate_status：pass_with_upstream_blockers；2026-10-01。所有存储/函数/切口均planned设计合同，实施not_started。
> 对应SOP Step11、书写规范5.10；回填正式03 §10。当前授权完成全部03，之后立即停审。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 11-A | 所有权、logical store、主键与版本 | done |
| 11-B | repository逐函数与CAS边界 | done |
| 11-C | 查询/发送/consumer/恢复/清理一致性 | done |
| 11-D | rebuild source、失败恢复、前序闭环 | done |

复杂度：按root、memory repository和SDK外部effect三种边界拆分；不引入数据库DDL、UoW、outbox或第二canonical store。无新增状态enum。图见§7.5，足以说明提交与外部effect分离。

## 2. 本步输入

| 输入 | 本Step用途 |
|---|---|
| 当前正式00/01/02，尤其02 §8～12 | 客户端只拥有局部状态；来源独立、不恢复权限 |
| Step6 §6～9及§20 | Draft/Attempt/ClientSnapshot/Projection/guard字段与工厂 |
| Step7 §3、8、12 | root/DraftPort/repository的读取版本与blocked SDK seam |
| Step8～10 | 43协议/flow、17状态主体及副作用约束 |
| Governance Step11 §8～10、§8.19～27 | logical store、函数、transaction ordering、rebuild来源与审计粒度参考 |
| 真相源闭环标准§5～7 | metadata/幂等/投影/证据闭环；不复制后端职责 |

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 本仓拥有哪些数据 | 路由/访问姿态、选择、草稿、一次attempt反馈、消费槽位与来源水位、五page VM、平台体验和受限内存投影。没有Conversation/Gate/Project/Process truth。 |
| 2. 哪些是引用/快照/投影 | 所有owner材料、正式result、拓扑、成员及证据摘要均为qualified只读投影；cache/locator仅恢复候选。 |
| 3. repository如何读写 | 完整签名沿用Step7；root read→CAS，draft get返回root.version，projection load/list返回entry.localVersion。 |
| 4. 哪些flow需要事务 | 只需要同步local CAS；query资格→VM→水位一次CAS；attempt dispatch预留一次CAS；遮蔽与invalidate一次CAS。SDK dispatch与repo删除在CAS之外。 |
| 5. 锁/版本/outbox | 唯一root乐观版本及repo entry版本；同JS turn内检查/写入，无await。没有跨owner事务、行锁、outbox、后台publisher。 |
| 6. 失败如何恢复 | local conflict重新读取/重算纯patch；已dispatch不重发；query失败维持安全stale/partial/blocked；清理失败restricted且仍隐藏，source gap正式requery。 |

## 4. 当前文档问题诊断

| 来源位置 | 问题 | 本步处理 |
|---|---|---|
| Step7 §3版本函数 | 接口已齐，尚需明确每类key/version与原子检查范围 | §7.1～7.3统一；绝不以draftRevision或cursor替代版本 |
| Step9 Submit*、Persist/Evict | await跨越清理时可能复活旧材料或双dispatch | 当前fence/slot检查与写入同turn；预留dispatch权在SDK调用前 |
| Step10 restored/cleared | 状态可能被误认为业务fresh或durable删除证据 | memory恢复必须重新资格化；cleared仅本地memory删除完成 |
| 历史正式03 §1～2 | 旧ChatThread等主语、跨owner收集假设与当前02不一致 | 正式装配只取已校准Step；历史材料不作写入源 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| local事务 | 分散在flow | root版本/slot/fence/patch一次提交 | 防止混入旧节点或搜索回包 |
| repository写 | 只有expected version | 加当前partition/fence同步验证 | 防pending save在revoke之后复活 |
| 恢复 | cache/state易混fresh | 正式入口重验→formal query/resume | 存储不能授予权限 |
| 失败 | 清理/提交容易泛称成功 | effect_unknown、restricted、no-op分别处理 | 保留真实证据边界 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 唯一immutable root +同步CAS + memory repository | 状态提交边界清楚，容易验证撤销 | 重启会丢失局部草稿 | 当前采用；必须明确向用户展示存储姿态 |
| 每组件私有业务store | 开发初期简单 | 晚到/清理无法统一隔离 | 不采用 |
| 浏览器localStorage/SQLite自动持久化 | 可跨重启保存 | 未闭合locator、授权、加密、撤销清理 | 本轮blocked，不得用配置开启 |
| backend式UoW/outbox | 可保存跨表truth | 客户端不拥有该truth/发布权 | 不适用 |

## 7. 结构化中间产物

### 7.1 所有权与logical store

| 数据对象/store | 拥有/写入模块 | 主键、唯一约束、索引 | 版本 | 持有/读取边界 |
|---|---|---|---|---|
| ClientSnapshot root | local_state；coordinator纯patch | 每composition一个root；无跨session合并 | root LocalVersion | UI只读；全部refs/session/maps登出清 |
| route/access/entry/selection | navigation/collaboration | root中唯一字段；选择不复制到组件 | root版 | route resolved不表示授权 |
| drafts | intents经DraftPort | 当前session/scope内context registry identity；一个context当前草稿 | root版CAS + draftRevision关联 | 正文仅内存；新revision不能被旧结果清除 |
| attempts/feedback | intents | intentRef；conversation draftRef/revision，governance Gate/action在actor/fence内去重 | root版 | SDK association及result refs分立，无command body |
| consumptionContexts | navigation/各coordinator | consumer_slot id；actor/session/scope/project/target/source/visibility/generation/parent/query lineage | root版 | 失效后晚到材料不得写 |
| continuityBySource/resumesBySource/consumedChanges | continuity | 正式change_source registry identity；duplicate以同source的change identity | root版；opaque owner版本独立 | 水位/accepted id/safe patch一起CAS |
| 五page VM、projectList、preview、intentCapabilities、conversationLinks | collaboration/materials/intents | 当前slice/目标slot，目录page lineage独立 | root版；逐source marker | partial页面保留逐section姿态，不作跨owner原子快照 |
| LocalProjectionEntry memory map | local_state repository | cacheKey唯一；partition同时匹配；按local key分页，after只来自nextKey | entry LocalVersion | locator正式来源；无跨partitionblind upsert |
| platform/config/AT | platform/config | 当前composition；每host capability独立 | root或validated只读 | 宿主available不授予业务能力 |
| owner truth/DB/outbox/audit/history | 外部owner | Chat无store | 外部合同 | 仅SDK正式消费 |

### 7.2 Repository函数持有语义

以下签名是Step7的原签名；不另造第二接口。

| 函数签名 | 返回/版本来源 | 原子条件 | 错误/恢复 |
|---|---|---|---|
| ClientStatePort.read(): ClientSnapshot | immutable当前root/version | 无IO，无写 | dispose后不可继续读敏感材料 |
| compareAndSet(expected: LocalVersion, fence: ContextFence或null, patch: ClientPatch): Outcome<ClientSnapshot> | 成功新root版；expected来自read | expected、fence及所有ConsumptionCheck通过才一次替换/通知；无await | local_conflict/context_changed无部分patch |
| replaceSession(session: QualifiedSession或null, route: RouteContext): Outcome<ClientSnapshot> | 新安全root | trusted入口先失效generation/registry、遮蔽，清除旧maps；不能patch绕过 | 不继承旧actor/attempt权限 |
| DraftPort.get(context: ExternalHandle<"context">): Outcome<{draft: DraftState或null; version: LocalVersion}> | root当前版 | context当前可验证 | 缺稿null；不可读access_denied |
| DraftPort.list(fence: ContextFence): Outcome<readonly DraftState[]> | 当前fence草稿 | 不跨partition | context_changed无泄漏 |
| DraftPort.save(draft: DraftState, expected: LocalVersion, fence: ContextFence): Outcome<void> | CAS同root | draft属于当前context/fence，版本匹配 | conflict重读，不能丢新稿 |
| DraftPort.remove(context: ExternalHandle<"context">, expected: LocalVersion, fence: ContextFence): Outcome<void> | CAS同root | 确认清稿另验draftRef/revision/submittingIntent | 不按result时间清全部草稿 |
| repository.load(key: LocalId<"cache_key">, partition: LocalPartition): Promise<Outcome<LocalProjectionEntry或null>> | entry版或null | 同partition；memory读取同步完成 | null不是owner不存在 |
| repository.list(partition: LocalPartition, after: LocalId<"cache_key">或null, limit: number): Promise<Outcome<LocalProjectionPage>> | 每entry版/nextKey | 正safe integer且≤maxCachedEntries；仅local key排序 | 不解析owner opaque cursor |
| repository.save(entry: LocalProjectionEntry, expected: LocalVersion或null, fence: ContextFence): Promise<Outcome<LocalProjectionEntry>> | 更新entry版；null只create-if-absent | 当前store fence/partition、guard、entry版检查与memory map.set同turn，不await | oldfence拒绝；无durable替代 |
| repository.evict(key: LocalId<"cache_key">, partition: LocalPartition, expected: LocalVersion或null): Promise<Outcome<DeleteResult>> | deleted/already_absent/failed | null只确认不存在，不blind delete；版本匹配删除 | conflict/storage_unavailable→restricted |
| MemoryProjectionRepository.dispose(): void | 内存释放 | 不再接受write | 无disk删除承诺 |

### 7.3 局部提交边界

| 场景/flow | 开始位置 | 提交位置 | 同CAS必须完成 | CAS失败与外部effect |
|---|---|---|---|---|
| ResolveEntryAccess | trusted session/current route read | qualification通过后的root CAS | route/access/entry、消费槽位及失效旧slice | 旧响应discard，不写权限 |
| Load* query | 固定原request/slot | VM/freshness合格后CAS | 对应safe slice/来源marker/current slot检查 | 重读重算；旧响应不改incoming成current |
| SubmitConversationIntent | 草稿冻结/新intent本地预留 | SDK prepare后的reserveDispatch CAS | association、dispatched=true、submitted、匹配draft submitting | 只有CAS winner调用一次dispatch；失败不调用 |
| SubmitGovernanceIntent | actor/Gate/action本地nonterminal去重 | 同上 | Gate/action关联及attempt一起提交 | 不改Gate/Decision truth |
| ConsumeCommandReceiptOrResult | 正式authority/correlation检查 | attempt/result与同revision草稿处理CAS | result轴、refs、feedback；清稿须精确匹配 | local conflict不得重新dispatch，正式结论可在当前语境重验 |
| ConsumeFormalChange/MaterialRevisionChange | 当前source资格/去重检查 | safe patch/水位CAS | accepted change身份、水位、freshness、相关slice | 不先ACK或推进cursor再丢patch；gap不单event fresh |
| ConsumeVisibilityChange | 正式session/scope/source撤销资格 | 先遮蔽/slot与registry失效CAS | 清相关图/选择/正文/preview；已关闭node仍纳入scope撤销 | stop/delete失败不恢复可见性 |
| Resume*/Requery*/Refresh* | 当前source single-flight预留 | qualified coverage/current recovery匹配CAS | source cursor/continuity/对应slice | 连接ACK不fresh；部分source不覆盖全页 |
| PersistLocalProjection | currentfence/guard批准 | repo内部同turn写 | entry及entry版 | 不与root伪跨store事务；旧fence写失败 |
| Evict*/Clear*/dispose | root先失效/遮蔽 | repo逐entry确认delete | root安全收紧先提交；memory delete独立 | 失败保留restricted；无owner删除 |
| 诊断/preview/AT/host | 当前安全输入 | local结果或正式SDK/host响应 | 不携带owner写事务 | unknown不重交付；宿主ACK不业务提交 |

### 7.4 Projection rebuild与恢复来源

| 投影/显示面 | 合法重建source | 函数链 | 缺失处理 |
|---|---|---|---|
| conversation/Turn | SDK正式surface/turn page | CollaborationReadPort→mapper/factory→current CAS | unavailable/blocked；不从旧Turn/日志补正文 |
| 项目列表/五tab | Work/Workspace等各source正式safe projection | readProjectList/readProjectDetail→page工厂 | source局部partial/stale，不推总进度 |
| 整体/阶段/节点流程 | Process正式safe topology/state/version/association | readProjectProcessFlow/readStageProcessFlow/readProcessNodeDetail | blocked/partial；无WorkItem推图、无日志/XML拼图 |
| 关系/目录/成员 | 正式provider关系/覆盖/分页及逐目标access | readProjectConversationLinks/readCompanyDirectory/readMemberContext | provider缺合同blocked；空页不代表不存在 |
| result/attempt | formal probe/result/业务确认receipt | IntentProbePort.probe→CommandResultGate | not_found无no-effect证明仍unknown |
| 安全材料/preview | owner正式ref/summary/preview | SafeMaterialReadPort/SafeReferencePort | 不解析ref，不构造URL/body |
| 连续性 | SDK正式coverage/resume/requery | ResumePort→匹配recovery/source CAS | partial/stale/gap/blocked |
| local恢复 | 合格locator候选→重新入口/access→上述正式source | RestoreAfterShellRestart | memory旧实例消失；durable未qualified blocked；不从投影重建投影 |

### 7.5 事务时序图: 本地提交与业务effect

```text
[current snapshot/request]
  -> pure factory / guard
  -> CAS(expected, fence, all slots)
       | loser -> no SDK dispatch
       | winner -> local submitted + dispatched reservation
       v
  SDK.dispatch(formally prepared submission)    [outside local CAS]
       -> formal result/probe -> gate -> current CAS -> feedback
       -> no decisive result  -> unknown -> probe/query/wait
revoke -> invalidate + hide CAS -> stop feed -> delete memory
```

关键说明：
- CAS只证明客户端状态更新，不能证明owner业务提交；根版本与source cursor分立。
- 预留后关闭窗口或崩溃可能留下“不知是否调用”的安全未知；恢复仅formal probe。
- revoke遮蔽先于异步清理，任何await返回必须再验当前generation，不能rollback安全收紧。

### 7.6 一致性与失败恢复停审

| 检查 | 结论/预期验证切口 |
|---|---|
| root/draft/repo读取版本配对 | 通过设计检查；CAS失败零部分写入；planned并发测试 |
| source-local版本/slot/parent/query lineage | 通过；opaque equality/顺序由SDK证明，不跨owner原子性 |
| save-after-revoke/evict失败 | 同turn写入防复活；失败hidden/restricted；planned竞态测试 |
| metadata/result/digest | SDK正式association/冻结payload/authority；Chat无自造digest/outbox/result store |
| durable | 仍blocked；memoryOnly=true，草稿正文/handles/材料不得落disk |
| 前序schema/函数 | 沿用Step6/7/9/10，无新增成员/状态；不需要回前序补猜测接口 |

## 8. 回填草稿

正式03 §10采用§7完整所有权、logical store、逐函数、提交边界、rebuild和一致性规则。对象字段/协议/flow/状态分别回§5/6/7/8/9，不以本章另建类型。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008及host/storage配置确值继续open/blocked。safe locator、跨重启安全存储、清理证明和正式SDK幂等/result查询闭环须provider确认；无合同不得开始正向集成。CHAT-BASE001本轮不改00。

## 10. 进入下一步条件

所有本地key/version/函数/同步CAS/异步effect/恢复来源已逐项核对，gate=pass_with_upstream_blockers；可以进入Step12错误恢复设计。没有运行、测试、证据或ready判定。
