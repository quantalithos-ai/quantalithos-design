# Step 06 · 使用方与依赖

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 06 · 使用方与依赖 |
| 输出文件 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 6、书写规范 §4.6、全局依赖规则 §4~6 与通用规范 |
| 已读取前序输入 | yes，Step 2、5、专项上游正式 00/必要台账、draft 依赖线索 |
| 模块骨架 | done：使用方 / 输入依赖 / 裁剪表 / 类型表 / 禁止依赖 / ASCII 图 / pending |
| 进入条件 | `pass`，Step 5 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 从全局矩阵裁剪 L5-console 直接相关边 | done | 不复制全 27 仓矩阵 |
| 回答提供方/消费方/前置/失效/裁剪/依赖类型问题 | done | 见 §4 |
| 审计旧 API/SLA/直连依赖口径 | done | 见 §5 |
| 比较全量直连、统一后端聚合、SDK/owner 分域适配方案 | done | 见 §6 |
| 形成固定三表和依赖图 | done | 见 §7 |
| 判断复杂度 | done | 按 owner 族归并，exact 接缝留 Step 12/pending |
| 形成正式回填草稿 | done | 见 §9 |
| 自检并同步门禁 | done | 见 §11~12 |

## 3. 本步输入

| 输入 | 结论 |
|---|---|
| 全局矩阵 `L5-console` 行 | 编译期依赖 `L0-core / L0-sdk`；运行期经 SDK 消费 L1/L2/L3/L4 管理 API；事件状态按需经 SDK。 |
| Step 2 | Console 是客户端产品边界，不拥有服务端聚合或业务 truth。 |
| Step 5 | 人类角色是直接使用者；SDK/owner 是系统交互方，但仓际依赖不能混入角色表。 |
| 专项 owner 正式 00/台账 | 各 owner 提供能力级 query/command/ref/result；多个 exact contract/activation 仍 pending。 |
| 其他 L5/L6 | 未停审内容只能 pending；不成为 Console 主链前置。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓向哪些仓/系统提供什么能力？ | Console 主要向授权人类提供组织治理与管理操作体验；对其他产品最多提供安全导航/deep-link 与客户端诊断语境，不向 L1~L4 提供业务 truth。 |
| 本仓依赖哪些仓/系统？ | 强制编译/访问基础为 `L0-core` 和 `L0-sdk`；具体页面运行期依赖 identity/work/process/governance/artifact/workspace/member-service/method/capability/observability/archive/sandbox 的正式能力。 |
| 这些关系在全局基线中是什么边？ | `L0-core/L0-sdk` 为编译期；L1~L4 为运行期；状态变化只在 SDK 正式封装时形成事件协作，不直接订阅内部事件。 |
| 哪些进入主链，哪些裁剪？ | SDK、正式 actor/scope/visibility 与至少一个 owner-safe read surface 是基础闭环前置；页面族按 owner 合同逐个启用。其他 L5/L6、外部 GRC、数据库/内部总线、具体技术框架均裁剪出当前主链。 |
| 依赖失效有什么后果？ | 身份/可见性失效则整体 fail-closed；某 owner 失效仅相应页面/区块 partial/stale/unavailable；命令合同失效则保持只读或 blocked，不伪造成功。 |
| 哪些是强阻塞，哪些只是消费/引用？ | actor/scope/visibility 与 SDK 基础访问是全局强前置；每个 owner 只阻塞自身页面的正向能力。artifact/report/archive refs 多为引用，不能因引用缺失改写其他 owner truth。 |

## 5. 当前材料与旧文档问题诊断

| 旧位置 | 旧口径 | 问题 | 当前处理 |
|---|---|---|---|
| 旧 `00` §10.1 | 为 Identity/Work/Governance/Observability/Capability/Artifact 设具体 SLA 和 proto-draft 合同 | 无当前 authority，且把运行期能力误写成已稳定接口 | 删除 SLA/路径；只保留能力级依赖和失效姿态 |
| 旧 `00` §10.2 | 直接枚举 Server 服务和 proto 路径 | 绕过 SDK 优先原则并锁定未核验协议 | 改为 `L0-sdk` + 正式 owner 能力边界 |
| 旧 `README` 关键依赖 | SDK + React/Svelte/图表/Tailwind | 把外部 UI 技术候选与业务依赖混写 | 技术候选后移，不进需求依赖主链 |
| draft 01 §5 | 已区分 runtime/ref/adapter 并禁止数据库 | 方向正确，但仍是候选且未完全按全局固定格式 | 重新裁剪并纳入三张固定表 |
| L4-archive/observability/sandbox 台账 | 设计完成度与 activation/实现状态不同 | 不能把正式设计完成推导为运行期可用 | 依赖进入需求范围，但正向集成保持 blocked/pending |

