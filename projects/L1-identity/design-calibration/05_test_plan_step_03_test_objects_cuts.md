# Step 3. 抽取测试对象与测试切口

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节: `05-测试方案.md` §3 测试对象与测试切口

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 抽取测试对象与测试切口 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 2 测试范围;`03-详细设计.md` §5~§16;`03_ddd_step_16_test_cuts.md`;`04-配置设计.md` §12 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_03_test_objects_cuts.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 4 |

## 2. 本步目标

从概要和详细设计中抽取必须验证的测试对象,并把它们收敛为可追溯的测试切口。

本 Step 只回答:

- 哪些 domain object、value object、policy、application service、repository、adapter、worker、Command、Query、Event、Job、状态机、一致性和配置 / 观测行为必须进入测试对象。
- 每个测试切口回指哪个设计真相源。
- 哪些字段缺失、DTO 构造失败、引用混同、状态名漂移或 phase boundary 越界必须作为负向测试切口。
- P0 测试切口是否完成停审。
- 跨切口是否存在孤儿 P0 设计契约、重复切口或未承接风险。

本 Step 不生成具体 TC 编号、测试步骤、fixture、测试数据、CI suite、evidence ID 或验收结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已审核通过 | 固定 P0 / P1 / P2 和非范围 |
| `03-详细设计.md` §5 / §6 | 正式输入 | 抽取模块、对象、policy、trait / port / adapter 测试对象 |
| `03-详细设计.md` §7 / §8 | 正式输入 | 抽取 Command、Query、Inbound / Callback、Outbound Material、Job 和函数级 flow 测试对象 |
| `03-详细设计.md` §9~§15 | 正式输入 | 抽取状态机、事务、错误、幂等、配置、观测测试对象 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 采用最小测试切口名和设计来源 |
| `04-配置设计.md` §12 | 直接输入 | 抽取配置 profile、strict JSON、source priority、sensitive/no-output、runtime builder、degraded/no-write 测试对象 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 domain object / value object / policy 必须单测? | `GlobalMember`、`IdentityAnchorState`、`IdentityAnchorPolicy`、`GlobalLifecycleState`、`LifecycleTransitionPolicy`、`HighRiskLifecycleGuard`、`RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、`RoleCapabilitySourcePolicy`、`CareerRecord`、`CareerAppendPolicy`、`MemoryReference`、`MemoryReferenceState`、`MemoryReferencePolicy`、`TraceHandoffIntent`、`HandoffState`、`HandoffPolicy`、`IdentityOutboxRecord`、`OutboxState`、`ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport`、`IdentityTraceRecord`、`AuditTrail`、`MemberSummaryView`、`VisibilityPolicy` 等对象和 policy 必须进入 domain / contract / service 测试。 |
| 哪些 application service 必须做 service test? | 6 个 Command orchestration、14 个 Query no-write、5 个 Inbound / Callback orchestration、10 类 Outbound Material accepted-only、6 个 Operations Job、idempotency / stored result / receipt / report、UoW、error mapping、projection/reference/reconciliation、outbox publish、trace handoff delivery 和 retry flow 都必须做 service 或 runner 层测试。 |
| 哪些 repository / adapter / worker 必须做集成测试? | member/lifecycle/role/career/memory/handoff repository、projection repository、reference state / sidecar repository、outbox store、idempotency / result / receipt / job report store、UnitOfWork fake、governance basis resolver、role/work/memory/archive resolver、publisher、handoff adapter、runtime builder、API/worker/jobs entry 都必须验证 version、page、unique、rollback、failure injection、stored snapshot、duplicate replay 和 redaction 语义。 |
| 哪些 Command / Query / Event / Job 必须做协议和流程测试? | 6 个 Command、14 个 Query、5 个 Inbound Event / Callback、10 个 Outbound Material、6 个 Operations Job 全部进入 P0 最小协议和流程测试切口。后续 Step 6 再按切口展开具体用例。 |
| 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口? | anchor/lifecycle、role/source、career、memory、read visibility、projection、reference、reconciliation、outbox、handoff、idempotency、stored result、job report、config/runtime/adapter/entry 状态均单列。same-UoW、rollback/commit visibility、stored replay save-before-complete、commit unknown、version/unique conflict、append-only、reference bundle version、projection rebuild race、outbox/handoff reentry、partial job report、duplicate no-rerun 均单列。 |
| 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口? | missing metadata / actor / idempotency key、unsupported schema version、wrong stored surface kind、missing stored result/receipt/report、invalid external ref、forbidden body、missing topic/target binding、disabled adapter default success、empty trace refs、cursor-as-version、source version-as-bundle version、ad hoc view ref、query diagnostic write、current truth 重算 duplicate result 均必须负向覆盖。 |
| 哪些状态名必须以详细设计正式 enum variant 为准? | `IdentityAnchorStateKind`、`GlobalLifecycleStateKind`、role source / role summary states、work source / career record states、memory source / memory reference states、read disposition、query surface priority、member summary freshness、`ProjectionStateKind`、`ReferenceResolutionStateKind`、`ReconciliationReportStateKind`、`OutboxStateKind`、`HandoffStateKind`、idempotency state、stored result kind、job result kind、config validation、runtime assembly、adapter availability 和 entry validation / dispatch states。 |
| 每个测试切口回指哪个详细设计对象、协议、flow、状态矩阵、持久化契约或错误模型? | 本 Step §8.2 按切口列出设计真相源。主要来源为 `03` §5~§16、`03_ddd_step_16_test_cuts.md` 和 `04` §12。 |
| 哪些 P0 设计契约还没有测试切口承接? | 当前未发现未承接的 P0 大类。字段级用例、TC 编号和 evidence 由 Step 6~13 继续展开,但 P0 测试对象和切口入口已全部覆盖。 |
| 每个 P0 测试切口完成后是否通过停审? | 通过。见 §8.3 停审记录。后续 Step 6 仍需对每个具体用例做小循环停审。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 只按历史主流程列用例,没有从正式模块、协议、状态和一致性契约抽取测试对象 | 重新按 `03` §5~§16 建测试对象与切口 |
| `03_ddd_step_16_test_cuts.md` | 已有最小切口,但还不是正式 `05` 的对象 / 切口章节 | 本 Step 转译成 `05` Step 3 中间产物 |
| 状态机测试 | Step 16 有状态切口,但后续用例容易使用口语状态 | 本 Step 明确所有状态名以 Step 10 正式 enum / state value 为准 |
| 配置测试 | `04` 已给测试承接表,但未纳入 `05` 的测试对象表 | 本 Step 将配置 profile / validation / redaction / degraded/no-write 纳入切口 |
| 下游接缝 | 容易把相邻仓完整行为误纳入本仓测试对象 | 本 Step 只承接 ref / snapshot / event / handoff / adapter 接缝 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试对象抽取方式 | 旧草稿按测试层级和主流程罗列 | 按模块、对象、协议、flow、状态、一致性、配置、观测抽取 | 符合 SOP “先测试对象,后用例” |
| 协议覆盖 | 未覆盖全部 Command / Query / Event / Job | 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Job 全部进入切口 | 避免孤儿 public protocol |
| 状态覆盖 | 只覆盖少量业务状态 | 所有 Step 10 状态族全部进入切口 | 防止非法转换未测 |
| 负向测试入口 | 旧草稿以权限和查询建档为主 | 增加 missing metadata、unsupported version、wrong result、body rejected、topic missing、ad hoc view ref、fake default success 等 | 对齐可落码性风险 |
| 配置 / 观测 | 旧草稿只写环境表 | 增加 config validation、redaction、metric label、audit refs-only 切口 | 对齐 `04` 和 `03` Step 15 |

## 7. 测试设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否直接复制 Step 16 全表 | A. 直接复制;B. 转译成对象 / 切口 / 停审 / 审计 | 采用 B。`05` 需要形成测试方案章节,不是重复详细设计 |
| 是否每个 Command 单独成为测试对象 | A. 是;B. 只按 Command family | 采用 A。public protocol 必须无孤儿 |
| 是否每个状态族单独成为测试切口 | A. 是;B. 只测核心业务状态 | 采用 A。非法转换是 P0 风险 |
| 是否把真实相邻仓内部流程纳入对象 | A. 纳入;B. 只测 identity seam | 采用 B。符合 Step 2 非范围 |
| 是否把 P1/P2 产品接入纳入 P0 切口 | A. 纳入;B. 只保留 seam / future risk | 采用 B。产品未锁定不阻塞 P0 |

## 8. 结构化中间产物

### 8.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `identity-contracts` protocol DTO / refs / metadata | `03` §5 / §7;Step 8 | `contracts_protocol_surface_roundtrip`;`contracts_body_free_command_schema`;`contracts_metadata_validation` | DTO 缺字段、二级类型缺 schema、digest 漂移、body 泄露 | contract unit |
| domain truth object and policies | `03` §5 / §6;Step 6 / 10 | `domain_truth_factory_invariants`;`domain_state_transition_guards`;`domain_policy_accept_reject` | 不变量缺失、policy reject 漏测、非法转换通过 | domain unit |
| application command orchestration | `03` §7.3 / §8;Step 9 / 11 / 13 | `application_command_transaction_order`;`application_command_replay_no_rerun`;6 个 `*_command_*` cuts | UoW 顺序错、outbox / result 漏写、duplicate 重跑 | service + API |
| query read surface | `03` §7.4 / §8;Step 9 / 10 | `query_visibility_first`;`query_no_write_side_effects`;14 个 `*_query` cuts | query 修复 truth、not visible / degraded surface 缺失 | query service / handler |
| inbound consumers and callbacks | `03` §7.5 / §8;Step 8 / 9 / 13 | `inbound_envelope_validation`;`inbound_duplicate_receipt_replay`;5 个 `*_event` / `*_callback` cuts | unsupported version 误解析、外部正文入仓、duplicate 重写 | worker / service |
| outbound material and publisher | `03` §7.6 / §8.5;Step 8 / 11 / 12 | `outbound_material_accepted_only`;`outbound_payload_marker_snapshot`;10 个 `*_outbound_material` cuts | payload 现查现造、topic 缺失、publish failure 回滚 truth | contract + job |
| operations jobs | `03` §7.7 / §8.6;Step 9 / 11 / 13 | `job_entry_dispatch_only`;`job_duplicate_report_replay`;6 个 `*_job` cuts | job 反写真相、duplicate 重新执行、partial report 缺失 | job runner / job service |
| repositories / UoW / stores | `03` §6.3 / §11;Step 7 / 11 | `infra_repository_version_and_unique`;`transaction_staged_visibility_and_rollback`;`idempotency_complete_after_stored_surface` | version 来源缺失、rollback 边界错、result surface 不一致 | repository fake / service |
| source resolver / publisher / handoff adapters | `03` §6.3 / §13;Step 7 / 14 | `infra_adapter_failure_injection`;`adapter_availability_surface`;`publisher_saved_marker_only`;`handoff_delivery_marker_only` | fake 伪成功、adapter body 泄露、failure mapping 错 | adapter fake / integration |
| runtime config and profile | `04` §6 / §9 / §11 / §12 | `config_ownership_boundary`;`config_redline_validation`;`config_runtime_builder_order`;`config_invalid_runtime_not_assembled` | invalid config fallback、profile 泄露 fake、config 改 truth | config / runtime test |
| observability / redaction | `03` §14;`04` §8 / §12 | `log_forbidden_material_negative_scan`;`metric_low_cardinality_labels`;`audit_query_no_business_write`;`redaction_fake_private_material` | raw body / secret / high-cardinality ref 出现在 artifact | observability / scan |
| architecture dependency boundary | `01` §8;`03` §5 / §13 | `config_non_core_dependency_guard`;`non_core_sibling_not_source_dependency` | 非 core sibling 编译期依赖打穿裁剪 | static architecture check |

### 8.2 测试切口设计真相源表

| 测试切口 | 设计真相源 | 覆盖字段 / 状态 / 协议 / 错误 | P0/P1/P2 | 后续用例要求 |
|---|---|---|---|---|
| `contracts_protocol_surface_roundtrip` | `03` §7;Step 8 | Command / Query / Inbound / Outbound / Job / View / Error DTO、schema version、required fields | P0 | 每类 public DTO 至少 roundtrip + missing required |
| `contracts_body_free_command_schema` | `03` §7.3;§14;Step 16 | 6 个 Command DTO 只含 refs/markers/safe summary refs | P0 | 每个 Command 做 forbidden body negative scan |
| `domain_truth_factory_invariants` | `03` §6;Step 6 | truth object factory、不变量、body-free ref | P0 | 每个 truth object 至少 happy + invariant reject |
| `domain_state_transition_guards` | `03` §9;Step 10 / 16 | 正式 state enum 合法 / 非法迁移、terminal guard | P0 | 每个状态族至少合法主线、边界合法、非法转换 |
| command cut family | `03` §7.3 / §8;Step 9 / 11 / 13 | request/result、effect summary、UoW、stored result、duplicate / conflict | P0 | 6 个 Command 覆盖 accepted、reject、duplicate、version/digest conflict |
| query cut family | `03` §7.4 / §8;Step 9 / 16 | visibility-first、missing、empty、not visible、stale/degraded、no-write | P0 | 14 个 Query 覆盖 hit + no-write;关键 query 覆盖 visibility / degraded |
| inbound / callback cut family | `03` §7.5 / §8;Step 9 / 13 | envelope、schema version、dedup、receipt、delayed/quarantined/noop | P0 | 5 个 Consumer/Callback 覆盖 accepted、duplicate、unsupported、delayed/rejected |
| outbound material cut family | `03` §7.6 / §8.5;Step 8 / 11 | stored payload marker、topic-neutral key、forbidden body absent | P0 | 10 个 outbound material 覆盖 payload mapping + no body |
| operations job cut family | `03` §7.7 / §8.6;Step 9 / 13 | job metadata、stored report、partial failure、duplicate replay、no truth repair | P0 | 6 个 Job 覆盖 completed、invalid input、partial/failed、duplicate |
| consistency / idempotency cuts | `03` §11~§13;Step 16 | version、UoW、stored result / receipt / report、commit unknown、race guard | P0 | 每个 duplicate family 覆盖 same digest replay + different digest conflict |
| config test cuts | `04` §6 / §9 / §11 / §12 | strict JSON、source priority、profile matrix、topic completeness、runtime builder fail-fast | P0 | 每个 P0 profile 装配;invalid config negative |
| redaction / observability cuts | `03` §14;`04` §8 / §12 | log、metric、audit、trace、report、outbox forbidden body absent | P0 | 运行 redaction scan + representative negative leakage fixture |

### 8.3 P0 测试切口停审记录

| 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts_protocol_surface_roundtrip` | 设计来源明确;覆盖 public DTO;后续可落地 | 通过 | Step 6 需拆到每个 DTO family |
| `contracts_body_free_command_schema` | body-free 来源明确;风险具体 | 通过 | Step 6 / Step 10 需覆盖 scan 和 negative fixture |
| `domain_truth_factory_invariants` | 对象来源明确;风险具体;层级合理 | 通过 | Step 6 需按对象组列具体断言 |
| `domain_state_transition_guards` | enum 来源明确;禁止口语状态 | 通过 | Step 6 必须使用正式 state value |
| command cut family | flow / UoW / stored result 来源明确 | 通过 | Command 数量大,需分批设计用例 |
| query cut family | no-write 风险具体;层级合理 | 通过 | 需要 repository write audit helper 或 spy |
| inbound / callback cut family | event schema / dedup / receipt 来源明确 | 通过 | 来源仓只测 seam |
| outbound material cut family | outbox snapshot / no body 来源明确 | 通过 | topic map evidence 后续 Step 9 / 13 承接 |
| operations job cut family | report replay / no truth repair 来源明确 | 通过 | job report evidence 后续 Step 13 承接 |
| consistency / idempotency cuts | version / replay / race 来源明确 | 通过 | Step 6 需覆盖 stored surface missing no recompute |
| config test cuts | `04` 来源明确;P0 profile 明确 | 通过 | production-like future only,不作为 P0 |
| redaction / observability cuts | forbidden body 风险具体 | 通过 | redaction scan 脚本契约后续 Step 9 / 13 承接 |
| dependency boundary cut | VETO-ID-006 来源明确 | 通过 | 需要实现仓 dependency check 脚本或 manual gate |

