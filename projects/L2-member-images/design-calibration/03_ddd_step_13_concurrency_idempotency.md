# L2-member-images 03 详细设计 Step 13：并发、幂等与重入保护

> 创建日期：2026-08-31  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13  
> 回填位置：正式 `03-详细设计.md` 第 12 章“并发、幂等与重入保护”（当前仅形成回填草稿，禁止装配正式 03）  
> 当前授权：用户已授权完成 Step 13。本文件完成后必须停审；未经用户再次明确确认，不得创建 Step 14、装配正式 `03-详细设计.md`、实现、测试或提交。

## 0. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 13：并发、幂等与重入保护。 |
| 恢复入口 | 已先读取项目执行台账、03 flow、Step 6~12 校准材料，以及 Step 13 SOP、书写规范与 `L1-governance` 的同粒度样例。 |
| 直接输入 | Step 8 的 10 Command、10 Query、2 条条件入站边界和 6 个 bounded Job；Step 9 的逐接口流；Step 11 的 local-store/UoW/version/replay 约束；Step 12 的错误与恢复口径。 |
| 方法参照 | 只借鉴 `L1-governance` 的“并发场景 → 可计算 identity → duplicate/partial-failure 矩阵 → 重入恢复 → 测试切口 → 跨 Step 审计”粒度和格式；不继承其 digest、receipt、outbox、publisher、delivery、scheduler、lease、report 或治理对象。 |
| 当前可达写路径 | 10 个 Command 和 6 个 Job 均在 `DDD-S9-B01` 前停止；当前不得 begin UoW、reserve、读取/保存 repository、调用 external seam、保存 result、complete 或 commit。Query 是完整只读；两条条件入站仅 marker-only，`accepted_input=false`。 |
| 本 Step 目标 | 明确真实冲突资源、既有 key/opaque stable-input 的使用上限、重复/冲突/未知提交的 fail-closed 行为，以及将来重开后必须验证的测试切口。 |
| 本 Step 不做 | 不新增 digest/hash 算法、key 类型、result-ref factory、reservation variant、receipt、dedup 记录、scheduler、lease、run/report、outbox、publisher、delivery state、外部 adapter truth 或任何实施事实。 |
| 完成结论 | `pass_with_explicit_blockers`：已定义当前可实施的零写保护和 future/reopen 的既有对象组合；in-flight reservation 观察及 reservation namespace 的歧义不能由本 Step 私造状态/错误/port，已显式登记为 reopen 项。 |
| 强制停点 | Step 13 完成后仅允许等待用户明确确认 Step 14；不得读取旧正式 `03-详细设计.md`，不得装配正式 03。 |

### 0.1 本 Step 的不可逾越边界

- 本仓只保护其 local DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived、projection 与 application replay 的一致性；不拥有 RoleDefinition、mapping/component/seed/base 正文、runtime/tools/member/supervisor、live memory/checkpoint/workspace、Artifact、Member Service、container、sandbox、governance、observability 或外部 adapter truth。
- `StableOperationInputRef` 是 future canonicalizer 的 opaque、body-free matching identity；它不是 image digest、Artifact digest、payload hash、签名、tag、版本号或加密证明。本 Step 不选择算法，也不生成任何值。
- 已闭口的 application replay identity 只能按下列既有字段理解：`channel`、`operation_name`、`idempotency_key`、`StableOperationInputRef`。其中 reservation 的已声明唯一 lookup 是 `(channel, operation_name, idempotency_key)`；stable input 只用于判断同一 key 是否为同一请求，不能替代该 reservation key。
- Query 不 reserve、不写 replay、不写 trace/gap/freshness、不刷新 source、不 rebuild projection。conditional inbound 仍无 envelope/payload/dedup/receipt/write contract；重复调用只能重复返回当前 marker disposition，不能称为 event replay。
- `ImageOutboundEventInventory::NoneAuthorized` 仍为严格零库存。stored result、trace、availability history、gap、projection marker 和 local entry 都不是 outbox、delivery receipt 或发布事实。
- `L2-member`、`L2-member-service` 的并行材料，以及 MI-UP/Q-MI 未闭合内容继续只作 pending 输入；不得因“重复/重入保护”而把 member-service confirmation、Artifact acceptance、builder outcome、gate pass 或 external readiness 写成可重放事实。

## 1. Step 内计划、批次与停审门禁

| 批次 | 覆盖范围 | 状态 | 完成判断 |
|---:|---|---|---|
| 13.0 | 恢复、输入、边界、SOP 问答和 current/future 可达性判定 | `done` | 已确认旧正式 03 不可读；不把 L1-governance 的 outbox/in-flight enum 搬入本仓。 |
| 13.1 | 并发资源、同对象版本、唯一性和 append-only 场景 | `done` | Command、Job、Query、条件入站及 projection/handoff 边界都能回指 Step 9~11。 |
| 13.2 | 幂等 scope、opaque stable-input、10 Command/6 Job identity 表 | `done` | 所有写类 logical surface 的 key 来源、字段集合、replay kind 与当前 blocker 已列明；未生成 digest。 |
| 13.3 | duplicate、conflict、Reserved/in-flight、部分失败、commit unknown 矩阵 | `done` | 现有 `Reserved/Duplicate/Conflict` surface 的能力和不足被分开记录；没有新增 enum。 |
| 13.4 | 重入保护、Query/入站特殊边界、跨 Step 审计与测试切口 | `done` | 可供未来 Step 16 拆分验证；不声称测试已执行。 |
| 13.5 | 回填草稿、blocker/Step 14 handoff、自检和停审 | `done` | flow 与执行台账可切换到 `completed_stop_review`。 |

| Step / 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `concurrency_idempotency` | done | done | done | done | done | done | `pass_with_explicit_blockers` | 停审，等待用户明确确认 Step 14。 |

## 2. SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 哪些处理流可能并发修改同一资源？ | future/reopen 的 10 Command 可并发修改相同 family/variant、baseline/revision、intent/attempt/candidate、qualification/handoff、entry/history 或 reference/projection 对象；6 个 Job 还可能与 Command 或彼此处理同一显式 page/target。所有 existing mutable object 用其自身 `Versioned<T>.version`，new object 用 `Absent`，append-only trace/history 用唯一 identity；当前 B01/B02 下这些写冲突均不可达。 |
| 2 | 哪些接口、事件或 Job 可能被重复调用？ | Command 可能因调用方超时或重试重复；Job 可能被 bounded caller 重复提交或用新 key 重跑重叠 scope；Query 可任意重复但只读。两条条件入站当前不是 accepted event consumer，因而没有可称为 dedup/replay 的 event 路径。 |
| 3 | 幂等键来自请求、事件、Job 参数还是数据库唯一约束？ | Command/Job 仅从 `ImageWriteMetadata.idempotency_key` 取得 raw key，且以 `channel + operation_name + key` 定位 reservation，再以 `StableOperationInputRef` 区分同请求和 key reuse。logical store 的 business unique/index 和 `ExpectedLocalObjectVersion` 只保护 local truth，不能取代 stored-result replay。条件入站无合法 key；Query 无 key。 |
| 4 | 重复请求应该返回既有结果、跳过、覆盖还是报错？ | 只有 future `reserve` 明确返回 `Duplicate { result_ref }` 时，才 rollback 当前 UoW、exact-read stored shell/body，并返回 `DuplicateReplay`；绝不重跑 mutation、adapter、page selection 或 rebuild。same key 但 stable input 不同只能 `IdempotencyConflict`；version/unique conflict 不覆盖。当前 B01/B02 前没有任何可达 replay。 |
| 5 | 并发冲突如何测试？ | Step 16 必须覆盖 B01/B02 零副作用、same-key duplicate、same-key different input、stale expected version、business uniqueness、overlapping Job page、projection race、stored-result missing、commit unknown、Query no-write 与 marker-only inbound。下文只规划切口，不产生测试结果、run_id、report、evidence、verdict 或 signoff。 |

