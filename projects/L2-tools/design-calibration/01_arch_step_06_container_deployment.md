# L2-tools 01 架构设计 Step 6: 容器 / 部署架构

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 正式文档回填位置: `01-架构设计.md` 第 7 章

---

## 1. 本步输入与目标

### 1.1 本步目标

把 Step 4 的外部运行边界和 Step 5 的语义单元映射为逻辑运行承载,明确同步正式承接、异步协作、后台维护、核心 truth 与影子 / 派生材料在运行时如何分层。本步的“容器”是运行角色,不是实际进程、镜像、服务、代码模块或基础设施产品。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 4 | Runtime、Hub、Sandbox、Bus / Observability 是运行时相关外部边界;Core 是 compile 基础,SDK future/excluded。 | 只画理解运行承接所必需的外部边界;不重画系统上下文。 |
| Step 5 | `A1~A5`、`S1~S3`、`P1~P6` 已完成单元停审。 | 容器角色承载语义单元,不能反向改变单元 owner。 |
| 正式 00 §12 | 同步变更 / 查询、事件输入 / 输出、后台任务五类能力面已确认。 | 只表达入口、处理 / 消费、承载 / 依赖,不锁 transport。 |
| `L2T-UP-001~009` | 正向 schema、mapping、route、client 和 readiness 仍开放。 | 运行边界可以存在,但不得暗示集成已部署或可执行。 |
| 架构 SOP Step 6 / 书写规范 4.7 | 图主语必须是本仓运行承载,中心处理单元建议 1~3 个。 | 不写代码、接口、表、topic、产品、部署参数或运维手册。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认 Step 5 已通过且只允许 Step 6。
- [x] 读取 Step 6 SOP、书写规范 4.7、Step 4~5 和需求接口边界。
- [x] 先回答运行单元、同步入口、异步 / 后台、承载和部署分离问题。
- [x] 诊断旧 Python 包、同进程、executor、DB / queue 假设。
- [x] 将语义单元映射为 3 个处理角色和 3 个状态承载角色。
- [x] 形成 9 对象运行承载图、说明表和部署边界。
- [x] 审计图不表达协议、调用时序或已就绪的外部集成。

---

## 2. SOP 问题回答

### 2.1 本仓有哪些正式运行单元

本仓运行承载分为六个逻辑单元:

- `R1` 同步正式承接单元:承接合同维护 / 读取、Runtime invocation、受理、前置判断、L2 handoff eligibility/context/local-attempt 判断和终态读取;不判断 Sandbox accepted/receipt/run。
- `R2` 异步协作承接单元:承接外部变化、execution source material 的逻辑输入 seam 和状态线索,并编排 post-truth 安全输出;只有 `A1~A5` 正式语义规则可以决定是否形成核心 truth。
- `R3` 后台维护与派生单元:承接检测、对账、引用刷新、索引 / 诊断 / safe material 只读组装和重建;不裁决 safe eligibility、不收敛核心 gap truth、不成为核心写源。
- `T1` 工具合同与 Binding truth 承载:承载 `A1/A2` 的正式状态。
- `T2` Invocation、前置、Outcome 与 Audit truth 承载:承载 `A3~A5` 的正式状态和回链。
- `D1` Snapshot、ref 与派生材料承载:承载 `P1~P6` 和允许的 `S2/S3` 派生材料,不得反写 `T1/T2`;owner-pending 的 `P3` 只有逻辑位置和 gap,不能伪造已有 snapshot/ref。

### 2.2 同步入口在哪里

同步入口由 `R1` 承接。它是逻辑正式入口,用于在真实执行或正式变化前完成合同内裁定,并为直接消费者提供稳定读取。对 Sandbox 的同步判断只确认 L2 handoff eligibility、context 和 local attempt,不确认 external accepted、receipt、run 或 execution complete。它不等于某个 API gateway、handler、RPC endpoint 或 Runtime 同进程函数调用。

### 2.3 异步消费者和后台任务在哪里

`R2` 承接跨 owner 的变化线索和 execution source material 的逻辑输入 seam;positive carrier、delivery 和 mapping 仍受 `L2T-UP-003~004` 阻塞。`R2` 只编排输入,必须经 `A1~A5` 正式语义边界才能形成 `T1/T2` 新事实;输入失败或迟到只允许形成新判断 / gap,不能原地改写既有 invocation / outcome。`R3` 承接可延后的检测、对账和派生工作,其结果若要求改变核心 truth,必须重新进入 `R1` 正式边界。

### 2.4 数据库、缓存和总线如何接入

