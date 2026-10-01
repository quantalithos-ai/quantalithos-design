# Step 14 · 验收标准

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §14「验收标准」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 14  
> 对应书写规范：`standards/document/需求文档书写规范.md` §4.14  
> 直接输入：`00_req_step_07_core_capability_loop.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_10_rules_boundary_constraints.md`、`00_req_step_11_data_requirements_ownership.md`、`00_req_step_13_non_functional_requirements.md`。  
> 本步只写可判断的验收条件和一票否决项，不写测试脚本、测试步骤、工具、CI、接口调用过程或运行结果。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 14 · 验收标准 |
| 输出文件 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes；需求 SOP Step 14、书写规范 §4.14 与中间产物规范 |
| 已读取前序输入 | yes；Step 7 能力闭环、Step 9 功能、Step 10 规则、Step 11 数据、Step 13 非功能 |
| 模块骨架 | done：五类验收、N1～N4 停审、一票否决、追溯审计和证据边界 |
| 进入条件 | `pass`；Step 13 已完成并通过门禁 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 按 N1～N4 形成核心能力闭环验收 | done | 见 §7.1 |
| 覆盖全部核心功能和外围功能的条件化边界 | done | 见 §7.2 |
| 覆盖规则/边界、数据归属和禁止正文 | done | 见 §7.3、§7.4 |
| 覆盖 Step 13 六类 NFR 与可访问性专项 | done | 见 §7.5 |
| 列出整体一票否决项并限制其范围 | done | 见 §7.6 |
| 完成能力级停审、跨能力追溯和遗漏审计 | done | 见 §7.7、§7.8 |
| 形成正式回填草稿、自检和门禁 | done | 见 §9、§11、§14 |

## 3. 本步输入与验收粒度边界

| 输入 | 本步使用方式 | 不直接写入的内容 |
|---|---|---|
| Step 7 核心能力闭环 | 先证明 N1～N4 各自成立，再证明整体入口闭环；能力箭头表示逻辑依赖，不表示测试顺序。 | 测试编排、调用链和实施排期。 |
| Step 9 功能需求 | 每个 `F-CHAT-*` 必须有功能能力验收；未闭合的 owner 正向面以 blocked/read-only 条件验收。 | API 调用步骤、页面脚本或实现任务。 |
| Step 10 规则 | 检查 scope、owner truth、结果分层、变化、撤销、缓存、平台和 no-direct-bus 红线。 | 代码断言、异常码、日志字段和内部校验方法。 |
| Step 11 数据归属 | 检查 Chat-owned local truth、owner safe snapshot、external ref 和禁止保存正文四类边界。 | 字段、表、索引、TTL、存储实现。 |
| Step 13 非功能 | 以行为口径验收性能隔离、可用性、安全、审计/可追溯、幂等/一致性、可观测性和可访问性。 | 历史 P95、首屏、SLA、固定参与者数量或未授权指标。 |

## 4. SOP 问题回答

### 4.1 哪些条件满足后核心闭环成立？

N1 能在正式 actor、scope 和 visibility 可验证时安全进入并保持语境；N2 能以 owner safe view/ref 显化 Conversation/Turn、成员、项目、运行、Gate/Decision 和 Artifact 等事实并保留来源与降级；N3 能分离草稿、用户意图、提交经历、正式结果和 unknown；N4 能对正式变化、重复、缺口、撤销、断线、重启和缓存失效保持可解释恢复。四个节点全部通过且没有越过 owner truth，Chat 的最小闭环才成立。

### 4.2 哪些功能满足后需求算完成？

核心 `F-CHAT-001~017` 均有对应验收条件；页面能观察到的结果和失败上限必须明确。SDK/owner exact surface 尚未闭合的正向能力不得伪称已接通，必须以 `blocked`、`read-only`、`partial` 或 `unavailable` 的安全姿态通过边界验收。外围 `F-CHAT-E01~E04` 只在正式合同和平台范围确认后条件化启用，不决定核心闭环成立。

### 4.3 哪些规则、数据和非功能约束必须满足？

不得本地授权、复制 owner truth、直订内部 bus、以按钮/ACK/缓存代替正式结果、从 ref 猜正文、用缓存延长可见性或在 unknown 下盲目重放；四类数据归属必须不重叠；语境失败必须 fail-closed，owner 故障必须局部隔离，状态必须可追溯、一致、可观察且具有键盘及受支持辅助技术的等价路径。

### 4.4 哪些失败情形属于一票否决？

只有会破坏整体 truth、权限、敏感数据边界、正式结果语义或适用核心可访问目标的情形进入一票否决。一般性能数字未确认、外围增强缺口、owner 正向合同未闭合本身不自动否决；若被伪装成 ready、成功或已授权，则转化为对应否决项。

## 5. 当前材料问题诊断

