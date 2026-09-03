# 01 架构校准 Step 11：备选方案与取舍

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 10 completed / pass
> 本步目的：比较同一职责边界内的路径级替代方案，说明当前主线得到什么、牺牲什么

## 1. Step 内计划

- [x] 读取 flow、台账、Step 2 和 Step 10。
- [x] 确认当前主线方案的完整路径，而不是罗列单项机制。
- [x] 筛选仍遵守本仓 owner 边界的有效替代路径。
- [x] 排除产品横评、局部实现变体、未来愿望池和已被非目标否决的路径。
- [x] 逐路径比较边界、依赖、一致性、失败解释和演进代价。
- [x] 形成正式 §12 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 当前主线方案是什么

当前采用“显式宿主决定驱动的独立 Host Truth Center”：A1 先形成可追溯决定，A2~A5 按实例世代推进装配、注册、健康恢复和收束；S1~S3 通过 ports 承接外部资格、能力和消费；本仓内部事实强一致，外部副作用与传播通过后台推进、异步反馈、gap 和 reconciliation 收敛。

### 2.2 哪些路径构成有效替代

1. 单一宿主生命周期上下文：仍由本仓拥有 truth，但把决定、装配、注册、健康和清理压入一个统一状态模型。
2. 全事件编舞：仍保留本仓 owner，但所有入口、推进和反馈均通过事件驱动，弱化同步权威判断。
3. 持续期望态控制：本仓维护 desired host state，由持续 reconciliation 作为主要推进和收敛机制，弱化逐次编排决定。

这些路径都没有把本仓职责交给相邻仓，因此是可比较的架构替代。把宿主生命周期并入 Work、Runtime、Member、Sandbox 或后端，以及共享数据库、直接源码依赖和 host fallback，已经违反 Step 2 / 3 硬约束，不是有效候选。

### 2.3 当前方案得到什么、牺牲什么

得到：每次变化有显式决定与来源；五类生命周期事实不会被单一状态压平；即时拒绝、长时副作用和结果传播边界清楚；unknown、迟到反馈和跨 owner gap 可归责；正向合同 pending 时仍可 fail closed。

牺牲：需要更多语义单元、显式中间状态、generation fence、ports、关联和对账；实现、运维与产品展示必须理解“已决定但未完成”“本地完成但外部未确认”等多层状态；短期代码量和测试矩阵会高于单一状态机或直接调用链。

## 3. 方案诊断与比较维度

| 比较维度 | 必须回答的问题 |
|---|---|
| Owner / 边界 | 是否保持本仓唯一 host truth，是否吸收外部 truth。 |
| 生命周期语义 | 决定、实例、注册、健康、清理能否独立解释。 |
| 一致性 / unknown | 本地提交、外部副作用、迟到反馈和结果未知如何收束。 |
| 交互 | 是否同时支持即时拒绝、长时推进和事实传播。 |
| Pending 兼容 | 合同未闭口时能否保持 placeholder / fail closed。 |
| 演进代价 | 后续增加后端、规模和合同能力是否推翻核心结构。 |

## 4. 结构化中间产物

### 4.1 方案路径比较

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 显式决定驱动的独立 Host Truth Center + 分层生命周期 + ports / background / reconciliation | 同时保护宿主 owner、五类语义、外部资格、长时副作用和外围传播 | 决定可追溯；状态不压平；unknown / gap 可归责；合同 pending 可 fail closed；后端可替换 | 语义和状态较多；需要 generation fence、幂等、端口、后台推进、对账和多层展示 | 采用 | 完整承接 C-MS-1~5 与 HC-MS-001~009，是当前主线。 |
| 单一宿主生命周期上下文 / 统一状态模型 | 降低上下文数量，让宿主生命期在一个模型中推进 | 初期心智和事务边界简单；对象数量少；查询直接 | readiness、registration、health、cleanup 和 external completion 易被压成一个状态；修改频率和 owner 输入互相牵连 | 不采用 | 仍可保持本仓 owner，但无法稳定保护五能力节点的不同失败语义。 |
| 全事件编舞的 Host Truth Center | 通过事件解耦所有输入、推进和反馈 | 写入路径松耦合；易增加消费者；长时过程天然异步 | 非法主语、冲突控制、重复注册等即时权威判断变弱；事件到达容易被误解为决定或完成；调试和顺序成本高 | 不采用 | 事件适合变化 / 结果传播，不适合作为全部权威入口。 |
| 持续期望态控制 + reconciliation 主导 | 通过 desired / observed 差异持续收敛宿主状态 | 对后端漂移、孤儿和规模化调度有优势；自动修复能力强 | 逐次意图、决定依据和不可逆动作语义可能被期望态覆盖；observed / backend 状态易反向统治 host truth；pending 合同难解释 | 不采用为当前主线 | reconciliation 保留在 A5，但不能替代 A1 显式决定和 A2~A4 事实链；规模证据出现后可增强。 |

### 4.2 当前取舍结论

| 当前方案主要得到 | 当前方案主动承担 |
|---|---|
| 唯一 host truth owner 与清晰外部边界 | 更多显式状态和边界适配成本 |
| 每次意图、决定、实例世代和结果可追溯 | generation fence、幂等和历史维护成本 |
| 同步接受、后台推进、异步反馈语义分离 | 跨路径追踪和 unknown / gap 展示成本 |
| 外部合同 pending 时仍能 fail closed | 正向能力在合同闭口前保持 blocked |
| 后端和协议可替换 | 端口、adapter、qualification 和测试替身成本 |
| 本地 truth 不被 delivery / observed 反写 | reconciliation、投影重建和外围状态解释成本 |

### 4.3 不进入正式比较的方向

- 把宿主生命周期并入 Work / Identity / Member / Runtime / Sandbox / backend：违反 owner 和仓职责，不是相邻替代。
- 共享数据库、外部正文复制、直接 sibling package dependency、host fallback：违反数据和依赖红线，不是方案。
- Rust vs 其他语言、PostgreSQL vs 其他数据库、HTTP vs RPC、Docker vs Kubernetes：是后续产品 / 实现选择，不是路径级替代。
- warm pool、容量调度、forensic backend、policy propagation、非项目型宿主：属于外围、未确权或需重开需求的范围，不是当前主线替代。

## 5. 回填草稿

- 正式 §12 采用四路径比较表、取舍对照表和一段方案边界说明。
- 正式正文说明 reconciliation 是 A5 的正式机制，但“持续期望态控制”不替代显式决定主线。
- 不把并入相邻仓、产品横评或未来愿望写成可选方案。

## 6. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 当前主线是否为完整路径 | pass | owner、上下文、ports、一致性和交互均包含。 |
| 备选是否为有效结构替代 | pass | 三条替代都保留本仓 owner，只改变内部主路径。 |
| 每条路径是否同时写收益和代价 | pass | 四条均完整。 |
| 是否把边界外事项伪装成备选 | pass | 已在 §4.3 排除。 |
| 是否滑入产品横评或局部实现 | pass | 无产品选择结论。 |
| 是否允许创建 Step 12 | pass | 架构路径取舍已收稳；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_12
formal_01_write_allowed = false
```
