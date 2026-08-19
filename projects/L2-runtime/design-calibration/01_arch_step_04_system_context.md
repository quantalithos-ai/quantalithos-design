# L2-runtime 01 架构 Step 4: 系统边界与上下文

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 5 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 1~3、正式 `00`、全局依赖规则、专项上游正式系统上下文章节 |
| 目标 | 明确 Runtime 的系统位置、正式上下文对象、输入 / 输出面和依赖失效口径 |
| 禁止 | 角色、文档来源、内部模块、接口名、事件名、容器部署、数据矩阵或调用时序进入上下文图 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| SOP 问题回答 | done | 系统位置 / 上下游 / 输入输出 / 失效回答 | pass |
| 历史上下文图诊断 | done | 旧 member IPC / provider / vector / tools 图审计 | pass |
| 系统上下文图 | done | 关键正式对象 ASCII 图 | pass |
| 输入 / 输出面表 | done | 15 条上下文关系 | pass |
| 失效降级表 | done | fail-closed / waiting / gap 分层 | pass |
| 回填与自检 | done | 第 5 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 系统位置 | Runtime 位于正式定义 / 治理 / 能力 / 工具合同与下游成员 / SDK / 观察消费之间，拥有受控 run 决策连续性，不拥有任何相邻 truth。 |
| 正式上游 | Core shared authority；Method / Hub / Governance / Artifact 的 ref / safe result；Tools 合同；Sandbox 条件执行结果；model adapter 和 durable memory pending seam。 |
| 正式下游 | Member / 产品触发边界和 SDK 是未来消费面；Bus / Observability 消费已提交的 body-free Runtime safe material；Artifact 等 owner 可消费候选 handoff，但不由 Runtime写源。 |
| 输入面 | 受控触发 / 控制请求、definition / decision / capability / artifact refs、Tools outcome、Sandbox safe result、model disposition、memory candidates 和外部反馈。 |
| 输出面 | Runtime status / safe summary、provider-neutral model intent、canonical Tool action intent、delegation、checkpoint / recovery result、local outcome 和 handoff attempt / gap。 |
| 依赖失效 | 需要该依赖的分支进入 reject / wait / blocked / unavailable / degraded / gap；本地已提交 outcome 不因 delivery / observed 失败回滚。 |

## 3. 当前材料诊断

| 旧上下文表达 | 问题 | 当前处置 |
|---|---|---|
| member IPC -> runtime -> tool invoker / provider / vector store | 把部署、协议、实现和外部 owner 混进系统上下文，并暗示 provider / memory / tool 直连。 | `historical_material`；主图只画正式对象和输入 / 输出 / 依赖。 |
| capability-hub / tools / sandbox 合成一个执行上游 | 混淆 capability access、Tool contract 和 isolation truth。 | 分别作为 Hub、Tools、Sandbox 正式对象，关系语义独立。 |
| observability 与 checkpoint / reasoning trace 直接共享正文 | 把观察消费面写成 Runtime truth 读写者。 | 只允许 body-free safe material 输出；observed 不反写。 |
| SDK、member、product 作为 Runtime package 上游 | 依赖方向倒置。 | 作为下游入口 / 消费边界，不进入 compile 依赖。 |

## 4. 设计取舍

主图将 Method / Hub / Governance / Artifact 收束为“正式定义 / 裁决 / 引用来源”，将 Tools / Sandbox 收束为“行动合同 / 条件执行边界”，将 model / durable memory 收束为“pending adapter 边界”，将 Member / SDK 与 Bus / Observability 收束为“入口消费 / 事件观察消费”。这种裁剪限制单图对象数量，同时保留 owner 分层；配套表逐项展开，不把聚合框误当成共享服务或合仓事实。

## 5. 结构化中间产物

### 5.1 系统上下文图

```text
       +-------------------------+   +-------------------------+
       | Core shared authority   |   | Definition / decision   |
       | L0-core                 |   | Method / Hub / Gov / Art|
       +------------+------------+   +------------+------------+
                    | 依赖                         | 输入
                    +---------------+-------------+
                                    v
       +-------------------------+   +-------------------------+
       | Action boundaries       |   | L2-runtime              |
       | Tools / Sandbox         |<->| controlled run truth    |
       +-------------------------+   +------------+------------+
                                                 ^
       +-------------------------+               | 输入 / 输出
       | Pending adapter seams   |---------------+
       | model / durable memory  |
       +-------------------------+
                                    |
                                    v
       +-------------------------+   +-------------------------+
       | Entry / consumers       |   | Event / observation     |
       | Member / SDK / Products |   | Bus / Observability     |
       +-------------------------+   +-------------------------+
```

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入 / 输出方向，不表达接口、事件、实现组件或运行时顺序。
- 聚合框只为控制上下文图复杂度，表格仍逐项保留每个 owner；聚合不表示合仓、共享 truth 或共享部署。
- model adapter 与 durable memory owner 未闭口，只作为 pending seam，不表示正向能力 ready。
- Member / SDK / Products 是入口或消费边界，不是 Runtime 的反向 package 依赖。

