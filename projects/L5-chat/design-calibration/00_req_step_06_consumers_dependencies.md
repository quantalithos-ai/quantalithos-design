## Step 6. 使用方与依赖

### 1. Step 状态

- 状态：`[x] 已确认`
- 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 6
- 回填章节：正式 `00-需求文档.md` §6「使用方与依赖」
- 当前模块：`consumers-and-dependency-crop`

#### 1.1 Step 内计划

- [x] 读取 Step 1~5、全局依赖裁剪规则和 L0-sdk / owner 正式文档。
- [x] 逐项回答 Chat 为谁提供能力、依赖谁、前置是否成立和失效影响。
- [x] 诊断旧文档把服务名 / 包名 / transport 直接写成依赖的风险。
- [x] 取舍唯一接入边界为 SDK，owner 只作为运行期 / 事件 / safe view 来源。
- [x] 形成依赖裁剪表、禁止依赖表、失效姿态表和 SDK gap 表。
- [x] 判断不拆完整 27 仓矩阵，只保留 Chat 相关子图。
- [x] 形成正式 §6 回填草稿并完成自检。

### 2. 本步输入

- `00_req_step_01_upstream_relation.md`
- `00_req_step_02_position_boundary.md`
- `00_req_step_04_goals_non_goals.md`
- `00_req_step_05_users_roles.md`
- `standards/document/全局项目依赖关系与裁剪规则.md` §4、§4.1
- `projects/L0-sdk/00-需求文档.md` ~ `07-实施计划.md`
- 指定 owner 当前正式 `00~07` 的依赖、接口和边界章节

### 3. SOP 问题回答

#### 3.1 Chat 向哪些使用方提供能力？

| 使用方 | Chat 提供的能力 | Chat 不提供 |
|---|---|---|
| Web shell | 页面、路由、渲染、键盘 / 屏幕阅读、浏览器缓存和通知接缝 | 通用 SDK 或服务端真相 |
| Desktop shell | 共享协作体验、窗口 / 通知 / 深链集成语义 | 宿主编排、业务存储、内部 bus |
| Mobile shell | 受限屏幕下的阅读、通知、审批和恢复体验 | 通过移动端绕过 owner 授权或实现离线业务成功 |
| 最终用户 | 可理解的对话、项目、成员、产物、治理和运行安全摘要 | 源仓正文、内部日志、未授权对象 |
| 产品 / 设计 / 支持角色 | 统一的 view model、状态语义、可访问性和诊断入口 | 领域规则或 SDK 通用实现 |

#### 3.2 Chat 依赖哪些仓 / 系统？

| 关联方 | 全局关系 | Chat 用途 | 闭环前置 | 失效影响 |
|---|---|---|---|---|
| `L0-sdk` | 编译期 / 接入层 | typed query、command、event、auth、transport、错误、trace、重试、redaction | 是 | 无法安全接入 owner；Chat 只能保留设计状态 |
| `L0-core` | 全局共享契约候选 | 仅消费 SDK 导出的稳定 typed ref / error / metadata；是否直接编译依赖以后续 package contract 为准 | SDK surface 的共享类型需要时 | 不得复制 Core schema；未确认则只经 SDK 类型 |
| `L1-conversation` | runtime / event / ref | Conversation / Turn / participant / cursor / visibility | 对话主路径前置 | 入口、历史、发送或实时变化进入 stale / blocked |
| `L1-identity` | runtime / event / ref | GlobalMember / actor 安全摘要 | 成员显示场景前置 | 成员卡降级为 opaque / unavailable |
| `L1-work` | runtime / event / ref | Project / ProjectMember / WorkItem / Iteration 摘要 | 项目进度场景前置 | 进度栏降级或不可见 |
| `L1-governance` | runtime / event / ref | Gate / Decision / Policy 读取和受控命令 | Gate 操作前置 | 只读卡片、pending 或 blocked；不伪造成功 |
| `L1-artifact` | runtime / event / ref | Artifact / Evidence safe ref、summary、preview | 产物预览场景前置 | 保留引用和 unavailable，不猜正文 |
| `L1-workspace` | runtime / event / ref | workspace read model、Inbox / attention、跨项目摘要 | workspace 功能前置，当前 blocker | Chat 不自行聚合，显示 unavailable / stale |
| `L2-member` | runtime / event / ref | presence / interaction safe summary | 成员运行交互场景可选 | 仅显示最小状态，不推断 host health |
| `L2-runtime` | runtime / event / ref | run / turn / decision / outcome safe summary | 运行状态场景可选 | waiting / blocked / failed / unknown，不能显示 completed |
| `L4-observability` | runtime / event / ref | low-sensitivity observation、diagnostic gap、handoff hint | 诊断场景可选 | 基础错误提示，不暴露 raw observation |
| `L6-bridges` | 并行兄弟 / 外部映射 | 不构成 Chat 正式依赖；只消费经过 owner 的内部事实 | 不前置 | 不得直接接外部平台事件或正文 |

