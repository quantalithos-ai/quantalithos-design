# L2-tools 需求 Step 11:数据需求与数据归属

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §11
> 本步原则: 只判断需求级数据项属于真相数据、快照数据、引用数据或禁止保存正文;不写字段、表、索引、事务、缓存、TTL、outbox、projection、repository、port、DDL 或物理保留策略。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 11 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 10 `业务规则与边界约束` |
| current_module | `data_ownership:completed` |
| next_allowed_action | 读取需求 SOP Step 12、需求规范 §4.12 与全局依赖裁剪规则,只创建 `00_req_step_12_interfaces_dependencies.md`。 |
| formal_write_status | `not_written` |
| blocker_status | `L2T-UP-001~009` 不阻塞数据类别归属;受影响的 authorization / Sandbox / Observability / Core / SDK 正文与 schema 仍不可宣称归 L2 或已闭口。 |

### 1.2 本步目标

按 `C-L2T-1~5` 逐节点识别本仓正式 truth、为稳定消费保留的快照、只建立关系的外部引用和绝不能保存的正文,并为每项数据给出需求级生命周期口径与 `FR-L2T-*` / `BR-L2T-*` 来源。

“由 L2 拥有工具语义 truth”不等于“所有正文必须长期持久化”。保留、脱敏、销毁和物理存储方式由后续设计 / 配置闭口;本步只固定 truth owner、关系类型和正文红线。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 与 Step 2 / 9 / 10 | done | 只允许 Step 11,正式 `00` 不可写。 |
| 2 | 读取 SOP Step 11、规范 §4.11 和参考产物 | done | 固定四类数据和四列正式表。 |
| 3 | C-L2T-1 先思考再分类 | done | Identity / definition / evolution truth、派生摘要、来源 ref 和库存正文边界收敛。 |
| 4 | C-L2T-2 先思考再分类 | done | Binding 分类 / relation / 校验 truth、Hub 摘要 / ref / 正文边界收敛。 |
| 5 | C-L2T-3 先思考再分类 | done | Invocation / 受理 / 锚定 truth、调用方摘要 / Runtime ref / 私有正文边界收敛。 |
| 6 | C-L2T-4 先思考再分类 | done | 执行要求 / 前置消费 / handoff truth、authorization / Sandbox 摘要 / ref / 正文边界收敛。 |
| 7 | C-L2T-5 先思考再分类 | done | Result / error / audit / safe handoff truth、外部状态摘要 / ref / 敏感正文边界收敛。 |
| 8 | 完成数据与 FR / BR 映射和外围数据判断 | done | 17 项核心 FR 无数据缺口;外围只消费派生快照。 |
| 9 | 完成四类、重复 truth、引用与禁止正文审计 | done | 无未分类、无同一数据多 owner、无外部正文回流。 |
| 10 | Historical material、blocker、自检与停审 | done | 允许进入 Step 12;正式 `00` 仍不写。 |

---

## 2. 本步输入

### 2.1 输入与读取结论

