# L2-runtime 00 需求 Step 16: 需求追溯矩阵

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 16 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 7~15 全部校准产物、项目执行台账、全局依赖裁剪规则 |
| 主轴 | 以功能需求为主轴,逐项连接能力、故事、规则、数据归属和验收 |
| 审计范围 | 孤儿故事 / 功能 / 规则 / 数据 / 接口 / 验收、重复定义、边界串线 |
| 禁止 | 在矩阵中新增需求、字段、协议、实现、测试结果或 readiness |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 能力到故事覆盖 | done | C-L2R-1~5 -> US-L2R-001~015 / E01~E04 | pass |
| 功能主矩阵 | done | FR-L2R-001~020 / E01~E04 | pass |
| 规则 / 数据 / 接口 / 验收覆盖 | done | 六列主追溯矩阵 | pass |
| 孤儿与重复审计 | done | 六类漏项检查、重复定义、边界串线 | pass |
| 正式回填门禁 | done_stop_review | Step 17 装配输入 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否每个能力都有故事、功能和验收? | 是。C1~C5 各有 3~4 个核心功能,核心能力验收为 AC-L2R-001~005,功能验收为 AC-L2R-006~020。 |
| 是否每个功能都有规则和数据归属? | 是。主矩阵为每个 FR 指定既有 BR 和 Step 11 数据项;外围增强复用已有边界规则,不新增规则。 |
| 外围增强如何追溯? | E01~E04 仍有用户故事和能力节点,但只使用既有结构性规则 / 验收作为边界合同,不升级为核心闭环或正向 readiness。 |
| 矩阵是否解决跨仓冲突? | 只做映射。所有 owner、依赖类型和 blocker 仍以 Step 1/6/11/12/15 为准,不在本步重新定义。 |

## 3. 主追溯矩阵

> 映射单元只引用前文已定义的 ID 或 Step 11 数据项名称。`~` 表示连续编号范围,不表示新增条目。

