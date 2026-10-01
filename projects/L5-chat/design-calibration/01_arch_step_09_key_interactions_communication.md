# Step 9 · 关键交互与通信方式

> 架构主题：判断 `L5-chat` 的关键场景应采用同步请求/响应、异步事件/回调还是后台任务/延后承接，并把失败、挂起和正式边界写清。
> 当前状态：已完成本 Step 的关键场景识别、逐架构单元交互停审、通信方式判断、简化示意和跨交互审计；允许进入 Step 10。
> 直接输入：`01_arch_step_04_system_context.md`、`01_arch_step_06_container_deployment.md`、`01_arch_step_08_data_ownership_consistency.md`、`01_arch_step_07_dependency_direction.md`、`00-需求文档.md` §6/§7/§10/§12/§13。
> 本步限制：只判断通信类别和边界理由；不写 API 路径、事件名、DTO、schema、MQ/RPC/HTTP 选型、时序图、重试实现或技术参数。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 9 · 关键交互与通信方式 |
| 前置门禁 | Step 8 `pass` |
| 本步目标 | 让同步入口只收口需要即时判断的动作，让正式变化和结果通过异步承接，让不确定/不适合即时完成的场景进入后台延后承接。 |
| 本步输出 | 关键交互场景表、通信方式判断表、逐架构单元停审、失败降级、简化交互示意、跨交互审计和 §10 回填草稿。 |
| 本步不展开 | 协议、接口目录、事件 schema、时序、技术选型、实现重试和组件配置。 |
| 边界原则 | 任何交互都必须经过 `L0-sdk` 或已收敛的平台/诊断正式边界；Chat 不直穿 owner、内部 bus 或共享数据库。 |

## 2. SOP 问题回答

### 2.1 哪些交互适合同步请求 / 响应？

适合在当前边界即时收口的场景包括：

- 进入或切换安全语境时，获取当前 actor、scope、visibility 和入口可用性判断。
- 读取当前页面所需的 owner safe view、summary、ref、preview availability 或明确的 unavailable/restricted 结果。
- 用户创建草稿、选择回复目标、展开卡片、改变焦点和本地筛选等纯 Chat-local 动作。
- 通过正式 SDK 发起发送或受控治理意图，并获得“已接收/未接收、需要等待、明确拒绝或明确失败”的边界判断；这不等于 owner 已完成业务副作用。
- 请求正式 requery、resume 或 probe，以便判断变化缺口或 unknown 结果是否已收敛。

同步的含义是当前边界得到明确的状态判断或失败口径，不是要求远端 owner 在同一次交互内完成全部生命周期。

### 2.2 哪些交互适合异步事件 / 回调？

- Conversation/Turn、Governance、Artifact、Workspace、Member、Runtime 的正式状态变化在 owner 成立后向 Chat 送达。
- 发送或治理意图的正式 receipt/result/change 回送。
- scope/visibility 撤销、版本变化、预览可用性变化和安全清理信号。
- 已请求的恢复、查询或缺口修复结果回送。

这类场景的核心是正式事实传播或结果送达，不应被伪装成同步函数已完成。Chat 只消费 SDK 暴露的 formal change/event/resume 语义，不直接订阅 `L0-bus`。

### 2.3 哪些交互适合后台任务 / 延后承接？

- 应用重启、断线或平台后台限制后的本地恢复准备和展示重建。
- 缺口、过期或来源不明时的正式 requery/resume 承接。
- unknown 副作用的状态探测、等待正式结果或提示用户决定。
- 大范围页面的局部刷新、safe preview 准备和非关键低敏诊断交接。
- 本地受限状态的清理、过期收紧和恢复上下文整理。

后台承接只能推进客户端连续性和正式结果等待，不能成为 owner command 执行者、离线审批者或内部 bus consumer。

### 2.4 哪些交互必须经过总线或正式边界，不能直接穿透？

