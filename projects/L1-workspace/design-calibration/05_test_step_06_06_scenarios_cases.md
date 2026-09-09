# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6  
> 回填章节：`05-测试方案.md` §6

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / cases_planned_with_external_blockers |
| 输入 | Step5 的 59 个 TC/EV 候选；03 Step6~16；04 |
| 输出 | 59 个可判定用例、14 入口主例、切口停审和跨用例审计 |
| 执行事实 | 0 个已实现、0 个已执行、0 份真实 EV；全部 planned/blocked |

## 2. 本步目标与输入

本步把 59 个候选落成“前置→操作→正式预期→可观察断言”。不创建测试文件、fixture、脚本、artifact 或报告；外部 proof/schema 不可构造时，保留精确用例但标 `blocked`。

| 输入 | 用途 |
|---|---|
| Step5 §7.4 | 固定 TC/EV 范围，不另起编号 |
| 03 Step8/9 | 14 入口 request/response/receipt 与逐 flow 顺序 |
| 03 Step10~13 | 正式状态、事务、错误、幂等和 unknown |
| 03 Step14~16 / 04 | cursor、limits、配置、redaction、计划 suite |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 正向主线如何执行？ | 每个入口至少一个独立主例；需要 owner/bus/baseline 的主例保留 exact seam 前置并标 blocked，不用假 proof。 |
| 反向/边界如何触发？ | 缺 metadata/proof、撤权、异 digest、版本/CAS 冲突、乱序/gap、终态、篡改、超限和 sink failure 均用明确注入点。 |
| 非法状态如何断言？ | 使用正式 `InvalidTransition`/公开 `Conflict` 或安全错误映射；断言对象和存储写集不变。 |
| 回滚/副作用如何验证？ | write spy 与具名 commit fault point 检查“全有或全无”；unknown 只允许权威 lookup/Pending。 |
| 恢复如何复现？ | 按 Requested→…→Completed 每次一阶段/批，独立注入 gap、basis 变化、安全失效和 cutover CAS。 |
| phase 是否越界？ | Query 不 refresh；Request 不 baseline；Advance 不跨 phase；Gap 不终局；Export 不归档；receipt 不代表 bus ACK。 |
| 每个用例有无数据/EV？ | 有数据前置类别和一对一 EV 槽位；实际数据由 Step7、归档由 Step13，均未生成。 |

## 4. 当前材料问题诊断

| 首稿问题 | 风险 | 本步修正 |
|---|---|---|
| 仅五个示例 TC，且编号与 Step5 不一致 | 14 入口和横切红线未落地 | 展开注册表全部 59 个，用同序 EV |
| 六 Query 合并成一例 | 各自 Absent/status/export/page 语义丢失 | QRY-001~006 一一对应六入口 |
| recovery 只写 unknown/cutover | 四入口和九状态 phase 缺失 | REC-001~006 分入口与阶段/竞争 |
| 断言是“拒绝/不泄露”等口号 | 不可执行 | 指明 response variant、store call、字段与版本不变 |
| 外部正向假定可构造 | fake 可能伪造 owner truth | 相关用例标 external_blocked，local negative 仍 planned |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 用例数量 | 5 个示意 | 59 个已注册候选全部定义 |
| 入口覆盖 | 族级 | 14/14 独立主例 |
| 断言 | 宽泛 | 正式字段/状态/错误/写调用/phase |
| 证据 | `EV-CAND-*` 漂移 | 与 Step5 同序 `EV-WS-*` 槽位 |
| 外部依赖 | 模糊 blocked | 每用例区分 local planned / external blocked |

## 6. 测试设计取舍与公共判定口径

1. 表中“自动化=是”表示未来自动化候选；不是实现状态。
2. 成功断言必须读取返回值及权威 local snapshot/record；日志不能证明业务提交。
3. 失败断言至少检查公开错误/receipt、所有非预期写调用为零、原对象/版本不变。
4. 六 Query 公共断言：`WorkspaceAtomicStore` 七个写方法调用总数为 0；必须做现时 visibility；失败不返回 scope/ref/count/provenance。
5. 同 key/digest 回原 stored result；异 digest 为 Conflict；缺行/超时/进程退出不能断言 rollback。
6. 外部正向被 blocked 时，不允许把拒绝用例的成功执行写成该正向 seam 已验证。

