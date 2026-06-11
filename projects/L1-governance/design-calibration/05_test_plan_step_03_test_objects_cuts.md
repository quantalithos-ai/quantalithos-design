# Step 3. 抽取测试对象与测试切口

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节: `05-测试方案.md` §3 测试对象与测试切口

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 抽取测试对象与测试切口 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 测试范围;`03-详细设计.md` §5~§16;`03_ddd_step_16_test_cuts.md`;`04-配置设计.md` §12 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_03_test_objects_cuts.md` |
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
| `05_test_plan_step_02_scope.md` | 已完成 | 固定 P0 / P1 / P2 和非范围 |
| `03-详细设计.md` §5 / §6 | 正式输入 | 抽取模块、对象、policy、trait / port / adapter 测试对象 |
| `03-详细设计.md` §7 / §8 | 正式输入 | 抽取 Command、Query、Inbound Consumer、Outbound Event、Job 和函数级 flow 测试对象 |
| `03-详细设计.md` §9~§15 | 正式输入 | 抽取状态机、事务、错误、幂等、配置、观测测试对象 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 采用最小测试切口名和设计来源 |
| `04-配置设计.md` §12 | 直接输入 | 抽取配置 profile、strict JSON、source priority、sensitive/no-output、runtime builder、degraded/no-write 测试对象 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 domain object / value object / policy 必须单测? | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、reference / projection / trace / audit / outbox / handoff object,以及 `GovernanceTruthPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`SharedRulesPolicy`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy`、`ReadVisibilityPolicy` 等 policy。 |
| 哪些 application service 必须做 service test? | 所有 command orchestration、query no-write、consumer orchestration、outbox publish、projection rebuild、reference refresh、reconciliation、trace handoff、archive handoff、external GRC export、idempotency / stored result / receipt / report 和 error mapping 都必须做 service 或 runner 层测试。 |
| 哪些 repository / adapter / worker 必须做集成测试? | truth repository、projection repository、reference snapshot repository、outbox store、idempotency / result / report store、handoff / export marker store、UnitOfWork fake、source resolver fake、publisher fake、handoff / archive / external GRC fake、runtime builder、worker consumer 和 outbox publisher 都必须验证 version、page、unique、rollback、failure injection、stored snapshot、duplicate replay 和 redaction 语义。 |
| 哪些 Command / Query / Event / Job 必须做协议和流程测试? | 23 个 Command、14 个 Query、9 个 Inbound Consumer、13 个 Outbound Event、7 个 Operations Job 全部进入 P0 最小协议和流程测试切口。后续 Step 6 再按切口展开具体用例。 |
| 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口? | 23 组状态机、command / consumer / job duplicate replay、same key different digest conflict、stored result missing no recompute、commit unknown recovery、UoW ordering、outbox enqueue rollback、publisher single-winner、projection cursor race、reference state version、handoff trace refs non-empty、query no-write、maintenance job no truth repair、rollback failure surface 均单列。 |
| 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口? | missing metadata / actor / idempotency / required ref、unsupported schema version、wrong result kind、missing stored result、invalid external ref、body / digest mismatch、missing topic binding、disabled target、empty trace refs、ad hoc projection view ref、cursor-as-version、process/work/conversation/runtime state 替代 Decision truth、external body 进入 outbox/audit/report 均必须负向覆盖。 |
| 哪些状态名必须以详细设计正式 enum variant 为准? | `GovernanceContextState`、`GovernanceInputState`、`GateState`、`GovernanceDecisionState`、`ApprovalResponsibilityState`、`ResponsibilityChainState`、`PolicyEffectiveState`、`SharedRuleSetState`、`PolicyConflictState`、`ControlApplicabilityState`、`ControlReviewState`、`ComplianceConclusionState`、`NonconformityState`、`CorrectiveActionState`、`VerificationState`、`DerivedGovernanceViewFreshnessState`、`ReferenceResolutionKind`、`OutboxPublicationState`、`ReconciliationReportState`、`GovernanceHandoffState`、`GovernanceJobReportState`、`GovernanceIdempotencyState` 和 runtime / entry disposition states。 |
| 每个测试切口回指哪个设计真相源? | 本 Step §8.2 按切口列出设计真相源。主要来源为 `03_ddd_step_05`~`03_ddd_step_16` 和 `04` §12。 |
| 哪些 P0 设计契约还没有测试切口承接? | 当前未发现未承接的 P0 大类。详细对象字段级切口将在 Step 6 按对象和协议继续拆细,但 P0 测试对象和切口入口已全部覆盖。 |
| 每个 P0 测试切口完成后是否通过停审? | 通过。见 §8.3 停审记录。后续 Step 6 仍需对每个具体用例做小循环停审。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 只按少量主流程列用例,没有从正式模块、协议、状态和一致性契约抽取测试对象 | 重新按 `03` §5~§16 建测试对象与切口 |
| `03_ddd_step_16_test_cuts.md` | 已有最小切口,但还不是正式 `05` 的对象 / 切口章节 | 本 Step 转译成 `05` Step 3 中间产物 |
| 状态机测试 | Step 16 有状态切口,但后续用例容易使用口语状态 | 本 Step 明确所有状态名以 Step 10 正式 enum 为准 |
| 配置测试 | `04` 已给测试承接表,但未纳入 `05` 的测试对象表 | 本 Step 将配置 profile / validation / redaction / degraded/no-write 纳入切口 |
| 下游接缝 | 容易把相邻仓完整行为误纳入本仓测试对象 | 本 Step 只承接 ref / snapshot / event / handoff / adapter 接缝 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试对象抽取方式 | 旧草稿按测试层级和主流程罗列 | 按模块、对象、协议、flow、状态、一致性、配置、观测抽取 | 符合 SOP “先测试对象,后用例” |
| 协议覆盖 | 未覆盖全部 Command / Query / Event / Job | 23 Command、14 Query、9 Consumer、12 Event、7 Job 全部进入切口 | 避免孤儿 public protocol |
| 状态覆盖 | 只覆盖少量业务状态 | 23 组状态机全部进入切口 | 防止非法转换未测 |
| 负向测试入口 | 旧草稿以权限和 request closed 为主 | 增加 missing metadata、unsupported version、wrong result、body rejected、topic missing、ad hoc view ref 等 | 对齐可落码性风险 |
| 配置 / 观测 | 旧草稿只写环境表 | 增加 config validation、redaction、metric label、audit refs-only 切口 | 对齐 `04` 和 `03` Step 15 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接复制 Step 16 全表 | A. 直接复制;B. 转译成对象 / 切口 / 停审 / 审计 | 采用 B。`05` 需要形成测试方案章节,不是重复详细设计 |
| 是否每个 Command 单独成为测试对象 | A. 是;B. 只按 Command family | 采用 A。public protocol 必须无孤儿 |
| 是否每个状态机单独成为测试切口 | A. 是;B. 只测核心业务状态 | 采用 A。非法转换是 P0 风险 |
| 是否把真实相邻仓内部流程纳入对象 | A. 纳入;B. 只测 Governance seam | 采用 B。符合 Step 2 非范围 |
| 是否把 P1/P2 产品接入纳入 P0 切口 | A. 纳入;B. 只保留 seam / future risk | 采用 B。产品未锁定不阻塞 P0 |

## 8. 结构化中间产物

### 8.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `contracts` protocol DTO / refs / metadata | `03` §5 / §7;Step 8 | `contracts_protocol_roundtrip`;`contracts_metadata_validation`;`contracts_operation_digest_profile` | DTO 缺字段、二级类型缺 schema、digest 漂移 | contract unit |
| domain truth object and policies | `03` §5 / §6;Step 6 / 10 | `domain_object_invariants`;`domain_policy_accept_reject`;`domain_state_matrix_transitions` | 不变量缺失、policy reject 漏测、非法转换通过 | domain unit |
| application command orchestration | `03` §8.1;Step 9 / 11 / 13 | `application_command_orchestration`;23 个 `*_contract` command cuts | UoW 顺序错、outbox / result 漏写、duplicate 重跑 | service + API |
| query read surface | `03` §7.2 / §8.2;Step 9 / 10 | `application_query_no_write`;14 个 `*_query` cuts | query 修复 truth、not visible / degraded surface 缺失 | query service / handler |
| inbound consumers | `03` §7.3 / §8.3;Step 8 / 9 / 13 | `application_consumer_orchestration`;9 个 `*_event` cuts | unsupported version 误解析、外部正文入仓、duplicate 重写 | worker / service |
| outbound events and publisher | `03` §7.3 / §8.4;Step 8 / 11 / 12 | 12 个 `*_event_schema` cuts;`publisher_retryable_failure_marker`;`publisher_dead_letter_marker` | payload 现查现造、topic 缺失、publish failure 回滚 truth | contract + worker |
| operations jobs | `03` §7.4 / §8.4;Step 9 / 11 / 13 | 7 个 `*_job` cuts;`maintenance_job_no_truth_repair` | job 反写真相、duplicate 重新执行、partial report 缺失 | job runner |
| repositories / UoW / stores | `03` §5.3 / §10;Step 7 / 11 | `infra_repository_semantics`;`stored_result_saved_before_idempotency_complete`;`idempotency_complete_failure_rolls_back` | version 来源缺失、rollback 边界错、result surface 不一致 | repository fake / service |
| source resolver / publisher / handoff adapters | `03` §5.4 / §13;Step 7 / 14 | `infra_adapter_failure_injection`;`source_unavailable_mapping`;`handoff_failure_marker_or_report` | fake 伪成功、adapter body 泄露、failure mapping 错 | adapter fake / integration |
| runtime config and profile | `04` §6 / §9 / §12 | `infra_runtime_config_validation`;`config_validation_fail_fast`;`forbidden_boundary_not_configurable` | invalid config fallback、profile 泄露 fake、config 改 truth | config test |
| observability / redaction | `03` §14;`04` §8 / §12 | `observability_and_redaction_contract`;`logs_do_not_include_forbidden_body`;`metrics_low_cardinality_labels`;`audit_uses_refs_only` | raw body / secret / high-cardinality ref 出现在 artifact | observability / script |
| architecture dependency boundary | `01` §8;`03` §5 / §13 | `non_core_sibling_not_cargo_dependency` | 非 core sibling 编译期依赖打穿裁剪 | architecture check |

### 8.2 测试切口设计真相源表

| 测试切口 | 设计真相源 | 覆盖字段 / 状态 / 协议 / 错误 | P0/P1/P2 | 后续用例要求 |
|---|---|---|---|---|
| `contracts_protocol_roundtrip` | `03` §7;Step 8 | Command / Query / Event / Job / View / Error DTO、schema version、required fields | P0 | 每类 public DTO 至少 roundtrip + missing required |
| `domain_object_invariants` | `03` §6;Step 6 | truth object factory、不变量、body-free ref | P0 | 每个 truth object 至少 happy + invariant reject |
| `domain_state_matrix_transitions` | `03` §9;Step 10 / 16 | 23 组正式 state enum 合法 / 非法迁移 | P0 | 每组状态机至少合法主线、边界合法、非法转换 |
| `application_command_orchestration` | `03` §8.1;Step 9 / 11 / 13 | validate -> reserve -> UoW -> truth -> trace/audit/outbox/stale/result -> commit | P0 | 每个 Command 覆盖 accepted、reject、duplicate、version conflict |
| `application_query_no_write` | `03` §7.2 / §8.2;Step 9 / 16 | missing / not visible / degraded / stale / failed / empty;no write UoW | P0 | 每个 Query 覆盖 hit + no-write;关键 query 覆盖 visibility / degraded |
| `application_consumer_orchestration` | `03` §7.3 / §8.3;Step 9 / 13 | event envelope、schema version、dedup、snapshot/reference/stale/receipt | P0 | 每个 Consumer 覆盖 accepted、duplicate、unsupported、delayed/rejected |
| outbound event schema cuts | `03` §7.3 / §8.4;Step 8 / 11 | stored payload snapshot、topic-neutral key、forbidden body absent | P0 | 每个 outbound event 覆盖 payload mapping + no body |
| operations job cuts | `03` §7.4 / §8.4;Step 9 / 13 | job metadata、stored report、partial failure、duplicate replay、no truth repair | P0 | 每个 Job 覆盖 completed、invalid input、partial/failed、duplicate |
| consistency / idempotency cuts | `03` §10~§12;Step 11~13 / 16 | version、UoW、stored result / receipt / report、commit unknown、race guard | P0 | 每个 duplicate family 覆盖 same digest replay + different digest conflict |
| config test cuts | `04` §6 / §9 / §11 / §12 | strict JSON、source priority、profile matrix、topic completeness、runtime builder fail-fast | P0 | 每个 P0 profile 装配;invalid config negative |
| redaction / observability cuts | `03` §14;`04` §8 / §12 | log、metric、audit、trace、report、outbox forbidden body absent | P0 | 运行 redaction scan + representative negative leakage fixture |

### 8.3 P0 测试切口停审记录

| 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | 设计来源明确;覆盖 public DTO;后续可落地 | 通过 | Step 6 需拆到每个 DTO family |
| `domain_object_invariants` | 对象来源明确;风险具体;层级合理 | 通过 | Step 6 需按对象组列具体断言 |
| `domain_state_matrix_transitions` | enum 来源明确;禁止口语状态 | 通过 | Step 6 必须使用正式 variant |
| `application_command_orchestration` | flow / UoW / stored result 来源明确 | 通过 | Command 数量大,需分批设计用例 |
| `application_query_no_write` | no-write 风险具体;层级合理 | 通过 | 需要 repository write audit helper |
| `application_consumer_orchestration` | event schema / dedup / stale 来源明确 | 通过 | 来源仓只测 seam |
| outbound event schema cuts | outbox snapshot / no body 来源明确 | 通过 | topic map evidence 后续 Step 9 / 13 承接 |
| operations job cuts | report replay / no truth repair 来源明确 | 通过 | job report evidence 后续 Step 13 承接 |
| consistency / idempotency cuts | version / replay / race 来源明确 | 通过 | Step 6 需覆盖 stored result missing no recompute |
| config test cuts | `04` 来源明确;P0 profile 明确 | 通过 | production-like fake reject 作为 future negative |
| redaction / observability cuts | forbidden body 风险具体 | 通过 | redaction scan 脚本契约后续 Step 9 / 13 承接 |
| dependency boundary cut | VF-GOV-010 来源明确 | 通过 | 需要实现仓 dependency check 脚本或人工 gate |

### 8.4 跨切口设计来源审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 七个模块是否都有测试切口 | 通过 | `contracts/domain/application/infra/api/worker/jobs` 均已覆盖 |
| 23 个 Command 是否有协议和流程测试入口 | 通过 | 已通过 command contract family 承接,Step 6 逐项展开 |
| 14 个 Query 是否有 read surface 和 no-write 入口 | 通过 | 已通过 query family 承接,Step 6 逐项展开 |
| 9 个 Inbound Consumer 是否有 accepted / duplicate / unsupported / delayed 入口 | 通过 | 已通过 consumer family 承接 |
| 13 个 Outbound Event 是否有 payload snapshot / no body / publish failure 入口 | 通过 | 已通过 outbound schema cuts 承接 |
| 7 个 Operations Job 是否有 report replay / partial failure / no truth repair 入口 | 通过 | 已通过 job cuts 承接 |
| 23 组状态机是否有合法 / 非法入口 | 通过 | 已通过 `domain_state_matrix_transitions` 和 technical state cuts 承接 |
| 事务、一致性、幂等、恢复是否单列 | 通过 | UoW、version、duplicate、commit unknown、race、rollback 均有切口 |
| 配置、profile、adapter failure、redaction 是否承接 `04` | 通过 | 已覆盖 config validation、runtime builder、redaction、degraded/no-write |
| 是否存在重复切口导致职责混淆 | 通过 | command / query / consumer / job / config / observability 分层清楚 |
| 是否存在 P0 孤儿设计契约 | 通过 | 当前未发现。字段级细化留 Step 6 |
| 是否存在 phase boundary 越界 | 通过 | P1/P2 产品和真实跨仓 E2E 未升为 P0 |

### 8.5 字段 / DTO / 引用混同负向切口清单

| 风险 | 对应切口 | 设计来源 | 后续用例要求 |
|---|---|---|---|
| missing metadata / actor / idempotency key | `invalid_request_no_uow`;`contracts_metadata_validation` | `03` §7 / §11 | 断言不 begin UoW |
| unsupported schema version | `unsupported_event_version_no_parse` | `03` §7.3 / §11 | 断言不 parse payload、不写 snapshot |
| external body / forbidden body 入仓 | `digest_mismatch_and_body_rejected`;redaction cuts | `01` §9;`03` §11 / §14 | 断言 truth/outbox/audit/report/log 均无 body |
| cursor 当 optimistic version | consistency cuts | `03` §10;Step 11 | 断言写路径使用正式 version |
| ad hoc derived view ref | `projection_dependency_index_is_only_source` | `03` Step 11 / 16 | 断言 affected views 来自正式 repository |
| current truth 重算 duplicate result | `duplicate_result_missing_no_recompute` | `03` §12;Step 13 | 断言返回 consistency error |
| process/work/conversation/runtime 替代 Decision truth | boundary cuts;VF-GOV-002 | `00` BR-GOV-012~017;`01` §4 / §9 | 断言只保存 ref / snapshot / marker |
| external GRC 定义 Governance truth | external GRC job/config cuts | `01` §13;`04` §12 | disabled 不阻断 core truth;enabled failure 不改 truth |
| fake adapter 伪成功 | config / adapter cuts | `03` §5.4;`04` §6 / §11 | fake 也必须走正式 state、receipt、report |

## 9. 对上游设计的影响判定

| 测试对象结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 测试对象和切口均来自 `03` / `04` | 否 | 测试方案转译 | 无需回写 |
| 当前未发现 P0 孤儿设计契约 | 否 | 来源审计 | 无需回写 |
| 字段级用例留 Step 6 展开 | 否 | 测试方案分工 | 符合 SOP |
| 后续若某对象字段无法构造测试输入 | 是 | DTO / fixture 可验证性缺口 | 回写 `03` 或记录阻塞 |
| 后续若 repository / adapter 缺 failure injection | 是 | fake adapter 测试能力缺口 | 回写实施计划或详细设计承接 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_03_test_objects_cuts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试对象与测试切口总表”“测试切口设计真相源表”“P0 测试切口停审记录”和“跨切口设计来源审计表”小节,了解测试对象如何从详细设计收敛。

正式 `05-测试方案.md` §3 应回填:

- 测试对象按模块、对象 / policy、协议、flow、状态、一致性、配置和观测组织,不按旧主流程自由罗列。
- P0 测试切口包括 contracts roundtrip、domain invariants、state matrix、command orchestration、query no-write、consumer orchestration、outbound event snapshot、operations job report replay、repository / UoW / idempotency、config validation、redaction / observability 和 dependency boundary。
- 23 Command、14 Query、9 Inbound Consumer、12 Outbound Event、7 Operations Job 均有测试入口。
- 每个 P0 测试切口必须回指 `03` / `04` 具体设计真相源。
- 字段缺失、DTO 构造失败、unsupported version、external body 入仓、cursor-as-version、ad hoc view ref、duplicate current truth recompute 和 fake adapter 伪成功都必须作为负向测试切口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 需要拆分大量具体用例 | 用例矩阵规模大 | 后续按 module / interface family / state / consistency 分批写入 |
| repository write audit helper 是否作为测试工具实现 | 影响 query no-write 和 job no truth repair 断言 | Step 4 / Step 9 再确定测试层级和自动化门禁 |
| dependency boundary check 的执行方式 | 影响 VF-GOV-010 evidence | Step 9 确定脚本或 manual gate |
| P1 real-like seam 是否提前形成用例 | 影响 integration-like 深度 | 当前不阻塞 P0,Step 14 记录残余风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 测试对象都有明确切口 | 通过 | 见 §8.1 / §8.2 |
| 每个 P0 测试切口已停审 | 通过 | 见 §8.3 |
| 跨切口设计来源审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 字段 / DTO / 引用混同负向入口已记录 | 通过 | 见 §8.5 |
| 可进入 Step 4 | 通过 | 下一步制定测试策略与分层 |
