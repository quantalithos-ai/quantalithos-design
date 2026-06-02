# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-05-31

---

## 1. 本步目标

从全局依赖关系中裁剪出 `L1-conversation` 相关的输入依赖、输出使用方和事件协作关系,说明哪些依赖会阻塞对话真相闭环成立。本步只写仓际能力关系和依赖类型,不写角色、用户故事、接口名、事件名、DTO、处理流程或实现组织。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | 已完成 | 提供“平台对话真相仓”边界和相邻仓排除项 |
| `design-calibration/00_req_step_05_users_roles.md` | 已完成 | 提供角色结论,并明确 Chat / Workspace / Bridges / Governance / Artifact 属于 Step 6 使用方与依赖 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 当前全局依赖基线 | 裁剪 `L1-conversation` 的编译期、运行期和事件协作关系 |
| 旧 `projects/L1-conversation/00-需求文档.md` §4~§6 | 旧用户、用例和功能依赖线索 | 提取 Chat、Governance、Bridges、work、identity 等依赖线索,剔除接口和功能细节 |
| `product/六域模型.md` | 六域协作输入 | 确认 Conversation 与 Work / Governance / Artifact 等真相域通过边界协作,不互相吞并 |

---

## 3. SOP 问题回答

### 3.1 本仓向哪些仓 / 系统提供哪些能力？

`L1-conversation` 向下游提供的是对话真相能力,包括对话事实的稳定来源、授权消费边界、跨域事实的对话可见记录和审计追溯线索。主要输出使用方包括:

- `L5-chat`: 作为用户聊天入口消费对话事实,但不拥有事实。
- `L1-workspace`: 将对话事实聚合到个人视野和项目视野,但不拥有对话真相。
- `L6-bridges`: 将外部平台输入 / 输出映射到平台正式边界,但不拥有外部平台之外的对话真相。
- `L2-runtime`: AI member 运行时读取授权上下文并写入新的对话事实,但推理循环不属于 Conversation。
- `L4-observability` / `L4-archive`: 消费对话追溯材料、审计材料或归档材料,但不反写业务真相。

这些都是输出使用方或协作方,不是 Step 5 的角色。

### 3.2 本仓依赖哪些仓 / 系统提供哪些能力？

`L1-conversation` 的直接编译期依赖只应是 `L0-core`,用于共享 ID、actor 引用、trace、error、metadata 和通用契约。事件协作依赖通过 `L0-bus` 完成,用于把对话事实向平台其他仓传播,也用于消费已经被授权进入对话视野的跨域事实。

运行期或事件协作层面,Conversation 需要按需引用:

- `L1-identity`: 提供 actor / participant / member 引用和生命周期边界。
- `L1-work`: 提供项目、工作项和项目成员上下文,支撑项目型对话空间。
- `L1-governance`: 提供 Gate / Policy / Approval 等治理事实的引用边界。
- `L1-artifact`: 提供产物、版本和证据对象的引用边界。

这些关系不能自动推导为源码依赖。需求阶段只确认能力关系,后续设计再决定通过 API、SDK、事件投影或引用快照承接。

### 3.3 这些关系在全局依赖基线中分别是什么边？

全局依赖基线给出: `L1-conversation` 编译期依赖 `L0-core`,按需运行期消费 identity / governance / artifact 能力边界,并通过 `L0-bus` 发布对话事件。结合其他仓的全局行,还可以裁剪出 `L0-sdk`、`L5-chat`、`L1-workspace`、`L6-bridges`、`L2-runtime`、`L4-observability` 和 `L4-archive` 对 Conversation 的消费关系。

本步只裁剪与 `L1-conversation` 直接相关的边,不复制全 27 仓矩阵。

### 3.4 哪些依赖是闭环前置？

闭环前置分为两层:

| 层级 | 前置依赖 | 说明 |
|---|---|---|
| 基础对话真相闭环 | `L0-core`、`L0-bus`、`L1-identity` | 没有统一契约、事件协作和 actor / participant 引用,Conversation 无法稳定形成平台级对话事实 |
| 项目型协作闭环 | `L1-work` | 若要让项目群聊、项目频道和项目视野成立,需要项目和项目成员上下文 |

`L1-governance`、`L1-artifact`、`L2-runtime`、`L5-chat`、`L1-workspace`、`L6-bridges` 等是重要协作方或消费方,但不阻塞 Conversation 的基础事实闭环成立。它们会影响对应场景是否完整。

