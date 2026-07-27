# L3-capability-hub 06 验收标准 Step 13：风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13
> 书写规范：`standards/document/验收标准书写规范.md` §13
> 上游：`06_acceptance_step_12_defects_retest_release.md`、`05_test_plan_step_14_regression_risks.md`
> 目标回填：`projects/L3-capability-hub/06-验收标准.md` §13
> 参考粒度：`projects/L1-governance/design-calibration/06_acceptance_step_13_risk_acceptance.md`、`projects/L1-artifact/design-calibration/06_acceptance_step_13_risk_acceptance.md`
> Step 状态：`accepted-design / not-executed`
> 日期：2026-07-26

## 1. Step 状态与边界

| 项目 | 状态 | 说明 |
|---|---|---|
| 当前 Step | Step 13：定义风险接受与遗留项 | 只定义验收层的风险分类、接受资格、必填字段和后续同步规则 |
| 上游缺陷规则 | 已完成 | Step 12 已闭合 observation class、S/A/B/R、VETO/P0-A 阻断、R0~R4 和 distinct-run closure |
| 当前风险事实 | `16` 项设计登记，`accepted=0` | `05` 的风险表不是实际 acceptance record；没有真实 run/evidence/reviewer/acceptor |
| 正式文档 | 未回填 | 正式 `06-验收标准.md` 仍是 historical material，必须等 Step 15 整体装配 |
| 实现与测试 | 未执行 | 不创建 defect、fix、run、artifact、report、evidence alias、签署或 verdict |
| 下一步 | Step 14 | 由 Step 14 定义最终结论与签署字段，不在本步填写人员或日期 |

本步必须回答：

1. 哪些真实 residual 可以成为“有条件通过”的候选。
2. 哪些风险永远不能接受，或只能保持 blocked/not-decided。
3. 风险接受记录必须由哪些字段和证据组成。
4. 风险如何影响 P0、selected、release 和最终验收结论。
5. 风险如何同步到 `07-实施计划.md`、问题记录、ADR 和运维文档。

本步明确不做：

- 不把 `CH-TEST-R01..R16` 直接改成 accepted。
- 不用“风险接受”覆盖 `VETO-CH-*`、confirmed S、当前 P0 A、证据完整性或责任边界失败。
- 不把 selected product unavailable、实现仓缺失、numeric threshold 缺失或 policy pending 写成 P0 通过。
- 不填写真实 `risk_id` 实例、owner、acceptor、deadline、timestamp、signature、run 或 report ref。
- 不吸收 runtime execution、tools execution、governance approval truth、method body/source、marketplace listing、provider route/quota/cost 或 SDK client/cache。

## 2. 输入与权威顺序

| 输入 | 权威用途 | 本步承接 | 不得推断 |
|---|---|---|---|
| `05-测试方案.md` §14 | 16 项风险、eligibility、never-acceptable 和 R0~R4 | 保留原始 `CH-TEST-R01..R16` 身份与状态 | 任何风险已被接受 |
| `05_test_plan_step_14_regression_risks.md` | impact manifest、full trigger、residual schema | 确定真实 residual 的最低证据集合 | 真实 run 或 defect 已存在 |
| `05_test_plan_step_13_evidence.md` | EV contract、raw/report root、review/retention | 规定风险证据必须同 run、可回链、无静态造证据 | `EV-CH-*` 合同等于 evidence instance |
| `06_acceptance_step_11_veto.md` | `VETO-CH-001..013` 与过程 VETO | 建立不可风险接受集合 | VETO 可由口头说明或 B 级降级 |
| `06_acceptance_step_12_defects_retest_release.md` | S/A/B/R、closure、放行影响 | 只允许合格 B/non-P0 residual 进入审查 | 当前 P0 A 可批量 waiver |
| `06_acceptance_step_03_baseline.md` / Step 4 | baseline、entry/exit、blocked/not-evaluated | 分离缺失前置条件与已验证 residual | missing/blocked 是 pass |
| `04-配置设计.md` §12/§14 | profile、external dependency、operations handoff | 将配置/环境风险转入后续计划 | selected product 或 profile 已确定 |
| L1 governance/artifact Step 13 | 表格粒度和签署字段 | 只借用结构 | 借用其他项目的对象、阈值、角色或 VETO ID |

