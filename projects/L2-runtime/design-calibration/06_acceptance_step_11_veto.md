# L2-runtime 06 验收标准 Step 11：一票否决

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填位置：正式 `06-验收标准.md` §11
> 状态：`completed_continuous_authorized`
> 输入：formal 00 §14.4 VF-L2R-001~008、formal 03 ownership/state/security contracts、formal 05 VF/defect/evidence registry、Step 6/9/10
> 事实边界：本 Step 只定义 future veto decision contract；当前没有 actual trigger、artifact、report、EV disposition、defect、verdict 或 signoff

## 1. VETO 总合同

`VF-L2R-001~008` 是唯一一票否决主语。每个 VETO 必须同时绑定正式需求红线、设计契约、canonical TC/EV/check、固定 report 路径和触发后的结论。VETO 不是普通风险，也不是可由时间、排期、fake、blocked、planned、ACK、receipt 或人工口头确认覆盖的事项。

```text
veto_triggered(VF) :=
  one eligible fixed-run artifact/report/check proves the exact forbidden condition
  OR source/dependency/status/evidence audit proves the condition
  AND the finding is tied to the current formal source and canonical identity

veto_not_evaluable(VF) :=
  required evidence/check/source is absent, invalid, cross-run, filtered, or blocked
```

`triggered` 必须使总体结论为 `不通过`，并创建 S 级缺陷/安全或架构停止。`not_evaluable` 不是 `not_triggered`，不能支持 `通过` 或 `有条件通过`。VETO 触发不得风险接受；只有修复、影响回归、新 fixed run 和完整证据才能关闭。

## 2. VETO 裁决流

**图类型：** veto decision flow
**图标题：** 红线触发、停止与复验边界

```text
[VF formal redline]
          |
          v
[canonical case/check + same-run raw/report]
          |
   +------+------+
   |             |
triggered   not_evaluable
   |             |
   v             v
S defect +     no verdict;
stop lane      evidence/blocker remediation
   |             |
   +-------> new fixed run <-------+
                    |
              reviewed not_triggered
                    |
              may enter future 06
```

关键说明：

1. `not_triggered` 只表示当前固定证据没有证明红线触发，不代表产品总体通过。
2. blocked positive seam 可以使对应 VETO `not_evaluable`，但不能被改写为 `not_triggered`；G1 local denominator 不缩减。
3. VETO 检查失败、report/evidence 工具可能隐藏失败、静态映射冒充 evidence，也按 S 处理。

## 3. VF-L2R-001~004：所有权、fail-closed、材料与 unknown

| VETO | 正式红线 / 禁止事实 | 可执行触发条件 | 必须存在的通过证据 | 触发后裁决 | 固定 source / TC -> EV / report |
|---|---|---|---|---|---|
| VF-L2R-001 | Runtime 自建或反写 Tools、Hub、Method、Governance、Sandbox、Observability、Artifact、provider 或 durable owner truth | write graph/Port/repository/spy 显示 owner mutation；body/index/policy/approval/registry/route/cleanup 被本地持有 | source/dependency graph、owner spy unchanged、write journal、`TC-BOUND-001/006`、`TC-SEC-003` | 立即 S；停止受影响 lane 与 release-design；不可风险接受 | `EV-STATIC-438`,`EV-STATIC-443`,`EV-STATIC-696`; `reports/runs/<run_id>/suites/security_source_boundary.md`; `reports/acceptance/veto-checklist.md` |
| VF-L2R-002 | governed/capability/sandbox-required action 在前置缺失/denied/stale/unknown 时 default allow、host fallback 或 direct Sandbox | required view 不全仍调用；legacy host/direct path；Candidate/Bound/fake/ping 当 Ready | guard call journal、zero invocation、typed Blocked/Unknown、`TC-C09-001`,`TC-CAP07-001/002`,`TC-BOUND-004/008` | 立即 S；所有 action/recovery gate blocked；不可风险接受 | `EV-SVC-459`,`EV-SVC-408`,`EV-FAULT-409`,`EV-FAULT-441`,`EV-STATIC-445`; service/security reports |
| VF-L2R-003 | secret/token/raw provider/tool/Sandbox/Artifact/Evidence body、capture、hidden reasoning 进入任何 truth/carrier | canary 出现在 config/object/history/checkpoint/outbox/event/view/log/report/handoff；redaction failure被继续发送 | pre-serialization redaction scan、forbidden-material scan、`TC-CFG09-001`,`TC-OBS-002`,`TC-SEC-001/002`,`TC-BOUND-003/005` | 立即 S security stop；隔离相关输出/证据；不可风险接受 | `EV-STATIC-679`,`EV-STATIC-692`,`EV-STATIC-694/695`,`EV-STATIC-440/442`; security/config reports |
| VF-L2R-004 | commit unknown / side-effect unknown 自动重试、重复执行或宣告成功 | Unknown 变成 success；新 identity 重投；Prepared resume；ACK/timeout 触发 blind retry | UoW/phase/call journals、same identity fence、status-only reconcile、`TC-UOW-002~005`,`TC-REPLAY-001~006`,`TC-ERR-003` | 立即 S consistency stop；保留 fence/first failure；不可风险接受 | `EV-FAULT-642~645`,`EV-FAULT-648~653`,`EV-FAULT-663`; fault report |

