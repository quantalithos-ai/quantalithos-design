# L2-runtime 00 需求 Step 6: 使用方与依赖

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 6 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 / 5、全局依赖规则、专项上游正式链、blocker 台账 |
| 固定依赖类型 | compile / runtime / event |
| 协作 seam 标签 | ref / adapter / fake;这些不是第四种 package 依赖类型 |
| 禁止 | 把 runtime/event/ref/adapter/fake 写成 Cargo/path/package dependency |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 内部仓关系 | done | 输入 / 输出 / 失效表 | pass |
| 外部 seam | done | model / memory pending 表 | pass |
| 全局裁剪 | done | 固定裁剪 / 类型 / 禁止表 | pass |
| seam 分类 | done | compile/runtime/event/ref/adapter/fake 矩阵 | pass |
| ASCII 图 | done | L2-runtime 子图 | pass |
| 回填与自检 | done | 第 6 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Runtime 向谁提供能力? | 向受控触发方 / member-facing seam 提供运行能力,向 SDK / 产品提供未来正式服务边界,向 Bus / Observability 提供已提交 Runtime safe material。 |
| Runtime 依赖谁? | 编译期只依赖 Core;运行期消费 Tools、Capability Hub、Method Library、Governance、Sandbox 和按需 Artifact refs;通过 Bus / Observability 事件协作。 |
| 哪些是闭环前置? | Core shared authority、Tools canonical contract、method/role定义、Governance 对适用动作的正式结论和 model adapter seam 是相应场景前置;Sandbox 只对要求隔离的行动前置。 |
| 依赖失效如何? | 缺失、冲突、stale 或不可验证时进入 blocked / waiting / unavailable / fail-closed,不得构造本地第二 truth。 |
| 哪些不是当前前置? | SDK client、UI、member image、member container lifecycle、marketplace、Observability backend readiness 不阻塞本地 Runtime 语义设计。 |

## 3. 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | shared ID / ref / actor / metadata / error / trace / envelope 类别 authority | 是 | Runtime-specific shared contract 未闭口时不得复制类型;相关跨仓字段保持 pending。 |
| 输入 | `L2-tools` | tool identity / definition、canonical invocation、normalized result / error / tool audit 合同 | 工具行动场景是 | 不得执行或解释工具行动;保持 blocked,不直连 provider / Sandbox 旁路。 |
| 输入 | `L3-capability-hub` | capability identity / registry / descriptor / formal exposure 的 controlled ref / safe summary | model / capability 适用性场景是 | 不得把能力当可用或自建 registry;选择候选受限 / blocked。 |
| 输入 | `L3-method-library` | method / role / process definition 的正式 ref / safe definition view | 采用方法 / 角色约束的运行是 | 不得 hardcode 定义或保存正文;相关 context 不完整。 |
| 输入 | `L1-governance` | Decision / approval / Policy effective / shared rules 的正式结果或安全摘要 | governed action 是 | 结论不明即 fail closed,不得由 Runtime cache / prompt 自我授权。 |
| 输入 | `L4-sandbox` | 对 isolation-required action 的 environment / run / failure / capture / handoff safe material | 条件前置 | 不得 host fallback、伪造 run / receipt 或将 capture 当 Runtime / Tool 成功。 |
| 输入 | `L1-artifact` | goal / plan / output / evidence 等正式引用和允许的安全摘要 | 按场景 | 不得保存正文 / lineage truth;缺 ref 时受影响 run 等待或拒绝。 |
| 事件协作 | `L0-bus` | 已提交 Runtime fact 的 event carrier 与外部事件输入主干 | 非本地 truth 前置 | delivery 失败独立降级;不得回滚本地 truth或编造 receipt。 |
| 事件协作 | `L4-observability` | body-free observation / audit safe material 消费与状态 seam | 非本地 truth 前置 | observed 缺失不改 Runtime result;producer / source / route 未闭口时只保留 attempt / gap。 |
| 输出 / future | `L0-sdk` | 未来封装 Runtime 正式 API / event 的客户端边界 | 否 | SDK seam 缺失不阻塞 Runtime 本地合同;不得反向 package 依赖。 |
| 输出 / future | `L2-member` / `L2-member-service` / products | 受控运行入口、status / outcome safe view | 否;属于 Runtime 下游 | 这些项目尚未按当前节点校准,不得作为本需求 authority。 |

