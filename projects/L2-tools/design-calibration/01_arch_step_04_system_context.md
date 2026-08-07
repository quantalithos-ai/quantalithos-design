# L2-tools 01 架构设计 Step 4: 系统边界与上下文

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 正式文档回填位置: `01-架构设计.md` 第 5 章

---

## 1. 本步输入与目标

### 1.1 本步目标

说明 `L2-tools` 在全局系统中的位置,确定当前正式上下文对象、输入面、输出面和依赖失效时的降级边界。本步只画仓级外部关系,不表达内部架构单元、接口、事件、数据流、部署组件或调用时序。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 1~3 | Owner、目标、职责、非职责和红线已闭合。 | 只有已确认关系对象可进入主图;职责不能被箭头改写。 |
| 正式 00 §6、§12 | 当前关系为 Core compile、Hub/Sandbox/Runtime runtime、Bus/Observability event;authorization pending,SDK future/excluded。 | 主图与表必须区分当前关系、条件关系和图外记录。 |
| 全局依赖裁剪规则 | 依赖类型只允许 compile/runtime/event。 | 本 Step 只写“输入/输出/依赖”上下文关系,不把关系转成 package dependency。 |
| Hub 当前正式 01 | Hub 向 Tools 提供 formal exposure / controlled view,Tools execution 不得反写 Hub。 | Hub 只作为受控 capability 输入对象。 |
| Sandbox 当前正式 01 | Sandbox 拥有 execution isolation truth,Tools 拥有工具语义。 | Sandbox 有双向协作面,但 mapping/receipt 仍未闭口。 |
| Observability/Core/Bus/SDK 当前正式链 | 可确认 owner 和宏观消费边界,不可确认 Tools-specific schema/route/client/readiness。 | 图和表不得写具体 producer、route、schema、client 或 ready。 |
| 架构 SOP Step 4 / 书写规范 4.5 | 主图只能出现本仓与正式上下文对象,关系只写输入/输出/依赖。 | 不画角色、文档、内部模块、协议名或事件名。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认 Step 3 已通过且只允许 Step 4。
- [x] 读取 Step 4 SOP、书写规范 4.5、Step 1~3 和上下游输入。
- [x] 先裁决哪些对象进入当前主图,哪些只作图外 pending / future 记录。
- [x] 回答位置、上游、下游、输入、输出和失效降级问题。
- [x] 后置诊断旧上下文图的 inventory / provider / policy / emitter 污染。
- [x] 形成系统上下文图、输入输出面表、图外对象表和降级表。
- [x] 审计图中箭头不表达固定时序、协议或 truth 转移。

---

## 2. SOP 问题回答

### 2.1 本仓在全局系统中的位置

`L2-tools` 位于基础共享合同和 Runtime 行动消费之间。它以 Core 正式共享 contract authority 为唯一编译期基础,按适用场景消费 Hub capability 与 Sandbox execution 边界,为 Runtime 提供稳定工具合同、canonical invocation 和 normalized outcome,并把已成立本地事实的安全材料交给 Bus / Observability 协作边界。

### 2.2 正式上游与输入面

- `L0-core`:共享身份、上下文、错误、追踪、metadata、envelope 等类别与跨仓 contract authority。
- `L3-capability-hub`:capability identity / formal exposure 的 controlled ref 或 safe summary,只在 capability-bound 场景适用。
- `L4-sandbox`:与 invocation 相关的 execution source ref/material,只在需要隔离执行的路径适用。
- `L2-runtime`:合同内工具行动目标、定义引用和允许的安全调用语境;它是调用入口,但也是本仓直接下游消费者。

Authorization authority 是条件输入能力,但当前 owner 未解析为确定项目关系,因此留在主图外。它的缺失不允许 L2 自行裁决。

### 2.3 正式下游与输出面

- `L2-runtime`:消费工具合同、调用受理 / 拒绝语义、normalized result/error 和允许的 audit backref。
- `L4-sandbox`:仅在适用路径接收条件化隔离交接语境;本地输出不表示 Sandbox 已受理或执行。
- `L0-bus`:消费已成立本地事实的 body-free 安全变化材料,拥有 delivery truth。
- `L4-observability`:通过正式事件协作边界消费最小、脱敏、可关联的安全观察材料,拥有 observation truth。

