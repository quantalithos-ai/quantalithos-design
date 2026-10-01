# Step 12 · 横切关注点

> 架构主题：把安全、审计与可追溯、可观测性、韧性/恢复、性能/容量和配置/变更控制落实到 `L5-chat` 的主线边界。
> 当前状态：已完成本 Step 的横切类别判断、逐架构单元适用性停审、约束表和跨横切审计；允许进入 Step 13。
> 直接输入：`01_arch_step_02_arch_goals_constraints.md`、`01_arch_step_07_dependency_direction.md`、`01_arch_step_08_data_ownership_consistency.md`、`01_arch_step_09_key_interactions_communication.md`、`01_arch_step_10_key_technology_selection.md`、`01_arch_step_11_alternatives_tradeoffs.md`、`00-需求文档.md` §7/§10/§11/§12/§13/§15。
> 本步限制：只写长期作用于多个边界/交互/数据关系的架构约束；不写安全手册、监控配置、压测脚本、运维值班、密钥脚本或具体指标。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 · 横切关注点 |
| 前置门禁 | Step 11 `pass` |
| 本步目标 | 判断哪些横切要求长期压在 Chat 主线之上，并给出可审查的判断口径和架构保护目标。 |
| 本步输出 | 横切约束表、架构单元适用矩阵、逐项停审、主线映射、跨横切审计和 §13 回填草稿。 |
| 本步不展开 | 具体安全配置、监控/告警实现、性能压测、运维手册、密钥存放、数值 SLO 和代码细节。 |
| 数值口径 | `CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 未提供 authority；本步只写行为底线和判断方式，不伪造数字。 |

## 2. SOP 问题回答

### 2.1 安全边界如何处理？

Chat 的安全边界由 SDK-only 接入、actor/scope/visibility 验证、fail-closed、最小披露、受限本地持久化、撤销/登出清理、平台 shell 隔离和 forbidden body 排除共同组成。任何 URL、深链、空列表、对象名、缓存、通知、连接状态或按钮都不能成为权限、存在性或业务成功的替代来源。可访问性也属于安全表达：受限、等待、失败、unknown、撤销和清理状态必须在键盘、屏幕阅读器和支持的辅助技术路径中等价可理解。

### 2.2 可观测性需要覆盖哪些正式对象和关键链路？

可观测性只覆盖客户端运行承载、SDK 接入阶段、safe view/change/resume 消费阶段、命令结果姿态、恢复阶段、来源/visibility/freshness 降级和低敏错误分类。它需要让支持者知道“哪个客户端阶段、哪个能力类别、哪种结果姿态、是否存在 gap/unknown”，但不要求 Chat 保存 raw log、外部正文、credential 或 Observability backend truth。正式审计、evidence、report 和后端观测仍由 `L4-observability` owner 承担。

### 2.3 可用性和韧性需要守住什么底线？

单一 owner 或平台能力失败不能拖垮所有页面，也不能让 Chat 用其他来源补齐失效真相。可恢复失败必须允许 stale、partial、pending、unknown、reconnecting、needs-action、requery 或清理；不可验证的 visibility 必须 fail-closed。重连、重启、恢复和后台承接不能自动确认副作用或盲目重放未知命令。

### 2.4 性能/容量需要给出什么口径？

当前不能安全固定数值预算，但可以固定结构性口径：页面初始入口、局部 safe view、用户意图接收和可访问状态反馈不能因跨域聚合、全量正文复制或不当同步闭环产生不可控放大；变化消费、缓存、恢复和诊断必须按局部语境隔离；大型跨域视图应允许部分、延后或按需承接。精确延迟、吞吐、设备数和 SLO 继续挂起到有 authority 的 NFR/验收材料。

### 2.5 配置如何管理？

配置只能影响已收稳的宿主能力、缓存/恢复策略、redaction profile、诊断 allowlist 和候选能力启用，不能改变 owner truth、SDK-only 边界、结果门控、fail-closed 或禁止正文规则。任何会改变可见性、命令重放、跨域聚合、平台业务语义或数据留存上限的开关，都必须被视为架构变更而不是普通运行配置。

### 2.6 审计与可追溯性如何保证？

关键入口判断、intent/attempt、formal receipt/result/change、unknown、visibility 撤销、requery/resume、清理和降级姿态必须能通过低敏引用、来源、版本/水位、阶段和结果类别回链。追溯材料不能靠保存 raw body 或完整日志实现，也不能把 Chat-local 诊断升级为正式 audit/evidence。任何无法安全关联的结果保持 unknown 或 opaque。

### 2.7 哪些横切项与本仓无关？

Chat 不负责服务端数据库备份、Runtime/Tools/Sandbox 隔离、外部平台桥接安全、Observability backend 运维、owner Policy 引擎、全局认证签发或跨域审计报告。它只承接这些能力在客户端的正式边界、safe summary/ref/result 和低敏 handoff，不把边界外治理细节复制进本仓横切主线。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “前端日志全部上报即可观测” | raw payload 泄露且 UI log 被误当正式观测。 | 采用低敏阶段/结果/关联分类，Observability backend 外置。 |
| “性能目标固定为历史数字” | 无 authority、工作负载和证据，形成伪 NFR。 | 只写结构性放大/隔离/局部承接口径。 |
| “缓存和离线提高可用性” | 缓存延长授权，离线副作用误报成功。 | 将可用性约束为安全展示、草稿、恢复和明确 unknown。 |
| “安全由登录和隐藏按钮保证” | shell/路由状态替代正式 actor/scope/visibility。 | SDK formal visibility + fail-closed + 清理。 |
| “配置开关可以开启任意 owner 聚合/重试” | 配置绕过架构边界和幂等语义。 | 配置变更不能改 truth、重放和 forbidden body 边界。 |
| “辅助功能后补” | 不同平台无法理解 restricted/unknown/撤销等状态。 | 可访问状态表达进入共享语义横切主线。 |

## 4. 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界与可访问状态 | SDK/平台接缝、导航、视图、意图、缓存、恢复和所有平台路径 | 外部能力必须经正式边界；actor/scope/visibility 无法验证时 fail-closed；restricted/unknown/revoked 等状态必须以等价可访问语义表达；不得保存 forbidden body/secret。 | 保护 owner truth、用户隐私、授权边界和可理解的安全降级。 | 该要求同时作用于依赖、数据、交互、shell 和本地持久化，不是单个 UI 控件的安全规则。 |
| 审计与可追溯 | 入口判断、intent/attempt、receipt/result/change、requery/resume、撤销、清理、降级和关键用户可见结论 | 关键判断和状态变化必须保留低敏来源、阶段、版本/水位、结果类别或安全 ref；无法关联时保持 unknown；不得用 raw body/完整日志替代回链。 | 保护争议复盘、结果解释、治理回链和不确定性边界。 | 它横切数据归属、一致性、通信和诊断，不等于后端 audit/evidence 实现。 |
| 可观测性 | 客户端运行承载、SDK 接入、safe material 消费、变化恢复、命令状态、失败降级和诊断 handoff | 必须能够区分入口阶段、能力类别、transport/业务结果姿态、gap/unknown/reconnect 和 sink 失败；低敏诊断与业务主路径隔离。 | 保护关键状态是否成立、失败是否可解释和支持人员能否安全定位。 | 这是客户端可见性约束，不是监控产品、告警规则或 Observability backend 配置。 |
| 韧性 / 恢复能力 | 同步失败、异步未达、cursor/resume、断线、重启、本地存储、撤销和后台承接 | 可恢复失败必须允许挂起、重查、延后收敛或安全清理；unknown 不得盲重放；单一 owner/平台故障必须局部隔离。 | 保护失败后的正式恢复性格、幂等边界和局部可用性。 | 它横切运行承载、数据一致性、通信和状态模型，不是操作手册或恢复脚本。 |
| 性能 / 容量约束 | 初始入口、局部 safe view、消息/卡片显化、变化消费、恢复和跨域摘要 | 不得因全量正文复制、跨域本地聚合、强行同步闭环或无界缓存造成结构性放大；允许局部、分页/按需和延后承接；具体数字待 authority。 | 保护关键交互在规模和数据变化下仍可成立。 | 这里约束架构形态，不伪造 P95、SLO、并发数、设备数或压测结果。 |
| 配置与变更控制 | SDK capability、平台宿主能力、缓存/恢复、redaction、诊断 allowlist、候选功能和主路径开关 | 配置不得绕过 SDK-only、fail-closed、结果门控、forbidden body、owner ownership 或 unknown 安全；涉及主线边界、重放、留存和跨域聚合的变更必须按架构变更处理。 | 保护已收稳的主线不被运行配置或平台差异偷偷改写。 | 该要求持续作用于技术选型、数据、通信和平台演进，不是配置键清单。 |

## 5. 横切类别适用矩阵

| 架构单元 | 安全边界/可访问 | 审计追溯 | 可观测性 | 韧性/恢复 | 性能/容量 | 配置/变更 | 单元停审 |
|---|---|---|---|---|---|---|---|
| 协作体验语境 | 全适用：来源、visibility、redaction、等价状态表达 | 全适用：来源、版本/水位、结果姿态和降级可回链 | 全适用：视图阶段、freshness、partial/blocked | 全适用：stale、gap、requery、局部隔离 | 适用：局部视图、按需/分页、避免跨域全量组合 | 适用：视图能力开关不能放宽权限/正文 | `pass` |
| 受控协作意图 | 全适用：授权入口、unknown、最小披露 | 全适用：attempt、receipt/result、用户可见结论 | 全适用：submitted/pending/confirmed/unknown/failed | 全适用：unknown probe、幂等边界、禁止盲重放 | 适用：意图反馈不能被无界同步拖慢 | 全适用：重试、能力启用和结果门控不得被配置绕过 | `pass` |
| 安全语境与导航 | 全适用：actor/scope/visibility、深链、登出清理、可访问受限态 | 适用：入口来源、重新验证、撤销/清理 ref | 适用：session/scope/visibility 阶段和失败类别 | 全适用：失效、撤销、重启、旧语境清理 | 适用：导航恢复不能触发无界查询或越权缓存 | 全适用：认证/visibility/深链策略变更需受控 | `pass` |
| 变化与恢复连续性 | 全适用：安全 resume、撤销、redaction、未知结果 | 全适用：cursor/resume 语境、gap、requery 和结果 ref | 全适用：变化送达/未达、重复、乱序、过期、sink 失败 | 全适用：重连、缺口、重启、延后收敛 | 适用：局部重查、增量/按需承接、避免无界回放 | 全适用：恢复/重放/缓存策略不能改业务语义 | `pass` |
| 平台体验与可访问性 | 全适用：宿主权限、剪贴板/通知最小披露、等价路径 | 适用：平台能力姿态和用户可见降级 ref | 适用：宿主能力缺失、通知/辅助技术状态 | 全适用：平台后台/返回/恢复和清理 | 适用：宿主限制不能放大主路径；具体预算待定 | 全适用：shell capability 开关不能改 owner 结果 | `pass` |
| owner-safe 材料镜像 | 全适用：provenance、redaction、body-free、visibility | 全适用：来源、版本/水位、preview/result/ref | 全适用：来源新鲜度、不可用、部分和撤销 | 全适用：过期、缺口、重查和清理 | 全适用：最小材料、按需预览、禁止全量正文 | 全适用：safe surface 和存留策略不能被随意放宽 | `pass` |
| 本地展示与恢复投影 | 全适用：最小持久化、过期/登出清理、受限显示 | 适用：恢复来源、清理、unknown 和用户提示 | 适用：缓存命中/失效、恢复阶段、存储失败 | 全适用：断线、重启、离线草稿、清理和重新验证 | 适用：有界缓存、局部恢复、避免无界快照 | 全适用：留存、redaction、恢复和跨端开关不得延长授权 | `pass` |

## 6. 逐横切项停审

### 6.1 安全边界与可访问状态

- 适用原因：Chat 同时处理外部 owner 材料、用户意图、本地缓存和多平台入口，任何一处都可能成为越权或误解路径。
- 判断口径：所有业务材料可回到正式 SDK safe surface；无法验证 actor/scope/visibility 时 restricted/blocked/cleared；核心状态在支持的辅助技术路径中保持等价可理解；forbidden body 不进入本地持有面。
- 停审结论：`pass`。适用范围覆盖所有架构单元，且没有下沉为认证手册或 UI 样式规则。

### 6.2 审计与可追溯

- 适用原因：发送、治理、变化、恢复和撤销均可能出现 unknown 或争议，需要安全回链而不能依赖瞬时 toast。
- 判断口径：保留低敏阶段、来源、版本/水位、结果类别、引用和关联信息；缺失关联时不升级为 confirmed；raw body、raw log、secret 不作为追溯材料。
- 停审结论：`pass`。它作用于数据、交互、诊断和结果门控，不替代 Observability audit/evidence owner。

### 6.3 可观测性

- 适用原因：客户端必须让用户和支持者理解入口、SDK、变化、恢复和失败处于何种阶段，但 Chat 不拥有后端观测真相。
- 判断口径：能区分能力类别、阶段、结果姿态、freshness/gap/unknown/reconnect 和 sink 失败；只允许低敏 handoff；诊断不可用不影响业务主链。
- 停审结论：`pass`。约束的是可见性和安全关联，不是监控实现、告警配置或日志库。

### 6.4 韧性 / 恢复能力

- 适用原因：Chat 的核心体验依赖跨边界变化、断线、重启、缓存和多端切换，且 unknown 不能安全自动完成。
- 判断口径：可恢复失败进入挂起、重查、延后收敛或清理；单 owner 故障局部隔离；unknown 不盲重放；缓存不延长授权。
- 停审结论：`pass`。它与 Step 8/9 的最终一致、后台承接和状态轴一致，没有下沉为运维剧本。

### 6.5 性能 / 容量约束

- 适用原因：跨域 safe view 组合、变化消费和恢复可能放大数据/交互成本，直接影响 Desktop-first 入口体验。
- 判断口径：按需/局部/分页/延后承接优先；不复制全量正文，不在 Chat 重建跨域 projection，不将所有变化压入同步闭环；精确数字待 authority。
- 停审结论：`pass`。已形成结构性约束，未伪造测量数字或压测证据。

### 6.6 配置与变更控制

- 适用原因：SDK capability、缓存、恢复、redaction、平台 shell 和诊断开关可能绕过主线边界。
- 判断口径：配置只能选择已允许的承载/降级姿态，不能改 owner ownership、结果门控、fail-closed、forbidden body、重放和留存上限；主线边界改变须进入架构变更。
- 停审结论：`pass`。覆盖平台、数据、通信和技术机制，没有滑入配置键清单。

## 7. 主线映射小表

| 横切项 | 主要作用章节 / 主线 | 当前关键边界 |
|---|---|---|
| 安全边界与可访问状态 | §4～§10、§12、§14 | SDK-only、visibility、fail-closed、等价状态、最小披露 |
| 审计与可追溯 | §8～§10、§15～§17 | source/version/result ref、unknown、撤销和清理回链 |
| 可观测性 | §7、§9、§10、§15 | 低敏阶段/结果/失败可见，Observability backend 外置 |
| 韧性 / 恢复 | §7～§10、§14 | stale/gap/reconnect/unknown/requery、局部隔离 |
| 性能 / 容量 | §7、§9～§12、§14 | 局部/按需/延后承接，避免全量复制和无界聚合 |
| 配置与变更控制 | §8、§9、§11～§14 | 配置不得绕过 SDK、结果门控、清理和 forbidden body |

## 8. 跨横切约束审计

| 审计项 | 结果 | 证据 / 处理 |
|---|---|---|
| 是否只纳入长期横切要求 | `pass` | 六类约束都持续作用于多个章节、边界、交互或数据关系。 |
| 是否按架构单元判断适用性 | `pass` | A～G 七个单元逐项列出安全、审计、观测、韧性、性能和配置适用性。 |
| 是否提供可审查的判断口径 | `pass` | 每类都有来源/状态/失败/清理/局部承接等行为判断，未使用空泛质量词。 |
| 是否保持与 Step 8 数据语义一致 | `pass` | forbidden body、snapshot/ref、freshness、撤销清理和 owner truth 边界一致。 |
| 是否保持与 Step 9 通信语义一致 | `pass` | 同步判断、异步传播、后台恢复、unknown 挂起和诊断支链一致。 |
| 是否伪造性能、SLO、兼容或证据 | `pass` | `CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 仍为 pending/blocked。 |
| 是否把诊断/日志写成正式 Observability truth | `pass` | 低敏 handoff 与 backend/audit/evidence 分离。 |
| 是否存在配置边界遗漏 | `none` | capability、cache、redaction、retry/replay、retention、shell 和诊断开关均受约束。 |
| 是否存在横切冲突 | `none` | 安全、韧性、性能、可访问和观测口径互相兼容，未发现 unresolved 冲突。 |

