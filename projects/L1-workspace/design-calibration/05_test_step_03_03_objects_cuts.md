# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3  
> 回填章节：`05-测试方案.md` §3  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / pass_with_external_slots |
| 输入基线 | Step1~2；正式 02~04；03 Step5~16 |
| 对象覆盖 | 7 模块、16 局部对象、7 service、14 入口、横切契约 |
| 停审结论 | 15 个 P0 测试切口均有真相源、风险、层级与后续用例要求 |
| 事实边界 | 全部为 planned/blocked 设计；未实现或执行 |

## 2. 本步目标与输入

本步从正式设计抽取可验证对象和最小风险发现位置。它不生成完整用例，不以测试替身补上游 schema，也不把模块名本身当作测试切口。

| 输入 | 抽取内容 |
|---|---|
| `02-概要设计.md` | 七 CP、16 对象轮廓、14 入口、数据流和异常姿态 |
| `03-详细设计.md` §5~§15 | 七模块、对象索引、协议/flow、状态、事务、错误、并发、配置、观测 |
| 03 Step6-A/B/C | 字段、工厂、成员函数、service 与入口对象 |
| 03 Step7~10 | port、commit carrier、14 协议/flow、正式状态矩阵 |
| 03 Step11~16 | 持久化、unknown、幂等、配置、redaction、最小测试发现路径 |
| `04-配置设计.md` | 配置 schema/profile/limits/secret/binding 与失效策略 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 domain object / value / policy 必须单测？ | 16 个局部对象全部纳入；typed ID/version/key/digest、支撑载体与纯 projector 作为其构造/不变量切口一起验证。 |
| 哪些 application service 必须做 service test？ | ScopeService、PartitionService、SourceReadService、ProjectionApplyService、LocalAttentionService、RecoveryService、WorkspaceQueryService 七个均有独立编排切口。 |
| 哪些 repository / adapter / worker 做集成测试？ | WorkspaceReadPort、WorkspaceAtomicStore 七具名写方法、commit resolution、cursor codec、owner/visibility/event/recovery adapter、两个 consumer 与四 operation；真实 seam 未闭合时正向 blocked。 |
| 哪些协议必须单列？ | 2 Command、6 Query、2 Consumer、4 Operation 共 14 个入口逐项列出，不合并 Query 或 Operations。 |
| 哪些状态/事务/恢复行为必须单列？ | Coverage、Attention、Rebuild、Generation role/safety、local read、terminal record、read posture、commit/receipt、AdapterAvailability；另列原子写、CAS、unknown、fanout、cutover。 |
| 哪些负向字段风险必须覆盖？ | required metadata、expected version、typed ID 互换、digest canonical、Strong consistency、cursor 绑定轴、owner proof、visibility validity、禁止正文/secret。 |
| 正式命名来源是什么？ | 03 Step6~10；状态和错误不得使用旧口语别名，外部 schema 空位继续用 WS-UP 编号。 |
| 有无孤儿 P0 契约？ | 经 §7.8 审计未发现；外部正向合同不是“已覆盖”，明确落入 blocked cut。 |

## 4. 当前材料问题诊断

| 首稿缺口 | 风险 | 修正 |
|---|---|---|
| 仅五行大类矩阵 | 16 对象、14 入口和七 service 无法逐项追溯 | 建立对象、service、入口、横切四层索引 |
| “domain/状态”混成一项 | 对象字段与状态迁移风险混淆 | 对象切口与状态族切口分开 |
| “consumer/recovery”合并 | Gap terminal、fanout、cutover 等 phase 边界易错 | 两 Consumer、四 Operation 独立列出 |
| 外部正向一律写 blocked，无本地负向切口 | 容易误以为 blocker 阻塞全部测试设计 | 每个 cut 标明 local planned 与 external blocked 部分 |
| 无 P0 停审和跨切口审计 | 孤儿设计、重复断言、状态漂移不可见 | 增加逐 cut 停审与全局审计 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 对象 | 按对象族概括 | 16 对象逐项映射字段/工厂/状态风险 |
| 服务 | 未列 | 7 service 逐项映射 port 与编排风险 |
| 入口 | 只写“14入口” | 14 个正式入口各有测试目标和路径 |
| 横切 | 事务、配置、观测混在大类 | 15 个稳定 CUT ID，可用于追溯/用例/证据 |
| 停审 | 无 | 每个 P0 cut 给出来源、可落地性和 blocked 边界 |

