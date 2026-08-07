# L2-tools 06 Step 13 风险接受与遗留项校准

> 文档状态：Step 13 completed / design stop-review passed
> 当前模式：full-restart
> 回填目标：`06-验收标准.md` §13
> 事实边界：本文只定义 residual eligibility、风险接受记录和遗留项交接；不表示任何风险已经被接受，不填写真实姓名、日期、签名、run、evidence 或结论

---

## 1. 本步输入与执行计划

### 1.1 已读取输入

| 输入 | 本步用途 |
|---|---|
| `standards/document/验收标准讨论流程_SOP.md` Step 13 | 固定风险表字段、接受人和后续动作要求 |
| `standards/document/验收标准书写规范.md` §5.13 | 固定风险接受最低字段及 VETO 禁止覆盖规则 |
| `05-测试方案.md` §14.6~§14.7 | `L2T-RR-001~016` 唯一 residual registry 和 06 交接边界 |
| `00-需求文档.md` §13~§15 | 风险、待确认和 `L2T-UP-001~009` 当前状态 |
| `04-配置设计.md` §14 | P1/P2/inactive/future 配置风险与 reopen 触发 |
| Step 10 | `risk-acceptance.md` 只作为 pre-seal proposal，不能自我形成接受 |
| Step 11~12 | VETO/S/P0 A/hard-check 不可接受，缺陷关闭与放行前置 |

### 1.2 Step 内计划

- [x] 固定 eligible residual predicate 和禁止条件。
- [x] 逐项审计 `L2T-RR-001~016` 的当前 disposition、影响、缓解、owner、reopen trigger。
- [x] 区分可作为风险接受候选的 residual、只能记录的 blocker、已调和项和 06 流程前置。
- [x] 固定 `reports/acceptance/risk-acceptance.md` 的 schema、状态和审查顺序。
- [x] 固定与 Step 12 放行、Step 14 三值结论和未来 `07`/运维文档的交接。
- [x] 完成跨 residual、VETO、evidence、entry/exit 和上游 blocker 审计。

## 2. SOP 问题回答与取舍

| 问题 | L2-tools 裁决 |
|---|---|
| 哪些风险可以支持有条件通过？ | 只有已排除当前 P0 denominator、VETO、S、P0 A、hard evidence/config/security/dependency gate 的 B/R residual；且本轮 P0 release chain 已完整、影响被限定、owner/acceptor/deadline/reopen trigger 全部具备。 |
| 哪些风险不能接受？ | 任一 `VF-L2T-001~013`、S、当前 P0 A、P0 missing/blocked/not-evaluated/invalid、redaction/dependency/pair/profile/blocker/purity/phase/pairing/no-static hard gate、未绑定 baseline/source/delivery、把 open contract 写成 ready 的问题。 |
| 每个风险的接受人是谁？ | 设计阶段只固定接受角色字段；实际 `acceptor` 必须由授权验收/业务/架构/安全等角色在 matching review tuple 中填写。`not_bound`、`<role>` 或空字段都不能支撑有条件通过。 |
| 后续动作和截止时间是什么？ | 每行必须有可验证 action、owner role、绝对截止日期或可观察触发条件，并有 `follow_up_ref` 指向实施计划、运维文档、issue 或重新验收入口。 |
| 是否同步实施计划或问题记录？ | 会影响实现、测试、运维、合规或上游闭口的 residual 必须同步到后续正式计划/运行文档；`open-issues.md` 只聚合 safe ref，不替代 defect 或 risk authority。 |

### 2.1 取舍记录

