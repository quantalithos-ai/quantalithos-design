# L2-tools 03 详细设计 Step 9: 逐接口函数级处理流

> 创建日期: 2026-08-05
> 状态: completed / pass
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §8
> 当前写入许可: 只允许本 Step 中间产物；正式 03 仍禁止写入。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 8 `completed / pass`;all `13/11/5/4/4` schemas and protocol-to-flow IDs closed. |
| Direct inputs | Step 6 object callables/states;Step 7 stores/ports/UoW/idempotency;Step 8 request/result schemas. |
| Formal upstream | 正式 02 §8/§9/§12.4/§12.5；12 flow-family boundary. |
| Flow inventory | 13 Command + 11 Query + 5 Inbound + 4 outbound event continuation + 4 Job = 37 interface flows;all independent. |
| Controlled correction | Definition save, commit/exact result+error replay, paged stale mark, retirement report, Hub candidate/result and replacement identity were closed;consumer scope, latest Binding assessment and source envelope identity are now explicit. No business object/protocol/owner change. |
| Blocker rule | Positive external flow branches remain conditional/blocked;negative/local flows are exact. |

## 1. Step 9 write batches

| Batch | Flow family | Count | Write status | Completeness | Stop review | Next |
|---:|---|---:|---|---|---|---|
| 0 | skeleton/shared guards/inventory | 0 | completed | complete | pass | 1 |
| 1 | Command `CF-01~13` | 13 | completed | complete | pass | 2 |
| 2 | Query `QF-01~11` | 11 | completed | complete | pass | 3 |
| 3 | Inbound `IF-01~05` | 5 | completed | complete | pass | 4 |
| 4 | Outbound `OF-01~04` | 4 | completed | complete | pass | 5 |
| 5 | Job `JF-01~04` | 4 | completed | complete | pass | 6 |
| 6 | cross-flow transaction/state/side-effect/phase audit | 37 | completed | complete | pass | Step 10 |

## 2. SOP answers

### 2.1 Flow ownership and entry

- Every Step 8 protocol gets exactly one flow section. Common guards may be referenced but never replace a flow-specific chain.
- `api/worker/jobs` validates/maps public carriers and calls one application facade; only application calls repositories, UoW, external Ports and domain functions.
- Domain calls remain synchronous; repository/external/UoW calls use Step 7 `PortFuture` I/O boundary.
- Query flows are resolver-first/no-write and never call external Ports.
- Consumer flows validate envelope/idempotency, commit a durable phase-1 claim before observational reads, then complete local effects and receipt in phase 2; source acceptance formally re-enters the owning Command service.
- Event flows map one immutable material to one exact event identity, persist prepared local attempt, then call collaboration outside the local transaction.
- Job flows claim the operation before target work, process one bounded deterministic slice, commit each named local effect, then complete the stored report; external feedback calls occur before their local effects UoW.

### 2.2 Transaction discipline

| Phase | Allowed operations | Forbidden operations |
|---|---|---|
| Pre-UoW read/validation | metadata/DTO validation and stable input construction; Consumer observational Port/reverse reads occur only after its phase-1 claim | local writes, hidden retry, side-effecting external call |
| Local UoW | idempotency reserve/transition, domain mutation, repository writes, stored result/receipt/report, projection stale marks | external Port calls, entry response, adapter commit |
| Commit resolution | `commit`;if unknown, `resolve_commit` using same authority | blind rerun |
| Post-commit external | Sandbox handoff or collaboration call only from its named committed prepared marker and durable claim | rollback local truth, rebuild from current truth, automatic retry after call ambiguity |
| Post-external local UoW | save local attempt/status and complete stored response when multi-phase | external delivery/observation state ownership |

### 2.3 Accepted side-effect classes

Each flow inventories only these classes: local T1/T2 truth write;append-only assessment/fact/audit/gap;D1 projection/report write;idempotency/stored public surface;external Port call;body-free log/metric/trace cut (Step 15);semantic event material/attempt. There is no hidden email, cache, policy, Runtime action, retry loop, broker ack or external store write.

## 3. Shared flow guards

### 3.1 Write-channel guard

