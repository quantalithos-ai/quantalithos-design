# L2-runtime 00 需求 Step 14: 验收标准

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 14 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 7 能力、Step 9 功能、Step 10 规则、Step 11 数据、Step 13 NFR |
| 验收类别 | 核心能力闭环 / 功能 / 规则边界 / 数据归属 / 非功能 |
| 禁止 | 测试结果、真实 run / evidence / verdict / signoff |

## 1. Step 内计划

| 节点 | 状态 | 验收项 | gate_status |
|---|---|---|---|
| C1 | done_stop_review | AC-L2R-001~005 | pass |
| C2 | done_stop_review | AC-L2R-006~010 | pass |
| C3 | done_stop_review | AC-L2R-011~015 | pass |
| C4 | done_stop_review | AC-L2R-016~020 | pass |
| C5 | done_stop_review | AC-L2R-021~025 | pass |
| Cross-cutting | done | AC-L2R-026~030;VF-L2R-001~008 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 闭环何时成立? | 五节点均能在适用依赖就绪或显式 blocked / waiting 条件下形成可追溯语义,且没有 owner 越界、正文泄漏、状态压平或未知副作用盲重试。 |
| 功能如何验收? | 逐项验证 FR 的输入、输出、触发、失败、来源和跨 owner 行为。 |
| 一票否决? | 发生 truth owner 反向写入、fail-open、forbidden body / secret / hidden reasoning 泄漏、Sandbox-required 旁路、unknown side effect 重试、伪造 readiness / evidence 等。 |
| 是否有真实结果? | 没有;当前仅设计验收合同。 |

## 3. 核心能力闭环验收

| ID | 类别 | 验收条件 | 来源 |
|---|---|---|---|
| `AC-L2R-001` | 核心能力 | C1 能从正式 trigger 建立 run / goal / plan working context,并在 invalid / missing / conflict 时显式拒绝或等待。 | C-L2R-1;FR-L2R-001~004;BR-L2R-001~006 |
| `AC-L2R-002` | 核心能力 | C2 能按 owner / ref / scope / freshness / budget 形成 context composition,不把外部正文或 candidate 当 truth。 | C-L2R-2;FR-L2R-005~008;BR-L2R-009~016 |
| `AC-L2R-003` | 核心能力 | C3 能形成 provider-neutral model decision、关联 turn disposition 和安全 summary,不拥有 provider control / hidden body。 | C-L2R-3;FR-L2R-009~012;BR-L2R-017~024 |
| `AC-L2R-004` | 核心能力 | C4 能明确 no-action / Tool / sub-agent / wait / reject,并在 governed / capability / sandbox 前置不明时 fail closed。 | C-L2R-4;FR-L2R-013~016;BR-L2R-025~034 |
| `AC-L2R-005` | 核心能力 | C5 能在 stable point checkpoint、resume / recovery / reflection、形成 local outcome 与分层 handoff,不改写历史。 | C-L2R-5;FR-L2R-017~020;BR-L2R-035~044 |

## 4. 功能能力验收

| ID | 验收条件 | 功能 |
|---|---|---|
| `AC-L2R-006` | run 受理具备正式主体 / scope / goal 来源,匿名或非法输入不进入正式运行。 | FR-001 |
| `AC-L2R-007` | goal / plan progress 能被查询、等待、阻断和恢复,且不冒充 Work / Process truth。 | FR-002/003 |
| `AC-L2R-008` | run 状态能区分 active / waiting / blocked / cancelled / completed / failed / unknown。 | FR-004 |
| `AC-L2R-009` | context source 缺 owner / scope / freshness 或含 forbidden body 时被拒绝、降级或等待。 | FR-005/006 |
| `AC-L2R-010` | working / episodic / semantic mediation 与 candidate / committed durable memory 分层可验证。 | FR-007/008 |
| `AC-L2R-011` | model intent / candidate / selection 能回指 goal / context / constraint,不依赖固定 provider。 | FR-009/010 |
| `AC-L2R-012` | model result / refusal / timeout / unavailable / unknown / mismatch 可区分并与 turn 关联。 | FR-011 |
| `AC-L2R-013` | decision summary 不含 hidden reasoning、secret、raw provider body,但能解释来源与结果分类。 | FR-012 |
| `AC-L2R-014` | action choice 可形成 no-action / Tool / child / wait / reject,且未执行不被声明执行。 | FR-013 |
| `AC-L2R-015` | Tool orchestration 只消费 Tools contract / normalized outcome;Governance / Sandbox seam 缺失时 fail closed。 | FR-014/015 |
| `AC-L2R-016` | sub-agent 具有父子关联、有限 scope / budget、隔离 context 和可区分 child result / unknown。 | FR-016 |
| `AC-L2R-017` | checkpoint 关联 stable point、最小恢复材料和 side-effect marker,不含 forbidden body。 | FR-017 |
| `AC-L2R-018` | resume / retry / recovery 对 unknown side effect 保守处理,不得盲重试或跳过。 | FR-018 |
| `AC-L2R-019` | reflection 基于已提交事实形成新 candidate / decision,原始历史保持可追溯。 | FR-019 |
| `AC-L2R-020` | Runtime outcome、handoff attempt、delivery、observed、downstream acceptance 分层可判定。 | FR-020 |

