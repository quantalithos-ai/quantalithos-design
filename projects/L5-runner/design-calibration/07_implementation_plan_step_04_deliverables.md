# Step 4. 抽取实施对象与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 书写规范：`standards/document/实施计划书写规范.md` §5.4
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §4 实施对象与交付物清单
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 4` |
| `current_module` | `implementation_objects_and_deliverables` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_05` |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `commit_required` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_05_phases_dependencies.md`；完成后停审 |

本文件只抽取未来实现计划的逻辑实施对象和可判定交付物。目标实现仓、语言/runtime、物理目录、脚本实例、测试执行、artifact/report/evidence、baseline、commit、verdict、signoff 和 readiness 当前均不存在或未获授权；表中的“预计落点”因此只使用逻辑模块、边界或计划根，不表示物理文件已创建。

## 2. 本步输入、输出与非目标

### 2.1 本步输入

| 输入 | 本步承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | P0 实施分母、P1/P2 后置项、非范围与防误入规则 | 不新增需求或改变优先级 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 全局/阶段阅读清单、实现仓与技术门禁、脚本/证据路径合同、台账时序 | 不把条件性规范变成已选技术 |
| `03-详细设计.md` §4～§16 | 七逻辑模块、对象/port、11 Command、12 Query、4 Consumer、0 event、5 Job、32 flow、21 状态、UoW/错误/幂等/观测和 test-cut | 不补 exact SDK、物理 layout、store backend 或 owner schema |
| `04-配置设计.md` §3～§13 | 七配置域、41 项、四 profile、strict source、builder/readiness、failure/rollback 和下游承接 | 不把 profile、示例值或 marker 当环境/readiness |
| `05-测试方案.md` §3～§14 | 18 CUT、108 planned TC、12 suite、18 evidence slot、固定 raw/report/check 路径、回归和结果分类 | planned 不等 executed/pass/evidence |
| `06-验收标准.md` §3～§14 | 11 AC、AR/TX/NFA/VETO、fixed-run、entry/exit、evidence/handoff 和裁决边界 | 不填写实际 verdict/signoff/readiness |
| 专项上游当前正式文档与必要台账 | Runner-facing seam、依赖类型和 blocker | 未闭合处只形成 adapter slot/blocked lane，不猜 DTO/API |

### 2.2 本步输出

- 面向未来实现者的逻辑实施对象清单；
- 代码、协议/adapter、配置、测试数据、脚本、artifact/report/evidence 和 handoff 的可判定计划交付物；
- 跨仓依赖交付形态及其 owner 边界；
- 非交付物与明确的 `planned / blocked / waiting / not_created` 状态；
- 可回填正式 `07` §4 的草稿和进入 Step 5 的门禁。

### 2.3 非目标

- 不按对象索引机械生成一份源码文件清单；
- 不决定 Rust/Tauri/Docker/gVisor/Firecracker、GUI/CLI、进程模型、package/crate/binary 或数据库/cache backend；
- 不创建 `/home/aris/Projects/quantalithos-runner`、代码、配置实例、测试脚本、fixture、artifact、report、evidence、implementation ledger 或 boundary skeleton；
- 不将 Consumer positive path、真实 owner/platform integration、生产 SLO/capacity/retention 或外围 `FR-RUN-014~016` 放入当前 P0 交付分母；
- 不把“未来完成判定”写成已编译、已测试、已验收或 ready 的事实。

## 3. SOP 问题回答

### 3.1 本轮会新增或修改哪些代码模块？

未来目标实现仓应按 03 已收稳的逻辑边界承接七类模块：`contracts`、`domain`、`application`、`infra`、`entry`、`worker`、`operations`。这些名称是逻辑职责标签，不是已批准的 crate/package、进程或文件路径。

| 逻辑模块 | 计划实施责任 | 明确禁止 | 当前落点状态 |
|---|---|---|---|
| `contracts` | typed ref/state/reason、metadata、Command/Query/Consumer/Job envelope、view/page/receipt、safe issue | owner 正文、secret、Release/Approval/Sandbox/Runtime/Evidence truth | `planned / physical_blocked` |
| `domain` | Runner-local selection、acquisition/integrity/cache posture、intent/control、guard/recovery、bounded presentation 与纯 transition | 读取 store/SDK/OS、外部 I/O、owner truth 裁决 | `planned / physical_blocked` |
| `application` | use-case 编排、validation、canonical digest、idempotency、UoW、external effect 顺序和 recovery mapping | 依赖具体 infra、UI 直接改 truth、把 ACK/PID/port 升级业务状态 | `planned / physical_blocked` |
| `infra` | semantic port 的 repository/cache、SDK/API/platform/redaction/diagnostic/handoff adapter、builder/readiness marker | 私有 owner 实现、直连 DB/bus/topic、fake 冒充 product | `planned / seam_blocked` |
| `entry` | command/query dispatch、actor/scope/metadata/body 校验、presentation mapping | 直连 repository/store/adapter/domain transition | `planned / physical_blocked` |
| `worker` | 4 个 planned Consumer 的 header-first readiness、receipt/disposition、严格 duplicate surface | payload parse/hash/store、owner cursor、ACK、outbound event | `planned / positive_blocked` |
| `operations` | 5 个 Job 的 claim/checkpoint/report、refresh/reconcile、generation guard | owner repair、Unknown replay/resend/reclaim、Query 隐式 refresh | `planned / physical_blocked` |

模块依赖只保留逻辑方向 `contracts → domain → application → infra`，`entry/worker/operations` 通过 application facade/dispatch surface 接入；这不授权任何物理 workspace 结构。

### 3.2 本轮会新增或修改哪些接口、事件、Job 或 adapter？

| surface | 设计分母 | 本轮交付口径 | 当前边界 |
|---|---:|---|---|
| Command | 11 | exact selector、trusted metadata、typed input/result/error、reservation/UoW/duplicate surface 和外部 effect/recovery mapping | 正向 owner seam 未闭合时仅能交付 semantic/negative lane |
| Query | 12 | committed safe view/page、`RunnerViewSurface`、visibility/freshness/degraded/source attribution；证明 no-write | 不隐式 refresh、probe、cleanup、reconcile、Job 或 reservation |
| planned Consumer | 4 | header-first `Blocked`/`UnsupportedVersion`/`Rejected`/`Quarantined`，或严格 stored `Duplicate` receipt | positive `Accepted/GapDetected/Delayed` 保留形状但 `blocked/reserved` |
| outbound event | 0 | 不交付 publisher、outbox、topic 或 Runner-owned event | 任意 event residue 为架构/验收阻断 |
| Operations Job | 5 | exact input/basis、claim、checkpoint、terminal report、partial/blocked/unknown 分类 | 不把 Job report 升级 owner outcome/evidence/verdict |
| semantic port / adapter | 14 required semantic ports + local repositories/UoW | 只实现已闭合 public seam 的 typed mapping、availability/readiness 和 fail-closed outcome | exact SDK/API/transport、lease、store backend 仍 pending/blocker |

### 3.3 本轮会新增哪些测试、配置、数据和文档同步？

- 测试：把 18 CUT、108 planned TC、12 suite、18 slot 映射到模块、protocol、state、config、redaction、dependency、artifact/report checks；只交付可执行计划和未来 harness 形状，不产生执行结果。
- 配置：承接七顶层域、41 项、四 profile 和 strict whole-document/builder/readiness/failure/rollback 合同；不创建真实配置文件、secret、endpoint 或 production 数值。
- 数据：规划 deterministic actor/scope/ref、clock/id/digest、fault、redaction corpus、consumer header、claim/checkpoint、same-run evidence fixtures；fixture 不得含真实 secret/body，且只允许 `test-deterministic`。
- 脚本与报告：规划 `scripts/gates/`、`scripts/checks/`、`scripts/reports/` 及固定 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/` 的生成/检查责任；所有命令未来必须显式 `--run-id`/root/profile，禁止 `latest`。
- 文档/台账同步：Step 13 才装配正式 `07-实施计划.md`、`implementation_execution_ledger.md` 和 planned boundary skeleton；本步只记录其未来责任，不提前创建。

