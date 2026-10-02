# 07 Step 6/12 规范性附录：逐 boundary 闭环审核

本文件是设计规划/审核记录，不是测试evidence。归属[Step6](07_implementation_plan_step_06_tasks_boundaries.md)及[Step12](07_implementation_plan_step_12_completion.md)。本轮在Step13初审发现排程缺口后，先回修Step3/5，再按15boundary依次核定scope/read/依赖/测试/经验；不虚构先前执行或owner受理。

## 1. 口径与正式来源

- 标准[闭环§9.2](../../../standards/document/设计真相源闭环与可落码性标准.md)实际55项，EXP是本附录的行定位号，不是新增需求/测试/owner工单；§9.1的整体移交审计另由Step12/13承接。
- P=当前设计schema/port/flow/排程闭口，**不是实施Gate pass**；N=当前切片不触发该行为，具体原因在独立表；B=local设计有来源，但该selected positive缺正式资格。
- 每项检查由设计者本轮审查；实现者只能二次核验，不得临场补类型/枚举/lookup/字段/状态。
- 全部boundary状态仍planned，所有真实Build/Test/Evidence/Commit/Handoff pending；不可变design baseline尚未冻结，任何实施移交仍blocked。

| 来源面代号 | 正式文档/校准定位（仅设计来源，不是runtime evidence） |
|---|---|
| A | 03 §5～9/15；[shared types](03_ddd_step_06_shared_types.md)、[runtime helpers](03_ddd_step_06_runtime_helpers.md)、[typed ports](03_ddd_step_07_typed_ports.md)、[application callables](03_ddd_step_07_application_callables.md)、[shared protocol](03_ddd_step_08_shared_surface.md)、七U对象/协议/flow/矩阵（03 §6～9逐行链接） |
| T | 03 §10～12；[persistence](03_ddd_step_11_persistence_transactions.md)、[concurrency](03_ddd_step_13_concurrency_idempotency.md)、[errors/recovery](03_ddd_step_12_errors_recovery.md)、[job execution](03_ddd_step_09_job_execution.md) |
| R | 03 §8/10/12；typed ports 的 PageReadContext/ProjectionStore/SnapshotStore、U3/U6/U7逐flow；[U7 flow](03_ddd_step_09_part_u7.md)与persistence typedplan/body/manifest/current predicate |
| C | 03 §13、04 §7/9/11；[04 item inventory](04_config_step_07_item_inventory.md)、[config bindings](03_ddd_step_14_config_bindings.md) |
| E | 05 §6/9/13、06 §10；[05 automation](05_test_plan_step_09_automation_gates.md)、[machine schema](05_test_plan_step_13_artifact_schema.md)、[98 TC/EV](06_acceptance_step_10_evidence_index.md) |
| H | 03 §16/17、05 §12～14、06 §4/10～14、07 §3/6/7/12；本文件逐项审核及15 skeleton |

## 2. 55项逐边界适用性矩阵

| §9.2项 | 01-a | 01-b | 02-a | 02-b | 03-a | 03-b | 04-a | 04-b | 05-a | 05-b | 06-a | 06-b | 06-c | 07-a | 07-b | 来源/不适用依据 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EXP-01 字段闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-02 DTO 构造闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-03 Support carrier/schema 当前边界闭口 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-04 Typed-ref kind owner scope 闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-05 Query response 闭环 | P | N | P | P | P | P | P | P | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-06 Generic ref 与 repository typed ref 闭环 | N | N | P | P | P | P | P | P | P | P | N | N | P | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-07 Query status marker 来源闭环 | P | N | P | P | P | P | P | P | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-08 Query material degraded mapper 闭环 | P | N | P | P | P | P | P | P | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-09 Paged query Empty visibility seed 闭环 | P | N | P | P | N | P | P | P | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-10 Maintenance job typed output 闭环 | P | N | P | P | P | P | P | P | N | P | N | P | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-11 Projection rebuild view body-field 输入闭环 | N | N | N | P | N | P | N | N | N | N | N | N | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-12 API query handler disposition 映射闭环 | N | N | N | N | N | N | N | N | N | N | P | P | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-13 Entry loop 结果明细 surface 闭环 | N | N | P | N | P | P | P | P | N | P | N | P | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-14 Query visibility resolution 闭环 | P | N | P | P | P | P | P | P | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-15 Accepted truth cursor 来源闭环 | N | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-16 Reference-only stale cursor 来源闭环 | N | N | P | P | N | P | N | N | N | N | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-17 Reference marker trace subject 闭环 | N | N | N | N | N | P | N | N | N | N | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-18 Handoff / export marker trace subject 闭环 | N | N | N | N | N | N | N | N | N | N | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-19 Accepted side-effect inventory 闭环 | N | N | P | P | P | P | P | P | P | P | P | P | P | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-20 Idempotency reserve context/channel 闭环 | N | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-21 Accepted subject identity 同源闭环 | N | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-22 Projection stale 闭环 | N | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-23 Projection-backed query lookup 闭环 | N | N | N | P | N | P | N | N | P | N | N | N | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-24 Ref-scope 解析闭环 | N | N | P | P | B | B | B | B | B | B | B | B | B | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-25 Public scope branch 展开闭环 | P | N | P | P | P | P | P | P | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-26 Sidecar truth 读取面闭环 | N | N | P | P | P | P | P | P | P | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-27 Body-free snapshot typed read 闭环 | P | N | P | P | P | P | P | N | N | N | N | N | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-28 Reference typed sidecar version 闭环 | P | N | N | P | N | P | N | N | N | N | N | N | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-29 factory 签名闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-30 状态闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-31 public target 穷尽闭环 | P | N | P | P | P | P | P | P | N | P | P | P | P | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-32 public command intent 结构化闭环 | P | N | P | P | P | P | P | P | N | P | P | P | N | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-33 shared shell selector 闭环 | N | N | P | N | N | N | N | N | N | N | P | P | N | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-34 selected service input source map 闭环 | P | N | P | N | P | P | P | P | P | P | P | P | N | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-35 snapshot helper 判定字段闭环 | P | N | P | P | P | P | P | P | N | P | N | N | N | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-36 public job surface 阶段闭环 | N | N | N | N | N | N | N | N | N | N | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-37 前置 surface repair 边界闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | H；逐项具体解释见各boundary独立表 |
| EXP-38 job policy executable summary 闭环 | N | N | N | N | N | N | N | N | N | N | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-39 config binding 闭环 | N | P | N | N | N | N | N | N | N | N | P | P | P | N | N | C；逐项具体解释见各boundary独立表 |
| EXP-40 history 构造闭环 | P | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-41 record id / 返回面闭环 | P | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-42 ref identity 闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-43 validation truth 闭环 | P | P | P | P | B | B | B | B | B | B | B | B | B | B | B | A；逐项具体解释见各boundary独立表 |
| EXP-44 metadata 闭环 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | A；逐项具体解释见各boundary独立表 |
| EXP-45 idempotency 闭环 | P | N | P | P | P | P | P | P | N | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-46 stored receipt typed save/get 闭环 | P | N | P | P | P | P | P | P | P | P | N | N | N | N | N | T；逐项具体解释见各boundary独立表 |
| EXP-47 entry context factory 闭环 | P | N | P | N | N | N | N | N | N | N | P | P | N | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-48 adapter failure outcome 分类闭环 | P | N | N | N | B | N | B | B | N | B | N | N | B | N | N | A；逐项具体解释见各boundary独立表 |
| EXP-49 projection rebuild 闭环 | P | N | N | P | N | P | N | N | N | N | N | N | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-50 public read-model identity | P | N | P | P | N | P | N | N | P | N | P | P | N | N | N | R；逐项具体解释见各boundary独立表 |
| EXP-51 artifact materialization | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | E；逐项具体解释见各boundary独立表 |
| EXP-52 machine artifact JSON schema | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | E；逐项具体解释见各boundary独立表 |
| EXP-53 phase boundary | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | H；逐项具体解释见各boundary独立表 |
| EXP-54 path baseline | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | E；逐项具体解释见各boundary独立表 |
| EXP-55 blocker 经验回写 | P | P | P | P | P | P | P | P | P | P | P | P | P | P | P | H；逐项具体解释见各boundary独立表 |