## 6. 改动前后对比与设计取舍

### 6.1 改动前后对比

| 主题 | 旧口径 | 当前结论 |
|---|---|---|
| 接入路线 | 多个 Server API/RPC 直连 | 默认经 `L0-sdk` 或正式服务边界，不共享存储 |
| 依赖类型 | API/SLA/编译期混合 | compile/runtime/event/ref/adapter 分开，只有 compile 可进 package dependency |
| 失效策略 | “只读回退/局部 skeleton”笼统描述 | 身份 fail-closed；owner 局部 partial/stale/unavailable；command blocked/unknown |
| 正向可用性 | 文档存在即视为可集成 | exact contract、实现、activation 分离；pending 不等于 ready |

### 6.2 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| A. Console 直接依赖每个 owner 源码或数据库 | 快速取数 | 破坏分层、权限与真相源，形成高耦合 | 不采用 |
| B. Console 自建统一服务端聚合/授权层 | 表面简化 UI | 形成第二套规则和跨域 truth，当前也无该仓 authority | 不采用 |
| C. 以 SDK 为统一入口、按 owner 分域 adapter、逐页面保留局部降级 | 符合全局依赖与 owner 边界，可渐进开放 | 需要明确每块来源和状态 | 采用 |
| D. 直接消费内部 bus 事件维护本地投影 | 可实时更新 | Console 将拥有 cursor/replay/projection truth | 不采用；仅可用 SDK 正式事件封装作失效提示 |

## 7. 结构化中间产物

### 7.1 内部仓使用方与依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享安全引用、错误和追踪语境（以正式暴露为准） | 是 | 无法稳定标识来源、错误和关联语境 |
| 输入 | `L0-sdk` | 端侧正式查询、命令、结果与可选状态消费入口 | 是 | Console 不得改为私有直连；正向业务页面 blocked |
| 输入 | `L1-identity` | actor/member 安全摘要、生命周期与正式身份语境 | 场景前置；actor 语境为全局前置 | 无法验证会话/主体时整体 fail-closed；成员页不可用 |
| 输入 | `L1-work` / `L1-process` | 项目、成员承担、工作、过程和进展的正式读取/管理结果 | 对项目/Workspace 页面是 | 对应页面 partial/unavailable，不从缓存推导状态 |
| 输入 | `L1-governance` / `L1-artifact` | 治理决定、控制/评审语境、制品与 evidence 安全引用 | 对治理页面是 | 治理动作 blocked；缺失证据不得补造合规结论 |
| 输入 | `L1-workspace` | 跨域安全 read/export 或局部视图（合同闭口后） | 条件 | 可改从各 owner 独立视图或标记缺失；不拥有 projection |
| 输入 | `L2-member-service` | 成员宿主/会话/健康等正式管理结果 | 对宿主管理场景是 | 宿主相关操作/状态不可用，身份 truth 不受影响 |
| 输入 | `L3-method-library` | 方法资产安全读取与正式管理结果 | 对方法页面是 | 方法页面只读/blocked/unavailable，不伪造发布 |
| 输入 | `L3-capability-hub` | 能力注册、暴露、适配和访问治理结果 | 对能力页面是 | 能力页降级；不得推导 capability/runtime ready |
| 输入 | `L4-observability` | 审计、trace、metric、lineage、报告和验证结果 | 对审计/指标页面是 | 相应视图 partial/unavailable；不得自建审计或指标 |
| 输入 | `L4-archive` | 归档/恢复请求、材料、完整性、兼容性与 handoff 结果 | 对 Archive 页面是 | 正向入口 blocked；保留多轴未知/失败姿态 |
| 输入 | `L4-sandbox` | 隔离执行、限制、捕获、失败和清理状态的安全读取 | 条件/只读 | Sandbox 状态面 unavailable，不影响 Console 基础壳 |
| 输出 | `L0-sdk` / 各 owner | 通过正式能力提交用户意图并携带客户端关联语境 | 对命令闭环是 | 无正式 command 时只读/blocked，不改用私有写入 |
| 输出 | 其他 L5/L6 产品 | 安全导航或引用链接（若将来正式约定） | 否 | 跨产品跳转缺失，不阻塞 Console 自身闭环 |