| 输入 | 已读取结论 | 本步约束 |
|---|---|---|
| `00_req_step_02_position_boundary.md` | 本仓拥有 identity、definition、invocation、result / error 和 tool-domain audit 语义。 | 真相数据只围绕本仓语义事实,不吸收相邻仓正文。 |
| `00_req_step_09_functional_requirements.md` | 17 项核心 FR 和 6 项外围 FR 已固定。 | 每项 FR 必须有数据归属承接;外围派生材料不成为 truth。 |
| `00_req_step_10_business_rules_boundaries.md` | 42 条核心规则和 1 条外围规则已固定 owner / 禁止 / 显式变化边界。 | 数据归属必须落实 binding、authorization、Sandbox、safe handoff 和敏感正文红线。 |
| 需求 SOP Step 11 | 先判定四类,再写归属、生命周期和 FR / BR 映射。 | 每个节点停审并做跨能力重复 truth 审计。 |
| 需求规范 §4.11 | 正式表固定为数据项、数据类型、归属说明、生命周期口径。 | 数据类型只使用规范四类;不把映射塞入正式固定表。 |
| 上游正式文档 | Hub、Sandbox、Bus、Observability、Core 和 SDK 各有独立 truth。 | 外部对象只可作为快照、引用或禁止正文,不得迁移 owner。 |
| 已完成项目 Step 11 | Capability Hub 展示 body-free relation 和外部正文红线;Artifact 展示逐节点归属与来源门禁。 | 采用同等粒度,不复制其它领域数据项。 |
| README 与旧正式链 | 旧 invocation DB、history / replay、provider body、事件 payload 和具体库存为历史线索。 | 独立分类后再做 historical material 差异审计。 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据由本仓拥有真相? | 稳定工具身份、正式定义及演进、binding 分类 / relation / L2 校验事实、canonical invocation 及受理 / 锚定、L2 执行要求 / 前置消费 / handoff 语境、normalized result / error、ToolAuditEntry,以及 safe handoff 准备、提交尝试、降级与已知缺口事实。 |
| 哪些数据只是快照? | 契约浏览 / 索引摘要、Hub safe summary、调用方安全语境摘要、authorization / Sandbox 安全摘要、最小 execution source 摘要和外部交接状态摘要。 |
| 哪些数据只是引用? | 定义来源 / 正式评审、capability、Runtime actor / work / trace、authorization / policy / approval、Sandbox request / run / capture / failure / handoff、Bus delivery 和 Observability material 的正式引用。 |
| 哪些内容绝不能保存正文? | 实现源码 / 库存 / provider / secret、Hub registry / descriptor / exposure、raw prompt / plan / loop、policy DSL / approval workflow / Sandbox execution、raw capture / provider body、Bus history / DLQ / replay、Observability store 和真实 evidence / signoff 正文。 |
| 生命周期如何表达? | Truth 随正式建立 / 变化 / 终止形成 L2 语义生命周期;快照随 source 更新且可重建;ref 随关系建立 / 变化 / 失效变化;禁止正文不进入 L2 生命周期。 |
| 是否所有数据都有来源? | 是。每项数据均能回指 FR、BR 或 Step 2 / 上游 owner 边界。 |
| 是否有功能缺少数据结论? | 否。`FR-L2T-001~017` 均有 truth 与适用 snapshot / ref / forbidden body 承接。 |
| 是否有孤儿数据? | 否。外围快照也回指外围 FR 与 `BR-L2T-E01`。 |

---

## 4. 当前文档问题诊断

旧 README 与旧正式链把需求级数据语义同字段、数据库、history / replay、provider 正文及外部存储混写,无法直接证明当前五节点的数据 owner。Step 10 已固定的 owner、forbidden body 和显式变化边界要求本步重新分类;详细 historical material 差异保留在 §7.6。

---

## 5. 改动前后对比

| 维度 | 改动前 | 当前校准后 |
|---|---|---|
| 数据类型 | 真相、缓存、调用正文和外部材料混杂 | 严格使用真相数据、快照数据、引用数据、禁止保存正文四类。 |
| Truth owner | 本地 registry / allowlist、Sandbox capture 与 observation store 可能回流 | L2 只拥有工具语义与自身消费 / handoff 事实,相邻本体保持外部 owner。 |
| 实现承诺 | 旧字段、表、history、replay 和 retention 容易被误当需求 | 只固定归属与生命周期口径,字段和物理保留全部后移。 |

---

## 6. 设计取舍

### 6.1 C-L2T-1 身份、定义与演进数据

| 类别 | 结论 |
|---|---|
| 真相 | Stable tool identity、formal tool definition、定义演进 / 兼容 / 退役追溯。 |
| 快照 | 搜索、浏览、派生索引和兼容检查摘要,均可重建。 |
| 引用 | 定义来源、正式评审和共享契约候选引用。 |
| 禁止正文 | 实现源码、builtin 库存、SDK 包装、provider 定义 / secret 和产品装配正文。 |
| 取舍 | 不写 ToolId 字段、definition schema、版本号、索引结构或持久化方式。 |

### 6.2 C-L2T-2 外部能力关联数据

| 类别 | 结论 |
|---|---|
| 真相 | Bound / unbound 分类、body-free tool-capability binding relation、L2 自身校验 / stale / 失效 / 缺口事实。 |
| 快照 | Hub controlled consumer safe summary,只供稳定判断。 |
| 引用 | Capability identity、descriptor、formal exposure / applicability 的正式引用。 |
| 禁止正文 | Hub registry / descriptor / exposure 正文、本地 capability allowlist、provider route / quota / cost / secret。 |
| 取舍 | Relation truth 归 L2,关系另一端 capability truth 仍归 Hub;二者不可合并。 |

### 6.3 C-L2T-3 规范调用数据

| 类别 | 结论 |
|---|---|
| 真相 | Canonical `ToolInvocation` 的合同归一化输入语义、受理 / 执行前拒绝 / no-execution 事实、invocation 与 identity / definition 锚定事实。 |
| 快照 | 调用方安全语境和解析时必要定义摘要;均按本次 invocation 的消费时点锚定。 |
| 引用 | Runtime request、actor、work、trace、correlation 等正式引用。 |
| 禁止正文 | Raw prompt、conversation、caller / transport request body、合同外输入、secret、agent plan、loop、checkpoint、retry / recovery 和 Runtime 私有状态正文。 |
| 取舍 | Invocation 属于工具语义 truth,但本步不承诺保存所有原始调用正文或长期保留。 |