## 7. 结构化中间产物

### 7.1 Contract、scope 与 visibility 用例

| 用例 ID | 场景/优先级 | 前置条件 | 输入/操作 | 预期结果与精确断言 | 自动化/EV/状态 |
|---|---|---|---|---|---|
| TC-WS-CONTRACT-001 | 14 入口 typed DTO/metadata roundtrip；P0 | 本地已闭合 constructors | 各 Request/Response/Receipt 合法构造后 codec roundtrip；删 required/加 unknown | 合法值逐字段相等；缺字段/未知影响行为的键为 InvalidInput/InvalidRequest；无隐式默认 | 是；EV-WS-CONTRACT-001；planned |
| TC-WS-CONTRACT-002 | typed ID/version/cursor 轴隔离；P0 | 不同种类但字节相似的值 | 尝试交叉构造/比较 ActorId、scope ref、partition/generation、source/view/read cursor | 类型/constructor 拒绝 WrongKind/Mismatch；无字符串兜底或跨轴 advance | 是；EV-WS-CONTRACT-002；planned |
| TC-WS-CONTRACT-003 | canonical digest 与 consistency；P0 | 同语义请求和单字段变体 | 重排不可重排字段、变 expected/budget/target；Query consistency=Strong | 同规范输入 digest 稳定；语义字段变化 digest 变化；Strong→InvalidRequest，零写 | 是；EV-WS-CONTRACT-003；planned；owner codec positive blocked |
| TC-WS-SCOPE-001 | ProvisionWorkspacePartition 主例；P0 | 正式 actor + Personal/Project resolution、无 partition | 调 Provision，store commit=Committed | `WorkspaceWriteResult.delivery=Committed`、result=Provisioned；partition version=1/current_generation=None；partition+operation+result 同事务；无 local/generation | 是；EV-WS-SCOPE-001；external_blocked WS-UP-005 |
| TC-WS-SCOPE-002 | scope/principal mismatch；P0 | resolution 属于另一 actor/scope | Provision 或任一入口提交 mismatch selector | NotAvailable/Blocked 或 InvalidRequest（按检测位置）；commit/write=0；不泄漏 anchor/ref | 是；EV-WS-SCOPE-002；local negative planned |
| TC-WS-SCOPE-003 | resolver missing/unavailable；P0 | Scope slot ContractBlocked 或技术不可达 | 调任一 scope 入口 | ContractBlocked/Blocked 或 SourceUnavailable/Unavailable；无 partition/query payload/write | 是；EV-WS-SCOPE-003；planned |
| TC-WS-VIS-001 | 当前允许且安全裁剪；P0 | 正式 current list/item binding | 执行 safe Query，随后 revalidate | 仅 AllowedSubset；每 item/provenance 对应 binding；无隐藏总数/来源；七写=0 | 是；EV-WS-VIS-001；external_blocked WS-UP-003 |
| TC-WS-VIS-002 | missing/conflict/revoked fail-closed；P0 | 将 list/item decision 设 missing/conflict/revoked | 执行 Query/下一页 | `SafeReadFailure` NotAvailable/Blocked；无 scope/items/count/provenance；七写=0 | 是；EV-WS-VIS-002；negative planned |
| TC-WS-VIS-003 | stale token/history 不授权；P0 | snapshot/token 带旧 allow，current 已撤销或超出 validity | 执行 read/revalidate | 整体或目标安全拒绝；不因 stale/partial 继续展示；token 不能替代 revalidate | 是；EV-WS-VIS-003；negative planned |

### 7.2 六 Query 独立用例

