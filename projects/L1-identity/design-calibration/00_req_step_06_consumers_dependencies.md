# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-06-10

---

## 1. Step 状态 + Step 内计划

- 状态: 已完成
- 本步目标: 裁剪 `L1-identity` 的输入依赖、输出消费方、依赖类型和禁止依赖,为后续接口与依赖章节提供稳定来源。
- 复杂度判断: 本步依赖关系较多,但仍可在单文件内完成;后续 Step 12 再把依赖转译为能力级接口边界。

| 子步骤 | 产物 | 状态 |
|---|---|---|
| 读取 Step 2 / Step 5 和依赖裁剪规则 | 输入表 | 已完成 |
| 回答使用方与依赖问题 | SOP 问题回答表 | 已完成 |
| 诊断旧依赖口径混写 | 当前文档问题诊断表 | 已完成 |
| 比较依赖裁剪前后 | 改动前后对比表 | 已完成 |
| 记录依赖取舍 | 设计取舍表 | 已完成 |
| 输出依赖表、禁止依赖表和依赖裁剪图 | 结构化中间产物 | 已完成 |
| 形成正式 §6 回填草稿 | 回填草稿 | 已完成 |
| 列出待确认事项和下一步门禁 | 待确认事项、进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓定位与边界 | 确认依赖不能改变 identity truth ownership |
| Step 5 用户与角色 | 区分系统角色和相邻仓消费方 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 裁剪编译期、运行期、事件协作和禁止依赖 |
| `architecture/仓库拆分方案.md` | 确认 L1/L2/L3/L4 仓职责 |
| 旧 README / 旧设计 | 诊断 DB、bus、runtime、observability 等依赖混写 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓向哪些仓 / 系统提供能力 | 向 work、process、conversation、governance、workspace、member-service/runtime、archive/observability、SDK/console 等提供成员身份锚点、状态摘要和追溯材料。 |
| 本仓依赖哪些仓 / 系统 | 编译期依赖 `L0-core`;事件协作依赖 `L0-bus`;运行期或事件协作消费 method-library、work、governance、archive/memory 等来源。 |
| 哪些依赖进入主链 | `L0-core`、`L0-bus`、`L3-method-library`、`L1-work` 是核心或场景前置;governance、archive/memory、observability 是高风险 / 追溯 / 归档场景前置。 |
| 哪些关系应裁剪 | 不把 L2 runtime、L5 UI、外部 DB / vector product、observability product 写成编译期依赖。 |
| 依赖失效会怎样 | 核心身份锚定可保持,但角色能力同步、生涯追加、高风险处置、归档协作或追溯消费会降级、暂停或进入待对账。 |
| 编译期依赖候选是什么 | 当前需求层只允许 `L0-core`;其他均为运行期、事件协作或下游消费关系。 |

---

## 4. 当前文档问题诊断

| 旧表现 | 问题 | 新处理 |
|---|---|---|
| `quantalithos-bus`、method-library、observability、PostgreSQL、向量库、runtime 同列为关键依赖 | 依赖类型混乱 | 按编译期、事件协作、运行期和外部承载拆分 |
| method-library 可能作为源码依赖 | 会形成业务仓耦合,并把定义正文带入 identity | 只作为运行期 / 事件协作来源 |
| work 的 ProjectMember 可能被 identity 读取内部结构 | 会打穿 ProjectMember 归属 | 只消费正式项目参与事实或 work refs |
| runtime / member-service 被写成上游 | 运行层消费 identity,不拥有 identity truth | 写成下游消费 / 运行期协作 |
| observability / archive 与正文存储混写 | 容易保存正文或 audit store 细节 | 只保留归档、追溯和 handoff 需求边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 编译期依赖 | 多个仓和基础设施可能被视为依赖 | 只允许 `L0-core` | 避免 L1/L2/L3 循环 |
| `L0-bus` | 可能写成业务源码依赖 | 事件协作主干 | bus 不是 identity 业务真相 |
| method-library | 可能作为 Role / Capability 源码依赖 | 运行期 / 事件协作来源 | 防止定义正文入仓 |
| work | 可能共享 ProjectMember truth | 只协作项目参与事实和 refs | 保持 GlobalMember / ProjectMember 分层 |
| archive / memory | 可能成为正文存储依赖 | 只协作 ref、迁移和冷存状态 | 防止正文泄漏 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把所有会交互的仓都列为强依赖 | 关系完整 | 会导致实施误解为源码依赖或强前置 | 不采用 |
| 方案 B: 按编译期 / 运行期 / 事件协作 / 下游消费裁剪 | 类型清楚,利于后续实现边界 | 需要后续接口设计明确 resolver / event | 采用 |
| 方案 C: 只保留 `L0-core`,其他依赖全部后移 | 边界极简 | 无法说明角色能力、生涯、治理和归档来源 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 identity、actor、trace、error、metadata 等基础契约 | 是 | 无法形成跨仓可识别身份引用 |
| 协作 | `L0-bus` | 身份变化、角色能力变化和生涯变化的事件协作主干 | 是 | 相邻仓无法及时消费身份事实变化 |
| 输入 | `L3-method-library` | 角色 / 能力定义来源和版本语义 | 是,对角色能力闭环 | 角色能力摘要无法稳定校验或对账 |
| 输入 | `L1-work` | 项目参与、生涯追加和 ProjectMember 分层来源 | 是,对生涯闭环 | career history 无法由正式项目事实支撑 |
| 输入 | `L1-governance` | 高风险生命周期处置或授权约束的治理结论 | 否,但阻塞高风险处置 | 高风险生命周期动作只能暂停或进入待审 |
| 输出 | `L1-work` | GlobalMember 身份锚点和成员状态摘要 | 是 | work 无法稳定建立 ProjectMember 与平台成员分层 |
| 输出 | `L1-process` | actor / participant 身份摘要和可追溯成员引用 | 否 | process 只能降级为 opaque actor ref,可读性和追溯受限 |
| 输出 | `L1-conversation` | 成员显示身份、参与者摘要和身份变化 | 否 | 对话显示和成员上下文会降级或延迟 |
| 输出 | `L1-governance` | actor responsibility chain 所需成员身份引用 | 否,但影响治理追溯 | 治理证据中成员身份链不完整 |
| 输出 | `L1-workspace` | 成员视图、inbox 和跨项目身份摘要 | 否 | workspace 视图无法显示稳定成员上下文 |
| 输出 | `L2-member-service` / `L2-runtime` | 成员生命周期、角色能力摘要和可运行性信号 | 否 | 运行编排无法稳定响应身份变化 |
| 输出 | `L4-archive` / `L4-observability` | 身份追溯、归档触发和审计引用 | 否 | 冷存、审计和追溯材料不完整 |
| 输出 | `L0-sdk` / L5 产品 | 对外封装的成员查询和管理能力 | 否 | UI / 生态只能绕开 SDK 或暂不可用 |