### 3.5 哪些依赖失效时会影响当前阶段能力？

`L0-core` 失效会导致 ID、actor、trace、error 和共享契约不统一,直接阻塞本仓需求主线。`L0-bus` 失效会导致对话事实无法成为平台事件协作的一部分,跨仓可见性下降。`L1-identity` 失效会导致参与者、AI member 和系统 actor 引用无法闭合。`L1-work` 失效时,项目型对话空间与项目视野会退化。`L1-governance` / `L1-artifact` 失效时,治理或产物事实只能作为缺失引用处理,不应由 Conversation 补造原始真相。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00` §4.1 | 把 Chat / Console 开发者、Governance、Bridges 写成用户类型 | 仓际使用方被混入角色章节 | Step 6 改为使用方与依赖,不再写成角色 |
| 旧 `00` §5 | 用户故事直接写 Gate 事件、Artifact 事件、外部桥接和 AG-UI | 把依赖、接口、功能和验收混在一起 | 本步只保留仓际能力关系,细节后移 |
| 旧 `00` §6 | 功能清单中以依赖列直接写 governance / artifact / work / identity | 没有区分编译期、运行期和事件协作 | 按全局依赖裁剪表分类 |
| 旧 `00` §10 | 接口章节提前定义 API / 事件 / AG-UI | 不属于 Step 6 粒度 | 后移到 Step 12 |
| 新边界 | Step 2 / Step 5 已排除 Chat UI、Workspace、Bridges、Runtime 等职责 | 仍需要说明这些对象如何消费 Conversation | 本步作为输出使用方或协作方收敛 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 使用方表达 | 用户、仓、接口消费方混写 | 人类 / AI / 系统角色留在 Step 5;仓际使用方进入 Step 6 | 避免角色和依赖混淆 |
| 依赖类型 | 直接写依赖对象,不区分类型 | 每条关系标注编译期、运行期或事件协作 | 防止运行期关系被误写成 Cargo path dependency |
| 上游依赖 | 旧文档按功能写 governance / artifact / work 等依赖 | `L0-core` 是唯一编译期基线;其他按需运行期或事件协作 | 对齐全局依赖矩阵 |
| 下游使用方 | Chat、Console、Bridges 分散在用户故事或接口章节 | 汇总为 Chat、Workspace、Bridges、Runtime、Observability / Archive 等消费关系 | 先收稳关系,再进入核心能力闭环 |
| 外部系统 | 外部聊天平台容易被直接写入 Conversation 依赖 | 当前阶段无正式外部系统依赖;外部平台归 `L6-bridges` | Conversation 不直接拥有外部平台协议和生命周期 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧文档,把 Chat / Governance / Bridges 当成用户或功能依赖 | 迁移快 | 角色、使用方、功能、接口混写,后续会串线 | 不采用 |
| 方案 B: 从全局依赖基线裁剪本仓相关边,并按依赖类型分类 | 边界清楚,符合 SOP,能支撑 Step 7 | 需要后续步骤继续展开能力和接口 | 采用 |
| 方案 C: 把所有协作仓都写成编译期依赖 | 实现时类型复用看似方便 | 违反全局依赖规则,容易形成循环依赖 | 不采用 |
| 方案 D: 只写 `L0-core` 和 `L0-bus`,忽略 L1/L2/L5/L6 消费方 | 简洁 | 无法解释 Conversation 为谁提供能力,Step 7 会缺输入 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 内部仓依赖表

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、actor 引用、trace、error、metadata 和通用契约 | 是 | 对话事实无法与平台其他仓保持统一引用和追溯口径 |
| 输入 | `L0-bus` | 平台事件协作主干 | 是 | 对话事实无法稳定进入跨仓协作,跨端可见性和订阅能力退化 |
| 输入 | `L1-identity` | 成员、AI member、系统 actor 和参与者引用来源 | 是 | 参与者身份、生命周期和 actor 引用无法闭合 |
| 输入 | `L1-work` | 项目、工作项和项目成员上下文 | 项目型对话是;基础私聊否 | 项目群聊、项目频道和项目视野会缺少项目锚点 |
| 输入 | `L1-governance` | 治理事实引用边界 | 否 | Gate / Policy / Approval 只能显示为缺失或未解析引用,Conversation 不补造决策真相 |
| 输入 | `L1-artifact` | 产物、版本和证据对象引用边界 | 否 | 产物相关对话记录只能保留引用缺失状态,Conversation 不补造产物真相 |
| 输出 | `L0-sdk` | 对话能力的默认封装和下游访问路径 | 否 | 下游仍可存在直接服务边界,但产品和生态接入一致性下降 |
| 输出 | `L5-chat` | 聊天入口消费对话事实 | 否 | 用户聊天体验受影响,但 Conversation 真相仍应成立 |
| 输出 | `L1-workspace` | 个人视野和项目视野聚合消费对话事实 | 否 | Workspace 视图无法完整展示对话相关上下文 |
| 双向协作 | `L6-bridges` | 外部平台输入 / 输出通过正式边界映射为对话事实 | 否 | 外部平台同步退化,但内部对话真相不应依赖外部平台 |
| 双向协作 | `L2-runtime` | AI member 运行时读取授权上下文并产生对话事实 | 否 | AI member 对话参与能力退化,但本仓不接管推理循环 |
| 输出 | `L4-observability` / `L4-archive` | 追溯、审计和归档材料消费 | 否 | 全局观测或归档能力下降,但不改变 Conversation 业务事实 |

### 7.2 外部系统依赖

当前阶段,`L1-conversation` 无需要纳入需求主链的正式外部系统依赖。Mattermost、Slack、Telegram 等外部聊天平台属于 `L6-bridges` 的外部系统依赖,不应直接写入 Conversation 的依赖主链。数据库、搜索引擎、消息后端等基础设施属于后续架构 / 详细设计 / 非功能讨论范围,不是本步的需求层正式外部系统依赖。

### 7.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-conversation` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享契约是对话真相闭环前置 |
| `L0-bus` | `L1-conversation` 通过 `L0-bus` 发布对话事件 | 协作方 | 事件协作 | 是 | 对话事实需要进入平台事件协作主干 |
| `L1-identity` | `L1-conversation` 按需消费 identity 能力边界 | 依赖方 | 运行期 | 是 | actor、participant、AI member 引用需要身份真相来源 |
| `L1-work` | `L1-work` 引用 identity 并发布项目 / WorkItem 事件 | 协作方 | 运行期 / 事件协作 | 是 | 项目型对话空间需要项目和项目成员上下文 |
| `L1-governance` | `L1-conversation` 按需消费 governance 能力边界 | 依赖方 | 运行期 / 事件协作 | 是 | 治理事实可在对话中显化,但原始真相归 governance |
| `L1-artifact` | `L1-conversation` 按需消费 artifact 能力边界 | 依赖方 | 运行期 / 事件协作 | 是 | 产物事实可在对话中显化或引用,但正文和版本真相归 artifact |
| `L0-sdk` | `L0-sdk` 运行期封装 L1 / L2 / L3 / L4 能力边界 | 被依赖方 | 运行期 | 是 | 下游默认通过 SDK 消费 Conversation 能力 |
| `L5-chat` | `L5-chat` 经 SDK 消费 Conversation / workspace / governance | 被依赖方 | 运行期 | 是 | Chat 是主要产品入口,但不是对话真相所有者 |
| `L1-workspace` | `L1-workspace` 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 / 事件协作 | 是 | Workspace 需要把对话事实纳入个人 / 项目视野 |
| `L6-bridges` | `L6-bridges` 将外部事件映射到内部正式边界 | 协作方 | 运行期 | 是 | Bridges 可接入外部平台,但不改变 Conversation 真相边界 |
| `L2-runtime` | `L2-runtime` 按角色消费 L0 / L1 / L3 / L4 能力 | 协作方 | 运行期 | 是 | AI member 需要读写授权对话事实,推理不归 Conversation |
| `L4-observability` | 横切观测消费 tap / audit material | 被依赖方 | 事件协作 | 是 | 对话追溯材料需要被观测体系消费 |
| `L4-archive` | 通过 SDK / bus 消费 L1 snapshot / export 能力 | 被依赖方 | 运行期 / 事件协作 | 是 | 对话历史可能进入归档和恢复链路 |
| `L5-console` | 经 SDK 消费管理能力边界 | 被依赖方 | 运行期 | 否 | 当前需求主线不是管理后台;后续如有管理用例再纳入 |
| `L6-marketplace` | 生态资产事件协作 | 无直接主链关系 | 事件协作 | 否 | 当前对话真相闭环不依赖 marketplace |