## 3. 15个boundary独立审核入口

| Boundary | 增量 | 独立经验表与scope/read/gate | 本地 / 正向资格 |
|---|---|---|---|
| commit-01-a | contracts/domain、workspace 基础和 scripts 参数/原始输出/最小 index 能力 | [commit-01-a](implementation-boundaries/commit-01-a.md) | 设计分配已核；实现repo/baseline/checks waiting |
| commit-01-b | loader 映射七字段/八 slot、拒绝非法输入和展示 locale | [commit-01-b](implementation-boundaries/commit-01-b.md) | 设计分配已核；实现repo/baseline/checks waiting |
| commit-02-a | 17 ports、runners、FlowSupport、Query/replay、UoW 与同语义 fake | [commit-02-a](implementation-boundaries/commit-02-a.md) | 设计分配已核；实现repo/baseline/checks waiting |
| commit-02-b | 32 store、typed Row/codec、CAS/as-of/page/source-cursor | [commit-02-b](implementation-boundaries/commit-02-b.md) | 设计分配已核；实现repo/baseline/checks waiting |
| commit-03-a | U1 全部 + U2 全部 + U3 五 Command 的本地纵切 | [commit-03-a](implementation-boundaries/commit-03-a.md) | 设计分配已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-SRC-010,MP-SRC-013 |
| commit-03-b | U3 五 Query + U7 两 Query/两 Job；四种 projection 完整 builder | [commit-03-b](implementation-boundaries/commit-03-b.md) | 设计分配已核；selected positive blocked MP-UP-001,MP-UP-003 |
| commit-04-a | U4 全部七 flow | [commit-04-a](implementation-boundaries/commit-04-a.md) | 设计分配已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005 |
| commit-04-b | U5 全部九 flow | [commit-04-b](implementation-boundaries/commit-04-b.md) | 设计分配已核；selected positive blocked MP-UP-003,MP-UP-005,MP-UP-007 |
| commit-05-a | U6 三 Query | [commit-05-a](implementation-boundaries/commit-05-a.md) | 设计分配已核；selected positive blocked MP-UP-003 |
| commit-05-b | U6 一 Command/三 Job | [commit-05-b](implementation-boundaries/commit-05-b.md) | 设计分配已核；selected positive blocked MP-UP-003,MP-UP-005,MP-UP-007,MP-UP-008 |
| commit-06-a | 可信 context、21C/16Q route、typed disposition/error | [commit-06-a](implementation-boundaries/commit-06-a.md) | 设计分配已核；selected positive blocked MP-UP-003 |
| commit-06-b | 12 internal Job dispatch + Vue/TS UI 的 protocol-only 视图 | [commit-06-b](implementation-boundaries/commit-06-b.md) | 设计分配已核；selected positive blocked MP-UP-003 |
| commit-06-c | Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation SDK wiring | [commit-06-c](implementation-boundaries/commit-06-c.md) | 设计分配已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005,MP-UP-007,MP-UP-008,MP-SRC-010 |
| commit-07-a | 完善22脚本，98 TC/EV/subcase manifest、artifact/seal 两阶段 | [commit-07-a](implementation-boundaries/commit-07-a.md) | 设计分配已核；selected positive blocked MP-UP-008 |
| commit-07-b | 审查完整 run/EV/20AC/5VETO、台账/剩余风险与证明范围 | [commit-07-b](implementation-boundaries/commit-07-b.md) | 设计分配已核；selected positive blocked MP-UP-001,MP-UP-002,MP-UP-003,MP-UP-004,MP-UP-005,MP-UP-007,MP-UP-008,Q-MP-01 |