### 6.4 C-L2T-4 执行前置与隔离交接数据

| 类别 | 结论 |
|---|---|
| 真相 | L2 执行要求判断、authorization 来源可验证性 / 消费前置满足 / fail-closed 事实、执行承载要求和 L2 handoff 语境。 |
| 快照 | Authorization / policy safe summary、Sandbox handoff / execution material 消费摘要;均按本次 invocation 的消费时点锚定。 |
| 引用 | Policy / approval / authorization owner 与结果、Sandbox request / run / capture / failure / handoff 正式引用。 |
| 禁止正文 | Policy DSL、approval workflow、allowlist、高风险 taxonomy、Sandbox environment / run / capture / cleanup 正文。 |
| 取舍 | L2 拥有“如何消费外部结论”的自身事实,不拥有 authorization decision 或 execution truth。 |

### 6.5 C-L2T-5 Outcome、审计与安全交接数据

| 类别 | 结论 |
|---|---|
| 真相 | Normalized tool result、normalized tool error / no-execution outcome、ToolAuditEntry、安全交接准备 / 最小化 / 脱敏判断、本地提交尝试 / 降级 / 已知缺口事实。 |
| 快照 | 外部 delivery / observation 状态摘要和与 outcome 绑定的最小 execution source 摘要。 |
| 引用 | Sandbox source、Bus delivery 和 Observability material 正式引用。 |
| 禁止正文 | Raw capture / provider response、secret / credential / raw prompt、Bus history / DLQ / replay、Observability store、真实 evidence / signoff;归一化不得使 raw body 获准保存或外发。 |
| 取舍 | Result / error 是工具语义 truth;raw material 和外部传递 / 观察 truth 不能成为副本。 |

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `DR-L2T-001` 稳定工具身份 | 真相数据 | 稳定工具身份由 `L2-tools` 拥有正式真相。 | 从正式建立到显式更正或退役,形成本仓工具身份生命周期。 |
| `DR-L2T-002` 正式工具定义 | 真相数据 | 正式工具定义由 `L2-tools` 拥有正式真相。 | 随正式建立、调整、替换或退役显式变化。 |
| `DR-L2T-003` 定义演进、兼容影响与退役追溯事实 | 真相数据 | 定义变化及其影响由 `L2-tools` 拥有正式真相。 | 随每次正式变化形成,不得被后续变化隐式覆盖。 |
| `DR-L2T-004` 契约搜索、浏览、派生索引与兼容摘要 | 快照数据 | 正式合同真相不由这些派生材料拥有,本仓只为稳定消费保留快照。 | 可随正式合同变化更新或重建,不形成独立 truth 生命周期。 |
| `DR-L2T-005` 定义来源、正式评审与共享契约候选引用 | 引用数据 | 本仓只保存对正式来源 / 评审 / 候选契约的引用关系,不拥有其正文。 | 随引用建立、变化或失效而变化,不负责外部正文生命周期。 |
| `DR-L2T-006` 实现源码、库存、SDK / provider / secret 与产品装配正文 | 禁止保存正文 | 这些正文不属于工具身份或定义真相范围,本仓不得保存其正文。 | 不进入本仓工具合同生命周期。 |
| `DR-L2T-007` Capability-bound / unbound 分类 | 真相数据 | 工具外部关联分类属于 `L2-tools` 工具合同关系 truth。 | 随工具定义或关联要求的正式变化显式变化。 |
| `DR-L2T-008` Body-free tool-capability binding relation | 真相数据 | 本地工具与外部 capability 的关系由 `L2-tools` 拥有,但关系另一端 truth 不属于本仓。 | 从关系建立到替换、失效或终止形成关系生命周期。 |
| `DR-L2T-009` Binding 校验、陈旧、冲突、失效与缺口事实 | 真相数据 | `L2-tools` 拥有自身校验和缺口判断 truth,不拥有 Hub truth。 | 随关系校验和正式外部变化线索显式形成或更新。 |
| `DR-L2T-010` Hub controlled consumer safe summary | 快照数据 | Hub 正式真相不属于本仓,本仓只为受控判断保留安全摘要。 | 随上游正式 truth 更新或失效,不形成外部能力生命周期。 |
| `DR-L2T-011` Capability identity / descriptor / exposure / applicability 引用 | 引用数据 | 本仓只保存外部正式 capability 事实引用,不拥有其正文。 | 随 binding 建立、变化或失效而变化,不负责外部对象生命周期。 |
| `DR-L2T-012` Hub 正文、本地 capability allowlist 与 provider control 正文 | 禁止保存正文 | Registry、descriptor、exposure、allowlist、route、quota、cost 和 secret 正文不属于本仓,本仓不得保存其正文。 | 不进入本仓 binding 生命周期。 |
| `DR-L2T-013` Canonical `ToolInvocation` 合同归一化语义事实 | 真相数据 | 正式合同内被归一化的工具调用输入语义由 `L2-tools` 拥有 truth;raw caller / transport request body 不属于该 truth。 | 从规范形成到显式终态保持可解释关联;物理保留口径后移。 |
| `DR-L2T-014` 调用受理与执行前决策事实 | 真相数据 | 调用受理、执行前拒绝或等待前置的决策事实由 `L2-tools` 拥有;消费者可见 no-execution 终态语义由 `DR-L2T-028` 表达。 | 在真实执行前显式形成,不得由执行材料或消费者终态反推。 |
| `DR-L2T-015` Invocation 与 identity / definition 合同锚定事实 | 真相数据 | 调用的合同锚定关系由 `L2-tools` 拥有正式 truth。 | 随 invocation 形成并在其语义生命周期内保持可解释。 |
| `DR-L2T-016` 调用方安全语境与解析摘要 | 快照数据 | 调用方 truth 不属于本仓,本仓只保留解释本次 invocation 所需的安全摘要。 | 按本次 invocation 的消费时点锚定;后续来源变化不得原地改写,重评必须形成新快照或显式缺口。 |
| `DR-L2T-017` Runtime request / actor / work / trace / correlation 引用 | 引用数据 | 本仓只保存外部运行与关联对象的正式引用,不拥有其正文。 | 随调用关系建立、变化或失效而变化,不负责外部对象生命周期。 |
| `DR-L2T-018` Raw prompt / caller request / transport /合同外输入 / Runtime 私有正文 | 禁止保存正文 | Raw prompt、caller / transport request body、合同外输入、secret、conversation、plan、loop、checkpoint 和 recovery 正文不属于工具调用语义 truth,本仓不得保存其正文。 | 不进入本仓 invocation 生命周期;合同归一化不得使 raw body 获准保存。 |
| `DR-L2T-019` L2 执行要求判断事实 | 真相数据 | 工具域执行要求判断由 `L2-tools` 拥有自身 truth。 | 随正式定义、调用和适用关系判断形成或显式失效。 |
| `DR-L2T-020` Authorization 来源可验证性、消费前置满足与 fail-closed 事实 | 真相数据 | `L2-tools` 只拥有自身来源可验证性和消费前置判断 truth,不判断或拥有 authorization decision 的实质有效性。 | 随正式外部结论的消费时点显式形成;后续变化需重评为新事实或显式缺口。 |
| `DR-L2T-021` 执行承载要求与 L2 handoff 语境 | 真相数据 | 工具域承载要求和本仓交接语境由 `L2-tools` 拥有,不等于外部已受理或执行。 | 随适用前置成立、变化、拒绝或交接缺口显式变化。 |
| `DR-L2T-022` Authorization / policy safe summary | 快照数据 | 治理 truth 不属于本仓,本仓只为本次 invocation 的前置判断保留允许的安全摘要。 | 按消费时点锚定;后续来源变化不得原地改写,重评形成新快照 / 判断或显式缺口。 |
| `DR-L2T-023` Sandbox execution capability / handoff readiness 安全摘要 | 快照数据 | Sandbox execution truth 不属于本仓,本仓只为本次 invocation 的执行前承载与 handoff readiness 判断保留安全摘要;outcome 来源摘要由 `DR-L2T-032` 表达。 | 按执行前消费时点锚定;后续来源变化不得原地改写,重新判断形成新快照或显式缺口。 |
| `DR-L2T-024` Policy / approval / authorization owner 与结果引用 | 引用数据 | 本仓只保存正式治理 / 授权对象与结论引用,不拥有其正文或裁决生命周期。 | 随前置关系建立、变化或失效而变化。 |
| `DR-L2T-025` Sandbox request / run / capture / failure / handoff 引用 | 引用数据 | 本仓只保存与特定 invocation / outcome 关联的正式 Sandbox execution source 引用,不拥有执行正文。 | 随交接关系建立并按消费时点锚定;来源变化不得原地改写既有 outcome 的引用,只能形成新引用或缺口。 |
| `DR-L2T-026` Policy / approval / allowlist / taxonomy 与 Sandbox execution 正文 | 禁止保存正文 | 治理流程、风险分类及 Sandbox environment / run / capture / cleanup 正文不属于本仓,本仓不得保存其正文。 | 不进入本仓执行前置或 handoff 生命周期。 |
| `DR-L2T-027` Normalized tool result | 真相数据 | 工具语义成功结果由 `L2-tools` 拥有正式 truth。 | 随 invocation 的可信成功终态形成;保留与销毁策略后移。 |
| `DR-L2T-028` Normalized tool error 与消费者可见无执行终态 | 真相数据 | 工具语义错误和面向消费者的无执行终态由 `L2-tools` 拥有,并锚定 `DR-L2T-014` 的执行前决策事实。 | 随失败、拒绝或保守收束形成,与执行前决策及外部失败保持可关联分层。 |
| `DR-L2T-029` `ToolAuditEntry` / Tool-domain audit | 真相数据 | 工具域审计由 `L2-tools` 拥有正式 truth,但不构成 observation store,也不得包含 raw / secret 正文。 | 随合同关键变化、调用受理和终态形成可追溯生命周期。 |
| `DR-L2T-030` 安全交接准备、提交尝试、降级与已知缺口事实 | 真相数据 | `L2-tools` 拥有最小化 / 脱敏判断以及本地提交尝试、降级和缺口的自身 truth,不拥有外部 delivery / observation 结果。 | 随交接需求和本地尝试显式形成;后续尝试或降级形成新事实,不得覆盖既有记录。 |
| `DR-L2T-031` 外部 delivery / observation 状态与缺口摘要 | 快照数据 | Bus / Observability truth 不属于本仓,本仓只保留与特定本地 handoff 尝试关联的交接状态安全摘要。 | 按外部状态消费时点锚定;后续变化形成新快照或显式缺口,不原地改写既有本地事实。 |
| `DR-L2T-032` Outcome-bound 最小 execution source 摘要 | 快照数据 | Sandbox source truth 不属于本仓,本仓只为特定 normalized result / error 的解释保留合同允许的最小摘要。 | 与对应 outcome 及消费时点绑定,不得因上游变化原地改写;重建形成新派生快照或显式缺口。 |
| `DR-L2T-033` Bus delivery / Observability material 引用 | 引用数据 | 本仓只保存外部传递和观察材料的正式引用,不拥有正文;Sandbox source ref 统一由 `DR-L2T-025` 表达。 | 随外部交接关系建立并按消费时点锚定;变化形成新引用或显式缺口。 |
| `DR-L2T-034` Raw capture / provider response / secret / Bus history / Observability store / evidence 正文 | 禁止保存正文 | Raw 执行正文、敏感正文、传递 / 观察存储和真实 evidence / signoff 不属于本仓 truth,本仓不得保存其正文;归一化只能产生另行受约束的安全工具语义材料。 | 不进入本仓 outcome、audit 或 safe handoff 生命周期。 |