```text
[Entry]
  -> validate protocol name/version + matching metadata carrier
  -> validate actor/source/system authority and forbidden-body
  -> canonicalize request digest
  -> IdempotencyStore.get(scope, key)
     -> committed equal: typed replay, no domain/store/external calls
     -> existing different: conflict, zero target writes
     -> claimed equal: in-flight/recovery branch, no duplicate mutation
     -> none: continue
  -> for Consumer: begin phase-1 ToolsUnitOfWork; IdempotencyStore.reserve(record, uow); commit claim
     -> Existing: rollback and classify/replay/conflict
     -> Reserved(Loaded record): use returned expected_version
  -> perform Consumer flow-specific stable reads/external input resolution after claim
  -> begin phase-2 ToolsUnitOfWork for Consumer local facts/receipt, or the named Command UoW
  -> for ordinary writes: perform flow-specific domain calls and local writes in the same uow
  -> stage exact closed typed value + refs using repository version + uow.commit_candidate
  -> complete idempotency record with the same candidate
  -> commit;verify candidate/receipt symmetry;resolve unknown before response/reentry
```

Deterministic input/state rejection discovered before reserve performs zero writes. A rejection that must establish an L2 terminal/audit/gap fact or must be replayable after a subject read is committed through the same write guard as a typed result/error ref. Step 12 fixes exact stable error storage and mapping.

### 3.2 Query guard

```text
[Query Entry]
  -> validate QueryMetadata + request (no idempotency)
  -> load subject owner scope or collection visibility seed
  -> ReadVisibilityResolverPort.resolve(input)
     -> NotFound/Forbidden/Unavailable: map typed surface, stop
  -> execute exact Step 7 read/bundle/page method
  -> validate bundle identity/ref/watermark symmetry
  -> pure domain-to-contract view mapper
  -> map empty/fresh/stale/rebuilding/unavailable/failed surface
  -> return;assert zero UoW and zero external Port calls
```

### 3.3 External-before-local and truth-first guards

For authorization/Hub/Sandbox readiness/source/feedback resolution, the Consumer application first
commits its technical phase-1 claim, then calls the exact observational Port method without a UoW,
and finally opens the phase-2 UoW that persists the returned assessment/ref/gap. Command flows that
have no pre-call claim retain their own per-flow ordering. The Port receives no UoW.
`SandboxExecutionPort::submit_handoff` and `SafeEventCollaborationPort::submit` are side-effecting:
`CF-10` / `CF-12` first commit the durable claim and named prepared marker, call once outside any
UoW, then store local disposition and complete replay in a second UoW. Call ambiguity never triggers
blind retry.

## 4. Flow inventory and annex index

| Annex | Flows | Count |
|---|---|---:|
| `03_ddd_step_09_command_flows_annex.md` | `CF-01~13` | 13 |
| `03_ddd_step_09_query_flows_annex.md` | `QF-01~11` | 11 |
| `03_ddd_step_09_consumer_flows_annex.md` | `IF-01~05` | 5 |
| `03_ddd_step_09_event_flows_annex.md` | `OF-01~04` | 4 |
| `03_ddd_step_09_job_flows_annex.md` | `JF-01~04` | 4 |

## 5. Per-flow fixed stop-review fields

Every annex section must provide:

1. Entry/request/target/result and owner.
2. ASCII call graph naming only Step 6 objects and Step 7 methods.
3. Typed call sequence/pseudocode.
4. Transaction start/commit/rollback and external-call placement.
5. Error mapping and duplicate/reentry behavior.
6. State changes and complete accepted side-effect inventory.
7. At least positive, deterministic negative, conflict/duplicate and blocked/degraded test cuts as applicable.
8. Single-flow stop result for DTO/object/Port/UoW/error/state/side-effect/test closure.

## 6. Step 9 completion conclusion

Step 9 skeleton/shared guards, `CF-01~13` Commands, `QF-01~11` Queries, `IF-01~05` Consumers,
`OF-01~04` outbound continuations and `JF-01~04` Jobs have passed per-flow and family audits.
Query closure required controlled Step 6/7 corrections for closed subject refs, common-watermark
truth bundles and explicit D1 read surfaces. Consumer closure added only the technical phase-1
claim fence and exact receipt/gap mappers. Job closure corrected the historical implicit global
Binding scan, made unsupported reference kinds explicitly blocked, and fixed claim-before-target/
report completion plus one-call feedback fencing. R-9 then audited all 37 flows against their
canonical DTO, callable, Store/Port seam, UoW/phase, state/effect, error/replay and test cuts. It
also resolved the `JobReport.job` naming conflict and prohibited the old implicit JF-01 global scan.
No owner, business object, store group, external Port or write authority changed. Step 9 is closed;
the next allowed write target is Step 10. Formal 03 remains write-closed.

```text
step_status = completed / pass
current_batch = 6_cross_flow_audit_completed
gate_status = pass
next_allowed_action = read Step 10 standards, Step 6 states and Step 9 transitions; create 03_ddd_step_10_state_matrix.md
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
