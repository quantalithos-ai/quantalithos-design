# Step 17. 收口详细设计到实施计划的承接清单

> 对应正式文档章节: `03-详细设计.md` 第 16 章 详细设计到实施计划的承接清单
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
> 当前状态: Step 17.5 cross-step closure / Step 18 handoff / 回填草稿 已写入;等待用户审核后进入 Step 18 风险与待确认事项
> 本文件性质: 详细设计 Step 17 中间产物,不是正式 `03-详细设计.md`,也不是正式 `07-实施计划.md`
> 执行纪律: 本 Step 只写实施计划承接清单和实现前阅读 / 复核输入,不定义 phase、commit boundary、TC、fixture、CI、evidence 或交付排期

---

## 1. 17.0 framework / input boundary / batch plan

本批只建立 Step 17 的执行框架、输入边界、SOP 问题初答、当前材料诊断、设计原则、分批计划、写入红线和 Step 16 handoff 承接表。具体可实施契约盘点、前置阅读矩阵、跨文档一致性复核、`07` phase / commit-boundary 审计输入和正式回填草稿在后续小批次逐步写入。

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 17 收口详细设计到实施计划的承接清单 |
| 当前批次 | 17.0 framework / input boundary / batch plan |
| 当前结论 | Step 17 已进入;本批只完成 implementation handoff 框架,不做正式实施计划拆分 |
| 本批边界 | 不新增 object、field、port、state、error、DTO、stored material、TC、fixture、CI、evidence、phase 或 commit boundary |
| 输出文件 | `projects/L1-identity/design-calibration/03_ddd_step_17_implementation_handoff.md` |
| 下一批 | 17.1 implementable contract inventory |

### 1.2 Step 17 总体目标

Step 17 的目标是把 Step 1~16 已经形成的详细设计实现契约整理成后续 `07-实施计划.md` 可以承接的输入清单,并提前指出实现者开始编码前必须阅读的材料和必须复核的边界。

本 Step 需要让后续实施计划能够判断:

- 哪些详细设计契约已经足够进入实施计划。
- 哪些文档、规范和校准文件是实现者开工前必读材料。
- 字段、DTO / Event / Job、Query response、状态、持久化、错误、幂等、配置、观测和测试切口是否具备可追溯来源。
- 哪些内容不能交给实现者自行选择,必须在 Step 18 / Step 19 或后续 `04/05/06/07` 中继续闭合。
- 后续 `07` 如何引用正式 `03` 和校准文件,而不是复制详细设计正文形成第二真相源。

本 Step 不写开发排期、任务拆分、phase 划分、commit boundary、正式 TC 编号、测试 suite、fixture path、CI job、evidence 编号、coverage threshold、实现仓代码批次或交付时间表。这些属于后续正式 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 的职责。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成并已审核通过 | 固定新版 `00/01/02` 为详细设计输入,旧 `03` 只作诊断 |
| `03_ddd_step_02_scope.md` | 已完成并已审核通过 | 固定 P0 / 非范围,防止实施计划扩域 |
| `03_ddd_step_03_constraints.md` | 已完成并已审核通过 | 固定 Rust、源码语言、git config、提交规范和依赖约束 |
| `03_ddd_step_04_file_layout.md` | 已完成并已审核通过 | 固定目标实现仓与 workspace / crate / file layout |
| `03_ddd_step_05_module_contracts.md` | 已完成并已审核通过 | 固定七个实现模块和依赖方向 |
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | 固定对象、字段、函数、状态、不变量、trace/audit/outbox/handoff/report object |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | 固定 repository、port、adapter、UoW、Clock、IdGenerator、stored result 和 fake parity |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | 固定 Command、Query、Inbound Event / Callback、Outbound Event 和 Operations Job protocol surface |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 固定逐接口处理流、事务顺序、副作用顺序和异常分支 |
| `03_ddd_step_10_state_matrix.md` | 已完成并已审核通过 | 固定正式状态枚举、合法迁移、非法迁移和错误映射 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成并已审核通过 | 固定持久化、optimistic version、transaction、stored replay、projection/reference consistency |
| `03_ddd_step_12_error_recovery.md` | 已完成并已审核通过 | 固定错误模型、retry、terminal failure、quarantine、degraded / failed surface |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成并已审核通过 | 固定 idempotency、duplicate replay、commit unknown、concurrency guard |
| `03_ddd_step_14_config_external_binding.md` | 已完成并已审核通过 | 固定 config boundary、runtime assembly、adapter binding、external dependency availability |
| `03_ddd_step_15_observability_audit.md` | 已完成并已审核通过 | 固定日志、指标、审计、trace、report、redaction 和 forbidden material guard |
| `03_ddd_step_16_test_cuts.md` | 已完成并已审核通过 | 固定最小测试切口,为后续 `05/06/07` 提供验证入口 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定 Step 17 与正式实施计划的边界、阅读矩阵和 phase / commit-boundary 审计要求 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 固定实现移交前可落码闭环、经验复核和 blocker 暂停口径 |
| `projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md` | 参考材料 | 只参考 Step 17 粒度、表结构和承接方式,不复制 governance 业务对象或 phase 内容 |

### 1.4 SOP 问题初答

| SOP 问题 | Step 17 初答 |
|---|---|
| 哪些实现契约已经足够进入实施计划? | Step 1~16 已经形成上游边界、范围、约束、文件布局、模块、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cut 的详细设计输入。它们可以进入实施计划的引用清单,但正式实现移交仍需 Step 19 装配正式 `03`,并由后续 `07` 按 phase / commit boundary 做整体可落码审计。 |
| 实施者需要先阅读哪些文档? | 至少需要阅读正式 `00/01/02`、Step 19 后的正式 `03`、后续正式 `04/05/06/07`、本轮 `03_ddd_step_01~17` 中与当前实施阶段相关的校准文件、Rust 编码规范、目录组织规范、实施计划规范、可落码性标准和项目提交规范。 |
| 提交规范、git config 用户、Rust 编码规范和注释规范是否列入前置阅读? | 必须列入。Step 3 已固定实现仓 git config、英文 commit message、Rust 源码英文标识符 / rustdoc / 普通注释 / 测试名和 AI footer 空行规则;Step 17 后续会转成阅读与开工检查项。 |
| 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则? | 需要在 17.1~17.3 做预复核。当前判断是 Step 6 字段来源应能回指 Step 8 protocol、Step 9 flow、Step 7 repository / resolver / id generator / clock 或 Step 11 查表 / cursor / version 规则。发现断裂时不能进入实现计划。 |
| 每个 Command / Event / Job 是否能构造目标对象,或明确缺失处理? | 需要在 17.1~17.3 按 6 Command、5 Inbound/Callback、10 Outbound、6 Job 逐族复核。缺失处理必须回指 rejected、unsupported、delayed/quarantined、retryable/terminal failed、stored replay、partial report 或 no-write/no-repair surface。 |
| 每个 Query 的 response view / page / marker、read model / projection / cursor id/ref 是否闭合? | 需要在 17.2 复核 14 个 Query。Query 必须保持 visibility-first、not-visible/degraded/missing/stale surface 和 no-write,不得在实施计划中变成 repair/rebuild/refresh 入口。 |
| 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名? | Step 10 和 Step 16 已形成状态与测试切口主线。Step 17 后续只做一致性复核输入,正式 `05/06/07` 仍需按 Step 10 状态名生成测试和验收门禁。 |
| 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据? | 本 Step 不定义 phase / commit boundary,只能列出后续 `07` 必须复核的输入。正式判断留给 `07` 对每个 boundary 的整体可落码闭环审计。 |
| 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移? | 需要在 17.3 统一列出命名一致性复核项。旧 `03`、旧 `04/05/06/07` 和历史实现口径不得反向污染新版 Step 1~16。 |
| 哪些内容仍待确认,不能进入实施? | 当前正式 `03` 尚未由 Step 19 装配;`04/05/06/07` 虽已有文档或草稿,但需要按新版 `03` 复核;正式 phase / commit boundary、TC、fixture、CI、evidence 和 acceptance gate 不能在 Step 17 自行补。 |
| 实施计划应该如何引用本文,而不是重复本文? | `07` 应按阶段或 commit boundary 引用正式 `03` 章节和具体校准文件,转成阅读门禁、开工前复核、实施顺序、测试门禁和暂停条件;不得复制 Step 6 字段表、Step 8 DTO 表、Step 9 flow、Step 10 状态矩阵或 Step 16 测试切口表形成第二真相源。 |
| 本文是否给 `07` 的交付实现前闭环审计提供足够输入? | 17.0 只建立框架,尚未完成。17.1~17.4 必须补齐实现契约 inventory、阅读矩阵、跨文档一致性复核和 `07` 审计输入清单后,才能判定完成。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 当前问题 | Step 17 处理 |
|---|---|---|
| Step 1~16 内容已经很完整 | 实施者直接通读全部校准文件成本高,也容易把背景讨论当成正式实施计划 | Step 17 提供承接清单和后续阅读矩阵输入,但不替代正式 `07` |
| 正式 `03-详细设计.md` 尚未装配 | 当前正式 `03` 仍不能作为新版实现基线 | 标记为 Step 19 前不得交给实现者按正式基线开工 |
| 旧 `04/05/06/07` 早于新版 `03` | 可能含旧对象、旧状态、旧测试/验收口径 | Step 17 只列后续复核责任,不直接修旧下游文档 |
| Step 16 已给最小测试切口 | 仍未分配正式 TC、suite、fixture、CI、evidence | 明确留给 `05/06/07`,Step 17 只做 handoff |
| implementation plan 规范要求 phase / commit boundary | Step 17 不能提前定义正式 boundary | 只列 `07` 必须审计的输入项和红线 |
| 可落码性标准经验项很多 | 不能把标准整段复制进 Step 17 或 `07` | 后续 17.4 只列 `07` 选择适用经验项的复核要求 |

### 1.6 设计原则

