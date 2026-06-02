# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-conversation` 在全局职责分工中的承担范围，收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、数据归属和依赖方向前提 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供架构目标、不可变约束、取舍和非目标 |
| `00-需求文档.md` §2 / §6 / §10 / §11 / §14 | 已完成 | 提供本仓边界、依赖、规则、数据归属和验收底线 |
| 旧 `01-架构设计.md` §4 / §5 | 未按最新 SOP 校准 | 作为旧“做什么 / 不做什么 / 子域”问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 这个仓具体做什么？

`L1-conversation` 正式承担以下职责:

- 承载 Conversation 真相边界。
- 维护对话空间、参与范围和可见范围在对话域内的正式语义。
- 追加沉淀人类、AI member 和系统可见事实形成的对话历史。
- 在授权视野内提供对话事实读取、订阅、变化感知和追溯基础。
- 将来源仓已形成的正式事实以引用 / 快照 / 显化记录方式呈现在对话中。
- 维护从 Conversation 真相派生的索引、投影、检索和变化感知辅助结构。
- 保留对话事实、范围变化和跨域显化的追溯接缝。

### 3.2 这个仓具体不做什么？

`L1-conversation` 明确不承担以下职责:

- 不做 Chat UI 页面、组件、客户端交互状态和展示排序策略。
- 不做 Workspace 个人首页、项目首页、inbox 或跨域视图聚合。
- 不做 Bridges 外部平台协议适配、平台账号映射或外部消息生命周期。
- 不做 Runtime agent loop、LLM 推理、tool 调用、memory 写入或运行时上下文裁决。
- 不做 Governance 的 Gate / Policy / Approval 裁决。
- 不做 Artifact 正文、版本、证据链和产物生命周期真相。
- 不做 Identity 的成员创建、退休、角色定义、认证或授权裁决。
- 不做 Observability / Archive 的全局 trace store、metrics、长期归档和恢复策略。

### 3.3 哪些能力看起来相关但必须属于其他仓？

最容易混淆的职责包括:

- “消息怎么显示”属于 `L5-chat`,Conversation 只拥有对话事实。
- “当前个人 / 项目应该看哪些对话入口”属于 `L1-workspace`,Conversation 只提供可被聚合的对话事实。
- “外部平台如何收发消息”属于 `L6-bridges`,Conversation 只承接已经通过正式边界进入平台的对话事实。
- “AI member 如何思考、调用工具和生成回复”属于 `L2-runtime` / `L2-tools`,Conversation 只记录结果性对话事实和可读上下文。
- “Gate 是否通过”属于 `L1-governance`,Conversation 只显化治理结论引用。
- “产物正文是什么、版本如何变更”属于 `L1-artifact`,Conversation 只显化产物引用或摘要。
- “成员是否有效、角色是什么”属于 `L1-identity` 和 method-library,Conversation 只使用成员 / actor 引用和展示快照。

### 3.4 哪些行为绝不能隐式发生？

- 读取对话事实不能隐式改变参与范围、可见范围或对话事实。
- 下游订阅 / 推送不能绕过授权视野。
- 索引、投影、检索或变化感知不能生成新的业务对话事实。
- 跨域显化不能隐式接管来源仓正文或生命周期。
- 外部平台同步不能隐式改变内部 Conversation 真相。
- Runtime 读取上下文不能隐式改写对话历史。
- 维护任务不能隐式修正或覆盖业务事实。

### 3.5 哪些边界如果不写清，后续设计最容易串线？

最容易串线的边界:

- Conversation truth vs Chat display state。
- Conversation truth vs Workspace aggregate view。
- Conversation truth vs Runtime temporary context / memory。
- Conversation cross-domain visible record vs Governance / Artifact / Work / Identity source truth。
- Conversation derived read model vs Conversation truth。
- Internal Conversation truth vs external platform message copy。
- Participant / visibility truth vs authorization decision。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| §4.2 “做什么 / 不做什么”同时写 participants、Gate / Artifact / Work 事件转 Turn、StreamEvents、全文检索 / archive | 把功能项、事件映射、技术机制和职责归属混写 | 改为按职责归属表收敛,不写接口、事件名或技术机制 |
| §5 子域直接列 Conversation Store、StreamEvents、Search、Bridge-facing projection | 子域划分提前进入 Step 5 内容 | Step 3 只判断这些能力是否属于本仓职责,不做子域拆分 |
| “Gate / Artifact / Work 事件转 Turn”容易表达为本仓接管事件来源真相 | 打穿来源仓真相边界 | 改为“跨域正式事实引用显化”,强调来源真相仍归来源仓 |
| “全文检索 / archive 边界”容易被写成本仓核心职责 | 可能让外围增强和 Archive 主体架构进入本仓 | 改为派生辅助职责和 Archive 协作边界,不拥有长期归档主体架构 |

---

## 5. 改动前后对比

| 维度 | 旧口径 | 新口径 |
|---|---|---|
| 做什么 | Conversation / Turn 持久化、participants、事件转 Turn、StreamEvents、全文检索 / archive | Conversation 真相、范围语义、事实历史、授权消费、跨域显化、派生辅助和追溯接缝 |
| 不做什么 | Gate 决策、Artifact 正文、外部协议、UI | 扩展为 Chat、Workspace、Bridges、Runtime、Governance、Artifact、Identity、Observability / Archive 主体职责均不承载 |
| 易混淆职责 | 未集中表达 | 单独列出 display state、workspace view、runtime context、external message、source truth、derived read model 等混淆点 |
| 边界红线 | 分散在不同章节 | 集中列出不得隐式发生和不得接管的红线 |

