# Step 15. 整理正式验收标准文档

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填章节: 完整 `06-验收标准.md`
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_15_formal_document_assembly.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 整理正式验收标准文档 |
| 当前状态 | 已完成;正式文档已装配 |
| 输入基线 | Step 1~14 中间产物;`standards/document/验收标准书写规范.md` |
| 输出文件 | `projects/L1-artifact/06-验收标准.md`;`projects/L1-artifact/design-calibration/06_acceptance_step_15_formal_document_assembly.md` |
| 停审方式 | 本 Step 完成后暂停,由用户审查正式 `06-验收标准.md` |

## 2. 本步目标

把 Step 1~14 的中间产物整理为正式 `06-验收标准.md`。

本 Step 完成:

- 使用正式 15 章结构重建 `06-验收标准.md`。
- 每章加入具体 `> 校准来源:`。
- 删除旧 CreateArtifact / PublishArtifactVersion / EvidenceRef / FreezeBaseline 少量旧主线。
- 不填写真实 `run_id`、implementation commit、缺陷状态、测试结果、最终 pass/fail 或真实签署。
- 将细节门禁、矩阵、方案取舍和停审记录保留在中间产物中,正式文档写成可裁决标准。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1~4 中间产物 | 已完成 | 装配关系声明、范围、基线、进入 / 退出条件 |
| Step 5~11 中间产物 | 已完成 | 装配功能、红线、接口、一致性、非功能、证据和 VETO 门禁 |
| Step 12~14 中间产物 | 已完成 | 装配缺陷、风险接受、最终结论与签署 |
| `验收标准书写规范.md` | 已完成 | 固定 15 章结构、三值结论、校准来源和证据引用规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织? | 是。正式 `06` 使用规范固定的 15 章。 |
| 是否删除了 SOP 问题原文? | 是。正式文档不复制 SOP 问题,只保留裁决标准。 |
| 每条 P0 门禁是否有通过条件、失败条件和证据来源? | 是。正式文档主表写通过 / 失败 / 证据,细粒度追溯见 Step 5~11。 |
| 一票否决项是否真实生效? | 是。`VETO-ART-001~009` 任一命中时不得通过或有条件通过。 |
| 每条 P0 门禁是否能回指设计契约、测试用例和 evidence ID? | 是。正式文档引用 `EV-CAND-ART-*`、`reports/runs/<run_id>` 和 `reports/acceptance/*`;详细 TC/AC 映射在中间产物。 |
| 状态、字段、接口、事件名是否与详细设计和测试方案一致? | 是。使用 16 Command、13 Query、6 Consumer、8 Outbound Event、6 public Job、`PublishPendingArtifactRelays` 独立 relay facade 和 Artifact 正式状态 / 事务口径。 |
| 风险接受是否有接受人和后续动作? | 是。正式文档要求 `reports/acceptance/risk-acceptance.md` 中逐项填写。 |
| Step 5~Step 11 的验收项 / 证据 / VETO 是否全部完成停审? | 是。对应停审记录位于各 Step 文件。 |
| 是否存在孤儿验收项、孤儿证据、重复裁决、VETO 未覆盖、风险接受越权或 report path 不固定? | 未发现 unresolved 冲突。正式执行时仍需真实 `run_id` 和 report-audit 证明。 |

## 5. 当前文档问题诊断

