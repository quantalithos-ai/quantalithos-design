# L3-method-library 项目设计讨论执行台账

> 创建日期: 2026-06-15
> 最近更新: 2026-07-01
> 当前任务: `commit-03-a` implementation handoff 已关闭,实现仓提交为 `5376349eded0e277258c32d0b32b07a7c5aa2fe6`;`commit-03-b` definition/catalog accepted service boundary 的 contracts ref-kind owner scope、command shell selector、dispatch facade、repository/UoW/stored-result surface、exact schema carriers、fake parity 与 duplicate replay 口径已由设计侧闭口并重新激活;实现侧必须从 `read_docs` 重读当前台账和 required sources,重新执行 Design Gate 后再恢复当前 boundary。
> 项目目录: `projects/L3-method-library`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | implementation boundary handoff | `commit-03-b design gate reactivated` | ready_for_implementation_design_gate | formal `03` §6.3A / §10.2A、Step 6 `3B` / `3B.1A`、Step 7 `R7.10A`、Step 9 definition/catalog carve-out 和 Step 11 §3A/§3B 已闭合 definition/catalog accepted service 的 contracts ref-kind owner scope、command shell selector、dispatch facade、6 个 service input carriers、repository/UoW/stored-result、repository error surface、fake parity 和 duplicate replay 口径。 | 实现侧必须读取最新 implementation ledger / boundary ledger,从 `read_docs` 重跑 required reads / Design Gate / Scope Gate;若仍有缺口再回到 `blocked / wait_design`。 | `design-calibration/implementation_execution_ledger.md`;`design-calibration/implementation-boundaries/commit-03-b.md`;`projects/L3-method-library/07-实施计划.md` |

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
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | implementation_handoff_active | Step 13 completed + `commit-03-b` ready_for_design_gate | ready_for_implementation_design_gate | 正式 `07-实施计划.md` 已完成 full-restart 装配;`commit-03-b` 的 definition/catalog accepted service boundary 已在基线 `current-design-with-commit-03-b-selector-scope-closure` 重新激活,实现侧必须从当前 boundary ledger 重新开始并重跑门禁。 |

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

---

## 6. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取本文件 `project_execution_ledger.md`
2. 读取 `design-calibration/07_implementation_plan_calibration_flow.md`
3. 读取 `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`
4. 读取 `design-calibration/implementation_execution_ledger.md`
5. 读取 `design-calibration/implementation-boundaries/commit-03-b.md`
6. 确认正式 `projects/L3-method-library/07-实施计划.md` 已完成 full-restart 装配
7. 确认 implementation ledger 当前已推进到 `commit-03-b` / `read_docs`,并读取 `commit-03-b` 最新 boundary ledger
8. 按 boundary ledger 重新执行 required reads / Design Gate / Scope Gate;若任何 source、state、error、marker 或 test-support 再次不闭合,立即回到 `blocked / wait_design`
9. 当前 `commit-03-b` 已由设计侧补齐 contracts ref-kind owner scope、command shell selector、dispatch facade、service input carriers、repository/UoW/stored-result、repository error surface、fake parity 和 duplicate replay closure;恢复实现前必须使用最新台账和 required reads,不得沿用旧 blocked gate 结论
```

---

## 7. 当前 next_allowed_action

```text
`commit-03-a` implementation handoff 已关闭,实现仓提交为 `5376349eded0e277258c32d0b32b07a7c5aa2fe6`;
当前 boundary 是 `commit-03-b`,其 definition/catalog accepted service design baseline 已更新为 `current-design-with-commit-03-b-selector-scope-closure`;
下一步允许实现侧从 `read_docs` 重读 implementation ledger、boundary ledger 和 required sources,重新执行 Design Gate / Scope Gate 后恢复当前 boundary;
实现侧仍不得私补 DTO field、truth-owner rule、state/policy outcome、error family、support carrier 或 evidence;若重跑门禁发现新缺口,必须重新回到 `blocked / wait_design`.
```
