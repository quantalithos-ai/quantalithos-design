# 01 架构 Step 8：数据所有权与一致性策略

> 对应正式章节：`01-架构设计.md` §9 数据所有权与一致性策略  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 7 已通过门禁。本步先判断谁拥有正式数据，再判断数据关系的一致性口径；只讨论架构归属、生命周期上限、失效和挂起原则，不写表结构、字段、数据库、缓存产品、TTL、事务脚本、事件 schema 或同步实现。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 3、5、7、正式 `00` §10~§11、架构 SOP Step 8 与书写规范 §4.9 | done | §2 |
| 回答真相、快照/投影、引用、禁止正文和一致性问题 | done | §3 |
| 诊断旧数据矩阵、服务端 PanelState、缓存/投影和 optimistic 语义污染 | done | §4 |
| 比较“全量本地复制 / 只保存内存 / 客户端事实 + owner-safe 影子”方案 | done | §5 |
| 输出数据归属结论、简化关系图、关系级一致性和失败口径 | done | §6.1~§6.4 |
| 按九个 Step 5 架构单元逐项停审 | done | §6.5 |
| 完成跨数据边界审计、回填草稿、pending 与三层门禁 | done | §7~§10 |

本步使用的四类数据类型严格沿用规范：`正式真相数据`、`快照 / 投影数据`、`引用关系数据`、`明确不拥有的正文 / 真相`。其中“快照 / 投影”只表示 owner-safe 的消费影子，不表示 Console 建立业务投影、事件游标或重建职责。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 提供 Console-owned 交互事实与外部 truth 的职责红线。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 提供九个架构单元及三类本地影子，作为逐单元数据停审清单。 |
| `01_arch_step_07_dependency_direction.md` | 提供正式接缝、状态承载、forbidden body、unknown 与禁止直连边界。 |
| `00-需求文档.md` §10~§11 | 提供业务规则、四类数据归属、生命周期和 forbidden-body 总边界。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 8 | 规定先归属后一致性、按架构单元停审和跨数据审计。 |
| `standards/document/架构设计书写规范.md` §4.9 | 规定数据归属表、一致性策略表、简化关系图及禁止下沉粒度。 |
| 旧 `01-架构设计.md` §8、README、`draft/03_模块划分与分层.md` | 仅用于审计“服务端 PanelState、通用缓存、投影、optimistic state、报告正文”等历史污染，不继承其真相判断。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据由本仓拥有正式真相？ | 只有 Console 自身的客户端交互事实：会话壳与当前选择、导航/布局、筛选排序分页和下钻意图、未提交草稿与确认经历、请求交互经历、错误/降级/恢复/a11y 状态以及用户明确保存的呈现偏好。它们是产品交互真相，不是身份、授权、业务、治理、审计、能力、归档或运行真相。 |
| 哪些只是快照或投影？ | 正式 actor/scope 的显示摘要、visibility/资格姿态、owner-safe 查询结果、多轴来源状态、各管理主题安全摘要、条件化比较/批量结果和最小交互诊断上下文。它们随 owner/语境/可见性失效，不形成第二业务投影。 |
| 哪些只是引用关系？ | 正式语境/资格、业务对象与版本、lineage、Policy/Gate 决定、receipt/result/reconciliation、audit/evidence、report/export、capability、archive、sandbox 等安全引用。引用表达关系和回链，不拥有所指正文。 |
| 哪些正文或真相明确不拥有？ | credential/secret、身份与授权证明、Policy/Gate 内部依据、raw/hidden/redacted 载荷、各 owner 的业务与治理正文、artifact/evidence/audit/metric/report 正文、capability 注册正文、archive 包体、sandbox 执行正文、领域校验/幂等依据/业务副作用和 readiness。上述内容不得进入 Console 生命周期、诊断、错误、日志或导出旁路。 |
| 哪些关系必须具有强约束或即时一致？ | 受保护读取/动作与当前正式 actor/scope/visibility/资格之间必须在披露或提交边界重新验证；撤销、过期、冲突和 unknown 立即收紧。单一客户端内的草稿、确认和请求呈现必须保持本地交互状态连贯，但不等于 owner 业务事务强一致。 |
| 哪些关系可以最终一致？ | owner truth 到 owner-safe 视图影子、owner 状态变化到可选失效提示、非安全关键的偏好跨会话承接、跨 owner 的只读组合视图以及条件化诊断都可最终收敛；必须携带来源/时效/覆盖/可用性/一致性姿态，不能把旧影子当当前真相。 |
| 命令与正式结果采用什么一致性？ | 草稿和“已尝试/等待/需回查”是 Console 交互真相；accepted/transport/receipt 不等于 owner 完成。只有 owner 正式确认或拒绝的 result/ref 才能结束业务结果语义；unknown 无正式回查或幂等依据时保持 unknown/blocked，不自动重放。 |
| 失败时靠什么约束、补偿或挂起？ | 安全语境不可验证时 fail-closed；owner 影子过期或局部不可用时标记 stale/partial/unavailable 并重查或撤除；引用失效时保留失效姿态，不补正文；命令 unknown 时只走正式回查或挂起；跨 owner 不做伪原子补偿；诊断失败不改变业务语义。 |
| 哪些数据边界若不写清最容易串仓？ | session 与认证、可见姿态与授权、view model 与业务 truth、草稿/receipt 与正式对象、owner-safe 快照与正文、跨 owner 联合视图与 readiness、客户端诊断与正式 audit/evidence、偏好与权限这八组边界。 |
| 每个架构单元是否都有 truth/snapshot/reference/forbidden 边界？ | 是。§6.5 对六个语义单元和三个本地影子逐项记录；每项均有归属、可持有影子、禁止正文、生命周期和一致性/失败口径。 |
| 是否存在双真相或一致性口径冲突？ | §6.6 审计未发现 unresolved 冲突。Console-owned 交互事实、owner-safe 影子和正式引用分离；安全语境即时收紧、owner 视图最终收敛、命令结果以 owner 确认为准，三者不互相替代。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料 | 问题 | 本步处置 |
|---|---|---|
| 旧数据矩阵把 Member/Governance/Audit/Capability 等 truth 放在 Console 消费缓存中 | “被页面使用”被误写成“由 Console 拥有”，形成第二真相。 | 将这些数据归为外部 owner truth，Console 最多保留安全快照或引用。 |
| 旧 `ConsoleWorkspace` / 服务端 `PanelState` / 通用 store | 把跨域面板、游标、布局和页面聚合暗示为服务端业务对象或可重建投影。 | 仅保留客户端交互事实；Workspace projection/cursor/rebuild 继续归 Workspace 或相应 owner。 |
| 旧文档的“后端领域对象全部最终一致，Console 做投影” | 未区分安全资格、命令结果和只读视图；会让过期影子放行或把 projection 当 truth。 | 将安全语境与受保护动作设为即时约束；只读影子才允许最终一致，且不反写。 |
| optimistic update、刷新成功、统一缓存失效 | 把客户端视觉状态或 transport 结果解释为业务完成。 | 正式结果只接受 owner confirmed/rejected；unknown 不自动重放，旧影子不得掩盖变化。 |
| 旧导出、report、audit/evidence helper | 可能把外部正文、证明或报告生成结果复制到本仓。 | 只保存正式安全引用；正文和正式生命周期归 Artifact/Observability/Archive 等 owner。 |
| 旧日志/错误记录请求与响应正文 | 可能通过诊断旁路泄露 forbidden body 并形成隐性数据仓。 | 诊断和错误只允许最小安全交互上下文；无法证明安全则不保存、不上送。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步口径 | 原因 |
|---|---|---|---|
| Console 自有数据 | 页面数据、共享 store 或服务端 PanelState 可被视为本仓状态 | 仅客户端交互事实是正式真相 | 保留产品连续性，同时不复制外部业务 truth。 |
| 外部查询结果 | 缓存/投影即当前页面事实 | owner-safe 快照，必须带来源和多轴状态并可失效 | 防止 stale/partial/missing 被压平为完整或当前。 |
| 外部对象关系 | 复制对象或正文摘要 | 只保留安全引用和回链 | 引用不等于正文归属，降低泄露和漂移。 |
| 资格与安全语境 | 可由 session、菜单或缓存延续 | 在披露/提交边界重新约束，失效即收紧 | 资格是安全前置，不能采用无界最终一致。 |
| 命令结果 | receipt、刷新或 optimistic state 可显示成功 | owner result/ref 才结束正式结果语义 | 保护副作用、幂等和 reconciliation 边界。 |
| 跨 owner 视图 | 聚合为统一健康/治理/ready 结论 | 分 owner、可部分呈现，不承诺原子一致 | 不生成跨域第二真相和伪 readiness。 |

