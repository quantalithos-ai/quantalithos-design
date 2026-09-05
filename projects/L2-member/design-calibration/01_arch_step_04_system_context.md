# Step 4. 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.5
> 回填位置: 正式 `01-架构设计.md` §5
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~3 已通过;本文件通过前未创建 Step 5

## 1. 本步输入与表达上限

| 输入 | 本步承接 |
|---|---|
| Step 2 `AG-L2M-001~009` / `AIC-L2M-001~010` | 系统上下文必须保护的目标和约束。 |
| Step 3 `RESP-L2M-001~010` / `RR-L2M-001~010` | 正式相邻 owner、输入 / 输出边界和失败上限。 |
| 正式 00 §6 / §12 | 跨仓依赖方向、依赖类型和能力面。 |
| 全局依赖规则 | compile / runtime / event 分类;ref 不作为第四类依赖。 |
| sibling 最新材料 | host 与 image 关系仍是 pending,不得画成已闭口合同。 |

本步图中只出现正式仓 / 系统对象,不画用户角色、文档来源、接口名、事件名、topic、协议、对象字段、内部模块或部署单元。

## 2. SOP 问题回答

### 2.1 本仓在全局系统中的位置

`L2-member` 位于 AI Member 容器内的交互边界:向内隔离 `L2-runtime` 的运行决策,向外承接宿主在场协作、事件事实、规则结果、项目 / 身份锚和派生能力来源。它对外只形成 member 本地交互事实、安全材料与只读派生视图,不成为相邻系统 truth 的代理写源。

### 2.2 系统上下文图

```text
+=====================================================================+
|                    L2-member system context                         |
+=====================================================================+
|                                                                     |
|  +--------------------+        +--------------------+               |
|  | L1-work / identity | -----> |                    | <----------+  |
|  +--------------------+        |                    |            |  |
|                                |                    |   +------------------+
|  +--------------------+ -----> |                    |   | L2-runtime       |
|  | L1-governance      |        |     L2-member      |   +------------------+
|  +--------------------+        |                    |            ^  |
|                                |                    |            |  |
|  +--------------------+ <----> |                    | <----------+  |
|  | L2-member-service  |        |                    |               |
|  +--------------------+        +---------+----------+               |
|                                          |                          |
|  +--------------------+                  |                          |
|  | L2-tools / methods | -----------------+                          |
|  +--------------------+                  |                          |
|                                          v                          |
|                                +--------------------+               |
|                                | L0-bus             |               |
|                                +---------+----------+               |
|                                          |                          |
|                                          v                          |
|                         +-----------------------------------+       |
|                         | conversation / observability      |       |
|                         | and other formal consumers        |       |
|                         +-----------------------------------+       |
|                                                                     |
+=====================================================================+
| Compile authority: L0-core   Build supply(pending): member-images   |
+=====================================================================+
```

图示说明:

- 箭头只表示上下文材料 / 结果方向,不是 package dependency、API 调用或事件时序。
- `L2-runtime` 与 member 是双向协作:member 提交受控入站材料,Runtime 返回受理语境与 committed safe material;双方 truth 不互换 owner。
- `L0-bus` 是入站 / 出站事件主干且拥有 delivery truth;下游 owner 不由 member 直接写入。
- `L0-core` 是唯一 compile authority;`L2-member-images` 是构建期供给的 pending 上下文,二者不等同运行期交互。

### 2.3 正式上游、下游和输入 / 输出面

| 上下文对象 | 关系方向 | 依赖类别 | member 接收面 | member 提供面 | owner 边界 |
|---|---|---|---|---|---|
| `L0-core` | 输入 | compile candidate | shared ID / ref / actor / metadata / error 与 envelope / trace authority | 无运行期输出面 | member-specific schema 未闭口时不得本地 shadow。 |
| `L1-work` | 输入 | runtime(ref) | ProjectMemberRef 执行主语 | 本地归属失败仅留 member 事实 | ProjectMember lifecycle 在 Work。 |
| `L1-identity` | 输入 | runtime(ref) | GlobalMemberRef 身份锚 / safe summary | 无身份写回 | GlobalMember / credential truth 在 Identity / credential owner。 |
| `L1-governance` | 输入 | runtime + event | Policy effective result / safe snapshot | 本地筛选使用结果 / safe material(如正式边界需要) | policy / decision truth 在 Governance。 |
| `L2-member-service` | 输入 / 输出 | runtime,pending | 启动语境、credential / acceptance / session ref | 注册请求、存活信号、状态报告、本地 attempt | host registry / session / health / lifecycle 外置。 |
| `L0-bus` | 输入 / 输出 | event | 已传递事实 ref / safe material | body-free interaction / observation material 与 publication attempt | delivery / redelivery / route truth 在 Bus。 |
| `L2-runtime` | 输入 / 输出 | runtime,pending mapping | 受理结果 ref、committed safe material / safe view | screened controlled context / delivery intent | run / decision / outcome truth 在 Runtime。 |
| `L2-tools` / `L3-method-library` | 输入(弱) | runtime(ref) | contract / definition ref / safe view | 无定义或调用写回 | Tool / method / invocation / execution truth 外置。 |
| `L1-conversation` 等交互下游 | 输出(经正式事件边界) | event | 可选 feedback ref | body-free interaction material | append / ordering / accepted truth 外置。 |
| `L4-observability` 等观测下游 | 输出(经正式事件边界) | event | 可选 ingest / observed feedback ref | low-sensitive safe material | observed / backend truth 外置。 |
| `L0-sdk` / 产品读取方 | 未来输出(可裁剪) | downstream consumption | 无核心输入 | member summary / outlet safe view | 不进入本仓 package 依赖或 truth 写路径。 |
| `L2-member-images` | 构建期供给,pending | 非运行主链 | pinned member component ref 的供给语境 | 被打包组件方向 | image / manifest / compatibility / readiness 外置。 |

