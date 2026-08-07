# L2-tools 01 架构设计 Step 5: 限界上下文与子域划分

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 正式文档回填位置: `01-架构设计.md` 第 6 章

---

## 1. 本步输入与目标

### 1.1 本步目标

从已确认的仓级职责和系统上下文推导本仓内部语义结构,区分核心子域、支撑子域和本地索引 / 投影 / 引用。每个架构单元必须单独收敛职责、非职责、统一语言和影子边界;本步不把五个需求节点机械改名为代码模块,不设计容器、接口、字段或存储。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 1~2 | 五节点是完整性基线,不是固定运行时序或预定实现模块。 | 候选核心单元需逐一验证是否拥有不可替代的本地语义。 |
| Step 3 | 14 类正式职责、9 类非职责和 7 类易混淆边界已闭合。 | 单元不得吸收 Runtime、Hub、authorization、Sandbox、Bus、Observability 或 SDK truth。 |
| Step 4 | 六个当前外部对象及图外 pending/future 关系已稳定。 | 外部对象不得直接成为本仓核心子域;只能形成相应影子边界。 |
| 正式 00 §7、§10~12 | `DR-L2T-001~034` 已按五节点分组,外部事实只允许 snapshot/ref。 | 核心单元按语义 owner 划分,支撑和影子结构不能反写真相。 |
| 架构 SOP Step 5 / 书写规范 4.6 | 必须区分三类上下文,逐单元停审并做跨单元审计。 | 不写对象字段、数据库、代码目录、接口或运行顺序。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认当前只允许 Step 5。
- [x] 读取 Step 5 SOP、书写规范 4.6、Step 1~4 和需求数据边界。
- [x] 逐个验证五个核心语义候选是否具有独立 owner 和统一语言。
- [x] 区分正式支撑职责与本地影子结构。
- [x] 诊断旧 Registry / Executor / MCP Proxy / Extras 子域污染。
- [x] 形成划分表、统一语言、关系图和逐单元停审。
- [x] 完成职责重叠、误归类、影子反写和开放项跨单元审计。

---

## 2. SOP 问题回答

### 2.1 本仓内部有哪些语义单元

验证后形成 14 个架构单元:

- 核心子域 `A1~A5`:工具合同身份与定义、Capability Binding、规范调用与受理、执行前置与条件交接、Outcome / 审计 / 安全交接。
- 支撑子域 `S1~S3`:合同演进与影响解释、引用有效性 / 一致性维护 / 追溯、受控读取 / 安全材料 / 外围消费辅助。
- 本地索引 / 投影 / 引用 `P1~P6`:Core、Hub、authorization、Sandbox、Runtime、Bus / Observability 六类外部影子边界。

### 2.2 哪些是核心子域,为什么不能合并

`A1~A5` 都拥有不可由相邻单元替代的本地正式语义。`A1` 回答“调用的正式工具是谁 / 是什么”;`A2` 回答“是否与外部 capability 建立何种本地关系”;`A3` 回答“本次合同内行动语境是什么、是否受理”;`A4` 回答“真实执行前置和条件交接是否成立”;`A5` 回答“工具语义终态与追溯是什么”。合并会分别造成 capability identity 替代 tool identity、调用受理与 authorization 混写、Sandbox execution material 冒充 outcome,或 delivery / observation 反写本地事实。

### 2.3 哪些是支撑子域

- `S1` 服务正式合同的显式演进、兼容影响历史和解释,但不直接另写当前 definition truth;更正 / 退役必须经 `A1` 的同一不变量收口。
- `S2` 服务跨 `A1~A5` 的引用检测、对账、追溯和派生报告,但不能修正 `A2` 的 binding truth 或任何外部 owner truth。
- `S3` 服务受控读取、safe material 的只读组装 / 消费辅助、搜索 / diff / 诊断 / 派生索引,但不能裁决安全资格、记录本地提交 truth 或声明外部送达。

### 2.4 哪些只是本地影子结构

`P1~P6` 分别承接 Core shared contract 来源、Hub controlled view、authorization result、Sandbox readiness / source、caller/work/trace、Bus / Observability handoff status 的允许 snapshot/ref。`P3` 当前只是 owner-pending 逻辑占位:正式来源不存在时不能声称已有 snapshot/ref,只能由 `A4` 形成 gap / fail-closed 判断。它们不拥有外部正文,也不把外部对象提升为本仓子域。SDK 仅为 future/excluded 消费语境,不建立当前 P 单元。