## 6. 测试设计取舍

1. CUT ID 描述稳定风险切口，不代表测试已实现；测试文件路径沿用 03 Step16 的计划入口。
2. 对象单测只验证 workspace 局部不变量；`SourceSlice`、`VisibilityBinding` 等需要正式 owner proof 的成功构造不得用任意 JSON/String fake。
3. Service 测试用 write spy、fault injection 和 typed local fixture 验证编排；它不能证明真实 owner、bus、driver 或 crypto 产品。
4. Consumer 的 Gap 保持非 terminal；commit unknown 保持 Pending；这两类不得为方便测试改成失败或成功。
5. Query 测试将“现时 visibility”和“七写方法调用总数为零”作为共同强断言，而不是只检查响应 DTO。

## 7. 结构化中间产物

### 7.1 计划测试发现路径

| 模块 | 计划 suite 路径（目标实现仓相对） | 主切口 |
|---|---|---|
| contracts | `crates/contracts/tests/protocol_boundary.rs` | typed contract、metadata、digest、cursor wire boundary |
| domain | `crates/domain/tests/local_state_invariants.rs` | 16 对象、不变量、状态迁移、纯 projector |
| application | `crates/application/tests/query_no_write.rs` | 六 Query、现时裁剪、write spy |
| application | `crates/application/tests/maintenance_consistency.rs` | Command/Consumer/Operation 编排、事务、unknown |
| infra | `crates/infra/tests/adapter_contract.rs` | store/adapter/cursor/config/fault contract |
| infra | `crates/infra/tests/read_model_boundary.rs` | 跨模块装配与只读边界 |
| api | `crates/api/tests/read_surface.rs` | 2 Command + 6 Query handler 协议 |
| worker | `crates/worker/tests/consumer_boundary.rs` | 两 Consumer envelope/receipt/边界 |
| jobs | `crates/jobs/tests/recovery_boundary.rs` | 四 Operation 的一次有界调用 |

以上均为 planned 路径，不证明实现仓、文件或 suite 已存在。

### 7.2 十六个局部对象测试索引

| 对象 | 设计真相源 | 最小测试切口 | 主要风险 | 推荐层级 |
|---|---|---|---|---|
| WorkspacePartition | 03 §6.1；Step6-B CP1 | provision 初值、stable scope 唯一、partition CAS、current cutover | Query 隐式创建；指针与版本半提交 | domain/service |
| WorkspaceScope | Step6-B CP1 | owner resolution 构造、stable_key、actor/selector mismatch | 字符串 scope 或 resolution ref 被当权限 | domain/contract |
| SourceSlice | Step6-B CP2 | safe items/version/visibility 同源绑定；空 slice coverage | raw JSON 削字段冒充 safe；旧 visibility | domain/service；正向 blocked |
| VisibilityBinding | Step6-B CP2 | principal/scope/subject/validity 一致；撤销与过期拒绝 | 本地 allow bool；缺决定默认展示 | domain/service；正向 blocked |
| SourceApplicationRecord | Step6-B CP3；Step10 G | key/digest 不可变；仅 Applied/LateIgnored 终局 | Gap 占 terminal key；重复覆盖原结果 | domain/service |
| SourceCoverage | Step6-B CP3；Step10 A | 五状态、cursor/watermark/proof 同范围、gap bridge | 猜顺序；Invalidated 复活；Complete 无 proof | domain/service |
| PartitionProjection | Step6-B CP3 | generation 隔离、apply 原子 next revision、source/inbox/coverage 一致 | 混 generation；半 cursor/Inbox | domain/service |
| InboxItem | Step6-B CP4；Step10 B | 明示 attention、stable id、Present/Withdrawn/reopen | 文本推测 Inbox；重复增加 unread | domain/service；正向 blocked |
| LocalAttentionState | Step6-B CP5 | principal/partition 绑定、local CAS、disposition/preference/focus | 写上游 receipt；跨用户/跨 scope 污染 | domain/service |
| ReadCursor | Step6-B CP5；Step10 F | 按 stream 独立、basis 可比较、override 优先、溢出拒绝 | source/view/read cursor 混用 | domain/property |
| WorkspaceOperationRecord | Step6-B CP5；Step10 G | key/digest/result/ref 不可变、原结果 replay | 当前状态重算旧结果；缺行当 rollback | domain/service |
| RebuildAttempt | Step6-B CP6；Step10 C | 九状态、阶段字段、一次推进、四终态不复活 | 自动跨 phase；Blocked 当等待态 | domain/service |
| GenerationState | Step6-B CP6；Step10 D/E | Candidate/Current/Retired 与 Unverified/Validated/SafetyBlocked 双轴 | 未验证 cutover；旧 candidate 混入 current | domain/service |
| InvalidationRecord | Step6-B CP6 | append-only basis/targets/effect；DataStale 与 SafetyBlocked 分离 | 自由指定 safety；漏 target | domain/service |
| WorkspaceReadView | Step6-B CP7；Step10 H | provenance/freshness/coverage/availability 正交组合 | stale 冒 fresh；隐藏项泄漏 count/ref | domain/query/API |
| WorkspacePageCursor | Step6-B CP7；Step14 | principal/partition/generation/view/local/query/visibility 全轴绑定 | token 当授权；篡改/错轴仍接受 | contract/infra/API |

