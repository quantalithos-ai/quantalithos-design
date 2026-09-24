# Step 1. 确认实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填章节：未来正式 `07-实施计划.md` §1 与上游文档的关系声明
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 1` |
| `current_module` | `input_boundary` |
| `gate_status` | `pass_for_step_02` |
| `gate_reason` | 正式 00/01/02/03/04/05/06 已存在并完成当前设计停审；字段、DTO、状态、协议、证据和 phase boundary 的可落码状态已分类；实现仓与正向 seam blocker 未被伪造成可用事实。 |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_02_scope.md`；不得修改正式 07，不得创建 implementation ledger 或 boundary skeleton。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `commit_required` | `false` |

## 2. 本步目标、输入与非目标

本步只确认实施计划可使用哪些正式输入、这些输入是否足以开始规划、哪些闭环已经达到“可规划”程度，以及哪些事实必须阻塞实现移交。本步不定义实施范围、phase、任务、commit boundary、代码路径或排期。

### 2.1 本步输入

| 输入 | 状态 | 本步用途 | 使用上限 |
|---|---|---|---|
| `projects/L5-runner/00-需求文档.md` | 正式停审基线 | 读取定位、CP/FR/BR/NFR、AC、数据归属和禁止行为 | 不新增需求或 owner truth |
| `projects/L5-runner/01-架构设计.md` | 正式停审基线 | 读取 Layer 5、SDK-first、依赖分类、truth ownership、技术中立和架构红线 | 不替外部仓选择技术 |
| `projects/L5-runner/02-概要设计.md` | 正式停审基线 | 读取六个业务组成部分、17 对象轮廓、协议/flow/state 骨架 | 不替代 03 的字段与状态真相 |
| `projects/L5-runner/03-详细设计.md` | `completed_with_upstream_blockers` | 读取七逻辑模块、17 对象、14 semantic ports、11/12/4/0/5 协议、32 flow、21 状态、UoW/错误/幂等/配置/观测/test cuts | 物理布局、exact adapter 和 durable backend 仍 blocked |
| `projects/L5-runner/04-配置设计.md` | `completed_with_upstream_blockers` | 读取 41 项、四 profile、strict source、builder/readiness、failure/change/rollback | 不把 profile、configured 或 ready 当实现/环境事实 |
| `projects/L5-runner/05-测试方案.md` | `completed_with_upstream_blockers` | 读取 18 CUT、108 planned TC、12 suite、18 slot、T0～T4、固定路径、证据和回归合同 | planned 不等 test file、执行或 pass |
| `projects/L5-runner/06-验收标准.md` | `formal_stop_review_required` | 读取 AC-RUN、AR-RUN、TX-RUN、NFA-RUN、VETO、entry/exit、fixed-run 和裁决语义 | 不生成 actual verdict/signoff/readiness |
| `03_ddd_step_17_implementation_handoff.md`、`03_ddd_step_18_risks_open_questions.md` | 已完成中间产物 | 读取详细设计到实施承接清单、设计前置复核和 blocker 回流规则 | 不替 07 定义 phase/commit |
| 05/06 对应 Step 12～15 | 已完成中间产物 | 读取测试/验收的进出、证据、正式装配事实边界 | 不把 planned alias 当 evidence instance |
| 专项上游正式文档与必要项目台账 | 当前正式输入 | 核对 Artifact/Governance/Sandbox/Runtime/Observability/Archive/L0-sdk 的 Runner-facing seam 和 blocker | 未闭合处只记录 blocked/conditional |
| `standards/document/实施计划讨论流程_SOP.md` | authority | 固定 Step 1～13、phase/boundary 小循环和写入纪律 | 不可由项目计划改写 |
| `standards/document/实施计划书写规范.md` | authority | 固定正式 07 章节、阶段阅读矩阵、永久记忆、ledger/boundary gate | 不提前创建实现台账 |
| `standards/document/设计真相源闭环与可落码性标准.md` | authority | 固定字段/DTO/state/UoW/idempotency/projection/artifact/phase 复核标准 | 不把“遵循标准”当作当前通过 |
| `standards/document/代码实施台账与门禁规范.md` | authority | 固定 implementation ledger、Boundary Gate Matrix、Commit/Handoff Gate | 仅在 Step 13 建立实现台账实例 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | authority | 固定本仓 Layer 5 依赖裁剪和跨仓关系类型 | 不将运行期/事件协作写成 path dependency |

