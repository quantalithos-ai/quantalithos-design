# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节：`05-测试方案.md` §5
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 5 |
| current_module | `traceability_coverage:p0_bidirectional_audit` |
| gate_status | `pass_for_step_06` |
| gate_reason | 五个能力节点、16 项 FR、25 条 BR、11 项 AC、六类 NFR、配置门禁和 18 个测试切口均完成双向映射；P0 覆盖停审和跨覆盖审计无 unresolved 空洞。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 6 |

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 能力、FR、BR、NFR、AC、追溯矩阵 | `00-需求文档.md` §7、§9～§16 | 提供需求侧唯一编号和验收方向。 |
| 架构边界与依赖分类 | `01-架构设计.md` §4、§8～§13 | 提供 owner、SDK-first、compile/runtime/event 边界。 |
| 组成部分、对象、flow、state、异常 | `02-概要设计.md` §5～§13 | 提供测试语义上下文和 phase 边界。 |
| 模块、协议、状态、事务、错误、幂等、配置、观测 | `03-详细设计.md` §5～§15 | 提供设计契约、正式状态名和 test-cut 真相源。 |
| 最小测试切口 | `03_ddd_step_16_test_slices.md` | 提供 18 切口、32 flow、21 状态、no-write/no-replay/no-parse/no-truth-repair 断言。 |
| 配置测试承接 | `04-配置设计.md` §12 | 提供 strict source/profile/readiness/failure/change/rollback 覆盖。 |
| Step 2～4 | 当前 05 calibration | 固定优先级、非范围和层级。 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 每个 P0 能力对应哪些设计？ | `CP-RUN-01~05` 分别对应 context/selection、material qualification、run/control、resource/recovery、preview/diagnosis/handoff；每个能力均回指 `03` 对象、flow、state 和 `04` 配置/失败边界。 | `00` §7、`02` §5/§8/§9、`03` §5～§15 |
| 每个 P0 需求至少有哪些测试场景？ | 每项 FR 至少映射一个契约/状态/流程切口，并为主线、负向、边界、未知或 no-write 情况预留 TC 候选族；Step 6 再细化为具体 TC。 | `00` §9/§14；Step 3 |
| 哪些必须自动化？ | P0 协议 schema、状态转换、Command/Query/Consumer/Job 编排、幂等、UoW、redaction、配置验证、依赖边界和 no-write/no-replay 均要求可重复自动化或 gate contract。 | `03` Step 16；Step 4 |
| 每个场景如何留证？ | 现在只预留 `EV-RUN-*` 候选族；固定 suite/artifact/report 关系在 Step 9/13，真实 `<run_id>` 只有执行时产生。 | 测试 SOP Step 9/13 |
| 哪些暂未覆盖？ | P0 无空洞。`FR-RUN-014~016`、真实 owner integration、生产 workload/SLO、Archive 正向恢复和 GRC 属于 P1/P2/blocked，不静默删除。 | `00` §9、`RUN-UP-*`、`RUN-OPS-*` |
| 每个 Step 3 切口能否反查需求？ | 能；横切切口可反查 BR/AC/NFR 或设计契约，而非强行绑定单个 FR。 | Step 3、03 Step 16 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 旧 05 的矩阵围绕 `RunnerRun/RunQueueEntry/Trigger*` | 与新版 `ReleaseSelection/RunIntent/ControlIntent/OwnerRunProjection` 漂移 | 不继承旧矩阵；仅保留冲突审计。 |
| 旧 06 的验收行没有新版 AC 编号或证据关系 | 无法消费新版 03/04 状态和证据 | 只使用正式 `AC-RUN-*` 作为候选消费者，06 后续重建。 |
| Step 3 切口与需求尚未双向连接 | 可能出现孤儿需求或孤儿测试 | 建立正向、反向和跨覆盖审计。 |
| 旧性能数字无 authority | 会把历史候选误作 P0 阈值 | NFR 只保留测量对象/阈值来源门禁。 |
| 配置门禁容易被当成独立技术测试 | 可能遗漏其对 truth/safety 的影响 | 将配置 gate 映射至 BR/AC/切口和后续 EV 族。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 需求来源 | 旧对象/旧场景 | `CP/FR/BR/AC/NFR` 正式编号 | 保持需求真相源单一。 |
| 设计来源 | 模块泛名 | 具体 `03` §/Step、正式对象/协议/state/错误 | 允许测试断言精确回指。 |
| 测试映射 | 单向或散文 | 需求→设计→切口→TC/EV 候选，切口反向查需求 | 防止孤儿和重复。 |
| 自动化 | 泛称“自动化” | P0 必须可重复，P1/P2 明确 blocked/future | 便于 Step 9 形成 gate。 |
| 证据 | 旧截图/日志方向 | 候选 EV 族，真实关系留 Step 13 | 不伪造执行事实。 |