## 9. 当前 blocker 对横切约束的影响

| blocker | 影响 | 当前口径 |
|---|---|---|
| `CHAT-NF-Q-001~005` | 精确性能、SLO、兼容、诊断和质量 authority 未闭合。 | 只保留行为级/结构级约束，不写数字或证据结论。 |
| `CHAT-AC-Q-001~004` | 正向 owner contract、数值验收、跨端和诊断证据粒度未闭合。 | 横切主线先收敛，验收证据后续条件化。 |
| `CHAT-UP-001~007`、`WS-UP-001~008` | SDK、owner safe surface、Workspace 和诊断边界影响具体适用面。 | 所有正向能力保持 blocked/deferred/read-only/stale/unknown 等姿态。 |
| `OPEN-CHAT-009~012` | 平台/AT、持久化、恢复和诊断 envelope 尚未闭合。 | Desktop-first/shared core 方向确定，精确矩阵和上限后置。 |

## 10. 正式回填草稿

### 10.1 §13 横切关注点

`L5-chat` 的长期横切约束包括安全边界与可访问状态、审计与可追溯、可观测性、韧性/恢复、性能/容量和配置/变更控制。安全要求以 SDK-only、actor/scope/visibility、fail-closed、最小披露、撤销清理和等价可访问状态为主；审计与可观测要求只保留低敏来源、阶段、结果、版本/水位和失败类别，不把 raw body、raw log 或客户端诊断当 Observability truth。韧性要求允许 stale、gap、pending、unknown、requery、延后收敛和局部隔离；性能要求限制无界跨域聚合、全量正文复制和强行同步闭环；配置变更不得绕过 owner ownership、结果门控、禁止正文和恢复边界。

