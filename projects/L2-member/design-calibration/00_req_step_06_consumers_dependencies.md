# L2-member 00 需求 Step 6: 使用方与依赖

> 创建日期: 2026-08-20
> 状态: repaired_done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 6 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 使用方与依赖 |
| 输出文件 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.6 五张固定表 + 裁剪图;全局规则 §2/§4/§5/§6) |
| 已读取前序输入 | yes(Step 2 边界、Step 5 角色;draft 01 §3~4 依赖裁剪候选) |
| 当前模式 | full-restart |
| 进入条件 | Step 5 gate_status=pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 全局基线引用 | done | 引用块 | pass |
| SOP 问题回答 | done | 九项回答 | pass |
| 诊断(旧依赖章) | done | 差异表 | pass |
| 设计取舍 | done | 取舍表 | pass |
| 内部仓依赖表 | done | 固定表 | pass |
| 依赖裁剪表 / 分类表 / 禁止表 | done | 三张固定表 | pass |
| 依赖裁剪图 | done | ASCII 图 | pass |
| 回填草稿 | done | 第 6 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入

- `standards/document/全局项目依赖关系与裁剪规则.md` §2(三类依赖)、§4(总矩阵 L2-member 行)、§5/§6(固定格式)。
- Step 2 边界判定口径;draft 01 §3~4(用户已确认候选)。
- L2-tools 00 §6 的表达方式("candidate / pending 只是关系状态,不是第四种依赖类型")。

## 3. 全局基线引用

- 规则来源:`standards/document/全局项目依赖关系与裁剪规则.md`
- 总矩阵中 `L2-member` 行:编译期依赖 `L0-core`;运行期依赖 "member-service / runtime IPC 边界";事件协作依赖 "订阅 / 发布成员运行事件";说明 "容器内社交门面"。
- 本 Step 只裁剪 `L2-member` 相关依赖边,不复制 27 仓总矩阵。

## 4. SOP 问题回答

1. 本仓向哪些仓 / 系统提供哪些能力?

   回答: 向 `L2-runtime` 提供受控的入站语境投递与出站承接面(容器内 entry seam 的成员侧);向 `L2-member-service` 提供注册请求 / 存活信号 / 状态报告与本地尝试语境;向 `L0-bus` 提供已成立出站事实的发布材料;向 `L4-observability` / `L1-conversation` 等下游经事件主干提供 body-free 交互 / 观测材料;向摘要消费方提供成员状态与能力出口安全视图。

2. 本仓依赖哪些仓 / 系统提供哪些能力?

   回答: 依赖 `L0-core` 共享契约类别(compile 候选);依赖 `L0-bus` 事件订阅 / 发布主干;依赖 `L2-runtime` entry 合同与 committed safe material;依赖 `L2-member-service` 启动语境、注册接受 / host session ref 与宿主协作面(pending);依赖 `L1-work` 的 `ProjectMemberRef` 执行主语、`L1-identity` 的 `GlobalMemberRef` 身份锚、`L1-governance` 的 Policy effective 结果 / safe snapshot;弱依赖 `L2-tools` / `L3-method-library` 的定义 ref(能力出口派生)。

3. 这些关系在全局依赖基线中分别是什么边?

   回答: 与总矩阵 L2-member 行一致——compile 仅 Core;runtime 为 member-service / runtime 边界;event 为成员运行事件订阅 / 发布。identity / governance / tools / method 的 ref / snapshot 消费是总矩阵 "consumes L0, L1, L3 according to role" 的裁剪细化。

4. 哪些全局依赖边需要进入本仓需求主链,哪些应被裁剪出去?

   回答: 进入主链——Core、Bus、Runtime、member-service(pending)、Governance、Identity;弱进入——Tools / Method(仅能力出口路径);裁剪出去——member-images(构建资产,不进入运行主链)、Sandbox / Capability-Hub / SDK / L5/L6(无直接边,经 Runtime / Tools / SDK 间接)。

5. 每条进入主链的关系属于编译期、运行期,还是事件协作依赖?

   回答: 见 §7.2 裁剪表。只有 Core 是编译期候选;Runtime / member-service / Governance(结果消费面)为运行期;Bus / Observability / Conversation 下游为事件协作;identity / tools / method 的 ref 消费附着运行期或事件 carrier,不构成第四类依赖。

6. 哪些依赖是闭环前置?

   回答: Core(共享契约类别)、Bus(入站 / 出站主干)、Runtime(投递与承接对象)是核心闭环前置;member-service 是在场能力的场景前置(契约 pending);Governance 是入站筛选分级的场景前置;Identity 是在场建立的来源前置。Tools / Method 只是能力出口(可裁剪)前置。

