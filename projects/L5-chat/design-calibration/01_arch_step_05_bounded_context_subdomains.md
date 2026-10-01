# Step 5 · 限界上下文与子域划分

> 架构主题：收敛 `L5-chat` 内部的语义结构，区分核心子域、支撑子域和外部上下文的本地索引 / 投影 / 引用。
> 当前状态：已完成本 Step 的上下文划分、逐上下文停审、关系图和跨上下文审计；允许进入 Step 6。
> 直接输入：`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md`、`00-需求文档.md` §2/§4/§6/§7/§10/§11、`draft/03_模块划分与分层.md`（仅作预推演输入）。
> 本步限制：只讨论本仓内部语义结构；不固化代码模块、路由名、容器、数据库、字段、函数、API/DTO、事件 schema、传输协议或技术选型。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 5 · 限界上下文与子域划分 |
| 前置门禁 | Step 4 `pass` |
| 本步目标 | 说明 Chat 内部哪些语义是产品核心，哪些是支撑，哪些只是外部 owner 材料的本地索引 / 投影 / 引用。 |
| 本步输出 | 子域 / 上下文划分表、上下文关系图、统一语言、逐上下文停审、跨上下文语义边界审计、§6 回填草稿。 |
| 本步不展开 | 容器部署、依赖方向、数据一致性、接口协议、运行时顺序、具体技术栈和实现目录。 |
| 允许的外部事实 | 只保留“经 `L0-sdk` 提供的正式 safe view/ref/result/change”这一边界事实；不展开其合同细节。 |

## 2. SOP 问题回答

### 2.1 本仓内部有哪些子域或本地上下文？

本仓内部形成两个核心子域、三个支撑子域和两个本地影子结构：

- 核心子域：`协作体验语境`、`受控协作意图`。
- 支撑子域：`安全语境与导航`、`变化与恢复连续性`、`平台体验与可访问性`。
- 本地索引 / 投影 / 引用：`owner-safe 材料镜像`、`本地展示与恢复投影`。

这里的“核心”描述 Chat 作为客户端产品成立所必需的语义中心，不表示 Chat 获得任何 Conversation、Governance、Artifact、Workspace 或 Runtime 的业务真相。两个核心子域都只处理用户体验和客户端局部事实；正式业务结论仍由 owner 通过 SDK 提供。

### 2.2 哪些是核心子域？

#### 核心子域一：协作体验语境

承载用户如何进入、理解和持续使用一个被授权的协作语境。它把安全的 owner-derived 材料组织成页面、当前选择、Turn 表现、GateCard、Artifact 引用和成员/项目/运行摘要等可理解的体验语义，同时保留来源、可见性和新鲜度的解释空间。

它不创建 Conversation、Turn、Participant、Gate、Decision、Artifact 或 Workspace 对象，也不把跨 owner 材料合并成新的业务生命周期。

#### 核心子域二：受控协作意图

承载用户在当前体验语境中形成的本地意图、尝试和结果姿态。它区分草稿、选择、提交中、等待、正式确认、拒绝、失败和未知，使发送、重试和受控治理入口可以被理解和恢复。

它不执行 owner 命令，不生成 Decision，不确认 Turn 已写入，不把按钮、表单校验、transport ACK、toast 或 optimistic 展示升级为业务成功。

### 2.3 哪些是支撑子域？

- `安全语境与导航`：为核心体验提供 actor/session/scope/visibility 的进入、保持、撤销和离开语义；不认证、不签发 credential、不裁决权限。
- `变化与恢复连续性`：为核心体验和受控意图提供正式 change/resume 的连续性表达，以及断线、缺口、重启、缓存过期和 unknown 的可恢复姿态；不拥有 bus delivery、owner repair 或业务 replay truth。
- `平台体验与可访问性`：把窗口、输入、通知、深链、存储、系统返回和辅助技术能力适配到共享体验语义；不让平台差异改变业务状态、授权或结果。

支撑子域不是独立业务产品。它们围绕两个核心子域提供约束和连续性，不能脱离 Chat 的客户端语境单独定义 owner truth。

### 2.4 哪些只是外部上下文的本地索引 / 投影 / 引用？

- `owner-safe 材料镜像`：保存或组合来自正式 owner 的安全 view、summary、preview、receipt、result、change 和 ref 的本地消费形态；必须保留来源、可见性、版本/水位和新鲜度语境，不能成为第二真相。
- `本地展示与恢复投影`：为页面重绘、断线、应用重启和跨端切换保留受限展示快照、草稿、选择、焦点和恢复位置；它只支持体验连续性，不延长授权、不确认副作用、不反写 owner。

