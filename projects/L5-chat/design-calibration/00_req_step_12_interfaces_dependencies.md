# Step 12 · 接口与依赖

> 状态：`校准完成，门禁通过`  
> 对应正式文档：`00-需求文档.md` §12「接口与依赖」  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 12  
> 直接输入：`00_req_step_06_consumers_dependencies.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_11_data_requirements_ownership.md`。  
> 本步只写能力级接口面和外部依赖边界，不写 API 路径、HTTP/RPC 方法、DTO、JSON/proto、事件 schema、handler/service/repository、重试实现或调用链。

## 1. Step 状态与执行计划

- 状态：`[x] 已完成`
- 当前模块：`interfaces-and-dependencies-by-capability`
- 思考记录：`[x]`
- 结构化写入：`[x]`
- 自检：`[x]`
- gate_status：`pass`
- 回填位置：正式 `00-需求文档.md` §12「接口与依赖」

### 1.1 Step 内计划

- [x] 按 N1～N4 判断 Chat 对外体现的 query/change/event/background 能力面。
- [x] 区分同步读取、异步命令、正式变化输入、低敏输出和本地恢复边界。
- [x] 承接 Step 6 的 compile/runtime/event/ref/adapter/fake 裁剪，不重抄全局依赖矩阵。
- [x] 使用正式依赖类型：定义来源依赖、治理结论依赖、下游消费依赖、外部能力依赖。
- [x] 为每个接口/依赖回指能力节点和功能需求。
- [x] 完成能力级接口停审、跨能力依赖审计和 Step 12 门禁自检。

## 2. 本步输入与接口粒度边界

| 输入 | 本步使用方式 | 不直接写入的内容 |
|---|---|---|
| Step 6 依赖裁剪 | 固定 `L0-sdk` 是唯一应用接入边界，owner 是能力来源。 | 原样复制全仓依赖矩阵、package path、内部 topic。 |
| Step 9 功能 | 为每组功能定义能力级输入/输出 seam。 | 方法名、API 路径、DTO schema 和字段。 |
| Step 11 数据 | 确认接口只传递 safe view/ref/metadata，不把禁止正文带入 Chat。 | 数据字段表、协议 envelope、存储实现。 |
| Step 10 规则 | 保留 visibility、idempotency、unknown、cursor 和 no-direct-bus 红线。 | 将规则改写成异常码或实现校验。 |

## 3. SOP 问题回答

### 3.1 Chat 对外体现哪些能力级接口？

Chat 是客户端产品，因此对外接口主要表现为用户可见的页面/交互入口和平台 shell seam，而不是另一个业务服务 API。需求层可定义以下能力面：

- **查询接口**：向页面和平台 shell 提供当前安全协作语境、safe view、来源/新鲜度/可见性和降级状态；输入经 SDK query adapter 获得；
- **变更接口**：承接用户的草稿提交、普通协作意图和受控治理意图，并将其经 SDK 交给正式 owner；Chat 只返回客户端提交/等待/结果状态；
- **事件输入**：消费 SDK 暴露的 owner change、cursor/resume、gap、visibility revoke 和结果变化；
- **事件输出**：按需向正式低敏诊断/handoff seam 提供客户端交互、错误和恢复意图，不能输出业务 truth；
- **后台任务接口**：执行本地恢复、缓存清理、过期裁剪和用户可见的重新查询提示，不执行 owner truth 维护。

### 3.2 Chat 消费哪些能力级输入？

Chat 消费五类外部输入：

1. `L0-sdk` 提供的 actor/session、typed query、typed command、formal event、error、trace、retry、redaction 和 resume surface；
2. Conversation/Identity/Work/Governance/Artifact/Workspace/Member/Runtime 的安全 query/ref/summary/preview；
3. Governance/Identity/Conversation/Artifact 的 visibility、授权语境和撤销结果；
4. owner command 的 receipt/result/unknown 语境；
5. Desktop/Web/Mobile shell 提供的窗口、输入、通知、存储、网络、深链和辅助技术能力。

