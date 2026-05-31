# Step 6. 容器 / 部署架构

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-sdk/01-架构设计.md` §7 容器 / 部署架构

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.7 容器 / 部署架构
  - `standards/document/架构设计讨论流程_SOP.md` Step 6
  - `projects/L0-sdk/design-calibration/01_arch_step_04_system_context.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_05_bounded_context.md`
- 已确认结论：
  - `L0-sdk` 是三语言官方客户端接入层,不是独立线上 gateway。
  - `L0-sdk` 的运行使用形态是被下游应用、runtime、自动化脚本和集成代码嵌入消费。
  - 当前 P0 需要本地 package candidate、最小可验证接入、quickstart / docs runner 和跨语言 smoke。
  - 公共注册表正式发布不属于当前 P0 部署前置。
  - 本 Step 只表达正式运行承载单元与部署关系,不写源码目录、语言包目录、接口协议、生成器或发布命令。

### 3. SOP 问题回答

1. 这个仓运行时有哪些正式容器或运行单元？

   回答：`L0-sdk` 没有独立线上服务容器。正式运行承载可分为嵌入式 SDK 运行承接单元、事件客户端承接单元、candidate 生成与封装处理单元、跨语言验证处理单元、文档示例验证处理单元、package candidate artifact 承载和受控验证目标边界。

2. 同步入口在哪里？

   回答：同步入口位于调用方进程内的嵌入式 SDK 运行承接单元。调用方通过 SDK 访问正式服务边界,但 SDK 不成为独立网络入口或服务端 facade。

3. 异步消费者或后台任务在哪里？

   回答：事件客户端承接单元在调用方运行环境中消费或发布事件视图;candidate 生成、跨语言 smoke 和文档示例验证属于构建 / 验证期后台处理单元,不属于线上业务 worker。

4. 数据库 / 缓存 / 总线如何接入？

   回答：SDK 自身不需要业务数据库、缓存或消息队列作为运行承载。它通过上游 package / contract 边界消费 `L0-core` / `L0-bus`,通过正式服务边界和 fake / fixture endpoint 完成运行期或验证期对接,并将 candidate、报告和证据承载为 artifact。

5. 哪些运行单元必须分开部署，哪些可以同部署？

   回答：嵌入式 SDK 运行承接单元和事件客户端承接单元随调用方部署;candidate 生成、验证和文档示例 runner 可在本地开发环境或验证环境中同部署执行,但逻辑边界必须清楚。公共注册表发布、完整 MCP provider、REST / GraphQL gateway 和 REPL 不进入当前部署主线。

6. 哪些通信关系是正式主路径？

   回答：正式主路径是调用方进程加载 SDK,SDK 基于 core / bus 上游契约和正式服务边界发起客户端访问,并在验证环境中通过 fake / fixture target 和 runner 形成 package candidate、示例运行和跨语言一致性证据。本 Step 不细化协议、接口名或事件名。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6.1 容器图 | 旧文档说 SDK 无常驻业务容器,但马上转向源码仓、CI 和 package registry | 容易把发布流水线误当部署架构主线 |
| §6.2 容器职责 | codegen runner、rust package build、python package build、ts package build 直接作为容器 | 混入语言工具和实现形态,没有表达 SDK 运行时嵌入消费特点 |
| §6.3 通信方式 | wrapper -> service、wrapper -> bus 直接写协议候选 | 这是关键交互或技术选型内容,不属于 Step 6 |
| §6.4 数据存储 | 旧文档未清楚说明 SDK 不需要业务 DB / cache / MQ | 后续实现可能误引入服务端状态或本地缓存 |
| 全文 | 公共注册表、CI 和语言打包平台像当前部署前置 | 与当前本地 package candidate P0 口径冲突 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 部署身份 | 源码仓 + CI + package registry | 无独立线上服务的 SDK package / validation 承载 | 符合客户端接入层定位 |
| 运行承载 | 按 codegen runner 和语言 package build | 按嵌入式 SDK 运行、事件客户端承接、candidate 生成、验证 runner、artifact 承载 | 容器视图表达运行职责而不是工具名 |
| 同步入口 | 暗示 wrapper 调 service | 调用方进程内的 SDK 运行承接单元 | SDK 不是服务端入口 |
| 异步处理 | 未区分事件 client 和验证 runner | 事件客户端随调用方运行,candidate / smoke / docs 属于验证期后台处理 | 避免线上 worker 和验证任务混淆 |
| 存储依赖 | registry / CI artifact 可能成为主线 | package candidate artifact 和验证证据承载为正式 artifact | 当前 P0 不依赖公共注册表 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把 `L0-sdk` 设计成独立线上 gateway 服务 | 调用入口统一 | 违反客户端接入层边界,会拥有服务端业务编排 | 不采用 |
| 方案 B：按嵌入式 SDK 运行承接 + 构建验证承载表达部署视图 | 符合 SDK 本质,能支撑 P0 candidate 和 smoke | 需要后续详细设计再映射到语言包和工具链 | 采用 |
| 方案 C：只写“无部署架构”并跳过本章 | 简短 | 无法说明 candidate、验证、文档示例和 artifact 如何成为正式承载 | 不采用 |
| 方案 D：把 crates.io / PyPI / npm 作为当前部署主图对象 | 发布阶段直观 | 与当前 P0 本地验证优先冲突 | 不采用 |

### 7. 结构化中间产物

#### 7.1 容器 / 部署架构图

```text
                                             +----------------------+
                                             |  caller runtime      |
                                             |  product / script    |
                                             +----------+-----------+
                                                        |
                                                        | 入口
                                                        v

      +======================================================+
      |                 L0-sdk 正式运行承载                   |
      |                                                      |
      |   +----------------------+   承载 / 依赖   +----------------------+
      |   | package candidate    |--------------->| 嵌入式 SDK 运行承接 |
      |   | artifact             |                | client call surface |
      |   +----------^-----------+                +----------+-----------+
      |              |                                       |
      |              | 处理                                  | 处理 / 消费
      |   +----------+-----------+                           v
      |   | candidate 生成与验证 |                +----------+-----------+
      |   | smoke / docs / compat|                | 事件客户端承接单元 |
      |   +----------------------+                | event client surface|
      |                                           +----------------------+
      |                                                      |
      +======================================================+
                                                        |
                                                        | 依赖
                                                        v
                                             +----------+-----------+
                                             | fake / fixture       |
                                             | verification target  |
                                             +----------------------+