这两个结构不归类为子域。它们是为稳定消费外部上下文而存在的 Chat-local 影子结构，必须服从核心和支撑子域的边界。

### 2.5 上下文映射关系是什么？

- `安全语境与导航` 约束 `协作体验语境` 和 `受控协作意图` 何时可进入、可见或可操作。
- `owner-safe 材料镜像` 向 `协作体验语境` 提供带来源和降级姿态的显示材料；它不向核心子域提供权限或生命周期结论。
- `受控协作意图` 依赖 `协作体验语境` 的当前选择和安全语境形成用户可理解的动作入口；结果仍需由正式 owner 提供。
- `变化与恢复连续性` 更新两个核心子域的 freshness、gap、unknown、stale、reconnecting 和 blocked 语义，但不替它们确认业务事实。
- `平台体验与可访问性` 承载全部核心和支撑语义的跨端表达；它只能提供宿主能力和等价可访问路径。
- `本地展示与恢复投影` 为 `协作体验语境` 和 `变化与恢复连续性` 提供重启、离线和页面重绘所需的受限材料；它不独立产生事实。

### 2.6 为什么不能把这些部分混成一个上下文？

它们具有不同的语义来源、失效方式和安全后果：

1. 体验语境表达“用户看到什么”，受控意图表达“用户请求什么以及结果处于何种姿态”；混合后容易把展示成功当作业务提交。
2. 安全语境表达“是否可进入或操作”，体验语境表达“如何显化”；混合后容易从 route、空列表或缓存推断权限。
3. 变化与恢复表达“客户端是否仍连续”，owner-safe 材料表达“当前可展示什么”；混合后容易把连接恢复当作业务新鲜或结果确认。
4. 平台体验表达“宿主提供什么能力”，核心语境表达“业务状态如何解释”；混合后容易形成 Desktop、Web、Mobile 各自的业务语义。
5. 本地投影受缓存、撤销和过期影响，正式 owner material 受 owner 合同约束；混合后容易让缓存成为第二真相或延长可见性。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “Chat 编织六域对象并管理统一协作状态” | 把跨域组合写成跨域 truth owner。 | 改写为两个客户端核心子域消费 owner-safe 材料；跨域生命周期仍按 owner 分离。 |
| “消息、审批、Artifact、成员、项目、运行是 Chat 子域” | 把外部 owner 的业务对象清单误写成 Chat 子域。 | 这些只作为 `owner-safe 材料镜像` 的来源类别，不成为 Chat 子域。 |
| “timeline / registry / adapter / view / store” | 将实现模块或代码结构误写成限界上下文。 | 只保留语义上下文：体验、意图、安全语境、连续性、平台适配和本地影子结构。 |
| “GateCard 审批上下文” | 把卡片交互误写成 Governance Decision 上下文。 | `GateCard` 归协作体验语境的显化表现；受控治理动作归受控协作意图，Decision 仍在 Governance。 |
| “workspace inbox / attention 是 Chat 子域” | 可能让 Chat 重建 Workspace projection/attention truth。 | 只消费 Workspace safe view/export 的本地引用和受限展示投影。 |
| “SDK event bus / websocket / AG-UI 事件上下文” | 把传输机制、delivery cursor 或协议候选写成内部语义。 | 只保留变化与恢复连续性上下文，正式变化来自 SDK seam；协议后置。 |
| “Mobile/desktop 各自一套客户端上下文” | 平台分叉导致业务状态和授权语义漂移。 | 平台体验与可访问性是一个支撑上下文，shell 只适配宿主能力。 |

## 4. 子域 / 上下文划分结论

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 协作体验语境 | 核心子域 | 承载被授权协作材料的进入、理解、显化和局部体验连续性。 | 是 Chat 的中心语义，消费 owner-safe 材料并接受安全、变化和平台支撑。 |
| 受控协作意图 | 核心子域 | 承载草稿、选择、动作意图、尝试和正式结果姿态的客户端语义。 | 围绕协作体验语境形成动作入口，受安全语境和连续性约束，不替代 owner 命令结果。 |
| 安全语境与导航 | 支撑子域 | 承载进入、保持、撤销和离开 actor/session/scope/visibility 语境的客户端边界。 | 为核心子域提供可进入、可见和可操作的条件；不拥有认证或权限真相。 |
| 变化与恢复连续性 | 支撑子域 | 承载正式变化消费、重连、缺口、过期、重启和未知结果的客户端连续性表达。 | 支撑核心子域重建体验和意图姿态；不拥有 bus delivery、owner repair 或副作用确认。 |
| 平台体验与可访问性 | 支撑子域 | 承载跨 Desktop/Web/Mobile shell 的宿主能力适配、可访问性和本地安全体验。 | 为全部上下文提供等价宿主路径；不能改变核心语义、owner 权限或结果。 |
| owner-safe 材料镜像 | 本地索引 / 投影 / 引用 | 为稳定展示保留带来源、可见性和新鲜度语境的安全 view/ref/summary/preview/result/change 消费形态。 | 依附于正式 owner 和协作体验语境，只提供可回链材料，不产生业务 truth。 |
| 本地展示与恢复投影 | 本地索引 / 投影 / 引用 | 为重绘、离线展示、重启和跨端切换保留受限快照、草稿、选择、焦点和恢复位置。 | 依附于协作体验语境与变化/恢复连续性；受撤销、过期和清理约束，不延长授权或反写 owner。 |

