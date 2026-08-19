# L2-runtime 06 验收标准全量校准流程

> 重开日期：2026-08-18
> 当前模式：`full-restart + single-agent-serial + continuous-user-authorization`
> 正式目标：`projects/L2-runtime/06-验收标准.md`
> 适用 SOP：`standards/document/验收标准讨论流程_SOP.md`
> 适用规范：`standards/document/验收标准书写规范.md`
> 事实边界：本流程只定义未来验收裁决合同；当前没有送验版本、固定 run、artifact、report、evidence instance、defect closure、risk acceptance、verdict、signoff 或 readiness。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|
| Step 15 | `formal_document_assembly` | `closed_stop_review` | 正式 06 已删除旧历史文件并按 15 章主链重建；跨门禁、identity、路径、状态和 historical pollution 审计均通过；actual verdict/signoff/readiness 仍为 none | 停审并向用户汇报；未经明确授权不得进入 07 或生成任何实施事实 |

## 2. Full-restart 纪律

- 严格按 Step 1 -> Step 15 独立推进；每个 Step 先更新本 flow 与项目 ledger，再创建对应中间产物。
- 旧正式 `06-验收标准.md`、旧 `06_acceptance_*`、旧 README/07 和旧依赖顺序只作 `historical_material`；旧 18-state、109-EV、旧 TC/suite/report path、旧 risk/status/verdict 不得继承。
- 正式 `06-验收标准.md` 仅在 Step 15 删除重建；Step 1~14 只形成中间产物与正式章节回填草稿。
- 验收主语是 formal `AC-L2R-001~036`、`VF-L2R-001~008` 与当前设计/测试合同；protocol/state/config/evidence gate 是裁决维度，不创建新的产品需求真相。
- 当前 `process_state = not_entered`。缺少送验 tuple 和 evidence 不等于实际 `不通过`；三值 verdict 只能由未来授权裁决绑定一个 valid fixed baseline 后产生。
- P0 门禁必须回指 current formal design、canonical TC、planned EV identity、fixed report path 和裁决影响；planned identity/registry 不得当 evidence。
- G1 local、G2 integration candidate、G3 per-slot positive qualification 分开裁决；blocked positive seam 不得伪装为 pass，也不得无授权缩减 local P0 denominator。
- `compile/runtime/event/ref/adapter/fake` 必须显式区分；运行或事件依赖不得伪装为 Cargo/package dependency。
- 不实现代码、不执行测试、不创建 artifact/report/acceptance package，不伪造 commit/run/evidence/defect/risk/verdict/signoff/readiness。
- 本轮完整 06 闭合后立即停审；不进入或修改 07；不提交 commit。

## 3. Step 总流程

| Step | 中间产物 | 主题 | 状态 |
|---:|---|---|---|
| 1 | `06_acceptance_step_01_input_boundary.md` | 验收输入边界 | `completed_continuous_authorized` |
| 2 | `06_acceptance_step_02_scope.md` | 验收目标与范围 | `completed_continuous_authorized` |
| 3 | `06_acceptance_step_03_baseline.md` | 验收基线 | `completed_continuous_authorized` |
| 4 | `06_acceptance_step_04_entry_exit.md` | 进入与退出条件 | `completed_continuous_authorized` |
| 5 | `06_acceptance_step_05_function_gate.md` | 功能验收门禁 | `completed_continuous_authorized` |
| 6 | `06_acceptance_step_06_data_arch_redlines.md` | 数据边界与架构红线 | `completed_continuous_authorized` |
| 7 | `06_acceptance_step_07_interfaces_events_sync.md` | 接口、事件与跨仓同步 | `completed_continuous_authorized` |
| 8 | `06_acceptance_step_08_state_tx_consistency.md` | 状态机、事务与一致性 | `completed_continuous_authorized` |
| 9 | `06_acceptance_step_09_nonfunctional.md` | 非功能验收 | `completed_continuous_authorized` |
| 10 | `06_acceptance_step_10_observability_evidence.md` | 可观测、审计与证据 | `completed_continuous_authorized` |
| 11 | `06_acceptance_step_11_veto.md` | 一票否决 | `completed_continuous_authorized` |
| 12 | `06_acceptance_step_12_defect_release.md` | 缺陷、复验与放行 | `completed_continuous_authorized` |
| 13 | `06_acceptance_step_13_risk_residual.md` | 风险接受与遗留项 | `completed_continuous_authorized` |
| 14 | `06_acceptance_step_14_verdict_signoff.md` | 最终结论与签署 | `completed_continuous_authorized` |
| 15 | `06_acceptance_step_15_formal_document_assembly.md` | 正式文档装配 | `closed_stop_review` |

## 4. Canonical input baseline

```text
20 core FR + 4 peripheral future FR
44 BR + 19 NFR
36 AC + 8 VF
37 CUT
12 capabilities
17 Commands + 12 Queries + 6 inbound Events + 6 outbound Events + 7 Jobs
31 state subjects
13 external slots + 15 config slices
172 owning raw TC + 5 same-run aggregate TC = 177 TC
177 planned EV identities
8 suites = 35/32/32/16/25/15/17/5
9 mandatory checks
12 blocker/preflight rows
14 residual risks, all not accepted
```

All counts above are design/test-plan facts. They are not implementation, execution, evidence or acceptance facts.

## 5. 当前门禁

```text
current_document = 06-验收标准.md
current_step = Step 15
current_module = formal_document_assembly
gate_status = closed_stop_review
gate_reason = formal_06_rebuilt_15_chapters_and_post_assembly_audit_passed
next_allowed_action = stop_and_report_no_auto_07
formal_06_write_allowed = false_after_completion
future_step_files_allowed = none_until_explicit_user_authorization
process_state = not_entered
actual_baseline_run_evidence = none
actual_verdict_signoff_readiness = none
next_step = none_stop_review
next_step_allowed = false_until_explicit_user_authorization
next_formal_document = none
next_formal_document_allowed = false_until_explicit_user_authorization
commit_required = false
```
