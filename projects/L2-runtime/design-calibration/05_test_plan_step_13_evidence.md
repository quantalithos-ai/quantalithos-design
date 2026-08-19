# L2-runtime 05 测试方案 Step 13：测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填位置：正式 `05-测试方案.md` §13
> 输入：Step 5 traceability、Step 6 canonical TC/EV、Step 9 automation、Step 11 retest、Step 12 entry/exit
> Canonical registry annex：`05_test_plan_step_13_evidence_registry.md`
> 状态：`completed_continuous_authorized`
> 事实边界：只定义 future writer/reader contract；没有真实 `run_id`、artifact、report、EV instance/alias、review、verdict、signoff 或 readiness

## 1. 规则来源、成熟度与身份

规则来源是 `子项目目录与代码文件组织规范.md` §§9~10、`测试方案书写规范.md` §§4.6/5.13、`设计文档讨论中间产物规范.md` §5.9 和 `设计真相源闭环与可落码性标准.md` §7。证据必须按下列成熟度单向推进：

```text
M0 planned identity
  -> M1 raw machine artifact
  -> M2 run-scoped human report
  -> M3 derived EV detail + evidence index
  -> M4 acceptance draft
  -> M5 human/Agent review input for future 06
```

| Maturity | Meaning | Current state | Forbidden promotion |
|---|---|---|---|
| M0 | Step 6 reserves one EV ID for each canonical TC | 177/177 `planned_not_generated` | ID/table -> evidence |
| M1 | runner/check emits valid fixed-run raw artifacts | none | process exit/static JSON -> pass |
| M2 | report script renders raw truth without rewriting status | none | handwritten summary -> raw replacement |
| M3 | generator derives each EV item from case artifact + suite report pair | none | missing pair/cross-run -> eligible |
| M4 | acceptance documents are generated as drafts from one M3 run | none | draft -> verdict/signoff |
| M5 | human/Agent may add review notes without mutating raw status | none | review -> owner truth/readiness |

Evidence instance identity is `(run_id, evidence_id, case_id, owning_suite, case_artifact_digest, suite_report_digest)`. It is not an alias. The 177 IDs are exactly the Step 6 set: 35 UNIT、36 CON、25 SVC、32 FAULT、9 ENTRY、7 JOB、12 CFG、16 STATIC and 5 E2E. No second `EV-CAND-*` namespace is created.

## 2. Artifact/report ownership and fixed paths

| Material | Fixed path | Writer | Reader | Human edit |
|---|---|---|---|---|
| raw run context/selector/blockers | `artifacts/test/<run_id>/meta/*.json` | gate orchestrator | checks/report generators/reviewer | prohibited |
| raw check | `artifacts/test/<run_id>/checks/<check_id>.json` | `scripts/checks/*` | gate/report generator | prohibited |
| raw suite/case/journal/log | `artifacts/test/<run_id>/suites/<suite>/...` | suite runner/gate | checks/report generator | prohibited |
| raw evidence index | `artifacts/test/<run_id>/evidence-index.json` | evidence generator after checks | report generator/reviewer/06 | prohibited |
| run reports | `reports/runs/<run_id>/...` | `scripts/reports/*` | test/review/future 06 | notes allowed only in separate review files |
| acceptance drafts | `reports/acceptance/*.md` | report script initial draft | human/Agent/future 06 | review additions allowed; raw result immutable |
| review notes | `reports/review/*.md` | human/Agent | future 06 | allowed; cannot change raw/EV status |

`<run_id>` is caller-assigned by a real future runner, nonempty and not `latest`. Paths are repository-relative and normalized; absolute paths、`..`、symlink escape and `artifacts/test/<project>/<run_id>` are invalid.

## 3. Planned directory contract

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/source-manifest.json
  meta/case-manifest.json
  meta/selector.json
  meta/blockers.json
  checks/<check_id>.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<case_id>.json
  suites/<suite>/journals/<case_id>-<journal_kind>.json
  gate-summary.json
  evidence-index.json

reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-results.md
    evidence-index.md
    redaction-check.md
    blockers.md
    suites/<suite>.md
    evidence/<evidence_id>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

All paths above are `planned_not_created`. Logs are redacted UTF-8 bytes; their digest and byte length are stored in suite report JSON rather than embedded in the log.

