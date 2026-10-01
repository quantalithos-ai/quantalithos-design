# Step 8 · 数据所有权与一致性策略

> 架构主题：明确 `L5-chat` 拥有的客户端局部真相、从 owner 消费的快照/投影/引用，以及明确禁止进入 Chat 的正文和正式真相；在此基础上收敛一致性与失败挂起口径。
> 当前状态：已完成本 Step 的数据归属、逐架构单元停审、一致性策略和跨数据边界审计；允许进入 Step 9。
> 直接输入：`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_05_bounded_context_subdomains.md`、`01_arch_step_07_dependency_direction.md`、`00-需求文档.md` §4/§6/§7/§10/§11/§13/§15、`00_req_step_11_data_requirements_ownership.md`。
> 本步限制：只讨论架构层的数据归属和一致性口径；不写表结构、字段、缓存 key、DDL、事务脚本、事件 schema、同步实现或数据库参数。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 8 · 数据所有权与一致性策略 |
| 前置门禁 | Step 7 `pass` |
| 本步目标 | 先回答“谁拥有什么、不拥有什么”，再定义安全显示、局部状态、owner 变化和恢复关系的一致性口径。 |
| 本步输出 | 数据归属表、一致性策略表、补偿/挂起口径、逐架构单元所有权停审、简化关系示意图、跨数据边界审计和 §9 回填草稿。 |
| 本步不展开 | 数据库结构、缓存实现、事务机制、outbox/projection worker、协议和代码对象模型。 |
| 总原则 | Chat-owned 数据只描述客户端局部事实；owner truth 只经正式 SDK safe view/ref/result/change 消费，任何本地存在都不转移 owner。 |

## 2. SOP 问题回答

### 2.1 哪些数据由本仓拥有正式真相？

Chat 拥有的正式真相只限于客户端产品自身的局部事实：

- 当前 route/context、入口来源、回退位置和 Chat-local 导航状态。
- 当前 selection/focus/expanded/read-position 等局部交互状态。
- 未提交 draft、回复目标、附件或 Artifact 的安全引用选择，以及本地编辑状态。
- local intent/attempt 及其客户端显示姿态；`confirmed` 只有在正式 owner result/change 足够时才可作为 Chat 的显示结论，不能由本地动作产生。
- 客户端 recovery context、可访问性状态、平台能力姿态和本地清理状态。
- 本地诊断界面可展示的低敏连接/缓存/恢复分类；这不是 Observability truth。

这些数据是 Chat 的产品局部真相，不是领域真相，也不应被其他 owner 当作 Conversation、Workspace、Governance 或 Member 状态。

### 2.2 哪些只是快照、投影或引用？

- owner safe view、summary、preview、receipt、result、formal change 的客户端展示快照或 view model 是快照/投影，不是 Chat truth。
- 展示缓存、重启恢复材料、来源/visibility/freshness metadata、SDK consumer resume 语境和局部 gap 标记是本地投影或运行快照，不是 owner cursor、版本或授权证明。
- Conversation/Turn、Gate/Decision、Artifact、Workspace、Project、Member、Runtime 和诊断材料的 ref 是引用关系数据；引用只支持回链、预览或受控入口，不带来正文或权限。

### 2.3 哪些关系必须强一致？

这里的“强一致”是客户端安全和局部体验约束，不表示 Chat 取得远端分布式事务能力：

1. actor/scope/visibility 的可验证结果与本地可见/可操作姿态必须一致；无法验证时必须收紧或阻塞。
2. Chat-local 的 route、selection、draft 和 focus 之间必须保持局部语义一致；恢复失败不得把半恢复内容当成完整语境。
3. local intent/attempt 与其显示姿态必须保持状态来源一致；本地提交、transport ACK、正式 receipt/result 和 confirmed 不得混合。
4. scope 撤销、logout、visibility 失效或安全清理与相关页面/缓存的继续展示必须一致；撤销后不能继续暴露受保护材料。

### 2.4 哪些关系可以最终一致？

- owner truth 到 Chat-safe view、summary、preview、缓存和页面更新可以最终一致，但必须标注来源、版本/水位、freshness 和降级姿态。
- owner formal change 到本地展示和恢复投影可以最终一致；duplicate、乱序、gap、expired、revoked 和 reconnect 必须可见，不得默默补齐。
- owner receipt/result 到页面 `confirmed/rejected/failed` 姿态可以在正式结果到达后收敛；未收敛时保持 pending/unknown/read-only。
- Artifact 预览、Workspace safe view/export、成员/项目/运行摘要可以最终一致；不可用时显示 unavailable/stale/partial/blocked，不从其他 owner 摘要拼接。
- 低敏诊断交接是尽力而为，不参与业务一致性。

