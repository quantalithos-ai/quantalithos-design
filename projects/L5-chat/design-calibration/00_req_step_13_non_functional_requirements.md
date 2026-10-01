# Step 13 · 非功能需求

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §13「非功能需求」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 13  
> 对应书写规范：`standards/document/需求文档书写规范.md` §4.13  
> 直接输入：`00_req_step_07_core_capability_loop.md`、`00_req_step_10_rules_boundary_constraints.md`、`00_req_step_11_data_requirements_ownership.md`、`00_req_step_12_interfaces_dependencies.md`。  
> 本步只定义客户端产品必须满足的质量约束和判断口径，不写监控平台、日志字段、重试算法、缓存参数、数据库优化、加密实现或测试步骤。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 · 非功能需求 |
| 输出文件 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes；需求 SOP Step 13、书写规范 §4.13 与中间产物规范 |
| 已读取前序输入 | yes；Step 7 能力闭环、Step 10 规则、Step 11 数据归属、Step 12 接口/依赖 |
| 模块骨架 | done：六类默认非功能类别、可访问性专项、能力映射、历史阈值审计、证据边界和停审 |
| 进入条件 | `pass`；Step 12 已完成并通过门禁 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 按性能、可用性、安全、审计/可追溯、幂等/一致性、可观测性逐项判断适用性 | done | 见 §7.1 |
| 将可访问性与跨平台语义作为客户端产品专项展开 | done | 见 §7.1、§7.2 |
| 将要求分别挂到 N1～N4 或标记为全局质量约束 | done | 见 §7.2 |
| 审计旧文档的性能、可用率、后端 SLA、事件机制和固定规模数字 | done | 见 §5、§7.4 |
| 给每项要求提供判断口径，区分已确定的行为底线和待 authority 的数值 | done | 见 §7.1、§7.4 |
| 明确未来 Step 14 的测试切口和证据边界，但不伪造测试结果 | done | 见 §7.5 |
| 完成能力级停审、跨能力审计和 Step 13 门禁 | done | 见 §10、§13 |

## 3. 本步输入与非功能粒度边界

| 输入 | 本步使用方式 | 不直接写入的内容 |
|---|---|---|
| Step 7 核心能力闭环 | 将质量要求挂到 N1 安全语境、N2 事实显化、N3 受控意图、N4 变化/失败/恢复。 | 新增业务能力、平台功能或 owner truth。 |
| Step 10 规则 | 将 fail-closed、最小披露、结果分层、unknown、no-direct-bus、cache-not-authority 转成质量判断。 | 异常码、校验函数、重试实现或协议状态机。 |
| Step 11 数据归属 | 保护 Chat-owned local state、owner safe snapshot、external ref 和禁止正文四类边界。 | 字段、表、索引、TTL、序列化和数据库方案。 |
| Step 12 接口/依赖 | 约束 SDK-only 接入、owner 局部失败、事件 resume/cursor、低敏 handoff 和平台 shell seam。 | API 路径、DTO、事件 schema、topic、adapter/port 实现。 |
| 历史 Chat README/旧 `00` | 只做污染审计；旧候选技术、事件名、固定阈值和服务 SLA 不直接继承。 | 把 AG-UI、SSE/WebSocket、Tauri、React/Svelte/RN 或历史数字当成当前合同。 |

## 4. SOP 问题回答

### 4.1 哪些质量要求能回指核心能力节点？

- **N1 安全协作语境进入与保持**：必须保证 actor、scope、visibility 和入口语境在无法验证时安全收紧；route、selection、deep-link 和恢复不会放宽权限；语境入口也必须可访问。
- **N2 正式协作事实安全显化**：必须保证 Conversation/Turn、成员、项目、运行、Gate/Decision、Artifact、Workspace 摘要只以 owner safe view/ref 显示，并保留来源、新鲜度、可见性和降级语义。
- **N3 用户意图受控发起与结果反馈**：必须保证 draft、local intent、submitted/pending、confirmed/rejected/failed/unknown 各自可区分，transport ACK、toast 或 optimistic 状态不能收口为正式结果；命令重试必须受正式幂等和回查能力约束。
- **N4 变化、失败、离线与恢复连续性**：必须保证 SDK formal event、cursor/resume、gap、duplicate、revocation、断线、Desktop 重启和缓存过期都有可解释姿态；恢复只恢复展示和草稿，不恢复授权或业务成功。

### 4.2 哪些质量要求覆盖全仓？

以下要求横跨全部能力，不能强塞进单个节点：

1. Chat 的业务读取、变化消费和意图提交只能经 `L0-sdk` 接入；平台 shell 只承载窗口、输入、通知、存储和辅助技术等非业务适配能力，不直连 owner 私有 API、内部 bus、共享数据库或隐藏服务。
2. Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime 和 Observability 的正式语义只由各自 owner 提供；Chat 的 view model、store、缓存和跨 owner 联合视图不得形成第二真相。
3. forbidden body、credential、token、secret、内部 bus payload 和未脱敏诊断不得进入 Chat 的持有、日志、错误、导出或 handoff 边界。
4. Desktop、Web 和未来 Mobile shell 可以改变窗口、输入、通知、存储和深链适配，但不得改变同一业务动作的授权、结果或 unknown 语义。
5. 页面、SDK adapter、client store、view model、事件 reducer 和低敏诊断必须使用一致的状态分类；任何无法确认的情况都必须保留 `unknown / unavailable / blocked`，不能归一成空、成功或已完成。

### 4.3 当前必须满足哪些性能与可用性要求？

