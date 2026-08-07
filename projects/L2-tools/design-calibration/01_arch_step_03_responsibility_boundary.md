# L2-tools 01 架构设计 Step 3: 职责边界

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 正式文档回填位置: `01-架构设计.md` 第 4 章

---

## 1. 本步输入与目标

### 1.1 本步目标

在 Step 1 的稳定基线和 Step 2 的目标 / 约束之上,明确本仓“做什么、不做什么、哪些职责最易混淆、哪些行为绝不能隐式发生”。本步只裁决仓级职责,不画系统上下文图,不划分限界上下文,不展开数据所有权、通信方式或实现结构。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | `ARB-L2T-001~012` 与 `HC-L2T-001~014` 固定 owner、五节点、依赖和事实纪律。 | 职责不能关闭 `AR-L2T-001~008`,也不能把外部 truth 改写成本仓职责。 |
| `01_arch_step_02_goals_constraints.md` | `AG-L2T-001~008`、`AT-L2T-001~008`、`ANG-L2T-001~008` 已收敛。 | 做 / 不做必须保护目标;取舍不是新增职责,非目标不能包装成“暂不做”。 |
| 正式 00 §2、§7、§9~12 | 仓定位、五节点、功能、规则、数据和能力级接口边界已闭合。 | 职责写语义 owner,不抄功能项或接口名。 |
| 架构 SOP Step 3 / 书写规范 4.4 | 只允许“做 / 不做 / 易混淆职责”三类。 | 说明列只解释归属与被保护边界,不写上下文、交互或实现。 |
| 旧 README / 正式 01 | 包含 inventory、MCP、extras、registry、executor、emitter 等旧职责。 | 仅在独立裁决后做 historical_material 差异审计。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认当前只允许 Step 3。
- [x] 读取 Step 3 SOP、书写规范 4.4 与 Step 1~2。
- [x] 逐项回答仓级职责问题,先裁决 owner 再整理表格。
- [x] 诊断旧材料把库存、执行、传递和观察合仓的问题。
- [x] 区分正式职责、非职责与易混淆职责。
- [x] 提炼不可隐式越过的边界红线。
- [x] 形成正式第 4 章回填草稿和 Step 门禁。

---

## 2. SOP 问题回答

### 2.1 本仓具体做什么

本仓承担五条核心语义责任和一条外围责任:

1. 维护稳定工具身份、正式定义及其显式演进。
2. 维护本地工具合同与 Hub capability truth 之间的 body-free binding relation,并判断该关系的本地可消费状态。
3. 形成 canonical invocation、合同锚定、受理、执行前拒绝和 no-execution 语义。
4. 表达工具域执行要求,消费正式 authorization 结果并形成来源可验证性 / 消费前置判断,维护条件化 Sandbox handoff 语境。
5. 从可信 execution source ref/material 形成 normalized result/error/no-execution、Tool-domain audit 和本地安全交接事实。
6. 提供只读、可重建的合同搜索、diff、诊断、派生索引和维护辅助,但不形成第二 truth。

### 2.2 本仓具体不做什么

本仓不拥有 Runtime 的行动选择和恢复主线,不拥有 Hub / provider registry,不生成 authorization decision,不拥有 Sandbox execution truth,不拥有 Bus delivery 或 Observability store,不实现 SDK/client/product inventory,也不保存 forbidden body。以上不是“当前晚点做”,而是稳定仓级边界。

### 2.3 哪些相关能力必须属于其他 owner

| 能力 | 正式边界 |
|---|---|
| Agent loop、planning、orchestration、retry/recovery/checkpoint | `L2-runtime`。 |
| Capability identity、registry、descriptor、formal exposure、applicability | `L3-capability-hub`。 |
| Effective authorization、approval、policy、taxonomy | 尚待解析的正式 authorization authority。 |
| Environment、run、capture、failure、receipt、cleanup、recovery | `L4-sandbox`。 |
| Publish/delivery/retry/DLQ/replay | `L0-bus`。 |
| Ingest/store/projection/query/retention | `L4-observability`。 |
| Client wrapper、产品工具库存、extras/images、marketplace | SDK、产品装配、provider 或分发 owner。 |

### 2.4 哪些行为绝不能隐式发生

