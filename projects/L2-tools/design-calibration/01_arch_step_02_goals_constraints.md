# L2-tools 01 架构设计 Step 2: 明确架构目标与约束

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 正式文档回填位置: `01-架构设计.md` 第 2、3 章

---

## 1. 本步输入与目标

### 1.1 本步目标

把 Step 1 的稳定需求前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段有意识接受的收缩和明确排除的架构范围。本步不把功能清单改写成目标,也不预先设计上下文、容器、协议、存储或技术产品。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 12 项稳定基线、14 项硬约束、8 项开放风险已经通过门禁。 | 架构目标必须回到 owner、五节点闭环、依赖、数据与失败语义;开放风险不得被目标措辞关闭。 |
| 正式 00 §2、§4、§7、§10~15 | 定位、目标、核心能力、业务红线、数据、依赖、NFR 和风险已闭合。 | 不重写需求功能;只提炼结构结果。 |
| 架构 SOP Step 2 / 书写规范 4.2、4.3 | 背景、目标、不可变约束、取舍与非目标必须相互分离。 | 目标不写功能或技术;取舍不能包装边界外职责;非目标不能写成未来 TODO。 |
| 六条上游当前正式链 | 可确认 owner 和 seam,不可确认 Tools-specific 正向合同。 | 允许把 contract closure 延后,不允许改变 truth owner 或依赖类型。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认 Step 1 已完成且只允许 Step 2。
- [x] 读取 Step 2 SOP、书写规范 4.2/4.3 和 Step 1。
- [x] 先回答“为什么要独立架构”和“必须确保什么成立”。
- [x] 诊断旧目标中的 inventory、执行器、SLA 和技术污染。
- [x] 区分不可变约束、当前阶段取舍和架构非目标。
- [x] 形成目标、取舍、非目标结构表和回填草稿。
- [x] 审计开放风险是否仍为 open / pending / future。

---

## 2. SOP 问题回答

### 2.1 本仓在架构层面必须确保什么成立

1. 工具身份、正式定义、调用语境和工具语义终态必须围绕一个独立 owner 成立,不能由 Runtime、Hub、Sandbox、provider 或客户端分别解释。
2. 五节点必须形成语义闭环,但 capability、authorization 和 Sandbox 只能在适用分支进入,不能把条件 seam 强制串成单一流水线。
3. 外部 truth 只能以受控 snapshot/ref/safe summary 进入,本仓不得复制 registry、decision、execution、delivery 或 observation truth。
4. Canonical invocation 和 normalized outcome 必须跨 caller/carrier 保持单一语义,同时将 Runtime 调用选择和 Sandbox 实际执行留在各自 owner。
5. 本地 outcome/audit 和外部安全交接必须分层提交,外部失败不能改写已成立工具域事实。

### 2.2 哪些约束不可变

Step 1 的 `HC-L2T-001~014` 全部不可变。它们共同保护六条根边界:

- 工具合同单一 truth owner。
- 外部 owner truth 不复制、不反写。
- Authorization 不自裁,Sandbox 隔离不旁路。
- Invocation / outcome 不按 caller 或 carrier 分叉。
- Forbidden body 不因诊断、审计或加密获得例外。
- 非 Core sibling 不形成 package/path dependency,开放合同不伪装 ready。

### 2.3 哪些约束属于当前可接受取舍

- Core shared contract 的具体 Tools schema 暂不定稿,但 Core compile authority 不能被本地替代。
- Authorization provider 暂不命名,但 governed path 必须通过 owner-pending 正式结果边界并 fail closed。
- Sandbox mapping、receipt、feedback 和 cleanup 暂不定协议,但 no-bypass、source-ref 和 truth 分层必须成立。
- Observability / Bus 正向 route 暂不闭口,但 local-truth-first、安全材料和 handoff gap 必须成立。
- SDK 与管理 / 搜索 / 派生能力可以后置,但不得反向定义或阻塞核心。

### 2.4 哪些目标可以明确判断或量化

当前可以按结构判断:

- 每类核心语义是否只有一个 owner。
- 每个外部 seam 是否明确输入、输出、非职责和失败口径。
- 每种数据是否被分为 truth/snapshot/ref/forbidden body。
- 每条跨仓关系是否落在 compile/runtime/event 或明确不适用。
- 每个开放项是否保持 pending / blocked / future,没有伪造 schema、route、readiness 或 evidence。

当前不能诚实量化 P95/P99/QPS/SLA、可用率或覆盖率。量化需要后续正式接口、负载模型、测量环境和 evidence authority,不能从旧文档继承。

### 2.5 哪些相关事项不是当前架构主线

Runtime planning/orchestration、capability/provider registry、authorization decision、Sandbox execution、Bus delivery、Observability store、SDK client、具体工具库存/适配/marketplace,以及 API/DTO/event/database/deployment script/test/implementation boundary 均不属于本 Step 或当前架构主线。

---

## 3. 旧材料诊断

| 旧材料表达 | 架构问题 | 当前处理 |
|---|---|---|
| 以 builtin、MCP、extras 覆盖率作为主要目标 | 把产品库存和装配规模替代工具语义边界。 | 不继承;当前目标只保护合同、调用、终态和 owner seam。 |
| 以 in-process / sandbox / mcp 执行模式为目标结构 | 由旧 carrier 和 provider 反向定义调用合同。 | 不继承;执行承载是条件边界,不分叉语义。 |
| 以 Python 包形态、Runtime 同进程为现实约束 | 无当前正式部署或语言 authority。 | 不继承;Step 6/10 独立推导逻辑承载和机制。 |
| 以低毫秒、P95、成功率、审计覆盖率为目标 | 缺正式测量对象、基线和证据。 | 降为 historical material;只保留结构性可判断口径。 |
| 把 MCP provider、Hub allowlist 和 Sandbox policy 当现成前置 | 关闭了当前开放 owner / mapping / source 缺口。 | 保持 `AR-L2T-001~004` 开放。 |
| 把 SDK、Role extras、member-images 当架构完成前置 | 混入客户端、装配和产品分发职责。 | 明确为非目标或 future / excluded。 |

---

## 4. 设计取舍

### 4.1 目标粒度取舍

- 目标写“必须成立的结构”,不写“支持创建 / 调用 / 查询”的功能复述。
- 将工具合同、Capability Binding、调用、前置 / 交接、Outcome / 审计分别纳入目标,避免只写一个抽象“统一工具平台”。
- 安全交接作为独立目标,因为 local truth 与外部 delivery/observation 的分层会直接改变结构。

### 4.2 约束复用取舍

- 不在 Step 2 生成第二套同义硬约束,正式复用 Step 1 的 `HC-L2T-001~014`。
- Step 2 只解释这些约束如何保护架构目标,后续 Step 3~15 继续以相同 ID 审计。

### 4.3 取舍与非目标分界

- 属于本仓 seam 但正向合同尚未闭口的事项进入“可接受取舍”。
- 明确属于相邻 owner 或后续设计层的事项进入“非目标”。
- 外围增强属于本仓潜在消费面,因此是阶段取舍;SDK client 本体属于下游 owner,因此是非目标且 future/excluded。

---

## 5. 结构化中间产物

### 5.1 业务背景与结构性驱动力

Runtime 需要把计划和编排转化为真实行动,但行动选择、能力目录、授权裁决、隔离执行、传递与观察分别属于不同 truth owner。若缺少独立的工具调用语义契约中心,tool identity / definition、调用语境、execution material 与 outcome 会被 Runtime、Hub、Sandbox、provider 或观察投影各自解释,形成多套不可追溯合同。

当前架构的结构性驱动力是:

| 驱动力 | 若不处理的结构后果 |
|---|---|
| 工具语义需要唯一 owner | 实现、库存、provider 或调用方会形成第二 identity/definition truth。 |
| 不同 caller/carrier 需要同一合同 | Direct、adapter、Sandbox 等会分叉 invocation/result/error 语义。 |
| 多 owner seam 需要显式分层 | Authorization、execution、delivery、observation 会被误并入工具域。 |
| 执行前硬边界需要 fail closed | 外部来源缺失时可能出现自授权、隔离旁路或伪造执行事实。 |
| 本地终态与外部交接需要解耦 | Bus/Observability 失败会错误回滚 outcome 或触发跨仓恢复。 |
| 外围消费需要可延后和可重建 | 搜索、报告、SDK/UI 会反向成为核心 truth 前置。 |

