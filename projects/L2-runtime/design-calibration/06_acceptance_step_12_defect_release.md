# L2-runtime 06 验收标准 Step 12：缺陷、复验与放行

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填位置：正式 `06-验收标准.md` §12
> 状态：`completed_continuous_authorized`
> 输入：formal 05 Step 9 automation/status、Step 11 defect/retest、Step 12 entry/exit、Step 11 VETO、Step 10 evidence contract
> 事实边界：本 Step 定义 future defect/retest/release decision contract；当前没有 defect、issue、fix、commit、run、retest、closure、release verdict 或 signoff

## 1. 缺陷记录边界

缺陷记录必须先保留失败事实，再进行归因和严重度判断。以下记录类型不可互换：

| Record kind | 判定 | 可否算通过 | 后续路径 |
|---|---|---|---|
| `product_defect_candidate` | canonical oracle 与实现行为不一致，已排除 fixture/runner 误用 | 否 | S/A/B/C 分级、修复、复验 |
| `test_tooling_defect_candidate` | selector、fixture、fake、runner、check、report generator 违约 | 否 | 工具修复 + 新 run；可能升级 S |
| `execution_incident` | toolchain、namespace、cleanup、环境失败，产品归因未定 | 否 | 保留 `infra_error`，调查后新 run |
| `dependency_blocker` | owner contract、adapter、profile、environment 或实现缺失 | 否 | blocker ledger；不得 retry-to-green |
| `residual_risk_candidate` | future/P1/P2、无数值阈值或明确 out-of-scope 暴露 | 否 | Step 13/未来 06 决定 |

Expected `Blocked/Unknown/Unavailable` negative case 可以在 local G1 作为通过，但永远不关闭对应 G2/G3 positive blocker。

## 2. S/A/B/C 严重度与结论影响

| Level | 精确定义 | 典型 Runtime 例子 | 当前 gate 影响 | 风险接受 |
|---|---|---|---|---|
| `S` | 任一 VF-L2R-001~008，或可伪造不可逆/已接受 truth 的安全、phase、证据、依赖失败 | owner reverse-write、fail-open、secret/body leak、unknown retry、ACK promotion、fake/static evidence、非 Core package edge、orphan source | 立即停止受影响 lane；通常要求完整 177 + 9 checks 新 run | 禁止 |
| `A` | 未达到 S 但仍是 P0 protocol/state/UoW/idempotency/config/entry/denominator 失败 | 合法迁移错误、partial UoW、query write、ACK-before-commit、cursor skip、177 denominator gap | 阻断含该项的 G1 gate，修复后 targeted + impacted；必要时 full | 不得在本轮 P0 中 ad hoc 接受 |
| `B` | 无 P0 truth/security 影响的 P1/P2/future 或有界工具问题 | characterization 缺字段、非阻断报告可读性、未来 candidate adapter mismatch | 记录并保持受影响 lane non-qualified | 仅未来授权角色可接受 |
| `C` | 已证明不影响语义、证据、执行的文档/可用性问题 | 非规范性 typo、断链但 source check 仍完整 | 文档修订后关闭 | 不需要验收风险接受 |

严重度依据影响而非退出码。能隐藏失败、缩减分母、泄漏材料或合成 evidence 的 tooling failure 至少为 S。

## 3. Defect record 与生命周期

Future defect record 至少绑定：`defect_ref`、`record_kind`、`severity`、`status`、`first_run_id`、`source_suite/source_case_or_check`、first artifact/report refs、formal design refs、fixture/config/fault digests、observed/expected typed difference、owner boundary、impact scope、fix/retest refs、closure evidence refs 和 append-only triage history。不得复制 raw secret/body/stack。

```text
[Observed]
    |
    v
[TriagePending] --> [ClassifiedIncident] --> [ResolvedIncident]
    |                       |
    +---------------------->+--> [Triaged]
                              |
                              v
 [FixPlanned] -> [FixCandidate] -> [RetestPending]
                                      |
                         +------------+------------+
                         v                         v
                  [RetestFailed]             [RetestPassed]
                         |                         |
                         +-> [Reopened]       [ClosureReview] -> [Closed]

[DependencyBlocked] -- owner fact changes --> [TriagePending]
```

`Observed` 不是 verdict；`FixCandidate` 不是 closed；`infra_error` 没有新 valid run 不能变成 `RetestPassed`；重复出现必须 `Reopened` 并保留历史。

## 4. 复验身份与证据规则

1. 每次 targeted、impacted 或 full retest 都分配新的固定 `<run_id>`，可选 `prior_run_id` 指向首次失败；禁止同 run 重跑、`latest`、best-of-run 或 cherry-pick。
2. 原始 manifest、variant、seed、fault script、config snapshot、implementation revision/workspace status 必须保留；首次失败永不删除或覆盖。
3. 复验通过必须同时具备 raw case、owning suite report、required checks、digest/pairing/redaction 和闭合的 failure status；绿色 exit code 单独无效。
4. aggregate 只能从同一新 run 的 child raw 结果重建；缺失/非通过 child 使 aggregate 不通过。
5. VETO/S 缺陷修复后，先 targeted reproduction，再受影响集合，再完整 `172 raw + 5 aggregate + 9 checks` G1 run；G2/G3 仍独立。