性能重点是客户端本地交互、相关 owner 查询和异步变化的边界清楚且可归因：路由、选择、草稿、焦点和状态提示不能无必要等待无关 owner；慢或失效来源不得拖成无解释的全页面阻塞；重复事件、未知命令和自动回查不得形成无界放大。可用性重点是身份/语境无法验证时整体 fail-closed、单一 owner 失效时按区域局部降级、已取得的安全展示和未提交草稿在允许范围内保持可解释，同时不把旧缓存当授权或正式结果。

### 4.4 当前必须满足哪些安全、审计和一致性要求？

- 安全上执行最小披露：越权、撤销、过期、visibility 不明或 contract 缺失时，页面只能显示安全的受限/不可用/需要处理姿态。
- 审计上要求 owner-derived view、Gate/Decision 结果、Artifact/Workspace/Runtime 引用和命令结果在 owner 提供时可回指 source/version/receipt/result；客户端诊断只能证明交互或恢复经历，不能替代业务审计。
- 一致性上保持单一 owner truth；local intent、attempt、receipt、confirmed、rejected、failed、unknown 和 formal event 不得合并成一个“已完成”状态；duplicate、out-of-order、gap、cursor-expired、revoked 输入不能被静默跳过。

### 4.5 哪些要求能量化，哪些只能给判断口径？

当前没有获得可用于 Chat 的正式性能预算、客户端可用率 SLO、受支持 shell/辅助技术矩阵或低敏诊断 envelope。因而本步采用可直接判断的行为底线，并把数值和兼容矩阵登记为待确认项。旧文档中的 `<2s`、`≥99.9%`、`500+`、后端 `PostTurn P95 < 100ms`、`StreamEvents P95 < 500ms` 和各 owner `99.9%` SLA 不作为本需求的现行目标；后续只有在正式 authority 指定场景、环境、测量窗口、负载和责任边界后，才能写入配置、测试阈值或验收结论。

### 4.6 Step 14 如何承接这些要求？

Step 14 应把每条 `NFR-CHAT-*` 转成可观察的行为验收：在正常、部分、过期、撤销、断线、重复、缺口、unknown、缓存恢复和辅助技术路径中，判断页面/客户端 store/reducer 是否保持安全状态语义。验收证据只能来自正式 owner/SDK 合同、客户端可见状态、受控测试输入和安全诊断关联；本步不声称已有运行、测试、报告或 readiness 结果。

## 5. 当前材料问题诊断

| 历史材料中的说法 | 问题 | 当前处理 |
|---|---|---|
| 主会话首屏 `<2s` | 没有设备、网络、数据规模、渲染起止点或正式 authority；无法区分本地交互与 owner 等待。 | 不继承为当前目标；改为本地交互不被无关依赖阻塞，相关等待必须有界、可解释；精确预算待确认。 |
| Chat 关键路径可用率 `≥99.9%` | 没有 Chat 自身 SLO owner、窗口、依赖归因和降级定义；客户端不能替 owner 承诺。 | 不继承；采用语境 fail-closed、owner 局部隔离和状态可解释口径。 |
| 大群 `500+` 参与者可用 | 固定规模没有当前场景、设备和性能基线，也可能把 Conversation owner 的规模目标转嫁给 Chat。 | 不继承固定数字；要求长历史、大列表和多参与者视图支持局部加载、降级和不阻塞无关区域，规模阈值待 authority。 |
| `PostTurn P95 < 100ms`、`StreamEvents P95 < 500ms` | 这是历史 Conversation/SDK 后端候选目标，不是 Chat 端到端可感知目标；测量边界不同。 | 不改写为 Chat 指标；Chat 只要求正确区分等待、结果和变化，待 owner/SDK 合同提供端侧预算。 |
| 各依赖服务 `99.9%` SLA | Chat 无权为 Conversation、Governance、Work、Identity、Artifact 等 owner 重新承诺 SLA。 | 只要求依赖失效时局部降级、最小披露和可恢复提示。 |
| AG-UI 17、SSE/WebSocket 作为实时质量合同 | 把传输机制和历史事件集合当作产品语义，可能绕过 `L0-sdk`。 | 只保留 formal event、cursor/resume、gap、revocation 和结果变化语义；具体传输后移 SDK/架构。 |
| “离线模式”或平台技术选型直接等同能力 | 容易把缓存、Tauri、React、Svelte 或 React Native 当成业务质量保证。 | 仅规定离线展示/草稿恢复的安全上限；Desktop-first 是 V1 承载约束，shell 不得改变业务语义。 |

## 6. 设计取舍

| 主题 | 不采用的做法 | 当前取舍 |
|---|---|---|
| 性能 | 以一个首屏数字覆盖所有 owner、网络和 shell。 | 分离本地交互、相关 owner 查询、事件更新和恢复；无 authority 时使用可判断口径。 |
| 可用性 | 用单一 uptime 或“永远在线”描述客户端。 | actor/scope 失败时 fail-closed；单 owner 失败局部隔离；安全本地能力保留可解释反馈。 |
| 安全 | 以 UI 隐藏按钮、缓存存在或本地角色判断代替授权。 | owner/SDK 决定可见性和结果，客户端只能更保守；撤销和过期优先收紧。 |
| 一致性 | 用一个统一 `success` 状态覆盖 optimistic、ACK、receipt 和 owner result。 | 状态分层且 reducer 保留 unknown/gap/revoked；不盲重放副作用。 |
| 可观测性 | 记录越多越好，或直接订阅内部 bus。 | 只保留低敏、可关联、与业务分离的客户端诊断/handoff；sink 失败不改变业务语义。 |
| 可访问性 | 只为正常视觉路径补键盘或颜色替代。 | N1～N4 的正常与非理想路径均需等价键盘/辅助技术语义，错误、恢复和动态变化也必须可理解。 |
| 跨平台 | 为 Desktop/Web/Mobile 各自定义一套业务状态。 | 共享客户端 core 的状态语义保持一致，shell 只适配窗口、输入、通知、存储和深链；V1 仍 Desktop-first。 |

