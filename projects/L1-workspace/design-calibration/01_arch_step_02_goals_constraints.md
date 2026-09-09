# 01 架构 Step 2：架构目标与约束

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 2。
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

模块骨架：not_applicable。未来 Step 不创建。

## 2. 本步输入

Step 1 §7 的 AB-WS-01~11、正式 00 §3/4/13；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 为什么单独建仓？多个消费方需要一致的视图来源和失效解释；仅列功能不能隔离读、维护和局部写责任。
2. 必须成立什么？稳定 scope、唯一视图局部状态 owner、可重建投影、可解释降级和授权消费边界。
3. 不可变什么？任何输入/输出不得改变上游事实，未知权限不得展示，三类游标不能混用。
4. 可收缩什么？搜索、排名、历史比较和多机扩展不进入当前核心闭环；已定义的幂等/缺口/撤销不能收缩。
5. 如何判断？以 owner 边界、query 零状态写和版本覆盖可追溯判定；无 workload 不给 P95/SLA 数字。

## 4. 当前文档问题诊断

README §一的首页和任务板是展示主题，不是服务目标；draft/02 §2 的细功能不应机械复制成架构目标。正式 00 §13 已明确量化 baseline 待定。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 固定局部所有权和安全降级，按 seam 解锁来源 | 目标可判定 | 初始 coverage 可不完整 | 采用 |
| 以所有域实时一致、全功能首页为先决目标 | 体验表述简单 | 无 barrier/权限合同支撑 | 不采用 |

## 7. 结构化中间产物

### 7.1 业务背景与驱动力

产品、同步和成员入口需要同一跨域视野；来源真相彼此独立，任一来源断流不能变成隐式全局状态。架构需要隔离 scope/visibility、来源读取、投影维护、局部注意力和消费输出，使失败和重建在 workspace 边界内可解释。

| 驱动力 | 结构影响 |
|---|---|
| 一个成员跨域/跨项目读取 | 同一 read-model 框架下区分 principal 与 scope |
| 输入时效和事件顺序不同 | 每源水位、覆盖及缺口不能压成全局“最新” |
| 权限撤销与缓存并发 | 正式决定消费与数据新鲜度分开约束 |
| 用户局部体验需持久 | local state 不依附上游业务写路径 |
| 产品、同步、归档有不同消费节奏 | 稳定服务读面不承接下游内部状态 |

### 7.2 架构目标

| 架构目标 | 说明 |
|---|---|
| AG-WS-01 承载唯一 workspace 局部状态边界 | 否则 read cursor、投影和偏好散落在不同消费方。 |
| AG-WS-02 支撑 Personal/Project 同框架语境隔离 | 否则跨项目结果可能误作当前项目可见内容。 |
| AG-WS-03 守住 source truth 与 read model 分离 | 否则展示和重建会隐式变成业务命令。 |
| AG-WS-04 支撑可追溯的投影和恢复结构 | 否则重复、乱序与缺口无法解释。 |
| AG-WS-05 守住权限消费和数据时效的独立边界 | 否则 stale 内容可能继续暴露撤销后的数据。 |
| AG-WS-06 允许消费方按 coverage/status 判断结果 | 否则 partial 结果被误当完整事实。 |

### 7.3 不可变约束

| 约束 | 说明 |
|---|---|
| 不拥有外部域事实或 authorization truth | 对应 AB-WS-01/04/10。 |
| 不允许 query 写 local state、触发刷新任务或反写上游 | 对应 AB-WS-03；请求读视图不等于标记已读。 |
| 不从 ref 字符串、projection 或 cursor 推断 membership/scope | 对应 AB-WS-02/04；需要 owner 正式解析来源。 |
| 不允许缺失、冲突、撤销、失效的 visibility 放行 | 对应 AB-WS-07；stale 不是安全豁免。 |
| 不合并 source cursor、view revision、ReadCursor、generation | 对应 AB-WS-05/06。 |
| 不把 bus preparation/SDK cache/archive acceptance 当本仓事实 | 对应 AB-WS-09/10。 |
| 不把 runtime/event/ref/adapter/fake 写成 compile 关系 | 对应 AB-WS-11 和 BR-WS-012。 |

### 7.4 当前阶段可接受取舍

| 取舍 | 当前口径 |
|---|---|
| 来源覆盖按 owner seam 逐个开放 | 受影响来源保持 blocked，不把缺来源返回 empty-success。 |
| 高级搜索、排名和历史比较 | 作为外围增强，不影响六节点核心闭环。 |
| 多实例、跨地域和高容量优化 | 留演进触发条件；原子性、版本冲突和撤销底线不后置。 |
| exact schema 和部署产品 | 后续文档按正式 owner 契约收口，不在架构猜定。 |
| 量化 SLO | 等 workload 与测量基线；当前仅规定可判断的边界。 |

### 7.5 架构非目标

| 非目标 | 不展开原因 |
|---|---|
| 不设计身份、工作、对话、流程、治理、制品域 | 各 owner 已有独立 truth。 |
| 不承载 runtime、tools、capability、sandbox 执行 | workspace 不是执行主语。 |
| 不设计产品 UI、SDK client/cache、sync 冲突引擎 | 属于下游；本仓只提供安全读面。 |
| 不承载 archive freeze/restore 或镜像 seed 定义 | archive 后续串行；seed owner 未闭合且不等于 live view。 |
| 不设计统一授权决策中心 | 只消费各 owning chain 的正式结果。 |

## 8. 回填草稿

正式 §2/3 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：两类结果分章，不需拆模块；目标与约束不混写。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

目标有明确结构结果；约束可否决；取舍均属本仓潜在范围；非目标均有外部 owner。静态自检通过。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 3。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
