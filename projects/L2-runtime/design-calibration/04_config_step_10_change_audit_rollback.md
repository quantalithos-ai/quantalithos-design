# L2-runtime 04 配置设计 Step 10：变更、审计与冷回退

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`whole_document_change / review / body_free_audit / restart_replacement / cold_rollback`
> 回填位置：正式 `04-配置设计.md` 第 10 章

## 1. Step 开工确认与 P0 变更模型

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 10；Step 1~9 已通过，Step 11 尚未开工 |
| 变更单位 | 一份完整 reviewed strict JSON document；不支持 leaf patch/merge/admin override |
| 生效方式 | 新进程独立执行 V0~V12 + builder；成功后由外部部署边界替换进程 |
| 回退方式 | 重新选择上一份仍有效、仍兼容的 reviewed document，重新校验并冷启动 |
| P0 不支持 | in-process reload/hot update、online pointer swap、online LKG、配置中心 push |
| truth owner | approval/review 归 Governance/组织流程；deploy/start/stop 归 deployment；Runtime 只定义所需输入和安全记录 |
| 禁止 | 把 review ref 当 approval body、把 startup log 当 deployment success、把 audit candidate 当 evidence/verdict |

## 2. SOP 问题回答

| 问题 | 本步结论 |
|---|---|
| 谁能发起 | product-neutral `configuration_author`、`release_operator`、`upstream_contract_delegate`、`test_fixture_author`；Runtime operation/model/tool/child/event 不能改全局配置 |
| 哪些需评审 | 所有运行配置变更均需可追踪 review；authority/effect、slot/job Candidate、ref/schema、retention/redaction/schema change 提升为 high/critical |
| 如何生效 | whole-document validate/build + process replacement；当前进程和 in-flight operation 永不改 snapshot |
| 如何审计 | 记录 change/review/actor safe refs、old/new fingerprint、changed canonical paths、risk、validation/build/deployment dispositions；不记录 raw value |
| 如何回退 | 以 prior reviewed document 作为新的 startup candidate；重新执行完整门禁，不保证它仍可激活 |
| 失败怎么办 | validation/build 失败不触碰旧进程；replacement/rollback 结果 Unknown 不记录成功，保持 blocked/manual |
| 是否选择系统 | 不选择 Git host、ticket、approval、deployment 或 audit backend 产品 |

## 3. Authority 与评审等级

| Actor category | 允许动作 | 不允许动作 | Required safe record |
|---|---|---|---|
| `configuration_author` | 提交完整 candidate document 与 change reason/ref | 直接激活、绕过 validator、声明批准 | actor/category、change ref、candidate fingerprint |
| `release_operator` | 选择已评审 document、执行 validation/start/replacement/rollback procedure | 修改 document value、覆盖 blocker、制造 readiness | operator ref、release attempt ref、selected fingerprint、disposition |
| `upstream_contract_delegate` | 对 contract/schema/blocker/ref compatibility 提供 owner decision ref | 提供 credential/body/route、替 Runtime 声明 adapter qualification | owner category、decision/ref fingerprint、schema category |
| `test_fixture_author` | 变更 CI/TestFake strict JSON 与 finite fake registry | 将 fixture/fake 用于其他 environment | fixture ref/fingerprint、test scope、review ref |
| Runtime process/operation | 只读取 immutable published snapshot | author/review/activate/rollback global config | no change authority |
| model/tool/child/event producer | 无配置 authority | 通过 output/event/request 改配置或关闭 blocker | rejection category only |

| Review class | 适用变化 | 最低门禁 | 失败/未确认 posture |
|---|---|---|---|
| R0 documentation-only | JSON 外说明文字且不改变 contract | normal document review；不触发 runtime activation | no runtime change |
| R1 restrictive | 收窄 authority/purpose/effect/budget；Disabled optional slot/job | config owner review + full validation + affected-flow analysis | not activated |
| R2 operational | context/memory/page/lease/freshness bound；retention extension；non-authority policy enum | config + module owner review；rollback target；cross-domain validation | not activated |
| R3 authority/effect | profile/scope expansion、delegation/recovery/action policy、Candidate activation、retention decrease | architecture/domain/safety review；owner refs；blocked-path analysis | reject/pending review |
| R4 contract/security/schema | contract/schema/redaction ref、blocker closure/removal、schema vocabulary/migration、fake boundary | formal owner + security/migration review；03 impact check | reject or explicit design change |
| Forbidden | raw secret/provider route/quota/cost、Ready/readiness、static invariant override、hot/reload/admin override | cannot be approved as ordinary config | `ForbiddenKey`/`SecretMaterialDetected` |

