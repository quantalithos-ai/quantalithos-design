# L2-runtime 01 架构 Step 7: 依赖方向与层间约束

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 8 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 5 架构单元、Step 6 运行承载、全局依赖关系与裁剪规则 |
| 固定依赖类型 | compile / runtime / event |
| seam 标签 | ref / adapter / fake 只描述边界形式，不是 package 依赖类型 |
| 禁止 | 将 sibling runtime / event 通信写成 Cargo / path / package 依赖 |

## 1. 问题回答与设计取舍

Runtime 的依赖结构采用“核心语义角色 <- 运行编排角色 <- 外部接缝角色”，技术承载角色只能支撑状态和协作，不得反向定义核心语义。只有 `L0-core` 是 compile 候选；Tools / Hub / Method / Governance / Sandbox / Artifact / model / memory 是 runtime seam；Bus / Observability 是 event collaboration；SDK / Member / Products 是下游 runtime consumer。选择边界倒置而非 sibling 源码直依赖，代价是必须维护 typed seam、失败和 fake parity，收益是 owner separation、可替换性和 fail-closed 可审计。

## 2. 依赖方向图

```text
 +====================================================+
 |             L2-runtime dependency boundary         |
 |                                                    |
 | +------------------------------+                   |
 | | External seam role           |                   |
 | | runtime / event / ref/adapter|                   |
 | +---------------+--------------+                   |
 |                 | 边界接入                         |
 |                 v                                  |
 | +------------------------------+                   |
 | | Runtime orchestration role   |                   |
 | +---------------+--------------+                   |
 |                 | 允许依赖                         |
 |                 v                                  |
 | +------------------------------+                   |
 | | Core runtime semantic role   |                   |
 | +------------------------------+                   |
 |                                                    |
 | +------------------------------+                   |
 | | Technical carrier role       |                   |
 | | Core contracts / state / bus |                   |
 | +------------------------------+                   |
 +====================================================+
```

- 箭头只表示允许依赖或边界接入，不表示调用、事件或运行时顺序。
- 外部 seam 必须先被 Runtime 边界承接，不能直接打穿核心语义。
- 技术承载不能反向定义 run、decision、checkpoint 或 outcome 语义。
- ref / adapter / fake 不进入 package graph。

## 3. 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心运行语义角色 | Core shared category；经正式边界提供的抽象 source / outcome | sibling implementation、provider / storage product、SDK / UI | run / decision / recovery 规则不能由外部实现反向统治。 |
| Runtime 编排 / 承接角色 | 核心语义；外部接缝；技术承载的正式能力 | 绕过 Tools / Governance / Sandbox / owner 的直连 | 它协调来源和结果，但不接管外部 truth。 |
| 外部接缝角色 | 对应 owner 的 runtime / event / ref / adapter contract | 核心状态直写、共享数据库、第二业务 schema | 负责翻译与隔离失败，不拥有核心决定。 |
| 技术承载角色 | Core contract、Runtime state responsibility、Bus carrier | 业务语义反向依赖、外部正文、observed / accepted 反写 | 技术载体可以替换，核心语义保持稳定。 |
| 本地投影 / 引用角色 | 已提交 Runtime truth、正式外部 ref / safe snapshot | 写源、复制正文、把 stale / gap 伪装 fresh | 只读 / 可重建 / 可失效。 |

## 4. 按架构单元依赖规则与停审

| 架构单元 | 允许依赖 | 禁止依赖 | 倒置 / 接入边界 | 停审 |
|---|---|---|---|---|
| Run & Goal-Plan | Core refs、Entry boundary、External Truth Views | Member / SDK 私有状态、Work / Process / Artifact body | 所有外部目标通过 typed ref / safe view | pass |
| Context & Memory | Source views、working state、memory adapter seam | 外部正文、vector / memory product、provider SDK | retrieval / candidate / availability boundary | pass |
| Model Decision | context result、Hub capability view、model adapter | provider endpoint / secret / route registry / quota store | provider-neutral adapter | pass |
| Action & Delegation | decision、Tools / Governance / Sandbox seam | tool implementation、local allowlist、host execution、member lifecycle | Tool contract + formal decision + isolation adapter | pass |
| Checkpoint / Recovery / Handoff | committed Runtime truth、feedback refs、Bus / Obs event seam | external DB sharing、observed / receipt / accepted writeback | immutable history + event handoff | pass |
| Entry & Control | Core principal / ref、Runtime orchestration | product UI / SDK implementation | formal entry boundary | pass |
| External Truth Views | external ref / snapshot sources | owner body / registry / policy / artifact store | ref resolver / adapter / fake | pass |
| Safe Runtime Views | committed local truth | mutation path、Observability backend | projection / handoff boundary | pass |

