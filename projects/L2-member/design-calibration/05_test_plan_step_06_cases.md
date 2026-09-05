# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节：`projects/L2-member/05-测试方案.md` §6「测试场景与用例设计」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_06_cases.md`
> 编号口径：本文件中的 `TC-L2M-*` 与 `EV-CAND-L2M-*` 仅为 planned 用例 / 证据候选，不代表已执行或已产生证据。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6：设计测试场景与用例矩阵 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | Step 3 对象 / 切口；Step 4 分层；Step 5 覆盖矩阵；`03-详细设计.md` §7~§15；`04-配置设计.md` |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_06_cases.md` |
| 回填位置 | 正式 `05-测试方案.md` §6（Step 15） |
| 停审方式 | 按切口族完成用例和断言审查；所有用例完成后进行 phase、命名、证据候选和 blocker 审计 |

## 2. 本步目标

把 Step 5 的覆盖关系落成可执行、可断言、可留证的场景和用例。每个 P0 用例必须说明数据前置、操作、正式字段 / 状态 / 错误断言、自动化候选和证据候选；外部正向资格受 blocker 时只能写 refusal、blocked、waiting、unknown 或 local result。

本 Step 不定义 fixture 具体文件、真实环境部署、CI 脚本、正式 EV 编号或验收裁决。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 提供需求 / 规则 / 设计 / 切口映射 |
| `05_test_plan_step_03_test_objects_cuts.md` | 提供七模块、协议、状态和共用切口 |
| `05_test_plan_step_04_strategy_layers.md` | 提供首要发现层和阻断级别 |
| `03-详细设计.md` §7~§15 | 提供正式协议、flow、状态、事务、错误、配置与观测名称 |
| `03_ddd_step_16_test_cuts.md` | 提供最小测试断言和保守分支 |
| `04-配置设计.md` §6~§12 | 提供 profile、slot、redaction、fail-fast 与不可配置项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 正向主线如何执行？ | 用 deterministic local fixture 构造合法双锚、正式 typed ref、policy / resolution safe basis 和 local Store；按 named Command / Consumer / Job flow 执行，断言 member-local fact / successor / typed carrier 已按 UoW 提交。外部 owner 的 acceptance / delivery / observed 仍不作断言。 |
| 关键反向和边界如何触发？ | 缺 metadata / 双锚 / required ref、wrong source / schema / digest、forbidden body、stale / conflict、invalid state、missing carrier、unavailable slot、commit unknown、rollback failure、late / duplicate 和 non-materialization 均使用独立负向数据。 |
| 状态非法迁移如何断言？ | 只调用正式 factory / helper；非法或 reserved edge 返回所属层 `*Error::ContractViolation` / `IllegalTransition` / safe blocked posture，不写 successor、accepted carrier 或外部状态。 |
| 事务与副作用如何验证？ | 使用 fake UoW / Store / adapter spy 记录调用顺序与写集；验证 carrier 先于 idempotency complete、CAS 只用 loaded `MemberStoreVersion`、unknown 不盲重试、Query 无 write、Job 不修 source truth。 |
| phase 越界如何避免？ | 预期结果只写当前 CP 的 local state、attempt、gap、safe ref 或 typed result；不把 Runtime run/outcome、host session/health、Bus delivery、downstream accepted、observed、evidence 或 readiness 提前写入。 |
| 每个用例是否可自动化？ | P0 contract/domain/service/boundary/redaction/dependency 用例均为 automation candidate；真实跨仓 positive lane 标记 `blocked / selected-run`，不能因无法执行而伪造通过。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 05 用例使用不存在的 persona / endpoint 语义 | 全部改为当前 10/16/14/5 协议和七 CP 切口 |
| 旧用例偏向 happy path | 每个接口补 invalid、duplicate、conflict、unavailable 或 no-write 分支 |
| 24 candidate 容易生成事件用例 | 明确只有 `TC-EVENT-BLOCK-*` non-materialization 负向用例 |
| 外部反馈容易越过 phase | 所有 feedback 只形成 local link / gap successor，不断言 delivered / accepted / observed |
| `ReplaceSubscriptionScope`、CP04~CP07 helper 不完整 | 正向用例保留 reserved / refusal 预期，不用 Store 直写模拟 |

## 6. 改动前后对比

| 项 | 改动前 | 当前收束 | 原因 |
|---|---|---|---|
| 用例编号 | 旧 `TC-001` 等不稳定编号 | `TC-L2M-<族>-<三位>` | 可追溯、可供 06 / 07 引用 |
| 断言 | “接口成功” | 正式 carrier、state、error、write-set、phase boundary | 防止宽泛成功断言 |
| 证据 | 直接写日志 / DB / API | `EV-CAND-L2M-*` 候选，Step 13 绑定真实 artifact | 不伪造证据 |

## 7. 测试设计取舍

| 议题 | 结论 | 原因 |
|---|---|---|
| 是否为每个 34 对象单独造场景 | 以对象组切口组织，保留对象反查 | 减少重复而不丢对象契约 |
| 是否给每个 Query 写成功副作用 | 每个 Query 写 read surface + no-write 断言 | Query 的核心风险就是隐式写入 |
| 是否为 24 candidate 设计 fake event | 不设计 | `L2M-UP-005` 未闭合，测试不得创造协议 |
| 是否以 fake adapter 的返回值作为外部成功 | 只作为 local blocked / attempt / gap 输入 | owner truth 外置 |

## 8. 结构化中间产物

### 8.1 用例矩阵总规则

| 用例类型 | 前置 | 必须断言 | 证据候选 |
|---|---|---|---|
| local positive | 合法双锚、typed refs、safe basis、可用 local Store | local fact / successor、typed carrier、UoW commit 关系 | `EV-CAND-L2M-LOCAL-*` |
| invalid pre-gate | 缺字段、错 name/body、错 source/schema、forbidden body | 不 begin write UoW、不 reserve、不调用 domain / adapter | `EV-CAND-L2M-REJECT-*` |
| blocked / waiting | 对应 `L2M-UP-*` 或 DDD gap 注入 | safe non-positive carrier、blocker / reason、无外部 success | `EV-CAND-L2M-BLOCK-*` |
| duplicate / conflict | matching relation 或 same key different digest | exact replay / `Conflict`，无第二写者、无重跑 side effect | `EV-CAND-L2M-REPLAY-*` |
| no-write / redaction | Query、日志、诊断、Job / projection | 无业务写、无 raw body / secret / high-cardinality 内容 | `EV-CAND-L2M-SAFE-*` |

### 8.2 Command 用例矩阵（10）

| 用例 ID | 测试切口 / Command | 场景与前置 | 操作 | 预期结果与断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|---|
| `TC-L2M-CMD-001` | `AdmitMemberStartup` | 合法双锚、startup context ref；credential / host proof 缺失 | submit command | local admission 或 `Blocked(L2M-UP-001/006)`；不写 host accepted / session / health | 是 | `EV-CAND-L2M-CMD-001` |
| `TC-L2M-CMD-002` | `EstablishMemberPresence` | committed admission、双锚匹配；重复 active presence | submit command | `MemberPresence` local successor；冲突 / duplicate 不创建第二 active presence | 是 | `EV-CAND-L2M-CMD-002` |
| `TC-L2M-CMD-003` | `TransitionMemberPresence` | loaded `MemberStoreVersion`、合法 target；terminal / stale target | submit command | 合法 helper successor；非法 / CAS conflict 回滚，不覆盖 current | 是 | `EV-CAND-L2M-CMD-003` |
| `TC-L2M-CMD-004` | `PrepareHostCollaboration` | presence 与 safe category；host contract unavailable | submit command | local material / attempt 或 blocked；不声称 host acceptance / session | 是 | `EV-CAND-L2M-CMD-004` |
| `TC-L2M-CMD-005` | `EstablishSubscriptionScope` | source-backed body-free scope；unknown / stale policy | submit command | local scope decision；未知来源 reject / blocked，不扩权 | 是 | `EV-CAND-L2M-CMD-005` |
| `TC-L2M-CMD-006` | `ReplaceSubscriptionScope` | current scope + expected version；successor helper gap | submit command | helper 可用时同 UoW supersede；当前 gap 返回 reserved / blocked，不 Store 直写 | 是 | `EV-CAND-L2M-CMD-006` |
| `TC-L2M-CMD-007` | `SubmitScreenedFactToRuntime` | `Passed` / permitted `Degraded` screening；entry mapping unavailable | submit command | local delivery decision / attempt；`Blocked(L2M-UP-003)` 或 unknown fence，不伪造 Runtime run | 是 | `EV-CAND-L2M-CMD-007` |
| `TC-L2M-CMD-008` | `LinkRuntimeAdmissionResult` | matching attempt + formal result ref；late / wrong correlation | submit command | local `RuntimeResultLink` 或 waiting；不改 Runtime truth、不重复读取 | 是 | `EV-CAND-L2M-CMD-008` |
| `TC-L2M-CMD-009` | `ResolveExternalContext` | owner-specific ref、purpose / scope、body-free safe result | submit command | snapshot + neutral resolution / gap；不生成授权、健康或 registry truth | 是 | `EV-CAND-L2M-CMD-009` |
| `TC-L2M-CMD-010` | `RequestExternalContextRefresh` | existing gap / refresh relation；DDD-006 helper gap | submit command | 合法实现时登记 local refresh；当前缺口只返回 refusal / blocked，duplicate exact replay | 是 | `EV-CAND-L2M-CMD-010` |

### 8.3 Query 用例矩阵（16）

每个 Query 均要求一个可读 local surface、一个 not-visible / stale / unavailable / empty 分支，并断言无 digest、reservation、write UoW、resolver、handoff、refresh、rebuild 或 reconcile。

| 用例 ID | Query | 读取对象 / 场景 | 断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|
| `TC-L2M-QRY-001` | `GetMemberPresence` | matching presence / missing | visible 或 not-ready；无写 | 是 | `EV-CAND-L2M-QRY-001` |
| `TC-L2M-QRY-002` | `GetHostCollaborationPosture` | attempt page / blocked attempt | local posture，不是 host health/session；无 host call | 是 | `EV-CAND-L2M-QRY-002` |
| `TC-L2M-QRY-003` | `GetCurrentSubscriptionScope` | active / superseded / no basis | safe scope 或 not-visible；不读 policy body | 是 | `EV-CAND-L2M-QRY-003` |
| `TC-L2M-QRY-004` | `GetScreeningDisposition` | screening / unknown | exact classification；不重跑 inspection | 是 | `EV-CAND-L2M-QRY-004` |
| `TC-L2M-QRY-005` | `GetRuntimeMediationPosture` | decision / attempt / unknown | local posture；不变 Runtime accepted | 是 | `EV-CAND-L2M-QRY-005` |
| `TC-L2M-QRY-006` | `GetRuntimeMaterialReception` | safe reception / rejected | body-free surface；不读 outcome body | 是 | `EV-CAND-L2M-QRY-006` |
| `TC-L2M-QRY-007` | `GetOutboundDecision` | eligible / blocked | decision 不等 material / delivery | 是 | `EV-CAND-L2M-QRY-007` |
| `TC-L2M-QRY-008` | `GetPublicationPosture` | attempt / gap page | local attempt/gap；不等 delivery ack | 是 | `EV-CAND-L2M-QRY-008` |
| `TC-L2M-QRY-009` | `GetInteractionTrace` | committed trace / missing predecessor | append-only page / gap；不追加记录 | 是 | `EV-CAND-L2M-QRY-009` |
| `TC-L2M-QRY-010` | `ListInteractionGaps` | empty / open gap | `Empty` 或 gap；不触发修复 | 是 | `EV-CAND-L2M-QRY-010` |
| `TC-L2M-QRY-011` | `GetObservationPosture` | submitted / unknown attempt | local posture；不等 observed/evidence | 是 | `EV-CAND-L2M-QRY-011` |
| `TC-L2M-QRY-012` | `GetExternalContextResolution` | resolved / stale / unavailable | neutral body-free view；不 refresh | 是 | `EV-CAND-L2M-QRY-012` |
| `TC-L2M-QRY-013` | `ListExternalContextGaps` | page / pending gap | exact gap surface；不调用 resolver | 是 | `EV-CAND-L2M-QRY-013` |
| `TC-L2M-QRY-014` | `GetMemberSummary` | fresh / stale projection | summary 或 stale/not-ready；不 rebuild source | 是 | `EV-CAND-L2M-QRY-014` |
| `TC-L2M-QRY-015` | `GetCapabilityOutlet` | safe ref / disabled | non-authorizing view；不生成 registry / grant | 是 | `EV-CAND-L2M-QRY-015` |
| `TC-L2M-QRY-016` | `GetMemberDiagnostics` | safe diagnostic / forbidden body | redacted diagnostic；不写 audit、无 secret/body | 是 | `EV-CAND-L2M-QRY-016` |

### 8.4 Consumer 用例矩阵（14）

| 用例 ID | Consumer | 场景与前置 | 预期结果与断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|
| `TC-L2M-CON-001` | `HostFeedbackConsumer` | matching host attempt / wrong attempt | local feedback link 或 blocked receipt；不改 host lifecycle | 是 | `EV-CAND-L2M-CON-001` |
| `TC-L2M-CON-002` | `InboundFactConsumer` | verified body-free descriptor / forbidden body | fact + screening 或 rejected receipt；raw body 不落库 | 是 | `EV-CAND-L2M-CON-002` |
| `TC-L2M-CON-003` | `RuntimeMaterialConsumer` | formal safe material / unsupported source | reception 或 blocked receipt；不复制 Runtime body | 是 | `EV-CAND-L2M-CON-003` |
| `TC-L2M-CON-004` | `DeliveryFeedbackConsumer` | matching publication attempt / late feedback | local feedback/gap successor；不声称 delivered | 是 | `EV-CAND-L2M-CON-004` |
| `TC-L2M-CON-005` | `ObservationFeedbackConsumer` | matching observation attempt / unknown | feedback/gap 或 blocked；不声称 observed/evidence | 是 | `EV-CAND-L2M-CON-005` |
| `TC-L2M-CON-006` | `SubjectIdentityContextUpdateConsumer` | owner-safe ref / mismatch | neutral resolution/gap；不生成第三执行主语 | 是 | `EV-CAND-L2M-CON-006` |
| `TC-L2M-CON-007` | `PolicyContextUpdateConsumer` | policy safe snapshot / stale | resolution/gap；不保存 approval / rule body | 是 | `EV-CAND-L2M-CON-007` |
| `TC-L2M-CON-008` | `RuntimeBoundaryContextUpdateConsumer` | formal boundary ref / wrong schema | neutral resolution 或 rejected；不生成 Runtime state | 是 | `EV-CAND-L2M-CON-008` |
| `TC-L2M-CON-009` | `CapabilityContextUpdateConsumer` | tool/method safe ref / raw definition | mirror relation 或 rejected；不生成 registry / invocation | 是 | `EV-CAND-L2M-CON-009` |
| `TC-L2M-CON-010` | `HostRouteContextUpdateConsumer` | host route ref / unavailable | resolution/gap；不生成 host health / route truth | 是 | `EV-CAND-L2M-CON-010` |
| `TC-L2M-CON-011` | `RuntimeMaterialReceptionConsumer` | committed CP03 reception / absent reception | CP04 local continuation 或 rejected；不准备 outbound success | 是 | `EV-CAND-L2M-CON-011` |
| `TC-L2M-CON-012` | `MemberCommittedFactConsumer` | committed fact ref / arbitrary Store scan | trace/gap successor 或 reject；不写 source fact | 是 | `EV-CAND-L2M-CON-012` |
| `TC-L2M-CON-013` | `MemberProjectionUpdateConsumer` | committed fact + version / stale version | projection stale marker 或 conflict；不 rebuild / 修 source | 是 | `EV-CAND-L2M-CON-013` |
| `TC-L2M-CON-014` | `CapabilityOutletSourceUpdateConsumer` | committed CP06 resolution / raw capability event | outlet posture successor 或 reject；不授权 invocation | 是 | `EV-CAND-L2M-CON-014` |

### 8.5 24 candidate、Job 和共用边界用例

| 用例 ID | 测试切口 | 场景 | 预期结果 / 断言 | 自动化 | 证据候选 |
|---|---|---|---|---|---|
| `TC-L2M-EVT-001` | 24 candidate non-materialization | 任一 local fact 已提交，`L2M-UP-005` 未闭合 | 没有 event envelope / payload / publisher / outbox / route / topic / retry / DLQ；只保留 blocked marker | 是 | `EV-CAND-L2M-EVT-001` |
| `TC-L2M-EVT-002` | candidate count / zero config | 扫描 24 candidate 名称 | 24 项均为 blocked semantic name，不存在可配置正向 route | 是 | `EV-CAND-L2M-EVT-002` |
| `TC-L2M-JOB-001` | `PublicationRelay` | prepared attempt / gap、one item unavailable | local attempt/gap report；不等 delivered；partial item isolated | 是 | `EV-CAND-L2M-JOB-001` |
| `TC-L2M-JOB-002` | `ObservationRelay` | observation attempt / unknown | local attempt/gap report；不等 observed/evidence | 是 | `EV-CAND-L2M-JOB-002` |
| `TC-L2M-JOB-003` | `ExternalContextRefresh` | finite source relation / DDD-006 gap | safe resolution/gap report 或 refusal；不授权 / 健康升级 | 是 | `EV-CAND-L2M-JOB-003` |
| `TC-L2M-JOB-004` | `MemberProjectionRebuild` | committed refs、older cursor | projection state / view successor；不改 CP01~06 source | 是 | `EV-CAND-L2M-JOB-004` |
| `TC-L2M-JOB-005` | `GapReconciliation` | finite gap + target watermark | local freshness / gap report；不关闭 source gap | 是 | `EV-CAND-L2M-JOB-005` |
| `TC-L2M-COMMON-001` | pre-gate | invalid metadata / name / body / schema | no UoW、no reservation、no adapter call | 是 | `EV-CAND-L2M-COMMON-001` |
| `TC-L2M-COMMON-002` | exact replay | same channel / operation / key / digest / result kind | exact typed result / receipt / report；no body rerun | 是 | `EV-CAND-L2M-COMMON-002` |
| `TC-L2M-COMMON-003` | conflict | same key, different digest / operation | `Conflict`；不覆盖 reservation，不泄漏旧 carrier | 是 | `EV-CAND-L2M-COMMON-003` |
| `TC-L2M-COMMON-004` | missing carrier | completed relation but carrier missing / wrong kind | `StoredResultUnavailable` / consistency defect；不重算 | 是 | `EV-CAND-L2M-COMMON-004` |
| `TC-L2M-COMMON-005` | in-flight / commit unknown | reserved relation or ambiguous commit | `InFlight` / same-relation inspect；不第二写者、不盲重试 | 是 | `EV-CAND-L2M-COMMON-005` |
| `TC-L2M-COMMON-006` | CAS / append | concurrent successor / duplicate immutable identity | one winner / conflict；append-only collision not replay | 是 | `EV-CAND-L2M-COMMON-006` |
| `TC-L2M-COMMON-007` | redaction | raw body, secret, token, stack trace injected | output / log / metric / audit rejected or redacted；无 forbidden field | 是 | `EV-CAND-L2M-COMMON-007` |
| `TC-L2M-COMMON-008` | config / builder | missing required slot / forbidden override | fail-fast / non-ready；`Ready` only local facade composition | 是 | `EV-CAND-L2M-COMMON-008` |

## 9. 单测试切口用例停审记录

| 切口组 | 正向 / 负向 / 边界 | 断言是否具体 | phase 是否越界 | 证据候选是否唯一 | 结论 |
|---|---|---|---|---|---|
| 10 Command | 每条至少 local 或 blocked + invalid / replay | 是 | 否 | 候选唯一 | `pass_with_blockers` |
| 16 Query | 每条 read surface + no-write | 是 | 否 | 候选唯一 | `pass` |
| 14 Consumer | 每条 source/schema/body/dedup + receipt | 是 | 否 | 候选唯一 | `pass_with_DDD-003` |
| 24 candidate | 仅 blocked / non-materialization | 是 | 否 | 候选族唯一 | `pass / blocked` |
| 5 Job | 每条 finite / partial / replay / no-repair | 是 | 否 | 候选唯一 | `pass_with_DDD-004~007` |
| state / UoW / config / redaction | 合法、非法、reserved、故障注入 | 是 | 否 | Step 13 再冻结 | `pass_with_design_blockers` |

## 10. 跨用例断言 / phase 审计表

| 审计项 | 结论 | 修正 / 约束 |
|---|---|---|
| 旧状态名 / 口语名 | `none_allowed` | 只用正式 enum variant |
| foreign success 断言 | `none_allowed` | host accepted、Runtime executed、Bus delivered、downstream accepted、observed、evidence、readiness 均排除 |
| Query 写入 | `guarded` | 每个 Query 加 write-port spy 断言 |
| Job source repair | `guarded` | Job 只写自身 continuation / report relation |
| 24 candidate event设施 | `none` | `L2M-UP-005` 前只检查 non-materialization |
| duplicate 与 retry | `separated` | duplicate exact replay；unknown 不盲 retry |
| evidence 静态伪造 | `prevented` | 当前仅 `EV-CAND`，Step 13 由 artifact/report 推导正式 EV |

## 11. 回填草稿（供正式 §6）

测试场景按协议族、状态 / 一致性和安全边界组织。10 个 Command 各有 typed input、local result 或 blocked/refusal、duplicate / conflict 及 UoW 断言；16 个 Query 各有允许读取的 body-free surface 与 no-write 断言；14 个 Consumer 覆盖 source/schema/body/dedup gate、typed receipt、late / duplicate 和 committed-fact 边界；5 个 Job 覆盖 finite continuation、partial item、exact report replay 和 no source-truth repair。

24 个 outbound semantic candidate 只设计 non-materialization 负向用例，禁止 event envelope、publisher、outbox、topic、route、retry、DLQ 或 delivery 测试。所有用例使用正式字段、状态和错误名，且不跨越 host / Runtime / Bus / downstream / observability phase。`TC-L2M-*` 和 `EV-CAND-L2M-*` 均为 planned，正式证据由 Step 13 绑定真实 artifact / report。

## 12. 待确认事项与进入下一步条件

| 待确认项 | 影响 | 处理 |
|---|---|---|
| `L2M-UP-001~008` | 外部 positive lane | 只保留 blocked-aware；Step 14 记录 residual |
| `L2M-DDD-001~007` | repo、Store、receipt、helper | 不用测试伪补；Step 7~10 保留 fake / reserved |
| `scope_supersede_gap` | Replace positive | 只测 refusal / reserved |
| 具体 fixture / script / artifact schema | 执行与证据 | Step 7、9、13 再定义 |

- [x] P0 每个协议族和共用风险均有可断言用例。
- [x] 每个用例有前置、操作、正式断言、自动化候选和证据候选。
- [x] 已完成切口停审、phase / 状态 / 证据候选审计。
- [x] 未写执行结果、run_id、artifact、report、verdict 或 readiness。

**Step 6 结论：** `completed / pass_with_explicit_blockers / stop_review`。按本轮授权进入 Step 7。
