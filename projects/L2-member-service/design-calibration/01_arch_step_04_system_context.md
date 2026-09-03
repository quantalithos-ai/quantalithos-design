# 01 架构校准 Step 4：系统边界与上下文

> 状态：completed / pass
> 日期：2026-08-22
> 前序门禁：Step 3 completed / pass
> 本步目的：说明本仓在全局系统中的位置、正式输入 / 输出面和依赖失效上限，不展开内部结构或协议

## 1. Step 内计划

- [x] 读取 flow、项目台账和 Step 1~3。
- [x] 从职责边界筛选正式上下文对象，不把角色、文档或间接定义来源画入主图。
- [x] 区分关键输入、双向协作、基础设施依赖和输出消费。
- [x] 逐对象给出输入 / 输出面和失效口径。
- [x] 绘制符合规范的系统上下文图并补图后说明。
- [x] 诊断 draft 图中的重复节点、进行中结论升格和协议化污染。
- [x] 形成正式 §5 回填草稿与 gate 自检。

## 2. SOP 问题回答

### 2.1 本仓在全局系统中的位置

`L2-member-service` 位于 Identity / Work 已成立的成员与项目事实、Member Images 正式供给、Sandbox 隔离能力和宿主基础设施之间，将正式项目型宿主意图转化为可追溯的 host control plane 决定与 host truth。`L2-member` 是宿主内注册和健康信号协作方，`L2-runtime` 是 host session / execution handoff 协作方；二者都不拥有宿主生命周期。Bus 与 Observability 只消费已提交的 body-free 宿主材料，不反向定义本仓。

### 2.2 正式上游、下游与边界对象

| 对象类别 | 对象 | 进入上下文的原因 |
|---|---|---|
| 正式领域来源 | `L1-identity`、`L1-work` | 提供 GlobalMember 身份锚、ProjectMember 执行主语和相关变化来源。 |
| 正式供给来源 | `L2-member-images` | 提供 pinned instantiable supply 方向；exact contract pending。 |
| 正式能力依赖 | `L4-sandbox` | 提供宿主级隔离协作能力；isolation truth 仍归 Sandbox。 |
| 基础设施能力 | 宿主承载 / 镜像 registry | 提供物理宿主承载和正式 pinned 资产获取能力。 |
| 双向协作 | `L2-member`、`L2-runtime` | 分别协作注册 / 信号和 host session / execution handoff。 |
| 契约 / 事件基础 | `L0-core`、`L0-sdk`、`L0-bus` | 提供共享契约类别、受限 compile 基线和事件传播主干。 |
| 输出消费 | `L4-observability` | 消费 body-free 宿主材料；observed truth 不归本仓。 |

`L3-method-library` 不进入直接上下文：它是 Member Images 的正式定义来源，本仓不得建立 Role -> image 的第二解析路径。`L2-tools`、Capability Hub、Artifact、Archive、Workspace 和产品 UI 不进入关键上下文主链，因为它们不决定当前 host truth 成立；其未来只读消费或材料交接也不得反向定义本仓。

### 2.3 输入面与输出面

- 输入面：项目型执行主语 / 身份锚、安全来源摘要、pinned supply、隔离能力反馈、承载能力、Member 请求 / 信号、正式宿主意图及上游变化材料。
- 输出面：宿主意图结论、host truth safe view、注册 / endpoint / host session 可用性、宿主侧控制结果、body-free 生命周期材料与本地 handoff attempt / gap。
- 双向面：Member 的请求 / 信号与本仓 acceptance / registry / health；Runtime 的外部 ref 与本仓 host session / handoff seam；Sandbox / backend 的请求语境与外部反馈。

### 2.4 依赖失效时如何处理

| 失效类别 | 当前降级上限 |
|---|---|
| 主语、身份或授权来源不可验证 | 新意图 rejected / waiting；存量相关 snapshot 标记 stale / unknown。 |
| pinned supply、credential 或 required binding 不可验证 | 新装配 blocked；不得用旧资产、默认凭据或 host fallback。 |
| Member / Runtime 正向合同未闭口 | 注册 / handoff 对应路径 waiting / blocked；不得声明宿主 ready for integration。 |
| 宿主承载或 registry 不可用 | 新启动 blocked；存量进入 backend degraded / unknown，不删除本地 truth。 |
| Bus / Observability 不可用 | 保留 local attempt / gap；已提交 host truth 不回滚，不声明 delivered / observed。 |
| SDK target 或 Core schema 未闭口 | 阻塞准确实现依赖和互操作声明，不改变架构 owner 结论。 |

## 3. 当前材料诊断与取舍

| 既有表达 | 问题 | 本步取舍 |
|---|---|---|
| draft 图重复画两次 Member Images | 图对象重复，且容易把供应链与运行时装配混层 | 只保留一个正式供给对象。 |
| draft 把 member 宿主实例画成外部对象 | 把本仓拥有的 host truth 误画到仓外 | 主图只画 `L2-member` 仓，不画本仓内部宿主实例。 |
| draft 图带 `[event/ref/runtime]` 和合同细节 | 系统上下文图过早表达依赖类型和协议 | 图只用输入 / 输出 / 依赖；细分留在 Step 7 / 9。 |
| 旧图直接画产品入口和未校准消费者 | 下游候选反向扩大上下文 | 主图只保留核心闭环对象；候选消费者不进入。 |
| 将 Method Library 作为直接输入 | 形成第二 Role -> image 解析路径 | 只保留 Images 作为直接供给，Method Library 留在边界说明。 |
| 把 Core / SDK / Bus 全画入主图 | 会把运行主链和基础契约 / carrier 混成一层 | 主图聚焦宿主闭环；表中完整说明基础关系。 |

