# L4-observability 项目执行台账

## 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| 07-实施计划 | Step 13 `正式整理为 07-实施计划` current 完成 | formal-assembly-ledger-boundary-skeleton-audit | `completed_current_07_design_only` | Step 01~13、正式 13 章正文、implementation execution ledger 和 16 个 planned boundary skeleton 已完成并通过设计侧一致性审计。目标仓、不可变实现 baseline、真实 runner/evidence 和 12 项 inherited affected 仍不得伪造关闭。 | `stop_after_07_completion_wait_user` | `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`；`design-calibration/07_implementation_plan_calibration_flow.md`；`design-calibration/implementation_execution_ledger.md` |

## 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换 / Step 门禁 | blocker |
|---|---|---|---|---|---|
| 00-需求文档 | `design-calibration/00_requirements_calibration_flow.md` | completed | Step 17 formal assembly complete | pass_after_user_confirmation_to_01 | none |
| 01-架构设计 | `design-calibration/01_architecture_calibration_flow.md` | completed | Step 16 formal assembly complete | pass_after_user_confirmation_to_02 | none |
| 02-概要设计 | `design-calibration/02_hld_calibration_flow.md` | completed | Step 14 formal assembly complete | pass_after_user_confirmation_to_03 | none |
| 03-详细设计 | `design-calibration/03_ddd_calibration_flow.md` | `completed_current_M3_formal_baseline` | Step19 formal assembly complete；18章全文门禁通过；`60/60 recorded_with_affected_open`、`0/60`无条件完成 | `passed_to_current_04_after_user_confirmation` | I05 two `open_upstream_internal`;H13 `open_controlled`;9 inherited affected |
| 04-配置设计 | `design-calibration/04_config_calibration_flow.md` | `completed_current_full_restart_continuous_authorized` | Step01~15 current complete；formal 15章/991行通过门禁 | `pass_to_05_full_restart` | no new upstream blocker；12 affected retained；readiness blocked |
| 05-测试方案 | `design-calibration/05_test_plan_calibration_flow.md` | `completed_current_full_restart_continuous_authorized` | Step01~15 current complete；formal 15章与索引/真实性门禁通过 | `pass_to_06_full_restart` | inherited affected retained；no new blocker |
| 06-验收标准 | `design-calibration/06_acceptance_calibration_flow.md` | `completed_current_full_restart_continuous_06_authorized` | Step01~15 current complete；用户已确认切换到 `07` | `passed_to_07_after_user_confirmation` | target reality absent；12 inherited affected；no new blocker |
| 07-实施计划 | `design-calibration/07_implementation_plan_calibration_flow.md` | `completed_current_full_restart_design_only` | Step01~13 current complete；正式 13 章正文、implementation ledger、16/16 boundary skeleton 已通过设计侧审计 | `stop_after_07_completion_wait_user` | no new upstream blocker；12 inherited affected；target repo/immutable baseline/execution harness absent；implementation handoff blocked |

## 全局 blocker

