# L2-runtime 01 架构 Step 6: 容器 / 部署架构

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 7 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 4 系统上下文、Step 5 架构单元、上游运行边界 |
| 目标 | 定义机制中立的正式运行承载单元、主关系和部署分离边界 |
| 禁止 | 伪造已有进程 / 容器 / DB / queue；写代码目录、协议、资源参数或实现技术栈 |

## 1. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式承载单元 | Runtime 入口承接单元、运行推进单元、恢复 / 后台承接单元、外部反馈消费单元、Runtime 状态承载。 |
| 同步入口 | 入口承接单元负责受理 / 拒绝受控 trigger、control 和 safe query；具体协议未定。 |
| 后台 / 异步 | 长时 run 推进、resume / recovery / handoff retry，以及外部反馈关联需要独立运行角色，但不预设单独进程。 |
| 存储 / 基础设施 | Runtime 状态承载用于本地 truth；Core 是 shared authority，Bus 是事件协作边界；物理存储和总线实例未声明 ready。 |
| 部署分离 | 入口、推进、恢复 / feedback 必须逻辑分离且可独立约束；当前允许同部署，不允许由同部署推导共享 truth 或同步耦合。 |
| 不进入主图 | member host、provider、Tools / Sandbox 内部容器、Observability backend、durable memory backend。 |

## 2. 历史材料诊断与取舍

旧“member 同容器双进程 + UDS gRPC + Python runtime + vector store + tool invoker”是未经当前边界核验的部署 / 技术事实，全部降级为 `historical_material`。当前采用运行角色而非物理实例表达：先保证入口、推进、恢复、反馈、状态承载语义可分，再由后续设计 / 实施决定共进程或分部署；这会延后运维拓扑确定性，但避免 member-service、Sandbox 或 provider 生命周期混入 Runtime。

## 3. 容器 / 部署架构图

```text
 +==========================================================+
 |                 L2-runtime runtime boundary              |
 |                                                          |
 |  +----------------------+                                |
 |  | Runtime entry       |  入口                           |
 |  | acceptance boundary |                                |
 |  +----------+-----------+                                |
 |             | 处理                                       |
 |             v                                            |
 |  +----------------------+    +----------------------+     |
 |  | Run progression     |<-->| Feedback consumption |     |
 |  | controlled loop     |    | correlation boundary |     |
 |  +----------+-----------+    +----------------------+     |
 |             | 处理 / 承载                                  |
 |             v                                            |
 |  +----------------------+    +----------------------+     |
 |  | Recovery/background |--->| Runtime state        |     |
 |  | continuation        |    | truth carrier        |     |
 |  +----------------------+    +----------------------+     |
 +==========================================================+
          ^                         |
          | 入口 / 对接              | 依赖 / 对接
 +--------+---------+        +------+------------------+
 | Entry consumers  |        | Tools / Sandbox /      |
 | Member / SDK     |        | model / Bus / Obs      |
 +------------------+        +-------------------------+
```

- 图中的“单元”是正式运行承载角色，不声明物理进程、容器、实例或部署已存在。
- Entry、Progression、Recovery、Feedback 必须逻辑分离，但当前可以同部署；实际伸缩 / 隔离方式后移。
- Runtime state carrier 表示本地正式状态承载责任，不指定数据库产品、表或事务机制。
- 外部对象只作为运行时对接边界；其内部执行和生命周期不归 Runtime。

## 4. 运行单元说明表

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| Runtime entry acceptance boundary | 同步入口单元 | 受理 / 拒绝正式 trigger、control 和安全查询 | 入口 -> 运行推进 | 不拥有产品 UI、member host 或 SDK lifecycle。 |
| Run progression | 后台处理单元 | 推进 controlled run、goal / plan、context、decision 和 action 等待 | 处理 / 消费 -> 状态承载 / 外部边界 | “后台”指可长时推进角色，不预设 worker 产品。 |
| Recovery / background continuation | 后台处理单元 | 承接 resume、recovery、reflection、等待恢复和本地 handoff continuation | 处理 -> Runtime state | 不盲重试 unknown side effect。 |
| Feedback consumption boundary | 异步消费单元 | 关联 Tool / Sandbox / model / Bus 等迟到或异步反馈 | 消费 -> 运行推进 / 恢复 | 不把反馈到达当成本地 outcome。 |
| Runtime state truth carrier | 正式存储承载 | 承载 run / working / decision / checkpoint / outcome 的正式状态责任 | 被入口 / 推进 / 恢复依赖 | 物理存储、事务和 schema 后移。 |
| Entry consumers | 运行时对接的正式外部边界 | 提供受控触发并消费安全视图 | 入口 | 下游尚未校准，不反向决定部署。 |
| External action / event boundaries | 运行时对接的正式外部边界 | 承接 Tools / Sandbox / model / Bus / Observability 正式 seam | 对接 / 依赖 | 多项正向 contract / readiness 仍 pending。 |

## 5. 部署边界结论

| 判断 | 当前结论 |
|---|---|
| 必须逻辑分离 | 入口受理、run 推进、recovery / continuation、feedback consumption、state truth responsibility。 |
| 当前可同部署 | 上述 Runtime 单元可由同一部署单元承载，但不得因此共享私有外部 truth、绕过正式 seam 或压平失败状态。 |
| 条件性独立部署 | 长时推进、恢复或反馈负载需要独立扩缩 / 故障域时可分离；当前不声明触发阈值。 |
| 必须外置 | Tools execution、Sandbox isolation、provider / durable memory backend、Bus / Observability backend、member lifecycle。 |
| readiness | 当前只完成设计，不声明任何单元、状态存储或外部 seam 已实现 / 已部署 / 可运行。 |

## 6. 回填、自检与门禁

| 检查 | 结果 |
|---|---|
| 对象均为正式运行承载角色 | pass |
| 未使用代码目录、API、event、table、产品或资源参数 | pass |
| 逻辑分离未伪装物理部署事实 | pass |
| 外部 owner 未并入 Runtime 容器 | pass |
| 旧双进程 / Python / UDS / vector store 已降级 | pass |
| Step 7 文件未提前创建，正式 01 未修改 | pass |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_07_dependency_direction
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_07_start
```
