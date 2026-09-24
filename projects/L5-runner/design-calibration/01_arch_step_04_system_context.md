# 01 架构 Step 4 · 系统边界与上下文

> 状态：`completed`
> 前置：`01_arch_step_01_requirements_baseline.md`、`01_arch_step_02_goals_constraints.md`、`01_arch_step_03_responsibility_boundary.md`
> 回填章节：正式 `01` §5 系统边界与上下文

## 1. 本步目标与问题回答

Runner 位于 L5 端侧产品层，以 L0-sdk/正式公开边界消费 L1/L2/L4 owner 能力，并把安全、本地的运行入口提供给端侧入口形态。正式上游包括 Artifact、Governance、Work、Runtime、Sandbox、Observability；Archive 是条件性外围上下文。端侧平台能力是外部环境边界，不是全局资源或执行真相。

## 2. 系统上下文图

#### 系统上下文图

```text
                    +----------------------+
                    |       L0-sdk         |
                    |  正式访问与语境边界   |
                    +----------+-----------+
                               |
                               | 依赖
                               v

 +----------------------+  +----------------------+  +----------------------+
 | Artifact/Governance  |  |      L5-runner       |  |   端侧平台能力边界    |
 | 版本与 authority 输入 |->| 本地运行产品入口      |<-| 文件/网络/资源观察    |
 +----------------------+  +----------+-----------+  +----------------------+
                                      |
                  +-------------------+-------------------+
                  | 输入 / 依赖                           | 输入 / 依赖
                  v                                       v
       +----------------------+                +----------------------+
       | Sandbox / Runtime    |                |   Observability      |
       | 执行/状态/清理来源    |                | 诊断与 handoff 边界  |
       +----------------------+                +----------------------+
```

图后说明：

- 本图表达 Runner 与关键正式上下文对象之间的输入、依赖关系，中心主语是 L5-runner。
- Artifact/Governance 与 Sandbox/Runtime 在图中按紧密的 owner 能力面组合展示，表格仍逐仓说明。
- Work、Archive、L5 下游产品属于条件性或次级关系，避免主图超过关键对象上限，仍在关系表中保留。
- 该图不表达接口、事件、DTO、实现组件、协议或运行时顺序。

## 3. 上下游与输入/输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-sdk` | 输入 | 入口/依赖 | actor/context、正式 client、error/redaction/trace、版本兼容语境 | 默认跨域访问入口；exact surface 未闭合时不得旁路。 |
| `L1-artifact` | 输入 | 来源 | Release/version/baseline、locator/manifest/integrity、撤销/过期 view | 正式制品和版本来源，当前受 RUN-UP-001 阻塞。 |
| `L1-governance` | 输入 | 治理依赖 | approval/decision applicability、scope、expiry/revoke/conflict | Runner 只能消费结论，当前受 RUN-UP-002 阻塞。 |
| `L1-work` | 输入 | 来源 | Project/context 安全引用与可见性 | 条件性语境来源，不由 Runner 推断 ProjectMember。 |
| `L2-runtime` | 输入 | 来源 | execution status/result/recovery 安全 view | 运行/终态确认来源，当前受 RUN-UP-004 阻塞。 |
| `L4-sandbox` | 输入/依赖 | 消费 | request、boundary、policy、lease、controlled run、cleanup、reconcile | 受控执行与清理 owner，当前受 RUN-UP-003/007 阻塞。 |
| `L4-observability` | 输入/输出 | 消费 | safe diagnostic view、handoff posture/receipt、visibility/freshness/retention | Runner 可交接摘要，但不拥有证据结论。 |
| `L4-archive` | 输入 | 条件消费 | archive/restore 安全引用 | 当前只作外围历史入口，不影响运行/清理判定。 |
| 端侧平台能力 | 输入 | 外部能力 | 文件、网络、路径、端口、资源、应用生命周期观察 | 只形成短时本地 observation，不是 Sandbox allocation 或 scheduler truth。 |
| L5 下游产品 | 输出 | 条件消费 | 安全运行摘要、入口引用、source ref | 只能消费安全 view，不反写 Runner 或上游 truth。 |

## 4. 依赖失效降级口径

| 失效对象 | 架构降级 |
|---|---|
| SDK/actor/context | 停留在未认证、不可见或 unavailable；不直连上游。 |
| Artifact/Governance | 选择可保留，但资格保持 pending/blocked；不得取得或启动。 |
| Sandbox | 不提交启动、停止或清理；保持 blocked/unknown/reconcile。 |
| Runtime read surface | 不确认 running/terminal；本地观察只作辅助。 |
| Observability | 保留 bounded 本地诊断，handoff 显示 unavailable；不生成 evidence。 |
| Archive | 仅外围浏览不可用，不影响核心运行判定。 |
| 平台能力 | 显示 capability unavailable/conflict，禁止乐观抢占或伪造可用。 |

## 5. 边界说明与取舍

主图只保留影响核心运行资格、执行状态和诊断交接的关键上下文；项目语境、归档和下游产品在表中表达条件关系。L0-core 是共享契约的编译期来源，将在依赖章节表达，不作为运行上下文主图对象。L0-bus 只可能经 SDK/正式事件面间接协作，不是 Runner 直接上下文。用户角色也不进入系统上下文图，其交互由入口系统和 Runner 产品边界承接。

## 6. 回填草稿与门禁

正式 §5 回填系统上下文图、关系表、依赖失效表和边界说明。后续 Step 5 才讨论 Runner 内部语义结构；本步未写内部单元、数据分类或通信类别。

- [x] 图只包含正式仓/外部能力，没有角色、文档或接口名。
- [x] 输入、输出、依赖和条件性关系已解释。
- [x] 所有关键依赖均有 fail-closed 降级。
- [x] 上游 blocker 未被本地架构关闭。

Step 4 gate_status = pass；下一步允许进入 Step 5 限界上下文与子域划分。