| 议题 | 采用方案 | 依据 |
|---|---|---|
| 无接受人风险能否有条件通过 | 不能 | SOP 明确要求接受人；没有接受人无法形成责任和截止约束 |
| P1 positive blocked 是否自动阻断 local P0 | 不自动，但不计 pass | 只有 scope manifest 未纳入 P0 且 local/negative P0 完整时才可作为 residual candidate |
| `L2T-RR-007/012` 是否可风险接受 | 不可作为当前验收退出依据 | 它们阻断 immutable source/delivery baseline，属于 entry blocker，不是可接受的产品残余 |
| `L2T-RR-015` 是否进入风险接受 | 不进入 | 已是 reconciled 设计记录；不是开放风险、缺陷或 future capability |
| `L2T-RR-016` 是否进入风险接受 | 不进入 | `06` 自身尚未闭合的流程前置，必须由 Step 15 关闭，不得通过风险表绕过 |
| 证据 retention 未定是否允许删失败记录 | 不允许 | `L2T-RR-013` 只能保留策略待定，不能放宽 failure/retest artifact 的保留要求 |
| 签署是否自动等于风险接受 | 不等于 | 风险接受必须逐项在独立记录中由 acceptor 明确同意，最终签署只引用该记录 |

## 3. Residual 与风险接受 authority

### 3.1 对象分层

| 对象 | 权威来源 | 允许作用 | 禁止推断 |
|---|---|---|---|
| `L2T-RR-*` registry row | 当前 `05` §14.6 safe residual registry | 提供候选风险的范围、缓解、owner/reopen 线索 | 已接受、已关闭、P0 通过 |
| `reports/runs/<run_id>/acceptance-draft/risk-acceptance.md` | matching release 的 pre-seal projection | 提供本 run 的风险建议和 refs | 已签署、已接受、最终 verdict |
| `reports/acceptance/risk-acceptance.md` | matching manifest 的 fixed working projection | 提供待审逐项记录 | 没有 acceptor/review block 时的有条件通过依据 |
| risk review block | append-only reviewer source tuple | 记录 inspected/accepted/rejected/deferred/disputed | 回写 seal/index/eligibility 或替代 defect closure |
| Step 13 decision | 06 设计和未来 acceptance authority | 判定 residual 是否 eligible candidate | 当前生成真实接受事实 |
| final signoff | Step 14 required role records | 确认最终结论和已列风险 | 隐含接受未列风险或 VETO/S |

### 3.2 Eligible residual predicate

未来 residual `r` 只有同时满足下列条件，才可作为“有条件通过”的候选；`eligible_candidate` 仍不是 `accepted`：

```text
eligible_residual(r) :=
  r.registry_ref ∈ {L2T-RR-001..016}
  AND r.scope ∉ current_P0_denominator
  AND r does_not_trigger VF-L2T-001..013
  AND r.severity ∈ {B, R} OR r is explicitly classified as non-defect blocker
  AND no P0 truth/security/consistency/evidence/config/dependency hard gate is missing
  AND matching release gate-summary.status = passed
  AND all required local P0 candidate slots are eligible
  AND r.impact, mitigation, owner_role, acceptor_role, deadline_or_trigger are non-empty
  AND r.follow_up_ref and reopen_trigger are resolvable
  AND no field contains a real secret/raw body or fabricated run/commit/digest
```

`A` 不满足该 predicate；即使外部责任或测试 harness 造成 A，也必须先修复并按 Step 12 新 run 关闭。`blocked_dependency` 只有在明确属于未纳入本轮 P0 的 conditional positive 时可成为 R 候选；若影响 current P0 denominator，则是 entry/exit blocker。

### 3.3 不可接受 predicate

以下任一条件成立时，risk record 必须为 `ineligible` 或 `blocked`，不能写 `accepted`：

- `vf_refs` 非空且对应 VF 触发，或无法证明 VF `not_triggered`；
- severity 为 `S` 或 current-P0 `A`；
- required evidence slot 为 `ineligible`、`unavailable`、`invalid` 或 `pending_review` 未处理；
- release seal、projection manifest、source/delivery/baseline tuple 不匹配；
- 风险通过降低 P0 scope、删除失败 case、跨 run 拼接、静态 candidate、health marker 或旧报告来“解决”；
- owner/acceptor/deadline/follow-up/reopen 任一缺失；
- 风险记录含未脱敏 raw body、secret、真实诊断正文或伪造事实；
- 记录声称 provider/Sandbox/Bus/Obs/SDK/readiness 已完成，而上游仍 `L2T-UP-*` open。

## 4. `L2T-RR-001~016` 逐项 disposition 审计

表中 `acceptor`、`deadline_or_trigger` 使用 `not_bound` 只表示当前设计没有实际接受实例；不得替换为真实姓名、日期或签名。`candidate` 表示未来可在满足 predicate 后提交，`blocked` 表示不能作为当前有条件通过依据。