## 4. Shared machine schema rules

All JSON DTOs are implementation-local test evidence DTOs. They do not enter Runtime public/domain contracts and cannot become business truth.

### 4.1 Common scalar and enum vocabulary

| Name | Exact type/value rule |
|---|---|
| `schema_version` | exact string `l2-runtime.test-artifact.v1` |
| `run_id` | nonempty opaque string, max 160 bytes, allowed `[A-Za-z0-9._-]`, not `latest` |
| `case_id/evidence_id/suite_id/check_id` | exact canonical registry string; unknown identity invalid |
| `SafeToken` | 1~256 ASCII bytes, allowed `[A-Za-z0-9._:/@+-]`; no whitespace/newline/NUL |
| `SafeRef` | 1~512 UTF-8 bytes; no newline/NUL/control char; parser rejects, never truncates |
| `RelativeArtifactPath` | 1~1024 UTF-8 bytes, normalized relative path under same run root; no absolute/`.`/`..`/symlink escape/control char |
| `ArtifactDigest` | `sha256:<64 lowercase hex>` |
| `SemanticDigestRef` | 1~256 ASCII bytes, allowed `[A-Za-z0-9:._-]`; opaque Runtime/config/domain digest, not rehashed or parsed by evidence DTO |
| `ArtifactStatus` | `passed`,`failed`,`blocked_dependency`,`not_evaluated`,`infra_error`,`invalid_execution`,`invalid_artifact`,`cancelled` |
| `AssertionStatus` | `passed`,`failed`,`not_evaluated` |
| `RedactionStatus` | `clean`,`failed`,`not_evaluated` |
| `DerivationStatus` | `derived`,`ineligible_failed`,`ineligible_blocked`,`ineligible_infra_error`,`ineligible_invalid` |
| `ReviewStatus` | `not_started`,`pending`,`reviewed`,`disputed` |
| `WorkspaceStatus` | `clean`,`dirty`,`unknown`；never implies revision immutability |
| timestamp | RFC 3339 UTC string; wall time is metadata, never identity/oracle input |
| duration/count | nonnegative JSON integer; finite and unit named in field |

Unknown enum values and duplicate JSON object keys cause `invalid_artifact`. Required arrays may be empty only where explicitly stated; otherwise empty is invalid.

### 4.2 Canonicalization and digest

1. JSON is UTF-8 and canonicalized with RFC 8785 JSON Canonicalization Scheme.
2. Non-finite numbers、duplicate keys and unpaired Unicode surrogates are rejected before hashing.
3. For a JSON artifact, remove only its root `artifact_digest` member, canonicalize the remaining full object, hash bytes with SHA-256, then encode `sha256:<lowercase hex>`.
4. Array order is semantic and preserved; writers sort set-like arrays lexicographically before serialization as specified by each DTO.
5. Text log digest is SHA-256 over exact redacted stored bytes and appears in `LogArtifactRef` inside suite report.
6. A digest proves byte integrity, not semantic pass、delivery、observation、approval or readiness.

### 4.3 Common envelope

Every JSON artifact includes these required fields:

| Field | Type | Rule |
|---|---|---|
| `schema_version` | string | exact v1 value |
| `run_id` | string | same fixed run as path/context |
| `artifact_kind` | closed string | exact DTO kind from §§5~8 |
| `generated_at` | timestamp | writer completion time |
| `generated_by` | object | required `component`,`version`; optional safe `revision` |
| `redaction_status` | enum | only `clean` is evidence-eligible |
| `artifact_digest_algorithm` | string | exact `sha256` |
| `artifact_digest` | digest | computed by §4.2 |

No artifact may contain raw environment, command with secret args, stack trace, prompt/response, tool/Sandbox/Artifact body, hidden reasoning, endpoint, credential, private key or full sensitive reference. Allowed diagnostics are closed error category、safe field path、dummy canary class、hash/fingerprint and body-free typed refs.

### 4.4 Shared nested records

These shapes are exact; a writer cannot replace them with free-form maps or strings.

