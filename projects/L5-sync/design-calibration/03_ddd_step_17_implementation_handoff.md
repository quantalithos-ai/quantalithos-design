# Step 17. 详细设计到实施计划承接与跨文档闭环复核

> 本文件是 `03-详细设计` 的 Step 17 中间产物，不是实施计划、implementation ledger 或代码实现。
> 本步只确认设计契约能否被 `07-实施计划` 承接；不拆 phase、不拆任务、不创建 commit boundary，不声明实现已开始。

## 1. Step 状态与执行边界

| 项目 | 状态 |
|---|---|
| 当前 Step | `17 / implementation_handoff` |
| Step 状态 | `completed / stop_review`（本文件完成后进入 Step 18） |
| `gate_status` | `pass_with_upstream_blockers` |
| 正式 `03-详细设计.md` 写入 | `false`；仅 Step 19 允许装配 |
| 实现仓 `/home/aris/Projects/quantalithos-sync` | `absent / not_created` |
| implementation ledger / boundary skeleton | `not_created`；按规则只能在正式 07 |
| 测试、artifact、report、evidence、verdict、signoff、readiness | 未创建、未运行、未声称 |
| 下一动作 | `complete_step_18_risks_open_questions` |

`SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 仍为 `pending/blocked` 或 `local_pending`。本步的 `pass_with_upstream_blockers` 只表示闭环复核材料已形成，不表示任何外部能力、实现、测试或交付门禁通过。

## 2. 本步输入与 SOP 问题回答

### 2.1 输入

| 输入 | 承接内容 |
|---|---|
| `03_ddd_step_01_upstream_boundary.md`～`03_ddd_step_04_units_file_layout.md` | 上游边界、范围、TypeScript/ESM runtime 约束、planned 文件布局。 |
| `03_ddd_step_05_module_contracts_axis.md` | 五个业务 feature、正交技术层和依赖方向。 |
| `03_ddd_step_06_object_contracts.md` | 29 个 domain/technical 对象、字段、factory、transition、17 个状态主语。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository、UoW、idempotency、SDK/Git/filesystem/diagnostics/telemetry port seam。 |
| `03_ddd_step_08_protocol_contracts.md` | 10 Command、13 Query、3 Consumer、3 Job 的 exact public types；Outbound Event=`not_applicable`。 |
| `03_ddd_step_09_function_flows.md` | 29 条独立 flow、prepare→call→probe/finalize、query zero-write 和禁止副作用。 |
| `03_ddd_step_10_state_matrix.md` | 17 个状态机、合法/非法转换和跨状态传播。 |
| `03_ddd_step_11_persistence_transaction_consistency.md`～`03_ddd_step_16_test_cuts.md` | logical persistence、错误恢复、并发幂等、配置、观测和最小测试切口。 |
| `standards/document/实施计划书写规范.md` | 实施前阅读、phase/commit boundary 责任、07 交付前整体审计纪律。 |
| `standards/document/设计真相源闭环与可落码性标准.md` §2～§9 | 字段、DTO、Query view、state、metadata/idempotency、scope、projection/artifact 及 boundary 闭环口径。 |

### 2.2 SOP 问题回答

1. **哪些实现契约已经足够进入实施计划？**
   五个 feature 的模块边界、planned TypeScript 文件树、29 个协议入口、17 个状态主语、local UoW/append/replay 纪律、错误/unknown/幂等/观测红线和测试切口已经足够让 07 规划“如何分阶段审计”。具体 phase 顺序、commit boundary、测试命令、配置值和真实 adapter 选择尚未授权，不能在本步发明。
2. **实施者开始编码前必须阅读什么？**
   必须先读正式 `00/01/02/03/05/06/07`（当下仅 `00/01/02` 和 calibration 可用），本文件列出的 Step 1～16 校准材料，`projects/README.md`，TypeScript 规范、目录组织规范、提交规范、git identity 观察和实现计划规范；实现仓缺失不是可以跳过阅读的理由。
3. **提交规范和语言规范是否闭合？**
   设计仓只读观察到 git identity `quantalithos-labs / quantalithos.ai@gmail.com`；不得假设目标实现仓已配置。实现仓默认使用英文 `type(scope): subject`，具体 scope、staged files、required checks 和 commit hash 必须由 07 的 boundary ledger 在未来定义。Rust 规范只用于确认“不适用”；TypeScript ESM/strict/readonly/unknown narrowing/JSDoc 是当前实现前置规范。
4. **Domain 必填字段是否能回指来源？**
   已完成字段来源、factory、port read、同一 UoW sidecar 和缺失处理复核；正向 owner/source/handoff/probe 字段仍标为 blocked，不能用 fake、cache、ACK 或 Git 推断。
5. **Command/Event/Job 是否能构造目标对象？**
   10 Command 与 3 Job 有 exact DTO→object/flow 映射；3 Consumer 只有在正式 envelope/source/schema 成立时才可启用，映射表明确 invalid/quarantine/duplicate。Outbound Event 无适用 surface，不得创造伪 outbox。
6. **Query response/view/page/marker 是否闭合？**
   13 Query 均有 response view/page、字段来源、empty/not-visible/degraded 语义和独立 Step 16 test cut；Query 不持有 UoW、write、lock、probe 或 diagnostic emit capability。
7. **状态、测试和验收名称是否一致？**
   Step 6/10/16 使用同一 17 个状态主语与正式 string value；本步发现的历史别名和下游尚未存在的验收 ID 均进入冲突/待确认表，不由实施者自行改名。
8. **是否已经定义 phase/commit boundary？**
   没有。Step 17 只提供 boundary 输入清单和排除项；正式 phase/commit boundary 必须由 07 根据 03/05/06/07 一起定义，并在交付实现前逐 boundary 重审。
9. **哪些内容不能进入实施？**
   外部 owner DTO/method/error、`.qs-sync` 物理 schema/迁移/保留、Node/package/parser/test runner/Git library、LFS/浅克隆/GUI、自动 merge/rebase/push、Review Gate bypass、Artifact/Baseline/Workspace projection/Archive truth、真实测试/报告/evidence/readiness。

## 3. 当前文档问题诊断、改动对比与取舍

### 3.1 诊断

旧正式 03 与 README 以 Rust/Tauri、`SyncTask`、跨端 fanout、固定 metadata 文件和 Git LFS/浅克隆为中心；这些材料与当前 `TypeScript + ESM + single package + local-only truth` 基线冲突。前序 Step 已将其降级为 `historical_material`，并以 feature-first/layer-within-feature、typed port、分层 handoff 和保守状态取代。

当前仍有三类真实缺口：

1. 外部 truth/协议未闭合（`SYNC-UP-001~010`），正向 adapter 不能进入实施承诺。
2. 本地实现选择未闭合（`SYNC-LOCAL-001~005`），不能锁 runtime、package/bin、parser、test runner 或具体 Git 库。
3. 下游 `04/05/06/07` 尚未本轮重建，无法宣称配置、测试、验收或 phase boundary 的跨文档最终通过。

### 3.2 改动前后对比

| 主题 | 历史/未闭合口径 | Step 17 承接口径 |
|---|---|---|
| 实现形态 | Rust/Tauri 或未定 | TypeScript、ESM、Node-compatible、单 package，CLI+library；仓尚不存在。 |
| 业务边界 | 跨端同步器/平台状态混合 | 五 feature 只拥有 local session/binding/metadata/cursor/mapping/conflict/recovery/handoff/provenance。 |
| DTO | 任意字符串/unknown/provider body | closed discriminated unions、typed refs、readonly carriers；unknown 只能在 adapter 边界。 |
| 外部调用 | ACK/timeout 可被解释为成功 | durable prepare→call→probe/finalize；ACK≠accepted，unknown 不重放。 |
| Git/filesystem | remote push、merge/rebase、覆盖工作区 | 仅白名单观察/受保护 local apply；dirty/path/tool unknown fail-closed。 |
| metadata | 固定物理 `.qs-sync` 文件假设 | logical manifest/generation/UoW；物理 schema/迁移留 blocker。 |
| 交付 | 可能把测试/报告/证据当事实 | 只交付 planned design contracts；实现、run、artifact、report、evidence、readiness 全未创建。 |

### 3.3 设计取舍

| 决策 | 采用口径 | 理由 |
|---|---|---|
| 07 是否在此步拆 phase | 不拆 | SOP 要求 Step 17 承接而非重写实施计划；避免未读 05/06/07 时形成越界边界。 |
| 外部正向路径 | 保留 `blocked/unsupported/needs_action/probe_required` | 上游合同未闭合时仍可实现安全拒绝和状态保存，不能 fake-close。 |
| Query read model | 只读 view/slice/page | Sync 不拥有 Workspace projection；不存在 projection rebuild 任务。 |
| artifact/evidence | `not_applicable` 作为 Sync ownership | Sync 只物化 local working copy，不生成平台 Artifact/Baseline 或测试 evidence。 |
| telemetry | closed best-effort signal + durable local refs 分离 | 观测不可替代业务结果、provenance 或 review verdict。 |

## 4. 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 仓与入口 | Step 3/4；`03_ddd_step_04_units_file_layout.md` §7 | 在实现仓存在且 07 允许后，按 `src/index.ts`、`src/cli/cli_entry.ts` 和 planned tree 建立包；package/bin 名仍须先关闭 `SYNC-LOCAL-003`。 |
| 五 feature 边界 | Step 5；`03_ddd_step_05_module_contracts_axis.md` §7～§9 | 每个模块内按 domain/application/ports 实现；不得让 adapter、CLI 或 owner 成为第六 truth。 |
| 29 domain/technical objects | Step 6；`03_ddd_step_06_object_contracts.md` §7～§13 | 以 exact readonly fields、factory、transition、invariant 实现；缺字段回报设计，不在代码中自补。 |
| Port/repository/UoW | Step 7；`03_ddd_step_07_trait_port_adapter_contracts.md` §7～§14 | 先实现 inward contract/fake parity，再绑定真实 adapter；所有 mutable save 带 `Versioned<T>`、`expectedVersion` 和 UoW。 |
| Public protocols | Step 8；`03_ddd_step_08_protocol_contracts.md` §6～§12 | handler 只能使用 10 Command、13 Query、3 Consumer、3 Job 的正式名称；Outbound Event 不适用。 |
| Function flows | Step 9；`03_ddd_step_09_function_flows.md` §7～§10 | 每个入口保持独立 flow；先验证/准备/提交，再做 effect；Query zero-write。 |
| State matrices | Step 10；`03_ddd_step_10_state_matrix.md` §4～§13 | 只调用正式 transition helper；非法 pair 返回 typed error 且不写副作用。 |
| Persistence/consistency | Step 11；`03_ddd_step_11_persistence_transaction_consistency.md` | 维持 staged/committed 隔离、atomic visibility、commit unknown reload、append-only provenance。 |
| Error/recovery | Step 12；`03_ddd_step_12_error_recovery.md` | adapter 异常先归一；effect boundary 不明时保存 checkpoint/unknown，不 blind retry。 |
| Concurrency/idempotency | Step 13；`03_ddd_step_13_concurrency_idempotency.md` | 使用 `(channel, operation, key, digest)` namespaced identity；duplicate exact replay，digest 冲突拒绝。 |
| Config/composition | Step 14；`03_ddd_step_14_config_dependencies.md` | config 只能产生 typed capability snapshot；hard safety rules 不能被 override。 |
| Observability | Step 15；`03_ddd_step_15_observability_audit.md` | 采用 closed log/metric/span/diagnostic schema；sink failure 不改变业务结果。 |
| Test cuts | Step 16；`03_ddd_step_16_test_cuts.md` | 逐入口、逐状态、逐一致性/错误/幂等/配置/观测建立未来切口；不把 fake 当真实集成。 |
| 07 交付审计输入 | 本文件 §6～§13 | 07 必须把这些表映射到每个 phase/commit boundary，并重新审计正式 `03/05/06/07`。 |

## 5. 实施前置阅读清单

| 文档/材料 | 阅读目的 | 当前状态 |
|---|---|---|
| `projects/L5-sync/00-需求文档.md` | 需求、硬规则、VETO、上游 blocker | formal / stop_review |
| `projects/L5-sync/01-架构设计.md` | 五 feature、ownership、依赖方向与禁止边界 | formal / stop_review |
| `projects/L5-sync/02-概要设计.md` | 对象/接口/flow/state 骨架 | formal / stop_review |
| `projects/L5-sync/03-详细设计.md` | 实施 baseline；本轮 Step 19 后才存在可用正式版 | not yet assembled |
| `projects/L5-sync/design-calibration/03_ddd_step_01_upstream_boundary.md`～`03_ddd_step_16_test_cuts.md` | 追溯实现契约、问题诊断和阻塞处理 | completed calibration |
| `projects/L5-sync/design-calibration/project_execution_ledger.md` | 项目恢复点、授权、blocker 与写入范围 | mandatory recovery source |
| `standards/document/实施计划书写规范.md` | phase/commit boundary、实施台账、Commit/Handoff Gate | mandatory |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段/DTO/view/state/metadata/boundary 审计 | mandatory |
| `standards/document/详细设计书写规范.md` | 正式 03 章节与可落码性要求 | mandatory |
| `standards/document/详细设计讨论流程_SOP.md` | Step 17/18/19 生成纪律 | mandatory |
| `standards/coding/typescript.md` | TypeScript naming、JSDoc、strict/unknown/ESM 实现约束 | mandatory |
| `standards/coding/rust.md` | 按 SOP 记录 Rust 对本项目 `not_applicable`，不作为实现栈 | read for applicability only |
| `standards/document/子项目目录与代码文件组织规范.md` | 设计仓/实现仓路径和禁止层级泄漏 | mandatory |
| `projects/README.md` | 项目文档链、提交和仓命名约定 | mandatory |
| `L0-sdk`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-archive`、`L4-observability` 当前正式文档/必要台账 | owner truth、runtime collaboration、边界核验 | upstream read; positive contracts pending |
| 目标实现仓 git config | 确认实现仓身份与提交者 | target repo absent；不得假设已配置 |

