# L4-observability 06-验收标准 Step 04：定义进入条件与退出条件

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `04 / 定义进入条件与退出条件` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `acceptance_entry_exit_and_pause_gate` |
| formal_document_write | `not_allowed_until_step_15` |
| real acceptance readiness | `not_ready`;目标实现、固定 run 和真实证据尚不存在 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §10 |
| gate_status | `pass_for_entry_exit_design` |
| next_allowed_action | `start_current_06_step_05` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧模板把通用 observability 主语误当作进入 / 退出条件，且没有区分“可以开始裁决”与
“具备正向放行资格”，只作为 `historical_material`，不构成 current 验收门禁。

## 1. 本步目标、输入与执行计划

### 1.1 本步目标

把 Step 03 的 immutable baseline 和 current `05-测试方案.md` 的退出 / 证据合同转成可机器检查、可人工复核的
验收准入、准出和暂停条件。本 Step 只定义未来门禁，不执行验收，也不填写真实结果。

### 1.2 本步输入

| 输入 | 使用内容 | 权威边界 |
|---|---|---|
| 验收 SOP Step 04 / 书写规范 §5.4 | 进入条件、退出条件、可判定性 | 定义结构，不提供项目事实 |
| current Step 01~03 | 输入边界、P0/P1/P2、baseline 字段、canonical roots | 本 Step 不改变已冻结口径 |
| current `05-测试方案.md` §8~§14 | 6 lane、3 profile、9 suite、99 TC、82 DS、5 scripts、证据归档和回归 | planned test contract，不是执行结果 |
| current `00~04` | 31 AC、10 VF、60 protocol、27+1 state、配置装配和 truth redline | 条件必须使用正式名称 |

### 1.3 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取标准、Step 01~03 与 current `05` | 输入映射 | done |
| 回答 SOP 五个问题 | §2 | done |
| 诊断旧模板与易混淆状态 | §3 | done |
| 定义裁决准入、正向准入、暂停和退出条件 | §5~§8 | done |
| 形成 current readiness 快照 | §9 | done |
| 形成正式 §4 回填草稿、自检和 gate | §11~§13 | done |

## 2. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| 开始验收前哪些基线必须确认 | Step 03 注册的 design、delivery、core-contracts / dependency、lane/profile/config/binding、82-DS manifest、真实 `<run_id>` 和 raw/report roots 均须固定且可按 digest 复查。 |
| 哪些测试证据必须先生成 | 9 个 primary suite 的每个 required attempt 都有最小 raw record；99 个 exact TC 均出现在同 run provenance index；summary、gate-results、三项 check、report-audit 和 acceptance drafts 均存在。 |
| 哪些缺陷阻断进入验收 | 伪造 / 缺失 baseline、跨 run 拼接、raw body/secret、source truth write、非法依赖、active material cleanup、静态 evidence 等直接暂停；已知 S 级缺陷或 inherited positive blocker 不允许进入正向放行裁决。 |
| 退出验收需要哪些结论 | 31 AC、10 VF、99 TC / candidate linkage、9 suite、3 checks、缺陷、风险和 handoff 均有可复核状态；最终只能形成通过 / 有条件通过 / 不通过之一，并完成所需角色签署。 |
| 哪些风险必须先接受 | 只有 Step 13 明确允许、且有接受角色、理由、动作、截止 / 触发条件和真实同 run 证据的 residual 才能支撑有条件通过；VF、S 级缺陷和 inherited design gap 不可风险接受。 |

## 3. 当前文档问题诊断与改动前后对比

| 旧材料 / 模糊写法 | 问题 | Current 修正 |
|---|---|---|
| “测试完成即可验收” | 未固定交付、环境、数据和 run，也未要求 raw/report pairing | 进入条件逐项固定 baseline 和同 run provenance |
| “证据齐全” | 无 99 TC、82 DS、9 suite、5 scripts 或 canonical path 定义 | 以 Step 03/05 exact inventory 判定 |
| “无严重缺陷” | 未区分设计 gap、执行 defect、VF 与 residual | 分为暂停、正向准入、退出和风险接受四类规则 |
| “环境可用” | 可能用 ISO/INT 替代 required RuntimeLike | 每个 attempt 固定 lane/profile；低保真 lane 不替代 required lane |
| 旧模板写 `pass` | 没有真实 run、artifact 或 report | current readiness 显式为 `not_ready`；仅本 Step 设计 gate 为 pass |
| 将 blocked case 从 manifest 删除 | 会制造假完整和 orphan linkage | failed/blocked/not_run/not_evaluated 均保留最小 raw record |

