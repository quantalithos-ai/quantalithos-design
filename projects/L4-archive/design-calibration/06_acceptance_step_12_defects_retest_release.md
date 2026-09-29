# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12\
> 正式回填：`06-验收标准.md` §12\
> 日期：2026-09-14\
> 状态：`completed / defect_retest_release_rules_closed_no_instances / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 12：定义缺陷分级、复验与放行规则 |
| 目标 | 将 05 的 S/A/B/R、Step 11 的 10 VETO、执行状态和 failed/fixed-run 证据转为三值验收可直接使用的缺陷与放行规则 |
| gate_status | `completed / defect_retest_release_rules_closed_no_instances` |
| gate_reason | S/A/B/R 定级、执行状态正交、VETO→S、升级/接受、复验扩大集、关闭证据、release/下一阶段门禁均可判定；当前 defect/retest/release 实例仍为 0 |
| next_allowed_action | 按连续授权创建并完成 Step 13 |
| source_files | 正式 05 §11～14；05 Step 11/12/14；06 Step 4/10/11；验收 SOP/规范；L1-governance Step 12 粒度样本 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 12A | 执行状态与缺陷级别分流 | done | failed/blocked/infra/not_run 不互相伪装 |
| 12B | S/A/B/R 对结论影响 | done | VETO/S 不可接受；A/B/R 条件明确 |
| 12C | 复验与关闭合同 | done | 原 run 保留，新 run、原 TC/同族/相邻/全量规则完整 |
| 12D | 三值放行规则 | done | P0、VETO、formal seam、evidence、风险接受同时约束 |
| 12E | 跨缺陷/放行审计 | done | 无数字 SLA、工具选择或实际缺陷/放行事实 |

## 2. 执行状态先于缺陷定级

| 观察 | 分类 | 是否创建产品缺陷 | 对验收/放行影响 |
|---|---|---|---|
| assertion 真实不满足 | `failed` | 是，按 S/A/B 定级；非范围改进可 R | 对应 P0 不得通过；按级别处理 |
| 正式 prerequisite/owner closure 缺失 | `blocked` | 否；保留 blocker，若发现本仓错误可另建缺陷 | required P0 完整验收不得通过或条件通过 |
| runner/environment/writer/cleanup 意外失败 | `infrastructure_failed` | 建 harness/env issue，不先推定产品失败 | 受影响证据不可用；修复后新 run |
| 计划项未执行 | `not_run` | 否 | required P0 不得通过或条件通过 |
| 真实执行全部断言满足 | `passed` | 否 | 仅满足该项；还需 EV/report/VETO/review |

`blocked` 不计入缺陷“已修复率”，也不得通过创建 B/R 缺陷后移出 P0 分母；`infrastructure_failed` 不是预期负向通过；`not_run` 不是 N/A。当前没有真实 execution，故不存在产品缺陷、harness issue、复验或放行实例。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B 如何定义？ | S=任一 VETO、truth/security/authority/consistency/evidence 基础破坏或不可逆跨域 effect；A=未命中 S 但 P0 主线/断言失败；B=已证明不影响 P0 truth/security/required evidence 的非 P0 局部缺陷。另保留 R 记录 future/P2/非范围风险，但 R 不能吸收 required P0 blocker。 |
| 每级对结论有什么影响？ | S 必须不通过；A 默认不通过，只有证据证明不影响 P0 且具名正式接受才可能有条件通过；B/R 可在具名风险接受后支持有条件通过。任何 P0 blocked/not_run/infra/缺证据独立阻止通过。 |
| 修复后如何复验？ | 保留失败 run，新 fixed run 执行原 TC、同 family 正负边界、相邻 suite/check；VETO/S、核心 truth/state/UoW/effect/authority/restore/config/redaction/dependency/evidence 变化触发全量 P0。 |
| 哪些可风险接受？ | 仅经证据界定影响的 A、B、R；A 的接受必须极少数且不涉及 P0 truth/security/authority/finality/evidence。VETO/S、required formal blocker、证据不可裁决、泄漏与 production fake 不可接受。 |
| 哪些阻断下一阶段？ | 任一 VETO triggered/undetermined、S、未接受 A、任一 P0 failed/blocked/infra/not_run、缺 raw/report/review、formal seam 未闭合或 acceptance entry/exit 未满足。 |

## 4. Historical material 诊断与取舍

| 历史/宽松口径 | 当前规则 | 理由 |
|---|---|---|
| A“视情况放行” | 默认阻断；只有正式证据、owner、acceptor、期限/触发和 Step 13 规则齐备才可能条件通过 | 防主线风险口头豁免 |
| blocked 记一般缺陷后关闭 | blocker 保持独立 P0 prerequisite | 缺合同不是测试通过或可接受产品缺陷 |
| 修复说明即关闭 | failed run→change identity→fixed run→raw/report/review | 防静态关闭 |
| 只重跑原 case | 原 TC + 同族 + 相邻 suite/check；S 全量 P0 | 防横切回归 |
| 新 run 覆盖旧失败 | 旧失败不可变并在缺陷记录中永久引用 | 保持审计链 |
| 缺陷数量门槛 | 不私造“允许 N 个” | 影响、级别和证据比无来源数字可判定 |

## 5. 结构化中间产物

### 5.1 缺陷分级与结论影响

| 级别 | 定义 / L4-archive 示例 | 对验收结论与阶段的影响 | 复验要求 | 风险接受 |
|---|---|---|---|---|
| S | `VETO-AR-001～010` 任一 triggered；跨域写、假 restored/global success、缺 basis 成功、盲 effect、Query 写、泄漏、compile/fake/outbound 偷渡、evidence forgery | 总体必须“不通过”；立即停止受影响 gate/release/effect，不能进入下一阶段 | 修复；补/强化自动化；原 TC + 同族 + 相邻 + 全量 P0；旧 trigger raw 保留 | 禁止 |
| A | 未命中 VETO/S，但任一 P0 功能、状态、协议、配置、可恢复性、报告断言失败；如 partial 漏报、合法边错误、安全姿态错误但无泄漏 | 默认“不通过”；修复前不得完整放行。仅已证明不触 P0 truth/security/authority/finality/evidence 且具名接受时可考虑“有条件通过” | 原 TC、同 family 正/负/边界、直接和相邻 suite/check；影响核心语义时全量 P0 | 条件极严；Step 13 逐项，不得批量 |
| B | 非 P0、局部、可诊断且已证明不影响 required evidence 与 P0 行为；如选定 P1 组合或报告表现问题但 raw/追溯完整 | 可“通过”（完全不在本轮 scope）或具名记录后“有条件通过”；进入 P0 scope 则升级 | 受影响 TC/suite；必要时抽样相邻面；保留 raw/report | 可以，须 owner/acceptor/action/deadline |
| R | future/P2/operation 改进或无正式 threshold 的记录项；如 measured latency/RTO 未定义、selected provider/UI 未纳入 | 不形成 P0 passed；若只是正式非范围可不影响结论；若实际是 required P0 blocker则仍阻断，不能以 R 绕过 | 解锁 authority 后建立/执行相应测试；变更 scope 时回写设计 | 仅真正 residual；不可吸收 blocker/VETO |

### 5.2 升级、降级与争议规则

| 情形 | 强制动作 |
|---|---|
| 任一 VETO evidence triggered | 定 S；禁止降级；争议期间仍按 S 阻断 |
| A 涉及 owner truth、安全、unknown finality、formal authority、evidence authenticity 或不可逆 effect | 升 S |
| B/R 后续纳入 P0 或出现正式 threshold | 回写 00/03/04/05/06 相关 Step 后重新定级，不能沿用旧接受 |
| fake 与 durable/formal target 不一致 | 至少 A；若造成假 success/readiness 则 S |
| formal prerequisite 缺失 | 保持 `blocked` + owning blocker；禁止创建“accepted defect”关闭 lane |
| 定级/根因/影响争议 | 状态=`disputed`，按较高风险阻断，直到具名 review 和 evidence 解决 |
| 发现设计无正式字段/state/error/flow | 暂停；回 owning document，重建 TC/EV/AC 后再复验 |

### 5.3 复验范围矩阵

| 缺陷/变更面 | 最低复验 | 追加检查 | 全量 P0 条件 |
|---|---|---|---|
| contract/DTO/ref/schema/object | 原 TC + CONTRACT/OBJECT 同族及受影响 entry | contract-domain、entry-worker、redaction | public shape、authority、26-object invariant 或 evidence schema 变化 |
| 18 state/聚合 | 原 STATE + 全部相邻合法/非法/不传播边 | contract-domain、service-flow、VETO-002 | 任一传播、terminal、owner/global success 语义 |
| Command/Query | 原 entry 正负/duplicate；Query 五入口×telemetry 两姿态 | service-flow、consistency、authority/security | UoW、no-write、visibility、owner boundary |
| Consumer/Job/claim/report | 原 entry + envelope/receipt/claim/fence/checkpoint/report/duplicate | entry-worker、consistency、report audit | ACK/finality、phase、owner/effect 边界 |
| UoW/store/idempotency/effect | UOW/IDEMP/EFFECT + deterministic fault/barrier/probe | consistency、resource、formal seam、VETO-005 | commit/replay/unknown/effect 语义 |
| source/governance/storage/restore | AUTHORITY/EFFECT/RESTORE + related E/J | authority-negative、formal-seam、blocked lanes | fail-open、cross-domain、receiver/outcome/compensation |
| config/runtime/fake | CONFIG-001～004 + affected capability | config、dependency、security | 55-key requiredness、priority、production fake |
| telemetry/redaction | SECURITY/OBSERVE + representative entry/error | security-observe、redaction、report audit | 泄漏、visibility 或 non-interference |
| dependency/outbound | DEPENDENCY-001～002 + corresponding VETO | dependency、config、release | compile direction、shared DB/Tx、ready outbound |
| evidence/report/review | REPORT-001～002 + failed/blocked/infra samples | report-audit、no-static/link/digest/blocked-lane/VETO checklist | raw schema、status aggregate、EV registry、review mutation |

### 5.4 缺陷记录与关闭证据合同

| 字段 / 材料 | 要求 |
|---|---|
| identity | stable defect ref、发现时间、发现 gate/suite/exact TC、severity、execution status |
| traceability | VETO/blocker/requirement/design/AC/EV refs；受影响 owner、phase、分母 |
| observation | redacted safe symptom、expected/actual category、trigger/limitation safe ref；禁止 raw body/secret |
| failed evidence | immutable failed fixed `run_id`、raw/report paths+digests、review status；blocked/infra 则列相应 prerequisite/harness evidence |
| repair | root cause、change/source/config identity、changed boundary、设计回写 refs、补强 assertion/vector |
| retest | original TC、same family、adjacent/full P0 scope；new fixed `run_id` raw/report/EV/check refs |
| closure | reviewer identity/time、`open|disputed|fixed_pending_retest|closed_after_retest|accepted_with_conditions`；S 不允许 accepted |
| conditional acceptance | 仅 A/B/R，引用 Step 13 risk record 的 owner/acceptor/reason/action/deadline/trigger |

关闭必须同时满足：修复身份可定位；新 fixed run 的 required scope 全部 qualified；原 failed raw 与 fixed raw 均可读；没有新/残留 VETO；review 通过；required formal lane 不被删除。报告、commit message、人工评论、配置 `Ready` 或静态表不能关闭缺陷。

### 5.5 缺陷处理与复验流

```text
failed / blocked / infrastructure_failed / not_run
          |
          v
