# 01 架构 Step 7：依赖方向与层间约束

> 对应正式章节：`01-架构设计.md` §8 依赖方向与层间约束  
> 当前模式：`full-restart + single-agent-serial`  
> 本步状态：`completed / stop_review`  
> 正式 `01` 写入：`false_until_step_16`

## 1. Step 状态与 Step 内计划

前序 Step 6 已通过门禁。本步只收敛本仓的架构责任层、允许与禁止的依赖方向、依赖倒置边界和全局跨仓依赖裁剪；不写接口协议、字段、数据库、源码目录、函数调用链、部署参数或实现状态机。

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 读取 Step 5~6、正式 `00` 依赖边界、架构 SOP Step 7、书写规范 §4.8 和全局依赖规则 | done | §2 |
| 回答内部层次、允许/禁止方向、外部接入、依赖类型和倒置问题 | done | §3 |
| 诊断旧 `01`、draft 和旧依赖表达中的源码/协议/第二真相污染 | done | §4 |
| 比较按源码模块、按 owner、按架构责任角色划分的方案 | done | §5 |
| 输出责任层、依赖方向图、层间约束、倒置边界 | done | §6.1~§6.4 |
| 按九个架构单元逐项停审 | done | §6.5 |
| 输出本仓跨仓依赖裁剪表、类型分类表、禁止依赖表和裁剪图 | done | §6.6~§6.9 |
| 完成跨依赖边界审计、回填草稿、pending 与三层门禁 | done | §7~§10 |

本步的“层”是架构责任层 / 依赖角色，不是源码目录、package 层、页面组件层或运行进程层。图中的箭头只表示允许成立的依赖或正式边界接入，不表示请求时序、事件传播顺序或函数调用。

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_05_bounded_context_subdomains.md` | 提供唯一核心子域、五个支撑语义和三类可失效本地影子，作为逐单元依赖停审清单。 |
| `01_arch_step_06_container_deployment.md` | 提供交互客户端、有界客户端状态承载、L0/owner 正式访问边界和诊断外部边界。 |
| `00-需求文档.md` §6、§10~§12 | 提供 `L0-core/L0-sdk` 编译期基础、L1~L4 运行期 owner、SDK-only 状态提示和禁止直连边界。 |
| `01_arch_step_04_system_context.md` | 提供各正式 truth owner、入口环境及失效姿态；不把系统上下文对象直接当作本仓层。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 7 | 规定责任层、依赖方向、依赖倒置、按架构单元停审和跨依赖审计。 |
| `standards/document/架构设计书写规范.md` §4.8 | 规定依赖方向图、层间约束表和三张跨仓裁剪表的表达粒度。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` §2、§5、§6 | 规定编译期 / 运行期 / 事件协作的分类、单仓裁剪字段及 ASCII 图格式。 |
| 旧 `01-架构设计.md`、`draft/03_模块划分与分层.md` | 仅作为 historical material 与污染审计输入，不继承 `shell/shared core/adapter` 等实现分层。 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓内部层次如何划分？ | 以“可信管理交互核心语义”“交互编排与呈现承接”“外部正式接缝”“客户端状态承载”“外围输出接缝”五类责任角色划分。九个 Step 5 架构单元映射到这些角色，但不因此形成源码模块或独立服务。 |
| 允许哪些依赖方向？ | 外部正式接缝、客户端状态承载和外围输出接缝只能按核心/承接角色定义的边界进入；交互编排与呈现承接依赖核心语义，并通过正式边界抽象使用外部结果和受限状态；核心只依赖本仓稳定的交互边界语义，不依赖编排角色、具体 owner、浏览器状态、诊断 sink 或技术介质。 |
| 禁止哪些反向依赖？ | 禁止 owner、浏览器、feature flag、诊断、缓存/草稿、其他 L5/L6 私有状态反向定义核心语义；禁止核心或本地状态直接依赖 owner 数据库、repository、服务源码或 `L0-bus`；禁止任何客户端层自行定义 Policy/Gate、权限、业务完成或 readiness。 |
| 外部系统通过哪些正式边界接入？ | 所有业务能力经 `L0-sdk` 或 owner 正式服务边界进入“外部正式接缝”角色；共享定义只通过 `L0-core` 正式契约进入；可选状态提示只能由 `L0-sdk` 封装后进入失效/重验边界；诊断与安全链接经条件化外围输出接缝离开。 |
| 本仓在全局依赖基线中涉及哪些跨仓边？ | `L0-core`、`L0-sdk` 为编译期前置（`L0-sdk` 同时承接运行期访问）；L1 identity/work/process/governance/artifact/workspace、L2 member-service、L3 method-library/capability-hub、L4 observability/archive/sandbox 均为经正式边界的运行期能力；`L0-bus` 只在 SDK 正式封装状态提示时形成间接事件协作。 |
| 哪些依赖边进入本仓架构主链，哪些被裁剪出去？ | 共享契约、官方 SDK、各 owner 的安全 query/command/result/ref 和条件化诊断进入主链；owner 源码、数据库、repository、私有 bus、内部事件 projection、其他产品私有状态、未停审产品合同和本地业务投影均裁剪出去。 |
| 进入主链的跨仓依赖分别是什么类型？ | `L0-core` 与 `L0-sdk` 的正式共享客户端语义为编译期；owner 能力为运行期；SDK 封装的失效/刷新提示为事件协作候选；Console 不直接发布或订阅业务事件。运行期和事件协作不得写成 owner 源码 package dependency。 |
| 哪些依赖必须倒置？ | owner 规则、资格、结果、状态提示、诊断接收和客户端状态介质都必须倒置到正式边界或承载角色；核心只声明需要的交互语义约束，不持有具体服务、存储、事件或 sink 的决定权。 |
| 哪些规则若不先写清最容易失控？ | 最容易失控的是把 `L1~L4` runtime 关系写成 path dependency，把 SDK/状态提示写成私有 bus 订阅，把 view/cache 当业务 truth，把菜单/角色字符串当授权，把 receipt/transport success 当完成，把多 owner 页面合并为 Console 自有治理或 readiness 引擎。 |
| 每个架构单元是否都有允许/禁止/倒置边界？ | 是。§6.5 对 Step 5 的六个语义单元和三个本地影子逐项停审；每项均有允许依赖、禁止依赖、倒置边界和正式接入方式。 |
| 是否存在反向依赖、依赖类型误判或裁剪冲突？ | 经过 §6.10 审计，未发现 unresolved 冲突。`L0-bus` 只保留 SDK 间接事件语义，L1~L4 未被写成 package dependency；仍有 exact surface、activation 和 safe-field pending，但不改变本步静态方向。 |

