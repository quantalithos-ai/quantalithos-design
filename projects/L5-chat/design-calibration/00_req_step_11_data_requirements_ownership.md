# Step 11 · 数据需求与数据归属

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §11「数据需求与数据归属」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 11  
> 直接输入：`00_req_step_02_position_boundary.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_10_rules_boundary_constraints.md`。  
> 本步只定义需求层的真相、快照、引用和禁止保存正文，不写字段、表结构、索引、缓存产品、事务、repo、service、port 或 DDL。

## 1. Step 状态与执行计划

- 状态：`[x] 已完成`
- 当前模块：`data-requirements-and-ownership-by-capability`
- 思考记录：`[x]`
- 结构化写入：`[x]`
- 自检：`[x]`
- gate_status：`pass`
- 回填位置：正式 `00-需求文档.md` §11「数据需求与数据归属」

### 1.1 Step 内计划

- [x] 按 N1～N4 判断 Chat-owned truth、owner snapshot、external ref 和禁止保存正文。
- [x] 区分本地体验状态与 owner 业务事实。
- [x] 为每类数据写需求层归属和生命周期口径。
- [x] 明确安全显示快照与 raw/authoritative body 的差异。
- [x] 将数据项回指功能、规则和能力节点。
- [x] 完成能力级数据停审、跨能力重复定义审计和门禁自检。

## 2. 本步输入与数据分类边界

| 输入 | 本步使用方式 | 不写入本步的内容 |
|---|---|---|
| Step 2 本仓边界 | 确认 Chat-owned local state 与 owner truth 分层。 | 字段、表、索引、缓存 TTL 和存储技术。 |
| Step 9 功能 | 确认每个功能需要哪些本地状态、safe view、ref 和结果语境。 | 具体 DTO、接口响应和事件 payload。 |
| Step 10 规则 | 确认哪些内容必须可回链、显式失效、禁止复制或不可离线授权。 | 用数据表重复规则正文。 |
| 上游 owner 文档 | 确认 Conversation、Governance、Artifact、Workspace、Member、Runtime、Observability 的 truth owner。 | 将 owner 的内部投影、正文或数据库结构搬入 Chat。 |

## 3. SOP 问题回答

### 3.1 哪些数据由 Chat 拥有真相？

Chat 拥有的真相仅限于客户端产品局部状态：当前 route/context、selection/focus、draft、客户端 intent/attempt 的本地状态、恢复语境、局部展示偏好，以及这些状态是否已清理或需要用户处理。它们回答“这个客户端当前如何呈现和等待用户下一步”，不回答“业务事实是否已经由 owner 提交”。

### 3.2 哪些数据只是快照？

owner 提供的安全显示 view、成员/项目/运行摘要、Gate/Decision 展示结果、Artifact preview 元数据、来源/版本/新鲜度/可见性标记、SDK capability/error 状态和低敏诊断状态都只是消费快照或派生展示材料。它们随 owner 变化而刷新或失效，不形成 Chat 的业务生命周期。

### 3.3 哪些数据只是引用？

Chat 只保存或传递指向外部 owner 对象的安全引用：Conversation/Turn/Participant ref、Actor/Member ref、Project/Work ref、Gate/Decision/Policy ref、Artifact/Evidence ref、Workspace view/ref、Runtime run/ref、Observability diagnostic/report ref，以及 command receipt/result ref。引用提供回链和语境，不转移正文或 authority。

### 3.4 哪些内容绝不能保存正文？

- Conversation/Turn 的 owner-authoritative raw body 或未脱敏敏感正文；
- Artifact、Evidence、Baseline 的正文、版本链、血缘和下载材料；
- Governance Policy/Decision/Approval 的完整裁决材料、授权秘密或内部规则正文；
- Identity credential、token、secret、完整身份凭证和未授权成员材料；
- Runtime 推理上下文、工具输入输出、sandbox 内容、内部 trace 和 provider secret；
- Workspace projection 内部组成、跨域来源正文、Inbox/attention owner 解释；
- Bridges 外部平台正文、账号凭证和平台私有 payload；
- Observability raw log、内部事件 bus payload、未脱敏诊断和安全敏感 correlation 内容。

