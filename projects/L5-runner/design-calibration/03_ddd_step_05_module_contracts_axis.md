# Step 5. 定义模块实现契约主轴

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
> 回填章节：未来正式 `03-详细设计.md` §5 模块实现契约
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md`
> 本文件性质：逻辑实现契约中间产物；不构成 package、crate、binary、源码目录或技术选型。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| Step | 5 / 定义模块实现契约主轴 |
| 逻辑状态 | `completed_logic_contract_blocked_physical_layout` |
| 总体 gate | `blocked` |
| 物理布局 gate | `blocked`（继承 Step 4；不在本步解除） |
| 进入依据 | 用户授权继续 Step 5～10，并要求参考 L1-governance 粒度和框架 |
| 输出 | 本文件 |
| 正式文档写入 | `false`；正式旧 `03-详细设计.md` 保持不动 |
| 实现/测试/提交 | 不实现代码、不执行测试、不创建 implementation ledger 或 skeleton、不提交 commit |

本步完成的是 capability 到逻辑模块的归属、依赖方向、暴露边界和后续对象/port/protocol/flow/state 的承接门禁。由于 `RUN-DDD-001~003` 仍未关闭，所有“模块”均使用技术中立名称，不写物理路径。

## 2. 本步目标与输入

### 2.1 目标

本步必须回答：

1. Runner 的六个业务组成部分如何跨实现模块落位，而不是被误拆成六个产品包。
2. 每个逻辑模块负责哪些对象、handler、service、port、adapter 或 job。
3. 哪些模块可以对外暴露 public contract，哪些只提供内部实现能力。
4. 模块之间允许和禁止的依赖方向是什么。
5. 在没有真实语言/runtime/repository 的情况下，哪些结论可以继续推进，哪些必须标为 blocked。

### 2.2 输入

| 输入 | 用途 |
|---|---|
| 正式 `02-概要设计.md` §4～§12 | 六个业务组成部分、17 个对象、11 Command、12 Query、4 planned Consumer、5 Job、14 required port |
| `03_ddd_step_04_implementation_units_file_layout.md` | 逻辑责任单元已稳定、物理布局 blocker 和命名红线 |
| `03_ddd_step_02_implementation_scope.md` | 本轮实现范围/非范围、truth ownership、unknown/fail-closed 规则 |
| `03_ddd_step_03_language_runtime_repository_constraints.md` | 技术选择 pending、不得从 README/旧文档继承语言和目录 |
| L1-governance Step 5 | 模块主轴、依赖图、对象归属预告、业务组成部分映射和独立停审结构 |
| 设计真相源闭环标准 | 字段、DTO、状态、port、flow 和 phase boundary 的闭环要求 |

## 3. SOP 问题回答

### 3.1 详细设计的逻辑实现模块是什么

Runner 采用七个**逻辑模块轴**。它们是后续对象和接口的归属标签，不是已创建的 workspace member 或文件夹：

| 逻辑模块 | 核心责任 | 主要承接 |
|---|---|---|
| `contracts` | 定义跨入口、跨 adapter 和跨步骤可复用的 typed ref、state、reason、command/query/job DTO、view surface、receipt 与安全错误面 | public semantic contract；不拥有 Runner truth |
| `domain` | 定义 Runner-owned local truth、binding、不变量、保护 guard、恢复状态和纯状态转换 | 17 个对象中的 local aggregate/guard；不读取外部系统 |
| `application` | 编排 command/query/consumer/job 用例，执行门禁、幂等、事务协调和副作用顺序 | 六个业务组成部分的 use-case service；调用 ports，不实现 adapter |
| `infra` | 承载 local persistence/cache/projection、SDK/API adapter、platform adapter、redaction 与 runtime composition 的实现边界 | 14 required ports 的实现候选；当前只定义语义职责，不定义技术产品 |
| `entry` | 统一 GUI/CLI/product inbound、request validation、presenter 和 read-model composition | 11 Command、12 Query 的入口和展示映射 |
| `worker` | 承载四个 planned inbound consumer 的消息/事件入口和受控处理循环 | release authority、sandbox lifecycle、runtime status、handoff change consumer |
| `operations` | 承载五个 operations job 的显式长时/恢复/刷新入口 | acquisition/verify、eviction evaluation、reconcile、diagnosis refresh、visible-source refresh |

`projection`、`persistence`、`ports`、`adapters` 是实现层责任标签，分别落在上述逻辑模块内：projection/persistence/adapter 实现属于 `infra`，port 定义属于 `application`，presentation 属于 `entry`。这与概要设计的双轴一致，并避免把 owner 名称当成内部模块。

### 3.2 每个模块对外暴露什么

| 模块 | 可以暴露 | 不得暴露/承载 |
|---|---|---|
| `contracts` | typed id/ref、state、reason、command/query/job DTO、safe view、receipt、redacted protocol error | domain aggregate、repository、adapter client、外部正文、secret |
| `domain` | local aggregate/entity/value object、policy/guard、domain error、纯 transition 方法 | HTTP/RPC/bus、SDK client、OS API、store、owner truth、外部正文 |
| `application` | use-case facade、application error、port trait、transaction/idempotency helper、query composer | adapter 实现、transport route、UI 状态、私有 owner DTO |
| `infra` | port adapter、local repository/cache/projection implementation、runtime composition、availability marker | 被 entry 直接调用的业务 API、domain invariant 绕过、跨 owner 私有实现 |
| `entry` | command/query handler、presentation mapping、read-model composer facade | repository、domain transition、SDK/OS/owner client 直连 |
| `worker` | consumer handler/runner、receipt mapping、受控 worker lifecycle | 新建 Runner truth、直接写 store、把 ACK/消息到达当 owner success |
| `operations` | job runner、批次/报告/恢复入口 | query 内隐式 refresh、自动 replay unknown、修复 owner truth、把 job report 当 evidence |

### 3.3 允许依赖和禁止依赖

允许的逻辑方向为：

```text
core semantic primitives (external, opaque)
                 │
                 ▼
             contracts
                 │
                 ▼
              domain
                 │
                 ▼
            application  ──defines──► ports
                 │                       ▲
                 ▼                       │ implements
               infra  ───────────────────┘
              ▲   ▲   ▲
              │   │   │
            entry worker operations