## 4. 当前材料与旧文档问题诊断

| 历史材料 | 问题 | 本步处置 |
|---|---|---|
| 旧 `01` 的 `shell → shared governance core → sdk adapters → server truth` 图 | 把源码/实现模块作为架构层，并暗示 Console 有 shared governance core 或 server truth 聚合。 | 改为架构责任角色图；核心只承载可信管理交互语义，owner truth 通过正式接缝进入。 |
| 旧 `01` 的 `feature slices / query adapters / export helpers` | 将页面实现和 adapter 名称直接当依赖规则，且可能把 report/export 正文归给 Console。 | 只保留“交互编排与呈现承接”“外围输出接缝”等责任角色；正式报告、证据、归档正文仍由 owner 提供。 |
| `draft/03_模块划分与分层.md` 的 presentation/application/SDK adapter 分层 | 作为未来概要/详细设计候选，粒度超过架构 Step 7，容易锁定目录和实现调用。 | 仅抽取边界意图：交互层不得绕过正式接缝；不把目录、类名或 adapter 变成正式架构层。 |
| 旧 Provider Contract、固定 control/metric 数量和统一治理核心 | 将外部能力、固定合同和数量升级为本仓语义来源。 | 删除本仓对 Provider、控制项数量、指标阈值和 readiness 的所有反向定义；保留 owner-safe 结果/引用消费。 |
| 直接订阅内部事件、维护 cursor/replay/projection 的候选 | 使 Console 成为事件投影 owner，并产生第二业务真相。 | 只允许 SDK 正式封装的状态/失效提示；收到后重验/重查，不直接连 `L0-bus`。 |
| 直接访问数据库、repository 或服务源码的便利路径 | 绕过 visibility、Policy/Gate、redaction、审计和 owner 事务。 | 作为禁止依赖写入 §6.8；没有正式 surface 时保持 read-only/blocked/unknown。 |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 维度 | 历史口径 | 本步口径 | 原因 |
|---|---|---|---|
| 层的主语 | shell、shared core、feature slice、adapter、server | 核心语义、编排承接、正式接缝、状态承载、外围输出接缝 | 让依赖方向保护真相边界，而不是描述源码组织。 |
| Console 核心 | shared governance / 多域聚合 | 可信管理交互语义 | Console 不拥有治理、权限、审计或业务 truth。 |
| owner 接入 | 可能直接连接 server/API/adapter | 统一经 `L0-sdk` 或正式服务边界 | 防止绕过 Policy/Gate 和复制服务端规则。 |
| 本地状态 | 可被理解为共享 store/cache/truth | 有界客户端状态承载，所有 owner-safe 影子可失效 | 草稿/筛选/布局可以是 Console-owned，外部结果不能变成本地 authority。 |
| 事件关系 | UI 可直接消费内部事件并投影 | 仅 SDK 正式封装提示，显式查询/回查为确认来源 | 不引入 cursor、replay、projection 或事件完成语义。 |
| 诊断/导出 | helper 可能生成报告或证据 | 外围输出接缝只承接安全诊断/link/ref；正式正文归 owner | 保持 observability/artifact/archive 真相单一。 |

### 5.2 设计取舍