### 2.4 外部依赖失效时的降级口径

| 失效上下文 | 受影响能力 | member 当前口径 | 禁止声明 |
|---|---|---|---|
| Core contract 不可用 / member-specific schema 未闭口 | compile / shared boundary | build / positive contract blocked;不造第二套 schema | compatible / integrated。 |
| Work / Identity ref invalid、unresolved 或冲突 | presence | 拒绝进入在场,保留失败分类 | ready / associated。 |
| member-service 不可达或合同未闭口 | host collaboration | presence 可按本地事实区分;host path degraded / gap | accepted / session established / healthy。 |
| Governance result unknown / stale / conflict | screening | pending / downgraded / blocked,按正式规则保守处置 | policy allowed。 |
| Bus 不可用 | inbound / publication | 入站 waiting / degraded;出站保留 decision 与 attempt / gap | delivered / redelivered。 |
| Runtime 不可用 / reject / timeout | controlled delivery / outbound source | 投递 waiting / degraded / rejected;不代答;无 committed material 则不出站 | run created / accepted / outcome exists。 |
| Tools / method ref 不可解析 | capability outlet | outlet stale / gap 或裁剪;C1~C4 不受影响 | capability available / invocable。 |
| Conversation / Observability route 未就绪 | downstream handoff | local attempt / gap;本地事实不回滚 | appended / observed / accepted。 |
| member-images supply 不可验证 | build / deployment supply | packaging / launch readiness blocked;不改变 member runtime truth | image compatible / ready。 |

## 3. 边界说明

1. `L2-member` 没有当前主链需要直连的外部互联网系统;provider / MCP / A2A / API 必须留在平台正式 adapter owner。
2. 对话和观测下游是输出上下文,不是 compile dependency,也不是 member 的同步写模型。
3. `L2-member-service`、`L2-member-images` 仍在并行窗口且正式 00 未停审;图中关系只表示方向和 owner 上限,不表示合同 ready。
4. `L2-tools` / method 输入只服务可裁剪能力出口,不能成为在场、入站、出站和追溯的必需依赖。
5. 所有 ref / snapshot / feedback 都是协作材料形态,不改变全局三类依赖分类。

## 4. 当前文档问题诊断与前后对比

| 旧上下文表现 | 问题 | 当前修正 |
|---|---|---|
| 图中把 `sandbox policy` 作为 member 直接对象 | 无正式直依赖 authority,绕过 Governance / platform boundary | 移出主图;只保留正式规则结果输入。 |
| `bus / member-service / sandbox / runtime` 混在一条输入线 | compile / runtime / event / owner 语义不清 | 分列正式上下文与依赖类别。 |
| member 下方再画 Runtime,同时正文写 member“外网可见” | 没有清楚表达双向 owner 和通用监听禁令 | 只画双向材料方向;物理 listen / transport 后移。 |
| Conversation / Observability 未作为独立 truth owner | 容易把 publish / audit 当作 downstream truth | 经 Bus / handoff 输出,下游 accepted / observed 外置。 |
| Core / member-images 未区分 compile 与 build supply | 容易将静态供给或共享契约误作运行依赖 | 在图底单列非运行关系。 |

## 5. 设计取舍

| 选择 | 未选择 | 理由 |
|---|---|---|
| 图中列仓级正式对象 | 列用户角色、文档或接口名 | 保持 C4 Context 粒度。 |
| Conversation / Observability 画在 Bus 下游 | 画 member 直写两者 | 符合 event seam 和 truth owner。 |
| Core / images 单列非运行关系 | 塞入主运行箭头 | 防止依赖类型污染。 |
| Tools / method 标为弱输入 | 作为核心前置 | 能力出口可裁剪。 |
| host / runtime mapping 标 pending | 脑补 gRPC / UDS / event route | 上游合同未闭口。 |

## 6. 结构化中间产物

- 正式运行上下文: Work、Identity、Governance、member-service、Bus、Runtime、Tools / method、Conversation / Observability consumers。
- 非运行上下文: Core compile authority、member-images build supply。
- 当前无直接外部互联网系统依赖。
- 降级总则: external truth 不可用时保留 member 已提交事实,受影响 seam 显式 blocked / waiting / degraded / stale / gap,不伪造对方结论。

## 7. 回填草稿

正式 §5 回填本文件系统上下文图、上下游与输入 / 输出面表及边界说明。正式图不得添加接口名 / event name / topic / transport;表中 pending 对端必须保留 `L2M-UP-*` 状态,不能写成 established integration。

## 8. 门禁自检

| 检查项 | 结果 |
|---|---|
| 系统位置、正式上游、下游、输入面、输出面是否齐全 | pass |
| 图中是否只包含正式系统对象 | pass |
| 图是否使用 text ASCII 且有说明 | pass |
| compile / runtime / event / build supply 是否分开 | pass |
| 是否把 downstream / host / Runtime truth 写回 member | pass:未写回 |
| 是否写 API、event name、topic、schema、transport 或内部模块 | pass:未写 |
| 失效降级是否保持 fail-closed 和本地事实优先 | pass |
| Step 4 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_05_bounded_context_subdomains.md`;正式 `01` 仍禁止修改。