“收窄”不自动等于低风险：缩短 timeout/lease/retention、禁用正在承载 recovery/handoff 的 path 都可能制造 Unknown 或不可恢复记录，必须按实际关系提升等级。

## 4. 整体变更链图：reviewed document 冷替换

```text
[change request + complete candidate document]
                     |
                     v
          [risk classification + review]
                     |
        rejected ----+---- approved refs available
        |                         |
        v                         v
[body-free rejection]       [V0~V12 validation]
                                  |
                   invalid -------+------- valid
                   |                       |
                   v                       v
          [old process unchanged]    [builder compatibility]
                                             |
                             invalid/blocked-+-- replacement candidate
                             |                       |
                             v                       v
                    [old process unchanged]   [external process replacement]
                                                     |
                                    known failure ---+--- known success
                                    |                |          |
                                    v                v          v
                              [old remains]       [Unknown]  [new serves]
                                                     |
                                               manual/reconcile

Cold rollback = select prior reviewed document and run the same chain again.
```

关键说明：

- Validation 和 builder 在新进程候选中运行，不修改旧进程 snapshot、in-flight operation 或已提交 truth。
- 外部 process replacement 的结果不由 `RuntimeConfigSnapshot` 决定；本文不声明蓝绿、滚动、supervisor 或容器策略。
- Unknown 不可折算为 success 或自动重试；必须由部署/运行 owner 确认实际进程状态。
- 回退不是状态反转，而是一笔新的 change/release attempt；它不会改写新配置期间产生的 Runtime facts/effects。

## 5. 十二域变更规则

| CFG / surface | Typical risk | 发起/评审 | 生效前额外检查 | Body-free audit | Cold rollback |
|---|---|---|---|---|---|
| CFG-01 profile | R3；environment/entry changes exposure | author + architecture/entry owner | 4x4 matrix、source type、facade/authority impact、no readiness literal | old/new entry/environment enums + fingerprint | prior whole document; restart; no entry mix |
| CFG-02 scope | narrow R1；expand R3/possibly design change | author + domain/security | profile upper set、required internal authority、child/read static rules | changed authority names/counts; no actor body | prior document if still owner-compatible |
| CFG-03 context | R1/R2；unknown policy widening R3 | author + context owner | total/per-source/segments/freshness/omission relations；in-flight unchanged | range direction/category, not raw source/body | restart prior document; old decisions unchanged |
| CFG-04 working_memory | R2；capacity increase/trigger relation R2/R3 | author + memory owner | trigger < max；working-only；compaction backlog impact | changed path/range class | restart; no restoration/deletion of old windows |
| CFG-05 model_decision | R3/R4 | author + model semantic/contract owners | four-dimensional selection、semantic schema、two model slots、no provider truth | purpose/class/ref fingerprints, schema category | prior compatible refs; otherwise Blocked |
| CFG-06 action_guard | R3/R4 | author + safety/governance/tools owners | effect set cannot bypass five static guards/isolation/Unknown fence | effect enum delta + owner decision refs | prior document; never undo submitted effects |
| CFG-07 delegation | R2/R3 | author + runtime/entry owner | disabled-zero/enabled-positive、parent bounds、child slot/entry seam | enabled flag + bound direction + slot category | restart; child runs/results not cancelled/rewritten |
| CFG-08 checkpoint_recovery | R3/R4 | author + recovery/checkpoint owner | allowed mode change、CP blocker、stable checkpoint/fence behavior | mode delta + blocker category | prior modes; never relabel Prepared/Unknown as Committed |
| CFG-09 handoff_projection | R2/R4 | author + redaction/handoff/projection owners | page min relation、freshness、redaction ref、slot/job compatibility | redaction ref fingerprint + range/category | prior compatible ref; no delivery/observed reversal |
| CFG-10 idempotency | R2 extension；R3/R4 decrease/schema | author + consistency owner | committed>=reservation；external windows/uniqueness proof；digest schema migration | duration direction + schema category | prior document cannot resurrect deleted data/proof |
| CFG-11 adapter_slots | Disabled R1；Blocked R2；Candidate/ref/blocker R4 | author + canonical upstream owner + architecture | exact tuple、contract/schema pair、blocker truth、dependency direction、fake isolation | slot、activation、ref fingerprints、blocker ID/category | prior binding only if still allowed; otherwise explicit Blocked |
| CFG-12 jobs | Disabled R1；bounds R2；Candidate R3/R4 | author + operations/domain/slot owners | exact tuple、profile gate、lease/page/retry mapping、required seams/blockers | job、activation、bound direction、blocker category | restart prior document; active/old page report immutable |

