# L2-member-images 03 详细设计全量校准流程

> 创建日期：2026-08-25  
> 最近更新：2026-09-01  
> 状态：`completed_stop_review`（正式 03 已完成 Step 19 装配、自检与 historical pollution audit；等待用户再次明确确认后才可进入 04）  
> 文档模式：`full-restart`  
> 设计仓：`/home/aris/Projects/quantalithos-design`  
> 项目目录：`projects/L2-member-images`  
> 正式文档目标：`projects/L2-member-images/03-详细设计.md`  
> 项目级台账：`design-calibration/project_execution_ledger.md`

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 19 已完成并停审 | `formal_document_assembly` | `user_confirmation_required` | 正式 03 已按 full-restart 装配，Step 19 自检、historical pollution audit 与台账回写均已完成；blocker 仍保持显式开放。 | 等待用户明确确认进入 04；确认后先读 04 SOP/书写规范及启动前通则，再创建 04 calibration flow。 | `03_ddd_step_19_formal_document_assembly.md`;`03-详细设计.md`;`03_ddd_step_18_risks_open_questions.md`;`03_ddd_step_17_implementation_handoff.md` |

## 2. 本轮授权与执行纪律

- 项目内正式文档严格按 `00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07` 串行；03 已完成并停审，04 的文档切换门禁仍未解除。
- 03 内严格按 Step 1→19 串行。Step 19 的 formal assembly、historical pollution audit、自检和台账回写已完成；未经用户再次明确确认不得创建 04 flow、读取 04 讨论输入或进入 04。
- 每次恢复先读项目台账、本文档 flow 和当前 Step 文件。每个 Step 都必须包含问题回答、诊断、改动前后、取舍、结构化产物、回填草稿、待确认与下一步门禁。
- 旧 README 和旧正式 `00/01/02/03/05/06` 均为 `historical_material`；本轮仅承接已收稳的重建版 00~02。旧正式 03 仅可在 Step 19 的后置污染审计开放，当前不得读取或继承。
- 只修改 `projects/L2-member-images/` 下设计文档和 calibration 材料；不创建实现仓、不实现代码、不写 Cargo 文件、不修改其他项目、不提交 commit。
- `L2-member` 与 `L2-member-service` 处于并行讨论窗口；其内容仅为 owner / direction / pending placeholder。所有依赖须区分 `compile/runtime/event/ref/adapter/fake`，不得从消费关系推导源码依赖。
- `MI-UP-001~009`、`Q-MI-001~004` 持续有效：仅可展开本仓 product-neutral、fail-closed、gap-visible 契约；不得私造 exact DTO、route、topic、产品、gate inventory、digest、report、evidence、readiness 或 positive confirmation。
- 用户已要求 Step 5~9 参照 `L1-governance` 的粒度与格式。执行时继承其逐模块/对象/接缝/协议/flow、分批停审和跨项闭环审计方法；不得复制其治理领域、outbox、publisher、外部产品或已闭合 positive contract。详细适配规则见 `03_ddd_step_05_to_09_governance_granularity_alignment.md`。

