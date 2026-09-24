# Step 1. 确认概要设计输入边界

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `03-详细设计.md` |
| Step | 1 / 确认概要设计输入边界 |
| 状态 | `completed` |
| 当前模块 | `hld_input_boundary:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 概要设计已收稳业务组成部分、对象、接口、处理流和多轴状态，足以界定 03 的展开面；技术/仓库与 exact contract 缺口已显式隔离，不阻止进入范围讨论。 |
| next_allowed_action | `start_step_02` |
| 正式正文写入 | `blocked_until_step_19` |

### 1.1 Step 内计划

- [x] 读取项目级台账、正式 02 停审状态和用户授权边界。
- [x] 完整读取详细设计 SOP、书写规范、Rust 编码规范和目录组织规范。
- [x] 复核正式 00/01 与正式 02 §12～§13，确认稳定输入和持续 blocker。
- [x] 独立回答 Step 1 问题，形成上游映射、不再回答/必须回答和输入不足风险。
- [x] 后置扫描 README、旧正式 03 和 draft，排除历史技术与对象污染。
- [x] 完成回填草稿、自检并同步 flow / 项目台账。

### 1.2 开工与写入前检查

- 项目级门禁：正式 02 已 `formal_stop_review`；用户已明确授权连续完成 03 Step 1～4。
- 文档级门禁：`03_ddd_calibration_flow.md` 已建立；本步是当前唯一可写 Step。
- Step 级门禁：本步只判定 03 可承接什么，不定义语言、crate、文件、字段全集或函数签名。
- 历史材料门禁：README、旧正式 03 和 draft 仅在独立判断后用于冲突扫描。
- 真实性门禁：正式设计存在不等于实现仓、adapter、测试或 readiness 存在。

## 2. 本步输入

| 输入 | 本步使用 |
|---|---|
| `00-需求文档.md` | Runner 定位、能力闭环、ownership、业务规则、验收红线和 `RUN-UP-001~008`。 |
| `01-架构设计.md` | 六个语义方向、运行角色、依赖方向、数据所有权、多轴状态与技术未决项。 |
| `02-概要设计.md` | 六个组成部分、17 个对象、接口骨架、处理流、状态、异常、配置影响和 03 承接清单。 |
| `02-概要设计.md` §12～§13 | 直接的详细设计交接矩阵、回退规则、风险和待确认事项。 |
| 详细设计 SOP / 书写规范 | Step 1 输出结构、19 Step 顺序、正式章节和实现级门禁。 |
| 专项上游当前正式设计与必要台账 | 核验 owner 与成熟度；不据名称推断 exact Runner contract。 |

## 3. SOP 问题回答

### 3.1 当前详细设计直接承接哪些概要设计结论

1. 六个业务组成部分：Context/selection、material、run lifecycle、resource/recovery、diagnosis/handoff、entry/presentation。
2. Inbound/Presentation/Operations → Application → Domain → Projection/Persistence → Required Ports/Adapters 的实现依赖方向。
3. 17 个关键对象及唯一归属；local truth、owner projection/ref 和 local observation 必须分离。
4. 11 个 Command、12 个 Query、4 个 planned/blocked Consumer、5 个 Operations Job、14 个 required port；当前无 Runner outbound event family。
5. 显式版本、authority、取得/验证、run/control、cleanup/reconcile、preview/diagnosis/handoff 的主流程与事务外部副作用窗口。
6. Selection、acquisition、cache/integrity、run/control、owner lifecycle、resource/protection/recovery、handoff/connectivity 等多轴状态。
7. `latest` 禁止、`accepted != running`、unknown 冻结、query no-write、active/unknown protection 不删除、local log/receipt 非 evidence 等硬约束。

### 3.2 概要设计的代码主体是否足够稳定

业务主体和依赖方向足够稳定：03 可以继续讨论模块实现契约、对象、port、协议、flow、状态、一致性和测试切口。六个业务组成部分不等同六个 crate、进程或页面；03 必须先由真实技术/仓库证据决定物理承载，不能从概要图直接机械生成 Cargo workspace。

### 3.3 关键对象、接口、处理流和状态机是否足够继续展开

- 对象：17 个对象已给出责任、关键字段类型、函数骨架、状态和禁止事项，足以作为 Step 5～6 的输入。
- 接口：Command/Query/Consumer/Job/required port 分类和读写边界完整，足以作为 Step 7～9 的输入；exact schema/route/topic 仍受 blocker 控制。
- 流程：双事务、外部 side effect、ambiguous outcome、query-first reconcile、保护与 redaction 路径已明确。
- 状态：多轴主语和禁止迁移已明确；03 仍需逐 enum、函数和转换矩阵闭口。

### 3.4 哪些内容进入详细设计前仍不足

| 输入缺口 | 影响 | 本轮安全口径 |
|---|---|---|
| Runner 实现仓不存在 | 无法核验现有 manifest、workspace、package、binary 和文件偏离 | 记为 `RUN-DDD-001`；不得声称已有路径或代码。 |
| 语言/runtime/GUI shell/进程模型未定 | 无法选择 Rust/TypeScript、Tauri/Electron、单/多进程或具体注释/async 形态 | 记为 `RUN-DDD-002`；Step 3 只基于正式 authority 决策。 |
| 本地 store/cache/file atomicity 技术未定 | 无法定义真实 repository/backend/schema/migration/file layout | 只保留 required guarantees，Step 11 以前不锁产品。 |
| `RUN-UP-001~008` | 无法定义正向 owner adapter 的 exact DTO/API/event/error | 只允许 required semantic port、blocked/not-ready 和本地负向闭环。 |
| 配置/量化 authority 缺失 | 无法写正式 key/default/timeout/retry/concurrency/retention | typed binding 先行；具体配置留 04。 |

这些缺口不要求回退概要设计，因为它们不改变 Runner 的职责、对象主语或业务状态轴；它们会限制 Step 3～4 和后续正向实现契约。若为绕过缺口而改变六个组成部分、17 对象或接口语义，则必须回退 02。

### 3.5 哪些需求/架构结论影响 03 但不能在 03 重定义

- Release/Artifact、Governance、Project/Work、Runtime、Sandbox、Observability、Archive 的 truth ownership。
- SDK-first 与禁止私有 backend/topic/source dependency 的依赖方向。
- 显式 immutable Release/version、authority fail-closed 和多轴状态原则。
- redaction/evidence 边界、query no-write、unknown 不重放和保护优先。
- 外围 `FR-RUN-014~016` 不进入当前核心实现主线的范围判断。

## 4. 当前文档问题诊断

| 历史材料问题 | 若继承的影响 | 本轮处置 |
|---|---|---|
| 旧正式 03 以 `RunnerRun/RunQueueEntry/RunCard` 和 retry/replay/kill 为主线 | 跳过显式 Release、authority、材料资格和 cleanup protection，并把 UI 体验写成 truth | 不继承结构、对象、函数或目录。 |
| 旧正式 03 直接写 Rust struct、`src/application/domain/infra` 文件树 | 在语言/runtime 和实现仓未确认时伪造可落码路径 | 只作为 Step 3～4 冲突项。 |
| README 声称 Rust + Tauri、SDK Rust、共享 Sandbox 实现和 Docker daemon | 绕过当前正式 01/02 的技术中立与 public seam 边界 | 全部保持 historical；重新核验。 |
| README 固定冷/热启动与并发数字 | 伪造 workload/NFR baseline | 排除，不进入 03。 |
| draft 有十模块、`RunnerRun`、`DownloadTask` 等候选 | 可能将预校准候选覆盖正式 02 的六部分/17 对象 | 仅用于遗漏扫描，以正式 02 为准。 |

## 5. 改动前后对比

| 改动前历史叙事 | 当前输入边界 |
|---|---|
| 从 run/queue/card 开始设计 | 从可信 context 与显式 immutable Release 选择开始。 |
| Rust/Tauri/Cargo 文件树先行 | 先核验语言/runtime/真实仓库，再讨论物理布局。 |
| retry/replay/kill 是普通按钮动作 | control intent、owner result、unknown 和 reconcile 分轴，unknown 不自动重放。 |
| 本地 log/output/evidence card 可作为结果 | bounded/redacted preview 与正式 audit/evidence 严格分离。 |
| 共享 Sandbox 实现或 Docker backend | 只经正式 SDK/API/adapter，不编译或复用 Sandbox 私有实现。 |

## 6. 设计取舍

1. 以正式 02 为唯一直接概要输入；00/01 用于反查约束，专项上游用于核验 owner/seam。
2. 接受本地语义契约可以继续深化、正向 adapter 必须受 blocker 限制的双层设计方式。
3. 不因全局依赖矩阵把 `L0-core/L0-sdk` 标为编译期依赖，就在语言未知时预写 Cargo path dependency；依赖类型还需与实际消费语言/package 对齐。
4. 不把“目标仓不存在”直接当成可以随意规划文件的许可；Step 4 仍必须满足真实语言/runtime 和可创建路径门禁。
5. 不画图：本步是上游边界声明，书写规范明确本章禁止画图。

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 正式 `00-需求文档.md` | 核心能力、规则、ownership、NFR/验收红线与 blocker | 实现契约必须满足的字段、错误、状态、恢复和测试切口，不重写需求。 |
| 正式 `01-架构设计.md` | 六个语义方向、运行承载、依赖、数据所有权、一致性与 ADR | module/dependency、port/adapter、local transaction 和 composition 契约。 |
| 正式 `02-概要设计.md` | 六部分、17 对象、接口/flow/state/exception/config 轮廓 | 文件、完整对象/函数、协议、状态矩阵、持久化、一致性、错误和测试切口。 |
| 全局依赖规则 | L5 并行窗口；Runner 对 Core/SDK 的 compile 关系及 owner runtime/event 关系 | 结合实际语言/package 核验依赖声明；runtime/event 不变 source dependency。 |
| `L0-sdk` 当前正式设计与真实仓 | official client boundary、shared refs/errors/metadata 的候选消费面 | 只有核验 Runner 语言和 exact capability 后才绑定真实 package/crate。 |
| Artifact/Governance/Work/Workspace 正式设计 | Release/authority/context ownership | selection/material/context required adapters；exact contract blocked。 |
| Runtime/Sandbox/Observability/Archive 正式设计 | execution/isolation/diagnosis/archive ownership | lifecycle/cleanup/diagnosis/ref adapters；不侵入 owner truth。 |

### 7.2 本文不再回答

- Runner 的产品价值、用户故事和验收是否成立。
- 谁拥有 Release/approval/project/execution/isolation/audit/archive truth。
- 六个业务组成部分、17 个关键对象和多轴状态主语是否应重组。
- 是否允许 latest、私有 Sandbox backend、自动重放 unknown 或本地日志充当 evidence。
- 相邻 owner 应如何实现其内部服务、数据库、event 或 backend。

### 7.3 本文必须回答

- 经真实证据确认的语言、runtime、实现仓、package/crate/module/file 和依赖形态。
- 六个组成部分如何落到模块，模块内对象、函数、port、adapter、错误和测试如何 1:1 实现。
- 11 Command、12 Query、4 条件 Consumer、5 Job 的 schema、调用链、事务、幂等、错误和状态副作用。
- 17 对象的完整字段来源、构造、序列化/持久化、状态和不变量。
- local store/cache/file 的 atomicity、protection、cleanup、crash recovery 和 corruption 口径。
- 页面/CLI/product entry 如何共享同一 application/domain gate，并保持 cross-platform degradation。

### 7.4 输入不足风险清单

| 风险 ID | 缺失项 | 阻塞范围 | 未确认前行为 |
|---|---|---|---|
| `RUN-DDD-001` | 真实 Runner implementation repo | 现状偏离核验、真实 manifest/path、build/test 入口 | 只记录不存在，不创建或声称现有。 |
| `RUN-DDD-002` | 正式语言/runtime/product shell/process authority | Step 3 技术结论与 Step 4 物理布局 | 不从历史材料继承，不伪造 package/crate。 |
| `RUN-UP-001~008` | owner/SDK exact contracts | 正向 adapter/protocol/event/integration | planned/blocked seam；negative closure only。 |
| `RUN-DDD-003` | store/cache/file technology 与 platform matrix | persistence、locking、migration、cleanup | 保留 required guarantees，不锁 backend。 |

## 8. 回填草稿

未来正式 §1 应使用 §7.1 的映射表和 §7.2/§7.3 清单；正式正文只保留已收稳的承接结论。旧材料诊断、仓存在性细节和逐题回答留在本文件。正式 §17 风险章节需承接 `RUN-DDD-001~003` 与 `RUN-UP-001~008`。

## 9. 待确认事项

- `RUN-DDD-001`：是否以及何时建立 `/home/aris/Projects/quantalithos-runner`，当前没有授权创建。
- `RUN-DDD-002`：Rust/TypeScript/其他语言、GUI/CLI shell、runtime、进程与 packaging authority 来自何处。
- `RUN-DDD-003`：本地 state store、cache bytes、quarantine/promotion、locking/migration/corruption 的技术承载。
- `RUN-UP-001~008`：保持原 blocker，不因真实 `quantalithos-sdk` 仓存在而视为 Runner exact surface ready。

## 10. 进入下一步条件

- [x] 已明确 03 直接承接的正式概要结论。
- [x] 已确认代码主体、对象、接口、流程和状态的语义骨架足够稳定。
- [x] 已列出所有输入不足风险及其阻塞范围。
- [x] 已明确本文不再回答和必须回答的问题。
- [x] 未重写上游、未提前选择语言/runtime、未伪造实现事实。
- [x] 历史材料只用于后置冲突扫描。

结论：`gate_status=pass`，允许串行进入 Step 2；正式旧 03 继续只读。