## 7. 结构化中间产物

### 7.1 非功能需求表

| ID | 非功能类别 | 要求 | 判断口径 / 目标值 | 能力 / 全仓映射 |
|---|---|---|---|---|
| `NFR-CHAT-001` | 性能 | 本地导航、语境选择、草稿编辑、焦点移动和状态切换不得无必要等待无关 owner 响应。 | 当相关 owner 尚未返回或某个无关 owner 不可用时，可独立完成的本地交互仍有即时且可理解的反馈；精确交互预算待正式 authority。 | N1/N3/N4 |
| `NFR-CHAT-002` | 性能 | Owner safe view 的加载、分页、下钻和变化更新必须允许局部进展，慢来源不得形成无说明的全页面等待。 | 每个相关区域都能区分 loading、partial、stale、available、unavailable 和 blocked；长历史或大列表不应使无关区域失去响应；规模/延迟阈值待 authority。 | N2/N4 |
| `NFR-CHAT-003` | 性能 | 重连、重新查询、事件消费和命令回查不得因 duplicate、gap 或 unknown 形成无界请求放大或副作用重放。 | 每次查询、变化和意图都能归因到所需 owner 能力；unknown 不自动盲重放，恢复必须受正式 SDK/owner retry、cursor 和幂等合同约束。 | N3/N4；全仓 |
| `NFR-CHAT-004` | 可用性 | Actor、scope、visibility 或授权语境无法验证、过期或已撤销时，受保护内容和动作必须 fail-closed。 | 受保护路径停止披露和提交，只显示安全的受限/不可用/需要处理方向；本地 route、draft 和恢复提示可以保留，但不能放行业务访问。 | N1；全仓安全前置 |
| `NFR-CHAT-005` | 可用性 | 单一 owner 的故障、过期或部分结果不得无依据地使其他 owner 区域失败，也不得被其他区域的成功掩盖。 | 故障影响按来源和能力区域隔离；不依赖该 owner 的 shell、本地交互、草稿和其他已授权 safe view 仍可用并标明状态。 | N2/N4；全仓 |
| `NFR-CHAT-006` | 可用性 | 普通发送、治理意图、重试和结果回查在依赖失效或结果未知时必须保持可解释，不得显示虚假成功。 | 页面能区分 submitted、pending、confirmed、rejected、failed、unknown，并给出重新查询、等待或人工处理方向；没有正式结果时不得显示完成。 | N3/N4 |
| `NFR-CHAT-007` | 可用性 | 断线、Desktop 重启、离线启动和 cursor/resume 失败时，客户端必须安全恢复或明确请求处理。 | 恢复后显示 reconnecting、stale、needs-action、unavailable 或 blocked；仅恢复带版本/可见性语境的展示和草稿，不恢复授权或业务成功。 | N1/N4 |
| `NFR-CHAT-008` | 安全 | 所有业务读取、变化消费和意图提交必须经 `L0-sdk`；平台 shell 只提供非业务适配能力，不得旁路 owner 私有 API、内部 bus 或共享数据库。 | 静态设计与后续实现边界均不存在页面直连、内部 topic 订阅、服务源码调用或本地权限放宽；SDK surface 未闭合时保持 blocked/deferred。 | N1～N4；全仓 |
| `NFR-CHAT-009` | 安全 | Artifact/Governance/Runtime/Workspace/Observability 正文、credential、token、secret 和未脱敏内部 payload 不得进入 Chat 的持有、诊断、错误、导出或 handoff 边界。 | Chat 只接收 owner safe view、summary、preview metadata 和 external ref；无法证明安全时拒绝、裁剪或显示 unavailable；禁止正文进入量为零是语义底线。 | N1～N4；全仓 |
| `NFR-CHAT-010` | 安全 | Scope、visibility、资格或对象可见性变化必须在后续显示和动作前重新收紧，缓存、深链和已打开页面不得绕过撤销。 | 撤销/过期/冲突/unknown 后旧允许姿态不可继续；直接入口、回退导航、通知和本地缓存遵守同一最小披露上限，不能泄露对象存在性。 | N1/N2/N4；全仓 |
| `NFR-CHAT-011` | 安全 | Desktop、Web 和未来 Mobile shell 的窗口、输入、存储、通知、深链和辅助技术适配不得改变业务授权、结果或 unknown 语义。 | 不同 shell 对同一 owner 输入呈现相同状态分类和安全上限；平台能力缺失时降级为 unavailable/needs-action，而不是自行补造业务能力。 | N1～N4；全仓 |
| `NFR-CHAT-012` | 审计 / 可追溯 | Owner-derived view、Gate/Decision、Artifact/Workspace/Runtime 引用和关键状态声明必须能回指正式 source、版本/新鲜度或安全引用。 | 每个确定性展示都能区分来源、当前性、可见性和覆盖；没有正式引用时明确 unknown/missing，不由页面补造正文或结论。 | N2/N4；全仓 |
| `NFR-CHAT-013` | 审计 / 可追溯 | 用户意图必须能够从 local draft/attempt 追到 SDK receipt、owner result 或明确的 unknown；客户端诊断不能单独证明业务完成。 | 只在 owner 正式结果或安全引用存在时显示 confirmed/rejected；按钮点击、toast、HTTP/websocket/AG-UI ACK、缓存刷新和客户端日志均不能单独形成业务证据。 | N3；全仓 |
| `NFR-CHAT-014` | 审计 / 可追溯 | 正式变化、cursor/resume、gap、visibility revoke、断线恢复和重新查询的关键转折必须可被安全关联。 | 能判断变化影响的能力/owner、客户端阶段和安全 correlation/ref（若 SDK/Observability 正式提供）；诊断材料不包含 raw body 或 secret。 | N4；全仓 |
| `NFR-CHAT-015` | 幂等 / 一致性 | 同一 Conversation、Turn、Gate/Decision、Artifact、Workspace、Runtime 或 Member 事实只采用正式 owner 的单一语义，Chat store、缓存和联合 view 不得形成第二真相。 | 所有 owner-derived 状态保留 source、freshness、visibility、coverage 和 availability 语义；跨 owner 联合展示不宣称原子、完整或统一当前。 | N1～N4；全仓 |
| `NFR-CHAT-016` | 幂等 / 一致性 | local draft、submitted/pending、confirmed、rejected、failed 和 unknown 必须保持不同；结果 unknown 时不得无正式依据自动重放有副作用的意图。 | 每个受控动作在任一时刻都有不夸大的可判别姿态；无法回查或缺少正式幂等合同时保持 unknown/needs-action，而非自动重试。 | N3/N4；全仓 |
| `NFR-CHAT-017` | 幂等 / 一致性 | 事件 reducer 必须显式处理 duplicate、out-of-order、gap、cursor-expired、revoked 和 resume 失败，不得静默跳过或错误推进。 | 相同输入不会重复渲染或重复推进业务状态；缺口、过期和撤销进入 requery/reconnect/blocked 等安全姿态，客户端不从时间戳猜顺序。 | N4；全仓 |
| `NFR-CHAT-018` | 幂等 / 一致性 | Desktop-first、Web 共享 UI 和未来 Mobile shell 对同一业务动作必须保持相同的状态语义和 owner 结果边界。 | Shell 可以调整布局、通知、输入和本地存储，但不得把平台 ACK 变成业务成功、把离线缓存变成授权或改变 Gate/Decision 结果含义。 | N1～N4；全仓 |
| `NFR-CHAT-019` | 可观测性 | 页面、view model、client store、SDK adapter 和 reducer 必须能一致区分 fresh、stale、partial、unavailable、blocked、submitted、pending、confirmed、rejected、failed 和 unknown。 | 同一状态在页面、支持入口和正式低敏诊断中的分类不互相矛盾；无法分类时统一保留 unknown，不归一为空或成功。 | N1～N4；全仓 |
| `NFR-CHAT-020` | 可观测性 | Chat 的客户端诊断和 handoff 必须只提供低敏、可关联的连接、缓存、恢复、错误和用户支持材料。 | 诊断可说明受影响能力/owner、阶段和安全引用（若正式提供），但不输出业务正文、秘密、内部 bus payload 或未经 owner 确认的 verdict。 | N4；全仓 |
| `NFR-CHAT-021` | 可观测性 | 诊断 sink 缺失、延迟或失败不得改变业务请求结果、放宽权限、阻断安全恢复或被误当作 owner 失败。 | 在相同输入下，诊断可用与不可用不改变 local intent、owner result、visibility 或恢复安全上限；诊断自身明确降级。 | N3/N4；全仓 |
| `NFR-CHAT-022` | 可访问性专项 | N1～N4 的进入语境、事实阅读、草稿/发送、Gate 受控操作、结果反馈、断线和恢复目标必须可通过键盘及受支持辅助技术完成。 | 每条适用核心路径都有等价非指针操作，焦点顺序、返回路径、错误处理和恢复方向可理解；任何关键目标无法完成即不满足。具体 shell/辅助技术组合待确认。 | N1～N4；全仓 |
| `NFR-CHAT-023` | 可访问性专项 | 可见性、来源、新鲜度、错误、危险操作、部分/未知结果和变化提醒不得只依赖颜色、位置、动画或瞬时提示。 | 每种语义都有可感知文本/名称/状态；动态变化不会造成焦点丢失，辅助技术用户能获得与视觉用户相同的安全上限和下一步选择。 | N1～N4；全仓 |
| `NFR-CHAT-024` | 可访问性专项 | Desktop、Web 和未来 Mobile shell 的输入、窗口、通知、深链、存储和恢复适配必须保留相同的可访问状态语义。 | 平台能力缺失时给出可理解的 unavailable/needs-action；不得因平台快捷入口、托盘提示或移动手势缺失而绕过安全确认或让关键路径无等价入口。 | N1～N4；全仓 |

