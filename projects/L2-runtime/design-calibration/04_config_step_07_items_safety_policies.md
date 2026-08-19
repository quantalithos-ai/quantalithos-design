# L2-runtime Step 7 Annex B：CFG-06~10 Safety and Continuation Items

> 创建日期：2026-08-17
> 状态：`done`
> 共同来源：one selected strict JSON
> 共同生效：startup typed snapshot
> 共同边界：配置只选择有界 policy，不创建 approval/execution/commit/delivery/observed truth

## 1. CFG-06 `action_guard`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `action_guard.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.action_guard` |
| `action_guard.allowed_effect_classes` | unique nonempty subset `none/read_only_external/reversible_external/irreversible_external/unknown_external` | none | 是 | action proposal/guard | internal | empty/unknown/duplicate | `ActionGuardProfile.allowed_effect_classes` |
| `action_guard.checked_view_freshness.max_age_seconds` | positive `u64` seconds | none | 是 | each guard evaluation | internal | zero/fraction/overflow | `checked_view_freshness.max_age` |

Static-derived：

- `required_guard_kinds` exact five: `Governance/CapabilityExposure/ToolContract/IsolationRequirement/SourceFreshness`。
- `isolation_policy=RequiredForExternalSideEffect`。
- `unknown_policy=BlockAndFence`。
- checked-view `unknown_disposition=Reject`。

Cross rules：

- `allowed_effect_classes` 只是候选上限，不产生 `Allowed`。
- `reversible_external/irreversible_external/unknown_external` 出现时，governance/capability/invocation and required isolation facts still must be current; open `L2R-UP-001/003/007` keeps the path Blocked/Unknown。
- `unknown_external` means the candidate's effect class is conservatively unknown; it never authorizes unknown-effect retry。
- No JSON key may remove a guard, select local approval, disable isolation, or map unknown to allow/retry。

## 2. CFG-07 `delegation`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `delegation.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.delegation` |
| `delegation.enabled` | boolean | none | 是 | delegation capability/startup | internal | wrong type/dependency conflict | `DelegationProfile.enabled` |
| `delegation.max_depth` | nonnegative `u32` | none | 是 | child derivation | internal | overflow/condition mismatch/parent expansion | `max_depth` |
| `delegation.max_child_turns` | nonnegative `u32` | none | 是 | child run budget | internal | overflow/condition mismatch/parent expansion | `max_child_turns` |
| `delegation.max_child_actions` | nonnegative `u32` | none | 是 | child action budget | internal | overflow/condition mismatch/parent expansion | `max_child_actions` |
| `delegation.max_child_context_weight` | nonnegative `u64` | none | 是 | child context budget | internal | overflow/condition mismatch/>context max | `max_child_context_weight` |
| `delegation.max_child_duration_seconds` | nonnegative `u64` seconds | none | 是 | child deadline upper bound | internal | overflow/condition mismatch | `max_child_duration` |

Cross rules：

- `enabled=false` iff all five limit fields are exactly `0`; `child_runtime` may be Disabled or Blocked, never required Candidate。
- `enabled=true` requires all five limits `>0`, `max_depth` strictly decreases for each child, context <= parent/context profile and no child scope/budget expansion。
- `enabled=true` requires `adapter_slots.child_runtime.activation` not Disabled. Blocked is a valid configuration but keeps delegation path Blocked; Candidate additionally requires contract/schema refs。
- Duration is an orchestration deadline bound, not member-service/container lifetime。

## 3. CFG-08 `checkpoint_recovery`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `checkpoint_recovery.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.checkpoint_recovery` |
| `checkpoint_recovery.allowed_recovery_modes` | unique nonempty subset `resume/restart_from_stable/reconcile_only/cancel/manual_review` | none | 是 | recovery decision | internal | empty/unknown/duplicate/dependency conflict | `allowed_recovery_modes` |

Static-derived：`stable_source_requirement=CommittedCheckpointAndClosedFence`；`unknown_posture=ManualReviewOrReconcile`。

Cross rules：