- 所有业务 query、command、safe ref/summary/preview/result、formal change 和 resume 必须经 `L0-sdk`。
- 所有 owner 状态变化、receipt/result 和撤销/可见性变化必须经 SDK 暴露的正式变化边界。
- 平台窗口、输入、通知、存储、深链和辅助技术必须经平台宿主接缝；平台不直接调用 owner。
- 低敏诊断只经正式 handoff 边界；页面不直接写 Observability backend。
- `L0-bus` 只作为 SDK 内部封装的可能来源，不能成为 Chat 的直接通信面。

### 2.5 关键依赖失效时如何降级或挂起？

- 同步请求未得到明确结果：保持 loading/pending/unknown，并显示可理解的下一步；不以连接成功或 ACK 代替业务结论。
- 异步变化未送达：保留 stale/gap/reconnecting/unknown，等待正式承接或发起受控 requery；不猜顺序、不补造事件。
- 后台承接无法运行：保留最小安全页面、草稿和明确的 unavailable/needs-action；不把离线状态升级为已完成。
- visibility、scope 或 actor 无法验证：fail-closed，遮蔽/清理受影响内容，禁止继续操作。
- 诊断交接失败：本地显示低敏错误类别即可，不影响业务、授权或恢复上限。

### 2.6 哪些通信口径最容易误入协议细节？

“实时”不等于某种传输协议；“ACK”不等于业务提交；“事件”不等于内部 bus topic；“恢复”不等于 broker replay；“后台任务”不等于独立服务端 worker；“同步”也不等于 owner 生命周期在当前请求内完成。正式架构只保留通信类别、边界目的和失败姿态，把协议与技术选择留给后续 Step。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “WS/SSE/AG-UI 实时通道” | 把未闭合传输候选写成正式通信事实。 | 改为 SDK formal change/event/resume 的异步变化类别，协议后置。 |
| “点击发送后同步成功” | 把 UI 动作/transport ACK 当 owner confirmed。 | 同步只收口接收/失败判断；正式结果通过异步回送或正式查询收敛。 |
| “重连自动重放命令” | unknown 下产生重复副作用。 | 后台只做 probe/requery/等待；副作用重试须有正式结果和幂等边界。 |
| “客户端订阅内部 bus” | 暴露 topic/offset/replay 并绕过 SDK。 | 变化必须经 SDK 正式边界；直接 bus 边裁剪。 |
| “诊断上报是业务主链” | sink 失败会阻断业务或造成观测越权。 | 低敏诊断为可选异步/后台交接，故障隔离。 |
| “后台 worker 执行治理/Runtime” | Chat 吸收 Governance/Runtime 执行职责。 | 后台只承接客户端连续性和正式结果等待，不执行 owner 副作用。 |

## 4. 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 安全语境进入与切换 | Chat 与 `L0-sdk` 正式接入边界、平台入口边界 | 判断当前 actor/scope/visibility 下入口是否可见、可读或可操作。 | 需要即时状态判断，但不由 Chat 裁决权限。 |
| 当前协作 safe view 读取 | Chat 与 SDK owner-safe query/ref 边界 | 获取页面所需的安全对话、项目、成员、治理、Artifact、Workspace 或 Runtime 材料。 | 是消费边界，不转移 owner truth。 |
| 本地草稿与选择变化 | Chat 内部核心语义与本地状态承载边界 | 维护未提交草稿、回复目标、选择、焦点和局部展示。 | 纯 Chat-local，不应穿透到 owner 或远端事件面。 |
| 普通发送意图发起 | Chat 与 Conversation 的正式 SDK command 边界 | 让用户表达发送意图并得到接收、等待、拒绝或失败的明确姿态。 | 发送意图与 Turn 正式写入分离。 |
| 受控治理意图发起 | Chat 与 Governance 的正式 SDK command 边界 | 在正式授权语境下发起 Gate/Decision 相关动作并取得正式结果关联。 | GateCard 只显化和发起，不生成 Decision。 |
| 正式 owner 状态变化传播 | SDK formal change/event/resume 边界与客户端连续性承接 | 将已成立的 Turn、Decision、Artifact、Workspace、Member 或 Runtime 变化送达页面。 | 核心是事实传播，不是同步请求闭环。 |
| receipt/result 回送 | owner/SDK 正式结果边界与 Chat-local 结果姿态 | 将正式接收、确认、拒绝或失败结果映射到客户端。 | 不能用按钮、ACK 或通知替代正式结果。 |
| 变化缺口与 cursor/resume 恢复 | SDK formal resume/requery 边界与客户端连续性承接 | 恢复缺失、过期或撤销后的安全页面连续性。 | 不暴露 broker offset/replay，不保证离线业务成功。 |
| unknown 副作用探测 | Chat 与 SDK 正式查询/probe 边界 | 判断发送或治理尝试是否已成立，避免重复副作用。 | 探测不是自动重放，也不由 Chat 生成 receipt。 |
| 应用重启/断线后的本地恢复 | 客户端连续性承接与本地受限状态承载 | 恢复草稿、选择、最小安全展示和下一步提示。 | 可后台延后，不将缓存视为当前 truth。 |
| Artifact safe preview 获取 | Chat 与 Artifact safe preview/ref 边界 | 获取可展示的安全预览、摘要或不可预览原因。 | 正文和版本链仍归 Artifact。 |
| Workspace safe view/export 更新 | Chat 与 Workspace safe view/export 边界 | 显示跨项目 attention/进度等正式安全视图。 | Chat 不重建 projection/attention。 |
| 低敏诊断交接 | Chat 与 Observability/support 正式 handoff 边界 | 交接连接、缓存、恢复和错误类别的最小关联信息。 | 诊断不参与业务结果和授权。 |