```

该图是逻辑依赖图，不是 Cargo、npm、进程或部署图。

允许：

- `contracts` 只依赖已批准的 core semantic primitives 或本地无副作用基础类型。
- `domain` 依赖 `contracts` 的 opaque ref/state/reason，但不依赖 `application` 或 `infra`。
- `application` 依赖 `contracts`、`domain`，并定义/调用 ports。
- `infra` 依赖 `contracts`、`domain`、`application` 以实现 ports 和组装 runtime。
- `entry`、`worker`、`operations` 依赖 `contracts` 和 application facade；如需 runtime wiring，只通过受控 composition boundary 获得。

禁止：

- `contracts` 反向依赖 `domain`，或在 DTO 中引用 domain-only aggregate。
- `domain` 读取 repository、调用 SDK/HTTP/bus/OS/Sandbox backend，或保存 owner body。
- `application` 反向依赖具体 `infra` adapter；不能通过全局 singleton 绕过 port。
- `entry`、`worker`、`operations` 互相调用或直接访问 repository/store/adapter。
- 任何 sibling owner（Artifact、Governance、Work、Workspace、Runtime、Sandbox、Observability、Archive）成为编译期 source/path dependency；只能经正式 SDK/API/semantic port。
- 以 `utils`、`common`、`helper` 等无边界桶吸收跨模块对象。

### 3.4 物理布局状态

本步不将逻辑模块名映射到路径。以下事实仍保持：

| 事实 | 结论 |
|---|---|
| 目标实现仓不存在 | 不创建、不声称已有 manifest/source/baseline |
| 语言/runtime/shell/process/store 未定 | 不写 crate/package/binary/file extension |
| SDK exact binding 未闭合 | 不写 dependency name/version/path |
| 逻辑模块契约可继续 | 可以继续 Step 6～10，所有输出标注 logical-only |

## 4. 当前文档问题诊断

| 诊断对象 | 历史/候选问题 | 本步处理 |
|---|---|---|
| README | 同时假设 Rust/Tauri/Web/CLI，未定义边界 | 不继承；只作冲突扫描输入 |
| 旧正式 03 | 以旧 `api/application/domain/infra` 和旧队列主线组织 | 不继承；以 02 的六部分与多轴状态为准 |
| draft | 逻辑层次较全，但仍可能把 product shell/store 当技术事实 | 仅吸收责任遗漏，不吸收路径或产品选择 |
| 02 的双轴框架 | 业务组成部分与实现层并存，容易被误当 crate | 本步明确六部分跨七个逻辑模块实现 |
| Step 4 blocker | 无法满足真实物理路径门禁 | 保留 blocked；不阻止逻辑契约校准，但阻止物理落码声明 |

## 5. 改动前后对比

| 维度 | 本步前 | 本步后 |
|---|---|---|
| 模块主语 | 六个业务部分 + 若干分层，归属可能混杂 | 七个逻辑实现模块；业务部分跨模块映射 |
| 依赖方向 | 仅有概要层原则 | contracts → domain → application → infra；entry/worker/operations 仅做入口 |
| Port owner | 02 只列 required ports | application 定义语义 port；infra 实现；入口不得直连 |
| Projection/Persistence | 可能被当成 truth module | 作为 infra 内实现责任，projection 不反写真相 |
| Outbound event | 旧材料可能暗示队列 | 当前无 Runner-owned outbound event family；后续协议不得凭空新增 |
| 技术路径 | 历史材料有 Rust/Tauri 等 | 物理布局仍 blocked；逻辑契约继续 |

## 6. 设计取舍

| 方案 | 取舍 | 结论 |
|---|---|---|
| A. 六个业务部分各自成为模块 | 语义直观，但每部分都横跨 DTO/domain/service/store，易循环且混淆 owner | 不采用 |
| B. 以概要实现层为模块、不定义公共边界 | 灵活但实现者无法判断对象和 port 归属 | 不采用 |
| C. 七个逻辑模块轴，物理布局后置 | 能承接 L1-governance 的 capability→object→port 递进，也不伪造技术选择 | 采用 |
| D. 直接套用 Rust workspace/crate 模板 | 可读但违反 Step 4 blocker 和真实性门禁 | 不采用 |
| E. 让每个 owner 仓成为 Runner module/dependency | 破坏 truth ownership 和 SDK-first | 不采用 |

## 7. 结构化中间产物

### 7.1 逻辑模块总览表

| 模块 | Runner 实现单元 | 主要职责 | 对外暴露 | 允许依赖 | 禁止依赖 |
|---|---|---|---|---|---|
| `contracts` | public semantic contract boundary | refs、states、reasons、DTO、views、receipts、redacted errors | typed contract types | core primitives | domain/application/infra/entry/worker/operations、owner正文 |
| `domain` | Runner local truth and guards | 17 对象的 local truth/observation/projection state、binding、不变量和 transition | object/policy/domain error | contracts | ports、stores、SDK、UI、owner truth |
| `application` | use-case orchestration | command/query/consumer/job 编排、门禁、幂等、UoW、side-effect ordering | facades、port traits、application error | contracts/domain | concrete infra、entry、worker、operations、transport |
| `infra` | local and external adapter boundary | state store/cache、projection、SDK/API/platform/redaction adapter、runtime composition | port implementations、availability markers | contracts/domain/application | entry/worker/operations direct coupling、owner private impl |
| `entry` | GUI/CLI/product inbound and presentation | request validation、handler、presenter、read model assembly | handler/facade surface | contracts/application、受控 runtime composition | domain/store/adapter direct |
| `worker` | planned inbound consumer boundary | envelope validation、dedup、gap/reconcile receipt、consumer runner | consumer entry surface | contracts/application、受控 runtime composition | direct store/domain/owner client、entry/operations |
| `operations` | explicit jobs | acquisition/verify、eviction candidate、reconcile、diagnosis/source refresh | job entry/report surface | contracts/application、受控 runtime composition | query hidden writes、direct adapter/store、entry/worker |

### 7.2 模块依赖图和边界解释

```text
              ┌─────────────────────────┐
              │ core semantic primitives │
              │ (opaque, authority-owned)│
              └────────────┬────────────┘
                           ▼
                    ┌────────────┐
                    │ contracts  │
                    └─────┬──────┘
                          ▼
                    ┌────────────┐
                    │  domain    │
                    └─────┬──────┘
                          ▼
                    ┌────────────┐       defines       ┌───────┐
                    │ application├────────────────────►│ ports │
                    └─────┬──────┘                     └───▲───┘
                          ▼                                  │
                    ┌────────────┐       implements          │
                    │   infra    ├───────────────────────────┘
                    └──┬────┬────┘
                       ▲    ▲
             ┌─────────┘    └─────────┐
             │                       │
          ┌──┴───┐  ┌────────┐  ┌────┴────────┐
          │ entry│  │ worker │  │ operations  │
          └──────┘  └────────┘  └─────────────┘