classify execution posture first
   |             |                |
 failed       blocked       infra/not_run
   |             |                |
 S/A/B       retain owner      repair harness /
 defect       blocker          execute planned lane
   |
   v
repair identity + impact analysis + regression strengthening
   |
   v
new fixed run: original TC -> family -> adjacent/full P0
   |
   +-- non-qualified / VETO --> remain open or reclassify
   |
   +-- qualified + review + no blocker deletion --> close / risk review
```

### 5.6 三值放行规则

| 放行结论 | 必要且同时满足的条件 | 允许动作 | 禁止 |
|---|---|---|---|
| 通过 | 所有适用 P0 AC qualified passed；required formal lanes passed；10 VETO 全部有证据 `not_triggered`；S=0、A=0；证据/review完整；无未接受影响项 | 可进入正式下一阶段的准备；仍不代表生产 readiness 或 owner success | 带 blocker、undetermined VETO、缺 report/signoff 进入 |
| 有条件通过 | 上述 P0/formal/VETO/evidence 条件与 S=0 仍全部满足；仅存在逐项正式接受、不会触 P0 redline 的 A/B/R residual，且 owner/acceptor/action/deadline/trigger 完整 | 只在列明条件和范围内进入下一阶段；到期/触发自动重审 | 接受 VETO/S/P0 blocked/not_run/infra、泄漏、fake、静态 evidence |
| 不通过 | 任一 P0 failed/blocked/infra/not_run；VETO triggered 或 undetermined；S>0；未接受 A；证据/具名 review/正式基线缺失 | 修复/解阻后新 fixed run 复验 | 用“基本通过”“风险已知”“本地通过”替代不通过 |

严格来说，送验尚未满足进入条件时应记录 `acceptance_execution=not_entered`，而不是制造一次“不通过”裁决；一旦已进入且出现上表失败条件，最终只能“不通过”。Step 14 将固定最终聚合与签署口径。

## 6. 缺陷、复验与放行停审 / 跨项审计

| 审计项 | 设计结论 | 当前实例上限 |
|---|---|---|
| S/A/B/R 是否可判定 | 是 | 0 defect |
| execution status 是否与 severity 正交 | 是 | 无 run |
| 10 VETO 是否全部映射 S | 是 | 无 trigger posture |
| blocker 是否可被缺陷/risk关闭 | 否 | 18 项全开放 |
| 修复是否需 failed/fixed pairing | 是 | 0 retest |
| S 是否触发全量 P0 | 是 | 未执行 |
| A 是否可口头接受 | 否 | 0 acceptance |
| 有条件通过是否允许 P0 blocker | 否 | 当前完整验收不可能通过/条件通过 |
| 是否私造缺陷工具、数量、SLA | 否 | 工具/时限待实施或正式 owner |
| 放行/readiness | 仅规则完成 | 0 release/verdict/readiness |

## 7. 回填草稿

正式 §12 应回填执行状态分流、S/A/B/R 分级、升级/争议、复验矩阵、failed/fixed-run 关闭合同和三值放行表。必须明确：VETO/S 不可接受；required formal blocker 不得转 B/R；有条件通过仍要求全部 P0/formal/VETO/evidence 成立；当前未进入实际验收且没有 defect/retest/release 实例。

## 8. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 03/04/05 回写 | 无；复用已停审的 state/error/config/test/defect/regression 语义 |
| 新 blocker | 无 |
| 持续 blocker | 18 项全部保留；不能用 defect closure 或 risk acceptance 关闭 |
| 待 Step 13 | 可接受 residual 的精确资格、字段、角色、到期/再触发和当前风险表 |
| 待 Step 14 | 最终三值聚合、签署职责与 next-stage/release-preparation 边界 |

## 9. 进入 Step 13 条件

- [x] S/A/B/R 与 passed/failed/blocked/infra/not_run 正交且可判定。
- [x] 10 个 VETO 全部映射为 S 且禁止接受。
- [x] 修复、复验扩大集、防回归和 failed/fixed-run 关闭合同完整。
- [x] 通过/有条件通过/不通过的必要条件可判定，required formal blocker 不可绕过。
- [x] 未伪造 defect、修复、复验、release、risk acceptance 或 verdict 实例。

当前 `gate_status`：`completed / defect_retest_release_rules_closed_no_instances`。

`next_allowed_action`：按连续授权创建并完成 Step 13。