权威顺序固定为：

```text
active formal 00~05 source
  -> exact test/design observation and impact manifest
  -> Step 11 VETO / Step 12 severity and release rule
  -> eligible residual review
  -> real authorized risk decision
```

旧正式 `06`、README 和其他项目的风险表只能用于 historical-material 差异审计。它们不能产生本项目的 accepted risk、条件通过或最终结论。

## 3. SOP 问题回答

| SOP 问题 | 本项目裁决 | 依据 |
|---|---|---|
| 哪些风险可以支持有条件通过？ | 只有真实、可复现、边界明确、证据完整、确认是 B/non-P0 或 R residual，且 `VETO`、S、当前 P0 A、P0 evidence impact、truth/ownership/security/config hard redline 均为空的风险，才可进入接受审查。 | Step 12 §7/§9；`05` §14 |
| 哪些风险不能接受？ | 任一 VETO、confirmed S、当前 P0 A、design contradiction、P0 prerequisite absence、forbidden body/secret、dependency/responsibility failure、static/cross-run evidence、P0 denominator 缺失或 fake review/signature 均不可接受。 | Step 11、Step 12、`05` §14.5 |
| 每个风险的接受人是谁？ | 由正式验收流程指定的授权角色填写；当前不指定姓名。没有实际 `acceptor`，风险不能支撑有条件通过。 | SOP Step 13；书写规范 §六 |
| 后续动作和截止时间是什么？ | 每条候选 residual 必须有 owner、可验证 follow-up、deadline 或可判定 trigger；缺任一字段即保持 `pending_not_accepted`。 | 本步 §8/§9 |
| 是否同步到实施计划或问题记录？ | 是。实现、测试、配置、外部产品、运维和政策残余必须分别进入 `07` boundary、issue/ADR 或运维文档；不能只存在于验收报告。 | `05` §14.4、Step 12 closure |

## 4. 当前文档问题诊断

| 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 使用泛化“遗留项/待办”而无资格、证据和接受人约束 | 不继承；重建可判定的 residual contract |
| `05` §14 风险登记 | 有 16 项风险和状态，但未定义验收记录字段 | 保留 source ID，补 `scope/impact/evidence/owner/acceptor/expiry` |
| Step 11 VETO | 已定义不可接受，但没有在风险表中形成反向阻断 | 建立完整 never-acceptable 矩阵 |
| Step 12 缺陷规则 | B/R 进入 Step 13 的条件已有，但没有最终记录 schema | 固定 eligible residual predicate 和 closure bundle |
| 旧项目参考 | 部分允许 A 临时接受或用角色占位支持通过 | 只参考粒度；本项目当前 P0 A 不得风险接受 |
| 数值和生产政策 | 没有 active threshold、retention days 或 selected topology | 保持 `not_evaluated` / `pending_not_accepted`，不发明结论 |

## 5. 风险状态与资格模型

风险登记状态和验收结论必须分开。`accepted` 只表示真实授权记录已经完成，不等于测试通过；`passed` 也不能代替风险接受。

| 状态 | 适用条件 | 可否支持条件通过 | 必须动作 |
|---|---|---:|---|
| `not_eligible` | 设计债务、实现前置条件、formal 文档缺失、责任未定、scope 外 guard 或缺少可判定 oracle | 否 | 补齐前置条件、回开 owning Step 或转入实施 boundary |
| `pending_not_accepted` | selected/operations/future/policy residual 已被识别，但尚无完整实际证据或授权 | 否 | 保留状态，建立 owner、trigger 和后续路径 |
| `eligible_for_review` | 已有真实 run/evidence、缺陷归因完成、影响 bounded、无 VETO/S/P0-A/P0 evidence impact | 仅可进入审查 | 生成完整 risk record，等待授权角色裁决 |
| `accepted_residual` | `eligible_for_review` 且授权 acceptor、理由、期限、follow-up 和证据全部存在 | 是，且仅影响合格 residual | 写入正式 acceptance report 并同步下游 |
| `rejected_or_blocked` | 命中不可接受项、字段缺失、证据 invalid 或影响无法界定 | 否 | 修复/复验、回开设计、保持 gate blocked 或 `not_decided` |
| `expired_or_reopened` | deadline/trigger 到期、source drift、影响扩大或复验失败 | 否，直到重新审查 | 产生新 run/manifest，旧 acceptance 保留历史，不自动延续 |

