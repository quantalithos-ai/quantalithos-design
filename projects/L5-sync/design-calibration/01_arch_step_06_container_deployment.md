# L5-sync 架构 Step 6 · 容器 / 部署架构

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 6 |
| 输入 | Step 4 系统上下文、Step 5 限界上下文、当前运行形态线索 |
| 回填章节 | 正式 01 §7 |
| 下一步 | Step 7：依赖方向与层间约束 |

## 2. Step 内计划

- [x] 识别真正的运行单元、正式外部边界和本地存储承载。
- [x] 区分本地前台命令、受控同步执行、后台/恢复工作和存储，不把源码模块当容器。
- [x] 审计是否需要独立服务、数据库、缓存、总线或 resident daemon。
- [x] 输出容器图、运行单元表、部署/通信结论和边界红线。
- [x] 不锁 Rust/Tauri、具体 Git library、metadata 文件布局或协议产品。

## 3. 本步输入

| 输入 | 承接 |
|---|---|
| Step 4 | owner 能力边界、本地 Git/filesystem、Archive/Observability 边界 |
| Step 5 | 五个语义上下文与 External Owner References |
| 正式 00 | CLI clone/pull/status/push-review、恢复、幂等、Git/filesystem adapter 要求 |
| 历史 01/README | 本地工具形态线索；Rust/Tauri/daemon 只作候选 |

## 4. SOP 问题回答

### 4.1 运行时有哪些正式容器或运行单元？

当前架构只需确认一个随用户本地环境部署的 Sync 客户端运行边界，内部可辨认三类运行职责：命令/交互入口单元、受控同步编排单元、恢复与探测工作单元。它依赖本地 metadata/checkpoint 承载和 local Git/filesystem working copy；通过 SDK 能力边界与平台交互。是否同一进程、是否 resident daemon、是否 GUI 壳层在架构阶段不固定。

### 4.2 同步入口在哪里？

入口是用户显式触发的本地命令/交互边界。它只接受选择、意图和显示选项，不直接操作平台或 Git；所有变更必须进入受控同步编排单元。

### 4.3 异步消费者或后台任务在哪里？

核心主路径不要求常驻事件消费者。长时下载、恢复、unknown outcome probe、checkpoint continuation 可以由本地恢复/探测工作单元承接，但不得在用户不知情时推进 cursor、解决冲突或发起 handoff。是否常驻、一次性子进程或同进程任务后置。

### 4.4 数据库、缓存、总线如何接入？

当前不要求业务数据库、共享缓存或直接总线接入。本地受控 metadata/checkpoint 承载可以是 filesystem 上的实现，但布局/schema 尚未确定。平台能力通过 `L0-sdk` 正式边界接入；不得直接订阅任意内部 bus 或访问 owner 数据库。

### 4.5 哪些单元必须分开部署？

语义上必须分层，但物理部署可同进程：入口不得直接持有外部副作用能力；Git/filesystem 与 SDK 都通过 adapter boundary；metadata/checkpoint 必须有原子性和锁边界。GUI 若未来存在只能作为另一入口壳层，不能复制核心逻辑。

## 5. 当前文档问题诊断

| 历史描述 | 问题 | 当前处理 |
|---|---|---|
| CLI shell、GUI shell、shared core 被当成已选技术容器 | 提前锁 Rust/Tauri 和双壳层 | 抽象为本地入口、同步编排、恢复/探测职责；物理形态 pending |
| metadata store 被固定为 local JSON | schema/存储格式未闭合 | 只确认 local controlled state store |
| Git facade 被画成核心内部子模块 | 容器图混入源码结构 | 改为本地工具适配外部边界 |
| 默认无后台任务 | 难以表达断点恢复和 unknown probe | 引入“恢复/探测工作单元”架构职责，但不要求 daemon |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 独立线上 Sync 服务 + 本地薄客户端 | 不采用 | 会引入新的 remote truth / 服务编排，偏离本地受控入口。 |
| B. 本地客户端边界，入口/编排/恢复职责分层，可同进程 | 采用 | 满足本地工作区、可恢复和最小部署复杂度。 |
| C. 常驻 daemon 为唯一核心 | 暂不采用 | 当前需求未要求常驻，可能引入隐式动作和生命周期复杂度。 |

## 7. 结构化中间产物

### 7.1 容器 / 部署架构图