### 2.5 失败时靠什么约束、补偿或挂起？

架构层只定义以下约束，不定义重试脚本或事务实现：

- visibility、scope、actor 或来源无法验证时 fail-closed，进入 restricted/blocked/unavailable，并清理或遮蔽受影响投影。
- owner view、result 或 change 缺失时保留 stale/partial/pending/unknown，不用默认值、缓存命中或连接状态补齐。
- cursor/resume 失效或存在 gap 时经 SDK 正式 requery/resume；在恢复前不宣称完整历史或新结果。
- 副作用结果 unknown 时先查询、探测、等待或交由用户决策，不盲目重放。
- 本地投影只读消费；任何反写需求都必须回到正式 owner command，经 SDK 获得结果后再更新展示。
- forbidden body、credential、token、secret、raw log 和未脱敏 payload 在所有本地持有、诊断和 handoff 面都被排除。

### 2.6 哪些数据边界最容易串仓？

- Chat 的 `confirmed` 显示姿态与 Governance Decision/Conversation Turn 的正式真相。
- Workspace attention/read/hidden/pin 与 Chat-local notification/read position。
- Artifact safe ref/preview 与 Artifact 正文、版本链、Evidence/Baseline。
- Member/Identity safe summary 与 GlobalMember、ProjectMember 和成员生命周期。
- Runtime status/gap 与 Runtime run、checkpoint、tool/provider/body 和 handoff truth。
- SDK cursor/resume metadata 与 owner change cursor、bus offset、replay truth。
- 本地 cache/recovery 与当前授权、当前新鲜度和跨设备同步。

## 3. 历史材料与边界污染诊断

| 历史表达 | 污染风险 | 本 Step 处理 |
|---|---|---|
| “Chat store 保存统一消息、项目、审批、Artifact 状态” | 把多个 owner truth 复制为客户端第二真相。 | 仅保留 Chat-local 状态，owner 内容分类为 safe snapshot/ref/result/change。 |
| “缓存即离线数据源，可继续操作” | 缓存延长授权并把离线点击当业务成功。 | 缓存只支持带 freshness/visibility 的展示；离线副作用保持 pending/unknown/blocked。 |
| “GateCard status = Decision status” | 混淆 UI 表现与治理裁决。 | GateCard 只保存展示投影；confirmed 依赖正式 Governance result/change。 |
| “Artifact preview 可以把正文缓存到客户端” | 扩大敏感正文持有面，形成版本/血缘第二真相。 | 只保留 body-free ref、summary、preview result 和可见性语境。 |
| “Workspace inbox/read state 在 Chat 内维护” | Chat 反向拥有 Workspace projection/attention truth。 | Chat 只拥有本地隐藏/聚焦等体验状态，Workspace 事实只读消费。 |
| “event cursor / ACK 属于 Chat truth” | 把 transport/bus 位置当 owner 版本或业务提交。 | 只保留 SDK consumer recovery metadata；不主张 owner cursor 或业务成功。 |
| “诊断日志与业务数据一起保存” | raw log/正文/secret 进入客户端生命周期并形成观测越权。 | 低敏诊断分类与 correlation/ref 最小化，exact envelope pending。 |

## 4. 数据归属结论

### 4.1 Chat-owned 正式真相

Chat-owned truth 只包含客户端局部产品事实：route/context、selection/focus、draft、local intent/attempt、局部展示姿态、recovery context、可访问性/平台体验状态和本地安全清理状态。它们可以由 Chat 更新，也只能影响 Chat-local 页面和恢复；不能被解释为 Conversation、Governance、Workspace、Artifact、Member、Runtime 或 Observability 的状态。

### 4.2 外部 owner 正式真相

Conversation、Turn、Participant、scope/visibility/change identity；GlobalMember/actor/identity lifecycle；Project、ProjectMember、WorkItem/Iteration；Gate、Decision、Policy、Approval；Artifact、Evidence、Baseline、版本与血缘；Workspace projection、attention、freshness、export；Member runtime presence/interaction；Runtime run/decision/checkpoint/outcome/handoff；Observability audit/evidence/report/backend 均由对应 owner 拥有。Chat 只消费经 SDK 暴露的安全 view/ref/summary/preview/receipt/result/change。

