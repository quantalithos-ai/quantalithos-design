# L5-runner 06 验收标准校准流程

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/验收标准书写规范.md`
> 目标正式文档：`projects/L5-runner/06-验收标准.md`
> 启动模式：`full-restart + single-agent-serial`
> 本轮授权：用户已明确要求“完成全部06”，并于 2026-09-23 明确“完成全部 07”；本 flow 覆盖 Step 1～15，正式 06 完成后停审，再按授权进入 07。
> 历史材料：README、draft、旧正式 06 只作冲突扫描，不提供验收主语、基线、证据、阈值、verdict 或 signoff。

## 1. 执行边界

- 只修改 `projects/L5-runner/` 下的 06 正式文档、06 calibration 中间产物和项目台账。
- 当前 agent 独立串行完成；不创建、调用、委派或启动任何 sub-agent、worker agent、team 或并行代理。
- 严格遵守 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`；本 flow 只处理 06。
- 06 严格执行 Step 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15。
- 每个 Step 独立生成输入、SOP 回答、问题诊断、前后对比、裁决取舍、结构化产物、回填草稿、待确认事项和进入下一步条件。
- Step 5～11 按验收项小循环闭合设计契约、TC、planned slot/runtime EV pattern、固定 report path、通过/失败条件和裁决影响，并完成逐项停审与跨门禁审计。
- 正式 `06-验收标准.md` 只允许在 Step 15 删除旧文件后 full-restart 装配；Step 1～14 不修改旧正式 06。
- 不实现代码、不创建测试/script/fixture/artifact/report/evidence、不运行测试、不创建 implementation ledger/boundary skeleton、不生成 baseline/commit/run_id/verdict/signoff/readiness、不提交 commit。
- 本轮只完成“未来如何裁决”的验收合同。当前实现、交付、环境、fixed run、artifact/report/evidence、缺陷、风险接受和签署均不存在，实际验收生命周期只能是 `not_entered / blocked_by_missing_baseline`。

## 2. 三层门禁与当前恢复点

| 层级 | 当前状态 | 规则 |
|---|---|---|
| 项目级 | `06_completed_then_07_authorized` | 允许完成 06 并按用户授权进入 07；仍禁止实现、测试执行或提交 |
| 文档级 | `formal_stop_review_required` | 正式 06 已 full-restart；进入 07 前 06 保持只读 |
| Step 级 | Step 15 `completed / pass / self_reviewed` | 正式 06 装配与跨门禁审计完成，允许建立 07 calibration flow |
| 正式正文 | `formal_stop_review_required` | 新 06 是正式裁决合同；实际验收仍未进入 |

| 当前文档 | 当前 Step | 当前模块 | gate_status | next_allowed_action |
|---|---:|---|---|---|
| `06-验收标准.md` | Step 15 | `formal_assembly:full_restart_chapter_traceability_cross_gate_audit` | `completed / formal_stop_review_required` | 正式 06 已装配并停审；按用户授权读取 07 SOP 并建立 07 calibration flow |

## 3. 固定裁决语义

| 主题 | 固定口径 |
|---|---|
| 文档状态 | `formal_stop_review_required` 只表示验收合同完成，不表示交付验收通过 |
| 验收生命周期 | `not_entered / entered / decision_pending / suspended / decided`；前三者不是 verdict |
| 三值 verdict | 实际验收只允许 `通过 / 有条件通过 / 不通过`；当前不生成任何一项 |
| 功能分母 | `AC-RUN-001~011`；外围 `FR-RUN-014~016` 不进入当前 P0 pass 分母 |
| 测试分母 | 18 CUT、108 planned TC、12 planned suite、18 planned evidence slot |
| 协议分母 | 11 Command、12 Query、4 planned Consumer、0 outbound event、5 Operations Job |
| Evidence | `ESLOT-RUN-*` 与 `EV-RUN-<FAMILY>-<NNN>` 只是 future contract；instance 必须绑定 fixed run/raw/report/check/digest |
| Positive integration | 只有相应 upstream slot、正式 public contract 与真实环境被 baseline 明确启用后才 required；否则保持 blocked，不得用 fake 冒充 |
| VETO | 任何命中总体必为不通过，不得风险接受 |
| Readiness | profile、ACK、PID、端口、本地日志、planned TC 数量、文档完成均不能推出 readiness |

## 4. Step 状态台账

