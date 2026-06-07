# L1-process 03 DDD Step 17 详细设计到实施计划的承接清单

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
> 书写规范: `standards/document/详细设计书写规范.md` §5.16
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md` §5.10
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_16_test_cuts.md`
> - `standards/coding/rust.md`
> - `standards/document/子项目目录与代码文件组织规范.md`
> - `standards/document/实施计划书写规范.md`
> - `standards/document/实施计划讨论流程_SOP.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1~16 中间产物 | 详细设计校准链 | 已具备交给 Step 19 装配正式 `03-详细设计.md` 的承接内容 |
| Step 3 / 4 / 5 | Rust、实现仓、workspace、依赖方向 | 目标实现仓为 `/home/aris/Projects/quantalithos-process`;七个 crate 主轴已闭合 |
| Step 6 / 7 / 8 | 对象、port、protocol schema | 实现者必须从这些 Step 读取字段级真相源,不得从旧文档补字段 |
| Step 9 / 10 / 11 | flow、状态机、事务一致性 | application / domain / infra 实现必须按调用顺序、状态矩阵和 UoW 规则落码 |
| Step 12 / 13 | 错误恢复、并发幂等 | duplicate replay、result missing、commit unknown 和 no-recompute 是实现红线 |
| Step 14 / 15 / 16 | 配置、观测、测试切口 | 实施计划必须把配置边界、redaction、脚本契约和最小测试切口纳入门禁 |
| `05-测试方案.md` / `06-验收标准.md` | 下游验证文档 | 当前正式文件仍含旧口径,需要后续按新版 03 重新校准,不得作为实现真相源 |

---

## 3. SOP 问题回答

1. 哪些实现契约已经足够进入实施计划?

   回答:详细设计校准链已收稳上游边界、P0 范围、Rust / repo 约束、文件布局、模块主轴、对象契约、trait / port / adapter、13 个 Command、11 个 Query、7 个 inbound event、10 个 outbound event、7 个 operations job、逐接口 flow、16 组状态机、事务一致性、错误恢复、幂等并发、配置绑定、观测审计和最小测试切口。它们足够交给 Step 19 装配正式 `03-详细设计.md`,并作为后续 `07-实施计划.md` 的引用源。

2. 实施者需要先阅读哪些文档?

   回答:实施者不得只读实施计划。必须先读 L1-process `00/01/02`、正式 `03-详细设计.md`、本轮 `03_ddd_calibration_flow.md`、相关 Step 中间产物、Rust 编码规范、目录组织规范、实施计划提交规范和目标实现仓历史提交。正式 `03` 由 Step 19 装配前,不得把旧 `03-详细设计.md` 或旧 `05/06` 当实现真相源。

3. 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读?

   回答:已列入。实施计划必须再次要求项目级 `git config user.name = quantalithos-labs`、`git config user.email = quantalithos.ai@gmail.com`。目标实现仓不是 design 仓,commit message 必须使用英文,标题格式为 `type(scope): subject`;源码标识符、rustdoc、普通注释和测试名默认英文。AI footer 前必须有真实空行。

4. 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则?

   回答:详细设计内部已闭合。Step 6 字段表可回指 Step 8 DTO / event / job、Step 9 flow、Step 7 repository / resolver / id generator / clock 或 Step 11 persistence lookup。若实现阶段发现必填字段无法回指,必须暂停并回写设计,不得在代码中补 placeholder 字段。

5. 每个 Command / Event / Job 是否能构造目标对象,或明确缺失处理?

   回答:已闭合。13 个 Command 的目标对象构造入口在 Step 8 / 9 固定;7 个 inbound event 只写 snapshot / reference / stale / pending marker,不得推进 command-only state;7 个 job 只维护 outbox、projection、snapshot、reconciliation、handoff 或 recovery maintenance marker。缺失输入的处理为 reject、quarantine、delayed、noop、partial failure 或 dependency unavailable,不得静默派生字段。

6. 每个 Query 的 response view / page / marker、read model / projection / cursor id/ref 是否已经闭合?

   回答:已闭合。11 个 Query 统一使用 `ProcessViewStatus`、`ProcessDegradedMarker`、`ProcessVisibilityMarker`、`ProjectionStatusMarker`、`ProcessPageRequest` 和 `ProcessPageInfo`。Query read path 不打开 write UoW,不调用 resolver,不修 projection,不生成 truth。

7. 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名?

   回答:详细设计内部使用 Step 6 / Step 10 的正式状态名。`05-测试方案.md` 和 `06-验收标准.md` 当前仍有旧 template / frozen profile 等旧口径,必须在后续测试方案和验收标准 SOP 中同步,不得让实现者按旧状态名落码。

8. 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据?

   回答:本 Step 不定义 phase / commit boundary。后续 `07-实施计划.md` 必须按 Step 17 的复核项逐个 commit boundary 检查字段、DTO、状态、测试、证据和 phase boundary。任一 boundary 依赖后续 boundary 才定义的 result、projection、report、handoff marker 或 script output 时,必须调整实施计划或回写设计。

9. 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移?

   回答:旧 `ProcessTemplate`、旧 `SyncTemplateIndex`、旧 `BindProcessProfile`、旧 frozen profile、旧 suspended waiting gate 口径不得进入实现。正式命名以 Step 6 的对象 / 状态、Step 8 的 DTO / event / job、Step 9 的 flow 和 Step 16 的测试切口为准。

10. 哪些内容仍待确认,不能进入实施?

   回答:正式 `03-详细设计.md` 尚需 Step 19 装配;正式 `05-测试方案.md`、`06-验收标准.md` 仍需按新版 03 校准;`04-配置设计.md` 和 `07-实施计划.md` 尚未在本轮生成;目标实现仓 `/home/aris/Projects/quantalithos-process` 当前未发现。这些事项不阻塞 Step 18,但阻塞正式移交实现。

11. 实施计划应该如何引用本文,而不是重复本文?

   回答:`07-实施计划.md` 应引用正式 `03` 的章节和对应 `design-calibration/03_ddd_step_*.md`,把它们转成 phase / commit boundary、开工门禁、测试门禁和提交纪律。不得复制 Step 6 字段表、Step 8 schema、Step 9 flow、Step 10 状态矩阵或 Step 16 测试表形成第二真相源。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 1~16 | 中间产物数量多,实施者容易跳读或只读某个 Step | 输出实施承接清单和前置阅读清单 |
| 正式 `03-详细设计.md` | 当前仍按重建纪律删除,尚未由 Step 19 装配 | 明确 Step 19 前不得按旧 `03` 开工 |
| `05-测试方案.md` / `06-验收标准.md` | 仍含旧 `ProcessTemplate` / frozen profile 等旧口径 | 标记为后续同步风险,不得作为实现真相源 |
| `07-实施计划.md` | 尚未生成新版实施计划 | 本 Step 只给承接输入,不写 phase、任务拆分或 commit boundary |
| 提交 / 注释规范 | 实现仓容易误继承 design 仓中文 commit 口径 | 列为实施前置阅读和开工门禁 |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| Step 17 是否写完整实施计划 | A. 写 phase / commit;B. 只写承接和复核门禁 | 采用 B。phase、任务拆分和提交边界属于 `07-实施计划.md` |
| `07` 是否复制详细设计表格 | A. 复制对象 / DTO / 状态表;B. 引用正式 03 和 calibration Step | 采用 B。避免第二真相源 |
| 旧 `05/06` 是否作为当前验证真相源 | A. 临时沿用;B. 明确待同步 | 采用 B。旧测试 / 验收口径已与新版 03 冲突 |
| 实现仓提交语言 | A. 继承 design 仓中文 subject/body;B. 实现仓英文 commit | 采用 B。符合实施计划规范和源码语言边界 |
| 目标仓不存在是否阻塞详细设计 | A. 阻塞 Step 17;B. 作为实施前门禁 | 采用 B。设计可继续,正式实现开工必须确认仓路径 |

---

## 6. 结构化中间产物

### 6.1 实施承接关系图

```text
00-需求文档
  -> 01-架构设计
  -> 02-概要设计
  -> 03 DDD calibration Step 1~18
  -> Step 19 formal 03-详细设计.md
  -> 04 / 05 / 06 / 07 follow-up documents
  -> /home/aris/Projects/quantalithos-process
