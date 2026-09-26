# L5-sync 架构 Step 10 · 关键技术选型

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 10 |
| 输入 | Step 2 目标/约束、Step 7 依赖方向、Step 8 数据、Step 9 交互 |
| 回填章节 | 正式 01 §11 |
| 下一步 | Step 11：备选方案与取舍 |

## 2. Step 内计划

- [x] 仅选择能解决架构问题的技术机制/风格，不罗列工具名。
- [x] 为每个机制说明问题、理由、代价和不确定性。
- [x] 核对技术机制与五个架构单元、通信方式和数据 ownership 一致。
- [x] 明确当前不采用的历史技术方向及其原因。
- [x] 完成选型停审，不下沉具体 crate/CLI/schema/数据库。

## 3. 本步输入

| 输入 | 关键结论 |
|---|---|
| Step 2 | 本地受控入口、owner seam、人工裁决、fail-closed |
| Step 7 | ports/adapters、SDK 边界、无 sibling 私有依赖 |
| Step 8 | local strong transition、external eventual snapshot、forbidden body |
| Step 9 | sync owner calls、后台 probe、显式结果分层 |

## 4. SOP 问题回答

### 4.1 当前采用哪些关键架构机制？

采用以下架构级机制：

1. ports-and-adapters 依赖方向，隔离 local core 与 SDK/Git/filesystem/store concrete details。
2. 显式上下文与 fail-closed gate，禁止默认选择和 owner unknown 下的副作用。
3. append/transition-oriented local operation state，保证 cursor、checkpoint、conflict、handoff 和 provenance 的可回链。
4. source/working-copy 双边界与原子 apply 语义，避免 source truth 与本地修改混层。
5. prepare→call→probe/finalize 的外部副作用控制，隔离 unknown outcome。
6. 分层结果模型：local operation、Git observation、transport、Review decision、archive posture、diagnostic 分开。
7. redaction-first / forbidden-body 约束，所有诊断和 telemetry 只承载 bounded metadata。

### 4.2 每个机制解决什么问题？

Ports/adapters 解决工具和平台替换；显式 gate 解决隐式版本/权限/来源；transition state 解决部分成功和断点恢复；双边界解决覆盖 dirty worktree；prepare/probe 解决网络 unknown；结果分层解决 ACK/accepted 混淆；redaction 解决敏感正文泄露。

### 4.3 每个选型的代价和风险是什么？

代价包括：需要维护多个状态层和引用关系；adapter seam 增加设计与校验成本；unknown 状态会让用户看到更多 pending/manual；不自动 merge/rebase/push 牺牲便利性；source comparator 和 metadata schema 未闭合时，部分能力必须保持 blocked。上述代价是有意识地换取 owner boundary 和可追溯性。

### 4.4 哪些选型暂不引入？

当前不引入具体 Rust/Tauri 绑定、Git LFS/浅克隆、大仓专用协议、resident daemon、任意 event bus、共享数据库、完整事件溯源、自动 merge/rebase/push、离线全局缓存、GUI 逻辑复制和固定性能优化产品。

## 5. 当前文档问题诊断

| 旧选型 | 问题 | 当前处理 |
|---|---|---|
| Rust CLI-first | 把语言和入口形态写成定论 | 保留“本地客户端入口”架构机制，语言后置 |
| Git facade + command wrapper | 可能允许任意 Git command | 改为白名单 observation/lock/atomic apply adapter |
| versioned metadata JSON | schema 未由上游闭合 | 只锁 versioned controlled local state 机制 |
| optional Tauri GUI | 产品壳层提前进入核心 | GUI 作为未来入口变体，不影响核心边界 |
| LFS/浅克隆 | 历史规模优化未核验 | 作为后续候选，不进入当前技术选择 |

## 6. 设计取舍

