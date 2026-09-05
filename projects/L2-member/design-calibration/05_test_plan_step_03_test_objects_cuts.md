# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节：`projects/L2-member/05-测试方案.md` §3「测试对象与测试切口」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_03_test_objects_cuts.md`
> 状态口径：本文只记录 planned、local、negative 和 blocked-aware 测试设计，不代表测试执行、证据、验收或 readiness。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3：抽取测试对象与测试切口 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 输入基线 | `05_test_plan_step_02_scope.md`；当前正式 `03-详细设计.md` §5~§15；`03_ddd_step_16_test_cuts.md`；`04-配置设计.md` §12 |
| 输出文件 | `projects/L2-member/design-calibration/05_test_plan_step_03_test_objects_cuts.md` |
| 回填位置 | 正式 `05-测试方案.md` §3（仅 Step 15 装配时回填） |
| 停审方式 | P0 切口逐组完成停审；跨切口审计完成后，按本轮“完成全部 05”授权进入 Step 4 |

## 2. 本步目标

从当前正式概要 / 详细设计中抽取必须验证的对象、协议、状态、事务、一致性、错误、配置和观测对象，并将它们收敛为可回指设计真相源的测试切口。本 Step 不生成具体 TC 编号、fixture、测试数据、CI suite、artifact、report 或正式 EV 编号。

本 Step 必须回答：

1. 哪些 domain object、policy、application service、Port / Store、adapter、entry、worker 和 Job 进入测试对象。
2. 10 个 Command、16 个 Query、14 个 Consumer、24 个 outbound semantic candidate、5 个 Job 如何分组。
3. 28 个正式状态主语、UoW / CAS / append-only / replay / commit-unknown / partial isolation 如何形成独立切口。
4. 缺字段、双锚冲突、DTO 构造失败、forbidden body、错误 source、错误 digest、旧状态名和 phase 越界如何被显式测试。
5. 每个 P0 切口是否有正式设计来源、具体风险和建议发现层级；受 blocker 的正向 lane 如何保持 blocked-aware。

## 3. 本步输入

