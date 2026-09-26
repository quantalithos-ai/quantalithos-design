# Step 3. 收稳约束条件

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；Step 1~2 门禁已通过。
- `gate_status=pass_with_upstream_blockers`；`formal_fill_allowed=step14_only`。
- 本步只收稳会改变代码主体、对象、接口、处理流或状态机判断的硬约束，不写泛化工程口号或实现策略。

### Step 内计划

1. 回读正式 00 `BR/VETO`、正式 01 数据/通信/横切约束和 Step 1~2。
2. 按 ownership、context/access、query、local safety、consistency、handoff、provenance、dependency 分类约束。
3. 为每条约束标明后续影响与 blocker 口径。
4. 检查约束无冲突、无 owner 转移、无配置可绕过项。
5. 形成正式 §3 回填草稿并更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 1 §7.2~7.7 | owner、稳定/受阻输入、依赖裁剪和完成上限 |
| Step 2 §7 | 当前范围、深度、P0/P1/P2 与非范围 |
| 正式 00 §10~14 | `BR-SYNC-001~025`、数据归属、NFR、`VETO-SYNC-001~005` |
| 正式 01 §3~4、§8~13 | 架构红线、依赖、数据一致性、通信、机制与横切关注点 |

## 3. SOP 问题回答

1. **直接影响结构的约束有哪些？** 单一 owner、explicit context、mutation 前 owner revalidation、query no-write、source/working-copy 分离、local generation/cursor 原子性、non-overwrite、no blind replay、handoff 分层、provenance/forbidden-body、ports/adapters 和 blocker 真实传播。
2. **来源分别是什么？** 业务红线主要来自正式 00 `BR/VETO`；结构、依赖和一致性口径来自正式 01 §8~13；精确合同限制来自 `SYNC-UP-001~010`。
3. **最易串线的边界？** local working copy vs Workspace projection、Git commit vs Artifact/Baseline、access snapshot vs authorization、handoff ACK vs Governance Decision、cursor vs Git HEAD、diagnostic vs evidence/readiness。
4. **哪些泛化原则不进入？** “高内聚低耦合”“高性能”“可扩展”等没有直接判断动作的口号不进入；固定超时、并发和 SLA 也没有 authority。
5. **能否指导后续？** 每条约束必须至少落到 Step 4~11 的一个对象、接口、流、状态、异常或配置禁止项；否则删除。

## 4. 当前文档问题诊断

旧 02 把跨端一致性、重放和任务状态视作核心，缺少 local truth 与 external truth 的硬分界，也没有 status no-write、dirty protection、unknown probe、ACK/Decision 分层和 provenance 禁删约束。若继续沿用，将直接导致 Step 6~9 对象与状态主语错误。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 约束围绕旧消息同步和固定 SLA | 约束围绕本地安全、owner 单一、结果分层与恢复 |
| Git/transport/platform truth 容易合并 | 每一结果轴独立归属、持久化与传播 |
| query 与 repair/refresh 混淆 | status/query 绝对 no-write，维护动作独立 |
| 上游缺口可能由本地实现补齐 | blocker 进入接口/状态/异常，不得用 opaque/fake 绕过 |

## 6. 设计取舍

- 将安全红线定义为不可配置化的结构约束；适配器能力或用户便利性不能降低门禁。
- local strong transition 只覆盖 Sync-owned state 与受控 apply 可见性，不宣称跨 owner 分布式事务。
- 外部 snapshot 可用于显示和诊断，但危险 mutation 必须按 owner 合同重验证；离线/超时不等于授权继续。
- 对 unknown outcome 优先保持“不知道”并 probe/manual，牺牲自动化以避免重复外部副作用。

## 7. 结构化中间产物

### 7.1 约束条件表