安全显示 view 可以在得到正式授权时短暂用于渲染；是否允许持久化其有限摘要、是否需要脱敏和何时失效，仍须由 SDK/owner contract 及后续配置阶段确认，不能把“能显示”推导为“可以长期保存正文”。

## 4. 数据分类总表

### 4.1 Chat-owned 真相数据

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 当前 route/context 与 scope 选择 | 真相数据 | 当前客户端的路由和选择由 Chat 拥有正式真相。 | 从用户建立语境到切换、失效或清理，形成客户端局部生命周期。 |
| selection / focus / 展开状态 | 真相数据 | 当前页面选择、焦点和展开状态由 Chat 拥有正式真相。 | 随用户交互建立、变化或清除，不影响 owner truth。 |
| draft 与未提交编辑状态 | 真相数据 | 尚未交给 owner 的草稿和编辑状态由 Chat 拥有正式真相。 | 从开始编辑到提交、清理、过期或用户放弃，形成局部生命周期。 |
| client intent / attempt 状态 | 真相数据 | 用户意图是否已在客户端创建、等待、待探测或需要用户处理由 Chat 拥有局部真相。 | 从本地意图创建到正式结果映射、失败、取消或清理，不能延伸为 owner result。 |
| recovery context 与本地处理姿态 | 真相数据 | 当前客户端是否 reconnecting、needs-action、cache-only 或恢复中由 Chat 拥有局部真相。 | 从故障/退出发生到恢复、阻塞、清理或用户结束处理，形成局部生命周期。 |
| Chat display preference | 真相数据 | 与排序、布局、焦点和呈现相关的局部偏好由 Chat 拥有真相。 | 从用户设置到修改、清除或迁移，不能改变 owner visibility 或业务状态。 |

### 4.2 Owner safe view / display 快照

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| Conversation/Turn safe display view | 快照数据 | Conversation/Turn 正式真相不属于 Chat，但 Chat 可为稳定显示消费保留受授权的安全快照。 | 随 owner view、visibility、版本或新鲜度变化而更新/失效，不形成独立业务生命周期。 |
| Identity/Member safe summary | 快照数据 | GlobalMember、Actor 和 Member 正式真相不属于 Chat，但 Chat 可保留最小摘要。 | 随上游正式真相或可见性变化而更新/失效。 |
| Work/Project/Runtime safe summary | 快照数据 | Project、WorkItem、Iteration 和 Runtime outcome 正式真相不属于 Chat，但 Chat 可保留安全展示摘要。 | 随上游摘要和 visibility 变化而更新/失效。 |
| Governance Gate/Decision display result | 快照数据 | Gate、Decision、Policy 正式真相不属于 Chat，但 Chat 可保留当前可见结果的展示快照。 | 随正式治理结果、撤销或可见性变化而更新/失效。 |
| Artifact preview/summary | 快照数据 | Artifact/Evidence/Baseline 正式真相不属于 Chat，但 Chat 可保留获准的预览元数据或摘要。 | 随 preview、版本、visibility 或撤销而更新/失效，不形成制品生命周期。 |
| source/version/freshness/visibility marker | 快照数据 | 来源版本、新鲜度和可见性标记是 owner/SDK 语境的消费快照，不是 Chat authority。 | 随来源判断变化而更新或失效；不能独立延长内容有效期。 |
| SDK capability/error/connection status | 快照数据 | SDK/平台返回的 capability、错误和连接姿态不属于 Chat 业务真相。 | 随客户端会话、依赖可用性和恢复结果变化，不形成 owner 生命周期。 |

