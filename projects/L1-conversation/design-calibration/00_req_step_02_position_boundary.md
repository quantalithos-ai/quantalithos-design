# Step 2. 本仓定位与边界

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 2
> 回填章节: `00-需求文档.md` §2 本仓定位与边界
> 生成日期: 2026-05-31

---

## 1. 本步目标

建立 `L1-conversation` 的仓级心智模型,先说明它是什么、不是什么、为什么需要单独存在,防止后续把 Chat UI、Workspace 视图、Bridges 适配、Runtime 推理、Governance 决策、Artifact 正文或 Identity 生命周期混入 conversation 需求。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | 已完成 | 作为来源与承接边界输入 |
| `projects/L1-conversation/README.md` | 旧仓定位材料 | 提取“对话域服务”“Conversation / Turn”“实时推送”等旧定位线索 |
| `projects/L1-conversation/00-需求文档.md` | 旧版需求文档 | 识别旧文档中把功能、指标、接口和边界混写的问题 |
| `domain/conversation/README.md` | 旧对话域详细设计 | 提取“协作载体是对话”“不做 LLM 推理 / 过程编排 / Gate 决策 / 跨平台适配”等候选边界 |
| `standards/document/需求文档书写规范.md` §4.2 | 当前书写约束 | 约束本步只输出边界声明表和短文字,不展开功能、依赖、接口或数据归属 |

---

## 3. SOP 问题回答

### 3.1 本仓一句话定义是什么？

`L1-conversation` 是平台对话真相仓,负责把人、AI member、系统事件在协作中的对话事实沉淀为可查询、可订阅、可审计的 Conversation / Turn 真相。

这句话强调“对话真相”,而不是“聊天界面”或“LLM 对话处理”。Conversation 仓可以为 Chat、Workspace、Bridges、Runtime 提供稳定事实来源,但不拥有这些下游的展示、适配或推理职责。

### 3.2 为什么它需要单独成仓？

Conversation 需要单独成仓,因为对话在 Quantalithos 中不是 UI 附属记录,而是人机协作的长期事实载体。它需要独立于项目任务、流程、治理、产物、运行时和外部聊天平台存在,否则对话历史、参与者可见性、系统通知、审计追溯和跨端消费都会被不同仓按各自目的重复塑形。

单独成仓的关键原因不是“有很多消息表”或“需要实时推送”,而是对话事实必须成为可复用的领域真相。Chat 可以展示它,Workspace 可以聚合它,Bridges 可以映射它,Runtime 可以读取上下文,但这些都不应成为对话真相的所有者。

### 3.3 本仓不是什么？

本仓不是 Chat UI,不是 Workspace 首页或项目视图,不是外部平台桥接层,不是 LLM 推理运行时,不是 Governance 决策系统,不是 Artifact 正文仓,也不是 Identity 成员生命周期仓。

这些排除项在需求阶段必须先钉住。否则后续容易把“显示什么”“怎么推理”“怎么审批”“外部平台怎么转协议”“成员是否有效”“文件正文如何保存”等问题全塞进 conversation,导致仓边界膨胀。

### 3.4 最容易与哪些相邻仓或概念混淆？

最容易混淆的边界包括:

| 类型 | 对象 | 混淆点 |
|---|---|---|
| 仓 | `L5-chat` | Chat 是产品交互入口和界面层,Conversation 是对话事实来源 |
| 仓 | `L1-workspace` | Workspace 是个人 / 项目视野聚合,Conversation 只拥有对话真相 |
| 仓 | `L6-bridges` | Bridges 负责外部平台协议适配,Conversation 不拥有外部平台生命周期 |
| 仓 | `L2-runtime` | Runtime 负责 AI member 推理和行动循环,Conversation 只提供 / 接收对话事实 |
| 仓 | `L1-governance` | Governance 拥有 Gate / Policy 决策真相,Conversation 只承载可见对话记录 |
| 仓 | `L1-artifact` | Artifact 拥有产物正文、版本和证据真相,Conversation 只承载对话中的引用或通知 |
| 仓 | `L1-identity` | Identity 拥有成员身份和生命周期真相,Conversation 只引用 actor / participant |
| 概念 | 对话真相 vs 消息展示 | Conversation 记录领域事实,不是某个客户端的展示状态 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| README 仓使命 | 写“Conversation 四形态 + Turn 五 kind 的持久化、实时推送、AG-UI 17 事件映射” | 定位中混入功能、技术和协议细节 | Step 2 只保留“对话真相仓”定位,四形态 / Turn kind / AG-UI 后移 |
| 旧 `00` 文档头部 | 把 PostgreSQL、AG-UI、四形态、五 kind 直接写入定位 | 需求边界与实现 / 协议 / 功能混写 | Step 17 正式回填时改为仓级边界声明 |
| 旧 §2 背景 | 把 Gate、Artifact、Thread、Channel 等场景直接纳入背景 | 有价值,但需要先区分相邻仓责任 | Step 3 / Step 6 / Step 7 再展开 |
| 旧 §3 非目标 | 已写 Gate 决策、Artifact 正文、Bridges 协议等非目标 | 方向正确,但缺 Workspace、Runtime、Identity 等最新边界 | 本步补齐边界对象 |
| `domain/conversation/README.md` | 明确“不做 LLM 推理 / 过程编排 / Gate 决策 / 跨平台适配” | 可迁移,但仍含大量详细字段和操作契约 | 只迁移仓级边界,不迁移结构体和操作 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 一句话定位 | 对话域服务,承载四形态、五 kind、持久化、实时推送、AG-UI 事件映射 | 平台对话真相仓,承载人、AI member 和系统事件形成的可查询、可订阅、可审计对话事实 | Step 2 不能把功能、协议或实现写进定位 |
| 单独成仓理由 | 因为需要持久化、推送、全文检索和分区 | 因为对话是跨 UI、workspace、bridges、runtime 的长期事实载体 | 单独成仓应由真相边界决定,不是技术能力堆叠 |
| 排除职责 | Gate 决策、Artifact 正文、Bridges 协议、全文检索独立集群等 | 进一步排除 Chat UI、Workspace 聚合视图、Runtime 推理、Identity 生命周期和 Artifact 正文 | 对齐最新依赖关系和个人 / 项目视野设计 |
| 边界对象 | 主要围绕 governance、artifact、bridges | 增加 `L5-chat`、`L1-workspace`、`L2-runtime`、`L1-identity`、对话真相 vs 消息展示 | 后续用户故事和功能需求最容易在这些边界串线 |
| 旧详细设计继承方式 | 容易把字段、状态机、操作契约提前带入需求 | 只继承边界结论,详细字段和操作后移到后续设计 | 需求阶段只回答外部可见范围 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 定位为“聊天消息服务” | 简单直观 | 会把 Conversation 降级为 Chat UI 附属,无法支撑审计、Workspace、Runtime 和 Bridges 复用 | 不采用 |
| 方案 B: 定位为“对话真相仓” | 能解释为什么 Conversation 独立于 UI、运行时和外部平台存在 | 后续需要继续细分能力闭环和边界规则 | 采用 |
| 方案 C: 定位为“协作实时推送服务” | 能覆盖实时流和 AG-UI 旧口径 | 会把事实归属让位给推送技术,导致 Turn / Conversation 真相不清 | 不采用 |
| 方案 D: 并入 Workspace 或 Chat | 初期产品形态更集中 | Workspace 是视图聚合,Chat 是交互入口,都不适合作为对话事实真相源 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 边界声明表

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L1-conversation` 是平台对话真相仓。 |
| 本仓不是什么 | 它不是 Chat UI,不是 Workspace 聚合视图,不是 Bridges 协议适配层,不是 Runtime 推理系统,不是 Governance 决策系统,不是 Artifact 正文仓,也不是 Identity 生命周期仓。 |
| 边界对象列表 | 仓：`L5-chat`;仓：`L1-workspace`;仓：`L6-bridges`;仓：`L2-runtime`;仓：`L1-governance`;仓：`L1-artifact`;仓：`L1-identity`;概念：对话真相 vs 消息展示 |
| 单独成仓原因 | 平台需要独立于 UI、视图、外部平台和运行时的长期对话事实真相。 |

### 7.2 边界说明短文字

`L1-conversation` 需要单独存在,因为对话是人、AI member 和系统事件共同形成的协作事实,不是某个聊天界面的临时展示状态。它最容易与 `L5-chat`、`L1-workspace`、`L6-bridges` 和 `L2-runtime` 混淆:这些仓可以展示、聚合、映射或消费对话,但不应拥有对话真相。该边界必须先分开,否则后续会把 UI、项目视野、外部协议、推理循环、治理决策和产物正文混进 conversation 需求。

### 7.3 后移事项

| 内容 | 当前处理 | 后续位置 |
|---|---|---|
| Conversation 四形态 | 不作为 Step 2 定位正文展开 | Step 7 核心能力闭环 / Step 9 功能需求 |
| Turn kind 集合 | 不作为 Step 2 定位正文展开 | Step 9 功能需求 / Step 10 规则边界 |
| AG-UI 事件映射 | 不作为 Step 2 定位正文展开 | Step 9 功能需求 / Step 12 接口与依赖 |
| 实时推送能力 | 不作为 Step 2 定位正文展开 | Step 7 核心能力闭环 / Step 13 非功能需求 |
| 性能指标 | 不作为 Step 2 定位正文展开 | Step 13 非功能需求 |
| 参与者可见性和权限规则 | 不作为 Step 2 定位正文展开 | Step 10 业务规则与边界约束 / Step 11 数据需求 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §2。

```md
## 2. 本仓定位与边界