这些输入均不转移 truth ownership；未闭合的 surface 保持 `pending / blocked / unavailable`。

### 3.3 哪些是同步、异步和本地边界？

| 边界 | 能力级语义 | 结果姿态 |
|---|---|---|
| 同步查询 | 读取 actor/scope、safe view、summary、ref、preview 和当前状态 | fresh/stale/partial/unavailable/blocked；不隐式写入业务或推进 cursor。 |
| 本地交互 | route、selection、draft、focus、local preference 和页面状态 | 立即更新 Chat-local 状态，不表示 owner 变化。 |
| 异步变更 | 发送、重试、Gate/治理意图和可能产生副作用的用户动作 | submitted/pending/confirmed/rejected/failed/unknown；结果以 owner 为准。 |
| 异步事件输入 | owner change、cursor/resume、visibility revoke、gap、result change | reducer/reconnect/requery；不得直订内部 bus。 |
| 本地后台 | cache 清理、draft restore、过期裁剪、Desktop restart recovery | local success/failure；不产生 owner truth。 |
| 低敏输出 | client error、recovery intent、support handoff | 只输出允许的低敏材料，不输出 raw body/secret/业务 verdict。 |

## 4. 对外能力接口表

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 查询接口 | 安全协作语境读取 | 向页面提供当前 actor/scope/入口可见性、selection 和语境降级状态。 | 核心闭环 N1 |
| 查询接口 | 正式协作事实展示 | 向页面提供 Conversation/Turn、成员/项目/运行、Gate/Decision 和 Artifact safe view/ref。 | 核心闭环 N2 |
| 查询接口 | 来源与状态解释 | 提供来源、版本/新鲜度、visibility、partial/stale/unavailable/blocked 的可见表达。 | 核心闭环 N2 |
| 变更接口 | 普通协作意图入口 | 接收用户发送/重试意图，经 SDK 交给 Conversation owner，并展示提交/结果状态。 | 核心闭环 N3 |
| 变更接口 | 受控治理意图入口 | 接收被授权用户的 Gate/Decision 操作意图，经 SDK 交给 Governance owner。 | 核心闭环 N3 |
| 查询接口 | 命令结果与未知状态读取 | 向页面提供 receipt/result/unknown 的安全状态和下一步提示。 | 核心闭环 N3 |
| 事件输入 | 正式协作变化消费 | 接收 SDK 提供的 owner change、结果变化、cursor/resume、gap 和撤销语义。 | 核心闭环 N4 |
| 查询接口 | 恢复与安全缓存读取 | 提供带版本/可见性语境的缓存、draft、recovery 和 needs-action 状态。 | 核心闭环 N4 |
| 后台任务接口 | 本地恢复与过期清理 | 处理 Desktop 重启、断线恢复、cache 清理、draft restore 和重新查询提示。 | 核心闭环 N4 |
| 事件输出 | 低敏客户端诊断/handoff | 在正式允许时输出客户端错误、恢复和用户支持关联，不输出业务 truth。 | 核心横向能力 |
| 查询接口 | 搜索/过滤入口 | 提供已授权范围内的定位和过滤体验。 | 外围增强 |
| 事件输出 | Desktop 通知/托盘提示 | 向平台壳提供用户可见提示，不代表业务提交。 | 外围增强 |
| 变更接口 | 富文本/附件意图 | 承接编辑和安全 ref 组织，不拥有 Artifact 正文。 | 外围增强 |

接口名称是能力主题，不是最终 API 名称；具体协议和平台绑定后移正式架构/概要/详细设计。

