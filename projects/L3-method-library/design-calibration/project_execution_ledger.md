# L3-method-library 项目设计讨论执行台账

> 创建日期: 2026-06-15
> 最近更新: 2026-08-07
> 当前任务: `commit-06-b` Required Reads 与 Design/Scope Gate 已基于精确设计提交 `2256ba87a3697660a413a00ed5bab7d1f6f680e4` 重跑并由 `BLK-ML-06B-DESIGN-001` 阻塞。当前只允许等待设计侧发布 PH-06 boundary-specific service/store callable、replay/factory/fake 与 targeted raw-evidence 闭口;实现仓不得修改代码、tests 或 evidence。
> 项目目录: `projects/L3-method-library`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | implementation boundary handoff | `commit-06-b design gate blocked` | blocked_wait_design | Required Reads prove that current formal sources close PH-06 objects/domain semantics and family-level flow/store direction only;exact facade/service inputs and sources,repository/error/version/UoW/stored-result/replay/factory/fake parity and fixed targeted raw-evidence names are absent. | 设计侧先关闭 `BLK-ML-06B-DESIGN-001`;新 baseline 记入台账后,实现侧从 `read_docs` 全量重跑 Design/Scope/Worktree Gate。 | `design-calibration/implementation_execution_ledger.md`;`design-calibration/implementation-boundaries/commit-06-b.md`;`projects/L3-method-library/07-实施计划.md` |

---

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | completed | completed | R19.26_completed_wait_user_confirm_to_04 | 正式 `03-详细设计.md` 可作为配置设计输入。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | completed | completed | R15.18_completed_wait_user_confirm_to_05 | 正式 `04-配置设计.md` 可作为测试方案输入。 |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | completed | Step 15 completed | R15.2_completed_wait_user_confirm_to_06 | 正式 `05-测试方案.md` 已按 Step 1~14 完成 full-restart 装配,可作为 `06` 输入。 |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | completed | Step 15 R15.2 completed_wait_user_confirm_to_07 | pass | 正式 `06-验收标准.md` 已按 Step 1~14 中间产物完成 full-restart 装配,可作为 `07` 输入。 |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | implementation_handoff_active | Step 13 completed + `commit-06-b` Design Gate blocked | wait_design | Required Reads 已重读;当前 formal source 仍缺 PH-06 boundary-specific exact callable/replay/factory/fake/evidence 闭口,实现侧等待设计修复。 |

---

## 3. 当前 full-restart 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 旧 `00-需求文档.md` 不作为本轮需求结论 | completed | 需求文档已在本轮重启中完成装配。 |
| 旧 `01-架构设计.md` 不作为本轮架构结论 | completed | 架构文档已按本轮重建完成。 |
| 旧 `02-概要设计.md` 不作为本轮概要结论 | completed | 概要文档已按本轮重建完成。 |
| 旧 `03-详细设计.md` 不作为本轮详细设计结论 | completed | 正式 03 已完成 full-restart 装配。 |
| `04-配置设计.md` 不得直接跳写正式正文 | completed | 已按 `04_config_*` 中间产物完成 Step 15 装配。 |
| `05-测试方案.md` 不得直接跳写正式正文 | completed | 已按 `05_test_plan_*` 中间产物完成 Step 15 装配。 |
| `06-验收标准.md` 不得直接跳写正式正文 | completed | 已按 `06_acceptance_*` 中间产物完成 Step 15 装配。 |
| 旧 `05/06/07` 不作为测试真相源 | active | 旧 `05/06` 已被 full-restart 正式文档替换;旧 `07` 只作方向输入,不得反向定义 evidence、验收门禁或实施边界。 |
| `07-实施计划.md` 不得直接跳写正式正文 | active | 必须先走 `07_implementation_plan_*` 中间产物,Step 13 才能装配正式 07。 |
| 每个 Step 先列必读文档 | active | 必读文档摘要必须写入当前 Step 文件。 |
| 每个 Step 先搭整体模块,再逐模块先思考后写入 | active | 模块思考和写入记录在当前 Step 文件内。 |
| 每次用户确认只推进一个当前模块 | active | 不得把多个模块一次性自动推进。 |
| 单次写入批次不等于文件长度上限 | active | 100~300 行只约束单次 patch / 写入批次。 |