```

说明:

- Step 17 交付的是“实施计划如何承接详细设计”的清单和复核门禁。
- 正式实现开工必须等 Step 19 生成正式 `03-详细设计.md`,并由新版 `07-实施计划.md` 定义 phase / commit boundary。
- `05-测试方案.md` 和 `06-验收标准.md` 当前旧口径只能作为待同步对象,不能作为实现依据。

### 6.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入边界 | Step 1 | 只承接新版 `00/01/02`;旧 `03` 只作问题诊断 |
| P0 / 非范围 | Step 2 | 不实现外部 truth、正文存储、完整 BPMN engine、workspace dashboard、observability ledger 或 archive package body |
| Rust / 仓库 / 依赖约束 | Step 3 | 使用 Rust workspace;只编译期依赖 `core-contracts`;源码英文 |
| 文件布局 | Step 4 | 在 `/home/aris/Projects/quantalithos-process` 建立 `crates/contracts/domain/application/infra/api/worker/jobs` |
| 模块依赖方向 | Step 5 | 用 Cargo dependency 强制 `contracts <- domain <- application <- infra <- entry` 方向 |
| 对象契约 | Step 6 | 实现 domain object、value object、state enum、policy、trace、outbox 和 history record |
| Trait / Port / Adapter | Step 7 | 在 application 定义 port,在 infra 实现 repository / resolver / publisher / handoff / runtime builder |
| Protocol schema | Step 8 | 实现 13 Command、11 Query、7 inbound event、10 outbound event、7 job 和 shared metadata / receipt / error surface |
| Function flows | Step 9 | 按 flow 顺序实现 validation、idempotency、UoW、repository、domain、outbox、operation result 和 commit |
| State matrix | Step 10 | 实现 16 组状态机,非法转换返回正式 error,不得自增状态 |
| Persistence consistency | Step 11 | 实现 repository key、optimistic version、UoW ordering、outbox / projection / snapshot consistency |
| Error recovery | Step 12 | 实现 public error mapping、quarantine / delayed / partial failure、manual intervention surface |
| Concurrency / idempotency | Step 13 | 实现 operation namespace、canonical digest、stored result replay、commit unknown recovery |
| Config / external binding | Step 14 | 仅 infra / entry 读取 config;配置不得改变 truth boundary 和状态红线 |
| Observability / audit | Step 15 | 实现 structured log、metric、audit、trace / span cut 和 forbidden field guard |
| Test cuts | Step 16 | 将最小测试入口映射为实施门禁;完整测试方案由后续 `05` 展开 |

### 6.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L1-process/00-需求文档.md` | 理解 Process truth、边界、P0 目标和非范围 |
| `projects/L1-process/01-架构设计.md` | 理解上下文、依赖方向、数据所有权和最终一致策略 |
| `projects/L1-process/02-概要设计.md` | 理解代码主体骨架、主要组成部分、接口骨架、处理流和状态摘要 |
| `projects/L1-process/design-calibration/03_ddd_calibration_flow.md` | 理解 03 校准状态、旧文档删除纪律和 Step 文件索引 |
| `projects/L1-process/03-详细设计.md` | Step 19 后作为正式详细设计入口 |
| `projects/L1-process/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_18_risks_open_questions.md` | 追溯正式 03 的字段级、flow、状态、错误、幂等、测试和风险来源 |
| `standards/coding/rust.md` | 遵守 Rust 标识符、rustdoc、普通注释、测试名和错误处理规范 |
| `standards/document/子项目目录与代码文件组织规范.md` | 确认实现仓目录、workspace member、Cargo package、crate、binary、scripts、reports、artifacts |
| `standards/document/实施计划书写规范.md` | 编写 `07` 时遵守 phase、commit boundary、提交信息、证据和永久记忆种子规则 |
| `standards/document/实施计划讨论流程_SOP.md` | 生成 `07` 时逐 Step 执行开工前复核、提交纪律和交付门禁 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 实现阶段发现字段、DTO、状态、phase 冲突时按标准暂停回写 |
| `projects/README.md` §1.1 / §8.2 | 确认 design 仓目录与实现仓目录、提交语言边界和质量门禁 |