### 4.3 明确的快照 / 投影与引用

本地展示缓存、view model、恢复快照、source/version/visibility/freshness metadata、SDK consumer resume metadata 和页面降级姿态属于快照/投影。Conversation/Turn、Gate/Decision、Artifact、Workspace、Project/Member/Runtime 和诊断 correlation/ref 属于引用关系数据。它们可以支持回链、预览、恢复和状态解释，但不改变正式 owner 的真相、权限或生命周期。

### 4.4 明确不拥有的正文 / 真相

Chat 不拥有或长期保存外部正文、credential、token、secret、raw log、provider/tool/runtime/sandbox/bridge body、Governance policy/decision body、Artifact 正文和敏感 Workspace/Member/Runtime 原始 payload；也不拥有内部 bus topic/offset/replay、owner command receipt 的生成权或跨域 projection 的正式生命周期。

## 5. 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| route/context、入口来源、回退位置 | 正式真相数据 | 由 Chat 拥有的客户端导航真相。 | 只说明当前产品位置，不等于 owner scope 或对象存在性。 |
| selection/focus/展开/局部阅读位置 | 正式真相数据 | 由 Chat 拥有的局部交互真相。 | 不改写 Conversation read receipt、Workspace attention 或 owner state。 |
| 未提交 draft、回复目标和本地编辑状态 | 正式真相数据 | 由 Chat 拥有，直到用户清除或经正式 owner 接受为止。 | draft 不等于 Turn、Decision、Artifact 或审批提交。 |
| local intent/attempt 及客户端结果姿态 | 正式真相数据 | Chat 拥有本地意图和尝试关联；正式结果由 owner 提供。 | `confirmed` 只可由正式 receipt/result/change 支持；本地尝试不能自行确认。 |
| recovery context、重连/缺口/恢复阶段姿态 | 正式真相数据 | Chat 拥有客户端恢复语境和提示状态。 | 不等于 owner repair、bus replay 或业务副作用完成。 |
| 可访问性、平台能力和本地清理状态 | 正式真相数据 | Chat/平台 shell 拥有局部体验状态。 | 不改变业务权限、owner result 或跨端业务语义。 |
| Conversation/Turn/Participant truth | 明确不拥有的正文 / 真相 | 正式真相归 `L1-conversation`。 | Chat 只保留安全 view、引用、分页/变化消费语境和受限快照。 |
| Identity/GlobalMember/actor lifecycle | 明确不拥有的正文 / 真相 | 正式真相归 `L1-identity` 及相关身份边界。 | Chat 不认证、不签发 credential、不保存身份原始材料。 |
| Project/ProjectMember/WorkItem/Iteration | 明确不拥有的正文 / 真相 | 正式真相归 `L1-work`。 | Chat 只显示安全摘要、入口和进度姿态，不推进 Work。 |
| Gate/Decision/Policy/Approval | 明确不拥有的正文 / 真相 | 正式治理真相归 `L1-governance`。 | GateCard 是展示投影；本地按钮和 attempt 不生成 Decision。 |
| Artifact/Evidence/Baseline 正文、版本、血缘 | 明确不拥有的正文 / 真相 | 正式真相归 `L1-artifact`。 | Chat 只保存 safe ref/summary/preview result，不复制正文或版本链。 |
| Workspace projection/attention/freshness/export | 明确不拥有的正文 / 真相 | 正式视图真相归 `L1-workspace`。 | Chat-local hidden/pin/focus 不更新 Workspace truth。 |
| Member presence/interaction 和 Runtime run/status | 明确不拥有的正文 / 真相 | 正式真相归 `L2-member` / `L2-runtime`。 | Chat 只消费 safe status/gap，不执行 runtime 或容器控制。 |
| Observability audit/evidence/report/backend | 明确不拥有的正文 / 真相 | 正式观测真相归 `L4-observability`。 | 客户端诊断只是低敏 handoff/展示，不是 audit 或 evidence。 |
| owner safe view/summary/preview/result/change 的本地展示材料 | 快照 / 投影数据 | 真相仍归相应 owner；Chat 保存最小消费形态。 | 必须保留来源、visibility、版本/水位、freshness 和降级姿态。 |
| view model、展示缓存和恢复快照 | 快照 / 投影数据 | Chat 为页面连续性保留的本地影子。 | 不能作为授权、当前 fresh truth 或业务提交凭证。 |
| SDK consumer resume/gap/last-accepted metadata | 快照 / 投影数据 | Chat 只拥有自身消费恢复语境。 | 不等于 owner change cursor、bus offset、版本或 replay truth。 |
| Conversation/Turn/Gate/Decision/Artifact/Workspace/Runtime refs | 引用关系数据 | Chat 只保存回链、预览或受控入口所需引用。 | ref 不带正文、权限或生命周期；不可从名称/错误差异推断更多事实。 |
| 低敏 correlation/ref 和错误类别 | 引用关系数据 | 仅用于客户端支持/诊断交接。 | 不得包含 raw body、credential、raw log 或正式 audit/evidence。 |
| 外部正文、credential/token/secret、raw log、provider/tool/runtime/bridge body | 明确不拥有的正文 / 真相 | Chat 明确排除在持有、缓存、诊断和 handoff 生命周期之外。 | 任何来源命中都进入遮蔽、拒绝或清理语义。 |