### 4.3 外部引用数据

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| Conversation/Turn/Participant ref | 引用数据 | Chat 只保存对 Conversation owner 对象的安全引用，不拥有其正文和生命周期。 | 随引用建立、变化、撤销或失效而变化，本仓不负责对话正文生命周期。 |
| Actor/GlobalMember/ProjectMember ref | 引用数据 | Chat 只保存对身份/成员对象的引用关系，不拥有成员真相。 | 随引用建立、scope 变化或可见性失效而变化。 |
| Project/WorkItem/Iteration ref | 引用数据 | Chat 只保存对 Work owner 对象的引用关系，不拥有项目/工作生命周期。 | 随引用建立、项目语境变化或失效而变化。 |
| Gate/Decision/Policy ref | 引用数据 | Chat 只保存对 Governance 语境和结果的回链，不拥有审批/决策正文。 | 随治理引用建立、更新、撤销或失效而变化。 |
| Artifact/Evidence/Baseline ref | 引用数据 | Chat 只保存对 Artifact owner 对象的引用，不拥有正文、版本链或血缘。 | 随引用建立、版本变化、可见性撤销或失效而变化。 |
| Workspace view/export ref | 引用数据 | Chat 只保存对 Workspace 安全 view/export 的引用，不拥有 projection 或 attention truth。 | 随 view/export 建立、版本变化或失效而变化。 |
| Runtime/Observability ref | 引用数据 | Chat 只保存运行/诊断/报告的安全回链，不拥有运行或观测正文。 | 随引用建立、结果更新、撤销或失效而变化。 |
| command receipt/result ref | 引用数据 | Chat 只保存 owner command receipt/result 的安全回链，不拥有 command truth。 | 随结果建立、更新、过期或失效而变化。 |

### 4.4 禁止保存正文

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| Artifact/Evidence/Baseline 正文与版本链 | 禁止保存正文 | Artifact 正文和版本/血缘不属于 Chat 真相范围，Chat 不得保存其正文。 | 不进入 Chat 生命周期。 |
| Governance Policy/Decision/Approval 完整裁决材料 | 禁止保存正文 | 治理规则、审批材料和完整决策正文不属于 Chat 真相范围，Chat 只消费 safe view/ref。 | 不进入 Chat 生命周期。 |
| Identity credential/token/secret | 禁止保存正文 | credential、token 和 secret 不属于 Chat 产品数据范围，Chat 不得保存。 | 不进入 Chat 生命周期。 |
| Runtime/Tools/provider/sandbox 内部正文 | 禁止保存正文 | Runtime 推理、工具 payload、provider secret 和 sandbox 内容不属于 Chat 真相范围。 | 不进入 Chat 生命周期。 |
| Workspace/Inbox/attention 内部投影正文 | 禁止保存正文 | Workspace projection、Inbox/attention owner 解释不属于 Chat 真相范围。 | 不进入 Chat 生命周期。 |
| Bridges 外部平台正文与凭证 | 禁止保存正文 | 外部平台正文、账号材料和私有 payload 不属于 Chat 真相范围。 | 不进入 Chat 生命周期。 |
| Observability raw log/event bus payload | 禁止保存正文 | raw log、内部事件 payload 和未脱敏诊断不属于 Chat 真相范围。 | 不进入 Chat 生命周期。 |

## 5. 按能力节点的数据停审

### N1 数据停审

N1 的 Chat-owned 数据是 route/context、scope selection、selection/focus、恢复位置和局部偏好；owner actor/scope/visibility 是输入快照或引用。没有将 Conversation、Project、Member 或授权结果归入 Chat 真相，也没有漏掉撤销/登出后清理所需的局部状态。

### N2 数据停审

N2 的主要输入是 owner safe display view、summary、preview、source/version/freshness/visibility marker 和外部 ref。Chat 可以保存最小安全快照，但不拥有 owner 正文、Policy、Decision、Artifact 版本/血缘、Workspace projection 或 Runtime outcome。

### N3 数据停审

N3 的 Chat-owned 数据是 draft、selection、local intent/attempt 和结果处理姿态；formal receipt/result 只保存安全引用或消费快照。没有将提交意图、ACK 或 local confirmed 标记成 Conversation/Governance truth。

### N4 数据停审

N4 的 Chat-owned 数据是 recovery context、reconnect/needs-action 状态、cache metadata 和安全展示快照；cursor/resume、owner changes、source version 和 visibility 作为外部输入/引用消费。缓存不延长授权，变化不转移 owner authority。

## 6. 数据与功能/规则映射