## 3. 当前材料诊断与设计取舍

### 3.1 输入诊断

| 来源 | 已有结论 | 若直接实现的风险 | 本 Step 收束 |
|---|---|---|---|
| Step 6 | 已有 `ImageOperationContext`、`ImageIdempotencyRecord`、`StoredImageOperationResult`、channel/name/stable-input/result carrier 与技术生命周期 | 可能把 raw key、tag、digest、timestamp 或 request body当作 replay identity，或将 `Reserved` 误读为可重入成功 | 固定 opaque stable input 与 reservation lookup 的职责；不将 carrier 误写成已实现的 factory/算法。 |
| Step 7 | 已有 UoW、version、canonicalizer、reservation、stored result/replay port | `reserve` 仅返回 `Reserved/Duplicate/Conflict`，没有已闭合的 Reserved/in-flight observation；实现者可能擅自新增 `AlreadyInProgress` | 保持现有 enum；将 in-flight 检测/返回作为 reopen blocker，不以新错误或 state 补齐。 |
| Step 8 | 每个 Command/Job 已有 logical name、metadata、canonical field order 与 replay kind；Query 无写；inbound marker-only | 可能把 field order 等同于 concrete `CanonicalImageOperationInput`，或把 job page 当 scheduler cursor | field table仅重述 protocol identity；明确它仍缺 concrete carrier/mapper，page 只是请求 selector。 |
| Step 9 | 当前 Command/Job 在 B01 停止，future order要求 reserve 在 mutation、adapter/page selection 前 | 可能先 begin/save/调用 adapter 再发现 replay identity不足，或将 future path写成当前事实 | 当前一律 no UoW/no reserve/no external call；future sequence仅是 reopen contract。 |
| Step 10 | lifecycle、append-only、idempotency technical state、projection freshness 已分开 | 可能用 last-write-wins、history overwrite、old projection 或 entry state覆盖并发状态 | 版本、唯一性、append-only、projection source与 replay state分别控制；`DDD-S11-B03` 与 `PF-UNAVAILABLE-RECOVERY`继续冻结受影响路径。 |
| Step 11/12 | logical unique、UoW、rollback、stored replay、commit unknown 和 manual consistency 已有口径 | 可能把 duplicate 重算、commit unknown 盲重试，或把 `Unavailable` 当已知 in-flight | 定义 duplicate/unknown 处理矩阵；未闭合观测能力必须 fail closed/manual，不补偿写。 |
| L1-governance 样例 | 给出高粒度矩阵形式 | 容易照抄其 request digest、consumer receipt、outbox/publisher、job report或 `AlreadyInProgress` | 只采用表格粒度；本仓保持 zero outbound、zero receipt、zero scheduler/run/report。 |

### 3.2 改动前后对比

| 主题 | 进入 Step 13 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| 并发说明 | version/unique 规则散落在 Step 9~11 | 按 Command、Job、projection、horizon boundary 列出冲突资源、控制方式和测试切口 | 避免仅有“乐观锁”而没有对象级落点。 |
| 幂等 scope | 已有 key、channel/name、opaque input 和 replay端口，但未统一解释彼此关系 | 明确 reservation lookup 与 same-request comparison 是两层约束；raw key不是独立 global identity | 避免把 key、digest、version和business unique混用。 |
| duplicate/replay | 已定义 `Duplicate` 与 stored-result reads | 固定 duplicate 必须只读原 shell/body；当前 B01/B02 前不能假装命中 replay | 防止重新执行 mutation、adapter或page scan。 |
| in-flight | L1 样例可用的 in-flight 语义容易被误继承 | 明确本仓没有对应 reservation outcome/lookup；保留 blocker且禁止第二 writer path实施 | 防止私造 `AlreadyInProgress`、lease或stuck-record cleanup。 |
| partial failure | Step 12 已有 recovery分类 | 连接到 reserve/result/complete/commit、job item与projection的具体重入限制 | 防止未知提交被换 key或默认重试掩盖。 |
| current vs future | future UoW sequence可能被误读为可运行 | 全表均显式标出 `current=no write` 与 `future/reopen only` | B01/B02 当前仍是第一道保护。 |

### 3.3 设计取舍

| 议题 | 候选 | 本 Step 结论 | 取舍理由 |
|---|---|---|---|
| stable identity | 自行计算 payload/digest；或只消费 `StableOperationInputRef` | 只消费既有 opaque ref | 本仓未授权选择算法，且 payload/image/Artifact digest均不是本仓 idempotency identity。 |
| 同键重复 | 重跑当前 truth；或读 stored result | future only stored replay | current truth可能变化，重算会产生不同效果/响应。 |
| 同键不同 input | 覆盖旧 record；或返回 conflict | 返回既有 `IdempotencyConflict`，不修改旧 record | 保证 key reuse 不改写已完成/保留中的历史。 |
| in-flight | 新增 `AlreadyInProgress`/lease；或保持设计阻断 | 不新增；将 observation/recovery缺口列为 blocker | 现有 port/state没有这个能力，不能靠文档命名把它变成可调用事实。 |
| 并发更新 | last-write-wins；或同对象 optimistic version/unique | 仅 `Versioned<T>.version` + declared unique + append-only | 既有 Step 7/11 已限定版本来源与 store 行为。 |
| Job 重跑 | scheduler cursor/worker state；或 explicit page/key | 只使用显式 job page/target、key、version和stored JobDisposition | 当前无 scheduler、lease、cursor progress或job report authority。 |
| commit unknown | 新 key重跑/补偿；或同 key audit/manual | 同 key、同 stable input 仅做 reservation/result audit；无法证明时保持 Unknown/manual | 外部及本地副作用都可能已经发生，盲重试会扩大影响。 |
| inbound duplicate | 预建 event receipt/dedup；或 marker-only | 当前只重复 marker inspection | MI-UP-005未闭口，不能把条件边界伪写成event consumer。 |

## 4. 并发与幂等的共同保护模型

### 4.1 三层保护与当前可达性

```text
write request / bounded job
  -> DTO + metadata validation
  -> ImageOperationContext::from_write
  -> [current: DDD-S9-B01 stop; no UoW, reserve, read, write, adapter]

future/reopen only:
  -> protocol-to-concrete-canonical-input mapping
  -> canonicalize -> StableOperationInputRef
  -> begin ReadWrite UoW
  -> reserve (channel, operation_name, idempotency_key)
  -> exact Versioned<T> reads / declared uniqueness checks
  -> domain guard + only declared local mutation
  -> local trace / existing freshness where the individual flow permits
  -> stored result shell + matching replay body
  -> complete reservation -> commit
```

| 保护层 | 已有对象/规则 | 控制的风险 | 当前状态 |
|---|---|---|---|
| 请求重放 | `ImageOperationContext`、`ImageIdempotencyRecord`、`StableOperationInputRef`、`ImageIdempotencyRepositoryPort`、stored result/replay body | 同一 Command/Job 的重复提交、same-key different input、重放后重复副作用 | B01/B02 下不可达；仅为 future/reopen contract。 |
| local truth 并发 | `Versioned<T>.version` → `ExpectedLocalObjectVersion::Exact`、`Absent` create、declared business unique/index | 同一 local object的lost update、关系冲突、重复 create | 当前写路径不可达；Query仅读 committed truth。 |
| 历史/投影一致性 | append-only trace/history、existing projection marker own version、committed-truth rebuild source | 覆盖历史、用cache/view反写truth、旧 rebuild盖过新状态 | current Query无写；future projection受 B01/B02、B03/PF blocker限制。 |

### 4.2 不可替代关系