### 7.2 能力节点与全仓质量映射

| 范围 | 重点 NFR | 停审结论 |
|---|---|---|
| N1 安全协作语境进入与保持 | `NFR-CHAT-001`、`004`、`008~011`、`015`、`019`、`022~024` | 语境不可验证时 fail-closed；route、deep-link、缓存和 shell 不得放宽权限；可访问路径与正式入口保持同一安全上限。`pass`。 |
| N2 正式协作事实安全显化 | `NFR-CHAT-001~002`、`005`、`008~012`、`015`、`019`、`022~024` | safe view/ref、来源、可见性、新鲜度和部分结果可解释；不能从 ref 猜正文或跨 owner 推断结论。`pass`，精确 safe preview 合同仍受 `CHAT-UP-004` 约束。 |
| N3 用户意图受控发起与结果反馈 | `NFR-CHAT-001`、`003`、`006`、`008~009`、`011`、`013`、`015~016`、`019~024` | local intent、receipt、正式 result 和 unknown 分层；不以 ACK/按钮/诊断收口。`pass`，治理 receipt/幂等合同仍受 `CHAT-UP-003` 约束。 |
| N4 变化、失败、离线与恢复连续性 | `NFR-CHAT-001~007`、`009~014`、`016~024` | duplicate/gap/revoked/expired、重连、缓存和 Desktop 重启都有安全姿态；缺 formal resume 时保持 blocked/stale。`pass`，Conversation/Workspace cursor 合同仍受 `CHAT-UP-002`、`CHAT-UP-005` 和 `WS-UP-001~008` 约束。 |
| 全仓横向质量 | `NFR-CHAT-003~005`、`008~011`、`015~021`、`022~024` | SDK-only、单一 owner truth、禁止正文、低敏诊断、跨端语义和可访问性贯穿全部页面、store、adapter、reducer 与 shell。`pass_with_open_authority`。 |

