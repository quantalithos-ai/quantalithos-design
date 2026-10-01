# L5-chat 03 · Step 2 本轮详细设计范围

> Step 状态：`done`
> gate_status：`pass_with_blockers`
> 本步主题：限定详细设计要覆盖的客户端实现契约与明确非范围。
> 生成依据：`standards/document/详细设计讨论流程_SOP.md` §5 Step 2；`standards/document/详细设计书写规范.md` §1～§3。
> 上游输入：`03_ddd_step_01_upstream_boundary.md`、正式 `02-概要设计.md` §2、§4～§13。

## 1. Step 内计划

| 子阶段 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 将概要承接清单转换为实现目标候选 | 目标表 | `done` | 每项均属于 Chat 客户端实现，而不是领域服务 |
| 明确功能覆盖与正向阻塞 | 能力覆盖/阻塞映射 | `done` | exact 上游 contract 不虚构 |
| 明确非范围和下游文档分工 | 非范围表 | `done` | 能定位 owner、SDK、其他设计文档 |
| 诊断历史范围漂移 | 前后差异表 | `done` | 旧正式材料只作污染审计 |
| 回填、自检和门禁 | §2 回填草稿 | `done` | 供 Step 3 使用；不写排期 |

## 2. SOP 问题回答

### 2.1 本轮必须覆盖哪些模块？

从正式 02 承接七个主要组成部分对应的客户端模块：协作体验语境、受控协作意图、安全语境与导航、变化与恢复连续性、安全材料与来源显化、受限本地状态、平台体验与可访问性。详细设计聚焦这些模块如何被客户端实现单元承载，不重组 02 的组成部分。

### 2.2 必须定义哪些对象、接口、事件、job 和状态机？

在完整 03 中，范围包括 02 中所有 Chat-local 对象及其字段/生命周期；SDK Query/Command/Inbound Change/Result/Resume/Outbound Handoff/Operations 消费入口的 adapter contract；client store/reducer、结果门控、可见性/持久化 guard；关键处理流和客户端状态转换。exact SDK 或 owner schema 只在上游已有定义时引用，否则明确阻塞对应正向路径。Chat 不定义 owner-side event producer、job 或业务状态机。

### 2.3 哪些能力属于外围增强或后续平台阶段？

高级跨域搜索/过滤、复杂编辑/附件、托盘增强、Mobile推送/后台/分享和高级诊断仍为后续；公司目录所需的基础搜索/分页、项目五标签、流程下钻/并行结构/节点关联/双向群聊属于当前Desktop主线。跨端同步保留正式能力要求/缺口及恢复语义，不自建同步服务，也不扩大V1到Mobile。

### 2.4 哪些内容属于其他文档或 owner？

- 配置项/默认值/环境矩阵归 04；03 只标出代码绑定点和引用配置的类型要求。
- 完整测试策略、用例、覆盖率与执行证据归 05；03 只列模块级测试切口和最小验证清单。
- 验收谓词归 06；排期、phase 和 commit boundary 归 07。
- Query/Command transport、auth、retry、error、trace/redaction 与 change/resume 通用实现归 L0-sdk。
- Conversation、Turn、Participant、Project、Member、ProcessInstance/Activity/Token/Gateway、Gate/Decision、Artifact、Workspace、Runtime与Observability truth归正式owner；绑定owner/目录provider仍待确认，不能由Chat建立。
- Runtime 推理、Tools 执行、Capability/Sandbox 和 Bridges 平台映射均在 Chat 范围之外。

### 2.5 实现者取得本文后可完成什么？

仅在 SDK/owner 正式能力存在且编码/平台/实现仓门禁被后续关闭后，实现者应能实现 Chat 客户端的路由与页面承接、Turn/Gate/Artifact/成员/项目摘要显化、draft 与受控 intent、SDK adapter、formal change reducer、确认门控、受限 cache/recovery、跨端宿主接缝和可访问性语义。当前阻塞意味着本产物本身不构成开工许可。