| 输入 | 效力 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已完成直接输入 | 固定 P0 / P1 / P2、非范围、VF 关联和外部接缝口径 |
| `03-详细设计.md` §5~§6 | 当前正式设计 | 抽取七模块、34 个 domain 对象和 supporting carrier |
| `03-详细设计.md` §7~§8 | 当前正式设计 | 抽取 Command / Query / Consumer / candidate / Job 及函数级 flow |
| `03-详细设计.md` §9~§12 | 当前正式设计 | 抽取 28 状态主语、事务、错误、幂等、并发和恢复切口 |
| `03-详细设计.md` §13~§15 | 当前正式设计 | 抽取配置、依赖、日志 / 指标 / trace / audit / redaction 切口 |
| `03_ddd_step_16_test_cuts.md` | 详细设计校准输入 | 采用已审查的最小测试切口和 blocker 处理，不扩大测试范围 |
| `04-配置设计.md` §12、`04_config_step_12_downstream_handoff.md` | 配置承接输入 | 抽取 profile、strict validation、slot availability、fail-fast 和配置红线 |
| 旧 `05/06`、README、draft | historical / pollution audit | 只用于识别旧对象、状态、路径、指标和证据污染，不作为测试对象来源 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 domain object / policy 必须单测？ | CP01～CP07 的 34 个正式对象、各自 factory / immutable successor / owner guard、`PresenceAdmissionPolicy`、`SubscriptionScopePolicy`、`InboundScreeningPolicy`、`RuntimeMediationPolicy`、`OutboundMaterialPolicy`、`TraceMaterialPolicy`、`MirrorResolutionPolicy`、`ReadProjectionPolicy`，以及共享 body-free、双锚、ordered-unique、visibility 和 unknown-fence 不变量。 |
| 哪些 application service 必须做 service test？ | 九个 named service：`PresenceApplicationService`、`HostCollaborationService`、`SubscriptionScopeService`、`InboundBoundaryService`、`RuntimeMediationService`、`OutboundBoundaryService`、`InteractionTraceService`、`ExternalContextMirrorService`、`MemberReadModelService`；另测 `MemberApplicationFacade` 的有限路由、UoW 顺序、typed replay 和错误映射。 |
| 哪些 repository / adapter / worker 必须做集成或替身测试？ | `infra` 的 local / support / projection / continuation Store、UoW、idempotency / stored-result Store、config / builder、owner-specific resolver、host / Runtime / publication / observation handoff、`worker` 的 14 Consumer entry / receipt、`jobs` 的 5 continuation runner。物理产品未选定，统一使用 deterministic fake / controlled / disabled seam，不声称真实集成。 |
| 哪些 Command / Query / Consumer / Job 必须做协议和流程测试？ | 全部 10 Command、16 Query、14 Consumer（10 external + 4 committed-fact）和 5 Job；24 candidate 只做阻塞边界 / non-materialization 测试，不创建事件协议。 |
| 哪些状态、一致性和恢复行为必须单列？ | 28 个状态主语的合法 factory / helper、非法和 reserved edge；同一 UoW 的写入顺序、CAS、append-only、duplicate exact replay、same-key conflict、in-flight、commit-unknown、rollback failure、external side-effect unknown fence、projection cursor monotonicity 和 Job item isolation。 |
| 哪些缺失或构造失败必须负向测试？ | 缺双锚、metadata、trace、idempotency key、required ref、source / schema / purpose / scope、wrong result kind、forbidden body、unsupported version、错误 digest、owner mismatch、缺 stored carrier、未知状态名、未注册 Consumer / Job、无可用 required slot、非法配置和 redaction 泄漏。 |
| 状态名以什么为准？ | 只使用 `03_ddd_step_10_state_matrix.md` 与正式 `03` 的 enum variant；`Blocked`、`Waiting`、`Unknown`、`Stale`、`Gap` 等非正向姿态只能按正式定义断言，禁止旧口语 alias 或不存在的 `Unknown` variant。 |
| 每个切口回指什么？ | 至少回指 `03` §5~§15、Step 16 的具体表格 / 契约，或 `04` §12 的配置承接；不使用“核心流程”“接口可用”这类无来源描述。 |
| 哪些切口受 blocker？ | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 及 `L2M-UP-005` 下 24 candidate 的正向 qualification 受阻；本地 refusal、blocked-aware、no-write、replay 和边界检查仍可设计。 |

## 5. 当前文档问题诊断

| 位置 | 发现的问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 仍以 `MemberRuntimePersona`、旧 endpoint / binding 叙述组织，与当前 7 模块、10/16/14/24/5 分母和双锚边界不一致 | 完全隔离；不继承旧 TC、状态、路径或成功判定 |
| `03-详细设计.md` | 已列出对象和最小测试清单，但对象、协议、状态、持久化和观测切口尚未汇总到测试方案 | 本 Step 建立统一对象—切口索引 |
| `03_ddd_step_16_test_cuts.md` | 切口完整，但尚未分离“可测 local result”和“受 blocker 的外部正向 qualification” | 每个切口增加风险、层级和 blocker posture |
| `04-配置设计.md` | 配置测试承接存在，容易被误写为测试环境或实现命令 | 只抽取可验证的 validation、availability、redaction、non-configurable boundary |
| 协议候选 | 24 个语义候选容易被误当成 Event API | 明确只做 `L2M-UP-005` blocked / zero-materialization 检查 |

## 6. 改动前后对比

| 项 | 改动前 | 本 Step 收束后 | 原因 |
|---|---|---|---|
| 对象组织 | 旧文档按 persona / endpoint / binding | 按七模块、CP01~CP07 和 supporting carrier 组织 | 对齐当前详细设计模块边界 |
| 协议分母 | 未覆盖全部接口 | 固定 10 Command、16 Query、14 Consumer、24 candidate、5 Job | 防止测试对象遗漏 |
| 状态测试 | 只有少量 happy path | 28 状态主语 + 合法 / 非法 / reserved edge | 状态 helper、CAS 和 phase 可追溯 |
| 外部协作 | 容易把 adapter 成功当外部真相 | local accepted / non-positive / blocked-aware 三分 | 保持 owner truth 边界 |
| 事件候选 | 可能预建 publisher / outbox | 只验证不物化、不生成 route / delivery | `L2M-UP-005` 未闭合 |

