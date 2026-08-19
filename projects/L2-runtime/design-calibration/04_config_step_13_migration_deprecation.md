# L2-runtime 04 配置设计 Step 13：初始基线、迁移、废弃与演进

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`planned_v1 / no_current_migration / versioned_evolution / removal_gate`
> 回填位置：正式 `04-配置设计.md` 第 13 章

## 1. Step 开工确认与当前基线事实

| Question | Current answer |
|---|---|
| 是否存在已实现/发布的正式 Runtime config schema | 未发现；`L2R-IMPL-001` 保持 implementation absent |
| 是否存在可核验的用户/部署配置 inventory | 未发现；不伪造 consumer/install/use fact |
| 本次 schema 是什么 | `v1` planned initial baseline：12 roots、153 required exposed leaves、39 static-derived values、13 x 5 slots、7 x 6 jobs |
| 当前是否有迁移项 | `none`；没有真实 source/target instance、migration run 或兼容 consumer |
| 历史 README/旧 04/重开前 Step | `historical_material`/污染审计；其中 key/default/format/env/runtime statement 不构成 published contract |
| 当前兼容窗口 | none；v1 strict closed parser rejects unknown/historical aliases |

如果未来实现审计发现某个外部 consumer 已经使用了未登记配置，必须先记录其 owner、source、schema/version、使用范围和证据，再重开本 Step；不能因“可能有人在用”而现在建立虚假兼容承诺。

## 2. 配置值变更与 schema 演进的区分

| Change kind | Example | Process | Schema version impact |
|---|---|---|---|
| config instance change | v1 `context.max_weight` 从一个有效值改为另一个有效值 | Step 10 whole-document review/validate/cold replacement | remains v1 if semantics unchanged |
| owner/ref instance change | compatible v1 slot contract ref version replacement | Step 10 R4 owner review + full validation/current compatibility | remains v1 only if field semantics/parser unchanged |
| schema shape change | add/remove/rename/move key；required/nullability/type change | reopen 03/04/05/06/07; define new schema | new explicit schema version required |
| value vocabulary change | enum add/remove/rename；range semantics or units change | domain/architecture safety review + versioned parser/migration | new explicit schema version required |
| static semantic change | one of 39 derived values or job retry mapping changes | 03 code contract + 04 schema semantics reopen | new schema/policy versions required |
| owner/dependency topology change | slot added/removed/renamed、Sandbox/direct provider seam proposed | architecture/03/04 redesign | new version; may be rejected by owner boundary |
| source/lifecycle change | leaf env merge、config center、admin override、reload/hot/LKG | 03/04/09 lifecycle redesign | new version/source contract; not v1 extension |

## 3. V1 lock rules

The planned v1 contract is closed：

1. all 153 exposed leaves are required; nullable means explicit `null`, not omission；
2. exactly 12 roots, 13 slots and 7 jobs are admitted；
3. all unknown/duplicate/case/alias/static-derived keys reject；
4. external defaults do not exist；the parser cannot make a new field “optional with safe default” inside v1；
5. enum, units, typed-ref owner/kind semantics and cross-field relations are part of the schema contract；
6. 39 derived values are fingerprinted semantics even though not JSON leaves；
7. source selection、startup-only lifecycle、zero-secret boundary and Candidate/Bound-not-Ready rules are part of v1 behavior；
8. a validator may fix a defect that previously accepted invalid v1 input, but must document the defect, affected inventory and compatibility impact; it cannot silently relabel a deliberate old semantic。

Therefore any planned field addition, even conceptually optional, requires an explicit new schema version under the current strict all-required/closed-object design。

## 4. Change classification and required process

