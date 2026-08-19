# L2-runtime 03 详细设计 Step 1: 确认概要设计输入边界

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: 正式 `03-详细设计.md` 第 1、17 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | 正式 `00-需求文档.md`、`01-架构设计.md`、已完成的 `02-概要设计.md`、02 的 13 个校准产物、详细设计 SOP / 规范、目录规范、专项上游正式链与 blocker 台账 |
| 目标 | 确认哪些概要设计结论足以继续下沉为实现契约，哪些只能保持 seam / pending / blocked |
| 禁止 | 重定义需求 / 架构 / 概要主语；继承旧 `03` 的 ExecutionInstance / WorkItem / PromoteRequest / Python / member container / 固定指标 |
| 门禁 | 本 Step 完成后停审；不得自动进入 Step 2 |

## 1. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 03 直接承接哪些结论？ | 承接 `02` 的八个实现主体、五层分层、32 个对象轮廓、Command / Query / Inbound Event / Outbound Event / Operations Job 分类、关键处理流、局部状态机、异常姿态、配置影响和 03 承接清单。 |
| 代码主体是否稳定？ | 语义主体和层间方向稳定；文件、语言、完整签名、协议二级类型、事务物理承载尚未收稳，须在 03 逐步展开并保留 pending。 |
| 哪些对象 / 接口 / 流 / 状态可继续展开？ | `RuntimeTriggerContext`、`RuntimeAdmissionDecision`、`ControlledRun`、`GoalPlanWorkspace`、`RunProgressDecision`、`RuntimeHistoryEntry`、context/memory、model decision、action/delegation、checkpoint/recovery/outcome/handoff、source/projection views，以及五类 protocol 的语义输入输出和局部状态可继续下沉。 |
| 哪些输入缺口会阻塞正向契约？ | Tools/Sandbox action receipt/feedback/cleanup、safe material route/observed、Core tools schema、model adapter owner、durable memory owner、Runtime Core/Bus/Observability schema、checkpoint transaction/atomicity、entry actor/scope、language/runtime/physical carrying。 |
| 哪些内容不应在 03 重答？ | 需求目标、架构上下文、owner 归属、全局顺序、产品入口、外部 truth、provider 控制、测试结果、验收 verdict 与实施排期。 |

## 2. 上游关系映射