## 3. 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| `CHAT-DDD-SCOPE-01` 客户端模块实现契约 | 为概要中的七个组成部分建立模块级对象、函数、依赖、状态和错误契约，不改业务主语。 | 可定位的客户端模块职责与本地边界。 |
| `CHAT-DDD-SCOPE-02` 视觉和交互投影闭环 | 明确页面/路由/组件如何消费 view model，显化来源、新鲜度、partial/unavailable 和访问姿态。 | 页面与 view model 的输入/输出/本地状态 contract。 |
| `CHAT-DDD-SCOPE-03` 受控用户意图闭环 | draft、submit、SDK attempt、owner result/change 和反馈状态各有明确定义。 | 不把 button/ACK/cache 作为 confirmed 的命令结果链。 |
| `CHAT-DDD-SCOPE-04` 变化与恢复消费 | formal change、幂等、gap、重连、resume、requery、撤销/过期和本地清理可在客户端解释。 | reducer/recovery adapter 的客户端消费契约。 |
| `CHAT-DDD-SCOPE-05` 安全本地持有面 | 定义允许缓存/恢复的安全展示材料与禁止持有内容、生命周期清理和 guard。 | Chat-local persistence/recovery boundary，不承担 owner truth。 |
| `CHAT-DDD-SCOPE-06` 平台无关语义 | Desktop-first shell 与 shared client semantics 分离，辅助技术等价表达不改变业务结果。 | 平台接口/能力缺失姿态及共享语义约束；具体 host 形态依赖 Step 3 blocker。 |
| `CHAT-DDD-SCOPE-07` 项目与分层流程实现契约 | 在协作/安全/材料/连续性既有模块内承接五标签、整体/阶段/节点、并行结构与独立Gate，renderer只读。 | 七新增对象的字段/生命周期/props/函数、局部路由/store/SDK adapter/reducer/恢复与planned验证切口；正式能力缺失blocked。 |
| `CHAT-DDD-SCOPE-08` 正式关系与成员访问隔离 | 双向群聊、公司目录及项目成员/参与者/在场分别消费，目标独立访问；请求代次拒绝迟到响应。 | Link/Directory VM与ClientConsumptionContext、基础搜索分页/返回/context失效、guard/清理及证据边界。 |

## 4. 范围与非范围

| 项目 | 类型 | 详细设计处理 | 当前资格 |
|---|---|---|---|
| 路由、scope/context 呈现和选择/focus | 必须范围 | 定义 Chat-local state、导航 guard、页面入口与 owner scope 引用边界 | 可以设计；exact identity/visibility input 受上游合同约束 |
| group/channel/dm/thread 和 Turn 展示 | 必须范围 | 页面/view model/component 消费者契约；区分 Turn presentation 类型但不创建 Turn truth | 正向数据源受 `CHAT-UP-001/002` 阻塞 |
| draft、发送、失败、重试/unknown | 必须范围 | Chat-local draft/attempt、SDK command seam 和 result gate 的契约 | 正向发送/结果受 SDK/Conversation contract 阻塞 |
| GateCard 与受控审批入口 | 必须范围 | 显化 safe context 和受控用户意图；结果只来自正式 owner/SDK receipt/result/change | `CHAT-UP-003` 阻塞正向审批集成 |
| Artifact ref/preview | 必须范围 | body-free reference 与 preview available/unavailable 的映射 | `CHAT-UP-004` 阻塞正文预览正向路径 |
| 成员/项目/Runtime 摘要 | 必须范围 | 只定义 safe summary presentation 与来源/新鲜度提示 | `CHAT-UP-006` 阻塞 exact summary mapping |
| 项目列表/详情五标签 | 必须范围 | 进度嵌于项目详情；ProjectDetailViewModel/ProjectNavigationState统一project，section分来源 | Work/绑定/Process SDK能力分别受CHAT-UP001/006/008/009限制 |
| 整体→阶段→节点、并行分叉/分支/汇聚 | 必须范围 | ProcessFlowViewModel/NodeDetail、只读renderer/等价列表/独立Gate，不执行BPMN | CHAT-UP008；正式拓扑/状态/关联/版本与resume未确认blocked |
| 项目↔群聊、基础公司目录搜索/分页/成员入口 | 必须范围 | Link/Directory VM；一群至多一项目/项目可多群是产品目标，关系与目标/成员集合各自访问 | CHAT-UP009；无正式owner/provider保持blocked/unavailable |
| source-local消费代次与迟到/撤销隔离 | 必须范围 | ClientConsumptionContext/局部store/reducer；切项目/节点/搜索先失效旧代次，撤销先遮蔽再清理 | 可定义局部契约；正式source/event/visibility合同仍待上游 |
| Workspace/inbox 摘要 | 条件范围 | 只消费已正式闭合的 safe view | `CHAT-UP-005`、`WS-UP-*` 阻塞 |
| formal change/reconnect/offline/recovery | 必须范围 | reducer、cursor/resume 消费、gap/unknown/stale 和 local recovery 语义 | `CHAT-UP-001/002` 阻塞 exact surface |
| 可访问性与客户端安全 | 必须范围 | 跨模块 guard、语义适配、最小披露和清理契约 | 语义可定义；平台 exact APIs 待选型 |
| 高级跨域搜索/过滤、复杂富文本/附件 | 后续增强 | 不包含当前必要的目录基础搜索/分页 | `deferred` |
| Mobile push/background、独立跨设备同步服务 | 后续增强/排除 | 不进入V1 Mobile；当前草稿/导航恢复只用正式允许同步能力，缺合同blocked而非私造服务 | `deferred/blocked` |
| Runtime/Tools、Bridges、Observability backend | 明确排除 | 不定义客户端内部实现或协议；保留正式 safe entry/handoff 边界 | `out_of_scope` |

## 5. 非范围与文档归属

