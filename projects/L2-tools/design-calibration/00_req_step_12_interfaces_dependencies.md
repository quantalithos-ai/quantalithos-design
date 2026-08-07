# L2-tools 需求 Step 12:接口与依赖

> Step 状态: completed_stop_review
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §12
> 本步原则: 只说明需求级能力接口面与外部依赖边界;不写 API path、HTTP / RPC / gRPC 方法、Command / Query 名、DTO / JSON / proto、字段、事件名 / schema、handler、service、repository、outbox、重试、fallback、relay 或事务。

---

## 1. Step 状态与 Step 内计划

### 1.1 Step 状态

| 字段 | 值 |
|---|---|
| step | Step 12 |
| status | `completed_stop_review` |
| gate_status | `pass` |
| previous_step | Step 11 `数据需求与数据归属` |
| current_module | `interfaces_dependencies:completed` |
| next_allowed_action | 读取需求 SOP Step 13 与需求规范 §4.13,只创建 `00_req_step_13_non_functional_requirements.md`。 |
| formal_write_status | `not_written` |
| blocker_status | 需求级能力边界已收敛;`L2T-UP-001~009` 继续阻塞受影响协议、route、shared schema 和联调 readiness 定稿。 |

### 1.2 本步目标

按 `C-L2T-1~5` 逐节点明确本仓对外体现的查询、变更、事件输出、事件输入和后台任务能力面,以及本仓消费或提供的定义来源、治理结论、下游消费和外部能力边界。所有接口与依赖必须回指 Step 9 功能、承接 Step 6 裁剪结果和 Step 11 数据归属。

本步中的“接口”是能力面,不是协议或应用服务命名;“事件输入 / 输出”只表示异步能力边界,不承诺事件名称、payload、topic、producer、route、delivery 或 replay 语义。

### 1.3 Step 内计划

| 序号 | 动作 | 状态 | 输出 / 门禁 |
|---:|---|---|---|
| 1 | 恢复 ledger / flow 与 Step 6 / 9~11 | done | 只允许 Step 12,正式 `00` 不可写。 |
| 2 | 读取 SOP Step 12、规范 §4.12、全局裁剪规则和参考产物 | done | 固定五类接口、四类能力依赖和三类全局依赖;非当前项目边只允许标记为“不适用”。 |
| 3 | C-L2T-1 先思考再写接口 / 依赖 | done | Identity / definition 变更、查询、变化输出与 Core Tools-specific contract 候选边界收敛。 |
| 4 | C-L2T-2 先思考再写接口 / 依赖 | done | Binding 变更、读取、对账、变化输出与 Hub 边界收敛。 |
| 5 | C-L2T-3 先思考再写接口 / 依赖 | done | Invocation intake、受理 / 拒绝、合同读取与 Runtime 消费边界收敛。 |
| 6 | C-L2T-4 先思考再写接口 / 依赖 | done | 执行要求、authorization 输入、条件交接、execution material 消费边界收敛。 |
| 7 | C-L2T-5 先思考再写接口 / 依赖 | done | Outcome / audit 查询、safe material 输出、handoff degradation 与 Bus / Observability 边界收敛。 |
| 8 | 收敛外围接口与 SDK 候选边界 | done | 外围只改善维护 / 诊断 / 消费;SDK 仅保留未来边界记录,不进入当前依赖。 |
| 9 | 完成 FR / 数据 / DB 映射、同步异步与依赖类型审计 | done | 无孤儿接口、无核心 FR 协作缺口、无第四种依赖。 |
| 10 | Historical material、blocker、自检并停审 | done | 允许进入 Step 13;正式 `00` 仍不写。 |
| 11 | Step 17 受控回退复核 | done | `DB-L2T-001~008` 的方向、当前依赖子集与 pending / future 记录对齐修正后的 Step 6,接口 / NFR / 追溯对象编号集合不变。 |
| 12 | Step 17 依赖术语前向恢复复核 | done | `C-L2T-5` 明确 `DB-L2T-007` 是当前事件协作依赖,开放对象仅为 Tools-specific producer / source / route / readiness;IB / DB 编号和数量不变。 |

---

## 2. 本步输入

### 2.1 输入与读取结论