| 旧文档问题 | 本 Step 处理 |
|---|---|
| 旧 `06` 围绕 CreateArtifact / PublishArtifactVersion / EvidenceRef / FreezeBaseline 少量旧主线 | 已删除并按新版 Artifact fact / version / lineage / baseline / consumable / job / evidence gates 重建 |
| 旧文档使用 API / DB / audit entry 泛证据 | 已改为 `EV-CAND-ART-*`、`reports/runs/<run_id>`、`artifacts/test/<run_id>` |
| 旧文档缺 16 Command、13 Query、6 Consumer、8 Event、6 Job、relay facade | 已在 §7 接口、事件与跨仓同步验收收口 |
| 旧文档缺 VETO、evidence integrity、redaction、dependency boundary、P0 profile false pass | 已补 `VETO-ART-001~009` 和证据门禁 |
| 旧文档填写待评审结论占位但无三值规则 | 已改为三值结论、判定矩阵和签署矩阵 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 章节结构 | 旧 10 章 | 规范 15 章 | 对齐验收标准书写规范 |
| 主线 | 旧 artifact/version/baseline 局部主线 | Artifact truth center + protocol + evidence gates + VETO + risk acceptance | 对齐新版 `00`~`05` |
| 证据 | 泛化证据 | run-scoped `EV-CAND-ART-*` / report / artifact | 可复验 |
| 裁决 | 模糊占位 | 通过 / 有条件通过 / 不通过 | 可裁决 |
| 正式执行值 | 容易误填 | 保留 `<run_id>`、`<name>`、`<signoff>` 等占位 | 不伪造执行结论 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 正式文档是否展开所有中间表 | A. 全量展开;B. 主文档摘要,细节引用中间产物 | 采用 B。正式 `06` 保持可读,细节可追溯 |
| 是否填写真实执行值 | A. 填占位或推断;B. 只保留 `<...>` | 采用 B。无真实执行证据不得伪造 |
| 是否保留旧 `06` 历史内容 | A. 保留;B. 删除重建 | 采用 B。旧主线已不适配 |
| 是否允许 VETO 有条件通过 | A. 允许;B. 禁止 | 采用 B。VETO 不可风险接受 |
| 是否发明 formal `EV-ART-*` evidence alias | A. 发明;B. 不发明 | 采用 B。当前保持 `EV-CAND-ART-*` 可逆追溯;`AC-ART-001~058` 是本文正式验收项编号 |

## 8. 结构化中间产物

### 8.1 正式章节来源映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` |
| §11 一票否决项 | `06_acceptance_step_11_veto.md` |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` |
| §14 最终结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` |
| §15 参考 | `06_acceptance_step_15_formal_document_assembly.md`;Step 1~14;standards |

### 8.2 跨门禁裁决总审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 正式章节结构 | 通过 | 15 章完整 |
| 校准来源 | 通过 | 每章有具体 Step 文件 |
| 旧主线残留 | 通过 | 正文不再以旧 CreateArtifact / EvidenceRef 局部主线组织 |
| P0 门禁闭环 | 通过 | 功能、红线、接口、状态、非功能、证据均有门禁 |
| VETO 覆盖 | 通过 | `VETO-ART-001~009` |
| 风险接受越权 | 通过 | VETO/S 不可接受 |
| 证据路径固定 | 通过 | 使用 `<run_id>` 固定路径 |
| 真实执行值 | 通过 | 未伪造,保留占位 |
| relay facade 独立性 | 通过 | `PublishPendingArtifactRelays` 未并入 6 public jobs |

## 9. 回填草稿

正式 `projects/L1-artifact/06-验收标准.md` 已按本 Step 装配。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 source refs、implementation commit、core-contracts commit | 影响正式验收进入 | 正文保留基线要求,不伪造具体值 |
| 真实 `run_id` 和报告 | 影响所有 EV 裁决 | 正文保留 `<run_id>` 占位 |
| 真实缺陷 / risk acceptance / signoff | 影响最终结论 | 正文保留占位,不得伪造 |
| 是否引入 formal `EV-ART-*` evidence alias 或调整 `AC-ART-*` 验收项编号规则 | 影响后续证据编号和验收项追溯 | 当前不引入 `EV-ART-*`;`AC-ART-001~058` 已作为本文正式验收项编号,若后续调整必须保持 `EV-CAND-ART-*` 可逆追溯 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收标准可作为实施计划和发布准备门禁输入 | 通过 | 正式 `06` 已装配 |
| 跨门禁裁决总审计没有 unresolved 冲突 | 通过 | 见 §8.2 |
| 后续真实验收执行值未伪造 | 通过 | 均保留占位 |
| `06-验收标准.md` full-restart 是否完成 | 通过 | Step 15 完成后进入用户审查 |