### 提交前诊断与提交后固定源码（05 Context前置）

正式05 schema的Context必须有真实implementation_commit和generator_commit，且与实际被测/报告生成源码一致。首次boundary未有commit，或源码/fixture/tooling仍有未提交改动时，不能把旧HEAD、设计commit、占位hash或临时tree当作这两个字段。此时只保存安全实际直接测试/工具输出的诊断与审查说明，位置为reports/review/<boundary_id>-precommit.md；它不是正式machine case/report/EV，也不伪渲染合格index。schema/工具负例fixture只是测试输入，不能代替实际业务raw。

提交前Build/Test核当前完整能力与直接层检查；Evidence Gate按当前诊断成熟度核真实输出/失败解释、scope和安全，不能声称完整主suite/合格EV。全部代码能力及这些required检查有真实结果、用户另授权后，才可单boundarycommit。提交之后固定真实源码与generatorcommit，源码/fixture/tooling无dirty或无关未跟踪输入，再以新run/newexecution生成正式05 Context和当前partial/full材料；不能让旧HEAD报告覆盖未提交代码来源。输出区新增报告不等源码dirty，所有输入仍须可追溯。

当前边界Handoff再核提交后同源材料、remainingblockers与next。07-a提交前只验证fulltool能力/直接测试/非合格诊断，不先发finalEV；提交后新run才运行全11/allsubcase/六artifact→98EV/index→六seal→draft，完整包通过才能handoff07-b。若失败保留currentblocked，在额外提交授权和用户改动保护下修复同boundary/fix或获准amend，固定新实际commit后再新run；不提前激活下一边界。本时序不放宽任何05/06 required集合，不新增machine字段/证明状态。

## 4. 49flow唯一业务归属（不替代正式签名/协议/状态）

每入口只有一个业务boundary；API/Worker为06-a/06-b装配，不能重复实现service。types/ports分别前置01-a/02-a；PG读取/plan前置02-b，Query不写。以下仅导航，无fake业务truth。

| Flow | Kind | U | 主boundary | 首次实现文件 |
|---|---|---|---|---|
| BindPublisherRelation | Command | U1 | commit-03-a | crates/application/src/source_responsibility/bind_publisher_relation.rs |
| ReleasePublisherRelation | Command | U1 | commit-03-a | crates/application/src/source_responsibility/release_publisher_relation.rs |
| VerifyPublicationSource | Command | U1 | commit-03-a | crates/application/src/source_responsibility/verify_publication_source.rs |
| GetSourceQualification | Query | U1 | commit-03-a | crates/application/src/source_responsibility/get_source_qualification.rs |
| CreatePublicationDraft | Command | U2 | commit-03-a | crates/application/src/publication_review/create_publication_draft.rs |
| RevisePublicationDraft | Command | U2 | commit-03-a | crates/application/src/publication_review/revise_publication_draft.rs |
| SubmitPublicationApplication | Command | U2 | commit-03-a | crates/application/src/publication_review/submit_publication_application.rs |
| TerminatePublicationApplication | Command | U2 | commit-03-a | crates/application/src/publication_review/terminate_publication_application.rs |
| RecordGovernanceDecision | Command | U2 | commit-03-a | crates/application/src/publication_review/record_governance_decision.rs |
| GetPublicationProgress | Query | U2 | commit-03-a | crates/application/src/publication_review/get_publication_progress.rs |
| DispatchReviewHandoff | Job | U2 | commit-03-a | crates/application/src/publication_review/dispatch_review_handoff.rs |
| ReconcileReviewHandoff | Job | U2 | commit-03-a | crates/application/src/publication_review/reconcile_review_handoff.rs |
| CreateMarketplaceListing | Command | U3 | commit-03-a | crates/application/src/catalog_version/create_marketplace_listing.rs |
| EditMarketplaceListing | Command | U3 | commit-03-a | crates/application/src/catalog_version/edit_marketplace_listing.rs |
| MaintainMarketCategory | Command | U3 | commit-03-a | crates/application/src/catalog_version/maintain_market_category.rs |
| RegisterMarketVersion | Command | U3 | commit-03-a | crates/application/src/catalog_version/register_market_version.rs |
| ListMarketVersion | Command | U3 | commit-03-a | crates/application/src/catalog_version/list_market_version.rs |
| SearchMarketplaceCatalog | Query | U3 | commit-03-b | crates/application/src/catalog_version/search_marketplace_catalog.rs |
| GetMarketplaceListing | Query | U3 | commit-03-b | crates/application/src/catalog_version/get_marketplace_listing.rs |
| ListMarketVersions | Query | U3 | commit-03-b | crates/application/src/catalog_version/list_market_versions.rs |
| SelectMarketVersion | Query | U3 | commit-03-b | crates/application/src/catalog_version/select_market_version.rs |
| ListMarketCategories | Query | U3 | commit-03-b | crates/application/src/catalog_version/list_market_categories.rs |
| GetReferenceFreshness | Query | U7 | commit-03-b | crates/application/src/reference_read/get_reference_freshness.rs |
| GetProjectionFreshness | Query | U7 | commit-03-b | crates/application/src/reference_read/get_projection_freshness.rs |
| RefreshQualifiedReferences | Job | U7 | commit-03-b | crates/application/src/reference_read/refresh_qualified_references.rs |
| RebuildMarketReadProjection | Job | U7 | commit-03-b | crates/application/src/reference_read/rebuild_market_read_projection.rs |
| RequestDistribution | Command | U4 | commit-04-a | crates/application/src/distribution/request_distribution.rs |
| CancelDistribution | Command | U4 | commit-04-a | crates/application/src/distribution/cancel_distribution.rs |
| RecordReceiverOutcome | Command | U4 | commit-04-a | crates/application/src/distribution/record_receiver_outcome.rs |
| GetAcquisitionEligibility | Query | U4 | commit-04-a | crates/application/src/distribution/get_acquisition_eligibility.rs |
| GetDistributionProgress | Query | U4 | commit-04-a | crates/application/src/distribution/get_distribution_progress.rs |
| DispatchDistribution | Job | U4 | commit-04-a | crates/application/src/distribution/dispatch_distribution.rs |
| ReconcileDistribution | Job | U4 | commit-04-a | crates/application/src/distribution/reconcile_distribution.rs |
| RestrictMarketVersion | Command | U5 | commit-04-b | crates/application/src/withdrawal_notice/restrict_market_version.rs |
| WithdrawMarketVersion | Command | U5 | commit-04-b | crates/application/src/withdrawal_notice/withdraw_market_version.rs |
| PlanImpactNotifications | Command | U5 | commit-04-b | crates/application/src/withdrawal_notice/plan_impact_notifications.rs |
| RecordNoticeOutcome | Command | U5 | commit-04-b | crates/application/src/withdrawal_notice/record_notice_outcome.rs |
| GetWithdrawalImpact | Query | U5 | commit-04-b | crates/application/src/withdrawal_notice/get_withdrawal_impact.rs |
| GetNoticeProgress | Query | U5 | commit-04-b | crates/application/src/withdrawal_notice/get_notice_progress.rs |
| EnumerateKnownImpact | Job | U5 | commit-04-b | crates/application/src/withdrawal_notice/enumerate_known_impact.rs |
| DispatchNotice | Job | U5 | commit-04-b | crates/application/src/withdrawal_notice/dispatch_notice.rs |
| ReconcileNotice | Job | U5 | commit-04-b | crates/application/src/withdrawal_notice/reconcile_notice.rs |
| GetMarketAudit | Query | U6 | commit-05-a | crates/application/src/audit_recovery/get_market_audit.rs |
| GetRecoveryProgress | Query | U6 | commit-05-a | crates/application/src/audit_recovery/get_recovery_progress.rs |
| GetOperationResult | Query | U6 | commit-05-a | crates/application/src/audit_recovery/get_operation_result.rs |
| RequestMarketRecovery | Command | U6 | commit-05-b | crates/application/src/audit_recovery/request_market_recovery.rs |
| RunMarketRecovery | Job | U6 | commit-05-b | crates/application/src/audit_recovery/run_market_recovery.rs |
| DispatchObservation | Job | U6 | commit-05-b | crates/application/src/audit_recovery/dispatch_observation.rs |
| ReconcileObservation | Job | U6 | commit-05-b | crates/application/src/audit_recovery/reconcile_observation.rs |

