# L6-bridges 01 Step 6：容器与部署架构

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step5六单元及跨审pass；已读Step4/5、00§6/9/12、SOP Step6、规范§4.7/图规则。单一运行承载单元小循环；只确定同步入口、异步承接、局部存储和基础设施边界，不锁部署产品、代码目录、协议schema或具体参数。

| 单元 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 运行承载与部署拓扑 | done | done | done | pass / read_step_07 |

## 2. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 正式运行单元？ | 入口/接收承载、桥接协调承载、交付/恢复承载、局部状态存储；平台适配是运行边界能力，不强制一平台一进程。 |
| 同步入口？ | 管理/查询/交互回调与协议即时响应进入入口承载；即时响应不等owner结果。 |
| 异步/后台？ | 外部来源消费、owner交接、投递、限流等待、对账恢复、body-free handoff在后台承载中按安装隔离。 |
| 存储/总线？ | 本仓局部配置/relation/mapping/cursor/dedup/intent/attempt/receipt/handoff存储；事件传输仅经正式bus seam，不能把Bus当本仓truth。 |
| 必须分开？ | 入口响应与长时投递/恢复应可独立限流；是否物理拆分留部署选择。 |
| 主通信？ | 入口到局部协调，协调到adapter/平台/owner边界，后台到局部存储/Bus/Observability；失败姿态独立。 |

## 3. 当前材料诊断与取舍

旧01§6把shared core、mapping store、turn translator、gate projection、audit/rate control写成实现容器并锁Python/TS、本地DB；这混合模块、数据所有权和技术选型。当前只定义运行角色与正式依赖，不把每个平台视为独立真相或固定进程。采用可同部署但逻辑隔离入口即时响应与长时派发/恢复；未采用四个独立微服务或单体无边界入口。

## 4. 结构化中间产物

### 4.1 容器/部署图

#### 容器 / 部署架构图: Bridges运行承载

```text
                    +-----------------------------+
                    | Platform runtime boundary   |
                    +--------------+--------------+
                                   v
      +===========================================================+
      | L6-bridges runtime carriers                               |
      |                                                           |
      | +----------------------+                                  |
      | | Protocol entry / ACK |                                  |
      | +-----------+----------+                                  |
      |             v                                             |
      | +----------------------+    +---------------------------+ |
      | | Bridge coordination  |--->| Delivery/rate/recovery    | |
      | +-----------+----------+    +-------------+-------------+ |
      |             |                             |               |
      |             +--------------+--------------+               |
      |                            v                              |
      |               +---------------------------+               |
      |               | Bridge local state        |               |
      |               +---------------------------+               |
      +============================+==============================+
                                   | formal runtime dependencies
                   +---------------+---------------+
                   v               v               v
             +-----------+   +-----------+   +---------------------+
             | Secret    |   | Event     |   | Owner/observation   |
             | resolver  |   | transport |   | runtime boundaries  |
             +-----------+   +-----------+   +---------------------+
```

图示说明：

- 图只表达运行承载、入口、处理、承载/依赖关系，不表达API、事件名、源码模块或部署参数。
- 平台边界是外部运行时对接，不证明安装/能力可用；owner/观察边界仍由正式合同决定。
- 入口即时响应与交付/恢复逻辑隔离限流和失败，但可在同一物理部署中承载。

Step16表示复核：底部三类基础设施/外部边界按§4.2并列投影为整体运行依赖，消除原图的存储→secret→owner误读；不是新增依赖或运行时调用链。八类角色与部署取舍保持不变。

### 4.2 运行单元说明

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| 协议入口与即时响应承载 | 同步入口单元 | 接收管理/查询/平台即时交互并完成来源初验、快速ACK/拒绝 | 入口→桥接协调 | 不把即时响应当owner或平台成功。 |
| 桥接协调承载 | 后台处理单元 | 推进U1~U4受权交接、转换和effect准备 | 处理→局部状态/平台/owner | 共享保护，不拥有owner truth。 |
| 交付、限流与恢复承载 | 后台处理单元 | 按安装/target推进派发、等待、未知对账和局部恢复 | 处理→平台/owner/局部状态 | 预算未知时停自动动作。 |
| 桥接局部状态承载 | 正式存储承载 | 保存本仓配置、relation/mapping、cursor/dedup、intent/attempt/receipt/handoff局部状态 | 承载→入口/后台 | 不保存禁止正文/secret/内部truth。 |
| 事件传输基础设施 | 正式基础设施依赖 | 提供已选事件路径的传输能力 | 依赖→后台/owner边界 | transport ACK不等业务结果。 |
| secret解析基础设施 | 正式基础设施依赖 | private seam解析opaque provider ref | 依赖→入口/后台 | provider/KMS未选，raw值不进入存储。 |
| 四平台运行边界 | 运行时对接的正式外部边界 | 接收/发送平台协议与能力结果 | 入口/后台→平台 | 每installation独立，能力按版本核验。 |
| owner / 观察边界 | 运行时对接的正式外部边界 | 接收正式owner交接与body-free观察材料 | 协调/恢复→owner/观察 | consumer disposition独立于本地handoff。 |

### 4.3 部署说明与回填草稿

运行单元可在同一部署中组合，也可按入口、外部连接和恢复负载独立扩展；当前架构只要求逻辑职责、隔离限流和局部存储边界成立。是否选用具体进程模型、容器编排、SDK或数据库由后续技术/配置/实施文档在真实环境核验。任何部署模式都不能改变禁止正文、secret、owner写入或unknown恢复约束。

正式§7拟摘录§4.1~4.3；不写代码目录、数据库产品、K8s、SDK或部署参数。

## 5. 待确认事项

平台接入方式、事件bus、secret provider、route/部署形态均未选；BR-UP-007/008/009保持open。物理拆分/同部署需02/04/实施阶段在真实环境确认。

## 6. 自检与门禁

自检：图对象符合运行承载类型，未滑入模块/协议/表/运维参数；入口、后台、存储、基础设施与外部边界关系可解释，阶段结果和owner边界未被重写。当前agent设计自检pass。

gate_status=pass；gate_reason=runtime_units_and_deployment_boundary_self_reviewed；next_allowed_action=read_step_07_then_create；source_files=Step4/5/00/SOP6/规范4.7；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