### 5.2 设计取舍

| 方案 | 优点 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 全量复制 owner 数据到 Console，统一本地查询 | 页面组合简单，离线体验强 | 复制正文、规则和生命周期，形成第二真相及泄露面 | 不采用 |
| B. 所有客户端状态只存内存且不保留任何影子 | 数据边界最窄 | 无法承接明确草稿、布局和局部恢复连续性；仍需解释当前查询结果 | 不作为架构硬约束；介质与生命周期 pending |
| C. Console-owned 交互事实 + owner-safe 快照/引用 + 明确禁止正文 | 兼顾产品连续性、来源保真和 owner 单一真相 | 需要处理失效、过期、部分和 unknown 姿态 | 采用 |
| D. 建立跨域事件 projection 并用其驱动页面 | 更新及时，组合查询方便 | 引入 cursor/replay/rebuild、投影所有权和一致性责任 | 不采用 |
| E. 所有数据关系都要求强一致 | 语义直观 | 把只读视图和跨 owner 组合压成伪事务，扩大耦合并掩盖 owner 差异 | 不采用；按关系分类 |

## 6. 结构化中间产物

### 6.1 数据所有权结论与归属表

| 数据项 / 数据类别 | 数据类型 | 正式归属说明 | Console 生命周期 / 边界说明 |
|---|---|---|---|
| 客户端会话壳、当前交互选择和导航上下文 | 正式真相数据 | Console 拥有交互连续性与选择的真相；身份、认证和 scope truth 归正式 owner。 | 随客户端会话建立、切换、失效和结束；不得用它延续不可验证的受保护访问。 |
| 导航展开、当前入口、筛选/排序/分页、下钻和视图布局意图 | 正式真相数据 | Console 拥有用户的呈现与探索意图，不改变外部对象或业务状态。 | 随用户交互和页面生命周期变化；语境失效时收紧、清除或要求重新选择。 |
| 未提交表单草稿、提交前复核和危险确认经历 | 正式真相数据 | Console 拥有尚未提交的用户意图和确认经历，不是正式对象、批准或命令受理。 | 随创建、编辑、放弃、提交或明确清除变化；不得转写为 owner 业务状态。 |
| 客户端请求经历、等待、需回查、错误和恢复选择 | 正式真相数据 | Console 只拥有本客户端对一次意图的交互经历，不拥有副作用或最终结果。 | 随提交、反馈、恢复和终止变化；owner 正式结果或安全终止结束当前呈现。 |
| 焦点、播报、非颜色状态和可访问恢复选择 | 正式真相数据 | Console 拥有当前体验的可访问交互事实，不拥有业务状态。 | 随呈现和恢复变化；不能覆盖 owner 状态或放宽资格。 |
| 用户明确保存的布局、入口和视图偏好 | 正式真相数据 | Console 拥有产品呈现偏好，不拥有权限、优先级或业务 truth。 | 随用户建立、修改、清除或产品停止支持而变化；跨设备/跨会话范围 pending。 |
| 正式 actor/session/scope 的显示摘要 | 快照 / 投影数据 | 正式语境 truth 归 identity 或安全 owner；Console 只保留获准显示的最小摘要。 | 随语境变化、撤销或过期更新/撤除；不形成认证或授权缓存。 |
| visibility、资格和动作姿态的安全摘要 | 快照 / 投影数据 | 正式决定归治理/授权 owner；Console 只呈现当前允许的安全姿态。 | 在每次受保护披露/提交前重新约束；unknown/冲突/过期立即收紧。 |
| owner-safe 查询结果、来源和多轴状态 | 快照 / 投影数据 | 业务/治理/运行 truth 归各 owner；Console 只保留安全视图影子。 | 随 owner、语境、可见性或来源状态更新/失效；必须保留 source/freshness/coverage/availability/consistency。 |
| 员工、项目、工作、过程、Workspace、方法、治理、制品、观测、能力、归档和 sandbox 安全摘要 | 快照 / 投影数据 | 各正式 owner 分别拥有 truth；Console 按 owner 分区消费，不建立跨域生命周期。 | 各 owner 独立变化或失效；不可由一个成功结果掩盖另一个 owner 的 stale/partial/unavailable。 |
| 可比较来源与逐项批量结果安全摘要 | 快照 / 投影数据 | 可比较/逐项结果语义仍由 owner 声明；外围功能仅保留获准安全摘要。 | 合同缺失时不建立；coverage 不足或来源不可比时保持不可比较/unknown。 |
| 最小安全客户端诊断上下文 | 快照 / 投影数据 | 诊断只描述交互和请求经历，不形成 Observability audit、Artifact evidence 或 owner 历史。 | 随问题和诊断边界产生/退出；无法证明安全时不保存或不上送。 |
| actor/scope/语境、对象/版本/lineage、Policy/Gate 决定安全引用 | 引用关系数据 | 引用指向正式 owner 的语境、对象和决定；正文与生命周期不归 Console。 | 随关系、可见性、版本或 owner 撤销而失效；失效时显示失效/unknown，不补正文。 |
| receipt、result、reconciliation、audit、evidence、report、export、capability、archive、sandbox 安全引用 | 引用关系数据 | Console 只保存正式提供且允许显示的结果/追溯/材料引用。 | 引用仅用于回链和解释；不得作为本地幂等、提交或完成的替代依据。 |
| credential、secret、身份/授权证明和 Policy/Gate 内部依据 | 明确不拥有的正文 / 真相 | 认证、授权和内部规则正文归正式 owner，Console 不拥有、不复用。 | 不进入任何 Console 生命周期、缓存、错误、诊断或导出。 |
| raw/hidden/redacted 服务载荷和跨域完整对象 | 明确不拥有的正文 / 真相 | 非 owner-safe 内容不属于 Console；禁止为聚合、缓存或排障复制。 | 无法证明安全则拒绝呈现或裁剪到引用/最小摘要。 |
| member/project/work/process/workspace/method/governance/artifact/audit/metric/report/capability/archive/sandbox 正文 | 明确不拥有的正文 / 真相 | 各 owner 的业务、治理、证明、报告、注册和执行正文保持单一归属。 | 不进入本仓持久、日志、诊断、错误或导出旁路。 |
| 领域校验、幂等依据、业务副作用、正式 verdict、合规/readiness 与 owner 后台任务状态机 | 明确不拥有的正文 / 真相 | 这些是 owner 的决定、执行或运行语义，不是客户端交互事实。 | Console 只能呈现正式结果/引用或 unknown/blocked，不能本地重建。 |

