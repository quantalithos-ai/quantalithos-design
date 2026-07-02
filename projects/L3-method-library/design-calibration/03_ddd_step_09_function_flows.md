# Step 9. 逐接口定义函数级处理流

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 9
> 回填章节: `projects/L3-method-library/03-详细设计.md` §8 逐接口函数级处理流
> 创建日期: 2026-06-23
> 当前模式: full-restart / step9-rewrite / discussion-first
> 当前状态: in_progress
> 当前模块: `R9.27 Step 9 重写开工与 L1 粒度差异审计:先思考`
> 当前门禁: Step 9 rewrite reopened;按讨论-写入流程进入 `R9.27`

---

## 0. Step 9 重写记录

本文件在 2026-06-23 按用户要求开始重写。旧版 Step 9 曾标记为 `completed`,并把恢复点推进到 Step 10 `R10.1`,但其主体只达到 family-level 总结粒度,没有按 L1-governance Step 9 的深度逐接口写出足够细的讨论顺序、flow card、entry function、port family、side-effect ordering、branch、test cut 和 stop-review。

旧版 `R9.1`~`R9.26` 的 completed 结论作废。当前 Step 9 必须重新满足以下完成门禁后,才能再次推进 Step 10:

| 门禁项 | 当前裁决 |
|---|---|
| 每个 Command / Query / Inbound / Outbound / Job 是否有独立 flow card | 必须有;不得只写 family placeholder。 |
| 是否给出 shared command / query / inbound / outbound / job template | 必须有;每条 flow 必须回指 template 或列明差异。 |
| 是否回指 Step 6 object / Step 7 port / Step 8 protocol shell | 必须有;缺来源时记录 blocker/watch,不得自行补口。 |
| 是否提前写状态矩阵 / persistence schema / error schema / idempotency schema / config / test case schema | 禁止;只写 Step 10~16 handoff。 |
| 是否修改正式 `03-详细设计.md` | 禁止;本 Step 只写中间产物与恢复台账。 |

### 0.1 旧 completed 作废原因

| 问题 | 旧版表现 | 本次重写要求 |
|---|---|---|
| 粒度过粗 | Command / Query 只按 group card 总结。 | 58 个 Command、57 个 Query 逐项列 flow card。 |
| entry function 不足 | 没有稳定 application facade entry 名称。 | 每条 flow 给 `MethodAsset*Service.*` entry label。 |
| port 来源不足 | 多处只写 repository / resolver family。 | 每条 flow 至少列 Step 7 port family 来源。 |
| branch 不足 | accepted / rejected / duplicate / degraded 等分支只写 shared 语义。 | 每条 flow 写主要分支和禁止绕路。 |
| test cut 不足 | 只写 family 测试候选。 | 每条 flow 写 flow-level test cut。 |
| Step 10 过早 | 已把 calibration flow / ledger 推进到 Step 10。 | 已回退并重写 Step 9;最终停在 completed_wait_user_confirm,等待用户确认 Step 10。 |

### 0.2 权威输入

| 输入 | Step 9 使用方式 |
|---|---|
| `02_hld_step_07_api_interface_skeleton.md` `R1.24` | 58 个 Command flow 第一来源。 |
| `02_hld_step_07_api_interface_skeleton.md` `R1.26` | 57 个 Query flow 第一来源。 |
| `02_hld_step_07_api_interface_skeleton.md` `R1.28` | 4 个 Inbound Consumer flow 第一来源。 |
| `02_hld_step_07_api_interface_skeleton.md` `R1.30` | 34 个 Outbound Event flow 第一来源。 |
| `02_hld_step_07_api_interface_skeleton.md` `R1.32` | 8 个 Operations Job flow 第一来源。 |
| `03_ddd_step_06_object_contracts.md` | 对象、helper、state owner、marker / diagnostic 来源。 |
| `03_ddd_step_07_trait_port_adapter.md` | repository / resolver / mapper / publisher / handoff / job / runtime port family。 |
| `03_ddd_step_08_protocol_contracts.md` | shared protocol shell、result / page / receipt / report / marker guardrail。 |
| `L1-governance/design-calibration/03_ddd_step_09_function_flows.md` | 只参考 Step 9 框架深度,不复制 governance 领域语义。 |

### 0.3 旧污染禁止清单

| 禁止恢复项 | 原因 |
|---|---|
| `MethodContent*Flow` / old publish lifecycle | 与当前 `MethodAsset*` 主线冲突。 |
| P0 / P1 HTTP JSON / RPC | 当前 Step 9 不定义 transport route。 |
| snapshot / fingerprint / export snapshot | 已被当前 formalization / material / lineage 主线替代。 |
| old outbox relay / topic / delivery receipt | 当前 Outbound 只定义 event candidate 与 publication outcome 边界。 |
| old seed / replay / rebuild index / recalculate fingerprint jobs | 当前 Operations Job 只有 8 个维护收敛 job。 |

### 0.4 讨论-写入流程

Step 9 的后续重写和补写不再按“先批量铺开、后统一修正”的方式推进,而是按下面顺序循环:

1. 先讨论当前段的边界、缺口和与 L1-governance 的差异。
2. 再讨论需要写入的 flow card、branch、side effect、test cut 或 handoff。
3. 讨论结束后再写入对应正文。
4. 写入后再进入下一个讨论段,不跳段、不并段。

### 0.5 本轮重写目标

本轮不是补几条说明,而是把 Step 9 改写成和 L1-governance 同一风格的“讨论 -> 记录 -> 写入 -> 停审”结构:

| 目标 | 说明 |
|---|---|
| 讨论先行 | 每个大段先定边界、输入、缺口和允许写入的颗粒度。 |
| 写入跟随 | 讨论完一个段落,再写入对应正文,避免先铺满再回修。 |
| flow 细化 | Command / Query / Inbound / Outbound / Job 都要逐条展开,但写入时先按族讨论。 |
| 收口明确 | cross-flow audit、watch / blocker、design-side fixes、handoff items 和 final gate 必须独立成段。 |
| 不越界 | Step 9 不碰状态矩阵、persistence schema、error schema、config key、test case schema 和正式 `03-详细设计.md`。 |

## R9.27 Step 9 重写开工与 L1 粒度差异审计:再写入

### 1. L1-governance 框架参考结果

| L1 Step 9 框架点 | L3 采用方式 |
|---|---|
| 先写 flow inventory | 先讨论 58 / 57 / 4 / 34 / 8 覆盖矩阵,再进入逐项展开。 |
| 先写 shared templates | 先讨论 Command / Query / Inbound / Outbound / Job 统一模板,再写入差异。 |
| 每条 flow 有 entry / target / port / side effect / branch / test cut | 先讨论每条接口的执行序列,再以 compact flow card 形式写入。 |
| stop-review 与 handoff 明确 | 每批写 watch / blocker / Step 10~16 handoff。 |
| final audit 才能 completed | 当前只在全部 flow card 与 audit 通过后重新标记 completed。 |

### 2. 历史完成基线

下表保留上一轮 L1 粒度补全的完成基线,仅用于对照;本轮重写从 `0.4 讨论-写入流程` 重新开闸,不继承为当前写作顺序。

| 模块 | 目标 | 状态 |
|---|---|---|
| R9.27 | 重写开工、差异审计、inventory、shared templates。 | completed |
| R9.28 | Command shared template 与 58 个 Command flow cards。 | completed |
| R9.29 | Query shared template 与 57 个 Query flow cards。 | completed |
| R9.30 | 4 个 Inbound Consumer flow cards。 | completed |
| R9.31 | 34 个 Outbound Event candidate / publication flow cards。 | completed |
| R9.32 | 8 个 Operations Job run / resume / report flow cards。 | completed |
| R9.33 | Cross-flow closure audit、watch / blocker、Step 10~16 handoff。 | completed |
| R9.34 | 正式 §8 候选草稿与 compact baseline 停审。 | completed_superseded_by_R9.35_to_R9.44 |
| R9.35 | L1 粒度补全开工、差异审计和扩写模板。 | completed |
| R9.36 | 58 个 Command 的函数级执行 overlay。 | completed |
| R9.37 | 57 个 Query 的函数级执行 overlay。 | completed |
| R9.38 | 4 个 Inbound Consumer 的函数级执行 overlay。 | completed |
| R9.39 | 34 个 Outbound Event / publication 的函数级执行 overlay。 | completed |
| R9.40 | 8 个 Operations Job 的函数级执行 overlay。 | completed |
| R9.41 | L1 粒度 cross-flow closure audit。 | completed |
| R9.42 | Watch / blocker ledger 补全。 | completed |
| R9.43 | L1 粒度正式 §8 候选草稿补全。 | completed |
| R9.44 | L1 粒度补全最终停审。 | completed_wait_user_confirm |

### 3. 本轮重写计划

| 讨论段 | 目标 | 当前状态 |
|---|---|---|
| D0 | 框架对齐、flow inventory、shared templates、历史基线与差异审计 | in_progress |
| D1 | Command 族逐组讨论与写入 | pending |
| D2 | Query 族逐组讨论与写入 | pending |
| D3 | Inbound / Outbound / Job 逐族讨论与写入 | pending |
| D4 | cross-flow audit、watch / blocker、design-side fixes、handoff items、final gate | pending |

### 4. Flow inventory 覆盖矩阵

| Flow family | 数量 | 第一来源 | Step 9 展开方式 |
|---|---:|---|---|
| Command | 58 | HLD `R1.24` | 逐 Command flow card,按八个组成部分分批。 |
| Query | 57 | HLD `R1.26` | 逐 Query flow card,保持 no-write。 |
| Inbound Event Consumer | 4 | HLD `R1.28` | 逐 consumer intake / receipt / replay flow。 |
| Outbound Event | 34 | HLD `R1.30` | 逐 event candidate source + publication boundary flow。 |
| Operations Job | 8 | HLD `R1.32` | 逐 job run / resume / checkpoint / report flow。 |

### 5. 组成部分覆盖矩阵

| 组成部分 | Command | Query | Inbound | Outbound | Job |
|---|---:|---:|---:|---:|---:|
| 方法资产定义与目录 | 6 | 4 | 0 | 2 | 0 |
| 正式化与版本 | 6 | 6 | 0 | 4 | 0 |
| 受控消费 | 5 | 6 | 0 | 4 | 0 |
| 追溯与一致性保护 | 7 | 7 | 0 | 5 | 0 |
| 关系与分发语义 | 10 | 9 | 0 | 5 | 0 |
| 外部摘要与引用 | 9 | 8 | 4 | 5 | 0 |
| 后台维护与收敛 | 6 | 8 | 0 | 5 | 8 |
| 外围包与方法集组织 | 9 | 9 | 0 | 4 | 0 |

### 6. Shared Command Transaction Template

```text
[API entry]
  -> validate command protocol shell and runtime assembly summary
  -> build MethodAssetOperationContext from actor/source/metadata
  -> MethodAssetCommandService.<flow>(request, operation_context)

[Application command service]
  -> reserve idempotency through MethodAssetIdempotencyGuard / stored result family
  -> duplicate: load stored command surface and return without mutation
  -> load required truth/support/material through Step 7 repository family
  -> call Step 6 domain object / policy / helper
  -> rejected: assemble safe rejection / diagnostic, save stored rejected surface if required
  -> accepted: begin UnitOfWork
      -> save versioned truth/support/material with expected version
      -> append body-free history / trace / audit / lineage candidate when the object family owns it
      -> assemble event candidate summary, not publication delivery
      -> save stored accepted command result
      -> commit UnitOfWork
  -> return command response / effect summary
```

Command flow 不得在 accepted transaction 内执行 publisher delivery、handoff delivery、job body、transport retry、scheduler、queue 或 external raw body read。

### 7. Shared Query Read Template

```text
[API query entry]
  -> validate query protocol shell and runtime assembly summary
  -> build read context from actor/source/query metadata
  -> MethodAssetQueryService.<flow>(request, read_context)

[Application query service]
  -> resolve typed selector / read subject through repository lookup or read resolver
  -> load truth/view/material/progress page through Step 7 repository family
  -> copy visibility / boundary / freshness / availability marker from resolver / mapper
  -> found: assemble safe public view
  -> empty / safe absent: assemble safe empty surface
  -> not visible / stale / degraded / unavailable: copy formal marker and safe diagnostic
  -> return response without write UnitOfWork
```

Query flow 不得保存 material、修复 view、append trace/audit、创建 event candidate、启动 job、刷新 external summary 或写 stored result。

### 8. Shared Inbound Consumer Template

```text
[Worker entry]
  -> validate inbound envelope shell and runtime source binding summary
  -> MethodAssetInboundConsumerService.<flow>(envelope, worker_context)

[Application inbound service]
  -> reserve source dedup / idempotency
  -> duplicate: replay stored consumer receipt
  -> call MethodAssetInboundSourcePort for body-free source summary
  -> call ExternalBodyFreeSourceAdapterPort only for typed ref / marker resolution
  -> malformed / unsupported / rejected / delayed / quarantine: save safe receipt, no core truth mutation
  -> accepted: save intake summary / receipt / worker result
  -> return receipt / handoff hint;explicit Command must perform later truth mutation
```

Inbound consumer 不得直接创建 definition、formal version、relation、package、maintenance task 或任何 core truth。

### 9. Shared Outbound Candidate / Publication Template

```text
[Candidate assembly]
  -> accepted command / completed job / bounded intake emits body-free fact summary
  -> MethodAssetEventCandidateAssembly builds candidate with typed refs, markers, trace context
  -> candidate may be stored or handed to publication facade per Step 11/14 decision

[Publisher worker]
  -> load candidate shell, not current truth
  -> target registry resolves enabled / blocked / unavailable target summary
  -> MethodAssetEventCandidatePublisherPort publishes candidate boundary
  -> return published / blocked / unavailable / failed safe outcome
```

Publication failure does not roll back accepted truth. Publisher must not read current truth to reconstruct payload.

### 10. Shared Operations Job Template

```text
[Jobs entry]
  -> validate job shell and runtime assembly summary
  -> MethodAssetOperationsJobService.<flow>(job_request, job_context)

[Application job service]
  -> reserve job idempotency / resume key
  -> duplicate: replay stored job report / checkpoint / run history
  -> precheck runtime assembly and adapter availability
  -> load maintenance task truth
  -> load checkpoint / run history when resuming
  -> plan target batch through MethodAssetRefreshTargetPlannerPort
  -> process targets through repository / resolver / builder family
  -> record safe issue / partial / unavailable summary
  -> save progress, checkpoint, run history and stored job report
  -> return job response
```

Job flow 不得 create / modify / delete / repair core truth. Job only refreshes derived read materials, trace/audit/impact materials, external/peripheral read materials, or recovery convergence summaries.

### 10. Flow Card Columns

All subsequent flow card tables use the following compact schema:

| Column | Meaning |
|---|---|
| `Flow / entry` | Flow name and application facade label. |
| `Protocol / target` | Step 8 protocol shell and Step 6 object / helper target. |
| `Ports` | Step 7 port family used by the flow. |
| `Main path` | Accepted/read/run path summary. |
| `Branches` | duplicate/rejected/empty/degraded/blocked/partial handling. |
| `Side effects` | Candidate side effects only; concrete persistence remains Step 11. |
| `Test cut` | Minimal flow-level verification candidate for Step 16. |

### 11. Current Gate

