# 01 架构校准 Step 13：演进路线

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：Step 12 completed / pass
> 本步目的：说明当前架构成熟度、后续结构演进、可接受债务和触发条件，不写排期、任务或 readiness

## 1. Step 内计划

- [x] 读取 flow、台账、Step 10~12 和开放合同注册表。
- [x] 确认当前阶段已完成的是架构边界，不是实现或集成。
- [x] 按合同闭口、最小正向闭环、韧性规模增强和条件性扩范围划分结构阶段。
- [x] 区分可接受 deferred 与不可接受 owner / fail-open 债务。
- [x] 为每个后续阶段给出进入条件，不写日期、里程碑或任务拆分。
- [x] 形成正式 §14 回填草稿和 gate 自检。

## 2. SOP 问题回答

### 2.1 当前阶段做到哪里才算足够

当前阶段只要求 01 的架构主线成立：A1~A5、S1~S3、P1~P3 的职责、依赖、数据、交互、横切与取舍完整；所有开放合同被明确限定 positive ceiling；旧技术、指标与部署污染被排除。它不要求任何 port、adapter、存储、进程或测试已经实现，也不构成 Member / Runtime / Images / Sandbox 的正向集成 readiness。

### 2.2 第一批必须守住哪些结构

- 独立 Host Truth Center 与项目型双锚。
- 显式意图 / 决定、不可变实例世代、single-active 注册 / session。
- required qualification fail closed，无 host fallback。
- 本仓内强一致、跨 owner 最终一致、gap / residual / reconciliation。
- ports and adapters、forbidden body、local / external outcome layering。
- 同步接受、后台推进、异步反馈分离。

这些结构不是可延期优化；任何后续阶段都不得以性能、交付速度或产品便利为由撤销。

### 2.3 后续如何演进

1. 合同闭口阶段：逐项确认 Core / SDK、Member、Images、Runtime、Sandbox、credential、backend qualification 和 material receipt 的正式边界，并回校验 placeholder ports。
2. 最小正向闭环阶段：在合同均有 authority 后，使项目型宿主从意图到收束的最小路径可以由真实 owner / adapter 验证；fake 仍只证明局部边界。
3. 韧性与规模增强阶段：根据真实 drift、故障、延迟和 workload 证据增强 reconciliation、角色物理拆分、容量 guard、投影和运维消费。
4. 条件性范围扩展：只有正式 owner / 需求变化触发时，才评估 policy 传递、非项目型主语、warm pool、复杂调度或更丰富 forensic 协作。

### 2.4 哪些债务当前可接受

- exact contracts、schema、route、receipt、adapter qualification 和 SDK target pending，因为 owner 和 fail-closed 上限已经明确。
- 数据库、消息、RPC、容器平台、部署拓扑和配置数值 deferred，因为不影响当前架构边界成立。
- 三个运行角色当前可同部署，因为没有 workload / fault isolation 证据要求物理拆分。
- 性能和健康数字未量化，因为缺少正式环境与测量 authority。
- 高级容量、预热、forensic 和聚合消费后移，因为不阻塞 C-MS-1~5。

### 2.5 哪些债务不可接受

- 宿主 truth owner 不唯一或被 backend / sibling 反向定义。
- 非项目型、无正式主语或 required qualification 不明时 fail open。
- Runtime / Member / Images / Sandbox / L1 truth 或 forbidden body 进入本仓。
- sibling package dependency、共享数据库、直接产品状态模型侵入核心。
- 第二活动宿主 / 注册 / session、历史覆盖、unknown 副作用盲重放。
- local attempt / fake / snapshot 冒充 external completion、evidence 或 readiness。
- 用单一状态压平决定、readiness、registration、health、cleanup 和 handoff。

## 3. 当前材料诊断与取舍

| 历史路线 | 诊断 | 当前演进口径 |
|---|---|---|
| P0 / P1 固定优先级和上线计划 | 无 release authority，混入项目管理 | 使用结构阶段和进入条件，不使用排期承诺。 |
| 先选 Kubernetes / PostgreSQL 再实现 | 产品先行会反向决定边界 | 先闭合同与语义，产品在机制约束下后选。 |
| fake 路径通过即 ready | 替身不证明真实 owner / contract / backend | fake-qualified 与真实 positive integration 分层。 |
| 先做 capacity / warm pool 优化 | 在核心未闭合时扩大状态和后端耦合 | 仅在真实 workload 证据触发后进入规模增强。 |
| 非项目型作为自然扩展 | 当前没有第三种正式执行主语 | 必须重开需求与 A1，不能从 GlobalMemberRef 推导。 |

## 4. 结构化中间产物

### 4.1 演进阶段

