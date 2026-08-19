# L2-runtime 06 验收标准 Step 4：进入条件与退出条件

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填位置：正式 `06-验收标准.md` §4
> 状态：`completed_continuous_authorized`
> 输入：Step 3 immutable baseline、formal 05 §11~14
> 事实边界：以下均为 future gate contract；当前 process=`not_entered`，没有 actual checklist result

## 1. 本步目标

本 Step 将“测试 lane 是否可运行/退出”“验收 review 是否可进入”“decision package 是否可关闭”分成三个不同门禁。缺少送验 tuple 或 evidence 时保持 `not_entered`；证据证明 P0 失败时才进入实际“不通过”裁决；不可判定不伪装成通过或失败。

## 2. Acceptance process state

| State | Entry meaning | Allowed action | Forbidden inference |
|---|---|---|---|
| `not_entered` | 没有 valid immutable candidate package | 补齐/重建 baseline、执行、reports | 通过、不通过、已验收 |
| `entry_review` | package 已提交，正在检查 tuple/schema/authority/denominator | 只做准入校验 | 功能门禁已通过 |
| `in_review` | 所有 entry items 满足并冻结 decision package | 逐 AC/VF/defect/risk 裁决 | 自动通过/readiness |
| `paused` | 已进入但 source/scope/authority/defect/evidence 冲突需处理 | 保留 package，形成 gap/re-entry action | 风险接受绕过冲突 |
| `not_decidable` | 当前 package 无法可靠判定一个或多个 mandatory item | 拒绝形成 verdict，要求新 evidence/package | 等同“不通过”或“有条件通过” |
| `decision_ready` | 36 AC、8 VF、defect/risk 与 dimension results 已闭合 | 授权角色形成三值 verdict/signoff | 未签署 readiness |
| `closed` | verdict、next-stage disposition、signoff、archive digest 同 tuple 固定 | 只读复查或新 acceptance instance | 旧结论自动适用于新 revision/scope |

允许的主路径为 `not_entered -> entry_review -> in_review -> decision_ready -> closed`。`entry_review/in_review -> paused/not_decidable` 后只能通过显式 re-entry 回到 `entry_review`；不得直接修改旧 raw evidence 继续裁决。

## 3. Acceptance entry conditions

### 3.1 Baseline and authority

- [ ] `ENT-A01` 唯一 `acceptance_instance_id`、lane、candidate scope 和 included/excluded AC/VF 已固定。
- [ ] `ENT-A02` formal 00~06 source manifest 按 path/digest/revision/workspace status 可复查，无 historical alias。
- [ ] `ENT-A03` target implementation revision/worktree、Rust toolchain、manifest 和 build identity 已固定；`L2R-IMPL-001/LANG-001` 有实际 disposition。
- [ ] `ENT-A04` only-Core compile graph、13 slot contract/status、12 blocker/preflight snapshot 已固定且不伪造 closure。
- [ ] `ENT-A05` environment/profile、04 config snapshot pair、dataset/seed/clock/fault manifests 已固定。
- [ ] `ENT-A06` acceptance reviewer、architecture/security/test/domain/risk authority snapshot 已由有权主体提供；Agent 不自授 authority。

### 3.2 Execution and evidence package

- [ ] `ENT-A07` 一个非 `latest` fixed `run_id` 绑定 new isolated `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` roots。
- [ ] `ENT-A08` G1 candidate 精确包含 172 raw + 5 aggregate、8 suites、9 checks；无 extra/unowned/filter/skip/ignore/missing/cancelled item。
- [ ] `ENT-A09` required raw、suite report、check、gate、redaction、blocker 和 evidence index schema/digest/same-run pairing 有效。
- [ ] `ENT-A10` 177 planned EV 均派生为 eligible instance，或 package 明确不是 G1 complete candidate 而被拒绝进入。
- [ ] `ENT-A11` `reports/acceptance/handoff.md` 绑定 exact tuple、scope、run、index 与 blocker snapshot，未预填 verdict/readiness。
- [ ] `ENT-A12` `veto-checklist.md` 覆盖 VF001~008 且每项引用 eligible evidence；`open-issues.md` 覆盖所有 defect/blocker/residual。
- [ ] `ENT-A13` 若请求有条件通过，`risk-acceptance.md` 已列 candidate residual，但未把 draft 当作已授权接受。
- [ ] `ENT-A14` first-failure、defect、retest lineage 完整；candidate 上 open S/A=0，且不存在已知 applicable VF trigger。