归属结论：Console 的正式真相范围严格限于“用户与客户端如何交互”；外部内容在本仓最多是 owner-safe 快照或引用。快照在本地存在不改变其 owner，引用能回链不等于正文进入本仓，明确禁止正文不拥有生命周期。

### 6.2 简化关系示意图

#### 数据边界示意图：L5-console

```text
                 +-----------------------------+
                 | 外部 owner 正式真相         |
                 | identity / work / governance |
                 | artifact / observability ... |
                 +---------------+-------------+
                                 |
                    formal boundary / safe result
                                 v
        +------------------------+------------------------+
        | L5-console 客户端边界                         |
        |                                                |
        |  +----------------------+  +----------------+  |
        |  | Console 交互真相     |  | owner-safe     |  |
        |  | session / draft /    |  | snapshot       |  |
        |  | navigation / recovery|  | / view shadow  |  |
        |  +----------+-----------+  +--------+-------+  |
        |             |                       |          |
        |             | reference only       | expires  |
        |             v                       v          |
        |       +-----+-----------------------+------+   |
        |       | owner-safe reference / result ref  |   |
        |       +------------------------------------+   |
        |                                                |
        |  forbidden body / truth never enters ----------+
        +------------------------------------------------+
```

图示说明：

- 图只帮助区分外部真相、Console 交互真相、owner-safe 快照和引用关系，不表达存储结构、同步流程或事件流。
- 外部 owner 仍是正式真相来源；客户端快照随语境、可见性、来源状态或 owner 变化失效。
- 引用只表达关系和回链；forbidden body / truth 不得通过查询、错误、诊断或导出旁路进入 Console。
- Console 交互真相不向下游宣称为业务、治理、审计、能力、归档或运行真相。