### 3.4 哪些上游设计对象本轮不交付？

不交付 Release/Artifact、Governance approval、Project/Work、Sandbox execution/isolation/lease、Runtime execution/result、Observability formal audit/evidence/report、Archive bundle/restore、平台资源 owner truth 或其内部数据库/bus/topic/私有实现。Runner 只交付相应安全 ref/projection/observation/adapter boundary；任何 owner truth 变化必须由 owner 正式接口提供。

### 3.5 哪些交付物跨仓或依赖外部模块？

跨仓交付物只包括 public SDK/API/adapter seam 的读取、映射、availability、错误/脱敏/trace 约束和 blocked/unknown 处理。不会复制 sibling 源码，不会把运行期或事件协作写成 path dependency，不会在本仓替外部 owner 建造实现。详细依赖表见第 7 节。

## 4. 当前文档问题诊断

| 问题 | 对实施的影响 | 本步处理 |
|---|---|---|
| 03 有大量对象、port、flow 和状态 | 若逐对象列任务，会退化为不可验证的文件清单 | 按七模块、协议族、横切保证和证据责任聚合 |
| 03 §4 的 physical layout 仍 blocked | 直接写 `src/`、crate、binary 会伪造技术选择 | 只给逻辑落点；物理路径留给 `RUN-DDD-001~003` gate |
| 上游正向 seam 未闭合 | 真实 adapter/positive integration 无法判定 | 交付 typed slot、negative/blocked posture 和重开条件 |
| 05/06 的 planned TC/slot 容易被误读成实例 | 会把计划写成执行或 evidence | 每项同时标注 planned/not_created；未来判定只要求可追溯生成 |
| 04 的 profile 和示例数字容易成为默认值 | 会污染产品 readiness 和 NFR | 明确四 profile 是语义姿态；示例 `1` 仅类型 fixture，不是默认/阈值 |
| 0 outbound event、Query no-write、Consumer no-ACK 红线容易被遗漏 | 可能产生隐式 side effect 或 VETO | 将其作为独立交付物/非交付物和完成判定 |
| implementation ledger 尚未建立 | 无法在当前 Step 伪造 boundary 状态 | 记录 Step 13 创建时序，不提前写实例 |

## 5. 改动前后对比