| 历史验收口径 | 问题 | 当前处理 |
|---|---|---|
| 以页面绿色、首屏 `<2s`、固定 P95、`99.9%` 或 `500+` 作为通过 | 场景、设备、负载、测量边界和 authority 不明，且混合 owner SLA 与客户端质量。 | 改为可判断的局部进展、状态解释、故障隔离和安全边界；数值 authority 继续挂起。 |
| HTTP、WebSocket、AG-UI ACK、toast、刷新或缓存命中即算成功 | 把 transport 或 UI 反馈误当 owner committed result。 | 只有正式 owner result/receipt 才能显示 confirmed；其余保持 submitted/pending/unknown。 |
| API 可达即算依赖验收通过 | 未验证 visibility、来源、降级、cursor、幂等和禁止正文。 | 验收 owner-safe seam、错误姿态、结果回链和局部降级；不验收私有 endpoint。 |
| GateCard、Artifact preview 或项目进度直接生成治理/完成结论 | 将客户端展示或缺失数据变成第二 truth。 | 只验收正式 owner 结果、safe ref/preview 和不确定性保留。 |
| 单独检查正常视觉页面的键盘能力 | 忽略撤销、错误、unknown、断线和恢复路径。 | 将 N1～N4 正常与非理想路径统一纳入可访问性验收。 |

## 6. 设计取舍

| 主题 | 不采用的做法 | 当前取舍 |
|---|---|---|
| 验收主轴 | 按页面数量或接口数量平铺检查。 | 按 N1～N4 小循环，再按五类验收组织追溯。 |
| 未闭合 owner surface | 隐藏缺口或用 mock 结果宣称完成。 | 以 blocked/read-only/partial/unavailable 为诚实边界；正向 surface pending。 |
| 结果确认 | 统一使用一个 success 状态。 | 保持 local intent、submitted、pending、confirmed、rejected、failed、unknown 的分层。 |
| 数据验收 | 只看页面是否显示内容。 | 同时验证 Chat-owned truth、safe snapshot、external ref 和 forbidden body。 |
| 数值与证据 | 沿用历史阈值或虚构 run/report/evidence。 | 先验收行为和安全底线；正式 authority 之后再补场景化数值。 |
| 一票否决 | 将普通缺陷、外围缺口全部列为否决。 | 只保留会打穿核心 truth、权限、敏感数据、结果语义或核心可访问性的情形。 |

## 7. 结构化中间产物

### 7.1 核心能力闭环验收

| 验收类别 | 验收项 | 验收条件 | 能力 / 功能 / 规则 / NFR 来源 |
|---|---|---|---|
| 核心能力闭环验收 | `AC-CHAT-001` N1 安全协作语境进入与保持 | 只有在正式 actor、scope 和 visibility 可验证时，入口、内容和动作才可进入相应可见/可操作姿态；语境过期、撤销、冲突或未知时，受保护内容与动作安全收紧，并提供最小披露的恢复方向。route、selection、deep-link 和恢复位置保持 Chat-local。 | `N1`; `F-CHAT-001~003`; `BR-CHAT-001~006`; `NFR-CHAT-004`, `008~011`, `022~024` |
| 核心能力闭环验收 | `AC-CHAT-002` N2 正式协作事实安全显化 | Conversation/Turn、成员、项目、运行、Gate/Decision 和 Artifact 只以 owner safe view/summary/ref/preview 显示；来源、版本/新鲜度、visibility、partial/stale/unavailable/blocked 可理解；不能从 ref、空列表或缺失字段猜正文、权限或完成结论。 | `N2`; `F-CHAT-004~008`; `BR-CHAT-007~013`; `NFR-CHAT-002`, `008~012`, `015`, `019`, `022~024` |
| 核心能力闭环验收 | `AC-CHAT-003` N3 用户意图受控发起与结果反馈 | 草稿、local intent/attempt、submitted/pending、confirmed、rejected、failed、unknown 和 owner receipt/result 可区分；只有正式 owner result 才能表示业务完成；治理入口受正式授权语境约束，unknown 不盲目重放。 | `N3`; `F-CHAT-009~012`; `BR-CHAT-014~020`; `NFR-CHAT-003`, `006`, `008~009`, `013`, `015~016`, `019~021` |
| 核心能力闭环验收 | `AC-CHAT-004` N4 变化、失败、离线与恢复连续性 | 正式 change/event/resume 输入能保留来源、版本和 visibility 语境；duplicate、out-of-order、gap、cursor-expired、revoked、reconnecting、requery、blocked 和 recovered 不被静默折叠；断线、Desktop 重启和缓存恢复不延长授权或制造业务成功。 | `N4`; `F-CHAT-013~017`; `BR-CHAT-021~028`; `NFR-CHAT-001~007`, `009~011`, `014`, `016~024` |
| 核心能力闭环验收 | `AC-CHAT-005` 整体闭环与反馈闭合 | N1～N4 均满足其条件；任一 owner 局部故障不会被错误扩散或成功掩盖；重新验证、回查和恢复能把失效/恢复反馈回语境、事实、意图和变化层；未开放能力不影响闭环的诚实性。 | `N1~N4`; `F-CHAT-001~017`; `BR-CHAT-001~028`; `NFR-CHAT-004~024` |

#### N1～N4 能力级停审