### 2.4 哪些对象构成当前正式上下文边界

当前主图只包含 `L0-core`、`L3-capability-hub`、`L4-sandbox`、`L2-runtime`、`L0-bus` 和 `L4-observability` 六个对象。它们都有正式 00 中已确认的当前依赖或消费记录。Authorization authority、SDK、external provider / registry、inventory / marketplace 因 pending、future 或边界外状态不进入主图。

### 2.5 依赖失效时如何降级

- 核心 contract authority 不能验证时,阻塞受影响合同闭口或构建,不复制替代 schema。
- Hub、authorization 或 Sandbox 必要输入缺失时,受影响场景 fail closed、pending 或 no-execution;不回退本地 registry、自授权或宿主直跑。
- Runtime、Bus、Observability 或 future SDK 消费失败时,不改写本地合同、outcome 或 audit;只形成相应未消费、handoff attempt 或 gap。

---

## 3. 旧材料诊断

| 旧上下文线索 | 问题 | 当前处理 |
|---|---|---|
| Runtime 同进程直接调用 Python tools package | 把部署假设和调用方式当系统边界。 | 废弃;Runtime 只作为运行期入口 / 消费对象。 |
| Builtin inventory、MCP server/client 作为正式上下游 | 把产品库存、provider runtime 与 registry 直接拉入 L2。 | 不进入主图;外部能力必须经 Hub 和后续正式 adapter seam。 |
| Role extras / member-images / console 作为主上下文 | 把装配和产品入口写成合同 truth 前置。 | 排除;当前没有正式依赖边。 |
| Governance / policy server 直接作为确定上游 | Authorization owner 和 source matrix 尚未闭口。 | 留图外 `owner-pending`,不默认指向 Governance。 |
| Observability emitter / event backlog / replay | 把本地输出、Bus delivery 和 observation store 混为一个上下文。 | Bus 与 Observability 分列,不声称 route 或 producer ready。 |
| MCP direct/proxy 与 sandbox/direct 固定路径 | 把条件 seam 画成每次调用固定时序。 | 主图只表达边界方向;路径分支留 Step 9。 |

---

## 4. 设计取舍

### 4.1 主图对象取舍

- 只画正式 00 已确认的六个当前关系对象,保证图可被依赖裁剪和需求追溯共同验证。
- Runtime 和 Sandbox 各有输入 / 输出双向面,但这不表示双向 package dependency或 truth 转移。
- Observability 虽通过事件 carrier 消费,仍是正式上下文对象;图不表达它与 L2 之间存在已闭口 direct route。

### 4.2 图外对象取舍

- Authorization authority 影响 governed path,但 `DB-L2T-003` 为 owner-pending;进入主图会伪造当前依赖。
- SDK 是潜在下游,但 `DB-L2T-008` 为 future/excluded;进入主图会让 client seam 成为核心前置。
- External MCP/A2A/API/provider runtime 经 Hub 与后续 adapter 间接协作;直接画入会形成第二 registry truth。

### 4.3 降级取舍

- 对核心前置采用 fail-closed / pending / no-execution,对外围消费采用 local-truth-first / explicit gap。
- “不受影响路径可继续”只适用于已正式成立的本地合同读取或其他独立路径,不表示缺失前置的调用可以旁路。
- 不在本 Step 命名 error code、状态枚举、timeout、route 或 recovery 算法。

---

## 5. 结构化中间产物

### 5.1 系统上下文图

#### 图类型

系统上下文图。

#### 图标题

L2-tools 当前正式系统上下文。