| 阶段 | 架构目标 | 进入条件 | 包含的结构变化 | 明确不代表 |
|---|---|---|---|---|
| E0 当前架构基线 | 固定 host truth、上下文、依赖、数据、交互、机制与风险上限 | 正式 00 获批；Step 1~16 完成静态审计 | 01 正式文档与完整 calibration chain | 实现、测试、artifact、evidence、signoff 或 readiness。 |
| E1 正向合同闭口 | 用正式双侧合同替换 placeholder，同时保持 owner 和 fail-closed | 对应 owner 正式文档停审；字段 / 语义 / failure / compatibility 可追溯 | Core / SDK、Member、Images、Runtime、Sandbox、credential、backend / receipt 边界回校验 | 合同存在即真实集成通过。 |
| E2 最小项目型宿主闭环 | 使 C-MS-1~5 在真实 owner / adapter 上具备可验证正向路径 | E1 相关合同闭口；后续 02~07 完成；真实实现和测试 authority 存在 | 最小 intent -> closure 路径、真实失败语义和证据诚实 | 所有后端、规模、SLA、非项目范围 ready。 |
| E3 韧性与规模增强 | 基于实证增强扩缩、reconciliation、容量、投影与运维边界 | 真实 workload、drift、故障隔离或消费压力达到正式触发条件 | 运行角色按需物理拆分；持续对账增强；容量 guard / safe view 扩展 | owner、五核心语义或 local-first 被替换。 |
| E4 条件性范围扩展 | 在新 authority 下评估 policy、非项目主语和外围增强 | 正式需求 / owner / ADR 触发并重开受影响 Step | 新主语或新支撑上下文按重新校准结果进入 | 当前架构已经承诺这些能力。 |

### 4.2 可接受设计债务

| 债务 | 可接受原因 | 保护条件 | 关闭入口 |
|---|---|---|---|
| MSVC-UP-001~008 正向合同 pending | owner 边界和失败上限已知，可先稳定架构 | 受影响路径 blocked / waiting，不声明 ready | E1 对应 owner 正式合同 |
| 产品 / 协议 / schema / storage 选择 deferred | 它们不是 host truth 的前提 | 不得推翻 ports、owner、数据和交互机制 | 02~04 / 07 的正式门禁 |
| 三运行角色逻辑分离但可同部署 | 当前无规模 / 隔离证据要求拆分 | 失败语义和扩缩边界保持独立 | E3 workload / fault evidence |
| 性能、容量、健康窗口未量化 | 无正式场景、环境和测量 authority | 不使用旧数字，不宣告性能通过 | 04~06 正式指标与证据 |
| 外围增强未进入核心 | 不影响 C-MS-1~5 owner 闭环 | 不成为核心前置或写源 | E3 / E4 正式触发 |

### 4.3 不可接受设计债务

| 债务 | 为什么不可接受 | 当前处置 |
|---|---|---|
| 多 host truth owner / backend-driven truth | 直接造成状态分叉和责任不明 | 立即阻塞并回退到 A1~A5 owner 边界。 |
| 无双锚、qualification 缺失仍启动 | 打穿项目和隔离边界 | fail closed；不得以配置或 fallback 放行。 |
| 外部正文 / secret / runtime / isolation body 入仓 | 迁移 ownership 并造成安全泄漏 | 禁止保存、输出和证据化。 |
| sibling compile dependency / 共享存储 | 破坏全局裁剪和独立演进 | 通过 ports / runtime / event / ref 重构。 |
| 活动关联分叉 / 历史覆盖 / 盲重放 | 破坏生命周期 truth 和不可逆动作安全 | single-active、generation fence、幂等和对账。 |
| attempt / fake / receipt 冒充完成 | 伪造集成、观测、验收或 readiness | 状态分层并触发 VF-MS-007 / 009。 |

### 4.4 演进触发条件

| 触发信号 | 允许触发的架构复核 | 不允许借机改变 |
|---|---|---|
| 正式 sibling / owner 合同停审 | 复核 placeholder port、compatibility、failure 和数据最小化 | 对端不得取得 host truth。 |
| 真实正向集成需要 | 进入 E2，补齐后续设计与资格证据 | fake 不得替代真实 evidence。 |
| 持续 drift / orphan / unknown | 增强 A5 reconciliation 和后台承载 | backend observed 不得成为 truth。 |
| 同步入口、后台动作或信号负载显著分化 | 评估三运行角色物理拆分 | 不能合并五核心语义或削弱强一致。 |
| 消费者数量 / 查询压力增加 | 增强 P3 projection / safe view | 投影不得反写或暴露正文。 |
| policy 传递 owner 正式确定 | 重开需求、S1 / S3 和横切审计 | 不得本地创建 policy truth。 |
| 非项目型正式主语出现 | 重开 C-MS-1、A1 及全链追溯 | 不得以 GlobalMemberRef 直接替代执行主语。 |

## 5. 回填草稿

- 正式 §14 采用五阶段路线、可接受 / 不可接受债务和触发条件表。
- 正式正文必须明确 E0 是设计基线，E1~E4 均为有条件演进，不是已完成或排期。
- 实施任务、commit、run、artifact、report、evidence 和验收状态不进入本章。

## 6. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 当前阶段是否准确 | pass | 只声明架构校准，不声明实现 / readiness。 |
| 演进是否按结构与触发条件组织 | pass | E0~E4 无日期、排期或任务拆单。 |
| 可接受债务是否有保护条件 | pass | 五项均有关闭入口和不得越界条件。 |
| 不可接受债务是否覆盖核心红线 | pass | owner、fail-open、正文、依赖、分叉、伪完成均覆盖。 |
| 边界外能力是否被写成未来必做 | pass | E4 明确条件性且需重开需求。 |
| 是否允许创建 Step 14 | pass | 演进路线已收稳；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_14
formal_01_write_allowed = false
```