这些横切要求必须在架构层明确，因为它们同时作用于外部接缝、核心语义、数据归属、通信、平台 shell、缓存和恢复，无法留到单一实现或运维阶段补救。精确性能数字、兼容矩阵、诊断 envelope 和验收证据粒度仍因 authority 缺失保持 pending/blocked。

## 11. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否识别长期横切类别 | `pass` | 六类正式横切项均与 Chat 主线相关。 |
| 是否按架构单元判断适用性 | `pass` | 七个单元逐项完成适用矩阵和停审。 |
| 是否说明作用范围、约束和保护目标 | `pass` | 主表每项都有三类判断与去歧义说明。 |
| 是否包含安全与可访问性边界 | `pass` | fail-closed、最小披露和等价状态表达被纳入安全横切。 |
| 是否覆盖观测、审计、恢复、性能和配置 | `pass` | 关键状态、低敏回链、unknown/recovery、结构性能和变更控制均覆盖。 |
| 是否避免手册/脚本/指标伪造 | `pass` | 无告警、密钥、压测、运维步骤或未经 authority 的数字。 |
| 是否审计数据/通信/横切冲突 | `pass` | 与 Step 8/9 一致，跨横切审计无 unresolved 冲突。 |
| 是否完成正式 §13 回填草稿 | `pass` | 横切主文、映射和 blocker 口径已形成。 |