### 6.4 实施前检查清单

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-process` 存在或在 PH-01 创建 | 暂停实现并确认目录 |
| git user | `git config user.name` 为 `quantalithos-labs`;`git config user.email` 为 `quantalithos.ai@gmail.com` | 修正项目级 git config 后再提交 |
| commit message | 实现仓英文,标题固定为 `type(scope): subject`,body 按文件组说明,footer 前真实空行 | amend 或重写 message |
| 源码语言 | 标识符、rustdoc、普通注释、测试名默认英文 | 修正后再提交 |
| workspace layout | `crates/contracts/domain/application/infra/api/worker/jobs` | 不得按旧单 crate 或业务 crate 开工 |
| Cargo package / crate | `process-<role>` / `process_<role>` | 命名偏离则暂停并回写设计或改实现 |
| compile-time dependency | 只允许 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 作为 sibling compile dependency | 不得引入其他 sibling path dependency |
| formal design baseline | Step 19 后正式 `03` 与 calibration Step 一致 | 不一致时回 Step 19 修正文档 |
| downstream docs | `04/05/06/07` 按新版 03 同步 | 未同步前不得正式移交实现 |

### 6.5 真相源表

| 设计事实 | 真相源文档 | 章节 / 中间产物 | 后续消费者 | 冲突处理 |
|---|---|---|---|---|
| 上游输入和旧文档删除纪律 | Step 1 / workbench | `03_ddd_step_01*`;`03_ddd_calibration_flow.md` | Step 19 / `07` | 与旧 `03` 冲突时以新版 Step 为准 |
| 实现范围和非范围 | Step 2 | `03_ddd_step_02_scope.md` | `07`;测试方案 | 不得由实现者扩大 P0 |
| Rust / repo / dependency | Step 3 / 4 | `03_ddd_step_03*`;`03_ddd_step_04*` | target repo / Cargo | 冲突时暂停确认仓路径和依赖 |
| 模块职责和依赖方向 | Step 5 | `03_ddd_step_05_module_contracts.md` | Cargo workspace | Cargo 依赖不得反向 |
| Domain 对象和字段 | Step 6 | `03_ddd_step_06_object_contracts.md` | domain / application / tests | 字段缺失回 Step 6,不得代码补字段 |
| Trait / port / adapter | Step 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` | application / infra | adapter 不得改写 application trait |
| Public protocol | Step 8 | `03_ddd_step_08_protocol_contracts.md` | contracts / api / worker / jobs | DTO 与 flow 冲突时回 Step 8 / 9 |
| Function flow | Step 9 | `03_ddd_step_09_function_flows.md` | application services | 不得自行调整 UoW / idempotency 顺序 |
| State matrix | Step 10 | `03_ddd_step_10_state_matrix.md` | domain / tests | 状态冲突回 Step 10 |
| Persistence / error / idempotency | Step 11~13 | `03_ddd_step_11*` ~ `03_ddd_step_13*` | application / infra / tests | 保持 no-recompute / rollback / duplicate replay |
| Config / observability / tests | Step 14~16 | `03_ddd_step_14*` ~ `03_ddd_step_16*` | infra / scripts / tests | 细节不足进入后续 `04/05/07`,不得脑补 |