| 节点 | 停审结论 | 未通过时的边界 |
|---|---|---|
| N1 | 语境、失效、撤销、入口最小披露和 Chat-local route/selection 均可判断，`pass`。 | 任何受保护内容或动作在 actor/scope/visibility unknown 时不得进入后续验收；只允许安全恢复姿态。 |
| N2 | safe view/ref、来源、新鲜度、可见性、部分结果和正文禁止项均可判断，`pass_with_preview_contract_pending`。 | Artifact/Governance/Workspace 等精确 surface 未闭合时只验收 unavailable/blocked/read-only，不生成正文或 owner 结论。 |
| N3 | 草稿、意图、receipt/result、正式确认和 unknown 分层，`pass_with_governance_contract_pending`。 | 没有正式治理授权/receipt/Decision event 时不验收正向成功，只保留受控入口和未知状态。 |
| N4 | 变化、重连、缺口、撤销、缓存和 Desktop 重启均有保守姿态，`pass_with_resume_contract_pending`。 | 没有正式 cursor/resume 时不声称实时恢复已成立；缺口和过期必须 blocked/stale/requery。 |

### 7.2 功能能力验收

| 验收类别 | 验收项 | 验收条件 | 功能 / 故事来源 |
|---|---|---|---|
| 功能能力验收 | `AC-FR-CHAT-001` 入口、scope 与语境恢复 | `F-CHAT-001~003` 能让用户进入正式可见的 group/channel/dm/thread、项目或相关协作语境；入口受限、过期、撤销、登出、重启或 scope 改变时能恢复、清理或请求处理，不从 URL/缓存猜权限。 | `F-CHAT-001~003`; `US-CHAT-001~004` |
| 功能能力验收 | `AC-FR-CHAT-002` Conversation/Turn 与跨 owner 展示 | `F-CHAT-004~005` 能显示可理解的 Turn、线程关系、成员/项目/运行安全摘要、来源和降级；不复制 owner truth，不跨 owner 推断生命周期或完成状态。 | `F-CHAT-004~005`; `US-CHAT-005~006` |
| 功能能力验收 | `AC-FR-CHAT-003` Gate/Decision 与 Artifact 安全卡片 | `F-CHAT-006~007` 能显化 Gate/Decision 语境、责任/状态引用、Artifact safe ref/摘要/版本语境、预览或不可预览原因；治理和制品正文、Policy、Decision 和版本血缘仍归 owner。 | `F-CHAT-006~007`; `US-CHAT-007`, `US-CHAT-009` |
| 功能能力验收 | `AC-FR-CHAT-004` 来源、新鲜度与降级表达 | `F-CHAT-008` 能显式表达来源、visibility、fresh/stale/partial/unavailable/blocked/redacted/revoked 等姿态；空、缺失、裁剪和过期不被显示为完整结果。 | `F-CHAT-008`; `US-CHAT-008~009` |
| 功能能力验收 | `AC-FR-CHAT-005` 草稿、选择与普通/治理意图 | `F-CHAT-009~011` 能保存未提交草稿、回复目标、选择和安全引用，提供普通发送/重试及受控治理入口；草稿和点击不代表 owner truth，治理入口依赖正式授权语境。 | `F-CHAT-009~011`; `US-CHAT-010~012` |
| 功能能力验收 | `AC-FR-CHAT-006` 命令结果与不确定性反馈 | `F-CHAT-012` 能区分 submitted/pending/confirmed/rejected/failed/unknown，并在未知时提供查询、等待或人工处理方向；不得从 transport/AG-UI ACK 推导 confirmed。 | `F-CHAT-012`; `US-CHAT-011~013` |
| 功能能力验收 | `AC-FR-CHAT-007` 正式变化与重复/缺口处理 | `F-CHAT-013~014` 只消费 SDK formal change/resume，能处理 duplicate、乱序、gap、expired、revoked 并保留来源/版本；不直订内部 bus 或猜造 topic/offset。 | `F-CHAT-013~014`; `US-CHAT-014`, `US-CHAT-017` |
| 功能能力验收 | `AC-FR-CHAT-008` 断线、重启、离线展示与缓存 | `F-CHAT-015~016` 能在断线、Desktop 重启、离线启动和变化恢复后保留可解释历史、恢复语境和草稿；缓存有版本/visibility 上限，不离线授权、不确认业务成功。 | `F-CHAT-015~016`; `US-CHAT-010`, `US-CHAT-015~016` |
| 功能能力验收 | `AC-FR-CHAT-009` 低敏客户端诊断 | `F-CHAT-017` 能让支持人员看到连接、缓存、恢复和错误类别等低敏状态，并给出重连/重新查询提示；不展示 raw log、secret、内部 bus payload 或业务正文。 | `F-CHAT-017`; `US-CHAT-018` |
| 功能能力验收 | `AC-FR-CHAT-010` 外围搜索、通知、富文本/附件和 Mobile | `F-CHAT-E01~E04` 只有在正式可见性、平台和 Artifact ref 合同具备时才可启用；搜索/过滤只缩小已授权结果，通知不代表业务改变，附件只携带安全 ref，Mobile 不成为 V1 Desktop 前置。 | `F-CHAT-E01~E04`; `US-CHAT-E01~E04` |

### 7.3 规则 / 边界验收