## 5. 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 安全语境进入与切换 | 同步请求 / 响应类交互 | 不宜仅靠异步变化决定入口初始资格 | 无法验证时 restricted/blocked，清理旧语境。 | 初始可见性和可操作性需要即时判断。 |
| 当前协作 safe view 读取 | 同步请求 / 响应类交互 | 不宜用旧缓存伪装为当前正式结果 | 显示 stale/partial/unavailable，来源不明时不展示受保护材料。 | 页面首次进入需要明确可消费状态。 |
| 本地草稿与选择变化 | 同步请求 / 响应类交互 | 不宜发送到 owner 或内部事件面 | 本地承载失败时保留最小内存态并提示恢复受限。 | 这是 Chat-local 变化，不需要跨边界传播。 |
| 普通发送意图发起 | 同步请求 / 响应类交互 + 后续异步结果 | 不宜把同步接收直接当 Turn confirmed；不宜只靠异步而不给即时接收判断 | 明确 submitted/pending/rejected/failed/unknown；结果未知时 probe/等待。 | 同步负责边界接收判断，正式 Turn 结果可后续送达。 |
| 受控治理意图发起 | 同步请求 / 响应类交互 + 后续异步结果 | 不宜本地确认或以卡片点击完成 Decision | 未有正式 receipt/result 时保持 pending/unknown/read-only；不盲重放。 | 授权和治理结果必须由 Governance owner 收口。 |
| 正式 owner 状态变化传播 | 异步事件 / 回调类交互 | 不宜伪装为同步轮询闭环或直订内部 bus | 保持未消费/stale/gap，等待正式承接或受控 requery。 | 本质是已成立事实传播。 |
| receipt/result 回送 | 异步事件 / 回调类交互 | 不宜以页面刷新或主动拉取作为唯一主路径 | 保持 pending/unknown，直到正式结果到达；可受控查询。 | 结果送达应可与原始尝试关联。 |
| 变化缺口与 cursor/resume 恢复 | 后台任务 / 延后承接类交互 | 不宜在当前页面同步阻塞至完整恢复；不宜直接 broker replay | 显示 reconnecting/gap/blocked，恢复前不宣称完整历史。 | 恢复是连续性承接，不是即时业务提交。 |
| unknown 副作用探测 | 后台任务 / 延后承接类交互 | 不宜自动重放原副作用或以超时判失败 | 保持 unknown，等待正式 probe/result 或用户决策。 | 保护幂等和副作用边界。 |
| 应用重启/断线后的本地恢复 | 后台任务 / 延后承接类交互 | 不宜把本地恢复写成 owner change 或离线成功 | 恢复失败时保留草稿/最小安全快照，显示 unavailable/needs-action。 | 可以延后且不要求远端即时收口。 |
| Artifact safe preview 获取 | 同步请求 / 响应类交互；变化后可异步更新 | 不宜把引用直接当正文或依靠旧预览持续授权 | preview unavailable/visibility unknown 时只显示 ref/原因。 | 首次预览需要明确结果，后续可由正式变化更新。 |
| Workspace safe view/export 更新 | 同步请求 / 响应类交互 + 异步变化 | 不宜在 Chat 内自行重建 projection/attention | stale/partial/blocked，等待正式 view/export。 | Workspace 真相必须留在 owner。 |
| 低敏诊断交接 | 异步事件 / 回调类交互或后台任务 | 不宜同步阻塞业务；不宜直写 raw backend | sink 失败只保留本地低敏提示。 | 诊断是可选支链。 |

