# L5-chat 架构 Step 16：正式文档整理与停审

> 文档：`01-架构设计.md`  
> 模式：`full-restart + single-agent-serial`  
> 本 Step 只做已确认结论的装配、术语统一、历史差异审计和静态一致性审计；不新增架构判断，不实现代码，不执行测试，不提交 commit。

## 1. Step 开工确认

| 检查项 | 结果 | 依据 |
|---|---|---|
| 项目级门禁 | `pass` | `design-calibration/project_execution_ledger.md` 允许在正式 `01` 内继续，且要求完成后停审。 |
| 文档级门禁 | `pass` | `01_architecture_calibration_flow.md` 中 Step 1～15 均为 `done/pass`，Step 16 为当前执行项。 |
| Step / 模块级输入 | `pass` | Step 1～15 均有独立中间产物、回填草稿和停审记录；Step 15 已完成跨架构单元总审计。 |
| 正式文档处理方式 | `rebuild` | 旧 `01-架构设计.md` 仅作 `historical_material`；按规范先删除，再建立新文件。 |
| 文档切换门禁 | `stop_after_01` | 正式 `01` 完成后立即停审，不进入 `02-概要设计.md`。 |

## 2. Step 内计划

| 顺序 | 计划项 | 可审查产物 | 门禁 |
|---|---|---|---|
| 1 | 读取 Step 1～15 回填草稿和规范主链 | 本文件 §3、§4 | 所有正式章节均能找到来源文件。 |
| 2 | 审计旧正式文档的历史口径 | 本文件 §5 | 旧指标、协议、对象、职责和上线结论不直接进入新文档。 |
| 3 | 建立章节回填与术语映射 | 本文件 §6、§7 | 章节顺序为规范 §1～§18；术语与 owner 边界一致。 |
| 4 | 删除旧文件并分批重建正式 `01` | `projects/L5-chat/01-架构设计.md` | 只写 Step 1～15 已通过结论；不写实现细节。 |
| 5 | 静态一致性、来源、blocker 和范围审计 | 本文件 §8～§10、flow、ledger | 无新结论、无伪造证据、只修改本项目；通过后停审。 |

## 3. 正式章节来源矩阵

| 正式章节 | 主要校准来源 | 装配口径 |
|---|---|---|
| 文档元信息 | `01_architecture_calibration_flow.md`、Step 16 本文件 | 标明设计完成/停审语义、当前范围和 historical 规则；不宣称实现或 readiness。 |
| §1 与上游文档的关系声明 | `01_arch_step_01_requirements_baseline.md`、`project_execution_ledger.md` | 只写来源层级、owner 关系和本文架构细化范围。 |
| §2 业务背景与驱动力 | `01_arch_step_01_requirements_baseline.md`、`01_arch_step_02_arch_goals_constraints.md` | 承载结构性驱动力和架构目标，不写具体技术方案。 |
| §3 约束条件 | `01_arch_step_01_requirements_baseline.md`、`01_arch_step_02_arch_goals_constraints.md` | 合并硬约束、阶段取舍、非目标和未关闭前提。 |
| §4 职责边界 | `01_arch_step_03_responsibility_boundary.md` | 使用做/不做/易混淆职责和边界红线。 |
| §5 系统边界与上下文 | `01_arch_step_04_system_context.md` | 使用正式上下文图、输入/输出面和失效降级。 |
| §6 限界上下文与子域划分 | `01_arch_step_05_bounded_context_subdomains.md` | 使用核心、支撑、本地投影三层分类及 A～G 架构单元。 |
| §7 容器 / 部署架构 | `01_arch_step_06_container_deployment.md` | 使用 Desktop-first 运行单元和 shell/core/SDK/owner 关系；候选载体保持候选。 |
| §8 依赖方向与层间约束 | `01_arch_step_07_dependency_direction.md` | 使用层次、裁剪表、分类表、禁止依赖和依赖图。 |
| §9 数据所有权与一致性策略 | `01_arch_step_08_data_ownership_consistency.md` | 使用 Chat-local truth、safe projection/ref、禁存正文和一致性层次。 |
| §10 关键交互与通信方式 | `01_arch_step_09_key_interactions_communication.md` | 使用同步、异步、后台三类交互及失败/挂起语义，不下沉协议 schema。 |
| §11 关键技术选型 | `01_arch_step_10_key_technology_selection.md` | 写架构机制；React/TypeScript、Tauri、Web、Mobile 等载体保持候选。 |
| §12 备选方案与取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | 写结构性路径、自研/开源边界和当前牺牲，不把候选变成实现事实。 |
| §13 横切关注点 | `01_arch_step_12_cross_cutting_concerns.md` | 写安全、审计、观测、韧性、性能口径、配置和适用矩阵。 |
| §14 演进路线 | `01_arch_step_13_evolution_roadmap.md` | 写当前阶段、可接受/不可接受债务和事实触发条件；不写上线计划。 |
| §15 风险与待确认事项 | `01_arch_step_14_risks_open_questions.md` | 保持风险与待确认分离，原样保留 inherited blocker 的 pending/blocked/deferred 姿态。 |
| §16 需求追溯矩阵 | `01_arch_step_15_adr_traceability.md` | 使用已审计的来源—架构承接矩阵和追溯漏项。 |
| §17 ADR 索引 | `01_arch_step_15_adr_traceability.md` | 只索引八项长期架构决定，不把普通实现选择写成 ADR。 |
| §18 参考 | 本项目正式 `00`、全局规范、当前 owner 正式文档和 Step 产物 | 仅列正式参考入口，不重复 ADR 或追溯矩阵。 |