#### 3.3 哪些依赖属于什么类型？

| 依赖类型 | Chat 允许形态 | 允许内容 | 禁止内容 |
|---|---|---|---|
| compile | `L0-sdk` package；必要时由 SDK re-export 的 `L0-core` shared types | client surface、typed refs、errors、metadata | L1/L2/L4 sibling path dependency、shadow schema |
| runtime | SDK client call / safe view adapter | query、command、session、owner status | 直接服务私有 API、共享数据库、绕过 SDK |
| event | SDK 提供的 formal event / change consumer | cursor、resume、duplicate、gap、stale、owner event | 直接订阅内部 bus、假造 topic / ACK 语义 |
| ref | owner-safe ref / summary / preview | display-safe identity、linkage、provenance | 复制正文、从 ref 猜正文或权限 |
| adapter | Chat platform adapter / SDK adapter | 浏览器、桌面、移动平台能力 | adapter 变成业务编排或 owner truth |
| fake / fixture | 后续测试替身 | client state / reducer / safe view fixtures | fake success 支撑生产 readiness |

#### 3.4 依赖失效后的处理姿态是什么？

| 失效类型 | Chat 处理 | 禁止处理 |
|---|---|---|
| SDK unavailable / version mismatch | 启动阻断或显示明确不可用 | fallback 到私有 fetch / 旧包名 |
| owner query timeout | 保留可解释 stale / unavailable | 静态填充当前状态 |
| event stream lost | 保留已知历史、标记 reconnecting、按正式 cursor 恢复 | 从时间戳猜位置或直接宣称实时 |
| command result unknown | 显示 unknown，等待查询 / 用户决策 | 盲目重试或显示成功 |
| visibility denied | 显示不可见 / 无权 | 根据缓存、错误码或对象名猜存在 |
| preview unavailable | 显示引用、摘要或不可用 | 读取 raw body、生成替代正文 |
| workspace contract blocked | 禁用跨域聚合入口或降级 | Chat 自行拼 Inbox / attention truth |

### 4. 当前文档问题诊断