### 8.4 跨切口设计来源审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 七个 crate 是否都有测试切口 | 通过 | `identity-contracts/domain/application/infra/api/worker/jobs` 均已覆盖 |
| 6 个 Command 是否有协议和流程测试入口 | 通过 | 已通过 command cut family 承接,Step 6 逐项展开 |
| 14 个 Query 是否有 read surface 和 no-write 入口 | 通过 | 已通过 query cut family 承接,Step 6 逐项展开 |
| 5 个 Inbound / Callback 是否有 accepted / duplicate / unsupported / delayed 入口 | 通过 | 已通过 inbound / callback family 承接 |
| 10 个 Outbound Material 是否有 payload snapshot / no body / publish failure 入口 | 通过 | 已通过 outbound material cuts 承接 |
| 6 个 Operations Job 是否有 report replay / partial failure / no truth repair 入口 | 通过 | 已通过 job cuts 承接 |
| Step 10 状态族是否有合法 / 非法入口 | 通过 | 已通过 `domain_state_transition_guards` 和 state cut family 承接 |
| 事务、一致性、幂等、恢复是否单列 | 通过 | UoW、version、duplicate、commit unknown、race、rollback 均有切口 |
| 配置、profile、adapter failure、redaction 是否承接 `04` | 通过 | 已覆盖 config validation、runtime builder、redaction、degraded/no-write |
| 是否存在重复切口导致职责混淆 | 通过 | command / query / consumer / job / config / observability 分层清楚 |
| 是否存在 P0 孤儿设计契约 | 通过 | 当前未发现。字段级细化留 Step 6 |
| 是否存在 phase boundary 越界 | 通过 | P1/P2 产品和真实跨仓 E2E 未升为 P0 |