## 6. 按架构单元的交互方式停审

### 6.1 架构单元 A：协作体验语境

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | 安全语境进入、当前 safe view/ref/summary/preview 读取和页面局部查询。 |
| 异步事件 / 回调 | owner 正式变化、receipt/result、撤销和可见性变化经 SDK 送达。 |
| 后台任务 | 缺口恢复、局部重查、页面重建和过期/撤销后的安全收紧。 |
| 补偿 / 挂起 | stale/partial/blocked/unavailable；来源不明或 visibility 无法验证时不展示、不操作。 |
| 停审 | `pass`：展示场景与同步/异步/后台类别匹配，不把页面刷新或缓存写成正式变化。 |

### 6.2 架构单元 B：受控协作意图

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | 发起发送或受控治理意图，收口接收、拒绝、失败或需等待的边界判断。 |
| 异步事件 / 回调 | 正式 receipt/result/change 回送并更新 confirmed/rejected/failed 姿态。 |
| 后台任务 | unknown probe、等待正式结果、重启后恢复尝试关联和用户下一步提示。 |
| 补偿 / 挂起 | submitted/pending/unknown/read-only；不得自动重放未知副作用。 |
| 停审 | `pass`：local intent 与 owner result 分离，按钮/ACK 不被当作成功。 |

### 6.3 架构单元 C：安全语境与导航

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | actor/session/scope/visibility 判断、入口切换和撤销确认。 |
| 异步事件 / 回调 | scope/visibility 变化、登出/撤销信号和安全清理提示。 |
| 后台任务 | 重启后语境恢复、失效路由收紧、旧投影清理和深链再次验证。 |
| 补偿 / 挂起 | restricted/blocked/cleared；不能从 URL、空列表、缓存或平台登录状态补齐授权。 |
| 停审 | `pass`：导航交互以正式安全结果为准，未把路由解析当存在性或权限。 |

### 6.4 架构单元 D：变化与恢复连续性

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | 受控 requery/resume/probe 请求，获取明确的恢复或未知结果判断。 |
| 异步事件 / 回调 | formal change/resume、结果回送和缺口修复结果。 |
| 后台任务 | reconnect、gap/expired 承接、局部重建和安全快照整理。 |
| 补偿 / 挂起 | stale/gap/reconnecting/unknown；不直订 bus、不猜顺序、不把恢复 toast 当业务确认。 |
| 停审 | `pass`：连续性处理不滑入协议或 owner repair，后台承接不执行副作用。 |

### 6.5 架构单元 E：平台体验与可访问性

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | 平台输入、窗口、系统返回、存储和辅助技术能力查询。 |
| 异步事件 / 回调 | 通知、宿主能力变化和可访问性状态变化。 |
| 后台任务 | 平台恢复、通知整理、缓存清理和低带宽/后台受限姿态。 |
| 补偿 / 挂起 | needs-action/unavailable；平台能力不完整时沿用共享业务语义，不改变 owner 结果。 |
| 停审 | `pass`：平台通信只承接宿主能力，未形成业务状态或授权旁路。 |

