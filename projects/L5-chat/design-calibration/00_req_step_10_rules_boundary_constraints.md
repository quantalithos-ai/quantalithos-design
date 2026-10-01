# Step 10 · 业务规则与边界约束

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §10「业务规则与边界约束」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 10  
> 直接输入：`00_req_step_02_position_boundary.md`、`00_req_step_07_core_capability_loop.md`、`00_req_step_09_functional_requirements.md`。  
> 本步只写需求层硬约束，使用不变量、禁止行为、显式变化、边界约束、治理约束和审计约束；不写接口签名、事件 schema、数据库约束、事务实现或异常码。

## 1. Step 状态与执行计划

- 状态：`[x] 已完成`
- 当前模块：`rules-and-boundary-constraints-by-capability`
- 思考记录：`[x]`
- 结构化写入：`[x]`
- 自检：`[x]`
- gate_status：`pass`
- 回填位置：正式 `00-需求文档.md` §10「业务规则与边界约束」

### 1.1 Step 内计划

- [x] 按 N1～N4 功能需求识别必须始终成立的不变量。
- [x] 识别按钮/ACK/缓存/内部 bus/权限推断等必须禁止的行为。
- [x] 明确 scope、visibility、command result、cursor、recovery 等显式变化。
- [x] 明确 Chat 与 owner truth、SDK、Runtime、Workspace、Artifact、Observability 和平台 shell 的边界。
- [x] 为 Gate/Decision、敏感内容和低敏诊断补充治理/审计约束。
- [x] 完成规则与功能映射、能力级停审、跨能力冲突审计和门禁自检。

## 2. 本步输入与规则边界

| 输入 | 本步使用方式 | 不写入本步的内容 |
|---|---|---|
| Step 2 边界 | 固定 Chat-local 状态、owner truth、SDK 接入边界和平台壳边界。 | 代码目录、组件、包名和服务内部实现。 |
| Step 7 N1～N4 | 作为规则分组和闭环保护对象。 | 把能力顺序写成运行时流程。 |
| Step 9 功能 | 为每条规则提供功能来源。 | 用规则代替数据归属或接口契约。 |
| 上游 owner 红线 | 固定 Conversation/Governance/Artifact/Workspace/Member/Runtime/Observability 各自真相。 | 复制 owner 规则或在 Chat 重建授权算法。 |

## 3. SOP 问题回答

### 3.1 N1 必须成立的规则

N1 的硬约束必须保证当前 route/selection 只在可验证 actor、scope 和 visibility 语境下成立；任何 scope 改变、权限撤销、登出、过期或链接失效都必须显式改变客户端状态。Chat 不得把 URL、缓存、对象名称、空列表或平台 session 推断为业务授权。

### 3.2 N2 必须成立的规则

N2 的硬约束必须保证每个 owner 事实都有可解释来源、可见性和新鲜度语义；展示层可以遮蔽、降级或显示引用，但不能复制 raw body、补造缺失状态、跨 owner 拼出新的业务结论或把 GateCard/Artifact 卡片当成治理/制品真相。

### 3.3 N3 必须成立的规则

N3 的硬约束必须保证 local draft/intent、transport acknowledgment、formal receipt/result 和 owner confirmed 之间保持分层；用户操作只产生受控意图，Governance/Conversation owner 才能产生正式结果。未知结果必须进入探测、查询或人工决策，不能盲目重放。

### 3.4 N4 必须成立的规则

N4 的硬约束必须保证变化只经 SDK formal surface 消费，cursor、view revision、local read/selection、draft 和 command attempt 不互相冒充；断线、重复、乱序、缺口、过期、撤销和恢复都要形成显式降级或重新查询姿态。缓存和 Desktop shell 不能成为授权或业务真相。

## 4. 核心业务规则表