### 8.5 字段 / DTO / 引用混同负向切口清单

| 风险 | 对应切口 | 设计来源 | 后续用例要求 |
|---|---|---|---|
| missing metadata / actor / idempotency key | `invalid_request_no_uow`;`contracts_metadata_validation` | `03` §7 / §11 | 断言不 begin mutation UoW |
| unsupported schema version | `unsupported_event_version_no_parse` | `03` §7.5 / §11 | 断言不 parse payload、不写 snapshot |
| external body / forbidden body 入仓 | `error_forbidden_body_rollback_or_quarantine`;redaction cuts | `01` §9;`03` §11 / §14 | 断言 truth/outbox/audit/report/log 均无 body |
| cursor 当 optimistic version | consistency cuts | `03` §11;§12 | 断言写路径使用正式 loaded version |
| source version 当 reference bundle version | `concurrency_reference_sidecar_bundle_version` | `03` §12;Step 16 | 断言 bundle save 使用正式 loaded reference version |
| ad hoc derived view ref | `query_no_write_side_effects`;projection cuts | `03` §7 / §11 / §15 | 断言 view ref 来自正式 lookup / builder |
| current truth 重算 duplicate result | `negative_no_replay_from_current_truth` | `03` §11~§13 | 断言返回 replay consistency defect |
| query diagnostic write | `negative_no_query_diagnostic_write` | `03` §11 / §14 | 断言 query 不写 trace/audit/stored/repair marker |
| fake adapter 伪成功 | `negative_fake_no_default_success`;`disabled_adapter_no_fake_success` | `03` §14;`04` §11 | fake/disabled 必须返回 formal issue/outcome |
| non-core sibling source dependency | `config_non_core_dependency_guard` | `01` §8;`00` VETO-ID-006 | 断言除 `L0-core` 外无 sibling business compile-time dependency |