| 项 | 改动前 | Step 4 收口后 | 原因 |
|---|---|---|---|
| 实施对象 | 分散在 03 的模块、对象和协议索引 | 七逻辑模块 + 协议/adapter + 横切交付面 | 支撑 Step 5 按可验证增量排阶段 |
| 代码落点 | 物理目录未获 authority | 仅保留逻辑模块/计划根，物理路径 `blocked` | 防止从 README/旧技术选择反推实现仓 |
| 测试与证据 | 05/06 分散描述 | 18 CUT/108 TC/12 suite/18 slot 与固定路径成为计划交付面 | 让每个阶段可嵌入测试和 evidence gate |
| 配置 | 41 项与四 profile 可能被当作运行实例 | 配置 schema/builder/readiness 作为逻辑交付，实例未创建 | 分离 configured/enabled/ready |
| 跨仓依赖 | 容易把 sibling 私有实现列为代码交付 | 只列 public seam、typed adapter、blocked/unknown 和 owner handoff | 保持 SDK-first 与 truth ownership |
| 非交付物 | owner truth、event、job、真实结果可能遗漏 | 明确 0 outbound event、Consumer positive、owner 内部 truth、真实 verdict 等排除 | 防止 P1/P2 污染 P0 |

## 6. 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 按每个对象/文件列交付物 | 看似详尽 | 无法表达依赖、横切门禁和证据责任；物理 layout 尚未授权 | 不采用 |
| 按七模块列交付物，忽略 protocol/证据 | 简短 | 会遗漏 11/12/4/0/5、配置、脚本和验收闭环 | 不采用 |
| 按逻辑模块 + protocol/adapter + config/test/evidence 聚合 | 可追溯且可由 Step 5/6 排序 | 仍需后续补 boundary 和物理落点 | 采用 |
| 现在固定 Rust/Tauri/Docker 或仓内路径 | 命令具体 | 继承历史材料，违反 `RUN-DDD-002` 和用户技术重核要求 | 不采用 |
| 把真实上游 positive integration 作为 P0 交付 | 产品感强 | `RUN-UP-001~008` 和 `RUN-OPS-002` 使其不可执行，容易伪造 | 不采用 |
| P0 semantic/negative + conditional adapter slot | 可先验证安全语义并保留真实接缝 | 不能声称产品 ready，阶段中会有 blocked | 采用 |
| 将 implementation ledger/boundary skeleton 现在创建 | 恢复方便 | Step 5/6 尚未定 boundary，容易伪造或返工 | 不采用；Step 13 才创建 |

## 7. 结构化中间产物

### 7.1 实施对象总表

实施对象不是 03 中所有对象的机械副本，而是能够在未来 phase/boundary 中形成可验证增量的逻辑交付面。下表的“完成判定”描述未来实现移交后的判定方式；当前所有对象均为 `planned`，不表示实现仓中已有对应代码。

| 对象族 | 正式对象/载体 | 计划实施责任 | 主要来源 | 当前状态 |
|---|---|---|---|---|
| 语境与选择 | `RunnerContextRef`、`SelectionGeneration`、`ReleaseSelection` | 建立 trusted actor/session/scope/platform 语境、exact immutable Release/version 选择、generation 和失效姿态 | `03` §6～§9；`AC-RUN-001~002` | `planned / physical_blocked` |
| 材料与完整性 | `AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture` | transfer、quarantine、verification、qualification、cache protection 轴分离 | `03` §6～§9；`AC-RUN-003~004` | `planned / upstream_blocked` |
| 运行意图与控制 | `RunIntent`、`ControlIntent`、`OwnerRunProjection` | qualified binding、Sandbox request、control result 与 owner execution projection 分轴 | `03` §6～§10；`AC-RUN-005~006` | `planned / upstream_blocked` |
| 资源、保护与恢复 | `ResourceObservation`、`ProtectionGuard`、`RecoveryCase` | local probe、allocation/lease 观察、cleanup guard、Unknown freeze 和 manual review | `03` §6、§9～§12；`AC-RUN-007~009` | `planned / platform_blocked` |
| 预览、诊断与交接 | `OutputPreview`、`FailureDiagnosis`、`HandoffPosture` | bounded safe material、freshness/visibility、redaction、handoff receipt | `03` §6、§8、§14；`AC-RUN-010` | `planned / observability_blocked` |
| 读取出口 | `RunnerReadModel`、`RunnerReadSection`、`ConnectivityView` | 12 Query 的 committed safe sections、分页/可见性/降级和 no-write 组合 | `03` §6～§9；`AR-RUN-005/014/015` | `planned / store_blocked` |
| 应用技术载体 | `RunnerApplicationFacade`、`RunnerOperationContext`、`RunnerIdempotencyRecord`、`StoredRunnerOperationResult`、`RunnerReadVisibilityDecision`、`RunnerJobReportAssembly` | 编排、reservation、stored result、visibility decision、Job report 组装 | `03` §6～§13 | `planned / store_blocked` |
| 入口与协议技术载体 | `RunnerCommandEntry`、`RunnerQueryEntry`、`RunnerHandlerResult`、`RunnerInboundConsumerEntry`、`RunnerConsumerItemResult`、`RunnerConsumerLoop` | trusted envelope 校验、dispatch、header-first disposition 和 presentation mapping | `03` §6～§9；`AR-RUN-005/006` | `planned / transport_blocked` |
| Job 技术载体 | `RunnerOperationsJobEntry`、`RunnerJobClaim`、`RunnerJobCheckpoint`、`RunnerOperationsJobResult` | claim/checkpoint/report、generation guard、terminal disposition | `03` §6～§9、§12 | `planned / scheduler_blocked` |
| 基础端口与仓储 | 14 required semantic ports、local repositories、`RunnerUnitOfWork`、idempotency/result/receipt stores | 为 application 提供 semantic interface；实现层只负责 adapter/存储保证 | `03` §6～§7、§10～§13 | `planned / exact_seam_blocked` |
| 配置与装配 | 七配置域、41 项、四 profile、validated snapshot、builder/readiness markers | strict source、cross-field validation、configured/enabled/ready 分离、fail-fast/fail-closed | `04` §3～§12 | `planned / authority_blocked` |
| 测试与证据生产 | 18 CUT、108 TC、12 suite、18 evidence slot、四项完整性检查 | 由实现对象生成可追溯 raw/report/check 计划，保持 same-run pairing | `05` §3～§14；`06` §10～§12 | `planned / execution_blocked` |