```text
+----------------------+  +----------------------+  +----------------------+
|       L0-core        |  | L3-capability-hub    |  |      L4-sandbox      |
| shared contract base |  | controlled cap view  |  | execution truth seam |
+----------+-----------+  +----------+-----------+  +----------+-----------+
           | 依赖 / 输入              | 输入                     | 输入 / 输出
           +--------------------------+--------------------------+
                                      v
                    +------------------------------------------+
                    |                 L2-tools                 |
                    | tool invocation semantic contract truth |
                    +---------+----------------+---------------+
                              | 输入 / 输出    | 输出
               +--------------+        +-------+-----------------------+
               |                       |                               |
               v                       v                               v
+----------------------+  +----------------------+  +----------------------+
|      L2-runtime      |  |        L0-bus        |  | L4-observability     |
| direct contract user |  | safe change carrier  |  | safe material user   |
+----------------------+  +----------------------+  +----------------------+
```

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入 / 输出方向,不表达接口、事件、实现组件或运行时顺序。
- Sandbox 与 Runtime 的双向面只表示协作边界,不表示 truth ownership 转移或双向源码依赖。
- Hub / Sandbox 仅在适用场景成为前置;纯本地合同读取、unbound 或 no-execution 路径不必穿越全部对象。
- Bus / Observability 只消费已成立本地 truth 的安全材料;图不声明 producer、source、route、delivery 或 readiness 已存在。
- Authorization authority 和 SDK 分别因 owner-pending 与 future/excluded 留在图外。

### 5.2 上下游与输入 / 输出面

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 依赖来源 | 共享 identity/context/error/trace/metadata/envelope 类别与跨仓 contract authority | Compile 关系成立,但 Tools-specific schema/package authority 仍开放;L2 不复制第二套共享合同。 |
| `L3-capability-hub` | 输入 | 能力来源 | Capability identity、formal exposure 的 controlled ref/safe summary 与变化线索 | 仅 capability-bound 场景需要;Hub visibility/applicability 不等于 authorization。 |
| `L4-sandbox` | 输出 | 执行协作 | 按正式工具语义表达的条件化隔离交接面 | 仅 sandbox-required 且前置满足时适用;本地 handoff context 不等于外部 receipt/run。 |
| `L4-sandbox` | 输入 | 执行来源 | 与特定 invocation 关联的正式 execution source ref/material | 只用于工具语义归一化;mapping/receipt seam 仍开放。 |
| `L2-runtime` | 输入 | 调用入口 | 正式合同内的工具行动目标、定义引用与允许的安全调用语境 | Runtime 决定何时 / 为何调用并拥有 planning/orchestration/recovery;raw plan body 不进入 L2 truth。 |
| `L2-runtime` | 输出 | 直接消费 | 稳定工具合同、受理/拒绝、normalized result/error 与允许的 audit backref | Runtime 不得反写工具 truth 或用私有 schema 分叉合同。 |
| `L0-bus` | 输出 | 事件协作消费 | 已成立本地工具事实的 body-free 安全变化材料 | Bus 拥有传递 truth;失败只形成本地 attempt/gap,不回滚终态。 |
| `L4-observability` | 输出 | 横切消费 | 最小必要、body-free、redacted、correlated 的安全观察材料 | Observation store/projection 不反写本地 outcome/audit;具体 route/readiness 未确认。 |

### 5.3 图外相关对象

| 对象 / 能力 | 当前状态 | 不进入主图原因 | 当前处理 |
|---|---|---|---|
| 正式 authorization authority | `owner-pending`,非当前项目依赖 | 未解析为确定仓或外部 provider。 | Governed path 条件消费正式 result ref/safe summary;不可验证即 fail closed。 |
| `L0-sdk` | `future/excluded` | Tools-specific client seam 未成立。 | 服务端合同独立成立,client DTO 不得反向定义 truth。 |
| External MCP/A2A/API/provider runtime | 非直接当前依赖 | 必须经 Hub 与后续正式 adapter 边界,不得成为本地 registry。 | 当前上下文图不画直边。 |
| Builtin inventory/member-images/marketplace | 产品 / 装配 / 分发边界 | 不拥有工具合同 truth。 | 不进入架构上下文主线。 |
| 人类角色与自动维护任务 | 需求角色,不是系统上下文对象 | 书写规范禁止把角色画入主图。 | 后续入口边界按能力表达,不画具体角色。 |