### 2.2 非目标

- 不在本步补写 `03` 缺失字段、DTO、port、state、error、persistence schema 或 exact SDK method。
- 不从 README、draft 或旧技术选择恢复 Rust/Tauri/Docker/gVisor/Firecracker、数据库、cache backend、端口或平台命令。
- 不把 `T0-DESIGN design_ready`、planned TC/slot、profile 名称、ACK、PID、端口、本地日志、receipt 或 handoff 推导成实现 readiness。
- 不创建 `/home/aris/Projects/quantalithos-runner`，不创建代码仓、manifest、baseline、测试脚本、artifact/report/evidence 或任何 implementation ledger 实例。

## 3. SOP 问题回答

| SOP 问题 | Runner 当前回答 | 依据与影响 |
|---|---|---|
| 1. 是否具备完整 00/01/02/03/05/06？ | 是；本轮还具备正式 04。00～06 均有对应 calibration flow/Step；04 是 05/06 的必要补充输入。 | 允许开始 07 输入边界讨论；不代表允许实现。 |
| 2. 哪些版本作为基线？ | 采用当前工作区新版正式 `00`～`06` 与其已完成 calibration 产物；当前工作区改动尚未形成新的不可变 design baseline。 | Step 13/实现移交前必须固定可复现 baseline；现在不得填写 commit/hash。 |
| 3. 03 是否足以支持 1:1 实现？ | 语义层面足以规划：模块、对象、port、协议、flow、状态、UoW、错误、幂等、配置、观测和最小 test cuts 已收口。物理层面不足以移交：实现仓、语言/runtime、store/cache、exact SDK/owner DTO 仍 blocked。 | 允许规划 phase；禁止实现者自行补 schema、路径或技术。 |
| 4. 05/06 是否足以定义阶段门禁？ | 足以定义计划门禁：05 提供 18 CUT/108 planned TC/12 suite/18 slot、T0～T4 和固定证据路径；06 提供 11 AC、15 AR/TX/NFA/VETO 家族、entry/exit 与三值裁决语义。 | Step 7 可嵌入门禁；真实执行仍 `blocked/not_run`。 |
| 5. 是否存在上游冲突？ | 未发现阻塞本步的显性编号/主语冲突；已知的是 exact positive seam、版本/authority chain、平台资源、SDK surface 和实现物理约束尚未闭合。 | 以 blocker/risk 分类继续，不让实现者自行选边。 |
| 6. 字段、DTO、状态、phase boundary 是否闭环？ | 字段/DTO/状态/协议/证据在 03/05/06 语义链中有来源和测试/验收反查；phase boundary 尚不存在，必须由后续 Step 5/6 定义并逐 boundary 重审。 | 当前结论为“可规划、不可移交”。 |
| 7. 05/06 是否与 03 正式名称一致？ | 是：使用七模块、11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job、21 状态、UoW/Unknown/no-replay、固定 EV/report 规则；不恢复旧 RunnerRun/RunQueue 名称。 | Step 7 必须继续保持同名，不得在 phase 中口语化。 |
| 8. 哪些缺口阻塞计划，哪些可延后？ | 目标仓、技术栈/物理布局、local store/cache、exact SDK/owner seams、真实 integration/SLO 环境阻塞实现移交；它们不阻塞当前 07 计划设计，但必须成为前置 gate/blocker。 | 允许进入 Step 2；不可生成实现事实。 |

## 4. 当前文档问题诊断