### 7.2 数据项与功能 / 规则映射

| 数据项 | 支撑的功能需求 | 主要规则来源 | 能力节点 |
|---|---|---|---|
| `DR-L2T-001` | `FR-L2T-001`;`FR-L2T-016` | `BR-L2T-001`;`BR-L2T-005`;`BR-L2T-036` | `C-L2T-1` / `C-L2T-5` |
| `DR-L2T-002` | `FR-L2T-002`;`FR-L2T-003`;`FR-L2T-009`;`FR-L2T-010`;`FR-L2T-016` | `BR-L2T-002~006`;`BR-L2T-021`;`BR-L2T-036` | `C-L2T-1` / `C-L2T-5` |
| `DR-L2T-003` | `FR-L2T-003`;`FR-L2T-016` | `BR-L2T-005~007`;`BR-L2T-021`;`BR-L2T-036` | `C-L2T-1` / `C-L2T-5` |
| `DR-L2T-004` | `FR-L2T-E01~E03` | `BR-L2T-007`;`BR-L2T-E01` | 外围增强 |
| `DR-L2T-005` | `FR-L2T-001~003` | `BR-L2T-002~006` | `C-L2T-1` |
| `DR-L2T-006` | `FR-L2T-001~003`;`FR-L2T-E05` | `BR-L2T-008`;`BR-L2T-039`;`BR-L2T-E01` | `C-L2T-1` / 外围增强 |
| `DR-L2T-007` | `FR-L2T-004`;`FR-L2T-010` | `BR-L2T-009`;`BR-L2T-012`;`BR-L2T-023` | `C-L2T-2` / `C-L2T-4` |
| `DR-L2T-008` | `FR-L2T-005`;`FR-L2T-010` | `BR-L2T-010~012`;`BR-L2T-014`;`BR-L2T-023` | `C-L2T-2` / `C-L2T-4` |
| `DR-L2T-009` | `FR-L2T-006`;`FR-L2T-010` | `BR-L2T-013~015`;`BR-L2T-023` | `C-L2T-2` / `C-L2T-4` |
| `DR-L2T-010` | `FR-L2T-005`;`FR-L2T-006`;`FR-L2T-010` | `BR-L2T-011~015`;`BR-L2T-023` | `C-L2T-2` / `C-L2T-4` |
| `DR-L2T-011` | `FR-L2T-005`;`FR-L2T-006`;`FR-L2T-010` | `BR-L2T-010~015`;`BR-L2T-023` | `C-L2T-2` / `C-L2T-4` |
| `DR-L2T-012` | `FR-L2T-004~006` | `BR-L2T-011`;`BR-L2T-013`;`BR-L2T-015` | `C-L2T-2` |
| `DR-L2T-013` | `FR-L2T-007~010`;`FR-L2T-012~016` | `BR-L2T-016~018`;`BR-L2T-021`;`BR-L2T-027`;`BR-L2T-032`;`BR-L2T-036` | `C-L2T-3~5` |
| `DR-L2T-014` | `FR-L2T-008`;`FR-L2T-015`;`FR-L2T-016` | `BR-L2T-019~020`;`BR-L2T-033`;`BR-L2T-036` | `C-L2T-3` / `C-L2T-5` |
| `DR-L2T-015` | `FR-L2T-007~010`;`FR-L2T-012~016` | `BR-L2T-016`;`BR-L2T-021`;`BR-L2T-032`;`BR-L2T-036` | `C-L2T-3~5` |
| `DR-L2T-016` | `FR-L2T-007~009` | `BR-L2T-018`;`BR-L2T-022` | `C-L2T-3` |
| `DR-L2T-017` | `FR-L2T-007~009`;`FR-L2T-016` | `BR-L2T-016`;`BR-L2T-022`;`BR-L2T-036` | `C-L2T-3` / `C-L2T-5` |
| `DR-L2T-018` | `FR-L2T-007~009` | `BR-L2T-018`;`BR-L2T-022`;`BR-L2T-039` | `C-L2T-3` |
| `DR-L2T-019` | `FR-L2T-010`;`FR-L2T-012` | `BR-L2T-023`;`BR-L2T-027` | `C-L2T-4` |
| `DR-L2T-020` | `FR-L2T-011`;`FR-L2T-012`;`FR-L2T-015`;`FR-L2T-016` | `BR-L2T-024~025`;`BR-L2T-036` | `C-L2T-4` / `C-L2T-5` |
| `DR-L2T-021` | `FR-L2T-012`;`FR-L2T-013` | `BR-L2T-026~029` | `C-L2T-4` |
| `DR-L2T-022` | `FR-L2T-011`;`FR-L2T-012` | `BR-L2T-024~025` | `C-L2T-4` |
| `DR-L2T-023` | `FR-L2T-012`;`FR-L2T-013` | `BR-L2T-026~030` | `C-L2T-4` |
| `DR-L2T-024` | `FR-L2T-011`;`FR-L2T-012` | `BR-L2T-024~025` | `C-L2T-4` |
| `DR-L2T-025` | `FR-L2T-013~016` | `BR-L2T-028~030`;`BR-L2T-036` | `C-L2T-4` / `C-L2T-5` |
| `DR-L2T-026` | `FR-L2T-010~013` | `BR-L2T-023~031`;`BR-L2T-039` | `C-L2T-4` |
| `DR-L2T-027` | `FR-L2T-014`;`FR-L2T-016`;`FR-L2T-017` | `BR-L2T-032~036`;`BR-L2T-038` | `C-L2T-5` |
| `DR-L2T-028` | `FR-L2T-015~017` | `BR-L2T-019~020`;`BR-L2T-025`;`BR-L2T-032~036`;`BR-L2T-038` | `C-L2T-5` |
| `DR-L2T-029` | `FR-L2T-016`;`FR-L2T-017` | `BR-L2T-035~039`;`BR-L2T-042` | `C-L2T-5` |
| `DR-L2T-030` | `FR-L2T-017` | `BR-L2T-038~042` | `C-L2T-5` |
| `DR-L2T-031` | `FR-L2T-017`;`FR-L2T-E04` | `BR-L2T-035`;`BR-L2T-040~041`;`BR-L2T-E01` | `C-L2T-5` / 外围增强 |
| `DR-L2T-032` | `FR-L2T-014~016` | `BR-L2T-030`;`BR-L2T-032~036` | `C-L2T-5` |
| `DR-L2T-033` | `FR-L2T-016`;`FR-L2T-017` | `BR-L2T-035~036`;`BR-L2T-040` | `C-L2T-5` |
| `DR-L2T-034` | `FR-L2T-014~017`;`FR-L2T-E04~E06` | `BR-L2T-034`;`BR-L2T-038~042`;`BR-L2T-E01` | `C-L2T-5` / 外围增强 |