| 用例 ID | 对应入口/场景 | 前置条件 | 输入/操作 | 预期结果与精确断言 | 自动化/EV/状态 |
|---|---|---|---|---|---|
| TC-WS-QRY-001 | GetWorkspaceView；P0 | 安全 materialized current 或正式 transient slice | 分别请求 Materialized/Transient | response basis 与 mode 精确对应；freshness/coverage独立；Transient next=None；不 fallback；七写=0 | 是；EV-WS-QRY-001；local planned/external positive blocked |
| TC-WS-QRY-002 | ListWorkspaceInbox；P0 | Present/Withdrawn、local absent/present、正式关系 | 请求 StableIdentity/PinnedFirst | 仅 Present+visible；Read/Unread/Unknown 正确；hidden先过滤不泄漏量；无 local 时不创建；七写=0 | 是；EV-WS-QRY-002；relation positive blocked |
| TC-WS-QRY-003 | GetWorkspaceLocalState；P0 | 无 partition/无 local/有 local 三组 | 查询并对 focus/ref 做撤权 | `LocalStateSurface::Absent` 不持久化；Present 仅安全字段，撤权 ref 裁为 None；不改 last_opened/read cursor；七写=0 | 是；EV-WS-QRY-003；planned |
| TC-WS-QRY-004 | GetWorkspaceOperationResult；P0 | 已存 operation 与 wrong-partition/missing ref | 查询原 ref，再换 partition/ref | 合法返回不可变 original result；非法为 NotAvailable；不重跑、不从 current 重算；七写=0 | 是；EV-WS-QRY-004；planned |
| TC-WS-QRY-005 | GetWorkspaceRecoveryStatus；P0 | Requested/Blocked/Failed/Superseded/Completed snapshots | 逐状态查询 | 同一 snapshot 的 attempt/version/candidate/role/safety；Blocked/Failed 有 failure，Superseded 有 replacement；不 Advance/repair；七写=0 | 是；EV-WS-QRY-005；planned |
| TC-WS-QRY-006 | ExportWorkspaceReadModel；P0 | 安全 view 输入，View token 与 Export token 各一 | 正常 export、交换 token kind | schema_version=1 且 read_model 安全；错 kind→CursorInvalid；无 artifact/archive receipt/outbound/write | 是；EV-WS-QRY-006；local planned/downstream interop blocked |

### 7.3 两 Consumer、Inbox 与 local-state 用例