## 5. 外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 外部能力依赖 | `L0-sdk` | 编译期 + 运行期 + 事件协作依赖 | 唯一正式应用接入边界，提供 typed query/command/event、actor、错误、trace、retry、redaction 和 resume 能力。 | 核心闭环 N1～N4 |
| 输入 | 定义来源依赖 | `L0-core`（经 SDK） | 编译期依赖候选 | 只消费 SDK 正式导出的 stable ref/error/metadata；不得在 Chat shadow schema。 | 核心闭环 N1/N2 |
| 输入 | 外部能力依赖 | `L1-conversation` | 运行期 + 事件协作依赖 | 提供 Conversation/Turn/Participant safe view、visibility、变化和普通协作结果。 | 核心闭环 N1～N4 |
| 输入 | 外部能力依赖 | `L1-identity` | 运行期 + 事件协作依赖 | 提供 actor/GlobalMember safe summary、身份语境和撤销变化。 | 核心闭环 N1/N2 |
| 输入 | 外部能力依赖 | `L1-work` | 运行期 + 事件协作依赖 | 提供 Project/ProjectMember/WorkItem/Iteration safe summary/ref。 | 核心闭环 N2 |
| 输入 | 治理结论依赖 | `L1-governance` | 运行期 + 事件协作依赖 | 提供 Gate/Decision/Policy visibility、授权语境、receipt/result 和状态变化。 | 核心闭环 N2/N3/N4 |
| 输入 | 外部能力依赖 | `L1-artifact` | 运行期 + 事件协作依赖 | 提供 Artifact/Evidence safe ref、summary、preview、版本/visibility 语境。 | 核心闭环 N2 |
| 输入 | 外部能力依赖 | `L1-workspace` | 运行期 + 事件协作依赖 | 仅消费已闭合的 workspace safe view/export、attention 和 freshness；不自行聚合。 | 核心闭环 N1/N2/N4 |
| 输入 | 外部能力依赖 | `L2-member` | 运行期 + 事件协作依赖 | 提供成员容器内安全 presence/interaction summary；不替代 Identity。 | 核心闭环 N2 |
| 输入 | 外部能力依赖 | `L2-runtime` | 运行期 + 事件协作依赖 | 提供 run/decision/checkpoint/outcome safe summary；不执行 Runtime。 | 核心闭环 N2 |
| 输入 | 外部能力依赖 | `L4-observability` | 运行期 + 事件协作依赖 | 提供低敏诊断/report handoff 能力；不开放 backend/raw observation。 | 核心横向能力/外围增强 |
| 输入 | 外部能力依赖 | Desktop/Web/Mobile shell | 运行期适配依赖 | 提供窗口、通知、输入、存储、网络、深链和辅助技术能力；不改变业务语义。 | 核心横向能力 |
| 输出 | 下游消费依赖 | 正式低敏诊断/handoff consumer | 运行期 + 事件协作依赖 | 在 SDK/Observability formal surface 允许时消费客户端诊断和恢复意图。 | 核心横向能力/外围增强 |
| 输入 | 外部能力依赖 | `L6-bridges` | 不接入 | 不作为 Chat 正式输入；Chat 只消费 owner/SDK 已收敛的内部事实。 | 边界外 |

该表承接 Step 6 的依赖裁剪，只描述能力级输入/输出，不重新绘制全局仓际矩阵。

## 6. 按能力节点的接口与依赖

### N1：安全协作语境进入与保持

| 接口/依赖面 | 类型 | 功能承接 | 当前边界 |
|---|---|---|---|
| 安全协作语境读取 | 查询接口 | `F-CHAT-001~003` | 输入来自 SDK actor/scope/visibility；不创建 scope 或授权。 |
| Identity/Conversation/Work safe ref | 外部能力依赖 | `F-CHAT-001/002` | 只消费 ref/summary；exact surface 受 `CHAT-UP-001/002/006` 约束。 |
| Desktop/Web shell route/deep-link | 外部能力依赖 | `F-CHAT-001/003` | shell 只承载导航；不把 URL/窗口状态当业务真相。 |

### N2：正式协作事实安全显化