### 6.6 字段闭环表

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `RuntimeProcessShape` | `shape_id` | `RuntimeProcessShapeId` | id generator | `RuntimeProcessShape::from_definition(...)` | generated | generator / repository failure -> rollback | `SyncRuntimeProcessShape_contract` | 后续 `06` 同步 |
| `RuntimeProcessShape` | `definition_ref` / `definition_version_ref` / `source_snapshot_ref` | method refs | Command / resolver snapshot | `from_definition`;`activate` | `SyncRuntimeProcessShapeRequest.*` | source unavailable / digest mismatch | `SyncRuntimeProcessShape_contract` | 后续 `06` 同步 |
| `ProcessProfile` | `profile_id` / `project_ref` / `shape_ref` | profile / project / shape refs | id generator + command + repository lookup | `ProcessProfile::propose`;`activate`;`switch_to` | profile command requests | shape inactive / project mismatch -> reject | profile command tests | 后续 `06` 同步 |
| `ProcessInstance` | `process_instance_id` / `profile_ref` / `project_ref` / `token_set_ref` | ids / refs | id generator + active profile lookup + structured `ProcessStartIntentRef` | `ProcessInstance::create`;`start` | `StartProcessInstanceRequest.*` | inactive profile / missing start node / gateway mismatch -> reject | `StartProcessInstance_contract` | 后续 `06` 同步 |
| `Activity` | `activity_id` / `shape_node_ref` / `activity_kind` / `feedback_ref` | ids / shape / runtime refs | shape lookup + command / event marker | `Activity::from_shape_node`;`attach_feedback` | activity / runtime feedback DTOs | body rejected / unresolved feedback | activity tests | 后续 `06` 同步 |
| `Token` / `Gateway` | position / route fields | shape node refs | runtime shape lookup and progression request | token / gateway factories and transition methods | `AdvanceProcessActivityRequest.*` | expected position / invalid route conflict | activity progression tests | 后续 `06` 同步 |
| `WaitingGate` / `PauseContext` | pause / requirement / decision refs | typed refs | open gate command + governance event marker | `WaitingGate::open_for_activity`;`attach_decision`;`resume` | gate command / governance event | missing requirement / decision mismatch | waiting gate tests | 后续 `06` 同步 |
| `ProcessCheckpoint` / `RecoveryAttempt` | checkpoint / evidence / outcome refs | typed refs | command + artifact evidence marker | checkpoint / recovery factories | recovery command DTOs | evidence invalid / fork violation | recovery tests | 后续 `06` 同步 |
| `ProcessStageState` / `ProcessTimeboxBinding` | stage / timebox refs | typed refs | rhythm command + work snapshot | rhythm factories / transition methods | rhythm command DTOs | external timebox unavailable | rhythm tests | 后续 `06` 同步 |
| `DerivedProcessViewState` / `ReferenceResolutionState` | cursor / freshness / snapshot refs | projection builder / resolver | projection / refresh jobs | job DTOs | source unavailable / projection failed | projection / reference tests | 后续 `06` 同步 |
| `ProcessTraceRecord` / `ProcessOutboxRecord` | trace / truth / event / publication refs | committed `ProcessTruthChange` + metadata | `from_truth_change(...)` | command / outbox job DTOs | invalid mapping -> failed marker | outbox / trace tests | 后续 `06` 同步 |