### 5.1 Eligible residual predicate

候选 residual 必须同时满足以下条件，缺一项都不能进入 `eligible_for_review`：

| 条件 | 可判定要求 |
|---|---|
| 真实观察 | 有 immutable failed/observed run 或正式 prerequisite record；不能只有口头说明 |
| 归因完成 | 已区分 implementation、test-system、design-blocker、prerequisite、numeric-sample、expected-oracle、incomplete-run |
| 级别合格 | 确认是 B 或 R；不属于 S、当前 P0 A 或任何 VETO |
| 影响有界 | exact formal source、TC/DS/EV、suite/check、owner 和受影响结论已列出；不确定时默认阻断并扩展 R2 |
| P0 不受污染 | 不改变 189 denominator、638 pairs、P0 gate、truth ownership、redaction、dependency、config hard gate 或 evidence provenance |
| 证据完整 | raw/report/digest/pairing/no-static/redaction 审计可回链；不允许 static 或跨 run 拼接 |
| 后续可验证 | 有 owner、follow-up、deadline/trigger 和复验或重开条件 |

## 6. 可接受风险分类

下表只定义“未来可能具备资格”的类别，不代表当前任何一条已接受。

| 类别 | 典型范围 | 可接受前提 | 当前结论 |
|---|---|---|---|
| `B-non-P0` | 已确认不影响 P0 truth/provenance 的维护性、呈现性或非阻断问题 | 真实 evidence、bounded impact、明确 follow-up | 可进入审查 |
| `P1-selected-unavailable` | 未选定的外部 adapter、source、route、TLS、observer 或真实产品 parity | P0 controlled contract 独立成立；manifest 明确不是当前 required selected claim | 仅可作为 residual；required 时 blocked |
| `P2-operations` | dashboard、长期 retention、runbook、容量模型或生产运维准备 | 不冒充当前 release/P0 claim，有明确后续 owner | 可进入审查 |
| `numeric-not-evaluated` | 有 sample/trend 但无 active numeric threshold | 只保留 sample provenance，结构性门禁独立通过，后续建立正式阈值 | 不能写成 numeric pass |
| `future-evolution` | v1 之后 schema、兼容矩阵、动态配置或新 consumer | 明确不属于当前 scope，设定重开触发 | `R` residual，不支撑当前通过 |
| `cross-repo-E2E` | upstream/downstream 真实联调未锁定 | current seam contract 和 truth ownership 不受影响 | selected/future residual |

以下类别即使有接受人也不能进入有条件通过：design contradiction、P0 implementation prerequisite、P0 evidence/test-system blocker、P0 profile unavailable marked passed、任何 forbidden responsibility/body/secret、以及 impact unknown。

## 7. 当前 16 项风险登记

风险 ID 保持 `05_test_plan_step_14_regression_risks.md` 的 canonical source identity。以下表格只同步设计状态，不创建实际 acceptance record。