| 旧内容 | 问题 | 修订 |
|---|---|---|
| 旧 `00` §10 | 直接列 `@quantalithos/sdk-core`、`sdk-events`、服务 RPC 和 99.9% 可用率 | 包名、协议和数字未由当前 SDK / owner formal surface 闭合；改为能力级依赖和失效姿态。 |
| 旧 `01` §4、§6 | SDK 和服务都被写成固定可用外部系统 | 统一以 SDK 作为接入边界，owner 作为运行期 / event / ref 来源。 |
| 旧 README | `sdk-events` / AG-UI 17 被视为已存在 | 改为 required capability / gap，不直接引用历史包。 |
| 旧 `05` 环境矩阵 | fake service / fake stream 与真实服务混用 | 后续测试必须标记 fake，不支撑 production supported。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 唯一接入边界 | SDK + 服务 RPC 并列 | `L0-sdk` 是唯一应用接入边界 | 防止页面直连和多套协议。 |
| 依赖粒度 | 以仓 / 包名罗列 | compile / runtime / event / ref / adapter / fake 分类 | 对齐全局裁剪规则。 |
| 上游可用性 | 99.9% 等候选值 | 明确 unavailable / stale / blocked / unknown 姿态 | 没有真实测量不作承诺。 |
| Bridges | 可能被视作外部平台入口 | 只作边界参考，不是 Chat 输入 | 守住并行兄弟边界。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 页面直接调用每个服务 | 初期直观 | 契约漂移、权限和错误映射分散、绕过 SDK | 不采用。 |
| Chat 内建 BFF / 聚合 adapter | 可自定义体验 | 形成第二服务层和业务 truth | 不采用。 |
| SDK 作为唯一接入边界，Chat 组合产品 adapter | 一致、可版本化、可跨端复用 | 需要补齐 SDK surface | 采用。 |

### 7. 结构化中间产物

#### 7.1 Chat 依赖裁剪图

```text
L1/L2/L4 owner truth
        | runtime / event / ref
        v
      L0-sdk  <---- compile candidate: L0-core shared types
        |
        | typed client / formal event / command result
        v
      L5-chat shared product core
        |
        +--> web shell
        +--> desktop shell
        +--> mobile shell
```

`L5-chat` 不直接指向内部 bus、owner implementation、数据库、runtime provider、Bridges external API 或 Observability backend。

#### 7.2 SDK gap register

| Gap | 需要的能力 | 依赖 owner | 影响 | 当前姿态 |
|---|---|---|---|---|
| `SDK-GAP-CHAT-001` | owner query facade + safe view typing | L1/L2/L4 owners | 页面与 view model 无稳定输入 | blocked until surface closure |
| `SDK-GAP-CHAT-002` | formal event consumer + cursor / resume | Conversation / Workspace / owner events | 实时变化和恢复不能声明完成 | blocked / no bus direct |
| `SDK-GAP-CHAT-003` | command result / receipt / idempotency mapping | Conversation / Governance / owner commands | 发送 / Gate / retry 可能重复或误成功 | blocked |
| `SDK-GAP-CHAT-004` | common error / visibility / stale / unknown mapping | Core / SDK / owner errors | reducer 无法保持跨端一致 | pending |
| `SDK-GAP-CHAT-005` | safe preview / redaction / provenance carrier | Artifact / Observability / Identity | 预览和诊断有泄漏风险 | pending |
| `SDK-GAP-CHAT-006` | session / offline cache metadata / restore hints | SDK + platform policy | 多端恢复策略不统一 | deferred decision |

### 8. 回填草稿

正式 `00-需求文档.md` §6 可回填为：

> `L5-chat` 的唯一正式应用接入边界是 `L0-sdk`。`L0-core` 只在 SDK 已确认导出稳定 shared types 且不形成 Chat shadow schema 时作为 compile candidate；Conversation、Identity、Work、Governance、Artifact、Workspace、Member、Runtime 和 Observability 通过 SDK 的 runtime / event / ref / adapter seam 被消费，不作为 Chat 的 sibling package dependency。Chat 为 Web、Desktop、Mobile shell 和最终用户提供页面、路由、展示、客户端状态、缓存和恢复体验。
>
> 任何 SDK 或 owner surface 未闭合时，Chat 只能进入 `pending / blocked / waiting / degraded / fail-closed`。Chat 不直接订阅内部 bus，不直接调用 owner 私有 API，不共享数据库，不吸收 Bridges 外部映射、Runtime 推理、Tools 执行或 Observability backend。SDK capability gap 记录在本项目校准材料中，除非另行授权，不改 `L0-sdk`。

### 9. 待确认事项