## 6. 测试设计取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| BR 是否每条单独造一个用例 | Step 5 全量列 TC / 按规则族映射、Step 6 拆关键场景 | 采用规则族 + 关键红线拆分；不在本步制造无断言的空用例。 |
| 技术切口是否必须绑定 FR | 强制单 FR / 可绑定 BR、AC、NFR 或设计契约 | 允许横切规则和设计契约作为合法来源。 |
| EV 是否现在定最终编号 | 定最终 EV / 只定候选族 | 只定候选族；Step 13 根据 suite/artifact/report 关系定稿。 |
| P1/P2 是否算“已覆盖” | 计入 P0 / 标记 future/blocked | 后者；不把 future 映射伪装成 P0 通过。 |

## 7. 结构化中间产物

### 7.1 能力节点覆盖矩阵

| 能力节点 | 需求/规则 | 设计依据 | 主要测试切口 | TC 候选族 | EV 候选族 | 覆盖 |
|---|---|---|---|---|---|---|
| `CP-RUN-01` trusted context & explicit selection | `FR-RUN-001~002`; `BR-RUN-001~005`; `AC-RUN-001~002` | `02` §5.4.1/§6.1/§8.2；`03` §6～§9 | `context_selection_exact_binding`; `protocol_secondary_type_closure` | `TC-RUN-CTX-*`; `TC-RUN-SELECT-*` | `EV-CTX-*`; `EV-SELECT-*` | 覆盖 |
| `CP-RUN-02` acquisition & qualification | `FR-RUN-003~004`; `BR-RUN-006~008`; `AC-RUN-003~004` | `02` §5.4.2/§6.2/§8.3；`03` §6/§8～§10 | `material_acquisition_integrity_axes`; `config_builder_readiness_layers` | `TC-RUN-ACQ-*`; `TC-RUN-INTEGRITY-*` | `EV-ACQ-*`; `EV-INTEGRITY-*` | 覆盖 |
| `CP-RUN-03` controlled run/control | `FR-RUN-005~007`; `BR-RUN-009~013`; `AC-RUN-005~006` | `02` §5.4.3/§6.3/§8.4；`03` §6～§12 | `run_intent_acceptance_boundary`; `control_intent_result_separation`; `owner_projection_truth_attribution` | `TC-RUN-REQUEST-*`; `TC-RUN-CONTROL-*` | `EV-RUN-*`; `EV-CONTROL-*` | 覆盖 |
| `CP-RUN-04` resources/cleanup/recovery | `FR-RUN-008~010`; `BR-RUN-014~018`,`024`; `AC-RUN-007~009` | `02` §5.4.4/§6.4/§8.5；`03` §6/§8～§13 | `resource_cleanup_guard`; `unknown_recovery_manual_review`; `versioned_uow_commit_unknown` | `TC-RUN-RESOURCE-*`; `TC-RUN-RECOVERY-*` | `EV-RESOURCE-*`; `EV-RECOVERY-*` | 覆盖 |
| `CP-RUN-05` safe preview/diagnosis/handoff | `FR-RUN-011~013`; `BR-RUN-019~023`,`025`; `AC-RUN-010~011` | `02` §5.4.5/§6.5/§8.6；`03` §6/§8/§11/§14 | `bounded_redacted_presentation`; `observability_forbidden_field_boundary`; `entry_actor_scope_dispatch` | `TC-RUN-PREVIEW-*`; `TC-RUN-DIAG-*`; `TC-RUN-HANDOFF-*` | `EV-PREVIEW-*`; `EV-DIAG-*`; `EV-HANDOFF-*` | 覆盖 |