## 6. 一致性策略结论

### 6.1 一致性层次

- `安全强约束`：scope/visibility/actor 语境与展示/操作资格必须同向；无法验证即收紧，不能用缓存补足。
- `客户端局部一致`：route、selection、draft、focus、local intent/attempt 和 recovery context 在单个 Chat-local 语境内保持可解释；失败时显示不完整或清除，不伪造完整状态。
- `owner 结果门控一致`：confirmed/rejected/failed 只能根据正式 owner receipt/result/change 映射；按钮、ACK、toast、通知和 optimistic state 不足以晋级。
- `来源标记的最终一致`：safe view、summary、preview、change、cache 和页面展示允许暂时落后，但必须显式标注 freshness/partial/stale/unknown，并可经正式 SDK requery/resume 收敛。
- `尽力而为诊断一致`：低敏诊断可丢失或延迟，不影响业务、授权、缓存清理和恢复上限。

### 6.2 不一致时的状态约束

不一致不得被压缩成单一“成功/失败”。根据来源和影响分别使用 `restricted`、`redacted`、`stale`、`partial`、`unavailable`、`blocked`、`pending`、`unknown`、`reconnecting` 或 `needs-action`；在未有正式结果前不显示 confirmed，在无法验证 visibility 时不继续展示受保护内容。

## 7. 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| actor/scope/visibility 与页面可见/可操作姿态 | Chat-owned truth + owner safe result/ref | 安全强约束 | 无法验证时 restricted/blocked，遮蔽或清理相关投影。 | 保护不越权和不泄露存在性。 |
| route/context 与 selection/focus/draft | Chat-owned truth | 客户端局部一致 | 恢复冲突或缺失时保留最小安全状态，提示恢复受限，不把半状态当完整语境。 | 只约束 Chat-local 体验。 |
| draft/attempt 与发送或治理正式结果 | Chat-owned truth + owner result/change | 结果门控一致 | submitted/pending/unknown 继续保留；查询或用户决定前不盲重放。 | local intent 不等于 owner command。 |
| owner safe view 与页面展示 | owner truth + 快照/投影 | 来源标记的最终一致 | stale/partial/unavailable 时保留来源和降级姿态，不从其他 owner 摘要补齐。 | 快照不转移真相。 |
| formal change/resume 与展示缓存/恢复快照 | owner change + 快照/投影 | 来源标记的最终一致 | duplicate/乱序/gap/expired/revoked 时暂停或重查；不猜顺序、不把 cache 当 fresh。 | SDK consumer metadata 不等于 owner cursor。 |
| owner receipt/result/change 与 confirmed/rejected/failed | owner result + Chat-local posture | 结果门控一致 | 没有足够正式结果时保持 pending/unknown/read-only。 | ACK、toast、通知和 optimistic state 不可晋级。 |
| Artifact ref/preview 与预览卡片 | 引用关系 + owner safe preview | 来源标记的最终一致 | preview unavailable/visibility unknown 时只显示引用或原因，不显示正文。 | ref 不推出正文或权限。 |
| Workspace safe view/export 与 Chat 页面 | owner truth + 快照/引用 | 来源标记的最终一致 | stale/partial/blocked；Chat 不重建 attention/freshness/export。 | Chat-local read/hidden/pin 不反写 Workspace。 |
| Member/Identity/Work/Runtime safe summary 与卡片 | owner truth + 快照/投影 | 来源标记的最终一致 | opaque/unavailable/stale；不跨 owner 推断生命周期、完成或授权。 | 各 owner 来源和 freshness 分开保留。 |
| logout/revoke/scope change 与本地投影 | Chat-owned cleanup + owner visibility | 安全强约束 | 立即收紧/清理受影响 view/ref/cache；不得因离线或重启继续展示。 | 清理是本地安全事实，不是 owner mutation。 |
| 多端/重启恢复与 draft/selection/recovery | Chat-owned truth + 本地投影 | 设备范围局部一致；跨端仅在正式能力存在时最终一致 | 无正式同步能力时按设备保留，显示 unavailable/needs-action，不假设另一端已更新。 | Mobile/Web 不改变语义。 |
| 低敏诊断交接与客户端状态 | 引用关系 + 诊断局部事实 | 尽力而为 | sink 失败只保留本地安全提示，不影响业务结果或授权。 | 诊断不是 audit/evidence truth。 |

