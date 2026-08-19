# L2-runtime 00 需求 Step 1: 与上游文档的关系声明

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 1 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 与上游文档的关系声明 |
| 输出文件 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 通用规范 | 已读取通则、中间产物规范、真相源标准、全局依赖规则 |
| 类型规范 | 已读取需求 SOP 与需求书写规范 |
| 专项输入 | 已读取 L2-tools、Capability Hub、Sandbox、Observability、Method Library、L0、Governance、Artifact 正式链和台账 |
| 历史输入 | 已读取 L2-runtime README 与旧 `00/01/02/03/05/06`,只作污染审计 |
| 正式文档写入 | not_allowed_before_step_17 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 来源权威分层 | done | 来源分类表 | pass |
| SOP 问题回答 | done | 四项回答 | pass |
| 当前文档诊断 | done | 历史污染表 | pass |
| 设计取舍 | done | 来源使用规则 | pass |
| 结构化产物 | done | 正式来源映射候选 | pass |
| 回填草稿 | done | 第 1 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入与来源分层

| 来源层 | 材料 | 使用规则 |
|---|---|---|
| normative authority | 当前六份强制标准 | 决定全局顺序、需求结构、依赖分类和 full-restart 门禁。 |
| direct upstream | `projects/L2-tools/00~07` | Runtime 只消费正式工具行动语义;保留其开放 seam。 |
| truth / control upstream | Capability Hub、Sandbox、Observability、Method Library、Governance、Artifact 正式链 | 只承接各仓 owner 边界、正式引用 / 摘要 / handoff 与 fail-closed 约束。 |
| foundation | L0-core、L0-bus、L0-sdk 正式链 | Core 为共享契约 authority;Bus 为事件主干;SDK 为下游封装面。 |
| granularity reference | Governance、Artifact calibration 与正式链 | 参考 owner、字段闭环、evidence、实施 boundary 粒度,不复制领域结论。 |
| current workspace caveat | Method Library 03 的既有未提交改动 | 可作 current workspace 输入,不得声称 immutable baseline。 |
| historical material | Runtime README、旧 `00/01/02/03/05/06`、外部旧顺序文件 | 只用于差异 / 污染审计,不直接进入正式结论。 |
| blocker input | `L2R-UP-001~008` | 作为 pending / blocked / fail-closed 条件传递,不补造正向事实。 |

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本文承接哪些上游文档? | 承接全局依赖规则、已完成 `L2-tools` 正式链、Capability Hub / Sandbox / Observability / Method Library 正式链、L0 正式契约、Governance 的 Policy / Decision truth 与 Artifact 的正文 / lineage 边界。 |
| 承接哪些主题? | 承接工具行动合同、capability 接入事实、方法 / 角色 / 过程定义、治理结论、隔离执行反馈、安全观测材料、共享契约和事件协作对 Runtime 的输入边界。 |
| 为什么不是重新定义这些主题? | 这些主题已有各自 owner;Runtime 只建立运行循环、决策、上下文、恢复与交接语义,不得复制相邻 truth。 |
| 本文承担什么细化作用? | 将 Runtime 职责细化为需求层的 owner、能力、失败语义、数据归属、能力接口、质量与验收,为后续 `01~07` 提供唯一需求基线。 |

## 4. 当前文档问题诊断

| 历史问题 | 诊断 | 当前处置 |
|---|---|---|
| 旧 `00` 将 `architecture/ai-member设计.md`、旧 README 指标和 ADR 直接写成 authority | 未按当前全局顺序和已校准上游核验 | 全部降级为 historical material。 |
| 旧链把 Runtime 写成 Python 容器内“大脑”并冻结 LangGraph / Temporal / provider | 技术 / 部署 /产品选择提前成为需求事实 | 需求层不锁语言、框架、部署和 provider。 |
| 旧 `02/03` 以 ExecutionInstance、WorkItem promote、artifact/process backflow 为主线 | 混入 process/work/artifact 运行语义,偏离当前目标职责 | 新主线从 runtime loop、context、model、memory、recovery、tool orchestration 重建。 |
| 旧需求把 SDK 写成编译期输入、把 Runtime 直接连外部 provider/vector store | 运行期 / adapter 关系被伪装为 package 或直接真相依赖 | 重新按 compile/runtime/event/ref/adapter/fake seam 分类。 |
| 旧指标、reasoning trace、测试与验收结论 | 没有当前测量 authority,并可能泄漏隐藏推理正文 | 不继承数值;只保留可验证的安全 decision summary / traceability 需求。 |

