# L2-runtime 01 架构 Step 8: 数据所有权与一致性策略

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 9 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 3 职责、Step 5 架构单元、Step 7 依赖、需求数据归属 |
| 目标 | 逐单元收敛正式真相 / 快照投影 / 引用 / 禁止正文及一致性策略 |
| 禁止 | 表 / 字段 / DDL / 缓存 / outbox / transaction / retry 实现 |

## 1. 问题回答、诊断与取舍

Runtime 的正式真相是 run、goal / plan working state、context composition / working memory、model / action / delegation decision、checkpoint / recovery、local outcome 和 local handoff attempt / gap。上游定义、治理、能力、工具、Sandbox、Artifact、durable memory 与 provider 内容只能是 safe snapshot、typed ref、candidate 或 forbidden body；Safe Runtime Views 是可重建投影。旧章节将 WorkingMemory、Episodic / Semantic refs、Checkpoint、ReasoningTrace、Tool call state 混成固定实体和一致性事实，本 Step 改为先判 owner 再判关系一致性，不继承“进程内强一致 / 每步 checkpoint / 外部最终一致”等实现断言。

## 2. 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| Run identity / scope / disposition | 正式真相数据 | Runtime 拥有受控运行身份、范围和状态语义。 | 入口 / member / downstream 不得维护可覆盖副本。 |
| Goal / plan working state | 正式真相数据 | Runtime 拥有运行内分解、推进和等待决定。 | 不等于 Work / Process / Artifact / Method 正文。 |
| Context composition / working memory | 正式真相数据 | Runtime 拥有 source selection、budget / gap 和短期工作语境。 | 外部正文不因进入 context 而迁移 owner。 |
| Model intent / selection / disposition | 正式真相数据 | Runtime 拥有 provider-neutral decision 与关联结果语义。 | raw provider response、route、secret、cost 不归 Runtime。 |
| Action choice / delegation / incorporation | 正式真相数据 | Runtime 拥有行动选择、父子 scope / budget 和纳入决定。 | Tool outcome、approval、Sandbox run 分属外部 owner。 |
| Checkpoint / recovery / reflection decision | 正式真相数据 | Runtime 拥有 stable point 和基于历史形成的新决定。 | 不保存 forbidden body，不修复外部 truth。 |
| Runtime local outcome | 正式真相数据 | Runtime 拥有本地终态和安全摘要来源。 | delivery / observed / accepted 不替代。 |
| Handoff eligibility / attempt / gap | 正式真相数据 | Runtime 拥有材料准备、尝试和本地缺口。 | Bus receipt / observed / Artifact acceptance 为外部 truth。 |
| Definition / governance / capability safe view | 快照 / 投影数据 | Runtime 为决策时点消费 ref / safe snapshot。 | 带 owner / freshness / scope；可 stale / conflict / missing。 |
| Tool / Sandbox / model / memory result view | 快照 / 投影数据 | Runtime 消费 normalized / safe disposition 与 availability。 | 不能由 capture / raw response 直接构造。 |
| Safe Runtime status / outcome view | 快照 / 投影数据 | 从已提交 Runtime truth 派生供查询 / handoff。 | 可延迟 / 重建，不能写源。 |
| Method / Work / Process / Artifact / Evidence refs | 引用关系数据 | Runtime 只保存正式关联引用。 | 引用不携带正文所有权。 |
| Tool / capability / governance / Sandbox / child refs | 引用关系数据 | Runtime 只保存跨 owner correlation。 | ref resolution 失败必须显式。 |
| Memory retrieval ref / write candidate | 引用关系数据 | Runtime 记录检索使用和候选交接。 | durable accept / write / delete truth 不归 Runtime。 |
| Method / policy / tool / capture / artifact / evidence / memory body | 明确不拥有的正文 / 真相 | 正文由相邻 owner 管理或 owner pending。 | 不得进入 truth、checkpoint、safe view 或 handoff。 |
| Secret / credential / raw headers / hidden reasoning | 明确不拥有的正文 / 真相 | Runtime 无保存或传播职责。 | 只允许 secret ref / redacted marker / safe reason category。 |