## 5. 98TC↔98EV主实现与完整执行层归属

业务实现owner不等于完整主suite可通过的时间；`close`指正式层/全部required subcase最早可完整执行边界，不是运行pass/验收退出。04-a的分发补层不能记W通过，05-b不能记完整R通过，01-b不能在真实slot装配之前记全部C通过。其他原库定向增量也必须保留partial。最终valid EV/detail/index均由07-a真实source及checks生成。AC/VETO逐行来自06证据索引，不另发明编号。

| TC | EV | 主suite别名 | 实现owner | 完整层最早boundary | AC/VETO设计支持 |
|---|---|---|---|---|---|
| TC-SOURCE-001 | EV-DOMAIN-001 | S | commit-03-a | commit-03-a | AC-MP-101, AC-MP-103, AC-MP-G02 |
| TC-SOURCE-002 | EV-DOMAIN-002 | S | commit-03-a | commit-03-a | AC-MP-101, AC-MP-103, AC-MP-203 |
| TC-SOURCE-003 | EV-DOMAIN-003 | S | commit-03-a | commit-03-a | AC-MP-101, AC-MP-102, AC-MP-103, AC-MP-G01, VETO-MP-1 |
| TC-SOURCE-004 | EV-DOMAIN-004 | I | commit-06-c | commit-06-c | AC-MP-102, AC-MP-103, VETO-MP-1 |
| TC-SOURCE-005 | EV-DOMAIN-005 | I | commit-06-c | commit-06-c | AC-MP-101, AC-MP-202, AC-MP-401, AC-MP-G01, VETO-MP-1 |
| TC-SOURCE-006 | EV-DOMAIN-006 | S | commit-03-a | commit-03-a | AC-MP-103, AC-MP-303 |
| TC-REVIEW-001 | EV-DOMAIN-007 | S | commit-03-a | commit-03-a | AC-MP-201, AC-MP-203, AC-MP-G02 |
| TC-REVIEW-002 | EV-DOMAIN-008 | S | commit-03-a | commit-03-a | AC-MP-102, AC-MP-201, AC-MP-G02 |
| TC-REVIEW-003 | EV-DOMAIN-009 | S | commit-03-a | commit-03-a | AC-MP-201, AC-MP-203, AC-MP-G02, VETO-MP-2 |
| TC-REVIEW-004 | EV-DOMAIN-010 | S | commit-03-a | commit-03-a | AC-MP-102, AC-MP-201, AC-MP-202, AC-MP-203 |
| TC-REVIEW-005 | EV-DOMAIN-011 | S | commit-03-a | commit-03-a | AC-MP-201, AC-MP-202, AC-MP-203 |
| TC-REVIEW-006 | EV-DOMAIN-012 | I | commit-06-c | commit-06-c | AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-403, AC-MP-503, AC-MP-504 |
| TC-REVIEW-007 | EV-DOMAIN-013 | S | commit-03-a | commit-03-a | AC-MP-202, AC-MP-203, VETO-MP-2 |
| TC-REVIEW-008 | EV-DOMAIN-014 | I | commit-06-c | commit-06-c | AC-MP-202, AC-MP-203, AC-MP-401, AC-MP-G01, VETO-MP-2 |
| TC-REVIEW-009 | EV-DOMAIN-015 | S | commit-03-a | commit-03-a | AC-MP-201, AC-MP-203, AC-MP-501 |
| TC-REVIEW-010 | EV-DOMAIN-016 | S | commit-03-a | commit-03-a | AC-MP-202, AC-MP-203, AC-MP-503 |
| TC-CATALOG-001 | EV-PG-001 | P | commit-03-a | commit-03-a | AC-MP-201, AC-MP-301, AC-MP-G02 |
| TC-CATALOG-002 | EV-PG-002 | P | commit-03-a | commit-03-a | AC-MP-301, AC-MP-G02 |
| TC-CATALOG-003 | EV-PG-003 | P | commit-03-a | commit-03-a | AC-MP-301, AC-MP-502, AC-MP-G01, AC-MP-G02 |
| TC-CATALOG-004 | EV-PG-004 | P | commit-03-a | commit-03-a | AC-MP-201, AC-MP-203, AC-MP-303, AC-MP-501, AC-MP-G02 |
| TC-CATALOG-005 | EV-PG-005 | P | commit-03-a | commit-03-a | AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-501, VETO-MP-2 |
| TC-CATALOG-006 | EV-PG-006 | P | commit-03-a | commit-03-a | AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-501, VETO-MP-2 |
| TC-CATALOG-007 | EV-PG-007 | P | commit-03-b | commit-03-b | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-G03, VETO-MP-3 |
| TC-CATALOG-008 | EV-PG-008 | P | commit-03-b | commit-03-b | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-G01, VETO-MP-3 |
| TC-CATALOG-009 | EV-PG-009 | P | commit-03-b | commit-03-b | AC-MP-303 |
| TC-CATALOG-010 | EV-PG-010 | P | commit-03-b | commit-03-b | AC-MP-302, AC-MP-303, AC-MP-G01 |
| TC-DISTRIBUTION-001 | EV-WORKER-001 | W | commit-04-a | commit-06-b | AC-MP-401, VETO-MP-3 |
| TC-DISTRIBUTION-002 | EV-WORKER-002 | W | commit-04-a | commit-06-b | AC-MP-401, AC-MP-403 |
| TC-DISTRIBUTION-003 | EV-WORKER-003 | W | commit-04-a | commit-06-b | AC-MP-403, AC-MP-G02 |
| TC-DISTRIBUTION-004 | EV-WORKER-004 | W | commit-04-a | commit-06-b | AC-MP-403, AC-MP-G02 |
| TC-DISTRIBUTION-005 | EV-WORKER-005 | W | commit-04-a | commit-06-b | AC-MP-402, AC-MP-403, VETO-MP-4 |
| TC-DISTRIBUTION-006 | EV-WORKER-006 | W | commit-04-a | commit-06-b | AC-MP-203, AC-MP-402, AC-MP-403, AC-MP-504 |
| TC-DISTRIBUTION-007 | EV-WORKER-007 | W | commit-04-a | commit-06-b | AC-MP-203, AC-MP-401, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-504 |
| TC-DISTRIBUTION-008 | EV-WORKER-008 | W | commit-04-a | commit-06-b | AC-MP-402, AC-MP-403, VETO-MP-4 |
| TC-DISTRIBUTION-009 | EV-WORKER-009 | W | commit-04-a | commit-06-b | AC-MP-401, VETO-MP-3 |
| TC-DISTRIBUTION-010 | EV-WORKER-010 | W | commit-04-a | commit-06-b | AC-MP-402, AC-MP-403, AC-MP-504 |
| TC-WITHDRAWAL-001 | EV-DOMAIN-017 | S | commit-04-b | commit-04-b | AC-MP-501, AC-MP-502 |
| TC-WITHDRAWAL-002 | EV-DOMAIN-018 | S | commit-04-b | commit-04-b | AC-MP-201, AC-MP-203, AC-MP-501, VETO-MP-5 |
| TC-WITHDRAWAL-003 | EV-DOMAIN-019 | S | commit-04-b | commit-04-b | AC-MP-501, AC-MP-G01 |
| TC-WITHDRAWAL-004 | EV-DOMAIN-020 | S | commit-04-b | commit-04-b | AC-MP-501, AC-MP-502, AC-MP-G03 |
| TC-WITHDRAWAL-005 | EV-DOMAIN-021 | S | commit-04-b | commit-04-b | AC-MP-203, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-G03, VETO-MP-5 |
| TC-WITHDRAWAL-006 | EV-DOMAIN-022 | S | commit-04-b | commit-04-b | AC-MP-502, AC-MP-G02 |
| TC-WITHDRAWAL-007 | EV-DOMAIN-023 | S | commit-04-b | commit-04-b | AC-MP-502, AC-MP-504 |
| TC-WITHDRAWAL-008 | EV-DOMAIN-024 | S | commit-04-b | commit-04-b | AC-MP-501, AC-MP-502, AC-MP-504, VETO-MP-5 |
| TC-WITHDRAWAL-009 | EV-DOMAIN-025 | S | commit-04-b | commit-04-b | AC-MP-502, AC-MP-504 |
| TC-WITHDRAWAL-010 | EV-DOMAIN-026 | S | commit-04-b | commit-04-b | AC-MP-302, AC-MP-502, AC-MP-503, AC-MP-G01 |
| TC-RECOVERY-001 | EV-RECOVERY-001 | R | commit-05-b | commit-06-b | AC-MP-103, AC-MP-302, AC-MP-403, AC-MP-504, AC-MP-G02 |
| TC-RECOVERY-002 | EV-RECOVERY-002 | R | commit-05-b | commit-06-b | AC-MP-101, AC-MP-103, AC-MP-403, AC-MP-G02 |
| TC-RECOVERY-003 | EV-RECOVERY-003 | R | commit-05-b | commit-06-b | AC-MP-504 |
| TC-RECOVERY-004 | EV-RECOVERY-004 | R | commit-05-b | commit-06-b | AC-MP-302, AC-MP-504, AC-MP-G01, AC-MP-G02 |
| TC-RECOVERY-005 | EV-RECOVERY-005 | R | commit-05-b | commit-06-b | AC-MP-203, AC-MP-302, AC-MP-403, AC-MP-504, AC-MP-G02, VETO-MP-5 |
| TC-RECOVERY-006 | EV-RECOVERY-006 | R | commit-05-b | commit-06-b | AC-MP-203, AC-MP-403, AC-MP-501, AC-MP-504, AC-MP-G02, VETO-MP-5 |
| TC-RECOVERY-007 | EV-RECOVERY-007 | R | commit-05-b | commit-06-b | AC-MP-302, AC-MP-502, AC-MP-503, AC-MP-G02 |
| TC-RECOVERY-008 | EV-RECOVERY-008 | R | commit-05-b | commit-06-b | AC-MP-503, AC-MP-504, AC-MP-G02 |
| TC-RECOVERY-009 | EV-RECOVERY-009 | R | commit-05-b | commit-06-b | AC-MP-503, AC-MP-504, AC-MP-G02, VETO-MP-5 |
| TC-RECOVERY-010 | EV-RECOVERY-010 | R | commit-05-b | commit-06-b | AC-MP-501, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5 |
| TC-RECOVERY-011 | EV-RECOVERY-011 | R | commit-05-b | commit-06-b | AC-MP-504 |
| TC-REFERENCE-001 | EV-PG-011 | P | commit-03-b | commit-03-b | AC-MP-102, AC-MP-103, AC-MP-303, AC-MP-504, AC-MP-G02 |
| TC-REFERENCE-002 | EV-PG-012 | P | commit-03-b | commit-03-b | AC-MP-103, AC-MP-302, AC-MP-303, AC-MP-504 |
| TC-REFERENCE-003 | EV-PG-013 | P | commit-03-b | commit-03-b | AC-MP-303, AC-MP-504, AC-MP-G02 |
| TC-REFERENCE-004 | EV-PG-014 | P | commit-03-b | commit-03-b | AC-MP-303, AC-MP-504, AC-MP-G02 |
| TC-REFERENCE-005 | EV-PG-015 | P | commit-03-b | commit-03-b | AC-MP-303, AC-MP-504, AC-MP-G02 |
| TC-REFERENCE-006 | EV-PG-016 | P | commit-03-b | commit-03-b | AC-MP-103, AC-MP-303, AC-MP-504, AC-MP-G02 |
| TC-CONFIG-001 | EV-CONFIG-001 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-002 | EV-CONFIG-002 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-003 | EV-CONFIG-003 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-004 | EV-CONFIG-004 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-005 | EV-CONFIG-005 | C | commit-01-b | commit-06-c | AC-MP-G01, AC-MP-G03 |
| TC-CONFIG-006 | EV-CONFIG-006 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-007 | EV-CONFIG-007 | C | commit-01-b | commit-06-c | AC-MP-503, AC-MP-G01, AC-MP-G04, VETO-MP-1 |
| TC-CONFIG-008 | EV-CONFIG-008 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-009 | EV-CONFIG-009 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-010 | EV-CONFIG-010 | C | commit-01-b | commit-06-c | AC-MP-G01 |
| TC-CONFIG-011 | EV-CONFIG-011 | C | commit-01-b | commit-06-c | AC-MP-G01, AC-MP-G04 |
| TC-CONFIG-012 | EV-CONFIG-012 | C | commit-01-b | commit-06-c | AC-MP-101, AC-MP-202, AC-MP-402, AC-MP-G01, AC-MP-G03, VETO-MP-4 |
| TC-CROSS-001 | EV-UNIT-001 | D | commit-01-a | commit-01-a | AC-MP-103, AC-MP-403, AC-MP-G02 |
| TC-CROSS-002 | EV-UNIT-002 | D | commit-01-a | commit-01-a | AC-MP-103, AC-MP-403, AC-MP-G02 |
| TC-CROSS-003 | EV-PG-017 | P | commit-02-b | commit-02-b | AC-MP-G02 |
| TC-CROSS-004 | EV-PG-018 | P | commit-03-b | commit-03-b | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-504, AC-MP-G03 |
| TC-CROSS-005 | EV-API-001 | W | commit-06-a | commit-06-b | AC-MP-302, AC-MP-504, AC-MP-G02 |
| TC-CROSS-006 | EV-REDACTION-001 | X | commit-06-c | commit-07-a | AC-MP-102, AC-MP-503, AC-MP-G01, AC-MP-G02, AC-MP-G03, AC-MP-G04, VETO-MP-1 |
| TC-CROSS-007 | EV-API-002 | W | commit-06-a | commit-06-b | AC-MP-101, AC-MP-202, AC-MP-401, AC-MP-G01, VETO-MP-3 |
| TC-CROSS-008 | EV-WEB-001 | B | commit-06-b | commit-06-b | AC-MP-G04 |
| TC-CROSS-009 | EV-CONFIG-013 | C | commit-01-b | commit-06-c | AC-MP-402, AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-1 |
| TC-CROSS-010 | EV-RELEASE-001 | E | commit-07-a | commit-07-a | AC-MP-503, AC-MP-504, AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-1, VETO-MP-5 |
| TC-CROSS-011 | EV-UNIT-003 | D | commit-01-a | commit-01-a | AC-MP-G01, AC-MP-G04 |
| TC-CROSS-012 | EV-DOMAIN-027 | D | commit-01-a | commit-01-a | AC-MP-101, AC-MP-102, AC-MP-502, AC-MP-G01, AC-MP-G02, VETO-MP-5 |
| TC-CROSS-013 | EV-DOMAIN-028 | D | commit-01-a | commit-01-a | AC-MP-G02, VETO-MP-5 |
| TC-CROSS-014 | EV-UNIT-004 | I | commit-06-c | commit-06-c | AC-MP-G01, AC-MP-G02 |
| TC-CROSS-015 | EV-PG-019 | P | commit-02-b | commit-02-b | AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5 |
| TC-CROSS-016 | EV-PG-020 | P | commit-02-b | commit-02-b | AC-MP-201, AC-MP-203, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-G02, VETO-MP-5 |
| TC-CROSS-017 | EV-PG-021 | P | commit-03-b | commit-03-b | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-402, AC-MP-403, AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G03, VETO-MP-3 |
| TC-CROSS-018 | EV-API-003 | W | commit-06-a | commit-06-b | AC-MP-G01, AC-MP-G02 |
| TC-CROSS-019 | EV-WORKER-021 | W | commit-06-b | commit-06-b | AC-MP-403, AC-MP-502, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5 |
| TC-CROSS-020 | EV-UNIT-005 | D | commit-01-a | commit-01-a | AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-4 |
| TC-CROSS-021 | EV-WEB-002 | B | commit-06-b | commit-06-b | AC-MP-G04, VETO-MP-4 |
| TC-CROSS-022 | EV-CONFIG-014 | C | commit-01-b | commit-06-c | AC-MP-402, AC-MP-G01, AC-MP-G03 |
| TC-CROSS-023 | EV-RELEASE-002 | M | commit-07-a | commit-07-a | AC-MP-101, AC-MP-102, AC-MP-103, AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-401, AC-MP-402, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G01, AC-MP-G02, AC-MP-G04 |