| 用例 ID | 场景/优先级 | 前置条件 | 输入/操作 | 预期结果与精确断言 | 自动化/EV/状态 |
|---|---|---|---|---|---|
| TC-WS-SRC-001 | ConsumeSourceChange Applicable 主例；P0 | 正式 envelope/schema/order/visibility 与 existing target | consume change，commit confirmed | Receipt=Applied；projection/source slice/coverage/Inbox（若明示）/SourceApplicationRecord/commit result 原子；record outcome=Applied；不 ACK/outbound | 是；EV-WS-SRC-001；external_blocked WS-UP-001~004/007 |
| TC-WS-SRC-002 | LateIgnored 与 duplicate；P0 | 已有安全 cursor；输入正式 old/equal | 先 late，再同 key/digest replay | late 写唯一 terminal record outcome=LateIgnored 且不退 cursor/revision；replay=Duplicate original，无二次版本/Inbox | 是；EV-WS-SRC-002；comparator positive blocked |
| TC-WS-SRC-003 | 同 key 异 digest/非法 envelope；P0 | 已有 terminal record；构造异 payload 或 unsupported schema | consume | 异 digest=Conflict，原 record 不变；unsupported=Rejected 且不 parse payload/写 projection；不声称 DLQ | 是；EV-WS-SRC-003；negative planned |
| TC-WS-SRC-004 | Gap 非 terminal；P0 | 正式 comparator 证明缺口 | consume missing successor | Receipt=Gap(gap_ref)；gap result 可提交但 `SourceApplicationKey` 无 terminal record；安全 cursor 保留；不标 Complete | 是；EV-WS-SRC-004；proof positive blocked |
| TC-WS-SRC-005 | commit unknown；P0 | apply commit 后响应丢失；resolve 可返回 Pending/Source/Gap | consume 并依次 resolve | 首次 Unknown；Pending 保持 OutcomeUnknown；Source/Gap 返回权威原值且不二次 apply；缺行/超时不能 NotCommitted | 是；EV-WS-SRC-005；controlled planned/durable blocked |
| TC-WS-SRC-006 | ConsumeSourceInvalidation 主例/fanout；P0 | 正式 invalidation proof，0/多 existing targets，某 target unknown | 单 target及分页 fanout | 每 target Applied/Duplicate/Unknown 独立；NoTargets 不建分区/全局键；unknown 未决不推进 next；安全 effect 不由 payload bool 决定 | 是；EV-WS-SRC-006；external_blocked |
| TC-WS-INBOX-001 | owner 明示 attention derive；P0 | 正式 attention identity/version/state 与 safe subject | Applicable change/baseline apply | 仅明示输入生成稳定 InboxItemId；Present/Withdrawn 精确；与 source/baseline binding 同事务 | 是；EV-WS-INBOX-001；external_blocked WS-UP-004 |
| TC-WS-INBOX-002 | 禁止推测/重复 unread；P0 | 文本含待办语义但无 attention；或同 event duplicate | apply/duplicate | 无 InboxItem；duplicate 不新增 item、不增 local/read revision；无本地 NLP/allowlist | 是；EV-WS-INBOX-002；planned |
| TC-WS-INBOX-003 | Withdrawn/reopen 与 local 意图保留；P0 | 现有 item+local override，正式 withdraw/reopen 变体 | 按版本 apply | Withdrawn 默认不列；无较新正式 reopen 不可 Present；合法 reopen 保留 stable id/local override，仍需 current visibility | 是；EV-WS-INBOX-003；reopen positive blocked |
| TC-WS-LOCAL-001 | ChangeWorkspaceLocalState 主例；P0 | partition存在，local Absent 或 Present(n)，有操作权限 | 显式 expected_local 调 change | Absent→Present(1) 或 n→n+1；result=LocalChanged；local+operation同事务；只目标字段变化 | 是；EV-WS-LOCAL-001；scope/relation positive blocked |
| TC-WS-LOCAL-002 | local CAS/主体边界；P0 | stale expected、另一 principal/scope/partition | change | Conflict/NotAvailable；local version/fields/operation均不变；不泄漏 existing target | 是；EV-WS-LOCAL-002；planned |
| TC-WS-LOCAL-003 | 多 stream read/override；P0 | 两 AttentionStreamRef、可比较/不可比较 basis、MarkUnread | 分别 Advance/MarkUnread/classify | 每 stream 独立；不可比较拒绝；override 优先 Unread 且去重；不写 owner receipt/source cursor | 是；EV-WS-LOCAL-003；relation positive blocked |
| TC-WS-LOCAL-004 | disposition/preference/focus 安全；P0 | visible/withdrawn/revoked refs | SetDisposition/Preference/Focus/LastOpened | 仅允许变体字段改变；Some ref 需 current binding，None 可清除；不能扩大 visibility 或改 attention lifecycle | 是；EV-WS-LOCAL-004；planned/external binding blocked |

### 7.4 Recovery、状态、事务与幂等用例