## 5. Targeted / impacted / full 回归矩阵

| 变更或缺陷面 | Targeted | Impacted | Full escalation |
|---|---|---|---|
| shared ID/ref/digest/envelope/error | 原始 case + `TC-CAP01-001` + changed C/Q/E/O/J | `unit_state`、`contract_protocol`、affected service/entry | public field/enum/version/digest change |
| state/invariant/error | 原始 SM/ERR + owning CAP/C/E/J | `unit_state` + owning + fault/replay | state variant/terminal/Unknown rule change |
| Command/write set | 原始 C/CAP + SM/UOW companion | service + contract/fault/entry | shared mutation/UoW semantics |
| Query visibility/no-write | 原始 Q + stale/hidden/cursor variants | all 12 Q + related state | query contract or visibility order change |
| inbound/outbound event | E/O + duplicate/collision/unknown | entry + UoW/replay + protocol | envelope/ACK/event snapshot change |
| Job lease/page/cursor | J + lease/fault | all 7 J + SM18/UOW/REPLAY | lease/cursor/report schema change |
| external slot/owner boundary | SLOT + CAP/C/BOUND | contract + service/fault/security | owner/Port/dependency type change |
| checkpoint/recovery/fence | CAP10/C12~14/J04/05/SM11/12/28 | service + fault + entry + E2E005 | physical/logic fence semantics change |
| config/profile/slot/job | CFG + related consumers | all 15 CFG + affected suites | any root/leaf/derived/profile/V-stage change |
| security/source/dependency | original security/source case | full `security_source_boundary` + samples | any VF/source/dependency rule change |
| selector/gate/report/evidence tooling | failing check + synthetic status corpus | all checks + one case per 7 raw suites + 5 aggregate | tooling decides completeness/status |
| local E2E aggregate | aggregate + every non-pass child | child owning suites, then all aggregates | aggregate derivation rule change |

未能枚举闭合 affected set 时必须升级 full 177，不能以不确定性缩小分母。

## 6. 放行分层

| Gate | 放行对象 | 必要条件 | 不代表 |
|---|---|---|---|
| `G0` | design-to-implementation handoff | formal 00~05、case/data/env/suite/oracle/evidence contract 完整 | code/test exists |
| `G1` | local deterministic contract candidate | one fixed run，172/5 exact，all required suites/checks，no S/A，evidence pairing/redaction valid | owner adapter、Sandbox、provider、Bus、Obs readiness |
| `G2` | named integration candidate | owner contract/schema、adapter/profile、controlled environment、independent run | positive qualification/production readiness |
| `G3` | one external slot qualification | real owner + non-TestFake adapter/profile/environment + independent evidence | whole Runtime/product acceptance |

G1 可以在 G2/G3 明确 `blocked_dependency` 时讨论 local contract candidate，但整体 readiness、release 或 product entry 不得由 G1 推导。13 slots 必须逐 slot 裁决，不存在 “部分通过即 Runtime ready”。

## 7. 复验关闭条件

| 关闭对象 | 必须有 | 不足时 |
|---|---|---|
| S | immutable first failure、exact manifest、fix/impact、targeted + full 177 new run、all checks、security/architecture/test review | 保持 blocked/failed；禁止风险接受 |
| A | first failure、fix/impact、targeted + affected suites、required checks、closure review | P0 gate blocked |
| B | record、impact、future owner/action/deadline、affected lane evidence | residual/open；不得隐式通过 |
| C | source/document diff、link/source check | 文档修订后关闭 |
| dependency blocker | owner authority fact、provenance、rebaseline、independent candidate/qualification plan | `blocked_dependency/not_runnable` 保持 |

## 8. Step 停审与跨放行审计

| 审计项 | 结论 | 当前事实 |
|---|---|---|
| severity | S/A/B/C impact-based；8 VF 强制 S | no actual defect |
| first-failure truth | immutable run/artifact/report；no merge/cherry-pick | no run |
| retest identity | every retest new run + prior link | not entered |
| full escalation | S/A/shared truth/tooling changes trigger 177 + 9 checks | planned |
| gate separation | G0/G1/G2/G3 independent | 13/13 positive blocked |
| risk relation | S/A cannot be accepted; B requires future authority | none accepted |
| status preservation | failed/blocked/infra/invalid retained | no report |
| blocker re-entry | owner fact only; fake/ping/time/retry insufficient | all open |

## 9. 回填草稿与 Step stop-review

Formal §12 应承载 record-kind boundary、S/A/B/C、生命周期、new-run retest、targeted/impacted/full matrix、G0~G3 放行和关闭证据。不得把当前未执行状态写成 defect count=0 或任何放行 verdict。

```text
step_status = completed_continuous_authorized
severity_contract = S/A/B/C
full_regression_denominator = 172_raw + 5_aggregate
mandatory_checks = 9
actual_defect_count = unknown_not_measured
actual_retest_or_release = none
next_step = Step 13
formal_06_write_allowed = false_until_step_15
```