### 7.3 七个 application service 测试索引

| Service | 依赖/责任来源 | 测试切口 | 强断言 | 外部边界 |
|---|---|---|---|---|
| ScopeService | Step6-C；ScopeResolverPort | actor/scope resolve、stable key、缺/撤权限 | 不造 membership/authorization；错误安全映射 | WS-UP-003/005 正向 blocked |
| PartitionService | Step6-C；provision flow | operation lookup→snapshot→provision commit→unknown resolve | partition+operation+result 原子；不建 local/generation | scope positive blocked |
| SourceReadService | Step6-C；OwnerRead/Visibility | owner safe slice、现时 visibility、Transient compose | 全程 no-write；缺 proof fail-closed | WS-UP-001/003 blocked |
| ProjectionApplyService | Step6-C；change consumer flow | classify/apply/late/gap/duplicate/unknown | Gap 非 terminal；projection/coverage/inbox/record 原子 | event/attention positive blocked |
| LocalAttentionService | Step6-C；local command flow | explicit expected local、按变体更新、same-key replay | 只写 local+operation；stream 轴独立 | relation positive may block |
| RecoveryService | Step6-C；invalidation/recovery flows | request/advance/supersede/invalidate、fanout | 每次一阶段/批；cutover fence；终态不复活 | baseline/replay positive blocked |
| WorkspaceQueryService | Step6-C；六 query flows | materialized/transient/read/export/status/page | 七写方法零调用；当前 visibility；安全输出 | owner/downstream positive blocked |

### 7.4 十四入口逐项测试索引

| 入口 | 类型 | 核心测试切口 | 必须独立断言 | 计划主 suite |
|---|---|---|---|---|
| ProvisionWorkspacePartition | Command | 新建、same-key duplicate、scope 冲突、unknown | 初始 version1/current None；不建 local/generation | maintenance_consistency / read_surface |
| ChangeWorkspaceLocalState | Command | Absent→Present、CAS、变体隔离、duplicate | 只改目标 local 字段；不写 source/receipt | maintenance_consistency / read_surface |
| GetWorkspaceView | Query | Materialized/Transient、selection、退化、cursor | 当前 visibility；零写；无强一致承诺 | query_no_write / read_surface |
| ListWorkspaceInbox | Query | Present/Withdrawn、read 三值、排序/分页 | hidden 不泄漏 count/ref；local 缺失零创建 | query_no_write / read_surface |
| GetWorkspaceLocalState | Query | Absent/Present、撤权裁剪 | 不生成 default、不更新 last_opened | query_no_write / read_surface |
| GetWorkspaceOperationResult | Query | 原 stored result、跨 partition ref、撤权 | 不重跑、不把当前状态代替原结果 | query_no_write / read_surface |
| GetWorkspaceRecoveryStatus | Query | 同快照多轴、各终态字段 | 不 Advance/repair；Blocked/Failed failure 必填 | query_no_write / read_surface |
| ExportWorkspaceReadModel | Query | schema v1、安全 read model、token 类型 | 不生成 artifact/archive receipt/outbound | query_no_write / read_surface |
| ConsumeSourceChange | Consumer | Applicable/Late/Gap/Duplicate/Conflict/Unknown | 终局仅 Applied/LateIgnored；Gap 无 terminal；不 ACK | consumer_boundary |
| ConsumeSourceInvalidation | Consumer | single/fanout/NoTargets/partial unknown | 每 target 独立；unknown 不跨页；无全局成功键 | consumer_boundary |
| RequestWorkspaceRecovery | Operation | candidate+attempt 创建、duplicate | Requested/Candidate/Unverified；current 不变 | recovery_boundary |
| AdvanceWorkspaceRecovery | Operation | 各 phase 单步/批、revalidate/cutover | 无跨 phase 循环；basis 任一变化拒绝旧切换 | recovery_boundary |
| SupersedeWorkspaceRecovery | Operation | same partition replacement、环/自环/跨区 | 只更新旧 attempt；replacement/current 不变 | recovery_boundary |
| InvalidateWorkspaceView | Operation | DataStale/SafetyBlocked、target CAS、duplicate | effect 不混；完整 targets；无依据拒绝 | recovery_boundary |