### 3.3 Lane-specific entry

| Lane | Additional entry conditions | Entry failure posture |
|---|---|---|
| G1 local | `ENT-L01~15` 与 `EXT-L01~13` 已由 05 contract 产生有效 local candidate；177 分母不缩减 | acceptance `not_entered`; diagnostic run不可送验 |
| G2 candidate | named owner contract/schema、real adapter revision、non-TestFake profile、independent run、owner fact change齐备 | that lane `blocked_dependency/not_runnable` |
| G3 slot | `ENT-Q01~06`、dedicated `TC-QUAL-SLOTnn`/QUAL EV、real owner subject/environment、independent reviewer齐备 | that slot `not_evaluable`;不得借 local SLOT EV |
| product/release | G1 加所有 delivery-mandatory G2/G3 package、operations/release authority与明确 mandatory manifest | product/release review `not_entered` |

外部 positive lane blocked 不影响 G1 以 finite fake/BlockedAdapter 证明本地 fail-closed；但它阻止该 owner capability、slot 或产品 readiness 的正向结论。

## 4. Entry rejection matrix

| Condition | Process disposition | Why |
|---|---|---|
| candidate/revision/build/run absent | `not_entered` | 没有验收主语 |
| `latest`、moving branch、project-nested/absolute/escaping path | `entry_rejected` -> `not_entered` | 无法复查同一材料 |
| 177 denominator mismatch/hidden filter | `entry_rejected`; execution invalid | 不能用缩分母结果裁决 |
| raw/report/index/check cross-run or digest conflict | `not_decidable`/entry rejected | evidence identity 无效 |
| static EV/VETO/pass 或手写 raw status | entry rejected；可触发 VF006 | evidence truth 被伪造 |
| fake bound to non-TestFake profile | entry rejected；可触发 VF | subject identity 被替换 |
| open S/A or known VF trigger | 可直接受理为失败审查，不能以“pass candidate”进入 | 保留失败事实供“不通过”裁决 |
| reviewer/signoff authority absent | `not_entered` | Agent/脚本不能自授裁决权 |
| positive seam owner facts absent | only affected G2/G3/product lane rejected | 不缩减 G1 local obligation |

已知 P0 failure package 可以进入 `in_review` 以形成 evidence-backed “不通过”；它不得被误标为满足 pass-candidate entry。缺失/无效 evidence package 不能用同一路径形成“不通过”，因为尚无可靠事实可裁决。

## 5. Acceptance exit conditions

### 5.1 Common decision closure

- [ ] `EXT-A01` 36 个 `AC-L2R-*` 在 candidate scope 内逐项具有 `passed/failed/not_evaluable` disposition、正式设计来源、canonical TC、eligible EV/report path 和裁决影响。
- [ ] `EXT-A02` 8 个 `VF-L2R-*` 逐项为 `not_triggered/triggered/not_evaluable`；所有 applicable VF 均可判定。
- [ ] `EXT-A03` 功能、边界、协议、状态/UoW、NFR、证据六个 dimension result 与明细一致，无手工覆盖。
- [ ] `EXT-A04` source/requirement/CUT/TC/EV/AC/VF 双向 trace 无 orphan、duplicate owner、old alias 或 broken path。
- [ ] `EXT-A05` raw/report/index/check/acceptance review 全部绑定同一 baseline tuple；redaction 和 no-static checks 有效。
- [ ] `EXT-A06` S=0、A=0 才能 pass/conditional pass；所有修复保留首败并由新 run targeted+impacted retest 关闭。
- [ ] `EXT-A07` 所有 residual 具有 owner、acceptor、authority、action、deadline、expiry/reopen trigger；不可接受项为 0。
- [ ] `EXT-A08` overall verdict 只取 `通过/有条件通过/不通过`，由规则从 dimension/VF/defect/risk 派生并经授权 reviewer 确认。
- [ ] `EXT-A09` next-stage disposition 明确 lane ceiling，不把 local pass 写成 G3/product/release readiness。
- [ ] `EXT-A10` signoff role/status/timestamp/package digest 绑定同一 decision package；归档可复查且不改 raw。