### 7.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、actor、trace、error、metadata 和通用契约 | 详细设计 / 实施计划 |
| 运行期依赖 | `L1-identity` | 消费成员、AI member、系统 actor 和参与者引用边界 | 架构设计 / 详细设计 |
| 运行期依赖 | `L1-work` | 消费项目和项目成员上下文 | 核心能力闭环 / 功能需求 / 架构设计 |
| 运行期依赖 | `L1-governance`、`L1-artifact` | 消费治理和产物引用边界,不接管原始真相 | 功能需求 / 业务规则 / 数据归属 |
| 运行期依赖 | `L0-sdk`、`L5-chat`、`L1-workspace`、`L6-bridges`、`L2-runtime` | 向下游或协作方提供对话事实访问边界 | 核心能力闭环 / 用户故事 / 接口与依赖 |
| 事件协作依赖 | `L0-bus` | 通过平台事件主干协作 | 架构设计 / 测试方案 |
| 事件协作依赖 | `L1-workspace`、`L1-governance`、`L1-artifact`、`L4-observability`、`L4-archive` | 发布或消费对话相关协作事实,不表达事件字段 | 架构设计 / 测试方案 / 验收标准 |

### 7.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-conversation -> L5-chat` | Chat 是 UI / 产品入口,Conversation 不能反向依赖展示层 | Chat 经 SDK / 正式服务边界消费对话事实 |
| `L1-conversation -> L1-workspace` | Workspace 是聚合视图,不拥有对话真相 | Workspace 只读消费 Conversation 查询 / 投影 / 事件协作结果 |
| `L1-conversation -> L6-bridges` | Bridges 适配外部平台协议,Conversation 不接管外部平台生命周期 | Bridges 通过正式边界映射输入 / 输出 |
| `L1-conversation -> L2-runtime` | Runtime 拥有 AI member 推理循环,Conversation 不运行 agent loop | Runtime 读写授权对话事实,推理过程留在 Runtime |
| `L1-conversation -> L1-governance` 编译期依赖 | Governance 真相与 Conversation 真相需要解耦,避免 L1 循环 | 使用治理引用边界、事件协作或运行期能力 |
| `L1-conversation -> L1-artifact` 编译期依赖 | Artifact 正文和版本真相不应变成 Conversation 源码依赖 | 使用产物引用边界、事件协作或运行期能力 |
| `L1-conversation -> L1-work` 编译期依赖 | Project / WorkItem 真相不应与 Conversation 源码耦合 | 使用项目引用、项目成员快照或事件协作 |
| `L1-conversation -> 外部聊天平台协议 / 生命周期` | 外部平台协议归 `L6-bridges` | 通过 Bridges 接入外部平台 |