### 2.5 上下文映射关系是什么

`A1` 为其他核心语境提供工具合同锚点;`A2` 仅在 capability-bound 场景为 `A3/A4` 提供本地关联判断;`A3` 为 `A4/A5` 提供 invocation 和受理事实;`A4` 为适用执行路径提供前置与交接语境;`A5` 收束执行或无执行的工具语义终态。`S1~S3` 横向支撑核心单元,`P1~P6` 只为相应核心 / 支撑单元提供受控外部影子。

### 2.6 统一语言如何防止串线

必须固定 `tool identity != capability identity`、`binding != registry truth`、`admission/execution requirement != authorization`、`handoff context != Sandbox receipt/run`、`execution material != normalized outcome`、`Tool-domain audit != delivery audit/observation projection`。任何实现载体或后续 DTO 都必须服从这些语义差异。

---

## 3. 旧材料诊断

| 旧子域 / 模块 | 问题 | 当前处理 |
|---|---|---|
| Tool Registry | 把本地工具合同、Hub registry、inventory 和 allowlist 混成一个 truth。 | 由 `A1`、`A2`、`P2` 分层替代;旧模块仅 historical material。 |
| Builtin Execution | 以产品库存和宿主执行方式定义核心子域。 | 不进入当前单元;真实执行 owner 保持外部。 |
| MCP Client / MCP Proxy | 以 provider protocol 和客户端适配定义工具语义。 | 不进入当前子域;external provider 经 Hub / 后续 adapter seam。 |
| Sandbox Executor | 把 L2 handoff 与 Sandbox execution truth 合并。 | 由 `A4`、`P4` 分层,不建立本地 executor truth。 |
| Tool Result / Audit Emitter | 把 outcome、event delivery 和 observation 混写。 | 由 `A5`、`S3`、`P6` 分层。 |
| Role Extras / member-images / inventory catalog | 产品装配、库存与分发边界。 | 不建立任何核心或支撑子域。 |
| Python service/repository/worker 目录 | 实现结构,不是限界上下文。 | 不继承;后续实现结构必须从正式设计推导。 |

---

## 4. 设计取舍

### 4.1 核心单元数量

- 保留五个核心语境,因为它们分别拥有独立本地 truth 和不同外部失败边界。
- `A4` 同时承接 authorization 消费判断与 Sandbox 条件交接,但不将二者合成外部 owner;它们共享“执行前置”语义而非共享 truth。
- `A5` 将 outcome、audit 和安全交接放在同一核心语境,因为它们必须围绕同一终态回链;内部仍严格区分本地终态与外部 handoff 状态。

### 4.2 支撑与影子分界

- 影响解释和一致性维护有正式本地判断,因此是支撑子域;search/index/report 主要是派生消费,归入 `S3` 而非核心。
- 外部 owner 的摘要 / 引用全部进入 `P1~P6`,不因经常使用而升级为支撑或核心 truth。
- `P3` 只作为 owner-pending 逻辑影子边界存在;正式来源未成立时不得声称保存了 snapshot/ref,只能显式暴露 gap / fail-closed。
- `P4` 的 readiness 只允许是消费时点摘要,不等于 Sandbox ready、accepted 或 receipt;`P6` 内 Bus delivery 与 Observability observation 必须分别记录,不能合成为端到端 delivered / observed 事实。

### 4.3 图的语义

关系图表达语义成立与支撑关系,不是调用顺序、容器、代码依赖或每次调用必经路径。Unbound 工具可以不经过 `A2`;no-execution 可以从 `A3/A4` 收束到 `A5`;影子结构只在适用场景参与。

---

## 5. 结构化中间产物