## 9. 对上游设计的影响判定

| 测试对象结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 测试对象和切口均来自 `03` / `04` | 否 | 测试方案转译 | 无需回写 |
| 当前未发现 P0 孤儿设计契约 | 否 | 来源审计 | 无需回写 |
| 字段级用例留 Step 6 展开 | 否 | 测试方案分工 | 符合 SOP |
| 后续若某对象字段无法构造测试输入 | 是 | DTO / fixture 可验证性缺口 | 回写 `03` 或记录阻塞 |
| 后续若 repository / adapter 缺 failure injection | 是 | fake adapter 测试能力缺口 | 回写实施计划或详细设计承接 |
| 后续若 redaction/evidence 没有可执行脚本产面 | 是 | 测试 / 验收闭环缺口 | 在 Step 9 / Step 13 闭合 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_03_test_objects_cuts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试对象与测试切口总表”“测试切口设计真相源表”“P0 测试切口停审记录”和“跨切口设计来源审计表”小节,了解测试对象如何从详细设计收敛。

正式 `05-测试方案.md` §3 应回填:

- 测试对象按模块、对象 / policy、协议、flow、状态、一致性、配置和观测组织,不按旧主流程自由罗列。
- P0 测试切口包括 contracts roundtrip、body-free schema、domain invariants、state guards、command orchestration、query no-write、consumer/callback orchestration、outbound material snapshot、operations job report replay、repository / UoW / idempotency、config validation、redaction / observability 和 dependency boundary。
- 6 Command、14 Query、5 Inbound / Callback、10 Outbound Material、6 Operations Job 均有测试入口。
- 每个 P0 测试切口必须回指 `03` / `04` 具体设计真相源。
- 字段缺失、DTO 构造失败、unsupported version、external body 入仓、cursor-as-version、source-version-as-bundle-version、ad hoc view ref、duplicate current truth recompute、query diagnostic write 和 fake adapter 伪成功都必须作为负向测试切口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 需要拆分大量具体用例 | 用例矩阵规模大 | 后续按 module / protocol family / state / consistency 分批写入 |
| repository write audit helper 是否作为测试工具实现 | 影响 query no-write 和 job no truth repair 断言 | Step 4 / Step 9 再确定测试层级和自动化门禁 |
| dependency boundary check 的执行方式 | 影响 VETO-ID-006 evidence | Step 9 确定脚本或 manual gate |
| P1 real-like seam 是否提前形成用例 | 影响 integration-like 深度 | 当前不阻塞 P0,Step 14 记录残余风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 测试对象都有明确切口 | 通过 | 见 §8.1 / §8.2 |
| 每个 P0 测试切口已停审 | 通过 | 见 §8.3 |
| 跨切口设计来源审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 字段 / DTO / 引用混同负向入口已记录 | 通过 | 见 §8.5 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 4 | 待用户确认 | 用户审核通过后进入 Step 4: 制定测试策略与分层 |
