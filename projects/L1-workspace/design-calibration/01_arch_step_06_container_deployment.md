# 01 架构 Step 6：容器与部署

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 6。
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

Step 4 系统上下文、Step 5 U1~U6；书写规范 §4.7；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 运行单元？同步访问、异步投影消费、后台恢复三类承载，不等于三个微服务。
2. 同步入口在哪里？访问单元承接读与显式 local change，维护触发交给恢复单元。
3. 事件在哪里处理？投影消费单元消费 bus 输入，通过本仓一致性边界落地。
4. 存储如何接入？只有 workspace-owned 状态的正式存储；owner 状态经外部正式读取面，禁止直连 owner 表。
5. 是否必须分部署？职责必须分开，初期可同部署；扩展必须证明分区写所有者与世代隔离。
6. 什么主路径？访问单元读取稳定结果，消费/恢复单元维护结果；读取流不得承担隐式修复。

## 4. 当前文档问题诊断

draft/03 §2 是实现层而非容器，不能把 contracts/domain/repository/handler 画成运行单元；没有现存实现仓或部署事实可继承。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 三种逻辑运行角色可同部署，共用本地一致性存储 | 隔离请求与恢复责任 | 需限额和写入栅栏 | 采用设计目标 |
| 首版每个语义单元独立服务/数据库 | 独立扩展 | 引入无收益跨服务事务 | 当前不采用 |

## 7. 结构化中间产物

### 7.1 容器 / 部署架构图

#### 容器 / 部署架构图

Workspace 访问、消费与恢复承载。

```text
    [Access boundary]          [L0-bus boundary]
            | entry                    | consumption
+-----------v--------------------------v------------+
| L1-workspace                                      |
| [Synchronous access]      [Projection consumer]    |
|            |                     |                |
|            | handling            |                |
|            v                     |                |
| [Recovery background unit]       |                |
|            |                     |                |
|            +---------+-----------+                |
|                      | storage / dependency       |
|                      v                            |
|             [Workspace state store]               |
+---------------------------------------------------+
          | dependency
          v
  [Owner read / visibility boundary]
```

图示说明：

- 图是设计目标，不声明已有进程、集群或数据库部署；三个运行角色可同部署。
- 访问单元到恢复单元的处理关系只用于显式维护请求，read query 绝不隐式启动恢复。
- 状态存储也承载访问单元的读取与 local change；外部 owner 边界只允许正式读取及决定消费。

### 7.2 运行单元说明

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| Synchronous access | 同步入口单元 | 承接 principal/scope、read/export、显式 local change 和维护入口 | 依赖状态承载与 owner 边界 | U1/U4/U6 的运行承接，不意味着写权限向 query 开放。 |
| Projection consumer | 异步消费单元 | 应用 owner 变化、去重、维护游标和缺口 | 消费 bus 输入，依赖状态承载 | 承接 U2/U3；不成为 bus delivery owner。 |
| Recovery background unit | 后台处理单元 | 显式失效、刷新、候选世代构建与切换 | 依赖 owner 输入及本地状态承载 | 承接 U5；无隐式 owner 修复。 |
| Workspace state store | 正式存储承载 | 承载局部状态、投影、应用和恢复记录 | 被三个运行角色依赖 | 逻辑单一一致性边界，未选择存储产品。 |
| Access boundary | 运行时对接的正式外部边界 | 提供获准读取、局部变更和维护输入 | 入口 | SDK/产品或受控管理入口。 |
| L0-bus boundary | 运行时对接的正式外部边界 | 提供正式事件协作 | 消费 | backend、topic、delivery 均不在此定义。 |
| Owner read / visibility boundary | 运行时对接的正式外部边界 | 提供正式安全读取和授权消费语境 | 依赖 | 不跨仓共享存储或事务。 |

### 7.3 部署与通信结论

三类角色必须逻辑隔离，但没有业务理由强制拆为独立部署。首版允许同进程或同部署单元承载，保持请求资源与恢复资源隔离、受控停机及提交边界。需要多实例时，按 workspace 分区/世代约束并发写，不能靠“最终一致”允许两套 current generation。缓存和搜索不是独立 truth 存储，也不是首版架构必需承载。

## 8. 回填草稿

正式 §7 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：运行单元表单独于语义划分；图中只保留三角色、一状态承载与必要外部边界。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

无代码目录、接口 schema、部署实例或运行结果；同步 read 与维护触发不同；本地存储不是上游数据库。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 7。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