### 7.2 功能需求覆盖矩阵

| 需求 ID | 设计依据 | 场景/切口 | TC 候选族 | 自动化 | EV 候选族 | 覆盖 |
|---|---|---|---|---|---|---|
| `FR-RUN-001` | `00` §9；`03` §6/§7/§8 | context missing/denied/current；`context_selection_exact_binding` | `TC-RUN-CTX-*` | 是 | `EV-CTX-*` | 覆盖 |
| `FR-RUN-002` | `00` §9/§10；`03` §7/§9 | exact immutable selection、forbidden selector、authority blocked | `TC-RUN-SELECT-*` | 是 | `EV-SELECT-*` | 覆盖 |
| `FR-RUN-003` | `00` §9；`03` §6/§8/§10 | acquisition progress、pause/resume/cancel、transfer≠verify | `TC-RUN-ACQ-*` | 是 | `EV-ACQ-*` | 覆盖 |
| `FR-RUN-004` | `00` §9/§10；`03` §6/§9/§13 | manifest/digest/signature/platform/authority freshness | `TC-RUN-INTEGRITY-*` | 是 | `EV-INTEGRITY-*` | 覆盖 |
| `FR-RUN-005` | `00` §9；`03` C07/§7/§8 | qualified material → RequestRun、accepted/pending/unknown | `TC-RUN-REQUEST-*` | 是 | `EV-RUN-*` | 覆盖 |
| `FR-RUN-006` | `00` §9；`03` §6/§8/§9 | owner projection and lifecycle source/freshness | `TC-RUN-OWNER-*` | 是 | `EV-OWNER-*` | 覆盖 |
| `FR-RUN-007` | `00` §9/§10；`03` C08/§9/§12 | start/stop/cancel intent and result separation | `TC-RUN-CONTROL-*` | 是 | `EV-CONTROL-*` | 覆盖 |
| `FR-RUN-008` | `00` §9；`03` §6/§8/§9 | resource observation/allocation conflict | `TC-RUN-RESOURCE-*` | 是 | `EV-RESOURCE-*` | 覆盖 |
| `FR-RUN-009` | `00` §9/§10；`03` C09/§9/§10 | guard-first cleanup and protected materials | `TC-RUN-CLEANUP-*` | 是 | `EV-CLEANUP-*` | 覆盖 |
| `FR-RUN-010` | `00` §9/§10；`03` C10/J03/§11/§12 | disconnect/restart/reconcile/manual review | `TC-RUN-RECOVERY-*` | 是 | `EV-RECOVERY-*` | 覆盖 |
| `FR-RUN-011` | `00` §9/§13；`03` §6/§8/§14 | bounded source-attributed preview | `TC-RUN-PREVIEW-*` | 是 | `EV-PREVIEW-*` | 覆盖 |
| `FR-RUN-012` | `00` §9；`03` §11/§14 | typed diagnosis, issue and next-step mapping | `TC-RUN-DIAG-*` | 是 | `EV-DIAG-*` | 覆盖 |
| `FR-RUN-013` | `00` §9/§10；`03` C11/§14 | redacted handoff pending/accepted/blocked/unknown | `TC-RUN-HANDOFF-*` | 是 | `EV-HANDOFF-*` | 覆盖 |
| `FR-RUN-014` | `00` §9; `RUN-UP-001` | batch prefetch only when exact authority/integrity hold | `TC-RUN-PERIPHERAL-*` | P1/blocked | `EV-PERIPHERAL-*` | future/blocked |
| `FR-RUN-015` | `00` §9; `RUN-UP-007` | safe multi-run comparison without truth merge | `TC-RUN-PERIPHERAL-*` | P2/blocked | `EV-PERIPHERAL-*` | future/blocked |
| `FR-RUN-016` | `00` §9; `RUN-UP-006` | archive reference browsing only | `TC-RUN-ARCHIVE-*` | P2/blocked | `EV-ARCHIVE-*` | future/blocked |