| RR | 当前状态 / 类别 | 影响 | 当前缓解 | eligible candidate 条件 | owner role / reopen trigger | 当前风险接受状态 |
|---|---|---|---|---|---|---|
| `L2T-RR-001` | `blocked_dependency` / conditional positive | authorization owner/source 未闭时不能证明正向 governed allow/deny | requirement 与消费判断分离；missing/stale/conflict/unverifiable fail closed/no-execution | scope 未纳入 positive P0；local/negative P0 evidence 完整；不宣称 decision/readiness | authorization/Sandbox owner；owner、schema、freshness 和 source matrix 正式闭口 | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-002` | `blocked_dependency` / conditional positive | taxonomy/schema/version 未闭时不能证明分类正向 | typed requirement、deny/no-execution、unknown 保持 | 同 RR-001，并有正式 taxonomy/source ref | authorization owner；taxonomy/version/source matrix 闭口 | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-003` | `blocked_dependency` / conditional positive | Sandbox generic mapping 未闭时不能证明真实执行映射 | no-host；mapping blocked；Prepared/unknown/manual | local handoff/negative P0 完整，positive 明确 excluded/conditional | Sandbox + L2 integration；Port/map/source/receipt contract 闭口 | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-004` | `blocked_dependency` / external feedback | receipt/cleanup/DLQ/feedback 未闭时不能声称 delivery | local attempt/status 独立；unknown/manual；不写 receipt | 本轮不把 delivery 正向纳入 P0；safe local evidence 完整 | Sandbox owner；receipt/cleanup/DLQ/feedback contract 闭口 | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-005` | `blocked_dependency` / observation seam | producer/source family 未闭时不能声称 Observed | body-free material、local truth first、route gap | P0 仅验 safe carrier/status independence；positive route excluded | Observability owner；producer/source/schema/route 闭口 | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-006` | `blocked_dependency` / conflict | Bus/Obs route/status formal chain 冲突影响正向交接解释 | delivery 与 observation 独立；conflict 显式记录 | P0 scope 不含 external delivery/observed；无冲突写入 local truth | Bus/Obs owner；formal chain reconciliation | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-007` | `unverifiable` / entry blocker | 无 immutable workspace/source baseline，无法重现验收 | `uncommitted/not_available` 显式标记；不填假 commit | 必须先绑定 immutable source；不能以风险接受替代 | workspace/release owner；baseline frozen and verified | `blocked`; not eligible |
| `L2T-RR-008` | `candidate_only` / dependency pending | Core Tools-specific schema/package authority 未闭 | 只消费 shared category candidate；不复制 schema/package | current P0 只依赖已确认 Core category；tools-specific positive 排除 scope | Core owner；formal type/package authority | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-009` | `future` / downstream | SDK tools-specific client 未覆盖 | server contract/guidance only；不声明现成 client | SDK 不在当前 P0/P1 scope；无 server truth 反向依赖 | SDK owner；tools-specific client contract | `eligible_candidate`; acceptor=`not_bound` |
| `L2T-RR-010` | `unverifiable` / measurement | 无负载模型、阈值和 measurement authority，不能数字裁决 | 只收 duration/count provenance，correctness first | 不将数字作为 P0；结构性 NFR 和 safe evidence 完整 | performance/acceptance owner；registry、load model、threshold formal | `eligible_candidate`; acceptor=`not_bound` |
| `L2T-RR-011` | `conditional` / implementation capability | durable Store/UoW/sidecar positive capability 未证实 | fake/deterministic/controlled parity；CAS/pair/unknown 不放宽 | current P0 只要求 local semantic/controlled parity；无 fake-as-ready claim | storage/implementation owner；capability/profile formal | `candidate_only`; acceptor=`not_bound` |
| `L2T-RR-012` | `not_available` / entry blocker | implementation repo/runner/entry command 不可定位，无法产生真实结果 | 只保留 suite/script/CLI contract；不声称执行 | 必须绑定 implementation/delivery，不能风险接受替代 | implementation/test owner；repo manifest/entry command locatable | `blocked`; not eligible |
| `L2T-RR-013` | `pending` / operations policy | retention/media/deletion owner 未定，长期保留无法裁决 | acceptance/retest/residual review 期间不得删除；失败 run 只读保留 | 只要临时保留义务满足且不声明长期合规，可作为 policy residual | acceptance/ops owner；retention policy/media/role formal | `eligible_candidate`; acceptor=`not_bound` |
| `L2T-RR-014` | `inactive` / future qualification | staging/production-like readiness 未覆盖 | profile inactive；fake/ref/health 不升 ready | 明确 excluded from current denominator；P0 local chain 完整 | release/ops owner；profile/source/measurement/provider closed | `eligible_candidate`; acceptor=`not_bound` |
| `L2T-RR-015` | `reconciled` / closed design note | 历史 theme/TC wording 差异已通过 concrete TC 规则处理 | Step 5/6/9 已统一；不新建 case | 不适用；不得作为 residual 或 defect | test design owner；若新增 TC，重开相关 Steps | `not_applicable`; no acceptance |
| `L2T-RR-016` | `blocked_by_06` / process prerequisite | 06 verdict/signoff/risk authority 尚未由正式文档闭合 | candidate/draft handoff only；无签署 | 必须完成 Step 15；不能用自身 risk record 关闭 | acceptance owner；formal 06 assembly | `blocked`; not eligible |

当前没有 `accepted` 实例。`eligible_candidate` 也不等于 `accepted`；只有未来 matching review tuple 中 authorized acceptor 明确记录后，才可进入 Step 14 的有条件通过矩阵。

## 5. 风险接受记录 schema

### 5.1 固定路径与生命周期

| 阶段 | 固定路径 / 来源 | 状态 | 权限边界 |
|---|---|---|---|
| pre-seal proposal | `reports/runs/<run_id>/acceptance-draft/risk-acceptance.md` | `draft` | 只能引用 same-run source、candidate 和 residual registry；不能写已接受或 verdict |
| fixed working projection | `reports/acceptance/risk-acceptance.md` | `review_required` | exact-byte projection；缺 acceptor 不得支撑 conditional pass |
| review block | `reports/review/reviewer-notes.md` 或 `agent-review.md` append block | `inspected/accepted/rejected/deferred/disputed` | 只能解释和决定 risk record，不回写 seal/index |
| final decision reference | 06 Step 14 decision record | `not_bound` 当前 | 只消费 matching reviewed risk records；不从签署反推接受 |

### 5.2 每行最小字段

| 字段 | 约束 |
|---|---|
| `risk_ref` | 必须回指 `L2T-RR-*` 或 future formal risk ID；不以自由文本代替 |
| `scope` / `priority` | 明确 P1/P2/future/excluded 或 B/R；不得把 P0 hard gate 标 residual |
| `impact` | 对当前验收、下一阶段、运维或合规的具体影响 |
| `acceptance_reason` | 证明不触发 VF、未污染 P0、为何可以条件化进入 |
| `evidence_refs` | same-run eligible/blocked-safe refs；不能用 candidate slot 单独支撑 |
| `owner_role` | 后续动作责任角色；不能只写 team 名称或空值 |
| `acceptor_role` / `acceptor_ref` | 授权接受角色和 review tuple 引用；当前为 `not_bound` |
| `deadline_or_trigger` | RFC3339 日期或可验证 owner/schema/profile/measurement 触发条件 |
| `follow_up_ref` | `07`、运维文档、issue、ADR 或 reopen Step 引用 |
| `reopen_trigger` | 新 scope、owner closure、P0 impact、重复缺陷或 evidence drift 条件 |
| `status` | `candidate_only`、`review_required`、`accepted`、`rejected`、`blocked`、`expired`；当前不生成实例 |

### 5.3 接受顺序

```text
residual registry
  -> scope/baseline check
  -> VETO/S/P0/hard-gate exclusion
  -> same-run evidence/reference check
  -> impact + mitigation + owner + acceptor + deadline/reopen check
  -> authorized risk review block
  -> Step 14 conditional decision reference
