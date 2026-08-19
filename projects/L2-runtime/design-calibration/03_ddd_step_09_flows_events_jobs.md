# L2-runtime Step 9 function flows: inbound events, outbound materialization and jobs

> 状态: done
> 范围: 6 Inbound Event Consumer、6 Outbound Event materialization、7 Operations Job

## 1. Inbound Event consumer flows

### 1.1 `ConsumeModelResultAvailableFlow`

1. Worker mapper validates envelope kind/schema/source/correlation/body-free payload.
2. Begin UoW and reserve event identity/digest in `EventInboxPort`; duplicate returns existing `EventReceipt`.
3. Find turn by submission; validate result/turn/order; late/out-of-order creates quarantine receipt without turn mutation.
4. Map semantic result to turn/decision/summary; save turn/decision/history/outbox/inbox receipt atomically.
5. Commit, then acknowledge source event. Commit unknown returns `EventDisposition::Unknown`; no ack until durable disposition.

### 1.2 `ConsumeActionFeedbackReceivedFlow`

Validate Tools/Sandbox owner and action/submission/marker IDs; reserve inbox event; load prior feedback ordering and marker version; append `ActionFeedbackRecord`; compute incorporation decision; conditionally transition marker and create progress/recovery fact; commit feedback/marker/history/outbox/inbox receipt; acknowledge only after commit. Duplicate/late/out-of-order/mismatch are durable receipts and do not reverse-write.

### 1.3 `ConsumeChildResultAvailableFlow`

Validate child source/correlation/delegation/scope; reserve inbox; load delegation and existing result incorporation identity; duplicate returns existing receipt; record child result ref and `Delegation::incorporate_once`; append parent history/progress candidate/outbox/inbox receipt; commit and ack. Parent outcome/status does not automatically follow child disposition.

### 1.4 `ConsumeSourceSnapshotChangedFlow`

Validate source owner/version/scope/change kind; reserve inbox; compare local availability version; older event becomes late receipt; record new availability/snapshot metadata, mark affected context/projection stale, append history/outbox/receipt in one UoW; ack after commit. No external body is copied.

### 1.5 `ConsumeGovernancePreconditionChangedFlow`

Validate Governance owner/formal decision/policy/scope/effective version; reserve inbox; compare stored precondition version; create imported view and new action/admission blocked/progress decisions where affected; append history/outbox/receipt atomically. It never creates approval/policy truth; unknown/stale always fail closed.

### 1.6 `ConsumeHandoffAcknowledgementReceivedFlow`

Validate handoff source/attempt/submission/correlation; reserve inbox; load attempt/gap expected versions; duplicate/late/mismatch produces record-only receipt; verified acknowledgement updates attempt and closes matching gap with closing source; append reconciliation/history/outbox/receipt, commit and ack. Local outcome never changes.

## 2. Outbound event materialization flows

### 2.1 `MaterializeRuntimeFactCommitted`

Within the fact-producing UoW, map committed fact ref/kind/run/version/correlation/safe summary refs to `RuntimeFactCommitted`, validate body-free payload, assign stable event ID/digest and append `CommittedEventSnapshot` to outbox. Publisher later reads exact snapshot; no current-truth rebuild.

### 2.2 `MaterializeRuntimeDecisionCommitted`

After decision/history validation but before UoW commit, map decision ref/kind/disposition/source refs/version/correlation to snapshot; append with local decision. No Governance approval field is accepted.

### 2.3 `MaterializeActionSubmissionAttempted`

Map locally committed action attempt/marker/target/scope/disposition to snapshot in the attempt UoW. `Recorded/Submitted/Blocked/Unknown` are allowed; `Executed` is not a variant.

### 2.4 `MaterializeRuntimeOutcomeCommitted`

Map immutable local outcome/run/disposition/safe result/summary refs/version to snapshot in the outcome UoW. No delivery/observed/acceptance fields are populated or queried.