| ID | 约束 | 说明 | 后续直接影响 |
|---|---|---|---|
| `HC-SYNC-01` | 单一 truth owner | Sync 只拥有本地 session/binding/metadata/cursor/mapping/conflict/checkpoint/attempt/provenance；平台与 Git remote truth 不转移 | 全部对象、ports、状态 |
| `HC-SYNC-02` | 显式操作语境 | 每次 mutation 必须绑定 `principal + project + version/source + target + operation`；不接受 latest/default branch/directory/cache 推断 | CLI input、SelectionContext、access flow |
| `HC-SYNC-03` | owner revalidation / fail-closed | 危险副作用前重新核验 permission、posture、source eligibility；unknown/stale/denied/revoked/archived/dissolved/conflicting 均停止 | access guard、materialize/handoff flow、异常 |
| `HC-SYNC-04` | status/query no-write | 查询不得 refresh owner、迁移/修复 metadata、推进 cursor、创建 conflict/checkpoint、probe 或改变上游 | Query API、read model、adapter 调用 |
| `HC-SYNC-05` | source 与 working copy 分离 | source version/watermark 与本地路径/Git 状态分别建模，source ref 不等于文件已安全落地 | binding、plan、cursor、status |
| `HC-SYNC-06` | 多轴版本/结果不可互代 | platform version、source/local cursor、metadata generation、Git HEAD/commit/tree、transport/probe、Review Decision、archive posture 各自独立 | 对象字段、状态、输出 view |
| `HC-SYNC-07` | non-overwrite | dirty/untracked、path/symlink、锁、metadata ambiguity 或工具能力未知时不得 apply；禁止自动 stash/merge/rebase/push/force overwrite | Git/fs ports、conflict policy、materialize flow |
| `HC-SYNC-08` | plan-before-apply | materialization 必须先固定 source/binding generation、比较结果、mapping/path plan 与 precondition；计划漂移则失效 | plan object、apply service、state machine |
| `HC-SYNC-09` | local atomic visibility | apply outcome、mapping、local applied cursor、generation/checkpoint 不能形成“cursor 已前进但内容未知”的可见组合；unknown 时不 finalize | local store/UoW port、recovery state |
| `HC-SYNC-10` | comparator/gap 有 authority | 无正式 comparator、cursor/mapping 连续性和 gap 语义时 pull 为 blocked；不得以时间戳、收到顺序或 Git commit 猜连续性 | source port、pull flow、gap conflict |
| `HC-SYNC-11` | conflict evidence + explicit decision | 冲突记录必须含来源、影响、依据、路径/mapping 与恢复关联；只有显式用户/owner 决定可产生后续本地动作 | ConflictRecord、Resolve/Resume command、history |
| `HC-SYNC-12` | prepare→call→probe/finalize | 任何可能产生外部副作用的 handoff 先持久化 attempt/idempotency context；unknown 不盲重放 | HandoffAttempt、probe port、processing flow |
| `HC-SYNC-13` | transport 与 decision 分层 | candidate frozen、call sent、ACK、probe outcome、Gate/Decision ref 与 accepted/approved 必须分别表达；只有 Governance owns decision | API result、handoff/status state |
| `HC-SYNC-14` | candidate freeze-bound | review candidate 绑定 source/binding generation、local observation 和 digest；dirty/drift/posture/access 变化使其失效 | ReviewCandidate、push-review flow |
| `HC-SYNC-15` | provenance 不可伪造/静默删除 | metadata init/migrate/rebind/repair/cancel/cleanup 均不得抹除或重写受保护来源链；缺口必须显式 | metadata objects/store、maintenance commands |
| `HC-SYNC-16` | forbidden body / secret | credential/token/private key、owner正文、raw stdout/stderr、evidence/report 正文不得进入 metadata、日志、status 或 handoff result | schemas、diagnostics port、redaction tests |
| `HC-SYNC-17` | adapters 白名单与依赖倒置 | SDK/Git/fs/store/diagnostic 均经 ports；entry/application 不直连 owner DB/private endpoint/任意 shell/bus | Step 4 分层、Step 7 ports |
| `HC-SYNC-18` | local ref/snapshot 有来源与时效 | 每个外部 ref/snapshot 携带 source、version/freshness/observed-at/visibility；snapshot 不能授权或替代 owner query | ExternalOwnerSnapshot、status view |
| `HC-SYNC-19` | posture invalidation 优先 | 撤权、归档、解散、source invalidation 使相关 plan/candidate/session 受限；不靠旧缓存继续 | state propagation、exception flow |
| `HC-SYNC-20` | 诊断不升格证据 | telemetry/correlation/receipt/fake output 只能说明本地尝试或关联，不证明同步成功、Review verdict、signoff/readiness | diagnostics objects、tests/evidence boundary |
| `HC-SYNC-21` | blocker 真实传播 | 未闭合 owner 合同必须进入 typed blocked/unsupported/needs-action/probe-required 结果，不得由 opaque map、fixture、历史 RPC 填空 | API result、state、risk/handoff |
| `HC-SYNC-22` | 配置不可绕门禁 | 配置只能选择 adapter/profile/budget/呈现策略，不能关闭 access、dirty/path、provenance、no-write、no-blind-replay 或 Gate 分层 | Step 11 禁止配置化表 |