| 检查项 | 结果 |
|---|---|
| 是否回退旧 completed 状态 | 是。 |
| 是否回退旧 Step 10 恢复点并重写 Step 9 | 是。 |
| 是否固定五类 inventory 数量 | 是。 |
| 是否写入 shared templates | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否推进 Step 10 | 否。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.28 Command shared template 与逐 flow 写入:先思考`;只允许写入 58 个 Command flow cards 和对应 stop-review;不得进入 Query / Inbound / Outbound / Job;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.28 Command shared template 与逐 flow 写入:再写入

### 1. Command flow batch scope

本批覆盖 HLD `R1.24` 的 58 个 Command。所有 Command 复用 `R9.27` shared command transaction template。下表中的 `entry` 是 application facade label,用于 Step 9 flow 讨论,不等于 Rust 函数签名、HTTP route 或 RPC name。

### 2. 方法资产定义与目录 Command flows

`commit-03-b` 只允许下列六条 definition/catalog flows 由 Step 7 `R7.10A` selector 触发。`MethodLibraryCommandShell.capability_kind` 必须为 `DefinitionCatalog`;`command_shell.boundary_ref.kind` 必须是 Step 6 `3B.1A` 六个 intent label 之一。该 label 唯一选择一个 flow / service input。选中后的 structured accepted fields 只能从 Step 6 `3B.1B` `MethodAssetDefinitionCatalogCommandSource` 的匹配 variant 复制。flow 不得从 route、RPC method、DTO type name、typed_refs 顺序、safe marker 文本、config key、fake private map 或 handler branch 推断目标 flow或字段。

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `EstablishMethodAssetDefinitionFlow` / `MethodAssetCommandService.establish_definition` | Command shell -> `MethodAssetDefinition` | definition repository;external summary repository;id / UoW / stored result | validate identity key;load accepted external summary refs;create definition;versioned save;stored accepted result | duplicate replays stored result;invalid external refs rejected with safe reason | definition history;definition changed event candidate;trace/audit candidate | accepted creates definition ref;duplicate does not create second definition |
| `AdjustMethodAssetDefinitionFlow` / `MethodAssetCommandService.adjust_definition` | Command shell -> existing `MethodAssetDefinition` | definition repository;basis / external summary repository;policy diagnostic builder;UoW / stored result | load definition with version;assert loaded definition is `Active`;load basis ref;apply adjustment;save with expected version | missing / stale version rejected;retired definition rejected or duplicate replay according to stored result | definition history;definition changed event candidate;audit candidate | stale expected version maps to safe rejection;retired definition must not be reactivated by adjust |
| `RetireMethodAssetDefinitionFlow` / `MethodAssetCommandService.retire_definition` | Command shell -> `MethodAssetDefinition` retirement | definition repository;UoW / stored result | load definition;assert loaded definition is `Active`;call `mark_retired(retirement_marker_ref)`;save expected version | missing / stale version rejected;already-retired replay uses stored result | retired history;definition changed event candidate | retirement must persist `MethodAssetDefinitionLifecycle::Retired`;`commit-03-b` does not inspect formal-version refs |
| `RegisterMethodAssetCatalogEntryFlow` / `MethodAssetCommandService.register_catalog_entry` | Command shell -> `MethodAssetCatalogEntry` | catalog repository;definition repository;id / UoW / stored result | load definition;check scoped catalog lookup;create catalog entry;save | duplicate replays;definition missing safe rejected | catalog history;catalog entry changed event candidate | cannot create catalog for missing definition |
| `ReclassifyMethodAssetCatalogEntryFlow` / `MethodAssetCommandService.reclassify_catalog_entry` | Command shell -> `MethodAssetCatalogEntry` | catalog repository;policy diagnostic builder;UoW / stored result | load catalog entry;apply scope / applicability change;save expected version | invalid scope rejected;duplicate replay | catalog history;catalog changed event candidate | reclassification preserves definition ref |
| `RetireMethodAssetCatalogEntryFlow` / `MethodAssetCommandService.retire_catalog_entry` | Command shell -> `MethodAssetCatalogEntry` retirement | catalog repository;definition repository;UoW / stored result | load catalog entry;assert loaded `catalog_status == Visible`;call `mark_retired(retirement_marker_ref)`;save expected version;assemble stored result | missing / stale / non-visible / already-retired rejected or duplicate replay | catalog retired history;catalog event candidate | catalog retirement persists `MethodAssetCatalogEntryStatus::Retired` and does not retire definition |

`commit-03-b` implementation carve-out: in the first two definition flows, "load accepted external summary refs" is limited to validating the already-closed `ExternalSourceSummaryRef` named wrappers carried by `ExternalSourceSummaryRefSet`. Durable `ExternalSourceSummaryRepository` reads, external source adapter calls, provider body checks, URL/path resolution and artifact/archive dereference remain `commit-07-a`. If `commit-03-b` implementation needs more than named-ref kind validation for external summaries, it must pause and return to design.

`commit-03-b` implementation carve-out: `RetireMethodAssetDefinitionFlow` does not inspect, list, resolve or reject on formal-version refs. Formal-version traceability / active-conflict checks belong to PH-04 formalization/version boundaries, where `FormalMethodAssetVersionRepository` callable surface is formally closed. Current-boundary implementation must not add a local formal-version repository call, fake map, typed-ref scan, stored-result lookup or catalog-derived surrogate to perform that check.

Selector failure branches for all six flows:

- Non-`DefinitionCatalog` command family returns safe unsupported-family rejected result and must not start UoW mutation.
- Unknown / missing / future `boundary_ref.kind` returns safe unsupported-intent rejected result and must not start UoW mutation.
- Shell selector and `MethodAssetDefinitionCatalogCommandSource` variant mismatch returns safe invalid-source rejected result and must not start UoW mutation.
- Missing required typed refs / safe markers for the selected input returns safe invalid-intent rejected result for that same selector; it must not fall through to another flow.
- Duplicate replay uses stored result for the same `(idempotency_key_ref,dedup_scope_ref,operation_digest_ref)` and selected intent label; digest mismatch returns stored safe conflict/rejection and never reruns mutation.

### 3. 正式化与版本 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `EvaluateMethodAssetFormalizationEligibilityFlow` / `MethodAssetCommandService.evaluate_formalization_eligibility` | Command shell -> `FormalizationState` diagnostic | definition / catalog / formalization repositories;basis resolver;policy diagnostic builder;stored result | load definition/catalog;resolve basis;build eligibility diagnostic;record decision summary when accepted | basis pending / insufficient rejected safely;duplicate replay | formalization decision event candidate;stored diagnostic result | pending basis does not create formal version |
| `InitiateMethodAssetFormalizationFlow` / `MethodAssetCommandService.initiate_formalization` | Command shell -> `FormalizationState` | definition / catalog repositories;formalization repository;basis resolver;UoW / stored result | load definition/catalog;resolve trigger and basis;create or update formalization state;save | unsupported trigger rejected;duplicate replay | formalization state history;formalization decision event candidate | initiation produces state ref but no version ref |
| `EstablishFormalMethodAssetVersionFlow` / `MethodAssetCommandService.establish_formal_version` | Command shell -> `FormalMethodAssetVersion` | formalization repository;formal version repository;basis repository;id / UoW / stored result | load formalization state;verify eligible state;create formal version;save versioned truth | ineligible / stale state rejected;duplicate replay | version established event candidate;version history;trace/audit candidate | accepted creates version only from eligible formalization |
| `RecordFormalVersionSemanticChangeFlow` / `MethodAssetCommandService.record_formal_version_semantic_change` | Command shell -> semantic change marker | formal version repository;basis repository;policy diagnostic builder;UoW / stored result | load current formal version;validate semantic change basis;record change summary / next candidate | missing basis / invalid change rejected | semantic change history;formal version changed event candidate | does not overwrite previous version meaning |
| `SupersedeFormalMethodAssetVersionFlow` / `MethodAssetCommandService.supersede_formal_version` | Command shell -> previous / next version pair | formal version repository;trace / audit family;UoW / stored result | load previous and next refs;validate pair;mark supersession relationship;save both or pairing owner | next missing / previous retired rejected | version changed event candidate;impact trigger candidate | previous ref remains readable after supersession |
| `RetireFormalMethodAssetVersionFlow` / `MethodAssetCommandService.retire_formal_version` | Command shell -> formal version retirement | formal version repository;consumption material repository;impact summary repository;UoW / stored result | load formal version;check traceability of existing consumption material;mark retired;save | active material policy conflict rejected if no retirement reason | retired event candidate;impact summary candidate | retirement does not delete consumption materials |

### 4. 受控消费 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `RegisterDownstreamConsumptionBoundaryFlow` / `MethodAssetCommandService.register_consumption_boundary` | Command shell -> `DownstreamConsumptionBoundary` | consumption material repository or boundary support family;policy diagnostic builder;UoW / stored result | validate context refs;record boundary summary;store support/material owner per Step 11 | invalid context rejected;duplicate replay | boundary changed event candidate;trace candidate | cannot use raw downstream id as context |
| `AdjustDownstreamConsumptionBoundaryFlow` / `MethodAssetCommandService.adjust_consumption_boundary` | Command shell -> boundary adjustment | consumption boundary / material family;policy diagnostic builder;stored result | load boundary owner;apply adjustment reason;save expected version | stale boundary rejected;duplicate replay | boundary changed event candidate | adjustment does not modify formal version truth |
| `PrepareMethodAssetConsumptionMaterialFlow` / `MethodAssetCommandService.prepare_consumption_material` | Command shell -> `MethodAssetConsumptionMaterial` | formal version repository;consumption material repository;availability resolver;policy diagnostic builder;UoW / stored result | load formal version;resolve context and boundary;prepare material;save with freshness source | retired version / constrained boundary rejected | material prepared event candidate;availability hint | accepted material only from formal version ref |
| `MarkMethodAssetConsumptionMaterialStateFlow` / `MethodAssetCommandService.mark_consumption_material_state` | Command shell -> material state marker | consumption material repository;availability resolver;degraded mapper;UoW / stored result | load material;copy formal state marker / reason;save material state | marker source missing -> stop/watch,not synthesize | availability changed event candidate | service cannot invent availability marker |
| `RecordDefinitionUseBoundaryViolationFlow` / `MethodAssetCommandService.record_definition_use_violation` | Command shell -> `DefinitionUseBoundaryGuard` violation | policy diagnostic builder;trace material repository;audit trail repository;stored result | validate guard ref and safe violation summary;record body-free violation line | raw request body rejected before save;duplicate replay | guard violation event candidate;audit / trace candidate | raw downstream payload never stored |

### 5. 追溯与一致性保护 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `OrganizeMethodAssetTraceMaterialFlow` / `MethodAssetCommandService.organize_trace_material` | Command shell -> `MethodAssetTraceMaterial` | trace material repository;definition/version/material repositories;evidence lineage repository;UoW / stored result | load referenced subjects;assemble body-free trace material;save with subject lookup | missing subject ref rejected or degraded per Step 12 | trace material changed event candidate | trace material contains refs,not raw logs |
| `MarkMethodAssetTraceMaterialStateFlow` / `MethodAssetCommandService.mark_trace_material_state` | Command shell -> trace material marker | trace material repository;degraded mapper;UoW / stored result | load trace material;copy formal marker/reason;save state marker | marker missing -> watch/stop | trace material changed event candidate | marker is copied from mapper/source |
| `RegisterConsumptionImpactSummaryFlow` / `MethodAssetCommandService.register_impact_summary` | Command shell -> `ConsumptionImpactSummary` | impact summary repository;formal version / material repositories;UoW / stored result | validate impact source ref;load affected refs;save impact summary | unknown impact preserved,not collapsed | impact summary changed event candidate | unknown impact remains explicit |
| `MarkConsumptionImpactDispositionFlow` / `MethodAssetCommandService.mark_impact_disposition` | Command shell -> impact disposition | impact summary repository;policy diagnostic builder;UoW / stored result | load summary;apply disposition marker;save | invalid disposition rejected;duplicate replay | impact event candidate;protection trigger candidate | no-effect cannot replace unknown |
| `EstablishConsistencyProtectionDecisionFlow` / `MethodAssetCommandService.establish_protection_decision` | Command shell -> `ConsistencyProtectionPolicy` decision | policy diagnostic builder;impact summary repository;trace repository;stored result | load inputs;build protection diagnostic;record decision summary | insufficient impact -> pending / rejected safe result | protection decision event candidate | decision does not execute recovery job |
| `OrganizeMethodAssetAuditTrailFlow` / `MethodAssetCommandService.organize_audit_trail` | Command shell -> `MethodAssetAuditTrail` | audit trail repository;trace / lineage repositories;UoW / stored result | load or create body-free audit trail owner;append safe history refs;save | raw audit payload rejected | audit trail changed event candidate | audit trail entry has no raw payload |
| `LinkMethodAssetEvidenceLineageFlow` / `MethodAssetCommandService.link_evidence_lineage` | Command shell -> `MethodAssetEvidenceLineage` | evidence lineage repository;external summary / artifact repositories;UoW / stored result | load external refs;link lineage refs;save | evidence body input rejected | evidence lineage changed event candidate | artifact archive body never loaded |

### 6. 关系与分发语义 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `EstablishMethodAssetRelationFlow` / `MethodAssetCommandService.establish_relation` | Command shell -> `MethodAssetRelation` | relation repository;definition/version repositories;policy diagnostic builder;UoW / stored result | load endpoint refs;evaluate relation inputs;create relation;save | endpoint missing rejected;duplicate replay | relation changed event candidate | no relation from marketplace id |
| `AdjustMethodAssetRelationFlow` / `MethodAssetCommandService.adjust_relation` | Command shell -> relation adjustment | relation repository;policy diagnostic builder;UoW / stored result | load relation;apply change;save expected version | stale relation rejected | relation history;relation changed event candidate | does not alter definition truth |
| `ConstrainMethodAssetRelationFlow` / `MethodAssetCommandService.constrain_relation` | Command shell -> scoped relation | relation repository;formal version / distribution context lookup;UoW / stored result | load relation;validate scope;apply constraint marker | invalid scope rejected | relation changed event candidate | constraint is not authorization policy |
| `SupersedeMethodAssetRelationFlow` / `MethodAssetCommandService.supersede_relation` | Command shell -> previous / next relation pair | relation repository;trace/audit family;UoW / stored result | load previous and next candidate;save supersession relation | missing next rejected | relation changed event candidate | previous remains historically readable |
| `RetireMethodAssetRelationFlow` / `MethodAssetCommandService.retire_relation` | Command shell -> relation retirement | relation repository;distribution builder / material family;stored result | load relation;mark retired;save | active distribution conflict handled via safe rejection/watch | relation changed;relation material invalidated candidate | does not delete distribution material |
| `EvaluateRelationIntegrityFlow` / `MethodAssetCommandService.evaluate_relation_integrity` | Command shell -> integrity diagnostic | relation repository;policy diagnostic builder;stored result | load relation/endpoints;build diagnostic;save decision summary if owner exists | insufficient refs rejected/pending | integrity changed event candidate | no graph algorithm body exposed |
| `MarkRelationIntegrityViolationFlow` / `MethodAssetCommandService.mark_relation_integrity_violation` | Command shell -> integrity violation marker | relation repository;policy diagnostic builder;stored result | load relation;copy safe violation reason;mark violation summary | raw rule details rejected | integrity changed event candidate | service cannot synthesize violation reason |
| `PrepareMethodAssetDistributionRefFlow` / `MethodAssetCommandService.prepare_distribution_ref` | Command shell -> `MethodAssetDistributionRef` | relation repository;distribution builder;package repository optional;stored result | load source refs;build distribution summary;save owning support material per Step 11 | marketplace body rejected | distribution ref changed candidate | no marketplace transaction involved |
| `AdjustMethodAssetDistributionContextFlow` / `MethodAssetCommandService.adjust_distribution_context` | Command shell -> distribution context | distribution builder;relation repository;stored result | load distribution source;validate context;record adjustment summary | context unresolved rejected | distribution ref changed candidate | does not expand consumption authorization |
| `MarkMethodAssetDistributionAvailabilityFlow` / `MethodAssetCommandService.mark_distribution_availability` | Command shell -> availability marker | distribution builder;availability resolver;degraded mapper;stored result | load distribution ref;copy availability marker;record state summary | marker missing -> watch/stop | distribution availability event candidate | no downstream sync state stored |

### 7. 外部摘要与引用 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `CaptureExternalSourceSummaryFlow` / `MethodAssetCommandService.capture_external_summary` | Command shell -> `ExternalSourceSummary` | external summary repository;external body-free adapter;body boundary diagnostic;UoW / stored result | validate external source ref;resolve body-free summary;save summary | raw body / invalid source rejected | external summary changed event candidate | raw provider payload rejected |
| `RegisterExternalSourceRefFlow` / `MethodAssetCommandService.register_external_source_ref` | Command shell -> `ExternalSourceRef` | external summary repository / ref support;external adapter;id / stored result | validate namespace/version/digest hints;register typed ref summary | free-form URL/path rejected | external source ref changed candidate | typed ref not string-concatenated |
| `RegisterArtifactArchiveRefFlow` / `MethodAssetCommandService.register_artifact_archive_ref` | Command shell -> `ArtifactArchiveRef` | external body-free adapter;external summary repository;evidence lineage repository;stored result | validate artifact kind/digest;record archive ref summary | archive body/path rejected | artifact archive ref changed candidate | no object storage path in public result |
| `AssertExternalBodyBoundaryFlow` / `MethodAssetCommandService.assert_external_body_boundary` | Command shell -> `ExternalBodyBoundaryRule` diagnostic | policy diagnostic builder;external adapter;stored result | evaluate candidate ref against body boundary rule;record assertion summary | body content rejected before diagnostic | body boundary violation candidate | rejected body is not persisted |
| `RejectExternalBodyCandidateFlow` / `MethodAssetCommandService.reject_external_body_candidate` | Command shell -> body boundary rejection | policy diagnostic builder;audit trail repository;stored result | validate candidate ref and safe reason;record rejection summary | missing safe reason rejected | boundary violation event candidate;audit candidate | payload excerpt never stored |
| `AcceptExternalBasisSummaryFlow` / `MethodAssetCommandService.accept_external_basis_summary` | Command shell -> basis acceptance | basis summary repository;external summary repository;stored result | load external summary;mark basis accepted summary;save | governance body missing not fetched | external summary changed candidate | no governance gate execution |
| `MarkExternalBasisDispositionFlow` / `MethodAssetCommandService.mark_external_basis_disposition` | Command shell -> basis disposition | basis summary repository;external summary repository;stored result | load basis/external summary;copy disposition marker;save | marker missing -> watch/stop | external summary changed candidate | does not alter formal version |
| `SupersedeExternalSourceSummaryFlow` / `MethodAssetCommandService.supersede_external_summary` | Command shell -> summary supersession | external summary repository;evidence lineage repository;stored result | load previous and next summaries;record supersession | next missing rejected | external summary changed candidate | old summary remains traceable |
| `LinkExternalEvidenceLineageFlow` / `MethodAssetCommandService.link_external_evidence_lineage` | Command shell -> external lineage | evidence lineage repository;external summary / artifact repositories;UoW / stored result | load external refs;link body-free lineage;save | evidence/report body rejected | external evidence lineage changed candidate | lineage has refs only |

### 8. 后台维护与收敛 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `RequestReadMaterialRefreshFlow` / `MethodAssetCommandService.request_read_material_refresh` | Command shell -> `ReadMaterialRefreshTask` | maintenance task repository;run history repository;id / UoW / stored result | create maintenance run/task request for read material refresh | duplicate replays;invalid scope rejected | maintenance requested event candidate;progress seed | command does not run job body |
| `RequestTraceMaterialRefreshFlow` / `MethodAssetCommandService.request_trace_material_refresh` | Command shell -> `TraceMaterialRefreshTask` | maintenance task repository;trace repository;run history;stored result | validate trace subject refs;create trace refresh task | raw log/evidence body rejected | maintenance requested candidate | no trace body stored |
| `RequestConsistencyRecoveryFlow` / `MethodAssetCommandService.request_consistency_recovery` | Command shell -> `ConsistencyRecoveryTask` | maintenance task repository;recovery issue repository;run history;stored result | create recovery task with affected refs and safe reason | repair algorithm body rejected | recovery requested candidate | no automatic truth repair |
| `MarkMaintenanceSuspendedFlow` / `MethodAssetCommandService.mark_maintenance_suspended` | Command shell -> maintenance run/task state marker | maintenance task repository;progress repository;run history;stored result | load run/task;copy suspension reason;save suspended marker | marker missing -> watch/stop | progress changed event candidate | suspension does not invalidate truth |
| `RequireMaintenanceFormalInterventionFlow` / `MethodAssetCommandService.require_formal_intervention` | Command shell -> `MethodAssetRecoveryIssue` | recovery issue repository;maintenance task repository;stored result | load recovery task;record formal intervention requirement | intervention ref missing rejected | recovery changed event candidate | no governance execution performed |
| `SupersedeMaintenanceRequestFlow` / `MethodAssetCommandService.supersede_maintenance_request` | Command shell -> maintenance run supersession | maintenance task repository;run history repository;stored result | load previous/next run refs;record supersession | next run missing rejected | maintenance progress changed candidate | does not replay worker task |

### 9. 外围包与方法集组织 Command flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `EstablishMethodPackageFlow` / `MethodAssetCommandService.establish_method_package` | Command shell -> `MethodPackage` | package repository;definition/version repositories;policy diagnostic builder;stored result | validate member refs;evaluate composition rule;create package | marketplace body rejected | package changed event candidate | package does not create definition |
| `AdjustMethodPackageCompositionFlow` / `MethodAssetCommandService.adjust_package_composition` | Command shell -> package composition | package repository;policy diagnostic builder;stored result | load package;validate member change;save expected version | stale package rejected | package/composition event candidate | member asset truth unchanged |
| `RetireMethodPackageFlow` / `MethodAssetCommandService.retire_method_package` | Command shell -> package retirement | package repository;assembly repository;stored result | load package;mark retired with replacement hint | active assembly conflict safe rejected/watch | package changed event candidate | package history remains |
| `MarkMethodPackageUnavailableFlow` / `MethodAssetCommandService.mark_package_unavailable` | Command shell -> package availability marker | package repository;degraded mapper;availability port;stored result | load package;copy unavailable marker;save | marker missing -> watch/stop | peripheral availability event candidate | core truth unaffected |
| `AssembleMethodSetFlow` / `MethodAssetCommandService.assemble_method_set` | Command shell -> `MethodSetAssembly` | assembly repository;package repository;consumption boundary resolver;stored result | validate package/member refs;create assembly | boundary violation rejected | method set changed candidate | no organization runtime config stored |
| `AdjustMethodSetAssemblyFlow` / `MethodAssetCommandService.adjust_method_set_assembly` | Command shell -> assembly adjustment | assembly repository;package repository;policy diagnostic builder;stored result | load assembly;validate change;save expected version | stale assembly rejected | method set changed candidate | does not expand consumption boundary |
| `RetireMethodSetAssemblyFlow` / `MethodAssetCommandService.retire_method_set_assembly` | Command shell -> assembly retirement | assembly repository;run history optional;stored result | load assembly;mark retired;save | replacement missing safe warning/rejected per Step 12 | assembly changed candidate | package truth unchanged |
| `MarkMethodSetAssemblyStaleOrUnavailableFlow` / `MethodAssetCommandService.mark_assembly_stale_or_unavailable` | Command shell -> assembly marker | assembly repository;degraded mapper;availability port;stored result | load assembly;copy stale/unavailable marker;save | marker missing -> watch/stop | peripheral availability event candidate | no refresh job execution |
| `EvaluatePackageCompositionFlow` / `MethodAssetCommandService.evaluate_package_composition` | Command shell -> `PackageCompositionRule` diagnostic | package / assembly repositories;policy diagnostic builder;stored result | load candidate package/assembly;build diagnostic;record result summary | invalid member refs rejected | composition result event candidate | no full rule algorithm exposed |

### 10. Command batch stop-review

| 检查项 | 结果 |
|---|---|
| 是否覆盖 58 个 Command | pass:6 + 6 + 5 + 7 + 10 + 9 + 6 + 9。 |
| 是否每个 Command 有 entry label | pass。 |
| 是否每个 Command 回指 Step 6 object / helper target | pass/watch:以 HLD / Step 6 对象族为来源,具体字段 schema 后移。 |
| 是否每个 Command 回指 Step 7 port family | pass/watch:使用 repository / resolver / mapper / stored result / UoW family,不写具体方法签名。 |
| 是否保持 duplicate replay 不重跑 mutation | pass/watch:stored result schema 后移 Step 13。 |
| 是否保持 Command 不执行 publisher / handoff / job body | pass。 |
| 是否修改正式 `03-详细设计.md` | no。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.29 Query shared template 与逐 flow 写入:先思考`;只允许写入 57 个 Query flow cards 和 stop-review;不得进入 Inbound / Outbound / Job;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.29 Query shared template 与逐 flow 写入:再写入