### 7.2 代码与协议交付面

| 交付物 ID | 类型 | 逻辑落点（planned） | 来源追溯 | 未来完成判定 | 当前状态 |
|---|---|---|---|---|---|
| `DEL-RUN-CODE-001` | code | `contracts` 逻辑模块 | `03` §5～§8、Step 6/8 | 17 个正式对象所需 typed ref/state/reason、metadata、view/page/receipt/error 与 11/12/4/5 envelope 能由唯一正式契约构造；不得出现 owner body/secret 或隐式 selector | `planned / physical_blocked` |
| `DEL-RUN-CODE-002` | code | `domain` 逻辑模块 | `03` §5～§6、§9～§12 | 选择、取得、完整性、cache、intent、control、guard、recovery、presentation 的合法/非法 transition、binding/generation 和 fail-closed 不变量可验证 | `planned / physical_blocked` |
| `DEL-RUN-CODE-003` | code | `application` 逻辑模块 | `03` §5、§8、§10～§13 | 所有 mutation 按 validate→digest→reserve→versioned load→domain→external effect→local commit→stored result 顺序；Query no-write；Unknown 进入 RecoveryCase | `planned / store_blocked` |
| `DEL-RUN-CODE-004` | code/adapter | `infra` 逻辑模块 | `03` §5、§7、§13～§15；`04` §9～§11 | semantic port 的 repository/cache/SDK/API/platform/redaction/diagnostic/handoff adapter 只暴露 typed outcome 和 availability；无 private implementation/direct DB/bus/topic | `planned / seam_blocked` |
| `DEL-RUN-CODE-005` | code | `entry` 逻辑模块 | `03` §5、§7～§9；CUT-09/10/13 | command/query route 与 body/name/actor/scope/metadata mismatch 可拒绝；presenter 只显示 committed safe sections，不直接写 store | `planned / transport_blocked` |
| `DEL-RUN-CODE-006` | code | `worker` 逻辑模块 | `03` §5、§7～§9；CUT-14 | 4 个 Consumer 仅完成 header-first negative/strict duplicate；不 parse payload、不 hash/store、不 ACK、不写 owner cursor | `planned / positive_blocked` |
| `DEL-RUN-CODE-007` | code | `operations` 逻辑模块 | `03` §5、§7～§9、§12；CUT-15 | 5 个 Job 的 claim/checkpoint/report、generation guard、blocked/partial/failed/unknown terminal 映射可审计；不 repair owner、不 replay/reclaim | `planned / scheduler_blocked` |
| `DEL-RUN-PROTOCOL-001` | contract/test | 11 Command | `03` §7、Step 8/9；`AC-RUN-001~011` | 每个 Command 有 exact request/result/error、idempotency key/digest、binding/version 和 external unknown mapping；完整分母保持 11/11 | `planned / external_blocked` |
| `DEL-RUN-PROTOCOL-002` | contract/test | 12 Query | `03` §7～§9；CUT-09 | 每个 Query 返回 safe surface/page/section，明确 empty/not-visible/stale/degraded/failed；reservation、refresh、repair、cleanup、Job dispatch 均为 0 | `planned / store_blocked` |
| `DEL-RUN-PROTOCOL-003` | contract/test | 4 planned Consumer | `03` §7～§9；CUT-14/18 | header/schema/version/duplicate disposition 可验证；positive shape 仍标 `reserved/blocked`，不产生 ACK 或 owner mutation | `planned / event_blocked` |
| `DEL-RUN-PROTOCOL-004` | negative contract | outbound event | `03` §7；`AR-RUN-008`、`VETO-RUN-005` | call graph/static scan 证明 Runner-owned event/outbox/publisher/topic 数量为 0 | `planned / scan_not_created` |
| `DEL-RUN-PROTOCOL-005` | contract/test | 5 Operations Job | `03` §7～§9、§12；CUT-15 | 每个 Job 有 claim/checkpoint/report、duplicate/unknown/partial 语义，且 report 不成为 owner result/evidence/verdict | `planned / scheduler_blocked` |

### 7.3 配置、环境与装配交付面

