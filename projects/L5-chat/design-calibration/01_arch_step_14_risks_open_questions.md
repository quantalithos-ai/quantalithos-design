# Step 14 · 风险与待确认事项

> 架构主题：显式收纳 `L5-chat` 尚未关闭、会影响主线判断的正式风险和待确认事项，防止把缺失 authority 润色成确定结论。
> 当前状态：已完成风险/待确认拆分、影响范围、当前处理口径、阻塞性判断和审计；允许进入 Step 15。
> 直接输入：Step 1～13 中尚未关闭项、`00-需求文档.md` §12/§15/§16、`project_execution_ledger.md` blocker 台账、各上游正式 owner 边界。
> 本步限制：不写任务 backlog、最终修复方案、责任人、时间安排、实施步骤或未经停审的新结论。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 14 · 风险与待确认事项 |
| 前置门禁 | Step 13 `pass` |
| 本步目标 | 区分已识别风险与尚未定论的待确认事项，说明影响范围、当前保守口径和后续推进阻塞性。 |
| 本步输出 | 风险表、待确认事项表、当前处理口径说明、解除/转化条件、§15 回填草稿和自检。 |
| 本步不展开 | 任务、解决方案、实施路线、协议补齐、测试证据和 owner 内部设计。 |
| 处理原则 | 已知风险写“当前如何约束/暂存”；待确认项写“缺什么确认、当前如何挂起”；不以主观判断替代外部 authority。 |

## 2. SOP 问题回答

### 2.1 当前有哪些正式风险？

正式风险是已经确认会影响 Chat 主线成立或后续落码边界、但目前尚未关闭的问题：SDK/owner 合同漂移、Conversation 变化与恢复不一致、Governance 结果不确定、Artifact/Workspace safe surface 不完整、跨 owner 摘要层级冲突、客户端诊断越界、平台语义分叉和本地持久化扩大敏感面等。这些风险已有明确影响和保守处理方式，不是普通待办。

### 2.2 当前有哪些待确认事项？

待确认事项是尚未形成足够定论、需要外部确认或进一步裁决、且不能安全写成已知事实的问题：SDK exact capability/版本兼容面、Conversation cursor/resume/visibility 合同、Governance receipt/idempotency/Decision event、Artifact preview/ref 语义、Workspace view/export/freshness/attention、Identity/Work/Member/Runtime 摘要层级、Observability low-sensitivity envelope、Desktop/Web/Mobile/辅助技术矩阵、持久化上限和跨端恢复能力。

### 2.3 哪些会阻塞后续主线推进？

- 阻塞正向实现级推进：`CHAT-UP-001~005` 相关 exact SDK/owner surface、Governance receipt、Artifact preview、Workspace view/export 和 Conversation resume 合同。
- 有条件阻塞：平台/辅助技术/持久化矩阵和诊断 envelope 会阻塞对应平台扩展、持久化策略和低敏支持闭环，但不阻塞当前边界级架构主线。
- 不阻塞当前架构推进：已明确可采用保守姿态的跨 owner 摘要、低敏诊断和局部缓存风险，只要不把它们写成 ready 或 truth。

### 2.4 当前如何处理而不脑补结论？

所有未闭合项保持 `pending`、`blocked`、`deferred`、`read-only`、`stale`、`unavailable`、`unknown` 或 `needs-action` 等明确姿态；Chat 不建 shadow contract、不从空列表/缓存/连接/对象名推断、不直接调用 owner 或 bus，也不以 fake、mock、按钮或测试想象替代正式证据。

## 3. 风险与待确认的区分原则

| 类别 | 判定 | 本项目例子 | 当前写法 |
|---|---|---|---|
| 正式风险 | 已明确知道它会影响主线或边界稳定，但尚未关闭。 | SDK surface 漂移会迫使 Chat 直连或停滞；Governance result 不闭合会误报审批。 | 写影响、保守约束和是否阻塞，不写最终修复方案。 |
| 待确认事项 | 尚未形成定论，需要外部信息/裁决，暂不能称为已知风险。 | 具体 shell、持久化上限、诊断 envelope、兼容矩阵。 | 写缺失确认和挂起口径，不预支选择。 |
| 可接受债务 | 已在 Step 13 判断当前不打穿边界，且不会阻塞当前结构。 | 具体框架载体、数值 NFR、移动扩展。 | 留在演进/取舍，不自动重复为风险。 |
| 不可接受越界 | 已明确违反边界，必须阻塞任何相关推进。 | 直连 owner/bus、第二真相、unknown 自动重放、visibility 不明仍展示。 | 作为正式阻塞风险和硬红线保留。 |