| 接口/依赖面 | 类型 | 功能承接 | 当前边界 |
|---|---|---|---|
| 正式协作事实展示 | 查询接口 | `F-CHAT-004~008` | 只接收 safe view/summary/ref/preview，不保存禁止正文。 |
| Governance visibility/result | 治理结论依赖 | `F-CHAT-006` | GateCard 只显示和提供受控下一步，不本地批准。 |
| Artifact preview/ref | 外部能力依赖 | `F-CHAT-007` | body-free/visibility/provenance contract 未闭合则 unavailable。 |
| Work/Member/Runtime/Workspace summary | 外部能力依赖 | `F-CHAT-005/008` | 不跨 owner 推断项目、成员或运行完成。 |

### N3：用户意图受控发起与结果反馈

| 接口/依赖面 | 类型 | 功能承接 | 当前边界 |
|---|---|---|---|
| 普通协作意图入口 | 变更接口 | `F-CHAT-010` | 只经 SDK 交给 Conversation owner；结果不由 Chat 确认。 |
| 受控治理意图入口 | 变更接口 | `F-CHAT-011` | 依赖 Governance authorization/receipt/idempotency；`CHAT-UP-003` 未闭口。 |
| 命令结果与未知状态读取 | 查询接口 | `F-CHAT-012` | 支持 confirmed/rejected/failed/unknown；不以 transport ACK 收口。 |
| SDK command/receipt surface | 外部能力依赖 | `F-CHAT-010~012` | exact command/result surface 受 `CHAT-UP-001/003` 约束。 |

### N4：变化、失败、离线与恢复连续性

| 接口/依赖面 | 类型 | 功能承接 | 当前边界 |
|---|---|---|---|
| 正式协作变化消费 | 事件输入 | `F-CHAT-013/014` | 只能消费 SDK formal event/resume；不直订内部 bus。 |
| 恢复与安全缓存读取 | 查询接口/后台任务 | `F-CHAT-015/016` | 只恢复展示/draft；不离线授权或确认业务成功。 |
| Workspace/Conversation cursor/resume | 外部能力依赖 | `F-CHAT-013~016` | `CHAT-UP-002/005` 未闭合时保持 blocked/stale。 |
| 低敏诊断/handoff | 事件输出 | `F-CHAT-017` | `CHAT-UP-007` 未闭合时只保留本地低敏意图。 |

## 7. 接口与依赖停审

### N1 停审

- 查询接口和 Identity/Conversation/Work/shell 输入均能回指 `F-CHAT-001~003`；
- 未写 route library、API path、scope schema 或认证实现；
- N1 不把客户端 route/selection 变成 owner truth。

### N2 停审

- safe view/summary/ref/preview、Governance 和 Artifact 依赖均能回指 `F-CHAT-004~008`；
- 未写 DTO、preview protocol、Policy schema 或 raw body；
- N2 不新增 Chat-side aggregation service。

### N3 停审

- 普通/治理意图、结果读取和 SDK command/receipt 依赖均能回指 `F-CHAT-009~012`；
- 未写 command method、idempotency field 或 HTTP/RPC；
- N3 保持 owner committed result 外置。

### N4 停审

- formal event input、cursor/resume、local recovery、cache 和低敏 handoff 均能回指 `F-CHAT-013~017`；
- 未写 event schema、topic、offset、worker 或 storage implementation；
- N4 保持 no-direct-bus 和 cache-not-authority。

## 8. 跨能力接口审计