实施者不得把上述阅读清单压缩为“只看正式 03”，也不得以旧 README、旧正式 03 或 draft 替代当前正式文档与 calibration。

## 6. 真相源表

本表把一个设计事实绑定到唯一来源。`03-详细设计.md` 在 Step 19 装配后只能引用这些来源，不能重新定义同名类型。`05/06/07` 尚未重建，因此下游栏中的 `pending` 是真实状态，不是隐含通过。

| 设计事实 | 唯一真相源 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 五个业务 feature 与 ownership | `projects/L5-sync/01-架构设计.md` | §5～§10；`03_ddd_step_05_module_contracts_axis.md` | 03 §5、07 phase scope | 以 01 为边界；旧 README/旧 03 不得覆盖。 |
| TypeScript/ESM/single package 与 planned tree | `03_ddd_step_03_coding_runtime_constraints.md`、`03_ddd_step_04_units_file_layout.md` | §7、§8 | 03 §3/§4、07 开工检查 | `SYNC-LOCAL-001~005` 未闭合时只保留 pending。 |
| 29 个对象及字段/函数 | `03_ddd_step_06_object_contracts.md` | §7～§13 | 03 §5/§6、05/06/07 | 以 Step 6 exact interface 和表格为准；实现不得自补。 |
| Port/repository/UoW callable surface | `03_ddd_step_07_trait_port_adapter_contracts.md` | §7～§14 | 03 §5/§10、07 boundary | physical adapter/schema 缺口回流 `SYNC-UP-001/006/007`。 |
| 10 Command/13 Query/3 Consumer/3 Job 名称与 DTO | `03_ddd_step_08_protocol_contracts.md` | §6～§12 | 03 §7/§8、05/06 | `EventName` 与 `ConsumerName` 不互换；Outbound Event=`not_applicable`。 |
| 29 条处理流及副作用顺序 | `03_ddd_step_09_function_flows.md` | §5～§10 | 03 §8、05/06/07 | flow 与协议冲突时先回写 Step 8/9，不让实现选择。 |
| 17 个 lifecycle state 与转换 | `03_ddd_step_10_state_matrix.md` | §4～§13 | 03 §9、05/06/07 | 以状态矩阵和 transition helper 为准；旧状态名禁用。 |
| logical persistence、UoW、commit ambiguity | `03_ddd_step_11_persistence_transaction_consistency.md` | §5～§14 | 03 §10、07 boundary | 不用物理文件/数据库假设补齐 `SYNC-UP-006`。 |
| 错误、unknown 与恢复 | `03_ddd_step_12_error_recovery.md` | §5～§15 | 03 §11、05/06/07 | timeout/exception 不能被解释为 zero-effect。 |
| 并发、幂等、重入 | `03_ddd_step_13_concurrency_idempotency.md` | §7～§19 | 03 §12、07 boundary | namespaced key + request digest 是唯一判定口径。 |
| config/capability/runtime snapshot | `03_ddd_step_14_config_dependencies.md` | §7～§17 | 03 §13、04、07 | typed snapshot 不等于 authorized/healthy/ready。 |
| telemetry/audit/redaction | `03_ddd_step_15_observability_audit.md` | §7～§18 | 03 §14、05/06 | signal 不能替代 durable provenance 或 verdict。 |
| 最小测试切口 | `03_ddd_step_16_test_cuts.md` | §7～§18 | 03 §15、05/06/07 | 当前只承接切口 ID；不声称测试已创建或运行。 |
| 实施承接与整体审计责任 | 本文件 | §4、§10～§13 | 07 §3/§5/§7 | 07 必须按每个 boundary 重新审计正式 03/05/06/07。 |
| Project/Artifact/Baseline/Workspace projection/Gate/Archive/Git remote truth | 各 owner 正式文档 | 上游边界映射见 Step 1、正式 01 §5 | owner/SDK adapter | Sync 只能保存 ref/snapshot/decision layer，不复制或反写。 |
| `.qs-sync` 物理 schema、迁移和保留 | 尚无已确认来源 | `SYNC-UP-006` | 04/07 | 保持 logical contract；不得指定文件名、表名或删除语义。 |
| phase/commit boundary、验收 ID、evidence ID | 尚未产生正式 07/06 | 本文件 §11 | 07、实现台账 | `not_assigned`；不得在 03 伪造编号。 |

## 7. 字段闭环表

下表按对象逐一列出当前 boundary 的必填字段族。字段族中的成员以 Step 6 的 exact interface 为准；`Optional<T>` 只表示协议允许的显式 `null`，不表示实现可省略字段。每一行都给出构造入口、缺失处理和最小测试切口；验收证据在 06 尚不存在，统一记为 `pending/not_created`。

