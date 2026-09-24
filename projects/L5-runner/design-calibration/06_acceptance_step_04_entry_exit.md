# Step 4. 定义进入条件与退出条件

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填章节：`06-验收标准.md` §4 进入条件与退出条件
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 4 |
| current_module | `acceptance_lifecycle_entry_suspend_exit` |
| gate_status | `pass_for_step_05` |
| current_lifecycle | `not_entered / blocked_by_missing_baseline` |
| actual_verdict | `none` |
| next_allowed_action | 创建并完成 Step 5 |

## 2. 本步目标与输入

本步将验收合同的准入前置、暂停/送验无效和准出条件分开。文档校准继续推进不表示实际送验可进入；三值 verdict 只有在有效验收实例完成门禁审查与签署后才能产生。

| 输入 | 用途 |
|---|---|
| Step 3 baseline manifest | 判断一次实际验收是否可定位、可复验 |
| 05 §9～§10 | suite/gate/check 与非功能专项 |
| 05 §11～§12 | S/A/B/R、复验、T0～T4 进出准则 |
| 05 §13 | fixed-run artifact/report/evidence 资格 |
| 05 §14 | 全量回归、residual 和不可接受项 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认？ | Step 3 的 design、implementation/delivery、environment/dependency、config/slot、data、execution、review baseline 全部存在且一致。 |
| 哪些测试证据必须先生成？ | 所有 in-scope P0 suites/checks 的同 run raw/report；18 slot 的 actual status；合格 runtime EV 或明确 incomplete；pairing/redaction/dependency/link/no-static checks。 |
| 哪些缺陷会阻断进入？ | 任一开放 S、VETO 修复未复验、P0 runner/suite/check 不可执行、run mismatch、缺 pair/digest、redaction/private dependency/static evidence finding。 |
| 退出需要哪些结论？ | 11 AC、横切门禁和全部 VETO 有真实 item result；证据完整；缺陷/复验/风险明确；三值 verdict 与 required signoff 完成。 |
| 哪些风险必须先接受？ | 只有不触碰 P0/VETO/S/证据真实性的 A/B/R residual 可支持有条件通过，且须逐项 owner、acceptor、期限/触发、follow-up 与 evidence。 |

## 4. 问题诊断、前后对比与裁决取舍

| 议题 | 旧/错误口径 | 本步裁决 |
|---|---|---|
| 生命周期 | 文档状态或空签署即验收状态 | `not_entered→entered→decision_pending/suspended→decided`；文档状态独立 |
| 缺 baseline | 直接写“不通过”或默认继续 | 尚未进入时为 blocked；进入后失效则 suspended |
| blocked positive | 一律 pass 或一律 fail | 按 baseline slot enabled/required 判定；未启用只验安全姿态 |
| 重跑 | 覆盖首失败 | 新 run + predecessor/supersedes；旧 raw/status/digest 保留 |
| 风险接受 | “后续补”即可放行 | VETO/S/P0 evidence 不可接受；其余逐项有权接受 |

## 5. 结构化中间产物

### 5.1 验收生命周期

```text
not_entered
  -- all entry conditions satisfied --> entered
entered
  -- all gates/evidence reviewed --> decision_pending
entered / decision_pending
  -- baseline/evidence invalid --> suspended
suspended
  -- new valid baseline/run + required review --> entered
decision_pending
  -- three-value verdict + required signoff --> decided
```

关键说明：

- `formal_stop_review_required` 是文档状态，不属于验收生命周期。
- `not_entered`、`entered`、`decision_pending`、`suspended` 都不是三值 verdict。
- `decided` 只能保存“通过 / 有条件通过 / 不通过”，不能保存“待补证据”。
- 新 baseline、证据失效或有影响的设计/交付变化会使既有决定失效，并开启新实例或回到 suspended。

### 5.2 进入条件

- [ ] 正式 00～06 的 immutable design source ref、digest、文件清单、in-scope 范围和 `acceptance_target_tier` 已固定。
- [ ] implementation source/commit 与适用 delivery build/image/package ref/digest 已固定；不适用项有理由。
- [ ] environment/platform、runner/tool、SDK 与启用 owner public dependency refs 可定位。
- [ ] 一个正式 profile、完整 strict config document/source/digest 已固定，且 builder/core capabilities 可判定。
- [ ] slot manifest 逐项声明 enabled/disabled/blocked/required；enabled slot 有 exact public contract/authority。
- [ ] fixture/data/fault/canary/seed manifest 可复现、隔离且不含真实敏感正文。
- [ ] fixed `run_id` 显式且不是 `latest`；12 suite、适用 gates/checks 与 blocking classification 已固定。
- [ ] 所有 in-scope P0 blocking suites/checks 已产生同 run raw artifact 与 report；failed/blocked/not-run 也保真归档。
- [ ] evidence index、pairing、redaction、dependency-boundary、evidence-link、no-static-evidence 结果存在且可读。
- [ ] acceptance handoff、VETO checklist、open issues 已生成并审查；有 residual 时 risk-acceptance 文件存在。
- [ ] 无开放 S、未复验 VETO 修复、run mismatch、缺 pair/digest、静态伪证据或伪 signoff。