### 6.7 DTO / Event / Job 到 Domain 对象构造闭环表

| 输入契约 | 目标 Domain 对象 | 必填字段是否齐全 | 派生字段来源 | 不得混同的字段 | 缺失时行为 | 关联处理流 |
|---|---|---|---|---|---|---|
| `SyncRuntimeProcessShapeRequest` | `RuntimeProcessShape`;`MethodDefinitionSnapshot`;outbox | 是 | resolver、id generator、clock | definition ref != snapshot body | reject / retry | `SyncRuntimeProcessShapeFlow` |
| `AdoptProcessProfileRequest` / `UpdateProcessProfileTailoringRequest` | `ProcessProfile`;`ProfileChangeRecord` | 是 | shape repository、work context snapshot | project ref != work truth | reject / conflict | profile flows |
| `StartProcessInstanceRequest` | `ProcessInstance`;`Activity`;`Token`;`Gateway` | 是 | profile / runtime shape lookup、`ProcessStartIntentRef`、id generator | process instance != Project truth;start intent != runtime shape body | reject | `StartProcessInstanceFlow` |
| `AdvanceProcessActivityRequest` / `RecordActivityFeedbackRequest` | `Activity`;`ActivityTransitionOutcome`;`Token`;`Gateway`;progression record | 是 | repository current position、runtime feedback marker、changed token / gateway truth | feedback ref != feedback body;activity outcome != complete progression record | conflict / reject | activity flows |
| `OpenWaitingGateRequest` / `ResumeWaitingGateRequest` | `WaitingGate`;`PauseContext`;gate change record | 是 | clock、governance decision marker | decision ref != decision body | reject / delayed | gate flows |
| `CreateProcessCheckpointRequest`;recovery requests | `ProcessCheckpoint`;`RecoveryAttempt`;history | 是 | artifact marker、checkpoint repository | recovery attempt != new instance | reject / fork violation | recovery flows |
| rhythm requests | `ProcessStageState`;`ProcessTimeboxBinding` | 是 | work context / timebox snapshot | timebox ref != work iteration truth | reject / conflict | rhythm flows |
| inbound events | snapshot / reference / stale / pending marker | 是 if envelope valid | resolver, source version, source digest | source actor != command actor | quarantine / delayed / noop | consumer flows |
| outbound events | `ProcessOutboundEventEnvelope` | 是 | committed outbox + truth ref | event payload != domain object dump | mark failed | `PublishProcessOutboxFlow` |
| operations jobs | outbox / projection / reference / report / handoff / recovery markers | 是 | repository scan, cursor, adapter receipt | job report != business truth | invalid input / partial | job flows |

### 6.8 Query response / view 闭环表

