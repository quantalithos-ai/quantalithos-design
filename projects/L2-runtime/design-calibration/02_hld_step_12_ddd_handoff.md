# L2-runtime 02 概要 Step 12: 详细设计承接清单

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `02-概要设计.md` 第 12 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4~11 已完成的主体、组成部分、对象、接口、处理流、状态、异常和配置影响中间产物 |
| 目标 | 明确 03 详细设计可直接承接的稳定主语、结构骨架、协议 / 事务 / 测试切口，并建立主语变更回退规则 |
| 禁止 | 新增对象、接口、流程、状态；写开发任务、排期、测试全集、实现指令或把 pending seam 伪造成已闭合输入 |

## 1. 详细设计承接清单

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 八个主要组成部分及其职责 / 非职责边界 | 以 03 的模块 / package / class / function 粒度落目录与 ownership；不改变组成部分 owner |
| Inbound / Operations、Application Services、Domain Model、Ports / Persistence、Projection / Handoff 五层实现分层 | 继续定义层间依赖、事务入口、port adapter 注入、错误传播和可测试 fake seam；不把 seam 变成 sibling compile dependency |
| `RuntimeTriggerContext`、`RuntimeAdmissionDecision` | 完整字段约束、admission validator、重复请求语义、写入事务和错误分类；不加入 actor / product 正文 |
| `ControlledRun`、`GoalPlanWorkspace`、`RunProgressDecision`、`RuntimeHistoryEntry` | aggregate boundary、version / causation / correlation、progress guard、history append / query、一致性和并发冲突；不恢复旧 `ExecutionInstance` / `WorkItem` 主语 |
| `WorkingContext`、`WorkingMemory`、`ContextCompositionDecision`、`MemoryCandidate`、`MemoryUseRecord` | composition 算法、预算 / omission / conflict、window version、memory candidate port、durable owner snapshot contract；不拥有 durable body / index / retention |
| `ModelIntent`、`ModelDecision`、`ModelTurn`、`ModelDisposition`、`SafeDecisionSummary` | provider-neutral request / semantic result contract、turn correlation、classification、redaction、late result incorporation；不定义 route / secret / quota / cost |
| `ActionDecision`、`Delegation`、`ActionPreconditionDecision`、`ActionFeedbackRecord` | action choice 与 dispatch candidate 分层、precondition input mapping、parent / child scope / budget、feedback dedupe / ordering；不实现 Tools execution / registry / Sandbox truth |
| `RuntimeCheckpoint`、`RecoveryDecision`、`RuntimeOutcome`、`SideEffectMarker` | stable point predicate、checkpoint persistence port、commit-unknown、unknown side-effect fence、recovery-as-new-decision、terminal guard；不宣称物理持久化或外部 effect readiness |
| `HandoffAttempt`、`HandoffGap`、`SafeHandoffMaterial` | outbox / handoff candidate、submission / acknowledgement / gap reconciliation、redaction、replay / idempotency；不拥有 delivery / observed / artifact acceptance |
| `SourceReference`、`SourceSnapshot`、`SourceAvailability` | owner / authority / freshness / completeness validator、snapshot lifecycle、external change consumer、stale / conflict handling；不复制外部正文 |
| `SafeRuntimeView`、`ProjectionState` | projection rebuild、history cursor、read-scope filtering、stale / degraded / rebuilding semantics；不反写 domain truth |
| Command / Query / Inbound Event / Outbound Event / Operations Job 分类及 API 名称 | 完整协议字段、envelope、错误分类、幂等约束、consumer / publisher port、job lease 与观测接缝；不写 HTTP / RPC / topic 实现细节，除非上游合同闭合 |
| 通用 Command / Query / Event / Job 处理流与 15 条关键独立流 | 函数调用链、事务内外边界、outbox / repository / projection builder、异常传播和测试切口；不在 03 暗改接口 / 对象主语 |
| 多局部状态集合、允许 / 禁止迁移、unknown / pending / blocked / stale / degraded 姿态 | 状态不变量、迁移 guard、事件传播、并发 / ordering、持久化表示；不合并外部 owner 生命周期 |
| Step 10 异常与边界轮廓 | 错误分类与处理协议、retry / backoff / compensation / manual review 细节、测试矩阵；不把概要层 blocker 当 ready |
| Step 11 配置影响与禁止配置化边界 | 03 定义 RuntimeConfig / validator / builder / policy injection 契约；04 定义具体配置来源、填写、校验、环境分层；不让配置突破红线 |
| `L2R-UP-001~008`、`L2R-CP-001`、`L2R-LANG-001` | 只有正式 upstream contract / physical persistence / language decision 收敛后，才允许回开受影响 Step；当前按 pending / blocked / fail-closed 承接 |

