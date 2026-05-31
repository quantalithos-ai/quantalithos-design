# Step 9. 关键交互与通信方式

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 9
- 回填章节：`projects/L0-sdk/01-架构设计.md` §10 关键交互与通信方式

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.10 关键交互与通信方式
  - `standards/document/架构设计讨论流程_SOP.md` Step 9
  - `projects/L0-sdk/00-需求文档.md` §6 使用方与依赖 / §7 核心能力闭环 / §12 接口与依赖
  - `projects/L0-sdk/design-calibration/01_arch_step_04_system_context.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_06_container_deployment.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_07_dependency_direction.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_08_data_ownership_consistency.md`
- 已确认结论：
  - `L0-sdk` 不部署为独立线上 gateway，而是随 caller runtime 嵌入运行。
  - `L0-core` / `L0-bus` 是直接稳定上游 truth，SDK 不重新定义 core / bus truth。
  - L1/L2/L3/L4 formal APIs 是运行期封装目标，不是 SDK 源码依赖或业务 truth。
  - fake / fixture endpoint、validation runner、docs runner 和 package candidate 是当前 P0 可验证接入的重要边界。
  - SDK truth 内部在 candidate / verified / stable 边界强一致；上游快照最终一致并显式标记 stale / pending / unsupported。
  - 本 Step 只讨论交互类别与边界理由，不写 API 路径、事件名、DTO、schema、时序细节或技术选型。

### 3. SOP 问题回答

1. 哪些交互适合同步能力边界？

   回答：下游 caller runtime 通过 SDK 访问正式服务能力、读取明确状态或得到即时失败结论时，适合同步请求 / 响应类交互。该场景要求在调用边界上返回成功、失败、unsupported 或 unavailable，不适合伪装成后台完成。

2. 哪些交互适合异步事件？

   回答：下游 caller runtime 通过 SDK 使用事件客户端视图，围绕已经由 `L0-bus` 定义的事件语义进行发布、订阅、结果送达或失败感知时，适合异步事件 / 回调类交互。SDK 只提供客户端语义视图，不拥有 bus delivery、retry、dead-letter、replay 或 tap truth。

3. 哪些交互适合后台任务或补偿路径？

   回答：上游契约 / 事件语义到 SDK 语言视图的对齐、package candidate 生成与验证、quickstart / docstring / examples 验证、下游反馈进入 SDK 演进边界，都适合后台任务 / 延后承接类交互。这些场景不要求在 caller 的业务同步边界内立即完成。

4. 哪些交互必须经过总线或正式边界，不能直接穿透？

   回答：服务能力访问必须经过 L1/L2/L3/L4 formal API 或 fake / fixture 验证边界，不能源码穿透服务仓；事件能力必须经过 `L0-bus` 语义边界，不能由 SDK 自定义 bus runtime；共享契约、Error、Trace、metadata 必须经过 `L0-core` truth，不能由 SDK 私造 schema。

5. 关键依赖失效时，本仓如何降级或挂起？

   回答：formal API 不稳定时对应 client 不进入 stable 证明链；bus 语义不稳定时事件 client 保持挂起、fake 或 stub 边界；core / bus 快照过期时标记 stale / pending；验证 runner 或 fake endpoint 不可用时 candidate 不得标记 verified；下游反馈未经审查不得直接改写 SDK truth。

6. 哪些通信口径若不先写清，后续最容易误入协议细节？

   回答：最容易误入细节的是把服务访问直接写成某种协议选型、把事件 client 写成 bus runtime、把 candidate 验证写成 CI 工具链、把上游契约对齐写成 codegen 实现、把下游消费反馈写成运行时自动变更。本 Step 必须停留在通信方式类别和边界语义。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6.3 通信方式与选择理由 | 旧文档直接写 `wrapper -> service` 的具体协议候选 | 过早进入技术选型，缺少同步能力边界的架构判断 |