### 6.3 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 当前 actor/scope 与受保护视图或受控意图 | 正式 owner 真相 ↔ 快照/引用 | 边界即时一致 / 强安全约束 | 无法重新验证、过期、撤销、冲突或 unknown 时 fail-closed，停止披露/提交。 | 安全资格不能依赖最终收敛的旧影子。 |
| Console 会话选择、草稿、确认与请求呈现 | 正式真相数据 ↔ 正式真相数据 | 单客户端交互内强一致 | 发现语境失效或状态冲突时暂停受保护交互，保留可安全保留的草稿并要求重验。 | 这是交互事实连贯性，不等于 owner 业务事务一致。 |
| owner truth 到 owner-safe 视图影子 | 外部正式真相 ↔ 快照/投影数据 | 最终一致，带来源与新鲜度 | 标 stale/partial/unavailable，显式重查或撤除；不得用旧影子覆盖新结果。 | 只读消费允许延迟，但不能压平状态轴。 |
| owner truth 到跨 owner 联合视图 | 多个外部正式真相 ↔ 多个快照/投影数据 | 分 owner 最终一致；不承诺跨域原子一致 | 按 owner 隔离 partial/stale/unknown；缺一项不补造完整、合规、健康或 ready。 | 联合呈现是组织方式，不是新 truth。 |
| owner truth 到业务对象/决定/结果引用 | 外部正式真相 ↔ 引用关系数据 | 引用有效性一致 | 引用过期、撤销、不可见或无法回查时呈现 invalid/unknown/blocked，不回填正文。 | 引用只保证关系可解释，不保证正文可离线使用。 |
| 草稿/确认到受控意图提交 | 正式真相数据 ↔ 外部正式真相边界 | 提交前语境与资格即时约束；草稿本地强一致 | 资格变化、确认缺失或正式 surface 未开放时保持草稿/blocked，不提交或不重放。 | 草稿不是正式命令或批准。 |
| transport/receipt/accepted 到 owner 正式结果 | 请求交互真相/引用 ↔ 外部正式真相/引用 | 以 owner confirmed/rejected 为准；中间态不升级 | accepted/pending/中断/unknown 时进入回查或挂起；无正式 reconciliation 时禁止自动重放。 | 保护副作用与幂等边界。 |
| owner 状态变化到 SDK 失效/刷新提示 | 外部正式真相 ↔ 快照/投影数据 | 最终一致的提示协作 | 提示缺失不改变安全主链；收到提示只触发重查/重验，不直接改写结果。 | 不建立 Console 事件投影或 cursor。 |
| 用户偏好跨会话或跨设备承接 | 正式真相数据 ↔ 正式真相数据/条件快照 | 非安全关键的条件最终一致；当前会话以本地选择为准 | 冲突时采用更保守或当前会话明确选择；不让偏好改权限、优先级或 owner truth。 | 介质、同步范围和生命周期仍 pending。 |
| 错误/降级/a11y 呈现与 owner 业务状态 | 正式真相数据 ↔ 快照/引用数据 | 交互呈现需与已知正式状态一致；诊断旁路可最终收敛 | 无法分类时 unknown 并收紧；诊断缺失/失败不改变业务状态。 | 视觉成功、播报或日志不能覆盖正式结果。 |
| 安全诊断到 Observability 接收 | 快照/投影数据 ↔ 外部 owner 接收边界 | 最终一致 / 尽力而为，且不进入业务主链 | sink 不可用、拒绝或延迟时丢弃/降级诊断，不阻断安全恢复，不伪造 audit/evidence。 | exact envelope 与保留边界 pending。 |

