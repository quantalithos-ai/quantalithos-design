# L2-member-images 03 详细设计 Step 11：持久化、事务与一致性契约

> 创建日期：2026-08-30  
> 状态：`completed_stop_review`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11  
> 回填位置：正式 `03-详细设计.md` 第 10 章“数据持久化、事务与一致性契约”（当前仅形成回填草稿，禁止装配正式 03）  
> 当前授权：用户已明确授权完成 Step 11；本文件完成后必须停审，未经再次明确确认不得创建 Step 12、装配正式 03、实现、测试或提交。

## 0. Step 状态与开工确认

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 11：持久化、事务与一致性契约。 |
| 恢复入口 | 已先读取项目级 `project_execution_ledger.md`、文档级 `03_ddd_calibration_flow.md`、Step 6~10 校准材料、Step 11 SOP/书写规范和 L1-governance 的同粒度样例。 |
| 直接输入 | 重建版正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`；Step 6 对象、Step 7 port、Step 8 protocol、Step 9 flow、Step 10 state matrix。 |
| 方法参照 | 仅借鉴 L1-governance Step 11 的“logical store → repository semantic → transaction → consistency → cross-Step audit”粒度；不继承其 outbox、publisher、delivery、approval、report 或外部产品合同。 |
| 本 Step 产出 | 本仓 local truth 的 logical store、主键/唯一性/索引/版本语义、全部现有 repository 函数的持久化语义、UoW 边界、projection/replay/append-only 规则与恢复交接。 |
| 本 Step 不做 | 不选数据库、SQL/DDL、migration、隔离级别、缓存、broker、registry、publisher、重试次数、route、topic、digest 算法、物理配置或实现仓。 |
| 完成结论 | `pass_with_explicit_blockers`：本仓 local persistence contract 已闭合到现有 Step 6~10 的粒度；当前 Command/Job 仍为零 mutation，所有 external positive lane 仍显式 pending。 |
| 强制停点 | 下一允许动作只能是等待用户明确确认 Step 12；不能提前创建错误恢复文件或修改正式 `03-详细设计.md`。 |

### 0.1 本 Step 的边界重申

- 本仓只保存成员镜像定义、静态装配、构建阶段、资格阶段、local supply、body-free reference snapshot/gap、trace、projection 和 application replay 的**本地事实**。
- RoleDefinition、Role mapping 正文、runtime/tools/member/supervisor/extras 正文、policy/memory/workspace live state、Artifact truth、Member Service consumer truth、container/host/launch/health、governance approval、observability backend 与外部 adapter 响应均不进入本仓 store。
- `compile/runtime/event/ref/adapter/fake` 是依赖分类，不是表结构、源码依赖或事务参与者。消费镜像 entry 不自动构成 compile dependency。
- `MI-UP-009` 未闭合，因此本仓没有 outbox、publisher、delivery、payload snapshot、delivery receipt 或任何 outbound persistence；local trace、availability transition、entry 和 stored result 不能冒充出站事实。
- `DDD-S9-B01` 与 `DDD-S9-B02` 尚未解除，因此本文件描述的写事务是**future/reopen implementation contract**，不是当前可执行流程；当前 10 个 Command、6 个 Job 均不得 begin write UoW、reserve、save、append、complete 或 commit。

## 1. Step 内计划、批次与停审门禁

| 批次 | 覆盖范围 | 状态 | 完成判断 |
|---:|---|---|---|
| 11.0 | 开工恢复、输入/边界、SOP 问答与诊断 | `done` | 已确认不读旧正式 03，不把上游/兄弟 pending 写为 local truth。 |
| 11.1 | 数据所有权实现表与 logical store 契约 | `done` | 每个 Step 6 local subject 均有唯一存储语义；外部正文、live state 与 outbound store 均被排除。 |
| 11.2 | Step 7 全部 repository/UoW/replay 函数的持久化语义 | `done` | typed read、page、save、append、projection、reservation 和 replay 均可回指现有 port。 |
| 11.3 | Command、Query、条件入站、Job 的事务边界与顺序 | `done` | 当前零 mutation 与 future/reopen order 明确分开；无 outbox/publisher。 |
| 11.4 | version、append-only、projection、replay、external seam、一致性与失败恢复规则 | `done` | 所有写入使用同对象版本或 Absent；不可恢复/未闭合项保留 blocker。 |
| 11.5 | Step 6~10 cross-audit、正式回填草稿、Step 12 handoff 与停审 | `done` | 不新增对象/port/协议；正式 03 仍禁止装配。 |

| Step / 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `persistence_consistency` | done | done | done | done | done | done | `pass_with_explicit_blockers` | 停审，等待用户明确确认 Step 12。 |

## 2. SOP 问题回答

| # | SOP 问题 | 收敛回答 |
|---:|---|---|
| 1 | 哪些数据对象由本仓拥有？ | DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived 及 application replay 的 local truth/marker/history。它们的 owner 是本仓；外部 owner 只以 typed body-free ref、安全结论或 local gap 出现。 |
| 2 | 哪些只是引用、快照或投影？ | Mapping/外部 reference snapshot、组件/seed/base pin、provenance/evidence/Artifact/consumer 相关 ref 都是 body-free reference 或 local observation；ImageDerivedReadModel 与 ProjectionFreshness 是可重建读侧，不是 domain truth。 |
| 3 | repository 函数如何命名、参数和返回是什么？ | Step 7 已固定函数签名。本 Step 不新增方法，而是为每个 exact get、business-key find、page list、save、append、projection lookup、reservation 与 replay read 补齐 key、排序、版本、同 UoW 与缺失/冲突语义。 |
| 4 | 哪些处理流需要事务？ | future/reopen 的 Command 与 Job local mutation path 需要 `ReadWrite` UoW；Query 与当前两条 conditional inbound marker flow 不开始写 UoW。当前 B01/B02 下 Command/Job 也不开始写 UoW。 |
| 5 | 是否需要乐观锁、行锁、版本号、outbox 或 projection？ | 需要 per-object optimistic version；不选择行锁或物理隔离级别。projection 是最终一致的 local read model。outbox/publisher 当前严格不存在，不能因参照 L1-governance 补入。 |
| 6 | 如果事件发布或 projection 更新失败，如何恢复？ | 没有本仓 outbound event publish lane，故不存在 event delivery recovery。projection rebuild 失败只能保留既有 view 或写既有 freshness 的安全不可用/陈旧状态；不能回滚 source truth、不能 query-time repair。Unavailable 的恢复函数尚未定义，保留 `PF-UNAVAILABLE-RECOVERY`。 |

### 2.1 当前可调用性判定

~~~text
current Command / Job:
  request/metadata or action marker
  -> DDD-S9-B01 or DDD-S9-B02
  -> fail closed
  -> zero UoW / zero repository save / zero trace / zero projection / zero replay

current Query:
  explicit typed read or existing projection lookup
  -> read-only response
  -> zero UoW / zero reservation / zero repair

current conditional inbound:
  marker inspection only
  -> accepted_input=false
  -> zero UoW / zero snapshot/gap/truth write
~~~

关键说明：

- 后文的“事务”“commit”“stored result”均为 B01/B02、相应 protocol mapper 与 owner contract 完成后才可重开的实现约束。
- `Declared` job action 不是 scheduler/run/report 事实；它在当前仍会于 B01 前停止。
- 本 Step 不把“持久化设计已完成”写成镜像、digest、Artifact、consumer 或 runtime readiness。

## 3. 当前材料诊断、改动前后与设计取舍

### 3.1 当前材料诊断

| 来源 | 已有结论 | 直接实施风险 | 本 Step 收束 |
|---|---|---|---|
| Step 6 | 已有 20 个 local lifecycle subject、immutable input、trace/read model/replay carrier | 实现者可能把 timestamp、tag、digest、cursor 或 external revision 当作写版本，或把 live state 放入 store | 固定 `Versioned<T>.version` / `ExpectedLocalObjectVersion`，并明确 body-free/static-only 边界。 |
| Step 7 | 已有 repository/UoW/Idempotency/Projection trait | 仅有签名时可能无法确定 unique key、page order、append-only、staged visibility 或 fake parity | 为每个函数分组写入 store key、排序、missing/conflict、同 UoW 与禁止事项。 |
| Step 8 | 协议和 page schema已分族，写 protocol 仍被 B01/B02 阻断 | 可能错误把 public page token、request metadata 或 result ref当 repository version | public page 与 internal cursor分离；result body 未闭合则不得保存/complete。 |
| Step 9 | 28 条 flow 已分开，写 flow给出 future UoW方向 | 容易将 blocked flow 当作可执行，或让 duplicate 重跑 domain/adapter/job scan | 明确当前零 mutation，并固定 future reserve→local writes→result→complete→commit 顺序。 |
| Step 10 | state matrix 已有 append/supersede、freshness 与 replay lifecycle | 容易将 append-only record update、projection Fresh、Consumer Resolved 或 gate Passed 误读为正向外部事实 | 区分 immutable record、versioned lifecycle、append-only trace/history、projection watermark 与 owner pending。 |
| L1-governance Step 11 | 提供充足的事务/一致性写作粒度 | 可能机械复制 outbox/publisher/report/approval store | 采用同样审计深度，但本仓 outbound inventory 保持零。 |

### 3.2 改动前后对比

| 主题 | 进入 Step 11 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| store 语言 | Step 7 只有 port，Step 9 只有 flow 级 side-effect 表述 | 每个 local object 有 logical store、identity、index、version/append-only 属性 | 让 durable adapter 与 fake 可实现等价行为。 |
| 版本来源 | 已有 Versioned/Expected helper，未逐对象落地 | existing object 只能用同对象 versioned read 返回值；new object 只能用 Absent | 防止 lost update 与以外部 token 覆盖 local truth。 |
| projection | 已声明 committed truth rebuild，未收束 transaction relation | 只读 existing view；mutation 只能标脏既有 marker；rebuild 才可写 view/freshness | 避免 query、cache 或 projection 反写 truth。 |
| replay | 有 reservation/result shell，但未收束 commit 顺序 | result/replay body 必须先于 reservation complete 并同 UoW commit；duplicate 只读 stored replay | 防止 completed record 指向不存在结果或 duplicate 重跑。 |
| external side effect | safe adapter / handoff 仅有 boundary direction | 外部调用不参与 local atomic commit；其结果只能在 revalidation 后形成 local safe consequence | 不把 ACK、cache、tag 或 consumer observation 当本仓 commit evidence。 |
| outbound | Step 9 已判定 inventory 为零 | 明确不存在 outbox/publisher/delivery logical store | 防止形式参照污染本仓边界。 |

### 3.3 设计取舍

| 议题 | 可选方案 | 结论 | 取舍理由 |
|---|---|---|---|
| 物理存储 | 直接选数据库/DDL；或定义 logical store | 采用 logical store | 项目未进入实现；先固定可验证的 key、version、index、transaction 与 fake parity。 |
| mutable object 写入 | adapter 自行 upsert；或 versioned update | 采用 versioned update | `Absent` 与 `Exact` 使创建/更新语义可审计，拒绝 silent merge/last-write-wins。 |
| history / trace | 覆盖旧记录；或 append/supersede | 采用 append/supersede | 历史解释必须保留；修正以新 local context 表达。 |
| availability history | 用当前 entry 覆盖旧 availability；或 append-only transition | 采用 append-only transition | rollback/retire 是新 action context，不能改写既有历史。延迟终态持久化需要受现有 port 限制。 |
| projection | query 按需创建/修复；或已有 identity + committed truth rebuild | 采用后者 | 读路径必须无副作用，projection永远不是真相源。 |
| idempotency | duplicate 重新运行；或 stored replay | 采用 stored replay | duplicate 不能重新执行 domain transition、external adapter 或 page scan。 |
| outbox | 为完整性新增 outbox；或保持零库存 | 保持零库存 | `MI-UP-009` 未给本仓出站 authority；不存在正式 payload/consumer/delivery合同。 |

## 4. 统一持久化不变量

| 规则 | 正式口径 |
|---|---|
| local-only ownership | store 只接受 Step 6 定义的 local object、typed local ref、body-free external ref、safe reason/conclusion 与 local metadata；raw body、secret、live state、外部 SDK/HTTP/broker object 必须拒绝。 |
| write identity | local object ID 只来自 `ImageIdGeneratorPort`；repository、adapter、route、tag、digest、Artifact ref、consumer ref 或 DB row id 均不得自行生成或代替 typed local ref。 |
| time | local record/capture/transition/rebuild time 只来自 `ImageClockPort`；external completed time、event time、DB default 或 runtime state不能静默替代。 |
| optimistic version | 修改已存在的 mutable object时，`ExpectedLocalObjectVersion::Exact` 只能取自该**同一对象**的 `Versioned<T>.version`；cursor、timestamp、external revision、tag、digest、watermark、idempotency key 和 trace id 都不是 version。 |
| creation | 新 object 只能以 `ExpectedLocalObjectVersion::Absent` 保存；若 identity/unique key 已存在，必须 `VersionConflict` 或 `ContractViolation`，不得 upsert 或覆盖。 |
| UoW scope | 所有 local write、append、reservation、result save、complete 和既有 projection freshness 更新都必须验证同一 `ImageTransactionRef`、`ReadWrite` mode 与 `mutable_kinds` 许可。 |
| committed visibility | Query 只能读取 committed truth/view/marker。future write UoW 内的 staged write 可供同 UoW 的后续 consistency check 使用，但 commit 前不得向 query、其他 UoW 或 duplicate replay 可见。 |
| append-only | `ImageTraceRecord` 不可更新/删除。Availability action history 只能经 `append_availability_transition(..., Absent, uow)` 创建，不能覆盖或删除既有 transition。 |
| immutable input | baseline、build snapshot、pin、seed placement、base image、build input identity 与 stored result shell的 identity/content字段不可被 repository补写；变更必须新 context + supersede/关联。 |
| projection direction | committed local truth → snapshot → read model/freshness。projection/cache/fake 不得反写 definition/build/qualification/supply truth。 |
| external atomicity | adapter/owner/consumer call 不是 local UoW commit evidence，不能与 local transaction伪装成二阶段提交；未闭口结果只能变为 safe gap/blocked/unavailable 或 future reopen input。 |
| fake parity | in-memory fake 与 durable adapter 都必须实现同一 key、unique、stable order、version conflict、UoW staging/rollback、append-only、projection no-write 与 duplicate replay语义。 |

## 5. 结构化中间产物

### 5.1 数据所有权实现表

| 数据对象 | 拥有模块 | 写入方（future/reopen 除非另注） | 读取方 | 一致性要求 |
|---|---|---|---|---|
| ImageFamilyDefinition | domain::definition | DefinitionAssemblyCoordinator | definition query、revision coordination、projection | local mutable truth；family name 唯一；existing save 用 family 自身 version。 |
| ImageVariantDefinition | domain::definition | DefinitionAssemblyCoordinator | baseline/revision/query/projection | 与 family relation 同 UoW 保持双向一致；mapping只存 snapshot ref。 |
| AssemblyBaseline | domain::assembly | DefinitionAssemblyCoordinator | revision/query/projection | immutable static input；仅 lifecycle/reason/supersede 可 versioned 变化；输入改变新建 context。 |
| VariantRevision | domain::assembly | DefinitionAssemblyCoordinator | BuildIntentCoordinator、query/projection | baseline/variant relation必须一致；current pointer 更新与关联 definition 同 UoW。 |
| MappingSourceSnapshot | domain::assembly | ReferenceIntake/Definition coordinator | definition/baseline/revision/query | body-free mapping observation；不得保存 Role/mapping body。 |
| BuildIntent | domain::build | BuildIntentCoordinator | build query/nightly scope | local intent，不证明外部 build；versioned lifecycle。 |
| BuildInputSnapshot | domain::build | BuildIntentCoordinator | attempt/provenance/build query | immutable input identity；不能由 store补 digest、input 或 live state。 |
| BuildAttempt / BuildOutcomeConclusion / CandidateImage | domain::build | BuildIntentCoordinator | reconciliation、qualification、query/projection | attempt/outcome/candidate 三者独立；safe outcome 不等 provider truth；candidate unique relation受 store guard。 |
| ProvenanceBinding / GateEvaluation / EligibilityDecision | domain::qualification | QualificationCoordinator | supply/query/projection | external evidence/gate正文不落库；current eligibility 不能由空 gate/adapter/config推导。 |
| ArtifactHandoffRecord | domain::qualification | QualificationCoordinator | handoff reconcile/query | 仅 local Pending/Gap observation；`MI-UP-007`前拒绝 Accepted/owner ref mint。 |
| AvailabilityTransition | domain::supply | AvailabilityCoordinator | history query/current-facts guard/projection | append-only local history；创建只允许 Absent；不代表 registry/consumer/container状态。 |
| InstantiableEntry | domain::supply | AvailabilityCoordinator | resolve/catalog/query/projection | versioned local pinned entry；Available 只表示本仓 supply语义。 |
| ConsumerHandoffGap | domain::supply | Availability/Reference coordinator | resolve/gap query/reconcile | versioned local gap；`MI-UP-001`未闭合时拒绝 Resolved。 |
| ExternalReferenceSnapshot / ContractGap | domain::reference | ReferenceIntake/all coordinators | guard/query/rebuild/reconcile | ref snapshot按 exact use；gap只冻结一个 lane；external body不入库。 |
| ImageTraceRecord | domain::reference | permitted future local mutation/maintenance flow | trace query/audit follow-up | append-only explanation record；不反写 truth、不存 raw log/report。 |
| ImageDerivedReadModel / ProjectionFreshness | domain::reference + application/infra projection seam | ProjectionRebuilder 或 existing-view stale marker flow | Query/rebuild | derived maintenance state；read model只能由 committed local truth建立。 |
| ImageIdempotencyRecord / StoredImageOperationResult / replay body | application | Command/Job future facade | duplicate replay only | reservation、result shell/body、complete 在同一 UoW；当前 B01/B02 前零写。 |
| runtime/tools/member/supervisor/extras/policy-memory-workspace body | 外部 owner | 不可写入 | 本仓仅经 typed ref/safe conclusion/gap 读取 | 永不成为 local persisted body或 default input。 |
| Artifact、consumer/container、governance、observability truth | 对应 owner | 不可写入 | 本仓仅经 typed ref/local handoff or gap 读取 | 不 mint、不确认、不覆盖、不由 local availability/projection替代。 |

### 5.2 Logical store / collection / projection 契约表

以下名称是逻辑 store，不指定 SQL table、collection、文件、KV namespace 或 migration。durable adapter 和 fake 可使用不同物理形态，但必须保持此表的 identity、unique、index/order、version 与 transaction 行为。

| logical store | 保存内容 | 主键 / 业务唯一键 | 关键索引与稳定排序 | version / 写入规则 |
|---|---|---|---|---|
| `image_family_definitions` | ImageFamilyDefinition | local family ref；family_name按 domain 已验证的精确值唯一 | family_name lookup；按 local id读取 | mutable；create=Absent；update=同 family Versioned.version。 |
| `image_variant_definitions` | ImageVariantDefinition | local variant ref | family_ref + local variant id；family relation lookup | mutable；create=Absent；update=同 variant version。 |
| `assembly_baselines` | AssemblyBaseline | local baseline ref | variant_ref + captured_at + baseline local id 升序 | immutable input字段不可改；lifecycle/reason/supersede update 用同 baseline version。 |
| `variant_revisions` | VariantRevision | local revision ref | variant_ref + created_at + revision local id 升序；active pointer需 relation校验 | mutable lifecycle/pointer relation；create=Absent；update=同 revision version。 |
| `mapping_source_snapshots` | MappingSourceSnapshot | local snapshot ref | mapping_ref + captured_at + snapshot local id 升序；latest只在同 mapping_ref内选择 | body-free；create/update均版本化；不存 mapping body。 |
| `build_intents` | BuildIntent | local intent ref | revision_ref + intent local id 升序 | mutable lifecycle；create=Absent；update=同 intent version。 |
| `build_input_snapshots` | BuildInputSnapshot | local snapshot ref | revision_ref + captured_at + snapshot local id 升序 | static binding/identity不可改；lifecycle/supersede若有变化需同对象 version。 |
| `build_attempts` | BuildAttempt | local attempt ref | intent_ref + created_at + attempt local id 升序；reconcilable state index | mutable lifecycle；未知不自动重试。 |
| `build_outcome_conclusions` | BuildOutcomeConclusion | local outcome ref；同 attempt 的当前 conclusion不得歧义 | attempt_ref lookup | body-free safe conclusion；重复不一致结论=Conflict/ContractViolation。 |
| `candidate_images` | CandidateImage | local candidate ref；attempt_ref 与 immutable image ref 都不得多义 | attempt_ref lookup；immutable image ref lookup | mutable lifecycle；多 candidate 指向同 immutable image必须 fail closed。 |
| `provenance_bindings` | ProvenanceBinding | local binding ref | candidate_ref + bound_at + binding local id 升序 | versioned local relation；外部 evidence正文不入库。 |
| `gate_evaluations` | GateEvaluation | local evaluation ref | candidate_ref + evaluated_at + evaluation local id；reevaluable state index | versioned safe conclusion；empty list不等 Passed。 |
| `eligibility_decisions` | EligibilityDecision | local decision ref | candidate_ref + decided_at + decision local id；current lookup必须状态感知且无歧义 | versioned；current不由时间猜测或 gate单独推导。 |
| `artifact_handoff_records` | ArtifactHandoffRecord | local handoff ref | candidate_ref + recorded_at + handoff local id；Pending/Gap reconcile index | versioned local observation；MI-UP-007前禁止 Accepted。 |
| `availability_transitions` | AvailabilityTransition | local transition ref | variant_ref + proposed_at + transition local id 升序 | append-only；仅 Absent append；无 update/delete API。 |
| `instantiable_entries` | InstantiableEntry | local entry ref | variant_ref + created_at + entry local id；current Available / catalog index | mutable local supply entry；create=Absent，update=entry自身 version。 |
| `consumer_handoff_gaps` | ConsumerHandoffGap | local gap ref | optional entry_ref + recorded_at + gap local id；Open/Stale reconcile index | versioned；MI-UP-001前 Resolved save拒绝。 |
| `external_reference_snapshots` | ExternalReferenceSnapshot | local snapshot ref | (source_ref,use_kind) + captured_at + snapshot local id 升序 | versioned body-free snapshot；不同 use绝不互用。 |
| `contract_gaps` | ContractGap | local gap ref | affected_lane + recorded_at + gap local id；(owner,seam_kind,lane) lookup | versioned；Resolved只能带 formal resolution ref。 |
| `image_trace_records` | ImageTraceRecord | local trace ref | subject_ref + recorded_at + trace local id 升序 | append-only；无 expected version、无 update/delete。 |
| `image_read_models` | ImageDerivedReadModel | local view ref；logical key=(projection_kind,variant scope presence/ref) | exact logical key lookup；view ref lookup | derived；create/update use own view version；只能从 committed truth snapshot写入。 |
| `projection_freshness` | ProjectionFreshness | local freshness ref；每既有 view至多一个关联 marker | view_ref lookup；projection kind/variant key经 view关系定位 | derived marker；create/update use own marker version；Fresh只表示 watermark对齐。 |
| `image_idempotency_records` | ImageIdempotencyRecord | local record ref；normalized `(channel, operation_name, idempotency_key)` 唯一 | 复合 key exact lookup；stable input ref 用于 same-key match | Reserved/Completed/Conflict technical state；同 key不同 channel/name/input=Conflict，不覆盖旧 record。 |
| `stored_image_operation_results` | StoredImageOperationResult + future closed replay body | stored result local ref；ImageOperationResultRef唯一 | result_ref exact lookup；operation/kind consistency check | immutable after save；必须先于 reservation complete；当前 B02 前不得写入。 |
| 无 logical store | outbox、publisher、delivery、event payload、consumer receipt、job run/report/evidence、external raw body、live state | 不适用 | 不适用 | 严格不存在；不得以 trace/result/gap/entry替代。 |

### 5.3 Store 契约停审记录

| 审查项 | 结论 | 处置 / 仍有限制 |
|---|---|---|
| 本仓 owner 与外部 owner 是否分开 | `pass` | 所有外部值只以 typed body-free ref、安全结论、local gap或安全 marker落库。 |
| static template/seed 与 live state 是否分开 | `pass` | baseline/snapshot只收 pin、template ref、placement、base；live memory/checkpoint/workspace、container/runtime状态被拒绝。 |
| logical store 是否避免物理产品选择 | `pass` | 不写 DB/DDL/migration；实施时 durable/fake只能实现等价语义。 |
| append-only 是否清楚 | `pass_with_open_alignment` | trace严格 append-only。availability transition只允许 append；若未来需要将已提交 Proposed 跨 UoW 改为 Committed/Rejected/Superseded，现有 port不允许 update，必须先重开 Step 7/10决定 append-only terminalization模型。当前写路径为零，因此不得猜补。 |
| projection 是否保留 truth 方向 | `pass` | 写 view必须从 CommittedImageTruthSnapshotPort；query不创建/刷新/rebuild。 |
| outbox/publisher 是否没有被机械引入 | `pass` | MI-UP-009未闭合，相关 logical store和函数 inventory为零。 |

## 6. Repository、UoW 与 adapter 的持久化语义

### 6.1 Shared application technical port

| 函数 | 持久化语义 | 返回 / 失败纪律 |
|---|---|---|
| ImageClockPort::now | 只为本地记录生成 recorded/captured/transition/rebuild 时间；不读取或持久化外部完成时间。 | clock failure 映射为安全的 application failure；不得以 DB default、event time 或 runtime 状态替代。 |
| ImageIdGeneratorPort::new_local_id | 只生成 opaque local identity；调用方再交给相应 domain factory 和 typed ref。 | ID 冲突由目标 store 的主键/unique guard 检出；repository 不得自行补生成。 |
| ImageUnitOfWorkManager::begin | 只接受 ReadWrite boundary、非空且合法的 local mutable_kinds；生成唯一 ImageTransactionRef。 | Query 或不匹配 boundary 必须拒绝；begin 未成功前不得有 staged write。 |
| ImageUnitOfWorkManager::commit | 原子发布同一 UoW 已 staged 的 local truth、append、existing freshness、result 与 reservation completion。 | 任一 store / version / contract failure 则不产生部分可见提交；外部 ACK 不是 commit 条件。 |
| ImageUnitOfWorkManager::rollback | 丢弃同一 UoW 全部 staged local write。 | rollback 后 query、其他 UoW 与 duplicate replay均不可读到 staged object、trace、marker、result 或 reservation。 |
| ImageOperationInputCanonicalizerPort::canonicalize | 不持久化 input body；只在每个 write protocol 已闭合时给出 StableOperationInputRef。 | DDD-S9-B01 未解除，当前不得调用，也不得用 digest/tag/timestamp 代替输出。 |

同一 UoW 的 repository 写入必须校验 transaction_ref、ReadWrite mode 与 mutable_kinds；read port 不得借由隐含全局 transaction、thread-local fake map 或 entry context 绕过这三个约束。Repository 的 read-only get/list 只读取 committed 数据；同一 write operation 必需读取自己刚 reserve 的 record 时，adapter 必须提供同 UoW 的 read-your-own-staged-write 语义，不能捏造 version=1 或用私有 map 绕过 version 规则。

### 6.2 DefinitionAssemblyRepositoryPort

| 函数签名组 | key、排序与写入语义 | 返回 / 禁止事项 |
|---|---|---|
| get_family_with_version(family_ref)；get_variant_with_version(variant_ref)；get_baseline_with_version(baseline_ref)；get_revision_with_version(revision_ref)；get_mapping_snapshot_with_version(snapshot_ref) | exact typed local ref 是唯一键；只读返回 Option<Versioned<T>>。 | missing=Ok(None)；wrong kind=ContractViolation；不得按裸 ID、label 或 external ref fallback。 |
| find_family_by_name_with_version(family_name) | family_name 为已验证 exact local business key；逻辑唯一。 | no match=None；多条=ContractViolation；不得任取第一条、模糊匹配或 private normalization。 |
| find_active_revision_by_variant_with_version(variant_ref) | 读取 family/variant 已持久化的 current/active relation；关联 target 必须存在且 variant 一致。 | no pointer=None；坏 pointer/relation=ContractViolation；不得从 newest history 猜 active。 |
| find_latest_mapping_snapshot_by_source_with_version(mapping_ref) | 只在同一 body-free mapping_ref 范围内，按 captured_at、snapshot local id 升序选最新 local snapshot。 | local history缺失=None；不得读取 Method Library 或 mapping body。 |
| list_variants_by_family(family_ref,page) | 以 family_ref 限域，按 local variant id 升序稳定分页。 | empty=empty page；不得全库 scan 或从 family label推范围。 |
| list_baselines_by_variant(variant_ref,page) | 以 variant_ref 限域，按 captured_at、baseline local id 升序。 | 返回 immutable baseline history；不访问 pin/seed/base正文。 |
| list_revisions_by_variant(variant_ref,page)；list_buildable_revisions(page) | 前者按 created_at、revision local id 升序；后者只列已持久化 Buildable revision，且 page 必须显式。 | empty 不等 build success；不得作为 scheduler cursor、默认 batch 或全表 scan。 |
| save_family(family,expected,uow)；save_variant(variant,expected,uow)；save_revision(revision,expected,uow) | 新建=Absent；既有对象=同对象 Versioned.version。family/variant relation、current revision pointer 需要被同一 flow 更新时，相关 object 必须各自带版本并处于同一 UoW。 | duplicate / stale=VersionConflict；不得 upsert、silent merge 或由 store更新 pointer。 |
| save_baseline(baseline,expected,uow) | baseline的 component_pins、seed_bindings、base_image_ref、mapping_snapshot_ref、captured_at 和 input identity 一经创建即不可变；后续仅允许 domain transition 已产生的 lifecycle/reason/supersede变化。 | 修改 immutable input=ContractViolation；新输入必须 new baseline + supersede。 |
| save_mapping_snapshot(snapshot,expected,uow) | 只保存 mapping_ref、safe conclusion、validity、reason、captured_at 等本仓 body-free observation。 | 不得写 RoleDefinition、mapping body、role count、method asset或外部 response。 |

### 6.3 BuildCandidateRepositoryPort

| 函数签名组 | key、排序与写入语义 | 返回 / 禁止事项 |
|---|---|---|
| get_intent_with_version(intent_ref)；get_snapshot_with_version(snapshot_ref)；get_attempt_with_version(attempt_ref)；get_outcome_with_version(outcome_ref)；get_candidate_with_version(candidate_ref) | exact typed local ref read，返回 Option<Versioned<T>>。 | missing=None；不以 job action、event body、tag、registry cache 或 immutable image ref代替 exact subject。 |
| list_intents_by_revision(revision_ref,page)；list_snapshots_by_revision(revision_ref,page) | 分别按 intent local id、captured_at/snapshot local id 升序；revision 只界定本仓 local context。 | empty page 不创建 intent/snapshot，也不调用 external builder。 |
| list_attempts_by_intent(intent_ref,page)；list_reconcilable_attempts(page) | 前者按 created_at、attempt local id 升序；后者只枚举既有 Pending/Unknown 的 local attempt，顺序仍稳定。 | list 不具有 retry、submit 或 provider 查询副作用。 |
| find_outcome_by_attempt_with_version(attempt_ref) | 每 attempt 的当前安全 outcome 只能由 exact relation定位。 | absent=None；不得从 ACK、HTTP 2xx、tag 或 registry presence合成 outcome。 |
| find_candidate_by_attempt_with_version(attempt_ref)；find_candidate_by_image_with_version(image_ref) | attempt 和 immutable image 都是 exact local lookup key；image_ref lookup 必须检测多义。 | 无 candidate=None；同 immutable image多 candidate=ContractViolation；不接裸 digest/Artifact ref。 |
| save_intent(intent,expected,uow)；save_attempt(attempt,expected,uow)；save_candidate(candidate,expected,uow) | create=Absent；existing lifecycle/supersede/terminal update=corresponding same-object version。 | 不得自动 retry Unknown、修改 factory input或把 safe adapter observation直接升级 candidate。 |
| save_snapshot(snapshot,expected,uow) | captured static bindings 与 BuildInputIdentity immutable；store 只能保存完整 factory 值。 | 禁止补 pin、seed、base、digest、live state或从 baseline临时重建。 |
| save_outcome(outcome,expected,uow) | outcome 是 body-free local conclusion；同 attempt 的重复不同结论必须 fail closed。 | 不持久化 raw execution/provider body；不由 store计算 result kind。 |

### 6.4 QualificationRepositoryPort

| 函数签名组 | key、排序与写入语义 | 返回 / 禁止事项 |
|---|---|---|
| get_provenance_with_version(binding_ref)；get_gate_evaluation_with_version(evaluation_ref)；get_eligibility_with_version(decision_ref)；get_artifact_handoff_with_version(handoff_ref) | exact typed local ref read，返回 Option<Versioned<T>>。 | missing=None；不得从 candidate/ref/body反向构造相应对象。 |
| list_provenance_by_candidate(candidate_ref,page)；list_gate_evaluations_by_candidate(candidate_ref,page)；list_eligibility_by_candidate(candidate_ref,page)；list_artifact_handoffs_by_candidate(candidate_ref,page) | 各自按 bound/evaluated/decided/recorded 时间再 local id 升序；只返回同 candidate local chain。 | relation不一致=ContractViolation；不枚举 Governance inventory、evidence body 或 Artifact storage。 |
| list_reevaluable_gate_evaluations(page)；list_reconcilable_artifact_handoffs(page) | 只返回已持久化 pending/blocked/unknown evaluation，或 Pending/Gap handoff observation；稳定分页。 | empty 不等 gate passed、eligibility eligible 或 Artifact accepted。 |
| find_current_eligibility_by_candidate_with_version(candidate_ref) | 只有已持久化、关系一致、符合 current eligibility 语义的 local decision可返回。 | none/non-eligible=None；不得从 GateEvaluation、adapter availability 或 config推 Eligibility。 |
| save_provenance(provenance,expected,uow)；save_gate_evaluation(evaluation,expected,uow)；save_eligibility(decision,expected,uow) | create=Absent；任何既有 object 的 lifecycle/reason/relation更新=同对象版本。 | 所有外部依据只保存 ref/conclusion；不得写 evidence/gate/policy正文。 |
| save_artifact_handoff(handoff,expected,uow) | 只保存本仓 handoff observation；MI-UP-007 未闭口时值域限 Pending/Gap。 | Accepted、Artifact version/lineage/ref mint 或 owner confirmation必须拒绝。 |

### 6.5 SupplyEntryRepositoryPort

| 函数签名组 | key、排序与写入语义 | 返回 / 禁止事项 |
|---|---|---|
| get_availability_transition_with_version(transition_ref)；list_availability_history_by_variant(variant_ref,page) | transition exact read；history按 proposed_at、transition local id 升序且不可重排。 | get 可用于解释/guard；list不从 consumer/container/registry读取。 |
| load_current_availability_facts(variant_ref) | 从 committed local entry与transition history构造 CurrentAvailabilityFacts。 | 没有 current entry/history=合法 empty facts，不等 Available；不得读取 consumer confirmation、launch 或 health。 |
| append_availability_transition(transition,Absent,uow) | 只能 append 一个由 domain 已完成本次 local action判断的 transition；primary key 必须不存在。 | expected 非 Absent、重复 transition、update/delete 一律拒绝。 |
| get_entry_with_version(entry_ref)；find_current_entry_by_variant_with_version(variant_ref)；list_entries_by_variant(variant_ref,page)；list_available_entries(page) | exact / current / history / catalog 分开；entry history按 created_at、entry local id 升序，available catalog按 variant local ref、entry local id 升序。 | current local Available=None 不等 Artifact/consumer/container failure；不得用 latest/tag/health补 entry。 |
| save_entry(entry,expected,uow) | create=Absent；publish/supersede/retire等既有 entry状态变化用 entry自身 version。 | store不自行执行 guard、entry pin、consumer handoff或 auto-repair。 |
| get_consumer_handoff_gap_with_version(gap_ref)；list_consumer_handoff_gaps(entry_ref,page)；list_reconcilable_consumer_handoff_gaps(page) | exact/ref-scoped/explicit schema-level None scope均须稳定排序；reconcile只列 Open/Stale local gap。 | 不扫描 Member Service truth；None entry scope不等全局 consumer scan。 |
| save_consumer_handoff_gap(gap,expected,uow) | create=Absent；existing gap更新用自身 version。 | MI-UP-001未闭口时 Resolved 必须拒绝；不能持久化 manifest、instance、host、container或 confirmation。 |

AvailabilityTransition 的 persistence gap 必须显式保留：现有 port 只允许 append，而 Step 10 允许既有 transition 被 supersede。因而未来 implementation 只能在**首次 append 前**将 Proposed 归结为本次完整 transition；任何跨 UoW 的 transition update 或 supersede persistence 都没有已定义的 save surface。此处登记为 DDD-S11-B03，必须在实际启用 supply mutation 前重开 Step 7/10；不得用 delete/reinsert、silent overwrite 或 entry 状态替代历史更新。

### 6.6 ReferenceDerivedRepositoryPort

| 函数签名组 | key、排序与写入语义 | 返回 / 禁止事项 |
|---|---|---|
| get_external_snapshot_with_version(snapshot_ref)；get_contract_gap_with_version(gap_ref) | exact typed local ref read，返回 Option<Versioned<T>>。 | missing=None；不得按 external source string、cache 或 owner body猜 local ref。 |
| find_latest_external_snapshot_by_source_and_use_with_version(source_ref,use_kind)；list_external_snapshots_by_source_and_use(source_ref,use_kind,page) | (OpaqueReference,ReferenceUseKind) 是完整 business key；history按 captured_at、snapshot local id 升序。 | 不同 use_kind绝不互用；latest不触发 external resolve。 |
| list_open_gaps_by_lane(lane,page)；list_gaps_by_boundary(owner,seam_kind,lane,page) | lane 或 owner+seam+lane必须显式；按 recorded_at、gap local id 升序。 | 不以 generic ready flag、consumer text或 adapter slot推 owner/lane。 |
| save_external_snapshot(snapshot,expected,uow)；save_contract_gap(gap,expected,uow) | create=Absent；existing validity/lifecycle/reason/supersede/resolution update使用同对象 version。 | snapshot不可从 Stale/Conflict/Unavailable 原地变 Valid；gap Resolved 必须带 formal resolution ref。 |
| get_trace(trace_ref)；list_trace_by_subject(subject_ref,page) | trace exact read或按 LocalObjectRef 限域；list按 recorded_at、trace local id 升序。 | trace source可以含 external opaque ref，但 external ref不能作为 local subject lookup key。 |
| append_trace(trace,uow) | 只追加 factory 完整、typed subject/source/correlation 的 record。 | 无 expected version；禁止 update/delete、raw payload/log、或从 trace 重建缺失 truth。 |

### 6.7 Projection 与 idempotency/replay port

| 函数签名组 | key、排序与写入语义 | 返回 / 禁止事项 |
|---|---|---|
| CommittedImageTruthSnapshotPort::load_committed_truth_snapshot(key) | 只能读已 committed 的本仓 DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived truth与 local watermark；key=ProjectionKind+optional typed variant scope。 | no source=None；不得由 view/cache/fake private map、owner body或 adapter response重建。 |
| find_read_model_ref_by_key(key)；get_read_model_with_version(view_ref)；get_projection_freshness_with_version(freshness_ref)；find_freshness_by_read_model_with_version(view_ref) | 先 key→existing view ref，再 view→existing freshness；read model与marker都是 exact local relation。 | missing=None，不默认 Fresh、不拼 view ref、不由 query创建。 |
| list_existing_views_affected_by_subject(subject_ref,page) | 从正式 dependency relation列既有 view refs；empty page=no-op。 | 不按 string/ref/config临时派生 public-facing view identity。 |
| save_read_model(view,expected,uow)；save_projection_freshness(marker,expected,uow) | 初次 materialization 可在同一 rebuild UoW 以两个 Absent object创建；existing view/marker分别使用自己的 Versioned.version。 | view只能从 committed truth snapshot写入；marker不能反写 truth；Unavailable 无恢复写法。 |
| reserve(context,stable_input_ref,uow) | 在同一 write UoW 内以 normalized idempotency key 检查唯一 reservation；same channel/name/stable input=Duplicate，任一不同=Conflict。 | Query禁止调用；当前 B01/B02 下禁止调用；不得把 stable ref当 image/artifact digest。 |
| get_record_with_version(record_ref) | 精确读取 reservation；future same-UoW reserve 后为 complete 获取 record 和 version。 | 缺失=None；外部 read只见 committed record；不得用 idempotency key构造 version。 |
| save_stored_result(result,replay_body,uow)；get_stored_result(result_ref)；get_replay_body(result_ref) | result_ref唯一；shell与 replay body的 operation_name/result_kind 必须一致；写后 immutable。 | body缺失/错配=StoredResultMissing/ContractViolation；current B02 前不得写 body或伪造 ref。 |
| complete(record,expected,result_ref,uow) | 仅 Reserved record；expected来自 get_record_with_version 返回的同 record version；result必须已 staged/saved in same UoW。 | result先于complete；complete后不得再写 domain/trace/projection/result；冲突不覆盖旧 record。 |

### 6.8 External / entry port 的持久化边界

| port 组 | 能否直接写本仓 store | 事务关系 |
|---|---:|---|
| assembly reference resolver、builder/registry、qualification/Artifact、Member Service supply | 否 | adapter call 不在 local UoW commit 内；若 future flow 得到可用的安全结论，必须开启或重读一个 local UoW、versioned reload/revalidate 后才可保存本仓 consequence。 |
| ImageEntryBoundaryPort::inspect_inbound_boundary | 否 | 当前只读取/映射 marker；accepted_input=false，不能创建 reservation、receipt、snapshot、gap、trace或truth。 |
| ImageEntryBoundaryPort::inspect_job_action_boundary | 否 | 当前 Declared/Blocked/ReopenRequired 仅为内存 disposition；不创建 scheduler、run、report、lease、cursor或 local write。 |
| inbound/outbound transport、publisher、delivery | 不存在 | MI-UP-005阻断 accepted inbound；MI-UP-009下 outbound inventory严格为零。 |

### 6.9 Step 7 全部 repository 函数覆盖矩阵

下表逐一覆盖 Step 7 中除 external adapter 与 entry inspection 之外的 repository 函数；每个函数均已在 §6.2~§6.7 给出具体 key、版本、分页或 append 语义。该矩阵用于防止“只写 save、不写 read”或 implementation 端自行添加函数。

| Port | 函数覆盖 | 语义定位 |
|---|---|---|
| DefinitionAssemblyRepositoryPort | `get_family_with_version`、`find_family_by_name_with_version`、`save_family`、`get_variant_with_version`、`list_variants_by_family`、`save_variant`、`get_baseline_with_version`、`list_baselines_by_variant`、`save_baseline`、`get_revision_with_version`、`find_active_revision_by_variant_with_version`、`list_revisions_by_variant`、`list_buildable_revisions`、`save_revision`、`get_mapping_snapshot_with_version`、`find_latest_mapping_snapshot_by_source_with_version`、`save_mapping_snapshot` | §6.2：exact/business-key read、stable page、Absent/Exact save、immutable baseline 与 body-free mapping。 |
| BuildCandidateRepositoryPort | `get_intent_with_version`、`list_intents_by_revision`、`save_intent`、`get_snapshot_with_version`、`list_snapshots_by_revision`、`save_snapshot`、`get_attempt_with_version`、`list_attempts_by_intent`、`list_reconcilable_attempts`、`save_attempt`、`get_outcome_with_version`、`find_outcome_by_attempt_with_version`、`save_outcome`、`get_candidate_with_version`、`find_candidate_by_attempt_with_version`、`find_candidate_by_image_with_version`、`save_candidate` | §6.3：intent/snapshot/attempt/outcome/candidate 分离、unknown 不盲重试、safe outcome 不升级 candidate。 |
| QualificationRepositoryPort | `get_provenance_with_version`、`list_provenance_by_candidate`、`save_provenance`、`get_gate_evaluation_with_version`、`list_gate_evaluations_by_candidate`、`list_reevaluable_gate_evaluations`、`save_gate_evaluation`、`get_eligibility_with_version`、`find_current_eligibility_by_candidate_with_version`、`list_eligibility_by_candidate`、`save_eligibility`、`get_artifact_handoff_with_version`、`list_artifact_handoffs_by_candidate`、`list_reconcilable_artifact_handoffs`、`save_artifact_handoff` | §6.4：local qualification chain、pending evaluation/handoff、Q-MI-004/MI-UP-007 fail closed。 |
| SupplyEntryRepositoryPort | `get_availability_transition_with_version`、`list_availability_history_by_variant`、`load_current_availability_facts`、`append_availability_transition`、`get_entry_with_version`、`find_current_entry_by_variant_with_version`、`list_entries_by_variant`、`list_available_entries`、`save_entry`、`get_consumer_handoff_gap_with_version`、`list_consumer_handoff_gaps`、`list_reconcilable_consumer_handoff_gaps`、`save_consumer_handoff_gap` | §6.5：append-only availability、entry/version、consumer gap；不访问 container/consumer truth。 |
| ReferenceDerivedRepositoryPort | `get_external_snapshot_with_version`、`find_latest_external_snapshot_by_source_and_use_with_version`、`list_external_snapshots_by_source_and_use`、`save_external_snapshot`、`get_contract_gap_with_version`、`list_open_gaps_by_lane`、`list_gaps_by_boundary`、`save_contract_gap`、`get_trace`、`list_trace_by_subject`、`append_trace` | §6.6：source+use key、lane-scoped gap、append-only trace；不存 raw body。 |
| ImageProjectionRepositoryPort / CommittedImageTruthSnapshotPort | `load_committed_truth_snapshot`、`find_read_model_ref_by_key`、`get_read_model_with_version`、`get_projection_freshness_with_version`、`find_freshness_by_read_model_with_version`、`list_existing_views_affected_by_subject`、`save_read_model`、`save_projection_freshness` | §6.7：committed truth→projection、existing identity、freshness marker、query no-write。 |
| ImageIdempotencyRepositoryPort | `reserve`、`get_record_with_version`、`save_stored_result`、`complete`、`get_stored_result`、`get_replay_body` | §6.7：reserve→result→complete，duplicate replay only；B01/B02 前零调用。 |

`ImageClockPort::now`、`ImageIdGeneratorPort::new_local_id`、`ImageUnitOfWorkManager::{begin,commit,rollback}` 也已在 §6.1 覆盖。Step 7 的 external `inspect_*` / `submit_handoff` / `assess_*` / `get_slot_availability` 函数不属于 repository persistence；其“不直接写 store、外部调用与 local commit 解耦”规则见 §6.8。

## 7. 事务边界与函数级处理顺序

### 7.1 事务边界总表

| 场景 | 开始位置 | 提交位置 | 回滚条件 | 同事务内必须完成 |
|---|---|---|---|---|
| Command accepted（future/reopen） | application command facade 完成 DTO validation、canonicalization、`ImageUnitOfWorkManager::begin(ReadWrite)` 后 | 所有 local truth、required trace/gap/freshness、stored result/replay body 与 reservation complete 均成功后 | canonical input、exact load、domain guard、version、任何 local save/append、result 或 complete 失败 | reserve → exact versioned reads → domain transition/factory → local saves → append trace（若 flow 要求）→ existing affected-view/freshness update（若有）→ save stored result → complete reservation → commit。 |
| Command rejected after reserve（future/reopen） | reserve 成功且尚未写 accepted truth | rejection result 保存并 complete 后 | rejection result/body、version 或 transaction failure | reserve → body-free rejection result → save stored result → complete → commit；不得 truth cursor、history、trace、outbox 或 projection repair。 |
| Command duplicate/conflict | reserve 返回 Duplicate/Conflict | duplicate 不提交业务写；conflict 是否保存 marker 由后续 Step 13 定义 | stored replay 缺失/错配、transaction boundary failure | Duplicate：rollback 当前 UoW → exact stored shell/body read → replay；Conflict：不执行 domain mutation，不覆盖原记录。 |
| Query | query validation 后直接进入 read port | 无 write commit | read repository / visibility / relation failure | exact get/list/projection marker read → mapper；不 begin ReadWrite、不 reserve、不创建/刷新 projection/gap/trace/result。 |
| Conditional inbound 当前流 | marker handler 调用 `inspect_inbound_boundary` | 无 commit | marker/port unavailable、name mismatch | marker inspection → `accepted_input=false` safe disposition；不 parse payload、不 begin UoW。 |
| Conditional inbound future accepted（仅 owner contract 关闭后） | worker/application facade 在 envelope/schema/authority validation 后 | local snapshot/reference marker、optional trace、stored receipt/replay 与 reservation complete 成功后 | schema/dedup/resolver/version/local save/result failure | reserve → parse allowed body-free payload → save reference/snapshot or local marker → mark existing affected views stale（如 flow 明确）→ save stored disposition/receipt → complete → commit；不创建 sibling truth。 |
| Bounded Job future mutation | job facade 完成 action/scope/page validation 后 | item local effect 与 stored job disposition/replay 同 UoW commit | scope expansion、adapter observation、version、item save、result/complete failure | reserve → explicit page/exact target → per-item versioned read/guard → local effect only → save result → complete → commit；不 scheduler/run/report/evidence。 |
| Projection rebuild item future | `RebuildImageDerivedViews` facade 选定既有 projection key 后 | view、freshness 与 existing relation/index 更新成功后 | committed truth snapshot missing、target relation/version conflict、view assembly failure | read committed truth → existing view/marker lookup → rebuild from truth → save view/marker with versions → commit；失败保留 source truth，写安全 stale/unavailable 只在已有 marker可更新时执行。 |

### 7.2 Future Command/Job 通用顺序

仅在 B01/B02 与对应 owner contract 解除、且 Step 12~13 重新闭合后，允许按以下顺序实现写路径：

~~~text
validate protocol input and OperationMetadata
-> map to concrete CanonicalImageOperationInput
-> ImageOperationInputCanonicalizerPort::canonicalize
-> ImageOperationContext::from_write
-> ImageUnitOfWorkManager::begin(ReadWrite)
-> ImageIdempotencyRepositoryPort::reserve
   Duplicate: rollback -> get_stored_result -> get_replay_body -> return replay
   Conflict: no domain mutation; apply later conflict policy
-> exact typed local reads returning Versioned<T>
-> external safe seam call only when this flow declares it
-> domain factory/member/guard and state transition
-> save each changed local object with Absent or Exact(same-object version)
-> append ImageTraceRecord only where flow inventory requires
-> update only existing affected projection/freshness rows
-> save StoredImageOperationResult + closed replay body
-> ImageIdempotencyRepositoryPort::complete
-> ImageUnitOfWorkManager::commit
~~~

关键顺序约束：

- `reserve` 必须在任何 domain mutation、external call 或 page selection之前；Duplicate 不得重跑。
- 所有 mutable existing save 都必须先 exact-load 同对象的 `Versioned<T>`；多个对象关系更新时各自使用各自版本，但共用一个 UoW。
- `save_stored_result` 必须早于 `complete`；`complete` 后不允许继续产生 domain、trace、projection 或 adapter side effect。
- 任何失败都回滚 staged local writes；rollback 后不向 query、其他 UoW 或 replay 暴露半成品。
- 具体 flow 若没有正式 outbound payload，effect 中没有 outbox ref；当前所有 flow 均无 outbox。

### 7.3 读侧与条件入口顺序

| 入口 | 固定顺序 | 不得发生 |
|---|---|---|
| direct truth Query | validate selector/page → exact local repository read → map public view | begin write UoW、reserve、trace/gap/projection mutation、external refresh。 |
| projection-backed Query | validate key → `find_read_model_ref_by_key` → get view + freshness → apply RequireFresh/InspectMarker policy → map response | 从 variant/ref/cursor 拼 view identity；missing 时创建 view 或 rebuild。 |
| list/history Query | validate explicit typed scope/page → one matching list port → stable page map | full scan、跨 owner 合并、以 cursor代 version、空页转成 ready/pass。 |
| current inbound marker | select named marker → `inspect_inbound_boundary` → safe result | payload parse、dedup/reservation、receipt、snapshot/gap/truth write。 |

### 7.4 Projection failure与恢复边界

| 失败 | 保留什么 | 允许写什么 | 禁止什么 | 当前状态 |
|---|---|---|---|---|
| committed truth snapshot unavailable | 已提交 source truth 与既有 view | 若已有 freshness marker且 Step 10 transition允许，可 versioned 标记 `Unavailable`/`Stale`；没有正式 recovery function 时只返回安全失败 | query 代替 rebuild、从旧 view/cache补 truth、删除 source truth | `PF-UNAVAILABLE-RECOVERY` pending。 |
| view assembly / version conflict | source truth 与旧 view/marker | 记录 bounded job safe failure；若已有 marker可安全标 stale/unavailable | 部分替换 view、强行覆盖版本、把旧 view标 Fresh | future/reopen。 |
| query projection missing | local truth 不被修改 | 返回 missing/degraded/unavailable surface | query 创建 read model、mint view ref、默认 Fresh | current read-only。 |

## 8. 一致性策略、失败处理与反例

### 8.1 一致性策略表

| 一致性关注 | 正式策略 | 校验 / 测试切口（不代表已执行） |
|---|---|---|
| object update | optimistic version；同对象 `Versioned<T>.version` → `ExpectedLocalObjectVersion::Exact` | stale writer 返回 VersionConflict；不得 last-write-wins。 |
| object create | Absent + primary/unique key check | duplicate create fail closed；不得 upsert。 |
| cross-object relation | application 先读取所有相关 versions，在一个 UoW stage relation-compatible values，再 commit | family↔variant、variant↔revision、candidate↔attempt、entry↔transition、view↔freshness mismatch 拒绝。 |
| immutable input | baseline/snapshot/pin/seed/base/input identity 与 stored result shell identity不可变 | 改输入必须新 context + supersede；不得原地 append input。 |
| append-only history | trace 不 update/delete；availability transition 只允许 Absent append | history id conflict、delete/update API 不存在；supersede gap 见 DDD-S11-B03。 |
| projection | committed local truth 作为唯一 rebuild source；既有 projection identity 由 repository index取得 | query no-write；rebuild watermark exact match 才能 Fresh。 |
| external snapshot | source+declared use 是完整 key；不同 use不复用 | source body、cache、external revision不能替代 local snapshot/version。 |
| gap visibility | gap owner/seam/lane 显式、只冻结受影响 lane | 不以 global ready flag、adapter availability、ACK 或 fake关闭 gap。 |
| replay | key/channel/name/stable input相同才 Duplicate；stored shell/body先保存后 complete | duplicate no domain/adapter/page scan；missing replay result=consistency failure。 |
| external call | external call 与 local commit 解耦；safe conclusion经 local reload/revalidate后才落库 | 不将 ACK、2xx、registry presence、consumer observation 当 commit evidence。 |
| current positive lanes | MI-UP-001/005/007/009、Q-MI-003/004 与 B01/B02 未闭合 | 不写 Resolved/Accepted/Eligible/Available 的 owner-side含义，不写 positive readiness。 |

### 8.2 失败/恢复表（详细重试策略留 Step 12/13）

| 失败类别 | 本地结果 | 是否回滚 local truth | 恢复交接 |
|---|---|---:|---|
| validation / typed-ref / UoW mode violation | ContractViolation/Domain safe error | 是（若已 begin） | Step 12 定义协议错误映射；不得补默认值。 |
| missing exact local object | None/NotFound 按 flow 语义 | 是 accepted path | Step 12 定义 missing vs blocked；不从 history猜对象。 |
| optimistic VersionConflict | VersionConflict | 是当前 UoW | Step 12/13 定义回报/重入；不得自动覆盖或无界重试。 |
| local repository failure | Unavailable/TransactionBoundary | 是当前 UoW | 保留已提交旧 truth；由后续恢复设计决定 retry/alert。 |
| external safe seam unavailable/blocked | Unavailable/Blocked/local Gap | 依 flow：未保存 accepted truth时回滚；已提交 truth不倒退 | 不写 owner body/confirmation；只可保存明确 local gap（future且有合法 result/replay时）。 |
| duplicate with valid replay | stored replay response | 当前 UoW回滚 | 不重跑 domain、adapter、scan、rebuild。 |
| duplicate with missing/mismatched replay | StoredResultMissing/ContractViolation | 是 | Step 12 定义 repair/incident；禁止重算旧结果。 |
| projection rebuild failure | stale/unavailable marker 或 bounded failure | 不回滚 source truth | PF-UNAVAILABLE-RECOVERY 需后续定义正式恢复函数。 |
| current inbound marker-only | safe Unavailable/Rejected/ReopenRequired，accepted_input=false | 无写可回滚 | 等 MI-UP-005 重开 worker protocol。 |
| availability transition terminalization gap | current port 不可更新既有 transition | 不进行猜测 mutation | DDD-S11-B03 重开 Step 7/10 再定 append-only terminalization。 |

### 8.3 明确禁止的反例

~~~text
❌ 用 page cursor、external revision、timestamp、tag、digest 或 idempotency key 作为 ExpectedLocalObjectVersion
❌ repository.save_* 看到对象不存在就自动 upsert，或看到 version 冲突就 last-write-wins
❌ query 为了满足 RequireFresh 创建 projection、刷新 snapshot、写 gap 或 reserve replay
❌ duplicate 重新执行 domain transition、adapter call、job page scan 或 rebuild
❌ projection/cache/fake/private map 作为 CommittedImageTruthSnapshot 来源
❌ 把 ImageTraceRecord、AvailabilityTransition、StoredImageOperationResult 当 outbound event / delivery receipt
❌ 用 local InstantiableEntry::Available 证明 Member Service confirmation、container launch 或 health
❌ 用 ACK、2xx、registry presence、tag、latest 或 adapter slot availability 形成 Candidate/Eligible/Available
❌ 将 Role/mapping/component/seed/policy/memory/workspace/Artifact/consumer 正文写入本仓 store
❌ 为 MI-UP-009 创建 outbox/publisher/delivery store，或为 MI-UP-005 创建未经授权的 envelope/topic/receipt
~~~

### 8.4 Fake / durable adapter parity

| 行为 | durable adapter 与 in-memory fake 必须一致 |
|---|---|
| key / unique | exact typed ref、声明的 business key、duplicate/conflict 结果一致。 |
| version | 每次 committed mutable update 单调产生新 version；stale expected version拒绝。具体数值/算法不在此 Step指定。 |
| UoW | staged write 在 commit前对其他 UoW不可见；rollback 全部丢弃；同 UoW read-your-own-write语义一致。 |
| append-only | trace 与 availability history不可 update/delete；重复 primary key拒绝。 |
| page | 同一 scope、limit、after 得到同样稳定排序与 next cursor；cursor不当 version。 |
| projection | 只接受 committed truth snapshot；query不创建/刷新；missing/Unavailable语义一致。 |
| replay | same key/input duplicate返回同一 stored result；result缺失/错配均 fail closed；不得 fake重跑。 |
| forbidden body | 两种实现都拒绝 raw provider payload、live state、external正文、secret和未声明字段。 |

## 9. Step 6~10 闭环审计

### 9.1 对象、port、flow、state、store 对照

| Step 6 object/state family | Step 7 persistence surface | Step 9 flow / Step 10 lifecycle | Step 11 收口结论 |
|---|---|---|---|
| DefinitionAssembly：family、variant、baseline、revision、mapping snapshot | DefinitionAssemblyRepositoryPort | Define/Capture/Propose；DefinitionLifecycle、BaselineCompleteness、VariantRevisionLifecycle | local versioned truth；baseline immutable；family/variant/revision relation同 UoW；mapping body-free。 |
| BuildCandidate：intent、snapshot、attempt、outcome、candidate | BuildCandidateRepositoryPort | Request/Record/Reconcile；intent/snapshot/attempt/candidate lifecycle | stage records分开保存；safe outcome不等 candidate；Unknown无自动retry。 |
| Qualification：provenance、gate、eligibility、Artifact handoff | QualificationRepositoryPort | Evaluate/Record/Reevaluate/Reconcile；provenance/gate/eligibility/handoff lifecycle | candidate chain关系必须一致；gate/evidence/Artifact owner正文始终外置；Pending/Gap可见。 |
| SupplyEntry：availability transition、entry、consumer gap | SupplyEntryRepositoryPort | Publish/Transition/Rollback/Reconcile；transition/entry/gap lifecycle | transition append-only、entry versioned、consumer gap fail closed；transition update surface gap=B03。 |
| ReferenceDerived：external snapshot、gap、trace、freshness、read model | ReferenceDerivedRepositoryPort + Projection ports | Refresh/Rebuild/Query；reference/gap/freshness lifecycle | source/use body-free snapshot、lane scoped gap、trace append-only、projection committed-truth-only。 |
| application：idempotency/result | ImageIdempotencyRepositoryPort + UoW | all future Command/Job；ImageIdempotencyLifecycle | reserve→result→complete同 UoW；current B01/B02 使全写路径不可达。 |
| worker marker | ImageEntryBoundaryPort only | two current inbound flows；InboundContractState | marker-only、accepted_input=false、无持久化 mutation。 |

### 9.2 真相源与字段闭环

| 审计项 | 结果 | 说明 |
|---|---|---|
| object identity | pass | 每个 local object 的 ID 来自 ImageIdGeneratorPort；typed ref只由相应 object/factory产生。 |
| version source | pass | 所有 mutable existing object均只使用同 object Versioned<T>.version；append-only record没有 expected version。 |
| timestamp | pass | local time来自 ImageClockPort，不被 external time、DB default、cursor或 runtime live state替代。 |
| static/live boundary | pass | component pin、seed placement、base、mapping/input snapshot 都是 static/ref-only；live memory/checkpoint/workspace/container/runtime/tool execution被拒绝。 |
| query view source | pass | direct truth、existing projection和freshness均有 read port；Query 不保存任何结果、marker或修复。 |
| projection rebuild source | pass | 仅 CommittedImageTruthSnapshotPort；view/cache/fake不是 truth source。 |
| affected projection identity | pass_with_defer | 只有 list_existing_views_affected_by_subject 返回既有 view ref才可标脏；空页=no-op；未创建 view不补 identity。 |
| replay schema | pass_with_blocker | shell/body/read链与顺序已定义；B02 使合法 result_ref/body 构造仍不可实施。 |
| outbound boundary | pass | 任何 accepted local effect的 outbox inventory为空；未创建 payload、publisher或delivery事实。 |
| artifact materialization | pass_with_pending | 本仓仅 local handoff observation/gap；不需要也无权 materialize Artifact body、version、lineage或 acceptance。 |

### 9.3 状态与持久化闭环

| 状态规则 | persistence 结论 |
|---|---|
| terminal/replacement | family/variant/baseline/revision、attempt、evaluation、decision、entry/gap/snapshot等的 existing state更新均须 exact version；replacement context另以 Absent 创建，不能覆盖旧 object。 |
| immutable baseline/snapshot | state可变不允许 input字段可变；保存时 adapter必须拒绝字段漂移。 |
| trace | trace不拥有 lifecycle；只可 append，不能成为 state transition source。 |
| Fresh | Fresh仅是 projection watermark对齐；store不能将其转换为 eligible/available/consumer/runtime readiness。 |
| Unavailable | ProjectionFreshness::Unavailable 当前没有正式恢复函数；store必须拒绝假想 Unavailable -> Rebuilding/Fresh 写入。 |
| idempotency Completed | 必须有 matching stored result shell/replay body；missing body是 consistency defect，不能通过重跑修复。 |
| inbound marker | 三种 disposition均不可转为 accepted write；不存在 inbound receipt/store。 |

### 9.4 已发现缺口与 blocker ledger

| ID | 缺口 / blocker | 影响 | 当前纪律 | 重开前提 |
|---|---|---|---|---|
| DDD-S9-B01 | 缺 concrete CanonicalImageOperationInput 与 per-protocol mapper。 | 全部 Command/Job canonicalize、reserve、local mutation、replay。 | 当前零 UoW/zero mutation。 | 重开 Step 7/8，提供字段来源、canonical order、same-key/different-input mapping。 |
| DDD-S9-B02 | 缺合法 ImageOperationResultRef 构造与 shell/body mapper。 | stored result、complete、duplicate replay。 | 不保存 result、不 complete reservation。 | 重开 Step 6/7/8，闭合 result identity、factory、body consistency。 |
| DDD-S11-B03 | AvailabilityTransition port只有 append，而 state matrix存在已有 transition supersede/terminal update。 | supply transition跨 UoW lifecycle持久化。 | 禁止 delete/reinsert、silent overwrite或用 entry替代 history更新。 | 重开 Step 7/10，增加正式 versioned update或定义“append final record only”模型并审计 flows。 |
| MI-UP-001 | Member Service consumer contract/manifest/variant/ref/confirmation未闭合。 | ConsumerHandoffGap Resolve、handoff positive lane。 | 本仓只保存 entry和Gap/Stale local observation；拒绝 Resolved。 | owner正式合同关闭后重开 Step 7~11相应接缝。 |
| MI-UP-002/003/006 | member/component/mapping/seed/base的 release/body/compatibility contract未闭合。 | assembly baseline与revision正向 lane。 | 仅 static typed ref/safe conclusion；缺失=Incomplete/Blocked/Gap。 | owner正式 ref/compatibility contract。 |
| MI-UP-005 | inbound event authority/schema/identity/dedup/receipt未闭合。 | worker accepted persistence。 | marker-only、accepted_input=false。 | 重开 worker protocol/flow/transaction设计。 |
| MI-UP-007 | Artifact consumable ref/lineage/acceptance contract未闭合。 | ArtifactHandoffRecord Accepted。 | 仅 Pending/Gap local observation。 | L1-artifact formal handoff contract。 |
| MI-UP-009 | outbound owner/consumer/schema/delivery语义缺失。 | outbox/publisher/delivery persistence。 | inventory严格为零。 | 多 Step重开后才可新增对象、port、protocol、flow、state、store。 |
| Q-MI-003 | builder/registry产品与safe adapter未闭合。 | build observation/outcome candidate lane。 | 不保存 ACK/tag/cache为正向结果。 | controlled adapter contract。 |
| Q-MI-004 | gate/evidence inventory/priority未闭合。 | gate Passed/eligibility positive lane。 | pending/blocked/unknown local conclusion可见，不能默认 pass。 | authority/evidence contract。 |
| PF-UNAVAILABLE-RECOVERY | ProjectionFreshness Unavailable无正式恢复函数。 | projection rebuild recovery。 | query只读、store不伪造恢复边。 | Step 12~14或重开定义 function、truth source、version/UoW语义。 |

## 10. 正式 03 回填草稿（禁止当前装配）

> 对应正式章节：`03-详细设计.md` 第 10 章“数据持久化、事务与一致性契约”。  
> 写入前门禁：项目级台账必须允许正式 03 装配、文档级 flow 必须到 Step 19，且本 Step 与全部后续 Step 的正式回填均已获批准。当前条件均不满足。

本仓采用 logical store 契约，不选定数据库或 DDL。DefinitionAssembly、BuildCandidate、Qualification、SupplyEntry、ReferenceDerived 与 application replay 是本仓 local truth/maintenance owner；Role/mapping、component/seed/base正文、runtime/live state、Artifact、Member Service/container、governance 与 observability truth 均只以 typed body-free ref、安全结论或 local gap 进入。

所有已存在 mutable object 的更新必须从同一对象 `Versioned<T>.version` 取得 `ExpectedLocalObjectVersion::Exact`；新对象只可使用 `Absent`。cursor、timestamp、external revision、tag、digest、watermark、idempotency key 和 trace id 均不得代替 optimistic version。`ImageTraceRecord` 与 `AvailabilityTransition` 为 append-only；baseline/build snapshot 输入不可变；修复需新 context/supersede，不能覆盖历史。

Command/Job 的 future write path 固定为：

~~~text
canonicalize -> begin ReadWrite UoW -> reserve
-> exact versioned reads -> domain transition
-> local truth/trace/existing freshness writes
-> stored result + replay body -> complete -> commit
~~~

Duplicate 必须 rollback 当前 UoW 后读取既有 stored shell/body，绝不重跑 domain、adapter、page scan 或 projection rebuild。Query 与当前 conditional inbound marker flow 均为零写。projection 只可从 `CommittedImageTruthSnapshotPort` 的 committed local truth 重建；Query 不创建、刷新或修复 projection。外部 adapter call 不作为 local commit evidence。本仓当前没有 outbox、publisher、delivery 或 outbound persistence。

`DDD-S9-B01`、`DDD-S9-B02`、`DDD-S11-B03`、MI-UP/Q-MI 与 `PF-UNAVAILABLE-RECOVERY` 仍为显式 blocker；在其关闭前不得启用受影响的正向写路径。

## 11. Step 12 handoff

| Step 12 需要承接 | 本 Step 提供的确定输入 | 不得提前假设 |
|---|---|---|
| application error map | Domain / NotFound / VersionConflict / Unavailable / ContractViolation / IdempotencyConflict / StoredResultMissing / TransactionBoundary 的来源已定位 | SQL/HTTP/broker/provider raw error、retry policy、transport status未定义。 |
| rollback/recovery | UoW commit/rollback、append-only、projection failure、duplicate replay、B03限制已明确 | 不得以自动 retry、delete/reinsert、last-write-wins 或重跑 duplicate代替恢复。 |
| external boundary failure | adapter不参与 local atomic commit；safe blocked/unavailable/gap语义已明确 | 不得假设 builder/Artifact/Member Service/inbound/outbound owner已关闭。 |
| projection recovery | Fresh/Stale/Rebuilding/Unavailable persistence约束已明确 | `Unavailable` recovery函数尚不存在；必须先定义，再声称可恢复。 |
| current callable boundary | 当前 Command/Job零 mutation、Query只读、conditional inbound marker-only | 不得把本 Step的 future/reopen sequence误认为当前可运行实现。 |

## 12. 完成检查与停审门禁

- [x] 已按 Step 11 SOP 输出数据所有权、logical store/projection、repository函数、事务边界和一致性策略。
- [x] 已对 Step 7 的全部 repository/UoW/replay函数给出持久化语义或明确其 external/entry 非持久化边界。
- [x] 已区分 current zero-mutation 与 future/reopen UoW 顺序。
- [x] 已规定 same-object optimistic version、Absent create、append-only、immutable inputs、projection rebuild、duplicate replay 和 fake parity。
- [x] 已审计 Step 6 object、Step 8 protocol、Step 9 flow、Step 10 state matrix 的字段/状态/事务闭环。
- [x] 未创建 outbox、publisher、delivery、event payload、receipt、report、evidence、digest、run_id、Artifact 或 consumer 正向事实。
- [x] 未读取旧正式 `03-详细设计.md`，未装配正式 03，未实现代码、未运行测试、未提交 commit。
- [x] 已保留 B01/B02、B03、MI-UP、Q-MI 与 PF-UNAVAILABLE-RECOVERY blocker。

~~~text
Step 11 = completed_stop_review
gate_status = pass_with_explicit_blockers
next_allowed_action = wait_for_explicit_user_confirmation_for_step_12
formal_03_write_allowed = false
implementation_allowed = false
commit_required = false
~~~

## 13. Step 完成记录

| 项目 | 记录 |
|---|---|
| 完成时间 | 2026-08-30 |
| 完成状态 | `completed_stop_review` |
| 已形成材料 | 数据所有权、logical store、repository/UoW语义、transaction、consistency/recovery、cross-Step audit、回填草稿与 blocker ledger。 |
| 用户确认要求 | 必须等待用户明确确认后才可创建并进入 `03_ddd_step_12_error_recovery.md`。 |