## 5. 规则 / 边界验收

| ID | 验收条件 | 来源 |
|---|---|---|
| `AC-L2R-021` | 任何外部 source / snapshot / candidate 不会成为第二 Runtime truth owner。 | BR-009~016 |
| `AC-L2R-022` | Tools、Hub、Method、Governance、Sandbox、Observability、Artifact 的 owner boundary 不被 Runtime 写入打穿。 | BR-008/028/034/041~043 |
| `AC-L2R-023` | governed / sandbox-required / capability-bound action 缺正式前置时只产生 reject / wait / blocked / gap。 | BR-029/030/044 |
| `AC-L2R-024` | Runtime 不以下游 summary / receipt / observed / report 逆写 local outcome、checkpoint 或 run status。 | BR-041~043 |
| `AC-L2R-025` | model / memory / tool / child late or duplicate feedback 不会逆写已提交历史。 | BR-020/033/039 |

## 6. 数据归属验收

| ID | 验收条件 | 来源 |
|---|---|---|
| `AC-L2R-026` | Runtime truth 仅覆盖 run、working state、decision、checkpoint / recovery、outcome / local handoff。 | DR Step 11 |
| `AC-L2R-027` | Method / Policy / Tool / Sandbox / Artifact / Identity / Work / Process 只以 ref / safe snapshot 进入。 | DR forbidden body / BR-008/011 |
| `AC-L2R-028` | durable memory 只以 retrieval / candidate / ref / gap 进入,未闭口时不声称长期写入。 | DR memory rows;BR-016 |
| `AC-L2R-029` | secret、raw body、hidden reasoning、capture、report 正文没有进入 Runtime 持久化或 handoff。 | DR forbidden body;NFR-007 |
| `AC-L2R-030` | candidate、snapshot、projection、summary、report 与 committed truth 的生命周期和 owner 可区分。 | DR rows;BR-013/015 |

## 7. 非功能验收

| ID | 验收条件 | 来源 |
|---|---|---|
| `AC-L2R-031` | 固定 workload / dependency profile 下可分解本地处理、外部等待、模型、memory、tool、Sandbox、handoff 阶段;不使用无来源阈值。 | NFR-001~003 |
| `AC-L2R-032` | 依赖不可用时状态、历史、失败 / waiting / degraded 语义可判别且不伪造成功。 | NFR-004~006 |
| `AC-L2R-033` | 安全材料通过 body-free / redaction / secret / hidden reasoning 检查;发现违规不得放行。 | NFR-007~009;NFR-017 |
| `AC-L2R-034` | run / turn / source / action / checkpoint / outcome / handoff 可以安全关联追溯。 | NFR-010~012 |
| `AC-L2R-035` | duplicate / late / unknown / out-of-order 输入不造成 truth 分叉或重复不可逆副作用。 | NFR-013~015 |
| `AC-L2R-036` | low-cardinality safe observation / event material 可形成,但 observed / backend readiness 未被静态设计伪造。 | NFR-016~019 |

## 8. 一票否决项

| ID | 一票否决条件 |
|---|---|
| `VF-L2R-001` | Runtime 自建或反写 Tools、Capability Hub、Method、Governance、Sandbox、Observability、Artifact 或 provider truth。 |
| `VF-L2R-002` | governed / sandbox-required action 在正式前置缺失或 unknown 时仍 default allow / host fallback。 |
| `VF-L2R-003` | Runtime 保存或交接 secret、token、raw external body、Sandbox capture、Artifact / Evidence body 或 hidden chain-of-thought。 |
| `VF-L2R-004` | commit unknown / side-effect unknown 被自动重试、重复执行或宣告成功。 |
| `VF-L2R-005` | delivery / observed / receipt / downstream acceptance 被写成本地 Runtime outcome 或 checkpoint truth。 |
| `VF-L2R-006` | fake / planned / blocked / not_run / pending 被伪装成真实 positive integration、evidence、readiness 或验收通过。 |
| `VF-L2R-007` | 非 Core sibling 被加入 package / Cargo 依赖,或事件 / runtime / ref / adapter 关系被伪装成编译期依赖。 |
| `VF-L2R-008` | 状态、来源、字段、错误、测试或实施边界无法回指正式需求 / owner,必须实现 agent 猜测。 |

## 9. 当前文档诊断与取舍

旧验收以 C1~C9、固定阈值和“主功能通过”为主,没有 unknown / owner / body / handoff VETO。当前验收以五能力、结构性断言和一票否决为中心,不填写任何执行结果、evidence alias 或签署。

## 10. 回填草稿

正式第 14 章采用 `AC-L2R-001~036` 与 `VF-L2R-001~008`。这些是未来验收合同,不是当前验收报告;真实送验必须由同一固定 baseline、run、artifact / report 与 review 事实支撑。

## 11. 自检与门禁

| 检查 | 结果 |
|---|---|
| 核心功能 / 规则 / 数据 / NFR 全有验收 | pass |
| VETO 覆盖 owner、security、unknown、dependency、truthfulness | pass |
| 无测试结果 / 签署事实 | pass |

```text
gate_status = pass
next_allowed_action = create_step_15_risks_open_questions
formal_document_write_allowed = false
```
