# 01 架构 Step 6：容器 / 部署架构

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 6。

### Step 内计划

- [x] 读取系统上下文和 U1~U6 语义单元。
- [x] 回答同步入口、后台处理、异步消费、状态承载和外部设施角色。
- [x] 诊断旧 API/worker/PG/S3 产品化拓扑。
- [x] 输出运行承载图、说明表、部署边界与自检。

## 2. 输入、问题回答与历史诊断

输入为 Step 4/5、正式 00 的接口类别与 NFR。同步请求需要即时收口 admission/query/restore validation；capture、closure、verification、placement、retrieval、handoff、reconcile 属长时后台承接；bus/外部回执可由异步消费角色承接。Archive 需要本地正式状态承载；对象存储、完整性/签名/KMS 和 bus 属外部设施边界。

旧文档固定 `archive-api`、四个 worker、PostgreSQL、S3/MinIO/Glacier 和 Rust，这是实现/产品/部署假设。当前只确定三类运行角色，可同部署或按负载/隔离需要分离；不声明进程、镜像、集群或存储产品。

## 3. 设计取舍

| 路径 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 单同步进程执行所有长任务 | 简单 | 超时、恢复和外部副作用语义不清 | 不采用为架构主线 |
| 同步入口 + 后台执行 + 异步承接三角色 | 职责、失败和扩缩边界明确 | 需协调本地状态 | 采用 |
| 每个 U 单元一个部署单元 | 显式 | 过早微服务化 | 不采用 |
| 固定 PG/S3/KMS 产品 | 便于实现想象 | 无正式选择与配置 authority | 不采用 |

## 4. 结构化中间产物

### 4.1 容器 / 部署架构图

```text
                    +-----------------------------+
                    | operation / read entrances  |
                    +--------------+--------------+
                                   |
                                   | entrance
                                   v
      +======================================================+
      |              L4-archive runtime boundary             |
      |                                                      |
      |   +----------------------------------------------+   |
      |   | synchronous admission and read unit         |   |
      |   +----------------------+-----------------------+   |
      |                          | process                   |
      |                          v                           |
      |   +----------------------------------------------+   |
      |   | background archive / restore execution unit |   |
      |   +----------------------+-----------------------+   |
      |                          ^                           |
      |                          | consume                   |
      |   +----------------------+-----------------------+   |
      |   | asynchronous trigger / feedback unit        |   |
      |   +----------------------+-----------------------+   |
      |                          |                           |
      |                          | carry                     |
      |                          v                           |
      |   +----------------------------------------------+   |
      |   | Archive formal state store                  |   |
      |   +----------------------------------------------+   |
      +======================================================+
                         | depend                | depend
                         v                       v
              +--------------------+   +--------------------+
              | source / receiver |   | storage / integrity|
              | external boundary |   | external capability|
              +--------------------+   +--------------------+
```

图后说明：

- 图表达运行承载角色与入口、处理/消费、承载/依赖关系，不表达源码模块、API、事件名或部署参数。
- U1~U6 是语义单元，不与图中的运行单元一一对应。
- 外部 source/receiver、storage/integrity 只作为运行时对接边界；Archive 不拥有其 truth。
- 三个主动运行角色可以同部署，是否物理分离留给后续实现约束与负载证据。

### 4.2 运行单元说明

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| synchronous admission and read unit | 同步入口单元 | 承接请求受理、状态查询、验证读取及可即时判断的恢复申请 | 入口；将长时工作交给后台 | 即时返回 accepted/rejected/blocked，不伪装后台完成。 |
| background archive / restore execution unit | 后台处理单元 | 推进 capture、closure、verification、placement/retrieval、material/handoff、reconcile | 处理；依赖本地状态和外部能力 | 长任务、retry/compensation 不占同步边界。 |
| asynchronous trigger / feedback unit | 异步消费单元 | 接收正式触发、owner/storage/receiver feedback 与变化提示 | 消费；唤醒或推进后台处理 | event arrival 不等于授权或业务 truth。 |
| Archive formal state store | 正式存储承载 | 承载 U1~U6 的 Archive-owned 状态与历史 | 被三类运行单元承载/依赖 | 不包含外部业务 truth、secret 或共享表。 |
| source / receiver external boundary | 运行时对接的正式外部边界 | 提供材料或接收恢复 handoff | 与后台/异步单元对接 | 具体 owner 合同仍 pending。 |
| storage / integrity external capability | 正式基础设施依赖 | 承载材料、反馈 commit/retrieval，提供处理/验证能力 | 与后台单元对接 | 供应商、算法、KMS 未确定。 |

### 4.3 部署边界

本章只要求同步入口与长时/异步工作在语义上可分离，不要求当前物理微服务化。运行单元共享 Archive 正式状态边界，但不能共享上游数据库；外部 side effect 必须在本地可追溯意图/结果语境下执行。对象存储与完整性能力的具体产品不进入主图，Bus 也不成为 Archive 内部业务容器。实际进程、资源、区域和拓扑必须由后续设计结合实现仓与配置 authority 决定。

## 5. 回填、待确认与门禁

正式 §7 承接图、运行单元表和部署边界。`AR-UP-001/004/005/009` 继续限制外部对接，未把 adapter 存在写成集成 ready。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 7 依赖方向与层间约束`。
