## Step 1. 确认上游输入边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 1
- 回填章节：正式 `02-概要设计.md` §1「与上游文档的关系声明」

#### 1.1 Step 内计划

- [x] 读取项目台账、02 flow、概要设计 SOP/书写规范与中间产物规范
- [x] 读取正式 `00-需求文档.md`、`01-架构设计.md` 及专项上游边界
- [x] 逐项回答 SOP 问题
- [x] 诊断旧 `02`、README、本仓 draft 与 `L1-workspace/draft` 的历史污染
- [x] 形成上游关系映射、本文不再回答/必须回答清单
- [x] 形成回填草稿并完成三层门禁自检

### 2. 本步输入

- 上游文档：
  - `projects/L5-console/00-需求文档.md`（正式、`formal / stop_review`）
  - `projects/L5-console/01-架构设计.md`（正式、`formal / stop_review`）
  - `standards/document/概要设计讨论流程_SOP.md`
  - `standards/document/概要设计书写规范.md`
  - `standards/document/设计文档讨论中间产物规范.md`
  - `standards/document/设计文档编写通则.md`
  - `standards/document/设计真相源闭环与可落码性标准.md`
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-sdk/` 与指定 L1～L4 owner 的当前正式设计资料及必要台账
  - `projects/L5-console/design-calibration/console_workspace_draft_reference_audit.md`
- 历史材料：
  - 旧 `projects/L5-console/02-概要设计.md`、`README.md`
  - `projects/L5-console/draft/01_项目作用与交互对象.md`、`02_功能推演.md`、`03_模块划分与分层.md`
  - `projects/L1-workspace/draft/` 三篇 pre-calibration draft
- 已确认结论：
  - Console 只拥有客户端交互 truth：会话壳、导航、筛选/布局、草稿、请求经历、错误/恢复、可访问性呈现和有限偏好。
  - 成员、项目、流程、治理、制品/evidence、Workspace、方法、能力、观测、归档和 sandbox truth 保持各 owner 单一归属。
  - 所有业务 query/command/result/ref 必须经 `L0-sdk` 或正式服务边界；客户端只可收紧正式决定。
  - 来源、多轴状态、空/缺失/裁剪/过期/不可用/冲突/unknown 和请求经历/正式结果必须保真。
- 依赖的前序 Step：无。本步是 02 的第一个 Step。

### 3. SOP 问题回答

1. **当前概要设计要承接哪些需求结论？**

   承接正式 `00` 的定位与边界、C-CON-1～6 能力闭环、核心/外围功能、业务规则、数据归属、接口依赖、行为级 NFR、验收否决项、风险和 `CON-Q-034～047`。这些内容只作为结构下沉输入，不在 02 重写用户故事或验收。

2. **当前概要设计要承接哪些架构结论？**

   承接正式 `01` 的客户端边界、限界上下文、实现承载、依赖方向、数据所有权、一致性策略、交互通信、横切安全、局部降级、渐进激活与 ADR 候选。02 将其转译为主要组成部分、代码主体、对象、接口、处理流和状态机骨架。

3. **哪些输入已经足够稳定，可以直接展开？**

   Console-owned 交互事实与 owner-safe 引用的分界、SDK-only 访问红线、fail-closed 与局部降级、不生成跨域 verdict/readiness、forbidden-body 零进入、草稿/受理/正式结果分层、显式重验基线和可访问等价路径已经足够稳定，可作为后续骨架的硬输入。

4. **哪些相关结论仍未收稳？**

   各 owner exact query/command/result/ref、activation、tenant/organization/project scope、visibility/reason/redaction/safe-field、reconciliation/幂等、客户端状态介质与生命周期、性能/可用率/兼容矩阵、诊断 envelope 及未停审 L5/L6 link/ref 合同仍未闭口。它们只能以 `pending/blocked/read-only/partial` 进入后续 Step。

5. **哪些边界会决定概要设计当前不该展开到哪里？**

   不能展开 owner 的领域对象字段、服务端规则、数据库/repository、私有 bus、BFF、跨域 projection/cursor/rebuild、完整协议 schema、框架目录、函数实现、部署参数或验证事实。不能把 `ConsoleWorkspace`、`PanelState`、`UnifiedDashboard` 等历史候选升级为服务端 truth。

### 4. 当前文档问题诊断

| 材料/位置 | 诊断 | 对 02 的影响 |
|---|---|---|
| 旧 `02-概要设计.md` §1～§3 | 以“统一工作台/多面板/quick action/dashboard”叙事展开，重复需求和架构，缺少新版 14 章与校准来源 | 必须 full-restart，不能沿用章节或固定数字 |
| 旧 `02` §4～§7 | 将布局、面板、action、summary 和 permission hint 写成近似产品/服务对象，且混入 runtime、analytics 和固定 SLA | 只能保留“客户端交互主语”候选，重新按代码主体/对象/接口边界收敛 |
| 旧 README | 暗含技术框架、Provider Contract、固定控制/指标集合及跨产品私有状态 | 全部作为 historical_material 污染审计，不作为输入 |
| 本仓 `draft/` | 已改善 owner 边界，但仍使用候选能力名、页面模型和未核验的接口/状态 | 只能参考粒度；需由正式 00/01 重新验证 |
| `L1-workspace/draft/` | 粒度细、含 projection/cursor/rebuild/Inbox 等 Workspace 服务侧主语 | 只迁移 source/view 分离、visibility-first、pending 记录方式；不迁移对象和协议 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 权威顺序 | 旧 02、README、draft 与上游混用 | 当前用户指令 > 本仓校准产物 > 正式 00/01 > 已停审专项上游 > draft/旧文档 | 防止历史材料反向定义真相 |
| Console 主语 | 工作台、面板、dashboard 容易被当成跨域模型 | 客户端交互 truth、owner-safe view/ref、受控意图呈现 | 与 00/01 的边界一致 |
| 外部依赖 | 可被旧 API/Provider/技术栈补齐 | 只保留能力级 SDK/正式服务接缝，精确合同 pending | 不伪造集成或 ready |
| 02 深度 | 背景与页面叙事先行 | 后续按代码主体→组成部分→对象→接口→流→状态下沉 | 符合概要设计 SOP |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 沿用旧 02 作为主体 | 可快速复用长文 | 混入历史 truth、固定数字和实现泄漏，无法追溯 | 不采用 |
| 以本仓 draft 直接升级 | 边界已较清楚，写作成本低 | draft 的候选对象、页面模型和 pending 尚未逐项正式化 | 不采用，仅作诊断/粒度参考 |
| 以正式 00/01 为唯一结构输入，旧材料后置审计 | 边界干净，能逐步承接可落码骨架 | 需重建 14 个 Step 产物和正式正文 | 采用 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 | 已收稳的承接内容 | 02 继续展开什么 |
|---|---|---|
| `projects/L5-console/00-需求文档.md` | C-CON-1～6、FR/BR/DR/IF/DEP/NFR/AC/VETO 与待确认事项 | 将需求闭环转为客户端代码主体、组成部分、对象、接口、流程、状态和配置影响 |
| `projects/L5-console/01-架构设计.md` | 交互边界、上下文、运行承载、依赖方向、数据所有权、一致性、通信和横切红线 | 将架构责任映射为可实现结构骨架，不重开架构取舍 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | Layer 5 并行窗口、compile/runtime/event/ref/adapter/fake 分类 | 只裁剪本仓相关 owner 接缝，不复制全局矩阵 |
| `projects/L0-sdk/` | 官方访问、query/command/result/ref 和共享安全语义入口 | 形成 SDK adapter/边界骨架；不写未核验方法或 schema |
| L1 identity/work/process/governance/artifact/workspace、L2 member-service | 各 owner 的 truth、safe view/ref、Policy/Gate 与生命周期边界 | 形成 owner-partitioned query/command seam；不复制 owner 对象 |
| L3 method-library/capability-hub、L4 observability/sandbox/archive | 方法、能力、观测、归档、sandbox 的安全消费与条件化入口 | 形成主题适配和局部降级边界；未闭口内容保留 pending |
| `console_workspace_draft_reference_audit.md` | 权威顺序、Workspace draft 不可迁移清单和污染入口 | 作为后续 Step 的历史差异审计线索 |

#### 7.2 本文不再回答

- 不再定义需求目标、用户故事、功能 ID、验收标准或 NFR 数值。
- 不再重做系统上下文、子域、部署形态、技术选型、ADR 或架构取舍。
- 不再定义 identity/member、project/work/process、governance/Policy/Gate、artifact/evidence、workspace、method、capability、observability、archive 或 sandbox 的 truth、生命周期和服务端规则。
- 不在 02 中决定具体 SDK 方法、HTTP/RPC path、DTO schema、数据库、repository、私有 bus、前端框架、目录结构或部署参数。
- 不把未停审 L5/L6 项目的页面、接口、指标或私有状态当作当前真相。

#### 7.3 本文必须回答

- Console 的业务主要组成部分如何区别于实现分层。
- 各部分承担哪些客户端交互 capability、对象候选和关键接缝，并明确不承担什么。
- 哪些 Console-owned 交互对象、owner-safe reference/view 和状态标记需要在概要层点名。
- Query、受控意图、结果回查、失效/重验和可访问恢复如何形成接口与处理流骨架。
- 多轴 view/status、草稿/受理/正式结果、unknown/blocked/fail-closed 如何保持状态分离。
- 配置只能影响哪些接缝、哪些权限/真相/审计/一致性红线绝不配置化。

### 8. 回填草稿

正式 §1 仅保留上游关系映射、`本文不再回答`、`本文必须回答` 和依赖完成上限；不复制本 Step 的诊断、取舍或历史清单。正式章首应链接本文件的“结构化中间产物”“回填草稿”“待确认事项”。

### 9. 待确认事项

- `CON-Q-034～047` 继续作为后续 Step 的输入 blocker；本步不关闭任何一项。
- 专项上游是否提供可供 Console 使用的 exact surface、safe-field 和 activation，需由后续接口/流程 Step 逐项核验。
- 当前没有阻塞进入 Step 2 的输入缺口；缺口只限制后续精确度，不允许以历史材料补齐。

### 10. 进入下一步条件

- 上游关系映射、本文不再回答/必须回答清单已形成并可追溯。
- 旧 02、README、draft 与 Workspace draft 的历史污染已单独登记，未被升级为正式结论。
- 已明确 pending 只限制精确合同和正向激活，不阻塞客户端骨架讨论。
- 三层门禁：项目台账指向 Step 1；02 flow 允许 Step 1；本文件状态为已确认。满足后进入 Step 2。