| 用例 ID | 场景/优先级 | 前置条件 | 输入/操作 | 预期结果与精确断言 | 自动化/EV/状态 |
|---|---|---|---|---|---|
| TC-WS-REC-001 | RequestWorkspaceRecovery 主例；P0 | existing partition、expected match、无同 key result | request Refresh/Rebuild | attempt=Requested、candidate role=Candidate/safety=Unverified、empty projection；current/local不变；attempt/candidate/result原子；不读 baseline | 是；EV-WS-REC-001；planned |
| TC-WS-REC-002 | Advance 各 phase 单步；P0 | 各非终态 snapshot 与正式 batch/proof | 每状态各调用一次 Advance | Requested→Baselining；每次最多一 batch/phase；Baselining/CatchingUp/Validating/Ready 按正式迁移；不在一次调用跨阶段循环 | 是；EV-WS-REC-002；baseline positive blocked |
| TC-WS-REC-003 | Ready cutover/revalidate 竞争；P0 | Ready+CutoverBasis；validate 后改变任一 basis 或安全失效 | 注入并发再 commit | 同 basis 才 old Current→Retired、candidate→Current、attempt→Completed、pointer切换同事务；合法变化回Validating；安全变化Blocked；无部分 promote | 是；EV-WS-REC-003；controlled planned/durable blocked |
| TC-WS-REC-004 | SupersedeWorkspaceRecovery 主例；P0 | old nonterminal、same-partition active replacement | supersede；再测 self/cross/环/terminal race | 只 old→Superseded 且 replacement字段设置；replacement/current/candidate不变；非法=Conflict，原值不变 | 是；EV-WS-REC-004；planned |
| TC-WS-REC-005 | InvalidateWorkspaceView 主例；P0 | exact existing targets；LocalDataStale 或正式 Owner proof | invalidate，注入 target CAS failure | DataStale只改 freshness相关效果；SafetyBlocked改 generation/coverage并阻止切换；记录+effects+result原子；整批 CAS 失败回滚 | 是；EV-WS-REC-005；owner safety positive blocked |
| TC-WS-REC-006 | recovery terminal/duplicate；P0 | Completed/Blocked/Failed/Superseded 与原 operation key | 新 key Advance；原 key replay | 新动作=Conflict，不复活；原 key=Duplicate exact original status/version/failure/replacement；不自动创建新 attempt | 是；EV-WS-REC-006；planned |
| TC-WS-STATE-001 | Coverage/Attention 状态全集；P0 | 每个正式 from 状态和 proof 组合 | 参数化合法/非法迁移 | Coverage五值和Attention两值按Step10；Invalidated不复活；Gap仅 bridge；Withdrawn仅较新正式 reopen；非法 self 不变 | 是；EV-WS-STATE-001；local planned/proof positive blocked |
| TC-WS-STATE-002 | Rebuild/Generation 双轴全集；P0 | 九 RebuildStatus、三 role、三 safety | 参数化 transition/effect | 四终态不复活；Retired不回Current；SafetyBlocked不清；Ready回Validating不能绕安全；单partition最多一Current | 是；EV-WS-STATE-002；planned |
| TC-WS-STATE-003 | read/commit/availability 分类；P0 | freshness×coverage×visibility；CommitOutcome/Resolution；AdapterObservation | 参数化组合 | 安全 unknown fail-closed；Fresh/Stale/Unknown与Complete/Partial/Unknown分轴；Pending不回滚；Bound不等readiness | 是；EV-WS-STATE-003；planned |
| TC-WS-TXN-001 | source apply 原子性；P0 | 在 projection、coverage、Inbox、terminal、commit result 各写点注错 | commit source apply | 全部不可见或全部可见；无半 cursor/Inbox/FK悬空；Unknown 不做第二事务掩盖 | 是；EV-WS-TXN-001；controlled planned/durable blocked |
| TC-WS-TXN-002 | recovery/local/provision 原子和隔离；P0 | 各具名 carrier 写点故障、两个同 expected local 写 | commit/并发 | carrier规定写集全有或全无；两个 local 一胜一Conflict；local不随cutover丢失；跨partition无虚假全局原子 | 是；EV-WS-TXN-002；controlled planned/durable blocked |
| TC-WS-TXN-003 | invalidation fanout/commit unknown；P0 | 多 target，其中成功/失败/unknown | consume/resolve | 每partition独立提交；已成功保留，未决不跳；全局不造success；权威 resolution 精确 | 是；EV-WS-TXN-003；controlled planned/durable blocked |
| TC-WS-IDEM-001 | operation same key/digest replay；P0 | 已存 Provision/Local/Recovery/Invalidated result | 重发相同请求 | delivery=Duplicate，所有原字段/version/status/ref精确相同；ID allocator/业务写不再调用 | 是；EV-WS-IDEM-001；planned |
| TC-WS-IDEM-002 | same key different digest；P0 | 改 expected/budget/target/change | 重发 | Conflict；原 record/effect不变；不得覆盖或以新key暗中执行 | 是；EV-WS-IDEM-002；planned |
| TC-WS-IDEM-003 | source/baseline/fanout 重入；P0 | terminal source、Gap、baseline binding、已提交 child target | 分别重投 | terminal精确Duplicate；Gap可经正式bridge再Applied；baseline不重复构造Inbox；child逐partition回原结果 | 是；EV-WS-IDEM-003；planned/external proof blocked |

### 7.5 Cursor、配置、安全、依赖、资源与边界用例