## 4. VF-L2R-005~008：phase、status、依赖和 source truth

| VETO | 正式红线 / 禁止事实 | 可执行触发条件 | 必须存在的通过证据 | 触发后裁决 | 固定 source / TC -> EV / report |
|---|---|---|---|---|---|
| VF-L2R-005 | delivery/Observed/receipt/downstream acceptance 被写成本地 outcome/checkpoint/run truth | ACK/receipt/report/Observed 改 terminal outcome、checkpoint 或 run；gap 自行关闭；projection 修 domain | immutable version/CAS journal、matching gap identity、`TC-BOUND-007`,`TC-OBS-003`,`TC-TRUTH-001`,`TC-O04/05-001`,`TC-E06-001` | 立即 S truth stop；handoff/projection lane blocked；不可风险接受 | `EV-FAULT-444`,`EV-FAULT-693`,`EV-STATIC-697`,`EV-CON-534/535`,`EV-ENTRY-526`; security/contract reports |
| VF-L2R-006 | fake/planned/blocked/not_run/pending 被伪装为 positive integration、evidence、readiness 或验收通过 | status mapper/status report/evidence index 将非绿色 posture 变成 pass/derived/ready；fake leak；blocked slot关闭 | status corpus、fake-profile check、no-static-evidence、`TC-TRUTH-001`,`TC-BOUND-008`,`TC-CFG15-001`,`TC-ENTRY-004` | 立即 S evidence stop；所有相关 acceptance package invalid；不可风险接受 | `EV-STATIC-697`,`EV-STATIC-445`,`EV-STATIC-685`,`EV-STATIC-436`; security/config reports |
| VF-L2R-007 | 非 Core sibling 被加入 package 依赖，或 event/runtime/ref/adapter/fake seam 被伪装成 compile dependency | manifest/source graph 导入 sibling/provider/Sandbox/member/Obs backend；shared type shadow authority | dependency graph + source manifest + `TC-DEP-001`,`TC-CFG10-001` | 立即 S architecture stop；重建依赖边界；不可风险接受 | `EV-STATIC-437`,`EV-CFG-680`; security/config reports |
| VF-L2R-008 | 状态、来源、字段、错误、测试或实施边界无法回指正式需求/owner | unknown/legacy alias、旧 state/TC/EV、孤儿 registry row、unresolved source 被接受 | source manifest、denominator check、`TC-SOURCE-001`,`TC-ERR-007`,`TC-CAP01-001`,`TC-ENTRY-001` | 立即 S source stop；当前结论不可形成；不可风险接受 | `EV-STATIC-698`,`EV-STATIC-667`,`EV-UNIT-401`,`EV-ENTRY-433`; contract/security reports |