- 工具显示名、实现、provider identity、capability identity 或 client DTO 不能隐式成为 tool identity / definition truth。
- Hub visibility、工具风险声明或本地 allowlist 不能隐式成为 authorization。
- Sandbox-required 调用不能静默宿主直跑,本地 handoff attempt 不能隐式成为 Sandbox receipt / run。
- Capture、provider response 或 transport success 不能隐式成为 normalized success。
- Bus delivery audit、observation projection 或 Runtime checkpoint 不能隐式成为 Tool-domain audit。
- 外部交接失败不能隐式回滚本地终态,也不能让 L2 接管 Runtime recovery。
- Search、index、diagnostic 或 report 不能隐式成为核心写入口。

### 2.5 哪些边界最容易在后续串线

最易串线的是 risk/execution requirement 与 authorization、binding 与 registry、canonical invocation 与 Runtime request/plan、handoff context 与 Sandbox receipt/run、execution material 与 normalized outcome、Tool-domain audit 与 delivery/observation truth、local attempt 与 external status。它们必须在后续每个架构单元中保持不同术语和 owner。

---

## 3. 旧材料诊断

| 旧内容 | 诊断 | 当前处理 |
|---|---|---|
| “内置工具 + MCP client proxy + role extras”作为仓定位 | 把产品库存、客户端适配和装配职责合入工具语义仓。 | 标记 historical material,不继承。 |
| Tool Registry / Builtin Execution / MCP Proxy / Extras 作为子域 | 用旧实现结构替代当前 owner 与契约边界。 | 不继承;Step 5 从本 Step 职责重新推导。 |
| Python monorepo、同 Runtime 进程、三态 executor | 把旧部署和 carrier 当仓级职责。 | 不继承;Step 6/10 独立收敛。 |
| Hub allowlist、MCP direct/proxy | 混淆 capability visibility、provider 与 authorization。 | 仅保留 controlled Hub ref/safe summary 和 owner-pending authorization seam。 |
| Audit event、Observability emitter、backlog/replay | 混写 Tool-domain audit、Bus delivery 与 observation store。 | 三类 truth 分离;只保留本地 safe material / attempt / gap。 |
| Role extras、member-images、file/code/git/test/docs inventory | 产品装配和具体库存越界。 | 不进入当前职责表。 |
| SLA、阈值、自审通过和 ADR accepted | 缺 measurement、evidence 和正式 ADR authority。 | 不作为职责或完成证明。 |

---

## 4. 设计取舍

### 4.1 职责粒度

- “做”按稳定语义责任组织,不是把 `FR-L2T-*` 逐条改写成动词清单。
- Capability Binding、authorization consumption、Sandbox handoff、安全材料分别作为职责,因为它们拥有不同本地 truth 和外部 owner 边界。
- 将执行 source material 的“工具语义消费”列为本仓职责,但明确外部 material body / lifecycle 仍属于 Sandbox 或 provider owner。

### 4.2 非职责表达

- 相邻 owner 能力统一写“不做”,不使用“暂不实现”,避免演进阶段把边界外职责吸收回来。
- API、字段、部署等后续设计层不进入职责表;它们是文档层级约束,不是领域 owner。

### 4.3 外围职责表达

- 搜索、diff、派生索引、诊断和管理辅助属于本仓可提供的外围职责,但必须被限定为只读、可重建、不阻塞核心。
- SDK client 本体不因“客户端说明”进入本仓;本仓最多提供可被未来客户端消费的正式服务端合同语义。

---

## 5. 结构化中间产物