| 验收类别 | 验收项 | 验收条件 | 规则来源 |
|---|---|---|---|
| 规则 / 边界验收 | `AC-BR-CHAT-001` 语境与入口边界 | 入口可见/可操作只能由正式 actor、scope、visibility 和 owner capability 支持；URL、深链、对象名、空列表、历史缓存、UI 隐藏状态不能推断权限或存在性；scope/visibility/登出/失效变化显式清理旧语境。 | `BR-CHAT-001~006` |
| 规则 / 边界验收 | `AC-BR-CHAT-002` owner-safe 事实与来源边界 | 页面事实可回链到 safe view/ref/summary/result；Chat 不复制 raw truth，不从 ref/缓存/错误差异猜正文、权限、生命周期或完成状态；fresh/stale/partial/unavailable/blocked/revoked 显式变化。 | `BR-CHAT-007~013` |
| 规则 / 边界验收 | `AC-BR-CHAT-003` 意图、治理与结果边界 | draft、selection、intent、ACK、receipt/result、owner confirmed 分离；按钮、表单校验、HTTP/websocket/AG-UI ACK、通知、toast 或 optimistic state 不代表完成；unknown 不盲重试；Chat 不直接写 owner truth。 | `BR-CHAT-014~020` |
| 规则 / 边界验收 | `AC-BR-CHAT-004` 变化、cursor、缓存与恢复边界 | owner change 只能经 SDK formal change/event/resume；不直订内部 bus、猜造 topic/offset 或用时间戳猜顺序；duplicate/gap/expired/revoked/reconnecting/requery/blocked/recovered 显式表达；缓存不延长可见性。 | `BR-CHAT-021~027` |
| 规则 / 边界验收 | `AC-BR-CHAT-005` 平台 shell 与外围边界 | Tauri Desktop、Web shared UI、Mobile Capacitor candidate、通知、托盘、快捷键、搜索、富文本和附件只提供适配或外围体验；不得改变 owner 权限、业务结果、Artifact visibility 或 V1 范围。 | `BR-CHAT-028`; `BR-CHAT-E01~E04` |

### 7.4 数据归属验收

| 验收类别 | 验收项 | 验收条件 | 数据来源 |
|---|---|---|---|
| 数据归属验收 | `AC-DR-CHAT-001` Chat-owned local truth | route/context、scope/selection/focus、draft、local intent/attempt、recovery context 和展示偏好只表达客户端局部真相；不被解释为 Conversation、Project、Member、Governance、Artifact、Workspace、Runtime 或 Observability truth。 | Step 11 §4.1；`F-CHAT-001~003`, `009~017` |
| 数据归属验收 | `AC-DR-CHAT-002` owner safe snapshot | Conversation/Turn、Identity/Member、Work/Project/Runtime、Governance、Artifact、Workspace 和 SDK 状态只能以获准的 safe view/summary/preview metadata 作为消费快照；随 owner/visibility/version/freshness 变化而更新或失效，不形成独立生命周期。 | Step 11 §4.2；`F-CHAT-004~008`, `013~017` |
| 数据归属验收 | `AC-DR-CHAT-003` external ref 与结果回链 | Conversation/Turn、Actor/Member、Project/Work、Gate/Decision、Artifact/Evidence、Workspace、Runtime/Observability 和 command receipt/result 只作为安全引用回链；引用不转移正文或 authority。 | Step 11 §4.3；`F-CHAT-004~012`, `017` |
| 数据归属验收 | `AC-DR-CHAT-004` forbidden body | Artifact/Evidence/Baseline 正文、治理裁决材料、credential/token/secret、Runtime/Tools/provider/sandbox 正文、Workspace projection、Bridges 正文/凭证和 Observability raw log/event payload 不进入 Chat 数据、缓存、诊断、错误、导出或 handoff 生命周期。 | Step 11 §4.4；`BR-CHAT-008`, `010~013`, `020`, `027` |
| 数据归属验收 | `AC-DR-CHAT-005` 不重复定义 truth | 同一 owner 事实不会同时被 Chat 声称为 truth、可替代快照和独立业务生命周期；跨 owner 联合 view 保留分域来源、visibility、freshness、coverage 和 availability。 | Step 11 §5~§7；`BR-CHAT-007~013`, `021~026`; `NFR-CHAT-015` |

### 7.5 非功能验收