### 7.2 约束到组成部分预映射

| 组成部分 | 主要适用约束 |
|---|---|
| Selection & Access | `HC-SYNC-01~04`,`18`,`19`,`21` |
| Working Copy & Metadata | `HC-SYNC-05~09`,`15~18`,`22` |
| Source Materialization | `HC-SYNC-03`,`05~10`,`17`,`19`,`21` |
| Conflict & Recovery | `HC-SYNC-07`,`09~12`,`15`,`19~21` |
| Review Handoff & Provenance | `HC-SYNC-03`,`06`,`12~16`,`18~22` |

### 7.3 约束冲突审计

| 检查 | 结论 |
|---|---|
| no-write 与 freshness | status 只显示现有 snapshot freshness；refresh 必须独立显式 command/job |
| local atomic 与 Git/fs 外部性 | 不宣称跨 Git/fs 事务；用 plan/checkpoint/unknown state 保持可解释，不提前推进 cursor |
| resume 与 no-blind-replay | 只重入已证明 local-safe 的步骤；外部副作用先 probe，无法证明则 manual |
| provenance retention 与用户删除意图 | 可删除工作材料不等于可抹除受保护来源链；精确保留规则受 `SYNC-UP-006` 阻断 |
| fail-closed 与可用性 | blocked/unknown 是正式结果，不用缓存/降级成功换取“可用” |
| Git 工具适配与用户自主操作 | Sync 不禁止用户在工具外操作，但每次后续 mutation 必须重新观察并使陈旧计划失效 |

本章不新增图：这些约束将分别在 Step 4~11 映射到主体、对象、接口、流、状态、异常和配置门禁；另画抽象图不会增加结构信息。

## 8. 回填草稿

正式 §3 摘录 §7.1 的硬约束，并以 §7.2 说明对五部分的直接影响。正文不复制冲突审计过程，但延伸阅读明确指向本文件的“约束冲突审计”。

## 9. 待确认事项

- `SYNC-UP-001~010` 继续决定相应 port 能否开放正向实现；本地约束本身不因此降级。
- `HC-SYNC-09` 的精确原子/恢复机制、`HC-SYNC-15` 的保留规则留给 03，并受 metadata/Git/fs 合同阻断。

## 10. 进入下一步条件

- [x] 22 条约束均有正式来源并可影响后续结构判断。
- [x] owner、query、版本、Git、恢复、handoff、provenance 与 evidence 易混淆边界已覆盖。
- [x] 约束冲突已给出保守解释，无跨 owner 原子事务或离线授权暗示。
- [x] 未写配置键、物理 schema、实现算法或固定 SLA。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 4。此结论仅为文档静态自检。