### 7.6 依赖裁剪图

#### 依赖裁剪图: L1-conversation

```text
+---------------------+
| L1-conversation     |
| conversation truth  |
+----------+----------+
           |
           | [compile]
           v
        L0-core

+---------------------+
| L1-conversation     |
+----------+----------+
           |
           | [event]
           v
         L0-bus

+---------------------+
| L1-conversation     |
+----------+----------+
           |
           | [runtime]
           v
 L1-identity / L1-work
 L1-governance / L1-artifact

L5-chat / L1-workspace / L6-bridges / L2-runtime
           |
           | [runtime through official boundary / SDK]
           v
+---------------------+
| L1-conversation     |
+---------------------+

L4-observability / L4-archive
           |
           | [event/runtime]
           v
+---------------------+
| L1-conversation     |
+---------------------+
```

图示说明：

- 本图只展示 `L1-conversation` 相关依赖边,不展示全 27 仓矩阵。
- `[compile]` 只有 `L0-core`,可在后续实施中进入 package dependency。
- `[runtime]` 和 `[event]` 不得被误写成 Cargo path dependency。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件字段。

### 7.7 本章结论

`L1-conversation` 当前阶段的依赖主线是:以 `L0-core` 作为唯一编译期共享契约基线,以 `L0-bus` 作为事件协作主干,以 `L1-identity` 作为 actor / participant 引用前置,并按需与 `L1-work`、`L1-governance`、`L1-artifact` 协作。Chat、Workspace、Bridges、Runtime、Observability 和 Archive 是重要使用方或协作方,但不能反向决定 Conversation 的真相边界。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §6。