| 方案 | 优点 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 按源码目录划分依赖层 | 直观，容易映射实现 | 把实现结构误当架构约束，提前锁目录和技术栈 | 不采用 |
| B. 按每个 owner 建一组 Console 内部层 | 页面与 owner 一一对应 | 复制 owner 领域语言，容易形成多份 truth 和反向规则 | 不采用 |
| C. 按五类架构责任角色划分，并将九单元逐项映射 | 能表达边界保护、倒置与技术承载，粒度适合架构阶段 | 后续概要设计仍需把角色细化为模块，但不能回写为 truth owner | 采用 |
| D. Console 直接依赖 `L0-bus` 并维护本地投影 | 状态更新可能更及时 | 引入事件消费、回放、重建和业务投影所有权 | 不采用 |
| E. 为解决多域读取新增 Console BFF/聚合仓 | 可隐藏 owner 差异 | 新增服务端 truth、规则复制和数据库/总线边界 | 不采用；若未来需要须单独 ADR 与上游授权 |

## 6. 结构化中间产物

### 6.1 架构责任层 / 依赖角色划分

| 架构责任层 / 依赖角色 | 角色类型 | 主要责任 | 允许依赖 | 依赖保护目标 |
|---|---|---|---|---|
| 可信管理交互核心语义角色 | 核心语义角色 | 定义 Console 内部必须保持的交互边界语义：正式来源优先、资格不可本地生成、unknown 不冒充完成、owner 结果不被客户端改写。 | 只依赖本仓稳定的交互语义；由编排角色依赖并向其传入按正式边界抽象表达的判定材料。 | 防止 Console 变成业务/治理/权限/审计真相 owner。 |
| 交互编排与呈现承接角色 | 编排 / 承接角色 | 组合访问语境、来源保真、受控意图/结果、管理主题和韧性/a11y 的产品交互语义。 | 可依赖核心语义、外部正式接缝和状态承载的受限交互事实。 | 防止页面组织、错误姿态或客户端状态反向改变核心语义。 |
| 外部正式接缝角色 | 外部接缝角色 | 承接 `L0-core`/`L0-sdk` 共享定义以及 L1~L4 owner 的正式查询、资格、受控意图、receipt/result/ref。 | 受核心/编排层约束；只通过正式边界进入或离开。 | 防止数据库、服务源码、私有 bus 和内部规则穿透本仓。 |
| 客户端状态承载角色 | 技术承载角色 | 承载 Console-owned 会话选择、草稿、筛选、布局、有限偏好及可失效 owner-safe 影子。 | 只能实现由核心/编排层限定的状态边界；必要时通过正式接缝获得失效依据。 | 防止状态介质升级为授权、业务结果、readiness 或正文 truth。 |
| 外围诊断与安全链接输出接缝角色 | 外部接缝角色 | 条件化输出最小客户端诊断或正式安全 link/ref。 | 只能消费已裁剪的交互事实；不得向核心注入决定。 | 防止诊断、导出、deep-link 或相邻产品私有状态成为业务主链。 |

### 6.2 依赖方向图

#### 依赖方向图：L5-console

```text
+================================================================+
|                     L5-console 依赖边界                       |
|                                                                |
|  +----------------------+      +----------------------------+  |
|  | 外部正式接缝角色     |      | 客户端状态承载角色         |  |
|  | L0-sdk / owner       |      | 交互事实与安全影子         |  |
|  +----------+-----------+      +-------------+--------------+  |
|             | 边界接入 / 允许依赖              | 允许依赖      |
|             +----------------+-----------------+               |
|                              v                                  |
|             +----------------+----------------+                 |
|             | 交互编排与呈现承接角色           |                 |
|             | 语境 / 视图 / 意图结果 / 韧性     |                 |
|             +----------------+----------------+                 |
|                              | 允许依赖                          |
|                              v                                   |
|             +----------------+----------------+                 |
|             | 可信管理交互核心语义角色         |                 |
|             | owner truth 不归 Console           |                 |
|             +---------------------------------+                 |
|                                                                |
|  +----------------------------+                                 |
|  | 外围诊断与安全链接输出接缝 |                                 |
|  | 条件化 sink / link / ref    |                                 |
|  +-------------+--------------+                                 |
|                | 仅消费安全裁剪结果 / 允许依赖                   |
|                +---------------------> 交互编排与呈现承接角色     |
|                                                                |
+================================================================+
```

图示说明：

- 箭头只表示架构上允许成立的依赖方向或正式边界接入，不表示请求时序、协议通信、事件传播或代码调用链。
- 核心语义角色位于最内层；外部正式接缝和技术承载只能受其边界约束，不能反向定义 owner truth 或交互完成语义。
- 客户端状态承载是有界技术角色，状态可以被编排层使用，但不能让状态介质成为授权或业务真相来源。
- 外围诊断与链接接缝只消费已裁剪结果，缺失或失败不改变核心交互语义。