### 7.3 功能需求数据覆盖

| 功能需求 | 主要数据项 |
|---|---|
| `FR-L2T-001` | `DR-L2T-001`;`DR-L2T-005`;`DR-L2T-006` |
| `FR-L2T-002` | `DR-L2T-002`;`DR-L2T-005`;`DR-L2T-006` |
| `FR-L2T-003` | `DR-L2T-002`;`DR-L2T-003`;`DR-L2T-005`;`DR-L2T-006` |
| `FR-L2T-004` | `DR-L2T-007`;`DR-L2T-012` |
| `FR-L2T-005` | `DR-L2T-008`;`DR-L2T-010~012` |
| `FR-L2T-006` | `DR-L2T-009~012` |
| `FR-L2T-007` | `DR-L2T-013`;`DR-L2T-015~018` |
| `FR-L2T-008` | `DR-L2T-013~018` |
| `FR-L2T-009` | `DR-L2T-002`;`DR-L2T-013`;`DR-L2T-015~018` |
| `FR-L2T-010` | `DR-L2T-002`;`DR-L2T-007~011`;`DR-L2T-013`;`DR-L2T-015`;`DR-L2T-019`;`DR-L2T-026` |
| `FR-L2T-011` | `DR-L2T-020`;`DR-L2T-022`;`DR-L2T-024`;`DR-L2T-026` |
| `FR-L2T-012` | `DR-L2T-013`;`DR-L2T-015`;`DR-L2T-019~024`;`DR-L2T-026` |
| `FR-L2T-013` | `DR-L2T-013`;`DR-L2T-015`;`DR-L2T-021`;`DR-L2T-023`;`DR-L2T-025`;`DR-L2T-026` |
| `FR-L2T-014` | `DR-L2T-013`;`DR-L2T-015`;`DR-L2T-025`;`DR-L2T-027`;`DR-L2T-032`;`DR-L2T-034` |
| `FR-L2T-015` | `DR-L2T-013~015`;`DR-L2T-020`;`DR-L2T-025`;`DR-L2T-028`;`DR-L2T-032`;`DR-L2T-034` |
| `FR-L2T-016` | `DR-L2T-001~003`;`DR-L2T-013~015`;`DR-L2T-017`;`DR-L2T-020`;`DR-L2T-025`;`DR-L2T-027~029`;`DR-L2T-032~034` |
| `FR-L2T-017` | `DR-L2T-027~031`;`DR-L2T-033`;`DR-L2T-034` |
| `FR-L2T-E01` | `DR-L2T-004` 和适用核心 truth 的只读消费,不新增外围 truth。 |
| `FR-L2T-E02` | `DR-L2T-004` 和适用核心 truth 的只读消费,不新增外围 truth。 |
| `FR-L2T-E03` | `DR-L2T-004` 和适用核心 truth 的只读消费,不新增外围 truth。 |
| `FR-L2T-E04` | `DR-L2T-031`;`DR-L2T-034` 和适用核心 truth 的只读消费,不新增外围 truth。 |
| `FR-L2T-E05` | `DR-L2T-006`;`DR-L2T-034` 和适用核心 truth 的只读消费,不新增外围 truth。 |
| `FR-L2T-E06` | `DR-L2T-034` 和适用核心 truth 的只读消费,不新增外围 truth。 |