### 7.3 质量要求与客户端可落码边界

Step 5 以后要求的应用级粒度在本步只作为质量边界，不转成实现方案：

| 客户端层 | 本步质量要求 | 未来可观察切口（计划，不代表已实现） |
|---|---|---|
| 应用 / 页面 / 路由 | 进入、退出、深链、scope 变化和恢复不越过 visibility/authorization 上限。 | 路由状态矩阵、撤销后页面与安全退出状态。 |
| 组件 / view model | 正常、partial、stale、unavailable、blocked 和结果状态有稳定可理解表达。 | 每个组件状态变体的视图快照或交互状态证据。 |
| client store / draft | local route、selection、focus、draft、intent/attempt 与 owner snapshot/ref 分离。 | store 状态转移与缓存失效边界；不以 store 断言 owner truth。 |
| SDK adapter | 只调用正式 query/command/event/ref 能力，保留错误、receipt、resume 和 redaction 语义。 | typed adapter contract、owner fake 输入和未知 surface 的 blocked 分支。 |
| 事件 reducer / 重连 | 对 duplicate、乱序、gap、expired、revoked、resume 失败保持确定性安全姿态。 | 事件序列输入、reducer 输出、重连/回查决策和不重复渲染证据。 |
| optimistic / confirmed / failed | optimistic 只表示本地意图或等待，不替代 owner confirmed；failed/unknown 不被折叠。 | 发送、Gate 操作、重试和 unknown 的状态转移矩阵。 |
| Desktop/Web/Mobile shell | shell 适配差异不改变业务语义，缺能力时显示可理解降级。 | shell contract、深链/通知/存储差异矩阵和跨端等价路径。 |

这些是后续架构、详细设计、测试方案和验收需要的证据边界；本文件不声称已有实现、运行、测试结果、截图、报告或 readiness。

### 7.4 数值 authority 与历史污染审计

| 候选量化项 | 历史来源或旧口径 | 当前 authority 状态 | 当前结论 |
|---|---|---|---|
| 首次进入主会话或主语境 | 旧 `00`：`<2s` | 无正式设备、网络、数据规模、起止点和 owner | `rejected_as_current_target / pending_authority` |
| Chat 关键路径可用率 | 旧 `00`：`≥99.9%` | 无 Chat 自身 SLO owner、窗口、依赖归因和降级模型 | `rejected_as_current_target / pending_authority` |
| 大群/长历史规模 | README/旧 `00`：`500+` | 无当前基线、shell 矩阵和资源预算 | `rejected_fixed_threshold / pending_authority` |
| Conversation 后端 `PostTurn P95 <100ms` | 旧 `00` 上游候选目标 | 属于 owner/SDK 端候选，不是 Chat 端到端目标 | `not_a_chat_target` |
| Conversation 事件 `P95 <500ms` | 旧 `00` 上游候选目标 | 事件语义和测量边界仍由 SDK/owner 合同决定 | `not_a_chat_target` |
| 各 owner `99.9%` SLA | 旧 `00` 依赖表 | Chat 无权替 owner 承诺 SLA | `rejected_as_chat_commitment` |
| AG-UI 17 / SSE / WebSocket | README/旧 `00` 历史方案 | 传输和事件机制未作为当前 Chat 产品合同确认 | `historical_transport_only` |
| 禁止正文、越权披露、unknown 自动重放 | Step 10/11/12 正式边界 | 语义底线已确认 | `accepted_zero_tolerance` |
| 适用核心路径的辅助技术等价完成 | 用户当前产品要求与本步闭环 | 具体 shell/辅助技术矩阵待确认 | `accepted_coverage_judgment` |

无 authority 的数值不阻塞行为级需求与 Step 14 继续收敛，但阻塞将其写入配置、测试阈值、SLO、验收报告或 readiness 结论。后续如获得正式目标，必须同时注明场景、环境、负载、测量起止、统计窗口、owner 和证据来源。

### 7.5 上游 blocker 对非功能要求的影响