| 问题/缺口 | 分类 | 对实施计划的影响 | 本步处理 |
|---|---|---|---|
| 正式 `07-实施计划.md` 不存在 | 文档缺口 `RUN-DOC-003` | 无法定义 phase、boundary、实施完成判定或移交纪律 | 建立 07 flow；Step 13 才装配正式正文 |
| `/home/aris/Projects/quantalithos-runner` 不存在 | 实现前置 blocker `RUN-DDD-001` | 无 manifest、源码、测试 runner、baseline 可核验 | 不创建；作为 Step 3/8/9/12 的 blocker |
| 语言、runtime、GUI/CLI shell、process/packaging 未定 | 实现前置 blocker `RUN-DDD-002` | 不能写 crate/package/binary、文件布局或命令 | 保持技术中立；Step 3 仅定义 authority 检查 |
| local state store/cache、locking、migration、atomicity/corruption 未定 | 实现前置 blocker `RUN-DDD-003` | 不能承诺 durable adapter、目录、schema 或 recovery command | 只承接 03/04 的 required guarantees；不锁产品 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive/L0-sdk seam 未闭合 | 上游 blocker `RUN-UP-001~008` | 不能承诺正向下载、批准、运行、清理、结果、诊断或 SDK 调用 | 规划 semantic adapter、negative/blocked/unknown lanes；不猜 exact contract |
| SLO/capacity/retention 与真实 integration/GRC 环境未定 | 运行 blocker `RUN-OPS-001~002` | T2～T4、production/release evidence 和 hard NFR 无法激活 | 后续 Step 7/8/9/12 明确 blocked/not_run，不设无来源阈值 |
| phase/commit boundary 尚不存在 | 计划中间状态 | 尚不能做 boundary 级可落码审计 | Step 5 定义 phase，Step 6 定义 boundary，之后逐项复核 |
| 当前工作区尚未固定不可变 design baseline | 移交风险 | 实现者无法复现确切输入 | Step 11/12 设置 baseline gate；现在不伪造 hash |

### 4.1 旧材料污染扫描

README、`draft/` 和旧正式文档仅作为 `historical_material`。其中出现的 Rust/Tauri/Docker/gVisor/Firecracker、旧 `RunnerRun`/queue 主线、端口/性能/容量数字、私有 Sandbox 实现或本地日志证据，不进入本步输入边界。若后续正式文档与校准产物冲突，优先正式文档；仍不清楚则暂停并回写 03/04/05/06，不在 07 自行修复。

## 5. 改动前后对比

| 项 | 改动前 | 本步完成后 | 理由 |
|---|---|---|---|
| 07 校准入口 | 没有 07 flow 和 Step 文件 | 建立 07 flow 与 Step 1 输入边界 | 满足中间产物先于正式文档的恢复要求 |
| 上游输入 | 00～06 分散存在，使用上限未在 07 固定 | 明确 00/01/02/03/04/05/06、专项上游和标准的读取职责 | 防止实施计划误当第二详细设计或漏掉 04/证据输入 |
| 可落码结论 | 语义闭环与物理 blocker 混在一起 | 分成“可规划”与“可移交实现”两层 | 避免把 semantic design_ready 伪造成 implementation-ready |
| 缺口处理 | 目标仓/技术栈/外部 seam 未进入 07 门禁 | 编号化为 `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*`、`RUN-DOC-*`，指定后续回流点 | 实现前可审查、可暂停、可回写 |
| 实现台账 | 未建立 implementation ledger/boundary 实例 | 明确仅 Step 13 创建，当前保持禁止 | 防止提前伪造 boundary、commit 或实现进度 |

## 6. 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 发现 blocker 就停止整个 07 | 不会误读可落码性 | 计划无法提前收稳，且 blocker 本身需要 07 结构化承接 | 不采用；允许在 blocker 标记下规划 |
| 忽略 blocker，按 README 技术栈直接拆 phase | 文档看似具体 | 继承未经 authority 的技术和私有实现，违反事实边界 | 不采用 |
| 只写 semantic implementation plan，不写物理门禁 | 可保持技术中立 | 实现者仍可能临时补仓、store、SDK 和测试路径 | 不采用 |
| 语义计划 + 物理/外部 gate 明确阻塞 | 保留可验证阶段主轴，又能在移交前 fail-closed | 计划中存在较多 `blocked/waiting` | 采用 |
| 现在创建 implementation ledger/skeleton | 方便预填 | Step 5/6 尚未定义 phase/boundary，容易伪造或返工 | 不采用；Step 13 才创建 |

