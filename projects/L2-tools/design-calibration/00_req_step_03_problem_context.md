# L2-tools 需求 Step 3:背景与问题定义

> Step 状态: completed
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §3
> 本步原则: 只回答“为什么现在需要收束”和“当前问题是什么”;不写目标、能力、功能或解决方案。

---

## 1. Step 状态

### 本步目标

在 Step 2 已确认的 runtime 行动契约层中的工具调用语义契约真相边界内,说明 Quantalithos 为什么当前阶段需要收束工具行动合同主题,识别阻碍 Runtime 稳定、安全、可追溯行动的核心问题,并区分产品推进问题与后续设计问题。

### 1.1 Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 恢复三层状态 | §1 状态、§2 输入与 §10 门禁 | done | Step 2 已 pass,只允许 Step 3。 |
| 读取问题章节标准 | §3 标准约束 | done | 固定短文、问题表和二分表结构。 |
| 回答背景问题 | §3.2 | done | 说明当前阶段价值,不写目标。 |
| 诊断问题候选 | §4.2 | done | 从五类 seam 缺口归并为三个问题,不按功能名写问题。 |
| 分类业务 / 技术问题 | §3.3 / §6 | done | 只说明影响,不给方案。 |
| 后置审计旧材料 | §5 | done | 旧伪量化、功能名、实现形态不继承。 |
| 复杂度判断 / 是否拆模块或附录 | §7 | done | 三个问题及二分结论可在单文件完整审查,无需拆附录。 |
| 结构化并回填 | §7~8 | done | 固定结构完整。 |
| Step 17 受控回退复核 | §7~10 | done | 正式装配源只保留当前系统背景、结构性表现与后果,historical diagnosis 仅留在 §4~5。 |
| 自检与停审 | §10 | done | 无目标、功能、接口、数据或实现内容。 |

---

## 2. 本步输入

- 项目台账、需求 flow 与 Step 1~2。
- 需求 SOP Step 3 与书写规范 §4.3。
- 全局依赖规则中 Layer 1 -> L2-tools -> L2-runtime 的推进关系。
- Capability Hub、Sandbox、Observability 当前正式边界。
- Core / Bus / SDK 的当前共享契约、事件协作与客户端边界。
- 旧 L2 README 与正式链,仅作独立问题结论后的差异审计。

### 2.1 本步预期输出

- 业务背景短文。
- 1~3 个核心问题的现状 / 后果表。
- 业务问题与技术问题二分表。
- 正式 §3 回填草稿。

---

## 3. SOP 问题回答

### 3.1 标准约束确认

| 标准要求 | 本步执行 |
|---|---|
| 背景为 2~4 句短文 | 用一段说明平台行动语境、当前 workspace 输入给出的可承接边界及开放状态和当前空白。 |
| 现状表一般列 1~3 个核心问题 | 将五类 seam 症状归并为三个 owner / contract 问题。 |
| 能量化则量化,不能量化则写表现和后果 | 当前没有可信运行数据;不继承旧“100%”、P95、SLA,逐项写可核对表现与后果。 |
| 业务 / 技术问题分开 | 产品不能稳定理解行动结果与设计多真相问题分别陈述。 |
| 禁止写目标 / 方案 / 功能 | 不写“系统应提供”、接口名、对象字段或技术选择。 |

### 3.2 业务背景问题回答

- Quantalithos 的 Runtime 需要把计划或编排转化为真实行动,但“选择行动”与“行动合同”必须是不同责任。
- Capability Hub、Sandbox 和 Observability 的当前 workspace 输入分别界定 capability access、isolation execution 与 observation truth,全局顺序要求在 Runtime 前先收束 L2-tools 的需求边界。
- L2-tools 尚缺少按这些 owner 关系收束、可供 Runtime 稳定消费的工具调用语义需求基线。

### 3.3 业务问题与技术问题回答

- 业务问题不是缺少某个 file/git/test 工具,而是 Runtime 的真实行动无法获得稳定、一致且可解释的合同语义。
- 技术问题不是缺少某张表或某个服务,而是 owner、consumer、handoff 和 failure 边界未收紧会导致后续文档与实现出现多个权威来源。

---

## 4. 当前文档问题诊断

### 4.1 业务背景诊断

- 如果背景写成“需要内置工具 + MCP Client”,就把旧产品库存当成问题答案。
- 如果背景写成“需要 schema / registry / event”,就提前进入目标、功能和接口。
- 如果背景只说“AI 需要手脚”,无法解释为何要独立的工具调用语义契约 owner。

### 4.2 现状与问题

独立识别的五类症状:

1. 当前没有可信的 tool identity / definition 需求基线;旧材料按具体 builtin、MCP 和两套技术形态定义工具。
2. capability identity / exposure 容易被复制成本地 registry 或 invocation allow/deny truth。
3. Runtime、tools、Sandbox 或其他调用方可能各自定义调用语义,导致一次行动没有统一合同。
4. Sandbox capture / failure 是隔离执行事实,却容易被直接当成工具语义结果 / 错误。
5. 工具结果、错误和审计材料容易与 raw output、Bus delivery audit 或 Observability projection 混写。

归并诊断:

| 归并问题 | 纳入症状 | 为什么属于问题而非目标 |
|---|---|---|
| 工具行动语义缺少可信单一边界 | 1、2、3 | 描述当前定义散落和多真相后果,未提出要实现哪些能力。 |
| 底层执行事实与工具语义结果缺少稳定分层 | 4 | 描述 capture 被误升格的风险,未指定 adapter 或映射方案。 |
| 结果 / 错误 / 审计交接责任容易混写 | 5 | 描述正文泄露、审计互替和 truth 反写后果,未指定事件或存储。 |

---

## 5. 改动前后对比

以下 historical material 差异表记录旧问题口径、当前诊断与处理方式,作为问题定义改动前后的逐项对比。

| 旧材料位置 | 旧问题口径 | 诊断 | 当前处理 |
|---|---|---|---|
| `README.md` Tool 分类 / 开放问题 | 以 builtin、MCP Client、Role extras 和 sandbox 深度定义问题 | 具体库存、client 和打包形态替代了行动契约问题 | 只作为旧范围膨胀线索。 |
| 旧 `00` §2 | “runtime 不能直接写 shell / 访问外部服务”后直接给出三类工具方案 | 背景、问题和方案混写 | 只保留“Runtime 真实行动需要受控语义”的背景。 |
| 旧 `00` §2.2 / §2.3 | 用“100%”、段末状态和无来源事实量化 | 无真实 run / inventory / measurement authority | 全部删除;当前明确没有可信量化基线。 |
| 旧 `00` §6 | 以具体 ToolDescriptor、file_ops、MCP client 等功能证明问题 | 功能名不能反推问题定义 | Step 9 重新判断,本步不继承。 |
| 旧 `01` / `03` | Python 同进程与 Rust 服务分别解释技术问题 | 技术形态互相冲突 | 不进入本步。 |
| 旧 `05` / `06` | 固定事件、错误码、SLA 和测试 / 验收成熟度 | 无当前 authority 或证据 | 不作为问题量化来源。 |

---

## 6. 设计取舍

### 6.1 业务背景取舍

- 背景聚焦“Runtime 需要稳定行动合同且当前 workspace 输入已界定相邻 truth 边界”。
- 当前时点价值用全局依赖顺序和当前工具合同空白说明;旧正式链失效只留在 §5 差异审计,不使用伪业务数字。

### 6.2 业务问题与技术问题取舍

- 业务影响描述为行动可理解性、安全责任和结果可信度受损。
- 技术影响描述为契约漂移、跨仓串线、不可追溯和无法形成可落码边界。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

Quantalithos 的 Runtime 需要把计划与编排转化为真实行动,调用方必须能够围绕同一工具主体理解调用语境与结果语义。Capability Hub、Sandbox 与 Observability 的当前 workspace 输入已分别给出能力接入、隔离执行和安全观察边界,而 L2-tools 尚缺少按这些 owner 关系收束、可供 Runtime 稳定消费的工具调用语义需求基线。该空白会使后续设计与联调无法围绕同一行动合同推进。

### 7.2 现状与问题结论

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 工具行动语义缺少可信的单一边界 | tool identity、tool definition 与 invocation 尚未在当前 owner 边界下形成统一需求基线;Core tools-specific shared schema 也未闭口。 | Runtime 或各执行适配方可能形成不同 tool identity、definition 与调用语义,Capability Hub truth 被复制,后续需求、设计和实现出现多真相源。 |
| 隔离执行事实与工具语义结果缺少稳定分层 | ToolInvocation 到 Sandbox generic chain、capture / failure 到工具语义 outcome 的 mapping authority 尚未闭口,execution truth 与 semantic outcome 缺少冻结映射。 | 同一次执行可能出现 Sandbox 成功而工具语义失败、capture 不完整却被声明成功等歧义,Runtime 难以获得可信结果,恢复与责任边界也会串线。 |
| 结果、错误与审计交接责任容易混写 | Tools-specific safe material producer / source / route 尚未闭口,tool-domain audit、Bus delivery audit 与 observation material 的协作分层尚无可执行契约。 | raw output、secret 或大结果可能进入错误交接面,ToolAuditEntry 被 delivery audit / observation projection 替代,下游可能依据观察材料反写执行 truth 或驱动不属于本仓的恢复。 |

当前没有可信实现库存、运行样本或测量基线,因此无法提出有依据的发生率、覆盖率、P95 或 SLA;本章以可核查的 owner 缺口、契约缺口和后果为依据。

