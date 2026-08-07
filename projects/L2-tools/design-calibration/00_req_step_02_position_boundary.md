# L2-tools 需求 Step 2:本仓定位与边界

> Step 状态: completed
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §2
> 本步原则: 只建立仓级心智;不展开使用方、能力闭环、功能、规则、数据、接口或风险表。

---

## 1. Step 状态

### 本步目标

在 Step 1 的 authority 边界内,用最小信息量定义 L2-tools 是什么、不是什么、为何独立存在及最易与哪些相邻 owner 混淆,使后续需求不会把 Runtime、Capability Hub、Sandbox 或 Observability 的真相吸入本仓。

### 1.1 Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 恢复三层状态 | §1 状态、§2 输入与 §10 门禁 | done | 只允许 Step 2,正式 00 不可写。 |
| 回答规范四问 | §3 | done | 定义、非职责、混淆对象、独立原因齐全。 |
| 诊断候选措辞 | §4.1 | done | “工具执行契约层”不被误解为 Sandbox execution truth owner。 |
| 做边界取舍 | §6 | done | 仓级 owner 分开,不展开后文章节。 |
| 结构化定位 | §7 | done | 固定四行定位表和对象清单成立。 |
| 后置审计旧材料 | §5 | done | 旧实现 / 产品形态未混入定位。 |
| 复杂度判断 / 是否拆模块或附录 | §7 | done | 四要素、最小 truth 声明和成立性表可在单文件审查,无需拆附录。 |
| 形成回填草稿 | §8 | done | 符合规范固定表 + 一段短文。 |
| 自检与停审 | §10 | done | 3~5 句话可说清且未越过 Step 2。 |

---

## 2. 本步输入

- `design-calibration/project_execution_ledger.md` 当前恢复点与 blocker 台账。
- `design-calibration/00_requirements_calibration_flow.md` Step 2 门禁。
- `design-calibration/00_req_step_01_upstream_relation.md` 来源与承接结论。
- `standards/document/需求文档讨论流程_SOP.md` Step 2。
- `standards/document/需求文档书写规范.md` §4.2。
- 全局依赖规则中 L2-tools 先于 L2-runtime 的层级定位。
- Capability Hub、Sandbox、Observability 当前正式文档中的 owner / non-owner 边界。

### 2.1 本步预期输出

- 一句话定义。
- 非职责声明。
- 边界对象清单。
- 单独成仓原因。
- 固定结构表与 2~4 句边界说明回填草稿。

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓一句话定义是什么? | `L2-tools` 是平台 runtime 行动契约层中的工具调用语义契约真相仓,拥有工具身份、工具定义、规范调用以及工具语义结果 / 错误 / 审计的正式边界。 |
| 为什么需要单独成仓? | Runtime 需要稳定、可验证且可追溯的行动语义,而 capability catalog、runtime orchestration、isolation execution 与 observation material 分属不同 owner;若没有独立工具契约边界,这些真相会在调用链上互相覆盖。 |
| 本仓不是什么? | 它不是 agent loop 或 runtime orchestrator,不是 capability registry / external provider registry,不是 sandbox isolation controller,不是 observability store,也不是 SDK client、marketplace 或具体工具产品库存。 |
| 最容易与哪些对象混淆? | 仓:`L2-runtime`、`L3-capability-hub`、`L4-sandbox`、`L4-observability`、`L0-sdk`;能力:governance / authorization;概念:external MCP / A2A / API registry、builtin tool catalog、marketplace listing。 |

---

## 4. 当前文档问题诊断

### 4.1 定位措辞诊断

| 候选措辞 | 优点 | 风险 | 结论 |
|---|---|---|---|
| “工具集 monorepo” | 简短 | 把仓退化为具体库存和打包形态,继承旧 README | 不采用。 |
| “工具执行层” | 突出行动 | 容易误称 L2 拥有 Sandbox isolation run / capture truth | 不单独采用。 |
| “工具执行契约层” | 能表达调用与结果 | 仍需额外说明 execution truth 分属 L2 工具语义与 Sandbox 隔离事实 | 只作辅助解释。 |
| “runtime 行动契约层” | 保留全局层级语义 | 裸用会被理解为覆盖所有 Runtime action、dispatch、retry / recovery | 只作上位层级,不作完整仓定义。 |
| “工具调用语义契约真相仓” | 精确限定工具调用合同,不抢 Runtime 编排或 Sandbox 执行 | 需说明它位于 runtime 行动契约层 | 采用为仓定位主体。 |