### 5.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 稳定工具身份与正式工具定义语义承载 | 做 | 这是本仓作为工具调用语义契约真相仓的根职责。 |
| 工具定义变更、兼容影响、更正和退役语义承载 | 做 | 若不由本仓显式承载,既有引用与调用含义会随实现静默漂移。 |
| Capability-bound/unbound 分类及 body-free binding relation 承载 | 做 | 本仓拥有本地合同与外部 capability 之间的关系语义,但不接管另一端 truth。 |
| Binding 校验、失效、冲突和已知缺口判断 | 做 | 本仓解释自身关系能否消费,但不能补造 Hub truth。 |
| Canonical invocation、合同锚定与调用受理语义承载 | 做 | 不同 caller/carrier 必须围绕同一正式合同形成唯一调用语义。 |
| 执行前拒绝、等待前置和消费者可见 no-execution 语义承载 | 做 | 未满足合同或正式前置时必须在真实执行前可解释收束。 |
| 工具域执行要求判断 | 做 | 本仓说明调用需满足的合同内执行前置,但该判断不是 authorization。 |
| 正式 authorization 结果来源可验证与消费前置判断 | 做 | 本仓判断正式结果能否被安全消费,不能生成或改变 decision truth。 |
| 条件化执行承载要求与 L2 handoff 语境承载 | 做 | 本仓表达工具语义交接要求,不声明外部已受理或已执行。 |
| Execution source ref/material 的工具语义消费 | 做 | 本仓从可信来源形成工具语义解释,不拥有外部 execution body 或 lifecycle。 |
| Normalized result/error/no-execution outcome 承载 | 做 | 本仓让成功、工具失败、执行前拒绝和执行材料失败保持可区分。 |
| Tool-domain audit 与多 owner 回链语义承载 | 做 | 工具域追溯围绕 identity、definition、invocation、outcome 和允许 source refs 成立。 |
| 安全交接准备、本地提交尝试、降级和缺口语义承载 | 做 | 本仓只拥有材料安全判断和本地尝试事实,不拥有外部 delivery/observation 结果。 |
| 合同搜索、diff、派生索引、诊断和维护辅助 | 做 | 这些是只读或可重建外围职责,不能成为业务写源或核心前置。 |
| Runtime action choice、agent loop、LLM planning、orchestration、retry/recovery/checkpoint | 不做 | 这些属于 `L2-runtime` 的行动决策和执行主线。 |
| Capability identity/registry/descriptor/exposure/applicability 与 external provider control | 不做 | 这些属于 `L3-capability-hub` 和相应外部 owner。 |
| Effective authorization/approval/policy/high-risk taxonomy truth | 不做 | 正式 authority 尚待解析,本仓不能以风险声明或本地判断替代。 |
| Sandbox environment/run/capture/failure/handoff/cleanup/recovery truth | 不做 | 隔离执行事实属于 `L4-sandbox`。 |
| Bus publish/delivery/retry/DLQ/replay truth | 不做 | 传递 truth 属于 `L0-bus`,不能替代工具域事实。 |
| Observation store/projection/retention 与 evidence/signoff truth | 不做 | 观察和证据正文属于相应 owner,不是 Tool-domain audit。 |
| SDK client、多语言 wrapper、具体 builtin/MCP client/extras/images/marketplace/inventory | 不做 | 这些是客户端、实现库存、产品装配或分发职责。 |
| Raw prompt/request/capture/provider response、secret、credential 和外部正文保管 | 不做 | 这些是 forbidden body,不能借归一化、审计或诊断进入本仓。 |
| API、DTO、事件、存储、部署、测试和实施事实 | 不做 | 它们属于后续正式设计或真实实施证据,不是当前仓级语义职责。 |
| Tool risk/execution requirement 与 effective authorization | 易混淆职责 | 前者是 L2 合同语义,后者由正式外部 authority 决定。 |
| Body-free binding 与 capability registry/visibility/allowlist | 易混淆职责 | 本地 relation 不等于复制 registry,也不产生调用资格。 |
| Canonical invocation 与 Runtime request/plan/activity | 易混淆职责 | L2 只承载合同内工具行动语义,不拥有调用时机和编排正文。 |
| L2 handoff context 与 Sandbox receipt/run | 易混淆职责 | 表达交接意图或本地尝试不意味着 Sandbox 已受理、执行或清理。 |
| Normalized outcome 与 capture/provider response | 易混淆职责 | 外部执行材料只是来源,不能直接冒充本地工具语义结果。 |
| Tool-domain audit 与 Bus delivery audit/observation projection | 易混淆职责 | 三者分别解释工具、传递和观察事实。 |
| Safe material/local attempt 与 external delivery/observation status | 易混淆职责 | 本地准备 / 尝试可成立,但不得据此宣称材料已送达或已被观察。 |

### 5.2 做 / 不做清单

