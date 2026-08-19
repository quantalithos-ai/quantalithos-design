# L2-runtime 00 需求 Step 3: 背景与问题定义

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 3 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | 项目台账、flow、Step 1~2、专项上游正式边界 |
| 目标 | 说明为什么需要 Runtime,不提前给方案 |
| 禁止 | 旧模块清单、框架选型、对象 / API、无来源指标 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 业务背景 | done | Runtime 协作背景 | pass |
| 现状问题 | done | 五类问题表 | pass |
| 业务 / 技术问题分离 | done | 分类表 | pass |
| 旧材料审计 | done | 指标 / 方案污染处置 | pass |
| 回填与自检 | done | 第 3 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 业务背景是什么? | 上游已分别收束方法定义、能力接入、工具行动合同、治理裁决、隔离执行和观测边界,但平台仍需要一个 owner 把这些受控输入组织成持续、可暂停、可恢复的 AI 成员决策运行。 |
| 主要痛点 / 机会? | 没有 Runtime owner 时,调用方会在各自 adapter 或产品层拼接 prompt、计划、模型选择、工具动作和恢复逻辑,产生不一致、不可追溯和越权。 |
| 能否量化? | 当前无实现仓、真实 workload、run 或测量 authority,不能声称延迟 / 吞吐 / 命中率;可用 owner、孤儿能力、禁止反向写入和 fail-closed 路径做结构性验证。 |
| 业务 vs 技术问题? | 业务问题是 AI 成员无法形成一致、受控、可恢复的运行行为;技术问题是运行事实、输入优先级、外部 seam 与失败语义尚未闭合。 |

## 3. 结构化问题定义

### 3.1 业务背景

Quantalithos 已把“定义什么方法”“有哪些外部能力”“工具行动意味着什么”“治理是否允许”“隔离执行发生了什么”“如何观测”分配给不同 truth owner。Runtime 的必要性在于把这些正式输入转化为一次具体 AI 成员运行中的目标推进、模型交互、上下文组合、行动选择、暂停恢复和结果交接,并对该运行过程的语义负责。

### 3.2 现状与问题

| 问题 | 当前可核查表现 | 后果 |
|---|---|---|
| 受控运行循环缺少当前需求真相 | 现有 Runtime 正式链仍是旧草案,且 `L2-tools` 已明确把 action choice / loop / planning / recovery 留给 Runtime | 下游可能用产品入口、member host 或 adapter 各自定义运行循环。 |
| Model 与 action 决策边界多义 | Hub 明确不拥有 LLM routing;Tools 不拥有 action choice;provider route / secret / quota / cost 也不归 Runtime | 若不区分逻辑选择与物理 route,Runtime 会吞并 provider control或丧失 model decision 可追溯性。 |
| Context / memory / method / policy 容易混写 | Method、Governance、Artifact 等均禁止 Runtime 反向拥有其正文;durable memory owner 未闭口 | Prompt/context 可能复制外部正文,working / episodic / semantic 含义和保留边界漂移。 |
| Checkpoint / resume / reflection / recovery 缺当前 owner 口径 | 旧文档以“每步 checkpoint”和固定框架代替语义;上游正式链不替 Runtime 定义恢复点 | 重启可能重做有副作用行动、跳过待确认外部结果或原地改写历史。 |
| Tool / sub-agent / event handoff 容易串仓 | Tools、Sandbox、Bus、Observability 分别拥有不同 truth;开放 receipt / route / observed seam 尚未闭口 | action accepted、executed、tool outcome、delivered、observed 可能被压成一个成功状态。 |

### 3.3 业务问题与技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | AI 成员缺少一个能围绕正式目标和约束持续作出可解释、可暂停、可恢复且不越权的运行行为边界。 |
| 技术问题 | Runtime run / turn / working state 的唯一 owner、model / tool / sub-agent decision、context composition、checkpoint / resume、external source correlation 与 local-truth-first handoff 尚未按当前上游合同闭合。 |

## 4. 当前文档问题诊断与前后对比

| 旧表达 | 当前诊断 | 新表达 |
|---|---|---|
| “九子模块可运行 9/9” | 用旧模块库存替代问题 | 从 Runtime 不可替代的运行责任出发。 |
| “单步 <50ms / checkpoint <100ms / memory <500ms” | 无 workload / baseline / measurement authority | 当前只给可判断口径,数字后移测试基线。 |
| “reasoning trace 100%” | 可能鼓励保存隐藏推理正文 | 要求 decision / source / outcome 可关联且安全最小。 |
| “vector store 降级” | 直接假定产品与 owner | 只表达 durable memory seam unavailable 时的显式退化。 |
| “tool invoker deny/retry/fallback” | 把 Tools / Governance / Runtime 恢复语义混成一层 | 分离 action decision、authorization、tool outcome 与 Runtime recovery。 |

## 5. 设计取舍

| 取舍 | 决定 | 理由 |
|---|---|---|
| 问题证据 | 使用正式 owner 缺口、冲突和依赖后果 | 当前没有可信运行数据。 |
| 目标前置 | 不在本步列“采用 StateGraph / ReAct” | 这些是后续架构候选,不是问题。 |
| 开放 seam | 作为问题约束,不写解决方案 | 防止需求阶段补 adapter / route。 |
| 可解释性 | 要求安全 decision traceability,不要求隐藏思维正文 | 兼顾审计与敏感数据边界。 |

## 6. 回填草稿

当前上游已经分别闭合或界定工具合同、能力接入、方法定义、治理裁决、隔离执行和观测材料,但缺少按当前边界重建的 Runtime 需求真相。平台因此面临运行循环、model/action 决策、context/memory、checkpoint/recovery 和外部 handoff 多义问题;本轮需要先收束这些可核查的 owner 与失败语义,而不是继承旧框架和无来源指标。

## 7. 待确认事项

- 真实 workload、性能预算和 provider / memory 可用性基线不存在;后续 NFR 只能先定义判断方法。
- Model adapter 与 durable memory 的正向 owner 缺口持续记录,不在问题定义中选择产品。

## 8. 自检与门禁

| 检查 | 结果 |
|---|---|
| 背景、问题和目标未混写 | pass |
| 无实现方案 / 框架 | pass |
| 无伪量化 | pass |
| 问题可回指正式上游边界 | pass |

```text
gate_status = pass
next_allowed_action = create_step_04_goals_non_goals
formal_document_write_allowed = false
```
