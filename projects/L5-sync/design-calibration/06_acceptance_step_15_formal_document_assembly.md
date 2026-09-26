# Step 15. 整理正式验收标准文档

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填目标：正式 `projects/L5-sync/06-验收标准.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 15 / formal_document_assembly |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 正式 06 旧文件 | 已删除；仅作为本步历史诊断输入 |
| 正式 06 写入 | `completed / closed`；新版已 full-restart 创建 |
| 下一步 | `user_review_formal_06`；不进入 07 |

本步只装配正式验收标准，不填写真实 verdict、signoff、artifact、report、evidence、readiness，不创建 07 implementation ledger/skeleton。

## 2. 本步输入

| 输入 | 来源 | 状态 | 装配用途 |
|---|---|---|---|
| Step 1 输入边界 | `06_acceptance_step_01_input_boundary.md` | `completed / stop_review` | §1 上游关系、回答边界 |
| Step 2 范围 | `06_acceptance_step_02_scope.md` | `completed / stop_review` | §2 目标、P0/P1/P2、非范围 |
| Step 3 基线 | `06_acceptance_step_03_baseline.md` | `completed / stop_review` | §3 source/build/profile/run/evidence 根 |
| Step 4 进入/退出 | `06_acceptance_step_04_entry_exit.md` | `completed / stop_review` | §4 可判定门禁 |
| Step 5 功能门禁 | `06_acceptance_step_05_function_gate.md` | `completed / stop_review` | §5 AC-SYNC-001~009 |
| Step 6 数据/架构红线 | `06_acceptance_step_06_boundary_gate.md` | `completed / stop_review` | §6 AC-SYNC-010~014 |
| Step 7 接口/同步 | `06_acceptance_step_07_interface_sync_gate.md` | `completed / stop_review` | §7 protocol/dependency gate |
| Step 8 状态/事务 | `06_acceptance_step_08_state_tx_consistency.md` | `completed / stop_review` | §8 state/UoW/idempotency |
| Step 9 非功能 | `06_acceptance_step_09_nonfunctional.md` | `completed / stop_review` | §9 AC-SYNC-015~020 |
| Step 10 证据 | `06_acceptance_step_10_evidence_audit.md` | `completed / stop_review` | §10 EV/report/handoff |
| Step 11 VETO | `06_acceptance_step_11_blockers.md` | `completed / stop_review` | §11 VETO-SYNC-001~005 |
| Step 12 缺陷/复验 | `06_acceptance_step_12_defects_release.md` | `completed / stop_review` | §12 S/A/B/R |
| Step 13 风险接受 | `06_acceptance_step_13_risk_acceptance.md` | `completed / stop_review` | §13 residual/acceptor |
| Step 14 结论签署 | `06_acceptance_step_14_conclusion_signoff.md` | `completed / stop_review` | §14 三值/签署 |
| 规范/SOP | `验收标准讨论流程_SOP.md`、`验收标准书写规范.md`、中间产物/真相源标准 | `read` | 章节、来源标记、证据和总审计 |
| 当前正式 00～05 | 项目目录 | `formal / stop_review` | 当前真相源，不从旧 06 继承 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 正式文档是否按 15 章主链？ | 是，严格使用规范要求的 §1～§15，不保留旧 06 的 10 章主线。 |
| 是否删除 SOP 问题原文？ | 是。正式文档只承载收口后的裁决条件、门禁和引用，不承载问题回答、诊断和停审记录。 |
| 每个 P0 门禁是否有通过/失败/证据？ | 是。§5～§10 按 AC/协议/状态/EV 绑定通过条件、失败条件、TC/EV 计划和固定 report root；当前不填实际结果。 |
| VETO 是否真实生效？ | 是。§11 固定五项 VETO，任一触发即不通过且不可风险接受；证据缺失不能写成未触发。 |
| 风险接受是否有责任结构？ | 是。§13 要求 owner、acceptor、deadline/trigger、follow-up 和 evidence_refs；当前使用待填占位，不声称已接受。 |
| 是否存在孤儿验收项/证据/重复裁决？ | 设计审计无未解决冲突；EV-SYNC-BLOCKER-001 被明确为 blocker metadata，不是 proof；Step 10/Step 15 要求真实 run 时再查 orphan EV。 |

## 4. 当前文档问题诊断

| 旧正式 06 问题 | 装配处理 |
|---|---|
| 旧主线使用 `SyncTask`、`SyncStatus`、`ConflictView` 等历史对象 | 删除旧文件；新版只使用 00～05 的 CP、29 objects、exact protocol/state/config vocabulary |
| 旧文档未覆盖 15 章、VETO、证据三层和 blocker ceiling | 新版按 §1～§15 完整装配 |
| 旧基线无 source/build/profile/run 固定规则 | 新版 §3/§4 固定五轴基线和 run-scoped paths |
| 旧门禁把“同步成功”作为泛化结论 | 新版拆成功/失败条件、禁止行为、VETO、risk acceptance 和三值结论 |
| 旧文档含实际结论占位/不稳定证据语义 | 新版明确设计阶段不填写 verdict/signoff/readiness |

## 5. 改动前后对比

| 维度 | 旧 06 | 新 06 |
|---|---|---|
| 真相源 | 历史 sync experience 主线 | 当前 00～05 正式基线 |
| 结构 | 非 SOP 10 章 | 验收规范 §1～§15 |
| 验收对象 | 旧 SyncTask/SyncStatus/ConflictView | CP1～CP6、29 object、10 Command、13 Query、3 Consumer、0 Event、3 Job、17 state |
| ownership | sync pipeline/多面状态叙述 | local sync truth 与 Project/Artifact/Baseline/Review/Workspace/Archive/Git remote truth 严格分离 |
| 证据 | API/DB/compare 泛化路径 | `artifacts/test/<run_id>/` → `reports/runs/<run_id>/` → `reports/acceptance/` |
| 结论 | `[待评审结论]` | 三值规则；当前不填写实际结论 |
| blocker | 未与当前上游合同同步 | 原样保留 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 06 上增量修补 | 保留旧内容、写入快 | 历史主语污染，无法证明 full-restart | 拒绝 |
| 只装配 §5～§11 门禁 | 重点清楚 | 缺少基线、风险、签署和参考闭环 | 拒绝 |
| 删除旧文件，按 Step 1～14 中间产物 full-restart 装配 §1～§15，再做跨门禁审计 | 可追溯、可审查、符合 SOP | 文档较长且需逐章来源 | 采用 |

## 7. 正式章节来源映射

| 正式章节 | 唯一 calibration 来源 | 正文承载 |
|---|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` | 输入映射、职责边界、历史材料说明 |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` | P0/P1/P2 范围、非范围和 owner seam |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` | source/build/profile/config/fixture/run 与 evidence paths |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | 可判定 checklist、暂停条件 |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | AC-SYNC-001~009 功能表 |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` | AC-SYNC-010~014、ownership/redline |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` | exact protocols、dependency type、zero-event |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | 17 states、UoW、unknown、idempotency |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | AC-SYNC-015~020、profiles/residual |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` | EV/index/report/audit/handoff |
| §11 一票否决项 | `06_acceptance_step_11_blockers.md` | VETO-SYNC-001~005 |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | S/A/B/R、retest、release |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | blockers/residual/acceptor |
| §14 最终结论与签署 | `06_acceptance_step_14_conclusion_signoff.md` | 三值判定、角色、签署边界 |
| §15 参考 | 本文件与当前正式基线 | 来源索引、停审声明 |

## 8. 跨门禁裁决总审计

### 8.1 需求覆盖审计

| 审计轴 | 结论 | 证据/说明 |
|---|---|---|
| `FR-SYNC-001~012` | pass (design) | CP1～CP6、AC-001~009/015~020 有功能/NFR门禁 |
| `FR-SYNC-013~015` | pass (deferred) | P2 future trigger，未污染 P0 exit gate |
| `BR-SYNC-001~025` | pass (design) | Step 5/6/7/8/9/11 分配到功能、红线、协议、一致性和 VETO |
| `AC-SYNC-001~020` | pass (design) | AC-001~009 功能、010~014 红线、015~020 NFR；全部有 Step 来源 |
| `VETO-SYNC-001~005` | pass (design) | Step 11 逐项停审；不可 risk-accept |

### 8.2 设计闭环审计

| 审计轴 | 结论 | 说明 |
|---|---|---|
| object/field | pass | 只引用 03 exact object/field；不新增 DTO/schema |
| protocol | pass | 10 Command、13 Query、3 Consumer、0 Outbound Event、3 Job；Outbound=`not_applicable` |
| state | pass | 17 个主语和 exact enum；disposition/view 不新增 lifecycle |
| UoW/idempotency | pass | prepare-before-effect、atomic finalize、commit unknown reload、exact replay |
| truth ownership | pass | local truth 与 Project/Artifact/Baseline/Review/Workspace/Archive/Git remote truth 分离 |
| config | pass | 42 leaf、38 required、4 nullable operations、4 P0 profiles、strict source/activation/redaction |
| observability | pass | closed signal、low-cardinality、body-free、sink failure isolation |

### 8.3 测试/证据闭环审计

| 审计轴 | 结论 | 说明 |
|---|---|---|
| AC→TC | pass (planned) | Step 5/7/8/9/10 映射正式 `TC-SYNC-*` 计划；真实 case 尚不存在 |
| TC→EV | pass (planned) | Step 10 为 P0 EV 规定 tc_refs；未来 index 不得用自然语言替代 |
| EV→artifact/report | planned gate | 固定 run-scoped roots；当前无实例 |
| VETO→EV/report | planned gate | `veto-checklist.md` 逐项引用真实 EV/report/defect；当前未生成 |
| report/redaction/dependency audit | planned gate | 失败即不可通过；当前不声称 clean |
| acceptance handoff/risk acceptance | planned gate | 需要审查人/acceptor/期限；当前未生成 |

### 8.4 范围与依赖审计

| 审计轴 | 结论 | 说明 |
|---|---|---|
| compile dependency | pass (design) | 只允许 `L0-core`/`L0-sdk` 既定边界；不引入 sibling compile dependency |
| runtime dependency | pass (design) | Identity/Work/Artifact/Workspace/Governance/Archive/Observability 只经 SDK/adapter seam |
| event dependency | pass (design) | 仅 3 conditional inbound consumer；Outbound Event=0 |
| positive integration | blocked/waiting | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样保留 |
| P2 historical choices | pass (deferred) | LFS/浅克隆/GUI/Tauri 不写成当前支持 |

### 8.5 结论/风险审计

| 审计轴 | 结论 | 说明 |
|---|---|---|
| 三值规则 | pass | 通过/有条件通过/不通过；暂停作为过程姿态 |
| VETO override | pass | 任一 VETO/S/证据硬失败不可 conditional |
| risk acceptance | pass (structure) | owner/acceptor/deadline/follow-up/evidence required；当前无 accepted instance |
| signoff | pass (structure) | 多角色；不自动接受风险 |
| actual verdict/readiness | not applicable | 当前没有真实 run/evidence/signoff/readiness |

## 9. 正式文档装配约束

1. 删除旧 `projects/L5-sync/06-验收标准.md` 后再创建新版；旧内容不作为正文来源。
2. 正式每章开头列出具体 `design-calibration/06_acceptance_step_*.md` 来源和延伸阅读小节。
3. 正式正文只承载收口后的验收规则；问题回答、诊断、取舍、停审和 blocker 解释留在本 Step 文件。
4. 不写真实 implementation commit、run、artifact、report、evidence、defect、verdict、signoff、readiness；只保留 `<...>` 送验占位和 planned/blocked/waiting 语义。
5. 不创建实现台账、boundary skeleton、代码、package、lock、CI 或测试命令。

## 10. 正式装配后的自检目标

- [x] 旧 06 已删除，新 06 按 §1～§15 创建。
- [x] 每章 calibration 来源具体且可定位。
- [x] AC-SYNC-001~020、VETO-SYNC-001~005、FR/BR、TC/EV、report path 可交叉追溯。
- [x] 10/13/3/0/3 协议数量、17 state、42 leaf/4 profile 与 03/04/05 一致。
- [x] 所有 P0 evidence 仍为 planned，未伪造真实 run/artifact/report/evidence。
- [x] blocker、历史材料、证据上限、签署和风险接受边界无冲突。
- [x] 完成后更新 flow/ledger/本 Step 为 `completed / stop_review`，下一动作 `user_review_formal_06`。

## 11. 待确认事项

| 事项 | 影响 | 处理 |
|---|---|---|
| 真实送验基线/run/evidence | 影响未来实际结论 | 正式验收时补齐，不写入当前设计结论 |
| 上游 blocker 解锁 | 影响 P1 positive 及 residual | 保持 blocked/waiting，解锁后重开受影响 Step |
| 07 implementation boundary | 影响落码计划 | 当前不读取、不创建、不进入 07 |

## 12. 进入下一步条件

- [x] Step 1～14 全部 `completed / stop_review`。
- [x] 正式章节来源映射和跨门禁总审计完成。
- [x] 删除旧 06 并创建新版正式文档。
- [x] 完成新版正式文档静态审计。
- [x] 更新 flow/ledger/Step15 并停审。

## 13. Step 15 装配后停审记录

- 旧正式 06 已删除，新正式 06 已按 §1～§15 full-restart 创建。
- 静态审计通过：章节、来源、AC/VETO、protocol count、state vocabulary、config count、证据路径、历史边界和 blocker 无冲突。
- 当前不存在真实 implementation、commit、run、artifact、report、evidence、defect、verdict、signoff 或 readiness；所有计划标识仍是 planned/blocked/waiting。
- 正式 06 已关闭写入并进入 `formal / stop_review`；下一动作是 `user_review_formal_06`，完成汇报后停止，不读取或创建 07。