| 原则 | 正式口径 |
|---|---|
| handoff, not implementation plan | Step 17 只做详细设计到实施计划的承接,不写正式实施计划 |
| cite, do not duplicate | 后续 `07` 引用正式 `03` 和校准文件,不得复制详细设计表格成为第二真相源 |
| no schema by handoff | Step 17 不新增 schema、port、state、error、DTO、repository、stored material、config key 或 observability field |
| no formal test IDs here | 正式 TC、suite、priority、fixture、CI、evidence、coverage 和 acceptance 留给 `05/06/07` |
| implementation agent must not choose | 字段来源、状态名、protocol shape、phase inclusion 或 error mapping 若不闭合,必须回设计闭口,不得交给实现者现场取舍 |
| future 07 owns boundary audit | phase / commit boundary 的可落码审计由后续正式 `07` 执行,Step 17 只提供输入和暂停条件 |
| current formal 03 is not baseline | 正式实现基线必须等 Step 19 装配后的 `03-详细设计.md` |
| downstream docs must be rechecked | 现有 `04/05/06/07` 需要按新版 `03` 复核或重写,不得反向约束当前详细设计 |

### 1.7 Step 17 分批计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 17.0 | framework / input boundary / batch plan | [x] 已写入 |
| 17.1 | implementable contract inventory | [x] 已写入 |
| 17.2 | persistence / error / idempotency / config / observability handoff | [x] 已写入 |
| 17.3 | implementer reading matrix and citation rules | [x] 已写入 |
| 17.4 | `07` phase / commit-boundary audit input list | [x] 已写入 |
| 17.5 | cross-step closure / Step 18 handoff / 回填草稿 | [x] 已写入 |

### 1.8 Step 17 写入红线

| 红线 | 说明 |
|---|---|
| 不修改正式 `03` | 正式 `03-详细设计.md` 留 Step 19 装配 |
| 不写正式 `07` | 不定义 phase、commit boundary、BATCH、IMPL、GATE、实现顺序或提交计划 |
| 不写正式测试方案 | 不分配 TC 编号、priority、suite、fixture path、CI job、coverage threshold 或 evidence 编号 |
| 不新增实现契约 | 不新增 object、field、function、port、adapter、repository、state、error、DTO、event、job、stored material 或 config key |
| 不修旧下游文档 | 旧 `04/05/06/07` 的复核和重写由后续对应 SOP 处理 |
| 不把参考项目当真相源 | governance Step 17 只用于粒度参考,identity 业务结论只来自 identity Step 1~16 |
| 不替实现者选边 | 发现字段来源、state transition、query response、event payload、job report 或 persistence surface 断裂时,必须记录 blocker 并回前序 Step 闭口 |
| 不复制标准全文 | 只引用实施计划规范和可落码性标准中的适用审计要求,不把标准整段搬进项目 truth |

### 1.9 Step 16 handoff 承接表

| Step 16 handoff topic | Step 17 承接方式 | 禁止替代 |
|---|---|---|
| module test ownership | 17.1/17.3 把七个 crate 的测试 ownership 转成实现前阅读和 `07` test gate 输入 | 用跨层集成测试替代全部 module cut |
| command implementation cuts | 17.1 盘点 6 个 Command 的 accepted/rejected/duplicate/conflict 实施承接点 | 增删 command surface 或改变 Step 9 flow |
| query no-write cuts | 17.1/17.2 盘点 14 个 Query 的 response、visibility、degraded/stale 和 no-write 承接点 | query 自动 repair/rebuild/refresh |
| consumer/callback receipt cuts | 17.1/17.2 盘点 5 个 Inbound/Callback 的 typed receipt replay 和 unsupported/delayed/quarantined/noop 承接点 | unsupported 写 accepted trace 或 duplicate 重跑 payload |
| outbound material cuts | 17.1/17.2 盘点 10 个 Outbound material 的 accepted-only、saved marker、body-free、publish failure isolation 承接点 | publisher 从 current truth 重构 payload |
| operations job cuts | 17.1/17.2 盘点 6 个 Job 的 duplicate report replay、partial item refs、retryable/terminal failure、no truth repair 承接点 | job 直接修 core identity truth |
| state machine cuts | 17.1/17.4 把 Step 10 状态族转成 `07` boundary audit 输入 | 新增全局状态机或用字符串/ref 推断状态 |
| transaction/error/concurrency cuts | 17.2 盘点 same-UoW、rollback、commit unknown、stored replay missing、idempotency conflict、version/unique conflict、in-flight、reentry guard | 用 unique key 替代 replay 或 duplicate rerun |
| config/runtime/adapter cuts | 17.2/17.3 盘点 config boundary、runtime assembled vs adapter healthy、disabled/fake no-success、non-core dependency guard | 配置改变 domain invariant 或绕过 facade |
| observability/redaction cuts | 17.2/17.3 盘点 log/metric/audit/report/handoff、low-cardinality labels、forbidden body scan、fake private material scan | 用日志替代业务 trace/audit 或保留 raw body |
| formal test planning handoff | 17.4 标记后续 `05/06/07` 必须分配 TC、priority、fixture、CI、evidence 和 commit boundary | 在 Step 17 中补正式测试方案细节 |

### 1.10 17.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 16 handoff | 通过 | §1.9 已逐项承接 |
| 是否限定 Step 17 范围 | 通过 | 只写 implementation handoff 框架,不写正式实施计划 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只引用 Step 1~16 和标准 |
| 是否提前定义 phase / commit boundary | 未定义 | 留给后续正式 `07` |
| 是否提前写 TC / fixture / CI / evidence | 未写入 | 留给 `05/06/07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 17.1 | implementable contract inventory |

---

## 2. 17.1 implementable contract inventory

本批盘点 Step 5~10 已经闭合、可交给后续实施计划承接的实现契约。它只回答“哪些契约已经能作为 `07-实施计划.md` 的输入”,不定义实施阶段、提交边界、代码批次、测试编号或验收证据。

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 17.1 implementable contract inventory |
| 当前结论 | Step 5~10 的模块、对象、port、protocol、flow 和 state matrix 均有可承接 inventory |
| 本批关闭事项 | DDD-S17-OPEN-001 |
| 本批边界 | 只盘点已闭合契约;不新增 schema、port、state、error、DTO、flow 或 phase boundary |
| 下一批 | 17.2 persistence / error / idempotency / config / observability handoff |

### 2.2 模块实现契约 inventory

| 实现模块 | 已定义位置 | 可进入实施计划的契约 | `07` 使用方式 | 不得改写 |
|---|---|---|---|---|
| `identity-contracts` | Step 5 §7.1~§7.4;Step 8 | typed refs、DTO、view、event payload、job DTO、receipt、public error surface | 作为 public protocol / shared contracts 的实现输入 | 不得依赖 `identity-domain` 或 repository implementation |
| `identity-domain` | Step 5 §7.1~§7.4;Step 6;Step 10 | truth object、state enum、policy、guard、domain change、domain error | 作为状态机、invariant、transition helper 的实现输入 | 不得读取 repository、resolver、publisher、handoff adapter 或 runtime config |
| `identity-application` | Step 5 §7.1~§7.4;Step 7;Step 9 | service、port trait、UoW、idempotency、stored result、operation context、facade | 作为 application service / use-case orchestration 的实现输入 | 不得新增 Step 7 未定义 port 或绕过 formal mapper / lookup |
| `identity-infra` | Step 5 §7.1~§7.4;Step 7 | repository adapter、resolver adapter、publisher、handoff adapter、fake runtime、runtime wiring | 作为 adapter implementation 和 fake equivalence 的实现输入 | 不得新增业务 invariant、私有补口或通过 private map 弥补 formal surface 缺口 |
| `identity-api` | Step 5 §7.1~§7.4;Step 8;Step 9 | API command/query entry mapping 和 application facade dispatch | 作为 handler / route-to-DTO / response mapping 的实现输入 | 不得直连 repository、UoW、projection store 或 adapter |
| `identity-worker` | Step 5 §7.1~§7.4;Step 8;Step 9 | inbound event / callback entry mapping、dedupe、receipt surface、facade dispatch | 作为 consumer/callback runner 的实现输入 | worker ack/retry/dead-letter 不得替代 business receipt 或 accepted truth |
| `identity-jobs` | Step 5 §7.1~§7.4;Step 8;Step 9 | operations job entry mapping、job request/response/report、facade dispatch | 作为 job runner / maintenance entry 的实现输入 | job runner 不得直连 repository、publisher、handoff adapter 或 projection store |

### 2.3 对象实现契约 inventory

| 对象族 | 已定义位置 | 可实现对象 / helper | 主要字段来源 | 后续实施计划承接点 |
|---|---|---|---|---|
| shared vocabulary / typed refs | Step 6 §7.2~§7.9 | `GlobalMemberRef`、source/basis/reason/material refs、trace/audit/outbox/handoff/report refs | request、loaded truth、id generator、resolver summary、formal mapper | contracts shared refs and marker types |
| member / lifecycle truth | Step 6 6.2-a~6.2-b;Step 10 10.1 | `GlobalMember`、`IdentityAnchorState`、`GlobalLifecycleState`、lifecycle policy / guard | command request、id generator、clock、loaded member/lifecycle truth、governance basis summary | domain object + command service |
| role capability truth | Step 6 6.2-c;Step 10 10.2 | `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、source policy | command / source event payload、role/capability resolver、reference state,source version marker | domain object + source consumer |
| career records | Step 6 6.2-d;Step 10 10.2 | `CareerRecord`、`CareerAppendPolicy`、career source markers | command / work event payload、work source resolver、duplicate source lookup | append-only domain object + consumer |
| memory references | Step 6 6.2-e;Step 10 10.2 | `MemoryReference`、`MemoryReferenceState`、memory reference policy | command / memory event / archive callback payload、memory/archive resolver、handoff receipt marker | relation truth + callback flow |
| trace / audit / visibility | Step 6 6.3;Step 7 7.1 / 7.4;Step 10 10.3 | `IdentityTraceRecord`、`AuditTrail`、`VisibilityPolicy`、read surface markers | accepted subject mapper、marker subject mapper、query request/view/resolver summary | trace/audit append and query visibility |
| projection / reference / reconciliation | Step 6 6.4;Step 7 7.5;Step 10 10.4 | `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport`、`ReconciliationPolicy` | projection lookup、reference bundle key/version,maintenance expansion,job report input | projection/reference/report jobs and read models |
| outbox / handoff / propagation | Step 6 6.5;Step 7 7.6 / 7.7;Step 10 10.5 | `IdentityOutboxRecord`、`OutboxState`、`TraceHandoffIntent`、`HandoffState`、propagation policies | accepted outbox subject, payload marker,topic binding,handoff target/scope/receipt marker | publish / deliver / retry application jobs |
| application helpers | Step 6 6.6;Step 7 7.1 / 7.2 / 7.6;Step 10 10.6 | `IdentityOperationContext`、idempotency record、stored result、command effect summary、job report | public metadata shell、request digest,stored result/report repositories,UoW cursor | duplicate replay and service orchestration |
| entry / runtime helpers | Step 6 6.7;Step 7 7.8 / 7.9;Step 10 10.7 | runtime config shell、runtime assembly state、adapter availability、entry validation/dispatch result | config evidence,adapter availability port,entry metadata,dispatch catalog | API/worker/jobs entry guards and runtime wiring |

