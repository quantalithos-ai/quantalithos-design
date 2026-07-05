# Step 3. 抽取测试对象与测试切口

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节: `05-测试方案.md` §3 测试对象与测试切口

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 抽取测试对象与测试切口 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 测试范围;`02-概要设计.md` §5/§7/§8/§9/§11;`03-详细设计.md` §5~§15;`03_ddd_step_16_test_cuts.md`;`04-配置设计.md` §6/§9/§11/§12 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_03_test_objects_cuts.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 4 |

## 2. 本步目标

从概要和详细设计中抽取必须验证的测试对象,并把它们收敛为可追溯的测试切口。

本 Step 只回答:

- 哪些 module、domain object、support object、policy、application service、repository、adapter、worker、Command、Query、Inbound Consumer、Outbound Event、Operations Job、状态机、一致性、配置和观测行为必须进入测试对象。
- 每个测试切口回指哪个设计真相源。
- 哪些字段缺失、DTO 构造失败、引用混同、状态名漂移、phase boundary 越界和配置越权必须作为负向测试切口。
- P0 测试切口是否完成停审。
- 跨切口是否存在孤儿 P0 契约、重复切口或未承接风险。

本 Step 不生成具体 TC 编号、测试步骤、fixture、测试数据、CI suite、evidence ID 或验收结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已完成 | 固定 P0 / P1 / P2、非范围和一票否决关联 |
| `02-概要设计.md` §5 / §7 / §8 / §9 / §11 | 正式输入 | 抽取 10 个主要组成部分、五类接口骨架、关键处理流、状态组和配置影响轮廓 |
| `03-详细设计.md` §5 / §6 | 正式输入 | 抽取 7 模块、truth / support / derived / record / port 测试对象 |
| `03-详细设计.md` §7 / §8 | 正式输入 | 抽取 16 Command、13 Query、6 Consumer、8 Outbound Event、6 Operations Job 和 worker-only relay publication 测试对象 |
| `03-详细设计.md` §9~§15 | 正式输入 | 抽取状态机、事务、一致性、错误、幂等、配置和观测测试对象 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 采用最小测试切口名、负向入口和覆盖审计方式 |
| `04-配置设计.md` §6 / §9 / §11 / §12 | 直接输入 | 抽取 4 个 P0 profile、strict JSON、builder fail-fast、degraded / no-write、redaction 和 replay 测试对象 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 domain object / support object / policy 必须进入测试对象? | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersionCandidate`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactBaselineMembership`、`ArtifactIntakeContext`、`ArtifactSubmissionRecord`、`ArtifactReviewAnchor`、`ArtifactResponsibilityAssignment`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactConsumptionBackref`、各类 derived view / report / resolution state、trace / audit / relay / handoff / refresh record,以及 `ArtifactFactPolicy`、`ArtifactVersionPolicy`、`ArtifactLineagePolicy`、`ArtifactBaselinePolicy`、`ArtifactIntakePolicy`、`ArtifactReviewPolicy`、`AutomationBoundaryPolicy`、`ArtifactReadVisibilityPolicy`、`ArtifactTraceabilityPolicy`、`ExternalReferenceValidityPolicy`。 |
| 哪些 application service 必须做 service test? | 所有 command orchestration、query no-write、consumer orchestration、6 个 public job orchestration、worker-only relay publication、derived view rebuild、external reference refresh、reconciliation、archive / observability / sync handoff、idempotency / stored result / receipt / report 和 error mapping 都必须进入 service / runner 层测试对象。 |
| 哪些 repository / adapter / worker 必须做接缝测试? | truth repository、derived view repository、reference resolution repository、relay payload snapshot store、idempotency / stored result / stored report store、handoff marker store、fake UoW、resolver fake、publisher fake、archive / observability / sync handoff fake、runtime builder、consumer worker 和 relay publisher worker 都必须验证 version、page、unique、rollback、failure injection、stored snapshot、duplicate replay 和 redaction 边界。 |
| 哪些 public protocol 必须进入 P0 最小测试入口? | 16 个 Command、13 个 Query、6 个 Inbound Consumer、8 个 Outbound Event、6 个 public Operations Job 全部进入 P0 最小协议和流程测试切口;`PublishPendingArtifactRelays` 作为 worker-only internal publication facade 单独进入维护测试切口。 |
| 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口? | truth core、boundary / support、derived / report、relay / handoff、idempotency / entry disposition 四组状态机都必须单列。duplicate replay、same key different digest conflict、stored result missing no recompute、commit unknown recovery、UoW ordering、relay snapshot save、publisher single-winner、projection rebuild race、reference refresh race、query no-write、job no-truth-repair 和 rollback / partial failure 都必须单列。 |
| 哪些字段缺失、DTO 构造失败或引用混同必须作为负向测试切口? | missing actor / metadata / idempotency / required ref、unsupported schema version、wrong result kind、missing stored result、invalid selector、invalid scope / anchor / target、forbidden body、digest mismatch、topic binding 缺失、disabled target、cursor 当作 optimistic version、query 内部 refresh / repair、consumer 直写 truth、job 修 truth、typed ref 误替代 truth anchor 都必须作为负向测试入口。 |
| 哪些状态名必须以正式 enum family 为准? | `ArtifactFactState`、`ArtifactContentFactContextState`、`ArtifactVersionCandidateState`、`ArtifactVersionState`、`ArtifactLineageState`、`ArtifactBaselineState`、`ArtifactIntakeState`、`ArtifactReviewState`、`ArtifactResponsibilityAssignmentState`、`AutomationArtifactInputState`、`ConsumableArtifactReferenceState`、`ArtifactConsumptionBackrefState`、`ArtifactDerivedFreshnessState`、`ArtifactExternalResolutionState`、`ArtifactRelayOutcome`、`ArtifactReconciliationState`、`ArtifactHandoffState`、`ArtifactJobOutcome`、`ArtifactIdempotencyReservation` 和 runtime / entry disposition family。 |
| 每个测试切口回指哪个设计真相源? | 本 Step §8.3 按切口列出设计真相源。主来源为 `02` §5/§7/§8/§9/§11、`03` §5~§15、`03_ddd_step_16_test_cuts.md` 和 `04` §6/§9/§11/§12。 |
| 当前是否存在未被承接的 P0 大类? | 当前未发现未承接的 P0 大类。字段级断言、具体数据和执行层级在 Step 4~Step 9 继续拆细,但 Step 3 的测试对象入口已覆盖当前 P0 契约。 |
| 每个 P0 测试切口完成后是否通过停审? | 通过。见 §8.4 停审记录。后续 Step 6 仍需对每个具体用例继续做小循环停审。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 仍以旧主链和少量 happy path 组织,没有从新版 7 模块、五类接口、状态与一致性契约抽取测试对象 | 重新按 `02/03/04` 的当前基线建立测试对象与切口 |
| `03_ddd_step_16_test_cuts.md` | 已有最小测试切口,但还不是 `05` 的对象 / 切口章节 | 本 Step 把它转译成测试方案语义的对象表、协议盘点和审计表 |
| 配置与观测承接 | `04` 已正式闭合 profile、redaction、builder fail-fast 和 replay,但旧 `05` 没有吸收这些对象 | 本 Step 把 config / redaction / replay / no-write / no-truth-repair 纳入测试对象 |
| 下游接缝 | 容易误把相邻仓完整实现当成本仓测试对象 | 本 Step 只承接 Artifact seam: ref、snapshot、summary、event、handoff、read surface |
| 维护路径 | 容易把 6 个 public job 与 worker-only relay publication 混成一个“任务集合” | 本 Step 显式拆成 public job family 与 internal relay publication 切口 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试对象抽取方式 | 旧草稿按少量业务主线和环境分组 | 改为按模块、协议、状态、一致性、配置、观测抽取 | 符合 SOP “先测试对象,后设计用例” |
| 协议覆盖 | 未系统覆盖五类接口 | 16 Command、13 Query、6 Consumer、8 Event、6 Job 与 worker-only relay 全部进入测试对象 | 避免 public protocol 孤儿 |
| 状态覆盖 | 旧草稿只有少量业务态 | truth / support / derived / relay / handoff / idempotency 全部进入状态切口 | 防止非法转换漏测 |
| 负向入口 | 主要集中在少量权限或异常 | 增加 missing metadata、forbidden body、unsupported version、wrong result、query repair、job truth repair、config 越权等负向入口 | 对齐当前实现风险和 `VF-ART` 红线 |
| 配置 / 观测 | 旧草稿只粗略提环境 | 增加 4 个 P0 profile、strict JSON、builder fail-fast、redaction、replay、audit refs-only | 对齐 `04` 与 `03` Step 14~16 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接复制 `03_ddd_step_16_test_cuts.md` 全表 | A. 直接复制;B. 转译成测试对象 / 切口 / 审计结构 | 采用 B。`05` 需要形成测试方案章节,不是重复详细设计 |
| public protocol 是否逐项成为测试对象入口 | A. 只按 family;B. 每个 public protocol 保留独立入口 | 采用 B。后续 Step 6 才能逐项落地用例矩阵 |
| 状态机是否只测核心 truth 态 | A. 只测 truth core;B. support / derived / relay / handoff / idempotency 也单列 | 采用 B。P0 风险不仅在 truth 写路径 |
| 是否把真实下游仓内部流程纳入对象 | A. 纳入;B. 只测 Artifact seam | 采用 B。与 Step 2 非范围一致 |
| 是否把 P1/P2 产品绑定提前并入 P0 对象 | A. 并入;B. 只保留 seam / future risk | 采用 B。产品未锁定不阻塞当前 P0 |

## 8. 结构化中间产物

### 8.1 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| `contracts` protocol DTO / refs / metadata / surface | `03` §5 / §7;Step 8 | `contracts_protocol_roundtrip`;`contracts_metadata_validation`;`contracts_operation_digest_profile` | DTO 缺字段、typed ref 漂移、digest 判定不稳定 | contract unit |
| truth / support / record domain objects and policies | `02` §5;`03` §5 / §6 / §9 | `domain_object_invariants`;`domain_policy_accept_reject`;`domain_state_matrix_transitions` | 不变量缺失、policy reject 漏测、非法状态转换通过 | domain unit |
| application command orchestration | `03` §7 / §8 / §10~§13 | `application_command_orchestration`;16 个 `*_contract` command cuts | UoW 顺序错、duplicate replay 漏测、accepted side effects 不一致 | service + API |
| query read surface | `02` §7 / §8;`03` §7 / §8 / §9 / §14 | `application_query_no_write`;13 个 `*_query` cuts | Query 修 truth、visibility / degraded surface 缺失 | query handler |
| inbound consumers | `02` §7 / §8;`03` §7 / §8 / §12 | `application_consumer_orchestration`;6 个 `*_event` cuts | unsupported version 误解析、consumer 绕过 command 入口 | worker / service |
| outbound events and relay snapshot | `02` §7 / §8;`03` §7 / §8 / §10 / §12 | 8 个 `*_event_schema` cuts;`publisher_retryable_failure_marker`;`publisher_terminal_failure_marker` | payload 现查现造、publish failure 回滚 truth、forbidden body 泄露 | contract + worker |
| public operations jobs | `02` §7 / §8;`03` §7 / §8 / §10~§13 | 6 个 `*_job` cuts;`application_job_orchestration`;`maintenance_job_no_truth_repair` | job 变成业务写源、duplicate replay 错、partial failure 报告缺失 | job runner |
| worker-only relay publication loop | `03` Step 8 / Step 16 | `PublishPendingArtifactRelays_job`;`relay_publisher_parallel_single_winner` | internal relay publish loop 被误当成 public job 或跳过 stored snapshot 语义 | worker / repository |
| repositories / UoW / result stores | `03` §5 / §10 / §12 / §13 | `infra_repository_semantics`;`stored_result_saved_before_idempotency_complete`;`idempotency_complete_failure_rolls_back` | version / rollback / stored replay 语义错误 | repository fake |
| resolver / publisher / handoff adapters | `03` §5 / §13 / §14;`04` §11 / §12 | `infra_adapter_failure_injection`;`source_unavailable_mapping`;`handoff_failure_marker_or_report` | fake 伪成功、failure mapping 错、body 误输出 | adapter fake / integration-like |
| runtime config / profiles / replay | `02` §11;`03` §13;`04` §6 / §9 / §11 / §12 | `infra_runtime_config_validation`;`config_validation_fail_fast`;`forbidden_boundary_not_configurable` | invalid config fallback、profile 语义漂移、startup invariant 被配置绕过 | config test |
| observability / audit / redaction / dependency boundary | `01` §8 / §13;`03` §14 / §15;`04` §8 / §12 | `observability_and_redaction_contract`;`logs_do_not_include_forbidden_body`;`metrics_low_cardinality_labels`;`audit_uses_refs_only`;`non_core_sibling_not_cargo_dependency` | raw body / secret 输出、依赖打穿边界、metric label 高基数 | observability / architecture gate |

### 8.2 协议级测试对象盘点

| 协议族 | 数量 | 必须进入测试对象的协议 |
|---|---:|---|
| Command | 16 | `RegisterArtifactIntake`、`EstablishArtifactFact`、`CreateArtifactVersionCandidate`、`PublishArtifactVersion`、`SupersedeArtifactVersion`、`EstablishArtifactLineageLink`、`RejectArtifactLineageLink`、`CreateArtifactBaselineCandidate`、`FreezeArtifactBaseline`、`SupersedeArtifactBaseline`、`OpenArtifactReviewAnchor`、`AssignArtifactResponsibility`、`RegisterAutomationArtifactInput`、`AcceptAutomationArtifactInput`、`IssueConsumableArtifactReference`、`RecordArtifactConsumptionBackref` |
| Query | 13 | `GetArtifactFact`、`GetArtifactVersion`、`ListArtifactVersionsByFact`、`GetArtifactLineageSummary`、`GetArtifactBaseline`、`GetArtifactReviewSummary`、`GetArtifactReadSurface`、`GetArtifactTrace`、`SearchArtifactFacts`、`GetArtifactPreview`、`GetArtifactReport`、`GetArtifactReconciliationReport`、`GetExternalReferenceResolution` |
| Inbound Consumer | 6 | `ConsumeWorkArtifactContextChanged`、`ConsumeProcessArtifactContextChanged`、`ConsumeGovernanceArtifactContextChanged`、`ConsumeMethodArtifactDefinitionChanged`、`ConsumeRuntimeArtifactSignalRecorded`、`ConsumeExternalContentSourceChanged` |
| Outbound Event | 8 | `ArtifactFactChanged`、`ArtifactVersionChanged`、`ArtifactLineageChanged`、`ArtifactBaselineChanged`、`ArtifactReviewChanged`、`ConsumableArtifactReferenceChanged`、`ArtifactTraceAvailable`、`ArtifactDerivedViewStateChanged` |
| Public Operations Job | 6 | `RebuildArtifactDerivedViews`、`RefreshExternalReferenceStates`、`RunArtifactReconciliation`、`PrepareArtifactArchiveHandoff`、`PrepareArtifactObservabilityHandoff`、`PrepareArtifactSyncHandoff` |
| Internal worker facade | 1 | `PublishPendingArtifactRelays` 只作为 worker-only relay publication facade,不作为 public job family 计数 |

### 8.3 测试切口设计真相源表

| 测试切口 | 设计真相源 | 覆盖字段 / 状态 / 协议 / 错误 | P0/P1/P2 | 后续用例要求 |
|---|---|---|---|---|
| `contracts_protocol_roundtrip` | `03` §7;Step 8 | Command / Query / Consumer / Event / Job / View / Error DTO、schema version、required fields | P0 | 每类 public DTO 至少 roundtrip + missing required |
| `domain_object_invariants` | `02` §5;`03` §5 / §6 | truth / support / record object factory、不变量、body-free 约束 | P0 | 每组对象至少 happy + invariant reject |
| `domain_state_matrix_transitions` | `02` §9;`03` §9 / Step 10 / Step 16 | truth core、support、derived、relay、handoff、entry 合法 / 非法迁移 | P0 | 每组状态机至少主线合法、边界合法、非法转换 |
| `application_command_orchestration` | `02` §8;`03` §8 / §10~§13 | validate -> reserve -> load -> domain -> save -> trace / relay / result -> commit | P0 | 每个 Command 覆盖 accepted、reject、duplicate、version conflict |
| `application_query_no_write` | `02` §8;`03` §7 / §8 / §14 | `ArtifactQueryResponse` surface、visibility / freshness / degraded、strict no-write | P0 | 每个 Query 覆盖 hit + no-write;关键 Query 覆盖 visibility / degraded |
| `application_consumer_orchestration` | `02` §8;`03` §7 / §8 / §12 | envelope、schema version、dedup、snapshot / resolution / stale / receipt | P0 | 每个 Consumer 覆盖 accepted、duplicate、unsupported、delayed / rejected |
| outbound event schema cuts | `03` §7 / §8 / §10 / Step 16 | stored payload snapshot、no current truth rebuild、forbidden body absent | P0 | 每个 outbound event 覆盖 payload mapping + no body |
| public job cuts | `02` §8;`03` §7 / §8 / §10~§13 | job metadata、stored report replay、partial failure、no truth repair | P0 | 每个 public job 覆盖 completed、invalid input、partial / failed、duplicate |
| `PublishPendingArtifactRelays_job` | Step 8 / Step 16 | worker-only relay publication、list pending with payload、mark published / retryable / failed | P0 | 覆盖 success、retryable、terminal、duplicate / race |
| consistency / idempotency cuts | `03` §10~§13;Step 16 | version、stored result / report、duplicate replay、same key different digest、commit unknown、race | P0 | 每个 duplicate family 覆盖 same digest replay + different digest conflict |
| config / replay / redaction cuts | `02` §11;`04` §6 / §9 / §11 / §12 | 4 个 P0 profile、strict JSON、source priority、builder fail-fast、degraded no-write、operations replay、forbidden outputs | P0 | 每个 P0 profile 装配;invalid config negative;replay root rules |

### 8.4 P0 测试切口停审记录

| 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts_protocol_roundtrip` | 设计来源明确;public DTO 覆盖清楚 | 通过 | Step 6 需拆到各协议 family 的字段级断言 |
| `domain_object_invariants` | truth / support / policy 来源明确 | 通过 | Step 6 需按对象组列具体 invariant |
| `domain_state_matrix_transitions` | enum family 明确;禁止口语状态 | 通过 | Step 6 必须只使用正式 enum 名 |
| `application_command_orchestration` | flow / UoW / result 顺序明确 | 通过 | Command 数量大,后续按 family 分批写 |
| `application_query_no_write` | no-write 风险明确;与 visibility / degraded 绑定 | 通过 | 需要后续定义 write-audit 断言方式 |
| `application_consumer_orchestration` | seam-only 边界明确;body-free 约束明确 | 通过 | 来源仓内部语义不扩展为本仓对象 |
| outbound event schema cuts | stored snapshot / no body 来源明确 | 通过 | topic map 与 publisher evidence 后续由 Step 8 / Step 9 / Step 13 承接 |
| public job cuts | no-truth-repair 和 stored report replay 来源明确 | 通过 | Step 6 需拆到 6 个 public job |
| `PublishPendingArtifactRelays_job` | internal facade 定位清楚,未混淆为 public job | 通过 | 后续保留单独测试层级和 evidence |
| consistency / idempotency cuts | duplicate / conflict / recovery 来源明确 | 通过 | Step 6 需覆盖 missing stored result no recompute |
| config / replay / redaction cuts | `04` 来源明确;4 个 P0 profile 已固定 | 通过 | production-like / real product 继续留在 P1/P2 |

