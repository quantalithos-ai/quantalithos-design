# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力 / §3 约束条件
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

把需求层已经收稳的边界、能力和数据前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、硬约束和未关闭需求风险 |
| `00-需求文档.md` §2 / §7 / §10 / §11 / §14 / §15 | 已完成 | 提供仓定位、核心闭环、业务规则、数据归属、验收底线和风险 |
| `projects/L0-core/00~07` | 已完成深度校准 | 提供共享契约、actor、metadata、error、trace、evidence 边界 |
| `projects/L0-bus/00~07` | 已完成深度校准 | 提供事件协作、outbox、投递和重放语义 |
| `projects/L0-sdk/00~07` | 已完成深度校准 | 提供默认 client 接入和下游消费封装边界 |
| `projects/L1-identity/00~07` | 已完成深度校准 | 提供成员、AI member、system actor 和生命周期引用来源 |
| 旧 `01-架构设计.md` §1~§3 | 未按最新 SOP 校准 | 作为旧目标、约束和量化指标问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 这个仓在架构层面要确保什么成立？

`L1-conversation` 在架构层面必须确保以下结构成立:

- Conversation 有独立的真相边界,不能退化为 Chat UI 消息缓存、Workspace 聚合视图、Runtime 临时上下文或 Bridges 外部平台副本。
- 对话空间、参与范围、可见范围、对话事实历史、跨域显化记录和追溯上下文必须被组织为本仓内部一致的核心结构。
- 外部正式事实进入对话只能通过引用 / 快照 / 显化记录表达,不能把 Work、Governance、Artifact、Identity 等来源仓正文复制为 Conversation 真相。
- 查询、订阅、变化感知和下游消费必须经过授权视野边界。
- 索引、投影、检索和变化感知只能从 Conversation 真相派生,不能反向定义业务事实。

### 3.2 哪些约束是不可变的？

不可变约束来自需求一票否决项和数据归属红线:

- 不允许相邻仓正文进入 Conversation 真相。
- 不允许 Chat / Workspace / Bridges / Runtime / Governance / Artifact / Identity 反向定义 Conversation 真相。
- 不允许 Conversation 执行 LLM 推理、治理裁决、产物正文管理、成员生命周期或外部平台协议生命周期。
- 不允许绕过授权视野读取、订阅或推送对话事实。
- 不允许维护性能力、索引、投影、检索或及时感知改变业务事实。
- 不允许关键变化缺少可追溯入口。

### 3.3 哪些约束是当前阶段可以接受的取舍？

当前可接受的取舍主要围绕外围增强能力和未定量指标:

- 长历史检索与定位当前作为外围增强处理,架构只保留可派生边界,不把检索后端作为核心真相路径。
- 对话变化及时感知当前只要求不改变真相和受授权视野约束,具体实时协议形态后续接口 / 详细设计再定。
- 索引 / 投影维护当前只作为辅助消费能力,不提前把 projection 设计为独立 truth。
- 核心追加、授权消费和追溯的吞吐 / 延迟数值当前不写死,架构只保留可扩展、可观测和可测试的结构约束。
- Archive 交接当前只保留协作边界,不在架构主线中展开长期归档策略。

### 3.4 哪些目标可以明确判断,甚至量化？

当前可以明确判断的目标:

- 是否有独立 Conversation 真相边界。
- 是否区分 truth / snapshot / reference / derived read model。
- 是否所有消费路径都受可见范围约束。
- 是否跨域事实只以引用方式显化。
- 是否索引 / 投影 / 检索 / 变化感知不反写真相。
- 是否关键变化有 trace / audit / outbox / evidence 等追溯接缝。

当前不强行量化:

- Post / append latency。
- Stream / subscribe latency。
- 月度 Turn 容量。
- 并发连接数。
- 检索吞吐。

这些旧指标可能仍有价值,但缺少新版需求基线中的正式负载模型,应后移到技术选型、测试方案或实施阶段验证。

### 3.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题？