## 7. 结构化中间产物

### 7.1 实施输入边界矩阵

| 输入 | 可承接的实施判断 | 不可承接的判断 | 状态 |
|---|---|---|---|
| 00 | P0/P1/P2 需求范围、FR/BR/NFR、AC、owner/forbidden boundary | 新需求、实现方式、验收结果 | `usable_for_planning` |
| 01 | Layer 5 角色、SDK-first、truth ownership、依赖裁剪、架构红线 | GUI/CLI、进程、容器、数据库或平台技术 | `usable_for_planning` |
| 02 | 六组成部分、17 对象轮廓、协议/flow/state 关系 | 字段最终类型、物理模块、exact API | `usable_for_planning` |
| 03 | 七逻辑模块、17 对象与 carriers、14 semantic ports、11/12/4/0/5、32 flow、21 状态、UoW/错误/幂等/配置/观测/test cuts | 物理路径、语言/runtime、exact owner DTO、durable backend | `semantic_ready / physical_blocked` |
| 04 | 41 配置项、四 profile、strict source、builder/readiness、failure/change/rollback | 部署挂载、secret provider、环境实例、production values | `usable_for_planning / instance_blocked` |
| 05 | 18 CUT、108 TC、12 suite、18 slot、T0～T4、固定 artifact/report path、回归规则 | 测试文件、执行结果、run_id、真实 EV | `planned_only / execution_blocked` |
| 06 | 11 AC、AR/TX/NFA/VETO、entry/exit、三值 verdict、fixed-run pairing | actual verdict、signoff、readiness、release approval | `contract_ready / actual_not_entered` |
| 专项上游 | owner seam 的存在性、依赖类型和 blocker | 未闭合 seam 的 exact schema/API/positive pass | `conditional / blocked` |

### 7.2 可落码闭环预复核

| 复核面 | 当前证据 | 当前结论 | 实施计划处理 |
|---|---|---|---|
| 字段来源 | 03 Step 6/11/17；对象字段有 explicit/port/generated/derived/persisted basis 分类 | 语义闭环可规划；owner exact fields 仍 blocked | 每个 boundary 开工前再核；缺口回写 03 |
| DTO/secondary type | 03 Step 8/17；11 Command、12 Query、4 Consumer negative、5 Job result surface 有映射 | 语义闭环可规划；正向 Consumer/owner DTO 未授权 | Step 6/7 将 blocked-positive 设为 gate，不由实现补类型 |
| 状态 | 03 Step 10/16；21 正式状态主语，05/06 使用同名语义 | 状态闭环可规划 | 每个 phase/boundary 禁止旧 `RunnerRun` 或 `success` 别名 |
| Port/adapter | 03 Step 7/14/17；semantic port responsibility 明确 | 接口方向可规划；exact SDK/transport/backend 未定 | Step 8/9 设 authority/availability gate |
| Flow/phase | 03 Step 9 固定 32 flow；07 尚未定义 phase | flow 可承接；phase boundary 未完成 | Step 5/6 独立定义与审计，不在本步偷写 |
| UoW/version/generation | 03 Step 11/13；expected version、stored result、RecoveryCase、no-replay | 语义闭环可规划；durable implementation 未定 | 作为每个 boundary 的 Design Gate 必查项 |
| Projection/query | 03 Step 11/16；Query no-write、existing identity、generation guard | 逻辑可规划；物理 projection store 未定 | Step 6/7 绑定 query/repair 禁止项 |
| Artifact/report/evidence | 05/06 固定 raw/report/check pair 和路径 | 计划可承接；实例不存在 | Step 7/12 只定义生成/审查门禁，不写 EV 结果 |
| Config/readiness | 04 七域/四 profile；configured≠enabled≠ready | 计划可承接；环境实例缺失 | Step 8 绑定 builder/slot gate |

