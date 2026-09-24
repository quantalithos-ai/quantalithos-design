# 01 架构 Step 7 · 依赖方向与层间约束

> 状态：`completed`
> 前置：`01_arch_step_03_responsibility_boundary.md`～`01_arch_step_06_runtime_units.md`、全局项目依赖关系与裁剪规则
> 回填章节：正式 `01` §8 依赖方向与层间约束

## 1. 本步问题回答与依赖原则

Runner 的核心语义必须独立于入口形态、平台观察和上游 transport。入口承接角色依赖应用编排角色；编排角色依赖核心语义角色；外部接缝和技术承载角色只能向内满足已定义的边界，不能反向改变核心规则。跨仓关系必须区分编译期、运行期和事件协作，只有编译期关系可进入 package dependency。

## 2. 依赖方向图

#### 依赖方向图

```text
      +=====================================================+
      |                 L5-runner 依赖边界                  |
      |                                                     |
      |  +-------------------+     +----------------------+ |
      |  | 入口承接角色      |     | 外部接缝角色         | |
      |  +---------+---------+     +----------+-----------+ |
      |            | 允许依赖                 | 边界接入     |
      |            +-------------+------------+             |
      |                          v                          |
      |              +----------------------+               |
      |              | 应用编排与保护角色   |               |
      |              +----------+-----------+               |
      |                         | 允许依赖                   |
      |                         v                            |
      |              +----------------------+               |
      |              | 核心语义角色         |               |
      |              +----------------------+               |
      |                         ^                            |
      |                         | 允许依赖                   |
      |              +----------+-----------+               |
      |              | 技术承载角色         |               |
      |              +----------------------+               |
      |                                                     |
      +=====================================================+
```

图后说明：

- 箭头表达架构上允许的依赖或边界接入方向，核心语义角色位于被保护的内层。
- 外部接缝和技术承载角色实现已定义边界，不能反向规定 authority、运行成功或清理规则。
- 图不表达函数调用、协议、运行时顺序、源码目录或 package 布局。

## 3. 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心语义角色 | 共享稳定契约语义；Runner-owned 规则 | SDK client、平台 API、UI、Sandbox 私有实现、存储产品 | 选择、资格、多轴状态和保护规则不能由外部技术反向定义。 |
| 应用编排与保护角色 | 核心语义角色、正式外部 seam 抽象、Runner-owned 状态边界 | UI 细节、私有 backend、共享上游数据库 | 组织用例和保护门禁，但不拥有外部 truth。 |
| 入口承接角色 | 应用编排与保护角色、只读 view | 直接跨域 client、直接存储、直接 Sandbox backend | 所有入口形态共享同一语义和安全门禁。 |
| 外部接缝角色 | 应用编排定义的边界、L0-sdk/公开 API | 核心规则反向覆盖、相邻仓源码、内部表/事务 | 负责协议和 owner 结果适配，不创造上游结论。 |
| 技术承载角色 | 核心/编排定义的状态与平台能力边界 | 业务规则决定权、上游 truth 写入、自动重放 unknown | 存储与平台能力只提供承载，不改变语义。 |

## 4. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | 共享契约来源 | 依赖方 | 编译期 | 是 | 使用正式 ref/error/trace/metadata/version 语义，不创建 shadow type。 |
| `L0-sdk` | L5 产品官方访问封装 | 依赖方 | 编译期 + 运行期 | 是，RUN-UP-008 | 作为跨域默认入口；exact package/client surface 待闭合。 |
| `L1-artifact` | Artifact/version/baseline owner | 运行期消费方 | 运行期 | 是，RUN-UP-001 | 消费 Release 与 integrity authority，不拥有正文或生命周期。 |
| `L1-governance` | Decision/Approval owner | 运行期消费方 | 运行期 | 是，RUN-UP-002 | 消费适用性结论，不本地批准。 |
| `L1-work` | Project/ProjectMember owner | 语境消费方 | 运行期 | 条件 | 只消费 project/context ref 与 visibility。 |
| `L1-workspace` | 跨域只读 view owner | 可选消费方 | 运行期 | 否/条件 | Workspace view 不可替代各 owner truth。 |
| `L2-runtime` | execution/outcome owner | 状态消费方 | 运行期 | 是，RUN-UP-004 | 只消费安全状态/结果/恢复 view。 |
| `L4-sandbox` | isolation/execution/lease/cleanup owner | 正式请求方 | 运行期 | 是，RUN-UP-003/007 | 只经公开 seam 请求和消费状态。 |
| `L4-observability` | diagnostic/audit/evidence owner | 交接方 | 运行期 | 条件，RUN-UP-005 | 只交接安全摘要、消费 receipt/view。 |
| `L4-archive` | archive/restore owner | 条件引用消费方 | 运行期 | 否/条件，RUN-UP-006 | 只浏览安全引用，不参与核心判定。 |
| `L0-bus` | 全局事件协作主干 | 间接协作方 | 事件协作 | 条件 | 只经 SDK/正式事件面，不直接使用内部 topic/group。 |
| L5 产品消费者 | 产品间安全引用 | 被依赖方 | 运行期/引用 | 条件 | 只提供安全摘要/ref，不允许反写 truth。 |