| Evolution change | Compatibility posture | Required design/process | Migration behavior |
|---|---|---|---|
| add root/leaf/slot/job | breaking for v1 closed parser | owner/classification + 03 carrier/Port impact + new version + all downstream updates | old/new schemas parsed separately; explicit mapping if meaningful |
| remove root/leaf/slot/job | breaking and potentially owner/feature removal | usage inventory + deprecation/removal gate + new version | no silent drop; removed value disposition explicit |
| rename/move path | breaking | exact old/new path pair + bounded version window + conflict rule | version-aware mapping to one canonical new target |
| required <-> nullable/optional | breaking semantic/shape change | new version + domain safety review | explicit missing/null mapping; no default guess |
| JSON type/wrapper/unit change | breaking | unit/range conversion proof + overflow/rounding rules + 03 typed review | deterministic conversion or manual rejection |
| enum add | authority/effect expansion possible | domain/architecture review + new version | no unknown-to-new automatic promotion |
| enum remove/rename | breaking | usage inventory + replacement semantics + new version | exact mapping only if semantics proven equivalent |
| range tighten | old valid instance may reject | inventory + compatibility window/owner action | candidate revalidation; no clamp |
| range loosen | safety/authority expansion | safety review + new version | no automatic expansion for captured operations |
| default introduction/change | forbidden in v1; behavior change | explicit new version and default provenance, or keep required | never silently fill old document |
| typed-ref owner/schema change | contract topology/compatibility change | formal owner decision + slot/policy/build review | incompatible ref remains Blocked; no ref text rewrite |
| derived invariant/retry mapping change | code/runtime semantic change | mandatory 03 backfill + new schema/policy version | migrate only with state/effect/replay proof |
| source/lifecycle change | architectural change | reopen 01/03/04 and future operations design | no v1 compatibility parser shortcut |

## 5. Migration and deprecation table

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| none: no current formal/published Runtime config baseline | planned v1 exact strict JSON | planned initial baseline | not applicable | implement v1 directly after future authorization; historical aliases reject | v1 implementation/test/acceptance later qualify use; no claim now |
| historical `RuntimePolicyProfileSet` / `policies` carrier | v1 nine fields inside `RuntimeProfile` mapped from nine policy roots | rejected historical material, not migration source | none | no parser alias; update any newly discovered consumer through reopened design | n/a; never admitted to v1 |
| historical `RuntimeLimitSet` / `limits` root | v1 domain-owned bounds inside context/memory/delegation/handoff/idempotency/jobs | rejected historical material | none | no generic limits parser; each bound stays with owner domain | n/a |
| historical `ToolAction` / `SandboxHandoff` / direct Sandbox slot | v1 `invocation_caller` only | forbidden topology/alias | none | reject alias; upstream Tools contract and isolation remain external | n/a |
| historical generic `HandoffPort` / `handoff` slot | v1 `handoff_submission` external seam + local repository not configurable | rejected alias | none | reject; no string/name rewrite | n/a |
| historical `blocked_until_contract` requirement value | v1 requirement + activation + blocker tuple | rejected alias/semantic conflation | none | reject; author must choose exact tuple under current design | n/a |
| historical `continuation_lease_required` / `max_resume_scan_items` / `external_emission` / `expiry_requires_domain_uniqueness` | v1 static invariants or owner-domain fields; no matching leaf | rejected duplicate/invariant keys | none | reject; do not translate because semantics are not one-to-one | n/a |
| historical generic `credential_ref` / provider/secret/route keys | no Runtime v1 field | forbidden owner/security material | none | reject entire document; owning adapter/security resolves externally | n/a |
| future explicit schema `vN` path/value | future `vN+1` path/value | template only; no current contract | named version/release window | separate parser + explicit migration result + new full validation | evidence-backed exit criteria below |

The table names historical pollution only so implementations reject it consistently. It does not grant those names deprecated-but-supported status。

## 6. Version-aware migration protocol

```text
[raw document]
      |
      v
[read exact profile.config_schema_version]
      |
      +---- unsupported/unknown -> reject
      |
      v
[select one exact closed schema parser]
      |
      v
[parse + validate source-version typed document]
      |
      v
[explicit version migration function, if formally designed]
      |
      v
[target-version V0~V12 full validation]
      |
      v
[new immutable target snapshot candidate + migration disposition]
```