| ID | 风险 / 缺失事实 | 分类与影响 | 当前状态 | 处理方向 |
|---|---|---|---|---|
| `CH-TEST-R01` | L0 `IdempotencyKey::as_str()` byte semantics 尚未进入上游正式声明 | design debt；digest/input compatibility | `not_eligible` | 保持 raw UTF-8 contract；由 owning design Step 受控回开 |
| `CH-TEST-R02` | shared serde wire shape 不是永久 promise | design debt；protocol/digest compatibility | `not_eligible` | 固定 audited v1 bytes；协议变化触发 codec/R2 |
| `CH-TEST-R03` | target repo/Cargo/workspace/git facts 尚未建立 | implementation prerequisite；全部执行阻断 | `not_eligible` | 由 `07` preflight 建立，不伪造 repo/commit |
| `CH-TEST-R04` | gate/check/report/harness 尚未实现或证明 | implementation prerequisite；R0~R4/evidence | `not_eligible` | 转入 `07` tooling boundaries，先验证 non-pass fixture |
| `CH-TEST-R05` | durable authority product/schema/migration 未选择 | selected prerequisite；repository parity/deployment | `pending_not_accepted` | P0 只接受 controlled Port contract；selected run 另行声明 |
| `CH-TEST-R06` | 9 external adapters、6 source mechanisms、10 routes 未选择 | selected prerequisite；R3 parity | `pending_not_accepted` | Configured 缺失阻断 selected，不回退成 P0 pass |
| `CH-TEST-R07` | secret/TLS/memory/zeroization/session API 未选择 | selected/deployment security | `pending_not_accepted` | 保持 ref-only、shortest lifetime、no fallback |
| `CH-TEST-R08` | concrete observer backend/facade/fallback 未选择 | operations/selected signals | `pending_not_accepted` | 使用 backend-neutral profile；另做 selected proof |
| `CH-TEST-R09` | readiness probe、artifact store、cutover/Unknown resolution 未选择 | implementation/release/rollback prerequisite | `not_eligible` | 转入 `07`/运维准备；不可用时保持 blocked |
| `CH-TEST-R10` | numeric performance/capacity/SLO baseline 缺失 | operations policy；numeric verdict | `pending_not_accepted` | 只保留 sample/trend；正式 threshold 受控回开 |
| `CH-TEST-R11` | evidence retention days/backend/access/deletion 缺失 | operations/compliance policy | `pending_not_accepted` | 先遵守 event-based minimum，交运维标准 |
| `CH-TEST-R12` | formal 06 roles/risk/signoff contract 尚未装配 | acceptance policy prerequisite | `not_eligible` | Step 14/15 完成 schema；不填写人员 |
| `CH-TEST-R13` | formal 07/boundaries/implementation ledger 尚未建立 | implementation prerequisite | `not_eligible` | Step 7 完成后建立 pre-implementation handoff |
| `CH-TEST-R14` | alert/window/route/dashboard/runbook/formal 09 缺失 | operations policy；production readiness | `pending_not_accepted` | 保持 safe profile，后续进入运维文档 |
| `CH-TEST-R15` | first release/schema matrix、future dual-version/dynamic config 未知 | future evolution | `pending_not_accepted` | v1 candidate；拒绝未审查 schema/hot reload |
| `CH-TEST-R16` | README shorthand 可能吸收外围 P2 职责 | out-of-scope guard | `not_eligible` | formal docs 优先；T070 审计 README |

计数审计：`16/16` source risk rows 已登记；`accepted=0`；当前没有实际 evidence、owner/acceptor、deadline 或 follow-up 实例。

## 8. 不可风险接受矩阵

下列项目不是“暂缓接受”，而是命中后必须修复、复验、回开设计 owner 或保持 affected gate blocked。风险接受文件不得把它们标记为 `accepted_residual`。