7. 哪些依赖失效时会影响本仓当前阶段能力?

   回答: 见 §7.1 失效影响列。核心口径:任何失效只导致对应能力 waiting / degraded / blocked / fail-closed,不伪装成功,不回滚本地已提交事实。

8. 哪些关系只是消费 / 引用,哪些会形成强阻塞?

   回答: work / identity / governance / tools / method 是消费 / 引用(work / identity 主语解析失败时入场 fail closed,其余按路径 degraded / fail-closed);Runtime entry 不可用形成入站投递强阻塞(waiting,不代答);Bus 不可用形成入站 / 出站双向强阻塞(本地记录保留)。

9. 哪些依赖虽然存在,但不属于当前阶段前置条件?

   回答: member-images(打包关系);L0-sdk(未来下游封装);L4-observability 的 positive route(`L2M-UP-004/005` 未闭口,只保留 attempt / gap)。

## 5. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 00 §10.1 | 依赖表带 SLA 百分比与 retry / reconnect 降级机制 | SLA 无 authority,机制是实现层;重写为能力级 + 失效影响。 |
| 旧 00 §10.2 | "上游 core(proto/CloudEvent)" | CloudEvents / W3C Trace Context 是 Core 当前正式标准,但 `proto` 载体和 member-specific event type / route 不能从旧文档继承;本仓只消费 Core 已发布类别与标准。 |
| 旧 00 §10.1 | supervisord / runtime(同容器) 写成外部系统依赖 | 进程管理器是载体;runtime 是内部仓协作,不是外部系统。 |
| 旧 README §关键依赖 | "下游 runtime(通过 UDS 连 B6)" | 方向表达为实现拓扑;重写为双向 seam(member 投递入站语境、消费 safe material)。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| Governance 直边进入主链(采用,运行期+事件) | 入站筛选规则来源必须可回链;全局矩阵允许 L1 消费 | 规则 taxonomy 未闭口(`L2M-UP-007`) | 采用,未闭口路径 fail closed |
| Governance 不进主链(参照 L2-tools 的 owner-pending 处理) | 更保守 | member 的筛选分级明确消费 Policy effective 结果,关系比 tools 的 authorization owner 清晰 | 不采用;但 taxonomy 细节保持 pending |
| member-service 依赖降为"不适用" | 避免对 pending 兄弟建边 | 在场能力的场景前置真实存在,全局矩阵已有该运行期边 | 不采用;进入主链但标 pending 契约 |
| Tools / Method ref 进入主链 | 能力出口有来源 | 能力出口本身可裁剪 | 采用为弱边(非闭环前置) |

## 7. 结构化中间产物

### 7.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID / ref / actor / metadata / error、CloudEvents envelope 与 W3C Trace Context 标准及跨仓契约 authority | 是,但 member-specific contract 未闭口(`L2M-UP-005`) | 跨仓身份、关联和错误语义无法稳定;member 不得本地复制第二套 schema。 |
| 输入 / 输出 | `L0-bus` | 入站事件订阅与出站发布的事件传递主干 | 是 | 入站进入 waiting / degraded,出站形成 attempt / gap;本地筛选与决定记录保留,不回滚。 |
| 输入 / 输出 | `L2-runtime` | entry 合同(受控触发 / 控制 / safe query)与 committed outcome / safe material | 是 | 入站投递 waiting / degraded,不代答;出站无材料可承接;presence 可独立成立。 |
| 输入 / 输出 | `L2-member-service` | 启动语境、凭据 / 注册接受 / host session ref;member 向其提供注册请求、存活信号、状态报告与本地尝试语境 | 在场能力场景前置(契约 pending,`L2M-UP-001`) | 启动语境不可验证时不进入在场(fail closed);运行中宿主不可达进入 degraded;member 不声明注册已接受、session 已建立或健康已判定。 |
| 输入 | `L1-work` | 项目型实例的 `ProjectMemberRef` 执行主语 | 项目型在场建立的来源前置 | ref 不可解析、非 Active / permitted 或 scope 冲突时拒绝入场;非项目型路径按 `L2M-UP-008` blocked。 |
| 输入 | `L1-identity` | 与执行主语关联的 `GlobalMemberRef` 身份锚 / 安全摘要 | 在场建立的来源前置 | 锚点不可解析或与 ProjectMember 不一致时拒绝入场;不猜测身份。 |
| 输入 | `L1-governance` | Policy effective 结果 / safe snapshot(入站筛选与出站约束) | 入站筛选分级的场景前置(`L2M-UP-007`) | 规则来源 unknown / stale / conflict 时筛选保守处置(降级或阻断),不自建 allowlist。 |
| 输入 | `L2-tools`、`L3-method-library` | 工具契约 ref / 定义 safe view(能力出口派生) | 否(能力出口可裁剪) | 能力出口视图 stale / gap,核心闭环不受影响。 |
| 输出 | `L1-conversation`、`L4-observability` 等下游 | body-free 交互 / 观测材料(经事件主干) | 否 | 下游消费缺口独立显式;不反写 member truth。 |
| 输出 | `L0-sdk`、产品入口 | 未来下游消费面 | 否,当前不进入主链 | 不影响本仓 truth;不反向进入 package 依赖。 |