### 6.3 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 可信管理交互核心语义角色 | 只依赖本仓稳定交互语义；允许被交互编排与呈现承接角色依赖，并接收按正式边界抽象表达的判定材料。 | 禁止依赖编排角色、任一 L1/L2/L3/L4 owner、浏览器状态、feature flag、诊断 sink、缓存、数据库、repository、`L0-bus` 或其他 L5/L6 私有状态。 | 核心只保护 Console 自有交互语义，不拥有外部领域规则；传入材料不构成对其具体来源的反向依赖。 |
| 交互编排与呈现承接角色 | 依赖核心语义、外部正式接缝返回的 owner-safe 结果/资格/receipt/ref，以及状态承载中的 Console-owned 交互事实。 | 禁止直连 raw transport、owner 内部规则、私有事件、未裁剪正文，或用 UI 组合结果替代正式决定。 | 承接层可以组织呈现，但不能重定义来源、资格、结果或 readiness。 |
| 外部正式接缝角色 | 依赖核心/编排层规定的边界语义，并经 `L0-sdk` 或正式服务边界接入 L0/L1~L4。 | 禁止把 owner 服务源码、数据库、repository、私有 API、私有 bus 或未核验合同带入本仓；禁止把运行期关系写成 package dependency。 | 该角色只承接正式能力，不复制服务端规则或真相。 |
| 客户端状态承载角色 | 依赖核心/编排层定义的状态用途和安全上限；可保存 Console-owned 草稿、筛选、布局、有限偏好及 owner-safe snapshot/ref。 | 禁止保存 forbidden body、credential/secret、永久授权、正式业务对象、幂等依据、审计/证据正文、readiness 或跨 owner 业务 projection。 | 介质和生命周期仍 pending，但任何介质都不能升级状态权威级别。 |
| 外围诊断与安全链接输出接缝角色 | 依赖已被编排层裁剪的最小诊断字段和正式安全 link/ref；可条件化向正式接收方输出。 | 禁止决定权限、业务状态、审计/evidence verdict、完成/失败，或把诊断回流成主链事实；禁止向未停审产品发送私有状态。 | 诊断和链接是外围输出，sink 缺失不得阻断核心安全语义。 |

### 6.4 依赖倒置边界

| 需要倒置的关系 | 不能直接依赖的对象 | 倒置后的正式边界 | 保护的语义 |
|---|---|---|---|
| 交互核心需要 owner 结果 | owner 领域服务、数据库、repository、内部规则 | 外部正式接缝提供已声明来源与状态上限的安全结果/引用 | owner truth、Policy/Gate 和 redaction 仍归 owner。 |
| 编排层需要访问/资格判断 | 本地角色字符串、菜单配置、feature flag、本地 RBAC | `L0-sdk`/正式 owner 的语境、visibility、资格和 Policy/Gate 结果 | 客户端只能收紧，不得生成 allow。 |
| 受控意图需要提交与回查 | 本地副作用、刷新成功、transport receipt 推导 | 正式 owner command/result/ref/reconciliation 边界 | accepted/pending/unknown 不被改写为 committed。 |
| 视图需要刷新或失效 | 直接订阅 `L0-bus`、自建 cursor/replay | SDK 正式封装的提示，或显式 query/revalidation | 不建立 Console 业务 projection 或第二 truth。 |
| 状态需要保存 | 固定存储产品、共享缓存或业务数据库 | 有界客户端状态承载；介质/TTL/跨设备待后续合同决定 | 草稿/偏好可连续，外部正文和授权不可持久化。 |
| 诊断需要上送 | 本地审计、evidence 生成、未裁剪日志旁路 | 条件化安全诊断接缝和最小字段裁剪 | 诊断不成为 audit/evidence、合规或业务决定。 |
| 相邻产品需要跳转 | 其他 L5/L6 私有 UI 状态或未停审 API | 未来正式 link/ref 合同；当前保持 pending | 不形成跨产品私有状态依赖。 |

### 6.5 按架构单元的依赖规则与停审