| 不可接受项 | 识别来源 | 最低处理 | 结论影响 |
|---|---|---|---|
| `VETO-CH-001..013` 任一命中 | Step 11 §7 | 修复并按 impact manifest 做 R2；release claim 另做 R4 | `不通过` 或 `不可裁决`；禁止风险接受 |
| `VETO-CH-P-001..010` 任一命中 | Step 11 §8 | 保留原始失败和 provenance，修复 evidence/责任/配置/一致性链 | 对应范围阻断；禁止风险接受 |
| confirmed S | Step 12 §7 | distinct retest、affected family/suite/check 和 full trigger | 不通过或暂停；禁止风险接受 |
| 当前 P0 A | Step 12 §7.2、`05` §12 | 修复原 case、同 family、primary suite 和受影响 report/evidence | P0 exit/handoff 阻断；不能进入本步 acceptance |
| design contradiction / missing oracle | Step 4/12 | 受控回开 owning formal Step，重建 case/EV 后再执行 | `not_decided`；不能用实现 patch关闭 |
| P0 prerequisite absent | Step 4、`05` §12 | 补 repo/core dependency/profile/config/entry 等前置条件 | `blocked_dependency`；不能转 B 或 pass |
| forbidden body/secret/route/cost/approval/method source | `00`/Step 6/11 | 清理所有 code/store/observer/raw/report surfaces 并重建干净证据 | 直接 S/VETO；禁止接受 |
| dependency/responsibility boundary failed | `01`/Step 6/11 | 删除越界 owner/edge，重新审查 public surface 和 consumers | 直接 S/VETO；禁止接受 |
| Query/Job/derived/report/consumer reverse-write | `03`/Step 8/11 | 修复 truth ownership、no-write 或 no-repair contract，执行共享回归 | P0 阻断；禁止接受 |
| P0 config silent fallback/partial activation | `04`/Step 9/11 | fail-fast、profile isolation、activation barrier 修复 | P0 阻断；禁止接受 |
| static/raw-less/cross-run/digest-mismatch evidence | Step 10/11/12 | 从 immutable raw 重建同 run report，保留旧失败 | `invalid_artifact`/`not_decided`；禁止接受 |
| missing canonical denominator / orphan AC/VF/EV | `05` §5/§13、Step 10 | 修复 registry/builder 或 controlled reopen；不得改分母掩盖 | P0/evidence gate 阻断 |
| fake reviewer/acceptor/signature或无 provenance handoff | Step 10、书写规范 | 清空伪造字段，重新进行授权审查 | 不可裁决；禁止接受 |
| impact unknown 或 source drift after run | Step 12、`05` §14 | 默认 R2，新显式 baseline/run；旧 run保留历史 | 当前结论失效，不能接受 |

`P1/P2` 标签不能降低上述项目的严重度。selected product unavailable 只有在 immutable manifest 明确其不属于当前 required selected claim 时，才可能作为合格 residual；若该产品是 release-required，则保持 `blocked_dependency`，不能风险接受成 release pass。

## 9. 风险接受记录合同

真实执行时，`reports/acceptance/risk-acceptance.md` 每条记录必须能独立回答“是什么风险、为什么不阻断、谁承担、何时失效、如何复验”。建议的记录结构如下；本设计阶段只保留字段定义，不填写实例。

### 9.1 Required risk record fields

| 字段 | 必填 | 内容与约束 |
|---|---:|---|
| `risk_id` | 是 | 稳定且唯一的 residual ID；不得用自由文本替代 |
| `source_ref` | 是 | `05` 风险行、缺陷 closure、formal section 或 prerequisite record |
| `scope` | 是 | `B-non-P0`、`P1-selected`、`P2-operations`、`numeric-not-evaluated`、`future`、`cross-repo` 等受控值 |
| `classification` | 是 | observation class、S/A/B/R、`eligible_execution_residual` 或 prerequisite 状态 |
| `impact` | 是 | 对当前 P0、selected、release、operations 和后续阶段的明确影响 |
| `p0_contamination_check` | 是 | 明确 `no`，并列出不受影响的 denominator/gate/VF/evidence set |
| `formal_refs` | 是 | exact `00~06` section、DDD cut、config row、TC/DS/EV、AC/VF refs |
| `baseline_ref` | 条件必填 | 实际执行时的 immutable source/delivery/config baseline；设计阶段为空 |
| `failed_run_ref` / `retest_run_ref` | 条件必填 | 缺陷类 residual 必须 distinct；不得使用 `latest` 或同 run 覆盖 |
| `evidence_refs` | 是 | same-run raw/report/digest/pairing/redaction/no-static refs；合同 ID 不等于实例 |
| `acceptance_reason` | 是 | 为什么本风险不属于 VETO/S/P0-A，且为什么不阻断本轮声明 |
| `mitigation` | 是 | 当前控制、隔离或安全限制；不能只写“后续处理” |
| `reopen_trigger` | 是 | source/config drift、selected requirement、threshold、expiry、impact expansion 等可判定触发 |
| `follow_up_ref` | 是 | `07` boundary、issue、ADR、运维文档或后续验收范围入口 |
| `owner` | 是 | 后续动作责任角色；实际姓名由正式流程填写 |
| `acceptor` | 是 | 有权接受该 residual 的角色/人；缺失时不得有条件通过 |
| `deadline_or_trigger` | 是 | 明确日期或事件触发；不能写“尽快” |
| `review_point` | 是 | 下次复核节点或 release gate |
| `status` | 是 | `pending_not_accepted`、`eligible_for_review`、`accepted_residual`、`rejected_or_blocked`、`expired_or_reopened` |
| `decision_provenance` | 条件必填 | 授权 review、时间、签署或审查记录；当前保持空 |