## 6. Canonical diff 与风险计算

Change classification cannot compare raw JSON text. It must compare the fully validated canonical typed representations, excluding whitespace/key order and including static-derived semantic effects。

```text
old reviewed typed snapshot (or none for first release)
              +
new validated typed candidate
              |
              v
[canonical path/value-category diff]
              |
              v
[domain risk classifier + cross-domain impact expansion]
              |
              v
[required review classes / owner refs / rollback prerequisites]
```

Rules：

1. New document must independently validate before it can participate in semantic diff；invalid raw value is only a rejection, not a valid “new state”。
2. Changed paths use exact Step 7 canonical paths；array set changes report added/removed enum/ref fingerprints, never whole raw arrays。
3. Risk is the maximum of field risk, direction risk and affected cross-domain gate；例如 child slot Candidate plus delegation enabled is R4 even if each raw edit appears small。
4. Blocker removal/Blocked->Candidate requires a formal owner closure input; absence keeps change rejected or Blocked, never “best effort Candidate”。
5. First planned baseline has `old_snapshot=none`; this is initial activation, not migration/rollback proof。

## 7. Audit record requirements

本 Step 不新增 Runtime domain DTO。下表定义 release/configuration audit owner 必须保存或提供的 product-neutral information contract；实际 storage/schema/Port 需在实现/部署 owner 选定后设计。

| Field category | Required when | Meaning | Forbidden payload |
|---|---|---|---|
| `change_ref` | every runtime-affecting attempt | stable change identity | free-text body/secret |
| `actor_ref` + category | every attempt | author/operator/delegate/fixture actor | credential/personal body |
| `review_refs[]` | R1~R4；owner refs additionally R4 | refs to external review/owner truth | approval text、fabricated approval |
| `reason_ref` | R2~R4 and rollback | body-free rationale identity | raw reason body |
| `risk_class` | every attempt | computed maximum R1~R4/Forbidden | arbitrary downgrade |
| `source_class` | every attempt | normal selected document or CI fixture | raw locator/path/env value |
| `old_source_fingerprint` | replacement/rollback | prior reviewed source identity digest | raw old source |
| `new_source_fingerprint` | every candidate read | candidate source identity digest | raw new source |
| `old/new_content_fingerprint` | semantic diff/replacement | canonical typed content digest | complete config/full sensitive refs |
| `changed_paths[]` | old exists | canonical Step 7 paths | raw value/diff hunk |
| `changed_value_fingerprints[]` | sensitive/ref fields | per-path redacted old/new digest | full ref/endpoint/route |
| `affected_domains/slots/jobs[]` | semantic changes | bounded canonical names | arbitrary owner body |
| `validation_disposition` + issue codes | every attempt | accepted/rejected/safe issue set | raw parser/library message |
| `build_disposition` + blocker refs | valid candidate | Invalid/Blocked/Bound only | Ready/readiness |
| `release_attempt_ref` | process replacement/rollback | external attempt identity | fabricated run/deployment result |
| `replacement_disposition` | when owner reports | not_started/failed/unknown/succeeded | inferred success from health ping alone |
| `rollback_target_fingerprint/ref` | R2~R4 before replacement | prior reviewed candidate identity | raw prior document |
| `redaction_marker` | every audit output | confirms body-free transformation | none |