### 7.4 能力级数据停审

| 节点 | 数据范围 | 停审结论 |
|---|---|---|
| `C-L2T-1` | `DR-L2T-001~006` | pass:身份 / 定义 truth、派生摘要、正式来源 ref 与实现 / 库存正文边界完整。 |
| `C-L2T-2` | `DR-L2T-007~012` | pass:binding truth、Hub 摘要 / ref / 正文边界完整,未形成第二 registry。 |
| `C-L2T-3` | `DR-L2T-013~018` | pass:invocation truth、调用方摘要 / ref 与 Runtime 正文边界完整。 |
| `C-L2T-4` | `DR-L2T-019~026` | pass:L2 消费 truth 与外部 authorization / Sandbox truth 分层;约束为 `L2T-UP-001~004` 开放。 |
| `C-L2T-5` | `DR-L2T-027~034` | pass:outcome / audit / handoff truth 与外部摘要 / ref / 禁止正文分层;约束为 `L2T-UP-004~008` 开放。 |

### 7.5 跨能力数据审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 四类数据是否齐全 | 是 | 真相、快照、引用、禁止保存正文均有明确数据项。 |
| 未分类数据 | 无 | 34 项均使用规范四类之一。 |
| 同一数据多 truth owner | 无 | Relation / consumption judgment 属 L2;Hub、authorization、Sandbox、Bus、Observability 的本体 truth 仍是 ref / snapshot / forbidden body。 |
| 核心 FR 数据缺口 | 无 | `FR-L2T-001~017` 均有主要数据项映射。 |
| 外围 FR 新增 truth | 无 | 外围增强只读消费核心 truth 或可重建快照。 |
| 孤儿数据 | 无 | 每项数据均有 FR、BR 或 Step 2 边界来源。 |
| 禁止正文遗漏 | 未发现 | Runtime、Hub、governance、Sandbox、Bus、Observability、SDK / provider、库存和 evidence 正文均覆盖。 |
| 实现结构混入 | 无 | 未写字段、表、索引、事务、缓存、TTL、outbox、projection、repo、port 或 DDL。 |