| blocker | 影响的质量要求 | 当前处理口径 |
|---|---|---|
| `CHAT-UP-001` SDK typed query/command/event surface 未统一 | `NFR-CHAT-003`、`008`、`013`、`016`、`019~021` | 只接受能力级语义；具体 surface 未确认时保持 blocked/deferred，不用页面直连或自建 shadow contract。 |
| `CHAT-UP-002` Conversation visibility/cursor/resume/分页合同未闭合 | `NFR-CHAT-002`、`003`、`007`、`010`、`014`、`017` | 变化、分页和恢复只能表达 stale/gap/blocked/requery 意图，不宣称已闭合实时能力。 |
| `CHAT-UP-003` Governance receipt/幂等/Decision event 未闭合 | `NFR-CHAT-006`、`013`、`016` | GateCard 只提供受控入口；没有正式结果只能保持 submitted/pending/unknown。 |
| `CHAT-UP-004` Artifact safe preview/ref/visibility 未闭合 | `NFR-CHAT-009`、`010`、`012` | 不从引用猜正文或权限；预览 contract 缺失时 unavailable。 |
| `CHAT-UP-005` Workspace safe view/freshness/attention/cursor/export 未闭合 | `NFR-CHAT-002`、`005`、`007`、`012`、`017` | 只消费正式提供的 safe view；未闭合区域保持 stale/unavailable/blocked。 |
| `CHAT-UP-006` Identity/Work/Member/Runtime 摘要层级未对齐 | `NFR-CHAT-005`、`012`、`015`、`019` | 不跨 owner 推断成员、项目或运行生命周期；显示来源与不确定性。 |
| `CHAT-UP-007` Observability 客户端 handoff surface 未闭合 | `NFR-CHAT-014`、`020`、`021` | 只保留本地低敏诊断意图；不把 UI 日志或内部 bus 当正式观察真相。 |
| `WS-UP-001~008` Workspace 上游开放合同 | `NFR-CHAT-002`、`005`、`007`、`012`、`017` | 不把 Workspace projection、attention、cursor 或 export 缺口隐藏为客户端质量已满足。 |

### 7.6 证据与测试切口边界

以下只规定未来 Step 14、05 测试方案和 07 实施计划可以使用的证据边界，当前不声称已经执行：

| 能力 / 质量面 | 计划证据切口 | 证据边界 |
|---|---|---|
| N1 语境与安全 | SDK actor/scope/visibility 的受控输入；深链、撤销、登出、过期和受限路径；键盘/辅助技术入口。 | 只能证明客户端采取了安全展示/阻断姿态；不能证明 Chat 自己完成授权或创建 scope。 |
| N2 事实显化 | owner safe view/ref 的 fresh、stale、partial、unavailable、blocked 输入；GateCard、Turn、Artifact preview 的状态呈现。 | 只能证明来源、可见性、版本和降级被保留；不能用页面截图证明 owner truth 或正文完整性。 |
| N3 意图与结果 | local draft/intent、提交、receipt、pending、confirmed、rejected、failed、unknown、回查和治理入口状态序列。 | 只能以正式 owner result/receipt 证明业务结果；transport ACK、toast、optimistic view 或客户端日志不构成结果证据。 |
| N4 变化与恢复 | duplicate、乱序、gap、cursor-expired、revoked、断线、重启、缓存过期、resume/requery 输入；多端状态语义对照。 | 只能证明 reducer/reconnect/requery 采取了安全姿态；不证明已接通未确认的内部 event bus 或上游 cursor。 |
| 全仓安全与诊断 | store/cache/export/log/handoff 的敏感材料裁剪；诊断 sink 可用/失败；低敏 correlation。 | 只允许证明没有进入 Chat 证据边界的 forbidden body/secret；不能上传 raw log、内部 payload 或凭证。 |
| 可访问性与跨端 | 核心 happy/non-happy path 的键盘、屏幕阅读和等价恢复操作；Desktop/Web/Mobile shell 差异。 | 需要正式确认支持的 shell/辅助技术矩阵；当前只保留覆盖判断，不伪造兼容性结果。 |

## 8. 复杂度判断与设计取舍结论

本步复杂度主要来自四种状态同时存在：客户端局部交互状态、owner safe snapshot、异步命令结果和正式变化/恢复状态。若把它们压成一个 loading/success 字段，会在 Gate/Decision、unknown、撤销和离线场景产生越权或误报。因此采用以下控制取舍：

1. 以 N1～N4 作为质量映射主轴，以全仓约束保护 SDK-only、单一 truth、禁止正文和跨端语义。
2. 无正式 authority 时优先采用“可判断行为口径”，不把历史数字升级为当前承诺。
3. 将 accessibility 作为完整闭环的质量门禁，而不是只检查视觉页面。
4. 将客户端诊断限制为低敏、可关联的交互/恢复材料，诊断失败不得影响业务结果。
5. 将 SDK/owner blockers 直接保留在质量要求中；不能用 fake、缓存或旧事件协议伪造满足度。

## 9. 正式文档回填草稿

正式 `00-需求文档.md` §13 可回填为：

> L5-chat 的非功能要求以客户端质量边界表达。性能上，本地路由、选择、草稿、焦点和状态反馈不得无必要等待无关 owner，safe view、事件和恢复必须允许局部、有界、可解释的进展；精确性能预算待正式 authority，不继承旧首屏、P95 或固定规模数字。可用性上，actor/scope/visibility 无法验证时必须 fail-closed，单一 owner 故障按区域隔离，断线、重启、离线和未知结果只能恢复展示/草稿并明确 needs-action，不得恢复授权或业务成功。
>
> 安全上，所有业务读取、变化和意图提交均经 `L0-sdk`，平台 shell 只承载非业务适配能力；禁止内部 bus、owner 私有 API、共享数据库、forbidden body、credential、token、secret 和未脱敏 payload 进入 Chat 的持有、诊断、导出或 handoff。审计与可追溯要求 owner-derived view、Gate/Decision、Artifact/Workspace/Runtime 引用和命令结果在正式提供时可回指来源、版本、新鲜度、receipt 或 result；客户端诊断不替代业务审计。
>
> 幂等与一致性要求保持 local draft/intent、submitted/pending、confirmed/rejected/failed/unknown、formal event 和 owner truth 的区分；unknown 不盲目重放，duplicate、gap、过期和撤销不被静默跳过。可观测性要求页面、view model、store、SDK adapter、reducer 和低敏 handoff 使用一致状态分类且不泄露正文。Desktop、Web 和未来 Mobile shell 必须保持相同的业务语义与安全上限；N1～N4 的导航、阅读、发送、Gate 交互、错误、断线和恢复路径都必须具备键盘及受支持辅助技术的等价操作。