### 5.2 架构目标

| 目标 ID | 架构目标 | 说明 |
|---|---|---|
| `AG-L2T-001` | 承载独立的工具调用语义契约真相中心。 | 否则 identity、definition、invocation 与 outcome 会散落在实现、registry、Runtime 或执行适配方。 |
| `AG-L2T-002` | 支撑稳定工具身份、正式定义及显式演进围绕同一语义锚点成立。 | 否则合同会随显示名、实现、inventory 或 client wrapper 静默漂移。 |
| `AG-L2T-003` | 支撑本地工具合同与 Hub capability truth 通过 body-free relation 受控协作。 | 否则 L2 会复制 registry/exposure/applicability 或用本地 allowlist 猜测外部事实。 |
| `AG-L2T-004` | 支撑 Runtime 与不同 carrier 消费同一 canonical invocation 和终态语义。 | 否则 caller、adapter 与 Sandbox 会形成私有请求、结果或错误合同。 |
| `AG-L2T-005` | 守住工具执行要求、正式 authorization 消费判断与 effective decision 的边界。 | 否则工具风险声明会演变为 self-authorization。 |
| `AG-L2T-006` | 支撑条件化隔离交接并保持工具语义与 Sandbox execution truth 分离。 | 否则隔离会被旁路,或 capture/failure 会冒充工具结果。 |
| `AG-L2T-007` | 承载可区分、可回链的 normalized outcome 与 Tool-domain audit。 | 否则真实执行、无执行、工具失败和外部协作失败无法稳定解释。 |
| `AG-L2T-008` | 允许安全变化 / 观察材料和外围消费在不反写真相的前提下演进。 | 否则 Bus、Observability、SDK、搜索或报告会成为第二 truth source 或阻塞核心。 |

### 5.3 不可变约束

| 约束范围 | 复用约束 | 本 Step 解释 |
|---|---|---|
| 单一工具 truth | `HC-L2T-001/003/007` | Identity、invocation、outcome 均不得被实现或外部材料替代。 |
| 外部 owner 分层 | `HC-L2T-002/004~008` | Registry、planning、decision、execution、delivery、observation 各守 owner。 |
| 数据安全与时点 | `HC-L2T-009~010` | Safe material 四项合取;snapshot/ref 不原地改写既有事实。 |
| 依赖与事实纪律 | `HC-L2T-011~014` | Compile/runtime/event 不混用;开放合同、指标和旧材料不伪造。 |

### 5.4 当前阶段可接受取舍

| 取舍 ID | 取舍 | 当前口径 |
|---|---|---|
| `AT-L2T-001` | Core Tools-specific shared schema 暂不定稿。 | 保留 Core compile authority 与共享类别候选;不在 L2 复制字段或 package。 |
| `AT-L2T-002` | Authorization provider 暂不命名。 | 使用 owner-pending 外部 authority 和 fail-closed;不推定 Governance 直边。 |
| `AT-L2T-003` | Sandbox mapping、receipt、feedback、cleanup 暂不定协议。 | 只固定 handoff/source-ref/failure 分层;不宣称 execution-ready。 |
| `AT-L2T-004` | Observability producer/source/route/readiness 与 Bus 正向 route 暂不闭口。 | 保留 event collaboration 与本地 attempt/gap;不宣称 delivered/observed。 |
| `AT-L2T-005` | SDK tools-specific client seam 不进入当前主线。 | 服务端合同独立成立,SDK 保持 future/excluded。 |
| `AT-L2T-006` | 搜索、diff、批量维护、派生索引、诊断、客户端说明和管理入口不做核心前置。 | 允许延迟、缺失或重建,但不能反写真相。 |
| `AT-L2T-007` | 当前不固定语言、进程、协议、对象字段、错误码、事件名、存储或产品工具库存。 | 留给后续正式设计在不推翻架构边界的条件下收敛。 |
| `AT-L2T-008` | 当前不量化没有 authority 的性能 / 可用性指标。 | 只要求正确性优先、外围不阻塞核心、失败可解释。 |

### 5.5 架构非目标