## 4. 验收裁决取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 只有一套“进入条件” | 拒绝 | 无法区分“材料足以裁决为不通过”和“材料足以讨论正向放行” |
| 分为裁决准入与正向放行准入 | 采用 | 允许在有失败证据时形成正式不通过，同时禁止用 blocked/缺证据形成通过 |
| required lane 不可用时删除相关 suite | 拒绝 | 会伪造覆盖；必须保留 blocked/not_evaluated record |
| inherited affected 作为普通 residual 接受 | 拒绝 | 它们是设计 owner 缺口，必须先回写上游并重跑 |
| acceptance draft 自动生成 final verdict | 拒绝 | generator 只可生成结构化初稿，最终裁决和签署由验收角色完成 |

## 5. 裁决准入条件

下列条件用于判断“是否存在足够真实材料开始正式裁决”。满足它们不代表可以通过；失败 evidence 仍可进入并形成
“不通过”。任一 required artifact 完全缺失、来源不可复查或被篡改时，状态为 `pause_not_adjudicable`。

| Gate | 必须满足 | 检查入口 | 缺失 / 失败影响 |
|---|---|---|---|
| `ENTRY-01` design baseline | current `00~05`、标准 source ref 与 content digest 固定，31 AC / 10 VF inventory 无漂移 | baseline manifest、Step 03 字段 | 缺失即不可裁决 |
| `ENTRY-02` delivery baseline | implementation repository、immutable commit、build / artifact digest 固定；适用时含 image digest | delivery manifest | 无固定被测物即不可裁决 |
| `ENTRY-03` dependency baseline | `L0-core/core-contracts` ref/digest 和完整 dependency graph digest 固定 | dependency manifest / raw graph | graph 不完整或 source 漂移即暂停 |
| `ENTRY-04` runtime baseline | exact lane/profile、config、binding/capability、toolchain、mode、cleanup policy 均固定且组合合法 | config/environment manifest | 泛化 test/staging 名或非法组合即暂停 |
| `ENTRY-05` data baseline | exact `DS-OBS-*` manifest、namespace、content digest、fixture type、sensitivity 和 cleanup state 可复查 | `meta/dataset-manifest.json` | 缺 DS、污染未知或跨 run 复用即暂停 |
| `ENTRY-06` run identity | 真实不可变 `<run_id>`、attempt/invocation 与 baseline digest 固定，未使用 `latest` | `artifacts/test/<run_id>/meta/context.json` | 无 run 或 mutable selector 即不可裁决 |
| `ENTRY-07` suite attempts | 9 个 primary suite 全部列入 manifest；每个 required attempt 至少有 status、lane/profile、reason 和 raw record | raw suite/case metadata | 删除 failed/blocked/not_run 行即 provenance failure |
| `ENTRY-08` exact coverage | 99 个 `TC-OBS-*` 各有唯一 primary suite、至少一个 exact DS、candidate linkage 槽和 raw path | `evidence-index.json` | orphan、duplicate 或 wildcard-only 即暂停 |
| `ENTRY-09` run reports | `summary.md`、`evidence-index.md`、`gate-results.md`、三项 check 和 `report-audit.md` 均从同一 raw root 生成 | `reports/runs/<run_id>/` | 缺报告或不同 run 输入即暂停 |
| `ENTRY-10` acceptance drafts | handoff、veto checklist、open issues 已生成并标记 review 状态；存在 residual 时有 risk draft | `reports/acceptance/` | 缺交接范围或审查状态即暂停 |
| `ENTRY-11` failure preservation | failed/blocked/not_run/not_evaluated/indeterminate 与原始 finding 未被覆盖或汇总吞掉 | raw/report diff、report-audit | 发现覆盖即 `VF-OBS-006` 方向阻断 |
| `ENTRY-12` reviewer access | 验收角色能读取固定 report，并能按 path/digest 回到 raw artifact | handoff + review manifest | 只能看手工 summary 时不可裁决 |

