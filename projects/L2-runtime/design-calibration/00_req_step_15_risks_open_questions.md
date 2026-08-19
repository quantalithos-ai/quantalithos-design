# L2-runtime 00 需求 Step 15: 风险与待确认事项

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 15 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 6 / 10 / 12 / 14 与全局上游台账 |
| 目标 | 显式收纳风险、影响和未闭合问题 |
| 禁止 | 用 TODO 代替风险、用“未定”伪造状态、在本步补方案或实现事实 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 风险清单 | done | 12 风险 | pass |
| 待确认事项 | done | 11 open questions | pass |
| blocker 分层 | done | 当前 / 后续阻塞表 | pass |
| 历史冲突复核 | done | 旧材料回流防线 | pass |
| 回填与自检 | done | 第 15 章候选 | pass |

## 2. 风险清单

| ID | 风险 | 影响范围 | 当前处理口径 | 当前状态 |
|---|---|---|---|---|
| `R-L2R-001` | Runtime loop 与下游 Member / Product 入口边界未共同校准 | C1、IF-001~003、后续 01 | 只按 Runtime 逻辑入口定义,下游未校准状态不反向定义需求。 | open_boundary |
| `R-L2R-002` | Tools canonical invocation 到 Runtime action feedback 的正向 mapping 尚未闭合 | C4、IF-009/011、AC-015 | 只保留 consumer / adapter seam;mapping 未闭口时 no-execution / blocked。 | open_upstream_contract |
| `R-L2R-003` | Governance authorization / policy source matrix 与 Runtime action gate 未共同闭口 | C4、BR-029、VF-002 | Runtime 只消费 formal result;unknown fail closed。 | open_upstream_contract |
| `R-L2R-004` | Sandbox-required action 的 generic mapping、receipt、feedback、cleanup seam 未闭口 | C4/C5、AC-004/015 | 不声明 run / receipt / execution success;只保留 blocked-aware seam。 | open_upstream_contract |
| `R-L2R-005` | Observability producer / source / route / workspace readiness 未闭口 | C3/C5、IF-008/014/015 | 只形成 safe material eligibility、local attempt / gap,不声明 observed。 | open_integration_boundary |
| `R-L2R-006` | Runtime-specific Core shared schema / event schema 未闭口 | 全链字段与协议 | 只引用 Core 类型类别;不本地 shadow。 | upstream_contract_candidate |
| `R-L2R-007` | Model provider adapter、secret、route、quota、cost owner 未闭口 | C3、NFR-001~003 | Runtime 只定义 provider-neutral intent / decision;正向 adapter blocked。 | owner_pending |
| `R-L2R-008` | Durable episodic / semantic memory owner、正文、索引、保留和写入 feedback 未闭口 | C2、FR-008、DR memory | working-only / retrieval candidate / unavailable;不声称 durable write。 | owner_pending |
| `R-L2R-009` | Checkpoint persistence / atomicity / commit-unknown 具体契约未闭口 | C5、FR-017/018 | 需求只锁 stable point 与 unknown fence;详细设计必须补 source / transaction。 | design_pending |
| `R-L2R-010` | Hidden reasoning / decision summary 安全边界被实现误解 | C3/C5、NFR-007/017 | 只允许 safe decision summary;隐藏思维正文禁止进入 truth / handoff。 | safety_boundary |
| `R-L2R-011` | 下游未校准仓将 Runtime status 当作 Process / Work / Artifact truth | C1/C5、handoff | 正式 ref / summary / event 必须带 owner 与消费语义;不反向写入。 | downstream_boundary |
| `R-L2R-012` | 旧 README / 旧 Runtime 正式链回流 Python、框架、SLA、对象或 API | 全链 | historical material 只作差异审计;若回流必须回退对应 Step。 | historical_pollution |

## 3. 待确认事项