| 交付物 ID | 类型 | 计划内容 | 来源 | 未来完成判定 | 当前状态 |
|---|---|---|---|---|---|
| `DEL-RUN-CONFIG-001` | config/code | 七顶层域 `runtime/stores/bindings/limits/observability/determinism/features` 的 strict whole-document parser/validator | `04` §3～§9 | 41 项配置逐项有 source/type/requiredness/failure mapping；unknown/duplicate/comment/trailing/invalid 整份拒绝，无 silent fallback | `planned / repo_blocked` |
| `DEL-RUN-CONFIG-002` | config/test | 四 profile：`local-safe`、`test-deterministic`、`integration-pending`、`product-pending` | `04` §6；`05` §8 | profile 显式且不可互换；fake/fixture 只允许测试；profile 名称不产生 readiness | `planned / authority_blocked` |
| `DEL-RUN-CONFIG-003` | code/config | validated immutable snapshot、builder、per-slot availability/readiness markers | `04` §9；CUT-16；`AC-RUN-002/004/011` | required local guarantees 缺失时不暴露 unsafe facade；configured/enabled/ready 分离；slot 可 Blocked/Unsupported/Unavailable/Unknown | `planned / store_seam_blocked` |
| `DEL-RUN-CONFIG-004` | config/test | failure/change/rollback/drift posture | `04` §10～§13；`VETO-RUN-009` | whole-document/new assembly、strict revalidation、no hot patch/LKG/latest；rollback target 仍需重新验证 | `planned / authority_blocked` |
| `DEL-RUN-CONFIG-005` | test data | deterministic clock/id/digest、fixture/ref、fault/profile matrix | `04` §6～§9；`05` §7～§8 | test-only fake isolation、same-run identity 和 fault cleanup 可验证；不产生 product fallback 或真实 secret | `planned / harness_not_created` |

### 7.4 测试、脚本、artifact/report/evidence 交付面

| 交付物 ID | 类型 | 计划落点（合同） | 来源 | 未来完成判定 | 当前状态 |
|---|---|---|---|---|---|
| `DEL-RUN-TEST-001` | test | future target repo test surfaces | `05` §3～§6、CUT-01～CUT-18 | 18 CUT 与 108 TC 保持完整分母；每个 TC 可回指对象/状态/错误/数据/suite/slot；当前不执行 | `planned / test_repo_blocked` |
| `DEL-RUN-TEST-002` | test/tooling | 12 planned suites | `05` §9 | `S-RUN-CONTRACT/DOMAIN/SERVICE/UOW/CONTROLLED/ENTRY/CONSUMER/JOB/CONFIG/SECURITY/REPLAY/E2E` 的触发、结果分类和 blocked/not_run 语义可执行；E2E 仍 future blocked | `planned / harness_blocked` |
| `DEL-RUN-TEST-003` | test data | isolated fixture/fault/redaction corpus | `05` §7～§8、§10 | dataset/ref、clock/id/digest、fault、cleanup 和 forbidden-field canary 可按 fixed run 构造；不含真实 secret/body/path | `planned / fixture_blocked` |
| `DEL-RUN-GATE-001` | script/check | `scripts/gates/` planned root | `05` §9；`06` §4、§11 | gate 输入显式 `--run-id`、artifact root、profile；PR/main/nightly/controlled/staging/release 失败/blocked/not_run 分离，不把 retry/fake 变 pass | `planned / script_root_not_created` |
| `DEL-RUN-CHECK-001` | script/check | `scripts/checks/` planned root | `05` §9、§13；`06` §10～§11 | redaction、dependency-boundary、evidence-links、report-pairing、no-static 检查有机器可读结果；unavailable 不计 clean | `planned / script_root_not_created` |
| `DEL-RUN-REPORT-001` | script/report | `scripts/reports/` planned root | `05` §13；`06` §10 | suite/run/evidence 报告只能从同一 fixed-run raw artifact/report/check 生成；不写 verdict/signoff/readiness | `planned / script_root_not_created` |
| `DEL-RUN-EVIDENCE-001` | artifact/report contract | `artifacts/test/<run_id>/` 与 `reports/runs/<run_id>/` | `05` §13；`06` §3、§10 | raw/report/check pairing、TC→suite→artifact→report→slot/AC 链可验证；实例须绑定真实 run/digest，当前实例为 0 | `planned / execution_blocked` |
| `DEL-RUN-HANDOFF-001` | report/handoff | `reports/acceptance/`、`reports/review/` planned roots | `06` §10、§14 | handoff/veto/risk/open-issues/review 草稿能列范围、未执行项和 blocker；不产生实际 verdict、risk acceptance 或 signoff | `planned / baseline_blocked` |

### 7.5 文档、台账与交付纪律面

| 交付物 ID | 类型 | 计划内容 | 来源 | 未来完成判定 | 当前状态 |
|---|---|---|---|---|---|
| `DEL-RUN-DOC-001` | doc | 正式 `07-实施计划.md` §4 对象与交付物章节 | Step 13 装配规范 | 正式章节逐项回指本 Step、03/04/05/06；不新增对象或事实 | `deferred_until_step_13` |
| `DEL-RUN-LEDGER-001` | ledger | `design-calibration/implementation_execution_ledger.md` | 代码实施台账规范、07 flow §4 | 仅 Step 13 创建；包含 planned boundary、gate、blocker 和恢复入口，不填写实现 commit/run/evidence | `deferred_until_step_13` |
| `DEL-RUN-BOUNDARY-001` | ledger skeleton | `design-calibration/implementation-boundaries/<boundary_id>.md` | 代码实施台账规范、未来 Step 5/6 Boundary Gate Matrix | 仅 Step 13 按最终矩阵一次性创建；全部保持 `planned/blocked/waiting` | `deferred_until_step_13` |
| `DEL-RUN-HANDOFF-002` | handoff/doc | future implementation handoff package | `03` §16、`05` §12～§14、`06` §10～§14 | 只有 baseline、required reads、scope、gate、真实 run/report/review 状态均可定位时才允许移交；当前不满足 | `blocked / not_ready` |