| 架构单元 | 允许依赖 | 禁止依赖 | 倒置边界 / 外部接入 | 停审结论 |
|---|---|---|---|---|
| 可信管理交互编排 | 作为核心语义被交互编排与呈现承接角色依赖；只处理本仓稳定不变量和按正式边界抽象表达的判定材料。 | 不得依赖承接角色、具体 owner、数据库、私有事件、页面状态，或把任一 owner 主题升格为本地核心。 | 外部正式接缝向承接层提供结果/资格/引用，再以抽象材料进入核心判断；核心不感知具体来源。 | `pass`：核心唯一、方向朝内、无承接层反向依赖或外部 truth 侵入。 |
| 访问语境与导航 | 依赖正式语境/资格引用、核心安全姿态、Console-owned 导航和当前交互选择。 | 不得依赖 credential 解析、本地 RBAC、角色字符串、URL/缓存推导授权，或由导航决定可见性。 | 语境与资格经正式接缝进入；不可验证时由核心规则收紧。 | `pass`：session 壳与 authorization truth 已分离。 |
| 来源保真视图 | 依赖 owner-safe 结果/引用、来源标识和多轴状态呈现语义。 | 不得直接读 owner 存储、合并不同 owner 为完整/一致 verdict、压平 partial/stale/unavailable。 | owner 查询通过正式接缝；本地视图影子只作可失效呈现材料。 | `pass`：view 不升级为 truth/readiness。 |
| 受控意图与结果 | 依赖正式资格、owner command receipt/result/ref、Console-owned 草稿和请求经历。 | 不得自行校验领域规则、决定幂等、把 accepted/transport success 当完成、自动重放 unknown。 | 受控意图经正式接缝提交；结果未知时只走正式回查或保持 unknown。 | `pass`：副作用和终态均由 owner 保持。 |
| 管理主题组织 | 依赖 owner 分区的安全视图、核心导航姿态和支撑交互语义。 | 不得定义员工、项目、流程、治理、制品、能力、观测、归档或 sandbox 规则，不得制造跨域聚合 truth。 | 每个主题通过正式接缝独立进入；Workspace/相邻产品只按已闭口合同接入。 | `pass`：主题组织不变成领域模型。 |
| 韧性与可访问交互 | 依赖各支撑单元的正式状态、局部失败边界、核心安全语义和入口环境能力。 | 不得用视觉成功、诊断信息、a11y fallback 或重试按钮覆盖 owner 状态；不得放宽权限或自动重放未知副作用。 | 状态解释/恢复从核心与接缝取得；诊断 sink 仅为旁路。 | `pass`：恢复可收紧/重验，不改写 truth。 |
| 正式语境与资格引用 | 依赖正式 owner/SDK 返回的最小安全 snapshot/ref。 | 不得成为 identity、scope、Policy/Gate 或永久授权缓存，不得由本地过期值继续放行。 | 由正式接缝输入；撤销、冲突、过期即失效或收紧。 | `pass`：引用不成为授权 owner。 |
| owner-safe 视图影子 | 依赖 owner 正式查询结果及来源/状态上限。 | 不得保存 forbidden body、隐藏正文、跨 owner projection、cursor/replay/rebuild 或离线替代 truth。 | 通过状态承载保存可失效安全影子；提示仅触发重查。 | `pass`：影子只服务呈现。 |
| 正式请求与结果引用 | 依赖 owner receipt/result/ref/reconciliation 和 Console 请求经历。 | 不得保存正式业务对象、审批/审计/证据正文、幂等依据，或从本地状态推导 committed。 | 由正式接缝输入；unknown 无正式回查时保持 unknown/blocked。 | `pass`：引用不成为业务结果 owner。 |

逐单元停审结论：九个单元均明确允许依赖、禁止依赖和倒置边界；没有把 `adapter`、`repository`、`handler` 或源码目录当作架构层，也没有把运行期 owner 关系误写成 package dependency。上述 `pass` 仅表示依赖方向静态校准通过，不表示任何 exact contract、集成或实现已完成。

### 6.6 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L5-console` 的共享契约来源 | 依赖方 | 编译期依赖 | 是 | 只消费正式共享安全引用、错误和关联语境定义；不引入业务服务源码。 |
| `L0-sdk` | L5 产品通过 SDK 访问 L1~L4 | 依赖方 / 官方访问边界 | 编译期 + 运行期依赖 | 是 | 是所有业务 query、受控意图、result/ref 和正式错误的统一接入边界。 |
| `L1-identity` | L5-console 运行期消费管理能力 | 依赖方 | 运行期依赖 | 是 | 提供 actor/member 语境和人员安全结果；不能成为 Console 源码依赖。 |
| `L1-work` | L5-console 运行期消费管理能力 | 依赖方 | 运行期依赖 | 是 | 提供项目/工作安全视图与正式受控入口；业务 truth 仍归 work。 |
| `L1-process` | L5-console 运行期消费管理能力 | 依赖方 | 运行期依赖 | 是 | 提供过程/活动安全视图；不由页面推导流程 readiness。 |
| `L1-governance` | L5-console 运行期消费治理能力 | 依赖方 | 运行期依赖 | 是 | 提供 visibility/Policy/Gate/治理决定；Console 不复制规则。 |
| `L1-artifact` | L5-console 运行期消费制品能力 | 依赖方 | 运行期依赖 | 是 | 提供安全 artifact/evidence 引用；正文、血缘和版本 truth 不进入本仓。 |
| `L1-workspace` | L5-console 运行期消费跨域安全视图 | 条件依赖方 | 运行期依赖 | 条件进入 | safe read/export 和写入口未完全闭口；不得成为唯一聚合前置。 |
| `L2-member-service` | L5-console 运行期消费成员宿主管理能力 | 条件依赖方 | 运行期依赖 | 是，按成员宿主主题进入 | 提供宿主/生命周期安全结果；不拥有 identity truth，也不进入源码 path。 |
| `L3-method-library` | L5-console 运行期消费方法资产能力 | 依赖方 | 运行期依赖 | 是 | 提供方法目录/版本和正式管理结果；精确 command/activation pending。 |
| `L3-capability-hub` | L5-console 运行期消费能力管理能力 | 依赖方 | 运行期依赖 | 是 | 提供 registry/exposure/access-review 安全状态；不推导 capability readiness。 |
| `L4-observability` | L5-console 运行期消费观测/审计能力 | 依赖方 / 条件输出接收方 | 运行期依赖 | 是，查询主链；诊断条件进入 | 正式 audit/metric/report truth 归 owner；诊断合同未闭口。 |
| `L4-archive` | L5-console 运行期消费归档/恢复能力 | 条件依赖方 | 运行期依赖 | 是，状态视图进入；正向管理受阻 | activation/contract 未闭口前保持 read-only/blocked/unknown。 |
| `L4-sandbox` | L5-console 运行期消费隔离/运行/清理能力 | 条件依赖方 | 运行期依赖 | 是，安全状态进入；正向入口按合同 | Console 不执行 sandbox，也不由状态组合 readiness。 |
| `L0-bus` | 全局事件协作主干 | 非直接依赖方 | 事件协作依赖（仅经 `L0-sdk` 封装） | 否（不直接进入） | Console 不直连 bus，不维护 cursor/replay/projection；只有 SDK 正式提示可触发重验。 |
| 其他未停审 `L5/L6` | 产品/生态并行窗口 | 未来链接/引用协作方 | 条件运行期 / 待定 | 否 | 不消费私有状态、不成为主链前置；只有未来正式 link/ref 合同可进入。 |