## 8. 逐架构单元数据所有权停审

### 8.1 架构单元 A：协作体验语境

| 项目 | 收敛结论 |
|---|---|
| Truth | route/context、当前 selection/focus、局部呈现姿态是 Chat-owned truth。 |
| Snapshot / projection | owner safe view/summary/preview/result/change 的最小展示投影、来源和 freshness metadata。 |
| Reference | Conversation/Turn、Gate/Decision、Artifact、Workspace、Member、Project、Runtime 的回链 ref。 |
| Forbidden body / write | owner 正文、policy、Artifact body、Runtime body、raw log 和任何 owner 反写。 |
| 一致性 | visibility/scope 强约束；owner view 到展示允许最终一致但必须标注 stale/partial/unknown。 |
| 停审 | `pass`：truth 唯一，投影只读，引用不带正文，强/最终一致边界清楚。 |

### 8.2 架构单元 B：受控协作意图

| 项目 | 收敛结论 |
|---|---|
| Truth | draft、local intent、attempt、用户选择和客户端结果姿态是 Chat-owned truth。 |
| Snapshot / projection | owner receipt/result/change 映射出的 submitted/pending/confirmed/rejected/failed/unknown 显示投影。 |
| Reference | request/attempt 关联、owner result ref、Gate/Decision/Conversation 目标 ref。 |
| Forbidden body / write | Conversation/Governance command truth、Decision/Turn 写入、credential、raw request/response body。 |
| 一致性 | local state 局部一致；confirmed 结果门控；unknown 不自动补偿或重放。 |
| 停审 | `pass`：本地尝试与 owner 结果分离，副作用未知可挂起，未形成命令第二真相。 |

### 8.3 架构单元 C：安全语境与导航

| 项目 | 收敛结论 |
|---|---|
| Truth | Chat-owned route/context、清理标记和本地导航状态。 |
| Snapshot / projection | owner actor/session/scope/visibility safe result 的受限本地展示。 |
| Reference | actor、scope、visibility、return/deep-link provenance 的安全引用。 |
| Forbidden body / write | credential/token/secret、权限表、Identity/Member lifecycle、Policy truth、owner authorization mutation。 |
| 一致性 | scope/visibility 与可见性强约束；无法验证时 fail-closed 和清理。 |
| 停审 | `pass`：导航不拥有权限，缓存不延长授权，安全撤销与展示收紧关系明确。 |

### 8.4 架构单元 D：变化与恢复连续性

| 项目 | 收敛结论 |
|---|---|
| Truth | Chat-owned recovery context、局部 gap/reconnect/unknown 姿态和 SDK consumer 恢复标记。 |
| Snapshot / projection | 带版本/水位/visibility/freshness 的展示快照和恢复投影。 |
| Reference | formal change/resume consumer ref、requery/ref、owner change identity 的安全引用。 |
| Forbidden body / write | bus offset/topic/replay truth、owner repair state、内部事件正文、直接 replay 或副作用写入。 |
| 一致性 | owner change 到本地投影最终一致；缺口/过期时暂停、重查或 unknown。 |
| 停审 | `pass`：恢复元数据不被写成 owner cursor，事件技术细节不进入 Chat truth。 |

### 8.5 架构单元 E：平台体验与可访问性

| 项目 | 收敛结论 |
|---|---|
| Truth | Chat-owned focus/accessibility、平台能力姿态、通知/窗口局部状态和本地清理结果。 |
| Snapshot / projection | 平台能力结果映射出的 needs-action/unavailable/accessible 状态。 |
| Reference | 系统返回、深链来源、通知关联和平台资源安全 ref。 |
| Forbidden body / write | 平台 credential、剪贴板敏感正文、平台权限替代 owner visibility、平台对 owner truth 的写入。 |
| 一致性 | 平台能力与可访问表达保持局部一致；业务状态仍以 owner result/change 为准。 |
| 停审 | `pass`：平台局部状态不升级为业务真相，跨端语义保持同一。 |