### 9.2 Acceptance predicate

只有以下布尔条件全部为真，记录才可进入 `accepted_residual`：

```text
real_observation_or_prerequisite_record
  && classification_is_eligible
  && bounded_formal_impact
  && p0_contamination_check == no
  && veto_set == empty
  && open_S == 0
  && open_current_P0_A == 0
  && evidence_provenance_complete
  && owner_present
  && acceptor_present
  && deadline_or_trigger_present
  && follow_up_ref_present
  && authorized_review_provenance_present
```

任一条件为 false 时，状态最多为 `eligible_for_review` 或 `pending_not_accepted`，不能支持有条件通过。`accepted_residual` 也不会自动修改 P0 evidence、VETO checklist 或 release status。

## 10. 风险对验收结论的影响

| 风险/状态 | P0 semantic exit | selected claim | release handoff | final acceptance |
|---|---|---|---|---|
| `not_eligible` / `pending_not_accepted` | 不改变已验证事实，但不能作为放行依据；涉及 P0 时阻断 | 对应范围 blocked/not-decided | blocked if required | 不能支持有条件通过 |
| `eligible_for_review` | 等待授权；不产生通过 | 等待授权或 blocked | 等待授权 | `not_decided` |
| 合格 `accepted_residual` 且无 P0/VF/evidence impact | 不否定独立 P0 exit | 依 manifest 和记录 scope | 只有 release-required 条件均满足才可继续 | 可作为有条件通过候选，尚未形成最终结论 |
| 任一 S/VETO/P0 A | 阻断 | 阻断 | 阻断 | `不通过` 或 `不可裁决` |
| invalid/missing/cross-run evidence | 阻断 | 阻断 | 阻断 | `不可裁决` 或 `不通过` |
| required selected unavailable | P0 独立结果不被改写 | `blocked_dependency` | 阻断 release claim | 不能写成通过 |
| numeric threshold absent | structural gate 独立裁决；numeric=`not_evaluated` | 不形成 numeric claim | 不形成 numeric release claim | 只能记录 residual |

最终结论仍只允许 `通过`、`有条件通过`、`不通过`；设计阶段尚未进入 Step 14，不填写任何实际结论。

## 11. 后续同步矩阵

风险接受不是终点。每条真实 residual 必须按 owner 和影响同步到至少一个下游入口；同步入口不能反向改变本项目的 truth owner。

| residual 类型 | 必须同步位置 | 必须携带内容 | 禁止行为 |
|---|---|---|---|
| implementation / test tooling | `07-实施计划.md` boundary、implementation ledger、issue | exact source/cut、batch、gate、retest、rollback/pause | 只写“后续修复”或伪造完成 |
| configuration/profile/entry | `07` config boundary、`04` controlled reopen、运维文档 | key/row、profile、fail-fast、activation、selected applicability | 用默认值或 fallback掩盖缺失 |
| selected adapter/source/route/TLS/observer | selected manifest、`07` boundary、后续 selected test plan | product identity、scope、safe cleanup、R3/R4 trigger | 把未选择产品写成已验证 |
| performance/capacity/SLO | NFR/性能方案、`07` spike、运维文档 | workload、sample、threshold owner、window、reopen condition | 发明 P95/SLA 或把 sample当 pass |
| evidence retention/access/deletion | 运维标准、security/ops issue、`07` prerequisite | retention policy、access、hold、deletion manifest、restore | 伪造 retention days/backend |
| cross-repo seam/E2E | 独立 E2E 方案、ADR 或产品验收补充 | repo boundary、truth owner、typed unavailable/failure、no-write | 将 runtime/tools/approval 纳入 Hub |
| future schema/evolution | ADR、release/schema matrix、controlled reopen | version、compatibility、migration、trigger | 在当前验收中暗渡新义务 |
| README/历史污染 | T070 audit disposition | authority precedence、删改或保留理由 | 从 README 重新导入旧对象 |

