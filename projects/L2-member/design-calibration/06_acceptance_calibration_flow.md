# L2-member 06 验收标准校准工作台

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md`
> 正式文档：`projects/L2-member/06-验收标准.md`
> 书写规范：`standards/document/验收标准书写规范.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 粒度参考：`projects/L1-governance/design-calibration/06_acceptance_calibration_flow.md`
> 创建日期：2026-09-03
> 执行模式：`full-restart + single-agent-serial`
> 当前状态：Step 1～15 已按用户“同意 并完成全部 06”授权完成；正式 06 已装配并停审，不进入 07。

## 1. 文档级恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|
| `06-验收标准.md` | Step 15：整理正式验收标准文档已完成 | `formal-document-assembly` | `completed / pass_with_upstream_and_design_blockers / stop_review` | 15 章正文已按 Step 1～14 装配；来源、编号、历史污染、phase、依赖、证据真实性和非伪造静态审计完成。 | 等待用户审查；未经新的明确确认不得创建 `07-实施计划.md` | `project_execution_ledger.md`;`06_acceptance_step_01_input_boundary.md`~`06_acceptance_step_15_formal_document_assembly.md`;`验收标准书写规范.md` |

## 2. 本轮目标

将当前正式 `00~05` 的需求、架构、概要、详细设计、配置和测试输入转译为可裁决的验收门禁。正式 06 只回答“什么条件下可以判定通过 / 有条件通过 / 不通过”，不记录实际测试执行。

```text
验收输入边界
  -> 目标与范围
  -> 验收基线
  -> 进入 / 退出条件
  -> 功能门禁
  -> 数据与架构红线
  -> 接口 / 事件 / 跨仓同步
  -> 状态 / 事务 / 一致性
  -> 非功能
  -> 观测 / 审计 / 证据
  -> 一票否决
  -> 缺陷 / 复验 / 放行
  -> 风险接受
  -> 最终结论 / 签署
  -> 正式 06 装配
```

## 3. Step 进度

| Step | 主题 | 中间产物 | 状态 | 回填章节 |
|---:|---|---|---|---|
| 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | `[x] completed / stop_review` | §1 |
| 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | `[x] completed / stop_review` | §2 |
| 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | `[x] completed / stop_review` | §3 |
| 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | `[x] completed / stop_review` | §4 |
| 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | `[x] completed / stop_review` | §5 |
| 6 | 定义数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` | `[x] completed / stop_review` | §6 |
| 7 | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` | `[x] completed / stop_review` | §7 |
| 8 | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | `[x] completed / stop_review` | §8 |
| 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | `[x] completed / stop_review` | §9 |
| 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` | `[x] completed / stop_review` | §10 |
| 11 | 定义一票否决项 | `06_acceptance_step_11_veto.md` | `[x] completed / stop_review` | §11 |
| 12 | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | `[x] completed / stop_review` | §12 |
| 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | `[x] completed / stop_review` | §13 |
| 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_conclusion_signoff.md` | `[x] completed / stop_review` | §14 |
| 15 | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | `[x] completed / stop_review` | 全文 |

## 4. 固定执行纪律

- 每个 Step 独立保留问题回答、诊断、取舍、结构化中间产物、回填草稿、待确认事项和进入下一步条件；本轮虽获连续授权，仍按 Step 顺序落盘。
- 旧 `06-验收标准.md` 先作为 historical material 删除，再按 15 章主链重建；旧 persona、endpoint、AG-UI、UDS、launch token、旧 P95、旧 event route 和旧执行结论不得回流。
- 每条 P0 验收项必须可回指正式需求 / 设计契约、`TC-L2M-*`、规划中的 `EV-L2M-*` 或 `EV-CAND-L2M-*`、固定 report path 和裁决影响；规划证据不等于已生成证据。
- `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 和 `L2M-UP-005` 下 24 个 semantic candidate 持续保持 blocked / pending；不得用 fake、静态映射、planned、not_run 或 blocked 伪造通过。
- `L2M-member` 只验 member-local truth 与正式接缝：不验 Runtime loop / context / plan / outcome、Tools execution、host lifecycle、image truth、governance truth、conversation / artifact truth、Bus delivery 或 observability backend。
- 只修改 `projects/L2-member/`；不实现代码、不创建测试 artifact / report / evidence 实例、不运行测试、不修改兄弟仓、不提交 commit。

## 5. 证据与事实等级纪律

```text
planned TC / EV schema
  != real test execution
  != evidence instance
  != acceptance verdict
  != signoff / readiness
```

正式验收执行时必须使用固定且非 `latest` 的 `<run_id>`：

- 原始证据：`artifacts/test/<run_id>/...`
- 可读报告：`reports/runs/<run_id>/...`
- 交接入口：`reports/acceptance/handoff.md`
- 否决检查：`reports/acceptance/veto-checklist.md`
- 风险接受：`reports/acceptance/risk-acceptance.md`

本轮仅定义这些入口和判定规则，不填真实 run、artifact、report、EV、verdict、signoff 或 readiness。

## 6. 持续 blocker 与验收姿态

| blocker | 影响 | 当前验收姿态 |
|---|---|---|
| `L2M-UP-001` | host / IPC / credential exact contract | 只验 member-local request / signal / report、拒绝和 blocked seam；host positive qualification blocked |
| `L2M-UP-002` | image release / manifest / compatibility | 只验 opaque ref、availability、waiting / blocked；image qualification blocked |
| `L2M-UP-003` | Runtime entry / trigger mapping | 只验 missing mapping refusal、local attempt / blocked；positive Runtime admission blocked |
| `L2M-UP-004` | Runtime handoff / feedback source | 只验 safe material、attempt / gap / unknown；不得声称 delivered / observed |
| `L2M-UP-005` | member-specific Core / Bus schema、route 和 24 candidate | 只验 zero configuration / non-materialization；不得有 event publisher / outbox / route 证据 |
| `L2M-UP-006` | credential / identity anchor owner | 缺失、冲突、不可验证一律 fail closed；positive proof blocked |
| `L2M-UP-007` | screening taxonomy / policy source | unknown / stale / conflict 保守处置；positive allow lane blocked |
| `L2M-UP-008` | non-project / personal execution subject | 仅项目型双锚可裁决；其他 subject reject / blocked |
| `L2M-DDD-001~007` | repo、物理 Store、receipt、CP04~CP07 helper / version | 逻辑 / fake / refusal / reserved 可验；受影响正向和耐久性结论 blocked |
| `scope_supersede_gap` | scope successor helper | `ReplaceSubscriptionScope` 只能 blocked / wait_design，不得用 Store save 假装迁移 |

## 7. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 1～14 | 已完成 | 各自中间产物、回填草稿、停审记录和跨门禁审计已保留 |
| Step 15 | 已完成 | 正式 `06-验收标准.md` 已按 15 章主链 full-restart 重建 |
| 真实验收执行 | 未开始 | 需未来实现、固定送验基线、真实 run 和证据；本轮不执行 |
| 下一步 | 等待用户确认 | 完成 06 后严格停审，不进入 07 |
