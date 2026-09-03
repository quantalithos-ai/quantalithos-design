# 01 架构校准 Step 3：职责边界

> 状态：completed / pass
> 日期：2026-08-22
> 前序门禁：Step 2 completed / pass
> 本步目的：收稳本仓做什么、不做什么、易混淆职责和边界红线，不展开系统上下文或内部子域

## 1. Step 内计划

- [x] 读取 flow、台账、Step 1~2 与正式 00 的定位 / 非目标 / 功能边界。
- [x] 按 C-MS-1~5 回答本仓具体承担的职责。
- [x] 按外部 truth owner 回答本仓明确不承担的职责。
- [x] 诊断 launch、readiness、session、binding、cleanup、health 和 handoff 的易混淆边界。
- [x] 形成做 / 不做表和边界红线。
- [x] 检查未提前写入上下文、子域、数据字段或接口方案。

## 2. SOP 问题回答

### 2.1 本仓具体做什么

1. 接受正式项目型宿主意图，验证双锚范围，并形成受理、拒绝、等待、冲突或 no-action 结论。
2. 形成 launch、restart、stop、terminate、relocate 或 hold 等宿主侧编排决定，并保留决定历史。
3. 建立宿主实例身份与世代关系，组织正式装配输入，记录分项结果并判定 host readiness。
4. 接受或拒绝宿主内注册，维护活动 endpoint、注册历史和 host session 壳。
5. 从允许信号形成 host / session / backend / unknown 分层健康结论。
6. 形成宿主侧恢复、重启、停止和终止决定；新实例回链旧实例，不抹写历史。
7. 失效本地注册 / session / binding 关联，记录 cleanup / release 本地决定、attempt、gap 与 residual。
8. 对控制面事实和承载 / binding 反馈做残留、孤儿和漂移对账。
9. 从已提交宿主事实形成 body-free safe material、只读视图和本地 handoff attempt / gap。

### 2.2 本仓具体不做什么

- 不创建或修改 GlobalMember、ProjectMember、Project、WorkItem、Policy、Decision 或其他 L1 truth。
- 不拥有 Runtime run / turn / goal / plan / memory / checkpoint / outcome / entry truth。
- 不拥有 Member 主体、presence、入站过滤、出站交互、请求 / 信号 / 报告正文。
- 不拥有镜像内容、构建、发布、签名、BOM、provenance evidence 或 Role -> image 映射。
- 不拥有 Tool identity / execution、Capability registry 或外部 MCP / A2A / API truth。
- 不拥有 Sandbox isolation、policy execution、capture、enforcement、backend cleanup truth。
- 不签发或撤销 launch credential，不保存 credential / secret 正文。
- 不拥有容器运行时、编排平台或 registry 的产品状态机与运维策略。
- 不拥有 Bus delivery、Observability observed、Artifact / Archive / Evidence / report / verdict truth。
- 不预建 policy 传递能力，不支持当前范围外的非项目型宿主。

### 2.3 哪些职责最容易混淆

| 易混淆对 | 本仓职责 | 相邻 owner 职责 |
|---|---|---|
| 项目成员分配 vs 宿主意图 | 受理正式来源后的宿主意图并决定是否编排 | Work 拥有 ProjectMember 分配 / 回收事实。 |
| GlobalMember identity vs 执行主语 | 只关联身份锚并验证与 ProjectMemberRef 一致 | Identity 拥有 GlobalMember lifecycle 与身份正文。 |
| host readiness vs runtime readiness | 判定宿主装配和接入是否可用 | Runtime 判定 run / execution 的内部状态。 |
| host session 壳 vs Runtime session / run | 维护宿主与外部运行对象的关联壳和可用性 | Runtime 拥有运行会话内容、run、checkpoint 与 outcome。 |
| registration acceptance vs Member report | 接受 / 拒绝、维护 registry 与活动关联 | Member 拥有请求、信号、报告与本地发送尝试。 |
| SandboxBinding 装配 vs isolation truth | 保存宿主级 binding 关联和本地装配结果 | Sandbox 拥有受控执行、enforcement、capture 与 cleanup truth。 |
| host cleanup attempt vs external cleanup completion | 记录本地决定、尝试、gap 和 residual | Sandbox / 承载后端拥有各自实际完成事实。 |
| host health vs business / runtime / observed 状态 | 形成宿主层四类健康结论 | Runtime、业务域和 Observability 各自拥有内部 / observed truth。 |
| image qualification vs image supply truth | 消费正式 pinned supply 并形成本地装配资格结论 | Images 拥有镜像内容、构建、发布和供给 truth。 |
| handoff material vs delivery / observed / accepted | 形成 body-free 材料和本地 attempt / gap | Bus / Observability / 下游各自拥有完成状态。 |

### 2.4 哪些行为绝不能隐式发生