### 6.7 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 消费共享安全引用、错误和关联语境的正式契约。 | `02` 概要设计、`03` 详细设计、`07` 实施计划的 package 边界。 |
| 编译期依赖 | `L0-sdk` | 消费官方客户端语义与正式访问封装；不引入任何 owner 源码。 | `02` 访问承接、`03` adapter/port 合同；具体 package 仍待合同。 |
| 运行期依赖 | `L0-sdk` | 经官方 SDK 获取正式语境、资格、owner query、受控意图、receipt/result/ref 和错误语义。 | `01` 关键交互与技术机制；`02/03` 运行期边界。 |
| 运行期依赖 | `L1-identity`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact`、`L1-workspace` | 按管理主题消费 owner-safe 查询、资格/决定、结果和安全引用；不复制规则。 | `02/03` 外部边界与 view/command 承接；exact surface pending。 |
| 运行期依赖 | `L2-member-service`、`L3-method-library`、`L3-capability-hub` | 消费人员宿主、方法资产和能力管理安全状态/引用；受控入口只在 owner 正式开放时启用。 | `02/03` 主题边界与条件化受控意图。 |
| 运行期依赖 | `L4-observability`、`L4-archive`、`L4-sandbox` | 消费审计/指标、归档/恢复、隔离/运行/清理的正式状态和引用；不生成 report/evidence/readiness。 | `02/03` 只读/blocked/partial 边界；activation pending。 |
| 事件协作依赖 | `L0-bus`（仅由 `L0-sdk` 正式封装） | 只接收可选失效/刷新提示；提示后显式 query/revalidation，不保存事件投影。 | `01` 关键交互 / `05` 测试语义；不得写成直接 bus package dependency。 |
| 条件外围运行期依赖 | `L4-observability` 或未来正式诊断/链接接收方 | 只输出最小、无 forbidden body 的交互诊断或安全 link/ref；不输出业务事件。 | `01` 横切约束；合同未闭口前保持 pending。 |

分类结论：本仓没有直接事件发布/订阅主链，没有 owner 源码 package dependency，也没有以 Console UI 状态供其他项目消费的业务下游。编译期仅允许正式共享契约和官方 SDK；运行期与事件协作均必须通过正式边界表达。

### 6.8 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L5-console → 任一 L1/L2/L3/L4 数据库、repository 或服务源码` | 绕过 owner truth、visibility、Policy/Gate、redaction、审计和事务边界。 | 经 `L0-sdk` 或 owner 正式服务 query/command/result/ref。 |
| `L5-console → L0-bus` 直接事件订阅 | 会引入私有事件语义、cursor/replay/projection 和第二 truth。 | 仅消费 `L0-sdk` 正式封装的失效/状态提示；收到后重查。 |
| `L5-console → L1/L2/L3/L4` 的 package/path dependency | 将运行期能力误写成编译期源码关系，形成跨仓耦合。 | 将关系分类为运行期，经正式服务/SDK 接入。 |
| `可信管理交互核心 → owner 规则、Policy/Gate、权限实现` | 让 Console 复制领域/治理规则并成为第二决定源。 | 由正式 owner 给出可消费决定，客户端只呈现和收紧。 |
| `访问语境与导航 → 本地 RBAC、角色字符串、URL/缓存授权` | 客户端状态无法证明正式资格，可能越权披露或提交。 | 依赖正式 actor/scope/visibility/qualification，并在 unknown 时 fail-closed。 |
| `来源保真视图 → 跨 owner 完整/一致/readiness 聚合` | 将局部快照和缺失数据伪装为联合业务结论。 | 按 owner 分区呈现 source/freshness/coverage/availability/consistency。 |
| `受控意图与结果 → 本地幂等、自动重放或刷新成功` | 本地无法证明副作用是否已提交，可能重复执行。 | 使用正式 receipt/result/ref/reconciliation；未知时保持 unknown。 |
| `管理主题组织 → 员工/项目/流程/治理/制品/能力/观测/归档/sandbox truth` | 页面组织反向拥有外部领域模型，造成责任重叠。 | 只组织 owner-safe 视图与正式引用。 |
| `客户端状态承载 → forbidden body、credential、secret、永久授权或正式正文` | 扩大泄露面并把临时状态升级为 truth。 | 只保存 Console-owned 交互事实和最小可失效安全影子。 |
| `外围诊断/链接接缝 → 核心权限、业务结果、audit/evidence verdict` | 诊断和链接不是决定源，可能形成侧门或伪证据。 | 只输出/接收最小安全材料，失败时业务语义不变。 |
| `L5-console → 未停审 L5/L6 私有状态或内部 API` | 相邻产品尚未形成可引用真相，容易形成循环依赖。 | 等正式 link/ref 合同；当前标记 pending。 |