| 不能互相替代的概念 | 正式口径 |
|---|---|
| `IdempotencyKey` 与 `StableOperationInputRef` | 前者定位同一 operation namespace 内的 reservation；后者比较该 key 绑定的稳定输入。二者都不是 object version、business unique key或外部 digest。 |
| `Versioned<T>.version` 与 page cursor/timestamp/tag/digest | mutable existing object的 `Exact` 只来自该对象 versioned read；任何 cursor、clock、image/Artifact ref、stable input或request key都不得替代。 |
| `DuplicateReplay` 与重新执行 | replay只读取 stored shell/body；它不执行 domain transition、external seam、page selection、projection rebuild或任何新的 trace/gap/history写入。 |
| `Reserved` technical lifecycle 与“正在执行”对外结论 | `Reserved`只说明技术记录尚无 replayable result；现有 port没有安全的 in-flight outcome。不得把它自动翻译为`AlreadyInProgress`、lease、delayed job或可恢复 scheduler state。 |
| local `Available`/`Committed` 与外部成功 | local entry/history不能证明 registry publish、Artifact acceptance、Member Service confirmation、container launch、runtime health或readiness。 |

### 4.3 reservation namespace 审计

`image_idempotency_records` 在 Step 11 写明 normalized `(channel, operation_name, idempotency_key)` 为唯一 lookup；Step 6/7 又要求 channel/name/stable-input mismatch 不得被当作 duplicate。为避免 implementation 擅自选择“raw key 全局唯一”或“跨 channel/name 自动 replay”，本 Step 采用以下保守口径：

1. 已闭合的 duplicate 只限**同一** `channel + operation_name + key + StableOperationInputRef`。
2. 跨 channel/name 的同一 raw key **绝不**可以返回对方的 stored result，也不能跨 replay。
3. 是否应把跨 channel/name raw-key reuse 进一步拒绝为 `IdempotencyConflict`，现有 logical unique lookup与部分叙述尚未给出可调用的统一检测面；在重开前不得实现任一正向策略。
4. 这不是新 key、index、enum或port，而是 `DDD-S13-OPEN-02`：需在重开 Step 6/7/11 时统一 reservation lookup范围、conflict检测位置和fake/durable parity。

## 5. 结构化中间产物：并发场景表

以下“future/reopen control”仅在 `DDD-S9-B01/B02`、相关对象/result mapper、对应 owner contract均重新闭合后适用。它不表示这些 flows 当前已经能开始 UoW 或持久化。

### 5.1 Command 同资源冲突

| 场景 | 冲突资源 | current 状态 | future/reopen control | 失败错误 | 计划测试切口 |
|---|---|---|---|---|---|
| 两个 `DefineImageVariant` 作用于同一 existing family，或并发新建同名 family | family name unique、family↔variant relation、variant identity | 两者均在 context 后 B01 停止 | family name declared unique；existing family只能用其 `Versioned<ImageFamilyDefinition>.version`；new family/variant为 `Absent`，同一 UoW 校验 relation | `VersionConflict` / `Conflict` / `ContractViolation` | `TC-MI-S13-CONC-DEF-001` |
| `DefineImageVariant` 与 `CaptureAssemblyBaseline` 并发涉及同一 variant/mapping snapshot | variant、mapping snapshot、baseline immutable input | 均无 local read/write | exact versioned reads；baseline只接受已加载关联；snapshot/owner pending不得由并发读补成可用 | `VersionConflict` / `Blocked` / `Unavailable` | `TC-MI-S13-CONC-DEF-002` |
| 两个 `CaptureAssemblyBaseline` 对同一 variant 提交不同 static pin/seed/base 组合 | variant、baseline create、pin/seed/base refs | B01前不 resolver、不建 baseline | `Absent` create与 declared relation/unique检查；静态输入不修改既有 baseline，变化须新 context；不将 live state并入冲突解决 | `Conflict` / `VersionConflict` / `ContractViolation` | `TC-MI-S13-CONC-BASE-001` |
| 两个 `ProposeVariantRevision` 争用同一 variant/prior revision | variant、prior revision、new revision relation | 无 read/guard/save | each loaded existing object用自己的 exact version；new revision为 `Absent`；prior supersede不得覆盖history | `VersionConflict` / `InvalidTransition` / `Conflict` | `TC-MI-S13-CONC-REV-001` |
| `RequestBuildIntent` 与 revision supersede/invalid transition 并发 | variant revision、new intent/snapshot | 无 revision read或intent create | exact-load revision后再guard；intent/snapshot create为 `Absent`；stale revision不从history另选 | `VersionConflict` / `InvalidTransition` / `Blocked` | `TC-MI-S13-CONC-BUILD-001` |
| `RecordBuildOutcome` 与同 attempt 的另一结论/`ReconcileBuildAttempts` 并发 | BuildAttempt、BuildOutcomeConclusion、CandidateImage | command/job都止于 B01 | attempt用 exact version；同 attempt current conclusion无歧义；candidate relation declared unique；不同安全结论不得last-write-wins | `VersionConflict` / `Conflict` / `Unknown` | `TC-MI-S13-CONC-BUILD-002` |
| `EvaluateCandidateEligibility` 与 `ReevaluatePendingQualifications` 并发 | provenance/gate/eligibility context、candidate relation | 两者均无 gate read/write | each changed context exact-load/version；list item冲突不可跳过后宣称 `Applied`；Q-MI-004前不产生 Passed/Eligible | `VersionConflict` / `Blocked` / `Unavailable` / `Conflict` | `TC-MI-S13-CONC-QUAL-001` |
| `RecordArtifactHandoff` 与 handoff reconciliation 并发 | ArtifactHandoffRecord、lane-scoped ContractGap | B01前无 boundary assessment或gap save | exact local handoff/gap version；MI-UP-007前只保留 Pending/Gap，不接受/覆盖 Artifact owner truth | `VersionConflict` / `ContractGap` / `ContractViolation` | `TC-MI-S13-CONC-HANDOFF-001` |
| `PublishInstantiableEntry` 与 `TransitionAvailability` 并发变更同 variant/current entry | InstantiableEntry、new AvailabilityTransition、current-facts relation | 无 current entry read/append | existing entry/current facts用 exact version；new entry/history以 `Absent`；local publish不调用 Member Service | `VersionConflict` / `Conflict` / `InvalidTransition` | `TC-MI-S13-CONC-SUPPLY-001` |
| `TransitionAvailability` 与 `RollbackOrRetireEntry` 并发作用相同 entry/history | entry、append-only transition、current-facts relation | B01前零 mutation | entry exact version + new history `Absent`；不能更新/删改既有 transition；`DDD-S11-B03` 使需要已有 transition terminal update的路径保持禁止 | `VersionConflict` / `InvalidTransition` / `ContractViolation` | `TC-MI-S13-CONC-SUPPLY-002` |

### 5.2 Job、projection 与跨 flow 并发

