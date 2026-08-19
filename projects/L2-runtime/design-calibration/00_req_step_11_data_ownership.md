# L2-runtime 00 需求 Step 11: 数据需求与数据归属

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 11 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 边界、Step 9 功能、Step 10 规则 |
| 数据分类 | Runtime truth / snapshot / ref / derived-candidate / forbidden body |
| 禁止 | 字段、表、索引、serialization、数据库或外部正文设计 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| C1 data | done_stop_review | run / goal / plan truth | pass |
| C2 data | done_stop_review | context / memory boundary | pass |
| C3 data | done_stop_review | model intent / decision summary | pass |
| C4 data | done_stop_review | action / delegation / outcome refs | pass |
| C5 data | done_stop_review | checkpoint / recovery / handoff | pass |
| cross-node audit | done | no multiple truth owner | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Runtime 拥有什么 truth? | Runtime run / loop status、goal / plan working state、context composition decision、working memory、model intent / selection / turn disposition、action choice / delegation、checkpoint / recovery decision、Runtime outcome 和本地 handoff attempt / gap。 |
| 哪些是 snapshot? | 外部 method / role / process、governance decision / policy、capability / tool、sandbox、artifact / work、identity、model / memory availability 的安全摘要。 |
| 哪些是 ref? | 外部 source、goal / plan / method、tool / capability、governance、sandbox run / material、memory item、artifact / evidence、event / handoff、child run 的 typed refs。 |
| 禁止保存什么正文? | method / role / process body、Policy / Decision body、Tool / provider raw body、Sandbox capture、Artifact / Evidence / report、secret / token / hidden chain-of-thought、durable memory body。 |

## 3. 数据归属总表

| 数据项 | 类型 | Runtime 归属说明 | 生命周期口径 | 来源功能 / 规则 |
|---|---|---|---|---|
| Runtime run identity / scope | truth | Runtime 拥有一次运行的逻辑身份与范围语义。 | 从受理到终止 / tombstone,历史可追溯。 | FR-001/004;BR-001/002 |
| Run status / disposition | truth | Runtime 拥有 active / waiting / blocked / cancelled / completed / failed / unknown 等运行语义。 | 显式变化,不可被下游状态覆盖。 | FR-004;BR-002/005 |
| Goal working state | truth | Runtime 拥有当前 run 的目标分解与推进工作态,不拥有正式业务目标正文。 | 随 run 变化;历史决定保留。 | FR-002;BR-003 |
| Plan working state / progress decision | truth | Runtime 拥有运行中计划步骤、依赖、条件与推进判断;正式 Work / Process / ImplementationPlan 仍外部拥有。 | 可 checkpoint / recover;新事实不抹历史。 | FR-003;BR-003/004 |
| Context composition decision | truth | Runtime 拥有本次 turn 选择、排序、裁剪、预算与缺口判断。 | 绑定 run / turn;可重建但决定须可解释。 | FR-006;BR-012 |
| Working memory | truth | Runtime 拥有当前 run / sub-context 的短期工作项、observation、pending input、decision candidate。 | request / session / run scope;不自动长期化。 | FR-007;BR-014 |
| Episodic / semantic retrieval request | truth | Runtime 拥有“请求什么、为何使用、结果如何影响 decision”的 mediation 事实。 | 绑定 turn / run;不可替代外部记忆正文。 | FR-008;BR-015 |
| Memory candidate / handoff | derived-candidate | Runtime 可形成候选与交接状态,不提交 durable truth。 | candidate 可拒绝、过期或 pending;外部 owner 决定。 | FR-L2R-008;FR-L2R-E04;BR-L2R-016 |
| Method / role / process safe snapshot | snapshot | 只读消费的定义摘要,源 truth 归 Method Library。 | 带来源 / 版本 / freshness;失效时 blocked / degraded。 | FR-005;BR-009/013 |
| Governance decision / policy safe snapshot | snapshot | 只读消费 effective result / summary,source truth 归 Governance。 | 以适用时点和 scope 使用;不可本地升级。 | FR-005/015;BR-029 |
| Tool / capability safe snapshot | snapshot | 只读消费 Tool contract、capability identity / exposure 摘要,源 truth 归 Tools / Hub。 | 受版本 / freshness / applicability 约束。 | FR-005/014;BR-028 |
| Artifact / Work / Identity ref / summary | ref / snapshot | Runtime 只保留正式引用与必要 safe summary,不拥有正文。 | 随 run / goal / plan 关联;解析失败显式。 | FR-001/002/005;BR-008 |
| Model intent / candidate / selection decision | truth | Runtime 拥有 provider-neutral intent、候选约束与逻辑选择决定。 | 绑定 turn;迟到 adapter result 不改选择历史。 | FR-009/010;BR-017/018 |
| Model turn result / disposition | truth | Runtime 拥有关联的 semantic disposition,不拥有 provider raw response。 | result / refusal / timeout / unknown 可区分。 | FR-011/012;BR-020/021 |
| Tool action choice | truth | Runtime 拥有 action choice 与 incorporation decision,不拥有 Tool invocation outcome。 | 绑定 run / plan / decision;no-action 也需记录。 | FR-013;BR-025/026 |
| Tool invocation / result / error ref | ref / snapshot | Runtime 只保存调用关联和 Tools normalized outcome 的安全引用 / 摘要。 | 外部结果不可用时保持 waiting / unknown。 | FR-014;BR-027/028 |
| Sub-agent delegation / child result | truth + ref | Runtime 拥有父子委派关系、scope / budget、child disposition 与 incorporation decision。 | child history 可追踪;共享 mutable working body 禁止。 | FR-016;BR-031~033 |
| Checkpoint / stable point | truth | Runtime 拥有恢复所需的最小运行、context、decision、action marker 与下一步语境。 | append / versioned / recoverable;不可保存 forbidden body。 | FR-017;BR-035/036 |
| Recovery / reflection decision | truth | Runtime 拥有基于历史形成的新恢复 / 反思决定,不改写原事件。 | 每次新决定可回链原始事实。 | FR-018/019;BR-037~040 |
| Runtime outcome / terminal summary | truth | Runtime 拥有本地运行终态与安全摘要,不等于外部 accepted / delivered。 | terminal 后保留历史;外部回流独立。 | FR-020;BR-041/043 |
| Handoff material / submission attempt / gap | truth + derived | Runtime 拥有是否准备、尝试、失败 / gap 的本地事实;Bus / Obs / Artifact 结果归各自 owner。 | 可重入形成新 attempt,不逆写 outcome。 | FR-020;BR-042/043 |

