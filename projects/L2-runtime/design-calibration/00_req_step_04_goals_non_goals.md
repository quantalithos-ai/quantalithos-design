# L2-runtime 00 需求 Step 4: 目标与非目标

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 4 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 定位、Step 3 问题、上游 owner 与 blocker 台账 |
| 目标 | 收束可验证目标与明确非目标 |
| 禁止 | 功能清单、技术方案、指标伪造、上游 owner 替代 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 目标收束 | done | 五项目标表 | pass |
| 非目标收束 | done | owner 对照表 | pass |
| 范围 / 验证方法 | done | 验证口径 | pass |
| 历史目标审计 | done | 旧指标处置 | pass |
| 回填与自检 | done | 第 4 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 需求结束后应成立什么? | Runtime 能围绕一次受控运行维持可解释 loop，形成 goal/plan/context/model/action 之间的工作语义，支持 checkpoint/resume/sub-agent/reflection/recovery，并以 owner-safe handoff 交接结果。 |
| 如何验证? | 用后续章节的能力级验收、状态 / 边界检查、fake / blocked seam、追溯矩阵和真实执行阶段证据验证;当前不填写测试结果或阈值。 |
| 相关但不纳入什么? | provider / secret / quota / cost、tool execution、capability registry、method body、governance approval、sandbox isolation、observability backend、member lifecycle、artifact body、SDK / product / marketplace。 |
| 哪些交给相邻仓 / 后续阶段? | 交给对应 owner 的 formal contract、adapter、event、ref、fake 或 future qualification;未闭合时 Runtime fail closed 或保持 pending。 |

## 3. 目标表

| 目标 | 说明 | 验证方式 |
|---|---|---|
| `G-L2R-001` 运行循环真相成立 | 一次 Runtime run 能有明确的触发、目标、上下文、决策、行动 / 等待、结果、暂停和终止语义,且不依赖调用方私有解释。 | 后续功能 / 规则 / 状态 / 验收都能回指同一 run 语义;非法跳转与无来源推进被拒绝。 |
| `G-L2R-002` Context 与 memory 边界成立 | working context、goal/plan 工作态、外部方法 /治理 /工具 /artifact 引用、episodic / semantic 检索候选与禁止正文边界可区分。 | 数据归属和边界验收确认不保存外部正文、不把 snapshot 当 truth、不跨层混写。 |
| `G-L2R-003` Model / action decision 可解释且可保守失败 | Runtime 能表达模型意图、候选选择、工具 / sub-agent 行动决定和未决 /拒绝原因,依赖不明时不假装成功。 | 决策结果能回链输入约束与正式引用;provider / Tool / Governance / Sandbox 缺口导致 blocked / fail-closed。 |
| `G-L2R-004` Checkpoint / resume / reflection / recovery 可区分 | 运行可在稳定点保存、恢复、反思并形成新决定,不重复或伪造不确定副作用。 | 恢复验收覆盖 stable point、commit unknown、duplicate、late feedback、reflection 不改写历史。 |
| `G-L2R-005` 运行事件与外部交接不反写真相 | Runtime 已提交事实可形成安全 handoff material / local attempt / gap,但 delivery / observed / artifact / process / conversation 等不替代 Runtime truth。 | 事件 / ref / adapter / fake seam 类型清晰;handoff failure 与本地结果独立。 |

## 4. 非目标表

| 非目标 | 不做原因 |
|---|---|
| `NG-L2R-001` Tools execution / ToolDefinition / normalized tool outcome | 由 `L2-tools` 拥有工具行动契约和语义结果。 |
| `NG-L2R-002` Capability identity / registry / descriptor / formal exposure | 由 `L3-capability-hub` 拥有能力接入 truth。 |
| `NG-L2R-003` Method / Role / Process definition body | 由 `L3-method-library` 拥有定义 truth;Runtime 只消费引用 / safe summary。 |
| `NG-L2R-004` Effective governance / approval / policy truth | 由 `L1-governance` 拥有;Runtime 只能消费正式结论并 fail closed。 |
| `NG-L2R-005` Sandbox environment / run / capture / cleanup / isolation truth | 由 `L4-sandbox` 拥有;Runtime 只编排和消费正式 seam。 |
| `NG-L2R-006` Observability backend / retention / audit projection truth | 由 `L4-observability` 拥有;Runtime 只提交安全材料或关联引用。 |
| `NG-L2R-007` Provider secret / route / quota / cost / billing / failover truth | 由 provider / security / finance / adapter owner 处理;Runtime 只拥有 provider-neutral model decision。 |
| `NG-L2R-008` Member-service lifecycle / member-images / marketplace / product UI | 分属 L2 member、构建、生态和产品层,不进入 Runtime 核心范围。 |
| `NG-L2R-009` Artifact / evidence / report 正文与正式验收 verdict | 分属 `L1-artifact` 和验收流程;Runtime 只保留 refs / safe summaries / handoff markers。 |
| `NG-L2R-010` 固定框架、语言、部署、SLA 和性能数字 | 当前无 authority;后续架构 / 配置 / 测试阶段按证据收敛。 |

## 5. 范围收束

本需求只保证 Runtime 的逻辑运行语义与边界成立,不承诺任何外部 provider、Sandbox、Observability、SDK、实现仓或环境已 ready。所有正向 seam 均须在 owner contract、字段 / route / adapter / fake parity 和真实证据闭口后再 qualification;当前只能将未闭口输入转为 pending、blocked、waiting 或 fail-closed。

## 6. 历史目标差异审计

| 历史目标 | 处置 |
|---|---|
| C1~C9 “9/9 可运行” | 旧模块清单,不作为当前目标计数。 |
| loop / checkpoint / memory 固定 P95 | 无来源测量,改为待后续 NFR / test baseline。 |
| 100% 高危 Guardrails / trace | 保留“所有适用路径有安全决策 / 结果可追溯”的结构目标,不继承比例事实。 |
| 直接使用 LangGraph / Temporal / SDK / vector store | 作为历史方案,不进入需求目标。 |

## 7. 回填草稿

本次需求目标是建立可追溯、可恢复、可保守失败的 Runtime 运行语义:一次 run 能围绕目标、计划、上下文、模型决定和行动推进,能在 checkpoint 稳定点暂停 / 恢复 / 反思,并以不反写相邻真相的方式交接运行结果。工具执行、能力目录、方法正文、治理裁决、隔离执行、观测后端、provider control、成员生命周期、Artifact 正文和产品入口均明确排除。

## 8. 自检与门禁

| 检查 | 结果 |
|---|---|
| 每个目标可验证 | pass |
| 非目标有明确 owner / 原因 | pass |
| 无固定技术方案 / 旧指标 | pass |
| blocker 以 pending / fail-closed 承接 | pass |

```text
gate_status = pass
next_allowed_action = create_step_05_users_roles
formal_document_write_allowed = false
```