| blocker_id | 状态 | 说明 | 处理 |
|---|---|---|---|
| CFG-BLK-07-01 | resolved | formal `03`原先缺少6个support type完整definition，曾阻断Step07合法建立finite parser与field registry | 已按用户授权完成targeted `03` repair：唯一owner、variant/wire token、typed newtype、definition/use与9 Consumer static map均同步；Step07已完整消费并通过，不再构成上游blocker |
| CFG-BLK-09-01 | resolved | formal `03`原worker/jobs slice与Step08 no-locator/no-material边界冲突，曾阻断D05/D21 | 已按用户授权完成R2：DDD Step05/07/14/17/19、formal §5/§6/§13/§15/§16及Step08/09同步raw infra-only binding、safe metadata、finite catalogs、prebuilt registrars、opaque handles和group atomicity；60 protocol/27 state/UoW/schema/startup variants不变 |
| 03-RPR-S06-GRANULARITY | resolved_in_R06.8_design_only | 修复前Step06以family表替代大量独立对象卡并由后置Step反向补型；R06.2~R06.7已逐模块重建，R06.8-A/B完成48 input、runtime/publication/file owner与全文门禁 | Step06 definition gap已关闭；后续use传播只按R06.8 affected register推进，不将本blocker恢复为open |
| R06.6-B-REF-OWNER | resolved | public protocol直接使用四个outbox/dead-letter ref，原application owner会造成contracts反向依赖 | canonical value owner=`contracts::refs`；application retains typed mint authority and lifecycle relation；contracts专项§29 |
| R06.6-B-DEAD-LETTER-SHAPE | resolved | `mark_dead_letter(reason,ref)` 原record只保存ref，reason会丢失 | record durable保存`dead_letter_reason`+`dead_letter_ref` co-presence；repository不得隐式持有reason |
| R06.6-B-PUBLICATION-HISTORY | resolved | `Failed -> Published/DeadLettered` 的prior failure保留规则原不唯一 | latest failure replacement；Failed-success/dead-letter均保留；Pending-success/direct dead-letter无failure |
| R06.6-B-EVENT-BYTE-BOUND | resolved | `262144` 与冻结`04` request-body candidate相同，存在下游反向定义嫌疑 | Step06独立定义compile-time `MAX_BODY_FREE_SERIALIZED_EVENT_BYTES=262_144`；与request-body config隔离，config不能提高 |
| R06-F-AFFECT-UOW-01 | step07_surface_closed_downstream_open | S07-C~D已闭合Step07的borrow-stage、one cursor、typed mint/append、H6 split、H12 append、projection followers/read fence、item/report/outbox/external-effect guard顺序和UoW `Send + Sync`；I03 §14.9已传播`stage snapshot -> assign cursor -> construct/append H10 -> result -> completion -> commit`并识别Step15 §13.4旧顺序冲突；冻结Step09/11/13/15/16仍待传播 | 后续按F2 §17逐Step传播并修订Step15旧`append -> assign cursor`表述；不得把局部关闭误报为全局closed，继续禁止Clone/reload与partial success |
| R07-TRANSACTION-REF-CROSS-CRATE-01 | resolved_at_S07-F_design_only | 原`ObservationTransactionRef`只有private tuple field，独立infra无法合法构造/rehydrate/inspect | §7.9已增加validated generated/rehydrate/selectors；保持process-local、non-durable、non-public-truth，Step11/16只做conformance传播 |
| R07-REPOSITORY-CURSOR-BINDING-01 | resolved_at_S07-F_design_only | 原repository cursor缺method/selector/order binding和callable `InvalidPageCursor` surface | §7.9已增加一次性`BASE64URL_NOPAD(binary envelope)`、唯一`application::digest::repository_page_binding_fingerprint_v1`委托、14 exact binding/position codec、receipt与rollup复合序、validated page/result codec和fake/durable parity；Step08映射public page，Step11/16验证codec/order |
| R07-AFFECTED-PROJECTION-CODEC-01 | resolved_at_S07-F_design_only | affected/source projection ref原缺有限persisted tag、cross-crate rehydrate、canonical ordering和set bound/empty contract | §7.21已固定14个`ProjectionSourceRef`与6个`AffectedProjectionRef`的tag/rehydrate/canonical frame；source set非空，affected empty省略stale follower且禁止`mark_views_stale`；Step11/16验证持久化codec/parity |
| R06.7-ENTRY-DISPOSITION-OWNER | resolved_by_deletion_in_R06.7-E_design_only | `EntryDisposition`无独立语义、不变量、生命周期或必要跨模块contract；stored/application/public/C completion与Job callback owners已覆盖全部use-site | 标记为`HX`并删除；禁止以`ApiDisposition`、`WorkerDisposition`、`JobDisposition`或任何alias/wrapper恢复 |
| R06-F1-AFFECT-07-01 | step07_use_closed_at_S07-F_downstream_open | 48 concrete inputs由`application::inputs`唯一拥有，三类finite assembler内部固定typed material -> candidates/digest -> context -> input顺序；Step07 exact traits/calls已闭合 | Step08/09/13/14传播；entry不得取得naked context factory/canonicalizer或自行hash |
| R06.7-D-ENTRY-ASSIGNMENT-SEAM | step07_use_closed_at_S07-F_step14_open | `build_api/build_worker/build_jobs`分别产出一个具名profile-specific runtime；每个只含一个least-authority assignment并由matching process-local activation一次消费；无aggregate/generic runtime、accessor/Clone/downcast/任意重组或跨进程原子性声明 | Step14传播exact fields、ownership transfer、profile-local activation rollback与zero-partial error |
| R06.7-D-PUBLICATION-JOB-SEAM | step07_use_closed_step08_propagating | publication归统一`ObservationOperationsJobService`九类Job之一；S08-B已把E01~E12与J01绑定到typed immutable snapshot lifecycle，crate-private collaborator只消费已plan/claim的item | S08-F/G逐协议复核，Step09/12/13/14继续传播；resident worker publication mode永久删除 |
| R06-F2-AFFECT-04-FILE-OWNER | resolved_at_step06_decision_in_R06.8-B | logical `domain::records`与frozen physical `history.rs`冲突；application helper file也未闭合 | current physical decision=`domain/src/records/` tree + application `inputs/input_assembly/record_assembly` modules；Step04文本传播pending，禁止双owner |
| R06.7-C-CARRIER-QUALITY | resolved_in_C | C-05曾把receipt outcome过早映射为transport action，C-07引用不存在的统一request validator，C-08声称拥有未统一定义的深层response/report validator | 已收窄为shape/policy/assembler三层：C-05保留固定与待决action边界；C-07只检查typed variant与固定名称；C-08只检查typed variant与固定名称，深层一致性由exact response assembler前置保证；不新增error owner |
| R06.6-APP-EXT-OWNER | resolved_in_C | `ExternalEffectBindingRef` 在 Step 06 与 Step 14 有重复 definition/use；application intent/token 需要唯一 binding owner | canonical owner=`application::runtime`；intent/token/result/probe owner=`application::external_effects`；Step14只派生/装配并等待affected review |
| R06.6-C-PREPARATION-REF-OWNER | resolved_in_C | public Job output与application delivery token共同使用`HandoffDeliveryPreparationRef`，原无低依赖canonical owner | canonical declaration=`contracts::refs`；application保留new-value validation、source-token relation和local finalize责任；contracts专项§30 |
| R06.6-C-INTENT-LIFECYCLE | resolved_in_C | frozen Step11把external effect intent写成含state/local phase CAS的mutable row，可能形成第二状态机 | current intent是four-variant tagged append-once token landing；mutable lifecycle仍归outbox/handoff/export/delivery/job owner |
| R06.6-C-EXPORT-PHASE-ORDER | resolved_as_affected_correction | frozen Step09/11对export prepare顺序表述可能晚于external package call | R06.4 local `ExternalAuditExportPreparation::Prepared`先于external package prepare；`PeripheralExportPackage`是外部结果，不新增Prepared state |
| R06.6-D-JOB-IDENTITY-UPSTREAM | resolved_in_D2 | historical public `JobExecutionRef` / `JobRunRef` owner悬空，且public invocation、application execution、真实run identity曾被混用 | public correlation固定为`core_contracts::metadata::JobRunId`，local execution固定为独立`ObservationJobExecutionRef(BodyFreeRef)`，真实external/runtime run保持absent；三者无alias/wrapper conversion |
| R06.6-D-WORK-KEY-PAYLOAD-OWNER | resolved_in_D2_with_downstream_affected_definitions | frozen work-key曾使用废弃`ReferenceSnapshotRef`及无owner的`PeripheralConsumerScopeRef` | snapshot variant改用`ReferenceSnapshotStateRef`；peripheral variant直接承载`consumer_ref_id + projection_scope`，不创建新wrapper；Step08/13列入affected register |
| R06.6-JOB-CONFIG-OWNER | resolved_in_D4 | `JobExecutionConfigSnapshot`、`JobConfigBinding`与`ObservationJobExecutionPlan` durable owner=`application::jobs`；Step14只派生/装配 | 后续只做affected-use审计，禁止重复定义 |
| R06.6-D-CONFIG-SUPPORT-OWNER | resolved_in_D4 | `ConfigBindingRef`、positive values、retry、lease与capability等typed executable support owner=`application::runtime`；raw config/locator仍归infra | R06.7只审runtime assembly与entry-safe carrier |
| R06.6-D-H12-COMPAT | resolved_in_D3_fieldwise_with_D6_integration_followup | D-3已逐字段保留H12 target snapshot、typed outcome、completed_at与same-UoW规则；D-4保证GapSource material随plan冻结 | D-6只做跨对象闭环，不改变字段语义 |
| R06.6-D-CLAIM-SHAPE | resolved_in_D5 | D-5已重建claim identity、plan/subject/owner、lease/heartbeat/fence与Active/Released/Expired authority；Step07/11/12/13 affected-use仍待审计 | D-6完成跨对象闭环并登记后续affected definitions |
| R06.6-APP-ERROR-OWNER | resolved_in_F2_owner_addendum | `ApplicationError` 唯一 current owner 已固定为 `application::errors`，并加入14-kind `RecordAssemblyFailureKind` wrapper；safe-detail/recovery边界保持有限 | Step07/12只做affected mapping；不复制定义、不解析provider/domain文本 |
| R06.6-DISPOSITION-LAYER | superseded_by_R06.7-E_no_generic_entry_layer | stored result、durable report、application return、Consumer completion、Job callback与public outcome owner已固定；generic entry层已删除 | Step08/09/13只做affected review；不得恢复任何consumer/job/entry generic disposition |
| R06.6-DIGEST-CANONICALIZER | resolved_in_F1_design_only | W1~W3已闭合12-kind v1 framing/owner、48入口、8 durable family、4 phase、五类error、profile candidate/migration、planned corpus/property tests和全量affected-use | 后续只做Step04/07~16 affected review与真实实现验证；不得从serde/debug/raw body临时hash，不得声称测试/scan/evidence已完成 |
| R06.6-F2-H13-UPSTREAM | open_controlled | formal `02`将`DefineReplayScope`映射为`ReplayExecutionRecord`，但current H13 factory只接受Approved scope + exact coordination/target/transition | 当前只有`CoordinateObservationReplay`可写H13；formal `03`重装配前裁定scope mutation为explicit-no-record或单独设计scope lifecycle record |
| 03-RPR-S08-PER-PROTOCOL | completed_design_record_with_affected_open_waiting_before_step09 | current 60项inventory、owner、flow reservation与shared carrier已重建；C01-C16、Q01-Q14、I01-I09、E01-E12、J01-J09均有独立协议卡，M1总审计确认`16+14+9+12+9=60`，全部为`defined_with_affected_open`，`0/60`无条件complete | 该Step质量blocker的“缺独立协议记录”部分已关闭；所有协议affected继续按唯一owner/Step传播。不得把设计记录完成解释为runtime-ready、实现、测试、验收完成，也不得在Step09用family/shared模板替代60项exact flow |
| R06.8-AFFECT-08-PROTOCOL | C01-C16_Q01-Q14_I01-I09_E01-E12_J01-J09_propagated_affected_open | S08-B传播四façade、`JobRunId`、typed snapshot和public/application identity隔离；M1已补齐I06-I09、E01-E12、J01-J09协议卡、专属affected及secondary type owner group，60项均有唯一Step09 flow reservation | Step06/07/09~16及上游owner按affected inventory逐项修订；禁止恢复旧type/owner、任选上游事件、字段并集、generic handler、默认action、publisher current-truth rebuild或将协议卡冒充canonical schema/runtime evidence |
| S08-E-I03-PAYLOAD-SCHEMA-01 | open_upstream_internal | L1-identity current材料缺完整`IdentityObservationContextPayload` canonical declaration、wire schema、producer encoder与schema/discriminator registration | 由L1-identity提供唯一payload owner；Observability不得创建第二个canonical DTO |
| S08-E-I03-FRESHNESS-OWNER-01 | open_upstream_internal | `ReferenceFreshnessState`独立owner、finite variants、wire encoder及producer传播关系未找到 | 由上游提供owner/编码/传播证明；缺失时I03保持fail closed |
| S08-E-I03-DOWNSTREAM-WRITE-CAPABILITY-01 | open_internal_affected | shared `ObservationInboundEventDependencies`物理暴露H3/H4/H5 repository；I03缺少可验证的最小private dependency view，文字约束不足以证明不可调用downstream writer | Step06/07建立I03 concrete delegate能力切片；Step09逐调用证明无H3/H4/H5/external delivery并规划compile-time dependency test与forbidden-call scan；不得复制repository trait或依赖评审约束 |
| S08-E-I04-DOWNSTREAM-WRITE-CAPABILITY-01 | open_internal_affected | shared `ObservationInboundEventDependencies`同样物理暴露`AuditEvidenceRepository`、`ReportHandoffRepository`与`RetentionGuardRepository`；§14的zero-write矩阵尚不能在编译边界证明I04无downstream writer能力 | Step06/07建立I04 concrete delegate/private minimal dependency view；Step09逐调用证明无evidence/retention/handoff写口；Step16规划compile-time dependency cut与forbidden-call scan；不得复制trait或把H3/H4/H5写入I04 UoW |
| S08-E-I03-ACTION-MATRIX-01 | open_internal_affected | I03全部结果branch的C-05 target/prohibition已固定，但Step06/07缺唯一pure/total/no-wildcard exact mapper seam | mapper覆盖commit certainty、receipt branch、outcome/access、refs/error、recovery和I03 policy；Step09只调用一次，Step16表驱动验证；禁止generic/default/error-string mapping |
| S08-E-I04-PAYLOAD-SCHEMA-01 | open_upstream_internal | L1-governance current材料未声明`GovernanceAuditContextPayload` canonical schema、producer encoder或schema/discriminator registration；名称只存在于Observability use-site | 由L1-governance或明确跨项目contracts owner提供唯一payload与兼容注册；Observability不得反推或复制owner |
| S08-E-I04-PRODUCER-EVENT-BINDING-01 | open_upstream_internal | L1-governance有十三个具体outbound event，但没有哪些事件进入I04、如何转换及如何绑定schema/version/source identity的有限契约 | 上游提供event-to-I04 binding/adapter，或正式裁定拆分具体Consumer；禁止全订阅、任选、名称匹配或字段并集 |
| S08-E-I04-REFERENCE-AUTHORITY-01 | open_internal_affected | 完整`GovernanceArtifactEvidenceReference`含Observability本地identity、snapshot state ref、state及gap/visibility reason，Governance producer无构造authority | Step06/07收敛最小上游body-free refs并由本地授权lookup/factory构造或解析；禁止直接反序列化完整本地对象或信任producer提交local state |
| S08-E-I05-PAYLOAD-SCHEMA-01 | open_upstream_internal | L1-artifact未声明`ArtifactEvidenceContextPayload` canonical schema、encoder、registration或兼容版本；名称只存在于Observability use-site | 由L1-artifact或明确跨项目contracts owner提供唯一payload与兼容注册；禁止从候选payload或Step06字段反推 |
| S08-E-I05-PRODUCER-EVENT-BINDING-01 | open_upstream_internal | L1-artifact多个outbound event与I05之间缺有限event-to-I05 binding/adapter及source/event/version转换 | 上游提供有限binding或裁定I05拆分；禁止全订阅、任选、按名称匹配或字段并集 |
| S08-E-I05-REFERENCE-AUTHORITY-01 | open_internal_affected | Artifact truth anchor、consumable ref或trace ref不能构造含Observability本地identity/state/reason的完整reference | Step06/07收敛最小source ref与本地授权factory/relation；禁止信任producer local state/reason/visibility或临时mint alias |
| S08-E-I05-CONTROL-FIELD-SOURCE-01 | open_internal_affected | 六个Consumer control fields只有family-level来源规则，缺I05 concrete struct、`from_assembled`参数、header一致性与crate-private accessor传播证明 | Step06/07补齐exact private fields、constructor、validation与accessor；禁止generic map、entry侧重构或payload覆盖header |
| S08-E-I05-DIGEST-AUTHORITY-01 | open_internal_affected | Artifact候选payload不携带I05 semantic digest；本地profile/material/order、optional digest冲突规则与single-computation路径未唯一化 | 选择upstream canonical或local canonicalizer单一路径并固定absence/conflict矩阵；禁止hash raw body/event/transport/debug或默认digest |
| S08-E-I05-DIGEST-ORDER-01 | open_internal_affected | outer request frame的固定字段顺序、排除集与单一candidate传播尚未贯通assembler、reservation与replay | Step06/07/09传播唯一`inbound_consumer_request` frame/order/exclusion与opaque candidate；禁止各层重算、加入dedup/trace/time/local effects或沿用旧三字段顺序 |
| S08-E-I05-PURPOSE-AUTHORITY-01 | open_internal_affected | `EvidenceConsumerPurpose`是Observability下游消费意图，当前producer-facing row没有可信来源或finite mapping | 由本地operation/binding policy或明确上游observation经total mapper生成；禁止producer任选、按产品/event名推导或缺失默认 |
| S08-E-I05-VISIBILITY-AUTHORITY-01 | open_internal_affected | `VisibilitySurface`是Observability response/disclosure surface，却被列为producer input；I05 policy/gap/degraded source未闭合 | 移出producer payload，由本地policy/result mapper基于reference/linkage/gap/degraded与consumer scope生成；禁止默认`Visible`或Artifact state授权 |
| S08-E-I05-LINKAGE-RELATION-SOURCE-01 | open_internal_affected | `EvidenceLinkage::candidate`与relation lookup需要`projection_ref`和`consumer_scope`，I05 input未提供且没有授权source | 明确I05 minimal typed selector/lookup或修订concrete input，并固定missing/duplicate/version/scope-mismatch矩阵；禁止第一行或字符串推断 |
| S08-E-I05-DEPENDENCY-SLICE-01 | open_internal_affected | Step07只有operation-specific subset文字，缺I05 concrete minimal dependency view；wide bundle暴露evidence/retention/handoff等越权写能力 | 提供I05 private least-authority delegate，逐项回指Step07 port与Step09 flow，并从类型边界排除downstream/external writer |
| S08-E-I04-CONTROL-FIELD-SOURCE-01 | open_internal_affected | 六个control fields缺I04 concrete struct/constructor/accessor传播证明 | Step06/07补齐exact private fields与validation/accessor；禁止entry/service重构或payload回填header |
| S08-E-I04-DIGEST-AUTHORITY-01 | open_internal_affected | semantic digest缺唯一upstream-or-local owner、canonical profile/material/order及与reference optional digest的关系 | 固定唯一生成路径、absence/conflict/single-computation规则；禁止raw body/event/debug/topic/timestamp hash |
| S08-E-I04-VISIBILITY-AUTHORITY-01 | open_internal_affected | local response `VisibilitySurface`被列为producer-facing input，assembler无I/O且缺I04 policy/gap dependency | 移除producer-owned local surface或引入独立upstream observation DTO，再由service local mapper生成；禁止默认Visible |
| S08-E-I04-DIGEST-ORDER-01 | open_internal_affected | I04 request material公共prefix、未决payload segment、固定排除集及一次candidate在assembler/reservation/replay间缺共同传播证明 | Step06/07/09传播唯一`inbound_consumer_request` frame/order/exclusion；禁止raw hash、各层重算、加入dedup/trace/time/local effects或沿用旧三字段顺序 |
| S08-E-I04-REDACTION-PROPAGATION-01 | open_internal_affected | I04统一allowlist/exclusion ceiling尚未由decoder、canonicalizer、private input、public error/receipt、telemetry、persistence与dead-letter出口共同消费 | Step06/07/09/15/16提供exact mapper、single-source allowlist、forbidden-call scan与表驱动test cut；禁止宽松unknown-field、raw payload持久化，或用hash/截断/base64/debug替代redaction |
| S08-E-I04-DURABLE-LANDING-01 | open_internal_affected | I04缺唯一primary object/transition、repository relation/version、H-family或explicit-no-record、commit class/cursor、result refs与optional outbox mapping | Step06/07 affected repair与Step09 flow一次性闭合；禁止从HLD多域候选、冻结formal`03`、第一条row或repository capability任选landing |
| S08-E-I04-ACTION-MATRIX-01 | open_internal_affected | I04 known-result/ephemeral/unknown分支虽已固定C-05 target/prohibition，但Step06/07没有I04具名pure/total/no-wildcard mapper seam | mapper覆盖activation、commit certainty、branch/outcome/access、refs/error、recovery和exact policy；Step09在receipt/probe后只调用一次，Step16表驱动及no-wildcard验证；禁止generic/default/error-string或unknown默认Retry |
| S08-RECOVERY-CLASS-OWNER-01 | open_internal_affected | Step06没有current `ObservationRecoveryClass` enum owner，S08-B仅前向引用，冻结后序Step12不可反向授权 | 后序Step12重审唯一owner、八类finite recovery posture、`ApplicationError` total mapper、public `retryable`派生和no-wildcard tests；当前名称只作target vocabulary，禁止use-site反向成为owner |
| S08-ROUTE-BINDING-01 | shared_binding_closed_per_protocol_totality_open | S08-B已用finite family/name/body/operation替换`route-neutral surface`，但尚未证明60个exact handler totality | S08-C~G逐协议绑定；actual locator仍归Step14/`04` |
| S08-EXPORT-NAME-COLLISION-01 | shared_typed_collision_closed_job_totality_open | S08-B已用typed family区分同名Command/Job并静态映射Job Delivery callable | S08-G复核具体Job totality；禁止裸字符串dispatch |
| R06-F2-AFFECT-08-OUTBOX-ENCODER | shared_encoder_defined_event_totality_open | S08-B已定义typed encoder、canonical bytes/digest owner和application outbox snapshot lossless mapping | S08-F逐事件证明12种source/payload totality；publisher不得重读current truth |
| S08-SOURCE-EVENT-REF-OWNER-01 | resolved_in_S08-B_step06_affected_open | Step06多处使用`SourceEventRef`并声称已有contracts owner，但无正式Rust declaration/object card；S08-B已在`contracts::refs`补唯一transparent typed newtype及factory/wire/redaction/authority规则 | Step06 affected修订只回指该声明；禁止复制wrapper、本仓mint上游identity或与dedup/trace/local event/locator互换 |
| S08-CONSUMER-OUTBOX-SURFACE-01 | open_internal_affected | Step06 `ObservationConsumerResult` struct缺少文字契约允许的outbox refs，public receipt需要exact stored source | S08-E逐Consumer闭合；Step06 affected修订补字段或validated accessor，禁止current outbox lookup |
| S08-CONSUMER-QUARANTINE-REF-01 | open_internal_affected | Step06存在未给canonical owner/mint卡的`QuarantineRef` use | public receipt不暴露该ref；affected修订删除或回指已有owner |
| S08-CONSUMER-INDETERMINATE-COMPLETION-01 | open_internal_affected | C-05只有Acknowledge/Retry/DeadLetter三个terminal action；commit probe后仍indeterminate时没有合法completion shape | Step06/07 affected修订建立typed no-completion return shape或收紧签名，S08-E再闭合九Consumer action matrix；禁止默认选择任一terminal action |
| S08-E-I01-CONTROL-FIELD-SOURCE-01 | open_internal_affected | six Consumer control fields未由一个Step06/07 field/accessor contract完整承载 | 传播exact private input字段/source validation；禁止entry/service重构字段 |
| S08-E-I01-SAFE-SUMMARY-TYPE-01 | open_internal_affected | I01仍有历史`SafeSummaryRef` use-site | 修订为canonical `SafeSignalSummaryRef`；禁止alias或second wrapper |
| S08-E-I01-PAYLOAD-COMBINATION-01 | open_internal_affected | marker/summary七行组合矩阵缺跨contracts/assembler/safety唯一owner | 传播exact matrix与typed rejection；禁止默认/推导字段 |
| S08-E-I01-PRODUCER-SOURCE-MAP-01 | open_internal_affected | Bus producer/source family是不同类型，finite compatibility尚未唯一传播 | 建立static exact catalog；禁止wire string或`From`猜测 |
| S08-E-I01-DIGEST-ORDER-01 | open_internal_affected | I01 digest字段顺序/排除集未被assembler、reservation、stored replay共同消费 | 传播exact material profile；禁止local/raw hash |
| S08-E-I01-SOURCE-VERSION-01 | open_internal_affected | same-stream source-version comparator及finite mapping未完整暴露 | 提供typed relation或保留fail-closed；禁止time/cursor/row-version排序 |
| S08-E-I01-UOW-RECEIPT-SAFETY-01 | open_internal_affected | receipt、disposition、H1与stored result same-UoW proof待Step09/11传播 | 固定staging/commit relation；禁止split commit |
| S08-E-I01-OUTBOX-REF-LOSSLESS-01 | open_internal_affected | public receipt outbox refs缺canonical validated source/accessor | 修订stored surface；禁止current outbox lookup |
| S08-E-I01-RESULT-SURFACE-01 | open_internal_affected | application result到public receipt缺lossless mapper | 闭合result-kind/outcome/refs/error presence；禁止generic fallback |
| S08-E-I01-QUARANTINE-SURFACE-01 | open_internal_affected | historical `QuarantineRef`无canonical owner | 删除字段或回指已有owner；禁止Step08 wrapper/raw material |
| S08-E-I01-ACTION-MATRIX-01 | open_internal_affected | 非Accepted outcome缺per-flow exact C-05 action/recovery mapper | 逐flow传播；禁止wildcard terminal action |
| S08-E-I01-INDETERMINATE-01 | open_internal_affected | commit probe仍unknown时C-05无合法completion shape | 增加typed no-completion或收紧签名；禁止假定commit状态 |
| S08-E-I01-STEP09-HANDOFF-01 | open_internal_affected | I01 exact input/receipt/outbox/no-write/save-order尚待Step09承接 | 仅用`ConsumeBusObservationMaterialFlow`；禁止generic/duplicate flow |
| S08-E-I02-CONTROL-FIELD-SOURCE-01 | open_internal_affected | six Consumer control fields尚未由一个current Step06/07 field/accessor contract完整承载 | 传播exact private input字段与constructor validation；禁止entry/service重构或猜测字段 |
| S08-E-I02-SAFE-SUMMARY-OWNER-01 | open_internal_affected | I02历史use-site仍使用`SafeSummaryRef`，current canonical owner为`SafeExternalSummaryRef` | 修订use-site并传播canonical constructor/accessor relation；禁止alias或second wrapper |
| S08-E-I02-PRODUCER-SOURCE-CATALOG-01 | open_internal_affected | `SourceOwner`与`SourceFamilyKind`为不同Rust类型，finite compatibility catalog尚未唯一传播 | 建立static typed catalog与total rejection；禁止wire string比较或隐式转换 |
| S08-E-I02-SOURCE-AUDIT-RELATION-01 | open_internal_affected | source/ref/family/audit/subject semantic relation缺单一typed lookup contract | 定义typed relation key、sole-row lookup与mismatch precedence；禁止字符串拼接、先mint projection或first-row-wins |
| S08-E-I02-SUBJECT-RELATION-SOURCE-01 | open_internal_affected | `AuditSubjectRef` source mapping及missing/ambiguous parity缺唯一owner | 传播subject resolver/source及absence/ambiguity规则；禁止从tenant、actor或ref prefix推导 |
| S08-E-I02-CORRELATION-CONTEXT-RELATION-01 | open_internal_affected | optional correlation context缺完整source/Bound/subject relation carrier | 在projection create前暴露canonical bound-context relation；禁止从trace文字cast或使用空context |
| S08-E-I02-DIGEST-ORDER-01 | open_internal_affected | assembler、reservation与replay probe尚未共同消费I02固定digest顺序和排除集 | 传播唯一profile-owned canonical material；禁止raw envelope、provider hash或endpoint-local hash |
| S08-E-I02-SOURCE-VERSION-01 | open_upstream_internal | producer/source owner未提供typed same-stream comparator与finite older/equal/newer mapping | 上游提供comparator/relation proof，否则保持显式fail-closed；禁止按time、cursor、schema或row version排序 |
| S08-E-I02-PROJECTION-LOOKUP-UNIQUENESS-01 | open_internal_affected | `AuditEvidenceRepository`缺source-audit semantic relation的bounded unique lookup | 增加typed relation lookup与duplicate-row handling；禁止mint新ref、full scan或任取第一行 |
| S08-E-I02-H3-SAME-UOW-01 | open_internal_affected | accepted transition、projection post-state、H3 factory与cursor缺同一UoW证明 | 传播exact transition/post-state/cursor/save order；禁止reload或从after-state猜change kind |
| S08-E-I02-RECEIPT-OUTBOX-LOSSLESS-01 | open_internal_affected | public receipt outbox refs缺canonical stored-surface source | 在owner处补validated lossless field/accessor；禁止current outbox scan或按event kind推导 |
| S08-E-I02-RESULT-SURFACE-01 | open_internal_affected | application result到public receipt缺I02 exact outcome/ref/error presence mapper | 闭合operation-specific stored result surface；禁止generic disposition或empty fallback |
| S08-E-I02-QUARANTINE-SURFACE-01 | open_internal_affected | historical `QuarantineRef`在shared application material中仍无canonical owner | 删除字段或回指已有owner；禁止Step08新建wrapper或暴露raw quarantine material |
| S08-E-I02-ACTION-MATRIX-01 | open_internal_affected | relation rejection、NoOp、UnsupportedSchema、Delayed与local terminal分支缺exact worker mapper | 传播I02 per-flow C-05 policy与recovery class；禁止wildcard ack/retry/dead-letter |
| S08-E-I02-INDETERMINATE-01 | open_internal_affected | commit probe仍unknown时current C-05没有合法completion shape | 增加typed no-completion或收紧handler return contract；禁止假定commit状态或选择任一terminal action |
| S08-E-I02-STEP09-HANDOFF-01 | open_internal_affected | Step09必须承接I02 relation lookup、projection/H3 UoW、receipt与no-write boundary | 只建立一个`ConsumeSourceAuditMaterialFlow` carrier与save-order contract；禁止generic Consumer模板或重复flow |
| S08-JOB-REPORT-REF-OWNER-01 | open_internal_affected | application-local `JobReportRef`缺独立owner/mint/rehydrate声明卡 | Step06 affected修订闭合；public `BodyFreeRef`不得充当repository PK |
| S08-RESULT-ACCESS-LAYER-01 | resolved_in_S08-B_step06_affected_open | S08-B使用stable stored inner surface + invocation `FreshlyCommitted/Replayed` overlay，保留原outcome/report及exact bytes/digest | Step06 affected修订删除旧generic duplicate public outcome表述；禁止把duplicate当durable state |
| S08-COMMAND-RESULT-BODY-OWNER-01 | open_internal_affected | C01-C16结果 body 的最小语义字段和presence matrix已登记，但十六个operation-specific body尚无唯一current owner | Step06/07 affected修订补唯一owner/constructor/rehydrate关系；禁止由Step08临时创建result owner |
| S08-D-Q01-VIEW-OWNER-01 | open_upstream_internal | Q01要求`ObservationReceiptView`，Step06尚无唯一声明、字段schema、factory或mapping；`IntakeStatusView`不是等价类型 | Step06/07选定canonical owner并传播exact mapping；禁止Step08创建view、alias或API mapper偷换 |
| S08-D-QUERY-SURFACE-MAPPER-01 | open_internal_affected | Step07通用`ObservationQueryResult<T>`未记录各Query degraded precedence与material source map | 为每个Query绑定有限degraded/error mapper；禁止从ref文字、exception或首个失败依赖推导 |
| S08-D-Q02-PAGE-DISPOSITION-01 | open_internal_affected | Q02 page item需要receipt到disposition的lossless relation mapping及missing/duplicate precedence，exact response assembler owner尚未传播 | Step06/07指定per-item mapper与page atomicity；禁止查询current outbox或制造`Pending` |
| S08-D-Q03-SELECTOR-CARDINALITY-01 | open_internal_affected | Q03 signal/context/page分支缺少具名Step07 cardinality mapper与owner | 将所有selector分支绑定到assembler/service签名；禁止全局扫描、默认context或point-read替代 |
| S08-D-Q04-SELECTOR-CARDINALITY-01 | open_internal_affected | Q04 point/scope分支共用page字段但repository shape不同，normalization与point-cursor禁止规则缺少显式owner | 在Step06/07绑定branch normalization与page语义；禁止推断selector、接受point cursor或read时rebuild |
| S08-D-PAGED-RESULT-CARRIER-01 | open_internal_affected | Step07所有Query均返回`ObservationQueryResult<T>`，Q02-Q04需要items与same-binding continuation的application carrier，当前无唯一owner或exact signature mapping | Step06/07选定canonical paged-result carrier并绑定Q02-Q04；Step08不得发明或暴露repository page result |
| S08-D-PAGE-REQUEST-TYPE-01 | open_upstream_internal | Step06 registry使用`ObservationPublicPageRequest`，S08-B current public owner为`ObservationPageRequest`，未发现前者正式声明或alias | 选定一个canonical owner并传播exact name/fields；禁止compatibility alias、Step08-only rename或dual schema |
| S08-D-Q05-WINDOW-SOURCE-01 | open_upstream_internal | Q05 `AuditTimelineView`需要`AuditTimelineWindow`，但current input没有唯一window source/resolver | Step06/07选定canonical window source并传播field、digest、repository filter与empty/mismatch规则；禁止query-time或full-history fallback |
| S08-D-Q05-QUERY-CARRIER-01 | open_internal_affected | Q05 Read façade仍返回单体`ObservationQueryResult<AuditTimelineView>`，分页application carrier及exact mapping未唯一闭合 | Step06/07选定canonical carrier并绑定Q05 return/assembler；禁止暴露repository page result或在API拼页 |
| S08-D-Q05-SURFACE-MAPPER-01 | open_internal_affected | Q05 degraded/error precedence与gap、partial entry、marker mismatch、availability的material source map未唯一绑定 | Step07提供finite typed Q05 mapper/summary；禁止从exception、ref文字或首个失败依赖推导 |
| S08-D-Q05-PAGE-VISIBILITY-01 | open_internal_affected | 空页没有item可推导visibility，page/list visibility seed与mapping未闭合 | Step06/07定义subject/window/scope绑定的page-level visibility resolution；禁止从empty result、cursor或route推导 |
| S08-D-Q05-FRESHNESS-SOURCE-01 | open_internal_affected | Q05 freshness与`as_of_cursor`缺同一正式committed source | 定义Q05 snapshot/freshness source及一致性关系或收窄view；禁止使用query time、最后entry时间、page cursor或rebuild state |
| S08-D-Q05-GAP-SOURCE-01 | open_internal_affected | Q05同subject/window的typed gap source及page callable未传播 | 定义gap source、order/bound/empty与relation mapping；禁止从empty entries、error文字或entry omission推断 |
| S08-D-Q06-SCOPE-OWNER-01 | open_upstream_internal | Q06 `EvidenceIndexScopeRef`只有use-site，缺唯一字段、factory、wire和membership owner | Step06/07选定canonical scope owner并传播selector/digest/membership；禁止从ref/purpose/consumer/default推导 |
| S08-D-Q06-REQUEST-SCHEMA-01 | open_upstream_internal | Q06 public request缺独立canonical declaration和decoder binding | 补唯一schema、sealed binding和typed field validation；禁止alias、双schema或隐藏字段 |
| S08-D-Q06-CONSUMER-SCOPE-SOURCE-01 | open_internal_affected | scope到`EvidenceConsumerScope`的formal resolver/source未唯一传播 | 补typed resolver、compatibility和absence/ambiguity mapping；禁止purpose/handoff/default推导 |
| S08-D-Q06-SCOPE-READ-CARRIER-01 | open_internal_affected | linkage page不能闭合projection/gap/visibility/freshness共同snapshot | 定义bounded composite carrier或有限内部aggregation；禁止未知页扫描、截断和跨snapshot拼接 |
| S08-D-Q06-VISIBILITY-SOURCE-01 | open_internal_affected | Q06专属visibility decision和empty/hidden/degraded mapping未闭合 | 绑定formal read/evidence visibility source；禁止row/handoff/actor/error推导 |
| S08-D-Q06-FRESHNESS-CURSOR-SOURCE-01 | open_internal_affected | Q06缺覆盖全部set的共同committed freshness/as-of cursor source | 定义composite marker/source和一致性证明；禁止time/version/page cursor替代 |
| S08-D-Q06-GAP-SOURCE-01 | open_internal_affected | scope/consumer/snapshot到typed gap set的relation lookup未闭合 | 定义gap relation/read source、bound和empty规则；禁止由遗漏或错误推断gap |
| S08-D-Q06-HANDOFF-BINDING-01 | open_internal_affected | handoff scope/consumer/input与requested scope的atomic relation未闭合 | 定义relation resolver、mismatch precedence和historical snapshot规则；禁止重建或回退preview |
| S08-D-Q07-VIEW-OWNER-01 | open_upstream_internal | `ReportHandoffView`只有Step07 return use-site，缺唯一declaration、fields、factory和mapper | Step06/07在contracts选定唯一view owner并承接Q07最小语义schema；禁止Step08建第二owner |
| S08-D-Q07-REQUEST-SCHEMA-01 | open_upstream_internal | Q07 request只有`handoff_ref` use-site shape，缺独立public schema和decoder binding | 补唯一request owner、sealed binding和typed ref validation；禁止隐藏selector和alias |
| S08-D-Q07-HANDOFF-READ-CARRIER-01 | open_internal_affected | 四个point read没有共同snapshot carrier覆盖handoff/input/hint/visibility/freshness | 定义composite carrier或同一read transaction证明；禁止跨时间拼行、row version当cursor或partial body |
| S08-D-Q07-INPUT-RELATION-01 | open_internal_affected | handoff scope/consumer/input与immutable input relation没有唯一typed mapper | 定义exact relation owner和missing/mismatch precedence；禁止ref bytes/current material推导或重建 |
| S08-D-Q07-HINT-RELATION-01 | open_internal_affected | attached/direct/current-by-handoff hint的same-snapshot uniqueness/parity未闭合 | 定义relation carrier、durable uniqueness和typed error matrix；禁止忽略、任取第一条或重评P6 |
| S08-D-Q07-LIFECYCLE-SOURCE-01 | open_internal_affected | HLD要求H4审计语义，但Step07只有append而无bounded read port | 明确Q07 current-state-only或新增bounded H4 read projection；禁止writer调用、内部扫描和伪造latest record |
| S08-D-Q07-VISIBILITY-SOURCE-01 | open_internal_affected | current request visibility与persisted readiness visibility缺Q07专属resolver/mapper分层 | 绑定metadata scope、formal read source和existence disclosure；禁止aggregate visibility/row existence替代 |
| S08-D-Q07-FRESHNESS-SOURCE-01 | open_internal_affected | response freshness缺覆盖handoff/input/hint的共同committed marker | 定义composite marker/source和consistency mapping；禁止time/version/input-only freshness替代 |
| S08-D-Q07-SURFACE-MAPPER-01 | open_internal_affected | Q07 missing/not-visible/relation/error/degraded/availability precedence未唯一绑定 | Step07提供finite typed Q07 mapper/summary；禁止首个失败、错误文本或state名决定surface |
| S08-D-Q07-PUBLIC-TYPE-MAPPING-01 | open_upstream_internal | domain handoff/readiness/hint/delivery/reason/origin缺contracts-owned finite public mapping | 定义public secondary types/factory和total lossless mapper；禁止domain泄漏、字符串cast和boolean verdict |
| S08-D-Q08-VIEW-OWNER-01 | open_upstream_internal | `RetentionProtectionView`只有Step07 return use-site，Step06 current public views中没有唯一declaration、fields、factory或mapper | Step06/07在contracts选定唯一view owner，并统一承接nested marker/protection mapping；禁止Step08创建第二owner、泄漏domain对象或压成boolean |
| S08-D-Q08-REQUEST-SCHEMA-01 | open_upstream_internal | Q08 request只有`protected_ref` registry shape，缺独立public schema、sealed binding和decoder contract | 补唯一request schema、wire、typed nested validation和operation binding；禁止alias、隐藏selector或从route/body猜operation |
| S08-D-Q08-SELECTOR-AUTHORITY-01 | open_internal_affected | stateful `ProtectedObservationRef`的canonical key、stale snapshot和nested marker mismatch规则未唯一绑定 | 定义identity/equality/resolver authority和stale/conflict matrix；禁止忽略state/marker或用request覆盖current truth |
| S08-D-Q08-RETENTION-READ-CARRIER-01 | open_internal_affected | marker/protection/page/visibility/freshness没有同一committed composite carrier或read transaction证明 | 定义bounded composite read carrier、same-snapshot marker和failure totality；禁止跨时间拼行、partial body或默认多次read一致 |
| S08-D-Q08-PROTECTION-RELATION-01 | open_internal_affected | marker attached ref与按protected ref完整protection lifecycle之间缺sole-current selection、uniqueness和parity owner | 增加current index或bounded exhaustive relation carrier；禁止取第一页/第一条或按state/time/ref猜current |
| S08-D-Q08-HISTORY-SOURCE-01 | open_internal_affected | HLD要求H5审计语义，但Step07只有append而无bounded read port | 明确Q08 current-state-only或新增bounded H5 read projection；禁止调用writer、内部扫描或伪造latest record |
| S08-D-Q08-VISIBILITY-SOURCE-01 | open_internal_affected | marker/protection没有read visibility字段，Q08专属P10/P11 input/source和existence disclosure未唯一绑定 | 绑定metadata scope、formal read target/snapshot和finite visibility mapper；禁止从state、purpose、consumer或row existence推导visibility |
| S08-D-Q08-CONSUMER-DISCLOSURE-01 | open_internal_affected | `ObservationConsumerRefSet`是current protection依据，但public full/limited/summary和redaction规则未唯一闭合 | 定义contracts-owned safe disclosure type或明确允许的typed set及visibility matrix；禁止泄露endpoint、配置或业务状态 |
| S08-D-Q08-FRESHNESS-SOURCE-01 | open_internal_affected | response freshness缺覆盖selector、marker、protection、relation proof和visibility的共同committed marker | 定义composite marker/source、consistency hint mapping和stale/unknown规则；禁止使用row version、request time/state或page cursor |
| S08-D-Q08-SURFACE-MAPPER-01 | open_internal_affected | Q08 invalid/hidden/missing/stale-selector/relation/history/disclosure/degraded/availability precedence未唯一绑定 | Step07提供finite typed Q08 mapper/summary；禁止首个失败、exception文本、state名称或empty option决定surface |