- `L0-sdk` 是否允许 Chat 直接使用 `L0-core` re-export 类型，需要在 Step 12 和 SDK 当前 package surface 复核时确认。
- Workspace / Conversation event cursor 是否能由同一 SDK event abstraction 承载，当前不能假设。
- 不同平台的本地存储与通知能力是否统一通过 SDK，还是由 Chat shell adapter 管理，需要在架构 / 配置阶段决定。

### 10. 进入下一步条件

- 已完成 Chat 相关依赖子图裁剪，未复制完整全局矩阵。
- compile / runtime / event / ref / adapter / fake 类型明确。
- SDK gap、owner、影响和 blocker 可被 Step 7~12 追溯。
- Step 6 自检通过，允许进入 Step 7。

### 11. 原型修复回写

原型新增的项目详情、BPMN 子流程、群聊关联和公司成员目录均通过 `L0-sdk` 的正式 query/safe view/ref 能力接入；Chat 不新增项目绑定接口、流程计算接口或成员目录真相。缺失的流程 projection、群聊绑定和成员摘要 capability 继续登记为 SDK/owner gap。

- 影响功能：`F-CHAT-018~021`。
- Step 6 自检：依赖仍裁剪到 SDK seam，未引入内部 bus、私有 API 或兄弟项目实现。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

Chat 为最终用户、产品/设计/支持角色及 Desktop/Web/Mobile shell 提供页面、路由、渲染、客户端交互状态、缓存、恢复与可访问性语义。V1 先验证 Desktop shell；Web 共享 UI 是扩展面，Mobile 是后续外围体验。Shell 不提供领域 truth，也不改变业务授权或结果。

| 关联方 | 依赖类型与 Chat 用途 | 失效时的安全姿态 |
|---|---|---|
| `L0-sdk` | 唯一编译/运行时业务接入边界；typed query/command/event、session、error、trace、retry、redaction、resume。 | 启动阻断或明确 unavailable；不 fallback 到私有调用。 |
| `L0-core`（仅经 SDK 正式导出） | stable ref/error/metadata 的条件型定义来源。 | 不复制 schema；未确认时只使用 SDK 已提供类型。 |
| `L1-conversation` | 经 SDK 消费 Conversation/Turn/Participant safe view、visibility、change、cursor 和普通协作结果。 | 入口/历史/发送/变化分别 stale、blocked、unknown。 |
| `L1-identity` 与 `L1-work` | 经 SDK 消费 actor/成员、Project/ProjectMember/WorkItem/Iteration 安全摘要。 | 成员或项目区域局部 opaque、stale、unavailable。 |
| `L1-governance` 与 `L1-artifact` | 经 SDK 消费 Gate/Decision/Policy 安全语境与结果、Artifact/Evidence ref/summary/preview。 | Gate 只读/unknown；Artifact 引用或预览 unavailable。 |
| `L1-workspace` | 经 SDK 消费已闭合的 safe view/export、attention/freshness。 | 不自行聚合 Inbox/attention，区域 stale、partial 或 blocked。 |
| `L2-member` 与 `L2-runtime` | 经 SDK 消费成员在场/交互与运行结果安全摘要。 | 仅显示最小状态，不推断 host health 或 outcome。 |
| `L4-observability` | 正式低敏诊断/handoff 来源与消费方。 | 本地安全错误提示；不开放 raw observation。 |
| `L6-bridges` | 并行兄弟边界参考，不构成正式输入依赖。 | 不接外部平台事件、凭证或正文。 |

依赖只按 compile/runtime/event/ref/adapter/fake 类型裁剪：Chat 不引入 L1/L2/L4 sibling package path，不直接订阅内部 bus，不共享数据库，也不将 fake 成功作为生产 readiness。`SDK-GAP-CHAT-001~006` 及 `CHAT-UP-001~007` 继续为后续设计的 required capability / gap / owner / blocker 登记。
