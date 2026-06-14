# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-06-10

---

## 1. Step 状态 + Step 内计划

- 状态: 已完成
- 本步目标: 用可审查的边界语言说明 `L1-identity` 是什么、不是什么、为什么单独成仓,以及如何判断某个能力是否属于 identity。
- 复杂度判断: 本步涉及多仓边界,但可在单文件内闭口;后续对象、接口、状态机不在本步展开。

| 子步骤 | 产物 | 状态 |
|---|---|---|
| 读取 Step 1 和稳定上游 | 输入表 | 已完成 |
| 回答定位 / 边界问题 | SOP 问题回答表 | 已完成 |
| 诊断旧文档混层 | 当前文档问题诊断表 | 已完成 |
| 比较边界改动前后 | 改动前后对比表 | 已完成 |
| 记录边界取舍 | 设计取舍表 | 已完成 |
| 输出边界判定问题和边界对象表 | 结构化中间产物 | 已完成 |
| 生成正式 §2 草稿 | 回填草稿 | 已完成 |
| 明确待确认和下一步门禁 | 待确认事项、进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 1 来源声明 | 确认边界必须从稳定上游推导 |
| `product/六域模型.md` Identity 域 | 承接“员工是谁”的领域定位 |
| `architecture/仓库拆分方案.md` §4.1 | 承接 `quantalithos-identity` 仓级职责 |
| `domain/identity/README.md` | 提取 GlobalMember / ProjectMember、Role、Capability、memory ref 等历史边界线索 |
| 旧 `00/01/02` | 诊断旧需求、架构和概要中边界混写位置 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓一句话定义是什么 | `L1-identity` 是平台级 AI 员工身份真相仓。 |
| 为什么需要单独成仓 | AI 员工身份需要跨项目、跨对话、跨运行实例长期存在,不能散落在 work、runtime、conversation、gateway 或 UI 中。 |
| 本仓主要回答什么问题 | 回答“这个 AI 员工是谁、当前是否全局可用、它的身份侧职业能力是什么、有哪些生涯和记忆引用、相邻仓如何稳定消费它”。 |
| 本仓不是什么 | 不是认证系统、授权裁决系统、ProjectMember 管理仓、RoleDefinition 正文仓、memory/archive 正文仓、runtime 容器编排仓、UI 展示仓。 |
| 最容易与哪些相邻仓或概念混淆 | 认证 / ActorContext、`L1-work` 的 ProjectMember、`L3-method-library` 的 RoleDefinition、`L2-member-service` 的 runtime member、memory/archive 正文、workspace 视图。 |
| 边界判定的核心问题是什么 | 该能力是否需要 identity 拥有平台级成员身份真相;如果只是项目承担、定义正文、运行状态或外部正文,则不归 identity。 |

---

## 4. 当前文档问题诊断

