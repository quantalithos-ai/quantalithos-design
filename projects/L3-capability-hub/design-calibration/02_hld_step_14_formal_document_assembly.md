# L3-capability-hub 02 概要 Step 14: 整理正式概要设计文档

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 回填章节: `projects/L3-capability-hub/02-概要设计.md` 全文
> 生成日期: 2026-07-09
> 状态: 已完成,等待用户审查

---

## 1. 本步目标

把 Step 1 ~ Step 13 已确认的 `L3-capability-hub` 概要设计结论按 `standards/document/概要设计书写规范.md` 的 14 章正式结构重组为 `projects/L3-capability-hub/02-概要设计.md`。

本步只做重组、压缩、润色、术语统一和交叉引用补齐,不新增未经讨论的新概要结论,不把详细设计层内容、项目计划、实施边界、测试证据、验收签署或运维实施细节补进正式概要设计。

---

## 2. Step 开工确认

| 项 | 状态 | 说明 |
|---|---|---|
| 项目级台账 | pass | `project_execution_ledger.md` 显示 `02-概要设计.md` Step 13 已完成并允许用户确认后进入 Step 14。 |
| 文档级 flow | pass | `02_hld_calibration_flow.md` 显示 Step 1~13 已完成,Step 14 为正式装配步骤。 |
| 上游正式文档 | pass | 正式 `00-需求文档.md` 与 `01-架构设计.md` 已作为当前 active baseline。 |
| Step 1~13 中间产物 | pass | `02_hld_step_01_*` 至 `02_hld_step_13_*` 均已存在并完成回填草稿。 |
| 旧正式 `02` | historical_material | 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities`、policy refresh 和 execution gateway 主线不沿用。 |

---

## 3. 正式概要设计文档重组结论

| 正式章节 | 主要来源 | 重组方式 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 摘录上游承接、本文不再回答、本文必须回答和 historical material 降级口径。 |
| §2 本次设计目标与范围 | Step 2 | 摘录 8 个设计目标、非范围和概要设计深度口径。 |
| §3 约束条件 | Step 3 | 摘录结构性约束表和后续章节门禁说明,压缩来源追踪。 |
| §4 代码主体框架总览 | Step 4 | 摘录代码主体映射图、实现分层视图和边界说明。 |
| §5 主要组成部分、职责与边界 | Step 5 | 摘录 8 个主要组成部分、交互总图和 Step 6 展开门禁。 |
| §6 关键对象轮廓 | Step 6 | 摘录对象候选筛选表、核心对象摘要和对象边界说明;完整对象卡片保留在 Step 6。 |
| §7 API / 接口骨架 | Step 7 | 摘录接口分类、Command / Query / Inbound / Outbound / Job / External Port 主表。 |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 摘录处理流分类、覆盖表、通用写路径和重点独立处理流说明。 |
| §9 状态定义与状态流转 | Step 9 | 摘录多状态族定义、状态流转图、允许 / 禁止迁移和状态传播关系。 |
| §10 异常与边界场景轮廓 | Step 10 | 摘录异常场景表、异常影响图和状态机影响说明。 |
| §11 配置影响轮廓 | Step 11 | 摘录配置影响轮廓表、禁止配置化边界、配置影响图和详细设计承接方向。 |
| §12 详细设计承接清单 | Step 12 | 摘录已收稳主语、详细设计继续展开方向和概要回退规则。 |
| §13 设计风险与待确认事项 | Step 13 | 摘录设计风险和待确认事项,保持未闭口问题不被润色成定论。 |
| §14 参考 | Step 14 | 列出实际使用材料及用途。 |

正式文档没有机械粘贴全部中间产物。字段骨架、成员函数骨架、完整接口候选池、逐组成部分 flow、完整状态迁移、异常分类、配置候选和停审记录仍保留在 `design-calibration/02_hld_step_*` 文件中作为延伸阅读。

---

## 4. 章节回填结论

| 中间产物 | 已回填章节 | 回填策略 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | §1 | 保留上游承接、回答边界和旧文档降级口径。 |
| `02_hld_step_02_goals_scope.md` | §2 | 保留目标、非范围和设计深度,不写需求 / 架构重复内容。 |
| `02_hld_step_03_constraints.md` | §3 | 保留会影响后续概要结构判断的约束,删除过程诊断。 |
| `02_hld_step_04_code_subject_framework.md` | §4 | 保留代码主体 map 和实现分层,不写目录 / crate / 文件路径。 |
| `02_hld_step_05_components_boundary.md` | §5 | 保留主要组成部分表和交互图,对象发现细节留在中间产物。 |
| `02_hld_step_06_key_objects.md` | §6 | 保留关键对象类别和核心对象摘要,完整对象骨架作为延伸阅读。 |
| `02_hld_step_07_api_interface_skeleton.md` | §7 | 保留接口类别和主表,不写 HTTP / RPC / topic / DTO schema。 |
| `02_hld_step_08_processing_flows.md` | §8 | 保留处理流族和通用路径,不写完整函数实现、事务和 outbox 机制。 |
| `02_hld_step_09_state_machine.md` | §9 | 保留状态组、主线状态图、禁止迁移和传播关系。 |
| `02_hld_step_10_exceptions_boundaries.md` | §10 | 保留异常落点、影响图和状态影响,不写错误码全集。 |
| `02_hld_step_11_configuration_impact.md` | §11 | 保留配置影响、禁止配置化和详细设计方向,不写 config key / 默认值 / env var。 |
| `02_hld_step_12_detailed_design_handoff.md` | §12 | 保留 `03` 承接清单和回退规则。 |
| `02_hld_step_13_risks_open_questions.md` | §13 | 保留风险 / 待确认拆分和挂起口径。 |

---

## 5. 术语统一结论

| 术语 | 统一口径 |
|---|---|
| `capability access truth` | 本仓拥有的能力接入事实,覆盖 identity、registry、descriptor、seam、relation、formal exposure、trace / impact 和 reference support。 |
| `CapabilityIdentity` | 能力接入事实的稳定身份锚点,不等同 provider 名、URL、runtime config、tool config 或 marketplace listing。 |
| `AdapterDescriptor` | 接入方式、能力类型、风险和约束摘要 truth,不等同旧 `ProviderContract`。 |
| `GovernanceSeamRelation` | capability 与治理结果 / policy result 的 ref / safe summary 关系,不拥有 governance approval、Policy 或 shared_rules truth。 |
| `CapabilityMethodBodyFreeRelation` | capability 与 method asset 的无正文关系,不保存 method body。 |
| `FormalExposureBoundary` | 服务端正式能力暴露 truth,不等同 runtime allow / deny、SDK client 或 query view。 |
| `ControlledConsumerView` | 从 formal exposure 派生的受控消费 snapshot / projection,不得反写 formal exposure。 |
| `ReferenceResolutionState` | 外部 ref 的解析状态,不拥有外部系统 truth。 |
| `Derived material` | search / browse、export、discovery、reconciliation 等可重建只读材料,不得成为第二 truth。 |

---

## 6. 交叉引用结论

- 每个正式章节开头都保留具体 `design-calibration` 校准来源块和延伸阅读入口。
- 正式 `02-概要设计.md` 只承载 Step 1~13 的收口结论,过程诊断、旧材料差异审计和逐模块停审记录留在中间产物中。
- Step 与正式章节不是机械复制关系:Step 是生成流程,正式文档是结果结构。
- Step 6 完整对象骨架没有全文粘贴进正式 §6;正式 §6 保留关键对象总表和核心摘要。
- Step 7 完整逐组成部分接口卡片没有全文粘贴进正式 §7;正式 §7 保留接口分类主表和 port skeleton。
- Step 13 待确认事项未在正式文档中润色为已确认结论。

---

## 7. 参考材料表

| 参考材料 | 用途 |
|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | Step 14 生成流程、输入 / 输出、门禁和禁止新增结论约束。 |
| `standards/document/概要设计书写规范.md` | 正式 14 章结构、校准来源块、状态 / 异常 / 配置 / handoff / 风险 / 参考章节格式。 |
| `standards/document/设计文档讨论中间产物规范.md` | 项目级、文档级、Step 级三层门禁和中间产物回填规则。 |
| `projects/L3-capability-hub/00-需求文档.md` | 需求边界、能力闭环、功能需求、数据归属、接口依赖、验收和风险红线。 |
| `projects/L3-capability-hub/01-架构设计.md` | 架构边界、依赖方向、数据所有权、交互分层、技术机制、ADR 和挂起事项。 |
| `projects/L3-capability-hub/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_13_risks_open_questions.md` | 正式概要各章的校准来源。 |
| `projects/L1-governance` | governance seam 只承接 ref / safe summary、不拥有审批和 Policy truth 的边界参考。 |
| `projects/L3-method-library` | method relation 必须 body-free、不迁入 method body 的边界参考。 |
| `projects/L0-sdk` | SDK exposure 只到服务端 exposure / consumer view handoff,不实现 SDK client 的边界参考。 |
| `projects/L1-governance/design-calibration/02_hld_step_14_formal_document_assembly.md` | Step 14 中间产物粒度和正式装配记录样式参考。 |

---

## 8. 进入下一步条件

- `projects/L3-capability-hub/02-概要设计.md` 已按 14 章正式结构重建。
- 每个正式章节都有具体校准来源块和延伸阅读入口。
- Step 1~13 已确认结论已落入对应正式章节。
- 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities`、policy refresh、execution gateway、cost / billing 和 provider runtime 主线未回流为正式概要结论。
- 未闭环项仍保留在 §13,没有被整理成定论。
- 没有新增未经 Step 1~13 讨论的新概要结论。
- 可以在用户审查确认后进入 `03-详细设计.md` 讨论流程。

next_allowed_action:

```text
wait_user_review_to_03_step_01
```
