# L1-conversation 概要设计校准工作台

> 对应文档: `projects/L1-conversation/02-概要设计.md`
> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md`
> 创建日期: 2026-06-01
> 当前目标: 在已完成新版 `00-需求文档.md` 和 `01-架构设计.md` 的前提下,按最新概要设计 SOP 校准 `L1-conversation`。

---

## 1. 本轮校准原则

- 概要设计必须承接新版需求和新版架构,不能回到旧版“Conversation 四形态 / Turn kind / StreamEvents / AG-UI 事件映射”作为主线。
- `L1-conversation` 的概要设计要下沉到代码主体骨架层,但不能提前写完整字段、函数实现、DDL、协议 schema 或部署参数。
- 本轮概要设计必须围绕“Conversation 真相仓”的可实现结构展开:代码主体框架、主要组成部分、关键对象、API / 接口骨架、关键处理流、状态机、配置影响和详细设计承接清单。
- 旧 `02-概要设计.md` 只作为历史输入和问题诊断来源。正式概要设计将在 Step 14 删除旧文件后按新文件标准重建。
- 每个 Step 必须独立落盘、独立更新本文状态,不得合并 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `00-需求文档.md` | 已按需求 SOP 重建 | 作为概要设计需求边界 |
| `01-架构设计.md` | 已按架构 SOP 重建 | 作为概要设计架构边界 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_17_formal_document_assembly.md` | 已完成 | 用于追溯需求结论来源 |
| `design-calibration/01_arch_step_01_requirement_baseline.md` ~ `01_arch_step_16_formal_document_assembly.md` | 已完成 | 用于追溯架构结论来源 |
| `projects/L0-core/00~07` | 已完成深度校准 | 承接共享 ID、ActorRef、TraceContext、metadata、error、evidence、配置和报告口径 |
| `projects/L0-bus/00~07` | 已完成深度校准 | 承接事件发布、订阅、重试、死信、replay、tap 和报告证据口径 |
| `projects/L0-sdk/00~07` | 已完成深度校准 | 承接默认 client / integration access 和 SDK consumer 边界 |
| `projects/L1-identity/00~07` | 已完成深度校准 | 承接成员、AI member、system actor 和 actor 引用来源 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 仅作为历史草案和问题诊断输入 |

---

## 3. Step 状态表

| Step | 主题 | 状态 | 中间产物 |
|---|---|---|---|
| Step 1 | 确认上游输入边界 | 已完成 | `design-calibration/02_hld_step_01_upstream_boundary.md` |
| Step 2 | 明确本仓设计目标与当前范围 | 已完成 | `design-calibration/02_hld_step_02_goals_scope.md` |
| Step 3 | 收稳约束条件 | 已完成 | `design-calibration/02_hld_step_03_constraints.md` |
| Step 4 | 代码主体框架映射 | 已完成 | `design-calibration/02_hld_step_04_code_subject_framework.md` |
| Step 5 | 主要组成部分、职责与边界 | 已完成 | `design-calibration/02_hld_step_05_components_boundary.md` |
| Step 6 | 关键对象轮廓 | 已完成 | `design-calibration/02_hld_step_06_key_objects.md` |
| Step 7 | API / 接口骨架 | 已完成 | `design-calibration/02_hld_step_07_api_interface_skeleton.md` |
| Step 8 | 关键处理流 / 重要函数数据流 | 已完成 | `design-calibration/02_hld_step_08_processing_flows.md` |
| Step 9 | 状态机与状态流转 | 已完成 | `design-calibration/02_hld_step_09_state_machine.md` |
| Step 10 | 异常与边界场景轮廓 | 已完成 | `design-calibration/02_hld_step_10_exceptions_boundaries.md` |
| Step 11 | 配置影响轮廓 | 已完成 | `design-calibration/02_hld_step_11_configuration_impact.md` |
| Step 12 | 详细设计承接清单 | 已完成 | `design-calibration/02_hld_step_12_detailed_design_handoff.md` |
| Step 13 | 设计风险与待确认事项 | 已完成 | `design-calibration/02_hld_step_13_risks_open_questions.md` |
| Step 14 | 整理正式概要设计文档 | 已完成 | `design-calibration/02_hld_step_14_formal_document_assembly.md` |

---

## 4. 当前已收敛的关键决策

| 编号 | 问题 | 当前结论 |
|---|---|---|
| D-HLD-001 | 是否在旧 `02-概要设计.md` 上局部修补 | 否。旧文档作为历史输入,正式文档在 Step 14 删除旧文件后重建。 |
| D-HLD-002 | 概要设计是否继续以四形态、Turn、StreamEvents、AG-UI 为第一层结构 | 否。这些只能作为后续对象、接口或协议候选线索,不能高于 Conversation 真相仓主线。 |
| D-HLD-003 | 概要设计是否只写模块间结构 | 否。概要设计必须下沉到代码主体骨架层,足以支撑后续 `03-详细设计.md`。 |

---

## 5. 下一步

当前已完成 Step 1、Step 2、Step 3、Step 4、Step 5、Step 6、Step 7、Step 8、Step 9、Step 10、Step 11、Step 12、Step 13 和 Step 14。

概要设计校准已完成。下一步可进入:

```text
03-详细设计讨论流程
```