### 6.9 依赖裁剪图

#### 依赖裁剪图: L5-console

```text
Global baseline
  |
  | crop only related edges
  v
+-------------------------+
|       L5-console        |
| client management UI    |
+----+----+----+-----+----+
     |    |    |     |
     |    |    |     +---- [runtime] ----> L4-observability /
     |    |    |                          L4-archive / L4-sandbox
     |    |    +--------- [runtime] ----> L1/L2/L3 owner APIs
     |    +-------------- [runtime] ----> L0-sdk access boundary
     +------------------- [compile] ----> L0-core / L0-sdk

L0-bus
     |
     | [event] only through formal L0-sdk notification
     v
L5-console (revalidate / invalidate; no direct subscription)

L5/L6 pending products
     |
     | [runtime] future formal link/ref only
     v
L5-console
```

图示说明：

- 本图只展示 `L5-console` 相关依赖，不展示全 27 仓。
- `[compile]` 表示可进入后续 package dependency 讨论；`[runtime]` 和 `[event]` 不得写成 owner 源码依赖。
- L1/L2/L3/L4 运行期边界由 `L0-sdk`/正式服务承接；`L0-bus` 只通过 SDK 正式提示间接协作，不是 Console 的直接事件主链。
- 未停审 L5/L6 只保留未来正式 link/ref 候选，不把私有状态或未确认 API 写入当前主链。

### 6.10 跨依赖边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在外部角色反向定义核心语义 | pass | owner、浏览器、诊断、状态承载和相邻产品均被限制在边界角色，不能决定 Console 核心不变量。 |
| 是否把运行期依赖误写成编译期依赖 | pass | L1~L4 均为运行期；只有 `L0-core/L0-sdk` 进入编译期候选。 |
| 是否把事件协作误写成直接 bus 依赖 | pass | `L0-bus` 仅作为 SDK 封装的可选提示来源，Console 无直接订阅、cursor、replay 或 projection。 |
| 是否有 owner truth / 本地影子冲突 | pass | 三类本地影子均可失效、按 owner 分区、不保存正文，不承担授权、结果或 readiness。 |
| 是否存在跨 owner 聚合真相 | pass | 管理主题组织只组合安全呈现，不生成跨 owner verdict、合规或完整性结论。 |
| 是否存在命令完成语义反向依赖 | pass | receipt/accepted/transport 与 owner committed result 分离；unknown 不能被刷新或 toast 覆盖。 |
| 是否存在诊断/链接侧门 | pass | 诊断和 link/ref 只消费安全裁剪结果，不能授予权限或改写业务结果。 |
| 是否继承旧 adapter/repository/handler 作为层规则 | pass | 仅使用架构责任角色；实现名词未作为正式层或反向约束。 |
| 是否将其他 L5/L6 未停审内容当真相 | pass | 统一裁剪为 pending 的未来正式 link/ref，不进入当前主链。 |
| 上游 exact contract/activation pending 是否被伪装为已集成 | pass | 所有未闭口正向面保持 conditional/read-only/blocked/unknown；未写 integrated/ready。 |
| 对 Step 8 的承接是否清晰 | pass | Step 8 可继续区分 Console-owned 交互事实、owner-safe snapshot/ref、forbidden body 和失效/一致性策略。 |

## 7. 复杂度判断

本步用五类架构责任角色表达方向，用九个 Step 5 单元逐项停审，用三张固定裁剪表承接十四个正式依赖边界及一个间接事件协作边界。没有按八个管理主题重复建层，也没有把各 owner 的源码、数据库或内部 bus 画入本仓架构；这样可以保持依赖图在规范建议的 4~8 个对象范围内，同时不丢失逐 owner 的裁剪理由。后续 `02/03` 可以在这些责任边界内定义模块和 adapter/port 合同，但不能把本步的角色名倒写成实现目录或把运行期关系改成 package dependency。

## 8. 正式 §8 回填草稿（Step 16 才写入）

> 校准来源：
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
> - `design-calibration/01_arch_step_04_system_context.md`
> - `design-calibration/01_arch_step_05_bounded_context_subdomains.md`
> - `design-calibration/01_arch_step_06_container_deployment.md`
> - `design-calibration/01_arch_step_07_dependency_direction.md`
> - `standards/document/全局项目依赖关系与裁剪规则.md` §5~§6