### 7.2 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L2-member 编译期依赖栏 | 依赖方 | 编译期依赖 | 是 | 唯一 compile 候选;member-specific shared schema 未闭口时保持 pending,不本地 shadow。 |
| `L0-bus` | 订阅 / 发布成员运行事件 | 协作方 | 事件协作依赖 | 是 | 入站 / 出站事件主干;delivery truth 归 bus。 |
| `L2-runtime` | member-service / runtime IPC 边界(总矩阵运行期栏);Runtime 侧把 member 列为 Entry consumers | 协作方(容器内 peer) | 运行期依赖 | 是 | member 向 Runtime entry 提交入站语境、消费 safe material;正向 mapping 受 `L2M-UP-003` 约束。 |
| `L2-member-service` | member-service / runtime IPC 边界(总矩阵运行期栏) | 被编排方 | 运行期依赖 | 是(契约 pending) | 对方需求 Step 9 已通过并停审、Step 10 尚未开始;当前注册、接入 / session、健康 owner 分层可引用;正式 00 与字段合同仍未闭口(`L2M-UP-001`)。 |
| `L1-work` | "consumes L1 according to role" 裁剪 | 依赖方 | 运行期依赖(ref) | 是 | 消费项目型 `ProjectMemberRef` 执行主语;不拥有 ProjectMember truth。 |
| `L1-governance` | "consumes L1 according to role" 裁剪 | 依赖方 | 运行期依赖 + 事件协作依赖 | 是 | 消费 Policy effective 结果 / safe snapshot 与变化事件;unknown fail closed(`L2M-UP-007`)。 |
| `L1-identity` | "consumes L1 according to role" 裁剪 | 依赖方 | 运行期依赖 | 是 | 只消费身份锚点 ref / 安全摘要;身份生命周期不归本仓。 |
| `L2-tools` | "consumes L3 according to role" 经 Tools 合同裁剪 | 依赖方 | 运行期依赖(弱) | 是(弱,能力出口) | 只以 ref / safe view 派生能力出口;不复制 ToolDefinition。 |
| `L3-method-library` | "consumes L3 according to role" 裁剪 | 依赖方 | 运行期依赖(弱) | 是(弱,能力出口) | role / method 定义 ref / safe view;不保存正文。 |
| `L1-conversation` | 出站材料的下游消费方 | 被依赖方 | 事件协作依赖 | 是 | member 只交 body-free 材料;对话真相归 conversation。 |
| `L4-observability` | 横切观测材料消费 | 协作方 | 事件协作依赖 | 是 | 安全材料附着事件 carrier;producer / route 未闭口(`L2M-UP-004`)。 |
| `L2-member-images` | 打包 member 运行部件 | 被打包方 | 不适用 | 否 | 对方需求 Step 1~8 已通过且 Step 9 进行中;静态镜像资产与 pinned 入口方向只作 pending 输入,构建资产边界不进入运行主链(`L2M-UP-002`)。 |
| `L0-sdk` | 未来下游封装 | 被依赖方 | 不适用 | 否 | 仅 future 边界记录;不反向进入 package。 |
| `L4-sandbox`、`L3-capability-hub`、L5/L6 | 无直接边 | — | 不适用 | 否 | 分别经 Runtime→Tools / SDK 间接协作;不建立直边。 |

### 7.3 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 正式 shared context 类别;member-specific contract 闭口后才能定稿。 | `01~03`;`07` |
| 运行期依赖 | `L2-runtime`;`L2-member-service`;`L1-work`;`L1-governance`;`L1-identity`;(弱)`L2-tools` / `L3-method-library` | 容器内 entry seam;宿主请求 / 信号 / 报告与 acceptance / session ref 协作;执行主语、Policy 结果与身份锚点消费;定义 ref 派生能力出口。 | `01~05`;`07` |
| 事件协作依赖 | `L0-bus`;`L1-governance`(变化输入);`L1-conversation` / `L4-observability`(输出) | 入站订阅、出站发布、policy 变化承接与安全材料交接。 | `00~05`;`07` |