| 机制方案 | 结论 | 理由 |
|---|---|---|
| 直接调用 SDK/Git concrete APIs | 不采用 | 破坏核心可替换性和权限/dirty 门禁。 |
| ports/adapters + typed semantic transitions | 采用 | 将技术变化隔离在边界，支撑后续可落码。 |
| event-first reactive sync | 不采用 | 会让异步输入越过用户选择和本地保护。 |
| full event-sourcing/共享数据库 | 不采用 | 当前需求不需要且会吞并外部 truth。 |

## 7. 结构化中间产物

### 7.1 关键技术机制表

| 技术机制 | 解决问题 | 选择理由 | 代价/风险 | 当前状态 |
|---|---|---|---|---|
| Ports / adapters | 隔离 SDK、Git/fs、store 与 local core | 遵守依赖倒置和替换边界 | seam 数量增加 | adopted architecture mechanism |
| Explicit context + gate | 防止 implicit latest/default allow | 与 BR-SYNC-001~004 对齐 | 用户需显式选择 | adopted |
| Local transition/checkpoint model | 防止 partial success、支持恢复 | local truth 可回链 | 需要状态迁移审计 | adopted |
| Source vs working-copy boundary | 防止覆盖用户修改与双真相 | 对齐 Artifact/Workspace owner | comparator/mapping pending | adopted with blocker |
| Prepare/call/probe/finalize | 处理 unknown external outcome | 避免盲重放 | probe contract pending | adopted with blocker |
| Layered result semantics | 区分 Git/transport/decision/archive | 防止 ACK 升格 | 输出复杂度增加 | adopted |
| Redaction-first/bounded diagnostics | 保护正文/secret | 对齐 00 forbidden body | 排障信息受限 | adopted |

### 7.2 按架构单元组织的技术适用

| 单元 | 主要机制 | 不适用/禁止 |
|---|---|---|
| Selection & Access | explicit context、fail-closed gate、typed owner result | local default allow、cache authorization |
| Working Copy & Metadata | local transition、integrity boundary、atomic state | shared DB、single unversioned blob |
| Source Materialization | source/workcopy separation、mapping/comparator port、safe apply | auto merge/rebase、opaque overwrite |
| Conflict & Recovery | checkpoint、probe、manual decision relation | blind retry、implicit repair |
| Review Handoff & Provenance | frozen candidate、prepare/call/probe、layered result、redaction | direct push、ACK=accepted、raw body |

### 7.3 当前不采用口径

| 技术方向 | 当前口径 | 重新评估条件 |
|---|---|---|
| Rust/Tauri | 不作当前架构结论 | 当前 upstream/support matrix 闭合且产品需要 |
| Git LFS/浅克隆 | 不作支持承诺 | Artifact/Git compatibility 与 workload 证据闭合 |
| 常驻 daemon | 不作默认部署形态 | 长时任务/通知需求与安全生命周期闭合 |
| 直接 L0-bus 订阅 | 不进入主链 | SDK/事件 owner 提供受控合同 |
| 共享数据库/私有 endpoint | 永久禁止作为跨仓 seam | 不适用；必须使用正式 owner boundary |

## 8. 回填草稿

正式 §11 回填 7.1~7.3；只写架构机制、理由、代价和不采用口径，不写具体 package、库、命令、schema 或 benchmark。

## 9. 待确认事项

- 具体 SDK/Git/fs adapter 与 state store 技术由后续概要/详细/配置阶段决定。
- LFS/浅克隆/GUI/daemon 继续受 `SYNC-UP-009` 约束。
- source comparator、probe 合同和 local state schema 仍受 `SYNC-UP-002/005/006/008/010` 约束。

## 10. 自检与进入下一步条件

- [x] 每个技术机制都有问题、理由、代价和适用边界。
- [x] 未把技术名词清单或实现目录当成选型结论。
- [x] 选型与依赖、数据、通信和架构单元一致。
- [x] 历史技术方向已降级为 pending/不采用口径。

`gate_status = pass_with_upstream_blockers`；可进入 Step 11。
