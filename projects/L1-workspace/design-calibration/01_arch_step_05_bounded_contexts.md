# 01 架构 Step 5：限界上下文与子域划分

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 5。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：U1 -> U2 -> U3 -> U4 -> U5 -> U6；各单元思考、结构化、回填、自检后才进入下一单元。未来 Step 不创建。

## 2. 本步输入

Step 3/4；正式 00 §7/9/11；参考 artifact 01 §6 与 governance 01 §6；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 有哪些语义单元？视图身份/范围、来源引用、投影连续性、局部注意力、恢复世代、读取组合。
2. 核心是什么？workspace 分区及局部不变量；不是第七业务 truth 域。
3. 哪些是影子结构？外部安全 summary/ref 是引用/投影；Inbox 业务含义仍归 owner。
4. 为什么不能合并？query 不写、维护可写；local attention 不能被重建删除；source/bus/projection 的版本不同。
5. 如何验证？按 U1~U6 各自职责/非职责/语言停审，再审计 scope 和 projection/attention 的关系。

## 4. 当前文档问题诊断

draft/03 §1 把 truth core、Personal/Project composition 等九个功能组成部分列为候选，不能直接映射九个限界上下文；Personal/Project 是同一 U1 的 scope，不能独立长出生命周期。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 一核心 + 四支撑 + 一来源影子单元 | 区分局部 truth、派生与外部 owner | 需要显式语义映射 | 采用 |
| 按六个 L1 域复制六套内部业务子域 | 名称熟悉 | 把 projection 升级为领域真相 | 禁止 |
| Personal 与 Project 分成两套核心 | 隔离直观 | 同义状态/恢复/权限规则漂移 | 不采用 |

## 7. 结构化中间产物

### U1 单元校准

问题：核心子域的边界是否独立？依据 formal 00 FR-WS-001/002、BR-WS-001/003，需要承载 principal 与 Personal/Project scope 绑定、视图身份及局部不变量。
诊断：draft/03 §1 的功能模块名不等于语义 owner；特别应防止 不定义身份、membership 或授权决定 的反向误归类。
取舍：采用 工作区分区与范围 单元；不采用按外部域或 UI 页面复制真相，避免重复状态。

| 职责 | 非职责 | 统一语言 | 关系 |
|---|---|---|---|
| 承载 principal 与 Personal/Project scope 绑定、视图身份及局部不变量 | 不定义身份、membership 或授权决定 | WorkspacePartition、principal、scope；scope 不是执行主语 | 其他单元围绕同一分区工作 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U2 单元校准

问题：本地索引 / 投影 / 引用的边界是否独立？依据 FR-WS-003、BR-WS-002/003，需要承载经 owner 允许消费的来源语境。
诊断：draft/03 §1 的功能模块名不等于语义 owner；特别应防止 不拥有外部正文、事实版本或授权 truth 的反向误归类。
取舍：采用 来源引用与安全摘要 单元；不采用按外部域或 UI 页面复制真相，避免重复状态。

| 职责 | 非职责 | 统一语言 | 关系 |
|---|---|---|---|
| 承载经 owner 允许消费的来源语境 | 不拥有外部正文、事实版本或授权 truth | SourceRef、safe summary、source version/watermark、visibility binding | 依附 U1，为 U3/U6 提供有来源的输入 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U3 单元校准

问题：支撑子域的边界是否独立？依据 FR-WS-004、BR-WS-004/005/006，需要承载来源输入已应用到哪一版视图的连续性语义。
诊断：draft/03 §1 的功能模块名不等于语义 owner；特别应防止 不拥有 bus delivery 或全域全局时钟 的反向误归类。
取舍：采用 投影连续性 单元；不采用按外部域或 UI 页面复制真相，避免重复状态。

| 职责 | 非职责 | 统一语言 | 关系 |
|---|---|---|---|
| 承载来源输入已应用到哪一版视图的连续性语义 | 不拥有 bus delivery 或全域全局时钟 | source application record、source cursor、view revision、gap/coverage | 依附 U1，消费 U2；为 U5/U6 提供可解释状态 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U4 单元校准

问题：支撑子域的边界是否独立？依据 FR-WS-007/008、BR-WS-008/009，需要承载明示 attention 的派生展示及个人局部状态。
诊断：draft/03 §1 的功能模块名不等于语义 owner；特别应防止 不确认 source 已读/完成；不产生通知裁决 的反向误归类。
取舍：采用 Inbox 与局部注意力 单元；不采用按外部域或 UI 页面复制真相，避免重复状态。

| 职责 | 非职责 | 统一语言 | 关系 |
|---|---|---|---|
| 承载明示 attention 的派生展示及个人局部状态 | 不确认 source 已读/完成；不产生通知裁决 | InboxItem 是派生；ReadCursor、pin/mute/preference/last-opened/focus 是局部事实 | 依附 U1；引用 U2/U3，向 U6 提供 overlay |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U5 单元校准