- 查询、事件、心跳或外部引用出现不能隐式创建、启动、重启、停止或迁移宿主。
- readiness、恢复、终止、cleanup 和 handoff 不能由单一外部反馈自动覆盖既有决定。
- stale / conflict / unknown 不能被默认值或 adapter fallback 压成正常。
- 后端资源存在不能反推出正式宿主已存在，资源消失也不能删除宿主历史。
- runtime checkpoint、Member 状态、Sandbox capture 或 Observability 信号不能替代本仓健康 / 恢复结论。

## 3. 当前材料诊断与取舍

| 候选口径 | 诊断 | 取舍 |
|---|---|---|
| “管理 ProjectMember 的容器” | 把 Work 主体 truth 和宿主承载压成一句，容易误读为拥有 ProjectMember | 改为“以 ProjectMemberRef 为执行主语的宿主控制面”，不拥有主体 truth。 |
| “编排大脑” | 与 Runtime 的运行决策语义冲突 | 删除；只使用 host control plane / host truth。 |
| “Sandbox execute / cleanup 由本仓协调” | 宿主级和逐动作执行混层 | 只保留宿主级 binding / release 接缝与本地 attempt / gap。 |
| “运行会话管理” | 容易吸收 Runtime run / checkpoint | 使用 host session 壳，并明确 Runtime 只以 ref 关联。 |
| “健康状态”单一概念 | 会把进程、会话、后端、业务和观测状态压平 | 固定 host / session / backend / unknown 分层。 |
| “事件发布完成” | 容易把 local attempt 当 delivery / observed | 固定 local truth / attempt / gap / external status 分层。 |

## 4. 结构化中间产物

### 4.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 宿主意图受理与项目型范围判定 | 做 | 形成正式受理结论，不创建 Work / Identity truth。 |
| 宿主编排决定与决定历史 | 做 | 决定是否及如何变更宿主，不把决定伪装成外部动作完成。 |
| 宿主实例、世代、装配结果与 readiness | 做 | 拥有 host-side truth，只关联外部供给和承载 refs。 |
| 注册接受、endpoint registry 与 host session 壳 | 做 | 活动关联唯一并保留替换 / 失效历史。 |
| 宿主健康、失败分类与宿主侧恢复 / 终止决定 | 做 | 只处理宿主层，不处理 run 内恢复。 |
| 本地 cleanup / release、残留对账和 handoff gap | 做 | 本地事实归本仓，外部 completion 归外部 owner。 |
| Runtime / Member / Images / Sandbox / Tools truth | 不做 | 通过正式 seam 协作，不吸收正文、状态机或 owner。 |
| Identity / Work / Governance 等 L1 truth | 不做 | 只消费 typed ref、safe snapshot 或正式变化材料。 |
| 编排平台、registry、观测和归档产品本体 | 不做 | 只消费 adapter / handoff 能力。 |
| policy 传递与非项目型宿主 | 当前不做 | 没有当前 FR；正式纳入时必须重开需求和受影响架构。 |

### 4.2 边界红线

| 红线 ID | 红线 |
|---|---|
| `BL-MS-001` | 不得以 GlobalMemberRef、显示名、endpoint 或后端资源 ID 替代 ProjectMemberRef 执行主语。 |
| `BL-MS-002` | 不得让 Runtime、Member、Work、Sandbox 或后端成为第二宿主生命周期写源。 |
| `BL-MS-003` | 不得把 host session 壳扩张为 run、checkpoint、memory 或 outcome 容器。 |
| `BL-MS-004` | 不得直接解析 Role -> image 映射或保存镜像 / 构建 / credential 正文。 |
| `BL-MS-005` | 不得提交 ToolInvocation、推进逐动作 execute 或将 host fallback 作为隔离失败降级。 |
| `BL-MS-006` | 不得把 external cleanup / delivery / observed / accepted 的 attempt 或 snapshot 写成完成。 |
| `BL-MS-007` | 不得让 adapter 产品状态、fake 或历史方案取得 domain authority。 |
| `BL-MS-008` | 不得用查询、信号或派生视图隐式触发生命周期变化。 |

## 5. 回填草稿

- 正式 §4 使用一张职责边界表和一张易混淆职责表表达“做 / 不做 / 为什么”。
- §4.1 固定 BL-MS-001~008 的语义，不复制接口、数据对象或系统上下文关系。
- 正式 §5 才列外部上下文对象；正式 §6 才划内部语义单元。

## 6. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 做 / 不做是否完整 | pass | C-MS-1~5 和所有主要外部 owner 均覆盖。 |
| 易混淆职责是否去歧义 | pass | launch、session、binding、cleanup、health、handoff 均拆分。 |
| 是否存在隐式生命周期入口 | pass | 已列为 BL-MS-008 和禁止行为。 |
| 是否提前展开系统上下文、子域或接口 | pass | 仅表达职责和边界判断。 |
| 是否允许创建 Step 4 | pass | 职责边界已收稳；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_04
formal_01_write_allowed = false
```