## 4. 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| `L0-sdk` typed query/command/event/ref/error/resume surface 漂移 | 所有外部接缝、view model、意图、变化和恢复主线 | 只保留能力级 SDK-only 边界，不固化 exact API/DTO/schema；缺失能力保持 blocked/deferred。 | 有条件阻塞 | 风险已明确会影响正向落码和接缝稳定，但不要求重写客户端核心边界。 |
| Conversation visibility、change identity、cursor/resume 或分页语义不一致 | group/channel/dm/thread 入口、Turn 显化、变化消费、重连和历史连续性 | 按 stale/gap/requery/blocked/unknown 保守表达，不从连接、时间戳或缓存推断顺序。 | 有条件阻塞 | 若未闭合仍可做边界架构，但不能宣称实时/完整历史或恢复 ready。 |
| Governance receipt、幂等、Decision result/event 不闭合 | GateCard、治理意图、confirmed/rejected/unknown、恢复和审计回链 | GateCard 只读/受控入口；没有正式 result 保持 pending/unknown/read-only，不自动重放。 | 阻塞正向治理承接 | 误报治理成功会直接破坏 owner truth 和安全边界。 |
| Artifact safe preview/ref/visibility/版本语境不足 | Artifact card、预览、下载/打开入口、缓存和正文持有面 | 只保留 body-free ref/summary/preview-unavailable；不保存正文或猜权限/版本。 | 有条件阻塞预览 | 展示边界仍可成立，但正向 preview 不能宣称闭合。 |
| Workspace safe view/export/freshness/attention/cursor 不闭合 | Inbox、跨项目摘要、恢复位置和页面 attention | 只消费已正式提供的 view/export；区域保持 stale/partial/blocked，不在 Chat 重建 projection。 | 有条件阻塞 Workspace 入口 | 直接聚合会形成第二真相，因此缺口不能用本地计算填补。 |
| Identity/Work/Member/Runtime 摘要层级或来源不一致 | 成员卡、项目进度、运行状态和跨域责任解释 | 按 owner 分域展示来源和 freshness；不跨 owner 推断生命周期、完成或授权。 | 不阻塞边界级，阻塞正向组合 | 风险可用 opaque/stale 降级约束，正向统一摘要需合同闭合。 |
| 低敏诊断/handoff 未闭合导致 raw payload 泄露或无法定位 unknown | 支持入口、错误提示、恢复解释、Observability 交接 | 只允许最小错误类别、阶段和安全 ref；sink 失败不影响主链；不直写 backend。 | 不阻塞业务主线；阻塞诊断闭环 | 风险已知且可隔离，不能用 UI 日志替代正式观测。 |
| Desktop/Web/Mobile/辅助技术能力差异造成业务语义分叉 | shell、通知、深链、存储、返回、焦点和状态播报 | Desktop-first；共享语义和 fail-closed 保持稳定；能力缺失显示 unavailable/needs-action。 | 有条件阻塞对应平台扩展 | 不影响 Desktop 边界设计，但会阻塞跨端 ready 结论。 |
| 本地缓存/恢复持久化扩大敏感正文或延长授权 | local projection、logout/revoke、离线展示和跨端恢复 | 最小化 safe material，保留来源/visibility/freshness，撤销/过期/登出时清理；离线副作用 unknown。 | 有条件阻塞持久化策略 | 结构机制已收稳，具体 retention/存储上限未闭合。 |
| Chat 被实现压力推动为跨域聚合/Runtime/诊断后端 | 核心语义、依赖方向、数据所有权和部署边界 | 维护 SDK-only、owner-safe、local-only 红线；相关能力缺失即 blocked/deferred。 | 阻塞任何越界实现 | 这是架构回归风险，不是可接受的阶段债务。 |
| 配置/feature flag 绕过结果门控、redaction、重放或 owner ownership | 主线行为、平台差异、缓存、恢复和安全边界 | 只有不改变已收稳语义的配置可进入；边界变化视为架构变更。 | 阻塞越界配置 | 防止运行配置偷偷改变架构主线。 |