## 5. 上下文关系图

```text
+------------------------------+    +------------------------------+
| 核心：协作体验语境           |    | 核心：受控协作意图           |
+---------------+--------------+    +---------------+--------------+
                |                               |
                +---------------+---------------+
                                |
                +---------------v----------------+
                | 支撑：安全语境与导航           |
                +---------------+----------------+
                                |
        +-----------------------+-----------------------+
        |                                               |
+-------v----------------+                 +------------v-------------+
| 支撑：变化与恢复连续性 |                 | 支撑：平台体验与可访问性 |
+-----------+------------+                 +------------+-------------+
            |                                             |
            +----------------------+----------------------+
                                   |
             +---------------------v----------------------+
             | 本地：owner-safe 材料镜像                  |
             +---------------------+----------------------+
                                   |
             +---------------------v----------------------+
             | 本地：展示与恢复投影                        |
             +---------------------------------------------+
```

图示说明：

- 核心子域定义 Chat 的产品语义；支撑子域为其提供进入条件、连续性和跨端表达。
- 两个本地影子结构只保存或组合安全消费材料与 Chat-local 状态，不成为 owner truth，也不改变正式授权。
- 图只表达本仓内部语义层次和依附关系，不表达外部上下文对象、接口、事件、数据库、代码模块或运行顺序。

## 6. 逐上下文收敛与停审

### 6.1 架构单元 A：协作体验语境

| 项目 | 收敛结论 |
|---|---|
| 类型 | 核心子域 |
| 职责 | 把正式 owner 允许消费的协作材料组织为可进入、可理解、可访问的客户端体验；表达当前语境、Turn 表现、线程关系、GateCard、Artifact 引用和跨域安全摘要。 |
| 非职责 | 不创建或管理 Conversation、Turn、Participant、Project、Member、Gate、Decision、Artifact、Workspace、Runtime 或 Observability truth；不推断权限、完成、顺序或生命周期。 |
| 统一语言 | `协作体验语境`、`owner-safe 材料`、`显化`、`来源`、`可见性`、`新鲜度`、`降级姿态`。 |
| 本地影子边界 | 只能消费 `owner-safe 材料镜像` 和 `本地展示与恢复投影`；route、selection、focus 和 view composition 不构成业务对象。 |
| 正例 | GateCard 显示正式治理语境和可回链结果；Artifact card 显示 safe ref/preview availability；Turn 显示表现类别和来源/过期说明。 |
| 反例 | 从 GateCard 点击推导 Decision confirmed；从 Artifact ref 推导正文或权限；从空列表或 deep link 推导对象不存在。 |
| 停审结论 | `pass`：核心分类正确；职责是体验语义而非 owner truth；未滑入协议、代码或容器；与 Step 3/4 边界一致。 |

### 6.2 架构单元 B：受控协作意图

| 项目 | 收敛结论 |
|---|---|
| 类型 | 核心子域 |
| 职责 | 表达用户草稿、选择、发送/重试/受控治理动作的本地意图、尝试和结果姿态，并为未知结果提供查询、等待或人工决定的路径。 |
| 非职责 | 不执行 owner command，不生成 Gate/Decision，不确认 Turn 已提交，不以 transport ACK、按钮、toast、缓存或 optimistic 状态宣称业务成功。 |
| 统一语言 | `草稿`、`选择`、`本地意图`、`尝试`、`submitted`、`pending`、`confirmed`、`rejected`、`failed`、`unknown`、`正式 receipt/result`。 |
| 本地影子边界 | `本地展示与恢复投影` 可以保存草稿和尝试关联，但不能把它们改写为 owner receipt/result；`owner-safe 材料镜像` 只提供正式结果或变化的消费形态。 |
| 正例 | 发送请求已发出但结果未知时保持 `unknown`，引导查询或等待；治理入口缺授权时显示不可操作而非本地授予。 |
| 反例 | websocket/AG-UI ACK 后直接显示“已发送”；重连后自动重放未知 Gate 操作；本地 optimistic Turn 被当作 Conversation truth。 |
| 停审结论 | `pass`：核心分类正确；与协作体验语境保持读/写语义分离；unknown 与副作用边界清楚；未吸收 Governance/Conversation 命令实现。 |