一致性原则不是“所有数据都强一致”或“所有数据都最终一致”的二选一：安全语境和受保护动作采用边界即时约束，单客户端交互事实保持本地连贯，owner-safe 只读影子和跨 owner 组合允许最终收敛，正式结果始终由 owner 确认。

### 6.4 失败、补偿与挂起约束

| 失败类别 | 架构层处理 | 明确禁止 |
|---|---|---|
| 语境/资格不可验证或已撤销 | 立即收紧受保护视图和动作；保留最小退出、重验或重新选择入口。 | 用旧 session、URL、偏好、菜单或快照继续放行。 |
| owner-safe 影子 stale/partial/unavailable/conflict | 按来源隔离呈现多轴状态；显式重查、等待 owner 正式结果或撤除影子。 | 压平为空/成功/绿色/ready，或用其他 owner 成功掩盖。 |
| 引用失效或正文不可见 | 保留 invalid/unknown/blocked 姿态和安全回链；必要时重新获取正式引用。 | 从缓存、日志、诊断或相邻 owner 猜测/补齐正文。 |
| 命令 transport/receipt 后中断或 unknown | 优先使用正式 reconciliation 查询；没有正式依据则挂起 unknown 并禁止副作用重放。 | 以 toast、刷新、乐观更新或本地幂等键宣布完成。 |
| 跨 owner 组合缺项或版本不对齐 | 保留分 owner coverage/freshness/consistency，允许局部视图继续工作。 | 伪造跨域原子快照、统一健康、合规、审计或 readiness。 |
| 诊断/失效提示缺失 | 使用显式 query/revalidation 或保持当前保守姿态；诊断旁路独立降级。 | 将没有提示解释为没有变化，或把诊断失败当业务失败。 |
| 本地草稿/偏好冲突或产品不再支持 | 以明确用户选择、保守清除或要求复核收敛；不影响 owner truth。 | 静默覆盖、将草稿变正式对象或让偏好扩展权限。 |