| 场景 | 冲突资源 | current 状态 | future/reopen control | 失败错误 | 计划测试切口 |
|---|---|---|---|---|---|
| 两个 `RunNightlyBuildSweep` 提交同一 page/trigger，或其与 `RequestBuildIntent` 重叠 | explicit buildable revision page、revision、BuildIntent | boundary=`Declared` 仍止于 B01；无 page select | same key only stored JobDisposition replay；different key但同 revision时用 revision/intent exact version与unique；page不是 scheduler cursor | `VersionConflict` / `Conflict` / `IdempotencyConflict` | `TC-MI-S13-CONC-JOB-001` |
| 两个 `ReconcileBuildAttempts` 检查同一 attempt | attempt/outcome/candidate、adapter safe observation | B01前不list、不inspect adapter | explicit page仅决定选择范围；每个attempt exact version；`Unknown`不触发second attempt或blind adapter retry | `VersionConflict` / `Unknown` / `Unavailable` | `TC-MI-S13-CONC-JOB-002` |
| `ReevaluatePendingQualifications` 与 command 修改同一 evaluation/decision | GateEvaluation、EligibilityDecision、ContractGap | 当前无list/boundary/evaluator | exact version per selected subject；任何owner pending保留 affected lane，不能用并发job默认pass | `VersionConflict` / `Blocked` / `ContractGap` | `TC-MI-S13-CONC-JOB-003` |
| 两个 `RefreshExternalReferenceSnapshots` 重评同一 exact snapshot | ExternalReferenceSnapshot、source/use relation、gap | B01前不读snapshot/不调 resolver | selected snapshot必须 exact；old snapshot不原地变 Valid；new context/old supersede各用自己的 version/Absent规则 | `VersionConflict` / `Conflict` / `Unavailable` / `Unknown` | `TC-MI-S13-CONC-REF-001` |
| truth mutation标脏既有 marker与 `RebuildImageDerivedViews` 并发 | existing ImageDerivedReadModel、ProjectionFreshness、committed truth snapshot | 当前无truth mutation或rebuild | only existing view/marker；各自用 own version；rebuild只从 committed truth；不能由旧 view/cache覆盖source truth或把Fresh当readiness | `VersionConflict` / `ContractViolation` / `Unavailable` | `TC-MI-S13-CONC-PROJ-001` |
| 两个 `RebuildImageDerivedViews` 处理同一 key | existing view/freshness and stored JobDisposition | B01前无projection lookup/write | same key future replay不 rebuild；different key uses view/marker exact version; no implicit view creation | `VersionConflict` / `IdempotencyConflict` / `Unavailable` | `TC-MI-S13-CONC-PROJ-002` |
| `ReconcileArtifactAndConsumerHandoffs` 与 Record/Publish flow 处理同一 local gap/entry | ArtifactHandoffRecord、ConsumerHandoffGap、entry relation | B01前无list/seam/write | target必须单一；gap exact version；MI-UP-001/007前只保留 Pending/Gap/Open/Stale，不能 accept/resolve/confirm | `VersionConflict` / `ContractGap` / `ContractViolation` | `TC-MI-S13-CONC-HANDOFF-002` |
| Query 与任何 future write 同时发生 | committed local truth/view/marker | Query当前可达，但写侧不可达 | Query只读取 committed data；staged UoW结果不可见；Query不通过reserve/repair参与竞争 | Query surface `Empty/Gap/Stale/Rebuilding/Unavailable`，非写冲突处理 | `TC-MI-S13-CONC-QUERY-001` |
| 两条条件入站被重复触发或与 Job 同时触发 | InboundContractMarker only | marker-only，无任何 accepted input/write | 每次独立 inspect marker；不得建立 dedup/receipt/BuildIntent/snapshot/trace，无并发 mutation资源 | existing marker safe disposition only | `TC-MI-S13-CONC-INBOUND-001` |

### 5.3 全局控制纪律

- 所有 mutable existing local object 的冲突控制必须来自**同一对象** `Versioned<T>.version`。relation 内的多个对象各带各自 version，但在同一 UoW stage/commit；不得把一个对象的version套到另一个对象。
- `Absent` 只用于未存在的新 local object；create撞 local identity/business unique时 fail closed，不得 upsert、merge、任选一方或按时间覆盖。
- `ImageTraceRecord` 与 `AvailabilityTransition` 不用 update来解决并发；它们仅允许 `Absent` append。`AvailabilityTransition` 若需要更新既有history，受 `DDD-S11-B03` 阻断。
- external resolver/builder/registry/qualification/Artifact/Member Service seam 从不提供本仓 lock、commit proof 或冲突版本；其 unavailable/unknown不能转换为 local positive state。任何将来 external call都必须遵守 individual flow 的 reserve-before-side-effect 顺序，并受 in-flight blocker约束。
- 不选择数据库 isolation、row lock、distributed lock、lease、scheduler queue、retry interval或stuck reservation cleanup；这些都不在已闭合 material 中。

## 6. 结构化中间产物：幂等 key 与 opaque stable-input 表

### 6.1 统一规则

| 项目 | 正式口径 |
|---|---|
| 写类 reservation lookup | `ImageOperationContext` 的 `channel + operation_name + OperationMetadata.idempotency_key`；Step 11 的 logical store 以该 normalized triple 为唯一 lookup。 |
| same-request comparison | 只有同一 lookup 且 `StableOperationInputRef` 相同才是 future `Duplicate` 候选。stable input本身不含 idempotency key。 |
| canonical prefix | 已有 Step 8 规则为 `channel -> operation_name -> protocol-specific fields`；所有 optional 必须保留显式 absence 语义，ordered set仅按协议已有声明排序/去重。 |
| permitted input | typed local ref、typed external body-free ref、safe reason/action、明确 optional和explicit page/target。 |
| forbidden input | raw DTO/event/provider body、payload bytes、image/Artifact digest、tag、timestamp、correlation、idempotency key、route/topic、scheduler/run/tick、retry count、result state、cache/private map、secret、live state。 |
| result source | Command 只能 replay matching `CommandResult` body；Job 只能 replay matching `JobDisposition` body。当前没有可保存的合法 result identity/body mapper，故 B02 前均不可达。 |
| 幂等窗口 | 未定义 TTL、保留期或时间窗。唯一已定义的判断是现存 reservation record及其 lifecycle；不得按clock、run/date、page cursor或external revision自行过期/复用。 |
| Query/条件入站 | Query无 key/no replay；inbound当前无accepted input、envelope、dedup key、receipt或reservation。 |

### 6.2 Command identity 表

所有下列行的 raw key 都仅来自 `ImageCommandRequest.metadata.idempotency_key`。表中的字段顺序重述 Step 8 protocol identity；它**不是**新的 `CanonicalImageOperationInput` struct、hash/digest规则或可调用 mapper。当前每一行均在 `ImageOperationContext::from_write(...)` 后由 `DDD-S9-B01` 停止。