## 7. 测试设计取舍

| 议题 | 方案 A | 方案 B | 结论 |
|---|---|---|---|
| 是否按技术层级先列用例 | 先列 unit / integration / E2E | 先按设计对象和风险切口，再分层 | 采用 B；风险发现位置由对象契约决定 |
| 是否将 34 个对象逐个写成独立大套件 | 每个对象独立 suite | 以对象组和共享不变量切口收敛，保留逐对象反查 | 采用 B；避免重复且不丢对象 |
| 是否给 24 candidate 建 event fake | 建 generic event / fake topic | 只做 blocked boundary / zero-materialization | 采用 B；不创造未批准协议 |
| 外部正向 lane 如何处理 | 以 fake success 代替 | local result + blocker-aware / refusal | 采用 B；fake 只证明本地契约 |
| Query 是否与 projection / Job 合并 | 合并为 read flow | Query 单独 no-write，Consumer / Job 各自保留 owner 写边界 | 采用 B；避免读路径修复真相 |

## 8. 结构化中间产物

### 8.1 七模块对象与主测试切口

| 模块 | 正式对象 / carrier | 必须验证的对象契约 | 主切口 | 推荐层级 |
|---|---|---|---|---|
| `contracts` | refs、metadata、commands、queries、consumers、events、jobs、views、receipts、errors | 有限 name、required field、双锚、body-free、result-kind / channel 配对、safe issue | `contracts_finite_protocol_schema`、`contracts_metadata_and_subject_anchor`、`contracts_typed_carrier_roundtrip` | contract unit |
| `domain` | CP01~CP07 的 34 对象、policy、state value | factory、immutable successor、ordered-unique、owner guard、状态合法 / 非法 / reserved edge | `domain_factory_and_invariant`、`domain_state_transition_contract`、`domain_policy_and_owner_boundary` | domain unit |
| `application` | facade、9 named service、operation context、idempotency record、stored result、visibility decision、job report assembly | finite routing、UoW 顺序、CAS、exact replay、错误映射、Query no-write | `application_non_query_orchestration`、`application_query_no_write`、`application_typed_replay_and_error_mapping` | service test + fake ports |
| `infra` | local/support/projection/continuation Store、UoW、builder、config、availability、blocked seam | versioned read/write、append-only、rollback、validated config、required slot gate、fake parity | `infra_store_uow_version_parity`、`infra_config_builder_availability`、`infra_adapter_failure_injection` | repository / boundary fake |
| `api` | command / query entry、handler result、API registry state | pre-gate validation、有限入口、Command / Query carrier 不混同、错误脱敏 | `api_command_query_boundary` | handler / contract |
| `worker` | 14 Consumer entry、item result、dispatch context、worker registry | source / schema / body / dedup gate、typed receipt、duplicate replay、无 transport ack 假设 | `worker_consumer_entry_and_receipt` | worker boundary |
| `jobs` | 5 Job entry、run result、runner registry | finite input、per-item UoW、partial report、exact replay、no source-truth repair | `jobs_continuation_and_report` | job runner boundary |

### 8.2 CP 对象组测试切口

| CP | 正式对象组 | 关键风险与断言 | P0 姿态 |
|---|---|---|---|
| CP01 | `StartupAdmission`、`MemberPresence`、`HostCollaborationMaterial`、`HostCollaborationAttempt`、`PresenceAdmissionPolicy` | 双锚 / credential ref / startup context gate；在场 successor 与 host attempt 可区分；不声明 host acceptance / session / health | local + blocked-aware |
| CP02 | `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision`、两类 scope / screening policy | scope source、四态筛选、瞬时 body check、不保存 raw body；规则 unknown / stale / conflict 保守 | local + negative |
| CP03 | `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception`、`RuntimeMediationPolicy` | 只有 permitted screening 才有 local delivery decision；entry / result mapping 缺失为 blocked；不拥有 Runtime run / outcome | local + blocked-aware |
| CP04 | `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap`、`OutboundMaterialPolicy` | committed safe material、body-free、attempt / gap 分层；不创建 event / outbox / delivery truth | local + non-materialization |
| CP05 | `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt`、`TraceMaterialPolicy` | correlation、append-only trace、safe observation handoff；不声明 observed / evidence | local + negative |
| CP06 | `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap`、`MirrorResolutionPolicy` | owner-specific ref、purpose / scope / freshness；不生成 generic resolver、authorization、health、registry | local + blocked-aware |
| CP07 | `MemberSummaryView`、`CapabilityOutletView`、`MemberProjectionState`、`MemberDiagnosticView`、`ReadProjectionPolicy` | committed-only 派生、可重建、stale / gap 显式；outlet 不复制定义 / registry，不反写 source | local + no-write |