---

## 6. 结构化中间产物

### 6.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| Conversation 真相边界承载 | 做 | 这是本仓区别于 Chat、Workspace、Runtime 和 Bridges 的核心职责。 |
| 对话空间、参与范围和可见范围维护 | 做 | 若不由本仓承载,对话事实将失去稳定归属和可见边界。 |
| 对话事实历史追加沉淀 | 做 | 这是协作过程可追溯的基础职责。 |
| 授权视野内的对话事实消费基础 | 做 | 本仓必须保证查询、订阅和下游消费不绕过可见范围。 |
| 跨域正式事实的对话内引用显化 | 做 | 本仓只负责让来源事实在对话中可见,不拥有来源正文。 |
| 派生辅助结构维护 | 做 | 索引、投影、检索和变化感知可以服务消费,但只能从 Conversation 真相派生。 |
| 对话关键变化追溯接缝 | 做 | 对话范围、事实追加和跨域显化必须支撑审计与复盘。 |
| Chat UI 展示和客户端交互状态 | 不做 | 该职责属于 `L5-chat`,否则 UI 状态会反向定义 Conversation 真相。 |
| Workspace 个人 / 项目聚合视图 | 不做 | 该职责属于 `L1-workspace`,否则聚合视图会覆盖对话域边界。 |
| 外部平台协议适配和外部消息生命周期 | 不做 | 该职责属于 `L6-bridges`,否则外部平台生命周期会侵入本仓。 |
| Runtime 推理、tool 调用和 memory 写入 | 不做 | 该职责属于 `L2-runtime` / `L2-tools`,否则结果事实与运行过程会混淆。 |
| Governance 裁决 | 不做 | Gate、Policy、Approval 结论属于 `L1-governance`。 |
| Artifact 正文、版本和证据链真相 | 不做 | 产物正文和生命周期属于 `L1-artifact`。 |
| Identity 生命周期、认证和授权裁决 | 不做 | 成员真相属于 `L1-identity`,认证授权属于安全 / 治理边界。 |
| 全局观测、长期归档和恢复主体架构 | 不做 | 该职责属于 `L4-observability` / `L4-archive`。 |
| 消息展示状态与对话事实边界 | 易混淆职责 | 若不区分,后续会把客户端排序、折叠或已读状态写成对话 truth。 |
| Workspace 入口聚合与对话空间边界 | 易混淆职责 | Workspace 可以聚合入口,但不能拥有 Conversation 空间真相。 |
| Runtime 上下文读取与对话历史边界 | 易混淆职责 | Runtime 可以读取授权上下文,但不能把内部 memory 当作对话历史。 |
| 跨域显化记录与来源仓事实边界 | 易混淆职责 | 显化记录属于 Conversation,来源正文和生命周期仍属于来源仓。 |
| 派生读模型与业务事实边界 | 易混淆职责 | projection / index / search result 只能辅助消费,不能成为第二 truth。 |
| 外部平台消息副本与内部 Conversation 边界 | 易混淆职责 | 外部消息可以映射,但内部 Conversation 不依赖外部平台对象成立。 |

### 6.2 做 / 不做清单

| 分类 | 内容 |
|---|---|
| 做 | Conversation 真相边界;对话空间 / 参与范围 / 可见范围;对话事实历史;授权消费基础;跨域事实引用显化;派生辅助结构;追溯接缝 |
| 不做 | Chat UI;Workspace 聚合;Bridges 协议;Runtime 推理;Governance 裁决;Artifact 正文;Identity 生命周期 / 认证授权;Observability / Archive 主体架构 |

### 6.3 边界红线清单

- 不得将 Chat UI 展示状态、客户端排序、折叠、已读或草稿状态写成 Conversation 真相。
- 不得将 Workspace personal / project view 写成 Conversation 真相。
- 不得将 Runtime memory、推理过程或 tool 调用轨迹写成 Conversation 业务事实。
- 不得将 Governance、Artifact、Work、Identity 的来源正文复制为 Conversation truth。
- 不得让外部平台 message id、channel lifecycle 或平台账号生命周期成为 Conversation 内部真相。
- 不得让 projection、index、search result、notification state 或 stream cursor 反写真相。
- 不得绕过参与范围和可见范围向下游输出对话事实。
- 不得通过维护任务隐式修复、覆盖或删除业务对话事实。

---

## 7. 回填草稿

正式 `01-架构设计.md` 后续整理时,本步内容应回填到:

- §4 职责边界:回填“职责边界表”“做 / 不做清单”和“边界红线清单”。

---

## 8. 待确认事项

本步不新增阻塞性待确认事项。后续 Step 4 需要把这些职责边界转换为正式系统上下文关系,但不应改变本步职责归属。

---

## 9. 进入下一步条件

- 已明确本仓做什么、不做什么和易混淆职责。
- 已列出边界红线。
- 未重画系统上下文图。
- 未提前展开子域、数据所有权、接口协议或容器部署。
- 可以进入 Step 4“系统边界与上下文”。