## 3. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `03_ddd_step_01_upstream_boundary.md` | 确认概要设计输入边界 | `completed_pass` | `pass` | 已由 Step 2 承接 | 上游关系、不再回答 / 必须回答、输入缺口与 03 推进上限闭合。 |
| 2 | `03_ddd_step_02_scope.md` | 明确本轮实现范围和非范围 | `completed_pass` | `pass` | 已由 Step 3 承接 | 模块、接口、流程、下游文档边界与实现者交付面明确。 |
| 3 | `03_ddd_step_03_constraints.md` | 收稳编码规范、语言 / runtime、仓库约束 | `completed_pass` | `pass` | 已由 Step 4 承接 | Rust、rustdoc、仓库、依赖与安全边界可约束代码形态。 |
| 4 | `03_ddd_step_04_file_layout.md` | 收稳实现单元与文件布局 | `completed_pass` | `pass` | 已由 Step 5 承接 | planned crate / module / file layout、命名与依赖边界可供后续对象归属。 |
| 5 | `03_ddd_step_05_module_contracts.md` | 定义模块实现契约主轴 | `completed_stop_review` | `pass` | 已由用户确认进入 Step 6 承接 | 模块职责、暴露面、依赖方向与对象 / port / handler 归属稳定；每模块独立责任卡、文件/对象归属与测试切口预告按 L1-governance 粒度补强。 |
| 6 | `03_ddd_step_06_object_contracts.md` | 逐模块定义对象实现契约 | `completed_stop_review` | `pass` | 等待用户明确确认 Step 7 | 已完成批次/顺序/non-core closure、shared carrier、五个 domain capability、application、infra、entry decision、字段来源、状态/命名/typed-ref审计与 Step 7承接；不得创建 Step 7。 |
| 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` | 逐模块定义 Trait / Port / Adapter 契约 | `completed_stop_review` | `pass` | 已由 Step 8 承接 | 已按 7.0~7.6 闭合 application-owned port、infra implementation/fake、entry restrictions与 cross-seam audit；无 outbound publisher/outbox port。 |
| 8 | `03_ddd_step_08_protocol_contracts.md` | 定义 API / Command / Query / Event / Job 协议契约 | `completed_stop_review` | `pass` | 已由 Step 9 承接 | 已完成 command/query/conditional inbound/job 分批、独立 schema、构造闭环、跨协议审计；outbound event inventory 严格为零；正式 03 禁止装配。 |
| 9 | `03_ddd_step_09_function_flows.md` | 逐接口定义函数级处理流 | `completed_stop_review` | `completed_stop_review` | 等待用户明确确认 Step 10 | 28 条非出站 logical surface 均有独立 flow、逐 flow 停审和 final audit；B01/B02 与上游 pending 已显式保留；不得自动创建 Step 10。 |
| 10 | `03_ddd_step_10_state_matrices.md` | 定义状态机与转换矩阵 | `completed_stop_review` | `pass` | 等待用户明确确认 Step 11 | 已完成状态主语筛选、20 个 local lifecycle subject 的逐机矩阵、跨审计和回填草稿；未闭合 positive path 保持 pending，正式 03 仍禁止装配。 |
| 11 | `03_ddd_step_11_persistence_consistency.md` | 定义持久化、事务与一致性契约 | `completed_stop_review` | `pass_with_explicit_blockers` | 已由用户确认进入 Step 12 承接 | local store、repository、transaction、一致性、回填与跨 Step 审计已完成；B01/B02、B03、MI-UP/Q-MI、PF-UNAVAILABLE-RECOVERY 保持开放。 |
| 12 | `03_ddd_step_12_error_recovery.md` | 定义错误模型、异常分支与恢复口径 | `completed_stop_review` | `pass_with_explicit_blockers` | 等待用户明确确认 Step 13 | 错误类型、映射、异常分支、恢复与跨 Step 审计已完成；B01/B02、B03、MI-UP/Q-MI 与 `PF-UNAVAILABLE-RECOVERY` 仍开放。 |
| 13 | `03_ddd_step_13_concurrency_idempotency.md` | 定义并发、幂等与重入保护 | `completed_stop_review` | `pass_with_explicit_blockers` | 等待用户明确确认 Step 14 | 并发场景、key/opaque stable input、duplicate/partial failure、重入保护和测试切口已完成；B01/B02、B03、`DDD-S13-OPEN-01/02`、MI-UP/Q-MI 与 PF recovery仍开放。 |
| 14 | `03_ddd_step_14_config_dependencies.md` | 定义配置引用与外部依赖绑定 | `completed_stop_review` | `pass_with_explicit_blockers` | 已由用户确认进入 Step 15 承接 | 已完成配置读取边界、slot/runtime composition、外部依赖分类、前序闭环审计和回填草稿；未装配正式 03。 |
| 15 | `03_ddd_step_15_observability_audit.md` | 定义可观测性与审计埋点契约 | `completed_stop_review` | `pass_with_explicit_blockers` | 等待用户明确确认 Step 16 | 已完成 local log、metric、span、audit cut、redaction 与跨 Step 审计；当前不得进入 Step 16 或装配正式 03。 |
| 16 | `03_ddd_step_16_test_seams.md` | 定义测试切口与最小验证清单 | `completed_stop_review` | `pass_with_explicit_blockers` | 等待用户明确确认 Step 17 | 已完成模块、逻辑接口、状态机、一致性/幂等、config/fake/redaction切口与跨 Step 审计；未执行测试，B01/B02、B03、OPEN、PF、MI-UP/Q-MI 仍显式开放。 |
| 17 | `03_ddd_step_17_implementation_handoff.md` | 收口详细设计到实施计划的承接清单 | `completed_stop_review` | `pass_with_explicit_blockers` | 等待用户明确确认 Step 18 | 已完成承接/阅读/字段/DTO/Query/状态/命名/phase-boundary 预复核与 blocker 回流；不定义 phase、commit、实现、测试或证据。 |
| 18 | `03_ddd_step_18_risks_open_questions.md` | 风险与待确认事项 | `completed_stop_review` | `pass_with_explicit_blockers` | 等待用户明确确认 Step 19 | 风险、影响、owner、重开条件与未确认前处置已收口；所有 local / owner blocker 保持开放。 |
| 19 | `03_ddd_step_19_formal_document_assembly.md` | 整理正式详细设计文档 | `completed_stop_review` | `user_confirmation_required` | 等待用户明确确认进入 04 | 正式 03 已完成装配、自检、historical pollution audit 和停审回写；04、实施、测试执行和 commit 仍未授权。 |

## 4. 当前输入准入

| 输入 | 定位 | 本轮用法 |
|---|---|---|
| 重建版 `00-需求文档.md` | 已停审的需求基线 | 承接能力、规则、owner、依赖、质量与 VETO 边界，不重写需求。 |
| 重建版 `01-架构设计.md` | 已停审的架构基线 | 承接 BC / LS、分层、依赖方向、truth / projection 与 ADR 约束，不重写架构。 |
| 重建版 `02-概要设计.md` | 详细设计直接输入 | 承接五个业务部分、正交实现层、对象 / 接口 / 流 / 状态骨架与 03 handoff。 |
| `02_hld_step_12/13` | 03 具体承接与风险输入 | 确定可下沉对象与 pending 上限；不得转换为 external positive contract。 |
| Rust / 文档 / 目录组织规范 | normative | 约束本轮的代码形态、命名、逐 Step 中间产物与正式装配方式。 |
| 正式上游项目文档和台账 | owner input | 只消费已正式闭口的 owner 边界；尚未闭口字段保持 pending。 |
| `L2-member`、`L2-member-service` 进行中材料 | sibling placeholder | 只记录 owner、方向与 gap，不能形成双方合同。 |
| 旧正式 03、旧 README 与 `draft/` | historical / non-normative | 旧正式 03 已仅在 Step 19 用于 historical pollution audit；其余不作为详细设计 authority，也不能成为 04 输入。 |

## 5. 当前门禁

```text
document_status = completed_stop_review
current_step = 19_formal_document_assembly_completed
current_module = waiting_for_user_document_transition_confirmation
gate_status = user_confirmation_required
gate_reason = Formal 03 assembly, self-check and historical pollution audit completed on 2026-09-01. Explicit user confirmation is required before any 04 reading, calibration-flow creation or other downstream work. Existing design blockers remain open.
next_allowed_action = wait_for_user_explicit_confirmation_to_enter_04
user_authorized_through = step_19
step_06_creation_allowed = true
step_07_creation_allowed = true
step_08_creation_allowed = true
step_09_creation_allowed = true
step_10_creation_allowed = true
step_11_creation_allowed = true
step_12_creation_allowed = false_after_stop_review
step_13_creation_allowed = false_after_stop_review
step_14_creation_allowed = false_after_stop_review
step_15_creation_allowed = false_after_stop_review
step_16_creation_allowed = false_after_stop_review
step_17_creation_allowed = true_user_confirmed_2026-08-31
step_17_in_progress = false
step_17_completed_stop_review = true
step_18_creation_allowed = true_user_confirmed_2026-09-01
step_18_in_progress = false
step_18_completed_stop_review = true
step_19_creation_allowed = true_user_confirmed_2026-09-01
step_19_in_progress = false
step_19_completed_stop_review = true
formal_03_write_allowed = false_after_stop_review
old_formal_03_read_allowed = false_except_authorized_historical_audit_reopen
step_04_flow_creation_allowed = false_pending_explicit_user_confirmation
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