补偿约束只在架构层定义“重查、重验、撤除、保守呈现、挂起、退出或重新选择”这些语义，不规定重试次数、队列、事务、outbox、缓存 TTL 或具体组件。任何未来实现补偿都必须在正式 owner 合同和本步归属边界内闭合。

### 6.5 按架构单元的数据所有权与停审

| 架构单元 | Console 正式真相 | 仅可持有的 snapshot / projection / reference | 明确不拥有 / 禁止写入 | 一致性与失败口径 | 停审结论 |
|---|---|---|---|---|---|
| 可信管理交互编排 | 交互不变量的当前呈现、跨支撑语义的编排经历（不新增业务对象真相）。 | 由支撑单元提供的已裁剪安全状态、引用和请求经历。 | 不拥有任何 owner 业务/治理/审计/能力/归档/sandbox truth，不保存外部正文。 | 以正式语境和 owner 结果为准；冲突时选择更保守姿态，unknown 不升级。 | `pass`：核心无外部真相，归属与一致性主线清楚。 |
| 访问语境与导航 | 会话壳、当前入口、导航选择和呈现布局。 | actor/scope 摘要、visibility/资格安全姿态及正式语境引用。 | credential、认证主体、scope 定义、授权证明、本地 RBAC 和永久授权缓存。 | 受保护披露/提交前即时重验；撤销/过期/冲突/unknown 立即 fail-closed。 | `pass`：session 与身份/授权分离。 |
| 来源保真视图 | 筛选、排序、分页、下钻和视图组织意图。 | owner-safe 查询结果、source、freshness、coverage、availability、consistency 摘要及对象/版本引用。 | raw/hidden body、跨 owner 完整对象、客户端 verdict/readiness、服务内部存储正文。 | 视图可最终收敛；stale/partial/unavailable/empty/not-visible 分开；不以旧影子放行动作。 | `pass`：影子不成为业务 truth。 |
| 受控意图与结果 | 草稿、危险确认、提交经历、等待/需回查/恢复呈现。 | owner receipt/result/reconciliation/audit/evidence 安全引用。 | 正式业务对象、领域校验、幂等依据、审批正文、副作用和 committed 结果。 | 提交前语境即时约束；结果以 owner confirmed/rejected 为准；unknown 只回查或挂起。 | `pass`：交互经历与业务结果分离。 |
| 管理主题组织 | 主题选择、跨主题导航和能力裁剪的客户端组织事实。 | 各 owner 分区的安全摘要和引用；Workspace/相邻产品仅按正式合同进入。 | 成员、项目、流程、治理、制品、方法、能力、观测、归档、sandbox 领域模型或跨域 verdict。 | 各 owner 独立最终收敛；局部失败隔离；不宣称跨主题原子一致或 readiness。 | `pass`：页面组织不升级为领域 owner。 |
| 韧性与可访问交互 | 错误/降级/恢复选择、焦点、播报和等价操作路径。 | 最小错误上下文、来源状态和安全诊断快照/引用。 | 业务错误真相、审计/evidence 历史、诊断正文、通过 fallback 放宽的资格。 | 已知状态必须保真；无法分类标 unknown 并收紧；诊断失败不改变业务。 | `pass`：恢复不改写 truth。 |
| 正式语境与资格引用 | 无独立业务真相；仅维护当前引用关系的交互有效性。 | owner/SDK 提供的最小语境、资格、visibility snapshot/ref。 | identity、scope、Policy/Gate、授权和资格证明正文。 | 引用有效性需在边界使用时确认；撤销/过期/冲突即失效。 | `pass`：引用不成为授权 owner。 |
| owner-safe 视图影子 | 无外部业务真相；只拥有本地影子是否可安全呈现的交互状态。 | owner-safe view/result snapshot、来源和多轴状态。 | 业务 projection/cursor/replay/rebuild、raw/hidden body、跨 owner 重建 truth。 | 允许最终一致；提示/重查后更新或撤除；不反写 owner。 | `pass`：影子可失效且不反向拥有 truth。 |
| 正式请求与结果引用 | 本客户端请求经历和引用呈现关系。 | receipt/result/reconciliation/ref 以及正式追溯安全引用。 | owner 正式对象、幂等依据、审批/审计/evidence/report 正文、业务终态。 | confirmed/rejected 才收口；unknown 无依据不重放，引用失效则 blocked/unknown。 | `pass`：引用和经历不构成业务结果。 |