### 8.3 协议分母与测试对象索引

| 协议族 | 数量 | 测试对象切口 | 必须覆盖的共用风险 |
|---|---:|---|---|
| Command | 10 | 每条 named command body、owner service、result / rejection carrier | 双锚 / metadata、canonical digest、UoW、reservation、local carrier、duplicate / conflict |
| Query | 16 | 每条 named query body、selector / page、response surface | visibility、freshness、redaction、no digest / no write / no resolver |
| external Consumer | 10 | source identity、schema、inspection、receipt | wrong source、unsupported version、forbidden body、duplicate、missing carrier |
| committed-fact Consumer | 4 | committed fact ref、continuation relation、receipt | 只读已提交事实、不能把 candidate 当 source、不能反写 source |
| outbound semantic candidate | 24 | local source-fact name与blocked marker | 只断言 `L2M-UP-005` blocker、zero configuration、无 event设施 |
| Operations Job | 5 | finite selector、input、report、replay relation | invalid pre-gate、partial item、exact report replay、no truth repair |

### 8.4 24 个 outbound semantic candidate 的切口边界

| CP 分组 | candidate 名称 | 只允许验证 | 明确禁止 |
|---|---|---|---|
| CP01 | `MemberStartupAdmissionRecorded`、`MemberPresenceChanged`、`HostCollaborationAttemptRecorded` | local fact 出现时仍无 event materialization | envelope、publisher、outbox、route、delivery |
| CP02 | `MemberSubscriptionScopeChanged`、`MemberInboundFactRecorded`、`MemberScreeningDecided` | local scope / intake / screening 的 zero configuration | topic、schema、retry、DLQ |
| CP03 | `MemberRuntimeDeliveryDecided`、`MemberRuntimeSubmissionAttemptRecorded`、`MemberRuntimeResultLinked`、`MemberRuntimeMaterialReceived` | local Runtime boundary fact 的 blocked marker | Runtime accepted / event source / handoff event |
| CP04 | `MemberOutboundDecided`、`MemberOutboundMaterialPrepared`、`MemberPublicationAttemptRecorded`、`MemberPublicationGapChanged` | outbound local fact 不创建发布设施 | Bus delivery / downstream accepted |
| CP05 | `MemberInteractionTraceRecorded`、`MemberInteractionGapChanged`、`MemberObservationMaterialPrepared`、`MemberObservationAttemptRecorded` | trace / observation local fact 不生成 generic event | observed / evidence / backend event |
| CP06 | `MemberExternalContextResolutionChanged`、`MemberExternalContextGapChanged` | mirror fact 保持 blocked / local-only | generic resolver event / policy or identity truth |
| CP07 | `MemberSummaryProjectionChanged`、`MemberCapabilityOutletChanged`、`MemberDiagnosticViewChanged`、`MemberProjectionStateChanged` | projection marker non-materialization | registry event / capability grant / readiness |

### 8.5 状态、事务与观测对象