### 1. Query flow batch scope

本批覆盖 HLD `R1.26` 的 57 个 Query。所有 Query 复用 `R9.27` shared query read template。每条 Query 必须 no-write,只能复制 Step 7 repository / resolver / mapper / availability family 的 body-free输出。

### 2. 方法资产定义与目录 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetMethodAssetDefinitionSummaryFlow` / `MethodAssetQueryService.get_definition_summary` | Query shell -> definition summary | definition repository;query read resolver;degraded mapper | exact read definition;resolve read subject/freshness;assemble safe summary | missing -> safe absent;degraded marker copied | none | missing definition does not leak raw id |
| `ResolveMethodAssetDefinitionRefFlow` / `MethodAssetQueryService.resolve_definition_ref` | Query shell -> definition ref resolution | definition repository;catalog repository;read resolver | use identity query / catalog association;return typed ref summary | unresolved -> safe absent;ambiguous -> degraded/watch | none | route/path string cannot become ref |
| `GetMethodAssetCatalogEntryFlow` / `MethodAssetQueryService.get_catalog_entry` | Query shell -> catalog entry summary | catalog repository;definition repository;read resolver | exact read catalog entry;load linked definition safe ref;assemble summary | missing or definition mismatch -> degraded/safe absent | none | catalog read does not create entry |
| `ListMethodAssetCatalogViewFlow` / `MethodAssetQueryService.list_catalog_view` | Query shell -> catalog view page | catalog repository;page/version helper;read resolver | list by catalog scope;copy page cursor/freshness;assemble page | empty -> empty page;stale/unavailable marker copied | none | query does not refresh catalog view |

### 3. 正式化与版本 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetFormalizationStateFlow` / `MethodAssetQueryService.get_formalization_state` | Query shell -> `FormalizationState` summary | formalization repository;basis repository;read resolver | exact/current lookup;assemble state reason and basis refs | missing -> safe absent;stale marker copied | none | query does not advance state |
| `GetFormalMethodAssetVersionSummaryFlow` / `MethodAssetQueryService.get_formal_version_summary` | Query shell -> formal version summary | formal version repository;basis repository;read resolver | exact read version;include boundary/basis safe refs | retired readable;missing safe absent | none | no fingerprint/snapshot returned |
| `ResolveCurrentFormalMethodAssetVersionFlow` / `MethodAssetQueryService.resolve_current_formal_version` | Query shell -> current version ref | formal version repository;formalization repository;read resolver | lookup current by definition/catalog;copy freshness marker | no current -> empty/safe absent;conflict -> degraded | none | does not create current version |
| `GetFormalizationBasisSummaryFlow` / `MethodAssetQueryService.get_basis_summary` | Query shell -> basis summary | basis repository;external summary repository;read resolver | exact read basis summary;copy external refs | missing external -> degraded/watch | none | no standard/ADR body returned |
| `GetFormalizationEligibilityDiagnosticFlow` / `MethodAssetQueryService.get_eligibility_diagnostic` | Query shell -> diagnostic summary | basis resolver;policy diagnostic builder;definition/catalog repositories | load input refs;resolve basis;build diagnostic summary | insufficient basis -> pending diagnostic;unavailable marker copied | none | diagnostic has safe reason only |
| `ListFormalizationHistoryFlow` / `MethodAssetQueryService.list_formalization_history` | Query shell -> history page | formalization repository;formal version repository;page helper | list history by definition/version;assemble body-free page | empty page allowed;cursor opaque | none | no raw audit/event payload |

### 4. 受控消费 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetMethodAssetConsumptionMaterialFlow` / `MethodAssetQueryService.get_consumption_material` | Query shell -> consumption material | consumption material repository;availability resolver;read resolver | exact read material;resolve availability/boundary;assemble summary | stale/unavailable marker copied;missing safe absent | none | query never creates material |
| `GetMethodAssetAvailabilityViewFlow` / `MethodAssetQueryService.get_availability_view` | Query shell -> availability view | consumption material repository;availability resolver;degraded mapper | resolve material by version/context;copy availability summary | constrained/stale/unavailable copied | none | cache hit not truth |
| `ResolveConsumptionContextRefFlow` / `MethodAssetQueryService.resolve_consumption_context_ref` | Query shell -> context ref | query read resolver;availability resolver;boundary support family | resolve typed context from formal inputs;return safe ref | unresolved -> safe absent;raw id rejected | none | no route/runtime id synthesis |
| `GetDownstreamConsumptionBoundaryFlow` / `MethodAssetQueryService.get_consumption_boundary` | Query shell -> boundary summary | consumption material/boundary family;policy diagnostic builder | exact read or context lookup;assemble boundary summary | missing boundary -> safe absent/degraded per marker | none | no auth matrix returned |
| `GetDefinitionUseBoundaryDiagnosticFlow` / `MethodAssetQueryService.get_definition_use_diagnostic` | Query shell -> guard diagnostic | policy diagnostic builder;consumption material repository;read resolver | load guard/material/context;build diagnostic summary | invalid input rejected as safe diagnostic | none | no request payload body |
| `ListConsumableContextsForFormalVersionFlow` / `MethodAssetQueryService.list_consumable_contexts` | Query shell -> context page | consumption material repository;page helper;availability resolver | list contexts by formal version;copy page and availability hints | empty page;partial degraded marker copied | none | list does not prepare material |

### 5. 追溯与一致性保护 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetMethodAssetTraceMaterialFlow` / `MethodAssetQueryService.get_trace_material` | Query shell -> trace material | trace material repository;read resolver;degraded mapper | exact read trace material;assemble safe trace summary | missing -> safe absent;stale marker copied | none | no raw log returned |
| `GetTraceBySubjectFlow` / `MethodAssetQueryService.get_trace_by_subject` | Query shell -> trace page | trace material repository;page helper;read resolver | lookup/list by trace subject;assemble page | subject unresolved -> safe absent;partial item degraded | none | subject not parsed from string |
| `GetConsumptionImpactSummaryFlow` / `MethodAssetQueryService.get_impact_summary` | Query shell -> impact summary | impact summary repository;read resolver | exact read impact;assemble affected refs/disposition | missing safe absent;unknown preserved | none | unknown not folded to no-effect |
| `ListPendingConsumptionImpactsFlow` / `MethodAssetQueryService.list_pending_impacts` | Query shell -> pending impact page | impact summary repository;page helper;policy diagnostic builder | list pending/unknown by version/context;assemble page | empty page allowed;partial degraded marker copied | none | no downstream scan |
| `GetConsistencyProtectionDiagnosticFlow` / `MethodAssetQueryService.get_protection_diagnostic` | Query shell -> protection diagnostic | policy diagnostic builder;impact / trace repositories | load impact/protection inputs;build safe diagnostic | insufficient input -> pending diagnostic | none | no recovery execution |
| `GetMethodAssetAuditTrailFlow` / `MethodAssetQueryService.get_audit_trail` | Query shell -> audit trail page | audit trail repository;page helper;read resolver | exact/subject lookup;page safe audit entries | empty page;degraded item marker copied | none | no raw telemetry |
| `GetMethodAssetEvidenceLineageFlow` / `MethodAssetQueryService.get_evidence_lineage` | Query shell -> lineage summary | evidence lineage repository;external / artifact repositories;read resolver | exact/subject lookup;assemble external/artifact refs | missing linked artifact -> degraded/watch | none | no evidence body returned |

### 6. 关系与分发语义 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetMethodAssetRelationFlow` / `MethodAssetQueryService.get_relation` | Query shell -> relation summary | relation repository;read resolver | exact read relation;assemble endpoint refs | missing safe absent;retired readable | none | no graph algorithm output |
| `ListMethodAssetRelationsByEndpointFlow` / `MethodAssetQueryService.list_relations_by_endpoint` | Query shell -> relation page | relation repository;page helper;read resolver | list endpoint relations;copy cursor/freshness | empty page;partial degraded item | none | no recommendation ranking |
| `ListMethodAssetRelationsByFormalVersionFlow` / `MethodAssetQueryService.list_relations_by_formal_version` | Query shell -> version relation page | relation repository;formal version repository;page helper | validate version ref;list relation refs | missing version safe absent | none | no hash/fingerprint relation |
| `ListMethodAssetRelationsByDistributionContextFlow` / `MethodAssetQueryService.list_relations_by_distribution_context` | Query shell -> context relation page | relation repository;distribution builder;page helper | resolve distribution context;list relation/material summaries | unresolved context -> safe absent | none | no marketplace transaction state |
| `GetRelationIntegrityDiagnosticFlow` / `MethodAssetQueryService.get_relation_integrity_diagnostic` | Query shell -> integrity diagnostic | relation repository;policy diagnostic builder | load relation/rule;build diagnostic | insufficient refs -> pending diagnostic | none | no rule matrix exposed |
| `GetRelationChangeSummaryFlow` / `MethodAssetQueryService.get_relation_change_summary` | Query shell -> relation history page | relation repository;trace/audit family;page helper | list change summaries;assemble safe page | empty page;degraded item marker copied | none | no raw event payload |
| `ResolveMethodAssetDistributionRefFlow` / `MethodAssetQueryService.resolve_distribution_ref` | Query shell -> distribution ref summary | distribution builder;relation repository;read resolver | exact/lookup distribution ref;assemble availability marker | unavailable marker copied | none | no listing/install state |
| `GetDistributionReadMaterialFlow` / `MethodAssetQueryService.get_distribution_material` | Query shell -> distribution material | distribution builder;relation repository;availability resolver | load/build body-free material summary from refs | missing material -> safe absent/degraded | none | no package body |
| `ListDistributionReadMaterialsByContextFlow` / `MethodAssetQueryService.list_distribution_materials_by_context` | Query shell -> distribution material page | distribution builder;page helper;read resolver | list materials by context;assemble page | empty page;partial degraded marker copied | none | no search ranking |

### 7. 外部摘要与引用 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetExternalSourceSummaryFlow` / `MethodAssetQueryService.get_external_summary` | Query shell -> external summary | external summary repository;read resolver | exact read summary;assemble body-free view | missing safe absent;stale marker copied | none | no external body |
| `GetExternalSummaryBySourceRefFlow` / `MethodAssetQueryService.get_external_summary_by_source` | Query shell -> summary page | external summary repository;page helper;read resolver | lookup/list by external source ref;assemble page | empty page;unavailable marker copied | none | no URL/path reverse lookup |
| `ResolveExternalSourceRefFlow` / `MethodAssetQueryService.resolve_external_source_ref` | Query shell -> source ref summary | external summary repository;external adapter;read resolver | exact read typed source ref summary | unresolved safe absent | none | provider payload not exposed |
| `GetArtifactArchiveRefFlow` / `MethodAssetQueryService.get_artifact_archive_ref` | Query shell -> artifact ref summary | external adapter;evidence lineage repository;read resolver | load artifact ref summary;assemble digest/retention hints | missing artifact -> safe absent | none | no archive body/path |
| `GetExternalBodyBoundaryDiagnosticFlow` / `MethodAssetQueryService.get_external_body_boundary_diagnostic` | Query shell -> boundary diagnostic | policy diagnostic builder;external adapter | build body-free boundary diagnostic | candidate invalid -> rejected diagnostic | none | rejected body not returned |
| `GetExternalSourceSummaryViewFlow` / `MethodAssetQueryService.get_external_summary_view` | Query shell -> external summary view | external summary repository;availability resolver;read resolver | read summary view;copy freshness/body-free marker | stale/unavailable copied | none | view not summary truth |
| `GetExternalBasisAcceptanceHistoryFlow` / `MethodAssetQueryService.get_external_basis_acceptance_history` | Query shell -> acceptance history page | basis repository;external summary repository;page helper | list acceptance history;assemble safe page | empty page;partial degraded marker copied | none | no governance execution body |
| `GetExternalEvidenceLineageHintFlow` / `MethodAssetQueryService.get_external_evidence_lineage_hint` | Query shell -> evidence lineage hint | evidence lineage repository;external / artifact repositories | lookup lineage hints;assemble refs | missing linked refs -> degraded/watch | none | no report body |

### 8. 后台维护与收敛 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetMaintenanceProgressFlow` / `MethodAssetQueryService.get_maintenance_progress` | Query shell -> progress view | progress view repository;run history repository;read resolver | exact read progress view;assemble safe summary | missing safe absent;unavailable marker copied | none | no worker log |
| `GetMaintenanceProgressByRunFlow` / `MethodAssetQueryService.get_progress_by_run` | Query shell -> run progress summary | progress repository;run history repository | lookup by maintenance run;assemble task refs/history hints | run missing safe absent | none | run ref not job id |
| `GetMaintenanceProgressByScopeFlow` / `MethodAssetQueryService.get_progress_by_scope` | Query shell -> scope progress page | progress repository;page helper;read resolver | list progress by refresh scope;assemble page | empty page;partial degraded marker copied | none | no lock/retry token exposed |
| `GetReadMaterialRefreshTaskSummaryFlow` / `MethodAssetQueryService.get_read_refresh_task_summary` | Query shell -> read task summary | maintenance task repository;progress repository | exact read task;join progress marker | missing task safe absent | none | no refresh algorithm body |
| `GetTraceMaterialRefreshTaskSummaryFlow` / `MethodAssetQueryService.get_trace_refresh_task_summary` | Query shell -> trace task summary | maintenance task repository;trace repository;progress repository | exact read trace task;assemble subject refs/progress | missing refs degraded/watch | none | no raw log/report |
| `GetConsistencyRecoveryTaskSummaryFlow` / `MethodAssetQueryService.get_recovery_task_summary` | Query shell -> recovery task summary | maintenance task repository;recovery issue repository;run history | exact read recovery task;assemble issue/intervention hints | missing issue -> safe absent/degraded | none | no repair script |
| `GetMaintenanceRunHistoryFlow` / `MethodAssetQueryService.get_run_history` | Query shell -> run history page | run history repository;page helper | list run chronology;assemble markers | empty page;partial degraded marker copied | none | no metrics body |
| `ListPendingMaintenanceScopesFlow` / `MethodAssetQueryService.list_pending_maintenance_scopes` | Query shell -> pending scopes page | maintenance task repository;progress repository;page helper | list pending/stale/recovery-needed scopes | empty page allowed | none | pending does not invalidate truth |