## 4. 外部系统依赖 / pending seam

| 方向 | 对方 | 提供能力 | 当前地位 | 失效影响 |
|---|---|---|---|---|
| 输入 | model provider adapter | provider-neutral model turn 的承接与关联结果 | owner_contract_pending / adapter seam | 无符合约束的 adapter 时 model action blocked;不得选择任意 provider fallback。 |
| 输入 / 输出 | durable episodic / semantic memory owner | 长期记忆检索、安全引用和候选写入 handoff | owner_boundary_pending / ref+adapter seam | working memory 可继续,依赖长期记忆的决定显式 degraded / unavailable;不得本地永久化正文。 |
| 排除 | 外部 MCP / A2A / API provider | 具体 provider runtime | 不直接进入 Runtime 主链 | 应经 Hub / Tools / formal adapter;Runtime 不拥有外部 adapter truth。 |
| 排除 | secret / KMS / quota / billing systems | provider secret、route、quota、cost / bill truth | 非目标 | 缺正式绑定时相关 model action blocked,不由 Runtime 配置补造。 |

## 5. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | Runtime 编译期依赖 Core | 依赖方 | 编译期依赖 | 是 | 唯一 shared contract authority;具体 Runtime schema 仍需后续确认。 |
| `L0-bus` | Runtime 通过 Bus 发布运行事件 | 协作方 | 事件协作依赖 | 是 | 只传递已提交 safe fact;Bus 不定义业务 schema。 |
| `L0-sdk` | SDK 运行期封装 L2 API | 被依赖方 | 运行期依赖 | 否,作为 future consumer 记录 | 不反向进入 Runtime 主链 / package 图。 |
| `L2-tools` | Runtime 运行期消费 tools 能力 | 依赖方 | 运行期依赖 | 是 | Runtime 编排 action,Tools 拥有工具语义合同。 |
| `L3-capability-hub` | Runtime 运行期消费 capability | 依赖方 | 运行期依赖 | 是 | 只读 controlled ref / summary,不复制 registry。 |
| `L3-method-library` | Runtime 运行期消费 method / role / process definition | 依赖方 | 运行期依赖 | 是 | Definition vs Use 分离。 |
| `L1-governance` | Governance 与 Runtime 运行期 / 事件协作 | 依赖方 / 协作方 | 运行期依赖 / 事件协作依赖 | 是 | 消费 effective truth并反馈 safe runtime material,不反向裁决。 |
| `L4-sandbox` | Runtime 按角色消费隔离执行 | 依赖方 | 运行期依赖 | 是,条件场景 | isolation-required action 不可旁路。 |
| `L4-observability` | Observability 经 Bus / runtime seam 消费材料 | 协作方 | 事件协作依赖 | 是 | safe material handoff,不拥有 observed truth。 |
| `L1-artifact` | Runtime 按需消费 Artifact ref / safe view | 依赖方 | 运行期依赖 | 是,引用场景 | 只消费 ref / summary,正文和 lineage 归 Artifact。 |
| `L2-member*` / products | 全局顺序位于 Runtime 下游 | 被依赖方 | 运行期依赖候选 | 否 | 未校准下游不能反向定义本需求。 |

## 6. 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | import 已正式发布的 shared contracts;不本地 shadow | 01 / 03 / 07 |
| 运行期依赖 | Tools / Hub / Method / Governance / Sandbox / Artifact | 通过正式 service/ref/adapter 边界消费 | 01 / 02 / 03 / 04 / 05 |
| 事件协作依赖 | `L0-bus`;Governance;Observability | publish / consume 已提交、body-free、可关联 safe material | 01 / 03 / 05 / 06 |

### 6.1 Seam 形式矩阵