| Query | Response DTO / View | 字段来源 | empty / not visible / degraded 口径 | public id/ref 规则 | 测试覆盖 |
|---|---|---|---|---|---|
| `GetRuntimeProcessShape` | `ProcessQueryResponse<RuntimeProcessShapeView>` | shape repository + snapshot marker | missing / not visible / stale snapshot | shape ref from repository key | `GetRuntimeProcessShape_query` |
| `GetProcessProfile` | `ProcessQueryResponse<ProcessProfileView>` | profile repository + derived marker | missing / not visible / degraded | profile ref from repository key | `GetProcessProfile_query` |
| `GetProcessInstance` | `ProcessQueryResponse<ProcessInstanceView>` | instance repository + current refs | missing / not visible | instance ref from repository key | `GetProcessInstance_query` |
| `GetActivityStatus` | `ProcessQueryResponse<ActivityStatusView>` | activity repository + feedback marker | missing / feedback degraded | activity ref from repository key | `GetActivityStatus_query` |
| `GetWaitingGate` | `ProcessQueryResponse<WaitingGateView>` | gate repository + decision marker | missing / decision degraded | waiting gate ref from repository key | `GetWaitingGate_query` |
| `GetRecoveryStatus` | `ProcessQueryResponse<RecoveryStatusView>` | recovery repository | available empty / missing / not visible | attempt / instance ref from repository key | `GetRecoveryStatus_query` |
| `GetProcessTimeline` | `ProcessPageResponse<ProcessTimelineEntryView>` | trace / projection repository | empty page / filtered / gap degraded | cursor from projection page info | `GetProcessTimeline_query` |
| `GetProcessProgressSummary` | `ProcessQueryResponse<ProcessProgressSummaryView>` | projection summary | stale / rebuilding / disabled | summary ref derived from subject key | `GetProcessProgressSummary_query` |
| `SearchProcessInstances` | `ProcessSearchResultPage` | search projection | empty / stale / disabled | result item refs from projection | `SearchProcessInstances_query` |
| `GetProcessTrace` | `ProcessTraceView` | trace repository | missing / filtered | trace subject ref + page cursor | `GetProcessTrace_query` |
| `GetReconciliationReport` | `ProcessQueryResponse<ReconciliationReportView>` | report repository | clean / has issues / missing | report ref from repository key | `GetReconciliationReport_query` |

### 6.9 Public protocol 传递类型闭环表

| 协议 surface | 外层 DTO | 字段 | 传递类型 | 正式归属 | schema / variant 定义位置 | 缺失 / duplicate / retry 口径 | 依赖边界 | 测试覆盖 |
|---|---|---|---|---|---|---|---|---|
| Command metadata | all command requests | `metadata` | `CommandMetadata` / `IdempotencyKey` / `RequestDigest` | `contracts` | Step 8 / 13 | missing -> invalid request;duplicate -> stored result | contracts 不依赖 domain | command contract tests |
| Query response | all query responses | `status` / markers | `ProcessViewStatus` / marker refs | `contracts` | Step 8 | not visible / missing / degraded by status | query no-write | query tests |
| Inbound event | `InboundEventEnvelope<T>` | `metadata` / `payload` | `EventMetadata` / typed event | `contracts` | Step 8 | invalid -> quarantine;duplicate -> stored receipt | consumer trusted source only in flow | consumer tests |
| Outbound event | `ProcessOutboundEventEnvelope` | `event_kind` / `truth_ref` / `payload` | `ProcessOutboxEventKind` / payload enum | `contracts` | Step 8 | invalid mapping -> outbox failed | publisher uses envelope only | publisher tests |
| Job | all job DTOs | `metadata` / `scope` / `receipt` | `JobMetadata` / scope / `JobRunReceipt` / `JobError` | `contracts` | Step 8 / 13 | duplicate -> stored receipt;partial -> report | job runner does not own truth | job tests |

### 6.10 状态闭环表