| Record | Exact fields | Optionality / ordering |
|---|---|---|
| `GeneratedByRecord` | `component:string`,`version:string`,`revision:string?` | component/version nonempty safe tokens；revision omitted when unknown |
| `ArtifactRefRecord` | `path:RelativeArtifactPath`,`digest:ArtifactDigest`,`artifact_kind:string` | all required；kind must match referenced envelope |
| `SourceRefRecord` | `source_id:string`,`path:string`,`content_digest:ArtifactDigest`,`role:SourceRole`,`status:SourceStatus` | all required；arrays sorted by source_id |
| `LogArtifactRef` | `path`,`digest`,`byte_length:u64`,`redaction_status:RedactionStatus` | all required；path ends `.log` |
| `SafeFailureRecord` | `category:FailureCategory`,`safe_reason_ref:string`,`safe_subject_ref:string?`,`phase:string?` | category/reason required；no raw message/stack |
| `FindingRecord` | `finding_id:string`,`category:FindingCategory`,`severity:FindingSeverity`,`safe_subject_ref:string`,`safe_reason_ref:string` | all required；sorted by finding_id |
| `AssertionRecord` | `assertion_id:string`,`oracle_ref:string`,`status:AssertionStatus`,`safe_actual_ref:string?`,`failure_category:FailureCategory?` | actual/failure omitted on pass；required on fail as applicable |
| `VariantResultRecord` | `variant_id:string`,`status:ArtifactStatus`,`fixture_manifest_digest:ArtifactDigest`,`seed_digest:ArtifactDigest`,`fault_script_refs:string[]`,`assertions:AssertionRecord[]`,`safe_failure:SafeFailureRecord?` | arrays sorted except assertions retain declared oracle order；failure required on non-pass |
| `CaseArtifactRefRecord` | `case_id:string`,`path:RelativeArtifactPath`,`digest:ArtifactDigest`,`status:ArtifactStatus` | all required；sorted by case_id |
| `ComponentResultRefRecord` | `component_id:string`,`path`,`digest`,`status` | suite/check component ID exact；sorted by component_id |

Closed enums:

```text
SourceRole = requirement | architecture | overview | detail | config |
             test_calibration | owner_contract | implementation | foundation
SourceStatus = available_clean | available_dirty | unavailable | unknown
FailureCategory = assertion_mismatch | protocol_mismatch | state_violation |
                  transaction_violation | replay_conflict | boundary_violation |
                  redaction_violation | source_mismatch | dependency_blocked |
                  runner_failure | cleanup_failure | timeout | cancelled |
                  artifact_invalid
FindingCategory = source | denominator | dependency | forbidden_material |
                  fake_leak | status_truth | redaction | artifact_pairing |
                  static_evidence | cleanup
FindingSeverity = blocking | non_blocking
```

Unqualified identifier/name/category/version fields use `SafeToken`; body-free typed refs and safe reason/subject/oracle refs use `SafeRef`; paths use `RelativeArtifactPath`. Writers reject overflow and invalid characters without truncation. These evidence-envelope limits are test-tool constraints, not Runtime business protocol limits.

## 5. Meta artifact DTOs

### 5.1 `RunContextArtifact` -> `meta/context.json`

| Field | Req | Type / rule |
|---|:---:|---|
| common envelope | yes | `artifact_kind=run_context` |
| `gate_id` | yes | Step 9 gate ID |
| `repository` | yes | target implementation repository identity from real runner |
| `implementation_revision` | yes | actual revision string; never fabricated from design repo |
| `implementation_workspace_status` | yes | `WorkspaceStatus` |
| `branch_ref` | no | safe branch ref; detached run may omit |
| `config_profile` | yes | exact formal environment/profile pair |
| `config_snapshot_ref`,`config_snapshot_digest` | yes | `SafeRef + SemanticDigestRef`; immutable Runtime pair used by run |
| `source_manifest_ref`,`case_manifest_ref`,`selector_ref`,`blocker_snapshot_ref` | yes | same-run relative paths + digests |
| `suite_ids`,`check_ids` | yes | nonempty sorted unique arrays |
| `artifact_root` | yes | exact `artifacts/test/<run_id>` |
| `report_root` | yes | exact `reports/runs/<run_id>` |
| `started_at`,`finished_at` | yes | ordered timestamps |
| `prior_run_id` | no | retry/retest lineage only; must differ from run_id |

Writer: gate orchestrator after completion/failure finalization. Reader: all checks/report generators. Missing revision or dirty status is not silently normalized; G1 entry/exit rules decide eligibility.