| 验收类别 | 验收项 | 验收条件 | NFR 来源 |
|---|---|---|---|
| 非功能验收 | `AC-NFR-CHAT-001` 性能与请求隔离 | 本地导航、选择、草稿、焦点和状态切换不因无关 owner 阻塞；相关 safe view、事件和回查有局部且可解释进展；duplicate/gap/unknown 不导致无界请求放大或默认副作用重放。精确数字待 authority。 | `NFR-CHAT-001~003` |
| 非功能验收 | `AC-NFR-CHAT-002` 可用性与局部降级 | actor/scope/visibility 无法验证时 fail-closed；单 owner 故障只影响其依赖区域；发送、治理和恢复在未知时保持可解释；未开放 surface 稳定为 blocked/read-only/partial/unavailable。 | `NFR-CHAT-004~007` |
| 非功能验收 | `AC-NFR-CHAT-003` 安全与最小披露 | 业务读取、变化和意图提交均经 `L0-sdk`；不存在内部 bus/私有 API/共享数据库旁路、本地授权放宽、撤销后继续展示或 forbidden body/secret 进入 Chat。 | `NFR-CHAT-008~011` |
| 非功能验收 | `AC-NFR-CHAT-004` 审计与可追溯 | owner-derived view、Gate/Decision、Artifact/Workspace/Runtime 引用和命令结果在正式提供时可回指 source/version/freshness/receipt/result；客户端诊断与业务审计语义分离。 | `NFR-CHAT-012~014` |
| 非功能验收 | `AC-NFR-CHAT-005` 幂等与一致性 | owner truth 单一；local draft/intent、receipt/result、confirmed/rejected/failed/unknown 和 formal event 分层；unknown 不盲重放；reducer 对 duplicate/out-of-order/gap/expired/revoked 显式处理；跨端不改变业务语义。 | `NFR-CHAT-015~018` |
| 非功能验收 | `AC-NFR-CHAT-006` 可观测性与诊断隔离 | 页面、view model、store、SDK adapter、reducer、支持入口和正式低敏 handoff 对状态分类一致；能安全关联能力/owner/阶段；诊断 sink 失败不改变权限、业务结果或恢复上限。 | `NFR-CHAT-019~021` |
| 非功能验收 | `AC-NFR-CHAT-007` 可访问性与跨端等价 | N1～N4 的进入、阅读、草稿/发送、Gate、结果、错误、断线和恢复目标均有键盘及受支持辅助技术的等价路径；状态不只靠颜色/位置/瞬时提示；shell 缺能力时仍给出可理解的安全降级。 | `NFR-CHAT-022~024` |

### 7.6 一票否决项

以下任一情形发生时，正式 `00` 需求不得判定为通过；一票否决不承载一般缺陷、外围增强缺口或尚待 authority 的普通数值。

| ID | 一票否决情形 | 触发的能力 / 边界 |
|---|---|---|
| `VETO-CHAT-001` | Chat 通过内部 bus、owner 私有 API、共享数据库、服务源码或本地聚合规则读取/修改业务事实，或形成 owner truth 的替代投影。 | `BR-CHAT-007~010`, `018`, `021~022`; `NFR-CHAT-008`, `015` |
| `VETO-CHAT-002` | actor/scope/visibility/资格不可验证、已撤销或冲突时仍披露受保护内容、对象存在性或危险动作入口。 | `BR-CHAT-001~006`, `011~012`; `NFR-CHAT-004`, `010` |
| `VETO-CHAT-003` | 以按钮、HTTP/websocket/AG-UI ACK、toast、通知送达、刷新、缓存命中或 optimistic 状态宣称业务已完成，或在 unknown 下无正式依据重放副作用。 | `BR-CHAT-014~019`; `NFR-CHAT-006`, `013`, `016` |
| `VETO-CHAT-004` | credential/token/secret、Artifact/Governance/Runtime/Workspace/Bridges/Observability forbidden body 或未脱敏内部 payload 进入 Chat 数据、缓存、日志、诊断、错误、导出或 handoff 生命周期。 | Step 11 §4.4; `BR-CHAT-008`, `010~013`, `020`, `027`; `NFR-CHAT-009` |
| `VETO-CHAT-005` | GateCard、Artifact card、项目进度、成员/运行摘要、固定指标/阈值或平台 UI 被用来生成/宣称审批、Decision、完成、合规、审计、Artifact 或 Runtime 结论。 | `BR-CHAT-007~013`, `019`; `NFR-CHAT-012`, `015`, `019` |
| `VETO-CHAT-006` | 事件缺口、撤销、过期、断线或局部 owner 失败被静默掩盖，导致旧缓存继续授权、错误推进业务状态或把局部成功当全局事实。 | `BR-CHAT-021~027`; `NFR-CHAT-005`, `007`, `017`, `018` |
| `VETO-CHAT-007` | 任一适用核心目标在键盘、读屏或受支持辅助技术路径上无法理解、操作或安全恢复，而视觉路径可用被用来抵消。 | `BR-CHAT-028`; `NFR-CHAT-022~024` |

未闭合的 SDK/owner exact contract、性能数字、兼容矩阵或外围 activation 本身不触发一票否决；若被伪装为 ready、成功、可授权或正式结果，则触发相应否决项。

### 7.7 能力级与跨能力验收停审

| 节点 / 范围 | 功能覆盖 | 规则覆盖 | 数据覆盖 | NFR 覆盖 | 一票否决覆盖 | 结论 |
|---|---|---|---|---|---|---|
| N1 | `F-CHAT-001~003` | `BR-CHAT-001~006` | `AC-DR-CHAT-001~004` 相关部分 | `NFR-CHAT-001`, `004`, `008~011`, `015`, `019`, `022~024` | VETO-001/002/004/007 | `pass` |
| N2 | `F-CHAT-004~008` | `BR-CHAT-007~013` | `AC-DR-CHAT-002~005` 相关部分 | `NFR-CHAT-001~002`, `005`, `008~012`, `015`, `019`, `022~024` | VETO-001/002/004/005/007 | `pass_with_preview_contract_pending` |
| N3 | `F-CHAT-009~012` | `BR-CHAT-014~020` | `AC-DR-CHAT-001`, `003~005` 相关部分 | `NFR-CHAT-001`, `003`, `006`, `008~009`, `011`, `013`, `015~016`, `019~021`, `022~024` | VETO-001/002/003/004/005/007 | `pass_with_governance_contract_pending` |
| N4 | `F-CHAT-013~017` | `BR-CHAT-021~028` | `AC-DR-CHAT-001~005` 相关部分 | `NFR-CHAT-001~007`, `009~011`, `014`, `016~024` | VETO-001/003/004/006/007 | `pass_with_resume_contract_pending` |
| 外围增强 | `F-CHAT-E01~E04` | `BR-CHAT-E01~E04` | 外围引用、偏好和安全 ref | `NFR-CHAT-001~003`, `008~011`, `018`, `022~024` | 适用时受 VETO-002/004/005/007 约束 | `pass_conditional` |