### 8.6 架构单元 F：owner-safe 材料镜像

| 项目 | 收敛结论 |
|---|---|
| Truth | 不拥有外部 owner truth；只拥有本地材料的来源/visibility/freshness/降级姿态。 |
| Snapshot / projection | safe view/summary/preview/result/change 的最小展示投影。 |
| Reference | owner object/ref、preview/ref、receipt/result/correlation ref。 |
| Forbidden body / write | 外部正文、raw DTO、版本/血缘真相、Policy、Evidence/Baseline body、owner reverse write。 |
| 一致性 | 来源标记最终一致；不可用或撤销时 stale/blocked/unavailable，不从别源补齐。 |
| 停审 | `pass`：本地材料明确不转移 ownership，forbidden body 与反写边界闭合。 |

### 8.7 架构单元 G：本地展示与恢复投影

| 项目 | 收敛结论 |
|---|---|
| Truth | draft、selection、recovery context、清理状态等 Chat-local 局部事实。 |
| Snapshot / projection | safe view 的受限缓存、页面重绘快照、版本/visibility/freshness metadata。 |
| Reference | 恢复目标、owner ref、resume/requery 关联和本地诊断 ref。 |
| Forbidden body / write | owner body、credential、共享 DB、Workspace/Conversation projection、离线业务成功和任何 owner 反写。 |
| 一致性 | 本地状态局部一致；跨设备/远端只在正式能力存在时最终一致；过期/撤销立即收紧。 |
| 停审 | `pass`：缓存和恢复不延长授权、不取代真相、不制造跨端隐式同步。 |

## 9. 简化数据边界示意图

```text
             +----------------------------------+
             | 正式 owner truth（仓外）         |
             +----------------+-----------------+
                              | SDK safe view/ref/result/change
                              v
             +----------------+-----------------+
             | Chat 本地快照 / 投影 / 引用       |
             +----------------+-----------------+
                              | 只读显化
                              v
             +----------------+-----------------+
             | Chat-owned 局部 truth             |
             | route / draft / selection /       |
             | intent / recovery / accessibility |
             +----------------------------------+

             forbidden body / secret / raw log
                              X
                         不进入 Chat
```

图示说明：

- owner truth 只能通过正式 SDK 的安全消费面进入本地快照/投影/引用；本地材料不能反写上游真相。
- Chat-owned 局部 truth 只影响客户端体验；它与外部正文、凭证、raw log 和 owner 生命周期保持隔离。
- 图不表达数据库、事务、缓存实现、事件时序或跨端同步机制。

## 10. 跨数据边界审计

| 审计项 | 结果 | 证据 / 处理 |
|---|---|---|
| 是否明确 Chat-owned truth | `pass` | route/context、selection/focus、draft、intent/attempt、recovery、可访问性和清理状态已列出。 |
| 是否明确外部 owner truth | `pass` | Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime、Observability 分别归 owner。 |
| 是否区分 snapshot/projection/reference | `pass` | safe material、展示缓存/恢复快照、owner refs 和诊断 refs 分别归类。 |
| 是否明确 forbidden body/forbidden write | `pass` | 正文、secret、raw log、provider/tool/runtime/bridge body、共享 DB 和 owner 反写均被排除。 |
| 是否先归属后定义一致性 | `pass` | 归属表在一致性表之前；一致性按安全强约束、局部一致、结果门控、最终一致和尽力诊断区分。 |
| 是否把缓存当真相 | `pass` | cache 受来源、visibility、版本/水位和 freshness 约束，过期/撤销时收紧。 |
| 是否把 projection 反写 truth | `pass` | 所有本地 projection 只读；写入必须回到正式 owner command。 |
| 是否误用强一致/最终一致 | `pass` | 强一致仅用于安全/局部语义和结果门控，跨 owner 传播明确为来源标记最终一致。 |
| 是否伪造事务/补偿实现 | `pass` | 只写 fail-closed、requery、挂起、清理和不盲重放的架构口径。 |
| 是否存在双真相或 unresolved 数据冲突 | `none` | 未发现 Chat 重新拥有 owner truth 的路径；未闭合合同保留 pending/blocked。 |