### 5.2 `SourceManifestArtifact` -> `meta/source-manifest.json`

| Field | Req | Type / rule |
|---|:---:|---|
| common envelope | yes | `artifact_kind=source_manifest` |
| `design_sources` | yes | nonempty `SourceRefRecord[]`, sorted by source_id |
| `implementation_source` | yes | `{repository,revision,workspace_status,content_tree_digest}`；actual source only |
| `foundation_sources` | yes | sorted `SourceRefRecord[]`; unavailable/unknown retained |
| `historical_aliases_rejected` | yes | sorted unique strings; may be empty only when source checker found none in input registry |
| `manifest_digest` | yes | digest of canonical `design_sources + implementation_source + foundation_sources` only |

Raw file contents are not embedded. `manifest_digest` is a semantic sub-digest and does not replace the common whole-artifact digest.

### 5.3 `CaseManifestArtifact` -> `meta/case-manifest.json`

| Field | Req | Rule |
|---|:---:|---|
| common envelope | yes | `artifact_kind=case_manifest` |
| `raw_case_count`,`aggregate_case_count`,`evidence_count` | yes | exact `172`,`5`,`177` for G1 |
| `cases` | yes | sorted 177 entries |
| `cases[].case_id/evidence_id/owning_suite` | yes | one-to-one canonical Step 6 mapping |
| `cases[].case_kind` | yes | `raw` or `same_run_aggregate` |
| `cases[].required_variant_ids` | yes | nonempty sorted unique; aggregate has one derivation variant |
| `cases[].cut_refs/design_refs/requirement_refs` | yes | nonempty canonical arrays |
| `cases[].acceptance_refs/veto_refs` | yes | arrays; at least one of the two nonempty |
| `cases[].source_digest` | yes | binds manifest row to current calibration source |

Positive `TC-QUAL-SLOTnn` is absent until a formal rebaseline adds it; it cannot be smuggled into `cases` as an extra.

### 5.4 `SelectorArtifact` and `BlockerSnapshotArtifact`

`SelectorArtifact` uses `artifact_kind=selector` and requires `gate_id:string`, sorted nonempty `requested_suite_ids:string[]`, sorted `selected_raw_case_ids:string[]`, sorted `selected_aggregate_case_ids:string[]`, sorted `selected_variant_ids_by_case[] {case_id,variant_ids[]}`, sorted `expected_counts_by_suite[] {suite_id,raw_count,aggregate_count,variant_count}`, matching `observed_counts_by_suite[]`, `filter_args:string[]`, `skip_ids:string[]`, and `selector_status:valid|invalid`. `filter_args` and `skip_ids` must be empty for a formal full G1 run. G1 is valid only at 172 raw + 5 aggregate and exact manifest variant counts.

`BlockerSnapshotArtifact` uses `artifact_kind=blocker_snapshot` and requires sorted `items[]` with exact fields `blocker_id:string`,`owner:string`,`status:open|closed_by_owner_fact|superseded`,`source_ref:string`,`source_digest:ArtifactDigest?`,`affected_gate_ids:string[]`,`safe_reason_ref:string`. `source_digest` is required for closed/superseded, optional for open when no authority artifact exists. Arrays are sorted unique. The expected inventory contains `L2R-UP-001~008`,`L2R-CP-001`,`L2R-ENTRY-001`,`L2R-IMPL-001`,`L2R-LANG-001` unless a future design rebaseline changes it.

## 6. Check, case, journal and suite DTOs

### 6.1 `CheckResultArtifact` -> `checks/<check_id>.json`

Required after common envelope: `artifact_kind=check_result`,`check_id:string`,`status:ArtifactStatus`, sorted `input_refs:ArtifactRefRecord[]`,`finding_count:u64`, sorted `findings:FindingRecord[]`,`safe_failure:SafeFailureRecord?`,`started_at`,`finished_at`,`duration_ms:u64`. `finding_count` equals array length. `safe_failure` is absent only on pass; a passed check requires zero blocking findings and `redaction_status=clean`. Check results cannot masquerade as semantic EV.

### 6.2 `CaseResultArtifact` -> `suites/<suite>/cases/<case_id>.json`