| 检查项 | 结论 |
|---|---|
| 是否存在没有功能来源的接口？ | 否；所有接口主题均映射 `F-CHAT-*`。 |
| 是否存在功能需要外部协作但没有依赖承接？ | 否；SDK、各 owner、shell 和低敏 handoff 均列明。 |
| 是否重复定义同一 owner 为多个冲突接口？ | 未发现冲突；query/command/event/ref 按能力分层。 |
| 是否把运行期/事件依赖误写成 compile dependency？ | 否；仅 `L0-sdk` 和条件型 `L0-core` 为 compile 相关，owner 均为 runtime/event/ref。 |
| 是否重抄 Step 6 全局依赖矩阵？ | 否；只保留 Chat 能力级输入/输出 seam。 |
| 是否泄漏 API、DTO、事件 schema 或实现 port？ | 否；名称均为能力主题。 |
| 是否保留 SDK/owner blocker？ | 是；`CHAT-UP-001~007` 未被接口表伪装为已闭合。 |

## 9. 复杂度判断与设计取舍

| 复杂度来源 | 判断 | 控制方式 |
|---|---|---|
| SDK surface 未完全统一 | 高 | 只定义能力级 seam，具体 surface 后移，缺失时 blocked。 |
| Query/command/event/ref 混合 | 高 | 按接口类型和同步/异步边界分开，不能用一个通用 client 语义覆盖。 |
| 多 owner 依赖 | 高 | Step 6 裁剪表作为来源，按 owner/能力分层，不建设 Chat BFF。 |
| Desktop shell 与产品 core | 中 | Tauri 只作为 platform adapter 候选，V1 不改变业务接口语义。 |
| 外围通知/搜索/附件 | 中 | 作为外围接口，不阻塞核心接口停审。 |

采用“Chat 对外提供产品体验接口，Chat 对内唯一经 SDK 消费 owner 能力”的取舍，不采用页面直连服务、直订内部 bus 或在 Chat 建立第二套协议。

## 10. 正式文档回填草稿

正式 `00-需求文档.md` §12 可回填为：

> L5-chat 的接口边界以客户端产品能力表示：查询接口提供安全协作语境、正式协作事实和来源/状态解释；变更接口承接普通协作意图和受控治理意图；事件输入消费 SDK 暴露的 owner change、cursor/resume、gap 和撤销；后台任务处理本地恢复、缓存清理和草稿恢复；在正式允许时，事件输出只提供低敏客户端诊断/handoff。Chat 不对外提供 Conversation、Governance、Artifact、Workspace、Member、Runtime 或 Observability 的业务真相接口。
>
> Chat 的唯一正式应用接入边界是 `L0-sdk`。Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability 以运行期/事件/ref/治理结论依赖被消费；`L0-core` 只在 SDK 正式 re-export 稳定 shared types 时作为条件型编译依赖。Chat 不直接调用 owner 私有 API、不直订内部 bus、不共享数据库、不吸收 Bridges 外部映射。

## 11. Step 12 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确对外能力接口类型？ | 是 | 查询、变更、事件输入、事件输出和后台任务均有能力主题。 |
| 是否明确外部依赖类型和全局依赖类型？ | 是 | 使用正式依赖枚举和 Step 6 compile/runtime/event/ref 裁剪。 |
| 是否按能力节点组织接口与依赖？ | 是 | N1～N4 均有接口/依赖表和停审。 |
| 是否回指功能需求？ | 是 | 所有接口/依赖面均映射 `F-CHAT-*`。 |
| 是否写入 API/DTO/event schema/实现 port？ | 否 | 均保持能力级粒度。 |
| 是否保留 SDK/owner blockers？ | 是 | `CHAT-UP-001~007` 继续 pending/blocked/deferred。 |
| 是否完成跨能力重复和类型冲突审计？ | 是 | 已形成接口审计表。 |

### 11.1 进入 Step 13 条件

- 对外能力接口和外部依赖边界已按 N1～N4 收敛；
- 接口/依赖均有功能来源和能力映射；
- 没有协议、字段、DTO、topic、API path 或实现 port 泄漏；
- 允许创建并完成 `00_req_step_13_non_functional_requirements.md`，将安全、可用性、可访问性、恢复和 Desktop-first 质量约束收口。

## 12. 本步结论