### 7.3 问题分类结论

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对 Runtime 行动合同的统一需求语言,导致调用者、安全审查者、工具维护者和下游消费者无法稳定理解“调用的是什么、在何种边界下行动、结果意味着什么、失败与审计应由谁解释”。 |
| 技术问题 | tool identity / definition、capability ref、canonical invocation、Sandbox capture / failure、tool result / error / audit 和安全交接的 owner / consumer 边界若不先收紧,后续设计与实现会在 Runtime、Hub、Sandbox、Bus、Observability、SDK 和外部 registry 之间反复串线,形成冲突 schema 与不可落码 handoff。 |

---

## 8. 回填草稿

### 3.1 业务背景

Quantalithos 的 Runtime 需要把计划与编排转化为真实行动,调用方必须能够围绕同一工具主体理解调用语境与结果语义。Capability Hub、Sandbox 与 Observability 的当前 workspace 输入已分别给出能力接入、隔离执行和安全观察边界,而 L2-tools 尚缺少按这些 owner 关系收束、可供 Runtime 稳定消费的工具调用语义需求基线。该空白会使后续设计与联调无法围绕同一行动合同推进。

### 3.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 工具行动语义缺少可信的单一边界 | tool identity、tool definition 与 invocation 尚未在当前 owner 边界下形成统一需求基线;Core tools-specific shared schema 也未闭口。 | Runtime 或各执行适配方可能形成不同 tool identity、definition 与调用语义,Capability Hub truth 被复制,后续需求、设计和实现出现多真相源。 |
| 隔离执行事实与工具语义结果缺少稳定分层 | ToolInvocation 到 Sandbox generic chain、capture / failure 到工具语义 outcome 的 mapping authority 尚未闭口,execution truth 与 semantic outcome 缺少冻结映射。 | 同一次执行可能出现 Sandbox 成功而工具语义失败、capture 不完整却被声明成功等歧义,Runtime 难以获得可信结果,恢复与责任边界也会串线。 |
| 结果、错误与审计交接责任容易混写 | Tools-specific safe material producer / source / route 尚未闭口,tool-domain audit、Bus delivery audit 与 observation material 的协作分层尚无可执行契约。 | raw output、secret 或大结果可能进入错误交接面,ToolAuditEntry 被 delivery audit / observation projection 替代,下游可能依据观察材料反写执行 truth 或驱动不属于本仓的恢复。 |

当前没有可信实现库存、运行样本或测量基线,因此无法提出有依据的发生率、覆盖率、P95 或 SLA;本章以可核查的 owner 缺口、契约缺口和后果为依据。

### 3.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对 Runtime 行动合同的统一需求语言,导致调用者、安全审查者、工具维护者和下游消费者无法稳定理解“调用的是什么、在何种边界下行动、结果意味着什么、失败与审计应由谁解释”。 |
| 技术问题 | tool identity / definition、capability ref、canonical invocation、Sandbox capture / failure、tool result / error / audit 和安全交接的 owner / consumer 边界若不先收紧,后续设计与实现会在 Runtime、Hub、Sandbox、Bus、Observability、SDK 和外部 registry 之间反复串线,形成冲突 schema 与不可落码 handoff。 |

---

## 9. 待确认事项

本步没有新增待确认事项。当前缺少可信运行样本与量化基线,因此数量、覆盖率、P95 与 SLA 继续保持未定义,不阻塞进入 Step 4,也不得被伪造成当前事实。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否说明当前业务 / 系统背景? | 是。 |
| 是否列 1~3 个核心问题? | 是,归并为三个问题。 |
| 是否对不可量化问题写明表现与后果? | 是。 |
| 是否避免旧伪量化? | 是,明确没有可信运行基线。 |
| 是否区分业务问题和技术问题? | 是。 |
| 是否把目标、非目标或“系统应”写入问题? | 否。 |
| 是否写功能、用户故事、规则、数据、接口或实现方案? | 否。 |
| 是否把开放 blocker 伪称已解决? | 否。 |
| §7 / §8 是否只写当前系统背景、结构性表现和后果,不含旧 README、旧正式链、17 Step 或 `01~07` 等 calibration 过程? | 是。 |
| §7 与 §8 的正式背景、问题表和二分表是否一致? | 是。 |
| Observability 是否只按 current workspace input 使用,未声称 immutable 或 implementation-ready? | 是。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| business_context | done | done | done | done | done | pass | `pass` | 进入 problem_statement。 |
| problem_statement | done | done | done | done | done | pass | `pass` | 进入 problem_classification。 |
| problem_classification | done | done | done | done | done | pass | `pass` | 更新 flow / ledger 后创建 Step 4。 |

### 10.3 停审结论

```text
step_status = completed
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = 读取需求 SOP Step 4 与书写规范 §4.4,创建 00_req_step_04_goals_non_goals.md
commit_required = false
```