当前逐项均未满足，因为实现与执行 baseline 不存在；因此实际生命周期保持 `not_entered / blocked_by_missing_baseline`，不产生“不通过” verdict。

### 5.3 暂停与送验无效

| 触发 | 生命周期/资格处理 | 后续动作 |
|---|---|---|
| baseline 缺失、矛盾或 design/delivery/config/dependency drift | 不进入或 `suspended`；当前 run 失去覆盖资格 | 固定新 baseline、影响分析、新 run |
| P0 runner/suite/check 无法执行 | 不进入/暂停；不得 skip-pass | 修复 harness，用新 run 执行 |
| artifact/report 缺失、run mismatch、digest/pairing/link 失败 | 送验无效；S / VETO-证据候选 | 修复生成链并新 run |
| redaction/forbidden material/private dependency finding 或 scanner unavailable | 暂停；S/VETO 候选 | 修复并全量 P0 |
| enabled positive slot 缺 exact contract/environment/evidence | 不可进入或对应门禁失败 | fail-closed，补 authority 与证据 |
| slot 未启用且真实依赖不可用 | 不阻断安全负向门禁 | 保持 blocked/disabled，不生成 positive EV |
| VETO 命中或开放 S | 不得进入 decision_pending 或 decided-pass | 修复、全量复验 |

### 5.4 退出条件

- [ ] 所有 in-scope P0 item 均有真实 `passed/failed/not_applicable_with_authority` 结果；`blocked` 仅按 slot manifest 解释。
- [ ] `AC-RUN-001~011` 全部闭环到正式设计、具体 TC、runtime EV instance、固定 report 与裁决影响。
- [ ] 数据/架构、协议/依赖、状态/UoW、NFR、证据门禁均有实际结论，无孤儿 P0。
- [ ] 全部 VETO 由真实检查逐项裁决且未命中；不得静态默认 passed。
- [ ] enabled conditional slots 有 contract-derived positive evidence；未启用 slot 的 blocked/disabled posture 保真。
- [ ] P0 raw/report/EV/digest/pairing/redaction/dependency/link/no-static 资格完整，无 orphan/mismatch。
- [ ] 无开放 S；A 已修复，或在不触碰 P0/VETO 时满足严格逐项接受；B/R 已登记。
- [ ] 复验使用新 run、保留失败 run；baseline 变化触发相应回归或全量 P0。
- [ ] 风险接受具备 scope、impact、reason、owner、acceptor、deadline/trigger、follow-up 与 evidence refs。
- [ ] 最终结论只使用三值，并与 handoff、VETO、risk/defect review version 和全部 required signoff 一致。
- [ ] 没有由 profile、测试计数、局部成功、交接 receipt 或 verdict 推导 production readiness。

### 5.5 来源追溯

| 条件组 | 来源 |
|---|---|
| design/delivery/environment/config/slot baseline | Step 3；04 §5～§12 |
| P0 suite/check/run | 05 §8～§10、§12 |
| defect/retest | 05 §11、§14 |
| artifact/report/evidence | 05 §13 |
| AC/VETO closure | 00 §14；本 flow Step 5～11 |
| risk/signoff | 本 flow Step 12～14 |

## 6. 回填草稿

正式 §4 应包含生命周期图、进入 checklist、暂停/送验无效表和退出 checklist。当前所有实际 checkbox 保持未勾选，明确实际验收未进入；文档设计完成不会自动改变生命周期或生成 verdict。

## 7. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 某次送验的 release-required slot | 进入条件和 positive 分母 | 由真实 baseline/authority 决定 |
| actual acceptance instance/review ID | 审查与签署 | 实施/送验时创建 |
| A 级例外的有权角色 | 条件通过资格 | Step 13 固定角色口径，实际身份后填 |

## 8. 进入下一步条件

- [x] 进入、暂停、退出条件均可判定。
- [x] lifecycle 与文档状态、三值 verdict 已分离。
- [x] blocked positive 与 enabled positive 处理清楚。
- [x] 当前准入结果保持事实诚实。
- [x] 允许进入 Step 5；正式 06 仍禁止写入。