| 对象组 | 分母 / 名称 | 测试切口 | 关键断言 |
|---|---|---|---|
| 状态主语 | 28 个：CP01~CP07 17 个、application/infra 4 个、api/worker/jobs 7 个 | `state_machine_28_subjects`、`state_cross_owner_fence` | 正式 enum variant、factory / helper、非法与 reserved edge；不直接写 status，不把 local state 升格为 foreign success |
| 写路径一致性 | UoW、CAS、append-only、idempotency、stored carrier | `fresh_path_ordering`、`versioned_successor_and_append`、`stored_carrier_before_complete` | validate → digest → begin → reserve → local mutation → carrier → complete → commit；失败回滚且不留下 completed relation |
| 重放与恢复 | duplicate、same-key conflict、in-flight、commit-unknown、rollback failure | `typed_replay_and_commit_unknown` | 同 relation exact replay；不重跑 side effect；unknown 只 inspect same relation；不能换 key 绕过保护 |
| Job / projection | cursor / watermark、per-item UoW、partial report、read-only Query | `projection_cursor_monotonicity`、`job_item_isolation`、`query_no_write` | 派生不反写 CP01~CP06；单项失败不吞掉已提交项；Query 不 repair / refresh / reconcile |
| 配置 / 依赖 | 四个 P0 profile、slot availability、Core-only compile candidate | `config_fail_fast`、`required_slot_gate`、`dependency_classification` | raw config 只在 infra；required slot 不可用不得 Ready；runtime/event/ref/adapter/fake 不是 package dependency |
| 观测 / 安全 | logs、metrics、trace、local audit、redaction | `observability_redaction_local_audit` | 仅安全 ref / fingerprint / low-cardinality label；无 raw body、secret、hidden reasoning、stack trace；Query / duplicate 不写 accepted audit |

## 9. 测试对象与切口总表

| 测试对象 | 来源章节 | 主测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| 七模块边界与 public carrier | `03` §5~§7、§15 | `contracts_*`、`domain_*`、`api_*` | DTO / owner / body 泄漏、层间越权 | contract / unit |
| 九个 named application service 与 facade | `03` §5.4、§7.2~§7.6、§8 | `application_non_query_orchestration`、`typed_replay` | 错路由、UoW 顺序、重复执行 | service + fake UoW |
| local/support/projection/continuation Store | `03` §10、§12~§13 | `infra_store_uow_version_parity` | 版本覆盖、append 冲突、物理实现误称 truth | repository fake |
| owner resolver / handoff / blocked seam | `03` §7~§13、`04` §12 | `infra_adapter_failure_injection`、`external_side_effect_unknown_fence` | 把不可用或 attempt 当外部成功 | adapter boundary |
| 10 Command | `03` §7.2~§8 | `command_<name>` + shared command cuts | invalid、conflict、duplicate、blocker | API + service |
| 16 Query | `03` §7.3~§8 | `query_<name>` + `all_queries_no_write` | 读路径隐式写入或泄漏正文 | query service |
| 14 Consumer | `03` §7.4~§8 | `consumer_<name>` + shared consumer cuts | source/schema/body/dedup 错误 | worker boundary |
| 24 semantic candidates | `03` §7.5、`L2M-UP-005` | `candidate_non_materialization` | 未批准 event / route / outbox 被创造 | architecture check |
| 5 Operations Job | `03` §7.6~§8 | `job_<name>` + partial / replay cuts | 全量扫描、source repair、report 伪装 | job boundary |
| 28 状态主语 | `03` §9、Step 10 | `state_machine_28_subjects` | 旧名、非法迁移、reserved gap 被伪补 | domain / boundary |
| 事务、并发、恢复 | `03` §10~§12 | consistency / idempotency / recovery group | 分叉、盲重试、commit unknown 误判 | service + fake |
| 配置与观测 | `03` §13~§14、`04` §3~§12 | config / dependency / redaction group | secret 泄漏、外部健康误报、低基数破坏 | config / static check |

## 10. P0 测试切口停审记录

| 测试切口组 | 设计来源是否明确 | 风险是否具体 | 层级是否合理 | 后续用例可落地 | 结论 |
|---|---|---|---|---|---|
| contracts / domain | 是，`03` §5~§7、§9、Step 16 | 是，字段、factory、state、owner | unit / contract | 是 | `pass` |
| application / infra | 是，`03` §8、§10~§13 | 是，UoW、CAS、replay、slot | service / fake | 是 | `pass_with_design_gaps` |
| API / worker / jobs | 是，`03` §7~§8 | 是，pre-gate、receipt、report | boundary / service | 是 | `pass_with_upstream_and_design_blockers` |
| CP01~CP07 业务切口 | 是，`03` §5~§15、Step 16 | 是，双锚、筛选、出站、摘要 | domain + service | 是 | `pass_with_blocked_positive_lanes` |
| 24 candidate | 是，`03` §7.5、`L2M-UP-005` | 是，非物化 | static boundary | 是，仅负向 | `pass / blocked` |
| 状态 / 一致性 / redaction | 是，`03` §9~§15 | 是，非法边、回滚、泄漏 | fake / static | 是 | `pass_with_design_gaps` |