本步不选择数据库、缓存、消息后端或搜索产品。架构只确认 `T1/T2` 是不同正式 truth 语义承载,`D1` 是在正式来源可用且允许时承接消费时点 snapshot/ref/derived material 的逻辑角色;三者即使未来物理共用存储,写权限和 owner 仍必须分离。`P1` 不表示 Core compile authority 必然持久化,`P3` 在 owner/source 缺失时只有 missing/unverifiable gap。Bus 只作为 `R2` 的当前事件协作边界出现,不成为工具执行链或业务 truth 存储。缓存若后续出现,只能落入派生运行优化,不能成为 truth source。

### 2.5 哪些单元必须分开表达,哪些可以同部署

- `R1/R2/R3` 必须逻辑分离,但当前架构允许同部署;后续是否拆成独立运行实例由负载、隔离和恢复需求决定。
- `T1/T2` 必须保持不同 truth scope,但不强制物理分库。
- `D1` 必须与核心写源分离权限和语义;是否物理独立留给后续设计。
- Hub、Sandbox、Runtime、Bus、Observability 仍是外部部署边界;L2 不把它们嵌入自身运行单元。

### 2.6 哪些通信关系构成正式运行结构

- Runtime / 合同消费边界进入 `R1`。
- Hub controlled input 按适用性进入 `R1/R2`;Sandbox 则同时具有 L2 条件 handoff 输出和 execution source 逻辑输入 seam,两者不得合并;authorization authority 暂以图外 pending seam 承接。
- `R1` 读写 `T1/T2`,并只消费 `D1` 中允许的时点 snapshot/ref。
- `R2` 只编排外部输入;核心 `A1~A5` 规则决定是否形成允许的新本地事实 / snapshot / gap,并从已成立 truth 派生安全输出。
- `R3` 从 `T1/T2` 只读派生到 `D1`;安全资格、最小化 / 脱敏判断、local attempt 和 gap truth 仍由 `A5/T2` 决定,维护结果需经正式核心边界形成变化。
- `L0-bus` 当前承接 `R2` 输出的 post-truth safe material;Observability 只是经正式事件 carrier 的逻辑消费目标,Tools-specific producer/source/route/readiness 未成立,不进入正向主图。

---

## 3. 旧材料诊断

| 旧运行 / 部署口径 | 问题 | 当前处理 |
|---|---|---|
| Python monorepo 与 Runtime 同进程 | 把旧语言和进程拓扑当架构事实。 | 不继承;仅保留 Runtime 正式消费边界。 |
| Builtin executor、MCP proxy、sandbox executor 三类运行容器 | 按 carrier/provider 分叉工具语义并吸收 Sandbox truth。 | 不继承;统一由 `R1/R2` 承接条件 seam。 |
| Tool Registry service / inventory storage | 把 inventory、Hub registry 与工具合同 truth 合并。 | 由 `T1` 和 `D1/P2` 分层,不确认产品。 |
| Event emitter / retry backlog / replay worker | 把本地 safe output、Bus delivery 和 Runtime recovery 合并。 | `R2/R3` 只拥有本地材料与 gap,外部 delivery/recovery 保持外部。 |
| 固定数据库、缓存、消息队列和部署平台 | 缺当前技术 authority,且属于后续设计。 | 不继承;本步只确认逻辑承载角色。 |
| 固定进程数、容器数、资源参数与扩缩容 | 没有运行 evidence 或容量模型。 | 不声明。 |

---

## 4. 设计取舍

### 4.1 处理单元取舍

- 采用同步、异步、后台三个运行角色,因为它们分别保护执行前裁定、跨 owner 材料送达和可延后派生,故障语义不同。
- 不为 `A1~A5` 各画一个容器;限界上下文是语义结构,运行承载可以组合多个语境。
- 不建立本地 `executor` 容器;Sandbox execution 是外部边界,非 Sandbox 路径的实际 carrier 也不能在架构层提前固定。

### 4.2 状态承载取舍

- `T1` 与 `T2` 分开表达,避免合同 / binding 的长期 truth 与 invocation / terminal truth 在后续设计中互相覆盖。
- `D1` 统一承接 snapshot/ref/derived material,但数据所有权仍按 Step 8 逐项细化;本步不把它当通用 cache。
- “正式 truth 承载”只确认运行上需要稳定状态载体,不等于必须永久持久化或指定数据库。

### 4.3 外部边界取舍