| Field | Req | Type / rule |
|---|:---:|---|
| common envelope | yes | `artifact_kind=case_result` |
| `case_id`,`evidence_id`,`owning_suite` | yes | exact CaseManifest entry |
| `case_kind` | yes | `raw` or `same_run_aggregate` |
| `status` | yes | `ArtifactStatus` |
| `design_refs`,`requirement_refs`,`cut_refs` | yes | exact manifest arrays |
| `dataset_manifest_refs` | raw only | nonempty relative path/digest refs |
| `config_snapshot_ref`,`config_snapshot_digest` | raw only | `SafeRef + SemanticDigestRef`; exact run/operation binding |
| `variant_results` | yes | one result for every required variant, sorted by variant ID |
| `journal_refs` | yes | sorted array; may be empty only when design declares zero journal surface |
| `safe_failure_reason_ref` | non-pass | required except cancelled-before-start may use safe cancellation ref |
| `started_at`,`finished_at`,`duration_ms` | yes | ordered/nonnegative |

Each `variant_results[]` entry is an exact `VariantResultRecord`. A case passes only when the variant set exactly equals the manifest and every variant/assertion passes with clean redaction/cleanup.

An aggregate case additionally requires sorted `source_case_refs[] {case_id,path,digest,status}` from the same run and has no dataset/fake execution. Missing/non-pass child makes it non-pass.

### 6.3 `JournalArtifact`

Required after common envelope: `artifact_kind=journal`,`case_id`,`variant_id`,`journal_kind`,`entries`,`entry_count:u64`,`zero_oracle_ref:string?`. `entry_count` equals array length. Entry order is semantic and each entry starts with `sequence:u64` contiguous from 1 and `recorded_at:timestamp`.

| `journal_kind` | Exact fields after sequence/time |
|---|---|
| `write` | `operation_ref`,`record_kind`,`object_ref`,`before_version?`,`after_version?`,`write_disposition:staged|committed|rolled_back|unknown` |
| `port_call` | `port_kind:local|external`,`slot_key?`,`port_name`,`method`,`phase`,`request_digest`,`result_posture`,`call_ordinal:u64` |
| `uow` | `uow_ref`,`phase:begin|reserve|stage|commit|rollback|commit_unknown`,`disposition:succeeded|failed|unknown`,`safe_failure_ref?` |
| `state_transition` | `state_registry_id`,`subject_ref`,`from_variant`,`to_variant`,`expected_version?`,`new_version?`,`guard_disposition`,`history_ref?` |
| `inbox` | `source_owner`,`event_id`,`payload_digest`,`receipt_ref?`,`receipt_disposition:new|duplicate|collision|quarantined|commit_unknown`,`ack_count:u64` |
| `outbox` | `event_ref`,`event_id`,`schema_version_ref`,`payload_digest`,`publication_posture:stored|accepted|rejected|unknown`,`receipt_ref?` |
| `lease` | `job_id`,`partition_ref`,`lease_epoch`,`phase:claim|renew|check|release|lost`,`disposition:succeeded|failed|stale|unknown` |
| `cursor` | `job_id`,`partition_ref`,`before_cursor?`,`after_cursor?`,`page_digest`,`commit_disposition:committed|rolled_back|unknown` |
| `cleanup` | `resource_class`,`namespace_digest`,`disposition:clean|residue_found|failed`,`residue_count:u64`,`safe_residue_ref?` |
| `measurement` | `stage`,`unit:nanoseconds|microseconds|milliseconds|count|bytes|items`,`value:u64`,`workload_manifest_digest`,`dependency_posture_ref` |

An empty journal is valid only for an oracle explicitly requiring zero effects/calls and must include `zero_oracle_ref`; otherwise `zero_oracle_ref` is omitted. Journal string fields follow §4.4 body-free rules. Measurement is characterization only and carries no performance verdict.

### 6.4 `SuiteReportArtifact` -> `suites/<suite>/report.json`