### 2.4 Trait / Port / Adapter inventory

| Port family | 已定义位置 | 可进入实施计划的契约 | 关键闭环 | 不得替代 |
|---|---|---|---|---|
| shared helpers | Step 7 §7.7 | version、page、UoW、cursor、subject mapper、marker subject mapper、ref sets | cursor/version/key/subject/view 不混用 | timestamp、idempotency key、source version、字符串拼接 |
| application basic ports | Step 7 7.2 | Clock、IdGenerator、UoW manager、cursor assigner、operation context factory、dispatch target catalog | id/time/context/dispatch 来源统一 | domain object 取系统时间或 entry 猜 operation channel |
| core truth repositories | Step 7 7.3 | member/lifecycle/role/career/memory versioned read/save/list and duplicate lookup | expected version 来自 versioned read;append-only 不覆盖旧 record | repository miss 自动建档或 hidden read-on-save |
| append-only / audit / trace repositories | Step 7 7.4 | trace append/read、audit trail lookup/save、trace history facade、handoff intent history | trace/audit subject 来自 mapper;append-only 保持 body-free | HistoryRecord 第二真相源或 raw audit/log body |
| projection / read / reference / report repositories | Step 7 7.5 | stable view lookup、visibility resolver、reference bundle versioned read/save、maintenance expansion、report writer | query 不拼 view/scope;reference sidecar 显式 bundle key/version | query rebuild、source version 当 optimistic version、private fake scan |
| outbox / result / idempotency repositories | Step 7 7.6 | outbox state、idempotency reserve/complete、stored result save/load、job report replay | duplicate replay 只读 stored result/receipt/report | duplicate rerun mutation 或从 current truth 重算 |
| external resolver / publisher / handoff ports | Step 7 7.7 | basis/source/work/memory/archive resolver、topic binding、publisher、handoff delivery、adapter availability | resolver 返回 body-free summary/outcome;publisher/handoff outcome 正式分类 | raw external body、adapter error string、HTTP success 当 delivered |
| entry restrictions / facade | Step 7 7.8 | API/worker/jobs 只经 application facade 和 dispatch catalog | entry result 不等于 application accepted / consumer receipt / job report | entry 直连 repository / adapter / store |
| infra / fake equivalence | Step 7 7.9 | durable/fake/controlled/disabled adapter parity 和 runtime wiring | fake 必须使用同一 formal port surface | private map、default valid、测试专用入口 |

### 2.5 Protocol inventory

| Protocol family | 数量 | 已定义位置 | 可进入实施计划的契约 | 实施计划不得改写 |
|---|---:|---|---|---|
| Command | 6 | Step 8 §7.2 / §8.1.10 | `EstablishGlobalMember`、`UpdateGlobalLifecycleState`、`MaintainRoleCapabilitySummary`、`AppendCareerRecord`、`MaintainMemoryReference`、`PrepareTraceHandoff` 的 request/result/facade/flow 映射 | 不新增 command;不改变 DTO -> domain object closure |
| Query | 14 | Step 8 §7.3 / §8.1.11 | core truth、member summary、trace/audit、projection/reference/report、outbox/handoff read response surface | 不把 query 改成 write / repair / rebuild / refresh |
| Inbound Event / Callback | 5 | Step 8 §7.4 / §8.1.12 | source changed、work accepted、memory source state、archive handoff result、trace handoff result envelope/payload/receipt | 不保存 external body;不把 callback receipt 混成普通 accepted trace |
| Outbound Event | 10 | Step 8 §7.5 / §8.1.13 | accepted-only event envelope + body-free payload marker;发布统一走 outbox publish flow | 不让 publisher 回读 current truth 重构 payload |
| Operations Job | 6 | Step 8 §7.6 / §8.1.14 | projection rebuild、reference refresh、reconciliation、outbox publish、handoff deliver、propagation retry job request/output/report | 不让 job runner 直连 store 或修 core truth |
| Shared protocol helpers | Step 8 8.1 | Step 8 §8.1.2~§8.1.9 | metadata、digest shell、command/query envelopes、page surface、rejection/issue/degraded shell、receipt、outbound envelope、job shell | 不暴露 application-local `IdentityOperationContext` 或 repository `Page<T>` |

### 2.6 Function flow inventory

| Flow family | 已定义位置 | 可进入实施计划的契约 | 必须保持的顺序 / 边界 | 不得替代 |
|---|---|---|---|---|
| command flows | Step 9 §7.1.1;9.1-a~9.1-c;§21.2 | 6 条 command accepted/rejected/duplicate/conflict flow | command request -> operation context -> idempotency reserve -> versioned load -> domain transition -> same-UoW truth/trace/audit/outbox/stale/stored result -> commit | skip stored result,append side effect outside UoW,duplicate rerun |
| query flows | Step 9 §7.1.2;9.2-a~9.2-c;§21.4 | 14 条 visibility-first no-write flow | query request -> operation context -> visibility resolver -> repository/projection/report read -> surface assembly | query miss repair,rebuild projection,refresh reference,append trace/audit/outbox |
| inbound / callback flows | Step 9 §7.1.3;9.3;§21.2 | 5 条 consumer/callback receipt and marker flow | envelope validation -> idempotency reserve -> duplicate replay -> target/reference load -> accepted/noop/delayed/quarantined receipt -> stored result -> commit | unsupported 写 accepted trace,callback 缺 receipt marker,duplicate 重跑 payload |
| outbound material | Step 9 §7.1.4;9.4;§21.5~§21.6 | 10 条 accepted-only outbox material mapping | accepted command/consumer/callback truth -> subject mapper -> payload marker -> outbox record | publisher 从 current truth 构造 event,query/job retry 创建 accepted event |
| operations jobs | Step 9 9.5;§20;§21.2~§21.3 | 6 条 job flow and stored report replay | job request -> operation context -> idempotency reserve -> duplicate stored report replay or item processing -> job report + stored result -> commit | duplicate 重新 list store,job 修 core truth,report 保存 raw body |
| cross-flow audit | Step 9 §21 | transaction/write path、visibility、trace/audit/outbox/projection、body-free boundary | all accepted side effects from formal mapper/port;all query paths read-only | route/source string 推断 subject/scope/view;body material persistence |

### 2.7 State machine inventory

| 状态族 | 已定义位置 | 可进入实施计划的状态机 | 关键边界 | 后续承接 |
|---|---|---|---|---|
| business truth | Step 10 10.1 | `IdentityAnchorState`、`GlobalLifecycleState`、high-risk lifecycle precheck | `TombstoneHeld` terminal;`Retired -> Tombstoned` 是唯一 terminal upgrade;basis guard 不隐藏 transition | domain transition tests and command flow implementation |
| business truth + source state | Step 10 10.2 | role summary/source snapshot、work source、career record、memory source/reference | source pending/unavailable 不得 silent accepted;career append-only;memory pending verification requires formal marker | source resolver / consumer / command flow |
| read / visibility / trace surface | Step 10 10.3 | query visibility/read surface、trace/audit read disposition | not visible/degraded/stale/missing 不推进 truth state | query response assembly |
| projection / reference / report maintenance | Step 10 10.4 | `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` | query 不 rebuild;reference unavailable 不删除 truth;report-only 不 repair | maintenance job and read model implementation |
| outbox / handoff propagation | Step 10 10.5 | `OutboxState`、outbound visibility/material disposition、`HandoffState` | `Published` != downstream consumed;`Delivered` requires formal attempt + receipt;retry only retryable | publish / deliver / retry jobs |
| application replay / job report | Step 10 10.6 | `IdentityIdempotencyRecord`、stored result kind、`IdentityJobRunReport` | completed/rejected stored must have stored result;duplicate no rerun;job report keeps item refs | idempotency / stored replay implementation |
| runtime / adapter / entry | Step 10 10.7 | config validation、runtime assembly、adapter availability、API/worker/job validation and dispatch | entry valid != application accepted;assembled != adapter healthy;available != business success | entry guard and runtime assembly |
| cross-state audit | Step 10 10.8 | naming/trigger/terminal/query/job/fake parity audit | 不需要 `IdentityGlobalState` 或统一 global lifecycle table | `07` boundary audit input |

### 2.8 可实施契约承接图

```text
----------------+
| Step 5 module |
+-------+--------+
        |
        v
+----------------+
| Step 6 object  |
+-------+--------+
        |
        v
+----------------+
| Step 7 ports   |
+-------+--------+
        |
        v
+----------------+
| Step 8 protocol|
+-------+--------+
        |
        v
+----------------+
| Step 9 flow    |
+-------+--------+
        |
        v
+----------------+
| Step 10 state  |
+-------+--------+
        |
        v
+------------------------------+
| later 07 reads this handoff   |
+------------------------------+
```

关键说明:

- 图只表达 Step 5~10 的实现契约承接顺序,不表达正式实施 phase。
- Step 11~15 的持久化、错误、幂等、配置和观测承接留 17.2。
- `07` 后续必须按正式 `03` 和对应校准文件引用这些契约,不得复制表格后再改写。
- 任一箭头断裂时,后续实施计划必须标记 blocker,不能交给实现者现场补 schema、port 或状态。

### 2.9 本批预复核结论