## 4. 结构化中间产物

### 4.1 系统上下文图

```text
              +----------------------+   +----------------------+
              | L1-identity          |   | L1-work              |
              | identity anchor      |   | execution subject    |
              +----------+-----------+   +-----------+----------+
                         | 输入                      | 输入
                         +-------------+------------+
                                       |
                                       v
+----------------------+   +-----------+----------+   +----------------------+
| L2-member-images     |-->| L2-member-service   |<--| L4-sandbox           |
| pinned supply        |   | host control/truth  |   | isolation ability    |
+----------------------+   +-----------+----------+   +----------------------+
                                       ^
                                       | 输入 / 输出
                         +-------------+-------------+
                         |                           |
              +----------+---+             +---------+----+
              | L2-member   |             | L2-runtime  |
              | host source |             | run owner   |
              +--------------+             +--------------+
```

图后说明：
- 该图表达项目型主语、正式镜像供给、隔离能力、宿主内来源与 Runtime 协作围绕本仓形成的关键边界。
- 图中的箭头只表示输入、输出或依赖，不表示接口、事件、运行顺序、协议或 package dependency。
- `L2-member` 与 `L2-member-images` 的架构合同仍在并行收敛，图只采用其正式 00 的需求级方向，不表示正向合同 ready。
- 宿主基础设施、`L0-core`、`L0-sdk`、Bus 和 Observability 由关系表承接；省略它们是为了保持主图聚焦，不代表没有正式关系。

### 4.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L1-identity` | 输入 | 来源 | GlobalMember 身份锚、生命周期和可运行性安全摘要 | 本仓不拥有身份正文；不可验证时新装配 fail closed。 |
| `L1-work` | 输入 | 来源 | ProjectMember 执行主语、分配 / 回收来源和项目边界摘要 | ProjectMember truth 归 Work，输入出现不等于宿主已创建。 |
| `L2-member-images` | 输入 | 来源 | pinned instantiable supply 与允许的供给引用 | 需求级方向已稳定；exact handoff 未闭口时装配 blocked。 |
| `L4-sandbox` | 输入 / 输出 | 依赖 | 宿主级隔离能力请求语境、binding / release 反馈边界 | 本仓拥有装配关联，Sandbox 拥有 isolation / cleanup truth。 |
| 宿主承载 / 镜像 registry | 输入 / 输出 | 依赖 | 物理宿主承载、生命周期动作和 pinned 资产获取能力 | 只经 adapter 参与，产品资源状态不定义 host truth。 |
| `L2-member` | 输入 / 输出 | 来源 / 消费 | 注册请求、存活信号、状态报告；acceptance、registry、host health | 只采用正式 00 分工；字段、IPC 和凭据仍 pending。 |
| `L2-runtime` | 输入 / 输出 | 消费 | host session、运行关联和 execution handoff 能力面 | Runtime entry surface pending；本仓不拥有 run truth。 |
| `L0-core` | 输入 | 来源 | 共享 ID、ref、metadata、error、trace 和 envelope 契约类别 | 准确专项 schema pending；不得本地 shadow。 |
| `L0-sdk` | 输入 | 来源 | 受限 compile / Server 自测试基线 | 精确 target pending，不是宿主运行期 truth 上游。 |
| `L0-bus` | 输入 / 输出 | 消费 | 上游正式变化材料与已提交宿主材料传播 | Bus delivery 不归本仓；失败只形成 local gap。 |
| `L4-observability` | 输出 | 消费 | body-free 宿主、失败、清理和 handoff 材料 | 本仓不拥有 observed truth、backend 或报告正文。 |

### 4.3 边界说明结论

主图只保留决定 C-MS-1~5 能否成立的关键上下文对象，并把契约基础、事件 carrier 与材料消费者留在配套表中。Identity、Work、Images、Sandbox 和基础设施提供不同 authority 的输入，任何一方都不能单独定义 host readiness；Member 与 Runtime 是双向协作边界，不是本仓源码上游。Method Library、Tools、Capability、Artifact、Archive、Workspace 和产品入口虽与平台运行有关，但不直接决定当前 host truth，因此不进入主图。上下文关系只确立“谁与本仓形成什么能力面”，不声明任何开放合同已经可以正向集成。

## 5. 回填草稿

- 正式 §5 采用本步系统上下文图、11 行关系表和一段边界说明。
- 正式图后必须保留“进行中 sibling 架构不代表 ready”的说明。
- 失效口径在正式 §5 表中简写，在 §10 / §15 继续展开，但不得转成协议或实现重试。

## 6. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓在全局系统中的位置 | pass | 已说明来源、供给、协作、基础设施和消费边界。 |
| 主图是否只含正式上下文对象 | pass | 无角色、文档、接口、事件或内部模块。 |
| 图是否符合 ASCII 格式 | pass | 有标题、text 图、4 条图后说明，箭头语义统一。 |
| 输入 / 输出面是否完整 | pass | 11 个正式关系对象均有能力面和 owner 说明。 |
| 依赖失效是否有保守口径 | pass | 主语、供给、合同、后端和外围传播均明确 fail-closed / gap。 |
| 是否把 sibling 进行中 01 升格 | pass | 只采用正式 00 方向，详细合同继续 pending。 |
| 是否允许创建 Step 5 | pass | 系统上下文已收稳；须先同步 flow 与项目台账。 |

```text
gate_status = pass
next_allowed_action = update_flow_and_ledger_then_create_step_05
formal_01_write_allowed = false
```