### 7.2 依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 refs、actor、trace、metadata 和错误基础 | `03` / `07` |
| 事件协作依赖 | `L0-bus` | 发布身份变化并消费正式外部事实事件 | `01` / `03` / `05` |
| 运行期 / 事件协作 | `L3-method-library` | 读取或同步角色 / 能力定义摘要 | `01` / `03` |
| 运行期 / 事件协作 | `L1-work` | 接收项目参与事实并输出身份锚点 | `02` / `03` / `05` |
| 运行期 / 事件协作 | `L1-governance` | 消费高风险处置结论并提供责任链身份引用 | `02` / `03` / `05` |
| 下游消费 / 运行期协作 | `L1-conversation` / `L1-process` / `L1-workspace` / `L2-member-service` | 提供成员摘要、状态和身份变化 | `01` / `03` / `05` |
| 运行期 / 事件协作 | `L4-archive` / `L4-observability` | 协作归档、冷存、审计和追溯 | `01` / `03` / `05` |

### 7.3 禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-identity` -> `L1-work` 源码依赖 | ProjectMember 归 work,源码依赖会形成 L1 循环和 truth 混层 | 使用 `GlobalMemberRef`、事件协作和正式查询 / snapshot |
| `L1-identity` -> `L3-method-library` 源码依赖 | RoleDefinition 正文归 method-library,identity 只消费定义摘要 | 运行期 resolver 或事件同步 |
| `L1-identity` -> `L2-member-service` / `L2-runtime` 源码依赖 | runtime 编排不是身份 truth | 发布身份变化 / 提供只读查询 |
| `L1-identity` -> `L4-archive` / memory provider 源码依赖 | memory / archive 正文不归 identity | 保存 refs,通过 adapter / event 协作 |
| `L1-identity` -> L5 UI 源码依赖 | UI 展示不定义身份 truth | SDK / public API / projection |

### 7.4 依赖裁剪图

```text
+----------------------+
| L1-identity          |
+----------+-----------+
           |
           | [compile]
           v
        L0-core

L1-identity <--> [event]         L0-bus
L1-identity <--> [runtime/event] L3-method-library
L1-identity <--> [runtime/event] L1-work
L1-identity <--> [runtime/event] L1-governance
L1-identity  --> [runtime/event] L1-conversation / L1-process / L1-workspace
L1-identity  --> [runtime/event] L2-member-service / L2-runtime
L1-identity <--> [runtime/event] L4-archive / L4-observability
```

说明:

- 本图只展示 `L1-identity` 相关依赖边,不复制 27 仓总矩阵。
- 只有 `[compile] L0-core` 可以进入 package dependency。
- `[runtime]` 和 `[event]` 关系不得写成源码依赖或共享数据库事务。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序或事件时序。

---

## 8. 回填草稿

```md
## 6. 使用方与依赖

> 校准来源:
> - `design-calibration/00_req_step_06_consumers_dependencies.md`

`L1-identity` 的编译期依赖候选只允许 `L0-core`;它通过 `L0-bus` 进行事件协作,并以运行期或事件协作方式消费 `L3-method-library`、`L1-work`、`L1-governance`、archive / memory 和 observability 等来源。相邻仓可以消费 identity 的成员身份锚点、生命周期摘要、角色能力摘要、生涯 / memory refs 和变化追溯,但不得反向定义 identity truth。

运行期依赖或事件协作不可被写成业务仓源码依赖。ProjectMember、RoleDefinition、runtime context、memory body、archive package、UI view 和 observability store 均不因协作关系进入 identity 真相边界。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| OQ-ID-S6-001 | method-library 是否以 event 还是 query 提供角色定义摘要 | 需求层只确认依赖类型和边界,协议后移 |
| OQ-ID-S6-002 | memory / archive 是否是正式仓还是外部系统 | 当前按相邻承载边界处理,不写成 identity 编译期依赖 |
| OQ-ID-S6-003 | `L0-bus` 在实现仓是否作为 library dependency | 需求层只定义事件协作;具体 package dependency 后移架构 / 实施计划 |

---

## 10. 进入下一步条件

已明确输入依赖、输出能力、闭环前置关系和禁止依赖,并确认运行期 / 事件协作不得写成源码依赖。可以进入 Step 7,收束核心能力闭环。
