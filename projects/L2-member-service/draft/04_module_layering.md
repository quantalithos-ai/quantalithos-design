# 04 · 模块划分与分层(参考 L1-governance 粒度)

> 性质: draft 讨论稿。分层方式参照 `L1-governance/01-架构设计.md` §6(核心子域 / 支撑子域 / 本地索引投影引用层)与 `02-概要设计.md` §4(实现分层)、§5(主要组成部分)。
> 本文只到"子域 + 主要组成部分"粒度;对象、接口、状态机留给正式 02/03。

---

## 1. 子域划分(架构层,对齐 governance §6 粒度)

```text
+---------------------------+   +---------------------------+   +---------------------------+
| 宿主意图与编排决定核心      |   | 宿主实例与会话核心          |   | 健康恢复与清理核心          |
| (control plane core)      |   | (host & session core)     |   | (health & recovery core)  |
+-------------+-------------+   +-------------+-------------+   +-------------+-------------+
              |                               |                               |
              +---------------+---------------+---------------+---------------+
                              |
                              v
+-----------------------------+-----------------------------------------------+
|                            支撑子域层                                        |
+---------------+---------------+---------------+------------------------------+
| 装配与解析支撑  | 隔离交接支撑   | 编排后端承接   | 反馈交接与派生维护            |
| (assembly &   | (sandbox      | (orchestrator | (handoff & derived           |
|  resolution)  |  handoff)     |  backend seam)|  maintenance)                |
+---------------+---------------+---------------+------------------------------+
                              |
                              v
+------------------------------------------------------------------------------+
|                     本地索引 / 投影 / 引用层                                   |
| 身份与分配引用快照 | pinned image manifest refs | 策略生效快照 | sandbox binding refs |
| runtime 会话 refs | 宿主状态 safe view | 生命周期 trace / audit / outbox        |
+------------------------------------------------------------------------------+
```

### 1.1 子域说明

| 名称 | 类型 | 作用 | 边界 |
|---|---|---|---|
| 宿主意图与编排决定核心 | 核心子域 | 承载 C-MS-1：意图受理、执行主语验证、去重、编排决定与决定历史 | 决定不等于宿主已存在；非项目型主语未闭口时 fail closed |
| 宿主实例与会话核心 | 核心子域 | 承载 C-MS-2 / C-MS-3：宿主身份、装配与 readiness、凭据事实、endpoint 注册、运行会话 | 不拥有镜像内容、runtime run、member 门面内部 |
| 健康恢复与清理核心 | 核心子域 | 承载 C-MS-4 / C-MS-5：心跳健康、失败分类、恢复 / 终止决定、下线清理、孤儿对账 | 判定与决定留痕；不改写旧实例历史；不拥有 runtime 恢复内容 |
| 装配与解析支撑 | 支撑子域 | 承载 C-MS-1 / C-MS-2 的输入组织：身份 / 分配 refs、member-images pinned image ref / manifest、策略摘要、运行环境需求与凭据准备 | 不直接解析 role → image mapping；只消费 ref / safe summary |
| 隔离交接支撑 | 支撑子域 | 承载 C-MS-2 / C-MS-5：宿主级 binding / release 关联、装配结果与允许的失败反馈 | 不提交 ToolInvocation、不推进逐动作 execute；隔离 truth 归 sandbox |
| 编排后端承接 | 支撑子域 | orchestrator adapter seam:容器运行时 / 镜像 registry 的可替换承载与能力差异收束 | 后端产品语义不进入核心语义;不可用显式 degraded |
| 反馈交接与派生维护 | 支撑子域 | 已提交宿主事实的事件发布、观测材料交接、safe view 维护、对账与重建 | 只从本仓 truth 派生;失败形成 gap,不回滚 truth |

### 1.2 本地索引 / 投影 / 引用边界

| 本地结构 | 允许 | 禁止 |
|---|---|---|
| 身份与分配引用快照 | 保存成员 / ProjectMember ref、生命周期摘要、freshness 标记 | 不保存 identity / work 正文,不成为第二真相 |
| pinned image manifest refs | 保存 member-images 提供的 pinned image ref、digest / verification / provenance refs 与 freshness | 不保存定义或镜像正文，不直接重解析 role → image mapping |
| 策略生效快照 | 保存生效策略 ref / safe summary 与适用时点 | 不保存 policy 正文,不做裁决 |
| 镜像引用 | 保存镜像 ref / 版本 / 验证结论 refs | 不保存镜像内容 / 构建材料 |
| sandbox 交接 refs | 保存宿主级 binding / release / failure / cleanup refs | 不保存逐动作 execute truth、capture 正文或隔离内部状态 |
| runtime 会话 refs | 保存 session ↔ run 关联 ref | 不保存 run / checkpoint / memory 内容 |
| 宿主状态 safe view | body-free 状态投影,可延迟可重建 | 不作为写源,不含 secret / endpoint 敏感细节外泄 |
| trace / audit / outbox | 生命周期关键变化留痕与已提交事实发布 | 不含 forbidden body;发布失败不回滚 |

## 2. 实现分层(概要层,对齐 governance 02 §4 粒度)