### 5.2 Verdict-specific exit

| Verdict | Required condition | Forbidden |
|---|---|---|
| `通过` | all applicable P0 AC/dimensions pass；all applicable VF not_triggered；S/A=0；no mandatory not_evaluable；no unaccepted mandatory risk | local pass 推导外部/product readiness |
| `有条件通过` | P0 与 VF 条件同“通过”；仅 eligible B/C 或 explicitly optional seam residual；每项有 authorized acceptance 与未过期 condition | 接受 VF、S/A、P0 failure/evidence gap/mandatory seam not_evaluable |
| `不通过` | eligible evidence 证明任一 P0 failed、VF triggered、S/A open、hard redline/evidence integrity violated | 仅因没有送验包或 evidence absent 就宣判失败 |

### 5.3 Lane conclusion ceiling

| Closed lane | Maximum allowed conclusion |
|---|---|
| G1 local | `local_contract_accepted/accepted_with_conditions/rejected` for exact implementation/profile/run |
| G2 candidate | named seam/version/profile compatibility disposition |
| G3 slot | named slot/owner/version/profile/environment qualification disposition |
| product/release | only when all mandatory package refs and release authority are present，可形成相应 readiness disposition |

## 6. Pause, abort, re-entry and supersession

| Trigger | Immediate action | Re-entry requirement |
|---|---|---|
| design/scope/owner contract drift | `paused_design_drift` | 回写 truth source，重做影响 Step，new manifest/run/package |
| implementation/config/data/selector change | invalidate candidate | new fixed run；不得跨 run merge |
| evidence schema/digest/pairing/redaction conflict | `not_decidable`；必要时 quarantine | 修复 generator/harness，新 run 与 clean package |
| S/A/VF/redline detection | preserve and review for `不通过` | fix + targeted/impacted/full required new run |
| nondeterminism/flaky/timeout | failed/infra as defined，保留 attempts | 消除原因，新 run；不 quarantine-to-pass |
| external blocker owner fact changes | affected G2/G3 `re-entry_review` | 验 provenance/contract/subject/profile，专用 qualification run |
| risk condition expires/reopen trigger occurs | supersede conditional disposition；禁止继续声称 condition valid | new risk review and, where affected, new evidence/package |
| reviewer authority changes | pause before signoff | new authority snapshot/review version |

旧 acceptance package 永不原地改写。新 package 必须记录 `prior_acceptance_instance_id`、supersession reason 和新 tuple；旧失败、条件和签署保持可审计。

## 7. Current actual gate truth

| Gate | Current actual state | Reason |
|---|---|---|
| baseline/candidate | absent | 无 implementation/build/config/data/run tuple |
| G1 acceptance entry | `not_entered` | 177 cases 未执行，M1~M5 none |
| G2 candidate | `blocked_dependency/not_runnable` where applicable | real adapter/owner subject/evidence absent |
| G3 qualification | 13/13 `not_evaluable/blocked_dependency` | dedicated QUAL baseline/run absent |
| product/release | `not_entered` | mandatory package/authority absent |
| actual defects/accepted risks | none recorded / 0 accepted | 不伪造 issue 或 acceptance |
| verdict/signoff/readiness | none/not_bound/not_formed | 未进入验收 |

## 8. 回填草稿与 stop-review

Formal §4 应包含 process states、14 个 common entry 条件、lane-specific entry、10 个 exit 条件、三值 verdict exit 和 pause/re-entry。Checklist 在正文中仍是规范条件，不得勾选为 actual complete。

| Audit | Result |
|---|---|
| entry vs failure decision | missing evidence=`not_entered/not_decidable`; proven failure may yield `不通过` |
| test exit vs acceptance entry | explicitly separated |
| G1/G2/G3 | independent gates and conclusion ceilings |
| VETO/risk | applicable VF not_evaluable and triggered cannot be accepted |
| current posture | all actual review states remain not_entered/none |

```text
step_status = completed_continuous_authorized
acceptance_entry_conditions = 14_plus_lane_specific
acceptance_exit_conditions = 10_plus_verdict_specific
current_process_state = not_entered
next_step = Step 5
formal_06_write_allowed = false_until_step_15
```