### 7.4 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L2-member -> L2-runtime` 源码 / package 依赖 | 会吸收 run / decision truth,破坏容器内双 owner 分层 | 运行期 entry seam;各自保留 truth。 |
| `L2-member -> L2-member-service` 源码依赖 | 会把编排 / 注册表 / 健康裁决 truth 绑入门面 | 运行期宿主协作面 + 事件;契约 pending 时 fail closed。 |
| `L2-member -> L1-governance` 本地 policy 缓存作裁决 | 形成第二 policy truth,fail-open 风险 | 只消费正式结果 / safe snapshot;unknown 保守处置。 |
| `L2-member -> L1-identity` 源码依赖或身份生命周期写入 | 越过身份 truth owner | 运行期 ref / 安全摘要消费。 |
| `L2-member -> provider / MCP / A2A / 任意外部 API` 直连或自建通用外部监听面 | 越过 capability-hub / tools / sandbox owner并扩大攻击面 | 外部能力经 Runtime→Tools 正式合同;Bus、宿主与 Runtime 只经各自正式 runtime / event seam;member 不做外部 adapter。 |
| `L2-member -> L1-conversation / L1-artifact` 正文写入 | 反写下游对话 / 制品真相 | 只发布 body-free handoff material。 |
| `L2-member -> L0-bus` 作为业务裁决链 | Bus 只拥有传递 truth | 本地 truth 提交后按事件协作发布。 |
| `L2-member -> L0-sdk` 源码 / package 依赖 | SDK 是下游,反向依赖成环 | member 暴露正式边界,SDK 下游封装。 |
| 任一 sibling(除 Core)成为 path dependency | 违反全局裁剪与层级 | runtime / event / ref / adapter seam。 |

### 7.5 依赖裁剪图

#### 依赖裁剪图: L2-member

```text
L2-member --[compile]--> L0-core
L2-member --[event]----> L0-bus
L2-member <-[runtime]--> L2-runtime          (容器内 entry seam)
L2-member <-[runtime]--> L2-member-service   (宿主协作面, 契约 pending)
L2-member --[runtime]--> L1-work             (ProjectMemberRef 执行主语)
L2-member --[runtime]--> L1-governance       (policy 结果消费; 变化经 [event])
L2-member --[runtime]--> L1-identity         (GlobalMemberRef 身份锚)
L2-member --[runtime]--> L2-tools / L3-method-library  (弱: 能力出口 ref)

L1-conversation / L4-observability --[event]--> L0-bus  (消费 member 出站材料)
```

图示说明:
- 本图只展示 `L2-member` 相关裁剪边,不展示全 27 仓。
- `[compile]` 仅 `L0-core`;`[runtime]` 与 `[event]` 不得写成 package dependency。
- 双向 `[runtime]` 表示协作 seam 的两个消费方向,不表示调用时序或 IPC 载体。
- member-service 边契约未闭口,仅表达能力级 seam;Tools / Method 为可裁剪弱边。
- `ref` 是 runtime / event 关系中的受控交互形态,不是第四种全局依赖类型;外部 adapter 为禁止直边,fake 仅能作为后续测试替身,均不得伪装为当前依赖或正向集成。
- 箭头表达依赖 / 消费 / 协作方向,不表达事件传播时序或实施顺序。

### 7.6 path dependency 判定结论

| 关联项目 | 依赖类型 | 是否允许写入 package dependency | 当前处理 |
|---|---|---|---|
| `L0-core` | 编译期依赖 | 是(contract 闭口后) | path dependency 候选;`L2M-UP-005` 闭口前 pending。 |
| 其余全部 | 运行期 / 事件协作 / 不适用 | 否 | seam(entry / host / ref / snapshot / event)或 future 记录。 |

## 8. 回填草稿

按 §3 全局基线引用 + §7.1~7.6 六件套回填第 6 章;结论段说明:当前主依赖集中在 Core / Bus / Runtime 三条闭环前置边,member-service 与 governance 是场景前置且部分 pending,tools / method 为可裁剪弱边,images / SDK / sandbox / hub 不进入主链。

## 9. 待确认事项

- `L2M-UP-001`(宿主合同)、`L2M-UP-003`(entry mapping)、`L2M-UP-005`(member-specific Core schema)、`L2M-UP-007`(筛选规则来源)、`L2M-UP-008`(非项目型执行主语)持续挂起;不阻塞项目型需求边界成文。

## 10. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 未复制 27 仓总矩阵 | pass |
| 每条主链关系有三类依赖判断 | pass |
| 五张固定表 + 裁剪图齐全且格式合规 | pass |
| 无接口名 / 事件名 / 协议 / 机制泄漏 | pass |
| sibling pending 未升格为确定契约 | pass |
| Step 7 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_07_core_capability_loop
formal_document_write_allowed = false
```