| blocker_id | 状态 | 缺口 | 处理 | 禁止 |
|---|---|---|---|---|
| S08-D-Q09-REQUEST-SCHEMA-01 | open_upstream_internal | Q09 request只有`scope` use-site，缺独立public declaration、sealed binding、wire schema与decoder owner；optional page disposition也未在request owner收敛 | Step06/07选定唯一request owner，明确只含`scope`并传播exact binding | Step08创建DTO/alias、隐藏page、从route/body猜operation或让request digest充当selector |
| S08-D-Q09-POINT-PAGE-CONFLICT-01 | open_internal_affected | `ObservationProjectionScope`是唯一point lookup key，但optional page、Step07 page callable与单体Read result的cardinality未闭合 | 固定Q09 point-only并将list/page拆成具名协议，或同步修改facade/input/response/repository owner | 双模式兼容、取第一页、按page存在性切换或把单体result cast成page |
| S08-D-Q09-READ-CARRIER-01 | open_internal_affected | 三个成员集合、scope、visibility provenance、freshness、gap revisions、rebuild relation与as-of cursor缺同一committed boundary证明 | 提供composite query carrier或transaction-local read fence，并闭合failure totality | 跨调用/跨时间拼接、partial view、row version当freshness或默认多次read一致 |
| S08-D-Q09-MISSING-PRESENCE-01 | open_internal_affected | `Option<ObservationReadModel>`无法区分从未投影、visible absence、hidden、stale/rebuilding、index corruption与dependency unavailable | 提供typed absence/anchor/reservation source并固定visibility-before-existence precedence | `None`自动映射为`NotFound`、`NotYetProjected`、`Empty`，合成empty view/ref或触发rebuild |
| S08-D-Q09-VISIBILITY-SOURCE-01 | open_internal_affected | Q09 P11需要完整one-shot visibility provenance、constraint、block reason、source gap和same-snapshot input，当前无专属source mapper | 提供Q09专属visibility carrier/mapper，绑定metadata scope、P10、P11与gap revisions | 从row existence、member count、scope kind、state、HTTP status或error text推导visibility |
| S08-D-Q09-FRESHNESS-SOURCE-01 | open_internal_affected | freshness未覆盖view、scope、visibility、gap、rebuild relation和as-of cursor的共同persisted/committed source | 定义Q09 composite freshness source、marker parity与AllowStale/RequireFresh/BestEffort映射 | 用row version、requested_at、last member time、domain state或page cursor伪造`Fresh` |
| S08-D-Q09-REBUILD-RELATION-01 | open_internal_affected | progress ref到`RebuildProgressView`、maintenance target、immutable scope binding和lifecycle state缺完整read proof | 定义progress-by-ref relation carrier、target/member binding、None progress语义与mismatch precedence | mint progress ref、按target重建progress、等待/启动/推进/修复rebuild或把Completed当source repair |
| S08-D-Q09-DEGRADED-SOURCE-01 | open_internal_affected | P13需要exact target、P11 decision、explicit safety input与complete current gaps，Q09没有唯一P13 input mapper | 提供Q09 P13 input mapper并明确typed `NotApplicable` safety规则与gap precedence | 从visibility kind、missing enum、ApplicationError文本、gap count或adapter diagnostic合成degraded |
| S08-D-Q09-AVAILABILITY-SOURCE-01 | open_internal_affected | projection read failure、availability probe、consistency failure与public availability/error surface没有有限、Q09专属映射 | 定义read-owner availability snapshot、adapter family、dependency precedence和safe public mapping | 默认`Available`、fallback store、把timeout当missing或泄露provider/credential detail |
| S08-D-Q09-SURFACE-MAPPER-01 | open_internal_affected | invalid/hidden/missing/empty-in-body/stale/rebuilding/unknown/degraded/availability/error precedence与material source map未唯一绑定 | 提供finite Q09 mapper/summary；response assembler只做lossless copy并保留P10/P11/P13结果 | 由首个失败调用、`None`、空集合、state名称、异常文本或HTTP status决定最终surface |
| S08-D-Q10-REQUEST-SCHEMA-01 | open_upstream_internal | Q10 request只有use-site，缺独立public declaration、wire schema、sealed binding和decoder owner | 唯一contracts request owner只承载canonical `scope`并传播exact binding | Step08创建DTO/alias、加入request-context/view/summary selector |
| S08-D-Q10-REQUEST-CONTEXT-CARRIER-01 | open_upstream_internal | one-shot `DiagnosticRequestContextRef`应由trusted entry生成，但shared metadata/assembler无non-body carrier位置，且R06.8-A字段位置冲突 | 闭合entry生成、carrier、digest与assembler source | caller body提交、从digest/trace/time转ref或复用其他identity |
| S08-D-Q10-DIAGNOSTIC-READ-CARRIER-01 | open_internal_affected | `Option<DiagnosticView>`不能证明view/scope/current summary head/member/marker/cursor/visibility/absence来自同一committed boundary | 增加least-authority Query-safe composite carrier/callable | full store、跨调用拼装、writer version carrier或partial body |
| S08-D-Q10-SUMMARY-HEAD-RELATION-01 | open_internal_affected | Query read面缺single current summary head、view pointer与immutable summary revision parity证明 | 在carrier/rehydrate中闭合head uniqueness与字段parity | 按latest/max/first选summary或dangling pointer fallback |
| S08-D-Q10-MISSING-PRESENCE-01 | open_internal_affected | point callable不能区分visible absence、hidden、not-yet-projected、retention/reference absence、corrupt与unavailable | 提供typed committed absence/anchor proofs并固定visibility-first precedence | `None`映射NotFound/NotYetProjected/Empty或触发rebuild |
| S08-D-Q10-VISIBILITY-SOURCE-01 | open_internal_affected | Q10缺P10/P11 exact target、one-shot provenance及persisted inner到request outer visibility narrowing owner | 提供Q10专属input/source与response-only narrowing/parity | 从row/state/count/scope/actor/HTTP推导visibility |
| S08-D-Q10-DUAL-FRESHNESS-SOURCE-01 | open_internal_affected | summary与projection freshness为独立轴，但缺same-boundary common source、marker parity和hint mapping | 定义dual-freshness composite source和3x4 consistency matrix | 一轴升级另一轴或以time/version伪造Fresh |
| S08-D-Q10-REBUILD-RELATION-01 | open_internal_affected | progress ref到progress view、maintenance target、immutable scope binding、lifecycle和diagnostic marker缺Query-safe proof | least-authority carrier闭合progress-by-ref与target/scope relation | mint/latest-select/wait/start/advance rebuild或Completed升级truth |
| S08-D-Q10-DEGRADED-SOURCE-01 | open_internal_affected | P13 exact DiagnosticView target、P11 decision、explicit safety及complete current gaps缺唯一mapper | 提供Q10 P13 input和response-only limited/blocked mapper | 从state/error/gap count合成或创建durable degraded revision |
| S08-D-Q10-AVAILABILITY-SOURCE-01 | open_internal_affected | local projection、policy和progress failure到public availability/AdapterFamily/error的multi-dependency mapping未闭合 | 定义read dependency snapshot、local family mapping和precedence | default Available、first failure wins、fallback store或泄露provider detail |
| S08-D-Q10-SURFACE-MAPPER-01 | open_internal_affected | invalid/hidden/missing/corrupt、双freshness、degraded、availability与error的最终precedence/body matrix未唯一绑定 | 提供finite Q10 result summary/response assembler | first exception、`None`、state、empty set或HTTP status决定surface |
| S08-D-Q11-REQUEST-SCHEMA-01 | open_upstream_internal | Q11 request缺canonical tagged Point/BySource declaration、wire discriminator、sealed binding与decoder owner | 唯一contracts owner声明exact tagged schema并传播binding | Step08第二owner/alias、三Options wire、page猜variant或新增Query |
| S08-D-Q11-SELECTOR-CARDINALITY-01 | open_internal_affected | current三个Option允许非法selector/page组合 | 增加private normalized selector并由assembler原子构造 | first-wins、default page、global scan或忽略非法字段 |
| S08-D-Q11-RESULT-CARDINALITY-01 | open_internal_affected | current单体Read result不能承载point与paged两种cardinality | 唯一operation result、Read façade与response assembler branch binding | page塞入single view、entry cast或未注册并行façade |
| S08-D-Q11-POINT-READ-BUNDLE-01 | open_internal_affected | point Option view缺gap/degraded/marker/visibility/absence/availability same-boundary proof | least-authority point composite carrier与total rehydrate | N+1、None->NotFound、full store/UoW或多次read默认一致 |
| S08-D-Q11-SOURCE-PAGE-READ-BUNDLE-01 | open_internal_affected | Query facet缺source lifecycle page，full UoW/version carrier能力过宽且material不完整 | bounded least-authority page carrier，保留Resolved/Suppressed与same-binding continuation | full UoW、逐项point、hidden filter、domain/version leak或current-only list |
| S08-D-Q11-PAGE-ORDER-01 | open_internal_affected | Step07 exact `gap_ref ASC`与摘要`(opened_at, gap_ref)`冲突 | 统一binding/prose/fake/durable/planned tests，改变key时升revision | adapter自选、timestamp默认、offset或同revision改key |
| S08-D-Q11-POLICY-TARGET-01 | open_upstream_internal | source lifecycle page没有精确P10/P11 target，GapSourceRef不是ProjectionScope | 增加/选择有限source-lifecycle target及exact relation | 伪装scope/object、first item代表page或跳过policy |
| S08-D-Q11-VISIBILITY-SOURCE-01 | open_internal_affected | point/page complete P11 provenance与不改变pagination的disclosure mapper缺失 | Q11 branch-specific visibility source、outer ceiling与whole-page rule | row/state/count/actor推导、drop hidden或借unrelated gap |
| S08-D-Q11-FRESHNESS-SOURCE-01 | open_internal_affected | point marker parity及共同page freshness boundary缺失 | branch-specific freshness source与hint mapper | time/version/cursor/first-last/min-max伪造Fresh |
| S08-D-Q11-REBUILD-RELATION-01 | open_internal_affected | Rebuilding marker到progress/target/immutable binding/membership缺Query-safe proof | carrier提供persisted relation和mixed-page mapping | mint/latest/wait/advance/repair或Completed升级truth |
| S08-D-Q11-DEGRADED-SOURCE-01 | open_internal_affected | same-gap degraded parity与per-item/page P13 input mapper缺失 | exact relation及response-only P13 mapper | 从state/count/error推导、latest revision或创建durable state |
| S08-D-Q11-MISSING-PRESENCE-01 | open_internal_affected | point absence分类与page source-existence/completed-read proof缺失 | typed absence/anchor/retention/reference及source page proof | None->NotFound/Empty、timeout当missing或空页升级source truth |
| S08-D-Q11-AVAILABILITY-SOURCE-01 | open_internal_affected | point/page multi-dependency到availability/family/error mapping缺失 | branch dependency snapshot和disclosure-safe precedence | default Available、first error、fallback scan或provider leak |
| S08-D-Q11-SURFACE-MAPPER-01 | open_internal_affected | selector/cursor/hidden/missing/empty/relation/freshness/degraded/availability/error matrix无唯一owner | finite Q11 branch-specific result summary/response assembler | partial page、首异常、state/count/HTTP决定surface |
| S08-D-Q12-REQUEST-SCHEMA-01 | open_upstream_internal | Q12 request缺canonical `consumer_ref + scope` declaration、wire schema、sealed binding与decoder owner | 唯一contracts owner声明两个required fields并传播exact binding/digest order | Step08第二DTO/alias、旧scope wrapper、route/product猜字段 |
| S08-D-Q12-CONSUMER-AUTHORITY-01 | open_internal_affected | caller structured consumer含state/export flag，但trusted current snapshot/provenance与drift mapping未闭合 | bounded current-consumer snapshot与typed absence/error/drift mapping | 信任caller flag/state、默认Active或用view旧state授权 |
| S08-D-Q12-POINT-READ-BUNDLE-01 | open_internal_affected | Option view缺view/read-model/optional relation/consumer/visibility/gap/marker/freshness/rebuild/degraded/availability/absence same-boundary proof | least-authority `PeripheralExportViewPointBundle`或等价carrier | N+1、full UoW/writer version、source scan或多次read默认一致 |
| S08-D-Q12-IDENTITY-RELATION-01 | open_internal_affected | view/marker stable identity与selector/read-model/replacement/rehydration relation缺Query proof | carrier闭合identity与relation parity；identity只由owner生成 | pair/hash/digest/row-version/cursor派生或read时mint |
| S08-D-Q12-POLICY-TARGET-01 | open_upstream_internal | P10/P11 vocabulary缺exact consumer+projection-scope target/absence anchor | 增加有限peripheral target或等价target-bound carrier | scope-only、view-ref-only、first view或旧opaque wrapper |
| S08-D-Q12-VISIBILITY-SOURCE-01 | open_internal_affected | request scope、persisted visibility、trusted consumer、gaps与P10 decision的one-shot P11 source未闭合 | Q12 visibility source、provenance与disclosure ceiling mapper | caller Visible、state/flag/HTTP/row existence推导或借unrelated gap |
| S08-D-Q12-PRESENCE-01 | open_internal_affected | Option不能区分visible absence、not-yet-projected、retention/reference absence、hidden、unavailable和corrupt | typed absence/anchor/retention/reference proof与fixed precedence | None->NotFound、timeout/error/external Disabled->Missing或synthetic view |
| S08-D-Q12-FRESHNESS-SOURCE-01 | open_internal_affected | marker parity、consistency hint及view/consumer/read-model coverage的共同source未闭合 | Q12 freshness source与hint mapper；Fresh仅由persisted marker证明 | time/version/state/cursor/successful read伪造Fresh |
| S08-D-Q12-REBUILD-RELATION-01 | open_internal_affected | progress、maintenance target、immutable scope binding与consumer/scope membership缺Query-safe proof | bounded progress-by-ref relation及None/error/Completed mapping | mint/latest/wait/advance/repair或Completed升级truth |
| S08-D-Q12-DEGRADED-SOURCE-01 | open_internal_affected | P13 exact target、P11 decision、explicit safety与complete gap revisions缺mapper | response-only Q12 P13 input/decision mapper与gap parity | 从state/visibility/count/error推导或创建durable degraded state |
| S08-D-Q12-AVAILABILITY-SOURCE-01 | open_internal_affected | local read dependencies到public availability/family/error的finite precedence未闭合 | Q12 dependency snapshot、local family mapping与safe precedence | default Available、first error、fallback scan、timeout当Missing或provider leak |
| S08-D-Q12-SURFACE-MAPPER-01 | open_internal_affected | Present/Missing/Unknown、visibility、freshness、rebuild、degraded、availability、error矩阵与response assembler无唯一owner | finite Q12 result summary/assembler与cross-field validation | entry补查、state/HTTP/error文本决定surface或body/error共存 |
| S08-D-Q12-P14-BOUNDARY-01 | open_internal_affected | read view与P14 preparation/delivery及external adapter phase separation需唯一传播 | Q12只到P10/P11/P13；P14只由写侧调用 | Query创建preparation/delivery、调用P14或声称external acceptance |
| S08-D-Q13-REQUEST-SCHEMA-01 | open_upstream_internal | current request只有两个Option use-site，缺canonical tagged public declaration、wire schema、sealed Query binding、unknown-field和decoder owner | Step06/07在唯一contracts owner声明`ReferenceSnapshotViewSelector`和request，并传播exact binding/digest order | Step08创建第二DTO/alias、保留双Option wire或从route猜分支 |
| S08-D-Q13-SELECTOR-CARDINALITY-01 | open_internal_affected | 两个Option允许none/both，且BySnapshot/BySubject absence语义未静态分开 | assembler/application增加private normalized tagged selector；service按两分支穷举 | first-wins、both优先snapshot、none当global/current scan或隐式默认subject |
| S08-D-Q13-SUBJECT-CURRENT-HEAD-01 | open_internal_affected | writer-oriented current lookup会隐藏Invalid，缺Query-safe sole current-head carrier和no-head/duplicate/index-error totality | 提供bounded current-head index/read carrier并证明head/view parity | 调用maintenance lookup、过滤Invalid、取最新时间/第一行或把error当no-head |
| S08-D-Q13-POINT-READ-BUNDLE-01 | open_internal_affected | snapshot/head/view/marker/gap/visibility/freshness/absence/availability尚无same-boundary least-authority carrier | 提供`ReferenceSnapshotViewPointBundle`或等价唯一carrier，一次返回完整read-safe material | N+1、跨transaction拼装、full UoW、writer Versioned或source scan |
| S08-D-Q13-IDENTITY-RELATION-01 | open_internal_affected | snapshot ref同时是state/view identity，但selector/head/view/marker replacement与rehydration parity未由Query carrier证明 | carrier证明stable identity、subject relation、marker relation和replacement semantics | selector/digest/time/version/cursor派生ref或每次read mint view/marker |
| S08-D-Q13-POLICY-TARGET-01 | open_upstream_internal | P10/P11 target vocabulary不能精确表达BySubject no-head disclosure anchor与current-head selection | 增加有限reference selector target/absence anchor或等价target-bound carrier | subject强转ObservationObjectRef、scope-only、snapshot-ref代替subject absence或跳过P10 |
| S08-D-Q13-REQUEST-CONTEXT-CARRIER-01 | open_upstream_internal | `DiagnosticRequestContext` scope不适用于Q13，shared Query metadata/input也缺trusted non-body one-shot carrier | Step06/07定义trusted entry carrier位置、scope binding、digest和lifetime | 从snapshot/subject/trace/digest/requested_at派生、application临时mint或caller提交context |
| S08-D-Q13-VISIBILITY-SOURCE-01 | open_internal_affected | exact target、persisted visibility、gap provenance、freshness和trusted context到P11 one-shot source未闭合 | 提供Q13 visibility source/mapper，固定visibility-before-existence和只收窄规则 | caller提交Visible、从state/subject kind/row existence/HTTP推导或借unrelated gap |
| S08-D-Q13-PRESENCE-01 | open_internal_affected | current Option形态不能区分no-head、not-yet-projected、retention/reference absence、hidden、corrupt和store failure | 提供typed current-head/absence anchor/retention/reference proof与finite precedence | None映射NotFound/Empty、timeout映射Missing、hidden映射Missing或synthetic view |
| S08-D-Q13-STATE-SURFACE-01 | open_internal_affected | Resolved/Stale/其他state的summary/version条件矩阵缺唯一lossless response mapper和cross-field validation | 提供state-to-view mapper和`try_new` validation，固定各variant矩阵 | 只复制state、单项summary/version、过滤Invalid或清空错误字段后继续 |
| S08-D-Q13-DUAL-FRESHNESS-SOURCE-01 | open_internal_affected | local reference state与projection freshness两个独立轴缺共同committed source、marker parity和hint mapper | 提供双轴point source与3x4 consistency mapping；Fresh仅由persisted marker证明 | Resolved映射Fresh、state覆盖projection freshness或以version/time/read success伪造Fresh |
| S08-D-Q13-GAP-SOURCE-01 | open_internal_affected | gap refs、visibility/degraded source与snapshot relation缺same-boundary current revision proof | 提供typed gap relation set、revision parity和absence/degraded source mapping | latest gap、gap count、跨subject gap或missing gap当no-gap |
| S08-D-Q13-REBUILD-RELATION-01 | open_internal_affected | Rebuilding progress、maintenance target、immutable scope binding与reference coverage缺Query-safe relation | 提供bounded progress-by-ref carrier及None/error/Completed mapping | mint/latest progress、wait/start/advance/repair或Completed升级resolver/source success |
| S08-D-Q13-DEGRADED-SOURCE-01 | open_internal_affected | P13 exact target、P11 decision、explicit safety和complete gap revisions缺response-only Q13 mapper | 提供Q13 P13 input/decision mapper并保持state/freshness/visibility来源分离 | 从state/visibility/gap count/error合成或创建durable degraded revision |
| S08-D-Q13-AVAILABILITY-SOURCE-01 | open_internal_affected | local snapshot、projection store、marker/gap/policy dependencies到public availability/error的finite precedence未闭合 | 定义Q13 dependency snapshot、local AdapterFamily mapping和disclosure-safe precedence | default Available、first error、resolver probe、timeout当Missing或provider detail泄露 |
| S08-D-Q13-AVAILABILITY-STATE-SEPARATION-01 | open_internal_affected | local snapshot Unavailable与Query dependency unavailable缺唯一cross-axis mapper | 分别定义local-state surface、Query dependency surface和typed error来源及组合矩阵 | 任一Unavailable覆盖另一轴、local state当store failure或store failure当snapshot state |
| S08-D-Q13-SURFACE-MAPPER-01 | open_internal_affected | presence、visibility、state pair、双freshness、rebuild、degraded、availability和error矩阵无唯一response assembler | 提供finite Q13 result summary/assembler与cross-field validation | entry补查、state/HTTP/error文本决定surface或body与missing/error共存 |
| S08-D-Q13-REFRESH-BOUNDARY-01 | open_internal_affected | committed read与resolver/P15-P18/reference write/refresh的phase边界仍须在use-site传播 | Q13限制为committed read；refresh只由后置Command/Job owner调用并在Step09/13回指 | Query调用resolver、刷新/替换snapshot、把read视为refresh result或写H10 |