| §6.3 通信方式与选择理由 | 旧文档把 `wrapper -> bus` 简化为订阅 API 封装 | 没有说明事件交互必须服从 `L0-bus` 语义，容易把 SDK 写成 bus runtime |
| §4 / §6 | 旧文档未把 fake / fixture endpoint、validation runner、docs runner 作为关键交互边界 | 当前 P0 的可验证接入、quickstart 和 candidate 证据链不清楚 |
| §7 / §8 | 旧文档把 codegen、binding、examples 写成依赖和数据主线 | 容易把生成 / 验证工具链误写成通信方式或架构 truth |
| 全文 | 旧文档缺少关键依赖失效时的挂起和降级口径 | 后续实现可能用默认成功、自动补造 schema 或隐式 fallback 掩盖失败 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 交互主语 | wrapper、service、bus、CI、registry | caller runtime、SDK、formal APIs、bus semantic boundary、candidate validation、downstream feedback | 架构层应表达正式边界，不表达工具链对象 |
| 通信方式 | 直接写具体协议候选 | 先收敛同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接三类 | 技术选择后移到 Step 10 |
| 服务访问 | wrapper 调 service | caller runtime 通过 SDK 访问 formal API / fake 边界 | 保护 SDK 不是 gateway 或服务源码依赖 |
| 事件访问 | 订阅 API 封装 | SDK 只提供 `L0-bus` 语义下的事件客户端视图 | 防止 SDK 拥有 bus runtime truth |
| 验证交互 | CI / examples 附带出现 | candidate、smoke、docs runner、fake target 作为独立后台验证交互 | 当前 P0 需要可验证接入证据 |
| 失败口径 | 发版失败、mock、rollback | explicit failure、stale / pending、unsupported、not verified、pending review | 与数据归属和一致性策略一致 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧文档，直接写具体协议和 wrapper 调用关系 | 实现直觉强 | 提前进入技术选型，无法表达验证和事件边界 | 不采用 |
| 方案 B：按关键交互场景先判断同步、异步、后台延后三类通信方式 | 边界清晰，可承接 Step 10 技术选型和后续概要设计 | 需要后续文档再落具体 API / 协议 / runner | 采用 |
| 方案 C：把所有 SDK 使用都写成同步请求 / 响应 | 简单 | 会把事件传播、candidate 验证和下游反馈硬塞进同步闭环 | 不采用 |
| 方案 D：把所有能力都写成异步事件 | 统一 | 服务能力即时失败、client 调用结果和验证门禁无法清楚表达 | 不采用 |
| 方案 E：把交互全部后移到详细设计 | 避免当前争议 | 架构层无法约束边界，后续容易串仓 | 不采用 |

### 7. 结构化中间产物

#### 7.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 下游调用方通过 SDK 访问正式服务能力 | caller runtime ↔ embedded SDK ↔ L1/L2/L3/L4 formal API 或 fake / fixture 边界 | 在调用边界上得到明确能力结果、状态判断或失败结论 | 这是 SDK 最基本的客户端能力交互，不是服务端 gateway，也不是源码依赖服务仓。 |
| 下游调用方通过 SDK 使用事件客户端视图 | caller runtime ↔ SDK event client ↔ `L0-bus` semantic boundary | 让调用方按官方 SDK 口径使用事件发布、订阅、结果送达或失败感知 | 事件语义来自 `L0-bus`，SDK 只提供客户端视图，不拥有 delivery truth。 |
| SDK 对齐上游契约与事件语义 | SDK contract consumption boundary ↔ `L0-core` / `L0-bus` truth | 让 SDK 语言视图和客户端语义可追溯上游稳定版本 | 这是候选生成和一致性前提，不是运行期调用方业务交互。 |
| SDK 验证 package candidate 与文档示例 | validation / docs runner ↔ package candidate ↔ fake / fixture target | 证明 candidate、quickstart、docstring 和示例在受控边界中可运行 | 这是验证交互，不是生产服务调用，也不是公共注册表发布前置。 |
| 下游消费方加载和使用 SDK package | package candidate ↔ product / runtime / automation / integration caller | 让下游以官方 client 语义接入平台能力 | 下游消费不反向拥有 SDK truth，消费失败只影响验证范围或兼容反馈。 |
| 下游反馈进入 SDK 演进边界 | downstream consumer feedback ↔ SDK change governance boundary | 将使用问题、兼容问题或集成发现纳入后续 SDK 变更判断 | 反馈是演进输入，不是运行时自动修改 SDK truth 的通道。 |