## 5. 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| `L0-sdk` 是否统一提供 typed query/command/event/ref、auth、error、retry、receipt、resume、redaction | 外部接缝、所有正向交互和后续概要设计 | 缺 SDK 当前正式 public surface、能力版本和兼容语义 | 只按能力级 seam 设计；exact 方法/DTO/schema 不回填主文。 | 尚未有足够确认，不能升级为“SDK 已完全覆盖”。 |
| Conversation visibility/scope、分页、cursor、change identity 和 resume contract | 对话入口、Turn、变化、重连和跨端恢复 | 缺正式消费语境、分页/变化身份和过期处理约定 | 维持 read-only/stale/gap/requery/unknown；不采用直 bus 或时间戳顺序。 | 它影响实现主线，但当前仍是外部合同确认问题。 |
| Governance 授权语境、receipt、幂等、Decision event 和结果解释 | GateCard、治理意图、confirmed、审计回链 | 缺命令结果/授权/幂等和变化的正式 SDK surface | 只保留受控入口和 pending/unknown/read-only；不本地确认。 | 不能凭 UI 设计推导治理语义。 |
| Artifact safe ref/summary/preview、版本和 visibility contract | Artifact 引用/预览、正文持有和缓存清理 | 缺 body-free preview 规则、可见性和版本语境 | 只设计 ref/summary/preview-unavailable；不缓存正文。 | 需要 Artifact owner 形成正式消费面。 |
| Workspace safe view/export、freshness、attention、cursor 和覆盖范围 | Inbox、跨项目摘要、恢复和局部 attention | 缺 Workspace 对客户端的只读 view/export 以及 freshness/attention 语义 | 不在 Chat 重建 projection；区域按 stale/partial/blocked。 | 需要 workspace owner 闭合，Chat 不能自行裁决。 |
| Identity/Work/Member/Runtime safe summary 的层级、来源和生命周期映射 | 成员/项目/运行卡片、责任解释和状态组合 | 缺各 owner 的摘要粒度、visibility 和生命周期对齐 | 按来源分域展示；不拼统一完成/授权结论。 | 尚未定论，不能写成跨域统一模型。 |
| Observability low-sensitivity diagnostic envelope、correlation/ref 和 sink 隔离 | 客户端支持、unknown/recovery 定位和审计回链 | 缺允许字段类别、关联范围和 backend 接收边界 | 只允许本地低敏分类，handoff 保持 optional/blocked/deferred。 | 需要 observability owner 及安全边界确认。 |
| Desktop shell、Web shell、Mobile shell 与辅助技术兼容矩阵 | 跨端扩展、通知、深链、存储、焦点和状态播报 | 缺正式支持平台、宿主能力和 AT 组合 | Desktop-first；其他 shell 仅 candidate，不宣称 ready。 | 载体未定不应反推业务语义。 |
| safe snapshot、缓存、draft、recovery metadata 的保存/失效上限 | 本地持久化、登出/撤销、跨设备恢复和隐私边界 | 缺 retention、redaction、清理时机和设备范围 authority | 采用最小安全材料、fail-closed 和清理；具体上限挂起。 | 不能用历史指标或常识补齐。 |
| 跨端同步、后台恢复、通知和系统分享是否属于正式能力 | Web/Mobile 结构、跨设备 draft/selection/recovery 和平台 shell | 缺产品范围裁决与 owner/SDK 正式同步能力 | 不纳入 V1 Desktop 主线；无正式能力则 unavailable/needs-action。 | 这是范围/能力确认，不是当前实现任务。 |
| Chat 是否需要正式的客户端诊断支持边界 | 诊断支链、低敏 handoff、支持角色入口 | 缺支持流程、权限范围和可见字段确认 | 只保留本地安全提示；不生成 backend/audit truth。 | 没有外部确认时不能自建 support contract。 |

## 6. 风险处理与状态转化规则

### 6.1 风险不自动转成已关闭

某个风险有保守降级姿态，不表示上游合同已经闭合。例如 Governance 风险可以通过 `pending/unknown/read-only` 控制误报，但不能因此把 receipt/idempotency 视为已成立；Workspace 可以保持 `blocked`，不能因此把本地摘要当正式 projection。

### 6.2 待确认不自动转成风险或结论

具体 shell、存储引擎、诊断 envelope 和兼容矩阵在缺 authority 时只保持挂起，不以“可能风险”迫使当前架构过度扩张，也不以偏好写成选型事实。只有出现明确的边界破坏、误报、越权或主线无法成立的证据，才转入正式风险或阻塞。

### 6.3 阻塞性判断

- `阻塞`：继续会要求 Chat 伪造 owner truth、直连禁止边界、保存 forbidden body 或确认未知副作用。
- `有条件阻塞`：当前架构可保守推进，但对应正向能力、平台扩展或实现级设计不能进入下一层。
- `不阻塞`：已有安全降级可隔离影响，当前可继续边界级架构，不宣称正向能力 ready。

## 7. 当前处理口径说明