| 复核项 | 结论 | 说明 |
|---|---|---|
| 模块契约是否可承接 | 通过 | Step 5 七个 crate、职责、依赖方向和 entry restriction 清楚 |
| 对象契约是否可承接 | 通过 | Step 6 已按对象族和字段/状态闭环表收口;剩余持久化/错误/幂等细节留后续 Step |
| Port 契约是否可承接 | 通过 | Step 7 已闭合 mapper、cursor、version、repository、resolver、outbox、stored result、fake parity |
| Protocol 契约是否可承接 | 通过 | Step 8 已闭合 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Job 和 shared shell |
| Flow 契约是否可承接 | 通过 | Step 9 已闭合 command/query/consumer/outbound/job flow 和 cross-flow audit |
| State 契约是否可承接 | 通过 | Step 10 已闭合状态主语筛选、状态族矩阵和 cross-state audit |
| 是否发现 Step 5~10 新 blocker | 未发现 | 本批未发现需要回 Step 5~10 补 schema/port/state/flow 的缺口 |
| 是否越权定义实施计划 | 未越权 | 未定义 phase、commit boundary、BATCH、IMPL、GATE、TC、fixture、CI、evidence 或交付排期 |

### 2.10 17.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 Step 5~10 | 通过 | 模块、对象、port、protocol、flow、state 均已盘点 |
| 是否关闭 DDD-S17-OPEN-001 | 已关闭 | 实现契约 inventory 已覆盖 Step 5~10 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只引用前序 Step 已闭合契约 |
| 是否提前定义 phase / commit boundary | 未定义 | 留给后续正式 `07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 17.2 | persistence / error / idempotency / config / observability handoff |

---

## 3. 17.2 persistence / error / idempotency / config / observability handoff

本批承接 Step 11~15,把持久化 / 事务、错误 / 恢复、并发 / 幂等、配置 / 外部绑定、可观测性 / 审计整理为后续实施计划必须读取和复核的实现输入。本批仍不定义正式实施阶段、提交边界、测试编号、证据编号、配置文件 schema、告警阈值或运行参数数值。

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 17.2 persistence / error / idempotency / config / observability handoff |
| 当前结论 | Step 11~15 的持久化、错误、幂等、配置和观测承接项均已盘点,没有发现新的 blocker |
| 本批关闭事项 | DDD-S17-OPEN-002 |
| 本批边界 | 只承接已闭合设计;不新增 store、repository、error、state、config key、log field、metric label 或 audit DTO |
| 下一批 | 17.3 implementer reading matrix and citation rules |

### 3.2 Persistence / transaction handoff inventory

| Handoff item | 已定义位置 | 可进入实施计划的契约 | `07` 必须复核 | 不得替代 |
|---|---|---|---|---|
| data ownership / logical stores | Step 11 §7.2 | identity-owned truth、projection/view/report、trace/audit、outbox/handoff、idempotency/stored result、receipt/job report、runtime/entry marker 的 logical store 归属 | 当前实现阶段是否只保存 body-free refs / marker / safe summary / issue refs | 保存 sibling truth body、adapter raw response、receipt body、archive package 或 raw config |
| repository persistence semantics | Step 11 §7.3 | Step 7 repository 函数的 key、index、version、UoW、append-only / mutable 语义 | 每个 save/update 是否有正式 `IdentityVersion` 来源或 append-only key | hidden read-on-save、last-write-wins、source version 当 optimistic version |
| transaction boundary by flow family | Step 11 §7.4 | command accepted、consumer/callback、outbox publish、handoff、maintenance job、entry/query 的 begin/commit/rollback 边界 | accepted truth + trace/audit/outbox/stale/effect/stored/idempotency complete 是否同 UoW | accepted side effect outside UoW、query 开写事务、entry pre-dispatch 写 stored result |
| consistency / recovery / fake parity | Step 11 §7.5 | optimistic conflict、append-only replay、projection/reference eventual consistency、outbox/handoff failure isolation、fake/durable parity | fake 与 durable 是否实现相同 key/index/version/conflict/stored replay/no-write 语义 | fake 私有 map、query rebuild、duplicate rerun、publish failure 回滚 truth |
| Step 12 handoff | Step 11 §7.6.3 | invalid transition、version conflict、stored replay missing、commit unknown、forbidden body 等错误入口 | 后续 error mapping 是否引用 Step 12,而不是在 persistence adapter 内自定 public status | repository adapter 决定业务 retryability 或 public disposition |

### 3.3 Error / recovery handoff inventory

| Handoff item | 已定义位置 | 可进入实施计划的契约 | `07` 必须复核 | 不得替代 |
|---|---|---|---|---|
| error layering / taxonomy | Step 12 §2 | contracts、domain、application、port、protocol、worker、job、entry、infra 九层错误 owner 和 retryability | 当前实现 boundary 是否能判别 retryable、terminal、manual、read-surface-only | 单一 `InternalError` 覆盖所有失败 |
| public mapping by protocol family | Step 12 §3 | command rejection、query surface、consumer/callback receipt、job report、entry pre-dispatch failure 的 public surface | query not-visible/degraded 是否走 `IdentityQuerySurface`;consumer/job 是否有 replayable receipt/report | query not-visible 当普通 command error;entry failure 写 application stored result |
| exception branches by flow family | Step 12 §4 | entry、command、query、consumer/callback、publish/handoff、maintenance job、commit/rollback 分支处理 | stored replay missing/wrong-kind 是否统一 replay consistency defect;commit unknown 是否先查 replay store | stored missing 时重跑 mutation 或重扫 repository |
| recovery / marker rules | Step 12 §5 | RetryableMarker、TerminalMarker、ManualRecovery、ReadSurfaceOnly 等恢复类及 write permission matrix | recovery 是否只写正式 marker/report/safe issue,不反写真相 | terminal marker flip back to pending、query repair、raw diagnostic persistence |
| Step 13 handoff | Step 12 §6.4 | concurrency resources、idempotency replay、in-flight、commit unknown、terminal retry guard | 幂等矩阵是否保持 duplicate no-rerun 和 stored replay source | 用 unique key 或 transport ack 代替 replay |

### 3.4 Concurrency / idempotency handoff inventory

| Handoff item | 已定义位置 | 可进入实施计划的契约 | `07` 必须复核 | 不得替代 |
|---|---|---|---|---|
| concurrency resource inventory | Step 13 §2 | mutable truth、append-only、aggregate、projection/reference/report、outbox/handoff、replay/runtime/query exclusion | 每个写资源是否有正式 control primitive: version、unique key、stored replay 或 terminal guard | timestamp、cursor、source version、request digest 当 version |
| concurrency scenario matrix | Step 13 §3 | command、consumer/callback、query、operations job、outbox/handoff、maintenance 并发场景 | query 是否完全排除写并发;job duplicate 是否不重跑 body | query idempotency、job relist/recompute report |
| idempotency key and digest matrix | Step 13 §4 | command、consumer/callback、job 的 key source、channel namespace、stable digest material 和 excluded input | digest 是否只包含 body-free stable material;raw body 是否排除 | 用 job run ref、source event ref、current time、raw JSON 当 key/digest |
| duplicate / in-flight / reentry handling | Step 13 §5 | same digest replay、different digest conflict、in-flight no second writer、commit unknown first check、terminal retry guard | completed duplicate 是否只读 stored command/receipt/job report;retry 是否只选 retryable marker | duplicate rerun、different digest noop、retry terminal outbox/handoff |
| Step 14 handoff | Step 13 §6.4 | retention、in-flight timeout、digest algorithm binding、retry schedule、worker transport、job scheduling 的配置归属 | config 是否只绑定参数,不改变 key/digest/replay/no-write/no-repair 不变量 | 配置跳过 idempotency 或允许 query repair |

### 3.5 Config / external dependency handoff inventory

| Handoff item | 已定义位置 | 可进入实施计划的契约 | `07` 必须复核 | 不得替代 |
|---|---|---|---|---|
| configuration ownership boundary | Step 14 §2 | infra owns raw config;entry consumes validated snapshot;application/domain/contracts config-free | implementation 是否只有 infra/config/runtime builder 读取 raw config | application service / domain policy 读取 env 或 profile |
| config reference table | Step 14 §3 | `profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture` 的读取模块和注入点 | 每个配置项是否回指 `04-配置设计.md` 和 Step 7/9 使用点 | Step 17 或代码临时发明 env var / CLI flag / secret key |
| external dependency binding | Step 14 §4 | store、resolver、publisher、handoff、audit、clock/id、fake/controlled/disabled adapter strategy | 除 `core-contracts` 外是否没有非核心 sibling Cargo dependency | method/work/governance/memory/archive/artifact 实现仓作为 compile dependency |
| runtime builder order | Step 14 §5.3 | raw config load -> validate -> sensitive ref boundary -> config shell -> adapters -> facade -> entry modules -> runtime assembly state | runtime `Assembled` 是否只表示 wiring ready | assembled 当 adapter healthy、publisher delivered、business accepted |
| validation boundary | Step 14 §5.4 | config parse/type/range、profile compatibility、redline guards、secret refs、topic completeness、entry readiness、fixture compatibility | redline config 是否能拒绝 no-auth、body persistence、query write、fake default success | config 改 state matrix、query no-write、job no-repair、terminal retry |
| Step 15 handoff | Step 14 §6.4 | config/runtime/adapter/entry/fake observability safe fields and forbidden material | logs/metrics/audit 是否只使用 safe refs/kinds/issues | raw config body、secret、endpoint、adapter raw health body 出现在观测材料 |

### 3.6 Observability / audit handoff inventory

| Handoff item | 已定义位置 | 可进入实施计划的契约 | `07` 必须复核 | 不得替代 |
|---|---|---|---|---|
| log instrumentation cuts | Step 15 §2 | API、worker、jobs、application、repository/UoW、resolver、publisher、handoff、maintenance、runtime/config、adapter/fake log cuts | 是否记录 safe refs、operation kind、state/disposition、issue refs、duration/counts | free text log、raw request/event/job body、adapter raw response |
| metric instrumentation cuts | Step 15 §3 | command/query/consumer/job/repository/adapter/projection/reference/outbox/handoff/runtime metrics and low-cardinality labels | labels 是否仅限 kind/state/result/error/source family/adapter kind | ref、request id、actor id、topic raw string、free text label |
| business trace / audit / report / marker cuts | Step 15 §4 | accepted truth trace/audit/outbox,query no-write,duplicate no-rerun,job report/handoff/outbox marker boundaries | logs/metrics 是否不替代 business trace/audit;duplicate 是否不重放 business audit | rejected/unsupported/adapter failed 伪造成 accepted trace |
| runtime / config / adapter / fake redaction | Step 15 §5 | config/runtime/entry/adapter/fake observability safe fields,redaction matrix,enforcement rules | fake/controlled/disabled 是否只暴露 formal outcome kind and issue refs | private fake map、fixture raw body、secret、endpoint、receipt body |
| Step 16 handoff | Step 15 §6.3 | log/metric/audit/redaction/duplicate/query/outbox/handoff/job/fake forbidden-body test cut topics | 后续 `05/06/07` 是否承接验证入口,不在 Step 17 分配 TC | 用人工约定替代 forbidden material scan |

### 3.7 Cross-step implementation redlines

| Redline | 来源 | `07` 后续应如何使用 |
|---|---|---|
| no hidden persistence repair | Step 11 | 每个 boundary 若需要新的 lookup/index/versioned read,必须先回 Step 7/11,不得 adapter 私补 |
| no duplicate rerun | Step 11~13 | command、consumer/callback、job duplicate 必须 replay stored surface,不得重跑或重扫 |
| no query write | Step 9~13 / Step 15 | query 不开写 UoW、不写 trace/audit/stored result、不 repair projection/reference/report |
| no terminal retry | Step 10 / Step 12 / Step 13 | outbox/handoff/idempotency/job terminal state 不得由 retry config reopen |
| no config invariant bypass | Step 14 | config 只选 adapter/参数/profile,不得改变 domain invariant、idempotency、visibility、query no-write、job no-repair |
| no raw body or secret material | Step 11 / Step 12 / Step 14 / Step 15 | raw request/event/job/config/source/archive/adapter/receipt/log body 不进入 store、digest、issue、report、log、metric 或 audit |
| no fake private truth source | Step 7 / Step 11 / Step 15 | fake 必须走正式 port surface and formal outcome;不得通过 private map 满足实现缺口 |
| no runtime health conflation | Step 10 / Step 14 / Step 15 | runtime assembled、adapter available、published、delivered、application accepted 必须保持不同语义 |

### 3.8 本批预复核结论

| 复核项 | 结论 | 说明 |
|---|---|---|
| persistence / transaction 是否可承接 | 通过 | Step 11 已闭合 ownership、logical store、repository semantics、transaction boundary、fake/durable parity |
| error / recovery 是否可承接 | 通过 | Step 12 已闭合 taxonomy、public mapping、exception branches、recovery marker rules |
| concurrency / idempotency 是否可承接 | 通过 | Step 13 已闭合 resource、scenario、key/digest、duplicate/in-flight/reentry |
| config / external binding 是否可承接 | 通过 | Step 14 已闭合 ownership、config reference、external binding、runtime builder、validation boundary |
| observability / audit 是否可承接 | 通过 | Step 15 已闭合 log、metric、business audit/report/marker、runtime/config/adapter/fake redaction |
| 是否发现 Step 11~15 新 blocker | 未发现 | 本批未发现需要回 Step 11~15 补 schema/port/state/error/config/observability field 的缺口 |
| 是否越权定义实施计划 | 未越权 | 未定义 phase、commit boundary、BATCH、IMPL、GATE、TC、fixture、CI、evidence 或交付排期 |

### 3.9 17.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 Step 11~15 | 通过 | 持久化、错误、幂等、配置、观测均已盘点 |
| 是否关闭 DDD-S17-OPEN-002 | 已关闭 | Step 11~15 handoff 已完整承接 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只引用前序 Step 已闭合契约 |
| 是否提前定义 phase / commit boundary | 未定义 | 留给后续正式 `07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 17.3 | implementer reading matrix and citation rules |