### 6.3 架构单元 C：安全语境与导航

| 项目 | 收敛结论 |
|---|---|
| 类型 | 支撑子域 |
| 职责 | 组织 actor/session/scope/visibility 语境的进入、保持、切换、撤销、登出清理和导航位置，使核心子域知道当前体验是否可进入、可见或可操作。 |
| 非职责 | 不认证、不签发或保存 credential，不裁决 Policy/权限，不创建成员，不从 URL、对象名、空列表、缓存或隐藏按钮推断存在性。 |
| 统一语言 | `安全语境`、`入口`、`route/context`、`scope`、`visibility`、`受限`、`撤销`、`失效`、`清理`。 |
| 本地影子边界 | route、deep-link provenance、last-opened、selection 和清理标记是本地状态；它们只能指向或暂存安全材料，不能替代 owner scope/visibility。 |
| 正例 | scope 改变或 session 失效时撤销旧语境、遮蔽敏感材料并清理受影响投影；无法验证 visibility 时进入 restricted/blocked。 |
| 反例 | 只因 URL 可解析就开放页面；只因缓存命中就延长权限；把 shell 登录或窗口状态当作认证/成员生命周期。 |
| 停审结论 | `pass`：支撑分类正确；与核心体验分离；不吸收 Identity、Member 或 Governance truth；fail-closed 语义保留。 |

### 6.4 架构单元 D：变化与恢复连续性

| 项目 | 收敛结论 |
|---|---|
| 类型 | 支撑子域 |
| 职责 | 解释正式 change/resume 消费后的新鲜、过期、缺口、重复、乱序、重连、重查、应用重启和副作用未知姿态，并为核心体验和受控意图提供连续性反馈。 |
| 非职责 | 不直订内部 bus，不拥有 broker offset/delivery/replay，不修复 owner truth，不以连接恢复或本地回放确认业务结果。 |
| 统一语言 | `formal change`、`resume`、`cursor`（仅指 SDK consumer 语境）、`gap`、`duplicate`、`out-of-order`、`stale`、`reconnecting`、`requery`、`unknown`。 |
| 本地影子边界 | 可以维护本地恢复上下文、safe snapshot metadata 和尝试关联；不能把这些变成 owner change cursor、业务版本或成功凭证。 |
| 正例 | cursor 失效时将相关区域置为 stale/blocked 并请求正式重查；重复变化被安全去重；unknown 副作用等待正式 probe/result。 |
| 反例 | 以墙上时间排序事件；按内部 topic/offset 自行补缺；重连完成 toast 后显示 Gate confirmed；用缓存覆盖新鲜来源。 |
| 停审结论 | `pass`：支撑分类正确；连续性与业务真相分离；未锁定传输协议；与 `CHAT-UP-002` 等 blocker 的 pending 姿态一致。 |

### 6.5 架构单元 E：平台体验与可访问性

| 项目 | 收敛结论 |
|---|---|
| 类型 | 支撑子域 |
| 职责 | 让同一客户端语义适配 Desktop/Web/Mobile shell 的窗口、输入、通知、存储、深链、系统返回、辅助技术和本地安全能力，并保证核心路径有等价可访问表达。 |
| 非职责 | 不定义业务状态、授权、owner 结果、缓存真相或平台专属生命周期；不因某个平台能力缺失而绕过 SDK 或改变结果语义。 |
| 统一语言 | `平台 shell`、`宿主能力`、`等价路径`、`可访问语义`、`needs-action`、`unavailable`、`本地清理`。 |
| 本地影子边界 | 平台特有的窗口/通知/存储/辅助技术状态只能支撑本地展示和恢复投影；不得进入 owner-safe 材料镜像成为业务证据。 |
| 正例 | Desktop 无系统通知权限时仍保留页面内状态；移动端缺少某宿主能力时显示 needs-action，不改变 Gate/Turn 结果。 |
| 反例 | 只在某平台允许本地确认审批；将通知送达视为 Turn 已追加；用平台 keychain 或深链直接恢复已撤销业务语境。 |
| 停审结论 | `pass`：支撑分类正确；平台差异被限制在宿主和可访问表达；未提前锁定技术栈或兼容矩阵。 |

### 6.6 架构单元 F：owner-safe 材料镜像

