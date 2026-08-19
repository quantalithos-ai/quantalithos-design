# L2-runtime 00 需求 Step 9: 功能需求

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 9 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | C-L2R-1~5、US-L2R-001~015、Step 6 依赖 |
| 功能拆分 | 按业务能力,不按对象 / CRUD / API / Command |
| 禁止 | repository、handler、port、schema、内部函数、实现流程 |

## 1. Step 内计划

| 节点 | 状态 | 功能编号 | gate_status |
|---|---|---|---|
| C1 | done_stop_review | `FR-L2R-001~004` | pass |
| C2 | done_stop_review | `FR-L2R-005~008` | pass |
| C3 | done_stop_review | `FR-L2R-009~012` | pass |
| C4 | done_stop_review | `FR-L2R-013~016` | pass |
| C5 | done_stop_review | `FR-L2R-017~020` | pass |
| 外围 | done | `FR-L2R-E01~E04` | pass |
| 跨节点审计 | done | 20 核心 + 4 外围,无孤儿 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 系统必须提供哪些业务能力? | 受理 / 推进 / 暂停运行,维护 goal / plan working state,组装 context / memory,选择 model,形成 action decision,编排 Tool / sub-agent,checkpoint / recover / reflect,输出安全运行结果与事件 handoff。 |
| 输入 / 输出 / 触发 / 失败? | 每项功能表列出能力级输入、输出、触发与失败;外部正向 seam 未闭口时明确 blocked / waiting / unavailable。 |
| 核心 / 外围? | `FR-L2R-001~020` 是核心闭环;`FR-L2R-E01~E04` 只读 / 实验 / 后置。 |
| 故事承接? | 每项功能都回指至少一个核心故事和唯一主能力节点。 |

## 3. 核心功能需求

| ID | 功能名称 | 类型 | 业务能力说明 | 节点 | 故事 |
|---|---|---|---|---|---|
| `FR-L2R-001` | Runtime run 受理与范围建立 | 核心 | 以正式主体、run scope、目标与约束受理一次运行,在输入不完整 / 冲突时明确拒绝或等待。 | C1 | US-001 |
| `FR-L2R-002` | Goal 形成与目标约束维护 | 核心 | 将正式目标语境转成当前 run 可追溯的 goal working state,不复制 Work / Method 正文。 | C1 | US-001;US-002 |
| `FR-L2R-003` | Plan working state 推进 | 核心 | 维护当前 run 的计划步骤、依赖、完成条件与推进决定,允许 blocked / waiting / no-next-step。 | C1 | US-002;US-003 |
| `FR-L2R-004` | Run 状态与终止语义 | 核心 | 区分 active、waiting、blocked、cancelled、completed、failed、unknown 等运行语义,禁止状态互相冒充。 | C1 | US-003 |
| `FR-L2R-005` | 正式上下文引用受理 | 核心 | 按 owner、ref、scope、freshness 和允许摘要消费 Method / Governance / Tools / Artifact 等外部输入。 | C2 | US-004 |
| `FR-L2R-006` | Context composition | 核心 | 围绕当前 goal / plan / turn 选择和排序 context sources,显式表达缺口、裁剪和预算结果。 | C2 | US-005 |
| `FR-L2R-007` | Working memory 管理 | 核心 | 维护当前 run / sub-context 的短期工作记忆,并区分 observation、decision、pending input 和 candidate。 | C2 | US-005;US-006 |
| `FR-L2R-008` | Episodic / semantic retrieval mediation | 核心 | 通过正式 ref / adapter 请求长期记忆检索或候选写入,不拥有正文、索引、保留或删除 truth。 | C2 | US-004;US-006 |
| `FR-L2R-009` | Model intent 形成 | 核心 | 根据 goal、context、风险、预算和当前运行条件形成 provider-neutral model intent,允许 no-model path。 | C3 | US-007 |
| `FR-L2R-010` | Model candidate 选择与约束解释 | 核心 | 对可消费的模型能力摘要 / adapter 输入形成选择决定和不可用 / 冲突解释,不推断 provider route。 | C3 | US-007;US-009 |
| `FR-L2R-011` | Model turn 编排与结果关联 | 核心 | 以稳定 turn scope / correlation 提交中立的 model turn,接收关联结果、拒绝、超时、unknown 或 unavailable。 | C3 | US-008 |
| `FR-L2R-012` | 安全 decision summary | 核心 | 形成可供调查 / 观测的最小 decision / source / result summary,禁止隐藏推理正文、secret 和 provider raw body。 | C3 | US-009 |
| `FR-L2R-013` | Action choice | 核心 | 基于当前 goal / plan / model disposition 选择 no-action、Tool action、sub-agent delegation 或等待 / 拒绝。 | C4 | US-010 |
| `FR-L2R-014` | Tool invocation orchestration | 核心 | 按 `L2-tools` canonical contract 提交 action context,消费 normalized outcome / error,不创建本地工具语义。 | C4 | US-011 |
| `FR-L2R-015` | Governance / execution precondition gate | 核心 | 对 governed、capability-bound、sandbox-required action 承接正式前置;缺失或不确定时 fail closed / waiting。 | C4 | US-010;US-011 |
| `FR-L2R-016` | Sub-agent delegation | 核心 | 以有限 scope、预算、父子关系和隔离上下文委派局部任务,消费 child result / unknown / failure。 | C4 | US-012 |
| `FR-L2R-017` | Checkpoint 与 stable point 管理 | 核心 | 在可恢复边界保存 run、goal、context、decision、action / side-effect marker 和下一步语境。 | C5 | US-013 |
| `FR-L2R-018` | Resume / retry / recovery decision | 核心 | 基于合法 stable point 与外部结果判断 resume、等待、重试、人工介入或终止,不盲重试 unknown side effect。 | C5 | US-013;US-014 |
| `FR-L2R-019` | Reflection 与新决定形成 | 核心 | 基于已提交运行事实形成 reflection / recovery candidate 和新 decision,不原地改写历史或外部 truth。 | C5 | US-014 |
| `FR-L2R-020` | Runtime outcome 与事件 handoff | 核心 | 形成 local runtime outcome、safe handoff material、submission attempt / gap 和关联事件,分离 delivery / observed / downstream acceptance。 | C5 | US-015 |

