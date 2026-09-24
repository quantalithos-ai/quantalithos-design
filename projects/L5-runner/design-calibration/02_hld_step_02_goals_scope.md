# Step 2. 明确本仓设计目标与当前范围

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `02-概要设计.md` |
| Step | 2 / 明确本仓设计目标与当前范围 |
| 状态 | `completed` |
| 当前模块 | `goals_scope:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 本轮要收稳的可实现结构、非范围和设计深度已明确；上游 exact-contract blocker 被限制为 required seam / fail-closed 设计，不阻止继续收稳概要约束。 |
| next_allowed_action | `read_and_start_step_03` |
| 正式正文写入 | `blocked_until_step_14` |

### 1.1 Step 内计划

- [x] 按项目台账 -> 02 flow -> Step 1 的顺序恢复上下文，确认当前只允许执行 Step 2。
- [x] 读取概要 SOP Step 2、书写规范 §4.2 及中间产物规则。
- [x] 回读正式 00 的目标、非目标、功能、规则、验收与风险，以及正式 01 的目标、边界、子域、依赖、承载、演进与待确认事项。
- [x] 独立回答五个 SOP 问题，形成设计目标、非范围和深度口径。
- [x] 后置扫描旧 02、README 和 draft，排除旧功能主线、技术选型、模块数和无来源数字污染。
- [x] 完成结构化产物、回填草稿、自检并同步 flow / 项目台账。

### 1.2 Step 开工与写入前检查

- 项目级门禁：用户已授权进入 02，Step 1 已 `pass`；未授权 03 或实现。
- 文档级门禁：02 flow 当前只允许 Step 2；正式 02 仍须等待 Step 14 full-restart。
- Step 级门禁：本步只确定“收什么、不收什么、停在哪里”，不正式拆主要组成部分、对象、接口、流程或状态。
- 历史材料门禁：旧 02、README 与 draft 只在独立判断后用于污染和遗漏扫描。
- 真实性门禁：`RUN-UP-001~008` 保持 `blocked/pending`；required port 不等于上游真实 client、DTO 或正向集成已存在。
- 图示门禁：概要书写规范要求本章禁止画图；本步不产图。

## 2. 本步输入

| 输入 | 使用范围 |
|---|---|
| `02_hld_step_01_upstream_boundary.md` | 上游关系、本文不再回答/必须回答、可承接上限和 exact-contract blocker。 |
| 正式 `00-需求文档.md` §2、§4、§7、§9～§16 | Runner 定位、核心能力、红线、数据、依赖、NFR、验收与 `RUN-UP-001~008`。 |
| 正式 `01-架构设计.md` §2～§17 | 架构目标、六个语义上下文、运行承载、依赖角色、所有权、多轴状态、演进和 ADR。 |
| 概要 SOP Step 2 / 书写规范 §4.2 | 本步五个问题、两张必需表、深度口径及禁止事项。 |
| 旧 `02-概要设计.md`、README、`draft/` | 后置冲突/遗漏扫描；不得提供新版目标、模块数、对象名或技术结论。 |

## 3. SOP 问题回答

### 3.1 本次概要设计最主要要把哪些结构说清

1. 把正式 01 的语义上下文、运行承载和依赖角色转译为代码主体骨架，证明入口、应用编排、核心语义、外部接缝和技术承载之间的依赖方向，而不直接写源码目录。
2. 形成稳定的主要组成部分、职责、不承担职责、capability、对象发现线索和关键接缝，使显式选择、authority 承接、取得/验证、受控请求、生命周期、资源/清理/恢复、预览/诊断/handoff 都有结构归属。
3. 形成 Runner-owned local truth、owner snapshot/ref、local observation 和 derived view 的关键对象骨架，防止 `RunnerRun` 或任一展示对象成为第二个上游 truth。
4. 形成逻辑页面/入口、Command、Query、Inbound Consumer、Outbound Event、Operations Job 和 required port 的概要骨架，使 GUI、CLI 或其他入口共享同一门禁，同时不虚构 exact SDK/API。
5. 形成显式 immutable 选择、authority/材料资格、下载/cache/验证、Sandbox 正式请求、启动/停止/清理、资源冲突、输出预览、失败诊断、安全 handoff 和断线恢复的关键处理流骨架。
6. 形成选择、取得、资格、请求、boundary、execution、control、cleanup、diagnostic、handoff 和 connectivity/reconcile 等多轴状态及来源传播轮廓，持续守住 `accepted != running`。
7. 说明异常、配置影响、跨平台差异、测试切口、证据边界和详细设计承接点，但不进入配置值、测试用例或实施任务。

### 3.2 本轮应停在什么深度

本轮停在“可实现结构骨架”而非“完整实现合同”：

- 可以点名正式代码主体、主要组成部分、逻辑页面/入口、关键对象、接口类别、处理流、状态主语、required port 与 adapter 责任。
- Step 6 可给关键字段骨架并标注类型，Step 6～8 可给成员/工厂/处理函数骨架且参数带类型；不得写完整语言签名、schema 或实现。
- Step 7 可区分 Command、Query、Consumer、Event、Job、port/adapter；不得写 API path、真实 SDK 方法全集、DTO/event payload 或 transport 细节。
- Step 8 可写阶段、输入输出、关键调用主语、side-effect 边界和失败出口；不得写完整调用链、事务脚本或伪代码实现。
- Step 9 可写状态集合、含义、来源和允许/禁止流转方向；完整迁移矩阵、错误枚举和断言留给 03。
- Step 11 只识别配置影响与禁止配置化边界；配置 key、默认值、profile 和加载/校验合同留给 03/04。
- Step 12 必须交出模块、页面、命令、对象、adapter、流程、状态、资源/清理一致性、配置、测试切口与证据边界的详细设计清单；不写测试结果或实施状态。
- 对未闭合上游只定义 Runner required seam、阻塞姿态与安全失败，不能把本地需要的合同写成 owner 已提供的真实 surface。

### 3.3 哪些内容属于本次概要设计范围

- 新版 14 章概要主链及各章到 calibration Step 的可追溯关系。
- 架构语义到代码主体、主要组成部分和实现分层的映射。
- 核心运行闭环的对象候选、正式对象骨架、接口骨架、关键处理流和状态传播。
- 逻辑页面/入口与 GUI、CLI、SDK/产品调用方共享应用门禁的结构关系；不选具体壳或前端框架。
- 本地选择/世代、运行/控制意图、下载/cache/quarantine、验证姿态、资源观察、恢复 cursor/generation、展示和诊断姿态的实现骨架。
- Artifact/Governance/Work/Runtime/Sandbox/Observability/Archive 的 safe ref/snapshot 与 required port/adapter 边界；正向 exact contract 按 blocker 挂起。
- local probe 与 owner allocation/lease/cleanup 双视图、材料保护、unknown 冻结、对账/manual-review 和跨平台体验骨架。
- redaction-first、body-bounded 预览、失败分类、diagnostic/handoff posture 及“本地材料非正式证据”的结构边界。
- 异常轮廓、配置影响、详细设计承接、概要风险与待确认项。
- 批量预取、多运行比较和 Archive 浏览只保留条件性扩展边界与风险归属，不进入当前核心闭环成功判定。

### 3.4 哪些相关内容当前不进入概要设计范围

- 需求目标、用户故事、功能需求、业务规则、验收标准和架构 ownership/子域/技术取舍的重新定义。
- 相邻 owner 的 Release/approval/execution/isolation/lease/cleanup/evidence/archive 正文、生命周期和 exact contract 设计。
- 完整字段模型、函数签名、协议 schema、数据库/索引/事务、代码目录和实现算法。
- 具体语言、Tauri/Electron、数据库、HTTP/RPC/MQ、Docker/gVisor/Firecracker、进程/部署拓扑和固定平台参数的选择。
- 配置项、默认值、密钥、环境变量、部署参数与运维操作。
- 完整测试矩阵、fixture、测试执行、验收证据、readiness 或 signoff。
- 实施阶段、commit boundary、implementation ledger、planned boundary skeleton、实现仓或 commit。
- 生产部署、公网分享、源码编辑/调试/同步，以及无当前需求与 owner 合同支撑的外围功能全面展开。

### 3.5 哪些内容留给详细设计及后续文档

- `03`：模块/逻辑页面/命令映射、对象完整合同、函数/API/port/adapter 详细合同、处理时序、状态矩阵、存储与事务边界、资源/清理一致性、错误映射和测试 seam。
- `04`：配置结构、来源、优先级、默认值、校验、敏感项、平台 profile 和禁止配置化检查。
- `05`：真实/替身边界、单元/合同/集成/端到端/故障/跨平台测试方案、用例与证据采集方法。
- `06`：验收 gate、证据要求、失败条件和签署边界；不得把本地日志或 ACK 作为正式证据。
- `07`：实施阶段、planned/blocked/waiting boundary skeleton、commit gate 和 implementation ledger；只有完成正式 07 时创建。
- 相邻 owner / SDK：`RUN-UP-001~008` 对应的 locator、authority、request/status/cleanup/reconcile、diagnostic/handoff、archive 与 exact client 合同。
- 架构重开：若后续要锁定会改变当前 ADR 的语言、桌面壳、进程模型、存储、协议或 Sandbox backend，必须先回到有 authority 的架构/ADR 层重新核验。

## 4. 当前文档问题诊断

| 问题 | 对本步的影响 | 本轮处置 |
|---|---|---|
| 旧 02 以 queue、run card、retry/replay、capability hint 等运行体验叙事为主 | 会把 Runner 错写成对既有 execution 的聚合 UI，遗漏显式 Release、资格、下载/验证、Sandbox 请求和清理恢复主链 | 不继承旧目标与章节；从正式 00/01 的核心闭环重新定义结构范围。 |
| 旧 02 把 `RunnerRun`、queue、output、hint 等旧对象直接当主语 | 可能压平不同 owner 状态并提前固定对象 | 只作对象遗漏线索；必须等 Step 5 capability 候选池和 Step 6 正式化。 |
| 旧文档/README 含 retry/replay/kill、capability-hub、共享 Sandbox 实现和本地日志回传等表述 | 可能越过正式控制、SDK、Sandbox 与 Observability 边界 | 排除出当前结论；未来只有正式 owner seam 支撑时才可重新进入。 |
| README 固定 Rust/Tauri/Docker/gVisor/Firecracker、目录和性能数字 | 会把历史技术与无 authority 数字伪装为概要范围 | 全部保持 historical；本轮只设计可替换承载与结构门禁。 |
| draft 已列 10 个模块、若干对象、port 和页面 | 覆盖面有价值，但模块数和命名尚未经新版概要 Step 推导 | 仅做后置遗漏扫描；Step 4～9 重新推导，不自动继承。 |
| 上游 exact contract 仍 blocked/pending | 若完全跳过会使概要不可落码，若脑补会伪造 readiness | 采用 required seam + blocked positive adapter + fail-closed 分支，二者明确分离。 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 目标主线 | 统一 run/queue/control/output/hint 的产品体验 | 从显式 immutable Release 选择开始，覆盖资格、取得、受控运行、清理恢复和安全诊断的可实现结构。 |
| 结构深度 | 偏新人解释和页面体验，无法稳定承接 03 | 固定为代码主体、组成部分、对象、接口、流程、状态与详细设计交接骨架。 |
| 上游缺口 | 容易把系统名或 ACK 当成已存在接缝 | required seam 与真实 adapter readiness 分开，所有缺口保留 blocker。 |
| 技术范围 | 历史框架/backend/数字可能直接继承 | 具体产品与参数不进入 02；只有不依赖产品的结构和禁止边界进入。 |
| 模块划分 | 旧五部分或 draft 十模块可被误当定论 | Step 2 只锁 coverage，组成部分数量和命名留 Step 4～5 推导。 |
| 下游交接 | 泛称“支撑详细设计” | 明确交付模块、页面、命令、对象、adapter、流程、状态、配置、测试切口和证据边界。 |

## 6. 设计取舍

| 方案 | 收益 | 风险 / 代价 | 结论 |
|---|---|---|---|
| 按 `FR-RUN-*` 重列功能范围 | 追溯直观 | 退化为需求续写，不能形成实现主语 | 不采用。 |
| 直接继承旧五部分或 draft 十模块 | 推进快 | 未经代码主体/capability/对象推导，容易固化错误边界 | 不采用；只作遗漏扫描。 |
| 因上游合同未闭合而停止全部概要设计 | 避免猜测正向 API | 本地结构、负向门禁和所需接缝也无法收稳 | 不采用。 |
| 本地可实现骨架 + required seam + blocked positive adapter | 可继续设计本地结构且不伪造 owner surface | 必须持续区分“需要”与“已有” | 采用。 |
| 以 GUI 页面或 CLI 命令作为结构主轴 | 产品入口直观 | 多入口会分叉业务门禁，UI 反向定义核心 | 不采用；逻辑入口依赖共享编排/核心语义。 |
| 核心闭环完整展开、外围能力只保留条件性扩展点 | 守住最小运行主线和真实 blocker | 外围体验暂不完整 | 采用。 |

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳双轴代码主体框架 | 把六个业务语义方向与入口、编排、核心、外部接缝、技术承载分层正交表达，避免把架构子域直接等同源码模块。 | 可继续展开模块/包边界、依赖规则、application facade、domain service、port/adapter 和本地承载。 |
| 收稳主要组成部分及 capability 边界 | 每个组成部分须说明职责、不承担职责、输入输出、关键接缝、对象发现线索和逻辑入口，数量与命名由后续 Step 推导。 | 可按组成部分展开对象合同、页面/命令承接、模块内协作和跨部分不变量。 |
| 收稳显式选择与资格承接骨架 | 让 context、immutable Release/version、scope、selection generation、authority/source binding 有清晰本地主语，且不本地批准。 | 可展开选择/资格对象、查询/确认命令、owner-safe ref、资格 flow、失效状态和 required ports。 |
| 收稳取得、cache 与完整性骨架 | 区分 locator、传输、quarantine、验证、qualified promotion、保护和淘汰，禁止 cache/传输完成替代资格。 | 可展开下载任务、cache/verification 对象、后台 job、本地 adapter、晋级流程与保护不变量。 |
| 收稳受控请求与生命周期骨架 | 区分 intent、submitted、accepted、boundary、running、terminal、control result，运行事实始终回指 Sandbox/Runtime owner。 | 可展开请求/控制命令、required Sandbox/Runtime ports、生命周期 flow、多轴状态与幂等/对账切口。 |
| 收稳资源、清理与恢复骨架 | 分离 local probe 与 owner allocation/lease/cleanup，覆盖冲突、材料保护、stop/cleanup、断线、重启、orphan 和 manual-review。 | 可展开资源/保护/恢复对象、平台 adapter、cleanup/reconcile flow、危险副作用冻结和一致性边界。 |
| 收稳预览、诊断与安全交接骨架 | 输出与失败解释必须 redacted、bounded、带来源/freshness；handoff 姿态不成为 evidence/verdict。 | 可展开 preview/diagnostic view、handoff intent/receipt、redaction port、失败分类 flow 和证据边界。 |
| 收稳多入口与跨平台产品骨架 | 逻辑页面、CLI/SDK/产品入口共用同一 application/domain 门禁；平台差异只经 adapter 进入本地观察。 | 可展开页面/命令/use-case 映射、view model、生命周期/资源 adapter 和一致的 restricted/unknown 展示。 |
| 收稳接口、流程与状态闭环 | Command/Query/Consumer/Event/Job/port 必须回指对象与处理流；状态必须标注 owner/source 和允许/禁止传播。 | 可展开 typed 接口、函数调用链、状态矩阵、错误映射、side-effect inventory 与测试切口。 |
| 收稳配置、风险和下游交接边界 | 指出哪些结构受配置影响、哪些红线不可配置化，并把 blocker、测试 seam 和证据边界交给后续文档。 | `03/04/05/06/07` 可分别展开详细合同、配置、测试、验收和实施边界，不必重造概要主语。 |

### 7.2 非范围表

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、功能需求、业务规则、NFR 与验收标准重写 | 正式 `00-需求文档.md`；变化需重开需求校准。 |
| 系统上下文、ownership、限界上下文、依赖方向、运行承载、架构技术取舍和 ADR 重写 | 正式 `01-架构设计.md`；变化需重开架构校准。 |
| Release/Artifact、Governance、Project/Work、Runtime、Sandbox、Observability、Archive 的 truth 与 exact service contract | 对应相邻 owner；Runner 只定义消费所需 seam。 |
| L0-sdk 的具体 client 版本、方法、DTO、error/redaction/trace schema | `L0-sdk` 正式合同与 `RUN-UP-008` 关闭结果。 |
| 完整对象字段、函数签名、API/DTO/event schema、状态矩阵、调用时序、错误枚举、repository/transaction/DDL | `03-详细设计.md`。 |
| Tauri/Electron、语言、数据库、协议、进程模型、Docker/gVisor/Firecracker 等产品选择及固定资源/性能数字 | 有 authority 的架构/ADR 重核后，由 `03/04/07` 承接；Sandbox backend 归 Sandbox owner。 |
| 配置 key、默认值、profile、环境变量、密钥、加载顺序、部署参数与操作手册 | `04-配置设计.md` 及运维层。 |
| 完整测试矩阵、用例、fixture、压测、真实集成结果、evidence alias 或测试通过结论 | `05-测试方案.md`；真实结果只能来自未来执行。 |
| 验收 gate、正式证据、verdict、signoff 和 readiness | `06-验收标准.md` 及未来正式验收。 |
| 实施 phase、commit boundary、implementation ledger、planned boundary skeleton、实现仓与 commit | `07-实施计划.md`；只在完成正式 07 时创建规定产物。 |
| 批量预取、多运行比较、Archive 浏览的完整对象/API/流程/状态设计 | 当前只保留条件性扩展边界；须有明确需求与 owner 合同后重开相应设计。 |
| 生产部署、公网分享、代码编辑/调试/源码同步和上游 truth 修复 | 当前产品/架构非目标或相邻 owner。 |

### 7.3 当前阶段设计深度口径

1. `02` 必须让 `03` 可以直接按稳定主语展开，不能只给概念说明、页面愿望或功能清单。
2. `02` 必须覆盖代码主体、主要组成部分、逻辑页面/入口、关键对象、接口、处理流、状态、异常、配置影响、测试切口和证据边界；但各项只到概要骨架。
3. 关键字段必须标注类型，函数骨架参数必须标注类型；完整 schema、语言签名、不变量实现和持久化细节留给 03。
4. required port/adapter 可以正式命名，但必须同时标明来源 owner、能力要求、失败姿态和 blocker；不得声称真实 SDK/client 已存在。
5. 所有正向流程都必须有 blocked/unknown/stale/conflict/restricted 分支，且 query/refresh/render/reconnect 不得暗含副作用。
6. 逻辑页面和命令可以在 Step 5 起进入组成部分结构，但不锁 Tauri/Electron/Web/CLI-only，也不允许入口绕过共享门禁。
7. 资源和跨平台设计只定义能力、观察、责任及 adapter 轮廓，不固定 OS 数值、抢占策略或 Sandbox backend。
8. 配置只描述影响面与不可配置化红线；测试只描述 seam/切口与证据边界；实现、测试结果和 readiness 均不在本轮。

### 7.4 Blocker 对当前范围的限制

| Blocker | 本轮允许收稳 | 本轮禁止宣称 |
|---|---|---|
| `RUN-UP-001~002` | 选择/资格/下载/验证所需对象、required seam、阻塞与失效流程 | locator/manifest/authority API、算法或 approved/baselined 正向路径已可用。 |
| `RUN-UP-003~004` | 请求/控制/状态/cleanup/reconcile required seam、多轴状态与 unknown 保护 | Sandbox/Runtime adapter、running/terminal/cleanup 正向集成已闭合。 |
| `RUN-UP-005~006` | 安全预览、diagnostic/handoff 与条件 Archive ref 边界 | 本地日志为 evidence，handoff/archive 正向闭环已成立。 |
| `RUN-UP-007` | local probe/owner allocation 双视图、冲突和平台 adapter 责任 | 固定资源参数、自动抢占、cleanup ownership 已统一。 |
| `RUN-UP-008` | SDK-first adapter 隔离、required client/error/redaction/trace 能力 | 具体 SDK 方法、版本、schema 或真实 client readiness。 |

## 8. 复杂度判断与图示说明

- 本步只确定范围，不需要对象附录、接口附录或按主要组成部分拆分；这些从 Step 5～9 串行展开。
- 本章按规范禁止画图；目标表、非范围表和深度口径已足够表达边界，避免用范围图提前固化组成部分数量。
- 旧五部分、draft 十模块和正式 01 六个语义上下文都不能在本步直接变成最终代码模块计数。

## 9. 回填草稿

正式 §2 将：

1. 使用 §7.1 的设计目标表作为主体，必要时合并相近行但不丢失代码主体、组成部分、入口、对象、接口、流程、状态、资源/恢复、诊断和下游交接覆盖。
2. 使用 §7.2 的非范围表，明确每项归属层次，不使用“以后再看”式表述。
3. 摘录 §7.3 作为当前阶段设计深度说明，并明确 required seam 不等于真实 adapter 可用。
4. 不复制 SOP 问题回答、旧材料诊断、方案比较或 blocker 全表；这些保留在本文件供追溯。

## 10. 待确认事项

| 项目 | 当前口径 | 是否阻塞 Step 3 |
|---|---|---|
| 主要组成部分数量和正式命名 | Step 2 只锁 coverage；Step 4～5 从双轴框架和 capability 推导，不继承旧 5 / draft 10。 | 否 |
| 逻辑页面与命令清单 | 必须进入后续概要骨架，但由组成部分和 use case 推导，不在本步提前枚举定稿。 | 否 |
| 上游 exact contracts | `RUN-UP-001~008` 持续开放；正向 adapter 保持 blocked/pending。 | 否；限制正向结论 |
| 技术产品与跨平台 profile | 不从 README 继承；若改变架构决定须重开相应层。 | 否 |
| 外围能力展开深度 | 当前仅条件性扩展边界，不进入核心对象/API/状态主线。 | 否 |

## 11. 进入下一步条件

- [x] 已明确本轮概要设计要收稳的结构目标及交给 03 的结果。
- [x] 已明确当前范围、非范围及每个非范围项的归属层。
- [x] 已明确概要层与详细设计、配置、测试、验收、实施层的深度边界。
- [x] 已明确 blocker 只允许 required seam / 安全失败设计，不允许伪造正向合同。
- [x] 未提前确定主要组成部分数量、对象字段、接口 schema、处理流步骤或状态矩阵。
- [x] 未修改正式 `02-概要设计.md`，未创建 Step 3 文件，未实现或测试。

结论：`gate_status=pass`，允许串行进入 Step 3“收稳约束条件”；正式 02 仍不可写。