| 非范围 | 留给哪一层 / 文档 | 03 的允许引用 |
|---|---|---|
| owner truth、业务生命周期、权限与 owner-side command transaction | 对应 L1/L2 owner 文档 | 引用正式 safe view/ref/result/event contract |
| SDK 通用 client、传输、认证、重试/错误/trace/redaction 实现 | `projects/L0-sdk/` | 定义 Chat adapter 的消费点，不复制 SDK 实现 |
| 内部 bus、数据库、owner 私有 API | 各 owner / bus | 禁止 Chat 直接依赖 |
| 原生权限/安全与兼容资格 | 正式host合同及后续03/04/05验证设计 | Step3选择载体；缺失能力合同局部blocked |
| 配置完整模型 | `04-配置设计.md` | 记录代码引用配置的绑定位置 |
| 全量测试方案/验收/排期 | `05/06/07` | 提供测试切口、验收 trace source、实现承接输入 |
| Bridges 外部平台映射、Runtime 推理、Tools 执行、Observability backend | 对应正式 owner / sibling | 仅说明不属于 Chat |

## 6. 前后差异诊断

| 维度 | 历史材料可能的偏移（仅诊断） | 本轮范围 |
|---|---|---|
| 项目类型 | 将 Chat 写成服务端消息域或 transport 实现 | Desktop-first 客户端产品层，仅做展示和受控交互 |
| UI/SDK 关系 | 把已有 SDK 理解成 UI，或在 Chat 再实现 SDK | Chat 拥有 UI 与局部体验状态，正式业务能力由 SDK 提供 |
| 功能强度 | 将搜索、复杂编辑、通知、mobile 都作为 V1 必做 | 以 Desktop 主线和四个核心能力为边界，增强能力 deferred |
| 成功语义 | 把点击、ACK、toast 当业务完成 | 必须等正式 owner/SDK 结果并经 result gate |

## 7. 设计取舍

- 以 02 七个组成部分和客户端主体清单覆盖实现范围，不在 03 重新做平台架构取舍。
- 将安全/可访问性/恢复作为主线跨切能力，不能降级为外围视觉增强。
- 将各正向上游集成表示为受正式 contract 限制的实现目标；缺合同时只定义 fail-closed/blocked/unavailable posture。
- 不把 03 写成开发计划；模块与文件先由后续 Step 3/4 审查，当前只给 Step 3 提供 scope。

## 8. 回填草稿

本次详细设计的范围是为 L5-chat Desktop-first 客户端的七个既定组成部分定义模块级实现契约，覆盖页面/路由与 view model、客户端 store/reducer、SDK adapter、受控 intent/result gate、正式变化消费、受限缓存/恢复、平台 shell 和可访问性。本文不实现 owner truth、通用 SDK、内部 bus、Runtime/Tools、Bridges 或 Observability backend；配置全貌、完整测试方案、验收和排期分别交给 04～07。所有正向接入须基于 SDK/owner 正式 contract，当前开放项保持阻塞，不表示 ready 或可开工。

## 9. 待确认事项

| ID | 待确认事项 | 影响 | 状态 |
|---|---|---|---|
| `CHAT-DDD-003-TECH-001` | Step3按已认可方向选择React/TS + Tauri 2，Step4明确package/布局 | 实现约束已收敛；不等于可运行资格 | `resolved_for_design` |
| `CHAT-DDD-SCOPE-UP-001` | Chat 场景所需 SDK/owner safe query/command/change/result/resume/ref surface | 各模块正向集成契约 | `inherited_blocker` |
| `CHAT-DDD-SCOPE-PLAT-001` | V1 Desktop 壳具体采用及其 storage/window/deep-link/notification/accessibility contracts | 平台 adapter 与本地持久化 contract | `open_blocking` |
| `CHAT-UP-008/009` | Process projection/关联及绑定/目录provider | 新增主线正向集成阻塞，客户端骨架可设计 | `inherited_blocker` |
| `CHAT-BASE-001` | 新增需求验收编号缺口 | planned验证不声称缺失AC已定义/满足 | `open` |

## 10. 自检与下一步门禁

- 范围从 02 正式承接清单推导，未重写需求、架构或 owner truth。
- 目标是实现契约，非用户故事复述或排期。
- 非范围说明了归属层次/文档；07 后续能力被标为 deferred/out of scope。
- 实现目标和当前可以正向接入的资格分开描述；阻塞没有被润色为 ready。
- gate：`pass_with_blockers`，允许进入 Step 3 的适用规范与约束审查；不表示实现批准。

## 2026-10-01 重审收口

计划/输入：Step2 SOP/规范5.2、当前Step1、02 §2/12和既有Step2全文。问题回答/诊断：旧范围将目录搜索/项目流程遗漏或笼统deferred，当前新增结构目标与必须范围；高级搜索/Mobile不扩大，跨端恢复保留正式同步缺口。正式truth与原型/SDK骨架/本地投影分立，项目进度不独立顶层。结构产物原位更新目标表、范围/非范围及blocker；表足够，无图。自检无新架构单元/owner/实现授权，配置/测试/验收/计划分属04～07。Step2 done pass_with_blockers，进入Step3重审，不提交。