| ID | 待确认事项 | 影响 Step / 文档 | 当前如何挂起 |
|---|---|---|---|
| `Q-L2R-001` | Runtime 逻辑入口与 member / product 触发边界的正式 owner / consumer surface | 01 / 02 / 03 / 05 | 当前只保留 capability-level runtime entry。 |
| `Q-L2R-002` | Runtime-specific Core shared types、error、metadata、event envelope 的最小正式集合 | 01 / 03 | 仅引用类别,等待 Core authority。 |
| `Q-L2R-003` | Tool invocation / feedback / normalized outcome 与 Runtime action incorporation 的 mapping | 02 / 03 / 05 / 06 | 以 `L2-tools` pending seam 约束;不得从旧文档猜测。 |
| `Q-L2R-004` | Governed action authorization owner、source priority 与高风险 taxonomy | 01~06 | 保持 external result required,unknown fail closed。 |
| `Q-L2R-005` | Sandbox generic execution / capture / failure / receipt / cleanup adapter contract | 02~07 | 只表达 requirement / blocked / handoff attempt。 |
| `Q-L2R-006` | Observability safe material producer / source / route / event schema / readiness | 01~07 | 只形成 body-free local material / gap。 |
| `Q-L2R-007` | Model adapter capability、route、secret / quota / cost ownership | 01~05 | provider-neutral intent,positive path pending。 |
| `Q-L2R-008` | Durable memory truth owner、body-free read、candidate write、retention / deletion | 02~07 | working memory + retrieval candidate only。 |
| `Q-L2R-009` | Checkpoint persistence source、transaction / UoW、version、commit-unknown semantics | 03~07 | 需求只锁 stable point / no blind retry。 |
| `Q-L2R-010` | Runtime event / handoff exact source family 与 downstream consumption semantics | 03~07 | event collaboration remains pending / fail closed。 |
| `Q-L2R-011` | 是否在后续需求修订中纳入外围 analytics / replay / learning candidate | 04 / 05 / 07 | 当前不阻塞核心,按外围增强挂起。 |

## 4. 当前不阻塞项与后续阻塞项

| 分类 | 当前结论 |
|---|---|
| 不阻塞本需求成文 | API / DTO / object schema、具体框架 / 语言 / 部署、性能数字、真实 environment、测试执行、artifact / report / acceptance evidence、SDK client、外围增强版本。 |
| 阻塞后续正向设计 / qualification | 上述 `R-L2R-002~009` 对应的 mapping、source、schema、adapter、persistence、event / route、真实 provider / memory / Sandbox / Observability readiness。 |
| 任何时候立即回写需求 | 发生 owner 反转、Runtime 保存 forbidden body、fail-open、Tools / Sandbox / Governance truth 被本地复制、旧 execution-instance 主线回流。 |

## 5. 历史材料回流防线

| 回流项 | 处置 |
|---|---|
| Python / LangGraph / Temporal / fixed provider | 回到 Step 2 / 4 / 7 重新审计,不得直接成为结论。 |
| C1~C9、ExecutionInstance、Process backflow | 只能作为历史候选;若成为核心需重开 Step 7~16。 |
| `F-001~F-012`、旧 API / event / error / SLA | 不直接映射新 FR / AC;新结论必须有当前 source。 |
| 旧测试结果、acceptance、run / evidence / signoff | 一律不承认,当前没有执行事实。 |

## 6. 当前文档诊断与取舍

风险表不把开放 seam 写成“未定”一句话,而是记录影响、当前约束和状态;待确认表不预设最终 owner。这样既保留需求设计完整性,又不把 blocker 偷藏在后续实施阶段。

## 7. 回填草稿

正式第 15 章将保留 12 项风险、11 项待确认事项及当前 / 后续阻塞分层。所有正向 seam 仍为 pending / blocked;它们不阻塞本需求结构完成,但必须阻塞受影响的 schema、配置、测试、实施和 readiness 声明。

## 8. 自检与门禁

| 检查 | 结果 |
|---|---|
| 风险与待确认分表 | pass |
| 处理口径不是方案脑补 | pass |
| blocker 影响范围明确 | pass |
| 没有真实 readiness / evidence | pass |

```text
gate_status = pass
next_allowed_action = create_step_16_traceability_matrix
formal_document_write_allowed = false
```