### 7.6 交付物与需求/验收/测试的聚合追溯

下表用聚合族而非复制 108 行 TC，避免在 07 形成第二份测试真相源。正式 TC、slot 和 AC 的逐条字段仍以 05/06 为准。

| 交付聚合族 | 需求/验收分母 | 主要 CUT/slot/suite | 关键完成边界 |
|---|---|---|---|
| context/selection | `CP-RUN-01`、`FR-RUN-001~002`、`AC-RUN-001~002`、`VETO-RUN-001` | CUT-01/10/13；`ESLOT-RUN-001`、`010`、`013`；CONTRACT/DOMAIN/SERVICE/ENTRY/CONFIG | exact immutable refs、authority posture、scope/generation、禁止 latest/default；不拥有 approval |
| material/integrity/cache | `CP-RUN-02`、`FR-RUN-003~004`、`AC-RUN-003~004`、`VETO-RUN-002` | CUT-02/06/15/16；`ESLOT-RUN-002`、`015`、`016`；DOMAIN/SERVICE/CONTROLLED/JOB/CONFIG | transfer/verify/qualify/cache/protection 分轴；坏材料不可进入 run |
| request/control/owner projection | `CP-RUN-03`、`FR-RUN-005~007`、`AC-RUN-005~006`、`AR-RUN-003/013` | CUT-03/04/05/09/11/12；`ESLOT-RUN-003~005`、`009`、`011`、`012`；SERVICE/UOW/CONTROLLED/REPLAY | Accepted≠Running；receipt/ACK/PID/port 不升级 owner execution；owner ref/source/freshness 完整 |
| resource/cleanup/recovery | `CP-RUN-04`、`FR-RUN-008~010`、`AC-RUN-007~009`、`VETO-RUN-006/007` | CUT-06/07/12/15/18；`ESLOT-RUN-006/007/011/012/015/018`；DOMAIN/SERVICE/UOW/JOB/REPLAY | probe≠allocation；guard fail-closed；Unknown freeze + RecoveryCase；无 replay/resend/reclaim/resume/delete |
| preview/diagnosis/handoff | `CP-RUN-05`、`FR-RUN-011~013`、`AC-RUN-010`、`AR-RUN-002/015` | CUT-08/09/17；`ESLOT-RUN-008/009/017`；DOMAIN/SERVICE/SECURITY/REPLAY | bounded/redacted、visibility/freshness 保真；receipt/local report 不等 evidence/verdict |
| protocol/architecture/config boundary | `AC-RUN-011`、`AR-RUN-001~015`、`TX-RUN-*`、`NFA-RUN-001~007`、`VETO-RUN-003~012` | CUT-10/13/14/16/17/18；`ESLOT-RUN-010/013/014/016/017/018`；CONTRACT/ENTRY/CONSUMER/CONFIG/SECURITY | SDK/API/public adapter only；Query no-write、Consumer no-payload/no-ACK、Job no-owner-repair、event=0、redaction/link/pairing clean |

### 7.7 跨仓 / 外部依赖交付物表

| 依赖方 | 依赖类型 | Runner 计划交付内容 | Runner 不交付内容 | 当前状态/开工条件 |
|---|---|---|---|---|
| `L0-sdk` | compile/runtime adapter candidate（exact 类型待核验） | 通过正式 SDK/API 的 typed read/request/error/redaction/trace seam；availability marker 和 blocked mapping | SDK 私有实现、未核验 package/version、绕过 SDK 的 transport/DB | `RUN-UP-008 / pending`；exact surface 到达后重开受影响 boundary |
| `L1-artifact` | runtime/ref | explicit Release/version、locator/manifest/digest/signature/freshness 的正式安全结果消费 | Release/Artifact 正文、下载后端、修改内容、integrity policy owner | `RUN-UP-001 / blocked`；public consumption contract 闭合 |
| `L1-governance` | runtime/ref | approved/baselined/revoked/expired/conflict posture 的只读消费 | 本地 approval、baseline、decision 或 governance policy truth | `RUN-UP-002 / blocked`；authority chain 闭合 |
| `L1-work` | runtime/ref | project/work scope 的 safe context/ref（若正式 seam 需要） | 项目状态、Work truth、scope 自行推导 | seam pending；只允许 blocked/unknown |
| `L1-workspace` | runtime/ref | platform/workspace context 的安全引用或能力结果（若正式 seam 需要） | workspace truth、资源/端口 owner truth | seam pending；不以本地 probe 补齐 |
| `L2-runtime` | runtime/ref | owner run/status/result 的 safe projection/ref、readback basis | Runtime loop/result body、PID/port 推导 running | `RUN-UP-004 / blocked`；Runner-facing read seam 闭合 |
| `L4-sandbox` | runtime/ref | Sandbox request/control/lease/cleanup 的正式 ref/result/guard 输入 | Sandbox 私有实现、lease/reaper、隔离 truth、直接 DB/bus/topic | `RUN-UP-003 / blocked`；request/lease/cleanup contract 闭合 |
| `L4-observability` | runtime/ref | bounded diagnostic/read/handoff/redaction result | formal audit/evidence/report/verdict、raw logs/secret/body | `RUN-UP-005 / blocked`；safe DTO/handoff seam 闭合 |
| `L4-archive` | runtime/ref (future peripheral) | 受限 Archive reference posture（若未来 feature 显式请求） | Archive bundle、restore/accepted truth、启动/运行/清理成功依据 | `RUN-UP-006 / blocked`；不进入 P0 core |
| platform/resource owner | runtime/ref | bounded probe/Unsupported/Unknown/Conflict observations | allocation/lease、端口抢占、跨平台 support truth、容量/SLO | `RUN-UP-007 / blocked`；平台 capability matrix 闭合 |
| 验收/治理/GRC | review/evidence consumer | fixed-run report/evidence/handoff 的安全引用和 blocker 列表 | verdict、signoff、risk acceptance、readiness 或正式 audit truth | `RUN-OPS-002 / blocked`；真实 baseline/run/review 才可启用 |