## 4. 外围增强功能需求

| ID | 功能名称 | 说明 | 边界 |
|---|---|---|---|
| `FR-L2R-E01` | 策略 / model / plan 实验比较 | 允许离线或只读比较候选决策与策略结果。 | 不改正式 run truth,不声明 provider / cost truth。 |
| `FR-L2R-E02` | Interactive replay preview | 提供无副作用的历史上下文 / 决策预览。 | 不执行 Tool / provider / Sandbox action。 |
| `FR-L2R-E03` | 跨 run 诊断与趋势摘要 | 聚合安全摘要帮助调查运行模式。 | 不替代 Observability truth 或验收报告。 |
| `FR-L2R-E04` | Reflection candidate handoff | 把候选交给 Method / memory owner 审查。 | 不自动提交 durable memory / method body。 |

## 5. 能力级输入、输出、触发与失败

| 节点 | 输入 | 输出 | 触发 | 失败语境 |
|---|---|---|---|---|
| C1 | formal trigger、actor、goal / plan refs、scope | run working state、goal / plan decision | start / resume / external continuation | invalid / missing / conflict / unauthorized / waiting |
| C2 | source refs、safe summaries、working memory、retrieval request | composed context、candidate / gap / degraded marker | new turn / plan change / recovery | stale / hidden / forbidden body / unavailable / budget cutoff |
| C3 | context、intent、constraints、adapter capability summary | model selection、turn result / disposition、safe summary | decision point | unavailable / timeout / refusal / unknown / adapter mismatch |
| C4 | model disposition、goal / plan、formal preconditions | no-action / Tool invocation / child delegation / waiting | action decision | governance missing / contract invalid / sandbox unavailable / child failed / unknown |
| C5 | committed run facts、stable point、external outcome / handoff status | checkpoint、recovery decision、reflection、local outcome / handoff attempt | boundary / failure / completion | commit unknown / duplicate / late feedback / delivery / observed unavailable |

## 6. 功能与故事 / 节点映射

| 节点 | 功能 | 故事 | 停审结论 |
|---|---|---|---|
| C1 | FR-001~004 | US-001~003 | 无 plan / state / process truth 串线。 |
| C2 | FR-005~008 | US-004~006 | 外部正文只以 ref / summary / candidate 进入。 |
| C3 | FR-009~012 | US-007~009 | model selection 与 physical provider control 分离。 |
| C4 | FR-013~016 | US-010~012 | action orchestration 与 Tools / Governance / Sandbox owner 分离。 |
| C5 | FR-017~020 | US-013~015 | history / recovery / handoff 状态分层。 |

## 7. 当前文档诊断与取舍

旧功能按 C1~C9 模块、SDK、vector store、policy cache、reasoning trace 和 WorkItem promote 平铺,导致内部结构和相邻 truth进入需求。新功能按五能力节点组织,每项有能力级输入 / 输出 / 触发 / 失败,并将外围增强和边界外事项显式隔离。

## 8. 回填草稿

正式第 9 章回填 `FR-L2R-001~020` 核心功能与 `FR-L2R-E01~E04` 外围功能。功能是业务能力而非 API / CRUD;任何未闭口的 model、memory、Tools、Governance、Sandbox 或 Observability seam 只能由对应失败语境承接。

## 9. 自检与门禁

| 检查 | 结果 |
|---|---|
| 每项功能有故事与节点来源 | pass |
| 无 CRUD / API / 内部函数拆分 | pass |
| 外部 owner 未被复制 | pass |
| 核心 / 外围分开 | pass |
| 孤儿功能 | 0 |

```text
gate_status = pass
next_allowed_action = create_step_10_business_rules_boundaries
formal_document_write_allowed = false
```
