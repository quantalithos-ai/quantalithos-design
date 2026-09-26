# Step 4. 定义进入条件与退出条件

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填位置：正式 `06-验收标准.md` §4

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 4 / entry_exit |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 当前姿态 | 条件已定义；当前未具备真实进入条件 |
| 下一步 | `Step 5 / function_gate` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 基线结构 | Step 3 | `available` | source/build/profile/config/fixture/run 轴 |
| 测试入口/退出设计 | 05 §12 | `available` | 作为验收准入和准出前置 |
| P0范围与VETO | Step 2、00 §14 | `available` | 决定 blocking 条件 |
| 实际交付与证据 | 送验材料 | `not_provided` | 当前不能勾选进入条件 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 开始验收前哪些基线必须确认？ | 00～05/标准 source refs、implementation/build/image、L0/core contract 依赖、四个 P0 profile/config digest、脱敏 fixture/replay root、单一 run_id。 | Step 3；05 §8/§12 |
| 哪些测试证据必须先生成？ | 每个 P0 blocking suite 的 raw artifact、run report、evidence-index、gate-results、redaction/dependency/report audit；acceptance handoff/veto checklist 必须可审查。 | 05 §13；06 SOP Step 10 |
| 哪些缺陷阻断进入？ | 未关闭 S/VETO、redaction/dependency/report audit 阻断、P0 profile unavailable 却被标 passed、缺 raw artifact/report pair、设计契约无法 1:1 回链。 | 05 §11/§12；00 VETO |
| 退出验收需要哪些结论？ | 每个 P0 AC 有通过/失败/不适用理由；VETO 全部有真实证据；P0 artifact/report/evidence 完整；缺陷、风险、签署材料口径完整。 | 06 SOP Step 4/14 |
| 哪些风险必须先接受？ | 只有 B/R、P1/P2 residual 或严格限制的非阻断 A 可进入 `有条件通过`；VETO、S、redaction、dependency、evidence integrity、truth repair 不可接受。 | Step 11～13 预定口径 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧文档把“可运行”当进入条件 | 无法证明来源、权限、dirty 和证据边界 | 进入条件按基线、P0 suite、证据和缺陷分层 |
| 退出条件只写“测试通过” | 无法裁决 VETO、redaction、report integrity | 要求 AC/VETO/evidence/defect/risk 全链闭合 |
| 允许缺报告后人工补结论 | 形成静态证据伪造 | 缺 raw/report pair 直接暂停或不通过 |
| blocker 未区分 local 与 positive integration | 可能把未就绪 owner 当失败或被 fake 掩盖 | local contract 可执行；positive integration 明确 blocked/waiting |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 进入 | 有 build/测试即可 | 五轴基线 + P0 evidence + 无阻断缺陷 | 保证可裁决 |
| 退出 | “用例通过” | AC/VETO/evidence/defect/risk/signoff 结构完整 | 验收是裁决文档 |
| 缺证据 | 可口头补充 | 缺 evidence/report 即暂停或不通过 | 不允许静态造证据 |
| 未闭合依赖 | 可能默认失败/成功 | 按 P1 blocker 保留 blocked/waiting | 准确表达上游状态 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 以实现可运行作为入口 | 快 | 丢失基线和证据完整性 | 拒绝 |
| 所有外部 P1 必须已完成才允许入口 | 严格 | 把当前未核验合同误变为 P0 阻断 | 拒绝 |
| P0 local/controlled 证据可进入；P1 positive 明确标 blocked/waiting；VETO/证据完整性硬阻断 | 可执行且不伪造 | 送验准备较多 | 采用 |

## 7. 结构化中间产物

### 7.1 进入条件