```

`ports` 在图中是 application 的契约面，不是第八个物理模块。`infra` 可以包含 persistence/projection/adapter implementation，但不得把这些实现重新暴露成 truth owner。`entry`、`worker`、`operations` 不互相依赖。

### 7.3 模块职责表

#### 7.3.1 `contracts`

| 维度 | 契约 |
|---|---|
| 主要能力 | 跨入口传递 exact selection、binding、safe refs、状态、原因、分页、可见性、freshness、receipt 和 blocked/unknown surface |
| 对应概要主体 | 11 Command、12 Query、4 planned Consumer 的 envelope，以及 5 Job 的 input/report；当前不定义 outbound event family |
| 可定义对象 | `RunnerContextRef` 的 public ref shape、`SelectionGeneration` contract、所有 public state/reason/ref、Command/Query/Consumer/Job DTO、view sections |
| 不可定义对象 | `Release`、`Approval`、`SandboxLease`、`RuntimeExecution`、`Evidence`、raw log、owner response body |
| 关键门禁 | `latest`、default branch、directory newest 等隐式选择不得在 DTO 中出现；unknown/degraded/blocked 必须可表达 |

#### 7.3.2 `domain`

| 维度 | 契约 |
|---|---|
| 主要能力 | local aggregate、binding、selection generation、material qualification、run/control intent、resource guard、recovery transition |
| 对应对象 | `RunnerContextRef`、`ReleaseSelection`、`AcquisitionTask`、`MaterialCacheEntry`、`IntegrityPosture`、`RunIntent`、`ControlIntent`、`ResourceObservation`、`ProtectionGuard`、`RecoveryCase`、`HandoffPosture` |
| projection 对象 | `OwnerRunProjection`、`OutputPreview`、`FailureDiagnosis`、`RunnerReadModel`、`ConnectivityView` 只能保存 safe projection/observation，不能成为 owner truth |
| 关键门禁 | 所有 transition 必须有显式前置条件；accepted ≠ running；qualified ≠ approved；releasable ≠ released；handoff receipt ≠ evidence |
| 禁止 | 读取/修改 owner truth、自动 replay unknown、在 query 中写入或修复 |

#### 7.3.3 `application`

| 维度 | 契约 |
|---|---|
| 主要能力 | command accepted/rejected/unknown 编排、query no-write、consumer reference update、operations job、UoW、幂等和副作用顺序 |
| 服务组 | `SelectionService`、`AcquisitionService`、`QualificationService`、`RunLifecycleService`、`ControlService`、`ResourceRecoveryService`、`PreviewService`、`DiagnosisService`、`HandoffService`、`RunnerReadModelComposer`、`ConnectivityService` |
| Port owner | 14 required port 的语义 trait、local store abstraction、clock/id、redaction、result/receipt surface |
| 关键门禁 | 本地事务与 owner/network/download/verify 调用分开；所有 existing truth update 需 expected version；query 不 reserve/write |

#### 7.3.4 `infra`

| 维度 | 契约 |
|---|---|
| 主要能力 | 实现 application ports；提供 local state/cache/projection persistence、owner SDK/API adapter、platform resource probe、redaction adapter、runtime composition |
| 可实现内容 | fake/durable repository（未来技术确定后）、SDK-first adapter、source/version/integrity adapter、Sandbox/Runtime/Observability/Archive adapter、safe store |
| 关键门禁 | adapter 只返回 semantic safe result/ref/receipt；不得暴露 private implementation；不得改变 domain transition；不得把 HTTP 200/ACK/PID 当 owner truth |

#### 7.3.5 `entry`

| 维度 | 契约 |
|---|---|
| 主要能力 | GUI/CLI/product input 映射到统一 command/query facade；多入口展示 section-level status/source/freshness/visibility |
| 入口 | `SelectRelease`、`InvalidateSelection`、`RequestMaterialAcquisition`、暂停/恢复/取消、`RequestRun`、`RequestRunControl`、`RequestCleanup`、`OpenManualReview`、`RequestDiagnosticHandoff`；12 个 query |
| 关键门禁 | 入口只做 schema/actor/metadata validation，不本地批准、不直接调用 Sandbox/private store、不从 toast/PID 推导状态 |

#### 7.3.6 `worker`

| 维度 | 契约 |
|---|---|
| 主要能力 | 校验正式 owner event envelope、source version、event id、dedup、gap/order，并把 safe projection/ref 更新交给 application |
| Consumer | `ConsumeReleaseAuthorityChange`、`ConsumeSandboxLifecycleChange`、`ConsumeRuntimeStatusChange`、`ConsumeHandoffChange` |
| 当前状态 | 全部 `planned/blocked`；schema/client 未闭合时不得解析 payload、写 projection 或声称 ready |
| 关键门禁 | duplicate 只回放 receipt；gap/conflict 进入 stale/recovery；ACK/消息到达不等 running/cleanup/evidence |

#### 7.3.7 `operations`

| 维度 | 契约 |
|---|---|
| 主要能力 | 显式执行长时 acquisition/verification、eviction candidate evaluation、reconcile、safe diagnosis refresh、visible source refresh |
| 关键门禁 | job report 是本地 operations surface；不修复 owner truth、不自动重放 unknown、不把 candidate 当 delete license、不把 success 当 approved/running |

### 7.4 对象、handler、port、adapter 归属预告

| 类别 | 逻辑归属 | Runner 类型/示例 | 归属理由 |
|---|---|---|---|
| public ref/state/reason | `contracts` | `RunnerContextRef`、`SelectionState`、`UnknownReason`、`VisibilityPosture` | 会穿过 command/query/job/consumer/view |
| local aggregate/guard | `domain` | `ReleaseSelection`、`AcquisitionTask`、`RunIntent`、`ProtectionGuard` | 拥有本地不变量和 transition |
| owner projection/read model | `domain` + `contracts` view | `OwnerRunProjection`、`OutputPreview`、`RunnerReadModel` | safe projection 不拥有 owner truth |
| use-case service | `application` | `SelectionService`、`ResourceRecoveryService`、`HandoffService` | 编排 port、事务、幂等和副作用顺序 |
| semantic port trait | `application` | `ReleaseAuthorityReadPort`、`SandboxRunPort`、`RunnerStateStorePort` | application 定义需求，避免 adapter 反向决定业务 |
| adapter/repository | `infra` | Artifact/Governance/Sandbox/Runtime/Obs/Archive adapters、local store/cache | 技术绑定待 authority，不能进 domain |
| synchronous handler/presenter | `entry` | command/query handlers、CLI/GUI/product adapters | 所有入口共享 facade |
| inbound consumer | `worker` | 四个 planned consumers | 事件入口不拥有 truth |
| operations runner | `operations` | 五个 jobs | 长时/恢复显式化，不藏在 query |

### 7.5 六个业务组成部分到模块映射

| 业务组成部分 | `contracts` | `domain` | `application` | `infra` | `entry` / `worker` / `operations` |
|---|---|---|---|---|---|
| Context and explicit selection | selection/context DTO、authority posture | context/selection/generation | `SelectionService`、selection gate | context/authority adapters、local selection store | entry commands/queries；authority consumer；visible-source refresh |
| Material acquisition and qualification | acquisition/progress/integrity DTO | task/cache/integrity | acquisition/qualification services | material source/verifier/cache adapters | entry acquisition controls；acquire/verify job；eviction evaluation |
| Run intent and lifecycle | run/control/result posture DTO | run/control intent | lifecycle/control service | Sandbox/Runtime adapters、owner projection store | entry run/control；sandbox/runtime consumers |
| Resource, cleanup and recovery protection | resource/guard/recovery/cleanup DTO | observation/guard/recovery | resource/recovery service | platform probe、Sandbox lease/cleanup adapter、state store | entry cleanup/manual review；reconcile job |
| Preview, diagnosis and handoff | preview/diagnosis/handoff DTO | safe local diagnosis/handoff state | preview/diagnosis/handoff service | diagnostic/redaction/observability/archive adapters | entry preview/handoff；handoff consumer；diagnosis refresh |
| Entry and presentation composition | read-model/query DTO | composition invariants only | read-model composer/connectivity | projection/read store、platform connectivity adapter | GUI/CLI/product entry；visible-source refresh |

### 7.6 模块级测试切口预告（不执行）

| 模块 | 未来测试切口 | 当前状态 |
|---|---|---|
| `contracts` | DTO round-trip、forbidden `latest` validation、redaction/body-free、unknown/degraded surface、cursor/ref typing | planned；无 test runner |
| `domain` | transition matrix、binding mismatch、accepted≠running、guard conservative evaluation、terminal freeze | planned；无实现仓 |
| `application` | command transaction ordering、duplicate replay、query no-write、consumer gap、job partial report | planned；port exact surface blocked |
| `infra` | adapter result mapping、store expected-version、SDK error/redaction/trace、platform unknown | blocked by `RUN-UP-001~008`/technology choice |
| `entry` | actor/metadata validation、GUI/CLI parity、section-level degraded rendering | planned；shell not selected |
| `worker` | unsupported version、dedup、gap/conflict、receipt replay | blocked; event schemas absent |
| `operations` | checkpoint/restart、candidate vs deletion、reconcile/manual review、bounded diagnosis | planned; implementation/test runner absent |

### 7.7 跨模块边界审计

| 审计项 | 结论 |
|---|---|
| Truth ownership | Runner 只写本地 selection/material/intent/guard/recovery/handoff posture；owner truth 只读 projection/ref |
| State axes | selection、acquisition、integrity、cache、request、execution、control、protection、cleanup、recovery、handoff、connectivity 不合并 |
| Protocol family | 11 Command、12 Query、4 planned Consumer、5 Job；当前没有 Runner-owned outbound event family |
| Side-effect boundary | command/consumer/job 可写；query/render/reconnect view no-write |
| Dangerous action freeze | unknown/stale/conflict/active protection 禁止 cleanup/delete/evict/replay |
| Body boundary | 不存 Release/Governance/Sandbox/Runtime/Observability/Archive raw body、secret、local logs as evidence |
| Physical truth | 无 package/crate/file/path 结论；Step 4 blocker 保持 |

## 8. 回填草稿（未来正式 03 §5）

正式装配时可摘录以下结论，但不得把逻辑模块写成已存在物理 crate：

1. Runner 的详细设计按 `contracts`、`domain`、`application`、`infra`、`entry`、`worker`、`operations` 七个逻辑模块组织。
2. 六个业务组成部分跨模块实现；不把页面、owner 或 job 单独当作 truth module。
3. `application` 唯一拥有 semantic port trait；`infra` 是实现边界；入口只调用 application facade。
4. `contracts` 只承载 body-free public types；`domain` 不依赖外部 adapter；query/render no-write。
5. 物理路径、package/crate/binary 映射仍由 Step 4 blocker 约束，待正式 authority 后重开 Step 3～4。

## 9. 待确认事项与后续承接

| ID/事项 | 本步结论 | 后续 |
|---|---|---|
| `RUN-DDD-001~003` | 物理布局、语言/runtime/shell/store 未定 | 不在 Step 6～10 伪造路径；关闭后重开 Step 3～4 |
| `RUN-UP-001/002` | Release locator/authority exact seam 未闭合 | Step 6 只写 semantic ref/posture；Step 7 写 blocked port |
| `RUN-UP-003/004` | Sandbox/Runtime request/status/cleanup surface 未闭合 | Step 6 保持 owner projection；Step 7/8 明确 unknown |
| `RUN-UP-005/006` | diagnosis/handoff/archive exact contract 未闭合 | Step 6 保持 body-free；Step 7/8 不声明正向 adapter |
| `RUN-UP-007/008` | platform/SDK binding 未闭合 | Step 7 写 required semantic port；不写 method/path/version |
| `no outbound event family` | 当前无正式 Runner-owned outbound event 消费者/主题 | Step 8 不新增 event family；只定义 command/query/inbound/job，若未来需要先回 02 |

## 10. 进入 Step 6 条件

| 条件 | 结果 |
|---|---|
| 七个逻辑模块主轴已固定 | 通过 |
| 每模块职责、暴露和依赖方向已写清 | 通过 |
| 六个业务组成部分跨模块映射已闭合 | 通过 |
| 对象/handler/port/adapter/job 归属预告已给出 | 通过 |
| 物理 package/crate/file 可直接创建 | 未通过（Step 4 blocker） |
| 可在不伪造技术事实的前提下继续对象契约 | 通过；逻辑-only |

结论：Step 5 的逻辑模块实现契约已完成；总体 `gate_status=blocked` 仅表示物理布局/技术 authority 未闭合，不阻止在用户授权范围内进入 Step 6。Step 6 必须逐对象给出字段、来源、函数、状态和禁止事项，不得写真实路径或实现事实。