问题：支撑子域的边界是否独立？依据 FR-WS-009、BR-WS-007/010/011，需要承载刷新、候选世代与恢复结果。
诊断：draft/03 §1 的功能模块名不等于语义 owner；特别应防止 不修复源域事实、不执行 archive restore 的反向误归类。
取舍：采用 失效与重建 单元；不采用按外部域或 UI 页面复制真相，避免重复状态。

| 职责 | 非职责 | 统一语言 | 关系 |
|---|---|---|---|
| 承载刷新、候选世代与恢复结果 | 不修复源域事实、不执行 archive restore | invalidation、refresh、rebuild generation、cutover | 围绕 U1/U3，重读 U2；不重置 U4 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U6 单元校准

问题：支撑子域的边界是否独立？依据 FR-WS-005/006/010、BR-WS-010/011/012，需要承载安全且可解释的 workspace 读取语义。
诊断：draft/03 §1 的功能模块名不等于语义 owner；特别应防止 不拥有 SDK cache、UI、sync 或 archive truth 的反向误归类。
取舍：采用 读取组合与消费交接 单元；不采用按外部域或 UI 页面复制真相，避免重复状态。

| 职责 | 非职责 | 统一语言 | 关系 |
|---|---|---|---|
| 承载安全且可解释的 workspace 读取语义 | 不拥有 SDK cache、UI、sync 或 archive truth | Personal/Project view、provenance、coverage、stale/partial/blocked/fail-closed | 消费 U1~U4；读取 U5 状态，不发隐式维护 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### 7.7 子域 / 上下文划分

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| U1 工作区分区与范围 | 核心子域 | 承载 principal 与 Personal/Project scope 绑定、视图身份及局部不变量 | 其他单元围绕同一分区工作 |
| U2 来源引用与安全摘要 | 本地索引 / 投影 / 引用 | 承载经 owner 允许消费的来源语境 | 依附 U1，为 U3/U6 提供有来源的输入 |
| U3 投影连续性 | 支撑子域 | 承载来源输入已应用到哪一版视图的连续性语义 | 依附 U1，消费 U2；为 U5/U6 提供可解释状态 |
| U4 Inbox 与局部注意力 | 支撑子域 | 承载明示 attention 的派生展示及个人局部状态 | 依附 U1；引用 U2/U3，向 U6 提供 overlay |
| U5 失效与重建 | 支撑子域 | 承载刷新、候选世代与恢复结果 | 围绕 U1/U3，重读 U2；不重置 U4 |
| U6 读取组合与消费交接 | 支撑子域 | 承载安全且可解释的 workspace 读取语义 | 消费 U1~U4；读取 U5 状态，不发隐式维护 |

### 7.8 上下文关系图

#### 上下文关系图

Workspace 局部语义结构。

```text
                    [U1 Workspace partition / scope]
                                  |
              +-------------------+-------------------+
              | support           | support           | support
              v                   v                   v
      [U3 Continuity]     [U4 Local attention]   [U6 Read composition]
              |
              | support
              v
        [U5 Recovery]
              |
              +-------------------+
                                  | local reference
                                  v
                    [U2 Source refs / safe summaries]
```

图示说明：

- 图表示语义依附，不是执行时序或代码层；U2 同时为 U3/U6 提供输入，其主来源在划分表中说明。
- Personal/Project 属于 U1 的 scope 区别，复用 U3~U6；不形成两个业务生命周期。
- U4 中 Inbox 的业务内容可重建，用户局部动作不是来源事件的派生；U5 不得重置它们。

### 7.9 统一语言与跨单元审计

| 词汇 | 唯一解释 |
|---|---|
| owner truth | 由外部 owning domain 维护的事实，workspace 不写。 |
| workspace local truth | U1 分区、U3 应用结果、U4 局部动作、U5 维护状态，不是真相域副本。 |
| source version / watermark | owner 提供的版本 / 完整性语境，不比较不同 owner 的数值大小。 |
| source cursor | 本仓在某来源序列的已应用位置，不等于 bus ack。 |
| view revision / generation | 局部结果版本 / 重建世代，均不能取代 source version。 |
| ReadCursor | principal/scope 下注意力位置，不是来源消费进度。 |
| visibility binding | 对 owner 决定及适用语境的引用，不是本地授权策略。 |
| stale / partial / blocked / fail-closed | 数据时效 / 来源覆盖 / 不可满足请求 / 安全拒绝，不是同一状态轴。 |

跨单元审计：U1 管身份/范围绑定而非授权；U2 保存影子语境而非源域 truth；U3 应用输入与 U5 重建共享局部一致性规则但维护主语不同；U4 局部事实不被 U5 覆盖；U6 不回写任何单元。未发现未归属核心功能或双 owner。

## 8. 回填草稿

正式 §6 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：按六个语义单元逐一停审；表/图/语言和跨单元关系单列，不采用全仓对象清单。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

U1~U6 单元停审完成；核心/支撑/影子分类明确；六节点核心能力均有承接；无孤儿、重复真相和实现组件误分类。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 6。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