关键说明：

- Current v1 implementation does not require a migration function because there is no prior formal version。
- A future parser must determine version without accepting arbitrary unknown fields; version discovery does not relax duplicate/secret/size/UTF-8 security checks。
- Source-version and target-version schemas remain separate; one permissive union parser is forbidden。
- Migration output is a new candidate, never in-place mutation of a historical snapshot or stored operation。
- Migration disposition/audit remains body-free and is not evidence、acceptance or deployment success。

## 7. Compatibility window constraints

| Constraint | Rule |
|---|---|
| explicit versions | every supported source/target version is named; no “legacy/auto/latest” selector |
| bounded window | window has formal start/end release/version conditions; never open-ended |
| source parser | old schema stays exact; no generic alias/case/coercion mode |
| both-present conflict | if a versioned transition permits old/new paths in one declared schema, both present rejects unless an exact, reviewed relation says otherwise |
| semantic mapping | only proven equivalent values auto-map; otherwise requires author/operator decision |
| sensitive refs | fingerprint/category only in audit; no resolve/log/rewrite raw secret/ref body |
| blocker truth | migration cannot remove blocker or turn Blocked into Candidate without formal owner input |
| captured operation | old operation/replay continues by recorded snapshot/version; never remapped to current config |
| fake isolation | migration tests may use TestFake in CI only; never qualify production |
| negative invariants | owner/scope/guard/fence/idempotency/Unknown/no-Ready/no-direct-Sandbox invariants cannot be relaxed by compatibility mode |

## 8. New field/domain/slot/job introduction gate

```text
identify semantic owner and user/runtime need
  -> prove behavior is configurable, not a static/owner invariant
  -> choose exactly one existing domain or justify a new domain
  -> define 03 typed carrier/Port/error/flow impact
  -> assign new schema/policy version
  -> define type/requiredness/no-default/source/sensitivity
  -> define domain + cross-domain + slot/job validation
  -> define startup/change/failure/migration semantics
  -> update strict JSON demos and exact inventory counts
  -> update 05 tests, 06 gates, 07 implementation and future 09 input
  -> pass Step 14 risk/03 closure before formal assembly
```

New `misc`、`common`、`runtime`、`provider`、`storage` generic buckets are forbidden. An adapter exposing a knob is not sufficient proof that Runtime owns the decision。

## 9. Deprecation and removal gate

### 9.1 Deprecation declaration must include

- exact source schema version/path/value and exact replacement；
- semantic reason and owner decision refs；
- compatibility window start/end；
- migration behavior and both-present/conflict rule；
- sensitive/redaction posture；
- affected profiles/slots/jobs/operations and blocker impact；
- 03/04/05/06/07/09 update list；
- body-free diagnostic code and inventory method；
- rollback limits and captured-operation treatment。

### 9.2 Removal requires all future facts

| Exit criterion | Required truth owner | Why required |
|---|---|---|
| formal removal decision and supported-version policy | schema/domain owner | prevents accidental delete |
| real consumer/config inventory shows no required old use | deployment/config owner | design assumption is insufficient |
| migration implementation and negative/compatibility tests pass | implementation/test owner | mapping must be executable |
| same-run eligible evidence and acceptance disposition | test/acceptance owner | document/static check is insufficient |
| rollback window/target decision closed | release/operations owner | prevents stranded deployment |
| examples/docs/ledgers/operations inputs updated | document owners | avoids stale contract |
| historical snapshot/replay/by-ref retention handled | Runtime persistence/operations owner | old work must not silently change policy |
| sensitive data/ref redaction scan passes | security/evidence owner | migration cannot create leak |

This design claims none of those future facts currently exist. Until all applicable criteria are real and qualified, deprecated input remains supported only within its explicitly designed window, or the removal remains blocked。

## 10. Evolution tests and downstream updates