### 6.6 架构单元 F：owner-safe 材料镜像

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | 获取 safe view/ref/summary/preview/result 的当前可消费材料。 |
| 异步事件 / 回调 | owner formal change、preview 可用性、visibility 和版本变化。 |
| 后台任务 | 缺口重查、过期材料收紧、局部预览准备和来源整理。 |
| 补偿 / 挂起 | stale/partial/unavailable/blocked；不从其他 owner 摘要补齐正文或生命周期。 |
| 停审 | `pass`：材料获取和变化送达均经正式 SDK 边界，协议细节未下沉。 |

### 6.7 架构单元 G：本地展示与恢复投影

| 交互类别 | 收敛结论 |
|---|---|
| 对外同步调用 | 本地读取/更新 Chat-owned draft、selection 和恢复上下文。 |
| 异步事件 / 回调 | 本地状态失效、清理、正式结果/变化映射和诊断 handoff。 |
| 后台任务 | 过期清理、重启恢复、受限缓存整理和跨端能力存在时的恢复承接。 |
| 补偿 / 挂起 | unavailable/needs-action/cleared；本地写入失败不晋级 owner 成功。 |
| 停审 | `pass`：本地投影只支持体验连续性，不承担 owner command、projection 或事件回放。 |

## 7. 简化交互示意图

```text
       +----------------------+          +----------------------+
       | Chat 用户 / 平台输入 |          | owner 正式变化        |
       +----------+-----------+          +----------+-----------+
                  | 同步请求 / 响应                    | 异步事件 / 回调
                  v                                    v
       +----------+------------------------------------+----------+
       |                 L0-sdk 正式边界                           |
       +----------+----------------------+-------------------------+
                  |                      |
                  | 同步结果 / 意图      | formal change / resume
                  v                      v
       +----------+-----------+  +-------+----------------+
       | Chat 体验与意图     |  | 连续性 / 恢复承接      |
       +----------+-----------+  +-------+----------------+
                  |                      |
                  +----------+-----------+
                             | 后台延后承接
                             v
                  +----------+-----------+
                  | 本地受限状态 / 提示 |
                  +----------------------+
```

图示说明：

- 同步路径用于即时判断和正式意图接收，异步路径用于 owner 事实和结果送达，后台路径用于恢复、探测和延后收敛。
- 图中的 SDK 是唯一业务边界；它不表示具体协议、调用顺序、事件名或实现组件。
- 本地受限状态只支持客户端连续性，不把后台承接变成 owner 执行者。

## 8. 失败降级与挂起结论

| 通信失败类别 | 架构层处理 | 不得发生 |
|---|---|---|
| 同步请求超时、拒绝或未明确接收 | 保持 loading/pending/failed/unknown，显示下一步或受控查询入口。 | 不显示 confirmed，不以 toast/ACK 补齐。 |
| 异步变化暂未送达 | 保持 stale/gap/reconnecting/unknown，等待正式承接或 requery。 | 不按墙上时间猜顺序，不直订内部 bus。 |
| formal result 与本地尝试无法关联 | 保持 unknown/read-only，要求正式探测或用户决定。 | 不把相似文本、页面刷新或名称匹配当作确认。 |
| visibility/scope 撤销或不明 | restricted/redacted/cleared，清理敏感投影。 | 不因离线、缓存或深链继续展示/操作。 |
| 后台恢复不可用 | 保留草稿和最小安全页面，显示 unavailable/needs-action。 | 不离线审批、不自动重放副作用。 |
| 诊断交接失败 | 本地保留低敏错误类别和恢复建议。 | 不阻断业务，不写 raw log 或 secret。 |

## 9. 跨交互边界审计