> 校准来源：
> - `design-calibration/00_req_step_02_position_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“改动前后对比”和“后移事项”小节，了解本章边界如何从旧定位中收敛而来。

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L1-conversation` 是平台对话真相仓。 |
| 本仓不是什么 | 它不是 Chat UI,不是 Workspace 聚合视图,不是 Bridges 协议适配层,不是 Runtime 推理系统,不是 Governance 决策系统,不是 Artifact 正文仓,也不是 Identity 生命周期仓。 |
| 边界对象列表 | 仓：`L5-chat`;仓：`L1-workspace`;仓：`L6-bridges`;仓：`L2-runtime`;仓：`L1-governance`;仓：`L1-artifact`;仓：`L1-identity`;概念：对话真相 vs 消息展示 |
| 单独成仓原因 | 平台需要独立于 UI、视图、外部平台和运行时的长期对话事实真相。 |

`L1-conversation` 需要单独存在,因为对话是人、AI member 和系统事件共同形成的协作事实,不是某个聊天界面的临时展示状态。它最容易与 `L5-chat`、`L1-workspace`、`L6-bridges` 和 `L2-runtime` 混淆:这些仓可以展示、聚合、映射或消费对话,但不应拥有对话真相。该边界必须先分开,否则后续会把 UI、项目视野、外部协议、推理循环、治理决策和产物正文混进 conversation 需求。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否继续把仓定位写成“Conversation 四形态 + Turn 五 kind + AG-UI 17” | 保留旧写法作为定位 | 改为“平台对话真相仓”,旧内容后移到能力和接口步骤 | 推荐 B。原因是旧写法混入功能、协议和实现细节,不符合 Step 2 边界章节 |
| Q-002 | Conversation 是否承担 Workspace 的个人 / 项目视野 | 是,Conversation 直接提供视图 | 否,Conversation 提供对话真相,Workspace 聚合个人 / 项目视野 | 推荐 B。原因是 Workspace 是跨域视图,不应把 view ownership 混入 conversation |
| Q-003 | Conversation 是否承担 AI member 的对话推理 | 是,Conversation 同时运行推理 | 否,Conversation 记录和提供上下文,Runtime 执行推理循环 | 推荐 B。原因是推理 loop 属于 `L2-runtime`,否则对话真相会与执行过程耦合 |
| Q-004 | Conversation 是否拥有 Governance / Artifact 的业务真相 | 是,以 Turn 形式拥有其状态 | 否,只拥有对话中可见记录,业务真相仍属于对应仓 | 推荐 B。原因是 Turn 不能替代 Gate、Policy、Artifact、Evidence 的原始真相 |

当前建议：按推荐方案继续进入 Step 3。

---

## 10. 进入下一步条件

- 已能用“平台对话真相仓”概括 `L1-conversation` 的定位。
- 已明确本仓不是 Chat UI、Workspace 视图、Bridges 适配、Runtime 推理、Governance 决策、Artifact 正文或 Identity 生命周期仓。
- 已明确旧版四形态、Turn kind、AG-UI、性能指标等内容不在 Step 2 展开,后续按对应步骤裁剪。
- 已形成可回填正式需求文档 §2 的边界声明表和短文字。