### 4.1 N1：安全协作语境进入与保持

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-CHAT-001` | 不变量 | 只有在当前 actor、scope 和正式可见性语境可被验证时，Chat 才能将协作入口标记为可见或可操作。 | `F-CHAT-001/002`、route/context |
| `BR-CHAT-002` | 禁止行为 | 不得根据 URL、深链参数、历史缓存、对象名称、空列表或 UI 隐藏状态推断对象存在性、权限或可操作性。 | `F-CHAT-001/002` |
| `BR-CHAT-003` | 显式变化 | scope 选择、visibility 撤销、登出、链接过期和 session 失效必须显式改变 route/context 状态，不得静默沿用旧语境。 | `F-CHAT-002/003` |
| `BR-CHAT-004` | 边界约束 | route、selection、deep-link、last-opened 和恢复位置属于 Chat-local 状态，不是 Conversation、Project、Workspace 或 Member truth。 | `F-CHAT-001/003` |
| `BR-CHAT-005` | 禁止行为 | scope 或 visibility 变化后，不得继续展示已失效的敏感 view，也不得用本地缓存延长授权。 | `F-CHAT-003`、本地 cache |
| `BR-CHAT-006` | 治理约束 | 任何受控动作入口必须以 owner 返回的可操作性/授权语境为前置；Chat 不自行授予动作资格。 | `F-CHAT-001/002/011` |

### 4.2 N2：正式协作事实安全显化

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-CHAT-007` | 不变量 | 页面显示的 owner 事实必须能回链到正式 safe view、ref、summary 或 result，并保留可解释的来源和可见性语境。 | `F-CHAT-004~008` |
| `BR-CHAT-008` | 禁止行为 | Chat 不得复制 Conversation/Turn、Member、Project、Gate/Decision、Artifact、Workspace、Runtime 或 Observability 的 raw truth 作为自身业务对象。 | `F-CHAT-004~008` |
| `BR-CHAT-009` | 显式变化 | fresh、stale、partial、unavailable、blocked、redacted 和 revoked 等展示姿态必须随来源/可见性变化显式更新。 | `F-CHAT-008` |
| `BR-CHAT-010` | 禁止行为 | 不得从 ref、对象名、缓存、错误差异或其他 owner 摘要推断缺失正文、权限、生命周期、项目完成或运行完成。 | `F-CHAT-004~008` |
| `BR-CHAT-011` | 边界约束 | GateCard 只能显化 Governance 语境；Artifact card 只能显化 safe ref/summary/preview；二者不得替代 Decision 或 Artifact truth。 | `F-CHAT-006/007` |
| `BR-CHAT-012` | 治理约束 | Gate/Decision、敏感成员状态和 Artifact 预览只能在正式 visibility/Policy/治理结果允许时展示或提供操作入口。 | `F-CHAT-005~007` |
| `BR-CHAT-013` | 审计约束 | 来源、版本/水位、降级类别和用户可见的状态解释必须足以支持后续正式诊断或审计回链，不得记录 raw body 代替回链。 | `F-CHAT-008`、view model |