```md
## 6. 使用方与依赖

> 校准来源：
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“本仓禁止依赖表”和“依赖裁剪图”小节，了解本章如何从全局依赖基线裁剪出 Conversation 的依赖子图。

### 6.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、actor 引用、trace、error、metadata 和通用契约 | 是 | 对话事实无法与平台其他仓保持统一引用和追溯口径 |
| 输入 | `L0-bus` | 平台事件协作主干 | 是 | 对话事实无法稳定进入跨仓协作,跨端可见性和订阅能力退化 |
| 输入 | `L1-identity` | 成员、AI member、系统 actor 和参与者引用来源 | 是 | 参与者身份、生命周期和 actor 引用无法闭合 |
| 输入 | `L1-work` | 项目、工作项和项目成员上下文 | 项目型对话是;基础私聊否 | 项目群聊、项目频道和项目视野会缺少项目锚点 |
| 输入 | `L1-governance` | 治理事实引用边界 | 否 | Gate / Policy / Approval 只能显示为缺失或未解析引用,Conversation 不补造决策真相 |
| 输入 | `L1-artifact` | 产物、版本和证据对象引用边界 | 否 | 产物相关对话记录只能保留引用缺失状态,Conversation 不补造产物真相 |
| 输出 | `L0-sdk` | 对话能力的默认封装和下游访问路径 | 否 | 下游仍可存在直接服务边界,但产品和生态接入一致性下降 |
| 输出 | `L5-chat` | 聊天入口消费对话事实 | 否 | 用户聊天体验受影响,但 Conversation 真相仍应成立 |
| 输出 | `L1-workspace` | 个人视野和项目视野聚合消费对话事实 | 否 | Workspace 视图无法完整展示对话相关上下文 |
| 双向协作 | `L6-bridges` | 外部平台输入 / 输出通过正式边界映射为对话事实 | 否 | 外部平台同步退化,但内部对话真相不应依赖外部平台 |
| 双向协作 | `L2-runtime` | AI member 运行时读取授权上下文并产生对话事实 | 否 | AI member 对话参与能力退化,但本仓不接管推理循环 |
| 输出 | `L4-observability` / `L4-archive` | 追溯、审计和归档材料消费 | 否 | 全局观测或归档能力下降,但不改变 Conversation 业务事实 |

### 6.2 外部系统依赖

当前阶段,`L1-conversation` 无需要纳入需求主链的正式外部系统依赖。Mattermost、Slack、Telegram 等外部聊天平台属于 `L6-bridges` 的外部系统依赖,不应直接写入 Conversation 的依赖主链。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 `L1-work` 作为基础对话闭环前置 | 是,所有对话都必须依赖项目上下文 | 否,仅项目型对话依赖 `L1-work`,基础私聊不依赖 | 推荐 B。原因是 Conversation 需要同时支持个人 / 私聊和项目型对话 |
| Q-002 | 是否让 Conversation 直接依赖外部聊天平台 API | 是,由 Conversation 接入 Mattermost / Slack | 否,外部平台协议归 `L6-bridges` | 推荐 B。原因是 Bridges 才是外部协议适配边界 |
| Q-003 | 是否把 governance / artifact / work 写成编译期依赖 | 是,方便复用类型 | 否,按运行期 / 事件协作处理 | 推荐 B。原因是全局矩阵规定 `L1-conversation` 编译期只依赖 `L0-core` |
| Q-004 | 是否把 Chat / Workspace / Runtime 写成 Conversation 的事实所有者 | 是,由使用场景决定事实归属 | 否,它们是消费方或协作方,不拥有对话真相 | 推荐 B。原因是 Conversation 的独立价值就是稳定对话真相边界 |

当前建议：按推荐方案继续进入 Step 7。

---

## 10. 进入下一步条件

- 已从全局依赖关系中裁剪出 `L1-conversation` 相关依赖边。
- 已区分编译期、运行期和事件协作依赖。
- 已明确基础闭环前置依赖与项目型协作前置依赖。
- 已说明外部聊天平台不直接进入 Conversation 依赖主链。
- 已形成依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图。