逐单元停审结论：九个单元均完成“正式真相—快照/投影—引用—禁止正文—一致性/失败”判断。没有任何单元需要迁入 owner projection、cursor、replay、数据库或服务端状态机；本地介质、生命周期和 safe-field exact 合同仍按 pending 传递。

### 6.6 跨数据边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| Console 正式真相是否仅限交互事实 | pass | 会话、选择、草稿、请求经历、恢复/a11y 和偏好均不具备业务正式性。 |
| 外部 owner truth 是否唯一 | pass | identity、work/process/workspace、governance/artifact、method/capability、observability/archive/sandbox 各自保持 owner。 |
| 快照/投影是否可能反写或成为第二真相 | pass | 只读 owner-safe 影子可失效、按 owner 分区，不维护业务 projection/cursor/replay。 |
| 引用是否被误写为正文 | pass | 引用只承载关系、来源、版本、结果或回链；引用失效不补正文。 |
| forbidden body 是否覆盖所有旁路 | pass | credential、授权证明、raw/hidden body、owner 正文、日志/错误/诊断/导出正文均排除。 |
| 安全语境是否误用最终一致 | pass | 受保护披露/提交前需要即时重验，撤销/过期/unknown 立即收紧。 |
| 只读影子是否误用强一致 | pass | owner 视图和跨 owner 组合允许最终收敛，但带 source/freshness/coverage/availability/consistency。 |
| 命令结果是否存在双真相 | pass | Console 只拥有请求经历；owner confirmed/rejected 才是正式结果，unknown 不升级。 |
| 跨 owner 是否伪造原子一致或 readiness | pass | 组合视图分 owner 隔离，不生成统一健康、合规、审计或运行结论。 |
| 失败补偿是否滑入实现机制 | pass | 仅写重查、重验、撤除、保守呈现、挂起、退出和重新选择。 |
| pending 是否被润色为已完成 | pass | safe-field、生命周期、诊断 envelope、reconciliation 和 activation 继续 pending；无 integrated/ready 声明。 |
| 对 Step 9 的承接是否清晰 | pass | Step 9 可据此选择同步 query、异步提示、后台 owner 承接和 unknown/补偿通信边界。 |

## 7. 复杂度判断

本步覆盖 30 类需求级数据类别、九个架构单元和 11 类关系场景，但所有判断都停留在归属、生命周期上限和关系级一致性；没有扩展为字段、表、缓存、事务或事件实现。复杂度主要来自“安全即时约束、只读最终收敛、owner-confirmed 结果”三种不同一致性语义，必须保留在正式 §9，否则后续概要设计容易把旧影子当权限或把 receipt 当完成。单文件足以完成逐单元停审，不需要为每个 owner 建独立数据模型。

## 8. 正式 §9 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
> - `design-calibration/01_arch_step_05_bounded_context_subdomains.md`
> - `design-calibration/01_arch_step_07_dependency_direction.md`
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
> - `projects/L5-console/00-需求文档.md` §10~§11

正式 §9 应承接本文件 §6.1 的归属表、§6.2 的边界示意、§6.3 的一致性策略、§6.4 的失败约束，并保留以下不可删减的主线：

1. Console 正式真相仅包括客户端会话/选择、导航与探索意图、草稿/确认、请求经历、错误/恢复/a11y 和明确保存的呈现偏好。
2. 外部业务、治理、制品、workspace、方法、能力、观测、归档和 sandbox 真相不进入 Console；本地最多保留 owner-safe 快照或安全引用。
3. 安全语境、visibility、资格和受保护动作采用边界即时约束；owner-safe 只读影子和跨 owner 组合采用带多轴状态的最终收敛。
4. 只有 owner confirmed/rejected result/ref 才表示正式业务结果；receipt/accepted/transport/刷新/optimistic state 不得替代，unknown 不自动重放。
5. forbidden body 不得进入本地生命周期、缓存、错误、日志、诊断或导出；引用失效时不补正文，跨 owner 不宣称原子、完整或 ready。