| Command | future channel/name/lookup | 已声明的 stable input 字段（在 prefix 后） | future replay kind/重复处理 | 当前状态 |
|---|---|---|---|---|
| `DefineImageVariant` | `Command / DefineImageVariant / metadata key` | `family`（variant + exact Existing/New value）、`persona_label`、`mapping_snapshot_ref` | `CommandResult`；same input只读原 body/effects；different input=`IdempotencyConflict` | B01/B02；不创建 family/variant或result。 |
| `CaptureAssemblyBaseline` | `Command / CaptureAssemblyBaseline / metadata key` | `variant_ref`、`inputs.mapping_snapshot_ref`、protocol已声明顺序的 `component_pins`、`seed_bindings`、`base_image_ref` | `CommandResult`；不得再次 resolver/static assemble | B01/B02；不读variant/snapshot或resolver。 |
| `ProposeVariantRevision` | `Command / ProposeVariantRevision / metadata key` | `variant_ref`、`baseline_ref`、`derivation_reason.category`、`derivation_reason.related_ref`（explicit None）、`prior_revision_ref`（explicit None） | `CommandResult`；不得再次propose/supersede | B01/B02；不读/更新revision。 |
| `RequestBuildIntent` | `Command / RequestBuildIntent / metadata key` | `revision_ref`、`trigger.kind`、`trigger.trigger_ref` | `CommandResult`；不得再次 attach trigger/create intent | B01/B02；verified inbound trigger仍受 MI-UP-005。 |
| `RecordBuildOutcome` | `Command / RecordBuildOutcome / metadata key` | `attempt_ref`、`execution_ref`、`result_kind`、`immutable_image_ref`、`output_identity_ref`、`reason.category/related_ref`；全部 optional显式 | `CommandResult`；不得再次 inspect builder或form candidate | B01/B02；Q-MI-003仍pending。 |
| `EvaluateCandidateEligibility` | `Command / EvaluateCandidateEligibility / metadata key` | candidate、snapshot、execution、output identity、protocol排序后的 provenance sources、authority/applicable gate refs、排序后的 gate conclusion refs、existing context refs | `CommandResult`；不得再次问 boundary或改写gate outcome | B01/B02；Q-MI-004仍pending。 |
| `RecordArtifactHandoff` | `Command / RecordArtifactHandoff / metadata key` | `candidate_ref`、`eligibility_ref`、`artifact_ref`（explicit None）、`formal_resolution_ref`（explicit None） | `CommandResult`；不得再次 call Artifact seam/open second gap | B01/B02；MI-UP-007不允许 Accepted。 |
| `PublishInstantiableEntry` | `Command / PublishInstantiableEntry / metadata key` | variant、candidate、eligibility、provenance、`image_ref`、`prior_entry_ref`（explicit None） | `CommandResult`；不得产生第二entry/transition或consumer call | B01/B02；local publish不等registry/consumer action。 |
| `TransitionAvailability` | `Command / TransitionAvailability / metadata key` | variant、transition kind、candidate ref、prior entry ref、resulting entry ref、reason category/related ref | `CommandResult`；不得 append第二条同一结果history | B01/B02；B03继续阻断既有history更新模型。 |
| `RollbackOrRetireEntry` | `Command / RollbackOrRetireEntry / metadata key` | `entry_ref`、transition kind、`resulting_entry_ref`（explicit None）、reason category/related ref | `CommandResult`；不得再次retire/rollback或改写旧history | B01/B02；不调用runtime/registry/member-service。 |

### 6.3 Operations Job identity 表

所有下列 raw key 都仅来自 `ImageOperationsJobRequest.metadata.idempotency_key`，System actor、clock、scheduler/run/tick、retry count、selected count、result state和report/evidence字段均不进入 stable input。Job page是一次**显式请求的读取位置**，不是 scheduler cursor、checkpoint或输出。

| Operations Job | future channel/name/lookup | 已声明 stable input 字段（在 prefix 后） | future replay kind/重复处理 | 当前状态 |
|---|---|---|---|---|
| `RunNightlyBuildSweep` | `OperationsJob / RunNightlyBuildSweep / metadata key` | `scope=BuildableRevisions`、`page.after`（explicit None/token）、`page.limit`、`trigger_ref` | `JobDisposition`；不得再次 list page 或请求intent | boundary non-Declared可返回非持久化disposition；Declared止于B01/B02。 |
| `ReconcileBuildAttempts` | `OperationsJob / ReconcileBuildAttempts / metadata key` | `scope=ReconcilableBuildAttempts`、`page.after`（explicit None/token）、`page.limit` | `JobDisposition`；不得重新inspect adapter或尝试build | 同上；Q-MI-003继续限制future seam。 |
| `ReevaluatePendingQualifications` | `OperationsJob / ReevaluatePendingQualifications / metadata key` | `scope=ReevaluableQualifications`、`page.after`（explicit None/token）、`page.limit` | `JobDisposition`；不得再次reevaluate或默认pass | 同上；Q-MI-004继续限制future evaluator。 |
| `RefreshExternalReferenceSnapshots` | `OperationsJob / RefreshExternalReferenceSnapshots / metadata key` | exact `external_snapshot_ref` | `JobDisposition`；不得再次resolver/capture snapshot | 同上；不接受source event body。 |
| `RebuildImageDerivedViews` | `OperationsJob / RebuildImageDerivedViews / metadata key` | `projection_kind`、`variant_ref`（catalog/gap scope explicit None） | `JobDisposition`；不得第二次rebuild或从view/cache补truth | 同上；PF-UNAVAILABLE-RECOVERY仍开放。 |
| `ReconcileArtifactAndConsumerHandoffs` | `OperationsJob / ReconcileArtifactAndConsumerHandoffs / metadata key` | `target`、`page.after`（explicit None/token）、`page.limit` | `JobDisposition`；不得再次call seam/accept/resolve/confirm | 同上；MI-UP-001/007保持gap-only。 |

### 6.4 非幂等 reservation surface

| surface | key/replay 结论 | 重复调用口径 | 禁止事项 |
|---|---|---|---|
| 10 个 Query | 无 idempotency key、无 stored result、无 write UoW | 每次只读当前 committed exact/page/existing-projection surface；结果可因已提交truth变化而不同，不是 replay | reserve、trace/gap/freshness write、refresh、rebuild、repair。 |
| `ConsumeVerifiedBuildRequest` | 当前无 envelope、payload、event identity、dedup key或receipt | 每次只inspect `InboundContractMarker` 并返回 `accepted_input=false` 的安全 disposition | 名称已知不等接受event；不设dedup、reservation或stored InboundDisposition。 |
| `ConsumeVerifiedSourceRefresh` | 同上 | 同上 | 同上；不得以重复事件为由refresh snapshot或写trace。 |
| outbound | inventory=`NoneAuthorized` | 不存在 publisher/delivery retry/replay surface | 创建 outbox、event key、receipt、delivery state。 |

## 7. 结构化中间产物：重复、冲突、部分失败与重入矩阵

### 7.1 reservation/replay 矩阵

| 检测时点 / 既有结果 | 当前可达性 | future/reopen 行为 | 允许对外 surface | 禁止事项 |
|---|---|---|---|---|
| DTO/metadata/typed-ref shape 不合法 | 当前可达 | 在 context 前/构造时拒绝；不进入canonical/UoW | `Rejected` + `Missing`/`ContractViolation`，或Job safe error | reserve、stored negative result、trace、gap、external call。 |
| B01：无 concrete canonical input carrier/mapper | 当前可达 | context后fail closed；不生成 `StableOperationInputRef` | 未持久化 `Unavailable`/design blocker映射 | begin、reserve、read/write、adapter、result/complete。 |
| B02：无合法 result identity/shell-body mapper | B01解除前尚不可达，但已是阻断 | 必须在任何 local mutation前停止；不能先写后补result | 未持久化 fail-closed surface | direct struct literal、随机 ID、key/digest/external ref代替result ref；UoW mutation。 |
| `reserve -> Reserved` | 当前不可达 | 仅在同一 future UoW继续；随后必须 exact-read、guard、stage local effects、save shell/body、complete、commit | 正常 local result仅在commit确认后 | begin前reserve、reserve后 external/page selection绕过、complete后继续副作用。 |
| `reserve -> Duplicate { result_ref }` | 当前不可达 | rollback current UoW，get stored shell，再get matching replay body；两者一致才返回 | `DuplicateReplay`，`replayed=true`，body/effects来自存储 | domain mutation、adapter、job selection/rebuild、new trace/gap/history。 |
| `reserve -> Conflict` | 当前不可达 | 不读/写 business truth；既有 record不覆盖 | `Conflict + IdempotencyConflict` | 返回不匹配旧body、mark completed old record为新结果、换input继续。 |
| matching completed record但 shell/body缺失、operation/kind不匹配 | 当前不可达 | `StoredResultMissing`/`ContractViolation`，进入manual consistency | `ReplayUnavailable` / safe `Unavailable`/`Unknown` | 由current truth重算旧response，重跑command/job/adapter/page。 |
| existing `Reserved`/可能 in-flight same key | 当前没有reservation可达 | 现有 `ImageIdempotencyReservation` 没有此 outcome，且没有按 composite key读取Reservation的已闭合port；不能安全判断first writer、stuck record或commit state | 未定义具体 in-flight public kind；不能伪称 `AlreadyInProgress` | 执行第二个writer、将其视为Duplicate、强行complete/conflict/cleanup、引入lease/scheduler。 |
| key reuse跨 channel/name | 当前没有reservation可达 | 绝不跨 replay；能否检测为Conflict受 `DDD-S13-OPEN-02` 限制 | 不返回对方 stored body | 假定raw key全局唯一或静默允许跨 operation replay。 |