### 5.4 依赖失效与开放 seam 降级

| 对象 / 边界 | 失效或未闭口语境 | 架构降级口径 |
|---|---|---|
| `L0-core` | Shared authority 不可用 / 不兼容,或 Tools-specific schema 未闭口。 | 阻塞受影响跨仓合同闭口或构建;不得在 L2 复制 ID/error/trace/envelope schema。 |
| Hub | Ref/view 缺失、stale、冲突或不可验证。 | Capability-bound binding/call 显式失效、挂起或 fail closed;不得回退本地 registry;不受影响的正式 unbound 合同读取可继续。 |
| Authorization authority | Owner/result/source/freshness/结论不可验证。 | Governed path fail closed/no-execution;不得默认归属 Governance 或由 L2 自批。 |
| Sandbox | 必要执行能力、交接或 source material 不可用 / 不可解释。 | Sandbox-required path 拒绝、等待或形成可解释 error/no-execution;不得宿主直跑、伪造 run/capture/result。 |
| Runtime | 下游不可用或消费失败。 | 不形成新调用消费;既有 L2 contract/outcome/audit 不改写,L2 不承担 Runtime retry/recovery。 |
| Bus | 安全材料无法提交或传递。 | 本地提交尝试、降级和缺口显式;已成立 local truth 不回滚,不声称 delivered。 |
| Observability | Producer/source/route/readiness 未闭口或消费失败。 | 本地 safe material/attempt/gap 可判断;不声称 observed/evidenced,outcome/audit 不改写。 |
| SDK | Client seam 不存在。 | 当前核心无降级影响,继续保持 future/excluded。 |

### 5.5 边界说明

六个主图对象分别承接基础合同、能力真相、隔离执行、直接行动消费、事件传递和横切观察,足以表达当前正式仓际关系。它们进入主图不表示每次工具调用都必须穿越全部对象,也不表示正向协议已经闭合。Authorization authority 与 SDK 分别因为 owner-pending 和 future/excluded 留在图外;external provider 与产品库存则必须经各自正式 owner 或适配边界协作。该边界确保开放 seam 可以继续设计,但不会提前变成当前依赖或 implementation-ready 事实。

---

## 6. 回填草稿

正式 01 第 5 章使用 §5.1 系统上下文图和 §5.2 输入 / 输出面表作为主表达,附 §5.3 图外对象和 §5.4 降级表。图后必须保留五条说明,尤其明确条件路径、Bus/Observability readiness 和 authorization / SDK 图外状态。

---

## 7. 待确认事项

`L2T-UP-001~009` 没有新增或关闭。它们不阻塞当前上下文对象、方向和降级边界成文,但继续阻塞 authorization provider、Sandbox mapping/receipt、Observability/Bus route、Core schema 和 SDK client 被写成正向 ready 合同。

---

## 8. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 主图对象数量与类型 | pass | 1 个中心仓 + 6 个正式上下文对象,未画角色、文档或内部模块。 |
| 关系表达 | pass | 只用输入 / 输出 / 依赖,未写接口名、事件名或运行时顺序。 |
| Current / pending / future 分层 | pass | Authorization 与 SDK 均留图外,未升格为当前关系。 |
| 依赖降级 | pass | 核心前置 fail closed,外围消费 local-truth-first。 |
| Owner 分层 | pass | Registry、decision、execution、delivery、observation 和 Runtime truth 均未转移。 |
| 上游 blocker 诚实性 | pass | 未声明 schema、mapping、route、readiness 或 evidence 已存在。 |
| 是否可进入 Step 5 | pass | 外部边界已稳定,可从职责而非旧实现划分限界上下文。 |

```text
current_step = Step 4 system_context completed
gate_status = pass
gate_reason = current context objects, input/output faces, out-of-graph pending/future relations and degradation boundaries are explicit
next_allowed_action = create_and_complete_01_arch_step_05_bounded_context_subdomains
formal_document_write_allowed = false
commit_required = false
```