| 用例 ID | 场景/优先级 | 前置条件 | 输入/操作 | 预期结果与精确断言 | 自动化/EV/状态 |
|---|---|---|---|---|---|
| TC-WS-PAGE-001 | page cursor 全轴绑定；P0 | 有安全 materialized next token | 每次只改 principal/partition/generation/view/local/query/visibility/position 或 QueryKind | 每一轴变化均 CursorInvalid；不 silent 首屏、不换 current/retired；View/Export token不可互换；七写=0 | 是；EV-WS-PAGE-001；planned |
| TC-WS-PAGE-002 | wire tamper/key/nonce/no-write；P0 | codec key ring 与 token | 篡改 header/version/key_id/nonce/ciphertext/tag；未知/撤 key；两次 encode | 均统一 CursorInvalid 且不泄露原因；合法随机nonce token均可解同plaintext；encode/decode无持久写 | 是；EV-WS-PAGE-002；local codec planned，crypto product blocked WS-LOCAL-003 |
| TC-WS-CONFIG-001 | strict schema/source/profile；P0 | 04 完整结构占位 fixture | 缺必填、未知键、类型错、profile冲突、隐式默认 | load/validate fail-fast；RuntimeBuilder不构造；错误/log无value/secret；配置不写业务状态 | 是；EV-WS-CONFIG-001；planned |
| TC-WS-CONFIG-002 | limits/secret/key ring；P0 | typed limits 与 secret refs | 零 duration、不满足关系、重复/空 key id、active key缺失、明文 secret字段 | ContractError/启动拒绝；无默认/clamp/plaintext fallback；secret material不可Debug/Serialize/公开getter | 是；EV-WS-CONFIG-002；planned |
| TC-WS-CONFIG-003 | capability binding/profile failure；P0 | local/test/staging/production 四profile矩阵 | 缺 Store/Owner/Bus/Cursor slot；production 注 fake；设置观察值 | affected branch ContractBlocked/Unavailable 或启动拒绝；production无fake fallback；AdapterAvailability::Bound不等readiness/allow | 是；EV-WS-CONFIG-003；planned，真实binding blocked |
| TC-WS-SEC-001 | forbidden data canary/redaction；P0 | 在 body/token/DSN/secret/proof/IDs 放唯一 canary | 触发成功、拒绝、panic-safe error、report候选输出 capture | log/metric/trace/audit/error 中 canary 零出现；只允许 Step15 白名单字段；不生成假 evidence | 是；EV-WS-SEC-001；planned |
| TC-WS-SEC-002 | telemetry sink failure；P0 | 可控 log/metric sink 故障 | 在 read、commit前、commit后、duplicate 时注错 | 业务 response/commit 分类不因 sink 改变；不重执行业务补日志；dropped只安全低基数观测 | 是；EV-WS-SEC-002；planned |
| TC-WS-SEC-003 | 隐藏元信息/错误等价；P0 | 同一未授权目标的不存在、撤权、损坏三种内部原因 | 分别 Query/operation lookup/cursor | 外部均按安全映射不暴露 scope/ref/count/provenance/key原因；write=0；内部细节不进入错误文本 | 是；EV-WS-SEC-003；planned |
| TC-WS-DEP-001 | compile/runtime/event/ref/adapter 分类；P0 | 目标 manifest/import 图（实现后） | 静态扫描 Cargo/import/模块依赖 | 仅获准 L0-core 是 compile候选；无 L1/L2/L4 business path dependency、共享表或跨仓transaction | 是/检查脚本候选；EV-WS-DEP-001；planned |
| TC-WS-DEP-002 | fake 生产隔离；P0 | fake/support 与 production composition paths | 扫描导出/feature/profile；尝试 production missing slot | fake仅 tests/support显式使用，不由production fallback；缺slot为Blocked/Unavailable；不能产readiness | 是/检查脚本候选；EV-WS-DEP-002；planned |
| TC-WS-RES-001 | request/page/token 边界；P0 | 每项配置值记作 L，不固化数字 | 输入 L、L+1 与 oversized decode | L按合同处理；L+1 InvalidRequest/CursorInvalid；不先分配超限；不静默clamp | 是；EV-WS-RES-001；planned |
| TC-WS-RES-002 | snapshot/commit 完整性上限；P0 | 完整结果分别等于/超过 rows/bytes 限额 | read/commit adapter装配 | 超限明确 Unavailable/失败；不得截断集合后标 Complete/Committed；原事务不部分写 | 是；EV-WS-RES-002；planned/durable blocked |
| TC-WS-RES-003 | recovery/fanout/in-flight 有界；P0 | budget/limit/in-flight 的 L 与 L+1 | Advance/Invalidation/worker并发 | 每调用只处理≤L；L+1拒绝而非偷偷截断目标；continuation/next显式；无数字性能通过结论 | 是；EV-WS-RES-003；planned |
| TC-WS-BOUND-001 | 无 owner write/outbound/archive；P0 | 所有14入口 ports spy | 执行每入口成功/失败/duplicate | owner mutation/outbound event/outbox/archive handoff调用恒为0；Export只回 read model；receipt非ACK | 是；EV-WS-BOUND-001；planned |
| TC-WS-BOUND-002 | workspace 存储所有权/正文排除；P0 | 每种 logical store 写集与外部body canary | commit各 carrier并枚举persisted fields | 只含partition/projection/local/operation/recovery及安全ref/binding；无L1正文、authorization truth、runtime/tool/archive/SDK state | 是；EV-WS-BOUND-002；planned |
| TC-WS-BOUND-003 | maintenance/query 不修上游 truth；P0 | 缺 source/visibility/baseline/driver | 执行 Query、Consumer、Recovery、Invalidate、Export | 仅 stale/partial/blocked/unavailable/fail-closed或局部记录；不生成上游事实、不以旧projection作baseline、不切retired逃逸 | 是；EV-WS-BOUND-003；planned/external blocked |

