# L4-observability 03-详细设计 Step 08 - S08-G Job J05 `ScanObservationGaps`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 implementation/runtime complete
> 回填目标: 正式 `03-详细设计.md` §7；仅在 Step 19 装配

## 1. Protocol identity and non-owner boundary

J05 detects and records observation-side gaps from an immutable scan boundary. It does not manufacture
source material, close a gap merely because a scan ran, repair external/source truth, or turn absence of a
local projection into proof that the upstream fact never existed.

| item | exact contract |
|---|---|
| public protocol | `ObservationJobRequest<ScanObservationGapsJobInput>` |
| internal operation | `ObservationJobOperation::ScanObservationGaps` |
| entry callable | `ObservationOperationsJobService::scan_observation_gaps(ScanObservationGapsInput)` |
| work-key variant | `ObservationJobWorkKey::GapSource(GapSourceRefId)` |
| planned material | complete `GapSourceRef`, `GapScanTargetSnapshot`, visibility/policy basis, cursors and captured versions |
| Step 09 flow | `ScanObservationGapsFlow` |

## 2. Input/output schema

```rust
pub struct ScanObservationGapsJobInput {
    pub scan_scope_ref: GapScanScopeRef,
    pub expected_source_refs: Vec<GapSourceRef>,
    pub visibility_scope_ref: VisibilityScopeRef,
}

pub struct ScanObservationGapsJobOutput {
    pub scan_record_refs: GapScanRecordRefSet,
    pub opened_gap_refs: GapStateRefSet,
    pub updated_gap_refs: GapStateRefSet,
    pub suppressed_gap_refs: GapStateRefSet,
    pub progress_refs: RebuildProgressViewRefSet,
}
```

`expected_source_refs` is canonical sorted/unique and may be empty only when the explicit scope-only scan
contract permits it. The list is a scan boundary, not a claim that each source exists or is healthy. The
visibility scope is an input to P11/P12 policy; it is not a final visibility value submitted by the caller.

## 3. Candidate and H12 material

An empty expansion is frozen as a defined scope operation, not silently changed to a global scan. Each
`GapSource` item stores the source snapshot, target snapshot, policy basis, observation/reference cursors
and captured repository versions required by the H12 accepted result. It must not store job/claim/report
identity inside the domain result.

The global work key uses the stable `GapSourceRefId`; mutable `GapStateRef`, latest gap row, source string,
or scope hash cannot replace it. One active claim may own one source scan item across executions.

## 4. Item flow and UoW

```text
claim GapSource
  -> load exact planned source/target/policy boundary
  -> perform bounded read-only scan at captured cursors
  -> classify discovered canonical gap set with P12/P13 owner
  -> transition/open/update/suppress local GapState only when authorized
  -> append H12 record with exact accepted result and E09 follower if changed
  -> fold outcome and release claim
```

`GapScanAcceptedItemResult` preserves target ref, seven target snapshot semantics, discovered gap refs,
typed outcome and one completion time. An empty discovered set is a valid result only when the scan owner
proves the boundary; it is not inferred from a zero query row count. A scan never closes an existing gap
without an explicit repair/observation decision from its owner.

## 5. Result, replay and error matrix

| condition | item/report behavior | prohibited shortcut |
|---|---|---|
| invalid scope/source/visibility relation | reject before plan | default visibility or source family |
| source read complete/no gaps | exact successful scan result with empty set if proven | synthetic gap/no-gap from timeout |
| discovered gap set | H12 accepted result and exact gap refs | generic failure reason or dropped empty semantics |
| source dependency unavailable | retryable/blocked; preserve pending | treat unavailable as no-gap |
| CAS/policy conflict | typed retryable/blocked | close/open by first row |
| duplicate terminal request | stored report replay | rescan and rewrite gaps |
| commit/result unknown | probe/manual | classify success from local cache |

The Job report folds H12 item associations losslessly. `GapStateRefSet` in public output is copied from the
fold and is not an authorization input for a later command.

## 6. Redaction and no-backwrite

Telemetry permits scan scope kind, finite gap/outcome/recovery tokens, presence and bounded counts. It
excludes source identifiers as labels, source body, raw audit material, cursor values, provider errors and
actor/trace details. J05 does not modify source/business truth, retention, evidence or report verdict.

## 7. Step 09 handoff and affected

| item | contract |
|---|---|
| flow chain | assembler -> plan/GapSource material -> claim -> bounded scan -> H12/gap transition -> fold/report |
| state boundary | gap detection is not source repair or acceptance |
| affected | `S08-G-J05-SCOPE-EMPTY-SEMANTICS-01`, `S08-G-J05-H12-RESULT-BINDING-01`, `S08-G-J05-GAP-CLOSE-AUTHORITY-01` remain `open_internal_affected` |
| status | `defined_with_affected_open`; not runtime-ready |
| implementation/evidence | not implemented, tested or run; no commit/run_id/evidence alias/signoff |
