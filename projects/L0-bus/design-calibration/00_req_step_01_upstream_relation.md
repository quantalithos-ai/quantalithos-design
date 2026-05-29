# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-05-29

---

## 1. 本步目标

先校准 `L0-bus` 需求文档的语义来源，明确它承接哪些上游结论，而不是重新定义事件、错误、追踪、元数据、业务事件目录或 SDK 客户端。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L0-bus/README.md` | 旧版仓定位材料 | 作为旧口径诊断输入，识别仍可保留的使命和明显过时内容 |
| `projects/L0-bus/00-需求文档.md` | 旧版需求文档 | 作为旧需求诊断输入，不作为新版正式基线 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游，承接共享契约、事件、错误、trace、metadata、配置和 evidence 口径 |
| `product/六域模型.md` | 全局产品 / 领域关系输入 | 承接六域平权、跨域协作和事件通信原则 |
| `architecture/仓库拆分方案.md` | 27 仓七层分层输入 | 承接 `L0-bus` 位于 L0 共享契约层、依赖 `L0-core` 的定位 |
| `architecture/开发路线图与优先级.md` | 路线图输入 | 承接 N0 契约地基中 bus 的先后关系 |
| `architecture/标准对齐全景图.md` | 标准对齐输入 | 承接 CloudEvents、W3C Trace Context、可靠投递和审计相关标准方向 |
| `architecture/bus-draft/README.md` | 旧总线草案 | 作为候选事实、术语和风险来源，不高于新版需求结论 |
| `architecture/bus-draft/event-catalog.md` | 事件目录草案 | 作为事件规模和消费样本来源，不作为 bus 自己定义事件 schema 的依据 |
| `standards/子项目遵循规范清单.md` | 子项目规则输入 | 承接 L0-bus 的强制规则和审查约束 |

---

## 3. 应问的问题与回答

### 3.1 本文承接哪些上游文档？

本文直接承接三类上游：

1. 已稳定仓库结论：`projects/L0-core/00`~`07`。
2. 全局产品与架构结论：`product/六域模型.md`、`architecture/仓库拆分方案.md`、`architecture/开发路线图与优先级.md`、`architecture/标准对齐全景图.md`。
3. 历史草案与规范输入：`architecture/bus-draft/README.md`、`architecture/bus-draft/event-catalog.md`、`standards/子项目遵循规范清单.md`。

其中 `L0-core` 是最重要的直接稳定上游。`L0-bus` 不再重新定义 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 这些共享契约，而是消费 `L0-core` 已收稳的契约基线。

### 3.2 承接的是上游哪一部分主题？

本仓承接的主题是：在 `L0-core` 提供共享契约基线之后，`L0-bus` 如何提供跨仓事件传递、订阅推进、失败恢复、重放、死信和观测 tap 的运行主干需求。

具体承接关系如下：

| 上游主题 | `L0-bus` 承接方式 |
|---|---|
| 事件包络和共享 metadata | 从 `L0-core` 消费，不在 `L0-bus` 重定义 |
| Error / TraceContext / ActorRef | 从 `L0-core` 消费，用于 delivery、retry、dead-letter、audit 和 replay |
| 六域事件协作原则 | 转译为 publish / subscribe / ack / retry / DLQ / replay / tap 的外部可见需求 |
| 27 仓七层依赖方向 | 明确 `L0-bus` 只能依赖 `L0-core`，不能反向依赖 L1+ |
| bus-draft 多后端 / Outbox / DLQ / tap 草案 | 作为需求候选来源，后续逐 Step 决定 P0/P1/P2，不直接全量继承 |

### 3.3 本文为什么不是重新定义该主题？

因为 `L0-bus` 的主题不是“事件是什么”，而是“事件如何可靠传递和恢复”。事件 schema、共享 ID、错误、追踪上下文、元数据和契约快照已经由 `L0-core` 稳定承接；如果 `L0-bus` 再定义这些内容，会破坏 L0 内部依赖方向，并造成 core / bus 双真相。

本文只把上游已成立的事件通信原则转译为 bus 仓的需求边界：

- 发布方如何提交事件。
- 订阅方如何接收、ack、nack。
- 失败如何 retry、进入 dead-letter、准备 replay。
- observability 如何 tap。
- governance / operator 如何读取失败材料。
- SDK 如何消费传递视图但不反写 bus truth。

### 3.4 本文在当前仓里承担什么细化作用？

本文承担 `L0-bus` 的仓级需求基线作用。它需要回答：

- `L0-bus` 作为 L0 事件传递运行主干要做什么。
- 它与 `L0-core`、`L0-sdk`、L1 领域仓、`L4-observability`、`L1-governance` 的边界是什么。
- 哪些能力属于 P0 主闭环，哪些只是历史草案中的候选增强。
- 后续架构、概要、详细、配置、测试、验收、实施计划应围绕哪些需求结论展开。

---

## 4. 当前文档诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `README.md` / `00-需求文档.md` | 仍写 26 仓、下游 25 仓 | 与最新 27 仓七层分层不一致 | 后续正式文档统一改为 27 仓口径 |
| `README.md` | 写 Rust + Python + TypeScript 三语言 client | 容易与 `L0-sdk` 职责混淆 | 后续 Step 2 / Step 4 明确 bus 与 sdk 边界 |
| `00-需求文档.md` | 将 `architecture/bus-draft` 作为强输入 | 草案中有大量实现候选和历史假设 | 只作为候选事实来源，不作为新版需求权威 |
| `00-需求文档.md` | 写 147 个事件来自事件目录 | 事件规模可参考，但 schema 真相不属于 bus | 后续改成“消费事件目录和 core 契约”，不由 bus 定义事件 schema |
| `00-需求文档.md` | 下游文档链写到 `04-实施计划.md` | 最新文档链已有 `04-配置设计.md` 与 `07-实施计划.md` | 后续正式文档按 `00`~`07` 主链重建 |
| `01`~`06` 旧文档 | 已出现 envelope truth、delivery、dead-letter、replay、audit 等较新概念 | 有可迁移事实，但缺少需求校准来源 | 后续逐 Step 判断哪些进入新版需求 |

---

## 5. 结构化中间产物

### 5.1 上游文档来源结论

| 来源文档 | 上游章节 / 模块 | 承接内容 | 权威级别 |
|---|---|---|---|
| `projects/L0-core/00-需求文档.md` | §2 / §4 / §6 / §12 | `L0-core` 与 `L0-bus` 边界、共享契约输出、事件契约和依赖方向 | 直接稳定上游 |
| `projects/L0-core/01-架构设计.md` | §3 / §4 / §5 / §9 | `L0-core` 不做事件投递，`L0-bus` 承接投递运行时 | 直接稳定上游 |
| `projects/L0-core/03-详细设计.md` | 协议、事件、outbox boundary、trace、audit 相关章节 | `L0-bus` 可消费的契约形状和边界信号 | 直接稳定上游 |
| `projects/L0-core/07-实施计划.md` | §3 / §4 / §6 | `L0-bus` 后续实现需读取的 core 输出口径与 boundary 关系 | 直接稳定上游 |
| `product/六域模型.md` | 跨域通信规则 | 六域平权、跨域协作走事件、最终一致和订阅方幂等原则 | 全局产品输入 |
| `architecture/仓库拆分方案.md` | §三 L0 共享契约层 / `quantalithos-bus` | `L0-bus` 是事件总线抽象和多后端适配仓，依赖 `L0-core` | 全局架构输入 |
| `architecture/开发路线图与优先级.md` | N0 契约地基 | `L0-bus` 是底座优先校准对象之一 | 全局路线图输入 |
| `architecture/标准对齐全景图.md` | L0 / bus 相关条目 | CloudEvents、W3C Trace Context、可靠投递、审计 tap 等标准对齐方向 | 标准输入 |
| `architecture/bus-draft/README.md` | bus 草案 | 多后端、Outbox、DLQ、tap、replay 等候选需求来源 | 历史草案输入 |
| `architecture/bus-draft/event-catalog.md` | Event Catalog | 事件规模、发布方、订阅方和消费样本 | 历史草案输入 |
| `standards/子项目遵循规范清单.md` | L0-bus 条目 | L0-bus 的仓级强制项和审查要求 | 规范输入 |

### 5.2 承接主题结论

`L0-bus` 承接的不是事件 schema 定义，而是基于 `L0-core` 契约的事件传递运行主干。它的需求主线应围绕以下主题展开：

| 主题 | 说明 |
|---|---|
| 事件发布与订阅 | 发布方和订阅方通过统一 bus 能力传递 `L0-core` 定义的事件包络和 metadata |
| delivery 推进 | 支持 ack、nack、retry、consumer group、delivery history 等运行语义 |
| 失败恢复 | 支持 dead-letter、replay preparation、operator review 和失败材料输出 |
| Outbox relay | 支持业务仓以 outbox boundary 方式把已提交事实交给 bus 推进 |
| tap 与只读消费 | 支持 observability tap、sdk consume view、governance failure material 等只读输出 |
| 后端适配 | 支持不同 MQ 后端的适配边界，但 P0 范围后续再定 |

### 5.3 收束说明结论

```text
L0-core
  defines shared event contracts, metadata, errors, trace context
  |
  v