## 4. 禁止保存正文表

| 禁止正文 | 原因 | 正确形态 |
|---|---|---|
| Method / Role / Process definition body | Definition truth 归 Method Library | typed ref / safe definition snapshot |
| Governance Decision / Policy / approval body | Governance truth 归 Governance | result ref / safe applicability summary |
| ToolDefinition / provider raw response / external API body | Tools / Hub / provider owner | Tool contract ref / normalized outcome summary |
| Sandbox stdout / stderr / file / capture / run body | Sandbox isolation / material truth | run / capture / failure ref + safe summary |
| Artifact / Evidence / report / baseline body | Artifact truth归 Artifact | artifact / evidence / lineage ref |
| Durable episodic / semantic memory body | 外部 memory owner 未闭口 | retrieval ref / candidate / availability marker |
| secret、token、credential、raw headers | 安全与最小暴露 | secret reference / redacted marker |
| hidden chain-of-thought / full private reasoning | 安全与审计边界 | decision summary / reason category / source links |

## 5. 数据与功能 / 规则映射

| 数据族 | 功能 | 规则 |
|---|---|---|
| run / goal / plan | FR-001~004 | BR-001~008 |
| context / memory | FR-005~008 | BR-009~016 |
| model | FR-009~012 | BR-017~024 |
| action / child | FR-013~016 | BR-025~034 |
| checkpoint / recovery / handoff | FR-017~020 | BR-035~044 |

## 6. 当前文档诊断与取舍

旧数据章节把 GoalStack、WorkingMemory、EpisodicRef、SemanticRef、Checkpoint、ReasoningTrace 和 ImplementationPlanRef 当作固定实体,并写 vector store / archive / observability 生命周期。当前重新按 truth / snapshot / ref / candidate / forbidden body 分类,保留 Runtime 必须解释的运行数据,将外部正文和长期 owner 交回相邻仓。

## 7. 回填草稿

正式第 11 章将采用本文件数据归属总表和禁止正文表。Runtime 只拥有运行决策与恢复相关 truth;相邻定义、治理、工具、隔离、制品、记忆和 provider 内容只能以 typed ref、安全摘要、候选或 handoff 状态进入。

## 8. 自检与门禁

| 检查 | 结果 |
|---|---|
| 四类 / 五类数据边界完整 | pass |
| 没有多个 truth owner | pass |
| forbidden body 显式列出 | pass |
| 未滑入字段 / 表结构 | pass |

```text
gate_status = pass
next_allowed_action = create_step_12_interfaces_dependencies
formal_document_write_allowed = false
```
