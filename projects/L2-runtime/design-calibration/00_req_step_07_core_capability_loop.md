# L2-runtime 00 需求 Step 7: 核心能力闭环

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 7 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 边界、Step 4 目标、Step 6 依赖裁剪 |
| 目标 | 从 Runtime 存在必要性推导核心能力节点 |
| 禁止 | 旧模块清单、API / 事件链、实现组件、开发顺序 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 仓存在必要性 | done | 不可替代能力说明 | pass |
| 能力节点定义 | done | C-L2R-1~5 | pass |
| 逻辑依赖图 | done | 能力闭环图 | pass |
| 进入 / 退出与条件路径 | done | 节点门禁表 | pass |
| 外围 / 边界外审计 | done | 能力层级表 | pass |
| 后续小循环计划 | done | 节点停审表 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 没有 Runtime 会缺什么? | 缺少把正式目标、定义、治理和行动合同组织成可持续、可暂停、可恢复的 AI 运行决定的唯一 owner。 |
| 哪些能力缺一不可? | run/goal-plan、context/memory、model decision、tool/sub-agent action orchestration、checkpoint/reflection/recovery/outcome handoff。 |
| 哪些只是外围增强? | 多策略实验、高级 planning、长期学习自动化、多 model ensemble、跨 run analytics、rich debugger。 |
| 哪些不属于 Runtime? | Tools execution、registry、method body、approval、Sandbox truth、Observability backend、member lifecycle、artifact body、provider control。 |
| 节点讨论顺序? | C1 -> C2 -> C3 -> C4 -> C5,表示成立逻辑依赖,不是调用 / 事件 / 实施顺序。 |

## 3. 仓存在必要性

Runtime 的不可替代性不是“会调用 LLM”,而是对一次 AI 成员运行的决策连续性负责:它必须知道当前运行围绕什么目标、在什么正式约束和上下文中、为何选择某个 model / action、外部结果是否足以推进、哪里可安全恢复,以及哪些已提交事实可以向外交接。如果这些语义散落到 Member、Tools、Hub、Sandbox、Provider 或产品层,相同输入会产生多套运行状态和恢复判断。

## 4. 核心能力节点

| 节点 | 能力成立描述 | Runtime owner | 外部 owner 边界 |
|---|---|---|---|
| `C-L2R-1` 受控运行与 goal/plan 工作语境成立 | 正式触发、主体、目标、约束和终止条件能够形成一次可推进的 Runtime run,并维持 goal / plan 的本地工作态。 | run identity / status、goal decomposition、plan working state、progress decision | Work / Process / Artifact / Method 正文和正式业务状态不归 Runtime。 |
| `C-L2R-2` Context composition 与 memory mediation 成立 | 当前 turn 所需的正式 refs、safe snapshots、working memory、episodic / semantic retrieval candidates 能按来源、优先级、scope、时点和预算组合。 | context working set、composition decision、working memory、query / candidate / use record | 外部正文、method / policy truth、durable episodic / semantic body不归 Runtime。 |
| `C-L2R-3` Provider-neutral model decision 与 turn 解释成立 | Runtime 能表达 model intent、候选约束、选择决定、请求语境、关联结果和明确失败,而不拥有 physical provider route / secret / quota / cost。 | model intent / selection decision、turn correlation、semantic disposition | Hub registry、provider adapter truth、secret / quota / cost / raw billing不归 Runtime。 |
| `C-L2R-4` Tool / sub-agent action orchestration 成立 | Runtime 能基于当前决定选择 no-action、tool action 或 sub-agent delegation,承接 Governance / Tools / Sandbox 等前置,并区分受理、执行、结果和未知副作用。 | action choice、orchestration、delegation scope / budget、result incorporation decision | Tool contract/outcome、approval、Sandbox run、member/container lifecycle不归 Runtime。 |
| `C-L2R-5` Checkpoint、reflection / recovery 与 outcome handoff 成立 | 每个可恢复边界能保存足够运行事实;暂停、resume、retry、reflection、recovery、complete / fail 和 safe handoff 可追溯且不改写历史。 | stable point、checkpoint chain、recovery decision、runtime outcome、local handoff attempt / gap | 外部 truth repair、Bus delivery、Observed、Artifact / Evidence / acceptance truth不归 Runtime。 |

## 5. 核心能力闭环图

```text
[C-L2R-1 Controlled run + goal/plan]
                    |
                    v
[C-L2R-2 Context + memory mediation]
                    |
                    v
[C-L2R-3 Model decision + turn disposition]
                    |
                    v
[C-L2R-4 Tool / sub-agent action orchestration]
                    |
                    v
[C-L2R-5 Checkpoint + reflection/recovery + handoff]
                    |
                    +---- committed continuation ----+
                    |                                |
                    +--------> C-L2R-1 / C-L2R-2 <---+
```

图示说明:

- 箭头表示能力成立的逻辑依赖和运行语义回环,不是函数调用、事件时序或开发顺序。
- C3 允许形成 `no_model_action / blocked`；C4 允许形成 `no_action / waiting / rejected`，不要求每轮实际外呼。
- C5 保护所有节点的 stable point 与历史不可改写,不是只在运行结束才发生。
- 任一外部 seam 未闭口时,对应分支可以 blocked / unavailable,不得旁路 owner。

## 6. 进入 / 退出条件与条件路径