| Field | Req | Type / rule |
|---|:---:|---|
| common envelope | yes | `artifact_kind=suite_report` |
| `suite_id`,`suite_kind`,`config_profile` | yes | kind=`raw|aggregate|integration|qualification` |
| `status` | yes | derived using §9 precedence |
| `expected_case_count`,`observed_case_count` | yes | nonnegative; equality required for pass |
| `case_results` | yes | sorted `CaseArtifactRefRecord[]`; nonempty for pass |
| `required_check_ids` | yes | sorted unique; may be empty only before gate aggregation |
| `failure_reason_refs` | yes | empty only on pass |
| `stdout`,`stderr` | yes | `LogArtifactRef {path,digest,byte_length,redaction_status}` |
| `safe_invocation_ref` | yes | script/version/arg-shape digest; no secret/raw env/command body |
| `started_at`,`finished_at`,`duration_ms`,`exit_code` | yes | exit code alone never determines pass |

The suite writer owns raw aggregation. Report scripts only read this DTO and cannot change its status/cases.

## 7. Gate summary and evidence index DTOs

### 7.1 `GateSummaryArtifact`

Required after common envelope: `artifact_kind=gate_summary`,`gate_id`,`status:ArtifactStatus`,`suite_results:ComponentResultRefRecord[]`,`check_results:ComponentResultRefRecord[]`,`expected_raw_count:u64`,`observed_raw_count:u64`,`expected_aggregate_count:u64`,`observed_aggregate_count:u64`,`blocker_snapshot_ref:ArtifactRefRecord`,`prior_run_id:string?`,`failure_reasons:SafeFailureRecord[]`,`started_at`,`finished_at`. Arrays are sorted by component ID. G1 pass requires `172/172` raw, `5/5` aggregate, every required suite/check passed and clean; G2/G3 use independent manifests and may remain blocked.

### 7.2 `EvidenceIndexArtifact` -> `evidence-index.json`

| Field | Req | Type / rule |
|---|:---:|---|
| common envelope | yes | `artifact_kind=evidence_index` |
| `gate_summary_ref` | yes | same-run path/digest |
| `expected_evidence_count` | yes | 177 for G1 |
| `item_count` | yes | exact array count |
| `items` | yes | sorted by evidence ID; duplicates invalid |
| `orphan_case_ids`,`orphan_evidence_ids` | yes | must be empty for valid G1 index |
| `derivation_rule_version` | yes | generator rule version |
| `index_status` | yes | `complete|incomplete|invalid`; not an acceptance verdict |

Each item requires:

| Field | Req | Rule |
|---|:---:|---|
| `evidence_id`,`case_id`,`owning_suite` | yes | exact one-to-one manifest mapping |
| `case_artifact_ref/digest`,`suite_report_ref/digest` | yes | same fixed run, verified digests |
| `source_case_refs` | aggregate only | exact same-run children |
| `dataset_refs`,`design_refs`,`requirement_refs`,`cut_refs` | yes | raw provenance; aggregate dataset refs may be empty |
| `acceptance_refs`,`veto_refs` | yes | exact manifest mapping; at least one nonempty |
| `derivation_status` | yes | exact enum |
| `redaction_status` | yes | clean required for `derived` |
| `review_status` | yes | initially `not_started`; report/review may advance without raw mutation |
| `artifact_path`,`report_path` | yes | fixed relative roots; report must exist for `derived` |
| `failure_reason_ref` | non-derived | required safe reason |

`derived` means mechanically eligible candidate only. It does not mean accepted, signed, delivered, observed or ready. Failed/blocked/infra/invalid cases remain indexed with ineligible status so reports cannot erase them.

## 8. Writer/reader and failure preservation

| DTO/output | Writer owner | Reader owner | Failure preservation |
|---|---|---|---|
| meta/context/source/case/selector/blockers | gate orchestrator + manifest builder | all checks/report generators | emit best-effort invalid/infra context; never invent missing revision/source |
| case/journal/log | owning suite runner | suite aggregator/checks | retain failed variants, safe diagnostics and exact logs |
| suite report | suite aggregator | gate/evidence/report generators | emit even on failed/infra/cancelled where process permits |
| check result | named check script | gate/report generator | finding refs retained; no hand-edited pass |
| gate summary | gate orchestrator | evidence/report generator | preserve all component statuses using precedence |
| evidence index | evidence generator | report/review/future 06 | includes ineligible items; refuses orphan/static entries |
| Markdown run reports | report scripts | human/Agent/future 06 | read-only derivation; raw status/digest links shown |
| acceptance/review Markdown | script draft + human/Agent | future 06 | cannot edit machine index or create verdict |