### 7.5 稳定 P0 测试切口总表

| CUT ID | 设计真相源 | 覆盖内容 | 风险 | 推荐层级 | 后续用例要求 |
|---|---|---|---|---|---|
| CUT-CONTRACT | 03 §7；Step6-A/8 | typed IDs/versions/metadata/DTO/errors/digest | 字段缺失、类型混同、canonical 漂移 | contract unit/property | roundtrip、missing/unknown、轴互换拒绝 |
| CUT-OBJECT | 03 §6；Step6-B | 16 对象工厂/成员/不变量 | 非法对象、失败后 self 变化 | domain unit/property | 每对象至少成功或已闭合局部场景 + reject |
| CUT-STATE | 03 §9；Step10 | 全部正式状态族和分类矩阵 | 非法迁移、终态复活、状态别名 | domain/service | 每状态族合法、边界、默认拒绝 |
| CUT-SCOPE-VIS | 03 §8/§11；Step6/7/9 | scope、principal、visibility 当前决定 | 越权、旧决定、元信息泄漏 | service/adapter | local negative planned；owner positive blocked |
| CUT-QUERY | 03 §7.2/§8；Step16 | 六 Query 与 safe response | 隐式 refresh/write、退化混同 | service/API | 每 Query hit/deny/degraded + seven-write spy |
| CUT-COMMAND | 03 §7.2/§8；Step9 | 两 Command 与 operation replay | 写域越界、CAS/duplicate 错 | service/API | 正向、validation、same/different digest、unknown |
| CUT-SOURCE | 03 §7.2/§8；Step9/10 | 两 Consumer、envelope、receipt、order | gap 吞失、ACK 虚构、event schema 伪造 | worker/service | 分类负向 planned；exact event positive blocked |
| CUT-RECOVERY | 03 §8/§9；Step9/10 | 四 Operation、generation/attempt/invalidation | phase 越界、混世代、不安全 cutover | jobs/service | 每入口独立 + 每 phase/终态/竞争 |
| CUT-TRANSACTION | 03 §10；Step11 | 七具名 commit、snapshot/UoW/FK | 半提交、跨分区错误原子假设 | service/adapter | 故障注入逐写点；fanout 每 target |
| CUT-IDEMPOTENCY | 03 §11/§12；Step12/13 | key/digest/stored replay/commit unknown | 二次写、缺行当 rollback | service/adapter | same digest、different digest、reply loss、resolve |
| CUT-CURSOR | 03 §7/§9/§13；Step14 | cursor codec 与全部绑定轴 | token 当授权、篡改、旧轴复用 | contract/infra/API | tamper、key rotation、each-axis mutation、zero write |
| CUT-CONFIG | 04 §4~§13 | strict schema/profile/limits/bindings | default/fallback、截断 Complete、fake production | config/infra | missing/unknown/type/relation/profile/binding failure |
| CUT-OBSERVE | 03 §14；Step15；04 §8 | log/metric/audit/trace redaction | secret/body/high cardinality 泄漏；sink 改结果 | service/check | canary scan、sink fail、duplicate category |
| CUT-DEPENDENCY | 00 §6；01；03 §5/§13 | compile/runtime/event/ref/adapter/fake | L1 path dependency、truth 合并 | static/architecture | manifest/import boundary；fake 不在 production fallback |
| CUT-RESOURCE | 00 §13；03 §13；04 §7 | 有界 page/snapshot/commit/recovery/fanout | 无界资源、静默 clamp/truncate | unit/service/integration | limit/limit+1、关系、超限安全失败；数值 baseline pending |

### 7.6 字段、DTO、引用混同负向切口