```

任何步骤失败都保持 `blocked` / `review_required`，不能跳到 `accepted`。接受记录是 append-only；变更需新 record 或 supersedes ref，不覆盖旧接受/拒绝事实。

## 6. 与放行、实施和运维的边界

| 下游 | 必须接收 | 不得接收为事实 |
|---|---|---|
| Step 14 | accepted residual refs、acceptor、deadline、reopen trigger 和未接受清单 | candidate/draft 直接当 accepted；签署隐含接受 |
| `07-实施计划.md` | owner/action/dependency/reopen 条件，尤其 RR-001~014 | 伪造实现 ready、commit、run 或完成日期 |
| 运维/部署文档 | retention、profile、provider、route、capacity 的后续动作和触发 | 当前 staging/production readiness 或 SLA |
| `reports/acceptance/open-issues.md` | blocker、residual、failed/unavailable/pending safe refs | 关闭缺陷、接受风险或最终 verdict |
| 上游 owner | exact contract closure、source/schema/mapping/route/readiness 的 reopen 条件 | L2 私自关闭 `L2T-UP-*` |

## 7. 逐项停审与跨 residual 审计

### 7.1 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 16 个 RR 均有当前 disposition | pass | `RR-007/012/016` 明确 blocked；`RR-015` not_applicable |
| eligible predicate 可执行 | pass | 同时要求 scope、P0 evidence、VF/S/hard-gate 排除和责任字段 |
| VETO/S/P0 A 不可接受 | pass | 与 Step 11/12 和 `EXT-L2T-005` 一致 |
| 无接受人不能 conditional pass | pass | `acceptor=not_bound` 保持 candidate/block |
| blocker 不被伪装为 residual pass | pass | current P0 blocker 继续阻断；conditional positive 才可候选 |
| evidence authority 正确 | pass | final seal/index/projection/review 分层；draft 不等接受 |
| 后续动作和截止/触发完整 | pass | 每个 candidate row 固定 owner/reopen/follow-up 字段 |
| 当前事实诚实 | pass | 没有 accepted risk、姓名、日期、签名、run 或 verdict |

### 7.2 跨 residual 覆盖审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `L2T-UP-001~009` 覆盖 | pass | RR-001~009 逐项承接；开放状态不被关闭 |
| performance/measurement | pass | RR-010 只保留 structural sample；无数字 threshold authority |
| implementation/storage | pass | RR-011/012 区分 conditional capability 与 entry blocker |
| retention/ops/readiness | pass | RR-013/014 只作 policy/future candidate，不写 readiness |
| historical/process | pass | RR-015/016 不进入 risk acceptance |
| Step 12 consistency | pass | S/A 不可接受；B/R 需重新满足 predicate |
| Step 14 consistency | pass | 未接受 residual 不能有条件通过；接受不改变 machine eligibility |
| 07 handoff | pass | 后续 action/ref 可交接，当前不创建 implementation ledger |
| 无孤儿/重复 | pass | 16/16 registry rows 一一覆盖；不新增第二 risk denominator |

无新增上游 blocker。

## 8. 旧正式 06 差异与回填草稿

旧 §9 只有三条泛化风险，缺少 RR registry、acceptor/deadline/follow-up、entry blocker 和 evidence authority；作为 historical material 不继承。

正式 §13 应回填：eligible residual predicate、不可接受 predicate、`L2T-RR-001~016` disposition 表、风险记录 schema、接受顺序、下游交接、停审与跨 residual 审计。正文必须声明当前无 accepted risk；`risk-acceptance.md` 的 proposal/projection 不能单独支持有条件通过。

## 9. 进入下一步条件

- [x] 所有 `L2T-RR-001~016` 都有明确 disposition、影响、缓解、owner 和 reopen trigger。
- [x] eligible residual predicate 与 Step 12/14、evidence seal 和 scope/baseline 一致。
- [x] VETO、S、P0 A、hard gate、entry blocker 和 06 process prerequisite 均不可风险接受。
- [x] 风险接受字段、状态、路径、审查顺序和后续交接可执行。
- [x] 当前没有真实 accepted risk、acceptor、deadline、签署或 verdict 实例。
- [x] 无新增上游 blocker；允许进入 Step 14 最终结论与签署口径。
