# L2-runtime 01 架构 Step 10: 关键技术选型

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 11 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 目标约束、Step 7 依赖、Step 8 数据、Step 9 交互 |
| 目标 | 选择影响边界、一致性、恢复和交互主线的机制级架构手段 |
| 禁止 | 技术栈 / 产品 / 框架清单、部署事实、协议 schema 或实现参数 |

## 1. 问题回答与历史诊断

当前需要选择的是机制，不是产品：如何保护 Runtime core、如何承接外部 owner、如何表达运行状态和不可逆历史、如何隔离 adapter、如何向下游提供安全视图、如何抵抗重复 / 乱序 / unknown。旧 StateGraph / LangGraph / Temporal / Python / vector store / UDS gRPC / provider SDK / fixed SLA 只解决或预设局部载体，且无当前 authority，均不进入本步正式选择。

## 2. 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| Source-anchored controlled state transition | 防止 run / decision 由 prompt、入口或外部反馈隐式推进 | Runtime 必须能解释每次状态变化的 source、scope、decision 和合法出口 | 增加状态分类、关联、非法迁移和恢复验证成本 | 影响所有核心语境，不是局部状态机实现选择。 |
| 正式承接边界隔离外部输入与核心语义 | 防止 definition、policy、capability、tool、sandbox、provider 直接写核心 | 多 owner 协作必须先转换为 ref / snapshot / formal result / gap | 增加接缝、适配、失败和 source validation 复杂度 | 改变外部能力如何接近核心。 |
| Provider-neutral adapter 与 logical / physical split | 防止 model decision 被 provider route / secret / quota / cost 统治 | Runtime 只需拥有 intent / selection / disposition | 需要 adapter contract、capability matching 和明确 unavailable | 适用于 model；同类原则也约束 Tools / Sandbox / memory。 |
| Truth / snapshot / ref / candidate / forbidden body separation | 防止外部正文、候选或投影升级为 Runtime truth | 数据所有权是 Runtime 边界成立基础 | 增加 stale / conflict / missing / resolution 状态 | 横跨 context、checkpoint、handoff 和安全。 |
| Immutable history + stable checkpoint + recovery-as-new-decision | 防止 resume / reflection / retry 原地改写历史 | unknown side effect 和迟到反馈要求历史可回链 | 增加版本、关联、存储和审计负担；物理事务仍待后续 | 定义恢复性格，不锁具体持久化产品。 |
| Unknown-side-effect fence | 防止 commit unknown 时盲重试产生重复副作用 | 外部执行不在 Runtime 单一事务内 | 可降低自动恢复率，需要等待 / 人工 / external resolution seam | fail-closed 优先于表面可用性。 |
| Local-truth-first + safe projection / handoff | 防止 delivery / observed / accepted 反写 outcome | 多 owner 交接天然不能作为同一原子事实 | 增加 attempt / gap / projection lag 的解释成本 | 同时影响一致性、事件和下游消费。 |
| 同步判断 / 异步送达传播 / 后台 continuation 分离 | 防止全同步长链或全异步缺少即时裁定 | 三类交互服务不同边界语义 | 增加多路径状态、关联和故障处理 | 不等同具体 RPC / MQ / scheduler 选择。 |
| Idempotency / ordering / correlation protection | 防止重复、迟到、乱序、replay 产生状态回退或重复决定 | Tools / Sandbox / model / child / event 反馈均可能非单次有序 | 要求稳定 identity、causation 和 duplicate handling | 具体 key / algorithm 后移。 |
| Fail-closed precondition gating | 防止 Governance / capability / Sandbox 不明时自我授权或 fallback | 高影响 action 必须由正式 owner 前置支持 | 降低 availability，增加 blocked / waiting 路径 | 安全边界高于默认推进。 |
| Working context budgets + bounded delegation | 防止 context / memory / sub-agent 无界增长 | 运行决定必须在显式 scope / budget 内可解释 | 需要裁剪、缺口、预算耗尽和 child control 语义 | 不固定 token / 数字阈值。 |
| Body-free safe summary and redacted projection | 防止 hidden reasoning、secret、raw provider / tool / capture 正文扩散 | 查询、checkpoint、handoff 和 observation 都需要最小暴露 | 调查信息有限，需要 owner ref 回链 | 不以完整 reasoning trace 换取审计。 |

## 3. 当前不采用口径

| 不采用口径 | 不采用原因 | 正确落点 |
|---|---|---|
| StateGraph / LangGraph / Temporal / actor framework 作为当前硬选型 | 框架不能替代 owner、history、failure 和 seam 语义 | Step 11 路径比较；后续概要 / 详细设计 |
| Python / Rust / runtime library | 语言和库是实现载体 | 02 / 03 / 07 |
| 具体数据库 / cache / vector / queue / scheduler | 产品选择不能反向定义 truth / consistency / interaction | 03 / 04 / 07 |
| 具体 provider / SDK / route / billing product | provider control 不归 Runtime | 外部 adapter owner；03 / 04 |
| 固定 API / gRPC / UDS / topic / event catalog | 协议外形尚未闭口 | 02 / 03 |
| 完整 event sourcing 作为必选 | immutable history 和追溯不等于必须采用完整 ES 持久化 | Step 11；详细设计 |
| 完整 hidden reasoning / ReasoningTrace | 违反 body-free / hidden reasoning 边界 | safe decision summary / source links |
| 每步 checkpoint / 固定 retry | stable point 与 unknown fence 不能退化为机械频率 | 03 / 04 / 05 |
| P95 / SLA / QPS / cost 数字 | 无 workload / measurement / evidence authority | 05 / 06 的真实基线与证据 |

## 4. 按架构单元机制适用

| 单元 | 必须采用 | 明确不采用 |
|---|---|---|
| Run & Goal-Plan | controlled transition、source anchoring、immutable history | prompt implicit progression、外部 state overwrite |
| Context & Memory | data separation、budget、safe snapshot / ref | external body copy、durable owner takeover |
| Model Decision | provider-neutral adapter、safe summary、correlation | provider registry / secret / raw reasoning |
| Action & Delegation | fail-closed gate、bounded delegation、idempotency / ordering | local allowlist、host fallback、unbounded child |
| Checkpoint / Recovery / Handoff | stable point、unknown fence、local truth first、safe projection | blind retry、delivery writeback、complete event sourcing mandate |
| Entry / Views | formal boundary、body-free projection | product private state、query write source |

## 5. 自检与门禁

| 检查 | 结果 |
|---|---|
| 每项机制有架构问题、理由和代价 | pass |
| 未列产品 / 框架 / 语言为正式选型 | pass |
| pending seam 未伪造正向实现 | pass |
| 技术机制不替代 Step 8 / 9 归属和通信结论 | pass |
| Step 11 文件未提前创建 | pass |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_11_alternatives_tradeoffs
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_11_start
```