| 项目 | 收敛结论 |
|---|---|
| 类型 | 本地索引 / 投影 / 引用 |
| 作用 | 为核心体验稳定消费来自 Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability 边界的 safe view/ref/summary/preview/result/change。 |
| 非职责 | 不成为任何 owner 的第二真相，不合并跨域生命周期，不保存 forbidden body、credential、token、secret、raw log 或未脱敏 payload，不自行决定可见性。 |
| 统一语言 | `safe view`、`safe summary`、`safe ref`、`preview`、`receipt/result`、`来源`、`版本/水位`、`visibility`、`freshness`、`provenance`。 |
| 本地影子边界 | 只保留为显示和回链所需的最小材料或引用；缓存失效、scope 改变或 revoke 时必须收紧/清理；不能反写 owner。 |
| 正例 | Artifact 仅保留安全 ref、摘要和预览可用性；GateCard 保留正式结果引用和当前可见语境；Workspace 仅显示正式 safe view/export。 |
| 反例 | 复制 Artifact 正文或 Decision policy 到 Chat；从多个摘要拼出“项目已完成”；把本地合成 view 当作 Workspace/Observability truth。 |
| 停审结论 | `pass`：明确是本地影子结构，不是子域；来源、可见性、新鲜度和 forbidden body 边界清楚；未固化 owner DTO。 |

### 6.7 架构单元 G：本地展示与恢复投影

| 项目 | 收敛结论 |
|---|---|
| 类型 | 本地索引 / 投影 / 引用 |
| 作用 | 为页面重绘、离线阅读、草稿恢复、Desktop 重启、跨端切换和局部重连提供受限展示快照、草稿、选择、焦点和恢复位置。 |
| 非职责 | 不延长授权、不确认离线业务成功、不替代正式 change/resume、不持有外部正文或敏感长期缓存、不把本地状态反写 owner。 |
| 统一语言 | `展示快照`、`恢复上下文`、`草稿恢复`、`本地选择`、`缓存`、`过期`、`撤销清理`、`离线只读`。 |
| 本地影子边界 | 依附于安全语境、变化与恢复连续性及协作体验语境；只在带来源/可见性/新鲜度条件下提供展示，无法验证时显示 stale/blocked/unavailable。 |
| 正例 | 应用重启后恢复未发送草稿并明确“尚未提交”；离线时显示带过期标记的安全快照，禁止新的副作用确认。 |
| 反例 | 用缓存内容判断当前权限；离线点批准后显示 confirmed；以 last-opened 或 local read state 更新 Workspace attention truth。 |
| 停审结论 | `pass`：明确是本地影子结构；与 owner-safe 材料镜像、核心意图和安全语境的边界清楚；不把缓存当 truth。 |

## 7. 本地索引 / 投影 / 引用边界结论

### 7.1 允许保留的最小本地语义

- 当前 route/context、选择、焦点、展开/折叠、草稿和回复目标。
- owner-safe 材料的最小展示组合，以及来源、版本/水位、visibility、freshness、redaction 和失效姿态。
- 变化恢复所需的 SDK consumer 语境、局部 gap/unknown 标记和安全重查提示。
- 受控意图的 local intent/attempt 关联及 submitted/pending/confirmed/rejected/failed/unknown 展示姿态。
- 跨端体验所需的本地可访问性状态、宿主能力结果和清理标记。

### 7.2 明确禁止的本地影子

- Conversation、Turn、Participant、Project、ProjectMember、Member、Gate、Decision、Policy、Artifact、Evidence、Baseline、Workspace、Runtime、Tools、Capability、Sandbox 或 Observability backend 的第二真相。
- owner command、Decision policy、权限表、事件 broker offset、内部 bus topic、raw log、外部消息正文和未脱敏诊断 payload。
- credential、token、secret、provider/tool/runtime/bridge body 或任何能绕过正式 visibility/authorization 的缓存材料。

### 7.3 本地影子失效时的语义

本地影子不可用、过期、来源不明、scope 改变、visibility 撤销或版本冲突时，核心体验只能进入 `stale`、`partial`、`restricted`、`unavailable`、`blocked` 或 `unknown` 等明确姿态；不能通过隐藏状态、默认值、名称、空列表或连接状态补齐缺失真相。

## 8. 跨上下文语义映射表