### 9. 外围包与方法集组织 Query flows

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `GetMethodPackageFlow` / `MethodAssetQueryService.get_method_package` | Query shell -> package summary | package repository;read resolver | exact read package;assemble member refs | retired readable;missing safe absent | none | no package body/listing |
| `ListMethodPackagesFlow` / `MethodAssetQueryService.list_method_packages` | Query shell -> package page | package repository;page helper;availability resolver | list packages by scope/context;assemble availability markers | empty page;partial degraded | none | no marketplace ranking |
| `GetMethodPackageViewFlow` / `MethodAssetQueryService.get_method_package_view` | Query shell -> package view | package repository;peripheral discovery builder;read resolver | assemble view summary from package refs | stale/unavailable copied | none | view not truth |
| `GetMethodPackageCompositionDiagnosticFlow` / `MethodAssetQueryService.get_package_composition_diagnostic` | Query shell -> composition diagnostic | package repository;policy diagnostic builder | load package/rule;build diagnostic | invalid member refs -> pending/rejected diagnostic | none | no rule algorithm exposed |
| `GetMethodSetAssemblyFlow` / `MethodAssetQueryService.get_method_set_assembly` | Query shell -> assembly summary | assembly repository;package repository;read resolver | exact read assembly;assemble package/member refs | missing package degraded/watch | none | no UI/SDK config |
| `ListMethodSetAssembliesFlow` / `MethodAssetQueryService.list_method_set_assemblies` | Query shell -> assembly page | assembly repository;page helper;availability resolver | list by adoption/context filter;assemble page | empty page;partial degraded | none | no organization runtime state |
| `GetMethodSetAssemblyViewFlow` / `MethodAssetQueryService.get_assembly_view` | Query shell -> assembly view | assembly repository;peripheral discovery builder;read resolver | build body-free view summary | stale/unavailable copied | none | does not expand consumption boundary |
| `GetPeripheralDiscoveryContextFlow` / `MethodAssetQueryService.get_peripheral_discovery_context` | Query shell -> discovery context | marketplace context resolver;peripheral discovery builder;package/assembly repositories | resolve marketplace context summary;build discovery summary | marketplace unavailable -> unavailable marker | none | no listing/order/install data |
| `GetPackageAssemblyHistoryFlow` / `MethodAssetQueryService.get_package_assembly_history` | Query shell -> package/assembly history page | package repository;assembly repository;page helper | list history summaries;assemble safe page | empty page;partial degraded marker copied | none | no raw event payload |

### 10. Query batch stop-review

| 检查项 | 结果 |
|---|---|
| 是否覆盖 57 个 Query | pass:4 + 6 + 6 + 7 + 9 + 8 + 8 + 9。 |
| 是否每个 Query 有 entry label | pass。 |
| 是否保持 no-write | pass。 |
| 是否每个 Query 回指 Step 7 repository / resolver / mapper family | pass/watch。 |
| 是否避免 raw body / payload / report / marketplace transaction | pass。 |
| 是否把 marker / degraded / unavailable 写成复制正式来源 | pass/watch:具体 marker schema 后移 Step 10/12。 |
| 是否修改正式 `03-详细设计.md` | no。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.30 Inbound consumer 逐 flow 写入:先思考`;只允许写入 4 个 Inbound Consumer flow cards 和 stop-review;不得进入 Outbound / Job;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.30 Inbound consumer 逐 flow 写入:再写入

### 1. Inbound flow scope

本批覆盖 HLD `R1.28` 的 4 个 Inbound Event Consumer。Inbound 只承接 body-free external summary / source ref / artifact ref / violation fact,并输出 intake summary / receipt / worker result。后续若要改写本仓 truth,必须另走显式 Command。

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `ConsumeBodyFreeExternalSummaryAcceptedFlow` / `MethodAssetInboundConsumerService.consume_body_free_external_summary_accepted` | Inbound shell -> `MethodAssetInboundIntakeDecision` / external summary intake | inbound source port;external body-free adapter;external summary repository;stored result | validate envelope;dedup;resolve body-free summary;save intake receipt / summary | duplicate receipt replay;malformed / unsupported / raw body rejected | stored consumer receipt;external summary changed candidate;handoff hint optional | duplicate does not reprocess source event |
| `ConsumeExternalSourceRefRegisteredFlow` / `MethodAssetInboundConsumerService.consume_external_source_ref_registered` | Inbound shell -> external source ref intake | inbound source port;external body-free adapter;external summary repository;stored result | validate source ref envelope;dedup;record safe source ref intake summary | unresolved source -> rejected/delayed safe receipt | stored receipt;external source ref changed candidate | URL/path cannot become formal ref |
| `ConsumeArtifactArchiveRefRegisteredFlow` / `MethodAssetInboundConsumerService.consume_artifact_archive_ref_registered` | Inbound shell -> artifact archive ref intake | inbound source port;external adapter;evidence lineage repository;stored result | validate artifact ref/digest;dedup;record artifact ref intake | archive body/path rejected;duplicate replay | stored receipt;artifact archive ref changed candidate;lineage hint | archive payload never read |
| `ConsumeExternalBodyBoundaryViolationFlow` / `MethodAssetInboundConsumerService.consume_external_body_boundary_violation` | Inbound shell -> boundary violation intake | inbound source port;policy diagnostic builder;audit trail repository;stored result | validate candidate ref and safe reason;dedup;record violation intake receipt | missing safe reason rejected;duplicate replay | stored receipt;body boundary violation candidate;audit hint | rejected body excerpt not stored |

### 2. Inbound stop-review

| 检查项 | 结果 |
|---|---|
| 是否覆盖 4 个 Inbound Consumer | pass。 |
| 是否保持 body-free | pass。 |
| 是否 consumer 不直接创建 core truth | pass。 |
| 是否 duplicate 复制 stored receipt | pass/watch:receipt schema 后移 Step 13。 |
| 是否避免 topic / broker / ack / dead-letter 细节 | pass。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.31 Outbound event / publisher 逐 flow 写入:先思考`;只允许写入 34 个 Outbound Event flow cards 和 stop-review;不得进入 Job;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.31 Outbound event / publisher 逐 flow 写入:再写入

### 1. Outbound flow scope

本批覆盖 HLD `R1.30` 的 34 个 Outbound Event。每个 event flow 分为 candidate source 与 publication boundary。Candidate 来自 accepted command、completed job 或 bounded intake 的 body-free fact;publisher 只消费 candidate shell,不得重读 current truth。

### 2. Core asset / catalog event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodAssetDefinitionChangedPublicationFlow` | definition establish / adjust / retire accepted | event candidate assembly;publisher port;target registry | assemble candidate from definition ref/history;publish via target registry | target blocked/unavailable -> safe outcome only | candidate/outcome;worker result | publisher never loads definition body |
| `MethodAssetCatalogEntryChangedPublicationFlow` | catalog register / reclassify / retire accepted | event candidate assembly;publisher port;target registry | assemble catalog candidate with scope refs;publish safe outcome | publication failed no rollback | candidate/outcome | catalog view refresh not implied |

### 3. Formalization / version event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodAssetFormalizationDecisionChangedPublicationFlow` | eligibility / formalization command accepted | candidate assembly;publisher port | assemble decision candidate with state/basis refs | blocked/unavailable copied | candidate/outcome | no governance body in candidate |
| `FormalMethodAssetVersionEstablishedPublicationFlow` | formal version established | candidate assembly;publisher port | assemble version established candidate | failed publication no rollback | candidate/outcome | formal version truth remains accepted |
| `FormalMethodAssetVersionChangedPublicationFlow` | semantic change / supersession accepted | candidate assembly;publisher port | assemble previous/next refs candidate | target unavailable -> safe outcome | candidate/outcome | previous ref remains immutable |
| `FormalMethodAssetVersionRetiredPublicationFlow` | version retired | candidate assembly;publisher port | assemble retired candidate with reason ref | blocked safe outcome | candidate/outcome | does not trigger downstream state mutation |

### 4. Consumption / boundary event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodAssetConsumptionMaterialPreparedPublicationFlow` | consumption material prepared | candidate assembly;publisher port | assemble material ref/formal version/context candidate | publication failed no rollback | candidate/outcome | no material body in event |
| `MethodAssetConsumptionAvailabilityChangedPublicationFlow` | material marker / availability changed | candidate assembly;availability resolver;publisher port | copy availability marker into candidate | marker missing -> watch/stop | candidate/outcome | marker copied from resolver |
| `DownstreamConsumptionBoundaryChangedPublicationFlow` | boundary registered / adjusted | candidate assembly;publisher port | assemble boundary ref/context candidate | target blocked copied | candidate/outcome | no permission matrix |
| `DefinitionUseBoundaryViolationNoticedPublicationFlow` | guard violation recorded | candidate assembly;publisher port | assemble violation ref/safe reason candidate | unavailable safe outcome | candidate/outcome | raw request not published |

### 5. Trace / impact / audit event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodAssetTraceMaterialChangedPublicationFlow` | trace material organized / marked | candidate assembly;publisher port;handoff optional | assemble trace material ref candidate | handoff unavailable does not fail publication candidate | candidate/outcome/handoff hint | raw log excluded |
| `ConsumptionImpactSummaryChangedPublicationFlow` | impact summary registered/disposition changed | candidate assembly;publisher port | assemble impact ref/source/disposition candidate | blocked copied | candidate/outcome | no downstream runtime body |
| `ConsistencyProtectionDecisionChangedPublicationFlow` | protection decision established | candidate assembly;publisher port | assemble decision/protected context refs | failed publication no rollback | candidate/outcome | no recovery plan body |
| `MethodAssetAuditTrailChangedPublicationFlow` | audit trail organized | candidate assembly;publisher port;handoff optional | assemble audit trail ref candidate | handoff blocked safe outcome | candidate/outcome/handoff hint | no raw audit log |
| `MethodAssetEvidenceLineageChangedPublicationFlow` | lineage linked/superseded | candidate assembly;publisher port | assemble lineage/external refs candidate | unavailable copied | candidate/outcome | no evidence file body |

### 6. Relation / distribution event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodAssetRelationChangedPublicationFlow` | relation establish/adjust/constrain/supersede/retire | candidate assembly;publisher port | assemble relation refs/change kind | target blocked copied | candidate/outcome | no graph payload |
| `MethodAssetRelationIntegrityChangedPublicationFlow` | integrity evaluated/violation marked | candidate assembly;publisher port | assemble relation/rule/integrity marker | marker missing -> watch/stop | candidate/outcome | safe reason only |
| `MethodAssetDistributionRefChangedPublicationFlow` | distribution ref/context changed | candidate assembly;publisher port | assemble distribution/context refs | unavailable copied | candidate/outcome | no marketplace transaction |
| `MethodAssetDistributionAvailabilityChangedPublicationFlow` | distribution availability marker changed | candidate assembly;availability resolver;publisher port | copy availability marker into candidate | marker missing -> watch/stop | candidate/outcome | no downstream sync state |
| `MethodAssetRelationReadMaterialInvalidatedPublicationFlow` | relation/distribution source changed | candidate assembly;publisher port | assemble invalidation hint / refresh reason | publication failed no rollback | candidate/outcome;refresh hint | event does not execute refresh |

### 7. External summary / ref event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `ExternalSourceSummaryChangedPublicationFlow` | summary captured/accepted/rejected/superseded | candidate assembly;publisher port | assemble summary/source refs and marker | blocked/unavailable copied | candidate/outcome | no external body |
| `ExternalSourceRefChangedPublicationFlow` | source ref registered/changed | candidate assembly;publisher port | assemble source kind/version/digest hints | failed publication no rollback | candidate/outcome | no provider payload |
| `ArtifactArchiveRefChangedPublicationFlow` | artifact archive ref registered | candidate assembly;publisher port | assemble artifact ref/digest hint | target unavailable copied | candidate/outcome | no archive package |
| `ExternalBodyBoundaryViolationNoticedPublicationFlow` | body boundary violation noticed | candidate assembly;publisher port | assemble candidate ref/safe reason | blocked copied | candidate/outcome | no rejected body excerpt |
| `ExternalEvidenceLineageChangedPublicationFlow` | external lineage linked | candidate assembly;publisher port | assemble lineage/external/artifact refs | unavailable copied | candidate/outcome | no evidence body |

### 8. Maintenance / convergence event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodAssetMaintenanceRequestedPublicationFlow` | maintenance request command accepted | candidate assembly;publisher port | assemble run/scope/reason candidate | failed publication no rollback | candidate/outcome | no scheduler details |
| `MethodAssetReadMaterialRefreshChangedPublicationFlow` | read refresh job result | candidate assembly;publisher port | assemble task/run/freshness candidate | target blocked copied | candidate/outcome | no material body |
| `MethodAssetTraceMaterialRefreshChangedPublicationFlow` | trace refresh job result | candidate assembly;publisher port | assemble task/subject/partial marker candidate | marker missing -> watch/stop | candidate/outcome | no report body |
| `MethodAssetConsistencyRecoveryChangedPublicationFlow` | recovery job result | candidate assembly;publisher port | assemble recovery outcome/intervention hint | unavailable copied | candidate/outcome | no repair script |
| `MethodAssetMaintenanceProgressChangedPublicationFlow` | progress view changed | candidate assembly;publisher port | assemble progress marker/run refs | failed publication no rollback | candidate/outcome | no metrics body |

### 9. Peripheral organization event flows

| Flow / event | Candidate source | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `MethodPackageChangedPublicationFlow` | package command accepted | candidate assembly;publisher port | assemble package/member refs candidate | blocked copied | candidate/outcome | no package body/listing |
| `MethodSetAssemblyChangedPublicationFlow` | assembly command accepted | candidate assembly;publisher port | assemble assembly/package refs candidate | unavailable copied | candidate/outcome | no UI/SDK config |
| `PackageCompositionResultChangedPublicationFlow` | composition evaluation accepted | candidate assembly;publisher port | assemble composition marker/safe reason | marker missing -> watch/stop | candidate/outcome | no rule matrix |
| `PeripheralViewAvailabilityChangedPublicationFlow` | view availability/freshness changed | candidate assembly;availability resolver;publisher port | copy availability/freshness marker into candidate | marker missing -> watch/stop | candidate/outcome | core truth unchanged |

### 10. Outbound stop-review

| 检查项 | 结果 |
|---|---|
| 是否覆盖 34 个 Outbound Event | pass:2 + 4 + 4 + 5 + 5 + 5 + 5 + 4。 |
| 是否分离 candidate assembly 与 publisher outcome | pass。 |
| 是否 publisher 不重读 current truth | pass。 |
| 是否 publication failure 不回滚 accepted truth | pass。 |
| 是否避免 topic / payload schema / old outbox / delivery receipt | pass。 |
| 是否 marker / availability 只复制正式来源 | pass/watch。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.32 Operations Job 逐 flow 写入:先思考`;只允许写入 8 个 Operations Job flow cards 和 stop-review;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.32 Operations Job 逐 flow 写入:再写入

### 1. Job flow scope

本批覆盖 HLD `R1.32` 的 8 个 Operations Job。所有 job 复用 `R9.27` shared operations job template,并坚持 no core truth repair。

| Flow / entry | Protocol / target | Ports | Main path | Branches | Side effects | Test cut |
|---|---|---|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterialsFlow` / `MethodAssetOperationsJobService.refresh_catalog_and_definition_read_materials` | Job shell -> `ReadMaterialRefreshTask` | maintenance task repo;checkpoint store;target planner;definition/catalog repos;progress/run history | reserve job;load task/checkpoint;plan definition/catalog targets;refresh read materials;save progress/report | duplicate report replay;partial target failure records issue | progress/checkpoint/run history;read material refreshed event candidate | job does not modify definition/catalog truth |
| `RefreshFormalVersionReadMaterialsFlow` / `MethodAssetOperationsJobService.refresh_formal_version_read_materials` | Job shell -> formal version read materials | task repo;target planner;formal version repo;basis repo;checkpoint/progress | plan formal version targets;refresh version summaries/materials;save progress/report | missing basis -> partial/degraded issue | progress/checkpoint;formal read material event | no state transition or version creation |
| `RefreshConsumptionReadMaterialsFlow` / `MethodAssetOperationsJobService.refresh_consumption_read_materials` | Job shell -> consumption materials/views | task repo;consumption material repo;availability resolver;checkpoint/progress | plan material targets;copy availability/freshness;refresh read surfaces | boundary unavailable -> partial marker | progress;availability changed candidate | no boundary re-decision |
| `RefreshRelationDistributionMaterialsFlow` / `MethodAssetOperationsJobService.refresh_relation_distribution_materials` | Job shell -> relation/distribution materials | task repo;relation repo;distribution builder;target planner;checkpoint/progress | plan relation/distribution targets;build body-free read material;save progress | builder unavailable -> degraded issue | progress;relation material invalidated/refreshed candidate | no graph traversal truth repair |
| `RefreshExternalSummaryReadMaterialsFlow` / `MethodAssetOperationsJobService.refresh_external_summary_read_materials` | Job shell -> external summary views | task repo;external summary repo;external adapter;checkpoint/progress | plan external targets;resolve body-free availability;refresh summary view markers | adapter unavailable -> partial/unavailable issue | progress;external summary event candidate | no external body fetch |
| `RefreshTraceAuditImpactMaterialsFlow` / `MethodAssetOperationsJobService.refresh_trace_audit_impact_materials` | Job shell -> trace/audit/impact materials | task repo;trace/audit/impact/lineage repos;checkpoint/progress | plan trace subjects;refresh trace/audit/impact read materials;save report | missing lineage -> partial issue;duplicate replay | progress;trace material refresh event | no raw log/evidence body |
| `RunConsistencyRecoveryConvergenceFlow` / `MethodAssetOperationsJobService.run_consistency_recovery_convergence` | Job shell -> `ConsistencyRecoveryTask` | task repo;recovery issue repo;impact/protection repos;checkpoint/progress/run history | load recovery task;plan affected refs;evaluate convergence;save recovery summary/issues | formal intervention required -> issue,not repair;duplicate replay | recovery changed event;progress/checkpoint | no automatic core truth repair |
| `RefreshPeripheralReadMaterialsFlow` / `MethodAssetOperationsJobService.refresh_peripheral_read_materials` | Job shell -> peripheral read materials | task repo;package/assembly repos;peripheral discovery builder;marketplace resolver;checkpoint/progress | plan package/assembly targets;build body-free discovery/read views;save progress | marketplace unavailable -> peripheral unavailable marker | progress;peripheral availability event | no marketplace transaction/read body |

### 2. Job stop-review