依赖分类遵守全局规则：只有正式确认的编译期共享合同才可能在未来实现仓成为 compile dependency；运行期、事件协作、ref 或 adapter 依赖不得写成 path dependency。当前没有任何依赖已达到可执行 positive readiness。

### 7.8 非交付物清单

| 非交付物 | 排除理由 | 未来处理 |
|---|---|---|
| `FR-RUN-014` 批量预取、`FR-RUN-015` 多运行比较、`FR-RUN-016` Archive 浏览/恢复 | P1/P2，所需 owner/容量/Archive seam 未闭合 | 保留 future trigger；需重开 00/03/05/06 受影响 Step |
| Artifact/Governance/Project/Work/Sandbox/Runtime/Observability/Archive 内部 truth | 违反 truth ownership 和 Layer 5 边界 | 只消费正式 safe ref/summary/result |
| Sandbox 私有实现、直接 DB/bus/topic、SDK bypass、共享跨仓事务 | `AR/VETO-RUN-004/005/008` 禁止 | 通过 public API/SDK/semantic adapter；未闭合即 blocked |
| 具体语言、GUI/CLI、进程、packaging、crate/package/file layout、数据库/cache backend | `RUN-DDD-001~003` 未关闭 | 由 authority/ADR 和实现仓建立后回填；当前不写死 |
| production SLO/capacity/retention、跨平台硬数值和部署运维 | `RUN-OPS-001` 与 authority 缺失 | 仅保留 measurement/residual 和条件门禁，不设无来源阈值 |
| 真实 external GRC、release approval、baseline、run、artifact/report/evidence 实例 | 执行/验收事实尚未发生 | 未来在 05/06/实施期按 fixed-run 生成；旧 run 不回写 |
| actual verdict、signoff、risk acceptance、readiness | 只有验收 owner 可裁决 | 保持 `none / not_entered / blocked_by_missing_baseline` |
| implementation ledger/boundary skeleton（本 Step） | 07 flow 要求 Step 13 才创建 | 当前只保留计划路径和创建时机 |

## 8. 回填草稿（未来正式 `07-实施计划.md` §4）

> 校准来源：
> - `design-calibration/07_implementation_plan_step_04_deliverables.md`
>
> 延伸阅读：建议继续阅读本文件的“实施对象总表”“代码与协议交付面”“配置、环境与装配交付面”“测试、脚本、artifact/report/evidence 交付面”“跨仓 / 外部依赖交付物表”和“非交付物清单”。

正式 §4 应声明：本轮实施对象以 03 的七个逻辑模块和逻辑依赖方向为主轴，围绕 17 个正式对象/技术载体、14 个 semantic ports、11 Command、12 Query、4 planned Consumer、0 outbound event、5 Operations Job 组织；逻辑模块名不等于已批准的 crate、package、进程或物理路径。交付物必须按 code、protocol/adapter、config、test/data、gate/check/report、artifact/evidence、handoff/ledger 分类，且每项能够回指正式 03、04、05 或 06。

当前计划交付面包括：

1. `contracts`、`domain`、`application`、`infra`、`entry`、`worker`、`operations` 的语义实现面及其边界检查；
2. 11 Command、12 Query、4 Consumer negative/duplicate surface、5 Job 和 event-zero 结构红线；
3. 41 项配置、四 profile、strict source、validated snapshot、builder/readiness、failure/rollback 合同；
4. 18 CUT、108 planned TC、12 suite、18 slot 的测试/fixture/回归计划，以及固定 `run_id`、artifact/report/check/evidence 生成链；
5. `scripts/gates/`、`scripts/checks/`、`scripts/reports/` 和 `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/` 的计划交付面；
6. Step 13 才创建的 implementation ledger、planned boundary skeleton 和 future handoff 入口。