---

## 4. 17.3 implementer reading matrix and citation rules

本批把实现者开工前需要阅读的材料、正式文档与校准文件的引用关系、冲突处理规则和后续 `07` 阅读门禁输入收稳。本批不按 phase / commit boundary 组织,因为正式 phase / commit boundary 必须由后续 `07-实施计划.md` 基于正式 `03/05/06/07` 生成。

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 17.3 implementer reading matrix and citation rules |
| 当前结论 | 已给出实现者必读材料、关注面阅读矩阵输入、引用规则、冲突处理和开工门禁问题 |
| 本批关闭事项 | DDD-S17-OPEN-003 |
| 本批边界 | 不定义正式 phase、commit boundary、BATCH、IMPL、GATE、TC、fixture、CI、evidence 或交付排期 |
| 下一批 | 17.4 `07` phase / commit-boundary audit input list |

### 4.2 Reading baseline rule

| 规则 | 正式口径 |
|---|---|
| formal docs first | Step 19 后的正式 `00/01/02/03` 和后续复核后的 `04/05/06/07` 是实现基线 |
| calibration files are trace sources | `design-calibration/` 文件用于解释正式结论来源、字段闭环、取舍和 blocker 处理,不替代正式文档 |
| cite specific files | 后续 `07` 必须引用具体校准文件,不能只写 `design-calibration/` 目录 |
| no duplicate truth | `07` 不复制 Step 6 字段表、Step 8 DTO 表、Step 9 flow、Step 10 状态矩阵或 Step 16 测试切口形成第二真相源 |
| conflict handling | 正式文档与校准文件冲突时,以正式 `00`~`07` 为准;正式文档表达不清时读对应校准文件;仍不清楚时暂停并回设计真相源 |
| no legacy reverse constraint | 旧 `03/04/05/06/07` 或旧实现口径不得反向约束新版 Step 1~16;它们只能在后续正式复核后重新成为基线 |
| implementer does second check | 实现 agent 只做开工前二次校验和执行期阻塞回报,不承担现场补 schema、port、state、boundary 或 public mapping |

### 4.3 全局必读材料

| 材料 | 读取目的 | 开工前必须能回答 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 理解 identity 的需求边界、核心闭环、非目标和验收方向 | 本次实现是否仍落在 identity-owned truth / ref-only / no-auth 边界内 |
| `projects/L1-identity/01-架构设计.md` | 理解仓边界、依赖方向、数据所有权和通信方式 | 当前实现是否没有穿透 architecture dependency direction |
| `projects/L1-identity/02-概要设计.md` | 理解主要组成部分、关键对象、接口骨架、处理流和状态轮廓 | 当前实现对象 / protocol / flow 是否能回到概要主线 |
| Step 19 后的 `projects/L1-identity/03-详细设计.md` | 作为正式详细设计入口 | 当前实现字段、DTO、状态、port、flow 是否来自正式 `03` |
| 后续复核后的 `projects/L1-identity/04-配置设计.md` | 作为 config profile、adapter binding、entry-local 参数和 secret boundary 基线 | 当前配置读取点是否归 infra / entry,且不改变业务 invariant |
| 后续复核后的 `projects/L1-identity/05-测试方案.md` | 作为正式测试用例、suite、fixture、CI 和 artifact 计划 | 当前实现门禁是否能回指正式测试方案 |
| 后续复核后的 `projects/L1-identity/06-验收标准.md` | 作为 acceptance / veto / evidence 判断口径 | 当前阶段是否具备后续验收可裁决输入 |
| 后续生成的 `projects/L1-identity/07-实施计划.md` | 作为正式 phase、commit boundary、测试门禁和提交纪律 | 当前开工是否处于已审计 boundary 内 |
| `standards/coding/rust.md` | Rust 源码、注释、rustdoc、测试命名、错误处理规范 | 代码命名、注释、测试名是否符合 Rust 规范 |
| `standards/document/子项目目录与代码文件组织规范.md` | 确认 workspace、crate、binary、scripts、reports、artifacts 目录规则 | 文件落点是否匹配正式 layout |
| `standards/document/实施计划书写规范.md` | 生成 `07` 和执行 implementation handoff 的规则 | 当前没有把详细设计表格复制成第二真相源 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、状态、phase boundary、经验复核和 blocker 暂停标准 | 发现缺口时是否暂停并回设计,而不是代码补口 |
| `projects/README.md` | design 仓 / 实现仓目录、提交语言和质量门禁 | 当前仓、提交语言和质量门禁是否正确 |

### 4.4 关注面阅读矩阵输入

> 本表不是 `07` 的阶段 / commit boundary 矩阵。后续 `07` 必须按正式 phase / commit boundary 重新转译,每行只选择当前 boundary 必需的正式章节和校准文件。