| 检查项 | 结果 |
|---|---|
| 是否覆盖 8 个 Operations Job | pass。 |
| 是否全部归后台维护与收敛 | pass。 |
| 是否 no core truth repair | pass。 |
| 是否 duplicate / resume 依赖 stored report / checkpoint / run history | pass/watch:具体 schema 后移 Step 13。 |
| 是否 checkpoint / progress / report body-free | pass/watch:持久化细节后移 Step 11/15。 |
| 是否避免 scheduler / queue / retry / lease 细节 | pass。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.33 Cross-flow closure audit 与 handoff:先思考`;只允许写入跨 flow 审计、watch / blocker、Step 10~16 handoff;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.33 Cross-flow closure audit 与 handoff:再写入

### 1. Coverage audit

| Family | Expected | Covered | Result |
|---|---:|---:|---|
| Command | 58 | 58 | pass |
| Query | 57 | 57 | pass |
| Inbound Consumer | 4 | 4 | pass |
| Outbound Event | 34 | 34 | pass |
| Operations Job | 8 | 8 | pass |

### 2. Cross-flow closure audit

| Audit axis | Result | Notes / handoff |
|---|---|---|
| Command mutation boundary | pass/watch | Command writes only local truth/support/material/request/peripheral owner;exact state matrix remains Step 10。 |
| Query no-write | pass | All Query flows have `Side effects = none`;refresh is Job or Command request only。 |
| Inbound body-free | pass/watch | Inbound only records intake receipt/summary;truth mutation requires explicit Command;receipt schema remains Step 13。 |
| Outbound candidate vs publication | pass/watch | Candidate assembly and publisher outcome separated;candidate persistence remains Step 11/14。 |
| Job no core truth repair | pass | 8 jobs refresh derived materials/progress/recovery only。 |
| duplicate / replay source | watch | Command / Inbound / Job identify stored result / receipt / report / checkpoint;concrete serialization remains Step 13。 |
| marker copy-only | watch | Degraded/stale/unavailable/blocked markers always copied from resolver/mapper/availability;exact marker schema and branch semantics remain Step 10/12。 |
| page/cursor/version separation | pass/watch | Query page cursor, job checkpoint, optimistic version remain distinct;storage schema remains Step 11/13。 |
| body-free artifact/report boundary | pass | No flow returns external body, artifact package, evidence body, report body, raw log, metrics body, marketplace transaction。 |
| entry restriction | pass/watch | Entry labels call application facade;api/worker/jobs direct repository/adapter access remains Step 17 implementation handoff。 |

### 3. Watch ledger

| Watch ID | Topic | Required later closure | Owner Step |
|---|---|---|---|
| ML-D03-S9-WATCH-001 | Command stored accepted/rejected surface | Define stored command result / effect replay schema and save/get pairing。 | Step 11 / Step 13 |
| ML-D03-S9-WATCH-002 | Query marker sources | Formalize stale / degraded / unavailable / not-visible marker source per read family。 | Step 10 / Step 12 |
| ML-D03-S9-WATCH-003 | Inbound receipt replay | Define accepted / ignored / rejected / delayed / quarantine receipt schema and duplicate replay surface。 | Step 12 / Step 13 |
| ML-D03-S9-WATCH-004 | Event candidate persistence | Decide whether event candidate is persisted, and how publisher worker reloads candidate without current truth reconstruction。 | Step 11 / Step 14 |
| ML-D03-S9-WATCH-005 | Job checkpoint/report schema | Define checkpoint, progress, run history, report boundary, duplicate and resume replay source。 | Step 11 / Step 13 / Step 15 |
| ML-D03-S9-WATCH-006 | Exact state owner mapping | Turn flow state triggers into formal state matrices for definition/catalog/formalization/material/relation/external/maintenance/peripheral。 | Step 10 |
| ML-D03-S9-WATCH-007 | Safe diagnostic / public rejection | Define safe rejection, degraded, unavailable, blocked, partial branches with no raw error leakage。 | Step 12 |
| ML-D03-S9-WATCH-008 | Runtime binding and adapter availability | Bind runtime assembly, source, publisher, handoff, external adapter and marketplace context without config/key leakage。 | Step 14 |

### 4. No-blocker decision

本次 Step 9 重写没有发现必须回退 Step 6 / Step 7 / Step 8 的 hard blocker。所有未闭口项均属于 Step 10~16 的正常后续闭口范围,因为当前 Step 9 已明确:

- 对象 / helper 主语来自 Step 6。
- port / resolver / mapper / publisher / job seam 来自 Step 7。
- protocol family 和 public shell 来自 Step 8。
- Step 9 不试图补字段 schema、persistence schema、error schema、config key 或 test case schema。

若后续 Step 10~16 发现某个 watch 项无法通过现有 Step 6 / 7 / 8 来源闭合,必须暂停并回设计闭口,不得由实现侧自行补。

### 5. Step 10~16 handoff

| Step | Handoff content |
|---|---|
| Step 10 状态机 | 从每个 Command accepted/rejected、Query read disposition、Inbound intake result、Outbound publication outcome、Job progress/recovery result 抽取 state owner 和 transition matrix。 |
| Step 11 persistence / transaction | 定义 truth/support/material save,stored result,receipt/report,candidate,checkpoint,page cursor,run history persistence。 |
| Step 12 error / recovery | 定义 safe rejection、degraded、unavailable、blocked、partial、quarantine、delayed、formal intervention required。 |
| Step 13 concurrency / idempotency | 定义 Command / Inbound / Job duplicate replay,expected version conflict,checkpoint resume,stored result serialization。 |
| Step 14 config / dependency | 定义 runtime assembly slots,external adapter,publisher,handoff,target registry,marketplace context and availability binding。 |
| Step 15 observability / audit | 定义 safe diagnostic,trace/audit/handoff/progress observability,raw body redaction and report boundary。 |
| Step 16 test cuts | Convert flow-level test cut into contract / service / worker / job tests。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.34 正式 §8 候选草稿与最终停审:先思考`;只允许写入正式 §8 候选草稿和最终 completion gate;不得修改正式 `03-详细设计.md`;不得推进 Step 10。

---

## R9.34 正式 §8 候选草稿与最终停审:再写入

### 1. 正式 §8 候选草稿

本节仅作为 `projects/L3-method-library/03-详细设计.md` §8 的候选草稿来源,不直接修改正式文档。

#### §8.1 范围与边界

L3-method-library 的函数级处理流按 Command、Query、Inbound Consumer、Outbound Event / Publisher、Operations Job 五类展开。Command 是唯一业务写入口;Query 保持 no-write;Inbound 只做 body-free intake;Outbound 分 event candidate assembly 与 publisher outcome;Operations Job 只刷新派生材料、追溯材料、外围读取材料或推进 recovery convergence,不得修 core truth。

#### §8.2 Shared templates

- Command: entry shell -> operation context -> idempotency reserve -> load required refs -> domain/policy transition -> versioned save -> stored result -> response/effect summary。
- Query: entry shell -> read context -> resolver / repository / mapper -> safe view / page / empty / degraded / unavailable response;no write。
- Inbound: worker shell -> source dedup -> inbound source port -> intake decision -> receipt / worker result;no direct core truth mutation。
- Outbound: accepted fact / job result -> event candidate assembly -> target registry -> publisher port -> safe publication outcome。
- Job: job shell -> runtime availability -> task/checkpoint/run history -> target planner -> material refresh / recovery -> progress/checkpoint/report。

#### §8.3 Command flows

58 个 Command 已按八个组成部分逐项定义 flow card:

| 组成部分 | 覆盖 |
|---|---|
| 方法资产定义与目录 | establish / adjust / retire definition;register / reclassify / retire catalog entry。 |
| 正式化与版本 | eligibility、formalization initiation、formal version establish/change/supersede/retire。 |
| 受控消费 | consumption boundary、material preparation、material marker、definition-use violation。 |
| 追溯与一致性保护 | trace material、impact summary、protection decision、audit trail、evidence lineage。 |
| 关系与分发语义 | relation lifecycle、integrity、distribution ref/context/availability。 |
| 外部摘要与引用 | external summary/ref/artifact/body-boundary/basis/lineage。 |
| 后台维护与收敛 | maintenance request/suspension/intervention/supersession。 |
| 外围包与方法集组织 | package / method set lifecycle、availability、composition evaluation。 |

#### §8.4 Query flows

57 个 Query 已按八个组成部分逐项定义 no-write flow card。所有 Query 必须从 repository / resolver / mapper / availability family 复制 safe surface,不得刷新 material、修复 truth、append trace/audit、创建 event candidate 或启动 job。

#### §8.5 Inbound consumer flows

4 个 Inbound Consumer 全部归外部摘要与引用:

- `ConsumeBodyFreeExternalSummaryAccepted`
- `ConsumeExternalSourceRefRegistered`
- `ConsumeArtifactArchiveRefRegistered`
- `ConsumeExternalBodyBoundaryViolation`

它们只产生 intake summary、stored receipt、worker result 和后续显式 Command / audit / event candidate 的安全线索。

#### §8.6 Outbound event / publisher flows

34 个 Outbound Event 均为 body-free fact candidate。Publisher flow 只能读取 candidate shell 与 target registry outcome,不得重读 current truth 构造 payload。Publication failure 只生成 safe outcome,不得回滚 accepted truth。

#### §8.7 Operations job flows

8 个 Operations Job 全部归后台维护与收敛:

- `RefreshCatalogAndDefinitionReadMaterials`
- `RefreshFormalVersionReadMaterials`
- `RefreshConsumptionReadMaterials`
- `RefreshRelationDistributionMaterials`
- `RefreshExternalSummaryReadMaterials`
- `RefreshTraceAuditImpactMaterials`
- `RunConsistencyRecoveryConvergence`
- `RefreshPeripheralReadMaterials`

Job 输出为 body-free progress、checkpoint、run history、report boundary、issue refs 和 event candidates;不得创建或修复 core truth。

#### §8.8 Cross-flow guardrails

| Guardrail | Rule |
|---|---|
| no old source | 不恢复旧 `MethodContent`、publish、snapshot、fingerprint、old outbox、P0/P1。 |
| marker copy-only | public marker 只能复制 resolver / mapper / availability / progress / target registry 输出。 |
| duplicate replay | Command / Inbound / Job duplicate 只能复制 stored result / receipt / report / checkpoint。 |
| page/cursor/version separation | Query page cursor、job checkpoint、optimistic version 不得混用。 |
| body-free | external body、artifact body、evidence body、report body、raw log、marketplace transaction 不入 flow surface。 |
| phase boundary | Step 9 不写状态矩阵、persistence schema、error schema、config key、test case schema。 |

### 2. Completion checklist

| 检查项 | 结果 |
|---|---|
| `R9.27` 是否回退旧 completed 并重建 inventory / templates | pass |
| `R9.28` 是否覆盖 58 个 Command | pass |
| `R9.29` 是否覆盖 57 个 Query | pass |
| `R9.30` 是否覆盖 4 个 Inbound Consumer | pass |
| `R9.31` 是否覆盖 34 个 Outbound Event | pass |
| `R9.32` 是否覆盖 8 个 Operations Job | pass |
| `R9.33` 是否完成 cross-flow audit / watch / handoff | pass |
| 是否修改正式 `03-详细设计.md` | no |
| 是否推进 Step 10 | no |

### 3. Compact baseline gate

本批完成的是 Step 9 compact baseline:已经覆盖逐 flow card,但尚未达到 L1-governance 的函数级执行序列密度。后续 `R9.35`~`R9.44` 继续补全为 L1 粒度,因此本 gate 不再作为最终 Step 9 完成依据。

当前文件状态被后续批次覆盖为:

```text
current_status = superseded_by_l1_granularity_completion
current_module = R9.34 正式 §8 候选草稿与 compact baseline 停审:再写入
next_allowed_action = 继续 Step 9 R9.35 L1 粒度补全开工与扩写模板:再写入
formal_03_detail_design_modified = no
```

next_allowed_action: 继续 Step 9 `R9.35 L1 粒度补全开工与扩写模板:再写入`;只允许补全 Step 9 中间产物粒度;不得修改正式 `03-详细设计.md`;不得写 persistence schema、config key、test case schema、implementation code 或进入 Step 10。

---

## R9.35 L1 粒度补全开工与扩写模板:再写入

### 1. 补全原因

`R9.27`~`R9.34` 已经解决旧版 Step 9 只到 family-level 的问题,但它仍主要是一行式 compact flow card。与 L1-governance Step 9 对比后,差距集中在:

| 维度 | compact baseline | L1 粒度要求 |
|---|---|---|
| flow 展开 | 每条 flow 一行表格。 | 每条 flow 至少有执行序列、分支、审查项和禁止绕路。 |
| port 使用 | 多数只写 repository / resolver family。 | 必须说明调用顺序、version / UoW / stored result / read decision 来源。 |
| 分支 | 多数写 rejected / degraded / watch。 | 必须明确 duplicate、not found、stale/unavailable、partial、body boundary 的安全 surface。 |
| 可落码性 | 仍需实现端二次拆解。 | 实施 agent 能按 flow overlay 编码,遇缺口只记录 blocker。 |

因此 `R9.34` 只能作为 compact baseline,不能作为最终进入 Step 10 的依据。本批开始补全 `R9.35`~`R9.44`,目标是让 Step 9 达到 L1-governance 的函数级处理流密度。

### 2. 统一补全模板

后续 overlay 使用以下列。由于 Step 7 当前刻意保持 port family / seam 粒度,本 Step 不发明具体 trait 方法签名,而以 formal port family、对象主语和禁止捷径闭口。

| Column | Meaning |
|---|---|
| `Flow` | 当前 Step 8 / HLD 已列的 flow 名称。 |
| `Function-level sequence` | 可落码执行顺序,包含 entry、context、idempotency / read decision、load、domain/policy、save/result。 |
| `Formal sources` | Step 6 object/helper、Step 7 port family、Step 8 protocol shell 来源。 |
| `Branch / replay surface` | duplicate、rejected、missing、degraded、unavailable、partial 或 blocked 的安全返回口径。 |
| `Review gate` | 本 flow 禁止实现端自行补的 schema / marker / version / body / side effect。 |

### 3. Shared command execution overlay

```text
[API command entry]
  | validate Command shell, actor/source metadata, idempotency key and runtime availability summary
  | build MethodAssetOperationContext
  v
[Application command facade]
  | call MethodAssetIdempotencyGuard family
  | duplicate -> load MethodAssetStoredOperationResult and return stored safe surface
  | conflict -> return safe conflict / rejected surface;no domain mutation
  | load required truth/support/material with formal typed refs and expected version source
  | call Step 6 object factory / transition / policy helper
  | rejected -> store safe rejected result when the protocol requires replay;no side effect beyond stored rejection
  | accepted -> begin UnitOfWork
      | save changed truth/support/material with expected version
      | append body-free history / trace / audit / lineage only when object family owns it
      | assemble event candidate refs / maintenance hint / audit refs
      | save MethodAssetStoredOperationResult
      | complete idempotency guard
      | commit UnitOfWork
```

Command 不得执行 publisher delivery、handoff delivery、job body、scheduler、external raw body fetch、query refresh、persistence schema decision 或 config binding。

### 4. Shared query execution overlay

```text
[API query entry]
  | validate Query shell, actor/source metadata, page / selector / typed refs
  | build MethodAssetOperationContext in query channel
  v
[Application query facade]
  | assert no-write
  | resolve read subject / scope / visibility / freshness through MethodAssetQueryReadResolverPort or loaded formal view source
  | load truth/view/material/progress page through repository family
  | assemble MethodAssetReadDecision and public read surface
  | missing -> safe absent / empty page
  | denied -> not-visible body-free surface
  | stale / unavailable / degraded -> copy marker from resolver / mapper / availability source
  | return response without UnitOfWork write
```

Query 不得创建 material、save view、append trace/audit、reserve command idempotency、publish event、start job、call external raw adapter 或 infer marker from string/error text。

### 5. Shared inbound execution overlay

```text
[Worker inbound entry]
  | validate inbound envelope, source identity, schema version, dedup key and body-free constraint
  | build worker operation context
  v
[Application inbound facade]
  | reserve inbound idempotency / source dedup
  | duplicate -> return stored consumer receipt
  | unsupported / malformed / raw body present -> store safe rejected/ignored receipt
  | resolve source summary / typed ref through MethodAssetInboundSourcePort and ExternalBodyFreeSourceAdapterPort
  | accepted -> save intake summary / safe receipt / optional event candidate hint
  | return receipt;do not create core truth
```

Inbound 不得把外部事件直接变成本仓 definition / formal version / relation / package truth。

### 6. Shared outbound execution overlay

```text
[Candidate source]
  | accepted command / completed job / bounded inbound intake exposes body-free fact summary
  v
[Event candidate assembly]
  | copy typed refs, safe markers, trace context and target hint from stored fact
  | never reload current truth to rebuild payload
  v
[Publisher facade]
  | resolve target through target registry / availability family
  | publish candidate through publisher port
  | store or return safe outcome per later Step 11 / 14 decision
```

Outbound 不定义 topic、transport payload schema、retry、dead letter、old outbox relay 或 delivery receipt body。

### 7. Shared operations job execution overlay

```text
[Job entry]
  | validate job shell, task/run/scope refs, runtime availability and checkpoint request
  | build job operation context
  v
[Application job facade]
  | reserve job idempotency
  | duplicate -> return stored job report
  | load task / checkpoint / progress / target batch through Step 7 job families
  | for each target: read committed truth/material only through formal repository/planner
  | write derived read material / progress / checkpoint / recovery issue only
  | partial failure -> record safe issue / partial report
  | save stored job report and complete idempotency
```

Job 不得 repair core truth、create formal version、modify relation truth、copy external body、read marketplace transaction or hide partial failure in success counters。

### 8. R9.35 stop-review