## 5. 设计取舍

| 取舍 | 采用 | 不采用 | 原因 |
|---|---|---|---|
| 上游顺序 | 当前设计仓全局规则与已完成正式链 | 外部旧顺序文件和旧 README | 当前标准是权威顺序。 |
| Runtime 来源 | owner 边界与正式消费合同 | 从旧 Runtime 对象 / API 反推需求 | full-restart 要求先形成独立结论。 |
| 开放 seam | pending / blocker / fail-closed | 虚构 adapter、route、receipt 或 readiness | 防止 Runtime 私自补上游 truth。 |
| 需求粒度 | 外部可见运行行为与边界 | DTO、port、repository、状态字段和技术栈 | 细节后移 01~04。 |

## 6. 结构化中间产物

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4.1 系统讨论顺序` | `L2-tools -> L2-runtime` 的串行设计位置与三类依赖纪律。 |
| `projects/L2-tools/00-需求文档.md` | `§2`;`§4`;`§10` | Runtime 拥有 action choice / loop / planning / orchestration / recovery,Tools 拥有工具语义合同。 |
| `projects/L2-tools/07-实施计划.md` | `§2`;`§5`;`§8` | `L2T-UP-001~009` 的开放正向 seam 与 blocked-aware 消费边界。 |
| `projects/L3-capability-hub/00-需求文档.md` | `§2`;`§6`;`§12` | capability identity、registry、adapter descriptor、formal exposure 的受控消费边界。 |
| `projects/L3-method-library/00-需求文档.md` | `§2`;`§6`;`§12` | method / role / process definition 的 Definition vs Use 边界。 |
| `projects/L4-sandbox/00-需求文档.md` | `§2`;`§6`;`§12` | isolation execution、capture、failure、handoff 与 cleanup truth 边界。 |
| `projects/L4-observability/00-需求文档.md` | `§2`;`§6`;`§12` | body-free observation / audit projection、安全材料与 no-write truth 边界。 |
| `projects/L1-governance/00-需求文档.md` | `§2`;`§10`;`§12` | Gate / Decision / Policy effective / approval truth,以及 Runtime 只能消费与反馈。 |
| `projects/L1-artifact/00-需求文档.md` | `§2`;`§11`;`§12` | Artifact / version / baseline / evidence / lineage truth 与引用 / handoff 边界。 |
| `projects/L0-core/00-需求文档.md` | `§7`;`§12` | 共享 ID、ref、metadata、error、trace 与 envelope 类别 authority。 |
| `projects/L0-bus/00-需求文档.md` | `§2`;`§7`;`§12` | 已提交事实的事件传递主干,不定义业务事件 schema。 |
| `projects/L0-sdk/00-需求文档.md` | `§2`;`§12` | 下游 SDK 封装正式 API / event 的消费边界。 |

## 7. 回填草稿

本文承接当前全局依赖规则和已完成上游正式设计链,在 `L2-tools` 之后细化 Runtime 运行语义。本文不重新定义工具、能力接入、方法资产、治理裁决、隔离执行、观测存储、Artifact 或 L0 契约,只收束 Runtime 自身的 loop、model decision、goal/plan、context/memory、checkpoint/recovery、sub-agent、action orchestration 与运行事件交接需求。

## 8. 待确认事项

- Model provider 正向 adapter owner、durable episodic / semantic memory owner 和 Runtime-specific event source family 尚未闭口,登记为 `L2R-UP-004~006`。
- 上述事项不阻塞需求边界成文,但阻塞后续正向字段 / 配置 / 联调 / readiness 声明。

## 9. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已区分 authority、upstream、historical、blocker | pass |
| 未把旧 Runtime 设计当当前事实 | pass |
| 未提前写功能、对象、协议或实现 | pass |
| 未重新定义相邻 owner | pass |
| Step 2 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_02_position_boundary
formal_document_write_allowed = false
```