## 4. 正式装配的统一术语

| 统一术语 | 采用含义 | 禁止混用 |
|---|---|---|
| `L5-chat` / Chat | Desktop-first 的跨平台协作客户端产品 | “服务端 Chat”“聊天后端” |
| Chat-local truth | route/context、selection/focus、draft、local intent/attempt、recovery context 和本地平台/可访问状态 | owner truth、共享 projection |
| safe view / summary / ref / preview | owner 经正式 SDK seam 提供的最小可展示材料 | 复制 owner DTO、正文或私有查询结果 |
| formal change / resume | SDK 提供的正式变化与连续性承接 | websocket/AG-UI ACK、内部 bus 事件 |
| confirmed | owner receipt/result/change 已满足业务结果门控 | 点击、toast、transport ACK、缓存命中 |
| unknown | 结果无法安全判断，需要查询、等待或人工处理 | 自动重放副作用 |
| owner | 对应领域正式真相的项目 | Chat 本地 store、页面组件 |
| shell | Desktop/Web/Mobile 的平台承载层 | 业务语义层 |

## 5. 旧正式文档 historical 差异审计

旧文件 `projects/L5-chat/01-架构设计.md` 不直接继承。审计结论如下：

| 历史口径 | 处理 | 原因 |
|---|---|---|
| 旧文档只有 17 章，且章节顺序与当前规范不同 | 删除后按规范 §1～§18 重建 | 旧结构不能继续约束本轮正式结果。 |
| 将 Chat 描述为持有或编排 Conversation、Gate、Project、Artifact 等业务对象 | 删除，改为 owner-safe 消费和客户端显化 | 违反当前职责、数据所有权和 SDK-only 边界。 |
| AG-UI 17、SSE/WS 双持、`last_event_id`、`event_id` 等被写成正式协议或实现机制 | 删除具体协议结论；只保留正式 change/resume、同步/异步/后台通信类别 | 上游 SDK/owner surface 尚未闭合，旧协议不是当前 authority。 |
| `<500ms`、`<2s`、`99.9%`、500+、10w 等指标被写成架构事实 | 删除固定数值；保留性能/容量 authority 缺口和待确认项 | 当前缺正式工作负载、平台矩阵和验收证据。 |
| `Member Lens`、`WorkTreeView`、`ImplementationPlanView`、`Inbox` 等旧对象名被写成正式上下文 | 用“安全语境与导航”“owner-safe 材料镜像”“本地展示与恢复投影”等已停审术语替代 | 避免把未确认产品对象提升为领域模型。 |
| 旧文档写“前端交互留痕进入 observability”并暗示直接管道 | 改为低敏诊断意图经正式 SDK/handoff；不直订内部 bus | Observability backend 归 L4 owner。 |
| 旧文档把 Gate 提交幂等写成 `gate_id + actor_id`，并把重试视为可自动补偿 | 删除具体键和自动补偿承诺；保留 receipt/result、unknown、受控探测和不盲目重放 | Governance exact contract 尚未闭合。 |
| 旧文档含灰度、回滚、监控指标和“目标架构”宣传性结论 | 删除，不进入架构 §14 或 §18 | 这些内容未在本轮 Step 1～15 中确认，且会伪造实施/readiness。 |
| 旧 ADR `ADR-0009`、`ADR-0011` 与其他项目概念混用 | 删除；采用 Step 15 已停审的 `ADR-CHAT-001~008` | 只保留本项目有需求来源的长期架构决定。 |

## 6. 装配原则与边界检查