### 7.6 十四入口主例停审

| 入口 | 主用例 | 前置/操作完整 | 正式断言完整 | phase/副作用正确 | 状态 |
|---|---|---|---|---|---|
| ProvisionWorkspacePartition | TC-WS-SCOPE-001 | 是 | 是 | 不建projection/local/generation | external_blocked |
| ChangeWorkspaceLocalState | TC-WS-LOCAL-001 | 是 | 是 | 只local+operation | pass_with_external_slot |
| GetWorkspaceView | TC-WS-QRY-001 | 是 | 是 | no-write/no fallback | pass_with_external_slot |
| ListWorkspaceInbox | TC-WS-QRY-002 | 是 | 是 | no-write/current relation | pass_with_external_slot |
| GetWorkspaceLocalState | TC-WS-QRY-003 | 是 | 是 | Absent不初始化 | pass |
| GetWorkspaceOperationResult | TC-WS-QRY-004 | 是 | 是 | 不重跑 | pass |
| GetWorkspaceRecoveryStatus | TC-WS-QRY-005 | 是 | 是 | 不Advance | pass |
| ExportWorkspaceReadModel | TC-WS-QRY-006 | 是 | 是 | 无artifact/archive/outbound | pass_with_downstream_blocker |
| ConsumeSourceChange | TC-WS-SRC-001 | 是 | 是 | Applied原子，receipt非ACK | external_blocked |
| ConsumeSourceInvalidation | TC-WS-SRC-006 | 是 | 是 | per-target，无global success | external_blocked |
| RequestWorkspaceRecovery | TC-WS-REC-001 | 是 | 是 | 不读baseline | pass_with_scope_slot |
| AdvanceWorkspaceRecovery | TC-WS-REC-002 | 是 | 是 | 一次一phase/batch | external_blocked |
| SupersedeWorkspaceRecovery | TC-WS-REC-004 | 是 | 是 | 只改旧attempt | pass |
| InvalidateWorkspaceView | TC-WS-REC-005 | 是 | 是 | effects分离、单partition原子 | pass_with_owner_slot |

### 7.7 测试切口用例批次与停审