| 范围 | 清单 |
|---|---|
| 做 | Contract identity/definition/evolution;body-free capability relation;canonical invocation/acceptance/no-execution;execution requirement 与 formal authorization consumption judgment;conditional execution handoff semantics;normalized outcome;Tool-domain audit;safe material/local handoff gap;只读派生辅助。 |
| 不做 | Runtime 主线;Hub/provider registry;authorization decision;Sandbox execution;Bus delivery;Observability store;SDK/client/inventory/marketplace;forbidden body;当前架构层的协议、字段、部署与实现。 |

### 5.3 边界红线

1. 不得让显示名、实现、inventory、provider/capability identity、SDK wrapper 或调用方私有 schema 替代 tool identity/definition。
2. 不得复制 Hub registry/descriptor/exposure/applicability,回退本地 registry/allowlist/字符串猜测,或把 visibility 当 authorization。
3. 不得把工具风险声明、执行要求或本地验证判断升级为 allow/deny truth;正式结果不可验证时 fail closed。
4. 不得让 caller/carrier 形成第二 invocation/result/error 合同,不得吸收 Runtime plan/loop/recovery。
5. 不得让 sandbox-required 调用宿主直跑或静默降级,不得伪造 run/capture/receipt/cleanup。
6. 不得把 capture/provider response/delivery/observation/checkpoint 当 normalized outcome 或 ToolAuditEntry。
7. 不得让外部 handoff/consumer 失败回滚、覆盖或重新裁决本地 outcome/audit。
8. 不得保存或外发 forbidden body;safe material 四项门禁必须同时满足。
9. 不得把 Core 之外 sibling 变成 path/package dependency,不得把 pending/future seam 写成当前依赖。
10. 不得用旧 Python monorepo、Tool Registry、builtin/MCP/extras、三态 executor、SLA、事件、ADR 或上线结论自证当前职责。

### 5.4 职责与目标覆盖

| 架构目标 | 职责承接 | 非职责保护 |
|---|---|---|
| `AG-L2T-001~002` | 身份、定义、演进和合同辅助职责。 | Inventory/provider/client 不定义 truth。 |
| `AG-L2T-003` | Binding relation 与本地有效性判断。 | Hub registry/exposure 与 authorization 不转移。 |
| `AG-L2T-004` | Canonical invocation、受理与 no-execution。 | Runtime planning/recovery 与 carrier 私有合同不进入。 |
| `AG-L2T-005~006` | 执行要求、authorization 消费判断、handoff 语境和 source material 语义消费。 | Authorization decision 与 Sandbox execution truth 不进入。 |
| `AG-L2T-007~008` | Normalized outcome、Tool-domain audit、安全交接和外围只读消费。 | Delivery、observation、SDK 与正文不反写或成为前置。 |

---

## 6. 回填草稿

正式 01 第 4 章使用 §5.1 的三类职责表作为主表达,随后用 §5.3 列出边界红线。正文不得追加系统关系箭头、接口类型、数据分类或容器结构;这些内容分别留给 Step 4、7~9。

---

## 7. 待确认事项

本 Step 没有新增职责归属待确认项。Authorization authority 仍是 owner-pending,但“不由 L2-tools 拥有 effective decision”已经是稳定边界;这不妨碍进入系统上下文讨论。

---

## 8. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否覆盖做 / 不做 / 易混淆 | pass | 14 类做、9 类不做、7 类易混淆职责已收敛。 |
| 是否保护相邻 owner | pass | Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK / product owner 均保持外部。 |
| 是否有隐式行为红线 | pass | 10 条红线覆盖 identity、registry、authorization、Sandbox、outcome、handoff、正文和依赖。 |
| 是否混入上下文 / 数据 / 协议 | pass | 未画系统图,未定义数据矩阵、通信方式或实现。 |
| 是否继承旧职责 | pass | Inventory、MCP、extras、registry、executor、emitter 均为 historical material。 |
| 是否可进入 Step 4 | pass | 仓级职责和非职责足以确定系统上下文对象与输入 / 输出面。 |

```text
current_step = Step 3 responsibility_boundary completed
gate_status = pass
gate_reason = responsibilities, non-responsibilities, confusing boundaries and hard red lines are explicit without context or implementation leakage
next_allowed_action = create_and_complete_01_arch_step_04_system_context
formal_document_write_allowed = false
commit_required = false
```