| Step | 主题 | 中间产物 | 状态 | gate_status | 正式回填 |
|---:|---|---|---|---|---|
| 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | `completed / pass / self_reviewed` | `pass_for_step_02` | §1 |
| 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | `completed / pass / self_reviewed` | `pass_for_step_03` | §2 |
| 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | `completed / pass / self_reviewed` | `pass_for_step_04` | §3 |
| 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | `completed / pass / self_reviewed` | `pass_for_step_05` | §4 |
| 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | `completed / pass / self_reviewed` | `pass_for_step_06` | §5 |
| 6 | 定义数据边界与架构红线 | `06_acceptance_step_06_data_arch_redlines.md` | `completed / pass / self_reviewed` | `pass_for_step_07` | §6 |
| 7 | 定义接口、事件与跨仓同步 | `06_acceptance_step_07_interfaces_events_sync.md` | `completed / pass / self_reviewed` | `pass_for_step_08` | §7 |
| 8 | 定义状态机、事务与一致性 | `06_acceptance_step_08_state_tx_consistency.md` | `completed / pass / self_reviewed` | `pass_for_step_09` | §8 |
| 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | `completed / pass / self_reviewed` | `pass_for_step_10` | §9 |
| 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | `completed / pass / self_reviewed` | `pass_for_step_11` | §10 |
| 11 | 定义一票否决项 | `06_acceptance_step_11_veto.md` | `completed / pass / self_reviewed` | `pass_for_step_12` | §11 |
| 12 | 定义缺陷分级、复验与放行 | `06_acceptance_step_12_defects_retest_release.md` | `completed / pass / self_reviewed` | `pass_for_step_13` | §12 |
| 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | `completed / pass / self_reviewed` | `pass_for_step_14` | §13 |
| 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_final_decision_signoff.md` | `completed / pass / self_reviewed` | `pass_for_step_15` | §14 |
| 15 | 正式验收标准装配 | `06_acceptance_step_15_formal_document_assembly.md` | `completed / pass / self_reviewed` | `formal_stop_review_required` | 全文 / §15 |

## 5. 权威输入与使用上限

| 输入 | 用途 | 使用上限 |
|---|---|---|
| 正式 `00-需求文档.md` | `CP-RUN-01~05`、`FR-RUN-001~016`、`BR-RUN-001~025`、六类 NFR、`AC-RUN-001~011` | 不新增需求、优先级或 owner truth |
| 正式 `01-架构设计.md` | Layer 5、SDK-first、依赖类型、数据所有权、技术中立与架构红线 | 不选择实现技术或跨仓私有依赖 |
| 正式 `02-概要设计.md` | 六组成部分、17 对象、11/12/4/5 协议与 flow/state 轮廓 | 不作为字段/状态最终真相，不新增页面或对象 |
| 正式 `03-详细设计.md` + 必要 Step | 七模块、对象/port、11/12/4/0/5、21 状态主语、UoW/错误/幂等/观测 | 正式字段、协议、状态和一致性的直接来源；不补物理实现 |
| 正式 `04-配置设计.md` | 41 项、四 profile、strict JSON、builder/readiness、失败/回滚 | profile 不等环境或 readiness；demo 值不成为阈值 |
| 正式 `05-测试方案.md` + Step 12～15 | 18 CUT、108 TC、12 suite、18 slot、T0～T4、证据/缺陷/风险 | planned 不等 executed/pass；06 不发明 TC 或 EV instance |
| 专项上游正式文档/必要台账 | 判断 Runner-facing seam、真实 integration 准入和 blocker | 未闭合只形成 blocked/conditional gate，不猜 DTO/API |
| 旧 `06`、README、draft | 历史冲突与污染扫描 | 不继承旧对象、阈值、泛证据或验收结论 |

## 6. 持续 blocker 与验收处理

| ID | 阻塞范围 | 06 中允许的处理 |
|---|---|---|
| `RUN-UP-001~008` | 真实 Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK positive integration | 固定 conditional/blocked 与启用后必需的 positive gate；不造 owner success |
| `RUN-DDD-001~003` | 实现仓、语言/runtime/runner、durable store/cache | 阻断实际进入验收；不影响裁决合同设计 |
| `RUN-DOC-002` | 新版正式 06 缺失 | Step 15 成功装配后关闭；关闭只代表文档存在 |
| `RUN-DOC-003` | 07、implementation ledger、boundary skeleton 缺失 | 不提前创建；06 完成后仍停审 |
| `RUN-OPS-001~002` | production telemetry/SLO/capacity、真实 integration/GRC | 无来源阈值不进入 hard gate；T2～T4 保持 blocked |

## 7. 当前门禁

```text
current_document = 06-验收标准.md
current_step = 15
current_module = formal_assembly:full_restart_chapter_traceability_cross_gate_audit
gate_status = completed / formal_stop_review_required
acceptance_lifecycle = not_entered
actual_verdict = none
next_allowed_action = read_07_sop_and_create_07_calibration_flow
formal_06_write_allowed = completed_read_only
formal_07_write_allowed = false_until_07_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
