# L2-runtime 02 概要设计全量校准流程

> 创建日期: 2026-08-07
> 状态: completed_stop_review
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L2-runtime`
> 正式文档目标: `projects/L2-runtime/02-概要设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮边界: 用户已授权完成 02；Step 1~14 已完成，当前停审等待用户确认，不自动进入 03。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 14 正式概要设计装配 | `formal_assembly` | `closed_stop_review` | 正式 14 章、32 个独立对象、五类接口、关键处理流、局部状态、异常、配置、03 承接、风险 / 待确认与参考均已装配并通过反查。 | 等待用户审查正式 `02-概要设计.md`;只有再次明确授权后才可进入 03。 | `02_hld_step_14_formal_assembly.md`;`projects/L2-runtime/02-概要设计.md` |

## 2. 执行纪律

- 严格按概要设计 SOP `Step 1 -> Step 14` 推进，不合并、不跳步。
- 每个 Step 独立创建 `02_hld_step_*.md`；未来 Step 文件不得提前创建或写占位框架。
- 正式 `02-概要设计.md` 已在 Step 14 删除并重建；完成态下不得再次修改，除非用户审查要求回开受影响 Step。
- Step 1 只确认上游输入边界，不展开代码主体、对象、接口、处理流或状态机。
- 概要设计已按规范写入对象名、字段类型和函数参数类型骨架；未下沉完整实现。
- 详细字段、完整函数实现、DDL、完整协议 schema、部署参数和测试结果不进入概要设计输入边界。
- 不确定项保持 `pending` / `blocked` / `waiting` / `degraded` / `fail-closed`；不得伪造 ready、implemented、tested、evidence 或 acceptance。
- 正式章节必须列出具体 `design-calibration` 来源，并且只承载已确认结论。

## 3. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `02_hld_step_01_upstream_boundary.md` | 确认上游输入边界 | completed_continuous_authorization | pass | 进入 Step 2 | 需求 / 架构承接表、不再回答 / 必须回答清单闭合。 |
| 2 | `02_hld_step_02_goals_scope.md` | 明确本仓设计目标与当前范围 | completed_continuous_authorization | pass | 进入 Step 3 | 目标、非范围和概要深度明确。 |
| 3 | `02_hld_step_03_constraints.md` | 收稳约束条件 | completed_continuous_authorization | pass | 进入 Step 4 | 影响对象、接口、流程、状态的硬约束闭合。 |
| 4 | `02_hld_step_04_code_skeleton.md` | 代码主体框架映射 | completed_continuous_authorization | pass | 进入 Step 5 | 业务组成部分到代码主体和实现分层映射闭合。 |
| 5 | `02_hld_step_05_main_parts.md` | 主要组成部分、职责与边界 | completed_continuous_authorization | pass | 进入 Step 6 | 主要部分逐个停审，跨部分闭环无冲突。 |
| 6 | `02_hld_step_06_key_objects.md` | 关键对象轮廓 | completed_continuous_authorization | pass | 进入 Step 7 | 对象候选、字段 / 状态 / 函数骨架和边界闭合。 |
| 7 | `02_hld_step_07_api_outline.md` | API / 接口骨架 | completed_continuous_authorization | pass | 进入 Step 8 | Command / Query / Event / Job seam 可追溯。 |
| 8 | `02_hld_step_08_processing_flows.md` | 关键处理流 / 函数数据流 | completed_continuous_authorization | pass | 进入 Step 9 | 处理流、关键函数和失败分支闭合。 |
| 9 | `02_hld_step_09_state_machine.md` | 状态机与状态流转 | completed_continuous_authorization | pass | 进入 Step 10 | 状态集合、迁移、禁止迁移和 feedback 语义闭合。 |
| 10 | `02_hld_step_10_exceptions_boundaries.md` | 异常与边界场景轮廓 | completed_continuous_authorization | pass | 进入 Step 11 | 异常分类、边界场景和降级姿态可追溯。 |
| 11 | `02_hld_step_11_configuration_impact.md` | 配置影响轮廓 | completed_continuous_authorization | pass | 进入 Step 12 | 配置影响和禁止配置化边界明确，不生成 04 配置事实。 |
| 12 | `02_hld_step_12_ddd_handoff.md` | 详细设计承接清单 | completed_continuous_authorization | pass | 进入 Step 13 | 对象、接口、流程、状态和风险的 03 承接闭合。 |
| 13 | `02_hld_step_13_risks_open_questions.md` | 设计风险与待确认事项 | completed_continuous_authorization | pass | 进入 Step 14 | 风险与待确认分开，保留 upstream blocker。 |
| 14 | `02_hld_step_14_formal_assembly.md` | 整理正式概要设计文档 | completed_stop_review | pass | 等待用户审查 | 正式 14 章来源完整，不新增结论；已停审。 |

## 4. 公共输入与历史材料

| 输入 | 定位 | 本概要设计用法 |
|---|---|---|
| `projects/L2-runtime/00-需求文档.md` | current_baseline | 承接能力、功能、规则、数据、接口、NFR、验收边界；不重写需求。 |
| `projects/L2-runtime/01-架构设计.md` | current_confirmed_upstream | 唯一架构结构基线；下沉代码主体、对象、接口、流程和状态骨架。 |
| `projects/L2-runtime/design-calibration/01_arch_step_*.md` | architecture_decision_detail | 按需追溯架构取舍、数据所有权、通信、横切和 blocker。 |
| `standards/document/概要设计讨论流程_SOP.md` | normative_process | 定义 Step 1~14、主要组成部分小循环和门禁。 |
| `standards/document/概要设计书写规范.md` | normative_result | 定义正式 14 章、对象 / 接口 / 流程 / 状态骨架粒度。 |
| `standards/document/设计文档讨论中间产物规范.md` | normative_process | 定义三层台账、逐步写入、恢复顺序和 future Step 禁止。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | normative_dependency | 约束 compile / runtime / event / ref / adapter / fake 分类。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | normative_truth | 约束 owner、consumer、handoff、failure 和 evidence 边界。 |
| `projects/L2-tools/00~07`、Capability Hub、Sandbox、Observability、Method Library | current_upstream_with_open_seams | 只承接正式 owner contract / seam；未闭合项保持 pending。 |
| `projects/L0-core` / `L0-bus` / `L0-sdk` / `L1-governance` / `L1-artifact` | foundation_and_truth_inputs | Core compile candidate；Bus event seam；治理 / artifact 只消费 truth。 |
| 旧 `projects/L2-runtime/02-概要设计.md`、README、旧 03/05/06 | historical_material | 只做污染审计，不直接继承对象、API、流程、状态、技术栈或实现事实。 |

## 5. 当前门禁

```text
document_status = completed_stop_review
current_step = 14
current_module = formal_assembly
gate_status = closed_stop_review
gate_reason = formal_02_complete_pending_user_review
next_allowed_action = user_review_02_and_explicit_authorization_for_03
formal_02_write_allowed = false
future_step_files_allowed = false_until_user_authorization_for_03
next_formal_document_allowed = false_until_user_authorization_for_03
commit_required = false
```