### 4.3 N3：用户意图受控发起与结果反馈

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-CHAT-014` | 不变量 | draft、selection、local intent、transport acknowledgment、formal receipt/result 和 owner confirmed 必须保持语义分离。 | `F-CHAT-009~012` |
| `BR-CHAT-015` | 禁止行为 | 不得把按钮点击、表单校验通过、HTTP/websocket ACK、AG-UI ACK、通知送达、toast 或 optimistic state 标记为业务完成。 | `F-CHAT-010~012` |
| `BR-CHAT-016` | 显式变化 | 发送/治理意图必须显式经历本地意图、提交中/等待、正式确认/拒绝/失败/未知等可解释状态；不得静默跳过中间语义。 | `F-CHAT-010~012` |
| `BR-CHAT-017` | 禁止行为 | 命令结果未知时不得盲目重试可能产生副作用的动作；必须先查询、探测或要求用户作出下一步决定。 | `F-CHAT-010~012` |
| `BR-CHAT-018` | 边界约束 | Chat 只发起用户意图和显示结果，不直接写 Conversation、Governance、Artifact、Work、Member、Runtime 或 Workspace truth。 | `F-CHAT-010/011` |
| `BR-CHAT-019` | 治理约束 | Gate 操作必须携带正式授权语境、目标/责任引用和可回链结果；Chat 不自行生成批准、拒绝或 Policy 结论。 | `F-CHAT-011/012` |
| `BR-CHAT-020` | 审计约束 | 可能产生外部副作用的客户端尝试必须能关联到安全的 request/attempt/result 语境，但不得把客户端记录当 owner receipt。 | `F-CHAT-010~012` |

### 4.4 N4：变化、失败、离线与恢复连续性

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-CHAT-021` | 不变量 | owner 变化只能通过 SDK 正式暴露的 change/event/resume 能力进入 Chat；客户端 reducer 必须保留来源、可见性和版本语境。 | `F-CHAT-013/014` |
| `BR-CHAT-022` | 禁止行为 | Chat 不得直接订阅内部 bus、猜造 topic/offset、从墙上时间戳推断顺序，或将 websocket 连接状态当业务变化。 | `F-CHAT-013/014` |
| `BR-CHAT-023` | 显式变化 | duplicate、out-of-order、gap、cursor expired、visibility revoked、reconnecting、requery、blocked 和 recovered 必须形成显式客户端状态。 | `F-CHAT-013~016` |
| `BR-CHAT-024` | 边界约束 | source cursor、view revision、local selection/read position、draft、command attempt 和 platform connection state 不得互相替代。 | `F-CHAT-013~016` |
| `BR-CHAT-025` | 禁止行为 | 本地缓存不得延长可见性、补造最新事实、覆盖 owner 变化或把离线意图显示为已提交。 | `F-CHAT-015/016` |
| `BR-CHAT-026` | 不变量 | Desktop 重启或网络恢复后，客户端必须先恢复可解释的已知状态，再根据正式结果重新校准；无法验证时保持 stale/unknown/blocked。 | `F-CHAT-015/016` |
| `BR-CHAT-027` | 审计约束 | 客户端诊断只能记录低敏连接、缓存、恢复、错误类别和 correlation；不得暴露 raw log、credential、Artifact body 或未脱敏正文。 | `F-CHAT-017` |
| `BR-CHAT-028` | 边界约束 | Tauri Desktop、Web shared UI 和 Mobile Capacitor shell 只提供平台能力，不得改变核心状态语义、owner 权限或业务提交结论。 | 全部平台 adapter |

## 5. 外围增强规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-CHAT-E01` | 边界约束 | 搜索和过滤只能缩小用户看到的已授权结果，不能通过空结果或索引差异推断不可见对象。 | `F-CHAT-E01` |
| `BR-CHAT-E02` | 禁止行为 | Desktop 通知、托盘、快捷键和系统分享的送达不等于 Conversation、Governance 或 Runtime 业务状态改变。 | `F-CHAT-E02/E04` |
| `BR-CHAT-E03` | 边界约束 | 富文本和附件能力只能携带安全 ref/metadata，不能绕过 Artifact visibility 或把本地文件当 Artifact truth。 | `F-CHAT-E03` |
| `BR-CHAT-E04` | 边界约束 | Mobile 临时 Capacitor 方案不得成为 V1 Desktop 的业务前置，也不得通过宿主能力绕过 SDK。 | `F-CHAT-E04` |

## 6. 功能与规则映射

| 功能范围 | 保护规则 | 主要边界目标 |
|---|---|---|
| `F-CHAT-001~003` | `BR-CHAT-001~006` | 安全 scope、可见性和语境恢复。 |
| `F-CHAT-004~008` | `BR-CHAT-007~013` | safe view、来源、降级和 owner truth 隔离。 |
| `F-CHAT-009~012` | `BR-CHAT-014~020` | 草稿/意图/结果分层、幂等和治理提交边界。 |
| `F-CHAT-013~017` | `BR-CHAT-021~028` | formal change、cursor/recovery、缓存和平台边界。 |
| `F-CHAT-E01~E04` | `BR-CHAT-E01~E04` | 外围能力不越权、不改变主闭环。 |

