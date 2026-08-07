# L2-tools 03 详细设计 Step 8: API / Command / Query / Event / Job 协议契约

> 创建日期: 2026-08-05
> 状态: recalibration_completed / pass
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §6、§7
> 当前写入许可: 只允许本 Step 中间产物；正式 03 仍禁止写入。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 7 `completed / pass`;all module and cross-seam audits pass. |
| 直接输入 | 正式 02 §7 / §12.3；Step 6 object/carrier annexes；Step 7 trait/store/external/entry contracts。 |
| 固定协议全集 | 13 Commands、11 Queries、5 Inbound Consumers、4 Outbound Event semantic protocols、4 Operations Jobs。 |
| Transport authority | 未选择 HTTP/RPC/broker/scheduler/framework；使用 versioned logical operation/event/job name，Step 14/04 绑定 physical transport。 |
| Controlled correction | Pre-entry audit added existing technical carrier `JobReport.output_refs` and completed existing `IdGeneratorPort` ID methods; no new truth/state/Port/store. |
| External blockers | `L2T-UP-001~009` remain open; schemas define L2 requests, safe results and blocked behavior, not provider readiness. |

## 1. Step 8 write batches

| Batch | Protocol family | Write status | Content completeness | Stop review | Next |
|---:|---|---|---|---|---|
| 0 | skeleton + shared public carriers/names/surfaces | done | complete | pass | 1 |
| 1 | 13 Command protocols | done | complete | pass | 2 |
| 2 | 11 Query protocols | done | complete | pass | 3 |
| 3 | 5 Inbound Consumer protocols | done | complete | pass | 4 |
| 4 | 4 Outbound Event protocols | done | complete | pass | 5 |
| 5 | 4 Operations Job protocols | done | complete | pass | 6 |
| 6 | DTO construction/public-secondary-type/protocol-flow audit | done | complete | pass | gate |
| 7 | R-8 per-protocol closure recalibration | done | complete | pass | `03_ddd_step_08_protocol_recalibration_annex.md`; proceed to R-9 |

## 2. SOP answers and protocol decisions

### 2.1 Protocol family ownership

| Family | Public owner | Caller/producer | Handler/subscriber | Logical transport | Step 9 requirement |
|---|---|---|---|---|---|
| Command | `contracts::commands` | Runtime/direct/management/system integration | api/application command facade | `tools.command.<operation>.v1` request-response | each of 13 independent |
| Query | `contracts::queries/views` | Runtime/direct/management/future SDK consumer | api/application query facade | `tools.query.<operation>.v1` request-response | each of 11 independent |
| Inbound | `contracts::consumers` | formal external source adapter | worker/application consumer facade | `tools.inbound.<event>.v1` logical envelope | each of 5 independent |
| Outbound | `contracts::events` | application safe-material mapper | worker/collaboration Port | `tools.event.<event>.v1` semantic envelope | each of 4 candidate/continuation flows |
| Job | `contracts::jobs` | one-shot jobs entry | application job facade | `tools.job.<action>.v1` trigger | each of 4 independent |

These are stable logical contract names, not HTTP paths, RPC methods, broker topics, queues, consumer groups, cron expressions or deployed endpoints. A physical adapter must bind one logical name without changing its DTO semantics.

### 2.2 Metadata/actor authority

- Command actor, request/correlation/trace/idempotency/time come only from `CommandMetadata`; request bodies never duplicate them.
- Query actor/consumer/read-time come only from `QueryMetadata`; request bodies own target/filter/page only.
- Consumer trusted source identity/version/correlation/order come only from `InboundEventEnvelope<T>`; payloads do not repeat them.
- Job system actor/key/correlation/trace/watermark come only from `JobMetadata`; job bodies own scope/cursor/limits only.
- Trusted integration/system actors do not bypass authority, schema version, digest, source isolation, forbidden-body, idempotency, visibility or state gates.

### 2.3 Field and construction discipline

- Callers provide semantic intent, stable target/ref, safe reason, explicit mode/target and typed external candidate refs.
- Application supplies local IDs/time, loads expected-version tokens, resolves formal source/scope, derives safe summaries and commits typed result refs.
- Callers never supply `ExpectedVersion`, stored version, commit watermark, outcome/audit ID, change fact ID, local attempt ID or projection freshness as intent.
- `Ref` locates; `Summary` is body-free; `Assessment` is an L2 judgment; these near-names are never interchangeable.
- Missing caller-required fields reject; missing lookup/source yields not-found/unavailable/blocked; no null-to-mode or raw-string fallback.

## 3. Annex index

| Family | Annex | Required independent sections |
|---|---|---:|
| shared | `03_ddd_step_08_shared_protocol_carriers_annex.md` | metadata/page/surface/result/error/secondary-type catalog |
| Command | `03_ddd_step_08_command_protocols_annex.md` | 13 |
| Query | `03_ddd_step_08_query_protocols_annex.md` | 11 |
| Inbound | `03_ddd_step_08_consumer_protocols_annex.md` | 5 |
| Outbound | `03_ddd_step_08_event_protocols_annex.md` | 4 |
| Job | `03_ddd_step_08_job_protocols_annex.md` | 4 |

## 4. Protocol inventory and downstream mapping