L0-bus
  delivers, retries, dead-letters, replays, taps, exposes transport views
  |
  v
L1+ / L2 / L3 / L4 / L5 / L6
  publish and consume events without redefining transport truth
```

本图只表达需求来源和依赖方向，不表达具体 runtime 调用链、crate 结构、数据库表或后端 adapter 实现。

---

## 6. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §1。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档诊断”和“回填草稿”小节，了解本章上游来源和承接边界如何收敛。

本文承接已稳定的 `L0-core` 设计结论，以及全局产品、架构、路线图、标准对齐和历史 bus 草案中的相关输入。本文不重新定义 Event、Error、TraceContext、Metadata、ActorRef 或 CloudEvents schema；这些共享契约由 `L0-core` 承载。本文只把这些已成立的共享契约和跨域事件通信原则，收束为 `L0-bus` 的事件传递、订阅推进、失败恢复、重放、死信、Outbox relay、tap 和只读消费需求基线。

| 来源文档 | 承接内容 |
|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 共享事件契约、错误、trace、metadata、outbox boundary、配置和 evidence 口径 |
| `product/六域模型.md` | 六域平权、跨域协作、最终一致和订阅方幂等原则 |
| `architecture/仓库拆分方案.md` | `L0-bus` 位于 L0 共享契约层并依赖 `L0-core` 的分层位置 |
| `architecture/开发路线图与优先级.md` | N0 契约地基中 bus 的优先级和交付关系 |
| `architecture/标准对齐全景图.md` | CloudEvents、W3C Trace Context、可靠投递和审计追踪方向 |
| `architecture/bus-draft/README.md` | 多后端、Outbox、DLQ、tap、replay 等历史候选需求 |
| `architecture/bus-draft/event-catalog.md` | 事件规模、发布方、订阅方和消费样本 |
| `standards/子项目遵循规范清单.md` | L0-bus 的强制规则和评审约束 |

旧 `README.md` 和旧 `00-需求文档.md` 中的 26 仓、三语言 client、四后端全量 P0、`04-实施计划.md` 等口径不直接继承；后续章节将按 27 仓、`00`~`07` 主链和 `L0-core` 已稳定边界重新收束。
```

---

## 7. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `architecture/bus-draft` 的权威级别 | 作为正式需求直接继承 | 作为历史草案和候选输入 | 推荐 B。原因是 bus-draft 包含实现方案和旧范围，不能高于新版需求 SOP 和稳定 `L0-core` |
| Q-002 | `L1-identity` / `L3-method-library` 是否作为上游 | 作为正式上游 | 作为稳定消费样本 | 推荐 B。原因是它们可提供下游案例，但不能反向定义 L0-bus |

当前建议：接受上述推荐后进入 Step 2。

---

## 8. 进入下一步条件

- 已明确 `L0-bus` 直接稳定上游是 `L0-core`。
- 已明确本文不重新定义 Event、Error、TraceContext、Metadata 和 CloudEvents schema。
- 已明确 `architecture/bus-draft` 与 `event-catalog` 只是候选输入和规模样本，不高于新版需求结论。
- 已识别旧文档中需要后续清理的旧口径。