当前阶段没有需要纳入主链的正式第三方系统依赖。浏览器/辅助技术属于运行环境约束；外部 GRC、身份提供方、图表库等尚无本仓正式直接合同，不作为当前依赖主链。

### 7.2 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | Console 编译期共享契约来源 | 依赖方 | 编译期 | 是 | 仅消费正式共享引用/错误/追踪语义，不自造 shadow type |
| `L0-sdk` | UI 默认统一接入层 | 依赖方 | 编译期 + 运行期 | 是 | 所有业务 query/command 默认经 SDK；exact surface pending |
| L1 identity/work/process/governance/artifact | 正式业务 truth 与管理能力 | 依赖方 | 运行期 | 是 | 每个页面消费 owner 正式结果，不源码直连服务仓 |
| `L1-workspace` | 跨域只读视图 owner | 依赖方 | 运行期 + 引用 | 条件进入 | safe read/export 未全闭口，不能成为唯一强前置 |
| `L2-member-service` | 成员宿主编排 owner | 依赖方 | 运行期 | 条件进入 | 只进入员工宿主管理/状态场景 |
| `L3-method-library` | 方法资产 owner | 依赖方 | 运行期 | 是 | 方法管理入口依赖其正式查询/命令，合同成熟度需保留 |
| `L3-capability-hub` | 能力注册/访问治理 owner | 依赖方 | 运行期 | 是 | 能力入口需保留 NotVisible/Degraded/ConsistencyDefect |
| `L4-observability` | 观测/审计/指标 owner | 依赖方 | 运行期 | 是 | Console 只读展示/请求正式结果，不自建 evidence |
| `L4-archive` | 归档与恢复材料 owner | 依赖方 | 运行期 | 是，正向能力受阻 | 需求保留入口及多轴姿态，不能宣称集成 ready |
| `L4-sandbox` | 隔离执行 owner | 依赖方 | 运行期 | 条件进入 | 只读状态/受控入口；不得执行或推导 readiness |
| `L0-bus` | 内部事件协作主干 | 非直接依赖方 | 事件协作 | 否（除 SDK 封装） | Console 不维护内部事件投影、cursor 或 replay |
| 其他 L5/L6 | 产品/生态并行窗口 | 协作方 | 运行期/引用候选 | 否 | 未停审内容 pending，不作为本仓 truth 或前置 |

### 7.3 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core`、`L0-sdk` | 消费正式共享类型与官方客户端，不引入 L1~L4 服务源码 | `01/02/03/07` |
| 运行期依赖 | `L0-sdk` 封装的 L1/L2/L3/L4 正式 owner | 按页面查询或提交受控意图，保真呈现结果 | `01/02/03/05/06` |
| 事件协作依赖 | 仅 SDK 正式暴露的状态/失效通知 | 作为刷新/失效提示，不作为本地 projection truth | `01/03/05` |
| 引用/adapter | Artifact/evidence/report/archive/sandbox 等安全 ref 与 owner adapter | 用于 drill-down、结果回查和来源说明，不复制正文 | `02/03/05/06` |