| 来源上下文 | 目标上下文 | 映射语义 | 禁止的跃迁 |
|---|---|---|---|
| 安全语境与导航 | 协作体验语境 | 提供可进入、可见、只读、受限、过期或撤销的展示条件。 | route 可解析 ⇒ 对象存在；缓存命中 ⇒ 当前有权。 |
| 安全语境与导航 | 受控协作意图 | 提供是否存在正式可操作入口的语境提示。 | UI 显示按钮 ⇒ actor 已获授权；shell 登录 ⇒治理资格。 |
| owner-safe 材料镜像 | 协作体验语境 | 提供可回链的 safe view/ref/summary/preview/result/change 和来源/新鲜度。 | 摘要 ⇒ 完整生命周期；ref ⇒ 正文/权限；多源摘要 ⇒ 新业务 truth。 |
| 协作体验语境 | 受控协作意图 | 提供当前选择、回复目标、治理语境和用户可理解的动作入口。 | 选中卡片 ⇒ 命令已执行；卡片状态 ⇒ owner confirmed。 |
| 受控协作意图 | 本地展示与恢复投影 | 保存草稿、attempt 和结果姿态以支持恢复。 | attempt ⇒ receipt/result；unknown ⇒ 可盲重放。 |
| 变化与恢复连续性 | 协作体验语境 | 更新 freshness、gap、reconnect、visibility/revocation 和页面连续性。 | 连接恢复 ⇒ 业务结果确认；transport ACK ⇒ formal change。 |
| 变化与恢复连续性 | 受控协作意图 | 更新 pending/unknown、查询提示和安全重试边界。 | requery 可见 ⇒ 原副作用完成；本地重试 ⇒ 幂等成立。 |
| 平台体验与可访问性 | 全部上下文 | 提供宿主能力、等价路径、焦点和本地安全清理。 | 平台能力差异 ⇒ 业务状态差异；通知/托盘 ⇒ owner 事件。 |
| 本地展示与恢复投影 | 协作体验语境 | 提供受限 snapshot、draft、selection 和恢复位置。 | snapshot ⇒ fresh truth；last-opened ⇒ 当前授权。 |

## 9. 统一语言词汇结论

| 词汇 | 在 Chat 中的严格含义 | 不得替代的外部语义 |
|---|---|---|
| `协作体验语境` | 用户在当前 actor/scope/visibility 下看到和操作的本地产品语境。 | Conversation scope、Workspace projection 或 Governance authorization。 |
| `owner-safe 材料` | 经正式边界允许客户端消费的 view/summary/ref/preview/result/change。 | owner 原始对象、完整正文或生命周期真相。 |
| `显化` | 将安全材料及其来源、新鲜度和降级姿态表达为可理解界面语义。 | 重新计算业务状态或授权。 |
| `本地意图` | 用户在 Chat 中表达的待发起动作及其本地关联。 | owner command、Decision 或 Turn 写入。 |
| `尝试` | 客户端已产生的发起/关联姿态，可处于 submitted、pending、failed 或 unknown。 | owner receipt/result 或 confirmed。 |
| `confirmed` | 有正式 owner result/change 足以支持的客户端显示姿态。 | UI 点击、transport ACK、通知、cache hit 或乐观状态。 |
| `unknown` | 客户端无法安全判断副作用是否成立的状态。 | 失败、成功或可自动重放许可。 |
| `安全语境` | actor/session/scope/visibility 在客户端的受限进入和保持语义。 | 认证签发、Policy 裁决、Member lifecycle。 |
| `变化连续性` | SDK formal change/resume 在客户端的消费、缺口和恢复语义。 | 内部 bus delivery、broker offset 或 owner replay truth。 |
| `展示投影` | 为本地重绘和恢复保留的受限视图材料。 | 当前 owner truth、授权证明或审计证据。 |
| `GateCard` | Governance 语境的客户端显化和受控入口。 | Gate/Decision/Policy 的业务真相。 |
| `Artifact 引用 / 预览` | body-free safe ref、摘要或正式 preview 结果。 | Artifact 正文、版本链、Evidence/Baseline 真相。 |

## 10. 跨上下文语义边界审计