## 12. 风险裁决流

### 图 1：Residual eligibility and acceptance flow

```text
observed risk / prerequisite
          |
          v
classify observation + source
          |
          +--> design blocker / P0 prerequisite / incomplete evidence
          |          |
          |          v
          |     blocked or reopen owner
          |
          v
bounded impact manifest
          |
          +--> VETO / S / current P0 A / P0 evidence impact
          |          |
          |          v
          |       repair + distinct retest + R2/R4 as triggered
          |
          v
eligible B/R residual?
          |
          +--> no --> pending_not_accepted / not_eligible
          |
          v
same-run evidence + owner + acceptor + deadline + follow-up
          |
          +--> incomplete --> eligible_for_review or blocked
          |
          v
authorized review
          |
          +--> rejected/expired --> reopened with new manifest/run
          |
          v
accepted_residual
          |
          v
conditional-acceptance candidate only
```

关键说明：

1. `accepted_residual` 是风险记录状态，不是测试 `passed`，也不修改 raw-derived P0 结果。
2. 任意 source/config drift 或 impact expansion 都使旧接受记录进入 `expired_or_reopened`，必须新建 manifest 和复验链。
3. selected required unavailable 始终是 `blocked_dependency`；不能靠另一个 selected run 或 P0 controlled run 补偿。
4. 无真实授权审查、接受人和 provenance 时，流程最多停在 `eligible_for_review`。

## 13. 受控重开与失效规则

| 触发 | 原风险记录 | 必须动作 |
|---|---|---|
| formal `00~06` source/AC/VF/threshold 变化 | 旧记录不再自动适用 | 回开 owning Step，重建 impact/case/EV，必要时执行 R2 |
| source/config 在 run 开始后漂移 | 旧 run 失去 current eligibility | 保留旧 raw/report 为历史；创建新 baseline/run |
| residual impact 扩展到 P0、VETO、truth 或 evidence | accepted/pending 记录失效 | 立即标 `expired_or_reopened`，按 S/A/full trigger 处理 |
| deadline/trigger 到期 | `accepted_residual` 到期 | 新 review 或保持 blocked，不自动续期 |
| follow-up 未完成或复验失败 | 接受条件不成立 | 回退到 `rejected_or_blocked`，保留原记录和新失败证据 |
| selected product 成为 release-required | P1 residual scope 改变 | 建新 selected/R4 manifest；缺失则阻断 release |
| new formal obligation 无现有 canonical owner | 不能用 risk row 吸收 | controlled reopen `00~05`，分配新 owner/TC/DS/EV |

## 14. 跨规则审计

| 审计项 | 结果 | 依据/处理 |
|---|---|---|
| `05` 的 16 项风险是否全部承接 | `16/16` | §7 source identity 保持不变 |
| accepted risk 是否被伪造 | `0` | 无 actual acceptor、run、evidence、decision provenance |
| VETO/S/P0 A 是否有 waiver path | `0` | §8 与 Step 12 一致 |
| P1/P2/selected unavailable 是否污染 P0 | `0`（设计规则） | §6、§10 明确隔离 |
| 缺 acceptor 是否仍可条件通过 | `0` | §9 acceptance predicate 禁止 |
| 缺 deadline/follow-up 是否可接受 | `0` | 必填字段与后续同步矩阵阻断 |
| numeric sample 是否被写成 numeric pass | `0` | 保持 `not_evaluated` |
| risk record 是否能回指 exact evidence | `pass-designed` | same-run raw/report/digest/pairing/no-static contract |
| source drift 是否自动延续接受 | `0` | §13 强制 reopen/new run |
| Hub 是否吸收外围责任 | `0` | scope 与后续同步均保持 boundary |