### 2.5 `MaterializeHandoffAttempted`

Map material/attempt/optional gap/digest/local status/correlation to snapshot after candidate/attempt UoW. A candidate or blocked gap can be emitted, but event name does not mean delivered.

### 2.6 `MaterializeProjectionMarkedStale`

Map projection ID/source run version/history sequence/reason/correlation to snapshot when committed source fact invalidates the read model. The event does not imply rebuild/current or Observability reception.

## 3. Operations Job flows

### 3.1 `RebuildSafeRuntimeViewsFlow`

1. Validate job metadata/config enablement; claim projection partition lease.
2. Load job state/cursor and `ProjectionState`; begin/resume rebuild ID.
3. Read bounded committed history page; validate contiguous sequence.
4. Map facts to body-free views; `ProjectionStorePort.write_page` under expected cursor.
5. Save job page outcome/cursor/report and renew/release lease. History gap -> degraded with gap ref; lease loss -> stop without second page.

### 3.2 `RefreshSourceSnapshotsFlow`

Claim source partition lease; load source page from input/cursor; for each source call resolver with expected version/freshness; record available/stale/unavailable/pending/unknown marker through application service; mark dependent projection/context stale where applicable; commit page/cursor/report; release lease. Fake/design file/ping cannot yield available/readiness.

### 3.3 `CompactWorkingMemoryFlow`

Claim run/window lease; load memory at expected version; call `CompactionDecision::decide/validate_partition`; begin compacting and save new window/history/report in one page transaction; commit unknown leaves prior window authoritative and state blocked/unknown; release lease. No durable memory delete/retention call.

### 3.4 `ResumeEligibleRunsFlow`

Claim recovery partition; page `RunRepositoryPort.list_resume_eligible`; for each candidate reload run/checkpoint/fence/current versions, create a new `RecoveryDecision`, and apply only resume/restart decisions through recovery continuation. Unknown/manual-review candidates are excluded from external action. Save each bounded result and page cursor/report; lease loss stops scan.

### 3.5 `ReconcileUnknownEffectsFlow`

Claim effect partition; page unknown side-effect markers and commit-unknown checkpoints; query only formal status/feedback reconciliation Ports; verified fact creates feedback/checkpoint/recovery record; absence or unknown remains fenced. Save report/cursor; never retry external action during status reconciliation.

### 3.6 `ReconcileHandoffGapsFlow`

Claim gap partition; page open/unknown gaps; reload attempt and query acknowledgement/status seam; verified acknowledgement produces `HandoffReconciliationRecord` and closes gap; absent/pending/unknown keeps gap; save report/cursor. Outcome is read-only.

### 3.7 `PublishRuntimeOutboxFlow`

Claim outbox partition; page pending snapshots in stable cursor order; publish exact stored payload/event ID; record accepted/rejected/unknown publisher receipt without changing source fact; advance cursor only for durable known disposition; unknown remains pending/unknown; return report and release lease. Publisher never regenerates payload.

## 4. Cross-flow transaction audit

| Family | Identity | Local atomic set | External call ordering | Unknown behavior |
|---|---|---|---|---|
| Consumer | event ID + source owner + digest | inbox receipt + local record + history/outbox | ack after commit | no ack; receipt unknown/reconcile |
| Outbound | outbox entry + event ID + payload digest | source fact + exact snapshot | publish later | source fact unchanged; outbox pending |
| Job | job operation + partition + lease token + cursor | page changes + cursor + report | per-item service boundary | stop page; preserve cursor/fence |

## 5. Step 9 gate

| Inventory | Required | Completed |
|---|---:|---:|
| Command Flow | 17 | 17 |
| Query Flow | 12 | 12 |
| Inbound Consumer Flow | 6 | 6 |
| Outbound Materialization Flow | 6 | 6 |
| Operations Job Flow | 7 | 7 |

```text
step_09 = done
next_allowed_action = start_step_10_eighteen_state_machines
```