---

### 7.6 Historical material 后置审计

| 旧数据线索 | 当前处理 |
|---|---|
| `ToolDefinition` / `ToolInvocation` / `ToolResult` 旧字段表 | 保留需求级语义类别,不继承字段、类型、表或状态枚举。 |
| 本地 registry / Hub allowlist | 与 Hub / authorization owner 冲突,归入禁止正文。 |
| Invocation DB、history、replay、retention | 不因旧持久化设想推导需求;Runtime / Bus / Observability truth 和物理保留后移。 |
| Sandbox capture / failure 正文 | 只保留 safe summary / ref;正文不成为本仓 result。 |
| 三类事件 payload 与 audit log store | 不继承事件 schema 或观察存储;只保留 ToolAuditEntry truth 和 safe handoff 判断。 |
| Provider response / secret / MCP 配置 | Raw 正文和 provider control 不归本仓;归一化不得使 raw body 获准保存或外发。 |
| Builtin / extras / images / marketplace 库存 | 具体库存 / 装配正文不定义合同 truth。 |
| 真实 evidence、run_id、验收签署 | 不作为当前数据事实或成立证据。 |

---

## 8. 回填草稿

> Step 17 应装配 §7.1 的固定四列表及“truth ownership 不等于长期持久化”的短说明。§7.2~7.6 保留在 calibration 供追溯,不重复放入正式数据表。

