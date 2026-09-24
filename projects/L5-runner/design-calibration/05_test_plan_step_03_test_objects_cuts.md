# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节：`05-测试方案.md` §3
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 3 |
| current_module | `test_objects_cuts:p0_cut_review_and_cross_audit` |
| gate_status | `pass_for_step_04` |
| gate_reason | 18 个测试切口均有具体 03/04 真相源；P0 切口逐项停审完成，孤儿契约、重复切口、状态命名漂移和 phase 越界审计无 unresolved 冲突。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 4 |

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 业务组成部分与对象轮廓 | `02-概要设计.md` §5～§10 | 确认六个能力区域和跨对象接缝。 |
| 七模块契约 | `03-详细设计.md` §5 | 固定模块边界与推荐测试层级。 |
| 对象/port/协议索引 | `03-详细设计.md` §6～§7 | 固定正式对象、函数面、Command/Query/Consumer/Job。 |
| flow/state/UoW/error/idempotency/config/observability | `03-详细设计.md` §8～§15 | 提取字段、状态、错误、无副作用和恢复断言。 |
| 最小测试切口 | `03_ddd_step_16_test_slices.md` §6～§16 | 覆盖每模块、32 flows、21 状态、持久化和禁止字段。 |
| 配置下游承接 | `04-配置设计.md` §12 | 纳入 strict parse、profile、builder/readiness 和 failure cuts。 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些 domain object/value/policy 必须单测？ | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection`、`AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture`、`RunIntent`、`ControlIntent`、`ProtectionGuard`、`RecoveryCase`、`OutputPreview`、`FailureDiagnosis`、`HandoffPosture` 及 `ConnectivityView`/read-section candidate 的 factory、binding、不变量和合法/非法 transition。 | `03` §6、§9、Step 16 §7/§12 |
| 哪些 application service 必须做 service test？ | Selection/Acquisition/Qualification/RunLifecycle/Control/ResourceRecovery/Preview/Diagnosis/Handoff/ReadModel/Connectivity services；重点是 validate→reserve→load→transition→external→stored result→complete 顺序。 | `03` §5.4、§8、§10～§13 |
| 哪些 adapter/worker/job 需集成级测试？ | 14 semantic ports、repository/UoW、entry dispatch、4 planned Consumer、5 Operations Job、J05 projection replacement、redaction/telemetry adapter。当前以 fake/controlled seam 为主。 | `03` §6.3、§7、§10、§14、Step 16 |
| 哪些字段/状态/错误必须单列负向切口？ | exact immutable refs/generation、trusted metadata、required fields、`latest/default/newest/tag/branch`、`Accepted/Running`、`Complete/Verified/Qualified`、`Confirmed/Cleaned`、`Delivered/evidence`、Unknown/RecoveryCase、forbidden fields。 | `03` §7、§9、§11～§15 |
| 是否存在 P0 设计契约没有入口？ | 没有。每个 P0 module/protocol/state/consistency/config/observability contract 均至少映射一个切口；planned Consumer positive path明确 reserved/blocked。 | Step 16 §17 审计 |

## 4. 测试对象与切口总表

| # | 测试对象 / 正式契约 | 来源章节 | 测试切口 | 风险 | 推荐层级 | 优先级 |
|---:|---|---|---|---|---|---:|
| 1 | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection` | 03 §6、§8、§9 | `context_selection_exact_binding`：trusted actor/scope、immutable refs、successor generation、authority posture、禁止 selector | 运行请求无语境、旧选择越权或 `latest` 进入主链 | contract + domain unit | P0 |
| 2 | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` | 03 §6、§8～§10 | `material_acquisition_integrity_axes`：transfer/quarantine/manifest/digest/signature/platform/authority freshness 分轴 | Complete 被误当 Verified/Qualified，坏材料放行 | domain + service/fake port | P0 |
| 3 | `RunIntent`、`QualifiedMaterialBinding`、`SandboxRunPort` | 03 §6～§8、§11 | `run_intent_acceptance_boundary`：qualified binding、resource guard、external outcome、Accepted/Unknown/RecoveryCase | 未资格运行、ACK/PID 推导 Running、未知副作用重放 | service + controlled adapter | P0 |
| 4 | `ControlIntent`、`OwnerStateBasis` | 03 §6～§9、§12 | `control_intent_result_separation`：Start/Stop/Cancel、basis、receipt、Confirmed/Conflict/Unknown | 控制意图被当成功或清理完成 | domain + service | P0 |
| 5 | `OwnerRunProjection`、`RuntimeStatusReadPort` | 03 §6～§9 | `owner_projection_truth_attribution`：owner ref、source/freshness、terminal/unknown、local observation 不升级 truth | Runner projection 反写或冒充 Runtime truth | service + integration-like | P0 |
| 6 | `ResourceObservation`、`ProtectionGuard`、`MaterialCacheEntry` | 03 §6、§8～§10 | `resource_cleanup_guard`：probe/allocation conflict、lease/capture/handoff/retention/orphan、candidate/releasable/evicted 分离 | 抢占资源、危险删除、保护材料丢失 | domain + controlled platform | P0 |
| 7 | `RecoveryCase`、`ConnectivityView`、`ReconcileRunnerStateJob` | 03 §6、§8～§12 | `unknown_recovery_manual_review`：offline/reconnect、readback、Frozen/Querying/ManualReview、禁止 replay/resend/reclaim | Unknown 被压成失败/成功或自动副作用 | service + job integration-like | P0 |
| 8 | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | 03 §6、§8、§11、§14 | `bounded_redacted_presentation`：source/freshness/visibility、body bound、redaction、receipt≠evidence | raw body/secret 泄露或 local receipt 升格 evidence | domain + redaction fake | P0 |
| 9 | `RunnerReadModel`、`RunnerReadSection`、12 Query | 03 §6～§8、§10 | `query_read_surface_no_write`：visible/empty/not-visible/degraded/stale、existing identity/generation | Query 隐式 refresh、repair、probe 或写入 | service + handler | P0 |
| 10 | `contracts` typed refs/DTO/result/view/error | 03 §5.2、§6～§7 | `protocol_secondary_type_closure`：required fields、finite union、name/body/metadata mismatch、body-free surface | 实现侧自补字段/状态，协议漂移 | contract unit | P0 |
| 11 | `application` command pipeline、idempotency | 03 §5.4、§8、§12 | `command_ordering_and_duplicate`：reservation、same digest replay、different digest conflict、external unknown | 重复副作用、盲重算、顺序破坏 | service test | P0 |
| 12 | repositories、`RunnerUnitOfWork`、stored result | 03 §6.3、§10、§12 | `versioned_uow_commit_unknown`：expected version、append unique、commit unknown、missing result | LWW、accepted trace 与 result 不一致、未知提交重试 | repository/UoW fake | P0 |
| 13 | `RunnerEntryDispatchPort`、Command/Query entries | 03 §5、§7～§8 | `entry_actor_scope_dispatch`：trusted metadata、actor/scope、exactly-one dispatch、presentation no-write | 越权、route/body mismatch、入口直连 infra | entry/service test | P0 |
| 14 | 4 planned Consumers、`RunnerConsumerItemDisposition` | 03 §7～§9、§14 | `consumer_header_first_negative`：missing/conflicting header、Blocked/Unsupported/Rejected/strict Duplicate、no parse/hash/store/ACK | 未授权 payload 被解析或 ACK 伪成功 | worker/service test | P0 |
| 15 | 5 Operations Job、claim/checkpoint/report | 03 §7～§13 | `job_claim_checkpoint_report`：bounded stages、terminal variants、duplicate report、Blocked/Unknown 保真、no truth repair | job 修改 owner truth、unknown reclaim/replay | job service + fake repo | P0 |
| 16 | `RunnerRuntimeBuildState`、`RunnerAdapterAvailabilityState`、04 builder | 03 §13、04 §9～§11 | `config_builder_readiness_layers`：strict source/profile/validator、core store、per-slot configured/enabled/ready、new assembly | half facade、feature flag 绕过 blocker、ready 伪造 | builder + service integration | P0 |
| 17 | `RunnerAdapterAvailabilityState`、redaction/telemetry carriers | 03 §14、04 §8/§11 | `observability_forbidden_field_boundary`：safe fields、low-cardinality、accepted/rejected split、raw secret/body/path/URL/PID/port 禁止 | 日志/指标成为泄露面或正式审计替代 | contract + adapter fake | P0 |
| 18 | 全部状态轴与无 outbound event | 03 §7、§9、§14、Step 16 §12/§10.2 | `cross_axis_non_escalation_and_event_zero`：21 状态、跨轴 shortcuts、publisher/outbox/topic 次数为 0 | 状态语义合并、伪造 outbound truth | cross-cut contract + call audit | P0 |

## 5. P0 切口逐项停审记录

| 切口 | 设计来源明确 | 字段/状态/错误可断言 | 正/负/边界入口 | 推荐层级合理 | 证据/后续要求 | 结论 |
|---|---|---|---|---|---|---|
| `context_selection_exact_binding` | 03 §6/§8/§9 | exact refs、generation、Blocked/Stale | exact、forbidden selector、visibility denied | contract/domain | TC/EV 需回指 AC-RUN-001/002 | 通过 |
| `material_acquisition_integrity_axes` | 03 §6/§8～§10 | Acquisition/Integrity/Cache 正式轴 | transfer fail、digest drift、authority stale | domain/service | TC/EV 需区分 Complete/Verified/Qualified | 通过 |
| `run_intent_acceptance_boundary` | 03 §6～§8/§11 | RunIntentState、RecoveryCase、owner basis | qualified、resource conflict、timeout unknown | service/controlled | 禁止 Accepted→Running | 通过 |
| `control_intent_result_separation` | 03 §6～§9 | ControlIntentState、receipt/issue | pending/confirmed/conflict/unknown | domain/service | 禁止 Confirmed→Cleaned | 通过 |
| `owner_projection_truth_attribution` | 03 §6～§9 | owner ref/source/freshness | status hit/stale/unavailable | service/integration-like | local observation 仅辅助 | 通过 |
| `resource_cleanup_guard` | 03 §6/§8～§10 | ProtectionState、guard basis | conflict、active protection、unknown | domain/controlled | 不执行 destructive cleanup | 通过 |
| `unknown_recovery_manual_review` | 03 §6/§8～§12 | RecoveryState、case/expected basis | offline、readback、manual review | service/job | 禁止 replay/resend/reclaim | 通过 |
| `bounded_redacted_presentation` | 03 §6/§8/§11/§14 | visibility/freshness/redaction | safe、partial、blocked、unsafe | domain/redaction fake | 不称 formal evidence | 通过 |
| `query_read_surface_no_write` | 03 §7/§8/§10 | Query response surface/disposition | visible/empty/not-visible/degraded | service/handler | write spies=0 | 通过 |
| `protocol_secondary_type_closure` | 03 §5/§6/§7 | required DTO/enum/error | missing/mismatch/body-free | contract | 不补 schema | 通过 |
| `command_ordering_and_duplicate` | 03 §5/§8/§12 | idempotency/result refs | duplicate/conflict/in-flight | service | zero-side-effect replay | 通过 |
| `versioned_uow_commit_unknown` | 03 §6/§10/§12 | expected version/UoW/stored result | stale/commit unknown/missing result | repository/UoW | RecoveryCase + no retry | 通过 |
| `entry_actor_scope_dispatch` | 03 §5/§7/§8 | metadata/actor/scope/disposition | invalid/name-body mismatch | entry/service | no direct infra | 通过 |
| `consumer_header_first_negative` | 03 §7～§9/§14 | header/disposition/receipt | missing/unsupported/duplicate | worker/service | payload call=0 | 通过（positive reserved） |
| `job_claim_checkpoint_report` | 03 §7～§13 | claim/checkpoint/report variants | partial/blocked/unknown/race | job/fake | no owner repair | 通过 |
| `config_builder_readiness_layers` | 03 §13、04 §9～§11 | profile/config/readiness markers | invalid/missing core/slot blocked | builder/service | configured≠enabled≠ready | 通过 |
| `observability_forbidden_field_boundary` | 03 §14、04 §8/§11 | safe fields/labels/redaction | forbidden field/metric cardinality | contract/adapter | zero raw material | 通过 |
| `cross_axis_non_escalation_and_event_zero` | 03 §7/§9/§14 | all formal state names | shortcut/outbound residue | cross-cut | 0 publisher/outbox/topic | 通过 |

## 6. 跨切口设计来源审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 03 §5 七模块是否都有入口 | 通过 | contracts/domain/application/infra/entry/worker/operations 均由切口 10～17 覆盖。 |
| 11 Command 是否都有测试入口 | 通过 | 切口 1～8、11、13、18；Step 6 再逐 Command 展开。 |
| 12 Query 是否都有 no-write 入口 | 通过 | 切口 9；Step 6 逐 Query 建用例。 |
| 4 Consumer 是否都有当前可测路径 | 通过 | 切口 14；仅负向/strict duplicate，positive 保持 reserved。 |
| 0 outbound event 是否被误写成测试对象 | 通过 | 切口 18 只做 no-residue 断言，不创建 event schema。 |
| 5 Job 是否都有 claim/checkpoint/report 入口 | 通过 | 切口 15；Step 6 按 J01～J05 展开。 |
| 21 状态主语是否覆盖 | 通过 | 切口 1/2/3/4/6/7/8/9/14/15/16/18；Step 6/10 逐状态展开。 |
| 配置 41 项是否都有测试归属 | 通过设计范围 | Step 8/10 将按七域和四 profile 建组合，不能把 demo 值当断言。 |
| P0 是否存在重复/孤儿切口 | 通过 | `cross_axis_non_escalation_and_event_zero` 为跨切口审计，不重复实现 truth。 |
| phase boundary 是否越界 | 通过 | 未把上游 owner success、destructive cleanup、formal evidence 或 production SLO 纳入当前 P0。 |

## 7. 测试设计取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 按模块还是按风险切口 | 只按七模块 / 对象、协议、状态、事务、恢复、配置和观测交叉切口 | 采用交叉切口；模块表只作来源和推荐层级。 |
| Consumer positive path | 假造 payload / 只测 header-first negative | 只测后者；positive 需重开上游 contract。 |
| Query 覆盖 | 统一 happy path / 每个 Query 独立 no-write/degraded surface | 每个 Query 独立，避免隐藏 body-free 和 no-write 差异。 |
| Job 覆盖 | 只测 Completed / 穷举 Completed/Partial/Blocked/Failed/Unknown/Duplicate | 穷举正式 report variant，Blocked 不压缩。 |
| 非功能切口 | 旧阈值直接测 / 先固定测量对象和阈值来源 | 后者；无 authority 数字保持待确认。 |

## 8. 回填草稿

正式 §3 应保留 18 个测试切口总表，并说明每个 P0 切口回指具体 03 对象/协议/flow/state/错误/配置或观测契约；P0 切口已逐项停审，Step 6 才将其展开为 TC 矩阵。不得把本 Step 的问题回答、停审记录或 planned 证据写入正式正文。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| exact owner DTO/SDK surface | P1 正向 integration 用例字段未定 | 使用 semantic port/fake；不猜字段。 |
| physical test target/runner | 无法固定测试文件/命令 | 只定义逻辑切口；`RUN-DDD-001/002`。 |
| durable store/corruption semantics | P1 durable parity 未执行 | expected-version/UoW 语义先定，backend 后置。 |
| 06 AC/VETO 复核 | EV 最终消费关系待后续确认 | 预留 `AC-RUN-*` 绑定，不形成 verdict。 |

## 10. 进入下一步条件

- [x] P0 测试对象都有具体切口和推荐层级。
- [x] 每个 P0 切口已完成停审记录。
- [x] 设计契约、状态、字段、错误和 phase boundary 无 unresolved 冲突。
- [x] 孤儿契约、重复切口、状态/命名漂移和 outbound 残留审计通过。
- [x] 可进入 Step 4 制定分层策略。

Step 3 完成，允许进入 Step 4；正式 05 仍不可写。