| Domain 对象 | 字段（完整族） | 类型/来源 | 构造入口 | DTO / Event / Job 字段 | 缺失处理 | 测试切口 | 验收证据 |
|---|---|---|---|---|---|---|---|
| `SyncOperation` | `operationId`, `operationKind`, `selectionRef`, `state`, `correlationRef`, `runtimeBindingSnapshotRef`, `activeCheckpointRef`, `lastTransitionRef` | local ID/command kind/selection repository/`SyncOperationState`/envelope correlation/immutable runtime snapshot/checkpoint/transition factory | `planSyncMutation(...)` | 10 Command request metadata；Command result `operationRef`, checkpoint | reject missing explicit context or snapshot; no default | `TC-SYNC-CMD-001..010`; `TC-SYNC-STATE-001` | pending |
| `SyncSelection` | `principalRef`, `projectRef`, `versionRef`, `sourceRef`, `targetRef`, `operationKind` | explicit command body + actor principal; no Git/cache/latest derivation | `createExplicitSyncSelection(...)` | `ExplicitSyncSelectionDto` | validation reject; never infer | `TC-SYNC-ERR-001`; `TC-SYNC-CMD-001/004/009` | pending |
| `AccessEvaluation` | `evaluationId`, `selectionRef`, `requestedAction`, `outcome`, `ownerSnapshotRefs`, `reasonSet`, `freshnessState`, `evaluatedAt` | ID/selection/action/owner safe results/policy reasons/snapshot freshness/clock | `evaluateAccess(...)` | access checks in Command flows; `AccessEvaluationView` | missing owner result→blocked/unknown; no allow default | `TC-SYNC-CMD-001/004/009`; `TC-SYNC-STATE-002/003` | pending |
| `OperationEligibilityPolicy` | `requiredCheckSet`, `stalenessRule`, `hardBlockerSet` | compiled policy/config with hard gates | `createOperationEligibilityPolicy(...)` | composition capability snapshot | missing rule or disabled hard gate→composition blocked | `TC-SYNC-CONFIG-003/005`; `TC-SYNC-STATE-002` | pending |
| `ExternalOwnerSnapshot` | `snapshotId`, `ownerKind`, `subjectRef`, `sourceVersionRef`, `freshnessState`, `visibilityState`, `safeStateSummary`, `observedAt` | validated owner adapter result + local ID/clock; no body/credential | `captureExternalOwnerSnapshot(...)` | consumer payloads / decision read result / owner snapshot views | malformed/unknown→unavailable/unknown; retain old record | `TC-SYNC-QRY-001/011`; `TC-SYNC-ERR-009`; `TC-SYNC-JOB-003` | pending |
| `WorkingCopyBinding` | `bindingId`, `selectionRef`, `targetRef`, `generation`, `state`, `metadataManifestRef`, `provenanceRootRef`, `lastObservationRef` | explicit selection + filesystem canonical target + local generation/manifest/provenance | `initializeWorkingCopyBinding(...)` / `explicitlyRebindWorkingCopy(...)` | Clone/Rebind DTOs; binding view | unsafe target or missing manifest→blocked/needs-rebind; never overwrite | `TC-SYNC-CMD-001/003`; `TC-SYNC-STATE-004`; `TC-SYNC-CONC-TARGET-001` | pending |
| `MetadataManifest` | `manifestId`, `schemaRef`, `generation`, `integrityState`, `bindingRef`, `cursorStateRef`, `mappingSetRef`, `activeOperationRefs`, `protectedProvenanceRefs`, `lastTransitionRef` | local logical store/UoW; schema support remains blocker | `initializeMetadataManifest(...)` / `migrateMetadataGeneration(...)` | Migration/Rebind result; metadata health view | dangling/corrupt/unsupported→degraded; no query repair/delete | `TC-SYNC-QRY-004`; `TC-SYNC-JOB-001`; `TC-SYNC-STATE-005` | pending |
| `CursorState` | `cursorStateId`, `bindingRef`, `generation`, `sourceObservedCursorRef`, `localAppliedCursorRef`, `continuityState`, `comparatorRef`, `lastRunRef` | source adapter result + local generation/run; comparator must be formal | `initializeCursorState(...)`, `finalizeAppliedCursor(...)` | Pull result cursor refs; materialization status | gap/unknown/unsupported preserves applied cursor; no guessed advance | `TC-SYNC-CMD-004`; `TC-SYNC-STATE-006`; `TC-SYNC-PERSIST-002` | pending |
| `MappingSet` | `mappingSetId`, `bindingRef`, `generation`, `entrySet`, `mappingVersionRef`, `integrityState`, `lastRunRef` | source delta/path mapping/local version; entry tuple exact typed | `initializeMappingSet(...)`, `prepareFinalizedMappingChanges(...)` | Pull result/status; no external mapping body | collision/unknown→typed degraded; no auto choice | `TC-SYNC-STATE-007`; `TC-SYNC-PERSIST-002` | pending |
| `WorkingCopyObservation` | `observationId`, `targetRef`, `gitHeadRef`, `workingTreeState`, `pathSafetyState`, `lockState`, `toolCapabilitySet`, `contentFingerprintRef`, `observedAt` | read-only Git/filesystem/tool adapter + clock | `captureWorkingCopyObservation(...)` | `InspectWorkingCopy` view; plan/candidate sidecar | raw/malformed tool output→safe unavailable; query keeps in memory | `TC-SYNC-QRY-005`; `TC-SYNC-CONC-DIRTY-001` | pending |
| `WorkingCopySafetyPolicy` | `protectedChangeSet`, `pathGuardRule`, `requiredCapabilitySet` | compiled hard safety rules | `createWorkingCopySafetyPolicy(...)` | runtime capability snapshot | missing/non-overwrite rule→composition blocked | `TC-SYNC-CONFIG-003/007`; `TC-SYNC-STATE-009` | pending |
| `MetadataIntegrityPolicy` | `supportedSchemaRule`, `referenceClosureRule`, `provenanceProtectionRule` | compiled schema/closure/protection rules | `createMetadataIntegrityPolicy(...)` | config/composition | unsupported rule→blocked; no silent repair | `TC-SYNC-QRY-004`; `TC-SYNC-JOB-001` | pending |
| `MaterializationPlan` | `planId`, `operationRef`, `runtimeBindingSnapshotRef`, `bindingRef`, `bindingGeneration`, `accessEvaluationRef`, `sourceDeltaRef`, `pathChangeSetRef`, `preconditionFingerprintRef`, `targetCursorRef`, `state`, `consumedByRunRef` | local IDs + persisted refs + bounded digest/source cursor | `draftMaterializationPlan(...)` / `validateMaterializationPlan(...)` | Pull/Clone result refs; status view | context/fingerprint/gap mismatch→invalidated/blocked; no replan in query | `TC-SYNC-CMD-001/004`; `TC-SYNC-STATE-008`; `TC-SYNC-CONC-APPLY-001` | pending |
| `SourceDelta` | `sourceDeltaId`, `sourceRef`, `fromCursorRef`, `toCursorRef`, `deltaKind`, `sourceItemChangeSet`, `comparatorRef`, `continuityProofRef`, `sourceDigestRef` | formal source adapter output; comparator/proof from owner contract | `sourceDeltaFromOwnerResult(...)` | Pull result/status; no raw source body | missing comparator/authority→gap/unsupported/blocked | `TC-SYNC-CMD-004`; `TC-SYNC-STATE-006`; `TC-SYNC-CONFIG-011` | pending |
| `PathChangeSet` | `pathChangeSetId`, `rootTargetRef`, `changeEntries`, `mappingChangeSet`, `affectedPathFingerprintSet`, `safetyState`, `conflictHintSet` | delta + mapping + canonical root + filesystem policy | `derivePathChangeSet(...)` / `evaluatePathChangeSafety(...)` | Pull result and conflict view refs | unsafe/unknown/symlink/collision→conflict/blocked; no overwrite | `TC-SYNC-STATE-009`; `TC-SYNC-ERR-006` | pending |
| `MaterializationRun` | `runId`, `planRef`, `checkpointRef`, `state`, `appliedSegmentRefs`, `resultFingerprintRef`, `finalizedCursorRef`, `finalizedMappingVersionRef`, `finalizedProvenanceRef` | durable prepare + bounded local apply result + UoW finalize | `prepareMaterializationRun(...)` / `finalizeMaterializationRun(...)` | Clone/Pull result; materialization status | ambiguous apply→`OutcomeUnknown`; partial→`Partial`; cursor unchanged | `TC-SYNC-STATE-010`; `TC-SYNC-PERSIST-002/006`; `TC-SYNC-CONC-FINALIZE-001` | pending |
| `MaterializationSafetyPolicy` | `requiredAccessRule`, `continuityRule`, `pathRule`, `nonOverwriteRule`, `finalizeRule` | compiled hard policy; exact fields in Step 6 | `createMaterializationSafetyPolicy(...)` | composition capability snapshot | missing hard rule→blocked; cannot relax by config | `TC-SYNC-CONFIG-003/007`; `TC-SYNC-STATE-010` | pending |
| `ConflictRecord` | `conflictId`, `operationRef`, `conflictKind`, `state`, `affectedRefSet`, `basisSummary`, `checkpointRef`, `manualResolutionRef`, `detectedAt`, `closeResultRef` | local detection + typed basis + checkpoint/resolution/result refs | `detectSyncConflict(...)` / `closeConflict(...)` | conflict result/view; no file body | missing basis→integrity defect; close requires known-safe result | `TC-SYNC-CMD-005`; `TC-SYNC-STATE-011`; `TC-SYNC-QRY-007/008` | pending |
| `RecoveryCheckpoint` | `checkpointId`, `operationRef`, `stage`, `state`, `inputFingerprintRef`, `completedStepSet`, `nextAction`, `relatedAttemptRef`, `capturedAt`, `completionResultRef` | pre-effect durable carrier + local progress; no self-certification | `captureRecoveryCheckpoint(...)` / `requireCheckpointProbe(...)` | Resume/Probe request/result | no prior attempt or fingerprint drift→invalidated/probe-required | `TC-SYNC-CMD-006/007`; `TC-SYNC-STATE-012`; `TC-SYNC-PERSIST-004/005` | pending |
| `ManualResolution` | `resolutionId`, `conflictRef`, `actorRef`, `decisionKind`, `scope`, `state`, `requiredRevalidationSet`, `recordedAt`, `appliedResultRef` | explicit human actor/request; bounded scope | `recordManualResolution(...)` / `validateManualResolution(...)` | RecordConflictResolution DTO/result | system actor/scope escape→rejected; intent never equals effect | `TC-SYNC-CMD-005`; `TC-SYNC-STATE-013`; `TC-SYNC-ERR-006` | pending |
| `ProbeRecord` | `probeId`, `attemptRef`, `probeKind`, `state`, `idempotencyContextRef`, `invocationRef`, `safeResultSummary`, `externalResultRef`, `observedAt` | formal probe prepare/call/result; prior attempt required | `prepareProbeRecord(...)` / `resolveProbeKnown(...)` | Probe request/result; handoff layers | no prior attempt→reject; still unknown→no replay | `TC-SYNC-CMD-007`; `TC-SYNC-STATE-014`; `TC-SYNC-ERR-007` | pending |
| `RecoverySafetyPolicy` | `localReentryRule`, `externalSideEffectRule`, `fingerprintMatchRule`, `protectedHistoryRule` | compiled recovery rules | `classifyRecoveryNextAction(...)` | config/composition | missing rule→stop/blocked; no force retry option | `TC-SYNC-CMD-006`; `TC-SYNC-STATE-012/013/014` | pending |
| `ReviewCandidate` | `candidateId`, `operationRef`, `runtimeBindingSnapshotRef`, `bindingRef`, `bindingGeneration`, `sourceRef`, `localObservationRef`, `candidateDigestRef`, `includedPathScope`, `state`, `eligibilityEvaluationRef`, `handoffAttemptRef` | current local facts + policy evaluation + freeze digest | `inspectReviewCandidate(...)` / `freezeReviewCandidate(...)` | PushReviewCandidate result; handoff view | dirty/drift/archived/unknown→not eligible; no Git commit elevation | `TC-SYNC-CMD-009`; `TC-SYNC-STATE-015`; `TC-SYNC-CONC-CANDIDATE-001` | pending |
| `HandoffAttempt` | `attemptId`, `candidateRef`, `runtimeBindingSnapshotRef`, `governanceTargetRef`, `idempotencyContextRef`, `state`, `invocationRef`, `transportOutcome`, `externalHandoffRef`, `probeRecordRef`, `decisionSnapshotRef`, `preparedAt`, `unknownCheckpointRef` | frozen candidate + durable prepare + transport/probe/owner refs | `prepareHandoffAttempt(...)` / `recordHandoffTransport(...)` | Push/Refresh result and status | unknown response→checkpoint/probe-required; ACK not accepted | `TC-SYNC-CMD-009/010`; `TC-SYNC-STATE-016`; `TC-SYNC-CONC-HANDOFF-001` | pending |
| `ProvenanceRecord` | `provenanceId`, `relationKind`, `subjectRef`, `sourceRefSet`, `parentProvenanceRefs`, `integrityDigestRef`, `state`, `recordedAt`, `redactionMarker`, `supersededByRef` | local append-only relation + digest/ref closure | `recordProvenanceRelation(...)` / `markProvenanceIntegrityUnknown(...)` | all mutation/consumer/job sidecars; no public body | missing parent/digest mismatch→integrity unknown; never fabricate/delete | `TC-SYNC-STATE-017`; `TC-SYNC-PERSIST-007`; `TC-SYNC-CONC-PROV-001` | pending |
| `CandidateEligibilityPolicy` | `requiredCandidateCheckSet`, `driftRule`, `conflictClearanceRule` | compiled hard-gate policy | `evaluateCandidateEligibility(...)` | Push composition | missing check→blocked/unknown, never eligible | `TC-SYNC-CMD-009`; `TC-SYNC-CONFIG-003/005` | pending |
| `HandoffResultPolicy` | `resultLayerRule`, `elevationProhibitionRule`, `unknownHandlingRule` | compiled layer/elevation policy | `assembleHandoffStatus(...)` | Push/Refresh/Get handoff views | missing layer rule→blocked/degraded; no accepted shortcut | `TC-SYNC-CMD-009/010`; `TC-SYNC-OBS-002/009` | pending |
| `LayeredHandoffStatus` | `runtimeBindingSnapshotRef`, `candidateState`, `attemptState`, `transportState`, `probeState`, `externalDecisionState`, `blockerSet`, `nextActionSet`, `freshnessSummary` | persisted slices + pure assembly; no owner refresh | `buildLayeredHandoffStatus(...)` | `GetReviewHandoffStatus` and command result | missing/restricted slice explicit; ACK remains transport | `TC-SYNC-QRY-011`; `TC-SYNC-STATE-016`; `TC-SYNC-OBS-009` | pending |
| `SyncStatusView` | `selectionSummary`, `accessSummary`, `bindingSummary`, `cursorSummary`, `workingCopySummary`, `materializationSummary`, `conflictRecoverySummary`, `handoffSummary`, `provenanceSummary`, `degradedReasonSet`, `readCompleteness` | read-only slices + optional ephemeral observation | `assembleSyncStatusView(...)` | `GetSyncStatus` response | missing/unavailable/partial explicit; no empty-clean synthesis | `TC-SYNC-QRY-010`; `TC-SYNC-QUERY-NOWRITE-001` | pending |