| 非目标 ID | 非目标 | 不展开原因 |
|---|---|---|
| `ANG-L2T-001` | 不设计 agent loop、LLM planning、action choice、Runtime orchestration/retry/recovery/checkpoint。 | 属于 `L2-runtime` 的行动决策和执行主线。 |
| `ANG-L2T-002` | 不承载 capability/external provider registry、descriptor/exposure/applicability 或 provider control。 | 属于 Hub 及外部正式 owner;L2 只消费 ref/safe summary。 |
| `ANG-L2T-003` | 不设计 effective authorization/approval/policy/taxonomy truth。 | 属于尚待正式解析的 authorization authority;L2 只消费正式结果。 |
| `ANG-L2T-004` | 不承载 Sandbox environment/run/capture/failure/handoff/cleanup/recovery truth。 | 属于 `L4-sandbox`。 |
| `ANG-L2T-005` | 不承载 Bus publish/delivery/retry/DLQ/replay 或 Observability store/projection/retention truth。 | 分属 `L0-bus` 和 `L4-observability`。 |
| `ANG-L2T-006` | 不设计 SDK client、多语言 wrapper、具体 builtin/MCP client/extras/images/marketplace/inventory。 | 属于下游客户端、产品库存、适配、装配或分发边界。 |
| `ANG-L2T-007` | 不保存 raw prompt/request/capture/provider response、secret、credential 或外部 evidence/store 正文。 | 这些是 forbidden body,不因归一化、审计或诊断获准。 |
| `ANG-L2T-008` | 不在架构目标阶段设计 API path、DTO/schema、状态机、事件/topic、数据库、部署脚本、测试用例或 implementation boundary。 | 属于 02~07 后续正式设计。 |

### 5.6 目标与约束覆盖

| 需求主线 | 架构目标 | 主要硬约束 | 阶段取舍 / 非目标 |
|---|---|---|---|
| Tool identity / definition | `AG-001~002` | `HC-001`;`HC-010/012~014` | `AT-001/006~008`;`ANG-006/008` |
| Capability Binding | `AG-003` | `HC-002/005/010~012` | `AT-002`;`ANG-002~003` |
| Canonical invocation / Runtime | `AG-004` | `HC-003~004/007/010` | `AT-007~008`;`ANG-001/006/008` |
| Authorization / Sandbox seam | `AG-005~006` | `HC-005~007/010/012` | `AT-002~003`;`ANG-003~004` |
| Outcome / audit / handoff | `AG-007~008` | `HC-007~013` | `AT-004~006/008`;`ANG-005~008` |

---

## 6. 回填草稿

正式 01 第 2 章应先说明多 owner 行动协作为什么需要独立工具语义契约中心,再列 `AG-L2T-001~008`;第 3 章应分别列 `HC-L2T-001~014`、`AT-L2T-001~008` 和 `ANG-L2T-001~008`,不得把开放合同或边界外 owner 写成当前阶段实现 TODO。

---

## 7. 待确认事项

本 Step 不新增待确认项。`AR-L2T-001~008` 继续开放并约束 `AT-L2T-001~008`;这些取舍不表示 blocker resolved,也不授权后续文档自行填充 schema、route 或 readiness。

---

## 8. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 背景与驱动力是否结构化 | pass | 已解释独立架构必要性和六类结构后果。 |
| 架构目标是否非功能复述 | pass | 8 项目标均写必须成立的结构。 |
| 约束 / 取舍 / 非目标是否分开 | pass | 三类有独立定义、表和边界。 |
| 开放风险是否仍开放 | pass | Authorization、Sandbox、Observability、Core、SDK 均未伪闭口。 |
| 是否提前技术设计 | pass | 未写上下文、容器、协议、字段、存储或产品。 |
| 是否可进入职责边界 | pass | 目标和不可变边界足以裁决“做 / 不做 / 易混淆”。 |

```text
current_step = Step 2 goals_constraints completed
gate_status = pass
gate_reason = architecture goals, immutable constraints, acceptable tradeoffs and non-goals are separated and stable
next_allowed_action = create_and_complete_01_arch_step_03_responsibility_boundary
formal_document_write_allowed = false
commit_required = false
```