| 功能需求 | 支撑的核心能力闭环 | 对应的用户故事 | 对应的业务规则 | 对应的数据归属要求 | 对应的验收标准 |
|---|---|---|---|---|---|
| `FR-L2R-001` Runtime run 受理与范围建立 | `C-L2R-1` | `US-L2R-001` | `BR-L2R-001~002` | Runtime run identity / scope | `AC-L2R-001`,`AC-L2R-006` |
| `FR-L2R-002` Goal 形成与目标约束维护 | `C-L2R-1` | `US-L2R-001~002` | `BR-L2R-003` | Goal working state | `AC-L2R-001`,`AC-L2R-007` |
| `FR-L2R-003` Plan working state 推进 | `C-L2R-1` | `US-L2R-002~003` | `BR-L2R-003~004` | Plan working state / progress decision | `AC-L2R-001`,`AC-L2R-007` |
| `FR-L2R-004` Run 状态与终止语义 | `C-L2R-1` | `US-L2R-003` | `BR-L2R-002`,`BR-L2R-005~006` | Run status / disposition | `AC-L2R-001`,`AC-L2R-008` |
| `FR-L2R-005` 正式上下文引用受理 | `C-L2R-2` | `US-L2R-004` | `BR-L2R-009~011` | 外部 safe snapshot / ref | `AC-L2R-002`,`AC-L2R-009` |
| `FR-L2R-006` Context composition | `C-L2R-2` | `US-L2R-005` | `BR-L2R-012~013` | Context composition decision | `AC-L2R-002`,`AC-L2R-009` |
| `FR-L2R-007` Working memory 管理 | `C-L2R-2` | `US-L2R-005~006` | `BR-L2R-014~015` | Working memory | `AC-L2R-002`,`AC-L2R-010` |
| `FR-L2R-008` Episodic / semantic retrieval mediation | `C-L2R-2` | `US-L2R-004`,`US-L2R-006` | `BR-L2R-013~016` | Episodic / semantic retrieval request; Memory candidate / handoff | `AC-L2R-002`,`AC-L2R-010`,`AC-L2R-028` |
| `FR-L2R-009` Model intent 形成 | `C-L2R-3` | `US-L2R-007` | `BR-L2R-017~019`,`BR-L2R-024` | Model intent / candidate / selection decision | `AC-L2R-003`,`AC-L2R-011` |
| `FR-L2R-010` Model candidate 选择与约束解释 | `C-L2R-3` | `US-L2R-007`,`US-L2R-009` | `BR-L2R-017~019`,`BR-L2R-023~024` | Model intent / candidate / selection decision | `AC-L2R-003`,`AC-L2R-011` |
| `FR-L2R-011` Model turn 编排与结果关联 | `C-L2R-3` | `US-L2R-008` | `BR-L2R-020~021`,`BR-L2R-024` | Model turn result / disposition | `AC-L2R-003`,`AC-L2R-012` |
| `FR-L2R-012` 安全 decision summary | `C-L2R-3` | `US-L2R-009` | `BR-L2R-011`,`BR-L2R-022~023` | Model turn result / disposition; safe handoff material | `AC-L2R-003`,`AC-L2R-013` |
| `FR-L2R-013` Action choice | `C-L2R-4` | `US-L2R-010` | `BR-L2R-025~027` | Tool action choice; Action choice / incorporation decision | `AC-L2R-004`,`AC-L2R-014` |
| `FR-L2R-014` Tool invocation orchestration | `C-L2R-4` | `US-L2R-011` | `BR-L2R-027~028`,`BR-L2R-030` | Tool invocation / result / error ref | `AC-L2R-004`,`AC-L2R-015` |
| `FR-L2R-015` Governance / execution precondition gate | `C-L2R-4` | `US-L2R-010~011` | `BR-L2R-029~030`,`BR-L2R-034`,`BR-L2R-044` | Governance decision / policy safe snapshot; Tool / capability safe snapshot; Sandbox safe material | `AC-L2R-004`,`AC-L2R-015`,`AC-L2R-023` |
| `FR-L2R-016` Sub-agent delegation | `C-L2R-4` | `US-L2R-012` | `BR-L2R-031~034` | Sub-agent delegation / child result | `AC-L2R-004`,`AC-L2R-016` |
| `FR-L2R-017` Checkpoint 与 stable point 管理 | `C-L2R-5` | `US-L2R-013` | `BR-L2R-035~036` | Checkpoint / stable point | `AC-L2R-005`,`AC-L2R-017` |
| `FR-L2R-018` Resume / retry / recovery decision | `C-L2R-5` | `US-L2R-013~014` | `BR-L2R-037~039`,`BR-L2R-044` | Recovery / reflection decision; checkpoint / stable point | `AC-L2R-005`,`AC-L2R-018` |
| `FR-L2R-019` Reflection 与新决定形成 | `C-L2R-5` | `US-L2R-014` | `BR-L2R-037`,`BR-L2R-040` | Recovery / reflection decision; Memory candidate / handoff | `AC-L2R-005`,`AC-L2R-019` |
| `FR-L2R-020` Runtime outcome 与事件 handoff | `C-L2R-5` | `US-L2R-015` | `BR-L2R-041~044` | Runtime outcome / terminal summary; Handoff material / submission attempt / gap | `AC-L2R-005`,`AC-L2R-020`,`AC-L2R-024`,`AC-L2R-036` |
| `FR-L2R-E01` 策略 / model / plan 实验比较 | `C-L2R-1`,`C-L2R-3` | `US-L2R-E01` | `BR-L2R-013`,`BR-L2R-017~018`,`BR-L2R-040` | Plan working state / progress decision; Model intent / candidate / selection decision | `AC-L2R-011`,`AC-L2R-019` |
| `FR-L2R-E02` Interactive replay preview | `C-L2R-2`,`C-L2R-5` | `US-L2R-E02` | `BR-L2R-037`,`BR-L2R-039`,`BR-L2R-043` | Context composition decision; Checkpoint / stable point; Runtime outcome / terminal summary | `AC-L2R-018`,`AC-L2R-019`,`AC-L2R-036` |
| `FR-L2R-E03` 跨 run 诊断与趋势摘要 | `C-L2R-3`,`C-L2R-5` | `US-L2R-E03` | `BR-L2R-018~019`,`BR-L2R-041~043` | Model intent / candidate / selection decision; safe handoff material | `AC-L2R-011`,`AC-L2R-031`,`AC-L2R-036` |
| `FR-L2R-E04` Reflection candidate handoff | `C-L2R-2`,`C-L2R-5` | `US-L2R-E04` | `BR-L2R-016`,`BR-L2R-040`,`BR-L2R-044` | Memory candidate / handoff | `AC-L2R-019`,`AC-L2R-028`,`AC-L2R-036` |