No actual `change_ref`、review ref、release attempt、run ID、artifact、report、evidence alias or disposition is claimed in this design. These are future field requirements, not populated records。

## 8. Change disposition lifecycle

```text
Draft
  -> ReviewPending
  -> ReviewRejected | ValidationPending
  -> ValidationRejected | BuildPending
  -> BuildInvalid | BuildBlocked | ReplacementPending
  -> ReplacementFailed | ReplacementUnknown | Replaced

Replaced
  -> RollbackRequested
  -> RollbackReviewPending
  -> RollbackValidationRejected | RollbackBuildBlocked | RollbackPending
  -> RollbackFailed | RollbackUnknown | RolledBack
```

These labels describe the configuration/release process vocabulary, not a new Runtime aggregate/state machine. `Replaced`/`RolledBack` require external deployment-owner facts; validator/build success alone stops at `ReplacementPending`。`BuildBlocked` must retain blocker refs and cannot transition through config alone。

## 9. Cold rollback rules

| Situation | Rollback candidate | Required checks | Result boundary |
|---|---|---|---|
| new document validation/build rejects before replacement | none needed | record rejection safely | old process remains; no rollback claim |
| replacement known failed and old process known serving | prior process/document | confirm old owner fact; do not infer from absence | record failed replacement, not RolledBack |
| replacement succeeded but behavior unacceptable | prior reviewed whole document | full V0~V12, current upstream refs/blockers, builder compatibility, deployment review | new cold replacement attempt |
| prior contract/ref revoked/incompatible | prior document is not eligible | owner decision/ref validation | remain Blocked or prepare corrected document |
| prior schema/parser no longer supported | prior document not directly eligible | compatible implementation/schema pair and migration plan | no silent alias/downgrade |
| replacement/rollback outcome Unknown | no automatic next attempt | deployment status/reconcile/manual review | preserve Unknown; no traffic/readiness assertion |
| current/old operations still in flight | each retains captured snapshot | by-ref snapshot availability and effect fences | never mutate/reforge old operation policy |

Rollback never：

- reverses Governance decisions、Tool execution/receipt、model/child owner results、checkpoint physical state、handoff ACK、Bus delivery or observation truth；
- rewrites Runtime facts、stored results、event receipts、job page reports、outbox snapshots or idempotency records；
- restores deleted durable data、expired uniqueness proof or invalid owner credentials；
- uses raw secret/provider route/fake fallback to make prior config work；
- bypasses the current schema, safety, blocker or review gate because the target was once valid。

## 10. Sensitive/ref changes

| Change | Additional gate | Audit form | Failure posture |
|---|---|---|---|
| capability/schema/contract ref | owner/kind/version + dependent slot/policy compatibility | old/new fingerprint + category/version | reject/Blocked |
| redaction policy ref | redaction owner review + body-free material compatibility | ref fingerprint/version + affected paths | external emission/material blocked |
| blocker ref add/change/remove | formal blocker truth; removal requires owner closure input | safe blocker ID/category + decision ref | preserve Blocked if uncertain |
| source locator | selector owner/deployment controls; content independently validated | source fingerprint only | SourceUnavailable; no path output |
| external credential rotation without Runtime ref change | not a Runtime config change | optional adapter-owner status category only | adapter Unavailable/Unknown; no raw fallback |
| raw secret/provider setting attempt | never approvable | field path + secret/forbidden issue code | reject entire document |

## 11. Per-change stop review