### 7.4 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Console → 任一 L1/L2/L3/L4 数据库/内部 repository | 绕过 visibility、Policy/Gate、审计和 owner 事务 | 经 `L0-sdk` 或正式服务 query/command |
| Console → L1/L2/L3/L4 源码 path dependency | 把运行期消费误作编译期耦合 | 只依赖正式共享契约和 SDK |
| Console → `L0-bus` 内部订阅并维护业务投影 | 会拥有 cursor/replay/dedupe/projection truth | 只消费 SDK 正式状态通知并重新查询 owner |
| Console → 本地 RBAC/Policy/Gate/合规/readiness 引擎 | 复制服务端规则并可能 fail-open | 呈现 owner 正式 visibility/decision/result |
| owner → Console UI state 作为业务输入 truth | 页面/缓存/草稿不可成为领域事实 | 用户意图经正式 command 提交，owner 自行校验 |
| Console → 其他未停审 L5/L6 私有状态 | 并行项目未形成真相且会造成产品耦合 | 仅使用未来正式链接/SDK 合同；当前 pending |

### 7.5 依赖裁剪图: L5-console

```text
                         +----------------+
                         | L0-core        |
                         | L0-sdk         |
                         +-------+--------+
                                 | [compile/runtime]
                                 v
                       +--------------------+
 human users --------> | L5-console         |
                       | product/client state|
                       +---------+----------+
                                 |
             +-------------------+-------------------+
             | [runtime via SDK]                     |
             v                                       v
  L1 truth owners / L1-workspace          L2/L3/L4 capability owners
  identity/work/process/governance        member-service/method/capability
  artifact                                observability/archive/sandbox

 L0-bus --[event via SDK only]--> cache invalidation / refresh hint
 other L5/L6 --[pending ref/link]--> not a current truth dependency
```

图示说明：

- 本图只展示与 `L5-console` 相关的裁剪边，不表示调用顺序。
- 只有 `[compile]` 关系可进入 package dependency；L1~L4 均是经 SDK 的运行期能力。
- `[event]` 只允许 SDK 正式封装的提示，不能让 Console 维护业务投影。
- 其他 L5/L6 未停审关系不进入当前主链。

## 8. 复杂度判断

专项 owner 数量多，但依赖性质一致：`L0-core/L0-sdk` 提供编译/接入基础，各 owner 以运行期能力逐页面进入。为避免 Step 6 变成接口清单，按 owner 族归并；exact query/command、同步/异步面和依赖类型映射在 Step 12 展开。

## 9. 回填草稿

正式 §6 使用 §7.1 的能力级内部依赖表（可按 owner 族压缩）、§7.2~7.4 固定三表及 §7.5 ASCII 图。不得回填旧 SLA、proto 路径、框架或“已集成”结论。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-001` | 各 owner exact query/command SDK surface | 需求按能力级依赖收束；Step 12 登记并阻塞对应正向集成声明 | `open` |
| `CON-Q-002` | tenant/org scope owner 与合同 | actor/scope 无法验证时 fail-closed；不由 Console 创建 | `open` |
| `CON-Q-008` | SDK 是否正式暴露状态通知/事件封装 | 当前不把事件列为必需；无合同则采用显式刷新/查询语义 | `open / non_blocking` |
| `CON-Q-009` | Workspace safe read/export 是否适合作为页面来源 | 当前条件进入且不能成为唯一来源或授权依据 | `open / non_blocking` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 是否从全局基线裁剪而非复制全矩阵 | pass |
| 是否区分编译期、运行期、事件、引用/adapter | pass |
| 是否输出固定裁剪表、类型表、禁止依赖表和 ASCII 图 | pass |
| 是否明确只有 compile 可进入 package dependency | pass |
| 是否未把角色、核心能力步骤、API/DTO 或实现机制混入 | pass |
| 是否将 owner 局部失效与全局 actor 失效分开 | pass |
| 是否把未停审 L5/L6 和未闭合 exact contract 保持 pending | pass |
| 是否发现阻塞 Step 7 的 blocker | no；只阻塞具体页面正向集成，不阻塞核心能力结构 |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 使用方、前置、失效、三类依赖、禁止依赖和裁剪图完整 | 更新 flow，激活 Step 7 | 本文件；Step 2/5；全局依赖规则 |
| 文档级 | `pass_to_step_07` | 依赖足以支撑核心能力逻辑，不把运行期边写成源码依赖 | 创建并完成 `00_req_step_07_core_capability_loop.md` | 本文件；Step 4 |
| 项目级 | `pass_with_open_upstream_pending` | exact 合同影响局部正向能力，已保持 pending | 进入 Step 7；正式 00 仍不可写 | 项目台账；需求 flow |