| 检查项 | 结果 |
|---|---|
| 是否保留 161 个 flow 覆盖基线 | pass |
| 是否把 R9.34 降级为 compact baseline | pass |
| 是否建立 L1 粒度补全模板 | pass |
| 是否新增具体 port 方法签名 / schema / config / test case | no |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.36 58 个 Command 的函数级执行 overlay:再写入`;只允许补全 Command flow 执行序列和审查项;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.36 58 个 Command 的函数级执行 overlay:再写入

### 1. Command overlay scope

本批不替代 `R9.28` 的 58 个 compact flow card,而是在其上追加可落码执行 overlay。所有 Command 都复用 `R9.35` shared command execution overlay。

### 2. 方法资产定义与目录 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `EstablishMethodAssetDefinitionFlow` | entry validates definition summary and optional catalog hint -> build replay envelope -> lookup duplicate by `(idempotency_key_ref,dedup_scope_ref)` -> if no replay, call `MethodAssetDefinitionCatalogSupportRefFactory.new_definition_ref(...)` -> create `MethodAssetDefinition` with lifecycle `Active` -> UoW save definition -> append definition history / event candidate / stored result -> commit | `MethodAssetDefinition`;definition repository;support ref factory;external summary repository;stored result;UoW | duplicate returns stored accepted surface;invalid external ref rejected body-free | no `MethodContent`;no raw external body;definition ref only from current-boundary support ref factory |
| `AdjustMethodAssetDefinitionFlow` | reserve -> load definition with version -> assert lifecycle `Active` -> load basis/external summary refs -> apply adjustment summary -> save with expected version -> record history/effect/stored result | definition repository;basis/external support;policy diagnostic builder | stale version safe rejected;missing definition safe rejected;retired definition safe rejected or duplicate replay | no direct formal version mutation;no raw audit log;no adjust-after-retire |
| `RetireMethodAssetDefinitionFlow` | reserve -> load definition -> assert lifecycle `Active` -> domain retire with safe marker -> save expected version -> stored result/effect | definition repository;UoW / stored result | missing/stale definition safe rejected;already-retired replay uses stored result | `commit-03-b` does not inspect formal version refs;truth must persist `Retired` lifecycle |
| `RegisterMethodAssetCatalogEntryFlow` | reserve -> load definition -> check catalog scope lookup -> if no replay and no existing scoped entry, call `MethodAssetDefinitionCatalogSupportRefFactory.new_catalog_entry_ref(...)` -> create catalog entry with copied classification/applicability -> save -> event candidate/stored result | catalog repository;definition repository;support ref factory;UoW | definition missing rejected;duplicate replay;existing scoped entry safe rejected/replayed per stored result | catalog view/search index cannot be truth source;catalog entry ref only from current-boundary support ref factory |
| `ReclassifyMethodAssetCatalogEntryFlow` | reserve -> load catalog entry with version -> validate new scope via policy diagnostic -> apply reclassification -> save expected version -> stored result | catalog repository;policy diagnostic builder | invalid scope rejected;stale version conflict surface | no formalization side effect |
| `RetireMethodAssetCatalogEntryFlow` | reserve -> load catalog entry -> assert `catalog_status == Visible` -> mark retired with `MethodLibrarySafeMarker` -> save expected version -> stored result/effect | catalog repository;definition repository optional | missing / stale / non-visible / already-retired rejected or duplicate replay | retiring catalog persists `Retired` on catalog entry and does not retire definition |

`commit-03-b` catalog-retirement implementation closure: Step 10 internal `Registered` maps to Rust-facing `MethodAssetCatalogEntryStatus::Visible`. Register creates `Visible`, reclassify requires/preserves `Visible`, and retire requires `Visible` then persists `Retired` through `MethodAssetCatalogEntry.mark_retired(retirement_marker_ref: MethodLibrarySafeMarker)`. `Pending`, `Hidden` and `Deprecated` are valid enum labels but are not generated by these six current accepted service flows;when loaded by `reclassify_catalog_entry` or `retire_catalog_entry` they must be safe rejected or duplicate-replayed, not silently treated as `Registered`. Implementation must not use `mark_deprecated`, repository private status maps, stored-result kind, search visibility, route text, config value or raw reason strings as the retirement transition.

### 3. 正式化与版本 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `EvaluateMethodAssetFormalizationEligibilityFlow` | reserve -> load definition/catalog/basis refs -> call basis resolver and policy diagnostic builder -> create eligibility diagnostic result -> save stored result / optional formalization state summary | `FormalizationState`;basis resolver;policy diagnostic builder;stored result | insufficient basis -> pending/rejected diagnostic;duplicate replay | diagnostic cannot create formal version |
| `InitiateMethodAssetFormalizationFlow` | reserve -> load definition/catalog -> resolve trigger/basis -> create or update `FormalizationState` -> save expected version -> event candidate/stored result | formalization repository;basis resolver;definition/catalog repository | unsupported trigger rejected;duplicate replay | no governance execution body |
| `EstablishFormalMethodAssetVersionFlow` | reserve -> load formalization state and basis summary -> verify eligible -> create `FormalMethodAssetVersion` -> save version truth -> stored accepted/effect | formalization repository;formal version repository;basis repository;IdGenerator | ineligible/stale state rejected;duplicate replay | no version from fingerprint/snapshot/latest timestamp |
| `RecordFormalVersionSemanticChangeFlow` | reserve -> load formal version -> validate semantic change basis -> append semantic change summary -> save expected version -> stored result | formal version repository;basis repository;policy diagnostic builder | missing basis rejected;invalid semantic change safe rejected | cannot overwrite previous version meaning |
| `SupersedeFormalMethodAssetVersionFlow` | reserve -> load previous and next versions -> validate pair -> save supersession owner/pairing -> stored result and impact hint | formal version repository;trace/audit family | missing next/previous rejected;duplicate replay | previous version remains readable |
| `RetireFormalMethodAssetVersionFlow` | reserve -> load version -> inspect consumption material / impact refs -> mark retired with reason -> save expected version -> stored result | formal version repository;consumption material repository;impact summary repository | active material conflict rejected if no reason | no deletion of consumption material or version history |

### 4. 受控消费 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `RegisterDownstreamConsumptionBoundaryFlow` | reserve -> validate consumption context and boundary refs -> build boundary support summary -> save support/material owner -> stored result | consumption material/boundary family;policy diagnostic builder | invalid context rejected;duplicate replay | raw downstream id cannot become context ref |
| `AdjustDownstreamConsumptionBoundaryFlow` | reserve -> load boundary owner -> validate adjustment reason -> save expected version -> stored result/effect | boundary/material family;policy diagnostic builder | stale boundary rejected | adjustment cannot mutate formal version |
| `PrepareMethodAssetConsumptionMaterialFlow` | reserve -> load formal version -> resolve context/boundary availability -> create consumption material -> save material with freshness/source marker -> stored result | formal version repository;consumption material repository;availability resolver | retired version/constrained boundary rejected | query must not prepare material |
| `MarkMethodAssetConsumptionMaterialStateFlow` | reserve -> load material -> copy availability/state marker from resolver/mapper -> save material state -> stored result | consumption material repository;availability resolver;degraded mapper | missing marker becomes watch/blocker;duplicate replay | service cannot synthesize availability marker |
| `RecordDefinitionUseBoundaryViolationFlow` | reserve -> validate guard ref and safe violation reason -> record body-free violation line -> stored result/audit hint | policy diagnostic builder;trace material/audit repository | raw request body rejected before save | no downstream payload stored |

### 5. 追溯与一致性保护 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `OrganizeMethodAssetTraceMaterialFlow` | reserve -> load referenced subjects -> assemble body-free trace material -> save material -> event candidate/stored result | trace material repository;definition/version/material repositories;evidence lineage repository | missing subject rejected or degraded per Step 12 | no raw logs/evidence body |
| `MarkMethodAssetTraceMaterialStateFlow` | reserve -> load trace material -> copy marker/reason -> save state marker -> stored result | trace material repository;degraded mapper | marker missing watch/blocker | marker copied only |
| `RegisterConsumptionImpactSummaryFlow` | reserve -> validate impact source -> load affected refs -> save impact summary -> event candidate | impact summary repository;formal version/material repository | unknown impact remains explicit;duplicate replay | unknown cannot become no-effect |
| `MarkConsumptionImpactDispositionFlow` | reserve -> load impact summary -> apply disposition marker -> save expected version -> stored result | impact summary repository;policy diagnostic builder | invalid disposition rejected | no downstream scan |
| `EstablishConsistencyProtectionDecisionFlow` | reserve -> load impact/protection inputs -> build diagnostic -> store decision summary -> event candidate | policy diagnostic builder;impact summary repository;trace repository | insufficient input -> pending/rejected safe result | decision does not run recovery |
| `OrganizeMethodAssetAuditTrailFlow` | reserve -> load or create audit trail subject through formal subject source -> append safe history refs -> save -> stored result | audit trail repository;trace/lineage repositories | raw audit payload rejected | audit identity cannot be from log string |
| `LinkMethodAssetEvidenceLineageFlow` | reserve -> load external/artifact refs -> link lineage refs -> save -> stored result | evidence lineage repository;external/artifact repository | body/path input rejected | lineage has refs only |

### 6. 关系与分发语义 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `EstablishMethodAssetRelationFlow` | reserve -> load endpoint definition/version refs -> evaluate relation inputs -> create relation -> save -> event/stored result | relation repository;definition/version repositories;policy diagnostic builder | endpoint missing rejected | no relation from marketplace id |
| `AdjustMethodAssetRelationFlow` | reserve -> load relation with version -> apply adjustment -> save expected version -> stored result | relation repository;policy diagnostic builder | stale relation rejected | definition truth unchanged |
| `ConstrainMethodAssetRelationFlow` | reserve -> load relation -> validate formal scope/context -> copy constraint marker -> save -> stored result | relation repository;formal version/distribution support | invalid scope rejected | not an authorization expansion |
| `SupersedeMethodAssetRelationFlow` | reserve -> load previous/next relation -> validate pair -> save supersession -> stored result | relation repository;trace/audit family | next missing rejected | previous remains readable |
| `RetireMethodAssetRelationFlow` | reserve -> load relation -> inspect distribution material conflicts -> retire relation -> save -> event/stored result | relation repository;distribution builder/material family | active distribution conflict rejected/watch | no material deletion |
| `EvaluateRelationIntegrityFlow` | reserve -> load relation/endpoints -> build integrity diagnostic -> store decision summary when owner exists -> stored result | relation repository;policy diagnostic builder | insufficient refs pending/rejected | no graph algorithm body exposed |
| `MarkRelationIntegrityViolationFlow` | reserve -> load relation -> copy violation marker/safe reason -> save violation summary -> stored result | relation repository;policy diagnostic builder | raw rule details rejected | cannot synthesize violation reason |
| `PrepareMethodAssetDistributionRefFlow` | reserve -> load relation/source/package refs -> build distribution summary -> save support material -> stored result | relation repository;distribution builder;package repository | marketplace body rejected | no transaction/listing state |
| `AdjustMethodAssetDistributionContextFlow` | reserve -> load distribution source -> validate context -> save adjustment summary -> stored result | distribution builder;relation repository | unresolved context rejected | no consumption authorization expansion |
| `MarkMethodAssetDistributionAvailabilityFlow` | reserve -> load distribution ref -> copy availability marker -> record state summary -> stored result | distribution builder;availability resolver;degraded mapper | marker missing watch/blocker | no downstream sync state |

### 7. 外部摘要与引用 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `CaptureExternalSourceSummaryFlow` | reserve -> validate external source ref -> call body-free adapter summary -> save `ExternalSourceSummary` -> stored result/event | external summary repository;external body-free adapter;body boundary diagnostic | raw body/invalid source rejected | provider payload never stored |
| `RegisterExternalSourceRefFlow` | reserve -> validate namespace/version/digest hints -> register typed ref summary -> stored result | external summary/ref support;external adapter | free-form URL/path rejected | typed ref not string concatenated |
| `RegisterArtifactArchiveRefFlow` | reserve -> validate artifact kind/digest -> record archive ref summary -> lineage hint -> stored result | external adapter;external summary repository;evidence lineage repository | archive body/path rejected | no object storage path in public result |
| `AssertExternalBodyBoundaryFlow` | reserve -> evaluate candidate ref against body rule -> record diagnostic summary -> stored result | policy diagnostic builder;external adapter | body content rejected before diagnostic | rejected body not persisted |
| `RejectExternalBodyCandidateFlow` | reserve -> validate candidate ref/safe reason -> record rejection summary/audit hint -> stored result | policy diagnostic builder;audit trail repository | missing safe reason rejected | no payload excerpt |
| `AcceptExternalBasisSummaryFlow` | reserve -> load external summary -> mark basis accepted summary -> save basis support -> stored result | basis summary repository;external summary repository | governance body missing not fetched | no governance gate execution |
| `MarkExternalBasisDispositionFlow` | reserve -> load basis/external summary -> copy disposition marker -> save -> stored result | basis summary repository;external summary repository | marker missing watch/blocker | no formal version mutation |
| `SupersedeExternalSourceSummaryFlow` | reserve -> load previous/next summaries -> record supersession -> stored result | external summary repository;evidence lineage repository | next missing rejected | old summary traceable |
| `LinkExternalEvidenceLineageFlow` | reserve -> load external/artifact refs -> link body-free lineage -> save -> stored result | evidence lineage repository;external/artifact repository | evidence/report body rejected | refs only |

### 8. 后台维护与收敛 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `RequestReadMaterialRefreshFlow` | reserve -> create read material refresh task/run intent -> save task/progress seed -> stored result/event | maintenance task repository;run history repository;IdGenerator | invalid scope rejected;duplicate replay | command does not execute job |
| `RequestTraceMaterialRefreshFlow` | reserve -> validate trace subject refs -> create trace refresh task -> stored result | maintenance task repository;trace repository;run history | raw log/evidence body rejected | no trace body stored |
| `RequestConsistencyRecoveryFlow` | reserve -> create recovery task with affected refs/safe reason -> stored result/event | maintenance task repository;recovery issue repository;run history | repair algorithm body rejected | no automatic truth repair |
| `MarkMaintenanceSuspendedFlow` | reserve -> load run/task -> copy suspension marker/reason -> save marker -> stored result | maintenance task/progress/run history repository | marker missing watch/blocker | suspension does not invalidate truth |
| `RequireMaintenanceFormalInterventionFlow` | reserve -> load recovery task -> record intervention issue -> stored result | recovery issue repository;maintenance task repository | intervention ref missing rejected | no governance execution |
| `SupersedeMaintenanceRequestFlow` | reserve -> load previous/next run refs -> record supersession -> stored result | maintenance task repository;run history repository | next run missing rejected | no worker replay |

### 9. 外围包与方法集组织 Command overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `EstablishMethodPackageFlow` | reserve -> validate member definition/version refs -> evaluate composition rule -> create package -> save -> stored result/event | package repository;definition/version repository;policy diagnostic builder | marketplace body rejected | package does not create definition |
| `AdjustMethodPackageCompositionFlow` | reserve -> load package -> validate member change -> save expected version -> stored result | package repository;policy diagnostic builder | stale package rejected | member asset truth unchanged |
| `RetireMethodPackageFlow` | reserve -> load package -> inspect assembly conflict -> mark retired -> stored result | package repository;assembly repository | active assembly conflict rejected/watch | package history remains |
| `MarkMethodPackageUnavailableFlow` | reserve -> load package -> copy unavailable marker -> save -> stored result | package repository;degraded mapper;availability port | marker missing watch/blocker | core truth unaffected |
| `AssembleMethodSetFlow` | reserve -> validate package/member refs and boundary -> create assembly -> stored result/event | assembly repository;package repository;consumption boundary resolver | boundary violation rejected | no organization runtime config |
| `AdjustMethodSetAssemblyFlow` | reserve -> load assembly -> validate change -> save expected version -> stored result | assembly repository;package repository;policy diagnostic builder | stale assembly rejected | no boundary expansion |
| `RetireMethodSetAssemblyFlow` | reserve -> load assembly -> mark retired/replacement hint -> stored result | assembly repository;run history optional | missing replacement warning/rejected per Step 12 | package truth unchanged |
| `MarkMethodSetAssemblyStaleOrUnavailableFlow` | reserve -> load assembly -> copy stale/unavailable marker -> save -> stored result | assembly repository;degraded mapper;availability port | marker missing watch/blocker | no refresh job execution |
| `EvaluatePackageCompositionFlow` | reserve -> load package/assembly candidate -> build diagnostic -> record result summary -> stored result | package/assembly repository;policy diagnostic builder | invalid member refs rejected | no full rule algorithm exposed |

### 10. R9.36 stop-review

| 检查项 | 结果 |
|---|---|
| 58 个 Command 是否均有执行 overlay | pass |
| 是否包含 idempotency / load / domain-policy / save / stored result 顺序 | pass |
| 是否将 marker / version / safe reason 缺口留作 watch/blocker | pass |
| 是否新增具体 schema / port 方法签名 / config | no |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.37 57 个 Query 的函数级执行 overlay:再写入`;只允许补全 Query flow 执行序列和审查项;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.37 57 个 Query 的函数级执行 overlay:再写入

### 1. Query overlay scope

本批在 `R9.29` 的 57 个 compact query card 上补充 no-write execution overlay。每条 Query 必须从 formal selector、repository、read resolver、availability/degraded mapper 复制 safe surface,不得现场修复或刷新。

### 2. 方法资产定义与目录 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetMethodAssetDefinitionSummaryFlow` | query entry -> assert no-write -> resolve read decision for definition_ref -> load definition summary -> assemble safe view | definition repository;query read resolver;degraded mapper | missing -> safe absent;denied -> body-free not-visible | route/raw name cannot become definition ref |
| `ResolveMethodAssetDefinitionRefFlow` | validate selector -> call resolver/catalog lookup -> return typed ref summary with confidence marker | definition repository;catalog repository;read resolver | unresolved safe absent;ambiguous degraded/watch | no string parsing shortcut |
| `GetMethodAssetCatalogEntryFlow` | resolve catalog read -> load catalog entry -> load linked definition safe ref -> assemble catalog view | catalog repository;definition repository | missing/mismatch degraded or absent | no catalog creation |
| `ListMethodAssetCatalogViewFlow` | validate scope/page -> list catalog view page -> copy freshness/cursor -> assemble page | catalog repository;page helper;read resolver | empty page;stale/unavailable marker copied | query does not refresh catalog |

### 3. 正式化与版本 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetFormalizationStateFlow` | resolve formalization read -> load state exact/current -> assemble state/basis summary | formalization repository;basis repository | missing absent;stale marker copied | no state advance |
| `GetFormalMethodAssetVersionSummaryFlow` | resolve version read -> load formal version -> attach basis/boundary refs -> return summary | formal version repository;basis repository | retired readable;missing absent | no fingerprint/snapshot |
| `ResolveCurrentFormalMethodAssetVersionFlow` | validate definition/catalog selector -> current version lookup -> copy freshness -> return ref | formal version repository;formalization repository | no current empty;conflict degraded | no current version creation |
| `GetFormalizationBasisSummaryFlow` | exact basis read -> load external summary refs -> assemble body-free basis view | basis repository;external summary repository | missing external degraded/watch | no standard/ADR body |
| `GetFormalizationEligibilityDiagnosticFlow` | load definition/catalog refs -> resolve basis -> build diagnostic -> return safe diagnostic | basis resolver;policy diagnostic builder | insufficient basis pending diagnostic | no command side effect |
| `ListFormalizationHistoryFlow` | validate subject/page -> list formalization/version history -> assemble body-free chronology | formalization repository;formal version repository;page helper | empty page;cursor opaque | no raw audit/event payload |