### 8.5 跨切口设计来源审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 7 个模块是否都有测试对象 | 通过 | `contracts/domain/application/infra/api/worker/jobs` 均已覆盖 |
| 16 个 Command 是否都有协议和流程入口 | 通过 | 见 §8.2,Step 6 逐项展开 |
| 13 个 Query 是否都有 read surface 和 no-write 入口 | 通过 | 见 §8.2,重点 Query 额外覆盖 degraded / visibility |
| 6 个 Consumer 是否都有 accepted / duplicate / unsupported / delayed 入口 | 通过 | 见 §8.2 |
| 8 个 Outbound Event 是否都有 payload snapshot / forbidden body / publish failure 入口 | 通过 | 见 §8.2 |
| 6 个 public job 是否都有 success / duplicate / invalid / partial / no-truth-repair 入口 | 通过 | 见 §8.2 |
| worker-only relay publication 是否单独被看到 | 通过 | 未与 public job count 混淆 |
| 状态机、一致性、幂等、恢复是否单列 | 通过 | version、duplicate、stored result、relay、query no-write、job no-truth-repair 均有入口 |
| 配置、profile、adapter failure、redaction 是否承接 `04` | 通过 | builder fail-fast、strict JSON、degraded no-write、replay、redaction 已纳入 |
| 是否存在 P0 孤儿设计契约 | 通过 | 当前未发现。字段级孤儿待 Step 6 继续审查 |