### 5.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| `A1` 工具合同身份与定义语境 | 核心子域 | 承载稳定 tool identity、formal definition 及其正式语义锚点。 | 是 `A2~A5` 的合同来源,不由库存、实现、provider 或 client 定义。 |
| `A2` Capability Binding 语境 | 核心子域 | 承载 bound/unbound 分类、body-free relation 和本地关联判断。 | 依附 `A1`,受控消费 `P2`,不拥有 Hub registry truth。 |
| `A3` 规范调用与受理语境 | 核心子域 | 承载 canonical invocation、合同锚定、受理与执行前拒绝。 | 消费 `A1` 及适用 `A2`,向 `A4/A5` 提供调用语义,不拥有 Runtime 编排。 |
| `A4` 执行前置与条件交接语境 | 核心子域 | 承载执行要求、authorization 消费判断和条件化 Sandbox handoff 语境。 | 依附 `A3`,消费 `P3/P4`,不拥有 decision 或 execution truth。 |
| `A5` Outcome、审计与安全交接语境 | 核心子域 | 承载 normalized result/error/no-execution、Tool-domain audit 和本地安全交接事实。 | 关联 `A3/A4`,消费允许 source ref,不拥有 delivery / observation truth。 |
| `S1` 合同演进与影响解释 | 支撑子域 | 承载显式演进、兼容影响历史和既有引用解释。 | 支撑 `A1/A3/A5`;更正 / 退役经 `A1` 同一不变量收口,不能直接另写当前 definition。 |
| `S2` 引用有效性、一致性维护与追溯 | 支撑子域 | 承载引用检测、对账、stale/conflict/gap 追溯和派生报告。 | 支撑 `A1~A5` 与 `P1~P6`,不能修正 `A2` binding 或外部 truth。 |
| `S3` 受控读取、安全材料与外围消费辅助 | 支撑子域 | 承载受控读取、safe material 只读组装 / 消费辅助和 search/diff/index/diagnostic 派生。 | 只消费核心 truth 与允许影子,不裁决 safe eligibility、不记录提交 truth。 |
| `P1` Core shared contract 引用边界 | 本地索引 / 投影 / 引用 | 保存共享类别来源与 contract authority 的允许引用。 | 服务全仓基础语义,不声明 Tools-specific package/type 已存在。 |
| `P2` Hub controlled snapshot/ref 边界 | 本地索引 / 投影 / 引用 | 保存 capability controlled view、安全摘要和正式引用。 | 服务 `A2/A4/S2`,不复制 registry/descriptor/exposure/applicability。 |
| `P3` Authorization snapshot/ref 边界 | 本地索引 / 投影 / 引用 | 为未来正式结果摘要、来源引用和消费时点影子保留逻辑位置。 | 服务 `A4/S2`;owner-pending 时不宣称已有数据,只暴露 gap,不可生成 decision。 |
| `P4` Sandbox readiness/execution source snapshot/ref 边界 | 本地索引 / 投影 / 引用 | 承接执行前消费时点 readiness 摘要与 outcome source 的允许摘要 / 引用。 | 服务 `A4/A5/S2`;readiness 不等于 ready/accepted/receipt,不拥有 run/capture/failure/cleanup。 |
| `P5` Caller/work/trace ref 边界 | 本地索引 / 投影 / 引用 | 保存解释 invocation 所需的安全 caller 摘要与 actor/work/trace 外部引用。 | 服务 `A3/A5`;各引用保持各自正式 owner,不统一归 Runtime,不保存 plan/loop/checkpoint/recovery 正文。 |
| `P6` Bus/Observability handoff status snapshot/material ref 边界 | 本地索引 / 投影 / 引用 | 分别承接与本地尝试关联的 Bus delivery 摘要和 Observability observation/material ref。 | 服务 `A5/S3`;两类外部 truth 不合并,不形成 direct route 或端到端 delivered/observed 结论。 |

### 5.2 核心单元职责、非职责与影子边界

| 单元 | 正式职责 | 非职责 | 主要影子边界 |
|---|---|---|---|
| `A1` | Identity、definition、合同锚点。 | Inventory、implementation、provider、SDK truth。 | `P1`;定义来源允许 ref。 |
| `A2` | Binding relation、分类和影响调用的正式本地可用性 / 缺口判断。 | Hub registry、visibility、applicability、authorization;S2 仅检测 / 对账。 | `P2`。 |
| `A3` | Canonical invocation、受理、拒绝、no-execution 前置事实。 | Raw request、Runtime plan/loop/orchestration/recovery。 | `P5`;适用时 `P2`。 |
| `A4` | Execution requirement、authorization consumption judgment、handoff context。 | Authorization decision、Sandbox run/capture/receipt/cleanup。 | `P3/P4`;适用时 `P2/P5`。 |
| `A5` | Normalized outcome、Tool-domain audit、safe-material eligibility/preparation/local attempt/gap truth。 | Capture/provider body、delivery truth、observation store、Runtime recovery;S3 仅只读组装 / 消费辅助。 | `P4/P5/P6`。 |