| blocker_id | 状态 | 说明 | 处理 |
|---|---|---|---|
| S08-C05-SUMMARY-SOURCE-01 | open_internal_affected | C05 canonical `SafeExternalSummaryRef` source/use-site与trusted producer未唯一闭合，当前缺失fail-closed | Step06/07 affected修订；禁止沿用`SafeSummaryRef` alias或从raw summary/body补值 |
| S08-C06-CONSUMER-SCOPE-SOURCE-01 | open_internal_affected | C06 `EvidenceConsumerScope`是linkage/P4/relation lookup必需输入，但concrete input尚无唯一来源 | Step06/07 affected修订；禁止从purpose、boundary、产品名或默认值推导 |
| S08-C07-IMMUTABLE-INPUT-REF-01 | open_internal_affected | C07 immutable body-free `EvidenceIndexInputView`的唯一mint/rehydrate owner与同ref冲突规则未闭合 | Step06/07 affected修订；禁止从current evidence重建snapshot或覆盖冲突ref |
| S08-C08-ORIGIN-SOURCE-01 | open_internal_affected | C08 resolver origin resolution、target-bound assessment与P6 decision use-site未唯一闭合 | Step06/07 affected修订；禁止从request/config/default/replay payload升级origin |
| S08-C12-VIOLATION-REASON-OWNER-01 | open_internal_affected | C12 public input需要`NoWriteViolationReason`，但Step06尚未给出唯一owner、variant和wire contract；reason缺失时必须在assembler前置失败 | Step06/07 affected修订；禁止替换为`NoWriteViolationRecordReason`、字符串化或静默丢弃reason |
| S08-C13-GAP-REQUEST-AUTHORITY-01 | open_internal_affected | C13旧input/digest接受caller kind/reason/limited outcome并缺affected/scope selectors | 修订为source/affected/scope selector-only；禁止兼容双schema |
| S08-C13-SOURCE-AFFECTED-LOOKUP-01 | open_internal_affected | Step07缺source-to-affected typed dependency lookup | 补exact absence/ambiguity contract；禁止ref/request猜membership |
| S08-C13-CURRENT-GAP-KEY-01 | open_internal_affected | P12按source+affected绑定，current lookup仅按source | 唯一化关系；禁止任取第一行或cross-affected duplicate |
| S08-C13-DEGRADED-INPUT-SOURCE-01 | open_internal_affected | complete P11/P13 target-bound input来源未唯一闭合 | Step06/07修订；禁止caller/default构造policy outcome |
| S08-C14-EXPORT-SCOPE-OWNER-01 | open_internal_affected | 旧`ExternalAuditExportScopeRef`无owner；scope应来自loaded view | 删除旧scope输入；禁止caller覆盖view scope |
| S08-C14-PREPARATION-INPUT-SOURCE-01 | open_internal_affected | evidence input及consumer/input/view current preparation relation lookup未唯一闭合 | 补lookup/ambiguity owner；禁止rebuild/parallel duplicate/error-as-absence |
| S08-C14-VISIBILITY-AUTHORITY-01 | open_internal_affected | 旧C14让caller提交final visibility | readiness/visibility/gaps/block仅由P14；禁止跳过policy |
| S08-C15-REGISTRATION-AUTHORITY-01 | open_internal_affected | 旧C15让caller提交summary/freshness/version | registration收缩为subject-only Pending；禁止注册即Resolved/Fresh |
| S08-C15-INITIAL-H10-MAPPING-01 | open_internal_affected | initial Pending无H10 accepted input，旧F2 mapping冲突 | 删除Register->H10；禁止伪造transition/proof |
| S08-C16-REFRESH-REQUEST-AUTHORITY-01 | open_internal_affected | 旧C16让caller提交state/summary/version/reason | public只含snapshot+target；refresh result由resolver mapping产生 |
| S08-C16-MAINTENANCE-TARGET-SOURCE-01 | open_internal_affected | snapshot subject到canonical target/scope/dependency/P17 lane未唯一闭合 | 补typed mapping；禁止target-ref即授权或config fallback |
| S08-C15-C16-RESOLVER-SUBJECT-BINDING-01 | open_internal_affected | C15注册到C16刷新之间缺完整`SubjectObservationReference` lifecycle/store owner；当前ID来源、Resolved-only factory与缺失typed mint/lookup/stage互相冲突，`ReferenceSubjectRef`也不足以调用resolver | 补pending-compatible或pre-existing trusted relation裁定及exact owner/absence/ambiguity规则；禁止合成、临时mint、跨resolver family或error-as-absence |
| S08-C16-NEW-SNAPSHOT-PROOF-SIGNATURE-01 | open_internal_affected | 旧object card `Result<Self>`与H10 creation-proof signature冲突 | 统一返回`(State, ReferenceSnapshotCreated)`；禁止无proof写H10 |
| R07-EXTERNAL-PHASE-LINK-01 | step06_07_closed_downstream_open | C07/C14、J07/J08在协议层只引用stable intent/result expectation | S08-C/G逐协议传播，后置Step闭合external phase flow；不得提前声称provider acceptance或delivery已验证 |
| R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01 | step06_07_closed_downstream_open | Job shared report保留typed retry/finalize handoff | S08-G逐Job传播；不得伪造external exactly-once、重复whole delivery或声称测试已运行 |
| 03-RPR-S09-PER-FLOW | open | 60协议只有约17个具名flow小节,Query/Consumer/Event/Job大量由共享模板代替逐接口闭口 | Step08稳定后逐接口重写Step09；当前冻结不写 |