- [ ] 00～05、验收标准和真相源规范的 source ref/digest 已固定。
- [ ] implementation commit、build id 或 image digest 已固定；不能使用 `latest` 或工作树状态。
- [ ] L0/core contract 及本轮需消费的 owner source refs 已固定；未闭合项明确列为 blocked/waiting。
- [ ] `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 profile 的 config digest、source precedence、runtime composition 和 fixture/replay root 已固定。
- [ ] 单一 `<run_id>` 已固定；raw root 为 `artifacts/test/<run_id>/`。
- [ ] 每个 P0 blocking suite 已有 raw `report.json`、case refs、status、failure reason、profile/config ref 和 artifact digest；不得缺 artifact 后手写报告。
- [ ] `reports/runs/<run_id>/` 有 summary、gate-results、evidence-index、suite report、redaction-check、dependency-boundary、report-audit。
- [ ] `reports/acceptance/handoff.md`、`veto-checklist.md` 已生成并经人/Agent 审查；有 residual 时另有 `risk-acceptance.md`。
- [ ] 当前无未关闭 S/VETO、redaction/dependency/report audit 阻断；P0 unavailable 不得被标 passed。

### 7.2 退出条件

- [ ] 每个 P0 `AC-SYNC-001~020` 已有明确 `通过/失败/不适用+正式理由`。
- [ ] 每个 P0 AC 能回指正式设计契约、`TC-SYNC-*`、`EV-SYNC-*`、固定 report path 和 raw artifact。
- [ ] `VETO-SYNC-001~005` 均有真实检查证据，未被默认 passed 或风险接受覆盖。
- [ ] P0 blocking suite 均有 raw artifact/report pair；`evidence-index.md` 无 orphan EV、无 latest、无项目子目录路径。
- [ ] redaction/dependency/report audit 均通过，或其失败明确导致不通过。
- [ ] Query zero-write、owner truth boundary、dirty non-overwrite、unknown fail-closed、ACK≠accepted 和 commit≠Artifact/Baseline 均有证据。
- [ ] S 级缺陷为零；A 级已修复复验或有允许的正式接受；B/R 已进入风险接受并具备责任人、接受人和截止/触发条件。
- [ ] 最终结论和签署材料齐备；签署不替代风险接受。

### 7.3 暂停/不可裁决条件

| 条件 | 姿态 | 处置 |
|---|---|---|
| 缺 source/build/config/fixture/run 基线 | `paused / not_adjudicable` | 补齐基线并重建 run |
| 缺 raw artifact/report pair 或 evidence index 静态生成 | `not_passable` | 不能口头补证；修复 report pipeline 后重验 |
| owner/access/source/comparator contract unknown | `blocked / waiting` | 只保留 local negative/contract；不得危险 materialize/handoff |
| VETO/redaction/dependency/report audit 失败 | `not_passable` | 复验前不得风险接受 |
| P1 integration unavailable 且未影响 P0 local boundary | `conditional / residual` | 进入风险接受，不能写成 P0 positive pass |

## 8. 回填草稿

正式 §4 应明确进入条件必须同时具备固定 source/build/config/fixture/run 基线、P0 raw artifact/report/evidence 结构、acceptance handoff/veto checklist 审查和无 S/VETO/证据完整性阻断；退出条件必须逐项收口 AC、VETO、证据、缺陷、风险和签署。缺任一硬条件只能暂停或不通过，不得用口头确认或静态表补洞。上游正向合同未闭合时保持 blocked/waiting，不把其伪造为通过。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 真实 P0 run/artifact/report | 当前只能定义条件，不能填写结果 | 正式送验前 |
| acceptance handoff 审查人 | 决定 evidence 是否可作裁决 | Step 10/14 |
| P1 blocker 解锁时间 | 决定是否生成 conditional residual | Step 13 |

## 10. 进入下一步条件

- [x] 进入条件逐项可判定。
- [x] 退出条件包含 AC/VETO/evidence/defect/risk/signoff 全链。
- [x] 暂停和不可裁决情形已显式区分。
- [x] 正式 §4 回填草稿已形成。
- [x] 本步停审；进入 Step 5 前先读取 03/05 功能和用例切口。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`；当前项目尚未满足真实进入条件，未声称已进入验收。
- 下一步阅读：03 §7/§8、05 §5/§6 及 `05_test_plan_step_05_traceability_coverage.md`、`05_test_plan_step_06_cases.md`，创建 Step 5。