## 2. 详细设计继续展开方向

| 方向 | 03 必须回答的实现级问题 | 当前输入边界 |
|---|---|---|
| Domain truth | aggregate / entity / value object / invariant / transition guard 的完整边界 | 只能从 Step 6 对象骨架展开，不重命名 owner |
| Application services | command orchestration、commit first、outbound after commit、new-decision append | 不将外部 adapter 实现写成 Runtime domain |
| Ports / persistence | repository / transaction / idempotency / event publisher / projection ports | 物理承载、协议字段、commit-unknown 仍需证据或上游合同 |
| Context / model | candidate selection、budget、redaction、semantic result classification | durable memory / provider control truth 外置 |
| Action / delegation | canonical action input、precondition mapping、child boundary、feedback incorporation | Tools / Hub / Governance / Sandbox seam pending |
| Recovery / handoff | stable predicate、unknown fence、manual review、gap reconciliation | 不伪造 side-effect / delivery / observed 结果 |
| Projection / query | rebuild cursor、read scope、freshness、safe material composition | 只读、可重建、body-free |
| Configuration | validator / profile / injection / audit | 具体配置填写交给 04 |
| Verification boundary | per-object invariants、flow cuts、state transitions、pending negative tests | 不声明测试已执行或证据存在 |

## 3. 概要设计回退规则

如果 03 详细设计发现上述主语、对象 owner、接口类别、处理流、状态语义或配置红线需要变更，说明概要设计尚未真正收稳，应先回到本概要设计对应 Step 修正并重新通过门禁，而不是在详细设计中暗改。若变化仅是完整字段、函数、事务、协议或测试实现展开，则继续留在 03，不回写 02 的主语含义。

## 4. 03 承接边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 每个 Step 4~11 稳定结论都有承接位置 | pass | 主体、对象、接口、流、状态、异常、配置均有表项 |
| 未闭合项与稳定输入分离 | pass | `L2R-UP-*` / checkpoint / language 保持 pending / blocked，不作为 positive implementation input |
| 03 不会重新发明主语 | pass | 对象 / API / 状态名称已固定，变更必须回退 02 |
| 04 配置设计边界清楚 | pass | 03 定义实现契约，04 定义填写与校验，不在 02 伪造配置事实 |
| 测试与证据边界清楚 | pass | 只列测试切口方向，不写测试结果、artifact、evidence 或 readiness |

## 5. 回填草稿

第 12 章应装配本清单的“已由概要设计收稳 / 详细设计继续展开”表和回退规则说明。正式正文不复制每个 Step 的讨论过程，只保留稳定输入与下游展开方向。

## 6. 待确认事项与持续 blocker

| 编号 | 待确认 / blocker | 对 03 承接的影响 | 当前安全姿态 |
|---|---|---|---|
| `L2R-UP-001~004` | 外部 action / feedback / cleanup 合同未闭合 | precondition / feedback / recovery port | pending / fail-closed |
| `L2R-UP-005` | durable memory owner 未闭合 | candidate / snapshot port | ref-only |
| `L2R-UP-006` | model adapter owner 未闭合 | model turn adapter port | blocked |
| `L2R-UP-007~008` | Core / Bus / Observability runtime seams 未闭合 | envelope / event / projection seam | pending |
| `L2R-CP-001` | checkpoint persistence / transaction 未闭合 | stable / commit-unknown port | blocked |
| `L2R-LANG-001` | implementation language 未选择 | 仅语言中立骨架 | not_selected |

## 7. Step 12 自检与门禁

| 检查项 | 结果 |
|---|---|
| 已列出主体、对象、接口、处理流、状态、异常和配置的稳定输入 | pass |
| 每项均明确 03 继续展开的字段 / 协议 / 函数 / 事务 / 测试方向 | pass |
| 未新增前文没有讨论的新对象、新接口、新流程或新状态 | pass |
| 已明确主语变更必须先回退概要设计 | pass |
| pending / blocker 未被装配成正向 03 输入或 readiness | pass |

**Step 12 结论：** `done`。允许进入 Step 13 设计风险与待确认事项；必须先更新文档 flow、项目执行台账并创建 Step 13 中间产物。正式 `02-概要设计.md` 仍不得装配，且不能进入 Step 14。