### 7.2 `Reserved` / in-flight reopen 纪律

`ImageIdempotencyLifecycle` 现有状态只有 `Reserved`、`Completed`、`Conflict`；`ImageIdempotencyReservation` 现有返回只有 `Reserved`、`Duplicate`、`Conflict`。这足以描述首次、完成重放和已检测冲突，**不足以闭合“已有同 key record仍为 Reserved 时，第二个调用如何被发现、返回和恢复”**。

| 审计项 | 已有事实 | 本 Step 的保守结论 | reopen 前提 |
|---|---|---|---|
| 读取 in-flight record | 有 `get_record_with_version(record_ref)`，但新调用没有由 composite key 得到 existing `record_ref` 的已闭合路径 | 不自行scan/private-map/猜record ref；不得实现第二 writer | 明确 lookup/return contract、transaction visibility与fake parity。 |
| public disposition | Step 8/12有 `Unavailable`/`Unknown`，没有 `AlreadyInProgress` enum | 不新增 error/outcome；只有在未来 port能以既有安全 error证明临时不可用时才能map，当前实现必须保持write path blocked | 重新确认是否需 existing enum mapping或新正式对象；不能在Step 13私造。 |
| reservation cleanup/retry | 无 lease、expiry、owner、retry count、stuck-record repair | 不自动expire、delete、override或换key；commit/rollback未知走manual consistency | 独立持久化/recovery设计和权限/审计边界。 |
| external side effect | external seam不参与local atomic commit，且可能unknown | 不因“看似in-flight”再次调用builder/consumer/Artifact/adapter | owner-safe observation及完整re-entry design。 |

该缺口登记为 `DDD-S13-OPEN-01`。它不是新的 state/error/port，也不允许 implementation 在本 Step 的文字基础上补出 `AlreadyInProgress`、lease、stuck reservation worker 或run/report。

### 7.3 部分失败与未知提交矩阵

| 场景 | 保护/恢复方式 | 允许动作 | 禁止动作 |
|---|---|---|---|
| canonicalizer/begin失败 | 未产生可提交 local effect；原输入可在依赖恢复后重新经过完整验证 | 在明确 temporary `Unavailable` 后，以原 operation/key/input重新开始；具体退避未定义 | reserve前强行read/write，或用new key绕过。 |
| exact read/guard/version/unique失败 | 当前 UoW整体 rollback；保留已提交旧truth | `VersionConflict` 时reload**同一对象**，重跑guard后才可重新提交；deterministic冲突须新合法context | last-write-wins、upsert、用cursor/tag/digest代version。 |
| result save失败或complete失败（commit前已知） | 同一UoW rollback，不能留下可见half result/reservation | 仅在rollback可确定后按同key重试；否则转TransactionBoundary路径 | 先commit truth后“稍后补result”，或从truth构造replay。 |
| commit明确失败且确认未持久化 | 以 rollback/transaction boundary口径保留旧truth | 仅在底层明确无commit时，原key/operation/input可重新跑完整flow | new key重跑、补偿写、宣称accepted。 |
| commit status unknown / rollback uncertain | `TransactionBoundary` + `Unknown`/manual consistency；本仓没有自动repair contract | 用原 operation/key/stable input做未来 reservation/result audit；无法证明时隔离affected lane并人工核查 | 盲commit、盲rollback、换key重跑、重发external side effect、写compensating trace/gap/history。 |
| duplicate发现shell/body断裂 | `StoredResultMissing` / `ReplayUnavailable` | 保留既有reservation/result refs，进入正式repair/reconciliation设计 | 从current truth/adapter/cache补造旧result。 |
| job page 内某个item version/conflict/unknown | job result是bounded local disposition，不是report；不得把failed item藏进count | 仅future已闭合路径中对明确item停下/rollback按flow规则；新key重跑时重新读取explicit scope | 扩大page、跳过后宣称Applied、创建scheduler cursor或report。 |
| projection rebuild失败 | source truth不回滚；existing marker仅能按已定义transition保存safe degraded state | 返回safe unavailable/unknown或future stored disposition；保持committed truth为唯一source | view/cache当truth、query-time rebuild、`Unavailable -> Fresh`假恢复。 |
| B03 availability history terminalization | 现有port只能append，不能安全更新既有transition | 不执行delete/reinsert/overwrite；等待重开state/port设计 | 用entry当前state伪造history终态。 |

### 7.4 重入保护表

| 场景 | 重入来源 | 当前保护 | future/reopen 保护 | 恢复方式 |
|---|---|---|---|---|
| Command 调用方因超时重复同一请求 | client retry / caller retry | 两次均停在B01，无任何replay/写 | same lookup + same opaque stable input → stored CommandResult replay | 只有Duplicate时读原shell/body；当前不声称已有结果。 |
| Command 用同一key但改变body/ref/reason/page语义 | client defect / retry drift | B01前无reservation | same lookup + different stable input → `IdempotencyConflict` | 使用原请求或新的合法业务context；不覆盖旧record。 |
| Command 与Job使用同一raw key | independent caller | B01前无reservation | channel/name从identity中隔离；不得cross replay；global raw-key conflict语义待 `DDD-S13-OPEN-02` | 重开前不实现；不可返回对方body。 |
| Job 用同一key重复提交 | bounded caller retry | non-Declared只返回内存marker disposition；Declared止B01 | same scope/input future only replay stored JobDisposition | 不重新list page、adapter/rebuild/seam。 |
| Job 用新key重跑重叠page | operator/bounded caller | B01前无page select | page是explicit scope；each selected local object uses own exact version/unique | conflict后reload exact item；不设scheduler cursor。 |
| first writer仍可能处于Reserved | parallel retry / process interruption | 无已有write path | 无闭合 in-flight outcome；`DDD-S13-OPEN-01`阻止实施 | fail closed/manual，不执行second writer或cleanup。 |
| UoW commit结果unknown后重入 | connection/store uncertainty | 当前不可发生，因为没有UoW | 原 key/input audit；Duplicate才replay；无法证明不继续 | `Unknown`/manual consistency，不换key或补偿。 |
| `RecordBuildOutcome` observation unknown后重入 | adapter uncertainty / reconcile retry | command/job均B01 stop | original safe observation不重发；等待新safe observation或正式reconciliation | 保留Unknown，不建second attempt/candidate。 |
| projection rebuild中断后重入 | bounded caller retry | B01 stop | new invocation仅从committed truth读；same key duplicate不rebuild；version保护existingmarker/view | 保持stale/unavailable；PF recovery未闭合时不伪Fresh。 |
| conditional inbound重复投递 | future bus redelivery的假设 | 当前只是marker inspection | 尚无event identity/dedup/receipt，不能宣称inbound replay | 等MI-UP-005和多Step重开；当前每次accepted_input=false。 |
| Query重复读取 | UI/API repeated read | full read-only | 仍然无reservation/trace/repair；只返回当时committed surface | 调用方按Empty/Gap/Stale/Rebuilding/Unavailable处理，不期待stored replay。 |

### 7.5 future/reopen 重入顺序

下列顺序复用 Step 7/11/12 已有 port与错误口径，且只在 B01/B02、in-flight open item和相关owner input闭合后才能实施；它不创建新的 helper/function：