| 分层 | 职责 | 边界 |
|---|---|---|
| Inbound / Operations | command、query、事件消费(identity / work / governance)、宿主内注册与心跳入口、后台 job 触发 | 不做业务判定 |
| Application Services | 编排用例、事务、幂等、决定形成、repository / port 调用、outbox | 不替代 domain 不变量 |
| Domain Model & Policies | 宿主 / 会话 / 健康 / 恢复对象、状态与不变量、编排与健康 guard | 不直接读配置或外部正文 |
| Ports & External Seams | identity / work / governance / member-images / member / runtime / sandbox / bus / observability seam 与 orchestrator / registry adapter；method-library 仅作 member-images 的间接上游背景 | 外部 truth 不进入本仓，不建立直接 role/image 解析 seam |
| Persistence / Projection | truth、trace、audit、快照、safe view | projection 不反写真相 |
| Outbox & Handoff | 已提交宿主事实传播与观测 / 归档交接 | 失败形成 gap,不回滚 |

## 3. 主要组成部分(概要层候选,9 个,对齐 governance 02 §5 粒度)

| 组成部分 | 核心职责 | 不承担 | 支撑能力 |
|---|---|---|---|
| Host truth core | 保护宿主 / 会话 / 健康 truth、不变量、trace / audit / outbox 成立边界 | 不定义相邻仓 truth | 全部 |
| Orchestration intent & decision management | 意图受理、来源验证、去重、编排决定与决定历史 | 不拥有分配 / 身份 truth;决定 ≠ 执行完成 | C-MS-1 |
| Assembly & resolution management | 装配输入组织：身份 / 分配 refs、pinned image manifest、策略摘要、运行环境需求、凭据准备 | 不直接解析角色镜像映射，不拥有定义 / 镜像 / 策略 truth | C-MS-1 / C-MS-2 |
| Host instance lifecycle management | 宿主实例身份、装配 readiness、生命周期状态、启动 / 停止 / tombstone | 不拥有容器平台语义、镜像内容 | C-MS-2 / C-MS-4 / C-MS-5 |
| Registration & session management | 注册受理、endpoint 登记、会话建立 / 失效、run 关联 refs | 不拥有 runtime run / member 内部 | C-MS-3 |
| Health & failure management | 心跳承接、健康判定、失败分类、变化历史 | 判定阈值数值归配置;不拥有 runtime 失败语义 | C-MS-4 |
| Sandbox handoff management | 宿主级 bind / release 关联、装配结果与允许的失败反馈保存 | 不拥有逐动作 execute、ToolInvocation 或隔离 truth | C-MS-2 / C-MS-5 |
| Recovery & cleanup management | 恢复 / 终止决定、重启新实例、下线清理、孤儿对账 | 不改写历史，不拥有 runtime 恢复内容 | C-MS-4 / C-MS-5 |
| Consumption, handoff & derived maintenance | 事件发布、观测材料交接、safe view / 对账 / 重建 | 只派生不反写；不拥有 delivered / observed truth | C-MS-5 + 外围 |

组成部分交互方向(语义依附,不是调用顺序):

```text
Orchestration intent & decision --> Host truth core <-- Registration & session
        |                              ^    ^                +-- Health & failure
        v                              |    |                +-- Recovery & cleanup
Assembly & resolution -----------------+    |
Sandbox handoff ----------------------------+
Consumption / derived maintenance <--- Host truth core (只读派生)
(orchestrator backend seam 承接 lifecycle / cleanup 的物理动作,不进入语义层)
```

## 4. 与 L1-governance 粒度的对照检查

| governance 参照 | 本仓对应 | 一致性 |
|---|---|---|
| 3 个核心子域(裁决 / 策略控制 / 合规纠正) | 3 个核心子域(决定 / 实例会话 / 健康恢复) | 核心子域按不同生命周期族拆分,数量与粒度相当 |
| 4 个支撑子域 | 4 个支撑子域 | 均为"围绕核心 truth 工作,不生成第二事实" |
| 本地索引 / 投影 / 引用层 | 同构 | 均只保存 ref / snapshot / projection / handoff |
| 02 §4 六个实现分层 | 同构复用 | 一致 |
| 02 §5 10 个主要组成部分 | 9 个 | 数量相当;本仓无"合规纠正"类,多出 adapter seam 类 |

## 5. 待确认的分层问题(进入正式 01/02 前)

| 问题 | 影响 | 当前倾向 |
|---|---|---|
| 策略传递(若 MSVC-UP-005 确认归本仓)放在哪个组成部分 | 可能新增"Policy propagation management"或并入 Consumption / handoff | 待 owner 确认后再定,不预建模块 |
| Registration & session 与 Health & failure 是否合并为一个"接入与健康"部分 | 模块数量 vs 生命周期独立性 | 倾向分开:注册是事实建立,健康是持续判定,变化频率不同 |
| orchestrator adapter 的能力差异矩阵放架构层还是配置层 | 可裁剪性表达位置 | 架构层定 seam 与差异收束原则,配置层定具体后端启用 |
| 非 ProjectMember-scoped 宿主是否进入本版及其执行主语 | 宿主身份模型与 C-MS-1 受理语义 | 当前版已选择项目型-only；非项目型 launch fail closed，未来纳入须先由正式 ADR / 上游合同定义第三种主语并重开 MSVC-UP-009 |