字段闭环结论：29 个对象均有唯一构造入口或纯策略 factory；每个跨对象 ref 必须由 repository/port 正式读取面提供，不能从 opaque string、cursor、Git commit、ACK、日志或当前 config 反推。 `projection rebuild` 对 Sync 为 `not_applicable`；`artifact materialization/evidence generation` 对 Sync 也为 `not_applicable`。

## 8. DTO / Event / Job 到 Domain 构造闭环表

| 输入契约 | 目标 Domain 对象 / view | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失、重复或阻塞行为 | 关联处理流 |
|---|---|---|---|---|---|---|
| `CloneWorkingCopyRequest` | `SyncSelection` → `SyncOperation` → `WorkingCopyBinding`/`MetadataManifest`/`MaterializationPlan`/`MaterializationRun`/`CursorState`/`MappingSet` | 是（selection、scope、target precondition）；local IDs/snapshot refs由正式 factory 生成 | actor+selection、canonical target、source delta、observation fingerprint、UoW-generated refs | `targetRef` ≠ `CanonicalLocalTargetRef`；Git HEAD ≠ source cursor；local commit ≠ Artifact/Baseline | 缺显式 ref、empty scope 未获全量语义、owner/source/metadata capability 缺失→validation/blocked；duplicate exact replay | `CloneWorkingCopyFlow` |
| `MigrateSyncMetadataRequest` | `MetadataManifest`、`WorkingCopyBinding` 新 generation | 是（binding、expected generation、target schema） | migration policy + new generation + provenance relation | target schema ref ≠ physical filename/version guess；new generation ≠ in-place overwrite | schema unsupported/corrupt/expected-version conflict→blocked/failed-known；不得 query auto-repair | `MigrateSyncMetadataFlow` |
| `RebindWorkingCopyRequest` | 新 `WorkingCopyBinding`、`MetadataManifest`、`ProvenanceRecord` | 是（prior binding、new explicit selection、prior generation、reason） | canonical target/ID/generation/provenance by local factory | new selection ≠ prior binding mutation；rebind reason ≠ owner authorization | mismatch/dirty/provenance gap→needs-action/blocked；prior identity保留 | `RebindWorkingCopyFlow` |
| `PullWorkingCopyRequest` | `SyncSelection`、`MaterializationPlan`、`SourceDelta`、`PathChangeSet`、`MaterializationRun`、cursor/mapping revisions | 是（selection、binding、generation、path scope）；delta fields依赖 source contract | source adapter comparator/proof；path mapping；local fingerprint | empty change set ≠ `NoOp` proof；source cursor ≠ applied cursor；path scope不得扩大 | gap/unsupported/dirty/path unknown→blocked/conflict/needs-action；不自动 full/merge/rebase | `PullWorkingCopyFlow` |
| `RecordConflictResolutionRequest` | `ManualResolution`、`ConflictRecord` revision | 是（conflict、decision、bounded scope、revalidation set） | human actor + local ID/time | intent ≠ applied result；KeepLocal/ApplySource ≠ force overwrite | system actor、scope escape、stale conflict→rejected；zero file/cursor calls | `RecordConflictResolutionFlow` |
| `ResumeSyncOperationRequest` | `RecoveryCheckpoint` classification、new plan/run或 probe record | 是（operation、checkpoint、fingerprint、optional validated resolution） | current persisted context + policy decision | `force`/`retryAnyway` 不存在；checkpoint ref ≠ result ref | drift→invalidate/replan；possible effect→ProbeRequired；无 checkpoint→reject | `ResumeSyncOperationFlow` |
| `ProbeUnknownOutcomeRequest` | `ProbeRecord`、`HandoffAttempt`/`RecoveryCheckpoint` layered update | 是（prior attempt、checkpoint、probe kind、idempotency context） | formal probe result/observed time/safe summary | probe result ≠ original submit result；known ≠ accepted | no prior attempt→invalid；unsupported/still unknown→explicit state；不 resubmit | `ProbeUnknownOutcomeFlow` |
| `CancelSyncOperationRequest` | `SyncOperation`→Cancelled、checkpoint/effect posture、provenance | 是（operation、cancellation reason） | local actor/time/result refs | local cancel ≠ remote cancel；possible external effect ≠ none | terminal/missing/version conflict→typed error；retain possible effect refs | `CancelSyncOperationFlow` |
| `PushReviewCandidateRequest` | `ReviewCandidate`、`CandidateEligibilityEvaluation`、`HandoffAttempt`、`ProvenanceRecord` | 是（selection、binding/generation、scope、governance target） | observation/digest/policy evaluation; durable attempt identity | governance target ≠ Gate/Decision; candidate digest ≠ Artifact digest; Git commit ≠ Artifact/Baseline | dirty/drift/archived/open conflict/contract blocked→blocked/needs-action；ACK只入 transport | `PushReviewCandidateFlow` |
| `RefreshReviewHandoffStatusRequest` | `ProbeRecord` 或 owner snapshot + `HandoffAttempt`/`ProvenanceRecord` revision | 是（operation、attempt、optional external ref） | attempt state routes exactly one formal read/probe capability | external handoff ref ≠ Decision ref；read ≠ submit；probe ≠ accepted | missing/restricted/ambiguous→unknown/degraded；不得创建 Decision | `RefreshReviewHandoffStatusFlow` |
| `ConsumeAccessOrPostureInvalidated` | `ExternalOwnerSnapshot`/`AccessEvaluation` stale + affected plan/candidate conservative revisions + `ConsumerReceipt` | formal envelope contract 尚未闭合，故当前为 `blocked` | official source/order/target resolver (pending) | event name ≠ consumer name；raw payload ≠ local record | duplicate exact receipt；invalid source/version→quarantine；不取消/拉取/交接 | `ConsumeAccessOrPostureInvalidatedFlow` |
| `ConsumeMaterialSourceInvalidated` | `CursorState` Unknown、plan/candidate Invalidated、receipt/provenance | formal envelope/source mapping `blocked` | official source ref/cursor marker/target resolver (pending) | source invalidation ≠ pull request；applied cursor ≠ observed invalidation marker | unmatched/ambiguous→quarantine；Finalized history不回写 | `ConsumeMaterialSourceInvalidatedFlow` |
| `ConsumeReviewDecisionChanged` | body-free owner snapshot + matching `HandoffAttempt` + receipt/provenance | formal Governance event `blocked` | external handoff/decision ref exact lookup | decision event ≠ local acceptance；snapshot ≠ Decision ownership | unmatched/restricted→quarantine/blocked；不创建 Gate/Decision | `ConsumeReviewDecisionChangedFlow` |
| `ScanMetadataIntegrity` | per-item `MetadataIntegrityState`/manifest conservative transition + `SyncJobReport` | 是（job scope/page/metadata/idempotency）；physical record schema pending | repository summaries + integrity policy | local job report ≠ formal report/evidence；scan ≠ repair/migrate | partial/duplicate exact replay；不得自动 repair/delete | `ScanMetadataIntegrityFlow` |
| `ProbePendingHandoffAttempts` | per-item `ProbeRecord`/attempt/checkpoint + `PendingHandoffProbeJobResult` | 是（scope xor persisted ProbeRequired、page、job metadata） | persisted attempt list + formal probe outcome | probe job ≠ submit/retry；batch complete ≠ all resolved/accepted | duplicate returns stored full result；still unknown retained | `ProbePendingHandoffAttemptsFlow` |
| `MarkStaleOwnerSnapshots` | `ExternalOwnerSnapshot` freshness + affected evaluation/plan/candidate conservative propagation + job report | 是（subject/filter/page/evaluatedAt） | formal freshness rule + persisted timestamps/versions | local time ≠ owner authorization TTL；stale ≠ refresh | no owner call；non-Fresh不恢复 Fresh；per-item conflict explicit | `MarkStaleOwnerSnapshotsFlow` |