## 7. 能力级规则停审

### N1 停审

`BR-CHAT-001~006` 已覆盖入口验证、scope/visibility 显式变化、local route 边界和受控动作前置；不存在通过缓存/URL/空列表猜权限的例外。N1 规则足以保护 `F-CHAT-001~003`，允许进入数据归属讨论。

### N2 停审

`BR-CHAT-007~013` 已覆盖 safe view 来源、降级、正文禁止复制、Gate/Artifact 语境和审计回链；不存在以 UI card 替代 owner truth 的规则漏洞。N2 规则足以保护 `F-CHAT-004~008`。

### N3 停审

`BR-CHAT-014~020` 已覆盖 draft/intent/receipt/confirmed 分层、unknown 处理、治理授权和副作用关联；不存在 ACK-as-success 或 Chat direct-write 例外。N3 规则足以保护 `F-CHAT-009~012`。

### N4 停审

`BR-CHAT-021~028` 已覆盖 SDK formal change、重复/缺口/过期、缓存/恢复、低敏诊断和平台壳边界；不存在 direct bus、cache authorization 或 platform ACK-as-business 例外。N4 规则足以保护 `F-CHAT-013~017`。

## 8. 跨能力规则审计

| 检查项 | 结论 |
|---|---|
| 是否存在没有功能来源的规则？ | 否；每条 `BR-CHAT-*` 都映射功能或横向边界目标。 |
| 是否存在同一规则在多个节点重复且语义冲突？ | 未发现冲突；可见性在 N1/N2 分工，命令结果在 N3，恢复/缓存在 N4。 |
| 是否把数据归属矩阵误写成规则？ | 否；规则只约束不得复制、猜测或越权，详细真相/快照/引用在 Step 11。 |
| 是否把接口、事件 schema 或实现校验写成规则？ | 否；未写方法、topic、字段、异常码或事务。 |
| 是否遗漏 ACK、缓存、内部 bus、Runtime、Artifact、Workspace 和平台壳红线？ | 否；均有禁止或边界规则。 |
| 是否有规则保护每个核心功能？ | 是；N1～N4 均有规则映射和停审。 |

## 9. 复杂度判断与设计取舍

| 复杂度来源 | 判断 | 控制方式 |
|---|---|---|
| 可见性/撤销 | 高 | N1/N2 分开约束语境与展示，未知即 fail-closed。 |
| 命令结果/审批 | 高 | N3 统一区分 intent、receipt、confirmed 和 unknown。 |
| 变化/恢复 | 高 | N4 统一约束 formal event、cursor、cache 和 Desktop restart。 |
| 跨端 shell | 中 | `BR-CHAT-028` 统一平台语义，Mobile 仅外围。 |
| 规则数量 | 中 | 28 条核心规则 + 4 条外围规则，按节点组织，不扩张到实现校验。 |

不采用“所有页面各自定义规则”的方式；采用按能力节点集中规则、再用功能映射追踪的方式，减少跨页面状态解释漂移。

## 10. 正式文档回填草稿

正式 `00-需求文档.md` §10 可回填为：

> L5-chat 的业务规则按 N1～N4 能力节点组织。N1 要求入口必须绑定可验证 actor、scope 和 visibility，禁止从 URL、缓存、空列表或错误差异推断权限，并要求 scope/撤销/登出/过期显式触发安全恢复或清理。N2 要求每个展示事实可回链到正式 safe view/ref/summary/result，保留来源、可见性和新鲜度，禁止复制 raw truth、猜测正文/权限或把 GateCard/Artifact card 当 owner truth。
>
> N3 要求 draft、用户意图、transport acknowledgment、formal receipt/result 和 owner confirmed 分层，禁止把点击、ACK、toast 或 optimistic state 当业务成功；未知副作用必须先查询、探测或等待人工决定。N4 要求变化只能经 SDK formal surface 消费，cursor、view revision、local state、draft 和 command attempt 不得混用；duplicate/gap/expired/revoked/reconnecting/requery 等变化必须显式表达，缓存和平台 shell 不得成为授权或业务真相。
>
> 搜索、通知、富文本、Mobile 等外围增强也不得突破可见性、SDK 和 owner truth 边界。Chat 不直接订阅内部 bus、不调用 owner 私有 API、不共享数据库、不执行 Runtime/Tools、不复制 Artifact 正文、不构建 Workspace projection 或 Observability backend。