### 4. 受控消费 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetMethodAssetConsumptionMaterialFlow` | resolve material read -> load material -> copy availability/boundary marker -> assemble material view | consumption material repository;availability resolver | stale/unavailable copied;missing absent | no material creation |
| `GetMethodAssetAvailabilityViewFlow` | resolve material/context -> load availability view/material -> copy constrained/stale marker | consumption material repository;availability resolver;degraded mapper | unavailable/constrained surface | cache/view not truth |
| `ResolveConsumptionContextRefFlow` | validate typed inputs -> resolve consumption context through resolver -> return safe ref | query read resolver;availability resolver;boundary support | unresolved absent;raw id rejected | no route/runtime id synthesis |
| `GetDownstreamConsumptionBoundaryFlow` | exact or context lookup -> assemble boundary summary and diagnostic marker | boundary/material family;policy diagnostic builder | missing absent/degraded | no auth matrix |
| `GetDefinitionUseBoundaryDiagnosticFlow` | load guard/material/context -> build safe diagnostic -> return result | policy diagnostic builder;consumption material repository | invalid input safe diagnostic | no request payload body |
| `ListConsumableContextsForFormalVersionFlow` | validate formal version -> list consumable contexts -> copy availability hints/page cursor | consumption material repository;page helper | empty/partial degraded | list does not prepare material |

### 5. 追溯与一致性保护 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetMethodAssetTraceMaterialFlow` | resolve trace read -> load trace material -> assemble safe trace view | trace material repository;read resolver;degraded mapper | missing absent;stale copied | no raw log |
| `GetTraceBySubjectFlow` | resolve trace subject -> list trace material page -> assemble refs/page | trace material repository;page helper | unresolved subject absent;partial degraded | no subject string parsing |
| `GetConsumptionImpactSummaryFlow` | exact impact read -> assemble affected refs/disposition | impact summary repository | missing absent;unknown preserved | unknown not no-effect |
| `ListPendingConsumptionImpactsFlow` | list pending/unknown impacts by selector -> assemble page | impact repository;page helper;diagnostic builder | empty page;partial degraded | no downstream scan |
| `GetConsistencyProtectionDiagnosticFlow` | load impact/protection inputs -> build safe diagnostic -> return | policy diagnostic builder;impact/trace repositories | insufficient input pending diagnostic | no recovery execution |
| `GetMethodAssetAuditTrailFlow` | resolve audit subject -> page audit entries -> assemble safe refs | audit trail repository;page helper | empty;degraded item marker copied | no raw telemetry |
| `GetMethodAssetEvidenceLineageFlow` | exact/subject lineage lookup -> load linked refs -> assemble lineage summary | evidence lineage repository;external/artifact repositories | missing linked artifact degraded/watch | no evidence body |

### 6. 关系与分发语义 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetMethodAssetRelationFlow` | resolve relation read -> load relation -> assemble endpoint refs | relation repository;read resolver | missing absent;retired readable | no graph algorithm output |
| `ListMethodAssetRelationsByEndpointFlow` | validate endpoint -> list relation page -> assemble page | relation repository;page helper | empty;partial degraded | no ranking/recommendation |
| `ListMethodAssetRelationsByFormalVersionFlow` | load/validate version ref -> list relation refs -> page response | relation repository;formal version repository | version missing absent | no hash/fingerprint relation |
| `ListMethodAssetRelationsByDistributionContextFlow` | resolve distribution context -> list relation/material summaries -> return page | relation repository;distribution builder | unresolved context absent | no marketplace transaction |
| `GetRelationIntegrityDiagnosticFlow` | load relation/rule refs -> build diagnostic summary -> return | relation repository;policy diagnostic builder | insufficient refs pending | no rule matrix |
| `GetRelationChangeSummaryFlow` | list relation change summaries -> assemble safe history page | relation repository;trace/audit family | empty;degraded item | no raw event payload |
| `ResolveMethodAssetDistributionRefFlow` | exact/lookup distribution ref -> assemble availability marker | distribution builder;relation repository | unavailable copied | no listing/install state |
| `GetDistributionReadMaterialFlow` | load/build body-free material from refs -> return summary | distribution builder;relation repository;availability resolver | missing material absent/degraded | no package body |
| `ListDistributionReadMaterialsByContextFlow` | list by context -> assemble distribution material page | distribution builder;page helper | empty;partial degraded | no search ranking |

### 7. 外部摘要与引用 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetExternalSourceSummaryFlow` | resolve external read -> exact summary read -> body-free view | external summary repository;read resolver | missing absent;stale copied | no external body |
| `GetExternalSummaryBySourceRefFlow` | validate source ref -> lookup/list summary page -> return | external summary repository;page helper | empty;unavailable copied | no URL/path reverse lookup |
| `ResolveExternalSourceRefFlow` | exact source ref summary read -> assemble typed ref surface | external summary repository;external adapter | unresolved absent | no provider payload |
| `GetArtifactArchiveRefFlow` | load artifact ref summary -> assemble digest/retention hints | external adapter;evidence lineage repository | missing artifact absent | no archive body/path |
| `GetExternalBodyBoundaryDiagnosticFlow` | build body-free boundary diagnostic from candidate refs | policy diagnostic builder;external adapter | invalid candidate rejected diagnostic | rejected body not returned |
| `GetExternalSourceSummaryViewFlow` | read summary view -> copy freshness/body-free marker -> return | external summary repository;availability resolver | stale/unavailable copied | view not truth |
| `GetExternalBasisAcceptanceHistoryFlow` | list acceptance history -> assemble safe page | basis repository;external summary repository;page helper | empty;partial degraded | no governance execution body |
| `GetExternalEvidenceLineageHintFlow` | lookup lineage hints -> assemble refs only | evidence lineage repository;external/artifact repositories | missing linked refs degraded/watch | no report body |

### 8. 后台维护与收敛 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetMaintenanceProgressFlow` | exact progress view read -> assemble progress summary | progress view repository;run history repository | missing absent;unavailable copied | no worker log |
| `GetMaintenanceProgressByRunFlow` | lookup progress by run -> assemble task refs/history hints | progress repository;run history repository | run missing absent | run ref not job id |
| `GetMaintenanceProgressByScopeFlow` | list progress by refresh scope -> assemble page | progress repository;page helper | empty;partial degraded | no lock/retry token |
| `GetReadMaterialRefreshTaskSummaryFlow` | exact task read -> join progress marker -> return | maintenance task repository;progress repository | missing task absent | no refresh algorithm |
| `GetTraceMaterialRefreshTaskSummaryFlow` | exact trace task read -> assemble subject/progress refs | maintenance task repository;trace/progress repositories | missing refs degraded/watch | no raw log/report |
| `GetConsistencyRecoveryTaskSummaryFlow` | exact recovery task read -> assemble issue/intervention hints | maintenance task repository;recovery issue repository;run history | missing issue absent/degraded | no repair script |
| `GetMaintenanceRunHistoryFlow` | list run chronology -> assemble marker page | run history repository;page helper | empty;partial degraded | no metrics body |
| `ListPendingMaintenanceScopesFlow` | list pending/stale/recovery scopes -> return page | maintenance task repository;progress repository | empty page allowed | pending does not invalidate truth |

### 9. 外围包与方法集组织 Query overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `GetMethodPackageFlow` | resolve package read -> load package -> assemble member refs | package repository;read resolver | retired readable;missing absent | no package body/listing |
| `ListMethodPackagesFlow` | list packages by scope/context -> copy availability markers -> page | package repository;page helper;availability resolver | empty;partial degraded | no marketplace ranking |
| `GetMethodPackageViewFlow` | assemble package view from package refs -> copy freshness marker | package repository;peripheral discovery builder | stale/unavailable copied | view not truth |
| `GetMethodPackageCompositionDiagnosticFlow` | load package/rule -> build diagnostic -> return | package repository;policy diagnostic builder | invalid member refs pending/rejected | no rule algorithm |
| `GetMethodSetAssemblyFlow` | load assembly/package refs -> assemble summary | assembly repository;package repository | missing package degraded/watch | no UI/SDK config |
| `ListMethodSetAssembliesFlow` | list by adoption/context filter -> assemble page | assembly repository;page helper;availability resolver | empty;partial degraded | no organization runtime state |
| `GetMethodSetAssemblyViewFlow` | build assembly body-free view -> copy marker | assembly repository;peripheral discovery builder | stale/unavailable copied | no boundary expansion |
| `GetPeripheralDiscoveryContextFlow` | resolve marketplace context summary -> build discovery summary | marketplace context resolver;discovery builder | marketplace unavailable marker | no listing/order/install data |
| `GetPackageAssemblyHistoryFlow` | list package/assembly history -> safe page | package repository;assembly repository;page helper | empty;partial degraded | no raw event payload |

### 10. R9.37 stop-review

| 检查项 | 结果 |
|---|---|
| 57 个 Query 是否均有 execution overlay | pass |
| 是否明确 no-write | pass |
| 是否说明 read resolver / availability / degraded marker copy-only | pass/watch |
| 是否禁止 raw body / repair / refresh / event / job side effect | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.38 4 个 Inbound Consumer 的函数级执行 overlay:再写入`;只允许补全 Inbound flow 执行序列和审查项;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.38 4 个 Inbound Consumer 的函数级执行 overlay:再写入

### 1. Inbound execution overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `ConsumeBodyFreeExternalSummaryAcceptedFlow` | worker validates envelope/schema/dedup -> reserve inbound idempotency -> call inbound source port -> resolve body-free summary through external adapter -> save intake summary/receipt -> optional event candidate hint -> stored receipt | `MethodAssetInboundIntakeDecision`;inbound source port;external body-free adapter;external summary repository;stored result | duplicate returns stored receipt;malformed/unsupported/raw body rejected receipt | consumer does not create definition/formal version |
| `ConsumeExternalSourceRefRegisteredFlow` | validate source ref envelope -> reserve dedup -> record safe typed source ref intake -> store receipt/result | inbound source port;external adapter;external summary repository | unresolved source delayed/rejected safe receipt | URL/path cannot become formal ref |
| `ConsumeArtifactArchiveRefRegisteredFlow` | validate artifact ref/digest -> reserve dedup -> record archive ref intake and lineage hint -> store receipt | inbound source port;external adapter;evidence lineage repository | archive body/path rejected;duplicate replay | archive payload never read |
| `ConsumeExternalBodyBoundaryViolationFlow` | validate violation envelope and safe reason -> reserve dedup -> record boundary violation intake/audit hint -> store receipt | inbound source port;policy diagnostic builder;audit trail repository | missing safe reason rejected;duplicate replay | rejected body excerpt not stored |

### 2. Inbound receipt discipline

| Branch | Required surface |
|---|---|
| accepted | stored safe receipt with intake summary ref and source refs |
| duplicate | stored receipt replay, no source reprocessing |
| unsupported schema | safe unsupported receipt, no payload parse beyond envelope |
| malformed/raw body | safe rejected/quarantine receipt, no core truth mutation |
| delayed/unavailable | safe delayed receipt with unavailable marker copied from adapter/source summary |

### 3. R9.38 stop-review

| 检查项 | 结果 |
|---|---|
| 4 个 Inbound 是否均有 execution overlay | pass |
| 是否明确 receipt / duplicate replay | pass/watch:receipt schema 后移 Step 13 |
| 是否禁止 core truth mutation | pass |
| 是否保持 body-free | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.39 34 个 Outbound Event / publication 的函数级执行 overlay:再写入`;只允许补全 Outbound flow 执行序列和审查项;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.39 34 个 Outbound Event / publication 的函数级执行 overlay:再写入

### 1. Outbound execution discipline

所有 Outbound flow 都分为 candidate assembly 与 publication outcome 两段。Candidate 来源必须是 accepted command、completed job 或 bounded inbound intake 的 stored body-free fact;publisher 不得重读 current truth 重建 payload。

```text
[Stored fact source]
  | load event candidate input from accepted result / job report / intake receipt refs
  | verify body-free and typed refs only
  v
[Candidate assembly]
  | copy changed refs, marker refs, safe reason refs, trace context and target hint
  | record candidate shell when Step 11 later defines persistence
  v
[Publication]
  | resolve target registry / adapter availability
  | call publisher port with candidate shell
  | return safe published / blocked / unavailable / failed outcome
```

### 2. Core asset / catalog and formalization event overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `MethodAssetDefinitionChangedPublicationFlow` | load accepted definition command effect -> assemble definition ref/change kind candidate -> resolve target -> publish outcome | event candidate assembly;publisher port;target registry | target blocked/unavailable safe outcome | publisher never loads definition body |
| `MethodAssetCatalogEntryChangedPublicationFlow` | load catalog accepted effect -> assemble catalog/scope refs -> publish candidate | candidate assembly;publisher port | publication failure no truth rollback | no catalog view refresh implied |
| `MethodAssetFormalizationDecisionChangedPublicationFlow` | load formalization decision result -> assemble state/basis refs -> publish | candidate assembly;publisher port | blocked/unavailable copied | no governance body |
| `FormalMethodAssetVersionEstablishedPublicationFlow` | load version established effect -> assemble version ref/basis refs -> publish | candidate assembly;publisher port | failed publication safe outcome | accepted version remains accepted |
| `FormalMethodAssetVersionChangedPublicationFlow` | load semantic/supersession effect -> assemble previous/current refs -> publish | candidate assembly;publisher port | unavailable target safe outcome | previous ref immutable |
| `FormalMethodAssetVersionRetiredPublicationFlow` | load retirement effect -> assemble retired version/ref reason -> publish | candidate assembly;publisher port | blocked safe outcome | no downstream mutation |

### 3. Consumption / trace / relation event overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `MethodAssetConsumptionMaterialPreparedPublicationFlow` | load material prepared effect -> assemble material/formal version/context refs -> publish | candidate assembly;publisher port | failed publication no rollback | no material body |
| `MethodAssetConsumptionAvailabilityChangedPublicationFlow` | load marker change effect -> copy availability marker into candidate -> publish | candidate assembly;availability resolver;publisher port | marker missing watch/blocker | marker copied only |
| `DownstreamConsumptionBoundaryChangedPublicationFlow` | load boundary accepted effect -> assemble boundary/context refs -> publish | candidate assembly;publisher port | target blocked copied | no permission matrix |
| `DefinitionUseBoundaryViolationNoticedPublicationFlow` | load violation effect -> assemble violation ref/safe reason -> publish | candidate assembly;publisher port | unavailable safe outcome | raw request not published |
| `MethodAssetTraceMaterialChangedPublicationFlow` | load trace material effect -> assemble trace material ref -> optional handoff hint -> publish | candidate assembly;publisher port;handoff optional | handoff unavailable does not fail candidate | raw log excluded |
| `ConsumptionImpactSummaryChangedPublicationFlow` | load impact effect -> assemble impact refs/disposition -> publish | candidate assembly;publisher port | blocked copied | no downstream runtime body |
| `ConsistencyProtectionDecisionChangedPublicationFlow` | load protection decision effect -> assemble decision/protected refs -> publish | candidate assembly;publisher port | failed publication no rollback | no recovery plan body |
| `MethodAssetAuditTrailChangedPublicationFlow` | load audit trail effect -> assemble audit trail ref -> optional handoff hint -> publish | candidate assembly;publisher port;handoff optional | handoff blocked safe outcome | no raw audit log |
| `MethodAssetEvidenceLineageChangedPublicationFlow` | load lineage effect -> assemble lineage/external refs -> publish | candidate assembly;publisher port | unavailable copied | no evidence file body |
| `MethodAssetRelationChangedPublicationFlow` | load relation lifecycle effect -> assemble relation refs/change kind -> publish | candidate assembly;publisher port | target blocked copied | no graph payload |
| `MethodAssetRelationIntegrityChangedPublicationFlow` | load integrity effect -> assemble relation/rule/marker refs -> publish | candidate assembly;publisher port | marker missing watch/blocker | safe reason only |
| `MethodAssetDistributionRefChangedPublicationFlow` | load distribution effect -> assemble distribution/context refs -> publish | candidate assembly;publisher port | unavailable copied | no marketplace transaction |
| `MethodAssetDistributionAvailabilityChangedPublicationFlow` | load availability marker effect -> copy marker -> publish | candidate assembly;availability resolver;publisher port | marker missing watch/blocker | no downstream sync state |
| `MethodAssetRelationReadMaterialInvalidatedPublicationFlow` | load relation/distribution source change -> assemble invalidation hint -> publish | candidate assembly;publisher port | publication failed no rollback | event does not execute refresh |

### 4. External / maintenance / peripheral event overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `ExternalSourceSummaryChangedPublicationFlow` | load external summary effect -> assemble summary/source marker refs -> publish | candidate assembly;publisher port | blocked/unavailable copied | no external body |
| `ExternalSourceRefChangedPublicationFlow` | load source ref effect -> assemble kind/version/digest hints -> publish | candidate assembly;publisher port | failed no rollback | no provider payload |
| `ArtifactArchiveRefChangedPublicationFlow` | load artifact ref effect -> assemble artifact/digest hint -> publish | candidate assembly;publisher port | unavailable copied | no archive package |
| `ExternalBodyBoundaryViolationNoticedPublicationFlow` | load boundary violation effect -> assemble candidate ref/safe reason -> publish | candidate assembly;publisher port | blocked copied | no rejected body excerpt |
| `ExternalEvidenceLineageChangedPublicationFlow` | load external lineage effect -> assemble lineage/artifact refs -> publish | candidate assembly;publisher port | unavailable copied | no evidence body |
| `MethodAssetMaintenanceRequestedPublicationFlow` | load maintenance request result -> assemble run/scope/reason refs -> publish | candidate assembly;publisher port | failed no rollback | no scheduler details |
| `MethodAssetReadMaterialRefreshChangedPublicationFlow` | load job report/effect -> assemble task/run/freshness refs -> publish | candidate assembly;publisher port | target blocked copied | no material body |
| `MethodAssetTraceMaterialRefreshChangedPublicationFlow` | load trace refresh report -> assemble task/subject/partial marker -> publish | candidate assembly;publisher port | marker missing watch/blocker | no report body |
| `MethodAssetConsistencyRecoveryChangedPublicationFlow` | load recovery report -> assemble outcome/intervention refs -> publish | candidate assembly;publisher port | unavailable copied | no repair script |
| `MethodAssetMaintenanceProgressChangedPublicationFlow` | load progress effect -> assemble progress marker/run refs -> publish | candidate assembly;publisher port | failed no rollback | no metrics body |
| `MethodPackageChangedPublicationFlow` | load package effect -> assemble package/member refs -> publish | candidate assembly;publisher port | blocked copied | no package body/listing |
| `MethodSetAssemblyChangedPublicationFlow` | load assembly effect -> assemble assembly/package refs -> publish | candidate assembly;publisher port | unavailable copied | no UI/SDK config |
| `PackageCompositionResultChangedPublicationFlow` | load composition diagnostic result -> assemble marker/safe reason -> publish | candidate assembly;publisher port | marker missing watch/blocker | no rule matrix |
| `PeripheralViewAvailabilityChangedPublicationFlow` | load peripheral availability change -> copy freshness/availability marker -> publish | candidate assembly;availability resolver;publisher port | marker missing watch/blocker | core truth unchanged |