### 8.6 字段 / DTO / 边界混同负向切口清单

| 风险 | 对应切口 | 设计来源 | 后续用例要求 |
|---|---|---|---|
| missing actor / metadata / idempotency / required ref | `invalid_request_no_uow`;`contracts_metadata_validation` | `03` §7 / §8 / §11 | 断言不 begin write UoW |
| unsupported schema version | `unsupported_event_version_no_parse` | `03` §7 / §8 / §12 | 断言不 parse payload、不写 snapshot / receipt success |
| external body / forbidden body 入 truth / relay / audit / report | `digest_mismatch_and_body_rejected`;`observability_and_redaction_contract` | `01` §9;`03` §12 / §14;`04` §8 / §12 | 断言 truth、relay、audit、log、report 均无 body |
| current truth 重算 duplicate result | `duplicate_result_missing_no_recompute` | `03` §10~§13 | 断言返回 consistency error,不得从 current truth 补算 |
| query 内部 refresh / rebuild / repair | `application_query_no_write`;`query_no_write_side_effects` | `02` §8;`03` §8 / Step 16 | 断言 query 不写 projection / reference / audit / stale |
| consumer 直接创建核心 truth | `application_consumer_orchestration` 负向分支 | `02` §7 / §8;`03` §7 / §8 | 断言只保存 ref / resolution / pending / stale |
| job 修复核心 truth | `maintenance_job_no_truth_repair` | `03` §7 / §8 / §10 | 断言 job 只改 derived / reference / report / handoff |
| typed ref / summary / projection 误替代 truth anchor | `projection_dependency_index_is_only_source`;`reference_scope_list_uses_tracked_state` | `03` §10~§13 | 断言 affected views / refresh scope 只来自正式 repository index |
| target disabled / invalid scope / invalid anchor 被静默吞掉 | public job negative cuts | `03` §8 / §12;`04` §11 | 断言 failed / rejected / delayed surface,不得静默成功 |
| config 放宽 truth boundary、visibility、redaction 或 no-write / no-truth-repair | `forbidden_boundary_not_configurable`;`config_validation_fail_fast` | `02` §11;`04` §4 / §9 / §11 | 断言 fail-fast 或 reject current entry |