| 审计项 | 结果 | 证据 / 处理 |
|---|---|---|
| 是否识别关键同步、异步和后台场景 | `pass` | 11 类关键场景已分类，包含读取、意图、变化、恢复、预览、诊断。 |
| 是否按架构单元逐个停审 | `pass` | A～G 七个单元均定义同步、异步、后台和补偿路径。 |
| 是否与 Step 8 一致性口径匹配 | `pass` | 安全强约束走同步判断；owner 变化/结果异步送达；缺口/unknown 后台延后承接。 |
| 是否保持 SDK-only 正式边界 | `pass` | 所有业务 query/command/change/resume 均经 `L0-sdk`；不直连 owner 或 bus。 |
| 是否把协议细节下沉到本 Step | `pass` | 未写 API、事件、DTO、schema、MQ、RPC、时序或技术产品。 |
| 是否存在同步/异步选择冲突 | `none` | 同步只收口即时判断；异步只传播正式事实/结果；后台只承接延后连续性。 |
| 是否存在失败降级缺口 | `none` | timeout、未送达、unknown、撤销、后台不可用和诊断失败均有挂起/收紧口径。 |
| 是否保留后续承接风险 | `pass` | exact SDK surface、cursor/resume、Governance receipt、Artifact preview、Workspace view 和诊断 envelope 继续 blocked/pending。 |
| 是否存在 unresolved 交互边界冲突 | `none` | 未发现直接穿透、通信类型误判或把连接状态当业务结果的路径。 |

## 10. 当前 blocker 对交互通信的影响

| blocker | 影响 | 当前口径 |
|---|---|---|
| `CHAT-UP-001` | SDK query/command/event/ref/result/resume exact surface 未闭合。 | 只收敛通信类别与边界，不固化方法、协议或时序。 |
| `CHAT-UP-002` | Conversation change/cursor/resume 影响正式变化和恢复。 | 变化异步、恢复后台、缺口 unknown/requery；不宣称 transport 已闭合。 |
| `CHAT-UP-003` | Governance receipt/idempotency/result 影响治理意图收口。 | 同步只收口接收/拒绝/等待，confirmed 等正式结果异步或查询获得。 |
| `CHAT-UP-004` | Artifact preview/ref/visibility 影响预览交互。 | 首次获取同步判断，变化可异步更新；缺 contract 时 ref-only/unavailable。 |
| `CHAT-UP-005`、`WS-UP-001~008` | Workspace safe view/export/attention 影响跨项目页面更新。 | 只消费正式 view/export；stale/partial/blocked，不在 Chat 轮询重建。 |
| `CHAT-UP-007`、`OPEN-CHAT-012` | 诊断交接可能不具备正式 handoff。 | 保持可选异步/后台支链，sink 失败不影响业务。 |

## 11. 正式回填草稿

### 11.1 §10 关键交互与通信方式

`L5-chat` 将关键交互分为三类：需要当前边界即时判断的安全语境、safe view 读取、本地动作和正式意图接收，采用同步请求/响应；owner 已成立的状态变化、receipt/result、可见性撤销和预览/版本变化，采用经 `L0-sdk` 提供的异步事件/回调；缺口恢复、unknown 探测、应用重启、断线重建、过期清理和非关键诊断，采用后台任务/延后承接。同步只表示获得明确的边界判断，不表示 owner 生命周期已在同一次交互内完成。

所有业务交互必须经 `L0-sdk` 正式边界，平台能力和诊断分别经各自接缝进入。Chat 不直订内部 bus、不暴露 topic/offset/replay、不把协议 ACK 或通知当业务结果。通信未按预期达成时按来源进入 pending、unknown、stale、gap、reconnecting、restricted、unavailable、blocked 或 needs-action；正式结果未知时先探测、查询、等待或请求用户决定，不盲重放副作用。

## 12. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否识别关键交互场景及正式边界 | `pass` | 场景表覆盖安全进入、读取、意图、变化、结果、恢复、预览、Workspace 和诊断。 |
| 是否明确同步/异步/后台判断与理由 | `pass` | 每行均有推荐方式、不宜方式、失败处理和边界说明。 |
| 是否按架构单元逐个停审 | `pass` | A～G 七个单元完成四类交互收敛。 |
| 是否与数据归属/一致性策略一致 | `pass` | 强约束同步判断、最终一致异步传播、unknown/缺口后台承接关系清楚。 |
| 是否保持正式边界和 SDK-only | `pass` | 没有直接 owner、bus、共享 DB 或诊断 backend 路径。 |
| 是否避免接口/协议/时序实现细节 | `pass` | 未写 API path、event name、DTO、schema、MQ/RPC、时序或重试脚本。 |
| 是否有完整失败降级和挂起口径 | `pass` | 同步失败、异步未达、unknown、撤销、后台不可用和诊断失败均覆盖。 |
| 是否完成跨交互审计且无 unresolved 冲突 | `pass` | 无同步/异步冲突、直接穿透、协议下沉或降级缺口。 |
| 是否完成正式 §10 回填草稿 | `pass` | 通信类别、边界和失败主文已形成。 |