## 15. 回填草稿：formal `06-验收标准.md` §13

> 校准来源：
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“风险状态与资格模型”“不可风险接受矩阵”“风险接受记录合同”“风险对验收结论的影响”“后续同步矩阵”和“跨规则审计”小节，了解正式 §13 的候选条件、阻断边界和字段来源。

正式 §13 只承载以下收口结论：

1. 风险接受只适用于真实、边界明确、证据完整且不影响 P0 truth、VETO、当前 P0 A、责任/安全/配置/evidence hard redline 的 B/R residual；`CH-TEST-R01..R16` 当前均未被接受。
2. `VETO-CH-001..013`、过程 VETO、confirmed S、当前 P0 A、design contradiction、P0 prerequisite absence、forbidden material/ownership、reverse-write、P0 config hard failure、static/cross-run/digest-invalid evidence 和 fake review/signature 不得风险接受。
3. `reports/acceptance/risk-acceptance.md` 每条记录必须包含 `risk_id`、`source_ref`、`scope`、`classification`、`impact`、`p0_contamination_check`、`formal_refs`、`evidence_refs`、`acceptance_reason`、`mitigation`、`reopen_trigger`、`follow_up_ref`、`owner`、`acceptor`、`deadline_or_trigger`、`review_point` 和 `status`；缺接受人、证据、后续动作或期限不能支持有条件通过。
4. P1/P2、selected unavailable、numeric `not_evaluated`、operations policy 和 future evolution 只能作为明确 residual 记录，不得补足 P0 denominator、VETO checklist、selected required 或 release claim。
5. 风险记录必须同步到 `07-实施计划.md` boundary、issue/ADR、运维或后续验收入口；source/config drift、期限到期或影响扩展时必须新建 manifest/run 并重新审查。
6. `accepted_residual` 只是有条件通过候选状态，不是测试 pass、release pass、验收 verdict 或签署；最终结论留给 Step 14。

## 16. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 risk acceptor 角色与授权范围 | 影响条件通过 | Step 14 固定角色字段；当前不填姓名 |
| evidence retention/access/deletion policy | 影响长期审计 | 保持 `CH-TEST-R11` pending，转运维/安全标准 |
| 哪些未来 selected dependency 会成为 required | 影响 R3/R4 | 由 immutable manifest 和 release scope 决定，不在本步猜测 |
| numeric threshold owner、workload 和 window | 影响 NFR residual | 保持 `not_evaluated`，controlled reopen `00/05/06` |
| formal 07 boundary/issue/ADR 编号 | 影响 follow-up 引用 | 等 Step 7 计划装配后填写，当前不伪造引用 |

## 17. Step 13 完成门禁与 Step 14 入口

| 进入下一步条件 | 结果 |
|---|---|
| 所有当前 residual 都有分类、状态和处理口径 | `通过；16/16 已承接，accepted=0` |
| VETO/S/P0-A/evidence hard redline 不可风险接受 | `通过；无 waiver path` |
| eligible residual 的资格条件可判定 | `通过；predicate closed` |
| 风险接受必填字段与接受人门禁完整 | `通过；缺字段不得条件通过` |
| P0、selected、release、numeric 和 operations 影响分离 | `通过；无补偿路径` |
| 后续实施/问题/运维同步路径明确 | `通过；见 §11` |
| 真实风险接受、review、verdict、signoff | `均不存在；未伪造` |
| unresolved upstream blocker | `0` |
| 下一步 | `enter_06_step_14_final_decision_signoff` |

Step 13 的 `accepted-design` 只表示风险接受规则和字段已经可执行，不表示任何风险已经被真实人员接受，也不表示当前项目可以有条件通过。