| 实现关注面 | 必读正式材料 | 必读校准文件 | 读取目的 | 开工门禁问题 |
|---|---|---|---|---|
| upstream / scope / non-goals | `00/01/02`;正式 `03` 上游与范围章节 | `03_ddd_step_01_upstream_boundary.md`;`03_ddd_step_02_scope.md` | 确认新版上游、P0 / 非范围和旧文档诊断纪律 | 能说明当前实现没有扩大 identity 范围或继承旧 `03` |
| repository / runtime / language constraints | 正式 `03` constraints / file layout;后续 `07` 前置条件 | `03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md` | 确认 Rust、git config、commit language、workspace、crate 和 sibling dependency | 能说明目标仓、crate、依赖和提交规则 |
| module ownership and dependency direction | 正式 `03` module contracts | `03_ddd_step_05_module_contracts.md` | 确认 contracts/domain/application/infra/api/worker/jobs 归属 | 能说明当前文件和 trait 属于哪个 crate,且依赖方向合法 |
| object / field / invariant implementation | 正式 `03` object contracts | `03_ddd_step_06_object_contracts.md` | 确认对象能力、字段来源、factory、policy、guard、不变量和 body-free boundary | 能说明每个字段来自 request、resolver、repository、clock/id 或 formal mapper |
| port / adapter / fake implementation | 正式 `03` trait / port contracts | `03_ddd_step_07_trait_port_adapter_contracts.md` | 确认 repository、UoW、cursor、version、subject mapper、resolver、publisher、handoff、fake parity | 能说明实现没有新增私有 port、私拼 subject 或 fake private map |
| public protocol implementation | 正式 `03` protocol contracts | `03_ddd_step_08_protocol_contracts.md` | 确认 Command、Query、Inbound/Callback、Outbound、Job DTO、metadata、receipt、report 和 public surface | 能说明 input DTO 能构造目标对象或 read surface,且不暴露 raw body |
| application flow implementation | 正式 `03` function flows | `03_ddd_step_09_function_flows.md` | 确认 accepted/rejected/duplicate/no-write/job no-repair/outbox publish/handoff flow 顺序 | 能说明当前服务的 UoW、stored replay、trace/audit/outbox/report 顺序 |
| domain state machine implementation | 正式 `03` state matrix | `03_ddd_step_10_state_matrix.md` | 确认正式状态名、合法迁移、非法转换、terminal/retryable、entry/runtime/fake parity | 能说明当前状态迁移由哪个 helper / flow 触发,并能拒绝非法转换 |
| persistence / transaction implementation | 正式 `03` persistence chapter | `03_ddd_step_11_persistence_transaction_consistency.md` | 确认 logical stores、key/index/version/UoW、stored replay、query no-write、fake/durable parity | 能说明每个 update 的 `IdentityVersion` 来源和 rollback/commit 可见性 |
| error / recovery implementation | 正式 `03` error chapter | `03_ddd_step_12_error_recovery.md` | 确认 error owner、public mapping、exception branches、recovery class 和 forbidden body 处理 | 能说明失败是否 retryable、terminal、manual、read-surface-only 或 entry-local |
| concurrency / idempotency implementation | 正式 `03` concurrency chapter | `03_ddd_step_13_concurrency_idempotency.md` | 确认 key/digest、duplicate replay、in-flight、commit unknown、terminal retry guard | 能说明 duplicate 是否 replay stored surface,且不会重跑 mutation/job |
| config / external binding implementation | 正式 `03` config binding chapter;正式 `04` | `03_ddd_step_14_config_external_binding.md`;相关 `04_config_step_*.md` | 确认 raw config owner、adapter binding、runtime builder、cross-repo dependency 和 redline validation | 能说明配置只选择 adapter/参数,不改变业务不变量 |
| observability / redaction implementation | 正式 `03` observability chapter | `03_ddd_step_15_observability_audit.md` | 确认 log/metric/audit/report/handoff cuts、low-cardinality labels、forbidden material | 能说明观测材料只含 safe refs/kinds/issues,不保存 raw body/secret |
| test / verification planning | 正式 `03` test cuts;后续正式 `05/06/07` | `03_ddd_step_16_test_cuts.md` | 确认最小验证入口和后续测试方案承接点 | 能说明当前实现至少对应哪个最小测试切口,但不在 Step 17 分配 TC |
| implementation handoff / design baseline | 正式 `03` handoff chapter;后续正式 `07` | `03_ddd_step_17_implementation_handoff.md` | 确认承接清单、阅读规则、后续 `07` 审计输入和不得实现者选边的红线 | 能说明当前 boundary 是否已由 `07` 做可落码闭环审计 |

### 4.5 Citation rules for later `07`

| 引用场景 | 正确写法 | 错误写法 |
|---|---|---|
| 引用校准来源 | 列具体文件,例如 `design-calibration/03_ddd_step_09_function_flows.md` | 只写“参考 design-calibration” |
| 一个正式章节来自多个 Step | 逐条列出每个 Step 文件和用途 | 合并成“Step 6~15”而不说明作用 |
| 需要解释详细设计取舍 | 引导读者读对应文件的结构化中间产物、回填草稿和待确认事项 | 在 `07` 复制整段对象字段表 |
| 阶段阅读门禁 | 按正式 phase / commit boundary 选择当前需要的正式章节和校准文件 | 要求实现者每个 boundary 都通读全部校准目录 |
| 发现正式文档不清楚 | 先读对应校准文件;仍不清楚则暂停并回设计真相源 | 实现者按现有代码或个人判断补 schema |
| 引用测试 / 验收 | 引用后续正式 `05/06` 的编号和 `03_ddd_step_16_test_cuts.md` 的最小切口来源 | 在 Step 17 自行创建 TC、fixture、CI、evidence |
| 引用实现顺序 | 等正式 `07` 定义 phase / commit boundary 后引用 | 在 Step 17 预写 PH / commit / BATCH |

### 4.6 Conflict handling matrix

| 冲突类型 | 处理规则 | 不允许的处理 |
|---|---|---|
| 正式 `03` 与校准文件冲突 | 以 Step 19 后正式 `03` 为准;若疑似装配遗漏,暂停并回 Step 19 / 对应校准 Step 复核 | 实现者自行选择更方便的一边 |
| 正式 `04/05/06/07` 与新版 `03` 冲突 | 先回对应下游文档复核或重写,不得反向改写新版 `03` | 用旧测试/验收/实施口径压过新版详细设计 |
| 校准文件之间冲突 | 以后序已审核 Step 的闭口结论为准;仍不清楚时回对应 Step 做 blocker closure | 把两个版本都写进实现计划 |
| design 与实现仓现状冲突 | 实现 agent 暂停并回报具体缺口;设计者判断是前置 surface repair 还是设计 blocker | 代码里临时补 port/schema/state |
| 标准与项目文档冲突 | 项目文档必须按标准回写到可落码;标准不能替代项目具体 schema | 只声明“适用标准”而不做项目级审计 |
| governance 参考与 identity 冲突 | identity Step 1~17 为真相源;governance 只作粒度参考 | 复制 governance 业务对象、payload、状态或 port 名 |

### 4.7 Implementer pre-coding checklist input

| 检查项 | 必须确认 |
|---|---|
| 正式文档基线 | Step 19 后正式 `03` 已装配,后续 `04/05/06/07` 已按新版 `03` 复核 |
| 实施计划审计 | `07` 已按正式 phase / commit boundary 做字段、DTO、状态、phase boundary、证据和命名闭环审计 |
| 具体阅读矩阵 | 当前 boundary 的 `07` 阅读矩阵列出正式章节和具体校准文件,不是全目录泛读 |
| 仓库与规范 | 目标实现仓、Rust workspace、git config、英文 commit、Rust 编码规范和目录规范已确认 |
| 设计缺口处理 | 当前 boundary 不要求实现者新增未定义 schema、port、state、error、DTO、config key 或 stored material |
| 工作区安全 | 只改当前 boundary 相关文件,不覆盖用户已有未提交改动 |
| 测试 / 验收 | 当前 boundary 的测试门禁来自正式 `05/06/07`,Step 16 只作为最小切口来源 |

### 4.8 本批预复核结论

| 复核项 | 结论 | 说明 |
|---|---|---|
| 全局必读材料是否明确 | 通过 | §4.3 列出正式文档、标准和项目规范 |
| 关注面阅读矩阵是否明确 | 通过 | §4.4 按实现关注面列出正式材料、校准文件、读取目的和门禁问题 |
| 是否提前定义正式 phase / commit boundary | 未定义 | 本批只给后续 `07` 的矩阵输入 |
| 引用规则是否明确 | 通过 | §4.5 固定 cite specific files、formal docs first、no duplicate truth |
| 冲突处理是否明确 | 通过 | §4.6 固定正式文档、校准文件、旧下游文档、实现仓现状的处理顺序 |
| 是否关闭 DDD-S17-OPEN-003 | 已关闭 | 实现者前置阅读矩阵和引用规则已写入 |