### 7.8 跨能力验收审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| N1～N4 是否均有闭环验收和停审结论？ | pass | `AC-CHAT-001~005` 覆盖四节点和整体反馈闭合。 |
| 每个核心功能是否有验收承接？ | pass | `AC-FR-CHAT-001~009` 覆盖 `F-CHAT-001~017`；外围由 `AC-FR-CHAT-010` 条件化承接。 |
| 每类硬规则是否有验收？ | pass | `AC-BR-CHAT-001~005` 覆盖 `BR-CHAT-001~028` 与外围边界。 |
| 四类数据归属是否有验收？ | pass | `AC-DR-CHAT-001~005` 覆盖 local truth、safe snapshot、external ref、forbidden body 和无重复归属。 |
| 六类 NFR 与可访问性是否有验收？ | pass | `AC-NFR-CHAT-001~007` 覆盖 Step 13 全部 `NFR-CHAT-001~024`。 |
| 是否有无来源验收项、重复验收或边界串线？ | pass | 每项均回指能力、功能、规则、数据或 NFR；同一 owner 只按其正式 truth 归属。 |
| 一票否决是否过宽？ | pass | 只列 truth、权限、敏感数据、正式结果、恢复安全和核心可访问性破坏。 |
| 是否伪造 evidence、run、report、verdict、signoff 或 readiness？ | pass | 只写验收条件和未来可观察证据边界，不声称已执行。 |

## 8. 证据边界说明

验收条件未来可由正式 SDK/owner 合同、受控输入下的客户端可见状态、store/view model/reducer 状态转移和低敏诊断关联来证明；本步不创建测试步骤，也不产生运行结果。以下证据边界必须保持：

- 客户端状态只证明展示、提交经历、恢复姿态或安全阻断，不证明 owner truth、授权、Decision、Artifact 正文或 Workspace projection。
- owner receipt/result、source/version/freshness/visibility 和 formal event/resume 只有在正式提供时才可作为对应业务验收依据；缺失时只能验收 unknown/blocked/unavailable。
- 截图、toast、transport ACK、客户端日志、缓存命中或页面刷新不能单独证明业务完成、授权或治理结论。
- 可访问性验收必须覆盖 N1～N4 的正常与非理想路径；具体 shell/辅助技术组合由后续正式矩阵确认，当前不伪造兼容性结果。

## 9. 复杂度判断

本步形成 5 项核心闭环验收、10 项功能能力验收、5 项规则/边界验收、5 项数据归属验收、7 项非功能验收和 7 项一票否决项。表格数量用于追溯覆盖，不是测试用例或实现任务。SDK/owner exact surface、性能/SLO 数值、辅助技术矩阵和外围 activation 继续保持 pending；它们不妨碍行为级验收，但阻塞对应的精确正向证据和数值门槛。

## 10. 正式文档回填草稿

正式 `00-需求文档.md` §14 可回填：

1. `AC-CHAT-001~005` 的 N1～N4 核心能力闭环验收及节点停审结论；
2. `AC-FR-CHAT-001~010` 的功能能力验收，保留外围条件化姿态；
3. `AC-BR-CHAT-001~005` 的规则/边界验收；
4. `AC-DR-CHAT-001~005` 的数据归属验收；
5. `AC-NFR-CHAT-001~007` 的非功能验收；
6. `VETO-CHAT-001~007` 一票否决项。

正式正文必须保留“未闭合正向 surface 以 blocked/read-only 通过边界、不得伪造 ready”的口径，不写测试步骤、工具、命令、run、截图、报告或现成 evidence。

## 11. 待确认事项

| ID | 待确认事项 | 当前如何挂起 | 当前状态 |
|---|---|---|---|
| `CHAT-AC-Q-001` | 性能、可用率、负载规模和跨端兼容矩阵的正式 authority | 先按行为级条件验收；获得 authority 后再补场景化目标，不恢复历史数字 | `open / blocks_numeric_acceptance_only` |
| `CHAT-AC-Q-002` | 各 owner 正向 query/command/result/ref exact contract 与 activation | 未闭合面按 blocked/read-only/unavailable 验收；不得用 mock 或文档宣称 ready | `open / blocks_positive_surface_acceptance` |
| `CHAT-AC-Q-003` | Governance receipt/Decision、Conversation/Workspace cursor/resume、Artifact preview/ref 的消费合同 | 保留受控入口、safe view 和 unknown/requery 边界；具体正向结果待 owner/SDK 确认 | `open / owner_contracts_pending` |
| `CHAT-AC-Q-004` | V1 Desktop 及后续 Web/Mobile 的辅助技术和诊断安全 envelope | 当前要求适用核心目标等价完成；具体支持组合与低敏关联字段后移 | `open / blocks_exact_evidence_matrix` |