| 数据范围 | 支撑功能 | 主要规则 |
|---|---|---|
| route/context、selection、scope 状态 | `F-CHAT-001~003` | `BR-CHAT-001~006` |
| Conversation/Turn/成员/项目/运行安全快照 | `F-CHAT-004/005/008` | `BR-CHAT-007~010` |
| Gate/Decision 与 Artifact safe view/ref | `F-CHAT-006/007` | `BR-CHAT-011~013`、`BR-CHAT-019` |
| draft、intent/attempt、receipt/result ref | `F-CHAT-009~012` | `BR-CHAT-014~020` |
| change/cursor/resume、cache/recovery metadata | `F-CHAT-013~017` | `BR-CHAT-021~027` |
| platform shell state and diagnostics | `F-CHAT-017`、外围功能 | `BR-CHAT-028`、`BR-CHAT-E01~E04` |

## 7. 跨能力数据审计

| 检查项 | 结论 |
|---|---|
| 是否存在功能需要但没有归属的数据？ | 否；route、draft、safe view、ref、receipt、cursor/recovery 和 cache metadata 均有分类。 |
| 是否把同一项数据重复定义为 Chat truth 与 owner truth？ | 否；客户端局部状态、快照和引用与 owner 正文/生命周期分开。 |
| 是否明确禁止保存正文？ | 是；Artifact、Governance、credential、Runtime、Workspace、Bridges、Observability 等正文均列出。 |
| 是否把安全显示快照误写成长期正文？ | 否；显示快照允许范围和持久化边界保持 pending，raw/authoritative body 禁止保存。 |
| 是否写入字段/表/索引/缓存 TTL？ | 否；只写需求层分类和生命周期口径。 |
| 是否有无功能、规则或边界来源的数据项？ | 否；每个分类均能回指功能/规则/owner 边界。 |

## 8. 复杂度判断与设计取舍

| 复杂度来源 | 判断 | 控制方式 |
|---|---|---|
| 对话正文与安全显示 | 高 | 允许消费 safe view，禁止 Chat 拥有 authoritative raw body；持久化政策后移配置。 |
| 多 owner 引用和撤销 | 高 | 引用不转移 authority，visibility/revocation 优先使快照失效。 |
| draft/attempt 与正式结果 | 高 | Chat 只拥有 local intent/attempt，receipt/result 以引用或快照消费。 |
| Desktop offline/recovery | 中高 | 只保存带版本/可见性语境的展示材料和恢复 metadata，不离线授权。 |
| 数据分类规模 | 中 | 按真相/快照/引用/禁止正文四类收敛，不提前定义对象字段。 |

采用“本地体验真相最小化、owner safe view 快照化、外部对象引用化、敏感正文禁止化”的取舍，不采用 Chat 复制跨域正文或构建第二业务数据仓。

## 9. 正式文档回填草稿

正式 `00-需求文档.md` §11 可回填为：

> L5-chat 拥有的真相数据仅限客户端局部状态：route/context、scope/selection/focus、draft、client intent/attempt、recovery context 和展示偏好。Conversation、Turn、Member、Project、Gate、Decision、Artifact、Workspace、Runtime 和 Observability 的正式真相不属于 Chat。
>
> Chat 可以消费并按安全政策保留 owner safe display view、摘要、预览元数据、来源/版本/新鲜度/可见性标记作为快照，也可以保存 Conversation、Member、Project、Governance、Artifact、Workspace、Runtime、Observability 和 command receipt 的安全引用。快照随上游变化、撤销或失效而更新，不形成独立真相生命周期。
>
> Artifact/Evidence/Baseline 正文、治理裁决材料、credential/token/secret、Runtime/Tools/provider/sandbox 正文、Workspace/Inbox/attention 内部投影、Bridges 外部平台正文和 Observability raw log/event payload 均不得进入 Chat 数据生命周期。安全显示 view 是否允许有限持久化，必须由 SDK/owner contract 和后续配置明确，不能由“可展示”推导为“可长期保存正文”。