### 7.3 业务规则覆盖矩阵

| 规则组 | 正式规则 | 设计契约 | 主要切口/断言 | TC/EV 候选 | 覆盖 |
|---|---|---|---|---|---|
| Explicit selection/authority | `BR-RUN-001~005` | `03` selection binding、authority read、generation | exact refs、no `latest`、successor generation、authority blocked | `TC-RUN-SELECT-*` / `EV-SELECT-*` | 覆盖 |
| Acquisition/integrity | `BR-RUN-006~008` | acquisition/integrity/cache state matrix | transfer≠verified≠qualified、digest/authority drift | `TC-RUN-ACQ-*` / `EV-INTEGRITY-*` | 覆盖 |
| Run/control truth | `BR-RUN-009~013` | C07/C08、RunIntent/ControlIntent/OwnerProjection | accepted≠running、ACK≠confirmed、confirmed≠cleaned | `TC-RUN-REQUEST-*` / `EV-RUN-*` | 覆盖 |
| Resource/cleanup/recovery | `BR-RUN-014~018`,`024` | guard/recovery/connectivity/UoW | protected material、conflict、unknown freeze、no replay | `TC-RUN-RESOURCE-*` / `EV-RECOVERY-*` | 覆盖 |
| Preview/diagnostic/owner boundary | `BR-RUN-019~023`,`025` | redaction/handoff/observability/dependency | body-bounded, receipt≠evidence, SDK/API only | `TC-RUN-PREVIEW-*` / `EV-DIAG-*` | 覆盖 |

### 7.4 验收与 NFR 覆盖矩阵

| 验收/NFR | 通过方向 | 设计/测试切口 | 自动化 | EV 候选 | 当前成熟度 |
|---|---|---|---|---|---|
| `AC-RUN-001` | exact selection + source/scope/generation/validity | selection/context | 是 | `EV-CTX-*` | semantic planned |
| `AC-RUN-002` | authority blocked/restricted/invalidated | selection/owner boundary | 是 | `EV-SELECT-*` | upstream positive blocked |
| `AC-RUN-003` | acquisition progress/pause/failure/complete separate | material | 是 | `EV-ACQ-*` | semantic planned |
| `AC-RUN-004` | manifest/digest/signature/freshness/platform qualified | integrity/config | 是 | `EV-INTEGRITY-*` | upstream positive blocked |
| `AC-RUN-005` | request posture distinguishes accepted/pending/rejected/unknown | run intent | 是 | `EV-RUN-*` | semantic planned |
| `AC-RUN-006` | owner status/result supports lifecycle | owner projection/control | 是 | `EV-OWNER-*` | owner read seam blocked |
| `AC-RUN-007` | resource conflict visible, no silent takeover | resource guard | 是 | `EV-RESOURCE-*` | platform seam blocked |
| `AC-RUN-008` | cleanup/protection phases distinct | cleanup/recovery | 是 | `EV-CLEANUP-*` | Sandbox seam blocked |
| `AC-RUN-009` | disconnect freezes and requires reconcile/manual review | recovery | 是 | `EV-RECOVERY-*` | semantic planned |
| `AC-RUN-010` | source/freshness/redaction and restricted/partial surfaces | preview/diagnosis/handoff | 是 | `EV-DIAG-*` | observability seam blocked |
| `AC-RUN-011` | only SDK/API/public adapter, no truth writes | dependency/event-zero | 是 | `EV-BOUNDARY-*` | static/semantic planned |
| Performance | measure selection/acquisition/render/recovery; no hard value yet | Step 10 performance sample | 部分 | `EV-NFR-*` | authority pending |
| Availability | failure produces blocked/unknown/safe next step | error/recovery/config | 是 | `EV-RECOVERY-*` | semantic planned |
| Security | no implicit version, private implementation or sensitive body | boundary/redaction | 是 | `EV-SECURITY-*` | semantic planned |
| Audit/traceability | safe refs/correlation/freshness | observability/evidence | 是 | `EV-TRACE-*` | formal evidence blocked |
| Idempotency/consistency | generation/digest/lease conflicts stop side effects | UoW/idempotency | 是 | `EV-IDEMP-*` | semantic planned |
| Observability | bounded safe markers, low-cardinality, audit separation | observability | 是 | `EV-OBS-*` | backend/SLO pending |