## 13. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 架构单元级 | `pass` | 七个架构单元交互方式均已停审，通信类别与所有权/一致性相容。 | 允许进入 Step 10；按顺序收敛关键技术选型。 |
| Step / 模块级 | `pass` | 关键场景表、通信判断、失败降级、示意图和跨交互审计完成。 | 更新 flow 与项目台账后创建 Step 10。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 10～16，旧正式文件仍保持 historical material。 | 继续 Step 10；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 exact SDK/owner/platform blocker，按顺序进入 Step 10。 |


### 本轮 Step 9 模块 A 独立自检

- 问题：选阶段/节点是否发送推进？
- 诊断：原型混合页面选择与业务流程。
- 取舍：查询分层投影，点击只更新 UI。
- 结构化/回填：整体→阶段→节点，下钻获准 ref，缺面 unavailable。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 跨模块诊断与取舍

七单元交互已独立审查。旧 §10 只列 safe view 通用读取，未说明流程下钻、节点关联、目录和撤销。补同步 query、本地导航、异步正式变化、后台有界重查四者的责任；图不能把 Chat-local 输入画成必须经过 SDK 才能改本地选择。

### 结构化结果与回填

新增三类场景与 late response 防护；区分 optimistic 是可撤销本地意图表现，confirmed 必须业务结果已确认，不能仅因为有 receipt 就成立。receipt 必须有 owner 明确的业务含义。幂等 key/查询/retry 按 SDK 正式语义，未确认时不可盲重放。

回填 §10.2、10.3 与图后说明；图仅外部业务输入经 SDK，本地选择/草稿不穿 SDK。复杂度：已有图加说明，不写事件字段/算法。自检：所有 command SDK-only；节点点击不推进；各源变化不交叉确认；无测试结果。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：项目下钻、双向入口与来源分立 reducer/重连交互已补全。
- next_allowed_action：进入 Step 10，重新读取其 SOP 与前序输入。



### 本轮 Step 9 模块 G 独立自检

- 问题：离线如何读和恢复？
- 诊断：缓存可读易被当当前结果。
- 取舍：仅获准受限展示；恢复后正式 requery。
- 结构化/回填：草稿恢复≠发送；没有正式跨端同步能力不上传合并。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 9 模块 F 独立自检

- 问题：节点详情从哪里取得关联？
- 诊断：不能根据相似名称拼关联。
- 取舍：只读取正式 relationship/ref 与 safe query。
- 结构化/回填：Work、Artifact、Runtime、Conversation、Gate 分别查询降级。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 9 模块 E 独立自检

- 问题：宿主后台暂停算断流吗？
- 诊断：连接恢复不等于数据恢复。
- 取舍：返回前重新验证会话/授权/resume。
- 结构化/回填：键盘、画布焦点和恢复播报不推动业务。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 9 模块 D 独立自检

- 问题：迟到查询与变化如何合并？
- 诊断：切换项目后旧响应会污染新视图。
- 取舍：按当前 actor/scope/project/source 语境接收。
- 结构化/回填：duplicate/乱序/gap 经 SDK 语义处理，旧语境不得覆盖当前或复活撤销。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 9 模块 C 独立自检

- 问题：项目↔群聊↔目录如何安全导航？
- 诊断：单次项目授权不涵盖群聊/DM。
- 取舍：目标关系与权限单独正式检查。
- 结构化/回填：解除/撤销优先阻断旧入口，保留安全回程。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 9 模块 B 独立自检

- 问题：审批/发送重连如何处理？
- 诊断：ACK 和恢复易导致重复提交。
- 取舍：本地 attempt 与正式 result 分层；按 SDK 幂等语义重试。
- 结构化/回填：unknown 先正式查询，缺 probe 则 waiting/needs-action。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。