| 审计项 | 结果 | 证据 / 处理 |
|---|---|---|
| 是否区分核心子域、支撑子域和本地索引 / 投影 / 引用 | `pass` | 两个核心、三个支撑和两个本地影子结构在划分表及关系图中独立定义。 |
| 是否把 owner 对象清单误写成 Chat 子域 | `pass` | Conversation、Governance、Artifact、Workspace、Member、Runtime 等仅作为 safe material 来源类别。 |
| 是否把实现模块、路由、代码目录或协议误写成上下文 | `pass` | 只使用语义上下文名；未锁定 SDK 方法、DTO、事件、传输或技术栈。 |
| 是否把本地投影误作真相 | `pass` | 两个本地影子结构均标明来源、visibility、freshness、失效和禁止反写边界。 |
| 是否存在职责重叠 | `pass` | 体验、意图、安全、连续性、平台支撑和本地影子分别有职责与非职责。 |
| 是否存在统一语言冲突 | `pass` | `confirmed`、`unknown`、`safe view`、`scope/visibility`、`formal change` 等词均给出严格含义。 |
| 是否保留待确认项 | `pass` | `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 未被改写为已闭合合同。 |
| 是否与 Step 3/4 外部边界一致 | `pass` | Chat 仍为客户端体验与局部状态拥有者；L0-sdk 仍为唯一业务接入边界；L6-bridges 未进入正式主链。 |
| 是否存在 unresolved 语义冲突 | `none` | 未发现职责重叠、核心误归类、本地投影误作真相或词汇冲突；exact SDK/owner contract 仍作为后续 blocker 保留。 |

## 11. 正式回填草稿

### 11.1 §6 限界上下文与子域划分

`L5-chat` 内部由两个核心子域、三个支撑子域和两个本地影子结构组成。核心子域是 `协作体验语境` 与 `受控协作意图`：前者组织被授权的 owner-safe 材料并形成可理解的客户端体验，后者承载草稿、选择、动作尝试和正式结果姿态。支撑子域是 `安全语境与导航`、`变化与恢复连续性`、`平台体验与可访问性`，分别约束进入与可操作条件、变化/恢复连续性以及跨端宿主和等价可访问表达。

`owner-safe 材料镜像` 与 `本地展示与恢复投影` 只是外部 owner 上下文的本地索引 / 投影 / 引用。它们保存或组合最小安全展示材料、来源、可见性、版本/水位、新鲜度、草稿、选择和恢复位置，不拥有 Conversation、Governance、Artifact、Workspace、Member、Runtime 或 Observability truth，也不延长授权、不确认副作用、不反写 owner。

上下文之间的关系是：安全语境约束核心体验与意图的进入和操作；owner-safe 材料镜像向体验语境提供可回链材料；受控意图在当前体验语境中形成并等待正式 receipt/result/change；变化与恢复连续性更新新鲜、缺口、重连和未知姿态；平台体验与可访问性为所有上下文提供宿主和等价表达；本地展示与恢复投影只支持重绘、离线展示、重启和跨端恢复。上述关系不表示外部 owner 的真相被合并，也不表示任何实现模块或协议结构。

### 11.2 §6 本地索引 / 投影 / 引用边界

本地影子结构必须保留来源、visibility、版本/水位和 freshness 语境；在 scope 改变、撤销、过期、版本冲突、来源不明或 SDK 恢复失败时，只能进入 `stale`、`partial`、`restricted`、`unavailable`、`blocked` 或 `unknown`。Chat 不保存外部正文、credential、token、secret、raw log、provider/tool/runtime/bridge body 或未脱敏 payload，不从 route、空列表、对象名、缓存、连接或平台通知推断正式事实。

## 12. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答本仓内部有哪些上下文及其类型 | `pass` | 两个核心、三个支撑、两个本地影子结构均有独立卡片和划分表。 |
| 是否说明核心、支撑和本地索引 / 投影 / 引用的差异 | `pass` | 类型、作用、关系和禁止跃迁均已明确。 |
| 是否提供上下文关系图 | `pass` | 使用 text 代码块，核心在中心层、支撑在下一层、本地影子在底层。 |
| 是否逐上下文完成职责、非职责、统一语言和影子边界收敛 | `pass` | A～G 七个架构单元均有停审结论。 |
| 是否避免对象清单、代码模块、接口协议和部署细节 | `pass` | 外部对象只作为 safe material 来源；未展开字段、API、容器或技术栈。 |
| 是否避免本地投影被写成真相 | `pass` | 明确禁止反写、授权延长、业务确认和跨域生命周期推断。 |
| 是否完成跨上下文审计且无 unresolved 语义冲突 | `pass` | 职责、分类、词汇和边界审计均通过；未闭合合同以 blocker 保留。 |
| 是否形成正式 §6 回填草稿 | `pass` | §6 主文和本地影子边界已形成。 |

## 13. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 架构单元级 | `pass` | 七个上下文 / 影子结构已逐个停审，核心 / 支撑 / 本地分类正确，职责和统一语言无冲突。 | 允许进入 Step 6；不得提前展开 Step 7 及之后内容。 |
| Step / 模块级 | `pass` | 子域划分、关系图、本地索引 / 投影 / 引用边界和跨上下文审计已完成。 | 更新架构 flow 与项目台账后创建 Step 6。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 6～16，旧正式文件仍保持 historical material。 | 继续 Step 6；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 `CHAT-UP-*`、`WS-UP-*`、`OPEN-CHAT-*` 等 blocker，按顺序进入 Step 6。 |

## 14. 后续 Step 依赖提示

- Step 6 只能使用本 Step 已停审的内部语义结构来讨论运行承载和部署边界，不得重新把本地影子结构写成服务端容器。
- `CHAT-UP-001~007`、`WS-UP-001~008` 和 `OPEN-CHAT-001~012` 仍然阻塞 exact SDK/owner contract、数值、兼容矩阵和诊断 envelope；它们不阻塞本 Step 的边界级通过。
- 继续保持单 agent 串行、只修改 `projects/L5-chat/`、不实现代码、不执行测试、不提交 commit。


### 本轮 Step 5 单元 A 协作体验语境 停审

- 问题：新增五标签和整体/阶段/节点层级应归哪里？
- 诊断：旧语义只覆盖摘要，未承接流程画布。
- 取舍：归现有核心体验，不新建 Process 子域；项目详情、图形/列表等价呈现和节点详情是其产品职责。
- 结构化/回填结论：页面/组件接收来源分立的 safe material，节点点击只改 selection，不推进 Activity/Gate。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 跨上下文问题回答、诊断与取舍

前面 A～G 已逐个完成问题、诊断、取舍和停审。本轮保持两个核心、三个支撑、两个本地投影；项目、流程、群聊与目录只是体验消费主题，不成为独立业务 truth 子域。旧 §6.3 缺新增主题，补表与统一语言。

### 结构化结果与回填

§6.5 明确页面/组件、语义导航、view model/store、SDK adapter/reducer 和宿主的架构责任，供 02/03 细化，不在架构层发明生产 route 字符串、字段、method 或事件 schema。保留 §6.2 关系图并明确为职责依附，不是调用或数据链路。

### 复杂度与自检

关系图已有，新增展示层级以小型 text 图解释整体→阶段→节点及回程。A 不计算流程；B 不确认 owner；C 独立验证访问；D 保留每来源水位；E 提供等价访问；F/G 不制造第二真相。跨单元职责无重叠，pending 不关闭。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：七个单元逐个复核完成，项目/流程体验与局部状态未扩张 owner truth。
- next_allowed_action：进入 Step 6，重新读取其 SOP 与前序输入。



### 本轮 Step 5 单元 G 本地展示与恢复投影 停审

- 问题：能持久化什么？
- 诊断：恢复可能携旧关系/权限跨项目或设备。
- 取舍：只保存获准的选择、草稿、视图偏好和带来源缓存；按 actor/scope/project/source 隔离。
- 结构化/回填结论：可见不等于可留存；跨设备同步须 SDK 正式能力；不持久化 token/Gate truth。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。



### 本轮 Step 5 单元 F owner-safe 材料镜像 停审

- 问题：应镜像哪些材料？
- 诊断：缺流程/绑定/目录材料会诱发本地猜测。
- 取舍：只保留正式流程拓扑/状态与关联 safe ref、目录安全摘要，不保存原始正文或跨域聚合 truth。
- 结构化/回填结论：缺版本、授权或关联能力即 blocked；图上几何布局不是业务拓扑来源。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。



### 本轮 Step 5 单元 E 平台体验与可访问性 停审

- 问题：流程图缩放、键盘、窄窗是否影响业务？
- 诊断：只靠画布颜色将排除辅助技术用户。
- 取舍：布局、缩放/平移、焦点和列表替代归宿主/体验支撑；不改变节点事实。
- 结构化/回填结论：键盘可进入阶段和节点详情；撤销后焦点回安全入口；无协议假设。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。



### 本轮 Step 5 单元 D 变化与恢复连续性 停审

- 问题：流程、工作项、Gate 的变化可否一起确认？
- 诊断：来源水位不同，单一刷新会产生伪统一版本。
- 取舍：分别消费 owner source/version/resume，经 adapter 输入 reducer；gap 显式重查受影响投影。
- 结构化/回填结论：reducer只更新展示，不计算汇聚；旧选择仅在正式关系仍有效时恢复。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。



### 本轮 Step 5 单元 C 安全语境与导航 停审

- 问题：如何项目、群聊、目录往返？
- 诊断：入口共享页面但访问范围不同。
- 取舍：保存当前项目、标签、阶段、节点和返回来源为 local state；进入目标前重新验证正式可见性。
- 结构化/回填结论：不解析 ref 推关系；解除/撤销后清理旧导航，保留安全返回路径。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。



### 本轮 Step 5 单元 B 受控协作意图 停审

- 问题：节点动作或成员 DM 入口是否等于 command 成功？
- 诊断：原型按钮易被解释为已提交/已批准。
- 取舍：保留 local intent/attempt 与 owner result 分层；普通发送/受控审批仍经 SDK。
- 结构化/回填结论：project ref/成员选择不构成授权，unknown 不重放；不新增绑定 command。
- 模块自检：pass（职责分类成立；外部合同保持 blocked；本单元完成后进入下一单元）。