## 6. 正向放行准入条件

在 §5 全部成立后，只有下列条件也成立，才可讨论“通过”或“有条件通过”。否则仍可形成“不通过”或暂停结论。

| Gate | 正向准入条件 | 不满足时的唯一合法状态 |
|---|---|---|
| `POS-01` | 所有 P0 required suite 在其 required lane/profile 有真实可解析结果；低等级 lane 未替代高等级 lane | `blocked` / `not_evaluated`，不得正向放行 |
| `POS-02` | 10 个 `VF-OBS-*` 均有可复核未触发证据；check 未默认 pass | 任一触发为不通过；缺证为不可正向裁决 |
| `POS-03` | 无未关闭 S 级缺陷，A 级缺陷已按 Step 12 修复复验或满足严格可接受条件 | 不通过或等待复验 |
| `POS-04` | I05、J06 和其余 inherited affected 涉及的 positive gate 已由正式 owner 闭合并纳入新 baseline / 新 run | 对应 P0 positive scope 保持 blocked |
| `POS-05` | redaction、metric-label、dependency、report provenance checks 均真实执行且成功 | 任一失败阻断；scanner failure 不得写 clean |
| `POS-06` | acceptance handoff 已审查，scope、异常、blocked、residual 与 selected run 一致 | handoff incomplete，不得签署 |
| `POS-07` | 有条件通过所依赖的 residual 全部符合 Step 13，可接受项有真实接受记录 | 无有效接受记录则不通过 |
| `POS-08` | selected delivery 若声明 RuntimeLike / 产品 seam / capacity 为本轮承诺，required evidence 已实际产生 | 声明范围与证据不一致则不通过 |

## 7. 暂停与不可裁决条件

| 情形 | 状态 | 恢复动作 |
|---|---|---|
| baseline、run、artifact 或 report 无法证明 immutable / same-run | `pause_not_adjudicable` | 修复 provenance，创建新 baseline / 新 run；旧材料只读保留 |
| raw body、secret 或 forbidden material 进入证据 / 报告 | `fail_veto_and_pause` | 保留 finding，修复后按受影响范围 + 全量 redline 重跑 |
| evidence index 静态生成、引用 `latest`、手写 passed / verdict | `fail_veto_and_pause` | 删除伪权威来源，基于真实 raw relation 重新生成新 run 报告 |
| required runner / lane 未建立但有真实 unavailable record | `blocked_adjudicable` | 可裁决为 blocked/不通过；建立 lane 后新 run 重验 |
| inherited owner gap 仍开放 | `blocked_positive_path` | 回写正式设计 owner、测试映射和 baseline 后重跑 |
| commit outcome、external outcome 或 completion indeterminate | `indeterminate` | 按正式 probe/manual 路径收口；禁止盲重试或猜成功 |
| acceptance draft 未经审查 | `handoff_incomplete` | 人/Agent 复核并保留 review provenance；generator 不代签 |

## 8. 退出条件