- `resume` or `restart_from_stable` in the allow-list does not itself permit a recovery decision. Each actual decision still requires committed matching checkpoint, current expected versions and closed effect fence。
- If `checkpoint_commit` is Disabled/Blocked or carries `L2R-CP-001`, positive qualification of resume/restart remains Blocked; configuration may still preserve modes for future compatibility but builder/report must surface the blocker。
- `reconcile_only/manual_review` do not authorize a second external call。
- Lease requirement, matching receipt, fence closure and J04 page bound are static/job controls, not fields in this domain。

## 4. CFG-09 `handoff_projection`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `handoff_projection.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.handoff_projection` |
| `handoff_projection.projection_page_limit` | positive `u32` | none | 是 | query/J01 page upper bound | internal | zero/fraction/overflow/request expansion | `projection_page_limit` |
| `handoff_projection.view_freshness.max_age_seconds` | positive `u64` seconds | none | 是 | safe view labeling | internal | zero/fraction/overflow | `view_freshness.max_age` |
| `handoff_projection.redaction_policy_ref` | opaque typed ref string | none | 是 | material/view redaction | sensitive | malformed/owner-kind/version invalid | `redaction_policy_ref` |

Static-derived：`handoff_eligibility=LocalOutcomeAndBodyFreeMaterial`；view freshness `unknown_disposition=ReturnExplicitDegraded`。

Cross rules：

- Page limit controls local projection reading only; it is not J01 `jobs.*.page_limit`, and the actual page must satisfy both bounds using the smaller value。
- Freshness changes the returned `Current/Stale/Degraded/Unknown` label; it cannot mutate projection/domain truth。
- Redaction ref is not a policy body or secret. A missing/incompatible owner ref fails startup or blocks material exposure。
- External emission is controlled only by `handoff_submission`/`event_publisher` slots and relevant job activation; no `external_emission` leaf exists。

## 5. CFG-10 `idempotency`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `idempotency.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.idempotency` |
| `idempotency.reservation_retention_seconds` | positive `u64` seconds | none | 是 | operation reservation cleanup | internal | zero/fraction/overflow/lower-bound conflict | `reservation_retention` |
| `idempotency.committed_result_retention_seconds` | positive `u64` seconds | none | 是 | replay result cleanup | internal | zero/fraction/overflow/replay conflict | `committed_result_retention` |
| `idempotency.event_inbox_retention_seconds` | positive `u64` seconds | none | 是 | inbox receipt cleanup | internal | zero/fraction/overflow/redelivery conflict | `event_inbox_retention` |
| `idempotency.job_state_retention_seconds` | positive `u64` seconds | none | 是 | job state/report cleanup | internal | zero/fraction/overflow/replay conflict | `job_state_retention` |
| `idempotency.digest_schema_version` | string schema version | none | 是 | canonical digest/replay | internal | unsupported/mismatch | `digest_schema_version` |

Static invariant：cleanup may remove eligible operational payloads/records only under the selected physical retention policy; it must never erase permanent uniqueness/domain proof or allow the same identity with a new digest。

Cross rules：

- `committed_result_retention >= reservation_retention` unless the implementation contract proves replay identity remains safely available elsewhere; P0 requires this direct relation。
- `event_inbox_retention` must cover the formally selected maximum redelivery/dedupe window. Because no Bus window is closed, production/integration positive qualification remains pending even when a numeric value parses。
- `job_state_retention` must cover job replay/report window. Because no scheduler/operations window is selected, production qualification remains pending。
- No field asserts `exactly_once` or `expiry_requires_domain_uniqueness`; those are non-configurable invariants。

## 6. Safety policy cross-domain gate

| Check | Result |
|---|---|
| 22 exposed leaves have type/default/required/scope/sensitivity/failure/target | pass |
| nine static safety fields/invariants are not exposed | pass |
| no lease/scan/emission/uniqueness duplicate fields | pass |
| delegation disabled/enabled tuple is deterministic | pass |
| recovery/handoff configuration cannot manufacture external fact | pass |
| retention values have no fabricated default or production qualification | pass |
| no new 03 carrier required | pass |

```text
annex_B = done
next_step_07_module = adapter_slot_and_job_items
```