| 状态枚举 | 正式状态值来源 | 产生函数 | 合法迁移来源 | 禁止迁移 | 测试用例 | 验收证据 |
|---|---|---|---|---|---|---|
| `RuntimeProcessShapeState` | Step 6 / 10 | `RuntimeProcessShape::from_definition`;`activate`;`retire` | shape sync flow | retired reactivation | `runtime_process_shape_state_transitions` | 后续 `06` 同步 |
| `ProcessProfileState` | Step 6 / 10 | `propose`;`activate`;`switch_to`;`suspend`;`retire` | profile flows | retired use | `process_profile_state_transitions` | 后续 `06` 同步 |
| `ProcessInstanceState` | Step 6 / 10 | `create`;`start`;`advance`;`complete`;`cancel`;`pause_for_gate`;`resume_from_gate`;`mark_recovering`;`complete_recovery` | instance / activity / gate / recovery flows | terminal advance;recovery fork | `process_instance_state_transitions` | 后续 `06` 同步 |
| `ActivityState` / `TokenState` / `GatewayState` | Step 6 / 10 | activity / token / gateway methods | activity progression flow | consumer direct complete | activity / token / gateway tests | 后续 `06` 同步 |
| `WaitingGateState` | Step 6 / 10 | `open_for_activity`;`attach_decision`;`resume`;`cancel`;`expire` | gate command + governance marker | consumer direct resume | `waiting_gate_state_transitions` | 后续 `06` 同步 |
| `CheckpointState` / `RecoveryAttemptState` | Step 6 / 10 | checkpoint / recovery factories and methods | recovery flows / maintenance job | expired checkpoint recovery;terminal duplicate mutate | checkpoint / recovery tests | 后续 `06` 同步 |
| `StageState` / `TimeboxBindingState` | Step 6 / 10 | rhythm methods | rhythm command and work context marker | terminal / invalid binding recovery | rhythm tests | 后续 `06` 同步 |
| `ProjectionFreshnessState` / `ProcessProgressState` | Step 6 / 10 | projection builder / job | projection rebuild job | command direct mutate | projection tests | 后续 `06` 同步 |
| `ReferenceResolutionLifecycleState` | Step 6 / 10 | resolver / refresh methods | consumer / refresh job | invalid -> resolved without evidence | reference tests | 后续 `06` 同步 |
| `TraceHandoffState` / `OutboxPublicationState` / `ReconciliationResultState` | Step 6 / 10 | job methods | outbox / handoff / reconciliation jobs | published -> pending;report repairs truth | job tests | 后续 `06` 同步 |

### 6.11 Phase / commit boundary 闭环表

| Phase / commit boundary | 包含内容 | 明确排除 | 依赖前置 | 不得依赖后续 | 测试范围 | 验收范围 |
|---|---|---|---|---|---|---|
| `07` 待定义 | 由新版 `07-实施计划.md` 定义 | Step 17 不写任务拆分 | Step 19 formal `03`;新版 `04/05/06` 校准 | 不得引用后续 boundary 才定义的 DTO / result / evidence / script output | 对照 Step 16 分配 | 对照新版 `06` |

规则:

- 每个 future phase / commit boundary 开工前必须重新执行字段、DTO、状态、测试、验收和 phase boundary 复核。
- 若某 boundary 需要后续 boundary 才定义的对象、结果、证据、report 或脚本输出,必须暂停调整 `07`,不得要求实现者自行拆分。

### 6.12 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 口语名 | 出现位置 | 修正要求 |
|---|---|---|---|---|
| runtime shape | `RuntimeProcessShape` | `ProcessTemplate` / `TemplateIndex` | 旧 `05`、旧历史 | 回写后续 `05/06/07`;实现不得使用旧名 |
| shape sync command | `SyncRuntimeProcessShape` | `SyncTemplateIndex` | 旧测试方案 | 使用 Step 8 command name |
| profile adoption command | `AdoptProcessProfile` | `BindProcessProfile` | 旧测试方案 | 使用 Step 8 command name |
| profile state | `ProcessProfileState::{Proposed,Active,Suspended,Retired}` | `frozen` | 旧测试方案 | 使用 Step 6 / 10 状态名 |
| instance state | `ProcessInstanceState::{NotStarted,Running,Waiting,Recovering,Completed,Cancelled,Failed}` | `suspended` as instance state | 旧测试方案 | waiting 由 `Waiting` 表达 |
| gate state | `WaitingGateState::{Waiting,DecisionResolved,Resumed,Cancelled,Expired}` | `WaitingGateState` 旧单一口径 | 旧文档 | 使用 Step 6 / 10 状态名 |
| query response | `ProcessViewStatus` + markers | null / bare error | 旧 query 习惯 | Query 必须返回正式 surface |
| duplicate replay | `OperationResultRepository` | recompute from truth | 旧实现惯性 | 实现 duplicate 只能读 stored result / receipt |

### 6.13 冲突与修正表