## 5. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | Runtime 编译期依赖 Core | 依赖方 | 编译期依赖 | 是 | 唯一 shared contract authority；具体 Runtime schema pending。 |
| `L0-bus` | Runtime 通过 Bus 发布 / 消费运行协作 | 协作方 | 事件协作依赖 | 是 | 只传已提交 safe fact；delivery 独立。 |
| `L0-sdk` | SDK 封装 Runtime 正式消费面 | 被依赖方 | 运行期依赖 | 作为下游边界 | 不反向成为 Runtime package。 |
| `L2-tools` | Runtime 消费工具行动合同 | 依赖方 | 运行期依赖 | 是 | Runtime 编排，Tools 拥有工具合同 / outcome。 |
| `L3-capability-hub` | Runtime 消费 capability access truth | 依赖方 | 运行期依赖 | 是 | controlled ref / safe summary，不复制 registry。 |
| `L3-method-library` | Runtime 消费定义 | 依赖方 | 运行期依赖 | 是 | Definition vs Use 分离。 |
| `L1-governance` | Runtime 消费正式治理结果 | 依赖方 / 协作方 | 运行期 / 事件协作依赖 | 是 | unknown fail closed，不自我授权。 |
| `L4-sandbox` | Runtime 条件消费隔离执行 | 依赖方 | 运行期依赖 | 是 | sandbox-required 不旁路；mapping pending。 |
| `L4-observability` | 消费 Runtime safe material | 协作方 | 事件协作依赖 | 是 | local attempt / gap，不声明 observed。 |
| `L1-artifact` | Runtime 消费 refs 并交接候选 | 依赖方 / 协作方 | 运行期依赖 | 是 | 正文 / lineage / verdict 不归 Runtime。 |
| model adapter | Runtime logical decision 的外部承接 | 依赖方 | 运行期依赖 | 是，pending | provider-neutral adapter；owner / route 未闭口。 |
| durable memory owner | retrieval / candidate handoff | 依赖方 | 运行期依赖 | 是，pending | working-only 可降级，durable truth 外置。 |
| Member / Products | Runtime 下游入口 / 消费 | 被依赖方 | 运行期依赖候选 | 图外 / 边界记录 | 未校准下游不反向成为 authority。 |

## 6. 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | import 正式 shared contracts，不本地 shadow | 03 / 07 |
| 运行期依赖 | Tools、Hub、Method、Governance、Sandbox、Artifact、model、memory；SDK / Member 下游消费 | service / ref / adapter boundary；失败显式 | 02 / 03 / 04 / 05 |
| 事件协作依赖 | Bus、Governance、Observability、Artifact handoff | 已提交 body-free material 的跨仓协作 | 03 / 04 / 05 / 06 |

## 7. Seam 形式矩阵

| Seam | 适用对象 | package 依赖 | 当前要求 |
|---|---|---|---|
| compile | Core shared contract | 可 | 只有真实发布的 Core 类型可进入。 |
| runtime | service / capability consumption | 否 | owner、failure、availability 明确。 |
| event | Bus / Governance / Obs / Artifact collaboration | 否 | committed source、delivery / observed 分层。 |
| ref | Method / Artifact / Governance / memory 等 | 否 | typed owner / resolution / stale / forbidden body。 |
| adapter | model / Tools / Sandbox / memory | 否 | provider-neutral；未闭口 blocked。 |
| fake | design / test semantic seam | 否 | deterministic parity；不证明真实 readiness。 |

## 8. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Runtime -> 非 Core sibling Cargo / path / package | 把运行 / 事件关系误写为源码耦合 | runtime / event / ref / adapter seam |
| Runtime -> SDK / Member / Product package | 下游反向决定核心 | Runtime 暴露正式消费边界 |
| Runtime -> provider / vector / memory product SDK 进入核心 | 物理产品统治 model / memory 语义 | provider-neutral adapter |
| Runtime -> external MCP / A2A / API direct registry | 绕过 Hub / Tools truth | Hub controlled view + Tools contract |
| Runtime -> Governance local cache / allowlist truth | 自我授权 | formal result / safe summary |
| Runtime -> Sandbox host fallback | 绕过 isolation truth | formal adapter；不可用即 blocked |
| Runtime -> Method / Artifact / memory body store | 复制外部正文 | typed ref / safe snapshot / candidate |
| Runtime -> Observability backend / Bus delivery store | 观察 / 传递反写运行 truth | event safe material + local attempt / gap |

## 9. 跨仓依赖裁剪图

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
             +--------------+--------------+
             | [runtime]                    | [event]
             v                              v
  Sandbox / model / memory          L0-bus / Observability

 Future consumers: SDK / Member / Products <- [runtime] L2-runtime
```

- 只有 `[compile]` 可进入 Cargo / package dependency。
- `[runtime]` / `[event]` 及 ref / adapter / fake 不得进入 sibling package graph。
- 箭头表达依赖 / 消费 / 协作，不表达调用或实施顺序。
- pending adapter 或 fake 存在不等于真实正向集成 ready。

## 10. 跨依赖边界审计与门禁

| 审计 | 结论 | 状态 |
|---|---|---|
| 反向依赖 | SDK / Member / Products 未进入 Runtime package | pass |
| 类型误判 | runtime / event / ref / adapter / fake 未伪装 compile | pass |
| 单元接入 | 五核心语境均通过正式边界消费外部事实 | pass |
| 未闭合 seam | model / memory / Tools-Sandbox / event route 仍 pending | pass |
| 实现词污染 | repository / handler / package 仅作为禁止项，无实现结构 | pass |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_08_data_ownership_consistency
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_08_start
```