本轮不交付 owner truth、私有实现、direct DB/bus/topic、具体技术选择、真实 positive integration、外围 FR-RUN-014~016、生产 SLO/capacity/retention、真实验收 verdict/signoff/readiness 或任何执行实例。所有未闭合项保持 `planned / blocked / waiting / not_created`，不得由实现者现场补字段、DTO、port、状态、配置、证据或技术路径。

## 9. 待确认事项与重开触发

| 事项 | 影响的交付物 | 当前状态 | 处理时点/重开动作 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-runner` 是否创建及 manifest/test runner | 全部 code/test/script 落点 | `RUN-DDD-001 / blocked` | Step 5/8 前置核验；不在 design 仓代建 |
| 语言、runtime、shell、process、packaging authority | 物理模块、命令、目录和提交边界 | `RUN-DDD-002 / blocked` | Step 8/9；回写 03/07 后重审受影响交付物 |
| local state store/cache backend、locking/migration/atomicity/corruption | repositories/UoW/cache、REPLAY/JOB、builder readiness | `RUN-DDD-003 / blocked` | Step 8/9；仅 semantic fake/controlled 先行 |
| L0-sdk exact package/client/error/redaction/trace | `DEL-RUN-CODE-004`、positive adapter 和 dependency gate | `RUN-UP-008 / pending` | exact surface 到达后重开 protocol/adapter/test mapping |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive public seams | `DEL-RUN-PROTOCOL-*`、controlled/evidence/handoff | `RUN-UP-001~007 / blocked` | owner 合同到达后按 slot 增量重开；禁止猜 DTO/API |
| profile-specific local/durable guarantees 和 platform matrix | config/builder/resource/cleanup/E2E | `RUN-UP-007` + `RUN-DDD-003 / blocked` | Step 8；未闭合保持 Unsupported/Unknown/Blocked |
| 真实 integration/GRC、baseline、review roles | gate/report/evidence/handoff | `RUN-OPS-002 / blocked` | Step 7/11/12/13；无真实 run 不生成 EV/verdict |
| production workload/SLO/capacity/retention authority | NFA-RUN-008/009 和 release gate | `RUN-OPS-001 / blocked` | Step 7/9/12；只保留 measurement/residual |

交付物若新增对象、字段、状态、Command/Query/Consumer/Job、配置 key、事件、外部 owner 或硬阈值，不能在 Step 4 或实现阶段直接扩写；必须暂停并回写相应真相源，再重新执行受影响 calibration Step 和 boundary 审计。

## 10. 进入下一步条件

| 条件 | 状态 | 证据/说明 |
|---|---|---|
| 实施对象不是对象/文件清单，而是可验证逻辑交付面 | `pass` | 七模块、对象族、协议族、配置和横切载体均有职责与边界 |
| code / protocol / adapter / config / test / data / script / report / evidence / handoff 交付物明确 | `pass` | §7.2～§7.5 的每项有来源、计划落点、未来完成判定和当前状态 |
| 交付分母与 03/04/05/06 一致 | `pass` | 17 对象/14 ports/11+12+4+0+5、41 配置、18 CUT/108 TC/12 suite/18 slot、11 AC 等均回指正式文档 |
| 跨仓依赖按 compile/runtime/event/ref/adapter 分类，未把 sibling 私有实现列为交付物 | `pass` | §7.7；`RUN-UP-001~008` 继续 blocked/pending |
| 非交付物与 P1/P2 防误入规则明确 | `pass` | §7.8；外围、owner truth、具体技术、真实验收事实均排除 |
| 未伪造实现/测试/证据事实 | `pass` | 无目标仓、命令、文件、run、artifact、report、evidence、verdict、signoff 或 readiness 实例 |
| 可进入 Step 5 | `pass_for_step_05` | 下一步只能创建并完成 `07_implementation_plan_step_05_phases_dependencies.md` |

## 11. Step 自审记录

- [x] 已读取 Step 2/3、正式 03/04/05/06 相关章节、实施计划 SOP/书写规范、中间产物规范和台账规范。
- [x] 已回答代码模块、接口/事件/Job/adapter、测试、配置/数据、非交付和跨仓依赖问题。
- [x] 已按逻辑职责、协议族和横切可验证面抽取，未把全部对象或历史文件树当作实施任务。
- [x] 已保留 0 outbound event、Query no-write、Consumer no-payload/no-ACK、Job no-owner-repair 和 local record≠evidence 红线。
- [x] 已将 41 项/四 profile、18 CUT/108 TC/12 suite/18 slot、AC/AR/TX/NFA/VETO 作为来源追溯分母，而非执行结果。
- [x] 已列出跨仓依赖、持续 blocker、非交付物与重开触发；未猜 exact DTO/API/transport/backend。
- [x] 未创建目标实现仓、代码、脚本、测试、fixture、artifact/report/evidence、implementation ledger 或 boundary skeleton。

## 12. Step 结论与门禁

```text
step = 04
status = completed / pass / self_reviewed
gate_status = pass_for_step_05
gate_reason = 逻辑实施对象、代码/协议/adapter、配置、测试/数据、脚本、artifact/report/evidence、handoff、跨仓依赖和非交付物均已列明；每项可追溯且没有把物理 blocker 或 planned 事实伪装为实现结果。
next_allowed_action = create_and_complete_07_step_05_phases_dependencies
formal_07_write_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false_until_step_13_assembly
commit_required = false
```