## 5. 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core`、`L0-sdk`（exact surface 成立后） | 使用共享契约与官方客户端包，不引入 sibling 私有实现。 | `02/03/07` |
| 运行期依赖 | Artifact、Governance、Work、Runtime、Sandbox、Observability、Archive | 经 SDK/API/adapter 查询、提交意图、消费 owner-safe view。 | `01/02/03/04` |
| 事件协作依赖 | `L0-bus`（仅正式 SDK/event seam） | 接收变化信号或协作状态；本地 cursor 不等 delivery truth。 | `01/03/05` |

## 6. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Runner → Artifact/Governance/Runtime/Sandbox/Observability 内部表、事务或源码 | 绕过 owner、visibility、版本和审计边界。 | L0-sdk、公开 API/adapter、safe ref/view。 |
| Runner → Sandbox 私有 Docker/gVisor/Firecracker 等 backend | 将可替换实现固化为跨仓契约并侵入 isolation owner。 | 公开 Sandbox seam。 |
| 入口承接 → 外部服务/本地存储直连 | 让 UI/CLI 绕过共同门禁并产生行为分叉。 | 经应用编排与保护角色。 |
| 核心语义 → UI/平台/transport/存储产品 | 技术细节会反向定义选择、资格和状态规则。 | 通过外层接缝和技术承载角色满足边界。 |
| Runner → `L0-bus` 内部 topic/group | 把 delivery/replay 与产品状态混在一起。 | 只经正式 SDK/event seam。 |
| 下游产品 → Runner 本地状态或上游 truth 反写 | 形成产品间循环依赖和多真相。 | 安全 query/ref；控制回到正式意图入口。 |

## 7. 依赖裁剪图: L5-runner

#### 依赖裁剪图: L5-runner

```text
Global baseline
      |
      | crop only Runner-related edges
      v
 +----------------------+
 |      L5-runner       |
 +----------+-----------+
            |
            +--> [compile] L0-core / L0-sdk
            |
            +--> [runtime] Artifact / Governance / Work
            |
            +--> [runtime] Runtime / Sandbox / Observability
            |
            +--> [runtime] Archive (conditional)
            |
            +--> [event]   L0-bus (only via formal SDK seam)
```

图示说明：

- 本图只展示 L5-runner 相关依赖，不展示全 27 仓。
- `[compile]` 才可能进入 package dependency；`[runtime]` 与 `[event]` 不得写成源码依赖。
- 箭头表示依赖/消费/协作方向，不表示调用或事件传播顺序。
- 所有 RUN-UP-001~008 未闭合边仍保持条件性。

## 8. 架构单元依赖停审

| 架构单元 | 允许依赖 | 禁止依赖 | 结论 |
|---|---|---|---|
| 选择与资格承接 | 正式 context/Artifact/Governance seam、核心规则 | 本地批准、`latest`、外部正文 | 通过 |
| 取得与材料资格承接 | qualified selection、正式 locator/integrity seam、平台能力 | 私有 transport authority、修改 Release | 通过 |
| 本地运行意图与生命周期 | qualified refs、Sandbox/Runtime seam | execution truth、ACK 推成功 | 通过 |
| 资源、清理与恢复保护 | owner lease/cleanup view、平台 observation | 本地 probe 覆盖 owner、盲重放 | 通过 |
| 输出预览与失败诊断 | safe output/diagnostic refs、redaction seam | raw body、evidence owner | 通过 |
| 端侧入口与展示 | 应用编排 view/intent boundary | 直接 SDK/backend/storage | 通过 |

## 9. 跨依赖边界审计与回填

反向依赖、运行期误写 package dependency、私有 backend、共享事务和入口旁路均有显式禁止规则。外部接缝和技术承载没有核心语义决定权；所有单元均经正式 seam 协作。正式 §8 将回填依赖图、层间约束、三张裁剪表、裁剪图和单元停审摘要。

Step 7 gate_status = pass；下一步允许进入 Step 8 数据所有权与一致性策略。