## 11. Step 10 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否按 N1～N4 组织规则？ | 是 | 每个节点有独立规则表和停审。 |
| 是否覆盖不变量、禁止行为、显式变化、边界约束？ | 是 | 四类核心规则均完整，另补治理/审计约束。 |
| 规则是否能回指功能和边界目标？ | 是 | 已形成功能范围映射。 |
| 是否把接口/实现校验写成业务规则？ | 否 | 未写方法、字段、topic、事务、数据库或异常码。 |
| 是否保护 ACK/缓存/内部 bus/owner truth/平台壳红线？ | 是 | 对应规则已显式列出。 |
| 是否完成能力级和跨能力停审？ | 是 | N1～N4 停审及跨能力审计通过。 |

### 11.1 进入 Step 11 条件

- 核心功能已有不变量、禁止行为、显式变化和边界约束保护；
- 治理/审计约束仅用于 Gate、敏感内容、命令尝试和低敏诊断；
- 规则没有滑入接口、对象字段、数据归属或实现校验；
- 规则与功能映射完整，没有孤儿规则或跨能力冲突；
- 允许创建并完成 `00_req_step_11_data_requirements_ownership.md`。

## 12. 本步结论

Step 10 将 Chat 的核心功能钉在四组硬规则上：安全语境必须可验证，正式事实必须可回链，用户意图必须与 owner 结果分层，变化/恢复必须经正式 SDK 且显式表达。规则明确禁止客户端私造 truth、猜测权限、把 ACK 当业务成功、直订内部 bus、用缓存延长授权和用平台能力改变业务语义。下一步只讨论这些功能和规则涉及哪些真相、快照、引用、禁止保存的数据，以及它们分别归谁所有。
## 13. 原型修复回写

原型回写的硬约束包括：一个群聊最多绑定一个项目、一个项目可关联多个群聊；项目成员、群聊成员和公司成员目录不能混用；并行分支必须分别显示并在汇聚前保持未完成态；Governance Gate 独立于流程节点，按钮点击和 websocket/AG-UI ACK 均不得视为审批成功；未知、过期、撤销和恢复必须显式表达。

- 规则承接：`F-CHAT-018~021`、`AC-FR-CHAT-011~014`。
- 自检：约束仍停留在需求层，不写 schema、接口或实现算法。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

并行分叉和并行汇聚是流程控制结构；Governance Gate 是独立治理决策。Chat 不计算分支完成、不合并成员集合、不由项目成员推断群聊可见性。