### 7.5 测试切口反向覆盖矩阵

| 测试切口 | 需求/规则/AC | 设计契约 | TC 候选族 | EV 候选族 | 覆盖 |
|---|---|---|---|---|---|
| `context_selection_exact_binding` | FR-001/002; BR-001~005; AC-001/002 | 03 §6/§8/§9 | `TC-RUN-CTX-*`/`TC-RUN-SELECT-*` | `EV-CTX-*`/`EV-SELECT-*` | 覆盖 |
| `material_acquisition_integrity_axes` | FR-003/004; BR-006~008; AC-003/004 | 03 §6/§8～§10 | `TC-RUN-ACQ-*`/`TC-RUN-INTEGRITY-*` | `EV-ACQ-*`/`EV-INTEGRITY-*` | 覆盖 |
| `run_intent_acceptance_boundary` | FR-005; BR-009~012; AC-005 | C07/RunIntent/RecoveryCase | `TC-RUN-REQUEST-*` | `EV-RUN-*` | 覆盖 |
| `control_intent_result_separation` | FR-007; BR-010~013; AC-005/006 | C08/ControlIntent | `TC-RUN-CONTROL-*` | `EV-CONTROL-*` | 覆盖 |
| `owner_projection_truth_attribution` | FR-006; BR-010/011; AC-006 | OwnerRunProjection/Runtime read | `TC-RUN-OWNER-*` | `EV-OWNER-*` | 覆盖（正向 blocked） |
| `resource_cleanup_guard` | FR-008/009; BR-014~016; AC-007/008 | ProtectionGuard/ResourceObservation/C09 | `TC-RUN-RESOURCE-*`/`TC-RUN-CLEANUP-*` | `EV-RESOURCE-*`/`EV-CLEANUP-*` | 覆盖 |
| `unknown_recovery_manual_review` | FR-010; BR-012/017/018/024; AC-009 | RecoveryCase/C10/J03 | `TC-RUN-RECOVERY-*` | `EV-RECOVERY-*` | 覆盖 |
| `bounded_redacted_presentation` | FR-011~013; BR-019~023; AC-010 | Preview/Diagnosis/Handoff/§14 | `TC-RUN-PREVIEW-*`/`TC-RUN-DIAG-*` | `EV-DIAG-*` | 覆盖 |
| `query_read_surface_no_write` | FR-006/009/012; BR-018/023; AC-006/009/010 | Q01～Q12/RunnerReadModel | `TC-RUN-QUERY-*` | `EV-QUERY-*` | 覆盖 |
| `protocol_secondary_type_closure` | BR-001/002/025; AC-001/011 | contracts/entry/worker | `TC-RUN-CONTRACT-*` | `EV-CONTRACT-*` | 覆盖 |
| `command_ordering_and_duplicate` | BR-005/012/024; AC-005/009/011 | command pipeline/idempotency | `TC-RUN-IDEMP-*` | `EV-IDEMP-*` | 覆盖 |
| `versioned_uow_commit_unknown` | BR-023/024; AC-009/011 | §10/§12 | `TC-RUN-CONSISTENCY-*` | `EV-CONSISTENCY-*` | 覆盖 |
| `entry_actor_scope_dispatch` | FR-001/005/007; BR-001/022/025 | entry dispatch | `TC-RUN-ENTRY-*` | `EV-BOUNDARY-*` | 覆盖 |
| `consumer_header_first_negative` | BR-022/025; AC-011 | E01～E04/worker | `TC-RUN-CONSUMER-*` | `EV-CONSUMER-*` | 覆盖（positive blocked） |
| `job_claim_checkpoint_report` | FR-003/009/010/012; BR-014/018/023/024 | J01～J05/operations | `TC-RUN-JOB-*` | `EV-JOB-*` | 覆盖 |
| `config_builder_readiness_layers` | BR-003/004/006/008/022; AC-002/004/011 | 03 §13 + 04 §6/§9/§11 | `TC-RUN-CONFIG-*` | `EV-CONFIG-*` | 覆盖 |
| `observability_forbidden_field_boundary` | FR-011~013; BR-019~023/025; AC-010/011 | 03 §14 + 04 §8 | `TC-RUN-REDACTION-*`/`TC-RUN-OBS-*` | `EV-SECURITY-*`/`EV-OBS-*` | 覆盖 |
| `cross_axis_non_escalation_and_event_zero` | BR-004/010/011/013/020/022; AC-005/006/008/010/011 | 03 §7/§9/§14 | `TC-RUN-BOUNDARY-*` | `EV-BOUNDARY-*` | 覆盖 |