- Chat UI 页面、组件和客户端状态。
- Workspace 个人首页、项目首页、inbox 和跨域聚合视图。
- Bridges 对 Mattermost / Slack / Telegram 等外部平台协议的生命周期适配。
- Runtime 的 agent loop、LLM 推理、tool 调用和 memory 写入。
- Governance 的 Gate / Policy / Approval 裁决。
- Artifact 正文、版本、证据链和产物生命周期。
- Identity 的成员创建、退休、角色定义和认证授权。
- Observability / Archive 的全局 trace store、长期归档和恢复策略。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `业务驱动力` 把 Governance 通知、Chat / Console / Bridges 数据源和 Turn append-only 混在一起 | 驱动力没有区分“为何独立成仓”和“后续功能 / 技术机制” | Step 2 改为从“对话真相边界必须独立”推导架构目标 |
| `成功标准` 直接写 PostTurn P95、StreamEvents P95、1.5 亿 Turn/月 | 当前需求文档没有正式量化负载模型,直接继承会变成伪约束 | 后移到技术选型、测试方案或实施验证,本步不作为架构硬约束 |
| `不可变约束` 直接写四形态、AG-UI、月分区 | 把详细设计对象、协议和存储方案写成架构红线 | Step 2 的不可变约束只写仓级职责、数据归属、授权和追溯红线 |
| `架构风格与选型` 过早进入 append-only、push layer、CQRS/ES 对比 | Step 2 不应提前进入技术选型和备选方案 | 后移到 Step 10 关键技术选型和 Step 11 备选方案与取舍 |

---

## 5. 改动前后对比

| 维度 | 旧口径 | 新口径 |
|---|---|---|
| 架构目标 | 支持 Conversation 四形态、Turn kind、实时推送和事件转 Turn | 确保 Conversation 真相边界、核心闭环、数据归属、授权消费和派生结果边界成立 |
| 约束条件 | 把 AG-UI、月分区、PostTurn / StreamEvents 指标直接写成约束 | 只把仓级职责、数据、授权、追溯和下游不得反写真相写成不可变约束 |
| 当前取舍 | 没有明确取舍,容易把 P1 / P2 功能写成目标或 TODO | 外围增强能力以“可派生、不反写真相”的方式暂存 |
| 非目标 | 分散写在职责边界中 | 集中明确本架构不设计 UI、Workspace、Bridges、Runtime、Governance、Artifact、Identity、Observability / Archive 主体架构 |

---

## 6. 结构化中间产物

### 6.1 业务背景与结构性驱动力

Quantalithos 的协作默认发生在对话中,但对话不能由 Chat、Workspace、Runtime 或 Bridges 各自复制一份消息语义来承担。随着平台已经拥有稳定的 `L0-core`、`L0-bus`、`L0-sdk` 和 `L1-identity` 边界,`L1-conversation` 需要在架构层把对话事实收束为独立真相边界,让人类用户、AI member、系统事件和下游应用围绕同一份 Conversation 真相协作。

### 6.2 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的 Conversation 真相边界 | 否则对话会退化为 UI 消息、Runtime 上下文或外部平台副本。 |
| 支撑核心对话能力闭环完整成立 | 否则空间建立、事实沉淀、授权消费、跨域显化和历史追溯会断裂。 |
| 稳定区分真相数据、快照数据、引用数据和派生读模型 | 否则相邻仓正文和辅助结果会混入 Conversation 真相。 |
| 让所有消费路径受授权视野约束 | 否则 Chat、Workspace、Runtime、Bridges 或审计读取会绕过对话可见范围。 |
| 通过事件 / 引用边界显化跨域事实 | 否则 Conversation 会接管 Work、Governance、Artifact 或 Identity 的来源真相。 |
| 让索引、投影、检索和变化感知只能从真相派生 | 否则外围增强能力会反向改写业务事实。 |
| 保留关键变化的追溯接缝 | 否则对话空间、参与 / 可见范围和跨域显化无法支撑复盘与审计。 |

### 6.3 不可变约束表