## 12. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 横切项级 | `pass` | 六类横切项逐项停审，适用性、判断口径和保护目标清楚。 | 允许进入 Step 13，收敛演进路线。 |
| Step / 模块级 | `pass` | 横切约束表、适用矩阵、主线映射和跨横切审计完成。 | 更新 flow 与项目台账后创建 Step 13。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 13～16，旧正式文件仍保持 historical material。 | 继续 Step 13；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 exact SDK/owner/platform blocker，按顺序进入 Step 13。 |


### 本轮 Step 12 模块 安全/可访问 独立自检

- 问题：图可否暴露受限节点名称或成员名单？
- 诊断：只遮正文仍可能披露关系。
- 取舍：先正式过滤材料再渲染；状态不用单一颜色。
- 结构化/回填：图形/列表等价操作，撤销后清理 ref/焦点/预览。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答、诊断与取舍

六类横切项已逐个审查。旧 §13 是通用矩阵，不足以限制图结构/人员/关联披露、迟到事件复活、流程图访问和代码/测试摘要误作验收。补充按需读取、受限材料过滤、source-local 失效和等价列表，不添加未经 authority 的规模预算。

### 结构化回填与自检

回填 §13.4场景约束与后续测试切口表。切口是未来 05/06 必须承接的最小验证入口，不是已写测试或测试结果。图形/列表正常及 restricted/stale/gap/revoke/offline/unknown 均需可理解状态；配置只能控制允许的展示形态。A～G 的所有权不变；无诊断 backend、内部 bus 或 Runtime/Tools 执行。

