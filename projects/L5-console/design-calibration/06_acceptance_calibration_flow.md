# L5-console 06 验收标准校准流程

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/验收标准书写规范.md`
> 目标正式文档：`projects/L5-console/06-验收标准.md`
> 启动日期：2026-09-19
> 当前状态：Step 1～15 `done / pass / self_reviewed`；正式 06 `formal_stop_review`；不得进入 07，须等待用户明确授权

## 1. 执行边界

- 用户已明确授权“完成全部 06”；允许 Step 1～15 严格串行推进并在 Step 15 full-restart 重建正式 06，完成后必须停审，不授权进入 07。
- 当前 agent 单独完成全部阅读、分析、写入和审计；禁止 sub-agent、worker、agent team 或并行代理。
- 只修改 `projects/L5-console/` 下 06 calibration、正式 06 和项目设计台账；不实现代码、不创建实现仓、不运行测试、不创建执行证据、不提交 commit。
- 正式 00～05 是当前真相源；旧正式 06、README 与 draft 只作 `historical_material` 和污染审计输入，不得增量继承。
- `L1-governance`、`L1-artifact`、`L1-workspace` 的 06 及 calibration 只提供 15-Step、裁决矩阵、证据闭环和停审粒度参考，不迁移服务端、DB、UoW、outbox、worker/job 或领域 truth。
- 目标实现仓、交付 commit/build/image、环境、固定 run、artifact、report、evidence instance、缺陷记录、风险接受、verdict、signoff 与 readiness 当前均不存在。
- 本轮可完成“未来如何裁决”的验收合同；当前实际送验生命周期只能是 `not_entered / blocked_by_missing_baseline`，不是“通过/有条件通过/不通过”三值 verdict。

## 2. 三层门禁

| 层级 | 当前状态 | 规则 |
|---|---|---|
| 项目级 | `06_authorized` | 允许完成 06；禁止进入 07、实现、测试执行或提交 |
| 文档级 | `formal_stop_review` | Step 15 装配、静态审计和事实诚实审计已完成；正式 06 写入关闭 |
| Step 级 | Step 15 `done / pass / self_reviewed` | 15 个 Step 均已单独创建、审查并关闭；不得自动进入 07 |
| 正式正文 | `formal_06_write_allowed=false` | full-restart 已完成；后续只允许审阅，不得继续写入 06 |

## 3. 固定裁决语义

| 主题 | 固定口径 |
|---|---|
| 文档状态 vs verdict | `formal_stop_review` 只表示验收标准设计停审，不表示交付验收通过 |
| 验收生命周期 | `not_entered / entered / decision_pending / decided`；`not_entered` 不是三值 verdict |
| Verdict | 实际验收只允许 `通过 / 有条件通过 / 不通过` |
| P0 safety | deterministic safety、negative、semantic、static 与 evidence integrity 必须满足 |
| Conditional positive | 仅当 baseline 声明 facet enabled 时变为 required；未 enabled 时必须诚实 blocked/read-only/partial |
| Evidence | 八个 `EV-*-001` 是 future family；instance 必须绑定 fixed run、suite、artifact/report 和 digest |
| VETO | 只使用正式 `VETO-CON-001～007`；任何命中总体不通过且不可风险接受 |
| Evidence fraud/integrity | 作为 S 级和送验无效门禁；不另造第八个产品 VETO |
| Production readiness | 不由 profile、UI、diagnostic、测试计数、release report 或本 06 自动推导 |

## 4. Step 状态台账

| Step | 主题 | 中间产物 | 状态 | 正式回填 |
|---|---|---|---|---|
| 1 | 验收输入边界 | `06_acceptance_step_01_input_boundary.md` | `done / pass / self_reviewed` | §1 |
| 2 | 验收目标与范围 | `06_acceptance_step_02_scope.md` | `done / pass / self_reviewed` | §2 |
| 3 | 验收基线 | `06_acceptance_step_03_baseline.md` | `done / pass / self_reviewed` | §3 |
| 4 | 进入与退出条件 | `06_acceptance_step_04_entry_exit.md` | `done / pass / self_reviewed` | §4 |
| 5 | 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | `done / pass / self_reviewed` | §5 |
| 6 | 数据与架构红线 | `06_acceptance_step_06_data_arch_redlines.md` | `done / pass / self_reviewed` | §6 |
| 7 | 接口、事件与跨仓同步 | `06_acceptance_step_07_interfaces_events_sync.md` | `done / pass / self_reviewed` | §7 |
| 8 | 状态、事务与一致性 | `06_acceptance_step_08_state_tx_consistency.md` | `done / pass / self_reviewed` | §8 |
| 9 | 非功能门禁 | `06_acceptance_step_09_nonfunctional.md` | `done / pass / self_reviewed` | §9 |
| 10 | 可观测、审计与证据 | `06_acceptance_step_10_observability_evidence.md` | `done / pass / self_reviewed` | §10 |
| 11 | 一票否决 | `06_acceptance_step_11_veto.md` | `done / pass / self_reviewed` | §11 |
| 12 | 缺陷、复验与放行 | `06_acceptance_step_12_defects_retest_release.md` | `done / pass / self_reviewed` | §12 |
| 13 | 风险接受与遗留 | `06_acceptance_step_13_risk_acceptance.md` | `done / pass / self_reviewed` | §13 |
| 14 | 最终结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` | `done / pass / self_reviewed` | §14 |
| 15 | 正式文档装配 | `06_acceptance_step_15_formal_document_assembly.md` + 正式 06 | `done / pass / self_reviewed` | 全文 / §15 |