| 输入 | 已读取结论 | 本步约束 |
|---|---|---|
| `00_req_step_06_consumers_dependencies.md` | 当前分类为 Core 编译期依赖,Hub / Sandbox / Runtime 运行期依赖,Bus / Observability 事件协作依赖。Governance 直边与 SDK future seam 已评估但不进入当前主链。 | Step 12 只能把既有裁剪关系展开为能力面;未进入主链的项目边使用“不适用”并保留 pending / future 状态,不能反向升格。 |
| `00_req_step_09_functional_requirements.md` | 17 项核心 FR、6 项外围 FR 已固定。 | 每个核心 FR 必须至少有接口面或依赖边界承接。 |
| `00_req_step_10_business_rules_boundaries.md` | Source ref、fail-closed、隔离不可旁路、local truth first 和 safe handoff 规则已固定。 | 接口不得打穿相邻 owner 或放宽敏感材料边界。 |
| `00_req_step_11_data_ownership.md` | 34 项数据已按 truth / snapshot / ref / forbidden body 分类。 | 能力边界只能消费或输出允许的数据类别,不得传递禁止正文。 |
| 需求 SOP Step 12 | 先定接口类型,再定依赖类型;做节点停审和跨能力接口审计。 | 不抄 Step 6,不画调用 / 事件传播 / 实现流程图。 |
| 需求规范 §4.12 | 接口类型与能力依赖类型均为固定枚举,正式使用两张固定表。 | 不自行发明 runtime interface、handoff dependency 等类别。 |
| 全局依赖裁剪规则 | 只有 compile 关系可成为 package dependency;runtime / event 不可成为 path dependency。 | Material handoff 必须附着 runtime 或 event carrier。 |
| 已完成项目 Step 12 | Hub 展示完整能力接口 / 外部依赖 / 映射粒度;Method Library 展示外围接口边界。 | 采用同等粒度,不复制其它领域内容。 |
| 上游正式文档与 blocker 台账 | Owner 边界稳定,但部分具体正向 seam 尚未闭口。 | 写能力级输入 / 输出和 blocked condition,不伪造协议可执行性。 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓对外提供哪些能力级接口? | Identity / definition 建立、读取与演进;binding 变更、查询和维护;canonical invocation 接入与收束;执行要求与外部前置承接;conditional execution handoff;result / error / audit 查询;safe material 与 degradation 输出。 |
| 本仓消费哪些能力级输入? | Core 当前编译期共享基础契约类别、Hub controlled view / ref、正式 authorization 结果、Sandbox execution material ref,以及外部 delivery / observation 状态安全摘要;具体 Tools-specific shared schema / contract authority 仍待闭口。 |
| 哪些是同步能力边界? | 正式变更、查询、invocation intake、`IB-L2T-019` authorization 结果承接、execution handoff / material 承接和 outcome 消费面;具体 transport 后移。 |
| 哪些是异步能力边界? | 合同 / binding 变化输出、`IB-L2T-012` 正式 authorization 变化输入候选、安全工具材料输出和 handoff degradation 输出。异步变化输入不得替代一次调用进入执行前的同步结果承接。 |
| 哪些依赖是输入型? | Core / Hub 定义来源,authorization 治理结论,Sandbox 外部执行能力。 |
| 哪些结果是输出型? | Runtime 对工具合同 / invocation / outcome / audit 的运行期消费,Bus / Observability 对安全变化材料的事件协作;SDK 仅为未来服务端边界消费记录。 |
| 哪些是核心 / 外围? | `IB-L2T-001~019` 服务核心,其中 `DB-L2T-001~002`、`DB-L2T-004~007` 是当前依赖记录,`DB-L2T-003` 是核心路径所需但 owner 未解析的 pending 边界记录;`IB-L2T-E01~E04` 为外围接口,`DB-L2T-008` 仅为 future / excluded 边界记录。 |
| 是否有无功能来源的接口? | 否。每个 IB 均映射 FR;每个 DB 均服务至少一个核心或外围 FR。 |
| 是否有功能需要外部协作但未承接? | 否。17 项核心 FR 均由本地接口面、当前外部依赖或显式 pending authorization owner 边界承接;pending 记录不等于项目依赖已成立。 |
| 是否意味着所有正向集成已可执行? | 否。能力面成立不等于协议 / route / schema / client 已闭口;开放 blocker 单列承接。 |

---

## 4. 当前文档问题诊断

旧正式链把具体 API、事件、allowlist、provider lookup、执行 receipt 和历史 / replay 设想混入接口需求,并缺少 governed invocation 在执行前同步消费正式 authorization 结果的独立可定位 seam。后置 historical material 明细保留在 §7.9;同步承接缺口的 Step 16 回退记录保留在 §6.7。

---

## 5. 改动前后对比

| 维度 | 改动前 | 当前校准后 |
|---|---|---|
| 接口表达 | API、事件名、MCP client 与实现对象混写 | 只使用查询、变更、事件输入、事件输出、后台任务五类需求级能力面。 |
| Authorization 消费 | 异步变化输入被隐含解释为同步正式结果承接 | `IB-L2T-019` 同步承接正式结果,`IB-L2T-012` 只保留异步变化输入。 |
| 依赖关系 | Material handoff、未解析 authorization owner、SDK 与外部 registry 容易形成额外路径依赖 | 当前项目边只保留 compile / runtime / event,material 附着正式 carrier;未解析 owner 与 SDK future seam 标为“不适用”,不进入当前依赖。 |