“runtime 行动契约层”只表示 L2-tools 所在的上位层级,不表示本仓覆盖所有 Runtime action kind、dispatch、retry 或 recovery。本仓的精确定位是其中的“工具调用语义契约真相仓”:L2 拥有工具定义、规范调用和工具语义结果;Sandbox 仍独占 isolation environment、run、capture、failure、handoff 与 cleanup truth。

---

## 5. 改动前后对比

以下 historical material 差异表保留旧定位、当前冲突与处理口径,构成本步定位改动前后的逐项对比。

| 旧材料 | 旧定位 | 与当前独立结论的冲突 | 处理口径 |
|---|---|---|---|
| `README.md` | Python 工具集 monorepo,含 builtin、MCP Client 和 Role extras | 把实现技术、库存、外部 client 和镜像装配混成仓使命 | 全部降为 historical material。 |
| 旧 `00` | Runtime 的“手脚”,为具体工具与 MCP 代理服务 | “手脚”不足以界定 truth owner,且 MCP / extras 越界 | 不继承;只保留“Runtime 需要受控行动合同”这一问题线索。 |
| 旧 `01` | 与 Runtime 同进程 Python 包 | 过早锁技术 / 部署 | 不进入需求定位。 |
| 旧 `03` | Rust RPC / HTTP 服务和持久化系统 | 与旧 01 自相矛盾,并扩张为 history / replay store | 不进入需求定位。 |
| 旧 `05/06` | 用具体工具、事件和数字证明仓定位 | 无 authority / evidence,且用后续实现细节反推需求 | 不继承。 |

---

## 6. 设计取舍

| 易混淆对象 | 对方拥有 | L2-tools 仅拥有 / 保留 | 为什么必须分开 |
|---|---|---|---|
| `L2-runtime` | agent loop、LLM planning、step progression、orchestration、checkpoint / recovery | Runtime 可消费的工具定义、调用和结果 / 错误 / 审计语义边界 | 决定“何时为何行动”与定义“行动合同是什么”是不同真相。 |
| `L3-capability-hub` | capability identity、descriptor、registry、formal exposure、controlled view | 本地 tool identity / definition 及对 capability ref 的受控绑定语义 | capability 可见性不等于工具调用资格或工具执行结果。 |
| governance / authorization | effective policy、allow / deny、审批与治理裁决 | 工具固有风险声明、执行要求以及外部裁决引用条件 | 风险描述不能越权成为授权真相。 |
| `L4-sandbox` | isolation environment、run、capture、failure、handoff、cleanup | 工具规范调用与对 Sandbox 事实的工具语义归一化 | capture 是隔离执行事实,不能直接冒充 ToolInvocationResult。 |
| `L4-observability` | observation material、projection、retention、query / report handoff | ToolAuditEntry 及结果 / 错误的安全观察材料交接边界 | observation 不得裁决执行、驱动恢复或反写工具真相。 |
| external MCP / A2A / API registry | 外部 provider / endpoint / transport / catalog truth | 仅保留未来 adapter 可消费的正式引用边界 | 工具契约仓不能膨胀成外部连接与供应方控制面。 |
| `L0-sdk` | 客户端语义、映射、兼容与横切默认 | 可被客户端消费的服务端工具契约 | SDK client 不应反向定义服务端工具 truth。 |
| builtin catalog / member-images / marketplace | 具体库存、镜像装配或商品展示语义 | 不在仓定位层拥有这些产品清单 | 产品库存和分发不是稳定行动契约真相。 |

此表用于本 Step 的边界取舍;正式 §2 只保留对象列表和仓级短说明,不把 owner 细目提前写成数据归属或依赖矩阵。

---

## 7. 结构化中间产物

### 7.1 仓定位四要素

| 字段 | 收敛结论 | 明确不展开 |
|---|---|---|
| 一句话定义 | `L2-tools` 是平台 runtime 行动契约层中的工具调用语义契约真相仓,拥有工具身份、工具定义、规范调用以及工具语义结果 / 错误 / 审计的正式边界。 | 技术栈、部署形态、调用协议、对象字段。 |
| 本仓不是什么 | 不是 runtime orchestrator、capability / external provider registry、governance decision owner、sandbox controller、observability store、SDK client 或产品工具库存。 | 非目标表、规则表、数据分类表。 |
| 边界对象列表 | 仓:`L2-runtime`、`L3-capability-hub`、`L4-sandbox`、`L4-observability`、`L0-sdk`;能力:governance / authorization;概念:external registry、builtin catalog、marketplace listing。 | 依赖方向、接口、字段与调用顺序。 |
| 单独成仓原因 | 平台需要把稳定工具行动语义从“选择与编排行动”“能力目录”“隔离执行事实”“观察材料”和“产品分发”中独立出来。 | 架构方案对比和实施拆分。 |

