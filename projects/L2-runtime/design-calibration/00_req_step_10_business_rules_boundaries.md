# L2-runtime 00 需求 Step 10: 业务规则与边界约束

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 10 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 边界、Step 7 能力、Step 9 功能 |
| 规则类型 | 不变量 / 禁止行为 / 显式变化 / 边界约束 / 治理与审计约束 |
| 禁止 | 字段级校验实现、repository、事务、协议、技术方案 |

## 1. Step 内计划

| 节点 | 状态 | 规则范围 | gate_status |
|---|---|---|---|
| C1 | done_stop_review | BR-L2R-001~008 | pass |
| C2 | done_stop_review | BR-L2R-009~016 | pass |
| C3 | done_stop_review | BR-L2R-017~024 | pass |
| C4 | done_stop_review | BR-L2R-025~034 | pass |
| C5 | done_stop_review | BR-L2R-035~044 | pass |
| 跨节点审计 | done | 冲突 / 重复 / 越界检查 | pass |

## 2. 规则表

| ID | 类型 | 规则内容 | 约束对象 | 功能映射 |
|---|---|---|---|---|
| `BR-L2R-001` | 不变量 | Runtime run 必须有可验证的主体、scope、目标和来源语境;匿名或无来源输入不得成为正式运行。 | run 受理 | FR-001 |
| `BR-L2R-002` | 显式变化 | run 的启动、暂停、等待、恢复、取消、完成、失败和 unknown 必须显式发生并可追溯。 | run 状态 | FR-001/004/018/020 |
| `BR-L2R-003` | 不变量 | goal / plan working state 必须能回指当前 run 与正式目标 / 定义引用,不得替代 Work / Process / Artifact truth。 | goal / plan | FR-002/003 |
| `BR-L2R-004` | 禁止行为 | Runtime 不得以 summary、prompt 或下游反馈隐式推进未满足目标 / 计划条件。 | plan progression | FR-003/004 |
| `BR-L2R-005` | 边界约束 | waiting、blocked、cancelled、failed、unknown 语义不得互相压平。 | run outcome | FR-004 |
| `BR-L2R-006` | 禁止行为 | 外部系统不可用不得被伪装为 completed、delivered 或 accepted。 | run / handoff | FR-004/020 |
| `BR-L2R-007` | 审计约束 | run / goal / plan 关键变化必须能以安全关联材料追溯,但不得保存外部正文或隐藏推理正文。 | run history | FR-001~004 |
| `BR-L2R-008` | 边界约束 | Runtime 不拥有 ProcessInstance、WorkItem、ImplementationPlan、Method definition 或 Artifact body truth。 | 相邻 owner | FR-002/003 |
| `BR-L2R-009` | 不变量 | Context source 必须带 owner / ref / scope / 时点或等价可验证来源。 | context | FR-005/006 |
| `BR-L2R-010` | 禁止行为 | Runtime 不得从字符串、route、cursor、display text 或私有索引猜测外部 scope / identity。 | source resolution | FR-005 |
| `BR-L2R-011` | 边界约束 | 外部正文、secret、原始 provider response、Tool body、Artifact body 和隐藏推理不得进入 Runtime working / handoff 正文。 | context / material | FR-005/012/020 |
| `BR-L2R-012` | 不变量 | Context composition 必须显式表达 source precedence、scope、freshness、budget、missing 与 conflict。 | context composition | FR-006 |
| `BR-L2R-013` | 禁止行为 | Snapshot、retrieval candidate、summary、projection 或 report 不得自动升级为 source truth。 | memory / context | FR-006/008 |
| `BR-L2R-014` | 不变量 | Working memory、episodic retrieval、semantic retrieval 和 committed durable memory 必须保持语义分层。 | memory | FR-007/008 |
| `BR-L2R-015` | 显式变化 | memory use、candidate、accept / reject、stale、unavailable 和 handoff 必须可区分。 | memory mediation | FR-007/008 |
| `BR-L2R-016` | 边界约束 | Durable memory owner 未闭口时,Runtime 只能形成 retrieval / candidate / ref / gap,不得本地声称长期写入或删除完成。 | durable memory seam | FR-008 |
| `BR-L2R-017` | 不变量 | Model intent 必须由当前 goal、context、约束和运行条件形成,不得由 provider 名称反推。 | model decision | FR-009 |
| `BR-L2R-018` | 边界约束 | model selection 是逻辑运行决定,不等同于 provider route、secret、quota、cost 或 billing truth。 | model / provider | FR-009/010 |
| `BR-L2R-019` | 禁止行为 | Runtime 不得内建 provider registry、默认 provider allowlist、secret fallback 或物理 endpoint。 | provider seam | FR-009/010 |
| `BR-L2R-020` | 不变量 | 每个 model turn 必须有可关联的 run / turn / decision context;迟到结果不得覆盖新决定。 | model turn | FR-011 |
| `BR-L2R-021` | 显式变化 | model result、refusal、timeout、unavailable、unknown 和 adapter mismatch 必须形成可区分 disposition。 | model result | FR-011 |
| `BR-L2R-022` | 禁止行为 | Runtime 不得把 provider raw response 或隐藏 chain-of-thought 当作可观测或业务 truth。 | decision summary | FR-012 |
| `BR-L2R-023` | 审计约束 | decision summary 只能保留安全、最小、可关联的输入来源、选择理由分类和结果状态。 | safe trace | FR-012 |
| `BR-L2R-024` | 边界约束 | Model adapter 未闭口或不可验证时必须 blocked / unavailable,不得任意降级改写运行语义。 | adapter | FR-009~011 |
| `BR-L2R-025` | 不变量 | Action choice 必须回指当前 goal / plan / model disposition 与允许的 action class。 | action decision | FR-013 |
| `BR-L2R-026` | 显式变化 | no-action、wait、Tool action、sub-agent delegation、reject 和 escalation 必须显式区分。 | action choice | FR-013/015/016 |
| `BR-L2R-027` | 禁止行为 | Runtime 不得把 action choice 直接解释为工具已执行、治理已批准或 Sandbox 已成功。 | action / outcome | FR-013~015 |
| `BR-L2R-028` | 边界约束 | Tool action 必须消费 `L2-tools` canonical contract;Runtime 不得复制 ToolDefinition / normalized outcome / ToolAudit truth。 | Tools seam | FR-014 |
| `BR-L2R-029` | 治理约束 | Governed action 只能消费正式 Governance result / safe summary;缺失、冲突、陈旧或不可验证时 fail closed。 | Governance seam | FR-015 |
| `BR-L2R-030` | 安全约束 | Sandbox-required action 不得 host fallback、旁路执行或把 capture 当执行成功。 | Sandbox seam | FR-014/015 |
| `BR-L2R-031` | 不变量 | Sub-agent 必须有父 run 关联、有限 scope、预算、生命周期语义和隔离 working context。 | sub-agent | FR-016 |
| `BR-L2R-032` | 禁止行为 | Sub-agent 不得共享可变 working memory、越过父 scope、无界扩张或直接拥有成员 / 容器 / 镜像生命周期。 | sub-agent | FR-016 |
| `BR-L2R-033` | 显式变化 | Child accepted、running、completed、failed、waiting、unknown 和 result incorporation 必须可区分。 | child delegation | FR-016 |
| `BR-L2R-034` | 边界约束 | Tools、Governance、Sandbox、Capability Hub 的 owner truth 不因 Runtime orchestration 而转移。 | cross-owner | FR-013~016 |
| `BR-L2R-035` | 不变量 | Checkpoint 必须对应可解释 stable point,并包含恢复所需的最小 run / context / decision / side-effect markers。 | checkpoint | FR-017 |
| `BR-L2R-036` | 禁止行为 | checkpoint 不得保存外部正文、secret、隐藏推理或未授权 provider / tool body。 | checkpoint material | FR-017 |
| `BR-L2R-037` | 显式变化 | resume、retry、manual wait、recovery、reflection 和 terminal close 必须形成新决定,不得原地抹写历史。 | recovery | FR-018/019 |
| `BR-L2R-038` | 禁止行为 | commit unknown / side effect unknown 时不得盲重试、重复调用或升格为成功。 | recovery | FR-018 |
| `BR-L2R-039` | 不变量 | late feedback 只能形成新关联事实或待处理状态,不得逆写已提交 Runtime outcome。 | late feedback | FR-018/020 |
| `BR-L2R-040` | 不变量 | Reflection 必须基于已提交事实,生成 candidate / new decision,不得改写原始 turn 或外部 source truth。 | reflection | FR-019 |
| `BR-L2R-041` | 边界约束 | Runtime outcome 与 external delivery、observed、artifact / process / conversation acceptance 必须分层。 | handoff | FR-020 |
| `BR-L2R-042` | 审计约束 | 每个 handoff material / attempt / gap 必须可回链本地 outcome、source、purpose 和关联 run。 | handoff | FR-020 |
| `BR-L2R-043` | 禁止行为 | Bus receipt、Observability observed、Artifact report、外部 ACK 或下游 summary 不得替代 Runtime truth。 | handoff | FR-020 |
| `BR-L2R-044` | 依赖约束 | 任一正向 seam 未闭口时,受影响能力只能 blocked / waiting / degraded / fail-closed,不得声明 ready。 | all nodes | FR-001~020 |