1. 正式正文只承载 Step 1～15 已通过的结构性结论；问题回答、历史诊断和过程自检留在 `design-calibration/`。
2. 每个正式章节开头写具体 `design-calibration/01_arch_step_*.md` 校准来源和延伸阅读入口。
3. 任何 `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 均不得润色为已闭合合同、数字、证据或 readiness。
4. 正式文档不写 DTO、API path、事件 schema、代码目录、配置键、测试结果、commit 或 implementation ledger。
5. Chat 不拥有 Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime 或 Observability truth；不吸收 Bridges、Tools、Runtime 推理或内部 bus。
6. 载体名称只在“候选”语境出现：React/TypeScript shared UI/core、Tauri Desktop、Web shared UI、Capacitor 类 Mobile shell 均不构成实现事实。

## 7. 跨架构单元总审计装配结果

| 审计面 | A 协作体验 | B 受控意图 | C 安全导航 | D 变化恢复 | E 平台无障碍 | F safe 材料 | G 本地投影 | 结论 |
|---|---|---|---|---|---|---|---|---|
| 职责 | 显化 | 发起/反馈 | 入口/清理 | 承接/恢复 | 宿主/等价表达 | 安全材料镜像 | 缓存/草稿 | 无重叠 |
| 依赖 | 编排/SDK | SDK 出站 | SDK/平台 | formal SDK | 平台接缝 | SDK-only | 本地承载 | 方向一致 |
| 数据 | local + projection | draft/attempt | route/cleanup | recovery metadata | focus/capability | ref/summary | local projection | 无 owner truth 泄漏 |
| 通信 | query/change | command/result | 判断/revoke | change/resume | shell lifecycle | safe query/change | local/background | 类别无冲突 |
| 横切 | 来源/可访问 | 结果门控 | fail-closed | gap/unknown | 安全/AT | redaction | 清理/最小披露 | 全覆盖 |
| 追溯 | ADR-002/007 | ADR-001/004 | ADR-001/003/006 | ADR-005/006 | ADR-003/006 | ADR-001/002/007 | ADR-004/006/008 | 无断裂 |

结论：A～G 的职责、依赖、数据、通信、横切和追溯关系与 Step 15 总审计一致；Step 16 不引入新的架构单元或新的 owner 关系。

## 8. 正式文档静态审计计划

| 检查项 | 通过条件 |
|---|---|
| 章节完整性 | 文档元信息及 §1～§18 全部存在，顺序与书写规范一致。 |
| 来源可追溯 | 每个正式章节有具体 Step 文件路径和延伸阅读说明。 |
| 结论来源 | 正文可回到 Step 1～15 或正式 `00`；无旧文档孤立结论。 |
| owner 边界 | 未把 owner truth、正文、共享 projection 或内部 bus 写进 Chat。 |
| blocker 保留 | `CHAT-UP-*`、`WS-UP-*`、`OPEN-CHAT-*` 等仍为 pending/blocked/deferred/unknown 等未闭合姿态。 |
| 技术候选边界 | React/Tauri/Web/Mobile 等只作候选，未写成实现或 readiness。 |
| 架构粒度 | 无 DTO、API、代码目录、测试、commit、上线或验收伪造。 |
| 范围 | 本轮写入和审计涉及的路径均位于 `projects/L5-chat/` 下允许的设计文档、校准材料、draft 和项目台账；工作区中其他项目已有变化未被本轮触碰。 |

## 9. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按 Step 1～15 逐章装配 | `pass` | 来源矩阵覆盖 §1～§18。 |
| 是否先审计历史材料再重建 | `pass` | 旧文档差异与删除口径记录于本文件 §5。 |
| 是否新增架构结论 | `none` | 本 Step 仅重组、统一术语、补来源和审计。 |
| 是否保留未闭合项 | `pass` | blocker 和质量/平台待确认继续留在 §15 及 Step 14。 |
| 是否完成跨单元审计 | `pass` | A～G 的职责、依赖、数据、通信、横切和追溯无冲突。 |
| 是否允许进入 `02` | `no` | 正式 `01` 完成后按用户授权边界停审，等待后续明确授权。 |

## 10. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 装配来源、历史差异、术语和跨单元审计已完成；正式文档已回填并完成静态审计。 | Step 16 已关闭；维持正式 `01` 停审。 |
| 文档级 | `pass` | 正式 `01` 已按 §1～§18 重建并完成最终静态审计；文档状态为 `stopped`。 | 当前文档停审；等待用户明确授权后才可进入 `02`。 |
| 项目级 | `pass` | 正式 `01` 已完成并停审；上游合同 blocker 仍保留，不构成已闭合 readiness。 | 项目暂止于正式 `01`；等待用户明确授权，不进入 `02`。 |

## 11. 执行后静态审计记录

| 审计动作 | 结果 | 观察 |
|---|---|---|
| 正式章节编号扫描 | `pass` | `01-架构设计.md` 包含连续的 §1～§18，共 18 个正式章节。 |
| 校准来源路径扫描 | `pass` | 正式章节引用的 `design-calibration/01_arch_step_*.md` 均存在；每章有具体来源和延伸阅读说明。 |
| Markdown 代码围栏配对 | `pass` | 代码围栏标记数量为偶数，系统上下文、容器、依赖、数据和交互图均有闭合代码块。 |
| historical 污染扫描 | `pass` | 正式 01 未残留旧 AG-UI/具体 SSE-WS、旧性能数字、旧 ADR、旧对象名、灰度/回滚或监控承诺。 |
| owner / SDK 红线扫描 | `pass` | 正文持续声明 SDK-only、禁止内部 bus/共享 DB/私有 API、owner truth 外置和 forbidden body/write。 |
| blocker 保留扫描 | `pass` | `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 仍保持 pending/blocked/deferred 等未闭合姿态。 |
| 实现范围扫描 | `pass` | 未新增代码、implementation ledger、测试结果、commit、验收、运行证据或 readiness 事实。 |
| 修改范围扫描 | `pass` | 本轮实际写入路径均位于 `projects/L5-chat/`；未修改 SDK 源码或其他项目正式文档。工作区其他路径的既有变化不纳入本轮审计结果。 |