---

## 6. 设计取舍

### 6.1 C-L2T-1 稳定身份与完整定义

| 项 | 结论 |
|---|---|
| 对外接口面 | Identity / definition 正式建立与演进、稳定合同读取、关键变化安全输出。 |
| 外部边界 | `DB-L2T-001` 的 Core 编译期关系已确认;当前只消费正式 shared ID / context / error / trace / metadata / envelope 类别,具体 Tools-specific shared schema / contract authority 仍为候选并待闭口。 |
| 同步 / 异步 | 建立、演进和读取为同步能力面;变化感知为异步输出面。 |
| 取舍 | 不写 CRUD、注册命令、API、event 名、version 字段或具体 Core 类型。 |

### 6.2 C-L2T-2 受控外部能力关联

| 项 | 结论 |
|---|---|
| 对外接口面 | Binding 建立 / 替换 / 失效、分类 / 状态 / 缺口读取、一致性检查、变化安全输出。 |
| 外部边界 | Hub controlled consumer view / ref / safe summary 是运行期定义来源;L2 不同步 registry 正文。 |
| 同步 / 异步 | Binding 变更 / 查询为同步;对账为后台任务;外部变化线索 / 本地缺口可通过事件边界感知。 |
| 取舍 | 不写 Hub API、cache、topic、allowlist 或 provider route。 |

### 6.3 C-L2T-3 统一规范调用语义

| 项 | 结论 |
|---|---|
| 对外接口面 | 正式合同查询、canonical invocation 接入、受理 / 执行前拒绝 / no-execution 收束。 |
| 外部边界 | Runtime 是直接运行期下游,消费同一工具合同和 outcome;不得反写 L2 truth。 |
| 同步 / 异步 | 当前核心以运行期同步能力面表达;并不锁定具体 transport。 |
| 取舍 | 不写 Runtime loop、请求 DTO、API path、action choice、retry 或 recovery。 |

### 6.4 C-L2T-4 执行前置与隔离交接

| 项 | 结论 |
|---|---|
| 对外接口面 | 执行要求 / 当前前置读取、正式 authorization 结果同步承接、authorization 变化异步输入、条件化执行交接、execution material / failure material 引用承接。 |
| 外部边界 | Tools-specific authorization owner / source matrix 尚未解析;候选对象仅是正式 authorization owner,不是 `L1-governance` 仓际关系,当前未确认 Governance 直边。Sandbox 是条件运行期外部能力依赖。 |
| 同步 / 异步 | `IB-L2T-019` 明确承接一次调用进入执行前所需的正式 authorization 结果;`IB-L2T-012` 只承接正式结论变化的异步输入候选。两者引用同一外部治理 truth,均不锁协议且不形成第二 authorization owner。 |
| 取舍 | `L2T-UP-001~004` 使 owner matrix、mapping、receipt 和 cleanup route 保持 blocked,但 fail-closed / 不可旁路能力面仍成立。 |

### 6.5 C-L2T-5 Outcome、审计与安全交接

| 项 | 结论 |
|---|---|
| 对外接口面 | Normalized result / error / terminal 查询、Tool-domain audit 追溯、安全工具材料输出、handoff degradation 查询 / 输出。 |
| 外部边界 | Runtime 运行期消费本地 truth;Bus 承载安全事件协作;`DB-L2T-007` 已确认 Observability 为当前事件协作依赖,但 Tools-specific producer / source / route / readiness 仍受 `L2T-UP-005~007` 阻塞。 |
| 同步 / 异步 | 本地 outcome / audit 查询为同步;safe material 和 degradation 为异步输出能力面。 |
| 取舍 | 不写 producer、event、schema、topic、route、delivery receipt、retention、alert 或 evidence。 |

### 6.6 关键取舍