| Change group | Authority | Review/risk | Audit | Cold rollback | Result |
|---|---|---|---|---|---|
| profile/scope | closed | R1/R3/R4 | enum/path/digest | whole document | pass |
| context/memory bounds | closed | direction-sensitive R1/R2/R3 | range direction only | restart | pass |
| model/action/delegation/recovery | closed | R3/R4 + owner refs | safe enums/ref digests | restart; no truth reversal | pass |
| handoff/redaction | closed | R2/R4 | redaction/ref digest | only compatible prior | pass |
| idempotency retention/schema | closed | R2/R3/R4 | direction/schema category | cannot resurrect proof | pass |
| slots | closed | R1~R4 by posture/change | slot/ref/blocker safe fields | Blocked if incompatible | pass |
| jobs | closed | R1~R4 by activation/bounds | job/category/direction | no report rewrite | pass |
| TestFake fixture | test author only | R1/R4 isolation | fixture fingerprint | CI rerun only | pass |
| forbidden secret/reload/invariant | no authority | Forbidden | rejection issue only | not applicable | pass |

## 12. 跨变更审计 / 回滚审计

| Audit | Result | Notes |
|---|---|---|
| every runtime change is whole-document | pass | no leaf patch/merge/online override |
| every change has actor/review/risk | pass | product-neutral refs; no specific system assumption |
| every domain maps activation/audit/rollback | pass | exact CFG-01~12 table |
| high-risk changes require owner inputs | pass | slot/ref/blocker/schema/redaction/authority covered |
| audit body-free | pass | raw config/value/path/full ref/secret excluded |
| validation/build vs deployment truth | pass | distinct dispositions and owners |
| old process/in-flight isolation | pass | no P0 snapshot mutation |
| rollback current compatibility | pass | prior validity never bypasses current gate |
| committed truth immutability | pass | config rollback cannot reverse Runtime/external facts |
| Unknown preservation | pass | no automatic success/retry/readiness |
| no fabricated record | pass | only future field requirements, no populated IDs/results |

## 13. 当前问题诊断、改动前后与取舍

| Dimension | Historical Step 10 | Rebuilt Step 10 |
|---|---|---|
| activation | candidate snapshot N+1/republication | whole-document validation + external process replacement |
| rollback | republish N / next-operation pointer | revalidate prior document and cold-start replacement |
| state | implied in-process change state machine | process vocabulary only; no Runtime aggregate/API |
| audit carrier | invented `ConfigChangeAuditRecord` shape | product-neutral required information; owner/storage deferred |
| domains | stale carrier/field group references | exact CFG-01~12 and current slot/job semantics |
| operation behavior | in-flight N vs new N+1 | process snapshot immutable; persisted work uses recorded ref |

P0 cold replacement sacrifices zero-downtime config mutation but keeps code contracts honest: there is no reload Port、adapter swap transaction or rollback state in formal `03`。Any future online change requires reopening `03/04` before implementation。

## 14. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| whole-document change + cold process replacement | 否 | deployment/config lifecycle; no Runtime API | 不适用 | 无回写 |
| canonical typed diff/risk/review requirements | 否 | configuration governance semantics | 04 专属 | 无回写 |
| body-free audit information requirements | 否 | future release/audit owner contract, not Runtime domain DTO | 03 §14 redaction already compatible | 无回写 |
| old operation keeps captured snapshot | 否 | existing snapshot-ref semantics | 03 §6/§13 | 无回写 |
| cold rollback does not reverse facts/effects | 否 | existing immutable truth/effect fences | 03 §8~§12 | 无回写 |
| future hot/reload/online LKG/adapter swap | 是（future trigger only） | would require Port/state/error/flow/transaction changes | reopen 03 before admission | 无当前回写；禁止进入 P0 |

## 15. 回填草稿与下一门禁

正式 §10 写入：P0 whole-document model -> actor/review classes -> cold replacement ASCII -> 12-domain change table -> canonical diff -> audit requirements -> lifecycle vocabulary -> cold rollback -> sensitive changes。不得写 `Ready` builder result、in-process N+1 publication、具体工单/部署/backend 或实际 change/release/evidence record。

```text
step_10 = done
gate_status = pass
gate_reason = whole_document_change_body_free_audit_and_cold_rollback_closed
next_allowed_action = delete_and_rebuild_step_11_failure_degradation
formal_04_write_allowed = false
step_11_write_allowed = true_after_flow_and_ledger_advance
commit_required = false
```
