# L5-sync 06-验收标准校准流程

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md`
> 对应书写规范：`standards/document/验收标准书写规范.md`
> 当前模式：`full-restart + single-agent-serial`
> 用户授权：完成全部 06；正式 `06-验收标准.md` 完成后立即停审，不进入 07。

## 1. 执行边界

- 只修改 `projects/L5-sync/` 下的正式 06、`design-calibration/` 中间产物和项目台账。
- 当前 agent 独立完成阅读、分析、写入和审计；不创建、调用或委派 sub-agent、worker、team 或并行代理。
- 不实现代码、不运行测试、不创建真实 artifact/report/evidence，不填写 review verdict、signoff 或 readiness，不提交 commit。
- 旧 `06-验收标准.md`、README、draft 和其他项目 06 只作 `historical_material` 或框架参考；不得继承旧 `SyncTask`、旧状态或旧证据口径。
- 严格按 Step 1 → 15 串行推进。每个 Step 独立生成中间产物；每个 P0 验收项完成后记录 `stop_review`，所有验收项完成后做跨门禁裁决总审计。
- 正式 06 只能在 Step 15 由 Step 1～14 的已完成产物 full-restart 装配；装配后立即停审，不读取或创建 07。

## 2. 权威输入与证据上限

| 输入 | 用途 | 当前姿态 |
|---|---|---|
| `00-需求文档.md` | `FR-SYNC-001~015`、`BR-SYNC-001~025`、`AC-SYNC-001~020`、`VETO-SYNC-001~005`、truth ownership、NFR | 当前需求真相源 |
| `01-架构设计.md` | ownership、boundary、dependency direction、local/owner seam、redline | 当前架构真相源 |
| `02-概要设计.md` | CP、对象轮廓、协议骨架、flow、state、异常和范围 | 当前概要真相源 |
| `03-详细设计.md` | 29 objects、10 Command、13 Query、3 Consumer、0 Event、3 Job、17 state、UoW、error、observability、test cuts | 唯一直接设计真相源 |
| `04-配置设计.md` | 42 leaf、38 required、4 nullable operations、4 P0 profile、strict source、activation、failure、redaction | 当前配置真相源 |
| `05-测试方案.md` | TC/Suite/EV 计划、测试层级、固定路径、evidence ceiling、P0/P1/P2、阻塞矩阵 | 当前测试真相源 |
| 规范与 SOP | 15 章结构、证据闭环、三值结论、逐 Step 停审 | 唯一流程约束 |
| 专项上游 | `L0-sdk`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-archive`、`L4-observability` 当前正式文档和必要台账 | 仅消费正式能力/安全引用；精确合同未闭合的保持 blocker |

固定证据根：

```text
artifacts/test/<run_id>/
reports/runs/<run_id>/
reports/acceptance/
```

当前不存在真实 run、artifact、report、evidence、verdict、signoff 或 readiness。`EV-SYNC-*` 只能作为计划标识，不能写成已存在证据。

## 3. 验收主链与中间产物

| Step | 主题 | 中间产物 | 回填章节 | 状态 |
|---:|---|---|---|---|
| 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | §1 | `completed / stop_review` |
| 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | §2 | `completed / stop_review` |
| 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | §3 | `completed / stop_review` |
| 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | §4 | `completed / stop_review` |
| 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | §5 | `completed / stop_review` |
| 6 | 定义数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` | §6 | `completed / stop_review` |
| 7 | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` | §7 | `completed / stop_review` |
| 8 | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | §8 | `completed / stop_review` |
| 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | §9 | `completed / stop_review` |
| 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` | §10 | `completed / stop_review` |
| 11 | 定义一票否决项 | `06_acceptance_step_11_blockers.md` | §11 | `completed / stop_review` |
| 12 | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | §12 | `completed / stop_review` |
| 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | §13 | `completed / stop_review` |
| 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_conclusion_signoff.md` | §14 | `completed / stop_review` |
| 15 | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | §1～§15 | `completed / stop_review` |

## 4. 固定验收口径

- 结论只有 `通过`、`有条件通过`、`不通过`；设计阶段不得填写当前实际结论。
- `AC-SYNC-001~020`、`VETO-SYNC-001~005` 是正式需求裁决编号；不得新增替代编号或恢复旧主线。
- P0 必须覆盖显式选择/权限、binding/metadata、status/pull/materialize、冲突/恢复、Review handoff/provenance、姿态/诊断、Query zero-write、配置和 redaction。
- `Outbound Event = not_applicable`；验收不得新增 publisher/outbox truth。
- Query 不得写入、refresh、probe、repair 或改变上游状态。
- 不自动 merge/rebase/push/stash，不覆盖 dirty/untracked，不把 local commit、ACK、HTTP 200、remote object、cache、telemetry、job report 升格为 Artifact/Baseline/Review accepted/approved/signoff/readiness。
- 不创建、修改或伪造 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote truth。
- owner/access/source/comparator unknown 时 fail-closed；真实正向 owner/Git/fs/physical metadata integration 受 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 约束，保持 `blocked/waiting`。

## 5. 当前恢复点

```text
current_document = 06-验收标准.md
current_step = 15
current_module = formal_document_assembly
gate_status = pass_with_upstream_blockers
next_allowed_action = user_review_formal_06
formal_06_status = formal / stop_review
formal_06_calibration_write_allowed = completed / closed
formal_06_write_allowed = completed / closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 6. 持续 blocker

```text
SYNC-UP-001~010
SYNC-LOCAL-001~005
```

在对应合同、物理 schema、Git/filesystem 支持矩阵、CLI/package/tool 选择和真实 fixture 闭合前，验收只能定义 local contract、negative、state/UoW、redaction、证据结构和条件裁决；不得以 fake、cache、ACK、日志、telemetry、静态 mapping 或测试计划关闭 blocker。