本停审只确认测试切口设计完整，不代表任何用例已执行或证据已产生。受影响的正向 qualification、真实联调和 readiness 继续 blocked。

## 11. 跨切口设计来源审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 七模块均有切口 | `covered` | `contracts/domain/application/infra/api/worker/jobs` 均有独立入口 |
| 10 Command 均有切口 | `covered` | 每条 named Command 在 Step 6 展开；当前只预留切口，不生成 TC |
| 16 Query 均有切口 | `covered` | 每条有 read surface + no-write 分支 |
| 14 Consumer 均有切口 | `covered` | 10 external + 4 committed-fact；receipt reconstruction gap 保留 |
| 24 candidate 未物化 | `blocked / covered` | 只允许 zero-materialization；`L2M-UP-005` 不关闭 |
| 5 Job 均有切口 | `covered` | finite selector、partial、duplicate、no repair |
| 28 状态主语均有切口 | `covered_with_reserved_edges` | `L2M-DDD-003~007` 与 `scope_supersede_gap` 不得伪补 |
| P0 需求 / 设计契约无孤儿 | `covered_with_blockers` | 受影响正向 lane 在 Step 5 / Step 14 进入风险 |
| 状态 / 字段 / phase 命名 | `covered` | 以后续 Step 8~10 正式名称为准，禁止旧口语名 |
| 依赖类型 | `covered` | 只有 `core-contracts` 是 compile candidate；其余分为 runtime/event/ref/adapter/fake |

## 12. 回填草稿（供正式 §3）

本项目测试对象按七模块和 CP01~CP07 组织，并覆盖 10 个 Command、16 个 Query、14 个 Consumer、24 个保持未物化的 semantic candidate、5 个 Operations Job 与 28 个状态主语。`contracts` 验证有限协议、双锚、metadata、body-free 和 typed carrier；`domain` 验证 factory、不变量、policy 与正式状态迁移；`application` 验证 named service 编排、UoW、CAS、幂等与 typed replay；`infra` 验证 Store / builder / availability / blocked seam；`api`、`worker`、`jobs` 分别验证 pre-gate、receipt 和 report 边界。

P0 切口覆盖 local truth、fail-closed、安全暴露、状态 / 一致性、配置和观测红线。受 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 影响的正向 lane 只能以 blocked-aware、refusal、reserved-edge 或 non-materialization 姿态进入测试方案。24 个 outbound semantic candidate 不建立 Event envelope、publisher、outbox、topic、route、retry、DLQ 或 delivery 测试。Query 永远 no-write，Job 永远不修复 source truth。

## 13. 待确认事项

| ID | 待确认事项 | 影响 | 处理 |
|---|---|---|---|
| `L2M-UP-001~008` | host、image、Runtime、Core event、credential、screening、subject exact contract | 正向接缝 qualification | 保留 blocked；只设计 local / negative / blocked-aware |
| `L2M-DDD-001~007` | implementation repo、physical Store、receipt、CP04~CP07 helper / version | 真实实现和部分正向用例 | 保留 design blocker；不得用测试替代设计 |
| `scope_supersede_gap` | scope successor helper 未闭合 | Replace positive path | 仅验证拒绝 / blocked fence |
| `L2M-UP-005` | member-specific event schema / route 未定 | 24 candidate | zero configuration；不生成事件设施 |

## 14. 进入下一步条件

- [x] 七模块、协议分母、Job 和状态主语均有明确测试切口。
- [x] 每个 P0 切口有具体设计来源、风险、建议层级和 blocked posture。
- [x] 已完成切口级停审与跨切口孤儿 / 重复 / phase / 依赖审计。
- [x] 未生成 TC、fixture、CI、artifact、report、EV 或执行结果。
- [x] 所有 blocker 保留并可由后续 Step 追溯。

**Step 3 结论：** `completed / pass_with_explicit_blockers / stop_review`。按用户“完成全部 05”授权，可进入 Step 4；正式 `05-测试方案.md` 仍须等 Step 15 装配。