## 5. VETO 检查与证据规则

| 检查层 | 必须审查 | 失败分类 | 结论上限 |
|---|---|---|---|
| static/source | current formal source、manifest、dependency graph、historical alias rejection | `ineligible_invalid` 或 S | `not_evaluable`/不通过 |
| case/journal | exact variant、write/call/state/phase/fence journal | `ineligible_failed` | VETO `triggered` -> 不通过 |
| suite/check | owning suite count、status、9 mandatory checks、redaction/cleanup | `ineligible_invalid/infra_error` | 不得宣告 `not_triggered` |
| report/index | same-run pair、digest、orphan/duplicate/static、failure retention | S tooling defect if concealment possible | acceptance package invalid |
| review/handoff | veto checklist 每项有 concrete ref 或 missing/blocking | `not_evaluable` | 不得进入通过/有条件通过 |

固定证据路径：

```text
artifacts/test/<run_id>/suites/<suite>/cases/<case_id>.json
artifacts/test/<run_id>/checks/<check_id>.json
reports/runs/<run_id>/suites/<suite>.md
reports/runs/<run_id>/evidence/<evidence_id>.md
reports/acceptance/veto-checklist.md
```

禁止 `latest`、跨 run 拼接、手写静态 EV、把设计/目录/ping/fake 当证据，或在 `reports/acceptance/*` 中覆盖 machine status。

## 6. VETO 与缺陷、风险和最终结论交互

| 状态 | 允许动作 | 禁止动作 |
|---|---|---|
| `triggered` | 创建 S defect；停止 gate；保留 first run；修复后新 run + targeted/impacted/full regression | 风险接受、降为 B/C、删 artifact、best-of-run 合并 |
| `not_evaluable` | 补齐 owner/source/implementation/evidence/blocker；保持当前 gate 未决 | 写成 `not_triggered`、缩小分母、条件通过 |
| `not_triggered` | 在同一 valid fixed run 中供未来 06 继续审查 | 推导其它 VETO/AC 自动通过 |
| `blocked_dependency` | 显示 blocker、影响 lane 和 re-entry 条件 | fake/Candidate/Bound/ACK/ping 关闭 blocker |

VETO 触发与 S/A P0 缺陷均阻断当前验收退出。未来正式 06 只有在每个 applicable VETO 有 `not_triggered` 或明确 `not_evaluable` 的授权裁决、且无触发项时，才可讨论三值总体结论；当前没有任何实际裁决。

## 7. VETO 停审与跨覆盖审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| VETO denominator | 8/8 formal VF rows；无旧 alias | none |
| redline source | each row maps to formal 00 and design/test source | actual evidence absent |
| detection coverage | owner/no-write、fail-open、forbidden material、unknown、phase、status、dependency、source all covered | none |
| TC/EV coverage | each VETO has canonical case/check and planned EV references | planned only; no instance |
| fixed paths | raw/check/suite/EV/veto checklist paths exact | paths planned only |
| risk interaction | all 8 are S and cannot be risk accepted | none |
| evidence interaction | missing/invalid evidence -> not_evaluable, never not_triggered | no actual package |
| cross-VETO overlap | shared cases are allowed as detection sources; no VETO identity is inferred from prefix | none |
| positive lane | 13 slots and UP/CP/ENTRY/IMPL/LANG blockers remain explicit | no readiness claim |

## 8. 回填草稿与 Step stop-review

Formal §11 应承载 VETO 总合同、VF001~008 表、检查/证据规则、触发后的 S stop、风险禁止覆盖及跨 VETO 审计。正文只写裁决规则，不写当前“全部未触发”；当前实际状态仍 `none/not_entered`。

```text
step_status = completed_continuous_authorized
veto_denominator = 8/8
veto_severity = S_8_of_8
actual_veto_trigger = none_not_measured
actual_veto_evidence = none
risk_acceptance_of_veto = prohibited
current_process_state = not_entered
next_step = Step 12
formal_06_write_allowed = false_until_step_15
```