---

## 4. 历史材料处理台账

| 材料 | 当前定位 | 处理口径 |
|---|---|---|
| `projects/L3-method-library/04-配置设计.md` | formal_completed | R15.18 已完成 §1~§15 正文装配、final self-check 和 Step 15 completed stop-review。 |
| `projects/L3-method-library/05-测试方案.md` | formal_completed | 已完成 full-restart 装配,使用当前 `TC-ML-*` / `EV-ML-*` 口径,可作为新版 `06` 输入。 |
| `projects/L3-method-library/06-验收标准.md` | formal_completed | 已按当前 `00`~`05` 和 `06_acceptance_step_01`~`15` 完成 full-restart 装配;旧主语、旧同步路径、旧基础设施和旧硬阈值口径已隔离。 |
| `projects/L3-method-library/07-实施计划.md` | formal_completed | 已按 Step 1~13 完成 full-restart 装配并提交;旧版 MethodContent / publish / snapshot / outbox / PostgreSQL 方向只作为历史污染样本隔离。 |
| `projects/L1-governance/design-calibration/06_acceptance_*` | framework_reference | 只参考流程、表格和门禁深度,不得复制 governance 领域事实。 |

---

## 5. 全局 blocker 台账

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ML-S14-GAP-001 | 正式 `02-概要设计.md` §2~§4 | resolved | §2、§3、§4 缺 `延伸阅读` 块。 | 已在 `02-概要设计` Step 14 修复并关闭。 |
| ML-D03-RESET-001 | `03-详细设计.md`;旧 `03_ddd_*` | resolved | 旧 03 曾含旧正向主线,容易污染新 03。 | Step 19 已完成正式 03 full-restart 装配;旧材料已隔离。 |
| ML-D03-S3-RESET-001 | `design-calibration/03_ddd_step_03_runtime_constraints.md` | resolved | 旧 Step 3 文件曾是旧 P0 口径且标记已确认。 | Step 3 已重启并关闭旧 completed 污染。 |
| BLK-ML-03A-DESIGN-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-a.md` | resolved | `commit-03-a` 先前基线未唯一闭合 definition/catalog support carrier/schema,实现若继续将需要自补 `MethodAssetDefinitionKind`、`MethodAssetIdentityKey`、`MethodAssetDefinitionSummary`、`ExternalSourceSummaryRefSet`、`MethodAssetCatalogEntryRefSet`、`MethodAssetCatalogClassification`、`MethodAssetApplicabilitySummary`、`MethodAssetCatalogEntryStatus` 等 Rust-facing 载体。 | formal `03` §6、Step 6 和 Step 10 已发布唯一 implementation-facing carrier/schema closure;implementation ledger / boundary ledger 已重新激活到 `read_docs`。 |
| BLK-ML-03A-DESIGN-002 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-a.md` | resolved | `ExternalSourceSummaryRefSet` / `MethodAssetCatalogEntryRefSet` 壳已闭合,但成员 `ExternalSourceSummaryRef` / `MethodAssetCatalogEntryRef` 曾缺少 exact Rust-facing typed-ref family/kind,实现若继续将需要自行发明 ref kind 或 alias。 | formal `03` §6 和 Step 6 已明确两者均为 named wrapper over `MethodLibraryTypedBoundaryRef`,exact kinds 分别为 `ExternalSourceSummary` / `MethodAssetCatalogEntry`;implementation ledger / boundary ledger 已重新激活到 `read_docs`。 |
| BLK-ML-03A-DESIGN-003 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-a.md` | resolved | `MethodAssetCatalogEntry.mark_deprecated(reason_ref)` 曾缺少 current-boundary Rust-facing `reason_ref` carrier/schema,实现若继续将需要自补 local reason type、raw reason 或 parameterless status toggle。 | formal `03` §6 和 Step 6 已将 `reason_ref` 闭合为 `MethodLibrarySafeMarker`,禁止本地 `*ReasonRef` family、raw string/error/config/provider body/fake marker,并要求 domain tests 覆盖显式 marker、raw reason redline、无参数 toggle redline 和 identity preservation。 |
| BLK-ML-03B-DESIGN-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | `MethodAssetApiCommandHandlerEntry` 曾缺少 current-boundary application dispatch/service boundary。 | formal `03` §6.3A 和 Step 7 `R7.10A` 已闭合 command family carrier、application dispatch marker 和 `MethodAssetDefinitionCatalogCommandFacade.dispatch_definition_catalog_command(input)`。 |
| BLK-ML-03B-DESIGN-002 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | definition/catalog accepted service 曾缺 exact Rust-facing repository/UoW/stored-result callable surface。 | formal `03` §6.3A / §10.2A、Step 7 `R7.10A` 和 Step 11 §3A/§3B 已闭合 exact repository methods、version carriers、UoW order、stored-result repository、fake parity 和 duplicate replay。 |
| BLK-ML-03B-DESIGN-003 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | facade I/O、6 个 service `*Input` carrier、application-owned replay/idempotency refs、stored result carriers 和 `MethodAssetRepositoryError` 曾只有名称或字段方向,没有 exact Rust-facing schema。 | formal `03` §6.3A、Step 6 `3B` 和 Step 7 `R7.10A` 已闭合这些 struct/newtype/enum 字段、来源、禁止替代和 error variant surface;implementation ledger / boundary ledger 已重新激活到 `read_docs`。 |
| BLK-ML-03B-DESIGN-004 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | Step 6 `3B.1` exact typed-ref labels owned by contracts,但 boundary allowed scope 曾只打开 application/infra/api。 | commit-03-b allowed scope 已打开最小 `crates/contracts/src/**` / `crates/contracts/tests/**`,仅用于 Step 6 `3B.1` / `3B.1A` ref kind registry/export 和 selector fixture;public DTO body / payload / route 仍禁止。 |
| BLK-ML-03B-DESIGN-005 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | `MethodLibraryCommandShell` 到六个 service input 曾缺唯一 selector source。 | Step 6 `3B.1A`、Step 7 `R7.10A` §1B、Step 9 definition/catalog notes 和 formal `03` §6.3A 已将 `command_shell.boundary_ref.kind` 闭合为 selector source,六个 intent label 1:1 映射到 service input / method。 |
| BLK-ML-03B-DESIGN-006 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | selector 已能选中 service input,但 selected input 的结构化字段曾缺正式 source map。 | Step 6 `3B.1B`、Step 7 `R7.10A` §1A / §1C、Step 9 definition/catalog notes 和 formal `03` §6.3A 已引入 body-free `MethodAssetDefinitionCatalogCommandSource`,并闭合 selector/source match、field assembly、expected-version load、safe rejection 和 digest canonicalization。 |
| BLK-ML-03B-DESIGN-007 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | `RetireMethodAssetDefinitionFlow` 曾需要 `Active -> Retired` 持久状态,但 Step 6 truth carrier 没有 lifecycle/status 字段,实现若继续将需要自补 private side-state。 | formal `03` §6/§9/§10、Step 6、Step 7、Step 9 和 Step 10 已闭合 `MethodAssetDefinitionLifecycle = Active | Retired` 为 `MethodAssetDefinition.definition_lifecycle`;建立初始化 `Active`,调整要求/保持 `Active`,退休持久化 `Retired`,repository fake/durable 必须通过 `Versioned<MethodAssetDefinition>` 返回 lifecycle。 |
| BLK-ML-03B-DESIGN-008 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | `RetireMethodAssetDefinitionFlow` 曾要求 formal-version traceability / active-conflict inspection,但当前 boundary 没有 formal-version repository callable surface。 | formal `03` §6.3A / §10.2A、Step 7、Step 9、Step 10 和 formal `07` 已将该检查从 `commit-03-b` carve out 并后移 PH-04;当前 `retire_definition` 只读取 definition lifecycle / expected version / safe marker。 |
| BLK-ML-03B-DESIGN-009 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | `RetireMethodAssetCatalogEntryFlow` 曾要求 mark retired / Registered -> Retired,但 Step 6 没有同层 catalog retirement helper 和 exact `MethodAssetCatalogEntryStatus` 映射。 | formal `03` §6/§9、Step 6、Step 9、Step 10 和 formal `07` 已闭合 `MethodAssetCatalogEntry.mark_retired(MethodLibrarySafeMarker)`、`Registered == Visible`、register creates `Visible`、reclassify requires/preserves `Visible`、retire requires `Visible` and persists `Retired`;`Pending` / `Hidden` / `Deprecated` 不得默认为 `Registered`。 |
| BLK-ML-03B-DESIGN-010 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | catalog create/reclassify helper 曾未覆盖 `catalog_classification` / `applicability_summary` 等当前 boundary 持久化字段。 | formal `03` §6.3A、Step 6、Step 7 和 formal `07` 已闭合 `create_for_definition(catalog_entry_ref, definition_ref, catalog_scope_ref, catalog_classification, applicability_summary)` 与 `reclassify(new_catalog_classification, new_applicability_summary)`,并要求 scope mismatch safe reject。 |
| BLK-ML-03B-DESIGN-011 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | replay envelope / opaque ref helper 曾只列 wrapper 名,没有 operation context / digest / dedup / stored-result refs 的 factory surface。 | formal `03` §6.3A、Step 6 `3B.1.1`、Step 7 `R7.10A` 和 formal `07` 已闭合 `MethodAssetDefinitionCatalogSupportRefFactory`、replay envelope input/output/error surface;实现必须复制 factory 输出,不得本地 mint opaque refs。 |
| BLK-ML-03B-DESIGN-012 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-03-b.md` | resolved | establish/register flow 需要创建新的 `MethodAssetDefinitionRef` / `MethodAssetCatalogEntryRef`,但曾缺 exact current-boundary callable helper。 | formal `03` §6.3A、Step 6 `3B.1.1`、Step 7 `R7.10A`、Step 9 definition/catalog overlay 和 formal `07` 已闭合 `MethodAssetDefinitionCatalogSupportRefFactory.new_definition_ref(...)` / `new_catalog_entry_ref(...)`;实现只能在正式 flow 点复制 factory 输出,不得本地 mint truth refs。 |
| BLK-ML-05A-DESIGN-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-05-a.md` | resolved | `MethodAssetConsumptionMaterial` 曾在 formal `03` 与 Step 10 使用两套状态词,实现若继续会自行选择 `degraded/constrained/retired` 映射。 | formal `03` §6.3C、Step 6 `4C.3` 和 Step 10 `MethodAssetConsumptionMaterial` / `8.2` 已闭合 `MethodAssetConsumptionMaterialState = Prepared | Ready | Stale | Unavailable | Constrained`;历史 `degraded` 映射到 `Constrained`,`retired` 由 formal version state 阻止 material prepare。 |
| BLK-ML-05A-DESIGN-002 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-05-a.md` | resolved | consumption material / guard / boundary 的 named refs、reason refs、support carriers 和 guard/boundary state 曾只有字段名或旧 shell,没有 current-boundary Rust-facing closure。 | formal `03` §6.3C 和 Step 6 `4C.1`~`4C.5` 已闭合 exact typed refs、safe reason wrappers、body-free support carriers、`DefinitionUseBoundaryGuardState`、`DownstreamConsumptionBoundaryState`、object field/helper closure 和 no-downstream-truth test redlines。 |
| BLK-ML-05A-DESIGN-003 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-05-a.md` | resolved | `commit-05-a` allowed scope 要求 availability marker wrappers/tests,但 Step 10 / Step 12 曾只留下 marker source watch / design blocker,实现会被迫自补 marker schema。 | formal `03` §6.3C、Step 6 `4C.2`、Step 10 `8.2` 和 Step 12 `6.1` 已闭合 `MethodAssetConsumptionAvailabilityMarker`、target/source enums、copy-only rule、missing-source blocker 和禁止 raw error/fake marker synthesis。 |
| BLK-ML-05B-DESIGN-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-05-b.md` | resolved | `commit-05-b` 曾只有 family-level distribution/handoff seams,缺 exact application facade、service input source map、repository/UoW/stored-result surface 和 fake parity,实现若继续会自补 downstream truth、delivery semantics 或 fake-only mapping。 | formal `03` §6.3D、Step 7 closure patch、Step 9 flow overlay、Step 11 persistence/UoW overlay 和 formal `07` 已闭合 distribution/handoff facade、selector/source carriers、service inputs、support/ref factory、builder/target/publisher/handoff ports、outcome shell、stored result/UoW、fake parity 和 carve-outs。 |
| BLK-ML-05B-DESIGN-003 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-05-b.md` | resolved | adapter/target `Disabled` 缺少 publication safe outcome 所需 typed diagnostic,实现只能静默停止或私造 diagnostic/outcome mapping。 | 设计提交 `e12f092` 在 Step 6/formal 03/Step 7/9/10/11/12/13/16/formal 07 闭合 port-owned diagnostic、adapter-first mapping、target-set source、factory-issued outcome persistence、no-call/no-rollback/reentry/tests。 |
| BLK-ML-06A-DESIGN-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-06-a.md` | resolved | `commit-06-a` 曾缺 exact Rust-facing typed-ref kinds/wrappers、multi-kind trace source、ref-set shape/order、body-free support carriers 和 complete object fields。 | 设计提交 `ea99688411602fc73c24d011507042b271fac755` 的 formal `03` §6.3E 与 Step 6 PH-06 closure 已闭合 exact kinds、wrapper fields/accessors、first-seen sets、safe reason、summary/state/object fields 和 serde labels。 |
| BLK-ML-06A-DESIGN-002 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-06-a.md` | resolved | `commit-06-a` 曾无法区分 pure contracts/domain helper 与 Step 7/11 future repository/service 候选,实现可能私补 callable port、persistence 或 marker source。 | 设计提交 `ea99688411602fc73c24d011507042b271fac755` 已闭合 pure constructors/mutations、现有错误映射和 no application/service/repository/fake/resolver/mapper/UoW/persistence carve-out;future callable surface 后移 `commit-06-b`。 |
| BLK-ML-06A-DESIGN-003 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-06-a.md` | resolved | `commit-06-a` 曾缺 exact lifecycle/category split、legal/illegal transition 和 concrete fixture/evidence artifact closure。 | 设计提交 `ea99688411602fc73c24d011507042b271fac755` 的 Step 10/12/16 overrides 与 formal `07` 已闭合 four state carriers、impact-kind preservation、safe-reason mutations、focused tests、targeted redaction 和 six run-scoped raw artifact names。 |
| BLK-ML-06A-DESIGN-004 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-06-a.md` | resolved | `MethodAssetEvidenceLineage::link_trace_material(...)` 曾只有“append typed ref / retain prior links”,未闭合合法 source states、result state、typed duplicate 语义和 terminal rejection。 | 设计提交 `1b67753504024709a9e5092224aec18f445f8bd2` 已在 formal `03` §6.3E、Step 6、Step 10 和 Step 16 发布 exact matrix:仅 linked/partial 可链接并保持 state/summary,typed duplicate 成功 no-op,unavailable/body-rejected 返回 `InvalidTransition` 且对象不变。 |
| BLK-ML-06B-ACTIVATION-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-06-b.md` | resolved | `commit-06-b` 先前为 future planned boundary,不得用于实现。 | `commit-06-a` handoff 已关闭;三份流程台账现在仅将 `commit-06-b` 激活到 `ready_for_design_gate / read_docs`,exact design closure 仍须由 fresh gate 独立确认。 |
| BLK-ML-06B-DESIGN-001 | `implementation_execution_ledger.md`;`implementation-boundaries/commit-06-b.md` | open | Required Reads 已完成,但 formal `03` §6 明确只是索引且只为 `commit-06-b` 预留 service/store 名称;Step 7 仅预留四 repository family,Step 9 只有 flow prose,Step 11 只有 logical store semantics 并明确要求 fresh boundary-specific callable closure。实现若继续将被迫自补 facade/service carrier/source、truth/support ref factory、repository/error/version/UoW/stored-result/replay/CommitUnknown、fake parity/redaction 或 evidence 文件名。 | 设计侧须一次性发布 PH-06 当前边界 exact Rust-facing callable closure:facade I/O、service method/input/source/output、selector/source map（如使用 shared shell）、support/truth-ref factory 与 canonical digest、四 repository exact methods/missing/conflict、error enum、version/UoW/stored-result/replay/CommitUnknown、fake/durable parity、safe redaction mapping 和 fixed run-scoped raw artifact names;同时保持 report generator/jobs carve-out。闭口后更新 baseline 并将 implementation/boundary ledger 重置为 `read_docs`。 |

---

## 6. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取本文件 `project_execution_ledger.md`
2. 读取 `design-calibration/07_implementation_plan_calibration_flow.md`
3. 读取 `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`
4. 读取 `design-calibration/implementation_execution_ledger.md`
5. 读取 `design-calibration/implementation-boundaries/commit-06-b.md`
6. 确认正式 `projects/L3-method-library/07-实施计划.md` 已完成 full-restart 装配
7. 确认 implementation ledger 当前是 `commit-06-b` / `blocked` / `wait_design`,读取基线为精确设计提交 `2256ba87a3697660a413a00ed5bab7d1f6f680e4`,blocker 为 `BLK-ML-06B-DESIGN-001`
8. 设计侧未发布并登记新的 boundary-specific callable closure 前,保护实现仓用户未跟踪 `.gitignore`,不得编辑代码、tests、fixtures、artifacts 或 reports
9. 设计修复后必须先把新 baseline 和 blocker resolution 写入 implementation/boundary ledger,再从 `read_docs` 全量重读 Required Reads并独立重跑 Design/Scope/Worktree Gate;不得沿用本次 blocked 或任何历史 pass 结论
```

---

## 7. 当前 next_allowed_action

```text
`commit-06-a` implementation/handoff 已由 `997b7b02331e11fdc3222f4d0839ab8ce9ea0316` / `2256ba87a3697660a413a00ed5bab7d1f6f680e4` 关闭;
当前 boundary 是 `commit-06-b`,读取基线是精确设计提交 `2256ba87a3697660a413a00ed5bab7d1f6f680e4`,状态为 `blocked / wait_design`;
`BLK-ML-06B-DESIGN-001` 要求设计侧发布 exact facade/service carrier/source、support/truth-ref factory、repository/error/version/UoW/stored-result/replay/CommitUnknown、fake parity/redaction 和 fixed targeted raw-evidence 闭口,并保持 report generator/jobs carve-out;
实现侧不得私补上述 surface,不得修改代码/tests/evidence;设计修复并登记新 baseline 后必须从 `read_docs` 重新开始全部 gates.
```