## 历史材料与当前处理

| 输入 | 当前处理结论 |
|---|---|
| 旧 `projects/L4-observability/README.md` | historical_material;只作为问题诊断输入,不继承技术栈、目录、P95、冷存、hash chain、事件数量或产品绑定 |
| 上一轮粗糙 `00-需求文档.md` | historical_material_replaced;当前正式 `00` 已完成 full-restart 正式装配 |
| 上一轮粗糙 `01-架构设计.md` | historical_material_replaced;当前正式 `01` 已完成 Step 16 正式装配 |
| 上一轮粗糙 `02-概要设计.md` | historical_material_replaced_by_current_baseline;当前正式 `02` 已由 Step 14 按 Step 01~13 当前产物重建 |
| 上一轮粗糙 `02_hld_calibration_flow.md` | historical_material_replaced;旧全 Step pass 状态和旧自动门禁已废止 |
| 上一轮粗糙 `02_hld_step_01` ~ `02_hld_step_13` | historical_material_replaced;已由当前 Step 01~13 产物替换,不得沿用旧 schema / 产品 / 自动顺推心智 |
| 上一轮粗糙 `02_hld_step_14` | historical_material_replaced;已由当前 `02_hld_step_14_formal_document_assembly.md` 替换 |
| 旧 `03-详细设计.md` | historical_material_replaced;旧约456行正文已由本轮Step19基于current Step01~18全量重建,不得作为实现契约 |
| 上一轮粗糙 `03_ddd_calibration_flow.md` | historical_material_replaced;旧全Step pass和旧自动装配门禁已废止,当前flow只承认本轮Step01~19及formal全文门禁 |
| 上一轮粗糙 `03_ddd_step_01_upstream_boundary.md` | historical_material_replaced;已由当前 Step 01 产物替换,旧 log / metric / trace schema 先行口径不得沿用 |
| 上一轮粗糙 `03_ddd_step_02_scope.md` | historical_material_replaced;已由当前 Step 02 产物替换,旧短 schema 摘要和旧自动门禁不得沿用 |
| 上一轮粗糙 `03_ddd_step_03_constraints.md` | historical_material_replaced;已由当前 Step 03 产物替换,旧 schema 先行、产品线索和自动顺推门禁不得沿用 |
| 上一轮粗糙 `03_ddd_step_04_file_layout.md` | historical_material_replaced;已由当前 Step 04 产物替换,旧 schema 摘要、缺失文件布局和自动顺推门禁不得沿用 |
| 上一轮粗糙 `03_ddd_step_05_module_contracts.md` | historical_material_replaced;已由当前 Step 05 产物替换,旧五组成部分、health / cost / dashboard truth 和自动顺推门禁不得沿用 |
| 上一轮粗糙 `03_ddd_step_06_object_contracts.md` | 最早粗糙版本仍为historical；随后full-restart版本现作为repair input,其原done/pass已由current `R06.1`废止；旧`ObservationEnvelope`/`MetricPoint`/hash link仍不得恢复 |
| 上一轮粗糙 `03_ddd_step_07_trait_port_adapter_contracts.md` | historical_material_replaced;已由当前 Step 07 产物替换,旧 `ObservationEnvelope` / `MetricPoint` / `TraceSpanRecord` / hash link / 产品 port 心智不得沿用 |
| 上一轮粗糙 `03_ddd_step_08_protocol_contracts.md` | historical_material_replaced;已由当前 Step 08 产物替换,旧 `IngestObservationMaterialCommand` / `ObservationEnvelope` / metric rollup / trace schema 心智不得沿用 |
| 上一轮粗糙 `03_ddd_step_09_function_flows.md` | historical_material_replaced;已由当前 Step 09 产物替换,旧 `IngestObservationMaterialCommand` / `ObservationEnvelope` / hash / metric / trace schema 心智不得沿用 |
| 上一轮粗糙 `03_ddd_step_10_state_matrix.md` | historical_material_replaced;旧 45 行状态摘要已由当前 Step 10 产物替换,旧 `ObservationIngestReceipt` / `RedactionDecision` / `AuditEventProjection` / `ProjectionRebuildReport` 不得沿用 |
| 上一轮粗糙 `03_ddd_step_11_persistence_transaction_consistency.md` | historical_material_replaced;已由当前 1340+ 行 Step 11 产物替换,旧薄摘要、产品持久化、raw schema或自动顺推心智不得沿用 |
| 上一轮粗糙 `03_ddd_step_12_error_recovery.md` | historical_material_replaced;旧81行内容已由当前1100+行Step 12产物全量替换,废弃对象与自动顺推门禁不得恢复 |
| 上一轮粗糙 `03_ddd_step_13_concurrency_idempotency.md` | historical_material_replaced;旧81行内容已由当前1260+行Step 13全量替换，废弃对象、schema摘要、无actor key、无fence/token和自动顺推门禁不得恢复 |
| 上一轮粗糙 `03_ddd_step_14_config_external_binding.md` | historical_material_replaced;旧69行摘要已由当前1400+行typed config/external binding/runtime assembly产物替换 |
| 上一轮粗糙 `03_ddd_step_15_observability_audit.md` | historical_material_replaced;旧81行schema-first摘要已由当前980+行runtime telemetry / durable audit分层、log / metric / trace / native audit、redaction与self-recursion产物全量替换 |
| 上一轮粗糙 `03_ddd_step_16_test_cuts.md` | historical_material_replaced;旧37行废弃对象/候选ID摘要已由当前650+行七模块、60协议双切口、28状态切口、一致性/幂等/观测安全和脚本契约产物全量替换 |
| 上一轮粗糙 `03_ddd_step_17_implementation_handoff.md` | historical_material_replaced;旧47行摘要已由当前1000+行Step 17实施承接、跨文档一致性、implementation precondition和`07`逐boundary审计输入全量替换 |
| 上一轮粗糙 `03_ddd_step_18_risks_open_questions.md` | historical_material_replaced;旧81行schema摘要已由当前479行风险分层、14项风险、12项待确认、未确认前处理和正式§17草稿全量替换 |
| 上一轮粗糙 `03_ddd_step_19_formal_document_assembly.md` | historical_material_replaced;已由本轮章节来源、分批装配、全文门禁与停审记录完整替换 |
| 旧 `04-配置设计.md` | historical_material;旧292行正文基于自动全Step pass链,含旧key/profile/value/source order与下游ID；只在Step15由current Step01~14全量替换 |
| pre-M3 `04_config_calibration_flow.md` | historical_material_replaced_by_current_M4_flow;旧Step10等待Step11恢复点已废止，本轮从current Step01重启 |
| pre-M3 `04_config_step_01_upstream_boundary.md` | historical_material_replaced_by_current_M4_step01;旧结论只在current Step01差异诊断中留痕 |
| pre-M3 `04_config_step_02_scope.md` ~ `04_config_step_10_change_audit_rollback.md` | historical_material_not_current;旧pass/完成状态在current M3后失效；物理文件只供进入对应Step后的后置差异审计 |
| pre-M3 `04_config_step_11_failure_degradation.md` ~ `04_config_step_15_formal_document_assembly.md` | historical_material_not_current;未经本轮逐Step门禁，不得读取为current或恢复完成状态 |
| 旧版 `05-测试方案.md`、旧版 `06-验收标准.md`、旧版 `07-实施计划.md` | historical_material；current `05/06` 已由各自 full-restart 正式装配替换；旧 `07` 只作本轮逐 Step 差异诊断，不得作为 current truth |
| 上一轮粗糙 `implementation_execution_ledger.md` 与 `implementation-boundaries/*` | historical_material；物理文件存在不等于授权；在 current `07` 完成并按 current boundary matrix 重建/核验前，不得作为实现移交门禁 |