### 3.1 能力与故事覆盖检查

| 能力节点 | 核心功能 | 核心故事 | 核心能力验收 | 结论 |
|---|---|---|---|---|
| `C-L2R-1` | `FR-L2R-001~004` | `US-L2R-001~003` | `AC-L2R-001` | 完整 |
| `C-L2R-2` | `FR-L2R-005~008` | `US-L2R-004~006` | `AC-L2R-002` | 完整 |
| `C-L2R-3` | `FR-L2R-009~012` | `US-L2R-007~009` | `AC-L2R-003` | 完整 |
| `C-L2R-4` | `FR-L2R-013~016` | `US-L2R-010~012` | `AC-L2R-004` | 完整 |
| `C-L2R-5` | `FR-L2R-017~020` | `US-L2R-013~015` | `AC-L2R-005` | 完整 |

## 4. 漏项检查表

| 检查项 | 结果 | 证据 / 结论 |
|---|---|---|
| 是否存在没有故事来源的功能需求 | 否 | `FR-L2R-001~020` 与 `FR-L2R-E01~E04` 均在主矩阵有唯一或明确多故事来源。 |
| 是否存在没有闭环映射的功能需求 | 否 | 每项功能均映射到 `C-L2R-1~5`;外围项明确标记为增强。 |
| 是否存在没有规则保护的核心功能 | 否 | 每个核心 FR 至少有一条 `BR-L2R-*`;跨节点规则由 `BR-L2R-044` 收口。 |
| 是否存在没有数据归属的功能需求 | 否 | 每个 FR 均指向 Step 11 已列数据项;不得用本矩阵发明字段。 |
| 是否存在没有接口承接的功能需求 | 否 | `FR-L2R-001~020` 由 `IF-L2R-001~015` 按能力族承接;外围项只使用既有查询 / safe-material seam。 |
| 是否存在孤儿接口 | 否 | `IF-L2R-001~015` 均在 Step 12 的功能映射中承接至少一个 `FR-L2R-*`;本矩阵不新增接口。 |
| 是否存在没有验收标准的功能需求 | 否 | 核心 FR 有 `AC-L2R-001~020`;外围增强复用既有边界性 AC,不构成真实执行结果。 |
| 是否存在孤儿用户故事 | 否 | `US-L2R-001~015` 与 `US-L2R-E01~E04` 均至少映射一个 FR。 |
| 是否存在孤儿规则 | 否 | `BR-L2R-001~044` 均在 Step 10 功能映射或主矩阵中被承接。 |
| 是否存在孤儿数据项 | 否 | Step 11 数据表每一项均有 FR / BR 来源;禁止正文表作为全局安全约束被 AC 承接。 |
| 是否存在孤儿验收项 | 否 | `AC-L2R-001~036` 均回指能力、FR、BR、数据或 NFR; `VF-L2R-001~008` 作为全局否决门禁。 |
| 是否存在未进入前文结构却出现在矩阵中的新项 | 否 | 矩阵只使用 Step 7~15 已出现的编号和数据项名称; Step 11 的 `FR-E04` 笔误已归一为 `FR-L2R-E04`, Step 14 未定义的 `G-001~005` 已归一为 `C-L2R-1~5`。 |