```text
validate the original protocol input and metadata
-> construct the same ImageOperationContext
-> map the same concrete canonical input
-> canonicalize to the same StableOperationInputRef
-> begin a ReadWrite UoW
-> reserve
   -> Duplicate: rollback; exact-read stored shell/body; return replay
   -> Conflict: rollback/no mutation; return IdempotencyConflict
   -> Reserved: continue only for this invocation
-> exact Versioned<T> reads and declared guard
-> declared local mutation only
-> required local trace / existing freshness only
-> save matching stored result shell/body
-> complete reservation
-> commit
```

如果 commit/rollback 的 durable status未知，以上顺序在 `reserve` 后不得被机械重跑：只能使用相同 identity 重新审计 reservation/result；缺少可证明的 Duplicate 或“未提交”结论时，保持 `Unknown` / manual consistency。不得使用new key、重建 result 或重发外部side effect。

## 8. Query、条件入站、外部边界与 static/live 的专门限制

| 面 | 并发/重入结论 | 必须保持的限制 |
|---|---|---|
| Query | 可并发、可重复，但不是幂等 write；每次看committed current surface | 无 UoW/reserve/result/trace/gap/freshness write；无query-time refresh/rebuild/repair；`RequireFresh`不降级。 |
| 条件入站 | 当前不是event consumer，只有marker disposition | 无 envelope/payload/event-id/dedup/receipt/quarantine/delay；重复调用不变成duplicate event replay。 |
| builder/registry | 外部重复/unknown不由本仓解释为成功 | ACK/2xx/tag/cache/裸digest均不能提供lock、version、commit evidence或candidate shortcut。 |
| Artifact/Member Service | local handoff/gap可并发，但对端positive confirmation仍pending | 不接受Artifact、lineage、consumer manifest/confirmation/instance/container状态；gap只冻结affected lane。 |
| projection | view/freshness是derived maintenance，不是business truth | rebuild只从committed local truth；view/cache/fake不反写truth；no implicit creation。 |
| static assembly inputs | component/seed/policy/memory/workspace只可作为static ref/seed binding | 不把live memory/checkpoint/workspace content/mount、container/runtime/tool execution加入canonical identity、store或conflict解法。 |
| outbound | 没有并发publisher或delivery race | `NoneAuthorized`；不得为“至少一次”预建outbox、delivery record、event dedup或receipt。 |

## 9. Step 6~12 跨文档闭环审计

| 前序 Step | 本 Step 使用的闭口 | 审计结论 | 不得擅自补齐 |
|---|---|---|---|
| Step 6 对象 | context、channel/name、reservation lifecycle、opaque stable input、result shell、local lifecycle subject | `pass_with_open_items`；对象能表达 completed/conflict，但不提供in-flight public result或result-ref factory闭口 | `AlreadyInProgress`、new key/digest、result factory、lease。 |
| Step 7 port | version/UoW/canonicalizer/reserve/replay interfaces | `pass_with_open_items`；Duplicate/Conflict path有typed reads，Reserved existing observation缺口明确 | 复合key lookup、new reservation outcome、fake private-map shortcut。 |
| Step 8 protocol | 10 Command/6 Job key来源、canonical field identity、result kind、Query/Inbound边界 | `pass_with_blockers`；identity表可以回指协议，但没有concrete canonical carrier/result mapper | raw payload/hash、inbound receipt、job run/report。 |
| Step 9 flow | current B01/B02 stop，future reserve-before-mutation/page/adapter，Query no-write | `pass`；本Step没有把future flow变成current call | begin/reserve/write/adapter calls，或B01变persistent gap。 |
| Step 10 state | object lifecycle、technical replay、append-only、projection freshness | `pass_with_B03/PF`；并发行为不越过非法transition | existing transition overwrite、Unavailable恢复边、global ready state。 |
| Step 11 persistence | logical unique、same-object version、UoW atomicity、result-before-complete、committed visibility | `pass_with_open_items`；保护模型完全回指已有store规则 | DB/lock/isolation、TTL、outbox/publisher、upsert。 |
| Step 12 error/recovery | conflict/replay missing/transaction unknown/manual/retry分类 | `pass_with_open_items`；in-flight不被错误映射成新variant | blind retry、automatic cleanup、compensating mutation。 |

### 9.1 blocker 与 pending ledger

| ID | 缺口 / blocker | 本 Step 影响 | 当前纪律 | reopen 前提 |
|---|---|---|---|---|
| `DDD-S9-B01` | 缺 concrete `CanonicalImageOperationInput` 与 protocol-to-input mapper | 所有 Command/Job canonicalize、reserve、write/replay | context/marker后停止；零UoW/零IO | 重开 Step 7/8，定义合法 carrier/mapper及其field source。 |
| `DDD-S9-B02` | 缺合法 `ImageOperationResultRef` 构造、shell/body mapper | result save、complete、Duplicate replay | 不创建result/ref、不写truth后补result | 重开 Step 6/7/8，明确唯一factory和shell/body一致性。 |
| `DDD-S13-OPEN-01` | existing `Reserved`/in-flight 的lookup、outcome与recovery未闭合 | parallel retry、crash/re-entry、commit-unknown audit | 不新增enum/lease/cleanup；不执行second writer | 重开 reservation port/store/recovery设计并保证durable/fake parity。 |
| `DDD-S13-OPEN-02` | `(channel,name,key)` unique lookup与跨 channel/name raw-key conflict措辞未形成统一可调用规则 | namespace isolation与same-key policy | 不cross replay，不私造global raw-key index/semantic | 重开 Step 6/7/11统一identity、lookup和conflict检测。 |
| `DDD-S11-B03` | AvailabilityTransition append与既有 transition terminalization不匹配 | supply concurrent history paths | 不update/delete/reinsert/overwritehistory | 重开 Step 7/10确定versioned update或纯append-final模型。 |
| `PF-UNAVAILABLE-RECOVERY` | ProjectionFreshness `Unavailable`无正式恢复函数 | rebuild retry/race recovery | 不造 `Unavailable -> Rebuilding/Fresh` | 定义function、truth source、version/UoW与test。 |
| `MI-UP-001/007` | Member Service/Artifact positive contract未闭合 | handoff concurrency只能local gap/Pending/Open/Stale | 不resolve/accept/confirm | owner正式manifest/variant/ref/qualification/acceptance contract。 |
| `MI-UP-005` | inbound event identity/schema/authority/dedup/receipt未闭合 | inbound repeat不能形成event idempotency | marker-only、accepted_input=false | owner formal event contract后多Step重开。 |
| `MI-UP-002/003/006/008`、`Q-MI-003/004`、`MI-UP-009` | component/mapping/seed/base、builder/gate、outbound owner未闭合 | stable field可列出但positive/seam/outbound path不能落地 | static/ref-only、gap-visible、zero outbound | 各owner正式关闭后重审受影响flows。 |

## 10. 并发、幂等与重入测试切口（仅规划）

以下是 Step 16 的输入，不是已实现或已执行测试。每一项均不得被记录为 test result、report、evidence、verdict、signoff 或 readiness。