- 主图将 Hub controlled input 与 Sandbox 双向条件 seam 分开,因为前者是只读外部 truth 消费,后者同时存在 L2 handoff 输出和 source material 逻辑输入。
- Authorization authority 不进入主图,防止 owner-pending 被误读为当前部署关系。
- Core 是编译期基础而非运行时容器;SDK future/excluded,二者均不进入本图。
- Observability 不进入正向运行主图,防止 current event collaboration 被误读为 L2 direct route 已 ready;其逻辑消费目标和缺口在说明表保留。

---

## 5. 结构化中间产物

### 5.1 容器 / 部署架构图

#### 图类型

逻辑运行承载图。

#### 图标题

L2-tools 正式运行承载与外部运行边界。

```text
                 +------------------------------+
                 | Runtime invocation/consume + |
                 | contract maintenance/query   |
                 +---------------+--------------+
                                 | 入口
                                 v
      +======================================================+
      |                 L2-tools 运行承载                     |
      |                                                      |
      |   +----------------+  +----------------+  +---------+ |
      |   | R1 同步正式承接 |  | R2 异步协作承接 |  | R3 后台 | |
      |   +-------+--------+  +-------+--------+  | 维护派生 | |
      |           |                   |           +----+----+ |
      |           +-------------------+----------------+      |
      |                               | 承载 / 依赖             |
      |             +-----------------+-----------------+      |
      |             v                 v                 v      |
      |   +----------------+ +----------------+ +------------+ |
      |   | T1 合同/Binding | | T2 调用/终态   | | D1 快照/ref | |
      |   | truth 承载      | | /审计 truth   | | /派生承载   | |
      |   +----------------+ +----------------+ +------------+ |
      +======================================================+
       ^          ^              |                      |
       | 输入     | 输入         | 条件 handoff         | event 输出
+------+-----+ +--+---------------v--+             +----v-------+
| Hub input  | | Sandbox logical seam|             | L0-bus    |
| controlled | | mapping/receipt open|             | current   |
+------------+ +---------------------+             +------------+
```

- 该图只表达逻辑运行承载和入口 / 处理 / 承载关系,不表达接口、事件、时序、进程数或部署产品。
- `R1/R2/R3` 可同部署但必须逻辑可分;`T1/T2/D1` 可物理共用载体但 owner 与写入方向不可合并。
- Hub 是 controlled input;Sandbox 是条件 handoff 输出与 source material 逻辑输入的双向 seam,二者拥有不同 truth。
- Sandbox seam 不属于 L2 执行容器;本地 eligibility/context/attempt 不表示 accepted、receipt、run 或 execution complete。
- 图中只画当前 `L0-bus` event edge;Observability 是 route 未建立的逻辑消费目标,不声明 direct producer、delivery 或 readiness。

### 5.2 运行单元说明

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| Runtime invocation/consume + contract maintenance/query | 运行时对接的正式外部边界 | 承接 Runtime 工具行动 / 合同消费及逻辑维护 / 查询入口。 | 向 `R1` 提供入口并消费允许结果。 | 不表示只有 Runtime 可以维护合同,也不固定 API、transport 或同进程。 |
| `R1` 同步正式承接 | 同步入口单元 | 承接合同变更 / 读取、invocation、受理、前置判断、L2 handoff eligibility/context/attempt 和终态读取。 | 读写 `T1/T2`,消费正式可用且允许的 `D1` snapshot/ref。 | 不判断 Sandbox accepted/receipt/run;核心裁定不能被全异步化。 |
| `R2` 异步协作承接 | 异步消费单元 | 承接外部变化与 source material 逻辑输入,编排 post-truth 安全输出。 | 经 `A1~A5` 核心规则决定是否形成 `T1/T2/D1` 新事实。 | Positive delivery/mapping 未闭口;不自行裁决 outcome 或原地改写终态。 |
| `R3` 后台维护与派生 | 后台处理单元 | 承接引用检测、对账、派生视图、safe material 只读组装和 gap 报告。 | 只读消费核心 truth,维护 `D1`;任何正式变化重新进入 `R1`。 | 不修改 binding、不裁决 safe eligibility、不成为核心写源或外部恢复编排器。 |
| `T1` 工具合同 / Binding truth 承载 | 正式存储承载 | 承载 `A1/A2` 的身份、定义、演进、binding 和本地关系判断。 | 为 `R1/R2/R3` 提供正式合同语义。 | 不承载 Hub registry 或 inventory 正文。 |
| `T2` Invocation / 前置 / Outcome / Audit truth 承载 | 正式存储承载 | 承载 `A3~A5` 的调用、判断、终态、审计和本地 handoff fact。 | 为同步消费、异步材料收束和追溯提供正式状态。 | 不承载 Runtime plan、Sandbox run、Bus delivery 或 observation truth。 |
| `D1` Snapshot / ref / 派生材料承载 | 正式存储承载 | 承载 `P1~P6` 允许的 snapshot/ref 及可重建外围材料。 | 被核心判断受控读取,由异步 / 后台角色更新。 | P3 owner-pending 时只记录 gap;P5/P6 保持多 owner 分层;不能反写 `T1/T2`。 |
| Hub controlled input | 运行时对接的正式外部边界 | 提供 capability controlled view/ref/safe summary。 | 按 capability-bound 场景进入 `R1/R2`。 | 只读消费,不复制 Hub truth。 |
| Sandbox logical seam | 运行时对接的正式外部边界 | 承接 L2 条件 handoff 语境并提供 execution source 逻辑输入。 | `R1` 输出本地交接语境,`R2` 承接允许材料。 | Mapping/carrier/receipt 未闭口,不声明 accepted/run。 |
| `L0-bus` current event edge | 正式基础设施依赖 | 承接 post-truth safe change material 的事件协作。 | 从 `R2` 接收安全输出。 | Bus delivery 不归 L2,失败不回滚 truth。 |
| Observability logical consumer | 运行时对接的正式外部边界 | 逻辑消费 body-free safe observation material。 | 经未来正式 event carrier 协作;无 current positive route。 | Producer/source/route/readiness blocked,不声明 feedback endpoint。 |