## 11. 当前 blocker 对数据与一致性的影响

| blocker | 影响 | 当前口径 |
|---|---|---|
| `CHAT-UP-001` | SDK safe view/command/result/change/ref exact surface 未闭合。 | 只定义数据类别和一致性层次，不定义 DTO/字段/存储。 |
| `CHAT-UP-002` | Conversation visibility/cursor/resume 影响变化和恢复投影。 | 缺口/过期/unknown/requery 保持显式；不主张 cursor truth。 |
| `CHAT-UP-003` | Governance receipt/idempotency/result 影响 confirmed 口径。 | confirmed 只由正式结果支持；其余 pending/unknown/read-only。 |
| `CHAT-UP-004` | Artifact preview/ref/visibility 影响引用和预览材料。 | body-free ref/summary/preview-unavailable；不保存正文。 |
| `CHAT-UP-005`、`WS-UP-001~008` | Workspace safe view/freshness/attention/export 影响局部页面投影。 | 不复制 projection/attention；stale/partial/blocked。 |
| `CHAT-UP-006` | Identity/Work/Member/Runtime 摘要层级影响跨域卡片。 | 按来源分域保存 safe summary/ref，不拼生命周期。 |
| `CHAT-UP-007`、`OPEN-CHAT-012` | 诊断 envelope/correlation/ref 影响引用数据范围。 | 低敏、可选、blocked/deferred；不持 raw log。 |
| `OPEN-CHAT-010~011` | 本地持久化上限和跨端恢复差异未闭合。 | 只保留最小安全材料和设备范围语义，不承诺跨端强一致。 |

## 12. 正式回填草稿

### 12.1 §9 数据所有权

`L5-chat` 拥有的正式真相只包括客户端局部事实：route/context、selection/focus、draft、local intent/attempt、客户端结果姿态、recovery context、可访问性/平台体验状态和本地清理状态。Conversation、Turn、Participant、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability 的正式真相分别归对应 owner；Chat 只保存经 SDK 提供的 safe view/summary/preview/result/change 的最小快照/投影，以及用于回链和预览的 ref。外部正文、credential/token/secret、raw log、provider/tool/runtime/bridge body、共享 projection 和任何 owner 反写均明确不进入 Chat。

### 12.2 §9 一致性策略

scope/visibility/actor 与显示或操作资格采用安全强约束；route、draft、selection、intent 和 recovery 在 Chat-local 范围保持局部一致；owner receipt/result/change 到 confirmed/rejected/failed 采用结果门控；owner safe material、变化、缓存、预览和跨端恢复允许来源标记的最终一致。出现缺口、撤销、过期、来源不明、结果未知或诊断失败时，Chat 进入 restricted、stale、partial、unavailable、blocked、pending、unknown 或 needs-action，并通过正式 SDK requery/resume 或用户决定收敛，不以缓存、ACK、连接或本地写入补齐业务真相。

## 13. Step 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否先明确谁拥有 truth | `pass` | Chat-local truth 与所有外部 owner truth 已分开。 |
| 是否区分 snapshot/projection/reference/forbidden body | `pass` | 数据归属表逐项分类，引用和正文边界明确。 |
| 是否按架构单元逐个停审 | `pass` | A～G 七个单元均完成 truth、snapshot、projection、reference、forbidden boundary 和一致性停审。 |
| 是否明确强一致与最终一致 | `pass` | 安全强约束、局部一致、结果门控、来源标记最终一致和尽力诊断已区分。 |
| 是否定义失败挂起和补偿原则 | `pass` | fail-closed、清理、stale/partial/unknown、requery/resume、用户决策和不盲重放已形成架构口径。 |
| 是否避免数据库/缓存/事务实现细节 | `pass` | 未写表、字段、key、DDL、outbox、worker 或重试次数。 |
| 是否审计双真相、反写、正文入仓和一致性冲突 | `pass` | 跨数据边界审计无 unresolved 冲突。 |
| 是否保留 blocker 与待确认项 | `pass` | SDK、owner、Workspace、Artifact、诊断、持久化和跨端矩阵仍为 pending/blocked/deferred。 |
| 是否完成正式 §9 回填草稿 | `pass` | 数据归属和一致性主文已形成。 |