| Gate | 必须满足 | 退出时允许的结果 |
|---|---|---|
| `EXIT-01` | `AC-OBS-001~031` 每项有通过/失败/不适用理由、设计契约、exact TC、evidence/report 和影响 | 三值结论输入完整 |
| `EXIT-02` | `VF-OBS-001~010` 每项有检查结果、证据入口和触发后裁决；无风险接受覆盖 | 触发任一项只能不通过 |
| `EXIT-03` | 99 TC / 82 DS / 9 suite 的 join 无 orphan、duplicate、wrong-run 或缺 digest | coverage 可复验 |
| `EXIT-04` | 所有 required lane/profile 状态原样保留；blocked/not_run/not_evaluated 未计入 passed | 不完整范围不能通过 |
| `EXIT-05` | 三项 check 与 report-audit 有明确状态，原始 finding 可回指 | 红线证据闭合 |
| `EXIT-06` | 所有缺陷有级别、owner、affected scope、修复/复验状态；旧失败 run 保留 | 缺陷影响可判定 |
| `EXIT-07` | 所有 residual 有允许性判断；用于 conditional 的记录含接受角色、理由、动作和截止/触发条件 | 无记录不得有条件通过 |
| `EXIT-08` | handoff、veto checklist、risk acceptance、open issues 与 selected run / final decision 一致 | 交接可归档 |
| `EXIT-09` | final decision 只使用通过 / 有条件通过 / 不通过，并按 Step 14 完成角色签署 | 形成唯一正式结论 |
| `EXIT-10` | raw/report/evidence/acceptance material 的 retention marker 与 active reference 状态已登记 | 不允许退出后误清理复验依据 |

## 9. Current readiness 快照

| 条件族 | 当前事实 | 当前判定 |
|---|---|---|
| design gate | current `00~05` 和 Step 01~04 具备设计输入 | `pass_for_design` |
| delivery / dependency | 目标实现仓、commit/build/artifact、dependency snapshot 未建立 | `not_ready` |
| environment / data | selected lane/profile、真实 config、82-DS run manifest 未建立 | `not_ready` |
| run / report / evidence | 无真实 run、raw artifact、run report 或 evidence identity | `not_run` |
| acceptance / signoff | 无真实 handoff review、verdict 或 signoff | `not_evaluated` |

因此，本 Step 的“设计完成”不等于已满足任何未来 `ENTRY-*` 或 `EXIT-*` 执行门禁。

## 10. Inherited affected

无新增上游 blocker。以下 12 项继续开放：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

它们不阻断本 Step 的规则设计，但会阻断对应 positive path 的 `POS-04`。负向 fail-closed / controlled blocked
证据不能被解释为 positive closure，Step 13 也不得把这些设计缺口改写为可接受 residual。

## 11. 正式 `06` §4 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“裁决准入条件”“正向放行准入条件”“暂停与不可裁决条件”“退出条件”和“Current readiness 快照”小节。

正式 §4 应保留：12 项裁决准入、8 项正向放行准入、7 类暂停状态和 10 项退出条件；明确“材料足以形成不通过”
不等于“材料足以形成通过”。当前 target reality 缺失，正文只能定义未来门禁，不填写 checkbox 执行结果。

## 12. 待确认事项

| ID | 事项 | 当前状态 | 对未来验收的影响 |
|---|---|---|---|
| `Q-06-04-01` | 送验交付是否包含 image | `undecided` | 决定 image digest 是否 required；不影响文档继续 |
| `Q-06-04-02` | 哪个 RuntimeLike lane 被声明为 release required | `not_established` | 声明后必须实际执行，不得由 ISO/INT 替代 |
| `Q-06-04-03` | acceptance reviewer / signer 的具体人员 | `not_assigned` | Step 14 只先定义角色，不伪造姓名与签署 |
| `Q-06-04-04` | evidence/artifact 长期保留期限与介质 | `not_frozen` | 当前只要求 marker/active protection，期限须由合规/运维 owner 固定 |

## 13. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| 进入、正向进入、暂停和退出是否分开 | pass |
| 每项条件是否有检查入口与缺失影响 | pass |
| 是否固定 99 TC / 82 DS / 9 suite / 5 scripts 与 canonical roots | pass |
| 是否允许低保真 lane、静态 evidence 或 candidate linkage 替代真实证据 | no |
| 是否伪造实现、run、artifact、verdict 或 signoff | no |
| 是否把 inherited affected 风险接受掉 | no |
| 是否发现新 upstream blocker | none |
| `gate_status` | `pass_for_entry_exit_design` |
| `next_allowed_action` | `start_current_06_step_05` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 14. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 04
- `standards/document/验收标准书写规范.md` §5.4
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_02_scope.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_03_baseline.md`
- `projects/L4-observability/00-需求文档.md` through `05-测试方案.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_04_entry_exit.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_04_entry_exit.md`
