# 01 架构 Step 4：系统边界与上下文

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 4。
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

Step 1~3；全局依赖 §4.1；上游正式 01 的系统上下文及 flow 来源复核表；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 全局位置？在已停审 member runtime 层之后，archive 之前；本次只完成 01，未解锁 archive 或产品并行窗口。
2. 上游？L0-core 共享契约、L0-bus 事件主干和六个 L1 owning domain。
3. 下游？SDK 及经正式边界访问的产品/sync；archive 是后续消费者，不是本仓输入 owner。
4. 输入面？正式 scope/ref、安全摘要、版本/覆盖和可见性决定及变化信号；不是任意业务正文。
5. 输出面？workspace read model、局部变更结果、维护状态；不是业务命令、运行意图或归档完成。
6. 失效怎么办？安全依赖失败先 fail-closed；来源非安全缺失才按分区返回 stale/partial/blocked。

## 4. 当前文档问题诊断

draft/01 §3 把 compile/event 字样用于上下文草图，正式 §5 按规范只画输入/输出/依赖；依赖分类放 Step 7。L2 边界参考不构成新增输入主链。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 聚合六个 L1 owner 节点，表中逐域解释 | 图简明且 owner 不丢失 | 需同时读表 | 采用 |
| 把全 27 仓和每个事件放入上下文图 | 关系全量 | 混淆依赖、协议及运行顺序 | 不采用 |

## 7. 结构化中间产物

### 7.1 系统上下文图

#### 系统上下文图

L1-workspace 的输入与输出边界。

```text
           +-----------+           +-------------------+
           | L0-core   |           | L1 truth domains  |
           +-----+-----+           +---------+---------+
                 | dependency                | input
                 +---------------+-----------+
                                 v
+----------+ input     +--------------------+
| L0-bus   |---------->| L1-workspace       |
+----------+           +----------+---------+
                                 | output
                       +---------+----------+
                       v                    v
              +----------------+     +--------------+
              | SDK / products |     | L4-archive   |
              | / sync entry   |     | downstream  |
              +----------------+     +--------------+
```

图示说明：

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。
- L1 truth domains 收缩 identity、work、conversation、process、governance、artifact；并不合并其 truth 或授权规则。
- 下方仅表示消费边界，archive 尚需后续串行校准；图不证明当前集成成立。

### 7.2 上下游与输入 / 输出面

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| L0-core | 输入 | 来源 | ref/error/trace/共享契约 | workspace 专用类型仍待确认。 |
| L0-bus | 输入 | 来源 | owner 已提交变化的正式传递面 | 不承担事件业务 schema 或 source watermark authority。 |
| L1-identity | 输入 | 来源 | GlobalMember 身份锚点与安全摘要 | 身份存在不代表跨项目有权读取。 |
| L1-work | 输入 | 来源 | Project/ProjectMember/WorkItem scope 及安全摘要 | membership 与工作事实归 work。 |
| L1-conversation | 输入 | 来源 | 对话安全摘要/ref、显式 attention | 不输入消息正文或 workspace 已读回执。 |
| L1-process | 输入 | 来源 | 可见流程/活动摘要及引用 | 不推进流程。 |
| L1-governance | 输入 | 治理依赖 | 正式治理结论及其允许消费范围 | 不将全部授权决定强行归于单域。 |
| L1-artifact | 输入 | 来源 | 安全制品摘要/稳定版本引用 | 不复制正文、血缘或基线事实。 |
| L0-sdk / 产品 / sync | 输出 | 消费 | 带 provenance、coverage/status 的 read model | consumer 私有缓存和冲突引擎不入仓。 |
| L4-archive | 输出 | 消费 | 后续只读交接边界 | export 不声明 archive accepted 或 frozen。 |
| 正式维护入口 | 输入/输出 | 入口 | 显式 refresh/rebuild 意图及本地结果 | 不以身份/运行层旁路授权。 |

### 7.3 边界说明与失效

六个 L1 域是来源 owner，Core 与 Bus 提供共享约束和传递支撑，因此构成正式输入边界。L2 项目只用于排除执行、宿主和静态镜像资产的误归属，不进入视图输入主链。SDK/产品/sync 和 archive 的消费需求不能反向改变源域事实。visibility 不可验证时隐藏受影响内容及敏感元信息；数据源超时不等于实体删除，允许返回的安全旧分区标 stale，缺少部分来源标 partial，不能满足请求必要条件时 blocked。

## 8. 回填草稿

正式 §5 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：上下文图收缩为六类对象，逐域表补足；不引入内部单元。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

图中关系为输入/输出/依赖；全部来源有 owner；L2 仅作边界参考；archive 单向消费；安全失效优先。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 5。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