| 规则 | 必须成立的边界 | 能力 |
|---|---|---|
| `BR-CHAT-001` | 仅在当前 actor、scope、正式 visibility 可验证时标记入口可见或可操作。 | N1 |
| `BR-CHAT-002` | 不从 URL、深链、缓存、对象名、空列表或 UI 隐藏状态推断存在性、权限或可操作性。 | N1 |
| `BR-CHAT-003` | scope、撤销、登出、链接过期和 session 失效必须显式改变 route/context。 | N1 |
| `BR-CHAT-004` | route、selection、deep-link、last-opened 和恢复位置只是 Chat-local 状态。 | N1 |
| `BR-CHAT-005` | scope/visibility 变化后不继续显示失效敏感 view，缓存不延长授权。 | N1 |
| `BR-CHAT-006` | 受控动作入口以前置 owner 可操作性/授权语境为准，Chat 不授予资格。 | N1 |
| `BR-CHAT-007` | 显示的 owner 事实可回链到正式 safe view/ref/summary/result，保留来源和 visibility。 | N2 |
| `BR-CHAT-008` | 不把 Conversation/Turn、Member、Project、Gate/Decision、Artifact、Workspace、Runtime 或 Observability raw truth 复制成 Chat 业务对象。 | N2 |
| `BR-CHAT-009` | fresh、stale、partial、unavailable、blocked、redacted、revoked 随正式变化显式更新。 | N2 |
| `BR-CHAT-010` | 不从 ref、名称、缓存、错误差异或其他 owner 摘要推断正文、权限、生命周期或完成状态。 | N2 |
| `BR-CHAT-011` | GateCard 只显化 Governance 语境；Artifact card 只显化 safe ref/summary/preview。 | N2 |
| `BR-CHAT-012` | Gate/Decision、敏感成员状态和 Artifact 预览仅在正式 visibility/Policy/治理结果允许时显示或可操作。 | N2 |
| `BR-CHAT-013` | 来源、版本/水位和降级解释足以支持安全回链，不记录 raw body 代替回链。 | N2 |
| `BR-CHAT-014` | draft、selection、local intent、transport ACK、formal receipt/result 和 owner confirmed 保持分离。 | N3 |
| `BR-CHAT-015` | 按钮、表单校验、HTTP/websocket/AG-UI ACK、通知、toast 或 optimistic state 均不代表业务完成。 | N3 |
| `BR-CHAT-016` | 发送/治理意图显式经历本地意图、提交中/等待、正式确认/拒绝/失败/未知。 | N3 |
| `BR-CHAT-017` | 命令 unknown 时先查询、探测或要求用户决定，不盲重放副作用。 | N3 |
| `BR-CHAT-018` | Chat 只发起意图和显示结果，不直接写任何 owner truth。 | N3 |
| `BR-CHAT-019` | Gate 操作需要正式授权语境、目标/责任引用和可回链结果；Chat 不生成 Decision/Policy 结论。 | N3 |
| `BR-CHAT-020` | 客户端副作用尝试可关联安全 request/attempt/result，但客户端记录不等于 owner receipt。 | N3 |
| `BR-CHAT-021` | owner 变化只经 SDK 正式 change/event/resume 进入，reducer 保留来源、visibility 和版本。 | N4 |
| `BR-CHAT-022` | 不直订内部 bus、猜 topic/offset、用墙上时间猜顺序或把连接状态当业务变化。 | N4 |
| `BR-CHAT-023` | duplicate、乱序、gap、cursor expired、revoked、reconnecting、requery、blocked 和 recovered 显式化。 | N4 |
| `BR-CHAT-024` | source cursor、view revision、local selection/read position、draft、attempt 和平台连接状态不得互相替代。 | N4 |
| `BR-CHAT-025` | 缓存不延长 visibility、不补造最新事实、不覆盖 owner change、不把离线意图显示为已提交。 | N4 |
| `BR-CHAT-026` | 重启或恢复后先显示已知状态，再经正式结果重新校准；无法验证时 stale/unknown/blocked。 | N4 |
| `BR-CHAT-027` | 诊断只含低敏连接、缓存、恢复、错误类别和安全 correlation；不含 raw log、secret 或正文。 | N4 |
| `BR-CHAT-028` | Desktop、Web 与后续 Mobile shell 只提供平台能力，不改变核心状态、owner 权限或业务结论。 | N4/全仓 |
| `BR-CHAT-E01` | 搜索/过滤只缩小已授权结果，不通过索引差异推断不可见对象。 | 外围 |
| `BR-CHAT-E02` | 通知、托盘、快捷键和系统分享送达不等于业务状态改变。 | 外围 |
| `BR-CHAT-E03` | 富文本/附件只携安全 ref/metadata，不绕过 Artifact visibility 或把本地文件当 Artifact truth。 | 外围 |
| `BR-CHAT-E04` | Mobile 临时 Capacitor 方案不作为 V1 Desktop 业务前置，也不绕过 SDK。 | 外围 |