| CUT | 用例批次 | 场景类型 | 数据前置可定义 | EV 唯一 | 停审结论 |
|---|---|---|---|---|---|
| CUT-CONTRACT | CONTRACT-001~003 | 正向/缺失/边界/类型 | 是；typed local | 是 | pass_with_owner_codec_slot |
| CUT-OBJECT / CUT-STATE | STATE-001~003 + 入口对象断言 | 合法/非法/终态/组合 | 是；object builders | 是 | pass_with_external_proofs |
| CUT-SCOPE-VIS | SCOPE-001~003、VIS-001~003 | 正向/撤权/缺口/泄漏 | local negative是；positive待owner | 是 | pass_with_blockers |
| CUT-QUERY | QRY-001~006 | 六入口正向/空/退化/拒绝 | 是；snapshot/write spy | 是 | pass_with_external_slots |
| CUT-COMMAND | SCOPE-001、LOCAL-001~004、IDEM-* | 正向/CAS/replay/conflict | 是 | 是 | pass_with_scope_slot |
| CUT-SOURCE | SRC-001~006、INBOX-001~003 | 正向/重复/乱序/gap/unknown/fanout | local分类是；exact event否 | 是 | pass_with_blockers |
| CUT-RECOVERY | REC-001~006 | 四入口/phase/终态/竞争 | local状态是；baseline否 | 是 | pass_with_blockers |
| CUT-TRANSACTION / IDEMPOTENCY | TXN-001~003、IDEM-001~003 | fault/concurrency/replay | controlled是；durable否 | 是 | pass_with_driver_blocker |
| CUT-CURSOR | PAGE-001~002 | 轴/篡改/key/no-write | local codec是；real crypto否 | 是 | pass_with_crypto_blocker |
| CUT-CONFIG / RESOURCE | CONFIG-001~003、RES-001~003 | schema/profile/limit/failure | 是；占位L非真实值 | 是 | pass_with_binding_slots |
| CUT-OBSERVE | SEC-001~003 | redaction/sink/non-leak | 是；synthetic canary | 是 | pass |
| CUT-DEPENDENCY | DEP-001~002、BOUND-001~003 | static/runtime negative | 是；实现后扫描 | 是 | pass_as_planned |

### 7.8 跨用例断言、phase 与编号审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| TC 数量/唯一性 | 59/59，17族区间与Step5一致，无重复 |
| EV 槽位数量/唯一性 | 59/59，一对一同后缀；没有真实证据声明 |
| 14入口主例 | 14/14；2 Command、6 Query、2 Consumer、4 Operation |
| 正向/负向/边界 | 每个CUT至少具备；无法正向者明确blocked |
| 前置/操作/预期/断言 | 59行均具备，不使用“看是否成功” |
| Query no-write | QRY-001~006均要求七写方法=0；观测开关不例外 |
| 状态/错误命名 | 使用正式variant/公开映射；无Done/Success/RolledBack等旧口语 |
| phase边界 | Request不baseline、Advance不跨phase、Gap不terminal、Export不archive、receipt不ACK |
| duplicate/unknown | replay原值；Pending不换key；缺行/timeout/process exit不证明rollback |
| owner truth/fake | positive blocker保留；fake不生成authorization/event/replay/readiness |
| 一票否决 | VIS/QRY/SRC/REC/BOUND/DEP/SEC均有自动化负向候选 |

## 8. 对 03/04 的影响判定

59 个用例均可回指现有字段、状态、错误、port、flow 或配置项；未发现新的对象/协议/配置缺口。实际实现若无法注入 commit fault、write spy 或读取权威 record，属于 03 可测性偏差，届时必须回写；当前尚未实现，不能判定已发生。

## 9. 回填草稿

正式 §6 回填公共断言口径、五组用例矩阵、14入口停审摘要和事实边界。所有 `EV-WS-*` 标为 planned evidence slot，不得称 evidence 已产生；blocked 用例不得被省略或记 pass。

## 10. 待确认事项与进入下一步条件

- 59 个用例均可判定、可映射数据类型、自动化候选和唯一 EV 槽位。
- WS-UP-001~008/006-S、WS-LOCAL-001~003 保持开放；未新增 owning blocker。
- 每个 P0 CUT 已停审，跨用例无 unresolved 命名/断言/phase/编号冲突。
- Step6 通过，允许 Step7 设计可重复数据、隔离、清理与替身边界。