### 5.3 统一语言

| 术语 | 当前含义 | 明确不等于 |
|---|---|---|
| Tool identity | 本仓稳定工具主体锚点。 | Capability identity、显示名、实现或 inventory item。 |
| Formal tool definition | 本仓正式工具行动合同。 | Provider descriptor、SDK wrapper 或源码正文。 |
| Capability Binding | Tool 与 external capability 的 body-free 本地关系。 | Hub registry/exposure truth、allowlist 或 authorization。 |
| Canonical invocation | 锚定正式工具合同的本地行动语境。 | Raw caller request、Runtime plan/activity 或 transport payload。 |
| Admission / execution requirement | L2 对合同与执行前置的本地判断。 | Effective authorization decision。 |
| Handoff context | L2 表达的条件化执行交接语境。 | Sandbox accepted/receipt/run/cleanup。 |
| Execution source material | 来自正式 execution owner 的允许 ref/safe material。 | Normalized result/error 本身。 |
| Normalized outcome | L2 对工具行动的正式成功 / 失败 / 无执行语义。 | Capture、provider response、transport/delivery/observation 状态。 |
| Tool-domain audit | 对合同、调用、判断、outcome 和允许 refs 的工具域追溯。 | Bus delivery audit、observation projection 或 Runtime checkpoint。 |
| Safe material | 通过四项合取门禁的外部协作材料。 | Result body、raw capture 或 evidence 正文。 |
| Local submission attempt | L2 对外提交的本地尝试事实。 | External delivery / observed / accepted 状态。 |

### 5.4 上下文关系图

#### 图类型

限界上下文关系图。

#### 图标题

L2-tools 核心、支撑与本地影子语义层次。

```text
+--------------------------------------------------+
| S1 演进影响 / S2 检测对账追溯 / S3 只读派生    |
|                cross-cutting support              |
+-------------------------+------------------------+
                          |
                          | 支撑
                          v
+----------------------+  +----------------------+  +----------------------+
| A1 工具合同身份定义  |->| A3 规范调用与受理   |->| A4 执行前置/条件交接 |
+----------+-----------+  +----------+-----------+  +----------+-----------+
           |                         ^                         |
           | capability-bound       | 条件关联                |
           v                         |                         v
+----------------------+-------------+             +----------+-----------+
| A2 Capability Binding|                           | A5 Outcome/审计/交接 |
+----------------------+                           +----------------------+
           ^                         ^                         ^
           | 受控影子输入            | 受控影子输入            | 受控影子输入
+----------+-------------------------+-------------------------+----------+
| P1 Core / P2 Hub / P3 Auth / P4 Sandbox / P5 refs / P6 handoff shadows |
+-----------------------------------------------------------------------+
```

- 该图表达语义锚定、横切支撑和受控影子输入,不表达代码依赖、容器、接口或每次调用顺序。
- `A1 -> A3` 是不依赖 capability binding 的直接语义锚定;`A2` 仅在 capability-bound 语境条件参与。
- `S1~S3` 横向支撑核心单元,不能反写或建立第二核心 truth;`P1~P6` 位于受控外部输入 / 影子边界,不是下游处理阶段。
- `P3` 的 `Auth` 是 owner-pending 逻辑占位;`P4` readiness 不等于 Sandbox ready/accepted;`P6` 不合并 delivery 与 observation truth。

### 5.5 架构单元停审记录