| 来源文档 | 已收稳承接内容 | 03 继续展开 |
|---|---|---|
| `projects/L2-runtime/00-需求文档.md` | 五能力、FR/BR/NFR、能力级接口、数据归属和验收否决 | 每个 capability 的实现模块、对象、协议、处理流、状态和测试切口。 |
| `projects/L2-runtime/01-架构设计.md` | 八架构单元、依赖方向、所有权、一致性、通信和横切红线 | 目录/层级、port 方向、事务边界、错误映射、projection 与 handoff 契约。 |
| `projects/L2-runtime/02-概要设计.md` | 八主体、32 对象轮廓、接口分类、关键流、状态和配置影响 | 完整字段、函数签名、协议二级类型、状态矩阵、持久化/并发/错误/测试切口。 |
| `projects/L2-runtime/design-calibration/02_hld_step_04_code_skeleton.md` | 五层实现分层与边界接缝 | 具体 planned module/file 映射；语言与 physical carrying 仍 not_selected。 |
| `projects/L2-runtime/design-calibration/02_hld_step_05_main_parts.md` | 八主要部分职责与边界 | 每模块 capability、owner、对象与接缝闭口。 |
| `projects/L2-runtime/design-calibration/02_hld_step_06_key_objects.md` | 对象候选、字段类型骨架、状态、函数骨架 | 领域不变量、完整字段来源、构造入口、函数副作用。 |
| `projects/L2-runtime/design-calibration/02_hld_step_07_api_outline.md` | Command / Query / Event / Job 语义分类 | public DTO、metadata、idempotency、error/receipt/result schema。 |
| `projects/L2-runtime/design-calibration/02_hld_step_08_processing_flows.md` | 15 条关键处理流及失败姿态 | 函数级调用链、UoW、port 读写面、提交顺序和恢复分支。 |
| `projects/L2-runtime/design-calibration/02_hld_step_09_state_machine.md` | 多局部状态族、禁止迁移和 unknown 语义 | 转换矩阵、触发函数、非法迁移错误和测试回指。 |
| `projects/L2-runtime/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 异常分类、边界、降级与 fail-closed | 错误类型、映射、补偿 / manual review 和重入保护。 |
| `projects/L2-runtime/design-calibration/02_hld_step_11_configuration_impact.md` | 配置影响和不可配置红线 | config reference / validator / injection contract；具体填写留 04。 |
| `projects/L2-runtime/design-calibration/02_hld_step_12_ddd_handoff.md` | 03 展开清单与主语回退规则 | 逐模块完成实现级闭环。 |
| `projects/L2-runtime/design-calibration/02_hld_step_13_risks_open_questions.md` | blocker 与风险的当前安全姿态 | 在每个受影响契约旁显式标记 pending / blocked。 |

## 3. 本文不再回答

- 不再回答 Runtime 为什么存在、五能力和八架构单元是否属于本仓。
- 不再回答 Tools、Capability Hub、Method Library、Governance、Sandbox、Observability、Artifact、provider、durable memory、Bus、SDK 的 truth owner。
- 不再改写只有 `L0-core` 是 compile 候选、其余按 runtime/event/ref/adapter/fake seam 的全局裁剪结论。
- 不再把旧 `ExecutionInstance`、`ExecutionStep`、`WorkItem`、`ImplementationPlan`、`PromoteRequest`、Python、StateGraph、member container、UDS 或旧固定指标作为实现输入。
- 不在本文件声明实现仓存在、代码已实现、测试已执行、artifact/report/evidence/readiness/acceptance 已成立。

## 4. 本文必须回答

- 五层实现分层如何映射到 planned module / file / package 边界，并且不把 seam 伪装成 compile dependency。
- 每个模块的 capability、对象、字段来源、不变量、函数、trait/port、协议、处理流和状态如何闭环。
- 每个协议的 metadata、idempotency、correlation、result/ref/receipt、visibility、freshness、degraded surface 如何可落码。
- 每个处理流的事务内外边界、外部调用、outbox/projection/handoff 副作用和失败分支如何表达。
- checkpoint stable point、commit-unknown、unknown side effect、late/duplicate feedback、local outcome first 的实现约束。
- 配置引用、审计埋点、测试切口与实施计划承接如何回指前述契约。
- 未闭合 upstream seam 和未选择语言如何阻止正向实现而不阻止安全边界设计。

## 5. 输入不足风险

| ID | 缺口 | 对 03 的影响 | 当前口径 |
|---|---|---|---|
| `L2R-UP-001~008` | 上游执行、事件、观察、model、memory 和 shared schema 未完全闭口 | 相关 positive adapter、receipt、route、observed、readiness 无法定稿 | `pending` / `blocked` / `fail-closed`，只定义 local seam。 |
| `L2R-CP-001` | checkpoint persistence / transaction / atomicity / commit-unknown 未闭合 | persistence port 可定义，物理 adapter 与 recovery qualification 不可声明 | `blocked` / explicit unknown。 |
| `L2R-ENTRY-001` | actor / scope 与 member/product entry 未校准 | 入口协议只允许 capability-level boundary | `pending`，不固定产品 API。 |
| `L2R-LANG-001` | 实现语言、runtime、物理承载未选择 | 不能以 Rust/Cargo/DB/serialization 作为已选事实 | `not_selected`；03 采用语言中立实现契约，Rustdoc 形态仅作为注释规范参考，不代表技术决策。 |
| `L2R-UP-008` | Method Library 03 有未提交改动 | 不可声称 immutable commit baseline | 只引用当前 workspace formal content，不写 commit/hash。 |

## 6. 旧详细设计污染诊断

旧 `projects/L2-runtime/03-详细设计.md` 的执行实例、步骤、工作项、promote、member-service、Python/Rust、DB、RPC、固定测试和 readiness 均标为 `historical_material`。它们不进入本轮对象、模块、协议或处理流输入；如出现同名词，必须从当前 `02` 对象轮廓重新证明 owner 和字段来源。

## 7. 回填草稿

正式第 1 章回填上游关系映射、本文不再回答和本文必须回答清单。正式第 17 章引用输入不足风险；详细诊断、旧材料差异和停审记录保留在本中间产物。

## 8. Step 1 门禁

| 检查项 | 结果 |
|---|---|
| 直接输入限定为当前 `00/01/02` 与已读校准产物 | pass |
| 旧 `03` 只作历史污染审计 | pass |
| 上游 blocker 逐项保留，未生成正向事实 | pass |
| 03 必须回答的实现问题已列全 | pass |
| 语言未选择状态未被绕过 | pass |
| 未提前创建 Step 2 文件 | pass |

```text
gate_status = done_stop_review
next_allowed_action = user_confirmation_then_create_03_ddd_step_02_scope
formal_03_write_allowed = false
future_step_files_allowed = false_until_step_02_start
```