## 5. 权威输入

| 输入 | 用途 |
|---|---|
| 正式 00 | 7 core AC、13 functional AC、7 BR AC、5 DR AC、7 NFR AC 与 7 VETO 的裁决起点 |
| 正式 01 | SDK-only、owner truth、依赖类型、数据所有权、横切与架构红线 |
| 正式 02 | 五组成部分、对象/接口/flow/state/exception 骨架 |
| 正式 03 | 十模块、5 Command、16 Query、1 conditional consumer、0 Event/Job、状态/side effect/错误/并发 truth |
| 正式 04 | 四项配置、三 profile、strict whole-document、startup-only 与 failure posture |
| 正式 05 | 96 TC、suite/gate、八 EV family、entry/exit、defect、evidence、regression 与 residual |
| 05 Step 13～15 | evidence 资格、风险移交、正式装配事实与 06 必须收口事项 |

## 6. 当前恢复点

```text
current_document = 06-验收标准.md
current_step = 06_acceptance_step_15_formal_document_assembly (done)
current_module = acceptance-cross-gate-audit-and-formal-assembly
gate_status = formal_stop_review
next_allowed_action = wait_for_explicit_07_authorization
formal_06_write_allowed = false
formal_07_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 7. Step 15 收口审计

| 审计项 | 结果 |
|---|---|
| 正式章节与来源 | 15/15 章节、15/15 calibration 来源映射通过；§5 20/20 功能项保留精确 `EV-*-001` 列表。 |
| 计数与协议 | `AC-CON=7`、`AC-FR=13`、`AC-BR=7`、`AC-DR=5`、`AC-NFR=7`、`VETO=7`；5 Command、16 Query、1 conditional consumer、0 Event、0 Job；Query write=0。 |
| 证据与事实 | 八 family 仅为 future contract；evidence instance、run、artifact、report、defect、risk acceptance、verdict、signoff、readiness 均为 0/不存在。 |
| 历史污染 | 旧 workspace/panel/provider、DB/API 泛证据、固定阈值和技术框架未进入规范性正文。 |
| 工作树检查 | `git diff --check -- projects/L5-console` 通过；未提交 commit。 |
| 结论 | Step 15 `done / pass / self_reviewed`；文档 `formal_stop_review`；06 写入关闭，停在 06。 |