## 10. 待确认事项

| ID | 待确认事项 | 当前如何挂起 | 当前状态 |
|---|---|---|---|
| `CHAT-NF-Q-001` | 本地导航/草稿/焦点、safe view 加载、事件更新和命令回查的正式性能预算 | 先采用不被无关 owner 阻塞、有界、可解释和局部进展口径；不采用历史数字 | `open / blocks_numeric_acceptance` |
| `CHAT-NF-Q-002` | Chat 自身可用率/SLO 的 owner、测量窗口、依赖归因和降级模型 | 先采用语境 fail-closed、owner 局部隔离和恢复可解释口径；不替上游承诺 SLA | `open / blocks_numeric_slo` |
| `CHAT-NF-Q-003` | V1 Desktop 及后续 Web/Mobile 的受支持浏览器、辅助技术、输入方式和核心路径矩阵 | 先要求 N1～N4 适用路径存在等价辅助技术语义；具体兼容矩阵留待架构/测试阶段确认 | `open / blocks_exact_compatibility_matrix` |
| `CHAT-NF-Q-004` | SDK/Observability 的低敏诊断、correlation/ref、resume 和 handoff envelope | 只允许最小安全分类/ref；sink 失败不影响业务；未闭合时保持 blocked/deferred | `open / blocks_exact_observability_design` |
| `CHAT-NF-Q-005` | `CHAT-UP-001~007` 与 `WS-UP-001~008` 中会改变质量判断的正式 owner 合同 | 将相关能力标记为 pending/blocked/stale/unavailable，不伪造已满足 | `open / owner_contracts_pending` |

## 11. Step 13 自检与跨能力审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否逐项检查性能、可用性、安全、审计/可追溯、幂等/一致性、可观测性六类默认类别？ | pass | 六类均有独立要求和判断口径。 |
| 是否覆盖客户端必须的可访问性与跨端体验？ | pass | 以可访问性专项覆盖 N1～N4 正常与非理想路径，并约束 Desktop/Web/Mobile shell 语义一致。 |
| 每条要求是否有能力节点或全仓来源？ | pass | §7.2 映射 N1～N4 与全仓质量约束。 |
| “判断口径 / 目标值”是否为空或退化成口号？ | pass | 无 authority 的数值明确 `pending`，行为底线给出可判断条件。 |
| 是否继承旧首屏、P95、SLA、固定参与者数量或 AG-UI 事件合同？ | no | §5、§7.4 已将其隔离为历史材料或 owner 候选目标。 |
| 是否把实现方案写成需求？ | no | 未写监控平台、日志字段、缓存参数、重试算法、加密、数据库或具体测试步骤。 |
| 是否保护 owner truth、禁止正文、SDK-only、ACK/unknown、cache-not-authority 和 no-direct-bus 红线？ | pass | 已写入 NFR-CHAT-008~018 及 blocker 处理。 |
| 是否为 Step 14 提供可承接的验收切口与证据边界？ | pass | §7.3、§7.5、§7.6 只定义计划切口，未伪造结果。 |
| 是否发现会阻塞需求级 Step 14 的问题？ | no | 数值 authority、兼容矩阵和上游合同作为待确认项继续传递，不阻塞行为级验收收敛。 |

## 12. Step 13 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 六类默认非功能要求、可访问性专项、能力映射、历史阈值审计、证据边界和跨能力审计完成。 | 更新 flow 与项目台账，进入 Step 14。 |
| 文档级 | `pass_to_step_14` | 每项要求均有能力/全仓来源和判断口径；未确认数值、shell 矩阵和 owner 合同已显式挂起。 | 创建并完成 `00_req_step_14_acceptance_criteria.md`。 |
| 项目级 | `pass_with_authority_pending` | 性能/SLO/兼容矩阵/诊断 envelope 与 SDK/Workspace 合同仍待正式来源，但不伪称已完成。 | 只进入 Step 14；不得重建正式 `00` 或开始 `01`。 |

## 13. 本步结论

Step 13 将 L5-chat 的质量边界收敛为：本地交互与相关 owner 依赖必须可区分、可局部降级且不放大请求；不可验证的 actor/scope/visibility 必须 fail-closed；owner truth、safe snapshot、local intent、formal result 和变化恢复必须保持不同语义；所有正文、凭证、秘密和内部 payload 均不得进入 Chat；页面、store、adapter、reducer、诊断和 Desktop/Web/Mobile shell 必须保持同一安全状态分类；N1～N4 的正常与失败路径都要有等价可访问操作。历史性能数字、owner SLA、AG-UI/传输候选和固定规模不构成当前目标，正式 authority 和上游合同继续作为待确认项。下一步可进入 Step 14，将这些行为级质量要求收敛为验收条件。
## 14. 原型修复回写