## 5. 重复定义审计

| 审计对象 | 结果 | 处理结论 |
|---|---|---|
| run / goal / plan truth | 无重复 owner | Runtime 只持有 working truth;Work / Process / Artifact / Method 正文仍为外部 owner。 |
| context / memory | 无重复 owner | working memory 与 durable memory、retrieval candidate 分层;不把 candidate 升级为 truth。 |
| model choice / provider route | 无重复 owner | Runtime 只持有 provider-neutral intent / logical selection;route / secret / quota / cost 留在 adapter / 外部 owner。 |
| action / tool execution / sandbox run | 无重复 owner | Runtime 只拥有 choice / orchestration / incorporation;Tools、Governance、Sandbox 持有各自执行与前置 truth。 |
| checkpoint / event / observed / acceptance | 无重复 owner | checkpoint 和 local handoff 属 Runtime;Bus delivery、Observability observed、下游 acceptance 不回写。 |
| 核心与外围需求 | 无重复定义 | E01~E04 仅是只读 / 实验 / handoff 增强,不复制核心 FR 或改变核心状态。 |

## 6. 边界串线审计

| 串线候选 | 结果 | 约束 |
|---|---|---|
| Runtime -> `L2-tools` execution truth | 未发现 | 仅消费 canonical invocation / normalized outcome,正向 seam 未闭口即 blocked。 |
| Runtime -> `L3-capability-hub` registry / adapter truth | 未发现 | 仅消费 identity / descriptor / formal exposure ref 或安全摘要。 |
| Runtime -> `L3-method-library` definition body | 未发现 | 只消费 method / role / process ref / safe view;当前 `03-详细设计.md` 未提交改动作为 blocker 保留。 |
| Runtime -> `L1-governance` approval / policy truth | 未发现 | 只消费正式 Decision / Policy effective result;unknown fail closed。 |
| Runtime -> `L4-sandbox` isolation / capture truth | 未发现 | 不 host fallback,不把 capture 当成功,不补 receipt / cleanup mapping。 |
| Runtime -> `L4-observability` backend / observed truth | 未发现 | 只形成 safe material、attempt / gap,不声称 observed。 |
| Runtime -> `L1-artifact`正文 / evidence / report truth | 未发现 | 只保留 ref / safe summary / handoff。 |
| Runtime -> member-service / member-images / marketplace / product entry | 未发现 | 作为下游或边界外职责记录,不进入核心需求。 |
| compile / runtime / event / ref / adapter / fake 混用 | 未发现 | 只有 `L0-core` 为编译期候选;其他关系按 Step 6 分类。 |

## 7. 当前文档诊断与取舍

旧正式文档只覆盖部分 C1~C9、接口和固定指标,没有可审计的双向矩阵,且外围项目与运行真相边界混杂。本步不修补旧编号,而是使用当前 Step 7~15 已收口的五能力和编号集合建立新主轴。外围增强项之所以复用 AC,是为了给只读 / 候选路径保留可判定边界,不代表它们已有实现或正向验收结果。

## 8. 回填草稿

正式第 16 章将回填本文件的主追溯矩阵、能力覆盖表、漏项检查、重复定义审计和边界串线审计。矩阵只表达追溯关系;风险、待确认事项和 upstream blocker 仍由第 15 章及项目级台账承载。

## 9. 自检与门禁

| 检查 | 结果 |
|---|---|
| 主矩阵以功能需求为主轴 | pass |
| 五个核心能力均有完整故事 / 功能 / 规则 / 数据 / 接口 / 验收闭环 | pass |
| 核心与外围项均有来源,无新发明项 | pass |
| 六类孤儿项均显式检查并归零 | pass |
| 重复定义与跨仓串线显式审计 | pass |
| 没有实现、测试结果、evidence、readiness 或签署事实 | pass |

```text
gate_status = pass
next_allowed_action = create_step_17_formal_document_assembly
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_17_pass
```