## 设计纪律记录

- 当前 `00-需求文档.md` 已完成 full-restart 正式装配。
- 当前 `01-架构设计.md` 已完成 full-restart 正式装配。
- 当前 `02-概要设计.md` 已完成 Step 01~14 和正式装配,已经作为 `03-详细设计.md` 的直接上游。
- 当前`03-详细设计.md`已完成M3 Step19正式装配并由用户确认进入`04`；`60/60 recorded_with_affected_open`、`0/60`无条件完成、27状态owner、12 affected、14 risks和12 questions继续作为current配置输入。
- Runtime activation current责任固定为：`infra::config`执行stages 1~4并产出validated root，`infra::runtime_builder`按explicit `build_api/build_worker/build_jobs`执行selected-profile stages 5~12并返回一个matching具名runtime或error，selected API/worker/jobs进程在stage 13使用matching activation/registrar完成本地group registration；三段均不得暴露partial runtime、声明跨进程联合事务或反写业务truth。
- R06.7-D固定五个候选为`DX`：API使用static exact handler与per-call local value，worker只保留九类Consumer callback，publication/maintenance只走typed Operations Job，jobs exact handler直接消费C-07 invocation；任何framework private wrapper都不得成为canonical object或保存last result/disposition/identity。
- R06.7-E固定`EntryDisposition=HX`并关闭其owner gap；C-03~C-10保持canonical，C-11/C-13标记为`FC_affected`，Consumer action逐协议/逐flow闭合且publication只有`PublishObservationOutbox` Job入口。
- R06.8-A固定48个concrete service input、16/14/9/9有限具名assembler方法、profile-aware candidates/context顺序；`JobRunId`、`ReferenceSnapshotStateRef`和structured peripheral target替换冻结旧type。
- R06.8-B把C-11收缩为Consumer-only，把publication收敛为统一Operations Job façade下的claimed-item collaborator，固定11-tag association与exact `publication_dead_letter`，并把C-13改为三个具名runtime、各自一个assignment和matching process-local activation，同时固定`domain/src/records/`与application input/assembly/record module布局。
- 当前`04-配置设计`已从current M3之后full-restart；Step01 current产物和flow已重建，formal `04`未修改。pre-M3 Step02~15均为historical，只有用户确认后才可读取并重建Step02。
- 正式完成 current `07-实施计划.md` 时，才允许重建/核验 implementation ledger 和全部 planned boundary skeleton，并只激活一个 current boundary；旧物理文件不构成授权。
- 本轮不实现代码、不提交 commit、不伪造实现 commit、真实 `run_id`、验收签署、真实 evidence alias 或测试结果。

## Historical 下一批阅读清单（已由Current M3 closure覆盖）

当前为`03` Step08 `Step08_M1_completed_waiting_before_Step09`。M1-A~M1-E已完成，60项协议卡均已形成，
但所有affected仍开放；下一动作必须先等待用户明确确认。确认后才读取：

1. `standards/document/详细设计讨论流程_SOP.md` 的 Step 09部分；
2. `standards/document/详细设计书写规范.md` 对应函数级flow要求；
3. current Step06/07 callable、UoW、claim/fence、result/report owner材料；
4. `projects/L1-governance` 与 `projects/L1-artifact` 的Step09中间产物和正式文档粒度参考；
5. Step08 current protocol cards及唯一flow reservation。

获得确认后，只允许进入Step09；不得顺带读取或写入Step10以后、修改正式`03`、任何`04`文件、
implementation ledger、boundary skeleton或实现代码。`03-RPR-S09-PER-FLOW`仍开放，Step09必须逐协议
重建exact flow，不能以shared template替代。

当前已知 blocker/affected 包括：`S08-E-I05-PAYLOAD-SCHEMA-01`、
`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM=open_controlled`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`与
`S08-M1-SECONDARY-TYPE-OWNER-01`；本轮没有新增外部 blocker。

当前恢复点为`Step08_M1_completed_waiting_before_Step09`；现在必须停审。未经确认不得进入Step09；
不得读取或写入Step10以后、formal`03`、任何`04`文件、implementation ledger、boundary skeleton或实现代码；
当前不需要提交。

## Historical S08-E Consumer I05 §10 stop review

| 检查项 | 结论 |
|---|---|
| 当前小节 | `pass_with_affected_open`；I05 §10已完成durable landing、one-UoW/save order、commit/rollback/probe与result persistence handoff设计记录；正式`03`仍frozen |
| current reachability | `pass_with_affected_open`；canonical payload、positive producer binding、完整input与唯一landing未闭合，current accepted write set为零；不伪造reservation、primary、record、result、receipt或C-05 action |
| landing authority | `not_closed`；不得从EvidenceLinkage、ReferenceSnapshotState、AuditProjection、GapState或repository capability任选primary；新增`S08-E-I05-DURABLE-LANDING-01`保持开放 |
| UoW/save order | `pass_at_target_contract_level`；future one-UoW顺序固定为primary -> cursor -> record/follower/outbox -> `save_result` -> `mark_completed` -> `commit`；assembler、entry、resolver不持有UoW |
| replay/result handoff | `pass_with_affected_open`；复用immutable `StoredObservationResult`与typed `get_result`，fresh/replay不从current truth重建；missing/corrupt pointer不降级为Ephemeral |
| affected / blocker | I05专属13项全部开放：2项`open_upstream_internal`、11项`open_internal_affected`；本批新增durable-landing，无关闭项、无新的上游blocker；`R06.6-F2-H13-UPSTREAM=open_controlled`不是I05直接blocker |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`；Consumer `4/9`；`0/60`无条件complete；I05为`in_progress_S01-S10_with_affected_open`，不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias与验收签署均`not_run_not_claimed` |
| 下一动作 | historical checkpoint；当前已由I05 §11独立记录承接；不得把§10的目标UoW或result handoff当成已闭合owner |
| 当前提交 | 不需要；用户未要求提交 |

## Historical M2 closure: Step 09~15（由Current M3覆盖）

本节保留M2完成时的historical closure；其恢复指令已由后续M3和本文件末尾Current M4 checkpoint覆盖。

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前完成范围 | Step 09~15 主设计落码闭口 |
| 当前恢复点 | `Step15_M2_completed_waiting_before_Step16` |
| 当前状态 | Step 09~15 均为 `completed_design_record_with_affected_open`；Step 15 gate 为 `Step15_M2_completed_waiting_before_Step16` |
| 协议覆盖 | Command `16`；Query `14`；Consumer `9`；Outbound Event `12`；Operations Job `9`；合计 `60/60` 有设计记录，`0/60` 无条件完成 |
| 状态机覆盖 | `27` 个正式状态机；技术协调状态、Query surface、一次性 outcome、adapter probe snapshot 不计入 |
| 当前边界 | Observability 只承载观测、审计投影、body-free linkage、retention/reference/maintenance marker、handoff/export projection、history/outbox/result/report；不拥有或反写业务 truth |
| 正式文档 | 正式 `03-详细设计.md` 继续冻结，Step 19 前不装配 |
| 实现/测试/evidence | 未实现、未运行测试、未生成真实 evidence、run_id、验收签署或 commit |
| 新的上游 blocker | 未发现；inherited upstream/internal affected 继续开放 |
| 下一动作 | 停在 Step 16 前；用户确认后先读取 Step 16 SOP、书写规范、current Step 09~15 产物和 L1 参考粒度 |
| 当前提交 | 不需要；用户未要求提交 |

### M2 affected register carried forward

以下项目在 M2 期间没有被错误关闭或改写：
`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、
`R06.6-F2-H13-UPSTREAM`、`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、
`R07-EXTERNAL-PHASE-LINK-01`、`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、
`S08-CONSUMER-OUTBOX-SURFACE-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、
`S08-JOB-REPORT-REF-OWNER-01`、`S08-M1-SECONDARY-TYPE-OWNER-01` 与
`03-RPR-S09-PER-FLOW`。它们由对应 owner/Step 后续处理；不构成新的实现结果或测试结论。

该段为I05 §10 historical checkpoint；current状态由下方I05 §11 stop review承接。

## Historical S08-E Consumer I05 §11 stop review

| 检查项 | 结论 |
|---|---|
| 任务记录 | `D03-08-I05-S11=completed`；仅表示§11设计记录、同步与停审完成，不表示I05已defined、affected已关闭、runtime slot启用或可实现 |
| 用户授权范围 | `pass`；只审查stored result reachability、exact replay、receipt surface、completion eligibility及missing/corrupt consistency defect；未进入I05 §12、I06~I09、S08-F/G、Step09、formal或实现代码 |
| current result reachability | `pass_with_affected_open`；canonical payload、positive binding、complete input与candidate仍缺失，current没有reservation、stored result、receipt或C-05 completion |
| owner reuse | `pass`；复用既有stored-result、replay surface、stored/public receipt与result-access owner，不创建平行result、receipt、error、replay、access或action类型 |
| fresh / replay | `pass_with_affected_open`；fresh只来自同一UoW known commit；replay从原reservation exact stored-result pointer开始并完成双identity、Completed/pointer、kind/schema/bytes/digest及presence校验；不得重跑handler或从current truth重建 |
| Stored / Ephemeral | `pass_at_target_contract_level`；两种shape互斥，Stored保留immutable durable refs，Ephemeral不携带durable refs；disabled slot不产生runtime shape |
| missing / corrupt result | `pass`；missing、duplicate、wrong kind/schema、pointer mismatch、digest/bytes/presence defect均为consistency defect；不得降级Ephemeral、创建新result、补current truth或选择terminal action |
| completion eligibility | `not_closed`；只允许后续具名I05 pure/total/no-wildcard mapper在receipt/probe后选择C-05 action；unknown、disabled、missing/corrupt分支均不具备资格 |
| truth / no-write | `pass_at_design-record_level`；result/receipt只承载body-free Observability projection，不拥有或反写Artifact truth、evidence body、retention、report handoff或external delivery |
| affected / blocker | 13项I05专属affected全部保持开放：2项上游、11项本仓；没有新增上游blocker，没有关闭项；shared Consumer affected与`R06-F-AFFECT-UOW-01`保持原状态 |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`；`0/60`无条件complete；I05仍不计入defined |
| formal / implementation / test / evidence | formal`03`继续frozen；未运行实现、测试、scan或runtime evidence；未伪造commit、run_id、evidence alias或验收签署 |
| 下一动作 | 立即停审；用户确认后只进入I05 §12，读取错误模型、异常分支与recovery handoff材料；不得进入§13、I06~I09、S08-F/G、Step09或formal回填 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S11_recorded_with_affected_open_waiting_user_before_I05_S12
```

现在必须停审。未经用户明确确认不得进入I05 §12；不得读取或写入I05 §13以后、I06~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码；当前不需要提交。

该段为I05 §11 historical checkpoint；current状态由下方I05 §12 stop review承接。

## Historical S08-E Consumer I05 §12 stop review

| 检查项 | 结论 |
|---|---|
| 任务记录 | `D03-08-I05-S12=completed`；仅表示§12设计记录、同步与停审完成，不表示I05已defined、affected已关闭、runtime slot启用或可实现 |
| 用户授权范围 | `pass`；只审查error mapping、exception/write visibility、recovery handoff、C-05 eligibility、一致性缺陷与telemetry boundary；未进入§13、I06~I09、S08-F/G、Step09、formal或实现代码 |
| owner reuse | `pass`；复用三层error owner、public error surface、C-05和existing worker errors；没有创建I05 private error/recovery/action enum |
| structural/runtime split | `pass`；ownerless payload/binding/constructor/landing是activation failure，不映射UnsupportedSchema、Delayed、Retry或public receipt |
| recovery / retryable | `pass_with_affected_open`；八类target与I05无`RetryFinalizeOnly`已固定；`S08-RECOVERY-CLASS-OWNER-01`继续承接唯一owner、total mapper、retryable派生和no-wildcard tests |
| commit / consistency | `pass_with_affected_open`；commit/rollback unknown只进入`ProbeBeforeRetry`目标，current无transaction-status probe；missing/corrupt result不降级Ephemeral、不从current truth重建、不选择terminal action |
| C-05 / post-commit | `pass_with_affected_open`；known valid receipt才可进入exact mapper；action matrix和shared no-completion gap开放；ack/dead-letter execution failure保留committed result并由worker/transport恢复 |
| truth / telemetry | `pass_at_design-record-level`；error、receipt、telemetry与dead-letter保持body-free，不拥有或反写Artifact truth、evidence body、retention、report handoff或external delivery |
| affected / blocker | 13项I05专属affected全部保持开放：2项upstream、11项internal；没有新增上游blocker，没有关闭项；shared affected保持原状态 |
| 当前协议计数 | 保持`34/60 defined_with_affected_open`；Query `14/14`、Consumer `4/9`、`0/60`无条件complete；I05仍不计入defined |
| formal / implementation / evidence | formal`03`继续frozen；未运行或声称实现、测试、scan、runtime evidence、commit、run_id、真实evidence alias或验收签署 |
| 下一动作 | 立即停审；用户确认后只进入I05 §13，读取concurrency、idempotency与reentry protection材料；不得进入§14、I06~I09、S08-F/G、Step09或formal回填 |
| 当前提交 | 不需要；用户未要求提交 |