正式 §8 应承接本文件 §6.1 的五类架构责任角色、§6.2 的依赖方向图、§6.3 的层间约束表、§6.4 的倒置边界、§6.6~§6.9 的跨仓裁剪结果，并保留以下不可删减的主线：

1. 核心语义只属于“可信管理交互”，不属于任何外部业务/治理 owner。
2. 所有业务能力经 `L0-sdk` 或正式服务边界进入；L1~L4 运行期关系不得写成源码 package dependency。
3. Console 不直接依赖 `L0-bus`，不维护业务事件 projection/cursor/replay，不输出业务事件 truth。
4. 客户端状态承载只能保存 Console-owned 交互事实和可失效安全影子；不能保存 forbidden body、永久授权、业务结果或 readiness。
5. 访问语境、来源、意图/结果、主题组织、韧性/a11y 均需遵守逐单元的禁止反向依赖和 fail-closed/unknown 边界。

正式正文不得增加旧文档的 shared governance core、Provider Contract、固定控制项数量、技术框架、数据库、内部服务目录、API path、事件名、缓存参数或实现 readiness。

## 9. 待确认事项

| 待确认项 | 本步处理 | 当前状态 |
|---|---|---|
| `CON-Q-034~043` owner exact query/command/result/ref、scope/visibility、safe-field | 不改变依赖方向；相关正向面保持 `pending/blocked/read-only`，不会因本步写成已集成。 | `open / blocks exact boundary only` |
| `CON-Q-044` 客户端状态介质、生命周期、TTL、跨设备范围 | 只固定状态承载的责任和安全上限，不选择内存/会话/持久产品。 | `open / non-blocking for direction` |
| `CON-Q-045` 性能、可用率、负载 authority | 不以量化指标拆分 Console 依赖层或部署；后续横切与技术选择处理。 | `open / non-blocking for direction` |
| `CON-Q-046` 浏览器/a11y/诊断 envelope | 外围输出接缝保持条件化，禁止诊断反向决定主链。 | `open / non-blocking for direction` |
| `CON-Q-047` 未停审 L5/L6 的 deep-link / link/ref 合同 | 统一裁剪为未来正式合同，不进入当前主链或私有状态依赖。 | `open / pending` |
| `L0-sdk` 是否提供正式状态提示 | 没有提示时仍以显式 query/revalidation 成立；有提示也只能触发重验。 | `open / non-blocking` |

本步没有阻塞 Step 8 的新问题；exact contract、activation 和状态介质仍作为后续数据所有权/一致性策略的输入，不被本步提前闭合。

## 10. 自检、三层门禁与进入 Step 8 条件

### 10.1 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确内部架构责任层和依赖角色 | pass | 五类角色及其责任、依赖和保护目标已列明。 |
| 是否明确允许和禁止依赖方向 | pass | 图和层间约束表共同表达；箭头不表示调用顺序。 |
| 是否说明外部正式接入和依赖倒置 | pass | SDK/正式服务、状态承载、诊断和链接均有倒置边界。 |
| 是否按九个架构单元逐项停审 | pass | §6.5 每个单元都有允许、禁止、倒置和结论。 |
| 是否完成全局依赖裁剪三张表 | pass | §6.6~§6.8 使用固定字段并区分 compile/runtime/event。 |
| 是否完成固定格式依赖裁剪 ASCII 图 | pass | §6.9 标题、类型标记和 2~5 条说明齐全。 |
| 是否误把运行期/事件协作写成 package dependency | pass | L1~L4 runtime，L0-bus indirect event，未写 owner path dependency。 |
| 是否直连数据库、repository、私有 bus 或服务源码 | pass | 均列为禁止依赖；正式边界是唯一主链。 |
| 是否维护 owner truth、forbidden-body 和 unknown 边界 | pass | 本地影子不存正文、不做授权/结果/readiness，unknown 不重放。 |
| 是否把 adapter/repository/handler/目录写成架构规则 | pass | 只作为历史污染审计或后续承接名词，未作为本步层次。 |
| 是否伪造 integrated、baseline、测试、evidence、signoff 或 readiness | pass | 未出现实现、测试或就绪事实；所有未闭口合同仍 pending。 |
| 正式 `01` 是否被提前写入 | pass | 仅创建本 Step 校准文件。 |

### 10.2 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 五类责任角色、允许/禁止方向、倒置边界、九单元停审和跨依赖审计均完成，无 unresolved 反向依赖。 | 更新 flow 与项目台账，激活 Step 8。 |
| 文档级 | `pass_to_step_8` | 正式 §8 回填基础、跨仓三表和裁剪图已形成；正式 `01` 继续等待 Step 16。 | 创建并完成 `01_arch_step_08_data_ownership_consistency.md`。 |
| 项目级 | `pass_with_open_contracts` | exact owner contract、状态介质、activation、性能和相邻产品 link/ref 仍 pending，但不阻塞数据所有权与一致性策略校准。 | 进入 Step 8；不修改正式 `01`，不进入 `02`。 |

本步 `pass` 只表示设计静态校准通过，不表示实现、测试、集成、用户 signoff 或 readiness 已发生。