复杂度：横切场景表足够；已有单元适用矩阵保留，不能用 pass 代表执行验收。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：流程/目录的安全、恢复、可访问性、配置与证据横切约束完成。
- next_allowed_action：进入 Step 13，重新读取其 SOP 与前序输入。



### 本轮 Step 12 模块 配置 独立自检

- 问题：feature flag 能否打开流程编辑或全员目录？
- 诊断：开关可能绕过合同。
- 取舍：仅允许表现裁剪；不得放宽授权/来源/留存。
- 结构化/回填：图形降级列表不降级安全；不自造配置 key。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 12 模块 性能/容量 独立自检

- 问题：大图和多群聊如何避免放大？
- 诊断：一次读取全部目录/子流程易无界。
- 取舍：按需下钻/分页/局部投影；布局与业务读取解耦。
- 结构化/回填：可访问列表仍可操作；数值预算待 authority。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 12 模块 恢复 独立自检

- 问题：gap/revoke 有什么优先级？
- 诊断：缓存或迟到消息可能复活撤销。
- 取舍：授权撤销立即收紧，恢复重新验证。
- 结构化/回填：binding/node/member 粒度失效，不全量盲重放；unknown 不提交。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 12 模块 观测 独立自检

- 问题：能否输出图结构和人员到日志？
- 诊断：诊断会泄露跨域材料。
- 取舍：只获准低敏类别/ref，经正式 handoff。
- 结构化/回填：布局错误不影响业务 truth；不得日志保存图正文/人员名单。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 12 模块 追溯 独立自检

- 问题：代码提交/测试摘要是验收证据吗？
- 诊断：原型徽章会造成通过暗示。
- 取舍：只能展示 owner safe evidence/ref 与正式判定。
- 结构化/回填：显示来源/新鲜度；链接失败不生成成功证据。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。