当前恢复点为：

```text
Step08_S08-E_I05_S01-S12_recorded_with_affected_open_waiting_user_before_I05_S13
```

现在必须停审。未经用户明确确认不得进入I05 §13；不得读取或写入I05 §14以后、I06~I09、
S08-F/G、Step09~19、正式`03`、任何`04`文件或实现代码；当前不需要提交。

该段为 I05 §12 historical checkpoint；Step 08 current 状态由下方 M1 closure 承接。

## Historical S08-G M1 cross-protocol closure（由Current M3覆盖）

本节保留M1完成时的historical closure。前文 I05 §1~§12 的阶段性停审段落同为historical material；
旧计数和“下一步进入 I05 §13”只用于历史回溯，不覆盖本文件末尾Current M4 pointer。
M1 完成不表示 affected 关闭、runtime-ready、实现完成、测试通过或验收完成。

### 60 项协议总审计

| 协议族 | 数量 | 独立 current 记录 | 当前状态 | 无条件完成 |
|---|---:|---:|---|---:|
| Command C01-C16 | 16 | 16/16 | `defined_with_affected_open` | 0 |
| Query Q01-Q14 | 14 | 14/14 | `defined_with_affected_open` | 0 |
| Inbound Consumer I01-I09 | 9 | 9/9 | `defined_with_affected_open` | 0 |
| Outbound Event E01-E12 | 12 | 12/12 | `defined_with_affected_open` | 0 |
| Operations Job J01-J09 | 9 | 9/9 | `defined_with_affected_open` | 0 |
| **Total** | **60** | **60/60** | **`60/60 defined_with_affected_open`** | **0/60** |

审计口径为：每项有独立字段级协议卡、有限 typed binding、current callable/producer、truth/no-write
boundary、唯一 Step 09 flow reservation，并将未决项登记到唯一后续 owner/Step。该状态不代表
canonical owner、runtime activation、实现、测试或验收已经完成。

### M1 状态与硬边界

| 任务 | 状态 | 结论 |
|---|---|---|
| M1-A Consumer I05-I09 | `completed` | 9/9 独立协议卡形成；I05 §1~§12历史阶段已归档，I06-I09专属 affected 已登记。 |
| M1-B Consumer closure | `completed` | I06-I09 均独立记录，不以 family 模板替代 exact flow。 |
| M1-C Outbound Event E01-E12 | `completed` | committed source、typed encoder、immutable snapshot、version、subscriber 与 no-current-truth rebuild 边界已登记。 |
| M1-D Operations Job J01-J09 | `completed` | trigger、claim、input/result/report、idempotency、external phase 与 completion 边界已登记。 |
| M1-E cross-protocol audit | `completed` | `16 + 14 + 9 + 12 + 9 = 60`、family collision、affected routing、no-write与truth ownership边界已审计。 |

- `S08-E-I05-PAYLOAD-SCHEMA-01` 与 `S08-E-I05-PRODUCER-EVENT-BINDING-01` 仍是
  L1-artifact 上游内部 blocker；不得反推 Artifact payload、encoder、registration 或 subscription。
- `R06.6-F2-H13-UPSTREAM=open_controlled` 继续约束 J06；不得声称 H13 execution record/result
  已可执行。
- `R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
  `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
  `S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`与
  `S08-M1-SECONDARY-TYPE-OWNER-01`继续由指定后续 owner/Step 承接。
- Event payload 必须在 accepted local UoW 内由 typed encoder 冻结 immutable snapshot；J01 只能发布
  已 claim 的 snapshot，不得从 current truth 重建。
- Consumer/Event/Job 只承载观测、审计投影、body-free linkage、marker、retention/reference/
  maintenance projection 与 handoff projection；不拥有或反写 source/business truth。

### Step 09 前停审

当前恢复点为：

```text
Step08_M1_completed_waiting_before_Step09
```

只有用户明确确认后，才读取 Step 09 SOP、对应书写规范、current Step06/07 callable/UoW/claim/fence/
result/report owner、L1-governance/L1-artifact Step09粒度参考和 Step08 current protocol cards。
确认前不得进入 Step09，不得读取或写入 Step10以后、正式`03`、任何`04`文件、implementation ledger、
boundary skeleton或实现代码。当前不需要提交；用户未要求提交。

## Historical M3 closure: Step 16~19（由Current M4覆盖）

本节保留M3完成时的historical closure；其旧恢复点和进入`04`指令已被用户确认消费，不覆盖本文件末尾
Current M4 checkpoint。

| 项 | Current值 |
|---|---|
| 当前正式文档 | `03-详细设计.md` |
| 当前完成范围 | Step16~19；正式§1~§18 current装配和全文门禁 |
| 当前恢复点 | `Step19_M3_completed_waiting_user_before_04` |
| gate_status | `pass_current_M3_full_document_gate` |
| 协议/状态 | `16 + 14 + 9 + 12 + 9 = 60`；`60/60 recorded_with_affected_open`、`0/60`无条件完成；27正式状态owner + technical Job item |
| 正式稿检查 | 5106行；204表格块/2436表格行；122围栏；228 heading；18主章唯一；19个canonical Step路径存在 |
| 风险/待确认 | 12 affected、14 risks、12 questions；仅formal assembly过程项`R-001/OQ-001`按current门禁关闭 |
| 本轮新发现上游blocker | `none`；I05两项`open_upstream_internal`、H13 `open_controlled`与其余9项affected保持open |
| 核心边界 | Observability只拥有观测与审计投影；Query no-write；Event使用accepted UoW immutable snapshot；redaction-before-serialization；correlation/retention/handoff不越权或反写业务truth |
| implementation readiness | `blocked`；current `04~07`、target repo、逐boundary审计、implementation ledger/skeleton及真实tests/evidence未完成 |
| implementation/test/evidence | 未实现、未运行测试、未创建真实script/artifact/report；未伪造commit、run_id、evidence alias、verdict或signoff |
| next_allowed_action | `stop_wait_user_before_04_full_restart` |
| 当前提交 | 不需要；用户未要求提交 |

下一步获得用户明确确认后,才读取：

1. `standards/document/配置设计讨论流程_SOP.md`与`standards/document/配置设计书写规范.md`；
2. current正式`00-需求文档.md`至`03-详细设计.md`的配置承接章节；
3. `design-calibration/04_config_calibration_flow.md`、旧`04`及其Step产物,只作historical现实审计；
4. L1-governance/L1-artifact current `04`及对应首Step粒度参考。

确认后只进入`04`首个current Step,不得一次跨多个Step或正式文档。当前不创建implementation ledger或
boundary skeleton；这些资产只能在current`07`完成时同步创建。

## Historical M4 checkpoint: 04 Step 01

本节记录M4启动时的historical checkpoint；其等待确认指令已被用户连续授权消费，不覆盖文末current指针。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07`文档链；当前只进入`04` |
| 当前正式文档 | `04-配置设计.md` |
| 当前Step/模块 | Step01 `确认配置输入边界` / `upstream-boundary-after-current-M3` |
| 当前恢复点 | `04_Step01_current_completed_waiting_user_before_Step02` |
| gate_status | `pass_waiting_user_before_step_02` |
| 本步完成 | current `00~03`输入、五个SOP问题、12候选配置输入族、12 affected配置承接、historical差异、`03`影响和formal §1草稿 |
| formal `04` | 未修改；旧292行正文=`historical_material_pre_current_M3`，只允许current Step15全量替换 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05两项`open_upstream_internal`、H13 `open_controlled`与其余9项`inherited_affected`保持开放；不得由配置补schema/owner/flow |
| implementation readiness | `blocked`；current `04~07`、目标仓、逐boundary审计、current ledger/skeleton和真实tests/evidence未完成 |
| implementation/test/evidence | 未实现、未运行测试、未创建真实script/artifact/report；未伪造commit/run_id/evidence alias/verdict/signoff |
| next_allowed_action | `stop_wait_user_confirmation_before_04_step_02` |
| 当前提交 | 不需要；用户未要求commit |

下一步必须先等待用户明确确认。确认后只读取配置SOP Step02、书写规范§5.2、current Step01、
formal `00/02/03`相关范围输入、pre-M3 Step02 historical现实和L1 Step02粒度参考；只重建Step02。

未经确认不得读取或写入current Step02~15，不得修改formal `04`，不得进入`05~07`，不得恢复historical
implementation ledger/boundaries，也不得实现代码。

## Historical M4 checkpoint: 04 Step 14

本节记录Step14开工时的historical checkpoint；其指令已由Step14 completion gate消费，不覆盖文末current指针。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07`文档链与implementation handoff assets |
| 当前正式文档 | `04-配置设计.md` |
| 当前Step/模块 | Step14 `定义风险与待确认事项` / `risks-open-questions-after-current-M3` |
| 当前恢复点 | `04_Step14_current_in_progress_continuous_M4_authorized` |
| gate_status | `in_progress_after_step_13_pass` |
| 已完成范围 | current Step01~13；Step13已闭合首版无迁移事实、10类普通演进、6类durable migration及7类obligation/retirement gate |
| formal `04` | 未修改；旧292行正文=`historical_material_pre_current_M3`，只允许current Step15全量替换 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05两项`open_upstream_internal`、H13 `open_controlled`与其余9项`inherited_affected`保持开放；配置不得补schema/owner/flow |
| implementation readiness | `blocked`；current `04~07`、目标仓、逐boundary审计、current ledger/skeleton和真实tests/evidence未完成 |
| implementation/test/evidence | 未实现、未运行测试、未创建真实artifact/report；未伪造commit/run_id/evidence alias/verdict/signoff |
| next_allowed_action | `rebuild_04_step_14_then_continue_to_step_15` |
| 当前提交 | 不需要；用户未要求commit |

下一步读取配置SOP Step14、书写规范§5.14、current Step01~13、formal `03` §13/§16/§17及L1参考，
全量重建Step14。Step14通过后按连续授权进入Step15并且只从current Step01~14装配formal `04`。

## Historical M4 checkpoint: 04 Step 15

本节是项目执行台账的唯一current恢复记录。前文所有checkpoint均为historical，不得覆盖本节。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07`文档链与implementation handoff assets |
| 当前正式文档 | `04-配置设计.md` |
| 当前Step/模块 | Step15 `整理正式配置设计文档` / `formal-config-document-assembly-after-current-M3` |
| 当前恢复点 | `04_Step15_current_completed_continuous_M4_authorized` |
| gate_status | `pass_current_04_full_document_gate` |
| 已完成范围 | current Step01~15；15章 formal、23域、61 ENV、27 sensitive、12 change、7 error/25 failure、12 affected |
| formal `04` | current 991行；15主章唯一；只从current Step01~14装配 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05两项`open_upstream_internal`、H13`open_controlled`、其余9项`inherited_affected`保持开放 |
| implementation readiness | `blocked`；current `05~07`、target reality、逐boundary审计、current ledger/skeleton和真实tests/evidence未完成 |
| next_allowed_action | `start_current_05_step_01_full_restart` |
| 当前提交 | 不需要；用户未要求commit |

Formal `04`已通过15章、配置项/示例、跨域审计与truthfulness gate。按用户连续M4授权，下一步直接
full-restart进入`05` Step01；旧 `05` calibration/formal 的 `pass` 状态不继承。

## Historical M4 checkpoint: 05 Step 01

本节记录 `05` Step01 开工时的 historical checkpoint；当前恢复点以文件尾记录为准。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07`文档链与implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step01 `确认测试输入边界` / `test-input-boundary-after-current-04` |
| 当前恢复点 | `05_Step01_current_in_progress_continuous_M4_authorized` |
| gate_status | `in_progress_after_current_04_gate` |
| current上游 | `00~04` formal current；`04` Step15已通过 |
| 本轮新发现上游blocker | `none` |
| inherited affected | I05两项、H13与其余9项保持open；测试不得将其写成pass |
| implementation/test/evidence | 仅设计planned；不得伪造执行、run、artifact、report、evidence alias或signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_05_step_01_record` |
| 当前提交 | 不需要；用户未要求commit |

## Historical M4 checkpoint: 05 Step 08

本节记录Step08开工与完成的historical checkpoint；current恢复点以文件尾记录为准。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07`文档链与implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step08 `设计测试环境与配置矩阵` / `input-recovery-after-current-step-07` |
| 当前恢复点 | `05_Step08_current_in_progress_continuous_M4_authorized` |
| gate_status | `in_progress_after_step_07_pass` |
| 已完成范围 | current Step01~07；Step07已闭合82个唯一dataset、99/99 TC映射、27+1状态corpus、16切口停审和跨数据审计 |
| formal `05` | 旧正文=`historical_material`，只允许current Step15从Step01~14全量重建 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05两项、H13和其余9项保持open；环境不得用fake/slot声称positive capability或production ready |
| implementation/test/evidence | 仅设计planned；未实现、未运行测试、未创建真实run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `read_step_08_standard_and_current_environment_inputs_then_rebuild` |
| 当前提交 | 不需要；用户未要求commit |

下一步读取测试方案SOP Step08、书写规范§5.8、current Step01~07、formal `01/03/04`的依赖类型、三profile、
availability、activation与failure边界，以及L1参考粒度；旧Step08只作historical差异输入。

## Historical M4 checkpoint: 05 Step 09

本节是项目执行台账的唯一 current 恢复记录；前文所有 checkpoint 均为 historical。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07`文档链与implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step09 `设计自动化与CI/CD门禁` / `input-recovery-after-current-step-08` |
| 当前恢复点 | `05_Step09_current_in_progress_continuous_M4_authorized` |
| gate_status | `in_progress_after_step_08_pass` |
| 已完成范围 | current Step01~08；Step08已闭合6 lane、3 profile、依赖分类、config/failure/dataset环境映射和真实性状态 |
| formal `05` | 旧正文=`historical_material`，只允许current Step15从Step01~14全量重建 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05两项、H13和其余9项保持open；自动化不得用静态pass、空artifact或低等级lane关闭affected |
| implementation/pipeline/test/evidence | target repo与pipeline不存在；未实现、未运行，未创建真实run/artifact/report/evidence alias/result/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `read_step_09_standard_and_current_suite_environment_script_inputs_then_rebuild` |
| 当前提交 | 不需要；用户未要求commit |

下一步读取测试方案SOP Step09、书写规范§5.9、current Step03~08、formal `03` planned script contract、
`04` lane/config和L1 Step09粒度；旧Step09只作historical差异输入。

## Historical M4 checkpoint: 05 Step 11

本节为当前恢复指针。此前 `05 Step 09` 及更早 checkpoint 均保留为 historical，不覆盖本节。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step11 `定义缺陷管理与复验规则` / `defect-taxonomy-and-retest-after-step-10` |
| 当前恢复点 | `05_Step10_current_completed_step11_in_progress_continuous_M4_authorized` |
| gate_status | `step10_pass_with_inherited_affected_open; step11_in_progress` |
| 已完成范围 | current Step01~10；Step10已收口12专项、fault injection、signal/audit/evidence/retention/handoff和NFR/AC/VF双向审计 |
| formal `05` | 未修改；仍只允许 current Step15 从 Step01~14 装配 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05 payload/schema/binding、H13、UoW、external phase、outbox、job report、secondary owner 和 `03-RPR-S09-PER-FLOW` 等保持开放 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_05_step_11_only` |
| 当前提交 | 不需要；用户未要求 commit |

