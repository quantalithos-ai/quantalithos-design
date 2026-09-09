# 01 架构 Step 3：职责边界

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 3。
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

Step 1/2，正式 00 §2/9/10/11；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 做什么？跨域读取与投影、scope 绑定、版本覆盖解释、局部注意力、恢复维护及只读交接。
2. 不做什么？任一 L1 truth 修改、授权裁决、执行编排、UI/cache、归档恢复。
3. 最易混淆什么？local hide 与 permission、unread 与消息 receipt、projection cursor 与 bus delivery、read export 与 archive acceptance。
4. 哪些动作不能隐式发生？打开视图不标记已读、不创建 partition、不安排 refresh；读失败不创建任务或业务事实。
5. 为什么要写红线？下游可以依据引用访问 owner 正式入口，但 workspace 不代理上游变更。

## 4. 当前文档问题诊断

README §二“项目动作仍然写回”若被理解为 workspace 转发，会破坏 BR-WS-011；draft/03 §2 的 Outbox 只是条件候选，不能自动生成本仓 outbound event family。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 视图 owner + 显式 local change + 显式维护 | 写入范围可审查 | 消费者需分别发起读与局部变化 | 采用 |
| 通用工作区 facade 代办全部操作 | 单入口便利 | 越过源域、授权与执行边界 | 禁止 |

## 7. 结构化中间产物

### 7.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| Personal/Project read-model 组织 | 做 | 两种 scope 不产生新身份或项目生命周期。 |
| owner-safe query 聚合与 ref 追溯 | 做 | 消费安全摘要而非复制正文。 |
| scope/visibility 正式决定消费和裁剪 | 做 | 只执行 owner 结果，不产生 allow/deny 真相。 |
| projection、版本、cursor、coverage 维护 | 做 | 维护自己的应用结果，不控制源域事件。 |
| Inbox 派生与 local attention | 做 | 业务 attention 必须来自明示输入。 |
| refresh/rebuild/invalidation/cutover | 做 | 只恢复 workspace 投影，不修复 source truth。 |
| 稳定只读交接与局部诊断 | 做 | 下游必须识别来源、coverage 和降级。 |
| GlobalMember / Project / ProjectMember 创建管理 | 不做 | identity/work 拥有其事实。 |
| Conversation / Turn / Participant 正文和 receipt | 不做 | conversation 拥有其事实。 |
| WorkItem / ProcessInstance / Activity 推进 | 不做 | work/process 拥有其事实。 |
| Policy / Gate / Decision / 制品正文与基线 | 不做 | governance/artifact 拥有其事实。 |
| runtime / tools / capability registry / sandbox | 不做 | 执行和隔离不是工作区局部状态。 |
| SDK client/cache、产品 UI、sync/archive 状态 | 不做 | 下游拥有其实现与生命周期。 |
| Inbox 隐藏 / 可见性 | 易混淆职责 | 本地隐藏只能减少展示，不能授予原本不可见的内容。 |
| ReadCursor / unread | 易混淆职责 | workspace 已读只作用当前 principal/scope，不确认消息已读或工作完成。 |
| source cursor / bus delivery | 易混淆职责 | 前者是本地应用进度，后者是 bus 的传递事实。 |
| preview / summary / body | 易混淆职责 | 只消费 owner 明确许可的安全摘要，不沿 ref 拉入正文。 |
| refresh / archive restore | 易混淆职责 | workspace 从 owner 来源重建，不从未确认 archive 包定义真相。 |
| 静态 seed / live view | 易混淆职责 | member-images 的静态输入 owner pending，不由 live view 反向补齐。 |

### 7.2 红线

- 查询既不写 source，也不写 projection、read cursor、last-opened 或任务状态；读取日志/技术观测不得改变可见业务结果。
- 所有本地变更和维护操作必须显式、获准、可追溯；不能成为通往上游的命令路由。
- 已提交 projection 只证明本地应用，不能证明 owner 当前版本、授权仍有效、bus delivered 或 archive accepted。
- 不能从多个域的摘要重建一个“事实更完整”的授权、优先级、生命周期或执行决定。
- 不因主干 event 协作而定义 workspace outbound event family；是否发布局部变化须待 WS-UP-007 与消费者合同闭合。

## 8. 回填草稿

正式 §4 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：职责分类用单表；没有提前定义实现模块或接口。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

每个不做项有 owner；local state 与外部 truth 分开；没有新增上游写面；红线覆盖 query、projection、维护和 export。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 4。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
