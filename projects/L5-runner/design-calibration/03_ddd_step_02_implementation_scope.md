# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `03-详细设计.md` |
| Step | 2 / 明确本轮实现范围和非范围 |
| 状态 | `completed` |
| 当前模块 | `implementation_scope:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 已把六个业务组成部分、实现分层、17 对象、接口/flow/state 和 cross-platform presentation 约束转译为实现契约目标；非范围与本轮 Step 1～4 授权上限均清楚。 |
| next_allowed_action | `start_step_03` |
| 正式正文写入 | `blocked_until_step_19` |

### 1.1 Step 内计划

- [x] 恢复项目台账、03 flow 和 Step 1 门禁。
- [x] 读取正式 02 §2、§4～§12，提取详细设计必须覆盖的主体。
- [x] 按六个组成部分、实现层和接口类别回答范围问题。
- [x] 区分完整 03 的设计范围、本会话只执行 Step 1～4 的授权范围，以及被 blocker 限制的正向实现面。
- [x] 后置扫描旧正式 03/README/draft 的范围膨胀和遗漏。
- [x] 完成目标表、非范围表、覆盖矩阵、回填草稿和门禁自检。

### 1.2 开工与写入前检查

- 项目级：Step 1 `pass`；当前允许 Step 2。
- 文档级：flow 已指向 Step 2；未来 Step 文件尚未创建。
- Step 级：本步定义详细设计交付范围，不进行语言/runtime 或文件布局选择。
- 授权级：完整 03 的最终目标可以列出，但本会话只执行到 Step 4，不能以范围表为由越权创建 Step 5+。

## 2. 本步输入

| 输入 | 本步使用 |
|---|---|
| Step 1 | 已确认的承接上限、输入不足风险和回退边界。 |
| 正式 02 §2 | 设计目标、当前范围/非范围和概要深度。 |
| 正式 02 §4～§7 | 六部分、实现分层、17 对象、Command/Query/Consumer/Job/required port 骨架。 |
| 正式 02 §8～§11 | 处理流、状态、异常和配置影响。 |
| 正式 02 §12 | 详细设计承接矩阵、transaction/config/test/evidence 交接。 |
| 用户当前授权 | 只落 Step 1～4 calibration，Step 4 后停审，不修改正式旧 03。 |

## 3. SOP 问题回答

### 3.1 完整详细设计必须覆盖哪些模块方向

详细设计最终必须覆盖两条正交轴：

1. 业务轴：Context/selection、material、run lifecycle、resource/recovery、diagnosis/handoff、entry/presentation。
2. 实现轴：Inbound/Presentation/Operations、Application、Domain/Guards、Projection/Persistence、Ports/Adapters、composition/config/diagnostics/test seams。

Step 4 以前只收稳“实现单元和文件布局能否成立”；模块实现契约要等用户授权 Step 5 后，按业务 capability 和依赖方向逐模块定义。

### 3.2 完整详细设计必须定义哪些对象、接口、事件、Job 和状态机

| 类别 | 当前概要数量/范围 | 详细设计最终必须做到 |
|---|---:|---|
| 关键对象 | 17 | 完整类型、字段来源、构造/成员函数、不变量、serialization/persistence/versioning 和测试切口。 |
| Command | 11 | request/result/error、metadata/idempotency、handler/service、transaction、ambiguous outcome 和 test seam。 |
| Query | 12 | request/view/page/marker schema、source/freshness/visibility、empty/degraded、repository/read service 和 no-write 证明。 |
| Inbound Consumer | 4 planned/blocked | 仅在 exact event seam 闭合时定义 envelope/payload/order/dedup/gap/cursor；否则保留 disabled/blocked + query fallback。 |
| Outbound Event | 0 | 保持不适用；不得自行增加 event/outbox。若改变必须回退 00～02。 |
| Operations Job | 5 | trigger/input/output/claim/checkpoint/cancel/bounded concurrency/result/error；job success 非 owner success。 |
| Required Port | 14 | typed request/response/error/capability/readiness、adapter mapping、fake parity 与 composition；blocked 不伪装 ready。 |
| 状态族 | selection/acquisition/cache/integrity/run/control/owner/resource/protection/recovery/handoff/connectivity | enum、owner、转换函数、合法/非法迁移、跨轴失效和测试映射。 |

### 3.3 哪些页面、命令和跨平台体验属于本轮

- 逻辑页面/section：context/release selection、material preparation、run lifecycle/control、resource/cleanup/recovery、preview/diagnosis/handoff、connectivity。
- 入口：用户产品入口、GUI（若最终选择）、CLI（若最终选择）、SDK/product adapter 与 operations trigger 必须共享相同 Command/Query/Application gate。
- 跨平台：platform capability、path/port/process/disk/network/suspend/resume 只能作为 local observation/adapter seam；unsupported/permission/unknown 必须可见，不得修改 owner truth。
- 展示：source/freshness/visibility、multi-axis state、restricted/partial/stale/unavailable 和 safe next action 必须一致；render/query no-write。

### 3.4 哪些能力属于外围或后续，不在当前核心展开

- `FR-RUN-014~016` 批量预取、多运行比较和 Archive 浏览，仅保留条件性 extension seam；没有需求重开和 owner contract 不展开对象/API/state/page。
- 分享运行/临时公网链接、代码编辑/调试、源码同步、生产部署、全局 scheduler、Sandbox backend、Runtime loop 不进入 Runner 核心。
- 完整测试策略与执行留 05；验收 evidence/verdict/signoff 留 06；phase/commit/task/ledger 留 07；正式配置 key/value/source/migration 留 04。

### 3.5 实现者拿到完整 03 后应能完成什么

在所有 blocker 已按设计条件关闭、正式 04～07 完成并授权实施的前提下，实施者应能：

- 建立真实目标仓中的已确认 implementation units 和入口；
- 实现 Runner-owned local state、Commands/Queries/Jobs 和安全状态机；
- 通过正式 SDK/public adapters 绑定 owner capabilities，不直连私有实现；
- 实现 quarantine-first acquisition、integrity qualification、run/control intent、protection/cleanup/recovery 和 redacted preview/diagnosis/handoff；
- 建立配置绑定、错误、并发/幂等、observability、test seams 和 cross-platform degradation。

这不是当前 readiness 声明：目前实现仓、语言/runtime、exact owner/SDK contract 和下游文档均未闭合。

## 4. 当前文档问题诊断

| 历史范围问题 | 影响 | 当前修正 |
|---|---|---|
| 旧正式 03 只有五个 run experience 模块 | 遗漏 context/explicit selection、authority、material qualification、cleanup guard 和 recovery | 以正式 02 六部分和 17 对象为范围基线。 |
| 旧正式 03 引入 queue/slot/retry/replay/kill/analytics | 把未获需求/架构授权的 scheduler/control/event 能力写入核心 | 不在接口骨架中的能力一律排除；unknown 不重放。 |
| 旧正式 03 将 output/evidence/archive 放在统一结果面 | 混淆 preview、Artifact 和正式 evidence truth | preview/diagnosis/handoff 仅安全引用和摘要，非 evidence。 |
| README 把共享 Sandbox 实现、Docker daemon 和 Tauri 当范围 | 侵入 Sandbox 私有实现并锁技术 | 只保留 public Sandbox seam 与 product-shell 待决项。 |
| draft 十模块比正式 02 更细 | 可能在模块主轴前固化物理切分 | 仅作为能力遗漏检查，不继承模块数量。 |

## 5. 改动前后对比

| 维度 | 历史材料 | 当前范围 |
|---|---|---|
| 起点 | run request / queue | trusted context + explicit immutable Release selection。 |
| 材料 | 下载/缓存作为辅助 | transfer/quarantine/integrity/qualification/protection 是核心。 |
| 生命周期 | 一个 RunnerRun + phase | intent、accepted、boundary、execution、control、terminal、cleanup 分轴。 |
| 恢复 | retry/replay 按钮 | freeze + query-first reconcile + manual review；unknown 不 replay。 |
| 结果 | output/artifact/evidence card 合并 | preview/diagnosis/handoff 与 Artifact/evidence truth 分离。 |
| 平台 | Tauri/Docker 已定 | product shell/runtime/backend 全部待 Step 3 权威核验。 |

## 6. 设计取舍

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| 只设计 GUI 页面和交互 | 直观 | CLI/product adapter 旁路，业务门禁无法复用 | 不采用。 |
| 按上游系统各建一个模块 | adapter 对齐直观 | 复制 owner domain，形成 shadow truth | 不采用。 |
| 完整覆盖正式 02 的业务轴和实现轴 | 可追溯、可复用、能保持 ownership | 文档规模较大，必须按 Step/模块小循环 | 采用。 |
| 现在纳入外围 FR-RUN-014~016 | 功能看似完整 | 缺需求优先级和 owner contract，扩大主线 | 不采用，保留 extension seam。 |

不画图：书写规范 §5.2 明确范围章节禁止画图；模块和依赖图留 Step 4/5。

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳真实实现形态 | 只在证据支持时确定语言/runtime/repo/layout/dependency | 可创建或定位的真实 implementation units；证据不足则明确 blocker。 |
| 落实六部分模块契约 | 按 capability 将六业务部分映射到 module/file，不按页面或 owner 系统分域 | 每模块文件、对象、函数、port、error、test seam。 |
| 完整化 17 对象 | 补字段、来源、构造、函数、状态、不变量、持久化/version | 可直接实现的 type/value object/aggregate/projection contracts。 |
| 完整化接口 | 11 Command、12 Query、4 条件 Consumer、5 Job、14 ports | DTO/schema、signature、handler、错误、幂等和 adapter contracts。 |
| 闭合关键处理流 | selection/acquire/qualify/run/control/cleanup/reconcile/diagnose/handoff/read-model | 函数级调用链、事务边界、crash window、状态副作用和 failure injection seam。 |
| 闭合多轴状态 | 各状态族独立 owner/trigger/transition；跨轴只显式传播 | enum、转换矩阵、非法转换错误和一致测试命名。 |
| 闭合本地一致性 | local store/cache/quarantine/protection/recovery 的原子性与并发 | repository/UoW 或等价介质、expected version、locking/corruption/cleanup 契约。 |
| 闭合外部边界 | SDK-first、public adapter、readiness、redaction 和 owner attribution | exact contract 未闭合时可编码的 blocked/disabled/unknown 路径。 |
| 闭合端侧入口体验 | 多入口共享门禁，逻辑页面呈现 source/freshness/visibility/degraded | entry/presenter/view/action availability 和 cross-platform adapter seams。 |
| 交付下游设计输入 | 配置、测试、验收、实施所需的稳定契约与风险 | 04～07 可继续引用的 binding/test/evidence/phase inputs。 |

### 7.2 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 重新定义需求、用户故事、验收和外围优先级 | `00-需求文档.md` / 用户产品决策 |
| 重分 truth owner、六语义方向、依赖和技术架构取舍 | `01-架构设计.md` / 相邻 owner 设计 |
| 改写六组成部分、17 对象主语、接口类别或新增 outbound event | `02-概要设计.md` 回退校准 |
| Artifact/Release 创建、批准、修改、发布、撤销 | L1-artifact / L1-governance |
| Runtime loop/outcome、Sandbox isolation/lease/cleanup truth | L2-runtime / L4-sandbox |
| Observability audit/evidence/report/verdict/signoff | L4-observability / `06-验收标准.md` |
| Archive bundle/restore orchestration | L4-archive；当前仅外围 ref seam |
| Sandbox 私有 Docker/gVisor/Firecracker backend 或源码复用 | L4-sandbox 内部实现 |
| 完整配置项、值、来源、环境矩阵与迁移 | `04-配置设计.md` |
| 完整测试策略、case 矩阵、执行与测试结果 | `05-测试方案.md` / 未来实现阶段 |
| 验收证据、verdict、signoff、readiness | `06-验收标准.md` / 正式验收 |
| phase、任务、commit boundary、implementation ledger/skeleton | `07-实施计划.md` 完成时 |
| 代码、实现仓创建、依赖安装、构建、测试、commit | 未来明确授权的实施阶段 |

### 7.3 范围到概要设计覆盖矩阵

| 详细设计覆盖面 | 概要输入 | 当前可设计上限 |
|---|---|---|
| Context/selection | 02 §5.4.1、§6.1、§7～§9 | 本地对象/门禁完整化；owner exact DTO blocked。 |
| Material | 02 §5.4.2、§6.2、§7～§10 | 本地 task/cache/qualification/protection；locator/policy exact blocked。 |
| Lifecycle | 02 §5.4.3、§6.3、§7～§10 | intent/projection/recovery；Sandbox/Runtime positive adapter blocked。 |
| Resource/recovery | 02 §5.4.4、§6.4、§7～§10 | local observation/guard/case；allocation/cleanup owner truth blocked。 |
| Diagnosis/handoff | 02 §5.4.5、§6.5、§7～§10 | bounded local negative closure；formal handoff positive path blocked。 |
| Entry/presentation | 02 §5.4.6、§6.6、§7～§12 | logical sections/actions/degradation；shell/framework pending。 |
| Persistence/config/test | 02 §11～§12 | required guarantees/binding/test seams；产品/key/run/result 后置。 |

### 7.4 本会话授权边界

| 当前允许 | 当前禁止 |
|---|---|
| 建立 03 flow；完成 Step 1～4 calibration；更新项目台账 | Step 5～19、重建正式 03、进入 04 |
| 只读核验 `/home/aris/Projects` 的 repo/manifest/layout | 创建或修改实现仓、源码、manifest、依赖 |
| 写 blocked/pending 与 logical unit boundary | 伪造 package/crate/binary/file、adapter ready 或测试事实 |

## 8. 回填草稿

未来正式 §2 应使用 §7.1 设计目标表和 §7.2 非范围表，并简述 §7.3 的六部分覆盖上限。授权边界属于执行过程，不进入正式正文；当前正式 03 不回填。

## 9. 待确认事项

| 事项 | 当前影响 | 未确认前处理 |
|---|---|---|
| 完整 03 是否在 Step 4 停审后继续 | Step 5～19 不能启动 | 等待用户明确授权。 |
| `RUN-DDD-001~003` | 技术/布局/persistence 无法物理闭口 | Step 3～4 如实 blocked/pending。 |
| `RUN-UP-001~008` | 正向 adapter/consumer/protocol 无法闭口 | 只设计 required seam 和负向安全路径。 |
| 外围 `FR-RUN-014~016` | 不进入模块/对象/API 主线 | 保留条件性 extension seam。 |

## 10. 进入下一步条件

- [x] 已按实现契约而非功能故事表达目标。
- [x] 六个组成部分、17 对象、接口/flow/state 覆盖范围清楚。
- [x] 非范围逐项指向 owner 或下游文档。
- [x] 完整 03 目标与本会话 Step 1～4 授权没有混同。
- [x] 没有提前选择语言、framework、store、crate 或文件。
- [x] 没有把 blocker 路径写成正向 readiness。

结论：`gate_status=pass`，允许串行进入 Step 3；正式旧 03 继续只读。