### 7.2 真相范围最小声明

Step 2 只确认下列仓级边界,具体数据类型留到 Step 11:

```text
L2-tools owns:
  stable tool contract semantics
  canonical tool invocation semantics
  normalized tool result / error semantics
  tool-domain audit semantics

L2-tools does not own:
  runtime decision / orchestration truth
  capability registry / governance decision truth
  sandbox isolation execution truth
  observation store / retention truth
  external provider registry / client / marketplace truth
```

### 7.3 单独成仓成立性

| 检查 | 结论 |
|---|---|
| 并入 Runtime 是否合理? | 否;会让 orchestration owner 同时定义和任意改写行动合同,下游难以稳定引用。 |
| 并入 Capability Hub 是否合理? | 否;会把 capability identity / exposure 与 tool invocation / result 混成一个 registry truth。 |
| 并入 Sandbox 是否合理? | 否;会把工具业务语义与 isolation capture / failure / cleanup truth 混写。 |
| 并入 Observability 是否合理? | 否;会把工具审计事实与观察投影 / retention 混写,破坏 no-write truth。 |
| 仅保留为工具库存仓是否足够? | 否;库存不能提供 Runtime 所需的稳定 invocation、result、error 和 audit 语义合同。 |

---

## 8. 回填草稿

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L2-tools` 是平台 runtime 行动契约层中的工具调用语义契约真相仓,拥有工具身份、工具定义、规范调用以及工具语义结果 / 错误 / 审计的正式边界。 |
| 本仓不是什么 | 它不是 runtime orchestrator、capability 或 external provider registry、governance decision owner、sandbox controller、observability store、SDK client,也不是具体工具库存或 marketplace。 |
| 边界对象列表 | 仓:`L2-runtime`、`L3-capability-hub`、`L4-sandbox`、`L4-observability`、`L0-sdk`;能力:governance / authorization;概念:external MCP / A2A / API registry、builtin catalog、marketplace listing。 |
| 单独成仓原因 | 平台需要把稳定工具行动语义从选择与编排、能力目录、隔离执行事实、观察材料和产品分发中独立出来。 |

`L2-tools` 必须单独存在,因为 Runtime 需要稳定、可验证、可追溯的工具调用语义,而行动选择、能力目录、治理裁决、隔离执行和观察材料分别拥有独立真相。它最容易与 `L2-runtime`、`L3-capability-hub`、`L4-sandbox` 和 `L4-observability` 混淆;这些边界若不分开,工具合同会被编排决策、registry、capture 或 observation projection 反向定义。

---

## 9. 待确认事项

本步没有新增待确认事项。既有上游 blocker 不改变仓级定位,但其受影响的 authorization、Sandbox、Observability、Core 与 SDK 具体 seam 仍不得在后续文档中伪称闭口。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否用一句话定义本仓? | 是。 |
| 是否明确本仓不是什么? | 是。 |
| 是否列出至少两个易混淆边界? | 是,覆盖五个仓、一个能力族和三个概念族。 |
| 是否说明独立成仓原因? | 是。 |
| “runtime 行动契约层”是否被误解为覆盖所有 Runtime action? | 否,已降为上位层级并把仓定位收窄到工具调用语义。 |
| “工具调用语义”是否误称 Sandbox execution truth? | 否,已显式区分工具语义与 isolation execution truth。 |
| 是否展开依赖、能力闭环、功能、规则、数据、接口、NFR 或风险? | 正式回填草稿没有;诊断表仅用于证明边界取舍。 |
| 是否锁定技术栈 / 部署 / transport? | 否。 |
| 是否继承 builtin / MCP / extras / marketplace 主线? | 否。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| position_boundary | done | done | done | done | done | pass | `pass` | 更新 flow / ledger 后创建 Step 3;正式 00 仍不可写。 |

### 10.3 停审结论

```text
step_status = completed
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = 读取需求 SOP Step 3 与书写规范 §4.3,创建 00_req_step_03_problem_context.md
commit_required = false
```