| Family | Count | Step 6 targets | Step 7 dependency families | Step 9 flow batch |
|---|---:|---|---|---|
| Command | 13 | truth/fact/assessment/handoff/outcome/gap objects | UoW, idempotency, 6 stores, external ports as applicable | 9.1 |
| Query | 11 | stable views/reports/projections | visibility + store/projection reads | 9.2 |
| Consumer | 5 | source refs/snapshots/assessments/gaps/external refs | idempotency + source ports + stores | 9.3 |
| Outbound | 4 | committed safe material/submission attempts | submission store + collaboration port | 9.4 |
| Job | 4 | assessments/gaps/reports/projections/external refs | idempotency + stores + conditional source ports | 9.5 |

## 5. Protocol family stop reviews

| Family | Count | Independent schema | Secondary types | Construction/read closure | Errors/idempotency/actor | Step 9 mapping | Result |
|---|---:|---|---|---|---|---|---|
| Command | 13 | yes | complete | all target fields sourced | exact | `CF-01~13` | pass |
| Query | 11 | yes | complete | keys/views/pages/degradation exact | no-write actor/consumer exact | `QF-01~11` | pass |
| Consumer | 5 | yes | complete | envelope-to-effect/receipt exact | dedup/quarantine/trusted source exact | `IF-01~05` | pass |
| Event | 4 | yes | complete | exact material/source/event identity | target/version/route-blocked exact | `OF-01~04` | pass |
| Job | 4 | yes | complete | bounded target/report/output refs exact | system actor/idempotency exact | `JF-01~04` | pass |

## 6. Cross-protocol public surface closure audit

| Audit item | Result | Closure |
|---|---|---|
| Inventory | pass | `13/11/5/4/4`;no new public entry. |
| Public secondary types | pass | Every metadata/view/summary/ref-set/page/receipt/report/payload type has owner and fields. |
| Metadata authority | pass | Command/Query/Consumer/Job each have one source; bodies do not duplicate authority fields. |
| DTO -> Domain construction | pass | Caller/lookup/derived/system sources cover every required target field; missing behavior named. |
| Query response | pass | Single/page keys, visibility, empty, stale, rebuilding, unavailable and failed surfaces exact. |
| Page helper | pass | Repository/public cursor types separated with scope digest and watermark mapping. |
| Result/receipt/report replay | pass | Typed stored surfaces exist; duplicate never reruns protocol. |
| Event exact source | pass | Closed envelope union, deterministic ID and attempt-bound event identity. |
| Naming | pass | HLD names map 1:1 to `*Request/*Response` Rust carriers; two compare protocols explicitly differ. |
| Ref semantics | pass | candidate/ref/assessment/snapshot/material/attempt/result/evidence locator names are not interchangeable. |
| Actor/source scope | pass | Trusted/system actors cannot bypass safety, authority, digest, visibility or state gates. |
| Error/body boundary | pass | Protocol errors and all public payloads are body-free/redacted/backend-neutral. |
| Contracts dependency | pass | Public schemas depend on contracts shared only; no domain/application/infra type leaks. |
| Blocked upstream | pass | Positive authorization/Sandbox/Bus/Observability/Core/SDK readiness remains unclaimed. |
| Protocol-to-flow | pass | All 37 inbound/operation protocols + 4 event continuations have Step 9 IDs. |

## 7. Step 9 handoff

| Flow batch | Protocol IDs | Count | Exact input |
|---|---|---:|---|
| Commands | `CF-01~13` | 13 | Request/result schemas, target objects, errors, idempotency, Port/store calls allowed. |
| Queries | `QF-01~11` | 11 | Read keys/bundles/views/pages/dispositions; no UoW/Port. |
| Inbound | `IF-01~05` | 5 | Envelope/payload/receipt/dedup/quarantine/formal re-entry. |
| Outbound | `OF-01~04` | 4 | Exact source/material/payload/event identity/submission sequencing. |
| Jobs | `JF-01~04` | 4 | Bounded scope/cursor/watermark/output-ref/report semantics. |

Step 9 may not invent a DTO field, result carrier, repository/Port method or public disposition. A missing callable/read surface requires controlled reopen of Step 6/7/8.

Step 9 replay-constructability audit added the closed application carrier `StoredCommandValue` to the already-defined `StoredCommandResult`. This stores the exact body-free typed result snapshot rather than rebuilding it from later mutable truth. Public DTOs, Command inventory, business objects, stores and protocols are unchanged.

## 8. Completion conclusion

All five protocol families and shared public types are complete. The R-8 recalibration annex now provides one implementation card for every `13/11/5/4/4` protocol, without creating a second schema authority. No unresolved public schema, construction, naming, metadata, pagination, replay or protocol-to-flow conflict remains. Open upstream contracts only block positive external integration paths and are fully representable as public blocked/unavailable/gap behavior.

```text
step_status = recalibration_completed
current_batch = completed
gate_status = pass
gate_reason = all 37 protocols have independent closure cards in R-8, each tied to one canonical DTO authority, field provenance, mapper/factory, exact Store/Port seam, Step 9 flow, version/error/replay rule, forbidden boundary, fake/durable parity and reopen condition; cross-protocol audit has no unresolved conflict
next_allowed_action = create_R-9_function_flow_recalibration_annex
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