| 节点 | 进入条件 | 退出条件 | 禁止误写 |
|---|---|---|---|
| C1 | formal trigger、actor / run scope、目标语境可验证 | run 与 goal/plan working context 已成立或明确拒绝 | 把 WorkItem / Process / ImplementationPlan 正文当本地 truth。 |
| C2 | C1 有可推进目标或恢复语境 | context sources、composition、缺口和 working memory 边界可判断 | 复制外部正文、无来源拼 prompt、把检索结果当 truth。 |
| C3 | C2 形成受控 context;允许无可用 model | model decision 与 result / blocked disposition 可关联 | 硬编码 provider、secret、quota、cost;隐藏推理正文持久化。 |
| C4 | C1~C3 形成当前 decision;允许 no-action | action choice、formal preconditions、outcome / unknown / waiting 与 incorporation 可判断 | 直连工具实现、跳过 Governance / Tools / Sandbox、管理子容器。 |
| C5 | 任一节点达到 stable / uncertain / terminal boundary | checkpoint / reflection / recovery / outcome / handoff 形成新事实且历史保留 | commit unknown 自动重试、late result 覆盖历史、delivery 当本地成功。 |

### 6.1 条件路径

- 无需 model 的确定性运行可以由 C2 直接进入 C4 或 C5,但必须保留 decision source。
- Model adapter 不可用时 C3 形成 explicit unavailable / blocked,不任意 fallback。
- Tool action 必须经 Tools canonical contract;Sandbox-required / governed 路径还必须承接相应正式前置。
- Sub-agent 只创建隔离子上下文与逻辑委派;若需要外部 execution carrier,走正式 adapter / Sandbox seam。
- C4 side effect 为 unknown 时,C5 不得自动重试;须恢复到可证明的稳定点或等待正式 outcome。
- Reflection 只能基于已提交事实形成新 decision / memory candidate,不能改写原 turn、Tool outcome 或外部 truth。

## 7. 能力层级划分

| 层级 | 能力 |
|---|---|
| 核心能力 | `C-L2R-1~5` 全部;缺一则 Runtime 不能形成受控可恢复闭环。 |
| 外围增强 | 高级 plan 优化、多 model ensemble、自动长期学习、多 run 趋势分析、rich debugger、interactive replay preview、成本优化建议。 |
| 边界外 | provider control、Tools execution、Hub registry、Method body、Governance truth、Sandbox run、Observability backend、member lifecycle、Artifact body、marketplace / UI。 |

## 8. 功能线索回填映射

| 历史 / 用户主题 | 当前节点 | 处置 |
|---|---|---|
| LLM loop / Goal / Plan | C1 / C3 | 重新从 run / decision 语义推导,不继承 StateGraph 实现。 |
| Prompt / Context / three-layer memory | C2 | 保留主题,重做 owner / source / body 边界。 |
| Model routing | C3 | 逻辑 selection 归 Runtime;physical route / quota / cost 排除。 |
| Tool invocation | C4 | 只做 orchestration;Tools 拥有合同 / outcome。 |
| Sub-agent | C4 | 逻辑 delegation / isolated context;不管理 container / image。 |
| Checkpoint / resume / reflection / recovery | C5 | 以 stable point / unknown side effect / history preservation 收敛。 |
| reasoning trace / event handoff | C3 / C5 | 只保留安全 decision summary / correlation / handoff material,不保存隐藏推理正文。 |

## 9. 能力节点停审清单

| 节点 | 故事 | 功能 | 规则 | 数据 | 接口 | NFR | 验收 | 当前状态 |
|---|---|---|---|---|---|---|---|---|
| C1 | pending Step 8 | pending Step 9 | pending Step 10 | pending Step 11 | pending Step 12 | pending Step 13 | pending Step 14 | node_defined |
| C2 | pending Step 8 | pending Step 9 | pending Step 10 | pending Step 11 | pending Step 12 | pending Step 13 | pending Step 14 | node_defined |
| C3 | pending Step 8 | pending Step 9 | pending Step 10 | pending Step 11 | pending Step 12 | pending Step 13 | pending Step 14 | node_defined |
| C4 | pending Step 8 | pending Step 9 | pending Step 10 | pending Step 11 | pending Step 12 | pending Step 13 | pending Step 14 | node_defined |
| C5 | pending Step 8 | pending Step 9 | pending Step 10 | pending Step 11 | pending Step 12 | pending Step 13 | pending Step 14 | node_defined |

## 10. 当前文档诊断与取舍

不采用旧 C1~C9 作为核心节点,因为它混合内部模块、外部 owner 和实现偏好,且缺少 model physical route、unknown side effect、safe handoff 等当前边界。采用五节点是因为每个节点都能从 Runtime 存在必要性推导,都有独立输入 / 输出 / 失败 / owner 边界,并可在后续形成需求小循环。

## 11. 回填草稿

Runtime 的核心闭环由五个能力共同成立:受控 run 与 goal/plan、context/memory mediation、provider-neutral model decision、tool/sub-agent action orchestration、checkpoint/reflection/recovery 与 outcome handoff。该结构允许 no-model、no-action、blocked 和 unknown 分支,所有外部 truth 均保持 owner 分离;节点顺序只表示需求成立逻辑,不锁实现调用链。

## 12. 自检与门禁

| 检查 | 结果 |
|---|---|
| 能力来自仓存在必要性 | pass |
| 五节点都有进入 / 退出 / owner 边界 | pass |
| 旧模块未直接复用 | pass |
| 条件路径与 fail-closed 完整 | pass |
| 后续小循环锚点已固定 | pass |

```text
gate_status = pass
next_allowed_action = create_step_08_user_stories
formal_document_write_allowed = false
```