If report generation fails, raw artifacts remain authoritative, `index_status` cannot be complete, and the run is not G1-exited. A manually written Markdown page cannot fill the gap.

## 9. Status derivation and truth preservation

Component aggregate precedence is:

```text
invalid_artifact/invalid_execution
  > failed
  > infra_error
  > blocked_dependency
  > cancelled
  > not_evaluated
  > passed
```

This is a deterministic aggregation rule, not permission to collapse source statuses. Every child status remains recorded. G1 required components cannot finish as blocked/cancelled/not-evaluated; G2/G3 may be blocked but then generate only `ineligible_blocked` evidence items.

| Source condition | Evidence derivation |
|---|---|
| case passed + suite passed + required checks passed + pair/digest/redaction clean | `derived` candidate |
| assertion/suite/check failed | `ineligible_failed` |
| real positive prerequisite blocked | `ineligible_blocked` |
| runner/fixture/cleanup/report infra error | `ineligible_infra_error` |
| empty/filter/skip/schema/path/digest/orphan/static mapping/redaction failure | `ineligible_invalid` |

Retry/retest creates a new run and new evidence instances. The index may link `prior_run_id`, but cannot copy, replace or cherry-pick the prior failed item.

## 10. Suite-to-evidence/archive mapping

The actual TC->EV pair and its acceptance/veto refs come from `05_test_plan_step_13_evidence_registry.md` and must match the exact Step 6 row. Family inference at runtime is prohibited.

| Owning suite | TC denominator | EV identity source | Required raw/archive | Primary acceptance direction |
|---|---:|---|---|---|
| `unit_state` | 35 raw | exact UNIT/other owning EV in Step 6 | case + state/measurement journals + suite report | AC001~020/031~036 as manifest resolves; VF008 |
| `contract_protocol` | 32 raw | exact CON/FAULT/STATIC EV | query/slot/outbound/local-Port case + call/no-write/snapshot journals | AC006~030; VF001/005/008 |
| `service_semantics` | 32 raw | exact SVC/FAULT EV | command/CAP/loop case + UoW/write/call journals | AC001~020/032~035; VF002/004/005 |
| `entry_worker_job` | 16 raw | ENTRY/JOB/FAULT EV | receipt/ACK/lease/page/cursor journals + report | AC025/032/035; VF004/005 |
| `fault_replay_consistency` | 25 raw | FAULT/CON/STATIC EV | phase/replay/CAS/error/cleanup journals | AC032/034/035; VF004/005 |
| `config_builder` | 15 raw | CFG/FAULT/STATIC EV | strict raw issue refs、V-stage、slot/job/blocker assertions | AC031~033/036; VF003/006/008 |
| `security_source_boundary` | 17 raw | STATIC/FAULT/SVC/ENTRY EV | canary/dependency/source/status/boundary raw reports | AC026~030/033~036; VF001~008 |
| `local_e2e` | 5 aggregate | `EV-E2E-001~005` | same-run child refs + aggregate case/report | AC001~005 |

Slot evidence uses `TC-SLOT01~13-001` -> `EV-CON-446~458`. These prove local finite contract/fail-closed behavior only. Future `TC-QUAL-SLOTnn` requires a new formal EV identity after rebaseline; it cannot reuse the local EV.

Meta/report authenticity is tested by existing canonical cases: `TC-TRUTH-001`/`EV-STATIC-697`, `TC-SOURCE-001`/`EV-STATIC-698`, `TC-DEP-001`/`EV-STATIC-437`, `TC-CFG15-001`/`EV-STATIC-685` and relevant BOUND/SEC cases. Checks themselves do not invent a meta-evidence TC/EV.

## 11. Report generation and review contract

| Output | Source | Planned script | Review requirement |
|---|---|---|---|
| suite Markdown | suite report + cases/log refs | `scripts/reports/generate_suite_reports.sh` | status/case/failure refs match raw exactly |
| gate/summary Markdown | gate summary + context/blockers | `scripts/reports/generate_gate_summary.sh` | local vs G2/G3 qualification boundary explicit |
| evidence index/details | raw evidence index + source case/report pairs | `scripts/reports/generate_evidence_index.sh` | 177 IDs, no orphan/duplicate/static/cross-run item |
| acceptance drafts | fixed-run reports/index + defect/blocker/risk records | `scripts/reports/generate_acceptance_drafts.sh` | human/Agent must add scope/open issues; no verdict/signoff |
| redaction report | artifacts + generated reports scan | `scripts/checks/check_redaction.sh` | scan includes raw JSON/log and Markdown surfaces |
| artifact/report audit | paths/digests/pairs/index | pairing + no-static checks | missing/handwritten/cross-run item blocks |