| 约束 | 说明 |
|---|---|
| 不允许 Chat UI 展示状态成为 Conversation 真相 | 否则本仓会被 UI 消息状态反向定义。 |
| 不允许 Workspace 聚合视图成为 Conversation 真相 | 否则个人 / 项目视野会覆盖对话域自身边界。 |
| 不允许 Bridges 外部平台对象成为 Conversation 真相 | 否则外部平台生命周期会侵入本仓。 |
| 不允许 Runtime 推理过程、tool 调用或 memory 写入成为 Conversation 真相 | 否则对话事实会与 agent loop 内部状态混淆。 |
| 不允许 Governance / Artifact / Identity / Work 正文进入 Conversation 真相 | 否则来源仓真相会漂移进 Conversation。 |
| 不允许 Conversation 裁决 Gate、Policy、Approval 或成员生命周期 | 否则本仓会侵入治理和身份边界。 |
| 不允许绕过授权视野消费对话事实 | 否则本仓核心安全边界被打穿。 |
| 不允许索引、投影、检索、变化感知反写真相 | 否则派生结构会成为第二业务事实来源。 |
| 不允许关键变化不可追溯 | 否则对话历史无法支撑审计、复盘和责任边界。 |

### 6.4 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 长历史检索与定位 | 当前作为外围增强处理,架构只要求从 Conversation 真相派生且受授权视野约束。 |
| 对话变化及时感知 | 当前仅保留“可感知、可授权、不可反写真相”的能力边界,不提前锁定 SSE / WS / AG-UI 等协议形态。 |
| 索引 / 投影维护 | 当前作为辅助消费结构处理,不把 projection 设计为独立 truth。 |
| 量化性能 / 容量指标 | 当前不继承旧 P95 / 月度 Turn 数字作为硬约束,只保留可扩展、可观测和可测试要求。 |
| Archive 长期交接 | 当前只确认 Archive 是下游协作方,不在本架构主线展开长期归档和恢复策略。 |
| 外部平台桥接差异 | 当前只保留 Bridges 协作边界,Conversation 不为特定外部平台定制核心结构。 |

### 6.5 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Chat UI 架构 | Chat 页面、组件和客户端状态属于 `L5-chat`,不是对话真相仓架构主线。 |
| 不设计 Workspace 聚合视图架构 | 个人视野、项目视野和 inbox 属于 `L1-workspace`,不是 Conversation 真相边界。 |
| 不设计 Bridges 外部平台协议架构 | Mattermost / Slack / Telegram 等协议生命周期属于 `L6-bridges`。 |
| 不设计 Runtime 推理架构 | agent loop、LLM 调用、tool 调用和 memory 写入属于 `L2-runtime` / `L2-tools`。 |
| 不设计 Governance 裁决架构 | Gate、Policy、Approval 结论属于 `L1-governance`。 |
| 不设计 Artifact 正文和版本架构 | 产物正文、版本、证据链和生命周期属于 `L1-artifact`。 |
| 不设计 Identity 生命周期和认证授权架构 | 成员生命周期、认证和授权裁决属于 `L1-identity` 或安全 / 治理边界。 |
| 不设计全局 Observability / Archive 架构 | 全局 trace store、metrics、长期归档和恢复属于 `L4-observability` / `L4-archive`。 |

---

## 7. 回填草稿

正式 `01-架构设计.md` 后续整理时,本步内容应回填到:

- §2 业务背景与驱动力:回填“业务背景与结构性驱动力”和“架构目标表”。
- §3 约束条件:回填“不可变约束表”“当前阶段可接受取舍表”“架构非目标表”。

---

## 8. 待确认事项

本步不新增阻塞性待确认事项。已知待确认项沿用 Step 1 的风险清单,后续分别在数据所有权、技术选型、演进路线和风险章节承接。

---

## 9. 进入下一步条件

- 已明确架构必须确保成立的结构性目标。
- 已明确不可变约束、当前阶段取舍和架构非目标。
- 未提前进入系统上下文图、容器、部署、数据库或技术选型。
- 可以进入 Step 3“职责边界”。