### 5. R9.39 stop-review

| 检查项 | 结果 |
|---|---|
| 34 个 Outbound 是否均有 execution overlay | pass |
| 是否分离 candidate 与 publication outcome | pass |
| 是否禁止 publisher 重读 current truth | pass |
| 是否避免 topic / payload schema / retry / old outbox | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.40 8 个 Operations Job 的函数级执行 overlay:再写入`;只允许补全 Job flow 执行序列和审查项;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.40 8 个 Operations Job 的函数级执行 overlay:再写入

### 1. Operations job execution overlay

| Flow | Function-level sequence | Formal sources | Branch / replay surface | Review gate |
|---|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterialsFlow` | validate job shell -> reserve job idempotency -> load task/checkpoint -> planner returns definition/catalog targets -> read committed definition/catalog truth -> refresh derived read materials/progress/checkpoint -> save stored report | maintenance task repo;checkpoint store;target planner;definition/catalog repos;progress/run history | duplicate report replay;partial target failure issue | no definition/catalog truth mutation |
| `RefreshFormalVersionReadMaterialsFlow` | reserve -> load formal version task/checkpoint -> plan targets -> read version/basis summaries -> refresh version read material -> record partial issue/report | task repo;target planner;formal version repo;basis repo | missing basis partial/degraded issue | no formalization rerun |
| `RefreshConsumptionReadMaterialsFlow` | reserve -> plan material targets -> read consumption material and availability -> copy freshness/availability marker -> save progress/report | task repo;consumption material repo;availability resolver | boundary unavailable partial marker | no boundary re-decision |
| `RefreshRelationDistributionMaterialsFlow` | reserve -> plan relation/distribution targets -> read relation/material refs -> build body-free distribution material -> save progress/report | task repo;relation repo;distribution builder;checkpoint/progress | builder unavailable degraded issue | no graph traversal truth repair |
| `RefreshExternalSummaryReadMaterialsFlow` | reserve -> plan external summary targets -> read external summary refs -> resolve body-free availability -> refresh view markers -> report | task repo;external summary repo;external adapter | adapter unavailable partial/unavailable issue | no external body fetch |
| `RefreshTraceAuditImpactMaterialsFlow` | reserve -> plan trace/audit/impact subjects -> read repositories -> refresh derived materials -> report partial lineage issues | task repo;trace/audit/impact/lineage repos | missing lineage partial issue;duplicate replay | no raw log/evidence body |
| `RunConsistencyRecoveryConvergenceFlow` | reserve -> load recovery task -> plan affected refs -> evaluate convergence using impact/protection refs -> record recovery issue/intervention/progress -> stored report | task repo;recovery issue repo;impact/protection repos | formal intervention required -> issue not repair | no automatic core truth repair |
| `RefreshPeripheralReadMaterialsFlow` | reserve -> plan package/assembly targets -> read package/assembly refs -> build body-free discovery/read views -> save progress/report | task repo;package/assembly repos;discovery builder;marketplace resolver | marketplace unavailable marker | no marketplace transaction/body |

### 2. Job branch discipline

| Branch | Required surface |
|---|---|
| duplicate | stored job report replay, no target scan |
| resume | checkpoint source only;no page cursor / version / queue offset substitution |
| partial failure | safe issue refs and counters, not silent success |
| unavailable adapter | unavailable marker copied from availability family |
| blocked target | blocked target summary in report;no core truth repair |
| completion | stored report, progress/checkpoint closure and event candidate hint |

### 3. R9.40 stop-review

| 检查项 | 结果 |
|---|---|
| 8 个 Job 是否均有 execution overlay | pass |
| 是否明确 duplicate / resume / checkpoint / partial failure | pass/watch |
| 是否 no core truth repair | pass |
| 是否禁止 scheduler / queue / retry / metrics body | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.41 L1 粒度 cross-flow closure audit:再写入`;只允许补全跨 flow 审计;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.41 L1 粒度 cross-flow closure audit:再写入

### 1. L1 粒度覆盖审计

| Family | Count | Compact card | Execution overlay | Result |
|---|---:|---|---|---|
| Command | 58 | pass | pass | complete |
| Query | 57 | pass | pass | complete |
| Inbound Consumer | 4 | pass | pass | complete |
| Outbound Event | 34 | pass | pass | complete |
| Operations Job | 8 | pass | pass | complete |

### 2. Cross-flow closure audit

| Audit axis | Result | Notes / handoff |
|---|---|---|
| entry restriction | pass | API / worker / jobs entry only calls application facade;no direct repository/domain/adapter access。 |
| Command transaction ordering | pass/watch | reserve -> load -> domain/policy -> save -> stored result -> commit;exact persistence schema remains Step 11。 |
| Query no-write | pass | Query overlay forbids save/append/refresh/event/job side effect。 |
| Inbound body-free and no truth mutation | pass | Inbound only stores intake/receipt/hint;truth mutation requires explicit Command。 |
| Outbound candidate vs publisher | pass/watch | Candidate source separated from publisher outcome;candidate persistence remains Step 11/14。 |
| Job no repair | pass | Job writes only derived material/progress/checkpoint/report/recovery issue。 |
| duplicate replay | pass/watch | Command / Inbound / Job replay from stored result/receipt/report;serialization remains Step 13。 |
| marker copy-only | pass/watch | Availability/degraded/stale/unavailable markers copied from resolver/mapper/availability/progress sources。 |
| body-free boundary | pass | No external body, artifact body, raw log, report body, provider payload or marketplace transaction enters flow surface。 |
| page/cursor/version separation | pass/watch | Query page, job checkpoint, expected version, source cursor remain separate;exact state matrix/persistence later。 |

### 3. R9.41 stop-review

| 检查项 | 结果 |
|---|---|
| 是否达到 L1-governance 的逐接口执行密度 | pass |
| 是否仍不新增 schema / port 方法签名 | pass |
| 是否仍停在 Step 9 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.42 Watch / blocker ledger 补全:再写入`;只允许补全 watch/blocker;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.42 Watch / blocker ledger 补全:再写入

### 1. Watch ledger

| Watch ID | Topic | Why still open | Required closure |
|---|---|---|---|
| ML-D03-S9-WATCH-001 | Command stored result / rejected replay | Step 9 已规定 replay 来源,但未定义 serialized stored surface schema。 | Step 11 / Step 13 定义 stored result persistence、save/get pairing、duplicate replay surface。 |
| ML-D03-S9-WATCH-002 | Expected version source | Overlay 已标注 expected version 来源需来自 loaded truth/support/material。 | Step 11 明确每类 repository versioned read/write 语义。 |
| ML-D03-S9-WATCH-003 | Query read subject / visibility / freshness source | Query overlay 要求 resolver/loaded formal view 复制 marker。 | Step 10 / 12 闭合 read disposition、visibility、stale/degraded/unavailable 状态。 |
| ML-D03-S9-WATCH-004 | Inbound receipt schema | Inbound overlay 已定义 accepted/duplicate/rejected/delayed surface。 | Step 12 / 13 定义 receipt result kind、safe reason、stored replay schema。 |
| ML-D03-S9-WATCH-005 | Event candidate persistence | Outbound overlay 分离 candidate 与 publisher。 | Step 11 / 14 决定 candidate 是否持久化、publisher reload 来源、target registry binding。 |
| ML-D03-S9-WATCH-006 | Job checkpoint/report | Job overlay 定义 checkpoint/resume/report 语义。 | Step 11 / 13 / 15 定义 checkpoint identity、report persistence、observability boundary。 |
| ML-D03-S9-WATCH-007 | Safe diagnostic / marker mapping | 多个 flow 依赖 policy diagnostic / degraded mapper / availability marker。 | Step 12 定义 safe rejection、partial、blocked、unavailable、quarantine public branches。 |
| ML-D03-S9-WATCH-008 | Runtime / adapter availability | Entry 和 Job overlay 均要求 runtime availability precheck。 | Step 14 定义 runtime assembly slots、adapter binding、target registry、marketplace context。 |

### 2. Blocker ledger

| Blocker ID | Status | Reason |
|---|---|---|
| ML-D03-S9-BLOCK-001 | none | 本次补全未发现必须回退 Step 6 / 7 / 8 的 hard blocker。 |

当前所有开放项均是 Step 10~16 的正常后续闭口项。若后续 Step 10~16 发现 Step 6 / 7 / 8 无法提供正式来源,必须新增 blocker 并暂停,不得让实现侧补 schema、port、state、mapper、config 或 test-evidence 字段。

### 3. R9.42 stop-review

| 检查项 | 结果 |
|---|---|
| 是否补全 watch ledger | pass |
| 是否识别 hard blocker | none |
| 是否禁止实现侧补口 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 9 `R9.43 L1 粒度正式 §8 候选草稿补全:再写入`;只允许补全正式 §8 候选草稿;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.43 L1 粒度正式 §8 候选草稿补全:再写入

### 1. 正式 §8 候选草稿补充说明

本节替代 `R9.34` 的 compact 候选草稿作为正式 `03-详细设计.md` §8 的最新候选来源。正式文档仍不在本 Step 直接修改。

#### §8.1 函数级处理流边界

L3-method-library 的处理流按 Command、Query、Inbound Consumer、Outbound Event / Publisher、Operations Job 五类展开。五类 flow 共覆盖 161 个接口/事件/job 候选:58 Command、57 Query、4 Inbound、34 Outbound、8 Operations Job。

Command 是唯一业务写入口;Query 永远 no-write;Inbound 只做 body-free intake;Outbound 分 event candidate assembly 与 publisher outcome;Operations Job 只刷新派生材料、追溯材料、外围读取材料或推进 recovery convergence,不得修 core truth。

#### §8.2 Shared execution templates

| Flow family | Execution template |
|---|---|
| Command | entry shell -> operation context -> idempotency reserve -> versioned load -> Step 6 domain/policy -> UoW save -> history/trace/audit/lineage/effect refs -> stored result -> commit。 |
| Query | query shell -> read context -> resolver/repository/mapper -> safe view/page/empty/not-visible/degraded/unavailable -> return without write。 |
| Inbound | worker shell -> source dedup -> body-free source adapter -> intake decision -> stored receipt / worker result -> optional safe event hint。 |
| Outbound | stored accepted fact/job/intake source -> candidate assembly -> target registry -> publisher outcome;publisher never rebuilds from current truth。 |
| Job | job shell -> task/checkpoint -> target planner -> committed read -> derived material/progress/checkpoint/report -> stored job result。 |

#### §8.3 Command flow groups

58 个 Command 已按八个组成部分补全 execution overlay:

| Group | Execution guarantee |
|---|---|
| 方法资产定义与目录 | definition/catalog writes use versioned repository, idempotency replay and body-free history/event refs。 |
| 正式化与版本 | eligibility、formalization、version establish/change/supersede/retire never derive version from fingerprint/snapshot。 |
| 受控消费 | consumption material and boundary flows never prepare material in Query or store downstream runtime truth。 |
| 追溯与一致性保护 | trace/audit/lineage/impact flows store refs and safe summaries only。 |
| 关系与分发语义 | relation/distribution flows do not use marketplace id or graph payload as truth。 |
| 外部摘要与引用 | external flows use body-free adapters and reject provider payload/archive body。 |
| 后台维护与收敛 | maintenance commands only register/suspend/intervene/supersede requests;job body is separate。 |
| 外围包与方法集组织 | package/assembly flows never copy asset body or marketplace transaction state。 |

#### §8.4 Query flow groups

57 个 Query 已按八个组成部分补全 no-write overlay。每条 Query 必须从 formal selector、repository、read resolver、availability/degraded mapper 复制 safe surface;不得创建 material、刷新 view、append trace/audit、publish event 或启动 job。

#### §8.5 Inbound consumer flows

4 个 Inbound Consumer 只承接外部摘要与引用的 body-free fact。accepted、duplicate、unsupported、malformed/raw-body、delayed/unavailable 分支均必须返回 safe receipt;duplicate 只能 replay stored receipt。

#### §8.6 Outbound event / publication flows

34 个 Outbound Event 均从 stored accepted fact、stored job report 或 stored intake receipt 中装配 candidate。Publisher 只能消费 candidate shell、target registry 和 safe availability outcome,不得重读 current truth 构造 payload。

#### §8.7 Operations job flows

8 个 Operations Job 均有 run / duplicate / resume / checkpoint / partial failure / report overlay。Job 只写 derived read material、progress、checkpoint、run history、recovery issue 和 stored report;不得 repair core truth。

#### §8.8 Cross-flow guardrails

| Guardrail | Rule |
|---|---|
| body-free | external body、artifact body、provider payload、raw log、metrics body、report body、marketplace transaction 不进入 flow surface。 |
| copy-only marker | degraded、stale、unavailable、blocked、freshness、availability marker 只能复制正式 resolver / mapper / availability / progress 来源。 |
| replay source | Command / Inbound / Job duplicate 只能复制 stored result / receipt / report / checkpoint。 |
| no hidden repair | Query、Inbound、Outbound、Job 都不得暗中修 core truth。 |
| no old source | 不恢复 `MethodContent`、publish lifecycle、snapshot、fingerprint、old outbox、P0/P1。 |
| phase boundary | Step 9 不定义状态矩阵、persistence schema、error schema、config key、test case schema 或 implementation commit。 |

### 2. R9.43 stop-review

| 检查项 | 结果 |
|---|---|
| 是否替代 R9.34 compact 草稿 | pass |
| 是否保留 L1 粒度结论 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 继续 Step 9 `R9.44 L1 粒度补全最终停审:再写入`;只允许写入最终 completion gate 并同步台账;不得修改正式 `03-详细设计.md`;不得进入 Step 10。

---

## R9.44 L1 粒度补全最终停审:再写入

### 1. Final completion checklist

| 检查项 | 结果 |
|---|---|
| `R9.35` 是否建立 L1 粒度补全模板 | pass |
| `R9.36` 是否补全 58 个 Command execution overlay | pass |
| `R9.37` 是否补全 57 个 Query execution overlay | pass |
| `R9.38` 是否补全 4 个 Inbound execution overlay | pass |
| `R9.39` 是否补全 34 个 Outbound execution overlay | pass |
| `R9.40` 是否补全 8 个 Operations Job execution overlay | pass |
| `R9.41` 是否完成 L1 粒度 cross-flow audit | pass |
| `R9.42` 是否补全 watch / blocker ledger | pass |
| `R9.43` 是否补全正式 §8 候选草稿 | pass |
| 是否修改正式 `03-详细设计.md` | no |
| 是否进入 Step 10 | no |

### 2. Final gate

Step 9 现在达到 L1-governance 参照粒度:不仅有 161 个 compact flow card,还为每个 flow family 和每条 flow 给出可落码执行 overlay、formal source、branch / replay surface、side effects、test cut、review gate、cross-flow audit、watch / blocker ledger 和正式 §8 候选草稿。

当前文件状态:

```text
current_status = completed_wait_user_confirm
current_module = R9.44 L1 粒度补全最终停审:再写入
next_allowed_action = 等待用户确认后进入 Step 10 R10.1 开工与必读文档:先思考
formal_03_detail_design_modified = no
```

next_allowed_action: 等待用户确认后进入 Step 10 `R10.1 开工与必读文档:先思考`;只允许思考 Step 10 状态机与转换矩阵的必读文档、输入边界、状态主语候选和模块计划;不得直接修改正式 `03-详细设计.md`;不得写 persistence schema、config key、test case schema、implementation code 或进入 Step 11。

### 3. Design-side fixes made during Step 9

| File | Fix | Reason |
|---|---|---|
| `03_ddd_step_09_function_flows.md` | 强制每个 compact flow card 保留 `Side effects` 与 `Test cut` 列,并在 L1 粒度 overlay 中保留 branch / replay / review gate。 | 让 Step 9 的粒度对齐 L1-governance,避免只剩 family-level 概要。 |
| `03_ddd_step_07_trait_port_adapter.md` | 未新增 port / mapper / repository / helper。 | Step 9 已有足够的 Step 7 seam 作为流程来源,继续补口会越过边界。 |
| `03_ddd_step_08_protocol_contracts.md` | 未新增 protocol / DTO schema。 | Step 9 只消费已闭口 public shell,不再反向发明协议字段。 |

### 4. Step 10~16 handoff items

| Next step | Required decision / detail |
|---|---|
| Step 10 state matrix | 从每个 Command / Query / Inbound / Outbound / Job flow 抽取状态主语和迁移矩阵。 |
| Step 11 persistence | 定义 stored result、receipt、report、candidate、checkpoint、page cursor 的持久化契约。 |
| Step 12 errors / recovery | 定义 safe rejection、degraded、unavailable、blocked、partial、quarantine、delayed 的 public 口径。 |
| Step 13 concurrency / idempotency | 定义 duplicate replay、expected version conflict、checkpoint resume、stored result replay。 |
| Step 14 config / dependency | 定义 runtime assembly slot、target registry、adapter availability、外部绑定。 |
| Step 15 observability / audit | 定义 safe diagnostic、trace/audit/handoff/progress 和 body-free report 边界。 |
| Step 16 tests | 把 flow-level test cut 转换为 contract / service / worker / job tests。 |

### 5. Step 9 completion checklist

| Checklist | 状态 |
|---|---|
| 是否覆盖 161 个 flow 的 compact baseline | pass |
| 是否补齐每条 flow 的 execution overlay | pass |
| 是否保留 side effects / test cut | pass |
| 是否完成 cross-flow audit 与 watch ledger | pass |
| 是否形成设计侧修正记录 | pass |
| 是否形成 Step 10~16 handoff 摘要 | pass |
| 是否修改正式 `03-详细设计.md` | no |
| 是否进入 Step 10 | no |