| 单元 | 分类 | 职责 / 非职责 | 统一语言 | 影子边界 | 停审 |
|---|---|---|---|---|---|
| `A1` | 核心 | 清楚 | tool identity/definition 已区分 | `P1` 明确 | pass |
| `A2` | 核心 | 清楚 | binding != registry/authorization | `P2` 明确 | pass |
| `A3` | 核心 | 清楚 | invocation != raw plan/request | `P5` 明确 | pass |
| `A4` | 核心 | 清楚 | requirement != decision;context != run | `P3/P4` 明确 | pass |
| `A5` | 核心 | 清楚 | outcome/audit/attempt 与外部 truth 已区分 | `P4/P6` 明确 | pass |
| `S1` | 支撑 | 不直接另写当前定义 | evolution/impact history 已固定 | 只消费允许 ref | pass |
| `S2` | 支撑 | 只检测 / 对账,不修正 A2 或外部 truth | stale/conflict/gap 已固定 | 跨 `P1~P6` | pass |
| `S3` | 支撑 | 不裁决 safe eligibility 或记录提交 truth | safe material/derived view 已固定 | `P6` 为主 | pass |
| `P1` | 影子 | 不宣称具体 package/type | shared authority ref | Core owner 保留 | pass |
| `P2` | 影子 | 不复制 Hub truth | controlled snapshot/ref | Hub owner 保留 | pass |
| `P3` | 影子 | Owner-pending 时无已存在 snapshot/ref | 仅逻辑位置 / gap | owner-pending 保留 | pass |
| `P4` | 影子 | 不拥有 execution truth | consumption-time readiness/source ref | Sandbox owner 保留 | pass |
| `P5` | 影子 | 不拥有 Runtime 主线或统一外部 owner | caller/actor/work/trace ref | 各自 owner 保留 | pass |
| `P6` | 影子 | Bus delivery 与 observation 分别记录 | status/material ref | Bus/Obs owner 分别保留 | pass |

### 5.6 跨单元审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 核心职责重叠 | 无 unresolved 冲突 | A1~A5 依次拥有合同、关系、调用、前置、终态语义。 |
| 核心误归类 | 无 | S/P 单元均不能独立定义工具行动 truth。 |
| Identity 串线 | 无 | Capability/provider/inventory/client 均不能替代 tool identity。 |
| 外部 truth 复制 | 无 | Hub/Auth/Sandbox/Runtime/Bus/Obs 仅经 P 单元消费。 |
| 支撑 / 派生反写 | 禁止 | S1~S3 不创建、修正或覆盖核心 truth。 |
| Forbidden body 泄漏 | 无允许入口 | 任何 A/S/P 单元都不因审计、诊断或归一化保存正文。 |
| 统一语言冲突 | 无 | 11 组易混淆术语已固定。 |
| 条件路径串成固定流程 | 无 | A2、A4 和外部 seam 均按适用性参与。 |
| A/S 写权限重叠 | 无 | S1 不写当前定义,S2 不写 binding,S3 不裁决 / 记录 A5 核心事实。 |
| P 单元状态误写 | 无 | P3 仅逻辑占位,P4 readiness 非 ready,P5/P6 保留多 owner 分层。 |
| 开放事项误关闭 | 无 | Authorization owner、Sandbox mapping、Observability route、Core schema、SDK seam 继续开放。 |
| 实现结构泄漏 | 无 | 未写字段、表、代码目录、接口、container 或技术产品。 |

---

## 6. 回填草稿

正式 01 第 6 章使用 §5.1 划分表、§5.3 统一语言和 §5.4 关系图。§5.2、§5.5、§5.6 作为详细校准与门禁来源,正式正文可保留必要的边界摘要,但不得把 P 单元误写为外部真相缓存或现成集成。

---

## 7. 待确认事项

本步没有阻塞单元划分的新增问题。`P3` 的 owner、`P4` 的 mapping/receipt、`P6` 的 producer/route 和 `P1` 的 Tools-specific authority 继续受 `L2T-UP-001~008` 约束;它们是影子边界可存在但正向合同尚未闭口的场景。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否区分核心、支撑和本地影子 | pass |
| 每个单元是否有职责、非职责、统一语言和影子边界 | pass |
| 是否完成 14 个单元停审 | pass |
| 是否完成跨单元职责 / owner / 术语审计 | pass |
| 是否保留 pending/future/open blocker | pass |
| 是否避免实现结构与固定时序 | pass |

```text
current_step = Step 5 bounded_context_subdomains completed
gate_status = pass
gate_reason = five core contexts, three supporting contexts and six local shadow boundaries passed unit reviews and cross-context audit
next_allowed_action = create_and_complete_01_arch_step_06_container_deployment
formal_document_write_allowed = false
commit_required = false
```