本记录是静态文档审计，不是代码测试、集成测试、性能测试、验收或上线判断。Step 16 到此关闭；正式 `01` 停审，后续 `02-概要设计.md` 等待用户明确授权。


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与历史差异审计

本轮保持现有正式文件，按 Step1～15回填对应章节，不删除重建。前轮本文件的 rebuild/delete 记录仅作历史材料，本轮 supersede。正式元信息和来源说明需写清当前需求、原型与修复记录；来源冲突不得由“正式文档优先”掩盖。

本轮审查清单：§1来源层级/Process；§2～3目标/边界；§4职责；§5SDK-only系统图；§6七单元/应用展示面；§7SDK包与远端部署；§8依赖；§9数据/分域版本；§10交互/幂等恢复；§11机制/只读图库；§12取舍；§13横切/验证切口；§14演进；§15风险；§16需求追溯；§17十项ADR；§18参考和停审。

### 跨单元总审计

| 主轴 | 本轮静态审查结论 | 保留缺口 |
|---|---|---|
| 职责 | A展示、B意图、C导航、D连续性、E宿主、Fsafe材料、G受限恢复分工一致 | 不承担Process/Work/Governance/目录 truth |
| 依赖 | 每个外部业务消费面都经SDK，具体图形库只在表现层 | SDK exact surface、Process与目录/绑定消费合同 pending |
| 数据 | source-local版本/visibility、local选择、formal projection/ref分开 | 不保证跨owner原子快照；缓存留存政策待确认 |
| 交互 | query/local选择/change/后台重查分离；unknown不重放，ACK不确认 | receipt/result/probe/resume需正式能力 |
| 横切 | 图形/列表可访问、撤销/迟到保护、低敏诊断、受控配置有 planned 切口 | 无测试运行、性能/AT验证或验收结果 |
| 追溯 | F018～021与US019～022、AC-FR011～014和ADR009/010已连接 | CHAT-BASE-001：00新增行的AC-NFR008～024无正式定义 |
| 证据 | 原型只作交互决定，代码/测试/工具摘要非正式验收判定 | 无实现、run、report、commit或readiness事实 |

### 结构化回填与复杂度

元信息更新为本轮逐章修复与2026-10-01；§18补Process核对来源、冻结原型记录与真相源标准。正文/current cal repair冲突须回到对应来源校准，不自动覆盖需求或owner；十项ADR与已确认机制只承载Step1～15结果。已有图表足够，无新增架构分析。

### 停审自检

正式01已回填并可逐章节回到本轮Step记录；所有未闭合合同、来源与编号缺口保留§15/§16和台账。本文“pass”仅为架构边界/静态追溯结论，不表示实现可直接开工。当前停止，不进入02、不改00、不提交。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：01 §1～§18逐章回归重审完成，正式文档停审，合同与编号缺口保留。
- next_allowed_action：正式 01 停审；不进入 02。

### 最终静态检查记录

- 正式章节：18章，编号连续；每章均有校准来源块。
- 正式正文引用的具体 calibration 文件存在，无缺失路径。
- 本轮flow中16个Step均为pass，文档总门禁为stopped_after_01；代码围栏12个，成对闭合。
- git diff --check仅提示正式01顶部既有Markdown硬换行的行尾双空格；本轮未引入额外正文空白错误。该检查不代表测试或验收运行。
- 变更范围：现有01正式文档、对应01 Step1～16、01flow与项目台账。没有新增总同步文件；00/02/03、SDK、其他项目及原型未被本轮改写。
- 后续02/03仍是前轮材料，尚未吸收当前架构修复；等待明确授权后校准，当前停止。