| Seam 形式 | 适用对象 | 是否允许进入 package 依赖 | 当前要求 |
|---|---|---|---|
| `compile` | Core shared contract | 是 | 必须上游类型真实可检索后才能定稿。 |
| `runtime` | service / capability consumption | 否 | typed contract / failure / availability 明确。 |
| `event` | Bus / Observability / Governance collaboration | 否 | committed source、schema owner、delivery/observed 分层。 |
| `ref` | Method / Artifact / Governance / memory 等外部 truth | 否 | typed ref、owner、resolution / stale / forbidden body 明确。 |
| `adapter` | model provider、Tools、Sandbox、memory | 否 | provider-neutral contract;未闭口时 blocked。 |
| `fake` | local design / test seam | 否 | deterministic semantic parity;不能证明真实 integration readiness。 |

## 7. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Runtime -> 非 Core sibling Cargo / path dependency | 把运行期 / 事件协作误写成源码耦合 | runtime/event/ref/adapter seam。 |
| Runtime -> SDK package | 依赖方向反转;SDK 是下游封装 | Runtime 暴露正式 contract,SDK 消费。 |
| Runtime -> external MCP / A2A / API direct registry | 绕过 Hub / Tools owner | Hub controlled ref + Tools canonical invocation。 |
| Runtime -> Sandbox host fallback | 绕过 isolation truth | formal Sandbox adapter;不可用即 blocked。 |
| Runtime -> Governance local allowlist / policy cache truth | 自我授权 | consume formal Decision / Policy effective result;fail closed。 |
| Runtime -> Method / Artifact / memory body storage | 复制外部正文 truth | typed ref / safe snapshot / candidate handoff。 |
| Runtime -> Observability store / observed projection writer | 观察层反写运行 truth | event safe material + local attempt / gap。 |
| Runtime -> member-service / member-images lifecycle | 合并宿主和构建职责 | downstream runtime boundary / handoff。 |

## 8. 依赖裁剪图: L2-runtime

```text
                   L0-core
                      ^
                      | [compile]
                      |
Method / Hub / Tools / Governance / Artifact
                      ^
                      | [runtime: ref / adapter]
                      |
              +-------+--------+
              |   L2-runtime   |
              +-------+--------+
                      |
          +-----------+-----------+
          |                       |
          v                       v
 L4-sandbox [runtime:adapter]  L0-bus [event]
                                      |
                                      v
                           L4-observability [event]

Future consumers: SDK / Member / Products <- [runtime] L2-runtime
Pending external seams: model adapter / durable memory <- [runtime:adapter/ref]
```

图示说明:

- 只有 Core 的 `[compile]` 可进入 package dependency。
- `[runtime]`、`[event]`、`ref`、`adapter` 和 `fake` 均不得写成 sibling path dependency。
- 图只表示依赖 / 消费 / 协作方向,不表示调用时序或实施顺序。
- Model / memory seam 当前 pending;文件存在或 fake 可用不等于正向 readiness。

## 9. 历史材料审计

旧 README / 正式链中的 SDK compile、member IPC、vector store、provider 直连、Tools/Sandbox 直连、observability backlog 和固定 SLA 均不继承。它们分别被裁剪为 downstream consumer、runtime/ref/adapter/event seam 或 pending owner,且无一自动进入 package 图。

## 10. 回填草稿

Runtime 只有 `L0-core` 编译期依赖候选;Tools、Hub、Method、Governance、Sandbox、Artifact 和 model/memory provider 均通过运行期/ref/adapter/fake seam 消费,Bus 与 Observability 通过事件协作。任一外部 truth 缺失、冲突、陈旧或不可验证时,Runtime 必须显式 blocked / waiting / unavailable / fail-closed,不得本地补 registry、policy、body、route、receipt 或 readiness。

## 11. 待确认事项与门禁

- `L2R-UP-001~008` 全部保持开放;不阻塞需求依赖裁剪,阻塞受影响 positive qualification。
- Runtime-specific Core contracts、model adapter、durable memory owner、runtime event source family 后移 01~04 定稿。

| 检查 | 结果 |
|---|---|
| 固定三类依赖表完整 | pass |
| ref / adapter / fake 未冒充依赖类型 | pass |
| 只有 Core 可 compile | pass |
| 运行期 / 事件依赖未写成 package | pass |
| 未使用未校准下游作为 authority | pass |

```text
gate_status = pass
next_allowed_action = create_step_07_core_capability_loop
formal_document_write_allowed = false
```