### 4.9 17.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖实施者前置阅读 | 通过 | 正式文档、校准文件、标准和项目规范均列入 |
| 是否覆盖引用和冲突规则 | 通过 | formal-first、specific citation、conflict pause 均闭合 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只写阅读 / 引用规则 |
| 是否提前定义 phase / commit boundary | 未定义 | 留给后续正式 `07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 17.4 | `07` phase / commit-boundary audit input list |

---

## 5. 17.4 `07` phase / commit-boundary audit input list

本批把后续正式 `07-实施计划.md` 必须执行的 phase / commit-boundary 审计输入收稳。它只定义审计问题、输入材料、输出形态和 blocker 处理规则,不定义任何具体 phase、commit boundary、实现批次、测试编号、fixture、CI、evidence 或交付排期。

### 5.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 17.4 `07` phase / commit-boundary audit input list |
| 当前结论 | 已给出后续 `07` 做逐 boundary 可落码闭环审计所需的输入表、复核项、经验复核和 blocker 处理规则 |
| 本批关闭事项 | DDD-S17-OPEN-004 |
| 本批边界 | 只写 `07` 审计输入;不定义正式 phase、commit boundary、BATCH、IMPL、GATE、TC、fixture、CI、evidence 或交付排期 |
| 下一批 | 17.5 cross-step closure / Step 18 handoff / 回填草稿 |

### 5.2 Audit baseline rule

正式 `07` 在移交实现前,必须按每个 phase / commit boundary 对正式 `03/05/06/07` 做整体可落码闭环审计。Step 17 只提供审计输入,不替 `07` 给出 boundary 结论。

| 规则 | 正式口径 |
|---|---|
| boundary first | `07` 必须先定义当前 boundary 的包含内容、明确排除、依赖前置和不得依赖后续 |
| formal docs first | 审计基线是 Step 19 后正式 `03`、按新版 `03` 复核后的 `05/06`、以及正在生成的正式 `07` |
| calibration as evidence | 校准文件用于证明字段、DTO、状态、flow、persistence、error、idempotency、config、observability 和 test cut 的来源 |
| no implementation guessing | 审计发现缺 schema、port、state、error、DTO、config key、stored material 或 mapper 时,必须回设计闭口 |
| no boundary borrowing | 当前 boundary 不得依赖后续 boundary 才定义或才实现的对象、结果、report、artifact 或验收材料 |
| experience review required | 每个 boundary 必须从 `设计真相源闭环与可落码性标准.md` 的历史经验项中选择适用项,给出通过 / 不适用 / blocker |
| implementation agent second-check only | 实现 agent 开工时只复核 `07` 审计结论是否仍成立,不承担现场补口 |

### 5.3 `07` boundary inventory input

后续 `07` 每个 boundary 至少需要先写出下表。Step 17 不填具体 boundary 名称,只规定 `07` 必须收集哪些维度。

| 审计输入 | `07` 必须填写 | 失败处理 |
|---|---|---|
| Boundary identity | phase / commit boundary 名称、目标和所属交付面 | 名称或目标不清时不得进入实现 |
| Included surfaces | 本 boundary 包含的 crate、module、object、protocol、flow、state、repository、adapter、job、entry 或 test gate | 包含面过大或不可验证时拆分或回写 `07` |
| Explicit exclusions | 本 boundary 明确不做的对象、flow、状态、port、adapter、fixture、CI、evidence 或验收结论 | 排除项不清会导致实现越界,必须补清 |
| Prerequisites | 依赖哪些已完成 boundary、正式文档章节、shared crate、外部配置或 fake surface | 依赖未闭合时当前 boundary 标为 blocker |
| Must not depend on later work | 明确不得调用后续才有的 DTO、port、state、stored report、artifact、evidence 或 runner | 发现后续依赖时调整 boundary 或前置修复 |
| Source citations | 正式 `03/05/06/07` 章节和具体 `design-calibration` 文件 | 不能只写目录或口头说明 |
| Gate surface | 本 boundary 的测试 / 验收门禁来自正式 `05/06/07` 的哪个位置 | 没有正式门禁时不得伪造通过条件 |

### 5.4 Field / object closure audit input

| 审计项 | `07` 必须检查 | Blocker 条件 |
|---|---|---|
| Domain required fields | 当前 boundary 涉及的必填字段是否能回指 request、event、resolver summary、repository read、Clock、IdGenerator、cursor assigner 或 formal mapper | 字段来源只靠字符串拼接、当前实现猜测或 fake private map |
| Optional fields | 语义可缺失的字段是否在 schema 层显式可选,并有正式派生 / missing surface | 设计说可缺失但 schema 必填,或实现需自行默认 |
| Factory / constructor | object factory 是否只接收正式输入,不读取 repository / config / adapter | factory 需要 application-local 或 infra-only 材料 |
| Invariant / policy | 不变量和 guard 是否来自 Step 6 / Step 10,并有 Step 9 flow 触发点 | `07` 需要新增 guard 或改状态口径 |
| Shared refs / markers | trace/audit/outbox/handoff/report subject 是否来自 formal mapper 或 typed ref | 需要拼 `ExternalSourceRef`、view id、subject key 或 marker key |

### 5.5 Protocol / flow closure audit input

| 协议 / flow 面 | `07` 必须检查 | Blocker 条件 |
|---|---|---|
| Command | request 是否能构造目标 truth、policy guard、trace/audit/outbox/stale/stored result;rejected / duplicate / conflict 是否有 public surface | accepted path 缺 stored result、cursor、subject mapper 或 same-UoW 顺序 |
| Query | request 是否能先得到 visibility subject / scope,再读 truth/view/report;missing / not-visible / degraded / stale 是否闭合 | query 需要 write / repair / rebuild / refresh 或临时拼 view ref |
| Inbound / Callback | envelope 是否能构造 typed receipt、target reference、marker trace、stored replay 和 unsupported/delayed/quarantined/noop surface | duplicate 需要重跑 payload 或 unsupported 被写成 accepted trace |
| Outbound Event | payload snapshot 是否 accepted-only,且 publisher 只读 stored outbox record | publisher 需要从 current truth 重构 payload 或私造 topic / payload marker |
| Operations Job | job request/report/stored replay 是否闭合;job 是否只能经 application facade / service | runner 需要直连 repository / adapter 反推结果,或 duplicate 重跑 job body |
| Entry layer | API / worker / jobs 是否只做 validation、mapping、dispatch 和 result mapping | entry 直接进入 repository、UoW、projection store 或 external adapter |

### 5.6 State / persistence / consistency audit input

| 审计项 | `07` 必须检查 | Blocker 条件 |
|---|---|---|
| State names | 测试、验收、public surface 和实现 helper 是否使用 Step 10 正式状态名 | 旧名、口语名或字符串状态进入 `07` |
| Legal transitions | 每个状态迁移是否有 Step 9 触发 flow 和 Step 10 合法矩阵 | flow 要求的迁移不在矩阵中,或矩阵状态无实现入口 |
| Illegal transitions | 非法迁移是否映射到正式 domain/application/public error surface | `07` 需要新增错误 variant 或自行映射 |
| Version source | save / update expected version 是否来自正式 versioned read,而不是 source version、timestamp、cursor 或 idempotency key | 更新面缺正式 read version 来源 |
| Transaction boundary | accepted side effects 是否在 same-UoW,commit 前后可见性和 rollback 口径是否与 Step 11 一致 | trace/audit/outbox/stored result 分散提交或 rollback 语义不清 |
| Stored replay | command / consumer / job duplicate 是否只返回 stored result / receipt / report | duplicate path 需要重新读 current truth 或重跑 mutation |
| Projection / reference | stable lookup、stale marker、reference bundle key/version、fake/durable parity 是否有正式 port | query 或 job 需要扫描 sibling body、拼 ref、猜 resolver |

### 5.7 Error / idempotency / config / observability audit input

| 审计项 | `07` 必须检查 | Blocker 条件 |
|---|---|---|
| Error owner | domain、application、entry、adapter error 是否各自有 owner 和 public mapping | adapter error string 直接决定 business state |
| Recovery class | retryable、terminal、manual、degraded、not visible、quarantined、delayed 是否在 Step 12 闭合 | `07` 需要现场新增 failure classification |
| Idempotency | operation context、channel、key、digest、in-flight、completed、rejected、commit unknown 是否闭合 | duplicate 依赖 unique constraint 但缺 stored surface |
| Config binding | raw config 是否只在 infra / runtime / entry 层解析,domain invariant 不受 config 改变 | config key 改变状态机、业务 guard 或 DTO schema |
| Adapter availability | assembled / disabled / unavailable / fake-success / real-success 是否区分 | disabled/fake 被当作业务成功 |
| Logs / metrics | runtime log / metric label 是否低基数、无 raw body、无 secret、无 policy material | 日志或 metric 成为业务 truth 或泄漏材料 |
| Audit / trace / handoff | business trace / audit / handoff 是否只保存 refs/kinds/issues/markers,不保存 raw external body | 需要用日志替代 trace/audit,或 trace subject 无 formal mapper |

### 5.8 Test / evidence / acceptance audit input

| 审计项 | `07` 必须检查 | Blocker 条件 |
|---|---|---|
| Step 16 coverage | 当前 boundary 是否能回指 Step 16 的最小测试切口 | `07` 找不到对应最小验证入口 |
| Formal test source | 当前 boundary 的正式测试门禁是否来自后续 `05` | Step 17 或实现者临时创建正式测试编号 |
| Formal acceptance source | 当前 boundary 的验收 / veto / evidence 口径是否来自后续 `06` | boundary 声称通过但没有正式验收裁决来源 |
| Artifact capability | 若 boundary 涉及 artifact/report,脚本能力、最小索引、最终详情页和验收交接是否分层清楚 | 一个 boundary 同时含糊要求脚本、最终证据和验收结论 |
| Failure evidence | failed / degraded / not visible / quarantined / partial report 是否也有可验证输出 | 只验证 happy path,失败面无法裁决 |

### 5.9 Naming / conflict / experience review input

| 审计项 | `07` 必须检查 | Blocker 条件 |
|---|---|---|
| Naming consistency | object、field、state、function、DTO、job、report、test、evidence 是否与正式 `03` 同名 | 旧 `03`、旧 `04/05/06/07` 或旧实现名混入 |
| Downstream drift | 现有 `04/05/06/07` 是否按新版 `03` 复核,没有反向约束当前详细设计 | 下游文档仍使用旧对象 / 旧状态 / 旧验收口径 |
| Experience applicability | 从可落码性标准历史经验中选择当前 boundary 适用项,逐项给出证据位置 | 只写“适用标准”但没有项目级证据 |
| Not applicable reason | 高风险经验项若不适用,必须说明当前 boundary 不涉及的具体原因 | 简写 N/A 或不说明 |
| Blocker handling | blocker 需记录正式缺口、影响范围、建议闭口点和修复后的 design baseline | 把“实现时确认”“先用 fake 默认值”写成通过 |

### 5.10 `07` boundary audit table template input

后续 `07` 可把每个 boundary 审计整理成下列表格。本表是模板输入,不是 identity 的正式实施计划拆分。

| 字段 | 内容要求 |
|---|---|
| Boundary | `07` 定义的 phase / commit boundary 名称 |
| Scope | 当前 boundary 包含的正式实现面 |
| Explicit exclusions | 当前 boundary 不做且不得提前依赖的面 |
| Formal citations | 正式 `03/05/06/07` 章节 |
| Calibration citations | 具体 `design-calibration/03_ddd_step_*.md` 文件 |
| Field / DTO closure | 通过 / blocker,并列证据位置 |
| Flow / state closure | 通过 / blocker,并列证据位置 |
| Persistence / replay closure | 通过 / blocker,并列证据位置 |
| Error / recovery closure | 通过 / blocker,并列证据位置 |
| Config / adapter / observability closure | 通过 / blocker / 不适用,并列证据位置 |
| Test / evidence closure | 通过 / blocker,并列正式 `05/06/07` 来源 |
| Experience review | 通过 / 不适用 / blocker,并列适用经验项 |
| Design baseline | 审计通过所依据的固定文档版本或修复后的 baseline |
| Implementation pause rule | 实现中发现不一致时暂停并回报的具体条件 |

### 5.11 Blocker report input for implementation agent

后续 `07` 应要求实现 agent 遇到设计缺口时按统一格式回报,避免把实现临时判断写成设计结论。

| 段落 | 必须包含 |
|---|---|
| Blocker | 缺失的正式 schema、port、state、error、DTO、mapper、lookup、version source、stored surface、test/evidence source 或 boundary 规则 |
| Evidence | 具体正式文档 / 校准文件 / 代码位置,以及冲突点 |
| Impact | 受阻 flow、object、repository、adapter、entry、job、test 或验收面 |
| Why not implement locally | 说明继续实现会自行补 schema、补 port、改状态、猜 mapper、拼 key、绕过 boundary 或伪造证据 |
| Suggested closure | 设计可选择的闭口方式,但不得写成实现者已经自行决定 |
| Current worktree note | 已完成但未提交内容、未触碰的用户改动、已跑或未跑的校验 |

### 5.12 本批预复核结论

| 复核项 | 结论 | 说明 |
|---|---|---|
| 是否给出 `07` boundary 审计输入 | 通过 | §5.3~§5.10 覆盖 scope、引用、字段、flow、状态、持久化、错误、幂等、配置、观测、测试、经验复核 |
| 是否提前定义正式 phase / commit boundary | 未定义 | 只给模板和审计问题,不写具体拆分 |
| 是否提前写测试编号 / fixture / CI / evidence | 未写入 | 只要求后续 `05/06/07` 提供正式来源 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只写审计输入和 blocker 规则 |
| 是否关闭 DDD-S17-OPEN-004 | 已关闭 | 后续 `07` phase / commit-boundary 审计输入已写入 |

### 5.13 17.4 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否说明 `07` 如何审计正式 `03/05/06/07` | 通过 | §5.2 和 §5.10 固定正式文档优先与 boundary audit table |
| 是否覆盖字段 / DTO / 状态 / phase boundary / 证据 / 命名 / 经验复核 | 通过 | §5.4~§5.9 已覆盖 |
| 是否把 blocker 留给实现者自行处理 | 未留给实现者 | §5.11 固定暂停和回设计闭口格式 |
| 是否定义具体 phase / commit boundary | 未定义 | 留给正式 `07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 17.5 | cross-step closure / Step 18 handoff / 回填草稿 |