### 5.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入 / 输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 / 依赖 | shared ID / ref / metadata / error / trace / envelope 类别 | 唯一 compile authority；Runtime-specific schema 未闭口时不得 shadow。 |
| `L3-method-library` | 输入 | 来源 | method / role / process definition ref / safe view | 定义正文和版本 truth 仍归 Method。 |
| `L3-capability-hub` | 输入 | 来源 / 依赖 | capability identity / exposure / descriptor safe view | registry / adapter truth 不进入 Runtime。 |
| `L1-governance` | 输入 | 治理依赖 | effective decision / approval / policy result | 缺失、冲突、stale 或 unknown 时 fail closed。 |
| `L1-artifact` | 输入 / 输出 | 来源 / 消费 | goal / plan / output / evidence ref 与候选 handoff | Runtime 不保存或生成 Artifact / Evidence 正文。 |
| `L2-tools` | 输入 / 输出 | 依赖 | canonical Tool action intent 与 normalized outcome ref / summary | Runtime 选择和编排，Tools 拥有工具合同与结果。 |
| `L4-sandbox` | 输入 / 输出 | 依赖 | isolation-required action handoff 与 safe failure / capture ref | 不能 host fallback；正向 mapping 仍 pending。 |
| model adapter | 输入 / 输出 | 依赖 | provider-neutral turn 与关联 disposition | owner / route / secret / quota / cost 未闭口。 |
| durable memory owner | 输入 / 输出 | 依赖 | retrieval ref / candidate handoff / availability | 只保留 mediation，durable body / write truth 不归 Runtime。 |
| `L0-bus` | 输出 / 输入 | 消费 | 已提交 Runtime safe fact 与关联反馈 | delivery truth 不归 Runtime，Bus 不定义业务 schema。 |
| `L4-observability` | 输出 | 消费 | body-free observation / audit safe material | producer / route / observed readiness 未闭口。 |
| `L0-sdk` | 输出 | 入口 / 消费 | future Runtime client boundary | SDK 不反向成为 Runtime package 依赖。 |
| Member / Products | 输入 / 输出 | 入口 / 消费 | controlled trigger / control 与 status / outcome safe view | 下游未校准，不反向定义 Runtime truth。 |

### 5.3 依赖失效与降级

| 上下文对象失效 | Runtime 当前口径 | 禁止行为 |
|---|---|---|
| Core contract 缺失 | 相关跨仓 schema 保持 pending / blocked | 本地复制 shared type |
| Method / Hub / Artifact ref 缺失或 stale | context gap、waiting、degraded 或拒绝相应决定 | 从字符串 / 私有索引猜测 |
| Governance 结论不可验证 | governed action fail closed | local allowlist / 自我授权 |
| Tools / Sandbox 正向 seam 未闭口 | no-execution / blocked / unknown，保留 attempt / gap | 直连 provider、host fallback、伪造 receipt |
| model adapter 不可用 | no-model-action / unavailable / blocked | 任意 provider fallback |
| durable memory 不可用 | working-only / retrieval degraded | 声称 durable write / delete |
| Bus / Observability 不可用 | local outcome 保留，handoff gap 可追溯 | 回滚 outcome 或声明 delivered / observed |

## 6. 回填草稿

正式第 5 章采用本文件系统上下文图、上下游表和边界说明。上下文图不得出现具体 API、event、topic、DTO、容器或实现顺序；开放 seam 继续标为 pending / blocked。

## 7. 自检与门禁

| 检查 | 结果 |
|---|---|
| 中心为 Runtime，关键对象数量已裁剪 | pass |
| 图只使用输入 / 输出 / 依赖关系语义 | pass |
| 没有角色、文档、接口、事件、容器或内部模块 | pass |
| owner 聚合未丢失表格逐项边界 | pass |
| 失效口径全部显式且 fail-closed | pass |
| Step 5 文件未提前创建，正式 01 未修改 | pass |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_05_bounded_context_subdomains
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_05_start
```