构造闭环结论：10 Command 与 3 Job 的字段均可回指 Step 6 factory/Step 7 port/Step 9 flow；3 Consumer 仅有保守 handler contract，正式 source/schema/topic 未闭合前不能形成 accepted branch。无 outbound event，因此不存在 event→domain 或 outbox publisher 构造链。

## 9. Query response / view 闭环表

所有 Query 都走 read-only composition：`LocalStateUnitOfWorkPort.begin=0`、idempotency reserve/complete=0、write repository/metadata lock/probe/handoff/diagnostic emit=0。即时 Git/filesystem observation 只在内存中存在，不能变成 persisted truth。

| Query | Response DTO / View / page | 核心字段与正式来源 | empty / not visible / degraded 口径 | public id/ref 与读取面 | 测试切口 |
|---|---|---|---|---|---|
| `GetAccessEvaluation` | `SyncQueryResponse<AccessEvaluationView>` | evaluation ref/outcome/action/freshness/reason；evaluation + owner snapshot repos | missing evaluation=`missing`；visibility=`not_visible`；snapshot缺失/过期=`partial` | selector xor by-ref/by-context；不 refresh owner | `TC-SYNC-QRY-001` |
| `GetSyncOperation` | `SyncQueryResponse<SyncOperationView>` | operation ref/state/selection/checkpoint/result/provenance refs；operation repo + typed sidecar reads | absent/not-visible explicit；checkpoint/result carrier missing=`partial`/consistency defect | `SyncOperationRef` 只作 operation repo key，不反推 selection | `TC-SYNC-QRY-002` |
| `GetWorkingCopyBinding` | `SyncQueryResponse<WorkingCopyBindingView>` | binding/generation/state/manifest/provenance/observation summary；binding target index + manifest repo | missing/not-visible explicit；manifest summary unavailable=`partial` | by-ref xor by-target；target resolver/index由 port提供 | `TC-SYNC-QRY-003` |
| `GetMetadataHealth` | `SyncQueryResponse<MetadataHealthView>` | manifest integrity/schema/generation/ref summary；metadata repo + pure policy | dangling/corrupt/unknown不得变 empty-valid；page outage=`unavailable/partial` | manifest ref是 typed key；不 scan/repair | `TC-SYNC-QRY-004` |
| `InspectWorkingCopy` | `SyncQueryResponse<WorkingCopyObservationView>` | target/gitHead/tree/path/lock/tool/fingerprint/observedAt；read-only Git/fs ports | unsafe/unknown/unavailable 显式；raw output redacted | target canonicalization由 filesystem port；不 persist observation | `TC-SYNC-QRY-005` |
| `GetMaterializationStatus` | `SyncQueryResponse<MaterializationStatusView>` | operation/plan/run/checkpoint/cursor/mapping states；repositories | missing run=`missing`；AppliedPendingFinalize/OutcomeUnknown不能折叠 completed | run/plan refs只读 typed keys；不 source/apply | `TC-SYNC-QRY-006` |
| `GetConflict` | `SyncQueryResponse<ConflictView>` | conflict state/kind/affected refs/basis/checkpoint/resolution/next action；conflict repo | missing/not-visible/related record missing=`partial`；不隐藏 unknown | conflict ref不直接解析文件路径正文 | `TC-SYNC-QRY-007` |
| `ListConflicts` | `SyncPageResponse<ConflictView>` | scoped conflict rows + state/filter + opaque page cursor；index/list port | empty visible page ≠ scope missing；hidden/unavailable explicit | 至少 operation/binding scope；public cursor不等于 source cursor | `TC-SYNC-QRY-008` |
| `GetRecoveryStatus` | `SyncQueryResponse<RecoveryStatusView>` | checkpoint/attempt/probe/run persisted slices + pure next-action classification | missing/stale/mismatch explicit；建议不是 transition | operation/checkpoint selector；不 re-observe/probe | `TC-SYNC-QRY-009` |
| `GetSyncStatus` | `SyncQueryResponse<SyncStatusView>` | CP1～CP5 summaries + optional ephemeral observation；`SyncStatusReadPort` | each slice present/missing/not-visible/unavailable；`CompleteRead`≠ready/success | binding/target scope由正式 resolver/read port；不创建 projection | `TC-SYNC-QRY-010` |
| `GetReviewHandoffStatus` | `SyncQueryResponse<LayeredHandoffStatus>` | candidate/attempt/transport/probe/external snapshot layers；status port + typed repos | candidate/attempt至少一个；ACK-only保持 transport；owner missing不默认为 accepted | candidate/attempt ref；不读 Decision 以补结果、不 probe | `TC-SYNC-QRY-011` |
| `GetProvenance` | `SyncPageResponse<ProvenanceView>` | body-free relation/parent/state/digest/redaction；provenance repo graph/page | empty graph与missing subject分开；cycle/missing parent=`partial/degraded` | subject resolver/list port提供 scope；不拼 parent ref | `TC-SYNC-QRY-012` |
| `GetSyncDiagnosticSummary` | `SyncQueryResponse<SyncDiagnosticSummaryView>` | persisted safe slices + capability snapshot；diagnostic read port | existing scope无记录=`empty-present`；slice outage=`partial/unavailable` | operation/correlation至少一个；不读 telemetry sink | `TC-SYNC-QRY-013` |

Query 闭环结论：每个 response view 的字段来源、缺失/可见性/降级语义和 public selector 均已指定；任何 view 不得用空数组、`success=true` 或错误文本代替正式 marker。`projection rebuild` 不适用，因为 Sync 不拥有 Workspace projection。

## 10. 状态闭环表