## 14. Step 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| 架构单元级 | `pass` | 七个架构单元的 truth/snapshot/projection/reference/forbidden 边界均已停审，无双真相或反写冲突。 | 允许进入 Step 9；按架构单元收敛关键交互和通信。 |
| Step / 模块级 | `pass` | 数据归属表、一致性表、失败挂起、示意图和跨数据审计完成。 | 更新 flow 与项目台账后创建 Step 9。 |
| 文档级 | `in_progress` | 正式 `01-架构设计.md` 尚未完成 Step 9～16，旧正式文件仍保持 historical material。 | 继续 Step 9；不装配正式 `01`。 |
| 项目级 | `in_progress` | 本项目仍处于 `01` 架构校准，未进入 `02`。 | 保留 exact SDK/owner/platform blocker，按顺序进入 Step 9。 |


### 本轮 Step 8 模块 A 独立自检

- 问题：页面组合是否要求共同版本？
- 诊断：多源异步会混合新旧材料。
- 取舍：保留每 owner provenance/version/freshness。
- 结构化/回填：组合不是一致快照承诺；无关系确认不链接。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。


## 本轮逐章审查与修复（2026-10-01）

> 模式：regression-review / single-agent-serial。前轮记录作为差异材料；本节为当前章节修复基线。前序修复已通过，未闭合合同不升级为 ready。

### 执行计划与输入

- [x] 读取本 Step SOP、书写规范对应章、修复后 00、冻结原型和相关正式 owner 边界。
- [x] 顺序完成问题回答、旧材料诊断、取舍、结构化结果、复杂度判断和回填自检。
- [x] 只回填本 Step 对应现有正式章节并更新 flow/ledger；无实现、测试或 commit。

### 问题、诊断与取舍

A～G 数据单元已逐个复核。旧 §9 外部 truth 漏 Process，数据表无整体/阶段投影、绑定与三类目录；“结果强约束”不能被理解为跨 owner 数据库强一致。新增来源分别保持版本、水位、freshness，UI 合成不生成共同版本。

### 结构化与回填

§9 追加 Process truth、流程只读投影、正式关联 ref、目录 safe summary、项目标签/阶段/节点选择与返回位置；恢复只验证局部选择仍指向正式可见关联。无法验证授权清理，不只标 stale；仅 freshness 不足且保留展示获准时才显示 stale。不发明一致性事务。

复杂度：现有数据与策略表足够，无新图。自检：原始文本禁存与正式 safe preview 消费分离；Work、Process、Governance 互不推导；各模块强安全约束与最终一致材料不冲突。

### 门禁

- gate_status：pass（架构文档级；上游正向能力继续 blocked/pending）。
- gate_reason：流程/绑定/目录数据归属与跨来源一致性、恢复边界闭合到架构层。
- next_allowed_action：进入 Step 9，重新读取其 SOP 与前序输入。



### 本轮 Step 8 模块 G 独立自检

- 问题：缓存与目录有何清理边界？
- 诊断：可展示不等于可长期保存。
- 取舍：按 actor/scope/project/source 隔离并按撤销清理。
- 结构化/回填：只留获准材料和偏好；不留绑定或人员目录 truth。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 8 模块 F 独立自检

- 问题：BPMN graph 和节点关联是谁的数据？
- 诊断：缺源时容易从工作项或日志生成。
- 取舍：正式 Process safe projection 与各 owner typed safe ref。
- 结构化/回填：禁止原始正文/跨域 truth，缺 projection blocked。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 8 模块 E 独立自检

- 问题：跨端视图同步可否默认可用？
- 诊断：宿主保存不等于远端同步。
- 取舍：设备内 local state；正式同步合同后扩展。
- 结构化/回填：缩放焦点属 local，权限和业务结果不由 shell 改变。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 8 模块 D 独立自检

- 问题：cursor 能跨 owner 比较吗？
- 诊断：各源水位与版本不等价。
- 取舍：分别保留正式 SDK resume 语境。
- 结构化/回填：gap 失效来源范围，重查，不计算墙上时间顺序。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 8 模块 C 独立自检

- 问题：选择恢复可否恢复权限？
- 诊断：route/return ref 是旧 local state。
- 取舍：重新验证关系和可见性。
- 结构化/回填：导航 local truth；失效则回安全列表。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。



### 本轮 Step 8 模块 B 独立自检

- 问题：optimistic 属于谁？
- 诊断：乐观节点状态可能误推进流程。
- 取舍：仅本地意图展示，可 pending/failed/unknown。
- 结构化/回填：不改 Process/Gate truth；owner result 收口。
- gate_status：pass（本模块架构边界）；exact 合同未闭合部分保持 blocked/pending，允许进入下一个模块。