### 7.3 实施移交资格分层

| 层级 | 当前判定 | 允许动作 | 禁止动作 |
|---|---|---|---|
| 设计输入资格 | `pass` | 进入 Step 2，规划范围/阶段/门禁 | 不得把计划当实现 |
| 语义 phase 规划资格 | `pending_step_05` | 依据 03/05/06 设计可验证增量 | 不得假造物理路径 |
| boundary 级可落码资格 | `blocked_until_step_06_audit` | Step 6 完成后逐项判断 | 不得由实现者现场补字段/状态/port |
| 实现移交资格 | `blocked` | 等目标仓、技术 authority、baseline、positive seam 和 ledger 完成 | 不创建代码、测试、commit、run 或 readiness |

### 7.4 不画图说明

本步不新增 ASCII 图：输入关系已由正式 01/03 的系统上下文、依赖裁剪图和逻辑模块图表达；本步重点是输入资格与 blocker 分类，重复绘图不会增加实施判断信息。正式 07 仍须在需要表达 phase 依赖时按 SOP 4.2 单独收稳图题、图体和图后说明。

## 8. 回填草稿（未来正式 07 §1）

> 校准来源：`design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读：请继续阅读本文件的“实施输入边界矩阵”“可落码闭环预复核”“实施移交资格分层”和“待确认事项”。

未来正式 §1 应声明：本实施计划严格承接当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`，并以相应 calibration Step 作为解释性阅读入口。03 提供语义实现契约，04 提供配置控制面，05 提供测试/证据计划，06 提供验收裁决合同；07 不重定义这些真相源。当前可进入实施计划规划，但目标实现仓、技术/物理布局、local store/cache、L0-sdk exact surface、上游正向 seam、真实 integration/SLO 环境和不可变 design baseline 尚未闭合，因此后续 phase/boundary 必须保留 `blocked / waiting / deferred` 门禁，不能声称实现已开始或任何测试、证据、verdict、signoff、readiness 已存在。

## 9. 待确认事项

| 事项 | 影响 | 处理时点 | 当前状态 |
|---|---|---|---|
| 目标实现仓是否创建及其 manifest/test runner | 阻塞 PH-01 与所有实现移交 | Step 3/8 | `RUN-DDD-001 / blocked` |
| 语言、runtime、shell、process/packaging authority | 阻塞物理文件树、命令和 commit scope | Step 3/4/8 | `RUN-DDD-002 / blocked` |
| local store/cache backend、locking、migration、atomicity/corruption | 阻塞 durable implementation | Step 3/8/9 | `RUN-DDD-003 / blocked` |
| L0-sdk exact version/client/error/redaction/trace | 阻塞 SDK adapter binding | Step 3/8/9 | `RUN-UP-008 / pending` |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive exact seam | 阻塞正向 integration phase | Step 5/7/8/9 | `RUN-UP-001~007 / blocked` |
| workload、SLO、capacity、retention 与真实 GRC/integration environment | 阻塞 T2～T4 hard gate | Step 7/8/9/12 | `RUN-OPS-001~002 / blocked` |
| design baseline、用户改动清单与实现移交 commit | 阻塞实现交付可复现性 | Step 11/12/13 | `not_fixed / no fabricated hash` |

## 10. 进入下一步条件

- [x] 正式 `00`、`01`、`02`、`03`、`04`、`05`、`06` 的输入职责和使用上限已明确。
- [x] 字段、DTO、状态、协议、UoW、幂等、projection、artifact/evidence 和 phase boundary 的当前闭环状态已分层记录。
- [x] blocker、risk、deferred 与“可规划但不可移交”已分开。
- [x] 未创建目标实现仓、implementation ledger、boundary skeleton、代码、测试或证据实例。
- [x] 正式 07 仍保持 `false_until_step_13_assembly`。
- [x] 允许进入 Step 2；下一步只能创建 `07_implementation_plan_step_02_scope.md`。