| 计划切口 | 覆盖点 | 预期断言 | 前置 / 当前状态 |
|---|---|---|---|
| `TC-MI-S13-GATE-001` | 全部10 Command与6 Job在B01/B02下 | spy观察不到 begin/reserve/repository save/append/external seam/result/complete/commit | 当前可设计的静态/contract切口；未执行。 |
| `TC-MI-S13-IDEM-001` | same channel/name/key/stable input的已完成duplicate | 只读同一stored shell/body，`DuplicateReplay`，零domain/adapter/page/rebuild/new trace | 需B01/B02、result mapper和future fake。 |
| `TC-MI-S13-IDEM-002` | same lookup、different stable input | `IdempotencyConflict`，旧record/body不变，零mutation | 需future canonical carrier/reservation fake。 |
| `TC-MI-S13-IDEM-003` | raw key跨channel/name | 不cross replay；最终conflict/namespace行为只能按重开后统一契约断言 | 被 `DDD-S13-OPEN-02` 阻断。 |
| `TC-MI-S13-IDEM-004` | stable input forbidden fields | key/correlation/clock/route/tag/raw body/run/retry/live state不会改变same-request identity | 需canonicalizer contract，不能选择hash算法。 |
| `TC-MI-S13-INFLIGHT-001` | 同key并发first/second writer | second writer不会domain mutate或external call；具体安全surface待closed contract | 被 `DDD-S13-OPEN-01` 阻断。 |
| `TC-MI-S13-CONC-DEF-001/002` | family/variant/baseline/revision并发 | stale same-object version/unique conflict拒绝；immutable baseline不被覆盖 | future repository fake/durable parity。 |
| `TC-MI-S13-CONC-BUILD-001/002` | revision/intent/attempt/outcome/candidate并发 | stale attempt/revision拒绝；unknown不重试；candidate relation不多义 | B01/B02及Q-MI-003后。 |
| `TC-MI-S13-CONC-QUAL-001` | evaluate/reevaluate并发 | exact evaluation/decision version拒绝；pending不默认Passed/Eligible | Q-MI-004后。 |
| `TC-MI-S13-CONC-SUPPLY-001/002` | entry/transition/rollback并发 | entry version冲突拒绝；history只append；B03路径保持blocked | B03未解除前只能验证禁止调用。 |
| `TC-MI-S13-CONC-PROJ-001/002` | truth marker与rebuild/dual rebuild | source truth不回滚，older/stale writer不能覆盖existingmarker/view；duplicate不rebuild | PF recovery路径仍blocked。 |
| `TC-MI-S13-REPLAY-001` | stored shell/body缺失或kind/name不匹配 | `ReplayUnavailable`，不从current truth/adapter重算 | 需result store fake；未执行。 |
| `TC-MI-S13-TX-UNKNOWN-001` | commit/rollback status unknown后同key重入 | 先reservation/result audit；无法证明时Unknown/manual；不换key/补偿 | 需UoW fake和OPEN-01闭口。 |
| `TC-MI-S13-JOB-001` | duplicate same-job key与new-key overlapping page | same key不list；newkey仍以item exact version处理，不造scheduler cursor/report | 需future job/body mapper。 |
| `TC-MI-S13-QUERY-001` | repeated Query | zero reservation/UoW/trace/gap/freshness/rebuild write | 可作为read-only contract切口；未执行。 |
| `TC-MI-S13-INBOUND-001` | repeated conditional inbound boundary | 每次只有 `accepted_input=false` marker disposition；无dedup/receipt/snapshot/build write | 可作为boundary contract切口；未执行。 |

## 11. 正式 `03-详细设计.md` 回填草稿（禁止当前装配）

> 对应正式章节：第 12 章“并发、幂等与重入保护”。  
> 写入前门禁：项目级台账须允许正式 03 装配，03 flow须完成至 Step 19，且全部后续 Step 回填均获批准。当前条件均不满足。

```md
## 12. 并发、幂等与重入保护

本仓对 future/reopen Command 和 bounded Job 使用三类互不替代的保护：

1. reservation lookup 使用 `(channel, operation_name, idempotency_key)`；仅当同一 lookup 的 `StableOperationInputRef` 相同，才可读取既有 stored replay。
2. 任一既有 mutable local object 的保存必须使用该对象 `Versioned<T>.version` 生成的 `ExpectedLocalObjectVersion::Exact`；新对象仅可用 `Absent`，business unique冲突不得upsert或last-write-wins。
3. trace与availability history保持append-only；projection只从committed local truth rebuild，Query只读。

`StableOperationInputRef` 是 body-free opaque identity，不是image/Artifact digest、payload hash、tag、timestamp或外部版本。Command/Job 的 key来自 `ImageWriteMetadata.idempotency_key`；Query无reservation；当前条件入站没有event identity、dedup或receipt，固定 `accepted_input=false`；outbound inventory为 `NoneAuthorized`。

future duplicate 只允许按 `reserve -> Duplicate { result_ref } -> rollback -> get_stored_result -> get_replay_body` 返回原stored body/effects。same key而stable input不同返回 `IdempotencyConflict`；stored shell/body缺失或不匹配返回 `ReplayUnavailable`，绝不从current truth重算。commit/rollback结果未知时，必须以同一operation/key/stable input审计reservation/result；无法证明状态时保持 `Unknown`/manual consistency，不换key、不补偿写、不重发外部副作用。

当前所有Command/Job均受 `DDD-S9-B01/B02` 阻断，不能begin UoW、reserve、写truth或形成replay。现有reservation surface尚未闭合已有 `Reserved`/in-flight record的观测、外部返回与清理，且跨channel/name raw-key namespace需要重开统一；在这些缺口关闭前，不得新增 `AlreadyInProgress`、lease、scheduler、outbox或自动recovery。
```

## 12. Step 14 handoff 与停审门禁

| Step 14 可消费的输入 | 本 Step 已提供 | 不得提前假设 |
|---|---|---|
| 配置/外部绑定审计 | external seam不提供lock/commit proof；不选择retry/lease/scheduler/TTL/DB isolation | 任何具体配置键、provider、endpoint、retry次数、timeout、secret或deployment事实。 |
| 幂等依赖边界 | Command/Job key来源、opaque stable-input范围、inbound/outbound零/blocked边界 | digest算法、retention/expiry、in-flight cleanup、event receipt或publisher config。 |
| 恢复约束 | commit unknown、missing replay、version conflict、projection/handoff pending的fail-closed规则 | 自动repair、补偿、new-key retry、positive owner result。 |
| 测试承接 | Step 16需要的planned cut和blocker条件 | 已实现测试、run、report、evidence或结果。 |

### 12.1 完成检查

- [x] 已按 Step 13 SOP 输出并发场景表、幂等 key 表和重入保护表。
- [x] 已覆盖 10 Command、10 Query、2 条条件入站边界、6 个 bounded Job 与 zero outbound inventory。
- [x] 已明确 current B01/B02 no-write 与 future/reopen version/reserve/replay顺序。
- [x] 已明确 key、opaque stable input、object version、business unique、append-only、projection之间不可替代。
- [x] 已明确 duplicate、conflict、stored-result断裂、commit unknown、partial job/projection failure 的处理上限。
- [x] 已把 existing `Reserved`/in-flight 和 namespace ambiguity登记为 reopen item，未新增enum、port、lease、scheduler、receipt或result factory。
- [x] 已保留 `DDD-S9-B01/B02`、`DDD-S11-B03`、`PF-UNAVAILABLE-RECOVERY`、MI-UP/Q-MI blocker，不把兄弟项目 pending写为闭合合同。
- [x] 未读取旧正式 `03-详细设计.md`，未装配正式 03，未实现代码、未运行测试、未创建实现仓、未生成digest/report/evidence/verdict/signoff/readiness、未提交commit。

```text
Step 13 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_14
formal_03_write_allowed = false
implementation_allowed = false
commit_required = false
```

## 13. Step 完成记录

| 项目 | 记录 |
|---|---|
| 完成时间 | 2026-08-31 |
| 完成状态 | `completed_stop_review` |
| 已形成材料 | 并发资源表、key/opaque stable-input表、duplicate/partial failure矩阵、重入保护、Query/inbound边界、cross-Step audit、planned test cuts、回填草稿和blocker ledger。 |
| 上游 blocker | 有：`MI-UP-001/002/003/005/006/007/008/009`、`Q-MI-003/004` 仍为 pending；本 Step新增的只是本仓设计 reopen 项 `DDD-S13-OPEN-01/02`，不是上游合同。 |
| 用户确认要求 | 必须等待用户明确确认后才可创建并进入 `03_ddd_step_14_config_dependencies.md`。 |
