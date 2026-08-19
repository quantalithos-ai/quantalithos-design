# L2-runtime 01 架构 Step 11: 备选方案与取舍

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 12 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 目标约束、Step 10 机制选型、前序边界 / 数据 / 交互结论 |
| 目标 | 比较路径级替代方案，说明当前选择的收益与代价 |
| 禁止 | 产品横评、局部实现、愿望池、边界外能力重新包装为候选 |

## 1. 当前主线方案

```text
独立 Runtime controlled-run truth
  + 五核心语境与入口 / 外部视图 / 安全投影分层
  + 正式接缝隔离外部 owner
  + provider-neutral model / action orchestration
  + immutable history / stable checkpoint / unknown fence
  + local-truth-first outcome / safe handoff
  + 同步判断 / 异步送达传播 / 后台 continuation
  + fail-closed / idempotency / ordering / correlation
```

## 2. 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 Runtime truth + 正式接缝 + 混合通信主线 | 让多 owner 输入形成可恢复运行决定而不串仓 | owner 清楚、历史可恢复、外部 seam 可替换、失败可解释 | 状态 / 关联 / adapter / projection / gap 复杂度较高 | 采用 | 同时满足 controlled run、恢复和边界目标。 |
| 无状态 request coordinator 路径 | 简化单次模型 / 工具调用编排 | 入口简单、状态负担低 | 无法承载长时 run、checkpoint、late feedback、unknown side effect 和恢复历史 | 不采用 | 与核心可恢复目标冲突。 |
| 单一“大脑”聚合上下文 / 工具 / provider / memory 路径 | 缩短跨边界协调 | 初期调用链直观 | 吞并 Tools / Hub / Governance / Sandbox / provider / memory truth，形成第二 owner | 不采用 | 违反已定 owner separation，不是可持续主线。 |
| 通用状态图 / workflow engine 主导路径 | 统一控制流与持久化推进 | 可视化、框架能力和恢复基础较丰富 | 框架节点 / 状态可能反向定义 Runtime 语义，且不自动解决外部 owner / unknown fence | 保留为后续实现候选，不作为架构主线 | 只有在服从当前语义边界时才可选为载体。 |
| 全同步端到端闭环路径 | 追求入口即时完成感 | 调用方心智简单 | model / Tool / Sandbox / child / delivery 长链耦合，易伪同步完成和级联失败 | 不采用 | 同步仅适合即时判断。 |
| 全异步事件化路径 | 降低入口阻塞并提高解耦 | 长时和跨仓传播自然 | trigger / source / governance / action admission 缺少即时成立 / 拒绝边界 | 不采用 | 核心前置必须同步收口。 |
| 事件溯源作为完整 Runtime persistence 主线 | 强化 history / replay / audit | 追加历史自然、回放能力强 | 外部副作用与 owner 结果不能靠本地 replay 重演；成本和合同尚无 authority | 保留观察 | 当前只固定 immutable history，不强制完整 ES。 |
| 每步 checkpoint + 自动重试路径 | 最大化表面恢复率 | 实现概念直观、失败后易自动继续 | checkpoint 可能无 stable 语义，unknown side effect 会重复执行 | 不采用 | stable point 与 unknown fence 优先于频率。 |
| Core truth 直接对外暴露路径 | 减少投影和 handoff 层 | 初期读取直接 | 下游绑定核心结构并可能反写 delivery / accepted 状态 | 不采用 | 采用 body-free Safe Runtime Views。 |

## 3. 不进入正式比较的方向

| 方向 | 原因 | 正确处理 |
|---|---|---|
| Runtime 自建 Tool / capability registry | 已被 owner 边界排除 | Tools / Hub formal truth |
| Runtime 自建 Governance allowlist / approval | 已被 fail-closed 红线排除 | consume formal Governance result |
| Runtime host fallback / 自建 Sandbox | 已被 isolation 红线排除 | Sandbox adapter pending / blocked |
| Runtime 保存 method / artifact / memory / provider body | 已被 forbidden body 排除 | ref / safe snapshot / candidate |
| 具体框架、语言、DB、MQ、provider 横评 | 属实现载体，不是路径级替代 | 后续文档 |

## 4. 轻量取舍对照

| 当前方案得到 | 当前方案牺牲 / 承担 |
|---|---|
| 单一 Runtime truth 和可解释恢复 | 更多状态、关联、adapter 和 gap 表达成本 |
| 外部 owner 与正文边界稳定 | 无法通过直连 / 共享 DB 获得初期捷径 |
| local outcome 不被 delivery / observed 污染 | 端到端完成状态必须分层理解 |
| fail-closed 与 unknown fence | 降低部分自动恢复率和表面 availability |
| 产品 / 框架中立的演进空间 | 产品和部署选择后移，短期确定性较低 |

## 5. 自检与门禁

| 检查 | 结果 |
|---|---|
| 每条方案为路径级替代 | pass |
| 每条有问题、收益、代价和正式结论 | pass |
| 边界外能力未重新包装为候选 | pass |
| 产品 / 局部实现未进入主比较 | pass |
| 未新增未确认结论 | pass |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_12_cross_cutting_concerns
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_12_start
```