Step 12 将 Chat 的接入边界收敛为：页面和平台 shell 使用 Chat 的产品体验接口，Chat 通过 `L0-sdk` 消费 owner 的 query/command/event/ref/治理结论能力。同步读取、本地交互、异步意图、正式变化和本地恢复被清晰分层；所有精确协议继续由 SDK/owner 后续合同决定。下一步只讨论这些能力必须达到的非功能质量，而不新增业务范围。
## 13. 原型修复回写

原型所需接口主题补充为项目/流程 safe query、阶段节点下钻、群聊关联读取、公司成员目录读取、Gate 受控入口和状态变化恢复；具体 surface 仍必须由 `L0-sdk` 提供。项目绑定、审批提交、流程推进和成员裁决若无正式 capability，保持 `blocked/read-only/waiting`。

- 影响功能：`F-CHAT-018~021`。
- 自检：未写 API path、DTO、event schema 或直接 owner 调用。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

本轮新增能力级依赖包括项目/群聊绑定查询、项目流程与阶段子流程查询、节点跨域关联查询和公司成员目录查询；最终 API、DTO 和事件 schema 由 L0-sdk 与 owner 合同决定。


Chat 对外体现的是客户端产品能力接口，不是业务服务 API：

| 接口类型 | 能力主题 | 所属能力 |
|---|---|---|
| 查询接口 | 安全协作语境、正式协作事实、来源/状态解释、命令结果/unknown、恢复与安全缓存读取。 | N1～N4 |
| 变更接口 | 普通协作意图与受控治理意图入口；只形成 Chat-local 提交/等待/结果姿态。 | N3 |
| 事件输入 | SDK 暴露的 owner change/result change、cursor/resume、gap、visibility revoke。 | N4 |
| 事件输出 | 在正式允许时提供低敏客户端诊断/handoff；不输出业务 truth。 | N4/全仓 |
| 本地后台任务接口 | draft restore、cache 清理、过期裁剪、Desktop 重启恢复和安全 requery 提示。 | N4 |
| 外围接口 | 授权范围内搜索/过滤、Desktop 通知/托盘、富文本/附件安全 ref 组织。 | 外围增强 |

同步查询只读 safe view/ref/summary/preview；本地 route、selection、draft、focus 立即更新但不表示 owner 改变；异步发送/治理命令只有 owner receipt/result 才能形成业务状态；formal event 只经 SDK 消费；本地恢复不维护 owner truth。所有 exact API、DTO、事件 schema、方法名、重试算法和平台绑定留待后续设计与正式 SDK/owner 合同。

| 依赖边界 | 能力级用途 | 当前状态 |
|---|---|---|
| `L0-sdk` | 唯一业务 query/command/event/ref 接入、actor/session、错误、trace、redaction、retry、resume。 | 必需；typed public surface 受 `CHAT-UP-001` 约束。 |
| Conversation、Identity、Work | 对话、成员身份、项目/工作安全读取、visibility、变化和普通协作结果。 | 经 SDK 消费；Conversation cursor/分页等受 `CHAT-UP-002/006` 约束。 |
| Governance、Artifact | Gate/Decision 安全语境、receipt/result、Artifact ref/summary/preview。 | 经 SDK 消费；受 `CHAT-UP-003/004` 约束。 |
| Workspace、Member、Runtime | safe view/export、成员交互摘要、运行摘要和变化。 | 经 SDK 消费；受 `CHAT-UP-005/006`、`WS-UP-001~008` 约束。 |
| Observability | 低敏诊断/report handoff。 | 正式 surface 未闭合时 deferred；受 `CHAT-UP-007` 约束。 |
| Desktop/Web/Mobile shell | 窗口、输入、通知、存储、网络、深链和辅助技术适配。 | 非业务能力；不改变 owner 结果。 |
| `L6-bridges` | 外部平台映射边界参考。 | 不接入 Chat 正式输入。 |