### 7.6 覆盖停审记录

| 覆盖项 | 审查项 | 结论 | 缺口/修正 |
|---|---|---|---|
| `CP-RUN-01~05` | 是否有主线、负向、设计来源和 EV 候选族 | 通过 | Step 6 展开具体 TC。 |
| `FR-RUN-001~016` | 每项是否有切口和优先级 | 通过 | 014~016 明确 future/blocked。 |
| `BR-RUN-001~025` | 不变量/禁止/显式变化/边界/治理/审计是否覆盖 | 通过 | 规则按五组映射；Step 6 拆关键红线。 |
| `AC-RUN-001~011` | 是否有未来可消费证据方向 | 通过 | 06 尚未重建，当前不形成 verdict。 |
| 六类 NFR | 是否区分可测试安全底线与后置量化 | 通过 | 性能/容量不设无来源阈值。 |
| 18 个 Step 3 切口 | 是否能反查需求/规则/设计 | 通过 | 无孤儿切口。 |

### 7.7 跨覆盖项审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| P0 孤儿需求 | 无 | 每项均有切口、TC 候选族和 EV 候选族。 |
| P0 孤儿设计契约 | 无 | 03 Step 16 的模块/协议/state/一致性/config/observability 均有反向入口。 |
| P0 孤儿切口 | 无 | 18 切口均可反查 FR/BR/AC/NFR 或正式设计契约。 |
| 重复 TC/EV 标识 | 无 | 本步只使用族名，不定最终编号。 |
| P0 自动化缺口 | 无已知缺口 | Step 9 需落实逻辑 gate contract；当前不创建脚本。 |
| P1/P2 被写成 P0 | 无 | 明确 future/blocked。 |
| phase 越界 | 无 | 不把 owner success、destructive cleanup、formal evidence、SLO 伪装成当前 P0。 |

## 8. 测试设计取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| BR 展开粒度 | 每条规则独立 TC / 规则族加关键红线 | 采用规则族，Step 6 对高风险规则独立用例。 |
| TC/EV 最终编号 | 当前固定 / 分别在 Step 6/13 固定 | 后者。 |
| P1/P2 coverage 状态 | 已覆盖 / future/blocked | 后者。 |

## 9. 回填草稿

正式 §5 应回填能力、FR、BR、AC、NFR 和切口反向矩阵；正文只保留收口结论，不写诊断语气。应明确 P0 覆盖可追溯但尚无执行 evidence，P1/P2/blocked 不得视作通过。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 用例规模和编号分段 | 影响 TC 完整性 | 按切口批次设计，避免无来源大表。 |
| Step 9 依赖边界 gate 形式 | 影响 VF/AC 证据 | 保持逻辑 contract，待真实 runner 再定命令。 |
| Step 13 证据族最终编号 | 影响 06 消费 | 先锁 suite/artifact/report 关系，再定 EV。 |

## 11. 进入下一步条件

- [x] P0 需求和设计契约都有测试切口。
- [x] 覆盖矩阵可双向追溯。
- [x] P1/P2/blocked 未伪装成 P0 pass。
- [x] 覆盖停审完成。
- [x] 跨覆盖项审计无 unresolved 冲突。

Step 5 完成，允许进入 Step 6；正式 05 仍不可写。