正式章节必须同时包含四类数据,尤其不能省略禁止保存正文。表中不得加入字段、表名、索引、缓存、保留期或架构组件。

---

## 9. 待确认事项

### 9.1 Blocker 判定

| Blocker | 是否阻塞 Step 11 | 数据归属约束 |
|---|---|---|
| `L2T-UP-001/002` | 否 | Authorization 只以 `DR-L2T-022/024` 摘要 / ref 进入;L2 仅拥有 `DR-L2T-020` 消费判断 truth。 |
| `L2T-UP-003/004` | 否 | Sandbox 只以 `DR-L2T-023/025/032` 摘要 / ref 进入;mapping / receipt / cleanup 正文不伪造。 |
| `L2T-UP-005~007` | 否 | Observability 仅有 `DR-L2T-031/033` 摘要 / ref;不声明 producer、route 或 readiness。 |
| `L2T-UP-008` | 否 | `DR-L2T-005` 仅保留共享契约候选引用;不宣称 Core 已有 Tools-specific schema。 |
| `L2T-UP-009` | 否 | SDK 包装正文属于 `DR-L2T-006` 禁止进入合同 truth;客户端说明只是外围消费材料。 |

结论:未发现新增上游 blocker。既有缺口不阻塞需求级数据归属,但不得据此推断跨仓字段、物理存储或可执行集成已闭口。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 四类数据是否完整且使用规范类型名 | pass |
| 每项数据是否有归属判断和生命周期口径 | pass |
| 每项数据是否能回指 FR / BR / 边界 | pass |
| 每项核心及外围 FR 是否有数据承接 | pass |
| 是否区分 L2 relation / consumption truth 与外部本体 truth | pass |
| 是否明确 truth ownership 不等于长期保存全部正文 | pass |
| 是否完成重复 truth、孤儿和禁止正文审计 | pass |
| 是否未写字段、表、索引、事务、缓存、TTL 或实现结构 | pass |
| 是否未关闭 blocker 或伪造 schema / route / evidence | pass |
| 是否未修改正式 `00-需求文档.md` | pass |

### 10.2 模块状态

| 模块 | 状态 | gate_status |
|---|---|---|
| capability_data_reasoning | done | pass |
| four_type_ownership | done | pass |
| fr_br_mapping | done | pass |
| cross_data_boundary_audit | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_12_interfaces_dependencies.md
commit_required = false
```