| 候选写法 | 问题 | 结论 |
|---|---|---|
| 使用 runtime input / output、adapter interface 等自造类型 | 违反正式接口类型枚举,且把实现形态提前固定。 | 不采用;分别归入变更、查询、事件输入 / 输出或后台任务。 |
| 把 material handoff 写成第四种依赖 | 违反全局裁剪规则。 | 不采用;Sandbox material 附着 runtime,Bus / Observability material 附着 event carrier。 |
| 直接依赖 external MCP / A2A / API registry | 绕过 Hub truth owner。 | 不采用;当前无直接 external registry 依赖。 |
| 把 SDK 作为 L2 编译期依赖 | 形成层级循环并让 client 定义 server truth。 | 不采用;`DB-L2T-008` 只保留 future / excluded 边界记录,全局依赖类型为“不适用”;仅 Tools-specific client seam 继续 pending。 |
| 把 Governance 领域职责直接等同 Tools authorization provider | 全局矩阵无该直边,上游正式链也没有 Tools-specific result contract,会伪闭 `L2T-UP-001~002`。 | 不采用;保留未解析正式 owner seam、fail-closed 与 `DB-L2T-003` pending 记录。 |
| 沿用旧 API / event / error 名 | 锁定 historical contract 且可能串仓。 | 不采用。 |

### 6.7 Step 16 回退校准结论

| 发现项 | 回退前 | 回退后 | 原因 |
|---|---|---|---|
| Governed invocation 的同步 authorization 结果承接 | `IB-L2T-012` 只表达异步结果变化输入,却被同步 / 异步表笼统解释为也可承接同步正式结果。 | 新增 `IB-L2T-019` 作为需求级同步消费能力面;`IB-L2T-012` 只保留异步变化输入候选。 | `FR-L2T-011~012` 要求在执行前消费正式结果并 fail closed,必须有可定位的同步能力边界,不能让异步变化通知承担隐含职责。 |

`IB-L2T-019` 不新增 authorization owner、结果 schema、协议、字段、优先级或允许算法。它只补齐 L2 对正式外部 truth 的同步消费 seam,因此 `L2T-UP-001~002` 仍保持开放。

---

## 7. 结构化中间产物

### 7.1 对外能力接口表

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | `IB-L2T-001` 工具身份与正式定义建立 | 对外体现为让稳定工具身份和正式定义进入合同语境的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-002` 正式工具合同读取与稳定引用 | 对外体现为受控读取同一正式工具合同并形成稳定引用的能力面。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-003` 工具身份 / 定义演进与退役 | 对外体现为显式调整合同、说明兼容影响和正式退役的能力入口。 | 核心闭环能力 |
| 事件输出 | `IB-L2T-004` 工具合同关键变化可感知输出 | 对外体现为正式合同关键变化和消费影响可被安全感知的异步输出面。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-005` Capability binding 建立、替换与失效 | 对外体现为维护本地 body-free binding relation 的正式变更能力面。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-006` Binding 分类、状态与缺口读取 | 对外体现为读取 bound / unbound、关系状态、正式来源与已知缺口的能力面。 | 核心闭环能力 |
| 后台任务接口（按需） | `IB-L2T-007` Binding 一致性检查 | 对外体现为检查陈旧、冲突、失效或不可验证关系的后台能力入口,不创造外部 truth。 | 核心闭环能力 |
| 事件输出 | `IB-L2T-008` Binding 变化与缺口可感知输出 | 对外体现为 binding 正式变化或不可验证缺口可被安全感知的异步输出面。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-009` Canonical invocation 接入与合同锚定 | 对外体现为让一次工具行动按正式合同形成规范调用语义的能力入口。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-010` 调用受理、执行前拒绝与无执行收束 | 对外体现为在真实执行前形成可解释受理、拒绝、等待前置或 no-execution 终态的能力面。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-011` 工具执行要求与调用前置语境读取 | 对外体现为读取工具固有执行要求和当前调用仍需承接的正式前置。 | 核心闭环能力 |
| 事件输入 | `IB-L2T-012` 正式 authorization 结果变化输入 | 对内体现为承接正式 authorization 结果引用或允许摘要的异步变化输入面,不生成治理 truth。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-013` 条件化执行交接 | 对外体现为前置满足后按适用承载要求交接规范调用的能力面。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-014` Execution material / failure material 承接 | 对内体现为承接与特定 invocation 关联的正式 Sandbox execution source 引用以形成工具语义解释的能力面;既有 outcome 绑定来源不得被后续材料原地改写。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-015` Normalized result / error 与终态消费 | 对外体现为一致读取工具语义成功、失败、拒绝和无执行终态的能力面。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-016` Tool-domain audit 与多 owner 追溯 | 对外体现为回链身份、定义、调用、outcome 和正式来源并区分 owner 故障的只读能力面。 | 核心闭环能力 |
| 事件输出 | `IB-L2T-017` 安全工具材料输出 | 对外体现为输出最小必要、body-free、已脱敏且可关联的安全工具材料,不承诺具体 event。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-018` 外部 handoff 降级与缺口读取 | 对外体现为读取本地提交尝试 / 降级 / 已知缺口及允许的外部状态摘要,且不把外部状态升级为 L2 truth 或改写本地终态。 | 核心闭环能力 |
| 变更接口 | `IB-L2T-019` 正式 authorization 结果承接 | 对内体现为在 governed invocation 进入执行前同步承接正式 owner 提供的结果引用或允许摘要,并形成来源可验证或 fail-closed 的本地消费判断;不生成、修改或替代 authorization truth。 | 核心闭环能力 |
| 查询接口 | `IB-L2T-E01` 契约搜索、浏览与比较 | 对外体现为只读搜索、浏览和比较正式工具合同的外围能力面。 | 外围增强能力 |
| 后台任务接口（按需） | `IB-L2T-E02` 批量维护辅助与派生一致性检查 | 对外体现为批量维护提示、派生索引和一致性报告的后台能力面,不反写真相。 | 外围增强能力 |
| 查询接口 | `IB-L2T-E03` 诊断摘要与客户端消费说明 | 对外体现为只读诊断 / 审计摘要和合同一致消费说明的外围能力面,不实现 SDK client。 | 外围增强能力 |
| 变更接口 | `IB-L2T-E04` 契约管理辅助入口 | 对外体现为提高正式维护效率的管理能力入口,不固定 UI、CRUD 或 API。 | 外围增强能力 |