| 旧口径 | 问题 | 新处理 |
|---|---|---|
| `GlobalMember / Role / Capability` 一并作为 identity 主对象 | Role / Capability 可能包含定义正文和方法语义,容易与 method-library 混层 | 需求层改为身份侧角色能力摘要、来源引用和证据引用 |
| 生命周期和 runtime 容器启停联动 | 全局身份可用性与运行实例状态混层 | identity 只拥有全局生命周期,不拥有容器编排 |
| career / project participation 混写 | 项目事实可能被 identity 反向定义 | identity 只保存身份侧生涯记录和 work refs |
| semantic memory ref 直接挂 GlobalMember | ref 关系有价值,但正文、向量、检索索引不归 identity | 只保留 memory refs 和迁移状态,禁止正文 |
| API / DB / event 名出现在边界描述里 | 过早进入详细设计 | 后续 `02/03` 再推导 protocol 和 object contract |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定位 | 身份域详细设计或成员管理服务 | 平台级 AI 员工身份真相仓 | 与需求层和 truth ownership 对齐 |
| Role / Capability | 容易被看成 identity 拥有定义正文 | identity 只拥有身份侧摘要、来源和证据引用 | 防止侵入 method-library |
| ProjectMember | 旧材料多次联动 | 明确归 `L1-work` | 保持 GlobalMember / ProjectMember 分层 |
| memory | 旧材料强调 semantic memory ref | 只承认 ref-only 和禁止正文 | 保护正文、向量和归档边界 |
| runtime | 旧材料提容器重启、member-service 调用 | 只作为消费身份事实的相邻层 | 身份真相与执行编排分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: identity 作为“所有成员相关信息中心” | 查询便利,概念上集中 | 会吸收 ProjectMember、RoleDefinition、memory body 和 runtime 状态 | 不采用 |
| 方案 B: identity 只拥有平台级成员身份真相和身份侧摘要 / 引用 | truth 边界稳定,可与相邻仓解耦 | 需要后续 resolver、事件和对账机制 | 采用 |
| 方案 C: work 拥有成员身份,identity 只做目录 | 项目场景简单 | 跨项目身份、生涯和审计会断裂 | 不采用 |
| 方案 D: method-library 拥有角色能力与成员画像 | 定义和能力接近 | 会让 method-library 反向拥有成员身份 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 定位卡片

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L1-identity` 是平台级 AI 员工身份真相仓。 |
| 正向范围 | GlobalMember 身份锚点、全局生命周期、身份侧角色能力摘要、生涯记录、memory refs、身份消费与追溯。 |
| 反向范围 | 认证、授权裁决、ProjectMember、RoleDefinition / CapabilityDefinition 正文、memory/archive 正文、runtime 编排、UI 展示。 |
| 单独成仓原因 | 平台需要一个独立于项目、运行实例、对话和外部正文的成员身份真相,让 AI 员工可以长期存在、被稳定引用和被审计。 |

### 7.2 边界判定问题

| 判定问题 | 落入 identity | 不落入 identity |
|---|---|---|
| 是否回答“这个 AI 员工是谁” | 建立、读取、追溯平台级成员身份主语 | 登录认证、credential 校验、session 管理 |
| 是否影响成员全局可用性 | 暂停、退役、墓碑化等全局身份生命周期 | 项目内成员状态、runtime 容器状态、任务执行状态 |
| 是否解释成员身份侧职业 / 能力 | 保存角色来源引用、能力摘要、证据引用 | 编辑方法正文、维护定义正文、自动评分算法 |
| 是否记录成员长期经历的身份侧事实 | 追加生涯记录、保存 memory refs、记录迁移引用状态 | 保存项目 truth、work item truth、memory 原文或向量 |
| 是否帮助相邻仓消费身份事实 | 提供身份锚点、状态摘要、变化追溯和对账摘要 | 让相邻仓反写 identity truth 或共享数据库事务 |

### 7.3 相邻边界清单

| 相邻概念 / 仓 | 正确边界 | 错误边界 |
|---|---|---|
| 认证 / gateway | 提供可信 actor 或操作者上下文 | 把账号、token、session 当 GlobalMember truth |
| `L1-work` | ProjectMember 引用 GlobalMember | identity 管项目内成员分配和工作事实 |
| `L3-method-library` | identity 引用角色 / 能力定义来源 | identity 保存 RoleDefinition / method body |
| `L1-governance` | 高风险生命周期消费治理或授权结论 | identity 拥有 Gate / Policy / Approval truth |
| `L2-member-service` / `L2-runtime` | 消费成员可用性和能力摘要 | identity 编排容器、工具和 runtime context |
| memory / archive | identity 保存 ref、状态和迁移关系 | identity 保存正文、向量、索引或 package |
| conversation / workspace | 消费身份摘要和显示上下文 | identity 拥有消息、UI 局部状态或 inbox |

---

## 8. 回填草稿

```md
## 2. 本仓定位与边界

> 校准来源:
> - `design-calibration/00_req_step_02_position_boundary.md`

`L1-identity` 是平台级 AI 员工身份真相仓。它负责让 AI 员工作为跨项目、跨对话、跨运行实例长期存在的身份主语被稳定创建、引用、查询、管理和追溯。

`L1-identity` 不负责认证登录、token、session、授权裁决、ProjectMember 管理、RoleDefinition / CapabilityDefinition 正文、memory / archive 正文、runtime 容器编排或 UI 展示状态。判断某个能力是否属于 identity,核心问题是它是否需要 identity 拥有平台级成员身份真相;如果只是项目承担、定义正文、运行状态、外部正文或展示状态,则应归相邻仓。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| OQ-ID-S2-001 | Role / Capability 在 identity 中的具体对象形态 | 需求层只确认身份侧摘要和引用,详细设计再定义 |
| OQ-ID-S2-002 | 高风险 lifecycle 的具体动作清单 | 需求层只确认需要治理 / 授权依据,状态矩阵后移 |
| OQ-ID-S2-003 | AI 员工自身是否可直接读写部分身份信息 | Step 5 确认受限读取,写入能力后移权限和协议设计 |

---

## 10. 进入下一步条件

已能用一句话说明本仓定位,并能用边界判定问题排除认证、work、method-library、governance、runtime、memory/archive 和 UI。可以进入 Step 3,继续定义背景与问题。