状态真相源为 `03_ddd_step_10_state_matrix.md`，实现只调用 Step 6 对应 transition helper。Step 16 测试 ID 已逐状态列出；06 的验收引用当前尚未创建，不伪造 `AC-*`。

| 状态枚举 / 主语 | 正式状态值（全集） | 产生/推进函数 | 合法迁移摘要 | 禁止迁移与副作用红线 | 测试切口 | 验收引用 |
|---|---|---|---|---|---|---|
| `SyncOperationState` | `planned`, `validating`, `ready`, `running`, `needs_action`, `completed`, `cancelled`, `failed_known` | `planSyncMutation`, `beginOperationValidation`, `markOperationReady`, `beginOperationStage`, `requireOperationAction`, `completeLocalOperation`, `cancelSyncOperation`, `failOperationKnown` | Planned→Validating→Ready→Running→Completed；active→Cancelled/FailedKnown；NeedsAction→Validating | terminal reopen；Completed不代表 Artifact/Baseline/Review accepted；Query不推进 | `TC-SYNC-STATE-001` | pending |
| `EligibilityOutcome` | `eligible`, `denied`, `blocked`, `unknown`, `stale` | `evaluateAccess`, `markAccessEvaluationStale`, `blockAccessEvaluation` | factory结论；positive→Stale；Eligible/Denied/Unknown→Blocked | stale/unknown→eligible；缺 check 不默认 allow | `TC-SYNC-STATE-002` | pending |
| `FreshnessState` | `fresh`, `stale`, `unknown`, `invalidated`, `unavailable` | `captureExternalOwnerSnapshot`, `invalidateOwnerSnapshot`, staleness job | Fresh→Stale/Invalidated/Unavailable | non-fresh→Fresh；本地 clock 不恢复 owner freshness | `TC-SYNC-STATE-003` | pending |
| `WorkingCopyBindingState` | `initializing`, `bound`, `restricted`, `needs_migration`, `needs_rebind`, `invalidated` | `initializeWorkingCopyBinding`, `markBindingBound`, `restrictBinding`, migration/rebind/invalidate helpers | Initializing→Bound；Bound→restricted/migration/rebind/invalidated；migration→new generation Bound | Restricted/Invalidated 原地复活；silent selection rewrite；unknown apply→Bound | `TC-SYNC-STATE-004` | pending |
| `MetadataIntegrityState` | `valid`, `needs_migration`, `corrupt`, `unknown`, `read_only_protected` | `initializeMetadataManifest`, `markManifestIntegrity`, migration policy | Valid→degraded；protected refs可追加保护 | query/scan repair；degraded→Valid 无迁移；删除 protected refs | `TC-SYNC-STATE-005` | pending |
| `CursorContinuityState` | `unset`, `continuous`, `gap`, `unknown`, `unsupported` | `initializeCursorState`, `observeSourceCursor`, `markCursorGap/Unknown/Unsupported`, `finalizeAppliedCursor` | Unset→Continuous；Continuous self-advance；degraded分类 | gap/unknown→Continuous 无 proof；Git commit/time替代 comparator；observe即 advance | `TC-SYNC-STATE-006` | pending |
| `MappingIntegrityState` | `valid`, `conflict`, `unknown`, `invalidated` | `initializeMappingSet`, `markMappingConflict/Unknown`, finalize/resolution helpers | Valid→Conflict/Unknown/Invalidated；known resolution新 revision→Valid | actor intent直接 Valid；cross-generation复活；missing entry默认 valid | `TC-SYNC-STATE-007` | pending |
| `MaterializationPlanState` | `draft`, `validated`, `invalidated`, `consumed` | `draftMaterializationPlan`, `validateMaterializationPlan`, `invalidateMaterializationPlan`, `consumeMaterializationPlan` | Draft→Validated；Draft/Validated→Invalidated；Validated→Consumed once | Draft→Consumed；Consumed复用；drift仍执行 | `TC-SYNC-STATE-008` | pending |
| `PathChangeSafetyState` | `draft`, `safe`, `conflict`, `blocked`, `unknown` | `derivePathChangeSet`, `evaluatePathChangeSafety`, `markPathChangeConflict` | Draft→classification；Safe→Conflict；scope narrowing | non-Safe apply；scope expansion；unknown fingerprint当匹配；dirty overwrite | `TC-SYNC-STATE-009` | pending |
| `MaterializationRunState` | `prepared`, `applying`, `applied_pending_finalize`, `finalized`, `partial`, `outcome_unknown`, `blocked`, `failed_known` | prepare/begin/record/mark pending/finalize/checkpoint/unknown/block/fail helpers | Prepared→Applying→AppliedPendingFinalize→Finalized；partial/unknown/blocked/failed branches | unknown/partial→Finalized；cursor先行；terminal reopen；无 checkpoint 的 unknown | `TC-SYNC-STATE-010` | pending |
| `ConflictState` | `open`, `awaiting_decision`, `resolution_recorded`, `superseded`, `closed` | detect/await/record/supersede/close | Open→Awaiting→ResolutionRecorded→Closed；active→Superseded | resolution intent等于 effect；无 known result close；Closed复活 | `TC-SYNC-STATE-011` | pending |
| `RecoveryCheckpointState` | `captured`, `resumable`, `invalidated`, `probe_required`, `completed` | capture/evaluate/mark resumable/require probe/invalidate/complete | Captured→Resumable/ProbeRequired/Invalidated；known local result→Completed | possible effect→Resumable；ProbeRequired无 formal probe完成；ACK冒充 complete | `TC-SYNC-STATE-012` | pending |
| `ManualResolutionState` | `recorded`, `validated`, `applied`, `superseded`, `rejected` | record/validate/apply/supersede/reject | Recorded→Validated/Rejected；Validated→Applied；active→Superseded | Recorded→Applied；system actor冒充 human；scope escape | `TC-SYNC-STATE-013` | pending |
| `ProbeRecordState` | `prepared`, `in_flight`, `resolved_known`, `still_unknown`, `unsupported`, `failed_known` | prepare/begin/resolve/keep unknown/unsupported/fail | Prepared→InFlight→known/unknown；Prepared→Unsupported | no prior attempt；StillUnknown重放 submit；telemetry作 known | `TC-SYNC-STATE-014` | pending |
| `ReviewCandidateState` | `inspecting`, `eligible`, `frozen`, `invalidated`, `handed_off` | inspect/evaluate/freeze/invalidate/attach handoff | Inspecting→Eligible→Frozen→HandedOff；active→Invalidated | Invalidated复活；Frozen digest/scope修改；multiple attempts | `TC-SYNC-STATE-015` | pending |
| `HandoffAttemptState` | `prepared`, `calling`, `transport_known`, `outcome_unknown`, `probe_required`, `external_pending`, `terminal_known` | prepare/begin/record transport/unknown/require probe/pending/finalize | Prepared→Calling→TransportKnown/OutcomeUnknown；probe→ExternalPending/TerminalKnown | ACK→accepted；unknown→Calling；missing official ref→pending；terminal reopen | `TC-SYNC-STATE-016` | pending |
| `ProvenanceRecordState` | `active`, `protected`, `superseded`, `integrity_unknown` | record/protect/supersede/verify/mark integrity unknown | Active→Protected/Superseded/IntegrityUnknown；Protected可supersede/degrade | delete/fabricate parent；IntegrityUnknown→Active；raw body/digest placeholder | `TC-SYNC-STATE-017` | pending |

状态闭环结论：17 个状态主语的正式 label、产生函数、flow、测试切口均唯一回指 Step 10；下游验收和 phase 引用尚未创建，不能由本表推断 readiness。

## 11. Phase / commit boundary 闭环表（留给 07 定义）

Step 17 不拆实施阶段或提交边界；下表只定义 07 必须审计的输入、明确排除和依赖条件。所有 `PH-*`、`CB-*`、`TC-*`、`AC-*` 和 evidence ID 在 05/06/07 完成前均为 `not_assigned`，不能伪造。

| Phase / commit boundary | 当前可交付的设计输入 | 明确排除 | 必须先满足 | 不得依赖后续未定义内容 | 测试范围（未来映射） | 验收范围（未来映射） |
|---|---|---|---|---|---|---|
| `PH-00 / CB-00`（planned name only） | 文档基线、TypeScript/ESM、模块树、typed shared carriers、read/write capability graph | 目标实现仓创建事实、package/bin、真实 adapter、物理 metadata、测试 runner | 正式 03/05/06/07 完成；目标仓状态与 SDK candidate 核验 | 不得依赖 owner positive contract、未来 phase DTO 或 run evidence | `TC-SYNC-CONFIG-014`、文档静态闭环 | `AC` 未分配；不得写通过 |
| `PH-01 / CB-01`（planned name only） | pure refs/value objects/policies、17 state helpers、error discriminants | external calls、filesystem mutation、persistent adapter claim | Step 6/10/12 baseline；strict TypeScript setup由 07 确认 | 不得依赖 `.qs-sync` physical schema 或 owner method | 状态合法/非法、validation、redaction unit cuts | 未分配 |
| `PH-02 / CB-02`（planned name only） | local repositories/UoW/idempotency/stored-result/append contracts与fake parity | durable driver、migration/retention、真实 crash result | Step 7/11/13；physical schema blocker关闭或保持 blocked seam | 不得依赖 external submit/probe acceptance | persistence, version, duplicate, commit-unknown cuts | 未分配 |
| `PH-03 / CB-03`（planned name only） | Clone/Pull/Metadata/Rebind local flows，read-only status queries | source positive comparator、owner authorization、auto Git/merge/rebase | owner/source/metadata capability status明确；dirty/path guard保持 fail-closed | 不得依赖 Review Decision 或 05/06 报告生成 | 10 mutation/query local flow cuts、atomic visibility | 未分配 |
| `PH-04 / CB-04`（planned name only） | Conflict/Recovery/Probe local model and explicit recovery commands | formal external probe positive path（若上游未闭合）、blind retry | Step 12/13/14/16；probe contract与unknown mapping | 不得依赖 handoff accepted 或 Artifact/Baseline | recovery/unknown/concurrency cuts | 未分配 |
| `PH-05 / CB-05`（planned name only） | Review candidate freeze、handoff layers、provenance append/read | Gate/Decision write、Artifact/Baseline creation、Git remote push | Governance handoff/read contract；candidate digest/freeze seams | 不得把 ACK、HTTP、local commit、telemetry当 accepted | handoff/provenance/ACK≠accepted cuts | 未分配 |
| `PH-06 / CB-06`（planned name only） | conditional consumers/jobs 的 conservative handlers/report replay | scheduler、topic/source positive integration、auto repair/pull/apply | event/job schema、receipt/report store、source/order contract | 不得依赖 fake 关闭 integration blocker | consumer/job duplicate/quarantine cuts | 未分配 |
| `PH-07 / CB-07`（planned name only） | configuration/composition/observability adapters and CLI presentation | runtime version/package/bin/parser choices未确认的事实 | 04/05/06/07 正式基线和 capability matrix | 不得依赖 readiness/evidence/report 生成 | config/redaction/sink isolation/CLI mapping cuts | 未分配 |