| Evolution | 05 minimum input | 06 gate input | 07/implementation impact | 09/operations input |
|---|---|---|---|---|
| new schema version | both exact parsers、unknown version、migration success/failure、target full validation | version support/compatibility/evidence/veto | parser/migrator/snapshot/history boundaries | version inventory/rollout/rollback |
| rename/move | old-only/new-only/both/neither per declared schema | no ambiguity/data loss | exact mapping and issue codes | config inventory/author update |
| type/unit/range | min/max/overflow/rounding/non-equivalent cases | semantic correctness + no silent coercion | typed conversion/property tests | author/operator migration procedure |
| enum add/remove | authority/effect and unknown cases | no unauthorized expansion | enum/parser/domain tests | affected profile inventory |
| ref owner/schema | old/new owner compatibility、blocked/revoked | formal owner/evidence gate | adapter/builder contract tests | owner rollout/credential external |
| slot/job inventory | exact count/tuple/dependency/retry regression | dependency/side-effect veto | mandatory 03/04 public contract update | entry/job rollout/control |
| remove version/key | unsupported-old negative + historical replay/by-ref | exit criteria/evidence completeness | delete only after gate | final inventory + rollback closure |

## 11. Evolution stop review

| Check | Result | Notes |
|---|---|---|
| current published baseline/inventory | none found | no migration execution/readiness claim |
| planned v1 shape locked | pass | all leaves required; closed parser; no optional in-place extension |
| historical aliases | pass | explicit reject-only list; no compatibility status |
| value change vs schema change | pass | cold instance replacement separate from version evolution |
| add/rename/remove/type/enum/default | pass | explicit new version and process |
| compatibility window | pass | exact/bounded/versioned/no union parser |
| sensitive/blocker/fake invariants | pass | cannot relax through migration |
| captured operation/replay | pass | recorded snapshot/version preserved |
| introduction/removal gates | pass | owner/design/test/evidence/operations facts required |
| downstream handoff | pass | 05/06/07/09 update matrix complete |

## 12. 当前问题诊断、改动前后与取舍

| Dimension | Historical Step 13 | Rebuilt Step 13 |
|---|---|---|
| in-version add | allowed optional key with safe default | v1 all-required/closed; any key addition requires new version |
| historical names | mostly generic old-file rejection | exact rejected alias/invariant list; no deprecation support implied |
| migration parsing | version-aware dual-read wording | separate exact source parser -> explicit migration -> target V0~V12 |
| lifecycle | generic activation/rollback snapshot | startup-only/cold replacement + captured by-ref semantics |
| removal | broad evidence requirement | eight owner-qualified exit criteria and downstream matrix |

The stricter version rule increases migration ceremony but preserves deterministic closed-schema behavior and prevents a supposedly optional field from becoming an undocumented default/fallback channel。

## 13. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| current planned v1 has no legacy parser/migration Port | 否 | initial baseline fact | existing 03 config contracts sufficient | 无回写 |
| historical aliases rejected, not migrated | 否 | parser/schema policy | 04 only | 无回写 |
| future schema evolution protocol | 否（当前） | process template, not admitted code contract | future reopen before implementation | 无回写 |
| future carrier/Port/error/flow/derived invariant change | 是（future trigger only） | public code contract change | owning 03 Steps must be backfilled | 无当前回写；future admission blocked until done |

## 14. 回填草稿与下一门禁

正式 §13 写入：no-current-migration baseline -> value vs schema change -> v1 lock -> evolution table -> migration/deprecation table -> versioned protocol -> compatibility rules -> introduction/removal gates -> downstream updates。不得声称 published v1、consumer inventory、migration run/result、compatibility evidence or removal readiness。

```text
step_13 = done
gate_status = pass
gate_reason = planned_v1_locked_no_current_migration_and_versioned_evolution_closed
next_allowed_action = delete_and_rebuild_step_14_risks_open_questions
formal_04_write_allowed = false
step_14_write_allowed = true_after_flow_and_ledger_advance
commit_required = false
```