正式正文不得增加旧文档的服务端 PanelState、全量业务缓存、固定 TTL、optimistic 完成、统一强/最终一致口号、报告/evidence 正文复制或本地 readiness/审计 truth。

## 9. 待确认事项

| 待确认项 | 本步处理 | 当前状态 |
|---|---|---|
| `CON-Q-022` owner safe-field、redaction、freshness、coverage、availability、consistency 合同 | 只固定“最小安全快照/引用 + 多轴状态 + 无法证明则裁剪/拒绝”的上限，不发明字段或状态枚举。 | `open / blocks exact view model` |
| `CON-Q-023` 草稿、偏好、会话状态的生命周期与跨设备范围 | 认定其为 Console-owned 交互真相，但介质、保留和同步范围不锁定；不影响权限或 owner truth。 | `open / blocks exact lifecycle` |
| `CON-Q-024` 客户端诊断 envelope、接收方与保留边界 | 仅允许最小安全交互上下文；sink 缺失/失败不改变业务；具体 envelope pending。 | `open / blocks exact diagnostics` |
| `CON-Q-034~043` exact owner query/command/result/ref、scope/visibility/资格和 reconciliation | 作为正式边界输入；未闭口时视图/动作保持 read-only/blocked/unknown，不迁移 truth 到 Console。 | `open / blocks positive depth` |
| `CON-Q-044` 状态介质、TTL、失效与跨设备语义 | 本步只定义数据类别和安全上限，不选择内存、会话或持久介质，不写 TTL。 | `open / non-blocking for ownership` |
| `CON-Q-045` 性能、可用率和负载 authority | 不因一致性分类新增 fan-out、投影或后台任务；量化目标后移。 | `open / non-blocking for ownership` |
| `CON-Q-047` 相邻 L5/L6 的链接/引用与共享状态 | 只允许未来正式 link/ref；不把相邻产品状态作为 Console 快照或 truth。 | `open / pending` |

本步没有阻塞 Step 9 的新问题；未闭合项只限制 exact safe-field、生命周期、诊断和正向命令深度，不改变“Console 交互真相 + owner-safe 影子/引用 + forbidden body”归属结论。

## 10. 自检、三层门禁与进入 Step 9 条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否先回答数据归属再回答一致性 | pass | §6.1 先列四类归属，§6.3 再列关系级一致性。 |
| 是否明确正式真相、快照/投影、引用和禁止正文 | pass | 归属表覆盖客户端事实、owner-safe 影子、正式引用和 forbidden body。 |
| 是否按九个架构单元逐项停审 | pass | §6.5 每项有 truth、snapshot/ref、禁止正文、一致性和结论。 |
| 是否区分安全即时约束、单客户端连贯和最终收敛 | pass | 语境/资格/动作、交互事实、只读影子和跨 owner 分别处理。 |
| 是否保留 owner-confirmed/unknown 结果边界 | pass | receipt/accepted/pending/unknown 不升级；无 reconciliation 不重放。 |
| 是否覆盖跨 owner 和诊断失败 | pass | 分 owner partial/stale/unavailable；诊断独立降级。 |
| 是否覆盖日志、错误、诊断、导出 forbidden body | pass | 明确禁止正文和敏感载荷不进入任何旁路。 |
| 是否滑入数据库、缓存、事务、事件或字段设计 | pass | none；仅写架构级归属和失败原则。 |
| 是否出现双真相、投影反写或引用正文入仓 | pass | 跨数据审计全部 pass。 |
| 是否伪造 owner 合同、实现、测试、evidence、signoff 或 readiness | pass | safe-field、生命周期、activation 和诊断均保持 pending。 |
| 正式 `01` 是否被提前写入 | pass | 仅创建 Step 8 calibration。 |

### 10.2 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 四类数据归属、关系级一致性、失败挂起约束、九单元停审和跨数据审计均完成，无 unresolved 双真相或边界冲突。 | 更新 flow 与项目台账，激活 Step 9。 |
| 文档级 | `pass_to_step_9` | 正式 §9 回填基础已形成；数据所有权没有下沉到实现存储或协议，正式 `01` 继续等待 Step 16。 | 创建并完成 `01_arch_step_09_interactions_communication.md`。 |
| 项目级 | `pass_with_open_contracts` | safe-field、草稿/偏好生命周期、reconciliation、诊断 envelope、activation 和量化 authority 仍 pending，但不阻塞关键交互通信方式校准。 | 进入 Step 9；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