```text
 +-------------------------- local developer environment -------------------------+
 |                                                                                |
 |  +------------------+        +-----------------------------+                  |
 |  | command /        |------->| controlled sync            |                  |
 |  | interaction entry|        | orchestration unit         |                  |
 |  +------------------+        +------+---------------+------+                  |
 |                                     |               |                         |
 |                              resume |               | local observe/apply     |
 |                                     v               v                         |
 |                          +----------+------+   +----+----------------+         |
 |                          | recovery / probe |   | Git / filesystem   |         |
 |                          | work unit        |   | working-copy edge  |         |
 |                          +----------+------+   +---------------------+         |
 |                                     |                                         |
 |                                     v                                         |
 |                          +----------+----------------+                         |
 |                          | controlled local state   |                         |
 |                          | metadata / checkpoint    |                         |
 |                          +---------------------------+                         |
 +------------------------------------+-------------------------------------------+
                                      |
                                      | SDK formal capability boundary
                                      v
                         +------------+-------------+
                         | platform owners          |
                         | work/artifact/workspace  |
                         | governance/archive/etc.  |
                         +--------------------------+
```

图示说明：

1. 图描述运行职责和部署边界，不代表源码包、类或进程必须一一对应。
2. 所有平台交互经 SDK 正式能力边界；本地 Git/filesystem 通过受限 observation/apply seam。
3. Recovery/probe 可与主进程同部署，但不得绕过用户可见状态和副作用门禁。
4. Controlled local state 不是平台业务数据库，也不是 Git remote truth。

### 7.2 运行单元说明表

| 运行单元/边界 | 类型 | 职责 | 通信 | 非职责 |
|---|---|---|---|---|
| command / interaction entry | 同步入口 | 接收显式选择与操作意图，展示分层结果 | 调用本地编排单元 | 不直接写 Git/metadata/平台，不隐式刷新 |
| controlled sync orchestration | 核心运行单元 | 执行门禁、编排 source/working-copy/recovery/handoff | 调用 SDK、local adapters、state store | 不拥有外部 truth，不自动裁决冲突 |
| recovery / probe work unit | 后台/可续工作单元 | 承接 checkpoint continuation、unknown probe、局部重试 | 读取受控 checkpoint，调用相同正式 seam | 不盲重放，不在后台自动推进决策 |
| controlled local state | 本地存储承载 | 承载 session/binding/cursor/mapping/conflict/checkpoint/handoff/provenance | 原子读写/锁，具体实现后置 | 不保存外部正文、secret、正式 evidence |
| Git/filesystem working-copy edge | 外部本地边界 | 提供状态观察、路径保护、锁与白名单 apply | adapter boundary | 不提供自动 merge/rebase/push/stash |
| SDK formal capability boundary | 外部运行期边界 | 提供 owner checks/source/read/handoff/probe 能力 | 同步调用为主，具体协议 pending | 不被替换为私有 endpoint/共享 DB |

### 7.3 部署与通信结论

- 当前正式部署形态是本地客户端边界，不要求独立线上后端。
- 入口、编排和恢复职责可以同进程，但能力必须隔离；未来 GUI 只能复用相同核心边界。
- 外部 owner 访问采用 SDK 正式运行期调用；没有上游合同前不声明具体 API、RPC、事件或 transport。
- 本地 store 和 working copy 都需要进程/操作级并发保护，但具体锁和原子文件策略后置。

### 7.4 运行边界红线

| 红线 | 理由 |
|---|---|
| entry 不直接持有 Git/SDK mutation capability | 防止 UI/CLI 绕过编排和安全门禁 |
| recovery/probe 不以后台成功替代用户可见结果 | 防止 unknown 被静默重放或伪装成功 |
| local store 不成为共享平台数据库 | 守住本地 operation truth 边界 |
| Git adapter 不暴露通用 shell/任意命令执行 | 防止白名单外破坏性操作 |
| 不直接接入内部 bus/owner DB | 遵守 SDK 和依赖裁剪边界 |

## 8. 回填草稿

正式 §7 回填容器图、运行单元说明和部署/通信结论；不写 Rust crate、Tauri、文件名、具体数据库、queue、daemon 或 adapter interface 名称。

## 9. 待确认事项

| 待确认项 | 当前口径 | 状态 |
|---|---|---|
| CLI 是否唯一入口 | 架构只要求 command/interaction entry；GUI/Tauri pending | `SYNC-UP-009` |
| recovery 是否独立进程/daemon | 只锁运行职责，可同进程 | 后续概要/详细设计 |
| local state store 技术与布局 | 只锁受控本地承载及原子/完整性要求 | `SYNC-UP-006` |
| Git adapter 技术 | 只锁白名单能力，不锁 library/process invocation | `SYNC-UP-007/009/010` |

## 10. 自检与进入下一步条件

- [x] 容器图未使用源码目录、模块、函数或协议名。
- [x] 同步入口、后台/恢复、存储和外部边界均有职责与非职责。
- [x] 未把 GUI/daemon/database/cache/bus 写成必选。
- [x] 部署视图与 Step 4/5 owner 边界一致。

`gate_status = pass_with_upstream_blockers`；可进入 Step 7。