#### 7.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 下游调用方通过 SDK 访问正式服务能力 | 同步请求 / 响应类交互 | 不宜以异步事件或后台任务作为主路径 | 返回明确失败、unsupported 或 unavailable，不写入 SDK truth，不伪装成功 | 调用方需要即时知道本次能力访问是否成立。 |
| 下游调用方通过 SDK 使用事件客户端视图 | 异步事件 / 回调类交互 | 不宜伪装为同步服务调用闭环，不宜后台私自完成 | 保持未送达、挂起、fake / stub 或明确失败，不补造 bus delivery truth | 该场景本质是事件语义的客户端消费和结果送达。 |
| SDK 对齐上游契约与事件语义 | 后台任务 / 延后承接类交互 | 不宜在 caller runtime 同步调用中临时决策，不宜由下游反馈直接改变 | 标记 stale / pending / unsupported，阻断 candidate 稳定结论 | 上游 truth 到 SDK 快照可以最终一致，但必须可追溯版本。 |
| SDK 验证 package candidate 与文档示例 | 后台任务 / 延后承接类交互 | 不宜伪装为生产同步请求或发布渠道状态 | candidate 不得标记 verified，示例不得标记 runnable，证据引用保持 missing / invalid | 该场景服务于验证门禁，不服务于线上业务收口。 |
| 下游消费方加载和使用 SDK package | 同步请求 / 响应类交互 | 不宜通过下游私有封装绕过 SDK 语义，不宜把消费行为写成 SDK truth | 失败进入兼容或验证反馈，不反向改变 SDK 语义核心 | SDK 作为嵌入式 client 被消费时，需要给调用方明确使用结果。 |
| 下游反馈进入 SDK 演进边界 | 后台任务 / 延后承接类交互 | 不宜运行时自动 mutation，不宜由单个消费者直接定义 SDK truth | 反馈保持 pending、accepted 或 rejected，待正式变更流程收口 | 下游反馈有价值，但必须经过 SDK 变更边界。 |

#### 7.3 简化交互示意图

```text
+----------------------------+
| downstream caller runtime |
+-------------+--------------+
              |
              | 同步请求 / 响应
              v
      +-------+--------+
      |     L0-sdk     |
      | embedded client|
      +---+--------+---+
          |        |
          |        | 异步事件 / 回调
          |        v
          |  +-----+----------------+
          |  | L0-bus semantic      |
          |  | event client boundary|
          |  +----------------------+
          |
          | 同步请求 / 响应
          v
+---------+----------+
| formal API / fake  |
| service boundary   |
+--------------------+

后台任务 / 延后承接:
  L0-core / L0-bus truth -> SDK snapshot / candidate
  package candidate -> validation / docs evidence
  downstream feedback -> SDK change boundary
```

图示说明：

- 图中同步箭头只表达 caller 使用 SDK 时需要即时收口的能力访问，不表达具体协议或 API 路径。
- 图中异步箭头只表达事件客户端视图必须服从 `L0-bus` 语义，不表达 topic、event name 或 delivery 实现。
- 后台任务 / 延后承接用于契约对齐、candidate 验证和反馈治理，不应被塞进 caller 的同步业务调用。
- fake / fixture boundary 只用于受控验证，不拥有生产业务 truth。

#### 7.4 边界说明短文

`L0-sdk` 的关键交互必须围绕客户端接入层边界收敛：调用方访问正式服务能力时需要同步结果，使用事件能力时应服从 `L0-bus` 的异步语义，契约对齐、candidate 验证和反馈治理则应延后承接。这样的通信方式划分不是为了实现方便，而是为了保护 core / bus / 服务仓 truth 不被 SDK 重新定义。凡是通信失败或依赖未稳定，SDK 应显式失败、挂起或标记 stale / pending / unsupported，而不是补造上游事实或把验证材料当成生产 truth。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §10 “关键交互与通信方式”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 服务能力访问是否以同步请求 / 响应作为主口径 | A. 同步收口;B. 异步事件主导;C. 后台延后承接 | A | caller 需要即时得到本次能力访问结果或明确失败 | 已确认采用 A |
| 事件客户端视图是否必须服从 `L0-bus` 语义 | A. 必须服从;B. SDK 自定义事件 runtime;C. 按语言自定义 | A | `L0-bus` 是事件语义 truth，SDK 不能形成第二套 delivery truth | 已确认采用 A |
| 契约对齐和 candidate 验证是否进入 caller 同步边界 | A. 进入;B. 不进入，作为后台 / 延后承接;C. 保留待定 | B | 这些是构建、验证和治理边界，不属于业务调用即时收口 | 已确认采用 B |
| 下游反馈是否可以直接改变 SDK truth | A. 可以;B. 不可以，必须进入变更边界;C. 由消费者决定 | B | SDK truth 不能被单个下游运行时反馈直接改写 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 10 的待确认事项。
- 具体协议、transport、package manager、runner 命令、事件名、API 形态和失败重试机制后移到 Step 10、概要设计、详细设计、测试方案或实施计划。

### 10. 进入下一步条件

- 已明确 SDK 关键交互场景和正式边界。
- 已明确同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接三类通信方式的适用场景。
- 已明确关键依赖失效时的显式失败、挂起、stale / pending / unsupported 和 not verified 口径。
- 已确认本 Step 未写入 API 路径、事件名、DTO、schema、具体协议、时序实现或技术选型。
- 可以进入 Step 10 关键技术选型。