02-a/05-a/07-b无独立primary不等于无测试：二次补层/零写或完整同run审查见Step6/7，不新增TC/EV。最终manifest保留49入口、43对象、14carrier/222pairs、17ports/146methods、33canonical和7分页caller等全部required集合，不能只查98行数。

## 6. 215path主引入与后续合法增量

此表是正式03 Step4布局逐项设计分配，不声称目录/文件存在。`主引入`只指定首次能力owner，不是唯一终身编辑owner。共享mod/lib/manifest/store/test的后续半侧按本表与boundary scope批准；缺路径/方法scope先回写07，不允许实现端新增typed真相。43对象domain纯面可前置；业务调用和流程另有归属。

| Planned path | 主引入boundary | 后续合法增量 / 保护规则 |
|---|---|---|
| Cargo.toml | commit-01-a | 后续boundary仅增所需依赖/target，无扩新member |
| Cargo.lock | commit-01-a | 后续boundary仅增所需依赖/target，无扩新member |
| rust-toolchain.toml | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| rustfmt.toml | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/Cargo.toml | commit-01-a | 后续boundary仅增所需依赖/target，无扩新member |
| crates/domain/Cargo.toml | commit-01-a | 后续boundary仅增所需依赖/target，无扩新member |
| crates/application/Cargo.toml | commit-01-a | 后续boundary仅增所需依赖/target，无扩新member |
| crates/infra/Cargo.toml | commit-01-a | 后续boundary仅增所需依赖/target，无扩新member |
| crates/api/Cargo.toml | commit-06-a | 后续boundary仅增所需依赖/target，无扩新member |
| crates/worker/Cargo.toml | commit-06-b | 后续boundary仅增所需依赖/target，无扩新member |
| crates/contracts/src/lib.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/value_objects.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/states.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/context.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/worker_protocol.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/errors.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/source_responsibility.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/publication_review.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/catalog_version.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/distribution.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/withdrawal_notice.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/audit_recovery.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/src/reference_read.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/lib.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/source_binding.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/publisher_relation.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/publication_basis.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/publication_application.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/review_handoff.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/marketplace_listing.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/market_version.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/category.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/distribution_intent.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/distribution_attempt.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/distribution_relation.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/withdrawal_impact.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/notice_intent.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/operation_record.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/market_audit_record.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/deferred_work.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/recovery_intent.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/qualified_reference_snapshot.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/src/read_projection.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/lib.rs | commit-02-a | 后续business只当前module导出 |
| crates/application/src/entries.rs | commit-02-a | 06-a Command/Query dispatcher；06-b Worker dispatcher；02-a先锁signature |
| crates/application/src/operation_context.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/command_runner.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/job_runner.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/read_facade.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/intent_fingerprint.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/mod.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/market_store.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/operation_store.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/audit_store.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/work_store.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/snapshot_store.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/projection_store.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/source_owner.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/publisher_authority.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/material_authority.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/governance.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/scope_resolver.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/receiver.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/notice_channel.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/observation.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/ports/unit_of_work.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/errors.rs | commit-02-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/source_responsibility/mod.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/source_responsibility/bind_publisher_relation.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/source_responsibility/release_publisher_relation.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/source_responsibility/verify_publication_source.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/source_responsibility/get_source_qualification.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/mod.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/create_publication_draft.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/revise_publication_draft.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/submit_publication_application.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/terminate_publication_application.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/record_governance_decision.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/get_publication_progress.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/dispatch_review_handoff.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/publication_review/reconcile_review_handoff.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/mod.rs | commit-03-a | 03-b Query半侧；03-a Command半侧 |
| crates/application/src/catalog_version/create_marketplace_listing.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/edit_marketplace_listing.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/maintain_market_category.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/register_market_version.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/list_market_version.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/search_marketplace_catalog.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/get_marketplace_listing.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/list_market_versions.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/select_market_version.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/catalog_version/list_market_categories.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/mod.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/request_distribution.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/cancel_distribution.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/record_receiver_outcome.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/get_acquisition_eligibility.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/get_distribution_progress.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/dispatch_distribution.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/distribution/reconcile_distribution.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/mod.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/restrict_market_version.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/withdraw_market_version.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/plan_impact_notifications.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/record_notice_outcome.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/get_withdrawal_impact.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/get_notice_progress.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/enumerate_known_impact.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/dispatch_notice.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/withdrawal_notice/reconcile_notice.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/mod.rs | commit-05-a | 05-a三Q半侧；05-b C/J半侧（首次mod前置05-a） |
| crates/application/src/audit_recovery/request_market_recovery.rs | commit-05-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/get_market_audit.rs | commit-05-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/get_recovery_progress.rs | commit-05-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/get_operation_result.rs | commit-05-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/run_market_recovery.rs | commit-05-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/dispatch_observation.rs | commit-05-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/audit_recovery/reconcile_observation.rs | commit-05-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/reference_read/mod.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/reference_read/get_reference_freshness.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/reference_read/get_projection_freshness.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/reference_read/refresh_qualified_references.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/src/reference_read/rebuild_market_read_projection.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/lib.rs | commit-01-b | 后续boundary只当前module导出 |
| crates/infra/src/runtime_config.rs | commit-01-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/runtime_builder.rs | commit-02-b | 06-a/API、06-b/Worker、06-c/eightslot exact装配；02-b最小本地PG+已定义ports装配，不引用未来service |
| crates/infra/src/telemetry.rs | commit-05-b | 06-c SDKsafe mapping；不变审计payload/低基数约束 |
| crates/infra/src/postgres/mod.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/unit_of_work.rs | commit-02-a | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/market_store.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/operation_store.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/audit_store.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/work_store.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/snapshot_store.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/projection_store.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/catalog_search.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/postgres/row_codec.rs | commit-02-b | 03～05仅业务计划/index/已定义method接线，不建第二套Row/port |
| crates/infra/src/sdk/mod.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/source_owner_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/publisher_authority_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/material_authority_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/governance_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/scope_resolver_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/receiver_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/notice_channel_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/sdk/observation_adapter.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/src/fake/mod.rs | commit-02-a | 各business/adapter边界追加同port场景，不加private field/schema |
| crates/infra/src/fake/local_store.rs | commit-02-a | 各business/adapter边界追加同port场景，不加private field/schema |
| crates/infra/src/fake/owner_ports.rs | commit-02-a | 各business/adapter边界追加同port场景，不加private field/schema |
| crates/api/src/main.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/routes.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/trusted_context.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/response_mapping.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/source_responsibility.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/publication_review.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/catalog_version.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/distribution.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/withdrawal_notice.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/audit_recovery.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/reference_read.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/src/handlers/mod.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/worker/src/main.rs | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/worker/src/scheduler.rs | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/worker/src/job_dispatch.rs | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/worker/src/shutdown.rs | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/package.json | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/tsconfig.json | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/vite.config.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/index.html | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/main.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/App.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/router.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/api/marketplace_client.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/api/protocol.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/api/response_validation.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/i18n/index.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/i18n/en.json | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/i18n/zh.json | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/components/MarketStatusBadge.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/components/OwnerReferenceSummary.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/components/LanguageSwitch.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/components/MarketAsyncState.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketCatalogPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketListingPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketPublicationPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketDistributionPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketWithdrawalPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketAuditRecoveryPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/views/MarketPublisherPage.vue | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/composables/useMarketQuery.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/src/composables/useMarketCommand.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/tests/marketplace_protocol_tests.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/tests/marketplace_locale_tests.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| apps/web/tests/marketplace_workflow_tests.ts | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/contracts/tests/protocol_roundtrip_tests.rs | commit-01-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/domain/tests/source_responsibility_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/domain/tests/publication_review_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/domain/tests/catalog_version_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/domain/tests/distribution_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/domain/tests/withdrawal_notice_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/domain/tests/audit_recovery_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/domain/tests/reference_read_tests.rs | commit-01-a | 03-a, 04-a, 04-b, 05-b, 03-b的既定guard用例；首批纯定义不后置 |
| crates/application/tests/source_responsibility_flow_tests.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/tests/publication_review_flow_tests.rs | commit-03-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/tests/catalog_version_flow_tests.rs | commit-03-a | 03-b Query半侧；03-a Command半侧 |
| crates/application/tests/distribution_flow_tests.rs | commit-04-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/tests/withdrawal_notice_flow_tests.rs | commit-04-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/application/tests/audit_recovery_flow_tests.rs | commit-05-b | 05-a三Q半侧；05-b C/J半侧（首次mod前置05-a） |
| crates/application/tests/reference_read_flow_tests.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/tests/postgres_atomicity_tests.rs | commit-02-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/tests/sdk_qualification_tests.rs | commit-06-c | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/infra/tests/withdrawal_race_tests.rs | commit-04-a | 04-b撤回半侧 |
| crates/infra/tests/projection_rebuild_tests.rs | commit-03-b | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/api/tests/entry_mapping_tests.rs | commit-06-a | 只由scope明示的当前boundary改本职责；不跨所有权 |
| crates/worker/tests/worker_recovery_tests.rs | commit-06-b | 只由scope明示的当前boundary改本职责；不跨所有权 |

22 scripts、config examples及migrations是03树外、05/04/03规范性planned交付，不能被215path数量掩盖。脚本bootstrap/full分工在Step7，migration只本地32store及索引，不制造owner/ref/digest。当前实际目标仓未创建，未冻结不可变baseline，不允许移交实现。