---

## 6. 17.5 cross-step closure / Step 18 handoff / 回填草稿

本批收口 Step 17,确认 17.0~17.4 的承接事项已经闭合,并把仍不能写成已闭口实现契约的事项移交 Step 18。回填草稿只作为 Step 19 装配正式 `03` 第 16 章的输入,本批不修改正式 `03-详细设计.md`。

### 6.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 17.5 cross-step closure / Step 18 handoff / 回填草稿 |
| 当前结论 | Step 17 的实现承接清单、前置阅读、引用规则、`07` 审计输入和 Step 18 handoff 已收口 |
| 本批关闭事项 | DDD-S17-OPEN-005 |
| 本批边界 | 只做 Step 17 收口和正式回填草稿;不新增 schema、port、state、error、DTO、测试编号、fixture、CI、evidence、phase 或 commit boundary |
| 下一步 | Step 18 风险与待确认事项 |

### 6.2 Cross-step closure table

| 承接面 | 来源 | Step 17 收口位置 | 结论 |
|---|---|---|---|
| Step 17 framework / redlines | Step 16 handoff、实施计划规范、可落码性标准 | §1.1~§1.10 | 已闭合;Step 17 只做 handoff,不写正式实施计划 |
| Implementable contract inventory | Step 5~10 | §2.2~§2.10 | 已闭合;模块、对象、port、protocol、flow、state 均有实施计划承接输入 |
| Persistence / error / idempotency / config / observability handoff | Step 11~15 | §3.2~§3.9 | 已闭合;same-UoW、stored replay、error recovery、config boundary、observability redline 已列入承接 |
| Implementer reading / citation rules | Step 1~16、实施计划规范、可落码性标准 | §4.2~§4.9 | 已闭合;formal-first、specific citation、conflict pause 和 pre-coding checklist 已明确 |
| `07` boundary audit input | Step 1~16、实施计划规范、可落码性标准 | §5.2~§5.13 | 已闭合;字段、DTO、flow、state、persistence、error、idempotency、config、observability、test/evidence、naming、experience review 已列为审计输入 |
| Step 18 handoff | Step 17 未闭口或不能在 Step 17 写成实现契约的事项 | §6.4 | 已形成输入;由 Step 18 判断风险、待确认方和阻塞等级 |

### 6.3 Step 17 final closure checklist

| 检查项 | 结论 | 说明 |
|---|---|---|
| 实施承接清单是否明确 | 通过 | §2 和 §3 已把 Step 5~15 的实现契约转成后续 `07` 输入 |
| 实施者前置阅读是否明确 | 通过 | §4 已列全局必读材料、关注面阅读矩阵输入和引用规则 |
| `07` 审计输入是否明确 | 通过 | §5 已给出逐 boundary 审计输入和 blocker 回报格式 |
| 是否仍有 Step 17 内部 open item | 无 | DDD-S17-OPEN-001~005 均已闭合 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式 `03` 仍留 Step 19 装配 |
| 是否新增实现契约 | 未新增 | 未新增 object、field、function、port、adapter、repository、state、error、DTO、event、job、stored material、config key 或 observability field |
| 是否提前定义正式实施计划 | 未定义 | 未定义 phase、commit boundary、实现批次、测试编号、fixture、CI、evidence 或交付排期 |
| 是否可进入 Step 18 | 可以 | Step 18 只接收风险 / 待确认事项,不得反向改写 Step 17 已闭合的 handoff 结论 |

### 6.4 Step 18 handoff input

下列事项不能在 Step 17 写成“已可实现”的正式结论,需要在 Step 18 作为风险或待确认事项继续整理。Step 18 需要区分阻塞实现的设计缺口、下游文档未复核风险和正式装配门禁。

| 编号 | 事项 | 当前判断 | Step 18 需要处理 |
|---|---|---|---|
| DDD-S18-HANDOFF-001 | 正式 `03-详细设计.md` 尚未由 Step 19 装配 | 当前中间产物不是正式实现基线 | Step 18 记录为正式装配前置风险;Step 19 装配后才能成为正式 `03` |
| DDD-S18-HANDOFF-002 | 现有 `04/05/06/07` 需要按新版 `03` 复核 | 下游文档不能反向约束新版详细设计 | Step 18 标记下游复核风险;后续配置、测试、验收、实施计划 SOP 逐一处理 |
| DDD-S18-HANDOFF-003 | 正式 `07` 必须做逐 boundary 可落码审计 | Step 17 只给审计输入,不替 `07` 定义 boundary 结论 | Step 18 保留为实现移交前门禁,防止直接交给实现 agent |
| DDD-S18-HANDOFF-004 | 正式测试编号、fixture、CI、evidence 和验收裁决未在 Step 17 定义 | 这些属于 `05/06/07`,不是详细设计承接清单职责 | Step 18 标记为下游验证文档风险,不得由 Step 17 或实现者临时生成 |
| DDD-S18-HANDOFF-005 | 旧 `03/04/05/06/07` 和旧实现口径可能残留旧名 | 旧材料只能诊断,不得进入新版实现基线 | Step 18 输出命名漂移风险和后续装配 / 复核门禁 |

### 6.5 Formal `03` 回填草稿

> 校准来源:
> - `projects/L1-identity/design-calibration/03_ddd_step_17_implementation_handoff.md`

#### 16. 详细设计到实施计划的承接清单

本详细设计向实施计划交付的是可实现契约的承接清单,不是实施计划本身。后续 `07-实施计划.md` 必须以正式 `03-详细设计.md` 为直接输入,并按 phase / commit boundary 引用具体正式章节和对应 `design-calibration/03_ddd_step_*.md` 文件,不得复制对象字段表、协议表、函数 flow、状态矩阵或测试切口形成第二真相源。

实施计划可以承接的详细设计输入包括:

- Step 5~10 已闭合的模块、对象、trait / port / adapter、protocol、function flow 和 state matrix。
- Step 11~15 已闭合的持久化、事务、一致性、错误恢复、并发、幂等、配置绑定、外部依赖、可观测性和审计规则。
- Step 16 给出的最小测试切口,作为后续正式测试方案和实施门禁的输入,但不替代正式测试方案。
- Step 17 给出的实现者前置阅读矩阵、引用规则、冲突处理规则和 `07` boundary 审计输入。

实现者开始编码前必须完成以下前置检查:

- 确认正式 `00/01/02/03` 已稳定,且 `04/05/06/07` 已按新版 `03` 复核或重写。
- 阅读当前 boundary 相关的正式章节和具体 `design-calibration` 文件,而不是泛读目录或只依赖旧实现仓现状。
- 确认字段来源、DTO 构造、状态迁移、repository / port surface、stored replay、idempotency、config binding、observability redaction 和测试 / 验收门禁均有正式来源。
- 确认当前 boundary 不依赖后续才实现的 DTO、port、state、result、report、artifact、evidence 或 runner。
- 发现缺 schema、port、state、error、DTO、mapper、lookup、version source、stored surface、test/evidence source 或 boundary 规则时,必须暂停并回报设计缺口,不得在代码中临时补口。

正式 `07` 在移交实现前必须按每个 phase / commit boundary 对正式 `03/05/06/07` 做整体可落码闭环审计。审计至少覆盖字段 / 对象闭环、protocol / flow 闭环、state / persistence / consistency 闭环、error / idempotency / config / observability 闭环、test / evidence / acceptance 闭环、命名一致性和历史经验适用性。审计结论必须是通过 / 不适用 / blocker,blocker 必须先回写设计真相源并固定新的 design baseline。

### 6.6 Step 17 final stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 17 是否完成 | 完成 | 17.0~17.5 均已写入 |
| 是否关闭 DDD-S17-OPEN-005 | 已关闭 | Step 18 handoff 和正式回填草稿已写入 |
| 是否保留未闭口事项给 Step 18 | 已保留 | §6.4 只列风险 / 待确认输入,未写成实现契约 |
| 是否可进入 Step 18 | 可以 | Step 18 继续整理风险与待确认事项 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |

---

## 7. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S17-OPEN-001 | 实现契约 inventory 是否完整覆盖 Step 5~10 | 17.1 | 已闭合 |
| DDD-S17-OPEN-002 | persistence / error / idempotency / config / observability 是否完整承接 Step 11~15 | 17.2 | 已闭合 |
| DDD-S17-OPEN-003 | 实现者前置阅读矩阵和引用规则是否明确 | 17.3 | 已闭合 |
| DDD-S17-OPEN-004 | 后续 `07` phase / commit-boundary 审计输入是否足够 | 17.4 | 已闭合 |
| DDD-S17-OPEN-005 | Step 18 handoff 和正式回填草稿是否闭合 | 17.5 | 已闭合 |

---

## 8. 进入下一步条件

进入 Step 18 前必须满足:

- 用户审核通过 Step 17.5。
- Step 18 只整理风险与待确认事项,不得把待确认内容写成已闭口实现契约。
- Step 18 必须承接 §6.4 的 handoff input,并判断每项是阻塞、非阻塞风险还是下游文档复核门禁。
- Step 18 不直接修改正式 `03-详细设计.md`;正式装配仍留 Step 19。