## 12. Step 14 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按核心闭环、功能、规则/边界、数据、非功能五类组织？ | pass | 五类均有独立表和来源映射。 |
| 每条验收是否写可判断条件而非测试步骤？ | pass | 未写脚本、命令、工具、CI 或调用过程。 |
| 是否覆盖 N1～N4、全部核心功能和外围条件？ | pass | 核心 `F-CHAT-001~017` 与外围 `F-CHAT-E01~E04` 均有承接。 |
| 是否覆盖 truth、权限、结果、禁止正文、降级、恢复和可访问性边界？ | pass | 规则、数据、NFR 和一票否决交叉覆盖。 |
| 是否列出且限定一票否决项？ | pass | 只保留整体 truth/权限/敏感数据/正式结果/核心可访问性破坏。 |
| 是否允许 blocked/read-only 作为未开放 owner 的诚实结果？ | pass | exact surface pending 时不伪称正向 ready。 |
| 是否继承旧 P95、首屏、SLA、固定参与者数量或 AG-UI 合同？ | no | 数值和传输只在历史污染审计中出现。 |
| 是否伪造运行、测试、artifact、report、evidence、verdict、signoff、readiness 或 commit？ | no | 仅定义验收条件、否决边界和未来证据限制。 |
| 是否发现阻塞 Step 15 的需求级问题？ | no | 上游合同、数值 authority、兼容矩阵和诊断 envelope 进入风险/待确认，不阻塞风险收纳。 |

## 13. Step 14 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 五类验收、N1～N4 停审、功能/规则/数据/NFR 追溯、一票否决和证据边界完成。 | 更新 flow 与项目台账，进入 Step 15。 |
| 文档级 | `pass_to_step_15` | 关键能力、核心功能、硬规则、数据归属和质量要求均有可判断验收；未闭合 surface 保持 blocked/read-only。 | 创建并完成 `00_req_step_15_risks_open_questions.md`。 |
| 项目级 | `pass_with_open_contracts` | exact owner surface、数值目标、辅助技术矩阵和诊断 envelope 仍待确认，不伪称 readiness。 | 只进入 Step 15；不得重建正式 `00` 或开始 `01`。 |

## 14. 本步结论

Step 14 将 L5-chat 的验收收敛为五类可判断条件：N1～N4 能力闭环成立，核心 `F-CHAT-001~017` 有外部结果和失败上限，`BR-CHAT-001~028` 与外围边界不串线，local truth/safe snapshot/external ref/forbidden body 数据归属正确，Step 13 的六类质量和可访问性要求有行为承接。验收允许未闭合 owner surface 诚实地保持 blocked/read-only/unavailable；只有绕过 SDK/owner、越权披露、制造第二 truth、把 ACK 当业务成功、保存 forbidden body、掩盖变化/撤销/失败或破坏适用核心可访问性的情形才是一票否决。下一步可进入 Step 15，收纳这些结论中的风险和待确认事项。
## 15. 原型修复回写

新增验收切口要求：项目与项目进度可在同一上下文互达；整体 BPMN 节点可进入阶段子流程；并行分支和汇聚、独立 Gate、关联群聊和公司成员目录均能显示 owner 返回的状态；无权、过期、未知和离线情形不得伪造成功。

- 新增编号：`AC-FR-CHAT-011~014`。
- 自检：验收定义行为条件与证据边界，不声称已运行或已 ready。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

新增验收覆盖项目下钻、项目/群聊双向入口、并行网关与 Governance Gate 分离、公司成员/项目成员/群聊成员隔离；原型不构成这些验收的运行证据。


### 14.1 核心能力闭环验收

| 验收项 | 验收条件 |
|---|---|
| `AC-CHAT-001` N1 语境进入与保持 | 只有正式 actor、scope、visibility 可验证时，入口、内容和动作才进入可见/可操作姿态；撤销、过期、冲突或未知时安全收紧；route/selection 保持 Chat-local。 |
| `AC-CHAT-002` N2 正式事实显化 | Conversation/Turn、成员、项目、运行、Gate/Decision、Artifact 等只以 owner safe view/ref 显示，来源、版本/新鲜度、visibility 和降级可理解；不从 ref 猜正文或完成结论。 |
| `AC-CHAT-003` N3 受控意图与结果 | draft、local intent/attempt、submitted/pending、confirmed、rejected、failed、unknown 和 owner receipt/result 可区分；只有正式 owner result 才能表示业务完成。 |
| `AC-CHAT-004` N4 变化与恢复 | formal change/resume 保留来源、版本和 visibility；duplicate、乱序、gap、expired、revoked、reconnecting、requery、blocked 和 recovered 不被静默折叠；缓存/重启不延长授权。 |
| `AC-CHAT-005` 整体闭环 | N1～N4 均通过，owner 局部故障不会被错误扩散或成功掩盖，未开放能力保持 blocked/read-only/unavailable。 |

### 14.2 功能能力验收