## 9. 对上游设计的影响判定

| 测试对象结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前测试对象和切口均来自 `02/03/04` 已闭口内容 | 否 | 测试方案转译 | 无需回写 |
| 当前未发现 P0 孤儿协议或孤儿状态组 | 否 | 来源审计 | 无需回写 |
| worker-only relay publication 与 6 个 public job 分离承接 | 否 | 测试对象口径澄清 | 与 Step 2 范围一致 |
| 后续若某对象字段无法形成稳定 fixture、断言或 fake failure injection | 是 | 可验证性缺口 | 在 Step 6~9 回写 `03/04` 或记录阻塞 |
| 后续若 write-audit / no-truth-repair 无法稳定观测 | 是 | 测试工具 / 观测能力缺口 | 在 Step 4 / Step 9 明确自动化与脚本契约 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_03_test_objects_cuts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“测试对象与测试切口总表”“协议级测试对象盘点”“测试切口设计真相源表”和“跨切口设计来源审计表”小节。

正式 `05-测试方案.md` §3 应回填:

- 测试对象按 7 模块、五类 public protocol、worker-only relay publication、状态机、一致性、配置和观测组织,不按旧主流程自由罗列。
- P0 测试切口包括 contracts roundtrip、domain invariants、state matrix、command orchestration、query no-write、consumer orchestration、outbound event snapshot、6 个 public job orchestration、worker-only relay publication、一致性 / 幂等 / 恢复、config validation / replay、redaction / audit / dependency boundary。
- 16 Command、13 Query、6 Consumer、8 Outbound Event、6 public job 均有独立测试入口;`PublishPendingArtifactRelays` 作为 internal facade 单独承接。
- 每个 P0 测试切口必须回指 `02/03/04` 的具体设计真相源。
- missing metadata、unsupported version、forbidden body、wrong stored result、query repair、consumer 直写 truth、job truth repair 和 config 越权都必须作为负向测试切口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 需要拆分大量协议级和状态级用例 | 用例矩阵规模较大 | 后续按 protocol family / state / consistency 分批写入 |
| write-audit / no-truth-repair 的观测手段是否用统一测试 helper | 影响 query no-write 与 job no-truth-repair 断言 | Step 4 / Step 9 再确定 |
| dependency boundary check 的执行方式 | 影响架构边界 evidence | Step 9 定义脚本或 manual gate |
| P1 durable-like / real-like seam 的深度 | 影响 integration-like 范围 | 当前不阻塞 P0,在 Step 14 记录残余风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 测试对象都有明确切口 | 通过 | 见 §8.1 / §8.2 |
| 每个 P0 测试切口已停审 | 通过 | 见 §8.4 |
| 跨切口设计来源审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 负向入口已记录 | 通过 | 见 §8.6 |
| 可进入 Step 4 | 通过 | 下一步制定测试策略与分层 |