原型新增质量切口：BPMN 整体图和阶段子流程在 Desktop-first shell 中保持可读、可键盘操作和可降级；并行分支、Gate、成员状态和 stale/unknown/recovery 状态不能依赖颜色单一表达；项目与群聊双向导航、跨端选择状态和离线恢复需保持语义一致。

- 自检：只增加可判断的体验约束，未伪造性能数值或兼容性结果。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

流程层级必须保持项目、阶段和节点位置感；流程状态必须同时表达来源和新鲜度；并行状态不能只依赖颜色；项目、群聊和成员入口在授权无法验证时必须 fail-closed；窄窗口和键盘路径必须可访问流程节点。


| ID | 类别 | 需求 | 判断口径 / 目标值 |
|---|---|---|---|
| `NFR-CHAT-001~002` | 性能 | 本地导航、语境选择、草稿、焦点和状态切换不得无必要等待无关 owner；safe view、事件和回查支持局部进展。 | 相关 owner 未返回或无关 owner 不可用时，本地交互仍有即时、可理解反馈；具体预算待 authority。 |
| `NFR-CHAT-003` | 性能 | 重连、重新查询、事件消费和命令回查不得因 duplicate、gap 或 unknown 形成无界请求放大或副作用重放。 | 每次请求可归因到所需 owner；unknown 不自动盲重放，遵守正式 SDK/owner retry、cursor 和幂等合同。 |
| `NFR-CHAT-004` | 可用性 | actor、scope、visibility 或授权语境无法验证、过期或撤销时，受保护内容和动作必须 fail-closed。 | 停止披露/提交，只给安全恢复方向；本地 route/draft 可保留但不得放行业务访问。 |
| `NFR-CHAT-005~007` | 可用性 | 单一 owner 故障按来源局部隔离；断线、Desktop 重启、离线启动和 resume 失败只能恢复带版本/可见性语境的展示与草稿。 | 页面区分 partial/stale/unavailable/blocked/reconnecting/needs-action/unknown；未开放 surface 不伪造 ready，不恢复授权或业务成功。 |
| `NFR-CHAT-008~011` | 安全 | 业务读取、变化消费和意图提交只能经 `L0-sdk`；平台 shell 只承载非业务适配；禁止 owner 私有 API、内部 bus、共享数据库、本地授权放宽、forbidden body、credential、token、secret 和撤销后的旧允许姿态。 | 只接受 owner safe view/summary/preview metadata/ref；无法证明安全时拒绝、裁剪或 unavailable；禁止正文进入量为零是语义底线。 |
| `NFR-CHAT-012~014` | 审计 / 可追溯 | owner-derived view、Gate/Decision、Artifact/Workspace/Runtime 引用和用户意图在正式提供时可回指 source、版本/新鲜度、receipt/result 或明确 unknown。 | 无正式引用时明确 unknown/missing；按钮、ACK、toast、刷新和客户端日志不能单独形成业务证据；诊断与业务审计分离。 |
| `NFR-CHAT-015~018` | 幂等 / 一致性 | owner truth 单一；local draft、submitted/pending、confirmed、rejected、failed、unknown 与 formal event 分层；reducer 显式处理 duplicate、乱序、gap、过期和撤销；跨端不改变业务语义。 | unknown 不盲重放；缺口/过期/撤销进入 requery/reconnect/blocked；不从时间戳猜顺序，shell 不把平台 ACK 变成业务成功。 |
| `NFR-CHAT-019~021` | 可观测性 | 页面、view model、store、SDK adapter、reducer、支持入口和低敏 handoff 使用一致状态分类，并能安全关联能力/owner/阶段。 | 能区分 fresh/stale/partial/unavailable/blocked 与提交/结果状态；诊断 sink 失败不改变业务结果、权限或恢复上限。 |
| `NFR-CHAT-022~023` | 可访问性专项 | N1～N4 的进入语境、阅读、草稿/发送、Gate、结果、错误、断线和恢复都有键盘及受支持辅助技术的等价路径；状态和变化不只靠视觉线索。 | 具体 shell/辅助技术矩阵待确认；任何适用核心目标无法理解、操作或安全恢复即不满足。 |
| `NFR-CHAT-024` | 跨端语义 | Desktop-first、Web shared UI 和未来 Mobile shell 的窗口、输入、通知、存储、深链和恢复差异不改变业务语义。 | 平台能力缺失时给出 unavailable/needs-action，不自行补造业务能力。 |

本节覆盖的正式非功能编号为：`NFR-CHAT-001`、`NFR-CHAT-002`、`NFR-CHAT-003`、`NFR-CHAT-004`、`NFR-CHAT-005`、`NFR-CHAT-006`、`NFR-CHAT-007`、`NFR-CHAT-008`、`NFR-CHAT-009`、`NFR-CHAT-010`、`NFR-CHAT-011`、`NFR-CHAT-012`、`NFR-CHAT-013`、`NFR-CHAT-014`、`NFR-CHAT-015`、`NFR-CHAT-016`、`NFR-CHAT-017`、`NFR-CHAT-018`、`NFR-CHAT-019`、`NFR-CHAT-020`、`NFR-CHAT-021`、`NFR-CHAT-022`、`NFR-CHAT-023`、`NFR-CHAT-024`。

历史 `<2s`、`≥99.9%`、`500+`、后端 P95、owner SLA、AG-UI 17 和 SSE/WebSocket 不作为当前 Chat 目标或合同。精确性能、SLO、辅助技术矩阵和诊断 envelope 需正式 authority；行为级安全、可用性、结果分层、可追溯、幂等、可观测性和可访问性要求当前有效。