### 11.1 Boundary 复核硬规则

- 07 必须在每个实际 boundary 台账中记录 `design_baseline`、`allowed_scope`、`forbidden_scope`、`required_checks`、`Commit Gate`、`Handoff Gate`、blocker 和 `next_allowed_action`。
- 每个 boundary 开工前，必须重新审计正式 `03/05/06/07` 的字段、DTO、Query view、状态、metadata/idempotency、UoW、测试切口、验收映射和命名；本文件不能替代该审计。
- 若某 boundary 需要新增字段、状态、port、mapper、config key、report/evidence schema 或 phase 依赖，必须先回写设计真相源并固定新的 baseline；实现者不得在代码中临时补齐。
- `implementation_execution_ledger.md` 和 `implementation-boundaries/` 在本项目只能由正式 07 创建；当前不创建任何实现台账或 skeleton。
- 本项目没有 projection rebuild boundary；也没有 Artifact materialization/evidence generation boundary。若未来需求改变，必须回退 00/01/02 并重新审计，而不是把能力塞进现有 boundary。

## 12. Public protocol 传递类型闭环表

| 协议 surface | 外层 DTO / result | 关键传递类型 | 正式归属 | schema / variant 来源 | 缺失、duplicate、retry 口径 | 依赖边界 | 测试切口 |
|---|---|---|---|---|---|---|---|
| Command envelope | `SyncCommandRequest<T>` | `ActorContext`、`CommandMetadata`、`IdempotencyKey`、`SyncCommandName` | Step 8 §7.1 | `03_ddd_step_08_protocol_contracts.md` §7.1 | validation 在 reserve 前；同 namespace+digest exact replay；digest 冲突 reject | entry→application；不携带 provider body | `TC-SYNC-ERR-001/IDEM-001..005` |
| Command result | `SyncCommandProtocolResult` / `SyncCommandResultBase` | `CommandDisposition`、`SyncBlockerSet`、`SafeNextActionSet`、checkpoint/conflict/provenance refs | Step 8 §6/§7.3 | exact discriminated union | `outcome_unknown`保留 durable refs；不返 `success/accepted` | domain result→entry presenter；不从 transport status猜 | `TC-SYNC-OBS-002/008` |
| Selection/path input | `ExplicitSyncSelectionDto`、`PathScopeDto` | typed Project/Version/MaterialSource/LocalTarget refs、canonical path refs | Step 8 §7.2 | explicit request schema | empty scope不默认全量；scope只能收窄 | SDK/owner refs只经 adapter validation；Git remote不作 source | `TC-SYNC-CMD-001/004/009` |
| Query envelope | `SyncQueryRequest<T>` | `QueryMetadata`、redaction policy、`SyncQueryName` | Step 8 §7.1 | exact request carrier | no idempotency reserve；selector invalid stable reject | read-only composition；不注入 write capability | `TC-SYNC-QUERY-NOWRITE-001` |
| Query response | `SyncQueryResponse<T>` / `SyncPageResponse<T>` | `QueryReadDisposition`、`ViewSlice<T>`、`SyncPageInfo`、degraded reason set | Step 8 §7.2/§7.4 | exact union + typed page mapper | missing/not-visible/unavailable/partial explicit；opaque cursor不当 source cursor | repository read port→view mapper；不创建 projection | `TC-SYNC-QRY-001..013` |
| Inbound event envelope | `InboundSyncEventEnvelope<T>` | event name/version/id/digest/source metadata + typed payload | Step 8 §10.1/§10.2 | currently `planned/blocked` | duplicate exact receipt；invalid source/version→quarantine；不重放副作用 | only official source/schema when blocker closed；不私订 topic | `TC-SYNC-EVT-001..003` |
| Consumer receipt | `ConsumerReceipt` / stored typed receipt | disposition, event/idempotency/digest, affected refs, provenance/trace safe ref | Step 8 §10.1 + Step 7 receipt repo | exact stored save/get symmetry | duplicate returns complete receipt；missing carrier=consistency defect | local UoW with conservative transitions；不写 owner | `TC-SYNC-EVENT-IDEM-001`、`TC-SYNC-PERSIST-009` |
| Job envelope | `SyncJobRequest<T>` | `SystemActorContext`、`JobMetadata`、job run/idempotency | Step 8 §12.1 | exact job schema | duplicate returns stored full report+items；per-item unknown explicit | no scheduler fact；entry→job service | `TC-SYNC-JOB-IDEM-001` |
| Job result | `SyncJobReport` + item result union | `JobDisposition`、affected local refs、safe failure summaries | Step 8 §12.1～§12.4 | typed report/item schemas | completed≠all resolved/ready；partial/blocked visible | local operations result only；not formal report/evidence | `TC-SYNC-JOB-001..003`、`TC-SYNC-PERSIST-010` |
| Handoff layer | `HandoffResultLayersDto` | candidate/attempt/transport/probe/external decision views | Step 8 §7.3 + Step 6 CP5 | four-layer schema | ACK stays transport; unknown→probe-required; no accepted shortcut | ReviewHandoff/Decision ports only; no Gate write | `TC-SYNC-CMD-009/010`、`TC-SYNC-OBS-009` |

Public protocol 结论：所有传递类型均有唯一 schema 所属和 read/write 边界；`unknown`、`blocked`、`quarantined`、`duplicate` 和 `partial` 是可见结果，不可被 entry 简化成零退出码或空响应。外部 provider `unknown` 只存在 adapter 输入边界，不能进入 domain/public DTO。

## 13. 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名/口语名 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| 顶层入口 | `CloneWorkingCopy`, `PullWorkingCopy`, `GetSyncStatus`, `PushReviewCandidate` | `cloneTask`, `pullTask`, `syncStatus`, `push`, `SyncTask` | Step 8/9、正式 03 §7/§8 | 旧名只在 historical audit 出现；正文统一正式名称。 |
| 本地聚合 | `SyncOperation` | `SyncTask`, `SyncSession`（若指 operation）、`RemoteSync` | Step 6/10 | `SyncSession` 仅可作为未来 local session carrier，不能替代 operation truth。 |
| local binding | `WorkingCopyBinding` | `WorkspaceProjection`, `ProjectWorkspace`, `RepositoryBinding` | Step 6/8 | 不得把 binding 命名为 Workspace projection。 |
| metadata root | `MetadataManifest` | `SyncConfigFile`, `sync.json`, `MetadataFile` | Step 6/11 | 物理布局未定，正式正文只用 logical name。 |
| cursor | `CursorState.localAppliedCursorRef` / `sourceObservedCursorRef` | `latestVersion`, `lastCommit`, `watermark`（无 owner contract） | Step 6/10 | 两种 cursor 不能互换；Git commit 不作 source cursor。 |
| materialization | `MaterializationPlan`, `MaterializationRun` | `SyncTaskPlan`, `ApplyResult`, `ArtifactBuild` | Step 6/8/9 | local apply 不升格 Artifact/Baseline。 |
| conflict | `ConflictRecord` / `ConflictState` | `MergeConflict`（暗示自动 merge）、`Error` | Step 6/10 | 冲突只记录/等待显式决定；不暗示 merge 能力。 |
| handoff candidate | `ReviewCandidate` | `Artifact`, `Baseline`, `Review`, `PullRequest` | Step 6/8 | candidate 是 local handoff material，不拥有外部 truth。 |
| transport | `HandoffAttemptState.TransportKnown` | `accepted`, `approved`, `reviewed` | Step 6/8/10 | ACK/HTTP 状态只能留在 transport layer。 |
| external decision | `ExternalDecisionStateView` / owner snapshot | `ReviewAccepted`, `GatePassed`（Sync 内部） | Step 6/8 | 只能映射 owner state/ref，不本地创建 verdict。 |
| provenance | `ProvenanceRecord` | `AuditLog`, `Evidence`, `Report` | Step 6/15 | local relation history 不冒充平台 audit/evidence/report。 |
| query result | `QueryReadDisposition`, `SyncReadCompleteness` | `success`, `ready`, `synced` | Step 8/10 | complete read 只表示读取完整。 |
| unknown outcome | `OutcomeUnknown`, `ProbeRequired`, `StillUnknown` | `timeout_is_failed`, `retry`, `pending=accepted` | Step 9/10/12 | 必须保留 attempt/checkpoint/probe refs。 |
| local Git operation | `GitObservationPort` / `GitWorktreePort` | `GitRemoteTruth`, `Push`, `Merge`, `Rebase`, `Stash` | Step 7/9 | only whitelisted observation/apply; forbidden methods不建。 |
| tests/evidence | `TC-SYNC-*` planned cuts | `EV-*`, `AC-*` invented IDs | Step 16/本文件 | 05/06 产生正式编号后再回填，不伪造结果。 |