### 5.3 语义单元到运行承载映射

| 架构单元 | 主要处理角色 | 状态承载 | 约束 |
|---|---|---|---|
| `A1/A2` | `R1`;变化 / 校验适用 `R2/R3` | `T1`;影子在 `D1` | 不让 Hub 或 inventory 定义合同 truth。 |
| `A3` | `R1` | `T2`;caller refs 在 `D1` | 受理必须在真实执行前同步收口。 |
| `A4` | `R1`;外部变化由 `R2` | `T2`;auth/Sandbox snapshot/ref 在 `D1` | 不自授权,不把 handoff 当 run。 |
| `A5` | `R1/R2` | `T2`;external status/ref 在 `D1` | Outcome/audit 先于外部交接成立。 |
| `S1/S2/S3` | `R2/R3`;必要变更经 `R1` | 核心 fact 在 `T1/T2`,派生在 `D1` | 支撑和派生不能绕过核心写边界。 |
| `P1~P6` | `R1/R2/R3` 仅在正式来源可用且允许时按消费时点使用 | `D1` 逻辑位置 | `P1` 不等于运行期持久化;`P3` 缺来源只留 gap;其余不复制正文或混并 owner。 |

### 5.4 部署说明

当前架构只要求同步正式承接、异步协作和后台维护三个角色逻辑可分,允许它们在早期同部署,也允许后续按隔离、吞吐或重建压力拆分。合同 / Binding truth、Invocation / Outcome truth 与影子 / 派生材料即使物理共用存储也必须保持 owner、写入方向和失败语义分离。Hub、Sandbox、Runtime、Bus 与 Observability 保持外部部署边界,Core 只作为编译期合同基础,authorization 仍是图外 pending seam。具体进程、数据库、队列、协议和平台由后续正式设计在不推翻这些边界的条件下确定。

---

## 6. 回填草稿

正式 01 第 7 章使用 §5.1 图、§5.2 运行单元表和 §5.4 部署说明。必须保留“可同部署但逻辑可分”“物理共载不等于语义合并”“Sandbox seam 不是本仓执行容器”三项说明。

---

## 7. 待确认事项

本步不决定实际部署形态。Core schema、authorization owner、Sandbox mapping/receipt、Bus/Observability route 和 SDK client 的开放状态不阻塞逻辑运行承载,但阻塞相应正向运行边界被声明为已部署、ready 或 verified。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否以本仓运行承载为图主语 | pass |
| 中心处理单元是否控制为 3 个 | pass |
| 是否区分同步、异步、后台和三类状态承载 | pass |
| 是否说明可同部署 / 必须逻辑分离 | pass |
| 是否避免代码、协议、表、产品和参数 | pass |
| 是否把 Sandbox / Bus / Observability 保持为外部 truth | pass |
| 是否保留 pending/future/open seam | pass |

```text
current_step = Step 6 container_deployment completed
gate_status = pass
gate_reason = logical runtime roles, truth carriers, shadow carrier and external runtime edges are explicit without physical deployment claims
next_allowed_action = create_and_complete_01_arch_step_07_dependency_direction
formal_document_write_allowed = false
commit_required = false
```