## 10. Step 11 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否区分真相、快照、引用和禁止保存正文？ | 是 | 四类数据均有独立表。 |
| Chat-owned truth 是否只限客户端局部状态？ | 是 | 未吸收任何 owner 业务生命周期。 |
| 是否明确 raw/authoritative body 禁止保存？ | 是 | Artifact、Governance、credential、Runtime、Workspace、Bridges、Observability 均列明。 |
| 每项数据是否有生命周期口径？ | 是 | 采用需求层生命周期短句，不涉及存储实现。 |
| 是否回指功能和规则？ | 是 | 已形成数据与功能/规则映射。 |
| 是否写入字段、表、索引、TTL 或事务？ | 否 | 没有滑入详细设计。 |
| 是否完成能力级和跨能力数据停审？ | 是 | N1～N4 停审及跨能力审计通过。 |

### 10.1 进入 Step 12 条件

- Chat-owned truth、owner safe snapshot、external ref 和禁止正文边界已明确；
- 每项数据均能回指能力、功能或规则，生命周期口径没有转成实现存储；
- 跨 owner 的同一对象没有被 Chat 重定义为第二真相；
- 允许创建并完成 `00_req_step_12_interfaces_dependencies.md`，按能力节点收敛 SDK/owner 输入和 Chat 对外体验 seam。

## 11. 本步结论

Step 11 将 Chat 的数据边界收敛为：最小化拥有客户端局部状态，消费带来源/可见性/新鲜度的安全快照，保存外部对象和结果的安全引用，禁止跨域正文和敏感原始材料进入 Chat 数据生命周期。下一步可以讨论这些能力以哪些级别的 query、command、event、ref 和平台 adapter seam 对外体现，但仍不写具体协议或方法实现。
## 12. 原型修复回写

项目流程图、阶段节点、并行分支、GateCard、关联群聊和成员目录均作为 owner safe snapshot 或 external ref 展示；Chat-owned 数据仅保存当前选择、展开/折叠、草稿、乐观态和恢复游标等局部状态。项目、群聊、成员、Gate、Artifact 正文和运行内部 payload 不在 Chat 中形成第二真相。

- 自检：原型增加的是展示投影和引用，不扩大 Chat 数据归属。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

流程节点/边、项目与群聊 ref、公司/项目/群聊成员摘要和节点关联证据均为外部 owner safe projection 或引用；Chat 只保存必要展示缓存、选择和导航状态。


| 数据类别 | Chat 可持有的内容 | 生命周期与上限 |
|---|---|---|
| Chat-owned local truth | route/context、scope selection、selection/focus/展开、未提交 draft、local intent/attempt、recovery context、展示偏好。 | 仅随客户端交互、提交、清理、切换、过期或用户放弃变化；不代表 owner 结果。 |
| Owner safe display snapshot | Conversation/Turn、Identity/Member、Work/Project/Runtime、Governance、Artifact、Workspace 的获准 safe view/summary/preview metadata，以及 source/version/freshness/visibility、SDK capability/error 状态。 | 随 owner 变化、版本、visibility、过期或撤销更新/失效；是否允许有限持久化依正式合同和后续配置。 |
| External ref | Conversation/Turn/Participant、Actor/Member、Project/Work、Gate/Decision/Policy、Artifact/Evidence/Baseline、Workspace view/export、Runtime/Observability、command receipt/result 的安全引用。 | 引用只提供回链，不转移正文、authority 或所指对象生命周期。 |
| 禁止保存正文 | Conversation/Turn authoritative raw body；Artifact/Evidence/Baseline 正文和血缘；Governance 裁决材料；credential/token/secret；Runtime/Tools/provider/sandbox 正文；Workspace projection；Bridges 外部正文；Observability raw log/internal event payload。 | 不进入 Chat 的数据、缓存、错误、诊断、导出或 handoff 生命周期。 |

Chat 可以为渲染短暂消费正式允许的安全展示 view；“可展示”不自动意味着“可长期保存”。本地草稿、缓存、cursor metadata、receipt ref 与 owner 事实分开；缓存不得延长授权或把旧快照变成当前 truth。跨 owner 联合展示必须保留各自来源、新鲜度、可见性和覆盖范围，不生成独立聚合真相。