| 冲突 ID | 冲突位置 | 冲突类型 | 影响范围 | 推荐修正 | 处理状态 |
|---|---|---|---|---|---|
| DDD17-ISSUE-001 | `projects/L1-process/05-测试方案.md` | 旧测试口径 | 后续测试方案和实现门禁 | 按 Step 16 重建 / 校准 `05` | 待后续文档处理 |
| DDD17-ISSUE-002 | `projects/L1-process/06-验收标准.md` | 旧验收口径 | 后续验收门禁 | 按新版 `03` 和 Step 16 同步 `06` | 待后续文档处理 |
| DDD17-ISSUE-003 | `projects/L1-process/03-详细设计.md` 缺席 | 正式文档未装配 | 正式移交实现 | Step 19 装配正式文档 | Step 19 待处理 |
| DDD17-ISSUE-004 | `/home/aris/Projects/quantalithos-process` | 目标实现仓未发现 | PH-01 开工 | `07` PH-01 前置检查创建或确认仓路径 | 待实施计划处理 |

### 6.14 正反例

| 类别 | 正例 | 反例 |
|---|---|---|
| 字段缺失 | 暂停并回 Step 6 / 8 补 schema | 在 Rust struct 里加 `TODO` field |
| duplicate replay | 通过 `OperationResultRepository` 返回 stored result / receipt | 从 current truth 重算 command result |
| Query degraded | 返回 `ProcessViewStatus::Degraded` + marker | 返回空对象或顺手 rebuild projection |
| Consumer event | 写 snapshot / reference / marker | 调用 command service 完成 Activity / resume gate |
| Outbound event | 从 committed outbox truth ref 构造 envelope | publisher adapter 直接读取 domain object 临时造 payload |
| Phase boundary | `07` 每个 commit 前复核字段 / DTO / 状态 / evidence | 当前 commit 使用后续 commit 才定义的 result DTO |
| 实现仓 commit | `feat(activity): add activity progression state transitions` | `docs: 收稳 process 实现` 用中文提交代码 |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_17_implementation_handoff.md`
>
> 延伸阅读:
> - Step 1~16 全部中间产物
> - `standards/document/设计文档讨论中间产物规范.md` §5.10
> - `standards/document/实施计划书写规范.md`

`03-详细设计.md` §16 必须写入本 Step 的实施承接清单、实施前置阅读清单、实施前检查清单和跨文档一致性复核表。详细设计只移交实现契约和复核门禁,不写开发排期、任务拆分或 commit boundary。后续 `07-实施计划.md` 必须引用正式 `03` 和对应 calibration Step,不得复制重写字段表、schema、flow、状态矩阵或测试表。

正式实现开工前必须确认:

- Step 19 已装配正式 `03-详细设计.md`。
- `04/05/06/07` 已按新版 `03` 同步。
- `/home/aris/Projects/quantalithos-process` 存在或已创建。
- git config、Rust 编码规范、提交规范、源码英文和 phase boundary 复核已进入 `07` 开工门禁。

---

## 8. 待确认事项

| 编号 | 待确认项 | 当前影响 | 需要谁确认 | 未确认前处理方式 |
|---|---|---|---|---|
| DDD17-OPEN-001 | Step 19 formal `03` 尚未装配 | 不能正式移交实现 | design owner | 继续 Step 18 / 19;不得恢复旧 `03` |
| DDD17-OPEN-002 | `05-测试方案.md` / `06-验收标准.md` 旧口径 | 测试 / 验收不能作为实现门禁 | design owner | 后续按 SOP 重建或校准 |
| DDD17-OPEN-003 | `/home/aris/Projects/quantalithos-process` 未发现 | PH-01 不能直接开工 | implementation owner | `07` PH-01 前置检查确认路径或创建仓 |
| DDD17-OPEN-004 | `07-实施计划.md` 尚未生成 | phase / commit boundary 未定义 | design owner | Step 17 不补任务拆分;后续 `07` 定义 |

无阻塞 Step 18 的待确认事项。

---

## 9. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 实施承接清单已输出 | 通过 | 见 §6.2 |
| 实施前置阅读包含提交规范、git config、Rust 编码规范、注释规范 | 通过 | 见 §6.3 / §6.4 |
| 字段 / DTO / Query / 状态 / protocol 闭环已复核 | 通过 | 见 §6.6~§6.10 |
| Phase / commit boundary 未越权定义 | 通过 | 见 §6.11 |
| 命名漂移和冲突已记录 | 通过 | 见 §6.12 / §6.13 |
| 未通过下游同步事项未交给实现者选边 | 通过 | 记录为待确认事项 |