| 风险 | 正式依据 | 后续断言 |
|---|---|---|
| missing/invalid metadata 或 idempotency key | Step8 公共 metadata | 输入拒绝；写 flow 不 begin commit |
| Query 请求 Strong consistency | 03 §7 | InvalidRequest；不暗中执行 barrier 或写 refresh |
| ActorId、GlobalMemberRef、partition/generation/result ref 互换 | Step6-A/8 typed contract | 编译/构造边界拒绝，不用字符串比较兜底 |
| source/view/read cursor 互换 | BR-WS-004；Step10 | 构造/比较拒绝；不得推进错误轴 |
| owner canonical codec 缺失 | Step7/13 | ContractBlocked；不得 Debug/JSON/String digest |
| external body/secret/token 进入 store/log/report | 00 §11；Step15；04 §8 | 所有禁止面零出现；错误不回显细节 |
| historical visibility/page token 当当前授权 | Step9 Query flows | 必须重新核验现时决定；缺失 fail-closed |
| gap/blocked/unknown 当 terminal success | Step8/10/11 | 无 SourceApplicationRecord；Unknown 只 Pending/resolve |

### 7.7 P0 切口停审记录

| 切口 | 来源明确 | 风险具体 | 层级可落地 | 外部缺口未伪造 | 结论 |
|---|---|---|---|---|---|
| CUT-CONTRACT / OBJECT / STATE | 是 | 是 | 是 | 是 | pass_with_external_slots |
| CUT-SCOPE-VIS / SOURCE | 是 | 是 | 是 | 正向明确 blocked | pass_with_blockers |
| CUT-QUERY / COMMAND | 是 | 是 | 是 | external positive 分离 | pass_with_external_slots |
| CUT-RECOVERY / TRANSACTION / IDEMPOTENCY | 是 | 是 | 是 | durable/replay 正向 blocked | pass_with_blockers |
| CUT-CURSOR / CONFIG / OBSERVE | 是 | 是 | 是 | crypto/real binding blocked | pass_with_external_slots |
| CUT-DEPENDENCY / RESOURCE | 是 | 是 | 是 | baseline/publish 状态未伪造 | pass_with_external_slots |

### 7.8 跨切口设计来源审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 16 对象是否全部有切口 | pass；§7.2 恰好 16 个正式对象 | 无 |
| 7 service 是否全部有编排切口 | pass；§7.3 恰好 7 个 | 无 |
| 14 入口是否全部独立 | pass；2+6+2+4 | 无 |
| 03 Step16 最小清单是否承接 | pass；suite、入口、状态、原子/并发、配置/观测均映射 | 无 |
| 状态/错误正式命名 | pass；使用 Step8/10 名称 | 禁止后续使用 Success/Done/RolledBack 等别名 |
| 孤儿 P0 设计契约 | none found | 外部 exact schema/positive execution 留 blocked，不写 covered |
| 重复切口 | 无冲突；对象/入口/横切可多层验证但职责不同 | Step4 固定首要发现层，Step6 避免重复 TC |
| phase 越界 | 未发现 | Gap 不终局、Query 不 refresh、Request 不 baseline、Advance 单阶段、Export 不 archive |
| owner/归档/运行边界 | pass | 无 outbound event/outbox/archive handoff/runtime execution |

## 8. 对 03/04 的影响判定

| 结论 | 是否回写 | 处理 |
|---|---|---|
| 16 对象、7 service、14 入口和状态均可抽取 | 否 | 后续按正式名称设计用例 |
| 外部正向 fixture 无 exact schema | 否，既有 blocker | WS-UP-001~005/007 与 WS-LOCAL 保持 blocked |
| 未发现对象/协议/状态缺失 | 否 | 不改 03/04 |
| 若 Step6 无法给某入口精确断言 | 条件性是 | 停止并回源，不在05发明字段/状态 |

## 9. 回填草稿

正式 §3 回填计划测试路径、对象/service/入口索引和 15 个 CUT 总表；停审过程与诊断留在本文件。正式正文必须明确 planned/blocked，不能将“有测试入口”写成 suite 已存在或已通过。

## 10. 待确认事项与进入下一步条件

- WS-UP-001~008、WS-UP-006-S、WS-LOCAL-001~003 保持开放，无新增 blocker。
- 15 个 P0 cut 均通过设计来源、风险、层级、blocked 边界停审；跨切口无 unresolved 冲突。
- Step3 通过，允许进入 Step4 制定测试分层。