## 3. 规则与功能映射

| 功能族 | 规则范围 | 保护结论 |
|---|---|---|
| FR-001~004 | BR-001~008 | run / goal / plan / state 单一真相与显式变化。 |
| FR-005~008 | BR-009~016 | source-safe context、memory 分层、正文禁止与 owner separation。 |
| FR-009~012 | BR-017~024 | provider-neutral model decision 与安全可解释结果。 |
| FR-013~016 | BR-025~034 | action choice、治理 / 工具 / 隔离前置与 child isolation。 |
| FR-017~020 | BR-035~044 | stable checkpoint、unknown fence、reflection、local-truth-first handoff。 |

## 4. 当前文档诊断与取舍

旧规则只有 shared_rules 优先、tool pre-check、checkpoint、memory 三层和 promote,没有 source resolution、model/provider boundary、unknown side effect、late feedback、handoff status separation。新规则用需求层硬边界保护五能力闭环,将实现细节留给后续文档。

## 5. 回填草稿

正式第 10 章采用 `BR-L2R-001~044`。这些规则约束的是运行行为、truth ownership、失败分层、显式状态变化和安全交接;它们不预设具体字段、协议、存储、重试实现或部署方式。

## 6. 自检与门禁

| 检查 | 结果 |
|---|---|
| 规则有功能 / 边界来源 | pass |
| 无实现校验泄漏 | pass |
| unknown / fail-closed / owner 边界完整 | pass |
| 跨节点规则无明显冲突 | pass |

```text
gate_status = pass
next_allowed_action = create_step_11_data_ownership
formal_document_write_allowed = false
```