## 14. 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 推荐修正 | 状态 |
|---|---|---|---|---|---|
| `SYNC-17-CONFLICT-001` | 旧 README/旧 03 vs Step 3/4 | 语言/目录漂移（Rust/Tauri vs TypeScript） | 实现仓、入口、依赖、测试 | 以 Step 3/4 和正式 01/02 为准；旧材料标 historical | 已修正于校准层 |
| `SYNC-17-CONFLICT-002` | 历史 fixed metadata file vs Step 6/11 logical manifest | 物理 schema 越界 | metadata adapter、migration、04 | 只保留 logical `MetadataManifest`；等待 `SYNC-UP-006` | pending blocker |
| `SYNC-17-CONFLICT-003` | `SyncTask`/旧 RPC vs Step 8 exact protocol names | 命名漂移 | CLI、handler、stored result | 统一 10 Command/13 Query/3 Consumer/3 Job；Outbound N/A | 已修正于校准层 |
| `SYNC-17-CONFLICT-004` | ACK/HTTP/local Git status vs handoff layers | 成功升格 | review handoff、acceptance | transport/Decision 分层，ACK≠accepted | 已修正于校准层 |
| `SYNC-17-CONFLICT-005` | local Git commit vs Artifact/Baseline | truth ownership 越界 | push-review、provenance、验收 | Git 只作 local observation/ref；Artifact/Baseline owner 保持外部 | 已修正于校准层 |
| `SYNC-17-CONFLICT-006` | Query empty array vs explicit missing/degraded | Query view 语义断裂 | all 13 Query、05/06 | 使用 `QueryReadDisposition`/`ViewSlice`；empty only when scope exists | 已修正于校准层 |
| `SYNC-17-CONFLICT-007` | Step 17 vs 07 phase/commit boundary | phase 未定义 | 实施计划、ledger | 本文件只给 boundary input/exclusions；由 07 重新审计并编号 | open / not assigned |
| `SYNC-17-CONFLICT-008` | Consumer/job skeleton vs absent source/scheduler | integration 假通过 | 3 Consumer、3 Job | 保持 planned/blocked；fake 只验证 local handler | pending blocker |
| `SYNC-17-CONFLICT-009` | Telemetry signal vs durable provenance/evidence | 证据边界混淆 | observability、acceptance | closed best-effort signal 与 local durable refs 分离 | 已修正于校准层 |
| `SYNC-17-CONFLICT-010` | `SYNC-LOCAL-001~005` vs exact implementation assumptions | 本地选择未确认 | package/runtime/parser/test/Git | 只保留 candidate/unknown；由 04/07 关闭或继续 blocked | local_pending |

## 15. 正例与反例

### 15.1 正例：Pull 的增量连续性

```text
PullWorkingCopyRequest(selection, bindingRef, expectedGeneration, pathScope)
  -> load CursorState + WorkingCopyObservation
  -> MaterialSourcePort.readDelta(typed source/version/cursor context)
  -> SourceDelta(deltaKind=Incremental, comparatorRef, continuityProofRef)
  -> draft/validate MaterializationPlan
  -> durable MaterializationRun.Prepared + RecoveryCheckpoint.Captured
  -> bounded Git/filesystem apply (dirty/path gates already Safe)
  -> AppliedPendingFinalize
  -> one UoW prepares run + mapping + localAppliedCursor + provenance
  -> commit: all finalized revisions visible together
```

关键边界：空 `sourceItemChangeSet` 不能自己产生 `NoOp`；只有正式 owner/comparator proof 才能产生 `NoOp`。若 apply response lost，状态必须是 `OutcomeUnknown` 或 `Partial`，cursor 不前进。

### 15.2 正例：Review handoff unknown

```text
Frozen ReviewCandidate
  -> durable HandoffAttempt.Prepared + invocation identity
  -> HandoffAttempt.Calling
  -> transport timeout/lost response
  -> HandoffAttempt.OutcomeUnknown + RecoveryCheckpoint.ProbeRequired
  -> later ProbeRecord.Prepared/InFlight
  -> known external ref/state OR StillUnknown
```

关键边界：不得生成第二次 submit；ACK 只更新 `TransportKnown`，不创建 `ReviewAccepted`；formal owner Decision 仍由 Governance 读取。

### 15.3 正例：Query no-write

```text
GetSyncStatusRequest
  -> visibility resolver/read port
  -> load committed CP1..CP5 slices
  -> optional read-only Git/fs observation (memory only)
  -> assemble SyncStatusView
  -> QueryReadDisposition = complete | partial | missing | not_visible | blocked | unavailable
```

关键边界：不 begin UoW、不 reserve idempotency、不 refresh owner、不 probe、不 repair metadata、不生成 provenance/diagnostic emission；`CompleteRead` 不等于 synchronized/ready。

### 15.4 反例：把本地 commit 当平台 Artifact

```text
错误：git commit 成功 -> ArtifactRef/BaselineRef -> review accepted
```

原因：Git remote/commit 只是 local tool observation 或 local candidate basis；Artifact/Baseline、Gate/Decision 均为外部 owner truth。正确做法是保存 typed local observation/candidate digest，并经正式 handoff port 取得 transport/external refs。

### 15.5 反例：超时后更换 key 重试

```text
错误：submit timeout -> 认为未发生 -> 生成新 idempotency key -> 再 submit
```

原因：effect boundary unknown 时可能已有 external effect。必须保留原 attempt/checkpoint，先走正式 probe；probe unsupported 或 still unknown 时保持显式状态，不盲重放。

### 15.6 反例：status 查询自动迁移或修复

```text
错误：GetMetadataHealth 发现 schema 旧 -> 自动 migrate/delete old provenance -> 返回 healthy
```

原因：Query 必须 zero-write；migration 是显式 `MigrateSyncMetadata` command，且物理 schema 仍受 `SYNC-UP-006` 阻塞。正确响应是 `partial/blocked` + safe reason。

### 15.7 反例：人工决定直接写文件

```text
错误：RecordConflictResolution(decision=ApplySource) -> 直接覆盖 dirty working copy
```

原因：resolution 只记录 bounded intent；后续 Resume 必须重新观察 dirty/path/generation，并在 known-safe local result 后才可推进 `ManualResolution.Applied` / `Conflict.Closed`。

## 16. Step 17 自检、门禁与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 真相源表 | pass_with_blockers | 17 个事实族与 owner boundary 均有唯一来源；physical schema/phase/acceptance 仍 pending。 |
| 字段闭环 | pass_with_blockers | 29 个对象字段族、来源、factory、缺失处理和 test cuts 已列；positive external fields受 blocker。 |
| DTO/Event/Job 构造闭环 | pass_with_blockers | 10 Command、3 Job 完整；3 Consumer 保守闭环；Outbound Event N/A。 |
| Query response/view 闭环 | pass | 13 Query 均有 response、字段来源、visibility/degraded/empty、selector和zero-write切口。 |
| 状态闭环 | pass | 17 状态主语与 Step 10/16 exact names 一致；验收 ID待 06。 |
| metadata/idempotency/UoW | pass_with_blockers | logical contract、namespaced key、stored carrier、atomic visibility已闭合；physical schema/正式 external equivalence未闭合。 |
| actor/scope/visibility | pass_with_blockers | explicit selection、actor principal、target scope和read visibility均有 guard；owner resolver合同待核验。 |
| projection rebuild | not_applicable | Sync 不拥有 Workspace projection；不得创建 rebuild job。 |
| artifact materialization/evidence | not_applicable | Sync 不生成 Artifact/Baseline、正式 report/evidence/readiness。 |
| naming consistency | pass_with_pending | 正式名称与禁用旧名已登记；下游验收/phase 名尚未分配。 |
| phase boundary | not_ready_for_assignment | 本步只列输入/排除，必须由 07 定义并重审。 |
| 07 交付实现前整体审计输入 | pass_with_blockers | 03/05/06/07 的字段、协议、flow、state、persistence、tests和验收映射审计要求已明确。 |

### 16.1 进入 Step 18 条件

- [x] 十类中间产物材料已形成：真相源、字段、DTO/Event/Job、Query view、状态、phase boundary、public protocol、命名、冲突修正、正反例。
- [x] 实施前阅读清单包含项目台账、正式文档、TypeScript/目录/提交规范、git identity 检查、专项上游边界和实施计划规范。
- [x] 已明确正式 07 必须按每个 phase/commit boundary 重审正式 `03/05/06/07`，本文件不伪造 phase/commit/evidence/readiness。
- [x] 未创建实现仓、implementation ledger、boundary skeleton、测试、fixture、脚本、artifact、report 或 evidence；未运行测试；未提交 commit。

Step 17 gate：`pass_with_upstream_blockers`；下一动作：`complete_step_18_risks_open_questions`。未经本项目 flow/ledger 更新，不得进入 Step 18 以外的步骤。