Step11 必须先读取测试方案 SOP/书写规范 §11、current Step06/09/10、current `06` VETO/缺陷输入和 L1
参考粒度，重建缺陷等级、阻断优先级、升级路径、复验证据和自动化防回归规则；不得修改 formal `05`。

## Historical M4 checkpoint: 05 Step 12

本节为当前恢复指针；`05 Step 11` 及更早记录保留为 historical。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step12 `定义进入准则与退出准则` / `entry-exit-gate-matrix-after-step-11` |
| 当前恢复点 | `05_Step11_current_completed_step12_in_progress_continuous_M4_authorized` |
| gate_status | `step11_pass_with_inherited_affected_open; step12_in_progress` |
| 已完成范围 | current Step01~11；Step11已收口S/A/B/R、VETO不可降级、复验层级、关闭证据和自动化补强规则 |
| formal `05` | 未修改；仍只允许 current Step15 从 Step01~14 装配 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05 payload/schema/binding、H13、UoW、external phase、outbox、job report、secondary owner 和 `03-RPR-S09-PER-FLOW` 等保持开放 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_05_step_12_only` |
| 当前提交 | 不需要；用户未要求 commit |

Step12 必须先读取测试方案 SOP/书写规范 §12、current Step08~11、`06` entry/exit/VETO 输入和 Step13
证据路径约束，重建可判定的 entry、exit、blocked/not-run、条件放行和退出报告要求；不得修改 formal `05`。

## Historical M4 checkpoint: 05 Step 13

本节为唯一 current 恢复指针；此前 `05 Step 12` 及更早记录均为 historical。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step13 `定义测试报告与证据归档` / `run-scoped-evidence-archive-and-provenance` |
| 当前恢复点 | `05_Step12_current_completed_step13_in_progress_continuous_M4_authorized` |
| gate_status | `step12_pass_with_inherited_affected_open; step13_in_progress` |
| 已完成范围 | current Step01~12；Step12已收口设计/测试 entry-exit、blocked/not_run/conditional、lane真实性和artifact/report pairing |
| formal `05` | 未修改；只允许 current Step15 从 Step01~14 全量装配 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05 payload/schema/binding、H13、UoW、external phase、outbox、job report、secondary owner 和 `03-RPR-S09-PER-FLOW` 等保持开放 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_05_step_13_only` |
| 当前提交 | 不需要；用户未要求提交 |

Step13 必须严格承接 Step09 已冻结的五个脚本：`scripts/gates/run_ci_gate.sh`、
`scripts/reports/generate_reports.sh`、`scripts/checks/check_redaction.sh`、
`scripts/checks/check_metric_labels.sh`、`scripts/checks/check_dependency_boundary.sh`；不得引入旧稿脚本、
真实 run、真实 evidence alias、验收 verdict 或签署。

## Historical M4 checkpoint: 05 Step 14

本节是项目执行台账的唯一 current 恢复记录；此前 `05 Step 13` 及更早记录均为 historical。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `05-测试方案.md` |
| 当前Step/模块 | Step14 `定义回归策略与残余风险` / `regression-trigger-and-residual-risk-closure` |
| 当前恢复点 | `05_Step13_current_completed_step14_in_progress_continuous_M4_authorized` |
| gate_status | `step13_pass_with_inherited_affected_open; step14_in_progress` |
| 已完成范围 | current Step01~13；Step13已完成99条exact TC/DS/EV/suite/lane/path join、82 dataset、9 suite、canonical artifact/report、失败保留和provenance审计 |
| formal `05` | 未修改；只允许 current Step15 从 Step01~14 全量装配 |
| 本轮新发现上游blocker | `none` |
| inherited blocker/affected | I05 payload/schema/binding、H13、UoW、external phase、outbox、job report、secondary owner 和 `03-RPR-S09-PER-FLOW` 等保持开放 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_05_step_14_only` |
| 当前提交 | 不需要；用户未要求提交 |

Step14 必须先读取测试方案 SOP/书写规范 §5.14、current Step06/09/10/11/12/13，以及 L1-governance、
L1-artifact 的 Step14 粒度；不得提前装配正式 `05`，不得把 residual 或 planned candidate 写成执行结果。

## Historical M4 checkpoint: 06 Step 09

本节是项目执行台账的 current 恢复记录；此前 checkpoint 保留为 historical，顶部“当前恢复点”始终为唯一快速入口。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `06-验收标准.md` |
| 当前Step/模块 | Step09 `定义非功能验收门禁` / `nfr-source-threshold-and-release-decision-gates` |
| 当前恢复点 | `06_Step08_current_completed_step09_ready_continuous_06_authorized` |
| gate_status | `step08_pass_with_inherited_affected_open; step09_ready` |
| 已完成范围 | current Step01~08；31/31 AC、60/60 exact protocol、27/27 formal state owner + 1 technical state、23 transaction gates 已完成设计停审 |
| formal `06` | 未修改；只允许 current Step15 从 Step01~14 全量装配 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker/affected | I05 两项、H13、UoW、recovery class、external phase 两项、consumer 两项、job report ref、secondary owner 和 per-flow implementation proof 共12项保持开放 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_06_step_09_only` |
| 当前提交 | 不需要；用户未要求 commit |

Step09 必须读取验收 SOP Step09、书写规范 §5.9、`00` 的 `NFR-OBS-001~024`、current Step01~08 和
`05` §10/§13/§14。未冻结的 P95/P99/SLA/容量/保留期限只能保持 qualitative、candidate 或
`not_evaluated`，不得从 historical material 生成硬阈值。

## Historical M4 checkpoint: 06 Step 10

本节是项目执行台账的 current 恢复记录；此前 checkpoint 保留为 historical，顶部“当前恢复点”始终为唯一快速入口。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `06-验收标准.md` |
| 当前Step/模块 | Step10 `定义可观测性、审计与证据门禁` / `runtime-observation-and-run-evidence-dual-chain` |
| 当前恢复点 | `06_Step09_current_completed_step10_ready_continuous_06_authorized` |
| gate_status | `step09_pass_with_inherited_affected_open; step10_ready` |
| 已完成范围 | current Step01~09；24/24 NFR 和 8 个非功能门禁已完成设计停审，无来源 numeric threshold 为0 |
| formal `06` | 未修改；只允许 current Step15 从 Step01~14 全量装配 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker/affected | 12项保持开放，不得由 evidence design 宣布关闭 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_06_step_10_only` |
| 当前提交 | 不需要；用户未要求 commit |

Step10 必须分离本仓 runtime observation/audit material 与 acceptance run evidence；逐项闭合 log/metric/trace/audit、
redaction、correlation、body-free evidence linkage、retention marker、report handoff，以及同 run raw artifact/report/
candidate EV provenance。不得把 telemetry、handoff、candidate EV 或自动生成 acceptance draft 写成业务 truth 或验收通过。

## Historical M4 checkpoint: 06 Step 14

本节是项目执行台账的 current 恢复记录；此前 checkpoint 保留为 historical，顶部“当前恢复点”始终为唯一快速入口。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `06-验收标准.md` |
| 当前Step/模块 | Step14 `定义最终结论与签署口径` / `final-three-value-decision-and-role-signoff-contract` |
| 当前恢复点 | `06_Step13_current_completed_step14_ready_continuous_06_authorized` |
| gate_status | `step13_pass_with_inherited_affected_open; step14_ready` |
| 已完成范围 | current Step01~13；Step13已闭合10个eligibility gate、9个residual source、记录字段、失效/重开、角色职责和affected隔离 |
| formal `06` | 未修改；只允许 current Step15 从 Step01~14 全量装配 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker/affected | 12项保持开放；不得由风险接受、结论或签署宣称positive capability完成 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 risk acceptance/run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `rebuild_current_06_step_14` |
| 当前提交 | 不需要；用户未要求 commit |

Step14 必须先读取验收 SOP Step14、书写规范 §5.14、current Step04/09~13 与 L1 参考粒度；最终结论只允许
`通过`、`有条件通过`、`不通过`。`暂停/不可裁决`只能作为流程状态，不能成为第四个最终结论；本 Step
只固定签署角色和职责，不填写姓名、日期、真实决定或签署。

## Historical M4 checkpoint: 06 Step 15 pre-assembly

本节是项目执行台账的 current 恢复记录；此前 checkpoint 保留为 historical，顶部“当前恢复点”始终为唯一快速入口。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `06-验收标准.md` |
| 当前Step/模块 | Step15 `正式整理为 06-验收标准` / `cross-gate-audit-and-formal-06-assembly` |
| 当前恢复点 | `06_Step14_current_completed_step15_in_progress_continuous_06_authorized` |
| gate_status | `step14_pass_with_inherited_affected_open; step15_in_progress` |
| 已完成范围 | current Step01~14；Step14已闭合三值结论、聚合、暂停、签署、验收包和失效设计 |
| formal `06` | 正在总审计前仍保持旧正文；仅本 Step 允许重建 |
| 本轮新发现上游 blocker | `none`（总审计若发现冲突，必须在本 Step记录） |
| inherited blocker/affected | 12项保持开放；不由正式装配关闭 |
| implementation/test/evidence | 仅设计 planned；未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `audit_current_06_inputs_then_assemble_formal_06` |
| 当前提交 | 不需要；用户未要求 commit |

Step15 必须先读取验收 SOP/书写规范 Step15、通用中间产物规范 §5.10、current Step01~14 和 L1-governance/
L1-artifact Step15；先完成跨门禁总审计，再以 current Step 产物装配 15 章正式 `06-验收标准.md`。不得读取或修改
`07-实施计划.md`，不得把 planned candidate、设计 gate 或文档 gate 写成真实验收结果。

## Historical M4 checkpoint: 06 Step 15 formal assembly complete

本节是项目执行台账的唯一 current 恢复记录；此前所有 checkpoint 均为 historical，不覆盖本节。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `06-验收标准.md` |
| 当前Step/模块 | Step15 `正式整理为 06-验收标准` / `cross-gate-audit-and-formal-06-assembly` |
| 当前恢复点 | `06_Step15_current_completed_formal_assembly_waiting_before_07` |
| gate_status | `step_15_complete_design_only_waiting_before_07` |
| 已完成范围 | current Step01~15；Step15已完成跨门禁总审计、15章正式装配和反向清单复核 |
| formal `06` | current 15章正式正文，约1367行；不继承旧正文、旧 Step 或旧编号 |
| 设计闭环 | `31/31 AC`、`24/24 NFR`、`10/10 VF`、`99/99 planned TC/candidate linkage`、`82 DS`、`9 suite`、`5 script/check`、`60/60 protocol`、`27+1 state`、`23 TX` |
| 本轮新发现上游 blocker | `none` |
| inherited blocker/affected | 12项保持 `open/controlled/conditional`；target reality absent |
| implementation/test/evidence | 未实现、未运行、未创建真实 run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked` |
| next_allowed_action | `wait_user_confirmation_before_07_full_restart` |
| 当前提交 | 不需要；用户未要求提交 |

`06` 已完成设计文档阶段。本轮停止在 `06`；未经用户明确连续确认，不读取、不修改、不推进
`07-实施计划.md`、implementation ledger 或 planned boundary skeleton。

## Historical M4 checkpoint: 07 Step 01 complete

本节是项目执行台账的唯一 current 恢复记录；此前所有 checkpoint 均为 historical，不覆盖本节。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets |
| 当前正式文档 | `07-实施计划.md`（旧正文仅作 `historical_material`，本 Step 未修改） |
| 当前 Step/模块 | Step 01 `确认实施输入边界` / `implementation_input_baseline_and_readiness_boundary` |
| 当前恢复点 | `07_Step01_current_completed_waiting_before_step_02` |
| gate_status | `step_01_complete_design_only_waiting_before_step_02` |
| 已完成范围 | current Step 01；已确认 current `00~06`、权威顺序、1:1 规划输入、历史材料处置、目标仓现实和 12 项 inherited affected |
| formal `07` | 未修改；仅允许 current Step 13 从 Step 01~12 全量装配 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker/affected | 12 项保持 `open/controlled/conditional`；必须在后续 phase/boundary gate 显式绑定，不由 `07` 文档完成状态关闭 |
| implementation ledger / boundary skeleton | 旧资产为 `historical_material`，未激活；仅在 current Step 13 完成时同步重建 |
| implementation/test/evidence | 未实现、未运行、未创建真实 commit/run/artifact/report/evidence alias/verdict/signoff |
| implementation readiness | `blocked_until_current_07_completion_and_boundary_audit` |
| next_allowed_action | `wait_user_confirmation_before_step_02` |
| 当前提交 | 不需要；用户未要求提交 |

用户确认后，Step 02 必须读取实施计划 SOP Step 2、实施计划书写规范 §5.2、current Step 01、current
`00-需求文档.md`、`03-详细设计.md`、`06-验收标准.md`，并只参考 `L1-governance` / `L1-artifact`
对应 Step 02 的粒度。确认前不得读取或重建 Step 02，不得修改正式 `07`。

## Current M4 checkpoint: 07 Step 13 formal assembly complete

本节是项目执行台账的唯一 current 恢复记录；此前所有 checkpoint 均为 historical，不覆盖本节。

| 项 | Current值 |
|---|---|
| 当前宏阶段 | M4 `04/05/06/07` 文档链与 implementation handoff assets；设计文档阶段完成 |
| 当前正式文档 | `07-实施计划.md` |
| 当前 Step/模块 | Step 13 `正式整理为 07-实施计划` / `formal-assembly-ledger-boundary-skeleton-audit` |
| 当前恢复点 | `07_Step13_current_completed_formal_assembly_and_assets_waiting_user` |
| gate_status | `completed_current_07_design_only` |
| 已完成范围 | current Step 01~13；正式 13 章正文；项目级 implementation ledger；16/16 planned boundary skeleton；最终一致性审计 |
| formal `07` | current 13 章正式正文；8 phase、16 boundary、12 gate 及实施门禁均可回链 current Step 产物 |
| 设计闭环 | `99 TC`、`82 DS`、`9 suite`、`6 lane`、`3 profile`、`31 AC`、`24 NFR`、`10 VF`、`9 EVG` 保持上游身份，不由 `07` 重新定义 |
| 本轮新发现上游 blocker | `none` |
| inherited blocker/affected | 12 项保持 `open/controlled/conditional`；不由设计计划完成状态关闭 |
| implementation ledger / boundary skeleton | 唯一 current boundary=`commit-01-a`，`blocked / wait_design`；其余 15 个为 `planned / wait_until_current`；无 gate=`pass` |
| implementation/test/evidence | 未实现、未运行、未创建真实 commit/run/artifact/report/evidence alias/verdict/risk acceptance/signoff |
| implementation readiness | `blocked_pending_target_repo_immutable_baseline_and_execution_harness` |
| next_allowed_action | `stop_after_07_completion_wait_user` |
| 当前提交 | 不需要；用户未要求提交 |

本轮停止在 `07`。后续若由用户明确授权进入实现移交，必须先读取项目级 implementation ledger、
`commit-01-a` boundary ledger、正式 `07` 和代码实施台账规范；不得直接修改实现代码或激活未来 boundary。