```

该图表达 `L0-sdk` 的正式运行承载结构,不表达源码目录、语言包目录、接口协议、事件名、发布命令或公共注册表拓扑。

图示说明：

- `L0-sdk` 没有独立线上服务容器,嵌入式 SDK 运行承接单元随调用方进程部署。
- candidate 生成与验证处理单元属于构建 / 验证期后台处理,不是线上业务 worker。
- package candidate artifact 是当前 P0 的正式承载,公共注册表不进入当前主图。
- fake / fixture target 只作为最小验证依赖出现,不属于 SDK 部署结构。

#### 7.2 运行单元说明表

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| caller runtime | 运行时对接的正式外部边界 | 承载产品、runtime、脚本或集成代码中的 SDK 使用环境。 | 通过入口关系进入嵌入式 SDK 运行承接单元。 | 它是调用方运行边界,不属于 SDK 仓部署结构。 |
| 嵌入式 SDK 运行承接单元 | 同步入口单元 | 承接调用方对平台服务能力的客户端访问。 | 随调用方部署并依赖 SDK package candidate。 | 它不是独立网络 gateway 或服务端 API。 |
| 事件客户端承接单元 | 异步消费单元 | 承接基于 bus 语义的事件客户端使用视图。 | 与嵌入式 SDK 运行承接单元共同消费上游事件语义。 | 它不拥有 bus delivery、retry、DLQ 或 replay truth。 |
| candidate 生成与验证处理单元 | 后台处理单元 | 形成本地 package candidate、运行 smoke、验证示例和兼容边界。 | 处理结果写入 package candidate artifact。 | 这是构建 / 验证期处理单元,不是线上业务 worker。 |
| package candidate artifact | 正式存储承载 | 承载本地 SDK candidate、示例材料和验证证据入口。 | 被调用方验证、runner 和后续发布阶段消费。 | 这是当前 P0 的正式承载,不等同于公共注册表发布。 |
| fake / fixture target | 运行时对接的正式外部边界 | 为 quickstart、smoke 和最小接入验证提供受控目标。 | 被验证处理单元依赖。 | 它不拥有业务生产 truth,只用于受控验证。 |

#### 7.3 部署关系结论

- `L0-sdk` 不部署为独立线上服务,不会成为 server gateway。
- 嵌入式 SDK 运行承接单元和事件客户端承接单元随调用方进程部署。
- candidate 生成、smoke、docs 示例验证和兼容检查可以在同一本地或验证环境中执行,但逻辑边界必须分清。
- package candidate artifact 是当前 P0 的正式承载;公共注册表、完整 MCP provider、REST / GraphQL gateway、REPL 和本地缓存不进入本章主图。
- SDK 自身不需要业务数据库、缓存或消息队列作为运行承载。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §7 “容器 / 部署架构”直接摘录并整理本文件 §7.1、§7.2、§7.3。
- 不在本 Step 重复粘贴完整正式章节,避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| `L0-sdk` 是否部署为独立线上 gateway | A. 是;B. 否,作为 package / embedded client 被消费;C. 保留待定 | B | 需求和职责边界已确认 SDK 不是 server facade 或 gateway | 已确认采用 B |
| 公共注册表是否进入当前部署主图 | A. 进入主图;B. 后续发布阶段再进入;C. 完全删除 | B | 当前 P0 以本地 package candidate 和验证证据为正式承载 | 已确认采用 B |
| candidate 生成与验证是否作为正式运行承载 | A. 是;B. 只放实施计划;C. 删除 | A | 当前 P0 的可安装、可验证和跨语言一致性依赖该承载成立 | 已确认采用 A |
| SDK 是否需要业务数据库、缓存或消息队列 | A. 需要;B. 当前不需要;C. 待定 | B | SDK 不拥有服务端业务 truth、状态缓存或 bus runtime truth | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 7 的待确认事项。
- 具体语言包目录、生成器、runner 命令、artifact 格式、公共发布阶段和 package manager 选择后移到后续设计 / 测试 / 实施文档。

### 10. 进入下一步条件

- 已确认 `L0-sdk` 不部署为独立线上服务或 gateway。
- 已明确嵌入式 SDK 运行承接、事件客户端承接、candidate 生成验证和 artifact 承载边界。
- 已确认公共注册表、业务数据库、缓存和消息队列不进入当前部署主图。
- 可以进入 Step 7 依赖方向与层间约束。