| 验收项 | 覆盖功能 | 通过条件 |
|---|---|---|
| `AC-FR-CHAT-001` 入口与语境 | `F-CHAT-001~003` | 正式可见入口可进入；失效、撤销、登出、重启和 scope 改变能恢复、清理或提示处理，不从 URL/缓存猜权限。 |
| `AC-FR-CHAT-002` 对话与跨 owner 展示 | `F-CHAT-004~005` | Turn、线程、成员/项目/运行摘要有来源和降级，不复制 truth 或推断生命周期。 |
| `AC-FR-CHAT-003` Gate/Artifact 卡片 | `F-CHAT-006~007` | Gate/Decision 语境和 Artifact ref/预览/不可用原因可见，正文、Policy、Decision 和版本血缘仍归 owner。 |
| `AC-FR-CHAT-004` 来源和降级 | `F-CHAT-008` | fresh/stale/partial/unavailable/blocked/redacted/revoked 显式表达，空/缺失/裁剪不当完整。 |
| `AC-FR-CHAT-005` 草稿与意图 | `F-CHAT-009~011` | 未提交草稿与选择可保存；普通和治理入口受正式 owner 语境约束，点击不等于业务提交。 |
| `AC-FR-CHAT-006` 结果与 unknown | `F-CHAT-012` | submitted/pending/confirmed/rejected/failed/unknown 可区分，unknown 给出查询/等待/人工方向，不从 ACK 推导 confirmed。 |
| `AC-FR-CHAT-007` 正式变化与缺口 | `F-CHAT-013~014` | 只消费 SDK formal change/resume，duplicate/乱序/gap/expired/revoked 可解释，不直订内部 bus。 |
| `AC-FR-CHAT-008` 断线、重启、缓存 | `F-CHAT-015~016` | 恢复保留带版本/visibility 的展示和草稿；缓存不授权、不确认业务。 |
| `AC-FR-CHAT-009` 低敏诊断 | `F-CHAT-017` | 支持人员能看到低敏连接/缓存/恢复/错误分类，不接触 raw log、secret、内部 payload 或业务正文。 |
| `AC-FR-CHAT-010` 外围增强 | `F-CHAT-E01~E04` | 仅在正式合同具备时启用；搜索只缩小授权范围，通知不代表业务改变，附件只携安全 ref，Mobile 不成为 V1 前置。 |
| `AC-FR-CHAT-011` 项目详情与流程下钻 | `F-CHAT-018` | 项目详情可切换概览、进度、群聊、工作项和证据；项目进度可从整体流程进入阶段子流程和节点详情。 |
| `AC-FR-CHAT-012` 项目与群聊双向入口 | `F-CHAT-019` | 一个群聊最多绑定一个项目，一个项目可关联多个群聊；入口和可见性由正式 owner projection 决定。 |
| `AC-FR-CHAT-013` BPMN 并行结构 | `F-CHAT-020` | 并行分叉、分支和并行汇聚独立表达；汇聚后 Governance Gate 单独显示，Chat 不自行判断完成或批准。 |
| `AC-FR-CHAT-014` 公司成员目录 | `F-CHAT-021` | 公司级成员目录、项目成员和群聊成员分别显示来源与访问状态，不从一个集合推断另一个集合。 |

### 14.3 规则、数据与质量验收

| 验收类别 | 验收项 | 通过条件 |
|---|---|---|
| 规则/边界 | `AC-BR-CHAT-001~005` | 语境、owner-safe 事实、意图/治理、变化/cursor/cache、平台/外围边界不越权；客户端只能收紧。 |
| 数据归属 | `AC-DR-CHAT-001~005` | Chat-owned local truth、owner safe snapshot、external ref、forbidden body 和无重复 truth 均符合 §11。 |
| 非功能 | `AC-NFR-CHAT-001~007` | 本地交互与相关 owner 有界且可解释；语境 fail-closed；安全/追溯/幂等/可观测/可访问性/跨端语义均满足行为口径。 |

### 14.4 一票否决项

以下任一情形发生，正式 `00` 不得判定为通过：

1. Chat 通过内部 bus、owner 私有 API、共享数据库、服务源码或本地聚合规则取得/修改业务事实，或形成 owner truth 替代投影。
2. actor/scope/visibility/资格不可验证、已撤销或冲突时仍披露受保护内容、对象存在性或危险动作入口。
3. 以按钮、ACK、toast、通知、刷新、缓存或 optimistic 状态宣称业务完成，或在 unknown 下无正式依据重放副作用。
4. credential/token/secret、Artifact/Governance/Runtime/Workspace/Bridges/Observability forbidden body 或未脱敏 payload 进入 Chat 的数据、缓存、日志、诊断、错误、导出或 handoff 生命周期。
5. GateCard、项目/成员/运行摘要、固定指标/阈值或平台 UI 被用来生成/宣称审批、完成、合规、审计、Artifact、Workspace 或 Runtime 结论。
6. 事件缺口、撤销、过期、断线或 owner 局部失败被静默掩盖，导致旧缓存继续授权、错误推进状态或把局部成功当全局事实。
7. 任一适用核心目标在键盘、读屏或受支持辅助技术路径上无法理解、操作或安全恢复，而视觉路径可用被用来抵消。

未闭合 exact owner contract、性能数值、兼容矩阵或外围 activation 本身不触发否决；若被伪装成 ready、成功、可授权或正式结果，则触发相应否决项。