### 7.2 外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | `DB-L2T-001`:只消费正式适用的 shared ID、context、error、trace、metadata、envelope 类别;Tools-specific contract 在 `L2T-UP-008` 闭口前仍是候选。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L3-capability-hub` | 运行期依赖 | `DB-L2T-002`:消费 controlled consumer view / ref / safe summary 以建立和校验 binding,不复制 Hub truth。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-governance` | 不适用 | `DB-L2T-003`:记录 governed 场景所需的正式结果边界及已评估候选,不表示当前项目依赖已成立;Tools-specific owner / source matrix 不明或不可验证时 fail closed。 | 核心闭环能力 |
| 输入 | 外部能力依赖（按需） | `L4-sandbox` | 运行期依赖 | `DB-L2T-004`:sandbox-required 场景向正式隔离执行边界提交工具语义交接并消费 execution material refs;依赖方向按执行能力 provider 记为输入,L2 不拥有执行 truth。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L2-runtime` | 运行期依赖 | `DB-L2T-005`:Runtime 消费正式定义、canonical invocation、normalized result / error 和 audit;不得反写工具 truth。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | `DB-L2T-006`:只交接已成立本地事实的安全变化材料;L2 不拥有 publish / delivery / retry / DLQ / replay truth。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L4-observability` | 事件协作依赖 | `DB-L2T-007`:仅交接最小必要、body-free、已脱敏且可关联的安全材料;Tools producer / source / route 仍受 `L2T-UP-005~007` 阻塞。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-sdk` | 不适用 | `DB-L2T-008`:记录未来可封装正式服务端工具合同的被裁剪边界;当前不进入依赖主链,tools-specific client 受 `L2T-UP-009` 阻塞。 | 外围增强能力 |

`DB-L2T-001~008` 是依赖边界记录全集,不是八条均已成立的当前依赖。当前已确认项目依赖子集为 `DB-L2T-001~002`、`DB-L2T-004~007`;`DB-L2T-003` 是 owner 未解析的核心 pending 边界记录,`DB-L2T-008` 是 future / excluded 外围边界记录。

### 7.3 接口与功能需求映射

| 功能需求 | 主要能力接口 | 映射说明 |
|---|---|---|
| `FR-L2T-001` | `IB-L2T-001`;`IB-L2T-002` | 建立稳定 identity 并供正式引用。 |
| `FR-L2T-002` | `IB-L2T-001`;`IB-L2T-002` | 建立、读取完整正式定义。 |
| `FR-L2T-003` | `IB-L2T-003`;`IB-L2T-004` | 显式演进并输出安全变化感知。 |
| `FR-L2T-004` | `IB-L2T-005`;`IB-L2T-006` | 通过变更 / 读取表达 bound / unbound 分类。 |
| `FR-L2T-005` | `IB-L2T-005`;`IB-L2T-006` | 建立和读取 body-free binding。 |
| `FR-L2T-006` | `IB-L2T-006~008` | 查询、检查并感知 binding 缺口。 |
| `FR-L2T-007` | `IB-L2T-002`;`IB-L2T-009` | 读取正式合同并形成 canonical invocation。 |
| `FR-L2T-008` | `IB-L2T-009`;`IB-L2T-010`;`IB-L2T-015` | 接入调用并形成可消费受理 / 拒绝终态。 |
| `FR-L2T-009` | `IB-L2T-002`;`IB-L2T-009`;`IB-L2T-010` | 让不同调用方 / carrier 共用同一合同与收束语义。 |
| `FR-L2T-010` | `IB-L2T-011` | 提供执行要求与适用前置读取面。 |
| `FR-L2T-011` | `IB-L2T-010~012`;`IB-L2T-015`;`IB-L2T-019` | 由 `IB-L2T-019` 同步承接正式结果,由 `IB-L2T-012` 承接变化通知;未知时保守收束并供终态消费。 |
| `FR-L2T-012` | `IB-L2T-010~013`;`IB-L2T-015`;`IB-L2T-019` | 同步承接正式前置后形成不可旁路的条件化交接,或在结果不可验证时拒绝。 |
| `FR-L2T-013` | `IB-L2T-013`;`IB-L2T-014` | 交接 invocation 并承接正式 execution material。 |
| `FR-L2T-014` | `IB-L2T-014`;`IB-L2T-015` | 从可信 execution source 形成并读取 normalized result。 |
| `FR-L2T-015` | `IB-L2T-010`;`IB-L2T-014`;`IB-L2T-015` | 收敛无执行 / 执行失败并提供一致错误语义。 |
| `FR-L2T-016` | `IB-L2T-016` | 提供 Tool-domain audit 与多 owner 追溯。 |
| `FR-L2T-017` | `IB-L2T-017`;`IB-L2T-018` | 输出 safe material 并显式读取 handoff 降级。 |
| `FR-L2T-E01` | `IB-L2T-E01` | 契约搜索、浏览与比较。 |
| `FR-L2T-E02`;`FR-L2T-E03` | `IB-L2T-E02` | 批量维护提示、派生索引与一致性检查。 |
| `FR-L2T-E04`;`FR-L2T-E05` | `IB-L2T-E03` | 只读诊断摘要与客户端消费说明。 |
| `FR-L2T-E06` | `IB-L2T-E04` | 契约管理辅助入口。 |

### 7.4 功能需求与外部依赖映射

| 功能需求 | 主要外部依赖 | 边界结论 |
|---|---|---|
| `FR-L2T-001~003` | `DB-L2T-001`;`DB-L2T-005`;适用时 `DB-L2T-006` | `DB-L2T-001` 当前编译期关系已承接;仅具体 Tools-specific shared schema / contract authority 仍为候选并待闭口,Runtime / Bus 不定义合同 truth。 |
| `FR-L2T-004~006` | `DB-L2T-002`;适用时 `DB-L2T-006` | Hub 是运行期 source;变化协作不复制 registry。 |
| `FR-L2T-007~009` | `DB-L2T-001`;`DB-L2T-005`;条件化 `DB-L2T-004` | Runtime 消费 L2 合同;carrier 不形成第二语义。 |
| `FR-L2T-010~012` | pending `DB-L2T-003`;条件化 `DB-L2T-004` | Authorization 正式 owner 尚未解析,未知即 fail closed;Sandbox 仅对适用场景构成条件前置。 |
| `FR-L2T-013~016` | `DB-L2T-004`;`DB-L2T-005` | L2 消费 execution refs 并向 Runtime 提供工具语义 outcome / audit。 |
| `FR-L2T-017` | `DB-L2T-006`;条件化 `DB-L2T-007` | Bus / Observability 只消费已成立本地 truth 的安全材料。 |
| `FR-L2T-E01~E04`;`FR-L2T-E06` | 无新增外部核心依赖 | 只读 / 维护增强消费本地 truth。 |
| `FR-L2T-E05` | future / excluded `DB-L2T-008` | SDK 是未来下游边界记录,不是当前依赖,不阻塞核心或反写服务端合同。 |

### 7.5 同步 / 异步与全局依赖类型映射

| 能力边界 | 需求级方式 | 全局依赖承接 | 禁止误读 |
|---|---|---|---|
| 正式建立、变更、查询、invocation intake、execution handoff / material 承接 | 同步能力边界 | Hub / Sandbox / Runtime 按适用对象承接 `[runtime]`;`DB-L2T-001` 当前承接 `[compile]` | 不等于已经选定 HTTP / RPC / SDK / in-process;具体 Tools-specific shared schema / contract authority 仍待闭口。 |
| 合同 / binding 变化、safe material、handoff degradation | 异步输出能力边界 | `[event]` 经 Bus 或正式事件 carrier | 不等于已定 event、topic、producer、route 或 delivery。 |
| Authorization 结果与结果变化 | `IB-L2T-019` 为同步正式结果承接;`IB-L2T-012` 为异步变化输入候选 | 当前项目边为“不适用”;owner 闭口后须在后续正式文档重新裁剪 `[runtime]` / `[event]` 关系 | 两个能力面只描述 L2 的消费能力与 fail-closed;不得借接口存在伪造 owner、项目边或第二 authorization truth。 |
| Binding / 派生一致性检查 | 后台任务能力边界 | 本仓内部能力面;外部 source 仍为 `[runtime]` | 后台任务不得成为新依赖类型或 truth owner。 |
| Material handoff | 附着既有 carrier 的材料语义 | Sandbox `[runtime]`;Bus / Observability `[event]` | 不得创建第四种 `handoff dependency`。 |

### 7.6 能力级接口停审

| 节点 | 接口 / 依赖承接 | 停审结论 |
|---|---|---|
| `C-L2T-1` | `IB-L2T-001~004`;`DB-L2T-001`;`DB-L2T-005~006` | pass:身份 / 定义建立、读取、演进和变化边界完整,未锁 Core schema。 |
| `C-L2T-2` | `IB-L2T-005~008`;`DB-L2T-002`;`DB-L2T-006` | pass:binding 变更、查询、维护和变化边界完整,未复制 Hub truth。 |
| `C-L2T-3` | `IB-L2T-002`;`IB-L2T-009~010`;`DB-L2T-001`;`DB-L2T-004~005` | pass:canonical invocation / Runtime consumption 完整,未吸收 orchestration。 |
| `C-L2T-4` | `IB-L2T-010~014`;`IB-L2T-019`;`DB-L2T-003~004` | pass:正式裁决的同步承接与异步变化输入、隔离交接和 execution material 能力面清晰;约束为 `L2T-UP-001~004` 开放。 |
| `C-L2T-5` | `IB-L2T-015~018`;`DB-L2T-004~007` | pass:outcome、audit、safe handoff 和 degradation 能力面清晰;约束为 `L2T-UP-004~007` 开放。 |
| 外围增强 | `IB-L2T-E01~E04`;future / excluded `DB-L2T-008` | pass:外围不新增核心依赖,SDK 只为未来边界记录。 |

### 7.7 跨能力接口与依赖审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| 孤儿核心接口 | 无 | 19 个核心 IB 均有 FR 来源;`IB-L2T-019` 明确承接 `FR-L2T-011~012`。 |
| 孤儿外围接口 | 无 | 4 个外围 IB 覆盖 6 项外围 FR。 |
| 核心 FR 无接口 / 依赖承接 | 无 | 17 项核心 FR 均有本地 IB,适用外部协作均有 DB。 |
| 重复外部能力定义 | 无 | Hub、Sandbox、Runtime、Bus、Observability 各只定义一次已确认边界;authorization 只保留一条 owner-pending 记录。 |
| 与 Step 6 依赖类型冲突 | 无 | 当前依赖为 Core 编译期,Hub / Sandbox / Runtime 运行期,Bus / Observability 事件协作;authorization owner 候选边界与 `DB-L2T-008` future / excluded 记录均为“不适用”,不进入当前依赖。 |
| 第四种依赖类型 | 无 | Material handoff 附着 runtime / event carrier。 |
| Sibling path dependency | 无 | `DB-L2T-001` 当前已进入 compile,仅具体 Tools-specific shared schema / contract authority 仍待闭口;其余已确认项目边保持 runtime / event,`DB-L2T-003` 与 `DB-L2T-008` 为“不适用”。 |
| 协议 / 字段 /实现泄漏 | 无 | 未写 API、method、DTO、proto、event/schema、port、handler、repository、outbox、retry 或 transaction。 |

---

### 7.8 依赖裁剪图引用

正式 §12 不重复绘制依赖图,复用 `00_req_step_06_consumers_dependencies.md` §7.4 的 `L2-tools` 裁剪图。该图只表达 compile / runtime / event 关系,不表达调用时序、事件传播、数据流、故障恢复或实施顺序。

---

### 7.9 Historical material 后置审计

| 旧接口 / 依赖线索 | 当前处理 |
|---|---|
| Core Tool schema / SDK package 直接依赖 | 不宣称 Tools-specific Core schema 已有;SDK 改为未来下游消费。 |
| Hub allowlist / provider lookup / MCP Client | 改为 Hub controlled ref / safe summary;不继承 query / client 名或本地 registry。 |
| Sandbox execute API、capture mapping、receipt | 只保留 conditional execution handoff / material 接口面;具体 mapping / receipt 保持 blocker。 |
| Policy update / shared_rules / 30s refresh | 改为正式 authorization result seam;事件名、cache、时限不继承。 |
| 三类工具事件 / cost event / audit event | 不继承事件名、payload、producer、route 或 cost;只保留 safe material output。 |
| Invocation history / replay / recovery | 不属于接口边界;Runtime / Bus / Observability owner 保持独立。 |
| Builtin、extras、member-images、marketplace | 具体库存 / 装配 / listing 不进入本步接口主线。 |

---

## 8. 回填草稿

> Step 17 应装配 §7.1 和 §7.2 两张固定结构表,并用短说明引用 Step 6 裁剪图。§7.3~7.9 作为 calibration 追溯依据,不把编号堆叠到正式主表。

正式章节必须说明:接口名称是需求级能力主题,不承诺协议;事件输入 / 输出不承诺事件名或 route;正向能力边界存在不代表开放 blocker 已闭口。

---

## 9. 待确认事项

### 9.1 Blocker 判定

| Blocker | 是否阻塞 Step 12 | 当前能力边界 | 不得声称 |
|---|---|---|---|
| `L2T-UP-001/002` | 不阻塞需求级接口 | `IB-L2T-011~013`;`IB-L2T-019`;`DB-L2T-003` | Authorization owner/source matrix、taxonomy、优先级或允许算法已定稿。同步承接能力成立不表示外部 authority 已闭口。 |
| `L2T-UP-003` | 不阻塞需求级接口 | `IB-L2T-013~015`;`DB-L2T-004` | ToolInvocation / Sandbox command 和 capture / result 字段 mapping 已闭口。 |
| `L2T-UP-004` | 不阻塞能力定义,阻塞相应正向交接 readiness | `IB-L2T-013~014`;`DB-L2T-004` | Receipt、ack、dead-letter、investigation feedback、cleanup release 或 route 已可执行。 |
| `L2T-UP-005` | 不阻塞 safe output 定义,阻塞 Observability 正向 route | `IB-L2T-017~018`;`DB-L2T-007` | Tools producer/source enum、event、schema、topic 或 route 已存在。 |
| `L2T-UP-006/007` | 不阻塞当前 workspace 输入 | `DB-L2T-007` | 上游正式链已 immutable、implementation-ready 或已验证。 |
| `L2T-UP-008` | 不阻塞本地能力定义,阻塞共享 schema 定稿 | `DB-L2T-001` | Core 已有 ToolId / ToolDefinition / ToolInvocation / ToolResult 或 Tools event / error schema。 |
| `L2T-UP-009` | 不阻塞核心,阻塞 SDK 正向联调 | `IB-L2T-E03`;future / excluded `DB-L2T-008` | Tools client、SDK 方法、语言包或 client coverage 已存在。 |

结论:未发现新增上游 blocker。Step 12 能力级接口和依赖边界可收敛,但表中标出的正向协议 / route / schema / client readiness 继续保持 blocked。

`IB-L2T-019` 是 Step 16 追溯审计触发的 Step 12 回退校准产物,不是上游 blocker 的关闭证据。当前接口总数为 19 项核心能力接口与 4 项外围能力接口。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否使用规范五类接口和四类能力依赖 | pass |
| 是否保留 compile / runtime / event 全局依赖判断 | pass |
| `DB-L2T-001~008` 的全局类型是否只使用 `编译期依赖 / 运行期依赖 / 事件协作依赖 / 不适用`,且“不适用”记录未进入当前依赖 | pass |
| `DB-L2T-004` 是否按 Sandbox provider 方向记为输入,并仅在说明中表达双向交接能力 | pass |
| 每个接口 / 依赖是否有 FR 或边界来源 | pass |
| 核心 / 外围 FR 是否有接口承接 | pass |
| 是否区分同步 / 异步能力面且不锁 transport | pass |
| 是否为 `FR-L2T-011` 提供独立同步 authorization 结果承接能力,且未与异步变化输入混写 | pass |
| 是否复用 Step 6 图而未另画调用链 | pass |
| Step 6 图引用是否精确指向 §7.4 | pass |
| 是否未创建第四种 handoff dependency | pass |
| 是否未把 runtime / event 写成 package dependency | pass |
| 是否区分 `DB-L2T-007` 当前事件协作依赖与具体 producer / source / route / readiness 开放状态 | pass |
| 是否未写 API、DTO、event schema、port、handler 或实现流程 | pass |
| 是否未把 blocker 写成已可执行正向集成 | pass |
| 是否未修改正式 `00-需求文档.md` | pass |

### 10.2 模块状态

| 模块 | 状态 | gate_status |
|---|---|---|
| capability_interfaces | done | pass |
| external_dependency_boundaries | done | pass |
| fr_and_global_type_mapping | done | pass |
| cross_interface_dependency_audit | done | pass |

### 10.3 停审结论

```text
step_status = completed_stop_review
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = create 00_req_step_13_non_functional_requirements.md
commit_required = false
```