## 3. 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Run 状态与 goal / plan 推进决定 | 正式真相 ↔ 正式真相 | 同一提交边界内一致 | 明确失败 / 保持原状态 / unknown，不写部分完成 | 核心运行状态不能自相矛盾。 |
| Decision 与 action / checkpoint 关联 | 正式真相 ↔ 正式真相 | source-correlated 一致 | correlation 不完整即 blocked，不猜测补齐 | 每个行动 / 稳定点必须回链决定。 |
| Stable point 与恢复起点 | 正式真相 ↔ 正式真相 | 历史不可变、单向追加 | commit unknown 时挂起，不盲重试 / 覆盖 | 恢复必须从可证明位置成立。 |
| External truth 到 safe snapshot | 外部真相 ↔ 快照 / 投影 | 消费时点一致 / 允许过期显式 | stale / conflict / missing -> wait / degraded / fail closed | snapshot 不冒充实时 source truth。 |
| External object 到 Runtime ref | 外部真相 ↔ 引用关系 | 引用完整性 / resolution 可验证 | unresolved / wrong owner -> reject / gap | 不通过共享正文实现强一致。 |
| Tool / Sandbox / model 反馈到 Runtime decision | 外部结果 ↔ 正式真相 | 关联后形成新本地事实 | late / duplicate / out-of-order -> 新事实或 pending，不逆写 | 外部反馈不能覆盖已提交历史。 |
| Runtime truth 到 Safe Runtime Views | 正式真相 ↔ 快照 / 投影 | 最终一致 / 可重建 | projection gap 独立记录，不回滚 truth | 读侧不是业务写源。 |
| Runtime outcome 到 Bus / Observability / downstream | 正式真相 ↔ 外部 truth | local truth first / 外部最终收敛 | attempt / gap；不声明 delivery / observed / accepted | 多 owner 结果保持分层。 |
| Memory candidate 到 durable memory owner | 引用 / candidate ↔ 外部真相 | 候选交接 / owner 决定 | pending / rejected / unavailable；不声明 committed | durable owner 未闭口。 |
| Sub-agent parent / child history | 正式真相 ↔ ref / 外部或子运行真相 | 父 scope 与 incorporation 一致 | child unknown / late 进入等待或新事实，不共享 mutable working body | 父子运行需隔离又可关联。 |

## 4. 按架构单元数据所有权与停审

| 单元 | 本地 truth | snapshot / projection / ref | forbidden body / write | 停审 |
|---|---|---|---|---|
| Run & Goal-Plan | run / goal / plan / status / progress decision | trigger / business refs | Work / Process / Method / Artifact body | pass |
| Context & Memory | composition / working memory / query-use decision | safe snapshot / retrieval ref / candidate | external / durable memory body | pass |
| Model Decision | intent / selection / disposition / safe summary | adapter capability / result ref | raw response / secret / route / hidden reasoning | pass |
| Action & Delegation | action / delegation / incorporation | Tool / Gov / Sandbox / child refs / summaries | ToolDefinition / approval / capture / host truth | pass |
| Checkpoint / Recovery / Handoff | stable point / recovery / outcome / attempt / gap | feedback / delivery / observation refs | forbidden body / external repair / accepted writeback | pass |
| Entry & Control | acceptance / rejection relation to Runtime run | principal / scope refs / safe views | product / member private state | pass |
| External Truth Views | availability / stale / conflict local consumption fact | refs / snapshots | source truth mutation / body | pass |
| Safe Runtime Views | projection state / gap | committed Runtime truth refs | core truth mutation / observed truth | pass |

## 5. 跨数据边界审计

| 审计项 | 结论 | 状态 |
|---|---|---|
| 双真相 | Runtime outcome 与 delivery / observed / accepted 已分层。 | pass |
| 投影反写 | Safe Runtime Views / Observability 无写源路径。 | pass |
| 引用正文入仓 | 所有外部正文已进入 forbidden body 表。 | pass |
| 强 / 最终一致误用 | 核心本地提交与跨 owner 收敛分开。 | pass |
| unknown fence | commit / side-effect unknown 禁止盲重试。 | pass |
| persistence contract | checkpoint atomicity / UoW / version 仍 pending，未伪造。 | pass |

## 6. 回填、自检与门禁

正式第 9 章采用数据归属表、一致性策略表和边界说明；不引入字段、表、数据库、transaction、outbox 或缓存方案。八个单元已停审，跨数据审计无 unresolved 冲突。

```text
gate_status = pass
next_allowed_action = create_01_arch_step_09_interactions_communication
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_09_start
```