`reports/README.md` must name the candidate `<run_id>`, artifact root and report links, but does not create a moving “current accepted run” alias. `reports/acceptance/risk-acceptance.md` is human/Agent-authored review material; a script may list candidates but cannot fill accepter identity, decision or signoff.

## 12. Acceptance draft boundary

| Draft | Must include | Must not include |
|---|---|---|
| `handoff.md` | one fixed run, implementation/design refs, G1 result source, G2/G3 blocker disclosure, report/index links | automatic acceptance/readiness/signature |
| `veto-checklist.md` | VF001~008 rows with concrete EV/case/artifact/report refs or explicit missing/blocking status | static “all passed” text |
| `risk-acceptance.md` | residual candidates, impact, owner role required, trigger/deadline fields for human completion | invented accepter/decision/date |
| `open-issues.md` | failed/blocked/infra/invalid components, S/A defects and missing reports | omission by selecting only green results |

Future `06-验收标准.md` consumes reviewed candidate evidence and makes the verdict. 05 does not assign an evidence alias, acceptance result or signatory.

## 13. Retention, deletion and security

No numeric retention duration has a current authority. A candidate release run must be retained at least through future acceptance completion and closure of all defects/retests that reference it; referenced first-failure runs cannot be deleted. The implementation/release evidence owner and future retention policy must set duration before production candidate use.

Deletion requires proving no acceptance、defect、retest、audit or delivery record references the run, and it must preserve an authorized deletion audit outside Runtime business truth. This design does not choose an evidence backend or make Runtime own report retention.

## 14. Forbidden paths, references and evidence constructions

| Forbidden | Correct rule |
|---|---|
| `artifacts/test/<project>/<run_id>` | `artifacts/test/<run_id>` |
| `reports/<project>/...` | `reports/runs/<run_id>` / `reports/acceptance` |
| formal `latest` or best-run alias | fixed run ID only |
| scripts under `reports/` | `scripts/gates|checks|reports/*` |
| EV item with natural-language `tc_refs` | exact canonical `case_id` |
| evidence index generated from manifest/table only | valid raw case + suite report + checks/digests |
| failed/blocked item omitted | retain it as ineligible with safe reason |
| raw artifact manually edited | regenerate under new run; preserve old |
| raw secret/body/stack/full sensitive ref | safe ref/hash/category/redacted diagnostic only |
| fake/local slot EV closes positive qualification | separate future QUAL case/EV after formal rebaseline |
| acceptance draft or review note changes status | machine raw/index remains immutable |

## 15. Evidence stop-review and cross-audit

| Audit | Result |
|---|---|
| identity | 177 TC -> 177 EV one-to-one; no second namespace |
| canonical registry | annex has 177 explicit TC/EV/suite/AC/VF rows; manifest builder cannot infer family mappings |
| machine schemas | context/source/case/selector/blocker/check/case/journal/suite/gate/index fields, enums and optionality defined |
| digest | RFC 8785 + SHA-256 + root self-field exclusion + log byte digests defined |
| writer/reader | owner and failure preservation defined for every output class |
| paths | exact roots; no project layer or `latest` |
| variant handling | one case artifact contains exact required variant results; no identity inflation |
| meta evidence | existing canonical TC/EV only; no natural-language/orphan EV |
| failed/blocked truth | retained and ineligible; not omitted or rewritten |
| redaction | artifacts/logs/reports/acceptance drafts all scanned |
| positive qualification | local slot evidence cannot close 13 blocked lanes |
| current evidence | none generated; all schemas/scripts/paths planned_not_created |

```text
step_status = completed_continuous_authorized
planned_evidence_identity = 177
actual_run_artifact_report_evidence = 0
machine_schema_closure = complete_at_design_level
positive_qualification_evidence = blocked_dependency_13_of_13
next_step = Step 14
formal_05_write_allowed = false_until_step_15
```