风险表收纳已经确认会影响主线的合同漂移、结果不确定、投影失真、平台分叉和敏感持有问题，并用保守姿态、局部隔离、read-only、stale、unknown 或 blocked 约束影响；待确认表收纳仍需外部 authority 或范围裁决的具体合同、平台矩阵、持久化上限和诊断 envelope。两类都不在本步内补最终方案，避免把未闭合上游真相吸收到 Chat。当前架构可以继续向 ADR/追溯推进，因为边界级结论已停审；正向实现和跨端 ready 仍受相应 blocker 限制。

## 8. 正式回填草稿

### 8.1 §15 风险与待确认事项

当前正式风险包括 SDK/owner 合同漂移、Conversation 变化恢复不一致、Governance receipt/idempotency/result 不闭合、Artifact/Workspace safe surface 不完整、跨 owner 摘要层级冲突、诊断越界、平台语义分叉、本地持久化敏感扩大、配置绕过主线以及实现压力推动 Chat 吸收跨域 truth。它们分别通过 SDK-only、safe projection、read-only/stale/unknown/blocked、最小披露、局部隔离和不盲重放等口径约束；其中直连禁止边界、unknown 自动重放、visibility 不明仍展示等属于阻塞性风险，合同/平台/诊断缺口属于有条件阻塞。

待确认事项包括 SDK exact surface、Conversation cursor/resume、Governance receipt/幂等、Artifact preview、Workspace view/export、Identity/Work/Member/Runtime 摘要层级、Observability 低敏 envelope、平台/辅助技术矩阵、持久化上限和跨端恢复能力。在这些确认形成前，Chat 只保留能力级架构边界，不复制 owner contract、不锁定具体载体、不宣称实现或 readiness。

## 9. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否拆分风险与待确认事项 | `pass` | 两张表分别按“已识别影响”与“尚未定论”组织。 |
| 是否写清影响范围与当前口径 | `pass` | 每项风险和待确认均有范围、处理/挂起方式及去歧义说明。 |
| 是否明确阻塞性 | `pass` | 区分阻塞、有条件阻塞和不阻塞，不使用模糊观察词。 |
| 是否避免把 TODO/愿望写成未关闭项 | `pass` | 只纳入会影响主线判断的合同、边界、数据、平台和诊断问题。 |
| 是否避免脑补外部结论 | `pass` | SDK/owner/platform/diagnostic authority 均保持 pending/blocked/deferred。 |
| 是否与 Step 13 债务判断一致 | `pass` | 可接受债务与不可接受越界分别保留，未互相混淆。 |
| 是否覆盖 inherited blockers | `pass` | `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*`均有映射。 |
| 是否存在 unresolved 风险分类冲突 | `none` | 未发现将待确认误写风险或将已知越界降格为普通待办。 |
| 是否完成正式 §15 回填草稿 | `pass` | 风险、待确认、处理口径和阻塞判断已形成。 |

## 10. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 风险/待确认级 | `pass` | 风险与待确认已分离，影响、挂起、阻塞和保守边界清楚。 | 允许进入 Step 15，进行 ADR 与需求追溯。 |
| Step / 模块级 | `pass` | 风险表、待确认表、状态转化规则和审计完成。 | 更新 flow 与项目台账后创建 Step 15。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 15～16，旧正式文件仍保持 historical material。 | 继续 Step 15；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 inherited blockers，按顺序进入 Step 15。 |


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题回答与诊断

哪些未闭合项会阻塞？正式整体/阶段拓扑及关联 ref、Process change/resume、绑定责任 owner/解除/撤销、公司目录 provider 与人类/AI覆盖、列表/对象访问语境。旧 §15 未继承 OPEN-CHAT-013～015；原型显示完整流程不能证明上游有正式拓扑输入或 full BPMN 执行支持。

### 风险表与待确认表取舍

风险：错将 Work/Runtime 状态拼成 Process 汇聚；项目授权扩散为群聊/目录访问；图形库或证据徽章伪造批准/验收；不同 source 水位/迟到数据污染选择。当前处理是分域 safe view、独立授权、只读 renderer、失效/requery。

待确认：OPEN-CHAT-013～015 继续继承，加 CHAT-UP-008（Process safe projection/change/节点关联 via SDK）、CHAT-UP-009（关系/成员目录 via SDK）作为架构消费缺口，区别需求 open 编号，缺合同阻塞正向集成但不阻塞边界级设计停审。不改上游、SDK或00。

回填 §15，并同步 ledger 上游 blocker；后续追溯表承接。复杂度：两张表足够。自检：未凭原型关闭合同；未发明目录 backend、BPMN XML、事件 schema 或绑定 mutation。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：新增流程、绑定、目录与渲染风险及上游 blocker 已分表登记。
- next_allowed_action：进入 Step 15，重新读取其 SOP 与前序输入。
